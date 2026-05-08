<div align="center">

# ✦ Divyansh Garg — Portfolio

**Full Stack Developer · B.Tech CSE · Open to Internships**

[![Live Site](https://img.shields.io/badge/Live%20Site-divyanshgarg.dev-00e5ff?style=for-the-badge&logo=netlify&logoColor=white)](https://divyanshgarg.dev)
[![Built with React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## ✦ Overview

A fully custom, animated developer portfolio built from scratch with React 19, TypeScript, Three.js, and GSAP. Featuring a live GitHub API integration, an interactive 3D hero canvas, a light/dark theme toggle, an easter-egg terminal, EmailJS-powered contact form, and a comprehensive SEO + structured-data setup.

---

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript 6 |
| **Build tool** | Vite 8 |
| **3D / Canvas** | Three.js |
| **Animations** | GSAP + ScrollTrigger, CSS animations |
| **Tilt effect** | Vanilla Tilt |
| **Email** | EmailJS (`@emailjs/browser`) |
| **Styling** | Vanilla CSS Modules + CSS custom properties |
| **Fonts** | Space Grotesk · Inter · JetBrains Mono |

---

## ✦ Features

- 🌐 **3D Hero Canvas** — interactive particle mesh rendered with Three.js
- ⚡ **GSAP Scroll Animations** — fade-up reveals and staggered section headers
- 🐙 **Live GitHub Integration** — real-time stars, forks, language, and last-updated pulled from the GitHub API (with 1-hour session-storage cache)
- 🎨 **Light / Dark Theme** — `data-theme` toggle with full CSS variable coverage
- 💬 **EmailJS Contact Form** — sends messages directly without a backend
- 🎮 **Easter Egg Terminal** — type `DG` anywhere on the page to open a hidden terminal
- 🃏 **Vanilla Tilt Cards** — 3D perspective tilt on project cards
- 📱 **Fully Responsive** — mobile → desktop layouts
- 🔍 **SEO-ready** — title, meta description, Open Graph, Twitter Card, canonical URL
- 🧠 **JSON-LD Structured Data** — `Person`, `WebSite`, and `ItemList` schemas for Google rich results
- 🗺 **Sitemap + robots.txt** — submitted to Google Search Console
- 🔒 **Security headers** — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` via Netlify

---

## ✦ Project Structure

```
portfolio/
├── public/
│   ├── favicon.svg
│   ├── og-image.png          # 1200×630 social preview card
│   ├── robots.txt
│   ├── sitemap.xml
│   └── _redirects            # Netlify SPA fallback
├── src/
│   ├── components/           # Hero, About, Skills, Projects, Journey, Contact …
│   ├── data/
│   │   └── projects.ts       # Static project metadata
│   ├── hooks/
│   │   ├── useGitHubRepos.ts # GitHub API + session cache
│   │   └── useTheme.ts       # Light/dark theme persistence
│   ├── App.tsx
│   ├── index.css             # Global design system (CSS variables, utilities)
│   └── main.tsx
├── index.html                # SEO meta, JSON-LD, Google Fonts
├── netlify.toml              # Build config + headers + caching rules
├── vite.config.ts            # Chunk splitting, ES2020 target
└── .env.example              # Required environment variable template
```

---

## ✦ Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Local setup

```bash
# 1. Clone the repo
git clone https://github.com/Divyansh3105/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your EmailJS credentials (see .env.example for instructions)

# 4. Start the dev server
npm run dev
```

The dev server starts at `http://localhost:5173`.

---

## ✦ Environment Variables

Copy `.env.example` → `.env` and fill in your values:

```env
# EmailJS — https://emailjs.com (free: 200 emails/month)
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here

# GitHub API token (optional — raises rate limit from 60 to 5,000 req/hr)
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Without EmailJS configured**, the contact form runs in simulation mode (no email is sent, but the UI behaves identically).  
> **Without a GitHub token**, the live project stats still load but are limited to 60 requests/hour.

---

## ✦ Build & Preview

```bash
# Production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

Build output goes to `dist/`. Vendor chunks are split automatically:

| Chunk | Gzip size |
|---|---|
| `vendor-three` (Three.js) | ~130 kB |
| `vendor-react` | ~60 kB |
| `vendor-gsap` | ~44 kB |
| App code | ~18 kB |

---

## ✦ Deployment

The project deploys to **Netlify** in one click via `netlify.toml`.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Divyansh3105/portfolio)

1. Connect your GitHub repo in the Netlify dashboard  
2. Add environment variables (`VITE_EMAILJS_*` and optionally `VITE_GITHUB_TOKEN`)  
3. Deploy — `netlify.toml` handles the rest automatically

---

## ✦ Featured Projects

| Project | Stack | Link |
|---|---|---|
| [TalkSpace](https://talkspace.up.railway.app) | React · Node.js · Socket.io · MongoDB · PWA | [GitHub](https://github.com/Divyansh3105/TalkSpace) |
| [GravLang](https://github.com/Divyansh3105/GravLang) | Python · Compiler Design · Lexer · Parser | [GitHub](https://github.com/Divyansh3105/GravLang) |
| [Github-Finder](https://gitdevprofile.vercel.app) | React · Vite · Chart.js · GitHub API | [GitHub](https://github.com/Divyansh3105/Github-Finder) |
| [Assassin's Creed Fan Site](https://assassins-creed-tribute.netlify.app) | HTML · CSS · Animations | [GitHub](https://github.com/Divyansh3105/Assassins-Creed) |
| [Slime Chronicles](https://slimechronicles.netlify.app) | Vanilla JS · CSS Animations | [GitHub](https://github.com/Divyansh3105/slimechronicles) |

---

## ✦ License

MIT © [Divyansh Garg](https://github.com/Divyansh3105)

---

<div align="center">

Crafted with ❤️ · Built with Vite + React + Three.js

💡 **Psst** — visit the live site and type **D** then **G** on your keyboard

</div>
