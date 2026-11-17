// Grupo "modulo" do M13 → modulo.json. Todo texto sai da fonte por parser.
import fs from 'node:fs';
import {
  S, LINES, SRC, DOC, all, first, kids, inner, byTag, byClass, hasClass, txt, texto, htmlN, origem, origemOff,
  byId, writeJSON, readRepo, pad, fail, lineOf, collapse,
} from './m13_lib.mjs';
import { secId, blocosDaSecao, envolvente } from './m13_blocos.mjs';
import { marcacaoP14, NOTA_P14 } from './m13_p14.mjs';

const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';
const TS = 'src/lib/data/alexandria-modulo-13-content.ts';
const secs = all(DOC, byTag('section'));

// ── identidade ───────────────────────────────────────────────
const hero = first(DOC, byClass('hero'));
const title = first(DOC, byTag('title'));
const h1 = first(hero, byTag('h1'));
const sub = first(hero, byClass('sub'));
const kicker = first(hero, byClass('kicker'));
const pills = all(hero, byClass('pill'));
const footer = first(DOC, byTag('footer'));
const fbd = first(footer, byClass('bd'));
const fwrap = first(footer, byClass('wrap'));
const fRest = S.slice(fbd.end, fwrap.closeStart);
const lentesBloco = blocosDaSecao(byId('tese')).find((b) => b.tipo === 'cadeia');

const identidade = {
  id: 'm13-identidade',
  tipo: 'identidade',
  title_tag: { texto: texto(inner(title)), origem: origem(title, 'head > title') },
  eyebrow: { ...txt(inner(kicker)), origem: origem(kicker, 'div.hero div.kicker') },
  titulo: { ...txt(inner(h1)), origem: origem(h1, 'div.hero h1') },
  subtitulo: { ...txt(inner(sub)), origem: origem(sub, 'div.hero p.sub') },
  pills: pills.map((p, i) => ({ id: `m13-pill-${pad(i + 1)}`, ...txt(inner(p)), origem: origem(p, 'div.hero div.pill-row span.pill') })),
  horas: {
    texto: null, min: null, max: null,
    nota: 'A fonte do M13 não declara tempo estimado (varredura por "hora"/"horas"/"tempo estimado": só aparecem "uma hora" do critério e "meia hora"; nenhum hero-meta de duração). As pills declaram apenas "roteiro oral 10 min". O código (alexandria-blocks.ts, bloco-13) traz estimatedHoursMin 4 / estimatedHoursMax 5 sem origem nesta fonte; o catálogo canônico também não declara horas para o M13.',
  },
  eixos: null,
  eixos_nota: 'A fonte não rotula "eixos". Ela declara "três lentes" (§00.2, L697-714) e diz explicitamente que "Elas não são categorias de conceito — são a ordem em que um analista […] efetivamente lê". As lentes estão abaixo, literais, sem promoção a eixo.',
  lentes: lentesBloco.itens,
  verificado_em: { texto: texto(inner(pills[pills.length - 1])), origem: origem(pills[pills.length - 1], 'div.hero span.pill:last') },
  rodape: {
    titulo: { ...txt(inner(fbd)), origem: origem(fbd, 'footer div.bd') },
    linhas: fRest.split(/<br\s*\/?>/).map((l) => texto(l)).filter(Boolean),
    html: htmlN(inner(fwrap)),
    origem: origem(fwrap, 'footer div.wrap'),
  },
};
if (pills.length !== 11) fail('esperava 11 pills');

// ── catálogo canônico (P24) e código ─────────────────────────
const cat = fs.readFileSync(CATALOGO, 'utf8').split('\n');
const catIdx = cat.findIndex((l) => l.startsWith('## Módulo 13 — '));
const catEscalaIdx = cat.findIndex((l, i) => i > catIdx && l.startsWith('**Escala**'));
const catTabela = cat.find((l) => /^\| 13 \| /.test(l));
const blocksLine = readRepo('src/lib/data/alexandria-blocks.ts').split('\n').find((l) => l.includes("id: 'bloco-13'"));
const catalogo = {
  arquivo: CATALOGO,
  titulo_catalogo: cat[catIdx].replace('## Módulo 13 — ', ''),
  linha_titulo: catIdx + 1,
  trilha: collapse(cat.slice(catIdx + 2, catEscalaIdx).join(' ')),
  trilha_codigo: "track: 'brasil', level: 3 (alexandria-blocks.ts); alexandria-trilhas.ts comenta 'bloco-13' como módulo da Trilha 3",
  escala: collapse(cat.slice(catEscalaIdx, catEscalaIdx + 3).join(' ')),
  linha_escala: catEscalaIdx + 1,
  linha_tabela_resumo: catTabela,
  alexandria_blocks_ts: blocksLine.trim(),
  titulo_igual_h1: cat[catIdx].replace('## Módulo 13 — ', '') === texto(inner(h1)),
  titulo_igual_title_tag: texto(inner(title)).endsWith(cat[catIdx].replace('## Módulo 13 — ', '')),
  nota_P24: 'P24: o catálogo canônico governa o nome principal. Aqui o h1, o <title>, o rodapé e o catálogo coincidem ("Análise Financeira de Empresas e Projetos"); a tabela-resumo do catálogo abrevia para "Análise Financeira". O p.sub do hero é candidato a subtítulo/descritor editorial, nunca a segundo título.',
};

// ── GridAlpha visível ao learner (P24) ───────────────────────
const gridalpha = [];
LINES.forEach((l, i) => {
  if (!l.includes('GridAlpha')) return;
  const n = i + 1;
  const noScript = n >= 3312;
  gridalpha.push({ linha: n, contexto: noScript ? 'script (texto renderizado)' : 'markup', trecho: collapse(l).slice(0, 140) });
});

// ── §00 e §MAP ───────────────────────────────────────────────
const secao = (id) => {
  const s = byId(id);
  return { marcador: secId(s), linha_inicio: s.line, linha_fim: lineOf(s.end), blocos: blocosDaSecao(s) };
};
const tese = { id: 'm13-tese', tipo: 'tese', ...secao('tese') };

const pergMap1 = envolvente('quando esta empresa precisar decidir algo difícil, quem decide?', ['em']);
const pergMap2 = envolvente('quem controla esta empresa, e', ['b']);
const mapa = {
  id: 'm13-mapa',
  tipo: 'painel_setorial',
  ...secao('map'),
  perguntas_por_aula: null,
  perguntas_por_aula_nota: 'O §MAP do M13 não é um mapa de aulas com pergunta por aula (como o § MAP do M01). É o "Painel setorial": 10 cartões de estado societário, o INST·01 (instrumento de módulo, fora de aula) e a tabela dos seis arquétipos. Não há pergunta atribuída a cada aula em nenhum lugar da fonte.',
  perguntas_literais_no_map: [
    { id: 'm13-map-pergunta-01', ...txt(inner(pergMap1)), origem: origem(pergMap1, 'section#map p > em') },
    { id: 'm13-map-pergunta-02', ...txt(inner(pergMap2)), origem: origem(pergMap2, 'section#map div.box.cy p > b') },
  ],
  instrumento_de_modulo: { id: 'INST·01', nome: 'Painel de controle setorial', ver: 'instrumentos.json', nota: 'Único instrumento fora de aula (§MAP). Vai para Recursos do Módulo (protocolo §3).' },
};

// ── roteiro ──────────────────────────────────────────────────
const tsSrc = readRepo(TS);
const tsAulas = tsSrc.slice(tsSrc.indexOf('export const MODULO_13_AULAS'));
const tsTitles = [...tsAulas.matchAll(/id: 'aula-13-(\d\d)'[\s\S]*?title: "((?:[^"\\]|\\.)*)",\s*subtitle: "((?:[^"\\]|\\.)*)"/g)]
  .map((m) => ({ n: m[1], title: JSON.parse(`"${m[2]}"`), subtitle: JSON.parse(`"${m[3]}"`) }));
const tsLead = {};
for (const m of tsSrc.matchAll(/'aula-13-(\d\d)': "((?:[^"\\]|\\.)*)",/g)) tsLead[m[1]] = JSON.parse(`"${m[2]}"`);
const tsCorpoCount = {};
{
  const corpo = tsSrc.slice(tsSrc.indexOf('export const MODULO_13_CORPO'), tsSrc.indexOf('export const MODULO_13_EXERCICIOS_SOLTOS'));
  const parts = corpo.split(/\n  'aula-13-(\d\d)': \[/);
  for (let i = 1; i < parts.length; i += 2) tsCorpoCount[parts[i]] = (parts[i + 1].match(/\{ kind: '/g) || []).length;
}

const roteiro = secs.map((s, i) => {
  const mk = secId(s);
  const bl = blocosDaSecao(s);
  const h2 = bl.find((b) => b.tipo === 'titulo_secao');
  const lede = bl.find((b) => b.tipo === 'lede');
  const isAula = /^Aula \d\d$/.test(mk.codigo);
  const n = isAula ? mk.codigo.slice(5) : null;
  const item = {
    id: isAula ? `m13-roteiro-aula-${n}` : `m13-roteiro-${s.attrs.id}`,
    tipo: isAula ? 'aula' : 'aparato',
    ordem_na_fonte: i + 1,
    section_id: s.attrs.id,
    marcador: mk,
    titulo: { html: h2.html, texto: h2.texto },
    lede: lede ? { texto: lede.texto, origem: lede.origem } : null,
    subsecoes: bl.filter((b) => b.tipo === 'subsecao').map((b) => ({ numero: b.numero, titulo: b.texto, linha_aprox: b.origem.linha_aprox })),
    instrumentos: bl.filter((b) => b.tipo === 'instrumento').map((b) => ({ id: b.id, nome: b.nome, linha_aprox: b.origem.linha_aprox })),
    blocos_por_tipo: bl.reduce((a, b) => ((a[b.tipo] = (a[b.tipo] || 0) + 1), a), {}),
    linha_inicio: s.line,
    linha_fim: lineOf(s.end),
    vinculos: isAula ? { aula_id_codigo: `aula-13-${n}` } : null,
  };
  if (isAula) {
    const t = tsTitles.find((x) => x.n === n);
    const blocosFonte = bl.filter((b) => !['titulo_secao', 'lede', 'instrumento'].includes(b.tipo)).length;
    item.comparacao_codigo = {
      title_codigo: t?.title ?? null,
      subtitle_codigo: t?.subtitle ?? null,
      title_igual_h2: t?.title === h2.texto,
      subtitle_igual_rotulo: t?.subtitle === mk.rotulo,
      lead_igual_lede: tsLead[n] === lede.texto,
      lead_diferenca: tsLead[n] === lede.texto ? null : (() => {
        const a = lede.texto, b = tsLead[n]; let i = 0; while (a[i] === b[i]) i++;
        return { indice: i, fonte: a.slice(Math.max(0, i - 30), i + 30), codigo: b.slice(Math.max(0, i - 30), i + 30), nota: 'Espaço antes de pontuação no código onde a fonte tinha <em>/<b> (tag removida com o espaço de quebra de linha).' };
      })(),
      blocos_corpo_codigo: tsCorpoCount[n] ?? null,
      blocos_fonte_nesta_contagem: blocosFonte,
      nota_blocos: 'Contagens com granularidades diferentes (o código quebra fórmula em titulo+formula, três níveis em nota, etc.); informativo, não é medida de cobertura.',
      instrumentos_codigo: 0,
    };
  }
  return item;
});
const aulas = roteiro.filter((r) => r.tipo === 'aula');
if (aulas.length !== 8 || roteiro.length !== 18) fail('contagem de roteiro');

// ── critérios ────────────────────────────────────────────────
const crit = (id, sub, tags, rotulo, extra = {}) => {
  const n = envolvente(sub, tags);
  const t = txt(inner(n));
  return { id, rotulo_extracao: rotulo, ...t, marcacao_p14: marcacaoP14(t.texto), origem: origem(n, `${n.tag}${n.attrs.class ? '.' + n.attrs.class.replace(/ /g, '.') : ''}`), ...extra };
};
const quizH2 = first(byId('quiz'), byTag('h2'));
const vozH2 = first(byId('voz'), byTag('h2'));
const finalH2 = first(byId('final'), byTag('h2'));
const criterios = {
  nota: 'Todos os trechos em que a fonte declara ou mede critério, verbatim. Nenhum é escolhido como "o" critério (P18). ' + NOTA_P14,
  itens: [
    crit('m13-crit-00-dominio', 'As três lentes existem porque o critério de domínio deste bloco', ['p'], '§00.2 — critério de domínio do bloco'),
    crit('m13-crit-a03-lede', 'O critério de domínio deste bloco é cronometrado', ['p'], 'Aula 03 — lede'),
    crit('m13-crit-a03-uma-hora', 'O critério de uma hora exige os dois', ['p'], 'Aula 03 — 03.1'),
    crit('m13-crit-a07-ficha', 'Cronometre uma hora.', ['div'], 'Aula 07 — campo aberto da ficha AXIA'),
    crit('m13-crit-a08-lede', 'produzir nove itens', ['p'], 'Aula 08 — lede'),
    crit('m13-crit-inst11-intro', 'é produzir os nove sem consultar este painel', ['p'], 'Aula 08 — INST·11 (intro)'),
    crit('m13-crit-ex-lede', 'na proporção que o critério de domínio exige', ['p'], '§Ex — lede'),
    { id: 'm13-crit-quiz-h2', rotulo_extracao: '§Quiz — h2', ...txt(inner(quizH2)), marcacao_p14: ['automatizavel'], origem: origem(quizH2, 'section#quiz h2') },
    crit('m13-crit-quiz-lede', 'O critério é oito de dez', ['p'], '§Quiz — lede', { marcacao_p14: ['automatizavel'], faixas_do_script: 'ver aparato.json › avaliacao.faixas_de_placar_script' }),
    { id: 'm13-crit-voz-h2', rotulo_extracao: '§Voz — h2', ...txt(inner(vozH2)), marcacao_p14: ['oral', 'cronometrado'], origem: origem(vozH2, 'section#voz h2') },
    crit('m13-crit-voz-lede', 'Leia em voz alta, cronometrado', ['p'], '§Voz — lede'),
    { id: 'm13-crit-final-h2', rotulo_extracao: '§Final — h2', ...txt(inner(finalH2)), marcacao_p14: [], origem: origem(finalH2, 'section#final h2') },
    crit('m13-crit-final-lede', 'O primeiro item é o critério de domínio inteiro', ['p'], '§Final — lede', { ver: 'aparato.json › checklist_final (28 itens, com marcacao_p14 por item)' }),
    crit('m13-crit-pill-quiz', 'quiz <b>8/10</b>', ['span'], 'hero — pill do quiz', { marcacao_p14: ['automatizavel'] }),
    crit('m13-crit-pill-voz', 'roteiro oral <b>10 min</b>', ['span'], 'hero — pill do roteiro oral', { marcacao_p14: ['oral', 'cronometrado'] }),
  ],
  mencoes_a_criterio_do_curriculo: [
    crit('m13-mencao-prontidao-00', 'critério de prontidão separado. Empresas', ['td'], '§00.4 — "critério de prontidão separado"'),
    crit('m13-mencao-prontidao-a06', 'O currículo cobra, em critério de prontidão separado', ['p'], 'Aula 06 — 06.3'),
  ],
  orcamento_de_tempo: {
    nota: 'Trechos que dividem o tempo do critério; ver divergência div-m13-tempo-30-60-vs-uma-hora.',
    itens: [
      { rotulo_extracao: 'Aula 03 — título', ...txt(inner(first(byId('a03'), byTag('h2')))), origem: origem(first(byId('a03'), byTag('h2')), 'section#a03 h2') },
      crit('m13-tempo-voz', 'Leia o release em trinta minutos e o Formulário de', ['p'], '§Voz — penúltimos parágrafos'),
      crit('m13-tempo-inst04-disc', 'Os tempos são referência de treino, não regra', ['p'], 'Aula 03 — INST·04 (aviso)'),
      { rotulo_extracao: 'Aula 08 — 08.3 "A hora, distribuída"', ver: 'blocos da Aula 08 (cronologia L2369-2377); orçamento 0-60 min com release em 12-25 e Formulário em 25-40', origem: origemOff(S.indexOf('<div class="clk">', S.indexOf('A hora, distribuída')), 'section#a08 div.clk') },
    ],
  },
};
if (criterios.itens[0].texto.indexOf('três teses de investimento') < 0) fail('crit-00');

// ── voz ──────────────────────────────────────────────────────
const vozSec = byId('voz');
const vozBl = blocosDaSecao(vozSec);
const produtoBoxes = all(DOC, (n) => hasClass(n, 'box') && hasClass(n, 'gd'))
  .map((b) => ({ n: b, tag: first(b, byClass('tag')) }))
  .filter((x) => texto(inner(x.tag)).startsWith('Onde isso entra no produto'));
const secDe = (node) => secs.find((s) => s.start <= node.start && s.end >= node.end)?.attrs.id;
const recusa = envolvente('Existe uma pergunta que este módulo não responde', ['p']);
const recusa2 = envolvente('Há, porém, uma segunda razão, específica deste bloco', ['p']);
const lacAcus = envolvente('A saída correta da lente de lacuna é sempre uma pergunta formulável', ['div']);
const nunca = envolvente('Recomendação de compra, venda ou manutenção. Preço-alvo.', ['div']);
const educ = envolvente('Este material é <b>educacional e analítico</b>', ['p']);
const voz = {
  id: 'm13-voz',
  roteiro_oral: {
    marcador: secId(vozSec),
    titulo: vozBl.find((b) => b.tipo === 'titulo_secao'),
    lede: vozBl.find((b) => b.tipo === 'lede'),
    paragrafos: vozBl.filter((b) => b.tipo === 'paragrafo').map((b, i) => ({ id: `m13-voz-p${pad(i + 1)}`, ...b })),
    marcacao_p14: ['oral', 'cronometrado'],
  },
  principios: [
    { id: 'm13-voz-recusa-1', rotulo_extracao: '§00.3 — o que o módulo recusa fazer', ...txt(inner(recusa)), origem: origem(recusa, 'section#tese p') },
    { id: 'm13-voz-recusa-2', rotulo_extracao: '§00.3 — segunda razão (conflito sell-side)', ...txt(inner(recusa2)), origem: origem(recusa2, 'section#tese p') },
    { id: 'm13-voz-lacuna-nao-acusacao', rotulo_extracao: 'Aula 03 — box "Lacuna vira pergunta, não vira acusação"', ...txt(inner(lacAcus)), origem: origem(lacAcus, 'section#a03 div.box.cy') },
    { id: 'm13-voz-nunca-devolver', rotulo_extracao: 'Aula 08 — "O que nunca devolver"', ...txt(inner(nunca)), origem: origem(nunca, 'section#a08 div.and-no') },
    { id: 'm13-voz-educacional', rotulo_extracao: '§Ref — nota de atualização, último parágrafo', ...txt(inner(educ)), origem: origem(educ, 'section#ref div.box.rd p') },
    { id: 'm13-voz-rodape', rotulo_extracao: 'rodapé', linhas: identidade.rodape.linhas, origem: identidade.rodape.origem },
  ],
  blocos_produto_P7: {
    nota: 'Caixas "Onde isso entra no produto · …" (box gd). P7: não exibir ao learner. Oito citam GridAlpha Research (marca morta, P24); a da a01 (L1078) cita só Energy Brief, sem \"GridAlpha\", e P24 não menciona Energy Brief.',
    itens: produtoBoxes.map((x) => ({ secao: secDe(x.n), rotulo: texto(inner(x.tag)), linha_aprox: x.n.line })),
  },
  numeros_vivos: {
    nota: 'Caixas box rd cuja tag começa por "Números vivos" (instabilidade declarada). Dado com data de validade; o módulo manda reverificar na fonte primária antes de uso externo. As outras caixas box rd (tag diferente) estão em outras_caixas_box_rd.',
    itens: all(DOC, (n) => hasClass(n, 'box') && hasClass(n, 'rd')).map((b) => ({ secao: secDe(b), rotulo: texto(inner(first(b, byClass('tag')))), linha_aprox: b.line })).filter((x) => x.rotulo.startsWith('Números vivos')),
  },
  outras_caixas_box_rd: {
    nota: 'Caixas box rd com tag diferente de "Números vivos" (mesma classe visual, outro papel). Listadas para a contagem de box rd fechar (8 = 5 + 3).',
    itens: all(DOC, (n) => hasClass(n, 'box') && hasClass(n, 'rd')).map((b) => ({ secao: secDe(b), rotulo: texto(inner(first(b, byClass('tag')))), linha_aprox: b.line })).filter((x) => !x.rotulo.startsWith('Números vivos')),
  },
  datas_de_verificacao: {
    '02·08·2026': (S.match(/02·08·2026/g) || []).length,
    '2 de agosto de 2026': (S.match(/2 de agosto de 2026/g) || []).length,
    nota: 'Contagem de ocorrências literais no arquivo inteiro (markup + script).',
  },
};

// ── erros comuns ─────────────────────────────────────────────
const errSec = byId('erros');
const errBl = blocosDaSecao(errSec);
const errOl = first(errSec, byTag('ol'));
const erros = {
  id: 'm13-erros',
  marcador: secId(errSec),
  titulo: errBl.find((b) => b.tipo === 'titulo_secao'),
  lede: errBl.find((b) => b.tipo === 'lede'),
  itens: kids(errOl).map((li, i) => {
    const h = inner(li);
    const m = h.match(/^\s*<b>([\s\S]*?)<\/b>([\s\S]*?)<em>Por\s+que\s+importa:<\/em>([\s\S]*)$/);
    if (!m) fail(`erro ${i + 1}`);
    return {
      id: `m13-erro-${pad(i + 1)}`, ordem: i + 1,
      afirmacao: txt(m[1]), correcao: txt(m[2]), por_que_importa: txt(m[3]), completo: txt(h),
      origem: origem(li, 'section#erros ol.num-list > li'),
    };
  }),
};
if (erros.itens.length !== 20) fail('20 erros');

// ── divergências do grupo ────────────────────────────────────
const divergencias = [
  {
    id: 'div-m13-horas', eixo: 'fonte × código', severidade: 'media',
    leitura_a: 'Fonte: nenhuma declaração de horas (só "roteiro oral 10 min" e o critério "em uma hora").',
    leitura_b: `Código: ${blocksLine.trim()}`,
    decisao: null,
  },
  {
    id: 'div-m13-caso-parte-13', eixo: 'fonte × decisão P17', severidade: 'media',
    leitura_a: 'Fonte (§Caso, L2420): "Operação A — Parte 13"; o lede fala em "doze partes anteriores", "Parte 11" e "Parte 12" — numeração da série Operação A ao longo dos módulos.',
    leitura_b: 'P17 (decidido sobre o M01) diz que "Não existe Parte 1" e que etapas de interface nunca são "Partes" da fonte. No M13 a própria fonte usa "Parte 13" como rótulo de série.',
    decisao: null,
  },
  {
    id: 'div-m13-tempo-30-60-vs-uma-hora', eixo: 'fonte × fonte', severidade: 'alta',
    leitura_a: 'Aula 03 (título) e §Voz: release em 30 min e Formulário de Referência em 60 min (= 90 min); INST·04 reparte 0-30 e 0-60.',
    leitura_b: 'Critério (§00.2, Aula 08, §Final item 1): tudo "em uma hora"; 08.3 "A hora, distribuída" dá ao release 12-25 min e ao Formulário 25-40 min. O aviso do INST·04 diz "Os tempos são referência de treino, não regra".',
    decisao: null,
  },
  {
    id: 'div-m13-arquetipo-jv-nome', eixo: 'fonte × fonte', severidade: 'baixa',
    leitura_a: '§MAP.1 (tabela) e Ex 14: "Joint venture coordenada".',
    leitura_b: 'INST·01, INST·06, ficha Raízen e §Voz: "Associação com dois controladores coordenados".',
    decisao: null,
  },
  {
    id: 'div-m13-vibra-arquetipo', eixo: 'fonte × fonte', severidade: 'media',
    leitura_a: '§MAP.1 (tabela dos seis arquétipos) lista só "Equatorial Energia" como corporação sem controlador definido; o §Voz enumera os seis arquétipos com nove empresas e omite a Vibra.',
    leitura_b: 'INST·01 e INST·06 classificam a Vibra Energia como "Corporação sem controlador definido"; o checklist (item 2) pede o arquétipo de "cada uma das dez empresas vivas".',
    decisao: null,
  },
  (() => {
    const L = tsSrc.split('\n');
    const f = L.map((l, i) => [l, i + 1]).filter(([l]) => l.includes("kind: 'formula'"));
    const comTag = f.filter(([l]) => /desc: "[^"]*</.test(l));
    return {
      id: 'div-m13-codigo-formula-tags', eixo: 'fonte × código', severidade: 'media',
      leitura_a: 'Fonte: as 8 fórmulas (div.fx) têm <b>/<em> dentro de div.fd (leitura).',
      leitura_b: `Código: ${comTag.length} de ${f.length} blocos 'formula' guardam o HTML em \`desc\` (linhas ${comTag.map(([, n]) => n).join(', ')}); ApostilaPanel.tsx renderiza \`{b.desc}\` como texto puro, então as tags apareceriam literais (protocolo §14). Deduzido da leitura do componente, não medido na tela.`,
      decisao: null,
    };
  })(),
  (() => {
    const L = tsSrc.split('\n');
    const hit = (s) => L.findIndex((l) => l.includes(s)) + 1;
    return {
      id: 'div-m13-codigo-par-chave-valor', eixo: 'fonte × código', severidade: 'media',
      leitura_a: 'Fonte: div.dual (Aulas 01 e 04), div.clk (Aulas 06 e 08) e as 6 fichas div.emp (Aula 07) são pares rótulo/valor sem cabeçalho.',
      leitura_b: `Código: viraram kind 'tabela' (dual L${hit('"Efeito sobre P/E"')} e L${hit('"Participação econômica adquirida"')}; clk L${hit('"Mai 2023"')} e L${hit('"0-5 min"')}; fichas a partir de L${hit('[["Controlador","Companhia sem controlador único')}). O componente Tabela promove a 1ª linha a <thead> (protocolo §15); no clk o título <b> foi colado ao corpo sem separador ("Perímetro Empresa, código…").`,
      decisao: null,
    };
  })(),
  {
    id: 'div-m13-codigo-lead-espacos', eixo: 'fonte × código', severidade: 'baixa',
    leitura_a: 'Fonte: ledes das Aulas 05, 06 e 08 com <em>/<b> encostado na pontuação.',
    leitura_b: 'Código (MODULO_13_LEAD): espaço antes da pontuação ("sem quebrar .", "capital .", "cronometrado ."); ver roteiro[].comparacao_codigo.lead_diferenca.',
    decisao: null,
  },
  (() => {
    const fim = cat.findIndex((l, i) => i > catIdx && l.startsWith('## Módulo 14'));
    const secCat = cat.slice(catIdx, fim).join('\n');
    const siglas = [...new Set(secCat.match(/\b[A-Z]{2,5}\b/g) || [])];
    const ausentes = siglas.filter((s) => !['HTML', 'TS', 'INST'].includes(s)).filter((s) => !new RegExp(`\\b${s}\\b`).test(S));
    return {
      id: 'div-m13-catalogo-siglas', eixo: 'fonte × catálogo', severidade: 'baixa',
      leitura_a: 'Fonte (§Lex): verbetes por extenso ("Demonstração do resultado", "Fluxo de caixa livre para a firma", "Retorno sobre o capital investido", "Índice de cobertura do serviço da dívida" etc.).',
      leitura_b: `Catálogo canônico (L${catIdx + 1}-${fim}): resume os termos com siglas que não ocorrem na fonte: ${ausentes.join(', ')}. Também parafraseia verbetes ("Project finance × financiamento corporativo", "Custo de capital próprio e de terceiros"). Título, escala e contagens do catálogo conferem com a fonte.`,
      decisao: null,
    };
  })(),
  {
    id: 'div-m13-marca', eixo: 'fonte × P24', severidade: 'media',
    leitura_a: `A fonte usa "GridAlpha" em ${gridalpha.length} linhas (eyebrow, caixas de produto, rodapé, §Ref, INST·11/quiz).`,
    leitura_b: 'P24: GridAlpha está morta como marca voltada ao learner. Texto mantido literal aqui (camada fonte).',
    decisao: null,
  },
  (() => {
    const inst11 = cat.slice(catIdx, catIdx + 110).find((l) => l.startsWith('| INST·11 |'));
    if (!inst11) fail('catálogo INST·11');
    return {
      id: 'div-m13-catalogo-inst11-nome', eixo: 'fonte × catálogo', severidade: 'baixa',
      leitura_a: 'Fonte (span.nm, L2337): "Andaime de tese de investimento · instrumento assinatura".',
      leitura_b: `Catálogo canônico: ${inst11.split('|')[2].trim()}. Os outros 10 nomes de instrumento e os 8 títulos de aula do catálogo são iguais à fonte.`,
      decisao: null,
    };
  })(),
  {
    id: 'div-m13-trilha', eixo: 'fonte × catálogo × código', severidade: 'baixa',
    leitura_a: 'Fonte: nenhuma trilha declarada; o kicker traz só "Alexandria · GridAlpha · Módulo 13".',
    leitura_b: `Catálogo: ${collapse(cat.slice(catIdx + 2, catEscalaIdx).join(' '))} Código: \`track: 'brasil'\`, \`level: 3\` (alexandria-blocks.ts), e alexandria-trilhas.ts trata o bloco-13 como módulo da Trilha 3.`,
    decisao: null,
  },
];

writeJSON('modulo.json', {
  schema: 'alexandria-v2/extraction/modulo@1',
  modulo: 'M13',
  grupo: 'modulo',
  fonte: { arquivo: SRC, linhas_total: LINES.length - (S.endsWith('\n') ? 1 : 0), bytes: Buffer.byteLength(S, 'utf8') },
  gerado_em: '2026-09-17',
  metodo: 'Extração programática (node): parser HTML próprio com offsets (m13_lib.mjs) + walker de blocos (m13_blocos.mjs). Campos `html` são recortes da fonte com espaços colapsados; `texto` remove tags e decodifica entidades. Nenhum texto de conteúdo digitado. Campos `nota`, `rotulo_extracao`, `marcacao_p14`, `leitura_a/b` são anotação desta extração.',
  convencoes: { linha_aprox: 'linha 1-based no HTML-fonte, do início do elemento', null: 'ausência na fonte; cada null tem nota ao lado' },
  identidade,
  catalogo,
  gridalpha_visivel_P24: gridalpha,
  tese,
  resultado_esperado: null,
  resultado_esperado_nota: 'O M13 não tem bloco "Resultado esperado"/capacidades (zero ocorrência de "Resultado esperado", "capacidade" como lista, h4 de capacidades). O equivalente mais próximo é o critério de domínio literal do §00.2 (m13-crit-00-dominio) e o item 1 do §Final. Nada foi derivado.',
  mapa,
  roteiro,
  criterios,
  laboratorios: [],
  laboratorios_nota: 'Não há § Lab no M13 (zero section de laboratório, zero "LAB·"). O único instrumento fora de aula é o INST·01, no §MAP (instrumentos.json).',
  voz,
  erros_comuns: erros,
  tradutor: null,
  tradutor_nota: 'Não há "§ Map"/Tradutor no M13 (o marcador §MAP é o Painel setorial, extraído em `mapa`).',
  divergencias,
  contagens: {
    secoes: roteiro.length, aulas: aulas.length, aparato: roteiro.length - aulas.length,
    pills: pills.length, lentes: lentesBloco.itens.length, perguntas_literais_no_map: 2,
    criterios_literais: criterios.itens.length, voz_paragrafos: voz.roteiro_oral.paragrafos.length,
    principios_de_voz: voz.principios.length, blocos_produto_P7: voz.blocos_produto_P7.itens.length,
    caixas_numeros_vivos: voz.numeros_vivos.itens.length, caixas_box_rd: voz.numeros_vivos.itens.length + voz.outras_caixas_box_rd.itens.length, erros_comuns: erros.itens.length,
    laboratorios: 0, instrumentos_citados_no_roteiro: roteiro.reduce((a, r) => a + r.instrumentos.length, 0),
  },
});
console.log('modulo.json ok', roteiro.length, aulas.length, gridalpha.length);
