// Verifica a leitura das aulas (docs/alexandria-v3/atlas/leitura/mNN.json):
// cada "trecho" tem de ser substring exata da linha declarada do arquivo-fonte.
//
//   node tools/alexandria-atlas/verificar-leitura.mjs          resumo
//   node tools/alexandria-atlas/verificar-leitura.mjs --falhas lista o que não bate
//
// Sai com código 1 se alguma citação não conferir.

import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PASTA = join(RAIZ, 'docs', 'alexandria-v3', 'atlas', 'leitura');
const verFalhas = process.argv.includes('--falhas');

const linhasDe = new Map();
async function linhas(rel) {
  if (!linhasDe.has(rel)) {
    try {
      linhasDe.set(rel, (await readFile(join(RAIZ, rel), 'utf8')).split(/\r?\n/));
    } catch {
      linhasDe.set(rel, null);
    }
  }
  return linhasDe.get(rel);
}

const arquivos = (await readdir(PASTA)).filter((f) => /^m\d\d\.json$/.test(f)).sort();
let total = 0;
let ok = 0;
let vistas = 0;
const falhas = [];
const porTipo = {};
const tabela = [];
for (const arq of arquivos) {
  const d = JSON.parse(await readFile(join(PASTA, arq), 'utf8'));
  let okMod = 0;
  for (const [i, m] of d.mencoes.entries()) {
    total++;
    porTipo[m.tipo] = (porTipo[m.tipo] || 0) + 1;
    const ls = await linhas(m.arquivo);
    const linha = ls?.[m.linha - 1];
    const confere = typeof linha === 'string' && typeof m.trecho === 'string' && m.trecho.length >= 20 && linha.includes(m.trecho);
    if (confere) {
      ok++;
      okMod++;
    } else {
      // tolerância de ±2 linhas: registra onde está, mas conta como falha de linha
      let achada = null;
      if (ls) for (let k = Math.max(0, m.linha - 3); k < Math.min(ls.length, m.linha + 2); k++) if (ls[k].includes(m.trecho)) achada = k + 1;
      falhas.push({ arq, i, aula: m.aula, nome: m.nome, arquivo: m.arquivo, linha: m.linha, motivo: !ls ? 'arquivo não existe' : achada ? `está na linha ${achada}` : 'trecho não é substring da linha', trecho: String(m.trecho).slice(0, 80) });
    }
  }
  vistas += (d.vistas_sugeridas || []).length;
  tabela.push(`${d.modulo}  aulas ${String(d.aulas.length).padStart(2)}  menções ${String(d.mencoes.length).padStart(3)}  conferem ${String(okMod).padStart(3)}  vistas sugeridas ${String((d.vistas_sugeridas || []).length).padStart(2)}`);
}
console.log(tabela.join('\n'));
console.log(`\n${arquivos.length} módulos · ${total} menções · ${ok} conferem (${falhas.length} não) · ${vistas} vistas sugeridas`);
console.log('por tipo:', Object.entries(porTipo).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · '));
if (verFalhas) for (const f of falhas) console.log(`  ${f.arq}#${f.i} aula ${f.aula} ${f.nome} — ${f.arquivo}:${f.linha} — ${f.motivo} — "${f.trecho}…"`);
if (falhas.length) process.exitCode = 1;
