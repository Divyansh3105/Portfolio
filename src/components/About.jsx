import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portraitImg from '../assets/portrait.png';
import { SpiderWebDecorations } from './SpiderWebDecorations';
import { ParagraphReveal3D } from './ParagraphReveal3D';
import { TechPills } from './TechPills';
import { HangingProfile } from './HangingProfile';
import { Cpu, GraduationCap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const containerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        },
      });

      masterTl.fromTo(
        eyebrowRef.current,
        {
          y: -15,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
        }
      );

      masterTl.fromTo(
        headingRef.current,
        {
          y: 35,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
        },
        '-=0.6'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative py-28 bg-[#fafafc] text-zinc-900 border-t border-b border-zinc-200/80 overflow-hidden"
    >
      {/* Animated Corner Vector Accent Decorations */}
      <SpiderWebDecorations />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Eyebrow Label with Small Spider Graphic */}
        <div ref={eyebrowRef} className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 rounded-full bg-[#990000]/10 border border-[#990000]/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#990000]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="10" r="3" />
              <circle cx="12" cy="16" r="4" />
              <path
                d="M9 9 C6 7, 4 4, 3 2 M15 9 C18 7, 20 4, 21 2 M8 11 C5 11, 3 10, 2 8 M16 11 C19 11, 21 10, 22 8 M8 15 C5 16, 3 18, 2 21 M16 15 C19 16, 21 18, 22 21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#990000]">
            02 // ABOUT DIVYANSH GARG
          </span>
        </div>

        {/* Desktop Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Ceiling Suspended Swinging Profile Image */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative pt-4">
            <HangingProfile imageSrc={portraitImg} altText="Divyansh Garg Profile" />
          </div>

          {/* Right Column: Heading, Paragraphs, Feature Cards, Tech Pills */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-8">
            <h2
              ref={headingRef}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-tight text-zinc-950 font-syne"
            >
              CRAFTING SCALABLE{' '}
              <span className="font-serif-italic text-[#990000] font-normal lowercase">
                full-stack
              </span>{' '}
              SYSTEMS &amp; ARCHITECTURE
            </h2>

            {/* 3D Paragraph Reveal with Divyansh's Background */}
            <ParagraphReveal3D
              paragraphs={[
                "I am a final-year B.Tech Computer Science student at Graphic Era University (GPA: 8.5/10) with hands-on experience building full-stack web applications, REST API architectures, and custom compiler pipelines.",
                "From architecting TalkSpace—a real-time PWA messaging platform live on Railway—to building GravLang (an interpreted programming language built from scratch in Python) and delivering a custom Shopify storefront for a luxury jewelry client, I blend theoretical CS fundamentals with production software execution."
              ]}
              stagger={0.15}
            />

            {/* Core Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4.5 rounded-xl bg-white border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#990000]/40 transition-all duration-300 flex items-start gap-3.5">
                <Cpu className="w-5 h-5 text-[#990000] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold font-syne uppercase text-zinc-900">13+ REST API Endpoints</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">JWT authentication, bcrypt hashing, Zustand &amp; Railway live CI/CD.</p>
                </div>
              </div>

              <div className="p-4.5 rounded-xl bg-white border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#990000]/40 transition-all duration-300 flex items-start gap-3.5">
                <GraduationCap className="w-5 h-5 text-[#990000] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold font-syne uppercase text-zinc-900">B.Tech Computer Science</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Graphic Era University (GPA 8.5/10) &amp; AWS Certified.</p>
                </div>
              </div>
            </div>

            {/* Technology Stack Pills */}
            <div className="pt-4 border-t border-zinc-200/80">
              <p className="text-xs font-mono uppercase text-zinc-400 font-semibold mb-4">
                // CORE VERIFIED SKILL STACK
              </p>
              <TechPills
                technologies={['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Express.js', 'Python', 'MongoDB', 'MySQL']}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

