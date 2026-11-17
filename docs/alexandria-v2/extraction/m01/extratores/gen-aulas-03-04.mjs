// Gera aula-03.json/.md e aula-04.json/.md (M01) por extração programática.
// Nenhum texto de conteúdo é digitado à mão: o HTML-fonte é percorrido linha a
// linha por um walker que LANÇA ERRO diante de qualquer linha que não saiba
// classificar (nada é descartado em silêncio). Texto editorial (notas,
// divergências) vive neste arquivo e é conferido contra a fonte pelo verificador.
//
//   node gen-aulas-03-04.mjs        → escreve ../aula-03.{json,md} e ../aula-04.{json,md}
//
// Fonte (SÓ LEITURA): C:/Dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, '..') + '/';
const REPO = path.resolve(HERE, '../../../../..') + '/';
const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const TS_CONTENT = REPO + 'src/lib/data/alexandria-modulo-01-content.ts';
const TS_CALC = REPO + 'src/lib/data/alexandria-instrument-calculators.ts';
const TS_GLOS = REPO + 'src/lib/data/alexandria-glossario.ts';

const raw = fs.readFileSync(SRC, 'utf8');
if (raw.includes('\r')) throw new Error('a fonte tem CR; os números de linha do gerador assumem LF');
const L = raw.split('\n');
const TOTAL_LINHAS = L[L.length - 1] === '' ? L.length - 1 : L.length;
const line = (n) => L[n - 1];

const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const strip = (h) => decode(h.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim(); // tags → ''   (texto)
const stripSp = (h) => decode(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(); // tags → ' '  (tokens)
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const trecho = (s) => strip(s).slice(0, 60);
const assert = (c, m) => { if (!c) throw new Error(m); };
function inner(n, re) {
  const m = line(n).match(re);
  if (!m) throw new Error(`linha ${n} não casou ${re}: ${line(n)}`);
  return m[1];
}
const origem = (ini, fim, seletor, html) => ({ seletor, trecho_inicial: trecho(html ?? ''), linha_aprox: ini, ...(fim && fim !== ini ? { linha_fim_aprox: fim } : {}) });
const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

// ---------------------------------------------------------------- walker
function blockEnd(start, hardEnd) {
  let depth = 0;
  for (let n = start; n <= hardEnd; n++) {
    const s = line(n);
    depth += (s.match(/<div\b/g) || []).length - (s.match(/<\/div>/g) || []).length;
    if (depth === 0) return n;
  }
  throw new Error('div não fecha a partir de ' + start);
}

function walkSection(secStart, secEnd) {
  assert(line(secStart).includes('<section class="aula">'), 'section não abre em ' + secStart);
  assert(line(secEnd).trim() === '</section>', 'section não fecha em ' + secEnd);
  assert(line(secStart + 1).includes('<div class="container">'), 'sem container');
  assert(line(secEnd - 1).trim() === '</div>', 'container não fecha');
  const itens = [];
  let comentario = null;
  let n = secStart + 2;
  while (n < secEnd - 1) {
    const t = line(n).trim();
    if (!t) { n++; continue; }
    if (t.startsWith('<!--')) { comentario = { texto: t, linha: n }; n++; continue; }
    let it;
    if (t.startsWith('<div class="aula-marker">')) it = { tipo: 'marcador', ini: n, fim: n };
    else if (t.startsWith('<h2 class="aula-title">')) it = { tipo: 'h2', ini: n, fim: n };
    else if (t.startsWith('<p class="lead">')) it = { tipo: 'lead', ini: n, fim: n };
    else if (t.startsWith('<h3>')) it = { tipo: 'titulo', ini: n, fim: n };
    else if (t.startsWith('<p>')) { assert(t.endsWith('</p>'), `p multilinha em ${n}`); it = { tipo: 'paragrafo', ini: n, fim: n }; }
    else if (/^<div class="formula">/.test(t)) it = { tipo: 'formula', ini: n, fim: blockEnd(n, secEnd) };
    else if (/^<div class="callout/.test(t)) it = { tipo: 'destaque', ini: n, fim: blockEnd(n, secEnd) };
    else if (/^<div class="ac-dc-vis">/.test(t)) it = { tipo: 'figura', ini: n, fim: blockEnd(n, secEnd) };
    else if (/^<div class="instrument">/.test(t)) it = { tipo: 'instrumento', ini: n, fim: blockEnd(n, secEnd) };
    else if (/^<div class="table-wrap">/.test(t)) it = { tipo: 'tabela', ini: n, fim: blockEnd(n, secEnd) };
    else if (/^<ul\b/.test(t)) {
      let f = n; while (!line(f).includes('</ul>')) f++;
      it = { tipo: 'lista', ini: n, fim: f };
    } else throw new Error(`linha ${n} não reconhecida pelo walker: ${t.slice(0, 120)}`);
    if (comentario) { it.comentario_fonte = comentario; comentario = null; }
    itens.push(it);
    n = it.fim + 1;
  }
  return itens;
}

// ---------------------------------------------------------------- parsers por tipo
function parseFormula(ini, fim) {
  const eq = inner(ini + 1, /<div class="eq">(.*)<\/div>/);
  let desc = null, descLinha = null;
  for (let n = ini + 2; n < fim; n++) {
    const m = line(n).match(/<div class="desc">(.*)<\/div>/);
    if (m) { desc = m[1]; descLinha = n; }
  }
  assert(line(fim).trim() === '</div>', 'formula mal fechada');
  return {
    eq_html: eq, eq_texto: strip(eq),
    desc: desc === null ? null : strip(desc), desc_html: desc,
    ...(desc === null ? { desc_nota: 'div.formula sem div.desc na fonte (medido).' } : {}),
    eq_texto_nota: 'eq_texto é o eq_html sem tags: <sub>/<sup> colam ao texto vizinho ("Pperdas", "I2"). A forma fiel é eq_html.',
    _descLinha: descLinha,
  };
}
function parseCallout(ini, fim) {
  const cls = inner(ini, /<div class="(callout[^"]*)">/);
  const tom = (cls.match(/\bcallout (\w+)/) || [])[1] ?? null;
  let rotulo = null; const ps = [];
  for (let n = ini + 1; n < fim; n++) {
    const a = line(n).match(/<div class="callout-label">(.*)<\/div>/);
    const p = line(n).match(/^\s*<p>(.*)<\/p>\s*$/);
    if (a) rotulo = a[1]; else if (p) ps.push({ html: p[1], linha: n }); else if (line(n).trim()) throw new Error(`callout: linha ${n} inesperada: ${line(n)}`);
  }
  assert(rotulo !== null && ps.length === 1, `callout ${ini}: esperava 1 rótulo e 1 parágrafo (${ps.length})`);
  return { classe_literal: cls, tom, rotulo, rotulo_texto: strip(rotulo), html: ps[0].html, texto: strip(ps[0].html), _pLinha: ps[0].linha };
}
function parseLista(ini, fim) {
  const ul = attrs(line(ini));
  const itens = [];
  for (let n = ini + 1; n < fim; n++) {
    const m = line(n).match(/^\s*<li([^>]*)>(.*)<\/li>\s*$/);
    if (m) itens.push({ html: m[2], texto: strip(m[2]), origem: origem(n, null, 'ul > li', m[2]) });
    else if (line(n).trim()) throw new Error(`lista: linha ${n} inesperada: ${line(n)}`);
  }
  return { ordenada: /^<ol/.test(line(ini).trim()), itens, estilo_inline_nota: 'ul e li levam style inline na fonte (margens/cor): apresentação, não conteúdo; não extraído.', _ulStyle: ul.style ?? null };
}
function parseTabela(ini, fim) {
  let cab = null, cabLinha = null; const linhas = [];
  for (let n = ini; n <= fim; n++) {
    const s = line(n);
    if (/<thead>/.test(s)) { cab = [...s.matchAll(/<th(?:\s[^>]*)?>(.*?)<\/th>/g)].map((m) => ({ html: m[1], texto: strip(m[1]) })); cabLinha = n; }
    else if (/<tr>/.test(s) && /<td/.test(s)) {
      linhas.push({ origem: origem(n, null, 'table > tbody > tr', strip([...s.matchAll(/<td[^>]*>(.*?)<\/td>/g)][0][1])), celulas: [...s.matchAll(/<td((?:\s[^>]*)?)>(.*?)<\/td>/g)].map((m) => ({ html: m[2], texto: strip(m[2]), ...(m[1].trim() ? { atributos: m[1].trim() } : {}) })) });
    }
  }
  assert(cab && linhas.length, 'tabela sem cabeçalho/linhas');
  for (const l of linhas) assert(l.celulas.length === cab.length, 'linha de tabela com nº de células ≠ cabeçalho');
  return { cabecalho: cab, cabecalho_origem: origem(cabLinha, null, 'table > thead > tr', cab[0].html), linhas, n_linhas_dados: linhas.length, n_colunas: cab.length, legenda: null, legenda_nota: 'Sem <caption> na fonte (medido).' };
}
function parseFiguraAcDc(ini, fim) {
  const celulas = [];
  for (let n = ini; n <= fim; n++) {
    if (!/class="ac-dc-cell"/.test(line(n))) continue;
    const cf = blockEnd(n, fim);
    const h5 = inner(n + 1, /<h5>(.*)<\/h5>/);
    const label = inner(n + 2, /<div class="label">(.*)<\/div>/);
    let s0 = null, s1 = null;
    for (let k = n; k <= cf; k++) { if (/<svg\b/.test(line(k))) s0 = k; if (/<\/svg>/.test(line(k))) s1 = k; }
    assert(s0 && s1, 'svg ausente na célula ' + n);
    const svgAttrs = attrs(line(s0));
    const elementos = [];
    for (let k = s0 + 1; k < s1; k++) {
      const m = line(k).match(/^\s*<(line|path)\s+(.*?)\s*\/>\s*$/);
      assert(m, `svg: linha ${k} não é line/path: ${line(k)}`);
      elementos.push({ elemento: m[1], atributos: attrs(m[2]), html: line(k).trim(), origem: { seletor: `svg > ${m[1]}`, trecho_inicial: `<${m[1]}`, linha_aprox: k } });
    }
    const textoSvg = line(s0 + 1) && [...Array(s1 - s0 - 1).keys()].map((i) => line(s0 + 1 + i)).join('').includes('<text');
    // medição derivada do desenho (não é literal da fonte)
    const path = elementos.find((e) => e.elemento === 'path');
    const medido = path ? (() => {
      const cmds = (path.atributos.d.match(/[MQT]/g) || []).join('');
      const meios = (cmds.match(/[QT]/g) || []).length;
      return { comandos_do_path_d: cmds, semiondas_desenhadas: meios, ondas_completas_desenhadas: meios / 2, largura_viewbox: Number(svgAttrs.viewBox.split(' ')[2]) };
    })() : null;
    celulas.push({
      h5, label,
      svg: { viewBox: svgAttrs.viewBox, preserveAspectRatio: svgAttrs.preserveAspectRatio, texto_dentro_do_svg: textoSvg, elementos },
      medido_do_desenho: medido,
      origem: origem(n, cf, 'div.ac-dc-vis > div.ac-dc-grid > div.ac-dc-cell', h5),
    });
  }
  assert(celulas.length === 2, 'esperava 2 células AC×DC');
  return {
    celulas,
    titulo: null, titulo_nota: 'A figura não tem título próprio; o h3 anterior é "AC: o fluxo que oscila" (3.2) e o parágrafo imediatamente anterior descreve o sinal senoidal.',
    unidade: null, unidade_nota: 'Sem eixos, escala, unidade nem legenda numérica: o svg não tem <text> (medido). Os rótulos estão fora do svg, em h5 e div.label.',
    fonte_citada: null, fonte_citada_nota: 'Nenhuma fonte, nota ou p.srcnote acompanha a figura.',
    idioma_nota: 'Os dois h5 estão em inglês ("Direct Current", "Alternating Current — 60 Hz") numa aula em pt-BR cujo texto usa "Corrente contínua (DC)" e "Corrente alternada (AC)". Preservado literal; não traduzido.',
    medido_nota: 'medido_do_desenho conta comandos Q/T do atributo d: é medida do desenho, não afirmação da fonte. A fonte não declara escala de tempo nem que o nº de ondas desenhadas represente 60 Hz.',
    cores_nota: 'DC #06B6D4, AC #F59E0B, tracejados #2A2E38 (atributos stroke, literais). As cores não carregam significado declarado pela fonte.',
  };
}
function parseInstrumento(ini, fim, idPrefix) {
  const title = inner(ini + 2, /<div class="instrument-title">(.*)<\/div>/);
  const idFonte = inner(ini + 3, /<div class="instrument-id">(.*)<\/div>/);
  const entradas = [];
  for (let n = ini; n <= fim; n++) {
    const lm = line(n).match(/<label class="field-label">(.*?) <span class="unit">(.*?)<\/span><\/label>/);
    if (!lm) continue;
    const num = line(n + 1).match(/<input type="number" ([^>]*)>/);
    assert(num, `campo ${n}: input number ausente`);
    const a = attrs(num[1]);
    const rg = line(n + 2).match(/<div class="field-slider"><input type="range" ([^>]*)><\/div>/);
    const ar = rg ? attrs(rg[1]) : null;
    entradas.push({
      id: a.id, rotulo: decode(lm[1]), unidade: decode(lm[2]),
      number: { tipo_input: 'number', padrao: Number(a.value), min: a.min !== undefined ? Number(a.min) : null, max: a.max !== undefined ? Number(a.max) : null, step: Number(a.step), max_nota: a.max === undefined ? 'Sem atributo max no input number.' : null, origem: origem(n + 1, null, `input#${a.id}`, `${decode(lm[1])} ${decode(lm[2])}`) },
      range: ar ? { id: ar.id, padrao: Number(ar.value), min: Number(ar.min), max: Number(ar.max), step: Number(ar.step), origem: origem(n + 2, null, `input#${ar.id}`, `${decode(lm[1])} ${decode(lm[2])}`) } : null,
      origem: origem(n, null, 'div.field', `${decode(lm[1])} ${decode(lm[2])}`),
    });
  }
  assert(entradas.length, 'instrumento sem campos');
  let oLab = null, oLabLinha = null, oId = null, oInit = null, oUnit = null, oLinha = null, nota = null, notaLinha = null;
  for (let n = ini; n <= fim; n++) {
    const s = line(n);
    let m;
    if ((m = s.match(/<span class="output-label">(.*)<\/span>/))) { oLab = m[1]; oLabLinha = n; }
    if ((m = s.match(/<span class="output-value"><span id="([^"]+)">(.*?)<\/span><span class="unit">(.*?)<\/span><\/span>/))) { oId = m[1]; oInit = m[2]; oUnit = m[3]; oLinha = n; }
    if (/<div class="instrument-note">/.test(s)) {
      const partes = []; let k = n + 1;
      while (!/^\s*<\/div>\s*$/.test(line(k))) { partes.push(line(k).trim()); k++; }
      nota = partes.join(' '); notaLinha = n;
    }
  }
  assert(oLab && oId && nota, 'instrumento sem saída/nota');
  return { title, idFonte, entradas, oLab, oLabLinha, oId, oInit, oUnit, oLinha, nota, notaLinha };
}

// ---------------------------------------------------------------- script do instrumento (camada de script)
function lerScript(marcador) {
  const i = L.findIndex((s) => s.includes(marcador)) + 1;
  assert(i > 0, 'script não achado: ' + marcador);
  assert(/^\s*\/\* =+/.test(line(i - 1)), 'cabeçalho do script não está em ' + (i - 1));
  const ini = i + 2; // (function() {
  assert(/\(function\(\) \{/.test(line(ini)), 'IIFE não abre em ' + ini);
  let fim = ini; while (!/^\}\)\(\);\s*$/.test(line(fim))) fim++;
  return { cabecalho: i - 1, ini, fim };
}
function simularScript(ini, fim, casos) {
  // Executa o script ORIGINAL (texto extraído das linhas) contra um DOM mínimo.
  const code = L.slice(ini - 1, fim).join('\n');
  const make = () => {
    const els = {};
    const el = (id, v = '') => (els[id] = { id, value: v, textContent: '', ls: {}, addEventListener(t, f) { (this.ls[t] ||= []).push(f); } });
    return { els, el };
  };
  const rodar = (inicial, evento) => {
    const { els, el } = make();
    for (const [id, v] of Object.entries(inicial)) el(id, v);
    el('i03-out');
    const doc = { getElementById: (id) => els[id] ?? (() => { throw new Error('id inesperado ' + id); })() };
    new Function('document', code)(doc);
    const carregamento = els['i03-out'].textContent;
    if (evento) { for (const [id, v] of Object.entries(evento.set)) { els[id].value = v; } (els[evento.id].ls.input || []).forEach((f) => f()); }
    return { carregamento, apos: els['i03-out'].textContent, valores: Object.fromEntries(Object.entries(els).map(([k, v]) => [k, v.value])) };
  };
  return casos.map((c) => ({ ...c, resultado: rodar(c.inicial, c.evento) }));
}

// ---------------------------------------------------------------- exercícios / quiz / glossário / checklist
function lerExercicios() {
  const res = [];
  for (let n = 1; n <= L.length; n++) {
    if (line(n).trim() !== '<div class="exercise">') continue;
    const fim = blockEnd(n, L.length);
    const tag = inner(n + 1, /<span class="exercise-tag">(.*?)<\/span>/);
    const q = inner(n + 2, /<div class="exercise-question">(.*)<\/div>/);
    const botao = inner(n + 3, /<button class="exercise-toggle"[^>]*>(.*)<\/button>/);
    const ps = [];
    for (let k = n + 4; k < fim; k++) { const m = line(k).match(/^\s*<p([^>]*)>(.*)<\/p>\s*$/); if (m) ps.push({ html: m[2], texto: strip(m[2]), linha: k, ...(m[1].trim() ? { atributos: m[1].trim() } : {}) }); }
    res.push({ ini: n, fim, tag, q, botao, ps });
  }
  return res;
}
function lerQuiz() {
  const s = L.findIndex((x) => x.includes('const questions = [')) + 1;
  const qs = [];
  for (let n = s + 1; n < s + 120; n++) {
    const m = (line(n) || '').match(/^\s*q: "(.*)",$/);
    if (!m) continue;
    // options pode ocupar 1 linha ou várias; localiza por rótulo dentro do bloco da questão
    let k = n + 1; const blocoQ = [];
    while (!/^\s*\},?\s*$/.test(line(k))) { blocoQ.push([k, line(k)]); k++; }
    const txt = blocoQ.map((x) => x[1]).join('\n');
    const om = txt.match(/options: \[([\s\S]*?)\],\s*\n\s*correct:/);
    assert(om, 'quiz: options não achado na questão da linha ' + n);
    const cm = txt.match(/correct: (\d+),/);
    const fm = txt.match(/feedback: "(.*)"\s*$/m);
    assert(cm && fm, 'quiz: correct/feedback não achado na questão da linha ' + n);
    qs.push({ linha: n, enunciado: m[1], opcoes: JSON.parse('[' + om[1].replace(/\n\s*/g, ' ') + ']'), indice_correto: Number(cm[1]), feedback: fm[1] });
  }
  return qs;
}
function lerGlossario() {
  const g = [];
  for (let n = 2520; n <= 2690; n++) {
    const m = (line(n) || '').match(/<summary><span class="term">(.*?)<\/span><span class="unit">(.*?)<\/span><\/summary>/);
    if (m) g.push({ n, term: decode(m[1]), unit: decode(m[2]), def: inner(n + 1, /<div class="glossary-content">(.*)<\/div>/) });
  }
  return g;
}
function lerChecklist() {
  const r = [];
  for (let n = 2490; n <= 2520; n++) { const m = (line(n) || '').match(/<div class="text">(.*?)<\/div>/); if (m) r.push({ n, html: m[1] }); }
  return r;
}
function lerTradutor() {
  const r = [];
  const ini = L.findIndex((x) => x.includes('<span class="num">§ Map</span>')) + 1;
  for (let n = ini; n < ini + 40; n++) { const s = line(n) || ''; if (/<tr><td>/.test(s)) r.push({ n, cells: [...s.matchAll(/<td>(.*?)<\/td>/g)].map((m) => m[1]) }); }
  return r;
}
function secaoDeLinha(n, marcadores, scriptIni) {
  if (n >= scriptIni) return 'script';
  let ult = 'antes do § 00';
  for (const m of marcadores) if (m.n <= n) ult = m.rot; else break;
  return ult;
}

// ---------------------------------------------------------------- .ts atual (verificação programática)
function balanced(text, open) {
  const pares = { '[': ']', '{': '}', '(': ')' };
  const pilha = [];
  for (let i = open; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'" || c === '`') { const q = c; i++; while (text[i] !== q) { if (text[i] === '\\') i++; i++; } continue; }
    if (c === '/' && text[i + 1] === '/') { while (text[i] !== '\n') i++; continue; }
    if (pares[c]) pilha.push(pares[c]);
    else if (c === ']' || c === '}' || c === ')') { if (pilha.pop() !== c) throw new Error('desbalanceado em ' + i); if (!pilha.length) return i; }
  }
  throw new Error('sem fechamento');
}
const evalLit = (s) => vm.runInNewContext('(' + s + ')');
function lerTs(aulaKey, instId, exId) {
  const ts = fs.readFileSync(TS_CONTENT, 'utf8');
  const calc = fs.readFileSync(TS_CALC, 'utf8');
  const glos = fs.readFileSync(TS_GLOS, 'utf8');
  const corpoLabel = `'${aulaKey}': [`;
  const ci = ts.indexOf(corpoLabel);
  assert(ci > 0, 'corpo do .ts não achado: ' + aulaKey);
  const copen = ci + corpoLabel.length - 1;
  const corpoTxt = ts.slice(copen, balanced(ts, copen) + 1);
  const corpo = evalLit(corpoTxt);
  const leadM = ts.match(new RegExp(`'${aulaKey}': "((?:[^"\\\\]|\\\\.)*)"`));
  const lead = leadM ? JSON.parse(`"${leadM[1]}"`) : null;
  // objeto da aula em MODULO_01_AULAS
  const ai = ts.indexOf(`id: '${aulaKey}',`);
  const ao = ts.lastIndexOf('{', ai);
  const aulaTxt = ts.slice(ao, balanced(ts, ao) + 1);
  const illM = aulaTxt.match(/illustrations: (\[[^\]]*\])/);
  const actM = aulaTxt.match(/activities: \[/);
  const actOpen = aulaTxt.indexOf('[', actM.index);
  const actTxt = aulaTxt.slice(actOpen, balanced(aulaTxt, actOpen) + 1);
  const activities = evalLit(actTxt);
  const instrRef = (aulaTxt.match(/instruments: \[(.*)\]/) || [])[1] ?? '';
  // instrumento
  let inst = null, calcTxt = null;
  if (instId) {
    const ii = ts.indexOf(`id: "${instId}",`);
    const io = ts.lastIndexOf('{', ii);
    inst = evalLit(ts.slice(io, balanced(ts, io) + 1));
    const ki = calc.indexOf(`'${instId}': (i) =>`);
    const ko = calc.indexOf('(', ki + 10);
    // pega do início da linha da chave até o `}),` seguinte
    calcTxt = calc.slice(ki, calc.indexOf('\n\n', ki));
  }
  // glossário: verbetes do .ts que apontam para a aula
  const gl = [];
  for (const m of glos.matchAll(/\{\s*id: "([^"]+)",\s*term: "([^"]+)"[\s\S]*?aulaIds: \[([^\]]*)\],?\s*\}/g)) {
    if (m[3].includes(`"${aulaKey}"`)) gl.push({ id: m[1], term: m[2], aulaIds: m[3].replace(/"/g, '').split(',').map((x) => x.trim()).filter(Boolean) });
  }
  const titM = aulaTxt.match(/\btitle: "((?:[^"\\]|\\.)*)"/); const subM = aulaTxt.match(/\bsubtitle: "((?:[^"\\]|\\.)*)"/);
  return { titulo: titM ? JSON.parse(`"${titM[1]}"`) : null, subtitulo: subM ? JSON.parse(`"${subM[1]}"`) : null, corpo, lead, illustrations: illM ? evalLit(illM[1]) : [], activities, instrRef, aulaTxt, inst, calcTxt, gl, orfaos: (corpoTxt.match(/<\/span>/g) || []).length, abertos: (corpoTxt.match(/<span\b/g) || []).length };
}
const tagsDe = (h) => (h.match(/<\/?[a-zA-Z][^>]*>/g) || []).map((t) => t.replace(/\s.*>/, '>')).sort();
function difTags(a, b) {
  const cnt = (arr) => arr.reduce((o, t) => ((o[t] = (o[t] || 0) + 1), o), {});
  const ca = cnt(tagsDe(a)), cb = cnt(tagsDe(b));
  const so_a = [], so_b = [];
  for (const t of new Set([...Object.keys(ca), ...Object.keys(cb)])) {
    const d = (ca[t] || 0) - (cb[t] || 0);
    if (d > 0) so_a.push(`${t}×${d}`); else if (d < 0) so_b.push(`${t}×${-d}`);
  }
  return { so_na_fonte: so_a, so_no_ts: so_b };
}

// ================================================================ configuração por aula
const CFG = {
  3: { aulaNum: 3, secStart: 1585, secEnd: 1646, mapa: 1341, aulaKey: 'aula-01-03', instId: null, exNum: null },
  4: { aulaNum: 4, secStart: 1651, secEnd: 1724, mapa: 1342, aulaKey: 'aula-01-04', instId: 'inst-03', exNum: '03' },
};

const marcadoresMod = [...raw.matchAll(/<div class="aula-marker"><span class="num">([^<]*)<\/span>/g)].map((m) => ({ rot: m[1], n: raw.slice(0, m.index).split('\n').length }));
const scriptIni = L.findIndex((s) => /^\s*<script/.test(s) && !s.includes('src=')) + 1;
const exerciciosFonte = lerExercicios();
const quizFonte = lerQuiz();
const glossFonte = lerGlossario();
const checklistFonte = lerChecklist();
const tradutorFonte = lerTradutor();

// A09 (para medir a promessa de retorno da A03)
const a09Marker = marcadoresMod.find((m) => m.rot === 'Aula 09').n;
let a09Ini = a09Marker; while (!line(a09Ini).includes('<section class="aula">')) a09Ini--;
let a09Fim = a09Marker; while (line(a09Fim).trim() !== '</section>') a09Fim++;

function gerar(cfg) {
  const { aulaNum, secStart, secEnd, aulaKey, instId: tsInstId } = cfg;
  const NN = String(aulaNum).padStart(2, '0');
  const AULA_ID = `m01-a${NN}`;
  const itens = walkSection(secStart, secEnd);

  // comentário de abertura (3 linhas "=====" / "AULA NN" / "=====")
  let c0 = secStart - 1; while (line(c0).trim().startsWith('<!--')) c0--;
  c0++;
  const comentarioAula = [c0, c0 + 1, c0 + 2].map((n) => line(n).trim()).filter((s) => /AULA \d\d/.test(s))[0] ?? null;
  assert(comentarioAula, 'comentário de abertura da aula não achado');

  // ---------------- cabeçalho
  const mk = itens.find((i) => i.tipo === 'marcador');
  const markerNum = inner(mk.ini, /<span class="num">(.*?)<\/span>/);
  const markerNome = inner(mk.ini, /<span class="dot"><\/span><span>(.*?)<\/span>/);
  assert(markerNum === `Aula ${NN}`, 'marcador não é Aula ' + NN);
  const h2i = itens.find((i) => i.tipo === 'h2');
  const h2 = inner(h2i.ini, /<h2 class="aula-title">(.*)<\/h2>/);
  const mapaCells = [...line(cfg.mapa).matchAll(/<td>(.*?)<\/td>/g)].map((m) => m[1]);
  assert(strip(mapaCells[0]) === NN, '§ MAP linha errada');

  // ---------------- blocos
  const blocos = [];
  const bid = (t) => `${AULA_ID}-b${String(blocos.length + 1).padStart(2, '0')}-${t}`;
  const extras = { figuras: [], instrumentos: [], tabelas: [], listas: [] };
  let instBloco = null, figBloco = null;
  let figN = 0;
  for (const it of itens) {
    const base = (tipo, sel, campos, extra = {}, htmlRef = '') => {
      const b = { id: bid(tipo), tipo, ...campos, origem: origem(it.ini, it.fim, sel, htmlRef), ...extra };
      if (it.comentario_fonte) b.comentario_fonte = it.comentario_fonte;
      blocos.push(b); return b;
    };
    if (it.tipo === 'marcador' || it.tipo === 'h2') continue;
    if (it.tipo === 'lead') { const h = inner(it.ini, /<p class="lead">(.*)<\/p>/); base('lead', `section.aula(Aula ${NN}) > .container > p.lead`, { html: h, texto: strip(h) }, {}, h); }
    else if (it.tipo === 'titulo') {
      const num = inner(it.ini, /<span class="num">(.*?)<\/span>/); const txt = inner(it.ini, /<\/span>(.*)<\/h3>/);
      base('titulo', `h3 > span.num(${num})`, { numero: num, texto: strip(txt), html: line(it.ini).trim().replace(/^<h3>|<\/h3>$/g, '') }, {}, txt);
    } else if (it.tipo === 'paragrafo') {
      const h = inner(it.ini, /<p>(.*)<\/p>/);
      const pos = blocos.filter((b) => b.tipo === 'paragrafo').length + 1;
      const ultTit = [...blocos].reverse().find((b) => b.tipo === 'titulo');
      base('paragrafo', `h3(${ultTit ? ultTit.numero : 'lead'}) ~ p (${pos}º p da aula)`, { html: h, texto: strip(h) }, {}, h);
    } else if (it.tipo === 'formula') {
      const f = parseFormula(it.ini, it.fim); const dl = f._descLinha; delete f._descLinha;
      base('formula', 'div.formula > div.eq' + (f.desc_html !== null ? ' + div.desc' : ''), f, { desc_origem: dl ? origem(dl, null, 'div.formula > div.desc', f.desc_html) : null }, f.eq_html);
    } else if (it.tipo === 'destaque') {
      const c = parseCallout(it.ini, it.fim); const pl = c._pLinha; delete c._pLinha;
      base('destaque', `div.${c.classe_literal.replace(/ /g, '.')}`, { tom: c.tom, classe_literal: c.classe_literal, rotulo: c.rotulo, rotulo_texto: c.rotulo_texto, html: c.html, texto: c.texto }, { corpo_origem: origem(pl, null, 'div.callout > p', c.html), nota: 'Um callout = rótulo (div.callout-label) + um parágrafo. ' + (c.tom ? `Tom declarado pela classe: "${c.tom}".` : 'Sem classe de tom (apenas "callout").') + ' A expressão "Vale lembrar" não é usada.' }, c.rotulo);
    } else if (it.tipo === 'lista') {
      const l = parseLista(it.ini, it.fim); delete l._ulStyle;
      const b = base('lista', 'ul', l, {}, l.itens[0].html); extras.listas.push(b.id);
    } else if (it.tipo === 'tabela') {
      const t = parseTabela(it.ini, it.fim);
      const b = base('tabela', 'div.table-wrap > table', t, { ref: `${AULA_ID}-tab-${String(extras.tabelas.length + 1).padStart(2, '0')}` }, t.cabecalho[0].html); extras.tabelas.push(b.id);
    } else if (it.tipo === 'figura') {
      const f = parseFiguraAcDc(it.ini, it.fim); figN++;
      const fid = `${AULA_ID}-fig-${String(figN).padStart(2, '0')}`;
      figBloco = base('figura', 'div.ac-dc-vis', { ref: fid, texto: null }, { vinculos: { figura: fid }, nota: 'Especificação completa em figuras[0].' }, f.celulas[0].h5);
      extras.figuras.push({ id: fid, tipo: 'duas_senoides_svg_dc_x_ac', seletor: 'div.ac-dc-vis', ...f, origem: origem(it.ini, it.fim, 'div.ac-dc-vis', f.celulas[0].h5) });
    } else if (it.tipo === 'instrumento') {
      const iid = `m01-inst-${NN === '04' ? '03' : NN}`;
      instBloco = base('instrumento', `div.instrument (comentário "${it.comentario_fonte?.texto ?? ''}")`, { ref: iid, texto: strip(inner(it.ini + 2, /<div class="instrument-title">(.*)<\/div>/)) }, { vinculos: { instrumento: iid }, nota: 'Posição literal na fonte (ver instrumentos[0].posicao_na_aula). Especificação completa em instrumentos[0].' }, strip(inner(it.ini + 2, /<div class="instrument-title">(.*)<\/div>/)));
      instBloco._it = it;
    }
  }

  // ---------------- instrumento (A04)
  const instrumentos = [];
  const invocacoes = [];
  let instRange = null, scriptInfo = null;
  if (instBloco) {
    const it = instBloco._it; delete instBloco._it;
    instRange = [it.ini, it.fim];
    const P = parseInstrumento(it.ini, it.fim);
    const sc = lerScript('INSTRUMENT 03: I²R losses');
    const scriptLinhas = []; for (let n = sc.ini; n <= sc.fim; n++) scriptLinhas.push({ n, texto: line(n).trim() });
    const iR = (n) => line(n).trim();
    const corpoScript = L.slice(sc.ini - 1, sc.fim).join('\n');
    // âncoras do script (falha alto se o script não for o esperado)
    assert(/const P = I \* I \* R;/.test(corpoScript) && /maximumFractionDigits: 0/.test(corpoScript), 'script do INST·03 diferente do esperado');
    const lnCalc = (re) => { const k = scriptLinhas.find((x) => re.test(x.texto)); assert(k, 'âncora ' + re); return k; };
    const lI = lnCalc(/^const I = parseFloat/), lR = lnCalc(/^const R = parseFloat/), lP = lnCalc(/^const P = /), lO = lnCalc(/^out\.textContent/);
    const casos = [
      { rotulo: 'carregamento, padrões da marcação', inicial: { 'i03-i': '100', 'i03-r': '0.5', 'i03-i-range': '100', 'i03-r-range': '0.5' } },
      { rotulo: 'dobra a corrente (200 A, 0,5 Ω)', inicial: { 'i03-i': '100', 'i03-r': '0.5', 'i03-i-range': '100', 'i03-r-range': '0.5' }, evento: { id: 'i03-i', set: { 'i03-i': '200' } } },
      { rotulo: 'triplica a corrente (300 A, 0,5 Ω)', inicial: { 'i03-i': '100', 'i03-r': '0.5', 'i03-i-range': '100', 'i03-r-range': '0.5' }, evento: { id: 'i03-i', set: { 'i03-i': '300' } } },
      { rotulo: 'valores fracionários que arredondam (15 A, 0,3 Ω = 67,5 W)', inicial: { 'i03-i': '100', 'i03-r': '0.5', 'i03-i-range': '100', 'i03-r-range': '0.5' }, evento: { id: 'i03-i', set: { 'i03-i': '15', 'i03-r': '0.3' } } },
      { rotulo: 'campo vazio (corrente "")', inicial: { 'i03-i': '100', 'i03-r': '0.5', 'i03-i-range': '100', 'i03-r-range': '0.5' }, evento: { id: 'i03-i', set: { 'i03-i': '' } } },
      { rotulo: 'número fora da faixa do deslizador (600 A)', inicial: { 'i03-i': '100', 'i03-r': '0.5', 'i03-i-range': '100', 'i03-r-range': '0.5' }, evento: { id: 'i03-i', set: { 'i03-i': '600' } } },
    ];
    const sim = simularScript(sc.ini, sc.fim, casos);
    const padrao = sim[0].resultado.carregamento;
    const val = (k) => sim[k].resultado.apos;
    // a nota "dobre a corrente… quadruplicar" confere com o próprio script?
    const toNum = (s) => Number(s.replace(/\./g, '').replace(',', '.'));
    const quadruplica = toNum(val(1)) === 4 * toNum(padrao);
    const noveVezes = toNum(val(2)) === 9 * toNum(padrao);
    const iid = `m01-inst-03`;
    instrumentos.push({
      id: iid, id_fonte: P.idFonte, kind_taxonomia: 'calculadora',
      kind_nota: 'Marcação: 2 campos numéricos (cada um com deslizador gêmeo) → 1 saída numérica; sem texto de leitura dinâmico. Corresponde a "calculadora" (docs/alexandria/instrument-taxonomy.md).',
      titulo: P.title, pergunta: null,
      pergunta_nota: 'A prancha não tem pergunta própria. A única pergunta da fonte para a aula está no § MAP (aula.pergunta_mapa) e no enunciado do Ex · 03. Pergunta de previsão (bar C3/C5) seria DERIVADA (P3/P11), não extraída.',
      vinculos: { aula: AULA_ID, exercicio_relacionado: null, termo: null },
      vinculos_nota: 'Aula↔instrumento por posição (div.instrument dentro da section da Aula 04) e pelo parágrafo que o antecede ("Veja:"). O Ex · 03 trata do mesmo fenômeno (corrente que dobra), mas a fonte não liga um ao outro. Nenhum verbete do léxico liga-se ao título do instrumento.',
      posicao_na_aula: { depois_do_bloco: blocos.filter((b) => b.origem.linha_aprox < it.ini).slice(-1)[0].id, antes_do_bloco: blocos.find((b) => b.origem.linha_aprox > it.fim).id, nota: 'Entre o parágrafo de 4.1 que termina em "Veja:" (L1666) e o h3 4.2 (L1697).' },
      entradas: P.entradas.map((e) => ({ id: e.id, rotulo: e.rotulo, unidade: e.unidade, number: e.number, range_gemeo: e.range, origem: e.origem })),
      entradas_nota: 'Cada campo é um input type=number com um input type=range gêmeo (ids <id>-range) sincronizados pelo script. O number NÃO tem max; o range tem faixa própria (ver DIV-04).',
      saidas: [{
        id: P.oId, rotulo: P.oLab, unidade: P.oUnit, valor_inicial_marcacao: P.oInit,
        formula_exata_script: [lI.texto, lR.texto, lP.texto],
        formatacao_script: lO.texto,
        formatacao_descricao: 'P em W, pt-BR, 0 casas decimais (maximumFractionDigits: 0), sem mínimo.',
        formula_exibida_na_aula_html: blocos.find((b) => b.tipo === 'formula').eq_html,
        formula_exibida_na_aula_origem: { seletor: 'div.formula > div.eq', trecho_inicial: 'P perdas', linha_aprox: blocos.find((b) => b.tipo === 'formula').origem.linha_aprox + 1, nota: 'Está na prosa de 4.1, FORA do div.instrument.' },
        coercao_entradas: { 'i03-i': lI.texto, 'i03-r': lR.texto, nota: 'Resíduo do original, sinalizado e não corrigido (§10): campo vazio ou não numérico vira 0 (`|| 0`), e a saída vira 0.' },
        origem: origem(P.oLinha, null, 'div.instrument-output > span#i03-out', P.oLab),
      }],
      texto_leitura: null,
      texto_leitura_nota: 'Não há texto de leitura dinâmico: o script só escreve em #i03-out. O div.instrument-note é estático (medido: nenhuma referência a ele no script).',
      nota_estatica: { html: P.nota, texto: strip(P.nota), origem: origem(P.notaLinha, P.notaLinha + 2, 'div.instrument-note', P.nota) },
      cenario_padrao: {
        entradas: { 'i03-i': 100, 'i03-r': 0.5 },
        origem: 'atributos value dos inputs number e range (L1678, 1679, 1683, 1684).',
        medido_saida_marcacao: P.oInit, medido_saida_apos_carregar: padrao,
        nota: 'Medido executando o script original (linhas extraídas) contra um DOM mínimo: calc() roda no carregamento (última linha do IIFE), então o que o learner vê é a saída do script, não o texto da marcação. Ver DIV-01.',
      },
      medido_execucao_script_simulada: sim.map((s) => ({ caso: s.rotulo, entradas_alteradas: s.evento ? s.evento.set : null, saida_no_carregamento: s.resultado.carregamento, saida_apos_evento: s.resultado.apos })),
      medido_confere_nota_do_instrumento: { dobrar_corrente_quadruplica_a_saida: quadruplica, triplicar_corrente_noveplica_a_saida: noveVezes },
      fonte_dos_numeros: null,
      fonte_dos_numeros_nota: 'A fonte não cita procedência para o cenário-padrão (100 A, 0,5 Ω) nem para as faixas dos deslizadores (10–500 A; 0,1–5 Ω).',
      tolerancias: null, tolerancias_nota: 'Nenhuma tolerância declarada (P6). Não há previsão, gabarito nem correção no instrumento.',
      figura_prometida: null, figura_prometida_nota: 'O título ("Calculadora · …") não promete figura desenhada; saída é um número em W.',
      origem: origem(it.ini, it.fim, 'section.aula(Aula 04) div.instrument', `${P.title} ${P.idFonte}`),
      script_origem: { seletor: 'script: IIFE "INSTRUMENT 03: I²R losses"', trecho_inicial: 'INSTRUMENT 03: I²R losses', linha_aprox: sc.cabecalho, linha_fim_aprox: sc.fim },
      script: {
        linhas: scriptLinhas.map((x) => ({ n: x.n, texto: x.texto })),
        funcoes: { calc: 'lê i03-i e i03-r (parseFloat || 0), P = I * I * R, escreve toLocaleString pt-BR sem casas em #i03-out', sincronizacao: 'input↔range nos dois campos (value copiado de um para o outro, depois calc())', carregamento: 'calc() é chamado uma vez ao fim do IIFE' },
        origem: { seletor: 'script', trecho_inicial: '(function() {', linha_aprox: sc.ini, linha_fim_aprox: sc.fim },
      },
    });
    scriptInfo = sc;
    // invocação: o parágrafo imediatamente anterior termina em "Veja:"
    const pAnt = blocos.filter((b) => b.origem.linha_aprox < it.ini).slice(-1)[0];
    assert(pAnt.tipo === 'paragrafo' && pAnt.texto.endsWith('Veja:'), 'parágrafo anterior ao instrumento não termina em "Veja:"');
    invocacoes.push({ id: `${AULA_ID}-inv-01`, alvo: iid, tipo: 'invocacao_direta_implicita', texto: 'Veja:', bloco: pAnt.id, origem: { seletor: 'h3(4.1) ~ p (último)', trecho_inicial: 'Veja:', linha_aprox: pAnt.origem.linha_aprox }, posicao_instrumento: `imediatamente depois deste parágrafo (L${it.ini}–${it.fim}), antes do h3 4.2`, nota: 'O parágrafo não nomeia a calculadora; termina em "Veja:" e o instrumento vem logo abaixo. Se o instrumento sair da posição, o parágrafo termina no vazio.' });
    for (const iv of invocacoes) assert(raw.includes(iv.texto), 'invocação não verbatim');
    // o parágrafo que antecede a lista também termina em dois-pontos (promessa de lista)
  }
  // parágrafos que terminam em ":" e o que vem depois (medido): detecta "Veja:", "Por isso:" etc.
  const terminaEmDoisPontos = blocos.filter((b) => b.tipo === 'paragrafo' && /:\s*$/.test(b.texto)).map((b) => {
    const idx = blocos.indexOf(b); const prox = blocos[idx + 1];
    return { bloco: b.id, termina_em: b.texto.split(' ').slice(-5).join(' '), linha: b.origem.linha_aprox, proximo_bloco_na_fonte: prox ? { id: prox.id, tipo: prox.tipo } : null };
  });

  // ---------------- exercício
  const tagRe = new RegExp(`Aula 0?${aulaNum}\\b`);
  const exVinc = exerciciosFonte.filter((e) => tagRe.test(e.tag));
  const refsProsa = [];
  for (const e of exerciciosFonte) {
    const campos = { enunciado: e.q, gabarito: e.ps.map((p) => p.html).join(' ') };
    for (const [campo, txt] of Object.entries(campos)) if (new RegExp(`Aula 0?${aulaNum}\\b`).test(strip(txt))) refsProsa.push({ exercicio_tag: e.tag, campo, linha_aprox: e.ini });
  }
  const exercicios = exVinc.map((e) => {
    assert(e.ps.length === 1, 'gabarito com mais de um parágrafo — generalizar');
    const num = (e.tag.match(/Ex · (\d+)/) || [])[1];
    return {
      id: `m01-ex-${num}`, tipo: 'discursiva_com_gabarito', tag_fonte: e.tag,
      vinculo_declarado: { aula: AULA_ID, como: `span.exercise-tag "${e.tag}" (tag de posse, §4 do protocolo)` },
      enunciado_html: e.q, enunciado_texto: strip(e.q),
      resposta_referencia_html: e.ps[0].html, resposta_referencia_texto: e.ps[0].texto,
      criterio: null, criterio_nota: 'Sem critério por exercício na fonte. O único critério declarado é de nível do § Drill, citado em criterio_modulo_drill.',
      criterio_modulo_drill: (() => { const i = L.findIndex((x) => x.includes('Resolva cada exercício mentalmente')) + 1; const h = inner(i, /<p>(.*)<\/p>/); return { texto: h, origem: origem(i, null, '§ Drill > p', h) }; })(),
      botao_gabarito: e.botao,
      mecanica_fonte: 'button.exercise-toggle "Revelar gabarito" (onclick toggleAns) — referência revelável sem tentativa registrada (ver bar C7).',
      vinculos: { aula: AULA_ID, instrumento: instrumentos[0]?.id ?? null, instrumento_nota: 'Não declarado. O exercício trata do mesmo fenômeno do INST·03 (corrente que dobra, I² × R), mas a fonte não liga um ao outro.', termo: null },
      origem: origem(e.ini, e.fim, `§ Drill > div.exercise (${e.tag})`, `${e.tag} ${strip(e.q)}`.slice(0, 80)),
    };
  });
  const todasTags = exerciciosFonte.map((e) => e.tag);

  // ---------------- relacionados (sem tag de aula)
  const KW = cfg.kw;
  const relacionados = [];
  for (const q of quizFonte) {
    if (KW.quiz.test(strip(q.enunciado))) relacionados.push({
      id: `m01-quiz-q${String(quizFonte.indexOf(q) + 1).padStart(2, '0')}`, tipo: 'questao_quiz_multipla_escolha', vinculo_declarado: null,
      vinculo_nota: 'Sem tag de aula no array `questions`. Tema coincide; posse NÃO declarada — pertence à avaliação do módulo (§ Quiz). Listado só para rastreio.',
      posicao_no_quiz: quizFonte.indexOf(q) + 1, total_questoes_no_array: quizFonte.length,
      enunciado: q.enunciado, opcoes: q.opcoes, indice_correto: q.indice_correto, opcao_correta: q.opcoes[q.indice_correto], feedback: q.feedback,
      origem: { seletor: 'script: const questions = [...]', trecho_inicial: q.enunciado.slice(0, 60), linha_aprox: q.linha },
    });
  }
  for (const c of checklistFonte) {
    if (KW.checklist.test(strip(c.html))) relacionados.push({
      id: `m01-checklist-${String(checklistFonte.indexOf(c) + 1).padStart(2, '0')}`, tipo: 'item_checklist_final', vinculo_declarado: null,
      vinculo_nota: 'Checklist do § Final sem tag de aula; correspondência apenas temática.',
      texto: c.html, origem: { seletor: '§ Final div.checklist-item > div.text', trecho_inicial: strip(c.html).slice(0, 60), linha_aprox: c.n },
    });
  }
  for (const r of tradutorFonte) {
    if (KW.tradutor && KW.tradutor.test(strip(r.cells[0]))) relacionados.push({
      id: `m01-tradutor-${String(tradutorFonte.indexOf(r) + 1).padStart(2, '0')}`, tipo: 'linha_tradutor', vinculo_declarado: null,
      vinculo_nota: 'Linha do § Map (Tradutor) sem tag de aula; correspondência temática. Id por posição na tabela — conferir contra modulo.json (m01-tradutor-NN).',
      conceito_fisico: r.cells[0], manifestacao_na_fatura: r.cells[1], analise_prioritaria: r.cells[2],
      origem: { seletor: '§ Map table > tbody > tr', trecho_inicial: strip(r.cells[0]), linha_aprox: r.n },
    });
  }

  // ---------------- termos do léxico (§2: frequência nunca é veredito)
  const aulaHtml = L.slice(secStart + 1 - 1, secEnd).join('\n');
  const aulaTexto = strip(aulaHtml);
  const nfd = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const aulaNorm = nfd(aulaTexto);
  const termos = [];
  for (const g of glossFonte) {
    const base = g.term.replace(/\s*\(.*\)\s*$/, '');
    const esc = nfd(base).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`(^|[^\\p{L}])${esc}([^\\p{L}]|$)`, 'u').test(aulaNorm)) continue;
    const ocorr = []; const reG = new RegExp(esc, 'g'); let mm;
    while ((mm = reG.exec(aulaNorm)) && ocorr.length < 12) ocorr.push(aulaTexto.slice(Math.max(0, mm.index - 40), mm.index + base.length + 40));
    const reW = new RegExp(`(^|[^\\p{L}])${esc}(?![\\p{L}])`, 'gu');
    termos.push({ termo: g.term, unidade_rotulo: g.unit, definicao_html: g.def, ocorrencias_contexto: ocorr, n_ocorrencias: (aulaNorm.match(reG) || []).length, n_ocorrencias_como_palavra: (aulaNorm.match(reW) || []).length, origem: { seletor: '§ Lex details.glossary-item > summary > span.term', trecho_inicial: g.term, linha_aprox: g.n } });
  }
  // siglas entre parênteses ("AC", "DC") que o nome-base não pega
  const siglas = [];
  for (const g of glossFonte) {
    const ab = (g.term.match(/\(([^)]+)\)/) || [])[1];
    if (ab && ab.length >= 2 && new RegExp(`(^|[^\\p{L}])${ab.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`, 'u').test(aulaTexto) && !termos.some((t) => t.termo === g.term)) siglas.push({ termo: g.term, sigla: ab, linha_aprox: g.n });
  }

  // ---------------- cobertura por token (§5), por palavra
  const tok = (s) => nfd(s).match(/[\p{L}\p{N}]+/gu) || [];
  const extraidoHtml = [markerNum, markerNome, h2];
  for (const b of blocos) {
    if (b.tipo === 'lead' || b.tipo === 'paragrafo' || b.tipo === 'titulo') extraidoHtml.push(b.html);
    if (b.tipo === 'formula') extraidoHtml.push(b.eq_html, b.desc_html ?? '');
    if (b.tipo === 'destaque') extraidoHtml.push(b.rotulo, b.html);
    if (b.tipo === 'lista') b.itens.forEach((x) => extraidoHtml.push(x.html));
    if (b.tipo === 'tabela') { b.cabecalho.forEach((x) => extraidoHtml.push(x.html)); b.linhas.forEach((l) => l.celulas.forEach((x) => extraidoHtml.push(x.html))); }
  }
  for (const f of extras.figuras) f.celulas.forEach((c) => extraidoHtml.push(c.h5, c.label));
  const bag = new Map();
  for (const t of tok(stripSp(extraidoHtml.join(' ')))) bag.set(t, (bag.get(t) || 0) + 1);
  const srcLines = []; for (let n = secStart + 1; n < secEnd; n++) if (!instRange || n < instRange[0] || n > instRange[1]) srcLines.push(line(n));
  // linhas comentadas da fonte não são conteúdo
  const srcHtml = srcLines.join('\n').replace(/<!--[\s\S]*?-->/g, ' ');
  const srcTok = tok(stripSp(srcHtml));
  let hit = 0; const faltando = [];
  for (const t of srcTok) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else faltando.push(t); }
  const cobertura = { tokens_fonte_sem_instrumento: srcTok.length, tokens_casados: hit, pct: +(100 * hit / srcTok.length).toFixed(1), tokens_nao_casados: faltando };

  // ---------------- ocorrências fora da section (varredura "não falta item")
  const foraDaSecao = [];
  for (const [rid, re] of Object.entries(cfg.kw.varredura)) {
    for (let n = 1; n <= L.length; n++) {
      if (n >= secStart - 3 && n <= secEnd) continue;
      if (instRange === null && false) continue;
      const s = line(n);
      if (re.test(s)) foraDaSecao.push({ padrao: rid, linha_aprox: n, secao: secaoDeLinha(n, marcadoresMod, scriptIni), trecho: strip(s).slice(0, 140) });
    }
  }

  // ---------------- comparação com o .ts
  const ts = lerTs(aulaKey, tsInstId, exercicios[0]?.id);
  const checks = comparar({ blocos, ts, cfg, instrumentos });

  return { cfg, NN, AULA_ID, itens, blocos, extras, instrumentos, invocacoes, exercicios, relacionados, termos, siglas, cobertura, foraDaSecao, ts, checks, markerNum, markerNome, h2, mapaCells, comentarioAula, c0, terminaEmDoisPontos, todasTags, refsProsa, instRange, scriptInfo };
}

// ---------------------------------------------------------------- comparação estruturada com o .ts
function comparar({ blocos, ts, cfg, instrumentos }) {
  const r = { por_bloco: [], blocos_ts_sem_par_na_fonte: [], contagem_ts_por_kind: {}, span_fechando_sem_abrir_no_corpo: ts.orfaos - ts.abertos };
  for (const b of ts.corpo) r.contagem_ts_por_kind[b.kind] = (r.contagem_ts_por_kind[b.kind] || 0) + 1;
  const usados = new Set();
  const acha = (fn) => { const i = ts.corpo.findIndex((b, k) => !usados.has(k) && fn(b)); if (i >= 0) usados.add(i); return i >= 0 ? ts.corpo[i] : null; };
  for (const b of blocos) {
    let est;
    if (b.tipo === 'lead') est = ts.lead === b.html ? { estado: 'verbatim' } : { estado: 'diverge', ts: ts.lead };
    else if (b.tipo === 'titulo') {
      const t = acha((x) => x.kind === 'titulo' && x.numero === b.numero);
      est = !t ? { estado: 'ausente' } : t.texto === b.texto ? { estado: 'verbatim' } : { estado: 'diverge', ts: t.texto };
    } else if (b.tipo === 'paragrafo') {
      const t = acha((x) => x.kind === 'paragrafo' && x.html === b.html) ?? acha((x) => x.kind === 'paragrafo' && strip(x.html) === b.texto);
      est = !t ? { estado: 'ausente' } : t.html === b.html ? { estado: 'verbatim' } : { estado: 'diverge', ...difTags(b.html, t.html) };
    } else if (b.tipo === 'formula') {
      const t = acha((x) => x.kind === 'formula');
      if (!t) est = { estado: 'ausente' };
      else est = { estado: t.eq === b.eq_texto && t.desc === b.desc ? 'verbatim' : 'diverge', eq_ts: t.eq, eq_fonte_texto: b.eq_texto, eq_igual: t.eq === b.eq_texto, desc_ts: t.desc, desc_fonte: b.desc };
    } else if (b.tipo === 'destaque') {
      const i = ts.corpo.findIndex((x, k) => !usados.has(k) && x.kind === 'nota' && (x.html === b.rotulo || x.label === b.rotulo));
      if (i < 0) est = { estado: 'ausente' };
      else {
        usados.add(i); const n = ts.corpo[i]; const p = ts.corpo[i + 1]; if (p && p.kind === 'paragrafo') usados.add(i + 1);
        est = { estado: 'diverge', rotulo_no_ts_em: n.label === b.rotulo ? 'label' : 'html', ts_label: n.label, ts_html: n.html, ts_tom: n.tom, tom_fonte: b.tom, corpo_como_paragrafo_solto: !!(p && p.kind === 'paragrafo' && p.html === b.html), corpo_verbatim: !!(p && p.html === b.html) };
      }
    } else if (b.tipo === 'lista') {
      const alg = ts.corpo.find((x) => x.kind === 'lista') ?? ts.corpo.find((x) => JSON.stringify(x).includes(b.itens[0].texto.slice(0, 30)));
      est = alg ? { estado: 'presente', detalhe: alg } : { estado: 'ausente' };
    } else if (b.tipo === 'tabela') {
      const t = acha((x) => x.kind === 'tabela');
      if (!t) est = { estado: 'ausente' };
      else {
        const fonte = [b.cabecalho.map((c) => c.html), ...b.linhas.map((l) => l.celulas.map((c) => c.html))];
        const difs = []; fonte.forEach((lin, i) => lin.forEach((c, j) => { const tc = t.linhas[i]?.[j]; if (tc !== c) difs.push({ linha: i, coluna: j, fonte: c, ts: tc ?? null }); })); est = { estado: difs.length === 0 && fonte.length === t.linhas.length ? 'verbatim' : 'diverge', linhas_ts: t.linhas.length, linhas_fonte: fonte.length, celulas_diferentes: difs };
      }
    } else if (b.tipo === 'figura') {
      const algo = JSON.stringify(ts.corpo).includes('Direct Current') || ts.corpo.some((x) => x.kind === 'figura');
      est = algo ? { estado: 'presente' } : { estado: 'ausente' };
    } else if (b.tipo === 'instrumento') {
      est = { estado: 'fora_do_fluxo', no_corpo: ts.corpo.some((x) => x.kind === 'instrumento'), em_aula_instruments: ts.instrRef.includes(`'${cfg.instId}'`), instruments_literal: ts.instrRef };
    }
    r.por_bloco.push({ bloco: b.id, tipo: b.tipo, ...est });
  }
  ts.corpo.forEach((x, k) => { if (!usados.has(k)) r.blocos_ts_sem_par_na_fonte.push(x); });
  r.ts_total_blocos = ts.corpo.length;
  r.ts_titulo = ts.titulo; r.ts_subtitulo = ts.subtitulo;
  r.ts_lead_presente = ts.lead !== null;
  r.ts_illustrations = ts.illustrations;
  r.ts_activities = ts.activities.map((a) => ({ id: a.id, kind: a.kind, points: a.points, tag: a.config?.tag }));
  r.ts_instruments_ref = ts.instrRef;
  r.ts_aulaIds_glossario = ts.gl;
  r.ts_inst = ts.inst && { id: ts.inst.id, kind: ts.inst.kind, title: ts.inst.title, formula: ts.inst.formula, note: ts.inst.note, fields: ts.inst.fields, outputs: ts.inst.outputs };
  r.ts_calc = ts.calcTxt;
  return r;
}

export { gerar, CFG };

// ================================================================ editorial por aula (+ asserts contra as medições)
// ================================================================ camada editorial
// Citações vêm SEMPRE de linhas lidas (função `cita`), nunca digitadas: se a linha
// mudar, o gerador lança. Texto de juízo (argumento/decisao/nota) fica em prosa aqui.
const cita = (n, re, { html = false } = {}) => {
  const s = html ? line(n) : strip(line(n));
  const m = s.match(re);
  if (!m) throw new Error(`citação não achada na linha ${n}: ${re}`);
  return norm(m[0]);
};
const L_ = (n, re, opts) => ({ texto: cita(n, re, opts), origem: { seletor: 'linha citada', trecho_inicial: cita(n, re, opts).slice(0, 60), linha_aprox: n } });

const SECAO_NOTA = {
  'antes do § 00': 'CSS do componente da figura (comentário "Visual: AC wave"): apresentação, não conteúdo.',
  '§ 00': 'Filosofia do módulo: lista de capacidades/objetivos do módulo, sem tag de aula.',
  '§ MAP': 'Linha da aula na tabela do § MAP: registrada em aula.pergunta_mapa.',
  '§ Final': 'Item do checklist final: registrado em relacionados_nao_vinculados.',
  '§ Lex': 'Verbete do léxico: ver termos_lexico (as ocorrências de outro sentido estão explicadas em leitura_do_contexto).',
  '§ Drill': 'Exercício do § Drill: ver exercicios / exercicios_verificacao.',
  '§ Map': 'Linha do Tradutor (§ Map): registrada em relacionados_nao_vinculados quando relevante.',
  '§ Caso': 'Caso Operação A (aparato): menção ao tema fora da aula, sem vínculo declarado.',
  '§ Ref': 'Referência do § Ref (item de fonte primária), sem vínculo de aula.',
  script: 'Linha do <script>: quiz (relacionado) ou script do instrumento (camada de script da aula, ver instrumentos[0].script).',
  'Aula 01': 'Menção em outra aula; não pertence a esta aula.', 'Aula 02': 'Menção em outra aula; não pertence a esta aula.', 'Aula 03': 'Menção em outra aula; não pertence a esta aula.',
  'Aula 05': 'Menção em outra aula; não pertence a esta aula.', 'Aula 06': 'Menção em outra aula; não pertence a esta aula.', 'Aula 07': 'Menção em outra aula; não pertence a esta aula.',
  'Aula 08': 'Menção em outra aula; não pertence a esta aula.', 'Aula 09': 'Menção em outra aula; não pertence a esta aula.', 'Aula 04': 'Menção em outra aula; não pertence a esta aula.',
};
function leituraOcorrencias(g) {
  const por = {};
  for (const f of g.foraDaSecao) (por[f.secao] ||= new Set()).add(f.linha_aprox);
  return Object.entries(por).map(([secao, ls]) => {
    assert(SECAO_NOTA[secao], 'seção sem leitura editorial: ' + secao);
    return { secao, linhas: [...ls].sort((a, b) => a - b), leitura: SECAO_NOTA[secao] };
  });
}

const COD_ARQUIVOS = (aulaKey, extra) => [
  `src/lib/data/alexandria-modulo-01-content.ts (MODULO_01_LEAD '${aulaKey}'; MODULO_01_CORPO '${aulaKey}'; MODULO_01_AULAS id '${aulaKey}'` + extra + ')',
  'src/lib/data/alexandria-glossario.ts (aulaIds)',
  'src/components/alexandria/viewer/AulaViewer.tsx l.123–127 (ApostilaPanel primeiro, depois aula.instruments.map) e ApostilaPanel.tsx l.81–95 (formula renderiza eq e, se houver, desc), l.124 (kind lista existe) e InstrumentPanel.tsx l.705 (fmt das saídas) — lidos só para entender o efeito das divergências; não são fonte',
];
const nCod = (cod) => cod.map((c, i) => ({ id: `COD-${String(i + 1).padStart(2, '0')}`, ...c }));

const A03 = (g) => {
  const ck = g.checks, pb = (t) => ck.por_bloco.filter((x) => x.tipo === t);
  const fig = pb('figura')[0], f313 = pb('formula')[0], dest = pb('destaque')[0], p32 = ck.por_bloco.find((x) => x.estado === 'diverge' && x.tipo === 'paragrafo');
  assert(fig.estado === 'ausente', 'A03: a figura passou a existir no .ts — rever COD-01');
  assert(f313.estado === 'diverge' && f313.desc_ts === null && f313.eq_igual, 'A03: formula mudou no .ts — rever COD-03');
  assert(dest.estado === 'diverge' && dest.rotulo_no_ts_em === 'html' && dest.corpo_verbatim, 'A03: callout mudou no .ts — rever COD-04');
  assert(p32 && p32.so_na_fonte.join() === '<span>×1' && p32.so_no_ts.length === 0 && ck.span_fechando_sem_abrir_no_corpo === 1, 'A03: 3.2/span órfão mudou — rever COD-02');
  assert(ck.por_bloco.filter((x) => x.estado === 'verbatim').length === 13, 'A03: esperava 13 blocos verbatim (' + ck.por_bloco.filter((x) => x.estado === 'verbatim').length + ')');
  assert(ck.ts_activities.length === 0 && ck.ts_instruments_ref === '', 'A03: .ts passou a ter activities/instruments');
  const bloco = (ini) => g.blocos.find((b) => b.origem.linha_aprox === ini);
  assert(!/<video|<iframe|<img/.test(raw), 'A03: o arquivo tem <img>/<video>/<iframe>');
  assert(!L.slice(1585, 1646).some((s) => /<table/.test(s)), 'A03: há <table> na section');
  assert((raw.match(/ac-wave/g) || []).length === 1 && [...raw.matchAll(/@keyframes (\w+)/g)].map((m) => m[1]).join() === 'fadeUp', 'A03: ac-wave/keyframes mudaram');
  const a09Hits = [];
  for (let n = a09Ini; n <= a09Fim; n++) if (/frequ[eê]ncia|\bHz\b/i.test(line(n))) a09Hits.push(n);
  assert(a09Hits.every((n) => !/Hz/.test(line(n))), 'A09 cita Hz');
  const a09Extra = [], a09Drives = [];
  for (let n = a09Ini; n <= a09Fim; n++) { if (/síncron|sincronism|desarm|(^|[^\p{L}])equilíbrio/iu.test(line(n))) a09Extra.push(n); if (/drives/i.test(line(n))) a09Drives.push(n); }
  assert(a09Extra.length === 0 && a09Drives.length === 1, 'A09: busca adicional mudou');
  const divergencias = [
    {
      id: 'DIV-01', tipo: 'terminologia_interna_sem_definicao',
      o_que: 'O mesmo "60" é chamado de oscilação, alternância e ciclo, sem que a fonte defina os termos.',
      leitura_a: { ...L_(1596, /No Brasil, a alternância ocorre 60 vezes por segundo — frequência de 60 Hz\./), complemento: L_(1590, /oscila sessenta vezes por segundo/) },
      leitura_b: { ...L_(2541, /No Brasil, a frequência da rede pública é de 60 Hz — sessenta ciclos por segundo\./), complemento: L_(2589, /Número de ciclos por segundo de uma corrente alternada\./) },
      argumento: 'A aula (lead e 3.2) fala em "oscila" e em "alternância" 60 vezes por segundo; o léxico fala em "ciclos" por segundo. A fonte não define "alternância", "oscilação" nem "ciclo" e não diz quantas inversões de sentido há por ciclo. Não é contradição demonstrada pela fonte; fica registrada porque o learner lê os três termos como sinônimos sem a fonte autorizar.',
      medido_do_desenho: 'O path da figura (L1614) tem 8 semiondas (4 ondas completas) no quadro de 300 unidades; a fonte não relaciona esse número com 60 Hz (ver figuras[0].celulas[1].medido_do_desenho).',
      decisao: 'não escolhida — termos preservados como na fonte.',
    },
    {
      id: 'DIV-02', tipo: 'duas_cadencias_sem_relacao_declarada',
      o_que: 'A aula cita duas cadências para o equilíbrio entre oferta e demanda: sessenta por segundo e uma por segundo.',
      leitura_a: { ...L_(1590, /A rede elétrica brasileira oscila sessenta vezes por segundo\. Esse ritmo não é arbitrário — é a evidência física de que oferta e demanda estão em equilíbrio em tempo real\./) },
      leitura_b: { ...L_(1640, /Coordena um sistema físico que precisa equilibrar oferta e demanda 86\.400 vezes por dia — uma vez por segundo, todos os segundos\./) },
      argumento: 'No lead, o ritmo de sessenta por segundo é a "evidência física" do equilíbrio; no callout, o ONS equilibra oferta e demanda "uma vez por segundo". A fonte não diz se são a mesma coisa nem como se relacionam. Não é contradição demonstrada; é uma lacuna que um leitor atento vai notar.',
      decisao: 'não escolhida — as duas formulações coexistem na fonte.',
    },
    {
      id: 'DIV-03', tipo: 'promessa_de_retorno_sem_correspondente_encontrado',
      o_que: 'A 3.5 promete voltar ao tema da frequência na Aula 09.',
      leitura_a: { ...L_(1644, /Quando estudarmos qualidade de energia na Aula 09, voltaremos a este ponto\./) },
      leitura_b: { texto: a09Hits.map((n) => cita(n, /Frequência[^<]*/, { html: true })).join(' | '), origem: { seletor: 'section.aula(Aula 09) — ocorrências de "frequência"', trecho_inicial: cita(a09Hits[0], /Frequência[^<]*/, { html: true }).slice(0, 60), linha_aprox: a09Hits[0], linha_fim_aprox: a09Hits[a09Hits.length - 1] }, medido: { linhas_de_a09_com_frequencia_ou_Hz: a09Hits, faixa_da_a09: [a09Ini, a09Fim] } },
      argumento: `Busca por "frequência" e "Hz" dentro da Aula 09 (L${a09Ini}–${a09Fim}) acha só ${a09Hits.length} linhas (L${a09Hits.join(', L')}), todas no sentido de contagem de interrupções (frequência e duração de interrupções; FEC; FIC), e nenhuma com "Hz". Busca adicional na A09 por "síncron", "sincronismo", "desarm" e "equilíbrio": ${a09Extra.length} ocorrências ("drives" ocorre ${a09Drives.length}x, em Harmônicos, L${a09Drives.join(', L')}, sem relação declarada com frequência). Retomada com outras palavras não foi procurada.`,
      decisao: 'não escolhida — a promessa fica registrada; o fio de retorno é decisão da camada Alexandria, não da extração.',
    },
    {
      id: 'DIV-04', tipo: 'rotulo_bloco_x_modulo',
      o_que: 'O callout chama o que vem depois de "Bloco 02"; o resto do arquivo chama de "Módulo 02".',
      leitura_a: { ...L_(1639, /Conexão com o Bloco 02 \(próximo módulo\)/) },
      leitura_b: { ...L_(3199, /Pronto para o Módulo 02\./), complemento: L_(1276, /02 · A Rede Elétrica/) },
      argumento: '"Bloco" aparece uma única vez no arquivo (medido, L1639); o hero-meta (L1276) e o script do quiz (L3199) usam "02 · A Rede Elétrica" e "Módulo 02". O rótulo do callout é literal e o corpo dele diz "próximo módulo". O nome canônico do módulo seguinte é decisão de catálogo (P8/P24).',
      decisao: 'não escolhida — rótulo literal preservado.',
    },
  ];
  const cod = nCod([
    { gravidade: 'alta', onde: "MODULO_01_CORPO['aula-01-03']", o_que: 'A figura DC × AC (div.ac-dc-vis: duas células, cada uma com h5, rótulo e svg) não existe no corpo portado. Nenhum bloco a representa: nem os 2 títulos em inglês, nem os 2 rótulos, nem a senoide e a reta. Perda silenciosa (§5, §12).', fonte: 'L1598–1619', evidencia: { figura: fig } },
    { gravidade: 'média', onde: "MODULO_01_CORPO['aula-01-03'] bloco de 3.2", o_que: `O parágrafo de 3.2 não é verbatim: o <span class="hl"> que envolve "60 Hz" foi removido e o </span> de fechamento ficou ("frequência de 60 Hz</span>."). Fecha-se tag sem abertura: ${ck.span_fechando_sem_abrir_no_corpo} no corpo da aula.`, fonte: 'L1596', evidencia: { dif_tags: { so_na_fonte: p32.so_na_fonte, so_no_ts: p32.so_no_ts }, span_fechando_sem_abrir: ck.span_fechando_sem_abrir_no_corpo } },
    { gravidade: 'média', onde: "MODULO_01_CORPO['aula-01-03'] fórmula de 3.4", o_que: 'A fórmula foi portada com desc: null. A fonte tem div.desc: "Desequilíbrio se manifesta como desvio de frequência" (a frase que diz como o desequilíbrio se manifesta). A eq confere ("Geração ≈ Consumo, em tempo real").', fonte: 'L1631–1634', evidencia: { eq_igual: f313.eq_igual, desc_ts: f313.desc_ts, desc_fonte: f313.desc_fonte } },
    { gravidade: 'média', onde: "MODULO_01_CORPO['aula-01-03'] callout de 3.4", o_que: 'O callout gold foi portado como nota { label: null, html: "Conexão com o Bloco 02 (próximo módulo)" } seguida de parágrafo solto com o corpo. Na fonte o texto é o RÓTULO (div.callout-label) e o parágrafo é o CORPO do mesmo callout. O corpo está verbatim; a hierarquia rótulo/corpo ficou partida (mesmo padrão de COD-08 da aula-08).', fonte: 'L1638–1641', evidencia: { tom_ts: dest.ts_tom, tom_fonte: dest.tom_fonte, rotulo_no_ts_em: dest.rotulo_no_ts_em, corpo_verbatim: dest.corpo_verbatim } },
    { gravidade: 'baixa', onde: "MODULO_01_AULAS aula-01-03 .illustrations", o_que: `illustrations lista ${ck.ts_illustrations.length} arquivos (${ck.ts_illustrations.join(', ')}); a fonte não tem nenhum <img> (medido no arquivo inteiro), então essas gravuras não têm contraparte no HTML. Origem a confirmar fora desta extração.`, fonte: 'arquivo inteiro (0 <img>)', evidencia: { ts_illustrations: ck.ts_illustrations } },
    { gravidade: 'baixa', onde: 'alexandria-glossario.ts aulaIds', o_que: `aulaIds inclui "aula-01-03" em ${ck.ts_aulaIds_glossario.length} verbetes (${ck.ts_aulaIds_glossario.map((x) => x.term).join('; ')}). A fonte não declara aula por termo; a ligação é derivação do código. "Energia" casa só por sentido genérico (ver leitura_do_contexto).`, fonte: 'L2540–2640', evidencia: { verbetes: ck.ts_aulaIds_glossario } },
    { gravidade: 'informativa', onde: 'ids', o_que: 'Código usa "aula-01-03"; esta extração usa "m01-a03" (id estável com prefixo de módulo). Mapeamento 1:1.', fonte: null },
  ]);
  const conforme = [
    'Lead (p.lead) verbatim em MODULO_01_LEAD["aula-01-03"].',
    'Os 5 títulos 3.1–3.5 conferem (número e texto).',
    'Os parágrafos de 3.1, 3.3 (×3), 3.4 (×2) e 3.5, e o corpo do callout, estão verbatim (7 de 8 parágrafos; o de 3.2 diverge em COD-02).',
    'A eq da fórmula de 3.4 confere.',
    `Título da aula = texto do h2 sem <em>${ck.ts_titulo === strip(g.h2) ? ' (conferido: igual)' : ' (DIVERGE: ' + ck.ts_titulo + ')'}; subtítulo = marcador${ck.ts_subtitulo === g.markerNome ? ' (conferido: igual)' : ' (DIVERGE)'}.`,
    'activities: [] e instruments: [] — coerente com a fonte (zero exercício com tag, zero instrumento).',
    'durationMinutes/difficulty/video = null, coerente com a fonte.',
  ];
  assert(ck.ts_titulo === strip(g.h2) && ck.ts_subtitulo === g.markerNome, 'A03: título/subtítulo do .ts divergem — rever "conforme"');
  const termos_leitura = [
    { termo: 'Corrente alternada (AC)', leitura: 'Conceito do verbete. Definido em 3.2; "a corrente alternada venceu" em 3.3 e o marcador "Corrente alternada e frequência". Ligação plausível, não declarada.' },
    { termo: 'Corrente contínua (DC)', leitura: 'Conceito do verbete. Definido em 3.1; "elos de corrente contínua" em 3.3. Ligação plausível, não declarada.' },
    { termo: 'Frequência', leitura: 'Conceito do verbete, assunto da aula (título, 3.4, 3.5). Ligação plausível, não declarada.' },
    { termo: 'ONS', leitura: 'Conceito do verbete, citado no lead, em 3.4 e no callout. n_ocorrencias conta o trecho "ons" dentro de "Conexão", "consumo" etc.; use n_ocorrencias_como_palavra.' },
    { termo: 'Tensão', leitura: 'Sentido do verbete em 3.3 ("elevar e reduzir tensão usando transformadores"). Não é o assunto da aula; ligação fraca.' },
    { termo: 'Energia', leitura: 'Ocorrências em sentido genérico ou composto ("transmitir energia", "organiza energia", "qualidade de energia" — este último é o tema de outra aula). Não é o assunto declarado; não mapear.' },
    { termo: 'Demanda', leitura: 'Ocorrência em "oferta e demanda" (sentido econômico), diferente do verbete (potência exigida em kW). Não mapear.' },
  ];
  for (const t of termos_leitura) assert(g.termos.some((x) => x.termo === t.termo), 'termo da leitura não é candidato: ' + t.termo);
  assert(g.termos.every((x) => termos_leitura.some((t) => t.termo === x.termo)), 'candidato sem leitura editorial');
  return {
    kw: A03.kw,
    ausencias_nota: 'Sem duração, dificuldade, vídeo, <img>, instrumento, exercício com tag ou "Vale lembrar" dentro da section. Medido na section L1585–1646; o arquivo inteiro não tem <img>, <video> nem <iframe>.',
    tabelas_nota: 'Nenhum <table> dentro da section da Aula 03 (medido). A única tabela que menciona a aula é a do § MAP (L1341), registrada em aula.pergunta_mapa.',
    termos_leitura,
    exercicios_nota: 'Nenhum exercício do § Drill tem a tag "Aula 03" (as 8 tags estão em exercicios_verificacao) e nenhum enunciado ou gabarito cita a Aula 03 em prosa. A A03 é uma das três aulas do M01 sem exercício (junto da A06 e da A09); ver DIV-05 de aula-08.json sobre "todas as nove aulas".',
    ocorrencias_leitura: leituraOcorrencias(g),
    cobertura_nota: 'Denominador = texto da section (L1586–1645) sem comentários HTML. Medida por palavra, com tags trocadas por espaço dos dois lados (por isso não há o artefato de colagem de spans que a A08 teve). 100% prova que nenhuma palavra do texto ficou fora dos blocos; ordem e marcação são provadas à parte (campo html verbatim e conferência por linha no verificador).',
    divergencias, arquivos_codigo: COD_ARQUIVOS('aula-01-03', '; lead l.165; corpo l.218–235; aula l.393–412'), conforme, cod,
  };
};
A03.kw = {
  quiz: /frequ[eê]ncia|alternada|\bAC\b|60 Hz|\bONS\b|corrente cont[ií]nua/i, checklist: /\bAC\b|\bDC\b|frequ[eê]ncia|Tesla/i, tradutor: null,
  varredura: { frequencia: /frequ[eê]ncia/i, hz: /60 ?Hz/, ac_dc: /corrente alternada|corrente cont[ií]nua|\bAC\b|\bDC\b/, transformador: /transformador/i, ons: /\bONS\b/, hvdc: /HVDC|Belo Monte/, guerra: /Tesla|Edison|Westinghouse/, batimento: /batimento/i, segundo: /86\.400|por segundo/i },
};

const A04 = (g) => {
  const ck = g.checks, pb = (t) => ck.por_bloco.filter((x) => x.tipo === t);
  const f41 = pb('formula')[0], lst = pb('lista')[0], dest = pb('destaque')[0], inst = pb('instrumento')[0], tab = pb('tabela')[0];
  assert(f41.estado === 'diverge' && f41.desc_ts === null && !f41.eq_igual, 'A04: formula mudou no .ts — rever COD-03');
  assert(lst.estado === 'ausente', 'A04: a lista passou a existir no .ts — rever COD-01');
  assert(inst.estado === 'fora_do_fluxo' && !inst.no_corpo && inst.em_aula_instruments, 'A04: instrumento mudou no .ts — rever COD-02');
  assert(dest.estado === 'diverge' && dest.rotulo_no_ts_em === 'html' && dest.corpo_verbatim, 'A04: callout mudou no .ts — rever COD-04');
  assert(tab.estado === 'verbatim', 'A04: tabela deixou de ser verbatim');
  assert(ck.span_fechando_sem_abrir_no_corpo === 0, 'A04: span órfão no corpo');
  assert(ck.por_bloco.filter((x) => x.estado === 'verbatim').length === 9, 'A04: esperava 9 blocos verbatim (' + ck.por_bloco.filter((x) => x.estado === 'verbatim').length + ')');
  assert(ck.ts_inst && ck.ts_inst.formula === 'P = I² × R', 'A04: formula do inst-03 no .ts mudou');
  assert(ck.ts_calc.includes("n(i['i03-i']) ** 2 * n(i['i03-r'])"), 'A04: calculador do inst-03 mudou');
  const I = g.instrumentos[0];
  const exSrc = g.exercicios[0];
  const act = ck.ts_activities[0];
  assert(act && act.id === 'ex-03' && act.points === 1 && act.tag === exSrc.tag_fonte, 'A04: activity ex-03 diferente do esperado');
  // exercício: enunciado/gabarito verbatim no .ts?
  const tsAct = lerTsAct();
  function lerTsAct() { return g.ts.activities[0]; }
  const exEnunOk = tsAct.prompt === exSrc.enunciado_html;
  const exGabOk = tsAct.config?.gabarito === exSrc.resposta_referencia_html;
  assert(exEnunOk && exGabOk, 'A04: Ex·03 não é verbatim no .ts');
  const fieldTs = Object.fromEntries(ck.ts_inst.fields.map((f) => [f.id, f]));
  const sim = I.medido_execucao_script_simulada;
  const bloco = (ini) => g.blocos.find((b) => b.origem.linha_aprox === ini);
  assert(!/<video|<iframe|<img/.test(raw), 'A04: o arquivo tem <img>/<video>/<iframe>');
  assert(ck.ts_inst.note === I.nota_estatica.html, 'A04: nota do instrumento não é verbatim no .ts');
  assert(ck.ts_inst.title === I.titulo, 'A04: título do instrumento diverge no .ts');
  const divergencias = [
    {
      id: 'DIV-01', tipo: 'fonte_marcacao_x_script',
      o_que: 'Saída inicial do INST·03: o texto da marcação e o que o script escreve no carregamento.',
      leitura_a: { ...L_(1689, /<span id="i03-out">5,000<\/span>/, { html: true }), origem: { seletor: 'span#i03-out (marcação)', trecho_inicial: '5,000', linha_aprox: 1689 } },
      leitura_b: { ...L_(2808, /out\.textContent = P\.toLocaleString\('pt-BR', \{ maximumFractionDigits: 0 \}\);/, { html: true }), origem: { seletor: 'script calc()', trecho_inicial: 'out.textContent = P.toLocaleString', linha_aprox: 2808 }, medido: { saida_apos_carregar_com_os_padroes: I.cenario_padrao.medido_saida_apos_carregar } },
      argumento: `Com os padrões da marcação (100 A, 0,5 Ω) o script, executado contra um DOM mínimo, escreve "${I.cenario_padrao.medido_saida_apos_carregar}" (calc() roda no carregamento), enquanto a marcação traz "5,000": o mesmo valor numérico de entrada com separador diferente. O learner vê a saída do script. A fonte não diz qual formato é o pretendido.`,
      decisao: 'não escolhida — as duas formas coexistem na fonte.',
    },
    {
      id: 'DIV-02', tipo: 'terminologia_interna',
      o_que: 'A aula descreve a relação da perda com a corrente ora como "ao quadrado", ora como "exponencial".',
      leitura_a: { ...L_(1666, /O exponencial é o que muda tudo\./), complemento: L_(1692, /Esse comportamento exponencial é a razão por que transmissão de energia em escala continental usa alta tensão\./, { html: false }) },
      leitura_b: { ...L_(1654, /Por que perdas crescem ao quadrado\./), complemento: L_(1663, /Perdas resistivas crescem com o quadrado da corrente/, { html: false }), complemento_2: L_(3093, /Esse crescimento quadrático/, { html: false }) },
      argumento: 'O título, a legenda da fórmula e o feedback do quiz usam "quadrado/quadrático"; o parágrafo de 4.1 e a nota do instrumento usam "exponencial". A fórmula da própria aula é P = I² × R (L1662). A fonte não distingue os dois termos. Observação do extrator (não é fato da fonte): o texto trata como sinônimos dois rótulos que a fórmula da aula não trata como iguais; não foi alterado.',
      decisao: 'não escolhida — rótulos preservados como na fonte.',
    },
    {
      id: 'DIV-03', tipo: 'relacao_sem_ressalva',
      o_que: 'A 4.2 usa "P = V × I" para a transmissão sem a ressalva que a Aula 02 e o léxico fazem.',
      leitura_a: { ...L_(1698, /Para transmitir a mesma potência \(P = V × I\)/) },
      leitura_b: { ...L_(1515, /Em corrente contínua \(e como aproximação inicial em corrente alternada\), a relação é direta:/), complemento: L_(2621, /P = V × I \(potência em DC\)/), complemento_2: L_(1629, /todo sistema interligado em corrente alternada/) },
      argumento: 'A Aula 02 apresenta P = V × I como relação direta "em corrente contínua (e como aproximação inicial em corrente alternada)" e o léxico (Lei de Ohm) a rotula "potência em DC"; a Aula 03 diz que o sistema interligado é de corrente alternada. A 4.2 aplica a mesma expressão à transmissão sem qualificar. Não se afirma erro: a fonte só não repete a ressalva.',
      decisao: 'não escolhida — texto preservado como na fonte.',
    },
    {
      id: 'DIV-04', tipo: 'campo_duplo_com_faixas_diferentes',
      o_que: 'Cada campo do INST·03 tem um input number e um deslizador gêmeo com limites diferentes.',
      leitura_a: { ...L_(1678, /<input type="number" id="i03-i" value="100" min="0" step="5">/, { html: true }), complemento: L_(1683, /<input type="number" id="i03-r" value="0\.5" min="0" step="0\.1">/, { html: true }) },
      leitura_b: { ...L_(1679, /<input type="range" id="i03-i-range" min="10" max="500" value="100" step="5">/, { html: true }), complemento: L_(1684, /<input type="range" id="i03-r-range" min="0\.1" max="5" value="0\.5" step="0\.1">/, { html: true }) },
      argumento: 'O number não tem max e aceita 0; o deslizador vai de 10 a 500 A e de 0,1 a 5 Ω. O script calcula sempre a partir dos valores dos inputs number e copia o valor de um para o outro nas duas direções. Medido: com 600 A digitado, a saída do script é 180.000 (600² × 0,5); o que o navegador faz com o deslizador nesse caso não foi medido aqui.',
      decisao: 'não escolhida — as duas faixas coexistem; o porte (campo único) precisa decidir qual vale.',
    },
  ];
  const cod = nCod([
    { gravidade: 'alta', onde: "MODULO_01_CORPO['aula-01-04'] bloco de 4.2", o_que: 'A lista (ul com 3 li: Transmissão, Subtransmissão e distribuição, Baixa tensão residencial) não foi portada. O parágrafo de 4.2 termina em "Por isso:" e, no código, o próximo bloco é o callout: o parágrafo termina no vazio. É a lista que traz os níveis de tensão de cada trecho da rede (230–750 kV, 13,8–138 kV, 127/220 V). ApostilaPanel já tem o kind lista (l.124); a perda é de porte, não de componente.', fonte: 'L1698–1704', evidencia: { lista: lst } },
    { gravidade: 'alta', onde: 'AulaViewer.tsx + MODULO_01_AULAS aula-01-04 .instruments', o_que: 'O INST·03 não tem posição no fluxo: fica em aula.instruments e é renderizado depois de TODA a apostila (AulaViewer.tsx l.123–127). Na fonte ele está entre o parágrafo de 4.1 que termina em "Veja:" e o h3 4.2. Viola C5 (posição no ponto da prosa) e a Regra-mãe 1; o "Veja:" fica sem nada depois.', fonte: 'L1666–1697', evidencia: { instrumento: inst } },
    { gravidade: 'média', onde: "MODULO_01_CORPO['aula-01-04'] fórmula de 4.1", o_que: `A fórmula foi portada como eq "${f41.eq_ts}" com desc: null. A fonte tem eq com <sub>perdas</sub> e <sup>2</sup> (texto sem tags: "${f41.eq_fonte_texto}") e div.desc "${f41.desc_fonte}". Os índices viraram texto solto com espaço ("P perdas", "I 2") e a descrição se perdeu. Observação: o campo formula.eq do componente é texto puro (protocolo §14), então a forma fiel (eq_html) não cabe sem decisão de render.`, fonte: 'L1661–1664', evidencia: { eq_ts: f41.eq_ts, eq_fonte_texto: f41.eq_fonte_texto, desc_ts: f41.desc_ts, desc_fonte: f41.desc_fonte } },
    { gravidade: 'média', onde: "MODULO_01_CORPO['aula-01-04'] callout de 4.2", o_que: 'O callout (sem classe de tom) foi portado como nota { tom: "neutro", label: null, html: "Por que isso aparece na sua fatura" } seguida de parágrafo solto com o corpo. Na fonte o texto é o RÓTULO (div.callout-label) e o parágrafo é o CORPO do mesmo callout. O corpo está verbatim; o tom "neutro" é do código (a fonte não declara tom).', fonte: 'L1706–1709', evidencia: { tom_ts: dest.ts_tom, tom_fonte: dest.tom_fonte, rotulo_no_ts_em: dest.rotulo_no_ts_em, corpo_verbatim: dest.corpo_verbatim } },
    { gravidade: 'média', onde: 'INSTRUMENTOS_MODULO_01 inst-03 .formula', o_que: `formula = "${ck.ts_inst.formula}" não existe no HTML dentro do instrumento. A fórmula da aula é a div.formula de 4.1 (P com <sub>perdas</sub>, I com <sup>2</sup>), fora do div.instrument; o instrumento não declara fórmula.`, fonte: 'L1661–1664 (eq); instrumento L1669–1695', evidencia: { formula_ts: ck.ts_inst.formula } },
    { gravidade: 'baixa', onde: 'INSTRUMENTOS_MODULO_01 inst-03 .fields', o_que: `Cada par number+range virou 1 campo kind "range" (protocolo §12): i03-i min ${fieldTs['i03-i'].min} max ${fieldTs['i03-i'].max} step ${fieldTs['i03-i'].step}; i03-r min ${fieldTs['i03-r'].min} max ${fieldTs['i03-r'].max} step ${fieldTs['i03-r'].step}. Na fonte o input number tem min 0 e não tem max; só o range tem 10–500 e 0,1–5 (DIV-04). O código adotou as faixas do range e perdeu a do number.`, fonte: 'L1678–1684', evidencia: { fields_ts: ck.ts_inst.fields } },
    { gravidade: 'baixa', onde: 'InstrumentPanel.tsx fmt() (l.705) + alexandria-instrument-calculators.ts', o_que: 'Formatação da saída: a fonte usa toLocaleString pt-BR com 0 casas (maximumFractionDigits: 0): 15 A × 0,3 Ω = 67,5 W aparece "68". O painel usa até 2 casas para saídas que não são R$ ("67,5"). Não medido na renderização; deduzido do código (mesmo achado da COD-07 da aula-08).', fonte: 'L2808', evidencia: { saida_fonte_simulada: sim.find((s) => s.caso.startsWith('valores fracionários')).saida_apos_evento } },
    { gravidade: 'baixa', onde: 'alexandria-instrument-calculators.ts n()', o_que: 'n() usa Number(v) e o original usa parseFloat(v) || 0 (L2805–2806). Diferem para strings com sufixo não numérico ("12abc"); com input type=number a diferença é praticamente inalcançável. Registrada por fidelidade (§10). A lógica P = I² × R é a mesma.', fonte: 'L2805–2807', evidencia: { calculo_ts: ck.ts_calc.split('\n').slice(0, 3).join(' ').trim() } },
    { gravidade: 'baixa', onde: "MODULO_01_AULAS aula-01-04 activities[0].points", o_que: '`points: 1` não tem origem na fonte (o § Drill não pontua exercícios). Valor atribuído pelo código. Tag, enunciado e gabarito do Ex · 03 estão verbatim.', fonte: 'L2409–2416', evidencia: { activity: act } },
    { gravidade: 'baixa', onde: 'MODULO_01_AULAS aula-01-04 .illustrations', o_que: `illustrations lista ${ck.ts_illustrations.join(', ')}; a fonte não tem nenhum <img> (medido no arquivo inteiro). Origem a confirmar fora desta extração.`, fonte: 'arquivo inteiro (0 <img>)', evidencia: { ts_illustrations: ck.ts_illustrations } },
    { gravidade: 'baixa', onde: 'alexandria-glossario.ts aulaIds', o_que: `aulaIds inclui "aula-01-04" em ${ck.ts_aulaIds_glossario.length} verbetes (${ck.ts_aulaIds_glossario.map((x) => x.term).join('; ')}). A fonte não declara aula por termo; ligação derivada pelo código. "Energia" e "Potência" casam só por sentido genérico (ver leitura_do_contexto).`, fonte: 'L2540–2680', evidencia: { verbetes: ck.ts_aulaIds_glossario } },
    { gravidade: 'informativa', onde: 'ids', o_que: 'Código usa "aula-01-04", "inst-03", "ex-03"; esta extração usa "m01-a04", "m01-inst-03", "m01-ex-03". Mapeamento 1:1.', fonte: null },
  ]);
  const conforme = [
    'Lead verbatim; títulos 4.1–4.3 conferem; os 4 parágrafos (4.1 ×2, 4.2, 4.3) verbatim; a tabela 4.3 (cabeçalho + 2 linhas × 3 colunas) verbatim, célula a célula.',
    'Corpo do callout verbatim.',
    `Título da aula = texto do h2 sem <em>${ck.ts_titulo === strip(g.h2) ? ' (conferido)' : ' (DIVERGE)'}; subtítulo = marcador${ck.ts_subtitulo === g.markerNome ? ' (conferido)' : ' (DIVERGE)'}.`,
    'INST·03: título, ids dos campos, rótulos, unidades, padrões (100 / 0,5), rótulo e unidade da saída e a nota estática verbatim; a lógica P = I² × R é a mesma do script.',
    'Ex · 03: tag, enunciado e gabarito verbatim; vinculado à aula-01-04 pela tag.',
    'durationMinutes/difficulty/video = null, coerente com a fonte.',
  ];
  assert(ck.ts_titulo === strip(g.h2) && ck.ts_subtitulo === g.markerNome, 'A04: título/subtítulo do .ts divergem');
  const termos_leitura = [
    { termo: 'Energia', leitura: 'Ocorrências em sentido genérico ("energia elétrica se transforma em calor", "dissipa menos energia", "custo da energia em si"). Não é o assunto declarado; não mapear.' },
    { termo: 'Grupo A', leitura: 'Uma ocorrência, em "Grupo A1, A2" (subgrupos), no callout de 4.2. O verbete "Grupo A" define a classe e sua subdivisão está sob a pendência QA-M01-A06 (decisão do Founder, não resolvida aqui). Não mapear sem essa decisão.' },
    { termo: 'Perdas técnicas', leitura: 'Conceito do verbete e assunto de 4.2 (callout) e 4.3 (título e tabela). Ligação plausível, não declarada.' },
    { termo: 'Perdas não técnicas', leitura: 'Conceito do verbete e assunto de 4.3 (título, tabela, último parágrafo). Ligação plausível, não declarada.' },
    { termo: 'Potência', leitura: 'Uma ocorrência, em "transmitir a mesma potência (P = V × I)", no sentido do verbete. Assunto lateral da aula; ligação fraca.' },
    { termo: 'Tensão', leitura: 'Conceito do verbete, assunto de 4.2 ("tensão alta com corrente baixa") e do marcador. Ligação plausível, não declarada.' },
    { termo: 'TUSD', leitura: 'Conceito do verbete: "TUSD-fio" no callout e "embutidas na TUSD" na tabela 4.3. Ligação plausível, não declarada.' },
  ];
  for (const t of termos_leitura) assert(g.termos.some((x) => x.termo === t.termo), 'termo da leitura não é candidato: ' + t.termo);
  assert(g.termos.every((x) => termos_leitura.some((t) => t.termo === x.termo)), 'A04: candidato sem leitura editorial: ' + g.termos.map((t) => t.termo));
  termos_leitura.push({ termo: '(sem verbete)', leitura: '"Efeito Joule" e "dissipação resistiva" (4.1) não têm verbete. "Lei de Ohm" tem verbete cuja definição cita P = I² × R (perdas resistivas), mas o nome não ocorre no texto da A04 (ocorre na A02).' });
  return {
    kw: A04.kw,
    ausencias_nota: 'Sem duração, dificuldade, vídeo, <img>, referência por aula ou "Vale lembrar" dentro da section. Medido na section L1651–1724; o arquivo inteiro não tem <img>, <video> nem <iframe>.',
    tabelas_nota: 'Uma tabela (4.3, "Técnicas" × "Não técnicas") dentro da section: 3 colunas, cabeçalho + 2 linhas, sem <caption>. Está em blocos[tabela] com cabeçalho e células (html e texto).',
    termos_leitura,
    exercicios_nota: 'Ex · 03 (tag "Ex · 03 · Aula 04") é o único exercício vinculado. Nenhum outro enunciado ou gabarito cita a Aula 04 em prosa (medido).',
    ocorrencias_leitura: leituraOcorrencias(g),
    cobertura_nota: 'Denominador = texto da section (L1652–1723) sem comentários HTML e sem o div.instrument (L1669–1695), §5. Medida por palavra, com tags trocadas por espaço dos dois lados. 100% prova que nenhuma palavra do texto da aula (inclusive a lista e a tabela) ficou fora dos blocos; o texto do instrumento está em instrumentos[0].',
    divergencias, arquivos_codigo: COD_ARQUIVOS('aula-01-04', '; INSTRUMENTOS_MODULO_01 inst-03 l.71–83; lead l.166; corpo l.236–248; aula l.414–439') .concat(['src/lib/data/alexandria-instrument-calculators.ts (inst-03 ~l.1716–1718; helper n() l.40–44)']), conforme, cod,
  };
};
A04.kw = {
  quiz: /perdas resistivas/i, checklist: /I²|alta tens[aã]o|perdas|Lei de Ohm/i, tradutor: /Corrente alta|perdas/i,
  varredura: { perdas: /perdas?\b/i, joule: /Joule/, i2: /I²|I<sup>2<\/sup>/, alta_tensao: /alta tens[aã]o/i, tusd_fio: /TUSD-fio|componente fio/i, i03: /i03|INST · 03/, quadrado: /quadrado|quadrupl|nove vezes/i, manaus: /Manaus/, nao_tecnicas: /n[aã]o t[eé]cnicas/i },
};

// ---------------------------------------------------------------- renderizador do .md (a partir do JSON)
function mdAula(out) {
  const a = out.aula, NN = String(a.numero).padStart(2, '0');
  const num = (n) => n.toLocaleString('pt-BR');
  const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const lin = (o) => (o.linha_fim_aprox && o.linha_fim_aprox !== o.linha_aprox ? `L${o.linha_aprox}–${o.linha_fim_aprox}` : `L${o.linha_aprox}`);
  const o = [];
  o.push(`# M01·A${NN}: ${a.marcador.nome}`, '', `**${a.titulo_h2_texto}**`, '', `Arquivo de dados: [\`aula-${NN}.json\`](aula-${NN}.json).`, '');
  o.push(`- **Fonte (só leitura):** \`${out.meta.fonte}\`, ${num(out.meta.fonte_total_linhas)} linhas. A section da aula ocupa as linhas ${out.meta.aula_linhas.section[0]} a ${out.meta.aula_linhas.section[1]} (o comentário de abertura está nas linhas ${out.meta.aula_linhas.inicio} a ${out.meta.aula_linhas.inicio + 2}).`);
  if (out.instrumentos.length) { const s = out.instrumentos[0].script_origem; o.push(`- **Camada de script:** o script do INST·03 está nas linhas ${s.linha_aprox} a ${s.linha_fim_aprox} e foi extraído linha a linha e executado contra um DOM mínimo (instrumentos[0].script e medido_execucao_script_simulada).`); }
  o.push('- **Como foi extraído:** `extratores/gen-aulas-03-04.mjs` percorre a section linha a linha e lança erro se encontrar uma linha que não classifica. O campo `html` guarda o innerHTML literal; `texto` guarda o mesmo sem tags (tags removidas sem espaço, então `<sub>`/`<span>` vizinhos colam). Nenhuma prosa foi digitada à mão.');
  const c = out.cobertura_texto_por_token;
  o.push(`- **Cobertura por token (§5):** ${c.tokens_casados} de ${c.tokens_fonte_sem_instrumento} tokens casados (${String(c.pct).replace('.', ',')}%)${out.instrumentos.length ? ', sem contar o markup do instrumento' : ''}. Tokens não casados: ${c.tokens_nao_casados.length ? c.tokens_nao_casados.join(', ') : 'nenhum'}.`);
  o.push('- **Verificação:** ver a seção "Verificação" no fim.', '');
  o.push('## Estrutura do JSON', '', '| Chave | Conteúdo |', '|---|---|');
  o.push(`| \`meta\` | Fonte, linhas, método, convenções de id e de campos medidos |`);
  o.push(`| \`aula\` | Marcador ("${a.marcador.num}"), título do h2 (html e texto), comentário de abertura e a pergunta do § MAP (L${a.pergunta_mapa.origem.linha_aprox}): "${esc(a.pergunta_mapa.pergunta_texto)}". Duração, dificuldade e vídeo ficam em \`null\`, com nota |`);
  o.push(`| \`blocos[]\` | ${out.blocos.length} blocos na ordem da fonte (ver mapa abaixo). Cada bloco tem \`origem {seletor, trecho_inicial, linha_aprox, linha_fim_aprox}\` |`);
  if (out.figuras.length) o.push(`| \`figuras[]\` | \`${out.figuras[0].id}\`: duas células (DC e AC), cada uma com h5, rótulo e svg (elementos line/path com atributos literais). Sem título, sem escala, sem fonte citada: campos \`null\` com nota |`);
  o.push(`| \`tabelas\` / \`listas\` / \`destaques\` | ids dos blocos de cada tipo: ${out.tabelas.length} tabela(s), ${out.listas.length} lista(s), ${out.destaques.length} destaque(s). "Vale lembrar" não existe na fonte |`);
  o.push(`| \`paragrafos_que_terminam_em_dois_pontos\` | Medida de quais parágrafos prometem um bloco seguinte e qual bloco a fonte põe em seguida |`);
  o.push(`| \`termos_lexico\` | Candidatos por correspondência textual (sem vínculo declarado), com contexto e a leitura de cada um |`);
  o.push(`| \`instrumentos[]\` | ${out.instrumentos.length ? 'INST·03 completo: campos (number + range gêmeo), saída, nota estática, cenário-padrão medido, execução simulada e script literal' : 'Vazio: a aula não tem instrumento'} |`);
  o.push(`| \`exercicios[]\` / \`exercicios_verificacao\` | ${out.exercicios.length ? 'Ex · 03 com enunciado e gabarito verbatim' : 'Vazio: nenhuma tag "Aula 03" no § Drill'}; as 8 tags verbatim e a varredura de referências em prosa |`);
  o.push(`| \`relacionados_nao_vinculados[]\` | ${out.relacionados_nao_vinculados.map((r) => r.id).join(', ')} (sem tag de aula, fora da posse da aula, P9) |`);
  o.push(`| \`ocorrencias_fora_da_secao\` | Varredura do arquivo inteiro por padrão temático (${out.ocorrencias_fora_da_secao.itens.length} ocorrências) com a leitura por seção |`);
  o.push(`| \`divergencias[]\` | ${out.divergencias.length} divergências da fonte, cada uma com as duas leituras e sem escolha |`);
  o.push(`| \`comparacao_codigo\` | Verificação estruturada contra o .ts, o que está conforme e ${out.comparacao_codigo.divergencias.length} divergências COD |`, '');
  o.push('## Mapa de blocos', '', '| # | Tipo | Linhas | Início do texto |', '|---|---|---|---|');
  out.blocos.forEach((b, i) => o.push(`| ${i + 1} | ${b.tipo}${b.numero ? ' ' + b.numero : ''} | ${lin(b.origem)} | ${esc(b.origem.trecho_inicial)} |`));
  const cb = out.contagens;
  o.push('', `**Contagens.** ${cb.blocos} blocos: ${Object.entries(cb.blocos_por_tipo).map(([k, v]) => `${k} ${v}`).join(', ')}. Seções ${cb.secoes_numeradas.join(', ')}. Fórmulas ${cb.formulas} (${cb.formulas_com_desc} com descrição). Figuras ${cb.figuras}, tabelas ${cb.tabelas}, listas ${cb.listas}, destaques ${cb.destaques}, instrumentos ${cb.instrumentos}. Exercícios vinculados ${cb.exercicios_vinculados}, relacionados sem vínculo ${cb.relacionados_nao_vinculados}, termos candidatos ${cb.termos_lexico_candidatos} entre os ${cb.verbetes_lexico_modulo} do léxico. Divergências: ${cb.divergencias_fonte} da fonte e ${cb.divergencias_codigo} com o código.`, '');
  if (out.figuras.length) {
    const f = out.figuras[0];
    o.push(`## Figura ${f.id}: DC × AC`, '');
    f.celulas.forEach((ce) => o.push(`- **"${ce.h5}"** (${lin(ce.origem)}). Rótulo: "${ce.label}". svg viewBox \`${ce.svg.viewBox}\`, ${ce.svg.elementos.length} elementos (${ce.svg.elementos.map((e) => e.elemento + (e.atributos.id ? '#' + e.atributos.id : '') + ' ' + (e.atributos.stroke ?? '')).join('; ')}).${ce.medido_do_desenho ? ` Medido do desenho: ${ce.medido_do_desenho.semiondas_desenhadas} semiondas (${ce.medido_do_desenho.ondas_completas_desenhadas} ondas) no quadro de ${ce.medido_do_desenho.largura_viewbox}.` : ''}`));
    o.push('', `Sem título, sem escala, sem unidade e sem texto dentro do svg (medido). Os dois h5 estão em inglês e a CSS os põe em caixa alta. Nenhuma fonte citada. O texto da aula que descreve o sinal está em 3.1 (Sinal "reto" no osciloscópio) e em 3.2 (Sinal senoidal no osciloscópio). Medido: #ac-wave aparece 1 vez no arquivo (na marcação) e o único @keyframes do arquivo é fadeUp (L1227), então a figura não tem animação própria.`, '');
  }
  if (out.instrumentos.length) {
    const I = out.instrumentos[0];
    o.push('## INST·03: resumo da especificação', '');
    o.push(`- **Título:** "${I.titulo}". O id na fonte é "${I.id_fonte}". Na taxonomia, o kind é \`calculadora\`.`, `- **Pergunta:** \`null\`. A prancha não tem pergunta própria; a pergunta da aula está no § MAP.`, '- **Entradas** (cada uma é um input number com deslizador gêmeo):', '', '| Id | Rótulo | Unid. | Padrão | Number: mín / máx / passo | Range: mín / máx / passo |', '|---|---|---|---|---|---|');
    I.entradas.forEach((e) => o.push(`| \`${e.id}\` | ${e.rotulo} | ${e.unidade} | ${e.number.padrao} | ${e.number.min} / sem máx. / ${e.number.step} | ${e.range_gemeo.min} / ${e.range_gemeo.max} / ${e.range_gemeo.step} |`));
    const s = I.saidas[0];
    o.push('', `- **Saída \`${s.id}\`:** "${s.rotulo}", em ${s.unidade}. O script calcula \`${s.formula_exata_script[2].replace(/;$/, '')}\` (com as coerções \`|| 0\` das duas leituras) e escreve em pt-BR com 0 casas decimais.`, `- **Texto de leitura:** não há. O \`div.instrument-note\` é estático ("${esc(I.nota_estatica.texto)}") e o script não o toca.`, `- **Cenário-padrão:** ${I.cenario_padrao.entradas['i03-i']} A e ${I.cenario_padrao.entradas['i03-r']} Ω. A marcação traz "${I.cenario_padrao.medido_saida_marcacao}" e o script escreve "${I.cenario_padrao.medido_saida_apos_carregar}" (DIV-01).`, `- **Medido contra a própria nota:** dobrar a corrente quadruplica a saída (${I.medido_confere_nota_do_instrumento.dobrar_corrente_quadruplica_a_saida ? 'confere' : 'NÃO confere'}); triplicar multiplica por 9 (${I.medido_confere_nota_do_instrumento.triplicar_corrente_noveplica_a_saida ? 'confere' : 'NÃO confere'}).`, '- **Fonte dos números:** `null`. A fonte não cita procedência para o cenário nem para as faixas dos deslizadores.', '- **Tolerâncias:** `null`. Nenhuma declarada (P6); o instrumento não tem previsão nem correção.', '');
    o.push('| Caso (execução do script original) | Saída |', '|---|---|');
    I.medido_execucao_script_simulada.forEach((m) => o.push(`| ${esc(m.caso)} | ${m.saida_apos_evento} W |`));
    o.push('', '## Onde o instrumento é invocado (C5)', '', `1. **${lin(out.invocacoes_no_texto[0].origem)}, último parágrafo de 4.1.** Termina em "…as perdas crescem nove vezes. Veja:". O \`div.instrument\` vem logo depois (${lin(I.origem)}) e antes do h3 **4.2**. A posição correta é esta: depois de "Veja:", antes de "A solução: trocar corrente por tensão".`, '2. A nota do próprio instrumento ("Dobre a corrente. Veja a perda quadruplicar.") repete a lição do parágrafo; não remete a outro bloco.', '');
  }
  o.push('## Parágrafos que terminam em ":" (o que a fonte põe depois)', '', '| Parágrafo | Termina em | Próximo bloco na fonte |', '|---|---|---|');
  out.paragrafos_que_terminam_em_dois_pontos.forEach((p) => o.push(`| ${lin({ linha_aprox: p.linha })} | "…${esc(p.termina_em)}" | ${p.proximo_bloco_na_fonte ? p.proximo_bloco_na_fonte.tipo : '—'} |`));
  o.push('');
  o.push('## Exercício', '', out.exercicios.length ? `**${out.exercicios[0].tag_fonte}** (${lin(out.exercicios[0].origem)}): ${esc(out.exercicios[0].enunciado_texto)} O gabarito está verbatim no JSON; o botão da fonte é "${out.exercicios[0].botao_gabarito}". ${out.exercicios_nota}` : out.exercicios_nota, '');
  o.push('## Relacionados sem vínculo de aula (P9)', '');
  out.relacionados_nao_vinculados.forEach((r) => o.push(`- \`${r.id}\` (${lin(r.origem)}): ${esc(r.enunciado ?? r.texto ?? r.conceito_fisico).replace(/<[^>]+>/g, '')}`));
  o.push('', '## Léxico: candidatos e leitura do contexto', '', '| Termo | Ocorrências (palavra) | Leitura |', '|---|---|---|');
  out.termos_lexico.leitura_do_contexto.forEach((t) => { const c2 = out.termos_lexico.candidatos.find((x) => x.termo === t.termo); o.push(`| ${t.termo} | ${c2 ? c2.n_ocorrencias_como_palavra : '—'} | ${esc(t.leitura)} |`); });
  o.push('', '## Divergências na fonte (sem escolha)', '');
  out.divergencias.forEach((d) => {
    o.push(`- **${d.id}** (${d.tipo}). ${d.o_que}`, `  - Leitura A (${lin(d.leitura_a.origem)}): "${esc(d.leitura_a.texto)}"${d.leitura_a.complemento ? ` e "${esc(d.leitura_a.complemento.texto)}" (${lin(d.leitura_a.complemento.origem)})` : ''}`, `  - Leitura B (${lin(d.leitura_b.origem)}): "${esc(d.leitura_b.texto)}"${d.leitura_b.complemento ? ` e "${esc(d.leitura_b.complemento.texto)}" (${lin(d.leitura_b.complemento.origem)})` : ''}${d.leitura_b.complemento_2 ? ` e "${esc(d.leitura_b.complemento_2.texto)}" (${lin(d.leitura_b.complemento_2.origem)})` : ''}`, `  - ${d.argumento}`, `  - Decisão: ${d.decisao}`);
  });
  o.push('', '## Divergências em relação ao código portado', '', '| Id | Gravidade | Onde | Divergência | Fonte |', '|---|---|---|---|---|');
  out.comparacao_codigo.divergencias.forEach((d) => o.push(`| ${d.id} | ${d.gravidade} | ${esc(d.onde)} | ${esc(d.o_que)} | ${esc(d.fonte ?? '—')} |`));
  o.push('', '**O que está conforme:**', ...out.comparacao_codigo.conforme.map((x) => `- ${x}`), '');
  o.push('## O que a fonte não tem (ausência declarada)', '', `- ${out.aula.ausencias_nota}`, '- Pergunta de previsão, tolerâncias, gabarito de instrumento: não existem na fonte (P3/P6/P11).', ...(out.figuras.length ? ['- A figura não tem título, escala, unidade nem fonte citada.'] : ['- O instrumento não tem fonte dos números nem texto de leitura dinâmico.']), '- Vínculo entre aula e termo do léxico, ou entre aula e item de quiz/checklist: não declarado.', '');
  o.push('## Pendências do Founder', '', 'Esta aula não toca QA-M01-A06 (Grupo A ≥ 2,3 kV × subgrupo AS) nem QA-M01-A07 (FP 0,85 → 15% de reativos). ' + (a.numero === 4 ? 'O callout de 4.2 cita "Grupo A1, A2" (subgrupos); não foi lido como pendência, só registrado em termos_lexico.' : ''), '', '## Verificação', '', '<!-- verif:start -->', '_(preenchida por `verify-aulas-03-04.mjs --stamp`)_', '<!-- verif:end -->', '');
  return o.join('\n');
}

const editorial = {
  3: Object.assign((g) => ({ ...A03(g), md: mdAula }), { kw: A03.kw }),
  4: Object.assign((g) => ({ ...A04(g), md: mdAula }), { kw: A04.kw }),
};

function montar(cfg) {
  cfg.kw = editorial[cfg.aulaNum].kw;
  const g = gerar(cfg);
  const ed = editorial[cfg.aulaNum](g, { L, line, strip, norm, inner, a09Ini, a09Fim, exerciciosFonte, quizFonte, glossFonte, checklistFonte, tradutorFonte, raw });
  return { g, ed };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const n of [3, 4]) {
    const { g, ed } = montar(CFG[n]);
    const NN = g.NN;
    const contagensPorTipo = g.blocos.reduce((a, b) => ((a[b.tipo] = (a[b.tipo] || 0) + 1), a), {});
    const out = {
      meta: {
        grupo: `aula${NN}`, modulo: 'M01', aula: `M01·A${NN}`, fonte: SRC, fonte_somente_leitura: true, fonte_total_linhas: TOTAL_LINHAS,
        aula_linhas: { inicio: g.c0, fim: g.cfg.secEnd, section: [g.cfg.secStart, g.cfg.secEnd], nota: `comentário de abertura L${g.c0}–${g.c0 + 2}; section.aula L${g.cfg.secStart}–${g.cfg.secEnd}. A faixa do brief (L1585–1650 / L1651–1728) inclui o comentário de abertura da aula seguinte.` },
        extraido_em: '2026-11-14',
        metodo: 'Extração programática: o gerador percorre a section linha a linha com um walker que lança erro em qualquer linha não classificada (nada é descartado em silêncio). Campos `html` guardam o innerHTML literal; campos `texto` guardam o mesmo conteúdo sem tags (tags → "", entidades decodificadas), de modo que <sub>/<sup>/<span> adjacentes colam ao texto vizinho. O script do instrumento foi executado contra um DOM mínimo para medir saídas. Nenhuma prosa foi digitada à mão; as notas editoriais estão em `*_nota`, `nota`, `argumento`, `decisao` e são conferidas pelo verificador apenas quanto às citações literais.',
        protocolo: 'docs/alexandria/extraction-protocol.md', taxonomia: 'docs/alexandria/instrument-taxonomy.md', contrato: 'docs/alexandria-v2/bar.md (§4 Peça C, §9, P3, P5, P6, P8, P9, P11, P14)',
        extratores: 'docs/alexandria-v2/extraction/m01/extratores/gen-aulas-03-04.mjs (+ editorial-aulas-03-04.mjs), verify-aulas-03-04.mjs',
        convencoes: {
          ausencia: 'null + campo *_nota explicando o que foi medido',
          ids: `m01-a${NN}-bNN-<tipo> para blocos (ordem da fonte); m01-a${NN}-fig-NN; m01-inst-03; m01-ex-03`,
          vinculos: 'só quando a fonte declara (tag, posição dentro da section, remissão textual literal); correspondência textual é marcada como tal',
          campos_medidos: 'chaves que começam por `medido` ou `derivado` são medidas do extrator, não literais da fonte, e o verificador as ignora',
        },
      },
      aula: {
        id: g.AULA_ID, numero: g.cfg.aulaNum,
        marcador: { num: g.markerNum, nome: g.markerNome, origem: origem(g.itens.find((i) => i.tipo === 'marcador').ini, null, 'div.aula-marker', `${g.markerNum} ${g.markerNome}`) },
        comentario_de_abertura: { texto: g.comentarioAula, origem: { seletor: 'comentário HTML antes da section', trecho_inicial: g.comentarioAula.replace(/<!--|-->/g, '').trim().slice(0, 40), linha_aprox: g.c0 + 1 }, nota: 'Comentário HTML antes da section (não renderizado). Registrado porque difere do marcador/§ MAP.' },
        titulo_h2_html: g.h2, titulo_h2_texto: strip(g.h2), titulo_h2_origem: origem(g.itens.find((i) => i.tipo === 'h2').ini, null, 'h2.aula-title', g.h2),
        pergunta_mapa: { numero: strip(g.mapaCells[0]), tema: strip(g.mapaCells[1]), pergunta_html: g.mapaCells[2], pergunta_texto: strip(g.mapaCells[2]), origem: origem(g.cfg.mapa, null, `§ MAP table > tbody > tr(${g.NN})`, g.mapaCells[2]), nota: 'Única pergunta que a fonte declara para esta aula. Vive na tabela do § MAP, não na aula.' },
        duracao_min: null, dificuldade: null, video: null,
        ausencias_nota: ed.ausencias_nota,
      },
      blocos: g.blocos,
      figuras: g.extras.figuras,
      tabelas: g.extras.tabelas.map((id) => id),
      tabelas_nota: ed.tabelas_nota,
      listas: g.extras.listas,
      destaques: g.blocos.filter((b) => b.tipo === 'destaque').map((b) => b.id),
      vale_lembrar: null,
      vale_lembrar_nota: 'A expressão "Vale lembrar" não ocorre no HTML do M01 (medido por busca no arquivo inteiro). O único destaque desta aula é o callout (ver destaques).',
      paragrafos_que_terminam_em_dois_pontos: g.terminaEmDoisPontos,
      paragrafos_que_terminam_em_dois_pontos_nota: 'Medido: parágrafos cujo texto termina em ":" e o bloco que a fonte coloca em seguida. Onde o porte perdeu o bloco seguinte, o parágrafo termina no vazio.',
      termos_lexico: {
        vinculo_declarado_pela_fonte: false,
        nota: 'O glossário da fonte (§ Lex) não declara aula por termo. Abaixo: verbetes cujo nome-base (sem parênteses) ocorre como palavra no texto da section. Correspondência textual, não posse — ler ocorrencias_contexto antes de ligar (§2 do protocolo). `siglas_nao_casadas` lista verbetes cuja sigla entre parênteses aparece no texto mas cujo nome-base não.',
        total_verbetes_fonte: glossFonte.length, candidatos: g.termos, siglas_nao_casadas: g.siglas,
        leitura_do_contexto: ed.termos_leitura,
      },
      instrumentos: g.instrumentos,
      invocacoes_no_texto: g.invocacoes,
      exercicios: g.exercicios,
      exercicios_nota: ed.exercicios_nota,
      exercicios_verificacao: { tags_do_drill_verbatim: g.todasTags, referencias_em_prosa_a_esta_aula_dentro_dos_exercicios: g.refsProsa, nota: 'Varridos enunciado e gabarito dos 8 exercícios (§4 do protocolo). Vínculo de posse = tag "… · Aula NN".' },
      relacionados_nao_vinculados: g.relacionados,
      ocorrencias_fora_da_secao: { nota: 'Varredura por padrão no arquivo inteiro, fora da section. Serve ao "não falta item": cada ocorrência cai no § MAP, no § Final, no § Lex, no § Drill, no § Quiz, no § Map (Tradutor), no § 00 ou nas aulas vizinhas — ver ed.ocorrencias_leitura. O verificador confere a linha.', padroes: Object.fromEntries(Object.entries(editorial[g.cfg.aulaNum].kw.varredura).map(([k, v]) => [k, v.source])), itens: g.foraDaSecao, leitura: ed.ocorrencias_leitura },
      cobertura_texto_por_token: { ...g.cobertura, nota: ed.cobertura_nota },
      divergencias: ed.divergencias,
      comparacao_codigo: {
        arquivos: ed.arquivos_codigo,
        verificacoes_programaticas: g.checks,
        conforme: ed.conforme,
        divergencias: ed.cod,
      },
      contagens: {
        blocos: g.blocos.length, blocos_por_tipo: contagensPorTipo,
        secoes_numeradas: g.blocos.filter((b) => b.tipo === 'titulo').map((b) => b.numero),
        figuras: g.extras.figuras.length, tabelas: g.extras.tabelas.length, listas: g.extras.listas.length, destaques: g.blocos.filter((b) => b.tipo === 'destaque').length,
        formulas: g.blocos.filter((b) => b.tipo === 'formula').length, formulas_com_desc: g.blocos.filter((b) => b.tipo === 'formula' && b.desc !== null).length,
        vale_lembrar: 0, instrumentos: g.instrumentos.length, entradas_instrumento: g.instrumentos[0]?.entradas.length ?? 0, saidas_numericas_instrumento: g.instrumentos[0]?.saidas.length ?? 0,
        invocacoes_no_texto: g.invocacoes.length, exercicios_vinculados: g.exercicios.length, relacionados_nao_vinculados: g.relacionados.length,
        termos_lexico_candidatos: g.termos.length, verbetes_lexico_modulo: glossFonte.length,
        divergencias_fonte: ed.divergencias.length, divergencias_codigo: ed.cod.length,
      },
    };
    fs.writeFileSync(OUT + `aula-${NN}.json`, JSON.stringify(out, null, 2) + '\n', 'utf8');
    fs.writeFileSync(OUT + `aula-${NN}.md`, ed.md(out), 'utf8');
    console.log(JSON.stringify({ aula: NN, blocos: g.blocos.length, por_tipo: contagensPorTipo, cobertura: { ...g.cobertura, tokens_nao_casados: g.cobertura.tokens_nao_casados }, termos: g.termos.map((t) => [t.termo, t.n_ocorrencias]), siglas: g.siglas, ocorrencias_fora: g.foraDaSecao.length, relacionados: g.relacionados.map((r) => r.id), exercicios: g.exercicios.map((e) => e.id), checks: g.checks.por_bloco.map((x) => `${x.tipo}:${x.estado}`) }, null, 1));
  }
}
