import { useEffect, useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "../lib/gsap";
import { profile } from "../data/site";
import portrait from "../assets/portrait.png";
import { Spider, WebCorner, WebDrape, WebOrb } from "./WebDecor";
import WebMesh from "./WebMesh";
import { sound } from "../lib/sound";
import { FileIcon } from "./Icons";

/**
 * Full-bleed opening composition.
 *
 * The portrait plate holds two stacked copies of the same photograph: a
 * desaturated base and, above it, a full-colour print masked by a soft circle
 * whose radius and centre are CSS custom properties. GSAP drives those
 * properties from the pointer, so the cursor wipes colour across the image
 * while the rest of the page stays still.
 */

/** How far outside the frame the pointer can stray before the reveal closes. */
const REVEAL_MARGIN = 110;

export default function Hero() {
  const root = useRef(null);
  const frame = useRef(null);
  const mask = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = root.current;
      const frameEl = frame.current;
      const maskEl = mask.current;
      let cleanup;
      const reduced = prefersReducedMotion();

      /* ---------- entrance ---------- */
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.15,
      });

      tl.set(el.querySelectorAll(".hero-anim"), { visibility: "visible" })
        .from(".hero-eyebrow", { yPercent: 120, opacity: 0, duration: 0.9 })
        .from(
          ".hero-line span",
          { yPercent: 118, duration: 1.25, stagger: 0.09 },
          "-=0.55",
        )
        .from(
          ".hero-rule",
          { scaleX: 0, duration: 1.1, ease: "expo.out" },
          "-=0.85",
        )
        .from(
          ".hero-sub",
          { y: 26, opacity: 0, duration: 0.9, stagger: 0.08 },
          "-=0.8",
        )
        .from(
          ".hero-cta",
          { y: 22, opacity: 0, duration: 0.8, stagger: 0.1 },
          "-=0.7",
        )
        .from(
          ".hero-plate",
          { yPercent: 14, opacity: 0, duration: 1.4, ease: "expo.out" },
          "-=1.1",
        )
        .from(
          ".hero-drape",
          { yPercent: -100, opacity: 0, duration: 1.6, ease: "expo.out" },
          "-=1.3",
        )
        .from(
          ".hero-webcorner",
          { opacity: 0, scale: 0.86, duration: 1.4, stagger: 0.12 },
          "-=1.4",
        )
        .from(
          ".hero-meta",
          { opacity: 0, y: 14, duration: 0.8, stagger: 0.06 },
          "-=1",
        );

      if (reduced) tl.progress(1);

      /* ---------- ambient, continuous ---------- */
      if (!reduced) {
        gsap.to(".hero-orb", {
          rotation: 360,
          duration: 150,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });
        gsap.to(".hero-plate-inner", {
          y: -14,
          duration: 5.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(".hero-scroll-dot", {
          y: 16,
          duration: 1.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      /* ---------- pointer-tracked reveal on the portrait ---------- */
      const setX = gsap.quickTo(maskEl, "--mx", {
        duration: 0.35,
        ease: "power3",
      });
      const setY = gsap.quickTo(maskEl, "--my", {
        duration: 0.35,
        ease: "power3",
      });
      const parallax = gsap.utils.toArray(".hero-parallax").map((node) => ({
        x: gsap.quickTo(node, "x", { duration: 1.1, ease: "power3" }),
        y: gsap.quickTo(node, "y", { duration: 1.1, ease: "power3" }),
        depth: Number(node.dataset.depth || 1),
      }));

      if (reduced) {
        /* No motion: just show the photograph in colour. */
        const box = frameEl.getBoundingClientRect();
        gsap.set(maskEl, {
          "--mx": `${box.width / 2}px`,
          "--my": `${box.height / 2}px`,
          "--r": `${box.height * 1.6}px`,
        });
      } else if (hasFinePointer()) {
        gsap.set(maskEl, { "--r": "0px" });

        let open = false;
        /* The listener sits on the whole section so the parallax still reads,
           but the mask itself is measured against the frame, so colour only
           ever appears inside the portrait. */
        const onMove = (e) => {
          const rect = el.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          parallax.forEach((p) => {
            p.x(nx * -34 * p.depth);
            p.y(ny * -24 * p.depth);
          });

          const box = frameEl.getBoundingClientRect();
          setX(e.clientX - box.left);
          setY(e.clientY - box.top);

          const near =
            e.clientX > box.left - REVEAL_MARGIN &&
            e.clientX < box.right + REVEAL_MARGIN &&
            e.clientY > box.top - REVEAL_MARGIN &&
            e.clientY < box.bottom + REVEAL_MARGIN;

          if (near !== open) {
            open = near;
            gsap.to(maskEl, {
              "--r": near ? `${box.width * 0.72}px` : "0px",
              duration: near ? 0.75 : 0.5,
              ease: near ? "expo.out" : "power3.out",
            });
          }
        };
        const onLeave = () => {
          open = false;
          gsap.to(maskEl, { "--r": "0px", duration: 0.5, ease: "power3.out" });
        };

        el.addEventListener("pointermove", onMove, { passive: true });
        el.addEventListener("pointerleave", onLeave);
        cleanup = () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      } else {
        /* No cursor to follow - wander the reveal across the portrait. */
        const box = frameEl.getBoundingClientRect();
        gsap.set(maskEl, { "--r": `${box.width * 0.58}px` });
        const drift = { t: 0 };
        gsap.to(drift, {
          t: Math.PI * 2,
          duration: 14,
          repeat: -1,
          ease: "none",
          onUpdate: () => {
            const b = frameEl.getBoundingClientRect();
            gsap.set(maskEl, {
              "--mx": `${b.width * (0.5 + 0.34 * Math.sin(drift.t))}px`,
              "--my": `${b.height * (0.5 + 0.3 * Math.sin(drift.t * 2))}px`,
            });
          },
        });
      }

      return () => cleanup?.();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative h-svh min-h-152 w-full overflow-hidden bg-bone"
    >
      {/* ---------------- background webs ---------------- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Live node mesh, tethering itself to the pointer. */}
        <WebMesh className="opacity-45" />

        <div className="hero-webcorner absolute inset-0 text-ink/15">
          <WebCorner corner="tl" size={420} className="-left-24! -top-24!" />
        </div>
        <div className="hero-webcorner absolute inset-0 text-blood/20">
          <WebCorner corner="tr" size={340} className="-right-16! -top-16!" />
        </div>
        {/* Wrapper owns the CSS centring; GSAP owns the transform on the svg. */}
        <div className="absolute right-[-18%] top-1/2 -translate-y-1/2">
          <WebOrb
            size={880}
            spokes={20}
            rings={11}
            data-depth="0.4"
            className="hero-orb hero-parallax block text-ink/10"
          />
        </div>
        <WebDrape
          width={1400}
          depth={190}
          strands={17}
          className="hero-drape absolute inset-x-0 top-0 h-48 w-full text-ink/16"
        />
      </div>

      {/* ---------------- portrait plate ---------------- */}
      <div
        data-depth="1.5"
        className="hero-plate hero-parallax pointer-events-none absolute right-[5vw] top-[13vh] w-34 sm:w-44 lg:top-[16vh] lg:w-52 xl:w-60"
      >
        <div className="hero-plate-inner relative">
          <div className="absolute -inset-3 border border-ink/15" />
          <div className="absolute -left-3 -top-3 h-3 w-3 border-l border-t border-blood" />
          <div className="absolute -bottom-3 -right-3 h-3 w-3 border-b border-r border-blood" />

          <div
            ref={frame}
            className="relative aspect-4/5 w-full overflow-hidden bg-ash"
          >
            {/* Base print: drained of colour. */}
            <img
              src={portrait}
              alt={`${profile.first} ${profile.last}`}
              className="absolute inset-0 h-full w-full object-cover grayscale contrast-110 brightness-[0.97]"
            />

            {/* Colour print, revealed only where the mask circle sits. */}
            <div
              ref={mask}
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                "--mx": "0px",
                "--my": "0px",
                "--r": "0px",
                maskImage:
                  "radial-gradient(circle var(--r) at var(--mx) var(--my), #000 0%, #000 55%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle var(--r) at var(--mx) var(--my), #000 0%, #000 55%, rgba(0,0,0,0) 100%)",
              }}
            >
              <img
                src={portrait}
                alt=""
                className="absolute inset-0 h-full w-full object-cover saturate-[1.15]"
              />
              <span className="absolute inset-0 bg-blood/15 mix-blend-multiply" />
              <WebOrb
                size={300}
                spokes={12}
                rings={7}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-paper/35"
              />
            </div>
          </div>

          <p className="label-mono mt-3 flex items-center justify-between text-ink/55">
            <span>{profile.first}</span>
            <span className="text-blood">2026</span>
          </p>
        </div>
      </div>

      {/* ---------------- foreground type ---------------- */}
      <div className="pointer-events-none relative mx-auto flex h-full max-w-[112rem] flex-col justify-end px-5 pb-10 sm:px-8 md:pb-14">
        <p className="hero-eyebrow hero-anim label-mono invisible mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink/60">
          <Spider size={15} withDragline className="text-blood" />
          <span>{profile.location}</span>
          <span className="hidden h-px w-8 bg-ink/25 sm:block" />
          <span>{profile.status}</span>
        </p>

        <h1 className="hero-anim invisible">
          <span className="sr-only">
            {profile.first} {profile.last} &mdash; {profile.role}
          </span>
          {/* From lg up the portrait plate occupies the top right, so the
              name is sized to stop short of it rather than run underneath. */}
          <span
            aria-hidden="true"
            className="display-tight block text-[clamp(3.4rem,15.5vw,15.5rem)] text-ink lg:text-[clamp(3rem,12.4vw,12.5rem)]"
          >
            <span className="hero-line block overflow-hidden pb-[0.06em]">
              <span className="block">{profile.first}</span>
            </span>
            <span className="hero-line block overflow-hidden pb-[0.06em]">
              <span className="block">{profile.last}</span>
            </span>
          </span>
        </h1>

        <div className="hero-rule hero-anim invisible mt-6 h-px w-full origin-left bg-ink/20" />

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <p className="hero-sub hero-anim invisible max-w-md text-[0.95rem] leading-relaxed text-graphite sm:text-base">
            <span className="font-semibold text-ink">{profile.role}</span>{" "}
            <span className="text-ink/45">({profile.stack}).</span>{" "}
            {profile.tagline}
          </p>
          <p className="hero-sub hero-anim label-mono invisible text-ink/45">
            B.Tech CSE 2027 &middot; Graphic Era Hill University
          </p>
        </div>

        <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3">
          {/* The lift lives on the inner span, not the anchor itself: GSAP
              owns `transform` on `.hero-cta` for its entrance drop, and a
              second, CSS-transition-driven `transform` from a hover utility
              on that same element and property fights it -- once, briefly,
              during the overlap window, but it can leave the anchor's own
              transform permanently mis-set afterward. Moving the hover
              transform to a sibling GSAP never touches sidesteps the
              conflict entirely. */}
          <a
            href="#work"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="hero-cta hero-anim group invisible relative overflow-hidden bg-ink px-7 py-4 text-paper shadow-[0_0_0_0_rgba(10,10,10,0)] transition-shadow duration-300 ease-web hover:shadow-[0_14px_28px_-10px_rgba(10,10,10,0.45)]"
          >
            <span className="label-mono relative z-10 inline-block transition-transform duration-300 ease-web group-hover:-translate-y-1">
              Selected work
            </span>
            <span className="absolute inset-0 -translate-y-full bg-blood transition-transform duration-500 ease-web group-hover:translate-y-0" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="hero-cta hero-anim group invisible relative overflow-hidden border border-ink/25 px-7 py-4 text-ink shadow-[0_0_0_0_rgba(10,10,10,0)] transition-shadow duration-300 ease-web hover:shadow-[0_14px_28px_-10px_rgba(10,10,10,0.3)]"
          >
            <span className="label-mono relative z-10 inline-block transition-[transform,color] duration-300 ease-web group-hover:-translate-y-1 group-hover:text-paper">
              Hire me
            </span>
            <span className="absolute inset-0 -translate-x-full bg-ink transition-transform duration-500 ease-web group-hover:translate-x-0" />
          </a>
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="hero-cta hero-anim label-mono invisible flex items-center gap-2 border-b border-ink/25 pb-1 text-ink/70 transition-colors duration-300 hover:border-blood hover:text-blood"
          >
            <FileIcon size={14} />
            <span>Résumé</span>
          </a>
          <div className="hero-meta hero-anim invisible ml-auto hidden items-center gap-5 sm:flex">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="label-mono border-b border-ink/25 pb-1 text-ink/70 transition-colors duration-300 hover:border-blood hover:text-blood"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="label-mono border-b border-ink/25 pb-1 text-ink/70 transition-colors duration-300 hover:border-blood hover:text-blood"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* ---------------- scroll cue ---------------- */}
      <div className="hero-meta hero-anim invisible pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="label-mono text-ink/40">Scroll</span>
        <span className="relative block h-14 w-px bg-ink/20">
          <span className="hero-scroll-dot absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-blood" />
        </span>
      </div>
    </section>
  );
}
