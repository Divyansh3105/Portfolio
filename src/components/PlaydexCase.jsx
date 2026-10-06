import playdexImg from "../assets/playdex.webp";
import { CaseFooter, CaseHeader, Slab } from "./CaseChrome";

/**
 * The Playdex case study — a standalone page at /playdex/.
 *
 * Same rule as the other two: every excerpt is copied out of the repository
 * (scan.mjs and main.mjs), and every number is counted from it. If the source
 * moves, this goes stale and should be corrected, not quietly rounded.
 */

const REPO = "https://github.com/Divyansh3105/playdex";
const STORE = "https://apps.microsoft.com/detail/9PMW08P8FQK8";

const FACTS = [
  { value: "3", label: "Launchers, one library" },
  { value: "1,073", label: "Lines of JavaScript" },
  { value: "34", label: "Tests in CI" },
  { value: "0", label: "Runtime dependencies" },
];

/** One launcher each: where its library lives, and what makes it awkward. */
const STORES = [
  {
    n: "01",
    name: "Steam",
    where: "appcache/appinfo.vdf",
    body: "A binary file with no public documentation. The library cache says which app ids you have; only appinfo.vdf says which of them are games rather than DLC, tools or test configs — and it still knows games the store has delisted, which the web API no longer returns.",
    code: `const magic = buf.readUInt32LE(0);
if (magic !== 0x07564429) throw new Error(\`unsupported appinfo.vdf format 0x\${magic.toString(16)}\`);
const tableAt = Number(buf.readBigUInt64LE(8));`,
    after:
      "The format version is checked before anything else is read. When Valve changes the layout, Playdex says so by name, rather than reading the new layout as if it were the old one and filling the library with garbage.",
    code2: `// Entry: appid, size, then 60 bytes of header (state, update time, token, 2 hashes, change number), then KeyValues.
for (let off = 16; off < tableAt; ) {
  const appid = String(buf.readUInt32LE(off));
  if (appid === '0') break;
  const size = buf.readUInt32LE(off + 4);
  if (wanted.has(appid)) {
    const common = readKV(off + 68).appinfo?.common;
    if (common) apps.set(appid, { name: common.name, type: common.type });
  }
  off += 8 + size;
}`,
    after2:
      "Every entry carries its own size, so the loop can jump straight over every app it does not need and decode only the ones in your library. Key names are not stored inline: they are indexes into a string table at the end of the file, which is read first.",
  },
  {
    n: "02",
    name: "Epic",
    where: "Data/Catalog/catcache.bin",
    body: "Not binary at all once you look: it is base64-encoded JSON of every catalog entry in your library. The work is in the filtering, because Epic files creator kits as engines and applications, and Unreal Engine as an engine alone.",
    code: `const catalog = JSON.parse(Buffer.from(fs.readFileSync(path.join(base, 'Catalog/catcache.bin'), 'utf8'), 'base64').toString('utf8'));
return catalog
  // Same as Epic's Library tab: games plus creator/mod kits (filed as engines + applications, e.g.
  // "Hogwarts Legacy Creator Kit"). Not DLC (has a main game), Unreal Engine (engines only) or Twinmotion (software).
  .filter(i => {
    const cats = new Set(i.categories?.map(c => c.path));
    return !i.mainGameItem?.id && (cats.has('games') || (cats.has('engines') && cats.has('applications')));
  })`,
    after:
      "The cache also stores ™ and ® as a literal question mark — Apex Legends? — so titles are cleaned before they are matched against the other two stores.",
  },
  {
    n: "03",
    name: "GOG Galaxy",
    where: "storage/galaxy-2.0.db",
    body: "A real SQLite database, which Galaxy keeps open the whole time it runs. Playdex never opens the live file. It copies it to a temporary folder and reads the copy with Node's built-in SQLite.",
    code: `// Copy first: Galaxy keeps the live DB open, and SQLite on Windows fails on very long paths.
const tmp = path.join(os.tmpdir(), 'playdex-gog');
fs.mkdirSync(tmp, { recursive: true });
for (const ext of ['', '-wal', '-shm']) {
  if (fs.existsSync(src + ext)) fs.copyFileSync(src + ext, path.join(tmp, 'galaxy-2.0.db' + ext));
}
const db = new DatabaseSync(path.join(tmp, 'galaxy-2.0.db'));`,
    after:
      "Copying the .db alone looks right and is subtly stale: in WAL mode, recent writes sit in the -wal file until SQLite checkpoints them. Copy all three, and the snapshot matches what Galaxy itself is showing.",
  },
];

const LIMITS = [
  {
    title: "Duplicates match on exact titles",
    body: "After normalising, two titles either match or they do not. A game sold under a different name on each store is missed. Fuzzy matching is the fix, and it is deliberately waiting for real libraries to show misses — it brings false positives of its own.",
  },
  {
    title: "The ™ fix eats a real question mark",
    body: "Epic's cache stores ™ as \"?\", so a \"?\" glued to the end of a word is dropped. A game whose title genuinely ends in a question mark loses it. Rare enough to accept, and marked in the code as a known corner.",
  },
  {
    title: "The GitHub installer is unsigned",
    body: "SmartScreen warns on it, and Smart App Control blocks it outright. The Microsoft Store build is the real answer — the Store signs the package — but anyone installing from GitHub still meets the warning first.",
  },
  {
    title: "Galaxy's database is still trusted for paths",
    body: "A GOG install must contain its goggame-<id>.info before Playdex will launch it or measure it. Another Windows user who can edit the database could still point a game at a different folder holding a matching file. Galaxy trusts the same data, so this adds no new risk — but it is not zero.",
  },
];

export default function PlaydexCase() {
  return (
    <>
      <CaseHeader />

      <main>
        {/* ── hero ── */}
        <section className="border-b border-ash">
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
            <p className="label-mono mb-8 text-blood">
              Case study &middot; Desktop app
            </p>

            <h1 className="display-tight text-[clamp(3.2rem,13vw,9rem)]">
              Play<span className="text-blood">dex</span>
            </h1>

            <p
              id="lede"
              className="mt-10 max-w-2xl text-[1.05rem] leading-[1.7] text-ink/80 md:text-[1.2rem]"
            >
              My games are split across Steam, Epic and GOG, and none of them
              will tell another program what you own without a login. Their
              own files on disk will — but each launcher stores them
              differently: an undocumented binary format, a base64 blob of
              JSON, and a SQLite database another program is holding open.
              Reading them is easy to describe. The hard part is that every
              count has to match what the launcher itself shows, or nobody
              trusts the rest.
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

            <img
              src={playdexImg}
              alt="Playdex library: Steam, Epic and GOG games in one cover grid with store badges and playtime"
              loading="lazy"
              decoding="async"
              className="mt-16 block w-full border border-ink/10 bg-ink"
            />
          </div>
        </section>

        {/* ── three formats ── */}
        <section className="border-b border-ash">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <h2 className="display-tight max-w-3xl text-[clamp(2rem,6vw,3.6rem)]">
              Three launchers,
              <br />
              three formats
            </h2>
            <p className="mt-6 max-w-2xl text-[0.98rem] leading-[1.75] text-graphite">
              No store APIs, no keys, nothing uploaded. Each parser reads one
              launcher&rsquo;s local data, read-only.
            </p>

            <div className="mt-12 border border-ink/15">
              {STORES.map((store, i) => (
                <article
                  key={store.n}
                  className={`p-6 md:p-8 ${i > 0 ? "border-t border-ink/15" : ""}`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <span className="label-mono bg-blood px-2 py-1 text-paper">
                      {store.n}
                    </span>
                    <span className="font-display text-[1.05rem] font-semibold">
                      {store.name}
                    </span>
                    <span className="ml-auto font-mono text-[0.72rem] text-graphite">
                      {store.where}
                    </span>
                  </div>

                  <p className="mt-6 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                    {store.body}
                  </p>
                  <div className="mt-6 max-w-3xl">
                    <Slab>{store.code}</Slab>
                  </div>
                  <p className="mt-5 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                    {store.after}
                  </p>

                  {store.code2 && (
                    <>
                      <div className="mt-6 max-w-3xl">
                        <Slab>{store.code2}</Slab>
                      </div>
                      <p className="mt-5 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                        {store.after2}
                      </p>
                    </>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── untrusted input ── */}
        <section className="border-b border-ash bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <div className="grid gap-10 md:grid-cols-12 md:gap-14">
              <div className="min-w-0 md:col-span-7">
                <h2 className="display-tight text-[clamp(2rem,6vw,3.6rem)]">
                  Launcher data is
                  <br />
                  untrusted input
                </h2>
                <p className="mt-6 max-w-2xl text-[0.98rem] leading-[1.75] text-graphite">
                  Epic&rsquo;s and GOG&rsquo;s folders live under{" "}
                  <span className="font-mono text-[0.9em] text-ink">
                    C:\ProgramData
                  </span>
                  , which every Windows user on the PC can write. A launch
                  command read from there is a command someone else may have
                  written. So only exact, known link shapes get through:
                </p>
                <div className="mt-6">
                  <Slab>
                    {`const SAFE_URIS = [
  /^steam:\\/\\/(rungameid|install|uninstall)\\/\\d+$/,
  /^com\\.epicgames\\.launcher:\\/\\/apps\\/[\\w-]+%3A[\\w-]+%3A[\\w-]+\\?action=launch&silent=true$/,
  /^com\\.epicgames\\.launcher:\\/\\/store\\/library$/, // Epic has no uninstall link: open its library, uninstall there
  /^goggalaxy:\\/\\/openGameView\\/gog_\\d+$/,
];

/** argv to run, or null if the URI isn't one we expect. */
export const uriLaunch = uri => (SAFE_URIS.some(re => re.test(uri)) ? [EXPLORER, uri] : null);`}
                  </Slab>
                </div>
                <p className="mt-5 max-w-2xl text-[0.94rem] leading-[1.75] text-graphite">
                  No commas, quotes or spaces can survive those patterns, which
                  matters because explorer.exe would read them as its own
                  switches. And the validated command never leaves the main
                  process. The page is told only whether a game can be
                  uninstalled, and can send back nothing but a game id:
                </p>
                <div className="mt-6">
                  <Slab>
                    {`// Commands stay in this process; the page only sends back a game id. It just learns whether uninstall is possible.
return JSON.parse(JSON.stringify(result, (k, v) => (k === 'launch' ? undefined : k === 'uninstall' ? !!v : v)));

ipcMain.handle('launch', (e, id) => {
  if (!fromApp(e)) throw new Error('Forbidden');
  return run(games.get(id)?.launch);
});`}
                  </Slab>
                </div>
              </div>

              <aside className="md:col-span-5">
                <div className="border-l-2 border-blood bg-bone p-6">
                  <p className="label-mono mb-4 text-ink/45">
                    A key called __proto__
                  </p>
                  <p className="text-[0.92rem] leading-[1.75] text-graphite">
                    Both VDF parsers build their objects with{" "}
                    <span className="font-mono text-[0.9em] text-ink">
                      Object.create(null)
                    </span>{" "}
                    rather than{" "}
                    <span className="font-mono text-[0.9em] text-ink">{"{}"}</span>.
                    The key names come straight from a file, and a plain object
                    given a key called{" "}
                    <span className="font-mono text-[0.9em] text-ink">
                      __proto__
                    </span>{" "}
                    does not store it — it swaps its own prototype. An object
                    with no prototype has nothing to swap.
                  </p>
                </div>

                <div className="mt-6 border-l-2 border-ink/20 bg-bone p-6">
                  <p className="label-mono mb-4 text-ink/45">
                    Let the store uninstall
                  </p>
                  <p className="text-[0.92rem] leading-[1.75] text-graphite">
                    Playdex never deletes game files. It does not even run
                    GOG&rsquo;s own{" "}
                    <span className="font-mono text-[0.9em] text-ink">
                      unins000.exe
                    </span>
                    , because that path comes from the same writable database.
                    Uninstall opens the game in its launcher, which asks first.
                  </p>
                </div>

                <div className="mt-6 border-l-2 border-ink/20 bg-bone p-6">
                  <p className="label-mono mb-4 text-ink/45">The page itself</p>
                  <p className="text-[0.92rem] leading-[1.75] text-graphite">
                    Sandboxed, context-isolated, no Node. Served from{" "}
                    <span className="font-mono text-[0.9em] text-ink">
                      app://playdex/
                    </span>{" "}
                    under a CSP that lets exactly one script run, with
                    navigation, new windows and every permission request
                    refused.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── counting ── */}
        <section className="border-b border-ash">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <div className="grid gap-10 md:grid-cols-2 md:gap-14">
              <div className="min-w-0">
                <h2 className="display-tight text-[clamp(2rem,6vw,3.6rem)]">
                  The count has to
                  <br />
                  match the launcher
                </h2>
                <p className="mt-6 text-[0.98rem] leading-[1.75] text-graphite">
                  If Steam says 240 and Playdex says 251, every other number on
                  the screen is suspect. So each store is counted by its own
                  rules: Steam keeps games and applications like Wallpaper
                  Engine, but not DLC or tools. Epic keeps games and creator
                  kits, but not Unreal Engine. GOG uses Galaxy&rsquo;s own{" "}
                  <span className="font-mono text-[0.9em] text-ink">isDlc</span>{" "}
                  and{" "}
                  <span className="font-mono text-[0.9em] text-ink">
                    isVisibleInLibrary
                  </span>{" "}
                  flags, which hide Amazon Prime claim stubs and superseded
                  releases.
                </p>
                <p className="mt-5 text-[0.94rem] leading-[1.75] text-graphite">
                  Every one of those rules has a test that builds a fake
                  launcher folder on disk with one entry per rule. A change
                  that would make Playdex drift from what the launcher shows
                  fails in CI before it ships.
                </p>
              </div>

              <div className="min-w-0">
                <h2 className="display-tight text-[clamp(2rem,6vw,3.6rem)]">
                  Owning it twice
                </h2>
                <p className="mt-6 text-[0.98rem] leading-[1.75] text-graphite">
                  Duplicates are matched on a normalised title. Simple enough
                  to explain in one function, which is the point:
                </p>
                <div className="mt-6">
                  <Slab>
                    {`export function normalize(title) {
  let t = title.toLowerCase().replace(/[™®©]/g, '').trim()
    .replace(/^(.+),\\s*(the|a|an)$/, '$2 $1'); // catalog style: "Ultimate DOOM, The" -> "the ultimate doom"
  for (let prev; prev !== t; ) { prev = t; t = t.replace(SUFFIX, '').trim(); }
  return t.replace(/&/g, ' and ').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}`}
                  </Slab>
                </div>
                <p className="mt-5 text-[0.94rem] leading-[1.75] text-graphite">
                  The suffix strip runs until nothing changes, because editions
                  stack: &ldquo;Game of the Year Edition&rdquo; and
                  &ldquo;Director&rsquo;s Cut&rdquo; can both be on one title.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── what I'd change ── */}
        <section className="border-b border-ash bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <h2 className="display-tight max-w-3xl text-[clamp(2rem,6vw,3.6rem)]">
              What I&rsquo;d change
            </h2>
            <p className="mt-6 max-w-2xl text-[0.98rem] leading-[1.75] text-graphite">
              Four known limits, each one a trade I chose rather than one I
              missed.
            </p>

            <div className="mt-12 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2">
              {LIMITS.map((limit) => (
                <div key={limit.title} className="bg-bone p-6">
                  <p className="font-display text-[1rem] font-semibold leading-snug">
                    {limit.title}
                  </p>
                  <p className="mt-3 text-[0.9rem] leading-[1.7] text-graphite">
                    {limit.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CaseFooter repo={REPO} live={STORE} liveLabel="Microsoft Store">
          Electron &middot; Node&rsquo;s built-in SQLite &middot; plain
          JavaScript, no UI framework &middot; type-checked with TypeScript
          over JSDoc &middot; Playwright UI tests &middot; electron-builder for
          the installer and the Store package &middot; GitHub Actions with
          SHA-pinned actions and Dependabot.
          <br />
          Every excerpt above is copied from the repository, and every figure
          is counted from it.
        </CaseFooter>
      </main>
    </>
  );
}
