// Confere as calculadoras do M07 (src/lib/data/calculadoras/m07.ts) contra o <script> ORIGINAL
// de `alexandria_modulo07.html`, executado num DOM simulado (tools/alexandria-dados/mini-dom.mjs).
//
// Exploradores (01, 02, 03, 05, 07, 08, 09, 10): para CADA opção, clica o chip/botão na fonte e lê o
// painel (e os cartões); roda a calculadora com a mesma opção. Inst 01: cada nó × cada fluxo.
// Inst 04 e 06: grade de valores em cada campo (os outros no padrão) + o cenário padrão.
//
//   PERDA    — palavra (multiconjunto) do texto da fonte que falta no veredito + textos da calculadora;
//   INVENÇÃO — palavra do veredito que não está no texto da fonte (painel, cartões, legenda, readouts),
//              fora as admitidas: rótulos literais da fonte usados na forma (os títulos "Autoridade"/
//              "Dado" do Inst 01, que vêm dos botões do seletor da própria fonte);
//   LEITURA  — `textos` dos Inst 04/06 diferente do readout da fonte (texto visível, unidade junto).
//
// Uso: node tools/alexandria-dados/porte/verificar-instrumentos-m07.mjs   (sai com 1 se houver falha)

import { registerHooks } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { carregarModulo } from '../mini-dom.mjs';
import { editorial } from './corpo-m06-m08.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx); } catch (e) {
      if (spec.startsWith('@/')) return next(pathToFileURL(path.join(RAIZ, 'src', spec.slice(2) + '.ts')).href, ctx);
      if (/^\.\.?\//.test(spec) && !/\.\w+$/.test(spec)) return next(spec + '.ts', ctx);
      throw e;
    }
  },
});
const { INSTRUMENTOS_MODULO_07, MODULO_07_INSTRUMENTOS } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-modulo-07-content.ts')).href);
const SAIDAS = Object.fromEntries([...INSTRUMENTOS_MODULO_07, ...MODULO_07_INSTRUMENTOS].map((i) => [i.id, i.outputs.map((o) => o.id)]));
const { CALCULADORAS } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/calculadoras/m07.ts')).href);

const ENT = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', mdash: '—', ndash: '–', middot: '·', rarr: '→' };
const plano = (s) => String(s ?? '').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&(#\d+|[a-z]+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(+e.slice(1)) : ENT[e] ?? m));
const palavras = (s) => (plano(s).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
const conta = (ws) => ws.reduce((m, w) => m.set(w, (m.get(w) ?? 0) + 1), new Map());
function compara(fonte, nosso, admitidas = []) {
  // trocas editoriais (P24, Bloco N → Módulo NN) aplicadas ao lado da FONTE, como no corpo
  const f = conta(palavras(editorial(plano(fonte))));
  const o = conta(palavras(nosso));
  const perda = [...f].filter(([w, c]) => (o.get(w) ?? 0) < c).map(([w, c]) => `${w}×${c - (o.get(w) ?? 0)}`);
  const adm = new Set(admitidas.flatMap(palavras));
  const inv = [...o].filter(([w, c]) => (f.get(w) ?? 0) < c && !adm.has(w)).map(([w]) => w);
  return { perda, inv };
}

const falhas = [];
const casos = {};
const F = (id, msg) => falhas.push(`${id}: ${msg}`);
// O que a tela mostra: veredito + `textos` das SAÍDAS do instrumento (textos auxiliares da previsão,
// como `i8-orgao`, não são saída e não aparecem).
const saidaDe = (r, id) => `${r.veredito ?? ''} ${(SAIDAS[id] ?? []).map((o) => r.textos?.[o] ?? '').join(' ')}`;

// ── exploradores ─────────────────────────────────────────────────────────────
const EXPL = [
  { id: 'm07-inst-02', host: 'i2-grid', alvos: ['i2-panel'], campo: 'i2-sel' },
  { id: 'm07-inst-03', host: 'i3-grid', alvos: ['i3-panel'], campo: 'i3-sel' },
  { id: 'm07-inst-05', host: 'i5-chips', alvos: ['i5-panel'], campo: 'i5-sel' },
  { id: 'm07-inst-07', host: 'i7-grid', alvos: ['i7-panel'], campo: 'i7-sel' },
  { id: 'm07-inst-08', host: 'i8-grid', alvos: ['i8-panel', 'i8-out'], campo: 'i8-sel' },
  { id: 'm07-inst-09', host: 'i9-grid', alvos: ['i9-panel', 'i9-out'], campo: 'i9-sel' },
  { id: 'm07-inst-10', host: 'i10-cal', alvos: ['i10-panel'], campo: 'i10-sel' },
];
for (const e of EXPL) {
  const m = carregarModulo(7);
  const bs = m.el(e.host).querySelectorAll('button');
  casos[e.id] = bs.length;
  for (let k = 0; k < bs.length; k++) {
    m.disparar(bs[k], 'click');
    const fonte = e.alvos.map((a) => m.el(a).innerHTML).join(' ');
    const r = CALCULADORAS[e.id]({ [e.campo]: String(k) });
    const { perda, inv } = compara(fonte, saidaDe(r, e.id));
    if (perda.length) F(`${e.id}#${k}`, `PERDA ${perda.join(' ')}`);
    if (inv.length) F(`${e.id}#${k}`, `INVENÇÃO ${inv.join(' ')}`);
  }
}

// ── Inst 01 (§MAP): cada nó × cada fluxo; a fonte mostra painel + legenda (+ rótulos das setas no SVG)
{
  const m = carregarModulo(7);
  const nos = m.el('i1-chips').querySelectorAll('button');
  const fluxos = m.el('i1-seg').querySelectorAll('button');
  casos['m07-inst-01'] = nos.length * fluxos.length;
  const ORD = ['cnpe', 'mme', 'anl', 'epe', 'ons', 'ccee', 'cmse', 'ag'];
  for (let f = 0; f < fluxos.length; f++) {
    m.disparar(fluxos[f], 'click');
    for (let k = 0; k < nos.length; k++) {
      m.disparar(nos[k], 'click');
      const svg = m.el('i1-svg').innerHTML;
      const fonte = `${m.el('i1-panel').innerHTML} ${m.el('i1-leg').innerHTML} ${svg.replace(/<text[^>]*>([^<]*)<\/text>/g, ' $1 ').replace(/<[^>]+>/g, ' ')}`;
      const r = CALCULADORAS['m07-inst-01']({ 'm07-i1-sel': ORD[k], 'm07-i1-flow': fluxos[f].attrs['data-f'] });
      // Só perda do painel e da legenda conta (o SVG desenha TODAS as setas; nós listamos as do nó).
      const { perda } = compara(`${m.el('i1-panel').innerHTML} ${m.el('i1-leg').innerHTML}`, saidaDe(r, 'm07-inst-01'));
      const chips = nos.map((b) => b.textContent);
      const { inv } = compara(fonte, saidaDe(r, 'm07-inst-01'), ['Autoridade', 'Dado', ...chips]);
      if (perda.length) F(`m07-inst-01#${ORD[k]}/${fluxos[f].attrs['data-f']}`, `PERDA ${perda.join(' ')}`);
      if (inv.length) F(`m07-inst-01#${ORD[k]}/${fluxos[f].attrs['data-f']}`, `INVENÇÃO ${inv.join(' ')}`);
    }
  }
}

// ── Inst 04 e 06: grade por campo ────────────────────────────────────────────
const SIM = [
  { id: 'm07-inst-04', campos: ['i4-a', 'i4-b', 'i4-c', 'i4-d', 'i4-e', 'i4-f'], leituras: ['i4-tot', 'i4-jan', 'i4-avi', 'i4-reg'], vd: 'i4-vd' },
  { id: 'm07-inst-06', campos: ['i6-a', 'i6-b', 'i6-c', 'i6-d', 'i6-e'], leituras: ['i6-tot', 'i6-jan', 'i6-fol', 'i6-reg'], vd: 'i6-vd' },
];
for (const s of SIM) {
  let n = 0;
  const m0 = carregarModulo(7);
  const faixa = (c) => { const e = m0.el(c); return { min: +e.attrs.min, max: +e.attrs.max, padrao: +e.attrs.value }; };
  const pontos = (c) => { const { min, max } = faixa(c); return [...new Set([min, max, Math.round((min + max) / 2), Math.round(min + (max - min) / 7), Math.round(min + (max - min) / 3), 1, 3, 5, 15, 30, 45, 90, 180].filter((v) => v >= min && v <= max))]; };
  const casosDoSim = [null, ...s.campos.flatMap((c) => pontos(c).map((v) => [c, v]))];
  for (const caso of casosDoSim) {
    const m = carregarModulo(7);
    const ent = {};
    for (const c of s.campos) ent[`${c}-n`] = faixa(c).padrao;
    if (caso) {
      const [c, v] = caso;
      m.el(c).value = String(v);
      m.disparar(c, 'input');
      ent[`${c}-n`] = v;
    }
    n++;
    const r = CALCULADORAS[s.id](ent);
    for (const l of s.leituras) {
      const fonte = plano(m.el(l).innerHTML).replace(/\s+/g, ' ').trim();
      const nosso = plano(r.textos?.[l] ?? '').replace(/\s+/g, ' ').trim();
      if (fonte.replace(/\s/g, '') !== nosso.replace(/\s/g, '')) F(`${s.id}${caso ? `#${caso.join('=')}` : '#padrão'}`, `LEITURA ${l}: fonte «${fonte}» × nosso «${nosso}»`);
    }
    const { perda, inv } = compara(m.el(s.vd).innerHTML, r.veredito);
    if (perda.length || inv.length) F(`${s.id}${caso ? `#${caso.join('=')}` : '#padrão'}`, `VEREDITO perda [${perda.join(' ')}] invenção [${inv.join(' ')}]`);
  }
  casos[s.id] = n;
}

console.log('M07 · instrumentos contra o script original executado');
for (const [k, v] of Object.entries(casos)) console.log(`   ${k}: ${v} casos`);
for (const f of falhas.slice(0, 40)) console.log('   ✗ ' + f.slice(0, 300));
console.log(falhas.length ? `   RESULTADO: ${falhas.length} falha(s)` : '   RESULTADO: 0 falhas');
process.exit(falhas.length ? 1 : 0);
