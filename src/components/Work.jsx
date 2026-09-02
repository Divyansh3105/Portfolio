import { useEffect, useRef, useState } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "../lib/gsap";
import { sound } from "../lib/sound";
import { profile, projects } from "../data/site";
import ProjectModal from "./ProjectModal";
import ProjectPlate from "./ProjectPlate";
import { ArrowUpRight, ExternalLink, GithubIcon } from "./Icons";
import { Spider as SpiderMark, WebOrb as WebOrbMark } from "./WebDecor";

/**
 * Editorial index of selected work.
 *
 * Rows reveal on scroll behind a clip-path wipe. On a fine pointer a single
 * preview plate follows the cursor and swaps its contents to whichever row is
 * hovered; on touch the plate renders inline inside each row instead.
 *
 * A row opens the full specification rather than navigating away — the live
 * site and the source repo are one click further in, inside the modal, so the
 * index stays a place you can read through without losing your position.
 */
export default function Work() {
  const root = useRef(null);
  const preview = useRef(null);
  const [active, setActive] = useState(null);
  const [openProject, setOpenProject] = useState(null);
  // Client-only app -- safe to read matchMedia straight from render, and it
  // never needs to change after mount, so a state slot would be unnecessary.
  const fine = hasFinePointer() && !prefersReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion();
      let cleanup;

      /* ---------- entrance ---------- */
      const head = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        defaults: { ease: "power3.out" },
      });
      head
        .from(".work-eyebrow", { y: 18, opacity: 0, duration: 0.6 })
        .from(
          ".work-title",
          {
            clipPath: "inset(0 0 105% 0)",
            yPercent: 14,
            duration: 1,
            ease: "expo.out",
          },
          "-=0.25",
        )
        .from(".work-intro", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6");

      if (reduced) head.progress(1);

      gsap.utils.toArray(".work-row").forEach((row) => {
        const rowTl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 88%", once: true },
        });
        rowTl
          .from(row, {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.9,
            ease: "expo.out",
          })
          .from(
            row.querySelectorAll(".work-meta-item"),
            { y: 16, opacity: 0, duration: 0.6, stagger: 0.06 },
            "-=0.55",
          );
        if (reduced) rowTl.progress(1);
      });

      /* ---------- ambient ---------- */
      if (!reduced) {
        gsap.to(".work-bg-orb", {
          rotation: 360,
          duration: 220,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });
      }

      /* ---------- cursor-tracked preview ---------- */
      const node = preview.current;
      if (node && hasFinePointer() && !reduced) {
        gsap.set(node, { xPercent: -50, yPercent: -50 });
        const toX = gsap.quickTo(node, "x", { duration: 0.6, ease: "power3" });
        const toY = gsap.quickTo(node, "y", { duration: 0.6, ease: "power3" });

        const onMove = (e) => {
          const rect = root.current.getBoundingClientRect();
          toX(e.clientX - rect.left);
          toY(e.clientY - rect.top);
        };
        const host = root.current;
        host.addEventListener("pointermove", onMove, { passive: true });
        cleanup = () => host.removeEventListener("pointermove", onMove);
      }

      return () => cleanup?.();
    }, root);

    return () => ctx.revert();
  }, []);

  /* Fade the floating plate in and out as rows are entered and left. */
  useEffect(() => {
    if (!fine || !preview.current) return;
    const anim = gsap.to(preview.current, {
      autoAlpha: active === null ? 0 : 1,
      scale: active === null ? 0.9 : 1,
      duration: 0.5,
      ease: "power3.out",
    });
    return () => anim.kill();
  }, [active, fine]);

  const current = projects.find((p) => p.id === active) ?? projects[0];

  const open = (project) => {
    sound.click();
    // Drop the cursor plate as the modal takes over, so it can't sit on top
    // of the backdrop while the pointer is still inside the row.
    setActive(null);
    setOpenProject(project);
  };

  return (
    <section
      id="work"
      ref={root}
      className="relative overflow-hidden border-t border-ash bg-paper py-24 md:py-36"
    >
      <div
        className="pointer-events-none absolute -right-[16%] top-[8%]"
        aria-hidden="true"
      >
        <WebOrbMark
          size={560}
          spokes={18}
          rings={10}
          className="work-bg-orb block text-ink/7"
        />
      </div>

      <div className="relative mx-auto max-w-[112rem] px-5 sm:px-8">
        {/* ---------------- header ---------------- */}
        <div className="mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="work-eyebrow label-mono mb-7 flex items-center gap-3 text-blood">
              <SpiderMark size={16} withDragline />
              <span>Selected work</span>
              <span className="h-px w-14 bg-blood/35" />
              <span className="text-ink/45">02</span>
            </p>
            <h2 className="work-title display-tight text-[clamp(2.6rem,8vw,7rem)]">
              Things I<br />
              <span className="italic text-blood">shipped.</span>
            </h2>
          </div>
          <p className="work-intro max-w-sm text-[0.95rem] leading-relaxed text-graphite">
            Seven of {profile.repoCount} public repositories. A language, a
            real-time platform, a billing system in production, a storefront for
            a paying client — picked because each one taught me something the
            next one needed.
          </p>
        </div>

        {/* ---------------- index ---------------- */}
        <ul className="border-t border-ash">
          {projects.map((project) => (
            <li key={project.id}>
              <div
                onMouseEnter={() => {
                  setActive(project.id);
                  sound.hover();
                }}
                onMouseLeave={() => setActive(null)}
                className="work-row group relative isolate border-b border-ash py-7 md:py-9"
              >
                {/* Ink wash that wipes in from the left on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-[-1.25rem] inset-y-0 -z-10 origin-left scale-x-0 bg-ink transition-transform duration-600 ease-web group-hover:scale-x-100"
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-8">
                  <span className="work-meta-item label-mono text-ink/40 transition-colors duration-500 group-hover:text-blood-soft">
                    {project.index}
                  </span>

                  <h3 className="work-meta-item display-tight text-[clamp(1.9rem,5.2vw,3.6rem)] transition-colors duration-500 group-hover:text-paper">
                    {project.name}
                  </h3>

                  <p className="work-meta-item max-w-md text-[0.9rem] leading-relaxed text-graphite transition-colors duration-500 group-hover:text-paper/70">
                    {project.summary}
                  </p>

                  <span className="work-meta-item flex items-center gap-4">
                    <span className="label-mono hidden text-ink/40 transition-colors duration-500 group-hover:text-paper/60 lg:inline">
                      {project.year}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-colors duration-500 group-hover:border-blood group-hover:bg-blood group-hover:text-paper"
                    >
                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-500 ease-web group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </span>
                </div>

                {/* This wrapper deliberately carries no `work-meta-item`: the
                    entrance tween leaves `transform: translate(0,0)` on every
                    element it touches, and a transform makes a stacking
                    context, which would trap the links' z-index inside a
                    wrapper that itself paints below the row's click overlay.
                    The list animates instead, so the wrapper stays neutral. */}
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 md:pl-[5.75rem]">
                  <ul className="work-meta-item flex flex-wrap gap-x-4 gap-y-2">
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        className="label-mono text-ink/45 transition-colors duration-500 group-hover:text-paper/55"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  {/* Direct links, raised above the row-wide hit area so they
                      stay independently clickable. */}
                  <span className="relative z-[2] ml-auto flex items-center gap-2">
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => sound.click()}
                        aria-label={`${project.name} source on GitHub`}
                        className="flex h-9 w-9 items-center justify-center border border-ink/15 text-ink/60 transition-colors duration-300 hover:border-blood hover:bg-blood hover:text-paper group-hover:border-paper/25 group-hover:text-paper/70"
                      >
                        <GithubIcon size={15} />
                      </a>
                    )}
                    {project.href && project.href !== project.repo && (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => sound.click()}
                        aria-label={`Open ${project.name} live`}
                        className="flex h-9 w-9 items-center justify-center border border-ink/15 text-ink/60 transition-colors duration-300 hover:border-blood hover:bg-blood hover:text-paper group-hover:border-paper/25 group-hover:text-paper/70"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </span>
                </div>

                {/* Touch devices get the plate inline rather than on the cursor. */}
                {!fine && (
                  <ProjectPlate
                    project={project}
                    className="mt-6 max-w-sm md:ml-[5.75rem]"
                  />
                )}

                {/* One click target over the whole row, so the number, the
                    title, the summary, the arrow, the stack and the inline
                    plate all open the project.

                    This is a real element rather than a `::after` on the
                    title: as a pseudo-element it was painted with the title
                    and every later sibling in the row covered it, which left
                    only the title text itself clickable. Rendered last and
                    positioned, it sits above the row's content — and below
                    the direct links, which carry `z-2`. */}
                <button
                  type="button"
                  onClick={() => open(project)}
                  onFocus={() => setActive(project.id)}
                  onBlur={() => setActive(null)}
                  className="absolute inset-0 z-[1] cursor-pointer"
                >
                  <span className="sr-only">
                    {project.name} — view project details
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-wrap items-center gap-5">
          <a
            href={`${profile.github}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="group relative overflow-hidden border border-ink/20 px-7 py-4"
          >
            <span className="label-mono relative z-10 transition-colors duration-400 group-hover:text-paper">
              All {profile.repoCount} repositories
            </span>
            <span className="absolute inset-0 -translate-x-full bg-blood transition-transform duration-500 ease-web group-hover:translate-x-0" />
          </a>
          <p className="label-mono text-ink/40">github.com/Divyansh3105</p>
        </div>
      </div>

      {/* ---------------- floating preview ---------------- */}
      {fine && (
        <div
          ref={preview}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-30 hidden w-[22rem] opacity-0 lg:block"
        >
          <ProjectPlate project={current} active />
        </div>
      )}

      {openProject && (
        <ProjectModal
          project={openProject}
          onClose={() => setOpenProject(null)}
        />
      )}
    </section>
  );
}
