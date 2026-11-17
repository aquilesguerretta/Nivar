// Grupo "instrumentos" do M03: os 9 INST · NN.
//  1. especificação lida do markup (entradas, saídas, nota, posição na aula);
//  2. script de cada instrumento verbatim + ramos de leitura (condição → texto);
//  3. EXECUÇÃO DO SCRIPT ORIGINAL em DOM simulado (§10 do protocolo): cenário-padrão
//     e varredura exaustiva do espaço de entrada (finito: min/max/step do markup);
//  4. comparação com o código portado (Instrument em alexandria-modulo-03-content.ts e
//     calculadora em alexandria-instrument-calculators.ts, avaliada por
//     module.stripTypeScriptTypes) sobre o MESMO espaço de entrada.
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import {
  SRC, CODE, L, ln, at, find, findAll, txt, stripTags, collapse, origem, pad, SECOES,
  blockEnd, writeJson, readCode, fail, TOTAL_LINHAS, hoje, decode,
} from './lib.mjs';

const KIND_TAXONOMIA = { '01': 'explorador', '02': 'calculadora', '03': 'simulador', '04': 'comparador', '05': 'simulador', '06': 'simulador', '07': 'dimensionador', '08': 'comparador', '09': 'quebra-cabeca' };

// ── 1. especificação do markup ──────────────────────────────
const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const instBlocks = findAll(/^\s*<div class="instrument">/).map((n) => {
  const end = blockEnd(n);
  const sec = SECOES.filter((s) => s.start <= n).pop();
  const idFonte = at(find(/class="instrument-id"/, n, end), /instrument-id">(.*)<\/div>/);
  const nn = idFonte.match(/(\d\d)$/)[1];
  // campos
  const campos = [];
  for (const f of findAll(/class="field">/, n, end)) {
    const fEnd = blockEnd(f);
    const lab = ln(f + 1).match(/<label class="field-label">(.*?)(?: <span class="unit">(.*)<\/span>)?<\/label>/);
    const numL = find(/<input type="number"/, f, fEnd);
    const rngL = find(/<input type="range"/, f, fEnd);
    const selL = find(/<select/, f, fEnd);
    if (numL) {
      const a = attrs(ln(numL)); const r = rngL ? attrs(ln(rngL)) : null;
      campos.push({
        id: a.id, tipo: 'numero', rotulo: decode(lab[1]), unidade: lab[2] ? decode(lab[2]) : null,
        padrao: Number(a.value), min: Number(a.min), max: Number(a.max), passo: Number(a.step),
        deslizador_gemeo: r ? { id: r.id, min: Number(r.min), max: Number(r.max), passo: Number(r.step), padrao: Number(r.value), mesma_faixa: r.min === a.min && r.max === a.max && r.step === a.step && r.value === a.value } : null,
        origem: origem(f + 1, `${idFonte} .field`),
      });
    } else if (selL) {
      const sEnd = find(/<\/select>/, selL);
      const opts = findAll(/<option/, selL, sEnd).map((k) => { const m = ln(k).match(/<option value="(.*?)"( selected)?>(.*)<\/option>/); return { valor: m[1], rotulo: decode(m[3]), selecionada: !!m[2] }; });
      campos.push({ id: attrs(ln(selL)).id, tipo: 'selecao', rotulo: decode(lab[1]), unidade: lab[2] ?? null, padrao: (opts.find((o) => o.selecionada) ?? opts[0]).valor, opcoes: opts, origem: origem(f + 1, `${idFonte} .field select`) });
    }
  }
  const pillRow = find(/class="pill-row"/, n, end);
  if (pillRow) {
    const pid = attrs(ln(pillRow)).id;
    const btns = findAll(/<button class="pill/, pillRow, find(/<\/div>/, pillRow)).map((k) => { const m = ln(k).match(/<button class="(pill(?: active)?)" data-([\w-]+)="(.*?)">(.*)<\/button>/); return { valor: m[3], rotulo: decode(m[4]), atributo: `data-${m[2]}`, ativa: m[1] === 'pill active' }; });
    campos.unshift({ id: pid, tipo: 'pilulas', rotulo: null, rotulo_nota: 'A fonte não rotula a fileira de pílulas.', unidade: null, padrao: btns.find((b) => b.ativa).valor, opcoes: btns, origem: origem(pillRow, `${idFonte} .pill-row`) });
  }
  const tog = find(/class="src-toggle-row"/, n, end);
  if (tog) {
    const chaves = findAll(/class="src-check/, tog, find(/^\s*<\/div>/, tog)).map((k) => { const m = ln(k).match(/<span class="(src-check(?: on)?)" data-src="(.*?)"><span class="sw"><\/span>(.*)<\/span>/); return { id: m[2], rotulo: decode(m[3]), ligada_por_padrao: m[1] === 'src-check on' }; });
    campos.push({ id: attrs(ln(tog)).id, tipo: 'chaves_booleanas', rotulo: null, rotulo_nota: 'A fonte não rotula a fileira; cada chave alterna por clique (classe "on").', unidade: null, chaves, origem: origem(tog, `${idFonte} .src-toggle-row`) });
  }
  const readouts = findAll(/class="readout"/, n, end).map((k) => {
    const m = ln(k).match(/<span class="readout-label">(.*?)<\/span>(?:<span class="readout-label" style="display:none"><\/span>)?<span class="(readout-value[^"]*)" id="(.*?)"(?: style="(.*?)")?>(.*?)<\/span>/);
    return { id: m[3], rotulo: decode(m[1]), classe: m[2], estilo: m[4] ?? null, valor_estatico_no_markup: m[5], span_oculto_vazio: /display:none/.test(ln(k)), origem: origem(k, `${idFonte} .readout`) };
  });
  const verdL = find(/class="verdict"/, n, end);
  const svgL = find(/<svg id=/, n, end);
  const stackL = find(/class="dispatch-stack"/, n, end);
  const noteL = find(/class="instrument-note"/, n, end);
  const noteEnd = find(/^\s*<\/div>/, noteL + 1);
  const noteHtml = L.slice(noteL, noteEnd - 1).join(' ');
  // posição no texto
  let prev = n - 1; while (!ln(prev).trim()) prev--;
  let next = end + 1; while (!ln(next).trim()) next++;
  return {
    nn, n, end, sec, idFonte,
    titulo: at(find(/class="instrument-title"/, n, end), /instrument-title">(.*)<\/div>/),
    campos, readouts,
    veredito_id: verdL ? attrs(ln(verdL)).id : null,
    desenho: svgL ? { tipo: 'svg', id: attrs(ln(svgL)).id, viewBox: attrs(ln(svgL)).viewBox } : stackL ? { tipo: 'pilha_html', id: attrs(ln(stackL)).id } : null,
    nota: { ...txt(noteHtml), origem: origem(noteL, `${idFonte} .instrument-note`) },
    antes: { linha: prev, trecho: ln(prev).trim().slice(0, 140) },
    depois: { linha: next, trecho: ln(next).trim().slice(0, 140) },
  };
});
if (instBlocks.length !== 9) fail(`esperava 9 instrumentos, achou ${instBlocks.length}`);

// ── 2. script verbatim + ramos ──────────────────────────────
const scriptStart = find(/^<script>/);
const scriptEnd = find(/^<\/script>/);
const iifeOf = (nn) => {
  const c = find(new RegExp(`INSTRUMENT ${nn}:`), scriptStart, scriptEnd);
  const s = find(/^\(function\(\)\{/, c);
  const e = find(/^\}\)\(\);/, s);
  return { comentario: ln(c).trim(), inicio: s, fim: e };
};
function ramos(iife) {
  const out = [];
  for (let k = iife.inicio; k <= iife.fim; k++) {
    const m = ln(k).match(/verd\.innerHTML = (.*);\s*$/);
    if (!m) continue;
    // blocos que ENVOLVEM a linha: varredura reversa por caractere, contando chaves
    const abre = [];
    let depth = 0;
    for (let j = k - 1; j > iife.inicio; j--) {
      const t = ln(j);
      if (/function (calc|render)\(/.test(t)) break;
      for (let q = t.length - 1; q >= 0; q--) {
        if (t[q] === '}') depth++;
        else if (t[q] === '{') { depth--; if (depth < 0) { abre.unshift({ linha: j, codigo: t.trim() }); depth = 0; } }
      }
    }
    const cls = ln(k - 1).match(/verd\.className = "(.*?)";/);
    out.push({
      linha: k,
      condicao_propria: abre.length ? abre[abre.length - 1] : null,
      condicoes_envolventes: abre.slice(0, -1),
      classe_css: cls ? cls[1] : null,
      expressao_js: m[1],
    });
  }
  // irmãos anteriores (mesmo encadeamento if / else if / else)
  out.forEach((r) => {
    r.irmaos_anteriores = [];
    if (!/^\} else/.test(r.condicao_propria?.codigo ?? '')) return;
    // sobe a partir da própria linha, no mesmo nível de chaves, colecionando if / else if
    let depth = 1; // o "}" inicial da própria linha fecha o irmão anterior
    for (let j = r.condicao_propria.linha - 1; j > iife.inicio; j--) {
      const t = ln(j);
      let achou = false;
      for (let q = t.length - 1; q >= 0; q--) {
        if (t[q] === '}') depth++;
        else if (t[q] === '{') { depth--; if (depth === 0 && /^\s*(\} )?(else )?if\s*\(/.test(t)) achou = true; }
      }
      if (achou) {
        r.irmaos_anteriores.unshift({ linha: j, codigo: t.trim() });
        if (!/^\s*\}/.test(t)) break;
      }
    }
  });
  return out;
}

// ── 3. DOM simulado + execução do original ──────────────────
function makeEl(id, init = {}) {
  const cls = new Set((init.className || '').split(/\s+/).filter(Boolean));
  const h = {};
  const el = {
    id, value: init.value ?? '', textContent: init.textContent ?? '', innerHTML: '', dataset: init.dataset ?? {}, style: {},
    classList: { add: (c) => cls.add(c), remove: (c) => cls.delete(c), toggle: (c) => (cls.has(c) ? cls.delete(c) : cls.add(c)), contains: (c) => cls.has(c) },
    get className() { return [...cls].join(' '); }, set className(v) { cls.clear(); v.split(/\s+/).filter(Boolean).forEach((c) => cls.add(c)); },
    addEventListener: (ev, fn) => { (h[ev] ||= []).push(fn); },
    fire: (ev) => (h[ev] || []).forEach((f) => f()),
    children: [],
    querySelectorAll: (sel) => el.children.filter((c) => sel === '.src-check'),
  };
  return el;
}
function buildDom() {
  const byId = {};
  const groups = {};
  for (const b of instBlocks) {
    for (const f of b.campos) {
      if (f.tipo === 'numero') {
        byId[f.id] = makeEl(f.id, { value: String(f.padrao) });
        if (f.deslizador_gemeo) byId[f.deslizador_gemeo.id] = makeEl(f.deslizador_gemeo.id, { value: String(f.deslizador_gemeo.padrao) });
      } else if (f.tipo === 'selecao') byId[f.id] = makeEl(f.id, { value: f.padrao });
      else if (f.tipo === 'pilulas') {
        byId[f.id] = makeEl(f.id);
        const attr = f.opcoes[0].atributo.replace('data-', '');
        groups[`#${f.id} .pill`] = f.opcoes.map((o) => makeEl(null, { className: o.ativa ? 'pill active' : 'pill', dataset: { [attr]: o.valor } }));
      } else if (f.tipo === 'chaves_booleanas') {
        byId[f.id] = makeEl(f.id);
        byId[f.id].children = f.chaves.map((c) => makeEl(null, { className: c.ligada_por_padrao ? 'src-check on' : 'src-check', dataset: { src: c.id } }));
      }
    }
    for (const r of b.readouts) byId[r.id] = makeEl(r.id);
    if (b.veredito_id) byId[b.veredito_id] = makeEl(b.veredito_id, { className: 'verdict' });
    if (b.desenho) byId[b.desenho.id] = makeEl(b.desenho.id);
  }
  const document = {
    getElementById: (x) => byId[x] ?? null,
    querySelectorAll: (sel) => groups[sel] ?? [],
    documentElement: {}, body: {},
  };
  return { byId, groups, document };
}
const scriptLines = L.slice(scriptStart, scriptEnd - 1); // conteúdo entre <script> e </script>
const BR = [];
const instrumented = scriptLines.map((t, k) => {
  const lineNo = scriptStart + 1 + k;
  return t.replace(/verd\.innerHTML = (.*);\s*$/, `verd.innerHTML = __BR(${lineNo}, $1);`);
}).join('\n');
function boot() {
  const dom = buildDom();
  const ctx = { document: dom.document, window: { addEventListener() {} }, __BR: (l, v) => { BR.push(l); return v; }, console };
  vm.createContext(ctx);
  vm.runInContext(instrumented, ctx);
  return dom;
}
const snap = (dom, b) => ({
  saidas: Object.fromEntries(b.readouts.map((r) => [r.id, dom.byId[r.id].textContent])),
  veredito_html: dom.byId[b.veredito_id]?.innerHTML ?? null,
  veredito_texto: stripTags(dom.byId[b.veredito_id]?.innerHTML ?? ''),
  veredito_classe: dom.byId[b.veredito_id]?.className ?? null,
  ramo_linha: [...BR].reverse().find((l) => !b.iife || (l >= b.iife.inicio && l <= b.iife.fim)) ?? null,
});

// domínio de entrada por instrumento
const rangeOf = (f) => { const v = []; for (let x = f.min; x <= f.max + 1e-9; x = Math.round((x + f.passo) * 1e6) / 1e6) v.push(x); return v; };
function cartesian(arrs) { return arrs.reduce((acc, a) => acc.flatMap((p) => a.map((x) => [...p, x])), [[]]); }
function domain(b) {
  const axes = [];
  for (const f of b.campos) {
    if (f.tipo === 'numero') axes.push({ f, vals: rangeOf(f) });
    else if (f.tipo === 'selecao') axes.push({ f, vals: f.opcoes.map((o) => o.valor) });
    else if (f.tipo === 'pilulas') axes.push({ f, vals: f.opcoes.map((o) => o.valor) });
    else if (f.tipo === 'chaves_booleanas') for (const c of f.chaves) axes.push({ f, chave: c.id, vals: [true, false] });
  }
  return axes;
}
// aplica uma combinação ao DOM na ordem do usuário (pílula primeiro: ela reescreve o FC no INST 08)
function apply(dom, b, axes, combo) {
  let last = null;
  axes.forEach((ax, k) => {
    const v = combo[k];
    if (ax.f.tipo === 'pilulas') {
      const pills = dom.groups[`#${ax.f.id} .pill`];
      const attr = ax.f.opcoes[0].atributo.replace('data-', '');
      pills.find((p) => p.dataset[attr] === v).fire('click');
    }
  });
  axes.forEach((ax, k) => {
    const v = combo[k];
    if (ax.f.tipo === 'numero') { dom.byId[ax.f.id].value = String(v); if (ax.f.deslizador_gemeo) dom.byId[ax.f.deslizador_gemeo.id].value = String(v); last = dom.byId[ax.f.id]; }
    else if (ax.f.tipo === 'selecao') { dom.byId[ax.f.id].value = v; last = dom.byId[ax.f.id]; }
    else if (ax.f.tipo === 'chaves_booleanas') {
      const c = dom.byId[ax.f.id].children.find((x) => x.dataset.src === ax.chave);
      if (c.classList.contains('on') !== v) c.fire('click');
    }
  });
  if (last) last.fire('input');
}
const inputsFor = (b, axes, combo) => {
  const o = {};
  axes.forEach((ax, k) => {
    if (ax.f.tipo === 'chaves_booleanas') o[`${ax.f.id}-${ax.chave}`] = combo[k] ? 'on' : 'off';
    else o[ax.f.id] = ax.f.tipo === 'numero' ? combo[k] : String(combo[k]);
  });
  return o;
};

// ── 4. código portado ───────────────────────────────────────
const calcTs = readCode('calculators');
const contentTs = readCode('content');
const grab = (re) => (calcTs.match(re) || fail(`não achei ${re}`))[0];
const blockIni = calcTs.indexOf("  'm03-inst-01':");
const blockFim = calcTs.indexOf('  // ══', blockIni);
const tsSrc = [
  'type ResultadoInstrumento = { valores: Record<string, number>; veredito?: string };',
  'type EntradaInstrumento = number | string;',
  grab(/const n = \(v: EntradaInstrumento \| undefined\): number => \{[\s\S]*?\n\};/),
  grab(/const nOu = \(v: EntradaInstrumento \| undefined, fallback: number\): number => \{[\s\S]*?\n\};/),
  grab(/const SHAPE_AFLUENCIA = \[.*?\];/),
  'const CALC: Record<string, (i: Record<string, EntradaInstrumento>) => ResultadoInstrumento> = {',
  calcTs.slice(blockIni, blockFim),
  '};',
].join('\n');
const CALC = new Function(stripTypeScriptTypes(tsSrc) + '\nreturn CALC;')();
const codeInst = (() => {
  const ini = contentTs.indexOf('export const INSTRUMENTOS_MODULO_03');
  const fim = contentTs.indexOf('\n];', ini);
  const body = contentTs.slice(contentTs.indexOf('[', ini), fim + 2);
  return vm.runInNewContext('(' + body + ')');
})();
// `instruments: [INSTRUMENTOS_MODULO_03[0], …]` — a lista contém colchetes internos; captura balanceada.
const aulaInstRefs = [...contentTs.matchAll(/id: 'aula-03-(\d\d)'[\s\S]*?instruments: \[((?:[^\[\]]|\[\d+\])*)\]/g)].map((m) => ({ aula: m[1], idx: [...m[2].matchAll(/\[(\d+)\]/g)].map((x) => Number(x[1])) }));
if (aulaInstRefs.length !== 10 || aulaInstRefs.reduce((n, a) => n + a.idx.length, 0) !== 9) fail(`vínculo aula→instrumento no código não reconhecido: ${JSON.stringify(aulaInstRefs)}`);

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const nums = (s) => (s.match(/-?\d[\d.]*(?:,\d+)?/g) || []).map((x) => ({ v: Number(x.replace(/\./g, '').replace(',', '.')), dec: (x.split(',')[1] || '').length }));
// como cada saída textual do original se compara ao valor numérico do código
function compareOut(id, txtOrig, valores, veredito) {
  if (txtOrig === '—') return { ok: valores[id] === undefined || !Number.isFinite(valores[id]) || Object.keys(valores).length === 0, modo: 'vazio' };
  if (/-mes$|-vale$/.test(id)) return { ok: MESES[valores[id]] === txtOrig, modo: 'mes' };
  if (id === 'i06-marg') return { ok: veredito === txtOrig, modo: 'texto_no_veredito' };
  if (id === 'i07-voc') return { ok: typeof veredito === 'string' && veredito.startsWith(txtOrig), modo: 'texto_no_veredito' };
  if (id === 'i08-pre') return { ok: null, modo: 'nao_portado' };
  const ns = nums(txtOrig);
  if (id === 'i08-cap') {
    const a = ns[0], b = ns[1];
    return { ok: round(valores['i08-cap'], a.dec) === a.v && round(valores['i08-cappct'], b.dec) === b.v, modo: 'dois_numeros' };
  }
  if (!(id in valores)) return { ok: null, modo: 'ausente_no_codigo' };
  const a = ns[0];
  return { ok: round(valores[id], a.dec) === a.v, modo: 'numero' };
}
const round = (x, d) => { const s = Number(x).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: false }); return Number(s.replace(',', '.')); };

// ── laço principal ──────────────────────────────────────────
const invocacoesGlobais = findAll(/INST·\d\d|INST·0\d, \d\d e \d\d/).map((k) => ({ linha: k, secao: k >= find(/^<script>/) ? 'script (texto de veredito)' : (SECOES.filter((s) => s.start <= k && k <= s.end).pop() || { num: 'fora de seção' }).num, trecho: stripTags(ln(k)).slice(0, 160) }));
const mapQ = Object.fromEntries(findAll(/<tr><td><b>\d\d<\/b>/).map((k) => { const m = ln(k).match(/<td><b>(\d\d)<\/b><\/td><td>.*?<\/td><td>(.*)<\/td>/); return [m[1], { texto: stripTags(m[2]), linha_aprox: k }]; }));

const instrumentos = [];
for (const b of instBlocks) {
  const iife = iifeOf(b.nn);
  b.iife = iife;
  const rs = ramos(iife);
  BR.length = 0;
  const dom0 = boot();
  const padrao = snap(dom0, b);
  // desenho no cenário padrão (só medida; desenho não porta)
  const desenho = b.desenho ? { ...b.desenho, html_gerado_caracteres: dom0.byId[b.desenho.id].innerHTML.length } : null;
  let linhasPilha = null;
  if (b.desenho?.tipo === 'pilha_html') {
    linhasPilha = dom0.byId[b.desenho.id].innerHTML.split("<div class='d-row").slice(1).map((row) => ({
      classes: (row.match(/^([^']*)'/) || [])[1].trim() || null,
      nome: stripTags((row.match(/<div class='d-name'>(.*?)<\/div>/) || [])[1] ?? ''),
      largura_css: (row.match(/width:([\d.]+%)/) || [])[1] ?? null,
      valor: stripTags((row.match(/<div class='d-val'>(.*?)<\/div>/) || [])[1] ?? ''),
    }));
  }

  // varredura exaustiva
  const axes = domain(b);
  const combos = cartesian(axes.map((a) => a.vals));
  const dom = boot();
  const cobertura = new Map(rs.map((r) => [r.linha, { vezes: 0, exemplo: null }]));
  const cf = CALC[`m03-inst-${b.nn}`];
  let nNum = 0, okNum = 0; const falhasNum = [];
  const pares = new Map(); // veredito do código -> Set(ramo original)
  let nanCode = 0;
  for (const combo of combos) {
    BR.length = 0;
    apply(dom, b, axes, combo);
    const s = snap(dom, b);
    const c = cobertura.get(s.ramo_linha);
    if (c) { c.vezes++; if (!c.exemplo) c.exemplo = { entradas: inputsFor(b, axes, combo), saidas: s.saidas, veredito_classe: s.veredito_classe, veredito_html: s.veredito_html, veredito_texto: s.veredito_texto }; }
    if (cf) {
      const r = cf(inputsFor(b, axes, combo));
      for (const v of Object.values(r.valores)) if (!Number.isFinite(v)) nanCode++;
      for (const [id, t] of Object.entries(s.saidas)) {
        const cmp = compareOut(id, t, r.valores, r.veredito);
        if (cmp.ok === null) continue;
        nNum++; if (cmp.ok) okNum++; else if (falhasNum.length < 5) falhasNum.push({ entradas: inputsFor(b, axes, combo), saida: id, original: t, codigo: r.valores[id] ?? r.veredito });
      }
      const key = String(r.veredito);
      if (!pares.has(key)) pares.set(key, new Set());
      pares.get(key).add(s.ramo_linha);
    }
  }
  const bijecao = b.nn === '01' ? null : cf ? [...pares.values()].every((set) => set.size === 1) && new Set([...pares.values()].map((s) => [...s][0])).size === pares.size : null;
  const vereditoCodigoIgual = cf ? [...cobertura.values()].filter((c) => c.exemplo).every((c) => {
    const r = cf(c.exemplo.entradas); return stripTags(r.veredito ?? '') === c.exemplo.veredito_texto;
  }) : null;

  // código: definição
  const ci = codeInst.find((x) => x.id === `m03-inst-${b.nn}`);
  const aulaCod = aulaInstRefs.find((a) => a.idx.includes(codeInst.indexOf(ci)));
  const fieldCmp = b.campos.flatMap((f) => {
    if (f.tipo === 'chaves_booleanas') return f.chaves.map((ch) => { const cf2 = ci.fields.find((x) => x.id === `${f.id}-${ch.id}`); return { id: `${f.id}-${ch.id}`, presente: !!cf2, rotulo_igual: cf2?.label === ch.rotulo, padrao_igual: cf2 ? cf2.defaultValue === (ch.ligada_por_padrao ? 'on' : 'off') : false, nota: 'chave booleana mapeada para select Ligada/Desligada (rótulos "Ligada"/"Desligada" não existem na fonte)' }; });
    const cf2 = ci.fields.find((x) => x.id === f.id);
    if (!cf2) return [{ id: f.id, presente: false }];
    const o = { id: f.id, presente: true, kind_codigo: cf2.kind, rotulo_fonte: f.rotulo, rotulo_codigo: cf2.label, rotulo_igual: cf2.label === f.rotulo, unidade_igual: (cf2.unit ?? null) === (f.unidade ?? null) };
    if (f.tipo === 'numero') Object.assign(o, { padrao_igual: cf2.defaultValue === f.padrao, faixa_igual: cf2.min === f.min && cf2.max === f.max && cf2.step === f.passo });
    else { o.padrao_igual = String(cf2.defaultValue) === String(f.padrao); o.opcoes_iguais = JSON.stringify((cf2.options || []).map((x) => [String(x.value), x.label])) === JSON.stringify(f.opcoes.map((x) => [x.valor, x.rotulo])); }
    return [o];
  });
  const outCmp = b.readouts.map((r) => { const co = ci.outputs.find((x) => x.id === r.id); return { id: r.id, presente: !!co, rotulo_igual: co?.label === r.rotulo }; });
  const extrasCodigo = cf ? Object.keys(cf(inputsFor(b, axes, combos[0])).valores).filter((k) => !b.readouts.some((r) => r.id === k)) : [];
  const defDivs = [];
  if (ci.title !== b.titulo) defDivs.push('título diferente');
  if (ci.kind !== KIND_TAXONOMIA[b.nn]) defDivs.push(`kind ${ci.kind} ≠ taxonomia ${KIND_TAXONOMIA[b.nn]}`);
  if (collapse(ci.note) !== b.nota.html) defDivs.push('nota do instrumento não é verbatim');
  if (fieldCmp.some((f) => !f.presente || f.rotulo_igual === false || f.unidade_igual === false || f.padrao_igual === false || f.faixa_igual === false || f.opcoes_iguais === false)) defDivs.push('campo divergente (ver campos_codigo)');
  if (outCmp.some((o) => !o.presente || !o.rotulo_igual)) defDivs.push('saída divergente (ver saidas_codigo)');
  if (b.campos.some((f) => f.tipo === 'pilulas' && f.rotulo === null)) defDivs.push('pílulas viraram select com rótulo "Seleção" (rótulo não existe na fonte)');
  const calcDivs = [];
  if (cf && okNum !== nNum) calcDivs.push(`${nNum - okNum} de ${nNum} comparações numéricas divergem`);
  if (cf && !vereditoCodigoIgual) calcDivs.push('texto do veredito não é o da fonte (paráfrase/resumo; interpolações numéricas perdidas)');
  if (cf && bijecao === false) calcDivs.push('seleção de ramo do veredito não corresponde 1:1 ao original');
  if (b.nn === '01') calcDivs.push('veredito do código devolve a chave da lente ("cap"/"ene"), não o texto; as participações (DATA do script) não estão no código');
  if (b.nn === '08') calcDivs.push('clique na pílula não reescreve o FC com o fc do preset (o original faz fcEl.value = pr.fc) — sinalizado no próprio código');
  if (b.readouts.some((r) => r.id === 'i08-pre')) calcDivs.push('saída "Premissas do preset" (label do preset) não é devolvida pela calculadora');
  if (b.desenho) calcDivs.push(`desenho (${b.desenho.tipo} #${b.desenho.id}) não portado (§12)`);
  if (nanCode) calcDivs.push(`${nanCode} valores não finitos no código`);
  const status = !ci ? 'não portado' : (defDivs.length || calcDivs.length) ? 'divergente' : 'portado';

  instrumentos.push({
    id: `m03-inst-${b.nn}`,
    id_fonte: b.idFonte,
    comentario_script: iife.comentario,
    camada: 'fonte',
    titulo: b.titulo,
    kind_taxonomia: KIND_TAXONOMIA[b.nn],
    kind_nota: 'Da instrument-taxonomy.md (catálogo por kind, Módulo 03). Confirmado pela mecânica do markup/script nesta extração.',
    aula: { marcador: b.sec.num, aula_id_codigo: `aula-03-${b.sec.num.slice(5)}`, pergunta_do_map: mapQ[b.sec.num.slice(5)] },
    pergunta: null,
    pergunta_nota: 'O instrumento não tem pergunta própria na fonte. A pergunta do § MAP da aula é contexto, não pergunta do instrumento; uma pergunta de previsão seria camada Alexandria (P3/P11/P19).',
    invocacao: {
      frase_anterior: b.antes,
      bloco_seguinte: b.depois,
      mencoes_por_id_no_modulo: invocacoesGlobais.filter((x) => new RegExp(`INST·${b.nn}\\b|INST·0\\d, ${b.nn}|INST·${b.nn}, `).test(ln(x.linha)) || (x.trecho.includes('INST·03, 05 e 09') && ['03', '05', '09'].includes(b.nn))),
      nota: 'frase_anterior é o bloco imediatamente antes do div.instrument (a chamada "use o instrumento…" quando existe). A posição exata é entre as duas linhas.',
    },
    entradas: b.campos,
    saidas: b.readouts.map((r) => {
      const varName = (ln(find(new RegExp(`\\$id\\("${r.id}"\\)`), iife.inicio, iife.fim)).match(new RegExp(`(\\w+) = \\$id\\("${r.id}"\\)`)) || [])[1];
      const assign = varName ? findAll(new RegExp(`\\b${varName}\\.textContent = `), iife.inicio, iife.fim).map((k) => ({ linha: k, codigo: ln(k).trim() })) : [];
      return { ...r, variavel_script: varName ?? null, atribuicao_script: assign };
    }),
    veredito: { id: b.veredito_id, classe_inicial: 'verdict', valor_estatico_no_markup: '—' },
    desenho,
    pilha_no_cenario_padrao: linhasPilha,
    script: {
      linhas: { inicio: iife.inicio, fim: iife.fim },
      helpers_usados: ['$id', 'fb', ...(/bindIR/.test(L.slice(iife.inicio - 1, iife.fim).join('\n')) ? ['bindIR'] : []), ...(/SHAPE/.test(L.slice(iife.inicio - 1, iife.fim).join('\n')) ? ['SHAPE'] : []), ...(/MESES/.test(L.slice(iife.inicio - 1, iife.fim).join('\n')) ? ['MESES'] : [])],
      codigo_verbatim: L.slice(iife.inicio - 1, iife.fim),
      nota: 'Fórmulas exatas = este código. Helpers globais: fb(v,d) = Number(v).toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d}); bindIR sincroniza number↔range e chama calc; SHAPE e MESES são globais do script (ver helpers_globais no topo do arquivo).',
    },
    ramos_de_leitura: rs.map((r) => ({ ...r, cobertura: cobertura.get(r.linha) })),
    textos_por_chave: b.nn === '01' ? (() => {
      const ini = find(/var V = \{/, iife.inicio, iife.fim); const fim = find(/^\s*\};/, ini);
      const V = vm.runInNewContext('(' + L.slice(ini - 1, fim).join('\n').replace(/^\s*var V = /, '').replace(/;\s*$/, '') + ')');
      const di = find(/var DATA = \{/, iife.inicio, iife.fim); const df = find(/^\s*\};/, di);
      const DATA = vm.runInNewContext('(' + L.slice(di - 1, df).join('\n').replace(/^\s*var DATA = /, '').replace(/;\s*$/, '') + ')');
      return Object.keys(V).map((k) => ({ chave: k, pilula: b.campos[0].opcoes.find((o) => o.valor === k).rotulo, veredito_html: V[k], veredito_texto: stripTags(V[k]), participacoes: DATA[k].map((d) => ({ fonte: d.n, pct: d.v })), origem: { seletor: '<script> INSTRUMENT 01 var V / var DATA', trecho_inicial: k, linha_aprox: ini } }));
    })() : null,
    cenario_padrao: {
      entradas: Object.fromEntries(b.campos.flatMap((f) => f.tipo === 'chaves_booleanas' ? f.chaves.map((c) => [`${f.id}-${c.id}`, c.ligada_por_padrao ? 'on' : 'off']) : [[f.id, f.padrao]])),
      ...padrao,
      metodo: 'script original executado em vm com DOM simulado (valores iniciais do markup; o script chama calc()/render() no carregamento e sobrescreve o "—" do markup).',
    },
    varredura: {
      combinacoes: combos.length,
      eixos: axes.map((a) => ({ campo: a.chave ? `${a.f.id}-${a.chave}` : a.f.id, valores: a.vals.length })),
      ramos_atingidos: [...cobertura.values()].filter((c) => c.vezes > 0).length,
      ramos_total: rs.length,
      ramos_inalcancaveis_no_espaco: rs.filter((r) => cobertura.get(r.linha).vezes === 0).map((r) => r.linha),
      nota: 'Espaço finito = min/max/step do input number (igual ao range gêmeo em todos os campos do M03). A pílula é aplicada antes dos campos (no INST 08 ela reescreve o FC).',
    },
    nota_instrumento: b.nota,
    fonte_dos_numeros: null,
    fonte_dos_numeros_nota: 'Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: ' + (b.nota.texto.match(/[^.]*\b(ANEEL|ONS|EPE|CCEE|SIGA|Lazard|UNICA|ABEEólica|NEWAVE|PLD)\b[^.]*\./g) || ['nenhuma']).map((s) => `"${s.trim()}"`).join(' ') + ' P19/P20: tratar como cenário didático; não apresentar como dado oficial.',
    tolerancias: null,
    tolerancias_nota: 'A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.',
    comparacao_codigo: {
      status,
      instrument_def: ci ? { id: ci.id, kind: ci.kind, title_igual: ci.title === b.titulo, formula: ci.formula, nota_igual: collapse(ci.note) === b.nota.html, aula_codigo: aulaCod ? `aula-03-${aulaCod.aula}` : null, aula_confere: aulaCod ? `aula-03-${aulaCod.aula}` === `aula-03-${b.sec.num.slice(5)}` : false } : null,
      campos_codigo: fieldCmp,
      saidas_codigo: outCmp,
      saidas_extras_no_codigo: extrasCodigo,
      calculadora: cf ? {
        chave: `m03-inst-${b.nn}`,
        comparacoes_numericas: nNum, iguais: okNum, primeiras_falhas: falhasNum,
        ramo_do_veredito_bijetor: bijecao,
        ramo_nota: b.nn === '01' ? 'n/a: a fonte tem uma só linha de veredito (V[lens]); o código devolve a chave.' : b.nn === '06' ? 'O código devolve em veredito o NOME da fonte marginal (readout i06-marg), não o texto de leitura; por isso não há correspondência com os 5 ramos.' : null,
        vereditos_distintos_no_codigo: pares.size,
        texto_do_veredito_igual_a_fonte: vereditoCodigoIgual,
      } : null,
      divergencias_definicao: defDivs,
      divergencias_calculo: calcDivs,
      posicao_na_aula: 'O código guarda o instrumento em aula.instruments (fora de MODULO_03_CORPO); a posição dentro do texto (frase_anterior/bloco_seguinte) não é representada no dado.',
    },
    origem: origem(b.n, `section.aula(${b.sec.num}) div.instrument`),
    linha_fim_aprox: b.end,
  });
}

// ── testes que a própria nota/aula manda fazer (entradas escolhidas por esta extração a partir do texto literal) ──
const TESTES = {
  '02': [{ instrucao: 'compare 100 MW solares (FC 27) com 100 MW nucleares (FC 88)', passos: [{ 'i02-mw': 100, 'i02-fc': 27 }, { 'i02-mw': 100, 'i02-fc': 88 }] }],
  '03': [{ instrucao: 'Ajuste a ENA para ~75% e veja o desenho de 2021; para ~60%, o fantasma de 2001.', passos: [{ 'i03-ena': 75, 'i03-ear': 60 }, { 'i03-ena': 60, 'i03-ear': 60 }] }],
  '04': [{ instrucao: 'arraste a ENA para baixo e veja os produtos se separarem', onde: 'texto do ramo "Ano bom" do veredito (script)', passos: [{ 'i04-ena': 100 }, { 'i04-ena': 75 }, { 'i04-ena': 55 }] }],
  '05': [{ instrucao: 'Suba a solar e veja a barriga afundar e a rampa empinar', onde: 'texto do ramo "Dia administrável" do veredito (script)', passos: [{ 'i05-sol': 35, 'i05-eol': 12 }, { 'i05-sol': 80, 'i05-eol': 12 }, { 'i05-sol': 80, 'i05-eol': 28 }] }],
  '06': [{ instrucao: 'Suba o preço do gás e veja o "conversor de preço" em ação: o mesmo sistema, a mesma demanda — e o custo marginal multiplicado.', passos: [{ 'i06-dem': 75, 'i06-agua': 150, 'i06-gas': '1' }, { 'i06-dem': 75, 'i06-agua': 150, 'i06-gas': '1.8' }, { 'i06-dem': 100, 'i06-agua': 150, 'i06-gas': '1' }, { 'i06-dem': 100, 'i06-agua': 150, 'i06-gas': '1.8' }] }],
  '08': [{ instrucao: 'selecione Gás CC e arraste o FC de 45% para 15% — o LCOE quase dobra sem mudar nada na usina.', passos: [{ 'i08-pills': 'gas', 'i08-fc': 45, 'i08-wacc': 10 }, { 'i08-pills': 'gas', 'i08-fc': 15, 'i08-wacc': 10 }] }],
  '09': [{ instrucao: 'Ligue as fontes uma a uma, na ordem, e observe o índice mês-fraco/mês-forte subir', passos: [
    { 'i09-checks-hidro': 'on', 'i09-checks-eolica': 'off', 'i09-checks-solar': 'off', 'i09-checks-bio': 'off' },
    { 'i09-checks-hidro': 'on', 'i09-checks-eolica': 'on', 'i09-checks-solar': 'off', 'i09-checks-bio': 'off' },
    { 'i09-checks-hidro': 'on', 'i09-checks-eolica': 'on', 'i09-checks-solar': 'on', 'i09-checks-bio': 'off' },
    { 'i09-checks-hidro': 'on', 'i09-checks-eolica': 'on', 'i09-checks-solar': 'on', 'i09-checks-bio': 'on' },
  ] }],
};
for (const x of instrumentos) {
  const nn = x.id.slice(-2);
  const b = instBlocks.find((y) => y.nn === nn);
  const axes = domain(b);
  x.testes_da_nota = (TESTES[nn] || []).map((t) => ({
    instrucao_literal: t.instrucao,
    instrucao_onde: t.onde ?? 'nota do instrumento (markup)',
    instrucao_presente_na_fonte: (b.nota.texto.includes(t.instrucao) || L.slice(b.n - 1, b.end + 1).join(' ').includes(t.instrucao) || L.slice(b.iife.inicio - 1, b.iife.fim).join(' ').includes(t.instrucao)) || fail(`instrução de teste não literal: ${t.instrucao}`),
    resultados: t.passos.map((p) => {
      BR.length = 0; const dom = boot();
      const combo = axes.map((ax) => ax.f.tipo === 'chaves_booleanas' ? p[`${ax.f.id}-${ax.chave}`] === 'on' : ax.f.tipo === 'numero' ? p[ax.f.id] : p[ax.f.id]);
      apply(dom, b, axes, combo);
      const s = snap(dom, b);
      return { entradas: p, saidas: s.saidas, veredito_classe: s.veredito_classe, ramo_linha: s.ramo_linha, veredito_texto: s.veredito_texto };
    }),
    nota: 'Entradas escolhidas por esta extração para executar a instrução literal; resultados do script original.',
  }));
}

// ── divergências da fonte ligadas a instrumentos (registradas, nunca resolvidas) ──
const linhaDe = (t, from = 1) => { for (let k = from; k <= L.length; k++) if (ln(k).includes(t)) return k; fail(`literal ausente: ${t}`); };
const celulas = (k) => stripTags(ln(k).replace(/<\/td>\s*<td[^>]*>/g, ' | '));
const I = (nn) => instrumentos.find((x) => x.id === `m03-inst-${nn}`);
const nFio = linhaDe('<td><b>Hidro fio d\'água</b></td>');
const nFioCap = linhaDe('var FIO_CAP = 1.6');
const nAnoBom = linhaDe('arraste a ENA para baixo e veja os produtos se separarem');
const divergenciasInst = [
  {
    id: 'div-m03-inst-01-fc-fio-dagua',
    tema: 'FCap do fio d\'água: tabela da Aula 01 × cenário-padrão do INST · 04 (P20 — CONTENT QA)',
    leituras: [
      { onde: `Aula 01, tabela "FC típico no Brasil" (L${nFio})`, literal: celulas(nFio), nota_literal: 'células unidas por " | " (separador desta extração)' },
      { onde: `INST · 04, saída i04-fcfio no cenário-padrão (execução do script; constante L${nFioCap})`, saida_executada: I('04').cenario_padrao.saidas['i04-fcfio'], codigo_fonte: ln(nFioCap).trim() },
    ],
    leitura_de_contexto: 'O modelo do INST · 04 (FIO_CAP = 1.6 sobre a curva SHAPE) produz FC anual de 63% com ENA 100%, acima da faixa "~40–55%" que a própria aula declara. A nota do instrumento o declara modelo didático; nenhuma faixa vira verdade (P20).',
    decisao: 'não escolhida — CONTENT QA, verificação autoritativa pendente (P20)',
  },
  {
    id: 'div-m03-inst-02-ramo-prometido-inalcancavel',
    tema: 'INST · 04: o texto do ramo "Ano bom" manda buscar um estado que a varredura nunca atinge',
    leituras: [
      { onde: `script L${nAnoBom} (ramo else, "Ano bom")`, literal: 'arraste a ENA para baixo e veja os produtos se separarem' },
      { onde: `script L${I('04').varredura.ramos_inalcancaveis_no_espaco[0]} (ramo "Dois produtos, escancarados")`, literal: stripTags(ln(I('04').varredura.ramos_inalcancaveis_no_espaco[0]).match(/"(<b>[^"]*<\/b>)/)[1]) },
    ],
    leitura_de_contexto: `Varredura exaustiva do espaço do markup (ENA ${I('04').entradas[0].min}–${I('04').entradas[0].max}, passo ${I('04').entradas[0].passo}; ${I('04').varredura.combinacoes} valores): o ramo "Dois produtos" é atingido 0 vezes; ao baixar a ENA o script salta de "Ano bom" direto para "A seca venceu as duas" (ENA 75 já cai lá).`,
    decisao: 'registrado; defeito ou intenção da fonte não decidido aqui',
  },
  {
    id: 'div-m03-inst-03-ramos-inalcancaveis',
    tema: 'Ramos de leitura nunca atingidos no espaço de entrada declarado',
    leituras: instrumentos.filter((x) => x.varredura.ramos_inalcancaveis_no_espaco.length).flatMap((x) => x.varredura.ramos_inalcancaveis_no_espaco.map((k) => {
      const r = x.ramos_de_leitura.find((y) => y.linha === k);
      const m = ln(k).match(/"(<b>[^"]*<\/b>)/);
      return { onde: `${x.id_fonte} script L${k} (${r?.condicao_propria?.codigo ?? 'sem condição'})`, literal: m ? stripTags(m[1]) : ln(k).trim().slice(0, 120) };
    })),
    leitura_de_contexto: 'Medido executando o script original sobre todas as combinações min/max/step do markup. Um ramo inalcançável é texto da fonte que o learner nunca vê no instrumento original.',
    decisao: 'registrado',
  },
];

const helpersGlobais = {
  linhas: { inicio: find(/^function \$id/), fim: find(/^var SHAPE/) },
  codigo_verbatim: L.slice(find(/^function \$id/) - 1, find(/^var SHAPE/)),
};
writeJson('instrumentos.json', {
  schema: 'alexandria-v2/extraction/instrumentos@1',
  modulo: 'm03', grupo: 'instrumentos', camada: 'fonte',
  fonte: { arquivo: SRC, linhas_total: TOTAL_LINHAS, script: { inicio: scriptStart, fim: scriptEnd }, somente_leitura: true },
  gerado_em: hoje,
  metodo: 'extratores/m03_instrumentos.mjs — markup por linha; script original executado em node:vm com DOM simulado e varredura exaustiva do espaço de entrada; calculadoras do código avaliadas via module.stripTypeScriptTypes sobre o mesmo espaço.',
  arquivos_codigo: [CODE.content, CODE.calculators],
  helpers_globais: helpersGlobais,
  instrumentos_fora_de_aula: [],
  instrumentos_fora_de_aula_nota: 'Zero: não há § Lab nem LAB · NN no M03; os 9 estão dentro de aulas. Aulas sem instrumento: 04, 07, 08.',
  mencoes_inst_no_modulo: invocacoesGlobais,
  instrumentos,
  divergencias: divergenciasInst,
  resumo: instrumentos.map((x) => ({ id: x.id, aula: x.aula.marcador, kind: x.kind_taxonomia, entradas: x.entradas.length, saidas: x.saidas.length, ramos: x.ramos_de_leitura.length, combinacoes: x.varredura.combinacoes, status: x.comparacao_codigo.status })),
});
for (const x of instrumentos) {
  console.log(x.id, x.aula.marcador, x.comparacao_codigo.status, 'ramos', x.varredura.ramos_atingidos + '/' + x.varredura.ramos_total, 'combos', x.varredura.combinacoes,
    'num', x.comparacao_codigo.calculadora?.iguais + '/' + x.comparacao_codigo.calculadora?.comparacoes_numericas, 'bij', x.comparacao_codigo.calculadora?.ramo_do_veredito_bijetor,
    '|', x.comparacao_codigo.divergencias_definicao.join('; '), '|', x.comparacao_codigo.divergencias_calculo.join('; '));
  console.log('   padrao', JSON.stringify(x.cenario_padrao.saidas), x.cenario_padrao.veredito_classe, x.cenario_padrao.veredito_texto.slice(0, 80));
  if (x.comparacao_codigo.calculadora?.primeiras_falhas.length) console.log('   falhas', JSON.stringify(x.comparacao_codigo.calculadora.primeiras_falhas.slice(0, 2)));
  console.log('   extras', x.comparacao_codigo.saidas_extras_no_codigo, 'inalc', x.varredura.ramos_inalcancaveis_no_espaco, 'conds', x.ramos_de_leitura.map((r) => [...r.condicoes_envolventes.map((c) => c.codigo), r.condicao_propria?.codigo ?? '(sem cond)'].join(' > ') + (r.irmaos_anteriores.length ? ` [irmãos: ${r.irmaos_anteriores.length}]` : '')).join(' || '));
}
console.log(JSON.stringify(instrumentos[5].pilha_no_cenario_padrao?.slice(0, 3)));
