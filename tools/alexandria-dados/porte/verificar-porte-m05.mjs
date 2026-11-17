// Verifica o porte do Módulo 05 contra o HTML original (o corpo das aulas não está na
// extração verificada). Método em verificar-porte-m04-m05.mjs.
//
// Mais uma medida, própria do M05 (D19 — "explicador de três níveis portado pela metade"):
// cada painel dos seis três-níveis, como a EXTRAÇÃO VERIFICADA o registra
// (docs/alexandria-v2/extraction/m05/modulo.json → tres_niveis), precisa estar na apostila,
// com o rótulo "<título> · <aba>". É uma segunda fonte, independente do leitor de HTML.
//
// Uso: node tools/alexandria-dados/porte/verificar-porte-m05.mjs [--aula N]
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { verificarPorte } from './verificar-porte-m04-m05.mjs';
import { RAIZ, editorial } from './fonte-html-m04-m05.mjs';

const argv = process.argv.slice(2);
const so = argv.includes('--aula') ? Number(argv[argv.indexOf('--aula') + 1]) : null;

const TEXTUAL = 'saída textual da fonte: a unidade vai no próprio texto (`textos` da calculadora, verbatim).';
const SEM_UNIDADE = 'a fonte escreve o número sem unidade (índice adimensional, como diz o disclaimer do instrumento, que está na nota).';
const FALTAS_EXPLICADAS = {
  'unidade:i2-b': TEXTUAL,
  'unidade:i4-r': TEXTUAL,
  'unidade:i6-q': TEXTUAL,
  'unidade:i6-r': TEXTUAL,
  'unidade:i2-r': SEM_UNIDADE,
  'unidade:i2-k': SEM_UNIDADE,
  'unidade:i2-t': SEM_UNIDADE,
  'unidade:i6-d': SEM_UNIDADE,
};

let exit = await verificarPorte(5, { faltasExplicadas: FALTAS_EXPLICADAS, so });

// D19 — três níveis contra a extração verificada
const mod = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m05/modulo.json'), 'utf8'));
const { MODULO_05_CORPO } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-modulo-05-content.ts')).href);
const plano = (s) => String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/[\s ]+/g, ' ').trim();
let paineis = 0;
const faltas = [];
for (const lv of mod.tres_niveis) {
  const id = `aula-05-${lv.aula}`;
  if (so && Number(lv.aula) !== so) continue;
  const notas = (MODULO_05_CORPO[id] ?? []).filter((b) => b.kind === 'nota');
  for (const p of lv.paineis) {
    paineis++;
    const rotulo = `${lv.titulo} · ${p.rotulo_aba}`;
    const n = notas.find((b) => plano(b.label) === plano(editorial(rotulo)));
    if (!n) faltas.push(`${id}: falta a nota «${rotulo}»`);
    else if (plano(n.html) !== plano(editorial(p.html))) faltas.push(`${id}: «${rotulo}» difere da extração`);
  }
}
console.log(`\n══ D19 · três níveis contra modulo.json: ${paineis - faltas.length}/${paineis} painéis`);
for (const f of faltas) console.log(`   - ${f}`);
if (faltas.length) exit = 1;
console.log(exit ? '   RESULTADO FINAL: FALHA' : '   RESULTADO FINAL: 0 falta, 0 órfão; três níveis completos');
process.exit(exit);
