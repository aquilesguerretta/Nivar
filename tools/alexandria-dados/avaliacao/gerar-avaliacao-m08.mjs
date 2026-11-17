// Gera src/lib/alexandria/avaliacao/m08.dados.ts — exercícios por aula, prova e checklist do M08 —
// a partir SÓ de docs/alexandria-v2/extraction/m08/aparato.json e do texto das aulas (HTML original,
// lido por tools/alexandria-dados/porte/). Modelo: gerar-avaliacao-m06.mjs; esquema do aparato do M08: enunciado {html,texto}, resposta_de_referencia em parágrafos, quiz em `quiz` (questoes, placar).
//
// Duas origens, nunca misturadas:
//   'fonte'            — os 10 Ex·NN do §Ex, o quiz do §Quiz (10 × 4, critério e faixas literais) e
//                        as 24 verificações do §Final. Texto copiado da extração, com a linha do HTML.
//   'derivado-da-aula' — perguntas de recuperação cuja resposta está LITERALMENTE no texto da aula
//                        (`evidencias`). O gerador acha o trecho no texto da aula e para se não achar.
//
// VÍNCULO EXERCÍCIO → AULA (regra de colocação de 15/11, docs/alexandria-v3/PORTE-POR-MODULO.md).
// A fonte não liga nenhum dos 12 Ex·NN a aula (M08) (aparato.json, `exercicios.vinculo_nota`; P9). Um
// Ex·NN vai para a ÚLTIMA aula que casar — casamento = trecho literal com pelo menos 4 palavras
// cheias seguidas do rótulo + enunciado aparece no texto da aula (`vincular`, a mesma função do
// M12/M13) — com alerta "vínculo mecânico". O que não casar fica em EXERCICIOS_DO_MODULO, que a
// aula mostra na última aula, antes da prova. Resultado medido no relatório m08.md.
//
// Regras impostas (o verificador reconfere do zero): `tolerancia` sempre null; aberto fecha por
// autoavaliação; só `escolha` tem alternativa correta; trocas editoriais (P24, Bloco N → Módulo NN)
// aplicadas ao texto visível e contadas; a fonte não tem critério por exercício nem "seis dos oito"
// (`contaParaCriterioDoDrill: false` em todos).
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m08.mjs

import { textoDasAulas, acharEvidencia, lerAparato, norm, escrever } from './avaliacao-m06-m08.mjs';
import { textosDasAulas, vincular } from './vinculo-mecanico-m12-m13.mjs';
import { editorial } from '../porte/corpo-m06-m08.mjs';

const N = 8, NN = '08', MODULO_ID = 'modulo-08';
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
    enunciado: 'Segundo a aula, a capacidade instalada é um estoque ou um fluxo?',
    alternativas: ['um estoque', 'um fluxo'],
    correta: 0,
    evidencias: ['É um estoque, fotografado numa data.'],
  },
  {
    aula: 1, tipo: 'aberto',
    enunciado: 'Segundo a aula, por que o fator de capacidade baixo da solar não quer dizer que ela seja ineficiente?',
    evidencias: ['A tecnologia converte um recurso que só existe de dia, e a potência nominal de um módulo é medida no pico. Chamar isso de ineficiência é usar a métrica errada para a pergunta.'],
  },
  // Aula 02
  {
    aula: 2, tipo: 'aberto',
    enunciado: 'Segundo a aula, por que as seis fichas têm campos idênticos e na mesma ordem?',
    evidencias: ['Isso não é formatação: é o que permite leitura lateral, que é metade do valor desta aula.'],
  },
  {
    aula: 2, tipo: 'escolha',
    enunciado: 'Qual é, segundo a aula, o primeiro dos dois vieses que aparecem quase sempre na primeira rodada?',
    alternativas: ['superestimar a solar em geração', 'subestimar a térmica em capacidade'],
    correta: 1,
    evidencias: ['O primeiro é subestimar a térmica em capacidade'],
  },
  // Aula 03
  {
    aula: 3, tipo: 'escolha',
    enunciado: 'Segundo a aula, qual recurso não tem papel sazonal?',
    alternativas: ['o vento', 'a solar'],
    correta: 1,
    evidencias: ['a solar não tem papel sazonal e o vento não tem papel intradiário confiável.'],
  },
  {
    aula: 3, tipo: 'aberto',
    enunciado: 'Segundo a aula, o que é a carga que o operador nacional enxerga?',
    evidencias: ['A carga que o operador nacional enxerga não é o consumo da sociedade. É o consumo menos a geração que ele não comanda'],
  },
  // Aula 04
  {
    aula: 4, tipo: 'aberto',
    enunciado: 'Segundo a aula, por que a geração hidrelétrica não pode ser reduzida indefinidamente?',
    evidencias: ['Existem vazões mínimas obrigatórias por licença ambiental, requisitos de navegação e abastecimento, limites de estabilidade e exigências operativas das máquinas.'],
  },
  {
    aula: 4, tipo: 'escolha',
    enunciado: 'Segundo a aula, contra que régua a afluência de um mês deve ser lida?',
    alternativas: ['a média anual do Brasil', 'o valor histórico esperado da afluência para aquele mês e aquele subsistema'],
    correta: 1,
    evidencias: ['A média de longo termo é o valor histórico esperado da afluência para aquele mês e aquele subsistema.'],
  },
  // Aula 05
  {
    aula: 5, tipo: 'escolha',
    enunciado: 'Segundo a aula, o que é um submercado?',
    alternativas: ['fronteira administrativa', 'zona de contabilização e de preço'],
    correta: 1,
    evidencias: ['Submercado é zona de contabilização e de preço, não fronteira administrativa'],
  },
  {
    aula: 5, tipo: 'aberto',
    enunciado: 'Segundo a aula, qual é a diferença entre corte por confiabilidade e corte por razão energética?',
    evidencias: ['Corte por confiabilidade é problema de rede: mais linha resolve. Corte por razão energética é problema de balanço: mais linha não resolve nada, porque a energia não tem para onde ir em lugar nenhum do país naquela hora.'],
  },
  // Aula 06
  {
    aula: 6, tipo: 'aberto',
    enunciado: 'Segundo a aula, o que o consumidor livre escolhe, e o que continua igual?',
    evidencias: ['o consumidor livre escolhe de quem compra a energia, e continua usando e pagando a rede local.'],
  },
  {
    aula: 6, tipo: 'escolha',
    enunciado: 'Segundo a aula, o que a migração para o ambiente livre faz com o consumo?',
    alternativas: ['reduz consumo físico', 'move consumo entre ambientes contábeis'],
    correta: 1,
    evidencias: ['A migração não reduz consumo físico — move consumo entre ambientes contábeis.'],
  },
  // Aula 07 (os Ex·NN soltos também aparecem aqui, antes da prova)
  {
    aula: 7, tipo: 'aberto',
    enunciado: 'Segundo a aula, por que a participação hidrelétrica na geração caiu?',
    evidencias: ['A leitura correta é aritmética: a capacidade hidrelétrica cresceu pouco enquanto a das outras fontes explodiu'],
  },
  {
    aula: 7, tipo: 'escolha',
    enunciado: 'Segundo a aula, quanto tempo leva uma linha de transmissão?',
    alternativas: ['de cinco a quinze', 'um a dois anos'],
    correta: 0,
    evidencias: ['Uma usina eólica ou solar se constrói em um a dois anos. Uma linha de transmissão leva de cinco a quinze'],
  },
];

const aulas = textoDasAulas(N);
const ap = lerAparato(N);

// ── Ex·NN da fonte, com vínculo mecânico (regra de 15/11) ───────────────────
const textosVinculo = await textosDasAulas(N);
const vinculos = [];
const fonte = ap.exercicios.itens.map((e, k) => {
  // M07: o rótulo do summary é só o número ("01"); casa-se o enunciado.
  const v = vincular(e.enunciado.texto, textosVinculo);
  vinculos.push({ id: e.id, titulo: e.bloco, ...v });
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
    referencia: ed(e.resposta_de_referencia.map((p) => p.html).join('<br><br>')),
    contaParaCriterioDoDrill: false,
    tolerancia: null,
    verificacao: 'autoavaliacao',
    fonte: { arquivo: APARATO, campo: `${campo}.enunciado`, linha },
    evidencias: [
      { arquivo: APARATO, campo: `${campo}.enunciado.texto`, linha, trecho: ed(e.enunciado.texto) },
      ...e.resposta_de_referencia.map((p, j) => ({ arquivo: APARATO, campo: `${campo}.resposta_de_referencia[${j}].html`, linha, trecho: ed(p.html) })),
    ],
    alertas: [
      v.escolhida
        ? `Vínculo mecânico à Aula ${String(v.escolhida).padStart(2, '0')} (regra de 15/11): a fonte não liga o Ex·${e.tag} a aula; trecho que casa: «${v.aulas.find((a) => a.n === v.escolhida).trecho}».`
        : `Exercício do módulo: a fonte não liga o Ex·${e.tag} a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).`,
      `Grupo da fonte: "${e.bloco}".`,
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
const q = ap.quiz;
// Critério literal do lede do §Quiz.
const criterio = ed(q.lead.texto.match(/O critério[^.]*\./)[0]);
const [acertosMinimos, total] = criterio.match(/(\d+) de (\d+)/).slice(1).map(Number);
// A fonte escreve o placar como um `if (n >= 8)` com os dois ramos (aparato.json, quiz.placar).
const faixas = q.placar.faixas.map((f) => {
  const corte = Number(/n >= (\d+)/.exec(f.condicao)[1]);
  const [min, max] = f.ramo === 'verdadeiro' ? [corte, total] : [0, corte - 1];
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
    correta: x.gabarito_indice,
    explicacao: ed(x.explicacao),
    fonte: { arquivo: APARATO, campo: `quiz.questoes[${i}]`, linha: x.origem.linha_aprox },
  })),
  faixas,
  faixasFonte: { arquivo: APARATO, campo: 'quiz.placar', linha: q.placar.origem.linha_aprox },
  criterioFonte: { arquivo: APARATO, campo: 'quiz.lead', linha: q.lead.origem.linha_aprox },
};

// ── Checklist (§Final) ────────────────────────────────────────────────────────
const c = ap.checklist_final;
const checklist = {
  moduloId: MODULO_ID,
  introducao: ed(c.lead.texto),
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
