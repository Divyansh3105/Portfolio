import { useEffect, useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "../lib/gsap";

/* This is a client-only, non-SSR app, so reading matchMedia directly during
   render (rather than via useState+useEffect) never risks a hydration
   mismatch, and the value never needs to change after mount. */
const enabled = () => hasFinePointer() && !prefersReducedMotion();

/**
 * A small trailing ring that swells over anything clickable. Mouse/trackpad
 * only — touch devices and reduced-motion users never render it, and the
 * native cursor is left alone in those cases.
 */
export default function Cursor() {
  const ring = useRef(null);
  const dot = useRef(null);

  useEffect(() => {
    if (!enabled()) return;

    const ctx = gsap.context(() => {
      gsap.set([ring.current, dot.current], {
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
      });

      const ringX = gsap.quickTo(ring.current, "x", {
        duration: 0.45,
        ease: "power3",
      });
      const ringY = gsap.quickTo(ring.current, "y", {
        duration: 0.45,
        ease: "power3",
      });
      const dotX = gsap.quickTo(dot.current, "x", {
        duration: 0.1,
        ease: "power2",
      });
      const dotY = gsap.quickTo(dot.current, "y", {
        duration: 0.1,
        ease: "power2",
      });

      let shown = false;
      let wasInteractive = false;
      // Difference blending keeps the ring readable on both the light and
      // the dark half of the page, so only the scale needs to change here.
      const scaleTo = gsap.quickTo(ring.current, "scale", {
        duration: 0.4,
        ease: "power3.out",
      });

      const onMove = (e) => {
        if (!shown) {
          shown = true;
          gsap.to([ring.current, dot.current], {
            opacity: 1,
            duration: 0.4,
          });
        }
        ringX(e.clientX);
        ringY(e.clientY);
        dotX(e.clientX);
        dotY(e.clientY);

        // Re-target the scale tween only on an actual enter/leave of an
        // interactive element, not on every one of the dozens of mousemove
        // events fired per second while the pointer glides across the page.
        const interactive = !!e.target.closest?.(
          "a, button, [role='button'], input, textarea",
        );
        if (interactive !== wasInteractive) {
          wasInteractive = interactive;
          scaleTo(interactive ? 2.1 : 1);
        }
      };

      const onLeave = () =>
        gsap.to([ring.current, dot.current], { opacity: 0, duration: 0.25 });

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);

      return () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => ctx.revert();
  }, []);

  if (!enabled()) return null;

  return (
    <>
      <span
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[999] block h-8 w-8 rounded-full border border-paper/60 mix-blend-difference"
      />
      <span
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[999] block h-1.5 w-1.5 rounded-full bg-blood"
      />
    </>
  );
}
