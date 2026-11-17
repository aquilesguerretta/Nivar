// Gera src/lib/alexandria/avaliacao.dados.ts — exercícios por aula, prova e checklist
// do M01 — a partir SÓ da extração verificada (docs/alexandria-v2/extraction/m01).
//
// Duas origens, nunca misturadas:
//   'fonte'            — Ex·NN do § Drill, o quiz do § Quiz, as faixas do script e o
//                        checklist do § Final. Texto copiado da extração (enunciado,
//                        referência, critério e mensagens literais), com a linha do HTML.
//   'derivado-da-aula' — itens das aulas que a fonte deixou sem exercício (e um ou dois a
//                        mais onde só há um). Cada item abaixo declara, em ESPECIFICACOES,
//                        a pergunta e o(s) trecho(s) da própria aula que a respondem. O
//                        gerador acha o trecho na extração e deriva dele o caminho e a
//                        linha; se o trecho não existe, o gerador para. A referência
//                        mostrada ao aluno é o trecho literal — nada é parafraseado.
//
// Regras que o gerador impõe (o verificador reconfere do zero):
//   - nenhuma tolerância é criada: `tolerancia` é sempre null; resposta numérica ou
//     discursiva se fecha por autoavaliação em três níveis (atende · atende em parte ·
//     não atende); só `escolha` tem alternativa correta;
//   - o texto visível leva a troca editorial P24 (GridAlpha → NIVAR), contada e
//     reportada; o verificador aplica a mesma troca do lado da extração;
//   - ausência se declara: a fonte não liga questão do quiz a aula, e não traz critério
//     por exercício — os dois ficam fora, sem preenchimento.
//
// Uso: node tools/alexandria-dados/gerar-avaliacao.mjs

import fs from 'node:fs';
import path from 'node:path';
import {
  RAIZ, ARQUIVO_APARATO, arquivoDaAula, lerJson, norm, indiceDoTextoDaAula,
} from './avaliacao-fonte.mjs';

const SAIDA = path.join(RAIZ, 'src/lib/alexandria/avaliacao.dados.ts');
const MODULO_ID = 'modulo-01';

let trocasP24 = 0;
// Q03 / D09 (decisões de 15/11/2026): o vocabulário interno sai do texto visível
// pelo mesmo caminho. "Trava 4 do War Room" vira a frase que a própria A05 usa
// ("uma trava operacional da NIVAR"); o número da trava some junto (D09).
let trocasQ03 = 0;
// Q02 (decisões de 15/11/2026): o catálogo governa o nome. A remissão ao próximo
// módulo usa o nome do catálogo (alexandria-blocks.ts, bloco-02).
let trocasQ02 = 0;
const p24 = (s) =>
  String(s)
    .replace(/GridAlpha/g, () => { trocasP24 += 1; return 'NIVAR'; })
    .replace(/a Trava [34] do War Room/g, () => { trocasQ03 += 1; return 'uma trava operacional da NIVAR'; })
    .replace(/Módulo 02 — A Rede Elétrica/g, () => { trocasQ02 += 1; return 'Módulo 02 — Como Funciona uma Rede Elétrica'; });
const lit = (s) => p24(norm(s));

// ── Itens derivados: a especificação ────────────────────────────────────────
// `evidencias`: trechos literais (norm) da aula. `correta`: índice em `alternativas`.
// `sep`: como juntar mais de um trecho na referência (default: espaço).
// Distratores: sempre termos ou frases que aparecem nas aulas do módulo (o
// verificador confere por substring).
const ESPECIFICACOES = [
  // ── Aula 01 ────────────────────────────────────────────────────────────────
  {
    aula: 1, tipo: 'escolha',
    enunciado: 'Segundo a aula, qual é a pergunta que a potência responde?',
    alternativas: [
      'Quanto foi usado no total?',
      'Com que ritmo está sendo usado agora?',
      'Subiu por kWh, por kW, por horário, por bandeira, por reativo, por imposto, ou por reajuste?',
    ],
    correta: 1,
    evidencias: ['Potência responde "com que ritmo está sendo usado agora?".'],
  },
  {
    aula: 1, tipo: 'aberto',
    enunciado: 'A aula traz, como erro de fluência, a frase "A empresa consumiu 500 kW no mês." Por que ela está errada, e o que a aula diz que seria o correto?',
    evidencias: ['"A empresa consumiu 500 kW no mês." Errado. Ela demandou 500 kW em algum momento e consumiu X kWh ao longo do mês.'],
  },
  // ── Aula 02 ────────────────────────────────────────────────────────────────
  {
    aula: 2, tipo: 'escolha',
    enunciado: 'Na analogia da torneira que a aula usa, a corrente elétrica corresponde a quê?',
    alternativas: ['Pressão da água', 'Volume', 'Vazão'],
    correta: 2,
    evidencias: ['Se tensão é pressão, corrente é vazão.'],
  },
  {
    aula: 2, tipo: 'escolha',
    enunciado: 'Em corrente alternada, qual das três potências "ocupa a rede sem virar produção"?',
    alternativas: ['kW', 'kVA', 'kVAr'],
    correta: 2,
    evidencias: ['kW é o que vira produção; kVAr ocupa a rede sem virar produção; kVA é o que a rede precisa dimensionar.'],
  },
  // ── Aula 03 (sem exercício na fonte) ──────────────────────────────────────
  {
    aula: 3, tipo: 'escolha',
    enunciado: 'Se o consumo aumenta e a geração não acompanha, o que acontece com a frequência da rede?',
    alternativas: [
      'Oscila sessenta vezes por segundo',
      'A frequência sobe',
      'A frequência da rede cai',
    ],
    correta: 2,
    evidencias: ['Se o consumo aumenta e a geração não acompanha, a frequência da rede cai.'],
  },
  {
    aula: 3, tipo: 'aberto',
    enunciado: 'Por que a corrente alternada venceu a Guerra das Correntes, segundo a aula?',
    evidencias: ['a corrente alternada venceu por uma razão técnica decisiva: com AC é simples elevar e reduzir tensão usando transformadores. Em DC, o equivalente é tecnologicamente muito mais caro e complexo.'],
  },
  {
    aula: 3, tipo: 'escolha',
    enunciado: 'Quantas vezes por dia, segundo a aula, o ONS precisa equilibrar oferta e demanda?',
    alternativas: ['60', '86.400', '8.760', '24'],
    correta: 1,
    evidencias: ['Coordena um sistema físico que precisa equilibrar oferta e demanda 86.400 vezes por dia — uma vez por segundo, todos os segundos.'],
  },
  {
    aula: 3, tipo: 'aberto',
    enunciado: 'Segundo a aula, que equipamentos sensíveis são afetados por quedas ou desvios relevantes de frequência, e como?',
    evidencias: ['motores síncronos perdem sincronismo, drives de velocidade variável desarmam por proteção, sistemas de controle de processo travam.'],
  },
  // ── Aula 04 ────────────────────────────────────────────────────────────────
  {
    aula: 4, tipo: 'escolha',
    enunciado: 'Como a aula chama o fenômeno em que parte da energia elétrica se transforma em calor ao passar por um condutor com resistência?',
    alternativas: ['Lei de Ohm', 'Efeito Joule', 'TUSD-fio', 'UFER'],
    correta: 1,
    evidencias: ['parte da energia elétrica se transforma em calor. Isso é dissipação resistiva — o famoso "efeito Joule".'],
  },
  {
    aula: 4, tipo: 'escolha',
    enunciado: 'Segundo a tabela da aula, qual destes é exemplo de perda não técnica?',
    alternativas: ['Aquecimento de cabos', 'Perdas em transformadores', 'Furto de energia', 'Perdas magnéticas'],
    correta: 2,
    evidencias: ['Não técnicas', 'Comerciais — furto de energia, fraude no medidor, inadimplência, erro de medição'],
    sep: ' — ',
  },
  // ── Aula 05: dois exercícios na fonte (Ex·04, Ex·07); nada derivado ───────
  // ── Aula 06 (sem exercício na fonte) ──────────────────────────────────────
  {
    aula: 6, tipo: 'aberto',
    enunciado: 'Segundo a aula, qual é a diferença entre a estrutura tarifária do Grupo B e a do Grupo A?',
    evidencias: ['Grupo B paga uma tarifa simples (essencialmente: kWh × tarifa). Grupo A paga uma estrutura tarifária binômia: uma componente para consumo (kWh) e outra para demanda (kW).'],
  },
  {
    aula: 6, tipo: 'aberto',
    enunciado: 'Por que, em geral, quanto mais alta a tensão de fornecimento, menor a tarifa? Cite o que a aula lista.',
    evidencias: [
      'Quanto mais alta a tensão de fornecimento, mais próximo o consumidor está fisicamente da geração e da transmissão troncal, e menos camadas de rede ele atravessa.',
      'Menos perdas técnicas embutidas na sua tarifa; Menos uso de ativos de distribuição de baixa tensão; Menor componente de TUSD comparada à TE.',
    ],
  },
  {
    aula: 6, tipo: 'escolha',
    enunciado: 'Qual sistema de fornecimento a aula descreve como "padrão industrial"?',
    alternativas: ['Monofásico', 'Bifásico', 'Trifásico'],
    correta: 2,
    evidencias: ['Trifásico', 'Padrão industrial; comércios médios e grandes; motores trifásicos'],
    sep: ' — ',
  },
  // ── Aula 07 ────────────────────────────────────────────────────────────────
  {
    aula: 7, tipo: 'escolha',
    enunciado: 'Qual destes equipamentos a aula cita como puramente resistivo, com a corrente em fase com a tensão?',
    alternativas: ['Motores', 'Uma resistência de chuveiro', 'Transformadores', 'Compressores'],
    correta: 1,
    evidencias: ['Em equipamentos puramente resistivos — uma resistência de chuveiro, uma lâmpada incandescente — a corrente está perfeitamente em fase com a tensão.'],
  },
  {
    aula: 7, tipo: 'aberto',
    enunciado: 'Segundo a aula, por que o fator de potência baixo de uma instalação afeta outros clientes da mesma rede?',
    evidencias: ['ela força a distribuidora a entregar mais kVA para produzir o mesmo kW útil. Isso ocupa capacidade de transformadores, cabos e proteção, além de aumentar perdas — externalidades que afetam todos os outros clientes daquela rede.'],
  },
  // ── Aula 08 ────────────────────────────────────────────────────────────────
  {
    aula: 8, tipo: 'escolha',
    enunciado: 'Em que unidade a aula diz que a geração efetiva é medida?',
    alternativas: ['MW', 'kVA', 'MWh', '%'],
    correta: 2,
    evidencias: ['Geração efetiva é o que a usina realmente produziu em um período, medido em MWh.'],
  },
  {
    aula: 8, tipo: 'aberto',
    enunciado: 'Segundo a aula, por que uma usina não gera sua capacidade instalada o tempo todo? Dê os exemplos que a aula traz.',
    evidencias: ['A solar não gera à noite. A eólica depende do vento. A hidrelétrica depende de chuva e reservatório. A térmica depende de combustível disponível e despacho do sistema.'],
  },
  // ── Aula 09 (sem exercício na fonte) ──────────────────────────────────────
  {
    aula: 9, tipo: 'escolha',
    enunciado: 'Segundo a tabela das três dimensões da qualidade, a qual delas pertencem os indicadores DEC e FEC?',
    alternativas: ['Qualidade do produto (tensão)', 'Qualidade comercial', 'Qualidade do serviço (continuidade)'],
    correta: 2,
    evidencias: ['Qualidade do serviço (continuidade)', 'DEC, FEC (coletivos) · DIC, FIC, DMIC, DICRI (individuais)'],
    sep: ' — ',
  },
  {
    aula: 9, tipo: 'escolha',
    enunciado: 'Na tabela de indicadores de continuidade, o que mede o FEC?',
    alternativas: [
      'Tempo total médio de interrupção por consumidor no ano (em horas)',
      'Maior interrupção individual no período',
      'Número médio de interrupções por consumidor no ano',
      'Número de interrupções naquela unidade no período',
    ],
    correta: 2,
    evidencias: ['FEC', 'Frequência Equivalente de interrupção por unidade Consumidora', 'Número médio de interrupções por consumidor no ano'],
    sep: ' — ',
  },
  {
    aula: 9, tipo: 'escolha',
    enunciado: 'Qual fenômeno a aula descreve como "queda rápida e temporária da tensão"?',
    alternativas: ['Sobretensão', 'Harmônicos', 'Flicker (flutuação de tensão)', 'Afundamento de tensão (voltage sag)'],
    correta: 3,
    evidencias: ['Afundamento de tensão (voltage sag)', 'Queda rápida e temporária da tensão'],
    sep: ' — ',
  },
  {
    aula: 9, tipo: 'escolha',
    enunciado: 'Na medição de conformidade de tensão (intervalos de 10 minutos por pelo menos sete dias consecutivos), quantas leituras a aula diz que isso totaliza?',
    alternativas: ['86.400', '8.760', '1.008', '24'],
    correta: 2,
    evidencias: ['com medição integralizada em intervalos de 10 minutos por pelo menos sete dias consecutivos, totalizando 1.008 leituras.'],
  },
];

// ── Alertas declarados (fatos medidos na extração, não opinião) ─────────────
const ALERTAS = {
  'm01-ex-04': [
    'O enunciado é o cenário-padrão do INST·04 (144.000 kWh · 720 h · 800 kW) e o instrumento mostra a resposta no padrão (aula-05.json, instrumentos[0].coincidencia_com_exercicio). O INST·04 não pode abrir nesse cenário antes da tentativa deste exercício.',
  ],
  'm01-ex-06': [
    'A referência cita faixas de fator de capacidade que a pendência QA-FCap-01 (P20) ainda não verificou. Literal da fonte; não vira verdade transversal.',
  ],
};

// ── Leitura ─────────────────────────────────────────────────────────────────
const aparato = lerJson('aparato.json');
const problemas = [];
const falha = (m) => problemas.push(m);

const CRITERIO_DRILL = norm(aparato.exercicios.criterio_literal_prosa);
const itens = []; // ExercicioDaAula

// 1) Fonte: Ex·NN vinculados a aula.
for (let n = 1; n <= 9; n++) {
  const a = lerJson(`aula-0${n}.json`);
  (a.exercicios ?? []).forEach((ex, i) => {
    const referencia = ex.resposta_referencia_texto;
    if (!ex.enunciado_texto || !referencia) falha(`aula ${n}: ${ex.id} sem enunciado ou referência`);
    const linha = ex.origem?.linha_aprox ?? null;
    itens.push({
      id: ex.id,
      moduloId: MODULO_ID,
      aula: n,
      origem: 'fonte',
      tipo: 'aberto',
      enunciado: lit(ex.enunciado_texto),
      gabarito: null,
      referencia: lit(referencia),
      criterio: CRITERIO_DRILL,
      contaParaCriterioDoDrill: true,
      tolerancia: null,
      verificacao: 'autoavaliacao',
      fonte: { arquivo: arquivoDaAula(n), campo: `exercicios[${i}].enunciado_texto`, linha },
      evidencias: [
        { arquivo: arquivoDaAula(n), campo: `exercicios[${i}].enunciado_texto`, linha, trecho: lit(ex.enunciado_texto) },
        { arquivo: arquivoDaAula(n), campo: `exercicios[${i}].resposta_referencia_texto`, linha, trecho: lit(referencia) },
      ],
      ...(ALERTAS[ex.id] ? { alertas: ALERTAS[ex.id] } : {}),
    });
  });
}

// 2) Derivados: acha cada trecho na aula; o caminho e a linha vêm da extração.
const contadorDerivado = {};
const indicePorAula = {};
for (const esp of ESPECIFICACOES) {
  const n = esp.aula;
  indicePorAula[n] ??= indiceDoTextoDaAula(n);
  const evidencias = esp.evidencias.map((t) => {
    const alvo = norm(t);
    // Prefere o nó cujo texto é exatamente o trecho (célula de tabela); senão o primeiro que o contém.
    const exatos = indicePorAula[n].filter((x) => norm(x.texto) === alvo);
    const acha = exatos[0] ?? indicePorAula[n].find((x) => norm(x.texto).includes(alvo));
    if (!acha) {
      falha(`aula ${n}: trecho não encontrado na extração: "${alvo.slice(0, 70)}…"`);
      return { arquivo: arquivoDaAula(n), campo: '?', linha: null, trecho: alvo };
    }
    return { arquivo: arquivoDaAula(n), campo: acha.caminho, linha: acha.linha, trecho: lit(alvo) };
  });
  contadorDerivado[n] = (contadorDerivado[n] ?? 0) + 1;
  const id = `m01-a0${n}-d${String(contadorDerivado[n]).padStart(2, '0')}`;
  const referencia = evidencias.map((e) => e.trecho).join(esp.sep ?? ' ');
  if (esp.tipo === 'escolha') {
    if (!Array.isArray(esp.alternativas) || esp.alternativas.length < 3 || esp.alternativas.length > 4)
      falha(`${id}: escolha com ${esp.alternativas?.length} alternativas`);
    if (!Number.isInteger(esp.correta) || esp.correta < 0 || esp.correta >= esp.alternativas.length)
      falha(`${id}: índice da correta inválido`);
  }
  itens.push({
    id,
    moduloId: MODULO_ID,
    aula: n,
    origem: 'derivado-da-aula',
    tipo: esp.tipo,
    enunciado: lit(esp.enunciado),
    ...(esp.tipo === 'escolha' ? { alternativas: esp.alternativas.map(lit) } : {}),
    gabarito: esp.tipo === 'escolha' ? esp.correta : null,
    referencia,
    contaParaCriterioDoDrill: false,
    tolerancia: null,
    verificacao: esp.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao',
    fonte: { arquivo: evidencias[0].arquivo, campo: evidencias[0].campo, linha: evidencias[0].linha },
    evidencias,
  });
}

// Ordem: por aula; fonte antes de derivado; ids estáveis.
itens.sort((x, y) => x.aula - y.aula || (x.origem === y.origem ? x.id.localeCompare(y.id) : x.origem === 'fonte' ? -1 : 1));

// 3) Exercício de síntese (Ex·08) — a fonte não o liga a aula.
const e8 = aparato.exercicios.soltos_P9[0];
const sintese = {
  id: e8.id,
  moduloId: MODULO_ID,
  aula: null,
  origem: 'fonte',
  tipo: 'aberto',
  enunciado: lit(e8.enunciado.texto),
  gabarito: null,
  referencia: lit(e8.gabarito.texto),
  criterio: CRITERIO_DRILL,
  contaParaCriterioDoDrill: true,
  tolerancia: null,
  verificacao: 'autoavaliacao',
  fonte: { arquivo: ARQUIVO_APARATO, campo: 'exercicios.soltos_P9[0].enunciado.texto', linha: e8.origem.linha_aprox },
  evidencias: [
    { arquivo: ARQUIVO_APARATO, campo: 'exercicios.soltos_P9[0].enunciado.texto', linha: e8.origem.linha_aprox, trecho: lit(e8.enunciado.texto) },
    { arquivo: ARQUIVO_APARATO, campo: 'exercicios.soltos_P9[0].gabarito.texto', linha: e8.origem.linha_aprox, trecho: lit(e8.gabarito.texto) },
  ],
};

// 4) A prova.
const av = aparato.avaliacao;
const criterio = lit(av.criterio_literal_prosa.texto);
const m = criterio.match(/(\d+) de (\d+)/);
if (!m) falha('critério da prova sem "N de M"');
const acertosMinimos = m ? Number(m[1]) : null;
const total = m ? Number(m[2]) : null;
if (total !== av.perguntas.length) falha(`critério diz ${total} questões, a extração tem ${av.perguntas.length}`);

const questoes = av.perguntas.map((p, i) => {
  if (p.alternativas.length !== 4) falha(`${p.id}: ${p.alternativas.length} alternativas`);
  const correta = p.gabarito.indice;
  if (p.alternativas[correta]?.texto !== p.gabarito.texto) falha(`${p.id}: gabarito não bate com a alternativa`);
  return {
    id: p.id,
    enunciado: lit(p.enunciado),
    alternativas: p.alternativas.map((x) => lit(x.texto)),
    correta,
    explicacao: lit(p.explicacao),
    ...(p.id === 'm01-quiz-q08'
      ? { alertas: ['A explicação cita faixas de fator de capacidade que a pendência QA-FCap-01 (P20) ainda não verificou. Literal da fonte.'] }
      : {}),
    fonte: { arquivo: ARQUIVO_APARATO, campo: `avaliacao.perguntas[${i}]`, linha: p.origem.linha_aprox },
  };
});

// Faixas: a fonte guarda o if/else do script; min/max saem do `minimo` literal de cada ramo.
const faixasFonte = av.faixas_de_placar_script.faixas;
const ordenadas = [...faixasFonte].sort((x, y) => y.minimo - x.minimo);
const faixas = ordenadas
  .map((f, i) => {
    const max = i === 0 ? total : ordenadas[i - 1].minimo - 1;
    const esperado = `${f.minimo}–${max}`;
    if (f.intervalo !== esperado) falha(`faixa ${f.minimo}: intervalo derivado ${esperado} ≠ declarado ${f.intervalo}`);
    return { min: f.minimo, max, mensagem: lit(f.mensagem) };
  })
  .sort((x, y) => x.min - y.min);
const cobertura = faixas.every((f, i) => (i === 0 ? f.min === 0 : f.min === faixas[i - 1].max + 1)) && faixas.at(-1).max === total;
if (!cobertura) falha('faixas não cobrem 0..total sem lacuna');

const prova = {
  moduloId: MODULO_ID,
  criterio,
  acertosMinimos,
  total,
  questoes,
  faixas,
  faixasFonte: {
    arquivo: ARQUIVO_APARATO,
    campo: 'avaliacao.faixas_de_placar_script.faixas',
    linha: av.faixas_de_placar_script.origem.linha_aprox,
  },
  criterioFonte: { arquivo: ARQUIVO_APARATO, campo: 'avaliacao.criterio_literal_prosa.texto', linha: av.criterio_literal_prosa.origem.linha_aprox },
};

// 5) Checklist final: afirmações de capacidade (não perguntas) — não viram exercício.
const ck = aparato.checklist_final;
const checklist = {
  moduloId: MODULO_ID,
  introducao: lit(ck.introducao.texto),
  itens: ck.itens.map((it, i) => ({
    id: it.id,
    texto: lit(it.texto),
    fonte: { arquivo: ARQUIVO_APARATO, campo: `checklist_final.itens[${i}].texto`, linha: it.origem.linha_aprox },
  })),
};
if (ck.itens.length !== ck.total_itens) falha(`checklist: ${ck.itens.length} itens ≠ total declarado ${ck.total_itens}`);

// ── Saída ───────────────────────────────────────────────────────────────────
const porAula = Object.fromEntries(
  Array.from({ length: 9 }, (_, i) => [i + 1, itens.filter((x) => x.aula === i + 1)]),
);
for (const [n, xs] of Object.entries(porAula)) if (xs.length < 2) falha(`aula ${n}: só ${xs.length} item(ns)`);

const cab = `// GERADO por tools/alexandria-dados/gerar-avaliacao.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m01 (aula-0N.json, aparato.json).
// Itens 'fonte' são literais da extração; itens 'derivado-da-aula' citam o trecho da
// própria aula que os responde (campo \`evidencias\`). Revisão do Founder pendente para
// os derivados: docs/alexandria-v3/avaliacao-m01.md.
// ${itens.length} itens por aula (${itens.filter((x) => x.origem === 'fonte').length} da fonte, ${itens.filter((x) => x.origem !== 'fonte').length} derivados) · ${questoes.length} questões na prova.
`;
const corpo = `${cab}
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from './avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = ${JSON.stringify(itens, null, 2)};

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = ${JSON.stringify([sintese], null, 2)};

export const PROVAS: ProvaDoModulo[] = ${JSON.stringify([prova], null, 2)};

export const CHECKLISTS: ChecklistDoModulo[] = ${JSON.stringify([checklist], null, 2)};
`;
fs.writeFileSync(SAIDA, corpo);

console.log('itens por aula (fonte/derivado):');
for (const [n, xs] of Object.entries(porAula)) {
  console.log(`  A0${n}: ${xs.length} = ${xs.filter((x) => x.origem === 'fonte').length} fonte + ${xs.filter((x) => x.origem !== 'fonte').length} derivado`);
}
console.log(`síntese (Ex·08, sem aula): 1 · prova: ${questoes.length} questões, ${faixas.length} faixas, critério ${acertosMinimos}/${total} · checklist: ${checklist.itens.length} itens`);
console.log(`troca P24 (GridAlpha → NIVAR): ${trocasP24} ocorrência(s)`);
console.log(`troca Q03 (Trava do War Room → trava operacional da NIVAR): ${trocasQ03} ocorrência(s)`);
console.log(`troca Q02 (A Rede Elétrica → nome do catálogo): ${trocasQ02} ocorrência(s)`);
if (problemas.length) {
  console.log('PROBLEMAS:');
  for (const p of problemas) console.log('  - ' + p);
  process.exitCode = 1;
} else {
  console.log('gerado: src/lib/alexandria/avaliacao.dados.ts');
}
