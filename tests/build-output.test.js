/**
 * Assertions about what the build actually publishes.
 *
 * These exist because the expensive failures here are silent ones. If the
 * prerender step stops injecting markup, every page still returns 200 and
 * still looks perfect in a browser — it is only crawlers, link unfurlers and
 * anything else that does not run JavaScript that sees an empty div, and
 * nobody finds out for months.
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import test, { before, describe } from "node:test";

const ROOT = resolve(import.meta.dirname, "..");

const PAGES = [
  { path: "dist/index.html", route: "/", marker: "Full-Stack Developer" },
  { path: "dist/gravlang/index.html", route: "/gravlang/", marker: "GravLang" },
  { path: "dist/talkspace/index.html", route: "/talkspace/", marker: "TalkSpace" },
];

const html = {};

before(async () => {
  for (const page of PAGES) {
    try {
      html[page.path] = await readFile(resolve(ROOT, page.path), "utf8");
    } catch {
      throw new Error(
        `${page.path} is missing — run \`npm run build\` before the tests.`,
      );
    }
  }
});

/**
 * Text a JavaScript-less client would see, with decoration stripped out.
 *
 * `joiner` matters more than it looks. Replacing a tag with a space is right
 * for measuring readable text, but it invents whitespace that is not in the
 * document: the heading `Talk<span>Space</span>` has no space in it and is
 * read as one word, so a word-level check has to strip tags to nothing.
 */
function textOf(source, joiner) {
  const body = source.slice(source.indexOf('<div id="root">'));
  return body
    .replace(/<svg[\s\S]*?<\/svg>/g, joiner)
    .replace(/<[^>]+>/g, joiner)
    .replace(/&[a-z]+;/g, joiner)
    .replace(/\s+/g, " ")
    .trim();
}

/** Readable text, for measuring how much of it there is. */
const visibleText = (source) => textOf(source, " ");

/** Tag-free text, for asking whether a specific word is present. */
const wordsOf = (source) => textOf(source, "");

describe("prerendering", () => {
  for (const page of PAGES) {
    test(`${page.route} ships real markup, not an empty root`, () => {
      const source = html[page.path];
      assert.doesNotMatch(
        source,
        /<div id="root"><\/div>/,
        "root is empty — the prerender step did not run or did not inject",
      );

      const text = visibleText(source);
      assert.ok(
        text.length > 2000,
        `only ${text.length} characters of text without JavaScript`,
      );
      assert.ok(
        wordsOf(source).includes(page.marker),
        `expected to find ${JSON.stringify(page.marker)} in the markup`,
      );
    });
  }

  test("/ names its author where a non-rendering scraper will find it", () => {
    // The specific thing prerendering was added for: a résumé scraper or a
    // link unfurler reading raw HTML.
    assert.match(visibleText(html["dist/index.html"]), /Divyansh\s+Garg/);
  });
});

describe("head metadata", () => {
  for (const page of PAGES) {
    test(`${page.route} carries a title, canonical and og:image`, () => {
      const source = html[page.path];
      assert.match(source, /<title>[^<]{10,}<\/title>/);
      assert.match(source, /<link rel="canonical" href="https:\/\/[^"]+"/);
      assert.match(source, /property="og:image" content="https:\/\/[^"]+"/);
    });
  }
});

describe("values the build derives", () => {
  test("no unsubstituted %VITE_% placeholder reaches the output", async () => {
    for (const page of PAGES) {
      assert.doesNotMatch(
        html[page.path],
        /%VITE_[A-Z_]+%/,
        `${page.route} shipped a literal env placeholder`,
      );
    }
  });

  test("every page busts og:image with the image's real content hash", async () => {
    const expected = createHash("sha256")
      .update(await readFile(resolve(ROOT, "public/og.png")))
      .digest("hex")
      .slice(0, 8);

    for (const page of PAGES) {
      const keys = [...html[page.path].matchAll(/og\.png\?v=([^"']*)/g)].map(
        (m) => m[1],
      );
      assert.ok(keys.length >= 2, `${page.route} should tag og and twitter`);
      // Every occurrence, not just the first: these used to be bumped by hand
      // in six places, and the failure was always one of them being missed.
      for (const key of keys) assert.equal(key, expected);
    }
  });

  test("the repo count is a real number, not a placeholder", () => {
    const text = visibleText(html["dist/index.html"]);
    const match = text.match(/(\d+) of (\d+) public repositories/);
    assert.ok(match, "the work section should state a repository count");

    const [, shown, total] = match.map(Number);
    assert.ok(total > 0 && Number.isInteger(total));
    assert.ok(
      shown <= total,
      `claims to show ${shown} of ${total}, which cannot be right`,
    );
  });
});

describe("analytics", () => {
  test("the beacon is injected once per page with a well-formed token", () => {
    for (const page of PAGES) {
      const tags = [
        ...html[page.path].matchAll(/data-cf-beacon="([^"]*)"/g),
      ].map((m) => m[1]);

      assert.equal(tags.length, 1, `${page.route} should carry one beacon`);
      const token = JSON.parse(tags[0].replaceAll("&quot;", '"')).token;
      assert.match(token, /^[0-9a-f]{32}$/, "token is not a CF site token");
    }
  });
});

describe("the code specimen", () => {
  test("real source is on the home page, not just claims about it", () => {
    // Tag-free, because each keyword is wrapped in its own span for colour -
    // so `def _add_sub` is never contiguous in the raw markup even though it
    // is exactly what the page displays.
    const code = wordsOf(html["dist/index.html"]);
    // Verbatim from gravlang/core/parser.py. If this drifts from the repo it
    // should be corrected there and here, not quietly reworded to fit.
    assert.ok(code.includes("def _add_sub(self):"), "signature missing");
    assert.ok(code.includes("ast.BinOp(left=left"), "node construction missing");
  });

  test("it is prerendered, so it reads as code without JavaScript", () => {
    // Which also means the home page carries the words a search engine would
    // need to believe there is engineering here, not only design.
    const text = wordsOf(html["dist/index.html"]);
    assert.ok(text.includes("_mul_div"), "the snippet should be in the markup");
    assert.match(text, /Recursive descent/);
  });

  test("it sends the reader on to the case study", () => {
    assert.match(html["dist/index.html"], /href="\/gravlang\/"/);
  });
});

describe("fonts", () => {
  test("no page reaches out to Google for them", () => {
    // Self-hosting is the whole point; a stray link would quietly reinstate
    // two third-party origins, two handshakes, and the privacy cost.
    for (const page of PAGES) {
      assert.doesNotMatch(
        html[page.path],
        /fonts\.(googleapis|gstatic)\.com/,
        `${page.route} still loads fonts from Google`,
      );
    }
  });

  test("each page preloads the display face, with crossorigin", () => {
    for (const page of PAGES) {
      const preloads = [
        ...html[page.path].matchAll(/<link rel="preload"[^>]*as="font"[^>]*>/g),
      ].map((m) => m[0]);

      assert.equal(
        preloads.length,
        1,
        `${page.route} should preload exactly one face, not ${preloads.length}`,
      );
      // Without crossorigin the preload does not match the real anonymous
      // font request, so the browser ignores it and downloads the file twice.
      assert.match(preloads[0], /crossorigin/);
      assert.match(preloads[0], /href="\/assets\/[^"]+\.woff2"/);
    }
  });

  test("the preloaded file is one the build actually emitted", async () => {
    const href = html["dist/index.html"].match(
      /<link rel="preload"[^>]*as="font"[^>]*href="([^"]+)"/,
    )[1];
    // A hardcoded filename would go stale the moment the font changed, and a
    // preload for a missing file fails silently.
    await readFile(resolve(ROOT, "dist", href.replace(/^\//, "")));
  });
});

describe("the error page", () => {
  test("404.html is published and asks not to be indexed", async () => {
    const source = await readFile(resolve(ROOT, "dist/404.html"), "utf8");
    assert.match(source, /name="robots" content="noindex"/);
    // Self-contained on purpose: it must not depend on a hashed bundle that
    // will not exist the next time the site is rebuilt.
    assert.doesNotMatch(source, /\/assets\//);
    // Which rules out the bundled webfonts too, so it must not ask for them
    // from anywhere else either.
    assert.doesNotMatch(source, /fonts\.(googleapis|gstatic)\.com/);
  });
});
