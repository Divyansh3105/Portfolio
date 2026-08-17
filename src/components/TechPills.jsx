import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundFx } from '../utils/sound';

gsap.registerPlugin(ScrollTrigger);

export const TechPills = ({
  technologies = [
    'React',
    'Node.js',
    'Express',
    'PostgreSQL',
    'MongoDB',
    'Docker',
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
          start: 'top 85%',
        },
        onComplete: () => {
          // 2. Continuous subtle floating animation (staggered randomly per pill)
          validPills.forEach((pill, index) => {
            // Randomize floating distance (3px to 5px) and duration (2.2s to 3.2s)
            const floatDistance = index % 2 === 0 ? -4 : 4;
            const floatDuration = 2.2 + (index % 3) * 0.4;
            const floatDelay = index * 0.12 + (index % 2) * 0.05;

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

      // Entrance animation: scale 0.5 -> 1, opacity 0 -> 1, y 20 -> 0 with stagger: 0.1
      tl.fromTo(
        validPills,
        {
          scale: 0.5,
          opacity: 0,
          y: 20,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'back.out(1.4)', // Refined, smooth back.out easing
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
          className="group relative px-5 py-2.5 rounded-full bg-white border border-zinc-200/90 shadow-sm hover:shadow-lg hover:border-[#990000] hover:bg-[#990000] transition-all duration-300 ease-out cursor-pointer flex items-center gap-2.5"
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
