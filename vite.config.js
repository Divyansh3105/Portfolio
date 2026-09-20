import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Multi-page build. The case study is a document, not an app route, so
      // it gets its own entry instead of a router dependency bought for one
      // page. Vite emits dist/gravlang/index.html, served at /gravlang/.
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        gravlang: resolve(import.meta.dirname, 'gravlang/index.html'),
      },
    },
  },
  server: {
    // Vite does not read PORT on its own; honouring it lets a supervisor
    // assign a free port instead of Vite silently walking up from 5173.
    port: Number(process.env.PORT) || 5173,
  },
})
