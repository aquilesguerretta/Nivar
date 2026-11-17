// Extrator dos 10 instrumentos do M07 -> instrumentos.json.
// Dados: literais do <script> avaliados (sem digitacao). Saidas e leituras: texto do script
// (expressao-fonte) + execucao do script original em DOM simulado (m07_sim.mjs).
// Comparacao com o codigo: literais TS lidos e avaliados; calculadoras m07-inst-04/06
// executadas contra o original numa grade de entradas.
import {
  html, SCRIPT_START, SCRIPT_END, lineOf, texto, inner, ini, origem, pad, sec, all, one,
  literalAfter, scriptBlock, matchBracket, tsLiteral, readData, writeJSON, idxOfString,
} from './m07_lib.mjs';
import { runSim, clickAll } from './m07_sim.mjs';

const body = html.slice(0, SCRIPT_START);
const sim = runSim();

// ---------- markup de cada instrumento ----------
function divEnd(src, start) {
  const re = /<\/?div\b[^>]*>/g; re.lastIndex = start; let depth = 0; let m;
  while ((m = re.exec(src))) {
    if (m[0][1] === '/') { depth--; if (depth === 0) return m.index + m[0].length; } else depth++;
  }
  throw new Error('div sem fim');
}
const SECOES = ['tese', 'map', 'a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'caso', 'erros', 'ex', 'quiz', 'voz', 'final', 'lex', 'ref'];
function secaoDe(idx) {
  for (const id of SECOES) { const s = sec(id); if (idx > s.start && idx < s.end) return s; }
  return null;
}
const instMarks = all(/<div class="inst">/g, body).map(({ idx }) => {
  const end = divEnd(body, idx);
  const block = body.slice(idx, end);
  const nm = /<span class="nm">([\s\S]*?)<\/span>/.exec(block)[1];
  const idl = /<span class="id">([\s\S]*?)<\/span>/.exec(block)[1];
  const intro = /<p class="inst-intro">([\s\S]*?)<\/p>/.exec(block);
  const disc = /<p class="disc">([\s\S]*?)<\/p>/.exec(block);
  const s = secaoDe(idx);
  const secId = /<div class="sec-id"><b>([\s\S]*?)<\/b> · ([\s\S]*?)<\/div>/.exec(s.body);
  const h2 = /<h2>([\s\S]*?)<\/h2>/.exec(s.body);
  // subsecao h3 anterior dentro da secao
  const before = body.slice(s.start, idx);
  const h3s = [...before.matchAll(/<h3><span class="num">([^<]*)<\/span>([\s\S]*?)<\/h3>/g)];
  const h3 = h3s.length ? h3s[h3s.length - 1] : null;
  // bloco imediatamente anterior e posterior (elemento de nivel de secao)
  const prevBlocks = [...before.matchAll(/\n {4}<(p|div|ol|ul|h3|table)([^>]*)>([\s\S]*?)(?=\n {4}<|\n {4}<!--|$)/g)];
  const prev = prevBlocks.length ? prevBlocks[prevBlocks.length - 1] : null;
  const after = body.slice(end, s.end);
  const nxt = /\n {4}<(p|div|ol|ul|h3)([^>]*)>([\s\S]*?)(?=\n {4}<|\n {2}<\/div>)/.exec(after);
  return {
    idx, end, block, nm, idl, intro, disc, secao: s,
    secao_rotulo: { marcador: texto(secId[1]), rotulo: texto(secId[2]), h2: texto(h2[1]) },
    h3: h3 ? { numero: h3[1], titulo: texto(h3[2]), linha_aprox: lineOf(s.start + h3.index) } : null,
    antes: prev ? { elemento: `${prev[1]}${prev[2]}`.trim(), trecho_inicial: ini(prev[3], 90), linha_aprox: lineOf(s.start + prev.index + 1) } : null,
    depois: nxt ? { elemento: `${nxt[1]}${nxt[2]}`.trim(), trecho_inicial: ini(nxt[3], 90), linha_aprox: lineOf(end + nxt.index + 1) } : null,
  };
});
if (instMarks.length !== 10) throw new Error('esperava 10 inst, achou ' + instMarks.length);

// invocacoes no texto (prosa fora do bloco do instrumento)
const INVOC = {
  '01': [/Use o instrumento abaixo/],
  '02': [/comparador de instrumentos/i],
  '04': [/Inst·04/],
  '08': [/roteador de decisão/i, /Inst·08/],
  '09': [/localizador de dado/i, /o instrumento seguinte existe/],
  '10': [/calendário institucional/i, /o calendário do setor/],
};
const QUIZ_AT = html.indexOf('var Q=[', SCRIPT_START);
function invocacoes(num, mark) {
  const out = [];
  const seen = new Set();
  for (const re of [...(INVOC[num] || []), new RegExp(`Inst ?· ?${num}\\b`)]) {
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    for (const m of html.matchAll(g)) {
      if (m.index >= mark.idx && m.index < mark.end) continue; // dentro do proprio instrumento
      const lineStart = html.lastIndexOf('\n', m.index) + 1;
      const lineEnd = html.indexOf('\n', m.index);
      const ln = html.slice(lineStart, lineEnd);
      const emScript = m.index > SCRIPT_START && m.index < SCRIPT_END;
      if (/class="(nm|id|sec-id)"/.test(ln)) continue; // cabecalho do proprio instrumento
      if (/^\s*(\/\*|INST \d)/.test(ln) || m.index < html.indexOf('<body>')) continue; // comentario de script/CSS
      // contexto: frase (no texto cru da linha) que contem o casamento
      const off = m.index - lineStart;
      const stops = emScript ? /[.'](?=\s|,|$)|'/g : /\.(?=\s|<|$)/g;
      let a = 0, b = ln.length;
      for (const s of ln.matchAll(stops)) { if (s.index < off) a = s.index + 1; else if (s.index >= off + m[0].length) { b = s.index + 1; break; } }
      const frase = texto(ln.slice(a, b)).replace(/^'|'$/g, '');
      const key = lineOf(m.index) + '|' + frase;
      if (seen.has(key)) continue; seen.add(key);
      const s = secaoDe(m.index);
      let questao = null;
      if (emScript && m.index > QUIZ_AT && m.index < html.indexOf('];', QUIZ_AT)) {
        questao = (html.slice(QUIZ_AT, m.index).match(/\{q:'/g) || []).length;
      }
      out.push({
        casamento: m[0],
        frase,
        onde: emScript ? (questao ? `script › quiz, feedback da questão ${questao}` : 'script › mensagem do quiz') : (s ? `section#${s.id}` : 'fora de section'),
        eh_bloco_de_produto: !emScript && /Onde isso entra no produto/.test(html.slice(html.lastIndexOf('<div class="box', m.index), m.index)),
        linha_aprox: lineOf(m.index),
      });
    }
  }
  return out.sort((x, y) => x.linha_aprox - y.linha_aprox);
}

// ---------- literais do script ----------
const B = {};
for (let k = 1; k <= 10; k++) B[pad(k)] = scriptBlock(`INST ${pad(k)} —`);
const PANEL_FN = one(/function panel\(kick,tit,body,rows,leg,legLb\)\{[\s\S]*?\n\}/, html, 0);
const GRID_FN = one(/function grid\(host,items,pre,cb\)\{/, html, 0);
const LEITURA_DEFAULT = "'Leitura'";

function origemScript(num, trecho, idx) {
  return origem(`script › INST ${num}`, trecho, idx);
}
function linhas(r, from) {
  if (!r) return null;
  return r.map(([k, v]) => ({ chave_html: k, chave_texto: texto(k), valor_html: v, valor_texto: texto(v), linha_aprox: lineOf(idxOfString(v, from)) }));
}

// Explorador generico (INST 02, 03, 07): {k,n,b,r,l}; INST 05: {n,k,t,b,r,l}; INST 08/09: {k,n,b,c,l}
function itensExplorador(num, shape) {
  const blk = B[num];
  const D = literalAfter(html, 'var D=', blk.start);
  let cur = D.start;
  return D.value.map((d, i) => {
    const first = shape === '05' ? d.n : d.k;
    const at = idxOfString(first, cur, D.end); cur = at + 1;
    const it = { indice: i };
    if (shape === '05') {
      Object.assign(it, {
        rotulo_chip: d.n, kicker: d.k, kicker_renderizado: d.k + ' · ' + d.n, titulo: d.t,
      });
    } else {
      Object.assign(it, { kicker: d.k, titulo: d.n, rotulo_chip: { span_y: d.k, texto: d.n }, rotulo_chip_nota: 'o chip renderiza <span class="y">k</span> seguido de n, sem separador textual (grid(), L' + lineOf(GRID_FN.idx) + ')' });
    }
    it.corpo_html = d.b;
    if (d.r) it.linhas = linhas(d.r, at);
    if (d.c) it.cartoes = d.c.map((v) => ({ valor_html: v, valor_texto: texto(v) }));
    it.leitura_html = d.l;
    it.leitura_texto = texto(d.l);
    it.origem = origemScript(num, first, at);
    return it;
  });
}

function cardsLabels(num) {
  const blk = B[num];
  const f = one(/function cards\(x\)\{[\s\S]*?\n {2}\}/, blk.text, blk.start);
  return [...f.m[0].matchAll(/<div class="(ocard[^"]*)"><span class="ok2">([^<]*)<\/span>'\+x\[(\d)\]/g)]
    .map((m) => ({ indice: +m[3], rotulo: m[2], classe: m[1] }));
}

// ---------- codigo (so leitura) ----------
const EXPL = tsLiteral('alexandria-modulo-07-content.ts', 'export const MODULO_07_EXPLORADORES').value;
const INSTS = tsLiteral('alexandria-modulo-07-content.ts', 'export const INSTRUMENTOS_MODULO_07').value;
const ORGAOS = tsLiteral('alexandria-modulo-07-content.ts', 'export const M07_INST01_ORGAOS').value;
const LEGENDAS = tsLiteral('alexandria-modulo-07-content.ts', 'export const M07_INST01_LEGENDAS').value;
const INST_MOD = tsLiteral('alexandria-modulo-07-content.ts', 'export const MODULO_07_INSTRUMENTOS', { M07_INST01_ORGAOS: ORGAOS }).value;
const AULAS_COD = tsLiteral('alexandria-modulo-07-content.ts', 'export const MODULO_07_AULAS', { INSTRUMENTOS_MODULO_07: INSTS }).value;
const CALC_SRC = readData('alexandria-instrument-calculators.ts');
function calcFn(key) {
  const at = CALC_SRC.indexOf(`'${key}': (i) => {`);
  const open = CALC_SRC.indexOf('{', at + key.length + 4);
  const close = matchBracket(CALC_SRC, open);
  const bodyTxt = CALC_SRC.slice(open, close + 1).replace(/\(\): string =>/g, '() =>');
  const n = (v) => { const x = typeof v === 'string' ? Number(v) : v; return Number.isFinite(x) ? x : 0; };
  const num = (v, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const dias = (v) => num(v, 0) + (v === 1 ? ' dia' : ' dias');
  return { fn: new Function('n', 'num', 'dias', 'return (i) => ' + bodyTxt)(n, num, dias), linha: lineOf(at, CALC_SRC) };
}
const aulaCodigoDe = (instId) => {
  const a = AULAS_COD.find((x) => x.instruments.some((y) => y.id === instId));
  return a ? a.id : null;
};

function compararExplorador(num, itensFonte, compor) {
  const cod = EXPL[num] || [];
  const achados = [];
  if (cod.length !== itensFonte.length) achados.push(`contagem: fonte ${itensFonte.length} itens, código ${cod.length}`);
  const porItem = itensFonte.map((it, i) => {
    const c = cod[i];
    if (!c) return { indice: i, status: 'ausente no código' };
    const { rotulo, partes } = compor(it);
    const faltam = partes.filter((p) => !c.corpo.includes(p.valor)).map((p) => p.nome);
    const extra = [];
    const r = { indice: i, rotulo_confere: c.rotulo === rotulo, partes_ausentes_no_codigo: faltam };
    if (!r.rotulo_confere) r.rotulo_codigo = c.rotulo, r.rotulo_esperado = rotulo;
    return r;
  });
  const ausentes = new Set(porItem.flatMap((p) => p.partes_ausentes_no_codigo || []));
  if (ausentes.size) achados.push('partes da fonte ausentes do corpo portado (MODULO_07_EXPLORADORES): ' + [...ausentes].join(', '));
  if (porItem.some((p) => p.rotulo_confere === false)) achados.push('rótulo divergente em ' + porItem.filter((p) => p.rotulo_confere === false).length + ' itens');
  return { achados, por_item: porItem };
}
function fieldCodigo(instId) { return INSTS.find((x) => x.id === instId); }
function compararOpcoes(instId, rotulos) {
  const f = fieldCodigo(instId);
  if (!f) return ['instrumento ausente de INSTRUMENTOS_MODULO_07'];
  const opts = f.fields[0].options.map((o) => o.label);
  const out = [];
  if (opts.length !== rotulos.length) out.push(`opções: fonte ${rotulos.length}, código ${opts.length}`);
  rotulos.forEach((r, i) => { if (opts[i] !== r) out.push(`opção ${i}: código "${opts[i]}" ≠ composição "${r}"`); });
  if (f.fields[0].label !== null && f.fields[0].label === 'Item') out.push('rótulo do campo "Item" não existe na fonte (a fonte não rotula a grade de seleção)');
  if (f.note !== null) out.push('note: ' + f.note);
  return out;
}

// ---------- montagem por instrumento ----------
const AULA_NUM = { a01: 1, a02: 2, a03: 3, a04: 4, a05: 5, a06: 6, a07: 7 };
function base(num) {
  const mk = instMarks[+num - 1];
  if (mk.idl !== `Inst · ${num}`) throw new Error('ordem inesperada ' + mk.idl);
  const blk = B[num];
  const aula = AULA_NUM[mk.secao.id] ? {
    id_fonte: `section#${mk.secao.id}`, numero: AULA_NUM[mk.secao.id], rotulo: mk.secao_rotulo.rotulo, h2: mk.secao_rotulo.h2,
    id_codigo: `aula-07-${pad(AULA_NUM[mk.secao.id])}`,
  } : null;
  return {
    id: `m07-inst-${num}`,
    camada: 'fonte',
    rotulo_fonte: mk.idl,
    titulo: mk.nm,
    escopo: aula ? 'aula' : 'modulo',
    aula,
    aula_nota: aula ? null : 'Vive no § MAP (section#map), fora de qualquer aula: instrumento de módulo (Recursos do Módulo).',
    posicao_no_texto: {
      secao: `section#${mk.secao.id} (${mk.secao_rotulo.marcador} · ${mk.secao_rotulo.rotulo})`,
      subsecao: mk.h3,
      bloco_anterior: mk.antes,
      bloco_seguinte: mk.depois,
      linha_inicio_markup: lineOf(mk.idx),
      linha_fim_markup: lineOf(mk.end),
    },
    invocacoes_no_texto: invocacoes(num, mk),
    intro: { html: inner(mk.intro[1]), texto: texto(mk.intro[1]), origem: origem(`#${mk.secao.id} .inst .inst-intro`, ini(mk.intro[1]), mk.idx + mk.block.indexOf(mk.intro[0])) },
    pergunta: null,
    pergunta_nota: 'A fonte não formula uma pergunta própria para o instrumento (nenhum título ou intro em forma de pergunta). A intro é instrução de uso; ver `tarefa_declarada_na_fonte` quando a intro pede previsão antes do clique.',
    aviso_didatico: { html: inner(mk.disc[1]), texto: texto(mk.disc[1]), origem: origem(`#${mk.secao.id} .inst p.disc`, ini(mk.disc[1]), mk.idx + mk.block.indexOf(mk.disc[0])) },
    fonte_dos_numeros: null,
    fonte_dos_numeros_nota: 'A fonte não cita procedência externa para os valores; o p.disc declara o instrumento "Didático/ilustrativo" (texto em `aviso_didatico`). P19 se aplica por analogia na camada Alexandria.',
    tolerancias: null,
    tolerancias_nota: 'Nenhuma tolerância declarada na fonte.',
    script: { bloco: `/* INST ${num} — … */`, linha_inicio: lineOf(blk.start), linha_fim: lineOf(blk.end) - 1 },
  };
}

const out = [];

// ===== INST 01 =====
{
  const num = '01'; const b = base(num); const blk = B[num];
  const N = literalAfter(html, 'var N=', blk.start);
  const ORD = literalAfter(html, 'var ORD=', blk.start);
  const AUT = literalAfter(html, 'var AUT=', blk.start);
  const DAD = literalAfter(html, 'var DAD=', blk.start);
  const INFO = literalAfter(html, 'var INFO=', blk.start);
  const LEGS = literalAfter(html, 'var LEGS=', blk.start);
  const segLb = one(/<div class="seg-lb">([^<]*)<\/div>/, body, 0);
  const segBtns = sim.$('i1-seg').staticKids;
  const svgAria = one(/aria-label="([^"]*)"/, blk.text, blk.start);
  const fichas = ORD.value.map((k, i) => {
    const d = INFO.value[k];
    const at = idxOfString(d.t, INFO.start, INFO.end);
    return {
      indice: i, chave: k, sigla: N.value[k].l, subrotulo_no_grafo: N.value[k].s,
      kicker: d.k, titulo: d.t, corpo_html: d.b, linhas: linhas(d.r, at), leitura_html: d.l, leitura_texto: texto(d.l),
      origem: origemScript(num, d.t, at),
    };
  });
  const aresta = (arr, lit) => arr.map(([a, bb, lbl, bow]) => ({ de: a, para: bb, rotulo: lbl, curvatura: bow, linha_aprox: lineOf(idxOfString(`'${lbl}'`, lit.start, lit.end)) }));
  // estados simulados: fluxo x orgao
  const chipsEl = sim.$('i1-chips');
  const kids = chipsEl.querySelectorAll('.tl-chip');
  const estadoPadrao = { fluxo: 'aut', orgao: 'cnpe', legenda_html: null, painel_html: null };
  // o script ja chamou chips(...sel(0)) e draw() no carregamento
  sim.$('i1-seg').staticKids[0].fire('click');
  estadoPadrao.legenda_html = sim.$('i1-leg').innerHTML;
  estadoPadrao.painel_html = sim.$('i1-panel').innerHTML;
  const legendas = segBtns.map((btn) => { btn.fire('click'); return { fluxo: btn.attrs['data-f'], legenda_html: sim.$('i1-leg').innerHTML, legenda_texto: texto(sim.$('i1-leg').innerHTML), svg_com_rotulos_de_aresta: btn.attrs['data-f'] !== 'amb' }; });
  // comparacao com o codigo
  const cod = INST_MOD.find((x) => x.id === 'm07-inst-01');
  const div = [];
  fichas.forEach((f, i) => {
    const o = ORGAOS[i];
    if (!o) { div.push(`ficha ${f.chave} ausente`); return; }
    if (o.id !== f.chave) div.push(`ordem: código ${o.id} × fonte ${f.chave}`);
    if (o.sigla !== f.sigla) div.push(`sigla ${f.chave}: "${o.sigla}" × "${f.sigla}"`);
    if (o.kicker !== f.kicker) div.push(`kicker ${f.chave} difere`);
    if (o.titulo !== f.titulo) div.push(`titulo ${f.chave} difere`);
    if (o.corpo !== f.corpo_html) div.push(`corpo ${f.chave} difere`);
    if (o.leitura !== f.leitura_html) div.push(`leitura ${f.chave} difere`);
    if (JSON.stringify(o.linhas) !== JSON.stringify(f.linhas.map((l) => [l.chave_html, l.valor_html]))) div.push(`linhas ${f.chave} diferem`);
  });
  for (const k of Object.keys(LEGS.value)) {
    if (LEGENDAS[k] !== texto(LEGS.value[k])) div.push(`legenda "${k}": código "${LEGENDAS[k]}" × texto da fonte "${texto(LEGS.value[k])}" (o código concatena os <span> sem separador)`);
  }
  if (cod.fields[1].label !== null) div.push(`campo "${cod.fields[1].label}" (m07-i1-sel): rótulo não existe na fonte — os chips do órgão não têm rótulo`);
  if (cod.note) div.push(`note do código sem origem na fonte: "${cod.note}"`);
  div.push('SVG do grafo (8 nós, 9 arestas de autoridade, 9 de dado, rótulos das arestas) não portado — o código só troca a legenda');
  div.push('veredito do código acrescenta "Fluxo em exibição —" e "Leitura —" como prefixos; a fonte rotula a leitura com <b>Leitura</b> num bloco .lg (panel())');
  out.push({
    ...b,
    mecanica: 'grafo de dois fluxos alternáveis (seletor de 3 botões) + seleção de órgão por chip que abre ficha (panel); sem cálculo',
    kind_no_codigo: cod.kind,
    tarefa_declarada_na_fonte: {
      texto: texto(one(/Use o instrumento abaixo[^<]*<\/p>/, body, 0).m[0]),
      origem: origem('section#map > p (antes do Inst · 01)', 'Use o instrumento abaixo antes de ler as aulas', one(/Use o instrumento abaixo/, body, 0).idx),
      nota: 'Previsão pedida pela própria fonte ("prever o painel de cada nó antes de clicar"), fora do bloco do instrumento.',
    },
    entradas: [
      { id_fonte: 'i1-seg', rotulo: texto(segLb.m[1]), tipo: 'seletor-3-botoes', opcoes: segBtns.map((x) => ({ valor: x.attrs['data-f'], rotulo: x.label })), padrao: segBtns.find((x) => x.attrs.class === 'on').attrs['data-f'], origem: origem('#i1-seg', 'Fluxo exibido', segLb.idx), unidade: null, faixa: null },
      { id_fonte: 'i1-chips', rotulo: null, rotulo_nota: 'A fonte não rotula os chips de órgão.', tipo: 'chips (gerados por script)', opcoes: ORD.value.map((k) => ({ valor: k, rotulo: N.value[k].l })), padrao: 'cnpe', padrao_nota: 'chips(...) chama sel(0) → ORD[0]', origem: origemScript(num, 'var ORD=', ORD.markerAt), unidade: null, faixa: null },
    ],
    saidas: [
      { id_fonte: 'i1-svg', rotulo: null, tipo: 'svg', descricao_fonte: svgAria.m[1], formula: 'draw(): arestas AUT (cor #F59E0B) se flow ∈ {aut, amb}; arestas DAD (cor #06B6D4) se flow ∈ {dad, amb}; rótulos das arestas só quando flow ≠ amb (one=(flow!==\'amb\')); nós fora do selecionado com opacidade .34', linha_aprox: lineOf(svgAria.idx) },
      { id_fonte: 'i1-leg', rotulo: null, tipo: 'legenda (LEGS[flow])' },
      { id_fonte: 'i1-panel', rotulo: null, tipo: 'ficha (panel(d.k,d.t,d.b,d.r,d.l))', formula: 'pan.innerHTML=panel(d.k,d.t,d.b,d.r,d.l) — o fluxo NÃO altera a ficha (show() ignora flow)' },
    ],
    grafo: {
      nos: ORD.value.map((k) => ({ chave: k, rotulo: N.value[k].l, subrotulo: N.value[k].s, x: N.value[k].x, y: N.value[k].y, largura: N.value[k].w ?? null })),
      arestas_autoridade: aresta(AUT.value, AUT),
      arestas_dado: aresta(DAD.value, DAD),
      origem: origemScript(num, 'var N={', N.markerAt),
    },
    legendas: Object.entries(LEGS.value).map(([k, v]) => ({ fluxo: k, html: v, texto: texto(v), linha_aprox: lineOf(idxOfString(`${k}:'`, LEGS.start, LEGS.end)) })),
    legendas_renderizadas: legendas,
    fichas,
    rotulo_leitura_no_painel: { texto: 'Leitura', origem: origem('script › function panel()', LEITURA_DEFAULT, html.indexOf(LEITURA_DEFAULT, PANEL_FN.idx)) },
    cenario_padrao: { entradas: { fluxo: 'aut', orgao: 'cnpe' }, legenda_texto: texto(estadoPadrao.legenda_html), ficha: 'cnpe', painel_html: estadoPadrao.painel_html },
    ramos: null,
    ramos_nota: 'Sem ramos condicionais de leitura: a ficha é fixa por órgão; o fluxo só muda o desenho e a legenda.',
    codigo: { status: 'divergente', id_codigo: 'm07-inst-01', onde: 'MODULO_07_INSTRUMENTOS + M07_INST01_ORGAOS/LEGENDAS (alexandria-modulo-07-content.ts); calculadora m07i1M08 (alexandria-instrument-calculators.ts)', divergencias: div },
  });
}

// ===== exploradores com panel(k,n,b,r,l) =====
function explorador(num, shape, mecanica, hostId, cls) {
  const b = base(num);
  const itens = itensExplorador(num, shape);
  const panelId = `i${+num}-panel`;
  const estados = clickAll(sim, hostId, cls, [panelId, ...(sim.$(`i${+num}-out`) ? [`i${+num}-out`] : [])]);
  itens.forEach((it, i) => { it.painel_renderizado_html = estados[i][panelId]; if (estados[i][`i${+num}-out`] !== undefined) it.cartoes_renderizados_html = estados[i][`i${+num}-out`]; });
  const rotulosCod = itens.map((it) => shape === '05' ? `${it.kicker} · ${it.rotulo_chip}` : `${it.kicker} · ${it.titulo}`);
  const compor = (it) => {
    const partes = [{ nome: 'corpo (b)', valor: it.corpo_html }];
    (it.linhas || []).forEach((l, j) => partes.push({ nome: `linha ${j + 1} (${l.chave_texto})`, valor: l.valor_html }));
    (it.cartoes || []).forEach((c, j) => partes.push({ nome: `cartão ${j + 1}`, valor: c.valor_html }));
    partes.push({ nome: 'leitura (l)', valor: it.leitura_html });
    if (shape === '05') partes.push({ nome: 'título do painel (t)', valor: it.titulo });
    return { rotulo: shape === '05' ? `${it.kicker} · ${it.rotulo_chip}` : `${it.kicker} · ${it.titulo}`, partes };
  };
  const cmp = compararExplorador(num, itens, compor);
  const instId = `m07-inst-${num}`;
  const cod = fieldCodigo(instId);
  const divs = [...cmp.achados, ...compararOpcoes(instId, rotulosCod)];
  if (itens[0].cartoes) {
    const labs = cardsLabels(num).map((c) => c.rotulo);
    const faltam = labs.filter((l) => !(EXPL[num] || []).some((c) => c.corpo.includes(l)));
    if (faltam.length) divs.push(`rótulos dos seis cartões ausentes do código (${faltam.join(', ')}): os valores viram uma linha única separada por " · "`);
  }
  if ((it0 => it0.linhas)(itens[0])) {
    const cod0 = (EXPL[num] || [])[0];
    if (cod0 && itens[0].linhas.length && !cod0.corpo.includes(itens[0].linhas[0].chave_texto + ' · ')) divs.push('rótulo das linhas da ficha não segue o formato "chave · valor"');
  }
  const aulaCod = aulaCodigoDe(instId);
  if (b.aula && aulaCod !== b.aula.id_codigo) divs.push(`aula no código: ${aulaCod} × fonte ${b.aula.id_codigo}`);
  return {
    ...b,
    mecanica,
    kind_no_codigo: cod ? cod.kind : null,
    entradas: [{
      id_fonte: hostId, rotulo: null, rotulo_nota: 'A grade/chips de seleção não tem rótulo na fonte.', tipo: `seleção única (${cls.slice(1)} gerados por script)`,
      opcoes: itens.map((it) => ({ valor: it.indice, rotulo: shape === '05' ? it.rotulo_chip : `${it.kicker} · ${it.titulo}`, rotulo_nota: shape === '05' ? null : 'composição kicker · título (o chip mostra os dois, sem separador textual)' })),
      padrao: 0, padrao_nota: 'grid()/chips() chama sel(0) no carregamento', unidade: null, faixa: null,
    }],
    saidas: [
      { id_fonte: panelId, tipo: 'painel (panel())', formula: shape === '05' ? "p.innerHTML=panel(d.k+' · '+d.n,d.t,d.b,d.r,d.l)" : (itens[0].cartoes ? 'p.innerHTML=panel(d.k,d.n,d.b,null,d.l)' : 'p.innerHTML=panel(d.k,d.n,d.b,d.r,d.l)') },
      ...(itens[0].cartoes ? [{ id_fonte: `i${+num}-out`, tipo: 'seis cartões (cards(d.c))', formula: 'o.innerHTML=cards(d.c)', rotulos_dos_cartoes: cardsLabels(num) }] : []),
    ],
    cenario_padrao: { entradas: { selecao: 0 }, item: itens[0].titulo, painel_html: itens[0].painel_renderizado_html },
    ramos: null,
    ramos_nota: 'Sem ramos: cada seleção revela o item correspondente do array D.',
    rotulo_leitura_no_painel: { texto: 'Leitura', origem: origem('script › function panel()', LEITURA_DEFAULT, html.indexOf(LEITURA_DEFAULT, PANEL_FN.idx)) },
    itens,
    codigo: {
      status: divs.length ? 'divergente' : 'portado', id_codigo: instId, aula_codigo: aulaCod,
      onde: 'INSTRUMENTOS_MODULO_07 + MODULO_07_EXPLORADORES (alexandria-modulo-07-content.ts); explorar07() (alexandria-instrument-calculators.ts)',
      divergencias: divs, por_item: cmp.por_item,
    },
  };
}

out.push(explorador('02', 'std', 'seleção única revela ficha do instrumento jurídico (explorador na forma; a fonte o chama "Comparador")', 'i2-grid', '.tr-chip'));
out.push(explorador('03', 'std', 'seleção única (pergunta) revela ficha do documento', 'i3-grid', '.tr-chip'));

// ===== INST 04 e 06 (parametricos) =====
function parametrico(num, keys, calcKey) {
  const b = base(num); const blk = B[num]; const mk = instMarks[+num - 1];
  const LB = literalAfter(html, 'var LB=', blk.start).value;
  const CO = literalAfter(html, 'var CO=', blk.start).value;
  const fields = [...mk.block.matchAll(/<div class="field"><label class="field-label">([\s\S]*?) <span class="unit">([^<]*)<\/span><\/label>\s*<input type="number" id="([^"]+)" value="([^"]+)" min="([^"]+)" max="([^"]+)" step="([^"]+)">\s*<input type="range" id="([^"]+)" min="([^"]+)" max="([^"]+)" step="([^"]+)" value="([^"]+)">/g)]
    .map((m) => ({
      id_fonte: m[8], id_numero_gemeo: m[3], rotulo: texto(m[1]), unidade: m[2], tipo: 'range + number (campo lógico único)',
      faixa: { min: +m[5], max: +m[6], passo: +m[7] }, padrao: +m[4],
      range_confere_com_number: m[9] === m[5] && m[10] === m[6] && m[11] === m[7] && m[12] === m[4],
      origem: origem(`#${m[8]}`, texto(m[1]), mk.idx + m.index),
    }));
  if (fields.length !== keys.length) throw new Error('campos ' + num);
  const ro = [...mk.block.matchAll(/<div class="ro"><div class="k">([^<]*)<\/div><div class="(n[^"]*)" id="([^"]+)">/g)]
    .map((m) => ({ id_fonte: m[3], rotulo: m[1], classe: m[2] }));
  // formulas: linhas exatas do upd()
  const upd = one(/function upd\(\)\{/, blk.text, blk.start);
  const updClose = matchBracket(html, upd.idx + upd.m[0].length - 1);
  const updTxt = html.slice(upd.idx, updClose + 1);
  const linhaDe = (s) => { const at = html.indexOf(s, upd.idx); if (at < 0 || at > updClose) throw new Error('trecho ausente: ' + s); return { expressao: s, linha_aprox: lineOf(at) }; };
  const vFn = one(/function v\(id\)\{[^\n]*\}/, blk.text, blk.start);
  // ramos: cada atribuicao txt= / reg= / av= / cls= com a condicao que a precede
  const ramos = [];
  const reBranch = /(if\(([^)]*(?:\)[^)]*)*?)\)\{|else if\(([^{]*)\)\{|else\s*\{|if\(([^{]*)\) |else if\(([^{]*)\) |else )/g;
  // abordagem por linha: percorre as linhas do upd() e agrupa atribuicoes por condicao
  const ls = updTxt.split('\n');
  const upStartLine = lineOf(upd.idx);
  let cond = null;
  ls.forEach((ln, j) => {
    const t = ln.trim();
    const lnNo = upStartLine + j;
    let m;
    if ((m = /^(?:\}\s*)?(else if|if)\((.*)\)\s*\{\s*$/.exec(t))) { cond = { tipo: m[1], condicao: m[2] }; return; }
    if (/^(?:\}\s*)?else\s*\{\s*$/.test(t)) { cond = { tipo: 'else', condicao: null }; return; }
    if (t === '}') { cond = null; return; }
    // linha inline com chaves (Inst 04, L2427-2430): if(x){ reg='..'; } / else if(x){ reg='..'; } / else { reg='..'; }
    // (verificador adversarial 2026-09-17: antes esta forma nao era capturada e os 4 ramos de reg do Inst 04 ficavam fora do JSON)
    if ((m = /^(else if|if)\((.*?)\)\s*\{\s*(reg|av)(\+?=)(.*?);\s*\}$/.exec(t))) { ramos.push({ variavel: m[3], ramo: m[1], condicao: m[2], operador: m[4], expressao_fonte: m[5], linha_aprox: lnNo }); return; }
    if ((m = /^else\s*\{\s*(reg|av)(\+?=)(.*?);\s*\}$/.exec(t))) { ramos.push({ variavel: m[1], ramo: 'else', condicao: null, operador: m[2], expressao_fonte: m[3], linha_aprox: lnNo }); return; }
    // linha inline: if(x) reg='..'; / else if(x) av='..'; / else av='..';
    if ((m = /^(else if|if)\((.*?)\)\s*(reg|av)(\+?=)(.*);$/.exec(t))) { ramos.push({ variavel: m[3], ramo: m[1], condicao: m[2], operador: m[4], expressao_fonte: m[5], linha_aprox: lnNo }); return; }
    if ((m = /^else\s+(reg|av)(\+?=)(.*);$/.exec(t))) { ramos.push({ variavel: m[1], ramo: 'else', condicao: null, operador: m[2], expressao_fonte: m[3], linha_aprox: lnNo }); return; }
    if ((m = /^(txt|cls)=(.*);$/.exec(t)) && cond) { ramos.push({ variavel: m[1], ramo: cond.tipo, condicao: cond.condicao, operador: '=', expressao_fonte: m[2], linha_aprox: lnNo }); return; }
    if ((m = /^var cap=(.*);$/.exec(t))) { ramos.push({ variavel: 'cap', ramo: 'sempre', condicao: null, operador: '=', expressao_fonte: m[1], linha_aprox: lnNo }); }
  });
  // cenario padrao e grade: roda o original
  const setRun = (vals) => {
    keys.forEach((k, j) => { sim.$(k).value = String(vals[j]); });
    sim.$(keys[0]).fire('input');
    const o = {};
    for (const r of ro) o[r.id_fonte] = sim.$(r.id_fonte).innerHTML;
    const vdEl = sim.$(`i${+num}-vd`);
    return { saidas: o, veredito_html: vdEl.innerHTML, veredito_classe: vdEl.className };
  };
  const padrao = fields.map((f) => f.padrao);
  const cen = setRun(padrao);
  // grade de verificacao contra o codigo
  const { fn, linha } = calcFn(calcKey);
  const grids = {
    '04': [[0, 1, 10, 45, 180], [15, 120, 540], [0, 1, 45, 180], [10, 90, 540], [7, 60, 360], [0, 1, 29, 30, 89, 90, 179, 180, 730]],
    '06': [[1, 2, 8, 30], [2, 3, 12, 45], [0, 1, 3, 4, 5, 30], [1, 2, 3, 6, 30], [1, 4, 30]],
  }[num];
  const combos = [];
  const rec = (j, acc) => { if (j === grids.length) { combos.push(acc); return; } for (const v of grids[j]) rec(j + 1, [...acc, v]); };
  rec(0, []);
  let difVer = 0, difVal = 0, difReg = 0; const exemplos = [];
  const regFont = {}; const branchCount = {};
  for (const c of combos) {
    const o = setRun(c);
    const inp = {}; keys.forEach((k, j) => { inp[`${k}-n`] = c[j]; });
    const r = fn(inp);
    branchCount[o.veredito_classe + ' | ' + texto(o.veredito_html).slice(0, 40)] = (branchCount[o.veredito_classe + ' | ' + texto(o.veredito_html).slice(0, 40)] || 0) + 1;
    if (r.veredito !== o.veredito_html) { difVer++; if (exemplos.length < 3) exemplos.push({ entradas: c, fonte: o.veredito_html, codigo: r.veredito }); }
    for (const rr of ro) {
      if (rr.classe.includes('sm')) continue;
      const fv = +texto(o.saidas[rr.id_fonte]).replace(/[^\d,-]/g, '').replace(',', '.');
      if (r.valores[rr.id_fonte] !== fv) difVal++;
    }
  }
  const codInst = fieldCodigo(`m07-inst-${num}`);
  const divs = [];
  codInst.fields.forEach((cf, j) => {
    const f = fields[j];
    if (cf.label !== f.rotulo) divs.push(`campo ${j}: rótulo "${cf.label}" × "${f.rotulo}"`);
    if (cf.unit !== f.unidade) divs.push(`campo ${j}: unidade "${cf.unit}" × "${f.unidade}"`);
    if (cf.min !== f.faixa.min || cf.max !== f.faixa.max || cf.step !== f.faixa.passo || cf.defaultValue !== f.padrao) divs.push(`campo ${j}: faixa/padrão diferem`);
  });
  const numRo = ro.filter((r) => !r.classe.includes('sm'));
  codInst.outputs.forEach((co, j) => {
    const r = numRo[j];
    if (!r || co.id !== r.id_fonte || co.label !== r.rotulo) divs.push(`saída ${j}: código ${co.id}/"${co.label}" × fonte ${r && r.id_fonte}/"${r && r.rotulo}"`);
    if (co.unit === null) divs.push(`saída ${co.id}: unit null no código; a fonte imprime "<span class="u">dias</span>" no readout`);
  });
  const regRo = ro.find((r) => r.classe.includes('sm'));
  divs.push(`readout "${regRo.rotulo}" (${regRo.id_fonte}, texto) não é saída no código; a fonte o exibe como quarto readout`);
  divs.push('barras (bar-row por etapa, com cores CO) não portadas');
  divs.push('classe do veredito (ok/att/per) não portada: o código devolve só o texto');
  if (difVer) divs.push(`veredito difere em ${difVer} de ${combos.length} combinações da grade`);
  if (difVal) divs.push(`valores numéricos diferem em ${difVal} comparações`);
  const aulaCod = aulaCodigoDe(`m07-inst-${num}`);
  if (aulaCod !== b.aula.id_codigo) divs.push(`aula no código: ${aulaCod}`);
  return {
    ...b,
    mecanica: 'campos de prazo (range+number) → soma e razões → readouts + regime (texto) + veredito por ramo',
    kind_no_codigo: codInst.kind,
    entradas: fields,
    leitor_de_entrada: { expressao_fonte: vFn.m[0], linha_aprox: lineOf(vFn.idx), nota: 'parseFloat(e.value)||0 — lê o range; campo numérico só sincroniza o range no change (link(), com clamp à faixa).' },
    // verificação 3a passada: cada etapa ganha origem (linha do literal em var LB)
    etapas_barras: LB.map((l, j) => { const i0 = html.indexOf(`'${l}'`, html.indexOf('var LB=', blk.start)); return { rotulo: l, cor: CO[j], origem: { seletor: `script › INST·${num} › var LB[${j}] / var CO[${j}]`, trecho_inicial: l, linha_aprox: lineOf(i0) } }; }),
    // 2a passada (2026-09-17): rotulo do campo (markup) × rotulo da barra (LB do script), comparados, nao digitados
    divergencias_fonte: fields.flatMap((f, j) => (LB[j] !== f.rotulo ? [{
      id: `div-m07-inst-${num}-rotulo-etapa-${j}`,
      tipo: 'fonte × fonte',
      leitura_a: { texto: f.rotulo, onde: `label do campo #${f.id_fonte} (markup)`, linha_aprox: f.origem.linha_aprox },
      leitura_b: { texto: LB[j], onde: `var LB[${j}] (rótulo da barra da etapa, script)`, linha_aprox: lineOf(html.indexOf('var LB=', blk.start)) },
      nota: 'A mesma etapa tem dois rótulos na fonte: o do campo de entrada e o da barra renderizada. Não resolvido aqui.',
    }] : [])),
    saidas: ro.map((r) => ({ ...r, unidade_impressa: r.classe.includes('sm') ? null : 'dias', tipo: r.classe.includes('sm') ? 'texto' : 'numero' })),
    formulas: num === '04' ? [
      linhaDe('var tot=a+b+c+d+e+f;'), linhaDe('var jan=a+c;'), linhaDe('var r=tot>0?jan/tot:0;'),
      linhaDe("$id('i4-tot').innerHTML=num(tot,0)+'<span class=\"u\">dias</span>';"),
      linhaDe("$id('i4-jan').innerHTML=num(jan,0)+'<span class=\"u\">dias</span>';"),
      linhaDe("$id('i4-avi').innerHTML=num(f,0)+'<span class=\"u\">dias</span>';"),
      linhaDe("$id('i4-reg').textContent=reg;"),
    ] : [
      linhaDe('var tot=a+b+c+d+e, fol=c+d, prev=a+b;'),
      linhaDe("$id('i6-tot').innerHTML=num(tot,0)+'<span class=\"u\">dias</span>';"),
      linhaDe("$id('i6-jan').innerHTML=num(c,0)+'<span class=\"u\">dias</span>';"),
      linhaDe("$id('i6-fol').innerHTML=num(fol,0)+'<span class=\"u\">dias</span>';"),
      linhaDe("$id('i6-reg').textContent=reg;"),
    ],
    funcoes_auxiliares: [
      { expressao_fonte: one(/function num\(v,d\)\{[^\n]*\}/, html).m[0], linha_aprox: lineOf(one(/function num\(v,d\)\{/, html).idx) },
      { expressao_fonte: one(/function dias\(v\)\{[^\n]*\}/, html).m[0], linha_aprox: lineOf(one(/function dias\(v\)\{/, html).idx) },
      { expressao_fonte: one(/function vd\(el,cls,txt\)\{[^\n]*\}/, html).m[0], linha_aprox: lineOf(one(/function vd\(el,cls,txt\)\{/, html).idx) },
    ],
    ramos,
    ramos_nota: 'expressao_fonte é o texto exato do script (concatenação JS com interpolação). A ordem é a do if/else. A classe (cls) do veredito é "ok"/"att"/"per".',
    cenario_padrao: { entradas: Object.fromEntries(fields.map((f) => [f.id_fonte, f.padrao])), saidas_html: cen.saidas, saidas_texto: Object.fromEntries(Object.entries(cen.saidas).map(([k, v]) => [k, texto(v)])), veredito_classe: cen.veredito_classe, veredito_html: cen.veredito_html },
    verificacao_codigo: { grade: grids, combinacoes: combos.length, vereditos_diferentes: difVer, valores_diferentes: difVal, exemplos_de_diferenca: exemplos, ramos_exercitados: branchCount, calculadora: `alexandria-instrument-calculators.ts L${linha}` },
    codigo: { status: divs.length > 3 ? 'divergente' : 'portado', status_nota: 'Cálculo e veredito conferidos contra o original na grade; divergências abaixo são de apresentação (readout textual, barras, classe).', id_codigo: `m07-inst-${num}`, aula_codigo: aulaCod, onde: 'INSTRUMENTOS_MODULO_07 (alexandria-modulo-07-content.ts); calculadora (alexandria-instrument-calculators.ts)', divergencias: divs },
  };
}
out.push(parametrico('04', ['i4-a', 'i4-b', 'i4-c', 'i4-d', 'i4-e', 'i4-f'], 'm07-inst-04'));
out.push(explorador('05', '05', 'seleção única (horizonte, por chip) revela ficha do produto operativo', 'i5-chips', '.tl-chip'));
out.push(parametrico('06', ['i6-a', 'i6-b', 'i6-c', 'i6-d', 'i6-e'], 'm07-inst-06'));
out.push(explorador('07', 'std', 'seleção única (sintoma) revela ficha do travamento', 'i7-grid', '.tr-chip'));
{
  const x = explorador('08', 'std', 'seleção única (tipo de decisão) revela painel + seis cartões de roteamento', 'i8-grid', '.tr-chip');
  x.tarefa_declarada_na_fonte = {
    texto: 'Use-o como treino ativo: leia o tipo de decisão, responda os seis campos de cabeça, e só então clique.',
    origem: origem('#a07 .inst .inst-intro (Inst · 08)', 'Use-o como treino ativo', html.indexOf('Use-o como treino ativo')),
    nota: 'Previsão pedida pela própria fonte antes da revelação; reforçada na mensagem de reprovação do quiz ("repasse o Inst·08 respondendo os seis campos de cabeça antes de clicar").',
  };
  out.push(x);
}
out.push(explorador('09', 'std', 'seleção única (dado) revela painel + seis cartões de localização', 'i9-grid', '.tr-chip'));

// ===== INST 10 =====
{
  const num = '10'; const b = base(num); const blk = B[num];
  const M = literalAfter(html, 'var M=', blk.start);
  const fixoAt = html.indexOf('var FIXO=', blk.start);
  const fixoEnd = html.indexOf(';\n', fixoAt);
  const fixoExpr = html.slice(fixoAt + 'var FIXO='.length, fixoEnd);
  const FIXO = new Function('return ' + fixoExpr)();
  const bodyLit = one(/p\.innerHTML=panel\('Mês '\+\(k\+1\)\+' de 12',d\.n,\s*'([^']*)',/, blk.text, blk.start);
  const btn = one(/s\+='<button class="cal-m'[\s\S]*?<\/button>';/, blk.text, blk.start);
  let cur = M.start;
  const estados = clickAll(sim, 'i10-cal', '.cal-m', ['i10-panel']);
  const itens = M.value.map((d, i) => {
    const at = idxOfString(`m:'${d.m}'`, cur, M.end); cur = at + 1;
    return {
      indice: i, rotulo_chip: d.m, nome: d.n, contagem_exibida_no_chip: d.e, rotulo_fixo_no_chip: 'ciclo anual',
      ciclo_anual: d.a.map((a, j) => ({ rotulo_renderizado: `Ciclo anual · ${j + 1}`, texto: a, linha_aprox: lineOf(idxOfString(a, at, M.end)) })),
      o_que_fazer_no_mes_html: d.f, o_que_fazer_no_mes_texto: texto(d.f),
      kicker_renderizado: `Mês ${i + 1} de 12`,
      painel_renderizado_html: estados[i]['i10-panel'],
      origem: origemScript(num, `m:'${d.m}'`, at),
    };
  });
  const cod = EXPL['10'] || [];
  const div = [];
  itens.forEach((it, i) => {
    const c = cod[i];
    if (!c) { div.push(`mês ${it.rotulo_chip} ausente`); return; }
    if (c.rotulo !== `${it.rotulo_chip} · ${it.nome}`) div.push(`rótulo ${i}: "${c.rotulo}"`);
    if (!c.corpo.startsWith(String(it.contagem_exibida_no_chip) + '\n')) div.push(`mês ${it.rotulo_chip}: corpo não começa pela contagem`);
    if (!c.corpo.includes(it.o_que_fazer_no_mes_html)) div.push(`mês ${it.rotulo_chip}: "o que fazer" ausente`);
    it.ciclo_anual.forEach((a) => { if (!c.corpo.includes(a.texto)) div.push(`mês ${it.rotulo_chip}: ciclo anual ausente`); });
  });
  div.push('o corpo portado começa pelo número "3" (o campo `e`, contagem mostrada no chip) como se fosse texto, em todos os 12 meses');
  if (!cod.some((c) => c.corpo.includes(FIXO))) div.push('camada fixa (FIXO, "Camada fixa") ausente do código');
  if (!cod.some((c) => c.corpo.includes(bodyLit.m[1]))) div.push('texto explicativo do painel ("O painel separa duas camadas…") ausente do código');
  div.push('rótulos "Ciclo anual · N", "O que fazer no mês", "Mês N de 12" e "ciclo anual" do chip ausentes; os eventos viram uma linha única separada por " · "');
  div.push(...compararOpcoes('m07-inst-10', itens.map((it) => `${it.rotulo_chip} · ${it.nome}`)));
  out.push({
    ...b,
    mecanica: 'seleção de mês (12 botões) revela eventos de ciclo anual + ação do mês, sobre uma camada fixa comum a todos os meses',
    kind_no_codigo: fieldCodigo('m07-inst-10').kind,
    entradas: [{ id_fonte: 'i10-cal', rotulo: null, rotulo_nota: 'O calendário não tem rótulo na fonte.', tipo: 'seleção única (12 botões .cal-m)', opcoes: itens.map((it) => ({ valor: it.indice, rotulo: it.rotulo_chip, nome: it.nome })), padrao: 0, padrao_nota: 'sel(0) no carregamento', unidade: null, faixa: null }],
    chip_template: { expressao_fonte: btn.m[0].replace(/\s+/g, ' '), linha_aprox: lineOf(btn.idx) },
    saidas: [{ id_fonte: 'i10-panel', tipo: 'painel', formula: "p.innerHTML=panel('Mês '+(k+1)+' de 12',d.n, <texto fixo>, rows, FIXO, 'Camada fixa'); rows = ['Ciclo anual · '+(x+1), d.a[x]] … + ['O que fazer no mês','<b>'+d.f+'</b>']" }],
    texto_fixo_do_painel: { html: bodyLit.m[1], texto: texto(bodyLit.m[1]), origem: origemScript(num, ini(bodyLit.m[1]), bodyLit.idx) },
    camada_fixa: { rotulo: 'Camada fixa', texto_concatenado: FIXO, texto_concatenado_nota: 'valor da expressão var FIXO (quatro literais unidos por +); cada literal está verbatim em expressao_fonte', expressao_fonte: fixoExpr.replace(/\s+/g, ' '), origem: origemScript(num, 'var FIXO=', fixoAt) },
    cenario_padrao: { entradas: { mes: 0 }, item: 'Janeiro', painel_html: itens[0].painel_renderizado_html },
    ramos: null,
    ramos_nota: 'Sem ramos: seleção revela o mês.',
    itens,
    codigo: { status: 'divergente', id_codigo: 'm07-inst-10', aula_codigo: aulaCodigoDe('m07-inst-10'), onde: 'INSTRUMENTOS_MODULO_07 + MODULO_07_EXPLORADORES["10"]', divergencias: [...new Set(div)] },
  });
}

out.sort((a, b2) => a.id.localeCompare(b2.id));

const contagens = {
  instrumentos: out.length,
  de_modulo: out.filter((x) => x.escopo === 'modulo').length,
  de_aula: out.filter((x) => x.escopo === 'aula').length,
  por_aula: Object.fromEntries(Object.entries(out.filter((x) => x.aula).reduce((a, x) => { a[x.aula.id_codigo] = (a[x.aula.id_codigo] || 0) + 1; return a; }, {}))),
  itens_por_instrumento: Object.fromEntries(out.map((x) => [x.id, (x.itens || x.fichas || x.entradas).length])),
  status_codigo: Object.fromEntries(out.map((x) => [x.id, x.codigo.status])),
  declarado_no_hero: 10,
  divergencias_fonte: out.reduce((n, x) => n + (x.divergencias_fonte || []).length, 0),
};

writeJSON('instrumentos.json', {
  modulo: 'M07',
  camada: 'fonte',
  fonte: 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo07.html',
  gerado_por: 'extratores/m07_instrumentos.mjs',
  metodo: 'Markup lido por regex ancorada em div.inst; dados avaliados dos literais var D / var M / var N / INFO / LEGS / AUT / DAD / LB / CO do <script>; estados renderizados obtidos executando o <script> original em DOM simulado (m07_sim.mjs) com clique em cada chip; calculadoras m07-inst-04/06 do código executadas contra o original numa grade de entradas.',
  contagens,
  instrumentos: out,
});
console.log(JSON.stringify(contagens, null, 1));
for (const x of out) console.log(x.id, x.codigo.status, x.codigo.divergencias.length, x.invocacoes_no_texto.length, x.verificacao_codigo ? JSON.stringify([x.verificacao_codigo.combinacoes, x.verificacao_codigo.vereditos_diferentes, x.verificacao_codigo.valores_diferentes]) : '');
