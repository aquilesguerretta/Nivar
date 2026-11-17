// verificar-instrumentos-m09.mjs — confere as calculadoras do M09 contra o script
// ORIGINAL rodando no mini-dom (tools/alexandria-dados/mini-dom.mjs).
//
// Para cada cenário: mexe nos controles do HTML original (clique em seletor, chip,
// rótulo; digitação em campo), lê o que a fonte imprimiu, roda a calculadora portada
// com as entradas equivalentes e compara:
//   · número — o texto que a fonte imprime (fmt pt-BR) contra o valor portado
//     formatado com as mesmas casas;
//   · texto — readouts de texto, veredito e cartões, na ordem da tela, cada cartão
//     "Rótulo: texto", espaço colapsado. Igualdade exata, caractere a caractere.
// Diferenças declaradas (Q07/D16) são aplicadas ao lado da FONTE e contadas na saída.
// Também confere os campos de INSTRUMENTOS_MODULO_09 (rótulos e opções da fonte).
//
// Uso: node tools/alexandria-dados/porte/verificar-instrumentos-m09.mjs

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { carregarModulo } from '../mini-dom.mjs';
import { RAIZ } from './porte-m09-m11-comum.mjs';

const { CALCULADORAS } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/calculadoras/m09.ts')).href);

const colapsar = (s) => String(s ?? '').replace(/[\s ]+/g, ' ').trim();
const fmt = (n, d) => (isNaN(n) ? '—' : n.toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }));

let falhas = 0;
let cenarios = 0;
const decl = {};
const contaDecl = (k) => { decl[k] = (decl[k] || 0) + 1; };

function cartoesDe(m, id) {
  const box = m.el(id);
  if (!box) return '';
  return box.querySelectorAll('.ocard').map((c) => {
    const ok2 = c.querySelector('.ok2');
    const r = colapsar(ok2?.textContent ?? '');
    const todo = colapsar(c.textContent);
    return `${r} ${colapsar(todo.slice(r.length))}`;
  }).join(' ');
}
const t = (m, id) => colapsar(m.texto(id) ?? '');
const junta = (...p) => p.filter((x) => x && x.trim()).map(colapsar).join(' ');

function clicar(m, el) { if (!el) throw new Error('elemento ausente'); m.disparar(el, 'click'); }
function seg(m, idSeg, attr, valor) { clicar(m, m.el(idSeg).querySelectorAll('button').find((b) => b.attrs[attr] === valor)); }
function digitar(m, id, v) { const e = m.el(id); e.value = String(v); m.disparar(e, 'input'); }

function comparar(nome, cenario, esperado, obtido) {
  cenarios++;
  const erros = [];
  const textoDe = (h) => colapsar(String(h ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&'));
  if (esperado.texto !== undefined && textoDe(obtido.veredito) !== esperado.texto) {
    const a = esperado.texto, b = textoDe(obtido.veredito);
    let k = 0; while (k < a.length && a[k] === b[k]) k++;
    erros.push(`texto difere na posição ${k}:\n      fonte: «${a.slice(Math.max(0, k - 40), k + 80)}»\n      porte: «${b.slice(Math.max(0, k - 40), k + 80)}»`);
  }
  for (const [id, txtFonte] of Object.entries(esperado.textos ?? {})) {
    const meu = obtido.textos?.[id];
    if (meu !== txtFonte) erros.push(`textos.${id}: fonte «${txtFonte}» × porte «${meu}»`);
  }
  if (obtido.vereditoPtBr !== true) erros.push('vereditoPtBr ausente');
  for (const [id, [txtFonte, casas]] of Object.entries(esperado.numeros ?? {})) {
    const v = obtido.valores?.[id];
    const meu = v === undefined ? '(ausente)' : fmt(v, casas);
    if (meu !== txtFonte) erros.push(`${id}: fonte «${txtFonte}» × porte «${meu}»`);
  }
  if (erros.length) {
    falhas++;
    if (falhas <= 25) console.log(`  ✗ ${nome} ${JSON.stringify(cenario)}\n    ${erros.join('\n    ')}`);
  }
}

const novo = () => carregarModulo(9, { instrumentar: false });

// ── INST·01 ──────────────────────────────────────────────────────────────────
{
  const nos = [null, 'ger', 'ons', 'ccee', 'rede', 'dis', 'cat', 'liv', 'var'];
  for (const f of ['fisico', 'contrato', 'dinheiro']) for (const n of nos) {
    const m = novo();
    seg(m, 'mp-seg', 'data-f', f);
    if (n) clicar(m, m.doc.querySelectorAll('.mp-node').find((g) => g.attrs['data-n'] === n));
    const inp = { 'm09-mp-seg': f, ...(n ? { 'm09-mp-node': n } : {}) };
    comparar('INST·01', inp, { texto: junta(t(m, 'mp-flow'), t(m, 'mp-node')) }, CALCULADORAS['m09-inst-01'](inp));
  }
}

// ── INST·02 ── contadores: dos dados (D16), não do markup estático ───────────
{
  const m0 = novo();
  const markup = ['cmp-c1', 'cmp-c2', 'cmp-c3', 'cmp-c4'].map((id) => t(m0, id)).join('/');
  if (markup !== '1/3/4/2') { console.log(`  ! markup do INST·02 mudou: ${markup}`); falhas++; }
  for (let k = 0; k < 10; k++) {
    const m = novo();
    clicar(m, m.el('cmp-grid').querySelectorAll('button')[k]);
    const inp = { 'm09-cmp-grid': String(k) };
    // D16 / QA-M09-A01: a contagem vem dos dados do script (1/4/3/2), não do markup (1/3/4/2).
    contaDecl('D16 contadores do INST·02 pelos dados (1/4/3/2), markup diz 1/3/4/2');
    comparar('INST·02', inp, {
      texto: junta(cartoesDe(m, 'cmp-out'), t(m, 'cmp-note')),
      numeros: { 'm09-cmp-c1': ['1', 0], 'm09-cmp-c2': ['4', 0], 'm09-cmp-c3': ['3', 0], 'm09-cmp-c4': ['2', 0] },
    }, CALCULADORAS['m09-inst-02'](inp));
  }
}

// ── INST·03 ──────────────────────────────────────────────────────────────────
for (const [w, l] of [['lei-seg', 'nova'], ['lei-seg', 'exist'], ['lei-seg', 'ajuste'], ['lei-seg2', 'fontes'], ['lei-seg2', 'reserva'], ['lei-seg2', 'cap']]) {
  for (const md of ['qtd', 'disp']) {
    const m = novo();
    seg(m, w, 'data-l', l);
    seg(m, 'mod-seg', 'data-m', md);
    const inp = { 'm09-lei-seg': l, 'm09-mod-seg': md };
    comparar('INST·03', inp, { texto: junta(cartoesDe(m, 'lei-out'), t(m, 'lei-mod')) }, CALCULADORAS['m09-inst-03'](inp));
  }
}

// ── INST·04 ──────────────────────────────────────────────────────────────────
{
  const conjuntos = [[], [0], [1, 3], [0, 1, 2, 3], [0, 1, 2, 3, 4], [4]];
  for (const s of ['ga', 'bt1', 'bt2']) for (const marc of conjuntos) for (const [d0, m1, m2] of [['11/2025', 24, 36], ['03/2026', 0, 120], ['12/2025', 13, 1]]) {
    const m = novo();
    seg(m, 'el-seg', 'data-s', s);
    digitar(m, 'el-d0', d0);
    digitar(m, 'el-m1', m1);
    digitar(m, 'el-m2', m2);
    for (const k of marc) clicar(m, m.el('el-req').querySelectorAll('button')[k]);
    const [mes, ano] = d0.split('/');
    const inp = { 'm09-el-seg': s, 'm09-el-d0-mes': mes, 'm09-el-d0-ano': ano, 'm09-el-m1': m1, 'm09-el-m2': m2 };
    marc.forEach((k) => { inp[`m09-el-req-${k}`] = '1'; });
    comparar('INST·04', inp, {
      texto: junta(t(m, 'el-v'), cartoesDe(m, 'el-out')),
      textos: { 'm09-el-p': t(m, 'el-p'), 'm09-el-e': t(m, 'el-e') },
      numeros: { 'm09-el-n': [t(m, 'el-n'), 0] },
    }, CALCULADORAS['m09-inst-04'](inp));
  }
}

// ── INST·05 — as 288 combinações ─────────────────────────────────────────────
{
  const dims = { 'mc-hz': ['curto', 'medio', 'longo'], 'mc-vol': ['flat', 'sazo', 'mod', 'lf'], 'mc-flex': ['rig', 'estr', 'ampl'], 'mc-idx': ['fixo', 'ipca', 'cambio', 'pld'], 'mc-sub': ['mesmo', 'dif'] };
  const m = novo();
  const combos = [[]];
  for (const [d, vs] of Object.entries(dims)) { const nv = []; for (const c of combos) for (const v of vs) nv.push([...c, [d, v]]); combos.splice(0, combos.length, ...nv); }
  for (const c of combos) {
    for (const [d, v] of c) seg(m, d, 'data-v', v);
    const inp = Object.fromEntries(c.map(([d, v]) => [`m09-${d}`, v]));
    let v = t(m, 'mc-v');
    // Q07: "de cinco" → "de seis" (os pesos somam até 6)
    if (/de cinco/.test(v)) { v = v.replace(/de cinco/g, 'de seis'); contaDecl('Q07 INST·05 "de cinco" → "de seis"'); }
    comparar('INST·05', inp, {
      texto: junta(v, cartoesDe(m, 'mc-out')),
      textos: { 'm09-mc-r1': t(m, 'mc-r1'), 'm09-mc-r2': t(m, 'mc-r2'), 'm09-mc-r3': t(m, 'mc-r3'), 'm09-mc-r4': t(m, 'mc-r4') },
      numeros: { 'm09-mc-r4': [t(m, 'mc-r4'), 0] },
    }, CALCULADORAS['m09-inst-05'](inp));
  }
}

// ── INST·06 — as 42 células ──────────────────────────────────────────────────
for (const [w, c] of [['mx-c1', 'flat'], ['mx-c1', 'sazo'], ['mx-c1', 'mod'], ['mx-c2', 'lf'], ['mx-c2', 'banda'], ['mx-c2', 'idx']]) {
  for (const r of ['preco', 'volume', 'perfil', 'sub', 'cred', 'saida', 'reg']) {
    const m = novo();
    seg(m, w, 'data-c', c);
    clicar(m, m.el('mx-risk').querySelectorAll('button').find((b) => b.attrs['data-r'] === r));
    const inp = { 'm09-mx-c': c, 'm09-mx-risk': r };
    comparar('INST·06', inp, { texto: junta(cartoesDe(m, 'mx-out'), t(m, 'mx-res')) }, CALCULADORAS['m09-inst-06'](inp));
  }
}

// ── INST·07 ──────────────────────────────────────────────────────────────────
{
  const valores = [
    [1000, 15, 20, 100, 10], [1000, 0, 0, 100, 0], [50000, 60, 80, 130, 40], [50, 5, 3, 98, 1], [2500, 30, 10, 85, 15], [1000, 999, 20, 100, 10], [1000, 15, 20, 100, 15],
  ];
  for (const e of ['flat', 'sazo', 'mod']) for (const [C, S, H, V, F] of valores) {
    const m = novo();
    seg(m, 'ex-seg', 'data-e', e);
    digitar(m, 'ex-c', C); digitar(m, 'ex-s', S); digitar(m, 'ex-h', H); digitar(m, 'ex-v', V); digitar(m, 'ex-f', F);
    const inp = { 'm09-ex-seg': e, 'm09-ex-c': C, 'm09-ex-s': S, 'm09-ex-h': H, 'm09-ex-v': V, 'm09-ex-f': F };
    const os = t(m, 'ex-os').replace(/%$/, '');
    const oh = t(m, 'ex-oh').replace(/%$/, '');
    comparar('INST·07', inp, {
      texto: t(m, 'ex-vd'),
      numeros: { 'm09-ex-p': [t(m, 'ex-p'), 1], 'm09-ex-m': [t(m, 'ex-m'), 0], 'm09-ex-os': [os, 1], 'm09-ex-oh': [oh, 1] },
      textos: { 'm09-ex-p': t(m, 'ex-p'), 'm09-ex-m': t(m, 'ex-m'), 'm09-ex-os': t(m, 'ex-os'), 'm09-ex-oh': t(m, 'ex-oh') },
    }, CALCULADORAS['m09-inst-07'](inp));
  }
}

// ── INST·08 ──────────────────────────────────────────────────────────────────
for (const f of [0.6, 0.84, 0.85, 0.92, 0.99, 1.0, 1.2]) for (const [g, v] of [[100, 95], [100, 92], [100, 80], [1500, 130], [1, 0]]) {
  const m = novo();
  digitar(m, 'gs-f', f); digitar(m, 'gs-g', g); digitar(m, 'gs-v', v);
  const inp = { 'm09-gs-f': f, 'm09-gs-g': g, 'm09-gs-v': v };
  comparar('INST·08', inp, {
    texto: t(m, 'gs-vd'),
    textos: { 'm09-gs-a': t(m, 'gs-a'), 'm09-gs-c': t(m, 'gs-c'), 'm09-gs-d': t(m, 'gs-d'), 'm09-gs-s': t(m, 'gs-s') },
    numeros: { 'm09-gs-a': [t(m, 'gs-a'), 1], 'm09-gs-c': [t(m, 'gs-c'), 1], 'm09-gs-d': [t(m, 'gs-d'), 1] },
  }, CALCULADORAS['m09-inst-08'](inp));
}

// ── INST·09 — as 729 combinações completas e respostas parciais ──────────────
{
  const ks = ['dados', 'horizonte', 'janela', 'governanca', 'estabilidade', 'proposta'];
  const m = novo();
  const roda = (resp) => {
    for (const [k, v] of Object.entries(resp)) clicar(m, m.el('rt-qs').querySelectorAll('label.opt').find((l) => l.attrs['data-k'] === k && l.attrs['data-v'] === v));
    const inp = Object.fromEntries(Object.entries(resp).map(([k, v]) => [`m09-rt-${k}`, v]));
    comparar('INST·09', inp, {
      texto: junta(t(m, 'rt-v'), cartoesDe(m, 'rt-out')),
      numeros: { 'm09-rt-n': [t(m, 'rt-n'), 0], 'm09-rt-l': [t(m, 'rt-l'), 0], 'm09-rt-i': [t(m, 'rt-i'), 0] },
    }, CALCULADORAS['m09-inst-09'](inp));
  };
  // parciais, num módulo novo (as respostas do script não se desfazem)
  {
    const p = novo();
    const resp = {};
    for (const [k, v] of [['dados', 'sim'], ['janela', 'nao'], ['proposta', 'ns']]) {
      resp[k] = v;
      clicar(p, p.el('rt-qs').querySelectorAll('label.opt').find((l) => l.attrs['data-k'] === k && l.attrs['data-v'] === v));
      const inp = Object.fromEntries(Object.entries(resp).map(([a, b]) => [`m09-rt-${a}`, b]));
      comparar('INST·09 parcial', inp, { texto: junta(t(p, 'rt-v'), cartoesDe(p, 'rt-out')), numeros: { 'm09-rt-n': [t(p, 'rt-n'), 0], 'm09-rt-l': [t(p, 'rt-l'), 0], 'm09-rt-i': [t(p, 'rt-i'), 0] } }, CALCULADORAS['m09-inst-09'](inp));
    }
  }
  const vs = ['sim', 'nao', 'ns'];
  for (let c = 0; c < 729; c++) {
    const resp = {};
    let x = c;
    for (const k of ks) { resp[k] = vs[x % 3]; x = Math.floor(x / 3); }
    roda(resp);
  }
}

// ── INST·10 e INST·11 ────────────────────────────────────────────────────────
for (let k = 0; k < 8; k++) {
  const m = novo();
  clicar(m, m.el('cc-grid').querySelectorAll('button')[k]);
  comparar('INST·10', { k }, { texto: junta(cartoesDe(m, 'cc-out'), t(m, 'cc-v')) }, CALCULADORAS['m09-inst-10']({ 'm09-cc-grid': String(k) }));
  const n = novo();
  clicar(n, n.el('ld-grid').querySelectorAll('button')[k]);
  comparar('INST·11', { k }, { texto: cartoesDe(n, 'ld-out') }, CALCULADORAS['m09-inst-11']({ 'm09-ld-grid': String(k) }));
}

// ── padrão: a calculadora sem entrada reproduz o cenário-padrão da fonte ──────
{
  const m = novo();
  comparar('INST·07 padrão', {}, { texto: t(m, 'ex-vd'), numeros: { 'm09-ex-p': [t(m, 'ex-p'), 1], 'm09-ex-m': [t(m, 'ex-m'), 0] } }, CALCULADORAS['m09-inst-07']({}));
  comparar('INST·08 padrão', {}, { numeros: { 'm09-gs-a': [t(m, 'gs-a'), 1], 'm09-gs-c': [t(m, 'gs-c'), 1], 'm09-gs-d': [t(m, 'gs-d'), 1] } }, CALCULADORAS['m09-inst-08']({}));
  comparar('INST·05 padrão', {}, { numeros: { 'm09-mc-r4': [t(m, 'mc-r4'), 0] } }, CALCULADORAS['m09-inst-05']({}));
}

// ── os campos do arquivo de conteúdo ─────────────────────────────────────────
{
  const { INSTRUMENTOS_MODULO_09 } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-modulo-09-content.ts')).href);
  const ids = INSTRUMENTOS_MODULO_09.map((x) => x.id);
  const esperado = Array.from({ length: 11 }, (_, k) => `m09-inst-${String(k + 1).padStart(2, '0')}`);
  if (JSON.stringify(ids) !== JSON.stringify(esperado)) { falhas++; console.log(`  ✗ INSTRUMENTOS_MODULO_09: ${ids.join(', ')}`); }
  for (const inst of INSTRUMENTOS_MODULO_09) {
    if (!CALCULADORAS[inst.id]) { falhas++; console.log(`  ✗ ${inst.id} sem calculadora`); continue; }
    // toda saída declarada aparece no cenário padrão (ou é condicional, como o ano do INST·04)
    const r = CALCULADORAS[inst.id](Object.fromEntries(inst.fields.filter((f) => f.defaultValue !== '').map((f) => [f.id, f.defaultValue])));
    for (const o of inst.outputs) if (!(o.id in r.valores) && !(o.id in (r.textos ?? {}))) { falhas++; console.log(`  ✗ ${inst.id}: saída ${o.id} não calculada no padrão`); }
    for (const f of inst.fields) {
      if (f.kind === 'select' && !(f.options ?? []).some((o) => o.value === String(f.defaultValue))) { falhas++; console.log(`  ✗ ${inst.id}: padrão de ${f.id} fora das opções`); }
    }
  }
  // texto do instrumento contra a extração: título, nota (intro + aviso), rótulos
  const fs = await import('node:fs');
  const EXT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m09/instrumentos.json'), 'utf8'));
  const sem = (s) => colapsar(String(s ?? '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
  const troca = (s) => { if (/Bloco 10/.test(s)) contaDecl('Q03 "Bloco 10" → "Módulo 10" na nota do INST·02'); return s.replace(/Bloco 10/g, 'Módulo 10'); };
  for (const x of EXT.instrumentos) {
    const inst = INSTRUMENTOS_MODULO_09.find((i) => i.id === x.id);
    if (!inst) continue;
    const erros = [];
    const titulo = x.titulo;
    if (inst.title !== titulo) erros.push(`título «${inst.title}» × «${x.titulo}»`);
    const nota = sem(inst.note);
    for (const parte of [x.intro?.html, x.disclaimer?.html]) if (parte && !nota.includes(troca(sem(parte)))) erros.push(`nota sem «${sem(parte).slice(0, 60)}»`);
    const rotulos = inst.fields.map((f) => f.label).join(' | ');
    const rotulosFonte = [...x.entradas.seletores.map((s) => s.rotulo), ...x.entradas.campos.map((c) => c.rotulo), ...x.entradas.grades_dinamicas.map((g) => g.rotulo)];
    // declarados: a grade de requisitos do INST·04 vira cinco campos com o nome de cada
    // requisito; as seis perguntas do INST·09 são os próprios rótulos.
    for (const r of rotulosFonte) if (!rotulos.includes(r) && !(x.id === 'm09-inst-04' && r === 'Requisitos legais prévios já cumpridos')) erros.push(`rótulo da fonte ausente: «${r}»`);
    for (const ro of x.saidas.readouts) {
      const o = inst.outputs.find((y) => y.label === ro.rotulo);
      const ehTexto = false;
      if (!o && !ehTexto) erros.push(`readout «${ro.rotulo}» sem saída`);
    }
    if (erros.length) { falhas++; console.log(`  ✗ ${x.id}: ${erros.join(' · ')}`); }
    cenarios++;
  }
}

console.log(`\n${cenarios} cenários conferidos contra o script original · ${falhas} falha(s)`);
for (const [k, v] of Object.entries(decl)) console.log(`  diferença declarada aplicada à fonte: ${k} (${v}×)`);
console.log(falhas ? 'RESULTADO: FALHA' : 'RESULTADO: 0 falhas');
process.exit(falhas ? 1 : 0);
