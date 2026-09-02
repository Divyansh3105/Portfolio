import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "../lib/gsap";

/**
 * Ambient drifting node mesh — carried over from the previous build's canvas,
 * with the changes it needed:
 *
 *  - it respects `prefers-reduced-motion` and skips touch devices entirely,
 *  - it renders at device pixel ratio, so the threads aren't soft on retina,
 *  - it stops its rAF loop while the tab is hidden instead of burning frames,
 *  - it sizes to its container rather than the window. In the old build the
 *    canvas was a fixed, full-page layer at z-0 underneath sections that all
 *    paint an opaque background, so it was never actually visible. Scoped to
 *    the hero it sits behind the one composition with room for it.
 */

const MOUSE_RADIUS = 165;

export default function WebMesh({ className = "" }) {
  const canvas = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return;

    const el = canvas.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    let width = host.clientWidth;
    let height = host.clientHeight;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = host.clientWidth;
      height = host.clientHeight;
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = Math.min(Math.floor(Math.min(width, height) / 24), 34);
    const linkDistance = 135;
    const nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.2 + 0.8,
    }));

    // Parked off-canvas until the pointer actually arrives, so the tethered
    // threads don't fan out from the centre before anyone has moved a mouse.
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };

    const draw = () => {
      // Ease toward the real pointer so the threads lag slightly behind it
      // rather than snapping frame to frame.
      mouse.x += (mouse.tx - mouse.x) * 0.03;
      mouse.y += (mouse.ty - mouse.y) * 0.03;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];

        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(193, 15, 27, 0.2)";
        ctx.fill();

        const dm = Math.hypot(mouse.x - a.x, mouse.y - a.y);
        if (dm < MOUSE_RADIUS) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(193, 15, 27, ${(1 - dm / MOUSE_RADIUS) * 0.24})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }

        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const d = Math.hypot(b.x - a.x, b.y - a.y);
          if (d < linkDistance) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(10, 10, 10, ${(1 - d / linkDistance) * 0.1})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      frame = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      const box = host.getBoundingClientRect();
      mouse.tx = e.clientX - box.left;
      mouse.ty = e.clientY - box.top;
      // First sighting: jump rather than sweep in from off-canvas.
      if (mouse.x < -900) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (prefersReducedMotion() || !hasFinePointer()) return null;

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
