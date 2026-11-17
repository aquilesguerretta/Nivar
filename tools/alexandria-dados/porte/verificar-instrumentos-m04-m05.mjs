// Confere as calculadoras do produto contra o <script> ORIGINAL da fonte, executado no
// mini-dom (tools/alexandria-dados/mini-dom.mjs). Chamado por verificar-instrumentos-m04.mjs
// e -m05.mjs.
//
// Para cada instrumento: uma grade de cenários (cada campo em até G valores entre min e
// max, no passo da fonte). Em cada cenário, o campo numérico da fonte recebe o valor e o
// evento que o script escuta; os readouts e o veredito renderizados são lidos e
// comparados com o que a calculadora do produto devolve no mesmo cenário:
//   · veredito: texto IGUAL (só espaço colapsado);
//   · saída numérica: o readout da fonte vira número ("R$ 16 mi" → 16e6; "1.000MW" → 1000)
//     e precisa bater com o valor do produto × escala, dentro do arredondamento que a
//     própria fonte exibe (meia unidade da última casa mostrada).
// Sai com 1 se qualquer cenário divergir.

import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { carregarModulo } from '../mini-dom.mjs';
import { RAIZ } from './fonte-html-m04-m05.mjs';

const colapsa = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/** "R$ 16 mi" → { v: 16e6, meia: 0.005e6 }; "− R$ 400 mil" → -400e3; "1.000MW" → 1000; "10%" → 10. */
export function lerReadout(t) {
  let s = colapsa(t).replace(/−/g, '-');
  const neg = /^-/.test(s) || /^R\$\s*-/.test(s);
  s = s.replace(/^-\s*/, '').replace(/R\$\s*-?/, '');
  const m = s.match(/(-?[\d.]+(?:,\d+)?)\s*(bi|mil|mi)?/);
  if (!m) return null;
  const [inteira, dec = ''] = m[1].split(',');
  const v = Number(inteira.replace(/\./g, '') + (dec ? `.${dec}` : ''));
  const mult = m[2] === 'bi' ? 1e9 : m[2] === 'mi' ? 1e6 : m[2] === 'mil' ? 1e3 : 1;
  const meia = 0.5 * Math.pow(10, -dec.length) * mult;
  return { v: (neg ? -1 : 1) * v * mult, meia };
}

function grade(campos, G) {
  const eixos = campos.map((c) => {
    const { min, max, step } = c;
    const vals = new Set([c.padrao]);
    if (c.tipo === 'checkbox') return [0, 1];
    for (let k = 0; k < G; k++) {
      const bruto = min + ((max - min) * k) / (G - 1);
      const v = Math.round((Math.round((bruto - min) / step) * step + min) * 1e6) / 1e6;
      vals.add(Math.min(max, Math.max(min, v)));
    }
    return [...vals];
  });
  let combos = [[]];
  for (const e of eixos) combos = combos.flatMap((c) => e.map((v) => [...c, v]));
  return combos;
}

/**
 * @param n módulo
 * @param especs [{ id, campos: [{ fonte, produto, evento }], saidas: [{ fonte, produto, escala }], veredito, G }]
 *   `fonte` = id do elemento no HTML; `produto` = id do campo/saída na calculadora.
 */
export async function verificarInstrumentos(n, especs, calcArquivo) {
  const NN = String(n).padStart(2, '0');
  const { CALCULADORAS } = await import(pathToFileURL(path.join(RAIZ, calcArquivo)).href);
  let exit = 0;
  for (const e of especs) {
    const calc = CALCULADORAS[e.id];
    if (!calc) { console.log(`✗ ${e.id}: sem calculadora em ${calcArquivo}`); exit = 1; continue; }
    const m = carregarModulo(n, { instrumentar: false });
    // `c.fonte` é o id do elemento; ou `c.seletor(m)` devolve o elemento (caixas de marcar
    // criadas pelo script, sem id). Caixa de marcar: valores 0 e 1, evento 'change'.
    const elDe = (c) => (c.seletor ? c.seletor(m) : m.el(c.fonte));
    const campos = e.campos.map((c) => {
      const el = elDe(c);
      if (c.tipo === 'checkbox') return { ...c, min: 0, max: 1, step: 1, padrao: el.checked ? 1 : 0 };
      const min = Number(el.min);
      const max = Number(el.max);
      const step = Number(el.step) || 1;
      return { ...c, min, max, step, padrao: Number(el.value) };
    });
    const combos = grade(campos, e.G ?? 5);
    let ok = 0;
    const falhas = [];
    for (const vs of combos) {
      const entrada = {};
      vs.forEach((v, k) => {
        const c = campos[k];
        const el = elDe(c);
        if (c.tipo === 'checkbox') el.checked = Boolean(v); else el.value = String(v);
        m.disparar(el, c.evento ?? 'change');
        entrada[c.produto] = c.tipo === 'checkbox' ? (v ? 1 : 0) : v;
      });
      const r = calc(entrada);
      const erros = [];
      for (const s of e.saidas) {
        const bruto = colapsa(m.texto(s.fonte));
        const prod = r.valores[s.produto];
        // Texto-sentinela da fonte ("zero", "não precisa", "—"): `e.sentinelas[texto]` diz
        // o que o produto deve fazer — devolver esse número, ou (null) não devolver a saída.
        if (e.sentinelas && bruto in e.sentinelas) {
          const quer = e.sentinelas[bruto];
          if (quer === null ? prod !== undefined : prod !== quer) erros.push(`${s.fonte}: fonte «${bruto}» × produto ${prod}`);
          continue;
        }
        const lido = lerReadout(bruto);
        if (!lido) { erros.push(`${s.fonte}: readout ilegível «${bruto}»`); continue; }
        if (prod === undefined) { erros.push(`${s.produto}: o produto não devolveu`); continue; }
        const esperado = lido.v;
        const obtido = prod * (s.escala ?? 1);
        if (Math.abs(esperado - obtido) > lido.meia + 1e-6 * Math.max(1, Math.abs(esperado))) erros.push(`${s.fonte}: fonte «${m.texto(s.fonte)}» × produto ${obtido}`);
      }
      // `textos`: o readout como a fonte o escreve. Igualdade de texto, sem espaço em branco
      // (a fonte cola a unidade num <span>: "0MW" no textContent, "0 MW" no produto).
      for (const id of e.textos ?? []) {
        const tf = colapsa(m.texto(id)).replace(/\s/g, '');
        const tp = String(r.textos?.[id] ?? '').replace(/<[^>]+>/g, '').replace(/\s/g, '');
        if (tf !== tp) erros.push(`texto ${id}: fonte «${colapsa(m.texto(id))}» × produto «${r.textos?.[id]}»`);
      }
      if (e.veredito) {
        // `normalizarVeredito`: correção Q07 declarada, aplicada ao lado da FONTE antes de comparar.
        const vf = colapsa(e.normalizarVeredito ? e.normalizarVeredito(m.texto(e.veredito)) : m.texto(e.veredito));
        const vp = colapsa(String(r.veredito ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ''));
        if (vf !== vp) erros.push(`veredito:\n        fonte   «${vf}»\n        produto «${vp}»`);
      }
      if (erros.length) falhas.push({ entrada, erros }); else ok++;
    }
    const tag = falhas.length ? '✗' : '✓';
    if (falhas.length) exit = 1;
    console.log(`${tag} ${e.id}: ${ok}/${combos.length} cenários iguais à fonte`);
    for (const f of falhas.slice(0, 4)) console.log(`   ${JSON.stringify(f.entrada)}\n     ${f.erros.join('\n     ')}`);
    if (m.erros.length) console.log(`   (erros do script no mini-dom: ${m.erros.slice(0, 3).map((x) => x.msg).join(' | ')})`);
  }
  console.log(exit ? `M${NN}: FALHA` : `M${NN}: todas as calculadoras batem com o script da fonte`);
  return exit;
}
