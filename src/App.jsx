import { useEffect } from "react";
import { ScrollTrigger } from "./lib/gsap";
import About from "./components/About";
import Contact from "./components/Contact";
import Cursor from "./components/Cursor";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Nav from "./components/Nav";
import Path from "./components/Path";
import Work from "./components/Work";

export default function App() {
  /* Web fonts change the height of every display heading, so trigger
     positions measured before they land are wrong. Re-measure once. */
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
      >
        Skip to content
      </a>

      <Cursor />
      <Nav />

      <main>
        <Hero />
        <About />
        <Marquee />
        <Work />
        <Path />
      </main>

      <Contact />
    </>
  );
}
