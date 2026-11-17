// gerar-dados-calculadoras-m10.mjs — escreve, entre os marcadores DADOS-GERADOS de
// src/lib/data/calculadoras/m10.ts, os dados literais dos 11 instrumentos do M10.
//
// Fonte: docs/alexandria-v2/extraction/m10/instrumentos.json, campo `dados_do_script`
// (cada `var NOME={…}` do <script> original, avaliado como dado pela extração
// verificada). Nada é digitado. A lógica fica fora dos marcadores, escrita linha a
// linha do script e conferida por verificar-instrumentos-m10.mjs.
//
// Uso: node tools/alexandria-dados/porte/gerar-dados-calculadoras-m10.mjs

import fs from 'node:fs';
import path from 'node:path';
import { RAIZ } from './porte-m09-m11-comum.mjs';

const EXT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m10/instrumentos.json'), 'utf8'));
const ARQ = path.join(RAIZ, 'src/lib/data/calculadoras/m10.ts');
const INI = '// <DADOS-GERADOS>';
const FIM = '// </DADOS-GERADOS>';

const linhas = [INI, '// Gerado por tools/alexandria-dados/porte/gerar-dados-calculadoras-m10.mjs. Não editar à mão.'];
for (const it of EXT.instrumentos) {
  const n = it.id.slice(-2);
  for (const [nome, d] of Object.entries(it.dados_do_script ?? {})) {
    linhas.push(`/** INST·${n} · \`var ${nome}\` (L${d.linha}–${d.linha_fim ?? d.linha}). */`);
    linhas.push(`const I${n}_${nome} = ${JSON.stringify(d.valor, null, 2)} as const;`);
  }
}
linhas.push(FIM);

const atual = fs.readFileSync(ARQ, 'utf8').replace(/\r\n/g, '\n');
const a = atual.indexOf(INI);
const b = atual.indexOf(FIM);
if (a < 0 || b < 0) throw new Error('marcadores DADOS-GERADOS ausentes em ' + ARQ);
fs.writeFileSync(ARQ, atual.slice(0, a) + linhas.join('\n') + atual.slice(b + FIM.length));
console.log(`dados escritos: ${linhas.filter((l) => l.startsWith('const ')).length} constantes`);
