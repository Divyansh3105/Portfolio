import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ParagraphReveal3D = ({
  paragraphs = [],
  className = '',
  stagger = 0.15,
}) => {
  const containerRef = useRef(null);
  const paragraphRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const validParagraphs = paragraphRefs.current.filter(Boolean);
      if (validParagraphs.length === 0) return;

      // Create ScrollTrigger Timeline for 3D Paragraph Reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      });

      tl.fromTo(
        validParagraphs,
        {
          y: 40,
          opacity: 0,
          rotateX: -45,
          transformOrigin: '50% 100%',
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.1,
          stagger: stagger,
          ease: 'back.out(1.4)',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [stagger]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-6 [perspective:1000px] ${className}`}
      style={{ perspective: '1000px' }}
    >
      {paragraphs.map((text, index) => (
        <p
          key={index}
          ref={(el) => (paragraphRefs.current[index] = el)}
          className="text-base sm:text-lg text-zinc-700 leading-relaxed font-normal transform-gpu text-[#111116]"
        >
          {text}
        </p>
      ))}
    </div>
  );
};
