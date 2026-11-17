// mini-dom.mjs — executa os scripts REAIS dos módulos da Alexandria (HTML original,
// somente leitura) num DOM mínimo, sem dependência externa.
//
// Para que serve: a fonte é a única autoridade sobre fórmula. Em vez de reescrever
// fórmula, este arquivo carrega o markup do módulo, roda o `<script>` do módulo
// literalmente (node:vm) e deixa o chamador mexer nos controles e ler as saídas.
//
//   const m = carregarModulo(2);
//   m.el('i08-pico').value = '100'; m.disparar('i08-pico', 'input');
//   m.texto('i08-min')   // → "56 GW às 12h"
//
// O que NÃO faz: layout, CSS, canvas. O que faz: árvore de elementos, innerHTML,
// textContent, value/checked/select, classList, dataset, seletores simples,
// eventos com bubbling, timers (fila).
//
// Instrumentação (acorn): cada IIFE é envolvida em try/catch (um instrumento que
// quebra no stub não derruba os outros), e antes de cada escrita de
// innerHTML/textContent é tirado um instantâneo das variáveis numéricas do escopo
// — é daí que saem as séries que a figura da fonte plota (os arrays internos).

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const acorn = require('acorn');

export const DIR_HTML = 'C:/dev/GridAlpha v2/Alexandria modulos';
export const arquivoHtml = (n) => path.join(DIR_HTML, `alexandria_modulo${String(n).padStart(2, '0')}.html`);

/* ============================== parse de HTML ============================== */

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style']);
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', middot: '·', times: '×', minus: '−', ndash: '–', mdash: '—', hellip: '…', rarr: '→', larr: '←', deg: '°', plusmn: '±', divide: '÷', sub2: '₂', sup2: '²', sup3: '³', micro: 'µ', laquo: '«', raquo: '»', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', bull: '•', asymp: '≈', ne: '≠', le: '≤', ge: '≥', uarr: '↑', darr: '↓', harr: '↔', check: '✓', cross: '✗' };
export const decodificar = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) => {
  if (e[0] === '#') {
    const cp = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(cp) ? String.fromCodePoint(cp) : m;
  }
  return ENT[e] ?? m;
});

const FECHA_IMPLICITO = { option: ['option'], li: ['li'], p: ['p'], tr: ['tr'], td: ['td', 'th'], th: ['td', 'th'], dt: ['dt', 'dd'], dd: ['dt', 'dd'] };

class No {
  constructor(tipo) { this.tipo = tipo; this.pai = null; }
}
class Texto extends No {
  constructor(data) { super('texto'); this.data = data; this.doc = null; }
  get textContent() { return this.data; }
  set textContent(v) { this.data = String(v); }
  get nodeType() { return 3; }
}

/** Tokeniza e devolve filhos de um fragmento HTML (sem executar nada). */
function parseFragmento(html, doc, comoSvg) {
  const raiz = new Elemento(doc, 'fragmento');
  let atual = raiz;
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>|([^<]+|<)/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue;
    if (m[5] !== undefined) {
      if (m[5] === '<') { adicionarTexto(atual, '<', doc); continue; }
      adicionarTexto(atual, decodificar(m[5]), doc);
      continue;
    }
    if (m[1]) { // fechamento
      const tag = m[1].toLowerCase();
      let a = atual;
      while (a && a !== raiz && a.tag !== tag) a = a.pai;
      if (a && a !== raiz) atual = a.pai;
      continue;
    }
    const tag = m[2].toLowerCase(); // abertura
    const fecha = FECHA_IMPLICITO[tag];
    if (fecha && atual !== raiz && fecha.includes(atual.tag)) atual = atual.pai;
    if (tag === 'tr' && (atual.tag === 'td' || atual.tag === 'th')) atual = atual.pai?.pai ?? atual;
    const el = new Elemento(doc, tag);
    const attrs = m[3];
    const ra = /([^\s=/"'<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let a;
    while ((a = ra.exec(attrs))) {
      const nome = a[1].toLowerCase();
      const val = a[2] ?? a[3] ?? a[4];
      el.attrs[nome] = val === undefined ? '' : decodificar(val);
    }
    atual.filhos.push(el); el.pai = atual;
    const svg = comoSvg || tag === 'svg';
    if (RAW.has(tag) && !m[4]) {
      const fim = html.toLowerCase().indexOf('</' + tag, re.lastIndex);
      const bruto = html.slice(re.lastIndex, fim < 0 ? html.length : fim);
      if (bruto) { const t = new Texto(bruto); t.pai = el; el.filhos.push(t); }
      const gt = html.indexOf('>', fim < 0 ? html.length : fim);
      re.lastIndex = gt < 0 ? html.length : gt + 1;
      continue;
    }
    if (!VOID.has(tag) && !m[4]) atual = el;
    void svg;
  }
  return raiz.filhos.slice();
}
function adicionarTexto(pai, data, doc) {
  const ult = pai.filhos[pai.filhos.length - 1];
  if (ult instanceof Texto) { ult.data += data; return; }
  const t = new Texto(data); t.pai = pai; t.doc = doc; pai.filhos.push(t);
}

/* ============================== seletores ================================== */

function parseCompound(s) {
  const c = { tag: null, id: null, classes: [], attrs: [], pseudos: [] };
  let i = 0;
  const ident = () => { const m = /^[\w\u00c0-\uffff-]+/.exec(s.slice(i)); if (!m) return ''; i += m[0].length; return m[0]; };
  if (s[i] === '*') i++; else if (/[a-zA-Z]/.test(s[i] || '')) c.tag = ident().toLowerCase();
  while (i < s.length) {
    const ch = s[i];
    if (ch === '.') { i++; c.classes.push(ident()); }
    else if (ch === '#') { i++; c.id = ident(); }
    else if (ch === '[') {
      const f = s.indexOf(']', i);
      const corpo = s.slice(i + 1, f);
      const m = /^\s*([\w:-]+)\s*(?:([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]*)))?\s*$/.exec(corpo);
      if (m) c.attrs.push({ nome: m[1].toLowerCase(), op: m[2] || null, val: m[3] ?? m[4] ?? m[5] ?? '' });
      i = f + 1;
    } else if (ch === ':') {
      i++; const nome = ident();
      let arg = null;
      if (s[i] === '(') { let d = 1, j = i + 1; while (j < s.length && d) { if (s[j] === '(') d++; else if (s[j] === ')') d--; j++; } arg = s.slice(i + 1, j - 1); i = j; }
      c.pseudos.push({ nome, arg });
    } else i++;
  }
  return c;
}
function parseSeletor(sel) {
  return sel.split(',').map((alt) => {
    const partes = [];
    const re = /\s*([>+~])\s*|\s+/g;
    let ultimo = 0, comb = ' ', m;
    const s = alt.trim();
    while ((m = re.exec(s))) {
      partes.push({ comb, c: parseCompound(s.slice(ultimo, m.index)) });
      comb = m[1] || ' '; ultimo = m.index + m[0].length;
    }
    partes.push({ comb, c: parseCompound(s.slice(ultimo)) });
    return partes;
  });
}
function casaCompound(el, c) {
  if (c.tag && el.tag !== c.tag) return false;
  if (c.id && el.attrs.id !== c.id) return false;
  for (const k of c.classes) if (!el.temClasse(k)) return false;
  for (const a of c.attrs) {
    const v = el.attrs[a.nome];
    if (v === undefined) return false;
    if (!a.op) continue;
    if (a.op === '=' && v !== a.val) return false;
    if (a.op === '^=' && !v.startsWith(a.val)) return false;
    if (a.op === '$=' && !v.endsWith(a.val)) return false;
    if (a.op === '*=' && !v.includes(a.val)) return false;
    if (a.op === '~=' && !v.split(/\s+/).includes(a.val)) return false;
  }
  for (const p of c.pseudos) {
    const irmaos = el.pai ? el.pai.filhos.filter((x) => x instanceof Elemento) : [el];
    if (p.nome === 'first-child' && irmaos[0] !== el) return false;
    if (p.nome === 'last-child' && irmaos[irmaos.length - 1] !== el) return false;
    if (p.nome === 'nth-child') { const n = parseInt(p.arg, 10); if (Number.isFinite(n) && irmaos[n - 1] !== el) return false; }
    if (p.nome === 'not' && parseSeletor(p.arg).some((alt) => casaAlt(el, alt))) return false;
    if (p.nome === 'checked' && !el.checked) return false;
  }
  return true;
}
function casaAlt(el, partes, k = partes.length - 1) {
  if (!casaCompound(el, partes[k].c)) return false;
  if (k === 0) return true;
  const comb = partes[k].comb;
  if (comb === '>') return !!el.pai && el.pai instanceof Elemento && casaAlt(el.pai, partes, k - 1);
  if (comb === '+' || comb === '~') {
    const irmaos = el.pai ? el.pai.filhos.filter((x) => x instanceof Elemento) : [];
    const idx = irmaos.indexOf(el);
    for (let j = idx - 1; j >= 0; j--) { if (casaAlt(irmaos[j], partes, k - 1)) return true; if (comb === '+') break; }
    return false;
  }
  for (let a = el.pai; a instanceof Elemento; a = a.pai) if (casaAlt(a, partes, k - 1)) return true;
  return false;
}

/* ============================== Elemento =================================== */

const NUM0 = ['scrollHeight', 'clientHeight', 'scrollTop', 'scrollLeft', 'offsetWidth', 'offsetHeight', 'clientWidth', 'scrollWidth', 'offsetTop', 'offsetLeft', 'clientTop', 'clientLeft'];

function estiloProxy(el) {
  const d = {};
  const metodos = {
    setProperty: (k, v) => { d[k] = String(v); }, getPropertyValue: (k) => d[k] ?? '', removeProperty: (k) => { delete d[k]; },
  };
  return new Proxy(d, {
    get: (t, k) => (k in metodos ? metodos[k] : k === 'cssText' ? Object.entries(t).map(([a, b]) => `${a}:${b}`).join(';') : t[k] ?? ''),
    set: (t, k, v) => { if (k === 'cssText') { for (const kk of Object.keys(t)) delete t[kk]; String(v).split(';').forEach((p) => { const [a, b] = p.split(':'); if (b != null) t[a.trim()] = b.trim(); }); } else t[k] = v; return true; },
  });
}

class Elemento extends No {
  constructor(doc, tag) {
    super('el');
    this.doc = doc; this.tag = tag.toLowerCase(); this.attrs = {}; this.filhos = [];
    this._ouvintes = {}; this._valor = undefined; this._checked = undefined; this._estilo = null; this._sel = undefined;
    for (const k of NUM0) Object.defineProperty(this, k, { value: 0, writable: true, enumerable: false });
  }
  get tagName() { return this.tag.toUpperCase(); }
  get nodeType() { return 1; }
  get nodeName() { return this.tagName; }
  get id() { return this.attrs.id ?? ''; }
  set id(v) { this.attrs.id = String(v); this.doc.v++; }
  get className() { return this.attrs.class ?? ''; }
  set className(v) { this.attrs.class = String(v); }
  temClasse(k) { return (this.attrs.class ?? '').split(/\s+/).includes(k); }
  get classList() {
    const el = this;
    const lista = () => (el.attrs.class ?? '').split(/\s+/).filter(Boolean);
    const grava = (l) => { el.attrs.class = l.join(' '); };
    return {
      add: (...c) => { const l = lista(); c.forEach((x) => { if (!l.includes(x)) l.push(x); }); grava(l); },
      remove: (...c) => grava(lista().filter((x) => !c.includes(x))),
      toggle: (c, f) => { const l = lista(); const tem = l.includes(c); const quer = f === undefined ? !tem : !!f; if (quer && !tem) l.push(c); if (!quer && tem) l.splice(l.indexOf(c), 1); grava(l); return quer; },
      contains: (c) => lista().includes(c),
      item: (i) => lista()[i] ?? null,
      get length() { return lista().length; },
      toString: () => lista().join(' '),
    };
  }
  get dataset() {
    const el = this;
    return new Proxy({}, {
      get: (_, k) => el.attrs['data-' + String(k).replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())],
      set: (_, k, v) => { el.attrs['data-' + String(k).replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())] = String(v); return true; },
      has: (_, k) => ('data-' + String(k).replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())) in el.attrs,
      ownKeys: () => Object.keys(el.attrs).filter((a) => a.startsWith('data-')).map((a) => a.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase())),
      getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
    });
  }
  get style() { return this._estilo ??= estiloProxy(this); }
  set style(v) { this.style.cssText = v; }

  get children() { return this.filhos.filter((x) => x instanceof Elemento); }
  get childNodes() { return this.filhos.slice(); }
  get firstChild() { return this.filhos[0] ?? null; }
  get lastChild() { return this.filhos[this.filhos.length - 1] ?? null; }
  get firstElementChild() { return this.children[0] ?? null; }
  get lastElementChild() { const c = this.children; return c[c.length - 1] ?? null; }
  get parentNode() { return this.pai && this.pai.tag !== 'fragmento' ? this.pai : null; }
  get parentElement() { return this.parentNode; }
  get nextElementSibling() { const c = this.pai ? this.pai.children : []; return c[c.indexOf(this) + 1] ?? null; }
  get previousElementSibling() { const c = this.pai ? this.pai.children : []; return c[c.indexOf(this) - 1] ?? null; }
  get nextSibling() { const c = this.pai ? this.pai.filhos : []; return c[c.indexOf(this) + 1] ?? null; }
  get ownerDocument() { return this.doc; }
  get isConnected() { return this.doc.contem(this); }

  get textContent() { return this.filhos.map((f) => (f instanceof Texto ? f.data : f.textContent)).join(''); }
  set textContent(v) {
    this.filhos = []; const s = String(v ?? '');
    if (s) { const t = new Texto(s); t.pai = this; this.filhos.push(t); }
    this.doc.v++; this.doc.registrar(this, 'textContent', s);
  }
  get innerText() { return this.textContent; }
  set innerText(v) { this.textContent = v; }
  get innerHTML() { return this.filhos.map(serializa).join(''); }
  set innerHTML(v) {
    const html = String(v ?? '');
    const novos = parseFragmento(html, this.doc, this.tag === 'svg');
    this.filhos = novos; novos.forEach((n) => { n.pai = this; });
    this.doc.v++; this.doc.registrar(this, 'innerHTML', html);
  }
  get outerHTML() { return serializa(this); }
  insertAdjacentHTML(pos, html) {
    const novos = parseFragmento(String(html), this.doc, false);
    if (pos === 'beforeend') { novos.forEach((n) => { n.pai = this; this.filhos.push(n); }); }
    else if (pos === 'afterbegin') { novos.forEach((n) => { n.pai = this; }); this.filhos.unshift(...novos); }
    this.doc.v++; this.doc.registrar(this, 'insertAdjacentHTML', html);
  }

  getAttribute(k) { return this.attrs[k.toLowerCase()] ?? null; }
  setAttribute(k, v) { this.attrs[k.toLowerCase()] = String(v); if (k === 'id') this.doc.v++; if (k === 'value') { /* default value */ } }
  removeAttribute(k) { delete this.attrs[k.toLowerCase()]; }
  hasAttribute(k) { return k.toLowerCase() in this.attrs; }
  toggleAttribute(k, f) { const tem = this.hasAttribute(k); const quer = f === undefined ? !tem : f; if (quer) this.attrs[k] = ''; else delete this.attrs[k]; return quer; }
  get type() { return (this.attrs.type ?? (this.tag === 'input' ? 'text' : '')).toLowerCase(); }
  set type(v) { this.attrs.type = v; }
  get name() { return this.attrs.name ?? ''; }
  get min() { return this.attrs.min ?? ''; } set min(v) { this.attrs.min = String(v); }
  get max() { return this.attrs.max ?? ''; } set max(v) { this.attrs.max = String(v); }
  get step() { return this.attrs.step ?? ''; } set step(v) { this.attrs.step = String(v); }
  get disabled() { return 'disabled' in this.attrs; } set disabled(v) { if (v) this.attrs.disabled = ''; else delete this.attrs.disabled; }
  get hidden() { return 'hidden' in this.attrs; } set hidden(v) { if (v) this.attrs.hidden = ''; else delete this.attrs.hidden; }
  get href() { return this.attrs.href ?? ''; }
  get title() { return this.attrs.title ?? ''; } set title(v) { this.attrs.title = String(v); }
  get placeholder() { return this.attrs.placeholder ?? ''; }

  get options() { return this.tag === 'select' ? this._opcoes() : undefined; }
  _opcoes() { const out = []; const rec = (n) => n.filhos.forEach((f) => { if (f instanceof Elemento) { if (f.tag === 'option') out.push(f); else rec(f); } }); rec(this); return out; }
  get selectedIndex() {
    if (this.tag !== 'select') return -1;
    const o = this._opcoes();
    if (this._sel !== undefined) return this._sel;
    const i = o.findIndex((x) => 'selected' in x.attrs);
    return i >= 0 ? i : (o.length ? 0 : -1);
  }
  set selectedIndex(i) { this._sel = i; }
  get selected() { const p = this.pai; if (p && p.tag === 'select') return p._opcoes()[p.selectedIndex] === this; return 'selected' in this.attrs; }
  set selected(v) { const p = this.pai; if (p && p.tag === 'select' && v) p._sel = p._opcoes().indexOf(this); }
  get valorOpcao() { return this.attrs.value ?? this.textContent; }

  get value() {
    if (this.tag === 'select') { const o = this._opcoes()[this.selectedIndex]; return o ? o.valorOpcao : ''; }
    if (this.tag === 'option') return this.valorOpcao;
    if (this.tag === 'textarea') return this._valor ?? this.textContent;
    if (this._valor !== undefined) return this._valor;
    if (this.tag === 'input') {
      const t = this.type;
      if (t === 'checkbox' || t === 'radio') return this.attrs.value ?? 'on';
      if (t === 'range') return this._sanearRange(this.attrs.value ?? String((parseFloat(this.min || '0') + parseFloat(this.max || '100')) / 2));
    }
    return this.attrs.value ?? '';
  }
  set value(v) {
    if (this.tag === 'select') {
      const o = this._opcoes(); const i = o.findIndex((x) => x.valorOpcao === String(v));
      this._sel = i; return;
    }
    if (this.tag === 'input' && this.type === 'range') { this._valor = this._sanearRange(String(v)); return; }
    this._valor = String(v);
  }
  _sanearRange(s) {
    let n = parseFloat(s);
    const min = this.min === '' ? 0 : parseFloat(this.min), max = this.max === '' ? 100 : parseFloat(this.max);
    const passo = this.step === '' ? 1 : parseFloat(this.step);
    if (!Number.isFinite(n)) n = (min + max) / 2;
    if (Number.isFinite(passo) && passo > 0) n = min + Math.round((n - min) / passo) * passo;
    n = Math.min(max, Math.max(min, n));
    return String(+n.toFixed(10));
  }
  get valueAsNumber() { return parseFloat(this.value); }
  get checked() { return this._checked !== undefined ? this._checked : 'checked' in this.attrs; }
  set checked(v) {
    this._checked = !!v;
    if (v && this.type === 'radio' && this.name) this.doc.todos((e) => e !== this && e.tag === 'input' && e.type === 'radio' && e.name === this.name).forEach((e) => { e._checked = false; });
  }

  appendChild(n) {
    if (n.pai) n.pai.removeChild(n);
    if (n.tag === 'fragmento') { n.filhos.forEach((f) => { f.pai = this; this.filhos.push(f); }); n.filhos = []; }
    else { n.pai = this; this.filhos.push(n); }
    this.doc.v++; return n;
  }
  append(...ns) { ns.forEach((n) => this.appendChild(typeof n === 'string' ? this.doc.createTextNode(n) : n)); }
  prepend(n) { n.pai?.removeChild(n); n.pai = this; this.filhos.unshift(n); this.doc.v++; }
  removeChild(n) { const i = this.filhos.indexOf(n); if (i >= 0) this.filhos.splice(i, 1); n.pai = null; this.doc.v++; return n; }
  remove() { if (this.pai) this.pai.removeChild(this); }
  insertBefore(n, ref) { n.pai?.removeChild(n); const i = ref ? this.filhos.indexOf(ref) : -1; n.pai = this; if (i < 0) this.filhos.push(n); else this.filhos.splice(i, 0, n); this.doc.v++; return n; }
  replaceChildren(...ns) { this.filhos = []; ns.forEach((n) => this.appendChild(n)); }
  cloneNode(deep) {
    const c = new Elemento(this.doc, this.tag); c.attrs = { ...this.attrs };
    if (deep) for (const f of this.filhos) { const k = f instanceof Texto ? Object.assign(new Texto(f.data), { doc: this.doc }) : f.cloneNode(true); k.pai = c; c.filhos.push(k); }
    return c;
  }
  contains(n) { for (let a = n; a; a = a.pai) if (a === this) return true; return false; }

  todosDentro(pred, out = []) { for (const f of this.filhos) if (f instanceof Elemento) { if (pred(f)) out.push(f); f.todosDentro(pred, out); } return out; }
  querySelectorAll(sel) { const alts = parseSeletor(sel); return this.todosDentro((e) => alts.some((a) => casaAlt(e, a))); }
  querySelector(sel) { return this.querySelectorAll(sel)[0] ?? null; }
  matches(sel) { return parseSeletor(sel).some((a) => casaAlt(this, a)); }
  closest(sel) { const alts = parseSeletor(sel); for (let a = this; a instanceof Elemento; a = a.pai) if (alts.some((x) => casaAlt(a, x))) return a; return null; }
  getElementsByTagName(t) { return this.todosDentro((e) => t === '*' || e.tag === t.toLowerCase()); }
  getElementsByClassName(c) { return this.todosDentro((e) => e.temClasse(c)); }

  addEventListener(tipo, fn) { (this._ouvintes[tipo] ??= []).push(fn); }
  removeEventListener(tipo, fn) { const l = this._ouvintes[tipo]; if (l) this._ouvintes[tipo] = l.filter((x) => x !== fn); }
  dispatchEvent(ev) { this.doc.propagar(this, ev); return true; }
  click() { this.doc.disparar(this, 'click'); }
  focus() {} blur() {} scrollIntoView() {} select() {} setSelectionRange() {} showModal() {} close() {}
  getBoundingClientRect() { return { x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }; }
  getContext() { return null; }
  getBBox() { return { x: 0, y: 0, width: 0, height: 0 }; }
  getTotalLength() { return 0; }
  setPointerCapture() {}
  animate() { return { cancel() {}, finished: Promise.resolve() }; }
}
for (const nome of ['onclick', 'oninput', 'onchange', 'onkeydown', 'onkeyup', 'onmouseenter', 'onmouseleave', 'onmouseover', 'onmouseout', 'onfocus', 'onblur', 'onsubmit', 'onpointerdown', 'onpointerup', 'onpointermove']) {
  Object.defineProperty(Elemento.prototype, nome, {
    get() { return this['_' + nome] ?? null; },
    set(fn) { const tipo = nome.slice(2); const ant = this['_' + nome]; if (ant) this.removeEventListener(tipo, ant); this['_' + nome] = fn; if (fn) this.addEventListener(tipo, fn); },
  });
}

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function serializa(n) {
  if (n instanceof Texto) return esc(n.data);
  const at = Object.entries(n.attrs).map(([k, v]) => ` ${k}="${String(v).replace(/"/g, '&quot;')}"`).join('');
  if (VOID.has(n.tag)) return `<${n.tag}${at}>`;
  return `<${n.tag}${at}>${n.filhos.map(serializa).join('')}</${n.tag}>`;
}

/* ============================== Documento ================================== */

class Documento {
  constructor() {
    this.v = 0; this._idx = null; this._idxV = -1; this.raiz = null; this.escritas = [];
    this._ouvintes = {}; this.log = null;
  }
  atribuir(raiz) { this.raiz = raiz; }
  contem(el) { for (let a = el; a; a = a.pai) if (a === this.raiz) return true; return false; }
  registrar(el, via, valor) { if (this.log) this.log.push({ id: el.attrs.id ?? null, tag: el.tag, via, valor }); }
  idx() {
    if (this._idxV !== this.v) {
      const m = new Map();
      const rec = (n) => { for (const f of n.filhos) if (f instanceof Elemento) { if (f.attrs.id && !m.has(f.attrs.id)) m.set(f.attrs.id, f); rec(f); } };
      rec(this.raiz); this._idx = m; this._idxV = this.v;
    }
    return this._idx;
  }
  getElementById(id) { return this.idx().get(id) ?? null; }
  todos(pred) { return this.raiz.todosDentro(pred); }
  querySelectorAll(s) { return this.raiz.querySelectorAll(s); }
  querySelector(s) { return this.raiz.querySelector(s); }
  getElementsByTagName(t) { return this.raiz.getElementsByTagName(t); }
  getElementsByClassName(c) { return this.raiz.getElementsByClassName(c); }
  createElement(t) { return new Elemento(this, t); }
  createElementNS(_, t) { return new Elemento(this, t); }
  createTextNode(s) { const t = new Texto(String(s)); t.doc = this; return t; }
  createDocumentFragment() { return new Elemento(this, 'fragmento'); }
  get documentElement() { return this.raiz.children[0]; }
  get body() { return this.raiz.querySelector('body'); }
  get head() { return this.raiz.querySelector('head'); }
  get readyState() { return 'complete'; }
  get title() { return ''; }
  get activeElement() { return this.body; }
  addEventListener(t, fn) { (this._ouvintes[t] ??= []).push(fn); }
  removeEventListener() {}
  disparar(el, tipo, init = {}) {
    const ev = { type: tipo, target: el, currentTarget: null, bubbles: true, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this._parou = true; }, stopImmediatePropagation() { this._parou = true; }, key: init.key, clientX: 0, clientY: 0, ...init };
    this.propagar(el, ev);
    return ev;
  }
  propagar(el, ev) {
    ev.target ??= el;
    for (let a = el; a && !ev._parou; a = a.pai) {
      if (!(a instanceof Elemento)) break;
      ev.currentTarget = a;
      for (const fn of (a._ouvintes[ev.type] ?? []).slice()) { fn.call(a, ev); if (ev._parou) break; }
      if (['focus', 'blur', 'mouseenter', 'mouseleave'].includes(ev.type)) break;
    }
    if (!ev._parou) for (const fn of (this._ouvintes[ev.type] ?? []).slice()) fn.call(this, ev);
  }
}

/* ============================ instrumentação (acorn) ======================== */

function nomesDeclarados(fn) {
  const nomes = new Set();
  const padrao = (p) => {
    if (!p) return;
    if (p.type === 'Identifier') nomes.add(p.name);
    else if (p.type === 'ObjectPattern') p.properties.forEach((x) => padrao(x.value ?? x.argument));
    else if (p.type === 'ArrayPattern') p.elements.forEach(padrao);
    else if (p.type === 'AssignmentPattern') padrao(p.left);
    else if (p.type === 'RestElement') padrao(p.argument);
  };
  fn.params.forEach(padrao);
  const anda = (n, raiz) => {
    if (!n || typeof n.type !== 'string') return;
    if (!raiz && /^Function/.test(n.type)) { if (n.type === 'FunctionDeclaration' && n.id) nomes.add(n.id.name); return; }
    if (n.type === 'VariableDeclarator') padrao(n.id);
    for (const k of Object.keys(n)) {
      const v = n[k];
      if (Array.isArray(v)) v.forEach((x) => anda(x));
      else if (v && typeof v.type === 'string') anda(v);
    }
  };
  anda(fn.body, true);
  return [...nomes];
}

/** Devolve {codigo, iifes} — código com try/catch em cada IIFE e capturas nas escritas. */
export function instrumentar(codigo) {
  const ast = acorn.parse(codigo, { ecmaVersion: 'latest', locations: true, allowReturnOutsideFunction: true });
  const globais = nomesDeclarados({ params: [], body: ast }); // var/let/const/function do nível do script
  const cacheRef = new Map();
  const referenciados = (fn) => { // identificadores citados dentro da função (inclui as aninhadas)
    if (cacheRef.has(fn)) return cacheRef.get(fn);
    const s = new Set();
    const anda = (n) => { if (!n || typeof n.type !== 'string') return; if (n.type === 'Identifier') s.add(n.name); for (const k of Object.keys(n)) { if (k === 'loc') continue; const v = n[k]; if (Array.isArray(v)) v.forEach(anda); else if (v && typeof v.type === 'string') anda(v); } };
    anda(fn.body); cacheRef.set(fn, s); return s;
  };
  const edicoes = []; // {pos, texto, ordem}
  const iifes = [];
  let ordem = 0;
  const ehIife = (n) => n.type === 'ExpressionStatement' && (() => {
    let e = n.expression;
    if (e.type === 'UnaryExpression') e = e.argument;
    return e.type === 'CallExpression' && /^(Function|Arrow)/.test((e.callee.type === 'MemberExpression' ? e.callee.object : e.callee).type);
  })();

  const visita = (n, pilhaFn, pilhaIife, paiNo) => {
    if (!n || typeof n.type !== 'string') return;
    let pf = pilhaFn, pi = pilhaIife;
    if (ehIife(n)) {
      const info = { id: iifes.length, ini: n.loc.start.line, fim: n.loc.end.line, ids: new Set(), pai: pilhaIife[pilhaIife.length - 1] ?? null };
      iifes.push(info);
      edicoes.push({ pos: n.start, texto: `try{`, ordem: ordem++ });
      edicoes.push({ pos: n.end, texto: `}catch(__e){__erro(${info.id},__e)}`, ordem: ordem++ });
      pi = [...pilhaIife, info.id];
    }
    if (/^Function|^Arrow/.test(n.type)) pf = [...pilhaFn, n];
    // literais string → ids candidatos da IIFE corrente (e das ancestrais)
    if (n.type === 'Literal' && typeof n.value === 'string' && n.value.length < 60 && /^[\w-]+$/.test(n.value))
      for (const iid of pi) iifes[iid].ids.add(n.value);
    // escrita de saída dentro de função → instantâneo de escopo
    if (n.type === 'ExpressionStatement' && pf.length && n.expression.type === 'AssignmentExpression'
      && n.expression.left.type === 'MemberExpression' && !n.expression.left.computed
      && ['innerHTML', 'textContent'].includes(n.expression.left.property.name)
      && ['BlockStatement', 'Program', 'SwitchCase', 'IfStatement', 'ForStatement', 'ForInStatement', 'WhileStatement'].includes(paiNo?.type)) {
      const nomes = [...new Set([...[...pf].reverse().flatMap(nomesDeclarados), ...globais.filter((g) => referenciados(pf[0]).has(g))])].filter((x) => !/^__/.test(x) && x !== 'arguments');
      const thunks = nomes.map((x) => `[${JSON.stringify(x)},()=>${x}]`).join(',');
      const iid = pi.length ? pi[pi.length - 1] : -1;
      const alvoSrc = codigo.slice(n.expression.left.object.start, n.expression.left.object.end).replace(/\s+/g, ' ');
      const alvo = `()=>{try{var __o=(${alvoSrc});return __o&&__o.id||null}catch(e){return null}}`;
      edicoes.push({ pos: n.start, texto: `{__snap(${iid},${n.loc.start.line},[${thunks}],${alvo});`, ordem: ordem++ });
      edicoes.push({ pos: n.end, texto: `}`, ordem: ordem++ });
    }
    for (const k of Object.keys(n)) {
      const v = n[k];
      if (k === 'loc') continue;
      if (Array.isArray(v)) v.forEach((x) => visita(x, pf, pi, n));
      else if (v && typeof v.type === 'string') visita(v, pf, pi, n);
    }
  };
  visita(ast, [], [], null);
  // aplica de trás para frente (mesmo pos: fechamento antes de abertura)
  edicoes.sort((a, b) => b.pos - a.pos || b.ordem - a.ordem);
  let out = codigo;
  for (const e of edicoes) out = out.slice(0, e.pos) + e.texto + out.slice(e.pos);
  return { codigo: out, iifes };
}

/* ============================== carregamento ================================ */

const cacheHtml = new Map();

function limparValor(v, prof = 0) {
  if (v == null) return undefined;
  if (typeof v === 'number') return Number.isFinite(v) ? v : undefined;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v.length <= 80 ? v : undefined;
  if (typeof v === 'function' || v instanceof Elemento) return undefined;
  if (prof >= 3) return undefined;
  if (Array.isArray(v)) {
    if (v.length > 400) return undefined;
    const r = v.map((x) => limparValor(x, prof + 1));
    return r.some((x) => x !== undefined) ? r : undefined;
  }
  if (typeof v === 'object') {
    const ks = Object.keys(v);
    if (ks.length > 60) return undefined;
    const o = {};
    for (const k of ks) { const x = limparValor(v[k], prof + 1); if (x !== undefined) o[k] = x; }
    return Object.keys(o).length ? o : undefined;
  }
  return undefined;
}

/**
 * Carrega o módulo n e roda os scripts. Devolve a interface de controle.
 * opcoes.instrumentar=false desliga as capturas (mais rápido).
 */
export function carregarModulo(n, opcoes = {}) {
  const arq = arquivoHtml(n);
  let base = cacheHtml.get(n);
  if (!base) {
    const html = fs.readFileSync(arq, 'utf8');
    const scripts = [];
    const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
    let m;
    while ((m = re.exec(html))) {
      if (/src=/.test(m[1])) continue;
      const linhaIni = html.slice(0, m.index + m[0].indexOf('>') + 1).split('\n').length;
      const inst = instrumentar(m[2]);
      scripts.push({ linhaIni, orig: m[2], ...inst });
    }
    const semScripts = html.replace(/<script[\s\S]*?<\/script>/g, (s) => s.replace(/[^\n]/g, ''));
    base = { html, scripts, semScripts };
    cacheHtml.set(n, base);
  }
  const doc = new Documento();
  const raiz = new Elemento(doc, 'fragmento');
  const filhos = parseFragmento(base.semScripts.replace(/<!doctype[^>]*>/i, ''), doc, false);
  filhos.forEach((f) => { f.pai = raiz; raiz.filhos.push(f); });
  doc.atribuir(raiz);
  // estático: texto do markup ANTES de qualquer script
  const estatico = new Map();
  doc.idx().forEach((el, id) => estatico.set(id, { texto: el.textContent.replace(/\s+/g, ' ').trim(), html: el.innerHTML }));

  const erros = [];
  const capturas = []; // {iife, linha, vars}
  const timers = [];
  const local = new Map();
  const janela = {};
  const ctx = vm.createContext(janela);
  Object.assign(janela, {
    window: janela, self: janela, globalThis: janela, document: doc, console: { log() {}, warn() {}, error() {}, info() {}, debug() {} },
    navigator: { userAgent: 'mini-dom', language: 'pt-BR', clipboard: { writeText: async () => {} } },
    location: { href: 'file:///modulo.html', hash: '', search: '', pathname: '/', origin: 'file://' },
    history: { replaceState() {}, pushState() {} },
    localStorage: { getItem: (k) => local.get(k) ?? null, setItem: (k, v) => local.set(k, String(v)), removeItem: (k) => local.delete(k) },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    innerWidth: 1440, innerHeight: 900, devicePixelRatio: 1, scrollY: 0, scrollX: 0, pageYOffset: 0,
    addEventListener: (t, fn) => { (doc._ouvintes[t] ??= []).push(fn); }, removeEventListener() {},
    dispatchEvent() {}, scrollTo() {}, scroll() {}, open() {}, print() {}, alert() {}, confirm: () => true, prompt: () => null,
    getComputedStyle: () => new Proxy({}, { get: (_, k) => (k === 'getPropertyValue' ? () => '' : '') }),
    matchMedia: () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }),
    IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
    ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
    MutationObserver: class { observe() {} disconnect() {} },
    requestAnimationFrame: (fn) => { timers.push(fn); return timers.length; }, cancelAnimationFrame() {},
    setTimeout: (fn) => { timers.push(fn); return timers.length; }, clearTimeout() {},
    setInterval: () => 0, clearInterval() {},
    CustomEvent: class { constructor(t, i) { this.type = t; this.detail = i?.detail; } },
    Event: class { constructor(t) { this.type = t; } },
    Element: Elemento, HTMLElement: Elemento, Node: No,
    __erro: (id, e) => erros.push({ iife: id, msg: String(e && e.message || e), linha: (String(e && e.stack || '').match(/modulo\d+\.html:(\d+)/) || [])[1] ?? null }),
    __snap: (iife, linha, pares, alvoFn) => {
      if (opcoes.instrumentar === false) return;
      const vars = {};
      for (const [nome, th] of pares) { try { const v = limparValor(th()); if (v !== undefined) vars[nome] = v; } catch { /* fora de escopo / TDZ */ } }
      let alvo = null; try { alvo = alvoFn ? alvoFn() : null; } catch { /* sem alvo */ }
      capturas.push({ iife, linha, alvo, vars });
    },
  });

  const rodarTimers = () => { for (let k = 0; k < 20 && timers.length; k++) { const t = timers.splice(0); for (const fn of t) { try { fn(); } catch (e) { erros.push({ iife: null, msg: 'timer: ' + e.message }); } } } };

  const iifesGlobais = [];
  base.scripts.forEach((s, si) => {
    const off = iifesGlobais.length;
    s.iifes.forEach((i) => iifesGlobais.push({ ...i, script: si, ini: i.ini + s.linhaIni - 1, fim: i.fim + s.linhaIni - 1, id: off + i.id, pai: i.pai == null ? null : off + i.pai }));
    // __erro/__snap recebem o id local; reescreve para global
    const cod = s.codigo.replace(/__erro\((\d+),/g, (_, d) => `__erro(${+d + off},`).replace(/__snap\((-?\d+),(\d+),/g, (_, d, l) => `__snap(${+d < 0 ? -1 : +d + off},${+l + s.linhaIni - 1},`);
    try {
      vm.runInContext(cod, ctx, { filename: `modulo${String(n).padStart(2, '0')}.html`, lineOffset: s.linhaIni - 1 });
    } catch (e) { erros.push({ iife: null, msg: 'script ' + si + ': ' + e.message }); }
  });
  rodarTimers();
  for (const f of (doc._ouvintes.DOMContentLoaded ?? []).slice()) { try { f({ type: 'DOMContentLoaded' }); } catch (e) { erros.push({ iife: null, msg: 'DOMContentLoaded: ' + e.message }); } }
  for (const f of (doc._ouvintes.load ?? []).slice()) { try { f({ type: 'load' }); } catch (e) { erros.push({ iife: null, msg: 'load: ' + e.message }); } }
  rodarTimers();

  const api = {
    n, arquivo: arq, doc, erros, capturas, estatico, iifes: iifesGlobais,
    el: (id) => doc.getElementById(id),
    texto: (id) => { const e = doc.getElementById(id); return e ? e.textContent.replace(/\s+/g, ' ').trim() : null; },
    html: (id) => { const e = doc.getElementById(id); return e ? e.innerHTML : null; },
    disparar: (idOuEl, tipo, init) => {
      const e = typeof idOuEl === 'string' ? doc.getElementById(idOuEl) : idOuEl;
      if (!e) return null;
      const n0 = erros.length;
      try { doc.disparar(e, tipo, init); } catch (x) { erros.push({ iife: null, msg: `evento ${tipo}: ${x.message}` }); }
      rodarTimers();
      return erros.length === n0;
    },
    ultimasCapturas: (iifeId) => capturas.filter((c) => c.iife === iifeId),
    zerarCapturas: () => { capturas.length = 0; },
    registrar: (fn) => { doc.log = fn === null ? null : []; return doc.log; },
    iifeDe: (linha) => iifesGlobais.filter((i) => i.ini <= linha && linha <= i.fim).sort((a, b) => (a.fim - a.ini) - (b.fim - b.ini))[0] ?? null,
  };
  return api;
}

export { Elemento };
