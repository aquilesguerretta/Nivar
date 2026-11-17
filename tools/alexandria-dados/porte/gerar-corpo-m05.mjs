// Gera MODULO_05_LEAD e MODULO_05_CORPO em src/lib/data/alexandria-modulo-05-content.ts
// a partir do HTML original (ver fonte-html-m04-m05.mjs). Só esses dois objetos são
// reescritos; o resto do arquivo (instrumentos, aulas, exercícios) fica como está.
// Uso: node tools/alexandria-dados/porte/gerar-corpo-m05.mjs [--seco]
import { gerarCorpo } from './gerar-corpo-m04-m05.mjs';
gerarCorpo(5, process.argv.includes('--seco'));
