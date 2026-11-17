// gerar-instrumentos-m11.mjs — porte dos onze instrumentos do M11 ao modelo v3.
//
// Escreve dois artefatos, os dois GERADOS (não editar à mão):
//
// 1. src/lib/data/calculadoras/m11.ts — a lógica. Em vez de reescrever 730 linhas de
//    script (textos longos, dezenas de ramos), o corpo de cada IIFE do <script> original
//    (`Alexandria modulos/alexandria_modulo11.html`, L3109–3841) é COPIADO LITERALMENTE para
//    uma função comum, e roda contra um ambiente mínimo que imita só o que o script usa do
//    DOM: `$id(x).value` devolve a entrada do campo; `segVal` devolve a opção escolhida;
//    `segBind`/`chips` registram o tratador e ele é chamado com a escolha; o que o script
//    escreve em `textContent`/`innerHTML` vira saída. Não há eval: é código compilado no
//    bundle como qualquer outro. As únicas linhas acrescentadas são declaradas em GANCHO
//    (INST·03 e ·11 guardam a escolha numa variável local, sem tratador exposto). As únicas
//    linhas alteradas são as CORREÇÕES de correcoes-m11.mjs (Q07/Q13), comentadas no código.
//
// 2. O bloco `M11_INSTRUMENTOS_TODOS` em src/lib/data/alexandria-modulo-11-content.ts —
//    título, nota (intro + nota de fonte, com o HTML da fonte), rótulos, opções, faixas,
//    padrões e saídas literais da extração (docs/alexandria-v2/extraction/m11/instrumentos.json).
//    Os ids de campo do porte antigo são mantidos (mapa CAMPO).
//
// Conferido por tools/alexandria-dados/porte/verificar-instrumentos-m11.mjs, que roda o
// script original no mini-dom e compara saída por saída.
//
// Uso: node tools/alexandria-dados/porte/gerar-instrumentos-m11.mjs

import fs from 'node:fs';
import path from 'node:path';
import { RAIZ } from './porte-m09-m11-comum.mjs';
import { CORRECOES, corrigir } from './correcoes-m11.mjs';

const HTML = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo11.html';
const EXT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m11/instrumentos.json'), 'utf8'));
const L = fs.readFileSync(HTML, 'utf8').split(/\r?\n/);
const ARQ_CALC = path.join(RAIZ, 'src/lib/data/calculadoras/m11.ts');
const ARQ_CONT = path.join(RAIZ, 'src/lib/data/alexandria-modulo-11-content.ts');

// id do campo no HTML → id do campo no produto (o do porte antigo)
const CAMPO = { 'mp-seg': 'mp-lente', 'mp-grid': 'mp-item', 'se-grid': 'se-a', 'rg-nav': 'rg-m', 'sa-grid': 'sa-s', 'or-nav': 'or-p' };
// grade sem rótulo no markup: a palavra que a própria fonte usa para o item
const ROTULO = { 'rg-nav': 'Marco', 'sa-grid': 'Sinal de alerta', 'or-nav': 'Passo' };
const KIND = { '01': 'explorador', '02': 'explorador', '03': 'explorador', '04': 'simulador', '05': 'simulador', '06': 'calculadora', '07': 'calculadora', '08': 'calculadora', '09': 'explorador', '10': 'quebra-cabeca', '11': 'explorador' };
// GANCHO: linhas acrescentadas ao fim do corpo, só onde a escolha mora numa variável local.
const GANCHO = {
  '03': "__ganchos.escolher = function (v) { render(v); };",
  '11': "__ganchos.escolher = function (v) { at = parseInt(v, 10); render(); };",
};
// navegação sem tratador exposto: id do campo no HTML que o GANCHO recebe
const NAV = { '03': 'rg-nav', '11': 'or-nav' };

const J = (v) => JSON.stringify(v);

// ── 1. calculadoras/m11.ts ───────────────────────────────────────────────────
const corpos = [];
const cfgs = [];
for (const x of EXT.instrumentos) {
  const n = x.id.slice(-2);
  const [a, b] = x.script.linhas;
  // linhas 1-indexadas [a, b]: a = cabeçalho; a+1 = "(function(){"; o "})();" é a última
  // linha não vazia do intervalo (o intervalo da extração termina numa linha em branco)
  let fimIdx = b - 1;
  while (fimIdx > a && !L[fimIdx].trim()) fimIdx--;
  if (L[a].trim() !== '(function(){' || L[fimIdx].trim() !== '})();') throw new Error(`${x.id}: IIFE não está em L${a + 1}–L${fimIdx + 1}`);
  const corpo = corrigir(n, L.slice(a + 1, fimIdx).join('\n'));
  const corr = CORRECOES.filter((c) => c.inst === n).map((c) => `// CORREÇÃO (${c.regra}, ${c.div}): «${c.de}» → «${c.para}» — ${c.motivo}\n`).join('');
  corpos.push(`// ── ${x.script.cabecalho.replace(/^\/\*\s*=+\s*|\s*=+\s*\*\/$/g, '')} (L${a + 2}–L${fimIdx}, literal${corr ? ' salvo a correção abaixo' : ''}) ──
${corr}function corpo${n}($id, $all, segVal, segBind, chips, pair, __ganchos) {
${corpo}
${GANCHO[n] ? `  // GANCHO (acrescentado): ${GANCHO[n]}\n  ${GANCHO[n]}` : ''}
}`);
  const readouts = (x.saidas.readouts ?? []).map((r) => r.id);
  const telas = [...(x.saidas.paineis ?? []).map((p) => p.id), ...(x.saidas.veredito_id ? [x.saidas.veredito_id] : [])];
  cfgs.push(`  'm11-inst-${n}': instrumento(corpo${n}, ${J(readouts)}, ${J(telas)}, ${J(NAV[n] ?? null)}),`);
}

const calc = `// @ts-nocheck — o corpo de cada instrumento é o JavaScript LITERAL do <script> da fonte.
// GERADO por tools/alexandria-dados/porte/gerar-instrumentos-m11.mjs — não editar à mão.
// Posse: a sessão de porte do M11. Uma chave aqui SUBSTITUI a de mesmo id em INSTRUMENT_CALCULATORS.
//
// Por quê: o porte antigo dos onze reescreveu a lógica com os mesmos textos e números, mas
// com o veredito sem a classe, a exibição numérica da fonte perdida ("+12,3%"), saídas de
// texto embutidas no veredito e — no painel v3 — a troca de ponto por vírgula estragando
// "1.000 kW". Aqui roda o código da fonte, sem reescrita, contra um ambiente mínimo.
import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';

// ── os auxiliares do script (L3046–3079), literais ───────────────────────────
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function clamp(v,a,b){if(isNaN(v))return a;return v<a?a:(v>b?b:v);}
function numOf(el,def,a,b){if(!el)return def;var v=parseFloat(String(el.value).replace(',','.'));if(isNaN(v))return def;return clamp(v,a,b);}
function fmt(n,d){if(isNaN(n)||!isFinite(n))return '—';return n.toLocaleString('pt-BR',{minimumFractionDigits:d||0,maximumFractionDigits:d||0});}

// ── o ambiente mínimo: o que o script usa do DOM, e nada mais ────────────────
const MAPA_CAMPO: Record<string, string> = ${J(CAMPO)};
function ambiente(entradas: Record<string, EntradaInstrumento>) {
  const els: Record<string, any> = {};
  const valor = (sid: string) => {
    const v = entradas[MAPA_CAMPO[sid] ?? sid];
    return v === undefined || v === '' ? undefined : String(v);
  };
  const $id = (sid: string) =>
    (els[sid] ??= {
      id: sid, value: valor(sid) ?? '', textContent: '', innerHTML: '', className: '', style: {},
      classList: { add() {}, remove() {} }, setAttribute() {}, getAttribute() { return null; },
      addEventListener() {}, querySelector() { return null; },
    });
  const tratadores: [string, (x: any) => void, boolean][] = [];
  return {
    els,
    valor,
    $id,
    $all: () => [],
    segVal: (sid: string) => valor(sid) ?? null,
    segBind: (sid: string, fn: (b: any) => void) => { tratadores.push([sid, fn, true]); },
    chips: (sid: string, _l: unknown, _a: unknown, fn: (k: string) => void) => { tratadores.push([sid, fn, false]); },
    pair: () => {},
    aplicar() {
      for (const [sid, fn, botao] of tratadores) {
        const v = valor(sid);
        if (v !== undefined) fn(botao ? { getAttribute: () => v } : v);
      }
    },
  };
}

/** HTML do painel da fonte → HTML curto do produto: yr/ti em negrito, blocos separados por
 *  linha, e só b/strong/i/em/br/sub/sup. Nenhuma palavra muda. */
function curto(h: string): string {
  return String(h)
    .replace(/<div class="(?:yr|ti)">([\\s\\S]*?)<\\/div>/g, '<b>$1</b><br>')
    .replace(/<\\/(?:p|div)>/g, '<br>')
    .replace(/<(?!\\/?(?:b|strong|i|em|br|sub|sup)\\b)[^>]+>/g, '')
    .replace(/(?:\\s*<br>\\s*){2,}/g, '<br><br>')
    .replace(/^(?:\\s*<br>)+|(?:<br>\\s*)+$/g, '')
    .trim();
}
const textoDe = (el: any) => (el.innerHTML ? el.innerHTML : esc(el.textContent));
/** Número de um readout pt-BR ("+12,3%", "175,3 MWh/ano", "1.260") — para a previsão. */
function numero(t: string): number | undefined {
  const m = String(t).replace(/<[^>]+>/g, '').replace(/−/g, '-').match(/[-+]?\\d[\\d.]*(?:,\\d+)?/);
  if (!m) return undefined;
  const x = Number(m[0].replace(/\\./g, '').replace(',', '.'));
  return Number.isFinite(x) ? x : undefined;
}

function instrumento(corpo: Function, readouts: string[], telas: string[], nav: string | null): CalculateFn {
  return (entradas) => {
    const amb = ambiente(entradas);
    const ganchos: Record<string, (v: string) => void> = {};
    corpo(amb.$id, amb.$all, amb.segVal, amb.segBind, amb.chips, amb.pair, ganchos);
    amb.aplicar();
    if (nav && ganchos.escolher && amb.valor(nav) !== undefined) ganchos.escolher(amb.valor(nav) as string);
    const textos: Record<string, string> = {};
    const valores: Record<string, number> = {};
    for (const id of readouts) {
      const t = textoDe(amb.$id(id));
      textos[id] = t;
      const v = numero(t);
      if (v !== undefined) valores[id] = v;
    }
    const veredito = telas.map((id) => curto(amb.$id(id).innerHTML)).filter(Boolean).join('<br><br>');
    return { valores, textos, veredito, vereditoPtBr: true };
  };
}

${corpos.join('\n\n')}

export const CALCULADORAS: Record<string, CalculateFn> = {
${cfgs.join('\n')}
};
`;
fs.writeFileSync(ARQ_CALC, calc);

// ── 2. definições dos instrumentos no arquivo de conteúdo ────────────────────
const defs = [];
for (const x of EXT.instrumentos) {
  const n = x.id.slice(-2);
  const e = x.entradas;
  const campos = [];
  for (const c of e.campos_numericos ?? []) {
    campos.push(`{ id: ${J(CAMPO[c.id] ?? c.id)}, label: ${J(c.rotulo)}, unit: ${J(c.unidade ?? null)}, kind: 'range', defaultValue: ${J(Number(c.padrao))}, min: ${J(c.min)}, max: ${J(c.max)}, step: ${J(c.step)} }`);
  }
  for (const s of e.seletores ?? []) {
    const pad = (s.opcoes.find((o) => o.padrao_marcacao) ?? s.opcoes[0]).valor;
    campos.push(`{ id: ${J(CAMPO[s.id] ?? s.id)}, label: ${J(s.rotulo)}, unit: null, kind: 'select', defaultValue: ${J(pad)}, options: ${J(s.opcoes.map((o) => ({ value: o.valor, label: o.rotulo })))} }`);
  }
  for (const d of e.seletores_dinamicos ?? []) {
    const ops = d.opcoes_geradas_no_carregamento.map((o) => {
      const k = Object.keys(o).find((y) => y.startsWith('data-'));
      return { value: String(o[k]), label: o.rotulo, on: o.on };
    });
    const pad = (ops.find((o) => o.on) ?? ops[0]).value;
    campos.push(`{ id: ${J(CAMPO[d.id] ?? d.id)}, label: ${J(d.rotulo_marcacao ?? ROTULO[d.id])}, unit: null, kind: 'select', defaultValue: ${J(pad)}, options: ${J(ops.map(({ value, label }) => ({ value, label })))} }`);
  }
  // a ordem dos campos na tela segue o markup: seletor de lente antes da grade (INST·01), etc.
  const saidas = (x.saidas.readouts ?? []).map((r) => `{ id: ${J(r.id)}, label: ${J(r.rotulo)}, unit: null }`);
  const nota = [x.intro?.html, x.nota_de_fonte?.html].filter(Boolean).join(' ').replace(/GridAlpha/g, 'NIVAR');
  defs.push(`  {
    id: ${J(x.id)},
    kind: '${KIND[n]}',
    title: ${J(x.titulo)},
    formula: null,
    fields: [
      ${campos.join(',\n      ')},
    ],
    outputs: [${saidas.length ? '\n      ' + saidas.join(',\n      ') + ',\n    ' : ''}],
    note: ${J(nota)},
  },`);
}
const bloco = `/** Os onze instrumentos, gerados da extração por tools/alexandria-dados/porte/gerar-instrumentos-m11.mjs
 *  (não editar à mão). O INST·01, do mapa do módulo, entra na Aula 01 (regra de colocação de 15/11). */
const M11_INSTRUMENTOS_TODOS: Instrument[] = [
${defs.join('\n')}
];

`;
let src = fs.readFileSync(ARQ_CONT, 'utf8').replace(/\r\n/g, '\n');
const ini = src.lastIndexOf('/**', src.indexOf('const M11_INSTRUMENTOS_TODOS'));
const fim = src.indexOf('const porId');
if (ini < 0 || fim < 0) throw new Error('bloco de instrumentos não achado');
src = src.slice(0, ini) + bloco + src.slice(fim);
fs.writeFileSync(ARQ_CONT, src);
console.log(`calculadoras/m11.ts: ${corpos.length} corpos literais · M11_INSTRUMENTOS_TODOS: ${defs.length} definições`);
