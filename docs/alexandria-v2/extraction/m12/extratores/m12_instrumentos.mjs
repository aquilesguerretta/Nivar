// Extrator dos 11 instrumentos do M12 → instrumentos.json
// Markup: div.inst (balanceado). Script: blocos "INST·NN". Comparação com o
// código por EXECUÇÃO: o <script> original roda em DOM simulado (m12_dom.mjs)
// sobre o espaço de entrada inteiro (ou grade nos dois numéricos) e o texto
// visível é comparado, por palavra, com INSTRUMENT_CALCULATORS['m12-inst-NN'].
import {
  html, all, balanced, hx, texto, inline, origem, lineOf, section, secIdOf, SECOES,
  scriptBlock, scriptVar, scriptFn, pad, writeJson, importTs, fail, SRC,
} from './m12_lib.mjs';
import { runOriginal } from './m12_dom.mjs';

const attrsOf = (s) => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const content = await importTs('alexandria-modulo-12-content.ts');
const calcs = (await importTs('alexandria-instrument-calculators.ts')).INSTRUMENT_CALCULATORS;
const CODE_INST = Object.fromEntries(content.INSTRUMENTOS_MODULO_12.map((i) => [i.id, i]));
const aulaDoInst = {};
for (const a of content.MODULO_12_AULAS) for (const i of a.instruments) aulaDoInst[i.id] = a.id;

// ── markup ───────────────────────────────────────────────────
const blocos = all(/<div class="inst">/g).map(({ idx }) => {
  const end = balanced(idx, 'div');
  return { idx, end, body: html.slice(idx, end) };
});
if (blocos.length !== 11) fail('esperava 11 div.inst, achei ' + blocos.length);

function markup(b) {
  const B = b.body, base = b.idx;
  const at = (re) => { const m = B.match(re); return m ? { m, idx: base + m.index } : null; };
  const id = at(/<span class="id">(.*?)<\/span>/);
  const nm = at(/<span class="nm">(.*?)<\/span>/);
  const intro = at(/<p class="inst-intro">([\s\S]*?)<\/p>/);
  const disc = at(/<p class="disc">([\s\S]*?)<\/p>/);
  const src = at(/<p class="srcnote">([\s\S]*?)<\/p>/);
  // controles em ordem: seg-lb seguido de seg/tr-grid; campos numéricos
  const controles = [];
  for (const m of B.matchAll(/<div class="seg-lb"[^>]*>(.*?)<\/div>\s*<div class="(seg|tr-grid)" id="([^"]+)">([\s\S]*?)<\/div>/g)) {
    const opcoes = [...m[4].matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/g)].map((x) => {
      const a = attrsOf(x[1]); const k = Object.keys(a).find((z) => z.startsWith('data-'));
      return { valor: a[k], atributo: k, rotulo: inline(x[2]), padrao_no_markup: /\bon\b/.test(a.class || '') };
    });
    controles.push({
      id: m[3], rotulo: inline(m[1]), tipo: m[2] === 'seg' ? 'segmentado (botões no markup)' : 'grade de chips (botões gerados pelo script)',
      opcoes: opcoes.length ? opcoes : null,
      origem: origem(base + m.index, `div.inst .seg-lb + div.${m[2]}#${m[3]}`),
    });
  }
  const campos = [];
  for (const m of B.matchAll(/<div class="field">\s*<div class="field-label"><span>(.*?)<\/span><span class="unit">(.*?)<\/span><\/div>\s*<input([^>]*)>\s*(?:<input([^>]*)>)?/g)) {
    const num = attrsOf(m[3]); const rng = m[4] ? attrsOf(m[4]) : null;
    campos.push({
      id: num.id, rotulo: m[1], unidade: m[2],
      input_number: num, input_range: rng,
      padrao: Number(num.value), faixa: { min: Number(num.min), max: Number(num.max), passo: Number(num.step) },
      faixas_iguais_number_range: rng ? (rng.min === num.min && rng.max === num.max && rng.step === num.step && rng.value === num.value) : null,
      origem: origem(base + m.index, 'div.inst .field-grid .field'),
    });
  }
  const leituras = [...B.matchAll(/<div class="ro"><div class="k">(.*?)<\/div><div class="([^"]+)" id="([^"]+)">(.*?)<\/div><\/div>/g)]
    .map((m) => ({ id: m[3], rotulo: m[1], classe: m[2], valor_estatico_no_markup: m[4], origem: origem(base + m.index, 'div.inst .readout .ro') }));
  const barras = [...B.matchAll(/<div class="bar-row"><span class="lb">(.*?)<\/span>.*?id="([^"]+)".*?<span class="vl" id="([^"]+)">/g)]
    .map((m) => ({ rotulo: m[1], fill_id: m[2], valor_id: m[3], origem: origem(base + m.index, 'div.inst .bars .bar-row') }));
  const alvos = [...B.matchAll(/<div class="(verdict|out|tl-panel|and-nav|and-bd)" id="([^"]+)"/g)].map((m) => ({ id: m[2], classe: m[1] }));
  const extras = [...B.matchAll(/<div id="([^"]+)"><\/div>/g)].map((m) => ({ id: m[1], classe: null }));
  const botoes = [...B.matchAll(/<button class="btn ghost" id="([^"]+)">(.*?)<\/button>/g)].map((m) => ({ id: m[1], rotulo: m[2] }));
  return {
    id_fonte: id.m[1], titulo: { texto: nm.m[1], origem: origem(nm.idx, 'div.inst .inst-hd span.nm') },
    intro: { ...hx(intro.m[1]), origem: origem(intro.idx, 'div.inst p.inst-intro') },
    disc: disc ? { ...hx(disc.m[1]), origem: origem(disc.idx, 'div.inst p.disc') } : null,
    srcnote: src ? { ...hx(src.m[1]), origem: origem(src.idx, 'div.inst p.srcnote') } : null,
    controles, campos, leituras, barras, alvos_renderizados: [...alvos, ...extras], botoes_navegacao: botoes,
  };
}

// ── invocação no texto ───────────────────────────────────────
function contexto(b) {
  const secId = SECOES.find((s) => { const x = section(s); return b.idx >= x.start && b.idx < x.end; });
  const sec = section(secId); const sid = secIdOf(sec);
  const antes = html.slice(sec.start, b.idx);
  const h3s = [...antes.matchAll(/<h3><span class="num">(.*?)<\/span> (.*?)<\/h3>/g)];
  const h3 = h3s.length ? h3s[h3s.length - 1] : null;
  const ps = [...antes.matchAll(/<p(?: class="lede")?>([\s\S]*?)<\/p>/g)];
  const p = ps[ps.length - 1];
  return {
    secao: { id_html: secId, marcador: sid.marcador, rotulo: sid.rotulo },
    aula: /^a\d\d$/.test(secId) ? secId.slice(1) : null,
    subsecao_anterior: h3 ? { numero: h3[1], titulo: texto(h3[2]), origem: origem(sec.start + h3.index, 'h3') } : null,
    paragrafo_imediatamente_anterior: p ? { trecho_final: texto(p[1]).slice(-160), origem: origem(sec.start + p.index, 'p') } : null,
    posicao: { linha_ini: lineOf(b.idx), linha_fim: lineOf(b.end - 1) },
  };
}
const CHAVES = {
  1: [/instrumento abaixo é o mapa/i, /[Tt]abuleiro/],
  2: [/[Ss]eparador de grandeza/],
  3: [/[Vv]erificador de fonte/],
  4: [/[Rr]égua de estado/, /[Rr]égua diplomático/],
  5: [/[Cc]omparador de parceiros/],
  6: [/[Rr]oteador/],
  7: [/Instrumento 07/, /[Pp]rontidão de dado/],
  8: [/[Rr]égua de maturidade/],
  9: [/[Rr]azão reserva-produção/],
  10: [/[Cc]lassificador de nome/, /taxonomia de seis categorias/],
  11: [/instrumento abaixo é o produto final/, /[Aa]ndaime/],
};
function mencoes(n, b) {
  const body = html.slice(0, html.indexOf('<script>'));
  const out = [];
  for (const re of CHAVES[n]) {
    for (const m of body.matchAll(new RegExp(re.source, 'g'))) {
      if (m.index >= b.idx && m.index < b.end) continue;
      if (m.index < html.indexOf('<body>')) continue; // comentários do <style>, não texto
      const sec = SECOES.find((s) => { const x = section(s); return m.index >= x.start && m.index < x.end; }) ?? '(fora de section)';
      const tail = html.slice(Math.max(0, m.index - 60), m.index + 80).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
      out.push({ padrao: re.source, secao_html: sec, trecho: tail.trim(), linha_aprox: lineOf(m.index) });
    }
  }
  return out;
}

// ── script ───────────────────────────────────────────────────
const ROTULOS_SCRIPT = {
  1: 'INST·01', 2: 'INST·02', 3: 'INST·03', 4: 'INST·04', 5: 'INST·05', 6: 'INST·06',
  7: 'INST·07', 8: 'INST·08', 9: 'INST·09', 10: 'INST·10', 11: 'INST·11',
};
const VARS = { 1: ['LENTES', 'FRENTES'], 2: [], 3: ['N'], 4: ['M'], 5: ['C'], 6: ['I', 'P'], 7: ['FR', 'VR', 'PR', 'CD'], 8: ['IT'], 9: [], 10: ['E', 'CAT'], 11: ['M'] };
const FNS = { 1: ['renderLente', 'renderItem'], 2: ['upd'], 3: ['render'], 4: ['render'], 5: ['upd'], 6: ['upd'], 7: ['upd'], 8: ['upd'], 9: ['pc', 'upd'], 10: ['upd'], 11: ['render'] };
const CODE_DATA = {
  1: { LENTES: 'MODULO_12_VETORES', FRENTES: 'MODULO_12_FRENTES' }, 3: { N: 'MODULO_12_NUMEROS' }, 4: { M: 'MODULO_12_MARCOS' },
  5: { C: 'MODULO_12_PARCEIROS' }, 6: { I: 'MODULO_12_INSTRUMENTOS_COMERCIAIS', P: 'MODULO_12_CLASSES_PRODUTO' },
  7: { FR: 'MODULO_12_FRONTEIRA_INVENTARIO', VR: 'MODULO_12_VERIFICACAO_INVENTARIO', PR: 'MODULO_12_DADO_PRECURSOR', CD: 'MODULO_12_CARBONO_DOMESTICO' },
  8: { IT: 'MODULO_12_ITENS_MATURIDADE' }, 10: { E: 'MODULO_12_ENTIDADES', CAT: 'MODULO_12_CATEGORIAS_NOME' }, 11: { M: 'MODULO_12_MOVIMENTOS' },
};
function ramos(fnCode) {
  // cada atribuição a txt (= ou +=): expressão JS verbatim até o ';' de topo, e o trecho de condição que a precede
  const out = []; const s = fnCode.codigo;
  for (const m of s.matchAll(/\btxt(\+?=)/g)) {
    let i = m.index + m[0].length, q = null, par = 0;
    for (; i < s.length; i++) {
      const c = s[i];
      if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
      if (c === "'" || c === '"') { q = c; continue; }
      if (c === '(') par++; else if (c === ')') par--; else if (c === ';' && par === 0) break;
    }
    const expr = s.slice(m.index + m[0].length, i);
    const prev = s.slice(0, m.index);
    const k = Math.max(prev.lastIndexOf('if('), prev.lastIndexOf('else {'), prev.lastIndexOf('else{'));
    const cond = prev.slice(k).replace(/\s+/g, ' ').trim();
    const literais = [...expr.matchAll(/'((?:\\.|[^'\\])*)'/g)].map((x) => x[1]);
    out.push({ condicao_verbatim: cond.slice(0, 200), operador: `txt${m[1]}`, expressao_js_verbatim: expr, texto_literal_concatenado: texto(literais.join(' … ')) });
  }
  return out;
}
function deepDiff(a, b, path = '', out = []) {
  if (out.length > 40) return out;
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) { out.push({ caminho: path || '(raiz)', fonte: a, codigo: b }); return out; }
  if (a && typeof a === 'object') {
    const ks = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of ks) {
      if (!(k in a)) out.push({ caminho: `${path}.${k}`, fonte: '(ausente)', codigo: b[k] });
      else if (!(k in b)) out.push({ caminho: `${path}.${k}`, fonte: a[k], codigo: '(ausente)' });
      else deepDiff(a[k], b[k], `${path}.${k}`, out);
    }
  } else if (a !== b) out.push({ caminho: path, fonte: a, codigo: b });
  return out;
}

// ── comparação por execução ──────────────────────────────────
const tc = (h) => texto(String(h).replace(/<[^>]+>/g, ' '));
const words = (t) => (t.toLowerCase().match(/\p{L}+/gu) || []);
const bag = (ws) => { const m = new Map(); ws.forEach((w) => m.set(w, (m.get(w) || 0) + 1)); return m; };
function cmpText(srcT, codeT) {
  const s = words(srcT), c = bag(words(codeT));
  let hit = 0; const faltam = new Map();
  const cc = new Map(c);
  for (const w of s) { if ((cc.get(w) || 0) > 0) { hit++; cc.set(w, cc.get(w) - 1); } else faltam.set(w, (faltam.get(w) || 0) + 1); }
  const srcBag = bag(s); const sobram = new Map();
  for (const [w, n] of c) if (n > (srcBag.get(w) || 0)) sobram.set(w, n - (srcBag.get(w) || 0));
  return { cobertura: s.length ? hit / s.length : 1, faltam, sobram };
}
const pt = (x) => { const m = String(x).replace(/<[^>]+>/g, '').match(/[−-]?[\d.]+(?:,\d+)?/); if (!m) return null; return Number(m[0].replace('−', '-').replace(/\./g, '').replace(',', '.')); };

function prod(arrs) { return arrs.reduce((acc, a) => acc.flatMap((x) => a.map((y) => [...x, y])), [[]]); }

// especificação de execução por instrumento
const D = runOriginal; // cada caso roda num DOM novo só quando necessário (estado é por instrumento)
const SPEC = {
  1: { casos: () => prod([['cap', 'reg', 'cad'], ['prot', 'clima', 'bilat', 'h2', 'min']]),
    aplicar: (d, [v, f]) => { d.pick('tb-seg', 'data-v', v); d.pick('tb-grid', 'data-f', f); },
    saidas: ['tb-lens', 'tb-item'], codigo: ([v, f]) => ({ 'tb-seg': v, 'tb-frente': f }) },
  2: { casos: () => [...prod([[0, 50, 86.8, 100], [1, 19, 60, 100], [0, 41, 100], [0, 30, 45, 50, 100]]), ['', 19, 41, 50], [150, 19, 41, 50], [86.8, -5, 41, 50]],
    aplicar: (d, c) => ['sg-el', 'sg-pe', 'sg-ne', 'sg-of'].forEach((id, k) => d.setNum(id, c[k])),
    saidas: ['sg-ag', 'sg-di', 'sg-de', 'sg-co', 'sg-vd'], numericas: { 'sg-ag': 'sg-ag', 'sg-di': 'sg-di', 'sg-de': 'sg-de', 'sg-co': 'sg-co' },
    codigo: (c) => ({ 'sg-el': c[0], 'sg-pe': c[1], 'sg-ne': c[2], 'sg-of': c[3] }) },
  3: { casos: () => ['ren', 'g20', 'oleo', 'reserva', 'terra', 'ndc', 'cap', 'anun'].map((k) => [k]),
    aplicar: (d, [k]) => d.pick('vf-grid', 'data-n', k), saidas: ['vf-out'], codigo: ([k]) => ({ 'vn-sel': k }) },
  4: { casos: () => Array.from({ length: 12 }, (_, i) => [`m${i + 1}`]),
    aplicar: (d, [k]) => d.pick('rg-grid', 'data-m', k), saidas: ['rg-panel'], codigo: ([k]) => ({ 'rd-sel': k }) },
  5: { casos: () => prod([['china', 'eua', 'europa', 'brics'], ['cap', 'reg', 'cad']]),
    aplicar: (d, [p, v]) => { d.pick('cb-par', 'data-p', p); d.pick('cb-vet', 'data-v', v); },
    saidas: ['cb-out', 'cb-vd'], codigo: ([p, v]) => ({ 'cb-par': p, 'cb-vet': v }) },
  6: { casos: () => prod([['emerg', 's232', 's301', 's122'], ['energia', 'etanol', 'aco', 'terras', 'agro', 'manuf']]),
    aplicar: (d, [i, p]) => { d.pick('rt-inst', 'data-i', i); d.pick('rt-prod', 'data-p', p); },
    saidas: ['rt-aut', 'rt-pra', 'rt-jud', 'rt-rev', 'rt-vd', 'rt-nota'], codigo: ([i, p]) => ({ 'rt-inst': i, 'rt-prod': p }) },
  7: { casos: () => prod([['corp', 'portao', 'berco'], ['nao', 'int', 'ter'], ['nao', 'parc', 'sim'], ['nao', 'reg', 'op']]),
    aplicar: (d, [f, v, p, c]) => { d.pick('pc-fr', 'data-f', f); d.pick('pc-vr', 'data-v', v); d.pick('pc-pr', 'data-p', p); d.pick('pc-cd', 'data-c', c); },
    saidas: ['pc-pos', 'pc-blq', 'pc-vpd', 'pc-des', 'pc-vd'], codigo: ([f, v, p, c]) => ({ 'pc-fr': f, 'pc-vr': v, 'pc-pr': p, 'pc-cd': c }) },
  8: { casos: () => prod(Array.from({ length: 9 }, () => [0, 1, 2])),
    aplicar: (d, c) => c.forEach((v, k) => {
      const b = d.get('mp-itens').buttons().find((x) => x.getAttribute('data-k') === `i${k + 1}` && x.getAttribute('data-v') === String(v));
      d.click(b);
    }),
    saidas: ['mp-pts', 'mp-est', 'mp-vin', 'mp-blq', 'mp-vd', 'mp-red'], numericas: { 'mp-pts': 'mp-pts', 'mp-vin': 'mp-vin' },
    codigo: (c, d, IT) => {
      const inp = Object.fromEntries(c.map((v, k) => [`mp-e-i${k + 1}`, String(v)]));
      const ti = texto(d.out('mp-red')).match(/de 2 (.*?) (?:Para|É|Decisão|Item|Na)\b/);
      const foco = IT.find((o) => o.nota && texto(d.out('mp-red')).includes(o.n + ' ' + texto(o.nota).slice(0, 20)));
      inp['mp-sel'] = foco ? foco.k : 'i1';
      return inp;
    } },
  9: { casos: () => [...prod([[0.1, 11.4, 21, 90, 200], [1, 85, 500], [0, 0.02, 1, 50, 500], [1, 390, 5000]]), ['', 85, 0.02, 390], [21, 85, '', 390]],
    aplicar: (d, c) => ['rp-rn', 'rp-rm', 'rp-pn', 'rp-pm'].forEach((id, k) => d.setNum(id, c[k])),
    saidas: ['rp-pr', 'rp-pp', 'rp-ra', 'rp-an', 'rp-vd'], numericas: { 'rp-pr': 'rp-pr', 'rp-pp': 'rp-pp', 'rp-ra': 'rp-ra', 'rp-an': 'rp-an' },
    codigo: (c) => ({ 'rp-rn': c[0], 'rp-rm': c[1], 'rp-pn': c[2], 'rp-pm': c[3] }) },
  10: { casos: () => Array.from({ length: 12 }, (_, i) => [`e${i + 1}`]),
    aplicar: (d, [k]) => d.pick('cn-grid', 'data-e', k), saidas: ['cn-out', 'cn-vd'], codigo: ([k]) => ({ 'cn-sel': k }) },
  11: { casos: () => Array.from({ length: 8 }, (_, i) => [i]),
    aplicar: (d, [i]) => d.pick('ad-nav', 'data-i', i), saidas: ['ad-bd'], codigo: ([i], d, M) => ({ 'an-sel': M[i].t }) },
};

function executar(n, dados) {
  const spec = SPEC[n]; const d = runOriginal();
  const padrao = Object.fromEntries(spec.saidas.map((id) => [id, { html: d.out(id), texto: texto(d.out(id)), classe: d.get(id).className || null }]));
  const casos = spec.casos();
  let ancVirgula = 0;
  let minCob = 1, somaCob = 0, casosPiores = [], numDiv = [];
  const faltamT = new Map(), sobramT = new Map(); const ramosVistos = new Map();
  const dataArg = n === 8 ? dados.IT : n === 11 ? dados.M : null;
  const calc = calcs[`m12-inst-${pad(n)}`];
  for (const c of casos) {
    spec.aplicar(d, c);
    const srcHtml = spec.saidas.map((id) => d.out(id)).join(' ');
    const vd = spec.saidas.find((id) => /-vd$/.test(id));
    if (vd) { const key = `${d.get(vd).className} | ${texto(d.out(vd)).slice(0, 70)}`; ramosVistos.set(key.replace(/\d[\d.,]*/g, '#'), (ramosVistos.get(key.replace(/\d[\d.,]*/g, '#')) || 0) + 1); }
    const r = calc(spec.codigo(c, d, dataArg));
    if (n === 11 && r.veredito.includes(dataArg[c[0]].anc.join(','))) ancVirgula++;
    const numsSrc = new Set(Object.keys(spec.numericas || {}));
    const srcSemNum = spec.saidas.filter((id) => !numsSrc.has(id)).map((id) => d.out(id)).join(' ');
    const cmp = cmpText(tc(srcSemNum), tc(r.veredito || ''));
    minCob = Math.min(minCob, cmp.cobertura); somaCob += cmp.cobertura;
    if (cmp.cobertura < 1 && casosPiores.length < 3) casosPiores.push({ entrada: c, cobertura: +cmp.cobertura.toFixed(4) });
    for (const [w, k] of cmp.faltam) faltamT.set(w, (faltamT.get(w) || 0) + k);
    for (const [w, k] of cmp.sobram) sobramT.set(w, (sobramT.get(w) || 0) + k);
    for (const [sid, cid] of Object.entries(spec.numericas || {})) {
      const sv = texto(d.out(sid)); const cv = r.valores?.[cid];
      const svn = pt(sv);
      if (svn === null && cv === undefined) continue;
      const dec = (sv.match(/,(\d+)/) || [, ''])[1].length;
      const ok = cv !== undefined && svn !== null && Math.abs(Math.round(cv * 10 ** dec) / 10 ** dec - svn) < 1e-9;
      if (!ok && numDiv.length < 8) numDiv.push({ entrada: c, saida: sid, fonte_texto: sv, codigo_valor: cv ?? '(ausente em valores)' });
    }
  }
  const top = (m, k = 400) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([w, q]) => `${w}×${q}`);
  return {
    cenario_padrao_renderizado: padrao,
    comparacao_execucao: {
      metodo: 'script original em DOM simulado × INSTRUMENT_CALCULATORS; texto visível das saídas não numéricas comparado por palavra (multiconjunto, letras apenas) contra texto(veredito); saídas numéricas comparadas contra valores[id] arredondado às casas exibidas pela fonte',
      casos: casos.length,
      espaco: n === 2 || n === 9 ? 'grade (entrada numérica contínua) + vazio + fora de faixa' : 'espaço de entrada inteiro',
      cobertura_min: +minCob.toFixed(4), cobertura_media: +(somaCob / casos.length).toFixed(4),
      casos_com_perda_exemplos: casosPiores,
      palavras_da_fonte_ausentes_no_codigo_top: top(faltamT),
      palavras_do_codigo_ausentes_da_fonte_top: top(sobramT),
      divergencias_numericas_exemplos: numDiv,
      ...(n === 11 ? { ancoras_concatenadas_por_virgula: ancVirgula } : {}),
    },
    ramos_observados: [...ramosVistos.entries()].map(([k, q]) => ({ classe_e_inicio: k, casos: q })),
  };
}

// ── montagem ─────────────────────────────────────────────────
const MEC = {
  1: 'seleção vetor (3) × frente (5) → texto de lente + texto de célula + pergunta de verificação; sem número',
  2: '4 campos numéricos (número + deslizador gêmeo) → 4 leituras + veredito em 3 faixas + 3 barras',
  3: 'seleção de 1 entre 8 números em circulação → 4 cartões de texto (fonte, o que mede, erro típico, o que verificar)',
  4: 'seleção de 1 entre 12 marcos (chips + anterior/próximo) → painel com 3 campos de texto',
  5: 'seleção parceiro (4) × vetor (3) → 4 cartões de texto + veredito fixo com nome do parceiro e vetor',
  6: 'seleção instrumento (4) × classe de produto (6) → 4 leituras textuais + veredito (classe por regex Exposto/Isentado) + nota do instrumento',
  7: '4 eixos categóricos com peso 0/1/2 (81 combinações) → 4 leituras textuais + veredito em 4 ramos + adendo sobre desconto',
  8: '9 itens × 3 estados (0/1/2), 3 críticos → pontuação 0–18, estágio (5 faixas), vinculantes, bloqueios, veredito em 6 ramos, item em foco automático',
  9: '4 campos numéricos → participação na reserva, na produção, razão de assimetria, anos de reserva; veredito em 7 ramos + adendo; 2 barras',
  10: 'seleção de 1 entre 12 tipos de entidade → categoria (0–6), onde pode aparecer, substituição correta; veredito = status + porquê',
  11: 'navegação por 8 movimentos → relógio, pergunta, âncoras (lista), ponte, erro',
};
const instrumentos = [];
const resumo = [];
for (let n = 1; n <= 11; n++) {
  const b = blocos[n - 1];
  const mk = markup(b);
  if (mk.id_fonte !== `Inst · ${pad(n)}`) fail(`ordem: ${mk.id_fonte}`);
  const ctx = contexto(b);
  const blk = scriptBlock(ROTULOS_SCRIPT[n]);
  const rotuloScript = html.slice(blk.start, html.indexOf('*/', blk.start)).replace('/* ===================== ', '').replace(/ =+ ?$/, '').trim();
  const dados = {}; const dadosSaida = {};
  for (const v of VARS[n]) { const x = scriptVar(blk, v); dados[v] = x.valor; dadosSaida[v] = { linhas: [x.linha_ini, x.linha_fim], valor: x.valor }; }
  const fns = FNS[n].map((f) => ({ nome: f, ...scriptFn(blk, f) }));
  // opções geradas pelo script (chips / itens / navegação): vêm do literal de dado
  const fromScript = (arr, map) => arr.map((o, j) => ({ ...map(o, j), padrao_no_script: j === 0, origem_opcoes: 'script' }));
  for (const c of mk.controles) {
    if (c.opcoes) continue;
    if (n === 1) c.opcoes = fromScript(dados.FRENTES, (o) => ({ valor: o.k, atributo: 'data-f', rotulo: o.n }));
    if (n === 3) c.opcoes = fromScript(dados.N, (o) => ({ valor: o.k, atributo: 'data-n', rotulo: o.n }));
    if (n === 10) c.opcoes = fromScript(dados.E, (o) => ({ valor: o.k, atributo: 'data-e', rotulo: o.n }));
  }
  if (n === 4) {
    const i = html.indexOf('id="rg-grid"', b.idx);
    mk.controles.push({ id: 'rg-grid', rotulo: null, rotulo_nota: 'sem seg-lb na fonte; chips com ano (y) + nome (n), mais botões Anterior/Próximo', tipo: 'grade de chips (botões gerados pelo script)',
      opcoes: fromScript(dados.M, (o) => ({ valor: o.k, atributo: 'data-m', rotulo: o.n, ano: o.y })), origem: origem(i, 'div.tr-grid#rg-grid') });
  }
  if (n === 8) {
    const i = html.indexOf('id="mp-itens"', b.idx);
    dados.IT.forEach((o) => mk.controles.push({ id: `mp-${o.k}`, rotulo: o.n, critico: !!o.crit, rotulo_render: o.crit ? `${o.n} · CRÍTICO` : o.n, tipo: 'segmentado (gerado pelo script dentro de #mp-itens)',
      opcoes: o.s.map((t, j) => ({ valor: String(j), atributo: 'data-v', rotulo: t, padrao_no_script: j === 0, origem_opcoes: 'script' })), origem: origem(i, 'div#mp-itens (script IT)') }));
  }
  if (n === 11) {
    const i = html.indexOf('id="ad-nav"', b.idx);
    mk.controles.push({ id: 'ad-nav', rotulo: null, rotulo_nota: 'sem seg-lb na fonte; botão = <i>t</i> + lb', tipo: 'navegação por movimentos (gerada pelo script)',
      opcoes: fromScript(dados.M, (o, j) => ({ valor: String(j), atributo: 'data-i', rotulo: o.lb, tempo: o.t })), origem: origem(i, 'div.and-nav#ad-nav') });
  }
  const ex = executar(n, dados);
  const cid = `m12-inst-${pad(n)}`; const ci = CODE_INST[cid];
  const dataDiffs = Object.entries(CODE_DATA[n] || {}).map(([v, exp]) => {
    const diffs = deepDiff(dados[v], content[exp]);
    return { var_fonte: v, export_codigo: exp, igual: diffs.length === 0, diferencas: diffs.slice(0, 12), total_diferencas: diffs.length };
  });
  // campos: fonte × código
  const ID_MAP = { 'tb-frente': 'tb-grid', 'vn-sel': 'vf-grid', 'rd-sel': 'rg-grid', 'cn-sel': 'cn-grid', 'an-sel': 'ad-nav', 'mp-sel': null };
  for (let k = 1; k <= 9; k++) ID_MAP[`mp-e-i${k}`] = `mp-i${k}`;
  const fonteCampos = [...mk.controles.map((c) => ({ id: c.id, rotulo: c.rotulo, opcoes: c.opcoes })), ...mk.campos.map((c) => ({ id: c.id, rotulo: c.rotulo, unidade: c.unidade, padrao: c.padrao, min: c.faixa.min, max: c.faixa.max, passo: c.faixa.passo }))];
  const codeCampos = ci.fields.map((f) => ({ id: f.id, rotulo: f.label, unidade: f.unit, kind: f.kind, padrao: f.defaultValue, min: f.min, max: f.max, passo: f.step, opcoes: f.options }));
  const cmpCampos = codeCampos.map((c) => {
    const fid = c.id in ID_MAP ? ID_MAP[c.id] : c.id;
    const f = fid ? fonteCampos.find((x) => x.id === fid) || null : null;
    const obs = [];
    if (!f) obs.push(fid === null ? 'campo INEXISTENTE na fonte (a fonte escolhe o item em foco automaticamente: primeiro crítico não vinculante com nota)' : 'id sem correspondente no markup');
    else {
      if (fid !== c.id) obs.push(`id: fonte "${fid}" × código "${c.id}"`);
      if (f.opcoes && c.opcoes) {
        const ro = f.opcoes.map((o) => o.rotulo).join(' | '), rc = c.opcoes.map((o) => o.label).join(' | ');
        if (ro !== rc) obs.push(`rótulos das opções diferem: fonte [${ro}] × código [${rc}]`);
        const vo = f.opcoes.map((o) => o.tempo ?? o.valor).join('|'), vc = c.opcoes.map((o) => o.value).join('|');
        if (vo !== vc) obs.push(`valores das opções: fonte [${vo}] × código [${vc}]`);
      }
      if (f.rotulo !== c.rotulo) obs.push(`rótulo: fonte ${JSON.stringify(f.rotulo)} × código ${JSON.stringify(c.rotulo)}`);
      if (f.padrao !== undefined && f.padrao !== c.padrao) obs.push(`padrão ${f.padrao} × ${c.padrao}`);
      if (f.min !== undefined && (f.min !== c.min || f.max !== c.max || f.passo !== c.passo)) obs.push('faixa/passo diferente');
      if (f.unidade !== undefined && f.unidade !== c.unidade) obs.push(`unidade ${f.unidade} × ${c.unidade}`);
    }
    return { ...c, opcoes: c.opcoes ? c.opcoes.length : undefined, fonte_id: fid, observacoes: obs };
  });
  const fonteLeit = mk.leituras.map((l) => ({ id: l.id, rotulo: l.rotulo }));
  const cmpSaidas = {
    fonte: fonteLeit, codigo: ci.outputs.map((o) => ({ id: o.id, rotulo: o.label, unidade: o.unit })),
    fonte_sem_saida_no_codigo: fonteLeit.filter((l) => !ci.outputs.find((o) => o.id === l.id)).map((l) => l.id),
    codigo_sem_leitura_na_fonte: ci.outputs.filter((o) => !fonteLeit.find((l) => l.id === o.id)).map((o) => o.id),
  };
  const noteFonte = texto([mk.intro.html, mk.disc?.html].filter(Boolean).join(' '));
  const cex = ex.comparacao_execucao;
  // palavras do código que não existem em LUGAR NENHUM do instrumento na fonte (markup + bloco de script) = texto novo
  const vocabFonte = new Set(words(tc(b.body + ' ' + blk.text)));
  const inventadas = [...new Set(cex.palavras_do_codigo_ausentes_da_fonte_top.map((x) => x.split('×')[0]))].filter((w) => !vocabFonte.has(w));
  // varredura completa (não só top) para palavras inventadas
  cex.palavras_inventadas = inventadas;
  const divergencias = []; const ressalvas = [];
  if (cex.cobertura_min < 1) divergencias.push(`PERDA: texto visível da fonte não coberto pelo veredito do código (cobertura mínima ${(cex.cobertura_min * 100).toFixed(1)}%, média ${(cex.cobertura_media * 100).toFixed(1)}%); palavras que faltam: ${cex.palavras_da_fonte_ausentes_no_codigo_top.slice(0, 12).join(', ')}`);
  if (inventadas.length) divergencias.push(`TEXTO NOVO: o veredito do código tem palavras que não existem no instrumento da fonte: ${inventadas.slice(0, 20).join(', ')}`);
  else if (cex.palavras_do_codigo_ausentes_da_fonte_top.length) ressalvas.push(`recomposição: o veredito do código reúne rótulos/títulos da fonte em outra posição (${cex.palavras_do_codigo_ausentes_da_fonte_top.slice(0, 8).join(', ')})`);
  if (cex.ancoras_concatenadas_por_virgula) divergencias.push(`FORMATO: em ${cex.ancoras_concatenadas_por_virgula} de ${cex.casos} casos o código interpola o array de âncoras direto no template (Array→String), produzindo as três âncoras coladas por vírgula, sem a lista ul.and-anc da fonte`);
  if (cex.divergencias_numericas_exemplos.length) divergencias.push('NÚMERO: saída numérica difere ou está ausente em valores (ver comparacao_execucao.divergencias_numericas_exemplos)');
  dataDiffs.filter((x) => !x.igual).forEach((x) => divergencias.push(`DADO: ${x.var_fonte} × ${x.export_codigo}: ${x.total_diferencas} diferença(s)`));
  for (const c of cmpCampos) for (const o of c.observacoes) {
    if (/^id:|^rótulo: fonte null/.test(o)) ressalvas.push(`campo ${c.id}: ${o}`);
    else divergencias.push(`CAMPO ${c.id}: ${o}`);
  }
  const normNote = (t) => t.replace(/\s+([,.;:])/g, '$1').replace(/\s+/g, ' ').trim();
  if (normNote(texto(ci.note || '')) !== normNote(noteFonte)) divergencias.push('NOTE: note do código ≠ intro + disc da fonte (ver note_codigo)');
  else if (texto(ci.note || '') !== noteFonte) ressalvas.push('note do código = intro + disc, mas com espaço antes de pontuação onde a fonte tinha tag inline (<b>/<em>) removida');
  if (cmpSaidas.fonte_sem_saida_no_codigo.length) ressalvas.push(`leituras da fonte que não viram outputs (vão como texto no veredito): ${cmpSaidas.fonte_sem_saida_no_codigo.join(', ')}`);
  if (cmpSaidas.codigo_sem_leitura_na_fonte.length) ressalvas.push(`outputs do código sem leitura na fonte: ${cmpSaidas.codigo_sem_leitura_na_fonte.join(', ')}`);
  const aulaCodigo = aulaDoInst[cid] ?? null;
  const aulaFonte = ctx.aula ? `aula-12-${ctx.aula}` : null;
  if (aulaCodigo !== aulaFonte) divergencias.push(`AULA: fonte ${aulaFonte} × código ${aulaCodigo}`);
  const status = divergencias.length === 0 ? 'portado' : 'divergente';
  resumo.push({ id: cid, status, cobertura_min: cex.cobertura_min, palavras_inventadas: inventadas.length, n_divergencias: divergencias.length, n_ressalvas: ressalvas.length });
  instrumentos.push({
    id: cid, tipo: 'instrumento', camada: 'fonte', id_fonte: mk.id_fonte, rotulo_no_script: rotuloScript,
    titulo: mk.titulo,
    pergunta: null,
    pergunta_nota: 'A fonte não declara uma pergunta própria do instrumento. Há só o inst-intro (abaixo) e, no INST·01, a "Pergunta de verificação" que é SAÍDA por vetor. Pergunta de previsão é camada Alexandria (P19), não fonte.',
    ...ctx,
    mencoes_no_texto: mencoes(n, b),
    intro: mk.intro, disc: mk.disc,
    fonte_dos_numeros: mk.srcnote,
    fonte_dos_numeros_nota: mk.srcnote ? 'Literal do p.srcnote do instrumento. Nenhum número aqui foi verificado contra a fonte primária (P19/P20).' : 'O instrumento não tem p.srcnote. Nenhuma fonte de números declarada no bloco (null).',
    mecanica_resumo_extracao: MEC[n],
    entradas: { controles: mk.controles, campos: mk.campos },
    saidas: { leituras: mk.leituras, barras: mk.barras, alvos_renderizados: mk.alvos_renderizados, botoes_navegacao: mk.botoes_navegacao },
    script: { funcoes_verbatim: fns, dados: dadosSaida, ramos_de_texto: fns.flatMap((f) => ramos(f)) },
    tolerancias: null,
    tolerancias_nota: 'A fonte não declara tolerância, gabarito nem previsão para nenhum instrumento (P6).',
    ...ex,
    codigo: {
      arquivo_dados: 'src/lib/data/alexandria-modulo-12-content.ts', arquivo_calculo: 'src/lib/data/alexandria-instrument-calculators.ts',
      id: cid, kind: ci.kind, formula: ci.formula, aula: aulaCodigo,
      status, divergencias, ressalvas,
      campos: cmpCampos, saidas: cmpSaidas, dados_script_x_codigo: dataDiffs,
      note_codigo: ci.note,
    },
  });
}

writeJson('instrumentos.json', {
  grupo: 'instrumentos', modulo: 'm12', fonte: SRC, camada: 'fonte',
  gerado_por: 'extratores/m12_instrumentos.mjs (Node 24): markup por regex em div.inst balanceado; script por avaliação de literal de dado e texto verbatim de função; comparação por execução do script original em DOM simulado',
  convencoes: {
    html: 'fragmento literal com espaços em branco colapsados', texto: 'sem tags, entidades decodificadas',
    linha_aprox: 'linha 1-based do HTML-fonte (4.059 linhas + 1 vazia)',
    'script.dados': 'valor avaliado do literal JS da fonte (strings intactas, inclusive HTML inline)',
    cenario_padrao_renderizado: 'o que o script escreve no carregamento, sem interação',
    status: 'portado = cobertura 100%, nenhuma palavra nova, dados e campos iguais; divergente = qualquer desvio (lista em codigo.divergencias)',
  },
  contagens: { instrumentos: instrumentos.length, de_aula: instrumentos.filter((i) => i.aula).length, fora_de_aula: instrumentos.filter((i) => !i.aula).length, portados: resumo.filter((r) => r.status === 'portado').length, divergentes: resumo.filter((r) => r.status === 'divergente').length, nao_portados: 11 - Object.keys(CODE_INST).length },
  resumo, instrumentos,
});
console.log(JSON.stringify(resumo));
for (const i of instrumentos) console.log(i.id, '\n  D:', i.codigo.divergencias.join(' || ').slice(0, 1200), '\n  R:', i.codigo.ressalvas.join(' || ').slice(0, 400));
