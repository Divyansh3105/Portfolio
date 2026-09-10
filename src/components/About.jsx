import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { about } from "../data/site";
import portrait from "../assets/portrait.webp";
import { Spider, Thread, WebCorner, WebOrb } from "./WebDecor";

/**
 * Two-column about block.
 *
 * One master timeline drives the entrance in a fixed order: background webs
 * drop in, the eyebrow slides in from the left, the heading wipes up, the
 * portrait drops from the ceiling, then the paragraphs and stats tip into
 * place. Nothing loops until that timeline finishes -- the swing, the web
 * rotation and the glow pulse all start from a single callback at its end,
 * so the choreography never has to compete with ambient motion on the way
 * in.
 *
 * The toolkit used to close this section; it now has its own, in Skills.jsx.
 */
export default function About() {
  const root = useRef(null);
  const pendulum = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion();
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

      // Distances tuned per breakpoint so the drops read as real travel
      // without overshooting a short mobile viewport.
      const webDrop = isDesktop ? 150 : 70;
      const profileDrop = isDesktop ? -320 : -170;
      const eyebrowShift = isDesktop ? -80 : -50;
      const headingRise = isDesktop ? 14 : 22;

      /* ================= entrance ================= */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 72%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl
        // 1. Background webs drop from above.
        .addLabel("webs")
        .from(
          ".about-bg-web",
          {
            y: -webDrop,
            opacity: 0,
            duration: 1.6,
            stagger: 0.18,
            ease: "elastic.out(1, 0.55)",
          },
          "webs",
        )
        // 2. Eyebrow slides in from the left under a clip-path wipe.
        .addLabel("eyebrow", "webs+=0.55")
        .fromTo(
          ".about-eyebrow",
          { x: eyebrowShift, opacity: 0, clipPath: "inset(0 100% 0 0)" },
          {
            x: 0,
            opacity: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.85,
            ease: "power4.out",
          },
          "eyebrow",
        )
        // 3. Heading rises from below under its own clip-path reveal.
        .addLabel("heading", "eyebrow+=0.35")
        .from(
          ".about-heading-line",
          {
            clipPath: "inset(0 0 105% 0)",
            yPercent: headingRise,
            duration: 1.05,
            stagger: 0.13,
            ease: "expo.out",
          },
          "heading",
        )
        // 4. The portrait drops from the ceiling on its thread.
        .addLabel("profile", "heading+=0.3")
        .from(
          ".about-thread",
          {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 0.8,
            ease: "power2.in",
          },
          "profile",
        )
        .from(
          ".about-frame",
          { y: profileDrop, opacity: 0, duration: 1.9, ease: "elastic.out(1, 0.42)" },
          "profile+=0.18",
        )
        // 5. Paragraphs tip up into place, one after another.
        .addLabel("copy", "profile+=0.55")
        .from(
          ".about-copy p",
          {
            rotateX: -45,
            y: 40,
            opacity: 0,
            // Bottom-anchored so each line tips up toward the reader rather
            // than folding down away from them.
            transformOrigin: "50% 100%",
            duration: 1,
            stagger: 0.15,
            ease: "back.out(1.4)",
          },
          "copy",
        )
        .from(
          ".about-stat",
          { y: 24, opacity: 0, duration: 0.7, stagger: 0.09 },
          "copy+=0.5",
        );

      /* ================= ambient (starts once entrance finishes) ================= */
      const startAmbient = () => {
        // 6. The whole pendulum -- thread and frame -- keeps swinging.
        gsap.fromTo(
          pendulum.current,
          { rotation: -2.1 },
          {
            rotation: 2.1,
            transformOrigin: "50% 0%",
            duration: 4.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
        );

        // 7. Background webs turn slowly, forever.
        gsap.to(".about-bg-web", {
          rotation: 360,
          duration: 260,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });
        gsap.to(".about-bg-orb", {
          rotation: -360,
          duration: 190,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });

        // 8. A slow breathing glow behind the frame reads as a shadow pulse.
        gsap.to(".about-glow", {
          scale: 1.09,
          opacity: 0.75,
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Slow vertical drift as the section passes through the viewport.
        gsap.to(".about-bg-orb-wrap", {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      };

      if (reduced) {
        tl.progress(1);
      } else {
        tl.call(startAmbient);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={root}
      className="relative overflow-hidden border-t border-ash bg-bone py-24 md:py-36"
    >
      {/* ---------- low-opacity background webs ---------- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <WebCorner
          corner="tl"
          size={300}
          className="about-bg-web -left-14! -top-10! text-ink/12"
        />
        <WebCorner
          corner="tr"
          size={300}
          className="about-bg-web -right-14! -top-10! text-blood/14"
        />
        <div className="about-bg-orb-wrap absolute left-[-14%] bottom-[-18%]">
          <WebOrb
            size={620}
            spokes={16}
            rings={9}
            className="about-bg-orb block text-ink/7"
          />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[112rem] grid-cols-1 items-start gap-16 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-20 xl:gap-28">
        {/* ================= left: hanging portrait ================= */}
        <div className="relative flex justify-center">
          {/* Anchor bar the thread is tied to. */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-linear-to-r from-transparent via-ink/30 to-transparent"
          />

          <div
            ref={pendulum}
            className="relative flex w-full flex-col items-center"
          >
            <Thread className="about-thread h-24 md:h-32" />

            <div className="about-frame group relative isolate">
              {/* Breathing glow. */}
              <span
                aria-hidden="true"
                className="about-glow absolute inset-[-14%] -z-10 rounded-full bg-[radial-gradient(circle,var(--color-blood)_0%,transparent_66%)] opacity-30 blur-2xl"
              />

              <div className="relative aspect-square w-[16rem] overflow-hidden rounded-full border border-ink/12 sm:w-76 xl:w-92">
                <img
                  src={portrait}
                  alt="Divyansh Garg"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover grayscale contrast-110 transition-all duration-700 ease-web group-hover:scale-[1.04] group-hover:grayscale-0"
                />
                <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-paper/25" />
              </div>

              {/* Dashed orbit ring + a spider riding it. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="pointer-events-none absolute inset-[-7%] h-[114%] w-[114%] text-ink/18"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.35"
                  strokeDasharray="2 5"
                />
              </svg>

              <span className="label-mono absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-bone px-3 text-ink/50">
                Meerut &middot; India
              </span>
            </div>
          </div>
        </div>

        {/* ================= right: copy ================= */}
        <div className="lg:pt-6">
          <p className="about-eyebrow label-mono mb-8 flex items-center gap-3 text-blood">
            <Spider size={16} withDragline />
            <span>About</span>
            <span className="h-px w-14 bg-blood/35" />
            <span className="text-ink/45">01</span>
          </p>

          <h2 className="display-tight text-[clamp(1.9rem,4.6vw,4.4rem)] italic">
            {about.heading.map((line, i) => (
              <span
                key={line}
                className="about-heading-line block"
                style={{ color: i === 1 ? "var(--color-blood)" : undefined }}
              >
                {line}
              </span>
            ))}
          </h2>

          <div
            className="about-copy mt-9 max-w-2xl space-y-5 text-[0.98rem] leading-[1.75] text-graphite sm:text-[1.03rem]"
            style={{ perspective: "1000px" }}
          >
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <dl className="mt-11 flex flex-wrap gap-x-12 gap-y-6 border-y border-ash py-7">
            {about.stats.map((s) => (
              <div key={s.label} className="about-stat">
                <dt className="label-mono mb-1.5 text-ink/45">{s.label}</dt>
                <dd className="display-tight text-[2.1rem] leading-none">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
