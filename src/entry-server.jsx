import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import CaseStudy from "./components/CaseStudy.jsx";

/**
 * Build-time render of each page, consumed by scripts/prerender.js.
 *
 * Deliberately does not import index.css: the client build already emits and
 * links the stylesheet, and pulling it in here would only make Vite emit a
 * second, unreferenced copy.
 *
 * Nothing in the tree reads `window` during render — `prefersReducedMotion`
 * and `hasFinePointer` both return false without one, and the three places
 * that branched on them at render time now resolve after mount instead, so
 * this output matches what the client renders on its first pass.
 */
export const pages = {
  main: () =>
    renderToString(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  gravlang: () =>
    renderToString(
      <StrictMode>
        <CaseStudy />
      </StrictMode>,
    ),
};
