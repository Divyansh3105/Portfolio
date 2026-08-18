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
      // 1. Entrance animation: Fall down from y: -600 with smooth elastic easing
      gsap.fromTo(
        hangingObjectRef.current,
        {
          y: -600,
          opacity: 0,
          rotation: -3.5,
        },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 2.2,
          ease: 'elastic.out(1, 0.45)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
          onComplete: () => {
            // 2. Physically natural, slow pendulum swinging
            gsap.to(hangingObjectRef.current, {
              rotation: 1.8,
              transformOrigin: 'top center',
              duration: 4.8,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
          },
        }
      );

      // 3. Restrained, soft ambient shadow pulse (~3.0s, sine.inOut, yoyo: true)
      if (profileFrameRef.current) {
        gsap.to(profileFrameRef.current, {
          boxShadow: '0 0 20px rgba(153, 0, 0, 0.28), 0 0 40px rgba(153, 0, 0, 0.12)',
          duration: 3.0,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handlePluck = () => {
    soundFx.playThreadPluck();
    if (hangingObjectRef.current) {
      gsap.to(hangingObjectRef.current, {
        rotation: -3.5,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(hangingObjectRef.current, {
            rotation: 1.8,
            duration: 2.0,
            ease: 'elastic.out(1, 0.4)',
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
        <div className="w-0.5 h-44 sm:h-56 md:h-72 lg:h-80 bg-gradient-to-b from-[#990000] via-zinc-800 to-[#990000] opacity-85 transition-all duration-300 group-hover:bg-[#990000]" />

        {/* Thread Connection Ring Anchor */}
        <div className="w-5 h-5 -mt-1 rounded-full border-2 border-[#990000] bg-white flex items-center justify-center shadow-md z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-[#990000]" />
        </div>

        {/* Circular Profile Image Frame */}
        <div
          ref={profileFrameRef}
          className="relative mt-1 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full p-2 bg-gradient-to-b from-[#990000] via-zinc-950 to-[#990000] border-4 border-[#990000] transition-transform duration-500 group-hover:scale-[1.025]"
          style={{ boxShadow: '0 0 14px rgba(153, 0, 0, 0.18), 0 0 28px rgba(153, 0, 0, 0.08)' }}
        >
          {/* Inner Image Container */}
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/90 bg-zinc-950 shadow-inner">
            <img
              src={imageSrc}
              alt={altText}
              className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
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
