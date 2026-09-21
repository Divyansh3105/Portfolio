/**
 * Numbers the build works out for itself, instead of someone remembering to
 * retype them.
 *
 * Both values here were previously literals that went stale silently: the
 * public repository count drifted the moment a repository was created, and
 * the link-preview cache key only changed if you remembered to bump it by
 * hand after replacing the image.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const GITHUB_USER = "Divyansh3105";

/**
 * Used when GitHub cannot be reached — an offline build, a network blip, or
 * the unauthenticated rate limit, which is per-IP and therefore shared with
 * every other project building on the same CI agent. A slightly stale number
 * is the right failure: it is what the site showed before, and the next
 * successful build corrects it.
 */
const FALLBACK_REPO_COUNT = 26;

/**
 * `npm run build` runs Vite twice — once for the client, once for SSR — and
 * each invocation is its own process, so each would otherwise make its own
 * request. That is wasteful, and worse, if one call succeeded and the other
 * fell back, the prerendered HTML would disagree with what the client renders
 * and React would have to patch the mismatch on hydration. Caching the answer
 * for a few minutes makes the two passes agree by construction.
 */
const CACHE = resolve(ROOT, "node_modules/.cache/build-facts.json");
const CACHE_TTL_MS = 10 * 60 * 1000;

async function readCache() {
  try {
    const { at, count } = JSON.parse(await readFile(CACHE, "utf8"));
    return Date.now() - at < CACHE_TTL_MS ? count : null;
  } catch {
    return null;
  }
}

async function writeCache(count) {
  try {
    await mkdir(resolve(ROOT, "node_modules/.cache"), { recursive: true });
    await writeFile(CACHE, JSON.stringify({ at: Date.now(), count }));
  } catch {
    // A cache that cannot be written is not a reason to fail a build.
  }
}

/** Public repository count, as GitHub currently reports it. */
export async function repoCount() {
  const cached = await readCache();
  if (cached !== null) return cached;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
      headers: { accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

    const { public_repos: count } = await res.json();
    if (!Number.isInteger(count) || count < 1) {
      throw new Error(`implausible count: ${JSON.stringify(count)}`);
    }

    await writeCache(count);
    return count;
  } catch (error) {
    console.warn(
      `build-facts: using fallback repo count ${FALLBACK_REPO_COUNT} (${error.message})`,
    );
    return FALLBACK_REPO_COUNT;
  }
}

/**
 * Short content hash of the link-preview image, used as its cache key.
 *
 * WhatsApp, LinkedIn and Slack cache og:image hard and offer no public purge,
 * so the URL has to change when the image does. Deriving the key from the
 * bytes means it changes exactly when the image changes, and never otherwise.
 */
export async function ogCacheKey() {
  const bytes = await readFile(resolve(ROOT, "public/og.png"));
  return createHash("sha256").update(bytes).digest("hex").slice(0, 8);
}
