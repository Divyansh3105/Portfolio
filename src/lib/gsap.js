import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Mobile browsers (and any tab a visitor backgrounds mid-load) aggressively
 * suspend rAF while hidden. GSAP's default lag-smoothing tries to "catch up"
 * gracefully after a long stall, but a stall long enough can leave a
 * transform-based tween's render skipped on the affected properties even
 * though the tween itself reports complete. Disabling lag smoothing makes
 * every resumed frame apply its real elapsed time literally instead of
 * attempting that catch-up heuristic, which is the fix GSAP's own docs
 * recommend for exactly this class of bug.
 */
gsap.ticker.lagSmoothing(0);

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      // Force one immediate re-render so anything left visually stale from
      // the stall snaps to its true current state right away, rather than
      // waiting for the next natural tween update.
      gsap.ticker.tick();
    }
  });
}

/** True when the visitor has asked the OS to tone motion down. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True for mouse/trackpad pointers — used to gate cursor-driven effects. */
export const hasFinePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches;

export { gsap, ScrollTrigger };
