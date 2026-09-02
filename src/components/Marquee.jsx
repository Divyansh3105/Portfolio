import { marquee } from "../data/site";
import { Spider } from "./WebDecor";

/**
 * Endless ticker between sections. The track holds two identical copies of the
 * phrase list and slides by exactly half its width, so the seam never shows.
 */
export default function Marquee() {
  const items = [...marquee, ...marquee];

  return (
    <div
      aria-hidden="true"
      className="relative flex overflow-hidden border-y border-ash bg-ink py-5 select-none"
    >
      <div className="marquee-track flex w-max shrink-0 items-center gap-10 pr-10">
        {items.map((phrase, i) => (
          <span key={`${phrase}-${i}`} className="flex items-center gap-10">
            <span
              className={`display-tight whitespace-nowrap text-[1.6rem] md:text-[2.2rem] ${
                i % 2 === 0 ? "text-paper" : "text-transparent"
              }`}
              style={
                i % 2 === 0
                  ? undefined
                  : {
                      WebkitTextStroke: "1px var(--color-blood-soft)",
                    }
              }
            >
              {phrase}
            </span>
            <Spider size={16} className="shrink-0 text-blood" />
          </span>
        ))}
      </div>
    </div>
  );
}
