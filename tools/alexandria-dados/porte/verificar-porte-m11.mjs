// Verifica o porte v3 do Módulo 11 contra o HTML original. Ver porte-m09-m11-comum.mjs.
// Uso: node tools/alexandria-dados/porte/verificar-porte-m11.mjs
import { verificar } from './porte-m09-m11-comum.mjs';

// Trocas editoriais decididas, aplicadas à FONTE antes de comparar.
const TROCAS = [
  [/GridAlpha/g, 'NIVAR', 'Q03/P24 GridAlpha → NIVAR'],
  // D13 (Q04: o markup vence; a prosa fica sem o número). O INST·11 marca 2 pontos de
  // sincronização (`sinc:true` nos passos 04 e 08); a prosa da Aula 08 dizia três.
  [/com sincronização em três pontos\./g, 'com sincronização.', 'D13 lede da A08 sem o número'],
  [/em paralelo, três pontos de sincronização\./g, 'em paralelo, pontos de sincronização.', 'D13 08.3 sem o número'],
];

// Faltas declaradas: unidade da fonte que, por decisão registrada, não vai ao .ts.
const EXPLICADAS = {};

process.exit(await verificar({ n: 11, trocas: TROCAS, explicadas: EXPLICADAS }));
