// Confere as calculadoras do M08 contra o <script> ORIGINAL de `alexandria_modulo08.html`, executado
// num DOM simulado (tools/alexandria-dados/mini-dom.mjs). Modelo: verificar-instrumentos-m07.mjs.
//
//   · INST 03 (calculadoras/m08.ts): cada fonte de referência × grade de potência, energia e período —
//     leituras idênticas ao readout da fonte (texto visível, unidade junto) e veredito sem perda nem invenção.
//   · INST 04 (D17, um objeto): as duas rodadas × estimativas (vazias, parciais, cheias, soma fora de 100,
//     ordem certa e errada) — antes do gesto de corrigir, a calculadora mostra a instrução da rodada que a
//     fonte mostra; depois, leituras e veredito da fonte (linhas de erro por fonte incluídas).
//   · Demais (01, 02, 05–11, porte antigo, sem override): estado inicial do script × calculadora no padrão —
//     o veredito/painel da fonte não pode perder palavra nem ganhar palavra que a fonte não tenha.
//
// Trocas editoriais (P24, Bloco N → Módulo NN) aplicadas ao lado da fonte. Uso:
//   node tools/alexandria-dados/porte/verificar-instrumentos-m08.mjs   (sai com 1 se houver falha)

import { registerHooks } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { carregarModulo } from '../mini-dom.mjs';
import { editorial } from './corpo-m06-m08.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
registerHooks({
  resolve(s, c, n) {
    try { return n(s, c); } catch (e) {
      let base = null;
      if (s.startsWith('@/')) base = path.join(RAIZ, 'src', s.slice(2));
      else if (/^\.\.?\//.test(s) && c.parentURL) base = path.join(path.dirname(fileURLToPath(c.parentURL)), s);
      if (!base) throw e;
      for (const cand of [base + '.ts', base + '.tsx', path.join(base, 'index.ts')]) if (fs.existsSync(cand)) return n(pathToFileURL(cand).href, c);
      throw e;
    }
  },
});
const { INSTRUMENT_CALCULATORS: C } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-instrument-calculators.ts')).href);
const { MODULO_08_AULAS, MODULO_08_INSTRUMENTOS } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-modulo-08-content.ts')).href);
const INST = Object.fromEntries([...MODULO_08_AULAS.flatMap((a) => a.instruments), ...MODULO_08_INSTRUMENTOS].map((i) => [i.id, i]));

const ENT = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', mdash: '—', ndash: '–', middot: '·', minus: '−' };
const plano = (s) => String(s ?? '').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&(#\d+|[a-z]+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(+e.slice(1)) : ENT[e] ?? m)).replace(/\s+/g, ' ').trim();
const palavras = (s) => (plano(s).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
const conta = (ws) => ws.reduce((m, w) => m.set(w, (m.get(w) ?? 0) + 1), new Map());
function compara(fonte, nosso) {
  const f = conta(palavras(editorial(plano(fonte))));
  const o = conta(palavras(nosso));
  return {
    perda: [...f].filter(([w, c]) => (o.get(w) ?? 0) < c).map(([w, c]) => `${w}×${c - (o.get(w) ?? 0)}`),
    inv: [...o].filter(([w, c]) => (f.get(w) ?? 0) < c).map(([w]) => w),
  };
}
const falhas = [];
const casos = {};
const F = (id, msg) => falhas.push(`${id}: ${msg}`);
const naTela = (r, id) => `${r.veredito ?? ''} ${INST[id].outputs.map((o) => r.textos?.[o.id] ?? '').join(' ')}`;
const clicar = (m, host, valor) => {
  const b = m.el(host).querySelectorAll('button').find((x) => Object.values(x.attrs).includes(valor));
  m.disparar(b, 'click');
};
const definir = (m, id, v) => { m.el(id).value = String(v); m.disparar(id, 'input'); };

// ── INST 03 ─────────────────────────────────────────────────────────────────
{
  let n = 0;
  const grade = { p: [1, 100, 300, 1000, 15000], e: [1, 876, 1200, 20000, 80000], h: [24, 720, 8760, 8784] };
  for (const s of ['hid', 'eol', 'sol', 'bio', 'gas', 'nuc']) for (const p of grade.p) for (const e of grade.e) for (const h of [8760, 720]) {
    const m = carregarModulo(8);
    clicar(m, 'i3-seg', s);
    definir(m, 'i3-p', p); definir(m, 'i3-e', e); definir(m, 'i3-h', h);
    const r = C['m08-inst-03']({ 'i3-s': s, 'i3-p': p, 'i3-e': e, 'i3-h': h });
    n++;
    const ro = m.el('i3-out').querySelectorAll('.ro').map((x) => plano(x.querySelectorAll('.n')[0].innerHTML));
    const nossos = [r.textos['i3-teor'], r.textos['i3-fc'], r.textos['i3-heq'], r.textos['i3-fx'].split(' · ')[1]];
    ro.forEach((t, k) => { if (t.replace(/\s/g, '') !== String(nossos[k]).replace(/\s/g, '')) F(`m08-inst-03#${s}/${p}/${e}/${h}`, `LEITURA ${k}: fonte «${t}» × nosso «${nossos[k]}»`); });
    const { perda, inv } = compara(`${m.el('i3-out').innerHTML} ${m.el('i3-vd').innerHTML}`, `${naTela(r, 'm08-inst-03')} Energia teórica máxima Fator de capacidade Horas equivalentes a plena carga Faixa típica`);
    if (perda.length || inv.length) F(`m08-inst-03#${s}/${p}/${e}/${h}`, `perda [${perda.join(' ')}] invenção [${inv.join(' ')}]`);
  }
  casos['m08-inst-03'] = n;
}

// ── INST 04 ─────────────────────────────────────────────────────────────────
{
  let n = 0;
  const fontes = ['hid', 'sol', 'eol', 'bio', 'fos', 'nuc'];
  const conjuntos = [
    {},
    { hid: 40, sol: 20 },
    { hid: 42, sol: 25, eol: 13, bio: 7, fos: 12, nuc: 1 },
    { hid: 52, sol: 11, eol: 15, bio: 8, fos: 12, nuc: 2 },
    { hid: 60, sol: 10, eol: 10, bio: 10, fos: 5, nuc: 5 },
    { hid: 30, sol: 30, eol: 30, bio: 30, fos: 30, nuc: 30 },
    { hid: 10, sol: 40, eol: 20, bio: 10, fos: 15, nuc: 5 },
    { hid: 45, sol: 20, eol: 15, bio: 5, fos: 14.5, nuc: 0.5 },
  ];
  for (const rod of ['cap', 'ger']) for (const c of conjuntos) for (const corrigir of [false, true]) {
    const m = carregarModulo(8);
    clicar(m, 'i4-seg', rod);
    for (const f of fontes) if (c[f] !== undefined) definir(m, `i4i-${f}`, c[f]);
    if (corrigir) m.disparar('i4-go', 'click');
    const ent = { 'i4-rodada': rod, 'i4-corrigir': corrigir ? 'sim' : 'nao', ...Object.fromEntries(fontes.filter((f) => c[f] !== undefined).map((f) => [`i4-${f}`, c[f]])) };
    const r = C['m08-inst-04'](ent);
    n++;
    const fonte = `${m.el('i4-res').innerHTML} ${m.el('i4-vd').innerHTML}`;
    const rotulos = corrigir && r.textos ? ' Fontes dentro da tolerância Erro absoluto total Sua soma Ordem das fontes' : '';
    const { perda, inv } = compara(fonte, naTela(r, 'm08-inst-04') + rotulos);
    if (perda.length || inv.length) F(`m08-inst-04#${rod}/${JSON.stringify(c)}/${corrigir ? 'corrigido' : 'antes'}`, `perda [${perda.join(' ')}] invenção [${inv.join(' ')}]`);
  }
  casos['m08-inst-04'] = n;
}

// ── demais: estado inicial ─────────────────────────────────────────────────
{
  const ALVOS = {
    'm08-inst-01': ['i1-panel'],
    'm08-inst-02': ['i2-vd'],
    'm08-inst-05': [],
    'm08-inst-06': ['i6-vd'],
    'm08-inst-07': ['i7-panel'],
    'm08-inst-08': ['i8-vd'],
    'm08-inst-09': ['i9-vd'],
    'm08-inst-10': ['i10-vd'],
    'm08-inst-11': ['i11-out'],
  };
  const m = carregarModulo(8);
  for (const [id, alvos] of Object.entries(ALVOS)) {
    if (!alvos.length) continue;
    const i = INST[id];
    const ent = Object.fromEntries(i.fields.filter((f) => f.defaultValue !== '').map((f) => [f.id, f.defaultValue]));
    const r = C[id](ent);
    const fonte = alvos.map((a) => m.el(a).innerHTML).join(' ');
    const { perda } = compara(fonte, naTela(r, id) + ' ' + i.outputs.map((o) => o.label).join(' '));
    casos[id] = 1;
    if (perda.length) F(`${id}#padrão`, `perda [${perda.join(' ')}]`);
  }
}

console.log('M08 · instrumentos contra o script original executado');
for (const [k, v] of Object.entries(casos)) console.log(`   ${k}: ${v} caso(s)`);
for (const f of falhas.slice(0, 40)) console.log('   ✗ ' + f.slice(0, 320));
console.log(falhas.length ? `   RESULTADO: ${falhas.length} falha(s)` : '   RESULTADO: 0 falhas');
process.exit(falhas.length ? 1 : 0);
