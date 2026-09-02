/**
 * Orb-web geometry.
 *
 * Returns SVG path data for a spider-web: straight radial spokes plus
 * concentric rings whose segments sag toward the centre, which is what makes
 * a web read as a web rather than as a radar chart.
 */

const round = (n) => Math.round(n * 100) / 100;

export function orbWeb({
  cx = 0,
  cy = 0,
  r = 300,
  spokes = 12,
  rings = 6,
  a0 = 0,
  sweep = Math.PI * 2,
  sag = 0.15,
  inner = 0.08,
}) {
  const closed = Math.abs(sweep - Math.PI * 2) < 1e-6;
  const step = closed ? sweep / spokes : sweep / (spokes - 1);
  const angle = (i) => a0 + i * step;
  const point = (i, radius) => [
    cx + Math.cos(angle(i)) * radius,
    cy + Math.sin(angle(i)) * radius,
  ];

  const spokePaths = [];
  for (let i = 0; i < spokes; i += 1) {
    const [x1, y1] = point(i, r * inner);
    const [x2, y2] = point(i, r);
    spokePaths.push(`M${round(x1)} ${round(y1)}L${round(x2)} ${round(y2)}`);
  }

  const ringPaths = [];
  for (let k = 1; k <= rings; k += 1) {
    const radius = r * (inner + ((1 - inner) * k) / rings);
    const segments = closed ? spokes : spokes - 1;
    let d = "";
    for (let i = 0; i < segments; i += 1) {
      const j = (i + 1) % spokes;
      const [x1, y1] = point(i, radius);
      const [x2, y2] = point(j, radius);
      const mid = angle(i) + step / 2;
      const controlRadius = radius * (1 - sag);
      const cxp = cx + Math.cos(mid) * controlRadius;
      const cyp = cy + Math.sin(mid) * controlRadius;
      if (i === 0) d += `M${round(x1)} ${round(y1)}`;
      d += `Q${round(cxp)} ${round(cyp)} ${round(x2)} ${round(y2)}`;
    }
    ringPaths.push(d);
  }

  return { spokePaths, ringPaths };
}

/**
 * A draped cobweb: a slack top line with sagging strands hanging off it and
 * catenary cross-threads linking them.
 */
export function webCurtain({ width = 1200, depth = 200, strands = 9, tiers = 4 }) {
  const gap = width / (strands - 1);
  const drops = [];
  const cross = [];
  const lengths = [];

  for (let i = 0; i < strands; i += 1) {
    // Alternate lengths so the curtain reads as hand-drawn, not machined.
    const t = (Math.sin(i * 1.7) + 1) / 2;
    lengths.push(depth * (0.45 + t * 0.55));
  }

  for (let i = 0; i < strands; i += 1) {
    const x = round(i * gap);
    drops.push(`M${x} 0L${x} ${round(lengths[i])}`);
  }

  for (let k = 1; k <= tiers; k += 1) {
    let d = "";
    for (let i = 0; i < strands - 1; i += 1) {
      const ratio = k / (tiers + 1);
      const x1 = i * gap;
      const y1 = lengths[i] * ratio;
      const x2 = (i + 1) * gap;
      const y2 = lengths[i + 1] * ratio;
      const cx = (x1 + x2) / 2;
      const cy = Math.max(y1, y2) + gap * 0.22;
      if (i === 0) d += `M${round(x1)} ${round(y1)}`;
      d += `Q${round(cx)} ${round(cy)} ${round(x2)} ${round(y2)}`;
    }
    cross.push(d);
  }

  return { drops, cross };
}
