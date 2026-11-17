// Gera src/lib/alexandria/avaliacao/m12.dados.ts — exercícios por aula, prova e
// checklist do Módulo 12 no modelo de aula v3. Modelo: tools/alexandria-dados/gerar-avaliacao.mjs (M01).
//
// FONTE ÚNICA:
//   - itens `fonte`, prova e checklist: docs/alexandria-v2/extraction/m12/aparato.json
//     (faixas do placar: modulo.json, criterio m12-crit-quiz);
//   - itens `derivado-da-aula`: o texto da própria aula, lido em
//     src/lib/data/alexandria-modulo-12-content.ts (conferido contra o HTML original por
//     tools/alexandria-dados/porte/verificar-porte-m12.mjs, 0 falta) e localizado no HTML
//     original para a linha.
//
// A FONTE NÃO LIGA EXERCÍCIO A AULA (os 14 têm `sem_aula: true`). A aula de cada um é
// decisão de porte, pelo tema do enunciado e da resposta-modelo, registrada em AULA_DO_EXERCICIO
// com a razão — o Founder delegou os exercícios ao LYCEUM (DECISOES-2026-11-15).
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m12.mjs
// Para (exit 1) se um trecho citado não existir na aula ou no HTML.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lerFonte, secao, norm, compacto } from '../porte/texto-m12-m13.mjs';
import { textosDasAulas, vincular } from './vinculo-mecanico-m12-m13.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const EXT = 'docs/alexandria-v2/extraction/m12';
const HTML_ARQ = 'Alexandria modulos/alexandria_modulo12.html';
const FONTE_HTML = `C:/dev/GridAlpha v2/${HTML_ARQ}`;
const SAIDA = path.join(RAIZ, 'src/lib/alexandria/avaliacao/m12.dados.ts');

const aparato = JSON.parse(fs.readFileSync(path.join(RAIZ, EXT, 'aparato.json'), 'utf8'));
const modulo = JSON.parse(fs.readFileSync(path.join(RAIZ, EXT, 'modulo.json'), 'utf8'));
const html = lerFonte(FONTE_HTML);
const TEXTOS_VINC = await textosDasAulas(12);
const conteudo = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-modulo-12-content.ts')).href);

// Trocas editoriais decididas, aplicadas ao texto literal antes de entrar no produto.
const TROCAS = [[/GridAlpha/g, 'NIVAR']];
const editorial = (s) => TROCAS.reduce((a, [re, por]) => a.replace(re, por), String(s));

// ── aula de cada exercício da fonte (decisão de porte; a fonte não declara) ──
// (A colocação temática anterior foi substituída pelo vínculo mecânico — ver o cabeçalho.)


const ALERTAS_DO_EXERCICIO = {
  '09':
    'O INST·03 da Aula 01 tem cartões para "218 GW de capacidade instalada" e "US$ 4 bilhões em projeto de hidrogênio" com "o que verificar" — é a resposta deste exercício. Hoje a AulaV3 só monta o primeiro instrumento da aula (INST·02), então o INST·03 não aparece; se passar a aparecer, abra-o só depois da tentativa.',
};

// ── derivados da aula ─────────────────────────────────────────────────────────
// Cada um cita o trecho da aula que o responde (evidência). Em `escolha`, a alternativa
// correta está no trecho; os distratores são termos que aparecem nas aulas do módulo.
export const ESPECIFICACOES = [
  {
    id: 'm12-a01-d01', aula: 1, tipo: 'escolha',
    enunciado: 'Segundo a aula, qual é o denominador da matriz elétrica?',
    alternativas: ['A Oferta Interna de Energia', 'A Oferta Interna de Energia Elétrica', 'A geração'],
    correta: 1,
    evidencias: ['A matriz elétrica mede apenas a eletricidade. O denominador é a Oferta Interna de Energia Elétrica'],
  },
  {
    id: 'm12-a01-d02', aula: 1, tipo: 'aberto',
    enunciado: 'O Aquífero Guarani é um ativo de geração elétrica? Segundo a aula, de que depende a geração hidrelétrica brasileira?',
    evidencias: [
      'O Aquífero Guarani é uma reserva de água subterrânea transfronteiriça, compartilhada com Argentina, Paraguai e Uruguai, relevante para abastecimento humano, irrigação e cooperação regional — sem relação direta com geração hidrelétrica.',
      'A geração hidrelétrica brasileira depende de hidrologia de superfície: as bacias do São Francisco, Tocantins-Araguaia, Paraná e Madeira, com seus reservatórios, suas vazões e sua variabilidade climática.',
    ],
  },
  {
    // A vigência da presidência ("até novembro de 2026") está nas respostas-modelo do Ex·08 e do Ex·10: fora.
    id: 'm12-a02-d01', aula: 2, tipo: 'aberto',
    enunciado: 'Por que, segundo a aula, a vantagem da matriz elétrica limpa não compensa automaticamente o desmatamento no inventário brasileiro?',
    evidencias: ['No Brasil, mudança de uso da terra e agropecuária têm peso elevado — o que significa que a vantagem da matriz elétrica limpa, por maior que seja, não compensa automaticamente desmatamento.'],
  },
  {
    id: 'm12-a02-d02', aula: 2, tipo: 'escolha',
    enunciado: 'Dentro do setor de energia, de onde veio a maior parcela das emissões brasileiras em 2025, segundo a aula?',
    alternativas: ['geração elétrica', 'transportes', 'mudança de uso da terra', 'agropecuária'],
    correta: 1,
    evidencias: ['a maior parcela — 220,8 milhões de toneladas, praticamente metade — veio de transportes, não de geração elétrica.'],
  },
  {
    id: 'm12-a03-d01', aula: 3, tipo: 'aberto',
    enunciado: 'Qual é a diferença entre complementaridade e concentração, e qual das duas a aula trata como risco?',
    evidencias: [
      'Complementaridade é quando dois países têm o que o outro não tem, e trocam.',
      'Concentração é quando uma cadeia inteira depende de um único fornecedor, comprador ou financiador, e é isso — não a nacionalidade de ninguém — que constitui risco analítico.',
    ],
  },
  {
    // A pergunta dos seis meses e o risco por camada estão na resposta-modelo do Ex·05: fora.
    id: 'm12-a03-d02', aula: 3, tipo: 'escolha',
    enunciado: 'Segundo a aula, quem pergunta se o Brasil vai conseguir certificar cadeia de suprimento sob padrões europeus usando equipamento de origem chinesa?',
    alternativas: ['Um investidor americano', 'Um investidor europeu', 'Um cientista político'],
    correta: 1,
    evidencias: ['Um investidor europeu pergunta se o Brasil vai conseguir certificar cadeia de suprimento sob padrões europeus usando equipamento dessa origem.'],
  },
  {
    id: 'm12-a04-d01', aula: 4, tipo: 'escolha',
    enunciado: 'Segundo a aula, o que importa mais que o percentual de uma medida comercial?',
    alternativas: ['setor afetado', 'base jurídica', 'nome de setor'],
    correta: 1,
    evidencias: ['a base jurídica de uma medida comercial importa mais que o seu percentual'],
  },
  {
    id: 'm12-a04-d02', aula: 4, tipo: 'aberto',
    enunciado: 'Por que a reviravolta dos incentivos americanos importa para o Brasil? A aula dá duas razões.',
    evidencias: [
      'A primeira é competição por capital: capital global de infraestrutura renovável que estava sendo alocado nos Estados Unidos por causa do incentivo precisa de destino, e países com recurso natural competitivo e regulação estável entram na lista curta.',
      'A segunda é competição por equipamento: uma desaceleração da instalação americana afrouxa demanda global por módulo e célula, com efeito sobre preço para todo comprador — inclusive o brasileiro.',
    ],
  },
  {
    id: 'm12-a05-d01', aula: 5, tipo: 'escolha',
    enunciado: 'No mecanismo europeu de ajuste de carbono na fronteira, quem paga o certificado?',
    alternativas: ['o exportador brasileiro', 'o importador europeu', 'o país de origem'],
    correta: 1,
    evidencias: ['quem paga o certificado é o importador europeu, não o exportador brasileiro.'],
  },
  {
    id: 'm12-a05-d02', aula: 5, tipo: 'escolha',
    enunciado: 'Quando o mecanismo europeu de ajuste de carbono na fronteira entrou em regime definitivo?',
    alternativas: ['outubro de 2023', 'dezembro de 2024', '1º de janeiro de 2026', '22 de julho de 2026'],
    correta: 2,
    evidencias: ['O mecanismo europeu de ajuste de carbono na fronteira entrou em regime definitivo em 1º de janeiro de 2026, encerrando o período transitório que começara em outubro de 2023.'],
  },
  {
    id: 'm12-a05-d03', aula: 5, tipo: 'aberto',
    enunciado: 'Diante de qualquer capital estrangeiro, a aula diz que a pergunta não é "de onde vem o dinheiro". Que quatro campos ela manda verificar?',
    evidencias: [
      'moeda de denominação e quem carrega o risco cambial; condicionalidade de compra, de tecnologia ou de origem de equipamento; horizonte de saída do investidor, que diferencia capital de concessão regulada de capital de fundo com prazo; e governança, isto é, que direito de veto ou de indicação o capital adquire sobre decisão operacional.',
    ],
  },
  {
    id: 'm12-a06-d01', aula: 6, tipo: 'escolha',
    enunciado: 'Como as leis brasileiras definem hidrogênio de baixa emissão de carbono?',
    alternativas: ['Por convenção de cores', 'Por desempenho, não por rota', 'Por rota'],
    correta: 1,
    evidencias: ['é a definição de hidrogênio de baixa emissão de carbono por desempenho, não por rota.'],
  },
  {
    id: 'm12-a06-d02', aula: 6, tipo: 'aberto',
    enunciado: 'Por que, segundo a aula, não se somam os valores anunciados de projetos de hidrogênio?',
    evidencias: [
      'Somar valores anunciados de projetos em estágios diferentes produz uma cifra grande, impressionante e analiticamente vazia.',
      'Anúncio agregado não equivale a capacidade contratada',
    ],
  },
  {
    id: 'm12-a07-d01', aula: 7, tipo: 'escolha',
    enunciado: 'Segundo a aula, o que é reserva mineral?',
    alternativas: [
      'Uma concentração com perspectiva razoável de eventual extração econômica',
      'A parcela do recurso demonstrada como economicamente lavrável depois de aplicados os fatores modificadores',
      'Uma ocorrência geológica gigantesca sem estudo de processamento',
    ],
    correta: 1,
    evidencias: ['Reserva mineral é a parcela do recurso demonstrada como economicamente lavrável depois de aplicados os fatores modificadores'],
  },
  {
    id: 'm12-a07-d02', aula: 7, tipo: 'escolha',
    enunciado: 'No nióbio, em que o Brasil de fato lidera a produção mundial, qual continua sendo o mercado principal?',
    alternativas: ['bateria', 'liga de aço de alta resistência', 'material ativo de ânodo', 'ímãs permanentes'],
    correta: 1,
    evidencias: ['No nióbio, onde o Brasil de fato lidera a produção mundial, o mercado principal continua sendo liga de aço de alta resistência'],
  },
  {
    id: 'm12-a08-d01', aula: 8, tipo: 'aberto',
    enunciado: 'Na tabela de narrativas, o que a aula manda verificar antes de aceitar "O Brasil está sentado sobre uma fortuna em terras-raras"?',
    evidencias: ['Reserva contra produção, e sob qual das duas metodologias. Onde está o gargalo — mina, separação ou ímã.'],
  },
  {
    id: 'm12-a08-d02', aula: 8, tipo: 'escolha',
    enunciado: 'Quantos campos tem cada movimento do andaime de conversa?',
    alternativas: ['Três', 'Quatro', 'Oito'],
    correta: 1,
    evidencias: ['Cada movimento tem quatro campos: a pergunta que o governa, duas ou três âncoras concretas com fonte, a ponte declarada para o movimento seguinte, e o erro que faz a conversa voltar a um ponto já percorrido.'],
  },
];

// ── texto da aula (produto) e localização no HTML ─────────────────────────────
export function textoDaAula(n) {
  const id = `aula-12-0${n}`;
  const partes = [conteudo.MODULO_12_LEAD[id] ?? ''];
  for (const b of conteudo.MODULO_12_CORPO[id] ?? []) {
    if (b.kind === 'titulo') partes.push(`${b.numero ?? ''} ${b.texto}`);
    else if (b.kind === 'lista') partes.push(...b.itens);
    else if (b.kind === 'tabela') partes.push(...b.linhas.flat());
    else if (b.kind === 'nota') partes.push(b.label ?? '', b.html);
    else partes.push(b.html ?? b.eq ?? '');
  }
  return partes.map(norm).join(' ¶ ');
}

/** Linha do HTML original onde começa o trecho (busca pelos primeiros 50 caracteres). */
export function linhaNoHtml(idSecao, trecho) {
  const s = secao(html, idSecao);
  const linhas = s.html.split('\n');
  let acum = ''; const ini = [];
  for (const l of linhas) { ini.push(acum.length); acum += norm(l) + ' '; }
  const alvo = norm(trecho).slice(0, 50);
  const i = acum.indexOf(alvo);
  if (i < 0) return null;
  let k = 0; while (k + 1 < ini.length && ini[k + 1] <= i) k++;
  return s.linhaIni + k;
}

const falhas = [];
const fonteDe = (campo, linha) => ({ arquivo: `${EXT}/aparato.json`, campo, linha });

// ── itens da fonte ────────────────────────────────────────────────────────────
const criterioEx = norm('Responda em voz alta antes de abrir o gabarito.');
const ledeEx = modulo.criterio.criterios.find((c) => c.id === 'm12-crit-ex');
const itens = [];
aparato.exercicios.forEach((x, i) => {
  const vinc = vincular(`${x.tag} ${x.resumo?.texto ?? ''} ${x.enunciado?.texto ?? ''}`, TEXTOS_VINC);
  const aula = vinc.escolhida;
  const cabeca = `<b>${editorial(x.tag)}</b> — ${editorial(x.resumo.html)}`;
  const enunciado = x.enunciado ? `${cabeca}<br>${editorial(x.enunciado.html)}` : cabeca;
  const ev = [{ ...fonteDe(`exercicios[${i}].summary_literal.texto`, x.origem.linha_aprox), trecho: editorial(x.summary_literal.texto) }];
  if (x.enunciado) ev.push({ ...fonteDe(`exercicios[${i}].enunciado.texto`, x.origem.linha_aprox), trecho: editorial(x.enunciado.texto) });
  ev.push({ ...fonteDe(`exercicios[${i}].resposta_referencia.texto`, x.origem.linha_aprox), trecho: editorial(x.resposta_referencia.texto) });
  const item = {
    id: `m12-ex-${x.numero}`,
    moduloId: 'modulo-12',
    aula,
    origem: 'fonte',
    tipo: 'aberto',
    enunciado,
    gabarito: null,
    referencia: editorial(x.resposta_referencia.html),
    criterio: criterioEx,
    contaParaCriterioDoDrill: true,
    tolerancia: null,
    verificacao: 'autoavaliacao',
    fonte: fonteDe(`exercicios[${i}]`, x.origem.linha_aprox),
    evidencias: ev,
  };
  if (ALERTAS_DO_EXERCICIO[x.numero]) item.alertas = [ALERTAS_DO_EXERCICIO[x.numero]];
  for (const a of vinc.aulas) item.evidencias.push({ arquivo: HTML_ARQ, campo: `vínculo mecânico · section#a0${a.n}${a.n === aula ? ' (escolhida: a última)' : ''}`, linha: null, trecho: a.trecho });
  itens.push(item);
});
if (!ledeEx || !norm(ledeEx.literal ?? ledeEx.texto ?? JSON.stringify(ledeEx)).includes(criterioEx)) {
  // o critério vem do lede do §Ex; confere que está lá
  const lede = JSON.stringify(ledeEx);
  if (!lede.includes('Responda em voz alta antes de abrir o')) falhas.push('critério do §Ex não encontrado no modulo.json');
}

// ── derivados ─────────────────────────────────────────────────────────────────
for (const e of ESPECIFICACOES) {
  const texto = textoDaAula(e.aula);
  const evid = e.evidencias.map((t, k) => {
    if (!compacto(texto).includes(compacto(t))) falhas.push(`${e.id}: evidência ${k} não está no texto da Aula 0${e.aula}: «${t.slice(0, 80)}»`);
    const linha = linhaNoHtml(`a0${e.aula}`, t);
    if (linha === null) falhas.push(`${e.id}: evidência ${k} não localizada no HTML (section#a0${e.aula})`);
    return { arquivo: HTML_ARQ, campo: `section#a0${e.aula}`, linha, trecho: t };
  });
  const item = {
    id: e.id,
    moduloId: 'modulo-12',
    aula: e.aula,
    origem: 'derivado-da-aula',
    tipo: e.tipo,
    enunciado: e.enunciado,
  };
  if (e.tipo === 'escolha') { item.alternativas = e.alternativas; item.gabarito = e.correta; }
  else item.gabarito = null;
  item.referencia = e.evidencias.join(' ');
  item.contaParaCriterioDoDrill = false;
  item.tolerancia = null;
  item.verificacao = e.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao';
  item.fonte = { arquivo: HTML_ARQ, campo: `section#a0${e.aula}`, linha: evid[0].linha };
  item.evidencias = evid;
  itens.push(item);
}
const soltos = itens.filter((x) => x.aula === null);
for (const x of soltos) itens.splice(itens.indexOf(x), 1);
itens.sort((a, b) => a.aula - b.aula || (a.origem === b.origem ? a.id.localeCompare(b.id) : a.origem === 'fonte' ? -1 : 1));

// ── prova ─────────────────────────────────────────────────────────────────────
const q = aparato.quiz;
const critQuiz = modulo.criterio.criterios.find((c) => c.id === 'm12-crit-quiz');
const PALAVRA = { oito: 8, dez: 10 };
const mc = norm(q.lede.texto).match(/O critério é (\w+) de (\w+)\./);
if (!mc) falhas.push('critério do quiz sem "N de M"');
const acertosMinimos = PALAVRA[mc?.[1]] ?? null;
const total = PALAVRA[mc?.[2]] ?? null;
const [pass, fail] = critQuiz.mensagens_do_script;
const prova = {
  moduloId: 'modulo-12',
  criterio: mc?.[0] ?? '',
  acertosMinimos,
  total,
  questoes: q.questoes.map((x, i) => ({
    id: `m12-quiz-q${String(x.ordem).padStart(2, '0')}`,
    enunciado: editorial(x.enunciado),
    alternativas: x.alternativas.map((a) => editorial(a.texto)),
    correta: x.gabarito_indice,
    explicacao: editorial(x.explicacao),
    fonte: fonteDe(`quiz.questoes[${i}]`, x.origem?.linha_aprox ?? null),
  })),
  faixas: [
    { min: 0, max: 7, mensagem: editorial(fail.texto) },
    { min: 8, max: 10, mensagem: editorial(pass.texto) },
  ],
  faixasFonte: { arquivo: `${EXT}/modulo.json`, campo: 'criterio.criterios[m12-crit-quiz].mensagens_do_script', linha: pass.origem?.linha_aprox ?? null },
  criterioFonte: fonteDe('quiz.lede.texto', q.lede.origem.linha_aprox),
};

// ── checklist ─────────────────────────────────────────────────────────────────
const ck = aparato.checklist;
const checklist = {
  moduloId: 'modulo-12',
  introducao: editorial(ck.lede.texto),
  itens: ck.itens.map((x, i) => ({
    id: `m12-checklist-${String(x.ordem).padStart(2, '0')}`,
    texto: editorial(x.texto),
    fonte: fonteDe(`checklist.itens[${i}].texto`, x.origem.linha_aprox),
  })),
};

if (falhas.length) {
  console.error(falhas.map((f) => `FALHA ${f}`).join('\n'));
  process.exit(1);
}

const doAula = itens.filter((x) => x.origem === 'fonte').length;
const der = itens.length - doAula;
const cab = `// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m12.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m12 (aparato.json, modulo.json) e o texto das aulas
// (alexandria-modulo-12-content.ts, conferido contra o HTML original). Conferência:
// tools/alexandria-dados/avaliacao/verificar-avaliacao-m12.mjs. Relatório: docs/alexandria-v3/porte/m12.md.
// ${itens.length} itens por aula (${doAula} da fonte, ${der} derivados) · ${soltos.length} Ex·NN do módulo (sem vínculo mecânico) · ${prova.questoes.length} questões na prova · ${checklist.itens.length} itens no checklist.
// A fonte não liga exercício a aula: cada Ex·NN vai para a última aula com vínculo mecânico, ou fica no módulo (ver o gerador).

import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

`;
const out =
  cab +
  `export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = ${JSON.stringify(itens, null, 2)};\n\n` +
  `export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = ${JSON.stringify(soltos, null, 2)};\n\n` +
  `export const PROVAS: ProvaDoModulo[] = ${JSON.stringify([prova], null, 2)};\n\n` +
  `export const CHECKLISTS: ChecklistDoModulo[] = ${JSON.stringify([checklist], null, 2)};\n`;
fs.writeFileSync(SAIDA, out);
console.log(`gerado ${path.relative(RAIZ, SAIDA)}: ${itens.length} itens nas aulas (${doAula} fonte, ${der} derivados), ${soltos.length} do módulo, prova ${prova.questoes.length}, checklist ${checklist.itens.length}`);
