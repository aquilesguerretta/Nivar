// DOM simulado mínimo para executar o <script> ORIGINAL do M12 sem alteração
// (§10 do protocolo: "execução do script original em DOM simulado").
// Suporta só o que o script usa: getElementById, innerHTML/textContent,
// botões (querySelector('button.on'), querySelectorAll('button')), eventos.
import { html, SCRIPT, balanced } from './m12_lib.mjs';

const attrsOf = (s) => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const escT = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

class ClassList {
  constructor(el, init) { this.el = el; this.s = new Set((init || '').split(/\s+/).filter(Boolean)); }
  add(...c) { c.forEach((x) => this.s.add(x)); }
  remove(...c) { c.forEach((x) => this.s.delete(x)); }
  contains(c) { return this.s.has(c); }
}
class El {
  constructor(id, tag = 'div', attrs = {}, inner = '') {
    this.id = id; this.tag = tag; this.attrs = attrs; this.handlers = {};
    this.classList = new ClassList(this, attrs.class);
    this.style = {}; this.value = attrs.value ?? '';
    this._buttons = null; this._html = inner; this.sets = 0;
  }
  get className() { return [...this.classList.s].join(' '); }
  set className(v) { this.classList = new ClassList(this, v); }
  getAttribute(n) { return n === 'class' ? this.className : (this.attrs[n] ?? null); }
  addEventListener(t, fn) { (this.handlers[t] ||= []).push(fn); }
  fire(t) { (this.handlers[t] || []).forEach((f) => f.call(this, { target: this })); }
  get innerHTML() { return this._html; }
  set innerHTML(v) { this._html = String(v); this._buttons = null; this.sets++; }
  get textContent() { return this._html.replace(/<[^>]+>/g, ''); }
  set textContent(v) { this._html = escT(v); this._buttons = null; this.sets++; }
  buttons() {
    if (!this._buttons) {
      this._buttons = [...this._html.matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/g)]
        .map((m) => new El(null, 'button', attrsOf(m[1]), m[2]));
    }
    return this._buttons;
  }
  querySelector(sel) {
    if (sel === 'button.on') return this.buttons().find((b) => b.classList.contains('on')) || null;
    throw new Error('querySelector não suportado: ' + sel);
  }
  querySelectorAll(sel) {
    if (sel === 'button') return this.buttons();
    return [];
  }
}

export function runOriginal() {
  const reg = new Map();
  // pré-popula todo elemento com id do markup (antes do <script>)
  const body = html.slice(0, html.indexOf('<script>'));
  for (const m of body.matchAll(/<(div|button|input|span|section)\b([^>]*\bid="([^"]+)"[^>]*)>/g)) {
    const idx = m.index; const tag = m[1]; const attrs = attrsOf(m[2]);
    let inner = '';
    if (tag !== 'input') {
      const end = balanced(idx, tag);
      inner = html.slice(idx + m[0].length, end - `</${tag}>`.length);
    }
    reg.set(m[3], new El(m[3], tag, attrs, inner));
  }
  const get = (id) => { if (!reg.has(id)) reg.set(id, new El(id)); return reg.get(id); };
  const document = {
    getElementById: get,
    querySelectorAll: () => [],
    querySelector: () => null,
    documentElement: { scrollHeight: 1000, clientHeight: 500, scrollTop: 0 },
    body: { scrollTop: 0 },
  };
  const window = { addEventListener() {} };
  new Function('document', 'window', SCRIPT)(document, window);
  const api = {
    reg, get,
    click(btn) { btn.fire('click'); },
    /** clica o botão cujo atributo `attr` vale `v` dentro do elemento `wrapId` */
    pick(wrapId, attr, v) {
      const b = get(wrapId).buttons().find((x) => x.getAttribute(attr) === String(v));
      if (!b) throw new Error(`botão ${attr}=${v} em ${wrapId}`);
      b.fire('click');
    },
    setNum(id, v) { const e = get(id); e.value = String(v); e.fire('input'); },
    out(id) { return get(id).innerHTML; },
  };
  return api;
}
