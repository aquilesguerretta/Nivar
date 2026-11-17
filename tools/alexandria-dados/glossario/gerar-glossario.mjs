// Gera os verbetes do glossário da Alexandria — um arquivo por módulo em
// src/lib/data/alexandria-glossario-modulos/mNN.ts — a partir SÓ da extração
// verificada: docs/alexandria-v2/extraction/glossario/glossario.json.
//
// Nada é redigitado. Termo, etiqueta/família e definição (HTML inline da fonte)
// são copiados do JSON. O único texto novo é estrutural (o id do produto) e as
// trocas editoriais da Q03 (editoriais.mjs), listadas na saída e no cabeçalho
// de cada arquivo.
//
//   · id — os 637 verbetes que o produto já tinha (M01–M08) mantêm o id de
//     sempre (`noProdutoHoje.id` da extração). Os novos seguem a convenção dos
//     M02–M08: `gl-mNN-<termo sem acento, em minúsculas, hífen no lugar do resto>`.
//   · unit — a etiqueta da fonte (M01–M03, que não agrupam) ou a família (M04–M17).
//   · aulaIds — NÃO sai daqui. A fonte não liga verbete a aula; o vínculo é
//     mecânico (decisão 5 de 15/11/2026) e é calculado em runtime sobre o texto
//     real da aula, em src/lib/alexandria/glossario-ocorrencia.ts.
//
// Ordem dentro do arquivo: `ordemNaFonte` — a ordem do § Lex do módulo.
//
// Uso: node tools/alexandria-dados/glossario/gerar-glossario.mjs
// Depois: node tools/alexandria-dados/glossario/verificar-glossario.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { aplicarEditoriais, vigiadosEm } from './editoriais.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const FONTE = path.join(RAIZ, 'docs/alexandria-v2/extraction/glossario/glossario.json');
const SAIDA = path.join(RAIZ, 'src/lib/data/alexandria-glossario-modulos');

const g = JSON.parse(fs.readFileSync(FONTE, 'utf8'));

const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'termo';

const porModulo = new Map();
for (const v of g.verbetes) {
  const m = v.ancora.modulo; // 'm09'
  if (!porModulo.has(m)) porModulo.set(m, []);
  porModulo.get(m).push(v);
}

const idsUsados = new Set();
// Primeiro reserva os ids que o produto já tem, para um id novo nunca colidir com eles.
for (const v of g.verbetes) if (v.noProdutoHoje?.id) idsUsados.add(v.noProdutoHoje.id);

fs.mkdirSync(SAIDA, { recursive: true });
const modulos = [...porModulo.keys()].sort();
let total = 0;
const trocas = [];
for (const m of modulos) {
  const lista = porModulo.get(m).sort((a, b) => a.ordemNaFonte - b.ordemNaFonte);
  const nn = m.slice(1);
  const itens = lista.map((v) => {
    let id = v.noProdutoHoje?.id ?? null;
    if (!id) {
      const base = `gl-m${nn}-${slug(v.termo)}`;
      id = base;
      for (let i = 2; idsUsados.has(id); i++) id = `${base}-${i}`;
      idsUsados.add(id);
    }
    const unitFonte = v.etiqueta ?? v.familia;
    if (!unitFonte) throw new Error(`${v.id}: sem etiqueta e sem família na fonte`);
    // Única exceção ao literal: as trocas editoriais da Q03 (editoriais.mjs).
    const campos = { term: v.termo, unit: unitFonte, definition: v.definicao.html };
    for (const k of Object.keys(campos)) {
      const vig = vigiadosEm(campos[k]);
      if (vig.length) throw new Error(`${v.id} ${k}: vocabulário interno sem troca decidida (${vig.join(', ')})`);
      const { texto, feitas } = aplicarEditoriais(campos[k]);
      for (const f of feitas) trocas.push({ fonte: v.id, id, campo: k, ...f });
      campos[k] = texto;
    }
    return { id, fonte: v.id, ...campos };
  });
  total += itens.length;
  const corpo = itens
    .map(
      (i) =>
        `  {\n    id: ${JSON.stringify(i.id)},\n    fonte: ${JSON.stringify(i.fonte)},\n    term: ${JSON.stringify(i.term)},\n    unit: ${JSON.stringify(i.unit)},\n    definition:\n      ${JSON.stringify(i.definition)},\n  },`,
    )
    .join('\n');
  const titulo = g.modulos.find((x) => x.modulo === m)?.tituloCatalogo ?? 'título não declarado';
  const trocasDoModulo = trocas.filter((t) => t.fonte.startsWith(`${m}-`));
  const notaTrocas = trocasDoModulo.length
    ? `// Trocas editoriais (Q03, editoriais.mjs): ${trocasDoModulo.map((t) => `${t.fonte} ${t.campo} «${t.de}» → «${t.para}»`).join('; ')}.`
    : '// Sem troca editorial neste módulo.';
  const arquivo = `// GERADO por tools/alexandria-dados/glossario/gerar-glossario.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/glossario/glossario.json, módulo ${m} (${titulo}).
// ${itens.length} verbetes, na ordem do glossário do módulo. Literal da extração.
${notaTrocas}

import type { VerbeteDaFonte } from './tipo';

export const GLOSSARIO_M${nn}: readonly VerbeteDaFonte[] = [
${corpo}
];
`;
  fs.writeFileSync(path.join(SAIDA, `${m}.ts`), arquivo);
}

const tipo = `// GERADO por tools/alexandria-dados/glossario/gerar-glossario.mjs — não editar à mão.

/** Um verbete do glossário de um módulo, literal da extração. */
export interface VerbeteDaFonte {
  /** id do produto ('gl-…'). */
  id: string;
  /** id do verbete na extração ('m09-lex-001'), para a procedência. */
  fonte: string;
  /** Termo literal da fonte. */
  term: string;
  /** Etiqueta (M01–M03) ou família (M04–M17), literal da fonte. */
  unit: string;
  /** HTML inline da fonte (<b>, <strong>, <em>, <i> e entidades). */
  definition: string;
}
`;
fs.writeFileSync(path.join(SAIDA, 'tipo.ts'), tipo);

const indice = `// GERADO por tools/alexandria-dados/glossario/gerar-glossario.mjs — não editar à mão.
// Os glossários dos ${modulos.length} módulos, na ordem da trilha (M01 → M17).

import type { VerbeteDaFonte } from './tipo';
${modulos.map((m) => `import { GLOSSARIO_M${m.slice(1)} } from './${m}';`).join('\n')}

export type { VerbeteDaFonte };

export const GLOSSARIO_POR_MODULO: readonly { moduloId: string; verbetes: readonly VerbeteDaFonte[] }[] = [
${modulos.map((m) => `  { moduloId: 'modulo-${m.slice(1)}', verbetes: GLOSSARIO_M${m.slice(1)} },`).join('\n')}
];
`;
fs.writeFileSync(path.join(SAIDA, 'index.ts'), indice);

console.log(`${total} verbetes em ${modulos.length} arquivos → ${path.relative(RAIZ, SAIDA)}`);
console.log(`Trocas editoriais: ${trocas.length}`);
for (const t of trocas) console.log(`  ${t.fonte} (${t.id}) ${t.campo}: «${t.de}» → «${t.para}» [${t.regra}]`);
