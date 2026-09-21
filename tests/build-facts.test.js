/**
 * The derived build numbers, and specifically the paths that only run when
 * something has gone wrong.
 *
 * The happy path is self-evident when it works. What needed pinning down is
 * that a build does not fail, hang or publish a nonsense number when GitHub
 * is unreachable, rate-limited, or answering with something unexpected.
 */
import { rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

const ROOT = resolve(import.meta.dirname, "..");
const CACHE = resolve(ROOT, "node_modules/.cache/build-facts.json");

/** The module memoises through a file, so each case starts from nothing. */
beforeEach(() => rm(CACHE, { force: true }));

/** Fresh import each time, so module-level state cannot leak between cases. */
async function load() {
  return import(`../scripts/build-facts.js?t=${Date.now()}`);
}

async function withFetch(impl, fn) {
  const real = globalThis.fetch;
  globalThis.fetch = impl;
  try {
    return await fn();
  } finally {
    globalThis.fetch = real;
  }
}

test("repoCount returns GitHub's number when the call succeeds", async () => {
  const { repoCount } = await load();
  const count = await withFetch(
    async () => ({ ok: true, json: async () => ({ public_repos: 31 }) }),
    repoCount,
  );
  assert.equal(count, 31);
});

test("repoCount falls back instead of throwing when the network fails", async () => {
  const { repoCount } = await load();
  const count = await withFetch(() => {
    throw new Error("simulated network failure");
  }, repoCount);
  // The exact fallback matters less than it being a usable number: a build
  // must not die, and the page must not render "undefined public repositories".
  assert.equal(typeof count, "number");
  assert.ok(Number.isInteger(count) && count > 0, `got ${count}`);
});

test("repoCount falls back on a rate-limit response", async () => {
  const { repoCount } = await load();
  // 403 is what the unauthenticated limit returns, and CI agents share an IP,
  // so this is the most likely failure in practice rather than a hypothetical.
  const count = await withFetch(
    async () => ({ ok: false, status: 403 }),
    repoCount,
  );
  assert.ok(Number.isInteger(count) && count > 0);
});

test("repoCount rejects an implausible payload rather than publishing it", async () => {
  const { repoCount } = await load();
  for (const public_repos of [undefined, null, -4, "many", 0]) {
    // eslint-disable-next-line no-await-in-loop
    const count = await withFetch(
      async () => ({ ok: true, json: async () => ({ public_repos }) }),
      repoCount,
    );
    assert.ok(
      Number.isInteger(count) && count > 0,
      `payload ${JSON.stringify(public_repos)} produced ${count}`,
    );
  }
});

test("the second caller is served from cache, so both build passes agree", async () => {
  const { repoCount } = await load();
  let calls = 0;

  const [first, second] = await withFetch(
    async () => {
      calls += 1;
      return { ok: true, json: async () => ({ public_repos: 42 }) };
    },
    async () => [await repoCount(), await repoCount()],
  );

  // This is the property that matters: `npm run build` runs Vite twice as
  // separate processes, and if the two disagreed the prerendered HTML would
  // not match what the client renders.
  assert.equal(first, second);
  assert.equal(calls, 1, "second call should not reach the network");
});

test("ogCacheKey is the content hash of the image it busts", async () => {
  const { ogCacheKey } = await load();
  const expected = createHash("sha256")
    .update(await readFile(resolve(ROOT, "public/og.png")))
    .digest("hex")
    .slice(0, 8);
  assert.equal(await ogCacheKey(), expected);
});
