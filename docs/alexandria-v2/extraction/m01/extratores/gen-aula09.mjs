// Gera docs/alexandria-v2/extraction/m01/aula-09.json por extração programática.
// Nenhum texto de conteúdo é digitado à mão: tudo sai de fatias do HTML-fonte,
// por um caminhante de linhas que LANÇA ERRO diante de qualquer linha que não
// reconheça (nada é descartado em silêncio). Padrão da A08 (gen-aula08.mjs) e da A07 (gen-aula07.mjs).
// A09 não tem instrumento, figura nem exercício na fonte: o gerador MEDE essas ausências em vez de presumi-las.
// Uso: node gen-aula09.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const OUT = path.resolve(HERE, '../aula-09.json');
const raw = fs.readFileSync(SRC, 'utf8');
const L = raw.split(/\r?\n/);
const TOTAL = L[L.length - 1] === '' ? L.length - 1 : L.length;
const line = (n) => L[n - 1];

const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const strip = (h) => decode(h.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const stripSp = (h) => decode(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const trecho = (s) => strip(s).slice(0, 60);
const origem = (n, seletor, html) => ({ seletor, trecho_inicial: trecho(html), linha_aprox: n });
function inner(n, re) {
  const m = line(n).match(re);
  if (!m) throw new Error(`linha ${n} não casou ${re}: ${line(n)}`);
  return m[1];
}
function assertLine(n, needle) {
  if (!line(n).includes(needle)) throw new Error(`linha ${n} sem "${needle}": ${line(n)}`);
}
function blockEnd(n) {
  let d = 0;
  for (let i = n; i <= L.length; i++) {
    const s = line(i) ?? '';
    d += (s.match(/<div\b/g) || []).length - (s.match(/<\/div>/g) || []).length;
    if (d === 0) return i;
  }
  throw new Error('bloco sem fim a partir de ' + n);
}

// ---------- âncoras ----------
const S0 = 2100, S1 = 2174; // section.aula
assertLine(2098, 'AULA 09');
assertLine(S0, '<section class="aula">');
assertLine(2102, 'Aula 09');
assertLine(S1, '</section>');
assertLine(2173, '</div>');
assertLine(2095, '</section>'); // fim da A08, fora da posse

const AULA_ID = 'm01-a09';
const markerNum = inner(2102, /<span class="num">(.*?)<\/span>/);
const markerNome = inner(2102, /<span class="dot"><\/span><span>(.*?)<\/span>/);
const h2 = inner(2103, /<h2 class="aula-title">(.*)<\/h2>/);
const mapaCells = [...line(1347).trim().matchAll(/<td>(.*?)<\/td>/g)].map((m) => m[1]);

// ---------- blocos, na ordem da fonte ----------
const blocos = [];
let k = 0;
const bid = (t) => `${AULA_ID}-b${String(++k).padStart(2, '0')}-${t}`;
function push(tipo, n, seletor, campos, extra = {}) {
  const htmlRef = campos.html ?? campos.texto ?? campos.rotulo ?? campos.eq_html ?? campos.cabecalho?.[0]?.html ?? campos.itens?.[0]?.html ?? '';
  blocos.push({ id: bid(tipo), tipo, ...campos, origem: origem(n, seletor, htmlRef), ...extra });
}
let n = 2104;
const END_BODY = S1 - 2; // 2172
while (n <= END_BODY) {
  const t = line(n).trim();
  let m;
  if (t === '') { n++; continue; }
  if (t.startsWith('<!--')) throw new Error('comentário inesperado em ' + n);
  if ((m = t.match(/^<p class="lead">(.*)<\/p>$/))) {
    push('lead', n, 'section.aula(Aula 09) > .container > p.lead', { html: m[1], texto: strip(m[1]) });
    n++; continue;
  }
  if ((m = t.match(/^<h3><span class="num">(.*?)<\/span>(.*)<\/h3>$/))) {
    push('titulo', n, `h3 > span.num(${m[1]})`, { numero: m[1], texto: strip(m[2]), html: t.replace(/^<h3>|<\/h3>$/g, '') });
    n++; continue;
  }
  if ((m = t.match(/^<p>(.*)<\/p>$/))) {
    push('paragrafo', n, `p (após h3 ${[...blocos].reverse().find((b) => b.tipo === 'titulo')?.numero})`, { html: m[1], texto: strip(m[1]) });
    n++; continue;
  }
  if ((m = t.match(/^<div class="callout( (\w+))?">$/))) {
    const e = blockEnd(n);
    const lab = inner(n + 1, /<div class="callout-label">(.*)<\/div>/);
    const ps = [];
    for (let i = n + 2; i < e; i++) { const pm = line(i).trim().match(/^<p>(.*)<\/p>$/); if (pm) ps.push({ i, h: pm[1] }); else if (line(i).trim() !== '') throw new Error('linha inesperada no callout ' + i); }
    if (ps.length !== 1) throw new Error('callout com ' + ps.length + ' parágrafos em ' + n);
    push('destaque', n, `div.callout${m[2] ? '.' + m[2] : ''}`, {
      tom: m[2] ?? 'neutro', classe_fonte: t.replace(/^<div class="|">$/g, ''), rotulo: strip(lab), rotulo_html: lab, html: ps[0].h, texto: strip(ps[0].h), corpo_origem: origem(ps[0].i, 'div.callout > p', ps[0].h),
    }, { linha_fim_aprox: e });
    n = e + 1; continue;
  }
  if (t.startsWith('<div class="table-wrap">')) {
    const e = blockEnd(n);
    const th = [], linhas = [];
    let tbl = null;
    for (let i = n; i <= e; i++) {
      const s = line(i).trim();
      if (s.startsWith('<table>')) tbl = i;
      let mm;
      if ((mm = s.match(/^<thead><tr>(.*)<\/tr><\/thead>$/))) for (const c of mm[1].matchAll(/<th>(.*?)<\/th>/g)) th.push({ html: c[1], texto: strip(c[1]) });
      else if ((mm = s.match(/^<tr>(.*)<\/tr>$/))) {
        const cells = [...mm[1].matchAll(/<td( class="([^"]*)")?>(.*?)<\/td>/g)].map((c) => ({ html: c[3], texto: strip(c[3]), classe_td: c[2] ?? null }));
        if (!cells.length) throw new Error('linha de tabela sem td em ' + i);
        linhas.push({ celulas: cells, origem: { seletor: 'tbody > tr', trecho_inicial: cells[0].texto, linha_aprox: i } });
      }
    }
    if (!th.length || linhas.some((r) => r.celulas.length !== th.length)) throw new Error('tabela irregular em ' + n);
    push('tabela', tbl, 'div.table-wrap > table', { cabecalho: th, linhas, n_colunas: th.length, n_linhas: linhas.length, texto: null }, { linha_fim_aprox: e });
    n = e + 1; continue;
  }
  if ((m = t.match(/^<ul( [^>]*)?>$/))) {
    const itens = []; let i = n + 1;
    for (; !line(i).trim().startsWith('</ul>'); i++) {
      const mm = line(i).trim().match(/^<li( [^>]*)?>(.*)<\/li>$/);
      if (!mm) throw new Error('item de lista inesperado em ' + i);
      itens.push({ html: mm[2], texto: strip(mm[2]), li_attr: (mm[1] || '').trim() || null, origem: { seletor: 'ul > li', trecho_inicial: trecho(mm[2]), linha_aprox: i } });
    }
    push('lista', n, 'ul', { itens, ul_attr: (m[1] || '').trim() || null, texto: null }, { linha_fim_aprox: i });
    n = i + 1; continue;
  }
  throw new Error(`linha ${n} não reconhecida pelo caminhante: ${line(n)}`);
}
const bl = (tipo) => blocos.filter((b) => b.tipo === tipo);

// ---------- ausências, medidas na fatia ----------
const aulaHtml = L.slice(S0 + 1, S1 - 1).join('\n');
const med = (re) => (aulaHtml.match(re) || []).length;
const medidas = {
  instrument: med(/class="instrument/g), input: med(/<input\b/g), script: med(/<script\b/g), svg: med(/<svg\b/g), img: med(/<img\b/g),
  video_iframe: med(/<(video|iframe)\b/g), button: med(/<button\b/g), id_i09: med(/\bi09\b|INST · 09|INSTRUMENT 09/g), vale_lembrar: med(/Vale lembrar/g), exercise: med(/class="exercise/g), cf_ou_triangle: med(/cf-chart|triangle-vis/g),
};
const scriptsComI09 = L.filter((s) => /i09-|INSTRUMENT 09/.test(s)).length;

// ---------- exercícios: varredura dos três campos (protocolo §4) ----------
const exercs = [];
for (let i = 1; i <= TOTAL; i++) {
  if (line(i).includes('<div class="exercise">')) {
    const e = blockEnd(i);
    const tag = inner(i + 1, /<span class="exercise-tag">(.*?)<\/span>/);
    const q = line(i + 2).trim();
    const a = L.slice(i + 3, e).join(' ');
    exercs.push({ linha: i, tag, texto3campos: strip(`${tag} ${q} ${a}`) });
  }
}
const reTema = /Aula 09|qualidade de energia|harm[oô]nic|afundamento|desequil[ií]brio|flicker|sobretens|interrup[cç]|DEC\b|FEC\b|DIC\b|FIC\b|PRODIST|DRP|DRC/i;
const exVinculados = exercs.filter((e) => /Aula 09/.test(e.tag));
const exComTema = exercs.filter((e) => reTema.test(e.texto3campos)).map((e) => ({ tag: e.tag, linha: e.linha, casou: e.texto3campos.match(reTema)[0] }));
const todasTags = exercs.map((e) => e.tag);
const drillIntro = inner(2389, /<p>(.*)<\/p>/);

// ---------- quiz e checklist ----------
const quizStart = L.findIndex((s) => s.includes('const questions = ['));
const qLines = [];
for (let i = quizStart + 1; i < quizStart + 110; i++) if (/^\s*q: "/.test(L[i - 1] ?? '')) qLines.push(i);
const quizComTema = qLines.filter((x) => reTema.test(L.slice(x - 1, x + 12).join(' '))).map((x) => ({ linha: x, q: inner(x, /q: "(.*)",$/) }));
const ckl = (nn, id) => ({ id, tipo: 'item_checklist_final', vinculo_declarado: null, vinculo_nota: 'Checklist do § Final sem tag de aula; correspondência apenas temática.', texto: inner(nn, /<div class="text">(.*?)<\/div>/), origem: { seletor: '§ Final div.checklist-item > div.text', trecho_inicial: inner(nn, /<div class="text">(.*?)<\/div>/).slice(0, 60), linha_aprox: nn } });
const relacionados = [ckl(2508, 'm01-checklist-qualidade')];

// ---------- remissões e menções de outras partes ----------
const sentencaCom = (s, re) => strip(s).split(/(?<=[.!?])\s+/).find((x) => re.test(x)) ?? strip(s);
const remissoes = [], mencoes = [];
for (let i = 1; i <= TOTAL; i++) {
  if (i >= S0 && i <= S1) continue;
  const s = line(i);
  if (/Aula 09/.test(strip(s)) && !/exercise-tag|aula-marker/.test(s)) {
    const sent = sentencaCom(s, /Aula 09/);
    remissoes.push({ texto: sent, origem: { seletor: 'prosa de outra seção', trecho_inicial: sent.slice(0, 60), linha_aprox: i } });
  }
  if (i < 2176 || i > 2386) { // fora do § Caso: o § Caso é aparato, citado à parte
    if (/qualidade de energia|Power Quality|\bPQA\b|Qualidade do Fornecimento|qualidade do produto/i.test(strip(s)) && !/Aula 09/.test(strip(s)) && !(i === 1347)) {
      const sent = sentencaCom(s, /qualidade de energia|Power Quality|\bPQA\b|Qualidade do Fornecimento|qualidade do produto/i);
      if (sent.length < 700) mencoes.push({ texto: sent, origem: { seletor: 'outra seção (menção temática)', trecho_inicial: sent.slice(0, 60), linha_aprox: i } });
    }
  }
}

// ---------- termos do léxico ----------
const aulaTexto = stripSp(aulaHtml); // tags viram espaço: strip() cola células/spans vizinhos e derruba a fronteira de palavra (artefato visto na A08)
const gloss = [];
for (let i = 2520; i <= 2690; i++) {
  const m = (line(i) || '').match(/<summary><span class="term">(.*?)<\/span><span class="unit">(.*?)<\/span><\/summary>/);
  if (m) gloss.push({ n: i, term: decode(m[1]), unit: decode(m[2]), def: inner(i + 1, /<div class="glossary-content">(.*)<\/div>/) });
}
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function variantes(term) {
  const v = [];
  const base = term.replace(/\s*\(.*\)\s*$/, '').trim();
  base.split(/\s+\/\s+/).forEach((p) => v.push(p));
  const ab = term.match(/\(([^)]+)\)/)?.[1];
  if (ab) v.push(ab);
  const num = term.match(/\d[\d.]*\/\d+/)?.[0];
  if (num) v.push(num);
  return [...new Set(v)].filter((x) => x.length >= 2);
}
const termos = [];
for (const g of gloss) {
  const achados = [];
  for (const v of variantes(g.term)) {
    const flags = v.length <= 5 ? 'gu' : 'giu';
    const re = new RegExp(`(^|[^\\p{L}\\p{N}])(${escRe(v)})(?![\\p{L}\\p{N}])`, flags);
    const ocorr = []; let mm;
    while ((mm = re.exec(aulaTexto))) { const ini = mm.index + mm[1].length; ocorr.push(aulaTexto.slice(Math.max(0, ini - 45), ini + v.length + 45)); }
    if (ocorr.length) achados.push({ variante: v, n_ocorrencias: ocorr.length, ocorrencias_contexto: ocorr.slice(0, 12) });
  }
  if (achados.length) termos.push({ termo: g.term, unidade_rotulo: g.unit, definicao_html: g.def, achados, origem: { seletor: '§ Lex details.glossary-item > summary > span.term', trecho_inicial: g.term, linha_aprox: g.n } });
}

// ---------- cobertura por token (§5) ----------
const tok = (s) => (s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[\p{L}\p{N}]+/gu) || []);
const ext = [markerNum, markerNome, stripSp(h2)];
const cellsOf = (b) => [...b.cabecalho.map((c) => c.html), ...b.linhas.flatMap((r) => r.celulas.map((c) => c.html))];
for (const b of blocos) {
  if (b.tipo === 'tabela') ext.push(...cellsOf(b).map(stripSp));
  else if (b.tipo === 'lista') ext.push(...b.itens.map((i) => stripSp(i.html)));
  else if (b.tipo === 'destaque') ext.push(stripSp(b.rotulo_html), stripSp(b.html));
  else if (b.tipo === 'titulo') ext.push(b.numero, stripSp(b.html));
  else if (b.html) ext.push(stripSp(b.html));
}
const bag = new Map();
for (const t of tok(ext.join(' '))) bag.set(t, (bag.get(t) || 0) + 1);
const srcTok = tok(stripSp(L.slice(S0 - 1, S1).join('\n'))); // sem instrumento a descontar
let hit = 0; const faltando = [];
for (const t of srcTok) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else faltando.push(t); }
const cobertura = { tokens_fonte_sem_instrumento: srcTok.length, tokens_casados: hit, pct: +(100 * hit / srcTok.length).toFixed(1), tokens_nao_casados: faltando, faixa_denominador: { de: S0, ate: S1, excluido: null } };

// ---------- comparação com o código portado ----------
const DATA = path.join(REPO, 'src/lib/data/');
const codeContent = fs.readFileSync(DATA + 'alexandria-modulo-01-content.ts', 'utf8');
const codeGloss = fs.readFileSync(DATA + 'alexandria-glossario.ts', 'utf8');
const js = (s) => JSON.stringify(s).slice(1, -1);
const presente = (hay, s) => hay.includes(js(s)) || hay.includes(s);
const slice = (key) => (codeContent.match(new RegExp(`'${key}': \\[[\\s\\S]*?\\n  \\],`)) || [''])[0];
const CK = 'aula-01-09';
const corpoCod = slice(CK);
const porBloco = [];
for (const b of blocos) {
  const r = { bloco: b.id, tipo: b.tipo, linha: b.origem.linha_aprox };
  if (b.tipo === 'lead') r.verbatim_no_codigo = presente(codeContent, b.html);
  else if (b.tipo === 'titulo') r.verbatim_no_codigo = corpoCod.includes(`numero: ${JSON.stringify(b.numero)}, texto: ${JSON.stringify(b.texto)}`);
  else if (b.tipo === 'paragrafo') r.verbatim_no_codigo = presente(corpoCod, b.html);
  else if (b.tipo === 'destaque') { r.rotulo_no_codigo_como_nota = presente(corpoCod, b.rotulo_html); r.corpo_no_codigo = presente(corpoCod, b.html); r.verbatim_no_codigo = r.rotulo_no_codigo_como_nota && r.corpo_no_codigo; }
  else if (b.tipo === 'tabela') { r.celulas = cellsOf(b).length; r.celulas_verbatim = cellsOf(b).filter((c) => presente(corpoCod, c)).length; r.verbatim_no_codigo = r.celulas === r.celulas_verbatim; }
  else if (b.tipo === 'lista') { r.itens = b.itens.length; r.itens_no_codigo = b.itens.filter((i) => presente(corpoCod, i.html)).length; r.verbatim_no_codigo = r.itens === r.itens_no_codigo; }
  porBloco.push(r);
}
const celulasComClasse = bl('tabela').flatMap((b) => b.linhas.flatMap((r) => r.celulas)).filter((c) => c.classe_td).length;
const checks = {
  por_bloco: porBloco,
  span_orfao_no_corpo: (corpoCod.match(/<\/span>/g) || []).length,
  span_na_fonte_da_aula: med(/<span\b/g),
  lista_no_corpo_codigo: /kind: 'lista'/.test(corpoCod),
  classe_mono_no_corpo_codigo: /class=\\?"mono/.test(corpoCod),
  celulas_td_com_classe_na_fonte: celulasComClasse,
  atividades_vazias_no_codigo: /id: 'aula-01-09'[\s\S]*?activities: \[\s*\]/.test(codeContent),
  instruments_vazio_no_codigo: /id: 'aula-01-09'[\s\S]*?instruments: \[\s*\]/.test(codeContent),
  marca_gridalpha_na_fonte_da_aula: (aulaHtml.match(/GridAlpha/g) || []).length,
  marca_gridalpha_no_corpo_codigo: (corpoCod.match(/GridAlpha/g) || []).length,
  marca_nivar_no_corpo_codigo: (corpoCod.match(/NIVAR/g) || []).length,
};
const glossCod = [...codeGloss.matchAll(/term:\s*"([^"]+)"[\s\S]*?aulaIds:\s*\[([^\]]*)\]/g)].map((m) => ({ termo: m[1], aulaIds: [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]) })).filter((g) => g.aulaIds.some((a) => a.startsWith('aula-01-')) && gloss.some((s) => s.term === g.termo));
const comAula = glossCod.filter((g) => g.aulaIds.includes(CK)).map((g) => g.termo);
const candidatosTxt = termos.map((t) => t.termo);
checks.glossario = { verbetes_lidos_no_codigo: glossCod.length, ligados_a_aula_no_codigo: comAula, candidatos_textuais_na_fonte: candidatosTxt, ligados_no_codigo_sem_ocorrencia_textual: comAula.filter((x) => !candidatosTxt.includes(x)), ocorrencia_textual_sem_ligacao_no_codigo: candidatosTxt.filter((x) => !comAula.includes(x)) };

const lista0 = bl('lista')[0];
const destaques = bl('destaque');
const comparacao_codigo = {
  arquivos: [
    'src/lib/data/alexandria-modulo-01-content.ts (MODULO_01_LEAD aula-01-09 ~l.171; MODULO_01_CORPO aula-01-09 ~l.313-328; MODULO_01_AULAS aula-01-09 ~l.550-569)',
    'src/lib/data/alexandria-glossario.ts (aulaIds)',
  ],
  verificacoes_programaticas: checks,
  conforme: [
    'Lead (p.lead) verbatim em MODULO_01_LEAD["aula-01-09"].',
    'Títulos 9.1–9.4 com número e texto corretos.',
    `As 3 tabelas (9.1: 3×3, 9.2: 6×3, 9.3: 5×3) com todas as ${porBloco.filter((x) => x.tipo === 'tabela').reduce((a, x) => a + x.celulas, 0)} células (cabeçalho incluído) verbatim, com o <b> preservado.`,
    'Os 4 parágrafos de prosa (9.1, 9.3, 9.4 e o corpo do callout PRODIST) verbatim.',
    'activities: [] e instruments: [] — coerente com a fonte (a A09 não tem exercício nem instrumento; medido).',
    'durationMinutes / difficulty / video = null, coerente com a fonte.',
  ],
  divergencias: [
    { id: 'COD-01', gravidade: 'alta', onde: 'MODULO_01_CORPO["aula-01-09"]', o_que: `A lista <ul> de 9.4 (${lista0.itens.length} itens: ${lista0.itens.map((i) => i.texto.replace(/[;.]$/, '')).join(' · ')}) não foi portada: o código não tem nenhum bloco kind 'lista' em aula-01-09 (medido: ${checks.lista_no_corpo_codigo ? 'tem' : 'não tem'}; itens presentes no corpo: ${porBloco.find((x) => x.tipo === 'lista').itens_no_codigo}/${lista0.itens.length}). O parágrafo "${strip(blocos[blocos.indexOf(lista0) - 1].html)}" termina em dois-pontos e o bloco seguinte já é o callout. Perda silenciosa.`, fonte: `linhas ${lista0.origem.linha_aprox}-${lista0.linha_fim_aprox}` },
    { id: 'COD-02', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-09"] callouts', o_que: `Os dois callouts ("${destaques[0].rotulo}" e "${destaques[1].rotulo}") foram portados como nota { tom: "neutro", label: null, html: <rótulo> } seguida de parágrafo solto. Na fonte o texto é o RÓTULO (div.callout-label) e o parágrafo é o CORPO do mesmo callout. Hierarquia partida (mesma natureza do COD-08 da A08).`, fonte: `linhas ${destaques[0].origem.linha_aprox}-${destaques[0].linha_fim_aprox}, ${destaques[1].origem.linha_aprox}-${destaques[1].linha_fim_aprox}` },
    { id: 'COD-03', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-09"] corpo do callout "Onde isso entra no produto"', o_que: `Não verbatim: a fonte diz "No Power Quality Audit (PQA) da GridAlpha, …"; o código diz "… da NIVAR, …" (ocorrências de "GridAlpha" na fonte da aula: ${checks.marca_gridalpha_na_fonte_da_aula}; no corpo portado: ${checks.marca_gridalpha_no_corpo_codigo}; "NIVAR" no corpo portado: ${checks.marca_nivar_no_corpo_codigo}). Troca editorial (P24) sem marca no código. Além disso, este callout é o bloco de produto que o P7 manda não exibir (README do m01); o código o mantém.`, fonte: `linha ${destaques[1].origem.linha_aprox + 2}` },
    { id: 'COD-04', gravidade: 'baixa', onde: 'MODULO_01_CORPO["aula-01-09"] tabela 9.2', o_que: `Nas células da primeira coluna da tabela 9.2 a fonte tem <td class="mono"> (${checks.celulas_td_com_classe_na_fonte} células: DEC, FEC, DIC, FIC, DMIC, DICRI). O tipo 'tabela' do código só guarda o html da célula; a classe mono se perdeu (medido: ${checks.classe_mono_no_corpo_codigo ? 'presente' : 'ausente'} no corpo). Só aparência; o texto está intacto.`, fonte: 'linhas 2126-2131' },
    { id: 'COD-05', gravidade: 'baixa', onde: 'alexandria-glossario.ts aulaIds', o_que: `aulaIds contêm "aula-01-09" em ${comAula.length} verbetes (${comAula.join('; ')}); a fonte não declara aula por termo. Candidatos textuais medidos na section: ${candidatosTxt.join('; ')}. Ligados no código sem ocorrência textual na aula: ${checks.glossario.ligados_no_codigo_sem_ocorrencia_textual.join('; ') || 'nenhum'}. Ocorrência textual sem ligação no código: ${checks.glossario.ocorrencia_textual_sem_ligacao_no_codigo.join('; ') || 'nenhum'}. Derivação do código; ler "ocorrencias_contexto" antes de ligar (§2): "Frequência" aqui é "frequência de interrupções", não os 60 Hz.`, fonte: 'linhas 2520-2690' },
    { id: 'COD-06', gravidade: 'informativa', onde: 'ids', o_que: 'Código usa "aula-01-09"; esta extração usa "m01-a09" (id estável com prefixo de módulo). Não há instrumento nem exercício a mapear.', fonte: null },
  ],
};
if (checks.span_orfao_no_corpo > 0) comparacao_codigo.divergencias.push({ id: 'COD-07', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-09"]', o_que: `${checks.span_orfao_no_corpo} </span> órfão(s) no corpo portado.`, fonte: null });
else comparacao_codigo.conforme.push(`Sem </span> órfão no corpo de aula-01-09 (medido: ${checks.span_orfao_no_corpo}; a fonte da aula tem ${checks.span_na_fonte_da_aula} <span>, só nos marcadores).`);

// ---------- divergências da fonte (duas leituras, sem escolha) ----------
const promessa = remissoes.find((r) => /voltaremos a este ponto/.test(r.texto));
if (!promessa) throw new Error('promessa da 3.5 não encontrada');
const celulasFreq = bl('tabela').flatMap((b) => b.linhas.flatMap((r) => r.celulas.map((c) => ({ t: c.texto, i: r.origem.linha_aprox })))).filter((c) => /Frequ[êe]ncia/.test(c.t));
const nHz = (aulaTexto.match(/\bHz\b|60 vezes|sincron|ciclos/g) || []).length;
const a07callout = strip(inner(1990, /<p>(.*)<\/p>/)).match(/Os fenômenos de qualidade do produto[^.]*\./)[0];
const prodRow = bl('tabela')[0].linhas.find((r) => /Qualidade do produto/.test(r.celulas[0].texto));
const tags = todasTags.join(' | ');
const tit93 = bl('titulo').find((b) => b.numero === '9.3');
const tab93 = bl('tabela')[2];
const fenomenos = tab93.linhas.map((r) => r.celulas[0].texto);
const divergencias = [
  {
    id: 'DIV-01', tipo: 'promessa_da_fonte_nao_cumprida',
    o_que: 'A 3.5 promete voltar à frequência quando "estudarmos qualidade de energia na Aula 09"; a A09 não volta a ela.',
    leitura_a: { texto: promessa.texto, origem: promessa.origem },
    leitura_b: { texto: celulasFreq.map((c) => c.t).join(' | '), origem: { seletor: 'tabelas 9.1 e 9.2 (células com "Frequência")', trecho_inicial: celulasFreq[0].t.slice(0, 40), linha_aprox: celulasFreq[0].i, linha_fim_aprox: celulasFreq[celulasFreq.length - 1].i }, argumento: `Medido: as únicas ocorrências de "Frequência" na section são ${celulasFreq.length} células e todas dizem frequência de INTERRUPÇÕES (FEC, FIC, "Frequência e duração de interrupções"), não a frequência da rede. Ocorrências de "Hz", "60 vezes", "sincron" ou "ciclos" na A09: ${nHz}.` },
    decisao: 'não escolhida — preservada a promessa e o que a A09 de fato traz. A fonte não cumpre nem retira a promessa.',
  },
  {
    id: 'DIV-02', tipo: 'prosa_x_markup_modulo',
    o_que: 'Afirmação do § Drill sobre a cobertura dos exercícios, contra a A09 sem exercício.',
    leitura_a: { texto: drillIntro, origem: { seletor: '§ Drill > p', trecho_inicial: trecho(drillIntro), linha_aprox: 2389 } },
    leitura_b: { texto: tags, origem: { seletor: 'span.exercise-tag (8 ocorrências)', trecho_inicial: todasTags[0], linha_aprox: exercs[0].linha + 1, linha_fim_aprox: exercs[exercs.length - 1].linha + 1 }, argumento: `Tags com "Aula 09": ${exVinculados.length}. A varredura dos três campos (tag, enunciado, gabarito) dos ${exercs.length} exercícios por tema da A09 (qualidade, harmônicos, afundamento, DEC/FEC/DIC/FIC, PRODIST, DRP/DRC…) acha: ${exComTema.length ? exComTema.map((e) => `${e.tag} ("${e.casou}")`).join('; ') : 'nenhum'}.` },
    decisao: 'não escolhida — o markup vence para posse (§5); a A09 fica sem exercício, e a prosa é registrada.',
  },
  {
    id: 'DIV-03', tipo: 'fonte_x_fonte_entre_aulas',
    o_que: 'A07 trata fator de potência como fenômeno de "qualidade do produto" do PRODIST Módulo 8; a tabela 9.1 da A09 define "Qualidade do produto" como conformidade da tensão e não cita fator de potência.',
    leitura_a: { texto: a07callout, origem: { seletor: 'A07 callout "Referência regulatória" > p', trecho_inicial: 'Os fenômenos de qualidade do produto', linha_aprox: 1990 } },
    leitura_b: { texto: prodRow.celulas.map((c) => c.texto).join(' | '), origem: { seletor: 'tabela 9.1 > tr(Qualidade do produto)', trecho_inicial: prodRow.celulas[0].texto, linha_aprox: prodRow.origem.linha_aprox }, argumento: 'A tabela 9.3 (fenômenos) também não tem fator de potência. O léxico do PRODIST (L2649) lista "continuidade, tensão, fator de potência, harmônicos".' },
    decisao: 'não escolhida — as duas definições de "qualidade do produto" coexistem na fonte.',
  },
  {
    id: 'DIV-04', tipo: 'fonte_titulo_x_conteudo',
    o_que: 'O h3 9.3 nomeia três fenômenos, a tabela traz cinco e o checklist final pede "três".',
    leitura_a: { texto: `${tit93.numero} ${tit93.texto}`.replace(/^9\.3 /, ''), origem: { seletor: 'h3(9.3)', trecho_inicial: tit93.texto, linha_aprox: tit93.origem.linha_aprox }, argumento: 'O título diz "Harmônicos, afundamentos e desequilíbrios".' },
    leitura_b: { texto: fenomenos.join(' | '), origem: { seletor: 'tabela 9.3 > tr > td:first-child', trecho_inicial: fenomenos[0], linha_aprox: tab93.linhas[0].origem.linha_aprox, linha_fim_aprox: tab93.linhas[tab93.linhas.length - 1].origem.linha_aprox }, argumento: 'A tabela acrescenta "Sobretensão" e "Flicker (flutuação de tensão)". O item do checklist final (L2508) diz: "Listar três fenômenos de qualidade de energia e sua consequência industrial."' },
    decisao: 'não escolhida — título (3), tabela (5) e checklist (três a listar) coexistem.',
  },
];

const out = {
  meta: {
    grupo: 'aula09', modulo: 'M01', aula: 'M01·A09', fonte: SRC, fonte_somente_leitura: true, fonte_total_linhas: TOTAL,
    aula_linhas: { inicio: 2098, fim: S1, nota: `comentário de abertura 2098; section.aula ${S0}-${S1}` },
    extraido_em: new Date().toISOString().slice(0, 10),
    metodo: 'Extração programática (script node que caminha as linhas da section e lança erro diante de qualquer linha não reconhecida; nenhuma prosa digitada). Campos `html` guardam o innerHTML literal; campos `texto` são o mesmo conteúdo com tags removidas e entidades decodificadas.',
    protocolo: 'docs/alexandria/extraction-protocol.md', taxonomia: 'docs/alexandria/instrument-taxonomy.md',
    contrato: 'docs/alexandria-v2/bar.md (§4 Peça C, §9, P3, P5, P6, P8, P9, P11, P14)',
    convencoes: {
      ausencia: 'null / [] + campo *_nota explicando o que foi medido',
      ids: 'm01-a09-bNN-<tipo> para blocos (ordem da fonte)',
      vinculos: 'só quando a fonte declara (tag, posição dentro da section, remissão textual literal); correspondência textual é marcada como tal',
      derivados: 'chaves `derivado` / `*_nota` / `argumento` / `decisao` são comentário do extrator, fora da prova literal',
    },
  },
  aula: {
    id: AULA_ID, numero: 9,
    marcador: { num: markerNum, nome: markerNome, origem: origem(2102, 'div.aula-marker', `${markerNum} ${markerNome}`) },
    titulo_h2_html: h2, titulo_h2_texto: strip(h2), titulo_h2_origem: origem(2103, 'h2.aula-title', h2),
    pergunta_mapa: { numero: strip(mapaCells[0]), tema: strip(mapaCells[1]), pergunta_html: mapaCells[2], pergunta_texto: strip(mapaCells[2]), origem: origem(1347, '§ MAP table > tbody > tr(09)', mapaCells[2]), nota: 'Única pergunta que a fonte declara para esta aula. Vive na tabela do § MAP, não na aula.' },
    duracao_min: null, dificuldade: null, video: null,
    ausencias_nota: `Sem duração, dificuldade, vídeo, <img>, referência por aula ou "Vale lembrar" dentro da section. Medido na fatia ${S0}-${S1}: <img> = ${medidas.img}, <video>/<iframe> = ${medidas.video_iframe}, "Vale lembrar" = ${medidas.vale_lembrar}.`,
  },
  blocos,
  figuras: [], figuras_nota: `Nenhuma figura (medido na fatia: <svg> = ${medidas.svg}, <img> = ${medidas.img}, cf-chart/triangle-vis = ${medidas.cf_ou_triangle}). A única estrutura "visual" são as 3 tabelas.`,
  tabelas_ids: bl('tabela').map((b) => b.id),
  listas_ids: bl('lista').map((b) => b.id),
  destaques: destaques.map((b) => b.id),
  vale_lembrar: null, vale_lembrar_nota: 'A expressão "Vale lembrar" não ocorre no HTML do M01. Os destaques da aula são 2 callouts neutros.',
  termos_lexico: {
    vinculo_declarado_pela_fonte: false,
    nota: 'O glossário da fonte (§ Lex, linhas ~2520-2690) não declara aula por termo. Abaixo: verbetes cujo nome-base, variante por "/" ou abreviação entre parênteses ocorre como palavra no texto da section. Correspondência textual, não posse — ler ocorrencias_contexto antes de ligar (§2 do protocolo).',
    total_verbetes_fonte: gloss.length, candidatos: termos,
  },
  instrumentos: [],
  instrumentos_nota: `A fonte não tem instrumento nesta aula. Medido na fatia ${S0}-${S1}: class="instrument*" = ${medidas.instrument}, <input> = ${medidas.input}, <button> = ${medidas.button}, <script> = ${medidas.script}, ids i09-/INSTRUMENT 09 = ${medidas.id_i09}; no arquivo inteiro, linhas com "i09-" ou "INSTRUMENT 09" = ${scriptsComI09}. Os instrumentos do M01 são INST·01–06 (nenhum na A09) e LAB·01 (§ Lab).`,
  invocacoes_no_texto: [],
  invocacoes_nota: 'Sem instrumento nem figura para a prosa invocar.',
  remissoes_de_outras_partes: remissoes,
  mencoes_tematicas_fora_da_aula: mencoes,
  exercicios: [],
  exercicios_nota: `Nenhum exercício vinculado: dos ${exercs.length} div.exercise do § Drill, tags com "Aula 09" = ${exVinculados.length}. Varredura dos três campos (tag, enunciado, gabarito) por tema da A09: ${exComTema.length ? exComTema.map((e) => `${e.tag} (${e.casou})`).join('; ') : 'nenhum casa'} (protocolo §4). Tags: ${todasTags.join(' | ')}.`,
  exercicios_varredura: { total_exercicios_fonte: exercs.length, tags_com_Aula_09: exVinculados.map((e) => e.tag), casam_o_tema_sem_tag: exComTema, tags_todas: todasTags, campos_varridos: 'tag, enunciado e gabarito de todos os div.exercise (protocolo §4)' },
  relacionados_nao_vinculados: relacionados,
  quiz_nota: `Nenhuma das ${qLines.length} questões do quiz trata de qualidade de energia (varredura por tema nas questões e opções: ${quizComTema.length ? quizComTema.map((q) => q.q).join('; ') : 'nenhuma casa'}).`,
  cobertura_texto_por_token: { ...cobertura, nota: 'Denominador = texto da section inteira (2100-2174); a A09 não tem instrumento a descontar. Tokens por palavra com baixa (cada palavra da fonte consome uma do extraído); tags viram espaço nos dois lados.' },
  divergencias, comparacao_codigo,
  contagens: {
    blocos: blocos.length,
    blocos_por_tipo: blocos.reduce((a, b) => ((a[b.tipo] = (a[b.tipo] || 0) + 1), a), {}),
    secoes_numeradas: bl('titulo').map((b) => b.numero),
    figuras: 0, tabelas: bl('tabela').length,
    linhas_por_tabela: bl('tabela').map((b) => `${b.n_linhas}×${b.n_colunas}`),
    celulas_de_dados: bl('tabela').reduce((a, b) => a + b.n_linhas * b.n_colunas, 0),
    listas: bl('lista').length, itens_de_lista: lista0.itens.length, destaques: destaques.length, vale_lembrar: 0,
    instrumentos: 0, exercicios_vinculados: 0, relacionados_nao_vinculados: relacionados.length,
    remissoes_de_outras_partes: remissoes.length, mencoes_tematicas_fora_da_aula: mencoes.length,
    termos_lexico_candidatos: termos.length, verbetes_lexico_modulo: gloss.length,
    divergencias_fonte: divergencias.length, divergencias_codigo: comparacao_codigo.divergencias.length,
  },
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ blocos: blocos.length, tipos: out.contagens.blocos_por_tipo, tabelas: out.contagens.linhas_por_tabela, celulas: out.contagens.celulas_de_dados, itensLista: lista0.itens.length, medidas, scriptsComI09, exVinc: exVinculados.length, exComTema, quizComTema, remissoes: remissoes.length, mencoes: mencoes.map((m) => [m.origem.linha_aprox, m.texto.slice(0, 70)]), termos: termos.map((t) => [t.termo, t.achados.map((a) => a.variante + ':' + a.n_ocorrencias).join(',')]), cobertura: { ...cobertura, tokens_nao_casados: faltando }, naoVerb: porBloco.filter((x) => x.verbatim_no_codigo === false).map((x) => `${x.bloco} (L${x.linha})`), checksResumo: { orfaos: checks.span_orfao_no_corpo, lista: checks.lista_no_corpo_codigo, mono: checks.classe_mono_no_corpo_codigo, nCls: celulasComClasse, ativVazias: checks.atividades_vazias_no_codigo, instrVazio: checks.instruments_vazio_no_codigo, comAula, sem: checks.glossario.ligados_no_codigo_sem_ocorrencia_textual, sem2: checks.glossario.ocorrencia_textual_sem_ligacao_no_codigo }, celulasFreq: celulasFreq.map((c) => c.t), nHz }, null, 1));
