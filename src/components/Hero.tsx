import { useEffect, useRef, useState } from 'react';
import HeroCanvas from './HeroCanvas';
import styles from './Hero.module.css';

const roles = [
  'Full Stack Developer',
  'React & Node.js Dev',
  'Compiler Designer',
  'B.Tech CSE | 3rd Year',
  'Open to Internships 🚀',
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const current = roles[roleIndex];
    const speed = isDeleting ? 40 : 80;
    const pause = isDeleting ? 800 : 2200;

    if (!isDeleting && charIndex === current.length) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), pause);
      return;
    }
    if (isDeleting && charIndex === 0) {
      timeoutRef.current = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex(i => (i + 1) % roles.length);
      }, speed);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setCharIndex(i => i + (isDeleting ? -1 : 1));
      setDisplayed(current.slice(0, charIndex + (isDeleting ? -1 : 1)));
    }, speed);

    return () => clearTimeout(timeoutRef.current);
  }, [charIndex, isDeleting, roleIndex]);

  return (
    <section id="hero" className={styles.hero}>
      <HeroCanvas />

      {/* Background gradient blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={`container ${styles.content}`}>
        <div className={styles.badge}>
          <span className={styles.statusDot} />
          Available for Internships & Collaboration
        </div>

        <h1 className={styles.name}>
          <span className={styles.greeting}>Hey, I'm</span>
          <span
            className={styles.nameHighlight}
            data-text="Divyansh Garg"
          >
            Divyansh Garg
          </span>
        </h1>

        <div className={styles.roleRow}>
          <span className={styles.roleText}>{displayed}</span>
          <span className={styles.cursor}>|</span>
        </div>

        <p className={styles.tagline}>
          Building real-time apps, designing programming languages,
          and crafting immersive web experiences — one commit at a time.
        </p>

        <div className={styles.actions}>
          <a href="#projects" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
            </svg>
            View My Work
          </a>

          <a
            href="/resume.pdf"
            download
            className={`btn btn-outline ${styles.resumeBtn}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Resume
          </a>

          <a
            href="https://github.com/Divyansh3105"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/divyanshgarg3105"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {[
            { value: '44+', label: 'Repositories' },
            { value: '3+', label: 'Starred Projects' },
            { value: '3rd', label: 'Year B.Tech CSE' },
          ].map(stat => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className={styles.scrollCue}>
        <div className={styles.scrollLine} />
        <span>scroll</span>
      </div>
    </section>
  );
}
