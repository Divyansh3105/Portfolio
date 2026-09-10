import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { sound } from "../lib/sound";
import { skillGroups } from "../data/site";
import { BrandMark } from "./BrandIcons";
import { Spider, WebCorner } from "./WebDecor";

/**
 * The toolkit, as its own section.
 *
 * This used to be a row of inline chips at the foot of About, where it read
 * as an afterthought to the bio. Given its own ground it becomes a bento of
 * three competence areas, each tile carrying the real brand mark.
 *
 * Marks sit grey until hovered, then bloom into their own colours - the same
 * move the hero portrait makes with its grayscale-to-colour mask, so a wall
 * of vendor logos never fights the bone/ink/blood palette at rest.
 *
 * Entrance and ambient float follow the discipline the rest of the site
 * uses: the tiles converge on the grid from random directions, and only once
 * that timeline finishes does the float take over. Both touch `y`, which is
 * safe precisely because they never run at the same time.
 */
export default function Skills() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion();

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 74%", once: true },
        defaults: { ease: "power3.out" },
      });

      tl.from(".skills-head", {
        y: 26,
        opacity: 0,
        duration: 0.8,
        stagger: 0.09,
      })
        .from(
          ".skill-card",
          { y: 34, opacity: 0, duration: 0.75, stagger: 0.1 },
          "-=0.45",
        )
        // Tiles converge on their slots from every direction at once. The
        // stagger is capped: two dozen tiles at a per-tile delay long enough
        // to read on six would run for seconds.
        .addLabel("tiles", "-=0.4")
        .from(
          ".skill-tile",
          {
            scale: 0.4,
            opacity: 0,
            // Evaluated per tile, so each arrives from its own direction
            // rather than all of them from one shared offset.
            x: () => gsap.utils.random(-120, 120),
            y: () => gsap.utils.random(-70, 70),
            rotate: () => gsap.utils.random(-40, 40),
            duration: 0.85,
            stagger: { each: 0.03, amount: 0.85, from: "random" },
            ease: "back.out(1.4)",
          },
          "tiles",
        );

      const startAmbient = () => {
        // Each tile floats on its own cycle, so the grid never reads as one
        // repeating mechanical pattern.
        gsap.utils.toArray(".skill-tile").forEach((tile) => {
          gsap.to(tile, {
            y: gsap.utils.random(-7, -3),
            duration: gsap.utils.random(2.6, 3.8),
            delay: gsap.utils.random(0, 1.2),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

        gsap.to(".skills-bg-web", {
          rotation: 360,
          duration: 240,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });
      };

      if (reduced) tl.progress(1);
      else tl.call(startAmbient);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={root}
      className="relative overflow-hidden border-t border-ash bg-paper py-24 md:py-36"
    >
      <WebCorner
        corner="tr"
        size={300}
        className="skills-bg-web !-right-12 !-top-8 text-blood/12"
      />

      <div className="relative mx-auto max-w-[112rem] px-5 sm:px-8">
        <div className="mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="skills-head label-mono mb-7 flex items-center gap-3 text-blood">
              <Spider size={16} withDragline />
              <span>Skills</span>
              <span className="h-px w-14 bg-blood/35" />
              <span className="text-ink/45">04</span>
            </p>
            <h2 className="skills-head display-tight text-[clamp(2.6rem,8vw,7rem)]">
              What I
              <br />
              <span className="italic text-blood">reach for.</span>
            </h2>
          </div>
          <p className="skills-head max-w-sm text-[0.95rem] leading-relaxed text-graphite">
            Three areas of competence rather than one flat wall of nouns. Every
            tool here is one I&apos;ve shipped something with &mdash; not one
            I&apos;ve read about.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="skill-card border border-ink/12 bg-bone/60 p-5 sm:p-6"
            >
              <p className="label-mono mb-5 flex items-center justify-between text-ink/45">
                <span>{group.title}</span>
                <span className="tabular-nums text-ink/25">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </p>

              <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-3">
                {group.items.map((skill) => (
                  <li key={skill}>
                    <span
                      onMouseEnter={() => sound.hover()}
                      className="skill-tile group flex h-full min-h-[5.25rem] cursor-default flex-col items-center justify-center gap-2 border border-ink/10 bg-paper px-2 py-3 text-center transition-colors duration-300 hover:border-blood/45"
                    >
                      {/* Fixed-height slot whether or not a mark exists, so
                          the three markless skills (SQL, Zustand, REST APIs)
                          keep their labels on the same line as the rest of
                          the row. Grey at rest, true colours on hover - the
                          hero's mask reveal, borrowed. */}
                      <span className="flex h-6 items-center justify-center">
                        <BrandMark
                          skill={skill}
                          size={24}
                          brandColor
                          className="grayscale opacity-65 transition duration-400 ease-web group-hover:opacity-100 group-hover:grayscale-0"
                        />
                      </span>
                      <span className="font-mono text-[0.6rem] leading-tight tracking-[0.06em] text-ink/70 transition-colors duration-300 group-hover:text-ink">
                        {skill}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
