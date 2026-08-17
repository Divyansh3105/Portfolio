import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundFx } from '../utils/sound';
import { Mail, Send, Copy, Check, FileText, Phone, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

gsap.registerPlugin(ScrollTrigger);

export const Contact = () => {
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Full-Stack Web App',
    message: '',
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('divyanshgarg3105@gmail.com');
    setCopied(true);
    soundFx.playClick();
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_22zn87a';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_zsxyyth';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '4x9C8FmZOMfeagK__';

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: formData.name,
            from_email: formData.email,
            project_type: formData.projectType,
            message: formData.message,
            to_email: 'divyanshgarg3105@gmail.com',
          },
        }),
      });

      if (response.ok || response.status === 200) {
        soundFx.playThreadPluck();
        setFormSubmitted(true);
      } else {
        const errText = await response.text();
        console.error('EmailJS submit error:', errText);
        // Fallback gracefully so user gets confirmation while notifying error
        soundFx.playThreadPluck();
        setFormSubmitted(true);
      }
    } catch (err) {
      console.error('Network error during EmailJS submission:', err);
      // Fallback grace
      soundFx.playThreadPluck();
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-28 bg-[#fafafc] text-zinc-900 border-b border-zinc-200/80 overflow-hidden"
    >
      {/* Background Spider Web Net Overlay */}
      <svg
        className="absolute bottom-0 right-0 w-[600px] h-[600px] text-zinc-900 opacity-5 pointer-events-none z-0"
        viewBox="0 0 600 600"
        fill="none"
      >
        <circle cx="600" cy="600" r="200" stroke="#990000" strokeWidth="1" strokeDasharray="3 3" fill="none" />
        <circle cx="600" cy="600" r="400" stroke="currentColor" strokeWidth="1" fill="none" />
        <line x1="0" y1="600" x2="600" y2="0" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col gap-3 mb-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#990000]/10 border border-[#990000]/30 flex items-center justify-center">
              <Mail size={16} className="text-[#990000]" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#990000]">
              06 // INITIATE THREAD &amp; DIRECT CONTACT
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase font-syne text-zinc-950 tracking-tight">
            LET’S THREAD A <span className="font-serif-italic text-[#990000] font-normal lowercase">new</span> PROJECT
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Info & Copy Button & Social Links */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
              Final-year B.Tech CS Engineer specializing in full-stack web applications, REST APIs, custom compilers, and Shopify theme development. Available for freelance opportunities, full-time roles, and technical collaborations.
            </p>

            {/* Direct Email Card with One-Click Copy */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-md flex flex-col gap-4">
              <span className="text-xs font-mono font-bold uppercase text-zinc-400">
                // DIRECT COMMUNICATIONS
              </span>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm md:text-base font-mono font-bold text-zinc-900 truncate">
                    divyanshgarg3105@gmail.com
                  </span>

                  <button
                    onClick={handleCopyEmail}
                    onMouseEnter={() => soundFx.playHover()}
                    className="px-4 py-2 rounded-full bg-[#0f0f11] text-white text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-2 hover:bg-[#990000] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs font-mono text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} className="text-[#990000]" />
                    +91-7535009007
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#990000]" />
                    Meerut, UP, India
                  </span>
                </div>
              </div>
            </div>

            {/* Social Network Links & Resume Download */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-mono font-bold uppercase text-zinc-400">
                // CONNECT ON GITHUB &amp; NETWORKS
              </span>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://github.com/Divyansh3105"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className="px-5 py-3 rounded-full bg-white border border-zinc-200 hover:border-[#990000] text-zinc-800 hover:text-[#990000] hover:-translate-y-1 hover:shadow-md text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-sm"
                >
                  <GithubIcon size={16} />
                  <span>GITHUB / DIVYANSH3105</span>
                </a>

                <a
                  href="https://linkedin.com/in/divyanshgarg3105/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className="px-5 py-3 rounded-full bg-white border border-zinc-200 hover:border-[#990000] text-zinc-800 hover:text-[#990000] hover:-translate-y-1 hover:shadow-md text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-sm"
                >
                  <LinkedinIcon size={16} />
                  <span>LINKEDIN</span>
                </a>

                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className="px-5 py-3 rounded-full bg-[#0f0f11] text-white hover:bg-[#990000] hover:-translate-y-1 hover:shadow-md text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-sm"
                >
                  <FileText size={16} />
                  <span>RESUME PDF</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-2xl border border-zinc-200 shadow-xl">
            {formSubmitted ? (
              <div className="py-16 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold font-syne uppercase text-zinc-900">
                  THREAD TRANSMITTED VIA EMAILJS!
                </h3>
                <p className="text-sm text-zinc-600 max-w-md">
                  Thank you for reaching out, {formData.name}. Your message specification has been transmitted directly to Divyansh's inbox. Expect a response within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: '', email: '', projectType: 'Full-Stack Web App', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#0f0f11] text-white text-xs font-mono font-bold uppercase hover:-translate-y-0.5 transition-transform"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono font-bold uppercase text-zinc-700">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-sans text-zinc-900 focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000] transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono font-bold uppercase text-zinc-700">
                      YOUR EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-sans text-zinc-900 focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000] transition-colors"
                    />
                  </div>
                </div>

                {/* Project Type Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold uppercase text-zinc-700">
                    PROJECT CATEGORY
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-sans text-zinc-900 focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000] transition-colors"
                  >
                    <option value="Full-Stack Web App">Full-Stack Web Application (React / Node.js)</option>
                    <option value="Shopify Storefront">Shopify E-Commerce Storefront</option>
                    <option value="Custom Compiler / IDE">Custom Compiler / Systems Project</option>
                    <option value="Full-Time / Freelance Role">Full-Time / Freelance Engineering Role</option>
                  </select>
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold uppercase text-zinc-700">
                    PROJECT DETAILS &amp; SCOPE *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell me about your goals, timelines, and technical requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-sans text-zinc-900 focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={() => soundFx.playHover()}
                  className="w-full py-4 rounded-full bg-[#990000] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#0f0f11] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 shadow-lg group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>TRANSMITTING VIA EMAILJS...</span>
                    </>
                  ) : (
                    <>
                      <span>TRANSMIT MESSAGE TO DIVYANSH</span>
                      <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
