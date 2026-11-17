// Gera as calculadoras de um módulo (src/lib/data/calculadoras/mNN.ts) e a
// lista INSTRUMENTOS_MODULO_NN do arquivo de conteúdo, a partir do HTML-fonte
// e de docs/alexandria-v2/extraction/mNN/instrumentos.json.
//
// PORTE VERBATIM (Q06). A calculadora NÃO reescreve a lógica da fonte: o
// gerador copia, byte a byte, o corpo da IIFE de cada instrumento do
// <script> original (e os helpers puros esc/clamp/numOf/fmt e os dados
// compartilhados) para dentro de uma função, e essa função roda contra um
// ambiente mínimo que faz o papel do DOM: `$id` devolve um objeto que guarda
// innerHTML/className/value, `segVal` lê a escolha do aluno, `segBind`,
// `pair` e `chips` registram os ouvintes da fonte, e o ambiente os dispara
// com a escolha do aluno. O que a fonte escreveria na página é o que a
// calculadora devolve: readouts como número (lidos do texto que o script
// formatou) e os painéis + o veredito como HTML curto (b, em, br).
//
// Uso: node tools/alexandria-dados/porte/gerar-instrumentos-m16-m17.mjs 16
// Conferência: node tools/alexandria-dados/porte/verificar-instrumentos-m16-m17.mjs 16

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { arquivoHtml } from '../mini-dom.mjs';
import { CONFIG } from './instrumentos-config-m16-m17.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const n = Number(process.argv[2]);
const NN = String(n).padStart(2, '0');
const cfg = CONFIG[n];
if (!cfg) throw new Error(`sem configuração para o módulo ${n}`);

const html = fs.readFileSync(arquivoHtml(n), 'utf8');
const linhas = html.split('\n');
const ext = JSON.parse(fs.readFileSync(path.join(RAIZ, `docs/alexandria-v2/extraction/m${NN}/instrumentos.json`), 'utf8'));

// ── trechos verbatim do <script> ────────────────────────────────────────────
function trechoPorLinhas(ini, fim) {
  return { ini, fim, codigo: linhas.slice(ini - 1, fim).join('\n') };
}
/** Linha (1-based) da primeira ocorrência de `re` a partir de `desde`. */
function linhaDe(re, desde = 1) {
  for (let i = desde - 1; i < linhas.length; i++) if (re.test(linhas[i])) return i + 1;
  throw new Error(`não achei ${re} a partir da L${desde}`);
}
/** Corpo da IIFE que começa na primeira `(function(){` depois da linha do marcador. */
function corpoDaIife(linhaMarcador) {
  const ini = linhaDe(/^\s*\(function\s*\(\)\s*\{\s*$/, linhaMarcador);
  let fim = ini;
  let prof = 0;
  for (let i = ini - 1; i < linhas.length; i++) {
    const l = linhas[i];
    // contagem grosseira de chaves só para achar o fecho "})();" no nível 0
    if (i > ini - 1 && /^\}\)\(\);\s*$/.test(l) && prof === 0) { fim = i + 1; break; }
    if (i > ini - 1) prof += (l.match(/\{/g) || []).length - (l.match(/\}/g) || []).length;
    if (i - ini > 2000) throw new Error('IIFE sem fecho');
  }
  // conferência: o fecho precisa estar antes do próximo marcador de seção
  return trechoPorLinhas(ini + 1, fim - 1);
}

const helpers = cfg.helpers.map((nome) => {
  const l = linhaDe(new RegExp(`^function ${nome.replace('$', '\\$')}\\(`));
  return trechoPorLinhas(l, l);
});
const dadosComuns = (cfg.dadosComuns ?? []).map(({ de, ate }) => {
  const ini = linhaDe(de);
  const fim = linhaDe(ate, ini);
  return trechoPorLinhas(ini, fim);
});

// ── especificação de cada instrumento ───────────────────────────────────────
const textoDe = (r) => (typeof r === 'string' ? r : r?.texto ?? null);
const num = (s) => (s === undefined || s === null || s === '' ? undefined : Number(s));
const instrumentos = [];
for (const spec of cfg.instrumentos) {
  const e = ext.instrumentos.find((x) => x.id === spec.id);
  if (!e) throw new Error(`${spec.id} não está na extração`);
  const marcador = linhaDe(spec.marcador);
  const corpo = corpoDaIife(marcador);
  const campos = [];
  for (const en of e.entradas) {
    if (en.tipo === 'numero-com-deslizador-gemeo') {
      campos.push({ id: en.numero.id_fonte, label: en.rotulo, unit: en.unidade || null, kind: 'range', defaultValue: num(en.numero.value), min: num(en.numero.min), max: num(en.numero.max), step: num(en.numero.step) });
    } else if (en.tipo === 'seletor-segmentado') {
      const pad = en.opcoes.find((o) => o.padrao) ?? en.opcoes[0];
      campos.push({ id: en.id_fonte, label: textoDe(en.rotulo) ?? '', unit: null, kind: 'select', defaultValue: pad.valor, options: en.opcoes.map((o) => ({ value: o.valor, label: o.rotulo })), atributo: en.opcoes[0].atributo });
    } else if (en.tipo === 'chips-gerados-pelo-script') {
      const ops = spec.opcoesDosChips ? spec.opcoesDosChips(e) : en.opcoes;
      if (!Array.isArray(ops)) throw new Error(`${spec.id}: chips sem lista de opções na extração; declare opcoesDosChips`);
      campos.push({ id: en.id_fonte, label: spec.rotuloDosChips ?? '', unit: null, kind: 'select', defaultValue: ops[0].valor, options: ops.map((o) => ({ value: o.valor, label: o.rotulo_secundario ? `${o.rotulo} · ${o.rotulo_secundario}` : o.rotulo })) });
    } else throw new Error(`${spec.id}: tipo de entrada não tratado: ${en.tipo}`);
  }
  const readouts = (e.saidas?.readouts ?? []).map((r) => ({ id: r.id_fonte, label: textoDe(r.rotulo) }));
  for (const d of e.saidas?.duais ?? []) readouts.push({ id: d.id_valor, label: d.rotulo });
  instrumentos.push({
    spec,
    id: spec.id,
    kind: spec.kind,
    // rótulo de gênero no título ("§MAP · …"): o InstrumentoV3 o mostra no cabeçalho
    title: spec.genero ? `${spec.genero} · ${textoDe(e.titulo)}` : textoDe(e.titulo),
    intro: e.intro?.html ?? e.intro?.texto ?? e.intro,
    nota: e.nota_de_rodape?.html ?? e.nota_de_rodape?.texto ?? e.nota_de_rodape,
    campos,
    readouts,
    textos: spec.textos,
    corpo,
  });
}

// ── m NN.ts ─────────────────────────────────────────────────────────────────
const nomeFn = (id) => `inst${id.slice(-2)}`;
const out = [];
out.push(`// @ts-nocheck — o corpo de cada instrumento é JavaScript copiado verbatim do`);
out.push(`// <script> da fonte; tipá-lo exigiria reescrevê-lo, e reescrever é o que o`);
out.push(`// porte verbatim proíbe (Q06). O contrato exportado (CALCULADORAS) é tipado.`);
out.push(`//`);
out.push(`// GERADO por tools/alexandria-dados/porte/gerar-instrumentos-m16-m17.mjs ${n} — não edite à mão.`);
out.push(`// Fonte: Alexandria modulos/alexandria_modulo${NN}.html (só leitura).`);
out.push(`// Conferência contra o script original executado: verificar-instrumentos-m16-m17.mjs ${n}.`);
out.push(`//`);
out.push(`// Posse: a sessão de porte do M${NN}. Uma chave aqui SUBSTITUI a de mesmo id em`);
out.push(`// INSTRUMENT_CALCULATORS.`);
out.push(`import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';`);
out.push('');
out.push(`/* ── helpers puros, verbatim da fonte ── */`);
for (const h of helpers) out.push(`/* L${h.ini} */ ${h.codigo}`);
out.push('');
for (const d of dadosComuns) { out.push(`/* ── dados compartilhados, verbatim da fonte (L${d.ini}–L${d.fim}) ── */`); out.push(d.codigo); out.push(''); }
out.push(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'ambiente-instrumento-m16-m17.js.txt'), 'utf8').trim());
out.push('');
for (const i of instrumentos) {
  out.push(`/* ── ${i.id} · ${i.title} — corpo da IIFE, verbatim (L${i.corpo.ini}–L${i.corpo.fim}) ── */`);
  out.push(`function ${nomeFn(i.id)}($id, $all, segBind, segVal, pair, chips, bars) {`);
  out.push(i.corpo.codigo);
  out.push(`}`);
  out.push('');
}
out.push(`const EDITORIAIS = ${JSON.stringify(cfg.editoriaisDaSaida ?? [])};`);
out.push('');
out.push('/** Saída de escolha de cada instrumento de seleção (previsão por escolha): lida do HTML que o');
out.push(' *  script da fonte escreveu — instrumentos-config-m16-m17.mjs, `extratores`. */');
out.push('const EXTRATORES = {');
for (const i of instrumentos) if (i.spec.extratores) {
  out.push(`  '${i.id}': {`);
  for (const [k, f] of Object.entries(i.spec.extratores)) out.push(`    '${k}': ${f.toString()},`);
  out.push('  },');
}
out.push('};');
out.push('');
out.push(`export const CALCULADORAS: Record<string, CalculateFn> = {`);
for (const i of instrumentos) {
  const sel = Object.fromEntries(i.campos.filter((c) => c.kind === 'select').map((c) => [c.id, c.atributo ?? null]));
  out.push(`  '${i.id}': (e: Record<string, EntradaInstrumento>) => calcular(${nomeFn(i.id)}, e, ${JSON.stringify({ readouts: i.readouts.map((r) => r.id), textos: i.textos, selecoes: sel })}, EDITORIAIS, EXTRATORES['${i.id}']),`);
}
out.push(`};`);
out.push('');
out.push(`/** Alvos do script que compõem o painel de cada instrumento (para a conferência). */`);
out.push(`export const TEXTOS: Record<string, string[]> = ${JSON.stringify(Object.fromEntries(instrumentos.map((i) => [i.id, i.textos])))};`);
out.push('');
fs.writeFileSync(path.join(RAIZ, `src/lib/data/calculadoras/m${NN}.ts`), out.join('\n'));

// ── unidades das saídas: roda a calculadora gerada no cenário-padrão ─────────
const mod = await import(`file:///${path.join(RAIZ, `src/lib/data/calculadoras/m${NN}.ts`).replace(/\\/g, '/')}?t=${Date.now()}`);
for (const i of instrumentos) {
  const padrao = Object.fromEntries(i.campos.map((c) => [c.id, c.defaultValue]));
  const r = mod.CALCULADORAS[i.id](padrao);
  for (const ro of i.readouts) ro.unit = r.unidades?.[ro.id] ?? null;
}

// ── INSTRUMENTOS_MODULO_NN no arquivo de conteúdo ────────────────────────────
const ts = (v) => JSON.stringify(v);
const blocoInst = [];
blocoInst.push(`/* <instrumentos-gerados> — GERADO por tools/alexandria-dados/porte/gerar-instrumentos-m16-m17.mjs ${n}; não edite à mão.`);
blocoInst.push(`   Título, rótulos, opções, unidades de campo, faixas e padrões vêm de`);
blocoInst.push(`   docs/alexandria-v2/extraction/m${NN}/instrumentos.json; a nota é a instrução`);
blocoInst.push(`   (p.inst-intro) seguida da nota de rodapé (p.disc) da fonte. */`);
blocoInst.push(`export const INSTRUMENTOS_MODULO_${NN}: Instrument[] = [`);
for (const i of instrumentos) {
  const editar = (s) => (cfg.editoriaisDaSaida ?? []).reduce((r, [de, para]) => r.split(de).join(para), s);
  const nota = editar([i.intro, i.nota].filter(Boolean).join('<br><br>'));
  blocoInst.push(`  {`);
  blocoInst.push(`    id: ${ts(i.id)},`);
  blocoInst.push(`    kind: ${ts(i.kind)},`);
  blocoInst.push(`    title: ${ts(i.title)},`);
  blocoInst.push(`    formula: null,`);
  blocoInst.push(`    fields: [`);
  for (const c of i.campos) {
    const { atributo, ...campo } = c;
    for (const k of Object.keys(campo)) if (campo[k] === undefined) delete campo[k];
    blocoInst.push(`      ${ts(campo)},`);
  }
  blocoInst.push(`    ],`);
  blocoInst.push(`    outputs: [`);
  for (const r of i.readouts) blocoInst.push(`      ${ts({ id: r.id, label: r.label, unit: r.unit })},`);
  blocoInst.push(`    ],`);
  blocoInst.push(`    note: ${ts(nota || null)},`);
  blocoInst.push(`  },`);
}
blocoInst.push(`];`);
blocoInst.push(`const instrumentosDe = (...ids: string[]): Instrument[] => ids.map((id) => INSTRUMENTOS_MODULO_${NN}.find((x) => x.id === id)!);`);
blocoInst.push(`/* </instrumentos-gerados> */`);

const arqConteudo = path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`);
let conteudo = fs.readFileSync(arqConteudo, 'utf8');
const re = /\/\* <instrumentos-gerados>[\s\S]*?<\/instrumentos-gerados> \*\//;
if (!re.test(conteudo)) throw new Error('marcador <instrumentos-gerados> ausente no arquivo de conteúdo');
conteudo = conteudo.replace(re, blocoInst.join('\n'));
fs.writeFileSync(arqConteudo, conteudo);

console.log(`M${NN}: ${instrumentos.length} instrumentos gerados.`);
for (const i of instrumentos) console.log(`  ${i.id} · ${i.title} · corpo L${i.corpo.ini}–L${i.corpo.fim} · ${i.campos.length} campos · ${i.readouts.length} readouts · textos ${i.textos.join(',')}`);
