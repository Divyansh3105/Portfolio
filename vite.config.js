import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
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
