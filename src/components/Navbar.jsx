import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { soundFx } from '../utils/sound';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, FileText } from 'lucide-react';

export const Navbar = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP-staggered mobile menu entrance
  useEffect(() => {
    if (mobileMenuOpen && mobileNavRef.current) {
      const links = mobileNavRef.current.querySelectorAll('.mobile-nav-link');
      gsap.fromTo(
        links,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'expo.out',
        }
      );
    }
  }, [mobileMenuOpen]);

  const handleAudioToggle = () => {
    const nextState = soundFx.toggleSound();
    setAudioEnabled(nextState);
    if (nextState) soundFx.playThreadPluck();
  };

  const navLinks = [
    { label: 'HOME', href: '#hero', id: 'hero' },
    { label: 'ABOUT', href: '#about', id: 'about' },
    { label: 'WORK', href: '#projects', id: 'projects' },
    { label: 'JOURNEY', href: '#journey', id: 'journey' },
    { label: 'TECH', href: '#skills', id: 'skills' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled
          ? 'py-3 bg-white/85 backdrop-blur-md border-b border-black/5 shadow-sm'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={() => soundFx.playClick()}
          className="group flex items-center gap-3 text-lg font-bold tracking-tight uppercase font-syne text-[#0f0f11]"
        >
          <div className="relative w-8 h-8 rounded-full border border-[#990000]/40 flex items-center justify-center group-hover:border-[#990000] transition-colors duration-500">
            <svg
              className="w-4 h-4 text-[#990000] group-hover:rotate-45 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" opacity="0.4" />
              <circle cx="12" cy="12" r="3" fill="#990000" />
            </svg>
            {/* Static subtle indicator — replaces animate-ping */}
            <div className="absolute -top-1 right-0 w-1.5 h-1.5 bg-[#990000] rounded-full opacity-80" />
          </div>
          <span>
            DIVYANSH<span className="text-[#990000]">.</span>GARG
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest font-semibold uppercase text-zinc-600">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onMouseEnter={() => soundFx.playHover()}
                onClick={() => soundFx.playClick()}
                className={`relative py-1 transition-colors duration-300 hover:text-[#990000] ${
                  isActive ? 'text-[#990000]' : ''
                }`}
              >
                {link.label}
                {/* Static indicator bar — replaces animate-pulse */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#990000]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Resume + Audio Toggle + CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFx.playClick()}
            onMouseEnter={() => soundFx.playHover()}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-zinc-200 hover:border-[#990000] text-zinc-800 hover:text-[#990000] transition-colors duration-400"
          >
            <FileText size={14} className="text-[#990000]" />
            <span>RESUME</span>
          </a>

          <button
            onClick={handleAudioToggle}
            onMouseEnter={() => soundFx.playHover()}
            title={audioEnabled ? 'Mute Interaction Audio' : 'Unmute Interaction Audio'}
            className="p-2 rounded-full border border-zinc-200 hover:border-[#990000] text-zinc-700 hover:text-[#990000] transition-colors duration-400"
          >
            {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-zinc-400" />}
          </button>

          <a
            href="#contact"
            onClick={() => soundFx.playClick()}
            onMouseEnter={() => soundFx.playHover()}
            className="hidden lg:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full bg-[#0f0f11] text-white hover:bg-[#990000] hover:-translate-y-1 hover:shadow-lg transition-[transform,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-sm group"
          >
            <span>CONNECT</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              soundFx.playClick();
            }}
            className="md:hidden p-2 rounded-lg border border-zinc-200 text-zinc-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-xl z-50 flex flex-col p-8 justify-between">
          <div ref={mobileNavRef} className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-widest text-[#990000] font-mono">
              // Navigation Strands
            </p>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  soundFx.playClick();
                }}
                className="mobile-nav-link text-2xl font-syne font-bold uppercase tracking-tight text-zinc-900 hover:text-[#990000]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-8 border-t border-zinc-200 flex flex-col gap-4">
            <p className="text-xs text-zinc-500 font-mono">DIVYANSH GARG — FULL-STACK DEVELOPER</p>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 text-center text-xs font-mono font-bold uppercase tracking-wider border border-zinc-300 text-zinc-900 rounded-full flex items-center justify-center gap-2"
            >
              <FileText size={16} className="text-[#990000]" />
              <span>VIEW RESUME PDF</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-4 text-center text-xs font-bold uppercase tracking-wider bg-[#990000] text-white rounded-full"
            >
              THREAD CONNECTION
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
