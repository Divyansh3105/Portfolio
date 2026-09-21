/**
 * The built site, in a real browser.
 *
 * Two things only a browser can tell us. First, whether the pages hydrate
 * cleanly — prerendering means React adopts existing markup rather than
 * building it, and the ways that goes wrong (a mismatch, a ref that is null
 * on the first render) produce a console error and a half-working page, not a
 * build failure. Second, whether the contact form still sends, which is the
 * bug this project has actually had: an earlier build reported success even
 * when the request failed, and quietly lost every message.
 *
 * Hermetic on purpose. Every request that is not to the local server is
 * aborted, so no test depends on Google Fonts, Cloudflare or EmailJS being
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
    try {
      await page.goto(`${origin}/`, { waitUntil: "load" });
      await page.locator("#work").scrollIntoViewIfNeeded();
      await page.locator(".work-row button").first().click();

      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: "visible", timeout: 5000 });
      await assertLink(dialog, "/talkspace/");
    } finally {
      await context.close();
    }
  });
});

async function assertLink(scope, href) {
  const count = await scope.locator(`a[href="${href}"]`).count();
  assert.equal(count, 1, `expected exactly one link to ${href}`);
}

describe("the contact form", () => {
  /** Replaces fetch before any app code runs, and records what it was given. */
  const stubFetch = (page) =>
    page.addInitScript(() => {
      window.__sent = [];
      window.fetch = (url, options) => {
        window.__sent.push({ url: String(url), body: options?.body });
        return Promise.resolve(new Response("OK", { status: 200 }));
      };
    });

  async function fillAndSubmit(page, { honeypot } = {}) {
    await page.goto(`${origin}/`, { waitUntil: "load" });
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.fill("#contact-name", "Ada Lovelace");
    await page.fill("#contact-email", "ada@example.com");
    await page.fill("#contact-message", "Do you have time for a role?");
    if (honeypot) {
      // A person cannot reach this field, so neither can a normal fill().
      await page.locator("#contact-company").evaluate((el, value) => {
        const setter = Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(el),
          "value",
        ).set;
        setter.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }, honeypot);
    }
    await page.locator('#contact form button[type="submit"]').click();
    await page.waitForTimeout(800);
  }

  test("a real message reaches the mail endpoint", async () => {
    const { page, context } = await openPage();
    try {
      await stubFetch(page);
      await fillAndSubmit(page);

      const sent = await page.evaluate(() => window.__sent);
      assert.equal(sent.length, 1, "exactly one request should be made");
      assert.match(sent[0].url, /api\.emailjs\.com/);

      const params = JSON.parse(sent[0].body).template_params;
      assert.equal(params.from_name, "Ada Lovelace");
      assert.equal(params.from_email, "ada@example.com");
      assert.equal(
        params.company,
        undefined,
        "the honeypot must not be forwarded to the mail template",
      );
    } finally {
      await context.close();
    }
  });

  test("a filled honeypot sends nothing at all", async () => {
    const { page, context } = await openPage();
    try {
      await stubFetch(page);
      await fillAndSubmit(page, { honeypot: "AcmeSpamCo" });

      assert.deepEqual(
        await page.evaluate(() => window.__sent),
        [],
        "a trapped submission must not reach the network",
      );
      // It should still look like success, so the bot learns nothing.
      await page.locator("#contact").getByText("Thread sent.").waitFor({
        state: "visible",
        timeout: 3000,
      });
    } finally {
      await context.close();
    }
  });

  test("a failed send is reported, not swallowed", async () => {
    // The regression this project actually had: the old build showed success
    // no matter what came back, so undelivered messages vanished silently.
    const { page, context } = await openPage();
    try {
      await page.addInitScript(() => {
        window.fetch = () =>
          Promise.resolve(new Response("nope", { status: 500 }));
      });
      await fillAndSubmit(page);

      const alert = page.locator('#contact [role="alert"]');
      await alert.waitFor({ state: "visible", timeout: 3000 });
      assert.match(await alert.innerText(), /didn.t send/i);
    } finally {
      await context.close();
    }
  });
});
