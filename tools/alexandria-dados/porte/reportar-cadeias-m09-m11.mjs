// reportar-cadeias-m09-m11.mjs — re-porta da fonte os itens de cadeia (`div.chain >
// div.cbox`, rótulo em `span.ck2`) que o porte antigo transformou em item de lista com um
// ponto acrescentado depois do rótulo ("Primeiro — Eixo 1. Confirme…"). O ponto não está
// na fonte. Formato do produto: "<b>rótulo</b> texto", com o HTML do corpo pela regra
// única de converterHtml. Acha o item pelo texto (rótulo + "." + corpo) e o troca.
// Uso: node .../reportar-cadeias-m09-m11.mjs 11 [--gravar]

import fs from 'node:fs';
import path from 'node:path';
import { carregarModulo } from '../mini-dom.mjs';
import { RAIZ, carregarTs, converterHtml, compacto } from './porte-m09-m11-comum.mjs';

const n = Number(process.argv[2]);
const gravar = process.argv.includes('--gravar');
const nn = String(n).padStart(2, '0');
const arq = path.join(RAIZ, `src/lib/data/alexandria-modulo-${nn}-content.ts`);
let src = fs.readFileSync(arq, 'utf8').replace(/\r\n/g, '\n');
const mod = await carregarTs(nn);
const itens = Object.values(mod[`MODULO_${nn}_CORPO`]).flat().filter((b) => b.kind === 'lista').flatMap((b) => b.itens);

const m = carregarModulo(n, { instrumentar: false });
const caixas = m.doc.querySelectorAll('section').filter((s) => /^a\d+$/.test(s.attrs?.id ?? '')).flatMap((s) => s.querySelectorAll('.cbox'));
let trocas = 0;
const falhas = [];
for (const cx of caixas) {
  const ck = cx.querySelector('.ck2');
  if (!ck) continue;
  const rotulo = ck.textContent.replace(/\s+/g, ' ').trim();
  const corpo = converterHtml({ filhos: cx.filhos.filter((f) => f !== ck) }).trim();
  const novo = `<b>${rotulo}</b> ${corpo}`;
  const alvo = compacto(`${rotulo}. ${corpo}`);
  const velho = itens.find((t) => compacto(t) === alvo);
  if (!velho) continue; // já está no formato da fonte, ou não é lista
  const lit = JSON.stringify(velho);
  if (src.split(lit).length !== 2) { falhas.push(`«${rotulo}»: literal não achado uma vez`); continue; }
  src = src.replace(lit, () => JSON.stringify(novo));
  trocas++;
  console.log(`~ ${rotulo}`);
}
for (const f of falhas) console.log('! ' + f);
console.log(`${trocas} itens de cadeia re-portados, ${falhas.length} falhas`);
if (gravar && trocas) fs.writeFileSync(arq, src);
