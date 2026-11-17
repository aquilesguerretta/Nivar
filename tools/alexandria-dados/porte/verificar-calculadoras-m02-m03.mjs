// Confere as calculadoras portadas do M02/M03 (src/lib/data/calculadoras/m0N.ts)
// contra o <script> ORIGINAL da fonte, executado sem reescrita no mini-dom.
//
// Para cada instrumento do módulo: varre o espaço de entrada declarado no
// conteúdo (min/max/step das réguas, todas as opções das seleções e pílulas) —
// inteiro quando cabe, senão uma amostra determinística com as bordas — e, em
// cada ponto, compara:
//   · cada saída de texto (`textos[id]`) com o textContent do elemento da fonte;
//   · o veredito (`veredito`) com o innerHTML do elemento de leitura da fonte.
// Trocas editoriais registradas (Q03) são aplicadas ao lado da fonte antes de
// comparar. Qualquer diferença é falha; a saída mostra o primeiro caso de cada.
//
// Uso: node tools/alexandria-dados/porte/verificar-calculadoras-m02-m03.mjs 2

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { carregarModulo } from '../mini-dom.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const n = Number(process.argv[2]);
const NN = String(n).padStart(2, '0');
const { CALCULADORAS } = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/calculadoras/m${NN}.ts`)).href);
const conteudo = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
const INST = conteudo[`INSTRUMENTOS_MODULO_${NN}`];

/** Onde a fonte escreve o veredito de cada instrumento (id do elemento) e,
 *  quando não é um `.verdict`, como comparar. */
export const LEITURA = {
  2: {
    'm02-inst-01': { el: 'i01-note', modo: 'texto' },
    'm02-inst-02': { el: 'i02-verdict' },
    'm02-inst-03': { el: 'i03-chain', modo: 'cadeia' },
    'm02-inst-04': { el: 'i08-verdict' },
    'm02-inst-05': { el: 'i04-verdict' },
    'm02-inst-06': { el: 'i09-verdict' },
    'm02-inst-07': { el: 'i05-verdict' },
    'm02-inst-08': null,
    'm02-inst-09': { el: 'i07-verdict' },
  },
  3: {
    'm03-inst-01': { el: ['i01-stack', 'i01-verdict'], modo: 'pilha' },
    'm03-inst-02': { el: 'i02-verdict' },
    'm03-inst-03': { el: 'i03-verdict' },
    'm03-inst-04': { el: 'i04-verdict' },
    'm03-inst-05': { el: 'i05-verdict' },
    'm03-inst-06': { el: 'i06-verdict' },
    'm03-inst-07': { el: 'i07-verdict' },
    'm03-inst-08': { el: 'i08-verdict' },
    'm03-inst-09': { el: 'i09-verdict' },
  },
};
/** Trocas Q03 no texto do veredito (as mesmas do porte). */
const TROCAS = {
  2: [['qualquer conversa de Summit.', 'qualquer conversa.']],
  3: [],
};

const normHtml = (s) => String(s ?? '').replace(/<b>\s*/g, '<b>').replace(/\s*<\/b>/g, '</b>').replace(/\s+/g, ' ').replace(/ /g, ' ').trim();
const plano = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const semEspaco = (s) => plano(s).replace(/[\s·]+/g, '');

function valoresDoCampo(f) {
  if (f.options?.length) return f.options.map((o) => o.value);
  if (f.min !== undefined && f.max !== undefined) {
    const passo = f.step ?? 1;
    const k = Math.round((f.max - f.min) / passo);
    const vs = [];
    for (let j = 0; j <= k; j++) vs.push(Number((f.min + j * passo).toFixed(6)));
    return vs;
  }
  return [f.defaultValue];
}

// Amostra determinística (LCG) quando o produto cartesiano passa do teto.
function* pontos(campos, teto = 3000) {
  const listas = campos.map(valoresDoCampo);
  const total = listas.reduce((s, l) => s * l.length, 1);
  if (total <= teto) {
    const idx = listas.map(() => 0);
    for (let c = 0; c < total; c++) {
      yield listas.map((l, i) => l[idx[i]]);
      for (let i = 0; i < idx.length; i++) { idx[i]++; if (idx[i] < listas[i].length) break; idx[i] = 0; }
    }
    return;
  }
  // bordas: todos no mínimo, todos no máximo, cada um sozinho nas pontas
  yield listas.map((l) => l[0]);
  yield listas.map((l) => l[l.length - 1]);
  for (let i = 0; i < listas.length; i++) for (const ponta of [0, -1]) yield listas.map((l, j) => (j === i ? l.at(ponta) : l[Math.floor(l.length / 2)]));
  let s = 12345;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  for (let c = 0; c < teto; c++) yield listas.map((l) => l[Math.floor(rnd() * l.length)]);
}

let falhas = 0;
for (const inst of INST) {
  const calc = CALCULADORAS[inst.id];
  if (!calc) { console.log(`✗ ${inst.id}: sem calculadora em calculadoras/m${NN}.ts`); falhas++; continue; }
  const leitura = LEITURA[n][inst.id];
  const m = carregarModulo(n, { instrumentar: false });
  let casos = 0, ruins = 0, primeiro = null;
  for (const p of pontos(inst.fields)) {
    const entrada = {};
    inst.fields.forEach((f, i) => { entrada[f.id] = p[i]; });
    // Pílula primeiro: no INST·08 do M03 ela repõe o FC do preset (a fonte faz isso no clique).
    const ordem = [...inst.fields].sort((a, b) => Number(b.id.endsWith('-pills')) - Number(a.id.endsWith('-pills')));
    for (const f of ordem) {
      const v = entrada[f.id];
      const chk = f.id.match(/^(i\d+-checks)-(\w+)$/);
      if (chk) {
        const el = m.doc.querySelectorAll(`#${chk[1]} .src-check`).find((b) => b.attrs['data-src'] === chk[2]);
        if (!el) throw new Error(`interruptor ${chk[2]} não achado em #${chk[1]}`);
        if (el.classList.contains('on') !== (String(v) === 'on')) m.disparar(el, 'click');
      } else if (f.id.endsWith('-pills')) {
        const pill = m.doc.querySelectorAll(`#${f.id} .pill`).find((b) => Object.values(b.dataset ?? {}).includes(String(v)) || Object.entries(b.attrs).some(([k, x]) => k.startsWith('data-') && x === String(v)));
        if (!pill) throw new Error(`pílula ${v} não achada em #${f.id}`);
        m.disparar(pill, 'click');
      } else {
        const el = m.el(f.id);
        if (!el) throw new Error(`campo ${f.id} não existe na fonte`);
        el.value = String(v);
        m.disparar(el, 'input');
      }
    }
    const res = calc(entrada);
    casos++;
    const difs = [];
    for (const [id, t] of Object.entries(res.textos ?? {})) {
      const fonte = m.texto(id);
      if (plano(t) !== plano(fonte)) difs.push(`${id}: porte «${plano(t)}» × fonte «${plano(fonte)}»`);
    }
    for (const o of inst.outputs) if (!(o.id in (res.textos ?? {})) && m.el(o.id) && !o.id.endsWith('verdict')) difs.push(`${o.id}: saída da fonte sem texto no porte`);
    if (leitura) {
      let fonte = leitura.modo === 'pilha' ? leitura.el.map((e) => m.texto(e)).join(' ') : leitura.modo === 'texto' ? m.texto(leitura.el) : m.html(leitura.el);
      for (const [de, para] of TROCAS[n]) fonte = fonte.split(de).join(para);
      const ok = leitura.modo === 'cadeia' || leitura.modo === 'pilha' ? semEspaco(res.veredito) === semEspaco(fonte)
        : leitura.modo === 'texto' ? plano(res.veredito) === plano(fonte)
        : normHtml(res.veredito) === normHtml(fonte);
      if (!ok) difs.push(`veredito: porte «${plano(res.veredito).slice(0, 120)}» × fonte «${plano(fonte).slice(0, 120)}»`);
    } else if (res.veredito) difs.push('veredito no porte, mas a fonte não tem leitura');
    if (difs.length) { ruins++; primeiro ??= { entrada, difs }; }
  }
  if (m.erros.length) console.log(`   (erros do script da fonte no mini-dom: ${m.erros.map((e) => e.msg).join(' | ')})`);
  if (ruins) {
    falhas++;
    console.log(`✗ ${inst.id} · ${inst.title}: ${ruins}/${casos} pontos divergem. Primeiro: ${JSON.stringify(primeiro.entrada)}`);
    for (const d of primeiro.difs) console.log(`     ${d}`);
  } else console.log(`✓ ${inst.id} · ${inst.title}: ${casos} pontos, textos e veredito iguais à fonte`);
}
console.log(falhas ? `RESULTADO: ${falhas} instrumento(s) com divergência` : 'RESULTADO: 0 falhas');
process.exit(falhas ? 1 : 0);
