import { useMemo } from "react";
import { orbWeb, webCurtain } from "../lib/web";

/**
 * Decorative spider-web primitives. Every one of these is purely ornamental,
 * inherits `currentColor`, and is hidden from assistive tech.
 */

const CORNER_ANGLE = {
  tl: -Math.PI * 0.02,
  tr: Math.PI * 0.52,
  bl: -Math.PI * 0.52,
  br: Math.PI * 1.02,
};

const CORNER_POSITION = {
  tl: "left-0 top-0",
  tr: "right-0 top-0",
  bl: "left-0 bottom-0",
  br: "right-0 bottom-0",
};

/** A quarter web anchored into one corner of its parent. */
export function WebCorner({
  corner = "tl",
  size = 320,
  spokes = 11,
  rings = 6,
  strokeWidth = 1,
  className = "",
  style,
  ...rest
}) {
  const { spokePaths, ringPaths } = useMemo(
    () =>
      orbWeb({
        cx: 0,
        cy: 0,
        r: size,
        spokes,
        rings,
        a0: CORNER_ANGLE[corner],
        sweep: Math.PI * 0.46,
        sag: 0.16,
        inner: 0.05,
      }),
    [corner, size, spokes, rings],
  );

  // Each corner anchors the web origin (0,0) at its own edge of the viewBox.
  const originX = corner === "tr" || corner === "br" ? size : 0;
  const originY = corner === "bl" || corner === "br" ? size : 0;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={`pointer-events-none absolute ${CORNER_POSITION[corner]} ${className}`}
      style={style}
      {...rest}
    >
      <g
        transform={`translate(${originX} ${originY})`}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
      >
        <g strokeWidth={strokeWidth}>
          {spokePaths.map((d, i) => (
            <path key={`s${i}`} d={d} />
          ))}
        </g>
        <g strokeWidth={strokeWidth * 0.72} opacity="0.68">
          {ringPaths.map((d, i) => (
            <path key={`r${i}`} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}

/** A full radial web — used as a large, faint background structure. */
export function WebOrb({
  size = 640,
  spokes = 18,
  rings = 9,
  strokeWidth = 1,
  className = "",
  style,
  ...rest
}) {
  const half = size / 2;
  const { spokePaths, ringPaths } = useMemo(
    () =>
      orbWeb({
        cx: half,
        cy: half,
        r: half,
        spokes,
        rings,
        sag: 0.13,
        inner: 0.04,
      }),
    [half, spokes, rings],
  );

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={`pointer-events-none ${className}`}
      style={style}
      {...rest}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <g strokeWidth={strokeWidth}>
          {spokePaths.map((d, i) => (
            <path key={`s${i}`} d={d} />
          ))}
        </g>
        <g strokeWidth={strokeWidth * 0.7} opacity="0.7">
          {ringPaths.map((d, i) => (
            <path key={`r${i}`} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}

/** Cobweb draped along a horizontal edge. */
export function WebDrape({
  width = 1200,
  depth = 180,
  strands = 11,
  tiers = 4,
  strokeWidth = 1,
  className = "",
  style,
  ...rest
}) {
  const { drops, cross } = useMemo(
    () => webCurtain({ width, depth, strands, tiers }),
    [width, depth, strands, tiers],
  );

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${width} ${depth}`}
      preserveAspectRatio="none"
      className={`pointer-events-none ${className}`}
      style={style}
      {...rest}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <g strokeWidth={strokeWidth} opacity="0.85">
          {drops.map((d, i) => (
            <path key={`d${i}`} d={d} />
          ))}
        </g>
        <g strokeWidth={strokeWidth * 0.8} opacity="0.55">
          {cross.map((d, i) => (
            <path key={`c${i}`} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}

/** A single strand of silk — the thread objects hang from. */
export function Thread({ className = "", style }) {
  return (
    <span
      aria-hidden="true"
      className={`block w-px bg-gradient-to-b from-transparent via-ink/40 to-ink/70 ${className}`}
      style={style}
    />
  );
}

/** Small spider mark used in eyebrow labels. */
export function Spider({ size = 18, className = "", withDragline = false }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      >
        {withDragline && <path d="M12 0.5V4" opacity="0.5" />}
        <path d="M9.9 7.4C7.2 6.2 5.8 4.4 5.2 2.4" />
        <path d="M9.5 9C6.6 8.6 4.4 7.8 2.9 6.4" />
        <path d="M9.5 10.6C6.8 11.2 4.7 12.2 3.3 13.8" />
        <path d="M10 12.2C7.9 13.8 6.6 15.8 5.9 18.1" />
        <path d="M14.1 7.4C16.8 6.2 18.2 4.4 18.8 2.4" />
        <path d="M14.5 9C17.4 8.6 19.6 7.8 21.1 6.4" />
        <path d="M14.5 10.6C17.2 11.2 19.3 12.2 20.7 13.8" />
        <path d="M14 12.2C16.1 13.8 17.4 15.8 18.1 18.1" />
      </g>
      <ellipse cx="12" cy="8.4" rx="2.3" ry="2.1" fill="currentColor" />
      <ellipse cx="12" cy="14" rx="3.3" ry="4.1" fill="currentColor" />
    </svg>
  );
}
