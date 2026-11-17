// Biblioteca comum dos extratores do M05. Todo texto de conteúdo sai do
// arquivo-fonte por posição (linha) + regex; nada é digitado.
// Adaptado de ../../m01/extratores/m01_modulo.mjs (mesmas convenções:
// html/texto, origem {seletor, trecho_inicial, linha_aprox}).
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo05.html';
export const REPO = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = `${REPO}/docs/alexandria-v2/extraction/m05`;
export const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';

const RAW = fs.readFileSync(SRC, 'utf8');
export const L = RAW.split('\n');
export const RAW_SRC = RAW;
export const ln = (n) => L[n - 1];
export const fail = (m) => { throw new Error(m); };

export const FONTE = {
  arquivo: SRC,
  linhas_total: L.length - (L[L.length - 1] === '' ? 1 : 0),
  bytes: Buffer.byteLength(RAW, 'utf8'),
  sha256: crypto.createHash('sha256').update(RAW).digest('hex'),
};

export const decode = (s) => s
  .replace(/&nbsp;/g, ' ')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&amp;/g, '&');
export const collapse = (s) => s.replace(/\s+/g, ' ').trim();
export const stripTags = (h) => collapse(decode(h.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '')));
export const txt = (html) => ({ html: collapse(html), texto: stripTags(html) });
export const trecho = (n) => collapse(ln(n)).slice(0, 90);
export const origem = (n, seletor) => ({ seletor, trecho_inicial: trecho(n), linha_aprox: n });

/** grupo 1 (ou g) de uma regex aplicada à linha n; falha se não casar */
export function at(n, re, g = 1) {
  const m = ln(n).match(re);
  if (!m) fail(`linha ${n} não casa ${re}: ${ln(n)}`);
  return m[g];
}
export const inner = (n, tag) => at(n, new RegExp(`<${tag}[^>]*>(.*)</${tag}>`));

/** primeira linha (>= from) que casa a regex */
export function find(re, from = 1, to = L.length) {
  for (let n = from; n <= to; n++) if (re.test(ln(n))) return n;
  fail(`não achei ${re} a partir de ${from}`);
}
export function findAll(re, from = 1, to = L.length) {
  const out = [];
  for (let n = from; n <= to; n++) if (re.test(ln(n))) out.push(n);
  return out;
}

/** faixa [ini, fim] de <section id="x"> … </section> */
export function secao(id) {
  const ini = find(new RegExp(`^<section id="${id}">`));
  const fim = find(/^<\/section>/, ini);
  return { ini, fim };
}

/** sec-id: <div class="sec-id"><b>X</b> · Y</div> */
export function secId(n) {
  const m = ln(n).match(/<div class="sec-id"><b>(.*?)<\/b> · (.*)<\/div>/);
  if (!m) fail(`sec-id ${n}`);
  return { marcador: m[1], rotulo: m[2] };
}

/** bloco de várias linhas: junta as linhas [a, b] */
export const joinLines = (a, b) => L.slice(a - 1, b).join('\n');

/** box: <div class="box X"><span class="tag">T</span><p>…</p></div> (3 linhas) */
export function box(nOpen, seletorPai) {
  const cls = at(nOpen, /<div class="(box [a-z]+)">/);
  const tag = at(nOpen + 1, /<span class="tag">(.*)<\/span>/);
  const p = inner(nOpen + 2, 'p');
  if (!/^\s*<\/div>/.test(ln(nOpen + 3))) fail(`box ${nOpen} não fecha em 3 linhas`);
  return { classe: cls, rotulo: tag, ...txt(p), origem: origem(nOpen, `${seletorPai} .${cls.replace(' ', '.')}`) };
}

/** atributos de uma tag numa linha */
export const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

/** <ol class="num-list"> ou <ol class="two-col"> ou <ul class="ck">: itens <li> entre nOpen e o fechamento */
export function listItems(nOpen, closeTag, seletor) {
  const fim = find(new RegExp(`^\\s*</${closeTag}>`), nOpen);
  const itens = [];
  for (let n = nOpen + 1; n < fim; n++) {
    const h = inner(n, 'li');
    const b = h.match(/^<b>(.*?)<\/b>\s*(.*)$/);
    itens.push({
      ordem: itens.length + 1,
      ...txt(h),
      ...(b ? { cabeca_html: b[1], cabeca_texto: stripTags(b[1]), corpo_html: collapse(b[2]), corpo_texto: stripTags(b[2]) } : {}),
      origem: origem(n, seletor),
    });
  }
  return { itens, fim };
}

/** <table class="tbl"> linhas entre nOpen e </table> */
export function tabela(nOpen, seletor) {
  const fim = find(/^\s*<\/table>/, nOpen);
  const linhas = [];
  for (let n = nOpen + 1; n < fim; n++) {
    const cells = [...ln(n).matchAll(/<t[hd]>(.*?)<\/t[hd]>/g)].map((m) => m[1]);
    linhas.push({ celulas_html: cells, celulas_texto: cells.map(stripTags), cabecalho: /<th>/.test(ln(n)), linha_aprox: n });
  }
  return { linhas, origem: origem(nOpen, seletor), fim };
}

/** script: faixa do <script> */
export const SCRIPT = (() => {
  const ini = find(/^<script>/);
  const fim = find(/^<\/script>/, ini);
  return { ini, fim, codigo: L.slice(ini, fim - 1).join('\n') };
})();

export const writeJson = (file, obj) => {
  fs.writeFileSync(path.join(OUTDIR, file), JSON.stringify(obj, null, 2) + '\n', 'utf8');
};

/** Empacota os módulos de dados do código (só leitura) num diretório temporário. */
export function buildCodigo() {
  const dir = path.join(os.tmpdir(), 'alexandria-m05-extracao');
  fs.mkdirSync(dir, { recursive: true });
  const alvos = {
    calc: 'src/lib/data/alexandria-instrument-calculators.ts',
    content05: 'src/lib/data/alexandria-modulo-05-content.ts',
    glossario: 'src/lib/data/alexandria-glossario.ts',
    blocks: 'src/lib/data/alexandria-blocks.ts',
    trilhas: 'src/lib/data/alexandria-trilhas.ts',
  };
  const out = {};
  for (const [k, rel] of Object.entries(alvos)) {
    const file = path.join(dir, `${k}.mjs`);
    // cache: reconstrói se o bundle não existe ou é mais velho que qualquer .ts de src/lib/data
    const dataDir = path.join(REPO, 'src/lib/data');
    const newest = Math.max(...fs.readdirSync(dataDir).map((f) => fs.statSync(path.join(dataDir, f)).mtimeMs));
    const fresh = fs.existsSync(file) && fs.statSync(file).mtimeMs > newest && !process.env.M05_REBUILD;
    if (fresh) { out[k] = 'file:///' + file.replace(/\\/g, '/'); continue; }
    execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx',
      ['esbuild', rel, '--bundle', '--format=esm', '--platform=node', '--alias:@=./src', `--outfile=${file}`, '--log-level=error'],
      { cwd: REPO, stdio: 'inherit', shell: process.platform === 'win32' });
    out[k] = 'file:///' + file.replace(/\\/g, '/');
  }
  return out;
}

export const HOJE = '2026-09-17';

// ── percorredor de blocos ────────────────────────────────────────────
// Classifica cada linha dentro de <section id> … </section>. Linha não
// reconhecida = erro (garante que nada é descartado em silêncio).
const endIndented = (nOpen) => {
  const ind = ln(nOpen).match(/^(\s*)/)[1];
  return find(new RegExp(`^${ind}</div>\\s*$`), nOpen + 1);
};

export function parseLv(nOpen) {
  const fim = endIndented(nOpen);
  const hd = at(nOpen + 1, /<div class="lv-hd">(.*)<\/div>/);
  const abas = [];
  const paineis = [];
  for (let n = nOpen; n <= fim; n++) {
    const b = ln(n).match(/<button class="lv-tab[^"]*" data-lv="(.*?)" data-p="(\d)">(.*)<\/button>/);
    if (b) abas.push({ grupo: b[1], p: +b[2], rotulo: b[3], linha_aprox: n });
    const p = ln(n).match(/<div class="lv-pane[^"]*" id="(.*?)">(.*)<\/div>/);
    if (p) paineis.push({ id_html: p[1], rotulo_aba: null, ...txt(p[2]), origem: origem(n, `.lv .lv-pane#${p[1]}`) });
  }
  paineis.forEach((p, i) => { p.rotulo_aba = abas[i]?.rotulo ?? null; });
  return { tipo: 'tres_niveis', titulo: hd, abas: abas.map((a) => a.rotulo), paineis, origem: origem(nOpen, 'div.lv'), fim };
}

export function parseMapGrid(nOpen) {
  const fim = endIndented(nOpen);
  const cards = [];
  for (let n = nOpen + 1; n < fim; n++) {
    const m = ln(n).match(/<a class="map-card" href="#(.*?)"><div class="n">(.*?)<\/div><div class="t">(.*?)<\/div><div class="d">(.*?)<\/div><\/a>/);
    if (!m) fail(`map-card ${n}`);
    cards.push({ href: `#${m[1]}`, rotulo_aula: m[2], titulo_card: m[3], descricao: txt(m[4]), origem: origem(n, '#map .map-grid a.map-card') });
  }
  return { tipo: 'mapa_cards', cards, origem: origem(nOpen, '#map .map-grid'), fim };
}

export function parseForm(nOpen, sel) {
  const fim = find(/^\s*<\/div>\s*$/, nOpen + 1);
  const linhas = [];
  let observacao = null;
  for (let n = nOpen + 1; n < fim; n++) {
    const s = ln(n).trim();
    const note = s.match(/^<span class="note">(.*)<\/span>$/);
    if (note) { observacao = { ...txt(note[1]), origem: origem(n, `${sel} .form .note`) }; continue; }
    const h = s.replace(/<br>$/, '');
    linhas.push({ ...txt(h), linha_aprox: n });
  }
  return { tipo: 'formula', linhas, observacao, origem: origem(nOpen, `${sel} div.form`), fim };
}

export function walk(secaoId) {
  const { ini, fim } = secao(secaoId);
  const sel = `section#${secaoId}`;
  const blocos = [];
  let n = ini + 1;
  const push = (b) => { blocos.push(b); };
  while (n < fim) {
    const s = ln(n);
    const t = s.trim();
    if (t === '' || t === '<div class="wrap">' || t === '</div>' || t === '<div class="scroll">') { n++; continue; }
    let m;
    if ((m = t.match(/^<!-- (.*) -->$/))) { push({ tipo: 'comentario_html', texto: m[1], linha_aprox: n }); n++; continue; }
    if (/^<div class="sec-id">/.test(t)) { push({ tipo: 'sec_id', ...secId(n), origem: origem(n, `${sel} .sec-id`) }); n++; continue; }
    if ((m = t.match(/^<h2>(.*)<\/h2>$/))) { push({ tipo: 'titulo_secao', ...txt(m[1]), origem: origem(n, `${sel} h2`) }); n++; continue; }
    if ((m = t.match(/^<p class="lede">(.*)<\/p>$/))) { push({ tipo: 'lede', ...txt(m[1]), origem: origem(n, `${sel} p.lede`) }); n++; continue; }
    if ((m = t.match(/^<h3><span class="num">(.*?)<\/span>(.*)<\/h3>$/))) { push({ tipo: 'titulo', numero: m[1], ...txt(m[2]), origem: origem(n, `${sel} h3`) }); n++; continue; }
    if ((m = t.match(/^<p>(.*)<\/p>$/))) { push({ tipo: 'paragrafo', ...txt(m[1]), origem: origem(n, `${sel} > p`) }); n++; continue; }
    if (/^<div class="form">$/.test(t)) { const b = parseForm(n, sel); n = b.fim + 1; delete b.fim; push(b); continue; }
    if (/^<table class="tbl">$/.test(t)) { const b = tabela(n, `${sel} table.tbl`); n = b.fim + 1; delete b.fim; push({ tipo: 'tabela', ...b }); continue; }
    if (/^<div class="box [a-z]+">$/.test(t)) { push({ tipo: 'box', ...box(n, sel) }); n += 4; continue; }
    if ((m = t.match(/^<(ol|ul) class="(.*?)">$/))) { const r = listItems(n, m[1], `${sel} ${m[1]}.${m[2]} > li`); push({ tipo: 'lista', classe: `${m[1]}.${m[2]}`, itens: r.itens, origem: origem(n, `${sel} ${m[1]}.${m[2]}`) }); n = r.fim + 1; continue; }
    if (/^<div class="inst">$/.test(t)) { const f = endIndented(n); push({ tipo: 'instrumento', id_fonte: at(n + 1, /<span class="id">(.*?)<\/span>/), titulo: at(n + 1, /<span class="nm">(.*?)<\/span>/), linhas: [n, f], origem: origem(n, `${sel} div.inst`) }); n = f + 1; continue; }
    if (/^<div class="lv">$/.test(t)) { const b = parseLv(n); n = b.fim + 1; delete b.fim; push(b); continue; }
    if (/^<div class="map-grid">$/.test(t)) { const b = parseMapGrid(n); n = b.fim + 1; delete b.fim; push(b); continue; }
    if ((m = t.match(/^<details><summary>(.*?)<\/summary><div class="det-bd">$/))) {
      const f = find(/^\s*<\/div><\/details>\s*$/, n);
      const ps = [];
      for (let k = n + 1; k < f; k++) ps.push({ ...txt(inner(k, 'p')), linha_aprox: k });
      push({ tipo: 'details', resumo: m[1], paragrafos: ps, origem: origem(n, `${sel} details`) });
      n = f + 1; continue;
    }
    if (/^<div id="quiz-box"><\/div>$/.test(t) || /^<div style="display:flex/.test(t) || /^<button class="btn/.test(t) || /^<div class="score"/.test(t)) {
      push({ tipo: 'ui_quiz', html: t, linha_aprox: n }); n++; continue;
    }
    fail(`walk(${secaoId}): linha ${n} não classificada: ${t.slice(0, 80)}`);
  }
  return { secao: secaoId, ini, fim, blocos };
}
