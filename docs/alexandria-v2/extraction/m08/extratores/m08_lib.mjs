// Utilitários compartilhados da extração do M08. Leem a fonte (só leitura);
// nenhum texto de conteúdo é digitado aqui: tudo sai do arquivo por índice
// de caractere + regex, ou pela execução do <script> original num DOM falso.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo08.html';
export const REPO = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = `${REPO}/docs/alexandria-v2/extraction/m08`;
export const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';

export const html = fs.readFileSync(SRC, 'utf8');
export const LINES = html.split('\n');
export const lineOf = (idx) => html.slice(0, idx).split('\n').length;

export const decode = (s) => s
  .replace(/&nbsp;/g, '\u00a0').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
export const texto = (s) => decode(String(s).replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
export const inner = (s) => String(s).replace(/\s+/g, ' ').trim();
export const ini = (s, n = 70) => texto(String(s).replace(/<[^>]+>/g, ' ')).replace(/\s+([.,;:!?)])/g, '$1').slice(0, n);
export const origem = (seletor, trecho, idx) => ({ seletor, trecho_inicial: trecho, linha_aprox: lineOf(idx) });
export const pad = (n) => String(n).padStart(2, '0');
export const txt = (h) => ({ html: inner(h), texto: texto(h) });

/** Seção `<section id="X">` → {start,end,body} (índices absolutos). */
export function secao(id) {
  const start = html.indexOf(`<section id="${id}">`);
  if (start < 0) throw new Error('secao ' + id);
  const end = html.indexOf('</section>', start);
  return { id, start, end, body: html.slice(start, end) };
}
export const SECOES = [...html.matchAll(/<section id="([^"]+)">/g)].map((m) => m[1]);

export function all(re, s, base = 0) {
  const out = []; let m; const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  while ((m = r.exec(s))) out.push({ m, idx: base + m.index });
  return out;
}
export function one(re, s, base = 0, what = '') {
  const m = re.exec(s); if (!m) throw new Error('não casou ' + what + ' ' + re);
  return { m, idx: base + m.index };
}

/** <details><summary>…</summary><div class="det-bd"> … </div></details> */
export function detalhes(body, base) {
  return all(/<details[^>]*><summary>([\s\S]*?)<\/summary><div class="det-bd">([\s\S]*?)<\/div><\/details>/g, body, base);
}

// ── script original ───────────────────────────────────────────
const sOpen = html.indexOf('<script>');
const sClose = html.indexOf('</script>');
export const SCRIPT_START = sOpen + '<script>'.length;
export const SCRIPT = html.slice(SCRIPT_START, sClose);
export const scriptLine = (idxInScript) => lineOf(SCRIPT_START + idxInScript);
/** Linhas verbatim [a,b] do arquivo-fonte. */
export const linhas = (a, b) => LINES.slice(a - 1, b).join('\n');

/**
 * Executa o <script> original num DOM falso. Só as chamadas de ambiente são
 * simuladas; lógica e prosa do script ficam intactas. Retorna o contexto
 * (I1..I11, QZ, funções) e utilitários para dirigir os instrumentos.
 */
export function runSource() {
  const els = new Map();
  const seedInputs = (h) => {
    for (const m of String(h).matchAll(/<input\b([^>]*)>/g)) {
      const a = m[1];
      const g = (k) => { const r = new RegExp(`\\b${k}="([^"]*)"`).exec(a); return r ? r[1] : ''; };
      const id = g('id'); if (!id) continue;
      const e = get(id); e.min = g('min'); e.max = g('max'); e.value = g('value'); e.type = g('type');
    }
  };
  class El {
    constructor(id) {
      this.id = id; this._h = ''; this.textContent = ''; this.value = ''; this.min = ''; this.max = '';
      this.className = ''; this.style = {}; this.L = {};
      this.classList = { add() {}, remove() {} };
    }
    get innerHTML() { return this._h; }
    set innerHTML(v) { this._h = v; seedInputs(v); }
    addEventListener(t, f) { (this.L[t] ||= []).push(f); }
    getAttribute() { return null; }
    querySelectorAll() { return []; }
    fire(t, ev) { (this.L[t] || []).forEach((f) => f(ev || {})); }
  }
  function get(id) { if (!els.has(id)) els.set(id, new El(id)); return els.get(id); }
  seedInputs(html.slice(0, sOpen));
  const document = {
    getElementById: get,
    querySelectorAll: () => [],
    documentElement: { scrollHeight: 1000, clientHeight: 500, scrollTop: 0 },
  };
  const ctx = { document, window: { addEventListener() {} }, Math, Number, String, Object, Array, isFinite, console };
  vm.createContext(ctx);
  // desembrulha o IIFE para que os `var` fiquem acessíveis no contexto
  const body = SCRIPT.trim().replace(/^\(function\(\)\{\s*"use strict";/, '').replace(/\}\)\(\);\s*$/, '');
  vm.runInContext(body, ctx, { filename: 'alexandria_modulo08.script.js' });
  const click = (segId, v) => get(segId).fire('click', { target: { closest: () => ({ classList: { add() {}, remove() {} }, getAttribute: (k) => (k === 'data-f' ? v : null) }) } });
  const setNum = (id, v) => { const e = get(id); e.value = String(v); e.fire('input'); };
  const out = (id) => get(id).innerHTML;
  const cls = (id) => get(id).className;
  return { ctx, get, click, setNum, out, cls };
}

/** Lê o readout `.ro` → [{k, n, u}] (texto). */
export function readouts(h) {
  return [...String(h).matchAll(/<div class="ro"><div class="k">([\s\S]*?)<\/div><div class="n[^"]*">([\s\S]*?)(?:<span class="u">([\s\S]*?)<\/span>)?<\/div><\/div>/g)]
    .map((m) => ({ k: texto(m[1]), n: texto(m[2]), u: m[3] == null ? null : texto(m[3]) }));
}

/** Empacota um .ts do repositório (esbuild) e importa. Só leitura do src/. */
export async function importTs(rel) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'm08x-'));
  const out = path.join(dir, path.basename(rel).replace(/\.ts$/, '.mjs'));
  execFileSync(process.execPath, [`${REPO}/node_modules/esbuild/bin/esbuild`, `${REPO}/${rel}`, '--bundle', '--format=esm', '--platform=node', `--outfile=${out}`, '--log-level=error']);
  return import(pathToFileURL(out).href);
}

export const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1).replace('.', ',');
export const f0 = (n) => String(Math.round(n));
export const norm = (s) => texto(s).normalize('NFC');

export function writeJson(name, obj) {
  fs.writeFileSync(`${OUTDIR}/${name}`, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

/**
 * Filhos diretos de `<div class="wrap">` numa seção: [{tag, classe, id, outer, inner, start}].
 * Walker por profundidade de tag (não regex não-guloso), para não fechar no lugar errado.
 */
const VOID = new Set(['br', 'input', 'img', 'hr', 'meta', 'link']);
export function filhosDoWrap(sectionId) {
  const s = secao(sectionId);
  const w = html.indexOf('<div class="wrap">', s.start);
  const innerStart = w + '<div class="wrap">'.length;
  const re = /<(\/?)([a-zA-Z0-9]+)\b[^>]*?>|<!--[\s\S]*?-->/g;
  re.lastIndex = innerStart;
  const out = []; let depth = 0; let cur = null; let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue;
    const close = m[1] === '/'; const tag = m[2].toLowerCase();
    if (VOID.has(tag)) continue;
    if (!close) {
      if (depth === 0) {
        const cls = /class="([^"]*)"/.exec(m[0]); const id = /id="([^"]*)"/.exec(m[0]);
        cur = { tag, classe: cls ? cls[1] : null, id: id ? id[1] : null, start: m.index, openEnd: m.index + m[0].length };
      }
      depth++;
    } else {
      depth--;
      if (depth === 0 && cur) {
        cur.outer = html.slice(cur.start, m.index + m[0].length);
        cur.inner = html.slice(cur.openEnd, m.index);
        out.push(cur); cur = null;
      }
      if (depth < 0) break; // fechou o wrap
    }
  }
  return out;
}

/** Converte um filho do wrap em bloco tipado (texto verbatim + origem). */
export function bloco(el, secId, n) {
  const o = (sel) => origem(`section#${secId} ${sel}`, ini(el.inner, 70), el.start);
  const base = { ordem: n };
  if (el.classe === 'sec-id') {
    const m = /<b>([\s\S]*?)<\/b>\s*·\s*([\s\S]*)/.exec(el.inner);
    return { ...base, tipo: 'marcador', marcador: texto(m[1]), rotulo: texto(m[2]), origem: o('.sec-id') };
  }
  if (el.tag === 'h2') return { ...base, tipo: 'titulo_secao', ...txt(el.inner), origem: o('h2') };
  if (el.tag === 'h3') {
    const m = /<span class="num">([\s\S]*?)<\/span>([\s\S]*)/.exec(el.inner);
    return { ...base, tipo: 'subtitulo', numero: m ? texto(m[1]) : null, ...txt(m ? m[2] : el.inner), origem: o('h3') };
  }
  if (el.tag === 'h4') return { ...base, tipo: 'rotulo', ...txt(el.inner), origem: o('h4') };
  if (el.tag === 'p') return { ...base, tipo: el.classe === 'lede' ? 'lead' : 'paragrafo', ...txt(el.inner), origem: o(el.classe ? `p.${el.classe}` : 'p') };
  if (el.tag === 'table') {
    const head = [...el.inner.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((c) => texto(c[1]));
    const linhas = [...el.inner.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].filter((r) => /<td/.test(r[1]))
      .map((r) => [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => txt(c[1])));
    return { ...base, tipo: 'tabela', cabecalho: head, linhas, origem: o('table.tbl') };
  }
  if (el.tag === 'div' && /^box/.test(el.classe || '')) {
    const tag = /<span class="tag">([\s\S]*?)<\/span>/.exec(el.inner);
    const ps = [...el.inner.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((p) => txt(p[1]));
    return { ...base, tipo: 'destaque', classe: el.classe, rotulo: tag ? texto(tag[1]) : null, paragrafos: ps, bloco_de_produto_P7: tag ? /Onde isso entra no produto/.test(tag[1]) : false, origem: o(`div.${el.classe.replace(' ', '.')}`) };
  }
  if (el.tag === 'div' && el.classe === 'inst') {
    const nm = /<span class="nm">([\s\S]*?)<\/span><span class="id">([\s\S]*?)<\/span>/.exec(el.inner);
    return { ...base, tipo: 'instrumento', ref: `m08-inst-${texto(nm[2]).replace(/\D/g, '')}`, titulo: texto(nm[1]), rotulo_id: texto(nm[2]), nota: 'Conteúdo completo em instrumentos.json.', origem: o('div.inst') };
  }
  return { ...base, tipo: `${el.tag}${el.classe ? '.' + el.classe : ''}`, html: inner(el.inner), texto: texto(el.inner), origem: o(el.tag) };
}
