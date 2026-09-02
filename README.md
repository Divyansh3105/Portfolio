# Divyansh Garg — Portfolio

A cinematic single-page portfolio for a full-stack developer. White/light-grey
ground, deep red and black accents, bold editorial typography, and a
spider-web visual language drawn entirely from generated SVG geometry.

This is a merge of two earlier builds. The design system, motion architecture
and content layer come from the second; the substance and the working features
come from the first — real project screenshots, the project detail modal, the
EmailJS contact form, the resume, scroll-spy navigation, interface sound and
the ambient node mesh. See **Merge notes** at the end for what changed on the
way across.

## Stack

| | |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 (`@theme` design tokens in `src/index.css`) |
| Motion | GSAP 3 + ScrollTrigger |
| Fonts | Archivo (display) · IBM Plex Mono (labels) |
| Mail | EmailJS REST endpoint (no SDK) |
| Deploy | Netlify (`netlify.toml` + SPA redirect) |

No animation, icon, or utility libraries beyond those — every web, spider,
icon and generated project plate is drawn from code.

## Environment

The contact form posts to EmailJS. Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` and
`VITE_EMAILJS_PUBLIC_KEY`. With any of them missing the form shows its error
state and points the visitor at the mailto address instead of failing silently.

## Running it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run lint
```

## Layout

```
src/
  App.jsx              page composition + one post-font ScrollTrigger refresh
  data/site.js         all copy: profile, about, skills, projects, experience
  lib/
    gsap.js            registers ScrollTrigger; motion/pointer capability checks
    web.js             orb-web and cobweb path geometry
    sound.js           Web Audio UI tones; off by default, choice persisted
  components/
    Nav.jsx            fixed bar (difference blend), scroll spy, resume, sound
    Hero.jsx           layered light/dark plates with a cursor-tracked mask
    About.jsx          portrait on a thread, clip-path heading, grouped toolkit
    Marquee.jsx        CSS-only ticker
    Work.jsx           project index with a cursor-following preview plate
    ProjectPlate.jsx   screenshot cover, or generated art where there is none
    ProjectModal.jsx   full project specification in an accessible dialog
    Path.jsx           experience timeline on a scroll-drawn silk line
    Contact.jsx        EmailJS form, copy-to-clipboard, links, footer
    Cursor.jsx         trailing ring (fine pointers only)
    WebMesh.jsx        canvas node mesh tethered to the pointer (hero only)
    WebDecor.jsx       WebCorner / WebOrb / WebDrape / Thread / Spider
    Icons.jsx          inline icon set (replaces lucide-react)
```

## Motion conventions

- **GSAP owns every major move**; CSS handles only hover transitions and the
  marquee.
- **Entrance and ambient timelines are built separately** in each component, so
  a looping tween never fights a scroll-triggered one over the same property.
  Where both touch one element they are split across properties (entrance takes
  `scale`/`opacity`, ambient takes `y`).
- `gsap.context(fn, rootRef)` scopes every selector; `ctx.revert()` on unmount
  is the only teardown. Listeners are removed from the function the context
  callback *returns* — `self.add()` runs its argument immediately and is not a
  cleanup hook.
- `elastic.out` for anything hanging, `sine.inOut` for continuous motion,
  `expo.out`/`power3.out` for entrances.
- Elements GSAP reveals start `invisible` so there is no flash of
  un-animated content.
- `prefers-reduced-motion` short-circuits every timeline to `progress(1)` and
  skips all ambient loops; `pointer: fine` gates the cursor ring, the hero mask
  and the work preview (touch gets a slow drifting reveal and inline plates).

## Notes on the hero

The portrait plate stacks two copies of the same photograph: a desaturated base
and, above it, a full-colour print masked by a `radial-gradient` whose radius
and centre are CSS custom properties driven by `gsap.quickTo`. The pointer wipes
colour across the image and nothing else on the page moves with it.

The pointer listener sits on the whole section — it also feeds the parallax —
but the mask coordinates are measured against the frame, so colour can only ever
appear inside the portrait. The radius opens when the cursor comes within
`REVEAL_MARGIN` of the frame and closes when it leaves.

Two things worth knowing if you touch this: `gsap.quickTo` inherits whatever
unit the property already carries, so `--mx`/`--my` must be initialised in `px`
(seeded as `50%`, pixel offsets get written back as percentages); and a
`radial-gradient` circle radius must be a length, so `--r` can never be a
percentage either.

## Merge notes

What came across from the earlier build, and what was changed on the way:

- **Project screenshots** — the originals were 6 MB PNGs each. Re-encoded to
  WebP at 1600px wide: ~24 MB of source art became ~440 kB.
- **Project modal** — kept the content (full description, highlights, stack,
  live and source links); added real dialog semantics it did not have: focus
  trap, focus restore, `aria-modal`, scroll lock with scrollbar compensation,
  and an Escape handler that is not capturing a stale callback.
- **Contact form** — kept the EmailJS REST call; removed the hardcoded
  credential fallbacks, and stopped it reporting success when the request
  failed. A failure now says so and offers the mailto address.
- **Scroll spy** — was an unthrottled `scroll` listener measuring `offsetTop`
  on every section on every event. Now one `IntersectionObserver`.
- **Interface sound** — kept the synthesised tones; it now starts off rather
  than on, and the visitor's choice persists in `localStorage`.
- **Node mesh** — was a fixed, full-page canvas at `z-0` underneath sections
  that all paint an opaque background, so it never actually showed. It is now
  scoped to the hero, sized to its container, drawn at device pixel ratio, and
  paused while the tab is hidden.
- **Icons** — `lucide-react` supplied about a dozen single-path outlines; they
  are inlined in `Icons.jsx` and the dependency is gone.
- **Skills** — the old percentage bars (self-assessed, to the percent) are
  replaced by three named groups. Same substance, no invented precision.
- **Dropped**: the old hero's "06+ years experience" and "99.9% code precision"
  metrics, and `HangingProfile`/`SpiderWebCorners`, which were dead code.
