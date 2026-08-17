import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SpiderWebDecorations = ({ className = '' }) => {
  const containerRef = useRef(null);
  const leftThreadRef = useRef(null);
  const rightThreadRef = useRef(null);
  const leftWebRef = useRef(null);
  const rightWebRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const threads = [leftThreadRef.current, rightThreadRef.current].filter(Boolean);
      const webs = [leftWebRef.current, rightWebRef.current].filter(Boolean);

      if (threads.length === 0 && webs.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
      });

      if (threads.length > 0) {
        tl.fromTo(
          threads,
          { scaleY: 0, opacity: 0, transformOrigin: 'top center' },
          { scaleY: 1, opacity: 0.5, duration: 1.2, ease: 'power3.out' }
        );
      }

      if (webs.length > 0) {
        tl.fromTo(
          webs,
          { y: -30, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 0.14, scale: 1, duration: 1.4, ease: 'power3.out' },
          threads.length > 0 ? '-=0.9' : 0
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
    >
      {/* Upper-Left Architectural Vector Accent */}
      <div className="absolute top-0 left-6 sm:left-12 flex flex-col items-center">
        <div
          ref={leftThreadRef}
          className="w-0.5 h-16 sm:h-24 bg-gradient-to-b from-[#990000]/60 via-zinc-800/40 to-transparent"
        />

        <div
          ref={leftWebRef}
          className="w-56 h-56 sm:w-64 sm:h-64 opacity-15"
        >
          <svg
            viewBox="0 0 300 300"
            fill="none"
            className="w-full h-full text-zinc-900"
          >
            <line x1="150" y1="150" x2="150" y2="0" stroke="currentColor" strokeWidth="0.8" />
            <line x1="150" y1="150" x2="300" y2="150" stroke="currentColor" strokeWidth="0.8" />
            <line x1="150" y1="150" x2="150" y2="300" stroke="currentColor" strokeWidth="0.8" />
            <line x1="150" y1="150" x2="0" y2="150" stroke="currentColor" strokeWidth="0.8" />
            <line x1="150" y1="150" x2="256" y2="44" stroke="currentColor" strokeWidth="0.6" />
            <line x1="150" y1="150" x2="256" y2="256" stroke="currentColor" strokeWidth="0.6" />
            <line x1="150" y1="150" x2="44" y2="256" stroke="currentColor" strokeWidth="0.6" />
            <line x1="150" y1="150" x2="44" y2="44" stroke="currentColor" strokeWidth="0.6" />

            <polygon points="150,110 178,122 190,150 178,178 150,190 122,178 110,150 122,122" stroke="#990000" strokeWidth="0.8" fill="none" />
            <polygon points="150,70 206,94 230,150 206,206 150,230 94,206 70,150 94,94" stroke="currentColor" strokeWidth="0.6" fill="none" />
            <circle cx="150" cy="150" r="135" stroke="#990000" strokeWidth="0.6" strokeDasharray="4 4" opacity="0.4" fill="none" />
          </svg>
        </div>
      </div>

      {/* Upper-Right Architectural Vector Accent */}
      <div className="absolute top-0 right-6 sm:right-12 flex flex-col items-center">
        <div
          ref={rightThreadRef}
          className="w-0.5 h-16 sm:h-24 bg-gradient-to-b from-[#990000]/60 via-zinc-800/40 to-transparent"
        />

        <div
          ref={rightWebRef}
          className="w-56 h-56 sm:w-64 sm:h-64 opacity-15"
        >
          <svg
            viewBox="0 0 300 300"
            fill="none"
            className="w-full h-full text-zinc-900"
          >
            <line x1="150" y1="150" x2="150" y2="0" stroke="currentColor" strokeWidth="0.8" />
            <line x1="150" y1="150" x2="300" y2="150" stroke="currentColor" strokeWidth="0.8" />
            <line x1="150" y1="150" x2="150" y2="300" stroke="currentColor" strokeWidth="0.8" />
            <line x1="150" y1="150" x2="0" y2="150" stroke="currentColor" strokeWidth="0.8" />
            <line x1="150" y1="150" x2="256" y2="44" stroke="currentColor" strokeWidth="0.6" />
            <line x1="150" y1="150" x2="256" y2="256" stroke="currentColor" strokeWidth="0.6" />
            <line x1="150" y1="150" x2="44" y2="256" stroke="currentColor" strokeWidth="0.6" />
            <line x1="150" y1="150" x2="44" y2="44" stroke="currentColor" strokeWidth="0.6" />

            <polygon points="150,110 178,122 190,150 178,178 150,190 122,178 110,150 122,122" stroke="#990000" strokeWidth="0.8" fill="none" />
            <polygon points="150,70 206,94 230,150 206,206 150,230 94,206 70,150 94,94" stroke="currentColor" strokeWidth="0.6" fill="none" />
            <circle cx="150" cy="150" r="135" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 4" opacity="0.4" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};

