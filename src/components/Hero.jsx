import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundFx } from '../utils/sound';
import { ArrowDownRight, Compass, Terminal, Code } from 'lucide-react';
import heroArtwork from '../assets/hero_artwork.png';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const containerRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);
  const maskContainerRef = useRef(null);
  const parallaxImgRef = useRef(null);
  const metricsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic Entrance Timeline with smooth exponential easing
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.4 } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.9 }
      )
        .fromTo(
          title1Ref.current,
          { opacity: 0, y: 40, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
          { opacity: 1, y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
          '-=0.5'
        )
        .fromTo(
          title2Ref.current,
          { opacity: 0, y: 40, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
          { opacity: 1, y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
          '-=0.9'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.0 },
          '-=0.7'
        )
        .fromTo(
          ctaRef.current?.children || [],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.9 },
          '-=0.7'
        )
        .fromTo(
          metricsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          maskContainerRef.current,
          { opacity: 0, scale: 0.96, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1.6, ease: 'power3.out' },
          '-=1.4'
        );

      // Subtle scroll-driven parallax depth
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 60,
        opacity: 0.9,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Physically believable mouse inertia for artwork parallax
  const handleMouseMove = (e) => {
    if (!maskContainerRef.current) return;
    const rect = maskContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    maskContainerRef.current.style.setProperty('--mouse-x', `${percentX}%`);
    maskContainerRef.current.style.setProperty('--mouse-y', `${percentY}%`);

    if (parallaxImgRef.current) {
      const moveX = (x - rect.width / 2) * 0.025;
      const moveY = (y - rect.height / 2) * 0.025;
      gsap.to(parallaxImgRef.current, {
        x: moveX,
        y: moveY,
        duration: 1.2,
        ease: 'power3.out',
      });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-32 pb-20 flex flex-col justify-between overflow-hidden bg-[#fafafc]"
    >
      {/* Restrained Ambient Spider Web Overlay */}
      <svg
        className="absolute top-0 right-0 w-[550px] h-[550px] text-zinc-900/5 pointer-events-none z-0"
        viewBox="0 0 500 500"
        fill="none"
      >
        <line x1="500" y1="0" x2="0" y2="500" stroke="currentColor" strokeWidth="0.5" />
        <line x1="500" y1="0" x2="150" y2="500" stroke="currentColor" strokeWidth="0.5" />
        <line x1="500" y1="0" x2="300" y2="500" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="500" cy="0" r="180" stroke="#990000" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />
        <circle cx="500" cy="0" r="340" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      </svg>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Minimal Editorial Typography */}
        <div className="lg:col-span-7 flex flex-col justify-center gap-7">
          {/* Eyebrow badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-[#990000]/10 text-[#990000] border border-[#990000]/25 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#990000]" />
              AVAILABLE FOR SELECT PROJECTS 2026
            </span>
            <span className="text-xs font-mono text-zinc-400">// FULL-STACK & INTERACTIVE</span>
          </div>

          {/* Bold Editorial Headline */}
          <div className="flex flex-col gap-1">
            <h1
              ref={title1Ref}
              className="text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase tracking-tighter leading-none text-zinc-950 font-syne"
            >
              CREATIVE <span className="text-[#990000]">ARCHITECT</span>
            </h1>
            <h1
              ref={title2Ref}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-none text-zinc-800 font-syne"
            >
              &amp; FULL-STACK <span className="font-serif-italic lowercase text-zinc-500 font-normal">&amp;</span> ENGINEER
            </h1>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-base sm:text-lg text-zinc-600 max-w-xl font-normal leading-relaxed"
          >
            Engineering scalable web infrastructures, high-performance APIs, and immersive motion experiences. Threading complex backend logic with precision frontend aesthetics.
          </p>

          {/* CTA buttons */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#projects"
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className="group px-7 py-4 rounded-full bg-[#0f0f11] text-white text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-[#990000] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 shadow-sm"
            >
              <span>EXPLORE WORK</span>
              <ArrowDownRight size={15} className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <a
              href="#contact"
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className="group px-7 py-4 rounded-full border border-zinc-300 text-zinc-900 text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:border-[#990000] hover:text-[#990000] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Terminal size={14} className="text-[#990000]" />
              <span>THREAD CONNECTION</span>
            </a>
          </div>

          {/* Metrics summary */}
          <div ref={metricsRef} className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-200/70 max-w-md">
            <div>
              <p className="text-2xl font-bold font-syne text-zinc-900">06+</p>
              <p className="text-[11px] font-mono text-zinc-500 uppercase">Years Exp.</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-syne text-[#990000]">40+</p>
              <p className="text-[11px] font-mono text-zinc-500 uppercase">Projects Shipped</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-syne text-zinc-900">99.9%</p>
              <p className="text-[11px] font-mono text-zinc-500 uppercase">Code Precision</p>
            </div>
          </div>
        </div>

        {/* Right Column: Layered Images with Interactive Mouse Reveal */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div
            ref={maskContainerRef}
            className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-zinc-200/90 shadow-xl bg-zinc-950 group cursor-crosshair"
            style={{
              '--mouse-x': '50%',
              '--mouse-y': '50%',
            }}
          >
            {/* Base Layer Image (Monochrome sleek tech aesthetic) */}
            <div className="absolute inset-0 bg-zinc-950">
              <img
                ref={parallaxImgRef}
                src={heroArtwork}
                alt="Creative Developer Art"
                className="w-full h-full object-cover grayscale contrast-110 opacity-75 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-70" />
            </div>

            {/* Revealing Layer (Color + Subtle Red Silk Overlay) */}
            <div className="absolute inset-0 pointer-events-none hero-reveal-mask transition-opacity duration-300">
              <img
                src={heroArtwork}
                alt="Revealed Silk Mesh"
                className="w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-[#990000]/15 mix-blend-color-dodge" />
            </div>

            {/* Subtle thread geometry line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 400 500">
              <line x1="0" y1="0" x2="400" y2="500" stroke="#990000" strokeWidth="0.8" strokeDasharray="3 3" />
              <circle cx="200" cy="250" r="90" stroke="#990000" strokeWidth="0.8" fill="none" />
            </svg>

            {/* Card Footer Badge */}
            <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-xl bg-white/90 backdrop-blur-md border border-zinc-200 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Code size={14} className="text-[#990000]" />
                <span className="font-bold text-zinc-900">INTERACTIVE MASK</span>
              </div>
              <span className="text-[10px] text-zinc-500 uppercase">Move cursor to reveal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-10 flex items-center justify-between pt-8 border-t border-zinc-200/60 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Compass size={14} className="text-[#990000]" />
          <span>SCROLL TO UNRAVEL THREADS</span>
        </div>
        <span>01 / 06</span>
      </div>
    </section>
  );
};
