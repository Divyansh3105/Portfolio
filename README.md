# 🕸️ DIVYANSH GARG — Personal Portfolio Website

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12.5-88CE02?logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Vite](https://img.shields.io/badge/Vite-6.0.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A cinematic, high-performance personal portfolio website built for **Divyansh Garg** — Full-Stack Engineer, Systems Architect, and B.Tech Computer Science student at Graphic Era University.

Designed with a spider-web-inspired visual motif, editorial typography, GSAP ScrollTrigger motion, custom Web Audio feedback, and direct EmailJS integration.

---

## ✨ Features

- **🕸️ Spider-Web Visual Motif**: Subtle geometric silk web lines, suspended ceiling thread anchors, and ambient particle node mesh physics.
- **🎬 GSAP & ScrollTrigger Choreography**:
  - Ceiling-suspended circular profile image with natural pendulum swinging physics (`sine.inOut` easing) and soft crimson shadow glow.
  - 3D perspective paragraph reveals (`rotateX` stagger).
  - Exponential entrance timelines (`power4.out`).
- **💼 Interactive Project Showcase**: Filterable showcase featuring real production projects (**TalkSpace**, **GravLang**, **Kesav Diamond**, **Public Utility Management System**) with detail specification modals.
- **📧 EmailJS Direct Transmissions**: Native client-side form submission via EmailJS REST API delivering inquiries directly to Gmail inbox.
- **🔊 Web Audio API Synthesizer**: Custom synthesized UI sound effects for hover, clicks, and thread plucks without external audio assets.
- **🎯 Dual-Ring Trailing Cursor**: Interactive custom cursor ring with smooth inertia trailing and expansion over hoverable targets.
- **📱 60FPS Mobile Optimization**: Throttled particle node counts and hardware-accelerated transforms (`translate3d`, `scale`, `opacity`) for smooth execution across all viewports.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 19, JavaScript (ESNext)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), Vanilla CSS tokens
- **Animations**: GSAP (GreenSock Animation Platform) & ScrollTrigger plugin
- **Icons**: Lucide React + Inline SVG Components
- **Audio**: HTML5 Web Audio API
- **Form Engine**: EmailJS REST API
- **Build Tool**: Vite 6

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Divyansh3105/portfolio.git
cd portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (see `.env.example`):
```env
VITE_EMAILJS_SERVICE_ID=service_22zn87a
VITE_EMAILJS_TEMPLATE_ID=template_zsxyyth
VITE_EMAILJS_PUBLIC_KEY=4x9C8FmZOMfeagK__
```

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```text
├── public/
│   ├── favicon.svg             # Custom web icon
│   └── resume.pdf              # Verified PDF resume
├── src/
│   ├── assets/                 # Project screenshots & portrait images
│   │   ├── TalkSpace.png
│   │   ├── GravLang.png
│   │   ├── Public Utility Mangement.png
│   │   ├── portrait.png
│   │   └── hero_artwork.png
│   ├── components/
│   │   ├── Navbar.jsx          # Header navigation with audio toggle & resume link
│   │   ├── Hero.jsx            # Full-screen interactive radial mask hero section
│   │   ├── About.jsx           # Bio, B.Tech background & hanging profile frame
│   │   ├── HangingProfile.jsx  # Suspended profile image with GSAP swinging physics
│   │   ├── ParagraphReveal3D.jsx # 3D perspective text unroll component
│   │   ├── TechPills.jsx       # Floating technology stack pills
│   │   ├── SpiderWebDecorations.jsx # Rotating corner spider-web graphics
│   │   ├── Projects.jsx        # Filterable project grid & modal detail viewer
│   │   ├── ProjectModal.jsx    # Detailed project specification modal
│   │   ├── Journey.jsx         # Career & education timeline with vertical silk thread
│   │   ├── Skills.jsx          # Technical skills progress matrices
│   │   ├── Contact.jsx         # EmailJS direct contact form & direct email copy
│   │   ├── Footer.jsx          # Back to top button & social links
│   │   ├── CustomCursor.jsx    # Dual-ring cursor trailing component
│   │   ├── WebCanvas.jsx       # Ambient particle web mesh canvas
│   │   └── SocialIcons.jsx     # SVGs for GitHub, LinkedIn, Twitter
│   ├── utils/
│   │   └── sound.js            # Web Audio API synthesizer
│   ├── App.jsx                 # Master application component & active section tracker
│   ├── index.css               # Tailwind CSS imports & custom keyframes
│   └── main.jsx                # React root entry point
├── .env                        # Environment variables (gitignored)
├── .env.example                # Template for environment variables
├── vite.config.js              # Vite configuration with Tailwind CSS plugin
└── README.md                   # Project documentation
```

---

## 👤 Author

**Divyansh Garg**
- 🎓 B.Tech Computer Science Student @ Graphic Era University, Dehradun
- 📧 Email: [divyanshgarg3105@gmail.com](mailto:divyanshgarg3105@gmail.com)
- 🐙 GitHub: [@Divyansh3105](https://github.com/Divyansh3105)
- 💼 LinkedIn: [divyanshgarg3105](https://linkedin.com/in/divyanshgarg3105/)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
