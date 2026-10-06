/**
 * Every piece of copy on the site lives here so the components stay about
 * layout and motion. Merged from both portfolio builds: the V2 voice and
 * structure, carrying the older site's harder detail — project highlights,
 * live/repo links, achievements and certification issuers.
 */

/* Two sizes per shot. `image` is the full-width plate the modal shows; the
   `-thumb` at 800w is what the index plates use, and they are the hot path -
   eight of them render inline on touch. Serving the 1600w file into a 352px
   slot was costing roughly 800KB a visit for imagery nobody had opened yet. */
import talkspaceImg from "../assets/talkspace.webp";
import talkspaceThumb from "../assets/talkspace-thumb.webp";
import gravlangImg from "../assets/gravlang.webp";
import gravlangThumb from "../assets/gravlang-thumb.webp";
import utilityImg from "../assets/utility.webp";
import utilityThumb from "../assets/utility-thumb.webp";
import kesavImg from "../assets/kesav.webp";
import kesavThumb from "../assets/kesav-thumb.webp";
import playdexImg from "../assets/playdex.webp";
import playdexThumb from "../assets/playdex-thumb.webp";
import cipherImg from "../assets/cipher.webp";
import cipherThumb from "../assets/cipher-thumb.webp";
import gitfinderImg from "../assets/gitfinder.webp";
import gitfinderThumb from "../assets/gitfinder-thumb.webp";
import solarImg from "../assets/solar.webp";
import solarThumb from "../assets/solar-thumb.webp";

export const profile = {
  first: "Divyansh",
  last: "Garg",
  role: "Full-Stack Developer",
  stack: "React · Node · MongoDB",
  tagline: "I ship production code, not just tutorials.",
  location: "Meerut, Uttar Pradesh, India",
  status: "Open to SWE internships & entry-level roles",
  email: "divyanshgarg3105@gmail.com",
  phone: "+91 7535009007",
  github: "https://github.com/Divyansh3105",
  linkedin: "https://www.linkedin.com/in/divyanshgarg3105",
  live: "https://divyanshgarg3105.netlify.app",
  // BASE_URL is "/" - the site is served from the root on Netlify.
  resume: `${import.meta.env.BASE_URL}Divyansh_Garg_Resume.pdf`,
  // Counted by the build from the GitHub API rather than typed here, because
  // a number that only changes when someone remembers to change it is a
  // number that is quietly wrong most of the time. See scripts/build-facts.js.
  repoCount: __REPO_COUNT__,
};

export const about = {
  heading: ["Interface to", "infrastructure,", "end to end."],
  paragraphs: [
    "I build full-stack products from the interface down to the backend, and I go looking for the engineering problems no tutorial covers. When I wanted to understand how languages actually work, I didn't read about it — I wrote GravLang, an interpreted language in Python with its own lexer, parser, AST and tree-walking interpreter.",
    "That instinct runs through everything: TalkSpace, a real-time platform with cookie-based JWT auth, Google sign-in and 1:1 video calls; Playdex, a desktop app now on the Microsoft Store; a PHP/MySQL billing system running in production on a normalised six-table schema; a Shopify storefront I shipped end to end for a luxury jewelry brand in my first paid engineering role.",
    "I'm a B.Tech CSE student at Graphic Era Hill University (8.5/10 GPA) graduating in 2027, and I teach frontend fundamentals to new developers at Blaze Forge. Right now I'm looking for a team where I can ship real product from day one.",
  ],
  stats: [
    { value: String(profile.repoCount), label: "Public repos" },
    { value: "8.5", label: "GPA / 10" },
    { value: "2027", label: "B.Tech CSE" },
    { value: "2", label: "Roles shipped" },
  ],
};

/**
 * Grouped rather than a flat list, so the toolkit reads as three areas of
 * competence instead of one undifferentiated wall of nouns.
 */
export const skillGroups = [
  {
    title: "Languages",
    items: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C / C++",
      "PHP",
      "SQL",
    ],
  },
  {
    title: "Frontend",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "GSAP",
      "Zustand",
      "TanStack Query",
      "PWA",
      "Shopify Liquid",
    ],
  },
  {
    title: "Backend & tooling",
    items: [
      "Node.js",
      "Express",
      "FastAPI",
      "REST APIs",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "WebRTC",
      "Git & GitHub Actions",
    ],
  },
];

/** Flat view of the same list, for anything that wants a single row. */
export const skills = skillGroups.flatMap((group) => group.items);

export const projects = [
  {
    id: "talkspace",
    featured: true,
    index: "01",
    name: "TalkSpace",
    kicker: "Real-time platform",
    category: "Full-stack",
    year: "2026",
    status: "Live in production",
    image: talkspaceImg,
    thumb: talkspaceThumb,
    summary:
      "A full-stack communication platform with auth-based onboarding, live chat, 1:1 video calls, a friend-request graph, an installable PWA shell and a CI/CD deploy pipeline.",
    detail:
      "TalkSpace is a production full-stack communication app built on React 19, Node, Express and MongoDB. It runs JWT auth in an httpOnly cookie with bcrypt hashing and Google sign-in, Zustand and TanStack Query for client state, Stream SDK for messaging and video, an installable PWA shell, and automated deploys through GitHub Actions.",
    highlights: [
      "JWT in an httpOnly, SameSite=Strict cookie, bcrypt, and rate-limited auth routes",
      "Stream messaging and video, with the API secret kept server-side and per-user tokens minted on request",
      "PWA frontend on Zustand + TanStack Query with automated CI/CD",
    ],
    stack: [
      "React 19",
      "Node",
      "Express",
      "MongoDB",
      "Stream SDK",
      "JWT",
      "PWA",
    ],
    caseStudy: "/talkspace/",
    href: "https://talkspace-i5d2.onrender.com/",
    // Free-tier hosting sleeps when idle. The modal pings it on open so it is
    // usually awake by the time anyone clicks through, and says so in case not.
    wake: "https://talkspace-i5d2.onrender.com/",
    note: "Free-tier hosting: the first load can take about 20 seconds while the server wakes.",
    repo: "https://github.com/Divyansh3105/TalkSpace",
    tone: "ink",
  },
  {
    id: "gravlang",
    featured: true,
    index: "02",
    name: "GravLang",
    kicker: "Language design",
    category: "Systems",
    year: "2026",
    status: "Open source",
    image: gravlangImg,
    thumb: gravlangThumb,
    summary:
      "An interpreted programming language built from scratch in Python — custom lexer, recursive-descent parser, AST, tree-walking interpreter, OOP support, a GUI IDE and CLI execution.",
    detail:
      "GravLang is a programming language designed from first principles in Python. It implements the full pipeline — lexer, recursive-descent parser, abstract syntax tree and tree-walking interpreter — with object-oriented constructs and recursion, plus a native standard library, a desktop GUI IDE and a CLI runner.",
    highlights: [
      "Complete pipeline: lexer, recursive-descent parser, AST, interpreter",
      "285 passing tests, including 25 example programs run end to end",
      "Ships with both a desktop GUI IDE and a CLI runner",
    ],
    stack: ["Python", "Interpreter", "AST", "Tkinter", "CLI"],
    caseStudy: "/gravlang/",
    href: "https://github.com/Divyansh3105/GravLang",
    repo: "https://github.com/Divyansh3105/GravLang",
    tone: "blood",
  },
  {
    id: "kesav",
    featured: true,
    index: "03",
    name: "Kesav Diamond",
    kicker: "Commerce · client work",
    category: "Full-stack",
    year: "2026",
    status: "Shipped for client",
    image: kesavImg,
    thumb: kesavThumb,
    summary:
      "A custom Shopify storefront for a luxury diamond-jewelry brand, delivered end to end across a three-month engagement — theme architecture, catalog, checkout and QA.",
    detail:
      "Designed and built a responsive custom Shopify storefront for Kesav Diamond. The work covered theme architecture, product and collection structure, brand-aligned UI, payment gateway wiring, and shipping and tax rules — taken from requirements discovery through to go-live, working directly with the client.",
    highlights: [
      "Custom theme architecture and catalog aligned to a luxury brand direction",
      "Payment gateway, shipping and tax rules wired into a streamlined checkout",
      "Delivered solo across three months, from discovery through to go-live",
    ],
    stack: ["Shopify Liquid", "JavaScript", "CSS", "Payments", "UI/UX"],
    href: "https://kesavdiamond.com/",
    tone: "blood",
  },
  {
    id: "playdex",
    featured: true,
    index: "04",
    name: "Playdex",
    kicker: "Desktop app",
    category: "Desktop",
    year: "2026",
    status: "Microsoft Store · v1.3",
    image: playdexImg,
    thumb: playdexThumb,
    summary:
      "Finding a game used to mean opening Steam, Epic and GOG one at a time. Playdex reads all three into one library and flags the games I own twice. Published on the Microsoft Store.",
    detail:
      "Playdex is an Electron desktop app that merges Steam, Epic and GOG into a single library without logging into anything — it reads each launcher's own local files: Steam's appinfo.vdf and app manifests, Epic's catalog cache and install manifests, and GOG Galaxy's SQLite database. On top of that it tracks playtime, maps disk usage per drive, finds duplicate purchases across stores and launches each game through its own launcher.",
    highlights: [
      "Published on the Microsoft Store, which certified and signs the package",
      "Library counts match each launcher's own, and every counting rule has a fixture test",
      "34 tests including Playwright UI tests, type-checked in CI; zero runtime dependencies",
    ],
    stack: ["Electron", "JavaScript", "Node", "SQLite", "IPC", "GitHub Actions"],
    caseStudy: "/playdex/",
    href: "https://apps.microsoft.com/detail/9PMW08P8FQK8",
    liveLabel: "Microsoft Store",
    repo: "https://github.com/Divyansh3105/playdex",
    tone: "ink",
  },
  {
    id: "cipher",
    index: "05",
    name: "CIPHER",
    kicker: "AI assistant",
    category: "AI",
    year: "2026",
    status: "Open source",
    image: cipherImg,
    thumb: cipherThumb,
    summary:
      "A multi-persona AI assistant with three switchable personalities, text and voice interaction, long-term memory and document-grounded RAG over a FastAPI + Postgres backend.",
    detail:
      "CIPHER is an assistant built around three switchable personas that share one memory layer. It handles both text and voice interaction, retains long-term context across sessions, and answers from uploaded documents through a retrieval pipeline running on FastAPI and Postgres.",
    highlights: [
      "Three switchable personas sharing a single long-term memory layer",
      "Document-grounded RAG over a FastAPI + Postgres backend",
      "267 backend tests under pytest, plus lint, type-check and Docker build in CI",
    ],
    stack: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "RAG"],
    href: "https://github.com/Divyansh3105/CIPHER",
    repo: "https://github.com/Divyansh3105/CIPHER",
    tone: "ink",
  },
  {
    id: "utility",
    index: "06",
    name: "Public Utility Management",
    kicker: "Production system",
    category: "Full-stack",
    year: "2025",
    status: "Live",
    image: utilityImg,
    thumb: utilityThumb,
    summary:
      "A PHP/MySQL application that runs billing, payments and records for electricity and water services, with separate admin, employee and customer dashboards.",
    detail:
      "A full-stack PHP and MySQL application automating billing and payment across water and electricity utilities. It runs on a normalised relational schema of six interlinked tables covering accounts, meters, bills and payments, with separate dashboards for administrators, employees and customers.",
    highlights: [
      "Normalised MySQL schema across 6+ interlinked tables",
      "Automated bill generation, payment verification and account management",
      "Separate admin, employee and customer dashboards",
    ],
    stack: ["PHP", "MySQL", "JavaScript", "CRUD", "Dashboards"],
    href: "https://publicutilitymanagementsystem.gt.tc",
    repo: "https://github.com/Divyansh3105/Public-Utility-Management-System",
    tone: "ink",
  },
  {
    id: "gitfinder",
    index: "07",
    name: "GitHub Finder",
    kicker: "Data dashboard",
    category: "Frontend",
    year: "2026",
    status: "Live",
    image: gitfinderImg,
    thumb: gitfinderThumb,
    summary:
      "A developer-profile dashboard over the GitHub REST API — repository search, language breakdowns and contribution charts rendered with Chart.js.",
    detail:
      "A dashboard over the GitHub REST API that resolves any username into a profile view: repository search and filtering, per-language breakdowns computed across a user's repos, and contribution activity charted with Chart.js.",
    highlights: [
      "Repository search and filtering over the GitHub REST API",
      "Per-language breakdowns computed across a user's repositories",
      "Contribution activity charted with Chart.js",
    ],
    stack: ["React", "Vite", "GitHub API", "Chart.js"],
    href: "https://gitdevprofile.vercel.app/",
    repo: "https://github.com/Divyansh3105/Github-Finder",
    tone: "blood",
  },
  {
    id: "solar",
    index: "08",
    name: "SolarExplorer",
    kicker: "CSS experiment",
    category: "Frontend",
    year: "2026",
    status: "Live",
    image: solarImg,
    thumb: solarThumb,
    summary:
      "An interactive 3D solar system with orbital mechanics, built entirely in HTML and CSS — no JavaScript, no framework, just transforms and keyframes.",
    detail:
      "A solar system rendered entirely with CSS 3D transforms and keyframe animation — orbital periods, axial tilt and relative scale, with no JavaScript and no framework anywhere in the build.",
    highlights: [
      "Orbital mechanics expressed purely in CSS keyframes and 3D transforms",
      "Zero JavaScript — no framework, no runtime, no dependencies",
      "Relative orbital periods and axial tilt modelled per planet",
    ],
    stack: ["HTML", "CSS 3D", "Animation"],
    href: "https://solarexplorers.netlify.app/",
    repo: "https://github.com/Divyansh3105/SolarExplorer",
    tone: "ink",
  },
];

export const experience = [
  {
    org: "Blaze Forge",
    role: "Frontend Development Instructor",
    period: "Jul 2026 — Present",
    place: "Dehradun",
    body: "Teaching HTML, CSS and JavaScript to aspiring developers — breaking core web fundamentals into practical lessons and building debugging instincts that stick.",
    achievements: [
      "Turning core web fundamentals into lessons that hold up under real projects",
      "Coaching debugging technique rather than memorised fixes",
    ],
    tags: ["Teaching", "HTML", "CSS", "JavaScript"],
    current: true,
  },
  {
    org: "Kesav Diamond",
    role: "Full Stack Engineer",
    period: "Mar 2026 — May 2026",
    place: "Dehradun",
    body: "Shipped a production Shopify storefront for a luxury diamond-jewelry brand: responsive UI/UX aligned to the brand's premium direction, restructured product and collection pages, and cross-device QA.",
    achievements: [
      "Designed and built a responsive custom storefront matching a luxury brand direction",
      "Configured payment gateway, shipping and tax rules for a streamlined checkout",
      "Worked directly with the client from discovery through to live deployment",
    ],
    tags: ["Shopify", "Responsive", "UI/UX", "eCommerce"],
  },
  {
    org: "Graphic Era Hill University",
    role: "B.Tech, Computer Science",
    period: "Aug 2023 — Jul 2027",
    place: "Dehradun",
    body: "Computer Science undergraduate carrying an 8.5/10 GPA. Coursework in systems, databases and algorithms — most of which ends up as something I build and put online.",
    achievements: [
      "8.5 / 10 cumulative GPA",
      "Focus on systems, databases, algorithms and REST API design",
      "Coursework carried into shipped projects: TalkSpace, GravLang, the utility billing system",
    ],
    tags: ["CSE", "GPA 8.5/10", "Systems", "Databases"],
  },
];

export const certifications = [
  {
    name: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services",
    year: "2026",
  },
  {
    name: "Generative AI: Introduction and Applications",
    issuer: "IBM",
    year: "2025",
  },
  { name: "Fundamentals of UI/UX Design", issuer: "Microsoft", year: "2025" },
  { name: "Claude 101", issuer: "Anthropic", year: "2025" },
];

export const nav = [
  { label: "About", href: "#about", id: "about" },
  { label: "Work", href: "#work", id: "work" },
  { label: "Path", href: "#path", id: "path" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const marquee = [
  "Ships production code",
  "Not just tutorials",
  "React · Node · MongoDB",
  "Open to internships",
];

/** Options offered by the contact form's project-type selector. */
export const projectTypes = [
  "Full-stack web application",
  "Frontend / UI engineering",
  "Shopify storefront",
  "Full-time or internship role",
  "Something else",
];
