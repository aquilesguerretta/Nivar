// gerar.mjs — monta, para cada aula do M01, uma composição HyperFrames
// (index.html + assets), as legendas pt-BR.vtt e o arquivo de tempos.
//
// Uso (da raiz do repositório):
//   node docs/alexandria-v3/video-aulas/m01/composicao/gerar.mjs <pasta-de-trabalho> [n...]
// A pasta de trabalho precisa ter narr/aula-0N.mp3 e narr/tN/transcript.json
// (transcrição local por palavra: `hyperframes transcribe -e parakeet -l pt`).
// Saída: <pasta>/build/aula-0N/{index.html,assets/,tempos.json} e
//        public/alexandria/v3/aulas/m01/video/aula-0N.pt-BR.vtt
import fs from 'node:fs';
import path from 'node:path';
import { AULAS, FOTOS } from './roteiros.mjs';

const WORK = process.argv[2];
if (!WORK) { console.error('uso: gerar.mjs <pasta-de-trabalho> [n...]'); process.exit(1); }
const SO = process.argv.slice(3).map(Number);
const REPO = process.cwd();
const FOTO_DIR = path.join(REPO, 'public/alexandria/v3/aulas/m01');
const OUT_VTT = path.join(REPO, 'public/alexandria/v3/aulas/m01/video');
const FONTES_NM = {
  'newsreader-normal.woff2': 'node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2',
  'newsreader-italic.woff2': 'node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2',
  'newsreader-ext-normal.woff2': 'node_modules/@fontsource-variable/newsreader/files/newsreader-latin-ext-opsz-normal.woff2',
  'instrument-sans.woff2': 'node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2',
  'plex-mono-400.woff2': 'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
  'plex-mono-500.woff2': 'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2',
};

export const T0 = 4.5;      // abertura muda: ponto de entrada da fala do Founder
const FECHO = 5.0;          // cartela de créditos
const XF = 0.5;             // sobreposição entre cenas (dissolve)

// ───────────────────────── alinhamento fala × transcrição ─────────────────────────
const NUM = new Set('zero um uma dois duas tres quatro cinco seis sete oito nove dez onze doze treze catorze quatorze quinze dezesseis dezessete dezoito dezenove vinte trinta quarenta cinquenta sessenta setenta oitenta noventa cem cento duzentos duzentas trezentos trezentas quatrocentos quatrocentas quinhentos quinhentas seiscentos setecentos setecentas oitocentos oitocentas novecentos mil virgula e por cento'.split(' '));
const norm = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const tokens = (s) => s.split(/[\s\-–—/]+/).map(norm).filter((w) => w && !/\d/.test(w) && !NUM.has(w));
const parecido = (a, b) => a === b || (a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5));

function alinhar(blocos, palavras) {
  // sequência da fala (com bloco de origem) × sequência transcrita; DP de edição
  const A = []; blocos.forEach((b, bi) => tokens(b.fala).forEach((w) => A.push({ w, bi })));
  const B = []; palavras.forEach((p, pi) => p.text.split(/[\s\-]+/).map(norm).forEach((w) => { if (w && !/\d/.test(w) && !NUM.has(w)) B.push({ w, pi }); }));
  const n = A.length, m = B.length;
  const D = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = 0; i <= n; i++) D[i][0] = i;
  for (let j = 0; j <= m; j++) D[0][j] = j;
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    const c = parecido(A[i - 1].w, B[j - 1].w) ? 0 : 1;
    D[i][j] = Math.min(D[i - 1][j - 1] + c, D[i - 1][j] + 1, D[i][j - 1] + 1);
  }
  const par = new Array(n).fill(-1);
  let i = n, j = m, iguais = 0;
  while (i > 0 && j > 0) {
    const c = parecido(A[i - 1].w, B[j - 1].w) ? 0 : 1;
    if (D[i][j] === D[i - 1][j - 1] + c) { if (!c) { par[i - 1] = B[j - 1].pi; iguais++; } i--; j--; }
    else if (D[i][j] === D[i - 1][j] + 1) i--; else j--;
  }
  // início e fim de cada bloco: primeira e última palavra casada
  const res = blocos.map(() => ({ ini: null, fim: null, toks: [] }));
  A.forEach((a, k) => { if (par[k] >= 0) { const r = res[a.bi]; const p = palavras[par[k]]; if (r.ini === null) r.ini = p.start; r.fim = p.end; r.toks.push({ w: a.w, t: p.start }); } });
  // bloco que começa com número ("Uma usina de cem…"): recua até a primeira palavra transcrita após o fim do anterior
  res.forEach((r, k) => {
    const lim = k ? res[k - 1].fim : 0;
    const prim = palavras.find((p) => p.start >= lim - 0.01 && p.start < (r.ini ?? 1e9));
    if (prim && k) r.ini = Math.min(r.ini, prim.start);
    if (!k) r.ini = palavras[0].start;
  });
  return { res, cobertura: iguais / n, n, m };
}

// ───────────────────────────── legendas ─────────────────────────────
function pedacos(txt, max = 92) {
  const frases = txt.replace(/(\d)\.(\d)/g, '$1․$2').match(/[^.!?]+[.!?]+(?:["”]\.?)?|[^.!?]+$/g).map((s) => s.trim().replace(/․/g, '.')).filter(Boolean);
  const out = [];
  for (const f of frases) {
    if (f.length <= max) { out.push(f); continue; }
    // quebra em vírgula, dois-pontos, ponto e vírgula ou travessão mais perto do meio
    let resto = f;
    while (resto.length > max) {
      const alvo = Math.min(max, Math.ceil(resto.length / Math.ceil(resto.length / max)));
      let melhor = -1;
      for (let k = 0; k < resto.length; k++) if (/[,;:—]/.test(resto[k]) && !(resto[k] === ',' && /[0-9]/.test(resto[k - 1] || '') && /[0-9]/.test(resto[k + 1] || '')) && k > 25 && k <= max) { if (melhor < 0 || Math.abs(k - alvo) < Math.abs(melhor - alvo)) melhor = k; }
      if (melhor < 0) { melhor = resto.lastIndexOf(' ', max); }
      // travessão vai para o começo da linha seguinte; os demais sinais ficam no fim
      const corte = resto[melhor] === ' ' || resto[melhor] === '—' ? melhor : melhor + 1;
      out.push(resto.slice(0, corte).trim()); resto = resto.slice(corte).trim();
    }
    if (resto) { if (resto.length < 24 && out.length && out[out.length - 1].length + resto.length < max + 24) out[out.length - 1] += ' ' + resto; else out.push(resto); }
  }
  return out;
}
const ts = (s) => { const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = s % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${x.toFixed(3).padStart(6, '0')}`; };

function legendas(blocos, al, durNarr) {
  const cues = [];
  blocos.forEach((b, bi) => {
    const r = al.res[bi];
    const fim = bi + 1 < blocos.length ? al.res[bi + 1].ini - 0.05 : durNarr;
    const ps = pedacos(b.leg);
    const totalLeg = ps.reduce((s, p) => s + p.length, 0);
    let acum = 0; const inicios = [];
    ps.forEach((p, k) => {
      let t = null;
      if (k > 0) {
        // tenta ancorar nas duas primeiras palavras do pedaço
        const tk = tokens(p).slice(0, 2);
        if (tk.length === 2) for (let q = 0; q < r.toks.length - 1; q++) if (parecido(r.toks[q].w, tk[0]) && parecido(r.toks[q + 1].w, tk[1]) && r.toks[q].t > inicios[k - 1] + ps[k - 1].length / 22) { t = r.toks[q].t; break; }
        if (t === null) t = r.ini + (fim - r.ini) * (acum / totalLeg);
      } else t = r.ini;
      inicios.push(t); acum += p.length;
    });
    const loc = ps.map((p, k) => ({ ini: inicios[k], fim: k + 1 < ps.length ? inicios[k + 1] - 0.04 : fim, txt: p }));
    for (let k = 0; k < loc.length - 1; k++) if (loc[k].fim - loc[k].ini < 1.0) { loc[k + 1] = { ini: loc[k].ini, fim: loc[k + 1].fim, txt: loc[k].txt + ' ' + loc[k + 1].txt }; loc.splice(k, 1); k--; }
    const u = loc.length - 1;
    if (u > 0 && loc[u].fim - loc[u].ini < 1.0) { loc[u - 1] = { ini: loc[u - 1].ini, fim: loc[u].fim, txt: loc[u - 1].txt + ' ' + loc[u].txt }; loc.pop(); }
    cues.push(...loc);
  });
  return cues;
}

// ───────────────────────────── cenas ─────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const nf = (v, d = 0) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
let JS = [];   // linhas do timeline
const IN = (sel, t, o = {}) => JS.push(`tl.fromTo(${JSON.stringify(sel)},{opacity:0,y:${o.y ?? 14}},{opacity:1,y:0,duration:${o.d ?? 0.6},ease:"power2.out"},${t.toFixed(3)});`);
const FADE = (sel, t, d = 0.6) => JS.push(`tl.fromTo(${JSON.stringify(sel)},{opacity:0},{opacity:1,duration:${d},ease:"none"},${t.toFixed(3)});`);
const DIM = (sel, t, to = 0.35, d = 0.5) => JS.push(`tl.to(${JSON.stringify(sel)},{opacity:${to},duration:${d},ease:"power1.inOut"},${t.toFixed(3)});`);
const DRAW = (sel, t, d = 1.2) => JS.push(`tl.fromTo(${JSON.stringify(sel)},{strokeDashoffset:1},{strokeDashoffset:0,duration:${d},ease:"power1.inOut"},${t.toFixed(3)});`);
const GROWY = (sel, t, d = 1.0) => JS.push(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});const y=+e.getAttribute("y"),h=+e.getAttribute("height");tl.fromTo(e,{attr:{y:y+h,height:0}},{attr:{y:y,height:h},duration:${d},ease:"power2.out"},${t.toFixed(3)});})();`);
const GROWX = (sel, t, d = 1.0) => JS.push(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});if(e instanceof SVGElement){const w=+e.getAttribute("width");tl.fromTo(e,{attr:{width:0}},{attr:{width:w},duration:${d},ease:"power2.out"},${t.toFixed(3)});}else{tl.fromTo(e,{scaleX:0},{scaleX:1,transformOrigin:"0% 50%",duration:${d},ease:"power2.out"},${t.toFixed(3)});}})();`);
let NC = 0;
const COUNT = (id, t, d, para, casas = 0, suf = '') => { const k = `c${NC++}`; JS.push(`const ${k}={v:0};tl.fromTo(${k},{v:0},{v:${para},duration:${d},ease:"power1.out",onUpdate:()=>{document.getElementById(${JSON.stringify(id)}).textContent=fmt(${k}.v,${casas})+${JSON.stringify(suf)};}},${t.toFixed(3)});`); };
const KB = (sel, t, d, de = 1.0, para = 1.045) => JS.push(`tl.fromTo(${JSON.stringify(sel)},{scale:${de}},{scale:${para},duration:${d.toFixed(3)},ease:"none"},${t.toFixed(3)});`);

const fonteL = (id, txt) => `<div class="fonte-l" id="${id}-fonte">FONTE · ${esc(txt)}</div>`;
const credito = (f) => `FOTO · ${esc(f.autor)} · Wikimedia Commons · ${esc(f.lic)}`;

// eixos genéricos de gráfico em SVG (coordenadas em px dentro do viewBox)
function eixos({ x0, y0, w, h, xt = [], yt = [], xl = '', yl = '' }) {
  let s = `<g class="eixo"><line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - h}"/>`;
  for (const [x, lab] of xt) s += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + 8}"/><text x="${x}" y="${y0 + 34}" text-anchor="middle">${esc(lab)}</text>`;
  for (const [y, lab] of yt) s += `<line x1="${x0 - 8}" y1="${y}" x2="${x0}" y2="${y}"/><line class="grade" x1="${x0}" y1="${y}" x2="${x0 + w}" y2="${y}"/><text x="${x0 - 16}" y="${y + 6}" text-anchor="end">${esc(lab)}</text>`;
  if (xl) s += `<text class="eixo-rot" x="${x0 + w}" y="${y0 + 70}" text-anchor="end">${esc(xl)}</text>`;
  if (yl) s += `<text class="eixo-rot" x="${x0}" y="${y0 - h - 26}" text-anchor="start">${esc(yl)}</text>`;
  return s + '</g>';
}

const CENAS = {
  abertura(id, c, st, a) {
    IN(`#${id}-m`, st[0] + 0.3); IN(`#${id}-n`, st[0] + 0.6); IN(`#${id}-t`, st[0] + 0.9, { y: 22, d: 0.9 }); GROWX(`#${id}-r`, st[0] + 1.4, 0.9); IN(`#${id}-s`, st[0] + 1.7);
    return `<div class="abertura">
      <div class="rotulo" id="${id}-m">Alexandria · Módulo 01 · Física de Energia e Eletricidade</div>
      <div class="ab-num" id="${id}-n">Aula ${String(a.n).padStart(2, '0')}</div>
      <h1 class="ab-tit" id="${id}-t">${esc(a.titulo)}</h1>
      <div class="ab-fio" id="${id}-r"></div>
      <div class="ab-tema" id="${id}-s">${esc(a.tema)}</div></div>`;
  },
  pergunta(id, c, st, a, b) {
    let txt = esc(b[0].leg);
    for (const h of c.hl || []) txt = txt.replace(esc(h), `<span class="hl">${esc(h)}</span>`);
    IN(`#${id}-l`, st[0] + 0.1); IN(`#${id}-q`, st[0] + 0.35, { y: 20, d: 0.9 }); FADE(`#${id}-fonte`, st[0] + 1.2);
    return `<div class="bloco-centro"><div class="rotulo" id="${id}-l">A pergunta da aula</div><div class="perg" id="${id}-q">${txt}</div></div>${fonteL(id, `§ MAP do módulo · pergunta da Aula ${String(a.n).padStart(2, '0')}`)}`;
  },
  letreiro(id, c, st) {
    if (c.apoio) IN(`#${id}-a`, st[0] + 0.15);
    IN(`#${id}-f`, st[0] + 0.45, { y: 18, d: 0.9 }); FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="bloco-centro">${c.apoio ? `<div class="apoio" id="${id}-a">${esc(c.apoio)}</div>` : ''}<div class="frase" id="${id}-f">${esc(c.frase)}</div></div>${fonteL(id, c.fonte)}`;
  },
  definicoes(id, c, st) {
    c.itens.forEach((_, k) => { IN(`#${id}-i${k}`, st[0] + 0.3 + k * 0.5); });
    return `<div class="duas">${c.itens.map(([l, t], k) => `<div class="col" id="${id}-i${k}"><div class="col-rot">${esc(l)}</div><div class="col-txt">${esc(t)}</div></div>`).join('')}</div>${fonteL(id, 'M01 · Aula 01 · 1.2')}`;
  },
  analogia(id, c, st) {
    IN(`#${id}-h`, st[0] + 0.2); c.linhas.forEach((_, k) => IN(`#${id}-r${k}`, st[0] + 0.6 + k * 0.6)); FADE(`#${id}-fonte`, st[0] + 1.2);
    return `<div class="tabela" ><div class="tr th" id="${id}-h"><div>Analogia hidráulica</div><div>Equivalente elétrico</div><div>O que mede</div></div>${c.linhas.map((l, k) => `<div class="tr" id="${id}-r${k}">${l.map((x) => `<div>${esc(x)}</div>`).join('')}</div>`).join('')}</div>${fonteL(id, c.fonte)}`;
  },
  formula(id, c, st) {
    const passo1 = st[1] ?? st[0] + 1.6;
    if (c.apoio) {
      // abre com a frase do bloco em tamanho de letreiro; a fórmula entra no bloco seguinte
      IN(`#${id}-a`, st[0] + 0.3, { y: 18, d: 0.9 }); DIM(`#${id}-a`, passo1, 0.4);
      IN(`#${id}-e`, passo1 + 0.2, { y: 16, d: 0.8 }); if (c.sub) IN(`#${id}-s`, passo1 + 0.9);
    } else { IN(`#${id}-e`, st[0] + 0.3, { y: 16, d: 0.8 }); if (c.sub) IN(`#${id}-s`, st[0] + 0.9); }
    if (c.conta) c.conta.forEach((_, k) => IN(`#${id}-k${k}`, st[0] + 3.0 + k * 0.7));
    FADE(`#${id}-fonte`, st[0] + 1.2);
    return `<div class="bloco-centro">${c.apoio ? `<div class="frase f-apoio" id="${id}-a">${esc(c.apoio)}</div>` : ''}<div class="eq${c.apoio ? ' eq-depois' : ''}" id="${id}-e">${esc(c.eq)}</div>${c.sub ? `<div class="eq-sub" id="${id}-s">${esc(c.sub)}</div>` : ''}${c.conta ? `<div class="conta">${c.conta.map((x, k) => `<span id="${id}-k${k}">${esc(x)}</span>`).join('')}</div>` : ''}</div>${fonteL(id, c.fonte)}`;
  },
  formulas(id, c, st) {
    c.eqs.forEach((_, k) => IN(`#${id}-e${k}`, (st[k] ?? st[0]) + 0.3, { d: 0.8 }));
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="bloco-centro">${c.eqs.map((e, k) => `<div class="eq eq-m" id="${id}-e${k}">${esc(e)}</div>`).join('')}</div>${fonteL(id, c.fonte)}`;
  },
  retangulos(id, c, st) {
    // dois painéis na MESMA escala: 0–50 h × 0–50 kW; área = 50 kWh nos dois
    const W = 680, H = 420, x0 = 90, y0 = 560;
    const sx = W / 50, sy = H / 50;
    const painel = (k, kw, h, tit, pico) => {
      const xt = [0, 10, 20, 30, 40, 50].map((v) => [x0 + v * sx, nf(v)]);
      const yt = [10, 20, 30, 40, 50].map((v) => [y0 - v * sy, nf(v)]);
      return `<svg class="graf" viewBox="0 0 860 640" id="${id}-p${k}">
        <text class="graf-tit" x="${x0}" y="20">${esc(tit)}</text>
        ${eixos({ x0, y0, w: W, h: H, xt, yt, xl: 'tempo (h)', yl: 'potência (kW)' })}
        <rect class="area" id="${id}-a${k}" x="${x0}" y="${y0 - kw * sy}" width="${h * sx}" height="${kw * sy}"/>
        <text class="rot-num" id="${id}-t${k}" x="${k ? x0 + 20 : x0 + h * sx + 18}" y="${k ? y0 - kw * sy - 18 : y0 - kw * sy + 30}">${esc(pico)}</text>
      </svg>`;
    };
    IN(`#${id}-p0`, st[0] + 0.2); GROWY(`#${id}-a0`, st[0] + 1.6, 1.0); IN(`#${id}-t0`, st[0] + 2.4);
    IN(`#${id}-p1`, st[0] + 3.4); GROWX(`#${id}-a1`, st[0] + 4.6, 1.4); IN(`#${id}-t1`, st[0] + 5.8);
    IN(`#${id}-m`, st[0] + 7.5); FADE(`#${id}-fonte`, st[0] + 1.2);
    if (st[1]) { DIM(`#${id}-m`, st[1], 0, 0.4); IN(`#${id}-n`, st[1] + 0.3); }
    return `<div class="par-graf">${painel(0, 50, 1, '50 kW × 1 h', 'área = 50 kWh · pico 50 kW')}${painel(1, 1, 50, '1 kW × 50 h', 'área = 50 kWh · pico 1 kW')}</div>
      <div class="nota-graf" id="${id}-m">Mesma escala nos dois painéis. Mesmo kWh, perfis completamente diferentes.</div>
      ${st[1] ? `<div class="nota-graf forte" id="${id}-n">O kWh igual mascara que são problemas de engenharia opostos.</div>` : ''}
      ${fonteL(id, 'cenários da nota do instrumento INST·01 · M01 · Aula 01 · energia = potência × tempo')}`;
  },
  erro(id, c, st) {
    IN(`#${id}-e`, st[0] + 0.2, { d: 0.8 }); GROWX(`#${id}-x`, st[0] + 1.6, 0.5); IN(`#${id}-w`, st[0] + 1.9);
    c.certos.forEach((_, k) => IN(`#${id}-c${k}`, st[0] + 4.3 + k * 1.6)); FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="bloco-centro"><div class="errado"><span id="${id}-e">“${esc(c.errado)}”</span><div class="risco" id="${id}-x"></div></div>
      <div class="rotulo oxido" id="${id}-w">Errado. MW mede potência, não energia.</div>
      <div class="certos">${c.certos.map((x, k) => `<div class="certo" id="${id}-c${k}"><span class="mono-s">O correto</span>“${esc(x)}”</div>`).join('')}</div></div>${fonteL(id, c.fonte)}`;
  },
  foto(id, c, st, a, b, dur) {
    const f = FOTOS[c.foto];
    const lado = c.lado || 'esq';
    KB(`#${id}-img`, st[0], dur + 0.2);
    FADE(`#${id}-ph`, st[0] + 0.05, 0.7); FADE(`#${id}-cr`, st[0] + (lado === 'cheia' ? 0.2 : 0.9));
    if (lado === 'cheia') IN(`#${id}-pn`, st[0] + 0.35, { y: 10, d: 0.6 });
    else (c.texto || []).forEach((_, k) => IN(`#${id}-x${k}`, st[0] + 0.6 + k * Math.min(2.2, Math.max(0.8, (dur - 2) / Math.max(1, c.texto.length)))));
    const txt = (c.texto || []).map(([l, t], k) => `<div class="fx" id="${id}-x${k}">${l ? `<div class="fx-rot">${esc(l)}</div>` : ''}<div class="fx-txt">${esc(t)}</div></div>`).join('');
    const imgStyle = f.recorteFilme ? 'transform-origin:50% 50%;' : '';
    if (lado === 'cheia') {
      return `<div class="ph-cheia" id="${id}-ph"><div class="ph-mold"><img id="${id}-img" src="assets/${f.arq}" style="${imgStyle}"/></div></div>
        <div class="ph-painel" id="${id}-pn">${txt}</div>
        <div class="ph-cred-cheia" id="${id}-cr"><div class="ph-leg">${esc(f.leg)}</div><div class="ph-cred">${credito(f)}</div></div>`;
    }
    return `<div class="ph-lado ${lado}" id="${id}-ph"><div class="ph-mold${f.recorteFilme ? ' filme' : ''}"><img id="${id}-img" src="assets/${f.arq}"/></div>
      <div id="${id}-cr"><div class="ph-leg">${esc(f.leg)}</div><div class="ph-cred">${credito(f)}</div></div></div>
      <div class="ph-texto ${lado}">${txt}</div>`;
  },
  unidades(id, c, st) {
    const u = [['V', 'volt', 'tensão elétrica', 'a diferença de potencial que empurra a corrente pelo condutor'], ['A', 'ampere', 'corrente elétrica', 'o fluxo de carga elétrica passando pelo condutor por segundo'], ['W', 'watt', 'potência', 'P (W) = V (volts) × I (amperes)']];
    u.forEach((_, k) => IN(`#${id}-u${k}`, (st[k] ?? st[0]) + 0.2, { d: 0.7 }));
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="tres">${u.map(([s, n, m, d], k) => `<div class="card" id="${id}-u${k}"><div class="card-sim">${s}</div><div class="card-nome">${n} · mede ${m}</div><div class="card-txt">${esc(d)}</div></div>`).join('')}</div>${fonteL(id, 'M01 · Aula 02 · 2.1, 2.2, 2.3')}`;
  },
  cadeia(id, c, st) {
    const cx = ['220 V × 10 A', '2.200 W', '2,2 kW', '× 5 h', '11 kWh'];
    const gen = ['V × A', 'W', 'kW', 'kWh × tarifa', 'R$'];
    cx.forEach((_, k) => IN(`#${id}-a${k}`, st[0] + 0.4 + k * 1.3));
    if (st[1]) gen.forEach((_, k) => IN(`#${id}-b${k}`, st[1] + 0.2 + k * 0.45));
    FADE(`#${id}-fonte`, st[0] + 1.0);
    const fila = (arr, p, cls) => `<div class="fila ${cls}">${arr.map((x, k) => `${k ? `<span class="seta" id="${id}-${p}s${k}">→</span>` : ''}<span class="caixa" id="${id}-${p}${k}">${esc(x)}</span>`).join('')}</div>`;
    if (st[1]) gen.forEach((_, k) => k && FADE(`#${id}-bs${k}`, st[1] + 0.1 + k * 0.45));
    cx.forEach((_, k) => k && FADE(`#${id}-as${k}`, st[0] + 0.3 + k * 1.3));
    return `<div class="bloco-centro"><div class="rotulo">Nota do instrumento INST·02</div>${fila(cx, 'a', 'num')}<div class="rotulo mt">A cadeia</div>${fila(gen, 'b', '')}</div>${fonteL(id, 'nota do INST·02 · M01 · Aula 02 · "a espinha física da fatura elétrica"')}`;
  },
  escada(id, c, st, a, b, dur) {
    // tabela 2.1: rótulo e "onde aparece" à esquerda; faixa no eixo logarítmico (100 V a 1 MV) à direita
    const lin = [[127, 220, '127 / 220 V', 'Baixa tensão residencial e comercial'], [220, 440, '220 / 380 / 440 V', 'Baixa tensão trifásica'], [13800, 13800, '13,8 kV', 'Distribuição em média tensão'], [23000, 34500, '23 / 34,5 kV', 'Distribuição média tensão expandida'], [69000, 69000, '69 kV', 'Subtransmissão'], [88000, 138000, '88 / 138 kV', 'Subtransmissão de alta capacidade'], [230000, null, '230 kV +', 'Transmissão de alta tensão']];
    const x0 = 470, W = 540, lx = (v) => x0 + (Math.log10(v) - 2) / 4 * W;
    const yb = 650, dy = 84;
    let s = '';
    lin.forEach(([lo, hi, lab, onde], k) => {
      const y = yb - 40 - k * dy;
      const xa = lx(lo), xb = hi ? lx(hi) : x0 + W;
      s += `<g id="${id}-l${k}"><text class="rot-num" x="0" y="${y - 4}">${esc(lab)}</text><text class="rot-s" x="0" y="${y + 24}">${esc(onde)}</text><line class="guia" x1="${x0}" y1="${y}" x2="${x0 + W}" y2="${y}"/><line class="faixa" x1="${xa}" y1="${y}" x2="${Math.max(xb, xa + 8)}" y2="${y}"/>${hi ? '' : `<path class="seta-a" d="M${x0 + W - 4} ${y - 10} L${x0 + W + 12} ${y} L${x0 + W - 4} ${y + 10}"/>`}</g>`;
    });
    const xt = [[100, '100 V'], [1000, '1 kV'], [1e4, '10 kV'], [1e5, '100 kV'], [1e6, '1 MV']];
    const eixo = `<line class="eixo-l" x1="${x0}" y1="${yb}" x2="${x0 + W}" y2="${yb}"/>${xt.map(([v, l]) => `<line class="eixo-l" x1="${lx(v)}" y1="${yb}" x2="${lx(v)}" y2="${yb + 8}"/><text class="tick" x="${lx(v)}" y="${yb + 34}" text-anchor="middle">${l}</text>`).join('')}<text class="eixo-rot" x="${x0 + W}" y="${yb + 66}" text-anchor="end">tensão (escala logarítmica)</text>`;
    lin.forEach((_, k) => IN(`#${id}-l${k}`, st[0] + 0.5 + k * Math.min(1.3, (dur - 4) / 7), { y: 8, d: 0.5 }));
    FADE(`#${id}-fonte`, st[0] + 1.0);
    const f = FOTOS[c.foto]; KB(`#${id}-img`, st[0], dur + 0.2); FADE(`#${id}-ph`, st[0] + 0.3, 0.8);
    return `<svg class="graf escada" viewBox="0 0 1040 740">${eixo}${s}</svg>
      <div class="ph-mini" id="${id}-ph"><div class="ph-mold"><img id="${id}-img" src="assets/${f.arq}"/></div><div class="ph-leg">${esc(f.leg)}</div><div class="ph-cred">${credito(f)}</div></div>
      ${fonteL(id, 'tabela 2.1 · M01 · Aula 02 · níveis de tensão conforme a aula; a foto não afirma a tensão da linha')}`;
  },
  triangulo(id, c, st, a, b, dur) {
    // em escala: 800 : 480 (INST·05). Na A02 só os rótulos.
    const k = 0.66, x0 = 150, y0 = 520, X = 800 * k, Y = 480 * k;
    const n = c.numeros;
    const ang = Math.atan2(Y, X);
    const svg = `<svg class="graf tri${n ? '' : ' so'}" viewBox="0 0 1100 700" id="${id}-s">
      <line class="cat" id="${id}-kw" x1="${x0}" y1="${y0}" x2="${x0 + X}" y2="${y0}" pathLength="1"/>
      <line class="cat2" id="${id}-kv" x1="${x0 + X}" y1="${y0}" x2="${x0 + X}" y2="${y0 - Y}" pathLength="1"/>
      <line class="hip" id="${id}-kva" x1="${x0}" y1="${y0}" x2="${x0 + X}" y2="${y0 - Y}" pathLength="1"/>
      <path class="fio-fino" d="M${x0 + X - 22} ${y0} L${x0 + X - 22} ${y0 - 22} L${x0 + X} ${y0 - 22}"/>
      <path class="cat2" id="${id}-arc" d="M${x0 + 90} ${y0} A90 90 0 0 0 ${x0 + 90 * Math.cos(ang)} ${y0 - 90 * Math.sin(ang)}" pathLength="1"/>
      <g id="${id}-r1"><text class="rot-num" x="${x0 + X / 2}" y="${y0 + 46}" text-anchor="middle">${n ? '800 kW' : 'kW'}</text><text class="rot-s" x="${x0 + X / 2}" y="${y0 + 78}" text-anchor="middle">potência ativa · vira produção</text></g>
      <g id="${id}-r2"><text class="rot-num" x="${x0 + X + 22}" y="${y0 - Y / 2}">${n ? '480 kVAr' : 'kVAr'}</text><text class="rot-s" x="${x0 + X + 22}" y="${y0 - Y / 2 + 32}">reativa · ocupa a rede</text></g>
      <g id="${id}-r3"><text class="rot-num" x="${x0 + X / 2 - 40}" y="${y0 - Y / 2 - 30}" text-anchor="end">${n ? '933 kVA' : 'kVA'}</text><text class="rot-s" x="${x0 + X / 2 - 40}" y="${y0 - Y / 2 + 2}" text-anchor="end">aparente · o que a rede dimensiona</text></g>
      <text class="rot-num" id="${id}-phi" x="${x0 + 104}" y="${y0 - 18}">φ${n ? ' = 31,0°' : ''}</text>
    </svg>`;
    DRAW(`#${id}-kw`, st[0] + 0.3, 1.0); DRAW(`#${id}-kv`, st[0] + 1.1, 0.8); DRAW(`#${id}-kva`, st[0] + 1.8, 1.0); DRAW(`#${id}-arc`, st[0] + 2.6, 0.6);
    const tr = n ? st[0] + 0.6 : (st[1] ?? st[0]) + 0.3;
    IN(`#${id}-r1`, tr); IN(`#${id}-r2`, tr + 0.8); IN(`#${id}-r3`, tr + 1.6); IN(`#${id}-phi`, st[0] + 3.0);
    if (n) { IN(`#${id}-f`, st[0] + 2.2); IN(`#${id}-fp`, st[0] + 4.2); }
    if (n && st[1] && c.nota) IN(`#${id}-nt`, st[1] + 0.3);
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `${svg}${n && c.nota ? `<div class="nota-graf forte" id="${id}-nt">${esc(c.nota)}</div>` : ''}${n ? `<div class="tri-lado"><div class="eq eq-m" id="${id}-f">FP = kW ÷ kVA<br/>= cos φ</div><div class="eq-sub" id="${id}-fp">800 ÷ 933 = 0,86</div></div>` : ''}
      ${fonteL(id, n ? 'INST·05 · cenário didático (800 kW, 480 kVAr), leituras do próprio script · M01 · Aula 07 · 7.2 e 7.3' : 'M01 · Aula 02 · 2.5 · triângulo desenhado na proporção do INST·05 (Aula 07)')}`;
  },
  ondas(id, c, st, a, b, dur) {
    // DC e AC 60 Hz; eixo em ms; 4 ciclos = 66,7 ms (derivado de 60 Hz)
    const W = 720, H = 300, x0 = 70, ym = 250;
    const pts = []; for (let i = 0; i <= 400; i++) { const t = i / 400 * (4 / 60); pts.push(`${(x0 + t / (4 / 60) * W).toFixed(1)},${(ym - Math.sin(2 * Math.PI * 60 * t) * 110).toFixed(1)}`); }
    const xt = [0, 1, 2, 3, 4].map((q) => [x0 + q * W / 4, nf(q * 1000 / 60, 1).replace(',0', '')]);
    const ax = (k, tit) => `<text class="graf-tit" x="${x0}" y="40">${tit}</text><line class="eixo-l" x1="${x0}" y1="${ym}" x2="${x0 + W}" y2="${ym}"/><line class="eixo-l" x1="${x0}" y1="${ym - 140}" x2="${x0}" y2="${ym + 140}"/>${xt.map(([x, l]) => `<line class="eixo-l" x1="${x}" y1="${ym}" x2="${x}" y2="${ym + 8}"/><text class="tick" x="${x}" y="${ym + 170}" text-anchor="middle">${l}</text>`).join('')}<text class="eixo-rot" x="${x0 + W}" y="${ym + 205}" text-anchor="end">tempo (ms)</text><text class="eixo-rot" x="${x0}" y="${ym - 158}">tensão (unidade relativa)</text>`;
    const p0 = `<svg class="graf" viewBox="0 0 840 560" id="${id}-p0">${ax(0, 'Corrente contínua (DC)')}<line class="curva" id="${id}-dc" x1="${x0}" y1="${ym - 90}" x2="${x0 + W}" y2="${ym - 90}" pathLength="1"/><text class="rot-s" x="${x0}" y="${ym + 238}">baterias, solar pré-inversor, eletrônica</text></svg>`;
    const p1 = `<svg class="graf" viewBox="0 0 840 560" id="${id}-p1">${ax(1, 'Corrente alternada (AC) — 60 Hz')}<polyline class="curva" id="${id}-ac" points="${pts.join(' ')}" pathLength="1"/><text class="rot-s" x="${x0}" y="${ym + 238}">padrão da rede pública brasileira · período = 1/60 s ≈ 16,7 ms</text></svg>`;
    IN(`#${id}-p0`, st[0] + 0.2); DRAW(`#${id}-dc`, st[0] + 0.8, 1.6);
    const t1 = st[1] ?? st[0] + 4; IN(`#${id}-p1`, t1 + 0.1); DRAW(`#${id}-ac`, t1 + 0.6, 3.2);
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="par-graf">${p0}${p1}</div>${fonteL(id, 'figura-fonte da Aula 03, refeita com eixos · 60 Hz conforme a aula; período derivado (1/60 s); amplitude sem valor na fonte')}`;
  },
  retratos(id, c, st, a, b, dur) {
    const r = [['westinghouse', 'AC'], ['tesla', 'AC'], ['edison', 'DC']];
    r.forEach((_, k) => FADE(`#${id}-r${k}`, st[0] + 0.3 + k * 1.4, 0.8));
    IN(`#${id}-v`, st[0] + Math.min(dur - 3, 9)); FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="retratos">${r.map(([f, lado], k) => { const F = FOTOS[f]; return `<div class="ret${lado === 'DC' ? ' dc' : ''}" id="${id}-r${k}"><div class="ret-lado">pela ${lado}</div><div class="ph-mold"><img src="assets/${F.arq}"/></div><div class="ph-leg">${esc(F.leg)}</div><div class="ph-cred">${credito(F)}</div></div>`; }).join('')}</div>
      <div class="nota-graf forte" id="${id}-v">com AC é simples elevar e reduzir tensão usando transformadores</div>${fonteL(id, 'M01 · Aula 03 · 3.3 · Guerra das Correntes (final do século XIX); o retrato de Edison é posterior (c. 1922)')}`;
  },
  balanca(id, c, st) {
    const est = [['Geração ≈ Consumo', 'em tempo real', 0], ['Consumo > Geração', 'a frequência da rede cai', 1], ['Geração > Consumo', 'a frequência sobe', -1]];
    const svgB = (k, tilt) => `<svg viewBox="0 0 420 260" class="bal"><line class="eixo-l" x1="210" y1="230" x2="210" y2="120"/><path class="fio-fino" d="M190 230 L230 230"/><g id="${id}-b${k}" style="transform-origin:210px 120px"><line class="hip" x1="60" y1="120" x2="360" y2="120"/><text class="rot-s" x="60" y="100" text-anchor="middle">geração</text><text class="rot-s" x="360" y="100" text-anchor="middle">consumo</text><rect class="area" x="35" y="122" width="50" height="10"/><rect class="area" x="335" y="122" width="50" height="10"/></g></svg>`;
    IN(`#${id}-e0`, st[0] + 0.3);
    const t1 = st[1] ?? st[0] + 4;
    IN(`#${id}-e1`, t1 + 0.1); JS.push(`tl.fromTo("#${id}-b1",{rotation:0},{rotation:8,duration:1.2,ease:"power2.inOut"},${(t1 + 0.6).toFixed(3)});`);
    IN(`#${id}-e2`, t1 + 3.2); JS.push(`tl.fromTo("#${id}-b2",{rotation:0},{rotation:-8,duration:1.2,ease:"power2.inOut"},${(t1 + 3.7).toFixed(3)});`);
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="tres">${est.map(([h, s], k) => `<div class="card" id="${id}-e${k}">${svgB(k)}<div class="card-nome">${esc(h)}</div><div class="card-txt">${esc(s)}</div></div>`).join('')}</div>${fonteL(id, 'M01 · Aula 03 · 3.4 · diagrama conceitual, sem valor de frequência além de 60 Hz')}`;
  },
  contagem(id, c, st, a, b, dur) {
    IN(`#${id}-o`, st[0] + 0.2); IN(`#${id}-u`, st[0] + 0.8);
    IN(`#${id}-n`, st[0] + 2.2); COUNT(`${id}-nv`, st[0] + 2.4, Math.min(5, dur - 4), 86400, 0);
    IN(`#${id}-s`, st[0] + Math.min(dur - 2.5, 8.5)); FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="bloco-centro"><div class="rotulo" id="${id}-o">ONS · Operador Nacional do Sistema Elétrico</div><div class="apoio" id="${id}-u">equilibrar oferta e demanda</div><div class="contador" id="${id}-n"><span id="${id}-nv">0</span><span class="cont-u"> vezes por dia</span></div><div class="frase-s" id="${id}-s">uma vez por segundo, todos os segundos</div></div>${fonteL(id, 'M01 · Aula 03 · 3.4, nota "Conexão com o Bloco 02"')}`;
  },
  curva(id, c, st, a, b, dur) {
    // P = I² × 0,5 Ω (INST·03); pontos da execução do script: 100→5.000, 200→20.000, 300→45.000 W
    const x0 = 140, y0 = 580, W = 900, H = 460, sx = W / 300, sy = H / 50000;
    const pts = []; for (let i = 0; i <= 300; i += 3) pts.push(`${(x0 + i * sx).toFixed(1)},${(y0 - i * i * 0.5 * sy).toFixed(1)}`);
    const xt = [0, 50, 100, 150, 200, 250, 300].map((v) => [x0 + v * sx, nf(v)]);
    const yt = [10000, 20000, 30000, 40000, 50000].map((v) => [y0 - v * sy, nf(v)]);
    const P = [[100, 5000, '100 A · 5.000 W'], [200, 20000, '200 A · 20.000 W · ×4'], [300, 45000, '300 A · 45.000 W · ×9']];
    DRAW(`#${id}-c`, st[0] + 0.3, 2.4);
    P.forEach((_, k) => IN(`#${id}-p${k}`, st[0] + 1.0 + k * 1.5, { y: 6 }));
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<svg class="graf grande" viewBox="0 0 1200 700">${eixos({ x0, y0, w: W, h: H, xt, yt, xl: 'corrente (A)', yl: 'perda dissipada (W)' })}
      <polyline class="curva" id="${id}-c" points="${pts.join(' ')}" pathLength="1"/>
      ${P.map(([i, p, l], k) => `<g id="${id}-p${k}"><line class="guia" x1="${x0 + i * sx}" y1="${y0}" x2="${x0 + i * sx}" y2="${y0 - p * sy}"/><circle class="ponto" cx="${x0 + i * sx}" cy="${y0 - p * sy}" r="8"/><text class="rot-num" x="${x0 + i * sx - 14}" y="${y0 - p * sy - 20}" text-anchor="end">${l}</text></g>`).join('')}
      <text class="rot-s" x="${x0 + 20}" y="${y0 - H + 10}">P perdas = I² × R · R = 0,5 Ω</text></svg>
      ${fonteL(id, 'INST·03 · cenário didático (R = 0,5 Ω), valores da execução do script · M01 · Aula 04 · 4.1')}`;
  },
  escolha(id, c, st, a, b, dur) {
    IN(`#${id}-h`, st[0] + 0.2);
    IN(`#${id}-a`, st[0] + 1.6); IN(`#${id}-b`, st[0] + 3.4);
    IN(`#${id}-v`, st[0] + Math.min(dur - 3, 9.5)); FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="bloco-centro"><div class="rotulo" id="${id}-h">A mesma potência · P = V × I</div>
      <div class="esc" id="${id}-a"><div class="esc-rot">tensão alta · corrente baixa</div><div class="cabo fino"></div><div class="esc-res">perdas I² × R menores</div></div>
      <div class="esc" id="${id}-b"><div class="esc-rot">tensão baixa · corrente alta</div><div class="cabo grosso"></div><div class="esc-res">perdas I² × R maiores</div></div>
      <div class="nota-graf forte" id="${id}-v">a primeira opção dissipa drasticamente menos energia ao longo dos cabos</div></div>${fonteL(id, 'M01 · Aula 04 · 4.2 · esquema sem escala')}`;
  },
  degraus(id, c, st) {
    const d = [['Transmissão', '230 · 345 · 500 · 750 kV', 'alta tensão'], ['Subtransmissão e distribuição', '13,8 – 138 kV', 'média tensão'], ['Baixa tensão residencial', '127 / 220 V', 'baixa tensão']];
    d.forEach((_, k) => IN(`#${id}-d${k}`, st[0] + 0.3 + k * 0.5));
    if (st[1]) { d.forEach((_, k) => IN(`#${id}-n${k}`, st[1] + 0.6 + k * 1.2, { y: 6 })); }
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="degraus">${d.map(([t, v, n], k) => `<div class="deg" id="${id}-d${k}" style="margin-left:${k * 220}px"><div class="deg-n" id="${id}-n${k}">${n}</div><div class="deg-v">${v}</div><div class="deg-t">${t}</div></div>`).join('')}</div>${fonteL(id, 'M01 · Aula 04 · 4.2, lista · abertura da aula')}`;
  },
  barras_demanda(id, c, st, a, b, dur) {
    const x0 = 140, y0 = 600, H = 470, sy = H / 1000;
    const yt = [200, 400, 600, 800, 1000].map((v) => [y0 - v * sy, nf(v)]);
    IN(`#${id}-in`, st[0] + 0.2);
    GROWY(`#${id}-mx`, st[0] + 1.6, 1.0); IN(`#${id}-mxl`, st[0] + 2.4);
    const t1 = st[1] ?? st[0] + 5;
    GROWY(`#${id}-md`, t1 + 0.3, 1.0); IN(`#${id}-mdl`, t1 + 1.0); IN(`#${id}-fc`, t1 + 5.0);
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="lado-a-lado"><svg class="graf" viewBox="0 0 900 700">${eixos({ x0, y0, w: 640, h: H, yt, yl: 'demanda (kW)' })}
      <rect class="area" id="${id}-mx" x="${x0 + 80}" y="${y0 - 800 * sy}" width="180" height="${800 * sy}"/>
      <text class="rot-num" id="${id}-mxl" x="${x0 + 170}" y="${y0 - 800 * sy - 18}" text-anchor="middle">800 kW · demanda máxima</text>
      <rect class="area clara" id="${id}-md" x="${x0 + 360}" y="${y0 - 200 * sy}" width="180" height="${200 * sy}"/>
      <text class="rot-num" id="${id}-mdl" x="${x0 + 450}" y="${y0 - 200 * sy - 18}" text-anchor="middle">200 kW · demanda média</text></svg>
      <div class="coluna-dir"><div class="dado" id="${id}-in"><div><span class="mono-s">consumo</span>144.000 kWh</div><div><span class="mono-s">período</span>720 h</div><div><span class="mono-s">demanda máxima</span>800 kW</div></div>
      <div class="dado forte" id="${id}-fc"><div><span class="mono-s">demanda média</span>144.000 ÷ 720 = 200 kW</div><div><span class="mono-s">fator de carga</span>200 ÷ 800 = 0,25</div></div></div></div>
      ${fonteL(id, 'Ex · 04 e INST·04 · cenário didático · M01 · Aula 05 · 5.3')}`;
  },
  regua_carga(id, c, st, a, b, dur) {
    const x0 = 120, W = 1500, X = (v) => x0 + v * W;
    const f = [[0, 0.15, '< 0,15', 'Padrão raro — pode indicar erro de medição ou contratação superdimensionada'], [0.15, 0.40, '0,15 – 0,40', 'Picos altos, operação concentrada, partidas simultâneas'], [0.40, 0.70, '0,40 – 0,70', 'Operação em turnos, sazonalidade moderada'], [0.70, 0.90, '0,70 – 0,90', 'Operação contínua, carga estável (24/7)']];
    f.forEach((_, k) => FADE(`#${id}-f${k}`, st[0] + 0.3 + k * 0.4));
    IN(`#${id}-m`, st[0] + 2.4); IN(`#${id}-v`, (st[0] + Math.min(dur - 4, 6)));
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<svg class="graf regua" viewBox="0 0 1740 560">
      ${f.map(([a0, a1, l, t], k) => `<g id="${id}-f${k}"><rect class="banda b${k}" x="${X(a0)}" y="200" width="${X(a1) - X(a0)}" height="70"/><text class="rot-num" x="${X(a1) - 12}" y="244" text-anchor="end">${l}</text>${k === 1 ? `<text class="rot-s" x="${X(a0) + 10}" y="310">${esc(t)}</text>` : ''}</g>`).join('')}
      <rect class="banda vazia" x="${X(0.9)}" y="200" width="${X(1) - X(0.9)}" height="70"/><text class="rot-s" x="${X(0.9) + 6}" y="185">sem faixa na tabela</text>
      ${[0, 0.25, 0.5, 0.75, 1].map((v) => `<line class="eixo-l" x1="${X(v)}" y1="270" x2="${X(v)}" y2="282"/><text class="tick" x="${X(v)}" y="362" text-anchor="middle">${nf(v, 2)}</text>`).join('')}
      <text class="eixo-rot" x="${X(1)}" y="400" text-anchor="end">fator de carga (adimensional)</text>
      <g id="${id}-m"><line class="marca" x1="${X(0.25)}" y1="110" x2="${X(0.25)}" y2="290"/><text class="rot-num oxido" x="${X(0.25) + 12}" y="150">0,25 · o exemplo da aula</text></g>
    </svg><div class="nota-graf forte" id="${id}-v">não recomende mudança contratual sem ver 12 meses de histórico e entender a operação</div>
    ${fonteL(id, 'tabela "Como ler o fator de carga" (5.4) e gabarito do Ex · 04 · M01 · Aula 05')}`;
  },
  grupos(id, c, st, a, b, dur) {
    IN(`#${id}-b`, st[0] + 0.3); IN(`#${id}-a`, st[0] + Math.min(4.5, dur / 2));
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="duas"><div class="col" id="${id}-b"><div class="col-rot">GRUPO B · tarifa simples</div><div class="eq eq-m">kWh × tarifa</div></div>
      <div class="col" id="${id}-a"><div class="col-rot">GRUPO A · estrutura binômia</div><div class="eq eq-m">consumo (kWh) + demanda (kW)</div></div></div>${fonteL(id, 'M01 · Aula 06 · 6.1')}`;
  },
  camadas(id, c, st, a, b, dur) {
    const cam = ['Geração', 'Transmissão troncal', 'Distribuição', 'Baixa tensão'];
    cam.forEach((_, k) => IN(`#${id}-c${k}`, st[0] + 0.3 + k * 0.6));
    IN(`#${id}-s`, st[0] + 3.4); FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="bloco-centro"><div class="fila camadas">${cam.map((x, k) => `${k ? '<span class="seta">→</span>' : ''}<span class="caixa" id="${id}-c${k}">${x}</span>`).join('')}</div>
      <div class="nota-graf" id="${id}-s">Quanto mais alta a tensão de fornecimento, […] menos camadas de rede ele atravessa.</div></div>${fonteL(id, 'M01 · Aula 06 · 6.3 · esquema sem escala')}`;
  },
  a1a4(id, c, st, a, b, dur) {
    const cam = ['Geração', 'Transmissão troncal', 'Distribuição', 'Baixa tensão'];
    IN(`#${id}-f`, st[0] + 0.2); IN(`#${id}-a1`, st[0] + 1.2); IN(`#${id}-a4`, st[0] + 4.2); IN(`#${id}-n`, st[0] + Math.min(dur - 3, 9));
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="bloco-centro"><div class="fila camadas" id="${id}-f">${cam.map((x, k) => `${k ? '<span class="seta">→</span>' : ''}<span class="caixa">${x}</span>`).join('')}</div>
      <div class="clientes"><div class="cli c1" id="${id}-a1"><span class="mono-s">cliente A1</span>230 kV</div><div class="cli c4" id="${id}-a4"><span class="mono-s">cliente A4</span>13,8 kV</div></div>
      <div class="nota-graf forte" id="${id}-n">para o mesmo kWh — exatamente porque o A1 está usando muito menos infraestrutura de rede</div></div>${fonteL(id, 'M01 · Aula 06 · 6.3 · posição na cadeia ilustrativa, sem escala')}`;
  },
  fase(id, c, st, a, b, dur) {
    const W = 720, x0 = 70, ym = 250, T = 2 / 60;
    const onda = (fase, amp) => { const p = []; for (let i = 0; i <= 300; i++) { const t = i / 300 * T; p.push(`${(x0 + t / T * W).toFixed(1)},${(ym - Math.sin(2 * Math.PI * 60 * t - fase) * amp).toFixed(1)}`); } return p.join(' '); };
    const phi = Math.atan2(480, 800);
    const xt = [0, 1, 2, 3, 4].map((q) => [x0 + q * W / 4, nf(q * 1000 / 120, 1).replace(',0', '')]);
    const ax = (tit) => `<text class="graf-tit" x="${x0}" y="40">${tit}</text><line class="eixo-l" x1="${x0}" y1="${ym}" x2="${x0 + W}" y2="${ym}"/><line class="eixo-l" x1="${x0}" y1="${ym - 140}" x2="${x0}" y2="${ym + 140}"/>${xt.map(([x, l]) => `<line class="eixo-l" x1="${x}" y1="${ym}" x2="${x}" y2="${ym + 8}"/><text class="tick" x="${x}" y="${ym + 170}" text-anchor="middle">${l}</text>`).join('')}<text class="eixo-rot" x="${x0 + W}" y="${ym + 205}" text-anchor="end">tempo (ms)</text><text class="eixo-rot" x="${x0}" y="${ym - 158}">unidade relativa</text>`;
    const leg = `<text class="rot-s" x="${x0 + 10}" y="${ym + 238}"><tspan class="t-ten">— tensão</tspan>   <tspan class="t-cor">— corrente</tspan></text>`;
    const p0 = `<svg class="graf" viewBox="0 0 840 560" id="${id}-p0">${ax('Carga resistiva · corrente em fase')}<polyline class="curva" id="${id}-v0" points="${onda(0, 115)}" pathLength="1"/><polyline class="curva2" id="${id}-i0" points="${onda(0, 70)}" pathLength="1"/>${leg}</svg>`;
    const p1 = `<svg class="graf" viewBox="0 0 840 560" id="${id}-p1">${ax('Carga indutiva · corrente atrasada')}<polyline class="curva" id="${id}-v1" points="${onda(0, 115)}" pathLength="1"/><polyline class="curva2" id="${id}-i1" points="${onda(phi, 70)}" pathLength="1"/>${leg}</svg>`;
    IN(`#${id}-p0`, st[0] + 0.2); DRAW(`#${id}-v0`, st[0] + 0.7, 2.0); DRAW(`#${id}-i0`, st[0] + 1.0, 2.0);
    const t1 = st[1] ?? st[0] + 5; IN(`#${id}-p1`, t1 + 0.1); DRAW(`#${id}-v1`, t1 + 0.6, 2.0); DRAW(`#${id}-i1`, t1 + 1.2, 2.0);
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="par-graf">${p0}${p1}</div>${fonteL(id, 'M01 · Aula 07 · 7.1 · 60 Hz (Aula 03) · atraso ilustrativo, φ = 31° do cenário 800 kW / 480 kVAr do INST·05')}`;
  },
  regua_fp(id, c, st, a, b, dur) {
    const x0 = 120, W = 1500, X = (v) => x0 + (v - 0.8) / 0.2 * W;
    IN(`#${id}-r`, st[0] + 0.2); IN(`#${id}-ref`, st[0] + 1.6);
    const t1 = st[1] ?? st[0] + 6; IN(`#${id}-x`, t1 + 4.5); IN(`#${id}-xl`, t1 + 5.0);
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<svg class="graf regua" viewBox="0 0 1740 560"><g id="${id}-r"><line class="eixo-l grosso" x1="${X(0.8)}" y1="260" x2="${X(1)}" y2="260"/>
      ${[0.8, 0.84, 0.88, 0.92, 0.96, 1].map((v) => `<line class="eixo-l" x1="${X(v)}" y1="250" x2="${X(v)}" y2="270"/><text class="tick" x="${X(v)}" y="310" text-anchor="middle">${nf(v, 2)}</text>`).join('')}
      <text class="eixo-rot" x="${X(1)}" y="356" text-anchor="end">fator de potência (adimensional)</text></g>
      <g id="${id}-ref"><line class="ref" x1="${X(0.92)}" y1="150" x2="${X(0.92)}" y2="270"/><text class="rot-num" x="${X(0.92) + 12}" y="140">0,92 · mínimo de referência, Grupo A</text><text class="rot-s" x="${X(0.92) + 12}" y="176">indutivo e capacitivo</text></g>
      <g id="${id}-x"><circle class="ponto oxido" cx="${X(0.90)}" cy="260" r="11"/></g>
      <g id="${id}-xl"><text class="rot-num oxido" x="${X(0.90) - 14}" y="420" text-anchor="end">0,90 · Ex · 05: 900 kW ÷ 1.000 kVA</text><text class="rot-s" x="${X(0.90) - 14}" y="456" text-anchor="end">abaixo da referência prática</text></g></svg>
      ${fonteL(id, 'M01 · Aula 07 · 7.4 e Ex · 05 (enunciado e gabarito)')}`;
  },
  barras_fc(id, c, st, a, b, dur) {
    const x0 = 160, y0 = 600, H = 470, sy = H / 1000000;
    const yt = [200000, 400000, 600000, 800000, 1000000].map((v) => [y0 - v * sy, nf(v)]);
    IN(`#${id}-g`, st[0] + 0.1);
    GROWY(`#${id}-mx`, st[0] + 1.0, 1.2); IN(`#${id}-mxl`, st[0] + 2.0);
    GROWY(`#${id}-re`, st[0] + Math.min(9, dur * 0.55), 1.0); IN(`#${id}-rel`, st[0] + Math.min(9.8, dur * 0.6));
    IN(`#${id}-fc`, st[0] + Math.min(dur - 3.5, 13)); COUNT(`${id}-fcv`, st[0] + Math.min(dur - 3.5, 13) + 0.2, 1.6, 25.1, 1, ' %');
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="lado-a-lado"><svg class="graf" viewBox="0 0 900 700">${eixos({ x0, y0, w: 640, h: H, yt, yl: 'energia em um ano (MWh)' })}
      <rect class="area clara" id="${id}-mx" x="${x0 + 80}" y="${y0 - 876000 * sy}" width="180" height="${876000 * sy}"/>
      <text class="rot-num" id="${id}-mxl" x="${x0 + 170}" y="${y0 - 876000 * sy - 18}" text-anchor="middle">876.000 · máximo teórico</text>
      <rect class="area" id="${id}-re" x="${x0 + 360}" y="${y0 - 220000 * sy}" width="180" height="${220000 * sy}"/>
      <text class="rot-num" id="${id}-rel" x="${x0 + 450}" y="${y0 - 220000 * sy - 18}" text-anchor="middle">220.000 · geração real</text></svg>
      <div class="coluna-dir"><div class="dado" id="${id}-g"><div><span class="mono-s">capacidade</span>100 MW</div><div><span class="mono-s">horas do ano</span>8.760 h</div><div><span class="mono-s">máximo teórico</span>100 × 8.760 = 876.000 MWh</div></div>
      <div class="dado forte" id="${id}-fc"><div><span class="mono-s">fator de capacidade</span><span id="${id}-fcv" class="grande-num">0 %</span></div></div></div></div>
      ${fonteL(id, 'M01 · Aula 08 · 8.2 · cenário didático (100 MW, 220.000 MWh, 8.760 h) · INST·06')}`;
  },
  fenomenos(id, c, st, a, b, dur) {
    const fen = ['Tensão fora da faixa', 'Harmônicos', 'Afundamentos', 'Interrupções'];
    const con = ['parar uma linha de produção', 'danificar equipamento', 'encurtar vida útil de motor'];
    IN(`#${id}-t`, st[0] + 0.2);
    fen.forEach((_, k) => IN(`#${id}-f${k}`, st[0] + 3.2 + k * 0.6));
    con.forEach((_, k) => IN(`#${id}-c${k}`, st[0] + Math.min(dur - 4, 8) + k * 0.9));
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="bloco-centro"><div class="apoio" id="${id}-t">Qualidade de energia é tema técnico cuja consequência é financeira.</div>
      <div class="lista-h">${fen.map((x, k) => `<span id="${id}-f${k}">${x}</span>`).join('')}</div>
      <div class="lista-v">${con.map((x, k) => `<div id="${id}-c${k}">— ${x}</div>`).join('')}</div></div>${fonteL(id, 'M01 · Aula 09 · abertura da aula')}`;
  },
  dimensoes(id, c, st, a, b, dur) {
    const d = [['Qualidade do serviço', '(continuidade)', 'Frequência e duração de interrupções'], ['Qualidade do produto', '(tensão)', 'Conformidade da tensão entregue'], ['Qualidade comercial', '', 'Atendimento da distribuidora ao consumidor']];
    d.forEach((_, k) => IN(`#${id}-d${k}`, st[0] + 1.6 + k * Math.min(2, (dur - 3) / 3)));
    IN(`#${id}-h`, st[0] + 0.2); FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="bloco-centro"><div class="rotulo" id="${id}-h">ANEEL · três dimensões da qualidade do fornecimento</div><div class="tres">${d.map(([t, s, m], k) => `<div class="card" id="${id}-d${k}"><div class="card-nome">${t} ${s}</div><div class="card-txt">${m}</div></div>`).join('')}</div></div>${fonteL(id, 'M01 · Aula 09 · 9.1, tabela')}`;
  },
  janela(id, c, st, a, b, dur) {
    const x0 = 100, W = 1540, y = 300;
    let ticks = '';
    for (let i = 0; i < 1008; i++) { const x = x0 + (i + 0.5) / 1008 * W; ticks += `M${x.toFixed(2)} ${y - (i % 6 === 0 ? 34 : 22)} L${x.toFixed(2)} ${y}`; }
    const dias = [0, 1, 2, 3, 4, 5, 6, 7].map((d) => `<line class="eixo-l" x1="${x0 + d / 7 * W}" y1="${y}" x2="${x0 + d / 7 * W}" y2="${y + 12}"/><text class="tick" x="${x0 + d / 7 * W}" y="${y + 48}" text-anchor="middle">${d}</text>`).join('');
    IN(`#${id}-fx`, st[0] + 0.3);
    JS.push(`tl.fromTo("#${id}-clip",{attr:{width:0}},{attr:{width:${W + 10}},duration:${Math.min(6, dur - 5).toFixed(2)},ease:"none"},${(st[0] + 3.5).toFixed(3)});`);
    IN(`#${id}-n`, st[0] + 3.5); COUNT(`${id}-nv`, st[0] + 3.5, Math.min(6, dur - 5), 1008, 0);
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<svg class="graf regua" viewBox="0 0 1740 560"><defs><clipPath id="${id}-cp"><rect id="${id}-clip" x="${x0 - 5}" y="${y - 60}" width="0" height="80"/></clipPath></defs>
      <path class="ticks" d="${ticks}" clip-path="url(#${id}-cp)"/>
      <line class="eixo-l" x1="${x0}" y1="${y}" x2="${x0 + W}" y2="${y}"/>${dias}
      <text class="eixo-rot" x="${x0 + W}" y="${y + 92}" text-anchor="end">tempo (dias) · cada traço = uma leitura integralizada em 10 min</text></svg>
      <div class="faixas-txt" id="${id}-fx"><span>adequada</span><span>precária</span><span>crítica</span><em>faixas definidas pela ANEEL · valores em volts não estão na aula</em></div>
      <div class="contador pequeno" id="${id}-n"><span id="${id}-nv">0</span><span class="cont-u"> leituras em 7 dias</span></div>
      ${fonteL(id, 'M01 · Aula 09 · 9.3, nota "Conformidade de tensão · PRODIST Módulo 8"')}`;
  },
  prejuizos(id, c, st, a, b, dur) {
    const l = ['Linha de produção parada — perda de receita, atraso de entrega', 'Material em processo perdido', 'Equipamento danificado'];
    IN(`#${id}-r`, st[0] + 0.2); IN(`#${id}-i`, st[0] + 2.4);
    l.forEach((_, k) => IN(`#${id}-l${k}`, st[0] + 4.2 + k * 1.5));
    FADE(`#${id}-fonte`, st[0] + 1.0);
    return `<div class="duas"><div class="col" id="${id}-r"><div class="col-rot">RESIDÊNCIA</div><div class="col-txt">incômodo</div></div>
      <div class="col" id="${id}-i"><div class="col-rot">INDÚSTRIA</div><div class="col-txt">prejuízo direto</div><div class="lista-v">${l.map((x, k) => `<div id="${id}-l${k}">— ${esc(x)}</div>`).join('')}</div></div></div>${fonteL(id, 'M01 · Aula 09 · 9.4')}`;
  },
  fecho(id, c, st, a) {
    const fotos = [...new Set(a.blocos.flatMap((b) => [b.cena.foto, ...(b.cena.t === 'retratos' ? ['westinghouse', 'tesla', 'edison'] : [])]).filter(Boolean))];
    IN(`#${id}-t`, st[0] + 0.2); IN(`#${id}-l`, st[0] + 0.6);
    return `<div class="fecho"><div class="rotulo" id="${id}-t">Alexandria · M01 · Aula ${String(a.n).padStart(2, '0')} · ${esc(a.tema)}</div>
      <div class="creditos" id="${id}-l">
        <div><span class="mono-s">Texto e números</span>da própria aula (Alexandria, Módulo 01)</div>
        <div><span class="mono-s">Narração</span>voz sintética (ElevenLabs), lendo o texto da aula</div>
        <div><span class="mono-s">Diagramas</span>desenhados com os números da aula</div>
        ${fotos.length ? `<div><span class="mono-s">Fotos</span>${fotos.map((f) => `${esc(FOTOS[f].autor)} · ${esc(FOTOS[f].lic)}`).join(' &nbsp;/&nbsp; ')} · via Wikimedia Commons</div>` : ''}
      </div></div>`;
  },
};

// ───────────────────────────── página ─────────────────────────────
const CSS = `
@font-face{font-family:"Newsreader";src:url("assets/fonts/newsreader-normal.woff2") format("woff2");font-weight:200 800;font-style:normal;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215}
@font-face{font-family:"Newsreader";src:url("assets/fonts/newsreader-ext-normal.woff2") format("woff2");font-weight:200 800;font-style:normal;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F}
@font-face{font-family:"Newsreader";src:url("assets/fonts/newsreader-italic.woff2") format("woff2");font-weight:200 800;font-style:italic}
@font-face{font-family:"Instrument Sans";src:url("assets/fonts/instrument-sans.woff2") format("woff2");font-weight:400 700}
@font-face{font-family:"IBM Plex Mono";src:url("assets/fonts/plex-mono-400.woff2") format("woff2");font-weight:400}
@font-face{font-family:"IBM Plex Mono";src:url("assets/fonts/plex-mono-500.woff2") format("woff2");font-weight:500}
:root{--papel:#F2ECDF;--papel2:#EAE2D0;--tinta:#15213B;--tinta-s:rgba(21,33,59,.72);--tinta-x:rgba(21,33,59,.5);--fio:rgba(21,33,59,.22);--ouro:#A8843A;--ouro-t:#6B5120;--oxido:#9A3B22;
--serif:"Newsreader",Georgia,serif;--sans:"Instrument Sans",Arial,sans-serif;--mono:"IBM Plex Mono",Consolas,monospace}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden;background:var(--papel)}
#root{position:relative;width:100%;height:100%;overflow:hidden;background:var(--papel);color:var(--tinta);font-family:var(--sans)}
.clip{position:absolute;inset:0}
.cena{position:absolute;inset:0}
.hdr{position:absolute;left:120px;right:120px;top:54px;display:flex;justify-content:space-between;font:500 17px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--tinta-s)}
.hdr-fio{position:absolute;left:120px;right:120px;top:92px;height:1px;background:var(--fio)}
.rotulo{font:500 19px/1.3 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--ouro-t)}
.rotulo.mt{margin-top:64px}.oxido{color:var(--oxido)!important;fill:var(--oxido)!important}
.mono-s{display:block;font:500 15px/1.4 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--tinta-x);margin-bottom:6px}
.fonte-l{position:absolute;left:120px;right:120px;bottom:58px;font:400 16px/1.35 var(--mono);letter-spacing:.04em;color:var(--tinta-x)}
.bloco-centro{position:absolute;left:120px;right:120px;top:150px;bottom:130px;display:flex;flex-direction:column;justify-content:center}
.abertura{position:absolute;left:160px;right:160px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center}
.ab-num{margin-top:40px;font:500 22px/1 var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--tinta-s)}
.ab-tit{margin-top:22px;font:400 96px/1.04 var(--serif);letter-spacing:-.015em;max-width:1500px}
.ab-fio{margin-top:42px;width:96px;height:1px;background:var(--ouro)}
.ab-tema{margin-top:26px;font:400 32px/1.3 var(--sans);color:var(--tinta-s)}
.perg{margin-top:30px;font:400 84px/1.1 var(--serif);letter-spacing:-.012em;max-width:1560px}
.hl{color:var(--oxido);font-style:italic}
.apoio{font:400 34px/1.35 var(--sans);color:var(--tinta-s);max-width:1500px}
.frase{margin-top:18px;font:400 76px/1.12 var(--serif);letter-spacing:-.01em;max-width:1560px}
.frase-s{margin-top:28px;font:italic 400 44px/1.2 var(--serif);color:var(--tinta-s)}
.duas{position:absolute;left:120px;right:120px;top:300px;bottom:160px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.col{border-top:1px solid var(--tinta);padding-top:30px}
.col-rot{font:500 22px/1.3 var(--mono);letter-spacing:.14em;color:var(--ouro-t)}
.col-txt{margin-top:22px;font:400 58px/1.15 var(--serif)}
.tres{position:absolute;left:120px;right:120px;top:210px;bottom:170px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:56px;align-items:start}
.bloco-centro .tres{position:static;margin-top:40px}
.card{border-top:1px solid var(--tinta);padding-top:26px}
.card-sim{font:400 150px/1 var(--serif);color:var(--tinta)}
.card-nome{margin-top:18px;font:500 20px/1.4 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--ouro-t)}
.card-txt{margin-top:14px;font:400 34px/1.3 var(--serif)}
.tabela{position:absolute;left:120px;right:120px;top:300px}
.tr{display:grid;grid-template-columns:1.1fr 1fr 1.2fr;border-bottom:1px solid var(--fio);padding:26px 0;font:400 42px/1.2 var(--serif)}
.tr.th{font:500 18px/1.3 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ouro-t);border-bottom:1px solid var(--tinta)}
.eq{font:400 76px/1.15 var(--serif);letter-spacing:-.01em}
.eq-m{font-size:58px;margin:18px 0}
.f-apoio{font-size:60px;margin:0}
.eq-depois{margin-top:56px}
.eq-sub{margin-top:22px;font:400 34px/1.35 var(--sans);color:var(--tinta-s)}
.conta{margin-top:70px;display:flex;gap:30px;font:500 64px/1 var(--mono);color:var(--tinta)}
.conta span:last-child{color:var(--oxido)}
.par-graf{position:absolute;left:100px;right:100px;top:150px;bottom:170px;display:grid;grid-template-columns:1fr 1fr;gap:40px}
.par-graf svg{width:100%;height:100%}
.nota-graf{position:absolute;left:120px;right:120px;bottom:118px;font:400 30px/1.3 var(--sans);color:var(--tinta-s)}
.nota-graf.forte{font:italic 400 38px/1.25 var(--serif);color:var(--tinta)}
.bloco-centro .nota-graf{position:static;margin-top:56px}
svg.graf{overflow:visible}
svg.graf text{font-family:var(--mono);fill:var(--tinta)}
.graf-tit{font:500 24px var(--mono);letter-spacing:.06em}
.eixo line,.eixo-l{stroke:var(--tinta);stroke-width:1.5}
.eixo-l.grosso{stroke-width:2}
.eixo line.grade{stroke:var(--fio);stroke-width:1}
.eixo text,.tick{font-size:20px;fill:var(--tinta-s)!important}
.eixo-rot{font-size:19px;letter-spacing:.06em;fill:var(--tinta-x)!important}
.rot-num{font:500 24px var(--mono)}
.rot-s{font:400 19px var(--mono);fill:var(--tinta-s)!important}
.area{fill:var(--tinta)}
.area.clara{fill:none;stroke:var(--tinta);stroke-width:2;stroke-dasharray:8 6}
.curva{fill:none;stroke:var(--tinta);stroke-width:3.5;stroke-dasharray:1;stroke-linejoin:round}
.curva2{fill:none;stroke:var(--oxido);stroke-width:3;stroke-dasharray:1}
.t-ten{fill:var(--tinta)}.t-cor{fill:var(--oxido)}
.cat{stroke:var(--tinta);stroke-width:5;stroke-dasharray:1}
.cat2{fill:none;stroke:var(--ouro);stroke-width:5;stroke-dasharray:1}
.hip{stroke:var(--tinta);stroke-width:3;stroke-dasharray:1;fill:none}
.fio-fino{fill:none;stroke:var(--tinta);stroke-width:1.5}
.guia{stroke:var(--fio);stroke-width:1.5;stroke-dasharray:6 6}
.ponto{fill:var(--papel);stroke:var(--tinta);stroke-width:3}
.ponto.oxido{fill:var(--oxido)!important;stroke:var(--oxido)}
.faixa{stroke:var(--tinta);stroke-width:14;stroke-linecap:butt}
.seta-a{fill:none;stroke:var(--tinta);stroke-width:3}
.banda{fill:rgba(21,33,59,.14);stroke:var(--tinta);stroke-width:1.5}
.banda.b1{fill:rgba(21,33,59,.32)}.banda.b2{fill:rgba(21,33,59,.2)}.banda.b3{fill:rgba(21,33,59,.08)}
.banda.vazia{fill:none;stroke:var(--fio);stroke-dasharray:6 6}
.marca,.ref{stroke:var(--oxido);stroke-width:3}.ref{stroke:var(--ouro)}
.ticks{stroke:var(--tinta);stroke-width:1}
svg.grande{position:absolute;left:120px;top:150px;width:1500px;height:875px}
svg.regua{position:absolute;left:90px;top:240px;width:1740px;height:560px}
svg.escada{position:absolute;left:120px;top:150px;width:1040px;height:740px}
.ph-mini{position:absolute;left:1260px;right:120px;top:200px}
.ph-mini .ph-mold{height:420px}
.ph-mold{position:relative;overflow:hidden;background:var(--papel2);outline:1px solid var(--fio)}
.ph-mold img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.ph-mold.filme img{inset:-6%;width:112%;height:112%}
.ph-leg{margin-top:14px;font:400 21px/1.35 var(--sans);color:var(--tinta)}
.ph-cred{margin-top:6px;font:400 15px/1.35 var(--mono);letter-spacing:.04em;color:var(--tinta-x)}
.ph-lado{position:absolute;top:150px;bottom:150px;width:1000px}
.ph-lado.esq{left:120px}.ph-lado.dir{right:120px}
.ph-lado .ph-mold{height:640px}
.ph-texto{position:absolute;top:190px;bottom:170px;width:620px;display:flex;flex-direction:column;justify-content:center;gap:44px}
.ph-texto.esq{right:120px}.ph-texto.dir{left:120px}
.fx-rot{font:500 26px/1.25 var(--mono);letter-spacing:.08em;color:var(--ouro-t)}
.fx-txt{margin-top:10px;font:400 40px/1.22 var(--serif)}
.ph-cheia{position:absolute;left:0;right:0;top:112px;bottom:0}
.ph-cheia .ph-mold{position:absolute;inset:0;outline:none}
.ph-painel{position:absolute;left:120px;bottom:150px;background:var(--papel);padding:34px 40px 36px;max-width:820px;outline:1px solid var(--fio)}
.ph-cred-cheia{position:absolute;right:120px;bottom:52px;background:var(--papel);padding:12px 18px 12px;max-width:900px;text-align:right}
.ph-cred-cheia .ph-leg{margin-top:0;font-size:19px}
.fila{display:flex;align-items:center;flex-wrap:wrap;gap:22px;margin-top:30px}
.caixa{border:1px solid var(--tinta);padding:20px 28px;font:500 40px/1 var(--mono);background:var(--papel)}
.fila.num .caixa:last-child{color:var(--oxido);border-color:var(--oxido)}
.seta{font:400 40px/1 var(--mono);color:var(--tinta-x)}
.camadas .caixa{font:400 36px/1.1 var(--serif)}
.retratos{position:absolute;left:120px;right:120px;top:140px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:56px}
.ret .ph-mold{height:560px}
.ret-lado{font:500 20px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--ouro-t);margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--tinta)}
.ret.dc .ret-lado{color:var(--oxido)}
.retratos ~ .nota-graf{bottom:112px}
.bal{width:100%;height:220px;overflow:visible}
.contador{margin-top:36px;font:400 150px/1 var(--serif)}
.contador.pequeno{position:absolute;left:120px;top:640px;font-size:96px}
.cont-u{font:400 40px/1 var(--sans);color:var(--tinta-s)}
.esc{display:grid;grid-template-columns:520px 1fr 460px;align-items:center;gap:40px;margin-top:56px}
.esc-rot{font:400 40px/1.2 var(--serif)}
.esc-res{font:500 26px/1.2 var(--mono);color:var(--tinta-s)}
.cabo{height:4px;background:var(--tinta)}.cabo.grosso{height:26px;background:var(--oxido)}
.degraus{position:absolute;left:160px;right:120px;top:210px;display:flex;flex-direction:column;gap:40px}
.deg{border-left:1px solid var(--tinta);padding-left:30px;width:900px}
.deg-n{font:500 18px/1.2 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--ouro-t)}
.deg-v{margin-top:8px;font:500 50px/1.1 var(--mono)}
.deg-t{margin-top:8px;font:400 32px/1.2 var(--serif);color:var(--tinta-s)}
.lado-a-lado{position:absolute;left:100px;right:120px;top:150px;bottom:150px;display:grid;grid-template-columns:900px 1fr;gap:40px;align-items:center}
.lado-a-lado svg{width:900px;height:700px}
.coluna-dir{display:flex;flex-direction:column;gap:56px}
.dado{display:flex;flex-direction:column;gap:22px;font:500 36px/1.2 var(--mono)}
.dado.forte{border-top:1px solid var(--tinta);padding-top:26px}
.dado.forte div{color:var(--oxido)}
.grande-num{font:400 110px/1 var(--serif);color:var(--oxido)}
.clientes{display:flex;gap:80px;margin-top:60px}
.cli{border-top:1px solid var(--tinta);padding-top:20px;font:500 54px/1 var(--mono);width:420px}
.cli.c1{margin-left:300px}.cli.c4{color:var(--oxido);border-color:var(--oxido)}
.lista-h{display:flex;flex-wrap:wrap;gap:20px 46px;margin-top:40px;font:400 56px/1.2 var(--serif)}
.lista-v{margin-top:44px;display:flex;flex-direction:column;gap:14px;font:400 36px/1.3 var(--sans);color:var(--tinta-s)}
.faixas-txt{position:absolute;left:190px;top:200px;display:flex;gap:40px;align-items:baseline;font:500 30px/1 var(--mono)}
.faixas-txt em{font:italic 400 24px/1 var(--serif);color:var(--tinta-x)}
.tri-lado{position:absolute;left:1260px;right:120px;top:300px}
svg.tri{position:absolute;left:120px;top:160px;width:1100px;height:700px}
svg.tri.so{left:300px;top:130px;width:1300px;height:827px}
.fecho{position:absolute;left:160px;right:160px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center}
.creditos{margin-top:46px;display:flex;flex-direction:column;gap:26px;font:400 30px/1.35 var(--sans);max-width:1500px}
.certos{margin-top:46px;display:flex;flex-direction:column;gap:22px}
.certo{font:400 44px/1.2 var(--serif)}
.errado{position:relative;display:inline-block;font:400 70px/1.15 var(--serif);align-self:flex-start}
.risco{position:absolute;left:0;right:0;top:54%;height:4px;background:var(--oxido)}
.errado + .rotulo{margin-top:26px}
`;

function montar(a, al, durNarr) {
  JS = []; NC = 0;
  // agrupa blocos em cenas ('continua' prolonga a cena anterior)
  const cenas = [];
  a.blocos.forEach((b, bi) => {
    const t = T0 + al.res[bi].ini;
    if (b.cena.t === 'continua') { const c = cenas[cenas.length - 1]; c.st.push(t); c.blocos.push(b); }
    else cenas.push({ c: b.cena, st: [t], blocos: [b] });
  });
  const fimNarr = T0 + durNarr;
  const total = +(fimNarr + 0.6 + FECHO).toFixed(2);
  const lista = [{ c: { t: 'abertura' }, st: [0], blocos: [], ini: 0 }];
  cenas.forEach((c) => lista.push({ ...c, ini: c.st[0] - 0.35 }));
  lista.push({ c: { t: 'fecho' }, st: [fimNarr + 0.6], blocos: [], ini: fimNarr + 0.6 });
  let html = '';
  lista.forEach((c, k) => {
    const prox = lista[k + 1];
    const ini = Math.max(0, c.ini);
    const fim = prox ? prox.ini + XF : total;
    const dur = fim - ini;
    const id = `s${k}`;
    const st = c.st.map((t) => Math.max(t, ini));
    const corpo = CENAS[c.c.t](id, c.c, st, a, c.blocos, dur);
    if (k > 0) FADE(`#${id}-c`, ini, XF);
    if (prox) JS.push(`tl.to("#${id}-c",{opacity:0,duration:${XF},ease:"none"},${(fim - XF).toFixed(3)});`);
    html += `<section class="clip" id="${id}" data-start="${ini.toFixed(3)}" data-duration="${dur.toFixed(3)}" data-track-index="${k % 2 ? 2 : 1}"><div class="cena" id="${id}-c">${corpo}</div></section>\n`;
    c.ini = ini; c.fim = fim;
  });
  // cabeçalho fixo entre a abertura e o fecho
  const hIni = lista[1].ini, hFim = lista[lista.length - 1].ini + XF;
  FADE('#hdr-c', hIni, 0.6); JS.push(`tl.to("#hdr-c",{opacity:0,duration:${XF}},${(hFim - XF).toFixed(3)});`);
  const hdr = `<section class="clip" id="hdr" data-start="${hIni.toFixed(3)}" data-duration="${(hFim - hIni).toFixed(3)}" data-track-index="3"><div class="cena" id="hdr-c"><div class="hdr"><span>M01 · Aula ${String(a.n).padStart(2, '0')} · ${esc(a.tema)}</span><span>Alexandria</span></div><div class="hdr-fio"></div></div></section>`;
  const page = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<title>M01 · Aula ${String(a.n).padStart(2, '0')} — vídeo-aula de abertura</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>${CSS}</style>
</head>
<body>
<!--
  PONTO DE ENTRADA DO FOUNDER: a cena s0 (abertura, 0 → ${T0} s) é muda e só mostra o título.
  Para pôr a fala gravada dele, troque s0 por um <video> com a gravação, aumente T0 em gerar.mjs
  para a duração da fala e gere de novo: narração, cenas e legendas andam juntas.
  Nenhuma pessoa foi gerada no lugar dele.
-->
<div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="${total}">
${html}${hdr}
<audio id="narracao" src="assets/narracao.mp3" data-start="${T0}" data-duration="${durNarr.toFixed(3)}" data-track-index="5" data-volume="1"></audio>
</div>
<script>
const fmt=(v,c)=>new Intl.NumberFormat("pt-BR",{minimumFractionDigits:c,maximumFractionDigits:c}).format(v);
const tl=gsap.timeline({paused:true});
${JS.join('\n')}
window.__timelines["main"]=tl;
</script>
</body>
</html>`;
  return { page, total, cenas: lista.map((c) => ({ tipo: c.c.t, ini: +c.ini.toFixed(3), fim: +c.fim.toFixed(3), blocos: c.blocos.map((b) => b.id) })) };
}

// ───────────────────────────── principal ─────────────────────────────
fs.mkdirSync(OUT_VTT, { recursive: true });
for (const a of AULAS) {
  if (SO.length && !SO.includes(a.n)) continue;
  const nn = String(a.n).padStart(2, '0');
  const palavras = JSON.parse(fs.readFileSync(path.join(WORK, `narr/t${a.n}/transcript.json`), 'utf8'));
  const mp3 = path.join(WORK, `narr/aula-${nn}.mp3`);
  const durNarr = palavras[palavras.length - 1].end + 0.25;
  const al = alinhar(a.blocos, palavras);
  const { page, total, cenas } = montar(a, al, durNarr);
  const dir = path.join(WORK, `build/aula-${nn}`);
  fs.mkdirSync(path.join(dir, 'assets/fonts'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page);
  for (const [dst, src] of Object.entries(FONTES_NM)) fs.copyFileSync(path.join(REPO, src), path.join(dir, 'assets/fonts', dst));
  fs.copyFileSync(mp3, path.join(dir, 'assets/narracao.mp3'));
  for (const f of new Set(a.blocos.flatMap((b) => [b.cena.foto, ...(b.cena.t === 'retratos' ? ['westinghouse', 'tesla', 'edison'] : [])]).filter(Boolean))) fs.copyFileSync(path.join(FOTO_DIR, FOTOS[f].arq), path.join(dir, 'assets', FOTOS[f].arq));
  // legendas
  const cues = legendas(a.blocos, al, durNarr);
  const vtt = 'WEBVTT\nKind: captions\nLanguage: pt-BR\n\n' + cues.map((c, k) => `${k + 1}\n${ts(T0 + c.ini)} --> ${ts(T0 + c.fim)}\n${c.txt}\n`).join('\n');
  fs.writeFileSync(path.join(OUT_VTT, `aula-${nn}.pt-BR.vtt`), vtt);
  const tempos = { aula: a.n, T0, durNarr: +durNarr.toFixed(3), total, cobertura: +al.cobertura.toFixed(3), blocos: a.blocos.map((b, bi) => ({ id: b.id, ini: +(T0 + al.res[bi].ini).toFixed(3), fim: +(T0 + al.res[bi].fim).toFixed(3) })), cenas, cues: cues.length };
  fs.writeFileSync(path.join(dir, 'tempos.json'), JSON.stringify(tempos, null, 1));
  console.log(`A${nn}: total ${total} s · narração ${durNarr.toFixed(1)} s · alinhamento ${(al.cobertura * 100).toFixed(0)}% (${al.n} palavras da fala, ${al.m} transcritas) · ${cues.length} legendas · ${cenas.length} cenas`);
}
