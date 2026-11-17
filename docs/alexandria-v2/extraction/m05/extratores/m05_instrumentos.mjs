// Extração do grupo "instrumentos" do M05 → instrumentos.json
// 1) markup de cada div.inst; 2) bloco do <script> de cada INST (linhas
// verbatim, ramos do veredito); 3) execução do <script> ORIGINAL inteiro
// num DOM simulado (vm) para o cenário-padrão e para grades de entrada;
// 4) comparação com INSTRUMENTOS_MODULO_05 + INSTRUMENT_CALCULATORS.
// Uso: node m05_instrumentos.mjs
import vm from 'node:vm';
import {
  L, ln, fail, FONTE, at, find, findAll, walk, txt, stripTags, collapse, origem, attrs,
  writeJson, buildCodigo, HOJE, SCRIPT,
} from './m05_lib.mjs';

const COD = buildCodigo();
const { INSTRUMENTOS_MODULO_05, MODULO_05_AULAS } = await import(COD.content05);
const { INSTRUMENT_CALCULATORS } = await import(COD.calc);
const pad = (i) => String(i).padStart(2, '0');

// ── 1. markup ──────────────────────────────────────────────────────────
const AULAS = ['a01', 'a02', 'a03', 'a04', 'a05', 'a06'];
const markup = [];
for (const aid of AULAS) {
  const w = walk(aid);
  w.blocos.forEach((b, i) => {
    if (b.tipo !== 'instrumento') return;
    const [a, z] = b.linhas;
    const prev = [...w.blocos.slice(0, i)].reverse().find((x) => x.tipo !== 'comentario_html');
    const next = w.blocos[i + 1];
    const h3 = [...w.blocos.slice(0, i)].reverse().find((x) => x.tipo === 'titulo');
    const resumo = (x) => x ? { tipo: x.tipo, rotulo: x.rotulo ?? x.titulo ?? (x.numero ? `${x.numero} ${x.texto}` : null), trecho: (x.texto ?? x.titulo ?? '').slice(0, 90), linha_aprox: x.origem?.linha_aprox ?? x.linha_aprox } : null;
    const range = L.slice(a - 1, z);
    const lineOf = (re) => { const k = range.findIndex((s) => re.test(s)); return k < 0 ? null : a + k; };
    // campos
    const campos = [];
    for (let n = a; n <= z; n++) {
      const m = ln(n).match(/<label class="field-label">(.*?)(?: <span class="unit">(.*?)<\/span>)?<\/label>/);
      if (!m) continue;
      const num = attrs(ln(n + 1));
      const rng = attrs(ln(n + 2));
      if (num.type !== 'number' || rng.type !== 'range') fail(`campo ${n}`);
      campos.push({
        rotulo: m[1], unidade: m[2] ?? null,
        id_range: rng.id, id_number: num.id,
        padrao: +num.value, min: +num.min, max: +num.max, passo: +num.step,
        input_number: num, input_range: rng,
        number_igual_range: ['value', 'min', 'max', 'step'].every((k) => num[k] === rng[k]),
        origem: origem(n, 'div.inst .field'),
      });
    }
    const readouts = [];
    for (let n = a; n <= z; n++) {
      const m = ln(n).match(/<div class="ro"><div class="k">(.*?)<\/div><div class="(n(?: gold)?)" id="(.*?)"(?: style="(.*?)")?>(.*?)<\/div><\/div>/);
      if (m) readouts.push({ id: m[3], rotulo: m[1], classe: m[2], destaque: m[2] === 'n gold', estilo: m[4] ?? null, valor_inicial_markup: m[5], origem: origem(n, 'div.inst .readout .ro') });
    }
    const nIntro = lineOf(/class="inst-intro"/);
    const nDisc = lineOf(/class="disc"/);
    const nSvg = lineOf(/<svg id=/);
    const nLeg = lineOf(/class="chart-legend"/);
    const nVd = lineOf(/class="verdict"/);
    const nBars = lineOf(/class="bars"/);
    const nSig = lineOf(/class="sig-grid"/);
    markup.push({
      aid, aula: aid.slice(1), id_fonte: b.id_fonte, titulo: b.titulo, linhas: b.linhas,
      comentario_html: w.blocos[i - 1]?.tipo === 'comentario_html' ? w.blocos[i - 1].texto : null,
      subsecao: h3 ? { numero: h3.numero, titulo: h3.texto } : null,
      bloco_anterior: resumo(prev), bloco_seguinte: resumo(next),
      intro: { ...txt(at(nIntro, /<p class="inst-intro">(.*)<\/p>/)), origem: origem(nIntro, 'div.inst p.inst-intro') },
      campos, readouts,
      veredito_id: at(nVd, /id="(.*?)"/), veredito_inicial_markup: at(nVd, />(.*)<\/div>/), nVd,
      disc: { ...txt(at(nDisc, /<p class="disc">(.*)<\/p>/)), origem: origem(nDisc, 'div.inst p.disc') },
      svg: nSvg ? { id: at(nSvg, /<svg id="(.*?)"/), viewBox: at(nSvg, /viewBox="(.*?)"/), linha_aprox: nSvg } : null,
      legenda: nLeg ? [...ln(nLeg).matchAll(/<span><i style="background:(.*?)"><\/i>(.*?)<\/span>/g)].map((m) => ({ cor: m[1], texto: m[2] })) : [],
      barras: nBars ? { id: at(nBars, /id="(.*?)"/), linha_aprox: nBars } : null,
      sinais_container: nSig ? { id: at(nSig, /id="(.*?)"/), linha_aprox: nSig, nota: 'Nasce vazio no markup; o script o popula com os 8 sinais (var SIG).' } : null,
    });
  });
}
if (markup.length !== 6) fail(`esperava 6 instrumentos, achei ${markup.length}`);

// ── 2. script por instrumento ──────────────────────────────────────────
const cabecalhos = findAll(/^\/\* ---------- .* ---------- \*\/$/, SCRIPT.ini, SCRIPT.fim);
const blocoScript = (idx) => {
  const h = cabecalhos.find((n) => new RegExp(`INST 0${idx} `).test(ln(n)));
  const prox = cabecalhos.find((n) => n > h);
  return { ini: h, fim: prox - 1, cabecalho: collapse(ln(h)) };
};
const classifica = (s) => {
  const t = s.trim();
  if (t === '' || /^\(function\(\)\{$|^\}\)\(\);$|^function run\(\)\{$|^\}$|^if\(!\$id\(/.test(t)) return 'estrutura';
  if (/^link\(|^run\(\);|addEventListener\('change',run\)|^var box=|box\.innerHTML=html;|^var boxes=/.test(t)) return 'ligacao';
  if (/vd\(v2?,/.test(t) || /^var v2?=\$id\('i\d-vd'\);$/.test(t)) return 'veredito';
  if (/\$id\('i\d-[a-z0-9]+'\)\.(innerHTML|textContent)=/.test(t) && !/svg'|bars'|sigs'/.test(t)) return 'saida';
  if (/pts\+=|class="vl"|^for\(k=0;k<marked\.length|^for\(i=0;i<SIG\.length|^s\+=|<rect|<circle|<text|<line|<polyline|svg'\)\.innerHTML|bars'\)\.innerHTML|html2?\+=|^var s=|^var pts|^pts\+=|^var html2?=|^function bar\(|^return '<div class="bar-row">|^'<div class="bar-fill"|^'<div class="vl">|^for\(i=0;i<(NMAX|4|5|REF\.length);i\+\+\)\{$|^var (sel|x|hc|hk|base|a|ho|hr|hd)=|^var bw=|^var yMax|^var kc|^if\(\(i\+1\)===G\)\{|^if\(marked\.length===0\)|^var s=SIG\[marked/.test(t)) return 'desenho';
  if (/^var (W2|ML|MW|BR|REF)|^function (px|py)\(/.test(t)) return 'geometria';
  return 'calculo';
};
const RAMO_RE = /^\s*(else if|if|else)\s*(?:\((.*)\))?\s*vd\((v2?),'(\w+)',(.*)\);\s*$/;
function scriptInfo(idx) {
  const bs = blocoScript(idx);
  const linhas = [];
  const ramos = [];
  for (let n = bs.ini + 1; n <= bs.fim; n++) {
    const s = ln(n);
    if (s.trim() === '') continue;
    const tipo = classifica(s);
    linhas.push({ linha: n, tipo, codigo: s.replace(/\s+$/, '') });
    const r = s.match(RAMO_RE);
    if (r) ramos.push({ ordem: ramos.length + 1, palavra: r[1], condicao: r[2] ?? null, classe_css: r[4], expressao_js: r[5], linha: n });
  }
  return { ...bs, linhas, ramos };
}

// ── 3. DOM simulado + execução do script original ──────────────────────
function makeDom() {
  const reg = new Map();
  class El {
    constructor(id, a = {}) { this.id = id; this.attrs = a; this.value = a.value; this.min = a.min; this.max = a.max; this.step = a.step; this.className = a.class ?? ''; this.style = {}; this.listeners = {}; this._html = ''; this._text = null; this.kids = []; this.checked = false; }
    addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
    set innerHTML(v) {
      this._html = String(v); this._text = null;
      if (this.id === 'i4-sigs') {
        this.kids = [...this._html.matchAll(/<input type="checkbox" data-i="(\d+)">/g)].map((m) => new El(null, { 'data-i': m[1] }));
      }
    }
    get innerHTML() { return this._text !== null ? this._text : this._html; }
    set textContent(v) { this._text = String(v); this._html = null; }
    get textContent() { return this._text !== null ? this._text : stripTags(this._html ?? ''); }
    getAttribute(k) { return this.attrs[k]; }
    querySelectorAll(sel) { return sel === 'input[type=checkbox]' ? this.kids : []; }
    scrollIntoView() {}
  }
  for (let n = 249; n < SCRIPT.ini; n++) {
    for (const m of ln(n).matchAll(/<(\w+)([^>]*?)\sid="([^"]+)"([^>]*)>/g)) {
      const a = attrs(`${m[2]} ${m[4]}`);
      reg.set(m[3], new El(m[3], a));
    }
  }
  const get = (id) => { if (!reg.has(id)) reg.set(id, new El(id)); return reg.get(id); };
  const document = {
    getElementById: get,
    querySelectorAll: () => [],
    querySelector: () => null,
    documentElement: { scrollHeight: 1000, clientHeight: 500, scrollTop: 0 },
    body: { scrollTop: 0 },
  };
  const window = { addEventListener() {} };
  const ctx = vm.createContext({ document, window, console });
  new vm.Script(SCRIPT.codigo, { filename: 'm05-script.js', lineOffset: SCRIPT.ini }).runInContext(ctx);
  return { get, reg };
}
const DOM = makeDom();
// ramo executado: envolve vd() não é possível (função interna); lemos a linha pela
// comparação classe+texto contra a execução — cada ramo é identificado pela sonda abaixo.
function runSource(idx, entrada) {
  const m = markup[idx - 1];
  for (const c of m.campos) {
    if (!(c.id_range in entrada)) continue;
    DOM.get(c.id_range).value = String(entrada[c.id_range]);
    DOM.get(c.id_number).value = String(entrada[c.id_range]);
  }
  if (idx === 4) {
    const kids = DOM.get('i4-sigs').kids;
    kids.forEach((k) => { k.checked = !!entrada[`sinal-${k.attrs['data-i']}`]; });
  }
  DOM.get(m.campos[0].id_range).listeners.input[0]();
  const saidas = Object.fromEntries(m.readouts.map((r) => { const e = DOM.get(r.id); return [r.id, { html: e.innerHTML, texto: e.textContent }]; }));
  const v = DOM.get(m.veredito_id);
  return { saidas, veredito: { classe: v.className.replace(/^verdict /, ''), texto: v.textContent } };
}
const defaults = (idx) => Object.fromEntries(markup[idx - 1].campos.map((c) => [c.id_range, c.padrao]));

// identificação do ramo da fonte: reexecuta a condição literal com as variáveis do run.
// Para isso, o bloco run() é reavaliado isoladamente com vd() instrumentado.
function ramoProbe(idx) {
  const si = SCRIPT_INFO[idx - 1];
  // do `function $id` até antes do cabeçalho do INST 01 (sem a IIFE externa)
  const helpers = L.slice(find(/^function \$id\(x\)/, SCRIPT.ini) - 1, find(/INST 01 /, SCRIPT.ini) - 1).join('\n');
  const body = si.linhas.map((l) => l.codigo).join('\n')
    .replace(/vd\((v2?),'(\w+)',/g, (all, v, c) => `__vd(${v},'${c}',`);
  return (entrada) => {
    let hit = null;
    const els = new Map();
    const $el = (id) => { if (!els.has(id)) { const e = { value: '', min: '0', max: '0', className: '', style: {}, listeners: {}, addEventListener() {}, set innerHTML(v) { this._h = v; if (id === 'i4-sigs') this.kids = [...String(v).matchAll(/data-i="(\d+)"/g)].map((mm) => ({ checked: false, getAttribute: () => mm[1], addEventListener() {} })); }, get innerHTML() { return this._h; }, textContent: '', querySelectorAll() { return this.kids ?? []; }, kids: [] }; els.set(id, e); } return els.get(id); };
    for (const c of markup[idx - 1].campos) { const e = $el(c.id_range); e.value = String(entrada[c.id_range]); e.min = String(c.min); e.max = String(c.max); }
    const code = `${helpers}\nvar __lines=[];\nfunction __vd(el,cls,t){__hit(new Error().stack);}\n${body}`;
    const ctx = vm.createContext({
      document: { getElementById: $el, querySelectorAll: () => [], documentElement: { scrollHeight: 1000, clientHeight: 500, scrollTop: 0 }, body: { scrollTop: 0 } },
      window: { addEventListener() {} },
      __hit: (st) => { hit = +st.split('\n')[2].match(/probe\.js:(\d+)/)[1]; },
      entrada,
    });
    // os checkboxes do INST 04 são marcados depois do box.innerHTML (dentro do bloco), via getter
    if (idx === 4) {
      const box = $el('i4-sigs');
      Object.defineProperty(box, 'kids', { configurable: true, get() { return this._k; }, set(v) { this._k = v.map((k) => ({ ...k, checked: !!entrada[`sinal-${k.getAttribute('data-i')}`] })); } });
    }
    new vm.Script(code, { filename: 'probe.js' }).runInContext(ctx);
    if (hit === null) return null;
    const off = helpers.split('\n').length + 3; // linha (1-based) da 1ª linha do corpo
    const k = hit - off;
    return si.linhas[k]?.linha ?? null;
  };
}

const SCRIPT_INFO = [1, 2, 3, 4, 5, 6].map(scriptInfo);

// SIG (INST 04)
const nSig = find(/^\s*var SIG=\[$/, SCRIPT.ini);
const nSigEnd = find(/^\s*\];$/, nSig);
const SIG = new Function(`return ${L.slice(nSig - 1, nSigEnd).join('\n').replace(/^\s*var SIG=/, '').replace(/;\s*$/, '')}`)();

// ── 4. grades de entrada ───────────────────────────────────────────────
const range = (a, b, s) => { const o = []; for (let v = a; v <= b + 1e-9; v += s) o.push(+v.toFixed(6)); return o; };
const cart = (obj) => Object.entries(obj).reduce((acc, [k, vs]) => acc.flatMap((e) => vs.map((v) => ({ ...e, [k]: v }))), [{}]);
const GRADES = {
  1: cart({ 'i1-q': [5, 100, 200, 500, 1000], 'i1-f': [50, 300, 900, 3000], 'i1-c': [20, 180, 1200], 'i1-n': [1, 2, 3, 4, 5, 6] }),
  2: cart({ 'i2-g': [1, 2, 3, 4], 'i2-c': range(0, 100, 5), 'i2-f': range(0, 100, 5) }),
  3: cart({ 'i3-l': range(0, 100, 10), 'i3-c': range(0, 100, 10), 'i3-p': [-60, -20, 0, 40, 160], 'i3-v': [0, 55, 100] }),
  4: cart({ 'i4-m': [1, 120, 2000], ...Object.fromEntries(range(0, 7, 1).map((i) => [`sinal-${i}`, [false, true]])) }),
  5: cart({ 'i5-b': [200, 4000, 20000], 'i5-w': [3, 7.5, 14], 'i5-o': [30, 620, 3000], 'i5-d': [10, 180, 1500], 'i5-e': [500, 14000, 60000], 'i5-x': [-4, 0, 2.5, 12] }),
  6: cart({ 'i6-x': range(0, 100, 5), 'i6-y': range(0, 100, 5), 'i6-h': range(0, 100, 5) }),
};

// leitura numérica de uma saída exibida pela fonte → { valor, tolerancia } (em unidade do código)
function parseSaida(id, texto) {
  const t = texto.replace(/−/g, '-').replace(/\s+/g, ' ').trim();
  if (t === 'zero') return { valor: 0, tol: 0.5 };
  const m = t.match(/(-?[\d.]+(?:,\d+)?)/);
  if (!m) return null;
  const dec = (m[1].split(',')[1] ?? '').length;
  let v = +m[1].replace(/\./g, '').replace(',', '.');
  let tol = 0.5 * 10 ** -dec;
  let mult = 1;
  if (/ bi\b/.test(t)) mult = 1e9; else if (/ mi\b/.test(t)) mult = 1e6; else if (/ mil\b/.test(t)) mult = 1e3;
  // unidades do código: i1-tf em R$; i4-e, i5-p/s/f em R$ mi
  const emMi = ['i4-e', 'i5-p', 'i5-s', 'i5-f'].includes(id);
  const escala = emMi ? mult / 1e6 : mult;
  return { valor: v * escala, tol: tol * escala + 1e-9 };
}
const SAIDAS_TEXTUAIS = { 'i2-b': true, 'i4-r': true, 'i6-q': true, 'i6-r': true };

// classificadores do ramo do CÓDIGO (prefixos lidos de alexandria-instrument-calculators.ts)
const RAMO_COD = {
  1: (v) => ['Rede única', 'Duplicar custa pouco', 'A duplicação já', 'Monopólio natural forte'].findIndex((p) => v.startsWith(p)),
  2: (v) => (v.startsWith('Separação ') && v.includes('é o ponto de menor atrito') ? 0 : v.startsWith('Diferença pequena') ? 1 : /^Separação (profunda|rasa) demais/.test(v) ? 2 : -1),
  3: (v) => ['Há sobrecontratação', 'Cem por cento contratado', 'Faixa em que a folga', 'Ainda gerenciável', 'A maior parte do custo'].findIndex((p) => v.startsWith(p)),
  4: (v) => (v.startsWith('Nenhum sinal') ? 0 : v.includes('dificultam a verificação') ? 1 : v.includes('a lacuna e a materialidade. Captura') ? 2 : v.includes('Nesta faixa um terceiro') ? 3 : -1),
  5: () => 0,
  6: (v) => (v.includes('Configuração coerente') ? 0 : v.includes('Sustentável, mas há tensão') ? 1 : v.includes('desalinhados') ? 2 : -1),
};

// ── 5. montagem ────────────────────────────────────────────────────────
const TAXON = { 1: 'simulador', 2: 'simulador', 3: 'simulador', 4: 'quebra-cabeca (instrument-taxonomy.md; nome fora do enum)', 5: 'simulador', 6: 'simulador (instrument-taxonomy.md; "Mapa", nome fora do enum)' };
const instrumentos = markup.map((m, k) => {
  const idx = k + 1;
  const si = SCRIPT_INFO[k];
  const cod = INSTRUMENTOS_MODULO_05.find((x) => x.id === `m05-inst-${pad(idx)}`);
  const calc = INSTRUMENT_CALCULATORS[`m05-inst-${pad(idx)}`];
  const probe = ramoProbe(idx);
  const ramoLinhas = si.ramos.map((r) => r.linha);

  // cenário-padrão
  const ent0 = defaults(idx);
  if (idx === 4) for (let i = 0; i < 8; i++) ent0[`sinal-${i}`] = false;
  const run0 = runSource(idx, ent0);
  const ramo0 = probe(ent0);

  // entradas do código como o painel as semeia (id do campo do código)
  const codInputs = (e, corrigido) => {
    const o = {};
    cod.fields.forEach((f, i) => {
      if (idx === 4 && f.id.startsWith('i4-s')) { o[f.id] = e[`sinal-${f.id.slice(4)}`] ? 'on' : 'off'; return; }
      const src = idx === 4 ? m.campos[0] : m.campos[i];
      o[corrigido ? src.id_range : f.id] = e[src.id_range];
    });
    return o;
  };

  // teste
  const casos = GRADES[idx];
  const t = { casos: casos.length, numerico: { ok: 0, falha: 0, exemplos: [] }, numerico_ids_corrigidos: { ok: 0, falha: 0, exemplos: [] }, ramo: { ok: 0, falha: 0, exemplos: [] }, ramo_ids_corrigidos: { ok: 0, falha: 0, exemplos: [] }, veredito_verbatim: 0, ramos_fonte_cobertos: new Set() };
  const vereditosCodigoPorRamo = {};
  for (const e of casos) {
    const src = runSource(idx, e);
    const rl = probe(e);
    t.ramos_fonte_cobertos.add(rl);
    for (const [variant, bucket] of [[false, t.numerico], [true, t.numerico_ids_corrigidos]]) {
      const r = calc(codInputs(e, variant));
      let ok = true; const det = [];
      for (const ro of m.readouts) {
        if (SAIDAS_TEXTUAIS[ro.id]) continue;
        const p = parseSaida(ro.id, src.saidas[ro.id].texto);
        const cv = r.valores[ro.id];
        let cvx = cv;
        if (ro.id === 'i1-w' && p && p.valor === 0) cvx = cv <= 0.001 ? 0 : cv;
        if (!p || cvx === undefined || Math.abs(cvx - p.valor) > p.tol) { ok = false; det.push({ saida: ro.id, fonte: src.saidas[ro.id].texto, codigo: cv }); }
      }
      if (ok) bucket.ok++; else { bucket.falha++; if (bucket.exemplos.length < 3) bucket.exemplos.push({ entrada: e, diferencas: det }); }
      {
        const ri = RAMO_COD[idx](r.veredito ?? '');
        const rf = ramoLinhas.indexOf(rl);
        const okR = idx === 5 ? false : ri === rf;
        const rb = variant ? t.ramo_ids_corrigidos : t.ramo;
        if (okR) rb.ok++; else { rb.falha++; if (rb.exemplos.length < 3) rb.exemplos.push({ entrada: e, ramo_fonte_linha: rl, ramo_fonte_indice: rf, ramo_codigo_indice: ri, veredito_codigo: r.veredito }); }
      }
      if (!variant) {
        if ((r.veredito ?? '') === src.veredito.texto) t.veredito_verbatim++;
        (vereditosCodigoPorRamo[rl] ||= new Set()).add(r.veredito);
      }
    }
  }
  const ramosCobertos = [...t.ramos_fonte_cobertos].filter(Boolean).sort((a, b) => a - b);

  // divergências com o código
  const div = [];
  cod.fields.forEach((f, i) => {
    if (idx === 4) return;
    const c = m.campos[i];
    const difs = [];
    if (f.id !== c.id_range) difs.push(`id "${f.id}" ≠ fonte "${c.id_range}"`);
    if (f.label !== c.rotulo) difs.push(`rótulo "${f.label}" ≠ "${c.rotulo}"`);
    if (f.unit !== c.unidade) difs.push(`unidade "${f.unit}" ≠ "${c.unidade}"`);
    for (const [a, b] of [['defaultValue', 'padrao'], ['min', 'min'], ['max', 'max'], ['step', 'passo']]) if (f[a] !== c[b]) difs.push(`${a} ${f[a]} ≠ ${c[b]}`);
    if (difs.length) div.push({ campo: c.id_range, diferencas: difs });
  });
  if (idx === 4) {
    const fm = cod.fields.find((f) => f.id === 'i4-m');
    const c = m.campos[0];
    if (!(fm.label === c.rotulo && fm.unit === c.unidade && fm.defaultValue === c.padrao && fm.min === c.min && fm.max === c.max && fm.step === c.passo)) div.push({ campo: 'i4-m', diferencas: ['atributos diferentes'] });
    cod.fields.filter((f) => f.id.startsWith('i4-s')).forEach((f) => {
      const s = SIG[+f.id.slice(4)];
      const esperado = `${s.t} (${s.p} pts)`;
      div.push({ campo: f.id, diferencas: [`checkbox da fonte virou select Presente/Ausente; rótulo "${f.label}" = t + " (p pts)" ${f.label === esperado ? '(consistente)' : '(DIFERENTE)'}; descrição d do sinal ausente`] });
    });
  }
  const outCod = cod.outputs.map((o) => o.id);
  const outSrc = [...m.readouts.map((r) => r.id), m.veredito_id];
  const rotulosOut = cod.outputs.filter((o) => o.id !== m.veredito_id).map((o) => ({ id: o.id, igual: m.readouts.find((r) => r.id === o.id)?.rotulo === o.label }));
  const valoresExtras = Object.keys(calc(codInputs(ent0, false)).valores).filter((k2) => !outSrc.includes(k2));

  const status = (t.numerico.falha === 0 && t.ramo.falha === 0 && t.veredito_verbatim === casos.length && div.length === 0) ? 'portado' : 'divergente';
  const saidasTexto = m.readouts.filter((r) => SAIDAS_TEXTUAIS[r.id]).map((r) => r.id);

  return {
    id: `m05-inst-${pad(idx)}`,
    tipo: 'instrumento',
    camada: 'fonte',
    id_fonte: m.id_fonte,
    titulo: m.titulo,
    prefixo_titulo: m.titulo.split(' · ')[0],
    mecanica: {
      entradas_numericas: m.campos.length,
      entradas_booleanas: idx === 4 ? SIG.length : 0,
      saidas: m.readouts.length,
      saidas_textuais: saidasTexto,
      grafico: m.svg ? 'svg' : (m.barras ? 'barras html' : null),
      veredito_ramos: si.ramos.length,
      kind_catalogo_taxonomia: TAXON[idx],
    },
    aula: m.aula,
    aula_id_codigo: `aula-05-${m.aula}`,
    posicao_no_texto: {
      linhas: m.linhas,
      subsecao: m.subsecao,
      depois_de: m.bloco_anterior,
      antes_de: m.bloco_seguinte,
      comentario_html: m.comentario_html,
    },
    invocacoes_no_texto: [],
    invocacoes_nota: 'Nenhuma frase das aulas chama o instrumento ("abaixo", "use o simulador"…): zero ocorrências. Ligações textuais indiretas: ' + ({ 4: 'título do Ex·09 "O termômetro dá vermelho" (aparato.json m05-ex-09); os pesos/sinais espelham o "teste de sete perguntas" (§4.5).', 6: 'Ex·10 pede plotar um sistema "no mapa de dois eixos" (m05-ex-10); §6.1 define os dois eixos.', 5: 'Ex·04 (efeito de variação do custo de capital) e o lede da aula ("identidade central").', 1: 'Ex·01 "A rua com cinco redes".', 2: 'Ex·02 (discriminação vertical) e a tabela §2.2 (quatro graus).', 3: 'nenhuma no §Ex; a Aula 03 remete ao Módulo 04 para contratos.' }[idx] ?? ''),
    intro: m.intro,
    pergunta: null,
    pergunta_nota: 'A fonte não formula pergunta própria para o instrumento; o texto de abertura é uma instrução (inst-intro).' + (idx === 1 ? ' O intro menciona "a pergunta de quando ela deixa de subir o suficiente para importar" — não é uma pergunta dirigida ao learner com resposta.' : '') + ' Pergunta de previsão = camada Alexandria (P19).',
    entradas: m.campos.map((c) => ({ id: c.id_range, id_number: c.id_number, rotulo: c.rotulo, unidade: c.unidade, padrao: c.padrao, min: c.min, max: c.max, passo: c.passo, controle: 'number + range gêmeo (um campo lógico)', number_igual_range: c.number_igual_range, origem: c.origem })),
    sinais: idx === 4 ? {
      origem: origem(nSig, '<script> INST 04 var SIG'),
      total: SIG.length,
      soma_pesos: SIG.reduce((a, s) => a + s.p, 0),
      padrao: 'todos desmarcados (checkbox sem checked)',
      itens: SIG.map((s, i) => ({ indice: i, peso: s.p, titulo: s.t, descricao: s.d, linha_aprox: nSig + 1 + i })),
    } : null,
    saidas: m.readouts.map((r) => ({
      id: r.id, rotulo: r.rotulo, destaque: r.destaque, estilo: r.estilo, valor_inicial_markup: r.valor_inicial_markup,
      textual: !!SAIDAS_TEXTUAIS[r.id],
      atribuicao_script: si.linhas.filter((l) => l.tipo === 'saida' && l.codigo.includes(`'${r.id}'`)).map((l) => ({ linha: l.linha, codigo: l.codigo.trim() })),
      origem: r.origem,
    })),
    formulas_script: si.linhas.filter((l) => l.tipo === 'calculo' || l.tipo === 'geometria').map((l) => ({ linha: l.linha, codigo: l.codigo.trim() })),
    formula_nota: 'Linhas de cálculo do <script> original, verbatim (classificadas por regex; desenho, saída e veredito separados). Funções de formatação compartilhadas (num, brl, brl2, mi, mmi, clamp) em formatadores_comuns.',
    script: { cabecalho: si.cabecalho, linhas: [si.ini, si.fim], codigo: si.linhas },
    grafico: m.svg || m.barras ? {
      svg: m.svg, barras: m.barras, legenda: m.legenda,
      rotulos_eixo_x: si.linhas.filter((l) => /xlab\(/.test(l.codigo)).map((l) => l.codigo.trim()),
      nota: 'Desenho não porta como dado (protocolo §12); legenda e rótulos literais registrados.',
    } : null,
    veredito: {
      id: m.veredito_id,
      valor_inicial_markup: m.veredito_inicial_markup,
      ramos: si.ramos.map((r) => ({ ...r, coberto_no_teste: ramosCobertos.includes(r.linha) })),
      nota: 'expressao_js é a expressão literal passada a vd(); classe_css ok/att/per é a cor do veredito na fonte (não exibir como semáforo).',
    },
    disclaimer: m.disc,
    fonte_dos_numeros: null,
    fonte_dos_numeros_nota: 'A fonte não cita origem externa para constantes nem cenário-padrão; o próprio instrumento se declara "Didático/ilustrativo — não usar para dimensionamento real" (disclaimer). Na interface: "cenário didático; fonte externa não declarada" (P19).',
    tolerancias: null,
    tolerancias_nota: 'Nenhuma tolerância declarada na fonte (P6).',
    cenario_padrao: {
      entradas: ent0,
      saidas: run0.saidas,
      veredito: { ...run0.veredito, ramo_linha: ramo0 },
      metodo: '<script> original executado inteiro em DOM simulado (node:vm), run() disparado com os value= do markup — o mesmo que a página faz no carregamento.',
    },
    comparacao_codigo: {
      status,
      id_codigo: cod.id,
      kind_codigo: cod.kind,
      titulo_igual: cod.title === m.titulo,
      formula_codigo: cod.formula,
      nota_igual_disclaimer: cod.note === m.disc.texto,
      campos_divergentes: div,
      saidas_codigo: outCod,
      saidas_fonte: outSrc,
      rotulos_saida_iguais: rotulosOut,
      saidas_textuais_omitidas_em_valores: saidasTexto,
      valores_extras_no_codigo: valoresExtras,
      teste: {
        casos: t.casos,
        numerico_como_o_painel_semeia: t.numerico,
        numerico_com_ids_da_fonte: t.numerico_ids_corrigidos,
        ramo_do_veredito: t.ramo,
        ramo_do_veredito_com_ids_da_fonte: t.ramo_ids_corrigidos,
        veredito_verbatim: `${t.veredito_verbatim}/${t.casos}`,
        ramos_fonte_cobertos: `${ramosCobertos.length}/${si.ramos.length}`,
        vereditos_codigo_distintos_por_ramo: Object.fromEntries(Object.entries(vereditosCodigoPorRamo).map(([k2, v]) => [k2, v.size])),
        metodo: 'Para cada entrada da grade: script original (DOM simulado) × INSTRUMENT_CALCULATORS[id] (bundle esbuild). Numérico: cada saída exibida pela fonte é lida de volta (pt-BR, bi/mi/mil) e comparada com valores[id] dentro da meia-unidade do último dígito exibido. Ramo: linha do vd() executado na fonte × ramo do texto do código (classificador por prefixo). Verbatim: texto do veredito idêntico.',
      },
    },
  };
});

const formatadores = (() => {
  const a = find(/^function \$id\(x\)/, SCRIPT.ini);
  const b = find(/^function vd\(el,cls,txt\)/, SCRIPT.ini);
  const link = find(/^function link\(id,cb\)\{$/, SCRIPT.ini);
  const linkEnd = find(/^\}$/, link);
  return {
    helpers: L.slice(a - 1, b).map((s, i) => ({ linha: a + i, codigo: s })),
    link: L.slice(link - 1, linkEnd).map((s, i) => ({ linha: link + i, codigo: s })),
    nota: 'link(): ao editar o campo number, o valor é limitado a [min,max] do range (clamp) e NaN volta ao valor do range; não há arredondamento ao passo. Não há parseFloat||1 neste módulo.',
  };
})();

const out = {
  schema: 'alexandria-v2/extraction/instrumentos@1',
  modulo: '05',
  grupo: 'instrumentos',
  fonte: FONTE,
  gerado_em: HOJE,
  gerado_por: 'docs/alexandria-v2/extraction/m05/extratores/m05_instrumentos.mjs',
  metodo: 'Markup por div.inst (percorredor walk); script por cabeçalho /* ---------- INST 0N */; cenário-padrão e testes executando o <script> original inteiro em DOM simulado (node:vm); SIG avaliado do literal. Código: bundle esbuild de alexandria-modulo-05-content.ts e alexandria-instrument-calculators.ts.',
  convencoes: { linha: 'Linha 1-based na fonte.', null: 'Ausência declarada, com nota.', camada: 'Tudo aqui é camada "fonte"; comparacao_codigo é medição.' },
  total: instrumentos.length,
  fora_de_aula: [],
  fora_de_aula_nota: 'Nenhum instrumento de módulo (§Lab/§MAP) no M05.',
  formatadores_comuns: formatadores,
  instrumentos,
  divergencias: [],
};

// divergências consolidadas
const d = out.divergencias;
const i1 = instrumentos[0];
d.push({
  id: 'div-m05-inst-01', tema: 'INST·01: id do campo "Operadores concorrentes" quebra o cálculo no produto', tipo: 'fonte_x_codigo', severidade: 'alta',
  nota: `O campo do código tem id "i1" (fonte: range "i1-n"), mas a calculadora lê i['i1-n']; o painel semeia por field.id, então N = 0 sempre. Resultado medido na grade (${i1.comparacao_codigo.teste.casos} casos): numérico como o painel semeia ${i1.comparacao_codigo.teste.numerico_como_o_painel_semeia.ok} ok / ${i1.comparacao_codigo.teste.numerico_como_o_painel_semeia.falha} falhas; com os ids da fonte ${i1.comparacao_codigo.teste.numerico_com_ids_da_fonte.ok} ok / ${i1.comparacao_codigo.teste.numerico_com_ids_da_fonte.falha} falhas.`,
  exemplo: i1.comparacao_codigo.teste.numerico_como_o_painel_semeia.exemplos[0] ?? null,
  decisao: 'Registrar (bug do código, não da fonte).',
});
d.push({
  id: 'div-m05-inst-02', tema: 'Vereditos parafraseados (não verbatim) nos seis instrumentos', tipo: 'fonte_x_codigo', severidade: 'alta',
  nota: instrumentos.map((x) => `${x.id_fonte}: verbatim ${x.comparacao_codigo.teste.veredito_verbatim}, ramo ${x.comparacao_codigo.teste.ramo_do_veredito.ok}/${x.comparacao_codigo.teste.casos}`).join('; ') + '. Os textos do código encurtam os ramos e removem a interpolação numérica (R$, %, atrito, opacidade).',
  decisao: 'Registrar; o texto da fonte é o de instrumentos[].veredito.ramos[].expressao_js.',
});
d.push({
  id: 'div-m05-inst-03', tema: 'INST·05: veredito único no código', tipo: 'fonte_x_codigo', severidade: 'alta',
  nota: `A fonte tem ${instrumentos[4].veredito.ramos.length} ramos (X<0; participação da remuneração ≥48%, ≥25%, senão); o código devolve sempre o mesmo texto, que não existe na fonte.`,
  decisao: 'Registrar.',
});
d.push({
  id: 'div-m05-inst-04', tema: 'kind fora do enum e descrição da taxonomia', tipo: 'codigo_x_taxonomia_x_fonte',
  nota: `Código: INST·04 kind "${instrumentos[3].comparacao_codigo.kind_codigo}", INST·06 kind "${instrumentos[5].comparacao_codigo.kind_codigo}" — iguais a docs/alexandria/instrument-taxonomy.md. Mas a taxonomia descreve o Termômetro pelo CÓDIGO ("8 campos select booleanos (Presente/Ausente), cada um com peso fixo documentado no rótulo" e "5 saídas"); na FONTE são 8 checkboxes sem peso no rótulo (o peso só aparece como "N pts" na barra de um sinal marcado) e 4 readouts + veredito.`,
  decisao: 'Registrar para FOUNDRY.',
});
d.push({
  id: 'div-m05-inst-05', tema: 'Saídas textuais fora de valores', tipo: 'limitacao_contrato',
  nota: 'i2-b, i4-r, i6-q, i6-r são texto na fonte; o código as omite de valores e as cita no veredito parafraseado (i6-q/i6-r e i4-r) ou nem isso (i2-b só aparece no nome do grau). Protocolo §12.',
  decisao: 'Registrar.',
});
d.push({
  id: 'div-m05-inst-06', tema: 'INST·04: sinais como select e sem descrição', tipo: 'fonte_x_codigo', severidade: 'media',
  nota: 'A fonte usa 8 checkboxes com título (b) e descrição; o código usa 8 selects "Presente/Ausente" com rótulo "título (N pts)" — o peso vira texto visível (a fonte não mostra peso no sinal; mostra "N pts" só na barra) e a descrição d some.',
  decisao: 'Registrar.',
});
d.push({
  id: 'div-m05-inst-07', tema: 'Formatação das saídas', tipo: 'fonte_x_codigo', severidade: 'baixa',
  nota: 'A fonte formata cada saída com unidade embutida (R$ …/ano, R$ … mi, …/100, …/8, "zero"); o código devolve número cru com unit null em todos os outputs. i1-pct existe só no código.',
  decisao: 'Registrar.',
});
d.push({
  id: 'div-m05-inst-08', tema: 'Constantes sem procedência', tipo: 'lacuna_fonte',
  nota: 'CRF 10% (INST·01), BC/BK (INST·02), SP R$ 200/MWh e fatores 0,35/0,90/1,6 (INST·03), pesos 22…3 (INST·04 — "Os pesos são arbitrários"), posição do Brasil (85,45) e referências A/B/C (INST·06) não têm fonte externa; os disclaimers as declaram ilustrativas.',
  decisao: 'P19/P20: cenário didático rotulado; nunca benchmark real.',
});

writeJson('instrumentos.json', out);
console.log('instrumentos.json');
for (const x of instrumentos) {
  const c = x.comparacao_codigo;
  console.log(x.id_fonte, x.titulo, '| campos', x.entradas.length, 'saidas', x.saidas.length, 'ramos', x.veredito.ramos.length,
    '| padrao:', Object.values(x.cenario_padrao.saidas).map((s) => s.texto).join(' ; '), '|', x.cenario_padrao.veredito.classe, x.cenario_padrao.veredito.ramo_linha,
    '\n   status', c.status, 'casos', c.teste.casos, 'num', c.teste.numerico_como_o_painel_semeia.ok, '/', c.teste.numerico_como_o_painel_semeia.falha,
    'numFix', c.teste.numerico_com_ids_da_fonte.ok, '/', c.teste.numerico_com_ids_da_fonte.falha, 'ramo', c.teste.ramo_do_veredito.ok, '/', c.teste.ramo_do_veredito.falha,
    'verb', c.teste.veredito_verbatim, 'cob', c.teste.ramos_fonte_cobertos, 'campdiv', c.campos_divergentes.length, 'extras', c.valores_extras_no_codigo, 'titulo', c.titulo_igual, 'nota', c.nota_igual_disclaimer);
  if (c.teste.numerico_com_ids_da_fonte.falha) console.log('   ex:', JSON.stringify(c.teste.numerico_com_ids_da_fonte.exemplos[0]));
  if (c.teste.ramo_do_veredito.falha && x.id_fonte !== 'Inst · 05') console.log('   exR:', JSON.stringify(c.teste.ramo_do_veredito.exemplos[0]));
}
