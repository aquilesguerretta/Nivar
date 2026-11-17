// Gera src/lib/alexandria/avaliacao/m07.dados.ts — exercícios por aula, prova e checklist do M07 —
// a partir SÓ de docs/alexandria-v2/extraction/m07/aparato.json e do texto das aulas (HTML original,
// lido por tools/alexandria-dados/porte/). Modelo: gerar-avaliacao-m06.mjs; o aparato do M07 tem outro esquema (perguntas, resposta_de_referencia em parágrafos).
//
// Duas origens, nunca misturadas:
//   'fonte'            — os 10 Ex·NN do §Ex, o quiz do §Quiz (10 × 4, critério e faixas literais) e
//                        as 24 verificações do §Final. Texto copiado da extração, com a linha do HTML.
//   'derivado-da-aula' — perguntas de recuperação cuja resposta está LITERALMENTE no texto da aula
//                        (`evidencias`). O gerador acha o trecho no texto da aula e para se não achar.
//
// VÍNCULO EXERCÍCIO → AULA (regra de colocação de 15/11, docs/alexandria-v3/PORTE-POR-MODULO.md).
// A fonte não liga nenhum dos 12 Ex·NN a aula (aparato.json, `exercicios.vinculo_nota`; P9). Um
// Ex·NN vai para a ÚLTIMA aula que casar — casamento = trecho literal com pelo menos 4 palavras
// cheias seguidas do rótulo + enunciado aparece no texto da aula (`vincular`, a mesma função do
// M12/M13) — com alerta "vínculo mecânico". O que não casar fica em EXERCICIOS_DO_MODULO, que a
// aula mostra na última aula, antes da prova. Medido: nenhum dos 12 casa (relatório m07.md).
//
// Regras impostas (o verificador reconfere do zero): `tolerancia` sempre null; aberto fecha por
// autoavaliação; só `escolha` tem alternativa correta; trocas editoriais (P24, Bloco N → Módulo NN)
// aplicadas ao texto visível e contadas; a fonte não tem critério por exercício nem "seis dos oito"
// (`contaParaCriterioDoDrill: false` em todos).
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m07.mjs

import { textoDasAulas, acharEvidencia, lerAparato, norm, escrever } from './avaliacao-m06-m08.mjs';
import { textosDasAulas, vincular } from './vinculo-mecanico-m12-m13.mjs';
import { editorial } from '../porte/corpo-m06-m08.mjs';

const N = 7, NN = '07', MODULO_ID = 'modulo-07';
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
    enunciado: 'Segundo a ficha institucional da aula, quem preside o Conselho Nacional de Política Energética?',
    alternativas: ['Ministro de Minas e Energia', 'diretor-geral', 'Casa Civil'],
    correta: 0,
    evidencias: ['presidido pelo Ministro de Minas e Energia'],
  },
  {
    aula: 1, tipo: 'aberto',
    enunciado: 'Segundo a aula, o que a política pública escolhe, e o que a regulação faz com essa escolha?',
    evidencias: [
      'Política pública escolhe o que priorizar',
      'Regulação converte essa direção em procedimentos, metodologias, obrigações, incentivos e sanções aplicáveis a agentes identificáveis, dentro de competência definida em lei e com dever de motivação técnica.',
    ],
  },
  // Aula 02
  {
    aula: 2, tipo: 'escolha',
    enunciado: 'Pela regra de uso da aula, o que é o plano decenal?',
    alternativas: ['contabilidade histórica', 'projeção sob premissas para decisão de médio prazo', 'exploração estratégica de longo prazo'],
    correta: 1,
    evidencias: ['o plano decenal é projeção sob premissas para decisão de médio prazo'],
  },
  {
    aula: 2, tipo: 'escolha',
    enunciado: 'Qual é, segundo a ficha da aula, a decisão da EPE com efeito prático mais direto?',
    alternativas: ['outorga', 'a habilitação', 'tarifa'],
    correta: 1,
    evidencias: ['A habilitação é a decisão da EPE com efeito prático mais direto: projeto não habilitado não participa do certame.'],
  },
  // Aula 03
  {
    aula: 3, tipo: 'escolha',
    enunciado: 'Quantos membros tem a diretoria da agência reguladora, segundo a aula?',
    alternativas: ['três', 'cinco', 'sete', 'dez'],
    correta: 1,
    evidencias: ['A diretoria tem cinco membros, um deles o diretor-geral.'],
  },
  {
    aula: 3, tipo: 'aberto',
    enunciado: 'Segundo a aula, qual é a diferença entre resolução normativa e resolução homologatória?',
    evidencias: ['A diferença não é de importância — é de natureza jurídica: geral e abstrata contra concreta e individual.'],
  },
  // Aula 04
  {
    aula: 4, tipo: 'escolha',
    enunciado: 'Nos Procedimentos de Rede, quem propõe e quem aprova, segundo a aula?',
    alternativas: ['o operador escreve e aprova as próprias regras', 'o operador propõe; a agência aprova', 'a câmara forma e publica'],
    correta: 1,
    evidencias: ['o operador propõe; a agência aprova.'],
  },
  {
    aula: 4, tipo: 'aberto',
    enunciado: 'Segundo a aula, quais são as áreas operadas pelos centros regionais do operador?',
    evidencias: ['centros regionais que operam as áreas — Norte e Centro-Oeste, Nordeste, Sudeste e Sul.'],
  },
  // Aula 05
  {
    aula: 5, tipo: 'escolha',
    enunciado: 'Segundo a aula, como é a liquidação na câmara de comercialização?',
    alternativas: ['uma bolsa onde toda a energia é comprada na hora', 'multilateral e por rateio'],
    correta: 1,
    evidencias: ['a liquidação é multilateral e por rateio.'],
  },
  {
    aula: 5, tipo: 'aberto',
    enunciado: 'Segundo a aula, o que o mecanismo de realocação de energia socializa, e o que ele não elimina?',
    evidencias: ['o mecanismo socializa o risco operativo intrassistema — o risco de a sua usina específica ter sido despachada menos — mas não elimina o risco hidrológico agregado do conjunto.'],
  },
  // Aula 06
  {
    aula: 6, tipo: 'aberto',
    enunciado: 'Segundo a aula, o que o comitê de monitoramento faz, e o que ele não faz?',
    evidencias: ['O comitê integra informação e recomenda; ele não contrata, não despacha e não regula.'],
  },
  {
    aula: 6, tipo: 'escolha',
    enunciado: 'Segundo a aula, a competência para licenciar um empreendimento se define por quê?',
    alternativas: ['automaticamente federal', 'critérios legais de porte, localização e natureza do impacto'],
    correta: 1,
    evidencias: ['a competência para licenciar não é automaticamente federal. Ela se define por critérios legais de porte, localização e natureza do impacto'],
  },
  // Aula 07 (os 12 Ex·NN soltos também aparecem aqui, antes da prova)
  {
    aula: 7, tipo: 'aberto',
    enunciado: 'Segundo a aula, a frase institucional descreve o quê — e o que ela não descreve?',
    evidencias: ['a frase descreve a função primária de cada instituição, não o conjunto de suas competências.'],
  },
  {
    aula: 7, tipo: 'escolha',
    enunciado: 'Segundo a aula, como é quase todo evento de valor no setor?',
    alternativas: ['agendado com antecedência', 'invisível', 'tempo real'],
    correta: 0,
    evidencias: ['Quase todo evento de valor no setor é agendado com antecedência'],
  },
];

const aulas = textoDasAulas(N);
const ap = lerAparato(N);

// ── Ex·NN da fonte, com vínculo mecânico (regra de 15/11) ───────────────────
const textosVinculo = await textosDasAulas(N);
const vinculos = [];
const fonte = ap.exercicios.itens.map((e, k) => {
  // M07: o rótulo do summary é só o número ("01"); casa-se o enunciado.
  const v = vincular(e.enunciado, textosVinculo);
  vinculos.push({ id: e.id, titulo: e.grupo, ...v });
  const campo = `exercicios.itens[${k}]`;
  const linha = e.origem.linha_aprox;
  return {
    id: e.id,
    moduloId: MODULO_ID,
    aula: v.escolhida,
    origem: 'fonte',
    tipo: 'aberto',
    enunciado: ed(e.enunciado),
    gabarito: null,
    referencia: ed(e.resposta_de_referencia.map((p) => p.html).join('<br><br>')),
    contaParaCriterioDoDrill: false,
    tolerancia: null,
    verificacao: 'autoavaliacao',
    fonte: { arquivo: APARATO, campo: `${campo}.enunciado`, linha },
    evidencias: [
      { arquivo: APARATO, campo: `${campo}.enunciado`, linha, trecho: ed(e.enunciado) },
      ...e.resposta_de_referencia.map((p, j) => ({ arquivo: APARATO, campo: `${campo}.resposta_de_referencia[${j}].html`, linha, trecho: ed(p.html) })),
    ],
    alertas: [
      v.escolhida
        ? `Vínculo mecânico à Aula ${String(v.escolhida).padStart(2, '0')} (regra de 15/11): a fonte não liga o Ex·${e.tag} a aula; trecho que casa: «${v.aulas.find((a) => a.n === v.escolhida).trecho}».`
        : `Exercício do módulo: a fonte não liga o Ex·${e.tag} a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).`,
      `Grupo da fonte: "${e.grupo}".`,
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
// Critério literal do h2 do §Quiz: "Dez questões · critério 8/10".
const criterio = ed(q.criterio_literal[0].texto);
const [acertosMinimos, total] = criterio.match(/(\d+)\/(\d+)/).slice(1).map(Number);
const faixas = q.faixas_de_placar_script.map((f) => {
  const [min, max] = f.intervalo.split('–').map(Number);
  return { min, max, mensagem: ed(f.mensagem) };
});
const prova = {
  moduloId: MODULO_ID,
  criterio,
  acertosMinimos,
  total,
  questoes: q.perguntas.map((x, i) => ({
    id: `m${NN}-quiz-q${String(i + 1).padStart(2, '0')}`,
    enunciado: ed(x.enunciado),
    alternativas: x.alternativas.map((a) => ed(a.texto)),
    correta: x.gabarito.indice,
    explicacao: ed(x.explicacao),
    fonte: { arquivo: APARATO, campo: `avaliacao.perguntas[${i}]`, linha: x.origem.linha_aprox },
  })),
  faixas,
  faixasFonte: { arquivo: APARATO, campo: 'avaliacao.faixas_de_placar_script', linha: q.faixas_de_placar_script[0].origem.linha_aprox },
  criterioFonte: { arquivo: APARATO, campo: 'avaliacao.criterio_literal[0]', linha: q.criterio_literal[0].origem.linha_aprox },
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
