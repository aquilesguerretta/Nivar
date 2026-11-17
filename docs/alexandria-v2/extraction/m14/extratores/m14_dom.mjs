// DOM simulado minimo para executar o <script> ORIGINAL do M14 sem alterar
// uma linha dele (protocolo §10: execucao do script original em DOM simulado).
// So implementa o que o script usa: getElementById, querySelector(All) de
// botoes, classList, atributos, value, textContent, innerHTML e eventos.
import { ROOT, html, findAll, texto, inner } from './m14_lib.mjs';

class El {
  constructor(tag, attrs = {}, text = '') {
    this.tagName = tag;
    this.attrs = { ...attrs };
    this.className = attrs.class || '';
    this.value = attrs.value ?? '';
    this._text = text;
    this._last = 'markup';
    this._inner = '';
    this.kids = [];
    this.listeners = {};
    this.style = {};
  }
  get classList() {
    const self = this;
    const set = () => new Set(self.className.split(/\s+/).filter(Boolean));
    return {
      add(c) { const s = set(); s.add(c); self.className = [...s].join(' '); },
      remove(...cs) { const s = set(); cs.forEach((c) => s.delete(c)); self.className = [...s].join(' '); },
      contains(c) { return set().has(c); },
    };
  }
  getAttribute(n) { return n === 'class' ? this.className : (this.attrs[n] ?? null); }
  setAttribute(n, v) { this.attrs[n] = String(v); }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
  fire(t) { (this.listeners[t] || []).forEach((f) => f({ target: this })); }
  get textContent() { return this._text; }
  set textContent(t) { this._text = String(t); this._last = 'textContent'; }
  set innerHTML(h) {
    this._inner = h;
    this._last = 'innerHTML';
    // botoes gerados pelo script (chips)
    this.kids = [...String(h).matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/g)].map((m) => {
      const attrs = {};
      for (const a of m[1].matchAll(/([a-zA-Z-]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
      return new El('button', attrs, texto(m[2]));
    });
  }
  get innerHTML() { return this._inner; }
  querySelectorAll(s) {
    if (s === 'button') return this.kids.filter((k) => k.tagName === 'button');
    return [];
  }
  querySelector(s) {
    if (s === 'button.on') return this.kids.find((k) => k.tagName === 'button' && k.classList.contains('on')) || null;
    return null;
  }
}

export function montaDocumento() {
  const byId = new Map();
  for (const n of findAll(ROOT, (c) => c.attrs?.id)) {
    const el = new El(n.tag, n.attrs, texto(inner(n)));
    el._inner = inner(n);
    el._last = 'markup';
    // botoes estaticos do markup (grupos seg)
    el.kids = findAll(n, (c) => c.tag === 'button').map((b) => new El('button', b.attrs, texto(inner(b))));
    byId.set(n.attrs.id, el);
  }
  const document = {
    getElementById: (id) => byId.get(id) || null,
    querySelectorAll: () => [],
    querySelector: () => null,
    documentElement: { scrollHeight: 0, clientHeight: 0, scrollTop: 0 },
    body: { scrollTop: 0 },
  };
  const window = { addEventListener() {} };
  return { document, window, byId };
}

export const SCRIPT = html.slice(html.indexOf('<script>') + '<script>'.length, html.indexOf('</script>'));

export function executa() {
  const env = montaDocumento();
  // eslint-disable-next-line no-new-func
  new Function('document', 'window', SCRIPT)(env.document, env.window);
  return env;
}

// estado observavel de uma lista de ids
export function estado(env, ids) {
  const o = {};
  for (const id of ids) {
    const el = env.byId.get(id);
    if (!el) { o[id] = null; continue; }
    const valor = el._last === 'innerHTML' ? el._inner : el._last === 'textContent' ? el._text : texto(el._inner);
    o[id] = { via: el._last, valor, classe: el.className || null };
  }
  return o;
}
export function clica(env, grupoId, attr, valor) {
  const g = env.byId.get(grupoId);
  const b = g.kids.find((k) => k.getAttribute(attr) === valor);
  if (!b) throw new Error(`botao ${grupoId}[${attr}=${valor}]`);
  b.fire('click');
}
export function digita(env, numId, valor) {
  const n = env.byId.get(numId);
  n.value = String(valor);
  n.fire('input');
}
