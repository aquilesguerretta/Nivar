// Reescreve MODULO_NN_LEAD e MODULO_NN_CORPO em src/lib/data/alexandria-modulo-NN-content.ts a
// partir do HTML original (ver corpo-m06-m08.mjs). Nada é digitado: o trecho entre os marcadores
// é gerado; o resto do arquivo não é tocado. Imprime as trocas editoriais e a posição de cada
// instrumento da fonte no corpo (âncora das previsões).
//
// Uso: node tools/alexandria-dados/porte/gerar-corpo-m06-m08.mjs 6   (ou 7, 8)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpoDoModulo } from './corpo-m06-m08.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const n = Number(process.argv[2]);
if (![6, 7, 8].includes(n)) throw new Error('uso: gerar-corpo-m06-m08.mjs 6|7|8');
const NN = String(n).padStart(2, '0');
const ARQ = path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`);

const uso = {};
const aulas = corpoDoModulo(n, uso);
const id = (a) => `aula-${NN}-${String(a.num).padStart(2, '0')}`;
const js = (v) => JSON.stringify(v);

function bloco(b) {
  switch (b.kind) {
    case 'titulo': return `{ kind: 'titulo', numero: ${js(b.numero)}, texto: ${js(b.texto)} }`;
    case 'paragrafo': return `{ kind: 'paragrafo', html: ${js(b.html)} }`;
    case 'formula': return `{ kind: 'formula', eq: ${js(b.eq)}, desc: ${js(b.desc)} }`;
    case 'nota': return `{ kind: 'nota', tom: ${js(b.tom)}, label: ${js(b.label)}, html: ${js(b.html)} }`;
    case 'lista': return `{ kind: 'lista', itens: [\n      ${b.itens.map(js).join(',\n      ')},\n    ] }`;
    case 'tabela': return `{ kind: 'tabela', linhas: [\n      ${b.linhas.map((l) => `[${l.map(js).join(', ')}]`).join(',\n      ')},\n    ] }`;
    default: throw new Error(b.kind);
  }
}

const INI = '// ── CORPO GERADO (porte v3) ─────';
const FIM = '// ── FIM DO CORPO GERADO ─────';
const gerado = [
  `${INI}────────────────────────────────────────`,
  `// GERADO por tools/alexandria-dados/porte/gerar-corpo-m06-m08.mjs ${n} a partir de`,
  `// \`Alexandria modulos/alexandria_modulo${NN}.html\`. Não editar à mão: corrigir o gerador e regenerar.`,
  `// Conferido por tools/alexandria-dados/porte/verificar-porte-m${NN}.mjs (0 falta, 0 órfão).`,
  `// Trocas editoriais aplicadas: ${js(uso)}.`,
  `export const MODULO_${NN}_LEAD: Record<string, string> = {`,
  ...aulas.filter((a) => a.lead).map((a) => `  '${id(a.aula)}': ${js(a.lead)},`),
  `};`,
  ``,
  `export const MODULO_${NN}_CORPO: Record<string, AulaBloco[]> = {`,
  ...aulas.map((a) => `  '${id(a.aula)}': [\n${a.blocos.map((b, i) => `    /* ${i} */ ${bloco(b)},`).join('\n')}\n  ],`),
  `};`,
  `${FIM}────────────────────────────────────`,
].join('\n');

let ts = fs.readFileSync(ARQ, 'utf8');
if (ts.includes(INI)) {
  const a = ts.indexOf(INI);
  const b = ts.indexOf('\n', ts.indexOf(FIM)) + 1;
  ts = ts.slice(0, a) + gerado + '\n' + ts.slice(b);
} else {
  // Primeira geração: LEAD e CORPO são vizinhos nos três arquivos (medido). Substitui do
  // comentário JSDoc acima de LEAD até o `};` que fecha CORPO; entre os dois só pode haver
  // comentário e espaço — qualquer outra coisa para o gerador.
  const l = ts.indexOf(`export const MODULO_${NN}_LEAD`);
  const c = ts.indexOf(`export const MODULO_${NN}_CORPO`);
  if (l < 0 || c < l) throw new Error('LEAD/CORPO não achados na ordem esperada');
  const fimLead = ts.indexOf('\n};', l) + 3;
  const entre = ts.slice(fimLead, c).replace(/\/\*\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (entre.trim()) throw new Error('há código entre LEAD e CORPO: ' + entre.trim().slice(0, 80));
  const fimCorpo = ts.indexOf('\n};', c) + 3;
  const doc = ts.slice(0, l).match(/\/\*\*(?:(?!\/\*\*)[\s\S])*?\*\/\s*$/);
  ts = ts.slice(0, doc ? l - doc[0].length : l) + gerado + ts.slice(fimCorpo);
}
fs.writeFileSync(ARQ, ts);

console.log(`M${NN}: ${aulas.length} aulas, ${aulas.reduce((s, a) => s + a.blocos.length, 0)} blocos → ${path.relative(RAIZ, ARQ)}`);
console.log(`   trocas editoriais: ${js(uso)}`);
for (const a of aulas) for (const i of a.instrumentos) console.log(`   ${id(a.aula)} · ${i.id} (L${i.linha}) entra depois do bloco ${i.depoisDoBloco}: ${i.nome}`);
