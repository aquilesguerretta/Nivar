// Verifica o porte do Módulo 04 contra o HTML original (o corpo das aulas não está na
// extração verificada). Método em verificar-porte-m04-m05.mjs.
// Uso: node tools/alexandria-dados/porte/verificar-porte-m04.mjs [--aula N]
import { verificarPorte } from './verificar-porte-m04-m05.mjs';

const argv = process.argv.slice(2);
const so = argv.includes('--aula') ? Number(argv[argv.indexOf('--aula') + 1]) : null;

// Diferenças que não cabem no contrato atual, com a razão impressa na saída.
// As 6 saídas textuais da fonte não têm unidade separada: o texto que a calculadora devolve
// em `textos` (verbatim da fonte) é o que a tela mostra.
const TEXTUAL = 'saída textual da fonte: a unidade vai no próprio texto (`textos` da calculadora, verbatim).';
const FALTAS_EXPLICADAS = Object.fromEntries(['i1-m', 'i1-lim', 'i2-mes', 'i5-lo', 'i5-w', 'i7-w'].map((id) => [`unidade:${id}`, TEXTUAL]));

process.exit(await verificarPorte(4, { faltasExplicadas: FALTAS_EXPLICADAS, so }));
