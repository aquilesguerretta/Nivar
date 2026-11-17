// Confere cada calculadora gerada (src/lib/data/calculadoras/mNN.ts) contra o
// <script> ORIGINAL executado no mini-dom (tools/alexandria-dados/mini-dom.mjs).
//
// Para cada instrumento e cada combinação de entradas (produto completo dos
// seletores; nos numéricos, o padrão, cada campo no mínimo e no máximo e 300
// combinações pseudoaleatórias na grade do passo), confere:
//   1. TEXTO   — o texto de cada alvo do script (readout, painel, veredito) é
//                idêntico entre a página original e a calculadora.
//   2. NÚMERO  — o valor numérico de cada readout é o mesmo número.
//   3. PAINEL  — a simplificação para a aula v3 (b, em, br) não perde nem
//                acrescenta texto da fonte (descontadas a numeração "N." das
//                listas e o separador "·" que ela insere).
//   4. CONTRATO — todo campo do Instrument existe na calculadora e todo
//                 readout declarado é número finito no cenário-padrão.
//
// Uso: node tools/alexandria-dados/porte/verificar-instrumentos-m16-m17.mjs 16 [--so m16-inst-04]
// Sai com 1 se houver qualquer divergência.

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { carregarModulo } from '../mini-dom.mjs';
import { decodificar } from './verificar-porte-m16.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const n = Number(process.argv[2]);
const NN = String(n).padStart(2, '0');
const so = process.argv.includes('--so') ? process.argv[process.argv.indexOf('--so') + 1] : null;

const calcMod = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/calculadoras/m${NN}.ts`)).href);
const conteudo = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
const INSTS = conteudo[`INSTRUMENTOS_MODULO_${NN}`];

const texto = (h) => decodificar(String(h ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/[\s ]+/g, ' ').trim();
const compacto = (h) => texto(h).replace(/\s+/g, '');

// gerador pseudoaleatório determinístico
let semente = 20261115;
const aleat = () => ((semente = (semente * 1103515245 + 12345) % 2147483648) / 2147483648);

function combinacoes(inst) {
  const sel = inst.fields.filter((f) => f.kind === 'select');
  const nums = inst.fields.filter((f) => f.kind !== 'select');
  const padrao = Object.fromEntries(inst.fields.map((f) => [f.id, f.defaultValue]));
  let prodSel = [{}];
  for (const f of sel) prodSel = prodSel.flatMap((c) => f.options.map((o) => ({ ...c, [f.id]: o.value })));
  const numCombos = [{}];
  if (nums.length) {
    for (const f of nums) { numCombos.push({ [f.id]: f.min }, { [f.id]: f.max }); }
    for (let k = 0; k < 300; k++) {
      const c = {};
      for (const f of nums) {
        const passos = Math.round((f.max - f.min) / f.step);
        const v = f.min + Math.round(aleat() * passos) * f.step;
        c[f.id] = Number(v.toFixed(6));
      }
      numCombos.push(c);
    }
  }
  const out = [];
  for (const s of prodSel) for (const c of numCombos) out.push({ ...padrao, ...s, ...c });
  // com seletores e numéricos juntos, limita o produto
  return out.length > 1200 ? out.filter((_, i) => i % Math.ceil(out.length / 1200) === 0) : out;
}

/** M17: a escolha do aluno chega à página original como o clique que ela receberia. */
function aplicarGatilhos(m, inst, combo, gatilhos) {
  const attr = (e, k) => e.attrs[k] ?? null;
  for (const g of gatilhos) {
    const v = combo[g.campo];
    const w = m.el(g.alvo);
    if (!w) throw new Error(`${inst.id}: alvo ${g.alvo} não existe na fonte`);
    if (g.tipo === 'chips') {
      const b = w.querySelectorAll('button').find((x) => attr(x, 'data-i') === String(v));
      if (!b) throw new Error(`${inst.id}: chip ${v} sem botão em ${g.alvo}`);
      m.disparar(b, 'click');
    } else if (g.tipo === 'linha') {
      const r = w.querySelectorAll('.p7-r').find((x) => attr(x, 'data-k') === g.chave);
      if (!r) throw new Error(`${inst.id}: linha ${g.chave} ausente`);
      const tem = /(^|\s)have(\s|$)/.test(attr(r, 'class') ?? '');
      if (tem !== (String(v) === 'declarada')) m.disparar(r, 'click');
    } else if (g.tipo === 'nav') {
      for (let k = 0; k < Number(v); k++) {
        const b = m.el(g.alvo).querySelectorAll('button').find((x) => attr(x, 'data-d') === '1');
        m.disparar(b, 'click');
      }
    }
  }
  for (const f of inst.fields.filter((x) => x.kind !== 'select')) {
    const el = m.el(f.id);
    if (!el) throw new Error(`${inst.id}: campo ${f.id} não existe na fonte`);
    el.value = String(combo[f.id]);
    m.disparar(el, 'input');
  }
}

function aplicarNaFonte(m, inst, combo) {
  const gat = calcMod.GATILHOS?.[inst.id];
  if (gat) return aplicarGatilhos(m, inst, combo, gat);
  // seletores (segmentados) primeiro, depois chips gerados pelo script, depois números
  for (const f of inst.fields.filter((x) => x.kind === 'select')) {
    const w = m.el(f.id);
    if (!w) throw new Error(`${inst.id}: elemento ${f.id} não existe na fonte`);
    const bts = w.querySelectorAll('button');
    const alvo = bts.find((b) => Object.entries(b.attrs).some(([k, v]) => k.startsWith('data-') && String(v) === String(combo[f.id])));
    if (alvo) m.disparar(alvo, 'click');
    else if (!w.attrs.class?.includes('seg')) { /* chip fora da lista filtrada: a página não o oferece */ }
    else throw new Error(`${inst.id}: opção ${combo[f.id]} sem botão em ${f.id}`);
  }
  for (const f of inst.fields.filter((x) => x.kind !== 'select')) {
    const el = m.el(f.id);
    if (!el) throw new Error(`${inst.id}: campo ${f.id} não existe na fonte`);
    el.value = String(combo[f.id]);
    m.disparar(el, 'input');
  }
}

let falhas = 0;
let conferencias = 0;
const m = carregarModulo(n, { instrumentar: false });
if (m.erros.length) console.log('erros ao carregar a fonte:', m.erros.slice(0, 3));

for (const inst of INSTS) {
  if (so && inst.id !== so) continue;
  const calc = calcMod.CALCULADORAS[inst.id];
  if (!calc) { console.log(`✗ ${inst.id}: sem calculadora`); falhas++; continue; }
  const combos = combinacoes(inst);
  const r0 = calc(Object.fromEntries(inst.fields.map((f) => [f.id, f.defaultValue])));
  const campos = new Set(inst.fields.map((f) => f.id));
  const alvos = Object.keys(r0.bruto).filter((id) => m.el(id) && !campos.has(id));
  let f0 = 0;
  const exemplos = [];
  // contrato
  // toda saída declarada aparece no padrão: como número ou como texto verbatim (`textos`)
  for (const o of inst.outputs) if (!Number.isFinite(r0.valores[o.id]) && !r0.textos?.[o.id]) { f0++; exemplos.push(`saída ${o.id} vazia no padrão`); }
  // Saída `ro()` do M17: id sintético "<contêiner>-<n>"; o texto da fonte é o n-ésimo `ro` do contêiner.
  const roDaFonte = (id) => {
    const mm = id.match(/^(.*)-(\d+)$/);
    if (m.el(id) || !mm || !m.el(mm[1])) return m.html(id);
    const ros = [...String(m.html(mm[1])).matchAll(/<div class="ro"><div class="k">[\s\S]*?<\/div><div class="n[^"]*">([\s\S]*?)<\/div><\/div>/g)];
    return ros[Number(mm[2]) - 1]?.[1] ?? '';
  };
  for (const combo of combos) {
    aplicarNaFonte(m, inst, combo);
    const r = calc(combo);
    for (const id of alvos) {
      conferencias++;
      const fonte = m.html(id);
      const nosso = r.bruto[id];
      if (texto(fonte) !== texto(nosso)) {
        f0++;
        if (exemplos.length < 4) exemplos.push(`TEXTO ${id} em ${JSON.stringify(combo)}\n      fonte: ${texto(fonte).slice(0, 160)}\n      nosso: ${texto(nosso).slice(0, 160)}`);
      }
    }
    for (const o of inst.outputs) {
      conferencias++;
      const vf = r.valores[o.id];
      const txt = texto(roDaFonte(o.id));
      // número: só quando o readout é um número (com prefixo de moeda e unidade); "72,0 vs 80,0", "não", "A" são texto
      const mNum = txt.replace(/^(R\$|US\$|€)\s*/, '').match(/^(-?[\d.]+(?:,\d+)?)(?: ?[^\d\s]\S*(?: [^\d\s]\S*)*)?$/);
      const esperado = mNum ? Number(mNum[1].replace(/\./g, '').replace(',', '.')) : NaN;
      const ok = Number.isFinite(esperado) ? Math.abs(vf - esperado) < 1e-9 : !Number.isFinite(vf);
      if (!ok) { f0++; if (exemplos.length < 4) exemplos.push(`NÚMERO ${o.id}: fonte «${txt}» × nosso ${vf}`); }
      // texto verbatim da saída, quando a calculadora o devolve
      if (r.textos?.[o.id] !== undefined && r.textos[o.id].replace(/\s+/g, '') !== txt.replace(/\s+/g, '')) {
        f0++;
        if (exemplos.length < 4) exemplos.push(`TEXTO DA SAÍDA ${o.id}: fonte «${txt}» × nosso «${r.textos[o.id]}»`);
      }
    }
  }
  // PAINEL: confere com a lista de alvos de texto da calculadora (spec.textos)
  const textosIds = (calcMod.TEXTOS ?? {})[inst.id] ?? [];
  for (const combo of combos.slice(0, 200)) {
    const r = calc(combo);
    const bruto = textosIds.map((id) => r.bruto[id]).join(' ');
    const semMarcas = (s) => compacto(s).replace(/\d+\./g, '').replace(/·/g, '');
    const fonteEditada = semMarcas(bruto.split('GridAlpha').join('NIVAR').split('declarada no &sect;00.6').join('declarada na abertura do módulo').split('declarada no §00.6').join('declarada na abertura do módulo'));
    conferencias++;
    if (semMarcas(r.veredito) !== fonteEditada) {
      f0++;
      if (exemplos.length < 6) exemplos.push(`PAINEL em ${JSON.stringify(combo)}\n      fonte: ${fonteEditada.slice(0, 200)}\n      aula : ${semMarcas(r.veredito).slice(0, 200)}`);
    }
  }
  console.log(`${f0 ? '✗' : '✓'} ${inst.id} · ${inst.title} — ${combos.length} combinações, alvos ${alvos.join(',')}${f0 ? ` — ${f0} FALHAS` : ''}`);
  for (const e of exemplos) console.log('    ' + e);
  falhas += f0;
}
console.log(`\n${conferencias} conferências · ${falhas} falhas`);
console.log(falhas ? 'RESULTADO: FALHA' : 'RESULTADO: 0 falhas');
process.exit(falhas ? 1 : 0);
