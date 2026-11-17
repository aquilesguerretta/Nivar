// verificar-instrumentos-m10.mjs — confere as calculadoras do M10 contra o script
// ORIGINAL rodando no mini-dom, e os campos de INSTRUMENTOS_MODULO_10 contra a extração.
//
// Para cada cenário, mexe nos controles do HTML original (seletor, chip, digitação),
// lê o que a fonte imprimiu e compara com a calculadora portada:
//   · `textos` de cada readout — igualdade exata com o texto que a fonte imprime;
//   · o texto do veredito (painéis, barras, veredito, cartões, na ordem da tela) — tags
//     fora, entidades decodificadas, e só o ESPAÇO ignorado (a fonte cola blocos de div
//     sem espaço; o produto separa com <br>). Nenhum caractere é ignorado.
//
// Uso: node tools/alexandria-dados/porte/verificar-instrumentos-m10.mjs

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { carregarModulo, decodificar } from '../mini-dom.mjs';
import { RAIZ } from './porte-m09-m11-comum.mjs';

const { CALCULADORAS } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/calculadoras/m10.ts')).href);
const { INSTRUMENTOS_MODULO_10, MODULO_10_AULAS } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-modulo-10-content.ts')).href);
const EXT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m10/instrumentos.json'), 'utf8'));

const compacto = (s) => decodificar(String(s ?? '').replace(/<[^>]+>/g, '')).replace(/[\s ]+/g, '');
const colapsar = (s) => String(s ?? '').replace(/[\s ]+/g, ' ').trim();
let falhas = 0;
let cenarios = 0;
const novo = () => carregarModulo(10, { instrumentar: false });
const t = (m, id) => colapsar(m.texto(id) ?? '');
const clicar = (m, el) => { if (!el) throw new Error('elemento ausente'); m.disparar(el, 'click'); };
const seg = (m, w, attr, v) => clicar(m, m.el(w).querySelectorAll('button').find((b) => b.attrs[attr] === v));
const chip = (m, grid, k) => clicar(m, m.el(grid).querySelectorAll('button').find((b) => b.attrs['data-k'] === k));
function digitar(m, id, v) { const e = m.el(id); e.value = String(v); m.disparar(e, 'input'); m.disparar(e, 'change'); }

function comparar(nome, entrada, m, ids, textos, calcId) {
  cenarios++;
  const r = CALCULADORAS[calcId](entrada);
  const erros = [];
  const fonte = ids.map((id) => compacto(m.el(id)?.textContent ?? '')).join('');
  const porte = compacto(r.veredito);
  if (fonte !== porte) {
    let k = 0; while (k < fonte.length && fonte[k] === porte[k]) k++;
    erros.push(`texto difere na posição ${k}:\n      fonte: «${fonte.slice(Math.max(0, k - 40), k + 70)}»\n      porte: «${porte.slice(Math.max(0, k - 40), k + 70)}»`);
  }
  for (const id of textos) if ((r.textos ?? {})[id] !== t(m, id)) erros.push(`textos.${id}: fonte «${t(m, id)}» × porte «${(r.textos ?? {})[id]}»`);
  if (r.vereditoPtBr !== true) erros.push('vereditoPtBr ausente');
  if (erros.length) { falhas++; if (falhas <= 20) console.log(`  ✗ ${nome} ${JSON.stringify(entrada)}\n    ${erros.join('\n    ')}`); }
}

// INST·01 — 3 lentes × (sem seleção + 14 linhas)
for (const l of ['unit', 'qtd', 'ciclo']) for (const k of ['', ...EXT.instrumentos[0].entradas[1].opcoes.map((o) => o.valor)]) {
  const m = novo(); seg(m, 'mf-seg', 'data-l', l); if (k) chip(m, 'mf-grid', k);
  comparar('INST·01', { 'mf-seg': l, 'mf-linha': k }, m, ['mf-lens', 'mf-line'], [], 'm10-inst-01');
}
// INST·02 — as 60 combinações
for (const p of ['plana', 'diurna', 'pontabaixa', 'erratica', 'sazonal']) for (const md of ['azul', 'verde', 'conv']) for (const s of ['a4', 'a3a', 'a3', 'a2']) {
  const m = novo(); seg(m, 'cm-perf', 'data-p', p); seg(m, 'cm-mod', 'data-m', md); seg(m, 'cm-sg', 'data-s', s);
  comparar('INST·02', { 'cm-perf': p, 'cm-mod': md, 'cm-sg': s }, m, ['cm-vd', 'cm-out'], [], 'm10-inst-02');
}
// INST·03 — utilização em todas as faixas, histórico curto/parcial/completo
for (const [ctr, max, med] of [[1200, 1010, 720], [1000, 500, 300], [1000, 700, 600], [1000, 1000, 900], [1000, 1040, 800], [1000, 1300, 900], [10, 20000, 1]]) for (const mes of [1, 5, 8, 12, 36]) for (const tol of [5, 0]) {
  const m = novo(); for (const [k, v] of [['ctr', ctr], ['max', max], ['med', med], ['mes', mes], ['tol', tol]]) digitar(m, 'dd-' + k, v);
  comparar('INST·03', { 'dd-ctr': ctr, 'dd-max': max, 'dd-med': med, 'dd-mes': mes, 'dd-tol': tol }, m, ['dd-vd', 'dd-out'], ['dd-util', 'dd-fc', 'dd-lim', 'dd-folga'], 'm10-inst-03');
}
// INST·04 — sem cobrança, borda, disparo, descolamento
for (const [ctr, med] of [[1000, 1060], [1000, 900], [1000, 1040], [1000, 1100], [1000, 1300], [500, 20000]]) for (const [tol, mul, tar] of [[5, 2, 40], [0, 4, 300], [20, 1, 1]]) {
  const m = novo(); for (const [k, v] of [['ctr', ctr], ['med', med], ['tol', tol], ['mul', mul], ['tar', tar]]) digitar(m, 'ul-' + k, v);
  comparar('INST·04', { 'ul-ctr': ctr, 'ul-med': med, 'ul-tol': tol, 'ul-mul': mul, 'ul-tar': tar }, m, ['ul-vd', 'ul-out'], ['ul-lim', 'ul-base', 'ul-norm', 'ul-pen', 'ul-peso'], 'm10-inst-04');
}
// INST·05 — todas as faixas, e ponta maior que o total (a fonte prende ao total)
for (const [tot, pta] of [[420, 42], [1000, 20], [1000, 150], [1000, 300], [100, 500]]) for (const [des, hrs] of [[30, 63], [0, 1], [100, 200]]) {
  const m = novo(); for (const [k, v] of [['tot', tot], ['pta', pta], ['des', des], ['hrs', hrs]]) digitar(m, 'dl-' + k, v);
  comparar('INST·05', { 'dl-tot': tot, 'dl-pta': pta, 'dl-des': des, 'dl-hrs': hrs }, m, ['dl-bars', 'dl-vd', 'dl-out'], ['dl-p0', 'dl-p1', 'dl-vol', 'dl-pot'], 'm10-inst-05');
}
// INST·06 — as cinco chaves, inconsistências de entrada e janela excedida
for (const [ref, ind, cap] of [[0.92, 0.87, 0.95], [0.92, 0.95, 0.85], [0.92, 0.8, 0.8], [0.5, 0.3, 1]]) for (const [vd1, vn1, hrs] of [[180, 0, 6], [20, 0, 6], [0, 50, 6], [180, 50, 8], [600, 200, 10]]) {
  const m = novo(); for (const [k, v] of [['ref', ref], ['ind', ind], ['cap', cap], ['hrs', hrs], ['vd1', vd1], ['vn1', vn1]]) digitar(m, 'fp-' + k, v);
  comparar('INST·06', { 'fp-ref': ref, 'fp-ind': ind, 'fp-cap': cap, 'fp-vd1': vd1, 'fp-vn1': vn1, 'fp-hrs': hrs }, m, ['fp-vdt', 'fp-out'], ['fp-pd', 'fp-pn', 'fp-dd', 'fp-dn'], 'm10-inst-06');
}
// INST·07 — sem seleção + 11 itens
for (const k of ['', ...EXT.instrumentos[6].entradas[0].opcoes.map((o) => o.valor)]) {
  const m = novo(); if (k) chip(m, 'en-grid', k);
  comparar('INST·07', { 'en-sel': k }, m, ['en-panel'], [], 'm10-inst-07');
}
// INST·08 e INST·10 — marcar (dois cliques no mesmo chip) e depois abrir a etapa em foco
function regua(grid, ids, pref, conjuntos, foco, calc, saidas, painelId, vdId) {
  for (const marc of conjuntos) for (const f of foco) {
    const m = novo();
    for (const k of marc) { chip(m, grid, k); chip(m, grid, k); }
    if (f && !(marc.length && marc.at(-1) === f)) chip(m, grid, f);
    const sel = f || (marc.length ? marc.at(-1) : '');
    const inp = { [`${pref}-sel`]: sel };
    for (const k of marc) inp[`${pref === 'rc' ? 'rc-v' : 'ol-f'}-${k}`] = 'sim';
    comparar(calc, inp, m, [painelId, vdId], saidas, calc === 'INST·08' ? 'm10-inst-08' : 'm10-inst-10');
  }
}
regua('rc-grid', [], 'rc', [[], ['e1'], ['e1', 'e3', 'e5'], ['e1', 'e2', 'e3', 'e4', 'e5'], ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8']], ['', 'e3', 'e8'], 'INST·08', ['rc-cnt', 'rc-est'], 'rc-panel', 'rc-vd');
regua('ol-grid', [], 'ol', [[], ['p1', 'p2'], ['p1', 'p2', 'p3', 'p4'], ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'], ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9']], ['', 'p4', 'p9'], 'INST·10', ['ol-cnt', 'ol-tempo', 'ol-est'], 'ol-panel', 'ol-vd');
// INST·09 — cada ramo de viés e o aviso de soma
for (const [e, r] of [
  [[30, 25, 15, 10, 18, 2], [26, 22, 21, 9, 19, 3]], [[40, 20, 15, 10, 13, 2], [26, 22, 21, 9, 19, 3]], [[20, 25, 15, 10, 28, 2], [26, 22, 21, 9, 19, 3]],
  [[26, 32, 15, 9, 15, 3], [26, 22, 21, 9, 19, 3]], [[16, 32, 30, 9, 10, 3], [26, 22, 21, 9, 19, 3]], [[26, 22, 21, 9, 19, 3], [26, 22, 21, 9, 19, 3]], [[50, 50, 50, 0, 0, 0], [10, 10, 10, 10, 10, 10]],
]) {
  const m = novo(); const inp = {};
  e.forEach((v, k) => { digitar(m, `rb-e${k + 1}`, v); inp[`rb-e${k + 1}`] = v; });
  r.forEach((v, k) => { digitar(m, `rb-r${k + 1}`, v); inp[`rb-r${k + 1}`] = v; });
  comparar('INST·09', inp, m, ['rb-rows', 'rb-vd', 'rb-out'], ['rb-se', 'rb-sr', 'rb-err', 'rb-maior'], 'm10-inst-09');
}
// INST·11 — os 135 casos
for (const h of ['uma', 'seis', 'doze']) for (const mm of ['nao', 'parcial', 'sim']) for (const p of ['nao', 'estavel', 'mudanca']) for (const a of ['enq', 'dem', 'fp', 'amb', 'nada']) {
  const m = novo(); seg(m, 'rt-hist', 'data-h', h); seg(m, 'rt-mm', 'data-m', mm); seg(m, 'rt-plano', 'data-p', p); seg(m, 'rt-ach', 'data-a', a);
  comparar('INST·11', { 'rt-hist': h, 'rt-mm': mm, 'rt-plano': p, 'rt-ach': a }, m, ['rt-vd', 'rt-out'], [], 'm10-inst-11');
}

// ── campos do arquivo de conteúdo contra a extração ──────────────────────────
for (const x of EXT.instrumentos) {
  const inst = INSTRUMENTOS_MODULO_10.find((i) => i.id === x.id);
  const erros = [];
  if (!inst) { falhas++; console.log(`  ✗ ${x.id} ausente`); continue; }
  if (inst.title !== x.titulo) erros.push('título');
  const nota = colapsar(String(inst.note).replace(/<[^>]+>/g, ''));
  for (const parte of [x.intro?.html, x.aviso?.html]) if (parte && !nota.includes(colapsar(decodificar(parte.replace(/<[^>]+>/g, ''))))) erros.push(`nota sem «${parte.slice(0, 50)}»`);
  if (/<b>/.test(x.intro?.html ?? '') && !/<b>/.test(inst.note)) erros.push('nota perdeu o <b> da fonte');
  if (/\S [,.;:]/.test(inst.note)) erros.push('nota com pontuação solta');
  for (const s of x.saidas.filter((y) => y.rotulo)) if (!inst.outputs.some((o) => o.label === s.rotulo)) erros.push(`readout «${s.rotulo}» sem saída`);
  for (const e of x.entradas.filter((y) => y.rotulo)) if (!inst.fields.some((f) => f.label === e.rotulo)) erros.push(`rótulo «${e.rotulo}» ausente`);
  const r = CALCULADORAS[x.id](Object.fromEntries(inst.fields.filter((f) => f.defaultValue !== '').map((f) => [f.id, f.defaultValue])));
  for (const o of inst.outputs) if (!(o.id in (r.textos ?? {}))) erros.push(`saída ${o.id} não calculada no padrão`);
  const aula = MODULO_10_AULAS.find((a) => a.instruments.some((i) => i.id === x.id));
  const aulaEsperada = x.id === 'm10-inst-01' ? 'aula-10-01' : x.aula?.id_codigo;
  if (aula?.id !== aulaEsperada) erros.push(`na aula ${aula?.id}, a fonte diz ${aulaEsperada}`);
  cenarios++;
  if (erros.length) { falhas++; console.log(`  ✗ ${x.id}: ${erros.join(' · ')}`); }
}

console.log(`\n${cenarios} cenários conferidos · ${falhas} falha(s)`);
console.log(falhas ? 'RESULTADO: FALHA' : 'RESULTADO: 0 falhas');
process.exit(falhas ? 1 : 0);
