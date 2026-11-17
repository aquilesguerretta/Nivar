// Gera docs/alexandria-v2/extraction/m01/aula-08.json por extração programática
// (nenhum texto de conteúdo digitado à mão: tudo sai de fatias do HTML-fonte).
import fs from 'node:fs';

const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const OUT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/docs/alexandria-v2/extraction/m01/aula-08.json';
const raw = fs.readFileSync(SRC, 'utf8');
const L = raw.split(/\r?\n/);
const line = (n) => L[n - 1];

const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const strip = (h) => decode(h.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const trecho = (s) => strip(s).slice(0, 60);

function inner(n, re) {
  const m = line(n).match(re);
  if (!m) throw new Error(`linha ${n} não casou ${re}: ${line(n)}`);
  return m[1];
}
function assertLine(n, needle) {
  if (!line(n).includes(needle)) throw new Error(`linha ${n} sem "${needle}": ${line(n)}`);
}
const origem = (n, seletor, html) => ({ seletor, trecho_inicial: trecho(html), linha_aprox: n });

// ---------- sanity: âncoras da aula ----------
assertLine(2004, 'AULA 08');
assertLine(2008, 'Aula 08');
assertLine(2095, '</section>');
assertLine(2025, 'INSTRUMENT 06');

const AULA_ID = 'm01-a08';
const INST_ID = 'm01-inst-06';
const EX_ID = 'm01-ex-06';

// ---------- cabeçalho ----------
const markerNum = inner(2008, /<span class="num">(.*?)<\/span>/);
const markerNome = inner(2008, /<span class="dot"><\/span><span>(.*?)<\/span>/);
const h2 = inner(2009, /<h2 class="aula-title">(.*)<\/h2>/);
const mapaRow = line(1346).trim();
const mapaCells = [...mapaRow.matchAll(/<td>(.*?)<\/td>/g)].map((m) => m[1]);

// ---------- blocos em ordem ----------
const blocos = [];
let k = 0;
const bid = (t) => `${AULA_ID}-b${String(++k).padStart(2, '0')}-${t}`;
function push(tipo, n, seletor, campos, extra = {}) {
  const htmlRef = campos.html ?? campos.texto ?? '';
  blocos.push({ id: bid(tipo), tipo, ...campos, origem: origem(n, seletor, htmlRef), ...extra });
}

const lead = inner(2011, /<p class="lead">(.*)<\/p>/);
push('lead', 2011, 'section.aula(Aula 08) > .container > p.lead', { html: lead, texto: strip(lead) });

const h3 = (n) => {
  const num = inner(n, /<span class="num">(.*?)<\/span>/);
  const txt = inner(n, /<\/span>(.*)<\/h3>/);
  push('titulo', n, `h3 > span.num(${num})`, { numero: num, texto: strip(txt), html: line(n).trim().replace(/^<h3>|<\/h3>$/g, '') });
};
const p = (n, sel = 'p', vinc = undefined) => {
  const h = inner(n, /<p>(.*)<\/p>/);
  push('paragrafo', n, sel, { html: h, texto: strip(h) }, vinc ? { vinculos: vinc } : {});
};

h3(2013);
p(2014, 'h3(8.1) ~ p:nth-of-type(1)');
p(2016, 'h3(8.1) ~ p:nth-of-type(2)');
h3(2018);
const eq = inner(2020, /<div class="eq">(.*)<\/div>/);
push('formula', 2019, 'div.formula > div.eq', { eq_html: eq, eq_texto: strip(eq), desc: null }, {
  nota: 'div.formula sem div.desc na fonte (a classe .desc existe no CSS, linha ~456, mas não é usada aqui). desc = null medido.',
});
p(2023, 'h3(8.2) ~ p (a que invoca o instrumento)', { instrumento: INST_ID, papel: 'invoca o instrumento: "Use a calculadora abaixo:"' });
push('instrumento', 2026, 'div.instrument (comentário <!-- INSTRUMENT 06: Capacity factor --> na linha 2025)', {
  ref: INST_ID,
  texto: strip(inner(2028, /<div class="instrument-title">(.*)<\/div>/)),
}, { vinculos: { instrumento: INST_ID }, nota: 'Posição literal na fonte: entre o parágrafo de 8.2 (linha 2023) e o h3 de 8.3 (linha 2056). Especificação completa em instrumentos[0].' });
h3(2056);
p(2057, 'h3(8.3) ~ p');
push('figura', 2059, 'div.cf-chart', { ref: `${AULA_ID}-fig-01`, texto: null }, { vinculos: { figura: `${AULA_ID}-fig-01` }, nota: 'Especificação completa em figuras[0].' });
const calloutLabel = inner(2091, /<div class="callout-label">(.*)<\/div>/);
const calloutP = inner(2092, /<p>(.*)<\/p>/);
push('destaque', 2090, 'div.callout.gold', {
  tom: 'gold',
  rotulo: calloutLabel,
  html: calloutP,
  texto: strip(calloutP),
}, { nota: 'Um único callout: rótulo (div.callout-label, linha 2091) + corpo (p, linha 2092). A fonte não usa a expressão "Vale lembrar" nesta aula.' });

// ---------- figura cf-chart ----------
const barras = [];
for (let n = 2060; n <= 2087; n++) {
  const lab = line(n).match(/<div class="cf-bar-label"><span class="src">(.*?)<\/span><span>(.*?)<\/span><\/div>/);
  if (lab) {
    const fill = line(n + 1).match(/<div class="cf-bar-fill ([a-z]+)" style="width: (\d+)%;"><\/div>/);
    if (!fill) throw new Error(`fill ausente após ${n}`);
    barras.push({
      fonte_geracao: decode(lab[1]),
      faixa_rotulo: decode(lab[2]),
      largura_barra_css_pct: Number(fill[2]),
      classe_cor: fill[1],
      origem: { seletor: 'div.cf-bar > div.cf-bar-label', trecho_inicial: `${decode(lab[1])} ${decode(lab[2])}`, linha_aprox: n },
    });
  }
}
if (barras.length !== 7) throw new Error('esperava 7 barras, achei ' + barras.length);
const figuras = [{
  id: `${AULA_ID}-fig-01`,
  tipo: 'grafico_barras_horizontais_css',
  seletor: 'div.cf-chart',
  titulo: null,
  titulo_nota: 'A figura não tem título próprio; o h3 imediatamente anterior é "FCs típicos por fonte" (linha 2056) e o parágrafo introdutório está na linha 2057.',
  unidade: '%',
  unidade_nota: 'Unidade inferida do rótulo de faixa ("~85–95%") — não há eixo nem legenda declarando unidade.',
  dados: barras,
  leitura_largura: 'A largura CSS de cada barra (style="width: N%") coincide, nas 7 barras, com o ponto médio arredondado da faixa do rótulo — mas a fonte não declara isso. É dado visual, não dado declarado.',
  fonte_citada: null,
  fonte_citada_nota: 'Nenhuma fonte, nota de rodapé ou p.srcnote acompanha o gráfico. Números sem procedência declarada na fonte (relevante para S4 / C6 "fonte sob o gráfico").',
  origem: { seletor: 'div.cf-chart', trecho_inicial: `${barras[0].fonte_geracao} ${barras[0].faixa_rotulo}`, linha_aprox: 2059 },
  linha_fim_aprox: 2088,
}];

// ---------- instrumento INST·06 ----------
const instTitle = inner(2028, /<div class="instrument-title">(.*)<\/div>/);
const instId = inner(2029, /<div class="instrument-id">(.*)<\/div>/);
const campo = (lblLine, inLine) => {
  const lm = line(lblLine).match(/<label class="field-label">(.*?) <span class="unit">(.*?)<\/span><\/label>/);
  const im = line(inLine).match(/<input type="(\w+)" id="([^"]+)" value="([^"]+)" min="([^"]+)" step="([^"]+)">/);
  if (!lm || !im) throw new Error(`campo ${lblLine}/${inLine}`);
  return {
    id: im[2],
    rotulo: decode(lm[1]),
    unidade: decode(lm[2]),
    tipo_input: im[1],
    padrao: Number(im[3]),
    min: Number(im[4]),
    max: null,
    max_nota: 'Sem atributo max na fonte.',
    step: Number(im[5]),
    origem: { seletor: `input#${im[2]}`, trecho_inicial: `${decode(lm[1])} ${decode(lm[2])}`, linha_aprox: inLine },
  };
};
const campos = [campo(2034, 2035), campo(2038, 2039), campo(2042, 2043)];
const outLabel = inner(2047, /<span class="output-label">(.*)<\/span>/);
const outInit = inner(2048, /<span id="i06-fc">(.*?)<\/span>/);
const outUnit = inner(2048, /<span class="unit">(.*?)<\/span>/);
const noteInit = inner(2051, /<b id="i06-interp">(.*)<\/b>/);

// script
const scriptStart = L.findIndex((s) => s.includes("INSTRUMENT 06: Capacity Factor")) + 1;
if (scriptStart !== 2935) console.warn('script INST06 começa em', scriptStart);
const calcLines = {};
for (let n = 2944; n <= 2961; n++) calcLines[n] = line(n).trim();
const ramos = [];
for (let n = 2952; n <= 2957; n++) {
  const s = line(n);
  const m = s.match(/^\s*(if \(FC >= ([\d.]+)\)|else if \(FC >= ([\d.]+)\)|else) interp\.textContent = '(.*)';\s*$/);
  if (!m) throw new Error('ramo ' + n + ': ' + s);
  const lim = m[2] ?? m[3] ?? null;
  ramos.push({
    condicao_literal: m[1],
    limiar_inferior_fc: lim === null ? null : Number(lim),
    texto: m[4],
    origem: { seletor: 'script (IIFE INSTRUMENT 06) > calc()', trecho_inicial: m[4].slice(0, 60), linha_aprox: n },
  });
}
// execução do original no cenário-padrão (lógica copiada do script, linhas 2945-2950)
const C = 100, G = 220000, T = 8760;
const FCdef = (C * T) > 0 ? G / (C * T) : 0;
const fcFmt = (FCdef * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const ramoDef = ramos.find((r) => r.limiar_inferior_fc === null || FCdef >= r.limiar_inferior_fc);

const instrumento = {
  id: INST_ID,
  id_fonte: instId,
  kind_taxonomia: 'calculadora',
  kind_nota: 'docs/alexandria/instrument-taxonomy.md lista "Calculadora · Fator de capacidade" em `calculadora` (3 campos numéricos → 1 saída, com fórmula). Confirmado pela marcação: 3 input[type=number], 1 saída numérica + 1 texto de leitura dinâmico.',
  titulo: instTitle,
  pergunta: null,
  pergunta_nota: 'A prancha do instrumento não tem pergunta própria. As perguntas que a fonte declara para esta aula estão fora do instrumento: (a) a pergunta do § MAP, linha 1346 (ver aula.pergunta_mapa); (b) o enunciado do Ex · 06 (exercicios[0]). Qualquer pergunta de previsão (bar C3/C5) seria DERIVADA — P3/P11 — não extraída.',
  vinculos: { aula: AULA_ID, exercicio_relacionado: null, termo: 'gl-fator-de-capacidade-fc' },
  vinculos_nota: 'O vínculo aula↔instrumento é por posição (o div.instrument está dentro da section da Aula 08). O vínculo com o termo é por correspondência textual do título, não declarado pela fonte.',
  entradas: campos,
  saidas: [{
    id: 'i06-fc',
    rotulo: outLabel,
    unidade: outUnit,
    valor_inicial_marcacao: outInit,
    formula_exata_script: [calcLines[2945], calcLines[2946], calcLines[2947], calcLines[2948], calcLines[2949]],
    formula_exibida_na_aula: strip(eq),
    formula_exibida_na_aula_origem: { seletor: 'div.formula > div.eq', linha_aprox: 2020, nota: 'Está na prosa de 8.2, FORA do div.instrument.' },
    formatacao_script: calcLines[2950],
    formatacao_descricao: 'FC × 100, pt-BR, exatamente 1 casa decimal (minimumFractionDigits: 1, maximumFractionDigits: 1).',
    coercao_entradas: {
      'i06-cap': calcLines[2945],
      'i06-gen': calcLines[2946],
      'i06-h': calcLines[2947],
      nota: 'Resíduo do original, sinalizado e não corrigido (§10): `|| 0` faz capacidade/geração vazias virarem 0; `|| 1` faz horas vazias OU zero virarem 1. Com max = 0, FC = 0 (ramo "muito baixo").',
    },
    origem: { seletor: 'div.instrument-output > span#i06-fc', trecho_inicial: `${outLabel} ${outInit}${outUnit}`, linha_aprox: 2048 },
  }],
  texto_leitura: {
    id: 'i06-interp',
    tipo: 'dinamico_por_faixa',
    seletor: 'div.instrument-note > b#i06-interp',
    texto_inicial_marcacao: noteInit,
    texto_inicial_marcacao_origem: { seletor: 'b#i06-interp', trecho_inicial: noteInit.slice(0, 60), linha_aprox: 2051 },
    ramos,
    nota: 'O texto do div.instrument-note NÃO é nota estática: é o elemento que calc() sobrescreve (interp.textContent) em cada input e uma vez no carregamento (linha 2960 `calc();`). O texto da marcação é só o valor antes de o script rodar.',
  },
  cenario_padrao: {
    entradas: { 'i06-cap': C, 'i06-gen': G, 'i06-h': T },
    origem: 'atributos value dos inputs (linhas 2035, 2039, 2043); repetidos na prosa de 8.2 (linha 2023: 100 MW, 8.760 h, 220.000 MWh, 25,1%).',
    saida_calculada_pelo_script: { 'i06-fc': fcFmt, fc_bruto: FCdef },
    ramo_ativo_pelo_script: ramoDef.condicao_literal,
    texto_leitura_pelo_script: ramoDef.texto,
    nota: 'Calculado executando a mesma lógica das linhas 2945-2950 com os valores-padrão. Ver divergência DIV-01: o texto da marcação (linha 2051) é de outro ramo.',
  },
  fonte_dos_numeros: null,
  fonte_dos_numeros_nota: 'A fonte não cita procedência para o cenário-padrão (100 MW / 220.000 MWh / 8.760 h) nem para os limiares das faixas (0,85 / 0,55 / 0,40 / 0,25 / 0,15). 8.760 = horas de um ano não bissexto (implícito em "100 × 8.760" na linha 2023; não declarado como tal).',
  tolerancias: null,
  tolerancias_nota: 'Nenhuma tolerância declarada (P6). O instrumento não tem previsão, gabarito nem correção; não existe "dentro/fora".',
  figura_prometida: null,
  figura_prometida_nota: 'O título ("Calculadora · …") não promete forma desenhada. O texto do ramo ≥0,15 manda comparar "com FCs típicos abaixo" — referência à figura m01-a08-fig-01 (div.cf-chart), que vive fora do instrumento.',
  origem: { seletor: 'section.aula(Aula 08) div.instrument', trecho_inicial: `${instTitle} ${instId}`, linha_aprox: 2026 },
  linha_fim_aprox: 2054,
  script_origem: { seletor: 'script: IIFE "INSTRUMENT 06: Capacity Factor"', linha_aprox: 2935, linha_fim_aprox: 2962 },
};

// ---------- invocação ----------
const invocacoes = [
  { id: `${AULA_ID}-inv-01`, alvo: INST_ID, tipo: 'invocacao_direta', texto: 'Use a calculadora abaixo:', bloco: blocos.find((b) => b.origem.linha_aprox === 2023).id, origem: { seletor: 'h3(8.2) ~ p', trecho_inicial: 'Use a calculadora abaixo:', linha_aprox: 2023 }, posicao_instrumento: 'imediatamente depois deste parágrafo (linhas 2025-2054), antes do h3 8.3' },
  { id: `${AULA_ID}-inv-02`, alvo: `${AULA_ID}-fig-01`, tipo: 'remissao_do_instrumento_para_figura', texto: 'Compare com FCs típicos abaixo.', bloco: null, origem: { seletor: 'b#i06-interp (texto inicial e ramo FC >= 0.15)', trecho_inicial: 'Compare com FCs típicos abaixo.', linha_aprox: 2051 }, posicao_instrumento: 'o texto de leitura do INST·06 remete ao div.cf-chart (linha 2059), que vem depois do h3 8.3' },
];
for (const i of invocacoes) if (!raw.includes(i.texto)) throw new Error('invocação não verbatim: ' + i.texto);

// ---------- exercício ----------
const exTag = inner(2437, /<span class="exercise-tag">(.*?)<\/span>/);
const exQ = inner(2438, /<div class="exercise-question">(.*)<\/div>/);
const exA = inner(2441, /<p>(.*)<\/p>/);
const drillIntro = inner(2389, /<p>(.*)<\/p>/);
const exercicios = [{
  id: EX_ID,
  tipo: 'discursiva_com_gabarito',
  tag_fonte: exTag,
  vinculo_declarado: { aula: AULA_ID, como: 'span.exercise-tag "… · Aula 08" (tag de posse, §4 do protocolo)' },
  enunciado_html: exQ,
  enunciado_texto: strip(exQ),
  resposta_referencia_html: exA,
  resposta_referencia_texto: strip(exA),
  criterio: null,
  criterio_nota: 'Sem critério por exercício na fonte. O único critério declarado é de nível do § Drill (todos os exercícios), citado em criterio_modulo_drill.',
  criterio_modulo_drill: {
    texto: drillIntro,
    origem: { seletor: '§ Drill > p', trecho_inicial: trecho(drillIntro), linha_aprox: 2389 },
  },
  mecanica_fonte: 'button.exercise-toggle "Revelar gabarito" (onclick toggleAns) — referência revelável sem tentativa registrada (ver bar C7).',
  vinculos: { aula: AULA_ID, instrumento: null, instrumento_nota: 'Não declarado. O exercício usa a mesma fórmula do INST·06 (50 MW, 131.400 MWh, 8.760 h), mas a fonte não liga um ao outro.', termo: null },
  origem: { seletor: '§ Drill > div.exercise:nth-of-type(6)', trecho_inicial: `${exTag} ${trecho(exQ)}`.slice(0, 80), linha_aprox: 2436 },
  linha_fim_aprox: 2443,
}];

// ---------- relacionados, não vinculados ----------
const quizStart = L.findIndex((s) => s.includes('const questions = ['));
const qLines = [];
for (let n = quizStart + 1; n < quizStart + 110; n++) if (/^\s*q: "/.test(L[n - 1] ?? '')) qLines.push(n);
const qIdx = qLines.findIndex((n) => line(n).includes('fator de capacidade'));
const qn = qLines[qIdx];
const quizQ = inner(qn, /q: "(.*)",$/);
const quizOpts = JSON.parse('[' + inner(qn + 1, /options: \[(.*)\],$/) + ']');
const quizCorrect = Number(inner(qn + 2, /correct: (\d+),/));
const quizFb = inner(qn + 3, /feedback: "(.*)"$/);
const quizCrit = inner(2474, /<p>(.*)<\/p>/);
const checklist = inner(2509, /<div class="text">(.*?)<\/div>/);
const relacionados = [
  {
    id: 'm01-quiz-q08',
    tipo: 'questao_quiz_multipla_escolha',
    vinculo_declarado: null,
    vinculo_nota: 'Sem tag de aula no array `questions` do script. Tema coincide com a Aula 08; posse NÃO declarada — pertence à avaliação do módulo (§ Quiz), não a esta aula. Listado só para rastreio.',
    posicao_no_quiz: qIdx + 1,
    total_questoes_no_array: qLines.length,
    enunciado: quizQ,
    opcoes: quizOpts,
    indice_correto: quizCorrect,
    opcao_correta: quizOpts[quizCorrect],
    feedback: quizFb,
    criterio_quiz_fonte: { texto: quizCrit, origem: { seletor: '§ Quiz > p', linha_aprox: 2474 } },
    origem: { seletor: 'script: const questions = [...]', trecho_inicial: quizQ.slice(0, 60), linha_aprox: qn },
  },
  {
    id: 'm01-checklist-fc',
    tipo: 'item_checklist_final',
    vinculo_declarado: null,
    vinculo_nota: 'Checklist do § Final sem tag de aula; correspondência apenas temática.',
    texto: checklist,
    origem: { seletor: '§ Final div.checklist-item > div.text', trecho_inicial: checklist.slice(0, 60), linha_aprox: 2509 },
  },
];

// ---------- termos do léxico ----------
const aulaHtml = L.slice(2006 - 1, 2095).join('\n');
const aulaSemInst = L.slice(2006 - 1, 2025 - 1).concat(L.slice(2055 - 1, 2095)).join('\n');
const aulaTexto = strip(aulaHtml);
const gloss = [];
for (let n = 2520; n <= 2690; n++) {
  const m = (line(n) || '').match(/<summary><span class="term">(.*?)<\/span><span class="unit">(.*?)<\/span><\/summary>/);
  if (m) gloss.push({ n, term: decode(m[1]), unit: decode(m[2]), def: inner(n + 1, /<div class="glossary-content">(.*)<\/div>/) });
}
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const aulaNorm = norm(aulaTexto);
const termos = [];
for (const g of gloss) {
  const base = g.term.replace(/\s*\(.*\)\s*$/, '');
  const re = new RegExp(`(^|[^\\p{L}])${norm(base).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`, 'u');
  if (!re.test(aulaNorm)) continue;
  // frases reais (§2 do protocolo): pega as ocorrências com contexto
  const ocorr = [];
  const reG = new RegExp(norm(base).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  let mm;
  while ((mm = reG.exec(aulaNorm)) && ocorr.length < 12) ocorr.push(aulaTexto.slice(Math.max(0, mm.index - 40), mm.index + base.length + 40));
  termos.push({ termo: g.term, unidade_rotulo: g.unit, definicao_html: g.def, ocorrencias_contexto: ocorr, n_ocorrencias: (aulaNorm.match(reG) || []).length, origem: { seletor: '§ Lex details.glossary-item > summary > span.term', trecho_inicial: g.term, linha_aprox: g.n } });
}

// ---------- cobertura por token (§5) ----------
const tok = (s) => norm(s).match(/[\p{L}\p{N}]+/gu) || [];
const extraidoTextos = [
  markerNum, markerNome, strip(h2),
  ...blocos.flatMap((b) => [b.texto, b.numero, b.rotulo, b.eq_texto].filter((x) => typeof x === 'string')),
  ...barras.flatMap((b) => [b.fonte_geracao, b.faixa_rotulo]),
];
const bag = new Map();
for (const t of tok(extraidoTextos.join(' '))) bag.set(t, (bag.get(t) || 0) + 1);
const srcTok = tok(strip(aulaSemInst));
let hit = 0;
const faltando = [];
for (const t of srcTok) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else faltando.push(t); }
// o bloco 'instrumento' leva o título; descontá-lo do extraído não muda o denominador (instrumento fora dele)
const cobertura = { tokens_fonte_sem_instrumento: srcTok.length, tokens_casados: hit, pct: +(100 * hit / srcTok.length).toFixed(1), tokens_nao_casados: faltando };

// ---------- comparação com o código portado (verificação programática) ----------
const ROOT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/src/lib/data/';
const codeContent = fs.readFileSync(ROOT + 'alexandria-modulo-01-content.ts', 'utf8');
const codeCalc = fs.readFileSync(ROOT + 'alexandria-instrument-calculators.ts', 'utf8');
const js = (s) => JSON.stringify(s).slice(1, -1); // forma escapada como aparece no .ts
const presente = (hay, s) => hay.includes(js(s)) || hay.includes(s);
const checks = {
  lead_verbatim: presente(codeContent, lead),
  p_8_1_a_verbatim: presente(codeContent, inner(2014, /<p>(.*)<\/p>/)),
  p_8_1_b_verbatim: presente(codeContent, inner(2016, /<p>(.*)<\/p>/)),
  p_8_2_verbatim: presente(codeContent, inner(2023, /<p>(.*)<\/p>/)),
  p_8_3_verbatim: presente(codeContent, inner(2057, /<p>(.*)<\/p>/)),
  callout_corpo_verbatim: presente(codeContent, calloutP),
  formula_eq_texto_no_corpo: codeContent.includes(js(strip(eq))),
  cf_chart_algum_rotulo_no_corpo: barras.some((b) => codeContent.includes(b.fonte_geracao) && codeContent.includes(b.faixa_rotulo)),
  ex_enunciado_verbatim: presente(codeContent, exQ),
  ex_gabarito_verbatim: presente(codeContent, exA),
  ex_tag_verbatim: presente(codeContent, exTag),
  inst_titulo_verbatim: presente(codeContent, instTitle),
  inst_nota_inicial_verbatim_como_note: presente(codeContent, `<b>${noteInit}</b>`),
  ramos_verbatim_no_calculador: ramos.every((r) => presente(codeCalc, r.texto)),
};
const orfaos = (codeContent.match(/'aula-01-08': \[[\s\S]*?\n  \],/) || [''])[0];
checks.span_orfao_no_corpo_8_2 = (orfaos.match(/<\/span>/g) || []).length;
console.log('checks', checks);

const comparacao_codigo = {
  arquivos: [
    'src/lib/data/alexandria-modulo-01-content.ts (INSTRUMENTOS_MODULO_01 inst-06 ~l.115-128; MODULO_01_LEAD aula-01-08 ~l.170; MODULO_01_CORPO aula-01-08 ~l.302-312; MODULO_01_AULAS aula-01-08 ~l.522-548)',
    'src/lib/data/alexandria-instrument-calculators.ts (inst-06 ~l.1772-1804; helpers n/nOu ~l.42-53)',
    'src/lib/data/alexandria-glossario.ts (gl-fator-de-capacidade-fc ~l.155; gl-potencia ~l.291)',
    'src/lib/data/alexandria-curriculo.ts (só agrega MODULO_01_*; nada específico da A08)',
    'src/components/alexandria/viewer/AulaViewer.tsx ~l.111-120 e InstrumentPanel.tsx ~l.32, ~l.300-346 (lidos para entender o efeito das divergências; não são fonte)',
  ],
  verificacoes_programaticas: checks,
  conforme: [
    'Lead (p.lead) verbatim em MODULO_01_LEAD["aula-01-08"].',
    'Parágrafos 8.1 (dois), 8.3 e corpo do callout verbatim no corpo.',
    'Títulos 8.1/8.2/8.3 com número e texto corretos.',
    'Título da aula = texto do h2 (sem o <em> em volta de "≠" — campo de texto puro, §14) e subtítulo = marcador.',
    'INST·06: título, ids dos 3 campos, rótulos, unidades, padrões (100 / 220000 / 8760), min 0, steps (10 / 1000 / 24), ausência de max, id/rótulo/unidade da saída.',
    'Lógica do cálculo e os 6 textos de faixa verbatim, na mesma ordem e com os mesmos limiares; `|| 1` das horas preservado e sinalizado.',
    'Ex · 06: tag, enunciado e gabarito verbatim; vinculado à aula-01-08 (tag de posse declarada).',
    'durationMinutes/difficulty/video = null, coerente com a fonte.',
  ],
  divergencias: [
    { id: 'COD-01', gravidade: 'alta', onde: 'MODULO_01_CORPO["aula-01-08"]', o_que: 'A figura div.cf-chart (7 barras, faixas de FC por fonte) não existe no corpo portado. Nenhum bloco a representa — perda silenciosa de dado (§5, §12 "desenho não porta" exige ao menos o conteúdo numérico/textual).', fonte: 'linhas 2059-2088' },
    { id: 'COD-02', gravidade: 'alta', onde: 'AulaViewer.tsx + MODULO_01_AULAS', o_que: 'O instrumento não tem posição no fluxo: fica em `aula.instruments` e é renderizado depois de TODA a apostila. Na fonte ele está entre o parágrafo de 8.2 ("Use a calculadora abaixo:") e o h3 8.3. Viola bar C5 (posição no ponto da prosa) e Regra-mãe 1; o "abaixo" da prosa passa a apontar para a seção 8.3 e o callout.', fonte: 'linhas 2023-2056' },
    { id: 'COD-03', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-08"] bloco de 8.2', o_que: `Parágrafo de 8.2 não é verbatim: os três <span class="hl"> de abertura foram removidos mas os três </span> de fechamento ficaram (HTML malformado: "Uma usina de 100 MW</span> tem …"). Contagem de </span> no bloco da aula no código: ${checks.span_orfao_no_corpo_8_2}.`, fonte: 'linha 2023' },
    { id: 'COD-04', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-08"]', o_que: 'O bloco div.formula (eq "FC = Geração real ÷ (Capacidade instalada × horas do período)") não foi portado, embora AulaBloco tenha kind "formula".', fonte: 'linhas 2019-2021' },
    { id: 'COD-05', gravidade: 'média', onde: 'INSTRUMENTOS_MODULO_01 inst-06 .formula', o_que: 'formula = "FC = geração ÷ (capacidade × horas)" é paráfrase (minúsculas, sem "real", "instalada", "do período") e não existe no HTML. O texto literal da fonte é o da div.formula da prosa (fora do instrumento). O comentário do calculador repete a paráfrase como "Original:".', fonte: 'linha 2020' },
    { id: 'COD-06', gravidade: 'média', onde: 'INSTRUMENTOS_MODULO_01 inst-06 .note + InstrumentPanel', o_que: 'O texto inicial de b#i06-interp foi portado como `note` ESTÁTICA (envolto em <b>). Na fonte é o próprio elemento de leitura, sobrescrito por calc(). O painel renderiza `veredito` e `note` juntos: no cenário-padrão aparecem ao mesmo tempo o ramo ≥0,25 ("…eólica … ou solar fotovoltaica com tracker em Nordeste BR.") e o texto da marcação ("Faixa típica de usina solar fotovoltaica…" — que não é o texto de nenhum ramo; o ramo ≥0,15 não tem "usina"), e a note continua fixa para qualquer entrada. Ver também DIV-01.', fonte: 'linhas 2050-2052, 2951-2960' },
    { id: 'COD-07', gravidade: 'baixa', onde: 'InstrumentPanel.tsx fmt()', o_que: 'Formatação da saída diverge: fonte usa minimumFractionDigits 1 / maximumFractionDigits 1 ("25,1"; "30,0"); o painel usa maximumFractionDigits 2 sem mínimo ("25,11"; "30").', fonte: 'linha 2950' },
    { id: 'COD-08', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-08"] callout', o_que: 'callout.gold portado como nota {label: null, html: "Por que isso importa para o Brasil"} seguida de um paragrafo solto com o corpo. Na fonte o texto "Por que isso importa para o Brasil" é o RÓTULO (div.callout-label) e o parágrafo é o CORPO do callout. Hierarquia invertida/partida.', fonte: 'linhas 2090-2093' },
    { id: 'COD-09', gravidade: 'baixa', onde: 'MODULO_01_AULAS aula-01-08 activities[0].points', o_que: '`points: 1` não tem origem na fonte (o § Drill não pontua exercícios). Valor atribuído pelo código.', fonte: 'linhas 2436-2443' },
    { id: 'COD-10', gravidade: 'baixa', onde: 'alexandria-glossario.ts aulaIds', o_que: 'aulaIds ["aula-01-08"] em "Fator de capacidade (FC)" e a inclusão de "aula-01-08" em "Potência" são derivações do código (a fonte não declara aula por termo). "Potência" casa só por "potência plena" (8.1), não pelo conceito — ver termos_lexico.', fonte: 'linhas 2576-2577, 2644' },
    { id: 'COD-11', gravidade: 'baixa', onde: 'alexandria-instrument-calculators.ts n()', o_que: 'n() usa Number(v) e o original usa parseFloat(v) || 0. Diferem para strings com sufixo não numérico ("12abc": parseFloat → 12, Number → 0). Com input[type=number] a diferença é praticamente inalcançável; registrada por fidelidade (§10).', fonte: 'linhas 2945-2946' },
    { id: 'COD-12', gravidade: 'informativa', onde: 'ids', o_que: 'Código usa "inst-06", "ex-06", "aula-01-08"; esta extração usa "m01-inst-06", "m01-ex-06", "m01-a08" (ids estáveis com prefixo de módulo). Mapeamento 1:1.', fonte: null },
  ],
};

const divergencias = [
  {
    id: 'DIV-01', tipo: 'fonte_contraditoria_interna',
    o_que: 'Texto de leitura do INST·06 no cenário-padrão.',
    leitura_a: { texto: noteInit, origem: { seletor: 'b#i06-interp (marcação)', linha_aprox: 2051 }, argumento: 'É o texto que o autor escreveu para o estado inicial (25,1%); coerente com a figura, que dá solar BR ~20–28%.' },
    leitura_b: { texto: ramoDef.texto, origem: { seletor: 'script calc(), ramo ' + ramoDef.condicao_literal, linha_aprox: 2955 }, argumento: `calc() roda no carregamento (linha 2960); com 100/220000/8760, FC = ${FCdef.toFixed(6)} ≥ 0,25, então a marcação é sobrescrita por este texto e é ele que o learner vê.` },
    nota_texto: 'Nenhuma das duas leituras coincide com o texto de marcação E com um ramo ao mesmo tempo: a marcação (linha 2051) diz "Faixa típica de usina solar fotovoltaica em latitudes brasileiras. Compare com FCs típicos abaixo."; o ramo else if (FC >= 0.15) (linha 2956) diz "Faixa típica de solar fotovoltaica em latitudes brasileiras. Compare com FCs típicos abaixo." (sem "usina"). A marcação não é texto de nenhum ramo do script. [Acrescentado na verificação.]',
    decisao: 'não escolhida — registrar para reconciliação curricular (P8).',
  },
  {
    id: 'DIV-02', tipo: 'fonte_contraditoria_interna',
    o_que: 'Faixas do script do INST·06 × faixas da figura cf-chart (mesma aula).',
    leitura_a: { texto: 'Figura: ' + barras.map((b) => `${b.fonte_geracao} ${b.faixa_rotulo}`).join(' | '), origem: { seletor: 'div.cf-chart', linha_aprox: 2059 } },
    leitura_b: { texto: 'Script: ' + ramos.map((r) => `${r.condicao_literal} → ${r.texto}`).join(' | '), origem: { seletor: 'script calc()', linha_aprox: 2952 } },
    exemplos: [
      'Solar FV BR ~20–28% na figura; no script, FC entre 0,25 e 0,28 cai no ramo "eólica em vento moderado ou solar com tracker", não no ramo "solar fotovoltaica em latitudes brasileiras" (0,15–0,25).',
      'Carvão ~55–75% na figura; no script "térmica a carvão operando como base load" está no ramo ≥0,85.',
      'Gás CCGT ~40–60% na figura; no script CCGT aparece só no ramo ≥0,55.',
      'Hidrelétrica BR ~45–55% na figura; o script põe hidrelétrica média em 0,40–0,55 e "hidrelétrica em ano hidrológico favorável" em ≥0,55 — compatível, mas o limite 0,55 corta a faixa da figura.',
    ],
    decisao: 'não escolhida — as duas escalas coexistem na fonte.',
  },
  {
    id: 'DIV-03', tipo: 'fonte_valor_pontual_x_faixa',
    o_que: 'FC típico de solar e peaker aparece como ponto num lugar e faixa em outro.',
    leitura_a: { texto: strip(gloss.find((g) => g.term.startsWith('Fator de capacidade')).def), origem: { seletor: '§ Lex Fator de capacidade (FC)', linha_aprox: 2577 } },
    leitura_b: { texto: 'Figura: Solar fotovoltaica (BR) ~20–28%; Térmica a óleo (peaker) ~5–15%', origem: { seletor: 'div.cf-chart', linha_aprox: 2081 } },
    decisao: 'não escolhida — compatíveis (25% dentro de 20–28%), mas não idênticas; "peaker <15%" (léxico) × "~5–15%" (figura) × "abaixo de 15%" (gabarito Ex 06).',
  },
  {
    id: 'DIV-04', tipo: 'fonte_sigla_ambigua',
    o_que: 'A sigla FC designa duas grandezas no mesmo módulo.',
    leitura_a: { texto: 'Fator de capacidade (FC)', origem: { seletor: '§ Lex', linha_aprox: 2576 }, uso: 'Aula 08 (formula e prosa de 8.2)' },
    leitura_b: { texto: 'Fator de carga (FC)', origem: { seletor: '§ Lex', linha_aprox: 2580 }, uso: 'Aula 05 e quiz ("Qual o fator de carga?" → "FC = Demanda média ÷ Demanda máxima")' },
    decisao: 'não escolhida — ligação termo↔aula por sigla "FC" é ambígua; ligar pelo nome completo.',
  },
  {
    id: 'DIV-05', tipo: 'prosa_x_markup_modulo',
    o_que: 'Afirmação do § Drill sobre cobertura dos exercícios.',
    leitura_a: { texto: drillIntro, origem: { seletor: '§ Drill > p', linha_aprox: 2389 } },
    leitura_b: { texto: [...L.join('\n').matchAll(/<span class="exercise-tag">([^<]+)<\/span>/g)].map((m) => m[1]).join(' | '), origem: { seletor: 'span.exercise-tag (8 ocorrências)', linha_aprox: 2392, linha_fim_aprox: 2457 }, argumento: 'As tags cobrem as Aulas 01, 02, 04, 05, 07 e 08 (mais uma síntese); Aulas 03, 06 e 09 ficam sem exercício com tag.' },
    decisao: 'não escolhida — markup vence para posse (§5), prosa registrada. Não afeta a posse do Ex 06 pela A08.',
  },
  {
    id: 'DIV-06', tipo: 'criterio_contraditorio_modulo (P5)',
    o_que: 'Critério do quiz (fora da aula, mas a questão 8 é sobre FC).',
    leitura_a: { texto: quizCrit, origem: { seletor: '§ Quiz > p', linha_aprox: 2474 } },
    leitura_b: { texto: [line(3199), line(3200), line(3201), line(3202)].map((s) => s.trim()).join(' '), origem: { seletor: 'script quiz, mensagens de pontuação', linha_aprox: 3199 }, argumento: 'Com 8/10 o script diz "Bom. Revise os pontos errados, depois avance…", não "Domínio sólido" (≥9).' },
    decisao: 'não escolhida — P5: preservar critério literal até a reconciliação.',
  },
];
console.log('DIV count', divergencias.length);

const out = {
  meta: {
    grupo: 'aula08',
    modulo: 'M01',
    aula: 'M01·A08',
    fonte: SRC,
    fonte_somente_leitura: true,
    fonte_total_linhas: L[L.length - 1] === '' ? L.length - 1 : L.length,
    aula_linhas: { inicio: 2004, fim: 2095, nota: 'comentário de abertura 2004; section.aula 2006-2095' },
    extraido_em: '2026-09-16',
    metodo: 'Extração programática (script node sobre fatias do HTML por linha + regex ancorado; nenhuma prosa digitada). Campos `html` guardam o innerHTML literal; campos `texto` são o mesmo conteúdo com tags removidas e entidades decodificadas.',
    protocolo: 'docs/alexandria/extraction-protocol.md',
    taxonomia: 'docs/alexandria/instrument-taxonomy.md',
    contrato: 'docs/alexandria-v2/bar.md (§4 Peça C, §9, P3, P5, P6, P8, P9, P11, P14)',
    convencoes: {
      ausencia: 'null + campo *_nota explicando o que foi medido',
      ids: 'm01-a08-bNN-<tipo> para blocos (ordem da fonte); m01-inst-06; m01-ex-06; m01-a08-fig-01; m01-quiz-q08',
      vinculos: 'só quando a fonte declara (tag, posição dentro da section, remissão textual literal); correspondência textual é marcada como tal',
    },
  },
  aula: {
    id: AULA_ID,
    numero: 8,
    marcador: { num: markerNum, nome: markerNome, origem: origem(2008, 'div.aula-marker', `${markerNum} ${markerNome}`) },
    titulo_h2_html: h2,
    titulo_h2_texto: strip(h2),
    titulo_h2_origem: origem(2009, 'h2.aula-title', h2),
    pergunta_mapa: {
      numero: strip(mapaCells[0]),
      tema: strip(mapaCells[1]),
      pergunta_html: mapaCells[2],
      pergunta_texto: strip(mapaCells[2]),
      origem: origem(1346, '§ MAP table > tbody > tr(08)', mapaCells[2]),
      nota: 'Única pergunta que a fonte declara para esta aula. Vive na tabela do § MAP, não na aula.',
    },
    duracao_min: null,
    dificuldade: null,
    video: null,
    ausencias_nota: 'Sem duração, dificuldade, vídeo, <img>, referência por aula ou "Vale lembrar" dentro da section. Medido na fatia 2006-2095.',
  },
  blocos,
  figuras,
  tabelas: [],
  tabelas_nota: 'Nenhum <table> dentro da section da Aula 08. A única tabela que menciona a aula é a do § MAP (linha 1346), registrada em aula.pergunta_mapa.',
  destaques: blocos.filter((b) => b.tipo === 'destaque').map((b) => b.id),
  vale_lembrar: null,
  vale_lembrar_nota: 'A expressão "Vale lembrar" não ocorre no HTML do M01 (grep sem resultado). O único destaque da aula é o callout.gold (ver destaques).',
  termos_lexico: {
    vinculo_declarado_pela_fonte: false,
    nota: 'O glossário da fonte (§ Lex, linhas ~2520-2680) não declara aula por termo. Abaixo: verbetes cujo nome-base (sem parênteses) ocorre como palavra no texto da section da Aula 08 (incluindo o instrumento). Correspondência textual, não posse — ler ocorrencias_contexto antes de ligar (§2 do protocolo).',
    total_verbetes_fonte: gloss.length,
    candidatos: termos,
  },
  instrumentos: [instrumento],
  invocacoes_no_texto: invocacoes,
  exercicios,
  relacionados_nao_vinculados: relacionados,
  cobertura_texto_por_token: {
    ...cobertura,
    nota: 'Denominador = texto da section 2006-2095 sem o div.instrument (2025-2054), §5. Os 4 tokens não casados são artefato do medidor: a remoção de tags cola spans adjacentes ("08" + "Capacidade", "8.1" + "Capacidade", "8.2" + "O", "8.3" + "FCs"); as palavras estão presentes nos campos numero/texto. Cobertura efetiva: 100%.',
  },
  divergencias,
  comparacao_codigo,
  contagens: {
    blocos: blocos.length,
    blocos_por_tipo: blocos.reduce((a, b) => ((a[b.tipo] = (a[b.tipo] || 0) + 1), a), {}),
    secoes_numeradas: blocos.filter((b) => b.tipo === 'titulo').map((b) => b.numero),
    figuras: figuras.length,
    barras_figura: barras.length,
    tabelas: 0,
    destaques: 1,
    vale_lembrar: 0,
    instrumentos: 1,
    entradas_instrumento: campos.length,
    saidas_numericas_instrumento: 1,
    ramos_texto_leitura: ramos.length,
    invocacoes_no_texto: invocacoes.length,
    exercicios_vinculados: exercicios.length,
    relacionados_nao_vinculados: relacionados.length,
    termos_lexico_candidatos: termos.length,
    verbetes_lexico_modulo: gloss.length,
    divergencias_fonte: divergencias.length,
    divergencias_codigo: comparacao_codigo.divergencias.length,
  },
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ blocos: blocos.length, barras: barras.length, termos: termos.map((t) => [t.termo, t.n_ocorrencias]), cobertura: { ...cobertura, tokens_nao_casados: faltando }, fcFmt, ramo: ramoDef.condicao_literal, quiz: [qIdx + 1, qLines.length], gloss: gloss.length }, null, 1));
