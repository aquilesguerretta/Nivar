// Gera src/lib/alexandria/avaliacao/m06.dados.ts — exercícios por aula, prova e checklist do M06 —
// a partir SÓ de docs/alexandria-v2/extraction/m06/aparato.json e do texto das aulas (HTML original,
// lido por tools/alexandria-dados/porte/). Modelo: tools/alexandria-dados/gerar-avaliacao.mjs (M01).
//
// Duas origens, nunca misturadas:
//   'fonte'            — os 10 Ex·NN do §Ex, o quiz do §Quiz (10 × 4, critério e faixas literais) e
//                        as 24 verificações do §Final. Texto copiado da extração, com a linha do HTML.
//   'derivado-da-aula' — perguntas de recuperação cuja resposta está LITERALMENTE no texto da aula
//                        (`evidencias`). O gerador acha o trecho no texto da aula e para se não achar.
//
// VÍNCULO EXERCÍCIO → AULA (regra de colocação de 15/11, docs/alexandria-v3/PORTE-POR-MODULO.md).
// A fonte não liga nenhum dos 10 Ex·NN a aula (aparato.json, `exercicios.vinculo_nota`; P9). Um
// Ex·NN vai para a ÚLTIMA aula que casar — casamento = trecho literal com pelo menos 4 palavras
// cheias seguidas do rótulo + enunciado aparece no texto da aula (`vincular`, a mesma função do
// M12/M13) — com alerta "vínculo mecânico". O que não casar fica em EXERCICIOS_DO_MODULO, que a
// aula mostra na última aula, antes da prova. Medido: nenhum dos 10 casa (relatório m06.md).
//
// Regras impostas (o verificador reconfere do zero): `tolerancia` sempre null; aberto fecha por
// autoavaliação; só `escolha` tem alternativa correta; trocas editoriais (P24, Bloco N → Módulo NN)
// aplicadas ao texto visível e contadas; a fonte não tem critério por exercício nem "seis dos oito"
// (`contaParaCriterioDoDrill: false` em todos).
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m06.mjs

import { textoDasAulas, acharEvidencia, lerAparato, norm, escrever } from './avaliacao-m06-m08.mjs';
import { textosDasAulas, vincular } from './vinculo-mecanico-m12-m13.mjs';
import { editorial } from '../porte/corpo-m06-m08.mjs';

const N = 6, NN = '06', MODULO_ID = 'modulo-06';
const APARATO = `docs/alexandria-v2/extraction/m${NN}/aparato.json`;
const uso = {};
const ed = (s) => editorial(norm(s), uso);

// ── Itens derivados (voz da Alexandria, resposta literal da aula) ─────────────
// `evidencias`: trechos literais do texto da aula. Escolha: `correta` = índice; distratores são
// termos que aparecem nas aulas do módulo (o verificador confere).
export const ESPECIFICACOES = [
  // Aula 01
  {
    aula: 1, tipo: 'escolha',
    enunciado: 'Segundo a aula, o que quebra o arranjo municipal de regulação do começo do século?',
    alternativas: ['Ideologia', 'Escala', 'Inflação alta'],
    correta: 1,
    evidencias: ['O que quebra o arranjo não é ideologia — é escala.'],
  },
  {
    aula: 1, tipo: 'aberto',
    enunciado: 'A aula nomeia três tensões que o arranjo municipal não conseguia resolver. Quais são, na ordem em que a aula as apresenta?',
    evidencias: ['A primeira tensão é informacional', 'A segunda é monetária.', 'A terceira é territorial, e é a que decide tudo.'],
  },
  {
    aula: 1, tipo: 'escolha',
    enunciado: 'Das três coisas que o Código de Águas de 1934 fez, qual é aquela em que, segundo a aula, nasce a primeira cicatriz do setor?',
    alternativas: [
      'separa o potencial hidráulico da propriedade do solo',
      'concentra na União o poder concedente',
      'fixa a remuneração pelo custo histórico do investimento',
    ],
    correta: 2,
    evidencias: ['Terceiro, fixa a remuneração pelo custo histórico do investimento', 'A terceira é onde nasce a primeira cicatriz do setor'],
  },
  // Aula 02
  {
    aula: 2, tipo: 'aberto',
    enunciado: 'Segundo a aula, o modelo estatal não quebra por incompetência de engenharia. Quais são as quatro coisas cuja combinação o quebra?',
    evidencias: [
      'Primeira: tarifa como instrumento de política macroeconômica.',
      'Segunda: choque de juros e dívida externa.',
      'Terceira: remuneração garantida e equalização tarifária.',
      'Quarta, e a mais reveladora: a dívida intrassetorial.',
    ],
  },
  {
    aula: 2, tipo: 'escolha',
    enunciado: 'Segundo a aula, quando foi construída a centralização operacional brasileira?',
    alternativas: ['em 2001', 'ao longo dos anos 1960 e 1970', 'em 1934'],
    correta: 1,
    evidencias: ['A centralização operacional brasileira não nasceu em 2001. Ela foi construída ao longo dos anos 1960 e 1970'],
  },
  // Aula 03
  {
    aula: 3, tipo: 'aberto',
    enunciado: 'O que, segundo a aula, a comissão de análise de 2001 concluiu sobre o que as instâncias do setor sabiam do risco de déficit?',
    evidencias: ['concluiu que essas instâncias sabiam, desde meados de 1999, que o risco de déficit para 2000 e 2001 era muito elevado.'],
  },
  {
    aula: 3, tipo: 'escolha',
    enunciado: 'Segundo a aula, em que ano o consumo de eletricidade de 2000 foi reencontrado, depois do racionamento?',
    alternativas: ['2001', '2002', '2004', '2021'],
    correta: 2,
    evidencias: ['O consumo de eletricidade de 2000 só foi reencontrado em 2004.'],
  },
  // Aula 04
  {
    aula: 4, tipo: 'aberto',
    enunciado: 'Quais são os três objetivos que, segundo a aula, o governo enuncia em 2003 para organizar toda a regulação do setor?',
    evidencias: ['Em 2003, o governo enuncia os três objetivos que passam a organizar toda a regulação do setor: segurança de suprimento, modicidade tarifária e universalização.'],
  },
  {
    aula: 4, tipo: 'escolha',
    enunciado: 'Na tabela das criações de 2004, qual delas a aula chama de "a peça menos comentada e mais importante"?',
    alternativas: [
      'EPE — Empresa de Pesquisa Energética',
      'CCEE — Câmara de Comercialização',
      'CMSE — Comitê de Monitoramento',
      'Obrigação de cobertura e lastro',
    ],
    correta: 3,
    evidencias: ['A peça menos comentada e mais importante é a última.', 'Obrigação de cobertura e lastro — Expansão sem dono e sem obrigação de antecedência'],
  },
  {
    aula: 4, tipo: 'escolha',
    enunciado: 'Segundo a aula, em que ano acontece o primeiro leilão específico de energia eólica?',
    alternativas: ['2004', '2005', '2009', '2013'],
    correta: 2,
    evidencias: ['Em 2009, o primeiro leilão específico de energia eólica'],
  },
  // Aula 05
  {
    aula: 5, tipo: 'escolha',
    enunciado: 'Que nome a aula dá ao financiamento coletivo criado em 2014 para cobrir a exposição das distribuidoras?',
    alternativas: ['Conta-Covid', 'Conta-ACR', 'Conta de Desenvolvimento Energético'],
    correta: 1,
    evidencias: ['Em 2014 é criada a Conta-ACR: um financiamento coletivo que cobre a exposição das distribuidoras'],
  },
  {
    aula: 5, tipo: 'escolha',
    enunciado: 'Segundo a aula, a bandeira tarifária é:',
    alternativas: [
      'imposto',
      'componente tarifário administrado pela agência para sinalizar condição de geração',
      'um financiamento coletivo',
    ],
    correta: 1,
    evidencias: ['bandeira não é imposto. É componente tarifário administrado pela agência para sinalizar condição de geração'],
  },
  // Aula 06 (os 10 Ex·NN soltos também aparecem aqui, antes da prova)
  {
    aula: 6, tipo: 'escolha',
    enunciado: 'Segundo a aula, em que ano foi deferida a recuperação judicial da Light?',
    alternativas: ['1996', '2001', '2023', '2025'],
    correta: 2,
    evidencias: ['recuperação judicial deferida pela Justiça do Rio de Janeiro em maio de 2023'],
  },
  {
    aula: 6, tipo: 'escolha',
    enunciado: 'Segundo a aula, quantas vezes o regime de propriedade do setor elétrico brasileiro mudou de direção em cento e cinquenta anos?',
    alternativas: ['duas', 'três', 'quatro', 'cinco'],
    correta: 2,
    evidencias: ['O regime de propriedade do setor elétrico brasileiro mudou de direção quatro vezes em cento e cinquenta anos'],
  },
];

const aulas = textoDasAulas(N);
const ap = lerAparato(N);

// ── Ex·NN da fonte, com vínculo mecânico (regra de 15/11) ───────────────────
const textosVinculo = await textosDasAulas(N);
const vinculos = [];
const fonte = ap.exercicios.itens.map((e, k) => {
  const v = vincular(`${String(e.tag).replace(/^\d+\s*·\s*/, '')} ${e.enunciado.texto}`, textosVinculo);
  vinculos.push({ id: e.id, titulo: e.titulo, ...v });
  const campo = `exercicios.itens[${k}]`;
  const linha = e.origem.linha_aprox;
  return {
    id: e.id,
    moduloId: MODULO_ID,
    aula: v.escolhida,
    origem: 'fonte',
    tipo: 'aberto',
    enunciado: ed(e.enunciado.html),
    gabarito: null,
    referencia: ed(e.resposta_referencia.html),
    contaParaCriterioDoDrill: false,
    tolerancia: null,
    verificacao: 'autoavaliacao',
    fonte: { arquivo: APARATO, campo: `${campo}.enunciado`, linha },
    evidencias: [
      { arquivo: APARATO, campo: `${campo}.enunciado.texto`, linha, trecho: ed(e.enunciado.texto) },
      { arquivo: APARATO, campo: `${campo}.resposta_referencia.texto`, linha, trecho: ed(e.resposta_referencia.texto) },
    ],
    alertas: [
      v.escolhida
        ? `Vínculo mecânico à Aula ${String(v.escolhida).padStart(2, '0')} (regra de 15/11): a fonte não liga o Ex·${e.numero} a aula; trecho que casa: «${v.aulas.find((a) => a.n === v.escolhida).trecho}».`
        : `Exercício do módulo: a fonte não liga o Ex·${e.numero} a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).`,
      `Título da fonte: "${e.tag}".`,
    ],
  };
});
const fonteNaAula = fonte.filter((x) => x.aula !== null);
const doModulo = fonte.filter((x) => x.aula === null);

// ── Derivados ─────────────────────────────────────────────────────────────────
const contagem = {};
const derivados = ESPECIFICACOES.map((s) => {
  contagem[s.aula] = (contagem[s.aula] ?? 0) + 1;
  const id = `m${NN}-a${String(s.aula).padStart(2, '0')}-d${String(contagem[s.aula]).padStart(2, '0')}`;
  const evidencias = s.evidencias.map((t) => acharEvidencia(aulas, s.aula, t, NN));
  const item = {
    id,
    moduloId: MODULO_ID,
    aula: s.aula,
    origem: 'derivado-da-aula',
    tipo: s.tipo,
    enunciado: s.enunciado,
    ...(s.tipo === 'escolha' ? { alternativas: s.alternativas, gabarito: s.correta } : { gabarito: null }),
    referencia: evidencias.map((e) => e.trecho).join(' '),
    contaParaCriterioDoDrill: false,
    tolerancia: null,
    verificacao: s.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao',
    fonte: { arquivo: evidencias[0].arquivo, campo: evidencias[0].campo, linha: evidencias[0].linha },
    evidencias,
  };
  return item;
});

// fonte antes de derivado, por aula
const porAula = [...fonteNaAula, ...derivados].sort((a, b) => a.aula - b.aula || (a.origem === b.origem ? 0 : a.origem === 'fonte' ? -1 : 1));

// ── Prova (§Quiz) ─────────────────────────────────────────────────────────────
const q = ap.avaliacao;
const criterio = ed(q.lede.texto.match(/O critério[^.]*\./)[0]);
const [acertosMinimos, total] = q.criterio_literal.match(/(\d+) de (\d+)/).slice(1).map(Number);
const faixas = q.faixas.map((f) => {
  const [min, max] = f.faixa.split('–').map(Number);
  return { min, max, mensagem: ed(f.mensagem) };
});
const prova = {
  moduloId: MODULO_ID,
  criterio,
  acertosMinimos,
  total,
  questoes: q.questoes.map((x, i) => ({
    id: `m${NN}-quiz-q${String(i + 1).padStart(2, '0')}`,
    enunciado: ed(x.enunciado),
    alternativas: x.alternativas.map((a) => ed(a.texto)),
    correta: x.gabarito.indice,
    explicacao: ed(x.explicacao),
    fonte: { arquivo: APARATO, campo: `avaliacao.questoes[${i}]`, linha: x.origem.linha_aprox },
  })),
  faixas,
  faixasFonte: { arquivo: APARATO, campo: 'avaliacao.faixas', linha: q.faixas[0].origem.linha_aprox },
  criterioFonte: { arquivo: APARATO, campo: 'avaliacao.lede', linha: q.lede.origem.linha_aprox },
};

// ── Checklist (§Final) ────────────────────────────────────────────────────────
const c = ap.checklist_final;
const checklist = {
  moduloId: MODULO_ID,
  introducao: ed(c.lede.texto),
  itens: c.itens.map((it, i) => ({
    id: `m${NN}-checklist-${String(i + 1).padStart(2, '0')}`,
    texto: ed(it.texto),
    fonte: { arquivo: APARATO, campo: `checklist_final.itens[${i}].texto`, linha: it.origem.linha_aprox },
  })),
};

const arq = escrever(
  N,
  [
    `GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m${NN}.mjs — não editar à mão.`,
    `Fonte: ${APARATO} e o texto das aulas (Alexandria modulos/alexandria_modulo${NN}.html).`,
    `Itens 'fonte' são literais da extração; 'derivado-da-aula' citam o trecho da aula que os responde.`,
    `Vínculo Ex·NN → aula: regra de 15/11 (última aula que casar por trecho literal); sem casamento → EXERCICIOS_DO_MODULO.`,
    `${porAula.length} itens por aula (${fonteNaAula.length} da fonte, ${derivados.length} derivados) · ${doModulo.length} do módulo · ${prova.questoes.length} questões na prova · ${checklist.itens.length} itens no checklist.`,
    `Trocas editoriais: ${JSON.stringify(uso)}.`,
  ],
  { EXERCICIOS_DAS_AULAS: porAula, EXERCICIOS_DO_MODULO: doModulo, PROVAS: [prova], CHECKLISTS: [checklist] },
);

console.log(`→ ${arq}`);
console.log(`   ${porAula.length} itens por aula (${fonteNaAula.length} fonte + ${derivados.length} derivados) · ${doModulo.length} do módulo · prova ${prova.questoes.length} × 4 · checklist ${checklist.itens.length}`);
for (let a = 1; a <= aulas.length; a++) console.log(`   A${String(a).padStart(2, '0')}: ${porAula.filter((x) => x.aula === a).map((x) => x.id).join(', ')}`);
console.log('   vínculo mecânico Ex·NN → aula (regra de 15/11):');
for (const v of vinculos) console.log(`     ${v.id} → ${v.escolhida ? 'A' + String(v.escolhida).padStart(2, '0') : 'módulo'}  ${v.aulas.map((a) => `A0${a.n}: «${a.trecho}»`).join('  ')}  ${v.titulo}`);
console.log(`   trocas editoriais: ${JSON.stringify(uso)}`);
