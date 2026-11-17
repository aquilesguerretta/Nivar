// Gera src/lib/data/calculadoras/m17.ts e o bloco INSTRUMENTOS_MODULO_17 do arquivo de
// conteúdo, a partir do HTML-fonte e de docs/alexandria-v2/extraction/m17/instrumentos.json.
//
// PORTE VERBATIM (Q06). O script do M17 é uma IIFE só, com os utilitários dentro, e um
// segundo <script> que os recebe por window.M17. O gerador copia, byte a byte e com a
// linha de origem: os utilitários ($id … verdict), a base J e DIMS, e o corpo da IIFE de
// cada instrumento, para dentro de `criarFonte(document, window)`. A calculadora roda o
// corpo do instrumento contra o `document` mínimo de ambiente-instrumento-m17.js.txt e
// devolve o que a página escreveria. Nada de veredito é digitado.
//
// Uso: node tools/alexandria-dados/porte/gerar-instrumentos-m17.mjs
// Conferência: node tools/alexandria-dados/porte/verificar-instrumentos-m16-m17.mjs 17

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { arquivoHtml } from '../mini-dom.mjs';
import { CONFIG } from './instrumentos-config-m16-m17.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..');
const cfg = CONFIG[17];
const linhas = fs.readFileSync(arquivoHtml(17), 'utf8').split('\n');
const ext = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m17/instrumentos.json'), 'utf8'));

function linhaDe(re, desde = 1) {
  for (let i = desde - 1; i < linhas.length; i++) if (re.test(linhas[i])) return i + 1;
  throw new Error(`não achei ${re} a partir da L${desde}`);
}
const trecho = (ini, fim) => ({ ini, fim, codigo: linhas.slice(ini - 1, fim).join('\n') });

// utilitários: de `function $id` até o fecho de `function verdict`
const iniUtil = linhaDe(/^function \$id\(/);
const fimUtil = linhaDe(/^\}\s*$/, linhaDe(/^function verdict\(/));
const util = trecho(iniUtil, fimUtil);
const iniJ = linhaDe(/^var J = \[/);
const dadosJ = trecho(iniJ, linhaDe(/^\];\s*$/, iniJ));
const iniD = linhaDe(/^var DIMS = \{/);
const dadosD = trecho(iniD, linhaDe(/^\};\s*$/, iniD));

function corpoDaIife(marcador) {
  const ini = linhaDe(/^\(function\s*\(\)\s*\{\s*$/, linhaDe(marcador));
  const fim = linhaDe(/^\}\)\(\);\s*$/, ini + 1);
  return trecho(ini + 1, fim - 1);
}

const textoDe = (r) => (typeof r === 'string' ? r : r?.html ?? r?.texto ?? null);
const instrumentos = [];
for (const spec of cfg.instrumentos) {
  const e = ext.instrumentos.find((x) => x.id === spec.id);
  if (!e) throw new Error(`${spec.id} não está na extração`);
  const corpo = corpoDaIife(spec.marcador);
  const campos = [];
  const gatilhos = [];
  for (const en of e.entradas) {
    if (en.tipo === 'chips') {
      const nomes = en.opcoes_nome_completo ?? en.opcoes;
      campos.push({ id: en.id, label: spec.rotulos?.[en.id] ?? en.rotulo ?? '', unit: null, kind: 'select', defaultValue: '0', options: nomes.map((n, i) => ({ value: String(i), label: n })) });
      gatilhos.push({ campo: en.id, tipo: 'chips', alvo: en.id });
    } else if (/^alternar/.test(en.tipo)) {
      campos.push({ id: en.id, label: en.rotulo, unit: null, kind: 'select', defaultValue: 'ausente', options: en.estados.map((s) => ({ value: s.replace(/\.$/, '').toLowerCase(), label: s.replace(/\.$/, '') })) });
      gatilhos.push({ campo: en.id, tipo: 'linha', alvo: spec.alvoDasLinhas, chave: en.id.replace(/^i\d\d-/, '') });
    } else if (/^number/.test(en.tipo)) {
      campos.push({ id: en.id, label: en.rotulo, unit: en.unidade || null, kind: 'range', defaultValue: en.padrao, min: en.min, max: en.max, step: en.passo });
    } else if (en.tipo === 'botões' && spec.navegacao) {
      campos.push({ id: en.id, label: spec.navegacao.rotulo, unit: null, kind: 'select', defaultValue: '0', options: Array.from({ length: spec.navegacao.n }, (_, k) => ({ value: String(k), label: `${spec.navegacao.rotulo} ${k + 1}` })) });
      gatilhos.push({ campo: en.id, tipo: 'nav', alvo: en.id });
    } else throw new Error(`${spec.id}: entrada não tratada: ${en.tipo}`);
  }
  // chips antes de linha antes de navegação (a ordem em que a página reagiria)
  const ordem = { chips: 0, linha: 1, nav: 2 };
  gatilhos.sort((a, b) => ordem[a.tipo] - ordem[b.tipo]);
  instrumentos.push({
    spec,
    id: spec.id,
    chave: spec.chave,
    title: spec.genero ? `${spec.genero} · ${e.titulo?.texto ?? textoDe(e.titulo)}` : (e.titulo?.texto ?? textoDe(e.titulo)),
    nota: [textoDe(e.instrucao), textoDe(e.fonte_dos_numeros)].filter(Boolean).join('<br><br>'),
    campos,
    gatilhos,
    corpo,
  });
}

// ── m17.ts ──────────────────────────────────────────────────────────────────
const out = [];
out.push('// @ts-nocheck — o corpo de cada instrumento é JavaScript copiado verbatim do');
out.push('// <script> da fonte; tipá-lo exigiria reescrevê-lo, e reescrever é o que o');
out.push('// porte verbatim proíbe (Q06). O contrato exportado (CALCULADORAS) é tipado.');
out.push('//');
out.push('// GERADO por tools/alexandria-dados/porte/gerar-instrumentos-m17.mjs — não edite à mão.');
out.push('// Fonte: Alexandria modulos/alexandria_modulo17.html (só leitura).');
out.push('// Conferência contra o script original executado: verificar-instrumentos-m16-m17.mjs 17.');
out.push('// Posse: a sessão de porte do M17.');
out.push("import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';");
out.push('');
out.push('function criarFonte(document, window) {');
out.push(`/* ── utilitários, verbatim (L${util.ini}–L${util.fim}) ── */`);
out.push(util.codigo);
out.push(`/* ── base J, verbatim (L${dadosJ.ini}–L${dadosJ.fim}) ── */`);
out.push(dadosJ.codigo);
out.push(`/* ── DIMS, verbatim (L${dadosD.ini}–L${dadosD.fim}) ── */`);
out.push(dadosD.codigo);
out.push('return {');
for (const i of instrumentos) {
  out.push(`/* ── ${i.id} · ${i.title} — corpo da IIFE, verbatim (L${i.corpo.ini}–L${i.corpo.fim}) ── */`);
  out.push(`${i.chave}: function () {`);
  // Estilo inline do script da fonte com branco/preto puro: `simplificar()` tira toda tag
  // com atributo antes da tela, então a cor nunca chega à aula. A linha fica verbatim; o
  // auditor recebe a supressão declarada na linha anterior (comentário entre operandos é JS válido).
  out.push(i.corpo.codigo.split('\n').map((l) => (/#(fff|000)\b/i.test(l)
    ? `// gridalpha-detect-disable-next-line no-pure-black-white — estilo inline do script da fonte; simplificar() o remove, nunca chega à tela\n${l}`
    : l)).join('\n'));
  out.push('},');
}
out.push('};');
out.push('}');
out.push('');
out.push(fs.readFileSync(path.join(AQUI, 'ambiente-instrumento-m17.js.txt'), 'utf8').trim());
out.push('');
out.push(`const EDITORIAIS = ${JSON.stringify(cfg.editoriaisDaSaida ?? [])};`);
out.push('');
out.push('/** Saída de escolha (previsão categórica), lida do HTML que o script escreveu. */');
out.push('const EXTRATORES = {');
for (const i of instrumentos) if (i.spec.extratores) {
  out.push(`  '${i.id}': {`);
  for (const [k, f] of Object.entries(i.spec.extratores)) out.push(`    '${k}': ${f.toString()},`);
  out.push('  },');
}
out.push('};');
out.push('');
const specDe = (i) => ({ textos: i.spec.textos, paineisRo: i.spec.paineisRo ?? [], gatilhos: i.gatilhos });
out.push('export const CALCULADORAS: Record<string, CalculateFn> = {');
for (const i of instrumentos) out.push(`  '${i.id}': (e: Record<string, EntradaInstrumento>) => calcular('${i.chave}', e, ${JSON.stringify(specDe(i))}, EDITORIAIS, EXTRATORES['${i.id}']),`);
out.push('};');
out.push('');
out.push('/** Alvos do script que compõem o painel e gatilhos de cada campo (para a conferência). */');
out.push(`export const TEXTOS: Record<string, string[]> = ${JSON.stringify(Object.fromEntries(instrumentos.map((i) => [i.id, i.spec.textos])))};`);
out.push(`export const GATILHOS: Record<string, { campo: string; tipo: string; alvo: string; chave?: string }[]> = ${JSON.stringify(Object.fromEntries(instrumentos.map((i) => [i.id, i.gatilhos])))};`);
out.push('');
const ARQ = path.join(RAIZ, 'src/lib/data/calculadoras/m17.ts');
fs.writeFileSync(ARQ, out.join('\n'));

// saídas `ro` e rótulos: rodando a calculadora gerada no padrão
const mod = await import(`file:///${ARQ.replace(/\\/g, '/')}?t=${Date.now()}`);
for (const i of instrumentos) {
  const padrao = Object.fromEntries(i.campos.map((c) => [c.id, c.defaultValue]));
  const r = mod.CALCULADORAS[i.id](padrao);
  i.saidas = [];
  for (const [c, ros] of Object.entries(r.ros)) ros.forEach((ro, k) => i.saidas.push({ id: `${c}-${k + 1}`, label: ro.k.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&'), unit: null }));
  if (!r.veredito) throw new Error(`${i.id}: painel vazio no padrão`);
}

// ── INSTRUMENTOS_MODULO_17 ───────────────────────────────────────────────────
const ts = (v) => JSON.stringify(v);
const editar = (s) => (cfg.editoriaisDaSaida ?? []).reduce((r, [de, para]) => r.split(de).join(para), s);
const bloco = [];
bloco.push('/* <instrumentos-gerados> — GERADO por tools/alexandria-dados/porte/gerar-instrumentos-m17.mjs; não edite à mão.');
bloco.push('   Título, rótulos, opções, unidades, faixas e padrões vêm de docs/alexandria-v2/extraction/m17/instrumentos.json');
bloco.push('   (chips com o nome completo de `opcoes_nome_completo`); a nota é a instrução (p.inst-intro) seguida da nota de');
bloco.push('   fonte (p.srcnote) quando o instrumento tem uma. Saídas: os `ro()` do script, com o rótulo dele. */');
bloco.push('export const INSTRUMENTOS_MODULO_17: Instrument[] = [');
for (const i of instrumentos) {
  bloco.push('  {');
  bloco.push(`    id: ${ts(i.id)},`);
  bloco.push(`    kind: ${ts(i.spec.kind)},`);
  bloco.push(`    title: ${ts(i.title)},`);
  bloco.push('    formula: null,');
  bloco.push('    fields: [');
  for (const c of i.campos) bloco.push(`      ${ts(c)},`);
  bloco.push('    ],');
  bloco.push('    outputs: [');
  for (const o of i.saidas) bloco.push(`      ${ts(o)},`);
  bloco.push('    ],');
  bloco.push(`    note: ${ts(editar(i.nota) || null)},`);
  bloco.push('  },');
}
bloco.push('];');
bloco.push('const instrumentosDe = (...ids: string[]): Instrument[] => ids.map((id) => INSTRUMENTOS_MODULO_17.find((x) => x.id === id)!);');
bloco.push('/* </instrumentos-gerados> */');
const arqConteudo = path.join(RAIZ, 'src/lib/data/alexandria-modulo-17-content.ts');
let conteudo = fs.readFileSync(arqConteudo, 'utf8');
const re = /\/\* <instrumentos-gerados>[\s\S]*?<\/instrumentos-gerados> \*\//;
if (!re.test(conteudo)) throw new Error('marcador <instrumentos-gerados> ausente no arquivo de conteúdo');
conteudo = conteudo.replace(re, bloco.join('\n'));
fs.writeFileSync(arqConteudo, conteudo);
console.log(`M17: ${instrumentos.length} instrumentos gerados.`);
for (const i of instrumentos) console.log(`  ${i.id} · ${i.title} · corpo L${i.corpo.ini}–L${i.corpo.fim} · ${i.campos.length} campos · ${i.saidas.length} saídas · gatilhos ${i.gatilhos.map((g) => g.tipo).join(',') || '—'}`);
