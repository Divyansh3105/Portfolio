import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { sound } from "../lib/sound";
import { ArrowUpRight } from "./Icons";
import { WebOrb } from "./WebDecor";

/**
 * A developer portfolio that never shows any code.
 *
 * Everything else on this page is a claim about engineering — stacks, counts,
 * summaries. This is the one place the page stops describing and shows the
 * work, and it sits directly after the About copy that says I wrote a
 * language rather than reading about one.
 *
 * Deliberately not a numbered section. The five numbered ones map to the nav,
 * and this is a proof point rather than another chapter, so it reads as an
 * interstitial: full-bleed and inverted, between two pale sections.
 *
 * Verbatim from gravlang/core/parser.py. Trimming it to look tidier would
 * make it decoration; `line=op_tok.line` stays in precisely because it is the
 * unglamorous part that a real implementation has and a snippet would not.
 */
const SOURCE = `def _add_sub(self):
    left = self._mul_div()
    while self._current().type in ("PLUS", "MINUS"):
        op_tok = self._advance()
        op = "+" if op_tok.type == "PLUS" else "-"
        right = self._mul_div()
        left = ast.BinOp(left=left, op=op, right=right, line=op_tok.line)
    return left`;

/* Eight lines of Python do not justify a syntax-highlighting dependency.
   Splitting on a capturing group keeps the separators, so the keywords come
   back as their own pieces and everything else passes through untouched. The
   pattern is intentionally not global: `split` matches every occurrence
   either way, and a global regex carries `lastIndex` state that would make
   repeated use of the same object quietly wrong. */
const KEYWORD = /\b(def|while|in|if|else|return)\b/;
const KEYWORDS = new Set(["def", "while", "in", "if", "else", "return"]);

function Code({ source }) {
  return (
    <code>
      {source.split("\n").map((line, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={i} className="block whitespace-pre">
          {line.split(KEYWORD).map((part, j) =>
            KEYWORDS.has(part) ? (
              // eslint-disable-next-line react/no-array-index-key
              <span key={j} className="text-blood-soft">
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </span>
      ))}
    </code>
  );
}

export default function Proof() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        defaults: { ease: "power3.out" },
      });

      tl.from(".proof-eyebrow", { y: 16, opacity: 0, duration: 0.6 })
        .from(
          ".proof-line",
          {
            clipPath: "inset(0 0 105% 0)",
            yPercent: 14,
            duration: 0.9,
            stagger: 0.1,
            ease: "expo.out",
          },
          "-=0.3",
        )
        .from(".proof-body", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(
          ".proof-slab",
          { y: 28, opacity: 0, duration: 0.9, ease: "expo.out" },
          "-=0.6",
        );

      if (prefersReducedMotion()) tl.progress(1);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="proof-heading"
      className="relative overflow-hidden border-y border-ink/10 bg-ink py-20 text-paper md:py-28"
    >
      <div
        className="pointer-events-none absolute -right-[14%] -top-[40%]"
        aria-hidden="true"
      >
        <WebOrb
          size={620}
          spokes={16}
          rings={9}
          className="block text-paper/6"
        />
      </div>

      <div className="relative mx-auto max-w-[112rem] px-5 sm:px-8">
        {/* The heading runs the full width rather than sitting in the prose
            column: at display sizes a 40% column forces breaks like "IT'S /
            THE", and the line breaks here are chosen, not left to chance. */}
        <p className="proof-eyebrow label-mono mb-7 flex flex-wrap items-center gap-3 text-blood-soft">
          <span>Specimen</span>
          <span className="h-px w-10 bg-blood-soft/35" />
          <span className="text-paper/45">gravlang/core/parser.py</span>
        </p>

        <h2
          id="proof-heading"
          className="display-tight text-[clamp(2.1rem,7vw,5.2rem)]"
        >
          <span className="proof-line block">
            Precedence isn&rsquo;t a table.
          </span>
          <span className="proof-line block">
            It&rsquo;s the{" "}
            <span className="italic text-blood-soft">call order.</span>
          </span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <div className="proof-body max-w-md space-y-4 text-[0.95rem] leading-[1.75] text-paper/60">
              <p>
                Recursive descent, one method per level of precedence, each one
                calling the level above it before it builds anything.
              </p>
              <p>
                Because{" "}
                <span className="font-mono text-[0.9em] text-paper">
                  _add_sub
                </span>{" "}
                resolves{" "}
                <span className="font-mono text-[0.9em] text-paper">
                  _mul_div
                </span>{" "}
                first, a multiplication is already a finished subtree by the
                time the{" "}
                <span className="font-mono text-[0.9em] text-paper">+</span> is
                considered. Nothing enforces that — it falls out of the shape of
                the calls.
              </p>
            </div>

            <a
              href="/gravlang/"
              onClick={() => sound.click()}
              onMouseEnter={() => sound.hover()}
              className="proof-body group mt-8 inline-flex items-center gap-2.5 border-b border-paper/25 pb-1.5 text-[0.95rem] text-paper/85 transition-colors duration-300 hover:border-blood-soft hover:text-blood-soft"
            >
              <span>How the rest of the language works</span>
              <ArrowUpRight
                size={14}
                className="transition-transform duration-500 ease-web group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>

          <div className="proof-slab min-w-0">
            <div className="flex items-center justify-between border border-paper/15 border-b-0 px-4 py-2.5">
              <span className="label-mono text-paper/40">Python</span>
              <span className="label-mono text-paper/40">
                Recursive descent
              </span>
            </div>
            <pre className="overflow-x-auto border border-paper/15 bg-paper/[0.04] p-5 font-mono text-[0.76rem] leading-[1.9] text-paper/85 sm:text-[0.82rem]">
              <Code source={SOURCE} />
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
