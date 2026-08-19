import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portraitImg from '../assets/portrait.png';
import { soundFx } from '../utils/sound';

gsap.registerPlugin(ScrollTrigger);

export const HangingProfile = ({
  imageSrc = portraitImg,
  altText = 'Developer Profile',
  className = '',
}) => {
  const containerRef = useRef(null);
  const hangingObjectRef = useRef(null);
  const profileFrameRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance: shorter fall (-400px), weightier descent (2.8s), less bouncy elastic
      gsap.fromTo(
        hangingObjectRef.current,
        {
          y: -400,
          opacity: 0,
          rotation: -2.5,
        },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 2.8,
          ease: 'elastic.out(0.8, 0.55)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
          onComplete: () => {
            // 2. Slower, subtler pendulum — smaller amplitude, longer period
            gsap.to(hangingObjectRef.current, {
              rotation: 1.2,
              transformOrigin: 'top center',
              duration: 6.0,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
          },
        }
      );

      // No ambient shadow pulse — removed per plan (avoid glow effects)
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handlePluck = () => {
    soundFx.playThreadPluck();
    if (hangingObjectRef.current) {
      gsap.to(hangingObjectRef.current, {
        rotation: -2.5,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(hangingObjectRef.current, {
            rotation: 1.2,
            duration: 2.4,
            ease: 'elastic.out(0.8, 0.45)',
          });
        },
      });
    }
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col items-center ${className}`}>
      {/* Complete Hanging Object Container */}
      <div
        ref={hangingObjectRef}
        onMouseEnter={handlePluck}
        className="relative flex flex-col items-center group cursor-pointer z-10"
        style={{ transformOrigin: 'top center' }}
      >
        {/* Top Ceiling Anchor Pin */}
        <div className="w-3 h-3 rounded-full bg-[#990000] border-2 border-white shadow-sm z-20" />

        {/* Vertical Thread (Responsive length) */}
        <div className="w-0.5 h-44 sm:h-56 md:h-72 lg:h-80 bg-gradient-to-b from-[#990000] via-zinc-800 to-[#990000] opacity-85 transition-all duration-500 group-hover:bg-[#990000]" />

        {/* Thread Connection Ring Anchor */}
        <div className="w-5 h-5 -mt-1 rounded-full border-2 border-[#990000] bg-white flex items-center justify-center shadow-md z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-[#990000]" />
        </div>

        {/* Circular Profile Image Frame — no pulsing glow */}
        <div
          ref={profileFrameRef}
          className="relative mt-1 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full p-2 bg-gradient-to-b from-[#990000] via-zinc-950 to-[#990000] border-4 border-[#990000] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(153, 0, 0, 0.08)' }}
        >
          {/* Inner Image Container */}
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/90 bg-zinc-950 shadow-inner">
            <img
              src={imageSrc}
              alt={altText}
              className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          </div>

          {/* Status Badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-zinc-200/80 shadow-md flex items-center gap-2 text-xs font-mono shrink-0 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-zinc-900 uppercase tracking-wider">SUSPENDED THREAD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
