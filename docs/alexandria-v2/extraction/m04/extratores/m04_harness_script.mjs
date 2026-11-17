// Harness do M04: executa o <script> ORIGINAL de alexandria_modulo04.html num
// DOM simulado (sem jsdom: stub mínimo de getElementById/querySelectorAll) e
// compara as saídas com a porta em TS (INSTRUMENT_CALCULATORS, empacotada
// com esbuild para o scratchpad). Só leitura sobre fonte e src/.
//
// Uso: node m04_harness_script.mjs <bundle-dos-calculadores.mjs> <saida.json>
// O bundle é gerado por:
//   npx esbuild src/lib/data/alexandria-instrument-calculators.ts --bundle
//     --format=esm --platform=node --alias:@=./src --outfile=<scratch>/calc.mjs
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo04.html';
const [, , BUNDLE, OUT] = process.argv;
const html = fs.readFileSync(SRC, 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));

// ── campos por instrumento, lidos do markup (par number + range) ──
const INST = {};
for (const m of html.matchAll(/<input type="range" id="(i(\d)-[a-z])" min="([-\d.]+)" max="([-\d.]+)" step="([-\d.]+)" value="([-\d.]+)">/g)) {
  const k = `m04-inst-0${m[2]}`;
  (INST[k] ||= []).push({ id: m[1], min: +m[3], max: +m[4], step: +m[5], value: +m[6] });
}
const OUT_IDS = {
  'm04-inst-01': ['i1-p', 'i1-m', 'i1-def', 'i1-lim'],
  'm04-inst-02': ['i2-p', 'i2-mes', 'i2-max', 'i2-x'],
  'm04-inst-03': ['i3-r', 'i3-c', 'i3-g', 'i3-k'],
  'm04-inst-04': ['i4-q', 'i4-c', 'i4-m', 'i4-f'],
  'm04-inst-05': ['i5-a', 'i5-lo', 'i5-w', 'i5-r'],
  'm04-inst-06': ['i6-r', 'i6-a', 'i6-b', 'i6-u'],
  'm04-inst-07': ['i7-e', 'i7-m', 'i7-w', 'i7-r'],
};

// ── DOM simulado ──
function makeEnv() {
  const els = {};
  const listeners = {};
  const el = (id) => (els[id] ||= {
    id, value: '', min: '', max: '', textContent: '', innerHTML: '', className: '', style: {},
    addEventListener(ev, fn) { (listeners[id] ||= {})[ev] = fn; },
    scrollIntoView() {}, getAttribute() { return null; },
  });
  for (const [, fields] of Object.entries(INST)) for (const f of fields) {
    Object.assign(el(f.id), { value: String(f.value), min: String(f.min), max: String(f.max) });
    Object.assign(el(f.id + '-n'), { value: String(f.value) });
  }
  for (const id of ['prog', 'quiz-box', 'q-go', 'q-rst', 'q-score', 'q-num', 'q-msg', 'quiz',
    'i1-bars', 'i3-bars', 'i4-bars', 'i2-svg', 'i5-svg', 'i7-svg',
    ...Object.values(OUT_IDS).flat(), ...Object.keys(OUT_IDS).map((k) => `i${k.at(-1)}-vd`)]) el(id);
  const document = {
    getElementById: (id) => els[id] || null,
    querySelectorAll: () => [],
    querySelector: () => null,
    documentElement: { scrollHeight: 0, clientHeight: 0, scrollTop: 0 },
    body: { scrollTop: 0 },
  };
  const window = { addEventListener() {} };
  new Function('document', 'window', script)(document, window);
  return { els, listeners };
}

const strip = (h) => h.replace(/<[^>]+>/g, '');
function readOriginal(env, key) {
  const n = key.at(-1);
  const o = {}, bruto = {};
  for (const id of OUT_IDS[key]) {
    const e = env.els[id];
    bruto[id] = e.innerHTML ? { innerHTML: e.innerHTML } : { textContent: e.textContent };
    o[id] = strip(e.innerHTML || e.textContent);
  }
  const vd = env.els[`i${n}-vd`];
  return { saidas: o, saidas_bruto: bruto, veredito: vd.textContent, classe: vd.className };
}
function setAndRun(env, key, vals) {
  for (const f of INST[key]) env.els[f.id].value = String(vals[f.id]);
  env.listeners[INST[key][0].id].input();
  return readOriginal(env, key);
}

const { INSTRUMENT_CALCULATORS } = await import(pathToFileURL(BUNDLE).href);
const env = makeEnv();
const result = { gerado_em: new Date().toISOString(), padrao: {}, comparacao: {} };

for (const key of Object.keys(INST)) {
  const def = Object.fromEntries(INST[key].map((f) => [f.id, f.value]));
  const orig = setAndRun(env, key, def);
  const port = INSTRUMENT_CALCULATORS[key](Object.fromEntries(INST[key].map((f) => [f.id + '-n', f.value])));
  result.padrao[key] = { entradas: def, original: orig, porta: port };

  // Grade: cada campo em até 9 pontos da faixa (inclui extremos e o padrão);
  // produto cartesiano completo (máx. 10.000 no M04). Compara só o veredito
  // (string exata). Os valores numéricos da porta ficam registrados no
  // cenário-padrão, ao lado do texto renderizado pelo original.
  const axes = INST[key].map((f) => {
    const steps = Math.round((f.max - f.min) / f.step);
    const k = Math.min(steps, 8);
    const pts = new Set();
    for (let j = 0; j <= k; j++) pts.add(+(f.min + Math.round((steps * j) / k) * f.step).toFixed(6));
    pts.add(f.value);
    return [...pts];
  });
  let combos = [[]];
  for (const ax of axes) combos = combos.flatMap((c) => ax.map((v) => [...c, v]));
  let total = 0, vdDiff = 0; const exemplos = [];
  for (const c of combos) {
    const vals = Object.fromEntries(INST[key].map((f, j) => [f.id, c[j]]));
    const o = setAndRun(env, key, vals);
    const p = INSTRUMENT_CALCULATORS[key](Object.fromEntries(INST[key].map((f, j) => [f.id + '-n', c[j]])));
    total++;
    if (o.veredito !== p.veredito) { vdDiff++; if (exemplos.length < 5) exemplos.push({ vals, original: o.veredito, porta: p.veredito }); }
  }
  result.comparacao[key] = { combinacoes: total, veredito_divergente: vdDiff, exemplos };
}
fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
for (const [k, v] of Object.entries(result.comparacao)) console.log(k, v.combinacoes, 'combos; veredito divergente:', v.veredito_divergente);
