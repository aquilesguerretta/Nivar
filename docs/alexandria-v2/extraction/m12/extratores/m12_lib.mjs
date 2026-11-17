// Utilitários compartilhados pelos extratores do M12. Só leem o HTML-fonte.
// Nenhum texto de conteúdo é digitado: tudo sai da fonte por índice + regex
// ou por avaliação de literal de dado do <script> (objetos/arrays JS puros).
import fs from 'node:fs';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo12.html';
export const ROOT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = `${ROOT}/docs/alexandria-v2/extraction/m12`;
export const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';

export const html = fs.readFileSync(SRC, 'utf8');
export const LINES = html.split('\n');
export const fail = (m) => { throw new Error(m); };

// índice → linha 1-based
const lineStarts = [0];
for (let i = 0; i < html.length; i++) if (html[i] === '\n') lineStarts.push(i + 1);
export const lineOf = (idx) => {
  let lo = 0, hi = lineStarts.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (lineStarts[mid] <= idx) lo = mid; else hi = mid - 1; }
  return lo + 1;
};

export const decode = (s) => s
  .replace(/&nbsp;/g, '\u00a0').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
/** fragmento literal com espaços em branco colapsados (quebras de linha do HTML-fonte viram espaço) */
export const inline = (s) => s.replace(/\s+/g, ' ').trim();
/** mesmo fragmento sem tags, entidades decodificadas */
export const texto = (s) => decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
export const hx = (h) => ({ html: inline(h), texto: texto(h) });

export const origem = (idx, seletor) => {
  const n = lineOf(idx);
  return { seletor, trecho_inicial: LINES[n - 1].trim().slice(0, 90), linha_aprox: n };
};

/** fim (exclusivo) do elemento que abre em `start` (índice do '<tag'), por contagem balanceada */
export function balanced(start, tag) {
  const re = new RegExp(`<${tag}\\b|</${tag}>`, 'g');
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    if (m[0][1] === '/') { depth--; if (depth === 0) return m.index + m[0].length; }
    else depth++;
  }
  fail(`sem fechamento para <${tag}> em ${lineOf(start)}`);
}
/** conteúdo interno (entre a abertura e o fechamento) */
export function innerOf(start, tag) {
  const end = balanced(start, tag);
  const open = html.indexOf('>', start) + 1;
  return { start, end, open, close: end - (`</${tag}>`).length, inner: html.slice(open, end - (`</${tag}>`).length) };
}

export function section(id) {
  const start = html.indexOf(`<section id="${id}">`);
  if (start < 0) fail('seção ' + id);
  const end = html.indexOf('</section>', start) + '</section>'.length;
  return { id, start, end, body: html.slice(start, end) };
}

/** todas as ocorrências de regex dentro de [a,b) com índice absoluto */
export function all(re, a = 0, b = html.length) {
  const out = []; const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  const s = html.slice(a, b); let m;
  while ((m = r.exec(s))) out.push({ m, idx: a + m.index });
  return out;
}

export const secIdOf = (sec) => {
  const m = sec.body.match(/<div class="sec-id">(.*?) · <b>(.*?)<\/b><\/div>/);
  const h2 = sec.body.match(/<h2>([\s\S]*?)<\/h2>/);
  return { marcador: m[1], rotulo: m[2], h2: h2 ? hx(h2[1]) : null };
};

export const SECOES = ['tese', 'map', 'a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'a08', 'caso', 'erros', 'ex', 'quiz', 'voz', 'final', 'lex', 'ref'];
export const secaoDoIndice = (idx) => {
  for (const id of SECOES) { const s = section(id); if (idx >= s.start && idx < s.end) return id; }
  return null;
};

// ── script ───────────────────────────────────────────────────
export const SCRIPT_START = html.indexOf('<script>') + '<script>'.length;
export const SCRIPT_END = html.lastIndexOf('</script>');
export const SCRIPT = html.slice(SCRIPT_START, SCRIPT_END);

/** literal JS balanceado ({ ou [) a partir de `from`, respeitando strings */
export function jsLiteral(from) {
  let i = from; while (html[i] !== '{' && html[i] !== '[') i++;
  const start = i; let depth = 0; let q = null;
  for (; i < html.length; i++) {
    const c = html[i];
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"') { q = c; continue; }
    if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') { depth--; if (depth === 0) return { start, end: i + 1, text: html.slice(start, i + 1) }; }
  }
  fail('literal sem fim');
}
/** avalia literal de dado puro (sem chamadas) — só objetos, arrays, strings, números, booleanos */
export function evalLiteral(text) {
  if (/\bfunction\b|=>|\(\s*\)/.test(text.replace(/'(?:\\.|[^'\\])*'/g, "''"))) fail('literal com código');
  return new Function(`return (${text});`)();
}
/** bloco do script entre o comentário "INST·NN" e o próximo comentário de seção */
export function scriptBlock(label) {
  const a = html.indexOf(`/* ===================== ${label}`);
  if (a < 0) fail('bloco ' + label);
  const b = html.indexOf('/* =====================', a + 10);
  return { start: a, end: b < 0 ? SCRIPT_END : b, text: html.slice(a, b < 0 ? SCRIPT_END : b) };
}
export function scriptVar(block, name) {
  const i = html.indexOf(`var ${name}=`, block.start);
  if (i < 0 || i > block.end) fail(`var ${name}`);
  const lit = jsLiteral(i + `var ${name}=`.length);
  return { valor: evalLiteral(lit.text), linha_ini: lineOf(lit.start), linha_fim: lineOf(lit.end) };
}
/** texto verbatim de uma função nomeada dentro do bloco */
export function scriptFn(block, name) {
  const i = html.indexOf(`function ${name}(`, block.start);
  if (i < 0 || i > block.end) fail(`function ${name}`);
  let j = html.indexOf('{', i), depth = 0, q = null;
  for (; j < html.length; j++) {
    const c = html[j];
    if (q) { if (c === '\\') { j++; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"') { q = c; continue; }
    if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) break; }
  }
  return { codigo: html.slice(i, j + 1), linha_ini: lineOf(i), linha_fim: lineOf(j) };
}

/** filhos de topo entre [a,b): elementos balanceados (comentários e espaço ignorados) */
const VOID = new Set(['input', 'br', 'img', 'hr', 'meta', 'link']);
export function children(a, b) {
  const out = []; let i = a;
  while (i < b) {
    const lt = html.indexOf('<', i);
    if (lt < 0 || lt >= b) break;
    if (html.startsWith('<!--', lt)) { i = html.indexOf('-->', lt) + 3; continue; }
    const m = html.slice(lt, lt + 40).match(/^<([a-z0-9]+)\b/i);
    if (!m) { i = lt + 1; continue; }
    const tag = m[1].toLowerCase();
    const openEnd = html.indexOf('>', lt) + 1;
    const end = VOID.has(tag) ? openEnd : balanced(lt, tag);
    const attrs = Object.fromEntries([...html.slice(lt, openEnd).matchAll(/([\w-]+)="([^"]*)"/g)].map((x) => [x[1], x[2]]));
    out.push({ tag, attrs, start: lt, end, open: openEnd, inner: VOID.has(tag) ? '' : html.slice(openEnd, end - `</${tag}>`.length), outer: html.slice(lt, end) });
    i = end;
  }
  return out;
}
/** filhos de topo de um fragmento (índices absolutos do elemento pai) */
export const childrenOf = (el) => children(el.open, el.end - `</${el.tag}>`.length);
/** a div.wrap de uma seção */
export function wrapOf(id) {
  const s = section(id);
  const w = children(s.start, s.end)[0]; // <section>
  const wrap = childrenOf(w)[0];
  if (wrap.attrs.class !== 'wrap') fail('wrap ' + id);
  return wrap;
}

const cls = (el) => el.attrs.class || '';
const tabela = (tbl) => {
  const head = [...tbl.inner.matchAll(/<th>([\s\S]*?)<\/th>/g)].map((m) => inline(m[1]));
  const linhas = [...tbl.inner.matchAll(/<tr><td>([\s\S]*?)<\/tr>/g)].map((m) => ('<td>' + m[1]).split(/<\/td>\s*/).filter((x) => x.trim()).map((c) => hx(c.replace(/^<td>/, ''))));
  return { cabecalho: head, linhas };
};
/** registro estruturado de um elemento de topo do corpo */
export function bloco(el) {
  const o = origem(el.start, `${el.tag}${cls(el) ? '.' + cls(el).replace(/ /g, '.') : ''}`);
  const c = cls(el);
  if (el.tag === 'h2') return { tipo: 'titulo_secao', ...hx(el.inner), origem: o };
  if (el.tag === 'h3') { const m = el.inner.match(/<span class="num">(.*?)<\/span>\s*([\s\S]*)/); return { tipo: 'subtitulo', numero: m ? m[1] : null, ...hx(m ? m[2] : el.inner), origem: o }; }
  if (el.tag === 'p') return { tipo: c === 'lede' ? 'lede' : c ? `p.${c}` : 'paragrafo', ...hx(el.inner), origem: o };
  if (el.tag === 'div' && c === 'sec-id') { const m = el.inner.match(/^(.*?) · <b>(.*?)<\/b>$/); return { tipo: 'marcador', marcador: m[1], rotulo: m[2], origem: o }; }
  if (el.tag === 'div' && /^box /.test(c)) {
    const kids = childrenOf(el);
    const tag = kids.find((k) => k.tag === 'span' && cls(k) === 'tag');
    return { tipo: 'box', cor: c.split(' ')[1], rotulo: tag ? inline(tag.inner) : null, paragrafos: kids.filter((k) => k.tag === 'p').map((k) => ({ ...hx(k.inner), origem: origem(k.start, 'p') })), origem: o };
  }
  if (el.tag === 'div' && c === 'par') {
    return { tipo: 'duas_colunas', colunas: childrenOf(el).map((col) => {
      const ph = col.inner.match(/<div class="ph">(.*?)<\/div>/);
      return { classe: cls(col), rotulo: ph[1], itens: [...col.inner.matchAll(/<li><b>(.*?)<\/b>([\s\S]*?)<\/li>/g)].map((m) => ({ rotulo: m[1], ...hx(m[2]) })) };
    }), origem: o };
  }
  if (el.tag === 'div' && c === 'chain') {
    return { tipo: 'cadeia', itens: childrenOf(el).map((k) => { const m = k.inner.match(/^<span class="ck2">(.*?)<\/span>([\s\S]*)$/); return { classe: cls(k), rotulo: m[1], ...hx(m[2]), origem: origem(k.start, 'div.cbox') }; }), origem: o };
  }
  if (el.tag === 'div' && c === 'inst') { const m = el.inner.match(/<span class="id">(.*?)<\/span>\s*<span class="nm">(.*?)<\/span>/); return { tipo: 'instrumento', id_fonte: m[1], titulo: m[2], ponteiro: 'ver instrumentos.json', origem: o }; }
  if (el.tag === 'div' && c === 'lv') {
    const hd = el.inner.match(/<div class="lv-hd">(.*?)<\/div>/)[1];
    const tabs = [...el.inner.matchAll(/<button class="lv-tab[^"]*" data-lv="(\w)">(.*?)<\/button>/g)];
    const panes = [...el.inner.matchAll(/<div class="lv-pane[^"]*" data-p="(\w)">([\s\S]*?)<\/div>/g)];
    return { tipo: 'tres_niveis', cabecalho: hd, niveis: tabs.map((t) => ({ chave: t[1], rotulo: t[2], ...hx(panes.find((p) => p[1] === t[1])[2]) })), origem: o };
  }
  if (el.tag === 'div' && c === 'fi') {
    const hd = el.inner.match(/<span class="sg">(.*?)<\/span><span class="tp">(.*?)<\/span>/);
    return { tipo: 'ficha', rotulo: hd[1], contador: hd[2], linhas: [...el.inner.matchAll(/<div class="fi-row"><div class="fi-k">(.*?)<\/div><div class="fi-v">([\s\S]*?)<\/div><\/div>/g)].map((m) => ({ chave: m[1], ...hx(m[2]) })), origem: o };
  }
  if (el.tag === 'div' && (c === 'scroll')) { const t = childrenOf(el)[0]; return { tipo: 'tabela', ...tabela(t), origem: o }; }
  if (el.tag === 'div' && c === 'stp') {
    const ol = childrenOf(el)[0];
    return { tipo: 'lista_passos', itens: [...ol.inner.matchAll(/<li><span class="sh">(.*?)<span class="sw">(.*?)<\/span><\/span>([\s\S]*?)<\/li>/g)].map((m) => ({ titulo: m[1], etiqueta: m[2], ...hx(m[3]), pergunta_em_negrito: (m[3].match(/<b>(.*?)<\/b>/) || [])[1] ?? null })), origem: o };
  }
  if (el.tag === 'ol' || el.tag === 'ul') return { tipo: `lista_${el.tag}`, classe: c || null, itens: [...el.inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => hx(m[1])), origem: o };
  if (el.tag === 'details') {
    const s = el.inner.match(/<summary>([\s\S]*?)<\/summary>/)[1];
    return { tipo: 'details', resumo: inline(s), html: inline(el.inner), origem: o };
  }
  return { tipo: `${el.tag}${c ? '.' + c : ''}`, ...hx(el.inner), origem: o };
}

export const pad = (n) => String(n).padStart(2, '0');
export const writeJson = (name, obj) => fs.writeFileSync(`${OUTDIR}/${name}`, JSON.stringify(obj, null, 2) + '\n', 'utf8');

/** importa um .ts de src/lib/data (Node 24 com type stripping + hook de resolução) */
export async function importTs(rel) {
  await import('./ts-hooks.mjs');
  return import(`file:///${ROOT}/src/lib/data/${rel}`);
}
