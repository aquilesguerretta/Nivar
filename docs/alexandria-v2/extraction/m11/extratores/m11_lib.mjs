// Biblioteca comum dos extratores do M11.
// - parser de HTML mínimo (árvore com offsets e linhas; o innerHTML sai por
//   fatia do arquivo-fonte, nunca por reconstrução);
// - DOM simulado para executar o <script> ORIGINAL do módulo (protocolo §10);
// - empacotamento (esbuild) do código atual, só leitura, para comparação.
// Nenhum texto de conteúdo é digitado aqui.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo11.html';
export const REPO = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = `${REPO}/docs/alexandria-v2/extraction/m11`;
export const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';
export const SCRATCH = process.env.M11_SCRATCH ||
  'C:/Users/aquil/AppData/Local/Temp/claude/C--dev/9c5a79fb-f118-4054-8d26-9cede07ac0c2/scratchpad';

export const RAW = fs.readFileSync(SRC, 'utf8');
export const LINES = RAW.split('\n');
const lineStarts = [0];
for (let i = 0; i < RAW.length; i++) if (RAW[i] === '\n') lineStarts.push(i + 1);
export function lineOf(off) {
  let lo = 0, hi = lineStarts.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (lineStarts[mid] <= off) lo = mid; else hi = mid - 1; }
  return lo + 1;
}

// ── entidades e normalização ──────────────────────────────────
const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': '\u00a0', '&middot;': '·', '&mdash;': '—', '&ndash;': '–' };
export const decode = (s) => s.replace(/&(amp|lt|gt|quot|#39|nbsp|middot|mdash|ndash);/g, (m) => ENT[m]);
export const ws = (s) => s.replace(/\s+/g, ' ').trim();
export const stripTags = (h) => ws(decode(h.replace(/<[^>]+>/g, '')));
export const htmlNorm = (h) => ws(h);

// ── parser ────────────────────────────────────────────────────
const VOID = new Set(['br', 'input', 'img', 'meta', 'link', 'hr', 'source', 'wbr']);
export function parse(src = RAW) {
  const root = { tag: '#root', attrs: {}, children: [], start: 0, innerStart: 0, innerEnd: src.length, end: src.length, parent: null };
  const re = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1>|<\/([a-zA-Z0-9]+)\s*>|<([a-zA-Z0-9]+)((?:\s+[^\s=>]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>/g;
  let cur = root, m;
  while ((m = re.exec(src))) {
    if (m[0].startsWith('<!--')) continue;
    if (m[1]) {
      const tag = m[1].toLowerCase();
      const openEnd = src.indexOf('>', m.index) + 1;
      const n = { tag, attrs: attrsOf(src.slice(m.index, openEnd)), children: [], start: m.index, innerStart: openEnd, innerEnd: m.index + m[0].lastIndexOf('</'), end: m.index + m[0].length, parent: cur, line: lineOf(m.index) };
      cur.children.push(n);
      continue;
    }
    if (m[2]) {
      const tag = m[2].toLowerCase();
      let x = cur;
      while (x && x.tag !== tag) x = x.parent;
      if (!x) continue; // fechamento órfão
      let y = cur;
      while (y !== x) { y.innerEnd = m.index; y.end = m.index; y = y.parent; }
      x.innerEnd = m.index; x.end = m.index + m[0].length;
      cur = x.parent;
      continue;
    }
    const tag = m[3].toLowerCase();
    const n = { tag, attrs: attrsOf(m[0]), children: [], start: m.index, innerStart: m.index + m[0].length, innerEnd: m.index + m[0].length, end: m.index + m[0].length, parent: cur, line: lineOf(m.index) };
    cur.children.push(n);
    if (!VOID.has(tag) && !m[0].endsWith('/>')) cur = n;
  }
  return root;
}
function attrsOf(tagText) {
  const a = {};
  const body = tagText.replace(/^<[a-zA-Z0-9]+/, '').replace(/\/?>$/, '');
  for (const m of body.matchAll(/([^\s=>]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) a[m[1]] = m[2] ?? m[3] ?? m[4] ?? '';
  return a;
}
export const inner = (n) => RAW.slice(n.innerStart, n.innerEnd);
export const outer = (n) => RAW.slice(n.start, n.end);
export const hasClass = (n, c) => (n.attrs?.class || '').split(/\s+/).includes(c);
export function walk(n, fn) { fn(n); for (const c of n.children || []) walk(c, fn); }
export function findAll(n, pred) { const r = []; walk(n, (x) => { if (x !== n && pred(x)) r.push(x); }); return r; }
export const find = (n, pred) => findAll(n, pred)[0] || null;
export const byClass = (n, c) => findAll(n, (x) => hasClass(x, c));
export const byTag = (n, t) => findAll(n, (x) => x.tag === t);
export const kids = (n, pred = () => true) => n.children.filter(pred);
export const trecho = (s) => ws(stripTags(s)).slice(0, 70);
export const origem = (n, seletor, texto) => ({ seletor, trecho_inicial: trecho(texto ?? inner(n)), linha_aprox: n.line });
export const lit = (n) => ({ html: htmlNorm(inner(n)), texto: stripTags(inner(n)) });

export const DOC = parse();
export const sections = byTag(DOC, 'section').map((s) => {
  const sid = find(s, (x) => hasClass(x, 'sec-id'));
  const h2 = find(s, (x) => x.tag === 'h2');
  return { node: s, id: s.attrs.id, secId: sid, h2 };
});
export const sectionOfLine = (ln) => sections.find((s) => lineOf(s.node.start) <= ln && ln <= lineOf(s.node.end));

// ── script original ───────────────────────────────────────────
export const SCRIPT_NODE = byTag(DOC, 'script')[0];
export const SCRIPT_LINE0 = lineOf(SCRIPT_NODE.innerStart); // linha do '<script>'
export const scriptText = () => inner(SCRIPT_NODE);
/** linhas [a,b] 1-based do arquivo, verbatim */
export const linesText = (a, b) => LINES.slice(a - 1, b).join('\n');
/** avalia um literal JS (array/objeto) situado nas linhas [a,b], a partir do '=' */
export function evalLiteral(a, b) {
  const t = linesText(a, b);
  const i = t.indexOf('=');
  const body = t.slice(i + 1).replace(/;\s*$/, '');
  return new Function(`return (${body});`)();
}
export const findLine = (re, from = 1, to = LINES.length) => {
  for (let i = from; i <= to; i++) if (re.test(LINES[i - 1])) return i;
  return null;
};

// ── DOM simulado ──────────────────────────────────────────────
class ClassList {
  constructor(el) { this.el = el; }
  get set() { return new Set((this.el._class || '').split(/\s+/).filter(Boolean)); }
  add(...c) { const s = this.set; c.forEach((x) => s.add(x)); this.el._class = [...s].join(' '); }
  remove(...c) { const s = this.set; c.forEach((x) => s.delete(x)); this.el._class = [...s].join(' '); }
  contains(c) { return this.set.has(c); }
  toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
}
export class El {
  constructor(tag, attrs = {}, text = '') {
    this.tagName = tag.toUpperCase(); this.attrs = { ...attrs }; this._class = attrs.class || '';
    this.value = attrs.value ?? ''; this.textContent = text; this._html = ''; this.children = [];
    this.style = {}; this.listeners = {}; this.classList = new ClassList(this); this.checked = false;
  }
  get className() { return this._class; }
  set className(v) { this._class = v; }
  get innerHTML() { return this._html; }
  set innerHTML(v) {
    this._html = v; this.children = [];
    for (const m of String(v).matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/g)) {
      const a = attrsOf(`<button${m[1]}>`);
      this.children.push(new El('button', a, decode(m[2])));
    }
  }
  getAttribute(k) { return k === 'class' ? this._class : (this.attrs[k] ?? null); }
  setAttribute(k, v) { if (k === 'class') this._class = v; else this.attrs[k] = v; }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
  dispatch(t) { (this.listeners[t] || []).forEach((f) => f({ target: this })); }
  querySelectorAll(sel) {
    if (sel === 'button') return this.children.filter((c) => c.tagName === 'BUTTON');
    if (sel === 'button.on') return this.children.filter((c) => c.tagName === 'BUTTON' && c.classList.contains('on'));
    return [];
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
}
/** Monta o documento simulado a partir da marcação real: todo elemento com
 *  id vira El; os <button> filhos de um .seg viram filhos do El. */
export function buildDom() {
  const reg = {};
  walk(DOC, (n) => {
    if (!n.attrs?.id) return;
    const el = new El(n.tag, n.attrs, stripTags(inner(n)));
    if (n.tag === 'input') el.value = n.attrs.value ?? '';
    for (const b of kids(n, (x) => x.tag === 'button')) el.children.push(new El('button', b.attrs, stripTags(inner(b))));
    reg[n.attrs.id] = el;
  });
  const document = {
    getElementById: (i) => reg[i] || null,
    querySelectorAll: () => [],
    querySelector: () => null,
    documentElement: { scrollHeight: 1000, clientHeight: 800, scrollTop: 0 },
    body: { scrollTop: 0 },
  };
  const window = { addEventListener() {} };
  new Function('document', 'window', scriptText())(document, window);
  return { reg, document };
}
/** aplica um estado: {idNumero: valor} e {idSeg: valorDoData} */
export function setState(reg, state) {
  for (const [id, v] of Object.entries(state)) {
    const el = reg[id];
    if (!el) throw new Error(`sem elemento ${id}`);
    if (el.tagName === 'INPUT') { el.value = String(v); el.dispatch('input'); continue; }
    const btn = el.children.find((b) => Object.entries(b.attrs).some(([k, x]) => k.startsWith('data-') && x === String(v)));
    if (!btn) throw new Error(`sem botão ${v} em ${id}`);
    btn.dispatch('click');
  }
}

// ── código atual (só leitura) ─────────────────────────────────
export async function loadCodigo() {
  const entry = path.join(SCRATCH, 'm11-entry.ts');
  const out = path.join(SCRATCH, 'm11-codigo-bundle.mjs');
  fs.writeFileSync(entry, [
    "export { INSTRUMENT_CALCULATORS } from '@/lib/data/alexandria-instrument-calculators';",
    "export * from '@/lib/data/alexandria-modulo-11-content';",
    "export { ALEXANDRIA_GLOSSARIO } from '@/lib/data/alexandria-glossario';",
    "export { ALEXANDRIA_BLOCKS } from '@/lib/data/alexandria-blocks';",
  ].join('\n'));
  const bin = `${REPO}/node_modules/.bin/esbuild${process.platform === 'win32' ? '.cmd' : ''}`;
  execFileSync(bin, [entry, '--bundle', '--format=esm', '--platform=node', `--alias:@=${REPO}/src`, `--outfile=${out}`, '--log-level=error'], { cwd: REPO, shell: process.platform === 'win32' });
  return import(pathToFileURL(out).href + `?t=${Date.now()}`);
}
export const readRepo = (rel) => fs.readFileSync(`${REPO}/${rel}`, 'utf8');
export const lineInFile = (txt, needle) => { const i = txt.indexOf(needle); return i < 0 ? null : txt.slice(0, i).split('\n').length; };
export const writeJson = (name, obj) => fs.writeFileSync(`${OUTDIR}/${name}`, JSON.stringify(obj, null, 2) + '\n', 'utf8');
export const pad = (n) => String(n).padStart(2, '0');
