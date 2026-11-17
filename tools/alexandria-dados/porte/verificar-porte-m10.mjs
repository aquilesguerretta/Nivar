// Verifica o porte v3 do Módulo 10 contra o HTML original. Ver porte-m09-m11-comum.mjs.
// Uso: node tools/alexandria-dados/porte/verificar-porte-m10.mjs
import { verificar } from './porte-m09-m11-comum.mjs';

// Trocas editoriais decididas, aplicadas à FONTE antes de comparar.
const TROCAS = [
  [/GridAlpha/g, 'NIVAR', 'Q03/P24 GridAlpha → NIVAR'],
];

// Faltas declaradas: unidade da fonte que, por decisão registrada, não vai ao .ts.
const EXPLICADAS = {};

process.exit(await verificar({ n: 10, trocas: TROCAS, explicadas: EXPLICADAS }));
