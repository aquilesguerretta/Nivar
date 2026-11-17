// Verifica o porte dos onze instrumentos do Módulo 13 contra o script ORIGINAL.
//
// Fonte (só leitura): `Alexandria modulos/alexandria_modulo13.html`. O script da
// fonte roda no DOM simulado (`../mini-dom.mjs`); ao lado dele roda a calculadora
// EFETIVA do produto (`INSTRUMENT_CALCULATORS`, que já espalha
// `CALCULADORAS_POR_MODULO`), no mesmo espaço de entradas:
//   · seleções: o produto cartesiano inteiro das opções;
//   · numéricos: grade (5 pontos por campo no INST·02, 3 nos outros, como a
//     extração), mais amostra pseudoaleatória fixa, mais, campo a campo, vazio,
//     ausente, fora de faixa (abaixo e acima) e decimal com vírgula.
//
// Reprova se:
//   (a) uma saída numérica difere da fonte nas casas que a fonte exibe;
//   (b) falta, no veredito + rótulos, palavra ou número do texto visível das
//       saídas da fonte (comparação por multiconjunto); e, no sentido inverso,
//       sobra no veredito palavra que não está na saída da fonte nem num rótulo
//       (de saída, de campo, ou da opção escolhida);
//   (c) há palavra no veredito que não existe em lugar nenhum do texto do
//       instrumento na fonte (markup + script);
//   (d) título, rótulos, unidades, opções ou padrões do `Instrument` diferem do
//       markup (ou, nas grades geradas por script, dos botões que a fonte gera).
// As exceções são só as das decisões do Founder e da voz da Alexandria rotulada,
// listadas abaixo com a razão.
//
// Uso: node tools/alexandria-dados/porte/verificar-instrumentos-m13.mjs [--detalhe] [--rapido]
//   --rapido  pula a grade e a amostra dos numéricos (fica o padrão e o campo a campo).
// Sai 0 com "RESULTADO: 0 falhas", 1 caso contrário. Node 24 (type stripping).

import { registerHooks } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { carregarModulo, decodificar, arquivoHtml } from '../mini-dom.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SRC = path.join(RAIZ, 'src') + path.sep;
const DETALHE = process.argv.includes('--detalhe');
const RAPIDO = process.argv.includes('--rapido');

// Resolve '@/' → src/ e import sem extensão → .ts (só para importar o produto).
registerHooks({
  resolve(spec, ctx, next) {
    let s = spec;
    if (s.startsWith('@/')) s = pathToFileURL(SRC + s.slice(2)).href;
    if ((s.startsWith('.') || s.startsWith('file:')) && !/\.[cm]?[jt]sx?$/.test(s)) {
      const base = s.startsWith('file:') ? s : new URL(s, ctx.parentURL).href;
      for (const ext of ['.ts', '.tsx', '/index.ts']) {
        const p = fileURLToPath(base + ext);
        if (fs.existsSync(p)) return next(pathToFileURL(p).href, ctx);
      }
    }
    return next(s, ctx);
  },
});

const { INSTRUMENT_CALCULATORS } = await import(pathToFileURL(SRC + 'lib/data/alexandria-instrument-calculators.ts').href);
const { INSTRUMENTOS_MODULO_13, MODULO_13_AULAS } = await import(pathToFileURL(SRC + 'lib/data/alexandria-modulo-13-content.ts').href);
const EXT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m13/instrumentos.json'), 'utf8'));
const HTML = fs.readFileSync(arquivoHtml(13), 'utf8');

// ── Exceções, cada uma com a razão ─────────────────────────────
/** Palavras da saída da fonte que podem faltar no produto. */
const FALTA_PERMITIDA = {
  'm13-inst-09': { sexta: 'Q04 / QA-M13-A06 (Founder, 15/11/2026): o instrumento tem OITO riscos; "A sexta categoria" (cred, lente empresa) perde o número.' },
};
/** Palavras que o produto pode ter e a fonte do instrumento não tem. */
const PALAVRA_PERMITIDA = {
  // Q03 (GridAlpha → NIVAR; War Room, Cobaia Zero, Summit) e Q10 ("Parte 13"):
  // medido — nenhuma ocorrência no markup nem no script dos onze. Lista vazia.
};
/** Grade sem rótulo no markup: o produto dá um nome tirado da intro (voz da
 *  Alexandria, decisão 7). A palavra tem de estar na intro do instrumento. */
const ROTULO_DA_INTRO = {
  'pn-grid': ['Empresa', 'Escolha uma lente e uma empresa'],
  'rt-grid': ['Etapa', 'Escolha o documento e a etapa'],
  'pv-grid': ['Situação', 'Cinco situações em que os dois números divergem'],
  'rk-grid': ['Categoria de risco', 'Escolha uma categoria de risco'],
};

// ── Utilidades ─────────────────────────────────────────────────
const fmt = (n, d) => (Number.isNaN(n) || !Number.isFinite(n) ? '—' : n.toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }));
const plano = (h) => decodificar(String(h).replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const TOK = /\p{L}+|\d+(?:[.,]\d+)*/gu;
const tokens = (s) => String(s).match(TOK) ?? [];
const palavras = (s) => String(s).match(/\p{L}+/gu) ?? [];
const multi = (arr) => { const m = new Map(); for (const t of arr) m.set(t, (m.get(t) ?? 0) + 1); return m; };
/** a − b, como multiconjunto. */
const menos = (a, b) => { const r = new Map(a); for (const [k, v] of b) { if (r.has(k)) { const x = r.get(k) - v; if (x > 0) r.set(k, x); else r.delete(k); } } return r; };
const lista = (m) => [...m].map(([k, v]) => (v > 1 ? `${k}×${v}` : k));

let semente = 13;
const aleatorio = () => { semente = (semente * 1103515245 + 12345) % 2147483648; return semente / 2147483648; };

function regiaoDoInstrumento(nn) {
  const iHd = HTML.indexOf(`<span class="id">INST·${nn}</span>`);
  const ini = HTML.lastIndexOf('<div class="inst">', iHd);
  const iDisc = HTML.indexOf('<p class="disc">', iHd);
  const fim = HTML.indexOf('</p>', iDisc) + 4;
  const sIni = HTML.indexOf(`/* ===================== INST·${nn} `);
  const sFim = HTML.indexOf('/* =====================', sIni + 10);
  return HTML.slice(ini, fim) + '\n' + HTML.slice(sIni, sFim);
}

// ── Especificação por instrumento (como mexer na fonte) ────────
const EXPLORADORES = {
  'm13-inst-01': { saidas: ['pn-lens', 'pn-item', 'pn-grid'], controles: [['pn-seg', 'data-v'], ['pn-ord', 'data-o'], ['pn-grid', 'data-e']] },
  'm13-inst-04': { saidas: ['rt-item'], controles: [['rt-seg', 'data-d'], ['rt-grid', 'data-s']], cruzado: 'rt-grid' },
  'm13-inst-05': { saidas: ['lc-item'], controles: [['lc-seg', 'data-l'], ['lc-grid', 'data-c']] },
  'm13-inst-06': { saidas: ['ct-item', 'ct-out'], controles: [['ct-grid', 'data-c']] },
  'm13-inst-07': { saidas: ['pv-dual', 'pv-note'], controles: [['pv-grid', 'data-p']] },
  'm13-inst-09': { saidas: ['rk-item', 'rk-out'], controles: [['rk-seg', 'data-l'], ['rk-grid', 'data-r']] },
  'm13-inst-10': { saidas: ['cp-tab', 'cp-note'], controles: [['cp-seg', 'data-i']] },
  'm13-inst-11': { saidas: ['an-bd'], controles: [['an-nav', 'data-b'], ['an-grid', 'data-a']] },
};
const VEREDITO_NUM = { 'm13-inst-02': 'mu-vd', 'm13-inst-03': 'dc-vd', 'm13-inst-08': 'ds-vd' };

/** Cache de elementos: o índice por id do mini-dom é refeito a cada escrita de
 *  innerHTML, e os contêineres de saída e de botões não mudam de identidade. */
const carregar = () => {
  const m = carregarModulo(13, { instrumentar: false });
  const c = new Map();
  const el = (id) => { if (!c.has(id)) c.set(id, m.el(id)); return c.get(id); };
  return { ...m, el, html: (id) => el(id)?.innerHTML ?? null, disparar: (x, tipo) => m.disparar(typeof x === "string" ? el(x) : x, tipo) };
};
const botoes = (m, id) => (m.el(id)?.querySelectorAll('button') ?? []);
function clicar(m, id, attr, valor) {
  const b = botoes(m, id).find((x) => x.getAttribute(attr) === valor);
  if (!b) return false;
  m.disparar(b, 'click');
  return true;
}

// ── Execução ───────────────────────────────────────────────────
const linhas = [];
let falhasTotais = 0;

for (const x of EXT.instrumentos) {
  const id = x.id;
  const nn = x.id_fonte.slice(-2);
  const inst = INSTRUMENTOS_MODULO_13.find((i) => i.id === id);
  const calc = INSTRUMENT_CALCULATORS[id];
  const falhas = { a: [], b: [], c: [], d: [] };
  const regiao = regiaoDoInstrumento(nn);
  const vocab = new Set(palavras(plano(regiao)).map((w) => w.toLowerCase()));
  const faltaOk = FALTA_PERMITIDA[id] ?? {};
  const ramos = new Map();
  let cenarios = 0;

  if (!inst) { falhas.d.push('Instrument ausente em INSTRUMENTOS_MODULO_13'); }
  if (!calc) { falhas.d.push('calculadora ausente em INSTRUMENT_CALCULATORS'); }

  // ── (d) Instrument × markup ──
  const m0 = carregar();
  if (inst) {
    // Regra de colocação (PORTE-POR-MODULO.md, 15/11): o instrumento do §MAP vai para a Aula 01
    // com rótulo de seção no cabeçalho, que o InstrumentoV3 lê do prefixo "gênero · " do título. O
    // rótulo é o nome da seção na fonte ("§MAP · Painel setorial"): "§MAP" é vocabulário interno (bar.md S4, P0).
    // "Instrumento · ": o título da fonte do INST·11 já traz " · ", e o cabeçalho do InstrumentoV3 parte
    // o título no primeiro " · " (gênero · nome); o prefixo explícito mantém o nome inteiro no h3.
    if (inst.title.replace(/^(Painel setorial|Instrumento) · /, '') !== x.titulo) falhas.d.push(`título «${inst.title}» × «${x.titulo}»`);
    if (inst.kind !== x.kind_sugerido) falhas.d.push(`kind ${inst.kind} × ${x.kind_sugerido}`);
    const notaPlana = plano(inst.note ?? '');
    for (const t of [x.intro.html, x.aviso.html, ...x.caixas_internas.flatMap((c) => [c.rotulo.html, ...c.paragrafos.map((p) => p.html)])]) {
      if (!notaPlana.includes(plano(t))) falhas.d.push(`note sem «${plano(t).slice(0, 50)}…»`);
    }
    const esperados = [...(x.entradas ?? []).map((e) => e.id), ...(x.controles ?? []).map((c) => c.id)];
    const tem = inst.fields.map((f) => f.id);
    if (esperados.join() !== tem.join()) falhas.d.push(`campos [${tem}] × markup [${esperados}]`);
    for (const e of x.entradas ?? []) {
      const f = inst.fields.find((y) => y.id === e.id);
      if (!f) continue;
      const exp = { label: e.rotulo, unit: e.unidade, kind: 'range', defaultValue: Number(e.number.value), min: Number(e.number.min), max: Number(e.number.max), step: Number(e.number.step) };
      for (const [k, v] of Object.entries(exp)) if (f[k] !== v) falhas.d.push(`${e.id}.${k} ${JSON.stringify(f[k])} × ${JSON.stringify(v)}`);
      const sc = e.script_numOf;
      if (sc && (Number(sc.padrao) !== exp.defaultValue || Number(sc.min) !== exp.min || Number(sc.max) !== exp.max)) falhas.d.push(`${e.id}: numOf do script difere do markup (Q07)`);
    }
    for (const c of x.controles ?? []) {
      const f = inst.fields.find((y) => y.id === c.id);
      if (!f) continue;
      if (f.kind !== 'select') falhas.d.push(`${c.id}.kind ${f.kind}`);
      if (c.rotulo) { if (f.label !== c.rotulo) falhas.d.push(`${c.id}.label «${f.label}» × «${c.rotulo}»`); }
      else if (!ROTULO_DA_INTRO[c.id] || f.label !== ROTULO_DA_INTRO[c.id][0] || !plano(x.intro.html).includes(ROTULO_DA_INTRO[c.id][1])) falhas.d.push(`${c.id}.label «${f.label}» sem rótulo no markup nem exceção da intro`);
      let ops;
      if (c.opcoes) ops = c.opcoes.map((o) => ({ value: o.valor, labels: [o.rotulo], inicial: o.inicial }));
      else {
        // grade gerada por script: os botões que a fonte desenha (no INST·04, os dois documentos)
        const vistos = [];
        const coleta = () => { for (const b of botoes(m0, c.id)) { const attr = Object.keys(b.attrs).find((k) => k.startsWith('data-')); const y = b.querySelector('span')?.textContent ?? ''; const n = b.textContent.slice(y.length); if (!vistos.some((v) => v.value === b.getAttribute(attr))) vistos.push({ value: b.getAttribute(attr), labels: [n, y ? `${y} · ${n}` : n], inicial: vistos.length === 0 }); } };
        if (c.id === 'rt-grid') { clicar(m0, 'rt-seg', 'data-d', 'rel'); coleta(); clicar(m0, 'rt-seg', 'data-d', 'fre'); coleta(); clicar(m0, 'rt-seg', 'data-d', 'rel'); }
        else coleta();
        ops = vistos;
      }
      const fo = f.options ?? [];
      if (fo.length !== ops.length) falhas.d.push(`${c.id}: ${fo.length} opções × ${ops.length} na fonte`);
      ops.forEach((o, k) => {
        const p = fo[k];
        if (!p || p.value !== o.value || !o.labels.includes(p.label)) falhas.d.push(`${c.id}[${k}] ${JSON.stringify(p)} × ${o.value} «${o.labels[0]}»`);
      });
      const ini = ops.find((o) => o.inicial)?.value;
      if (f.defaultValue !== ini) falhas.d.push(`${c.id}.defaultValue ${f.defaultValue} × ${ini}`);
    }
    const outEsp = [...(x.saidas ?? []).map((s) => [s.id, s.rotulo]), ...(x.barras ?? []).map((b) => [b.id_valor, b.rotulo])];
    const outTem = inst.outputs.map((o) => [o.id, o.label]);
    if (JSON.stringify(outEsp) !== JSON.stringify(outTem)) falhas.d.push(`saídas ${JSON.stringify(outTem)} × ${JSON.stringify(outEsp)}`);
  }

  // Aula a que o instrumento está ligado.
  const aula = MODULO_13_AULAS.find((a) => a.instruments.some((i) => i?.id === id));
  // Regra de colocação (PORTE-POR-MODULO.md, 15/11): o instrumento do §MAP vai para a Aula 01.
  const aulaEsperada = x.fora_de_aula ? 'aula-13-01' : `aula-13-${x.aula.slice(-2)}`;
  if ((aula?.id ?? null) !== aulaEsperada) falhas.d.push(`ligado a ${aula?.id ?? 'nenhuma aula'} × ${aulaEsperada}`);

  // ── comparação de um cenário ──
  const rotulosSaida = inst ? inst.outputs.flatMap((o) => [o.label, o.unit ?? '']) : [];
  const rotulosCampo = inst ? inst.fields.map((f) => f.label) : [];
  function comparar(m, entradas, saidasFonte, nome) {
    cenarios++;
    let r;
    try { r = calc(entradas); } catch (e) { falhas.a.push(`${nome}: calculadora lançou ${e.message}`); return; }
    const ver = r.veredito ?? '';
    const S = [];
    const M = [ver, ...rotulosSaida];
    // (a) números
    for (const s of x.saidas ?? []) {
      const txt = plano(m.html(s.id));
      S.push(txt);
      const d = Number((s.codigo_saida.match(/fmt\([^,]+,(\d)\)/) ?? [])[1] ?? 0);
      const v = r.valores?.[s.id];
      const o = inst.outputs.find((y) => y.id === s.id);
      if (v !== undefined && Number.isFinite(v)) {
        const f = fmt(v, d);
        M.push(f);
        const resto = txt.replace(f, ' ').replace(/\s+/g, ' ').trim();
        if (!txt.includes(f) || resto !== (o?.unit ?? '').replace(/\s+/g, ' ').trim()) falhas.a.push(`${nome}: ${s.id} produto «${f} ${o?.unit ?? ''}» × fonte «${txt}»`);
      } else if (/^—/.test(txt)) {
        // NaN na fonte ("—"): o produto não desenha a saída. Igual.
      } else if (!ver.includes(`${o?.label}: ${txt}`)) {
        falhas.a.push(`${nome}: ${s.id} sem número no produto e a leitura «${o?.label}: ${txt}» não está no veredito`);
      }
    }
    for (const b of x.barras ?? []) {
      const txt = plano(m.html(b.id_valor));
      S.push(txt);
      const v = r.valores?.[b.id_valor];
      const f = fmt(v, 0);
      M.push(f);
      if (f !== txt) falhas.a.push(`${nome}: ${b.id_valor} produto «${f}» × fonte «${txt}»`);
    }
    for (const id2 of saidasFonte) S.push(plano(m.html(id2)));
    // (b) multiconjunto, nos dois sentidos
    const falta = menos(multi(S.flatMap(tokens)), multi(M.flatMap(tokens)));
    for (const k of [...falta.keys()]) if (faltaOk[k]) falta.delete(k);
    if (falta.size) falhas.b.push(`${nome}: falta ${lista(falta).slice(0, 12).join(', ')}`);
    const opcoesEscolhidas = inst.fields.filter((f) => f.kind === 'select').map((f) => f.options.find((o) => o.value === String(entradas[f.id] ?? f.defaultValue))?.label ?? '');
    const sobra = menos(menos(multi(tokens(ver)), multi(S.flatMap(tokens))), multi([...rotulosSaida, ...rotulosCampo, ...opcoesEscolhidas].flatMap(tokens)));
    if (sobra.size) falhas.b.push(`${nome}: sobra no veredito ${lista(sobra).slice(0, 12).join(', ')}`);
    // (c) palavra inventada
    const novas = [...new Set(palavras(ver).map((w) => w.toLowerCase()))].filter((w) => !vocab.has(w) && !PALAVRA_PERMITIDA[w]);
    if (novas.length) falhas.c.push(`${nome}: ${novas.join(', ')}`);
    if (DETALHE && cenarios === 1) console.log(`\n[${id}] cenário 1\n  fonte:   ${S.join(' | ').slice(0, 400)}\n  produto: ${ver.slice(0, 400)}`);
  }

  // ── cenário-padrão: Instrument.defaults × fonte recém-carregada ──
  if (inst && calc) {
    const mP = carregar();
    const padrao = Object.fromEntries(inst.fields.map((f) => [f.id, f.defaultValue]));
    comparar(mP, padrao, EXPLORADORES[id]?.saidas ?? [VEREDITO_NUM[id]], 'padrão');
  }

  // ── espaço de entrada ──
  if (inst && calc && EXPLORADORES[id]) {
    const esp = EXPLORADORES[id];
    const m = carregar();
    const eixos = esp.controles.map(([cid]) => inst.fields.find((f) => f.id === cid).options.map((o) => o.value));
    const combos = eixos.reduce((acc, ops) => acc.flatMap((a) => ops.map((o) => [...a, o])), [[]]);
    for (const combo of combos) {
      let ok = true;
      esp.controles.forEach(([cid, attr], k) => {
        if (!clicar(m, cid, attr, combo[k])) {
          if (esp.cruzado !== cid) { ok = false; falhas.d.push(`opção ${cid}=${combo[k]} não existe na fonte`); }
        }
      });
      if (!ok) continue;
      const entradas = Object.fromEntries(esp.controles.map(([cid], k) => [cid, combo[k]]));
      comparar(m, entradas, esp.saidas, combo.join('/'));
    }
  } else if (inst && calc) {
    const m = carregar();
    const ent = x.entradas.map((e) => ({ id: e.id, min: Number(e.number.min), max: Number(e.number.max), def: Number(e.number.value), step: Number(e.number.step) }));
    const pontos = (e) => (id === 'm13-inst-02' ? [e.min, e.def, e.min + 0.25 * (e.max - e.min), e.min + 0.5 * (e.max - e.min), e.max] : [e.min, e.def, e.max]);
    const reBranch = (x.ramos_veredito ?? []).map((rv) => {
      const b = (rv.modelo_legivel.match(/<b>([\s\S]*?)<\/b>/) ?? [])[1] ?? '';
      return new RegExp('^' + b.split(/\{[^}]*\}/).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s\\S]*?') + '$');
    });
    const rodar = (valores, nome, produto = valores) => {
      for (const e of ent) m.el(e.id).value = String(valores[e.id]);
      m.disparar(ent[ent.length - 1].id, 'input');
      const vd = m.html(VEREDITO_NUM[id]);
      const b = plano((vd.match(/<b>([\s\S]*?)<\/b>/) ?? [])[1] ?? '');
      const k = reBranch.findIndex((re) => re.test(b));
      ramos.set(k + 1, (ramos.get(k + 1) ?? 0) + 1);
      const ent2 = {};
      for (const e of ent) if (produto[e.id] !== undefined) ent2[e.id] = produto[e.id];
      comparar(m, ent2, [VEREDITO_NUM[id]], nome);
    };
    // grade
    const eixos = ent.map(pontos);
    const combos = eixos.reduce((acc, ops) => acc.flatMap((a) => ops.map((o) => [...a, o])), [[]]);
    if (!RAPIDO) for (const c of combos) rodar(Object.fromEntries(ent.map((e, k) => [e.id, c[k]])), `grade ${c.join('/')}`);
    // amostra fixa, nos passos do campo
    for (let n = 0; n < (RAPIDO ? 0 : 3000); n++) {
      const v = Object.fromEntries(ent.map((e) => [e.id, Math.round((e.min + aleatorio() * (e.max - e.min)) / e.step) * e.step]));
      rodar(v, `amostra ${n}`);
    }
    // campo a campo: vazio, ausente, fora de faixa, vírgula
    for (const e of ent) {
      const base = Object.fromEntries(ent.map((y) => [y.id, y.def]));
      rodar({ ...base, [e.id]: '' }, `${e.id} vazio`);
      const semCampo = { ...base }; delete semCampo[e.id];
      rodar({ ...base, [e.id]: '' }, `${e.id} ausente`, semCampo);
      rodar({ ...base, [e.id]: e.min - 10 * e.step }, `${e.id} abaixo`);
      rodar({ ...base, [e.id]: e.max + 10 * e.step }, `${e.id} acima`);
      rodar({ ...base, [e.id]: String(e.def).replace('.', ',') }, `${e.id} vírgula`);
    }
  }

  const nf = falhas.a.length + falhas.b.length + falhas.c.length + falhas.d.length;
  falhasTotais += nf;
  const nRamos = (x.ramos_veredito ?? []).length;
  const ramosTxt = nRamos ? `${[...ramos.keys()].filter((k) => k > 0).length}/${nRamos}${ramos.has(0) ? ' (+não classificado)' : ''}` : '—';
  linhas.push({ id, aula: x.aula ?? '§MAP', kind: inst?.kind ?? '?', campos: inst?.fields.length ?? 0, saidas: inst?.outputs.length ?? 0, cenarios, a: falhas.a.length, b: falhas.b.length, c: falhas.c.length, d: falhas.d.length, ramos: ramosTxt, falhas });
}

// ── Relatório ──
const cab = ['instrumento', 'aula', 'kind', 'campos', 'saídas', 'cenários', '(a) núm', '(b) texto', '(c) inventada', '(d) markup', 'ramos', 'resultado'];
const tab = linhas.map((l) => [l.id, l.aula, l.kind, l.campos, l.saidas, l.cenarios, l.a, l.b, l.c, l.d, l.ramos, l.a + l.b + l.c + l.d ? 'FALHA' : 'ok'].map(String));
const larg = cab.map((c, k) => Math.max(c.length, ...tab.map((t) => t[k].length)));
const lin = (t) => '| ' + t.map((c, k) => c.padEnd(larg[k])).join(' | ') + ' |';
console.log(lin(cab));
console.log('|' + larg.map((w) => '-'.repeat(w + 2)).join('|') + '|');
for (const t of tab) console.log(lin(t));
for (const l of linhas) {
  for (const k of ['a', 'b', 'c', 'd']) {
    if (!l.falhas[k].length) continue;
    console.log(`\n${l.id} (${k}) — ${l.falhas[k].length} falha(s):`);
    for (const f of l.falhas[k].slice(0, 6)) console.log('  · ' + f);
  }
}
console.log('\nExceções aplicadas:');
for (const [i, ws] of Object.entries(FALTA_PERMITIDA)) for (const [w, r] of Object.entries(ws)) console.log(`  · ${i}: falta «${w}» — ${r}`);
for (const [c, [r, trecho]] of Object.entries(ROTULO_DA_INTRO)) console.log(`  · ${c}: rótulo «${r}» — voz da Alexandria (decisão 7); a grade não tem rótulo no markup, o nome vem da intro ("${trecho}").`);
console.log('  · Q03/Q10: nenhuma ocorrência de GridAlpha, War Room, Cobaia Zero, Summit ou "Parte 13" no texto dos onze (medido).');
console.log(`\nRESULTADO: ${falhasTotais} falhas`);
process.exit(falhasTotais ? 1 : 0);
