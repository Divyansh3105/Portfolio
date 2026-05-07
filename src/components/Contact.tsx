import { useRef, useState } from 'react';
import styles from './Contact.module.css';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus('sending');

    try {
      // If env vars are set, send via EmailJS; otherwise fall back to simulation
      if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
        const emailjs = (await import('@emailjs/browser')).default;
        await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      } else {
        // Fallback simulation when EmailJS not configured yet
        await new Promise(r => setTimeout(r, 1500));
      }
      setStatus('sent');
      formRef.current.reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const links = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      label: 'GitHub',
      value: 'github.com/Divyansh3105',
      href: 'https://github.com/Divyansh3105',
      color: 'var(--text-primary)',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      label: 'LinkedIn',
      value: 'in/divyanshgarg3105',
      href: 'https://www.linkedin.com/in/divyanshgarg3105',
      color: '#0a66c2',
    },
  ];

  const isEmailJSConfigured = !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className="container">
        <div className="section-header gsap-fade-up">
          <div className="section-label">Contact</div>
          <h2 className="section-title">Let's <span className="gradient-text">Build Together</span></h2>
          <p className={styles.subtitle}>
            Open to internships, freelance projects, and interesting collaborations.
            Drop me a message!
          </p>
        </div>

        <div className={styles.grid}>
          {/* Left info */}
          <div className={`${styles.infoCol} gsap-fade-up`}>
            <div className={`glass-card ${styles.statusCard}`}>
              <div className={styles.statusRow}>
                <span className={styles.statusDot} />
                <span className={styles.statusText}>Available for opportunities</span>
              </div>
              <p className={styles.statusDesc}>
                Currently a 3rd year B.Tech CSE student actively seeking internships
                in full-stack development. Response time: usually within 24 hours.
              </p>
            </div>

            {links.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`glass-card ${styles.linkCard}`}
              >
                <span className={styles.linkIcon} style={{ color: link.color }}>{link.icon}</span>
                <div>
                  <div className={styles.linkLabel}>{link.label}</div>
                  <div className={styles.linkValue}>{link.value}</div>
                </div>
                <svg className={styles.linkArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </a>
            ))}

            <div className={`glass-card ${styles.funFact}`}>
              <span>💡</span>
              <p>Fun fact: I once built a full programming language in a weekend just for fun.</p>
            </div>

            {/* Terminal hint */}
            <div className={`glass-card ${styles.easterEgg}`}>
              <span className={styles.eggIcon}>🎮</span>
              <div>
                <div className={styles.eggTitle}>Developer Easter Egg</div>
                <p className={styles.eggDesc}>
                  Press <kbd className={styles.kbd}>D</kbd> then <kbd className={styles.kbd}>G</kbd> anywhere on the page to open my terminal.
                </p>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className={`glass-card ${styles.formCard} gsap-fade-up`}>
            <h3 className={styles.formTitle}>Send a Message</h3>

            {!isEmailJSConfigured && (
              <div className={styles.configBanner}>
                ⚙️ EmailJS not configured — messages are simulated.{' '}
                <a
                  href="https://emailjs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-cyan)' }}
                >
                  Set up guide ↗
                </a>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="from_name">Your Name</label>
                <input
                  id="from_name"
                  name="from_name"
                  type="text"
                  required
                  placeholder="Recruiter / Fellow Dev"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="from_email">Email Address</label>
                <input
                  id="from_email"
                  name="from_email"
                  type="email"
                  required
                  placeholder="hello@company.com"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about the opportunity..."
                  className={styles.textarea}
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${styles.submitBtn}`}
                disabled={status === 'sending' || status === 'sent'}
              >
                {status === 'idle' && (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Send Message
                  </>
                )}
                {status === 'sending' && (
                  <>
                    <span className={styles.spinner} />
                    Sending...
                  </>
                )}
                {status === 'sent'  && '✅ Message Sent!'}
                {status === 'error' && '❌ Failed — Try Again'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
