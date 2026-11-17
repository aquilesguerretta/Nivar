// Biblioteca comum dos extratores do M17.
// Le a fonte (so leitura), constroi uma arvore de DOM minima (sem dependencia
// externa), e oferece utilitarios de texto/origem. Nada de conteudo e digitado:
// todo texto sai do arquivo-fonte por posicao no DOM ou por avaliacao do literal
// do <script>.
import fs from 'node:fs';
import vm from 'node:vm';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo17.html';
export const ROOT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = ROOT + '/docs/alexandria-v2/extraction/m17';
export const DATA = ROOT + '/src/lib/data';
export const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';

export const html = fs.readFileSync(SRC, 'utf8');
export const LINHAS_TOTAL = html.split('\n').length;
export const BYTES = Buffer.byteLength(html, 'utf8');

// ---------- linha por offset ----------
const NL = [];
for (let i = 0; i < html.length; i++) if (html.charCodeAt(i) === 10) NL.push(i);
export function lineOf(off) {
  let lo = 0, hi = NL.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (NL[mid] < off) lo = mid + 1; else hi = mid; }
  return lo + 1;
}

// ---------- entidades ----------
const ENT = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0',
  ldquo: '\u201c', rdquo: '\u201d', lsquo: '\u2018', rsquo: '\u2019',
  mdash: '\u2014', ndash: '\u2013', middot: '\u00b7', larr: '\u2190', rarr: '\u2192',
  aacute: '\u00e1', oacute: '\u00f3', eacute: '\u00e9', iacute: '\u00ed', uacute: '\u00fa',
  hellip: '\u2026', times: '\u00d7',
};
export function decode(s) {
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    const v = ENT[e.toLowerCase()];
    if (v === undefined) throw new Error('entidade desconhecida: ' + m);
    return v;
  });
}
export const collapse = (s) => String(s).replace(/\s+/g, ' ').trim();
export const stripTags = (s) => String(s).replace(/<[^>]+>/g, '');
/** texto limpo: sem tag, entidades decodificadas, espacos colapsados */
export const texto = (h) => collapse(decode(stripTags(h)));
/** html inline literal (entidades mantidas), espacos colapsados */
export const inline = (h) => collapse(h);

// ---------- parser de DOM minimo ----------
const VOID = new Set(['br', 'input', 'img', 'meta', 'link', 'hr', 'source', 'wbr']);
const RAW = new Set(['script', 'style']);
function parseAttrs(s) {
  const a = {}; const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g; let m;
  while ((m = re.exec(s))) a[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  return a;
}
export function parse(src) {
  const root = { tag: '#root', attrs: {}, children: [], start: 0, openEnd: 0, closeStart: src.length, end: src.length, parent: null };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9]+)\s*>|<([a-zA-Z0-9!]+)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let m, last = 0;
  const top = () => stack[stack.length - 1];
  const pushText = (a, b) => { if (b > a) top().children.push({ tag: '#text', start: a, end: b, parent: top() }); };
  while ((m = re.exec(src))) {
    pushText(last, m.index);
    last = re.lastIndex;
    if (m[0].startsWith('<!--')) continue;
    if (m[1]) { // fechamento
      const t = m[1].toLowerCase();
      let k = stack.length - 1;
      while (k > 0 && stack[k].tag !== t) k--;
      if (k === 0) continue; // fechamento orfao: ignora
      while (stack.length - 1 > k) { const n = stack.pop(); n.closeStart = m.index; n.end = m.index; n.implicit = true; }
      const n = stack.pop(); n.closeStart = m.index; n.end = re.lastIndex;
      continue;
    }
    const t = m[2].toLowerCase();
    if (t === '!doctype') continue;
    const node = { tag: t, attrs: parseAttrs(m[3] || ''), children: [], start: m.index, openEnd: re.lastIndex, parent: top() };
    top().children.push(node);
    if (VOID.has(t) || /\/\s*$/.test(m[3] || '')) { node.closeStart = node.end = re.lastIndex; continue; }
    if (RAW.has(t)) {
      const close = src.toLowerCase().indexOf('</' + t, re.lastIndex);
      node.closeStart = close; node.end = src.indexOf('>', close) + 1;
      re.lastIndex = node.end; last = node.end; continue;
    }
    stack.push(node);
  }
  pushText(last, src.length);
  return root;
}
export const DOM = parse(html);

export const cls = (n) => (n.attrs && n.attrs.class ? n.attrs.class.split(/\s+/) : []);
export const hasClass = (n, c) => cls(n).includes(c);
export const classIs = (n, c) => n.attrs && n.attrs.class === c;
export const innerHTML = (n) => html.slice(n.openEnd, n.closeStart);
export const outerHTML = (n) => html.slice(n.start, n.end);
export const els = (n) => n.children.filter((c) => c.tag !== '#text');
export function findAll(n, pred, out = []) {
  for (const c of n.children || []) { if (c.tag !== '#text') { if (pred(c)) out.push(c); findAll(c, pred, out); } }
  return out;
}
export const find = (n, pred) => findAll(n, pred)[0] || null;
export const byId = (id) => find(DOM, (n) => n.attrs.id === id);
export const T = (n) => texto(innerHTML(n));
export const H = (n) => inline(innerHTML(n));

/** origem padrao */
export function origem(seletor, node_or_off, trecho) {
  const off = typeof node_or_off === 'number' ? node_or_off : node_or_off.start;
  const tr = trecho ?? (typeof node_or_off === 'number' ? '' : T(node_or_off).slice(0, 70));
  return { seletor, trecho_inicial: tr, linha_aprox: lineOf(off) };
}
/** html + texto + origem */
export function lit(node, seletor, extra = {}) {
  return { html: H(node), texto: T(node), ...extra, origem: origem(seletor, node) };
}

// ---------- scripts ----------
export const scripts = findAll(DOM, (n) => n.tag === 'script').map((n) => ({ node: n, code: innerHTML(n), off: n.openEnd }));
/** avalia um literal JS encontrado no script depois de `marker` (ex.: 'var J = ') */
export function evalLiteral(marker, scriptIdx = null) {
  const list = scriptIdx === null ? scripts : [scripts[scriptIdx]];
  for (const s of list) {
    const i = s.code.indexOf(marker);
    if (i < 0) continue;
    const start = i + marker.length - (/[[{]$/.test(marker) ? 1 : 0);
    const open = s.code[start];
    const close = open === '[' ? ']' : '}';
    let depth = 0, j = start, q = null;
    for (; j < s.code.length; j++) {
      const ch = s.code[j];
      if (q) { if (ch === '\\') { j++; continue; } if (ch === q) q = null; continue; }
      if (ch === "'" || ch === '"' || ch === '`') { q = ch; continue; }
      if (ch === open) depth++;
      else if (ch === close) { depth--; if (depth === 0) break; }
    }
    const lit = s.code.slice(start, j + 1);
    return { valor: vm.runInNewContext('(' + lit + ')'), linha_aprox: lineOf(s.off + i), literal: lit, off: s.off + i };
  }
  throw new Error('literal nao encontrado: ' + marker);
}
/** trecho verbatim do script entre dois marcadores (inclusive o inicial) */
export function scriptSlice(startMarker, endMarker) {
  for (const s of scripts) {
    const i = s.code.indexOf(startMarker);
    if (i < 0) continue;
    const j = endMarker ? s.code.indexOf(endMarker, i + startMarker.length) : s.code.length;
    return { codigo: s.code.slice(i, j < 0 ? undefined : j), linha_inicio: lineOf(s.off + i), linha_fim: lineOf(s.off + (j < 0 ? s.code.length : j)) };
  }
  throw new Error('trecho nao encontrado: ' + startMarker);
}
export function lineOfScript(needle) {
  for (const s of scripts) { const i = s.code.indexOf(needle); if (i >= 0) return lineOf(s.off + i); }
  throw new Error('nao encontrado no script: ' + needle);
}

// ---------- DOM simulado para executar o script original ----------
export function runOriginal() {
  const els = new Map();
  function mk(id) {
    const e = {
      id, innerHTML: '', className: '', textContent: '', style: {}, value: undefined, handlers: {},
      addEventListener(t, f) { (this.handlers[t] ||= []).push(f); },
      querySelectorAll() { return []; }, querySelector() { return null; },
      classList: { add() {}, remove() {}, toggle() {} }, scrollIntoView() {}, getAttribute() { return null; },
    };
    return e;
  }
  const document = {
    getElementById(id) { if (!els.has(id)) els.set(id, mk(id)); return els.get(id); },
    querySelectorAll() { return []; }, querySelector() { return null; },
    documentElement: { scrollHeight: 0, clientHeight: 0, scrollTop: 0 },
  };
  const window = { addEventListener() {} };
  const ctx = vm.createContext({ document, window, console, isFinite, parseFloat, parseInt, Math, String, Object, Infinity, NaN });
  for (const s of scripts) vm.runInContext(s.code, ctx);
  // input numerico: devolve elemento com value; chip: simula clique
  function setVal(id, v) { document.getElementById(id).value = String(v); }
  function clearVals() { for (const [, e] of els) e.value = undefined; }
  function clickChip(wrapId, i) {
    const w = document.getElementById(wrapId);
    const target = { closest: () => ({ getAttribute: () => String(i) }) };
    (w.handlers.click || []).forEach((f) => f({ target }));
  }
  function fire(id, type) { const e = document.getElementById(id); (e.handlers[type] || []).forEach((f) => f({ target: e })); }
  return { els, document, window, get: (id) => document.getElementById(id), setVal, clearVals, clickChip, fire };
}

// ---------- tokens para cobertura ----------
export const tokens = (s) => collapse(decode(String(s).replace(/<[^>]+>/g, " "))).toLowerCase().normalize('NFC').match(/[\p{L}\p{N}]+/gu) || [];
export function coverage(srcTokens, extractedText) {
  const bag = new Map();
  for (const t of tokens(extractedText)) bag.set(t, (bag.get(t) || 0) + 1);
  let hit = 0; const miss = [];
  for (const t of srcTokens) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else miss.push(t); }
  return { total: srcTokens.length, casados: hit, pct: srcTokens.length ? +(100 * hit / srcTokens.length).toFixed(2) : null, nao_casados_amostra: miss.slice(0, 40) };
}

export function writeJSON(name, obj) {
  fs.writeFileSync(OUTDIR + '/' + name, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}
export const pad = (n) => String(n).padStart(2, '0');
export const readData = (f) => fs.readFileSync(DATA + '/' + f, 'utf8');

/** secoes de topo, na ordem do documento */
export const SECOES = findAll(DOM, (n) => n.tag === 'section').map((s) => {
  const sid = find(s, (n) => classIs(n, 'sec-id'));
  const h2 = find(s, (n) => n.tag === 'h2');
  const b = sid ? find(sid, (n) => n.tag === 'b') : null;
  const marcadorTexto = sid ? T(sid) : null;
  return {
    node: s, id: s.attrs.id, sid, h2,
    marcador_html: sid ? H(sid) : null,
    marcador_texto: marcadorTexto,
    rotulo: b ? T(b) : null,
    prefixo: sid ? texto(innerHTML(sid).split('&middot;')[0]) : null,
    eh_aula: /^Aula \d+/.test(marcadorTexto || ''),
  };
});
export const secao = (id) => SECOES.find((s) => s.id === id);
/** filhos diretos do .wrap de uma secao */
export const wrapKids = (sec) => els(find(sec.node, (n) => classIs(n, 'wrap')));
