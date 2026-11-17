// Utilitários compartilhados pelos extratores do M15.
// Leem o HTML-fonte (SÓ LEITURA) e o código (SÓ LEITURA). Nenhum texto de
// conteúdo é digitado: tudo sai de índice/regex sobre a fonte.
import fs from 'node:fs';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo15.html';
export const REPO = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = `${REPO}/docs/alexandria-v2/extraction/m15`;
export const CODE = {
  content: `${REPO}/src/lib/data/alexandria-modulo-15-content.ts`,
  curriculo: `${REPO}/src/lib/data/alexandria-curriculo.ts`,
  trilhas: `${REPO}/src/lib/data/alexandria-trilhas.ts`,
  glossario: `${REPO}/src/lib/data/alexandria-glossario.ts`,
  calculators: `${REPO}/src/lib/data/alexandria-instrument-calculators.ts`,
  badges: `${REPO}/src/lib/data/alexandria-badges.ts`,
  blocks: `${REPO}/src/lib/data/alexandria-blocks.ts`,
  recursos: `${REPO}/src/components/alexandria/navigation/RecursosDoModulo.tsx`,
};
export const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';

export const html = fs.readFileSync(SRC, 'utf8');
export const LINES = html.split('\n');
export const read = (p) => fs.readFileSync(p, 'utf8');

const lineStarts = [0];
for (let i = 0; i < html.length; i++) if (html[i] === '\n') lineStarts.push(i + 1);
export const lineOf = (idx) => {
  let lo = 0, hi = lineStarts.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (lineStarts[mid] <= idx) lo = mid; else hi = mid - 1; }
  return lo + 1;
};

export const decode = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&nbsp;/g, '\u00a0').replace(/&amp;/g, '&');
/** fragmento literal com espaços colapsados (inline preservado) */
export const inl = (s) => s.replace(/\s+/g, ' ').trim();
/** o mesmo sem tags, entidades decodificadas */
export const txt = (s) => decode(s
  .replace(/<(?:\/?(?:div|p|li|td|th|tr|ul|ol|table|h\d|br)[^>]*|span class="(?:mini|sub|src|st|mt|ck2|sw|y)"[^>]*)>/g, ' ')
  .replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
/** texto para denominador de cobertura: toda tag vira espaço */
export const txtSp = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
export const both = (h) => ({ html: inl(h), texto: txt(h) });
export const ini = (s, n = 70) => txt(s).slice(0, n);

export const origem = (seletor, fragOrText, idx) => ({
  seletor,
  trecho_inicial: (fragOrText.includes('<') ? txt(fragOrText) : fragOrText.replace(/\s+/g, ' ').trim()).slice(0, 70),
  linha_aprox: lineOf(idx),
});

/** índice logo após o fechamento da tag balanceada que abre em `start` */
export function balancedEnd(start, tag = 'div', src = html) {
  const re = new RegExp(`<${tag}\\b|</${tag}>`, 'g');
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(src))) {
    if (m[0].startsWith('</')) { depth--; if (depth === 0) return m.index + m[0].length; }
    else depth++;
  }
  throw new Error(`tag ${tag} sem fechamento a partir de ${start}`);
}
/** conteúdo interno do elemento que abre em `start` */
export function innerOf(start, tag = 'div', src = html) {
  const end = balancedEnd(start, tag, src);
  const open = src.indexOf('>', start) + 1;
  return src.slice(open, end - (`</${tag}>`).length);
}

export function allMatches(re, src = html, from = 0, to = src.length) {
  const out = []; const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  r.lastIndex = from; let m;
  while ((m = r.exec(src)) && m.index < to) out.push(m);
  return out;
}
export function must(cond, msg) { if (!cond) throw new Error(msg); }

// ── seções ───────────────────────────────────────────────────
export const SECTIONS = allMatches(/<section id="([^"]+)">/).map((m) => {
  const start = m.index;
  const end = html.indexOf('</section>', start);
  const body = html.slice(start, end);
  const sid = body.match(/<div class="sec-id">(.*?) · <b>(.*?)<\/b><\/div>/);
  const h2 = body.match(/<h2>([\s\S]*?)<\/h2>/);
  return {
    anchor: m[1], start, end,
    sec_num: sid[1], sec_rotulo: sid[2],
    h2: h2[1], h2_idx: start + h2.index,
    sid_idx: start + sid.index,
  };
});
export const sec = (anchor) => SECTIONS.find((s) => s.anchor === anchor);

/** blocos de primeiro nível dentro de [from,to) de uma seção — varre tags de bloco */
export function topBlocks(from, to) {
  const out = [];
  const re = /<(h2|h3|h4|p|div|ul|ol|table|details)\b[^>]*>/g;
  re.lastIndex = from;
  let m;
  while ((m = re.exec(html)) && m.index < to) {
    const tag = m[1];
    const end = balancedEnd(m.index, tag);
    if (end > to) break;
    out.push({ tag, open: m[0], start: m.index, end, raw: html.slice(m.index, end), inner: innerOf(m.index, tag) });
    re.lastIndex = end;
  }
  return out;
}

export const classOf = (open) => (open.match(/class="([^"]*)"/) || [])[1] ?? null;
export const attrs = (open) => Object.fromEntries([...open.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

/** tabela → linhas de células (html literal colapsado) */
export function tableRows(tableHtml) {
  return [...tableHtml.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((tr) =>
    [...tr[1].matchAll(/<(th|td)>([\s\S]*?)<\/\1>/g)].map((c) => ({ tipo: c[1], ...both(c[2]) })));
}

/** um bloco genérico da fonte, sem interpretar (para caso/erros etc.) */
export function describeBlock(b, secLabel) {
  const cls = classOf(b.open);
  const base = { tag: b.tag, classe: cls, origem: origem(`section(${secLabel}) ${b.tag}${cls ? '.' + cls.replace(/ /g, '.') : ''}`, b.inner, b.start) };
  if (b.tag === 'h3') {
    const m = b.inner.match(/<span class="num">(.*?)<\/span>\s*([\s\S]*)/);
    return { ...base, tipo: 'titulo', numero: m ? m[1] : null, ...both(m ? m[2] : b.inner) };
  }
  if (b.tag === 'h4') return { ...base, tipo: 'titulo_h4', ...both(b.inner) };
  if (b.tag === 'p') return { ...base, tipo: cls === 'lede' ? 'lede' : 'paragrafo', ...both(b.inner) };
  if (b.tag === 'table' || (b.tag === 'div' && /^(scroll|cmpx)$/.test(cls ?? ''))) {
    const t = b.raw.match(/<table[^>]*>([\s\S]*?)<\/table>/);
    return { ...base, tipo: 'tabela', linhas: tableRows(t[1]) };
  }
  if (b.tag === 'div' && /^box /.test(cls ?? '')) {
    const tag = b.inner.match(/<span class="tag">([\s\S]*?)<\/span>/);
    const ps = [...b.inner.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((p) => both(p[1]));
    return { ...base, tipo: 'caixa', rotulo: tag ? inl(tag[1]) : null, paragrafos: ps };
  }
  if (b.tag === 'ul' || b.tag === 'ol') {
    return { ...base, tipo: 'lista', itens: [...b.inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((l) => both(l[1])) };
  }
  return { ...base, tipo: 'bloco_bruto', ...both(b.inner) };
}

export const writeJSON = (name, obj) => fs.writeFileSync(`${OUTDIR}/${name}`, JSON.stringify(obj, null, 2) + '\n', 'utf8');
export const pad = (n) => String(n).padStart(2, '0');

/** avalia um literal JS (objeto/array) recortado do script-fonte */
export function evalLiteral(code) { return new Function(`return (${code});`)(); }
/** recorta `var NAME=` … até o `;` que fecha o literal balanceado */
export function scriptLiteral(from, name) {
  const i = html.indexOf(`var ${name}=`, from);
  must(i > 0, 'literal ' + name);
  const s = i + `var ${name}=`.length;
  const open = html[s]; const close = open === '{' ? '}' : ']';
  let d = 0, q = null;
  for (let k = s; k < html.length; k++) {
    const c = html[k];
    if (q) { if (c === '\\') { k++; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"') { q = c; continue; }
    if (c === open) d++; else if (c === close) { d--; if (d === 0) return { code: html.slice(s, k + 1), idx: i, linha: lineOf(i), linha_fim: lineOf(k) }; }
  }
  throw new Error('literal sem fim ' + name);
}
