import { useEffect, useRef } from "react";
import { gsap, useAnimatedPointer } from "../lib/gsap";
import { MARK_SKILLS } from "../lib/brands";
import { BrandMark } from "./BrandIcons";

/** How many trail marks exist. They are recycled, so this is also the cap. */
const TRAIL = MARK_SKILLS.length;
/** Pointer travel, in px, between one mark and the next. */
const STEP = 74;

/* Slots are assigned their skill once, at module load, so emitting a mark
   never touches React state - a trail that re-rendered the tree on every
   pointermove would cost far more than it is worth.

   The order here is fixed rather than shuffled: this markup is prerendered at
   build time, and a Math.random() at module load would deal a different hand
   in Node than in the browser, so the HTML being hydrated would not match.
   The shuffle now happens over slot *indices* inside the effect, which keeps
   the per-load variety it was there for without touching what is rendered. */
const TRAIL_SKILLS = MARK_SKILLS;

/** Fisher-Yates over 0..n-1. */
const shuffledSlots = (n) => {
  const out = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/**
 * A small trailing ring that swells over anything clickable. Mouse/trackpad
 * only — touch devices and reduced-motion users never render it, and the
 * native cursor is left alone in those cases.
 */
export default function Cursor() {
  const ring = useRef(null);
  const dot = useRef(null);
  const trail = useRef([]);
  // Nothing is rendered until there is a pointer to follow. That keeps 24
  // brand marks' worth of path data - the single largest block of markup on
  // the page - out of the prerendered HTML and out of touch devices' DOM,
  // where none of it was ever going to be seen.
  const on = useAnimatedPointer();

  /* Keyed on `on`, not []: while it is false this component renders null, so
     every ref below is still null and there is nothing to animate. The effect
     has to run on the pass where the marks actually mount. */
  useEffect(() => {
    if (!on) return;

    const ctx = gsap.context(() => {
      gsap.set([ring.current, dot.current, ...trail.current], {
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

      /* Marks are shed by distance travelled, not by time: a stationary
         pointer emits nothing, and a fast flick leaves a longer tail,
         which is what makes it read as a trail rather than a timer. */
      let lastX = null;
      let lastY = null;
      let travelled = 0;
      const order = shuffledSlots(TRAIL);
      let slot = 0;

      const shed = (x, y) => {
        const el = trail.current[order[slot]];
        slot = (slot + 1) % TRAIL;
        if (!el) return;

        gsap.killTweensOf(el);
        gsap.set(el, {
          x,
          y,
          opacity: 1,
          scale: 0.45,
          rotate: gsap.utils.random(-35, 35),
        });
        gsap.to(el, {
          x: x + gsap.utils.random(-52, 52),
          y: y + gsap.utils.random(46, 104),
          rotate: `+=${gsap.utils.random(-140, 140)}`,
          scale: gsap.utils.random(0.85, 1.15),
          opacity: 0,
          duration: gsap.utils.random(0.9, 1.5),
          ease: "power2.out",
        });
      };
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

        if (lastX !== null) {
          travelled += Math.hypot(e.clientX - lastX, e.clientY - lastY);
        }
        lastX = e.clientX;
        lastY = e.clientY;
        if (travelled >= STEP) {
          travelled = 0;
          shed(e.clientX, e.clientY);
        }

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
  }, [on]);

  if (!on) return null;

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

      {TRAIL_SKILLS.map((skill, i) => (
        <span
          key={skill}
          ref={(el) => (trail.current[i] = el)}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[998] block opacity-0"
        >
          <BrandMark skill={skill} size={27} brandColor />
        </span>
      ))}
    </>
  );
}
