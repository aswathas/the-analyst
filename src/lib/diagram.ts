import type { Diagram, DiagramNode } from '../data/subjects/types';

const MUTED = '#4b5563';
const LINE = '#d1d5db';

const esc = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);

const ESCAPES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};

const TONE: Record<string, { fill: string; stroke: string; text: string }> = {
  core: { fill: '#eff6ff', stroke: '#0066cc', text: '#0b3b6f' },
  warn: { fill: '#fef2f2', stroke: '#dc2626', text: '#7f1d1d' },
  muted: { fill: '#f9fafb', stroke: '#d1d5db', text: '#374151' },
};

const toneOf = (node: DiagramNode) => TONE[node.kind || 'muted'];

function nodeBox(node: DiagramNode, x: number, y: number, w: number, h: number, { fontSize = 8.4, radius = 6 } = {}) {
  const tone = toneOf(node);
  const label = esc(node.label);
  const sub = node.sub ? esc(node.sub) : '';
  const lines = label.split('\n');
  const lineHeight = fontSize + 1.6;
  const subGap = sub ? lineHeight * 0.95 : 0;
  const startY = y + h / 2 - ((lines.length - 1) * lineHeight) / 2 - subGap / 2 + fontSize * 0.34;
  const texts = lines
    .map(
      (l, i) =>
        `<text x="${x + w / 2}" y="${startY + i * lineHeight}" text-anchor="middle" font-size="${fontSize}" font-weight="600" fill="${tone.text}">${l}</text>`,
    )
    .join('');
  const subText = sub
    ? `<text x="${x + w / 2}" y="${startY + lines.length * lineHeight}" text-anchor="middle" font-size="${fontSize - 0.8}" fill="${MUTED}">${sub}</text>`
    : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${tone.fill}" stroke="${tone.stroke}" stroke-width="1.2"/>${texts}${subText}`;
}

function arrow(x1: number, y1: number, x2: number, y2: number, label?: string): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const labelText = label
    ? `<text x="${mx}" y="${my - 3}" text-anchor="middle" font-size="7.4" fill="${MUTED}">${esc(label)}</text>`
    : '';
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${LINE}" stroke-width="1.2" marker-end="url(#arw)"/>${labelText}`;
}

export function renderDiagram(diagram: Diagram, accent = '#0066cc'): string {
  if (!diagram) return '';
  const nodes: DiagramNode[] = diagram.nodes || [];
  const defs = `<defs><marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af"/></marker></defs>`;

  let inner = '';
  let width: number;
  let height: number;

  if (diagram.kind === 'flow') {
    const n = nodes.length;
    const gap = 26;
    const boxW = n <= 4 ? 150 : n <= 6 ? 118 : 96;
    const boxH = 52;
    const widthNeeded = n * boxW + (n - 1) * gap;
    const startX = 4;
    const y = 26;
    const edges: Array<[number, number, string?]> = diagram.edges || [];
    for (const [from, to, label] of edges) {
      const a = nodes[from];
      const b = nodes[to];
      if (!a || !b) continue;
      const ai = nodes.indexOf(a);
      const bi = nodes.indexOf(b);
      const ax = startX + ai * (boxW + gap) + boxW;
      const bx = startX + bi * (boxW + gap);
      if (bi > ai) {
        inner += arrow(ax, y + boxH / 2, bx, y + boxH / 2, label);
      }
    }
    nodes.forEach((node, i) => {
      const x = startX + i * (boxW + gap);
      inner += nodeBox(node, x, y, boxW, boxH);
    });
    width = Math.max(widthNeeded + 8, 300);
    height = 96;
  } else if (diagram.kind === 'stack') {
    const boxW = 300;
    const boxH = 40;
    const gap = 8;
    const widthNeeded = boxW + 8;
    nodes.forEach((node, i) => {
      const y = 22 + i * (boxH + gap);
      inner += nodeBox(node, 4, y, boxW, boxH, { fontSize: 8.6 });
    });
    width = widthNeeded;
    height = 30 + nodes.length * 48;
  } else if (diagram.kind === 'cycle') {
    const n = Math.max(nodes.length, 3);
    const cx = 170;
    const cy = 150;
    const r = 100;
    const positions = nodes.map((_, i) => {
      const angle = (-90 + (360 / n) * i) * (Math.PI / 180);
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
    for (let i = 0; i < n; i++) {
      const a = positions[i];
      const b = positions[(i + 1) % n];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      const sx = a.x + (dx / len) * 46;
      const sy = a.y + (dy / len) * 26;
      const ex = b.x - (dx / len) * 46;
      const ey = b.y - (dy / len) * 26;
      inner += `<path d="M ${sx} ${sy} A ${len} ${len} 0 0 1 ${ex} ${ey}" fill="none" stroke="${LINE}" stroke-width="1.2" marker-end="url(#arw)"/>`;
    }
    positions.forEach((p, i) => {
      const node = nodes[i % nodes.length];
      inner += nodeBox(node, p.x - 52, p.y - 19, 104, 38, { fontSize: 8 });
    });
    inner += `<circle cx="${cx}" cy="${cy}" r="30" fill="${accent}" opacity="0.08"/>`;
    width = 360;
    height = 310;
  } else if (diagram.kind === 'compare') {
    const half = Math.ceil(nodes.length / 2);
    const left = nodes.slice(0, half);
    const right = nodes.slice(half);
    const colW = 220;
    const boxH = 34;
    const gap = 8;
    const rows = Math.max(left.length, right.length);
    const top = 30;
    const headers = ['Left', 'Right'];
    headers.forEach((h, i) => {
      const x = 4 + i * (colW + 28);
      inner += `<text x="${x + colW / 2}" y="16" text-anchor="middle" font-size="8" font-weight="700" fill="${MUTED}">${esc(h)}</text>`;
    });
    for (let r = 0; r < rows; r++) {
      const l = left[r];
      const rr = right[r];
      if (l) inner += nodeBox(l, 4, top + r * (boxH + gap), colW, boxH, { fontSize: 8.2 });
      if (rr) inner += nodeBox(rr, 4 + colW + 28, top + r * (boxH + gap), colW, boxH, { fontSize: 8.2 });
    }
    width = 4 + colW * 2 + 28 + 4;
    height = top + rows * (boxH + gap) + 10;
  } else if (diagram.kind === 'tree') {
    const edges: Array<[number, number, string?]> = diagram.edges || [];
    const children = new Map();
    for (const [from, to] of edges) {
      if (!children.has(from)) children.set(from, []);
      children.get(from).push(to);
    }
    const roots = edges.length ? edges.map((e) => e[0]).filter((v, i, a) => a.indexOf(v) === i) : [0];
    let cursor = 0;
    const place = (nodeIndex: number, depth: number): { i: number; depth: number; x: number } => {
      const kids = children.get(nodeIndex) || [];
      if (!kids.length) {
        const p: { i: number; depth: number; x: number } = { i: nodeIndex, depth, x: cursor * 150 + 4 };
        cursor++;
        return p;
      }
      const ps = kids.map((k: number) => place(k, depth + 1));
      const p: { i: number; depth: number; x: number } = { i: nodeIndex, depth, x: (ps[0].x + ps[ps.length - 1].x) / 2 };
      return p;
    };
    const placed: Array<{ i: number; depth: number; x: number }> = [];
    const collect = (nodeIndex: number, depth: number): void => {
      const p = place(nodeIndex, depth);
      placed.push(p);
      for (const k of children.get(nodeIndex) || []) collect(k, depth + 1);
    };
    for (const r of roots) collect(r, 0);
    const byIndex = new Map(placed.map((p) => [p.i, p]));
    const maxDepth = Math.max(...placed.map((p) => p.depth), 0);
    const rowH = 54;
    for (const [from, to, label] of edges) {
      const a = byIndex.get(from);
      const b = byIndex.get(to);
      if (!a || !b) continue;
      const ax = a.x + 52;
      const ay = a.depth * rowH + 40;
      const bx = b.x + 52;
      const by = b.depth * rowH + 14;
      inner += `<path d="M ${ax} ${ay} C ${ax + 30} ${ay}, ${bx - 30} ${by}, ${bx} ${by}" fill="none" stroke="${LINE}" stroke-width="1.2" marker-end="url(#arw)"/>`;
      if (label) inner += `<text x="${(ax + bx) / 2}" y="${(ay + by) / 2 - 2}" text-anchor="middle" font-size="7.4" fill="${MUTED}">${esc(label)}</text>`;
    }
    for (const p of placed) {
      const node = nodes[p.i];
      if (!node) continue;
      inner += nodeBox(node, p.x, p.depth * rowH + 14, 104, 38, { fontSize: 8 });
    }
    width = Math.max(cursor * 150 + 8, 200);
    height = maxDepth * rowH + 70;
  } else {
    // matrix
    const cols = Math.max(2, Math.ceil(Math.sqrt(nodes.length)));
    const rows = Math.ceil(nodes.length / cols);
    const cellW = 200;
    const cellH = 30;
    nodes.forEach((node, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      inner += nodeBox(node, 4 + c * (cellW + 10), 16 + r * (cellH + 8), cellW, cellH, { fontSize: 7.9 });
    });
    width = 4 + cols * (cellW + 10);
    height = 16 + rows * (cellH + 8) + 10;
  }

  const caption = diagram.caption
    ? `<div class="dg-cap"><b>${esc(diagram.title)}</b> — ${esc(diagram.caption)}</div>`
    : `<div class="dg-cap"><b>${esc(diagram.title)}</b></div>`;

  return `<figure class="dg">${caption}<svg viewBox="0 0 ${Math.round(width)} ${Math.round(height)}" width="${Math.round(width)}" height="${Math.round(height)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(diagram.title)}">${defs}${inner}</svg></figure>`;
}
