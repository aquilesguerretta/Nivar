// Verifica o porte v3 do Módulo 09 contra o HTML original. Ver porte-m09-m11-comum.mjs.
// Uso: node tools/alexandria-dados/porte/verificar-porte-m09.mjs
import { verificar } from './porte-m09-m11-comum.mjs';

// Trocas editoriais decididas, aplicadas à FONTE antes de comparar.
const TROCAS = [
  [/GridAlpha/g, 'NIVAR', 'Q03/P24 GridAlpha → NIVAR'],
  // O produto não numera as seções de aparato (§00 é a abertura do módulo na tela);
  // a troca já estava no porte antigo e fica registrada aqui (Q03, vocabulário interno).
  [/do §00/g, 'da abertura do módulo', 'Q03 §00 → abertura do módulo'],
];

// Faltas declaradas: unidade da fonte que, por decisão registrada, não vai ao .ts.
const EXPLICADAS = {};

process.exit(await verificar({ n: 9, trocas: TROCAS, explicadas: EXPLICADAS }));
