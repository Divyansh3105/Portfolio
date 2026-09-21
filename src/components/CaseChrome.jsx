import { profile } from "../data/site";
import { ArrowUpRight, ExternalLink } from "./Icons";

/**
 * Chrome shared by the case-study pages.
 *
 * Extracted when the second one arrived, not in anticipation of it: the
 * header and the closing CTA were identical down to the hover wipe, and the
 * only honest way to keep them that way is to have one of each.
 */

/** Monospaced block for verbatim code and output. */
export function Slab({ children }) {
  return (
    <pre className="overflow-x-auto border border-ink/15 bg-paper p-4 font-mono text-[0.78rem] leading-[1.85] text-ink/85">
      {children}
    </pre>
  );
}

export function CaseHeader() {
  return (
    <>
      <a
        href="#lede"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-ink/10 bg-bone/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-10">
          <a
            href="/"
            className="label-mono text-ink transition-colors hover:text-blood"
          >
            Divyansh<span className="text-blood">/</span>Garg
          </a>
          <a
            href="/#work"
            className="label-mono group flex items-center gap-2 text-ink/55 transition-colors hover:text-ink"
          >
            <span className="transition-transform duration-500 ease-web group-hover:-translate-x-1">
              &larr;
            </span>
            Back to work
          </a>
        </div>
      </header>
    </>
  );
}

/**
 * Closing call to action. `live` is optional — GravLang has no deployed URL
 * to send anyone to, so it renders the repo alone rather than a dead button.
 * `children` is the page's fine print.
 */
export function CaseFooter({ repo, live, children }) {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-mono text-paper/45">Source</p>
            <p className="display-tight mt-4 text-[clamp(1.8rem,5vw,3rem)]">
              Read the code
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noreferrer"
                className="group relative flex items-center gap-3 overflow-hidden border border-paper/25 px-6 py-3.5"
              >
                <span className="label-mono relative z-10">Live app</span>
                <ExternalLink size={15} className="relative z-10" />
                <span className="absolute inset-0 -translate-y-full bg-blood transition-transform duration-500 ease-web group-hover:translate-y-0" />
              </a>
            )}

            <a
              href={repo}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center gap-3 overflow-hidden border border-paper/25 px-6 py-3.5"
            >
              <span className="label-mono relative z-10">GitHub</span>
              <ExternalLink size={15} className="relative z-10" />
              <span className="absolute inset-0 -translate-y-full bg-blood transition-transform duration-500 ease-web group-hover:translate-y-0" />
            </a>

            <a
              href="/#work"
              className="group relative flex items-center gap-3 overflow-hidden bg-paper px-6 py-3.5 text-ink"
            >
              <span className="label-mono relative z-10">All work</span>
              <ArrowUpRight size={15} className="relative z-10" />
              <span className="absolute inset-0 -translate-y-full bg-blood transition-transform duration-500 ease-web group-hover:translate-y-0 group-hover:text-paper" />
            </a>
          </div>
        </div>

        <p className="mt-14 border-t border-paper/15 pt-6 font-mono text-[0.72rem] leading-relaxed text-paper/45">
          {children}
        </p>

        <p className="mt-6 font-mono text-[0.72rem] text-paper/35">
          &copy; {new Date().getFullYear()} {profile.first} {profile.last}
        </p>
      </div>
    </section>
  );
}
