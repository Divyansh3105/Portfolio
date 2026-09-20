import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root')
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The built HTML ships with this tree already rendered into #root by
// scripts/prerender.js, so production hydrates it rather than throwing it
// away and rebuilding it. The dev server serves the shell unrendered - there
// is nothing there to hydrate, and asking React to try only produces a
// mismatch - so dev mounts normally.
if (import.meta.env.DEV) {
  createRoot(container).render(tree)
} else {
  hydrateRoot(container, tree)
}
