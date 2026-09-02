import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { certifications, experience } from "../data/site";
import { Spider, WebCorner } from "./WebDecor";

/**
 * Experience and education, strung along a single silk line that draws itself
 * as the section scrolls. Each node drops onto the line with a short elastic
 * settle; the node on the current role keeps a slow pulse.
 */
export default function Path() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion();

      const head = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        defaults: { ease: "power3.out" },
      });
      head
        .from(".path-eyebrow", { y: 18, opacity: 0, duration: 0.6 })
        .from(
          ".path-title",
          {
            clipPath: "inset(0 0 105% 0)",
            yPercent: 14,
            duration: 1,
            ease: "expo.out",
          },
          "-=0.25",
        );
      if (reduced) head.progress(1);

      /* The thread draws itself in step with the scroll position. */
      const line = gsap.fromTo(
        ".path-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "50% 0%",
          ease: "none",
          scrollTrigger: {
            trigger: ".path-list",
            start: "top 78%",
            end: "bottom 72%",
            scrub: 0.6,
          },
        },
      );
      if (reduced) line.progress(1);

      gsap.utils.toArray(".path-entry").forEach((entry) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: entry, start: "top 82%", once: true },
        });
        tl.from(entry.querySelector(".path-node"), {
          scale: 0,
          y: -40,
          duration: 1.3,
          ease: "elastic.out(1, 0.5)",
        })
          .from(
            entry.querySelectorAll(".path-fade"),
            { y: 26, opacity: 0, duration: 0.8, stagger: 0.09 },
            "-=1.05",
          )
          .from(
            entry.querySelectorAll(".path-tag"),
            {
              scale: 0.5,
              opacity: 0,
              duration: 0.5,
              stagger: 0.05,
              ease: "back.out(2)",
            },
            "-=0.55",
          );
        if (reduced) tl.progress(1);
      });

      const certs = gsap.timeline({
        scrollTrigger: { trigger: ".path-certs", start: "top 88%", once: true },
      });
      certs.from(".path-cert", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });
      if (reduced) certs.progress(1);

      if (!reduced) {
        gsap.to(".path-node-live", {
          scale: 1.55,
          opacity: 0,
          duration: 2.2,
          repeat: -1,
          ease: "sine.out",
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="path"
      ref={root}
      className="relative overflow-hidden border-t border-ash bg-bone py-24 md:py-36"
    >
      <WebCorner
        corner="tr"
        size={300}
        className="!-right-12 !-top-8 text-blood/14"
      />

      <div className="relative mx-auto max-w-[112rem] px-5 sm:px-8">
        <div className="mb-16 md:mb-24">
          <p className="path-eyebrow label-mono mb-7 flex items-center gap-3 text-blood">
            <Spider size={16} withDragline />
            <span>Path</span>
            <span className="h-px w-14 bg-blood/35" />
            <span className="text-ink/45">03</span>
          </p>
          <h2 className="path-title display-tight text-[clamp(2.6rem,8vw,7rem)]">
            Where I&apos;ve
            <br />
            <span className="italic text-blood">been.</span>
          </h2>
        </div>

        <div className="path-list relative">
          {/* The silk line. */}
          <span
            aria-hidden="true"
            className="path-line absolute left-[7px] top-2 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-ink/60 via-ink/35 to-transparent md:block"
          />

          <ol className="space-y-14 md:space-y-20">
            {experience.map((item) => (
              <li
                key={item.org}
                className="path-entry relative grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-14 md:pl-12"
              >
                {/* Node on the line. */}
                <span
                  aria-hidden="true"
                  className="path-node absolute left-0 top-2 hidden h-[15px] w-[15px] items-center justify-center md:flex"
                >
                  <span
                    className={`block h-[9px] w-[9px] rotate-45 ${
                      item.current ? "bg-blood" : "bg-ink"
                    }`}
                  />
                  {item.current && (
                    <span className="path-node-live absolute inset-0 rounded-full border border-blood" />
                  )}
                </span>

                <div>
                  <p className="path-fade label-mono mb-3 text-blood">
                    {item.period}
                  </p>
                  <h3 className="path-fade display-tight text-[clamp(1.6rem,3.4vw,2.4rem)]">
                    {item.org}
                  </h3>
                  <p className="path-fade label-mono mt-3 text-ink/45">
                    {item.place}
                  </p>
                </div>

                <div className="md:pt-1">
                  <p className="path-fade font-mono text-[0.78rem] uppercase tracking-[0.14em] text-ink">
                    {item.role}
                  </p>
                  <p className="path-fade mt-4 max-w-xl text-[0.95rem] leading-[1.75] text-graphite">
                    {item.body}
                  </p>

                  {item.achievements?.length > 0 && (
                    <ul className="mt-5 max-w-xl space-y-2.5">
                      {item.achievements.map((point) => (
                        <li
                          key={point}
                          className="path-fade flex items-start gap-3 text-[0.88rem] leading-relaxed text-ink/70"
                        >
                          <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-blood" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="path-tag border border-ink/15 px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.06em] text-ink/60"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ---------------- certifications ---------------- */}
        <div className="path-certs mt-20 border-t border-ash pt-10">
          <p className="label-mono mb-6 text-ink/45">Certifications</p>
          <ul className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert) => (
              <li key={cert.name} className="path-cert flex items-start gap-3">
                <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-blood" />
                <span>
                  <span className="block text-[0.92rem] leading-snug text-ink/85">
                    {cert.name}
                  </span>
                  <span className="label-mono mt-1.5 block text-ink/45">
                    {cert.issuer} &middot; {cert.year}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
