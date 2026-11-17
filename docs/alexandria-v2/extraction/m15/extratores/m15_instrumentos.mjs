// Extração programática dos 10 instrumentos do M15 → instrumentos.json
// + prova de fidelidade: executa o <script> ORIGINAL de cada instrumento num
// DOM simulado e compara, entrada a entrada, com a porta em
// alexandria-instrument-calculators.ts (carregada de uma cópia em tmp, com
// `void OUT;` trocado por uma captura — só no harness, o código não é tocado).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  html, SRC, CODE, read, lineOf, inl, txt, both, origem, balancedEnd, innerOf,
  allMatches, must, SECTIONS, classOf, attrs, writeJSON, pad, scriptLiteral, evalLiteral,
} from './lib.mjs';

const scriptStart = html.indexOf('<script>') + 8;
const scriptEnd = html.indexOf('</script>');
const SCRIPT = html.slice(scriptStart, scriptEnd);
const helpersCode = SCRIPT.slice(SCRIPT.indexOf('/* ===================== HELPERS'), SCRIPT.indexOf('/* ===================== BARRA DE PROGRESSO'));
const iifeRange = (nn) => {
  const s = html.indexOf(`/* ===================== INST·${nn} `);
  const e = html.indexOf('/* =====================', s + 10);
  return { s, e, code: html.slice(s, e) };
};

// ── marcação ─────────────────────────────────────────────────
const instDivs = allMatches(/<div class="inst">/).map((m) => {
  const end = balancedEnd(m.index);
  const body = html.slice(m.index, end);
  const hd = body.match(/<span class="id">(INST·(\d\d))<\/span> <span class="nm">(.*?)<\/span>/);
  return { start: m.index, end, body, idFonte: hd[1], nn: hd[2], nome: hd[3] };
});
must(instDivs.length === 10, 'inst');

function parseControls(d) {
  const numeric = allMatches(/<div class="field"><div class="field-label"><span>(.*?)<\/span><span class="unit">(.*?)<\/span><\/div>\s*<input ([^>]*)>\s*<input ([^>]*)><\/div>/, html, d.start, d.end).map((m) => {
    const n = attrs(m[3]), r = attrs(m[4]);
    return {
      id: n.id, id_range: r.id, tipo: `${n.type}+${r.type}`,
      rotulo: m[1], rotulo_texto: txt(m[1]), unidade: m[2],
      padrao: +n.value, padrao_literal: n.value,
      min: +n.min, max: +n.max, step: +n.step,
      faixa_range_igual: n.min === r.min && n.max === r.max && n.step === r.step && n.value === r.value,
      origem: origem(`div.inst(${d.idFonte}) .field input#${n.id}`, m[1], m.index),
    };
  });
  const segs = allMatches(/<div class="seg" id="([^"]+)"(?: style="[^"]*")?>([\s\S]*?)<\/div>/, html, d.start, d.end).map((m) => {
    const before = html.slice(d.start, m.index);
    const lbs = [...before.matchAll(/<div class="seg-lb"[^>]*>(.*?)<\/div>/g)];
    const lb = lbs.pop();
    const btns = [...m[2].matchAll(/<button( class="on")? (data-[\w]+)="([^"]+)">(.*?)<\/button>/g)].map((b) => ({ valor: b[3], ...both(b[4]), padrao: !!b[1], atributo: b[2] }));
    return {
      id: m[1], tipo: 'seg (botões exclusivos)', atributo: btns[0].atributo,
      rotulo: lb ? lb[1] : null,
      rotulo_nota: lb && before.lastIndexOf('seg-lb') < before.lastIndexOf('<div class="seg"') ? 'Sem seg-lb próprio: herda o rótulo do grupo anterior (segundo seletor do mesmo grupo).' : undefined,
      opcoes: btns.map(({ atributo, ...o }) => o),
      padrao: (btns.find((b) => b.padrao) || {}).valor ?? null,
      // [verificação] seletor sem seg-lb próprio: o trecho de origem é o do próprio grupo (1º botão), não o rótulo herdado (6 linhas acima)
      origem: origem(`div.inst(${d.idFonte}) div.seg#${m[1]}`, lb && !(before.lastIndexOf('seg-lb') < before.lastIndexOf('<div class="seg"')) ? lb[1] : (btns[0] ? btns[0].texto : m[1]), m.index),
    };
  });
  const readouts = allMatches(/<div class="ro"><div class="k">(.*?)<\/div><div class="(n[^"]*)" id="([^"]+)">(.*?)<\/div><\/div>/, html, d.start, d.end).map((m) => ({ id: m[3], rotulo: m[1], classe: m[2], valor_inicial_marcacao: m[4], origem: origem(`div.inst(${d.idFonte}) .readout .ro #${m[3]}`, m[1], m.index) }));
  const conteineres = allMatches(/<div (?:class="([^"]+)" )?id="([^"]+)"(?: class="([^"]+)")?[^>]*><\/div>/, html, d.start, d.end)
    .map((m) => ({ id: m[2], classe: m[1] || m[3] || null }))
    .filter((c) => !readouts.find((r) => r.id === c.id));
  const intro = d.body.match(/<p class="inst-intro">([\s\S]*?)<\/p>/);
  const disc = d.body.match(/<p class="disc">([\s\S]*?)<\/p>/);
  return { numeric, segs, readouts, conteineres, intro: intro[1], introIdx: d.start + intro.index, disc: disc[1], discIdx: d.start + disc.index };
}

// ── script: cálculo, formatação, ramos ───────────────────────
function scriptParts(nn) {
  const { s, code } = iifeRange(nn);
  const base = lineOf(s);
  const lines = code.split('\n');
  const calc = lines.map((l, i) => ({ codigo: l.trim(), linha_aprox: base + i }))
    .filter((x) => /^var \w+\s*=\s*(?!\{|\[|\$id|null|'|function)/.test(x.codigo) || /^if\((k3|base|tot)</.test(x.codigo) || /^var (sub|tot|ct|cvu|ef|gb|fat|sc|dt|nom|cc|es|v1)\b/.test(x.codigo));
  const fmtLines = lines.map((l, i) => ({ l, n: base + i })).filter((x) => /\$id\('([\w-]+)'\)\.innerHTML=/.test(x.l) && !/-vd'|mp-flux|mp-panel|rg-out|cl-out|vf-panel|-bars'|cb-bar|cb-lg|ac-track/.test(x.l));
  const formatacao = {};
  for (const f of fmtLines) {
    const id = f.l.match(/\$id\('([\w-]+)'\)/)[1];
    let codeTxt = f.l.trim(); let k = lines.indexOf(f.l);
    while (!codeTxt.endsWith(';')) { k++; codeTxt += ' ' + lines[k].trim(); }
    formatacao[id] = { codigo: codeTxt, linha_aprox: f.n };
  }
  // ramos do veredito: para cada `.className='verdict X'`, sobe até a chave
  // que abre o bloco e lê o if/else if/else que a precede.
  const ramos = [];
  for (const m of code.matchAll(/(v2?)\.className='verdict (\w+)';/g)) {
    let depth = 0, k = m.index;
    for (; k >= 0; k--) { const ch = code[k]; if (ch === '}') depth++; else if (ch === '{') { if (depth === 0) break; depth--; } }
    const head = code.slice(0, k).replace(/\s+$/, '');
    let cond;
    if (head.endsWith(')')) {
      let d2 = 0, j = head.length - 1;
      for (; j >= 0; j--) { if (head[j] === ')') d2++; else if (head[j] === '(') { d2--; if (d2 === 0) break; } }
      const kw = head.slice(0, j).match(/(else if|if|function \w+)\s*$/)[1];
      cond = kw.startsWith('function') ? 'sem condição (sempre)' : `${kw}${head.slice(j, head.length)}`;
    } else if (/else$/.test(head)) cond = 'else';
    else cond = '?';
    const vi = code.indexOf(`${m[1]}.innerHTML=`, m.index);
    const endT = code.indexOf(';\n', vi);
    ramos.push({ condicao_literal: cond, classe_veredito: m[2], template_script: code.slice(vi + m[1].length + 11, endT).trim(), linha_aprox: lineOf(s + m.index) });
  }
  // [verificação] templates literais dos contêineres dinâmicos (painéis, barras, legendas) e da lista segs:
  // antes ficavam fora da extração, e o texto que exibem (rótulos de barra, ramo "Não se aplica." do INST·08…) só
  // aparecia no cenário-padrão renderizado.
  const stmtEnd = (from) => { let q = null, dp = 0; for (let i = from; i < code.length; i++) { const ch = code[i];
    if (q) { if (ch === '\\') i++; else if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"') q = ch; else if ('([{'.includes(ch)) dp++; else if (')]}'.includes(ch)) dp--; else if (ch === ';' && dp === 0) return i; }
    return code.length; };
  const paineis = [];
  for (const m of code.matchAll(/\$id\('([\w-]+)'\)\.innerHTML=|var segs=\[/g)) {
    const id = m[1] ?? 'segs';
    if (m[1] && !/mp-flux|mp-panel|rg-out|cl-out|vf-panel|-bars|cb-bar|cb-lg|ac-track/.test(id)) continue;
    const e = stmtEnd(m.index + m[0].length);
    paineis.push({ id, template_script: code.slice(m.index, e + 1).split('\n').map((l) => l.trim()).join(' '), linha_aprox: lineOf(s + m.index) });
  }
  return { calc, formatacao, ramos, paineis, linha_ini: base, linha_fim: base + lines.length - 1 };
}

// ── DOM simulado para o original ─────────────────────────────
class El {
  constructor(id, tag = 'div', cls = '') { this.id = id; this.tag = tag; this.value = ''; this._html = ''; this.attrs = {}; this._cls = new Set(cls.split(' ').filter(Boolean)); this.listeners = {}; this.kids = null; this.style = {}; }
  get className() { return [...this._cls].join(' '); }
  set className(v) { this._cls = new Set(String(v).split(' ').filter(Boolean)); }
  get classList() { const c = this._cls; return { add: (...x) => x.forEach((y) => c.add(y)), remove: (...x) => x.forEach((y) => c.delete(y)), contains: (y) => c.has(y) }; }
  get innerHTML() { return this._html; }
  set innerHTML(v) { this._html = v; this.kids = [...String(v).matchAll(/<button class="([^"]*)"((?: data-[\w-]+="[^"]*")*)>/g)].map((b) => { const e = new El(null, 'button', b[1]); e.attrs = attrs(b[2]); return e; }); }
  getAttribute(a) { return a in this.attrs ? this.attrs[a] : null; }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
  click() { (this.listeners.click || []).forEach((f) => f({})); }
  querySelectorAll(sel) {
    const kids = this.kids || [];
    if (sel === 'button') return kids;
    if (sel === 'button.on') return kids.filter((k) => k._cls.has('on'));
    return [];
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
}
function sandbox(d) {
  const els = new Map();
  for (const m of allMatches(/<(input|div|button)\b([^>]*\bid="[^"]+"[^>]*)>/, html, d.start, d.end)) {
    const a = attrs(m[2]); const e = new El(a.id, m[1], a.class || '');
    e.attrs = a; if (a.value !== undefined) e.value = a.value;
    els.set(a.id, e);
  }
  for (const m of allMatches(/<div class="seg" id="([^"]+)"[^>]*>([\s\S]*?)<\/div>/, html, d.start, d.end)) {
    const e = els.get(m[1]);
    e.kids = [...m[2].matchAll(/<button( class="on")? ((?:data-[\w-]+="[^"]*"))>/g)].map((b) => { const k = new El(null, 'button', b[1] ? 'on' : ''); k.attrs = attrs(b[2]); return k; });
  }
  const document = { getElementById: (id) => els.get(id) || null, querySelectorAll: () => [], documentElement: {}, body: {} };
  return { els, document };
}
const setSeg = (sb, id, val) => { const w = sb.els.get(id); w.kids.forEach((k) => { const on = Object.values(k.attrs)[0] === val; if (on) k._cls.add('on'); else k._cls.delete('on'); }); };
function runOriginal(nn, d, inputs, clicks = []) {
  const sb = sandbox(d);
  for (const [id, v] of Object.entries(inputs)) {
    const e = sb.els.get(id);
    if (e && e.kids && e.tag === 'div') setSeg(sb, id, v);
    else if (e) { e.value = String(v); const r = sb.els.get(id.replace(/-n$/, '-r')); if (r) r.value = String(v); }
  }
  const fn = new Function('document', 'window', helpersCode + '\n' + iifeRange(nn).code);
  fn(sb.document, { addEventListener() {} });
  for (const c of clicks) {
    const w = sb.els.get(c.wrap); const b = (w.kids || []).find((k) => k.getAttribute(c.attr) === c.val);
    if (b) b.click();
  }
  return sb;
}

// ── porta do código (harness) ────────────────────────────────
const calcTs = read(CODE.calculators);
const hIni = calcTs.indexOf('const nm = (v: EntradaInstrumento');
const hEnd = calcTs.indexOf('.trim();', calcTs.indexOf('const alx15 =')) + 8;
const eIni = calcTs.indexOf('  // ── m15 INST 10');
const eEnd = calcTs.lastIndexOf('\n};', calcTs.indexOf('export const temCalculadora'));
must(hIni > 0 && eIni > 0 && eEnd > eIni, 'porta m15');
const portEntries = calcTs.slice(eIni, eEnd);
const harness = `type EntradaInstrumento = any;
export const __caps: any[] = [];
const __cap = (o: any, t: any) => { __caps.push({ OUT: { ...o }, T: t ? { ...t } : null }); };
${calcTs.slice(hIni, hEnd)}
export const C: Record<string, (i: any) => any> = {
${portEntries.replace(/void OUT;/g, "__cap(OUT, typeof T === 'undefined' ? null : T);")}
};
export const alx = alx15;
`;
const tmp = path.join(os.tmpdir(), `m15-port-harness-${process.pid}.mts`);
fs.writeFileSync(tmp, harness, 'utf8');
const PORT = await import(pathToFileURL(tmp).href);
fs.unlinkSync(tmp);

// ── código: definição dos instrumentos ───────────────────────
const content = read(CODE.content);
function codeInstrument(id) {
  const i = content.indexOf(`id: '${id}',`);
  if (i < 0) return null;
  const kind = content.slice(i).match(/kind: '([\w-]+)'/)[1];
  const title = JSON.parse(content.slice(i).match(/title: ("(?:[^"\\]|\\.)*")/)[1]);
  const fStart = content.indexOf('fields: [', i); const oStart = content.indexOf('outputs: [', i); const nStart = content.indexOf('note: ', i);
  const fields = [...content.slice(fStart, oStart).matchAll(/\{ id: "([^"]+)", label: ("(?:[^"\\]|\\.)*"), unit: (null|"(?:[^"\\]|\\.)*"), kind: "(\w+)", defaultValue: ("[^"]*"|[\d.]+)(?:, min: ([\d.]+), max: ([\d.]+), step: ([\d.]+))?(?:, options: (\[.*?\]))? \}/g)]
    .map((m) => ({ id: m[1], label: JSON.parse(m[2]), unit: JSON.parse(m[3]), kind: m[4], defaultValue: JSON.parse(m[5]), min: m[6] ? +m[6] : undefined, max: m[7] ? +m[7] : undefined, step: m[8] ? +m[8] : undefined, options: m[9] ? JSON.parse(m[9]) : undefined }));
  const outputs = [...content.slice(oStart, nStart).matchAll(/\{ id: "([^"]+)", label: ("(?:[^"\\]|\\.)*"), unit: (null|"(?:[^"\\]|\\.)*") \}/g)].map((m) => ({ id: m[1], label: JSON.parse(m[2]), unit: JSON.parse(m[3]) }));
  const note = JSON.parse(content.slice(nStart).match(/note: ("(?:[^"\\]|\\.)*")/)[1]);
  const aula = [...content.slice(0, i).matchAll(/id: "(aula-15-\d\d)"/g)].pop();
  const inModulo = content.lastIndexOf('export const MODULO_15_INSTRUMENTOS', i) > content.lastIndexOf('export const MODULO_15_AULAS', i);
  return { kind, title, fields, outputs, note, aula: inModulo ? null : aula?.[1], linha: content.slice(0, i).split('\n').length };
}

// ── amostragem ───────────────────────────────────────────────
let seed = 15;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const combos = (arrs) => arrs.reduce((acc, a) => acc.flatMap((x) => a.map((y) => [...x, y])), [[]]);
function samplesNumeric(numeric, segs, n = 80) {
  const out = [];
  const segCombos = combos(segs.map((s) => s.opcoes.map((o) => o.valor)));
  const base = () => Object.fromEntries(numeric.map((f) => [f.id, f.padrao_literal]));
  for (const sc of segCombos) {
    const withSeg = (o) => ({ ...o, ...Object.fromEntries(segs.map((s, i) => [s.id, sc[i]])) });
    out.push(withSeg(base()));
    out.push(withSeg(Object.fromEntries(numeric.map((f) => [f.id, String(f.min)]))));
    out.push(withSeg(Object.fromEntries(numeric.map((f) => [f.id, String(f.max)]))));
    for (let k = 0; k < n; k++) {
      out.push(withSeg(Object.fromEntries(numeric.map((f) => {
        const r = rnd();
        if (r < 0.04) return [f.id, ''];
        if (r < 0.08) return [f.id, String(f.max * 1.5 + 1)];
        if (r < 0.12) return [f.id, String(-1)];
        if (r < 0.16) return [f.id, String(f.min)];
        const v = f.min + rnd() * (f.max - f.min);
        return [f.id, String(+(Math.round(v / f.step) * f.step).toFixed(6))];
      }))));
    }
  }
  return out;
}

// ── por instrumento ──────────────────────────────────────────
const TIPO_DADOS = { '01': ['ELOS', 'DIMS'], '02': ['R', 'DIMN'], '04': ['REP'], '07': ['CAM'], '08': ['GN', 'EN'], '10': ['E'] };
const ENVELOPE = {
  '01': (sb) => sb.els.get('mp-flux').innerHTML + sb.els.get('mp-panel').innerHTML,
  '02': (sb) => sb.els.get('rg-out').innerHTML + sb.els.get('rg-vd').innerHTML,
  '08': (sb) => sb.els.get('cl-out').innerHTML + sb.els.get('cl-vd').innerHTML,
  '10': (sb) => sb.els.get('vf-panel').innerHTML,
};
const resultados = [];
const instrumentos = instDivs.map((d) => {
  const c = parseControls(d);
  const sp = scriptParts(d.nn);
  const secao = SECTIONS.find((s) => s.start < d.start && s.end > d.start);
  const isAula = /^Aula/.test(secao.sec_num);
  const before = html.slice(secao.start, d.start);
  const h3 = [...before.matchAll(/<h3><span class="num">(.*?)<\/span>\s*([\s\S]*?)<\/h3>/g)].pop();
  // bloco anterior e seguinte (irmãos)
  const prevEnd = before.lastIndexOf('</');
  const prevTagEnd = html.indexOf('>', secao.start + prevEnd) + 1;
  const prevOpen = (() => { const sub = html.slice(secao.start, secao.start + prevEnd); const m = [...sub.matchAll(/<(p|div|table|h3|ul)\b[^>]*>/g)]; for (let k = m.length - 1; k >= 0; k--) { const st = secao.start + m[k].index; try { if (balancedEnd(st, m[k][1]) === prevTagEnd) return st; } catch { /* */ } } return null; })();
  const nextOpen = html.slice(d.end).search(/<(p|div|table|h3|ul)\b/) + d.end;
  const nextTag = html.slice(nextOpen).match(/^<(\w+)/)[1];
  const nextInner = nextOpen < secao.end ? innerOf(nextOpen, nextTag) : '';
  const id = `m15-inst-${d.nn}`;
  const code = codeInstrument(id);

  // dados do script
  const dados = {};
  for (const name of TIPO_DADOS[d.nn] || []) {
    const lit = scriptLiteral(iifeRange(d.nn).s, name);
    let val;
    if (name === 'M') val = null;
    else val = evalLiteral(lit.code);
    dados[name] = { linha_aprox: lit.linha, linha_fim: lit.linha_fim, valor: val };
  }
  if (d.nn === '08') {
    const lit = scriptLiteral(iifeRange('08').s, 'M');
    const no = (pq, onde) => ({ ok: false, pq, onde }); const si = (reg, org, nao) => ({ ok: true, reg, org, nao });
    dados.M = { linha_aprox: lit.linha, linha_fim: lit.linha_fim, valor: new Function('no', 'si', `return (${lit.code});`)(no, si), nota: 'no(pq,onde) → {ok:false,…}; si(reg,org,nao) → {ok:true,…}. Campo `nao` entra como HTML (sem esc); pq/onde/reg/org passam por esc().' };
  }
  const constLines = iifeRange(d.nn).code.split('\n').map((l, i) => ({ codigo: l.trim(), linha_aprox: sp.linha_ini + i })).filter((x) => /^var (ESC|atual|gAtual)=/.test(x.codigo));

  // ── fidelidade ──
  let casos = [];
  if (d.nn === '01') {
    for (const dim of c.segs[0].opcoes.map((o) => o.valor)) for (const k of Object.keys(dados.ELOS.valor)) casos.push({ inputs: { 'mp-dim': dim }, port: { 'mp-dim': dim, 'mp-elo': k }, clicks: [{ wrap: 'mp-chips', attr: 'data-elo', val: k }] });
  } else if (d.nn === '10') {
    for (const f of c.segs[0].opcoes.map((o) => o.valor)) for (const e of dados.E.valor) casos.push({ inputs: { 'vf-flt': f }, port: { 'vf-flt': f, 'vf-en': e.k }, clicks: [{ wrap: 'vf-chips', attr: 'data-en', val: e.k }] });
  } else if (d.nn === '08') {
    for (const g of Object.keys(dados.GN.valor)) for (const e of Object.keys(dados.EN.valor)) {
      const wrap = c.segs[0].opcoes.some((o) => o.valor === g) ? 'cl-gr' : 'cl-gr2';
      casos.push({ inputs: { 'cl-el': e }, port: { 'cl-gr': g, 'cl-el': e }, clicks: [{ wrap, attr: 'data-g', val: g }] });
    }
  } else if (!c.numeric.length) {
    casos = combos(c.segs.map((sg) => sg.opcoes.map((o) => o.valor))).map((v) => { const x = Object.fromEntries(c.segs.map((sg, i) => [sg.id, v[i]])); return { inputs: x, port: x, clicks: [] }; });
  } else {
    casos = samplesNumeric(c.numeric, c.segs).map((x) => ({ inputs: x, port: x, clicks: [] }));
  }
  let okNum = 0, okVer = 0, okVal = 0, failVal = 0; const falhas = [];
  for (const cs of casos) {
    const sb = runOriginal(d.nn, d, cs.inputs, cs.clicks);
    PORT.__caps.length = 0;
    const res = PORT.C[id](cs.port);
    const cap = PORT.__caps[PORT.__caps.length - 1] || { OUT: {}, T: null };
    // readouts
    let numOk = true;
    for (const r of c.readouts) {
      const orig = sb.els.get(r.id).innerHTML;
      const port = r.id === 'ac-po' ? cap.T?.[r.id] : cap.OUT[r.id];
      if (orig !== port) { numOk = false; if (falhas.length < 5) falhas.push({ tipo: 'readout', id: r.id, entrada: cs.port, original: orig, porta: port }); }
      // valores numéricos coerentes com o readout
      const f = sp.formatacao[r.id];
      if (f && r.id in res.valores) {
        const dec = +(f.codigo.match(/fmt\([^,]+,(\d)\)/) || [0, 0])[1];
        const s = res.valores[r.id].toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
        if (!txt(orig).includes(s)) { numOk = false; failVal++; if (falhas.length < 5) falhas.push({ tipo: 'valor', id: r.id, entrada: cs.port, original: orig, valor: res.valores[r.id] }); } else okVal++;
      }
    }
    if (numOk) okNum++;
    // veredito
    let expected;
    if (d.nn === '01') {
      const dm = cs.port['mp-dim']; const ek = cs.port['mp-elo'];
      const chipHtml = '<div class="ro"><div class="k">' + dados.DIMS.valor[dm].lb + '</div><div class="n">' + dados.ELOS.valor[ek][dm].replace(/&/g, '&amp;') + '</div></div>';
      expected = PORT.alx(chipHtml + ENVELOPE['01'](sb));
    } else if (ENVELOPE[d.nn]) expected = PORT.alx(ENVELOPE[d.nn](sb));
    else if (d.nn === '09') expected = PORT.alx('<b>Posição vs. custo marginal</b><br>' + sb.els.get('ac-po').innerHTML + '<br><br>' + sb.els.get('ac-vd').innerHTML);
    else expected = PORT.alx(sb.els.get(`${c.readouts[0].id.split('-')[0]}-vd`).innerHTML);
    if (expected === res.veredito) okVer++;
    else if (falhas.length < 5) falhas.push({ tipo: 'veredito', entrada: cs.port, esperado: expected.slice(0, 200), porta: String(res.veredito).slice(0, 200) });
  }
  const fidelidade = {
    metodo: 'Original: IIFE do <script> + HELPERS executados em DOM simulado (inputs e botões lidos da marcação; cliques simulados nos chips/grupos). Porta: entradas de alexandria-instrument-calculators.ts carregadas em cópia temporária. Compara, por caso: innerHTML de cada readout == OUT da porta (T para ac-po); valores[] formatados com as casas do script contidos no readout; alx15(HTML do veredito/painel original) == veredito da porta.',
    casos: casos.length,
    readouts_identicos: okNum, valores_coerentes: okVal, valores_incoerentes: failVal, vereditos_identicos: okVer,
    falhas,
    espaco: ['01', '02', '08', '10'].includes(d.nn) ? 'exaustivo (todas as combinações)' : `amostrado: ${casos.length} casos (padrões, mínimos, máximos, vazio, fora de faixa e aleatórios com semente 15, para cada combinação de botões)`,
  };
  resultados.push([id, fidelidade.casos, okNum, okVer, falhas.length]);

  // cenário-padrão (original)
  const def = runOriginal(d.nn, d, {}, []);
  const vdId = { '01': null, '10': null }[d.nn] === undefined ? (d.nn === '02' ? 'rg-vd' : d.nn === '08' ? 'cl-vd' : `${(c.readouts[0] || {}).id?.split('-')[0]}-vd`) : null;
  const cenario = {
    entradas: Object.fromEntries([...c.numeric.map((f) => [f.id, f.padrao]), ...c.segs.map((s) => [s.id, s.padrao])]),
    saidas_exibidas: Object.fromEntries(c.readouts.map((r) => [r.id, txt(def.els.get(r.id).innerHTML)])),
    veredito: vdId && def.els.get(vdId) ? { classe: def.els.get(vdId).className, texto: txt(def.els.get(vdId).innerHTML) } : null,
    painel: ENVELOPE[d.nn] ? txt(ENVELOPE[d.nn](def)) : null,
    estado_inicial_nota: d.nn === '08' ? 'No carregamento o markup marca "on" em cl-gr (Produção de petróleo) e em cl-gr2 (Capacidade); o script remove o "on" de cl-gr2 e fica com gAtual="po".' : d.nn === '01' ? 'Chips gerados pelo script na ordem da dimensão; elo inicial "campo".' : d.nn === '10' ? 'Chips gerados pelo script; enunciado inicial "e01".' : undefined,
    nota: 'Calculado executando o script original no DOM simulado (não digitado). O script roda upd()/render() no carregamento e sobrescreve os "—" da marcação.',
  };

  // comparação de campos com o código
  const cmp = [];
  if (code) {
    for (const f of c.numeric) {
      const cf = code.fields.find((x) => x.id === f.id);
      if (!cf) { cmp.push(`campo ${f.id} ausente no código`); continue; }
      if (cf.label !== f.rotulo) cmp.push(`${f.id}: label código "${cf.label}" × fonte "${f.rotulo}"`);
      if (/&amp;/.test(cf.label)) cmp.push(`${f.id}: label "${cf.label}" guarda a entidade HTML da marcação; o painel renderiza label como texto puro (InstrumentPanel.tsx), então a tela mostraria "&amp;" em vez de "&" — leitura de código, não medida na tela`);
      if (cf.unit !== f.unidade) cmp.push(`${f.id}: unit código "${cf.unit}" × fonte "${f.unidade}"`);
      if (cf.defaultValue !== f.padrao || cf.min !== f.min || cf.max !== f.max || cf.step !== f.step) cmp.push(`${f.id}: faixa/padrão divergem`);
    }
    for (const s of c.segs) {
      const cf = code.fields.find((x) => x.id === s.id);
      if (!cf) { cmp.push(`seletor ${s.id} ausente como campo no código${d.nn === '08' && s.id === 'cl-gr2' ? ' (fundido em cl-gr, 6 opções)' : ''}`); continue; }
      if (cf.label !== s.rotulo) cmp.push(`${s.id}: label código "${cf.label}" × fonte "${s.rotulo}"`);
      const labs = s.opcoes.map((o) => o.texto);
      const clabs = (cf.options || []).map((o) => o.label);
      if (d.nn === '08' && s.id === 'cl-gr') { if (JSON.stringify(clabs) !== JSON.stringify([...labs, ...c.segs[1].opcoes.map((o) => o.texto)])) cmp.push('cl-gr: opções divergem'); }
      else if (JSON.stringify(clabs) !== JSON.stringify(labs)) cmp.push(`${s.id}: opções divergem (${JSON.stringify(clabs)} × ${JSON.stringify(labs)})`);
      if (cf.defaultValue !== s.padrao) cmp.push(`${s.id}: padrão código "${cf.defaultValue}" × fonte "${s.padrao}"`);
    }
    const extras = code.fields.filter((x) => !c.numeric.find((f) => f.id === x.id) && !c.segs.find((s) => s.id === x.id));
    for (const x of extras) cmp.push(`campo "${x.id}" (label "${x.label}") existe só no código — na fonte a escolha é por chips gerados pelo script, sem rótulo próprio${html.includes(x.label) ? '' : ' (o texto do label não ocorre na fonte)'}`);
    for (const r of c.readouts) {
      const co = code.outputs.find((x) => x.id === r.id);
      const fu = (sp.formatacao[r.id]?.codigo.match(/<span class="u">([^<]*)<\/span>/) || [])[1];
      const prefix = (sp.formatacao[r.id]?.codigo.match(/'((?:\+?R\$|\+?US\$) ?)'/) || [])[1];
      if (!co) { cmp.push(`saída ${r.id} ("${r.rotulo}") não está em outputs — ${r.id === 'ac-po' ? 'texto; a porta a antepõe ao veredito como "Posição vs. custo marginal"' : 'ausente'}`); continue; }
      if (co.label !== r.rotulo) cmp.push(`${r.id}: label código "${co.label}" × fonte "${r.rotulo}"`);
      if (fu !== undefined && co.unit !== fu.trim()) cmp.push(`${r.id}: unit código "${co.unit}" × fonte "${fu}"`);
      if (prefix) cmp.push(`${r.id}: prefixo "${prefix.trim()}" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")`);
    }
    if (code.note !== txt(c.intro)) cmp.push('note ≠ texto do inst-intro');
    if (code.title !== d.nome) cmp.push(`title código "${code.title}" × fonte "${d.nome}"`);
    if (!content.includes(txt(c.disc).slice(0, 60))) cmp.push('p.disc (fonte dos números/estrutura) não portado: o código não carrega a nota de procedência do instrumento');
    if (c.readouts.length) cmp.push('formatação: o painel usa fmt(v, 2) (até 2 casas, sem casas fixas) em vez das casas fixas do script (0, 1, 2 ou 3) e perde prefixos/sufixos compostos — leitura de InstrumentPanel.tsx, não medida na tela');
    cmp.push('tom do veredito (classe verdict ok/att/per da fonte) não é portado: ResultadoInstrumento só tem valores + veredito');
    if (c.conteineres.some((x) => /bars|bar|track|lg/.test(x.id))) cmp.push(`visualização não portada (desenho, §12): ${c.conteineres.filter((x) => /bars|bar|track|lg/.test(x.id)).map((x) => x.id).join(', ')}`);
  }
  if (failVal) {
    const ids = [...new Set(falhas.filter((f) => f.tipo === 'valor').map((f) => f.id))];
    cmp.unshift(`CÁLCULO: valores[] diverge do readout da fonte em ${failVal} caso(s) (${ids.join(', ')}): a fonte exibe "—" quando a condição de exibição falha (ex.: gb>0), a porta publica o número (negativo) em valores, e o painel o mostraria. Ex.: ${JSON.stringify(falhas.find((f) => f.tipo === 'valor'))}`);
  }
  const fidelOK = fidelidade.readouts_identicos === casos.length && fidelidade.vereditos_identicos === casos.length;
  const statusCodigo = !code ? 'não portado' : (fidelOK && cmp.filter((x) => !/formatação:|tom do veredito|visualização não portada|p\.disc/.test(x)).length === 0 ? 'portado' : 'divergente');

  return {
    id, id_fonte: d.idFonte, titulo: d.nome,
    kind_codigo: code?.kind ?? null,
    kind_nota: 'docs/alexandria/instrument-taxonomy.md cobre só os Módulos 01–07; o M15 não está catalogado (pendência FOUNDRY). O kind acima é o que o código escolheu, não decisão desta extração.',
    secao: secao.sec_num, aula_id_codigo: isAula ? `aula-15-${secao.sec_num.slice(5)}` : null,
    destino: isAula ? 'aula (por posição)' : 'Recursos do Módulo (§MAP, fora de aula — protocolo §3)',
    posicao_no_texto: {
      subsecao_anterior: h3 ? { numero: h3[1], ...both(h3[2]) } : null,
      bloco_anterior: prevOpen ? { tag: html.slice(prevOpen).match(/^<(\w+)/)[1], classe: classOf(html.slice(prevOpen, html.indexOf('>', prevOpen) + 1)), trecho_final: txt(html.slice(prevOpen, prevTagEnd)).slice(-90), linha_aprox: lineOf(prevOpen) } : null,
      bloco_seguinte: nextOpen < secao.end ? { tag: nextTag, classe: classOf(html.slice(nextOpen, html.indexOf('>', nextOpen) + 1)), trecho_inicial: txt(nextInner).slice(0, 90), linha_aprox: lineOf(nextOpen) } : null,
      invocacao_textual: d.nn === '01' ? { html: 'O instrumento abaixo existe para mostrar que <em>os mesmos nove objetos se reagrupam conforme a pergunta que você faz</em>', origem: origem('section#map p.lede', 'O instrumento abaixo existe para mostrar', html.indexOf('O instrumento abaixo existe')) } : null,
      invocacao_nota: d.nn === '01' ? undefined : 'Nenhuma frase da aula chama o instrumento ("abaixo", "use", INST·NN): o vínculo é só de posição.',
      marcacao: { linha_ini: lineOf(d.start), linha_fim: lineOf(d.end) },
    },
    introducao: { ...both(c.intro), origem: origem(`div.inst(${d.idFonte}) p.inst-intro`, c.intro, c.introIdx) },
    pergunta: null,
    pergunta_nota: 'O instrumento não declara pergunta própria; a inst-intro é instrução de uso. Pergunta de previsão seria camada Alexandria (P3/P11/P19).',
    entradas: {
      numericas: c.numeric,
      numericas_nota: c.numeric.length ? 'number + range gêmeos = um campo lógico (§12). Coerção no script: numOf(el, padrao, min, max) → parseFloat com vírgula, NaN → padrão, depois clamp; pair() faz o clamp no change do number.' : undefined,
      seletores: c.segs,
      dinamicas: d.nn === '01' ? { conteiner: 'mp-chips', origem_dos_itens: 'DIMS[dim].ordem → ELOS[k].n (rótulo) e ELOS[k][dim] (sobrelinha)', rotulo: null, rotulo_nota: 'A fonte não rotula os chips (só a inst-intro: "Clique em um elo").' }
        : d.nn === '10' ? { conteiner: 'vf-chips', origem_dos_itens: 'E[].n (rótulo) e E[].y (sobrelinha), filtrados por vf-flt', rotulo: null, rotulo_nota: 'Sem rótulo na fonte.' } : null,
    },
    saidas: c.readouts.map((r) => ({
      ...r,
      formula_script: sp.formatacao[r.id] ?? null,
      unidade_exibida: (sp.formatacao[r.id]?.codigo.match(/<span class="u">([^<]*)<\/span>/) || [])[1] ?? null,
      casas_decimais_script: +((sp.formatacao[r.id]?.codigo.match(/fmt\([^,]+,(\d)\)/) || [])[1] ?? NaN),
    })),
    calculo_script: sp.calc,
    constantes_script: constLines,
    conteineres_dinamicos: c.conteineres.map((k) => ({ ...k, templates_script: sp.paineis.filter((x) => x.id === k.id).map(({ id, ...x }) => x) })),
    lista_segs_script: sp.paineis.find((x) => x.id === 'segs') ?? null,
    leitura: {
      ramos: sp.ramos,
      nota_ramos: 'template_script é o código literal da fonte (concatenação com fmt/esc). A ordem é a do if/else; o primeiro ramo verdadeiro vence. condicao_literal é recortada do código.',
      textos_fixos_script: d.nn === '10' ? [html.match(/<p class="vf-nt">(.*?)<\/p>/)[1]] : [],
    },
    dados_script: dados,
    cenario_padrao: cenario,
    fonte_dos_numeros: { ...both(c.disc), origem: origem(`div.inst(${d.idFonte}) p.disc`, c.disc, c.discIdx) },
    tolerancias: null,
    tolerancias_nota: 'A fonte não declara tolerância, margem de acerto nem gabarito numérico para nenhum instrumento (P6/P19).',
    codigo: code ? {
      arquivo: 'src/lib/data/alexandria-modulo-15-content.ts', linha_aprox: code.linha,
      onde: code.aula ?? 'MODULO_15_INSTRUMENTOS (fora de aula)',
      kind: code.kind, n_campos: code.fields.length, n_saidas: code.outputs.length,
      calculadora: `alexandria-instrument-calculators.ts → '${id}'`,
      status: statusCodigo,
      divergencias: cmp,
    } : { status: 'não portado' },
    fidelidade,
  };
});

// ── divergências do grupo ────────────────────────────────────
const cen = (nn, id) => instrumentos[+nn - 1].cenario_padrao.saidas_exibidas[id];
const lit = (re) => { const m = html.match(re); must(m, 'lit ' + re); return { literal: txt(m[0]), linha_aprox: lineOf(m.index) }; };
const D = (id, grupo, tema, leituras, nota) => ({ id, grupo, tema, leituras, nota, decisao: 'não escolhida — registrar (P5/P19/P20)' });
const recursos = read(CODE.recursos);
const divergencias = [
  D('div-m15-inst-01', 'fonte×fonte', 'INST·03: cenário-padrão calculado × números da prosa da Aula 02',
    [
      { onde: 'INST·03 com os valores iniciais (script)', literal: `2P ${cen('03', 'gs-v2')} · 3P ${cen('03', 'gs-v3')} · IRR ${cen('03', 'gs-ir')} · R/P ${cen('03', 'gs-rp')}` },
      { onde: `Aula 02 (L${lit(/Entre as duas está o 2P, em 24,265 bilhões/).linha_aprox}, L${lit(/Petróleo · 3P<\/div><div class="dv">28,877/).linha_aprox}, L${lit(/foi de <b>147,03%<\/b>/).linha_aprox})`, literal: '2P 24,265 bi · 3P 28,877 bi · IRR 147,03% · R/P "cerca de 12,7 anos"' },
    ],
    'As razões 2P/1P = 1,387 e 3P/1P = 1,651 e a produção 1,380 estão arredondadas; o instrumento reproduz os volumes com erro na 2ª casa e mostra IRR 146,6% contra os 147,03% da prosa. A disc diz que as razões foram "calculadas a partir dos volumes publicados". Diferença de arredondamento, não de fonte; P19/P20 regem a exibição.'),
  D('div-m15-inst-02', 'fonte×fonte', 'INST·06: capacidade inicial × prosa da Aula 05',
    [
      { onde: 'INST·06 valores iniciais', literal: `capacidade 1800 mil bpd × 86,4% → carga ${cen('06', 'rf-cg')}` },
      { onde: `Aula 05 (L${lit(/Em 2025 o parque nacional produziu cerca de/).linha_aprox})`, literal: 'cerca de 2,2 milhões de barris por dia de derivados, operando a aproximadamente 86,4% da capacidade instalada' },
      { onde: 'INST·06 p.disc', literal: 'capacidade instalada de processamento e fator de utilização de ordem de grandeza do parque nacional em 2025, conforme anuário estatístico da ANP' },
    ],
    'Com 86,4% de utilização, 2,2 milhões de bpd de derivados implicam capacidade da ordem de 2,5 milhões de bpd; o padrão do instrumento é 1,8 milhão, embora a disc o atribua ao anuário. CONTENT QA — verificação autoritativa necessária (P20); não resolvido aqui.'),
  D('div-m15-inst-03', 'fonte×fonte', 'INST·01: nove elos diferentes dos nove do div.cad do §MAP; "natureza do preço" com 9 valores, não 4', [{ onde: 'modulo.json', literal: 'div-m15-01-nove-elos e div-m15-02-reagrupamentos' }], 'Ponteiro; detalhe no grupo modulo.'),
  D('div-m15-inst-04', 'fonte (resíduo)', 'INST·01: cartão "Recebe" mostra o segmento', [{ onde: 'script INST·01 painel()', literal: "'<span class=\"fzk\">Recebe</span><span class=\"fzv\">'+esc(e.seg)" }], 'Preservado na porta (fiel). Sinalizado, não corrigido (§10).'),
  D('div-m15-inst-05', 'fonte×código', 'INST·09: ac-gb negativo publicado em valores', [{ onde: 'fonte', literal: "(gb>0?'US$ '+fmt(gb,2):'—')" }, { onde: 'alexandria-instrument-calculators.ts m15-inst-09', literal: 'put("ac-gb", gb);' }], `Prova de fidelidade: ${instrumentos[8].fidelidade.valores_incoerentes} casos em ${instrumentos[8].fidelidade.casos} em que a fonte mostra "—" e a porta entrega número negativo ao painel.`),
  D('div-m15-inst-06', 'fonte×código', 'INST·09: rótulo "O&amp;M" com entidade crua em campo de texto', [{ onde: 'alexandria-modulo-15-content.ts', literal: 'label: "O&amp;M variável e encargos"' }, { onde: 'fonte (renderizada)', literal: 'O&M variável e encargos' }], 'InstrumentPanel.tsx renderiza label como texto React; por leitura de código a tela mostraria "O&amp;M". Não medido na tela.'),
  D('div-m15-inst-07', 'fonte×código', 'Prefixos monetários e casas decimais', [{ onde: 'fonte', literal: "'R$ '+fmt(rb,1)+' bi' · 'US$ '+fmt(nom,2) · fmt(v1,3)" }, { onde: 'código', literal: 'unit "bi" / "/MMBtu" / "/MWh"; painel fmt(v, 2) com maximumFractionDigits' }], 'INST·04, 05, 07 e 09 perdem R$/US$ na tela; INST·03 perde a 3ª casa (17,488 → 17,49); readouts de 0 casas passam a mostrar decimais. Leitura de código.'),
  D('div-m15-inst-08', 'fonte×código', 'Seletores e chips reestruturados', [{ onde: 'INST·08', literal: 'dois grupos seg (cl-gr, cl-gr2) → um select cl-gr de 6 opções' }, { onde: 'INST·01 / INST·10', literal: 'chips gerados pelo script → select com label "Elo da cadeia" / "Enunciado", textos que não existem na fonte' }, { onde: 'INST·01 porta', literal: 'antepõe ao painel a linha "<dimensão> · <sobrelinha do chip>" (composição da porta a partir de DIMS[d].lb e ELOS[k][d])' }], 'Conteúdo textual preservado (prova de fidelidade 100%); a forma de escolha e dois rótulos são da porta.'),
  D('div-m15-inst-09', 'fonte×código', 'INST·01 não alcança a interface', [{ onde: 'código', literal: 'MODULO_15_INSTRUMENTOS = [m15-inst-01]' }, { onde: 'RecursosDoModulo.tsx', literal: recursos.includes('MODULO_15_INSTRUMENTOS') ? 'importa' : "não importa MODULO_15_INSTRUMENTOS; RECURSOS só tem 'modulo-01'..'modulo-09'" }], 'Leitura de código.'),
  D('div-m15-inst-10', 'fonte×código', 'Procedência (p.disc) e tom do veredito não portados', [{ onde: 'fonte', literal: '10 p.disc com fonte/data de consulta; classe verdict ok/att/per em 25 ramos' }, { onde: 'código', literal: 'Instrument sem campo de procedência; ResultadoInstrumento = { valores, veredito }' }], 'P19 exige mostrar "cenário didático; fonte externa não declarada" — a disc é a origem literal dessa informação e não está no código.'),
  D('div-m15-inst-11', 'fonte×taxonomia', 'M15 fora do catálogo de instrumentos', [{ onde: 'docs/alexandria/instrument-taxonomy.md', literal: 'auditoria cobre Módulos 01–07' }, { onde: 'código', literal: 'INST·03/07/09 simulador, INST·04/05/06 calculadora, INST·01/08/10 explorador, INST·02 comparador' }], 'Três "Régua" com kinds diferentes e mecânica equivalente; pendência FOUNDRY.'),
];

writeJSON('instrumentos.json', {
  divergencias,
  grupo: 'instrumentos', modulo: 'm15', camada: 'fonte', fonte: SRC,
  gerado_em: '2026-09-17',
  metodo: 'extratores/m15_instrumentos.mjs — marcação por regex dentro de cada div.inst (walker balanceado); script por recorte do IIFE "/* ===== INST·NN" e avaliação dos literais de dados; cenário-padrão e prova de fidelidade executando o script original em DOM simulado.',
  convencoes: { formula_script: 'linha literal do script que escreve o readout', calculo_script: 'linhas `var … =` literais do upd()', status: 'portado = fidelidade 100% e sem divergência de campo; divergente = porta fiel no cálculo mas com diferença de campo/rótulo/forma; não portado = ausente' },
  resumo: instrumentos.map((x) => ({ id: x.id, id_fonte: x.id_fonte, titulo: x.titulo, secao: x.secao, kind_codigo: x.kind_codigo, entradas_numericas: x.entradas.numericas.length, seletores: x.entradas.seletores.length, saidas: x.saidas.length, ramos: x.leitura.ramos.length, status: x.codigo.status, fidelidade: `${x.saidas.length ? `${x.fidelidade.readouts_identicos}/${x.fidelidade.casos} casos com readouts idênticos e valores[] coerentes` : 'sem readouts'} · ${x.fidelidade.vereditos_identicos}/${x.fidelidade.casos} ${x.leitura.ramos.length ? 'vereditos' : 'painéis de texto'} idênticos` })),
  instrumentos,
  observacoes_gerais: [
    'Nenhum instrumento declara pergunta, gabarito ou tolerância.',
    'Três instrumentos se chamam "Régua" (03, 06, 07) e o código lhes deu kinds diferentes (simulador, calculadora, simulador) com mecânica equivalente (campos numéricos → readouts + veredito por faixa). O INST·04 (calculadora) tem a mesma forma do INST·07 (simulador). Registrado, não resolvido (§3; taxonomia sem o M15).',
    'Fontes dos números: INST·03 declara ANP (Boletim Anual de Recursos e Reservas, 10/04/2026); INST·04 declara "modelo didático simplificado" com preço/câmbio do 1º tri 2026; INST·05, INST·07 e INST·09 declaram valores didáticos/ordem de grandeza; INST·06 mistura anuário ANP (capacidade, utilização) e valores didáticos (rendimento, demanda). P19 vale para todos: nunca apresentar como dado oficial sem verificação.',
  ],
  contagens: {
    instrumentos: instrumentos.length, em_aula: instrumentos.filter((x) => x.aula_id_codigo).length, de_modulo: instrumentos.filter((x) => !x.aula_id_codigo).length,
    entradas_numericas: instrumentos.reduce((a, x) => a + x.entradas.numericas.length, 0),
    seletores: instrumentos.reduce((a, x) => a + x.entradas.seletores.length, 0),
    saidas_readout: instrumentos.reduce((a, x) => a + x.saidas.length, 0),
    ramos_de_veredito: instrumentos.reduce((a, x) => a + x.leitura.ramos.length, 0),
    casos_de_fidelidade: instrumentos.reduce((a, x) => a + x.fidelidade.casos, 0),
    status: instrumentos.reduce((a, x) => ((a[x.codigo.status] = (a[x.codigo.status] || 0) + 1), a), {}),
  },
});
console.log(JSON.stringify(resultados));
for (const x of instrumentos) {
  console.log(x.id, x.codigo.status, x.leitura.ramos.map((r) => r.condicao_literal + '/' + r.classe_veredito).join(' | '));
  if (x.fidelidade.falhas.length) console.log('  FALHAS', JSON.stringify(x.fidelidade.falhas.slice(0, 2)).slice(0, 600));
}
