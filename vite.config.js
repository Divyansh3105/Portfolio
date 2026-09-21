import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ogCacheKey, repoCount } from './scripts/build-facts.js'


/**
 * Cloudflare Web Analytics site token.
 *
 * Committed deliberately. This is not a secret - it identifies the site and
 * is readable in the page source of everything that uses it, including this
 * site once deployed. Keeping it here means the beacon works from a clean
 * clone and from any build host without a dashboard step to forget, which is
 * the failure this would otherwise have: an unset variable looks exactly like
 * nobody visiting. VITE_CF_BEACON_TOKEN overrides it if a separate property
 * is ever wanted for previews.
 */
const CF_BEACON_TOKEN = '0a447798cbdb4e3f9f269db18da4c49d'

/**
 * Cloudflare Web Analytics, injected into every built page.
 *
 * A plugin rather than the tag pasted into each of the three HTML shells:
 * one place, all three pages, and it can decline to emit anything.
 *
 * `type="module"` matches the snippet Cloudflare hands out. A classic
 * deferred script also works against the current beacon.min.js, but if they
 * ever ship real module syntax in it, loading it as a classic script breaks
 * with a parse error and reports nothing - so this follows the vendor.
 *
 * `apply: "build"` keeps it out of `vite dev`. The site is registered against
 * its Netlify hostname, so a beacon fired from localhost is rejected at the
 * far end anyway; all it would do is put a CORS error in the console on every
 * dev page load.
 */
function cloudflareAnalytics(token) {
  return {
    name: 'cloudflare-analytics',
    apply: 'build',
    transformIndexHtml() {
      if (!token) return
      return [
        {
          tag: 'script',
          attrs: {
            type: 'module',
            src: 'https://static.cloudflareinsights.com/beacon.min.js',
            'data-cf-beacon': JSON.stringify({ token }),
          },
          injectTo: 'body',
        },
      ]
    },
  }
}


/**
 * Rewrites the og:image and twitter:image cache key to the image's content
 * hash, across every HTML shell. Previously a `?v=2` in six places that had
 * to be bumped by hand, in lockstep, or link previews went stale forever.
 */
function ogCacheBusting(key) {
  return {
    name: 'og-cache-busting',
    transformIndexHtml(html) {
      return html.replace(/og\.png\?v=[^"']*/g, `og.png?v=${key}`)
    },
  }
}


/**
 * Preloads the one face the first screenful is actually set in.
 *
 * Without this the browser cannot know the font exists until it has fetched
 * and parsed the stylesheet, found the @font-face and matched a unicode
 * range - so the request starts a full round trip late, and on a phone that
 * is the difference between text appearing and text swapping in. Preloading
 * starts it while the HTML is still being read.
 *
 * Only the upright display face. The italic is a handful of words and is not
 * what anyone is waiting to read, and preloading both would just have them
 * compete for the same bandwidth. `crossorigin` is required rather than
 * decorative: fonts are fetched anonymously, and a preload whose CORS mode
 * does not match the real request is ignored and fetched again.
 *
 * The filename is content-hashed, so it is read back out of the bundle
 * instead of written down - if it were written down it would be wrong the
 * first time the font changed, and silently: a preload for a file that no
 * longer exists fails quietly.
 */
function preloadDisplayFont(pattern) {
  return {
    name: 'preload-display-font',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      const file = Object.keys(ctx.bundle ?? {}).find((name) =>
        pattern.test(name),
      )
      if (!file) return
      return [
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: `/${file}`,
            crossorigin: '',
          },
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(async ({ isSsrBuild, mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    cloudflareAnalytics(
      loadEnv(mode, import.meta.dirname, '').VITE_CF_BEACON_TOKEN ||
        CF_BEACON_TOKEN,
    ),
    ogCacheBusting(await ogCacheKey()),
    preloadDisplayFont(/archivo-latin-wght-normal-[\w-]+\.woff2$/),
  ],
  // Resolved once per Vite invocation and baked into the bundle, so the
  // number costs a visitor nothing at runtime and cannot be forgotten.
  define: {
    __REPO_COUNT__: await repoCount(),
  },
  build: {
    // The SSR pass takes its entry from the command line, so the multi-page
    // input applies to the client build only - handing it both would make
    // Vite try to bundle the HTML shells for Node.
    rollupOptions: isSsrBuild
      ? {}
      : {
        // Multi-page build. The case studies are documents, not app routes,
        // so each gets its own entry instead of a router dependency bought
        // for two pages. Vite emits dist/<name>/index.html, served at
        // /<name>/.
        input: {
          main: resolve(import.meta.dirname, 'index.html'),
          gravlang: resolve(import.meta.dirname, 'gravlang/index.html'),
          talkspace: resolve(import.meta.dirname, 'talkspace/index.html'),
        },
      },
  },
  server: {
    // Vite does not read PORT on its own; honouring it lets a supervisor
    // assign a free port instead of Vite silently walking up from 5173.
    port: Number(process.env.PORT) || 5173,
  },
}))
