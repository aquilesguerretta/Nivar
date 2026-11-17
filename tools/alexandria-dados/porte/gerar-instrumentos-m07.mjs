// Gera os instrumentos do M07 (objetos `Instrument` e o dado de cada painel) a partir do HTML
// original: markup do `div.inst` (título, instrução, rótulos, readouts, aviso) e literais do
// <script> (`var D`, `var M`, `var INFO`… — script-m06-m08.mjs). Nada digitado.
//
// Escreve, em src/lib/data/alexandria-modulo-07-content.ts, o trecho entre os marcadores
// "INSTRUMENTOS GERADOS (porte v3)": `M07_DADOS_DOS_INSTRUMENTOS`, `INSTRUMENTOS_MODULO_07` e
// `MODULO_07_INSTRUMENTOS`. Os exports antigos que o arquivo grande de calculadoras importa
// (MODULO_07_EXPLORADORES, M07_INST01_ORGAOS, M07_INST01_LEGENDAS) ficam onde estão.
//
// Decisões (registradas em docs/alexandria-v3/porte/m07.md):
//   · nota = instrução (`p.inst-intro`) + aviso (`p.disc`), literais (P19);
//   · grade/chips de seleção → `kind: 'select'`; rótulo da opção = o texto do chip na fonte
//     ("k · n", como `grid()` desenha `<span class="y">k</span>n`). A fonte não dá rótulo ao
//     controle: o rótulo é o objeto da escolha nomeado na instrução (voz da Alexandria);
//   · Inst 01 do §MAP: título prefixado pelo nome da seção ("Percurso e mapa institucional"),
//     como no M06/M12/M13; entra na Aula 01;
//   · Inst 04 e 06: campos e faixas do markup (`input` number+range), leituras = os readouts.
//
// Uso: node tools/alexandria-dados/porte/gerar-instrumentos-m07.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FONTE, filhos, colapsa } from './aulas-html-m06-m08.mjs';
import { blocosDoScript, literal } from './script-m06-m08.mjs';
import { editorial } from './corpo-m06-m08.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARQ = path.join(RAIZ, 'src/lib/data/alexandria-modulo-07-content.ts');
const html = fs.readFileSync(FONTE(7), 'utf8');
const uso = {};
const ed = (s) => editorial(colapsa(s), uso);
const js = (v) => JSON.stringify(v);

// ── markup de cada div.inst ─────────────────────────────────────────────────
const MARKUP = {};
for (const m of html.matchAll(/<div class="inst">/g)) {
  const [f] = filhos(html, m.index, html.length);
  const t = f.inner;
  const id = /<span class="id">Inst · (\d+)<\/span>/.exec(t)[1];
  const um = (re) => (re.exec(t) || [])[1];
  MARKUP[id] = {
    nome: ed(um(/<span class="nm">([\s\S]*?)<\/span>/)),
    intro: ed(um(/<p class="inst-intro">([\s\S]*?)<\/p>/)),
    disc: ed(um(/<p class="disc">([\s\S]*?)<\/p>/)),
    segLb: um(/<div class="seg-lb">([\s\S]*?)<\/div>/) ?? null,
    seg: [...t.matchAll(/<button data-f="(\w+)"[^>]*>([\s\S]*?)<\/button>/g)].map((x) => ({ value: x[1], label: colapsa(x[2]) })),
    campos: [...t.matchAll(/<label class="field-label">([\s\S]*?)(?:<span class="unit">([\s\S]*?)<\/span>)?\s*<\/label>\s*<input type="number" id="([\w-]+)" value="([\d.]+)" min="([\d.]+)" max="([\d.]+)" step="([\d.]+)"/g)]
      .map((x) => ({ label: colapsa(x[1]), unit: x[2] ? colapsa(x[2]) : null, id: x[3], value: +x[4], min: +x[5], max: +x[6], step: +x[7] })),
    leituras: [...t.matchAll(/<div class="ro"><div class="k">([\s\S]*?)<\/div><div class="n[^"]*" id="([\w-]+)"/g)].map((x) => ({ id: x[2], label: colapsa(x[1]) })),
  };
}
const SEC_MAP = /<div class="sec-id"><b>§MAP<\/b> · ([\s\S]*?)<\/div>/.exec(html)[1].trim();

// ── literais do script ──────────────────────────────────────────────────────
const B = blocosDoScript(7);
const DADOS = {
  i01: { N: literal(B['01'], 'N'), ORD: literal(B['01'], 'ORD'), AUT: literal(B['01'], 'AUT'), DAD: literal(B['01'], 'DAD'), INFO: literal(B['01'], 'INFO'), LEGS: literal(B['01'], 'LEGS') },
  i02: literal(B['02'], 'D'),
  i03: literal(B['03'], 'D'),
  i05: literal(B['05'], 'D'),
  i07: literal(B['07'], 'D'),
  i08: literal(B['08'], 'D'),
  i09: literal(B['09'], 'D'),
  i10: { M: literal(B['10'], 'M'), FIXO: literal(B['10'], 'FIXO') },
};
// P24 no dado (só "GridAlpha"; nada de Bloco N nos painéis — medido abaixo)
const dadosJson = editorial(js(DADOS), uso);

// Rótulos dos cartões (Inst 08/09) e do painel do Inst 05, literais das funções do script.
const CARTOES = Object.fromEntries(['08', '09'].map((n) => [n, [...B[n].matchAll(/<span class="ok2">([^<]+)<\/span>/g)].map((x) => x[1])]));

// ── objetos Instrument ──────────────────────────────────────────────────────
const nota = (id) => js(`${MARKUP[id].intro}<br><br>${MARKUP[id].disc}`);
const titulo = (id, prefixo) => js(prefixo ? `${prefixo} · ${MARKUP[id].nome}` : MARKUP[id].nome);
const chip = (d) => (d.k ? `${d.k} · ${d.n}` : d.n);
const sel = (idCampo, rotulo, itens) =>
  `{ id: ${js(idCampo)}, label: ${js(rotulo)}, unit: null, kind: "select", defaultValue: "0", options: [\n        ${itens.map((d, i) => `{ value: "${i}", label: ${js(ed(chip(d)))} }`).join(',\n        ')},\n      ] }`;
const faixa = (c) => `{ id: ${js(c.id)}, label: ${js(c.label)}, unit: ${js(c.unit)}, kind: "range", defaultValue: ${c.value}, min: ${c.min}, max: ${c.max}, step: ${c.step} }`;
const explorador = (n, rotulo) => `  {
    id: "m07-inst-${n}",
    kind: "explorador",
    title: ${titulo(n)},
    formula: null,
    fields: [
      ${sel(`i${Number(n)}-sel`, rotulo, DADOS[`i${n}`].M ?? DADOS[`i${n}`])},
    ],
    outputs: [],
    note: ${nota(n)},
  }`;
const simulador = (n) => `  {
    id: "m07-inst-${n}",
    kind: "simulador",
    title: ${titulo(n)},
    formula: null,
    fields: [
      ${MARKUP[n].campos.map(faixa).join(',\n      ')},
    ],
    outputs: [
      ${MARKUP[n].leituras.map((l) => `{ id: ${js(l.id)}, label: ${js(l.label)}, unit: ${js(l.id.endsWith('-reg') ? null : 'dias')} }`).join(',\n      ')},
    ],
    note: ${nota(n)},
  }`;
const meses = DADOS.i10.M.map((m) => ({ n: `${m.m} · ${m.e} ciclo anual` }));

const INI = '// ── INSTRUMENTOS GERADOS (porte v3) ─────';
const FIM = '// ── FIM DOS INSTRUMENTOS GERADOS ─────';
const bloco = `${INI}────────────────────────────────
// GERADO por tools/alexandria-dados/porte/gerar-instrumentos-m07.mjs a partir do markup e do <script>
// de \`Alexandria modulos/alexandria_modulo07.html\`. Não editar à mão. Calculadoras: calculadoras/m07.ts.
// Conferido por tools/alexandria-dados/porte/verificar-instrumentos-m07.mjs (script original executado).

/** Literais de dado do <script> da fonte, por instrumento (\`var D\`, \`var M\`, \`var INFO\`…). */
export const M07_DADOS_DOS_INSTRUMENTOS = ${dadosJson} as const;

/** Rótulos literais dos seis cartões dos Inst 08 e 09 (\`cards()\` do script). */
export const M07_ROTULOS_DOS_CARTOES = ${js(CARTOES)} as const;

export const INSTRUMENTOS_MODULO_07: Instrument[] = [
${explorador('02', 'Instrumento jurídico')},
${explorador('03', 'Pergunta')},
${simulador('04')},
${explorador('05', 'Horizonte')},
${simulador('06')},
${explorador('07', 'Sintoma')},
${explorador('08', 'Tipo de decisão')},
${explorador('09', 'Dado')},
  {
    id: "m07-inst-10",
    kind: "explorador",
    title: ${titulo('10')},
    formula: null,
    fields: [
      ${sel('i10-sel', 'Mês', meses)},
    ],
    outputs: [],
    note: ${nota('10')},
  },
];

/** O Inst · 01 do § MAP. Regra de colocação de 15/11: entra na Aula 01, depois da leitura. O rótulo
 *  "§MAP" é barrado pelo gridalpha-detect (P0); o cabeçalho usa o nome da seção na fonte. */
export const MODULO_07_INSTRUMENTOS: Instrument[] = [
  {
    id: "m07-inst-01",
    kind: "explorador",
    title: ${titulo('01', SEC_MAP)},
    formula: null,
    fields: [
      { id: "m07-i1-flow", label: ${js(MARKUP['01'].segLb)}, unit: null, kind: "select", defaultValue: "aut", options: ${js(MARKUP['01'].seg)} },
      { id: "m07-i1-sel", label: "Instituição", unit: null, kind: "select", defaultValue: "cnpe", options: [
        ${DADOS.i01.ORD.map((k) => `{ value: ${js(k)}, label: ${js(DADOS.i01.N[k].l)} }`).join(',\n        ')},
      ] },
    ],
    outputs: [],
    note: ${nota('01')},
  },
];
${FIM}────────────────────────────`;

let ts = fs.readFileSync(ARQ, 'utf8').split('\r\n').join('\n');
if (ts.includes(INI)) {
  const a = ts.indexOf(INI);
  const b = ts.indexOf('\n', ts.indexOf(FIM)) + 1;
  ts = ts.slice(0, a) + bloco + '\n' + ts.slice(b);
} else {
  const tirar = (nome) => {
    const a = ts.indexOf(`export const ${nome}`);
    if (a < 0) throw new Error(`${nome} não achado`);
    const b = ts.indexOf('\n];', a) + 3;
    const doc = ts.slice(0, a).match(/\/\*\*(?:(?!\/\*\*)[\s\S])*?\*\/\s*$/);
    ts = ts.slice(0, doc ? a - doc[0].length : a) + ts.slice(b);
    return doc ? a - doc[0].length : a;
  };
  const pos = tirar('INSTRUMENTOS_MODULO_07');
  tirar('MODULO_07_INSTRUMENTOS');
  ts = ts.slice(0, pos) + bloco + '\n' + ts.slice(pos);
}
fs.writeFileSync(ARQ, ts);
console.log(`→ ${path.relative(RAIZ, ARQ)} · ${Object.keys(MARKUP).length} instrumentos na fonte · trocas: ${js(uso)}`);
for (const [k, v] of Object.entries(MARKUP)) console.log(`   Inst ${k}: ${v.nome} · campos ${v.campos.length} · leituras ${v.leituras.map((l) => l.label).join(' / ') || '—'}`);
