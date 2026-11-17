// previsoes.ts — onde o instrumento entra na leitura, o que o aluno prevê
// antes de ver o cálculo, e o que fica velado até a previsão.
//
// NADA AQUI É FATO NOVO. Cada previsão é derivada do instrumento da fonte
// (`INSTRUMENTOS_MODULO_01`) como manda o C3: o cenário é o padrão do
// instrumento ou o da nota dele, a grandeza prevista é uma saída da própria
// calculadora (`INSTRUMENT_CALCULATORS`), e a pergunta só junta rótulo,
// valor e unidade que a fonte já escreve. O calculado é sempre a calculadora
// rodando sobre o cenário — nunca um número digitado aqui.
//
// O VÉU. "Nada que entregue a resposta fica visível antes do registro." Isso
// inclui a prosa: na A08, o parágrafo 8.2 escreve "o FC foi de 25,1%", que é
// exatamente o calculado. `velar` lista trechos literais; o bloco da leitura
// que contém um deles NÃO É RENDERIZADO até a previsão (não é blur nem
// display:none — o texto não está no DOM). A nota do instrumento, que em
// três deles é a interpretação do cenário padrão, também fica velada.
//
// Os quatro diagramas liberados pelas decisões de 15/11/2026 foram conferidos
// contra esta regra: D-A06-2 (fases) e D-A09-2 (fenômenos) estão em aulas sem
// instrumento; D-A07-3 desenha o FP 0,85 da prosa 7.3 e a referência 0,92, não
// o cenário 800 kW / 480 kVAr do INST·05; D-A08-2 desenha as faixas da figura
// da aula e não marca o 25,1% do INST·06. Nenhum entra em `velarFiguras`.
//
// A ÂNCORA. O instrumento entra no ponto da prosa que o invoca (C5): depois
// do bloco que diz "Pratique abaixo" / "Use a calculadora abaixo" / "Veja:",
// ou, quando a prosa não o invoca, no fim da seção que ensina a relação que
// ele calcula.

import type { EntradaInstrumento } from '@/lib/data/alexandria-instrument-calculators';
import { MODULOS_V3 } from '@/lib/alexandria/modulos-v3';

export type GrandezaPrevista =
  | {
      /** Previsão numérica de UMA saída da calculadora. */
      tipo: 'numero';
      saida: string;
      unidade: string | null;
      casas: number;
    }
  | {
      /** Previsão por escolha entre opções (explorador, quebra-cabeça, seleção).
       *  O calculado é a saída `saida` da calculadora no cenário — `textos[saida]`
       *  ou `valores[saida]` — casado com o `valor` (ou o `rotulo`) de uma opção. */
      tipo: 'escolha';
      saida: string;
      opcoes: { valor: string; rotulo: string }[];
    }
  | {
      /** Previsão por escolha entre dois cenários da nota. */
      tipo: 'comparacao';
      saida: string;
      unidade: string;
      cenarioB: Record<string, EntradaInstrumento>;
      rotuloA: string;
      rotuloB: string;
    };

export interface PrevisaoDoInstrumento {
  instrumentoId: string;
  /** Índice do bloco da leitura DEPOIS do qual o instrumento entra. */
  depoisDoBloco: number;
  /** Cenário em que o aluno prevê (e em que o calculado é calculado). */
  cenario: Record<string, EntradaInstrumento>;
  /** Pergunta, montada com rótulo, valor e unidade da fonte. */
  pergunta: string;
  grandeza: GrandezaPrevista;
  /** Trechos literais da leitura que entregam o calculado. */
  velar: string[];
  /** Figuras de `figuras.ts` que desenham o cenário resolvido (o diagrama
   *  escreve o calculado no SVG) — ficam fora do DOM até a previsão. */
  velarFiguras: string[];
  /** A nota do instrumento interpreta o cenário — fica velada. */
  velarNota: boolean;
  /** De onde vem o cenário. */
  origemDoCenario: string;
  /** Exercício cujo enunciado É este cenário: o calculado é a resposta dele,
   *  então só abre depois da tentativa lá (alerta de `avaliacao.ts`). */
  abreDepoisDoExercicio?: string;
}

const M01: PrevisaoDoInstrumento[] = [
  {
    // A01 · 1.4 termina em "Pratique abaixo." (bloco 13). O cenário padrão
    // (10 kW × 5 h) está resolvido no próprio bloco 13; a nota do INST·01
    // propõe outra comparação, e é ela que vira a previsão.
    instrumentoId: 'inst-01',
    depoisDoBloco: 13,
    cenario: { 'i01-kw': 50, 'i01-h': 1 },
    pergunta: 'Uma instalação usa 50 kW durante 1 h. Outra usa 1 kW durante 50 h. Qual consome mais energia?',
    grandeza: {
      tipo: 'comparacao',
      saida: 'i01-out',
      unidade: 'kWh',
      cenarioB: { 'i01-kw': 1, 'i01-h': 50 },
      rotuloA: '50 kW × 1 h',
      rotuloB: '1 kW × 50 h',
    },
    velar: [],
    velarFiguras: ['m01-a01-energia-potencia-tempo'],
    velarNota: true,
    origemDoCenario: 'nota do instrumento 01',
  },
  {
    // A02 · a Lei de Ohm é a seção 2.4 (blocos 9–12). O INST·02 começa vazio
    // na fonte; o cenário (220 V, 10 A) é o da nota dele.
    instrumentoId: 'inst-02',
    depoisDoBloco: 12,
    cenario: { 'i02-v': 220, 'i02-i': 10 },
    pergunta: 'Um circuito tem 220 V de tensão e 10 A de corrente. Qual é a resistência?',
    grandeza: { tipo: 'numero', saida: 'i02-r', unidade: 'Ω', casas: 1 },
    velar: [],
    velarFiguras: [],
    velarNota: false,
    origemDoCenario: 'nota do instrumento 02',
  },
  {
    // A04 · 4.1 termina em "Veja:" (bloco 3). O bloco 3 já diz que dobrar a
    // corrente quadruplica a perda; por isso a previsão é o valor absoluto
    // da perda no cenário padrão, que a prosa não dá.
    instrumentoId: 'inst-03',
    depoisDoBloco: 3,
    cenario: { 'i03-i': 100, 'i03-r': 0.5 },
    pergunta: 'Uma corrente de 100 A atravessa um condutor de 0,5 Ω. Quanta potência vira calor?',
    grandeza: { tipo: 'numero', saida: 'i03-out', unidade: 'W', casas: 0 },
    velar: [],
    velarFiguras: ['m01-a04-perdas-i2r'],
    velarNota: false,
    origemDoCenario: 'valores padrão do instrumento 03',
  },
  {
    // A05 · fim de 5.3 (bloco 11), antes da tabela de leitura do fator de
    // carga. A nota do INST·04 é a interpretação do cenário padrão.
    instrumentoId: 'inst-04',
    depoisDoBloco: 11,
    cenario: { 'i04-kwh': 144000, 'i04-h': 720, 'i04-pmax': 800 },
    pergunta:
      'Uma unidade consome 144.000 kWh num mês de 720 h, e a demanda máxima medida foi 800 kW. Qual é o fator de carga?',
    grandeza: { tipo: 'numero', saida: 'i04-fcp', unidade: '%', casas: 0 },
    velar: [],
    velarFiguras: ['m01-a05-demanda-maxima-media', 'm01-a05-faixas-fator-de-carga'],
    velarNota: true,
    origemDoCenario: 'valores padrão do instrumento 04',
    // avaliacao.ts, m01-ex-04: "O INST·04 não pode abrir nesse cenário antes
    // da tentativa deste exercício." A previsão é registrada aqui; o
    // calculado, os controles e a nota esperam a tentativa do Ex·04.
    abreDepoisDoExercicio: 'm01-ex-04',
  },
  {
    // A07 · 7.2 "As três potências formam um triângulo retângulo:" (bloco 5).
    instrumentoId: 'inst-05',
    depoisDoBloco: 5,
    cenario: { 'i05-kw': 800, 'i05-kvar': 480 },
    pergunta: 'Uma instalação tem 800 kW de potência ativa e 480 kVAr de potência reativa. Qual é o fator de potência?',
    grandeza: { tipo: 'numero', saida: 'tri-fp', unidade: null, casas: 2 },
    velar: [],
    velarFiguras: ['m01-a07-fase-corrente', 'm01-a07-triangulo-de-potencia'],
    velarNota: false,
    origemDoCenario: 'valores padrão do instrumento 05',
  },
  {
    // A08 · 8.2 "Use a calculadora abaixo:" (bloco 5) — e o mesmo bloco
    // escreve "o FC foi de 25,1%", o calculado. O bloco fica velado.
    instrumentoId: 'inst-06',
    depoisDoBloco: 5,
    cenario: { 'i06-cap': 100, 'i06-gen': 220000, 'i06-h': 8760 },
    pergunta: 'Uma usina de 100 MW gerou 220.000 MWh em um ano de 8.760 h. Qual foi o fator de capacidade?',
    grandeza: { tipo: 'numero', saida: 'i06-fc', unidade: '%', casas: 1 },
    velar: ['25,1%'],
    velarFiguras: ['m01-a08-capacidade-geracao-exemplo'],
    velarNota: true,
    origemDoCenario: 'valores padrão do instrumento 06',
  },
];

const POR_INSTRUMENTO = new Map(
  [...M01, ...MODULOS_V3.flatMap((m) => m.previsoes)].map((p) => [p.instrumentoId, p]),
);

export function previsaoDoInstrumento(instrumentoId: string): PrevisaoDoInstrumento | null {
  return POR_INSTRUMENTO.get(instrumentoId) ?? null;
}
