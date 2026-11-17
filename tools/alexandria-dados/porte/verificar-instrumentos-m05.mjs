// Confere as 6 calculadoras do M05 (src/lib/data/calculadoras/m05.ts) contra o script
// original da fonte executado no mini-dom. Método em verificar-instrumentos-m04-m05.mjs.
// Uso: node tools/alexandria-dados/porte/verificar-instrumentos-m05.mjs
import { verificarInstrumentos } from './verificar-instrumentos-m04-m05.mjs';
import { decimalUnico } from '../../../src/lib/data/calculadoras/m05.ts';

// Campo: o <input type="range"> da fonte (o id que o script lê), com o evento 'input'.
// No INST·04, os 8 sinais são caixas de marcar criadas pelo script dentro de #i4-sigs.
// Saídas numéricas por valor; TODOS os 24 readouts (inclusive os 4 textuais) por texto,
// contra `textos`. Veredito: igualdade de texto, depois da correção Q07 declarada
// (`decimalUnico`: "8.3%" → "8,3%") aplicada ao lado da fonte.
const c = (id) => ({ fonte: id, produto: id, evento: 'input' });
const s = (id, escala = 1) => ({ fonte: id, produto: id, escala });
const sinal = (k) => ({ tipo: 'checkbox', produto: `i4-s${k}`, seletor: (m) => m.doc.querySelectorAll('#i4-sigs input')[k] });
const comum = { normalizarVeredito: decimalUnico };

const ESPECS = [
  { ...comum, id: 'm05-inst-01', campos: ['i1-q', 'i1-f', 'i1-c', 'i1-n'].map(c), saidas: [s('i1-cm'), s('i1-c1'), s('i1-w'), s('i1-tf', 1e6)], textos: ['i1-cm', 'i1-c1', 'i1-w', 'i1-tf'], veredito: 'i1-vd', G: 7, sentinelas: { zero: 0 } },
  { ...comum, id: 'm05-inst-02', campos: ['i2-g', 'i2-c', 'i2-f'].map(c), saidas: [s('i2-r'), s('i2-k'), s('i2-t')], textos: ['i2-r', 'i2-k', 'i2-t', 'i2-b'], veredito: 'i2-vd', G: 11 },
  { ...comum, id: 'm05-inst-03', campos: ['i3-l', 'i3-c', 'i3-p', 'i3-v'].map(c), saidas: [s('i3-e'), s('i3-w'), s('i3-a'), s('i3-d')], textos: ['i3-e', 'i3-w', 'i3-a', 'i3-d'], veredito: 'i3-vd', G: 7 },
  { ...comum, id: 'm05-inst-04', campos: [c('i4-m'), ...[0, 1, 2, 3, 4, 5, 6, 7].map(sinal)], saidas: [s('i4-n'), s('i4-o'), s('i4-e', 1e6)], textos: ['i4-n', 'i4-o', 'i4-e', 'i4-r'], veredito: 'i4-vd', G: 5 },
  { ...comum, id: 'm05-inst-05', campos: ['i5-b', 'i5-w', 'i5-o', 'i5-d', 'i5-e', 'i5-x'].map(c), saidas: [s('i5-p', 1e6), s('i5-c'), s('i5-s', 1e6), s('i5-f', 1e6)], textos: ['i5-p', 'i5-c', 'i5-s', 'i5-f'], veredito: 'i5-vd', G: 4 },
  { ...comum, id: 'm05-inst-06', campos: ['i6-x', 'i6-y', 'i6-h'].map(c), saidas: [s('i6-co'), s('i6-d')], textos: ['i6-q', 'i6-co', 'i6-d', 'i6-r'], veredito: 'i6-vd', G: 11 },
];

process.exit(await verificarInstrumentos(5, ESPECS, 'src/lib/data/calculadoras/m05.ts'));
