// Biblioteca comum dos extratores do M06. Só lê a fonte; nada aqui escreve em src/.
// Todo texto de conteúdo sai do arquivo-fonte por posição (índice de caractere → linha);
// nenhum texto de conteúdo é digitado.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo06.html';
export const REPO = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = `${REPO}/docs/alexandria-v2/extraction/m06`;
export const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';
export const SCRATCH = process.env.M06_SCRATCH
  || 'C:/Users/aquil/AppData/Local/Temp/claude/C--dev/9c5a79fb-f118-4054-8d26-9cede07ac0c2/scratchpad/m06';

export const html = fs.readFileSync(SRC, 'utf8');
export const LINES = html.split('\n');
export const fonteMeta = {
  arquivo: SRC,
  linhas_total: LINES.length - (LINES[LINES.length - 1] === '' ? 1 : 0),
  bytes: Buffer.byteLength(html, 'utf8'),
};

export const lineOf = (idx) => html.slice(0, idx).split('\n').length;
export const decode = (s) => s
  .replace(/&nbsp;/g, '\u00a0').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
export const texto = (s) => decode(String(s).replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '')).replace(/[\s\u00a0]+/g, ' ').trim();
export const inl = (s) => String(s).replace(/\s+/g, ' ').trim();
export const ini = (s, n = 70) => texto(s).slice(0, n);
export const origem = (seletor, trechoHtml, idx) => ({ seletor, trecho_inicial: ini(trechoHtml), linha_aprox: lineOf(idx) });
export const pad = (n) => String(n).padStart(2, '0');

const VOID = new Set(['input', 'br', 'img', 'hr', 'meta', 'link', 'source', 'wbr']);

/** Elementos de primeiro nível entre [from, to). Parser de pilha simples, suficiente para o markup do M06. */
export function children(from, to) {
  const out = [];
  const re = /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g;
  re.lastIndex = from;
  let depth = 0; let cur = null; let m;
  while ((m = re.exec(html)) && m.index < to) {
    if (m[0].startsWith('<!--')) continue;
    const tag = m[1].toLowerCase();
    const closing = m[0][1] === '/';
    const selfClose = VOID.has(tag) || /\/\s*>$/.test(m[0]);
    if (!closing) {
      if (depth === 0) cur = { tag, attrs: m[2], start: m.index, innerStart: m.index + m[0].length };
      if (selfClose) {
        if (depth === 0) { cur.end = cur.innerEnd = m.index + m[0].length; out.push(finish(cur)); cur = null; }
      } else depth++;
    } else {
      depth--;
      if (depth === 0 && cur) { cur.innerEnd = m.index; cur.end = m.index + m[0].length; out.push(finish(cur)); cur = null; }
    }
  }
  return out;
}
function finish(c) {
  const cls = (c.attrs.match(/class="([^"]*)"/) || [])[1] || '';
  const id = (c.attrs.match(/\sid="([^"]*)"/) || [])[1] || null;
  return { ...c, cls, id, outer: html.slice(c.start, c.end), inner: html.slice(c.innerStart, c.innerEnd), linha: lineOf(c.start) };
}
export const kids = (el) => children(el.innerStart, el.innerEnd);
export const find = (el, pred) => {
  for (const k of kids(el)) { if (pred(k)) return k; const r = find(k, pred); if (r) return r; }
  return null;
};
export const findAll = (el, pred, acc = []) => {
  for (const k of kids(el)) { if (pred(k)) acc.push(k); findAll(k, pred, acc); }
  return acc;
};

/** A <section id=...> e o seu div.wrap. */
export function section(id) {
  const s = html.indexOf(`<section id="${id}">`);
  if (s < 0) throw new Error('section ' + id);
  const e = html.indexOf('</section>', s);
  const [sec] = children(s, e + 10);
  const wrap = kids(sec).find((k) => k.cls === 'wrap');
  return { sec, wrap, linha: lineOf(s) };
}

/** sec-id → { marcador, rotulo }. */
export function secId(wrap) {
  const k = kids(wrap).find((x) => x.cls === 'sec-id');
  const m = k.inner.match(/^<b>(.*?)<\/b>\s*·\s*(.*)$/);
  return { html: k.inner, marcador: m[1], rotulo: decode(m[2]), origem: origem('.sec-id', k.inner, k.start) };
}

/**
 * Walker de blocos de um trecho de seção (camada fonte). Não reescreve nada:
 * cada bloco guarda html (inline preservado, espaços colapsados) e texto (sem tags).
 * `instrumento` vira só referência (o instrumento vive em instrumentos.json).
 */
export function blocos(wrap, prefixo, seletorBase) {
  const out = [];
  let n = 0;
  const id = () => `${prefixo}-b${pad(++n)}`;
  for (const k of kids(wrap)) {
    const sel = `${seletorBase} > ${k.tag}${k.cls ? '.' + k.cls.replace(/ /g, '.') : ''}`;
    const base = { id: null, tipo: null };
    if (k.cls === 'sec-id' || k.tag === 'h2') continue;
    if (k.tag === 'p' && k.cls === 'lede') out.push({ ...base, id: id(), tipo: 'lede', html: inl(k.inner), texto: texto(k.inner), origem: origem(sel, k.inner, k.start) });
    else if (k.tag === 'p') out.push({ ...base, id: id(), tipo: 'paragrafo', html: inl(k.inner), texto: texto(k.inner), origem: origem(sel, k.inner, k.start) });
    else if (k.tag === 'h3') {
      const m = k.inner.match(/<span class="num">(.*?)<\/span>(.*)/);
      out.push({ ...base, id: id(), tipo: 'subtitulo', numero: m ? m[1] : null, titulo: m ? decode(m[2]) : texto(k.inner), origem: origem(sel, k.inner, k.start) });
    } else if (k.cls.startsWith('box')) {
      const tag = kids(k).find((x) => x.cls === 'tag');
      const ps = kids(k).filter((x) => x.tag === 'p');
      out.push({ ...base, id: id(), tipo: 'caixa', cor_classe: k.cls, rotulo: tag ? decode(tag.inner) : null,
        paragrafos: ps.map((p) => ({ html: inl(p.inner), texto: texto(p.inner), origem: origem(sel + ' > p', p.inner, p.start) })),
        origem: origem(sel, k.inner, k.start) });
    } else if (k.cls === 'form') {
      const note = kids(k).find((x) => x.cls === 'note');
      const corpo = note ? html.slice(k.innerStart, note.start) : k.inner;
      out.push({ ...base, id: id(), tipo: 'formula', html: inl(corpo), texto: texto(corpo), nota_da_formula: note ? { html: inl(note.inner), texto: texto(note.inner) } : null, origem: origem(sel, k.inner, k.start) });
    } else if (k.cls === 'scroll' || k.tag === 'table') {
      const tb = k.tag === 'table' ? k : kids(k).find((x) => x.tag === 'table');
      const rows = kids(tb).filter((x) => x.tag === 'tr');
      const cab = kids(rows[0]).map((c) => decode(c.inner));
      const linhas = rows.slice(1).map((r) => ({ celulas: kids(r).map((c) => ({ html: inl(c.inner), texto: texto(c.inner) })), origem: origem(sel + ' tr', r.inner, r.start) }));
      out.push({ ...base, id: id(), tipo: 'tabela', cabecalho: cab, linhas, origem: origem(sel, tb.inner, tb.start) });
    } else if (k.tag === 'ol' || k.tag === 'ul') {
      const lis = kids(k).filter((x) => x.tag === 'li');
      out.push({ ...base, id: id(), tipo: 'lista', ordenada: k.tag === 'ol', classe: k.cls,
        itens: lis.map((li, i) => ({ ordem: i + 1, html: inl(li.inner), texto: texto(li.inner), origem: origem(sel + ' > li', li.inner, li.start) })),
        origem: origem(sel, k.inner, k.start) });
    } else if (k.cls === 'inst') {
      const hd = kids(k).find((x) => x.cls === 'inst-hd');
      const nm = kids(hd).find((x) => x.cls === 'nm'); const iid = kids(hd).find((x) => x.cls === 'id');
      out.push({ ...base, id: id(), tipo: 'instrumento_ref', id_fonte: decode(iid.inner), titulo: decode(nm.inner), nota: 'Conteúdo completo em instrumentos.json.', origem: origem(sel, hd.inner, k.start) });
    } else if (k.cls === 'lv') {
      const hd = kids(k).find((x) => x.cls === 'lv-hd');
      out.push({ ...base, id: id(), tipo: 'tres_niveis_ref', titulo: decode(hd.inner), nota: 'Bloco de aula (Criança de 12 anos / Executivo / Especialista); texto integral pertence ao grupo de aula.', origem: origem(sel, hd.inner, k.start) });
    } else if (k.cls === 'map-grid') {
      const cards = kids(k).map((a) => {
        const f = (c) => { const x = kids(a).find((y) => y.cls === c); return x ? decode(x.inner) : null; };
        return { href: (a.attrs.match(/href="([^"]*)"/) || [])[1], aula: f('n'), titulo_card: f('t'), descricao: f('d'), origem: origem(sel + ' > a.map-card', a.inner, a.start) };
      });
      out.push({ ...base, id: id(), tipo: 'mapa_cards', cards, origem: origem(sel, k.inner, k.start) });
    } else if (k.tag === 'details') {
      const sum = kids(k).find((x) => x.tag === 'summary');
      out.push({ ...base, id: id(), tipo: 'detalhes', resumo: decode(sum.inner), origem: origem(sel, sum.inner, k.start) });
    } else if (k.tag === 'div' && !k.cls) {
      out.push({ ...base, id: id(), tipo: 'controles_quiz', html: inl(k.inner), nota: 'Botões da interface do quiz (sem texto de conteúdo além dos rótulos).', origem: origem(sel, k.inner, k.start) });
    } else {
      out.push({ ...base, id: id(), tipo: 'outro', tag: k.tag, classe: k.cls, html: inl(k.inner), texto: texto(k.inner), origem: origem(sel, k.inner, k.start) });
    }
  }
  return out;
}

/** Cobertura por token (protocolo §5): tokens da fonte consumidos uma vez pelos tokens extraídos. */
export function tokens(s) { return texto(String(s).replace(/<[^>]+>/g, ' ')).toLowerCase().normalize('NFC').match(/[\p{L}\p{N}]+/gu) || []; }
export function cobertura(fonteHtml, extraidos) {
  const bag = new Map();
  for (const t of extraidos.flatMap(tokens)) bag.set(t, (bag.get(t) || 0) + 1);
  const src = tokens(fonteHtml);
  let hit = 0; const faltas = [];
  for (const t of src) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else faltas.push(t); }
  return { tokens_fonte: src.length, tokens_cobertos: hit, cobertura: src.length ? +(100 * hit / src.length).toFixed(1) : null, amostra_faltas: faltas.slice(0, 20) };
}
/** Coleta recursiva de strings de conteúdo de um objeto (ignora chaves de anotação). */
const ANOT = new Set(['nota', 'nota_parte', 'id', 'tipo', 'seletor', 'trecho_inicial', 'linha_aprox', 'marcacao_p14', 'decisao', 'metodo', 'cor_classe', 'classe', 'status', 'motivos', 'kind_nota']);
export function strings(o, acc = []) {
  if (typeof o === 'string') acc.push(o);
  else if (Array.isArray(o)) o.forEach((x) => strings(x, acc));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (!ANOT.has(k) && !k.endsWith('_nota') && k !== 'origem') strings(v, acc); }
  return acc;
}

/** Bundle do código já portado (SÓ LEITURA): esbuild escreve no scratchpad, nunca em src/. */
export async function codigo() {
  fs.mkdirSync(SCRATCH, { recursive: true });
  const entry = path.join(SCRATCH, 'entry-m06.ts');
  const d = `${REPO}/src/lib/data`;
  fs.writeFileSync(entry, [
    `export * as C06 from '${d}/alexandria-modulo-06-content';`,
    `export { INSTRUMENT_CALCULATORS as CALC } from '${d}/alexandria-instrument-calculators';`,
    `export * as GLO from '${d}/alexandria-glossario';`,
    `export * as TRI from '${d}/alexandria-trilhas';`,
    `export * as BAD from '${d}/alexandria-badges';`,
    `export * as BLK from '${d}/alexandria-blocks';`,
  ].join('\n'));
  const out = path.join(SCRATCH, 'codigo-m06.mjs');
  const esb = `${REPO}/node_modules/.bin/esbuild${process.platform === 'win32' ? '.cmd' : ''}`;
  execFileSync(esb, [entry, '--bundle', '--format=esm', '--platform=node', `--outfile=${out}`, `--alias:@=${REPO}/src`, '--log-level=error'], { stdio: 'inherit', shell: process.platform === 'win32' });
  return import('file:///' + out.replace(/\\/g, '/') + '?t=' + Date.now());
}

export function writeJson(nome, obj) {
  fs.writeFileSync(path.join(OUTDIR, nome), JSON.stringify(obj, null, 2) + '\n', 'utf8');
  console.log('escrito', nome);
}
export const hoje = '2026-09-17';
export const here = path.dirname(fileURLToPath(import.meta.url));
