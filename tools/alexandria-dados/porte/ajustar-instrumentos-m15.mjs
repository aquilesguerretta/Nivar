// Ajusta os instrumentos do M15 em src/lib/data/alexandria-modulo-15-content.ts para o modelo v3.
// Idempotente: rodar de novo não duplica nada.
//
//   1. D04: o INST·01 (§MAP) existe em MODULO_15_INSTRUMENTOS, mas nenhuma aula o montava. Pela
//      regra de colocação (PORTE-POR-MODULO.md), entra na Aula 01 com o rótulo "§MAP", depois do
//      INST·02 (que é o da prosa da aula). MODULO_15_INSTRUMENTOS passa para antes de
//      MODULO_15_AULAS, que o referencia (const não tem hoisting).
//   2. A nota de procedência de cada instrumento (`p.disc` da fonte = `fonte_dos_numeros` da
//      extração), que o porte antigo não carregou, entra no fim da nota, depois da introdução.
//   3. Rótulo com entidade HTML crua (INST·09 "O&amp;M variável e encargos"): a tela mostra o
//      rótulo como texto, então a entidade vira o caractere.
//
// Uso: node tools/alexandria-dados/porte/ajustar-instrumentos-m15.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARQ = path.join(RAIZ, 'src/lib/data/alexandria-modulo-15-content.ts');
const EXT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m15/instrumentos.json'), 'utf8'));
const cru = fs.readFileSync(ARQ, 'utf8');
const crlf = cru.includes('\r\n');
let ts = cru.replace(/\r\n/g, '\n');
const log = [];

// 1a · MODULO_15_INSTRUMENTOS antes de MODULO_15_AULAS
{
  const ini = ts.indexOf('export const MODULO_15_INSTRUMENTOS');
  const aulas = ts.indexOf('export const MODULO_15_AULAS');
  if (ini < 0 || aulas < 0) throw new Error('declarações não encontradas');
  if (ini > aulas) {
    const fim = ts.indexOf('\n];\n', ini) + 4;
    const bloco = ts.slice(ini, fim);
    ts = ts.slice(0, ini) + ts.slice(fim);
    const a2 = ts.indexOf('export const MODULO_15_AULAS');
    ts = ts.slice(0, a2) + bloco + '\n' + ts.slice(a2);
    log.push('MODULO_15_INSTRUMENTOS movido para antes de MODULO_15_AULAS');
  }
}
// 1b · rótulo "§MAP" no INST·01, com a supressão do auditor justificada
{
  const re = /\n( *)title: "Mapa da cadeia · quatro reagrupamentos",/;
  if (re.test(ts)) {
    ts = ts.replace(re, '\n$1// gridalpha-detect-disable-next-line alexandria-no-internal-vocabulary — rótulo "§MAP" do instrumento do mapa do módulo, pedido pela regra de colocação (PORTE-POR-MODULO.md, 15/11)\n$1title: "§MAP · Mapa da cadeia · quatro reagrupamentos",');
    log.push('INST·01: rótulo §MAP');
  }
}
// 1c · INST·01 na Aula 01, depois dos instrumentos que ela já monta
{
  const ref = "MODULO_15_INSTRUMENTOS.find((x) => x.id === 'm15-inst-01')!";
  if (!ts.includes(ref)) {
    const p = ts.search(/id: ['"]aula-15-01['"]/);
    const q = ts.indexOf('instruments: [', p);
    let k = q + 'instruments: ['.length, prof = 1;
    while (prof > 0) { const c = ts[k++]; if (c === '[') prof++; else if (c === ']') prof--; }
    const fecha = k - 1; // posição do ']' que fecha instruments
    const antes = ts.slice(0, fecha).replace(/\s*$/, '');
    ts = `${antes}${antes.endsWith(',') ? '' : ','}\n      ${ref},\n    ${ts.slice(fecha)}`;
    log.push('INST·01 montado na Aula 01');
  }
}
// 2 · nota de procedência (p.disc) no fim da nota
for (const i of EXT.instrumentos) {
  const disc = i.fonte_dos_numeros?.html;
  if (!disc) continue;
  const extra = disc.replace(/GridAlpha/g, 'NIVAR').replace(/\s+/g, ' ').trim();
  const p = ts.search(new RegExp(`id: ['"]${i.id}['"]`));
  if (p < 0) throw new Error(`${i.id} não está no arquivo`);
  const nIni = ts.indexOf('note: "', p);
  const nFim = ts.indexOf('",\n', nIni);
  const atual = JSON.parse(ts.slice(nIni + 'note: '.length, nFim + 1));
  if (atual.includes(extra.slice(0, 60))) continue;
  ts = ts.slice(0, nIni) + `note: ${JSON.stringify(`${atual}<br><br>${extra}`)}` + ts.slice(nFim + 1);
  log.push(`${i.id}: nota de procedência (p.disc) acrescentada`);
}
// 2b · readout da fonte sem saída no instrumento (INST·09 `ac-po`, a posição contra o CMO)
for (const i of EXT.instrumentos) {
  for (const o of i.saidas ?? []) {
    const p = ts.search(new RegExp(`id: ['"]${i.id}['"]`));
    const oIni = ts.indexOf('outputs: [', p);
    const oFim = ts.indexOf('\n      ],', oIni);
    if (ts.slice(oIni, oFim).includes(`"${o.id}"`)) continue;
    const linha = `\n        { id: ${JSON.stringify(o.id)}, label: ${JSON.stringify(o.rotulo.replace(/&amp;/g, '&'))}, unit: null },`;
    ts = ts.slice(0, oFim) + linha + ts.slice(oFim);
    log.push(`${i.id}: saída ${o.id} ("${o.rotulo}") acrescentada`);
  }
}
// 3 · entidade crua em rótulo
{
  const n = (ts.match(/label: "[^"]*&amp;[^"]*"/g) || []).length;
  ts = ts.replace(/(label: "[^"]*)&amp;([^"]*")/g, '$1&$2');
  if (n) log.push(`${n} rótulo(s) com &amp; → &`);
}

fs.writeFileSync(ARQ, crlf ? ts.replace(/\n/g, '\r\n') : ts);
console.log(log.length ? log.join('\n') : 'nada a ajustar');
