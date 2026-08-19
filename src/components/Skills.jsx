import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundFx } from '../utils/sound';
import { Cpu, Layout, Database, Code } from 'lucide-react';


gsap.registerPlugin(ScrollTrigger);

export const Skills = () => {
  const containerRef = useRef(null);
  const categoriesRef = useRef([]);
  const barRefsMap = useRef({});
  const [activeCategory, setActiveCategory] = useState(0);

  const skillCategories = [
    {
      title: 'PROGRAMMING & LANGUAGES',
      icon: Code,
      color: '#990000',
      skills: [
        { name: 'JavaScript & TypeScript', level: 96 },
        { name: 'Python (Compiler & Scripting)', level: 92 },
        { name: 'Java & C / C++', level: 88 },
        { name: 'PHP & Web Scripting', level: 86 },
        { name: 'HTML5 & CSS3 Architecture', level: 98 },
        { name: 'Data Structures & Algorithms', level: 90 },
      ],
    },
    {
      title: 'FRONTEND & UI ENGINEERING',
      icon: Layout,
      color: '#0f0f11',
      skills: [
        { name: 'React 19 & React.js Ecosystem', level: 98 },
        { name: 'Tailwind CSS v4 & Bootstrap', level: 96 },
        { name: 'Zustand & TanStack Query', level: 94 },
        { name: 'PWA (Progressive Web Apps)', level: 90 },
        { name: 'Shopify Liquid & Theme Dev', level: 92 },
        { name: 'GSAP Motion & ScrollTrigger', level: 94 },
      ],
    },
    {
      title: 'BACKEND, CLOUD & TOOLS',
      icon: Database,
      color: '#990000',
      skills: [
        { name: 'Node.js & Express.js APIs', level: 96 },
        { name: 'RESTful API Design & 13+ Endpoints', level: 95 },
        { name: 'MongoDB & MySQL Relational DBs', level: 92 },
        { name: 'Railway & Netlify Cloud Deploy', level: 90 },
        { name: 'Git & GitHub Actions CI/CD', level: 92 },
        { name: 'OOP & System Design Concepts', level: 88 },
      ],
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      categoriesRef.current.forEach((cat, catIndex) => {
        if (!cat) return;

        // Card entrance — wider stagger, deeper Y
        gsap.fromTo(
          cat,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            delay: catIndex * 0.18,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: cat,
              start: 'top 85%',
            },
            onComplete: () => {
              // Scroll-driven skill bar fill animation
              const bars = barRefsMap.current[catIndex];
              if (bars) {
                const validBars = bars.filter(Boolean);
                validBars.forEach((bar, barIndex) => {
                  const level = skillCategories[catIndex].skills[barIndex]?.level || 0;
                  gsap.fromTo(
                    bar,
                    { width: '0%' },
                    {
                      width: `${level}%`,
                      duration: 1.4,
                      delay: barIndex * 0.08,
                      ease: 'expo.out',
                    }
                  );
                });
              }
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative py-28 bg-[#fafafc] text-zinc-900 border-b border-zinc-200/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-16 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#990000]/10 border border-[#990000]/30 flex items-center justify-center">
              <Cpu size={16} className="text-[#990000]" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#990000]">
              05 // TECHNICAL MATRIX &amp; SKILLS
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold uppercase font-syne text-zinc-950 tracking-tight">
            ENGINEERED FOR <span className="font-serif-italic text-[#990000] font-normal lowercase">performance</span>
          </h2>
        </div>

        {/* Skill Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            // Initialize bar refs for this category
            if (!barRefsMap.current[index]) {
              barRefsMap.current[index] = [];
            }
            return (
              <div
                key={category.title}
                ref={(el) => (categoriesRef.current[index] = el)}
                onMouseEnter={() => {
                  setActiveCategory(index);
                  soundFx.playHover();
                }}
                className={`p-8 rounded-2xl bg-white border transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col justify-between gap-8 ${
                  activeCategory === index
                    ? 'border-[#990000]/70 shadow-[0_16px_36px_rgba(0,0,0,0.06)]'
                    : 'border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-zinc-300'
                }`}
              >
                {/* Category Header */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                      <Icon size={22} className="text-[#990000]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-400">
                      0{index + 1} / 03
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-syne uppercase text-zinc-950">
                    {category.title}
                  </h3>
                </div>

                {/* Progress Skill Bars — GSAP-animated on scroll */}
                <div className="flex flex-col gap-5">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-semibold text-zinc-800">{skill.name}</span>
                        <span className="text-[#990000] font-bold">{skill.level}%</span>
                      </div>

                      {/* Bar Track */}
                      <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200/60">
                        <div
                          ref={(el) => {
                            if (!barRefsMap.current[index]) barRefsMap.current[index] = [];
                            barRefsMap.current[index][skillIndex] = el;
                          }}
                          className="h-full bg-gradient-to-r from-zinc-900 via-[#990000] to-[#990000] rounded-full"
                          style={{ width: '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Node Footer */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#990000]" />
                    RESUME VERIFIED SKILLS
                  </span>
                  <span>THREAD ACTIVE</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
