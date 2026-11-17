// Extrator do grupo "instrumentos" do M08 + prova diferencial fonte × código.
// Markup e script lidos da fonte (só leitura). O comportamento da fonte é
// obtido EXECUTANDO o <script> original num DOM falso (m08_lib.runSource);
// o do código, importando as calculadoras reais de src/ (empacotadas).
import {
  html, lineOf, texto, inner, ini, origem, pad, secao, all, SCRIPT, SCRIPT_START, LINES,
  runSource, readouts, importTs, f1, f0, writeJson,
} from './m08_lib.mjs';

// ── localização das aulas/seções ──────────────────────────────
const SEC_DE = {}; // índice → id de seção
const secs = [...html.matchAll(/<section id="([^"]+)">/g)].map((m) => ({ id: m[1], idx: m.index }));
const secaoDe = (idx) => [...secs].reverse().find((s) => s.idx <= idx)?.id ?? null;
const AULA_CODIGO = (sid) => (/^a0\d$/.test(sid) ? `aula-08-${sid.slice(1)}` : null);

/** fecha a <div class="inst"> contando profundidade */
function fimDiv(startIdx) {
  const re = /<\/?div\b/g; re.lastIndex = startIdx; let depth = 0; let m;
  while ((m = re.exec(html))) {
    if (m[0] === '<div') depth++; else depth--;
    if (depth === 0) return html.indexOf('>', m.index) + 1;
  }
  throw new Error('div sem fim');
}

/** elemento de bloco imediatamente antes/depois (texto verbatim) */
function vizinho(idx, dir) {
  if (dir < 0) {
    const antes = html.slice(Math.max(0, idx - 6000), idx);
    const ms = [...antes.matchAll(/<(p|h3|div class="box[^"]*"|div class="lv"|table class="tbl"|div class="form")[^>]*>/g)];
    const last = ms[ms.length - 1];
    const abs = idx - antes.length + last.index;
    const end = html.indexOf('\n\n', abs);
    const bloco = html.slice(abs, end > 0 && end < idx ? end : idx);
    return { tipo: last[1].split(' ')[0].replace('div', 'div'), trecho: ini(bloco, 160), linha_aprox: lineOf(abs) };
  }
  const depois = html.slice(idx, idx + 6000);
  const m = /<(p|h3|div class="box[^"]*"|div class="lv"|table class="tbl"|div class="inst"|div class="map-grid")[^>]*>/.exec(depois);
  if (!m) return null;
  const abs = idx + m.index;
  const end = html.indexOf('\n\n', abs);
  return { tipo: m[1], trecho: ini(html.slice(abs, end), 160), linha_aprox: lineOf(abs) };
}

// ── markup de cada instrumento ────────────────────────────────
const INST_RANGES = all(/<div class="inst">/g, html).map(({ idx }) => [idx, fimDiv(idx)]);
const INSTS = all(/<!-- INST (\d\d) -->\s*<div class="inst">/g, html).map(({ m, idx }) => {
  const num = m[1];
  const dStart = html.indexOf('<div class="inst">', idx);
  const dEnd = fimDiv(dStart);
  const body = html.slice(dStart, dEnd);
  const base = dStart;
  const hd = /<div class="inst-hd"><span class="nm">([\s\S]*?)<\/span><span class="id">([\s\S]*?)<\/span><\/div>/.exec(body);
  const intro = /<p class="inst-intro">([\s\S]*?)<\/p>/.exec(body);
  const disc = /<p class="disc">([\s\S]*?)<\/p>/.exec(body);
  const srcnote = /<span class="srcnote">([\s\S]*?)<\/span>\s*(?:<p|<\/div>)/.exec(body);
  const segs = all(/<div class="seg-lb"[^>]*>([\s\S]*?)<\/div>\s*<div class="(seg|tr-grid)" id="([^"]+)">([\s\S]*?)<\/div>/g, body, base).map(({ m: s, idx: si }) => ({
    rotulo: texto(s[1]), id_fonte: s[3], classe: s[2],
    opcoes: [...s[4].matchAll(/<button data-([a-z])="([^"]*)"( class="on")?>([\s\S]*?)<\/button>/g)].map((b) => ({ atributo: `data-${b[1]}`, valor: b[2], rotulo: texto(b[4]), inicial: !!b[3] })),
    origem: origem(`div.inst(${num}) .seg#${s[3]}`, texto(s[1]), si),
  }));
  const campos = all(/<div class="field">\s*<div class="field-label"><span>([\s\S]*?)<\/span><span class="unit">([\s\S]*?)<\/span><\/div>([\s\S]*?)<\/div>/g, body, base).map(({ m: f, idx: fi }) => {
    const inputs = [...f[3].matchAll(/<input type="(\w+)" id="([^"]+)" min="([^"]*)" max="([^"]*)" step="([^"]*)" value="([^"]*)">/g)]
      .map((x) => ({ tipo: x[1], id_fonte: x[2], min: Number(x[3]), max: Number(x[4]), step: Number(x[5]), padrao: Number(x[6]) }));
    return { rotulo: texto(f[1]), unidade: texto(f[2]), inputs, gerado_por_script: false, origem: origem(`div.inst(${num}) .field`, texto(f[1]), fi) };
  });
  const botoes = [...body.matchAll(/<button class="btn[^"]*" id="([^"]+)">([\s\S]*?)<\/button>/g)].map((b) => ({ id_fonte: b[1], rotulo: texto(b[2]) }));
  const det = /<details[^>]*><summary>([\s\S]*?)<\/summary><div class="det-bd">([\s\S]*?)<\/div><\/details>/.exec(body);
  const containers = [...body.matchAll(/id="(i\d+-[a-zA-Z]+)"/g)].map((x) => x[1]);
  // rótulos fixos do markup fora de campo/readout (h5 das pizzas, th-lb do termômetro) — acrescentado pelo verificador
  const rotulosEstaticos = all(/<h5>([\s\S]*?)<\/h5>|<div class="th-lb">([\s\S]*?)<\/div><div class="th-val" id="([^"]+)">[\s\S]*?<small>([\s\S]*?)<\/small>/g, body, base)
    .map(({ m: r, idx: ri }) => (r[1] != null
      ? { elemento: 'h5', texto: texto(r[1]), unidade: null, container: null, origem: origem(`div.inst(${num}) h5`, texto(r[1]), ri) }
      : { elemento: 'div.th-lb', texto: texto(r[2]), unidade: texto(r[4]), container: r[3], origem: origem(`div.inst(${num}) .thermo .th-lb`, texto(r[2]), ri) }));
  const sid = secaoDe(idx);
  const secBody = secao(sid);
  // h3 corrente
  const h3s = [...html.slice(secBody.start, idx).matchAll(/<h3><span class="num">([^<]*)<\/span>([\s\S]*?)<\/h3>/g)];
  const h3 = h3s.length ? { numero: h3s[h3s.length - 1][1], titulo: texto(h3s[h3s.length - 1][2]) } : null;
  // frases da mesma seção que falam de "instrumento" (ponteiros em prosa)
  const ponteiros = all(/<p>([\s\S]*?)<\/p>/g, secBody.body, secBody.start)
    .filter(({ m: p, idx: pi }) => /instrumento|reconstrutor/i.test(p[1]) && !INST_RANGES.some(([a, b]) => pi > a && pi < b))
    .map(({ m: p, idx: pi }) => {
      const frases = texto(p[1]).split(/(?<=[.:])\s+/).filter((s) => /instrumento|reconstrutor/i.test(s));
      return { frases, linha_aprox: lineOf(pi), posicao: pi < dStart ? 'antes' : 'depois' };
    });
  return {
    num, idx, dStart, dEnd, body, sid,
    markup: {
      titulo: { texto: texto(hd[1]), origem: origem(`div.inst(${num}) .inst-hd .nm`, texto(hd[1]), base + hd.index) },
      rotulo_id: texto(hd[2]),
      intro: intro ? { html: inner(intro[1]), texto: texto(intro[1]), origem: origem(`div.inst(${num}) p.inst-intro`, ini(intro[1]), base + intro.index) } : null,
      disclaimer: disc ? { html: inner(disc[1]), texto: texto(disc[1]), origem: origem(`div.inst(${num}) p.disc`, ini(disc[1]), base + disc.index) } : null,
      nota_de_fonte: srcnote ? { html: inner(srcnote[1]), texto: texto(srcnote[1]), origem: origem(`div.inst(${num}) span.srcnote`, ini(srcnote[1]), base + srcnote.index) } : null,
      grupos_segmentados: segs,
      campos_no_markup: campos,
      botoes,
      rotulos_estaticos: rotulosEstaticos,
      detalhe: det ? { summary: texto(det[1]), html: inner(det[2]), texto: texto(det[2]), origem: origem(`div.inst(${num}) details`, texto(det[1]), base + det.index) } : null,
      containers_preenchidos_por_script: containers,
    },
    invocacao: {
      secao: sid,
      aula_id_codigo: AULA_CODIGO(sid),
      subsecao: h3,
      comentario_linha: lineOf(idx),
      bloco_div_linhas: [lineOf(dStart), lineOf(dEnd)],
      elemento_anterior: vizinho(idx, -1),
      elemento_seguinte: vizinho(dEnd, +1),
      frases_com_palavra_instrumento: ponteiros,
      frases_nota: 'Sinal para leitura, não vínculo (protocolo §2): frases da mesma seção, fora de qualquer div.inst, que contêm "instrumento" ou "reconstrutor". Algumas usam a palavra em outro sentido (instrumento regulatório, de controle).',
    },
  };
});
if (INSTS.length !== 11) throw new Error('esperava 11 instrumentos, achei ' + INSTS.length);

// ── script de cada instrumento ────────────────────────────────
const hdrs = [...SCRIPT.matchAll(/\/\* =+\n\s+(INST (\d\d) — [^\n]+|QUIZ)\n\s+=+ \*\//g)];
function scriptDe(num) {
  const i = hdrs.findIndex((h) => h[2] === num);
  const a = hdrs[i].index; const b = hdrs[i + 1].index;
  const code = SCRIPT.slice(a, b).replace(/\s+$/, '');
  const la = lineOf(SCRIPT_START + a); const lb = lineOf(SCRIPT_START + a + code.length);
  return { cabecalho: hdrs[i][1], linhas: [la, lb], code, base: SCRIPT_START + a };
}
function ramos(code, base) {
  const out = [];
  const ls = code.split('\n');
  const RE = /^\s*(\}\s*else if\s*\((.*)\)\s*\{|if\s*\((.*)\)\s*\{|\}\s*else\s*\{)\s*$/;
  let off = 0;
  ls.forEach((l, k) => {
    const m = RE.exec(l);
    if (m) {
      // corpo do ramo: linhas verbatim até o próximo ramo ou o `}` de mesmo recuo
      const ind = /^\s*/.exec(l)[0].length; const corpo = [];
      for (let j = k + 1; j < ls.length; j++) {
        const lj = ls[j]; const indj = /^\s*/.exec(lj)[0].length;
        if (indj <= ind && (RE.test(lj) || /^\s*\}/.test(lj))) break;
        corpo.push(lj.trim());
      }
      out.push({ linha: lineOf(base + off), cond: m[2] ?? m[3] ?? 'else', codigo: l.trim(), corpo_verbatim: corpo.join('\n') });
    }
    off += l.length + 1;
  });
  return out;
}
function saidasDoScript(code, base) {
  return all(/<div class="ro"><div class="k">(.*?)<\/div><div class="n([^"]*)">'\s*\+\s*(.*?)\s*\+\s*'(?:<span class="u">(.*?)<\/span>)?<\/div><\/div>'/g, code, base)
    .map(({ m, idx }) => ({ rotulo_bruto: m[1], expressao: m[3], unidade: m[4] ?? null, classe_extra: m[2].trim() || null, linha: lineOf(idx) }));
}
function atribuicoes(code, base, fn) {
  const a = code.indexOf(`function ${fn}(`);
  if (a < 0) return [];
  const sub = code.slice(a);
  return all(/^\s*var ([^;]+;)/gm, sub, base + a).map(({ m, idx }) => ({ codigo: `var ${m[1]}`.replace(/\s+/g, ' '), linha: lineOf(idx) }))
    .filter((x) => !/\$id\(|\$\$\(/.test(x.codigo));
}

// ── execução da fonte ─────────────────────────────────────────
const S = runSource();
const X = S.ctx;
const jsonOf = (o) => JSON.parse(JSON.stringify(o));
// estado renderizado: html literal do script executado + texto com fronteiras de tag viradas espaço
const tx = (h) => ({ html: inner(h), texto: texto(String(h).replace(/<[^>]+>/g, ' ')).replace(/\s+([.,;:!?)])/g, '$1') });
const vd = (id) => ({ classe: S.cls(id), html: S.out(id), texto: texto(S.out(id)) });

const inicial = {
  '01': { painel: tx(S.out('i1-panel')), legenda: tx(S.out('i1-leg')) },
  '02': { saidas: readouts(S.out('i2-out')), veredito: vd('i2-vd'), legenda_pizza1: tx(S.out('i2-lgA')), legenda_pizza2: tx(S.out('i2-lgB')) },
  '03': { saidas: readouts(S.out('i3-out')), veredito: vd('i3-vd') },
  '04': { saidas: [], veredito: vd('i4-vd'), nota: 'Na carga, os campos nascem vazios (placeholder "—") e o veredito é o texto de rodada de capacidade; não há saída até "Corrigir esta rodada".' },
  '05': { corpo_texto: tx(S.out('i5-body')) },
  '06': { saidas: readouts(S.out('i6-out')), veredito: vd('i6-vd') },
  '07': { painel: tx(S.out('i7-panel')) },
  '08': { termometro: [texto(S.out('i8-vena')), texto(S.out('i8-vear'))], saidas: readouts(S.out('i8-out')), veredito: vd('i8-vd') },
  '09': { saidas: readouts(S.out('i9-out')), veredito: vd('i9-vd') },
  '10': { saidas: readouts(S.out('i10-out')), veredito: vd('i10-vd') },
  '11': { ficha_texto: tx(S.out('i11-out')) },
};

// ── código ────────────────────────────────────────────────────
const CALC = (await importTs('src/lib/data/alexandria-instrument-calculators.ts')).INSTRUMENT_CALCULATORS;
const C08 = await importTs('src/lib/data/alexandria-modulo-08-content.ts');
const codeInst = new Map();
for (const a of C08.MODULO_08_AULAS) for (const ins of a.instruments) codeInst.set(ins.id, { ...ins, _aula: a.id });
for (const ins of C08.MODULO_08_INSTRUMENTOS) codeInst.set(ins.id, { ...ins, _aula: null });

// cobertura por token (multiconjunto): quanto do texto-fonte está no código
const toks = (s) => texto(String(s).replace(/<[^>]+>/g, ' ')).toLowerCase().normalize('NFC').split(/[^\p{L}\p{N}%,.]+/u)
  .map((t) => t.replace(/^[.,]+|[.,]+$/g, '')).filter((t) => t && !/^[\d.,]+%?$/.test(t));
const FREQ = {};
function cobertura(src, cod) {
  const bag = new Map(); for (const t of toks(cod)) bag.set(t, (bag.get(t) || 0) + 1);
  const st = toks(src); let hit = 0; const faltam = [];
  for (const t of st) { const n = bag.get(t) || 0; if (n > 0) { hit++; bag.set(t, n - 1); } else faltam.push(t); }
  return { total: st.length, hit, faltam };
}
const nt = (s) => texto(s).normalize('NFC');

function comparar(num, casos) {
  const res = { casos: 0, numericas_ok: 0, numericas_div: 0, textos_completos: 0, textos_incompletos: 0, veredito_substring_ok: 0, exemplos: [] };
  for (const c of casos) {
    res.casos++;
    const cod = c.code;
    const codTxt = nt(cod.veredito || '');
    for (const r of c.src.saidas || []) {
      if (/^-?[\d.]+(,\d+)?$/.test(r.n)) {
        const outDef = c.outDefs.find((o) => nt(o.label) === r.k);
        const v = outDef ? cod.valores?.[outDef.id] : undefined;
        const fmt = r.n.includes(',') ? f1 : f0;
        if (v !== undefined && fmt(v) === r.n) res.numericas_ok++;
        else if (v === undefined && codTxt.includes(r.n)) res.numericas_ok++;
        else { res.numericas_div++; if (res.exemplos.length < 6) res.exemplos.push({ entrada: c.entrada, saida: r.k, fonte: r.n, codigo: v === undefined ? '(ausente)' : fmt(v) }); }
      }
    }
    const srcTexto = c.src.texto;
    const cv = cobertura(srcTexto, (cod.veredito || '') + ' ' + Object.values(cod.valores || {}).join(' ') + ' ' + c.outDefs.map((o) => o.label + ' ' + (o.unit ?? '')).join(' '));
    if (cv.hit === cv.total) res.textos_completos++;
    else { res.textos_incompletos++; const F = (FREQ[num] ||= {}); for (const t of new Set(cv.faltam)) F[t] = (F[t] || 0) + 1; if (res.exemplos.length < 6) res.exemplos.push({ entrada: c.entrada, tokens_fonte: cv.total, tokens_ausentes_no_codigo: cv.faltam.slice(0, 25) }); }
    if (c.src.vd != null) {
      if (codTxt.includes(nt(c.src.vd))) res.veredito_substring_ok++;
      else if (res.exemplos.length < 6) res.exemplos.push({ entrada: c.entrada, veredito_fonte_nao_contido_no_codigo: nt(c.src.vd).slice(0, 200), veredito_codigo: codTxt.slice(0, 200) });
    }
  }
  return res;
}
const srcPack = (outIds, vdId) => {
  const saidas = outIds.flatMap((id) => readouts(S.out(id)));
  const partes = outIds.map((id) => S.out(id)).join(' ');
  return { saidas, texto: partes + ' ' + (vdId ? S.out(vdId) : ''), vd: vdId ? S.out(vdId) : null };
};
const rnd = (() => { let s = 20260917; return () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; })();
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const rf = (a, b, st = 0.1) => Math.round((a + rnd() * (b - a)) / st) * st;

const DIFF = {};
const defs = (id) => codeInst.get(id)?.outputs ?? [];
// INST 01 — exaustivo 3 × 14
{
  const casos = [];
  for (const cur of ['ger', 'esc', 'amb']) for (const n of X.I1.nodes) {
    S.click('i1-seg', cur); X.I1.sel = n.id; X.i1render();
    casos.push({ entrada: { cur, sel: n.id }, src: { saidas: [], texto: S.out('i1-panel'), vd: null }, code: CALC['m08-inst-01']({ 'i1-cur': cur, 'i1-sel': n.id }), outDefs: [] });
  }
  S.click('i1-seg', 'ger'); X.I1.sel = 'exp'; X.i1render();
  DIFF['01'] = { espaco: 'exaustivo (3 fluxos × 14 nós = 42)', ...comparar('01', casos) };
}
// INST 02 — padrão + 400 amostras
{
  const casos = []; const ks = X.I2.src.map((s) => s.k);
  const orig = X.I2.src.map((s) => [s.cap, s.fc]);
  for (let t = 0; t <= 400; t++) {
    const inp = {};
    X.I2.src.forEach((s, j) => {
      const cap = t === 0 ? orig[j][0] : (t < 5 ? 0 : rf(0, 150));
      const fc = t === 0 ? orig[j][1] : (t < 3 ? 33.3 : rf(0, 100));
      S.setNum('i2c-' + s.k, cap); S.setNum('i2f-' + s.k, fc);
      inp['i2c-' + s.k] = cap; inp['i2f-' + s.k] = fc;
    });
    casos.push({ entrada: inp, src: srcPack(['i2-out'], 'i2-vd'), code: CALC['m08-inst-02'](inp), outDefs: defs('m08-inst-02') });
  }
  X.I2.src.forEach((s, j) => { S.setNum('i2c-' + s.k, orig[j][0]); S.setNum('i2f-' + s.k, orig[j][1]); });
  // legenda das pizzas (percentuais por fonte) contra as saídas i2-a-*/i2-b-*
  DIFF['02'] = { espaco: '401 casos (padrão, 4 com capacidade zero, 396 aleatórios semente fixa); ks=' + ks.join(','), ...comparar('02', casos) };
}
// INST 03 — 6 fontes × 120 amostras + bordas
{
  const casos = [];
  for (const s of Object.keys(X.I3.faixas)) {
    S.click('i3-seg', s);
    const pts = [[300, 1200, 8760], [1, 80000, 24], [15000, 1, 8784], [100, 876, 8760]];
    for (let t = 0; t < 120; t++) pts.push([ri(1, 15000), ri(1, 80000), ri(24, 8784)]);
    for (let t = 0; t < 60; t++) { const p = ri(1, 3000); const h = 8760; pts.push([p, Math.max(1, Math.round(p * h / 1000 * rnd())), h]); }
    for (const [p, e, h] of pts) {
      S.get('i3-p').value = String(p); S.get('i3-e').value = String(e); S.get('i3-h').value = String(h); X.i3calc();
      casos.push({ entrada: { s, p, e, h }, src: srcPack(['i3-out'], 'i3-vd'), code: CALC['m08-inst-03']({ 'i3-s': s, 'i3-p': p, 'i3-e': e, 'i3-h': h }), outDefs: defs('m08-inst-03') });
    }
  }
  S.click('i3-seg', 'hid'); S.get('i3-p').value = '300'; S.get('i3-e').value = '1200'; S.get('i3-h').value = '8760'; X.i3calc();
  DIFF['03'] = { espaco: '6 fontes × 184 pontos (4 bordas, 120 aleatórios, 60 com FC ≤ 100%)', ...comparar('03', casos) };
}
// INST 04 — 2 rodadas × amostras (inclui campos vazios e soma fora de 100)
{
  const casos = []; const ks = X.I4.fontes.map((f) => f.k);
  for (const r of ['cap', 'ger']) {
    for (let t = 0; t < 400; t++) {
      S.get('i4-rst').fire('click'); S.click('i4-seg', r);
      const inp = {};
      ks.forEach((k) => {
        let v;
        if (t < 10 && rnd() < 0.3) v = '';
        else if (t < 200) v = Math.max(0, Math.round((X.I4.ref[r][k] + (rnd() - 0.5) * 12) * 10) / 10);
        else v = rf(0, 60);
        inp['i4-' + k] = v;
        if (v === '') { const e = S.get('i4i-' + k); e.value = ''; e.fire('input'); } else S.setNum('i4i-' + k, v);
      });
      S.get('i4-go').fire('click');
      const pack = srcPack(['i4-res'], 'i4-vd');
      const id = `m08-inst-04-${r}`;
      casos.push({ entrada: { rodada: r, ...inp }, src: pack, code: CALC[id](inp), outDefs: defs(id) });
    }
  }
  S.get('i4-rst').fire('click'); S.click('i4-seg', 'cap');
  DIFF['04'] = { espaco: '2 rodadas × 400 (10 com campos vazios, 190 perto da referência, 200 aleatórios)', ...comparar('04', casos) };
}
// INST 05 — exaustivo 7
{
  const casos = [];
  for (const c of X.I5.campos) { X.I5.sel = c.k; X.i5render(); casos.push({ entrada: { sel: c.k }, src: { saidas: [], texto: S.out('i5-body'), vd: null }, code: CALC['m08-inst-05']({ 'i5-sel': c.k }), outDefs: [] }); }
  X.I5.sel = 'saz'; X.i5render();
  DIFF['05'] = { espaco: 'exaustivo (7 campos)', ...comparar('05', casos) };
}
// INST 06 — exaustivo 3 × 32
{
  const casos = []; const ks = Object.keys(X.I6.on);
  for (const e of ['mes', 'dia', 'dom']) for (let mask = 0; mask < 32; mask++) {
    S.click('i6-seg', e); const inp = { 'i6-e': e };
    ks.forEach((k, j) => { X.I6.on[k] = !!(mask & (1 << j)); inp['i6-on-' + k] = X.I6.on[k] ? 'sim' : 'nao'; });
    X.i6render();
    casos.push({ entrada: inp, src: srcPack(['i6-out'], 'i6-vd'), code: CALC['m08-inst-06'](inp), outDefs: defs('m08-inst-06') });
  }
  ks.forEach((k) => { X.I6.on[k] = true; }); S.click('i6-seg', 'mes');
  DIFF['06'] = { espaco: 'exaustivo (3 escalas × 32 combinações de fontes = 96)', ...comparar('06', casos) };
}
// INST 07 — exaustivo 12
{
  const casos = [];
  for (let n = 1; n <= 12; n++) { X.I7.sel = n; X.i7render(); casos.push({ entrada: { sel: n }, src: { saidas: [], texto: S.out('i7-panel').replace(/<div class="yr">Mês \d+<\/div>/, ''), vd: null }, code: CALC['m08-inst-07']({ 'i7-sel': String(n) }), outDefs: [] }); }
  X.I7.sel = 7; X.i7render();
  DIFF['07'] = { espaco: 'exaustivo (12 meses); cabeçalho "Mês N" comparado à parte (saída numérica i7-mes)', ...comparar('07', casos) };
}
// INST 08 — exaustivo 191 × 101 × 12
{
  const casos = []; let n = 0;
  const res = { casos: 0, numericas_ok: 0, numericas_div: 0, textos_completos: 0, textos_incompletos: 0, veredito_substring_ok: 0, exemplos: [] };
  for (let ena = 10; ena <= 200; ena++) for (let ear = 0; ear <= 100; ear++) for (let mes = 1; mes <= 12; mes++) {
    S.get('i8-ena').value = String(ena); S.get('i8-ear').value = String(ear); S.get('i8-mes').value = String(mes); X.i8calc();
    const r = comparar('08', [{ entrada: { ena, ear, mes }, src: srcPack(['i8-out'], 'i8-vd'), code: CALC['m08-inst-08']({ 'i8-ena': ena, 'i8-ear': ear, 'i8-mes': mes }), outDefs: defs('m08-inst-08') }]);
    for (const k of Object.keys(res)) if (k !== 'exemplos') res[k] += r[k];
    if (res.exemplos.length < 6) res.exemplos.push(...r.exemplos.slice(0, 6 - res.exemplos.length));
    n++;
  }
  S.get('i8-ena').value = '93'; S.get('i8-ear').value = '66'; S.get('i8-mes').value = '6'; X.i8calc();
  DIFF['08'] = { espaco: `exaustivo (afluência 10–200 × armazenamento 0–100 × mês 1–12 = ${n})`, ...res };
}
// INST 09 — exaustivo 96
{
  const casos = [];
  for (const pat of ['P1', 'P2', 'P3', 'P4']) for (const dia of ['util', 'fds']) for (const reg of ['ne', 'no', 'seco', 'sul']) for (const rede of ['ok', 'lim', 'ind']) {
    S.click('i9-pat', pat); S.click('i9-dia', dia); S.click('i9-reg', reg); S.click('i9-rede', rede);
    casos.push({ entrada: { pat, dia, reg, rede }, src: srcPack(['i9-out'], 'i9-vd'), code: CALC['m08-inst-09']({ 'i9-pat': pat, 'i9-dia': dia, 'i9-reg': reg, 'i9-rede': rede }), outDefs: [] });
  }
  S.click('i9-pat', 'P3'); S.click('i9-dia', 'util'); S.click('i9-reg', 'ne'); S.click('i9-rede', 'ok');
  DIFF['09'] = { espaco: 'exaustivo (4 × 2 × 4 × 3 = 96)', ...comparar('09', casos) };
}
// INST 10 — grade h×d×t com c=120 + 3000 aleatórios
{
  const casos = [];
  const run = (c, h, d, t) => {
    S.get('i10-c').value = String(c); S.get('i10-h').value = String(h); S.get('i10-d').value = String(d); S.get('i10-t').value = String(t); X.i10calc();
    casos.push({ entrada: { c, h, d, t }, src: srcPack(['i10-out'], 'i10-vd'), code: CALC['m08-inst-10']({ 'i10-c': c, 'i10-h': h, 'i10-d': d, 'i10-t': t }), outDefs: defs('m08-inst-10') });
  };
  for (let h = 4; h <= 24; h++) for (let d = 1; d <= 7; d++) for (let t = 0; t <= 100; t += 5) run(120, h, d, t);
  for (let k = 0; k < 3000; k++) run(ri(1, 600), ri(4, 24), ri(1, 7), ri(0, 100));
  run(120, 24, 7, 40);
  DIFF['10'] = { espaco: `grade (h 4–24 × d 1–7 × t 0–100 passo 5, c=120) + 3000 aleatórios + padrão = ${casos.length}`, ...comparar('10', casos) };
}
// INST 11 — exaustivo 36
{
  const casos = [];
  for (const tema of Object.keys(X.I11DB)) for (const gran of ['tr', 'me', 'an']) for (const uso of ['int', 'pub']) {
    S.click('i11-tema', tema); S.click('i11-gran', gran); S.click('i11-uso', uso);
    const h = S.out('i11-out');
    const vdm = /<div class="verdict [^"]*">([\s\S]*)<\/div>$/.exec(h);
    casos.push({ entrada: { tema, gran, uso }, src: { saidas: [], texto: h, vd: vdm ? vdm[1] : null }, code: CALC['m08-inst-11']({ 'i11-tema': tema, 'i11-gran': gran, 'i11-uso': uso }), outDefs: [] });
  }
  S.click('i11-tema', 'cap'); S.click('i11-gran', 'tr'); S.click('i11-uso', 'int');
  DIFF['11'] = { espaco: 'exaustivo (6 × 3 × 2 = 36)', ...comparar('11', casos) };
}

// ── metadados por instrumento ─────────────────────────────────
const META = {
  '01': { fn: 'i1render', dados: { nos: X.I1.nodes, setas: X.I1.arrows, estado_inicial: { cur: 'ger', sel: 'exp' } }, codigo_id: 'm08-inst-01' },
  '02': { fn: 'i2calc', dados: { fontes: X.I2.src }, codigo_id: 'm08-inst-02' },
  '03': { fn: 'i3calc', dados: { fonte_inicial: 'hid', faixas: X.I3.faixas }, codigo_id: 'm08-inst-03' },
  '04': { fn: 'i4check', dados: { rodada_inicial: 'cap', fontes: X.I4.fontes, referencia: X.I4.ref, tol: X.I4.tol }, codigo_id: ['m08-inst-04-cap', 'm08-inst-04-ger'] },
  '05': { fn: 'i5render', dados: { campos: X.I5.campos, campo_inicial: 'saz', dados: X.I5.dados, leitura: X.I5.leitura }, codigo_id: 'm08-inst-05' },
  '06': { fn: 'i6render', dados: { escala_inicial: 'mes', ligadas_inicial: X.I6.on, nomes: X.I6.nm, eixos: X.I6.eixos, series: X.I6.dados, texto_da_escala: X.I6.txt }, codigo_id: 'm08-inst-06' },
  '07': { fn: 'i7render', dados: { mes_inicial: 7, meses: X.I7.meses }, codigo_id: 'm08-inst-07' },
  '08': { fn: 'i8calc', dados: { fotografias: X.I8.foto, nomes: X.I8.nm, subsistema_inicial: 'seco' }, codigo_id: 'm08-inst-08' },
  '09': { fn: 'i9calc', dados: { estado_inicial: { pat: 'P3', dia: 'util', reg: 'ne', rede: 'ok' } }, codigo_id: 'm08-inst-09' },
  '10': { fn: 'i10calc', dados: null, codigo_id: 'm08-inst-10' },
  '11': { fn: 'i11render', dados: { estado_inicial: { tema: 'cap', gran: 'tr', uso: 'int' }, base: X.I11DB }, codigo_id: 'm08-inst-11' },
};

const TOL = {
  '04': {
    valor: 3, unidade: 'pontos percentuais por fonte',
    declaracoes: [
      { texto: 'tol: 3', origem: { seletor: 'script I4.tol', trecho_inicial: 'tol: 3', linha_aprox: 2385 } },
      { texto: texto(INSTS[3].markup.disclaimer.html), origem: INSTS[3].markup.disclaimer.origem },
    ],
    nota: 'Única tolerância declarada no módulo. O § Final (item 1) repete "tolerância de três pontos por fonte". Nenhum outro instrumento declara tolerância.',
  },
};

const instrumentos = INSTS.map((I) => {
  const num = I.num;
  const sc = scriptDe(num);
  const meta = META[num];
  const ids = [].concat(meta.codigo_id);
  const cods = ids.map((id) => codeInst.get(id)).filter(Boolean);
  const mk = I.markup;
  // comparação estática de metadados
  const estat = cods.map((c) => {
    const note = texto(c.note || '');
    const pres = (x) => (x ? note.includes(x.texto) : null);
    return {
      id: c.id, aula_no_codigo: c._aula, kind: c.kind, titulo: c.title,
      titulo_igual_fonte: c.title === mk.titulo.texto,
      formula_no_codigo: c.formula ?? null,
      intro_verbatim_na_nota: pres(mk.intro),
      disclaimer_verbatim_na_nota: pres(mk.disclaimer),
      nota_de_fonte_verbatim_na_nota: pres(mk.nota_de_fonte),
      campos: c.fields.map((f) => ({ id: f.id, label: f.label, unit: f.unit, kind: f.kind, padrao: f.defaultValue, min: f.min ?? null, max: f.max ?? null, step: f.step ?? null, opcoes: f.options?.length ?? null })),
      saidas: (c.outputs || []).map((o) => ({ id: o.id, label: o.label, unit: o.unit })),
    };
  });
  const aulaEsperada = I.invocacao.aula_id_codigo;
  const d = DIFF[num];
  d.tokens_ausentes_freq = Object.entries(FREQ[num] || {}).sort((a, b) => b[1] - a[1]).slice(0, 20);
  const probs = [];
  // presença avaliada sobre o CONJUNTO das notas (o INST 04 virou par cap/ger)
  const notas = texto(cods.map((c) => c.note || '').join(' '));
  const presenca = {
    intro: mk.intro ? notas.includes(mk.intro.texto) : null,
    disclaimer: mk.disclaimer ? notas.includes(mk.disclaimer.texto) : null,
    nota_de_fonte: mk.nota_de_fonte ? notas.includes(mk.nota_de_fonte.texto) : null,
  };
  if (presenca.intro === false) probs.push('intro (p.inst-intro) não aparece verbatim na nota do código');
  if (presenca.disclaimer === false) probs.push('disclaimer (p.disc) não aparece verbatim na nota do código');
  if (presenca.nota_de_fonte === false) probs.push('nota de fonte (span.srcnote) não aparece verbatim na nota do código');
  for (const e of estat) {
    if (e.aula_no_codigo !== aulaEsperada) probs.push(`aula no código (${e.aula_no_codigo}) ≠ fonte (${aulaEsperada})`);
    if (!e.titulo_igual_fonte) probs.push(`título do código difere: "${e.titulo}"`);
    if (e.formula_no_codigo) probs.push(`campo formula do código não existe como texto na fonte: "${e.formula_no_codigo}"`);
  }
  if (d.numericas_div) probs.push(`${d.numericas_div} saídas numéricas divergentes na prova diferencial`);
  if (d.textos_incompletos) probs.push(`${d.textos_incompletos} casos com texto da fonte incompleto no código`);
  const status = !cods.length ? 'não portado' : (probs.length ? 'divergente' : 'portado');
  return {
    id: `m08-inst-${num}`,
    numero_fonte: mk.rotulo_id,
    titulo: mk.titulo,
    escopo: I.sid === 'map' ? 'instrumento de módulo (§MAP)' : 'instrumento de aula',
    pergunta: null,
    pergunta_nota: 'A fonte não declara pergunta própria para o instrumento (nenhum campo "pergunta"). O que existe é o inst-intro (abaixo) e, para alguns, frases de convite na prosa (invocacao.ponteiros_em_prosa). Pergunta de previsão, se houver, é camada Alexandria (P19).',
    intro: mk.intro,
    entradas: {
      grupos_segmentados: mk.grupos_segmentados,
      campos_no_markup: mk.campos_no_markup,
      campos_gerados_por_script: num === '02'
        ? X.I2.src.map((s) => ({ rotulo: s.nm, unidade: 'GW · FC %', inputs: [{ id_fonte: 'i2c-' + s.k, tipo: 'number', min: 0, max: 400, step: 0.1, padrao: s.cap }, { id_fonte: 'i2f-' + s.k, tipo: 'number', min: 0, max: 100, step: 0.1, padrao: s.fc }], origem: { seletor: 'script i2fields()', trecho_inicial: "'<div class=\"field\"><div class=\"field-label\"><span>'+esc(s.nm)+'</span><span class=\"unit\">GW · FC %</span>", linha_aprox: 2224 } }))
        : num === '04'
          ? X.I4.fontes.map((f) => ({ rotulo: f.nm, unidade: '% da pizza', inputs: [{ id_fonte: 'i4i-' + f.k, tipo: 'number', min: 0, max: 100, step: 0.1, padrao: null, placeholder: '—' }], origem: { seletor: 'script i4inputs()', trecho_inicial: "'<div class=\"field\"><div class=\"field-label\"><span>'+esc(f.nm)+'</span><span class=\"unit\">% da pizza</span>", linha_aprox: 2390 } }))
          : [],
      controles_sem_campo: num === '06' ? { descricao_script: 'Chaves .src-t[data-k] geradas por i6render(): uma por fonte (hid, eol, sol, bio, fos), alternam I6.on[k]; mais duas etiquetas fixas "Soma das ligadas" e "Carga e carga líquida".', origem: { seletor: 'script i6render()', trecho_inicial: "$id('i6-src').innerHTML", linha_aprox: 2681 } }
        : num === '07' ? { descricao_script: 'Doze células .cal-m geradas por i7render() com m.nm.slice(0,3); clique troca I7.sel.', origem: { seletor: 'script i7render()', trecho_inicial: "$id('i7-cal').innerHTML", linha_aprox: 2754 } }
          : num === '01' ? { descricao_script: 'Nós do SVG (.mp-node) e chips (.tl-chip) gerados por i1render(); clique troca I1.sel. Estado inicial sel = "exp".', origem: { seletor: 'script i1render()', trecho_inicial: "$id('i1-chips').innerHTML", linha_aprox: 2191 } }
            : num === '05' ? { descricao_script: 'Sete chips .tr-chip gerados por i5render() a partir de I5.campos; clique troca I5.sel.', origem: { seletor: 'script i5render()', trecho_inicial: "$id('i5-chips').innerHTML", linha_aprox: 2577 } }
              : null,
      nota_faixas: num === '03' || num === '08' || num === '10' ? 'Campo number pareado com range gêmeo (mesmas faixas no markup); pairSlider grampeia pelo min/max do range. Campo vazio no number é ignorado até o blur.' : null,
    },
    saidas: {
      readouts_do_script: saidasDoScript(sc.code, sc.base),
      calculo_verbatim: atribuicoes(sc.code, sc.base, meta.fn),
      funcao: meta.fn,
    },
    ramos_de_leitura: ramos(sc.code, sc.base),
    script: { cabecalho: sc.cabecalho, linhas: sc.linhas, codigo_verbatim: sc.code },
    dados_do_script: meta.dados ? jsonOf(meta.dados) : null,
    cenario_padrao: inicial[num],
    fonte_dos_numeros: mk.nota_de_fonte ?? null,
    fonte_dos_numeros_nota: mk.nota_de_fonte ? null : 'Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).',
    disclaimer: mk.disclaimer,
    botoes: mk.botoes,
    detalhe: mk.detalhe,
    rotulos_estaticos: mk.rotulos_estaticos,
    tolerancia: TOL[num] ?? null,
    tolerancia_nota: TOL[num] ? null : 'Nenhuma tolerância declarada na fonte.',
    invocacao: I.invocacao,
    codigo: {
      status,
      ids: ids,
      problemas: probs,
      comparacao_estatica: estat,
      presenca_verbatim_nas_notas: presenca,
      prova_diferencial: d,
    },
    origem: origem(`<!-- INST ${num} --> div.inst`, `INST ${num}`, I.idx),
  };
});

// ── divergências fonte × fonte (medidas, não resolvidas) ──────
const DIVS = [];
{
  // (a) INST 02 (derivado) × INST 04 (referência) — ordem da pizza de geração
  const src = X.I2.src; const tA = src.reduce((a, s) => a + s.cap, 0);
  const g = src.map((s) => s.cap * (s.fc / 100) * 8.76); const tB = g.reduce((a, b) => a + b, 0);
  const deriv = Object.fromEntries(src.map((s, i) => [s.k, { cap: +(s.cap / tA * 100).toFixed(2), ger: +(g[i] / tB * 100).toFixed(2), twh: +g[i].toFixed(2) }]));
  const ordem = (o) => Object.keys(o).sort((a, b) => o[b] - o[a]).join(' > ');
  DIVS.push({
    id: 'inst-div-01', severidade: 'alta', tipo: 'fonte×fonte', instrumentos: ['m08-inst-02', 'm08-inst-04'],
    tema: 'Ordem da pizza de geração: o Conversor (INST 02, valores iniciais) e a referência do Reconstrutor (INST 04) não concordam',
    leitura_a: { onde: 'INST 02 I2.src (L2214-2219), geração derivada = cap × FC × 8,76', ordem_geracao: ordem(Object.fromEntries(Object.entries(deriv).map(([k, v]) => [k, v.ger]))), fatias: deriv },
    leitura_b: { onde: 'INST 04 I4.ref.ger (L2383)', ordem_geracao: ordem(X.I4.ref.ger), fatias: X.I4.ref.ger },
    consequencia: 'Quem reconstrói a ordem que o INST 02 mostra (solar 3ª, fóssil 4ª) recebe "A ordem das fontes está incorreta" no INST 04, cuja referência põe térmica fóssil (11,8) acima de solar (11,4). A hidrelétrica também difere (52,7 derivada × 51,7 referência).',
  });
  DIVS.push({
    id: 'inst-div-02', severidade: 'média', tipo: 'fonte×fonte', instrumentos: ['m08-inst-04'],
    tema: 'Ordem de capacidade: o Ex·02 fala em "térmica agregada em terceiro, perto de vinte por cento" e "eólica em quarto"; o INST 04 separa biomassa e fóssil e põe eólica (13,3) em 3º e fóssil (12,2) em 4º',
    leitura_a: { onde: '§Ex 02 gabarito (L1582)', trecho: 'térmica agregada em terceiro, perto de vinte por cento; eólica em quarto, na casa dos treze' },
    leitura_b: { onde: 'INST 04 I4.ref.cap (L2382)', ordem_capacidade: ordem(X.I4.ref.cap) },
    nota: 'O Ex·02 (L1583) também põe a solar em terceiro na geração ("solar em terceiro, na casa dos onze"), o que concorda com o INST 02 e discorda do INST 04 (inst-div-01).',
  });
  DIVS.push({
    id: 'inst-div-03', severidade: 'média', tipo: 'fonte×fonte', instrumentos: ['m08-inst-04', 'm08-inst-05'],
    tema: 'Biomassa e térmica fóssil "não aparecem separadas na pizza de capacidade" (INST 05, leitura "cap", e fichas da Aula 02), mas o INST 04 pede e corrige as duas separadamente na rodada de capacidade, e o INST 02 também as separa',
    leitura_a: { onde: 'I5.leitura.cap (L2567)', trecho: X.I5.leitura.cap.slice(0, 160) },
    leitura_b: { onde: 'I4.fontes + I4.ref.cap (L2374-2382)', valores: { bio: X.I4.ref.cap.bio, fos: X.I4.ref.cap.fos } },
  });
}
{
  // (b) faixas de fator de capacidade: INST 03 × INST 05 × fichas × INST 02
  const fichas = {};
  for (const m of html.matchAll(/<div class="src-card">\s*<div class="src-hd"><span class="nm">([\s\S]*?)<\/span>[\s\S]*?<\/div>([\s\S]*?)\n    <\/div>/g)) {
    const rows = Object.fromEntries([...m[2].matchAll(/<div class="src-k">([\s\S]*?)<\/div><div class="src-v">([\s\S]*?)<\/div>/g)].map((r) => [texto(r[1]), texto(r[2])]));
    fichas[texto(m[1])] = { rows, linha: lineOf(m.index) };
  }
  const f3 = X.I3.faixas;
  DIVS.push({
    id: 'inst-div-04', severidade: 'alta', tipo: 'fonte×fonte (P20 · CONTENT QA)', instrumentos: ['m08-inst-02', 'm08-inst-03', 'm08-inst-05'],
    tema: 'Faixas típicas de fator de capacidade divergem entre a calculadora (INST 03), a leitura lateral (INST 05) e as fichas da Aula 02; e o FC inicial da solar no INST 02 (15,5%) fica abaixo da faixa típica solar declarada em todas elas (20–30%)',
    leitura_a: { onde: 'I3.faixas (L2314-2331)', faixas: Object.fromEntries(Object.entries(f3).map(([k, v]) => [k, `${v.lo}–${v.hi}%`])) },
    leitura_b: { onde: 'I5.dados[*].fc (L2520-2560)', textos: Object.fromEntries(Object.entries(X.I5.dados).map(([k, v]) => [k, v.fc])) },
    leitura_c: { onde: 'fichas src-card da Aula 02, linha "Fator de capacidade típico"', textos: Object.fromEntries(Object.entries(fichas).map(([k, v]) => [k, v.rows['Fator de capacidade típico'] ?? null])) },
    leitura_d: { onde: 'I2.src[*].fc (L2214-2219), "derivados da razão entre as duas séries"', valores: Object.fromEntries(X.I2.src.map((s) => [s.k, s.fc])) },
    pontos: ['hidrelétrica 40–60 (INST 03) × 45–60 (INST 05 e ficha); INST 02 usa 41,6', 'nuclear 75–92 (INST 03) × 75–90 (INST 05 e ficha); INST 02 usa 90,4', 'gás natural 15–70 (INST 03) × térmica fóssil "de menos de 10% a mais de 70%" (INST 05 e ficha)', 'solar 20–30 em todas; INST 02 usa 15,5 (derivado de 2025, fora da faixa)'],
  });
  // (c) INST 05 declara "os textos são os mesmos das fichas" — medir
  const mapa = { 'Hidrelétrica': 'Hidrelétrica', 'Eólica': 'Eólica', 'Solar fotovoltaica': 'Solar fotovoltaica', 'Biomassa': 'Térmica a biomassa', 'Térmica fóssil': 'Térmica fóssil — gás, carvão e derivados', 'Nuclear': 'Nuclear' };
  let iguais = 0, difs = 0; const ex = [];
  for (const [f5, ff] of Object.entries(mapa)) for (const c of X.I5.campos) {
    const a = texto(X.I5.dados[f5][c.k]); const b = fichas[ff]?.rows[c.nm];
    if (b === undefined) { difs++; if (ex.length < 8) ex.push({ fonte: f5, campo: c.nm, ficha: '(campo ausente na ficha)' }); continue; }
    if (a === b) iguais++; else { difs++; if (ex.length < 8) ex.push({ fonte: f5, campo: c.nm, inst05: a, ficha: b }); }
  }
  DIVS.push({
    id: 'inst-div-05', severidade: 'baixa', tipo: 'fonte×fonte', instrumentos: ['m08-inst-05'],
    tema: 'O disclaimer do INST 05 diz "Os textos são os mesmos das fichas, reorganizados por campo", mas os textos do script são versões encurtadas/reescritas das fichas',
    medicao: { celulas_iguais: iguais, celulas_diferentes: difs, exemplos: ex },
    fichas_campos: Object.fromEntries(Object.entries(fichas).map(([k, v]) => [k, { linha: v.linha, campos: Object.keys(v.rows) }])),
  });
}
{
  // (d) INST 08: readout × veredito no estado inicial
  S.get('i8-ena').value = '93'; S.get('i8-ear').value = '66'; S.get('i8-mes').value = '6'; X.i8calc();
  DIVS.push({
    id: 'inst-div-06', severidade: 'média', tipo: 'fonte (interna)', instrumentos: ['m08-inst-08'],
    tema: 'INST 08: o readout "Quadrante" corta em 100% da MLT (fluxo forte/fraco), mas o veredito corta em 70% ("fraco" × "próximo do normal"). No estado inicial (93% / 66%) o readout diz "fluxo fraco" e o veredito diz "fluxo próximo do normal"; "Tendência" corta em 80% e diz "estável"',
    estado_inicial: { saidas: readouts(S.out('i8-out')), veredito_inicio: texto(S.out('i8-vd')).slice(0, 60) },
    codigo_fonte: ["(ear>=50?'Estoque alto':'Estoque baixo')+' · '+(ena>=100?'fluxo forte':'fluxo fraco')", "cls = (ena < 70) ? 'att' : 'ok';", "var tend = ena >= 100 ? 'recompondo' : (ena >= 80 ? 'estável' : 'deteriorando');"],
  });
  DIVS.push({
    id: 'inst-div-07', severidade: 'baixa', tipo: 'fonte (interna)', instrumentos: ['m08-inst-08'],
    tema: 'INST 08: "Carregar fotografia de" reescreve afluência e armazenamento, mas não o mês; as quatro fotografias são de junho de 2026 (srcnote) e o campo mês só coincide porque nasce em 6',
    codigo_fonte: "$id('i8-ena').value = f.ena; $id('i8-enan').value = f.ena; $id('i8-ear').value = f.ear; $id('i8-earn').value = f.ear;",
  });
  // (e) INST 09: P2 em dia útil com rede normal cai no ramo "madrugada"
  S.click('i9-pat', 'P2'); S.click('i9-dia', 'util'); S.click('i9-reg', 'ne'); S.click('i9-rede', 'ok');
  DIVS.push({
    id: 'inst-div-08', severidade: 'média', tipo: 'fonte (interna)', instrumentos: ['m08-inst-09'],
    tema: 'INST 09: com P2 (transição) + dia útil + rede normal, o último ramo usa o texto da madrugada ("Na madrugada, a carga é baixa…") porque só testa p === "P4"; o readout do mesmo caso diz carga líquida "Elevada"',
    medicao: { saidas: readouts(S.out('i9-out')), veredito_inicio: texto(S.out('i9-vd')).slice(0, 80) },
    codigo_fonte: "expl = (p === 'P4') ? 'No patamar de ponta…' : 'Na madrugada, a carga é baixa…';",
  });
  S.click('i9-pat', 'P3');
  // (f) INST 10: promessa x saídas; definição de fator de carga
  DIVS.push({
    id: 'inst-div-09', severidade: 'média', tipo: 'fonte (interna)', instrumentos: ['m08-inst-10'],
    tema: 'INST 10: o inst-intro promete "a demanda de ponta implícita", mas nenhuma saída a mostra; e o "fator de carga anual" do script é (consumo/8760)/(consumo/(h×d×52)), não a razão demanda média/demanda máxima do § Lex. Com operação 24×7 dá 99,7% (52 semanas = 8.736 h), não 100%',
    leitura_a: { onde: 'I10 script (L2903-2906)', codigo: ['var horasAno = h * d * 52;', 'var demMed = horasAno > 0 ? (c*1000)/horasAno : 0;', 'var demMedAnual = c*1000/8760;', 'var fatorCarga = demMed > 0 ? (demMedAnual/demMed)*100 : 0;'] },
    leitura_b: { onde: '§Lex "Fator de carga" (L1847)', texto: 'Razão entre demanda média e demanda máxima de um consumidor ou de um sistema num período.' },
    cenario_padrao: inicial['10'].saidas,
  });
}

writeJson('instrumentos.json', {
  modulo: 'm08',
  fonte: 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo08.html',
  camada: 'fonte',
  gerado_por: 'extratores/m08_instrumentos.mjs',
  metodo: 'Markup lido por regex com índice de linha; comportamento da fonte obtido executando o <script> original num DOM falso (só chamadas de ambiente simuladas); código comparado importando INSTRUMENT_CALCULATORS e MODULO_08_* reais.',
  contagens: {
    instrumentos: instrumentos.length,
    de_aula: instrumentos.filter((i) => i.escopo === 'instrumento de aula').length,
    de_modulo: instrumentos.filter((i) => i.escopo !== 'instrumento de aula').length,
    por_status: instrumentos.reduce((a, i) => ((a[i.codigo.status] = (a[i.codigo.status] || 0) + 1), a), {}),
    ramos_total: instrumentos.reduce((a, i) => a + i.ramos_de_leitura.length, 0),
    casos_diferenciais: Object.values(DIFF).reduce((a, d) => a + d.casos, 0),
  },
  divergencias_fonte: DIVS,
  instrumentos,
});
console.log(JSON.stringify(Object.fromEntries(instrumentos.map((i) => [i.id, { status: i.codigo.status, probs: i.codigo.problemas, diff: { c: i.codigo.prova_diferencial.casos, nok: i.codigo.prova_diferencial.numericas_ok, ndiv: i.codigo.prova_diferencial.numericas_div, tinc: i.codigo.prova_diferencial.textos_incompletos, vok: i.codigo.prova_diferencial.veredito_substring_ok }, freq: i.codigo.prova_diferencial.tokens_ausentes_freq, ex: i.codigo.prova_diferencial.exemplos.slice(0, 1) }])), null, 1));
