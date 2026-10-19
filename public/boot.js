/* Runs before first paint. External rather than inline because the CSP allows
   scripts from this origin only.

   1. Applies a stored dark-mode choice, so a returning visitor never sees a
      light flash.
   2. Marks the session as already introduced, so the loading screen plays once
      per visit instead of on every page. src/lib/loader.js sets the flag. */
try {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.dataset.theme = "dark";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", "#0d0d0c");
  }
} catch {
  // Storage unavailable: stay on the default light theme.
}

try {
  if (sessionStorage.getItem("loaded")) {
    document.documentElement.dataset.loaded = "";
  }
} catch {
  // Session storage unavailable: show the loader.
}
