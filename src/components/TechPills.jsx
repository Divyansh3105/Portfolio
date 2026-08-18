import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundFx } from '../utils/sound';

gsap.registerPlugin(ScrollTrigger);

export const TechPills = ({
  technologies = [
    'JavaScript',
    'TypeScript',
    'React.js',
    'Node.js',
    'Express.js',
    'Python',
    'MongoDB',
    'MySQL',
  ],
  className = '',
}) => {
  const containerRef = useRef(null);
  const pillsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const validPills = pillsRef.current.filter(Boolean);
      if (validPills.length === 0) return;

      // 1. Entrance Timeline via ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 88%',
        },
        onComplete: () => {
          // 2. Continuous subtle floating animation (physically smooth & natural)
          validPills.forEach((pill, index) => {
            const floatDistance = index % 2 === 0 ? -2.5 : 2.5;
            const floatDuration = 3.2 + (index % 3) * 0.4;
            const floatDelay = index * 0.08 + (index % 2) * 0.04;

            gsap.to(pill, {
              y: floatDistance,
              duration: floatDuration,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: floatDelay,
            });
          });
        },
      });

      // Refined entrance: smooth exponential scale & rise with zero harsh bounce
      tl.fromTo(
        validPills,
        {
          scale: 0.85,
          opacity: 0,
          y: 16,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.07,
          ease: 'power3.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [technologies]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-wrap items-center gap-3 ${className}`}
    >
      {technologies.map((tech, index) => (
        <div
          key={tech}
          ref={(el) => (pillsRef.current[index] = el)}
          onMouseEnter={() => soundFx.playHover()}
          className="group relative px-5 py-2.5 rounded-full bg-white border border-zinc-200/90 shadow-sm hover:shadow-md hover:border-[#990000] hover:bg-[#990000] hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer flex items-center gap-2.5"
        >
          {/* Subtle Accent Dot */}
          <span className="w-2 h-2 rounded-full bg-[#990000] group-hover:bg-white transition-colors duration-300" />

          {/* Pill Label */}
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 group-hover:text-white transition-colors duration-300">
            {tech}
          </span>
        </div>
      ))}
    </div>
  );
};
