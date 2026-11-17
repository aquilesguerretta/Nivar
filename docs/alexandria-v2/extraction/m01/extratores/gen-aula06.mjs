// Gera docs/alexandria-v2/extraction/m01/aula-06.json por extração programática.
// Nenhum texto de conteúdo é digitado à mão: tudo sai de fatias do HTML-fonte
// (regex ancorado por linha + asserções de âncora). Fonte somente leitura.
//   node docs/alexandria-v2/extraction/m01/extratores/gen-aula06.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const OUT = path.resolve(HERE, '../aula-06.json');
const TS = path.join(REPO, 'src/lib/data/alexandria-modulo-01-content.ts');
const TS_GLOSS = path.join(REPO, 'src/lib/data/alexandria-glossario.ts');

const raw = fs.readFileSync(SRC, 'utf8');
const L = raw.split(/\r?\n/);
if (L[L.length - 1] === '') L.pop();
const line = (n) => L[n - 1];

const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const strip = (h) => decode(h.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const trecho = (s) => strip(s).slice(0, 60);
const inner = (n, re) => {
  const m = line(n).match(re);
  if (!m) throw new Error(`linha ${n} não casou ${re}: ${line(n)}`);
  return m[1];
};
const assertLine = (n, needle) => {
  if (!line(n).includes(needle)) throw new Error(`linha ${n} sem "${needle}": ${line(n)}`);
};
const origem = (n, seletor, html) => ({ seletor, trecho_inicial: trecho(html), linha_aprox: n });

// ---------- âncoras ----------
const A = { marker: 1833, h2: 1834, lead: 1836, fim_conteudo: 1893 };
assertLine(1829, 'AULA 06');
assertLine(1831, '<section class="aula">');
assertLine(A.marker, 'Aula 06');
assertLine(1895, '</section>');
assertLine(1900, '<section class="aula">');
assertLine(1902, 'Aula 07');

const AULA_ID = 'm01-a06';

// ---------- cabeçalho ----------
const markerNum = inner(A.marker, /<span class="num">(.*?)<\/span>/);
const markerNome = inner(A.marker, /<span class="dot"><\/span><span>(.*?)<\/span>/);
const h2 = inner(A.h2, /<h2 class="aula-title">(.*)<\/h2>/);
const mapaCells = [...line(1344).trim().matchAll(/<td>(.*?)<\/td>/g)].map((m) => m[1]);

// ---------- blocos ----------
const blocos = [];
let k = 0;
const bid = (t) => `${AULA_ID}-b${String(++k).padStart(2, '0')}-${t}`;
function push(tipo, n, seletor, campos, extra = {}) {
  const htmlRef = campos.html ?? campos.texto ?? campos.eq_html ?? campos.rotulo ?? '';
  blocos.push({ id: bid(tipo), tipo, ...campos, origem: origem(n, seletor, htmlRef), ...extra });
}
const h3 = (n) => {
  const num = inner(n, /<span class="num">(.*?)<\/span>/);
  const txt = inner(n, /<\/span>(.*)<\/h3>/);
  push('titulo', n, `h3 > span.num(${num})`, { numero: num, texto: strip(txt), html: line(n).trim().replace(/^<h3>|<\/h3>$/g, '') });
};
const p = (n, sel, extra) => {
  const h = inner(n, /<p>(.*)<\/p>/);
  push('paragrafo', n, sel, { html: h, texto: strip(h) }, extra ?? {});
};
const tabela = (nTab, nHead, nRows, sel) => {
  assertLine(nTab, '<table>');
  const cab = [...line(nHead).matchAll(/<th>(.*?)<\/th>/g)].map((m) => ({ html: m[1], texto: strip(m[1]) }));
  const linhas = nRows.map((n) => {
    const cels = [...line(n).matchAll(/<td( class="([^"]*)")?>(.*?)<\/td>/g)].map((m) => ({ html: m[3], texto: strip(m[3]), classe: m[2] ?? null }));
    if (cels.length !== cab.length) throw new Error(`linha ${n}: ${cels.length} células × ${cab.length} colunas`);
    return { celulas: cels, origem: { seletor: 'tbody > tr', trecho_inicial: cels[0].texto.slice(0, 60), linha_aprox: n } };
  });
  push('tabela', nHead, sel, {
    cabecalho: cab,
    linhas,
    n_colunas: cab.length,
    n_linhas_dados: linhas.length,
    texto: [cab.map((c) => c.texto).join(' '), ...linhas.map((r) => r.celulas.map((c) => c.texto).join(' '))].join(' '),
  }, { linha_tabela: nTab, nota: 'Cabeçalho em <thead><th>; dados em <tbody><td>. `classe` guarda o class do td quando existe.' });
};
const lista = (nUl, nLis, sel) => {
  const ul = line(nUl).match(/^\s*<ul( style="([^"]*)")?>\s*$/);
  if (!ul) throw new Error('ul linha ' + nUl);
  assertLine(nLis[nLis.length - 1] + 1, '</ul>');
  const itens = nLis.map((n) => {
    const m = line(n).match(/^\s*<li( style="([^"]*)")?>(.*)<\/li>\s*$/);
    if (!m) throw new Error('li linha ' + n);
    return { html: m[3], texto: strip(m[3]), estilo_inline: m[2] ?? null, origem: { seletor: 'ul > li', trecho_inicial: strip(m[3]).slice(0, 60), linha_aprox: n } };
  });
  push('lista', nUl, sel, { ordenada: false, itens, ul_estilo_inline: ul[2] ?? null, texto: itens.map((i) => i.texto).join(' ') }, {
    nota: 'Lista não ordenada (<ul>) com 3 <li>. O parágrafo imediatamente anterior termina em "Logo:" (L1871).',
  });
};

const lead = inner(A.lead, /<p class="lead">(.*)<\/p>/);
push('lead', A.lead, 'section.aula(Aula 06) > .container > p.lead', { html: lead, texto: strip(lead) });

h3(1838);
p(1839, 'h3(6.1) ~ p:nth-of-type(1)');
assertLine(1841, 'table-wrap');
tabela(1842, 1843, [1845, 1846], 'h3(6.1) ~ div.table-wrap > table');
p(1851, 'h3(6.1) ~ p:nth-of-type(2)');
h3(1853);
assertLine(1854, 'table-wrap');
tabela(1855, 1856, [1858, 1859, 1860, 1861, 1862, 1863], 'h3(6.2) ~ div.table-wrap > table');
p(1868, 'h3(6.2) ~ p');
h3(1870);
p(1871, 'h3(6.3) ~ p:nth-of-type(1) (termina em "Logo:" e introduz a lista)');
lista(1872, [1873, 1874, 1875], 'h3(6.3) ~ ul');
p(1877, 'h3(6.3) ~ p:nth-of-type(2)');
h3(1879);
p(1880, 'h3(6.4) ~ p:nth-of-type(1)');
assertLine(1882, 'table-wrap');
tabela(1883, 1884, [1886, 1887, 1888], 'h3(6.4) ~ div.table-wrap > table');
p(1893, 'h3(6.4) ~ p:nth-of-type(2)');

// ---------- varreduras de ausência (medidas) ----------
const SEC0 = A.marker, SEC1 = A.fim_conteudo;
const scan = (re, a, b) => { const out = []; for (let n = a; n <= b; n++) if (re.test(line(n))) out.push(n); return out; };
const varredura = {
  nota: 'Varreduras por regex nas linhas indicadas; resultado = linhas que casam.',
  instrumento_na_section: { regex: '/class="instrument"|INSTRUMENT|id="i0\\d-|calculadora|abaixo/i', linhas: scan(/class="instrument"|INSTRUMENT|id="i0\d-|calculadora|abaixo/i, SEC0, SEC1) },
  callout_na_section: { regex: '/class="callout/', linhas: scan(/class="callout/, SEC0, SEC1) },
  formula_na_section: { regex: '/class="formula"/', linhas: scan(/class="formula"/, SEC0, SEC1) },
  figura_ou_imagem_na_section: { regex: '/<img|<svg|<canvas|<figure|<picture|cf-chart/i', linhas: scan(/<img|<svg|<canvas|<figure|<picture|cf-chart/i, SEC0, SEC1) },
  video_na_section: { regex: '/<video|<iframe|youtube|vimeo|\\.mp4/i', linhas: scan(/<video|<iframe|youtube|vimeo|\.mp4/i, SEC0, SEC1) },
  vale_lembrar_no_arquivo: { regex: '/vale lembrar/i', linhas: scan(/vale lembrar/i, 1, L.length) },
  listas_na_section: { regex: '/<ul|<ol|<li/i', linhas: scan(/<ul|<ol|<li/i, SEC0, SEC1) },
  marca_gridalpha_na_section: { regex: '/GridAlpha/', linhas: scan(/GridAlpha/, SEC0, SEC1) },
  referencias_a_aula_06_fora_da_section: { regex: '/Aula 0?6\\b|aula 0?6\\b|A06/', linhas: [...scan(/Aula 0?6\b|aula 0?6\b|A06/, 1, 1830), ...scan(/Aula 0?6\b|aula 0?6\b|A06/, 1896, L.length)] },
  script_que_toca_a_section: { regex: '/getElementById\\(.i06|i06-|tensao|tensão/ (só dentro de <script>)', nota: 'Nenhum instrumento na aula; não há script com prefixo de instrumento associado a ela.' },
};

// ---------- exercícios: nenhum com tag "Aula 06" ----------
const tagLines = [];
L.forEach((s, i) => { const m = s.match(/<span class="exercise-tag">(.*?)<\/span>/); if (m) tagLines.push([i + 1, m[1]]); });
const vinc06 = tagLines.filter(([, t]) => /Aula 0?6\b/.test(t));
if (vinc06.length !== 0) throw new Error('esperava 0 exercícios com tag Aula 06, achei ' + vinc06.length);
const drillIntro = inner(2389, /<p>(.*)<\/p>/);
// §4 do protocolo: referência em prosa não é tag de posse. Varre os 3 campos (enunciado, gabarito) de cada exercício atrás do tema da aula
const reTema = /tensão de fornecimento|Grupo A\b|Grupo B\b|\bA4\b|subgrupo|trifásic|monofásic|bifásic|Aula 0?6\b/i;
const mencoes = [];
tagLines.forEach(([n, tag], i) => {
  const fim = (tagLines[i + 1] ? tagLines[i + 1][0] : 2464) - 1;
  for (let m = n; m <= fim; m++) if (reTema.test(line(m))) {
    const campo = m === n + 1 ? 'enunciado' : /exercise-answer|^\s*<p/.test(line(m)) ? 'gabarito' : 'outro';
    mencoes.push({ exercicio_tag: tag, campo, linha: m, trecho: (strip(line(m)).match(new RegExp(`.{0,50}(${reTema.source}).{0,50}`, 'i')) || [strip(line(m)).slice(0, 100)])[0] });
  }
});

// ---------- relacionados, não vinculados ----------
const quizStart = L.findIndex((s) => s.includes('const questions = ['));
const qLines = [];
for (let n = quizStart + 1; n < quizStart + 140; n++) if (/^\s*q: "/.test(L[n - 1] ?? '')) qLines.push(n);
const quizBlock = (needle) => {
  const qn = qLines.find((n) => line(n).includes(needle));
  if (!qn) throw new Error('quiz sem ' + needle);
  let end = qn; while (!/^\s*feedback: "/.test(line(end))) end++;
  const body = L.slice(qn - 1, end).join('\n');
  const optsRaw = body.match(/options: \[([\s\S]*?)\],\s*\n\s*correct:/)[1];
  const opts = [...optsRaw.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => JSON.parse('"' + m[1] + '"'));
  const correct = Number(body.match(/correct: (\d+),/)[1]);
  return {
    posicao_no_quiz: qLines.indexOf(qn) + 1, total_questoes_no_array: qLines.length,
    enunciado: line(qn).match(/q: "(.*)",$/)[1], opcoes: opts, indice_correto: correct, opcao_correta: opts[correct],
    feedback: line(end).match(/feedback: "(.*)"$/)[1],
    origem: { seletor: 'script: const questions = [...]', trecho_inicial: line(qn).match(/q: "(.*)",$/)[1].slice(0, 60), linha_aprox: qn },
  };
};
const chk = (needle) => {
  const n = L.findIndex((s, i) => i > 2490 && i < 2520 && s.includes(needle)) + 1;
  if (!n) throw new Error('checklist sem ' + needle);
  const h = inner(n, /<div class="text">(.*?)<\/div><\/div>$/);
  return { texto: h, origem: { seletor: '§ Final div.checklist-item > div.text', trecho_inicial: strip(h).slice(0, 60), linha_aprox: n } };
};
const relacionados = [
  { id: 'm01-quiz-subgrupo-a4', tipo: 'questao_quiz_multipla_escolha', vinculo_declarado: null, vinculo_nota: 'Sem tag de aula no array `questions`. Tema = subgrupo A4 (6.2); posse NÃO declarada. O feedback traz "Grupo A4 (2,3 a 25 kV)" e "GridAlpha". Listado só para rastreio.', ...quizBlock('Qual subgrupo tarifário concentra') },
  { id: 'm01-checklist-a06-01', tipo: 'item_checklist_final', vinculo_declarado: null, vinculo_nota: 'Checklist do § Final sem tag de aula; correspondência apenas temática (Grupo A4). Cita a marca GridAlpha.', ...chk('Identificar Grupo A4') },
];

// ---------- termos do léxico ----------
const aulaHtml = L.slice(SEC0 - 1, SEC1).join('\n');
const aulaTexto = decode(aulaHtml.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const gloss = [];
for (let n = 2520; n <= 2690; n++) {
  const m = (line(n) || '').match(/<summary><span class="term">(.*?)<\/span><span class="unit">(.*?)<\/span><\/summary>/);
  if (m) gloss.push({ n, term: decode(m[1]), unit: decode(m[2]), def: inner(n + 1, /<div class="glossary-content">(.*)<\/div>/) });
}
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const aulaNorm = norm(aulaTexto);
const termos = [];
for (const g of gloss) {
  const base = g.term.replace(/\s*\(.*\)\s*$/, '');
  const re = new RegExp(`(^|[^\\p{L}])${esc(norm(base))}([^\\p{L}]|$)`, 'u');
  if (!re.test(aulaNorm)) continue;
  const reG = new RegExp(esc(norm(base)), 'g');
  const ocorr = []; let mm;
  while ((mm = reG.exec(aulaNorm)) && ocorr.length < 12) ocorr.push(aulaTexto.slice(Math.max(0, mm.index - 40), mm.index + base.length + 40));
  termos.push({ termo: g.term, unidade_rotulo: g.unit, definicao_html: g.def, ocorrencias_contexto: ocorr, n_ocorrencias: (aulaNorm.match(reG) || []).length, origem: { seletor: '§ Lex details.glossary-item > summary > span.term', trecho_inicial: g.term, linha_aprox: g.n } });
}

// ---------- cobertura por token (§5) ----------
const tokTxt = (h) => decode(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const tok = (s) => norm(s).match(/[\p{L}\p{N}]+/gu) || [];
const extraido = [markerNum, markerNome, strip(h2)];
for (const b of blocos) for (const f of ['texto', 'numero', 'rotulo', 'eq_texto']) if (typeof b[f] === 'string') extraido.push(f === 'rotulo' ? strip(b[f]) : b[f]);
function cobre(denTxt, extrTxts) {
  const bag = new Map();
  for (const t of tok(extrTxts.join(' '))) bag.set(t, (bag.get(t) || 0) + 1);
  const src = tok(denTxt); let hit = 0; const falt = [];
  for (const t of src) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else falt.push(t); }
  return { tokens_fonte: src.length, tokens_casados: hit, pct: +(100 * hit / src.length).toFixed(1), tokens_nao_casados: falt };
}
// os campos `texto` de bloco tabela repetem as células: contar só uma vez
const extraidoSemDup = [markerNum, markerNome, strip(h2)];
for (const b of blocos) for (const f of ['texto', 'numero', 'rotulo', 'eq_texto']) { if (b.tipo === 'tabela' && f === 'texto') continue; if (typeof b[f] === 'string') extraidoSemDup.push(b[f]); }
for (const b of blocos.filter((x) => x.tipo === 'tabela')) { extraidoSemDup.push(...b.cabecalho.map((c) => c.texto)); for (const r of b.linhas) extraidoSemDup.push(...r.celulas.map((c) => c.texto)); }
for (const b of blocos.filter((x) => x.tipo === 'lista')) { /* `texto` da lista já entrou acima */ }
const cobertura = cobre(tokTxt(aulaHtml), extraidoSemDup);

// ---------- comparação com o código portado ----------
const ts = fs.readFileSync(TS, 'utf8');
const tsGloss = fs.readFileSync(TS_GLOSS, 'utf8');
const tsLines = ts.split(/\r?\n/);
const tsLineOf = (needle, from = 0) => { for (let i = from; i < tsLines.length; i++) if (tsLines[i].includes(needle)) return i + 1; return null; };
const js = (s) => JSON.stringify(s).slice(1, -1);
const presente = (hay, s) => hay.includes(js(s)) || hay.includes(s);
const corpo = (ts.match(/'aula-01-06': \[[\s\S]*?\r?\n  \],/) || [''])[0];
if (!corpo) throw new Error('corpo aula-01-06 não localizado no .ts');
const leadTs = (ts.match(/MODULO_01_LEAD[\s\S]*?\};/) || [''])[0];
const aulaBlk = (ts.match(/id: 'aula-01-06',[\s\S]*?\r?\n  \},\r?\n  \{\r?\n    id: 'aula-01-07'/) || [''])[0];
if (!aulaBlk) throw new Error('bloco aula-01-06 do .ts não localizado');
const dec2 = decode;
const tabs = blocos.filter((b) => b.tipo === 'tabela');
const verifTs = {
  lead_verbatim: presente(leadTs, lead),
  titulos_com_numero_e_texto: blocos.filter((b) => b.tipo === 'titulo').every((b) => corpo.includes(`numero: ${JSON.stringify(b.numero)}`) && presente(corpo, b.texto)),
  paragrafos_verbatim: blocos.filter((b) => b.tipo === 'paragrafo').map((b) => ({ linha: b.origem.linha_aprox, verbatim: presente(corpo, dec2(b.html)) })),
  tabelas_celulas_verbatim: tabs.map((b) => ({ linha: b.linha_tabela, todas_as_celulas: [...b.cabecalho, ...b.linhas.flatMap((r) => r.celulas)].every((c) => presente(corpo, dec2(c.html))) })),
  celula_AS_verbatim: presente(corpo, '< 2,3 kV (subterrâneo)'),
  celula_grupo_A_verbatim: presente(corpo, 'Alta e média tensão (≥ 2,3 kV)'),
  celulas_com_classe_na_fonte: tabs.flatMap((b) => b.linhas.flatMap((r) => r.celulas)).filter((c) => c.classe).length,
  listas_no_corpo_codigo: (corpo.match(/kind: 'lista'/g) || []).length,
  listas_na_fonte: blocos.filter((b) => b.tipo === 'lista').length,
  itens_da_lista_no_codigo: blocos.filter((b) => b.tipo === 'lista').flatMap((b) => b.itens).map((it) => ({ item: it.texto, presente: corpo.includes(it.texto.replace(/;$|\.$/, '')) })),
  paragrafo_logo_termina_sem_continuacao: (() => { const b = blocos.find((x) => x.tipo === 'paragrafo' && x.texto.endsWith('Logo:')); return b ? corpo.includes(js(b.html) + '" },\n    { kind: \'paragrafo\'') || /Logo:" \},\r?\n    \{ kind: 'paragrafo'/.test(corpo) : null; })(),
  span_orfao_no_corpo: (corpo.match(/<\/span>/g) || []).length,
  span_abre_no_corpo: (corpo.match(/<span\b/g) || []).length,
  marca_na_fonte_no_paragrafo_6_2: blocos.find((b) => b.tipo === 'paragrafo' && b.html.includes('GridAlpha'))?.texto.match(/prospecção da \w+/)?.[0] ?? null,
  marca_no_codigo_no_paragrafo_6_2: (corpo.match(/prospecção da (\w+)/) || [])[0] ?? null,
  paragrafo_prospeccao_verbatim_literal: presente(corpo, dec2(blocos.find((b) => b.tipo === 'paragrafo' && b.html.includes('GridAlpha')).html)),
  paragrafo_prospeccao_verbatim_exceto_marca: presente(corpo, dec2(blocos.find((b) => b.tipo === 'paragrafo' && b.html.includes('GridAlpha')).html).replace('GridAlpha', 'NIVAR')),
  titulo_aula_igual_h2_sem_em: aulaBlk.includes(`title: ${JSON.stringify(strip(h2))}`),
  subtitulo_igual_marcador: aulaBlk.includes(`subtitle: ${JSON.stringify(markerNome)}`),
  activities_vazio: /activities: \[\s*\]/.test(aulaBlk),
  instruments_vazio: /instruments: \[\]/.test(aulaBlk),
  duracao_dificuldade_video_null: /durationMinutes: null/.test(aulaBlk) && /difficulty: null/.test(aulaBlk) && /video: null/.test(aulaBlk),
  glossario_aulaIds_com_a06: [...tsGloss.matchAll(/term: "([^"]*)",[\s\S]*?aulaIds: \[([^\]]*)\]/g)].filter((m) => m[2].includes('aula-01-06')).map((m) => m[1]),
};
const lnCorpo = tsLineOf("'aula-01-06': [", tsLineOf('MODULO_01_CORPO') ?? 0);
const lnAula = tsLineOf("id: 'aula-01-06'");
console.log('verificações contra o .ts', JSON.stringify(verifTs, null, 1));

const lista63 = blocos.find((b) => b.tipo === 'lista');
const comparacao_codigo = {
  arquivos: [
    `src/lib/data/alexandria-modulo-01-content.ts (MODULO_01_LEAD aula-01-06 l.${tsLineOf("'aula-01-06': \"No Brasil")}; MODULO_01_CORPO aula-01-06 l.${lnCorpo}; MODULO_01_AULAS aula-01-06 l.${lnAula})`,
    'src/lib/data/alexandria-glossario.ts (aulaIds)',
  ],
  verificacoes_programaticas: verifTs,
  conforme: [
    'Lead e todos os parágrafos corridos verbatim no corpo, exceto o de 6.2 (marca; COD-03).',
    'Títulos 6.1–6.4 com número e texto corretos.',
    'Tabelas 6.1, 6.2 e 6.4: todas as células verbatim (cabeçalho = primeira linha, igual à fonte; `&lt;` decodificado para "<"). Inclui a célula "Alta e média tensão (≥ 2,3 kV)" e a linha AS "< 2,3 kV (subterrâneo)": o conflito QA-M01-A06 está PRESERVADO no código, nas duas leituras.',
    'Nenhum `</span>` órfão no corpo de aula-01-06 (0 aberturas, 0 fechamentos).',
    'activities = [] e instruments = [], coerente com a fonte (a aula não tem exercício com tag nem instrumento).',
    'durationMinutes / difficulty / video = null, coerente com a fonte.',
  ],
  divergencias: [
    { id: 'COD-01', gravidade: 'alta', onde: 'MODULO_01_CORPO["aula-01-06"] (entre o parágrafo "Logo:" e o parágrafo do cliente A1)', o_que: `A lista <ul> de 6.3 (3 <li>: "${lista63.itens.map((i) => i.texto).join('", "')}") não foi portada: 0 blocos kind 'lista' no corpo da aula, contra ${verifTs.listas_na_fonte} na fonte. O parágrafo anterior termina em "Logo:" e o seguinte começa em "Um cliente A1…", sem as 3 razões entre eles. Os 3 itens não aparecem no corpo do código.`, fonte: 'linhas 1872-1876' },
    { id: 'COD-02', gravidade: 'baixa', onde: 'tipo AulaBloco / MODULO_01_CORPO', o_que: `A lista da fonte carrega style inline no <ul> ("${lista63.ul_estilo_inline}") e em cada <li> ("${lista63.itens[0].estilo_inline}"). Ao portar, o estilo de apresentação não precisa ir junto (o tipo 'lista' guarda só itens[] em HTML); registrado como contexto para quem for portar a lista.`, fonte: 'linhas 1872-1875' },
    { id: 'COD-03', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-06"] parágrafo de 6.2 (prospecção)', o_que: `Não verbatim: a fonte diz "${verifTs.marca_na_fonte_no_paragrafo_6_2}" e o código diz "${verifTs.marca_no_codigo_no_paragrafo_6_2}". Troca editorial de marca já feita no código (pendência R8 / P24 / Q03 do inventário); a camada fonte preserva "GridAlpha".`, fonte: 'linha 1868' },
    { id: 'COD-04', gravidade: 'informativa', onde: 'MODULO_01_CORPO["aula-01-06"] tabelas 6.1 / 6.2', o_que: 'QA-M01-A06 preservado: o código porta as duas leituras (Grupo A "≥ 2,3 kV" na tabela 6.1 e subgrupo AS "< 2,3 kV (subterrâneo)" na 6.2), sem resolver. A decisão continua pendente do Founder; esta extração não escolhe leitura.', fonte: 'linhas 1846 e 1863' },
    { id: 'COD-05', gravidade: 'baixa', onde: 'alexandria-glossario.ts aulaIds', o_que: `Termos com "aula-01-06" em aulaIds: ${verifTs.glossario_aulaIds_com_a06.join(', ')}. A fonte não declara aula por termo; é derivação do código. Ver termos_lexico.candidatos para as correspondências textuais medidas.`, fonte: 'linhas 2520-2690 (§ Lex)' },
    { id: 'COD-06', gravidade: 'informativa', onde: 'MODULO_01_CORPO["aula-01-06"] tabelas', o_que: `Nenhuma célula das 3 tabelas da A06 tem class na fonte (${verifTs.celulas_com_classe_na_fonte} células com classe); nada a portar além do html.`, fonte: 'linhas 1843-1888' },
    { id: 'COD-07', gravidade: 'informativa', onde: 'ids', o_que: 'Código usa "aula-01-06"; esta extração usa "m01-a06". A aula não tem instrumento nem exercício vinculado, então não há ids de instrumento/exercício a mapear.', fonte: null },
  ],
};

// ---------- QA-M01-A06 e demais divergências da fonte (duas leituras, nunca resolvidas) ----------
const tab61 = tabs[0], tab62 = tabs[1], tab64 = tabs[2];
const linhaB = tab61.linhas.find((r) => r.celulas[0].texto === 'Grupo B');
const linhaA = tab61.linhas.find((r) => r.celulas[0].texto === 'Grupo A');
const linhaAS = tab62.linhas.find((r) => r.celulas[0].texto === 'AS');
const h3_62 = blocos.find((b) => b.tipo === 'titulo' && b.numero === '6.2');
const lexGA = gloss.find((g) => g.term === 'Grupo A');
const lexGB = gloss.find((g) => g.term === 'Grupo B');
const lexTensao = gloss.find((g) => g.term === 'Tensão');
const lexVolt = gloss.find((g) => g.term === 'Volt (V)');
if (!linhaA || !linhaB || !linhaAS || !lexGA || !lexGB || !lexTensao || !lexVolt) throw new Error('linhas/verbetes do conflito QA-M01-A06 não localizados');
const cel = (r) => ({ celulas: r.celulas.map((c) => c.texto), origem: r.origem });

// lacunas aritméticas na tabela 6.2 (derivadas dos limites declarados; a fonte NÃO declara os vazios)
const faixas62 = tab62.linhas.map((r) => ({ subgrupo: r.celulas[0].texto, tensao: r.celulas[1].texto, linha: r.origem.linha_aprox }));
const num = (s) => Number(s.replace(',', '.'));
const lim = {
  A1: { min: 230, max: null }, A2: { min: 88, max: 138 }, A3: { min: 69, max: 69 }, A3a: { min: 30, max: 44 }, A4: { min: 2.3, max: 25 }, AS: { min: null, max: 2.3 },
};
for (const f of faixas62) { // confere que os limites usados acima batem com o texto da célula
  const t = f.tensao.replace(/ kV.*$/, '');
  const esperado = { A1: '≥ 230', A2: '88 a 138', A3: '69', A3a: '30 a 44', A4: '2,3 a 25', AS: '< 2,3' }[f.subgrupo];
  if (t !== esperado) throw new Error(`faixa ${f.subgrupo}: "${t}" ≠ "${esperado}"`);
}
const ord = ['A4', 'A3a', 'A3', 'A2', 'A1'];
const vazios = [];
for (let i = 0; i < ord.length - 1; i++) { const a = lim[ord[i]], b = lim[ord[i + 1]]; if (b.min > a.max) vazios.push({ entre: `${ord[i]} (${a.max} kV) e ${ord[i + 1]} (${b.min} kV)`, intervalo_kv: [a.max, b.min] }); }

const divergencias = [
  {
    id: 'DIV-01', codigo_qa: 'QA-M01-A06', tipo: 'fonte_contraditoria_interna',
    status: 'PENDENTE DE DECISÃO DO FOUNDER',
    o_que: 'A subseção 6.1 diz que o Grupo A começa em 2,3 kV (≥ 2,3 kV) e que o Grupo B é "< 2,3 kV"; a 6.2, sob o título "Os subgrupos do Grupo A", lista o subgrupo AS com tensão "< 2,3 kV (subterrâneo)". Um subgrupo do Grupo A com tensão abaixo do limite inferior do Grupo A.',
    leitura_a: {
      quem: 'Subseção 6.1 — tabela Grupo A × Grupo B',
      texto: linhaA.celulas[1].texto,
      linha_da_tabela: cel(linhaA),
      par_do_grupo_b: { texto: linhaB.celulas[1].texto, linha_da_tabela: cel(linhaB) },
      origem: { seletor: 'h3(6.1) ~ table > tbody > tr(Grupo A) > td:nth-of-type(2)', trecho_inicial: linhaA.celulas[1].texto, linha_aprox: linhaA.origem.linha_aprox },
    },
    leitura_b: {
      quem: 'Subseção 6.2 — tabela dos subgrupos do Grupo A',
      texto: linhaAS.celulas[1].texto,
      linha_da_tabela: cel(linhaAS),
      titulo_da_secao: { texto: h3_62.texto, origem: h3_62.origem },
      origem: { seletor: 'h3(6.2) ~ table > tbody > tr(AS) > td:nth-of-type(2)', trecho_inicial: linhaAS.celulas[1].texto, linha_aprox: linhaAS.origem.linha_aprox },
    },
    leitura_c_lexico: {
      quem: 'Léxico do módulo repete as duas formas',
      grupo_a: { texto: strip(lexGA.def), origem: { seletor: '§ Lex Grupo A', trecho_inicial: lexGA.term, linha_aprox: lexGA.n + 1 } },
      grupo_b: { texto: strip(lexGB.def), origem: { seletor: '§ Lex Grupo B', trecho_inicial: lexGB.term, linha_aprox: lexGB.n + 1 } },
      tensao: { texto: strip(lexTensao.def), origem: { seletor: '§ Lex Tensão', trecho_inicial: lexTensao.term, linha_aprox: lexTensao.n + 1 } },
    },
    decisao: 'NÃO ESCOLHIDA. Marcado como pendente de decisão do Founder (QA-M01-A06). Esta extração não corrige a faixa, não promove nenhuma das duas leituras e não propõe número: decidir exige conhecimento normativo externo que a fonte única não traz.',
  },
  {
    id: 'DIV-02', tipo: 'observacao_derivada_por_aritmetica',
    o_que: 'Intervalos de tensão sem subgrupo na tabela 6.2. Os limites declarados deixam vazios entre os subgrupos; a fonte não declara esses vazios nem diz se "69 kV" (A3) é um ponto ou uma faixa.',
    faixas_tabela_6_2: faixas62,
    vazios_entre_subgrupos_declarados: vazios,
    derivado: true,
    derivado_nota: 'Aritmética sobre os limites das células (A4 2,3–25; A3a 30–44; A3 69; A2 88–138; A1 ≥ 230). Não é afirmação da fonte. Nenhum vazio foi preenchido.',
    leitura_a: { texto: tab62.cabecalho.map((c) => c.texto).join(' | '), origem: { seletor: 'h3(6.2) ~ table > thead', linha_aprox: tab62.linhas[0].origem.linha_aprox - 2 }, nota: 'cabeçalho da tabela 6.2, que declara só os limites listados' },
    leitura_b: { texto: strip(lexVolt.def), origem: { seletor: '§ Lex Volt (V)', trecho_inicial: lexVolt.term, linha_aprox: lexVolt.n + 1 }, nota: 'o léxico dá valores típicos pontuais (13,8 kV A4; 69 kV A3; 138 kV A2; 230 kV+ A1), compatíveis com a tabela, sem cobrir os vazios' },
    decisao: 'não resolvida — registrada como lacuna. A fonte declara ausência por omissão; a camada de produto deve exibir "não declarado" nesses intervalos, nunca um subgrupo.',
  },
  {
    id: 'DIV-03', tipo: 'observacao_editorial_marca',
    o_que: 'A fonte nomeia a marca GridAlpha dentro desta aula (6.2) e em dois itens fora dela que citam o subgrupo A4; o produto hoje é NIVAR (P24).',
    leitura_a: { texto: 'Para fins de prospecção da GridAlpha no Brasil', origem: { seletor: 'h3(6.2) ~ p', linha_aprox: 1868 } },
    leitura_b: { texto: null, nota: 'Outra leitura não está na fonte: a camada de produto usa NIVAR (empresa) / Alexandria (produto) por decisão P24, fora desta extração.', origem: null },
    ocorrencias_fora_da_aula: { checklist: relacionados[1].origem.linha_aprox, quiz: relacionados[0].origem.linha_aprox },
    decisao: 'não escolhida — texto da fonte mantido literal; o código já trocou a marca (COD-03).',
  },
  {
    id: 'DIV-04', tipo: 'prosa_x_markup_modulo',
    o_que: 'O § Drill diz que os exercícios alcançam "todas as nove aulas"; nenhum exercício tem tag "Aula 06".',
    leitura_a: { texto: 'Os exercícios alcançam todas as nove aulas.', origem: { seletor: '§ Drill > p', linha_aprox: 2389 } },
    leitura_b: { texto: tagLines.map(([, t]) => t).join(' | '), origem: { seletor: 'span.exercise-tag (8 ocorrências)', trecho_inicial: tagLines[0][1], linha_aprox: tagLines[0][0], linha_fim_aprox: tagLines[tagLines.length - 1][0] }, argumento: 'Nenhuma das 8 tags contém "Aula 06".' },
    decisao: 'não escolhida — markup vence para posse (§5); prosa registrada. A06 fica sem exercício vinculado.',
  },
];
// leitura_b do DIV-04 é uma junção das 8 tags: partes verbatim
divergencias[3].leitura_b = { partes: tagLines.map(([, t]) => t), origem: divergencias[3].leitura_b.origem, argumento: divergencias[3].leitura_b.argumento };
divergencias[1].leitura_a = { partes: tab62.cabecalho.map((c) => c.texto), origem: divergencias[1].leitura_a.origem, nota: divergencias[1].leitura_a.nota };

// ---------- JSON final ----------
const out = {
  meta: {
    grupo: 'aula06',
    modulo: 'M01',
    aula: 'M01·A06',
    fonte: SRC,
    fonte_somente_leitura: true,
    fonte_total_linhas: L.length,
    aula_linhas: { inicio: 1828, fim: 1895, nota: 'comentário de abertura 1828-1830; section.aula 1831-1895' },
    extraido_em: '2026-11-14',
    metodo: 'Extração programática (script node sobre fatias do HTML por linha + regex ancorado; nenhuma prosa digitada). `html` guarda o innerHTML literal; `texto` é o mesmo conteúdo com tags removidas e entidades decodificadas.',
    gerador: 'docs/alexandria-v2/extraction/m01/extratores/gen-aula06.mjs',
    verificador: 'docs/alexandria-v2/extraction/m01/extratores/verify-aula06.mjs',
    protocolo: 'docs/alexandria/extraction-protocol.md',
    taxonomia: 'docs/alexandria/instrument-taxonomy.md',
    convencoes: {
      ausencia: 'null + campo *_nota explicando o que foi medido',
      ids: 'm01-a06-bNN-<tipo> para blocos (ordem da fonte)',
      vinculos: 'só quando a fonte declara (tag, posição dentro da section, remissão textual literal); correspondência textual é marcada como tal',
      conflitos_pendentes: 'QA-M01-A06 (DIV-01): pendente de decisão do Founder; as duas leituras ficam literais, nada é escolhido',
    },
  },
  aula: {
    id: AULA_ID,
    numero: 6,
    marcador: { num: markerNum, nome: markerNome, origem: origem(A.marker, 'div.aula-marker', `${markerNum} ${markerNome}`) },
    titulo_h2_html: h2,
    titulo_h2_texto: strip(h2),
    titulo_h2_origem: origem(A.h2, 'h2.aula-title', h2),
    pergunta_mapa: {
      numero: strip(mapaCells[0]),
      tema: strip(mapaCells[1]),
      pergunta_html: mapaCells[2],
      pergunta_texto: strip(mapaCells[2]),
      origem: origem(1344, '§ MAP table > tbody > tr(06)', mapaCells[2]),
      nota: 'Única pergunta que a fonte declara para esta aula. Vive na tabela do § MAP, não na aula.',
    },
    duracao_min: null,
    dificuldade: null,
    video: null,
    ausencias_nota: 'Sem duração, dificuldade, vídeo, <img>, figura, fórmula, callout, instrumento ou "Vale lembrar" dentro da section (ver varredura_de_ausencia).',
  },
  blocos,
  figuras: [],
  figuras_nota: 'Nenhuma figura na section da Aula 06 (varredura_de_ausencia.figura_ou_imagem_na_section).',
  tabelas: tabs.map((b) => b.id),
  listas: blocos.filter((b) => b.tipo === 'lista').map((b) => b.id),
  formulas: [],
  formulas_nota: 'Nenhum div.formula na section da Aula 06.',
  destaques: [],
  destaques_nota: 'Nenhum div.callout na section da Aula 06.',
  vale_lembrar: null,
  vale_lembrar_nota: 'A expressão "Vale lembrar" não ocorre no HTML do M01.',
  varredura_de_ausencia: varredura,
  termos_lexico: {
    vinculo_declarado_pela_fonte: false,
    nota: 'O glossário da fonte (§ Lex) não declara aula por termo. Abaixo: verbetes cujo nome-base (sem parênteses) ocorre como palavra no texto da section. Correspondência textual, não posse; ler ocorrencias_contexto antes de ligar (§2 do protocolo).',
    total_verbetes_fonte: gloss.length,
    candidatos: termos,
  },
  instrumentos: [],
  instrumentos_nota: 'A Aula 06 não tem instrumento: nenhum div.instrument, nenhum id i0N- e nenhum script associado dentro da section (varredura_de_ausencia.instrumento_na_section).',
  invocacoes_no_texto: [],
  exercicios: [],
  exercicios_nota: 'Nenhum exercício do § Drill tem tag "Aula 06". Medido nas 8 tags (ver divergencias DIV-04). Menções ao tema da aula (Grupo A/B, A4, tensão de fornecimento, fases) em exercícios de OUTRAS aulas estão em mencoes_em_exercicios_de_outras_aulas e não são posse (§4 do protocolo).',
  mencoes_em_exercicios_de_outras_aulas: {
    nota: 'Varredura (regex) dos blocos de cada exercício por termos do tema da A06. Referência em prosa não é tag de posse.',
    regex: reTema.source,
    ocorrencias: mencoes,
  },
  relacionados_nao_vinculados: relacionados,
  cobertura_texto_por_token: {
    ...cobertura,
    instrumento_fora_do_denominador: false,
    nota: 'Denominador = texto da section (L1833–L1893); a aula não tem instrumento. Tags viram espaço antes de tokenizar. Cada token da fonte consome um token extraído.',
  },
  divergencias,
  comparacao_codigo,
  contagens: {
    blocos: blocos.length,
    blocos_por_tipo: blocos.reduce((a, b) => ((a[b.tipo] = (a[b.tipo] || 0) + 1), a), {}),
    secoes_numeradas: blocos.filter((b) => b.tipo === 'titulo').map((b) => b.numero),
    figuras: 0,
    tabelas: tabs.length,
    linhas_de_dados_por_tabela: tabs.map((b) => b.n_linhas_dados),
    formulas: 0,
    listas: 1,
    itens_de_lista: lista63.itens.length,
    destaques: 0,
    vale_lembrar: 0,
    instrumentos: 0,
    invocacoes_no_texto: 0,
    exercicios_vinculados: 0,
    relacionados_nao_vinculados: relacionados.length,
    termos_lexico_candidatos: termos.length,
    verbetes_lexico_modulo: gloss.length,
    divergencias_fonte: divergencias.length,
    divergencias_codigo: comparacao_codigo.divergencias.length,
  },
};
// origens sem trecho próprio (leituras de divergência) recebem o início do texto da própria linha
(function completaTrechos(o) {
  if (Array.isArray(o)) return o.forEach(completaTrechos);
  if (!o || typeof o !== 'object') return;
  if (o.linha_aprox !== undefined && o.trecho_inicial === undefined) o.trecho_inicial = strip(line(o.linha_aprox)).slice(0, 60);
  for (const v of Object.values(o)) completaTrechos(v);
})(out);
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ out: OUT, blocos: blocos.length, por_tipo: out.contagens.blocos_por_tipo, termos: termos.map((t) => [t.termo, t.n_ocorrencias]), cobertura, vazios, mencoes: mencoes.length, rel: relacionados.map((r) => r.id) }, null, 1));
