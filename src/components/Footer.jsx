import React from 'react';
import { soundFx } from '../utils/sound';
import { ArrowUp, FileText } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

export const Footer = () => {
  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0f0f11] text-white py-12 border-t border-zinc-800 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Title */}
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[#990000] animate-ping" />
          <span className="text-sm font-bold font-syne uppercase tracking-wider">
            DIVYANSH GARG <span className="text-zinc-500">// FULL-STACK ENGINEER</span>
          </span>
        </div>

        {/* Center Links & Copyright */}
        <div className="flex items-center gap-6 text-xs font-mono text-zinc-400">
          <a
            href="https://github.com/Divyansh3105"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#990000] flex items-center gap-1.5 transition-colors"
          >
            <GithubIcon size={14} />
            <span>GITHUB</span>
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#990000] flex items-center gap-1.5 transition-colors"
          >
            <FileText size={14} />
            <span>RESUME</span>
          </a>
          <span>© {new Date().getFullYear()} DIVYANSH GARG</span>
        </div>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          onMouseEnter={() => soundFx.playHover()}
          className="p-3 rounded-full border border-zinc-700 hover:border-[#990000] hover:bg-[#990000] text-white transition-colors duration-300 flex items-center justify-center"
          title="Back to Top"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
};
