// Extração programática do grupo "modulo" do M02. Todo texto de conteúdo sai da fonte por regex
// escopada na seção (.aula-marker); nada é digitado. Escreve modulo.json.
import fs from 'node:fs';
import {
  html, fonteInfo, secoes, secao, all, one, ht, texto, inner, ini, origem, pad, fail, lineOf,
  carregarTS, DATA, CATALOGO, HOJE, escrever, norm, scriptOriginal, divBalanceado,
  achar, acharEm, linhasCom, div,
} from './lib.mjs';
import { marcarP14 } from './p14.mjs';

const SECS = secoes();
if (SECS.length !== 20) fail(`esperava 20 seções, achei ${SECS.length}`);

// ── identidade ───────────────────────────────────────────────────────────────
const title = one(/<title>([\s\S]*?)<\/title>/, html, 0);
const header = one(/<header class="alex-header">([\s\S]*?)<\/header>/, html, 0);
// Verificação adversarial (2ª rodada): quando se busca dentro de um grupo capturado, a base do
// índice é o início do GRUPO, não do match (antes: hero/cabeçalho/rodapé/tabela do § 00 saíam 1–3 linhas cedo).
const gi = (x) => x.idx + x.m[0].indexOf(x.m[1]);
const brand = one(/<div class="alex-brand">[\s\S]*?<span>(.*?)<\/span>/, header.m[1], gi(header));
const hmeta = one(/<div class="header-meta">(.*?)<\/div>/, header.m[1], gi(header));
const hero = one(/<section class="hero">([\s\S]*?)<\/section>/, html, 0);
const hb = hero.m[1], hbase = gi(hero);
const eyebrow = one(/<div class="hero-eyebrow">(.*?)<\/div>/, hb, hbase);
const h1 = one(/<h1 class="hero-title">(.*?)<\/h1>/, hb, hbase);
const sub = one(/<p class="hero-subtitle">(.*?)<\/p>/, hb, hbase);
const metas = all(/<div class="hero-meta-label">(.*?)<\/div>\s*<div class="(hero-meta-value[^"]*)">(.*?)<\/div>/g, hb, hbase);
if (metas.length !== 4) fail('hero-meta');
const footer = one(/<footer class="alex-footer">([\s\S]*?)<\/footer>/, html, 0);
const fBrand = one(/<div class="footer-brand">(.*?)<\/div>/, footer.m[1], gi(footer));
const fPs = all(/<p[^>]*>([\s\S]*?)<\/p>/g, footer.m[1], gi(footer));

// catálogo canônico
const cat = fs.readFileSync(CATALOGO, 'utf8');
const catIdx = cat.indexOf('## Módulo 02 — ');
const catSec = cat.slice(catIdx, cat.indexOf('\n## Módulo 03', catIdx));
const catTitulo = /## Módulo 02 — (.*)/.exec(catSec)[1].trim();
const catEscala = /\*\*Escala\*\* · ([\s\S]*?)\n\n/.exec(catSec)[1].replace(/\s+/g, ' ');
const catTrilha = /\*\*Trilha\*\* · (.*)/.exec(catSec)[1];
const catAulas = [...catSec.matchAll(/^\| (\d\d) \| (.*?) \| (.*?) \|$/gm)].map((m) => ({ aula: m[1], tema: m[2], afirma: m[3] }));
const catContagem = /^\| 02 \| (.*?) \| (\d+) \| (\d+) \| (\d+) \| (\d+) \|$/m.exec(cat);
const catAnterior = /pronto para o Módulo 02\s*\n>\s*— (.*?)\."/.exec(cat);

// código: bloco-02
const blocksSrc = fs.readFileSync(`${DATA}/alexandria-blocks.ts`, 'utf8');
const bloco02Linha = blocksSrc.split('\n').find((l) => l.includes("id: 'bloco-02'"));
const bloco02 = {
  title: /title: '([^']*)'/.exec(bloco02Linha)[1],
  level: Number(/level: (\d+)/.exec(bloco02Linha)[1]),
  track: /track: '([^']*)'/.exec(bloco02Linha)[1],
  illustrationPrefix: /illustrationPrefix: '([^']*)'/.exec(bloco02Linha)[1],
  priority: /priority: '([^']*)'/.exec(bloco02Linha)[1],
  estimatedHoursMin: /estimatedHoursMin: (\w+)/.exec(bloco02Linha)[1],
  estimatedHoursMax: /estimatedHoursMax: (\w+)/.exec(bloco02Linha)[1],
  arquivo: 'src/lib/data/alexandria-blocks.ts',
  linha_codigo: blocksSrc.split('\n').indexOf(bloco02Linha) + 1,
};

const identidade = {
  id: 'm02-identidade',
  tipo: 'identidade',
  titulo_documento: { texto: texto(title.m[1]), origem: origem('head > title', ini(title.m[1]), title.idx) },
  eyebrow: { ...ht(eyebrow.m[1]), origem: origem('section.hero .hero-eyebrow', ini(eyebrow.m[1]), eyebrow.idx) },
  titulo: { ...ht(h1.m[1]), origem: origem('section.hero h1.hero-title', ini(h1.m[1]), h1.idx) },
  subtitulo: { ...ht(sub.m[1]), origem: origem('section.hero p.hero-subtitle', ini(sub.m[1]), sub.idx) },
  meta: metas.map(({ m, idx }, i) => ({
    id: `m02-hero-meta-${pad(i + 1)}`, rotulo: texto(m[1]), valor: texto(m[3]), classe_valor: m[2],
    origem: origem('section.hero .hero-meta .hero-meta-cell', texto(m[1]), idx),
  })),
  horas: {
    texto: texto(metas[0].m[3]),
    min: null, max: null,
    nota: 'A fonte declara só a string do hero-meta "Tempo estimado". Os números não foram convertidos aqui (ausência declarada). O catálogo canônico escreve "4–5 h declaradas"; alexandria-blocks.ts traz estimatedHoursMin/Max = null para bloco-02.',
    origem: origem('section.hero .hero-meta-cell:nth(1) .hero-meta-value', texto(metas[0].m[3]), metas[0].idx),
  },
  eixos: null,
  eixos_nota: 'A fonte não declara "eixos" do módulo. O mais próximo é a tabela de "cinco consequências estruturais" do § 00 (ver tese.consequencias), que a própria fonte chama de "esqueleto de todo o resto do currículo" — não é rotulada como eixo e não foi promovida.',
  cabecalho: {
    marca: texto(brand.m[1]),
    meta_html: inner(hmeta.m[1]),
    meta_texto: texto(hmeta.m[1]),
    origem: origem('header.alex-header .alex-brand span', texto(brand.m[1]), brand.idx),
  },
  rodape: {
    marca: texto(fBrand.m[1]),
    paragrafos: fPs.map(({ m, idx }) => ({ ...ht(m[1]), origem: origem('footer.alex-footer p', ini(m[1]), idx) })),
    origem: origem('footer.alex-footer .footer-brand', texto(fBrand.m[1]), fBrand.idx),
  },
  catalogo_canonico: {
    arquivo: CATALOGO,
    titulo: catTitulo,
    trilha: catTrilha,
    escala: catEscala,
    contagens_tabela: catContagem ? { titulo: catContagem[1], secoes: +catContagem[2], aulas: +catContagem[3], instrumentos: +catContagem[4], termos: +catContagem[5] } : null,
    nome_dado_pela_fonte_do_M01: catAnterior ? catAnterior[1] : null,
    nota_p24: 'P24: o catálogo governa o nome principal ("' + catTitulo + '"). O h1 longo da fonte é conteúdo/descritor editorial, nunca segundo título oficial. A marca "GridAlpha" aparece na fonte (cabeçalho, rodapé, hero-meta, citação, callouts) e fica só como registro de proveniência.',
  },
  codigo: { bloco: bloco02 },
};

// ── § 00 tese ───────────────────────────────────────────────────────────────
const s00 = secao('§ 00');
const b00 = s00.body, base00 = s00.start;
const lead00 = one(/<p class="lead">([\s\S]*?)<\/p>/, b00, base00);
const h4crit = one(/<h4>([\s\S]*?)<\/h4>/, b00, base00);
const antesH4 = b00.slice(0, h4crit.idx - base00);
const paras00 = all(/<p>([\s\S]*?)<\/p>/g, antesH4, base00).filter(({ m }) => !/pull-quote/.test(m[0]));
const formula00 = one(/<div class="formula">\s*<div class="eq">([\s\S]*?)<\/div>\s*<div class="desc">([\s\S]*?)<\/div>/, b00, base00);
const tbl00 = one(/<table>([\s\S]*?)<\/table>/, b00, base00);
const ths00 = all(/<th[^>]*>([\s\S]*?)<\/th>/g, tbl00.m[1], gi(tbl00)).map(({ m }) => texto(m[1]));
const rows00 = all(/<tr><td><b>(\d)<\/b><\/td><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td><\/tr>/g, tbl00.m[1], gi(tbl00));
const pq = one(/<div class="pull-quote">\s*<p>([\s\S]*?)<\/p>\s*<cite>([\s\S]*?)<\/cite>/, b00, base00);
const pullIdx = b00.indexOf('<div class="pull-quote">');
const tese = {
  id: 'm02-tese',
  tipo: 'tese',
  marcador: { num: s00.num, rotulo: s00.rotulo },
  titulo_secao: { ...ht(s00.h2), origem: origem('section.aula(§ 00) h2.aula-title', ini(s00.h2), s00.h2Idx) },
  lead: { ...ht(lead00.m[1]), origem: origem('section.aula(§ 00) p.lead', ini(lead00.m[1]), lead00.idx) },
  paragrafos: paras00
    .filter(({ idx }) => idx < base00 + pullIdx)
    .map(({ m, idx }, i) => ({ id: `m02-tese-p${i + 1}`, ...ht(m[1]), origem: origem('section.aula(§ 00) > p', ini(m[1]), idx) })),
  formula: { eq: ht(formula00.m[1]), desc: ht(formula00.m[2]), origem: origem('section.aula(§ 00) div.formula', ini(formula00.m[1]), formula00.idx) },
  consequencias: {
    cabecalho: ths00,
    linhas: rows00.map(({ m, idx }) => ({ id: `m02-consequencia-${m[1]}`, numero: +m[1], consequencia_fisica: ht(m[2]), instituicao_ou_cobranca: ht(m[3]), origem: origem('section.aula(§ 00) table tbody tr', texto(m[2]).slice(0, 60), idx) })),
    origem: origem('section.aula(§ 00) .table-wrap table', ths00[0], tbl00.idx),
  },
  citacao: { ...ht(pq.m[1]), atribuicao: texto(pq.m[2]), origem: origem('section.aula(§ 00) .pull-quote', ini(pq.m[1]), pq.idx) },
  origem: origem('section.aula .aula-marker "§ 00"', '§ 00', s00.markerIdx),
};
if (tese.consequencias.linhas.length !== 5) fail('consequências');

// ── critério de domínio (§ 00) + resultado esperado ─────────────────────────
const pCrit = one(/<\/h4>\s*<p>([\s\S]*?)<\/p>/, b00, base00);
const pAlem = one(/<p>(Além disso[\s\S]*?)<\/p>/, b00, base00);
const lis00 = all(/<li[^>]*>([\s\S]*?)<\/li>/g, b00, base00);
const resultado = {
  id: 'm02-resultado-esperado',
  tipo: 'capacidades',
  nota: 'A fonte do M02 não tem um h4 "Resultado esperado". O bloco equivalente no § 00 é o h4 "' + texto(h4crit.m[1]) + '" + parágrafo com dois itens numerados (critério de passagem) + "Além disso, ao final você consegue:" + lista de 8 itens. Os dois grupos estão abaixo, separados como a fonte os separa.',
  titulo: { texto: texto(h4crit.m[1]), origem: origem('section.aula(§ 00) h4', texto(h4crit.m[1]), h4crit.idx) },
  criterio_de_passagem: {
    id: 'm02-crit-guardanapo',
    ...ht(pCrit.m[1]),
    itens_numerados: [...pCrit.m[1].matchAll(/<strong>\((\d)\)<\/strong>\s*([\s\S]*?)(?=;\s*e\s*<strong>|\. O guardanapo)/g)].map((m) => ({ numero: +m[1], ...ht(m[2]) })),
    marcacao_p14: ['sem_consulta', 'producao_oral_ou_livre', 'desenho'],
    marcacao_p14_nota: 'Inferido da frase: "sem consultar nada"; item (1) é explicação livre; item (2) é desenho ("desenhar num guardanapo"). Não é cronometrado. Anotação desta extração, não texto da fonte.',
    origem: origem('section.aula(§ 00) h4 + p', ini(pCrit.m[1]), pCrit.idx),
  },
  preambulo: { ...ht(pAlem.m[1]), origem: origem('section.aula(§ 00) > p', ini(pAlem.m[1]), pAlem.idx) },
  itens: lis00.map(({ m, idx }, i) => ({ id: `m02-cap-${pad(i + 1)}`, tipo: 'capacidade', ordem: i + 1, ...ht(m[1]), marcacao_p14: marcarP14(texto(m[1])), origem: origem('section.aula(§ 00) ul > li', ini(m[1]), idx) })),
};
if (resultado.itens.length !== 8) fail('esperava 8 capacidades');
if (resultado.criterio_de_passagem.itens_numerados.length !== 2) fail('itens numerados do critério');

// ── § MAP ──────────────────────────────────────────────────────────────────
const sMap = secao('§ MAP');
const pMap = one(/<p>([\s\S]*?)<\/p>/, sMap.body, sMap.start);
const thMap = all(/<th[^>]*>([\s\S]*?)<\/th>/g, sMap.body, sMap.start).map(({ m }) => texto(m[1]));
const rowsMap = all(/<tr><td><b>(\d\d)<\/b><\/td><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td><\/tr>/g, sMap.body, sMap.start);
const mapa = {
  id: 'm02-mapa',
  tipo: 'mapa_do_modulo',
  marcador: { num: sMap.num, rotulo: sMap.rotulo },
  titulo_secao: { ...ht(sMap.h2), origem: origem('section.aula(§ MAP) h2', ini(sMap.h2), sMap.h2Idx) },
  intro: { ...ht(pMap.m[1]), origem: origem('section.aula(§ MAP) > p', ini(pMap.m[1]), pMap.idx) },
  cabecalho_tabela: thMap,
  linhas: rowsMap.map(({ m, idx }) => ({
    id: `m02-map-aula-${m[1]}`, tipo: 'pergunta_da_aula', aula: m[1], tema: texto(m[2]), pergunta: ht(m[3]),
    vinculos: { aula_id_codigo: `aula-02-${m[1]}` },
    origem: origem('section.aula(§ MAP) table tbody tr', texto(m[2]), idx),
  })),
  origem: origem('section.aula .aula-marker "§ MAP"', '§ MAP', sMap.markerIdx),
};
if (mapa.linhas.length !== 10) fail('MAP 10 linhas');

// ── roteiro (20 seções) ────────────────────────────────────────────────────
const roteiro = SECS.map((s, i) => {
  const isAula = /^Aula \d\d$/.test(s.num);
  const item = {
    id: isAula ? `m02-roteiro-aula-${s.num.slice(5)}` : `m02-roteiro-${s.num.replace('§ ', '').toLowerCase()}`,
    tipo: isAula ? 'aula' : 'aparato',
    ordem_na_fonte: i + 1,
    marcador_num: s.num,
    marcador_rotulo: s.rotulo,
    titulo: ht(s.h2),
    origem: origem('section.aula .aula-marker', s.num, s.markerIdx),
  };
  if (isAula) {
    item.subsecoes = all(/<h3><span class="num">(.*?)<\/span>([\s\S]*?)<\/h3>/g, s.body, s.start).map(({ m, idx }) => ({ numero: m[1], titulo: texto(m[2]), linha_aprox: lineOf(idx) }));
    item.instrumentos = all(/<div class="instrument-id">(.*?)<\/div>/g, s.body, s.start).map(({ m }) => texto(m[1]));
    item.exercicios_que_apontam_esta_aula = null; // preenchido abaixo
    item.pergunta_do_map = mapa.linhas.find((l) => l.aula === s.num.slice(5))?.pergunta.texto ?? null;
    item.vinculos = { aula_id_codigo: `aula-02-${s.num.slice(5)}`, map: `m02-map-aula-${s.num.slice(5)}` };
    const lead = /<p class="lead">([\s\S]*?)<\/p>/.exec(s.body);
    item.lead = lead ? ht(lead[1]) : null;
    item.intervalo_linhas = [lineOf(s.start), lineOf(s.end)];
  }
  return item;
});
const aulasRot = roteiro.filter((r) => r.tipo === 'aula');
if (aulasRot.length !== 10) fail('10 aulas');
// exercícios por aula (tag "Aula NN")
for (const { m } of all(/<span class="exercise-tag">(.*?)<\/span>/g, html, 0)) {
  const a = /Aula (\d\d)/.exec(m[1]);
  if (!a) continue;
  const r = aulasRot.find((x) => x.marcador_num === `Aula ${a[1]}`);
  (r.exercicios_que_apontam_esta_aula ||= []).push(texto(m[1]));
}
aulasRot.forEach((r) => { if (!r.exercicios_que_apontam_esta_aula) r.exercicios_que_apontam_esta_aula = []; });

// ── critérios (todas as formas literais) ───────────────────────────────────
const sQuiz = secao('§ Quiz');
const pQuiz = one(/<p>([\s\S]*?)<\/p>/, sQuiz.body, sQuiz.start);
const sFinal = secao('§ Final');
const pFinal = one(/<p>([\s\S]*?)<\/p>/, sFinal.body, sFinal.start);
const sVoz = secao('§ Voz');
const leadVoz = one(/<p class="lead">([\s\S]*?)<\/p>/, sVoz.body, sVoz.start);
const { codigo: scr, linhaInicio } = scriptOriginal();
const scoreMsgs = [...html.matchAll(/(?:else )?(?:if\((correct >= \d)\) )?scoreMsg\.textContent = "(.*?)";/g)].map((m) => ({
  condicao: m[1] ?? 'else (correct < 5)', mensagem: m[2], origem: origem('script QUIZ scoreMsg', m[2].slice(0, 50), m.index),
}));
if (scoreMsgs.length !== 4) fail('4 mensagens de placar');
const sEx = secao('§ Ex');
const pEx = one(/<p>([\s\S]*?)<\/p>/, sEx.body, sEx.start);
const checklistItens = all(/<div class="checklist-text">([\s\S]*?)<\/div>/g, sFinal.body, sFinal.start);
const criterio = {
  id: 'm02-criterio',
  tipo: 'criterio_do_modulo',
  nota_p18: 'Várias formas literais de critério coexistem (§ 00, § Quiz, § Final, § Voz, placar do script — este dentro de m02-crit-quiz.mensagens_do_script). A 5ª entrada da lista (m02-crit-ex) não é critério: registra que o § Ex não declara limiar. Registradas lado a lado, nenhuma escolhida (P18: nenhum limiar legado declara domínio nem trava trilha).',
  criterios: [
    { id: 'm02-crit-00', secao: '§ 00', tipo: 'criterio_de_passagem_oral_e_desenho', ref: 'resultado_esperado.criterio_de_passagem', texto: resultado.criterio_de_passagem.texto, marcacao_p14: resultado.criterio_de_passagem.marcacao_p14, origem: resultado.criterio_de_passagem.origem },
    {
      id: 'm02-crit-quiz', secao: '§ Quiz', tipo: 'criterio_quiz', ...ht(pQuiz.m[1]),
      limiar_literal: /<strong>(.*?)<\/strong>/.exec(pQuiz.m[1])[1],
      mensagens_do_script: scoreMsgs,
      marcacao_p14: ['automatizavel', 'sem_consulta', 'P18_limiar_nao_e_evidencia'],
      origem: origem('section.aula(§ Quiz) > p', ini(pQuiz.m[1]), pQuiz.idx),
    },
    {
      id: 'm02-crit-final', secao: '§ Final', tipo: 'criterio_conclusao', titulo_secao: ht(sFinal.h2), ...ht(pFinal.m[1]),
      itens_ref: 'aparato.json → checklist_final.itens',
      n_itens: checklistItens.length,
      marcacao_p14: ['sem_consulta', 'autodeclarado_sem_registro'],
      nota: 'Marcação por toggle visual (script CHECKLIST: classList.toggle("checked")), sem persistência nem verificação. A frase combina o checklist com o quiz ("e o quiz fechar em 8/10 ou mais").',
      origem: origem('section.aula(§ Final) > p', ini(pFinal.m[1]), pFinal.idx),
    },
    {
      id: 'm02-crit-voz', secao: '§ Voz', tipo: 'criterio_oral', ...ht(leadVoz.m[1]),
      marcacao_p14: ['oral', 'sem_consulta', 'cronometrado'],
      marcacao_p14_nota: '"trinta perguntas-relâmpago — responda sem travar, sem consultar" (oral) e "um roteiro de cinco minutos para gravar, ouvir e refazer de cabeça" (oral, cronometrado). Nenhum registro na fonte.',
      origem: origem('section.aula(§ Voz) p.lead', ini(leadVoz.m[1]), leadVoz.idx),
    },
    {
      id: 'm02-crit-ex', secao: '§ Ex', tipo: 'sem_criterio_numerico', ...ht(pEx.m[1]),
      nota: 'O § Ex do M02 não declara limiar (diferente do § Drill do M01, "seis dos oito"). Só a instrução "Resolva antes de revelar".',
      origem: origem('section.aula(§ Ex) > p', ini(pEx.m[1]), pEx.idx),
    },
  ],
};

// ── laboratórios ───────────────────────────────────────────────────────────
const temLab = SECS.some((s) => /Lab/i.test(s.num));
const laboratorios = {
  itens: [],
  nota: temLab ? 'ver itens' : 'A fonte do M02 não tem seção § Lab (zero marcadores com "Lab"; zero ocorrência de "LAB"). Os 9 instrumentos estão todos dentro de aulas (ver instrumentos.json). Ausência declarada, não preenchida.',
  contagem_ocorrencias_LAB: (html.match(/LAB/g) || []).length,
};

// ── voz / princípios editoriais ────────────────────────────────────────────
const callouts = all(/<div class="callout( \w+)?">\s*<div class="callout-label">([\s\S]*?)<\/div>\s*<p>([\s\S]*?)<\/p>/g, html, 0).map(({ m, idx }) => {
  const sec = SECS.find((s) => s.start <= idx && idx < s.end);
  return { tom: (m[1] || '').trim() || 'neutro', rotulo: texto(m[2]), ...ht(m[3]), secao: sec?.num ?? null, origem: origem(`section.aula(${sec?.num}) .callout${m[1] || ''}`, texto(m[2]), idx) };
});
const v1 = one(/<h3><span class="num">V\.1<\/span>([\s\S]*?)<\/h3>/, sVoz.body, sVoz.start);
const v1li = all(/<li[^>]*>([\s\S]*?)<\/li>/g, sVoz.body, sVoz.start);
const v2 = one(/<h3><span class="num">V\.2<\/span>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/, sVoz.body, sVoz.start);
const rTitle = one(/<div class="case-title">([\s\S]*?)<\/div>\s*<div class="case-subtitle">([\s\S]*?)<\/div>/, sVoz.body, sVoz.start);
const rBodyIdx = sVoz.body.indexOf('<div class="case-body">');
const rPs = all(/<p>([\s\S]*?)<\/p>/g, sVoz.body.slice(rBodyIdx), sVoz.start + rBodyIdx);
const refLead = one(/<p class="lead">([\s\S]*?)<\/p>/, secao('§ Ref').body, secao('§ Ref').start);
const voz = {
  secao_voz: {
    id: 'm02-voz',
    marcador: { num: sVoz.num, rotulo: sVoz.rotulo },
    titulo_secao: ht(sVoz.h2),
    lead: { ...ht(leadVoz.m[1]), origem: origem('section.aula(§ Voz) p.lead', ini(leadVoz.m[1]), leadVoz.idx) },
    perguntas_relampago: {
      numero: 'V.1', titulo: texto(v1.m[1]),
      itens: v1li.map(({ m, idx }, i) => ({ id: `m02-voz-q${pad(i + 1)}`, ordem: i + 1, ...ht(m[1]), marcacao_p14: ['oral', 'sem_consulta'], origem: origem('section.aula(§ Voz) ol > li', ini(m[1]), idx) })),
      origem: origem('section.aula(§ Voz) h3 V.1', texto(v1.m[1]), v1.idx),
    },
    roteiro_oral: {
      numero: 'V.2', titulo: texto(v2.m[1]), instrucao: ht(v2.m[2]),
      cartao_titulo: texto(rTitle.m[1]), cartao_subtitulo: texto(rTitle.m[2]),
      paragrafos: rPs.map(({ m, idx }, i) => ({ id: `m02-voz-roteiro-p${i + 1}`, ...ht(m[1]), origem: origem('section.aula(§ Voz) .case-study .case-body > p', ini(m[1]), idx) })),
      marcacao_p14: ['oral', 'cronometrado', 'sem_consulta'],
      origem: origem('section.aula(§ Voz) h3 V.2', texto(v2.m[1]), v2.idx),
    },
    origem: origem('section.aula .aula-marker "§ Voz"', '§ Voz', sVoz.markerIdx),
  },
  principios_editoriais: [
    { id: 'm02-voz-linguagem-responsavel', ...callouts.find((c) => c.secao === '§ 00') },
    { id: 'm02-voz-ref-lead', rotulo: null, ...ht(refLead.m[1]), secao: '§ Ref', origem: origem('section.aula(§ Ref) p.lead', ini(refLead.m[1]), refLead.idx) },
    { id: 'm02-voz-rodape', rotulo: null, ...identidade.rodape.paragrafos[1], secao: 'footer' },
  ],
  callouts_numeros_vivos: callouts.filter((c) => c.tom === 'red').map((c, i) => ({ id: `m02-voz-numeros-vivos-${pad(i + 1)}`, ...c })),
  callouts_por_rotulo: callouts.map((c) => ({ rotulo: c.rotulo, tom: c.tom, secao: c.secao, linha_aprox: c.origem.linha_aprox })),
};
if (voz.secao_voz.perguntas_relampago.itens.length !== 30) fail('30 perguntas');

// ── erros comuns (§ Erros) ─────────────────────────────────────────────────
const sErr = secao('§ Erros');
const leadErr = one(/<p class="lead">([\s\S]*?)<\/p>/, sErr.body, sErr.start);
const thErr = all(/<th[^>]*>([\s\S]*?)<\/th>/g, sErr.body, sErr.start).map(({ m }) => texto(m[1]));
const rowsErr = all(/<tr><td><b>(\d) · ([\s\S]*?)<\/b><\/td><td>([\s\S]*?)<\/td><\/tr>/g, sErr.body, sErr.start);
const erros_comuns = {
  id: 'm02-erros',
  tipo: 'erros_comuns',
  marcador: { num: sErr.num, rotulo: sErr.rotulo },
  titulo_secao: ht(sErr.h2),
  lead: { ...ht(leadErr.m[1]), origem: origem('section.aula(§ Erros) p.lead', ini(leadErr.m[1]), leadErr.idx) },
  cabecalho_tabela: thErr,
  itens: rowsErr.map(({ m, idx }) => ({ id: `m02-erro-${pad(m[1])}`, numero: +m[1], mito: ht(m[2]), correcao: ht(m[3]), origem: origem('section.aula(§ Erros) table tbody tr', texto(m[2]), idx) })),
  vinculos: { aula: null, aula_nota: 'Nenhum item declara aula por tag. Referências em prosa: erro 5 cita "a Aula 08"; o gabarito do Ex · 09 cita "Erro 4 da tabela de mitos".' },
  origem: origem('section.aula .aula-marker "§ Erros"', '§ Erros', sErr.markerIdx),
};
if (erros_comuns.itens.length !== 8) fail('8 erros');

// ── tradutor / § Map / três níveis ─────────────────────────────────────────
// bloco balanceado (a regex antiga fechava no lugar errado e perdia painéis)
const tres = all(/<div class="three-levels">/g, html, 0).map(({ idx }, i) => {
  const sec = SECS.find((s) => s.start <= idx && idx < s.end);
  const corpo = divBalanceado(idx).inner;
  const base = html.indexOf('>', idx) + 1;
  const tabs = [...corpo.matchAll(/<button class="three-levels-tab[^"]*">(.*?)<\/button>/g)].map((x) => texto(x[1]));
  const panels = [...corpo.matchAll(/<div class="three-levels-panel[^"]*">/g)].map((x) => {
    const abs = base + x.index;
    const pin = divBalanceado(abs).inner;
    return { ...ht(pin), origem: origem(`section.aula(${sec.num}) .three-levels-panel`, ini(pin), abs) };
  });
  if (tabs.length !== 3 || panels.length !== 3) fail('three-levels em ' + lineOf(idx));
  return { id: `m02-tres-niveis-${pad(i + 1)}`, aula: sec.num, niveis: tabs.map((t, k) => ({ nivel: t, ...panels[k] })), origem: origem(`section.aula(${sec.num}) .three-levels`, tabs[0], idx) };
});
const tradutor = {
  secao_map_tradutor: null,
  nota: 'O M02 não tem a seção "§ Map · Tradutor" que o M01 tem (zero marcador "§ Map"; só "§ MAP" = mapa das aulas). A estrutura mais próxima é o componente "three-levels" (Criança de 12 anos / Executivo não-técnico / Especialista de setor), que vive dentro de 6 aulas — listado abaixo como ponteiro literal.',
  tres_niveis: tres,
};

// ── comparação com o código ────────────────────────────────────────────────
const C2 = await carregarTS(`${DATA}/alexandria-modulo-02-content.ts`);
const trilhasSrc = fs.readFileSync(`${DATA}/alexandria-trilhas.ts`, 'utf8');
const aulasPorBloco = Number(/'bloco-02': (\d+)/.exec(trilhasSrc)[1]);
const corpoTxt = JSON.stringify(C2.MODULO_02_CORPO);
const cmpAulas = aulasRot.map((r) => {
  const n = +r.marcador_num.slice(5);
  const a = C2.MODULO_02_AULAS.find((x) => x.number === n);
  const corpo = C2.MODULO_02_CORPO[`aula-02-${pad(n)}`] || [];
  const titulosCodigo = corpo.filter((b) => b.kind === 'titulo').map((b) => `${b.numero} ${b.texto}`);
  const titulosFonte = r.subsecoes.map((s) => `${s.numero} ${s.titulo}`);
  return {
    aula: r.marcador_num,
    id_codigo: a?.id ?? null,
    titulo_fonte: r.titulo.texto, titulo_codigo: a?.title ?? null, titulo_igual: a ? norm(a.title) === r.titulo.texto : false,
    rotulo_fonte: r.marcador_rotulo, subtitulo_codigo: a?.subtitle ?? null, subtitulo_igual: a ? a.subtitle === r.marcador_rotulo : false,
    subsecoes_fonte: titulosFonte.length, subsecoes_codigo: titulosCodigo.length,
    subsecoes_iguais: JSON.stringify(titulosFonte) === JSON.stringify(titulosCodigo.map((t) => norm(t))),
    instrumentos_fonte: r.instrumentos, instrumentos_codigo: (a?.instruments || []).map((x) => x.id),
    exercicios_fonte: r.exercicios_que_apontam_esta_aula, exercicios_codigo: (a?.activities || []).map((x) => x.config?.tag),
    lead_igual: C2.MODULO_02_LEAD[`aula-02-${pad(n)}`] != null && norm(C2.MODULO_02_LEAD[`aula-02-${pad(n)}`]) === r.lead?.texto,
    tres_niveis_na_fonte: tres.some((t) => t.aula === r.marcador_num),
  };
});
const comparacao_codigo = {
  arquivos: ['src/lib/data/alexandria-modulo-02-content.ts', 'src/lib/data/alexandria-blocks.ts', 'src/lib/data/alexandria-trilhas.ts', 'src/lib/data/alexandria-curriculo.ts'],
  contagem_aulas: { fonte: aulasRot.length, map_h2: texto(sMap.h2), codigo_MODULO_02_AULAS: C2.MODULO_02_AULAS.length, codigo_AULAS_POR_BLOCO: aulasPorBloco, catalogo: catContagem ? +catContagem[3] : null, totalInModule_codigo: [...new Set(C2.MODULO_02_AULAS.map((a) => a.totalInModule))] },
  aulas: cmpAulas,
  tres_niveis_no_codigo: /Criança de 12 anos|three-levels/.test(corpoTxt),
  tese_mapa_erros_voz_no_codigo: {
    tese_lead: /Eletricidade, em escala de rede, não se armazena/.test(fs.readFileSync(`${DATA}/alexandria-modulo-02-content.ts`, 'utf8')),
    erros: /Rede elétrica é só fio/.test(fs.readFileSync(`${DATA}/alexandria-modulo-02-content.ts`, 'utf8')),
    voz: /Trinta perguntas sem travar/.test(fs.readFileSync(`${DATA}/alexandria-modulo-02-content.ts`, 'utf8')),
    nota: 'Busca literal em alexandria-modulo-02-content.ts. false = conteúdo não portado para src/lib/data.',
  },
  catalogo_aulas: catAulas.map((c) => {
    const r = aulasRot.find((x) => x.marcador_num === `Aula ${c.aula}`);
    return { ...c, tema_igual_rotulo_fonte: c.tema === r.marcador_rotulo, afirma_igual_titulo_fonte: c.afirma === r.titulo.texto };
  }),
};

// ── divergências e lacunas (registro; nenhuma resolvida) ───────────────────
const CONTENT = `${DATA}/alexandria-modulo-02-content.ts`;
const contentSrc = fs.readFileSync(CONTENT, 'utf8');
const M01 = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const m01src = fs.readFileSync(M01, 'utf8');
const m01Idx = m01src.indexOf('02 · A Rede Elétrica');
const exMarkup = (html.slice(sEx.start, sEx.end).match(/<div class="exercise">/g) || []).length;
const produtoCallouts = callouts.filter((c) => /produto|GridAlpha/.test(c.rotulo));
const tresNoCodigo = tres.flatMap((t) => t.niveis).filter((n) => contentSrc.includes(n.texto.slice(0, 40))).length;
const calloutsProdutoNoCodigo = produtoCallouts.filter((c) => contentSrc.includes(c.rotulo)).map((c) => c.rotulo);
const blocoRefs = linhasCom('Bloco ').map((l) => ({ linha: l, refs: [...LINHAS_M(l).matchAll(/Bloco (\d+)/g)].map((m) => m[1]) }));
function LINHAS_M(l) { return html.split('\n')[l - 1]; }
const divergencias = [
  div('div-m02-01', 'fonte×fonte', 'alta', 'Critério do módulo em cinco formas literais',
    { texto: 'Você passa no Bloco 2 quando consegue, sem consultar nada: (1) … e (2) … [2 itens: explicação + desenho]', origem: resultado.criterio_de_passagem.origem },
    { texto: '§ Quiz "8 de 10" · § Final "todas as ações abaixo" (18 itens) "e o quiz fechar em 8/10 ou mais" · § Voz "todo conceito sobrevive em voz alta" · placar do script (ver div-m02-02)', origem: [criterio.criterios[1].origem, criterio.criterios[2].origem, criterio.criterios[3].origem] },
    'Nenhuma forma prevalece. P18: nenhum limiar legado declara domínio, emite competência ou trava trilha.'),
  div('div-m02-02', 'fonte×fonte', 'alta', 'Placar do script × limiar 8/10',
    { texto: 'O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar.', origem: criterio.criterios[1].origem },
    { texto: 'correct >= 7 → "Bom. Revise os pontos errados, depois avance para o próximo módulo." (7 acertos já manda avançar; 8 recebe "Revise"; "Pronto para o Módulo 03" só com ≥ 9)', origem: scoreMsgs[1].origem },
    'Mesma contradição do M01 (L3199–3202 lá). Registro legado (P18).'),
  div('div-m02-03', 'fonte×fonte', 'média', '§ Ex: prosa "Oito exercícios" × markup com 10 div.exercise',
    { texto: texto(sEx.h2), origem: origem('section.aula(§ Ex) h2', ini(sEx.h2), sEx.h2Idx) },
    { texto: `${exMarkup} div.exercise no markup (Ex · 09 e Ex · 10 usam div.exercise-label e não apontam aula)`, origem: achar('<div class="exercise-label">', 'section.aula(§ Ex) div.exercise-label') },
    'Precedente citado no protocolo §5 ("Módulo 02 (\'Oito exercícios\', há 10)") — confirmado por medição. O markup vence a contagem; a prosa fica literal.'),
  div('div-m02-04', 'fonte×catálogo', 'média', 'Escala do catálogo: "8 exercícios" × 10 no markup',
    { texto: `${exMarkup} div.exercise`, origem: achar('<div class="exercise-label">', 'section.aula(§ Ex) div.exercise-label') },
    { texto: '8 exercícios', origem: acharEm(CATALOGO, '10 aulas · 9 instrumentos · 65 termos · 8 exercícios', 'catalogo-modulos-alexandria.md') }, // verificação adversarial: '8 exercícios' sozinho casava a Escala do M01 (L111)
    'O catálogo repete a prosa da fonte. Pendência FOUNDRY (arquivo fora de posse).'),
  div('div-m02-05', 'fonte×catálogo', 'média', 'Catálogo diz que o critério é "declarado duas vezes, com a mesma substância"',
    { texto: '5 formas literais (§ 00, § Quiz, § Final, § Voz, placar) — ver div-m02-01', origem: criterio.criterios.map((c) => c.origem) },
    { texto: 'Declarado duas vezes, com a mesma substância.', origem: acharEm(CATALOGO, 'Declarado duas vezes, com a mesma substância', 'catalogo-modulos-alexandria.md') },
    'O catálogo omite o 8/10 do § Quiz, o § Voz e as mensagens do placar. Pendência FOUNDRY.'),
  div('div-m02-06', 'fonte×fonte (P24)', 'baixa', 'Título: h1 longo × título curto do <title>/rodapé/catálogo',
    { texto: identidade.titulo.texto, origem: identidade.titulo.origem },
    { texto: identidade.titulo_documento.texto, origem: identidade.titulo_documento.origem, catalogo: catTitulo },
    'O título curto da fonte coincide com o catálogo ("Como Funciona uma Rede Elétrica"). P24: o catálogo governa o nome; o h1 é descritor editorial.'),
  div('div-m02-07', 'fonte M01 × fonte M02/catálogo', 'baixa', 'Nome do M02 na fonte do M01',
    { texto: '02 · A Rede Elétrica', origem: { arquivo: M01, seletor: 'section.hero .hero-meta-value (Próximo módulo)', trecho_inicial: '02 · A Rede Elétrica', linha_aprox: m01src.slice(0, m01Idx).split('\n').length } },
    { texto: catTitulo, origem: identidade.titulo_documento.origem },
    'Já registrado na extração do M01 (div-06). P24: catálogo governa.'),
  div('div-m02-08', 'fonte×produto (P24/P7)', 'média', 'Marca GridAlpha e blocos de produto visíveis ao learner',
    { texto: `"GridAlpha" em ${(html.match(/GridAlpha/g) || []).length} ocorrências (linhas ${linhasCom('GridAlpha').join(', ')}); hero-meta "${identidade.meta[2].rotulo}: ${identidade.meta[2].valor}"; ${produtoCallouts.length} callouts de produto: ${produtoCallouts.map((c) => `"${c.rotulo}" (${c.secao})`).join('; ')}`, origem: identidade.meta[2].origem },
    { texto: `Código atual: "GridAlpha" ${(contentSrc.match(/GridAlpha/g) || []).length}× em alexandria-modulo-02-content.ts; callouts de produto portados: ${calloutsProdutoNoCodigo.map((r) => `"${r}"`).join(', ')}`, origem: { arquivo: 'src/lib/data/alexandria-modulo-02-content.ts' } },
    'Fonte mantida literal. P24: GridAlpha só como proveniência; P7: bloco "onde isso entra no produto" fora da interface. O código atual ainda carrega os dois (pendência já listada nas decisões de 2026-09-16).'),
  div('div-m02-09', 'fonte (vocabulário interno)', 'baixa', 'Vocabulário interno visível ao learner',
    { texto: `"${identidade.cabecalho.meta_texto}" no cabeçalho; "Summit" nas linhas ${linhasCom('Summit').join(', ')} (§ Ex e veredito do INST · 09); "Bloco 2" no critério de passagem`, origem: { seletor: 'header.alex-header .header-meta', trecho_inicial: 'Módulo 02 · Cobaia Zero v2.0', linha_aprox: linhasCom('Cobaia Zero')[0] } }, // verificação adversarial: antes apontava para .alex-brand ("GridAlpha · Alexandria Library")
    { texto: 'O produto chama o módulo de "Módulo 02"; "Cobaia Zero" e "Summit" não são definidos para o learner.', origem: null },
    'Mesma classe do "War Room" do M01. Registrado; tratamento é da camada editorial.'),
  div('div-m02-10', 'fonte×catálogo', 'baixa', 'Referências cruzadas "Bloco N" × numeração do catálogo',
    { texto: blocoRefs.map((b) => `L${b.linha}: Bloco ${b.refs.join('/')}`).join('; '), origem: blocoRefs.map((b) => ({ seletor: 'prosa', trecho_inicial: `Bloco ${b.refs[0]}`, linha_aprox: b.linha })) },
    { texto: 'Catálogo: Módulo 05 = "Regulação e Desenho de Mercados"; Módulo 09 = "Os Mercados ACR e ACL em Profundidade"; Módulo 04 = "Economia de Mercados de Energia"', origem: acharEm(CATALOGO, '## Módulo 05 — Regulação e Desenho de Mercados', 'catalogo-modulos-alexandria.md') },
    'Leitura A: "Bloco 5" (L2374, L3142: "mercado livre") e "Bloco 9" (L1877, L2947: PLD) apontam os módulos do currículo antigo e podem não bater com o catálogo atual (mercado livre = M09; PLD também no M04). Leitura B: "Bloco N" = "Módulo N" e o conteúdo será coberto lá. Bloco 6 (história), 7 (institucional) e 10 (CCC/tarifa) batem com o catálogo. Não resolvido.'),
  div('div-m02-11', 'fonte×código', 'baixa', 'Horas declaradas × blocks.ts',
    { texto: identidade.horas.texto, origem: identidade.horas.origem },
    { texto: `estimatedHoursMin: ${bloco02.estimatedHoursMin}, estimatedHoursMax: ${bloco02.estimatedHoursMax}`, origem: { arquivo: bloco02.arquivo, linha_aprox: bloco02.linha_codigo } },
    'O catálogo registra "4–5 h declaradas". A fonte só tem a string; converter é decisão do produto.'),
  div('div-m02-12', 'fonte×código', 'baixa', 'illustrationPrefix "red-" × zero <img> na fonte',
    { texto: `${(html.match(/<img/g) || []).length} <img> no HTML-fonte`, origem: null },
    { texto: `illustrationPrefix: '${bloco02.illustrationPrefix}'`, origem: { arquivo: bloco02.arquivo, linha_aprox: bloco02.linha_codigo } },
    'As gravuras não vêm da fonte (protocolo §7). Registro informativo.'),
  div('div-m02-13', 'código (comentário)×fonte', 'baixa', 'Comentário do código atribui "Dez aulas" ao hero',
    { texto: texto(sMap.h2), origem: origem('section.aula(§ MAP) h2', ini(sMap.h2), sMap.h2Idx) },
    { texto: 'o hero declara "Dez aulas".', origem: acharEm(CONTENT, 'o hero declara "Dez aulas"', 'src/lib/data/alexandria-modulo-02-content.ts') },
    'A frase está no h2 do § MAP; o hero não declara contagem de aulas. A contagem (10) está certa.'),
  div('div-m02-14', 'fonte×código', 'alta', 'Conteúdo de módulo ausente do código',
    { texto: `Na fonte: tese (§ 00), ${resultado.itens.length} capacidades + critério de passagem, ${mapa.linhas.length} perguntas do § MAP, ${criterio.criterios.length} formas de critério, § Voz (30 perguntas + roteiro de 7 parágrafos), § Erros (8), ${tres.length} blocos "três níveis" (${tres.length * 3} painéis)`, origem: tese.origem },
    { texto: `No código: tese ${comparacao_codigo.tese_mapa_erros_voz_no_codigo.tese_lead ? 'presente' : 'ausente'}, erros ${comparacao_codigo.tese_mapa_erros_voz_no_codigo.erros ? 'presentes' : 'ausentes'}, voz ${comparacao_codigo.tese_mapa_erros_voz_no_codigo.voz ? 'presente' : 'ausente'}; painéis "três níveis" encontrados: ${tresNoCodigo}/${tres.length * 3}`, origem: { arquivo: 'src/lib/data/alexandria-modulo-02-content.ts' } },
    'Os painéis "três níveis" estão DENTRO de seis aulas (01, 05, 06, 07, 08, 10) e não foram portados para MODULO_02_CORPO — perda de conteúdo de aula, não só de módulo. Verificado por busca literal dos 40 primeiros caracteres de cada painel.'),
  div('div-m02-15', 'fonte×fonte', 'baixa', 'Rótulo de nível em três grafias',
    { texto: `${identidade.meta[1].rotulo}: ${identidade.meta[1].valor}`, origem: identidade.meta[1].origem },
    { texto: `${identidade.eyebrow.texto} · rodapé: ${identidade.rodape.paragrafos[0].texto}`, origem: identidade.eyebrow.origem },
    'Mesma substância (Nível 1 · Fundamentos), grafias diferentes. Catálogo: "Fundamentos Universais".'),
];
const lacunas = [
  { id: 'lac-m02-01', campo: 'identidade.eixos', valor: null, nota: identidade.eixos_nota },
  { id: 'lac-m02-02', campo: 'identidade.horas.min/max', valor: null, nota: 'A fonte só tem a string "4 – 5 horas".' },
  { id: 'lac-m02-03', campo: 'resultado_esperado (h4 "Resultado esperado")', valor: null, nota: resultado.nota },
  { id: 'lac-m02-04', campo: 'laboratorios', valor: [], nota: laboratorios.nota },
  { id: 'lac-m02-05', campo: 'tradutor (§ Map)', valor: null, nota: tradutor.nota },
  { id: 'lac-m02-06', campo: 'criterio § Ex', valor: null, nota: 'O § Ex não declara limiar nem critério por exercício.' },
  { id: 'lac-m02-07', campo: 'erros_comuns.vinculos.aula', valor: null, nota: erros_comuns.vinculos.aula_nota },
  { id: 'lac-m02-08', campo: 'aulas: duração, dificuldade, vídeo, imagens', valor: null, nota: `Zero <video>/<iframe>/youtube/vimeo e ${(html.match(/<img/g) || []).length} <img> no arquivo; nenhuma duração ou dificuldade por aula.` },
  { id: 'lac-m02-09', campo: 'registro/avaliação do § Voz e do § Final', valor: null, nota: 'Perguntas-relâmpago e roteiro oral sem gabarito nem registro; checklist é toggle visual sem persistência.' },
  { id: 'lac-m02-10', campo: 'vínculo aula ↔ capacidade', valor: null, nota: 'A fonte não liga as 8 capacidades nem os 18 itens do checklist a aulas.' },
  { id: 'lac-m02-11', campo: 'marcacao_p14', valor: 'inferida', nota: 'Anotação desta extração (verbo/frase), não texto da fonte; exige revisão humana.' },
];

const out = {
  grupo: 'modulo',
  modulo: 'M02',
  camada: 'fonte',
  fonte: fonteInfo,
  gerado_por: 'docs/alexandria-v2/extraction/m02/extratores/m02_modulo.mjs',
  gerado_em: HOJE,
  convencoes: {
    html: 'HTML inline da fonte com espaços colapsados',
    texto: 'tags removidas, entidades decodificadas, espaços colapsados',
    linha_aprox: 'linha 1-based do HTML-fonte no início do elemento',
    null: 'ausência na fonte; todo null tem nota ao lado',
    marcacao_p14: 'anotação desta extração (inferida do verbo/frase), não texto da fonte; exige revisão humana',
  },
  identidade, tese, resultado_esperado: resultado, mapa, roteiro, criterio, laboratorios, voz, erros_comuns, tradutor, comparacao_codigo,
  divergencias, lacunas,
  contagens: {
    secoes: SECS.length, aulas: aulasRot.length, aparatos: SECS.length - aulasRot.length,
    capacidades: resultado.itens.length, criterio_passagem_itens: 2, perguntas_map: mapa.linhas.length,
    hero_meta: identidade.meta.length, criterios_literais: criterio.criterios.length, mensagens_placar: scoreMsgs.length,
    laboratorios: 0, erros_comuns: erros_comuns.itens.length, perguntas_relampago: voz.secao_voz.perguntas_relampago.itens.length,
    roteiro_oral_paragrafos: voz.secao_voz.roteiro_oral.paragrafos.length, callouts: callouts.length,
    callouts_numeros_vivos: voz.callouts_numeros_vivos.length, tres_niveis_blocos: tres.length,
    subsecoes_por_aula: aulasRot.map((r) => r.subsecoes.length),
    ocorrencias_GridAlpha_no_arquivo: (html.match(/GridAlpha/g) || []).length,
    tres_niveis_paineis: tres.length * 3, tres_niveis_paineis_no_codigo: tresNoCodigo,
    divergencias: divergencias.length, lacunas: lacunas.length,
  },
};
escrever('modulo.json', out);
console.log('modulo.json ok', JSON.stringify(out.contagens));
