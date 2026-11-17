// reportar-niveis-m09-m11.mjs — re-porta da fonte os painéis de três níveis (div.lv)
// de M09, M10 e M11 (D19 estendida: o porte antigo fundia os três painéis numa nota
// só, com o rótulo da aba em negrito e um ponto acrescentado).
//
// Formato do produto, o mesmo do M01: uma nota por nível, na ordem da fonte, com
// rótulo "<cabeça do painel> · <aba>" e os parágrafos do painel separados por
// <br><br>. Acha a nota antiga pelo rótulo (= cabeça do painel) e a troca pelas
// três. Uso: node .../reportar-niveis-m09-m11.mjs 9 [--gravar]

import fs from 'node:fs';
import path from 'node:path';
import { carregarModulo } from '../mini-dom.mjs';
import { RAIZ, carregarTs } from './porte-m09-m11-comum.mjs';
import { converterHtml } from './porte-m09-m11-comum.mjs';

const n = Number(process.argv[2]);
const gravar = process.argv.includes('--gravar');
const nn = String(n).padStart(2, '0');
const arq = path.join(RAIZ, `src/lib/data/alexandria-modulo-${nn}-content.ts`);
let src = fs.readFileSync(arq, 'utf8');
const mod = await carregarTs(nn);
const CORPO = mod[`MODULO_${nn}_CORPO`];
const colapsar = (s) => s.replace(/[\s ]+/g, ' ').trim();

const m = carregarModulo(n, { instrumentar: false });
const paineis = m.doc.querySelectorAll('section').filter((s) => /^a\d+$/.test(s.attrs?.id ?? '')).flatMap((s) => s.querySelectorAll('.lv'));
let trocas = 0;
const falhas = [];
for (const lv of paineis) {
  const hd = colapsar(lv.querySelector('.lv-hd')?.textContent ?? '');
  const abas = lv.querySelectorAll('.lv-tab').map((a) => colapsar(a.textContent));
  // painel com <p> (M09): parágrafos separados por <br><br>; painel de texto direto (M10): o painel inteiro
  const ps = lv.querySelectorAll('.lv-pane').map((p) => {
    const pp = p.querySelectorAll('p');
    return pp.length ? pp.map((x) => converterHtml(x).trim()).join('<br><br>') : converterHtml(p).trim();
  });
  // segunda passada: as três notas já existem com rótulo "<cabeça> · <aba>" — reescreve o html delas
  const ja = abas.map((ab) => Object.values(CORPO).flat().filter((b) => b.kind === 'nota' && colapsar(b.label ?? '') === `${hd} · ${ab}`));
  if (ja.every((x) => x.length === 1)) {
    ja.forEach(([b], i) => {
      if (b.html === ps[i]) return;
      const linha = `{ kind: 'nota', tom: ${JSON.stringify(b.tom)}, label: ${JSON.stringify(b.label)}, html: ${JSON.stringify(b.html)} },`;
      if (src.split(linha).length !== 2) { falhas.push(`«${b.label}»: linha não achada literal`); return; }
      src = src.replace(linha, () => `{ kind: 'nota', tom: ${JSON.stringify(b.tom)}, label: ${JSON.stringify(b.label)}, html: ${JSON.stringify(ps[i])} },`);
      trocas++;
      console.log(`~ ${b.label}: html reescrito da fonte`);
    });
    continue;
  }
  const velhas = Object.values(CORPO).flat().filter((b) => b.kind === 'nota' && colapsar(b.label ?? '') === hd);
  if (velhas.length !== 1) { falhas.push(`«${hd}»: ${velhas.length} notas com esse rótulo no .ts`); continue; }
  const v = velhas[0];
  const linhaVelha = `{ kind: 'nota', tom: ${JSON.stringify(v.tom)}, label: ${JSON.stringify(v.label)}, html: ${JSON.stringify(v.html)} },`;
  if (src.split(linhaVelha).length !== 2) { falhas.push(`«${hd}»: a linha da nota não foi achada literal no arquivo`); continue; }
  const novas = abas.map((ab, i) => `{ kind: 'nota', tom: ${JSON.stringify(v.tom)}, label: ${JSON.stringify(`${hd} · ${ab}`)}, html: ${JSON.stringify(ps[i])} },`).join('\n    ');
  src = src.replace(linhaVelha, () => novas);
  trocas++;
  console.log(`~ ${hd}: 1 nota → ${abas.length}`);
}
for (const f of falhas) console.log('! ' + f);
console.log(`${trocas} painéis re-portados, ${falhas.length} falhas`);
if (gravar && trocas) fs.writeFileSync(arq, src);
