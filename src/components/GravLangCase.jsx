import { CaseFooter, CaseHeader, Slab } from "./CaseChrome";

/**
 * The GravLang case study — a standalone page at /gravlang/.
 *
 * Built as its own Vite entry rather than behind a router. There are two of
 * these now; a router still costs more than the two entries do, and they are
 * documents rather than app routes. Every token stream and AST on this page
 * is verbatim output from the interpreter, not prose about it.
 */

/** Real output of Lexer("let total = price * 2 + 5;").tokenize(). */
const TOKENS = [
  ["LET", "let", "kw"],
  ["ID", "total", "id"],
  ["ASSIGN", "=", "op"],
  ["ID", "price", "id"],
  ["STAR", "*", "op"],
  ["INT", "2", "num"],
  ["PLUS", "+", "op"],
  ["INT", "5", "num"],
  ["SEMI", ";", "dim"],
  ["EOF", " ", "dim"],
];

const TOK_TONE = {
  kw: "text-blood",
  id: "text-ink",
  op: "text-blood",
  num: "text-ink",
  dim: "text-graphite",
};

const STAGES = [
  {
    n: "01",
    name: "Source",
    file: ".grav",
    body: "Flat text. Nothing knows what any of it means yet.",
  },
  {
    n: "02",
    name: "Lexer",
    file: "core/lexer.py",
    body: "One master regex, built by joining ~40 named groups in priority order, scans the source in a single pass. Order is the whole trick: ** must be tried before *, and ... before ., or the longer operator can never match. Identifiers match last, then get promoted to keywords by dictionary lookup — let is only a keyword because nothing else claimed it first.",
  },
  {
    n: "03",
    name: "Parser",
    file: "core/parser.py",
    body: "Recursive descent, one method per precedence level, each calling the level above it. Precedence isn't a table to consult — it is the call order itself.",
  },
  {
    n: "04",
    name: "Interpreter",
    file: "core/interpreter.py",
    body: "A tree-walker. _exec dispatches on node class name to a _visit_<Node> method, recursing depth-first — so the inner BinOp resolves to a number before the outer one runs. Evaluation order is just the shape of the tree.",
  },
];

const FACTS = [
  { value: "8,720", label: "Lines of source" },
  { value: "285", label: "Tests passing" },
  { value: "18", label: "Builtins" },
  { value: "5", label: "Months of work" },
];

const DEMOS = [
  {
    file: "brainfuck.grav",
    body: "A Brainfuck interpreter — a language interpreting a second language, tape and data pointer and all.",
  },
  {
    file: "snake_game.grav",
    body: "Playable Snake with a game loop and collision handling.",
  },
  {
    file: "todo_app.grav",
    body: "CRUD over arrays and dicts, exercising the collection builtins.",
  },
  {
    file: "grade_analyzer.grav",
    body: "Aggregation and sorting across records.",
  },
];

const REPO = "https://github.com/Divyansh3105/GravLang";

/* ── page ───────────────────────────────────────────────────────── */

export default function CaseStudy() {
  return (
    <>
      <CaseHeader />

      <main>
        {/* ── hero ── */}
        <section className="border-b border-ash">
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
            <p className="label-mono mb-8 text-blood">
              Case study &middot; Language implementation
            </p>

            <h1 className="display-tight text-[clamp(3.2rem,13vw,9rem)]">
              Grav<span className="text-blood">Lang</span>
            </h1>

            <p
              id="lede"
              className="mt-10 max-w-2xl text-[1.05rem] leading-[1.7] text-ink/80 md:text-[1.2rem]"
            >
              I wrote a programming language to find out how they actually work.
              GravLang is interpreted and dynamically typed, implemented in Python —
              lexer, recursive-descent parser, AST and tree-walking interpreter, plus a
              desktop IDE whose step debugger pauses the interpreter mid-evaluation.
              No parser generator, no <span className="font-mono text-[0.92em]">eval</span>,
              no tutorial to follow.
            </p>

            <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
              {FACTS.map((fact) => (
                <div key={fact.label}>
                  <dd className="display-tight text-[2.6rem] tabular-nums md:text-[3.2rem]">
                    {fact.value}
                  </dd>
                  <dt className="label-mono mt-3 text-ink/45">{fact.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── pipeline ── */}
        <section className="border-b border-ash">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <h2 className="display-tight max-w-3xl text-[clamp(2rem,6vw,3.6rem)]">
              One line, all the way down
            </h2>
            <p className="mt-6 max-w-2xl text-[0.98rem] leading-[1.75] text-graphite">
              Every token and tree below is real output from the current implementation,
              not a description of it. Here is a single statement carried from source text
              to a value.
            </p>

            <div className="mt-12 border border-ink/15">
              {STAGES.map((stage, i) => (
                <article
                  key={stage.n}
                  className={`p-6 md:p-8 ${i > 0 ? "border-t border-ink/15" : ""}`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <span className="label-mono bg-blood px-2 py-1 text-paper">
                      {stage.n}
                    </span>
                    <span className="font-display text-[1.05rem] font-semibold">
                      {stage.name}
                    </span>
                    <span className="ml-auto font-mono text-[0.72rem] text-graphite">
                      {stage.file}
                    </span>
                  </div>

                  {/* stage 01 — source */}
                  {stage.n === "01" && (
                    <div className="mt-6">
                      <Slab>
                        <span className="text-blood">let</span> total{" "}
                        <span className="text-blood">=</span> price{" "}
                        <span className="text-blood">*</span> 2{" "}
                        <span className="text-blood">+</span> 5
                        <span className="text-graphite">;</span>
                      </Slab>
                    </div>
                  )}

                  <p className="mt-6 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                    {stage.body}
                  </p>

                  {/* stage 02 — token chips */}
                  {stage.n === "02" && (
                    <ul className="mt-6 flex flex-wrap gap-1.5">
                      {TOKENS.map(([type, value, tone], idx) => (
                        <li
                          key={`${type}-${idx}`}
                          className="border border-ink/15 bg-paper px-2.5 py-1.5"
                        >
                          <span className="block font-mono text-[0.58rem] tracking-[0.14em] text-ink/40">
                            {type}
                          </span>
                          <span
                            className={`font-mono text-[0.78rem] ${TOK_TONE[tone]}`}
                          >
                            {value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* stage 03 — precedence chain + AST */}
                  {stage.n === "03" && (
                    <>
                      <p className="mt-5 overflow-x-auto font-mono text-[0.74rem] leading-relaxed text-ink/55">
                        or → and → not → comparison → add/sub → mul/div → power → unary →
                        postfix → atom
                      </p>
                      <div className="mt-6">
                        <Slab>
                          {`VarDecl  name='total'
└─ BinOp  '+'
   ├─ BinOp  '*'
   │  ├─ Identifier  'price'
   │  └─ Literal  2
   └─ Literal  5`}
                        </Slab>
                      </div>
                      <p className="mt-6 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                        The tree is the proof. Because{" "}
                        <span className="font-mono text-[0.9em] text-ink">_add_sub</span>{" "}
                        delegates to{" "}
                        <span className="font-mono text-[0.9em] text-ink">_mul_div</span>{" "}
                        before it ever builds a node, the multiplication is already a
                        finished subtree by the time the{" "}
                        <span className="font-mono text-[0.9em] text-ink">+</span> is
                        considered. Nothing enforced that — it fell out of the structure.
                      </p>
                    </>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── decisions ── */}
        <section className="border-b border-ash bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <h2 className="display-tight max-w-3xl text-[clamp(2rem,6vw,3.6rem)]">
              Three decisions
              <br />
              worth defending
            </h2>
            <p className="mt-6 max-w-2xl text-[0.98rem] leading-[1.75] text-graphite">
              The parts where the obvious implementation is wrong, and why.
            </p>

            <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-14">
              {/* 1 */}
              <article className="min-w-0 border-l-2 border-blood pl-6 md:col-span-2">
                <h3 className="font-display text-[1.15rem] font-semibold leading-snug">
                  Control flow rides on Python exceptions — and that sets a trap
                </h3>
                <p className="mt-4 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                  <span className="font-mono text-[0.9em] text-ink">return</span>,{" "}
                  <span className="font-mono text-[0.9em] text-ink">break</span> and{" "}
                  <span className="font-mono text-[0.9em] text-ink">continue</span> have to
                  escape arbitrarily deep recursion in the walker. Threading a sentinel
                  through every visitor would poison every method signature, so each one
                  raises a signal and the loop or call frame catches it.
                </p>
                <p className="mt-4 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                  That is clean until the language also has{" "}
                  <span className="font-mono text-[0.9em] text-ink">try/catch</span>. A
                  naive <span className="font-mono text-[0.9em] text-ink">except
                  Exception</span> swallows those signals, and a{" "}
                  <span className="font-mono text-[0.9em] text-ink">return</span> inside a{" "}
                  <span className="font-mono text-[0.9em] text-ink">try</span> block
                  silently becomes a caught error instead of returning. Control flow has to
                  be re-raised before anything user-facing is caught:
                </p>
                <div className="mt-6 max-w-2xl">
                  <Slab>
                    {`try:
    self._exec(node.try_body, env)
except (ReturnSignal, BreakSignal, ContinueSignal):
    raise          # control flow is not an error
except Exception as e:
    # ... bind catch_var, run catch_body`}
                  </Slab>
                </div>
              </article>

              {/* 2 */}
              <article className="min-w-0 border-l-2 border-ink/20 pl-6">
                <h3 className="font-display text-[1.15rem] font-semibold leading-snug">
                  Declaring and assigning are different operations
                </h3>
                <p className="mt-4 text-[0.94rem] leading-[1.75] text-graphite">
                  <span className="font-mono text-[0.9em] text-ink">Environment</span> is a
                  dict plus a parent pointer, but it exposes two distinct writes.{" "}
                  <span className="font-mono text-[0.9em] text-ink">set()</span> always
                  binds in the current scope — that is{" "}
                  <span className="font-mono text-[0.9em] text-ink">let</span>.{" "}
                  <span className="font-mono text-[0.9em] text-ink">assign()</span> walks
                  the parent chain for an existing binding and raises if it never finds one.
                </p>
                <p className="mt-4 text-[0.94rem] leading-[1.75] text-graphite">
                  Collapsing those into one method is what gives you a language where a typo
                  creates a new global instead of an error. Keeping them apart means{" "}
                  <span className="font-mono text-[0.9em] text-ink">toatl = 5</span> is
                  caught, and a closure that mutates an outer variable actually reaches it
                  rather than shadowing it.
                </p>
              </article>

              {/* 3 */}
              <article className="min-w-0 border-l-2 border-ink/20 pl-6">
                <h3 className="font-display text-[1.15rem] font-semibold leading-snug">
                  f-strings never reach the interpreter
                </h3>
                <p className="mt-4 text-[0.94rem] leading-[1.75] text-graphite">
                  <span className="font-mono text-[0.9em] text-ink">
                    f&quot;hi {"{name}"}!&quot;
                  </span>{" "}
                  looks like it needs a runtime feature. It does not — the parser desugars
                  it into concatenation and the interpreter never learns f-strings exist.
                  There is no <span className="font-mono text-[0.9em] text-ink">FString</span>{" "}
                  node in the AST at all:
                </p>
                <div className="mt-6">
                  <Slab>
                    {`BinOp  '+'
├─ BinOp  '+'
│  ├─ Literal  'hi '
│  └─ FuncCall  toString(name)
└─ Literal  '!'`}
                  </Slab>
                </div>
                <p className="mt-6 text-[0.94rem] leading-[1.75] text-graphite">
                  One surface feature, zero runtime cost, nothing new to maintain in the
                  evaluator. The cheapest place to add a feature is usually earlier in the
                  pipeline than you would think.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ── debugger ── */}
        <section className="border-b border-ash">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <h2 className="display-tight max-w-3xl text-[clamp(2rem,6vw,3.6rem)]">
              Pausing a running interpreter
            </h2>

            <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-14">
              <div className="md:col-span-7">
                <p className="text-[0.98rem] leading-[1.8] text-graphite">
                  The IDE ships a step debugger with editor breakpoints and a live variable
                  inspector. The hard part is not the UI — it is that a tree-walking
                  interpreter has no natural pause point. It is one deep recursive call
                  that either runs to completion or throws.
                </p>
                <p className="mt-5 text-[0.98rem] leading-[1.8] text-graphite">
                  The core stays ignorant of the GUI.{" "}
                  <span className="font-mono text-[0.9em] text-ink">Interpreter</span> takes
                  an optional{" "}
                  <span className="font-mono text-[0.9em] text-ink">on_step</span> callback,
                  and <span className="font-mono text-[0.9em] text-ink">_exec</span> invokes
                  it before executing any statement-level node. That single injected hook is
                  the entire debugging surface — the CLI passes nothing and pays nothing.
                </p>
                <p className="mt-5 text-[0.98rem] leading-[1.8] text-graphite">
                  The IDE runs the interpreter on a worker thread. Its hook checks whether
                  the current line holds a breakpoint, snapshots the environment, marshals
                  the UI update onto the Tk main thread, then{" "}
                  <span className="text-ink">
                    blocks the interpreter thread on a{" "}
                    <span className="font-mono text-[0.9em]">threading.Event</span>
                  </span>{" "}
                  until the user clicks step or continue. The interpreter is not simulating
                  a pause — it is genuinely stopped mid-evaluation, holding a real Python
                  call stack.
                </p>
              </div>

              <aside className="md:col-span-5">
                <div className="border-l-2 border-blood bg-paper p-6">
                  <p className="label-mono mb-4 text-ink/45">Same hook, second use</p>
                  <p className="text-[0.92rem] leading-[1.75] text-graphite">
                    The step callback also feeds a{" "}
                    <span className="text-ink">compiler stages window</span> that shows the
                    token list, the pretty-printed AST and the live execution trace side by
                    side — the pipeline on this page, rendered from whatever program you
                    just typed into the editor.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── demos ── */}
        <section className="border-b border-ash bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <h2 className="display-tight max-w-3xl text-[clamp(2rem,6vw,3.6rem)]">
              Programs written in it
            </h2>
            <p className="mt-6 max-w-2xl text-[0.98rem] leading-[1.75] text-graphite">
              The real test of a language is not its test suite — it is whether you can
              build something awkward in it.
            </p>

            <div className="mt-12 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2">
              {DEMOS.map((demo) => (
                <div key={demo.file} className="bg-bone p-6">
                  <p className="font-mono text-[0.82rem] text-ink">{demo.file}</p>
                  <p className="mt-3 text-[0.9rem] leading-[1.7] text-graphite">
                    {demo.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── what I'd change ── */}
        <section className="border-b border-ash">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <h2 className="display-tight max-w-3xl text-[clamp(2rem,6vw,3.6rem)]">
              What I&rsquo;d change
            </h2>
            <div className="mt-8 max-w-2xl">
              <p className="text-[0.98rem] leading-[1.8] text-graphite">
                Tree-walking is the honest choice for a first language — the evaluator maps
                one-to-one onto the grammar, which is exactly what makes it a good way to
                learn. It is also slow. Every evaluation re-traverses Python objects and
                every variable lookup walks a dict chain.
              </p>
              <p className="mt-5 text-[0.98rem] leading-[1.8] text-graphite">
                The next version compiles the AST to a bytecode instruction set and runs a
                stack VM, with variable resolution done once at compile time so locals
                become array slots instead of dictionary lookups. That is the rewrite that
                would make the Brainfuck demo finish quickly rather than eventually — and
                the reason to do it is measurement, not fashion.
              </p>
            </div>
          </div>
        </section>

        <CaseFooter repo={REPO}>
          Python 3.8+ &middot; MIT &middot; 285 tests &middot; pyright clean &middot;
          GitHub Actions for CI and release builds &middot; MkDocs documentation.
          <br />
          Token stream and AST above are verbatim output from the current
          implementation.
        </CaseFooter>
      </main>
    </>
  );
}
