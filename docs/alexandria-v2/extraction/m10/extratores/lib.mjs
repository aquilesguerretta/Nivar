// Utilitários compartilhados dos extratores do M10.
// Lê a fonte (só leitura), monta uma árvore mínima com offsets, e expõe
// helpers de texto e de origem. Nenhum texto de conteúdo é digitado aqui.
import fs from 'node:fs';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo10.html';
export const ROOT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = `${ROOT}/docs/alexandria-v2/extraction/m10`;
export const html = fs.readFileSync(SRC, 'utf8');
export const FONTE = {
  arquivo: SRC,
  linhas_total: html.split('\n').length - (html.endsWith('\n') ? 1 : 0),
  bytes: Buffer.byteLength(html, 'utf8'),
  fim_de_linha: html.includes('\r\n') ? 'CRLF' : 'LF',
};

// índice de linhas
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
export const collapse = (s) => s.replace(/\s+/g, ' ').trim();
export const texto = (s) => collapse(decode(String(s).replace(/<[^>]+>/g, '')));
export const inline = (s) => collapse(String(s));
export const ini = (s, n = 60) => texto(s).slice(0, n);

// ---------------- parser mínimo ----------------
const VOID = new Set(['br', 'input', 'img', 'meta', 'link', 'hr', 'wbr', 'source', 'area', 'base', 'col']);
const RAW = new Set(['script', 'style']);

export function parse(src) {
  const root = { tag: '#root', attrs: {}, children: [], start: 0, end: src.length, innerStart: 0, innerEnd: src.length, parent: null };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9]+)\s*>|<([a-zA-Z0-9]+)((?:\s+[^\s=>\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/g;
  let m;
  while ((m = re.exec(src))) {
    const top = stack[stack.length - 1];
    if (m[0].startsWith('<!--')) continue;
    if (m[1]) {
      const name = m[1].toLowerCase();
      // desempilha até o par
      for (let k = stack.length - 1; k > 0; k--) {
        if (stack[k].tag === name) {
          for (let j = stack.length - 1; j >= k; j--) {
            const n = stack[j];
            if (j === k) { n.innerEnd = m.index; n.end = m.index + m[0].length; }
            else { n.innerEnd = m.index; n.end = m.index; n.unclosed = true; }
          }
          stack.length = k;
          break;
        }
      }
      continue;
    }
    const name = m[2].toLowerCase();
    const attrs = {};
    const ar = /([^\s=>\/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let a;
    while ((a = ar.exec(m[3] || ''))) attrs[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? '';
    const node = { tag: name, attrs, children: [], parent: top, start: m.index, innerStart: m.index + m[0].length };
    top.children.push(node);
    if (VOID.has(name) || m[4] === '/') { node.innerEnd = node.innerStart; node.end = node.innerStart; continue; }
    if (RAW.has(name)) {
      const close = src.indexOf(`</${name}>`, node.innerStart);
      node.innerEnd = close; node.end = close + name.length + 3;
      re.lastIndex = node.end;
      continue;
    }
    stack.push(node);
  }
  return root;
}

export const doc = parse(html);
export const inner = (n) => html.slice(n.innerStart, n.innerEnd);
export const outer = (n) => html.slice(n.start, n.end);
export const classes = (n) => (n.attrs?.class || '').split(/\s+/).filter(Boolean);
export const hasClass = (n, c) => classes(n).includes(c);
export function walk(n, fn) { for (const c of n.children || []) { fn(c); walk(c, fn); } }
export function findAll(n, pred) { const out = []; walk(n, (c) => { if (pred(c)) out.push(c); }); return out; }
export const find = (n, pred) => findAll(n, pred)[0] || null;
export const byTag = (t) => (n) => n.tag === t;
export const byClass = (c) => (n) => hasClass(n, c);
export const kids = (n, pred = () => true) => (n.children || []).filter(pred);
export const byId = (id) => find(doc, (n) => n.attrs?.id === id);

export const origem = (seletor, nodeOrIdx, trechoSrc) => {
  const idx = typeof nodeOrIdx === 'number' ? nodeOrIdx : nodeOrIdx.start;
  const trecho = trechoSrc != null ? ini(trechoSrc) : ini(inner(nodeOrIdx));
  return { seletor, trecho_inicial: trecho, linha_aprox: lineOf(idx) };
};
export const frag = (s) => ({ html: inline(s), texto: texto(s) });

// Seções: <section id=...> com .sec-id
export function secoes() {
  return findAll(doc, byTag('section')).map((s) => {
    const sid = find(s, byClass('sec-id'));
    const h2 = find(s, byTag('h2'));
    const b = sid ? find(sid, byTag('b')) : null;
    return {
      node: s, id: s.attrs.id, secId: sid, h2,
      marcador: sid ? texto(inner(sid).replace(/<b>[\s\S]*<\/b>/, '')).replace(/\s*·\s*$/, '') : null,
      rotulo: b ? texto(inner(b)) : null,
      titulo: h2 ? texto(inner(h2)) : null,
    };
  });
}

// Blocos de prosa de uma seção (filhos diretos de .wrap), em ordem.
export function blocos(sec, prefixo) {
  const wrap = find(sec, byClass('wrap'));
  const out = [];
  let n = 0;
  const id = () => `${prefixo}-b${String(++n).padStart(2, '0')}`;
  for (const c of wrap.children) {
    const cl = classes(c);
    const base = { id: null, tipo: null };
    if (cl.includes('sec-id') || c.tag === 'h2') continue;
    if (c.tag === 'p' && cl.includes('lede')) out.push({ id: id(), tipo: 'lede', ...frag(inner(c)), origem: origem(`#${sec.attrs.id} p.lede`, c) });
    else if (c.tag === 'p') out.push({ id: id(), tipo: 'paragrafo', ...frag(inner(c)), origem: origem(`#${sec.attrs.id} > .wrap > p`, c) });
    else if (c.tag === 'h3') {
      const num = find(c, byClass('num'));
      out.push({ id: id(), tipo: 'titulo', numero: num ? texto(inner(num)) : null, texto: texto(inner(c).replace(/<span class="num">[\s\S]*?<\/span>/, '')), origem: origem(`#${sec.attrs.id} h3`, c) });
    } else if (c.tag === 'div' && cl.includes('box')) {
      const tag = find(c, byClass('tag'));
      const ps = findAll(c, byTag('p'));
      out.push({ id: id(), tipo: 'box', variante: cl.filter((x) => x !== 'box').join(' '), rotulo: tag ? texto(inner(tag)) : null, paragrafos: ps.map((p) => frag(inner(p))), origem: origem(`#${sec.attrs.id} div.${cl.join('.')}`, c) });
    } else if (c.tag === 'div' && cl.includes('scroll')) {
      const trs = findAll(c, byTag('tr'));
      out.push({ id: id(), tipo: 'tabela', linhas: trs.map((tr) => findAll(tr, (x) => x.tag === 'td' || x.tag === 'th').map((td) => frag(inner(td)))), origem: origem(`#${sec.attrs.id} div.scroll > table.tbl`, c, findAll(trs[0], (x) => x.tag === 'th' || x.tag === 'td').map((x) => inner(x)).join(' ')) });
    } else if (c.tag === 'div' && cl.includes('inst')) {
      const idn = find(c, byClass('id')); const nm = find(c, byClass('nm'));
      out.push({ id: id(), tipo: 'instrumento', ref: texto(inner(idn)), titulo: texto(inner(nm)), origem: origem(`#${sec.attrs.id} div.inst`, c) });
    } else if (c.tag === 'details') {
      const sum = find(c, byTag('summary')); const bd = find(c, byClass('det-bd'));
      out.push({ id: id(), tipo: 'details', summary: frag(inner(sum)), corpo: frag(inner(bd)), origem: origem(`#${sec.attrs.id} details`, c) });
    } else if (c.tag === 'ul' || c.tag === 'ol') {
      out.push({ id: id(), tipo: 'lista', classe: c.attrs.class || null, itens: findAll(c, byTag('li')).map((li) => ({ ...frag(inner(li)), linha_aprox: lineOf(li.start) })), origem: origem(`#${sec.attrs.id} ${c.tag}`, c) });
    } else if (c.tag === 'div' && c.attrs.id) {
      out.push({ id: id(), tipo: 'contêiner-de-script', dom_id: c.attrs.id, origem: origem(`#${c.attrs.id}`, c, '') });
    } else {
      out.push({ id: id(), tipo: `outro:${c.tag}.${cl.join('.')}`, ...frag(inner(c)), origem: origem(`#${sec.attrs.id} ${c.tag}`, c) });
    }
  }
  return out;
}

// ---------------- script ----------------
const scriptNode = findAll(doc, byTag('script'))[0];
export const SCRIPT = inner(scriptNode);
export const SCRIPT_START = scriptNode.innerStart;
export const scriptLine = (needle, from = 0) => {
  const i = SCRIPT.indexOf(needle, from);
  return i < 0 ? null : lineOf(SCRIPT_START + i);
};

/** Extrai e avalia o literal JS que segue `marcador` (ex.: 'var LINHAS='),
 *  a partir de `from` (offset no script). Bracket-matching ciente de string. */
export function literal(marcador, from = 0) {
  const at = SCRIPT.indexOf(marcador, from);
  if (at < 0) throw new Error('literal não achado: ' + marcador);
  let i = at + marcador.length;
  while (/\s/.test(SCRIPT[i])) i++;
  const open = SCRIPT[i];
  const close = open === '[' ? ']' : '}';
  let depth = 0, q = null;
  const s0 = i;
  for (; i < SCRIPT.length; i++) {
    const ch = SCRIPT[i];
    if (q) { if (ch === '\\') { i++; continue; } if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"') { q = ch; continue; }
    if (ch === open) depth++;
    else if (ch === close) { depth--; if (depth === 0) break; }
  }
  const text = SCRIPT.slice(s0, i + 1);
  // eslint-disable-next-line no-new-func
  const value = new Function(`return (${text});`)();
  return { value, text, offset: at, linha: lineOf(SCRIPT_START + at), linha_fim: lineOf(SCRIPT_START + i) };
}

/** Fatia do script entre dois marcadores (texto literal, para registrar lógica). */
export function trechoScript(inicio, fim, from = 0) {
  const a = SCRIPT.indexOf(inicio, from);
  if (a < 0) throw new Error('trecho não achado: ' + inicio);
  const b = SCRIPT.indexOf(fim, a + inicio.length);
  if (b < 0) throw new Error('fim não achado: ' + fim);
  return { codigo: SCRIPT.slice(a, b + fim.length).replace(/\r/g, ''), linha: lineOf(SCRIPT_START + a), linha_fim: lineOf(SCRIPT_START + b) };
}

export const writeJSON = (name, obj) => fs.writeFileSync(`${OUTDIR}/${name}`, JSON.stringify(obj, null, 2) + '\n', 'utf8');
