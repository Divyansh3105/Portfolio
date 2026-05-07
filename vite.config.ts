import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Target modern browsers — reduces polyfill weight
    target: 'es2020',

    // Increase chunk-size warning threshold (Three.js is large by design)
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // Split vendor libs into separate cached chunks
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          if (id.includes('node_modules/@emailjs')) {
            return 'vendor-emailjs';
          }
          if (id.includes('node_modules/typed.js') || id.includes('node_modules/vanilla-tilt')) {
            return 'vendor-misc';
          }
        },
      },
    },
  },

  // Expose only the env vars your app actually uses
  envPrefix: 'VITE_',
})
