// Verificação do porte do texto do M03. Núcleo e método: verificar-porte-m02-m03.mjs.
// Uso: node tools/alexandria-dados/porte/verificar-porte-m03.mjs
import { verificar } from './verificar-porte-m02-m03.mjs';

// Faltas que não cabem no produto, com a razão impressa na saída.
const FALTAS_EXPLICADAS = {};

process.exit(await verificar(3, { faltasExplicadas: FALTAS_EXPLICADAS }));
