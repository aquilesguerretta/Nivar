// Biblioteca comum dos extratores do M14. Le a fonte (so leitura), monta uma
// arvore de elementos com posicao de caractere e linha, e oferece os
// normalizadores usados em todos os grupos. Nenhum texto de conteudo e
// digitado: tudo sai de fatias da fonte.
import fs from 'node:fs';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo14.html';
export const REPO = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = `${REPO}/docs/alexandria-v2/extraction/m14`;
export const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';

export const html = fs.readFileSync(SRC, 'utf8');
export const FONTE = {
  arquivo: SRC,
  linhas_total: html.split('\n').length,
  bytes: Buffer.byteLength(html, 'utf8'),
  fim_de_linha: html.includes('\r\n') ? 'CRLF' : 'LF',
};

// ---------------------------------------------------------------- linhas
const lineStarts = [0];
for (let i = 0; i < html.length; i++) if (html[i] === '\n') lineStarts.push(i + 1);
export function lineOf(pos) {
  let lo = 0, hi = lineStarts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (lineStarts[mid] <= pos) lo = mid; else hi = mid - 1;
  }
  return lo + 1;
}
export const lineText = (n) => html.slice(lineStarts[n - 1], (lineStarts[n] ?? html.length + 1) - 1);

// ---------------------------------------------------------- normalizacao
export const decode = (s) => s
  .replace(/&nbsp;/g, '\u00a0').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
export const inline = (s) => s.replace(/\s+/g, ' ').trim();
export const texto = (s) => decode(String(s).replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
export const ini = (s, n = 60) => texto(s).slice(0, n);

// ------------------------------------------------------------- arvore
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style']);

function parseAttrs(s) {
  const out = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(s))) out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  return out;
}

export const ROOT = { tag: '#root', attrs: {}, children: [], o0: 0, o1: 0, c0: html.length, c1: html.length };
export const PARSE_ERROS = [];
{
  const stack = [ROOT];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue;
    const closing = m[1] === '/';
    const tag = m[2].toLowerCase();
    const top = stack[stack.length - 1];
    if (!closing) {
      const node = { tag, attrs: parseAttrs(m[3]), children: [], parent: top, o0: m.index, o1: m.index + m[0].length };
      top.children.push(node);
      if (VOID.has(tag) || m[3].trim().endsWith('/')) { node.c0 = node.o1; node.c1 = node.o1; continue; }
      if (RAW.has(tag)) {
        const end = html.indexOf(`</${tag}>`, node.o1);
        node.c0 = end; node.c1 = end + tag.length + 3;
        re.lastIndex = node.c1;
        continue;
      }
      stack.push(node);
    } else {
      // fecha o elemento mais proximo com a mesma tag
      let k = stack.length - 1;
      while (k > 0 && stack[k].tag !== tag) k--;
      if (k === 0) { PARSE_ERROS.push({ tipo: 'fechamento_sem_abertura', tag, linha: lineOf(m.index) }); continue; }
      if (k !== stack.length - 1) {
        for (let j = stack.length - 1; j > k; j--) PARSE_ERROS.push({ tipo: 'fechado_implicitamente', tag: stack[j].tag, linha: lineOf(stack[j].o0) });
      }
      for (let j = stack.length - 1; j >= k; j--) {
        const n = stack[j];
        n.c0 = m.index; n.c1 = m.index + m[0].length;
      }
      stack.length = k;
    }
  }
  for (let j = stack.length - 1; j > 0; j--) PARSE_ERROS.push({ tipo: 'nao_fechado', tag: stack[j].tag, linha: lineOf(stack[j].o0) });
}

export const inner = (n) => html.slice(n.o1, n.c0);
export const outer = (n) => html.slice(n.o0, n.c1);
export const cls = (n) => (n.attrs?.class || '').split(/\s+/).filter(Boolean);
export const hasCls = (n, c) => cls(n).includes(c);
export const line = (n) => lineOf(n.o0);
export function walk(n, fn) { for (const c of n.children || []) { fn(c); walk(c, fn); } }
export function findAll(n, pred) { const out = []; walk(n, (c) => { if (pred(c)) out.push(c); }); return out; }
export const find = (n, pred) => findAll(n, pred)[0] || null;
export const kids = (n, pred = () => true) => (n.children || []).filter(pred);
export const byId = (id) => find(ROOT, (c) => c.attrs?.id === id);
export const sel = (tag, c) => (n) => (tag ? n.tag === tag : true) && (c ? hasCls(n, c) : true);

export const origem = (seletor, n, trechoFonte) => ({
  seletor,
  trecho_inicial: ini(trechoFonte ?? inner(n)),
  linha_aprox: line(n),
});
export const ht = (n) => ({ html: inline(inner(n)), texto: texto(inner(n)) });

// secao por id
export function secao(id) {
  const s = find(ROOT, (c) => c.tag === 'section' && c.attrs.id === id);
  if (!s) throw new Error('secao ' + id);
  const wrap = find(s, sel('div', 'wrap'));
  return { s, wrap };
}

// ---------------------------------------------------- blocos genericos
// Converte os filhos diretos de um container em blocos tipados. Instrumento
// (div.inst) vira apenas ponteiro: o conteudo dele vive em instrumentos.json.
export function blocos(container, prefixo, secSeletor) {
  const out = [];
  let i = 0;
  const id = () => `${prefixo}-b${String(++i).padStart(2, '0')}`;
  for (const n of kids(container)) {
    const c = cls(n);
    const base = (tipo, extra) => ({ id: id(), tipo, ...extra });
    if (n.tag === 'div' && c.includes('sec-id')) {
      const b = find(n, sel('b'));
      out.push(base('marcador', { html: inline(inner(n)), texto: texto(inner(n)), rotulo: b ? texto(inner(b)) : null, origem: origem(`${secSeletor} > div.sec-id`, n) }));
    } else if (/^h[1-6]$/.test(n.tag)) {
      const num = find(n, sel('span', 'num'));
      out.push(base('titulo', { nivel: n.tag, numero: num ? texto(inner(num)) : null, html: inline(inner(n)), texto: texto(inner(n)), titulo_sem_numero: texto(inner(n).replace(/<span class="num">[\s\S]*?<\/span>/, '')), origem: origem(`${secSeletor} > ${n.tag}`, n) }));
    } else if (n.tag === 'p') {
      const t = c.includes('lede') ? 'lead' : c.includes('disc') ? 'nota_disc' : 'paragrafo';
      out.push(base(t, { classe: n.attrs.class || null, ...ht(n), origem: origem(`${secSeletor} > p${c.length ? '.' + c.join('.') : ''}`, n) }));
    } else if (n.tag === 'div' && c.includes('box')) {
      const tag = find(n, sel('span', 'tag'));
      const ps = kids(n, (k) => k.tag === 'p');
      out.push(base('callout', { classe: n.attrs.class, rotulo: tag ? texto(inner(tag)) : null, paragrafos: ps.map((p) => ({ ...ht(p), linha_aprox: line(p) })), origem: origem(`${secSeletor} > div.${c.join('.')}`, n) }));
    } else if (n.tag === 'div' && c.includes('form')) {
      const note = find(n, sel('span', 'note'));
      const corpo = inner(n).replace(/<span class="note">[\s\S]*?<\/span>/, '');
      out.push(base('formula_destaque', { html: inline(corpo), texto: texto(corpo), nota: note ? ht(note) : null, origem: origem(`${secSeletor} > div.form`, n) }));
    } else if (n.tag === 'div' && c.includes('chain')) {
      out.push(base('cadeia', { itens: kids(n, sel('div', 'cbox')).map((cb) => {
        const k = find(cb, sel('span', 'ck2'));
        const corpo = inner(cb).replace(/<span class="ck2">[\s\S]*?<\/span>/, '');
        return { classe: cb.attrs.class, rotulo: k ? texto(inner(k)) : null, html: inline(corpo), texto: texto(corpo), linha_aprox: line(cb) };
      }), origem: origem(`${secSeletor} > div.chain`, n) }));
    } else if (n.tag === 'div' && c.includes('tax')) {
      out.push(base('taxonomia', { itens: kids(n, sel('div', 'tax-row')).map((r) => {
        const sym = find(r, sel('div', 'tax-n'));
        const b = find(r, sel('div', 'tax-b'));
        const nome = find(b, sel('b'));
        const st = find(b, sel('span', 'st'));
        const corpo = inner(b).replace(/^\s*<b>[\s\S]*?<\/b>/, '').replace(/<span class="st">[\s\S]*?<\/span>/, '').replace(/^\s*<br>/, '');
        return { classe: r.attrs.class, simbolo: texto(inner(sym)), nome: texto(inner(nome)), estado: st ? texto(inner(st)) : null, html: inline(corpo), texto: texto(corpo), linha_aprox: line(r) };
      }), origem: origem(`${secSeletor} > div.tax`, n) }));
    } else if (n.tag === 'div' && c.includes('scroll')) {
      const tb = find(n, sel('table'));
      const rows = findAll(tb, sel('tr')).map((tr) => kids(tr, (k) => k.tag === 'td' || k.tag === 'th').map((td) => inline(inner(td))));
      out.push(base('tabela', { cabecalho: rows[0], linhas: rows.slice(1), linhas_texto: rows.slice(1).map((r) => r.map(texto)), origem: origem(`${secSeletor} > div.scroll > table.tbl`, n, rows[0].join(' ')) }));
    } else if (n.tag === 'ol' || n.tag === 'ul') {
      out.push(base('lista', { classe: n.attrs.class || null, ordenada: n.tag === 'ol', itens: kids(n, sel('li')).map((li, j) => ({ ordem: j + 1, ...ht(li), linha_aprox: line(li) })), origem: origem(`${secSeletor} > ${n.tag}${c.length ? '.' + c.join('.') : ''}`, n) }));
    } else if (n.tag === 'div' && c.includes('t333')) {
      out.push(base('tres_colunas', { colunas: kids(n, sel('div', 'tc')).map((tc) => ({
        classe: tc.attrs.class,
        titulo: texto(inner(find(tc, sel('div', 'th2')))),
        itens: findAll(tc, sel('li')).map((li) => ({ rotulo: texto(inner(find(li, sel('b')))), html: inline(inner(find(li, sel('i')))), texto: texto(inner(find(li, sel('i')))), linha_aprox: line(li) })),
      })), origem: origem(`${secSeletor} > div.t333`, n) }));
    } else if (n.tag === 'div' && c.includes('clk')) {
      out.push(base('linha_do_tempo', { itens: kids(n, sel('div', 'clk-r')).map((r) => {
        const t = find(r, sel('div', 'clk-t'));
        const b = find(r, sel('div', 'clk-b'));
        const tit = find(b, sel('b'));
        const corpo = inner(b).replace(/^\s*<b>[\s\S]*?<\/b>/, '');
        return { tempo: texto(inner(t)), titulo: texto(inner(tit)), html: inline(corpo), texto: texto(corpo), linha_aprox: line(r) };
      }), origem: origem(`${secSeletor} > div.clk`, n) }));
    } else if (n.tag === 'div' && c.includes('map-grid')) {
      out.push(base('grade_de_aulas', { itens: kids(n, sel('a', 'map-card')).map((a) => ({
        href: a.attrs.href,
        numero: texto(inner(find(a, sel('span', 'n')))),
        titulo: texto(inner(find(a, sel('span', 't')))),
        descricao: texto(inner(find(a, sel('span', 'd')))),
        linha_aprox: line(a),
      })), origem: origem(`${secSeletor} > div.map-grid`, n) }));
    } else if (n.tag === 'div' && c.includes('inst')) {
      const idf = find(n, sel('span', 'id'));
      const nm = find(n, sel('span', 'nm'));
      out.push(base('instrumento_ref', { id_fonte: texto(inner(idf)), titulo: texto(inner(nm)), ver: 'instrumentos.json', linha_aprox: line(n) }));
    } else if (n.tag === 'div' && c.includes('fx')) {
      const fnm = find(n, sel('span', 'fn')); const fe = find(n, sel('div', 'fe')); const fd = find(n, sel('div', 'fd'));
      out.push(base('formula', { nome: fnm ? texto(inner(fnm)) : null, eq: fe ? texto(inner(fe)) : null, desc_html: fd ? inline(inner(fd)) : null, desc: fd ? texto(inner(fd)) : null, origem: origem(`${secSeletor} > div.fx`, n) }));
    } else if (n.tag === 'details') {
      out.push(base('details', { summary: texto(inner(find(n, sel('summary')))), linha_aprox: line(n) }));
    } else if (n.tag === 'div' && c.length === 0 && n.children.length === 0 && !texto(inner(n))) {
      // espacador vazio
    } else {
      out.push(base('nao_mapeado', { tag: n.tag, classe: n.attrs.class || null, texto: texto(inner(n)), linha_aprox: line(n) }));
    }
  }
  return out;
}

// ------------------------------------------------------- cobertura
export const tokens = (s) => decode(String(s).replace(/<[^>]+>/g, ' ')).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
export function coletaStrings(o, acc = []) {
  if (typeof o === 'string') acc.push(o);
  else if (Array.isArray(o)) o.forEach((x) => coletaStrings(x, acc));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) {
    if (k === 'origem' || k === 'html' || k === 'id' || k === 'seletor') continue;
    if (typeof v === 'string' && /^nota/.test(k)) continue;
    coletaStrings(v, acc);
  }
  return acc;
}
// cobertura por token com baixa (protocolo §5): cada token da fonte consome um do extraido
export function cobertura(fonteHtml, extraido) {
  const bag = new Map();
  for (const s of coletaStrings(extraido)) for (const t of tokens(s)) bag.set(t, (bag.get(t) || 0) + 1);
  const src = tokens(fonteHtml);
  let ok = 0; const faltam = [];
  for (const t of src) { const c = bag.get(t) || 0; if (c > 0) { ok++; bag.set(t, c - 1); } else faltam.push(t); }
  return { tokens_fonte: src.length, cobertos: ok, pct: src.length ? Math.round((ok / src.length) * 1000) / 10 : 100, amostra_faltantes: faltam.slice(0, 25) };
}
// remove o markup de instrumento do denominador
export const semInstrumento = (s) => s.replace(/<div class="inst">[\s\S]*?<p class="disc">[\s\S]*?<\/p>\s*<\/div>\s*<\/div>/g, '');

export const write = (name, obj) => fs.writeFileSync(`${OUTDIR}/${name}`, JSON.stringify(obj, null, 2) + '\n', 'utf8');
export const readRepo = (rel) => fs.readFileSync(`${REPO}/${rel}`, 'utf8');
export const pad = (n) => String(n).padStart(2, '0');
export const HOJE = '2026-09-17';
