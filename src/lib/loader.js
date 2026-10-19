/**
 * Dismisses the loading screen in src/loader.html.
 *
 * `ready` resolves when the curtain starts to lift, so the hero can begin its
 * entrance as the page is revealed instead of playing out behind the cover.
 * It resolves immediately when there is no loader to wait for: on the server,
 * or when it was skipped for this session (public/boot.js).
 *
 * The screen waits for the page's own load event and the webfonts, but never
 * shows for less than MIN_MS in total (so it reads as a beat, not a flash)
 * or more than MAX_MS (so a slow third-party script cannot hold the site).
 */
const MIN_MS = 1100;
const MAX_MS = 4000;

export const ready =
  typeof document === "undefined"
    ? Promise.resolve()
    : new Promise((resolve) => {
        const el = document.getElementById("loader");
        if (!el || getComputedStyle(el).display === "none") {
          resolve();
          return;
        }

        const loaded =
          document.readyState === "complete"
            ? Promise.resolve()
            : new Promise((done) =>
                window.addEventListener("load", done, { once: true }),
              );

        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          el.classList.add("is-done");
          try {
            sessionStorage.setItem("loaded", "1");
          } catch {
            // Storage blocked: the loader will simply show again next page.
          }
          // transitionend does not fire when reduced motion trims the
          // transition to nothing, so the removal has its own timer.
          setTimeout(() => el.remove(), 1000);
          resolve();
        };

        Promise.race([
          Promise.all([loaded, document.fonts?.ready]),
          new Promise((stalled) => setTimeout(stalled, MAX_MS)),
        ]).then(() =>
          setTimeout(finish, Math.max(0, MIN_MS - performance.now())),
        );
      });
