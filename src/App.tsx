import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Terminal from './components/Terminal';

import './index.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    // ── Custom Cursor ──
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    const onMouseMove = (e: MouseEvent) => {
      if (!dot || !ring) return;
      const { clientX: x, clientY: y } = e;
      dot.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      ring.style.transform = `translate(${x - 18}px, ${y - 18}px)`;
    };

    const onMouseEnterLink = () => ring?.classList.add('hovered');
    const onMouseLeaveLink = () => ring?.classList.remove('hovered');

    window.addEventListener('mousemove', onMouseMove);
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterLink);
      el.addEventListener('mouseleave', onMouseLeaveLink);
    });

    // ── Scroll Progress Bar ──
    const progressBar = document.getElementById('scroll-progress');
    const onScroll = () => {
      if (!progressBar) return;
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      progressBar.style.width = `${scrolled * 100}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── GSAP Scroll Animations ──
    gsap.utils.toArray<Element>('.gsap-fade-up').forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          delay: (el as HTMLElement).style.getPropertyValue('--delay')
            ? parseFloat((el as HTMLElement).style.getPropertyValue('--delay'))
            : (i % 4) * 0.05,
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ── Stagger section titles ──
    gsap.utils.toArray<Element>('.section-header').forEach(header => {
      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
          },
        }
      );
    });

    // ── Cleanup ──
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      document.querySelectorAll('a, button').forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
      });
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // ── Terminal Easter Egg: type "dg" anywhere ──
  useEffect(() => {
    const SEQ = ['d', 'g'];
    let step = 0;
    let timer: ReturnType<typeof setTimeout>;

    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key.toLowerCase() === SEQ[step]) {
        step++;
        clearTimeout(timer);
        if (step === SEQ.length) {
          setTerminalOpen(true);
          step = 0;
        } else {
          // Reset if next key not pressed within 1s
          timer = setTimeout(() => { step = 0; }, 1000);
        }
      } else {
        step = 0;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {/* UI overlays */}
      <div id="cursor-dot" />
      <div id="cursor-ring" />
      <div id="scroll-progress" />
      <div className="noise-overlay" />

      {/* Terminal Easter Egg */}
      {terminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}

      {/* App */}
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
      </main>

      <footer
        style={{
          textAlign: 'center',
          padding: '2rem',
          borderTop: '1px solid hsla(185, 100%, 52%, 0.1)',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          background: 'hsla(225, 28%, 5%, 0.9)',
        }}
      >
        <p>
          Crafted with ❤️ by{' '}
          <span style={{ color: 'var(--accent-cyan)' }}>Divyansh Garg</span>
          {' '}· Built with Vite + React + Three.js · {new Date().getFullYear()}
        </p>
        <p style={{ marginTop: '0.4rem', opacity: 0.5, fontSize: '0.68rem' }}>
          💡 Psst — try typing <strong>D</strong> then <strong>G</strong> on your keyboard
        </p>
      </footer>
    </>
  );
}

export default App;
