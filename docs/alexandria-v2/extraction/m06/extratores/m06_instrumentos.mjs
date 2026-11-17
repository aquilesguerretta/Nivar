// Extração programática dos 8 instrumentos do M06 (camada fonte) + prova de porte.
// Markup: parser de pilha. Script: linhas literais. Cenário-padrão e comparação com o código:
// o <script> ORIGINAL roda num DOM simulado (harness só troca `vd(v,` por `__vd(<linha>,v,` para
// saber qual ramo disparou; a fonte não é tocada). Nenhum texto de conteúdo é digitado.
import vm from 'node:vm';
import {
  html, LINES, fonteMeta, decode, texto, inl, ini, origem, pad, kids, find, findAll,
  section, codigo, writeJson, hoje,
} from './lib.mjs';

const C = await codigo();
const CALC = C.CALC;
const INSTS_COD = [...C.C06.MODULO_06_INSTRUMENTOS, ...C.C06.INSTRUMENTOS_MODULO_06];

// ── 1. markup ────────────────────────────────────────────────
const SECS = ['map', 'a01', 'a02', 'a03', 'a04', 'a05', 'a06'];
const instEls = [];
for (const sid of SECS) {
  const S = section(sid);
  const secMarcador = decode(kids(S.wrap).find((k) => k.cls === 'sec-id').inner.match(/<b>(.*?)<\/b>/)[1]);
  for (const k of kids(S.wrap)) if (k.cls === 'inst') instEls.push({ el: k, sid, secMarcador, irmaos: kids(S.wrap) });
}
const label = (fieldEl) => {
  const lb = kids(fieldEl).find((k) => k.tag === 'label');
  const u = kids(lb).find((k) => k.cls === 'unit');
  return { rotulo: texto(html.slice(lb.innerStart, u ? u.start : lb.innerEnd)), unidade: u ? decode(u.inner) : null };
};
const attr = (el, a) => { const m = el.attrs.match(new RegExp(`\\s${a}="([^"]*)"`)); return m ? m[1] : null; };
const numAttr = (el, a) => { const v = attr(el, a); return v === null ? null : Number(v); };

function markup(item) {
  const { el } = item;
  const bd = kids(el).find((k) => k.cls === 'inst-bd');
  const hd = kids(el).find((k) => k.cls === 'inst-hd');
  const nm = kids(hd).find((k) => k.cls === 'nm');
  const iid = kids(hd).find((k) => k.cls === 'id');
  const intro = kids(bd).find((k) => k.cls === 'inst-intro');
  const disc = kids(bd).find((k) => k.cls === 'disc');
  const entradas = [];
  for (const f of findAll(bd, (k) => k.cls === 'field')) {
    const ins = kids(f).filter((k) => k.tag === 'input');
    const nIn = ins.find((x) => attr(x, 'type') === 'number');
    const rIn = ins.find((x) => attr(x, 'type') === 'range');
    const lb = label(f);
    const par = (x) => x && ({ id: attr(x, 'id'), padrao: numAttr(x, 'value'), min: numAttr(x, 'min'), max: numAttr(x, 'max'), step: numAttr(x, 'step') });
    const pn = par(nIn); const pr = par(rIn);
    entradas.push({
      id: pn.id, id_range: pr ? pr.id : null, tipo: rIn ? 'number+range' : 'number', ...lb,
      padrao: pn.padrao, min: pn.min, max: pn.max, step: pn.step,
      faixa_igual_no_range: pr ? (pr.padrao === pn.padrao && pr.min === pn.min && pr.max === pn.max && pr.step === pn.step) : null,
      lido_pelo_script: pr ? pr.id : pn.id,
      origem: origem(`input#${pn.id}`, `${lb.rotulo} ${lb.unidade || ''}`, f.start),
    });
  }
  const segs = findAll(bd, (k) => k.cls === 'seg').map((sg) => {
    const lbEl = (() => { const sib = kids(bd).concat(findAll(bd, () => true)); const i = sib.findIndex((x) => x.start === sg.start); for (let j = i - 1; j >= 0; j--) if (sib[j].cls === 'seg-lb') return sib[j]; return null; })();
    const bts = kids(sg).filter((k) => k.tag === 'button');
    return {
      id: sg.id, tipo: 'segmentado (botões)', rotulo: lbEl ? decode(lbEl.inner) : null,
      opcoes: bts.map((b) => ({ valor: attr(b, 'data-r') ?? attr(b, 'data-v'), texto: decode(b.inner), padrao: /class="on"/.test(b.attrs) })),
      origem: origem(`div.seg#${sg.id}`, bts.map((b) => b.inner).join(' '), sg.start),
    };
  });
  const readouts = findAll(bd, (k) => k.cls === 'ro').map((ro) => {
    const k = kids(ro).find((x) => x.cls === 'k'); const n = kids(ro).find((x) => x.cls.startsWith('n'));
    return { id: n.id, rotulo: decode(k.inner), classe: n.cls, origem: origem(`.readout #${n.id}`, k.inner, ro.start) };
  });
  const legenda = findAll(bd, (k) => k.cls === 'chart-legend').flatMap((lg) => kids(lg).map((s) => ({ texto: texto(s.inner), cor: (s.inner.match(/background:(#[0-9A-Fa-f]+)/) || [])[1] })));
  const chain = findAll(bd, (k) => k.cls.startsWith('cbox')).map((cb) => {
    const ks = kids(cb); return { id: ks[1].id, rotulo: decode(ks[0].inner), origem: origem(`.chain .${cb.cls.replace(' ', '.')}`, ks[0].inner, cb.start) };
  });
  const tlPanel = find(bd, (k) => k.cls === 'tl-panel');
  const painel = tlPanel ? {
    campos: ['t1-yr', 't1-ti', 't1-bd', 't1-lg'],
    rotulo_legado: decode(find(tlPanel, (k) => k.cls === 'lg').inner.match(/<b>(.*?)<\/b>/)[1]),
    botoes: findAll(tlPanel, (k) => k.tag === 'button').map((b) => ({ id: b.id, texto: decode(b.inner) })),
    origem: origem('.tl-panel', tlPanel.inner, tlPanel.start),
  } : null;
  const graficos = findAll(bd, (k) => k.tag === 'svg' || k.cls === 'bars' || k.cls === 'gcmp' || k.cls === 'tr-grid' || k.cls === 'tl-chips')
    .map((g) => ({ elemento: g.tag === 'svg' ? `svg#${g.id}` : `div.${g.cls}#${g.id}`, viewBox: attr(g, 'viewBox'), linha_aprox: g.linha }));
  const verdictEl = find(bd, (k) => k.cls === 'verdict');
  return {
    id_fonte: decode(iid.inner), titulo: decode(nm.inner),
    origem: origem('div.inst > .inst-hd', nm.inner, el.start),
    intro: { html: inl(intro.inner), texto: texto(intro.inner), origem: origem('.inst-intro', intro.inner, intro.start) },
    entradas, controles_segmentados: segs, saidas_markup: readouts, painel, cadeia: chain,
    legenda_grafico: legenda, graficos,
    veredito_id: verdictEl ? verdictEl.id : null,
    disc: { html: inl(disc.inner), texto: texto(disc.inner), origem: origem('p.disc', disc.inner, disc.start) },
  };
}
function findLineEnd(el) { return html.slice(0, el.end).split('\n').length; }

// ── 2. script ────────────────────────────────────────────────
const SCRIPT_START = LINES.findIndex((l) => l.trim() === '<script>') + 1; // linha do <script>
const SCRIPT_END = LINES.findIndex((l) => l.trim() === '</script>') + 1;
const blocoIni = (n) => LINES.findIndex((l) => new RegExp(`^\\s*INST 0${n} — `).test(l)) + 1; // linha do título do bloco
const nextHeader = (from) => { for (let i = from; i < SCRIPT_END; i++) if (/^\/\* (=====|---------- 3 N)/.test(LINES[i])) return i; return SCRIPT_END; };
const lit = (n) => ({ linha: n, codigo: LINES[n - 1].trim() });
const DRAW = /^(var s=gridY|var out=gridY|var html='';|var s='';|var s='',i,x,y=84;)/;
function scriptInfo(n) {
  const hdr = blocoIni(n);
  const a = hdr + 2; const b = nextHeader(hdr + 2); // [a, b)
  const linhas = []; for (let i = a; i <= b; i++) linhas.push(i);
  const constantes = linhas.filter((i) => /^\s*var (R|NMAX|BASE|FLOOR|RES|Y0|Y1|KEYS|ERA|grupo|cur)\b|^\s*var (R|NMAX|BASE|FLOOR|RES)=/.test(LINES[i - 1])).map(lit);
  const helpers = []; let inRun = false; const calculo = []; let drawSeen = false;
  for (const i of linhas) {
    const t = LINES[i - 1].trim();
    if (/^function run\(\)\{/.test(t)) { inRun = true; drawSeen = false; continue; }
    if (inRun) {
      if (DRAW.test(t)) drawSeen = true;
      if (!drawSeen && t && !/^var v=\$id/.test(t)) calculo.push(lit(i));
      if (/^\$id\('i\d-[a-z0-9]+'\)\.(textContent|innerHTML)=/.test(t) && !/svg'\)/.test(t) && !/bars'\)/.test(t)) calculo.push({ ...lit(i), papel: 'atribuicao_de_saida' });
    } else if (/^function (fator|cob|falta|sobra|thr|norma|elig|yk|xy|grid|bar)\b/.test(t)) {
      let j = i; const body = []; let bal = 0;
      do { const Ln = LINES[j - 1]; bal += (Ln.match(/\{/g) || []).length - (Ln.match(/\}/g) || []).length; body.push(lit(j)); j++; } while (bal > 0 && j <= b);
      helpers.push({ nome: t.match(/^function (\w+)/)[1], linhas: body });
    }
  }
  const ramos = linhas.filter((i) => /vd\(v,'/.test(LINES[i - 1])).map((i) => {
    const t = LINES[i - 1].trim();
    const m = t.match(/^(?:\}?\s*)?((?:else\s+)?if\s*\((.*?)\)\s*|else\s+)?vd\(v,'(\w+)',([\s\S]*)\);$/);
    let bal = 0; let ctx = null;
    for (let j = i - 1; j >= a && !ctx; j--) {
      const Lj = LINES[j - 1];
      for (let c = Lj.length - 1; c >= 0; c--) {
        if (Lj[c] === '}') bal++;
        else if (Lj[c] === '{' && --bal < 0) { ctx = { linha: j, codigo: Lj.trim() }; break; }
      }
    }
    return { linha: i, dentro_de: ctx && !/^function run\(\)/.test(ctx.codigo) ? ctx : null, condicao_literal: m && m[1] ? m[1].trim() : null, ...(m && !m[1] ? { condicao_nota: 'sem condição própria na linha; a condição é o bloco em dentro_de' } : {}), classe: m ? m[3] : null, expressao_literal: m ? m[4] : t, texto_template: m ? template(m[4]) : null };
  });
  return { bloco_linhas: [hdr, b], constantes, helpers, calculo, ramos };
}
/** JS concat → template legível: literais entre aspas ficam, expressões viram {expr}. */
function template(expr) {
  const parts = []; let depth = 0; let q = null; let cur = '';
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (q) { cur += ch; if (ch === '\\') { cur += expr[++i]; continue; } if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"') { q = ch; cur += ch; continue; }
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === '+' && depth === 0) { parts.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur.trim());
  return parts.map((p) => (/^'(?:[^'\\]|\\.)*'$/.test(p) ? vm.runInNewContext(p) : `{${p}}`)).join('');
}

// ── 3. harness: script original em DOM simulado ──────────────
function makeEnv() {
  const els = new Map();
  const mk = (id, tag = 'div', attrs = '') => {
    const e = {
      id, tagName: tag.toUpperCase(), value: (attrs.match(/\svalue="([^"]*)"/) || [])[1] ?? '',
      min: (attrs.match(/\smin="([^"]*)"/) || [])[1], max: (attrs.match(/\smax="([^"]*)"/) || [])[1],
      className: (attrs.match(/class="([^"]*)"/) || [])[1] || '', textContent: '', style: {}, _l: {}, _ih: '', _cache: null, _static: null,
      addEventListener(t, fn) { (this._l[t] ||= []).push(fn); },
      fire(t) { for (const fn of this._l[t] || []) fn.call(this, {}); },
      getAttribute(a) { return (this._attrs.match(new RegExp(`\\s${a}="([^"]*)"`)) || [])[1] ?? null; },
      scrollIntoView() {},
      _attrs: attrs,
      get innerHTML() { return this._ih; }, set innerHTML(v) { this._ih = v; this._cache = null; },
      querySelectorAll() {
        const src = this._static ?? this._ih;
        if (this._cache && this._cache.src === src) return this._cache.list;
        const list = [...src.matchAll(/<button([^>]*)>/g)].map((m, i) => mk(`${id}#btn${i}`, 'button', m[1]));
        this._cache = { src, list }; return list;
      },
    };
    els.set(id, e); return e;
  };
  const corpo = html.slice(0, html.indexOf('<script>'));
  for (const m of corpo.matchAll(/<(\w+)(\s[^>]*?\bid="([^"]+)"[^>]*)>/g)) {
    const e = mk(m[3], m[1], m[2]);
    if (/class="seg"/.test(m[2])) { const end = html.indexOf('</div>', m.index); e._static = html.slice(m.index, end); }
  }
  const hits = [];
  const checked = {};
  const document = {
    getElementById: (id) => els.get(id) || mk(id),
    querySelectorAll: () => [],
    querySelector: (sel) => { const n = (sel.match(/name="(qq\d+)"/) || [])[1]; return n in checked ? { value: String(checked[n]) } : null; },
    documentElement: { scrollHeight: 0, clientHeight: 0, scrollTop: 0 }, body: { scrollTop: 0 },
  };
  const window = { addEventListener() {} };
  let code = LINES.slice(SCRIPT_START, SCRIPT_END - 1).map((l, k) => l.replace(/vd\(v,'/g, `__vd(${SCRIPT_START + k + 1},v,'`)).join('\n');
  code = code.replace('function vd(el,cls,txt){', 'function __vd(L,a,b,c){__hit(L);vd(a,b,c);}\nfunction vd(el,cls,txt){');
  const ctx = vm.createContext({ document, window, __hit: (L) => hits.push(L), console });
  vm.runInContext(code, ctx);
  const get = (id) => els.get(id);
  return {
    get, hits, checked,
    set(id, v) { const e = get(id); e.value = String(v); e.fire('input'); },
    click(containerId, value, attrName) { const c = get(containerId); const b = c.querySelectorAll().find((x) => x.getAttribute(attrName) === String(value)); b.fire('click'); },
    out(id) { const e = get(id); return { textContent: e.textContent, innerHTML: e._ih, texto: e._ih ? texto(e._ih) : e.textContent }; },
    verdict(id) { const e = get(id); return { classe: e.className, texto: e.textContent, ramo_linha: hits[hits.length - 1] }; },
  };
}

// ── 4. porte: comparação com as calculadoras do código ───────
const parseBR = (s) => {
  const t = s.replace(/<[^>]+>.*$/, '').trim();
  let m = t.match(/^R\$ ([\d.,-]+) (bi|mi)$/); if (m) return Number(m[1].replace(/\./g, '').replace(',', '.')) * (m[2] === 'bi' ? 1000 : 1);
  m = t.match(/^([+-]?[\d.]*\d(?:,\d+)?)%?$/); if (m) return Number(m[1].replace(/\./g, '').replace(',', '.'));
  return null;
};
const casas = (s) => { const t = s.replace(/<[^>]+>.*$/, '').replace(/%$/, '').replace(/ (bi|mi)$/, ''); const m = t.match(/,(\d+)$/); return m ? m[1].length : 0; };
// Formatadores LITERAIS da fonte (L1523-1528), avaliados em vm; o formatador de cada saída é lido
// da linha de atribuição do script (ex.: `$id('i6-ac').textContent=mmi(acum);`).
const FMT = vm.runInNewContext(LINES.slice(1522, 1528).join('\n') + '\n({num, pct, mmi})');
function fmtCodigo(oid, v) {
  const L = LINES.find((l) => l.includes(`$id('${oid}').`) && /(textContent|innerHTML)=/.test(l)).trim();
  if (/d<=0\?\('\+'\+num\(-d,2\)\)/.test(L)) return v <= 0 ? '+' + FMT.num(-v, 2) : FMT.num(v, 2);
  const m = L.match(/=(?:\()?\s*(pct|num|mmi)\([^,()]*(?:\([^)]*\))?[^,()]*(?:,(\d))?\)/);
  if (!m) return null;
  if (m[1] === 'mmi') return FMT.mmi(v);
  return m[1] === 'pct' ? FMT.pct(v, m[2] === undefined ? undefined : Number(m[2])) : FMT.num(v, m[2] === undefined ? undefined : Number(m[2]));
}
let seed = 20260917; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const pick = (f) => f.min + Math.floor(rnd() * (Math.floor((f.max - f.min) / f.step) + 1)) * f.step;
const round = (v, s) => Math.round(v / s) * s;

function portar(n, mk, sc) {
  const idCod = `m06-inst-${pad(n)}`;
  const obj = INSTS_COD.find((x) => x.id === idCod);
  const calc = CALC[idCod];
  const motivos = [];
  const res = { id_codigo: idCod, existe_objeto: !!obj, existe_calculadora: !!calc, kind_codigo: obj?.kind ?? null };
  if (!obj) return { ...res, status: 'não portado' };
  res.titulo_codigo = obj.title; res.titulo_igual = obj.title === mk.titulo;
  if (!res.titulo_igual) motivos.push(`título difere: código "${obj.title}" × fonte "${mk.titulo}"`);
  res.formula_codigo = obj.formula; res.note_codigo = obj.note;
  if (obj.note) motivos.push('note do código não é texto da fonte (paráfrase)');
  motivos.push('inst-intro e p.disc da fonte não estão no objeto (note/formula null ou outro texto); varredura de src/: zero');
  // campos
  res.campos = mk.entradas.map((e) => {
    const f = obj.fields.find((x) => x.id === e.id);
    if (!f) return { id: e.id, status: 'ausente no código' };
    const d = {};
    for (const [a, b] of [['label', 'rotulo'], ['unit', 'unidade'], ['defaultValue', 'padrao'], ['min', 'min'], ['max', 'max'], ['step', 'step']]) if (f[a] !== e[b]) d[a] = { codigo: f[a], fonte: e[b] };
    return { id: e.id, status: Object.keys(d).length ? 'divergente' : 'igual', kind_codigo: f.kind, ...(Object.keys(d).length ? { diferencas: d } : {}) };
  });
  const extras = obj.fields.filter((f) => !mk.entradas.some((e) => e.id === f.id));
  res.campos_so_no_codigo = extras.map((f) => ({ id: f.id, label: f.label, kind: f.kind, opcoes: f.options?.length ?? null }));
  if (res.campos.some((c) => c.status !== 'igual')) motivos.push('campo(s) divergente(s) ou ausente(s)');
  if (mk.controles_segmentados.length) motivos.push(`controle(s) segmentado(s) da fonte sem campo no código: ${mk.controles_segmentados.map((s) => s.id).join(', ')}`);
  // saídas
  res.saidas = mk.saidas_markup.map((s) => {
    const o = obj.outputs.find((x) => x.id === s.id);
    return { id: s.id, rotulo_fonte: s.rotulo, status: o ? (o.label === s.rotulo ? 'portada' : 'rótulo divergente') : 'não portada', ...(o ? { unit_codigo: o.unit } : {}) };
  });
  const naoPort = res.saidas.filter((s) => s.status !== 'portada');
  if (naoPort.length) motivos.push(`saída(s) sem valor no código: ${naoPort.map((s) => s.id).join(', ')} (texto na fonte ou não portada)`);
  // equivalência numérica e de veredito
  if (calc && sc) {
    const r = sc(calc, obj);
    Object.assign(res, { prova: r });
    if (r.falhas_veredito || r.falhas_numericas) motivos.push(`prova: ${r.falhas_veredito} veredito(s) e ${r.falhas_numericas} saída(s) numérica(s) diferentes em ${r.casos} casos`);
    if (r.ramos_fonte_nao_alcancaveis?.length) motivos.push(`ramos da fonte inalcançáveis pela porta: linhas ${r.ramos_fonte_nao_alcancaveis.join(', ')}`);
  }
  const grave = (res.prova && (res.prova.falhas_veredito || res.prova.falhas_numericas || res.prova.ramos_fonte_nao_alcancaveis?.length)) || !res.titulo_igual || mk.controles_segmentados.length || res.campos.some((c) => c.status !== 'igual');
  res.status = grave ? 'divergente' : 'portado';
  res.status_nota = grave ? 'Portado com diferença material (ver motivos).' : 'Cálculo e veredito equivalentes à fonte no espaço testado; diferenças só de apresentação (ver motivos).';
  res.motivos = motivos;
  return res;
}

/** Prova genérica para os simuladores numéricos (2, 3, 4, 6). */
function provaNumerica(n, mk, extra = {}) {
  return (calc) => {
    const env = makeEnv();
    const casos = [];
    const def = Object.fromEntries(mk.entradas.map((e) => [e.id, e.padrao]));
    casos.push(def, Object.fromEntries(mk.entradas.map((e) => [e.id, e.min])), Object.fromEntries(mk.entradas.map((e) => [e.id, e.max])));
    for (let k = 0; k < (extra.n ?? 3000); k++) casos.push(Object.fromEntries(mk.entradas.map((e) => [e.id, pick(e)])));
    let fv = 0; let fn = 0; const ramos = new Set(); const exemplos = [];
    for (const cs of casos) {
      for (const e of mk.entradas) env.get(e.lido_pelo_script).value = String(cs[e.id]);
      env.get(mk.entradas[0].lido_pelo_script).fire('input');
      const vdS = env.verdict(mk.veredito_id); ramos.add(vdS.ramo_linha);
      const r = calc(cs);
      if (r.veredito !== vdS.texto) { fv++; if (exemplos.length < 3) exemplos.push({ entrada: cs, fonte: vdS.texto.slice(0, 120), codigo: String(r.veredito).slice(0, 120) }); }
      for (const [oid, v] of Object.entries(r.valores)) {
        const s = (env.out(oid).innerHTML || env.out(oid).textContent).replace(/<span[\s\S]*$/, '');
        const f = fmtCodigo(oid, v);
        if (f !== s) { fn++; if (exemplos.length < 6) exemplos.push({ entrada: cs, saida: oid, fonte: s, codigo_formatado_pela_fonte: f, codigo: v }); }
      }
    }
    const todos = mk.__ramos.map((x) => x.linha);
    return { metodo: 'script original em DOM simulado × calculadora do bundle, mesmas entradas', casos: casos.length, falhas_veredito: fv, falhas_numericas: fn, ramos_disparados_na_fonte: [...ramos].sort(), ramos_nao_exercitados: todos.filter((l) => !ramos.has(l)), exemplos_de_falha: exemplos };
  };
}

// ── 5. montar os 8 ───────────────────────────────────────────
const env0 = makeEnv(); // estado inicial do script (cenário-padrão)
const MENCOES = [];
for (let i = 296; i <= 1517; i++) {
  const t = LINES[i - 1];
  if (/class="(id|nm)"/.test(t)) continue;
  for (const m of t.matchAll(/instrumento (abaixo|acima)|linha do tempo abaixo|instrumento da Aula \d\d|Inst ?· ?0\d/g)) MENCOES.push({ linha: i, trecho: m[0], contexto: texto(t).slice(Math.max(0, texto(t).indexOf(m[0].replace(/ ?· ?/, ' · ')) - 60), texto(t).indexOf(m[0].replace(/ ?· ?/, ' · ')) + 60) || ini(t, 120) });
}
for (let i = SCRIPT_START; i <= SCRIPT_END; i++) for (const m of LINES[i - 1].matchAll(/Inst·0(\d)/g)) MENCOES.push({ linha: i, trecho: m[0], contexto: 'feedback do quiz: ' + LINES[i - 1].trim().slice(0, 80) });

const instrumentos = instEls.map((it, idx) => {
  const n = idx + 1;
  const mk = markup(it);
  const si = scriptInfo(n);
  mk.__ramos = si.ramos;
  const inicio = mk.origem.linha_aprox; const fim = findLineEnd(it.el);
  const prev = instEls[idx - 1]; const next = instEls[idx + 1];
  const anterior = (() => { const i = it.irmaos.findIndex((k) => k.start === it.el.start); for (let j = i - 1; j >= 0; j--) if (['p', 'div'].includes(it.irmaos[j].tag) && !it.irmaos[j].cls.startsWith('sec')) return it.irmaos[j]; return null; })();
  const invocacoes = MENCOES.filter((mm) => {
    if (/Inst ?· ?0(\d)|Inst·0(\d)/.test(mm.trecho)) return Number(mm.trecho.slice(-1)) === n;
    if (/abaixo/.test(mm.trecho)) { const alvo = instEls.find((x) => x.el.linha > mm.linha); return alvo === it; }
    if (/acima/.test(mm.trecho)) { const alvo = [...instEls].reverse().find((x) => x.el.linha < mm.linha); return alvo === it; }
    if (/instrumento da Aula 06/.test(mm.trecho)) return n === 7 || n === 8;
    return false;
  }).map((mm) => ({ ...mm, ...(/instrumento da Aula 06/.test(mm.trecho) ? { ambiguo: true, nota: 'A Aula 06 tem dois instrumentos (07 e 08); a fonte não diz qual. O contexto (limiar de elegibilidade) sugere o 07.' } : {}) }));
  // cenário-padrão lido do script original
  const cen = {
    entradas: Object.fromEntries(mk.entradas.map((e) => [e.id, e.padrao])),
    controles: Object.fromEntries(mk.controles_segmentados.map((s) => [s.id, s.opcoes.find((o) => o.padrao)?.texto ?? null])),
    saidas: Object.fromEntries(mk.saidas_markup.map((s) => { const o = env0.out(s.id); return [s.id, { rotulo: s.rotulo, exibido_html: o.innerHTML || null, exibido_texto: o.texto }]; })),
    veredito: mk.veredito_id ? (() => { const v = env0.verdict(mk.veredito_id); return { classe: v.classe, texto: v.texto }; })() : null,
    nota: 'Lido do script original executado em DOM simulado no carregamento (sem interação). O texto inicial "—" do markup é sobrescrito na carga.',
  };
  if (mk.cadeia.length) cen.cadeia = Object.fromEntries(mk.cadeia.map((c) => [c.rotulo, env0.get(c.id).textContent]));
  if (mk.painel) cen.painel = Object.fromEntries(mk.painel.campos.map((c) => [c, env0.get(c).textContent]));
  if (n === 5) cen.grade = texto(env0.get('i5-grid').innerHTML.replace(/<\/div>/g, ' | '));
  return {
    id: `m06-inst-${pad(n)}`, n, id_fonte: mk.id_fonte, titulo: mk.titulo,
    secao: it.secMarcador, aula: /^Aula/.test(it.secMarcador) ? it.secMarcador : null,
    aula_id_codigo: /^Aula/.test(it.secMarcador) ? `aula-06-${it.secMarcador.slice(5)}` : null,
    de_modulo: it.sid === 'map',
    linhas_markup: [inicio, fim],
    pergunta: null,
    pergunta_nota: 'O instrumento não declara pergunta própria; `intro` é instrução de uso. Pergunta de previsão seria camada Alexandria (P3/P11/P19).',
    intro: mk.intro,
    entradas: mk.entradas, controles_segmentados: mk.controles_segmentados,
    saidas: mk.saidas_markup.map((s) => ({ ...s, atribuicao_script: si.calculo.find((c) => c.papel === 'atribuicao_de_saida' && c.codigo.includes(`'${s.id}'`)) || null })),
    painel: mk.painel, cadeia: mk.cadeia,
    script: { bloco_linhas: si.bloco_linhas, constantes: si.constantes, funcoes_auxiliares: si.helpers, formula_exata_script: si.calculo.filter((c) => !c.papel), formatadores: [1523, 1524, 1525, 1526, 1527].map(lit) },
    textos_leitura: { veredito_id: mk.veredito_id, ramos: si.ramos, nota: 'expressao_literal é o JS da fonte; texto_template é o mesmo texto com as expressões entre chaves (conversão mecânica). A classe (ok/att/per) é a cor do veredito na fonte.' },
    grafico: { elementos: mk.graficos, legenda: mk.legenda_grafico, nota: 'Desenho não porta (protocolo §12); o conteúdo textual está nas saídas e no veredito.' },
    cenario_padrao: cen,
    fonte_dos_numeros: {
      disc: mk.disc,
      fonte_externa_declarada: n === 7 ? 'Portarias MME nº 514/2018 e nº 465/2019; Portaria Normativa nº 50/GM/MME/2022; Lei nº 15.269/2025; Lei nº 9.074/1995 (citadas no disc)' : n === 1 ? 'Datas dos marcos legais: "norma de origem indicada em §Ref" (disc)' : null,
      nota: n === 7 || n === 1 ? 'A fonte aponta normas, não dados numéricos medidos.' : 'Cenário didático; o disc declara os parâmetros do modelo e nega representar caso real. Fonte externa dos valores não declarada (P19).',
    },
    tolerancias: null,
    tolerancias_nota: 'A fonte não declara tolerância nem resposta esperada.',
    invocacao: {
      ponto_no_texto: anterior ? { tipo: anterior.cls || anterior.tag, trecho_final: texto(anterior.inner).slice(-160), origem: origem('elemento imediatamente anterior ao div.inst', anterior.inner, anterior.start) } : null,
      mencoes: invocacoes,
    },
    _mk: mk,
  };
});

// Linha do tempo e trauma: arrays literais do script
const arr = (nome, n) => { const hdr = blocoIni(n); const a = LINES.findIndex((l, i) => i >= hdr && new RegExp(`^\\s*var ${nome}=\\[`).test(l)); const b = LINES.findIndex((l, i) => i > a && /^\s*\];\s*$/.test(l)); return { valor: vm.runInNewContext('(' + LINES.slice(a, b + 1).join('\n').replace(new RegExp(`^\\s*var ${nome}=`), '').replace(/;\s*$/, '') + ')'), linhas: [a + 1, b + 1] }; };
const M = arr('M', 1); const T = arr('T', 8); const REG = arr('REG', 5);
const KEYS = vm.runInNewContext('(' + LINES[LINES.findIndex((l) => /^\s*var KEYS=/.test(l))].trim().replace(/^var KEYS=/, '').replace(/;$/, '') + ')');
const ERA = LINES.findIndex((l) => /^\s*var ERA=/.test(l)) + 1;
instrumentos[0].dados_script = { marcos: M.valor.map((x, i) => ({ ordem: i + 1, ano: x.y, titulo: x.t, corpo: x.b, cicatriz: x.l })), linhas: M.linhas, eras: lit(ERA), chaves: { y: 'ano (rótulo do chip e t1-yr)', t: 't1-ti', b: 't1-bd', l: 't1-lg "Cicatriz que ainda opera hoje"' }, eixo_svg: lit(LINES.findIndex((l) => l.includes('eixo sequencial ·')) + 1) };
instrumentos[7].dados_script = { pressoes: T.valor.map((x, i) => ({ ordem: i + 1, periodo: x.y, titulo: x.t, problema: x.p, resposta: x.r, cicatriz: x.c, risco_novo: x.n })), linhas: T.linhas };
instrumentos[4].dados_script = { regimes: REG.valor.map((r, i) => ({ indice: i, nome: r.n, F0: r.F0, S0: r.S0, respostas: Object.fromEntries(KEYS.map((k, j) => [k, r.r[j]])), horizonte_efetivo: r.h })), linhas: REG.linhas, chaves: KEYS, rotulo_extra: 'Horizonte efetivo no período' };

// ── 6. provas por instrumento ────────────────────────────────
const byN = (n) => instrumentos[n - 1];
const provas = {
  2: provaNumerica(2, byN(2)._mk), 3: provaNumerica(3, byN(3)._mk), 4: provaNumerica(4, byN(4)._mk), 6: provaNumerica(6, byN(6)._mk),
  5: (calc) => { // horizonte 0..6 × regime; o código só tem regime 0
    const env = makeEnv(); let fv = 0; let fn = 0; const ramos = new Set(); const ramosOutros = new Set(); const ex = [];
    for (let reg = 0; reg < 3; reg++) {
      env.click('i5-seg', reg, 'data-r');
      for (let h = 0; h <= 6; h++) {
        env.set('i5-h', h); const v = env.verdict('i5-vd');
        if (reg === 0) {
          ramos.add(v.ramo_linha); const r = calc({ 'i5-h-n': h });
          if (r.veredito !== v.texto) { fv++; ex.push({ h, fonte: v.texto.slice(0, 80), codigo: r.veredito.slice(0, 80) }); }
          for (const [oid, val] of Object.entries(r.valores)) { const p = parseBR(env.out(oid).textContent); if (Math.round(val) !== p) fn++; }
        } else ramosOutros.add(`${reg}:${v.ramo_linha}`);
      }
    }
    return { metodo: 'script original (3 regimes × 7 horizontes, espaço inteiro) × calculadora (só regime 0)', casos: 21, casos_comparaveis: 7, falhas_veredito: fv, falhas_numericas: fn, ramos_disparados_na_fonte: [...ramos].sort(), ramos_fonte_nao_alcancaveis: [], regimes_nao_alcancaveis_na_porta: ['1995–2003 · reforma em transição', '2004– · híbrido'], saidas_regimes_1_2: 'os 14 cenários dos regimes 1 e 2 (vereditos com "Regime …" diferente, F0/S0 diferentes, grade de 8 linhas) não existem no código', exemplos_de_falha: ex };
  },
  7: (calc) => { // ano × carga; código só grupo A / convencional
    const env = makeEnv(); let fv = 0; const ramos = new Set(); const todosRamos = new Set(); const ex = []; let casos = 0; let fnum = 0;
    const cargas = []; for (let k = 5; k <= 5000; k += 5) cargas.push(k);
    for (const [g, f] of [[0, 0], [0, 1], [1, 0], [1, 1]]) {
      env.click('i7-seg-g', g, 'data-v'); env.click('i7-seg-f', f, 'data-v');
      for (let y = 1995; y <= 2028; y++) for (const k of (g === 0 && f === 0 ? cargas : [5, 499, 500, 800, 5000])) {
        env.get('i7-k').value = String(k); env.set('i7-y', y); const v = env.verdict('i7-vd'); todosRamos.add(v.ramo_linha);
        if (g === 0 && f === 0) {
          casos++; ramos.add(v.ramo_linha);
          const r = calc({ 'i7-y-n': y, 'i7-k-n': k });
          if (r.veredito !== v.texto) { fv++; if (ex.length < 3) ex.push({ y, k, fonte: v.texto.slice(0, 90), codigo: r.veredito.slice(0, 90) }); }
          if (Object.keys(r.valores).length) fnum++;
        }
      }
    }
    return { metodo: 'script original (grupo×fonte × 34 anos × cargas; espaço inteiro de carga no ramo padrão) × calculadora (só grupo A + convencional)', casos, falhas_veredito: fv, falhas_numericas: fnum, ramos_disparados_na_fonte: [...ramos].sort(), ramos_fonte_nao_alcancaveis: [...todosRamos].filter((l) => !ramos.has(l)).sort(), exemplos_de_falha: ex };
  },
  8: (calc) => {
    const env = makeEnv(); let fv = 0; let fc = 0;
    for (let i = 0; i < 11; i++) {
      env.get('i8-grid').querySelectorAll()[i].fire('click');
      const v = env.verdict('i8-vd'); const r = calc({ 'i8-sel': String(i) });
      const [cadeia, fecho] = r.veredito.split('\n\n');
      if (fecho !== v.texto) fv++;
      const vals = ['i8-p', 'i8-r', 'i8-c', 'i8-n'].map((id) => env.get(id).textContent);
      if (!vals.every((x) => cadeia.includes(x))) fc++;
    }
    return { metodo: 'script original (11 seleções, espaço inteiro) × calculadora', casos: 11, falhas_veredito: fv, falhas_numericas: 0, falhas_cadeia: fc, ramos_fonte_nao_alcancaveis: [], apresentacao: 'código junta período·título e os 4 quadros num único veredito com rótulos "Problema revelado:" etc. (rótulos literais dos .ck2)' };
  },
  1: (calc) => {
    const env = makeEnv(); let fc = 0; const ex = [];
    for (let i = 0; i < 14; i++) {
      env.get('t1-chips').querySelectorAll()[i].fire('click');
      const p = ['t1-yr', 't1-ti', 't1-bd', 't1-lg'].map((id) => env.get(id).textContent);
      const r = calc({ 'm06-i1-sel': String(i) });
      if (!p.every((x) => r.veredito.includes(x))) { fc++; if (ex.length < 2) ex.push({ i, fonte: p.map((x) => x.slice(0, 40)) }); }
    }
    return { metodo: 'script original (14 marcos, espaço inteiro) × calculadora', casos: 14, falhas_veredito: 0, falhas_numericas: 0, falhas_painel: fc, rotulo_codigo: '"<b>O que ficou</b> —"', rotulo_fonte: '"Cicatriz que ainda opera hoje"', navegacao_fonte: 'chips + botões "◄ Marco anterior" / "Próximo marco ►" + SVG', navegacao_codigo: 'select "Marco"', exemplos_de_falha: ex };
  },
};
for (const it of instrumentos) {
  const r = portar(it.n, it._mk, provas[it.n]);
  if (it.n === 1 && r.status === 'portado') r.status = 'divergente';
  if (it.n === 1) r.motivos.push('rótulo do legado trocado ("O que ficou" × "Cicatriz que ainda opera hoje"); campo "Marco" e note são do código');
  if (it.n === 8) r.motivos.push('campo "Pressão histórica" é rótulo do código (a fonte usa grade de chips sem rótulo)');
  if (it.n === 4) r.motivos.push('i4-qm: a fonte exibe "+x p.p./mês · recompõe" quando d≤0; o código devolve d negativo sem o rótulo');
  if (it.n === 7) r.motivos.push('Grupo B (baixa tensão) e fonte incentivada: toggles não portados; thr/norma do código só têm o ramo padrão; "· prazo legal" do ano de elegibilidade não existe no código');
  if (it.n === 5) r.motivos.push('seletor de regime (3 botões) e grade das seis perguntas da régua (7 linhas + horizonte efetivo) não portados; o código fixa o regime 0');
  it.comparacao_codigo = r;
  delete it._mk;
}

// ── 7. resíduos do original (sinalizados, não corrigidos) ────
const envR = makeEnv();
envR.get('i4-e').value = '100'; envR.get('i4-a').value = '140'; envR.get('i4-m').value = '30'; envR.set('i4-t', 12);
const r4 = { nf: envR.out('i4-nf').textContent, qm: envR.out('i4-qm').innerHTML, ms: envR.out('i4-ms').textContent };
envR.get('i4-e').value = '10'; envR.get('i4-a').value = '140'; envR.get('i4-m').value = '30'; envR.set('i4-t', 1);
const r4b = { ms: envR.out('i4-ms').textContent };
envR.click('i7-seg-g', 1, 'data-v'); envR.get('i7-k').value = '5'; envR.set('i7-y', 2027);
const r7 = { st: envR.out('i7-st').textContent, vd: envR.verdict('i7-vd').texto.slice(0, 110) };
const residuos = [
  { instrumento: 'Inst · 04', linha: LINES.findIndex((l) => l.includes("$id('i4-nf').textContent")) + 1, descricao: `"Nível final sem corte" não é limitado a 100%: com armazenamento 100, afluência 140, margem 30 e 12 meses o readout mostra "${r4.nf}" (o gráfico limita a 100).`, exibido: r4 },
  { instrumento: 'Inst · 04', linha: LINES.findIndex((l) => l.includes("if(d<=0.0001) ms='não atinge'")) + 1, descricao: `"Meses até o limite" testa d≤0 antes de E≤15: com armazenamento 10 (abaixo do limite) e balanço positivo mostra "${r4b.ms}", não "já abaixo".`, exibido: r4b },
  { instrumento: 'Inst · 04', linha: LINES.findIndex((l) => l.includes('var extra=Math.max(0,(8-Mg))*0.25;')) + 1, descricao: 'Os parâmetros 8 (% de margem de referência) e 0,25 (p.p. por ponto faltante) não estão no disc, que só diz "converte margem firme faltante em consumo adicional de reservatório".' },
  { instrumento: 'Inst · 05', linha: REG.linhas[0], descricao: 'F0/S0 por regime e os expoentes 1,6 e 1,4 (horizontes 7 e 6) não aparecem no disc, que declara "escalas relativas sem unidade".' },
  { instrumento: 'Inst · 07', linha: LINES.findIndex((l) => l.includes('if(g===1) return year>=2027;')) + 1, descricao: `Grupo B: qualquer unidade de baixa tensão aparece "Elegível" em 2027 (status "${r7.st}"), mas o veredito de 2027 e a prosa (6.3) restringem 2027 a consumidores industriais e comerciais. O instrumento não tem controle de classe de consumo.`, exibido: r7 },
  { instrumento: 'Inst · 07', linha: LINES.findIndex((l) => l.includes('if(year>=1996) return 3000;')) + 1, descricao: 'Patamar de 3.000 kW de 1996 a 2018 e 500 kW para incentivada desde 1998: o disc diz que o regime anterior a 2019 "está simplificado", sem citar esses números.' },
  { instrumento: 'Inst · 02', linha: LINES.findIndex((l) => l.includes("for(k=1;k<=60;k++){ if(cob(k,I,Mm,C)<0.5)")) + 1, descricao: '"Anos até cair a 50%" procura até 60 anos, enquanto o gráfico vai até 30 (NMAX) e o campo "Anos desde o investimento" até 30.' },
];

writeJson('instrumentos.json', {
  schema: 'alexandria-v2/extraction/instrumentos@1', modulo: 'M06', grupo: 'instrumentos', camada: 'fonte',
  fonte: fonteMeta, gerado_em: hoje,
  metodo: 'Markup por parser de pilha; script por linha literal; cenário-padrão e prova de porte executando o <script> original em DOM simulado (vm) e comparando, entrada a entrada, com INSTRUMENT_CALCULATORS do bundle esbuild do código (só leitura). O harness só troca `vd(v,` por `__vd(<linha>,v,` para registrar o ramo; a fonte não é alterada. Nenhum texto de conteúdo digitado.',
  convencoes: { linha: 'linha 1-based do HTML-fonte', status: 'portado = cálculo/veredito equivalentes no espaço testado; divergente = diferença material; não portado = ausente', kind_taxonomia: 'ver docs/alexandria/instrument-taxonomy.md' },
  script_linhas: [SCRIPT_START, SCRIPT_END],
  helpers_globais: [1523, 1524, 1525, 1526, 1527, 1528, 1529, 1530, 1531].map(lit),
  link_numero_range: { linhas: [1549, 1560], descricao_literal: LINES.slice(1548, 1560).map((l) => l.trim()), nota: 'O campo number só propaga no evento change e é limitado à faixa do range; o script lê sempre o range.' },
  instrumentos,
  residuos_do_original: residuos,
  kind_taxonomia: Object.fromEntries(instrumentos.map((i) => [i.id_fonte, i.comparacao_codigo.kind_codigo])),
  contagens: {
    instrumentos: instrumentos.length, de_aula: instrumentos.filter((i) => i.aula).length, de_modulo: instrumentos.filter((i) => i.de_modulo).length,
    por_aula: instrumentos.reduce((a, i) => ((a[i.secao] = (a[i.secao] || 0) + 1), a), {}),
    entradas: Object.fromEntries(instrumentos.map((i) => [i.id_fonte, i.entradas.length + i.controles_segmentados.length])),
    saidas: Object.fromEntries(instrumentos.map((i) => [i.id_fonte, i.saidas.length])),
    ramos_de_leitura: Object.fromEntries(instrumentos.map((i) => [i.id_fonte, i.textos_leitura.ramos.length])),
    status: Object.fromEntries(instrumentos.map((i) => [i.id_fonte, i.comparacao_codigo.status])),
    marcos_inst01: M.valor.length, pressoes_inst08: T.valor.length, regimes_inst05: REG.valor.length,
  },
});
