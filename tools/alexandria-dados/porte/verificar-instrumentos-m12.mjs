// Verifica o porte dos 11 instrumentos do Módulo 12 contra o <script> da fonte.
//
// Para cada instrumento:
//   1. roda o <script> ORIGINAL de `alexandria_modulo12.html` num DOM simulado
//      (docs/alexandria-v2/extraction/m12/extratores/m12_dom.mjs) sobre o mesmo
//      espaço de entradas da extração (espaço inteiro nos 9 categóricos, grade +
//      vazio + fora de faixa nos 2 numéricos — a contagem de casos tem de bater com
//      `comparacao_execucao.casos` de instrumentos.json);
//   2. roda a calculadora EFETIVA — `INSTRUMENT_CALCULATORS['m12-inst-NN']`, já com
//      o override de src/lib/data/calculadoras/m12.ts — no mesmo estado;
//   3. reprova se:
//      (a) NÚMERO   — saída numérica da fonte difere de `valores[id]` nas casas que a
//                     fonte exibe (ou o código devolve número que a fonte não exibe);
//      (b) PERDA    — falta, no veredito + rótulos das saídas exibidas, alguma palavra
//                     (multiconjunto, letras) ou número do texto visível das saídas não
//                     numéricas da fonte — meta: cobertura 100%;
//      (c) INVENÇÃO — palavra do veredito que não existe no texto do instrumento na
//                     fonte (texto visível do div.inst + literais de string do bloco
//                     INST·NN do script);
//      (d) CAMPO    — `label`, opções, padrão ou faixa de um campo do `Instrument`
//                     diferente da fonte (instrumentos.json → entradas), campo sem
//                     correspondente na fonte, ou saída sem leitura de mesmo rótulo;
//      (e) TAG      — veredito com tag HTML. O InstrumentoV3 mostra o veredito como
//                     texto puro, então tag apareceria literal na tela.
//
// Exceção editorial (aplicada ao lado da FONTE antes de comparar, contada e listada):
//   "seis categorias de prática…" → "sete categorias de prática…" nos INST·04 e
//   INST·06 — decisão Q04 / QA-M12-A04 do Founder (a fonte diz "seis" e lista sete).
//   A "taxonomia de seis categorias" da Aula 08 / INST·10 não muda.
//
// Uso: node tools/alexandria-dados/porte/verificar-instrumentos-m12.mjs [--detalhe]
// Sai com 1 se houver qualquer falha.

import { registerHooks } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const EXT = path.join(RAIZ, 'docs/alexandria-v2/extraction/m12');
const DETALHE = process.argv.includes('--detalhe');

// ── import dos .ts (Node 24 remove os tipos; o hook resolve extensão e '@/') ──
const SRC = path.join(RAIZ, 'src') + path.sep;
registerHooks({
  resolve(spec, ctx, next) {
    let s = spec;
    if (s.startsWith('@/')) s = pathToFileURL(SRC + s.slice(2)).href;
    if ((s.startsWith('.') || s.startsWith('file:')) && !/\.[cm]?[jt]sx?$|\.json$/.test(s)) {
      const base = s.startsWith('file:') ? s : new URL(s, ctx.parentURL).href;
      for (const ext of ['.ts', '.tsx', '/index.ts']) {
        const p = fileURLToPath(base + ext);
        if (fs.existsSync(p)) return next(pathToFileURL(p).href, ctx);
      }
    }
    return next(s, ctx);
  },
});

const { runOriginal } = await import(pathToFileURL(path.join(EXT, 'extratores/m12_dom.mjs')).href);
const { html, all, balanced, scriptBlock } = await import(pathToFileURL(path.join(EXT, 'extratores/m12_lib.mjs')).href);
const content = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-modulo-12-content.ts')).href);
const { INSTRUMENT_CALCULATORS: calcs } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-instrument-calculators.ts')).href);
const { CALCULADORAS: OVERRIDE } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/calculadoras/m12.ts')).href);
const EXTRACAO = JSON.parse(fs.readFileSync(path.join(EXT, 'instrumentos.json'), 'utf8'));
const CODE_INST = Object.fromEntries(content.INSTRUMENTOS_MODULO_12.map((i) => [i.id, i]));

// ── texto ────────────────────────────────────────────────────────────────────
const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const texto = (h) => decode(String(h ?? '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const palavras = (t) => t.toLowerCase().match(/\p{L}+/gu) || [];
// número como a fonte o escreve (pt-BR: 4.818 · 24,7 · 3,8); pontuação final fora
const numeros = (t) => (t.match(/\d+(?:[.,]\d+)*/g) || []);
const saco = (xs) => { const m = new Map(); for (const x of xs) m.set(x, (m.get(x) || 0) + 1); return m; };
/** o que de `fonte` (lista) não cabe no multiconjunto `alvo` (lista) */
function faltas(fonte, alvo) {
  const a = saco(alvo); const out = [];
  for (const x of fonte) { const n = a.get(x) || 0; if (n > 0) a.set(x, n - 1); else out.push(x); }
  return out;
}
const pt = (x) => { const m = texto(x).match(/[−-]?[\d.]+(?:,\d+)?/); if (!m) return null; return Number(m[0].replace('−', '-').replace(/\./g, '').replace(',', '.')); };
const pad = (n) => String(n).padStart(2, '0');

// ── exceção editorial (lado da fonte) ────────────────────────────────────────
const EDITORIAIS = [
  { inst: [4, 6], re: /seis categorias de prática/g, por: 'sete categorias de prática', razao: 'Q04/QA-M12-A04 (a fonte diz "seis" e lista sete práticas da Seção 301)' },
];
const usoEditorial = new Map();
function editorial(n, t) {
  let r = t;
  for (const e of EDITORIAIS) {
    if (!e.inst.includes(n)) continue;
    const k = (r.match(e.re) || []).length;
    if (k) { usoEditorial.set(e, (usoEditorial.get(e) || 0) + k); r = r.replace(e.re, e.por); }
  }
  return r;
}

// ── vocabulário do instrumento na fonte: texto do div.inst + literais do bloco INST·NN ──
const blocos = all(/<div class="inst">/g).map(({ idx }) => html.slice(idx, balanced(idx, 'div')));
if (blocos.length !== 11) throw new Error('esperava 11 div.inst');
function vocabulario(n) {
  const blk = scriptBlock(`INST·${pad(n)}`).text;
  const literais = [...blk.matchAll(/'((?:\\.|[^'\\])*)'/g)].map((m) => m[1]);
  const t = editorial(n, texto(blocos[n - 1]) + ' ' + texto(literais.join(' ')));
  return new Set(palavras(t));
}

// ── espaço de entradas (o mesmo do extrator m12_instrumentos.mjs) ─────────────
const prod = (arrs) => arrs.reduce((acc, a) => acc.flatMap((x) => a.map((y) => [...x, y])), [[]]);
const M11 = content.MODULO_12_MOVIMENTOS;
const SPEC = {
  1: { casos: () => prod([['cap', 'reg', 'cad'], ['prot', 'clima', 'bilat', 'h2', 'min']]),
    aplicar: (d, [v, f]) => { d.pick('tb-seg', 'data-v', v); d.pick('tb-grid', 'data-f', f); },
    saidas: ['tb-lens', 'tb-item'], codigo: ([v, f]) => ({ 'tb-seg': v, 'tb-frente': f }) },
  2: { casos: () => [...prod([[0, 50, 86.8, 100], [1, 19, 60, 100], [0, 41, 100], [0, 30, 45, 50, 100]]), ['', 19, 41, 50], [150, 19, 41, 50], [86.8, -5, 41, 50]],
    aplicar: (d, c) => ['sg-el', 'sg-pe', 'sg-ne', 'sg-of'].forEach((id, k) => d.setNum(id, c[k])),
    saidas: ['sg-ag', 'sg-di', 'sg-de', 'sg-co', 'sg-vd'], numericas: ['sg-ag', 'sg-di', 'sg-de', 'sg-co'],
    codigo: (c) => ({ 'sg-el': c[0], 'sg-pe': c[1], 'sg-ne': c[2], 'sg-of': c[3] }) },
  3: { casos: () => ['ren', 'g20', 'oleo', 'reserva', 'terra', 'ndc', 'cap', 'anun'].map((k) => [k]),
    aplicar: (d, [k]) => d.pick('vf-grid', 'data-n', k), saidas: ['vf-out'], codigo: ([k]) => ({ 'vn-sel': k }) },
  4: { casos: () => Array.from({ length: 12 }, (_, i) => [`m${i + 1}`]),
    aplicar: (d, [k]) => d.pick('rg-grid', 'data-m', k), saidas: ['rg-panel'], codigo: ([k]) => ({ 'rd-sel': k }) },
  5: { casos: () => prod([['china', 'eua', 'europa', 'brics'], ['cap', 'reg', 'cad']]),
    aplicar: (d, [p, v]) => { d.pick('cb-par', 'data-p', p); d.pick('cb-vet', 'data-v', v); },
    saidas: ['cb-out', 'cb-vd'], codigo: ([p, v]) => ({ 'cb-par': p, 'cb-vet': v }) },
  6: { casos: () => prod([['emerg', 's232', 's301', 's122'], ['energia', 'etanol', 'aco', 'terras', 'agro', 'manuf']]),
    aplicar: (d, [i, p]) => { d.pick('rt-inst', 'data-i', i); d.pick('rt-prod', 'data-p', p); },
    saidas: ['rt-aut', 'rt-pra', 'rt-jud', 'rt-rev', 'rt-vd', 'rt-nota'], codigo: ([i, p]) => ({ 'rt-inst': i, 'rt-prod': p }) },
  7: { casos: () => prod([['corp', 'portao', 'berco'], ['nao', 'int', 'ter'], ['nao', 'parc', 'sim'], ['nao', 'reg', 'op']]),
    aplicar: (d, [f, v, p, c]) => { d.pick('pc-fr', 'data-f', f); d.pick('pc-vr', 'data-v', v); d.pick('pc-pr', 'data-p', p); d.pick('pc-cd', 'data-c', c); },
    saidas: ['pc-pos', 'pc-blq', 'pc-vpd', 'pc-des', 'pc-vd'], codigo: ([f, v, p, c]) => ({ 'pc-fr': f, 'pc-vr': v, 'pc-pr': p, 'pc-cd': c }) },
  8: { casos: () => prod(Array.from({ length: 9 }, () => [0, 1, 2])),
    aplicar: (d, c) => c.forEach((v, k) => {
      const b = d.get('mp-itens').buttons().find((x) => x.getAttribute('data-k') === `i${k + 1}` && x.getAttribute('data-v') === String(v));
      d.click(b);
    }),
    saidas: ['mp-pts', 'mp-est', 'mp-vin', 'mp-blq', 'mp-vd', 'mp-red'], numericas: ['mp-pts', 'mp-vin'],
    // `mp-sel` não existe na fonte (o foco é automático): vai um valor qualquer, que
    // a calculadora tem de ignorar — o caso também roda sem ele e os dois têm de bater.
    codigo: (c, k) => ({ ...Object.fromEntries(c.map((v, j) => [`mp-e-i${j + 1}`, String(v)])), 'mp-sel': `i${(k % 9) + 1}` }) },
  9: { casos: () => [...prod([[0.1, 11.4, 21, 90, 200], [1, 85, 500], [0, 0.02, 1, 50, 500], [1, 390, 5000]]), ['', 85, 0.02, 390], [21, 85, '', 390]],
    aplicar: (d, c) => ['rp-rn', 'rp-rm', 'rp-pn', 'rp-pm'].forEach((id, k) => d.setNum(id, c[k])),
    saidas: ['rp-pr', 'rp-pp', 'rp-ra', 'rp-an', 'rp-vd'], numericas: ['rp-pr', 'rp-pp', 'rp-ra', 'rp-an'],
    codigo: (c) => ({ 'rp-rn': c[0], 'rp-rm': c[1], 'rp-pn': c[2], 'rp-pm': c[3] }) },
  10: { casos: () => Array.from({ length: 12 }, (_, i) => [`e${i + 1}`]),
    aplicar: (d, [k]) => d.pick('cn-grid', 'data-e', k), saidas: ['cn-out', 'cn-vd'], codigo: ([k]) => ({ 'cn-sel': k }) },
  11: { casos: () => Array.from({ length: 8 }, (_, i) => [i]),
    aplicar: (d, [i]) => d.pick('ad-nav', 'data-i', i), saidas: ['ad-bd'], codigo: ([i]) => ({ 'an-sel': M11[i].t }) },
};

// id do campo no código → id do controle na fonte (null = não existe na fonte)
const ID_FONTE = { 'tb-frente': 'tb-grid', 'vn-sel': 'vf-grid', 'rd-sel': 'rg-grid', 'cn-sel': 'cn-grid', 'an-sel': 'ad-nav', 'mp-sel': null };
for (let k = 1; k <= 9; k++) ID_FONTE[`mp-e-i${k}`] = `mp-i${k}`;

// ── campos e saídas do Instrument × fonte ────────────────────────────────────
function conferirCampos(n, inst) {
  const ext = EXTRACAO.instrumentos[n - 1];
  const fonte = [
    // no INST·08 o rótulo VISÍVEL do item crítico é "‹nome› · CRÍTICO" (L3645): é ele que vale
    ...ext.entradas.controles.map((c) => ({ id: c.id, rotulo: c.rotulo_render ?? c.rotulo, opcoes: c.opcoes })),
    ...ext.entradas.campos.map((c) => ({ id: c.id, rotulo: c.rotulo, unidade: c.unidade, padrao: c.padrao, min: c.faixa.min, max: c.faixa.max, passo: c.faixa.passo })),
  ];
  const falhas = []; const ressalvas = [];
  const usados = new Set();
  for (const f of inst.fields) {
    const fid = f.id in ID_FONTE ? ID_FONTE[f.id] : f.id;
    const s = fid ? fonte.find((x) => x.id === fid) : null;
    if (!s) { falhas.push(`campo ${f.id}: não existe na fonte${fid === null ? ' (a fonte escolhe o item em foco sozinha, L3693–3696)' : ''}`); continue; }
    usados.add(s.id);
    if (s.rotulo === null) ressalvas.push(`campo ${f.id}: a fonte não tem rótulo (label do código "${f.label}")`);
    else if (s.rotulo !== f.label) falhas.push(`campo ${f.id}: label "${f.label}" × fonte "${s.rotulo}"`);
    if (s.opcoes) {
      const ro = s.opcoes.map((o) => o.rotulo), rc = (f.options || []).map((o) => o.label);
      const vo = s.opcoes.map((o) => o.tempo ?? o.valor), vc = (f.options || []).map((o) => String(o.value));
      if (ro.join('|') !== rc.join('|')) falhas.push(`campo ${f.id}: opções (rótulos) diferem da fonte`);
      if (vo.join('|') !== vc.join('|')) falhas.push(`campo ${f.id}: opções (valores) diferem da fonte`);
      const padrao = (s.opcoes.find((o) => o.padrao_no_markup || o.padrao_no_script) ?? s.opcoes[0]);
      const pv = padrao.tempo ?? padrao.valor;
      if (String(f.defaultValue) !== String(pv)) falhas.push(`campo ${f.id}: defaultValue "${f.defaultValue}" × fonte "${pv}"`);
    }
    if (s.padrao !== undefined) {
      if (Number(f.defaultValue) !== s.padrao) falhas.push(`campo ${f.id}: defaultValue ${f.defaultValue} × fonte ${s.padrao}`);
      if (f.min !== s.min || f.max !== s.max || f.step !== s.passo) falhas.push(`campo ${f.id}: faixa [${f.min}, ${f.max}, ${f.step}] × fonte [${s.min}, ${s.max}, ${s.passo}]`);
      if (f.unit !== s.unidade) falhas.push(`campo ${f.id}: unit "${f.unit}" × fonte "${s.unidade}"`);
    }
  }
  for (const s of fonte) if (!usados.has(s.id)) falhas.push(`controle da fonte ${s.id} sem campo no código`);
  const leituras = ext.saidas.leituras;
  for (const o of inst.outputs) {
    const l = leituras.find((x) => x.id === o.id);
    if (!l) falhas.push(`saída ${o.id}: sem leitura na fonte`);
    else if (l.rotulo !== o.label) falhas.push(`saída ${o.id}: label "${o.label}" × fonte "${l.rotulo}"`);
  }
  return { falhas, ressalvas };
}

// ── execução ─────────────────────────────────────────────────────────────────
const linhas = [];
let totalFalhas = 0;
for (let n = 1; n <= 11; n++) {
  const id = `m12-inst-${pad(n)}`;
  const spec = SPEC[n];
  const inst = CODE_INST[id];
  const calc = calcs[id];
  const ext = EXTRACAO.instrumentos[n - 1];
  const falhas = [];
  if (!calc) { falhas.push('sem calculadora'); }
  const casos = spec.casos();
  if (casos.length !== ext.comparacao_execucao.casos) falhas.push(`espaço: ${casos.length} casos × extração ${ext.comparacao_execucao.casos}`);
  const vocab = vocabulario(n);
  const numSet = new Set(spec.numericas || []);
  const numFonte = new Set((ext.saidas.leituras || []).filter((l) => numSet.has(l.id)).map((l) => l.id));
  const d = runOriginal();
  let minCob = 1; let numOk = 0; let numTot = 0;
  const faltamT = new Map(); const inventadasT = new Map(); const exemplos = [];
  const ramos = new Set(); let tags = 0;
  const registrar = (msg) => { if (exemplos.length < 6) exemplos.push(msg); };
  casos.forEach((c, k) => {
    spec.aplicar(d, c);
    const r = calc(spec.codigo(c, k));
    if (n === 8) {
      const semSel = { ...spec.codigo(c, k) }; delete semSel['mp-sel'];
      const r2 = calc(semSel);
      if (r2.veredito !== r.veredito || JSON.stringify(r2.valores) !== JSON.stringify(r.valores)) registrar(`${JSON.stringify(c)}: mp-sel muda a saída (a fonte não tem esse campo)`);
    }
    const vd = spec.saidas.find((s) => /-vd$/.test(s));
    if (vd) ramos.add(`${d.get(vd).className}|${texto(d.out(vd)).slice(0, 40).replace(/\d[\d.,]*/g, '#')}`);
    const ver = r.veredito || '';
    if (/<\/?[a-z][^>]*>/i.test(ver)) tags++;
    // (a) números
    for (const sid of spec.numericas || []) {
      const sv = texto(d.out(sid)); const svn = pt(sv); const cv = r.valores?.[sid];
      numTot++;
      if (svn === null && cv === undefined) { numOk++; continue; }
      const dec = (sv.match(/,(\d+)/) || [, ''])[1].length;
      const ok = cv !== undefined && svn !== null && Math.abs(Math.round(cv * 10 ** dec) / 10 ** dec - svn) < 1e-9;
      if (ok) numOk++; else registrar(`${JSON.stringify(c)} ${sid}: fonte "${sv}" × código ${cv ?? '(ausente)'}`);
    }
    for (const k2 of Object.keys(r.valores || {})) if (!numFonte.has(k2)) registrar(`${JSON.stringify(c)}: valores['${k2}'] não é leitura numérica da fonte`);
    // (b) perda — texto visível das saídas não numéricas da fonte
    const srcT = editorial(n, texto(spec.saidas.filter((s) => !numSet.has(s)).map((s) => d.out(s)).join(' ')));
    const rotulos = inst.outputs.filter((o) => Number.isFinite(r.valores?.[o.id])).map((o) => o.label).join(' ');
    const codT = texto(ver) + ' ' + rotulos;
    const sw = palavras(srcT); const fw = faltas(sw, palavras(codT));
    const fn = faltas(numeros(srcT), numeros(texto(ver)));
    const cob = sw.length ? (sw.length - fw.length) / sw.length : 1;
    minCob = Math.min(minCob, fn.length ? Math.min(cob, 0.9999) : cob);
    for (const w of [...fw, ...fn.map((x) => `#${x}`)]) faltamT.set(w, (faltamT.get(w) || 0) + 1);
    if (fw.length || fn.length) registrar(`${JSON.stringify(c)}: faltam ${[...fw, ...fn.map((x) => `#${x}`)].slice(0, 10).join(', ')}`);
    // (c) invenção
    for (const w of new Set(palavras(texto(ver)))) if (!vocab.has(w)) inventadasT.set(w, (inventadasT.get(w) || 0) + 1);
  });
  if (minCob < 1) falhas.push(`PERDA: cobertura mínima ${(minCob * 100).toFixed(1)}%; faltam ${[...faltamT.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([w, q]) => `${w}×${q}`).join(', ')}`);
  if (inventadasT.size) falhas.push(`INVENÇÃO: palavras fora do instrumento na fonte: ${[...inventadasT.keys()].slice(0, 20).join(', ')}`);
  if (numOk < numTot) falhas.push(`NÚMERO: ${numTot - numOk} de ${numTot} saídas numéricas divergem`);
  const outrosValores = exemplos.filter((e) => /não é leitura numérica|mp-sel muda/.test(e));
  if (outrosValores.length) falhas.push(...new Set(outrosValores.map((e) => e.replace(/^\[[^\]]*\]: /, ''))));
  const campos = conferirCampos(n, inst);
  falhas.push(...campos.falhas.map((f) => `CAMPO ${f}`));
  if (tags) falhas.push(`TAG: veredito com tag HTML em ${tags} de ${casos.length} casos (apareceria literal no InstrumentoV3)`);
  totalFalhas += falhas.length;
  linhas.push({
    id, override: id in OVERRIDE ? 'sim' : 'não', casos: casos.length, ramos: ramos.size || '—',
    numeros: numTot ? `${numOk}/${numTot}` : '—', cobertura: `${(minCob * 100).toFixed(1)}%`,
    inventadas: inventadasT.size, campos: campos.falhas.length, tags, status: falhas.length ? 'FALHA' : 'ok',
    falhas, ressalvas: campos.ressalvas, exemplos,
  });
}

// ── saída ────────────────────────────────────────────────────────────────────
const cols = [['id', 'instrumento'], ['override', 'override'], ['casos', 'casos'], ['ramos', 'ramos vd'], ['numeros', 'números ok'],
  ['cobertura', 'cobertura mín'], ['inventadas', 'inventadas'], ['campos', 'campos ≠'], ['tags', 'tags html'], ['status', 'status']];
const larg = cols.map(([k, h]) => Math.max(h.length, ...linhas.map((l) => String(l[k]).length)));
const fmtLinha = (vals) => '| ' + vals.map((v, j) => String(v).padEnd(larg[j])).join(' | ') + ' |';
console.log(fmtLinha(cols.map(([, h]) => h)));
console.log('|' + larg.map((w) => '-'.repeat(w + 2)).join('|') + '|');
for (const l of linhas) console.log(fmtLinha(cols.map(([k]) => l[k])));
console.log('');
for (const l of linhas) {
  for (const f of l.falhas) console.log(`FALHA  ${l.id}  ${f}`);
  if (DETALHE || l.falhas.length) for (const e of l.exemplos) console.log(`       ${l.id}  ex.: ${e.slice(0, 300)}`);
  for (const r of l.ressalvas) console.log(`nota   ${l.id}  ${r}`);
}
for (const e of EDITORIAIS) console.log(`editorial  "${e.re.source}" → "${e.por}" (INST·${e.inst.map(pad).join(', INST·')}): ${usoEditorial.get(e) || 0} troca(s) na fonte — ${e.razao}`);
console.log('');
console.log(totalFalhas === 0 ? 'RESULTADO: 0 falhas' : `RESULTADO: ${totalFalhas} falha(s)`);
process.exit(totalFalhas === 0 ? 0 : 1);
