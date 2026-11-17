// Literais de dado do <script> original de M06–M08, por bloco de instrumento.
//
// Cada bloco `INST NN — …` do script declara os dados que o painel mostra (`var D=[…]`,
// `var M=[…]`, `var INFO={…}`, `var FIXO='…'+'…'`). Aqui o literal é RECORTADO do texto da fonte
// (colchetes balanceados, respeitando strings) e avaliado como expressão — o dado sai do arquivo
// da fonte, nunca digitado. Avaliar é seguro: o texto é o HTML do currículo, local, só leitura, e
// a expressão é um literal (o recorte não inclui chamada nem identificador livre; se incluísse, a
// avaliação lançaria por referência indefinida).
//
// Uso: import { blocosDoScript, literal } from './script-m06-m08.mjs'

import fs from 'node:fs';
import { FONTE } from './aulas-html-m06-m08.mjs';

/** Texto de cada bloco `INST NN` do último <script> do módulo: { '01': '…', '02': '…' }. */
export function blocosDoScript(n) {
  const h = fs.readFileSync(FONTE(n), 'utf8');
  const sc = h.slice(h.lastIndexOf('<script>'));
  const out = {};
  for (const b of sc.matchAll(/INST (\d+) — [^\n]*\n([\s\S]*?)(?=\/\* =====|<\/script>)/g)) out[b[1]] = b[2];
  return out;
}

/** Valor do literal `var nome = …` dentro do bloco. `undefined` se não houver. */
export function literal(bloco, nome) {
  const m = new RegExp(`var ${nome}\\s*=\\s*`).exec(bloco);
  if (!m) return undefined;
  const i = m.index + m[0].length;
  const ab = bloco[i];
  let fim;
  if (ab === '[' || ab === '{') {
    const fe = ab === '[' ? ']' : '}';
    let prof = 0, q = null;
    for (let k = i; k < bloco.length; k++) {
      const c = bloco[k];
      if (q) { if (c === '\\') { k++; continue; } if (c === q) q = null; continue; }
      if (c === "'" || c === '"') { q = c; continue; }
      if (c === ab) prof++;
      else if (c === fe) { prof--; if (!prof) { fim = k + 1; break; } }
    }
  } else {
    // string concatenada até o ';' de fim de declaração (fora de string)
    let q = null;
    for (let k = i; k < bloco.length; k++) {
      const c = bloco[k];
      if (q) { if (c === '\\') { k++; continue; } if (c === q) q = null; continue; }
      if (c === "'" || c === '"') { q = c; continue; }
      if (c === ';') { fim = k; break; }
    }
  }
  if (fim === undefined) throw new Error(`literal ${nome} sem fim`);
  return Function('"use strict"; return (' + bloco.slice(i, fim) + ');')();
}
