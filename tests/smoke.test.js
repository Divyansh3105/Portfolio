/**
 * The built site, in a real browser.
 *
 * What only a browser can tell us: whether the pages hydrate cleanly.
 * Prerendering means React adopts existing markup rather than building it,
 * and the ways that goes wrong (a mismatch, a ref that is null on the first
 * render) produce a console error and a half-working page, not a build
 * failure. And whether the work index still opens its dialogs.
 *
 * Hermetic on purpose. Every request that is not to the local server is
 * aborted, so no test depends on Cloudflare or a project's live host being
 * reachable, and no test can send real traffic to any of them.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import assert from "node:assert/strict";
import test, { after, before, describe } from "node:test";
import { chromium } from "playwright";

const DIST = resolve(import.meta.dirname, "../dist");

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

let server;
let browser;
let origin;

before(async () => {
  server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://x").pathname;
    const rel = normalize(url.endsWith("/") ? `${url}index.html` : url).replace(
      /^[\\/]+/,
      "",
    );
    try {
      const body = await readFile(join(DIST, rel));
      res.writeHead(200, {
        "Content-Type": TYPES[extname(rel)] ?? "application/octet-stream",
      });
      res.end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(await readFile(join(DIST, "404.html")).catch(() => "404"));
    }
  });

  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  origin = `http://127.0.0.1:${server.address().port}`;

  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  await new Promise((done) => server.close(done));
});

/**
 * A page with third parties blocked and its console captured.
 * `problems` collects console errors and uncaught exceptions alike.
 */
async function openPage() {
  const context = await browser.newContext();
  const page = await context.newPage();
  const problems = [];

  await page.route("**/*", (route) => {
    const url = route.request().url();
    return url.startsWith(origin) ? route.continue() : route.abort();
  });

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    // The route handler above aborts every third-party request, and the
    // browser reports each abort as a console error. Those are this harness
    // talking, not the page. Anything originating from our own origin - which
    // is where React's hydration warnings come from - is kept.
    const from = msg.location()?.url ?? "";
    if (from && !from.startsWith(origin)) return;
    problems.push(msg.text());
  });
  page.on("pageerror", (error) => problems.push(String(error)));

  return { page, context, problems };
}

describe("hydration", () => {
  for (const [route, heading] of [
    ["/", "DIVYANSH"],
    ["/gravlang/", "GRAVLANG"],
    ["/talkspace/", "TALKSPACE"],
    ["/playdex/", "PLAYDEX"],
  ]) {
    test(`${route} hydrates without console errors`, async () => {
      const { page, context, problems } = await openPage();
      try {
        await page.goto(`${origin}${route}`, { waitUntil: "load" });
        await page.waitForTimeout(1500); // let effects and GSAP settle

        assert.deepEqual(problems, [], `errors on ${route}`);
        assert.ok(
          (await page.locator("h1").innerText()).toUpperCase().includes(heading),
          `${route} should show ${heading}`,
        );
      } finally {
        await context.close();
      }
    });
  }

  test("the hero headline actually becomes visible", async () => {
    // It ships as `visibility: hidden` and is revealed by the GSAP timeline.
    // If that timeline ever throws, the page looks blank while the markup is
    // perfectly present — which no markup assertion would catch.
    const { page, context } = await openPage();
    try {
      await page.goto(`${origin}/`, { waitUntil: "load" });
      await page
        .locator(".hero-line span")
        .first()
        .waitFor({ state: "visible", timeout: 5000 });
    } finally {
      await context.close();
    }
  });
});

describe("the work index", () => {
  test("a project opens its dialog, and TalkSpace links to its case study", async () => {
    const { page, context } = await openPage();
    const woken = [];
    page.on("request", (req) => {
      if (req.url().includes("onrender.com")) woken.push(req.url());
    });
    try {
      await page.goto(`${origin}/`, { waitUntil: "load" });
      await page.locator("#work").scrollIntoViewIfNeeded();
      await page.locator(".work-row button").first().click();

      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: "visible", timeout: 5000 });
      await assertLink(dialog, "/talkspace/");
      // Opening the dialog pings the sleeping free-tier host awake.
      assert.equal(woken.length, 1, "TalkSpace's host should be pinged once");
    } finally {
      await context.close();
    }
  });
});

async function assertLink(scope, href) {
  const count = await scope.locator(`a[href="${href}"]`).count();
  assert.equal(count, 1, `expected exactly one link to ${href}`);
}
