// Biblioteca comum dos extratores do M13.
// - parser de HTML próprio (sem dependência) que guarda offsets de cada
//   elemento, para que `html` seja um RECORTE literal da fonte;
// - helpers de texto/origem;
// - leitor de literais JS do <script> (avaliados em vm, nunca digitados);
// - DOM simulado mínimo para EXECUTAR o script original (protocolo §10).
import fs from 'node:fs';
import vm from 'node:vm';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo13.html';
export const REPO = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = `${REPO}/docs/alexandria-v2/extraction/m13`;
export const S = fs.readFileSync(SRC, 'utf8');
export const LINES = S.split('\n');
export const fail = (m) => { throw new Error(m); };

// ── linhas ───────────────────────────────────────────────────
const lineStarts = [0];
for (let i = 0; i < S.length; i++) if (S[i] === '\n') lineStarts.push(i + 1);
export function lineOf(off) {
  let lo = 0, hi = lineStarts.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (lineStarts[mid] <= off) lo = mid; else hi = mid - 1; }
  return lo + 1;
}

// ── texto ────────────────────────────────────────────────────
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', hellip: '…', times: '×', middot: '·' };
export const decode = (s) => s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return ENT[e] ?? m;
});
export const collapse = (s) => s.replace(/\s+/g, ' ').trim();
export const stripTags = (h) => h.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '');
export const texto = (h) => collapse(decode(stripTags(h)));
export const htmlN = (h) => collapse(h);
export const txt = (h) => ({ html: htmlN(h), texto: texto(h) });
export const trecho = (off) => collapse(S.slice(off, off + 200)).slice(0, 90);
export const origem = (node, seletor) => ({ seletor, trecho_inicial: trecho(node.start), linha_aprox: node.line });
export const origemOff = (off, seletor) => ({ seletor, trecho_inicial: trecho(off), linha_aprox: lineOf(off) });

// ── parser HTML ──────────────────────────────────────────────
const VOID = new Set(['br', 'input', 'img', 'meta', 'link', 'hr', 'source', 'wbr']);
const RAW = new Set(['script', 'style']);
export function parseHTML(src, base = 0) {
  const root = { tag: '#root', attrs: {}, children: [], parent: null, start: 0, openEnd: 0, closeStart: src.length, end: src.length };
  let cur = root;
  const re = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|[^<]+|</g;
  let m;
  while ((m = re.exec(src))) {
    const off = m.index;
    if (m[2] === undefined) {
      if (m[0][0] !== '<' || m[0] === '<') cur.children.push({ tag: '#text', text: m[0], start: base + off, end: base + off + m[0].length, parent: cur });
      continue;
    }
    const tag = m[2].toLowerCase();
    if (m[1] === '/') {
      let n = cur;
      while (n && n.tag !== tag) n = n.parent;
      if (!n) continue; // fechamento órfão
      while (cur !== n) { cur.closeStart = base + off; cur.end = base + off; cur = cur.parent; }
      n.closeStart = base + off; n.end = base + off + m[0].length; cur = n.parent;
      continue;
    }
    const attrs = {};
    m[3].replace(/([\w:-]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+)))?/g, (_, k, __, a, b, c) => { attrs[k.toLowerCase()] = a ?? b ?? c ?? ''; });
    const el = { tag, attrs, children: [], parent: cur, start: base + off, openEnd: base + off + m[0].length, line: lineOf(base + off) };
    cur.children.push(el);
    if (VOID.has(tag) || m[3].trim().endsWith('/')) { el.closeStart = el.end = el.openEnd; continue; }
    if (RAW.has(tag)) {
      const close = src.toLowerCase().indexOf(`</${tag}`, off + m[0].length);
      el.closeStart = base + close; el.end = base + src.indexOf('>', close) + 1;
      el.raw = src.slice(off + m[0].length, close);
      re.lastIndex = close + tag.length + 3;
      continue;
    }
    cur = el;
  }
  return root;
}
export const DOC = parseHTML(S);

export const classes = (n) => (n.attrs?.class || '').split(/\s+/).filter(Boolean);
export const hasClass = (n, c) => classes(n).includes(c);
export function all(node, pred, out = []) {
  for (const c of node.children || []) { if (c.tag !== '#text' && pred(c)) out.push(c); all(c, pred, out); }
  return out;
}
export const first = (node, pred) => all(node, pred)[0];
export const byTag = (t) => (n) => n.tag === t;
export const byClass = (c) => (n) => hasClass(n, c);
export const byClassExact = (c) => (n) => (n.attrs?.class || '') === c;
export const kids = (n) => (n.children || []).filter((c) => c.tag !== '#text');
export const inner = (n) => S.slice(n.openEnd, n.closeStart);
export const outer = (n) => S.slice(n.start, n.end);
export const byId = (id) => first(DOC, (n) => n.attrs?.id === id);

// texto de um nó sem os filhos que casam `skip`
export function innerSkipping(n, skip) {
  let out = '', pos = n.openEnd;
  for (const c of n.children) {
    if (c.tag !== '#text' && skip(c)) { out += S.slice(pos, c.start); pos = c.end; }
  }
  return out + S.slice(pos, n.closeStart);
}

// ── literais JS do <script> ──────────────────────────────────
export const SCRIPT_NODE = all(DOC, byTag('script'))[0];
export const JS = SCRIPT_NODE.raw;
export const JS_BASE = SCRIPT_NODE.openEnd;
export const jsLine = (jsOff) => lineOf(JS_BASE + jsOff);

// devolve [inicio, fim) do literal que começa em `from` (primeiro [ ou {)
export function literalSpan(code, from) {
  let i = from; while (code[i] !== '[' && code[i] !== '{') i++;
  const start = i; let depth = 0; let q = null;
  for (; i < code.length; i++) {
    const ch = code[i];
    if (q) { if (ch === '\\') { i++; continue; } if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { q = ch; continue; }
    if (ch === '[' || ch === '{' || ch === '(') depth++;
    else if (ch === ']' || ch === '}' || ch === ')') { depth--; if (depth === 0) return [start, i + 1]; }
  }
  fail('literal sem fim');
}
// avalia `var NOME=` a partir de `after` (offset no JS)
export function jsLiteral(nome, after = 0) {
  const at = JS.indexOf(`var ${nome}=`, after);
  if (at < 0) fail(`literal ${nome} não achado após ${after}`);
  const [a, b] = literalSpan(JS, at);
  return { value: vm.runInNewContext(`(${JS.slice(a, b)})`), start: a, end: b, linha: jsLine(at), code: JS.slice(a, b) };
}
// offset no JS do marcador de bloco /* ===== NOME ===== */
export function jsBlock(marker) {
  const a = JS.indexOf(marker);
  if (a < 0) fail(`bloco ${marker}`);
  const b = JS.indexOf('/* =====', a + 10);
  return { start: a, end: b < 0 ? JS.length : b, code: JS.slice(a, b < 0 ? JS.length : b) };
}
// linha (no HTML) em que uma substring aparece no JS a partir de `after`
export function jsFind(sub, after = 0) {
  const i = JS.indexOf(sub, after);
  if (i < 0) fail(`jsFind: ${sub.slice(0, 60)}`);
  return { off: i, linha: jsLine(i) };
}

// Converte uma expressão JS de concatenação ('a'+x+'b') num modelo legível
// "a{x}b". Mecânico: literais de string viram texto, expressões viram {…}.
export function modeloLegivel(expr) {
  const parts = []; let i = 0, buf = '', depth = 0, q = null, str = false;
  const flushExpr = () => { const e = buf.trim(); if (e) parts.push({ e }); buf = ''; };
  while (i < expr.length) {
    const ch = expr[i];
    if (q) {
      if (ch === '\\') { buf += expr[i + 1]; i += 2; continue; }
      if (ch === q) { q = null; if (str) { parts.push({ s: buf }); buf = ''; str = false; } else buf += ch; i++; continue; }
      buf += ch; i++; continue;
    }
    if ((ch === "'" || ch === '"') && depth === 0 && buf.trim() === '') { q = ch; str = true; buf = ''; i++; continue; }
    if (ch === "'" || ch === '"') { q = ch; buf += ch; i++; continue; }
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === '+' && depth === 0) { flushExpr(); i++; continue; }
    buf += ch; i++;
  }
  flushExpr();
  return parts.map((p) => (p.s !== undefined ? p.s : `{${p.e}}`)).join('');
}

// ── DOM simulado ─────────────────────────────────────────────
class FakeEl {
  constructor(tag, attrs = {}, doc) {
    this.tagName = tag.toUpperCase(); this._attrs = { ...attrs }; this._children = []; this.parentNode = null;
    this._doc = doc; this.style = {}; this._ls = {}; this._html = ''; this.checked = false;
    this.value = attrs.value ?? '';
    const self = this;
    this.classList = {
      add: (c) => { const s = new Set(classes({ attrs: self._attrs })); s.add(c); self._attrs.class = [...s].join(' '); },
      remove: (...cs) => { const s = new Set(classes({ attrs: self._attrs })); cs.forEach((c) => s.delete(c)); self._attrs.class = [...s].join(' '); },
      contains: (c) => classes({ attrs: self._attrs }).includes(c),
    };
  }
  get id() { return this._attrs.id; }
  get className() { return this._attrs.class || ''; }
  set className(v) { this._attrs.class = v; }
  getAttribute(k) { return this._attrs[k] ?? null; }
  setAttribute(k, v) { this._attrs[k] = String(v); }
  addEventListener(t, fn) { (this._ls[t] ||= []).push(fn); }
  fire(t) { (this._ls[t] || []).forEach((fn) => fn({ target: this })); }
  click() { this.fire('click'); }
  get innerHTML() { return this._html; }
  set innerHTML(h) {
    this._html = String(h);
    this._children = [];
    const tree = parseHTML(this._html);
    const conv = (n, parent) => {
      for (const c of n.children) {
        if (c.tag === '#text') continue;
        const e = new FakeEl(c.tag, c.attrs, this._doc); e.parentNode = parent; parent._children.push(e);
        if (c.closeStart > c.openEnd) e._html = this._html.slice(c.openEnd, c.closeStart);
        conv(c, e);
      }
    };
    conv(tree, this);
  }
  get textContent() { return texto(this._html); }
  set textContent(t) { this._html = String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); this._children = []; }
  *walk() { for (const c of this._children) { yield c; yield* c.walk(); } }
  querySelectorAll(sel) { return [...this.walk()].filter((e) => matchSel(e, sel)); }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
}
function matchSel(e, sel) {
  const m = sel.match(/^([a-z]+)?((?:\.[\w-]+)*)((?:\[[\w-]+="[^"]*"\])*)(:checked)?$/);
  if (!m) fail(`seletor não suportado: ${sel}`);
  if (m[1] && e.tagName !== m[1].toUpperCase()) return false;
  for (const c of (m[2] || '').split('.').filter(Boolean)) if (!e.classList.contains(c)) return false;
  for (const a of (m[3] || '').matchAll(/\[([\w-]+)="([^"]*)"\]/g)) if (e.getAttribute(a[1]) !== a[2]) return false;
  if (m[4] && !e.checked) return false;
  return true;
}
export function makeDocument() {
  const doc = {};
  const body = new FakeEl('body', {}, doc);
  const conv = (n, parent) => {
    for (const c of n.children) {
      if (c.tag === '#text' || c.tag === 'script' || c.tag === 'style') continue;
      const e = new FakeEl(c.tag, c.attrs, doc); e.parentNode = parent; parent._children.push(e);
      if (c.children?.length) { e._html = inner(c); }
      conv(c, e);
    }
  };
  conv(first(DOC, byTag('body')), body);
  // ids estáticos em cache (containers só trocam os próprios filhos);
  // ids criados por innerHTML (quiz: fb-N) caem no walk.
  const cache = new Map();
  for (const e of body.walk()) if (e.id) cache.set(e.id, e);
  Object.assign(doc, {
    body, documentElement: { scrollHeight: 1000, clientHeight: 800, scrollTop: 0 },
    getElementById: (id) => cache.get(id) || [...body.walk()].find((e) => e.id === id) || null,
    querySelectorAll: (s) => body.querySelectorAll(s),
    querySelector: (s) => body.querySelector(s),
  });
  body.scrollTop = 0;
  return doc;
}
// Executa o <script> original num contexto com o DOM simulado.
export function runScript() {
  const document = makeDocument();
  const window = { addEventListener() {} };
  const ctx = vm.createContext({ document, window, console, Math, parseFloat, parseInt, isNaN, isFinite, String, Array, Number });
  vm.runInContext(JS, ctx);
  return { document, ctx, $: (id) => document.getElementById(id) };
}

export function writeJSON(name, obj) {
  fs.writeFileSync(`${OUTDIR}/${name}`, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}
export const pad = (n) => String(n).padStart(2, '0');
export const readRepo = (p) => fs.readFileSync(`${REPO}/${p}`, 'utf8');
