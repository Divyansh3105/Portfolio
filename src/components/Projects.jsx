import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { soundFx } from "../utils/sound";
import { ProjectModal } from "./ProjectModal";
import { ArrowUpRight, ExternalLink, Code2 } from "lucide-react";
import { GithubIcon } from "./SocialIcons";
import heroArtwork from "../assets/hero_artwork.png";
import talkSpaceImg from "../assets/TalkSpace.png";
import gravLangImg from "../assets/GravLang.png";
import utilityImg from "../assets/Public Utility Mangement.png";

gsap.registerPlugin(ScrollTrigger);


export const Projects = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeModalProject, setActiveModalProject] = useState(null);

  const projectsData = [
    {
      id: "proj-1",
      title: "TALKSPACE // REAL-TIME PLATFORM",
      category: "FULL-STACK",
      year: "2026",
      description:
        "Real-time communication platform live on Render supporting instant messaging, video calls, and friend requests.",
      fullDescription:
        "TalkSpace is a production full-stack communication application engineered with React 19, Node.js, Express, and MongoDB. Supports 13+ REST API endpoints, JWT authentication with bcrypt hashing, Zustand & TanStack Query state management, Stream SDK video calls, PWA offline capabilities, and automated CI/CD deployment via GitHub Actions.",
      image: talkSpaceImg,
      tags: [
        "React 19",
        "Node.js",
        "Express",
        "MongoDB",
        "Stream SDK",
        "JWT",
        "PWA",
        "Zustand",
        "Render",
        "GitHub Actions",
      ],
      highlights: [
        "Delivered 13+ REST API endpoints with JWT auth and password hashing",
        "Integrated real-time instant messaging and video call capability with Stream SDK",
        "Built PWA frontend backed by Zustand, TanStack Query, and automated Render CI/CD",
      ],
      liveUrl: "https://talkspace-i5d2.onrender.com/",
      githubUrl: "https://github.com/Divyansh3105/TalkSpace",
      status: "PRODUCTION LIVE ON RENDER",
    },
    {
      id: "proj-2",
      title: "GRAVLANG // COMPILER & GUI IDE",
      category: "SYSTEMS & COMPILERS",
      year: "2026",
      description:
        "Custom interpreted programming language built from scratch in Python with a full compiler pipeline and GUI IDE.",
      fullDescription:
        "GravLang is a custom interpreted programming language designed from first principles in Python. Features a complete compiler pipeline including lexer, recursive-descent parser, abstract syntax tree (AST), and tree-walking interpreter with object-oriented programming (OOP) and recursion support. Ships with a native standard library (10+ built-in functions), custom GUI IDE, and CLI.",
      image: gravLangImg,
      tags: [
        "Python",
        "Compiler Design",
        "Lexer",
        "Parser",
        "AST",
        "Tree-Walking Interpreter",
        "Custom GUI IDE",
        "CLI",
      ],
      highlights: [
        "Designed complete compiler pipeline (lexer, AST parser, interpreter) with recursion support",
        "Built custom desktop GUI IDE and CLI tool alongside standard library",
        "Implemented 10+ native standard library built-in functions",
      ],
      githubUrl: "https://github.com/Divyansh3105/GravLang",
      status: "OPEN SOURCE LANGUAGE",
    },
    {
      id: "proj-3",
      title: "KESAV DIAMOND // SHOPIFY E-COMMERCE",
      category: "FULL-STACK",
      year: "2026",
      description:
        "Custom luxury jewelry Shopify storefront delivered independently across a 3-month freelance client engagement.",
      fullDescription:
        "Designed and developed a responsive custom Shopify storefront for Kesav Diamond, a luxury jewelry brand. Configured custom theme architecture, product catalog, brand UI, payment gateway integration, and shipping/tax settings streamlining the end-to-end checkout experience.",
      image: heroArtwork,
      tags: [
        "Shopify Liquid",
        "JavaScript",
        "CSS3",
        "Payment Gateway",
        "Shipping APIs",
        "Theme Architecture",
      ],
      highlights: [
        "Configured custom luxury jewelry theme and product catalog",
        "Integrated payment gateways, tax rules, and streamlined checkout",
        "Delivered independently over a 3-month freelance engagement from discovery to go-live",
      ],
      liveUrl: "https://kesavdiamond.com/",
      status: "FREELANCE PRODUCTION",
    },
    {
      id: "proj-4",
      title: "PUBLIC UTILITY MANAGEMENT SYSTEM",
      category: "FULL-STACK",
      year: "2025",
      description:
        "Billing and payment management web application for electricity and water utilities with relational database schema.",
      fullDescription:
        "A full-stack web application built with PHP, MySQL, HTML5, CSS3, and JavaScript to automate billing and payment processes across water and electricity utilities. Designed a normalized relational database schema with 6+ interlinked tables supporting account management and automated bill generation.",
      image: utilityImg,
      tags: [
        "PHP",
        "MySQL",
        "JavaScript",
        "HTML5",
        "CSS3",
        "Relational DB Schema",
      ],
      highlights: [
        "Developed full-stack web app for electricity and water billing management",
        "Designed normalized relational MySQL database schema with 6+ interlinked tables",
        "Automated billing calculation, account management, and payment verification",
      ],
      liveUrl: "https://publicutilitymanagementsystem.gt.tc/",
      githubUrl:
        "https://github.com/Divyansh3105/Public-Utility-Management-System",
      status: "UTILITY APPLICATION",
    },
  ];

  const categories = ["ALL", "FULL-STACK", "SYSTEMS & COMPILERS"];

  const filteredProjects =
    selectedCategory === "ALL"
      ? projectsData
      : projectsData.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length === 0) return;

      validCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            delay: index * 0.09,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative py-28 bg-[#fafafc] text-zinc-900 border-b border-zinc-200/80 overflow-hidden"
    >
      {/* Background vector overlay */}
      <svg
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[600px] text-zinc-900 opacity-5 pointer-events-none z-0"
        viewBox="0 0 1200 600"
        fill="none"
      >
        <line
          x1="0"
          y1="300"
          x2="1200"
          y2="300"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <line
          x1="600"
          y1="0"
          x2="600"
          y2="600"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <circle
          cx="600"
          cy="300"
          r="150"
          stroke="#990000"
          strokeWidth="0.8"
          strokeDasharray="4 4"
          fill="none"
        />
        <circle
          cx="600"
          cy="300"
          r="300"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Title Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#990000]/10 border border-[#990000]/30 flex items-center justify-center">
                <Code2 size={16} className="text-[#990000]" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#990000]">
                03 // FEATURED ARCHITECTURES &amp; PROJECTS
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-extrabold uppercase font-syne text-zinc-950 tracking-tight">
              FEATURED{" "}
              <span className="font-serif-italic lowercase text-[#990000] font-normal">
                projects
              </span>{" "}
              &amp; LABS
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-full border border-zinc-200 shadow-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  soundFx.playClick();
                }}
                onMouseEnter={() => soundFx.playHover()}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-[#0f0f11] text-white shadow-sm"
                    : "text-zinc-600 hover:text-[#990000]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative bg-white rounded-2xl border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.07)] hover:border-[#990000]/50 hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden"
            >
              {/* Card Image Header */}
              <div
                onClick={() => {
                  soundFx.playClick();
                  setActiveModalProject(project);
                }}
                className="relative aspect-[16/10] overflow-hidden bg-zinc-950 cursor-pointer"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-80" />

                {/* Silk Anchor Tag */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#990000]" />
                  <span className="text-[10px] font-mono font-bold text-zinc-900 uppercase">
                    {project.category}
                  </span>
                </div>

                {/* View Details Button overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-black/35 backdrop-blur-[2px]">
                  <span className="px-5 py-2.5 rounded-full bg-[#990000] text-white text-xs font-bold font-syne tracking-widest uppercase shadow-md flex items-center gap-2">
                    <span>INSPECT SPECIFICATION</span>
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-6 md:p-8 flex flex-col flex-grow justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>// {project.year}</span>
                    <span className="text-[#990000] font-bold uppercase">
                      {project.status}
                    </span>
                  </div>

                  <h3
                    onClick={() => {
                      soundFx.playClick();
                      setActiveModalProject(project);
                    }}
                    className="text-2xl font-bold font-syne uppercase text-zinc-900 group-hover:text-[#990000] transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>

                  <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tags & Action Buttons */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-100/80 text-zinc-700 border border-zinc-200/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFx.playClick();
                        }}
                        className="p-2 rounded-full border border-zinc-200 hover:border-[#990000] text-zinc-700 hover:text-[#990000] transition-colors"
                        title="View GitHub Repository"
                      >
                        <GithubIcon size={16} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFx.playClick();
                        }}
                        className="p-2 rounded-full bg-[#0f0f11] text-white hover:bg-[#990000] transition-colors"
                        title="Launch Live App"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {activeModalProject && (
        <ProjectModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </section>
  );
};

