import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundFx } from '../utils/sound';
import { Briefcase, Calendar, MapPin, Award, CheckCircle2, GitBranch, GraduationCap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Journey = () => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const nodesRef = useRef([]);

  const milestones = [
    {
      role: 'FULL STACK DEVELOPER (FREELANCE)',
      company: 'Kesav Diamond — Luxury Jewelry Storefront',
      period: 'MAR 2026 — MAY 2026',
      location: 'Dehradun / Remote',
      description: 'Delivered an independent 3-month freelance engagement for a luxury jewelry brand, configuring custom theme architecture, product catalog, payment gateway, and shipping logistics.',
      achievements: [
        'Designed & developed responsive custom Shopify storefront aligning with luxury brand UI',
        'Configured payment gateway, shipping, and tax rules streamlining checkout conversion',
        'Worked directly with paying client from initial requirements discovery through live deployment',
      ],
      tags: ['Shopify Liquid', 'JavaScript', 'CSS3', 'Payment Gateway', 'Client Management'],
    },
    {
      role: 'B.TECH IN COMPUTER SCIENCE',
      company: 'Graphic Era University, Dehradun',
      period: 'AUG 2023 — JUL 2027',
      location: 'Dehradun, Uttarakhand, India',
      description: 'Final-year Computer Science Engineering student with an 8.5 / 10 GPA. Specialized in Full-Stack Development, Data Structures, Compiler Design, and System Architecture.',
      achievements: [
        'Academic Performance: 8.5 / 10 Cumulative GPA',
        'Core Focus: React 19, Node.js, Express, REST API Design, OOP, and Database Normalization',
        'Built production projects including TalkSpace (Railway PWA) and GravLang (Python Compiler & IDE)',
      ],
      tags: ['B.Tech CS', 'GPA 8.5/10', 'Full-Stack Eng', 'System Design', 'Algorithms'],
    },
    {
      role: 'AWS & IBM CERTIFIED DEVELOPER',
      company: 'Amazon Web Services, IBM, Microsoft, Claude',
      period: '2025 — 2026',
      location: 'Global Certifications',
      description: 'Earned industry certifications in Cloud Computing, Generative AI Applications, UI/UX Design, and Prompt Engineering.',
      achievements: [
        'AWS Cloud Practitioner Essentials — Amazon Web Services (April 2026)',
        'Generative AI: Introduction and Applications — IBM (November 2025)',
        'Fundamentals of UI/UX Design — Microsoft (May 2025) & Claude 101 Certificate',
      ],
      tags: ['AWS Cloud', 'IBM Generative AI', 'Microsoft UI/UX', 'Claude 101'],
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Vertical line fill animation on scroll
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: true,
          },
        }
      );

      // Animate milestone nodes
      nodesRef.current.forEach((node, index) => {
        if (!node) return;
        gsap.fromTo(
          node,
          { opacity: 0, x: index % 2 === 0 ? -40 : 40, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 85%',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative py-28 bg-[#fafafc] text-zinc-900 border-b border-zinc-200/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-16 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#990000]/10 border border-[#990000]/30 flex items-center justify-center">
              <GraduationCap size={16} className="text-[#990000]" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#990000]">
              04 // EXPERIENCE &amp; ACADEMICS
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold uppercase font-syne text-zinc-950 tracking-tight">
            EVOLUTION OF THE <span className="font-serif-italic text-[#990000] font-normal lowercase">engineer</span>
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Silk Thread Center Line */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#990000] via-zinc-800 to-[#990000] z-0"
          />

          {/* Timeline Nodes */}
          <div className="flex flex-col gap-12 relative z-10">
            {milestones.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.role}
                  ref={(el) => (nodesRef.current[index] = el)}
                  className={`flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-8 relative`}
                >
                  {/* Timeline Pin Node */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-8 w-6 h-6 rounded-full bg-white border-2 border-[#990000] shadow-md flex items-center justify-center z-20 group cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-[#990000] animate-pulse" />
                  </div>

                  {/* Experience Card */}
                  <div className="w-full md:w-[calc(50%-2.5rem)] ml-12 md:ml-0 bg-white p-6 md:p-8 rounded-2xl border border-zinc-200/80 shadow-md hover:shadow-xl hover:border-[#990000]/40 transition-all duration-300 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs font-mono text-[#990000]">
                        <span className="font-bold uppercase">// {item.period}</span>
                        <span className="text-zinc-400 flex items-center gap-1">
                          <MapPin size={12} />
                          {item.location}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold font-syne uppercase text-zinc-950 mt-1">
                        {item.role}
                      </h3>
                      <p className="text-sm font-semibold text-zinc-600 font-mono">
                        {item.company}
                      </p>
                    </div>

                    <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                      {item.description}
                    </p>

                    {/* Key achievements */}
                    <div className="flex flex-col gap-2 pt-2">
                      {item.achievements.map((ach, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-zinc-700">
                          <CheckCircle2 size={14} className="text-[#990000] shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-100">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 text-zinc-700 border border-zinc-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
