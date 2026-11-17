// Biblioteca comum dos extratores do M09. Só lê a fonte; nada de conteúdo é digitado aqui.
// Três peças:
//   1. leitura por linha + parser de blocos (o HTML do M09 tem um elemento por linha);
//   2. extração de literais JS do <script> por casamento de colchetes, avaliados com vm (só dados);
//   3. DOM simulado mínimo para EXECUTAR o script original (protocolo §10, "método mais forte").
import fs from 'node:fs';
import vm from 'node:vm';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo09.html';
export const REPO = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = `${REPO}/docs/alexandria-v2/extraction/m09`;
export const CODE = {
  conteudo: `${REPO}/src/lib/data/alexandria-modulo-09-content.ts`,
  curriculo: `${REPO}/src/lib/data/alexandria-curriculo.ts`,
  trilhas: `${REPO}/src/lib/data/alexandria-trilhas.ts`,
  glossario: `${REPO}/src/lib/data/alexandria-glossario.ts`,
  calculadoras: `${REPO}/src/lib/data/alexandria-instrument-calculators.ts`,
  badges: `${REPO}/src/lib/data/alexandria-badges.ts`,
  blocos: `${REPO}/src/lib/data/alexandria-blocks.ts`,
  recursos: `${REPO}/src/components/alexandria/navigation/RecursosDoModulo.tsx`,
};
export const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';

export const RAW = fs.readFileSync(SRC, 'utf8');
export const L = RAW.split('\n');
export const ln = (n) => L[n - 1];
export const fail = (m) => { throw new Error(m); };
export const lineOfIdx = (idx) => RAW.slice(0, idx).split('\n').length;

export const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, '\u00a0').replace(/&amp;/g, '&');
export const strip = (h) => decode(String(h).replace(/<\/?[a-zA-Z][^>]*>/g, '')).replace(/\s+/g, ' ').trim();
export const txt = (html) => ({ html, texto: strip(html) });
export const trecho = (s) => strip(s).slice(0, 70);
export const origem = (n, seletor, html) => ({ seletor, trecho_inicial: trecho(html ?? ln(n)), linha_aprox: n });
export const pad = (n) => String(n).padStart(2, '0');

export function at(n, re, g = 1) {
  const m = ln(n).match(re);
  if (!m) fail(`linha ${n} não casa ${re}: ${ln(n)}`);
  return m[g];
}
export const attrs = (tagText) => Object.fromEntries([...tagText.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

// ── seções ───────────────────────────────────────────────────
export function secoes() {
  const out = [];
  L.forEach((line, i) => {
    const m = line.match(/^<section id="([^"]+)">/);
    if (!m) return;
    const ini = i + 1;
    let fim = ini;
    while (!/^<\/section>/.test(ln(fim))) fim++;
    const secIdLine = ini + 2;
    const sid = at(secIdLine, /<div class="sec-id">(.*)<\/div>/);
    const sm = sid.match(/^<b>(.*?)<\/b> · (.*)$/);
    const h2n = ini + 3;
    const ledeN = ini + 4;
    out.push({
      id_html: m[1], ini, fim,
      sec_id_html: sid, marcador: sm[1], rotulo: sm[2], sec_id_linha: secIdLine,
      h2: at(h2n, /<h2>(.*)<\/h2>/), h2_linha: h2n,
      lede: /<p class="lede">/.test(ln(ledeN)) ? at(ledeN, /<p class="lede">(.*)<\/p>/) : null, lede_linha: ledeN,
    });
  });
  return out;
}

// fim de um <div ...> aberto na linha n (conta aberturas/fechamentos)
export function fimDiv(n) {
  let d = 0;
  for (let k = n; k <= L.length; k++) {
    const s = ln(k);
    d += (s.match(/<div\b/g) || []).length;
    d -= (s.match(/<\/div>/g) || []).length;
    if (d <= 0) return k;
  }
  fail('div sem fim ' + n);
}

// ── parser genérico de blocos num intervalo de linhas ────────
// Devolve blocos na ordem da fonte. Instrumentos viram marcador (conteúdo no grupo instrumentos).
export function blocos(a, b, ctx) {
  const out = [];
  let k = a;
  const P = (n) => ln(n).trim();
  while (k <= b) {
    const s = P(k);
    let m;
    if (!s || /^<\/?(div class="wrap"|section|p style|footer)/.test(s)) { k++; continue; }
    if ((m = s.match(/^<p class="lede">(.*)<\/p>$/))) { out.push({ tipo: 'lede', ...txt(m[1]), origem: origem(k, `${ctx} p.lede`) }); k++; continue; }
    if ((m = s.match(/^<p>(.*)<\/p>$/))) { out.push({ tipo: 'paragrafo', ...txt(m[1]), origem: origem(k, `${ctx} > p`) }); k++; continue; }
    if ((m = s.match(/^<h3><span class="num">(.*?)<\/span> (.*)<\/h3>$/))) { out.push({ tipo: 'titulo', numero: m[1], texto: m[2], origem: origem(k, `${ctx} h3`) }); k++; continue; }
    if ((m = s.match(/^<div class="box ([^"]*)"(?: style="[^"]*")?>$/))) {
      const f = fimDiv(k);
      const tagm = P(k + 1).match(/^<span class="tag"(?: style="[^"]*")?>(.*)<\/span>$/) || fail('box sem tag ' + k);
      const ps = [];
      for (let j = k + 2; j < f; j++) ps.push({ ...txt(at(j, /^\s*<p>(.*)<\/p>$/)), linha_aprox: j });
      out.push({ tipo: 'destaque', classe: `box ${m[1]}`, rotulo: tagm[1], paragrafos: ps, origem: origem(k, `${ctx} .box.${m[1].split(' ')[0]}`, tagm[1]) });
      k = f + 1; continue;
    }
    if (/^<div class="scroll">$/.test(s)) {
      const f = fimDiv(k);
      const head = [...ln(k + 2).matchAll(/<th>(.*?)<\/th>/g)].map((x) => x[1]);
      const rows = [];
      for (let j = k + 4; j < f; j++) {
        if (!/<tr>/.test(ln(j))) continue;
        rows.push({ celulas: [...ln(j).matchAll(/<td>(.*?)<\/td>/g)].map((x) => txt(x[1])), linha_aprox: j });
      }
      out.push({ tipo: 'tabela', cabecalho: head, linhas: rows, origem: origem(k + 2, `${ctx} table.tbl thead`, head[0]) });
      k = f + 1; continue;
    }
    if ((m = s.match(/^<(ol|ul) class="([^"]*)">$/))) {
      const tag = m[1];
      const itens = [];
      let j = k + 1;
      for (; !new RegExp(`^\\s*</${tag}>`).test(ln(j)); j++) itens.push({ ...txt(at(j, /^\s*<li>(.*)<\/li>$/)), linha_aprox: j });
      out.push({ tipo: 'lista', ordenada: tag === 'ol', classe: m[2], itens, origem: origem(k, `${ctx} ${tag}.${m[2]}`, itens[0].html) });
      k = j + 1; continue;
    }
    if (/^<div class="inst">$/.test(s)) {
      const f = fimDiv(k);
      out.push({ tipo: 'instrumento_ref', inst_id: at(k + 2, /<span class="id">(.*)<\/span>/), nome: at(k + 3, /<span class="nm">(.*)<\/span>/), linhas: [k, f], origem: origem(k + 2, `${ctx} .inst .inst-hd`) });
      k = f + 1; continue;
    }
    if ((m = s.match(/^<div class="out"(?: style="[^"]*")?>$/))) {
      const f = fimDiv(k);
      const cards = [];
      for (let j = k + 1; j < f; j++) {
        const c = ln(j).match(/<div class="ocard ?([^"]*)"><span class="ok2">(.*?)<\/span>(.*)<\/div>$/) || fail('ocard ' + j);
        cards.push({ classe: c[1] || null, rotulo: c[2], ...txt(c[3]), linha_aprox: j });
      }
      out.push({ tipo: 'cartoes', cartoes: cards, origem: origem(k, `${ctx} div.out .ocard`, cards[0].html) });
      k = f + 1; continue;
    }
    if (/^<div class="lv" id="/.test(s)) {
      const f = fimDiv(k);
      out.push({ tipo: 'tres_niveis_ref', id_html: attrs(s).id, rotulo: at(k + 1, /<div class="lv-hd">(.*)<\/div>/), linhas: [k, f], origem: origem(k + 1, `${ctx} .lv`) });
      k = f + 1; continue;
    }
    if (/^<div class="fi">$/.test(s)) {
      const f = fimDiv(k);
      out.push({ tipo: 'ficha_ref', rotulo: at(k + 1, /<span class="sg">(.*?)<\/span>/), linhas: [k, f], origem: origem(k + 1, `${ctx} .fi`) });
      k = f + 1; continue;
    }
    if ((m = s.match(/^<details( open)?><summary>(.*)<\/summary><div class="det-bd">$/))) {
      const ps = [];
      let j = k + 1;
      for (; !/^\s*<\/div><\/details>/.test(ln(j)); j++) ps.push({ html: at(j, /^\s*<p>(.*)<\/p>$/), linha_aprox: j });
      out.push({ tipo: 'details', aberto: !!m[1], resumo: txt(m[2]), corpo: ps.map((p) => ({ ...txt(p.html), linha_aprox: p.linha_aprox })), origem: origem(k, `${ctx} details > summary`, m[2]) });
      k = j + 1; continue;
    }
    if (/^<div id="quiz-box"><\/div>$|^<button class="btn/.test(s) || /^<div class="score"/.test(s)) {
      out.push({ tipo: 'controle_quiz', html: s, origem: origem(k, `${ctx} ${s.slice(1, 30)}`) });
      k++; continue;
    }
    if (/^<\/div>$/.test(s)) { k++; continue; }
    fail(`linha ${k} não reconhecida: ${s.slice(0, 80)}`);
  }
  return out;
}

// ── literais do script ───────────────────────────────────────
export const SCRIPT_INI = L.findIndex((x) => x === '<script>') + 1;
export const SCRIPT_FIM = L.findIndex((x) => x === '</script>') + 1;
export const SCRIPT = L.slice(SCRIPT_INI, SCRIPT_FIM - 1).join('\n');

// intervalo de linhas de um bloco IIFE do script, pelo comentário-cabeçalho
export function blocoScript(rotulo) {
  const i = L.findIndex((x) => x.startsWith('/* =====') && x.includes(rotulo));
  if (i < 0) fail('bloco de script ' + rotulo);
  let j = i + 1;
  while (j < L.length && !L[j].startsWith('/* =====') && L[j] !== '</script>') j++;
  return { ini: i + 1, fim: j };
}

// casa colchetes a partir de um índice absoluto em RAW, respeitando strings
function casar(idx) {
  const abre = RAW[idx];
  const fecha = abre === '{' ? '}' : ']';
  let d = 0, q = null;
  for (let k = idx; k < RAW.length; k++) {
    const c = RAW[k];
    if (q) { if (c === '\\') { k++; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"') { q = c; continue; }
    if (c === '{' || c === '[') d++;
    if (c === '}' || c === ']') { d--; if (d === 0) return k; }
  }
  fail('sem fecho ' + idx);
}

// `var NAME=` dentro do bloco (primeira ocorrência); devolve valor, fonte e linhas
export function literal(rotuloBloco, nome) {
  const b = blocoScript(rotuloBloco);
  const iniIdx = L.slice(0, b.ini - 1).join('\n').length + 1;
  const re = new RegExp(`var ${nome}\\s*=\\s*`, 'g');
  re.lastIndex = iniIdx;
  const m = re.exec(RAW);
  if (!m || lineOfIdx(m.index) > b.fim) fail(`literal ${nome} em ${rotuloBloco}`);
  const a = m.index + m[0].length;
  const z = casar(a);
  const fonte = RAW.slice(a, z + 1);
  const valor = vm.runInNewContext('(' + fonte + ')', {});
  return { valor, linhas: [lineOfIdx(a), lineOfIdx(z)] };
}

// linhas de código verbatim
export const codigo = (a, b) => { const r = []; for (let n = a; n <= b; n++) r.push({ linha_aprox: n, codigo: ln(n).trim() }); return r; };
export const achaLinha = (needle, de = 1, ate = L.length) => { for (let n = de; n <= ate; n++) if (ln(n).includes(needle)) return n; fail('não achou: ' + needle); };

// ── DOM simulado ─────────────────────────────────────────────
// Índice estático: todo elemento com id no markup, com tag, atributos e texto interno da mesma linha.
const STATIC = new Map();
L.forEach((line, i) => {
  if (i + 1 >= SCRIPT_INI) return;
  for (const m of line.matchAll(/<(\w+)([^>]*\bid="([^"]+)"[^>]*)>/g)) {
    const inner = line.slice(m.index + m[0].length).match(new RegExp(`^(.*?)</${m[1]}>`));
    STATIC.set(m[3], { tag: m[1], attrs: attrs(m[2]), inner: inner ? inner[1] : '', linha: i + 1 });
  }
});
// botões estáticos de cada .seg
const SEGBTN = new Map();
for (const [id, s] of STATIC) {
  if (s.attrs.class !== 'seg') continue;
  const bs = [];
  for (let n = s.linha + 1; !/^\s*<\/div>/.test(ln(n)); n++) {
    const m = ln(n).match(/<button([^>]*)>(.*)<\/button>/);
    bs.push({ attrs: attrs(m[1]), rotulo: m[2], linha: n });
  }
  SEGBTN.set(id, bs);
}
export const botoesSeg = (id) => SEGBTN.get(id);
export const estatico = (id) => STATIC.get(id);

class ClassList {
  constructor(el) { this.el = el; }
  get set() { return new Set(String(this.el.className || '').split(/\s+/).filter(Boolean)); }
  add(c) { const s = this.set; s.add(c); this.el.className = [...s].join(' '); }
  remove(...cs) { const s = this.set; cs.forEach((c) => s.delete(c)); this.el.className = [...s].join(' '); }
  contains(c) { return this.set.has(c); }
  toggle(c) { this.contains(c) ? this.remove(c) : this.add(c); }
}
class El {
  constructor(tag, at, inner) {
    this.tagName = tag; this.attrs = { ...at }; this.className = at.class || '';
    this.value = at.value; this._inner = inner || ''; this._text = strip(inner || '');
    this.style = {}; this.listeners = {}; this.classList = new ClassList(this);
    this._kids = null; this._kidsFor = null; this.escritas = 0;
  }
  get innerHTML() { return this._inner; }
  set innerHTML(v) { this._inner = String(v); this._text = strip(v); this.escritas++; }
  get textContent() { return this._text; }
  set textContent(v) { this._text = String(v); this._inner = String(v); this.escritas++; }
  getAttribute(a) { return this.attrs[a] ?? null; }
  setAttribute(a, v) { this.attrs[a] = v; }
  addEventListener(t, f) { (this.listeners[t] ??= []).push(f); }
  fire(t) { (this.listeners[t] || []).forEach((f) => f({ target: this })); }
  scrollIntoView() {}
  getBoundingClientRect() { return { top: 0 }; }
  querySelector(sel) {
    if (sel === 'button.on') return this.querySelectorAll('button').find((b) => b.classList.contains('on')) || null;
    if (sel === 'rect') return new El('rect', {}, '');
    return null;
  }
  querySelectorAll(sel) {
    if (this._static) return this._static;
    if (this._kidsFor !== this.escritas) {
      const tag = sel.split('.')[0];
      this._kids = [...this._inner.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, 'g'))].map((m) => new El(tag, attrs(m[1]), ''));
      this._kidsFor = this.escritas;
    }
    return this._kids;
  }
}
export function novoDocumento() {
  const reg = new Map();
  const get = (id) => {
    if (reg.has(id)) return reg.get(id);
    const s = STATIC.get(id);
    if (!s) { reg.set(id, null); return null; }
    const el = new El(s.tag, s.attrs, s.inner);
    if (SEGBTN.has(id)) el._static = SEGBTN.get(id).map((b) => new El('button', b.attrs, b.rotulo));
    reg.set(id, el);
    return el;
  };
  const nodes = [...RAW.matchAll(/<g class="mp-node" data-n="(\w+)">/g)].map((m) => new El('g', { 'data-n': m[1], class: 'mp-node' }, ''));
  const document = {
    getElementById: get,
    querySelectorAll: (sel) => (sel === '.mp-node' ? nodes : []),
    documentElement: { scrollHeight: 1000, clientHeight: 500, scrollTop: 0 },
    body: { scrollTop: 0 },
  };
  const window = { addEventListener() {}, scrollTo() {}, pageYOffset: 0 };
  return { document, window, get, nodes };
}
// executa o <script> original inteiro num DOM novo; devolve o acessor de elementos
export function executar() {
  const d = novoDocumento();
  vm.runInNewContext(SCRIPT, { document: d.document, window: d.window });
  return d;
}
// clique num botão de .seg (dispara o handler do segBind)
export function clicaSeg(d, segId, attr, valor) {
  const w = d.get(segId);
  const b = w.querySelectorAll('button').find((x) => x.getAttribute(attr) === valor) || fail(`seg ${segId} ${valor}`);
  b.fire('click');
}
export function clicaDinamico(d, contId, sel, pred) {
  const w = d.get(contId);
  const b = w.querySelectorAll(sel).find(pred) || fail(`dinâmico ${contId}`);
  b.fire('click');
}
export function digita(d, id, valor) {
  const el = d.get(id);
  el.value = String(valor);
  el.fire('input');
}
export const le = (d, id) => { const e = d.get(id); return e ? { texto: e.textContent, html: e.innerHTML, classe: e.className, escritas: e.escritas } : null; };

export function escreve(nome, obj) {
  fs.writeFileSync(`${OUTDIR}/${nome}`, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}
export const lerCodigo = (k) => fs.readFileSync(CODE[k], 'utf8');
