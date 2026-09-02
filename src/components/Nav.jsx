import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { sound } from "../lib/sound";
import { nav, profile } from "../data/site";
import { FileIcon, SoundOffIcon, SoundOnIcon } from "./Icons";
import { Spider } from "./WebDecor";

export default function Nav() {
  const root = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [audible, setAudible] = useState(sound.enabled);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.from(".nav-item", {
        y: -18,
        opacity: 0,
        duration: 0.9,
        delay: 1.15,
        stagger: 0.07,
        ease: "power3.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /**
   * Scroll spy, carried over from the previous build but reworked: that one
   * ran an unthrottled scroll listener that measured `offsetTop` on every
   * section on every scroll event. An IntersectionObserver gets the same
   * answer from the browser for free.
   */
  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);
    if (!sections.length) return;

    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        // Whichever tracked section currently occupies the most of the
        // viewport wins; if none does, no link is marked.
        let best = null;
        let bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        setActive(bestRatio > 0.12 ? best : null);
      },
      { threshold: [0, 0.12, 0.35, 0.6, 0.9], rootMargin: "-15% 0px -35% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => sound.subscribe(setAudible), []);

  return (
    <>
      <header ref={root} className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="mx-auto flex max-w-[112rem] items-center justify-between px-5 py-5 sm:px-8 md:py-7">
          <a
            href="#top"
            onClick={() => sound.click()}
            className="nav-item group flex items-center gap-2.5 text-paper"
          >
            <Spider
              size={17}
              withDragline
              className="transition-transform duration-500 ease-web group-hover:rotate-12"
            />
            <span className="label-mono">
              {profile.first}
              <span className="opacity-45">/</span>
              {profile.last}
            </span>
          </a>

          <nav className="hidden items-center gap-9 md:flex">
            {nav.map((item) => {
              const current = active === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "true" : undefined}
                  onClick={() => sound.click()}
                  onMouseEnter={() => sound.hover()}
                  className={`nav-item label-mono group relative transition-colors duration-300 hover:text-paper ${
                    current ? "text-paper" : "text-paper/85"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-paper transition-[width] duration-500 ease-web group-hover:w-full ${
                      current ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.click()}
              onMouseEnter={() => sound.hover()}
              className="nav-item label-mono hidden items-center gap-2 border border-paper/30 px-3.5 py-2 text-paper transition-colors duration-300 hover:border-paper sm:inline-flex"
            >
              <FileIcon size={14} />
              <span>Résumé</span>
            </a>

            <button
              type="button"
              aria-pressed={audible}
              aria-label={audible ? "Mute interface sound" : "Enable interface sound"}
              title={audible ? "Mute interface sound" : "Enable interface sound"}
              onClick={() => sound.toggle()}
              className="nav-item flex h-9 w-9 items-center justify-center border border-paper/30 text-paper transition-colors duration-300 hover:border-paper"
            >
              {audible ? <SoundOnIcon size={15} /> : <SoundOffIcon size={15} />}
            </button>

            <a
              href="#contact"
              onClick={() => sound.click()}
              onMouseEnter={() => sound.hover()}
              className="nav-item label-mono hidden text-paper lg:inline-block"
            >
              <span className="border-b border-paper/40 pb-1 transition-colors duration-300 hover:border-paper">
                Get in touch
              </span>
            </a>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => {
                sound.click();
                setOpen((v) => !v);
              }}
              className="nav-item flex h-9 w-9 flex-col items-center justify-center gap-[5px] text-paper md:hidden"
            >
              <span
                className={`h-px w-6 bg-current transition-transform duration-400 ease-web ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-6 bg-current transition-transform duration-400 ease-web ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside the header so it is not caught by the blend mode. */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-between bg-ink px-6 pb-10 pt-28 md:hidden">
          <ul className="flex flex-col gap-1">
            {nav.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display-tight flex items-baseline gap-4 py-3 text-[13vw] text-paper"
                >
                  <span className="label-mono text-blood-soft">0{i + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 border-t border-paper/15 pt-6">
            <p className="label-mono text-paper/40">
              {profile.first} {profile.last} &middot; {profile.role}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="label-mono flex items-center gap-2 border border-paper/30 px-5 py-3.5 text-paper"
              >
                <FileIcon size={15} />
                <span>Résumé</span>
              </a>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="label-mono flex-1 bg-blood px-5 py-3.5 text-center text-paper"
              >
                Get in touch
              </a>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center text-paper"
          >
            <span className="absolute h-px w-6 rotate-45 bg-current" />
            <span className="absolute h-px w-6 -rotate-45 bg-current" />
          </button>
        </div>
      )}
    </>
  );
}
