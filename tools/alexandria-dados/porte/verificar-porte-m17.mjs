// Verifica o porte do texto do Módulo 17 contra o HTML original. Mesmo método do
// M16 (verificar-porte-m16.mjs, de onde vem `verificarModulo`); aqui só as trocas
// editoriais do M17.
//
// Uso: node tools/alexandria-dados/porte/verificar-porte-m17.mjs [--aula 4] [--v]

import { verificarModulo } from './verificar-porte-m16.mjs';

// P24: GridAlpha → NIVAR (marca e nomes de produto no corpo das aulas).
export const EDITORIAIS_M17 = [
  [/GridAlpha/g, 'NIVAR', 'P24 (GridAlpha → NIVAR)'],
  // §00 e §MAP não são tela da aula v3 (o porte antigo já trocava assim nos três lugares)
  [/glosa do §00/g, 'glosa da abertura do módulo', 'remissão ao §00/§MAP → abertura/mapa do módulo'],
  [/declarada no §MAP/g, 'declarada no mapa do módulo', 'remissão ao §00/§MAP → abertura/mapa do módulo'],
  [/a §MAP mostrou/g, 'o mapa do módulo mostrou', 'remissão ao §00/§MAP → abertura/mapa do módulo'],
];

const argv = process.argv.slice(2);
const soAula = argv.includes('--aula') ? Number(argv[argv.indexOf('--aula') + 1]) : null;
process.exit(await verificarModulo({ n: 17, editoriais: EDITORIAIS_M17, soAula, verboso: argv.includes('--v') }));
