import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


/**
 * Cloudflare Web Analytics, injected into every page at build time.
 *
 * A plugin rather than the tag pasted into each of the three HTML shells,
 * for one reason: it emits nothing when no token is configured. The `%VITE_%`
 * substitution Vite does in index.html leaves the placeholder text in place
 * when a variable is unset, so a CI build - which has no .env - would ship a
 * beacon tag whose token is the literal string `%VITE_CF_BEACON_TOKEN%`.
 *
 * The token is not a secret; it identifies the site and is visible in the
 * HTML of every site that uses this. It lives in the environment so it can
 * differ between a local build and production, not to hide it.
 */
function cloudflareAnalytics(token) {
  return {
    name: 'cloudflare-analytics',
    transformIndexHtml() {
      if (!token) return
      return [
        {
          tag: 'script',
          attrs: {
            defer: true,
            src: 'https://static.cloudflareinsights.com/beacon.min.js',
            'data-cf-beacon': JSON.stringify({ token }),
          },
          injectTo: 'body',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild, mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // Third argument '' so the token is read without needing a VITE_ prefix
    // rule change here; it is prefixed anyway for consistency with the rest.
    cloudflareAnalytics(loadEnv(mode, import.meta.dirname, '').VITE_CF_BEACON_TOKEN),
  ],
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
