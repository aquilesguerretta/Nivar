// verificar-instrumentos-m11.mjs — confere as calculadoras do M11 (código literal da fonte
// rodando no ambiente mínimo de calculadoras/m11.ts) contra o script ORIGINAL rodando no
// mini-dom, e os campos de M11_INSTRUMENTOS contra a extração.
//
// Compara: `textos` de cada readout (igualdade com o texto que a fonte imprime) e o texto
// das telas (painéis e veredito, na ordem da fonte) — tags fora, entidades decodificadas,
// só o ESPAÇO ignorado. Também confere que o "Passo NN" do INST·11 marca exatamente os
// pontos de sincronização que o dado declara (D13: 2, nos passos 04 e 08).
//
// Uso: node tools/alexandria-dados/porte/verificar-instrumentos-m11.mjs

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { carregarModulo, decodificar } from '../mini-dom.mjs';
import { RAIZ } from './porte-m09-m11-comum.mjs';
import { CORRECOES } from './correcoes-m11.mjs';

const { CALCULADORAS } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/calculadoras/m11.ts')).href);
const { MODULO_11_AULAS } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-modulo-11-content.ts')).href);
const EXT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m11/instrumentos.json'), 'utf8'));
const INST = [...new Map(MODULO_11_AULAS.flatMap((a) => a.instruments).map((x) => [x.id, x])).values()];

const compacto = (s) => decodificar(String(s ?? '').replace(/<[^>]+>/g, '')).replace(/[\s ]+/g, '');
const colapsar = (s) => String(s ?? '').replace(/[\s ]+/g, ' ').trim();
let falhas = 0;
let cenarios = 0;
const novo = () => carregarModulo(11, { instrumentar: false });
const clicar = (m, el) => { if (!el) throw new Error('elemento ausente'); m.disparar(el, 'click'); };
const botao = (m, w, attr, v) => clicar(m, m.el(w).querySelectorAll('button').find((b) => b.attrs[attr] === v));
function digitar(m, id, v) { const e = m.el(id); e.value = String(v); m.disparar(e, 'input'); m.disparar(e, 'change'); }

// CORREÇÕES (correcoes-m11.mjs): o original roda sem elas; o efeito de cada uma é aplicado
// à saída dele antes de comparar. Q13 (acentos, INST·02): troca de texto. Q07 (limiar,
// INST·04): com 1.000 kW exatos, o parágrafo do ramo "abaixo de 1.000 kW" vira o do ramo
// "1.000 kW ou mais" — as duas frases lidas do próprio script.
const HTML11 = fs.readFileSync('C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo11.html', 'utf8');
const pushDe = (prefixo) => {
  const i = HTML11.indexOf(prefixo);
  if (i < 0 || HTML11.indexOf(prefixo, i + 1) >= 0) throw new Error(`prefixo não único: ${prefixo}`);
  const ini = i + prefixo.length;
  return HTML11.slice(ini, HTML11.indexOf("');", ini));
};
const LIMIAR = { abaixo: compacto(pushDe("else if(pot>500)t.push('")), acima: compacto(pushDe("if(pot>1000)t.push('")) };
let corrigidos = 0;
function efeitoDasCorrecoes(calcId, entrada, fonte) {
  let out = fonte;
  for (const c of CORRECOES.filter((x) => `m11-inst-${x.inst}` === calcId && x.regra === 'Q13')) out = out.split(compacto(c.de)).join(compacto(c.para));
  if (calcId === 'm11-inst-04' && Number(entrada['cl-pot']) === 1000) {
    if (!out.includes(LIMIAR.abaixo)) throw new Error('o original deixou de mostrar o ramo "abaixo de 1.000 kW" em 1.000 kW');
    out = out.replace(LIMIAR.abaixo, LIMIAR.acima);
  }
  if (out !== fonte) corrigidos++;
  return out;
}

function comparar(nome, entrada, m, telas, readouts, calcId) {
  cenarios++;
  const r = CALCULADORAS[calcId](entrada);
  const erros = [];
  const fonte = efeitoDasCorrecoes(calcId, entrada, telas.map((id) => compacto(m.el(id)?.textContent ?? '')).join(''));
  const porte = compacto(r.veredito);
  if (fonte !== porte) {
    let k = 0; while (k < fonte.length && fonte[k] === porte[k]) k++;
    erros.push(`texto difere na posição ${k}:\n      fonte: «${fonte.slice(Math.max(0, k - 40), k + 70)}»\n      porte: «${porte.slice(Math.max(0, k - 40), k + 70)}»`);
  }
  for (const id of readouts) {
    const f = colapsar(m.texto(id));
    const p = colapsar(decodificar(String(r.textos?.[id] ?? '').replace(/<[^>]+>/g, '')));
    if (f !== p) erros.push(`textos.${id}: fonte «${f}» × porte «${p}»`);
  }
  if (r.vereditoPtBr !== true) erros.push('vereditoPtBr ausente');
  if (erros.length) { falhas++; if (falhas <= 20) console.log(`  ✗ ${nome} ${JSON.stringify(entrada)}\n    ${erros.join('\n    ')}`); }
}

// INST·01 — 4 lentes × 10 itens
for (const l of ['eixo', 'fonte', 'sozinho', 'falta']) for (const it of ['pot', 'ger', 'deg', 'equip', 'mod', 'data', 'reg', 'tar', 'om', 'gar']) {
  const m = novo(); botao(m, 'mp-seg', 'data-l', l); botao(m, 'mp-grid', 'data-i', it);
  comparar('INST·01', { 'mp-lente': l, 'mp-item': it }, m, ['mp-lens', 'mp-item'], [], 'm11-inst-01');
}
// INST·02 — 12 afirmações
for (let k = 1; k <= 12; k++) {
  const m = novo(); botao(m, 'se-grid', 'data-a', `a${k}`);
  comparar('INST·02', { 'se-a': `a${k}` }, m, ['se-out'], [], 'm11-inst-02');
}
// INST·03 — 7 marcos
for (let k = 1; k <= 7; k++) {
  const m = novo(); botao(m, 'rg-nav', 'data-m', `m${k}`);
  comparar('INST·03', { 'rg-m': `m${k}` }, m, ['rg-panel'], [], 'm11-inst-03');
}
// INST·04 — potência nos limiares × fonte × arranjo
for (const pot of [1, 50, 75, 76, 180, 500, 501, 999, 1000, 1001, 3000, 3001, 5000, 5001, 6000]) for (const f of ['solar', 'solarbat', 'desp']) for (const a of ['local', 'remoto', 'compart', 'emuc']) {
  const m = novo(); digitar(m, 'cl-pot', pot); botao(m, 'cl-fonte', 'data-f', f); botao(m, 'cl-arr', 'data-a', a);
  comparar('INST·04', { 'cl-pot': pot, 'cl-fonte': f, 'cl-arr': a }, m, ['cl-vd'], ['cl-porte', 'cl-teto', 'cl-mod'], 'm11-inst-04');
}
// INST·05 — protocolo × porte × modalidade × ano
for (const d of ['ate2022', 'doze', 'semestre', 'depois']) for (const p of ['micro', 'mini500', 'mini500mais']) for (const md of ['localemuc', 'pulv', 'conc']) for (const ano of [2023, 2026, 2027, 2028, 2029, 2030, 2031, 2032]) {
  const m = novo(); botao(m, 'rr-data', 'data-d', d); botao(m, 'rr-porte', 'data-p', p); botao(m, 'rr-mod', 'data-m', md); digitar(m, 'rr-ano', ano);
  comparar('INST·05', { 'rr-data': d, 'rr-porte': p, 'rr-mod': md, 'rr-ano': ano }, m, ['rr-vd'], ['rr-classe', 'rr-perc', 'rr-estado'], 'm11-inst-05');
}
// INST·06 — todas as faixas do desvio e o desempenho implícito acima de 95%
for (const [pot, ger, irr, pr] of [[100, 175, 5.2, 78], [100, 148, 5.2, 78], [100, 160, 5.2, 78], [100, 190, 5.2, 78], [100, 230, 5.2, 78], [100, 120, 5.2, 78], [100, 185, 5.2, 50], [1, 6000, 2, 92], [3000, 1, 7.5, 50]]) {
  const m = novo(); for (const [k, v] of [['pot', pot], ['ger', ger], ['irr', irr], ['pr', pr]]) digitar(m, 'gv-' + k, v);
  comparar('INST·06', { 'gv-pot': pot, 'gv-ger': ger, 'gv-irr': irr, 'gv-pr': pr }, m, ['gv-vd'], ['gv-ref', 'gv-dev', 'gv-prim'], 'm11-inst-06');
}
// INST·07 — degradação zero, primeiro ano zero, e cada faixa de delta
for (const [prop, ds, y1, hz] of [[0.4, 0.55, 2, 25], [0, 0.55, 2, 25], [0.4, 0.55, 0, 25], [0.6, 0.55, 2, 25], [0.5, 0.55, 2, 25], [0.4, 0.6, 2, 25], [0.2, 0.7, 2, 30], [2, 2, 5, 5]]) {
  const m = novo(); for (const [k, v] of [['prop', prop], ['ds', ds], ['y1', y1], ['hz', hz]]) digitar(m, 'dg-' + k, v);
  comparar('INST·07', { 'dg-prop': prop, 'dg-ds': ds, 'dg-y1': y1, 'dg-hz': hz }, m, ['dg-vd'], ['dg-p1', 'dg-p2', 'dg-gap'], 'm11-inst-07');
}
// INST·08 — faixas do afastamento × ancoragem
for (const [p, h, hz] of [[9, 6, 20], [7, 6, 20], [6.25, 6, 20], [5, 6, 20], [0, 20, 5], [20, 0, 30]]) for (const anc of ['fonte', 'soi', 'nada']) {
  const m = novo(); digitar(m, 'tt-prop', p); digitar(m, 'tt-hist', h); digitar(m, 'tt-hz', hz); botao(m, 'tt-anc', 'data-t', anc);
  comparar('INST·08', { 'tt-prop': p, 'tt-hist': h, 'tt-hz': hz, 'tt-anc': anc }, m, ['tt-vd'], ['tt-gap', 'tt-i1', 'tt-exc'], 'm11-inst-08');
}
// INST·09 — 8 sinais
for (const s of ['ger', 'fin', 'deg', 'tar', 'cert', 'gar', 'oem', 'reg']) {
  const m = novo(); botao(m, 'sa-grid', 'data-s', s);
  comparar('INST·09', { 'sa-s': s }, m, ['sa-out'], [], 'm11-inst-09');
}
// INST·10 — as 81 combinações
for (const a of ['ok', 'desvio', 'falta']) for (const b of ['ok', 'erro', 'falta']) for (const c of ['ok', 'solta', 'omissa']) for (const d of ['ok', 'lacuna', 'ausente']) {
  const m = novo(); botao(m, 'rv-e1', 'data-v', a); botao(m, 'rv-e2', 'data-v', b); botao(m, 'rv-e3', 'data-v', c); botao(m, 'rv-e4', 'data-v', d);
  comparar('INST·10', { 'rv-e1': a, 'rv-e2': b, 'rv-e3': c, 'rv-e4': d }, m, ['rv-vd'], [], 'm11-inst-10');
}
// INST·11 — 8 passos (o script recria a navegação a cada render: busca o botão depois)
for (let k = 0; k < 8; k++) {
  const m = novo(); botao(m, 'or-nav', 'data-i', String(k));
  comparar('INST·11', { 'or-p': String(k) }, m, ['or-panel', 'or-bars'], [], 'm11-inst-11');
}
// D13: o dado marca 2 pontos de sincronização, nos passos 04 e 08
{
  const sinc = [];
  for (let k = 0; k < 8; k++) if (/ponto de sincronização/.test(CALCULADORAS['m11-inst-11']({ 'or-p': String(k) }).veredito)) sinc.push(k + 1);
  cenarios++;
  if (JSON.stringify(sinc) !== '[4,8]') { falhas++; console.log(`  ✗ D13: pontos de sincronização nos passos ${sinc.join(', ')} (esperado 4 e 8)`); }
}

// ── campos contra a extração ─────────────────────────────────────────────────
for (const x of EXT.instrumentos) {
  const inst = INST.find((i) => i.id === x.id);
  const erros = [];
  if (!inst) { falhas++; console.log(`  ✗ ${x.id} fora das aulas`); continue; }
  if (inst.title !== x.titulo) erros.push('título');
  const nota = colapsar(decodificar(String(inst.note).replace(/<[^>]+>/g, '')));
  for (const parte of [x.intro?.html, x.nota_de_fonte?.html]) if (parte && !nota.includes(colapsar(decodificar(parte.replace(/<[^>]+>/g, '').replace(/GridAlpha/g, 'NIVAR'))))) erros.push(`nota sem «${parte.slice(0, 50)}»`);
  for (const r of x.saidas.readouts ?? []) if (!inst.outputs.some((o) => o.label === r.rotulo)) erros.push(`readout «${r.rotulo}» sem saída`);
  for (const c of [...(x.entradas.campos_numericos ?? []), ...(x.entradas.seletores ?? [])]) if (!inst.fields.some((f) => f.label === c.rotulo)) erros.push(`rótulo «${c.rotulo}» ausente`);
  const r = CALCULADORAS[x.id](Object.fromEntries(inst.fields.map((f) => [f.id, f.defaultValue])));
  for (const o of inst.outputs) if (!(o.id in (r.textos ?? {}))) erros.push(`saída ${o.id} não calculada no padrão`);
  if (!r.veredito) erros.push('veredito vazio no padrão');
  const aula = MODULO_11_AULAS.find((a) => a.instruments.some((i) => i.id === x.id));
  const esperada = x.id === 'm11-inst-01' ? 'aula-11-01' : `aula-11-${String(x.localizacao?.aula).padStart(2, '0')}`;
  if (aula?.id !== esperada) erros.push(`na aula ${aula?.id}, a extração diz ${esperada}`);
  cenarios++;
  if (erros.length) { falhas++; console.log(`  ✗ ${x.id}: ${erros.join(' · ')}`); }
}

if (corrigidos < 2) { falhas++; console.log(`  ✗ as correções foram exercitadas em só ${corrigidos} cenário(s)`); }
console.log(`\n${cenarios} cenários conferidos (${corrigidos} com o efeito de uma CORREÇÃO aplicado ao original) · ${falhas} falha(s)`);
console.log(falhas ? 'RESULTADO: FALHA' : 'RESULTADO: 0 falhas');
process.exit(falhas ? 1 : 0);
