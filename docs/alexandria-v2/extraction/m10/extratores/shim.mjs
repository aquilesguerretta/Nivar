// DOM simulado mínimo para executar o <script> ORIGINAL do M10 sem
// reescrever nenhuma linha dele (protocolo §10: execução em DOM simulado).
// Só as APIs que o script usa: getElementById, value, getAttribute,
// addEventListener, classList, className, innerHTML, textContent, style,
// querySelector('button.on'), querySelectorAll('button').
import { doc, walk, SCRIPT, hasClass } from './lib.mjs';

class El {
  constructor(node, attrs) {
    this.node = node || null;
    this.attrs = { ...(node ? node.attrs : attrs || {}) };
    this._value = this.attrs.value ?? '';
    this.listeners = {};
    this.cls = new Set((this.attrs.class || '').split(/\s+/).filter(Boolean));
    this._html = '';
    this._text = '';
    this.style = {};
    this._btns = null; // botões estáticos (segmentados)
    this._dyn = null; // botões gerados por innerHTML
  }
  get value() { return this._value; }
  set value(v) { this._value = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
  fire(t) { for (const f of (this.listeners[t] || []).slice()) f({ target: this }); }
  get classList() {
    const s = this.cls;
    return { add: (...c) => c.forEach((x) => s.add(x)), remove: (...c) => c.forEach((x) => s.delete(x)), contains: (c) => s.has(c) };
  }
  get className() { return [...this.cls].join(' '); }
  set className(v) { this.cls = new Set(String(v).split(/\s+/).filter(Boolean)); }
  get innerHTML() { return this._html; }
  set innerHTML(v) { this._html = String(v); this._dyn = null; }
  get textContent() { return this._text; }
  set textContent(v) { this._text = String(v); }
  querySelectorAll(sel) {
    if (sel === 'button') {
      if (this._btns && this._btns.length) return this._btns;
      if (!this._dyn) {
        this._dyn = [...this._html.matchAll(/<button[^>]*?data-k="([^"]*)"/g)].map((m) => new El(null, { 'data-k': m[1] }));
      }
      return this._dyn;
    }
    return [];
  }
  querySelector(sel) {
    if (sel === 'button.on') return (this._btns || []).find((b) => b.cls.has('on')) || null;
    return null;
  }
}

export function runtime({ quizAnswers = null } = {}) {
  const els = {};
  walk(doc, (n) => {
    if (n.attrs && n.attrs.id) {
      const e = new El(n);
      els[n.attrs.id] = e;
      if (hasClass(n, 'seg')) {
        e._btns = n.children.filter((c) => c.tag === 'button').map((c) => new El(c));
      }
    }
  });
  const document = {
    getElementById: (id) => {
      if (els[id]) return els[id];
      if (/^fb-\d+$/.test(id)) { els[id] = new El(null, { id }); return els[id]; }
      return null;
    },
    querySelectorAll: () => [],
    querySelector: (sel) => {
      const m = /^input\[name="q(\d+)"\]:checked$/.exec(sel);
      if (m && quizAnswers && quizAnswers[+m[1]] != null) return { value: String(quizAnswers[+m[1]]) };
      return null;
    },
    documentElement: { scrollHeight: 1000, clientHeight: 500, scrollTop: 0 },
    body: { scrollTop: 0 },
  };
  const window = { addEventListener() {} };
  // eslint-disable-next-line no-new-func
  new Function('document', 'window', SCRIPT)(document, window);

  const api = {
    els,
    set(id, v) { const e = els[id]; e.value = v; e.fire('input'); },
    seg(id, attr, val) {
      const b = els[id]._btns.find((x) => x.getAttribute(attr) === val);
      if (!b) throw new Error(`seg ${id} sem ${attr}=${val}`);
      b.fire('click');
    },
    chip(gridId, k) {
      const b = els[gridId].querySelectorAll('button').find((x) => x.getAttribute('data-k') === k);
      if (!b) throw new Error(`chip ${gridId} sem ${k}`);
      b.fire('click');
    },
    text: (id) => els[id].textContent,
    htmlOf: (id) => els[id].innerHTML,
    cls: (id) => els[id].className,
  };
  return api;
}
