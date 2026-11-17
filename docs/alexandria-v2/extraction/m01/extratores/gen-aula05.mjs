// Gera docs/alexandria-v2/extraction/m01/aula-05.json por extração programática.
// Nenhum texto de conteúdo é digitado à mão: tudo sai de fatias do HTML-fonte
// (regex ancorado por linha + asserções de âncora). Fonte somente leitura.
//   node docs/alexandria-v2/extraction/m01/extratores/gen-aula05.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const OUT = path.resolve(HERE, '../aula-05.json');
const TS = path.join(REPO, 'src/lib/data/alexandria-modulo-01-content.ts');
const TS_GLOSS = path.join(REPO, 'src/lib/data/alexandria-glossario.ts');
const TS_CALC = path.join(REPO, 'src/lib/data/alexandria-instrument-calculators.ts');

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
const A = { marker: 1731, h2: 1732, lead: 1734, fim_section: 1826 };
assertLine(1727, 'AULA 05');
assertLine(1729, '<section class="aula">');
assertLine(A.marker, 'Aula 05');
assertLine(A.fim_section, '</section>');
assertLine(1773, 'INSTRUMENT 04');
assertLine(1774, '<div class="instrument">');
assertLine(1806, '</div>');
assertLine(1831, '<section class="aula">');

const AULA_ID = 'm01-a05';
const INST_ID = 'm01-inst-04';
const EX04_ID = 'm01-ex-04';
const EX07_ID = 'm01-ex-07';

// ---------- cabeçalho ----------
const markerNum = inner(A.marker, /<span class="num">(.*?)<\/span>/);
const markerNome = inner(A.marker, /<span class="dot"><\/span><span>(.*?)<\/span>/);
const h2 = inner(A.h2, /<h2 class="aula-title">(.*)<\/h2>/);
const mapaRow = line(1343).trim();
const mapaCells = [...mapaRow.matchAll(/<td>(.*?)<\/td>/g)].map((m) => m[1]);

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
const formula = (n, rotulo) => {
  assertLine(n, '<div class="formula">');
  assertLine(n + 2, '</div>');
  const eq = inner(n + 1, /<div class="eq">(.*)<\/div>/);
  push('formula', n, 'div.formula > div.eq', { eq_html: eq, eq_texto: strip(eq), desc: null }, {
    nota: `div.formula sem div.desc na fonte (${rotulo}). desc = null medido.`,
  });
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
const callout = (nDiv, tom) => {
  const label = inner(nDiv + 1, /<div class="callout-label">(.*)<\/div>/);
  const body = inner(nDiv + 2, /<p>(.*)<\/p>/);
  assertLine(nDiv + 3, '</div>');
  push('destaque', nDiv, `div.callout${tom === 'neutro' ? '' : '.' + tom}`, { tom, rotulo: label, html: body, texto: strip(body) }, {
    nota: `Um callout: rótulo (div.callout-label, linha ${nDiv + 1}) + corpo (p, linha ${nDiv + 2}).`,
  });
};

const lead = inner(A.lead, /<p class="lead">(.*)<\/p>/);
push('lead', A.lead, 'section.aula(Aula 05) > .container > p.lead', { html: lead, texto: strip(lead) });

h3(1736);
p(1737, 'h3(5.1) ~ p:nth-of-type(1)');
p(1739, 'h3(5.1) ~ p:nth-of-type(2)');
p(1741, 'h3(5.1) ~ p:nth-of-type(3)');
h3(1743);
assertLine(1744, 'table-wrap');
tabela(1745, 1746, [1748, 1749, 1750], 'h3(5.2) ~ div.table-wrap > table');
assertLine(1755, '<div class="callout red">');
callout(1755, 'red');
h3(1760);
p(1761, 'h3(5.3) ~ p:nth-of-type(1)');
formula(1763, 'demanda média');
p(1767, 'h3(5.3) ~ p:nth-of-type(2) (termina em ":" e introduz a 2ª fórmula)');
formula(1769, 'fator de carga');
push('instrumento', 1774, 'div.instrument (comentário <!-- INSTRUMENT 04: Demand + Load Factor --> na linha 1773)', {
  ref: INST_ID,
  texto: strip(inner(1776, /<div class="instrument-title">(.*)<\/div>/)),
}, {
  vinculos: { instrumento: INST_ID },
  nota: 'Posição literal na fonte: entre a 2ª fórmula de 5.3 (linhas 1769-1771) e o h3 de 5.4 (linha 1808). Nenhum parágrafo da aula o invoca por frase (ver invocacoes_no_texto). Especificação completa em instrumentos[0].',
});
h3(1808);
assertLine(1809, 'table-wrap');
tabela(1810, 1811, [1813, 1814, 1815, 1816], 'h3(5.4) ~ div.table-wrap > table');
assertLine(1821, '<div class="callout">');
callout(1821, 'neutro');

// ---------- instrumento INST·04 ----------
const instTitle = inner(1776, /<div class="instrument-title">(.*)<\/div>/);
const instIdFonte = inner(1777, /<div class="instrument-id">(.*)<\/div>/);
const campo = (lblLine, inLine) => {
  const lm = line(lblLine).match(/<label class="field-label">(.*?) <span class="unit">(.*?)<\/span><\/label>/);
  const im = line(inLine).match(/<input type="(\w+)" id="([^"]+)" value="([^"]+)" min="([^"]+)" step="([^"]+)">/);
  if (!lm || !im) throw new Error(`campo ${lblLine}/${inLine}`);
  return {
    id: im[2], rotulo: decode(lm[1]), unidade: decode(lm[2]), tipo_input: im[1],
    padrao: Number(im[3]), min: Number(im[4]), max: null, max_nota: 'Sem atributo max na fonte.', step: Number(im[5]),
    origem: { seletor: `input#${im[2]}`, trecho_inicial: `${decode(lm[1])} ${decode(lm[2])}`, linha_aprox: inLine },
  };
};
const campos = [campo(1782, 1783), campo(1786, 1787), campo(1790, 1791)];

const outPmedLabel = inner(1795, /<span class="output-label">(.*)<\/span>/);
const outPmedInit = inner(1796, /<span id="i04-pmed">(.*?)<\/span>/);
const outPmedUnit = inner(1796, /<span class="unit">(.*?)<\/span><\/span>$/);
const outFcLabel = inner(1799, /<span class="output-label">(.*)<\/span>/);
const outFcInit = inner(1800, /<span id="i04-fc">(.*?)<\/span>/);
const outFcpInit = inner(1800, /<span id="i04-fcp">(.*?)<\/span>/);
assertLine(1800, '<span class="unit"><span id="i04-fcp">');
assertLine(1798, 'style="margin-top: 12px;"');
const noteInit = inner(1803, /<b id="i04-interp">(.*)<\/b>/);

// script: IIFE L2826-2853 (comentário-cabeçalho L2823-2825)
assertLine(2824, 'INSTRUMENT 04');
assertLine(2826, '(function() {');
assertLine(2853, '})();');
const scriptSrc = L.slice(2826 - 1, 2853).join('\n');
const calcLines = {};
for (let n = 2835; n <= 2852; n++) calcLines[n] = line(n).trim();
const ramos = [];
for (let n = 2846; n <= 2849; n++) {
  const s = line(n);
  const m = s.match(/^\s*(if \(FC >= ([\d.]+)\)|else if \(FC >= ([\d.]+)\)|else) interp\.textContent = '(.*)';\s*$/);
  if (!m) throw new Error('ramo ' + n + ': ' + s);
  const lim = m[2] ?? m[3] ?? null;
  ramos.push({
    condicao_literal: m[1],
    limiar_inferior_fc: lim === null ? null : Number(lim),
    texto: m[4],
    origem: { seletor: 'script (IIFE INSTRUMENT 04) > calc()', trecho_inicial: m[4].slice(0, 60), linha_aprox: n },
  });
}

// execução do script ORIGINAL em DOM simulado (vm), não reimplementação
function rodaScript(kwhV, hV, pmaxV) {
  const els = {};
  const mk = (id, value) => (els[id] = { id, value, textContent: '', addEventListener() {} });
  mk('i04-kwh', String(kwhV)); mk('i04-h', String(hV)); mk('i04-pmax', String(pmaxV));
  mk('i04-pmed'); mk('i04-fc'); mk('i04-fcp'); mk('i04-interp');
  const ctx = { document: { getElementById: (id) => els[id] }, parseFloat, Number };
  vm.runInNewContext(scriptSrc, ctx);
  return { 'i04-pmed': els['i04-pmed'].textContent, 'i04-fc': els['i04-fc'].textContent, 'i04-fcp': els['i04-fcp'].textContent, interp: els['i04-interp'].textContent };
}
const ramoDe = (txt) => ramos.findIndex((r) => r.texto === txt);
const cenarios = [
  ['padrão (valores dos atributos value)', 144000, 720, 800],
  ['FC = 0,70 exato (504000 / 720 / 1000)', 504000, 720, 1000],
  ['FC = 0,40 exato (288000 / 720 / 1000)', 288000, 720, 1000],
  ['FC = 0,15 exato (108000 / 720 / 1000)', 108000, 720, 1000],
  ['FC = 0,10 (72000 / 720 / 1000)', 72000, 720, 1000],
  ['FC = 1,00 (720000 / 720 / 1000)', 720000, 720, 1000],
  ['horas vazias', 144000, '', 800],
  ['demanda máxima vazia', 144000, 720, ''],
  ['demanda máxima 0', 144000, 720, 0],
  ['consumo 1000 / 720 h / 800 kW (casas decimais)', 1000, 720, 800],
  ['consumo 360000 / 720 h / 1000 kW (FC 0,5)', 360000, 720, 1000],
].map(([nome, a, b, c]) => {
  const r = rodaScript(a, b, c);
  return { cenario: nome, entradas: { 'i04-kwh': a, 'i04-h': b, 'i04-pmax': c }, saidas: { 'i04-pmed': r['i04-pmed'], 'i04-fc': r['i04-fc'], 'i04-fcp': r['i04-fcp'] }, ramo_ativo: ramoDe(r.interp) < 0 ? null : ramos[ramoDe(r.interp)].condicao_literal, texto_leitura: r.interp };
});
const cenDef = cenarios[0];
if (cenDef.saidas['i04-pmed'] !== '200' || cenDef.saidas['i04-fc'] !== '0,25' || cenDef.saidas['i04-fcp'] !== '25%') throw new Error('cenário padrão não bate com a marcação: ' + JSON.stringify(cenDef));
const marcacaoIgualRamoAtivo = cenDef.texto_leitura === noteInit;

const instrumento = {
  id: INST_ID,
  id_fonte: instIdFonte,
  kind_taxonomia: 'calculadora',
  kind_nota: 'Medido na marcação: 3 input[type=number] → 2 linhas de saída numérica (uma com valor + percentual) + 1 texto de leitura dinâmico. Não há range gêmeo.',
  titulo: instTitle,
  pergunta: null,
  pergunta_nota: 'A prancha do instrumento não tem pergunta própria. A pergunta que a fonte declara para esta aula está fora do instrumento: a do § MAP, linha 1343 (aula.pergunta_mapa). O enunciado do Ex·04 (exercicios[0]) usa os mesmos números do cenário-padrão. Qualquer pergunta de previsão seria DERIVADA (P3/P11), não extraída.',
  vinculos: { aula: AULA_ID, exercicio_relacionado: EX04_ID, termo: null },
  vinculos_nota: 'O vínculo aula↔instrumento é por posição (o div.instrument está dentro da section da Aula 05). O vínculo instrumento↔Ex·04 NÃO é declarado pela fonte: é coincidência medida de valores (ver coincidencia_com_exercicio).',
  entradas: campos,
  saidas: [
    {
      id: 'i04-pmed',
      rotulo: outPmedLabel,
      unidade: outPmedUnit,
      valor_inicial_marcacao: outPmedInit,
      formula_exata_script: [calcLines[2836], calcLines[2837], calcLines[2839]],
      formatacao_script: calcLines[2842],
      formatacao_descricao: 'Pmed = E / T, pt-BR, no máximo 1 casa decimal (maximumFractionDigits: 1, sem mínimo).',
      origem: { seletor: 'div.instrument-output > span#i04-pmed', trecho_inicial: outPmedLabel, linha_aprox: 1796 },
    },
    {
      id: 'i04-fc',
      rotulo: outFcLabel,
      unidade: null,
      unidade_nota: 'O span.unit desta linha de saída não carrega unidade: carrega o span#i04-fcp (percentual). O valor de i04-fc é adimensional (razão).',
      valor_inicial_marcacao: outFcInit,
      formula_exata_script: [calcLines[2838], calcLines[2840]],
      formula_exibida_na_aula: strip(inner(1770, /<div class="eq">(.*)<\/div>/)),
      formula_exibida_na_aula_origem: { seletor: 'div.formula > div.eq (2ª fórmula de 5.3)', linha_aprox: 1770, nota: 'Está na prosa de 5.3, FORA do div.instrument.' },
      formatacao_script: calcLines[2843],
      formatacao_descricao: 'FC (razão), pt-BR, exatamente 2 casas decimais (minimumFractionDigits: 2, maximumFractionDigits: 2).',
      origem: { seletor: 'div.instrument-output > span#i04-fc', trecho_inicial: `${outFcLabel} ${outFcInit}`, linha_aprox: 1800 },
    },
    {
      id: 'i04-fcp',
      rotulo: null,
      rotulo_nota: 'A fonte não rotula este valor: é o span#i04-fcp dentro do span.unit da linha "Fator de carga" (L1800).',
      unidade: '%',
      unidade_nota: 'O símbolo % faz parte do texto do span (textContent = toFixed(0) + "%"), não de um span de unidade separado.',
      valor_inicial_marcacao: outFcpInit,
      formatacao_script: calcLines[2844],
      formatacao_descricao: 'FC × 100 com toFixed(0) e o sufixo "%": zero casa decimal.',
      origem: { seletor: 'span.unit > span#i04-fcp', trecho_inicial: outFcpInit, linha_aprox: 1800 },
    },
  ],
  coercao_entradas: {
    'i04-kwh': calcLines[2836],
    'i04-h': calcLines[2837],
    'i04-pmax': calcLines[2838],
    nota: 'Resíduo do original, sinalizado e não corrigido (§10): `|| 0` faz consumo vazio virar 0; `|| 1` faz horas vazias OU zero virarem 1, e demanda máxima vazia OU zero virar 1. Por causa do `|| 1`, Pmax nunca é 0 dentro de calc(): o ramo `: 0` de `Pmax > 0 ? … : 0` só é alcançável com Pmax negativo.',
  },
  texto_leitura: {
    id: 'i04-interp',
    tipo: 'dinamico_por_faixa',
    seletor: 'div.instrument-note > b#i04-interp',
    texto_inicial_marcacao: noteInit,
    texto_inicial_marcacao_origem: { seletor: 'b#i04-interp', trecho_inicial: noteInit.slice(0, 60), linha_aprox: 1803 },
    marcacao_igual_ao_ramo_ativo_no_padrao: marcacaoIgualRamoAtivo,
    ramos,
    nota: 'O div.instrument-note NÃO é nota estática: é o elemento que calc() sobrescreve (interp.textContent) em cada input e uma vez no carregamento (linha 2852 `calc();`). Aqui, ao contrário do INST·06, o texto da marcação é idêntico ao do ramo ativo no cenário-padrão (verificado por execução do script).',
  },
  cenario_padrao: {
    entradas: { 'i04-kwh': campos[0].padrao, 'i04-h': campos[1].padrao, 'i04-pmax': campos[2].padrao },
    origem_nota: 'atributos value dos inputs (linhas 1783, 1787, 1791); valores iniciais das saídas nas linhas 1796 e 1800.',
    saidas_executando_o_script_original: cenDef.saidas,
    ramo_ativo_pelo_script: cenDef.ramo_ativo,
    texto_leitura_pelo_script: cenDef.texto_leitura,
    nota: 'Executado o texto do IIFE (L2826-2853) num DOM simulado (node:vm), não reimplementado.',
  },
  execucao_script_amostra: {
    nota: 'Amostra de cenários executando o script ORIGINAL em DOM simulado. Não é cobertura exaustiva do espaço de entrada.',
    cenarios,
  },
  fonte_dos_numeros: null,
  fonte_dos_numeros_nota: 'A fonte não cita procedência para o cenário-padrão (144.000 kWh / 720 h / 800 kW) nem para os limiares das faixas (0,70 / 0,40 / 0,15). 720 h = 30 dias × 24 h (implícito no enunciado do Ex·04 "mês de 720 horas"; não declarado como tal no instrumento).',
  tolerancias: null,
  tolerancias_nota: 'Nenhuma tolerância declarada (P6). O instrumento não tem previsão, gabarito nem correção.',
  figura_prometida: null,
  figura_prometida_nota: 'O título ("Calculadora · …") não promete forma desenhada. Não há figura na aula 05 (nenhum svg, canvas ou div de gráfico dentro da section).',
  origem: { seletor: 'section.aula(Aula 05) div.instrument', trecho_inicial: `${instTitle} ${instIdFonte}`, linha_aprox: 1774 },
  linha_fim_aprox: 1806,
  script_origem: { seletor: 'script: IIFE "INSTRUMENT 04: Demand average + Load Factor"', linha_aprox: 2826, linha_fim_aprox: 2853, comentario_cabecalho_linhas: [2823, 2825] },
};

// ---------- exercícios vinculados (tag "· Aula 05") ----------
const tagLines = [];
L.forEach((s, i) => { const m = s.match(/<span class="exercise-tag">(.*?)<\/span>/); if (m) tagLines.push([i + 1, m[1]]); });
const vinc05 = tagLines.filter(([, t]) => /Aula 05\b/.test(t));
if (vinc05.length !== 2) throw new Error('esperava 2 exercícios com tag Aula 05, achei ' + vinc05.length);
const drillIntro = inner(2389, /<p>(.*)<\/p>/);

function exercicio(id, tagLine, nAns, nPs, extra) {
  const exTag = inner(tagLine, /<span class="exercise-tag">(.*?)<\/span>/);
  const q = inner(tagLine + 1, /<div class="exercise-question">(.*)<\/div>/);
  assertLine(tagLine + 2, 'Revelar gabarito');
  const ps = nPs.map((n) => {
    const m = line(n).match(/^\s*<p( style="([^"]*)")?>(.*)<\/p>\s*$/);
    if (!m) throw new Error('p do gabarito ' + n);
    return { html: m[3], texto: strip(m[3]), estilo_inline: m[2] ?? null, origem: { seletor: 'div.exercise-answer > p', trecho_inicial: strip(m[3]).slice(0, 60), linha_aprox: n } };
  });
  return {
    id,
    tipo: 'discursiva_com_gabarito',
    tag_fonte: exTag,
    vinculo_declarado: { aula: AULA_ID, como: `span.exercise-tag "${exTag}" (tag de posse, §4 do protocolo)` },
    enunciado_html: q,
    enunciado_texto: strip(q),
    resposta_referencia_paragrafos: ps,
    resposta_referencia_texto: ps.map((x) => x.texto).join(' '),
    criterio: null,
    criterio_nota: 'Sem critério por exercício na fonte. O único critério declarado é de nível do § Drill (todos os exercícios), citado em criterio_modulo_drill.',
    criterio_modulo_drill: { texto: drillIntro, origem: { seletor: '§ Drill > p', trecho_inicial: trecho(drillIntro), linha_aprox: 2389 } },
    mecanica_fonte: 'button.exercise-toggle "Revelar gabarito" (onclick toggleAns): referência revelável sem tentativa registrada (ver bar C7).',
    origem: { seletor: '§ Drill > div.exercise', trecho_inicial: `${exTag} ${trecho(q)}`.slice(0, 80), linha_aprox: tagLine - 1 },
    linha_fim_aprox: nAns,
    ...extra,
  };
}
assertLine(2419, 'Ex · 04 · Aula 05');
assertLine(2446, 'Ex · 07 · 3 níveis · Aula 05');
const ex04 = exercicio(EX04_ID, 2419, 2425, [2423], {
  vinculos: { aula: AULA_ID, instrumento: null, instrumento_nota: 'Não declarado pela fonte, mas os valores do enunciado coincidem com os do cenário-padrão do INST·04 (ver instrumentos[0].coincidencia_com_exercicio).', termo: null },
});
const ex07 = exercicio(EX07_ID, 2446, 2454, [2450, 2451, 2452], {
  vinculos: { aula: AULA_ID, instrumento: null, termo: null },
  nota: 'O gabarito são 3 <p> (12 anos / CFO / Especialista); o 2º e o 3º levam style="margin-top: 12px;" na fonte. Cada um está em resposta_referencia_paragrafos[].',
});
const exercicios = [ex04, ex07];

// coincidência instrumento × Ex·04 (valores lado a lado, verbatim)
const numsEnunciado = { kwh: '144.000 kWh', horas: '720 horas', pmax: '800 kW' };
for (const v of Object.values(numsEnunciado)) if (!ex04.enunciado_texto.includes(v)) throw new Error('enunciado Ex·04 sem ' + v);
const gabP = ex04.resposta_referencia_paragrafos[0].texto;
for (const v of ['144.000 ÷ 720 = 200 kW', '200 ÷ 800 = 0,25 = 25%']) if (!gabP.includes(v)) throw new Error('gabarito Ex·04 sem ' + v);
instrumento.coincidencia_com_exercicio = {
  exercicio: EX04_ID,
  entradas: [
    { campo: 'i04-kwh', rotulo_instrumento: campos[0].rotulo, padrao_instrumento: campos[0].padrao, no_enunciado_ex04: numsEnunciado.kwh, mesmo_valor: String(campos[0].padrao) === numsEnunciado.kwh.replace(/\D/g, '') },
    { campo: 'i04-h', rotulo_instrumento: campos[1].rotulo, padrao_instrumento: campos[1].padrao, no_enunciado_ex04: numsEnunciado.horas, mesmo_valor: String(campos[1].padrao) === numsEnunciado.horas.replace(/\D/g, '') },
    { campo: 'i04-pmax', rotulo_instrumento: campos[2].rotulo, padrao_instrumento: campos[2].padrao, no_enunciado_ex04: numsEnunciado.pmax, mesmo_valor: String(campos[2].padrao) === numsEnunciado.pmax.replace(/\D/g, '') },
  ],
  saidas: [
    { campo: 'i04-pmed', saida_do_instrumento_no_padrao: cenDef.saidas['i04-pmed'] + ' kW', no_gabarito_ex04: '144.000 ÷ 720 = 200 kW', mesmo_valor: true },
    { campo: 'i04-fc / i04-fcp', saida_do_instrumento_no_padrao: `${cenDef.saidas['i04-fc']} / ${cenDef.saidas['i04-fcp']}`, no_gabarito_ex04: '200 ÷ 800 = 0,25 = 25%', mesmo_valor: true },
  ],
  texto_leitura_no_padrao: cenDef.texto_leitura,
  trecho_do_gabarito_ex04_sobre_interpretacao: 'Interpretação: fator de carga baixo indica picos elevados em relação ao consumo médio.',
  origem_enunciado: { seletor: '§ Drill > div.exercise(Ex · 04) > .exercise-question', trecho_inicial: trecho(ex04.enunciado_html), linha_aprox: 2420 },
  origem_gabarito: { seletor: '§ Drill > div.exercise(Ex · 04) > .exercise-answer > p', trecho_inicial: 'Demanda média: 144.000 ÷ 720 = 200 kW', linha_aprox: 2423 },
  conclusao: 'Medido: as três entradas-padrão e as duas saídas do INST·04 são idênticas ao enunciado e ao resultado do gabarito do Ex·04. Consequência (leitura derivada, não declarada pela fonte): abrir o instrumento no estado inicial exibe a resposta do exercício. A fonte não ordena um antes do outro (o instrumento está na aula, L1774; o Ex·04 está no § Drill, L2419). Nada foi alterado.',
};
for (const e of instrumento.coincidencia_com_exercicio.entradas) if (!e.mesmo_valor) throw new Error('coincidência entrada falhou: ' + e.campo);

// ---------- varreduras de ausência (medidas) ----------
const SEC0 = A.marker, SEC1 = 1824;
const scan = (re, a, b) => { const out = []; for (let n = a; n <= b; n++) if (re.test(line(n))) out.push(n); return out; };
const varredura = {
  nota: 'Varreduras por regex nas linhas indicadas; resultado = linhas que casam.',
  invocacao_do_instrumento_na_prosa: { regex: '/calculadora|instrumento|i04|INST ?· ?04|abaixo/i', linhas_fora_do_div_instrument: [...scan(/calculadora|instrumento|i04|INST ?· ?04|abaixo/i, SEC0, 1773), ...scan(/calculadora|instrumento|i04|INST ?· ?04|abaixo/i, 1807, SEC1)] },
  figura_ou_imagem_na_section: { regex: '/<img|<svg|<canvas|<figure|<picture|cf-chart/i', linhas: scan(/<img|<svg|<canvas|<figure|<picture|cf-chart/i, SEC0, SEC1) },
  video_na_section: { regex: '/<video|<iframe|youtube|vimeo|\\.mp4/i', linhas: scan(/<video|<iframe|youtube|vimeo|\.mp4/i, SEC0, SEC1) },
  vale_lembrar_no_arquivo: { regex: '/vale lembrar/i', linhas: scan(/vale lembrar/i, 1, L.length) },
  listas_na_section: { regex: '/<ul|<ol|<li/i', linhas: scan(/<ul|<ol|<li/i, SEC0, SEC1) },
  marca_gridalpha_na_section: { regex: '/GridAlpha/', linhas: scan(/GridAlpha/, SEC0, SEC1) },
  referencias_a_aula_05_fora_da_section: { regex: '/Aula 0?5\\b|aula 0?5\\b/', linhas: [...scan(/Aula 0?5\b|aula 0?5\b/, 1, 1728), ...scan(/Aula 0?5\b|aula 0?5\b/, 1827, L.length)] },
};

// ---------- relacionados, não vinculados ----------
const quizStart = L.findIndex((s) => s.includes('const questions = ['));
const qLines = [];
for (let n = quizStart + 1; n < quizStart + 140; n++) if (/^\s*q: "/.test(L[n - 1] ?? '')) qLines.push(n);
const quizQ = (idx) => {
  const qn = qLines[idx];
  const opts = JSON.parse('[' + inner(qn + 1, /options: \[(.*)\],$/) + ']');
  const correct = Number(inner(qn + 2, /correct: (\d+),/));
  return { posicao_no_quiz: idx + 1, enunciado: inner(qn, /q: "(.*)",$/), opcoes: opts, indice_correto: correct, opcao_correta: opts[correct], feedback: inner(qn + 3, /feedback: "(.*)"$/), origem: { seletor: 'script: const questions = [...]', trecho_inicial: inner(qn, /q: "(.*)",$/).slice(0, 60), linha_aprox: qn } };
};
// perguntas com options em várias linhas: leitura por regex sobre o bloco
const quizBlock = (needle) => {
  const qn = qLines.find((n) => line(n).includes(needle));
  if (!qn) throw new Error('quiz sem ' + needle);
  let end = qn; while (!/^\s*feedback: "/.test(line(end))) end++;
  const body = L.slice(qn - 1, end).join('\n');
  const optsRaw = body.match(/options: \[([\s\S]*?)\],\s*\n\s*correct:/)[1];
  const opts = [...optsRaw.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => JSON.parse('"' + m[1] + '"'));
  const correct = Number(body.match(/correct: (\d+),/)[1]);
  return {
    posicao_no_quiz: qLines.indexOf(qn) + 1,
    total_questoes_no_array: qLines.length,
    enunciado: line(qn).match(/q: "(.*)",$/)[1],
    opcoes: opts, indice_correto: correct, opcao_correta: opts[correct],
    feedback: line(end).match(/feedback: "(.*)"$/)[1],
    origem: { seletor: 'script: const questions = [...]', trecho_inicial: line(qn).match(/q: "(.*)",$/)[1].slice(0, 60), linha_aprox: qn },
  };
};
const chk = (needle) => {
  const n = L.findIndex((s, i) => i > 2490 && i < 2520 && s.includes(needle)) + 1;
  if (!n) throw new Error('checklist sem ' + needle);
  return { texto: inner(n, /<div class="text">(.*?)<\/div><\/div>$/), origem: { seletor: '§ Final div.checklist-item > div.text', trecho_inicial: strip(inner(n, /<div class="text">(.*?)<\/div><\/div>$/)).slice(0, 60), linha_aprox: n } };
};
const relacionados = [
  { id: 'm01-quiz-demanda', tipo: 'questao_quiz_multipla_escolha', vinculo_declarado: null, vinculo_nota: 'Sem tag de aula no array `questions`. Tema = demanda (A05); posse NÃO declarada. Listado só para rastreio.', ...quizBlock('Por que uma fábrica paga demanda além de consumo?') },
  { id: 'm01-quiz-fator-de-carga', tipo: 'questao_quiz_multipla_escolha', vinculo_declarado: null, vinculo_nota: 'Sem tag de aula. Tema = fator de carga (A05). Usa 200 kW / 500 kW (≠ cenário do INST·04). Ver DIV-02: FC = 0,40 cai na fronteira fechada de duas faixas da tabela 5.4.', ...quizBlock('Qual o fator de carga?') },
  ...[
    'Explicar por que demanda existe na conta industrial.',
    'Calcular demanda média a partir de kWh mensal e horas do período.',
    'Calcular fator de carga e interpretar o que ele significa operacionalmente.',
    'Saber em que situação <strong>não</strong> recomendar redução de demanda contratada.',
  ].map((t, i) => ({ id: `m01-checklist-a05-${String(i + 1).padStart(2, '0')}`, tipo: 'item_checklist_final', vinculo_declarado: null, vinculo_nota: 'Checklist do § Final sem tag de aula; correspondência apenas temática.', ...chk(t) })),
];

// ---------- termos do léxico ----------
const aulaHtml = L.slice(SEC0 - 1, SEC1).join('\n');
const aulaTexto = decode(aulaHtml.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(); // tag → espaço: contexto legível
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
const tokTxt = (h) => decode(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(); // tag → espaço (não cola spans vizinhos)
const tok = (s) => norm(s).match(/[\p{L}\p{N}]+/gu) || [];
const extraido = [markerNum, markerNome, strip(h2)];
for (const b of blocos) {
  for (const f of ['texto', 'numero', 'rotulo', 'eq_texto']) if (typeof b[f] === 'string' && b.tipo !== 'instrumento') extraido.push(f === 'rotulo' ? strip(b[f]) : b[f]);
}
function cobre(denTxt, extrTxts) {
  const bag = new Map();
  for (const t of tok(extrTxts.join(' '))) bag.set(t, (bag.get(t) || 0) + 1);
  const src = tok(denTxt); let hit = 0; const falt = [];
  for (const t of src) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else falt.push(t); }
  return { tokens_fonte: src.length, tokens_casados: hit, pct: +(100 * hit / src.length).toFixed(1), tokens_nao_casados: falt };
}
const semInst = L.slice(SEC0 - 1, 1772).concat(L.slice(1807 - 1, SEC1)).join('\n');
const cobertura = cobre(tokTxt(semInst), extraido);
const instHtml = L.slice(1774 - 1, 1806).join('\n');
const instExtr = [instTitle, instIdFonte, ...campos.flatMap((c) => [c.rotulo, c.unidade]), outPmedLabel, outPmedUnit, outPmedInit, outFcLabel, outFcInit, outFcpInit, noteInit];
const coberturaInst = cobre(tokTxt(instHtml), instExtr);

// ---------- comparação com o código portado ----------
const ts = fs.readFileSync(TS, 'utf8');
const tsGloss = fs.readFileSync(TS_GLOSS, 'utf8');
const tsCalc = fs.readFileSync(TS_CALC, 'utf8');
const tsLines = ts.split(/\r?\n/);
const tsLineOf = (needle, from = 0) => { for (let i = from; i < tsLines.length; i++) if (tsLines[i].includes(needle)) return i + 1; return null; };
const js = (s) => JSON.stringify(s).slice(1, -1);
const presente = (hay, s) => hay.includes(js(s)) || hay.includes(s);
const corpo = (ts.match(/'aula-01-05': \[[\s\S]*?\n  \],/) || [''])[0];
const leadTs = (ts.match(/MODULO_01_LEAD[\s\S]*?\};/) || [''])[0];
const instBlk = (ts.match(/id: "inst-04",[\s\S]*?\n  \},/) || [''])[0];
const aulaBlk = (ts.match(/id: 'aula-01-05',[\s\S]*?\r?\n  \},\r?\n  \{\r?\n    id: 'aula-01-06'/) || [''])[0];
if (!aulaBlk) throw new Error('bloco aula-01-05 do .ts não localizado');
const dec2 = (s) => decode(s);
const verifTs = {
  lead_verbatim: presente(leadTs, lead),
  titulos_com_numero_e_texto: blocos.filter((b) => b.tipo === 'titulo').every((b) => corpo.includes(`numero: ${JSON.stringify(b.numero)}`) && presente(corpo, b.texto)),
  paragrafos_verbatim: blocos.filter((b) => b.tipo === 'paragrafo').map((b) => ({ linha: b.origem.linha_aprox, verbatim: presente(corpo, dec2(b.html)) })),
  tabelas_celulas_verbatim: blocos.filter((b) => b.tipo === 'tabela').map((b) => ({ linha: b.linha_tabela, todas_as_celulas: [...b.cabecalho, ...b.linhas.flatMap((r) => r.celulas)].every((c) => presente(corpo, dec2(c.html))) })),
  celulas_com_classe_na_fonte: blocos.filter((b) => b.tipo === 'tabela').flatMap((b) => b.linhas.flatMap((r) => r.celulas)).filter((c) => c.classe).length,
  formulas_no_corpo_codigo: (corpo.match(/kind: 'formula'/g) || []).length,
  formulas_na_fonte: blocos.filter((b) => b.tipo === 'formula').length,
  callout_vermelho_corpo_verbatim_exceto_marca: presente(corpo, dec2(blocos.find((b) => b.tipo === 'destaque' && b.tom === 'red').html).replace('GridAlpha', 'NIVAR')),
  callout_vermelho_corpo_verbatim_literal: presente(corpo, dec2(blocos.find((b) => b.tipo === 'destaque' && b.tom === 'red').html)),
  callout_neutro_corpo_verbatim: presente(corpo, dec2(blocos.find((b) => b.tipo === 'destaque' && b.tom === 'neutro').html)),
  rotulos_de_callout_como_nota_html: blocos.filter((b) => b.tipo === 'destaque').map((b) => ({ rotulo: b.rotulo, aparece_como_nota_com_label_null: corpo.includes(`label: null, html: ${JSON.stringify(b.rotulo)}`) })),
  span_orfao_no_corpo: (corpo.match(/<\/span>/g) || []).length,
  span_abre_no_corpo: (corpo.match(/<span\b/g) || []).length,
  instrumento_formula_literal_no_codigo: (instBlk.match(/formula: "([^"]*)"/) || [])[1] ?? null,
  instrumento_formula_existe_no_html: raw.includes((instBlk.match(/formula: "([^"]*)"/) || [])[1] ?? '\u0000'),
  instrumento_note_estatica: (instBlk.match(/note: "([^"]*)"/) || [])[1] ?? null,
  instrumento_note_igual_marcacao: (instBlk.match(/note: "([^"]*)"/) || [])[1] === `<b>${noteInit}</b>`,
  instrumento_outputs: [...instBlk.matchAll(/\{ id: "(i04-[a-z]+)", label: "([^"]*)", unit: (null|"[^"]*") \}/g)].map((m) => ({ id: m[1], label: m[2], unit: m[3] })),
  instrumento_campos_batem_com_fonte: campos.every((c) => instBlk.includes(`id: "${c.id}", label: ${JSON.stringify(c.rotulo)}, unit: ${JSON.stringify(c.unidade)}, kind: "number", defaultValue: ${c.padrao}, min: ${c.min}, step: ${c.step}`)),
  instrumento_ramos_verbatim_no_calculador: ramos.every((r) => presente(tsCalc, r.texto)),
  instrumento_ordem_na_aula: 'aula.instruments (depois da apostila; AulaViewer.tsx l.125 renderiza ApostilaPanel e só depois aula.instruments.map)',
  calculador_coercoes: [...tsCalc.matchAll(/const (E|T|Pmax) = (n|nOu)\(i\['(i04-[a-z]+)'\](?:, (\d+))?\);/g)].map((m) => ({ var: m[1], fn: m[2], campo: m[3], padrao_vazio: m[4] ?? null })).filter((x) => x.campo.startsWith('i04')),
  ex04_prompt_verbatim: presente(ts, ex04.enunciado_html),
  ex04_gabarito_verbatim: presente(ts, ex04.resposta_referencia_paragrafos[0].html),
  ex04_tag_verbatim: presente(ts, ex04.tag_fonte),
  ex07_prompt_verbatim: presente(ts, ex07.enunciado_html),
  ex07_tag_verbatim: presente(ts, ex07.tag_fonte),
  ex07_paragrafos_do_gabarito_presentes: ex07.resposta_referencia_paragrafos.map((q) => presente(ts, q.html)),
  ex07_gabarito_uma_string_unica: (() => { const m = ts.match(/tag: "Ex · 07 · 3 níveis · Aula 05", gabarito: "((?:[^"\\]|\\.)*)"/); return m ? { uma_string: true, contem_tag_p: /<p[ >]/.test(m[1]), contem_margin_top: m[1].includes('margin-top'), separador_entre_vozes: /<\/b>/.test(m[1]) } : null; })(),
  points_nos_dois_exercicios: [...(aulaBlk.matchAll(/points: (\d+)/g))].map((m) => Number(m[1])),
  titulo_aula_igual_h2_sem_em: aulaBlk.includes(`title: ${JSON.stringify(strip(h2))}`),
  subtitulo_igual_marcador: aulaBlk.includes(`subtitle: ${JSON.stringify(markerNome)}`),
  duracao_dificuldade_video_null: /durationMinutes: null/.test(aulaBlk) && /difficulty: null/.test(aulaBlk) && /video: null/.test(aulaBlk),
  glossario_aulaIds_com_a05: [...tsGloss.matchAll(/term: "([^"]*)",[\s\S]*?aulaIds: \[([^\]]*)\]/g)].filter((m) => m[2].includes('aula-01-05')).map((m) => m[1]),
};
const lnCorpo = tsLineOf("'aula-01-05': [", tsLineOf('MODULO_01_CORPO') ?? 0);
const lnInst = tsLineOf('id: "inst-04"');
const lnAula = tsLineOf("id: 'aula-01-05'");
console.log('verificações contra o .ts', JSON.stringify(verifTs, null, 1));

const outputs = verifTs.instrumento_outputs;
const comparacao_codigo = {
  arquivos: [
    `src/lib/data/alexandria-modulo-01-content.ts (INSTRUMENTOS_MODULO_01 inst-04 l.${lnInst}; MODULO_01_LEAD aula-01-05 l.${tsLineOf("'aula-01-05': \"A segunda")}; MODULO_01_CORPO aula-01-05 l.${lnCorpo}; MODULO_01_AULAS aula-01-05 l.${lnAula})`,
    'src/lib/data/alexandria-instrument-calculators.ts (inst-04, l.' + tsCalc.split(/\r?\n/).findIndex((s) => s.includes("'inst-04': (i) =>")) + '+)',
    'src/lib/data/alexandria-glossario.ts (aulaIds)',
    'src/components/alexandria/viewer/AulaViewer.tsx l.123-127 e InstrumentPanel.tsx l.47-56, l.705 (lidos para entender o efeito das divergências; não são fonte)',
  ],
  verificacoes_programaticas: verifTs,
  conforme: [
    'Lead e os 4 parágrafos corridos de 5.1/5.3 (3 + 2) verbatim no corpo.',
    'Títulos 5.1–5.4 com número e texto corretos.',
    'Tabelas 5.2 e 5.4: todas as células verbatim (cabeçalho = primeira linha, igual à fonte; `&lt;` decodificado para "<").',
    'Corpo do callout "Onde isso entra no produto" verbatim (inclusive "Trava 4 do War Room").',
    'Nenhum `</span>` órfão no corpo de aula-01-05 (0 aberturas, 0 fechamentos).',
    'INST·04: título, ids e rótulos dos 3 campos, unidades, padrões (144000 / 720 / 800), min 0, steps (1000 / 24 / 50), ausência de max, rótulo/unidade de i04-pmed.',
    'Lógica do cálculo e os 4 textos de faixa verbatim e na mesma ordem; `|| 1` de horas e demanda máxima preservado (nOu(…, 1)).',
    'Ex·04: tag, enunciado e gabarito verbatim; Ex·07: tag e enunciado verbatim, e cada uma das 3 vozes do gabarito presente como substring.',
    'durationMinutes / difficulty / video = null, coerente com a fonte.',
  ],
  divergencias: [
    { id: 'COD-01', gravidade: 'alta', onde: 'MODULO_01_CORPO["aula-01-05"] (entre 5.3 e 5.4)', o_que: `As duas fórmulas de 5.3 (div.formula, "Demanda média = kWh consumido ÷ horas do período" e "Fator de carga = Demanda média ÷ Demanda máxima") não foram portadas: 0 blocos kind 'formula' no corpo da aula, contra ${verifTs.formulas_na_fonte} na fonte. O 2º parágrafo de 5.3 termina em ":" e não tem continuação.`, fonte: 'linhas 1763-1765 e 1769-1771' },
    { id: 'COD-02', gravidade: 'alta', onde: 'AulaViewer.tsx + MODULO_01_AULAS aula-01-05', o_que: 'O instrumento não tem posição no fluxo: fica em `aula.instruments` e é renderizado depois de TODA a apostila (ApostilaPanel e só depois instruments.map). Na fonte ele está entre a 2ª fórmula de 5.3 e o h3 5.4. Viola C5 (posição no ponto da prosa) e a Regra-mãe 1.', fonte: 'linhas 1769-1808' },
    { id: 'COD-03', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-05"] callout vermelho', o_que: 'O callout.red portado como nota {tom: "red", label: null, html: "Atenção · regras de ultrapassagem"} seguida de um parágrafo solto com o corpo. Na fonte "Atenção · regras de ultrapassagem" é o RÓTULO (div.callout-label) e o parágrafo é o CORPO do mesmo callout. Hierarquia invertida/partida.', fonte: 'linhas 1755-1758' },
    { id: 'COD-04', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-05"] callout neutro', o_que: 'Mesmo defeito em "Onde isso entra no produto": rótulo portado como `html` de nota (label: null) e corpo como parágrafo solto.', fonte: 'linhas 1821-1824' },
    { id: 'COD-05', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-05"] parágrafo do callout vermelho', o_que: 'Não verbatim: a fonte diz "Esta é uma trava operacional da GridAlpha." e o código diz "…da NIVAR." Troca editorial de marca já feita no código (pendência R8 / P24 / Q03 do inventário); a camada fonte preserva "GridAlpha".', fonte: 'linha 1757' },
    { id: 'COD-06', gravidade: 'média', onde: 'INSTRUMENTOS_MODULO_01 inst-04 .formula', o_que: `formula = "${verifTs.instrumento_formula_literal_no_codigo}" é paráfrase (abreviações "P média" / "P máxima") e não existe no HTML (instrumento_formula_existe_no_html = ${verifTs.instrumento_formula_existe_no_html}). O literal da fonte é a 2ª div.formula de 5.3 ("Fator de carga = Demanda média ÷ Demanda máxima"), fora do instrumento.`, fonte: 'linha 1770' },
    { id: 'COD-07', gravidade: 'média', onde: 'INSTRUMENTOS_MODULO_01 inst-04 .note + InstrumentPanel', o_que: 'O texto inicial de b#i04-interp foi portado como `note` ESTÁTICA (envolta em <b>). Na fonte é o próprio elemento de leitura, sobrescrito por calc() (4 ramos). O painel renderiza `veredito` e `note` juntos: no cenário-padrão os dois dizem o mesmo (a marcação é idêntica ao ramo ≥0,15); com outra entrada (ex.: FC ≥ 0,70) o painel mostra o ramo vivo e, ao mesmo tempo, a nota fixa do ramo 0,15–0,40.', fonte: 'linhas 1802-1804, 2846-2852' },
    { id: 'COD-08', gravidade: 'baixa', onde: 'INSTRUMENTOS_MODULO_01 inst-04 .outputs', o_que: `Três saídas no código (${outputs.map((o) => `${o.id} "${o.label}" unit ${o.unit}`).join('; ')}). Na fonte são duas linhas: "Demanda média" (kW) e "Fator de carga", cujo valor "0,25" tem ao lado o percentual "25%" dentro do span.unit, SEM rótulo próprio. O rótulo "Fator de carga (%)" não existe na fonte, e i04-fc ficou sem unidade.`, fonte: 'linhas 1794-1801' },
    { id: 'COD-09', gravidade: 'baixa', onde: 'InstrumentPanel.tsx fmt()', o_que: 'Formatação das saídas diverge da fonte (deduzido da leitura de `fmt`, não medido na tela): a fonte usa pmed com no máximo 1 casa, FC com exatamente 2 casas ("0,50") e fcp = toFixed(0) + "%"; o painel usa `fmt(v, 2)` (máx. 2 casas, sem mínimo): pmed 1000/720 → "1,39" (fonte "1,4"), FC 0,5 → "0,5" (fonte "0,50"), fcp → "25" com unidade "%" separada.', fonte: 'linhas 2842-2844' },
    { id: 'COD-10', gravidade: 'baixa', onde: 'alexandria-instrument-calculators.ts n()', o_que: 'Para `i04-kwh` o código usa n() (Number) onde a fonte usa parseFloat(v) || 0; diferem só para strings com sufixo não numérico (praticamente inalcançável em input[type=number]). T e Pmax usam nOu(…, 1), fiel ao `|| 1` da fonte (conforme).', fonte: 'linhas 2836-2838' },
    { id: 'COD-11', gravidade: 'média', onde: 'MODULO_01_AULAS aula-01-05 activities[1] (Ex·07) .config.gabarito', o_que: 'O gabarito do Ex·07 são 3 <p> na fonte (12 anos / CFO / Especialista; o 2º e o 3º com style="margin-top: 12px;"). No código viraram UMA string, com as três vozes separadas por um espaço e sem <p>: a separação de parágrafos se perdeu. O texto das três vozes está presente e verbatim.', fonte: 'linhas 2450-2452' },
    { id: 'COD-12', gravidade: 'baixa', onde: 'MODULO_01_AULAS aula-01-05 activities[].points', o_que: `\`points: ${verifTs.points_nos_dois_exercicios.join(' / ')}\` nos dois exercícios não tem origem na fonte (o § Drill não pontua).`, fonte: 'linhas 2418-2454' },
    { id: 'COD-13', gravidade: 'baixa', onde: 'alexandria-glossario.ts aulaIds', o_que: `Termos com "aula-01-05" em aulaIds: ${verifTs.glossario_aulaIds_com_a05.join(', ')}. A fonte não declara aula por termo; é derivação do código. Ver termos_lexico.candidatos para as correspondências textuais medidas.`, fonte: 'linhas 2556-2600 (§ Lex)' },
    { id: 'COD-14', gravidade: 'informativa', onde: 'MODULO_01_CORPO["aula-01-05"] tabela 5.4', o_que: `As ${verifTs.celulas_com_classe_na_fonte} células da 1ª coluna da tabela 5.4 têm class="mono" na fonte; o tipo 'tabela' do código só guarda o html da célula, então a classe não foi portada.`, fonte: 'linhas 1813-1816' },
    { id: 'COD-15', gravidade: 'informativa', onde: 'ids', o_que: 'Código usa "inst-04", "ex-04", "ex-07", "aula-01-05"; esta extração usa "m01-inst-04", "m01-ex-04", "m01-ex-07", "m01-a05". Mapeamento 1:1.', fonte: null },
  ],
};

// ---------- divergências da fonte (duas leituras, nunca resolvidas) ----------
const q40 = relacionados.find((r) => r.id === 'm01-quiz-fator-de-carga');
const tabela54 = blocos.filter((b) => b.tipo === 'tabela')[1];
const faixas54 = tabela54.linhas.map((r) => ({ faixa: r.celulas[0].texto, perfil: r.celulas[1].texto, linha: r.origem.linha_aprox }));
const lexFC = gloss.find((g) => g.term === 'Fator de carga (FC)');
const lexFCap = gloss.find((g) => g.term === 'Fator de capacidade (FC)');
if (!lexFC || !lexFCap) throw new Error('léxico FC');
const travaLinha = scan(/Trava [34]\b/, 1, L.length).map((n) => ({ linha: n, trecho: (line(n).match(/Trava [34][^<.]{0,40}/) || [''])[0] }));
const divergencias = [
  {
    id: 'DIV-01', tipo: 'achado_instrumento_x_exercicio',
    o_que: 'O cenário-padrão do INST·04 é idêntico ao enunciado do Ex·04, e as saídas iniciais são o resultado do gabarito.',
    leitura_a: { entradas_padrao: Object.fromEntries(campos.map((c) => [c.id, c.padrao])), saidas_iniciais_marcacao: { 'i04-pmed': outPmedInit, 'i04-fc': outFcInit, 'i04-fcp': outFcpInit }, origem: { seletor: 'div.instrument', trecho_inicial: 'Consumo mensal kWh', linha_aprox: 1782, linha_fim_aprox: 1800 } },
    leitura_b: { texto: ex04.enunciado_texto, origem: { seletor: '§ Drill > Ex · 04 > .exercise-question', trecho_inicial: trecho(ex04.enunciado_html), linha_aprox: 2420 }, gabarito_partes: ['144.000 ÷ 720 = 200 kW', '200 ÷ 800 = 0,25 = 25%'], gabarito_origem: { seletor: '§ Drill > Ex · 04 > .exercise-answer', trecho_inicial: 'Demanda média: 144.000 ÷ 720 = 200 kW', linha_aprox: 2423 } },
    decisao: 'não é contradição: é coincidência medida. Registrado para a camada de produto (bar C7: abrir o instrumento entrega a resposta). Nada alterado.',
  },
  {
    id: 'DIV-02', tipo: 'fonte_contraditoria_interna',
    o_que: 'Fronteiras da tabela 5.4 (intervalos fechados nos dois lados) × limiares `>=` do script do INST·04.',
    faixas_tabela_5_4: faixas54,
    leitura_a: { partes: faixas54.map((f) => f.faixa), origem: { seletor: 'h3(5.4) ~ table', linha_aprox: 1813, linha_fim_aprox: 1816 }, argumento: 'Os valores 0,70, 0,40 e 0,15 aparecem como limite de DUAS linhas (0,40 – 0,70 e 0,70 – 0,90; 0,15 – 0,40 e 0,40 – 0,70; "< 0,15" e 0,15 – 0,40). Acima de 0,90 a tabela não diz nada.' },
    leitura_b: { partes: ramos.map((r) => r.condicao_literal), origem: { seletor: 'script calc()', linha_aprox: 2846, linha_fim_aprox: 2849 }, argumento: 'O script resolve com `>=`: FC = 0,70 → 1º ramo; 0,40 → 2º; 0,15 → 3º; e qualquer FC ≥ 0,70 (inclusive acima de 0,90) → 1º ramo.' },
    exemplos_executando_o_script: cenarios.filter((c) => /exato|1,00/.test(c.cenario)).map((c) => `${c.cenario}: FC ${c.saidas['i04-fc']} → ${c.ramo_ativo}`),
    quiz_na_fronteira: { texto: q40.enunciado, feedback: q40.feedback, origem: q40.origem, argumento: 'FC = 0,40 exato: o feedback do quiz o lê como a faixa de sazonalidade moderada (2ª linha da tabela), mas 0,40 também é o limite superior de "Picos altos, operação concentrada, partidas simultâneas".' },
    decisao: 'não escolhida — as duas leituras coexistem na fonte.',
  },
  {
    id: 'DIV-03', tipo: 'fonte_sigla_ambigua',
    o_que: 'A sigla FC designa duas grandezas no mesmo módulo, e a A05 usa a sigla sem expandir.',
    leitura_a: { texto: lexFC.term, origem: { seletor: '§ Lex', linha_aprox: lexFC.n }, uso: 'Aula 05: cabeçalho da tabela 5.4 ("FC"), texto de leitura do instrumento ("FC muito baixo") e o léxico "Fator de carga (FC)"' },
    leitura_b: { texto: lexFCap.term, origem: { seletor: '§ Lex', linha_aprox: lexFCap.n }, uso: 'Aula 08 (fórmula e prosa de 8.2)' },
    decisao: 'não escolhida — ligação termo↔aula por sigla "FC" é ambígua; ligar pelo nome completo (P21 decide FCarga / FCap na camada de produto).',
  },
  {
    id: 'DIV-04', tipo: 'fonte_contraditoria_interna',
    o_que: 'Numeração da trava do War Room citada no callout final desta aula.',
    leitura_a: { texto: 'Promessa sem validação fere a Trava 4 do War Room.', origem: { seletor: 'div.callout > p (Onde isso entra no produto)', linha_aprox: 1823 } },
    leitura_b: { texto: (travaLinha.find((t) => /Trava 3/.test(t.trecho)) || { trecho: null }).trecho, origem: { seletor: '§ Caso', linha_aprox: (travaLinha.find((t) => /Trava 3/.test(t.trecho)) || {}).linha ?? null }, argumento: 'A fonte não define as travas. Ocorrências de "Trava 3|4" no arquivo: ' + travaLinha.map((t) => `L${t.linha} (${t.trecho.trim()})`).join('; ') },
    decisao: 'não escolhida — P23: reconciliar pelo contexto ou usar rótulo semântico. A A05 (L1823) diz "Trava 4", como as ocorrências L1314 e L3150; só a L2192 (§ Caso) diz "Trava 3".',
  },
  {
    id: 'DIV-05', tipo: 'observacao_editorial_marca',
    o_que: 'A fonte nomeia a marca GridAlpha dentro desta aula; o produto hoje é NIVAR (P24).',
    leitura_a: { texto: 'Esta é uma trava operacional da GridAlpha.', origem: { seletor: 'div.callout.red > p', linha_aprox: 1757 } },
    leitura_b: { texto: null, nota: 'Outra leitura não está na fonte: a camada de produto usa NIVAR (empresa) / Alexandria (produto) por decisão P24, fora desta extração.', origem: null },
    decisao: 'não escolhida — texto da fonte mantido literal; o código já trocou a marca (COD-05).',
  },
];

// ---------- JSON final ----------
const instBlocoIdx = blocos.findIndex((b) => b.tipo === 'instrumento');
const out = {
  meta: {
    grupo: 'aula05',
    modulo: 'M01',
    aula: 'M01·A05',
    fonte: SRC,
    fonte_somente_leitura: true,
    fonte_total_linhas: L.length,
    aula_linhas: { inicio: 1726, fim: 1826, nota: 'comentário de abertura 1726-1728; section.aula 1729-1826' },
    extraido_em: '2026-11-14',
    metodo: 'Extração programática (script node sobre fatias do HTML por linha + regex ancorado; nenhuma prosa digitada). `html` guarda o innerHTML literal; `texto` é o mesmo conteúdo com tags removidas e entidades decodificadas. O script do instrumento foi EXECUTADO num DOM simulado (node:vm) para obter as saídas do cenário-padrão.',
    gerador: 'docs/alexandria-v2/extraction/m01/extratores/gen-aula05.mjs',
    verificador: 'docs/alexandria-v2/extraction/m01/extratores/verify-aula05.mjs',
    protocolo: 'docs/alexandria/extraction-protocol.md',
    taxonomia: 'docs/alexandria/instrument-taxonomy.md',
    convencoes: {
      ausencia: 'null + campo *_nota explicando o que foi medido',
      ids: 'm01-a05-bNN-<tipo> para blocos (ordem da fonte); m01-inst-04; m01-ex-04; m01-ex-07',
      vinculos: 'só quando a fonte declara (tag, posição dentro da section, remissão textual literal); correspondência textual ou numérica é marcada como tal',
    },
  },
  aula: {
    id: AULA_ID,
    numero: 5,
    marcador: { num: markerNum, nome: markerNome, origem: origem(A.marker, 'div.aula-marker', `${markerNum} ${markerNome}`) },
    titulo_h2_html: h2,
    titulo_h2_texto: strip(h2),
    titulo_h2_origem: origem(A.h2, 'h2.aula-title', h2),
    pergunta_mapa: {
      numero: strip(mapaCells[0]),
      tema: strip(mapaCells[1]),
      pergunta_html: mapaCells[2],
      pergunta_texto: strip(mapaCells[2]),
      origem: origem(1343, '§ MAP table > tbody > tr(05)', mapaCells[2]),
      nota: 'Única pergunta que a fonte declara para esta aula. Vive na tabela do § MAP, não na aula.',
    },
    duracao_min: null,
    dificuldade: null,
    video: null,
    ausencias_nota: 'Sem duração, dificuldade, vídeo, <img>, figura ou "Vale lembrar" dentro da section (ver varredura_de_ausencia).',
  },
  blocos,
  figuras: [],
  figuras_nota: 'Nenhuma figura na section da Aula 05: sem <img>, <svg>, <canvas>, <figure> nem div de gráfico (varredura_de_ausencia.figura_ou_imagem_na_section).',
  tabelas: blocos.filter((b) => b.tipo === 'tabela').map((b) => b.id),
  listas: [],
  listas_nota: 'Nenhum <ul>/<ol> dentro da section da Aula 05 (varredura_de_ausencia.listas_na_section).',
  formulas: blocos.filter((b) => b.tipo === 'formula').map((b) => b.id),
  destaques: blocos.filter((b) => b.tipo === 'destaque').map((b) => b.id),
  vale_lembrar: null,
  vale_lembrar_nota: 'A expressão "Vale lembrar" não ocorre no HTML do M01. Os dois destaques da aula são callout.red e callout (neutro), ver destaques.',
  varredura_de_ausencia: varredura,
  termos_lexico: {
    vinculo_declarado_pela_fonte: false,
    nota: 'O glossário da fonte (§ Lex) não declara aula por termo. Abaixo: verbetes cujo nome-base (sem parênteses) ocorre como palavra no texto da section (incluindo o instrumento). Correspondência textual, não posse; ler ocorrencias_contexto antes de ligar (§2 do protocolo).',
    total_verbetes_fonte: gloss.length,
    candidatos: termos,
  },
  instrumentos: [instrumento],
  invocacoes_no_texto: [],
  invocacoes_no_texto_nota: `Nenhum parágrafo da aula invoca o INST·04 por frase. Varredura (calculadora|instrumento|i04|INST · 04|abaixo) fora do div.instrument: ${JSON.stringify(varredura.invocacao_do_instrumento_na_prosa.linhas_fora_do_div_instrument)}. Antes dele vem a 2ª div.formula de 5.3 (L1769-1771); depois, o h3 5.4 (L1808). O bloco ${blocos[instBlocoIdx].id} marca a posição.`,
  exercicios,
  relacionados_nao_vinculados: relacionados,
  cobertura_texto_por_token: {
    ...cobertura,
    instrumento_fora_do_denominador: true,
    instrumento: { ...coberturaInst, nota: 'Cobertura à parte do div.instrument (L1774-1806): título, id, rótulos, unidades, valores iniciais e texto de leitura contra os campos extraídos de instrumentos[0]. Os atributos value/min/step dos inputs não são texto e ficam de fora do denominador.' },
    nota: 'Denominador = texto da section (L1731–L1824) sem o div.instrument (L1773–L1806), §5. Tags viram espaço antes de tokenizar (não cola spans vizinhos, ao contrário do medidor da A08). Cada token da fonte consome um token extraído.',
  },
  divergencias,
  comparacao_codigo,
  contagens: {
    blocos: blocos.length,
    blocos_por_tipo: blocos.reduce((a, b) => ((a[b.tipo] = (a[b.tipo] || 0) + 1), a), {}),
    secoes_numeradas: blocos.filter((b) => b.tipo === 'titulo').map((b) => b.numero),
    figuras: 0,
    tabelas: blocos.filter((b) => b.tipo === 'tabela').length,
    linhas_de_dados_por_tabela: blocos.filter((b) => b.tipo === 'tabela').map((b) => b.n_linhas_dados),
    formulas: blocos.filter((b) => b.tipo === 'formula').length,
    listas: 0,
    destaques: blocos.filter((b) => b.tipo === 'destaque').length,
    vale_lembrar: 0,
    instrumentos: 1,
    entradas_instrumento: campos.length,
    saidas_instrumento: instrumento.saidas.length,
    ramos_texto_leitura: ramos.length,
    invocacoes_no_texto: 0,
    exercicios_vinculados: exercicios.length,
    relacionados_nao_vinculados: relacionados.length,
    termos_lexico_candidatos: termos.length,
    verbetes_lexico_modulo: gloss.length,
    divergencias_fonte: divergencias.length,
    divergencias_codigo: comparacao_codigo.divergencias.length,
  },
};
// origens sem trecho próprio (leituras de divergência, script) recebem o início do texto da própria linha
(function completaTrechos(o) {
  if (Array.isArray(o)) return o.forEach(completaTrechos);
  if (!o || typeof o !== 'object') return;
  if (o.linha_aprox !== undefined && o.trecho_inicial === undefined) o.trecho_inicial = strip(line(o.linha_aprox)).slice(0, 60);
  for (const v of Object.values(o)) completaTrechos(v);
})(out);
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ out: OUT, blocos: blocos.length, por_tipo: out.contagens.blocos_por_tipo, termos: termos.map((t) => [t.termo, t.n_ocorrencias]), cobertura: { ...cobertura }, coberturaInst: { ...coberturaInst }, ramos: ramos.length, cenDef: cenDef.saidas, rel: relacionados.map((r) => r.id) }, null, 1));
