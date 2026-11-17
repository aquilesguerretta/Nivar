// gerar-dados-calculadoras-m09.mjs — escreve, entre os marcadores DADOS-GERADOS de
// src/lib/data/calculadoras/m09.ts, os dados literais dos 11 instrumentos do M09.
//
// Fonte: docs/alexandria-v2/extraction/m09/instrumentos.json, campo
// `script.dados_literais` — cada `var NOME={…}` do <script> original, avaliado como
// dado pela extração verificada (488 strings-folha conferidas contra a fonte). Nada é
// digitado: o que vai ao .ts é o JSON da extração, com o nome prefixado pelo
// instrumento (I01_FLUXO, I02_COMP...). A lógica fica fora dos marcadores, escrita à
// mão linha a linha do script e conferida por verificar-instrumentos-m09.mjs.
//
// Uso: node tools/alexandria-dados/porte/gerar-dados-calculadoras-m09.mjs

import fs from 'node:fs';
import path from 'node:path';
import { RAIZ } from './porte-m09-m11-comum.mjs';

const EXT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m09/instrumentos.json'), 'utf8'));
const ARQ = path.join(RAIZ, 'src/lib/data/calculadoras/m09.ts');
const INI = '// <DADOS-GERADOS>';
const FIM = '// </DADOS-GERADOS>';

const linhas = [INI, '// Gerado por tools/alexandria-dados/porte/gerar-dados-calculadoras-m09.mjs. Não editar à mão.'];
for (const it of EXT.instrumentos) {
  const n = it.id.slice(-2);
  for (const [nome, d] of Object.entries(it.script.dados_literais ?? {})) {
    linhas.push(`/** ${it.inst_id_fonte} · \`var ${nome}\` (L${d.linhas.join('–')}). */`);
    linhas.push(`const I${n}_${nome} = ${JSON.stringify(d.valor, null, 2)} as const;`);
  }
}
linhas.push(FIM);

const atual = fs.readFileSync(ARQ, 'utf8');
const a = atual.indexOf(INI);
const b = atual.indexOf(FIM);
if (a < 0 || b < 0) throw new Error('marcadores DADOS-GERADOS ausentes em ' + ARQ);
fs.writeFileSync(ARQ, atual.slice(0, a) + linhas.join('\n') + atual.slice(b + FIM.length));
console.log(`dados escritos: ${linhas.filter((l) => l.startsWith('const ')).length} constantes`);
