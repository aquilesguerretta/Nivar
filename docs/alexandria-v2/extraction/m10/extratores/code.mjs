// Importa (só leitura) os módulos de dados do repositório.
import { register } from 'node:module';
register(new URL('./ts-loader.mjs', import.meta.url));
const B = 'file:///C:/dev/gridalpha-v2-alexandria-v2-restructure/src/lib/data/';
export const C10 = await import(B + 'alexandria-modulo-10-content.ts');
export const CALC = (await import(B + 'alexandria-instrument-calculators.ts')).INSTRUMENT_CALCULATORS;
export const GLO = await import(B + 'alexandria-glossario.ts');
export const BLOCKS = await import(B + 'alexandria-blocks.ts');
