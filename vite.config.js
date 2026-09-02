import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this repo under /<repo>/; the deploy workflow sets
  // VITE_BASE. Netlify and local dev leave it unset and serve from the root.
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  server: {
    // Vite does not read PORT on its own; honouring it lets a supervisor
    // assign a free port instead of Vite silently walking up from 5173.
    port: Number(process.env.PORT) || 5173,
  },
})
