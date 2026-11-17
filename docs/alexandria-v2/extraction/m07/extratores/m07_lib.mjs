// Biblioteca comum dos extratores do M07. Le a fonte (so leitura) e oferece:
// - utilitarios de texto (decode, texto, inner) e de origem;
// - fatiamento de <section id="..."> (vocabulario sec-id do M07);
// - extracao de literal JS ([...] / {...}) com consciencia de string/comentario,
//   avaliada por new Function (os dados do <script> sao literais puros);
// - carregador de literais dos arquivos TS do codigo (so leitura), para comparacao.
import fs from 'node:fs';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo07.html';
export const REPO = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = REPO + '/docs/alexandria-v2/extraction/m07';
export const DATA = REPO + '/src/lib/data';
export const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';

export const html = fs.readFileSync(SRC, 'utf8');
export const SCRIPT_START = html.indexOf('<script>');
export const SCRIPT_END = html.indexOf('</script>');
export const script = html.slice(SCRIPT_START + '<script>'.length, SCRIPT_END);

export const lineOf = (idx, src = html) => src.slice(0, idx).split('\n').length;

export const decode = (s) => s
  .replace(/&nbsp;/g, '\u00a0').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
// texto: sem tags, entidades decodificadas, espacos colapsados (nbsp vira espaco)
// TAG_RE exige nome de tag: o <script> tem comparacoes como v<a?a:... que um /<[^>]+>/ engoliria.
export const TAG_RE = new RegExp('</?[a-zA-Z][^<>]*>', 'g');
export const texto = (s) => decode(String(s).replace(/<br\s*\/?>/g, ' ').replace(TAG_RE, ''))
  .replace(/[\s\u00a0]+/g, ' ').trim();
// inner: HTML literal com espacos colapsados
export const inner = (s) => String(s).replace(/\s+/g, ' ').trim();
export const ini = (s, n = 60) => texto(s).slice(0, n);
export const origem = (seletor, trecho, idx, src = html) => ({ seletor, trecho_inicial: trecho, linha_aprox: lineOf(idx, src) });
export const pad = (n) => String(n).padStart(2, '0');

// ---------- secoes ----------
export function sec(id) {
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
export function one(re, s, base = 0) {
  re.lastIndex = 0;
  const m = re.exec(s);
  if (!m) throw new Error('nao casou: ' + re);
  return { m, idx: base + m.index };
}

// ---------- literal JS com consciencia de string ----------
// Devolve o indice do fechamento correspondente ao abridor em `open`.
export function matchBracket(src, open) {
  const pairs = { '[': ']', '{': '}', '(': ')' };
  const stack = [];
  let i = open;
  while (i < src.length) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') {
      const q = c; i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === String.fromCharCode(92)) i++;
        else if (q === '`' && src[i] === '$' && src[i + 1] === '{') {
          const close = matchBracket(src, i + 1); i = close;
        }
        i++;
      }
      i++; continue;
    }
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) i = src.length; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 2; continue; }
    if (pairs[c]) stack.push(pairs[c]);
    else if (c === ']' || c === '}' || c === ')') {
      const exp = stack.pop();
      if (exp !== c) throw new Error(`bracket errado em ${i}: esperava ${exp}, achou ${c}`);
      if (!stack.length) return i;
    }
    i++;
  }
  throw new Error('bracket sem fechamento a partir de ' + open);
}
// Procura `marker` a partir de `from` e devolve o literal que comeca no primeiro [ ou { depois dele.
export function literalAfter(src, marker, from = 0, env = {}) {
  const at = src.indexOf(marker, from);
  if (at < 0) throw new Error('marcador ausente: ' + marker);
  let open = at + marker.length;
  while (src[open] !== '[' && src[open] !== '{') open++;
  const close = matchBracket(src, open);
  const text = src.slice(open, close + 1);
  const names = Object.keys(env);
  const value = new Function(...names, 'return (' + text + ');')(...names.map((k) => env[k]));
  return { value, text, start: open, end: close + 1, markerAt: at };
}

// Bloco de um instrumento no <script>, entre o comentario "INST NN" e o proximo cabecalho.
export function scriptBlock(label) {
  const at = html.indexOf(label, SCRIPT_START);
  if (at < 0) throw new Error('bloco de script ausente: ' + label);
  const next = html.indexOf('/* ====', html.indexOf('*/', at) + 2);
  return { start: at, end: next < 0 ? SCRIPT_END : next, text: html.slice(at, next < 0 ? SCRIPT_END : next) };
}

// Linha de um valor de string JS dentro do intervalo [from, to) (fonte sem escapes: medido).
export function lineOfString(val, from, to = SCRIPT_END) {
  const at = html.indexOf(val, from);
  if (at < 0 || at > to) return null;
  return lineOf(at);
}
export function idxOfString(val, from, to = SCRIPT_END) {
  const at = html.indexOf(val, from);
  return at < 0 || at > to ? -1 : at;
}

// ---------- TS do codigo (so leitura) ----------
export const readData = (f) => fs.readFileSync(DATA + '/' + f, 'utf8');
export function tsLiteral(file, marker, env = {}) {
  const src = readData(file);
  const at = src.indexOf(marker);
  if (at < 0) throw new Error(`marcador ${marker} ausente em ${file}`);
  // pula a anotacao de tipo ate o "=" e depois ate o abridor
  let eq = src.indexOf('=', at + marker.length);
  // se a anotacao tiver "=" (ex.: =>), anda ate '= [' ou '= {'
  const re = /=\s*[[{]/g; re.lastIndex = at + marker.length;
  const m = re.exec(src);
  eq = m.index;
  let open = eq + 1;
  while (src[open] !== '[' && src[open] !== '{') open++;
  const close = matchBracket(src, open);
  let text = src.slice(open, close + 1).replace(/\bas const\b/g, '');
  const names = Object.keys(env);
  const value = new Function(...names, 'return (' + text + ');')(...names.map((k) => env[k]));
  return { value, text, line: lineOf(open, src), src };
}
export function writeJSON(name, obj) {
  fs.writeFileSync(OUTDIR + '/' + name, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

// ---------- walker de blocos de secao (filhos diretos de .wrap, indentacao 4) ----------
export function elemEnd(src, start) {
  const tag = /^<(\w+)/.exec(src.slice(start))[1];
  const re = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g'); re.lastIndex = start; let depth = 0; let m;
  while ((m = re.exec(src))) {
    if (m[0][1] === '/') { depth--; if (depth === 0) return m.index + m[0].length; }
    else if (!m[0].endsWith('/>')) depth++;
  }
  throw new Error('elemento sem fim em ' + start);
}
export function blocks(s) {
  const out = [];
  const re = /\n {4}<(?!\/|!--)/g; let m;
  re.lastIndex = 0;
  let from = 0;
  while ((m = re.exec(s.body))) {
    const at = m.index + m[0].length - 1;
    if (at < from) continue;
    const end = elemEnd(s.body, at);
    const outer = s.body.slice(at, end);
    const open = /^<(\w+)([^>]*)>/.exec(outer);
    const cls = (/class="([^"]*)"/.exec(open[2]) || [])[1] || null;
    const innerHtml = outer.slice(open[0].length, outer.length - `</${open[1]}>`.length);
    out.push({ tag: open[1], cls, outer, inner: innerHtml, idx: s.start + at, linha: lineOf(s.start + at) });
    from = end;
    re.lastIndex = end;
  }
  return out;
}

// normalizacao para conferencia de substring
export const norm = (s) => decode(String(s)).replace(/[\s\u00a0]+/g, ' ').trim();
export const htmlNorm = norm(html);
export const htmlNormNoTags = norm(html.replace(/<[^>]+>/g, ' '));
