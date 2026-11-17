// gerar-instrumentos-m10.mjs — reescreve `INSTRUMENTOS_MODULO_10` em
// src/lib/data/alexandria-modulo-10-content.ts a partir da extração verificada
// (docs/alexandria-v2/extraction/m10/instrumentos.json): título, nota = intro + aviso
// (HTML da fonte, com o <b> que o porte antigo perdia), rótulos, unidades, faixas,
// padrões e saídas literais. A lógica está em src/lib/data/calculadoras/m10.ts.
//
// Grades de chips viram `select`; onde a fonte começa sem seleção, o padrão é '' (opção
// "—"). O segundo clique da grade do INST·08 e do INST·10 (marcar verificada /
// executado) vira um campo por etapa, com as palavras da fonte.
//
// Uso: node tools/alexandria-dados/porte/gerar-instrumentos-m10.mjs

import fs from 'node:fs';
import path from 'node:path';
import { RAIZ } from './porte-m09-m11-comum.mjs';

const EXT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m10/instrumentos.json'), 'utf8'));
const ARQ = path.join(RAIZ, 'src/lib/data/alexandria-modulo-10-content.ts');
const KIND = { '01': 'explorador', '02': 'comparador', '03': 'dimensionador', '04': 'simulador', '05': 'simulador', '06': 'simulador', '07': 'explorador', '08': 'quebra-cabeca', '09': 'comparador', '10': 'quebra-cabeca', '11': 'quebra-cabeca' };
// id do campo no produto (mantém os ids do porte antigo, que as previsões e os eventos usam)
const CAMPO = { 'mf-grid': 'mf-linha', 'en-grid': 'en-sel', 'rc-grid': 'rc-sel', 'ol-grid': 'ol-sel' };
// grade sem rótulo na fonte: a palavra que a fonte escreve em cada chip
const ROTULO_GRADE = { 'rc-grid': 'Etapa', 'ol-grid': 'Passo' };

const J = (v) => JSON.stringify(v);
const linhas = [];
for (const x of EXT.instrumentos) {
  const n = x.id.slice(-2);
  const campos = [];
  for (const e of x.entradas) {
    const id = CAMPO[e.dom_id] ?? e.dom_id;
    if (e.opcoes?.length) {
      const semSelecao = e.padrao === null || e.padrao === undefined;
      const opts = [...(semSelecao ? [{ value: '', label: '—' }] : []), ...e.opcoes.map((o) => ({ value: o.valor, label: o.rotulo }))];
      campos.push(`{ id: ${J(id)}, label: ${J(e.rotulo ?? ROTULO_GRADE[e.dom_id])}, unit: null, kind: 'select', defaultValue: ${J(semSelecao ? '' : e.padrao)}, options: ${J(opts)} }`);
      if (e.dom_id === 'rc-grid') e.opcoes.forEach((o, k) => campos.push(`{ id: ${J(`rc-v-${o.valor}`)}, label: ${J(`Etapa ${k + 1} — ${o.rotulo}`)}, unit: null, kind: 'select', defaultValue: 'nao', options: [{ value: 'nao', label: '—' }, { value: 'sim', label: 'verificada' }] }`));
      if (e.dom_id === 'ol-grid') e.opcoes.forEach((o, k) => campos.push(`{ id: ${J(`ol-f-${o.valor}`)}, label: ${J(`Passo ${k + 1} — ${o.rotulo}`)}, unit: null, kind: 'select', defaultValue: 'nao', options: [{ value: 'nao', label: '—' }, { value: 'sim', label: 'executado' }] }`));
    } else {
      const f = e.faixa ?? {};
      campos.push(`{ id: ${J(id)}, label: ${J(e.rotulo)}, unit: ${J(e.unidade ?? null)}, kind: 'range', defaultValue: ${J(Number(e.padrao))}, min: ${J(f.min)}, max: ${J(f.max)}, step: ${J(f.passo)} }`);
    }
  }
  const saidas = x.saidas.filter((s) => s.rotulo).map((s) => `{ id: ${J(s.dom_id)}, label: ${J(s.rotulo)}, unit: null }`);
  const nota = [x.intro?.html, x.aviso?.html].filter(Boolean).join(' ').replace(/GridAlpha/g, 'NIVAR');
  linhas.push(`  {
    id: ${J(x.id)},
    kind: '${KIND[n]}',
    title: ${J(x.titulo)},
    formula: null,
    fields: [
      ${campos.join(',\n      ')},
    ],
    outputs: [${saidas.length ? '\n      ' + saidas.join(',\n      ') + ',\n    ' : ''}],
    note: ${J(nota)},
  },`);
}

const bloco = `/** Os 11 instrumentos, gerados da extração por tools/alexandria-dados/porte/gerar-instrumentos-m10.mjs
 *  (não editar à mão). O INST·01, do mapa do módulo, vai para a Aula 01 (regra de colocação de 15/11). */
export const INSTRUMENTOS_MODULO_10: Instrument[] = [
${linhas.join('\n')}
];
`;
let src = fs.readFileSync(ARQ, 'utf8').replace(/\r\n/g, '\n');
const ini = src.lastIndexOf('/**', src.indexOf('export const INSTRUMENTOS_MODULO_10'));
const fim = src.indexOf('export const MODULO_10_EXERCICIOS_SOLTOS');
if (ini < 0 || fim < 0) throw new Error('bloco de instrumentos não achado');
// o comentário que antecede o bloco dos exercícios fica: corta só até ele
const antesDosEx = src.lastIndexOf('/**', fim);
const corte = antesDosEx > ini ? antesDosEx : fim;
src = src.slice(0, ini) + bloco + '\n' + src.slice(corte);
fs.writeFileSync(ARQ, src);
console.log(`INSTRUMENTOS_MODULO_10: ${linhas.length} instrumentos escritos`);
