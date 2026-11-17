// Confere as 7 calculadoras do M04 (src/lib/data/calculadoras/m04.ts) contra o script
// original da fonte executado no mini-dom. Método em verificar-instrumentos-m04-m05.mjs.
// Uso: node tools/alexandria-dados/porte/verificar-instrumentos-m04.mjs
import { verificarInstrumentos } from './verificar-instrumentos-m04-m05.mjs';
import { decimalUnico } from '../../../src/lib/data/calculadoras/m04.ts';

// Campo: `fonte` é o <input type="number"> (`-n`), que o script escuta em `change`
// e espelha no range. Saídas numéricas por valor; TODOS os readouts (inclusive os 6 textuais)
// por texto, contra `textos` da calculadora. Veredito: igualdade de texto, depois da correção
// Q07 declarada (`decimalUnico`: "2.3%" → "2,3%") aplicada ao lado da fonte.
const c = (id) => ({ fonte: `${id}-n`, produto: `${id}-n` });
const s = (id, escala = 1) => ({ fonte: id, produto: id, escala });
const comum = { normalizarVeredito: decimalUnico };

const ESPECS = [
  { ...comum, id: 'm04-inst-01', campos: ['i1-d', 'i1-r', 'i1-h', 'i1-g'].map(c), saidas: [s('i1-p'), s('i1-def')], textos: ['i1-p', 'i1-m', 'i1-def', 'i1-lim'], veredito: 'i1-vd', G: 6 },
  { ...comum, id: 'm04-inst-02', campos: ['i2-e', 'i2-a', 'i2-c'].map(c), saidas: [s('i2-p'), s('i2-max'), s('i2-x', 1e3)], textos: ['i2-p', 'i2-mes', 'i2-max', 'i2-x'], veredito: 'i2-vd', G: 8 },
  { ...comum, id: 'm04-inst-03', campos: ['i3-p', 'i3-h', 'i3-m', 'i3-f'].map(c), saidas: [s('i3-r', 1e6), s('i3-c', 1e6), s('i3-g', 1e6), s('i3-k')], textos: ['i3-r', 'i3-c', 'i3-g', 'i3-k'], veredito: 'i3-vd', G: 6, sentinelas: { zero: 0, 'não precisa': 0 } },
  { ...comum, id: 'm04-inst-04', campos: ['i4-d', 'i4-t'].map(c), saidas: [s('i4-q'), s('i4-c'), s('i4-m'), s('i4-f')], textos: ['i4-q', 'i4-c', 'i4-m', 'i4-f'], veredito: 'i4-vd', G: 30, sentinelas: { '—': null } },
  { ...comum, id: 'm04-inst-05', campos: ['i5-c', 'i5-p', 'i5-l', 'i5-s'].map(c), saidas: [s('i5-a', 1e6), s('i5-r', 1e3)], textos: ['i5-a', 'i5-lo', 'i5-w', 'i5-r'], veredito: 'i5-vd', G: 6 },
  { ...comum, id: 'm04-inst-06', campos: ['i6-f', 'i6-p', 'i6-v'].map(c), saidas: [s('i6-r', 1e3), s('i6-a', 1e6), s('i6-b', 1e6), s('i6-u')], textos: ['i6-r', 'i6-a', 'i6-b', 'i6-u'], veredito: 'i6-vd', G: 10 },
  { ...comum, id: 'm04-inst-07', campos: ['i7-a', 'i7-b', 'i7-c', 'i7-s'].map(c), saidas: [s('i7-e'), s('i7-m', 1e6), s('i7-r', 1e3)], textos: ['i7-e', 'i7-m', 'i7-w', 'i7-r'], veredito: 'i7-vd', G: 6 },
];

process.exit(await verificarInstrumentos(4, ESPECS, 'src/lib/data/calculadoras/m04.ts'));
