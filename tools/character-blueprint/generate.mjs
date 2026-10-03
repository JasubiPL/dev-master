// Generates a modeling turnaround sheet (front, side, back, top, 3/4) as SVG
// from a blocky character definition.
//
// Usage: node tools/character-blueprint/generate.mjs [input.json] [output.svg]

import { readFileSync, writeFileSync } from 'node:fs';

const [, , input = 'assets/characters/protagonist.json', output = 'docs/characters/protagonist-sheet.svg'] = process.argv;
const data = JSON.parse(readFileSync(input, 'utf8'));

const SCALE = 380; // px per meter for every view
const GROUND_Y = 820;
const SHEET_W = 1900;
const SHEET_H = 1120;
const INK = '#1f3550';
const GRID = '#dfe7f0';

const swapSide = (s) => (s ? s.replace(/_l$/, '_r') : s);

function expandParts(parts) {
  const out = [];
  for (const p of parts) {
    out.push(p);
    if (p.mirror) {
      out.push({
        ...p,
        name: swapSide(p.name),
        group: swapSide(p.group),
        min: [-p.max[0], p.min[1], p.min[2]],
        max: [-p.min[0], p.max[1], p.max[2]],
      });
    }
  }
  return out;
}

const parts = expandParts(data.parts);
const colorOf = (p) => data.palette[p.color] ?? p.color;

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    Math.max(0, Math.min(255, Math.round(f >= 1 ? v + (255 - v) * (f - 1) : v * f))),
  );
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

const fmt = (n) => Number(n.toFixed(2));

// Orthographic views. `u`/`v` pick the axis (0=x, 1=y, 2=z) and its sign;
// `key` returns how close the box's visible face is to the camera.
const ORTHO = {
  front: { u: [0, 1], v: [2, 1], key: (b) => -b.min[1] },
  side: { u: [1, 1], v: [2, 1], key: (b) => b.max[0] },
  back: { u: [0, -1], v: [2, 1], key: (b) => b.max[1] },
  top: { u: [0, 1], v: [1, 1], key: (b) => b.max[2] },
};

function axisRange(b, [axis, sign]) {
  return sign > 0 ? [b.min[axis], b.max[axis]] : [-b.max[axis], -b.min[axis]];
}

function orthoView(name, cx, baseY) {
  const view = ORTHO[name];
  const sorted = [...parts].sort((a, b) => view.key(a) - view.key(b));
  return sorted
    .map((p) => {
      const [u0, u1] = axisRange(p, view.u);
      const [v0, v1] = axisRange(p, view.v);
      const x = cx + u0 * SCALE;
      const y = baseY - v1 * SCALE;
      const w = (u1 - u0) * SCALE;
      const h = (v1 - v0) * SCALE;
      const fill = colorOf(p);
      const r = p.round ? Math.min(w, h) / 2 : (p.bevel ?? 0) * SCALE * 0.6;
      return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="${fmt(r)}" fill="${fill}" stroke="${shade(fill, 0.62)}" stroke-width="0.8"><title>${p.name}</title></rect>`;
    })
    .join('\n');
}

// 3/4 axonometric view from the character's front-left, slightly above.
const norm = (v) => {
  const l = Math.hypot(...v);
  return v.map((c) => c / l);
};
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const CAM = norm([1.1, -1.7, 0.75]);
const FWD = CAM.map((c) => -c);
const RIGHT = norm(cross(FWD, [0, 0, 1]));
const UP = cross(RIGHT, FWD);

function isoView(cx, baseY) {
  const project = (p) => [cx + dot(p, RIGHT) * SCALE, baseY - dot(p, UP) * SCALE];
  const center = (b) => b.min.map((m, i) => (m + b.max[i]) / 2);
  const sorted = [...parts].sort((a, b) => dot(center(a), CAM) - dot(center(b), CAM));
  const faces = [];
  for (const p of sorted) {
    const [x0, y0, z0] = p.min;
    const [x1, y1, z1] = p.max;
    const fill = colorOf(p);
    const quads = [
      { n: [0, 0, 1], f: 1.12, pts: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]] },
      { n: [0, -1, 0], f: 1, pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]] },
      { n: [1, 0, 0], f: 0.8, pts: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]] },
    ];
    for (const q of quads) {
      if (dot(q.n, CAM) <= 0) continue;
      const c = shade(fill, q.f);
      const pts = q.pts.map((pt) => project(pt).map(fmt).join(',')).join(' ');
      faces.push(`<polygon points="${pts}" fill="${c}" stroke="${shade(c, 0.7)}" stroke-width="0.6" stroke-linejoin="round"/>`);
    }
  }
  return faces.join('\n');
}

const bounds = parts.reduce(
  (acc, p) => ({
    min: acc.min.map((m, i) => Math.min(m, p.min[i])),
    max: acc.max.map((m, i) => Math.max(m, p.max[i])),
  }),
  { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] },
);
const headTop = parts.find((p) => p.name === 'head').max[2];

// Layout
const COL = { front: 330, side: 665, back: 990, iso: 1305 };
const PANEL_X = 1520;

function label(x, y, text, opts = {}) {
  const { size = 15, anchor = 'middle', weight = 600, fill = INK, spacing = 1.5 } = opts;
  return `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${fill}" letter-spacing="${spacing}">${text}</text>`;
}

function guide(z, text) {
  const y = GROUND_Y - z * SCALE;
  return `<line x1="150" y1="${fmt(y)}" x2="1130" y2="${fmt(y)}" stroke="#7d93ad" stroke-width="0.8" stroke-dasharray="6 5"/>
${label(142, y + 4, text, { size: 12, anchor: 'end', weight: 500, spacing: 0.3 })}`;
}

function dimV(x, z0, z1, text) {
  const ya = GROUND_Y - z0 * SCALE;
  const yb = GROUND_Y - z1 * SCALE;
  return `<line x1="${x}" y1="${fmt(ya)}" x2="${x}" y2="${fmt(yb)}" stroke="${INK}" stroke-width="1.2" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
<text transform="translate(${x - 8} ${fmt((ya + yb) / 2)}) rotate(-90)" font-size="13" font-weight="700" text-anchor="middle" fill="${INK}">${text}</text>`;
}

function dimH(cx, u0, u1, y, text) {
  const xa = cx + u0 * SCALE;
  const xb = cx + u1 * SCALE;
  return `<line x1="${fmt(xa)}" y1="${y}" x2="${fmt(xb)}" y2="${y}" stroke="${INK}" stroke-width="1.2" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
<line x1="${fmt(xa)}" y1="${y - 8}" x2="${fmt(xa)}" y2="${y + 8}" stroke="${INK}" stroke-width="1"/>
<line x1="${fmt(xb)}" y1="${y - 8}" x2="${fmt(xb)}" y2="${y + 8}" stroke="${INK}" stroke-width="1"/>
${label((xa + xb) / 2, y + 22, text, { size: 13, weight: 700, spacing: 0.3 })}`;
}

function pivots(cx, view) {
  return Object.entries(data.groups)
    .filter(([name]) => view !== 'side' || !name.endsWith('_r'))
    .map(([name, g]) => {
      const u = view === 'side' ? g.pivot[1] : g.pivot[0];
      const x = cx + u * SCALE;
      const y = GROUND_Y - g.pivot[2] * SCALE;
      return `<g stroke="#d6336c" stroke-width="1.4" fill="none"><circle cx="${fmt(x)}" cy="${fmt(y)}" r="5"/><line x1="${fmt(x - 9)}" y1="${fmt(y)}" x2="${fmt(x + 9)}" y2="${fmt(y)}"/><line x1="${fmt(x)}" y1="${fmt(y - 9)}" x2="${fmt(x)}" y2="${fmt(y + 9)}"/><title>pivot ${name}</title></g>`;
    })
    .join('\n');
}

function palettePanel(x, y) {
  const entries = Object.entries(data.palette);
  const rows = Math.ceil(entries.length / 2);
  return entries
    .map(([name, hex], i) => {
      const col = Math.floor(i / rows);
      const row = i % rows;
      const px = x + col * 185;
      const py = y + row * 26;
      return `<rect x="${px}" y="${py}" width="20" height="18" rx="3" fill="${hex}" stroke="${shade(hex, 0.6)}"/>
${label(px + 28, py + 13, name, { size: 12, anchor: 'start', weight: 600, spacing: 0.2 })}
${label(px + 175, py + 13, hex, { size: 11, anchor: 'end', weight: 400, fill: '#5b6f86', spacing: 0.2 })}`;
    })
    .join('\n');
}

const topCx = PANEL_X + 175;
const topBase = 330;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SHEET_W}" height="${SHEET_H}" viewBox="0 0 ${SHEET_W} ${SHEET_H}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif">
<defs>
  <pattern id="grid" width="19" height="19" patternUnits="userSpaceOnUse"><path d="M19 0H0V19" fill="none" stroke="${GRID}" stroke-width="0.7"/></pattern>
  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L9 5L0 9z" fill="${INK}"/></marker>
</defs>
<rect width="100%" height="100%" fill="#f6f9fc"/>
<rect width="100%" height="100%" fill="url(#grid)"/>
<rect x="16" y="16" width="${SHEET_W - 32}" height="${SHEET_H - 32}" fill="none" stroke="${INK}" stroke-width="2"/>

${label(40, 62, 'DEV MASTER', { size: 30, anchor: 'start', weight: 800, spacing: 4 })}
${label(292, 62, `· ${data.name.toUpperCase()} · HOJA DE MODELADO`, { size: 22, anchor: 'start', weight: 500, spacing: 2 })}
${label(40, 90, `Vistas ortográficas a escala ${SCALE} px = 1 m · Convención de Blender: Z arriba, pies en Z = 0, el personaje mira hacia −Y, +X es su lado IZQUIERDO`, { size: 13, anchor: 'start', weight: 400, spacing: 0.2, fill: '#4b6078' })}

${guide(0, '0.00')}
${guide(0.4, '0.40 cadera')}
${guide(0.78, '0.78 hombros')}
${guide(0.825, '0.83 cuello')}
${guide(headTop, `${headTop.toFixed(2)} cabeza`)}
${guide(bounds.max[2], `${bounds.max[2].toFixed(2)} chongo`)}

<g>${orthoView('front', COL.front, GROUND_Y)}</g>
<g>${orthoView('side', COL.side, GROUND_Y)}</g>
<g>${orthoView('back', COL.back, GROUND_Y)}</g>
<g>${isoView(COL.iso, GROUND_Y)}</g>

${pivots(COL.front, 'front')}
${pivots(COL.side, 'side')}

${dimV(COL.front - 175, 0, bounds.max[2], `${bounds.max[2].toFixed(2)} m`)}
${dimV(COL.front - 145, 0, headTop, `${headTop.toFixed(2)} m`)}
${dimH(COL.front, bounds.min[0], bounds.max[0], GROUND_Y + 34, `${(bounds.max[0] - bounds.min[0]).toFixed(2)} m`)}
${dimH(COL.side, bounds.min[1], bounds.max[1], GROUND_Y + 34, `${(bounds.max[1] - bounds.min[1]).toFixed(2)} m`)}

${label(COL.front, GROUND_Y + 92, 'FRENTE', { size: 17, weight: 800, spacing: 3 })}
${label(COL.front, GROUND_Y + 112, 'mirando desde −Y', { size: 12, weight: 400, spacing: 0.3, fill: '#4b6078' })}
${label(COL.side, GROUND_Y + 92, 'LATERAL IZQUIERDO', { size: 17, weight: 800, spacing: 3 })}
${label(COL.side, GROUND_Y + 112, 'mirando desde +X · se ve la línea rapada', { size: 12, weight: 400, spacing: 0.3, fill: '#4b6078' })}
${label(COL.back, GROUND_Y + 92, 'ESPALDA', { size: 17, weight: 800, spacing: 3 })}
${label(COL.back, GROUND_Y + 112, 'mirando desde +Y', { size: 12, weight: 400, spacing: 0.3, fill: '#4b6078' })}
${label(COL.iso, GROUND_Y + 92, 'VISTA 3/4', { size: 17, weight: 800, spacing: 3 })}
${label(COL.iso, GROUND_Y + 112, 'referencia de volumen y color', { size: 12, weight: 400, spacing: 0.3, fill: '#4b6078' })}

<line x1="${PANEL_X - 20}" y1="120" x2="${PANEL_X - 20}" y2="${SHEET_H - 40}" stroke="${INK}" stroke-width="1"/>
${label(PANEL_X, 140, 'ARRIBA', { size: 17, anchor: 'start', weight: 800, spacing: 3 })}
${label(PANEL_X, 158, 'mirando desde +Z · el frente queda abajo', { size: 12, anchor: 'start', weight: 400, spacing: 0.3, fill: '#4b6078' })}
<g>${orthoView('top', topCx, topBase)}</g>

${label(PANEL_X, 400, 'PALETA', { size: 17, anchor: 'start', weight: 800, spacing: 3 })}
${palettePanel(PANEL_X, 418)}

${label(PANEL_X, 690, 'PIVOTES DE ANIMACIÓN', { size: 17, anchor: 'start', weight: 800, spacing: 3 })}
<g stroke="#d6336c" stroke-width="1.4" fill="none"><circle cx="${PANEL_X + 8}" cy="711" r="5"/><line x1="${PANEL_X - 1}" y1="711" x2="${PANEL_X + 17}" y2="711"/><line x1="${PANEL_X + 8}" y1="702" x2="${PANEL_X + 8}" y2="720"/></g>
${label(PANEL_X + 26, 716, 'Cada grupo rota sobre su pivote (sin rigging)', { size: 12, anchor: 'start', weight: 400, spacing: 0.2 })}
${Object.entries(data.groups)
  .map(([name, g], i) =>
    label(PANEL_X, 744 + i * 21, `${name.padEnd(7, ' ')}  (${g.pivot.map((c) => c.toFixed(3)).join(', ')})`, {
      size: 12,
      anchor: 'start',
      weight: 500,
      spacing: 0.2,
    }),
  )
  .join('\n')}

<rect x="${PANEL_X - 20}" y="${SHEET_H - 150}" width="${SHEET_W - PANEL_X + 4}" height="134" fill="#eaf0f7" stroke="${INK}" stroke-width="1"/>
${label(PANEL_X, SHEET_H - 120, 'Fuente: assets/characters/protagonist.json', { size: 12, anchor: 'start', weight: 600, spacing: 0.2 })}
${label(PANEL_X, SHEET_H - 98, `Piezas: ${parts.length} · Versión ${data.version}`, { size: 12, anchor: 'start', weight: 400, spacing: 0.2 })}
${label(PANEL_X, SHEET_H - 76, 'Estilo: bloques low-poly con bisel suave', { size: 12, anchor: 'start', weight: 400, spacing: 0.2 })}
${label(PANEL_X, SHEET_H - 54, 'Generado con tools/character-blueprint', { size: 12, anchor: 'start', weight: 400, spacing: 0.2 })}
</svg>
`;

writeFileSync(output, svg);
console.log(`Wrote ${output} (${parts.length} parts)`);
