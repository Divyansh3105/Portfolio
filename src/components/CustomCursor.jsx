import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    // Track hover state over interactive elements
    const handleMouseOver = (e) => {
      if (
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.getAttribute('role') === 'button' ||
        e.target.classList.contains('interactive-hover')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    const render = () => {
      // Smooth lerp lag for outer ring cursor
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Spider Silk Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2.5 h-2.5 bg-[#990000] rounded-full pointer-events-none z-50 transition-transform duration-100 ${
          isClicking ? 'scale-125' : 'scale-100'
        }`}
      />

      {/* Spider Silk Ring Cursor */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-[#990000]/50 pointer-events-none z-50 transition-all duration-300 ease-out flex items-center justify-center ${
          isHovered
            ? 'w-11 h-11 bg-[#990000]/05 border-[#990000] scale-105'
            : isClicking
            ? 'w-6 h-6 border-[#990000]'
            : 'w-7 h-7 opacity-50'
        }`}
      >
        <div className={`w-1 h-1 bg-[#990000] rounded-full transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </>
  );
};

