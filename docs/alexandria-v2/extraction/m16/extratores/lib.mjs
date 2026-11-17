// Biblioteca comum dos extratores do M16. Le a fonte (so leitura). Nenhum texto de conteudo e digitado aqui.
// Adaptado de m01/extratores (m01_aparato.mjs / m01_modulo.mjs): mesmo contrato de `origem`,
// `html` (inline preservado, espacos colapsados) e `texto` (sem tags). Diferenca do M16: a fonte tem
// 7.842 entidades nomeadas em 29 tipos (e zero numericas), entao `html` e `texto` saem com entidades
// DECODIFICADAS (a regra do brief tolera "espacos/entidades HTML").
import fs from 'node:fs';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo16.html';
export const REPO = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = `${REPO}/docs/alexandria-v2/extraction/m16`;
export const CODE = {
  conteudo: `${REPO}/src/lib/data/alexandria-modulo-16-content.ts`,
  curriculo: `${REPO}/src/lib/data/alexandria-curriculo.ts`,
  trilhas: `${REPO}/src/lib/data/alexandria-trilhas.ts`,
  glossario: `${REPO}/src/lib/data/alexandria-glossario.ts`,
  calculadoras: `${REPO}/src/lib/data/alexandria-instrument-calculators.ts`,
  badges: `${REPO}/src/lib/data/alexandria-badges.ts`,
  blocks: `${REPO}/src/lib/data/alexandria-blocks.ts`,
  recursos: `${REPO}/src/components/alexandria/navigation/RecursosDoModulo.tsx`,
};
export const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';

export const html = fs.readFileSync(SRC, 'utf8');
export const LINES = html.split('\n');
export const lineOf = (idx) => html.slice(0, idx).split('\n').length;

const ENT = {
  atilde: 'ã', ccedil: 'ç', eacute: 'é', mdash: '—', iacute: 'í', ecirc: 'ê', aacute: 'á', oacute: 'ó',
  uacute: 'ú', otilde: 'õ', middot: '·', rdquo: '”', ldquo: '“', agrave: 'à', ordm: 'º', acirc: 'â',
  ocirc: 'ô', Eacute: 'É', sect: '§', times: '×', ndash: '–', hellip: '…', divide: '÷', eta: 'η',
  minus: '−', Oacute: 'Ó', Agrave: 'À', Uacute: 'Ú', Ocirc: 'Ô', nbsp: '\u00a0',
  lt: '<', gt: '>', quot: '"', amp: '&',
};
export const decode = (s) => s.replace(/&([a-zA-Z]+);/g, (m, n) => {
  if (!(n in ENT)) throw new Error('entidade sem traducao: ' + m);
  return ENT[n];
});
// html: tags inline preservadas, entidades decodificadas, espacos colapsados
export const inline = (s) => decode(s).replace(/\s+/g, ' ').trim();
// texto: sem tags
export const texto = (s) => decode(s.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
export const ini = (s, n = 60) => texto(s).slice(0, n);
export const hx = (s) => ({ html: inline(s), texto: texto(s) });
export const origem = (seletor, trecho, idx) => ({ seletor, trecho_inicial: trecho, linha_aprox: lineOf(idx) });
export const pad = (n) => String(n).padStart(2, '0');

// <section id="X"> ... </section>
export function secao(id) {
  const start = html.indexOf(`<section id="${id}">`);
  if (start < 0) throw new Error('secao ' + id);
  const end = html.indexOf('</section>', start);
  return { id, start, end, body: html.slice(start, end) };
}
export function all(re, s, base = 0) {
  const out = []; let m; re.lastIndex = 0;
  while ((m = re.exec(s))) out.push({ m, idx: base + m.index });
  return out;
}
// bloco div balanceado a partir de idx (que aponta para "<div")
export function divBlock(s, idx) {
  const re = /<div\b|<\/div>/g; re.lastIndex = idx; let depth = 0, m;
  while ((m = re.exec(s))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return s.slice(idx, m.index + 6);
  }
  throw new Error('div nao fechada em ' + idx);
}
// objeto/array literal balanceado a partir do primeiro { ou [ depois de `from`
export function literalAt(s, from) {
  let i = from; while (s[i] !== '{' && s[i] !== '[') i++;
  const open = s[i], close = open === '{' ? '}' : ']';
  let depth = 0, q = null;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (q) { if (c === '\\') { j++; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"') { q = c; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return { src: s.slice(i, j + 1), start: i, end: j + 1 }; }
  }
  throw new Error('literal nao fechado');
}

export const SCRIPT_START = html.indexOf('<script>');
export const SCRIPT_END = html.indexOf('</script>');
export const SCRIPT = html.slice(SCRIPT_START + '<script>'.length, SCRIPT_END);
export const SCRIPT_BASE = SCRIPT_START + '<script>'.length;

// avalia `var NOME=<literal>` dentro de um trecho do script (valores sao literais JS puros)
export function evalVar(trechoInicio, nome, ctx = {}) {
  const at = html.indexOf(`var ${nome}=`, trechoInicio);
  if (at < 0) throw new Error('var ' + nome);
  const lit = literalAt(html, at);
  const raw = new Function(...Object.keys(ctx), 'return (' + lit.src + ');')(...Object.values(ctx));
  // strings do script podem trazer entidade (ex.: L5504 "veda&ccedil;ão", inserida por innerHTML): decodificadas aqui
  const deep = (v) => (typeof v === 'string' ? decode(v) : Array.isArray(v) ? v.map(deep) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x)])) : v);
  const entidades = (lit.src.match(/&[a-zA-Z]+;/g) || []);
  return { val: deep(raw), idx: at, linha_ini: lineOf(at), linha_fim: lineOf(lit.end), entidades_decodificadas: entidades };
}

// ------------------------------------------------------------------
// DOM simulado minimo para executar o <script> original (protocolo §10: metodo mais forte).
// Suporta exatamente o que o script usa: getElementById, querySelector(All) de 'button',
// 'button.on', classList, innerHTML/textContent, value, getAttribute, addEventListener, click.
// ------------------------------------------------------------------
function parseAttrs(tag) {
  const a = {}; let m; const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:="([^"]*)")?/g;
  const body = tag.replace(/^<\w+/, '').replace(/>$/, '');
  while ((m = re.exec(body))) a[m[1]] = m[2] === undefined ? '' : decode(m[2]);
  return a;
}
class El {
  constructor(tag, attrs = {}, label = '') {
    this.tagName = tag; this.attrs = attrs; this.id = attrs.id || null; this.label = label;
    this.value = attrs.value ?? ''; this._html = ''; this._txt = null; this.listeners = {};
    this.staticButtons = null; this._cache = null; this.cls = new Set((attrs.class || '').split(/\s+/).filter(Boolean));
    const self = this;
    this.classList = {
      add: (...c) => c.forEach((x) => self.cls.add(x)),
      remove: (...c) => c.forEach((x) => self.cls.delete(x)),
      contains: (c) => self.cls.has(c),
    };
    this.style = {};
  }
  get className() { return [...this.cls].join(' '); }
  set className(v) { this.cls = new Set(String(v).split(/\s+/).filter(Boolean)); }
  get innerHTML() { return this._html; }
  set innerHTML(v) { this._html = String(v); this._txt = null; this._cache = null; }
  get textContent() { return this._txt ?? this._html.replace(/<[^>]+>/g, ''); }
  set textContent(v) { this._txt = String(v); this._html = esc0(String(v)); this._cache = null; }
  getAttribute(n) { return n in this.attrs ? this.attrs[n] : null; }
  setAttribute(n, v) { this.attrs[n] = String(v); }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
  dispatch(t) { (this.listeners[t] || []).forEach((f) => f({ target: this })); }
  click() { this.dispatch('click'); }
  querySelectorAll(sel) {
    if (sel !== 'button') return [];
    if (this.staticButtons) return this.staticButtons;
    if (!this._cache) {
      this._cache = [];
      const re = /<button\b[^>]*>([\s\S]*?)<\/button>/g; let m;
      while ((m = re.exec(this._html))) {
        const tag = /<button\b[^>]*>/.exec(m[0])[0];
        this._cache.push(new El('button', parseAttrs(tag), m[1]));
      }
    }
    return this._cache;
  }
  querySelector(sel) {
    if (sel === 'button.on') return this.querySelectorAll('button').find((b) => b.cls.has('on')) || null;
    return null;
  }
}
const esc0 = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function makeDom() {
  const body = html.slice(html.indexOf('<body>'), SCRIPT_START);
  const byId = {};
  // elementos com id
  for (const { m, idx } of all(/<(\w+)\b[^>]*\bid="([^"]+)"[^>]*>/g, body)) {
    const el = new El(m[1], parseAttrs(m[0]));
    byId[m[2]] = el;
    if (m[1] === 'div') {
      const blk = divBlock(body, idx);
      if (/<button\b/.test(blk)) {
        el.staticButtons = [];
        for (const b of all(/<button\b[^>]*>([\s\S]*?)<\/button>/g, blk)) {
          el.staticButtons.push(new El('button', parseAttrs(/<button\b[^>]*>/.exec(b.m[0])[0]), b.m[1]));
        }
      }
    }
  }
  const counts = {
    '#lex .term': (secao('lex').body.match(/class="term"/g) || []).length,
    '#ex details': (secao('ex').body.match(/<details>/g) || []).length,
    '#erros .tbl tr': (secao('erros').body.match(/<tr>/g) || []).length,
    '#final .ck li': (secao('final').body.match(/<li>/g) || []).length,
    '#ref .ref-list li': (() => { const r = secao('ref').body; const a = r.indexOf('<ul class="ref-list">'); return (r.slice(a, r.indexOf('</ul>', a)).match(/<li>/g) || []).length; })(),
  };
  const document = {
    getElementById: (i) => byId[i] || null,
    querySelectorAll: (s) => (s in counts ? Array.from({ length: counts[s] }, () => ({})) : []),
    querySelector: () => null,
    documentElement: { scrollHeight: 0, clientHeight: 0, scrollTop: 0 },
    body: { scrollTop: 0 },
  };
  const window = { addEventListener() {} };
  return { document, window, byId, counts };
}

export function runScript() {
  const dom = makeDom();
  const fn = new Function('document', 'window', SCRIPT + '\n;return {TND: typeof TND!=="undefined"?TND:null};');
  const ret = fn(dom.document, dom.window);
  return { ...dom, TND: ret.TND };
}

// escolhe um botao de um seg (simula clique real)
export function clickSeg(dom, segId, attr, val) {
  const b = dom.byId[segId].querySelectorAll('button').find((x) => x.getAttribute(attr) === val);
  if (!b) throw new Error(`botao ${segId}[${attr}=${val}]`);
  b.click();
}
export function clickChip(dom, wrapId, attr, val) {
  const b = dom.byId[wrapId].querySelectorAll('button').find((x) => x.getAttribute('data-' + attr) === val);
  if (!b) throw new Error(`chip ${wrapId}[${attr}=${val}]`);
  b.click();
}
// define valor de campo numero e dispara 'input' (como o usuario digitando)
export function setField(dom, numId, v) {
  const n = dom.byId[numId]; n.value = String(v); n.dispatch('input');
}

export function writeJson(name, obj) {
  fs.writeFileSync(`${OUTDIR}/${name}`, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}
export const read = (p) => fs.readFileSync(p, 'utf8');
