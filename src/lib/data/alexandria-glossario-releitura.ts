// alexandria-glossario-releitura.ts — a releitura dos termos com números
// diferentes entre os módulos (decisão de 15/11/2026, seção Glossário, item 4).
//
// Sete entradas do glossário geral têm, em mais de um módulo, definições que
// citam números diferentes: Grupo A, Grupo B, ONS, Fator de capacidade, GSF,
// ANEEL, EPE. Cada uma foi relida definição por definição em 15/11/2026; o
// registro completo está em docs/alexandria-v3/glossario.md.
//
// Regra: contradição real é registrada e mostrada lado a lado, com o rótulo do
// módulo, e nunca resolvida por plausibilidade. Os `trechos` abaixo são cópia
// literal da definição de cada módulo — o verificador confere que cada um está,
// letra por letra, na definição de onde diz vir.
//
// Resultado: seis concordam (um módulo acrescenta detalhe que o outro omite) e
// uma diverge — as faixas típicas do fator de capacidade no M01 e no M03.

export interface LeituraDivergente {
  /** id do verbete ('gl-fator-de-capacidade-fc'). */
  verbete: string;
  codigo: string; // 'M01'
  /** Trecho literal da definição. */
  trecho: string;
}

export interface Releitura {
  /** Chave da entrada do glossário geral (termo sem caixa, acento e parêntese). */
  chave: string;
  data: string;
  veredito: 'concordam' | 'divergem';
  /** O que diverge, quando diverge: um rótulo nosso e os trechos literais. */
  divergencias: { assunto: string; leituras: LeituraDivergente[] }[];
}

export const RELEITURAS: readonly Releitura[] = [
  { chave: 'grupo a', data: '2026-11-15', veredito: 'concordam', divergencias: [] },
  { chave: 'grupo b', data: '2026-11-15', veredito: 'concordam', divergencias: [] },
  { chave: 'ons', data: '2026-11-15', veredito: 'concordam', divergencias: [] },
  { chave: 'gsf', data: '2026-11-15', veredito: 'concordam', divergencias: [] },
  { chave: 'aneel', data: '2026-11-15', veredito: 'concordam', divergencias: [] },
  { chave: 'epe', data: '2026-11-15', veredito: 'concordam', divergencias: [] },
  {
    chave: 'fator de capacidade',
    data: '2026-11-15',
    veredito: 'divergem',
    divergencias: [
      {
        assunto: 'Nuclear',
        leituras: [
          { verbete: 'gl-fator-de-capacidade-fc', codigo: 'M01', trecho: 'nuclear 85–95%' },
          { verbete: 'gl-m03-fator-de-capacidade', codigo: 'M03', trecho: '85–90% nuclear' },
        ],
      },
      {
        assunto: 'Hidrelétrica',
        leituras: [
          { verbete: 'gl-fator-de-capacidade-fc', codigo: 'M01', trecho: 'hidro BR ~50%' },
          { verbete: 'gl-m03-fator-de-capacidade', codigo: 'M03', trecho: '~50–55% hidro' },
        ],
      },
    ],
  },
];
