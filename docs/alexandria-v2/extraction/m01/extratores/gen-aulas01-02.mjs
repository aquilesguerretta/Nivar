// Gera aula-01.json / aula-01.md / aula-02.json / aula-02.md em
// docs/alexandria-v2/extraction/m01/ por extração programática estrita.
//
// Nenhum texto de conteúdo é digitado à mão: tudo sai de fatias do HTML-fonte.
// O percorredor (walkSection) LANÇA ERRO em qualquer linha que não reconhece,
// para que nada seja descartado em silêncio (o defeito do porte antigo).
// Só os campos de comentário (`nota`, `*_nota`, `o_que`, `decisao`, ...) são
// prosa nossa; o verificador (verify-aulas01-02.mjs) ignora exatamente essas chaves.
//
// Uso: node gen-aulas01-02.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUTDIR = path.resolve(HERE, '..');
const REPO = path.resolve(HERE, '../../../../..');
const TS_CONTENT = path.join(REPO, 'src/lib/data/alexandria-modulo-01-content.ts');
const TS_CALC = path.join(REPO, 'src/lib/data/alexandria-instrument-calculators.ts');

const raw = fs.readFileSync(SRC, 'utf8');
const L = raw.split(/\r?\n/);
if (L[L.length - 1] === '') L.pop(); // 3212 linhas
const line = (n) => L[n - 1];
const indentOf = (s) => s.length - s.trimStart().length;

const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const strip = (h) => decode(h.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const trecho = (s) => strip(s).slice(0, 60);
const origem = (n, seletor, html, fim) => ({ seletor, trecho_inicial: trecho(html), linha_aprox: n, ...(fim && fim !== n ? { linha_fim_aprox: fim } : {}) });
const fail = (m) => { throw new Error(m); };
const assertLine = (n, needle) => { if (!line(n).includes(needle)) fail(`linha ${n} sem "${needle}": ${line(n)}`); };

// fim de um bloco que abre numa linha `<div ...>`: próxima linha `</div>` com a mesma indentação
function blockEnd(start) {
  const ind = indentOf(line(start));
  for (let n = start + 1; n <= L.length; n++) if (indentOf(line(n)) === ind && line(n).trim() === '</div>') return n;
  return fail('bloco sem fechamento a partir da linha ' + start);
}
const attrsOf = (s) => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
function inlines(html) {
  const out = {};
  for (const [k, re] of [['hl', /<span class="hl">(.*?)<\/span>/g], ['strong', /<strong>(.*?)<\/strong>/g], ['b', /<b>(.*?)<\/b>/g], ['em', /<em>(.*?)<\/em>/g], ['i', /<i>(.*?)<\/i>/g]]) {
    const a = [...html.matchAll(re)].map((m) => strip(m[1]));
    if (a.length) out[k] = a;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Configuração por aula (âncoras: o gerador confere cada uma contra a fonte)
// ---------------------------------------------------------------------------
const AULAS = [
  {
    n: 1, id: 'm01-a01', instId: 'm01-inst-01', exId: 'm01-ex-01', codeKey: 'aula-01-01', codeInst: 'inst-01',
    open: 1358, close: 1479, comentario: 1356, mapLine: 1339,
    markerAnchor: 'Aula 01', instAnchor: 'INSTRUMENT 01: kWh calculator', scriptAnchor: 'INSTRUMENT 01: kWh = kW × h', exTag: 'Ex · 01 · Aula 01',
    relacionados: [
      { id: 'm01-quiz-q01', tipo: 'quiz', needle: 'Um motor de 20 kW opera por 4 horas' },
      { id: 'm01-checklist-01', tipo: 'checklist', needle: 'Explicar kW vs kWh em 30 segundos' },
      { id: 'm01-checklist-02', tipo: 'checklist', needle: 'Dar um exemplo de Energia = Potência × Tempo' },
    ],
  },
  {
    n: 2, id: 'm01-a02', instId: 'm01-inst-02', exId: 'm01-ex-02', codeKey: 'aula-01-02', codeInst: 'inst-02',
    open: 1484, close: 1580, comentario: 1482, mapLine: 1340,
    markerAnchor: 'Aula 02', instAnchor: "INSTRUMENT 02: Ohm's Law calculator", scriptAnchor: "INSTRUMENT 02: Ohm's Law calculator", exTag: 'Ex · 02 · Aula 02',
    relacionados: [
      { id: 'm01-quiz-q02', tipo: 'quiz', needle: 'Em corrente contínua aproximada, qual a relação entre tensão' },
      { id: 'm01-checklist-06', tipo: 'checklist', needle: 'Explicar a Lei de Ohm' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Léxico (global ao arquivo)
// ---------------------------------------------------------------------------
const gloss = [];
for (let n = 2500; n <= 2700; n++) {
  const m = (line(n) || '').match(/<summary><span class="term">(.*?)<\/span><span class="unit">(.*?)<\/span><\/summary>/);
  if (m) {
    const d = line(n + 1).match(/<div class="glossary-content">(.*)<\/div>/);
    if (!d) fail('glossário sem conteúdo na linha ' + (n + 1));
    gloss.push({ n, term: decode(m[1]), unit: decode(m[2]), def: d[1] });
  }
}
if (gloss.length !== 38) fail('esperava 38 verbetes, achei ' + gloss.length);
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---------------------------------------------------------------------------
// Execução do script-fonte em DOM simulado (método mais forte, protocolo §10)
// ---------------------------------------------------------------------------
function makeEl(id, value = '') {
  return { id, value, textContent: '', _l: {}, addEventListener(ev, fn) { (this._l[ev] ||= []).push(fn); }, fire(ev) { (this._l[ev] || []).forEach((f) => f()); } };
}
function runScript(code, ids, initial = {}, texts = {}) {
  const els = Object.fromEntries(ids.map((id) => [id, makeEl(id, initial[id] ?? '')]));
  for (const [id, t] of Object.entries(texts)) els[id].textContent = t; // texto da marcação, antes de o script rodar
  new Function('document', code)({ getElementById: (id) => els[id] });
  return els;
}
function scriptRange(anchor) {
  // linha do comentário-âncora; o bloco começa na linha `/* ====` anterior e vai até o primeiro `})();`
  const a = L.findIndex((s, i) => i > 2700 && s.includes(anchor)) + 1;
  if (a <= 0) fail('âncora de script não achada: ' + anchor);
  let ini = a - 1; if (!line(ini).includes('/* ====')) fail('esperava /* ==== antes de ' + anchor);
  let fim = a; while (!/^\}\)\(\);\s*$/.test(line(fim))) fim++;
  return { ini, fim };
}

// ---------------------------------------------------------------------------
// Percorredor estrito da <section class="aula">
// ---------------------------------------------------------------------------
function walkSection(cfg) {
  const { open, close } = cfg;
  assertLine(open, '<section class="aula">');
  assertLine(open + 1, '<div class="container">');
  assertLine(close, '</section>');
  if (line(close - 1).trim() !== '</div>') fail('container não fecha em ' + (close - 1));

  const blocos = [];
  const tipoCount = {};
  const bid = (t) => `${cfg.id}-b${String(blocos.length + 1).padStart(2, '0')}-${t}`;
  let secNum = null; let pOrd = 0; let marcador = null; let h2 = null; let instBloco = null;
  const push = (tipo, n, seletor, campos, extra = {}, fim) => {
    const ref = campos.html ?? campos.texto ?? campos.eq_html ?? campos.rotulo ?? '';
    tipoCount[tipo] = (tipoCount[tipo] || 0) + 1;
    blocos.push({ id: bid(tipo), tipo, ...campos, origem: origem(n, seletor, ref, fim), ...extra });
  };

  let i = open + 2;
  const end = close - 2;
  while (i <= end) {
    const s = line(i); const t = s.trim();
    let m;
    if (t === '') { i++; continue; }

    if ((m = t.match(/^<div class="aula-marker"><span class="num">(.*?)<\/span><span class="dot"><\/span><span>(.*?)<\/span><\/div>$/))) {
      marcador = { num: m[1], nome: m[2], origem: origem(i, 'div.aula-marker', `${m[1]} ${m[2]}`) };
      i++; continue;
    }
    if ((m = t.match(/^<h2 class="aula-title">(.*)<\/h2>$/))) { h2 = { html: m[1], texto: strip(m[1]), origem: origem(i, 'h2.aula-title', m[1]) }; i++; continue; }
    if ((m = t.match(/^<p class="lead">(.*)<\/p>$/))) {
      push('lead', i, `section.aula(${cfg.markerAnchor}) > .container > p.lead`, { html: m[1], texto: strip(m[1]), ...(Object.keys(inlines(m[1])).length ? { marcacao_inline: inlines(m[1]) } : {}) });
      i++; continue;
    }
    if ((m = t.match(/^<h3><span class="num">(.*?)<\/span>(.*)<\/h3>$/))) {
      secNum = m[1]; pOrd = 0;
      push('titulo', i, `h3 > span.num(${m[1]})`, { numero: m[1], texto: strip(m[2]), html: t.replace(/^<h3>|<\/h3>$/g, '') });
      i++; continue;
    }
    if ((m = t.match(/^<p(?: style="([^"]*)")?>(.*)<\/p>$/))) {
      pOrd++;
      const inl = inlines(m[2]);
      push('paragrafo', i, `h3(${secNum}) ~ p:nth-of-type(${pOrd})`, { html: m[2], texto: strip(m[2]), ...(m[1] ? { estilo_inline: m[1] } : {}), ...(Object.keys(inl).length ? { marcacao_inline: inl } : {}) });
      i++; continue;
    }
    if (t === '<div class="formula">') {
      const e = blockEnd(i);
      const eq = line(i + 1).match(/^\s*<div class="eq">(.*)<\/div>$/);
      const desc = line(i + 2).match(/^\s*<div class="desc">(.*)<\/div>$/);
      if (!eq) fail('formula sem eq em ' + (i + 1));
      if (e !== i + (desc ? 3 : 2)) fail('formula com linhas inesperadas em ' + i);
      push('formula', i, `h3(${secNum}) ~ div.formula > div.eq`, {
        eq_html: eq[1], eq_texto: strip(eq[1]),
        desc_html: desc ? desc[1] : null, desc_texto: desc ? strip(desc[1]) : null,
      }, desc ? { nota: 'div.desc presente na fonte (o porte antigo gravou desc = null).' } : { nota: 'div.formula sem div.desc na fonte.' }, e);
      i = e + 1; continue;
    }
    if (t === '<div class="table-wrap">') {
      const e = blockEnd(i);
      const cab = []; const linhas = [];
      for (let n = i + 1; n < e; n++) {
        const lt = line(n).trim();
        if (['<table>', '</table>', '<thead>', '</thead>', '<tbody>', '</tbody>'].includes(lt)) continue;
        if (/^(<thead>)?<tr>.*<\/tr>(<\/thead>)?$/.test(lt)) {
          if (lt.includes('<th>')) {
            for (const c of lt.matchAll(/<th>(.*?)<\/th>/g)) cab.push({ html: c[1], texto: strip(c[1]) });
          } else {
            const cels = [...lt.matchAll(/<td(?: class="([^"]*)")?>(.*?)<\/td>/g)].map((c) => ({ html: c[2], texto: strip(c[2]), ...(c[1] ? { td_classe: c[1] } : {}) }));
            if (!cels.length) fail('linha de tabela sem td em ' + n);
            // confere que a linha foi totalmente consumida
            const resto = lt.replace(/<td(?: class="[^"]*")?>.*?<\/td>/g, '').replace(/<\/?tr>/g, '');
            if (resto.trim()) fail('resto não consumido na linha de tabela ' + n + ': ' + resto);
            linhas.push({ celulas: cels, origem: origem(n, `tbody > tr:nth-child(${linhas.length + 1})`, cels[0].html) });
          }
          continue;
        }
        fail('linha inesperada dentro de table-wrap em ' + n + ': ' + lt);
      }
      push('tabela', i, `h3(${secNum}) ~ div.table-wrap > table`, { cabecalho: cab, linhas, n_colunas: cab.length, n_linhas_dados: linhas.length }, {}, e);
      i = e + 1; continue;
    }
    if ((m = t.match(/^<div class="callout(?: (\w+))?">$/))) {
      const e = blockEnd(i);
      const tom = m[1] ?? 'neutro';
      const lab = line(i + 1).match(/^\s*<div class="callout-label">(.*)<\/div>$/);
      if (!lab) fail('callout sem rótulo em ' + (i + 1));
      const ps = [];
      for (let n = i + 2; n < e; n++) {
        const pm = line(n).trim().match(/^<p(?: style="([^"]*)")?>(.*)<\/p>$/);
        if (!pm) fail('linha inesperada em callout ' + n + ': ' + line(n));
        const inl = inlines(pm[2]);
        ps.push({ html: pm[2], texto: strip(pm[2]), ...(pm[1] ? { estilo_inline: pm[1] } : {}), ...(Object.keys(inl).length ? { marcacao_inline: inl } : {}), origem: origem(n, `div.callout > p:nth-of-type(${ps.length + 1})`, pm[2]) });
      }
      push('destaque', i, `div.callout${m[1] ? '.' + m[1] : ''}`, { tom, classe_literal: t.match(/class="([^"]*)"/)[1], rotulo: lab[1], paragrafos: ps }, {
        nota: `rótulo (div.callout-label, linha ${i + 1}) + ${ps.length} parágrafo(s) no corpo. A fonte não usa a expressão "Vale lembrar".`,
      }, e);
      i = e + 1; continue;
    }
    if (t.startsWith('<div class="three-levels"')) {
      const e = blockEnd(i);
      const dataId = attrsOf(t)['data-id'];
      const abas = []; const paineis = [];
      for (let n = i + 1; n < e; n++) {
        const lt = line(n).trim();
        let bm;
        if (['<div class="three-levels-tabs">', '<div class="three-levels-content">', '</div>'].includes(lt)) continue;
        if ((bm = lt.match(/^<button class="three-levels-tab( active)?" data-target="(\d+)">(.*)<\/button>$/))) {
          abas.push({ indice: Number(bm[2]), ativa_na_carga: !!bm[1], rotulo: strip(bm[3]), html: bm[3], origem: origem(n, `button.three-levels-tab[data-target=${bm[2]}]`, bm[3]) });
          continue;
        }
        if ((bm = lt.match(/^<div class="three-levels-panel( active)?">(.*)<\/div>$/))) {
          paineis.push({ indice: paineis.length, ativo_na_carga: !!bm[1], html: bm[2], texto: strip(bm[2]), ...(Object.keys(inlines(bm[2])).length ? { marcacao_inline: inlines(bm[2]) } : {}), origem: origem(n, `div.three-levels-panel:nth-child(${paineis.length + 1})`, bm[2]) });
          continue;
        }
        fail('linha inesperada em three-levels ' + n + ': ' + lt);
      }
      if (abas.length !== paineis.length) fail('abas ≠ painéis');
      push('tres_niveis', i, `h3(${secNum}) ~ div.three-levels[data-id=${dataId}]`, { data_id: dataId, abas, paineis }, {
        nota: 'Componente de abas: cada aba (button) abre o painel de mesmo índice (script THREE-LEVELS TABS, L2963–2979). Os três painéis são o conteúdo da seção; o porte antigo só gravou o h3.',
      }, e);
      i = e + 1; continue;
    }
    if (t.startsWith('<!-- INSTRUMENT')) {
      if (!t.includes(cfg.instAnchor)) fail('comentário de instrumento inesperado: ' + t);
      const ini = i + 1; assertLine(ini, '<div class="instrument">');
      const e = blockEnd(ini);
      instBloco = { comentario: i, ini, fim: e };
      push('instrumento', i, `div.instrument (comentário na linha ${i})`, { ref: cfg.instId, texto: strip(line(ini + 2).match(/<div class="instrument-title">(.*)<\/div>/)[1]) }, {
        vinculos: { instrumento: cfg.instId }, nota: `Posição literal na fonte: depois do bloco anterior e antes do bloco seguinte da sequência. Especificação completa em instrumentos[0]. Linhas ${ini}–${e}.`,
      }, e);
      i = e + 1; continue;
    }
    fail(`linha não reconhecida pelo extrator (${i}): ${s}`);
  }
  if (!marcador || !h2) fail('sem marcador/h2');
  return { blocos, marcador, h2, instBloco, tipoCount };
}

// ---------------------------------------------------------------------------
// Instrumento (leitura da marcação + script + execução)
// ---------------------------------------------------------------------------
function extractInstrument(cfg, instBloco) {
  const { ini, fim } = instBloco;
  const instTitle = line(ini + 2).match(/<div class="instrument-title">(.*)<\/div>/)[1];
  const instId = line(ini + 3).match(/<div class="instrument-id">(.*)<\/div>/)[1];
  // instrução opcional (p dentro de instrument-body)
  let instrucao = null;
  for (let n = ini; n <= fim; n++) {
    const pm = line(n).trim().match(/^<p(?: style="([^"]*)")?>(.*)<\/p>$/);
    if (pm) instrucao = { html: pm[2], texto: strip(pm[2]), estilo_inline: pm[1] ?? null, origem: origem(n, 'div.instrument-body > p', pm[2]) };
  }
  const entradas = [];
  for (let n = ini; n <= fim; n++) {
    const lm = line(n).match(/<label class="field-label">(.*?) <span class="unit">(.*?)<\/span><\/label>/);
    if (!lm) continue;
    const im = line(n + 1).match(/<input ([^>]*)>/);
    if (!im) fail('input ausente após label em ' + n);
    const a = attrsOf(im[1]);
    entradas.push({
      id: a.id, rotulo: decode(lm[1]), unidade: decode(lm[2]), tipo_input: a.type,
      padrao: a.value !== undefined ? Number(a.value) : null,
      padrao_nota: a.value !== undefined ? undefined : 'Sem atributo value: campo nasce vazio.',
      placeholder: a.placeholder ?? null,
      min: a.min !== undefined ? Number(a.min) : null,
      max: a.max !== undefined ? Number(a.max) : null,
      max_nota: a.max !== undefined ? undefined : 'Sem atributo max na fonte.',
      step: a.step === undefined ? null : (a.step === 'any' ? 'any' : Number(a.step)),
      atributos_literais: a,
      origem: { seletor: `input#${a.id}`, trecho_inicial: `${decode(lm[1])} ${decode(lm[2])}`, linha_aprox: n + 1 },
    });
  }
  const outLabelLn = [...Array(fim - ini + 1).keys()].map((k) => ini + k).find((n) => line(n).includes('class="output-label"'));
  const outLabel = line(outLabelLn).match(/<span class="output-label">(.*)<\/span>/)[1];
  const outValLn = outLabelLn + 1;
  const ov = line(outValLn).match(/<span class="output-value"([^>]*)>(.*)<\/span>$/);
  const outId = ov[2].match(/<span id="([^"]+)">(.*?)<\/span>/);
  const outUnit = (ov[2].match(/<span class="unit">(.*?)<\/span>/) || [])[1] ?? null;
  const noteLn = [...Array(fim - ini + 1).keys()].map((k) => ini + k).find((n) => line(n).includes('class="instrument-note"'));
  const noteHtml = line(noteLn + 1).trim();
  if (line(noteLn + 2).trim() !== '</div>') fail('nota do instrumento com mais de uma linha em ' + noteLn);
  const { ini: sIni, fim: sFim } = scriptRange(cfg.scriptAnchor);
  const scriptLinhas = []; for (let n = sIni; n <= sFim; n++) scriptLinhas.push({ n, texto: line(n) });
  const scriptCode = L.slice(sIni - 1, sFim).join('\n');
  return {
    instTitle, instId, instrucao, entradas, saida: { id: outId[1], rotulo: outLabel, valor_inicial_marcacao: outId[2], unidade: outUnit, estilo_inline: (ov[1] || '').trim() || null, origem: origem(outLabelLn, `div.instrument-output > span#${outId[1]}`, outLabel, outValLn) },
    noteHtml, noteLn: noteLn + 1, script: { ini: sIni, fim: sFim, linhas: scriptLinhas, codigo: scriptCode }, ini, fim,
  };
}

// ---------------------------------------------------------------------------
// Camada de script: execução do script-fonte
// ---------------------------------------------------------------------------
function execInst01(inst) {
  const ids = ['i01-kw', 'i01-h', 'i01-out'];
  const ini = Object.fromEntries(inst.entradas.map((e) => [e.id, String(e.padrao)]));
  const casos = [
    { nome: 'carga (valores da marcação)', set: {} },
    { nome: 'nota da fonte, cenário 1: 50 kW × 1 h', set: { 'i01-kw': '50', 'i01-h': '1' } },
    { nome: 'nota da fonte, cenário 2: 1 kW × 50 h', set: { 'i01-kw': '1', 'i01-h': '50' } },
    { nome: 'campos vazios', set: { 'i01-kw': '', 'i01-h': '' } },
    { nome: 'arredondamento: 0,333 kW × 1 h', set: { 'i01-kw': '0.333', 'i01-h': '1' } },
    { nome: 'milhar: 1500 kW × 2 h', set: { 'i01-kw': '1500', 'i01-h': '2' } },
  ];
  return casos.map((c) => {
    const els = runScript(inst.script.codigo, ids, ini);
    for (const [id, v] of Object.entries(c.set)) { els[id].value = v; els[id].fire('input'); }
    return { nome: c.nome, entradas: { 'i01-kw': els['i01-kw'].value, 'i01-h': els['i01-h'].value }, saida_texto: els['i01-out'].textContent };
  });
}
function execInst02(inst) {
  const ids = ['i02-v', 'i02-i', 'i02-r', 'i02-status'];
  const passos = (arr) => arr.map(([id, v]) => ({ campo: id, valor: v }));
  const cenarios = [
    { nome: 'carga', passos: [] },
    { nome: 'só V preenchido', passos: passos([['i02-v', '220']]) },
    { nome: 'V e I → calcula R', passos: passos([['i02-v', '220'], ['i02-i', '10']]) },
    { nome: 'V e R → calcula I', passos: passos([['i02-v', '220'], ['i02-r', '22']]) },
    { nome: 'I e R → calcula V', passos: passos([['i02-i', '10'], ['i02-r', '22']]) },
    { nome: 'V e I (R calculado = 22,000), depois V = 110 → coerência', passos: passos([['i02-v', '220'], ['i02-i', '10'], ['i02-v', '110']]) },
    { nome: 'I e R (V calculado = 220,00), depois V redigitado = 220 → coerente', passos: passos([['i02-i', '10'], ['i02-r', '22'], ['i02-v', '220']]) },
    { nome: 'V e I (R calculado), depois R editado = 25 (os três preenchidos, handler de R)', passos: passos([['i02-v', '220'], ['i02-i', '10'], ['i02-r', '25']]) },
    { nome: 'V e I (R calculado), depois V esvaziado', passos: passos([['i02-v', '220'], ['i02-i', '10'], ['i02-v', '']]) },
    { nome: 'V e I (R calculado), depois I esvaziado', passos: passos([['i02-v', '220'], ['i02-i', '10'], ['i02-i', '']]) },
    { nome: 'I e R (V calculado = 220,00), depois V = 0', passos: passos([['i02-i', '10'], ['i02-r', '22'], ['i02-v', '0']]) },
    { nome: 'V e I (R calculado), depois R esvaziado (o handler de R reescreve R = V ÷ I)', passos: passos([['i02-v', '220'], ['i02-i', '10'], ['i02-r', '']]) },
  ];
  const map = { 'i02-v': 'V', 'i02-i': 'I', 'i02-r': 'R' };
  return cenarios.map((c) => {
    const els = runScript(inst.script.codigo, ids, {}, { 'i02-status': inst.saida.valor_inicial_marcacao });
    const snap = () => ({ V: els['i02-v'].value, I: els['i02-i'].value, R: els['i02-r'].value, status: els['i02-status'].textContent });
    const trilha = [{ apos: 'carga (sem eventos; o texto vem da marcação, o script não chama calc() no carregamento)', ...snap() }];
    for (const p of c.passos) { els[p.campo].value = p.valor; els[p.campo].fire('input'); trilha.push({ apos: `${map[p.campo]} = ${JSON.stringify(p.valor)}`, ...snap() }); }
    return { nome: c.nome, passos: c.passos, estados: trilha };
  });
}

// ---------------------------------------------------------------------------
// Análise contra o código portado
// ---------------------------------------------------------------------------
const lf = (s) => s.split('\r\n').join('\n');
const tsContent = lf(fs.readFileSync(TS_CONTENT, 'utf8'));
const tsCalc = lf(fs.readFileSync(TS_CALC, 'utf8'));
function tsBlocos(key) {
  const m = tsContent.match(new RegExp(`'${key}': \\[\\n([\\s\\S]*?)\\n  \\],`));
  if (!m) fail('corpo do código não achado: ' + key);
  return m[1].split('\n').filter((s) => s.trim()).map((s) => new Function('return (' + s.trim().replace(/,$/, '') + ')')());
}
const stripClass = (h) => h.replace(/ class="[^"]*"/g, '');
function compara(cfg, blocos) {
  const ts = tsBlocos(cfg.codeKey);
  const rel = { n_blocos_codigo: ts.length, paragrafos_verbatim: 0, paragrafos_texto_igual_marcacao_diferente: [], paragrafos_ausentes: [], titulos_ausentes: [], formulas: [], tabelas: [], destaques: [], tres_niveis: [], span_orfao_total: 0, span_hl_removidos_total: 0 };
  const tsP = ts.filter((b) => b.kind === 'paragrafo');
  const tsT = ts.filter((b) => b.kind === 'titulo');
  const tsF = ts.filter((b) => b.kind === 'formula');
  const tsTab = ts.filter((b) => b.kind === 'tabela');
  const tsN = ts.filter((b) => b.kind === 'nota');
  const countOrf = (h) => (h.match(/<\/span>/g) || []).length - (h.match(/<span/g) || []).length;
  for (const b of ts) { const h = b.html ?? ''; const o = countOrf(h); if (o > 0) rel.span_orfao_total += o; }
  const srcPar = [];
  for (const b of blocos) {
    if (b.tipo === 'paragrafo') srcPar.push(b);
    if (b.tipo === 'titulo') { if (!tsT.some((t) => t.numero === b.numero && t.texto === b.texto)) rel.titulos_ausentes.push(b.numero); }
    if (b.tipo === 'formula') {
      const f = tsF.find((x) => x.eq === b.eq_texto);
      rel.formulas.push({ numero_bloco: b.id, eq_texto: b.eq_texto, no_codigo: !!f, eq_igual: !!f, desc_fonte: b.desc_texto, desc_codigo: f ? f.desc : '(fórmula ausente)' });
    }
    if (b.tipo === 'tabela') {
      let verb = 0, semClasse = 0, ausentes = 0, total = 0;
      const tt = tsTab.find((t) => t.linhas[0].map((c) => strip(c)).join('|') === b.cabecalho.map((c) => c.texto).join('|'));
      for (const [ri, r] of b.linhas.entries()) for (const [ci, c] of r.celulas.entries()) {
        total++;
        const v = tt && tt.linhas[ri + 1] ? tt.linhas[ri + 1][ci] : undefined;
        if (v === undefined) ausentes++; else if (v === c.html) verb++; else if (stripClass(c.html) === v) semClasse++; else ausentes++;
      }
      rel.tabelas.push({ bloco: b.id, no_codigo: !!tt, celulas: total, verbatim: verb, so_difere_por_atributo_class: semClasse, divergentes: ausentes });
    }
    if (b.tipo === 'destaque') {
      const lab = tsN.find((x) => x.html === b.rotulo);
      let achados = 0;
      for (const p of b.paragrafos) if (tsP.some((x) => strip(x.html) === p.texto)) achados++;
      rel.destaques.push({ bloco: b.id, tom_fonte: b.tom, rotulo: b.rotulo, rotulo_no_codigo_como: lab ? `nota{tom:"${lab.tom}", label:${JSON.stringify(lab.label)}, html:rótulo}` : 'ausente', paragrafos_fonte: b.paragrafos.length, paragrafos_no_codigo: achados });
    }
    if (b.tipo === 'tres_niveis') {
      const achaPainel = b.paineis.filter((p) => ts.some((x) => strip(x.html ?? '') === p.texto)).length;
      const achaAba = b.abas.filter((a) => ts.some((x) => strip(x.html ?? x.texto ?? '') === a.rotulo)).length;
      rel.tres_niveis.push({ bloco: b.id, paineis_fonte: b.paineis.length, paineis_no_codigo: achaPainel, abas_fonte: b.abas.length, abas_no_codigo: achaAba });
    }
  }
  for (const b of srcPar) {
    const v = tsP.find((x) => x.html === b.html);
    if (v) { rel.paragrafos_verbatim++; continue; }
    const t = tsP.find((x) => strip(x.html) === b.texto);
    if (t) {
      rel.paragrafos_texto_igual_marcacao_diferente.push({ bloco: b.id, linha_fonte: b.origem.linha_aprox, span_hl_na_fonte: (b.html.match(/<span class="hl">/g) || []).length, span_fechamento_orfao_no_codigo: countOrf(t.html), html_codigo: t.html });
      rel.span_hl_removidos_total += (b.html.match(/<span class="hl">/g) || []).length;
    } else rel.paragrafos_ausentes.push({ bloco: b.id, linha_fonte: b.origem.linha_aprox, texto: b.texto.slice(0, 80) });
  }
  // parágrafos do código sem correspondente (nota: pega os rótulos de callout promovidos a parágrafo, se houver)
  return rel;
}

// ---------------------------------------------------------------------------
// Execução por aula
// ---------------------------------------------------------------------------
function termosLexico(cfg, secTextoCompleto) {
  const aulaNorm = norm(secTextoCompleto);
  const termos = [];
  for (const g of gloss) {
    const base = g.term.replace(/\s*\(.*\)\s*$/, '');
    const re = new RegExp(`(^|[^\\p{L}])${reEsc(norm(base))}([^\\p{L}]|$)`, 'u');
    if (!re.test(aulaNorm)) continue;
    const reG = new RegExp(`(?<![\\p{L}])${reEsc(norm(base))}(?![\\p{L}])`, 'gu');
    const ocorr = []; let mm;
    while ((mm = reG.exec(aulaNorm)) && ocorr.length < 12) ocorr.push(secTextoCompleto.slice(Math.max(0, mm.index - 40), mm.index + base.length + 40));
    termos.push({ termo: g.term, unidade_rotulo: g.unit, definicao_html: g.def, n_ocorrencias: (aulaNorm.match(reG) || []).length, ocorrencias_contexto: ocorr, origem: { seletor: '§ Lex details.glossary-item > summary > span.term', trecho_inicial: g.term, linha_aprox: g.n } });
  }
  return termos;
}

const tokens = (s) => s.match(/[\p{L}\p{N}]+/gu) || [];
const tagsToSpace = (h) => decode(h.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

function gerar(cfg) {
  const { blocos, marcador, h2, instBloco, tipoCount } = walkSection(cfg);
  if (!instBloco) fail('aula sem instrumento');
  const inst = extractInstrument(cfg, instBloco);

  // pergunta § MAP
  const mapaRow = line(cfg.mapLine).trim();
  const mapaCells = [...mapaRow.matchAll(/<td>(.*?)<\/td>/g)].map((m) => m[1]);
  if (strip(mapaCells[0]) !== String(cfg.n).padStart(2, '0')) fail('§ MAP linha errada para A0' + cfg.n);

  // figuras / listas / imagens: medido
  const secLinhas = L.slice(cfg.open - 1, cfg.close);
  const secHtml = secLinhas.join('\n');
  const medidas = {
    ul_ol: (secHtml.match(/<(ul|ol)\b/g) || []).length, img: (secHtml.match(/<img\b/g) || []).length, svg: (secHtml.match(/<svg\b/g) || []).length,
    video: (secHtml.match(/<(video|iframe)\b/g) || []).length, canvas: (secHtml.match(/<canvas\b/g) || []).length, entidades: (secHtml.match(/&[#\w]+;/g) || []).length,
    vale_lembrar: (secHtml.match(/Vale lembrar/gi) || []).length,
  };

  // invocações e remissões
  const bloco1h = (n) => blocos.find((b) => b.origem.linha_aprox <= n && (b.origem.linha_fim_aprox ?? b.origem.linha_aprox) >= n);
  const invocacoes = [];
  for (const b of blocos) {
    if (b.tipo !== 'paragrafo') continue;
    if (/Pratique abaixo|calculadora abaixo|abaixo:/i.test(b.texto) && b.origem.linha_aprox < inst.ini && inst.ini - b.origem.linha_aprox <= 3) {
      const mt = b.texto.match(/Pratique abaixo\.|Use a calculadora abaixo:/);
      if (mt) invocacoes.push({ id: `${cfg.id}-inv-${String(invocacoes.length + 1).padStart(2, '0')}`, alvo: cfg.instId, tipo: 'invocacao_direta', texto: mt[0], bloco: b.id, origem: { seletor: 'p que antecede o instrumento', trecho_inicial: mt[0], linha_aprox: b.origem.linha_aprox }, posicao_instrumento: `imediatamente depois deste parágrafo (linhas ${inst.comentario}–${inst.fim})` });
    }
  }
  for (const i of invocacoes) if (!raw.includes(i.texto)) fail('invocação não verbatim: ' + i.texto);
  const remissoes = [];
  for (const b of blocos) {
    const textos = b.tipo === 'destaque' ? b.paragrafos.map((p) => ({ t: p.texto, n: p.origem.linha_aprox })) : b.tipo === 'tres_niveis' ? b.paineis.map((p) => ({ t: p.texto, n: p.origem.linha_aprox })) : b.texto ? [{ t: b.texto, n: b.origem.linha_aprox }] : [];
    for (const { t, n } of textos) for (const m of t.matchAll(/[^.]*\bAula \d{2}\b[^.]*\./g)) remissoes.push({ texto: m[0].trim(), aula_citada: m[0].match(/Aula (\d{2})/)[1], bloco: b.id, origem: { seletor: 'prosa da aula', trecho_inicial: m[0].trim(), linha_aprox: n } });
  }

  // exercício
  const exLines = [];
  for (let n = 2380; n <= 2470; n++) if (line(n).includes(`class="exercise-tag">${cfg.exTag}<`)) exLines.push(n);
  if (exLines.length !== 1) fail('tag de exercício não achada: ' + cfg.exTag);
  const exOpen = exLines[0] - 1; assertLine(exOpen, '<div class="exercise">');
  const exEnd = blockEnd(exOpen);
  const exTag = line(exOpen + 1).match(/<span class="exercise-tag">(.*?)<\/span>/)[1];
  const exQ = line(exOpen + 2).match(/<div class="exercise-question">(.*)<\/div>/)[1];
  const exBtn = line(exOpen + 3).match(/<button class="exercise-toggle" onclick="toggleAns\(this\)">(.*)<\/button>/)[1];
  assertLine(exOpen + 4, '<div class="exercise-answer">');
  const exA = line(exOpen + 5).match(/^\s*<p>(.*)<\/p>$/)[1];
  if (line(exOpen + 6).trim() !== '</div>' || exOpen + 7 !== exEnd) fail('estrutura do exercício diferente do esperado em ' + exOpen);
  const drillIntro = line(2389).match(/<p>(.*)<\/p>/)[1];
  const exercicios = [{
    id: cfg.exId, tipo: 'discursiva_com_gabarito', tag_fonte: exTag,
    vinculo_declarado: { aula: cfg.id, como: `span.exercise-tag "${exTag}" (tag de posse, §4 do protocolo)` },
    enunciado_html: exQ, enunciado_texto: strip(exQ),
    rotulo_botao_gabarito: exBtn,
    resposta_referencia_html: exA, resposta_referencia_texto: strip(exA),
    calculos_em_destaque: [...exA.matchAll(/<span class="calc">(.*?)<\/span>/g)].map((m) => strip(m[1])),
    criterio: null,
    criterio_nota: 'Sem critério por exercício na fonte. O único critério declarado é de nível do § Drill (todos os exercícios), citado em criterio_modulo_drill.',
    criterio_modulo_drill: { texto: drillIntro, origem: { seletor: '§ Drill > p', trecho_inicial: trecho(drillIntro), linha_aprox: 2389 } },
    mecanica_fonte: 'button.exercise-toggle "Revelar gabarito" (onclick toggleAns, L2984–2993) alterna a visibilidade da resposta; a resposta está no DOM desde a carga. Sem tentativa registrada antes da referência.',
    vinculos: { aula: cfg.id, instrumento: null, instrumento_nota: 'Não declarado pela fonte.', termo: null },
    origem: { seletor: `§ Drill > div.exercise:nth-of-type(${cfg.n})`, trecho_inicial: `${exTag} ${trecho(exQ)}`.slice(0, 80), linha_aprox: exOpen, linha_fim_aprox: exEnd },
    linha_fim_aprox: exEnd,
  }];

  // relacionados não vinculados
  const quizStart = L.findIndex((s) => s.includes('const questions = ['));
  const relacionados = cfg.relacionados.map((r) => {
    if (r.tipo === 'quiz') {
      const qn = L.findIndex((s, k) => k > quizStart && s.includes(r.needle)) + 1;
      if (qn <= 0) fail('quiz não achado: ' + r.needle);
      const q = line(qn).match(/q: "(.*)",$/)[1];
      const opts = JSON.parse('[' + line(qn + 1).match(/options: \[(.*)\],$/)[1] + ']');
      const correct = Number(line(qn + 2).match(/correct: (\d+),/)[1]);
      const fb = line(qn + 3).match(/feedback: "(.*)"$/)[1];
      return { id: r.id, tipo: 'questao_quiz_multipla_escolha', vinculo_declarado: null, vinculo_nota: 'Sem tag de aula no array `questions` do script. Tema coincide; posse NÃO declarada (pertence à avaliação do módulo). Listado só para rastreio.', enunciado: q, opcoes: opts, indice_correto: correct, opcao_correta: opts[correct], feedback: fb, origem: { seletor: 'script: const questions = [...]', trecho_inicial: q.slice(0, 60), linha_aprox: qn } };
    }
    const cn = L.findIndex((s) => s.includes('class="checklist-item"') && s.includes(r.needle)) + 1;
    if (cn <= 0) fail('checklist não achado: ' + r.needle);
    const tx = line(cn).match(/<div class="text">(.*?)<\/div>/)[1];
    return { id: r.id, tipo: 'item_checklist_final', vinculo_declarado: null, vinculo_nota: 'Checklist do § Final sem tag de aula; correspondência apenas temática.', texto: tx, origem: { seletor: '§ Final div.checklist-item > div.text', trecho_inicial: tx.slice(0, 60), linha_aprox: cn } };
  });

  // menções externas à aula (varredura do arquivo inteiro)
  const reAula = new RegExp(`\\bAula 0?${cfg.n}(?!\\d)`, 'g');
  const mencoes = [];
  for (let n = 1; n <= L.length; n++) {
    if (n >= cfg.open && n <= cfg.close) continue;
    const txt = L[n - 1].replace(/<[^>]+>/g, '');
    if (reAula.test(txt)) mencoes.push({ linha: n, trecho: strip(L[n - 1]).slice(0, 110) });
    reAula.lastIndex = 0;
  }

  // léxico
  const secTextoCompleto = tagsToSpace(L.slice(cfg.open + 1, cfg.close - 1).join('\n'));
  const termos = termosLexico(cfg, secTextoCompleto);
  // leitura da frase real de cada ocorrência (§2 do protocolo): feita por nós sobre ocorrencias_contexto
  const LEIT = {
    1: {
      Energia: 'conceito central: título 1.1, definição no primeiro parágrafo, fórmula 1.4.',
      'Potência': 'conceito central: título 1.2 e fórmula 1.4. Na marcação "Energia × Potência" e em "Potência é a taxa" o termo é o assunto.',
      kW: 'unidade central: tabela 1.3, fórmula e instrumento.',
      kWh: 'unidade central: tabela 1.3, fórmula e instrumento.',
      'Watt (W)': 'uma ocorrência, na linha "W — watt — unidade base de potência" da tabela 1.3: uso real do verbete, sem subseção própria.',
      Demanda: 'menção do conceito no painel 3 e no callout final ("separar cobrança por demanda de cobrança por consumo"); a A01 não o define.',
      'Grupo A': 'menção no painel 3 ("Em consumidores do Grupo A"); a A01 não o define.',
      'Tensão': 'célula "Tensão (V)" da tabela 1.2 (analogia hidráulica): uso real do conceito, sem definição.',
      TUSD: 'sigla em "TUSD-demanda" e "TUSD-energia" no painel 3: menção, sem definição.',
    },
    2: {
      'Volt (V)': 'conceito central: título 2.1 e primeiro parágrafo. O nome-base "Volt" também casa o título "Volt — a pressão do circuito".',
      'Ampere (A)': 'conceito central: título 2.2 e primeiro parágrafo.',
      'Watt (W)': 'conceito central: título 2.3 e primeiro parágrafo.',
      kW: 'unidade da cadeia (desc da 2.3), da tabela 2.5, da nota do instrumento e do lead; sem subseção própria.',
      kWh: 'unidade da cadeia (desc da 2.3), da nota do instrumento e do lead; sem subseção própria na A02.',
      kVA: 'conceito central: título 2.5, tabela 2.5 e fechamento.',
      kVAr: 'conceito central: título 2.5, tabela 2.5 e fechamento.',
      'Lei de Ohm': 'conceito central: título 2.4, título do instrumento.',
      'Potência': 'conceito central: título 2.3 ("a potência ativa"), tabela 2.5 e fechamento.',
      'Tensão': 'conceito central: título 2.1 e 2.4, tabela 2.1 (cabeçalho "Tensão").',
      'Corrente alternada (AC)': 'menção em 2.3 ("como aproximação inicial em corrente alternada") e em 2.5 ("Em corrente alternada (que é o padrão da rede pública)"); a A02 não define o verbete.',
      'Corrente contínua (DC)': 'menção em 2.3 ("Em corrente contínua"); a A02 não define o verbete.',
      'Fator de potência (FP)': 'menção em 2.5, que remete à Aula 07 ("onde toda a lógica do fator de potência fica explícita").',
      'Grupo A': 'FALSO POSITIVO: o texto é "(Grupo A4)" na tabela 2.1 (subgrupo A4); o casamento por palavra pega "Grupo A" antes do dígito. Não é o verbete Grupo A.',
      'Perdas técnicas': 'menção prospectiva em 2.4 ("onde nascem as perdas técnicas do sistema elétrico", remetendo à Aula 04); a A02 não define o verbete.',
    },
  }[cfg.n];
  for (const t of termos) t.leitura_nota = LEIT[t.termo] ?? 'sem leitura registrada (verificar)';

  const INV = { 1: ['Energia', 'Potência', 'kW', 'kWh', 'Watt (W)', 'Eficiência'], 2: ['Volt (V)', 'Ampere (A)', 'Watt (W)', 'kW', 'kWh', 'kVA', 'kVAr', 'Lei de Ohm', 'Potência', 'Tensão'] }[cfg.n];
  const candNomes = termos.map((x) => x.termo);
  const comparacaoInventario = { fonte_da_lista: 'docs/alexandria-v2/m01/aulas.md, seção 5 de cada aula (derivação nossa, não do HTML)', inventario: INV, inventario_sem_correspondencia_textual: INV.filter((x) => !candNomes.includes(x)), candidatos_fora_do_inventario: candNomes.filter((x) => !INV.includes(x)) };

  // execução do script
  const exec =cfg.n === 1 ? execInst01(inst) : execInst02(inst);

  // cobertura por token (§5) — denominador sem o instrumento
  const semInst = L.slice(cfg.open + 1, instBloco.comentario - 1).concat(L.slice(instBloco.fim, cfg.close - 2)).join('\n');
  const srcTokSeq = tokens(tagsToSpace(semInst));
  const extrair = [marcador.num, marcador.nome, h2.texto];
  for (const b of blocos) {
    if (b.tipo === 'instrumento') continue;
    if (b.tipo === 'lead' || b.tipo === 'paragrafo') extrair.push(b.texto);
    else if (b.tipo === 'titulo') extrair.push(b.numero, b.texto);
    else if (b.tipo === 'formula') extrair.push(b.eq_texto, ...(b.desc_texto ? [b.desc_texto] : []));
    else if (b.tipo === 'tabela') { extrair.push(...b.cabecalho.map((c) => c.texto)); for (const r of b.linhas) extrair.push(...r.celulas.map((c) => c.texto)); }
    else if (b.tipo === 'destaque') extrair.push(b.rotulo, ...b.paragrafos.map((p) => p.texto));
    else if (b.tipo === 'tres_niveis') extrair.push(...b.abas.map((a) => a.rotulo), ...b.paineis.map((p) => p.texto));
  }
  const extTokSeq = tokens(extrair.join(' '));
  const bag = new Map(); for (const t of extTokSeq) bag.set(t, (bag.get(t) || 0) + 1);
  let hit = 0; const faltando = [];
  for (const t of srcTokSeq) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else faltando.push(t); }
  const sequenciaIgual = srcTokSeq.length === extTokSeq.length && srcTokSeq.every((t, k) => t === extTokSeq[k]);
  const cobertura = { tokens_fonte_sem_instrumento: srcTokSeq.length, tokens_extraidos: extTokSeq.length, tokens_casados: hit, pct: +(100 * hit / srcTokSeq.length).toFixed(1), tokens_nao_casados: faltando, sequencia_identica_em_ordem: sequenciaIgual };

  // cobertura do instrumento
  const instSrcTok = tokens(tagsToSpace(L.slice(inst.ini - 1, inst.fim).join('\n')));
  const instExt = [inst.instTitle, inst.instId, ...(inst.instrucao ? [inst.instrucao.texto] : [])];
  for (const e of inst.entradas) instExt.push(e.rotulo, e.unidade);
  instExt.push(inst.saida.rotulo, inst.saida.valor_inicial_marcacao, ...(inst.saida.unidade ? [inst.saida.unidade] : []), strip(inst.noteHtml));
  const instExtTok = tokens(instExt.join(' '));
  const instCobertura = { tokens_fonte: instSrcTok.length, tokens_extraidos: instExtTok.length, sequencia_identica_em_ordem: instSrcTok.length === instExtTok.length && instSrcTok.every((t, k) => t === instExtTok[k]) };

  // comparação com código
  const cmp = compara(cfg, blocos);

  return { cfg, blocos, marcador, h2, instBloco, tipoCount, inst, mapaCells, medidas, invocacoes, remissoes, exercicios, relacionados, mencoes, termos, comparacaoInventario, exec, cobertura, instCobertura, cmp, secTextoCompleto };
}

// ---------------------------------------------------------------------------
// Divergências da fonte (leituras preservadas, sem escolha) e do código
// ---------------------------------------------------------------------------
const rowOf = (needle, from = 1356, to = 1581) => { for (let n = from; n <= to; n++) if (line(n).includes(needle)) return n; return fail('não achei: ' + needle); };
const leitura = (n, seletor, html) => ({ texto: html.includes('</td>') ? [...html.matchAll(/<td[^>]*>(.*?)<\/td>/g)].map((m) => strip(m[1])).join(' | ') : strip(html), origem: { seletor, trecho_inicial: trecho(html), linha_aprox: n } });
const matchLn = (n, re) => line(n).match(re)[1];

function divergenciasFonte(R) {
  if (R.cfg.n === 1) {
    const nVazao = rowOf('Vazão da torneira'); const nCano = rowOf('Diâmetro do cano');
    const nCorr = rowOf('corrente é vazão', 1500, 1530);
    const nLexAmp = gloss.find((g) => g.term.startsWith('Ampere')).n + 1;
    const nDesc = rowOf('kWh = kW × horas');
    const nLexKwh = gloss.find((g) => g.term === 'kWh').n + 1;
    return [
      {
        id: 'DIV-01', tipo: 'analogia_hidraulica_contraditoria_entre_aulas',
        o_que: 'A analogia hidráulica atribui papéis diferentes a "vazão" e "corrente" na A01 e na A02.',
        leituras: [
          { rotulo: 'A01, tabela 1.2', ...leitura(nVazao, 'tabela 1.2 > tr', line(nVazao).match(/<tr>(.*)<\/tr>/)[1]) },
          { rotulo: 'A01, tabela 1.2', ...leitura(nCano, 'tabela 1.2 > tr', line(nCano).match(/<tr>(.*)<\/tr>/)[1]) },
          { rotulo: 'A02, 2.2', ...leitura(nCorr, 'h3(2.2) ~ p', matchLn(nCorr, /<p>(.*)<\/p>/)) },
          { rotulo: '§ Lex, Ampere (A)', ...leitura(nLexAmp, '§ Lex Ampere (A) > div.glossary-content', matchLn(nLexAmp, /<div class="glossary-content">(.*)<\/div>/)) },
        ],
        argumento: 'Na tabela 1.2 a vazão (L/s) corresponde à potência e o diâmetro do cano à corrente; na 2.2 e no verbete, a corrente é a vazão. Já registrada como R5 em docs/alexandria-v2/m01/aulas.md.',
        decisao: 'não escolhida — preservar as duas leituras; é Content QA antes de desenhar a analogia.',
      },
      {
        id: 'DIV-02', tipo: 'grafia_da_formula_energia',
        o_que: 'A fórmula de energia aparece com "horas" por extenso na aula e com "h" no título do instrumento e no léxico.',
        leituras: [
          { rotulo: 'div.formula.desc (1.4)', ...leitura(nDesc, 'h3(1.4) ~ div.formula > div.desc', matchLn(nDesc, /<div class="desc">(.*)<\/div>/)) },
          { rotulo: 'título do INST·01', ...leitura(rowOf('instrument-title'), 'div.instrument-title', matchLn(rowOf('instrument-title'), /<div class="instrument-title">(.*)<\/div>/)) },
          { rotulo: '§ Lex, kWh', ...leitura(nLexKwh, '§ Lex kWh > div.glossary-content', matchLn(nLexKwh, /<div class="glossary-content">(.*)<\/div>/)) },
        ],
        argumento: 'Mesma relação; só a grafia da unidade de tempo difere ("horas" × "h").',
        decisao: 'não escolhida — informativa.',
      },
    ];
  }
  const nLead = rowOf('class="lead"', 1484, 1495);
  const nMap = 1340;
  const nChain = rowOf('Cadeia: V × A', 1500, 1530);
  const nNote = rowOf('Essa cadeia', 1550, 1565);
  const nCorr = rowOf('corrente é vazão', 1500, 1530);
  return [
    {
      id: 'DIV-01', tipo: 'contagem_de_unidades_lead_x_mapa_x_corpo',
      o_que: 'A lista de unidades do lead, a do § MAP e as unidades que os títulos 2.1–2.5 nomeiam não coincidem.',
      leituras: [
        { rotulo: 'marcador da aula', texto: strip(R.marcador.nome), origem: { seletor: 'div.aula-marker', trecho_inicial: R.marcador.nome, linha_aprox: R.marcador.origem.linha_aprox } },
        { rotulo: 'lead (7 símbolos)', ...leitura(nLead, 'p.lead', matchLn(nLead, /<p class="lead">(.*)<\/p>/)) },
        { rotulo: '§ MAP (5 unidades)', ...leitura(nMap, '§ MAP > tr(02) > td:nth-child(3)', R.mapaCells[2]) },
        { rotulo: 'títulos 2.1, 2.2, 2.3, 2.4, 2.5', texto: R.blocos.filter((b) => b.tipo === 'titulo').map((b) => b.texto).join(' | '), origem: { seletor: 'h3 da aula', trecho_inicial: R.blocos.find((b) => b.tipo === 'titulo').texto, linha_aprox: R.blocos.find((b) => b.tipo === 'titulo').origem.linha_aprox } },
      ],
      argumento: 'O lead lista V, A, W, kW, kWh, kVA, kVAr. O § MAP lista volt, ampere, watt, kVA e kVAr. Os títulos nomeiam Volt, Ampere, Watt, Lei de Ohm e kVA/kVAr: a Lei de Ohm introduz o ohm (Ω), que não está na lista de sete, e kW e kWh não têm subseção própria na A02 (kW aparece na tabela 2.5 e kWh na cadeia da fórmula 2.3).',
      decisao: 'não escolhida — preservar as três contagens.',
    },
    {
      id: 'DIV-02', tipo: 'fim_da_cadeia_custo_x_R$',
      o_que: 'A cadeia de conversão termina em "custo" na fórmula 2.3 e em "R$" na nota do INST·02.',
      leituras: [
        { rotulo: 'div.formula.desc (2.3)', ...leitura(nChain, 'h3(2.3) ~ div.formula > div.desc', matchLn(nChain, /<div class="desc">(.*)<\/div>/)) },
        { rotulo: 'div.instrument-note (INST·02)', ...leitura(nNote, 'div.instrument-note', matchLn(nNote, /(Em <b>.*)$/)) },
      ],
      argumento: 'Mesma sequência V × A → W → kW → kWh × tarifa; o último termo é "custo" numa e "R$" na outra.',
      decisao: 'não escolhida — informativa.',
    },
    {
      id: 'DIV-03', tipo: 'analogia_hidraulica_contraditoria_entre_aulas',
      o_que: 'Na A02 a corrente é a vazão; a tabela 1.2 da A01 dá à vazão o papel da potência.',
      leituras: [
        { rotulo: 'A02, 2.2', ...leitura(nCorr, 'h3(2.2) ~ p', matchLn(nCorr, /<p>(.*)<\/p>/)) },
        { rotulo: 'A01, tabela 1.2', ...leitura(rowOf('Vazão da torneira', 1356, 1400), 'tabela 1.2 > tr', line(rowOf('Vazão da torneira', 1356, 1400)).match(/<tr>(.*)<\/tr>/)[1]) },
      ],
      argumento: 'Mesma contradição registrada como DIV-01 em aula-01.md; repetida aqui porque a A02 é o lado que diz "corrente é vazão".',
      decisao: 'não escolhida — ver aula-01.md DIV-01.',
    },
  ];
}

function residuosDoScript(R) {
  if (R.cfg.n === 1) {
    return [
      'O cálculo é `(parseFloat(kw.value) || 0) * (parseFloat(h.value) || 0)`: campo vazio ou não numérico vale 0 e a saída é "0".',
      'A saída é `toLocaleString(\'pt-BR\', { maximumFractionDigits: 2 })`: no máximo 2 casas, sem mínimo (50 → "50"; 0,333 → "0,33").',
      'O `calc()` roda uma vez no carregamento (linha `calc();` antes do `})();`) e a cada evento `input` dos dois campos.',
      'Não há max nem validação de negativo: o atributo min="0" é só do navegador, e o script aceita um valor negativo digitado.',
    ];
  }
  return [
    'O script NÃO chama calc() no carregamento: o texto "Aguardando 2 valores..." vem da marcação, e não de um primeiro cálculo.',
    '`filled` conta só valores > 0, mas os ramos testam `!isNaN(...)`. Com V = 0 digitado, `filled` não conta o V, mas o ramo "V ausente" também não dispara (V = 0 não é NaN): cai na checagem de coerência (divisão por zero → "Inconsistente — limpe um campo").',
    'Os handlers de V e de I chamam `calc()` sem argumento; o de R chama `calc(\'R\')`. Por isso, editar R com V e I preenchidos recalcula e SOBRESCREVE R (R = V ÷ I), em vez de checar coerência. O ramo `changed === \'V\'` nunca é alcançado (ninguém chama calc(\'V\')).',
    'Esvaziar V ou I zera o campo R e volta o status para "Aguardando 2 valores...". Esvaziar R com V e I preenchidos não esvazia nada: o handler de R chama calc(\'R\'), que reescreve R = V ÷ I (o campo volta a 22.000 no cenário).',
    'O campo calculado vira valor do input: o campo "calculado" deixa de estar vazio, e uma edição posterior de V ou I cai na checagem de coerência contra o valor antigo (cenário "V = 110").',
    'Formatos: V e I com `toFixed(2)`, R com `toFixed(3)`, coerência com `toFixed(0)`; tolerância de coerência 1% (`diff < 0.01`).',
  ];
}

function codRows(R) {
  const c = R.cmp; const r = [];
  const push = (id, gravidade, onde, o_que, fonte) => r.push({ id, gravidade, onde, o_que, fonte });
  const tabTot = c.tabelas.reduce((a, t) => a + t.celulas, 0);
  const tabCls = c.tabelas.reduce((a, t) => a + t.so_difere_por_atributo_class, 0);
  const tabDiv = c.tabelas.reduce((a, t) => a + t.divergentes, 0);
  const instAula = R.cfg.codeInst;
  if (R.cfg.n === 1) {
    const er = c.destaques.find((d) => d.tom_fonte === 'red'); const neu = c.destaques.filter((d) => d.tom_fonte === 'neutro');
    const tn = c.tres_niveis[0]; const f = c.formulas[0]; const p14 = c.paragrafos_texto_igual_marcacao_diferente[0];
    push('COD-01', 'alta', `MODULO_01_CORPO["${R.cfg.codeKey}"] callout "Erro de fluência"`, `Callout vermelho com ${er.paragrafos_fonte} parágrafos na fonte; o código tem ${er.paragrafos_no_codigo}. Faltam 2 parágrafos ("A empresa consumiu 500 kW no mês." e "Esse deslize, em conversa com diretor de energia…"). O rótulo virou ${er.rotulo_no_codigo_como} (o tom "red" foi preservado; o texto do rótulo ocupa o corpo da nota). Os parágrafos 2 e 3, os ausentes, levam style="margin-top: 12px;" na fonte.`, 'linhas 1452–1457');
    push('COD-02', 'alta', `MODULO_01_CORPO["${R.cfg.codeKey}"] seção 1.6`, `O h3 1.6 "O conceito em três níveis" foi portado, mas o componente three-levels inteiro não: ${tn.paineis_no_codigo} de ${tn.paineis_fonte} painéis e ${tn.abas_no_codigo} de ${tn.abas_fonte} rótulos de aba ("01 · 12 anos", "02 · Executivo não técnico", "03 · Especialista de setor") estão no código. A seção 1.6 fica sem conteúdo e é seguida direto pelo callout "Onde isso entra no produto".`, 'linhas 1459–1472');
    push('COD-03', 'média', `MODULO_01_CORPO["${R.cfg.codeKey}"] fórmula 1.4`, `desc = ${JSON.stringify(f.desc_codigo)} no código; a fonte tem div.desc "${f.desc_fonte}". O eq é igual ("${f.eq_texto}").`, 'linhas 1416–1419');
    push('COD-04', 'média', `MODULO_01_CORPO["${R.cfg.codeKey}"] parágrafo 1.4 (L190 do .ts)`, `Parágrafo não verbatim: os ${p14.span_hl_na_fonte} <span class="hl"> foram removidos e os ${p14.span_fechamento_orfao_no_codigo} </span> de fechamento ficaram (HTML malformado: "Um motor de 10 kW</span> ligado por 5 horas</span> consome 50 kWh</span>…"). Texto sem tags igual ao da fonte.`, 'linha 1421');
    push('COD-05', 'média', `MODULO_01_CORPO["${R.cfg.codeKey}"] callouts neutros`, `${neu.length} callouts neutros ("${neu.map((d) => d.rotulo).join('", "')}") portados como nota { tom: "neutro", label: null, html: <rótulo> } seguida de parágrafo solto: o rótulo ocupa o corpo e o corpo vira parágrafo comum, e a hierarquia rótulo → corpo se perde. Os parágrafos em si são verbatim (${neu.reduce((a, d) => a + d.paragrafos_no_codigo, 0)} de ${neu.reduce((a, d) => a + d.paragrafos_fonte, 0)}).`, 'linhas 1370–1373 e 1474–1477');
    push('COD-06', 'alta', 'AulaViewer.tsx + MODULO_01_AULAS aula-01-01', `O instrumento não tem posição no fluxo: está em aula.instruments e AulaViewer.tsx (L125) o renderiza depois da apostila inteira e antes dos exercícios. Na fonte ele fica entre o parágrafo 1.4, que termina em "Pratique abaixo.", e o h3 1.5. O "abaixo" do texto passa a apontar para a seção 1.5 e os blocos seguintes. Viola bar C5 e a Regra-mãe 1.`, `linhas ${R.instBloco.comentario}–${R.inst.fim}`);
    push('COD-07', 'média', 'INSTRUMENTOS_MODULO_01 inst-01 .formula', `formula = "kWh = kW × h" é o sufixo do título "Calculadora · kWh = kW × h"; o instrumento não declara fórmula própria. O texto literal na prosa é o div.desc da 1.4, "kWh = kW × horas" (fora do instrumento). Ver DIV-02.`, 'linhas 1418, 1426');
    push('COD-08', 'baixa', `MODULO_01_CORPO["${R.cfg.codeKey}"] tabelas`, `As 2 tabelas (1.2 e 1.3) têm ${tabTot} células de dados no total; ${tabTot - tabCls - tabDiv} são verbatim, ${tabCls} só diferem por atributo class (a tabela 1.3 usa <b class="mono"> e o código grava <b>) e ${tabDiv} divergem de outra forma. Os cabeçalhos são verbatim.`, 'linhas 1380–1392 e 1397–1412');
    push('COD-09', 'baixa', 'MODULO_01_AULAS aula-01-01 activities[0].points', '`points: 1` não tem origem na fonte (o § Drill não pontua exercícios). O enunciado, o gabarito e a tag do Ex·01 são verbatim.', 'linhas 2391–2398');
    push('COD-10', 'baixa', 'alexandria-instrument-calculators.ts n()', 'n() usa Number(v) e o original usa parseFloat(v) || 0. Diferem em strings com sufixo não numérico ("12abc": parseFloat → 12, Number → 0). Com input[type=number] a diferença é praticamente inalcançável; registrada por fidelidade (§10).', 'linha 2745 (script)');
    push('COD-11', 'informativa', 'ids', 'Código usa "inst-01", "ex-01", "aula-01-01"; esta extração usa "m01-inst-01", "m01-ex-01", "m01-a01". Mapeamento 1:1.', null);
  } else {
    const neu = c.formulas; const p = c.paragrafos_texto_igual_marcacao_diferente;
    const lost = c.formulas.filter((f) => f.desc_fonte && f.desc_codigo === null);
    push('COD-01', 'alta', `MODULO_01_CORPO["${R.cfg.codeKey}"] fórmulas 2.3 e 2.4`, `As ${c.formulas.length} fórmulas têm div.desc na fonte e desc = null no código (${lost.length} descrições perdidas): ${lost.map((f) => `"${f.eq_texto}" → "${f.desc_fonte}"`).join('; ')}. A desc da 2.3 é a única ocorrência literal da cadeia V × A → W → kW → kWh × tarifa = custo na apostila (a outra está na nota do INST·02, com "R$"). O eq das duas fórmulas é igual ao da fonte.`, 'linhas 1517–1520 e 1525–1528');
    push('COD-02', 'alta', 'INSTRUMENTOS_MODULO_01 inst-02', 'A instrução do instrumento, "Preencha dois campos. O terceiro é calculado." (p dentro de div.instrument-body), não existe no código: o tipo Instrument não tem campo para ela e a nota é só o texto de div.instrument-note. É a única frase da prancha que diz o que fazer.', `linha ${R.inst.instrucao.origem.linha_aprox}`);
    push('COD-03', 'média', 'INSTRUMENTOS_MODULO_01 inst-02 .note', `Nota não verbatim: os ${(R.inst.noteHtml.match(/<span class="hl">/g) || []).length} <span class="hl"> (2.200 W = 2,2 kW; 11 kWh) foram removidos e os 2 </span> de fechamento ficaram ("…2.200 W = 2,2 kW</span>. Ligando por 5 horas: 11 kWh</span>."). Texto sem tags igual ao da fonte.`, `linha ${R.inst.noteLn}`);
    push('COD-04', 'média', 'INSTRUMENTOS_MODULO_01 inst-02 .fields', 'Os 3 campos nascem com defaultValue: \'\' e sem os atributos da fonte: placeholder "ex: 220", "ex: 10" e "calculado", e step="any". O tipo InstrumentField (src/lib/types/alexandria.ts:271) não tem campo `placeholder`, e `step` do tipo é number, sem "any". Mudança de tipo compartilhado: é da FOUNDRY, não foi tocada.', 'linhas 1543, 1547, 1551');
    push('COD-05', 'alta', 'AulaViewer.tsx + MODULO_01_AULAS aula-01-02', `Instrumento sem posição no fluxo (AulaViewer.tsx L125, depois da apostila inteira). Na fonte ele fica entre o parágrafo 2.4 ("Resistência é a oposição… perdas técnicas do sistema elétrico.") e o h3 2.5. A fonte não tem frase de invocação ("abaixo", "pratique"): a posição é só por adjacência. Viola bar C5 e a Regra-mãe 1.`, `linhas ${R.instBloco.comentario}–${R.inst.fim}`);
    push('COD-06', 'média', 'INSTRUMENTOS_MODULO_01 inst-02 .formula', 'formula = "V = I × R" não existe dentro do instrumento. Vem do div.formula da 2.4 e do campo de unidade do verbete "Lei de Ohm" no léxico (ambos fora do instrumento). O título é só "Calculadora · Lei de Ohm".', 'linhas 1526, 1535');
    push('COD-07', 'média', 'alexandria-instrument-calculators.ts inst-02 (L1683–1712)', 'A porta é uma função pura que ignora o argumento `changed` do original (o handler de R chama calc(\'R\'); os de V e I chamam calc()). Pela leitura, 2 casos medidos no script-fonte (cenários da camada de execução) saem diferentes: (a) R editado com V e I preenchidos — o original recalcula R = V ÷ I e mostra "R = V ÷ I = …"; a porta mostra "Coerente: …" ou "Inconsistente — limpe um campo"; (b) V = 0 digitado com I e R preenchidos — o original cai na checagem de coerência (divisão por zero → "Inconsistente"); a porta trata V = 0 como ausente e calcula V = I × R. Deduzido da leitura do .ts; o TS não foi executado nesta extração.', 'linhas 2761–2791 (script)');
    push('COD-08', 'baixa', 'alexandria-instrument-calculators.ts inst-02', 'Os handlers de V e I que esvaziam R quando o campo é esvaziado não foram portados. O próprio código já sinaliza isso (comentário nas L1676–1682). Registrado por fidelidade.', 'linhas 2789–2790');
    const tdMono = R.blocos.filter((b) => b.tipo === 'tabela').reduce((a, b) => a + b.linhas.reduce((x, r2) => x + r2.celulas.filter((ce) => ce.td_classe).length, 0), 0);
    push('COD-09', 'informativa', `MODULO_01_CORPO["${R.cfg.codeKey}"] tabelas`, `As 2 tabelas (2.1 e 2.5) têm ${tabTot} células de dados e ${tabTot - tabCls - tabDiv} são verbatim (${tabCls} só diferem por class e ${tabDiv} de outra forma); os cabeçalhos são verbatim. ${tdMono} células carregam <td class="mono"> na fonte (colunas "Tensão" da 2.1 e "Unidade" da 2.5); o tipo de tabela do código guarda a célula como string de conteúdo, então a classe de apresentação não é representável. Conteúdo sem perda.`, 'linhas 1496–1509 e 1567–1576');
    push('COD-10', 'baixa', 'MODULO_01_AULAS aula-01-02 activities[0].points', '`points: 1` não tem origem na fonte. O enunciado, o gabarito e a tag do Ex·02 são verbatim.', 'linhas 2400–2407');
    push('COD-11', 'baixa', 'MODULO_01_AULAS aula-01-02 illustrations', '`illustrations: [\'fis-04-triangulo-potencia.png\']` mapeia uma gravura que a fonte não tem: o HTML não tem nenhum <img> na A02. O vínculo é decisão editorial do código (o triângulo é o assunto do parágrafo final, 2.5), não declarado pela fonte.', 'linhas 1578');
    push('COD-12', 'informativa', 'ids', 'Código usa "inst-02", "ex-02", "aula-01-02"; esta extração usa "m01-inst-02", "m01-ex-02", "m01-a02". Mapeamento 1:1.', null);
  }
  return r;
}

// ---------------------------------------------------------------------------
// Montagem do JSON e do .md
// ---------------------------------------------------------------------------
function montar(R) {
  const { cfg, blocos, marcador, h2, inst, mapaCells } = R;
  const instrumento = {
    id: cfg.instId, id_fonte: inst.instId, kind_taxonomia: 'calculadora',
    kind_nota: cfg.n === 1 ? 'Taxonomia: "Calculadora · kWh = kW × h" é `calculadora` (2 campos numéricos → 1 saída numérica). Confirmado pela marcação: 2 input[type=number], 1 saída numérica, sem texto de leitura dinâmico.' : 'Taxonomia: a fonte chama de "Calculadora", mas a mecânica é de resolvedor: 3 campos, o usuário preenche dois e o script calcula o terceiro; a saída é texto de status, não número. Confirmado pela marcação e pelo script; o kind final é decisão da FOUNDRY.',
    titulo: inst.instTitle,
    pergunta: null,
    pergunta_nota: cfg.n === 1 ? 'A prancha não tem pergunta própria. O convite da div.instrument-note ("Experimente comparar dois cenários: 50 kW × 1 h e 1 kW × 50 h.") é a coisa mais próxima, e a fonte não o chama de pergunta. A pergunta do § MAP (L1339) está fora do instrumento. Qualquer pergunta de previsão seria DERIVADA (P3/P11), não extraída.' : 'A prancha não tem pergunta própria. A instrução "Preencha dois campos. O terceiro é calculado." (campo `instrucao`) diz o que fazer, e a fonte não a formula como pergunta. A pergunta do § MAP (L1340) está fora do instrumento. Qualquer pergunta de previsão seria DERIVADA (P3/P11).',
    instrucao: inst.instrucao,
    instrucao_nota: inst.instrucao ? undefined : 'Sem p de instrução dentro de div.instrument-body.',
    vinculos: { aula: cfg.id, exercicio_relacionado: null, termo: null },
    vinculos_nota: 'O vínculo aula↔instrumento é por posição (div.instrument está dentro da section da aula). O vínculo com termos do léxico e com o exercício não é declarado pela fonte.',
    entradas: inst.entradas,
    saidas: [{
      ...inst.saida,
      formula_exata_script: cfg.n === 1
        ? inst.script.linhas.filter((x) => /parseFloat\(kw\.value\)/.test(x.texto)).map((x) => x.texto.trim())
        : inst.script.linhas.filter((x) => /status\.textContent|\.value = \(/.test(x.texto)).map((x) => x.texto.trim()),
      formula_exibida_na_aula: cfg.n === 1 ? blocos.find((b) => b.tipo === 'formula').eq_texto : blocos.filter((b) => b.tipo === 'formula').map((b) => b.eq_texto),
      formula_exibida_na_aula_nota: 'Está na prosa, FORA do div.instrument.',
    }],
    texto_nota_estatica: { id: null, html: inst.noteHtml, texto: strip(inst.noteHtml), marcacao_inline: inlines(inst.noteHtml), origem: { seletor: 'div.instrument-note', trecho_inicial: trecho(inst.noteHtml), linha_aprox: inst.noteLn }, nota: 'Nota estática: nenhum script escreve nela (diferente do INST·06, cujo texto de leitura é sobrescrito por calc()).' },
    script: { origem: { seletor: `script: bloco "${cfg.scriptAnchor}"`, trecho_inicial: line(inst.script.ini + 1).trim().replace(/^\*\s*/, ''), linha_aprox: inst.script.ini, linha_fim_aprox: inst.script.fim }, linhas: inst.script.linhas, nota: 'Linhas verbatim, uma por item, do comentário de abertura até `})();`.' },
    execucao_do_script_fonte: {
      metodo: 'O código das linhas do script foi executado com `new Function` sobre um `document` simulado (getElementById devolve objetos com value/textContent/addEventListener). Os estados abaixo são saída real do script, não leitura.',
      resultados: R.exec,
    },
    residuos_do_script: residuosDoScript(R),
    residuos_do_script_nota: 'Resíduos do original, sinalizados e não corrigidos (§10).',
    fonte_dos_numeros: null,
    fonte_dos_numeros_nota: cfg.n === 1 ? 'A fonte não cita procedência para os valores-padrão (10 kW, 5 h) nem para os cenários da nota (50 kW × 1 h, 1 kW × 50 h).' : 'A fonte não cita procedência para os exemplos da nota (220 V × 10 A, 5 h) nem para os placeholders (ex: 220, ex: 10).',
    tolerancias: cfg.n === 1 ? null : { coerencia_relativa: 0.01, descricao: 'Único limiar do script: `diff < 0.01` na checagem de coerência quando os três campos estão preenchidos.', origem: { seletor: 'script calc()', trecho_inicial: 'if (diff < 0.01) status.textContent', linha_aprox: line(2784).includes('diff < 0.01') ? 2784 : fail('linha 2784') } },
    tolerancias_nota: cfg.n === 1 ? 'Nenhuma tolerância declarada (P6). O instrumento não tem previsão, gabarito nem correção; não existe "dentro/fora".' : 'Fora a coerência de 1%, nenhuma tolerância declarada (P6); o instrumento não tem previsão, gabarito nem correção.',
    figura_prometida: null,
    figura_prometida_nota: 'O título ("Calculadora · …") não promete forma desenhada.',
    origem: origem(inst.ini, `section.aula(${cfg.markerAnchor}) div.instrument`, `${inst.instTitle} ${inst.instId}`, inst.fim),
    linha_fim_aprox: inst.fim,
  };
  // limpa undefined
  const limpa = (o) => JSON.parse(JSON.stringify(o));
  const dsrc = divergenciasFonte(R);
  const cods = codRows(R);
  const out = {
    meta: {
      grupo: `aula0${cfg.n}`, modulo: 'M01', aula: `M01·A0${cfg.n}`, fonte: SRC, fonte_somente_leitura: true,
      fonte_total_linhas: L.length,
      aula_linhas: { inicio: cfg.comentario, fim: cfg.close, nota: `comentário de abertura ${cfg.comentario}; section.aula ${cfg.open}–${cfg.close}` },
      extraido_em: new Date().toISOString().slice(0, 10),
      metodo: 'Extração programática estrita (script node sobre fatias do HTML por linha; o percorredor lança erro em qualquer linha que não reconhece; nenhuma prosa digitada). Campos `html` guardam o innerHTML literal; campos `texto` são o mesmo conteúdo com tags removidas e entidades decodificadas.',
      protocolo: 'docs/alexandria/extraction-protocol.md', taxonomia: 'docs/alexandria/instrument-taxonomy.md',
      convencoes: {
        ausencia: 'null + campo *_nota explicando o que foi medido',
        ids: `${cfg.id}-bNN-<tipo> para blocos (ordem da fonte); ${cfg.instId}; ${cfg.exId}`,
        vinculos: 'só quando a fonte declara (tag, posição dentro da section, remissão textual literal); correspondência textual é marcada como tal',
        comentario: 'Campos de prosa nossa são só `nota`, `*_nota`, `o_que`, `argumento`, `decisao`, `onde` e a lista comparacao_codigo; todo o resto é verbatim e verificado por substring contra o HTML.',
      },
    },
    aula: {
      id: cfg.id, numero: cfg.n,
      marcador,
      titulo_h2_html: h2.html, titulo_h2_texto: h2.texto, titulo_h2_origem: h2.origem,
      pergunta_mapa: { numero: strip(mapaCells[0]), tema: strip(mapaCells[1]), pergunta_html: mapaCells[2], pergunta_texto: strip(mapaCells[2]), origem: origem(cfg.mapLine, `§ MAP table > tbody > tr(0${cfg.n})`, mapaCells[2]), nota: 'Única pergunta que a fonte declara para esta aula. Vive na tabela do § MAP, não na aula.' },
      duracao_min: null, dificuldade: null, video: null,
      ausencias_nota: `Sem duração, dificuldade, vídeo, <img>, <svg>, lista (<ul>/<ol>), referência por aula ou "Vale lembrar" dentro da section. Medido na fatia ${cfg.open}–${cfg.close}: ${JSON.stringify(R.medidas)}.`,
    },
    blocos,
    figuras: [], figuras_nota: `Nenhuma figura na section: ${R.medidas.img} <img>, ${R.medidas.svg} <svg>, ${R.medidas.canvas} <canvas>. As tabelas ficam em blocos de tipo "tabela".`,
    tabelas: blocos.filter((b) => b.tipo === 'tabela').map((b) => b.id),
    destaques: blocos.filter((b) => b.tipo === 'destaque').map((b) => b.id),
    tres_niveis: blocos.filter((b) => b.tipo === 'tres_niveis').map((b) => b.id),
    listas: [], listas_nota: `Nenhuma <ul>/<ol> na section (medido: ${R.medidas.ul_ol}).`,
    vale_lembrar: null, vale_lembrar_nota: 'A expressão "Vale lembrar" não ocorre dentro da section (medido); os destaques da aula são os div.callout.',
    termos_lexico: {
      vinculo_declarado_pela_fonte: false,
      nota: 'O glossário da fonte (§ Lex) não declara aula por termo. Abaixo: verbetes cujo nome-base (sem parênteses) ocorre como palavra no texto da section (incluindo o instrumento). Correspondência textual, não posse — ler ocorrencias_contexto antes de ligar (§2 do protocolo).',
      total_verbetes_fonte: gloss.length, candidatos: R.termos, comparacao_com_inventario: R.comparacaoInventario,
    },
    instrumentos: [instrumento],
    invocacoes_no_texto: R.invocacoes,
    invocacoes_no_texto_nota: R.invocacoes.length ? undefined : 'Nenhum parágrafo da aula invoca o instrumento ("abaixo", "pratique", "use a calculadora"); a posição é só por adjacência (instrumento logo depois do parágrafo da linha anterior).',
    remissoes_a_outras_aulas: R.remissoes,
    exercicios: R.exercicios,
    relacionados_nao_vinculados: R.relacionados,
    mencoes_externas_a_esta_aula: { total: R.mencoes.length, itens: R.mencoes, nota: 'Varredura do arquivo inteiro por "Aula 0N" fora da section da aula (tags de exercício, tabela § MAP, etc.). A tag do exercício vinculado é a linha do § Drill; as demais são só rastreio.' },
    cobertura_texto_por_token: { ...R.cobertura, nota: 'Denominador = texto da section sem o div.instrument (e sem o comentário que o precede), §5; tags viram espaço para o medidor não colar spans vizinhos. A sequência de tokens extraída é comparada com a da fonte em ordem. Instrumento medido à parte em cobertura_instrumento.' },
    cobertura_instrumento: { ...R.instCobertura, nota: 'Texto visível da marcação do div.instrument (título, id, instrução, rótulos, unidades, saída, nota) contra os campos do instrumento, em ordem.' },
    divergencias: dsrc,
    comparacao_codigo: {
      arquivos: [
        `src/lib/data/alexandria-modulo-01-content.ts (MODULO_01_CORPO ${cfg.codeKey}; INSTRUMENTOS_MODULO_01 ${cfg.codeInst}; MODULO_01_AULAS ${cfg.codeKey}; MODULO_01_LEAD ${cfg.codeKey})`,
        'src/lib/data/alexandria-instrument-calculators.ts (' + cfg.codeInst + ')',
        'src/components/alexandria/viewer/AulaViewer.tsx L125 e src/lib/types/alexandria.ts L271 (lidos para entender o efeito das divergências; não são fonte)',
      ],
      verificacoes_programaticas: {
        n_blocos_codigo: R.cmp.n_blocos_codigo, n_blocos_fonte_sem_instrumento: blocos.filter((b) => b.tipo !== 'instrumento').length,
        paragrafos_verbatim: R.cmp.paragrafos_verbatim, paragrafos_texto_igual_marcacao_diferente: R.cmp.paragrafos_texto_igual_marcacao_diferente.length, paragrafos_ausentes: R.cmp.paragrafos_ausentes.length,
        titulos_ausentes: R.cmp.titulos_ausentes, formulas: R.cmp.formulas, tabelas: R.cmp.tabelas, destaques: R.cmp.destaques, tres_niveis: R.cmp.tres_niveis,
        span_fechamento_orfao_no_corpo: R.cmp.span_orfao_total,
        lead_verbatim: tsContent.includes(JSON.stringify(blocos.find((b) => b.tipo === 'lead').html).slice(1, -1)) || tsContent.includes(blocos.find((b) => b.tipo === 'lead').html),
        ex_enunciado_verbatim: tsContent.includes(R.exercicios[0].enunciado_html.replace(/"/g, '\\"')) || tsContent.includes(R.exercicios[0].enunciado_html),
        ex_gabarito_verbatim: tsContent.includes(R.exercicios[0].resposta_referencia_html.replace(/"/g, '\\"')) || tsContent.includes(R.exercicios[0].resposta_referencia_html),
        inst_titulo_verbatim: tsContent.includes(inst.instTitle),
        inst_nota_verbatim: tsContent.includes(inst.noteHtml.replace(/"/g, '\\"')) || tsContent.includes(inst.noteHtml),
      },
      conforme: cfg.n === 1
        ? ['Lead verbatim em MODULO_01_LEAD["aula-01-01"].', 'Títulos 1.1–1.6 com número e texto corretos.', 'Cabeçalhos das tabelas 1.2 e 1.3 verbatim.', 'Ex·01: tag, enunciado e gabarito verbatim; vinculado à aula pela tag.', 'INST·01: título, ids dos campos, rótulos, unidades, padrões (10 e 5), min 0, step 0,5, ausência de max, rótulo/unidade da saída e nota verbatim.', 'durationMinutes/difficulty/video = null, coerente com a fonte.']
        : ['Lead verbatim em MODULO_01_LEAD["aula-01-02"].', 'Títulos 2.1–2.5 com número e texto corretos.', 'Cabeçalhos das tabelas 2.1 e 2.5 verbatim.', 'Ex·02: tag, enunciado e gabarito verbatim; vinculado à aula pela tag.', 'INST·02: título, ids e rótulos dos 3 campos, unidades; saída "Status"; textos dos 4 estados e fórmulas toFixed (2/2/3/0) iguais às do script.', 'durationMinutes/difficulty/video = null, coerente com a fonte.'],
      divergencias: cods,
    },
  };
  const contagens = {
    blocos: blocos.length, blocos_por_tipo: R.tipoCount,
    secoes_numeradas: blocos.filter((b) => b.tipo === 'titulo').map((b) => b.numero),
    tabelas: out.tabelas.length, linhas_de_dados_por_tabela: blocos.filter((b) => b.tipo === 'tabela').map((b) => b.n_linhas_dados),
    celulas_de_tabela: blocos.filter((b) => b.tipo === 'tabela').reduce((a, b) => a + b.linhas.reduce((x, l) => x + l.celulas.length, 0), 0),
    destaques: out.destaques.length, paragrafos_de_destaque: blocos.filter((b) => b.tipo === 'destaque').reduce((a, b) => a + b.paragrafos.length, 0),
    paineis_tres_niveis: blocos.filter((b) => b.tipo === 'tres_niveis').reduce((a, b) => a + b.paineis.length, 0),
    formulas: blocos.filter((b) => b.tipo === 'formula').length, formulas_com_desc: blocos.filter((b) => b.tipo === 'formula' && b.desc_texto).length,
    figuras: 0, listas: 0, vale_lembrar: 0,
    instrumentos: 1, entradas_instrumento: inst.entradas.length, saidas_instrumento: 1, linhas_de_script: inst.script.linhas.length, cenarios_de_execucao: R.exec.length,
    invocacoes_no_texto: R.invocacoes.length, remissoes_a_outras_aulas: R.remissoes.length,
    exercicios_vinculados: 1, relacionados_nao_vinculados: R.relacionados.length, termos_lexico_candidatos: R.termos.length, verbetes_lexico_modulo: gloss.length,
    divergencias_fonte: dsrc.length, divergencias_codigo: cods.length,
  };
  out.contagens = contagens;
  return limpa(out);
}

function mdAula(R, j) {
  const cfg = R.cfg; const inst = j.instrumentos[0]; const c = j.contagens;
  const t = (s) => s.replace(/\|/g, '\\|');
  const num = (n) => String(n).padStart(2, '0');
  const lines = [];
  const w = (s = '') => lines.push(s);
  w(`# M01·A${num(cfg.n)}: ${j.aula.titulo_h2_texto}`); w();
  w(`Arquivo de dados: [\`aula-${num(cfg.n)}.json\`](aula-${num(cfg.n)}.json). Gerado por \`extratores/gen-aulas01-02.mjs\` e verificado por \`extratores/verify-aulas01-02.mjs\`.`); w();
  w(`- **Fonte (só leitura):** \`C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html\`, ${j.meta.fonte_total_linhas.toLocaleString('pt-BR')} linhas. A aula ocupa as linhas ${cfg.comentario} a ${cfg.close}. O instrumento está nas linhas ${inst.origem.linha_aprox} a ${inst.linha_fim_aprox} e o script, nas linhas ${inst.script.origem.linha_aprox} a ${inst.script.origem.linha_fim_aprox}. O exercício vinculado está nas linhas ${j.exercicios[0].origem.linha_aprox} a ${j.exercicios[0].origem.linha_fim_aprox}.`);
  w(`- **Como foi extraído:** script node sobre fatias do HTML por linha; o percorredor lança erro em qualquer linha que não reconhece. Nenhuma prosa foi digitada. \`html\` guarda o innerHTML literal; \`texto\` guarda o mesmo conteúdo sem tags.`);
  w(`- **Cobertura por token (§5):** ${j.cobertura_texto_por_token.tokens_casados} de ${j.cobertura_texto_por_token.tokens_fonte_sem_instrumento} tokens casados (${String(j.cobertura_texto_por_token.pct).replace('.', ',')}%), sem contar o markup do instrumento. A sequência de tokens extraída é ${j.cobertura_texto_por_token.sequencia_identica_em_ordem ? 'idêntica' : 'DIFERENTE d'}${j.cobertura_texto_por_token.sequencia_identica_em_ordem ? '' : 'a'} à da fonte, em ordem. Instrumento: ${j.cobertura_instrumento.tokens_extraidos} de ${j.cobertura_instrumento.tokens_fonte} tokens, sequência ${j.cobertura_instrumento.sequencia_identica_em_ordem ? 'idêntica' : 'DIFERENTE'}.`); w();
  w('## Contagens'); w();
  w(`- **Blocos:** ${c.blocos} (${Object.entries(c.blocos_por_tipo).map(([k, v]) => `${k} ${v}`).join(', ')}). Seções ${c.secoes_numeradas.join(', ')}.`);
  w(`- **Tabelas:** ${c.tabelas} (linhas de dados: ${c.linhas_de_dados_por_tabela.join(' e ')}; ${c.celulas_de_tabela} células). **Fórmulas:** ${c.formulas}, ${c.formulas_com_desc} com \`desc\`. **Destaques (callouts):** ${c.destaques}, com ${c.paragrafos_de_destaque} parágrafo(s). **Painéis de três níveis:** ${c.paineis_tres_niveis}.`);
  w(`- **Figuras, listas e "Vale lembrar":** 0, 0 e 0 (medido na section).`);
  w(`- **Instrumento:** 1 (${c.entradas_instrumento} entradas, ${c.saidas_instrumento} saída, ${c.linhas_de_script} linhas de script, ${c.cenarios_de_execucao} cenários executados). **Invocações no texto:** ${c.invocacoes_no_texto}. **Remissões a outras aulas:** ${c.remissoes_a_outras_aulas}.`);
  w(`- **Exercício vinculado:** 1 (${j.exercicios[0].tag_fonte}). **Relacionados sem vínculo:** ${c.relacionados_nao_vinculados}. **Termos do léxico (candidatos):** ${c.termos_lexico_candidatos} de ${c.verbetes_lexico_modulo}.`);
  w(`- **Divergências da fonte:** ${c.divergencias_fonte}. **Divergências com o código:** ${c.divergencias_codigo}.`); w();
  w('## Estrutura do JSON'); w();
  w('| Chave | Conteúdo |'); w('|---|---|');
  w(`| \`aula\` | Marcador, título do h2 (html e texto) e a pergunta do § MAP (L${cfg.mapLine}): "${t(j.aula.pergunta_mapa.pergunta_texto)}". Duração, dificuldade e vídeo ficam em \`null\`, com nota |`);
  w(`| \`blocos[]\` | ${c.blocos} blocos na ordem da fonte. Cada um tem \`origem {seletor, trecho_inicial, linha_aprox}\`; tabelas, parágrafos de callout, abas e painéis têm origem por linha |`);
  w('| `instrumentos[0]` | Campos (com atributos literais), saída, nota estática, script verbatim por linha, execução do script em DOM simulado e resíduos |');
  w('| `exercicios[0]` | Enunciado e gabarito verbatim, cálculos em destaque, critério `null` (com o critério do § Drill citado à parte) |');
  w('| `relacionados_nao_vinculados[]` | Itens do quiz e do checklist que tratam do mesmo tema, sem tag de aula (P9) |');
  w('| `divergencias[]` | Divergências da fonte, cada uma com as leituras verbatim e sem escolha |');
  w('| `comparacao_codigo` | Verificações programáticas, o que está conforme e as divergências COD-xx |'); w();
  w('## Estrutura da aula, na ordem da fonte'); w();
  for (const b of j.blocos) {
    const ln = b.origem.linha_aprox + (b.origem.linha_fim_aprox ? `–${b.origem.linha_fim_aprox}` : '');
    let d;
    if (b.tipo === 'lead') d = 'lead';
    else if (b.tipo === 'titulo') d = `**${b.numero}** ${b.texto}`;
    else if (b.tipo === 'paragrafo') d = `parágrafo: "${b.texto.slice(0, 70)}${b.texto.length > 70 ? '…' : ''}"` + (b.marcacao_inline?.hl ? ` (${b.marcacao_inline.hl.length} destaques inline)` : '');
    else if (b.tipo === 'formula') d = `fórmula: ${b.eq_texto}${b.desc_texto ? ` · desc: ${b.desc_texto}` : ''}`;
    else if (b.tipo === 'tabela') d = `tabela ${b.n_colunas}×${b.n_linhas_dados}: ${b.cabecalho.map((x) => x.texto).join(' / ')}`;
    else if (b.tipo === 'destaque') d = `callout ${b.tom} "${b.rotulo}" (${b.paragrafos.length} parágrafo${b.paragrafos.length > 1 ? 's' : ''})`;
    else if (b.tipo === 'tres_niveis') d = `três níveis: ${b.abas.map((x) => x.rotulo).join(' / ')}`;
    else if (b.tipo === 'instrumento') d = `**instrumento ${cfg.instId}**: ${b.texto}`;
    else d = b.tipo;
    w(`- L${ln} · ${b.tipo} · ${t(d)}`);
  }
  w();
  w(`## ${inst.id.replace('m01-inst-', 'INST·')}: resumo da especificação`); w();
  w(`- **Título:** "${inst.titulo}". O id na fonte é "${inst.id_fonte}". Taxonomia: \`calculadora\` (ver nota no JSON).`);
  w(`- **Pergunta:** \`null\`.${inst.instrucao ? ` Instrução da prancha: "${inst.instrucao.texto}" (L${inst.instrucao.origem.linha_aprox}).` : ''}`);
  w('- **Entradas:**'); w();
  w('  | Id | Rótulo | Unidade | Padrão | Mín. | Passo | Máx. | Placeholder |'); w('  |---|---|---|---|---|---|---|---|');
  for (const e of inst.entradas) w(`  | \`${e.id}\` | ${e.rotulo} | ${e.unidade} | ${e.padrao ?? 'vazio'} | ${e.min ?? '—'} | ${e.step ?? '—'} | ${e.max ?? 'sem máx.'} | ${e.placeholder ?? '—'} |`);
  w();
  w(`- **Saída \`${inst.saidas[0].id}\`:** "${inst.saidas[0].rotulo}"${inst.saidas[0].unidade ? ` em ${inst.saidas[0].unidade}` : ' (texto de status, sem unidade)'}. Valor inicial na marcação: "${inst.saidas[0].valor_inicial_marcacao}".`);
  w(`- **Nota (estática):** "${t(inst.texto_nota_estatica.texto)}"`);
  w(`- **Fonte dos números:** \`null\`. **Tolerâncias:** ${inst.tolerancias ? `só a coerência relativa de ${inst.tolerancias.coerencia_relativa} (\`diff < 0.01\`)` : '`null`'}.`); w();
  w('### Execução do script-fonte em DOM simulado'); w();
  if (cfg.n === 1) {
    w('| Cenário | kW | h | Saída |'); w('|---|---|---|---|');
    for (const r of inst.execucao_do_script_fonte.resultados) w(`| ${r.nome} | ${r.entradas['i01-kw'] || '(vazio)'} | ${r.entradas['i01-h'] || '(vazio)'} | ${r.saida_texto} |`);
  } else {
    w('| Cenário | Passo final | V | I | R | Status |'); w('|---|---|---|---|---|---|');
    for (const r of inst.execucao_do_script_fonte.resultados) { const u = r.estados[r.estados.length - 1]; w(`| ${t(r.nome)} | ${t(u.apos)} | ${u.V || '—'} | ${u.I || '—'} | ${u.R || '—'} | ${t(u.status)} |`); }
  }
  w();
  w('**Resíduos do script (sinalizados, não corrigidos):**'); w();
  for (const x of inst.residuos_do_script) w(`- ${x}`);
  w();
  w('## Onde o instrumento é invocado (C5)'); w();
  if (j.invocacoes_no_texto.length) for (const i of j.invocacoes_no_texto) w(`- **Linha ${i.origem.linha_aprox}:** o parágrafo termina em "${i.texto}"; o \`div.instrument\` vem logo depois (linhas ${inst.origem.linha_aprox - 1} a ${inst.linha_fim_aprox}).`);
  else w(`- A fonte não tem frase de invocação. O instrumento vem logo depois do parágrafo da linha ${j.blocos.filter((b) => b.tipo !== 'instrumento' && b.origem.linha_aprox < inst.origem.linha_aprox).pop().origem.linha_aprox} e antes do h3 seguinte. A posição é por adjacência.`);
  w();
  w('## Exercício vinculado'); w();
  const ex = j.exercicios[0];
  w(`- **${ex.tag_fonte}** (L${ex.origem.linha_aprox}–${ex.origem.linha_fim_aprox}). Enunciado: "${t(ex.enunciado_texto)}"`);
  w(`- **Gabarito:** "${t(ex.resposta_referencia_texto)}"`);
  w(`- **Critério:** \`null\` por exercício; o § Drill diz "${t(ex.criterio_modulo_drill.texto)}"`); w();
  if (j.termos_lexico.candidatos.length) {
    w('## Termos do léxico (correspondência textual, não posse)'); w();
    w(j.termos_lexico.candidatos.map((x) => `${x.termo} (${x.n_ocorrencias})`).join('; ') + '.'); w();
  }
  w('## Divergências na fonte (sem escolha)'); w();
  for (const d of j.divergencias) {
    w(`- **${d.id}** — ${d.o_que}`);
    for (const l of d.leituras) w(`  - ${l.rotulo ? `${l.rotulo}, ` : ''}L${l.origem.linha_aprox}: "${t(l.texto)}"`);
    w(`  - ${d.argumento}`);
  }
  w();
  w('## Divergências em relação ao código portado'); w();
  w(`Código lido: \`src/lib/data/alexandria-modulo-01-content.ts\`, chaves \`${cfg.codeKey}\` (corpo, lead, aula) e \`${cfg.codeInst}\`, e \`alexandria-instrument-calculators.ts\`.`); w();
  w('| Id | Gravidade | Onde | Divergência | Fonte |'); w('|---|---|---|---|---|');
  for (const d of j.comparacao_codigo.divergencias) w(`| ${d.id} | ${d.gravidade} | ${t(d.onde)} | ${t(d.o_que)} | ${d.fonte ?? '—'} |`);
  w();
  w('**O que está conforme:**'); for (const x of j.comparacao_codigo.conforme) w(`- ${x}`);
  w();
  w('## O que a fonte não tem'); w();
  w(`- Duração, dificuldade, vídeo, imagens, figuras, listas, "Vale lembrar" e referências por aula: ausentes (\`null\`/vazio, medido).`);
  w(`- Procedência dos números ${cfg.n === 1 ? 'da tabela 1.3 (lâmpada LED ≈ 9 W, chuveiro ≈ 5,5 kW, britador ≈ 2 MW, Itaipu ≈ 14 GW, geladeira ≈ 40 kWh/mês, cimenteira ≈ 5.000 MWh/mês, Brasil ≈ 530 TWh/ano) e dos cenários do instrumento' : 'da tabela 2.1 e dos exemplos do instrumento'}: não declarada. Nada foi conferido fora da fonte.`);
  w(`- Pergunta própria do instrumento, previsão, gabarito do instrumento e tolerâncias (${cfg.n === 2 ? 'exceto a coerência de 1% do script do INST·02' : 'nenhuma declarada'}): ausentes.`);
  w(`- Vínculo declarado entre aula e termo do léxico, instrumento e exercício: só o exercício (pela tag).`);
  return lines.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
for (const cfg of AULAS) {
  const R = gerar(cfg);
  const j = montar(R);
  const nn = String(cfg.n).padStart(2, '0');
  fs.writeFileSync(path.join(OUTDIR, `aula-${nn}.json`), JSON.stringify(j, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(OUTDIR, `aula-${nn}.md`), mdAula(R, j), 'utf8');
  console.log(`A${nn}:`, JSON.stringify({ blocos: j.contagens.blocos, por_tipo: j.contagens.blocos_por_tipo, cobertura: { pct: R.cobertura.pct, casados: R.cobertura.tokens_casados, de: R.cobertura.tokens_fonte_sem_instrumento, seq: R.cobertura.sequencia_identica_em_ordem, nao_casados: R.cobertura.tokens_nao_casados }, instrumento: R.instCobertura, termos: R.termos.map((x) => [x.termo, x.n_ocorrencias]), cod: j.contagens.divergencias_codigo, div: j.contagens.divergencias_fonte, remissoes: R.remissoes.length, invocacoes: R.invocacoes.length, mencoes: R.mencoes.length }));
}
