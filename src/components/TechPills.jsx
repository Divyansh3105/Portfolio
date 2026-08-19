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
          // 2. Subtler, slower floating — less amplitude, longer period
          validPills.forEach((pill, index) => {
            const floatDistance = index % 2 === 0 ? -1.5 : 1.5;
            const floatDuration = 4.0 + (index % 3) * 0.5;
            const floatDelay = index * 0.1 + (index % 2) * 0.05;

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

      // Refined entrance: longer duration, wider stagger
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
          duration: 1.1,
          stagger: 0.09,
          ease: 'expo.out',
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
          className="group relative px-5 py-2.5 rounded-full bg-white border border-zinc-200/90 shadow-sm hover:shadow-md hover:border-[#990000] hover:bg-[#990000] hover:-translate-y-0.5 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-center gap-2.5"
        >
          {/* Subtle Accent Dot */}
          <span className="w-2 h-2 rounded-full bg-[#990000] group-hover:bg-white transition-colors duration-400" />

          {/* Pill Label */}
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 group-hover:text-white transition-colors duration-400">
            {tech}
          </span>
        </div>
      ))}
    </div>
  );
};
