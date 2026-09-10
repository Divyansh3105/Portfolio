import { GLYPHS, MARKS } from "../lib/brands";

/**
 * One skill mark: a real brand logo where the vendor has one, otherwise the
 * concept glyph drawn for it. Renders nothing for a skill with neither, so
 * callers can drop it in unconditionally.
 *
 * Colour comes from `currentColor` by default so the caller controls it,
 * including the blood-on-hover inversion on the About-style chips. Pass
 * `brandColor` where the real palette helps recognition, as the Skills
 * tiles and the cursor trail do.
 */
export function BrandMark({ skill, size = 14, brandColor = false, className = "" }) {
  // Brand marks are filled single paths; the concept glyphs are stroked on
  // the same grid, so the two render with different paint but one component.
  const mark = MARKS[skill];
  const glyph = mark ? null : GLYPHS[skill];
  const art = mark ?? glyph;
  if (!art) return null;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={glyph ? "none" : "currentColor"}
      stroke={glyph ? "currentColor" : undefined}
      strokeWidth={glyph ? 1.6 : undefined}
      strokeLinecap={glyph ? "round" : undefined}
      strokeLinejoin={glyph ? "round" : undefined}
      className={className}
      style={brandColor ? { color: art.hex } : undefined}
    >
      <path d={art.d} />
    </svg>
  );
}
