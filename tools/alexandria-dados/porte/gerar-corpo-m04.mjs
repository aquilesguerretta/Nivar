// Gera MODULO_04_LEAD e MODULO_04_CORPO em src/lib/data/alexandria-modulo-04-content.ts
// a partir do HTML original (ver fonte-html-m04-m05.mjs). Só esses dois objetos são
// reescritos; o resto do arquivo (instrumentos, aulas, exercícios) fica como está.
// Uso: node tools/alexandria-dados/porte/gerar-corpo-m04.mjs [--seco]
import { gerarCorpo } from './gerar-corpo-m04-m05.mjs';
gerarCorpo(4, process.argv.includes('--seco'));
