// Confere as 10 calculadoras do M14 (src/lib/data/calculadoras/m14.ts) contra o
// <script> ORIGINAL da fonte, executado no mini-DOM (tools/alexandria-dados/mini-dom.mjs).
//
// Para cada instrumento, um leque de cenários: o padrão, cada opção de cada seleção,
// cada campo numérico no mínimo, no máximo e fora da faixa (o script prende à faixa),
// e 150 cenários sorteados (gerador determinístico). Em cada cenário:
//   · saída numérica: o texto que o script escreve × o valor da calculadora formatado com
//     as MESMAS casas que o script usou (o número escrito tem de ser idêntico);
//   · veredito: texto do script (sem marcas) × veredito da calculadora, idênticos;
//   · explorador: toda folha de texto dos painéis do script tem de estar no veredito.
//
// CONSERTOS (Q05; D01, D02, QA-M14-02b): o script é remendado ANTES de executar, com os
// trechos exatos abaixo; cada remendo tem de casar exatamente o número de vezes declarado,
// senão o verificador para. Assim o que se compara é a fonte consertada, não uma segunda
// reimplementação.
//
// Uso: node tools/alexandria-dados/porte/verificar-instrumentos-m14.mjs [--inst 7] [--detalhe]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const argv = process.argv.slice(2);
const SO = argv.includes('--inst') ? Number(argv[argv.indexOf('--inst') + 1]) : null;
const DETALHE = argv.includes('--detalhe');

// ── remendos (consertos da própria fonte) ───────────────────
const REMENDOS = [
  { id: 'D01 / QA-M14-01', de: 'var en=vol*36/1000;', para: 'var en=vol*36;', vezes: 1 },
  { id: 'D02 / QA-M14-02a (conta)', de: 'var evit=energiaMJ*R1.ref*(dic/100)/1e6;', para: 'var evit=energiaMJ*dic/1e6;', vezes: 1 },
  { id: 'D02 / QA-M14-02a (veredito, base)', de: "fmt(dic,0)+'%. Instrumento aplicável: '", para: "fmt(dic,0)+' gCO₂e/MJ. Instrumento aplicável: '", vezes: 1 },
  { id: 'D02 / QA-M14-02a (veredito, ramo ≥ 85)', de: "' Um diferencial de '+fmt(dic,0)+'% descreve", para: "' Um diferencial de '+fmt(dic,0)+' gCO₂e/MJ descreve", vezes: 1 },
  { id: 'QA-M14-02b (21,1 MJ/L no etanol)', de: "us:'mi L',mj:21.3,", para: "us:'mi L',mj:21.1,", vezes: 2 },
];
const HTML = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo14.html';
const lerOriginal = fs.readFileSync.bind(fs);
fs.readFileSync = (p, ...r) => {
  const s = lerOriginal(p, ...r);
  if (path.resolve(String(p)) !== path.resolve(HTML)) return s;
  let t = String(s);
  for (const rm of REMENDOS) {
    const n = t.split(rm.de).length - 1;
    if (n !== rm.vezes) throw new Error(`remendo ${rm.id}: casou ${n} vez(es), esperado ${rm.vezes}`);
    t = t.split(rm.de).join(rm.para);
  }
  return t;
};
const { carregarModulo } = await import(pathToFileURL(path.join(RAIZ, 'tools/alexandria-dados/mini-dom.mjs')).href);
const { CALCULADORAS } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/calculadoras/m14.ts')).href);
const { MODULO_14_INSTRUMENTOS } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-modulo-14-content.ts')).href);
const EXT = JSON.parse(lerOriginal(path.join(RAIZ, 'docs/alexandria-v2/extraction/m14/instrumentos.json'), 'utf8'));

const norm = (s) => String(s ?? '').replace(/<[^>]+>/g, ' ').replace(/[\s\u00a0]+/g, ' ').replace(/ ([,.;:)])/g, '$1').trim();
const fmt = (n, d) => (Number.isNaN(n) || !Number.isFinite(n) ? '—' : n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }));

// ── como dirigir cada instrumento no DOM da fonte ───────────
// seleção: id do campo → { contêiner, atributo }; ordem = ordem de aplicação
const SELECOES = {
  1: [['mp-dim', 'mp-dim', 'data-d'], ['mp-chips', 'mp-chips', 'data-r']],
  3: [['mx-perf', 'mx-perf', 'data-p']],
  4: [['rt-dim', null, 'data-d']], // rt-dim ou rt-dim2, conforme o valor
  5: [['dm-base', 'dm-base', 'data-b'], ['dm-est', 'dm-est', 'data-e']],
  7: [['bm-rota', 'bm-rota', 'data-r']],
  8: [['cb-rota', 'cb-rota', 'data-r'], ['cb-cert', 'cb-cert', 'data-c']],
  9: [['cl-ins', 'cl-ins', 'data-i'], ['cl-dest', 'cl-dest', 'data-d']],
  10: [['vf-tipo', 'vf-tipo', 'data-t'], ['vf-chips', 'vf-chips', 'data-k']],
};
const VEREDITO = { 2: 'pd-vd', 3: 'mx-vd', 5: 'dm-vd', 6: 'cg-vd', 7: 'bm-vd', 8: 'cb-vd' };
const PAINEIS = { 1: ['mp-flux', 'mp-panel'], 4: ['rt-out', 'rt-vd'], 9: ['cl-out', 'cl-vd'], 10: ['vf-panel'] };
// Folha de painel que não entra no veredito, com a razão (impressa na saída).
const EXPLICADAS = {
  4: { Rota: 'cabeçalho da 1ª coluna da tabela do painel; na tela cada linha é uma saída com o nome da rota como rótulo' },
};
const explicadas = new Set();

function clicar(m, contId, attr, valor) {
  let cont = contId ? m.el(contId) : null;
  if (!cont) { // INST·04: o botão pode estar em rt-dim ou rt-dim2
    for (const c of ['rt-dim', 'rt-dim2']) if (m.el(c)?.querySelectorAll('button').some((b) => b.attrs[attr] === valor)) cont = m.el(c);
  }
  const b = cont?.querySelectorAll('button').find((x) => x.attrs[attr] === valor);
  if (!b) return false; // opção que o script não oferece neste estado (ex.: chip filtrado)
  m.disparar(b, 'click');
  return true;
}

/** Um módulo carregado por instrumento; cada cenário põe TODOS os controles no
 *  valor do cenário (seleções primeiro, na ordem do script; depois os números), como
 *  um aluno faria, e o script recalcula. */
function executarFonte(n, m, cen) {
  for (const [campo, cont, attr] of SELECOES[n] ?? []) if (campo in cen) clicar(m, cont, attr, String(cen[campo]));
  for (const [id, v] of Object.entries(cen)) {
    if ((SELECOES[n] ?? []).some(([c]) => c === id)) continue;
    const el = m.el(id);
    if (!el) throw new Error(`INST·${n}: #${id} não existe na fonte`);
    el.value = String(v);
    m.disparar(el, 'input');
  }
  if (m.erros.length) throw new Error(`INST·${n}: erro no script: ${m.erros.map((e) => e.msg).join('; ')}`);
  return m;
}

/** Folhas de texto de um elemento do mini-DOM. */
function folhas(el) {
  const LINHA = new Set(['b', 'strong', 'i', 'em', 'small', 'span', 'sub', 'sup', 'a', 'br']);
  const temBloco = (e) => (e.children ?? []).some((c) => !LINHA.has(c.tag) || temBloco(c));
  if (!temBloco(el)) return [norm(el.textContent)].filter(Boolean);
  return el.children.flatMap(folhas);
}

// ── cenários ────────────────────────────────────────────────
let semente = 14;
const aleat = () => ((semente = (semente * 1103515245 + 12345) % 2147483648) / 2147483648);
function cenarios(n, reg) {
  const sels = reg.fields.filter((f) => f.kind === 'select');
  const nums = reg.fields.filter((f) => f.kind !== 'select');
  const padrao = Object.fromEntries(reg.fields.map((f) => [f.id, f.defaultValue]));
  // todas as combinações de seleção
  let combos = [{}];
  for (const f of sels) combos = combos.flatMap((c) => f.options.map((o) => ({ ...c, [f.id]: o.value })));
  const out = [];
  for (const combo of combos) {
    out.push({ ...padrao, ...combo });
    for (const f of nums) {
      // varredura densa no passo do campo (até 400 pontos), mais fora da faixa
      const passo = f.step ?? 1;
      const nPassos = Math.round((f.max - f.min) / passo);
      const salto = Math.max(1, Math.ceil(nPassos / 400));
      for (let k = 0; k <= nPassos; k += salto) out.push({ ...padrao, ...combo, [f.id]: +(f.min + k * passo).toFixed(6) });
      out.push({ ...padrao, ...combo, [f.id]: f.min - 1 }, { ...padrao, ...combo, [f.id]: f.max + 1 });
    }
  }
  for (let k = 0; k < 500; k++) {
    const c = {};
    for (const f of reg.fields) {
      if (f.kind === 'select') c[f.id] = f.options[Math.floor(aleat() * f.options.length)].value;
      else c[f.id] = +(f.min + Math.round((aleat() * (f.max - f.min)) / (f.step ?? 1)) * (f.step ?? 1)).toFixed(6);
    }
    out.push(c);
  }
  return out;
}

// ── execução ────────────────────────────────────────────────
let falhas = 0;
const resumo = [];
for (let n = 1; n <= 10; n++) {
  if (SO && n !== SO) continue;
  const id = `m14-inst-${String(n).padStart(2, '0')}`;
  const reg = MODULO_14_INSTRUMENTOS.find((x) => x.id === id);
  const calc = CALCULADORAS[id];
  const ext = EXT.instrumentos.find((x) => x.id === id);
  const erros = [];
  let comparacoes = 0;
  const mod = carregarModulo(14, { instrumentar: false });
  for (const cen of cenarios(n, reg)) {
    const m = executarFonte(n, mod, cen);
    // a calculadora recebe o que o aluno mexeu (o resto, padrão do campo)
    const entrada = {};
    for (const f of reg.fields) entrada[f.id] = cen[f.id];
    const r = calc(entrada);
    const rotulo = JSON.stringify(cen).slice(0, 160);
    // tudo o que a tela mostra do resultado: saídas textuais, veredito e rótulos das opções escolhidas
    const opcoesEscolhidas = reg.fields.filter((fl) => fl.kind === 'select').map((fl) => fl.options.find((o) => o.value === String(entrada[fl.id]))?.label ?? '');
    const naTela = [...Object.values(r.textos ?? {}), r.veredito ?? '', ...opcoesEscolhidas].join(' ');
    if (PAINEIS[n]) {
      // O mini-DOM junta <span>s vizinhos sem espaço ("InsumoCaldo…"): compara sem espaço.
      const compacto = (x) => norm(x).replace(/s/g, '');
      const fonte = PAINEIS[n].flatMap((pid) => folhas(m.el(pid)));
      const rotulos = reg.outputs.map((o) => o.label);
      const v = compacto(naTela + ' ' + rotulos.join(' '));
      for (const f of fonte) {
        comparacoes++;
        // folha "rótulo + valor" (span.k + texto): basta o valor estar na tela e o rótulo ser o da saída
        const rot = rotulos.filter((l) => compacto(f).startsWith(compacto(l))).sort((x, y) => y.length - x.length)[0];
        const alvo = rot ? compacto(f).slice(compacto(rot).length) : compacto(f);
        if (v.includes(alvo)) continue;
        const exp = EXPLICADAS[n]?.[f];
        if (exp) { explicadas.add(`INST·${n} «${f}»: ${exp}`); continue; }
        erros.push(`${rotulo}: painel «${f.slice(0, 90)}» ausente da tela`);
      }
      continue;
    }
    // saída: o texto da calculadora (`textos`) tem de ser IDÊNTICO ao que o script escreve
    for (const o of ext.saidas) {
      comparacoes++;
      const txt = norm(m.texto(o.id));
      const nosso = norm(String(r.textos?.[o.id] ?? '').replace(/<[^>]+>/g, ''));
      if (nosso !== txt) erros.push(`${rotulo}: ${o.id} fonte «${txt}» × calculadora «${nosso}»`);
    }
    const vf = norm(m.texto(VEREDITO[n]));
    comparacoes++;
    const semTag = (x) => norm(String(x ?? '').replace(/<[^>]+>/g, ''));
    if (vf !== semTag(r.veredito)) {
      let k = 0; const a = semTag(r.veredito);
      while (k < vf.length && vf[k] === a[k]) k++;
      erros.push(`${rotulo}: veredito difere em ${k}: fonte «…${vf.slice(Math.max(0, k - 30), k + 60)}» × calc «…${a.slice(Math.max(0, k - 30), k + 60)}»`);
    }
  }
  falhas += erros.length;
  resumo.push({ n, comparacoes, erros: erros.length });
  console.log(`INST·${String(n).padStart(2, '0')} ${reg.title.slice(0, 60)} — ${comparacoes} comparações, ${erros.length} falha(s)`);
  for (const e of erros.slice(0, DETALHE ? Infinity : 6)) console.log(`   ✗ ${e}`);
}
for (const e of explicadas) console.log(`· explicada: ${e}`);
console.log(`\nremendos aplicados à fonte antes de executar: ${REMENDOS.map((r) => r.id).join(' · ')}`);
console.log(falhas ? `RESULTADO: ${falhas} falha(s)` : 'RESULTADO: 0 falhas');
process.exit(falhas ? 1 : 0);
