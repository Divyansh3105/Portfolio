import React, { useEffect } from 'react';
import { X, ExternalLink, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { soundFx } from '../utils/sound';


export const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-zinc-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-white/90 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#990000]/10 text-[#990000] border border-[#990000]/30">
              {project.category}
            </span>
            <span className="text-xs font-mono text-zinc-500">// {project.year}</span>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-10 flex flex-col gap-8">
          {/* Media Preview Container */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200 shadow-lg group">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
              <span className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                ARCHITECTURE ARCHIVE v2.4
              </span>
              <span className="bg-[#990000] px-3 py-1 rounded-full font-bold uppercase">
                {project.status || 'PRODUCTION LIVE'}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-syne text-zinc-900">
              {project.title}
            </h2>
            <p className="text-base text-zinc-600 leading-relaxed font-normal">
              {project.fullDescription || project.description}
            </p>
          </div>

          {/* Key Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
            {project.highlights?.map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/60">
                <CheckCircle2 size={16} className="text-[#990000] shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-zinc-800">{highlight}</span>
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div>
            <p className="text-xs font-mono font-bold uppercase text-zinc-400 mb-3">
              // TECHNICAL STACK USED
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-zinc-100 text-zinc-800 border border-zinc-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-zinc-200">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playClick()}
                className="px-6 py-3 rounded-full bg-[#990000] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-black transition-colors shadow-md"
              >
                <span>LAUNCH LIVE APP</span>
                <ExternalLink size={14} />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playClick()}
                className="px-6 py-3 rounded-full border border-zinc-300 text-zinc-900 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:border-[#990000] hover:text-[#990000] transition-colors"
              >
                <GithubIcon size={14} />
                <span>VIEW SOURCE REPO</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
