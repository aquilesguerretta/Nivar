// Prova visual das rotas do comércio: desenha as rotas publicadas sobre a terra do Natural Earth
// (50m no mundo, 10m nos recortes), em Mercator, como o mapa desenha os segmentos.
//
//   node tools/alexandria-atlas/comercio/desenhar.mjs --out <pasta> [--base <comercio-leva1.json>]
//
// --base sobrepõe, tracejadas e em cinza, as rotas de outro arquivo (a MARNET da leva 1) para comparar.
// Gera mundo.png e um PNG por recorte (RECORTES). Pontos vermelhos? Não: os trechos medidos sobre terra
// (pelo roteador) saem como cruzes em óxido, se o arquivo de trechos for dado com --trechos.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { feature as topoFeature } from 'topojson-client';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..', '..', '..');
const BRUTO = join(AQUI, '..', 'bruto', 'comercio');
const A = process.argv.slice(2);
const opt = (n) => (A.includes(n) ? A[A.indexOf(n) + 1] : null);
const OUT = opt('--out') ?? '.';
const BASE = opt('--base');
const TRECHOS = opt('--trechos');
mkdirSync(OUT, { recursive: true });

const dados = JSON.parse(readFileSync(join(RAIZ, 'public/alexandria/atlas/dados/comercio-2025.json'), 'utf8'));
const base = BASE ? JSON.parse(readFileSync(BASE, 'utf8')) : null;
const trechos = TRECHOS ? JSON.parse(readFileSync(TRECHOS, 'utf8')) : null;

const RECORTES = {
  mundo: [-180, 180, -60, 75, 2400, '50m'],
  brasil: [-62, -28, -36, 6, 1400, '10m'],
  europa: [-15, 32, 34, 67, 1600, '10m'],
  'suez-golfo': [20, 65, 5, 40, 1600, '10m'],
  asia: [70, 150, -15, 45, 1800, '10m'],
  caribe: [-100, -55, 0, 32, 1600, '10m'],
  'sul-america-sul': [-82, -40, -60, -10, 1400, '10m'],
  'estreitos-dinamarqueses': [8, 16, 53.5, 58.5, 1400, '10m'],
  'singapura-malaca': [95, 110, -3, 8, 1400, '10m'],
  // leva 3: os recortes de perto da folga da costa
  'perto-aceh': [93.5, 97.5, 4, 7.5, 1200, '10m'],
  'perto-gibraltar': [-7, -4, 35, 37, 1200, '10m'],
  'perto-bab-el-mandeb': [42.5, 44.5, 11.5, 13.5, 1200, '10m'],
  'perto-singapura': [102.5, 105.5, 0, 2.5, 1200, '10m'],
  'perto-gaspar': [104.5, 109, -4.5, -1, 1200, '10m'],
  'perto-dinamarca': [9, 14, 54, 58, 1200, '10m'],
  'perto-bretanha': [-7.5, -3, 47, 49.5, 1200, '10m'],
  'perto-nordeste': [-38, -33, -10, -3, 1200, '10m'],
  'perto-bahamas': [-81, -74, 22, 27.5, 1200, '10m'],
  'perto-dover': [-1, 3.5, 49.8, 51.8, 1200, '10m'],
};
const terraDe = {};
function terra(escala) {
  if (terraDe[escala]) return terraDe[escala];
  const t = JSON.parse(readFileSync(join(BRUTO, `natural-earth-countries-${escala}.json`), 'utf8'));
  return (terraDe[escala] = topoFeature(t, t.objects.countries).features);
}
const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (Math.max(-85, Math.min(85, lat)) * Math.PI) / 360));

function desenhar(nome, [x0, x1, y0, y1, Wpx, esc]) {
  const ym0 = merc(y0), ym1 = merc(y1); const kx = Wpx / (x1 - x0); const Hpx = Math.round(((ym1 - ym0) * 180) / Math.PI * kx);
  const X = (x) => (x - x0) * kx, Y = (y) => Hpx - ((merc(y) - ym0) * 180) / Math.PI * kx;
  const caminho = (pts, sh = 0) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x + sh).toFixed(1)},${Y(y).toFixed(1)}`).join('');
  const deslocs = [-360, 0, 360];
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${Wpx}" height="${Hpx}" viewBox="0 0 ${Wpx} ${Hpx}"><rect width="${Wpx}" height="${Hpx}" fill="#f2ecdf"/>`;
  for (const f of terra(esc)) {
    if (!f.geometry) continue;
    const polis = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const p of polis) {
      let bb = [999, 999, -999, -999]; for (const [x, y] of p[0]) bb = [Math.min(bb[0], x), Math.min(bb[1], y), Math.max(bb[2], x), Math.max(bb[3], y)];
      if (bb[3] < y0 - 1 || bb[1] > y1 + 1) continue;
      if (bb[2] - bb[0] > 180) continue; // anel que cruza o antimeridiano: fora dos recortes usados
      for (const sh of deslocs) { if (bb[2] + sh < x0 - 1 || bb[0] + sh > x1 + 1) continue; s += `<path d="${p.map((a) => caminho(a, sh) + 'Z').join('')}" fill="#d8ccb2" stroke="#8a7d62" stroke-width="0.4" fill-rule="evenodd"/>`; }
    }
  }
  const larg = nome === 'mundo' ? 1.2 : 1.6;
  if (base) for (const r of Object.values(base.rotas)) for (const sh of deslocs) s += `<path d="${caminho(r.linha, sh)}" fill="none" stroke="#7a7a7a" stroke-width="${larg}" stroke-dasharray="5 4" opacity="0.7"/>`;
  for (const [k, r] of Object.entries(dados.rotas)) {
    const cor = r.via === 'aérea' ? '#b8860b' : '#15213b';
    for (const sh of deslocs) {
      s += `<path d="${caminho(r.linha, sh)}" fill="none" stroke="${cor}" stroke-width="${larg}" opacity="0.85"><title>${k}</title></path>`;
      if (r.via !== 'aérea') for (const [x, y] of r.linha) s += `<circle cx="${X(x + sh).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="${nome === 'mundo' ? 1.2 : 2}" fill="#15213b"/>`;
    }
  }
  // portões
  for (const g of dados.fontes.rotas.portoes ?? []) for (const e of g.extremos) s += `<rect x="${X(e.lonlat[0]) - 3}" y="${Y(e.lonlat[1]) - 3}" width="6" height="6" fill="none" stroke="#9a3b22" stroke-width="1.5"/>`;
  if (trechos) for (const [, l] of Object.entries(trechos)) for (const [x, y] of l) for (const sh of deslocs) s += `<path d="M${X(x + sh) - 4},${Y(y) - 4}l8,8m0,-8l-8,8" stroke="#9a3b22" stroke-width="1.6"/>`;
  for (const a of Object.values(dados.ancoras)) s += `<circle cx="${X(a.lonlat[0])}" cy="${Y(a.lonlat[1])}" r="3" fill="none" stroke="#9a3b22" stroke-width="1.2"/>`;
  s += `<text x="10" y="22" font-family="sans-serif" font-size="16" fill="#15213b">${nome} · tinta: rota marítima (roteador próprio) · ouro: arco aéreo${base ? ' · cinza tracejado: MARNET da leva 1' : ''}</text></svg>`;
  const svg = join(OUT, `${nome}.svg`); writeFileSync(svg, s);
  return sharp(Buffer.from(s), { limitInputPixels: false }).png().toFile(join(OUT, `${nome}.png`)).then(() => console.log(join(OUT, `${nome}.png`)));
}
// Globo (ortográfica), como o leitor vê no Atlas: cada segmento é densificado reto em Mercator (como o
// mapa desenha) e projetado; o lado de trás some.
const GLOBOS = { 'globo-atlantico': [-20, -15], 'globo-indico': [55, -20], 'globo-europa': [0, 35], 'globo-asia': [110, 10] };
function desenharGlobo(nome, [l0, f0], Wpx = 1400) {
  const r = Wpx / 2 - 20, cx = Wpx / 2, cy = Wpx / 2, d = Math.PI / 180;
  const proj = ([l, f]) => { const dl = (l - l0) * d, ph = f * d, p0 = f0 * d; const cosc = Math.sin(p0) * Math.sin(ph) + Math.cos(p0) * Math.cos(ph) * Math.cos(dl); const x = Math.cos(ph) * Math.sin(dl), y = Math.cos(p0) * Math.sin(ph) - Math.sin(p0) * Math.cos(ph) * Math.cos(dl); return [cx + r * x, cy - r * y, cosc > 0]; };
  const dens = (pts) => { const o = []; for (let k = 1; k < pts.length; k++) { const a = pts[k - 1], b = pts[k]; const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.5)); const ya = merc(a[1]), yb = merc(b[1]); for (let q = 0; q < n; q++) { const t = q / n; o.push([a[0] + (b[0] - a[0]) * t, (2 * Math.atan(Math.exp(ya + (yb - ya) * t)) - Math.PI / 2) / d]); } } o.push(pts[pts.length - 1]); return o; };
  const traco = (pts) => { let s2 = '', fora = true; for (const q of pts) { const [x, y, v] = proj(q); if (!v) { fora = true; continue; } s2 += `${fora ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`; fora = false; } return s2; };
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${Wpx}" height="${Wpx}"><rect width="${Wpx}" height="${Wpx}" fill="#ffffff"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#f2ecdf" stroke="#8a7d62"/>`;
  for (const f of terra('50m')) { if (!f.geometry) continue; const polis = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const pol of polis) { const pr = pol[0].map(proj); if (!pr.some((q) => q[2])) continue; s += `<path d="${pr.map(([x, y, v], k) => { if (!v) { const dx = x - cx, dy = y - cy, m = Math.hypot(dx, dy) || 1; x = cx + (dx / m) * r; y = cy + (dy / m) * r; } return `${k ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`; }).join('')}Z" fill="#d8ccb2" stroke="#8a7d62" stroke-width="0.4"/>`; } }
  if (base) for (const rr of Object.values(base.rotas)) s += `<path d="${traco(dens(rr.linha))}" fill="none" stroke="#7a7a7a" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.7"/>`;
  for (const rr of Object.values(dados.rotas)) s += `<path d="${traco(dens(rr.linha))}" fill="none" stroke="${rr.via === 'aérea' ? '#b8860b' : '#15213b'}" stroke-width="1.4" opacity="0.85"/>`;
  s += `<text x="10" y="22" font-family="sans-serif" font-size="16" fill="#15213b">${nome} (centro ${l0}, ${f0})</text></svg>`;
  writeFileSync(join(OUT, `${nome}.svg`), s);
  return sharp(Buffer.from(s)).png().toFile(join(OUT, `${nome}.png`)).then(() => console.log(join(OUT, `${nome}.png`)));
}
const so = opt('--so');
for (const [n, c] of Object.entries(GLOBOS)) if (!so || new RegExp(so).test(n)) await desenharGlobo(n, c);
for (const [n, r] of Object.entries(RECORTES)) if (!so || new RegExp(so).test(n)) await desenhar(n, r);
