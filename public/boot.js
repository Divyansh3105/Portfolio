/* Runs before first paint. External rather than inline because the CSP allows
   scripts from this origin only.

   Applies a stored dark-mode choice, so a returning visitor never sees a
   light flash. */
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
