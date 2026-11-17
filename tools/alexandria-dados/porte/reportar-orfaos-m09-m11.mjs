// reportar-orfaos-m09-m11.mjs — conserta, a partir do HTML original, as strings do
// corpo que o porte antigo danificou (Q13: dano tipográfico de transporte).
//
// O dano medido: o extrator antigo apagava a abertura `<span class="hl|sh|sw">` e
// trocava o `</span>` por `</b>`, deixando `</b>` órfão. O conserto não edita à
// mão: acha o elemento da fonte cujo texto é o da string danificada e reconverte o
// innerHTML dele com uma regra única, declarada aqui:
//   span.hl (destaque) → <b>      span.sh (cabeça de passo) → <b>
//   span.sw (qualificador do passo) → <i>, com espaço em volta
//   outros span → só o texto;  b/strong/i/em/sub/sup/br ficam;  atributos saem.
// Só toca string com tag órfã. Uso: node .../reportar-orfaos-m09-m11.mjs 9 [--gravar]

import fs from 'node:fs';
import path from 'node:path';
import { carregarModulo, decodificar } from '../mini-dom.mjs';
import { RAIZ, carregarTs, orfaos, norm, converterHtml } from './porte-m09-m11-comum.mjs';

const n = Number(process.argv[2]);
const gravar = process.argv.includes('--gravar');
const nn = String(n).padStart(2, '0');
const arq = path.join(RAIZ, `src/lib/data/alexandria-modulo-${nn}-content.ts`);
let src = fs.readFileSync(arq, 'utf8');
const mod = await carregarTs(nn);
const CORPO = mod[`MODULO_${nn}_CORPO`];

const compacto = (s) => norm(s).replace(/\s+/g, '');

const converter = converterHtml;

const m = carregarModulo(n, { instrumentar: false });
const candidatos = m.doc.querySelectorAll('section').filter((s) => /^a\d+$/.test(s.attrs?.id ?? ''))
  .flatMap((s) => s.querySelectorAll('p, li, td, th, div'));

let trocas = 0;
const falhas = [];
for (const [aula, blocos] of Object.entries(CORPO)) {
  const strings = [];
  const LEAD = mod[`MODULO_${nn}_LEAD`] ?? {};
  if (LEAD[aula]) strings.push(LEAD[aula]);
  blocos.forEach((b) => {
    if (b.kind === 'paragrafo' || b.kind === 'nota') strings.push(b.html);
    if (b.kind === 'lista') strings.push(...b.itens);
    if (b.kind === 'tabela') b.linhas.forEach((l) => strings.push(...l));
  });
  for (const s of strings) {
    // dano: tag órfã, ou pontuação solta (" , ", " . ", " : ", " ; ") onde a fonte tem
    // "</b>," — o extrator antigo trocava o fechamento de tag por espaço
    if (!orfaos([{ onde: '', s }]).length && !/[^\s>] [,.;:]/.test(s)) continue;
    const alvo = compacto(s);
    const el = candidatos.find((e) => compacto(e.textContent) === alvo);
    if (!el) { falhas.push(`${aula}: sem elemento-fonte para «${norm(s).slice(0, 80)}»`); continue; }
    const novo = converter(el).trim();
    if (orfaos([{ onde: '', s: novo }]).length) { falhas.push(`${aula}: reconversão ainda órfã «${novo.slice(0, 80)}»`); continue; }
    const lit = JSON.stringify(s);
    const k = src.split(lit).length - 1;
    if (k !== 1) { falhas.push(`${aula}: literal ocorre ${k}× no arquivo «${norm(s).slice(0, 60)}»`); continue; }
    src = src.replace(lit, () => JSON.stringify(novo));
    trocas++;
    console.log(`~ ${aula}\n  antes: ${s.slice(0, 150)}\n  depois: ${novo.slice(0, 150)}`);
  }
}
for (const f of falhas) console.log('! ' + f);
console.log(`${trocas} strings reconvertidas da fonte, ${falhas.length} falhas`);
if (gravar && trocas) fs.writeFileSync(arq, src);
void decodificar;
