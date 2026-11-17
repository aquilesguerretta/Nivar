// Execucao do <script> ORIGINAL do M07 em DOM simulado (protocolo §10: metodo mais forte).
// Nada do script e reescrito: ele roda como esta, contra elementos falsos que registram
// innerHTML/textContent/className/listeners. Os ids e os atributos de <input> vem do markup.
import { html, SCRIPT_START, script } from './m07_lib.mjs';

class El {
  constructor(id, attrs = {}, doc) {
    this.id = id; this.attrs = attrs; this.doc = doc;
    this._html = ''; this.textContent_ = ''; this.className = attrs.class || '';
    this.value = attrs.value ?? ''; this.min = attrs.min ?? ''; this.max = attrs.max ?? '';
    this.listeners = {}; this.style = {}; this._kids = null; this._kidsFor = null; this.checked = false;
  }
  get innerHTML() { return this._html; }
  set innerHTML(v) { this._html = String(v); this.textContent_ = null; }
  get textContent() { return this.textContent_ ?? this._html.replace(/<[^>]+>/g, ''); }
  set textContent(v) { this.textContent_ = String(v); this._html = String(v); }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  scrollIntoView() {}
  fire(t) { for (const f of this.listeners[t] || []) f.call(this, {}); }
  querySelectorAll(sel) {
    if (this.staticKids && sel === 'button') return this.staticKids;
    const cls = sel.replace(/^\./, '');
    if (this._kidsFor !== this._html) {
      const re = new RegExp(`<button class="${cls}[^"]*"([^>]*)>`, 'g');
      const kids = []; let m;
      while ((m = re.exec(this._html))) {
        const a = {}; for (const mm of m[1].matchAll(/([\w-]+)="([^"]*)"/g)) a[mm[1]] = mm[2];
        kids.push(new El(null, a, this.doc));
      }
      this._kids = kids; this._kidsFor = this._html;
    }
    return this._kids;
  }
}

export function runSim() {
  const body = html.slice(0, SCRIPT_START);
  const els = new Map();
  const doc = {
    getElementById(id) {
      if (els.has(id)) return els.get(id);
      // ids criados dinamicamente pelo quiz (q-*, o-*, f-*)
      if (/^(q-\d+|o-\d+-\d+|f-\d+)$/.test(id)) { const e = new El(id, {}, doc); els.set(id, e); return e; }
      return null;
    },
    querySelectorAll() { return []; },
    querySelector(sel) { return doc._quizPick ? doc._quizPick(sel) : null; },
    documentElement: { scrollHeight: 1000, clientHeight: 500, scrollTop: 0 },
    body: { scrollTop: 0 },
  };
  for (const m of body.matchAll(/<(\w+)([^>]*?)\sid="([^"]+)"([^>]*)>/g)) {
    const a = {}; for (const mm of (m[2] + ' ' + m[4]).matchAll(/([\w-]+)="([^"]*)"/g)) a[mm[1]] = mm[2];
    const e = new El(m[3], a, doc); e.tag = m[1];
    els.set(m[3], e);
  }
  // botoes estaticos do seletor de fluxo do Inst 01
  const segAt = body.indexOf('id="i1-seg"');
  const segHtml = body.slice(segAt, body.indexOf('</div>', segAt));
  els.get('i1-seg').staticKids = [...segHtml.matchAll(/<button data-f="(\w+)"( class="on")?>([^<]*)<\/button>/g)]
    .map((m) => { const e = new El(null, { 'data-f': m[1], class: m[2] ? 'on' : '' }, doc); e.label = m[3]; return e; });
  const win = { addEventListener() {} };
  new Function('document', 'window', script)(doc, win);
  return { doc, els, $: (id) => els.get(id) };
}

// estado de um explorador para cada item (clique real no chip gerado pelo script)
export function clickAll(sim, hostId, cls, targets) {
  const host = sim.$(hostId);
  const kids = host.querySelectorAll(cls);
  return kids.map((k, i) => {
    k.fire('click');
    const out = {};
    for (const t of targets) out[t] = sim.$(t).innerHTML;
    return { indice: i, ...out };
  });
}
