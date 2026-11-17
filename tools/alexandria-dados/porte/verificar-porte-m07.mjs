// Verifica o porte do Módulo 07 contra o HTML original (ver verificar-porte-m06-m08.mjs).
// Uso: node tools/alexandria-dados/porte/verificar-porte-m07.mjs
import { verificar } from './verificar-porte-m06-m08.mjs';

// Faltas que não cabem no tipo do produto. Chave = prefixo do id da falta; valor = razão, impressa.
const FALTAS_EXPLICADAS = {};

process.exit(
  await verificar({
    n: 7,
    faltasExplicadas: FALTAS_EXPLICADAS,
    instrumentosDoModulo: (mod) => mod.MODULO_07_INSTRUMENTOS?.some((i) => i.id === 'm07-inst-01'),
    // Inst · 01 do §MAP: na Aula 01 (regra de colocação de 15/11).
    mapa: { aula: 1, id: 'm07-inst-01' },
  }),
);
