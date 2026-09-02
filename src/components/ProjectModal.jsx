import { useCallback, useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { sound } from "../lib/sound";
import { CloseIcon, ExternalLink, GithubIcon } from "./Icons";
import ProjectPlate from "./ProjectPlate";

/**
 * Full specification for one project.
 *
 * The previous build had this idea and the right content — full description,
 * highlights, stack, live and source links — but rendered it as a plain div
 * with no dialog semantics: no focus management, no focus trap, and Escape
 * handled through a closure that captured a stale `handleClose`. This version
 * keeps the content and fixes all of that, in V2's type and palette.
 */
export default function ProjectModal({ project, onClose }) {
  const backdrop = useRef(null);
  const panel = useRef(null);
  const closer = useRef(null);
  const opener = useRef(null);
  const closing = useRef(false);

  /** Animate out, then unmount — guarded so a double-trigger can't stack. */
  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;

    if (prefersReducedMotion()) {
      onClose();
      return;
    }

    gsap
      .timeline({ onComplete: onClose })
      .to(panel.current, {
        scale: 0.97,
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: "power2.in",
      })
      .to(backdrop.current, { opacity: 0, duration: 0.25 }, "-=0.2");
  }, [onClose]);

  useEffect(() => {
    opener.current = document.activeElement;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    // Compensating for the vanished scrollbar stops the page behind the
    // modal from jolting sideways as it opens.
    document.body.style.paddingRight = `${scrollbar}px`;

    closer.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }

      if (e.key !== "Tab") return;

      // Keep focus inside the dialog while it is open.
      const focusable = panel.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.from(backdrop.current, { opacity: 0, duration: 0.35 });
      gsap.from(panel.current, {
        opacity: 0,
        scale: 0.96,
        y: 22,
        duration: 0.6,
        ease: "expo.out",
        delay: 0.05,
      });
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      opener.current?.focus?.();
      ctx.revert();
    };
  }, [close]);

  if (!project) return null;

  return (
    <div
      ref={backdrop}
      onClick={close}
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm sm:items-center md:p-8"
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-${project.id}`}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-4xl border border-ink/12 bg-paper shadow-[0_40px_80px_-24px_rgba(10,10,10,0.55)]"
      >
        {/* ---------------- header ---------------- */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ash bg-paper/95 px-5 py-4 backdrop-blur-sm sm:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="label-mono bg-blood px-2.5 py-1 text-paper">
              {project.category}
            </span>
            <span className="label-mono text-ink/45">{project.index}</span>
            <span className="label-mono text-ink/45">{project.year}</span>
          </div>

          <button
            ref={closer}
            type="button"
            aria-label="Close project details"
            onClick={() => {
              sound.click();
              close();
            }}
            onMouseEnter={() => sound.hover()}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink/15 text-ink transition-colors duration-300 hover:border-blood hover:bg-blood hover:text-paper"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* ---------------- body ---------------- */}
        <div className="flex flex-col gap-10 px-5 py-8 sm:px-8 md:px-10 md:py-10">
          {/* The index plate is cropped to 4:3 to sit in a row; here there is
              room for the whole shot, so it runs at its own ratio with none
              of the plate's caption chrome over it. */}
          <div className="relative">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.name} interface`}
                loading="lazy"
                decoding="async"
                className="block w-full border border-ink/10 bg-ink"
              />
            ) : (
              <ProjectPlate project={project} active />
            )}
            <span className="label-mono absolute bottom-4 right-4 bg-paper px-3 py-1.5 text-ink">
              {project.status}
            </span>
          </div>

          <div>
            <h2
              id={`modal-${project.id}`}
              className="display-tight text-[clamp(2rem,5.5vw,3.4rem)]"
            >
              {project.name}
            </h2>
            <p className="mt-5 max-w-2xl text-[0.98rem] leading-[1.75] text-graphite">
              {project.detail}
            </p>
          </div>

          {project.highlights?.length > 0 && (
            <div className="border-t border-ash pt-8">
              <p className="label-mono mb-5 text-ink/45">What it took</p>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {project.highlights.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 border border-ink/10 bg-bone p-4"
                  >
                    <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-blood" />
                    <span className="text-[0.88rem] leading-relaxed text-ink/80">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-ash pt-8">
            <p className="label-mono mb-4 text-ink/45">Stack</p>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="border border-ink/15 bg-bone px-3 py-1.5 font-mono text-[0.72rem] tracking-[0.06em] text-ink/75"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-ash pt-8">
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => sound.click()}
                onMouseEnter={() => sound.hover()}
                className="group relative flex items-center gap-3 overflow-hidden bg-ink px-6 py-3.5 text-paper"
              >
                <span className="label-mono relative z-10">
                  {project.repo === project.href ? "View source" : "Open live"}
                </span>
                <ExternalLink size={15} className="relative z-10" />
                <span className="absolute inset-0 -translate-y-full bg-blood transition-transform duration-500 ease-web group-hover:translate-y-0" />
              </a>
            )}

            {project.repo && project.repo !== project.href && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                onClick={() => sound.click()}
                onMouseEnter={() => sound.hover()}
                className="flex items-center gap-3 border border-ink/20 px-6 py-3.5 text-ink transition-colors duration-300 hover:border-blood hover:text-blood"
              >
                <GithubIcon size={15} />
                <span className="label-mono">Source</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
