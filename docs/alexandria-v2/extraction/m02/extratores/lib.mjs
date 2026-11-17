// Utilitários compartilhados pelos extratores do M02.
// A fonte (HTML) e o código (src/lib/data) são SÓ LEITURA: nada aqui escreve fora de extraction/m02/.
import fs from 'node:fs';
import { createRequire } from 'node:module';

export const ROOT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo02.html';
export const OUTDIR = `${ROOT}/docs/alexandria-v2/extraction/m02`;
export const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';
export const DATA = `${ROOT}/src/lib/data`;
export const HOJE = '2026-09-17';

export const html = fs.readFileSync(SRC, 'utf8');
export const LINHAS = html.split('\n');
export const fonteInfo = { arquivo: SRC, linhas_total: LINHAS.length, bytes: Buffer.byteLength(html) };

export const lineOf = (idx) => html.slice(0, idx).split('\n').length;
export const decode = (s) => s
  .replace(/&nbsp;/g, '\u00a0').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
/** texto puro: tags removidas, entidades decodificadas, espaços colapsados */
export const texto = (s) => (s == null ? null : decode(String(s).replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim());
/** html inline preservado, espaços colapsados */
export const inner = (s) => (s == null ? null : String(s).replace(/\s+/g, ' ').trim());
export const ht = (s) => ({ html: inner(s), texto: texto(s) });
export const ini = (s) => texto(s).slice(0, 70);
export const origem = (seletor, trecho, idx) => ({ seletor, trecho_inicial: trecho, linha_aprox: lineOf(idx) });
export const pad = (n) => String(n).padStart(2, '0');
export const fail = (m) => { throw new Error(m); };

/** Todas as seções .aula, com marcador, título e intervalo. */
export function secoes() {
  const out = [];
  const re = /<div class="aula-marker"><span class="num">(.*?)<\/span><span class="dot"><\/span><span>(.*?)<\/span><\/div>/g;
  let m;
  while ((m = re.exec(html))) {
    const start = html.lastIndexOf('<section class="aula">', m.index);
    const end = html.indexOf('</section>', m.index);
    const h2 = /<h2 class="aula-title">([\s\S]*?)<\/h2>/.exec(html.slice(m.index, end));
    out.push({ num: m[1], rotulo: m[2], start, end, markerIdx: m.index, body: html.slice(start, end), h2: h2 ? h2[1] : null, h2Idx: h2 ? m.index + h2.index : null });
  }
  return out;
}
export function secao(num) {
  const s = secoes().find((x) => x.num === num);
  if (!s) fail('seção ' + num);
  return s;
}
/** todas as ocorrências de re (global) dentro de s, com índice absoluto */
export function all(re, s, base) {
  const out = []; let m; re.lastIndex = 0;
  while ((m = re.exec(s))) out.push({ m, idx: base + m.index });
  return out;
}
export function one(re, s, base, msg) {
  const m = re.exec(s);
  if (!m) fail('não casou: ' + (msg || re));
  return { m, idx: base + m.index };
}
/** conteúdo balanceado de <div ...> iniciado em absIdx (retorna {inner, end}) */
export function divBalanceado(absIdx) {
  const open = html.indexOf('>', absIdx) + 1;
  const re = /<div\b|<\/div>/g; re.lastIndex = open;
  let depth = 1, m;
  while ((m = re.exec(html))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return { inner: html.slice(open, m.index), end: m.index + 6 };
  }
  fail('div desbalanceada em ' + lineOf(absIdx));
}

// ── leitura do código (src/lib/data) via typescript.transpileModule ─────────
const require = createRequire(import.meta.url);
const ts = require(`${ROOT}/node_modules/typescript`);
export async function carregarTS(arquivo, prefixo = '', sufixo = '') {
  let src = fs.readFileSync(arquivo, 'utf8');
  src = prefixo + src + sufixo;
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
}
/** Recorta o bloco M02 da tabela de calculadoras e avalia isolado (o arquivo inteiro importa outros módulos). */
export async function calculadorasM02() {
  const src = fs.readFileSync(`${DATA}/alexandria-instrument-calculators.ts`, 'utf8');
  const a = src.indexOf("  'm02-inst-01':");
  const b = src.indexOf("  // ══", a);
  if (a < 0 || b < 0) fail('bloco m02 não achado nas calculadoras');
  const helpers = src.slice(src.indexOf('const n = (v'), src.indexOf('/** Sazonalidade'));
  const corpo = `type EntradaInstrumento = number | string;\n${helpers}\nexport const CALC: Record<string, (i: any) => any> = {\n${src.slice(a, b)}\n};\n`;
  const js = ts.transpileModule(corpo, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
  return { CALC: mod.CALC, linhas: [src.slice(0, a).split('\n').length, src.slice(0, b).split('\n').length] };
}

// ── DOM simulado para executar o <script> original sem reescrevê-lo ─────────
export function scriptOriginal() {
  const a = html.lastIndexOf('<script>');
  const b = html.lastIndexOf('</script>');
  return { codigo: html.slice(a + 8, b), linhaInicio: lineOf(a) };
}
function atributosDe(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
}
export function montarDOM() {
  const els = {};
  const mk = (id, extra = {}) => {
    const e = {
      id, value: '', textContent: '', innerHTML: '', className: '', style: {}, handlers: {},
      classList: { _s: new Set(), add(...c) { c.forEach((x) => this._s.add(x)); }, remove(...c) { c.forEach((x) => this._s.delete(x)); }, contains(c) { return this._s.has(c); }, toggle(c) { this._s.has(c) ? this._s.delete(c) : this._s.add(c); } },
      addEventListener(ev, fn) { (this.handlers[ev] ||= []).push(fn); },
      fire(ev) { (this.handlers[ev] || []).forEach((f) => f()); },
      ...extra,
    };
    els[id] = e; return e;
  };
  for (const m of html.matchAll(/<(input|select|div|span|svg)\b([^>]*\bid="([^"]+)"[^>]*)>/g)) {
    const at = atributosDe(m[2]);
    const e = mk(m[3], { tag: m[1], attrs: at });
    if (m[1] === 'input') e.value = at.value ?? '';
    if (m[1] === 'select') {
      const fim = html.indexOf('</select>', m.index);
      const opts = [...html.slice(m.index, fim).matchAll(/<option value="([^"]*)"( selected)?>/g)];
      const sel = opts.find((o) => o[2]) || opts[0];
      e.value = sel[1];
    }
  }
  const pills = {};
  for (const grupo of ['i01-pills', 'i03-pills']) {
    const i = html.indexOf(`id="${grupo}"`);
    const fim = html.indexOf('</div>', i);
    pills[grupo] = [...html.slice(i, fim).matchAll(/<button class="pill( active)?" data-(\w+)="(\w+)">(.*?)<\/button>/g)].map((b) => {
      const p = mk(`${grupo}:${b[3]}`, { dataset: { [b[2]]: b[3] }, rotulo: b[4] });
      if (b[1]) p.classList.add('active');
      return p;
    });
  }
  const pillList = (arr) => Object.assign(arr.slice(), { forEach: Array.prototype.forEach });
  const document = {
    getElementById: (x) => (x === 'quiz-container' ? null : els[x] || null),
    querySelectorAll: (sel) => {
      if (sel === '#i01-pills .pill') return pillList(pills['i01-pills']);
      if (sel === '#i03-pills .pill') return pillList(pills['i03-pills']);
      return pillList([]);
    },
    documentElement: { scrollHeight: 1000, clientHeight: 500, scrollTop: 0 },
    body: { scrollTop: 0 },
    createElement: () => mk('tmp'),
  };
  const window = { addEventListener() {} };
  return { els, pills, document, window };
}
export function executarScript() {
  const dom = montarDOM();
  const { codigo } = scriptOriginal();
  // eslint-disable-next-line no-new-func
  new Function('document', 'window', codigo)(dom.document, dom.window);
  return dom;
}
/** muda um campo (number+range gêmeos) e dispara o evento como o usuário faria */
export function setCampo(dom, id, valor) {
  const e = dom.els[id];
  e.value = String(valor);
  e.fire('input');
}

export function escrever(nome, obj) {
  fs.writeFileSync(`${OUTDIR}/${nome}`, typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2) + '\n', 'utf8');
}
export const norm = (s) => texto(String(s ?? '')).replace(/\u00a0/g, ' ');

/** origem a partir de um trecho literal (primeira ocorrência a partir de `desde`); falha se não existir. */
export function achar(trecho, seletor, desde = 0) {
  const i = html.indexOf(trecho, desde);
  if (i < 0) fail('trecho não achado na fonte: ' + trecho);
  return { seletor, trecho_inicial: trecho, linha_aprox: lineOf(i) };
}
/** todas as linhas (1-based) onde o literal aparece */
export const linhasCom = (lit) => LINHAS.map((l, k) => (l.includes(lit) ? k + 1 : 0)).filter(Boolean);
/** origem num arquivo de código/documento (só leitura) */
export function acharEm(arquivo, trecho, rotulo) {
  const src = fs.readFileSync(arquivo, 'utf8');
  const i = src.indexOf(trecho);
  if (i < 0) fail(`trecho não achado em ${arquivo}: ${trecho}`);
  return { arquivo: rotulo || arquivo, trecho_inicial: trecho, linha_aprox: src.slice(0, i).split('\n').length };
}
/** registro de divergência: duas leituras lado a lado, nenhuma escolhida */
export const div = (id, tipo, severidade, tema, leitura_a, leitura_b, nota, extra = {}) => ({ id, tipo, severidade, tema, leitura_a, leitura_b, resolvida: false, nota, ...extra });
