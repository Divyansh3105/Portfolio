# 🚀 Spectacular 3D Animated Portfolio Website Plan
### Divyansh Agarwal · Full Stack Developer · B.Tech CSE (3rd Year)

---

## 📌 Overview

A dark, cinematic, 3D-animated personal portfolio website for a full-stack developer fresher currently pursuing B.Tech CSE. The site is designed to impress recruiters, showcase real GitHub projects, and demonstrate both design sensibility and technical depth.

**GitHub Profile:** [github.com/Divyansh3105](https://github.com/Divyansh3105)  
**Target Audience:** Recruiters, hiring managers, open-source contributors  
**Deployment:** Vercel (free tier)  
**Build Time:** ~14 days

---

## 🎨 Design Identity

### Theme: Dark Cosmic Minimalism
A deep-space black base with electric indigo and cyan accents. Professional yet futuristic — clean typography meets floating 3D objects. The vibe: *"this developer builds things that matter."*

### Color Palette

| Role       | Color     | Hex       |
|------------|-----------|-----------|
| Background | Dark      | `#080810` |
| Primary    | Indigo    | `#6C63FF` |
| Accent     | Cyan      | `#00D4FF` |
| Highlight  | Pink      | `#FF6B9D` |
| Text       | White     | `#F0F0FF` |

### Typography

| Usage        | Font           |
|--------------|----------------|
| Display/Hero | Space Grotesk  |
| Body         | DM Sans        |
| Code         | JetBrains Mono |

### Signature Effects
- Custom cursor with a glowing dot trail
- Magnetic hover buttons
- Smooth scroll via **Lenis**
- Floating 3D geometric mesh reacting to mouse movement in the hero

---

## 🛠️ Technology Stack

### Frontend Core
| Library         | Purpose                     |
|-----------------|-----------------------------|
| React.js + Vite | Component framework         |
| Three.js / R3F  | 3D animations & WebGL       |
| GSAP            | Timeline scroll animations  |
| Framer Motion   | UI micro-animations         |

### Styling & Layout
| Library           | Purpose           |
|-------------------|-------------------|
| Tailwind CSS      | Utility styling   |
| CSS Custom Props  | Theme variables   |
| Lenis             | Smooth scrolling  |

### 3D & Visual
| Library               | Purpose                       |
|-----------------------|-------------------------------|
| @react-three/fiber    | React + Three.js bridge       |
| @react-three/drei     | Ready-made 3D helpers         |
| GLSL Shaders          | Custom GPU particle effects   |
| Spline (optional)     | No-code 3D object import      |

### Deployment & Tools
| Tool              | Purpose                  |
|-------------------|--------------------------|
| Vercel            | Free, fast hosting       |
| GitHub Actions    | CI/CD auto-deploy        |
| EmailJS           | Contact form (no backend)|
| Google Analytics 4| Visitor tracking         |

---

## 📄 Website Sections (Scroll Flow)

### 01 · Hero Section
- Full-viewport dark canvas
- Rotating 3D wireframe globe or floating particle field
- Typewriter effect: *"I Build Full-Stack Apps"*
- Two CTAs: **View Projects** and **Download Resume**
- Animated scroll indicator

### 02 · About Me
- Split layout: left = animated 3D portrait with floating skill badges orbiting it
- Right: bio text + animated stats (projects built, tech stack size, GitHub commits)
- *"Currently pursuing B.Tech CSE · 3rd Year"* chip
- Interactive globe showing Meerut, UP location

### 03 · Skills Constellation
- 3D floating skill nodes in a galaxy/constellation layout
- Grouped by category: Frontend · Backend · Database · DevOps
- Each node is a rotating icon ball; hover to highlight
- GSAP stagger animation triggered on scroll-enter

### 04 · Projects Showcase
- Bento-grid layout with 3D tilt card effect on hover
- Each card: preview GIF/screenshot, tech stack badges, GitHub link, live demo link
- Framer Motion `AnimatePresence` filter tabs: **All · Web · Mobile · Tools**
- Hover triggers layered parallax depth effect

### 05 · Experience & Education
- Vertical animated timeline — entries animate in on scroll
- Glowing line connector drawn with GSAP `strokeDashoffset`
- Cards for: B.Tech CSE (current), internships/certifications, hackathons

### 06 · Contact
- Dark card with animated gradient border
- EmailJS-powered contact form with validation
- Email, LinkedIn, GitHub social links with hover lift
- 3D envelope Easter egg that "opens" on form submit

---

## ✨ 3D Animations Breakdown

### Hero: Floating Particle / Wireframe Mesh
- Three.js `BufferGeometry` with 2000+ animated points via GLSL shader
- Mouse move: particles react in a fluid wave
- Icosahedron wireframe with continuous rotation loop
- Mobile fallback: CSS animated gradient (no WebGL)

### Skills: 3D Orbital Constellation
- React Three Fiber scene — each skill is a `Sphere` mesh with icon texture
- `useFrame` hook drives orbital motion around a center point
- Scroll-triggered: constellation "assembles" from scattered → orbit using GSAP timeline

### Project Cards: 3D Tilt + Depth
- CSS `perspective` + `rotateX/Y` driven by mouse position
- Layered parallax: background image moves at 60% speed of card content
- Framer Motion `useMotionValue` for smooth interpolation
- Card hover: glowing neon border pulse via CSS keyframe animation

### Timeline: Scroll-Triggered Draw
- GSAP `ScrollTrigger` animates the vertical line via `strokeDashoffset`
- Each card slides in from the side as the line reaches it
- 0.2s stagger delay per timeline entry

### Preloader
- Custom SVG logo draws itself via `stroke-dashoffset` animation
- Counter from `0 → 100` while assets load
- GSAP timeline: curtain wipe exits, hero elements stagger in
- Total duration: 2.0 – 2.5 seconds

### Custom Cursor
- Two-part: small dot (instant) + large ring (lerp lag factor `0.1`)
- On link hover: ring expands, changes colour, shows "View" label
- On click: scale bounce via GSAP

---

## 🗂️ Projects to Showcase

> **Note:** GitHub's robots.txt blocked direct scraping. Verify and update these at [github.com/Divyansh3105](https://github.com/Divyansh3105).

### Featured — Full Stack App
- Your most complex MERN/MEAN project with auth, DB, REST/GraphQL API
- Position as the hero card in the bento grid
- Suggested stack tags: `React` · `Node.js` · `MongoDB` · `Express`

### Project 2 — Frontend / UI
- A visually impressive frontend project: dashboard, landing page clone, or animation-heavy UI
- Highlights design sensibility alongside code skills
- Suggested stack tags: `React` · `Tailwind` · `Framer Motion`

### Project 3 — Utility / Tool
- CLI tool, browser extension, or productivity app
- Shows backend/systems thinking; prominently feature the problem it solves
- Suggested stack tags: `Python / Node` · `API Integration`

### Project 4 — DSA / Academic
- Algorithm visualiser, data structure demo, or polished academic project
- Signals CS fundamentals to technical interviewers
- Suggested stack tags: `JavaScript` · `Visualisation`

### 💡 Project Presentation Tips
For each project, include:
1. A 15-second screen recording converted to GIF (use LICEcap or ScreenToGif)
2. 3 bullet points on challenges solved
3. Measurable impact: *"reduced load time by 40%"*, *"100+ active users"*

---

## 📅 14-Day Build Plan

### Days 1–2 · Project Setup & Design System
- Scaffold: `npm create vite@latest` → React + TypeScript
- Install: Tailwind CSS, Three.js, @react-three/fiber, @react-three/drei, GSAP, Framer Motion, Lenis
- Define CSS custom properties: colours, fonts, spacing tokens
- Figma wireframes for all 6 sections
- Folder structure:
  ```
  src/
  ├── components/
  ├── scenes/       # Three.js / R3F scenes
  ├── hooks/
  ├── data/         # project JSON, skills list
  └── styles/
  ```

### Days 3–4 · Hero Section + 3D Scene
- Build Three.js/R3F particle canvas or icosahedron wireframe mesh
- Custom cursor component (`useCursor` hook)
- GSAP preloader animation
- Typewriter text effect
- Mobile WebGL performance fallback

### Days 5–6 · About + Skills Constellation
- About section with animated stats counter (`CountUp.js`)
- Skills 3D orbital scene in React Three Fiber
- GSAP `ScrollTrigger` plugin setup across all sections
- Test all scroll-triggered animations

### Days 7–9 · Projects Section
- Bento grid layout with CSS Grid
- 3D tilt card effect (custom `useTilt` hook)
- Filter tabs with Framer Motion `AnimatePresence`
- Add real project data from GitHub
- Capture screenshots + GIFs for each project

### Days 10–11 · Timeline + Contact
- GSAP scroll-draw vertical timeline
- EmailJS integration for contact form with validation
- Social links footer
- 3D envelope Easter egg on form submit

### Days 12–13 · Polish & Performance
- Lighthouse target: **90+ Performance, 100 Accessibility**
- Lazy load all Three.js/R3F scenes (React `Suspense`)
- Code split routes with `React.lazy`
- Image optimisation → WebP format
- SEO meta tags + Open Graph preview card (for LinkedIn/Twitter shares)

### Day 14 · Deploy & Launch
- Deploy to **Vercel** (connect GitHub repo → auto-deploy on push)
- Set up custom domain (e.g. `divyansh.dev`)
- GitHub Actions CI/CD pipeline
- Submit to portfolio aggregators (Hashnode, Dev.to, Twitter/X)
- Post on LinkedIn with a 30-second screen recording

---

## 🌐 Domain Suggestions

| Domain             | Registrar | Est. Cost |
|--------------------|-----------|-----------|
| `divyansh.dev`     | Porkbun   | ~₹900/yr  |
| `divyansh3105.dev` | Porkbun   | ~₹900/yr  |
| `divyanshagarwal.me` | Namecheap | ~₹700/yr |

> A custom domain immediately signals seriousness to recruiters.

---

## 📁 Recommended Folder Structure

```
portfolio/
├── public/
│   ├── favicon.ico
│   ├── resume.pdf          # downloadable CV
│   └── og-image.png        # Open Graph preview
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Timeline.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── scenes/
│   │   ├── ParticleField.tsx   # Hero 3D scene
│   │   ├── SkillOrbit.tsx      # Skills constellation
│   │   └── Envelope.tsx        # Contact Easter egg
│   ├── hooks/
│   │   ├── useCursor.ts
│   │   ├── useTilt.ts
│   │   └── useScrollTrigger.ts
│   ├── data/
│   │   ├── projects.ts
│   │   └── skills.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## 🔗 Useful Resources

| Resource                                | Link                                            |
|-----------------------------------------|-------------------------------------------------|
| React Three Fiber Docs                  | https://docs.pmnd.rs/react-three-fiber          |
| GSAP ScrollTrigger Docs                 | https://gsap.com/docs/v3/Plugins/ScrollTrigger/ |
| Framer Motion Docs                      | https://www.framer.com/motion/                  |
| Drei (R3F helpers)                      | https://github.com/pmndrs/drei                  |
| Lenis Smooth Scroll                     | https://github.com/darkroomengineering/lenis    |
| EmailJS Setup                           | https://www.emailjs.com/docs/                   |
| Spline 3D (no-code objects)             | https://spline.design                           |
| LICEcap (GIF recorder)                  | https://www.cockos.com/licecap/                 |
| Google Fonts (Space Grotesk, DM Sans)   | https://fonts.google.com                        |
| Vercel Deployment                       | https://vercel.com/docs                         |

---

*Built with passion by Divyansh Agarwal · B.Tech CSE · 3rd Year*
