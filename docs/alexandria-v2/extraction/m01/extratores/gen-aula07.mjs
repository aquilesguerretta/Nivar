// Gera docs/alexandria-v2/extraction/m01/aula-07.json por extração programática.
// Nenhum texto de conteúdo é digitado à mão: tudo sai de fatias do HTML-fonte,
// por um caminhante de linhas que LANÇA ERRO diante de qualquer linha que não
// reconheça (nada é descartado em silêncio). Padrão da A08 (gen-aula08.mjs).
// Uso: node gen-aula07.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const OUT = path.resolve(HERE, '../aula-07.json');
const raw = fs.readFileSync(SRC, 'utf8');
const L = raw.split(/\r?\n/);
const TOTAL = L[L.length - 1] === '' ? L.length - 1 : L.length;
const line = (n) => L[n - 1];

const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const strip = (h) => decode(h.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const stripSp = (h) => decode(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const trecho = (s) => strip(s).slice(0, 60);
const origem = (n, seletor, html) => ({ seletor, trecho_inicial: trecho(html), linha_aprox: n });
function inner(n, re) {
  const m = line(n).match(re);
  if (!m) throw new Error(`linha ${n} não casou ${re}: ${line(n)}`);
  return m[1];
}
function assertLine(n, needle) {
  if (!line(n).includes(needle)) throw new Error(`linha ${n} sem "${needle}": ${line(n)}`);
}
function blockEnd(n) {
  let d = 0;
  for (let i = n; i <= L.length; i++) {
    const s = line(i) ?? '';
    d += (s.match(/<div\b/g) || []).length - (s.match(/<\/div>/g) || []).length;
    if (d === 0) return i;
  }
  throw new Error('bloco sem fim a partir de ' + n);
}
const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

// ---------- âncoras ----------
const S0 = 1900, S1 = 2001; // section.aula
assertLine(1898, 'AULA 07');
assertLine(S0, '<section class="aula">');
assertLine(1902, 'Aula 07');
assertLine(S1, '</section>');
assertLine(1950, 'INSTRUMENT 05');

const AULA_ID = 'm01-a07', INST_ID = 'm01-inst-05', EX_ID = 'm01-ex-05', FIG_ID = `${AULA_ID}-fig-01`;

const markerNum = inner(1902, /<span class="num">(.*?)<\/span>/);
const markerNome = inner(1902, /<span class="dot"><\/span><span>(.*?)<\/span>/);
const h2 = inner(1903, /<h2 class="aula-title">(.*)<\/h2>/);
const mapaCells = [...line(1345).trim().matchAll(/<td>(.*?)<\/td>/g)].map((m) => m[1]);

// ---------- blocos, na ordem da fonte ----------
const blocos = [];
let k = 0;
const bid = (t) => `${AULA_ID}-b${String(++k).padStart(2, '0')}-${t}`;
function push(tipo, n, seletor, campos, extra = {}) {
  const htmlRef = campos.html ?? campos.texto ?? campos.rotulo ?? campos.eq_html ?? '';
  blocos.push({ id: bid(tipo), tipo, ...campos, origem: origem(n, seletor, htmlRef), ...extra });
}

let instrBounds = null, figBounds = null, figEl = null;
let n = 1904;
const END_BODY = S1 - 2; // 1999; 2000 = </div> do container
assertLine(2000, '</div>');
while (n <= END_BODY) {
  const t = line(n).trim();
  let m;
  if (t === '') { n++; continue; }
  if (t.startsWith('<!--')) {
    if (/INSTRUMENT 05/.test(t)) instrBounds = { comentario: n };
    n++; continue;
  }
  if ((m = t.match(/^<p class="lead">(.*)<\/p>$/))) {
    push('lead', n, 'section.aula(Aula 07) > .container > p.lead', { html: m[1], texto: strip(m[1]) });
    n++; continue;
  }
  if ((m = t.match(/^<h3><span class="num">(.*?)<\/span>(.*)<\/h3>$/))) {
    push('titulo', n, `h3 > span.num(${m[1]})`, { numero: m[1], texto: strip(m[2]), html: t.replace(/^<h3>|<\/h3>$/g, '') });
    n++; continue;
  }
  if ((m = t.match(/^<p>(.*)<\/p>$/))) {
    push('paragrafo', n, `p (após h3 ${[...blocos].reverse().find((b) => b.tipo === 'titulo')?.numero})`, { html: m[1], texto: strip(m[1]) });
    n++; continue;
  }
  if (t.startsWith('<div class="formula">')) {
    const e = blockEnd(n);
    let eq = null, eqLine = null, desc = null, descLine = null;
    for (let i = n + 1; i < e; i++) {
      let mm;
      if ((mm = line(i).trim().match(/^<div class="eq">(.*)<\/div>$/))) { eq = mm[1]; eqLine = i; }
      else if ((mm = line(i).trim().match(/^<div class="desc">(.*)<\/div>$/))) { desc = mm[1]; descLine = i; }
      else throw new Error('linha inesperada na formula ' + i + ': ' + line(i));
    }
    if (eq === null) throw new Error('formula sem eq');
    push('formula', n, 'div.formula > div.eq', { eq_html: eq, eq_texto: strip(eq), desc: desc === null ? null : strip(desc), desc_html: desc, desc_origem: desc === null ? null : origem(descLine, 'div.formula > div.desc', desc) }, { linha_fim_aprox: e });
    n = e + 1; continue;
  }
  if ((m = t.match(/^<div class="callout( (\w+))?">$/))) {
    const e = blockEnd(n);
    const lab = inner(n + 1, /<div class="callout-label">(.*)<\/div>/);
    const ps = [];
    for (let i = n + 2; i < e; i++) { const pm = line(i).trim().match(/^<p>(.*)<\/p>$/); if (pm) ps.push({ i, h: pm[1] }); else if (line(i).trim() !== '') throw new Error('linha inesperada no callout ' + i); }
    if (ps.length !== 1) throw new Error('callout com ' + ps.length + ' parágrafos em ' + n);
    push('destaque', n, `div.callout${m[2] ? '.' + m[2] : ''}`, {
      tom: m[2] ?? 'neutro', classe_fonte: t.replace(/^<div class="|">$/g, ''), rotulo: strip(lab), rotulo_html: lab, html: ps[0].h, texto: strip(ps[0].h), corpo_origem: origem(ps[0].i, 'div.callout > p', ps[0].h),
    }, { linha_fim_aprox: e });
    n = e + 1; continue;
  }
  if (t.startsWith('<div class="table-wrap">')) {
    const e = blockEnd(n);
    const th = [], linhas = [];
    let tbl = null;
    for (let i = n; i <= e; i++) {
      const s = line(i).trim();
      if (s.startsWith('<table>')) tbl = i;
      let mm;
      if ((mm = s.match(/^<thead><tr>(.*)<\/tr><\/thead>$/))) for (const c of mm[1].matchAll(/<th>(.*?)<\/th>/g)) th.push({ html: c[1], texto: strip(c[1]) });
      else if ((mm = s.match(/^<tr>(.*)<\/tr>$/))) {
        const cells = [...mm[1].matchAll(/<td( class="([^"]*)")?>(.*?)<\/td>/g)].map((c) => ({ html: c[3], texto: strip(c[3]), classe_td: c[2] ?? null }));
        if (!cells.length) throw new Error('linha de tabela sem td em ' + i);
        linhas.push({ celulas: cells, origem: { seletor: 'tbody > tr', trecho_inicial: cells[0].texto, linha_aprox: i } });
      }
    }
    push('tabela', tbl, 'div.table-wrap > table', { cabecalho: th, linhas, n_colunas: th.length, n_linhas: linhas.length, texto: null }, { linha_fim_aprox: e });
    n = e + 1; continue;
  }
  if ((m = t.match(/^<ul( [^>]*)?>$/))) {
    const itens = []; let i = n + 1;
    for (; !line(i).trim().startsWith('</ul>'); i++) {
      const mm = line(i).trim().match(/^<li( [^>]*)?>(.*)<\/li>$/);
      if (!mm) throw new Error('item de lista inesperado em ' + i);
      itens.push({ html: mm[2], texto: strip(mm[2]), li_attr: (mm[1] || '').trim() || null, origem: { seletor: 'ul > li', trecho_inicial: trecho(mm[2]), linha_aprox: i } });
    }
    push('lista', n, 'ul', { itens, ul_attr: (m[1] || '').trim() || null, texto: null }, { linha_fim_aprox: i });
    n = i + 1; continue;
  }
  if (t.startsWith('<div class="triangle-vis">')) {
    figBounds = { ini: n, fim: blockEnd(n) };
    push('figura', n, 'div.triangle-vis', { ref: FIG_ID, texto: null }, { vinculos: { figura: FIG_ID }, nota: 'Especificação completa em figuras[0]. A figura vem ANTES do div.instrument (fica entre o parágrafo de 7.2 e o INST·05) e FORA dele.', linha_fim_aprox: figBounds.fim });
    n = figBounds.fim + 1; continue;
  }
  if (t.startsWith('<div class="instrument"')) {
    instrBounds = { ...instrBounds, ini: n, fim: blockEnd(n) };
    push('instrumento', n, 'div.instrument (comentário <!-- INSTRUMENT 05: Triangle controls --> na linha ' + instrBounds.comentario + ')', {
      ref: INST_ID, texto: strip(inner(n + 2, /<div class="instrument-title">(.*)<\/div>/)),
    }, { vinculos: { instrumento: INST_ID }, nota: `Posição literal na fonte: depois da figura div.triangle-vis (linhas ${figBounds.ini}-${figBounds.fim}) e antes do h3 7.3 (linha ${instrBounds.fim + 2}). Especificação completa em instrumentos[0].`, linha_fim_aprox: instrBounds.fim });
    n = instrBounds.fim + 1; continue;
  }
  throw new Error(`linha ${n} não reconhecida pelo caminhante: ${line(n)}`);
}
if (!instrBounds || !figBounds) throw new Error('instrumento/figura não encontrados');
const bl = (tipo) => blocos.filter((b) => b.tipo === tipo);

// ---------- figura triangle-vis ----------
const svgIni = figBounds.ini + 2; // <svg ...>
assertLine(svgIni, '<svg id="triangle-svg"');
const viewBox = inner(svgIni, /viewBox="([^"]+)"/);
const elementosSvg = [];
for (let i = svgIni + 1; i < figBounds.ini + 22; i++) {
  const s = line(i).trim();
  if (s.startsWith('</svg>')) break;
  let m;
  if ((m = s.match(/^<(line|path|text)\b([^>]*?)(\/>|>(.*)<\/text>)$/))) {
    elementosSvg.push({ elemento: m[1], atributos: attrs(m[2]), texto: m[4] ?? null, linha_literal: s, origem: { seletor: `svg > ${m[1]}${attrs(m[2]).id ? '#' + attrs(m[2]).id : ''}`, trecho_inicial: (m[4] ?? s).slice(0, 60), linha_aprox: i } });
  }
}
const readouts = [];
for (let i = 1942; i <= 1946; i++) {
  const s = line(i).trim();
  const m = s.match(/^<div class="readout"><span class="readout-label">(.*?)<\/span><span class="readout-value( (\w+))?"( id="([^"]+)")?>(.*)<\/span><\/div>$/);
  if (!m) throw new Error('readout ' + i + ': ' + s);
  const im = m[6].match(/^<span id="([^"]+)">(.*?)<\/span>(.*)$/);
  if (!im) throw new Error('readout interno ' + i);
  readouts.push({
    rotulo: m[1], id_valor: im[1], valor_inicial_marcacao: im[2], sufixo_unidade: decode(im[3]).trim() || null,
    classe_cor_marcacao: m[3] ?? null, id_container: m[5] ?? null, linha_literal: s,
    origem: { seletor: `div.readout > span#${im[1]}`, trecho_inicial: m[1], linha_aprox: i },
  });
}
const figuras = [{
  id: FIG_ID,
  tipo: 'triangulo_svg_dinamico_com_leituras',
  seletor: 'div.triangle-vis',
  titulo: null,
  titulo_nota: 'A figura não tem título próprio. O h3 7.2 é "O triângulo de potência" (linha 1914) e o parágrafo que a introduz termina em dois-pontos (linha 1915).',
  viewBox,
  elementos_svg: elementosSvg,
  leituras: readouts,
  leituras_nota: 'As 5 leituras (div.triangle-readouts) são irmãs do SVG dentro de div.triangle-vis, FORA do div.instrument. O script do INST·05 as escreve a cada entrada (ver instrumentos[0].script). Valores iniciais da marcação = cenário-padrão calculado (ver instrumentos[0].cenario_padrao).',
  unidade: null,
  unidade_nota: 'Cada leitura traz a própria unidade (kW, kVAr, kVA, °); FP é adimensional. Não há eixo numerado no SVG: só os rótulos kW, kVAr, kVA e φ.',
  fonte_citada: null,
  fonte_citada_nota: 'Nenhuma fonte, legenda ou p.srcnote acompanha a figura.',
  origem: { seletor: 'div.triangle-vis', trecho_inicial: '<div class="triangle-vis">', linha_aprox: figBounds.ini },
  linha_fim_aprox: figBounds.fim,
}];

// ---------- instrumento INST·05 ----------
const I0 = instrBounds.ini, I1 = instrBounds.fim;
const instTitle = inner(I0 + 2, /<div class="instrument-title">(.*)<\/div>/);
const instId = inner(I0 + 3, /<div class="instrument-id">(.*)<\/div>/);
function campo(lblLine) {
  const lm = line(lblLine).match(/<label class="field-label">(.*?) <span class="unit">(.*?)<\/span><\/label>/);
  const nm = line(lblLine + 1).trim().match(/^<input type="number" id="([^"]+)" value="([^"]+)" min="([^"]+)" step="([^"]+)">$/);
  const rm = line(lblLine + 2).trim().match(/^<div class="field-slider"><input type="range" id="([^"]+)" min="([^"]+)" max="([^"]+)" value="([^"]+)" step="([^"]+)"><\/div>$/);
  if (!lm || !nm || !rm) throw new Error('campo ' + lblLine);
  return {
    id: nm[1], rotulo: decode(lm[1]), unidade: decode(lm[2]),
    numero: { tipo_input: 'number', id: nm[1], padrao: Number(nm[2]), min: Number(nm[3]), max: null, max_nota: 'Sem atributo max no input numérico.', step: Number(nm[4]), linha_literal: line(lblLine + 1).trim() },
    deslizador: { tipo_input: 'range', id: rm[1], min: Number(rm[2]), max: Number(rm[3]), padrao: Number(rm[4]), step: Number(rm[5]), linha_literal: line(lblLine + 2).trim() },
    gemeos: true,
    gemeos_nota: 'Campo numérico e deslizador gêmeos, sincronizados pelo script (syncInputRange, linhas 2925-2930), com min/step diferentes (Q07 do DECIDIR): kW número min 0 step 50 × deslizador 100–1500 step 10; kVAr número min 0 step 20 × deslizador 0–1200 step 10.',
    origem: { seletor: `input#${nm[1]}`, trecho_inicial: `${decode(lm[1])} ${decode(lm[2])}`, linha_aprox: lblLine + 1 },
  };
}
const campos = [campo(1959), campo(1964)];
const noteHtml = inner(1970, /^\s*(.*)$/).trim();
assertLine(1969, 'instrument-note');

// script
const scIdx = L.findIndex((s) => s.includes('INSTRUMENT 05: Power Triangle'));
const SC0 = scIdx + 3; // `(function() {` (comentário ocupa scIdx..scIdx+2, 1-based +1)
assertLine(SC0, '(function() {');
let SC1 = SC0; while (line(SC1).trim() !== '})();') SC1++;
const scriptLinhas = [];
for (let i = SC0; i <= SC1; i++) if (line(i).trim() !== '') scriptLinhas.push({ linha: i, texto: line(i).trim() });
const sl = (i) => line(i).trim();
const consts = {};
for (const [, nome, v] of line(2877).matchAll(/(\w+) = (\d+)/g).length ? [...line(2877).matchAll(/(\w+) = (\d+)/g)] : []) consts[nome] = Number(v);
for (const i of [2878, 2879, 2880]) { const m = sl(i).match(/const (\w+) = (\d+);/); consts[m[1]] = Number(m[2]); }
const idsDom = scriptLinhas.map((x) => x.texto.match(/getElementById\('([^']+)'\)/)?.[1]).filter(Boolean);
const semaforo = [];
for (let i = 2920; i <= 2922; i++) {
  const m = sl(i).match(/^(if \(fp >= ([\d.]+)\)|else if \(fp >= ([\d.]+)\)|else) \{ fpReadout\.classList\.add\('(\w+)'(?:, '(\w+)')?\)?;? ?fpReadout\.classList\.remove\((.*?)\); \}$/);
  if (!m) throw new Error('semáforo ' + i + ': ' + sl(i));
  semaforo.push({ condicao_literal: m[1], limiar_fp: m[2] ? Number(m[2]) : m[3] ? Number(m[3]) : null, classe_adicionada: m[4], linha_literal: sl(i), origem: { seletor: 'script render() > classList FP', trecho_inicial: m[1], linha_aprox: i } });
}
// execução da mesma lógica (linhas 2883-2923) no cenário-padrão
const fmt = (v, d) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
function render(kw, kvar) {
  const kva = Math.sqrt(kw * kw + kvar * kvar);
  const fp = kva > 0 ? kw / kva : 1;
  const angleDeg = (Math.atan2(kvar, kw) * 180) / Math.PI;
  const ramo = fp >= 0.92 ? 'if (fp >= 0.92)' : fp >= 0.85 ? 'else if (fp >= 0.85)' : 'else';
  return { kva, fp, angleDeg, leituras: { 'tri-kw-val': Math.round(kw).toLocaleString('pt-BR'), 'tri-kvar-val': Math.round(kvar).toLocaleString('pt-BR'), 'tri-kva-val': Math.round(kva).toLocaleString('pt-BR'), 'tri-fp-val': fmt(fp, 2), 'tri-angle-val': fmt(angleDeg, 1) }, ramo };
}
const def = render(800, 480);
for (const r of readouts) if (def.leituras[r.id_valor] !== r.valor_inicial_marcacao) throw new Error(`cenário-padrão difere da marcação em ${r.id_valor}: ${def.leituras[r.id_valor]} × ${r.valor_inicial_marcacao}`);
const MAX_KW = consts.MAX_KW, MAX_KVAR = consts.MAX_KVAR, MAX_LEN = consts.MAX_LEN;
const kwPx = (800 / MAX_KW) * MAX_LEN, kvarPx = (480 / MAX_KVAR) * (MAX_LEN * 0.85);
const anguloDesenhado = (Math.atan2(kvarPx, kwPx) * 180) / Math.PI;
const svgEstatico = Object.fromEntries(elementosSvg.filter((e) => /^tri-(kw|kvar|kva)$/.test(e.atributos.id || '')).map((e) => [e.atributos.id, e.atributos]));

const instrumento = {
  id: INST_ID, id_fonte: instId, kind_taxonomia: 'controles',
  kind_nota: 'O código usa kind "controles" (alexandria-modulo-01-content.ts inst-05). Marcação: 2 campos (cada um número + deslizador gêmeos), ZERO saída dentro do div.instrument e nota estática; as 5 leituras e o desenho vivem na figura triangle-vis (irmã, fora do instrumento) e são escritas pelo script.',
  titulo: instTitle,
  pergunta: null,
  pergunta_nota: 'A prancha não tem pergunta própria. A pergunta que a fonte declara para a aula está fora do instrumento: § MAP, linha 1345 (aula.pergunta_mapa). O texto do instrument-note ("Reduza a potência reativa e veja o fator de potência subir…") é instrução, não pergunta. Qualquer pergunta de previsão seria DERIVADA (P3/P11).',
  vinculos: { aula: AULA_ID, exercicio_relacionado: null, termo: null },
  vinculos_nota: 'Vínculo aula↔instrumento por posição (o div.instrument está dentro da section da Aula 07). O Ex·05 usa o mesmo vocabulário (kW, kVA, FP) mas a fonte não o liga ao instrumento.',
  entradas: campos,
  saidas: [],
  saidas_nota: 'Nenhuma saída DENTRO do div.instrument (sem div.instrument-output). As 5 leituras estão em figuras[0].leituras (div.triangle-readouts, fora do instrumento).',
  leituras_externas_ref: FIG_ID,
  texto_leitura: {
    tipo: 'estatico',
    seletor: 'div.instrument-note',
    html: noteHtml, texto: strip(noteHtml),
    origem: { seletor: 'div.instrument-note', trecho_inicial: strip(noteHtml).slice(0, 60), linha_aprox: 1970 },
    nota: 'Ao contrário do INST·06, o div.instrument-note do INST·05 não tem id nem é sobrescrito por script: é texto estático.',
  },
  cenario_padrao: {
    entradas: { 'i05-kw': 800, 'i05-kvar': 480 },
    origem: 'atributos value dos inputs (linhas 1960, 1961, 1965, 1966)',
    leituras_calculadas_pelo_script: def.leituras,
    fp_bruto: def.fp, kva_bruto: def.kva, angulo_bruto_graus: def.angleDeg,
    ramo_semaforo_ativo: def.ramo,
    nota: 'Executada a mesma lógica das linhas 2883-2923 com 800 / 480. As 5 leituras calculadas coincidem com as da marcação (linhas 1942-1946): 800 kW, 480 kVAr, 933 kVA, 0,86, 31,0°.',
  },
  fonte_dos_numeros: null,
  fonte_dos_numeros_nota: 'A fonte não cita procedência para o cenário-padrão (800 kW / 480 kVAr) nem para os limiares 0,92 / 0,85 do script. O 0,92 é repetido na prosa de 7.4 como "fator de potência mínimo de referência" da regulação; o 0,85 só aparece no script (semáforo) e no exemplo de 7.3.',
  tolerancias: null,
  tolerancias_nota: 'Nenhuma tolerância declarada (P6). O instrumento não tem previsão, meta nem correção.',
  figura_prometida: null,
  figura_prometida_nota: 'O título ("Controles · …") não promete figura, mas o instrumento comanda a figura triangle-vis (ids tri-*), que vive FORA dele.',
  origem: origem(I0, 'section.aula(Aula 07) div.instrument', `${instTitle} ${instId}`),
  linha_inicio_markup: instrBounds.comentario, linha_fim_aprox: I1,
  script: {
    origem: { seletor: 'script: IIFE "INSTRUMENT 05: Power Triangle (dynamic SVG)"', trecho_inicial: 'INSTRUMENT 05: Power Triangle', linha_aprox: SC0 - 3 },
    linha_inicio: SC0, linha_fim: SC1,
    linhas_literais: scriptLinhas,
    ids_dom_lidos: idsDom,
    constantes: consts,
    entradas_leitura: { kw: sl(2883), kvar: sl(2884), nota: 'Resíduo do original, sinalizado e não corrigido (§10): `parseFloat(...) || 0` — campo vazio ou não numérico vira 0; sem teto (o campo numérico não tem max).' },
    calculo: [sl(2885), sl(2886), sl(2887), sl(2888)],
    geometria: { kwPx: sl(2890), kvarPx: sl(2891), nota: 'Os dois eixos usam escalas diferentes: kW em MAX_LEN (200 px) para 1500 kW; kVAr em 0,85 × MAX_LEN (170 px) para 1200 kVAr.' },
    arco_angulo: [sl(2903), sl(2904), sl(2905), sl(2906)],
    formatacao_leituras: { 'tri-kw-val': sl(2914), 'tri-kvar-val': sl(2915), 'tri-kva-val': sl(2916), 'tri-fp-val': sl(2917), 'tri-angle-val': sl(2918) },
    formatacao_descricao: 'kW, kVAr e kVA: Math.round + pt-BR (0 casa). FP: exatamente 2 casas. Ângulo: exatamente 1 casa. A leitura de FP é arredondada a 2 casas; o ramo do semáforo usa o valor NÃO arredondado.',
    semaforo_fp: { ramos: semaforo, nota: 'O original pinta o readout do FP com classe green / gold / red (CSS: .readout-value.green / .gold / .red), com limiares 0,92 e 0,85. É semáforo de cor na fonte; a fonte não tem texto de veredito nesses ramos.' },
    sincronia_input_range: [sl(2925), sl(2926), sl(2927), sl(2928)],
    chamada_inicial: sl(2931),
    chamada_inicial_nota: 'render() roda no carregamento: o SVG e as leituras da marcação são sobrescritos pelo script antes da primeira interação.',
  },
};

// ---------- exercício vinculado ----------
const exTag = inner(2428, /<span class="exercise-tag">(.*?)<\/span>/);
const exQ = inner(2429, /<div class="exercise-question">(.*)<\/div>/);
const exA = inner(2432, /<p>(.*)<\/p>/);
const drillIntro = inner(2389, /<p>(.*)<\/p>/);
const exercicios = [{
  id: EX_ID, tipo: 'discursiva_com_gabarito', tag_fonte: exTag,
  vinculo_declarado: { aula_id: AULA_ID, como: 'span.exercise-tag "… · Aula 07" (tag de posse, §4 do protocolo)' },
  enunciado_html: exQ, enunciado_texto: strip(exQ),
  resposta_referencia_html: exA, resposta_referencia_texto: strip(exA),
  criterio: null,
  criterio_nota: 'Sem critério por exercício na fonte. O único critério declarado é de nível do § Drill, citado em criterio_modulo_drill.',
  criterio_modulo_drill: { texto: drillIntro, origem: { seletor: '§ Drill > p', trecho_inicial: trecho(drillIntro), linha_aprox: 2389 } },
  mecanica_fonte: 'button.exercise-toggle "Revelar gabarito" (onclick toggleAns) — referência revelável sem tentativa registrada (ver bar C7).',
  vinculos: { aula: AULA_ID, instrumento: null, instrumento_nota: 'Não declarado. O exercício usa as mesmas grandezas do INST·05 (kW, kVA, FP) com outro cenário (900 kW, 1.000 kVA), mas a fonte não liga um ao outro.', termo: null },
  origem: { seletor: '§ Drill > div.exercise:nth-of-type(5)', trecho_inicial: `${exTag} ${trecho(exQ)}`.slice(0, 80), linha_aprox: 2427 },
  linha_fim_aprox: 2434,
}];
const vinculados_varredura = [...raw.matchAll(/<span class="exercise-tag">([^<]+)<\/span>/g)].map((m) => m[1]).filter((t) => /Aula 07/.test(t));

// ---------- relacionados, não vinculados ----------
const quizStart = L.findIndex((s) => s.includes('const questions = ['));
const qLines = [];
for (let i = quizStart + 1; i < quizStart + 110; i++) if (/^\s*q: "/.test(L[i - 1] ?? '')) qLines.push(i);
function quizItem(substr, id) {
  const qIdx = qLines.findIndex((x) => line(x).includes(substr));
  if (qIdx < 0) throw new Error('quiz sem ' + substr);
  const qn = qLines[qIdx];
  let ci; // options pode ser multi-linha
  let opts;
  if (/options: \[.*\],$/.test(line(qn + 1))) { opts = JSON.parse('[' + inner(qn + 1, /options: \[(.*)\],$/) + ']'); ci = qn + 2; }
  else {
    assertLine(qn + 1, 'options: [');
    let e = qn + 2; while (!/^\s*\],?$/.test(line(e))) e++;
    opts = JSON.parse('[' + L.slice(qn + 1, e - 1).map((x) => x.trim()).join(' ') + ']');
    ci = e + 1;
  }
  const correct = Number(inner(ci, /correct: (\d+),/));
  const fb = inner(ci + 1, /feedback: "(.*)"$/);
  const q = inner(qn, /q: "(.*)",$/);
  return { id, tipo: 'questao_quiz_multipla_escolha', vinculo_declarado: null, vinculo_nota: 'Sem tag de aula no array `questions`. Tema coincide com a Aula 07; posse NÃO declarada — pertence à avaliação do módulo (§ Quiz). Listado só para rastreio.', posicao_no_quiz: qIdx + 1, total_questoes_no_array: qLines.length, enunciado: q, opcoes: opts, indice_correto: correct, opcao_correta: opts[correct], feedback: fb, origem: { seletor: 'script: const questions = [...]', trecho_inicial: q.slice(0, 60), linha_aprox: qn } };
}
const q06 = quizItem('fator de potência mínimo de referência regulatória', 'm01-quiz-q06');
const q07 = quizItem('relação correta entre as três potências', 'm01-quiz-q07');
const ckl = (nn, id) => ({ id, tipo: 'item_checklist_final', vinculo_declarado: null, vinculo_nota: 'Checklist do § Final sem tag de aula; correspondência apenas temática.', texto: inner(nn, /<div class="text">(.*?)<\/div>/), origem: { seletor: '§ Final div.checklist-item > div.text', trecho_inicial: inner(nn, /<div class="text">(.*?)<\/div>/).slice(0, 60), linha_aprox: nn } });
const relacionados = [q06, q07, ckl(2506, 'm01-checklist-triangulo'), ckl(2507, 'm01-checklist-fp')];
const quizCrit = inner(2474, /<p>(.*)<\/p>/);

// ---------- remissões de outras partes à A07 ----------
const remissoes = [];
for (let i = 1; i <= TOTAL; i++) {
  if (i >= S0 && i <= S1) continue;
  const s = line(i);
  if (/Aula 07(?!<)/.test(strip(s)) && !/exercise-tag/.test(s)) {
    const sent = strip(s).split(/(?<=[.!?])\s+/).find((x) => /Aula 07/.test(x));
    remissoes.push({ texto: sent, origem: { seletor: 'prosa de outra seção', trecho_inicial: sent.slice(0, 60), linha_aprox: i } });
  }
}

// ---------- termos do léxico ----------
const aulaHtml = L.slice(S0 + 1, S1 - 1).join('\n');
const aulaTexto = stripSp(aulaHtml); // tags viram espaço: strip() cola células/spans vizinhos e derruba a fronteira de palavra (artefato visto na A08)
const gloss = [];
for (let i = 2520; i <= 2690; i++) {
  const m = (line(i) || '').match(/<summary><span class="term">(.*?)<\/span><span class="unit">(.*?)<\/span><\/summary>/);
  if (m) gloss.push({ n: i, term: decode(m[1]), unit: decode(m[2]), def: inner(i + 1, /<div class="glossary-content">(.*)<\/div>/) });
}
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function variantes(term) {
  const v = [];
  const base = term.replace(/\s*\(.*\)\s*$/, '').trim();
  base.split(/\s+\/\s+/).forEach((p) => v.push(p));
  const ab = term.match(/\(([^)]+)\)/)?.[1];
  if (ab) v.push(ab);
  const num = term.match(/\d[\d.]*\/\d+/)?.[0]; // identificador numérico de norma ("1.000/2021")
  if (num) v.push(num);
  return [...new Set(v)].filter((x) => x.length >= 2); // sigla de 1 letra ("A") casa o artigo: falso positivo (protocolo §2)
}
const termos = [];
for (const g of gloss) {
  const achados = [];
  for (const v of variantes(g.term)) {
    const flags = v.length <= 5 ? 'gu' : 'giu';
    const re = new RegExp(`(^|[^\\p{L}\\p{N}])(${escRe(v)})(?![\\p{L}\\p{N}])`, flags);
    const ocorr = []; let mm;
    while ((mm = re.exec(aulaTexto))) { const ini = mm.index + mm[1].length; ocorr.push(aulaTexto.slice(Math.max(0, ini - 45), ini + v.length + 45)); }
    if (ocorr.length) achados.push({ variante: v, n_ocorrencias: ocorr.length, ocorrencias_contexto: ocorr.slice(0, 12) });
  }
  if (achados.length) termos.push({ termo: g.term, unidade_rotulo: g.unit, definicao_html: g.def, achados, origem: { seletor: '§ Lex details.glossary-item > summary > span.term', trecho_inicial: g.term, linha_aprox: g.n } });
}

// ---------- cobertura por token (§5) ----------
const tok = (s) => (s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[\p{L}\p{N}]+/gu) || []);
const ext = [markerNum, markerNome, stripSp(h2)];
const cellsOf = (b) => [...b.cabecalho.map((c) => c.html), ...b.linhas.flatMap((r) => r.celulas.map((c) => c.html))];
for (const b of blocos) {
  if (b.tipo === 'tabela') ext.push(...cellsOf(b).map(stripSp));
  else if (b.tipo === 'lista') ext.push(...b.itens.map((i) => stripSp(i.html)));
  else if (b.tipo === 'formula') ext.push(stripSp(b.eq_html), b.desc_html ? stripSp(b.desc_html) : '');
  else if (b.tipo === 'destaque') ext.push(stripSp(b.rotulo_html), stripSp(b.html));
  else if (b.tipo === 'titulo') ext.push(b.numero, stripSp(b.html));
  else if (b.html) ext.push(stripSp(b.html));
}
for (const e of elementosSvg) if (e.texto) ext.push(e.texto);
for (const r of readouts) ext.push(r.rotulo, r.valor_inicial_marcacao, r.sufixo_unidade || '');
const bag = new Map();
for (const t of tok(ext.join(' '))) bag.set(t, (bag.get(t) || 0) + 1);
// denominador: section sem o markup do instrumento (comentário..fim do div.instrument), §5
const srcSemInst = L.slice(S0 - 1, instrBounds.comentario - 1).concat(L.slice(I1, S1)).join('\n');
const srcTok = tok(stripSp(srcSemInst));
let hit = 0; const faltando = [];
for (const t of srcTok) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else faltando.push(t); }
const cobertura = { tokens_fonte_sem_instrumento: srcTok.length, tokens_casados: hit, pct: +(100 * hit / srcTok.length).toFixed(1), tokens_nao_casados: faltando, faixa_denominador: { de: S0, ate: S1, excluido: { de: instrBounds.comentario, ate: I1, o_que: 'comentário + div.instrument (INST·05)' } } };

// ---------- comparação com o código portado ----------
const DATA = path.join(REPO, 'src/lib/data/');
const codeContent = fs.readFileSync(DATA + 'alexandria-modulo-01-content.ts', 'utf8');
const codeCalc = fs.readFileSync(DATA + 'alexandria-instrument-calculators.ts', 'utf8');
const codeGloss = fs.readFileSync(DATA + 'alexandria-glossario.ts', 'utf8');
const js = (s) => JSON.stringify(s).slice(1, -1);
const presente = (hay, s) => hay.includes(js(s)) || hay.includes(s);
const slice = (key) => (codeContent.match(new RegExp(`'${key}': \\[[\\s\\S]*?\\n  \\],`)) || [''])[0];
const CK = 'aula-01-07';
const corpoCod = slice(CK);
const leadCod = codeContent.match(new RegExp(`'${CK}': "(.*)",\\n`))?.[1] ?? '';
const porBloco = [];
for (const b of blocos) {
  const r = { bloco: b.id, tipo: b.tipo, linha: b.origem.linha_aprox };
  if (b.tipo === 'lead') r.verbatim_no_codigo = presente(codeContent, b.html);
  else if (b.tipo === 'titulo') r.verbatim_no_codigo = corpoCod.includes(`numero: ${JSON.stringify(b.numero)}, texto: ${JSON.stringify(b.texto)}`);
  else if (b.tipo === 'paragrafo') r.verbatim_no_codigo = presente(corpoCod, b.html);
  else if (b.tipo === 'formula') { r.eq_texto_no_codigo = corpoCod.includes(js(b.eq_texto)); r.desc_no_codigo = b.desc ? corpoCod.includes(js(b.desc)) : null; r.verbatim_no_codigo = r.eq_texto_no_codigo && (b.desc === null || r.desc_no_codigo); }
  else if (b.tipo === 'destaque') { r.rotulo_no_codigo_como_nota = presente(corpoCod, b.rotulo_html); r.corpo_no_codigo = presente(corpoCod, b.html); r.verbatim_no_codigo = r.rotulo_no_codigo_como_nota && r.corpo_no_codigo; }
  else if (b.tipo === 'tabela') { r.verbatim_no_codigo = cellsOf(b).every((c) => presente(corpoCod, c)); }
  else if (b.tipo === 'lista') { r.verbatim_no_codigo = b.itens.every((i) => presente(corpoCod, i.html)); }
  else if (b.tipo === 'figura') r.verbatim_no_codigo = false;
  else if (b.tipo === 'instrumento') r.verbatim_no_codigo = null;
  porBloco.push(r);
}
const checks = {
  por_bloco: porBloco,
  lead_verbatim: presente(codeContent, blocos[0].html),
  span_orfao_no_corpo: (corpoCod.match(/<\/span>/g) || []).length,
  span_na_fonte_da_aula: (aulaHtml.match(/<span\b/g) || []).length,
  ex_enunciado_verbatim: presente(codeContent, exQ),
  ex_gabarito_verbatim: presente(codeContent, exA),
  ex_tag_verbatim: presente(codeContent, exTag),
  inst_titulo_verbatim: presente(codeContent, instTitle),
  inst_nota_verbatim: presente(codeContent, noteHtml),
  inst_campos: ['i05-kw', 'i05-kvar'].map((id) => {
    const bloco = (codeContent.match(new RegExp(`\\{ id: "${id}"[^}]*\\}`)) || [''])[0];
    return { id, linha_codigo: bloco };
  }),
  inst_outputs_vazio: /id: "inst-05"[\s\S]*?outputs: \[\s*\]/.test(codeContent),
  calc_inst05: (codeCalc.match(/'inst-05': \(i\) => \{[\s\S]*?\n  \},/) || [''])[0],
  vereditos_calc_na_fonte: [...((codeCalc.match(/'inst-05': \(i\) => \{[\s\S]*?\n  \},/) || [''])[0].matchAll(/'((?:FP |FP crítico)[^']*)'/g))].map((m) => ({ texto: m[1], existe_na_fonte: raw.includes(m[1]) })),
  marca_gridalpha_na_fonte_da_aula: (aulaHtml.match(/GridAlpha/g) || []).length,
  marca_gridalpha_no_corpo_codigo: (corpoCod.match(/GridAlpha/g) || []).length,
  marca_nivar_no_corpo_codigo: (corpoCod.match(/NIVAR/g) || []).length,
};
// glossário: aulaIds do código × candidatos textuais
// o arquivo cobre vários módulos; só valem os verbetes que o código liga a alguma aula do M01 e que existem no § Lex
const glossCod = [...codeGloss.matchAll(/term:\s*"([^"]+)"[\s\S]*?aulaIds:\s*\[([^\]]*)\]/g)].map((m) => ({ termo: m[1], aulaIds: [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]) })).filter((g) => g.aulaIds.some((a) => a.startsWith('aula-01-')) && gloss.some((s) => s.term === g.termo));
const comAula = glossCod.filter((g) => g.aulaIds.includes(CK)).map((g) => g.termo);
const candidatosTxt = termos.map((t) => t.termo);
checks.glossario = { verbetes_lidos_no_codigo: glossCod.length, ligados_a_aula_no_codigo: comAula, candidatos_textuais_na_fonte: candidatosTxt, ligados_no_codigo_sem_ocorrencia_textual: comAula.filter((x) => !candidatosTxt.includes(x)), ocorrencia_textual_sem_ligacao_no_codigo: candidatosTxt.filter((x) => !comAula.includes(x)) };

const fig0 = porBloco.find((x) => x.tipo === 'figura');
const nTri = (blocosTipo) => blocos.filter((b) => b.tipo === blocosTipo).length;
const naoVerb = porBloco.filter((x) => x.verbatim_no_codigo === false && x.tipo !== 'figura').map((x) => `${x.bloco} (L${x.linha})`);
const comparacao_codigo = {
  arquivos: [
    'src/lib/data/alexandria-modulo-01-content.ts (INSTRUMENTOS_MODULO_01 inst-05 ~l.101-114; MODULO_01_LEAD aula-01-07 ~l.169; MODULO_01_CORPO aula-01-07 ~l.282-301; MODULO_01_AULAS aula-01-07 ~l.496-521)',
    'src/lib/data/alexandria-instrument-calculators.ts (inst-05 ~l.1751-1770)',
    'src/lib/data/alexandria-glossario.ts (aulaIds)',
    'src/components/alexandria/viewer/InstrumentPanel.tsx ~l.216-222 (ehDiagrama; lido só para entender o efeito das divergências; não é fonte)',
  ],
  verificacoes_programaticas: checks,
  conforme: [
    'Lead (p.lead) verbatim em MODULO_01_LEAD["aula-01-07"].',
    'Títulos 7.1–7.5 com número e texto corretos.',
    'Parágrafos de 7.1 (3), 7.2 (1), 7.3 (1, inclusive a frase do QA-M01-A07, preservada tal como está na fonte), 7.4 (2) e 7.5 (1) verbatim.',
    'Corpo do callout "Referência regulatória" verbatim.',
    'Título do INST·05 e texto do instrument-note verbatim; ids, rótulos, unidades e padrões (800 / 480) dos 2 campos.',
    'Ex·05: tag, enunciado e gabarito verbatim; vinculado à aula-01-07 (tag de posse declarada).',
    'durationMinutes / difficulty / video = null, coerente com a fonte.',
  ],
  divergencias: [
    { id: 'COD-01', gravidade: 'alta', onde: 'MODULO_01_CORPO["aula-01-07"]', o_que: 'A figura div.triangle-vis (SVG do triângulo com rótulos kW / kVAr / kVA / φ e as 5 leituras: Pot. ativa 800 kW, Pot. reativa 480 kVAr, Pot. aparente 933 kVA, Fator de potência 0,86, Ângulo φ 31,0°) não existe no corpo portado. O parágrafo de 7.2 ("As três potências formam um triângulo retângulo:") termina em dois-pontos e o bloco seguinte já é o título 7.3. Perda silenciosa (§5, §12).', fonte: `linhas ${figBounds.ini}-${figBounds.fim}` },
    { id: 'COD-02', gravidade: 'alta', onde: 'AulaViewer.tsx + MODULO_01_AULAS', o_que: `O instrumento não tem posição no fluxo: fica em aula.instruments e é renderizado depois de TODA a apostila. Na fonte ele vem depois da figura triangle-vis e antes do h3 7.3 (linhas ${instrBounds.comentario}-${I1}). Viola bar C5 e a Regra-mãe 1; "As três potências formam um triângulo retângulo:" deixa de apontar para o triângulo.`, fonte: `linhas ${figBounds.ini}-${I1 + 2}` },
    { id: 'COD-03', gravidade: 'alta', onde: 'INSTRUMENTOS_MODULO_01 inst-05 .outputs', o_que: 'outputs: [] — as 5 leituras da fonte (kW, kVAr, kVA, FP, φ; ids tri-*-val) não estão no objeto do instrumento. O desenho e os valores dependem de InstrumentPanel.tsx (ehDiagrama, ancorado no id) lendo valores tri-* do calculador; isso foi deduzido da leitura de código, não medido na tela.', fonte: 'linhas 1942-1946, 2914-2918' },
    { id: 'COD-04', gravidade: 'alta', onde: 'alexandria-instrument-calculators.ts inst-05 (veredito)', o_que: `Os três textos de veredito do calculador ("FP dentro do mínimo regulatório de 0,92.", "FP abaixo de 0,92 — sujeito a cobrança de reativo excedente.", "FP crítico — cobrança de reativo relevante e kVA exigido bem acima do útil.") NÃO existem no HTML: a fonte só troca a classe de cor do readout do FP (green / gold / red); não há texto de veredito. Verificado por substring: ${checks.vereditos_calc_na_fonte.map((v) => (v.existe_na_fonte ? 'presente' : 'ausente')).join(', ')}. O comentário do calculador também descreve a faixa como "verde / ouro / vermelho".`, fonte: 'linhas 2920-2922' },
    { id: 'COD-05', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-07"] bloco de 7.3', o_que: 'Fórmula portada com desc: null. A fonte tem div.desc: "φ é o ângulo entre tensão e corrente em regime senoidal".', fonte: 'linha 1978' },
    { id: 'COD-06', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-07"] callouts', o_que: 'Os dois callouts foram portados como nota { label: null, html: <rótulo> } seguida de parágrafo solto: "Referência regulatória" (callout neutro, 7.4) e "Cuidado · diagnóstico antes de solução" (callout red, 7.5). Na fonte o texto é o RÓTULO (div.callout-label) e o parágrafo é o CORPO do mesmo callout. Hierarquia partida (mesma natureza do COD-08 da A08).', fonte: 'linhas 1988-1991, 1996-1999' },
    { id: 'COD-07', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-07"] corpo do callout red (7.5)', o_que: `Não verbatim: a fonte diz "A linguagem GridAlpha correta é: …"; o código diz "A linguagem NIVAR correta é: …" (ocorrências de "GridAlpha" na fonte da aula: ${checks.marca_gridalpha_na_fonte_da_aula}; no corpo portado: ${checks.marca_gridalpha_no_corpo_codigo}; "NIVAR" no corpo portado: ${checks.marca_nivar_no_corpo_codigo}). Troca editorial (P24) sem marca no código; a fonte mantém a marca antiga.`, fonte: 'linha 1998' },
    { id: 'COD-08', gravidade: 'média', onde: 'INSTRUMENTOS_MODULO_01 inst-05 .fields', o_que: 'Os campos foram portados só como range (min 100 / 0, max 1500 / 1200, step 10, defaultValue 800 / 480). A fonte tem campo numérico E deslizador gêmeos com faixas diferentes: número min 0 step 50 (kW) e min 0 step 20 (kVAr), sem max; deslizador 100–1500 step 10 e 0–1200 step 10. Os parâmetros do campo numérico se perderam.', fonte: 'linhas 1960-1961, 1965-1966' },
    { id: 'COD-09', gravidade: 'baixa', onde: 'MODULO_01_AULAS aula-01-07 activities[0].points', o_que: '`points: 1` no Ex·05 não tem origem na fonte (o § Drill não pontua exercícios).', fonte: 'linhas 2427-2434' },
    { id: 'COD-10', gravidade: 'baixa', onde: 'alexandria-glossario.ts aulaIds', o_que: `aulaIds contêm "aula-01-07" em ${comAula.length} verbetes (${comAula.join('; ')}); a fonte não declara aula por termo. Candidatos textuais medidos na section: ${candidatosTxt.join('; ')}. Ligados no código sem ocorrência textual na aula: ${checks.glossario.ligados_no_codigo_sem_ocorrencia_textual.join('; ') || 'nenhum'}. Ocorrência textual sem ligação no código: ${checks.glossario.ocorrencia_textual_sem_ligacao_no_codigo.join('; ') || 'nenhum'}. Derivação do código, não dado da fonte (ver "ocorrencias_contexto" antes de ligar, §2).`, fonte: 'linhas 2520-2690' },
    { id: 'COD-11', gravidade: 'informativa', onde: 'ids', o_que: 'Código usa "inst-05", "ex-05", "aula-01-07"; esta extração usa "m01-inst-05", "m01-ex-05", "m01-a07" (ids estáveis com prefixo de módulo). Mapeamento 1:1.', fonte: null },
  ],
};
if (checks.span_orfao_no_corpo > 0) comparacao_codigo.divergencias.push({ id: 'COD-12', gravidade: 'média', onde: 'MODULO_01_CORPO["aula-01-07"]', o_que: `${checks.span_orfao_no_corpo} </span> órfão(s) no corpo portado.`, fonte: null });
else comparacao_codigo.conforme.push(`Sem </span> órfão no corpo de aula-01-07 (medido: ${checks.span_orfao_no_corpo}; a fonte da aula tem ${checks.span_na_fonte_da_aula} <span> fora do instrumento/figura contados na section inteira).`);

// ---------- divergências da fonte (duas leituras, sem escolha) ----------
const fraseQA = strip(inner(1981, /<p>(.*)<\/p>/)).match(/Um FP de 0,85 significa.*?rede\./)[0];
if (!raw.includes('Um FP de <strong>0,85</strong> significa que apenas 85% da potência aparente vira trabalho útil; os outros 15% são reativos circulando pela rede.')) throw new Error('frase QA não literal');
const fp85 = 0.85;
const derivados = {
  rotulo: 'DERIVADO (aritmética simples sobre os números da própria aula; NÃO está na fonte e NÃO substitui a frase)',
  kvar_sobre_kva_no_cenario_padrao: 480 / Math.sqrt(800 * 800 + 480 * 480),
  kvar_sobre_kva_com_fp_0_85: Math.sqrt(1 - fp85 * fp85),
  kvar_para_100_kva_com_fp_0_85: 100 * Math.sqrt(1 - fp85 * fp85),
  kw_para_100_kva_com_fp_0_85: 100 * fp85,
  complemento_de_0_85: 1 - fp85,
};
const divergencias = [
  {
    id: 'DIV-01', tipo: 'fonte_contraditoria_interna', qa: 'QA-M01-A07', status: 'PENDENTE DE DECISÃO DO FOUNDER',
    o_que: 'A frase de 7.3 sobre FP 0,85 e "15% reativos" contra o triângulo e a fórmula da própria aula.',
    leitura_a: { texto: fraseQA, origem: { seletor: 'h3(7.3) ~ p', trecho_inicial: 'Um FP de 0,85 significa', linha_aprox: 1981 }, argumento: 'Verbatim da fonte, linha 1981: diz que 85% da potência aparente vira trabalho útil e que "os outros 15%" são reativos.' },
    leitura_b: {
      texto: `${[1942, 1943, 1944, 1945, 1946].map((i) => stripSp(line(i))).join(' ')} | ${strip(inner(1977, /<div class="eq">(.*)<\/div>/))}`,
      origem: { seletor: 'div.triangle-readouts + div.formula > div.eq', trecho_inicial: 'Pot. ativa', linha_aprox: 1942, linha_fim_aprox: 1977 },
      argumento: 'Leituras da marcação (linhas 1942-1946) e fórmula (linha 1977), todas da própria Aula 07. No cenário-padrão da fonte, kVAr = 480 e kVA = 933: o reativo NÃO é 14% da aparente. A relação kVA² = kW² + kVAr² é a da A02 (L1578, "kW e kVAr são os catetos, kVA é a hipotenusa") e do quiz Q07 (L3122).',
    },
    derivado: derivados,
    decisao: 'não escolhida — pendente de decisão do Founder (DECIDIR.md QA-M01-A07 [C]). Não há frase substituta nesta extração; a frase fica tal como está na fonte.',
  },
  {
    id: 'DIV-02', tipo: 'fonte_limiar_sem_procedencia',
    o_que: 'O script do INST·05 usa dois limiares de FP (0,92 e 0,85); a prosa só nomeia o 0,92 como referência.',
    leitura_a: { texto: strip(inner(1986, /<p>(.*)<\/p>/)).match(/a regulação brasileira estabelece um fator de potência mínimo de referência de 0,92[^.]*\./)[0], origem: { seletor: 'h3(7.4) ~ p:nth-of-type(2)', trecho_inicial: 'Para combater isso', linha_aprox: 1986 } },
    leitura_b: { texto: semaforo.map((r) => r.linha_literal).join(' | '), origem: { seletor: 'script render()', trecho_inicial: 'if (fp >= 0.92)', linha_aprox: 2920, linha_fim_aprox: 2922 }, argumento: 'O limiar 0,85 do ramo "gold" não é nomeado na prosa de 7.4 (só aparece como exemplo em 7.3). Nenhum texto de veredito acompanha as cores.' },
    decisao: 'não escolhida — a fonte não declara procedência do 0,85 como limiar.',
  },
  {
    id: 'DIV-03', tipo: 'fonte_formulacao_variavel',
    o_que: 'O 0,92 é chamado de "mínimo de referência" da regulação em 7.4 e de "referência prática" no gabarito do Ex·05.',
    leitura_a: { texto: 'a regulação brasileira estabelece um fator de potência mínimo de referência de 0,92 para unidades do Grupo A', origem: { seletor: 'h3(7.4) ~ p', trecho_inicial: 'Para combater isso', linha_aprox: 1986 } },
    leitura_b: { texto: 'Está abaixo da referência prática de 0,92 para Grupo A', origem: { seletor: '§ Drill Ex · 05 > .exercise-answer', trecho_inicial: 'FP: 900 ÷ 1.000', linha_aprox: 2432 }, argumento: 'O quiz Q06 (L3113) diz "mínimo de referência regulatória"; o léxico usa "Referência prática regulatória brasileira" (L2584-2585).' },
    decisao: 'não escolhida — mesmo valor, três formulações do estatuto.',
  },
  {
    id: 'DIV-04', tipo: 'fonte_campos_gemeos_divergentes',
    o_que: 'Faixas do campo numérico e do deslizador gêmeos do INST·05 (Q07 do DECIDIR).',
    leitura_a: { texto: campos.map((c) => c.numero.linha_literal).join(' | '), origem: { seletor: 'input[type=number]', trecho_inicial: '<input type="number"', linha_aprox: 1960, linha_fim_aprox: 1965 } },
    leitura_b: { texto: campos.map((c) => c.deslizador.linha_literal).join(' | '), origem: { seletor: 'input[type=range]', trecho_inicial: '<input type="range"', linha_aprox: 1961, linha_fim_aprox: 1966 }, argumento: 'syncInputRange copia input.value → range.value e vice-versa (linhas 2925-2930); um valor digitado abaixo do min do deslizador (kW < 100) é clampado pelo range, mas render() lê o valor do campo numérico.' },
    decisao: 'não escolhida — as duas faixas coexistem na fonte.',
  },
  {
    id: 'DIV-05', tipo: 'fonte_geometria_x_leitura',
    o_que: 'O desenho do triângulo e a leitura de φ usam escalas diferentes nos dois eixos.',
    leitura_a: { texto: `${sl(2890)} | ${sl(2891)}`, origem: { seletor: 'script render()', trecho_inicial: 'const kwPx', linha_aprox: 2890, linha_fim_aprox: 2891 }, argumento: 'kW: 200 px para 1500 kW; kVAr: 170 px (0,85 × 200) para 1200 kVAr.' },
    leitura_b: { texto: `${sl(2887)} | ${sl(2918)}`, origem: { seletor: 'script render()', trecho_inicial: 'const angleRad', linha_aprox: 2887, linha_fim_aprox: 2918 }, argumento: 'O ângulo exibido é atan2(kVAr, kW) sobre os valores, não sobre os pixels.' },
    derivado: { rotulo: 'DERIVADO (execução da lógica do script no cenário-padrão; NÃO está na fonte)', angulo_lido_graus: def.angleDeg, angulo_desenhado_graus: anguloDesenhado, kwPx, kvarPx },
    estado_pre_script: { rotulo: 'Geometria estática da marcação (antes de render() rodar no carregamento)', tri_kw: svgEstatico['tri-kw'], tri_kvar: svgEstatico['tri-kvar'], tri_kva: svgEstatico['tri-kva'] },
    decisao: 'não escolhida — registrado para quem desenhar a figura (C6); a fonte não declara qual escala vale.',
  },
];

const out = {
  meta: {
    grupo: 'aula07', modulo: 'M01', aula: 'M01·A07', fonte: SRC, fonte_somente_leitura: true, fonte_total_linhas: TOTAL,
    aula_linhas: { inicio: 1898, fim: S1, nota: `comentário de abertura 1898; section.aula ${S0}-${S1}` },
    extraido_em: new Date().toISOString().slice(0, 10),
    metodo: 'Extração programática (script node que caminha as linhas da section e lança erro diante de qualquer linha não reconhecida; nenhuma prosa digitada). Campos `html` guardam o innerHTML literal; campos `texto` são o mesmo conteúdo com tags removidas e entidades decodificadas.',
    protocolo: 'docs/alexandria/extraction-protocol.md', taxonomia: 'docs/alexandria/instrument-taxonomy.md',
    contrato: 'docs/alexandria-v2/bar.md (§4 Peça C, §9, P3, P5, P6, P8, P9, P11, P14)',
    convencoes: {
      ausencia: 'null + campo *_nota explicando o que foi medido',
      ids: 'm01-a07-bNN-<tipo> para blocos (ordem da fonte); m01-inst-05; m01-ex-05; m01-a07-fig-01; m01-quiz-q06/q07',
      vinculos: 'só quando a fonte declara (tag, posição dentro da section, remissão textual literal); correspondência textual é marcada como tal',
      derivados: 'chaves `derivado` / `estado_pre_script` / `*_nota` / `argumento` / `decisao` são comentário do extrator, fora da prova literal',
    },
  },
  aula: {
    id: AULA_ID, numero: 7,
    marcador: { num: markerNum, nome: markerNome, origem: origem(1902, 'div.aula-marker', `${markerNum} ${markerNome}`) },
    titulo_h2_html: h2, titulo_h2_texto: strip(h2), titulo_h2_origem: origem(1903, 'h2.aula-title', h2),
    pergunta_mapa: { numero: strip(mapaCells[0]), tema: strip(mapaCells[1]), pergunta_html: mapaCells[2], pergunta_texto: strip(mapaCells[2]), origem: origem(1345, '§ MAP table > tbody > tr(07)', mapaCells[2]), nota: 'Única pergunta que a fonte declara para esta aula. Vive na tabela do § MAP, não na aula.' },
    duracao_min: null, dificuldade: null, video: null,
    ausencias_nota: `Sem duração, dificuldade, vídeo, <img>, referência por aula ou "Vale lembrar" dentro da section. Medido na fatia ${S0}-${S1}: <img> = ${(aulaHtml.match(/<img\b/g) || []).length}, <video>/<iframe> = ${(aulaHtml.match(/<(video|iframe)\b/g) || []).length}, "Vale lembrar" = ${(aulaHtml.match(/Vale lembrar/g) || []).length}.`,
  },
  blocos, figuras,
  tabelas: [], tabelas_nota: 'Nenhum <table> dentro da section da Aula 07 (medido: ' + (aulaHtml.match(/<table\b/g) || []).length + '). A única tabela que menciona a aula é a do § MAP (linha 1345), em aula.pergunta_mapa.',
  listas: [], listas_nota: 'Nenhum <ul>/<ol> dentro da section da Aula 07 (medido: ' + (aulaHtml.match(/<(ul|ol)\b/g) || []).length + ').',
  destaques: bl('destaque').map((b) => b.id),
  vale_lembrar: null, vale_lembrar_nota: 'A expressão "Vale lembrar" não ocorre no HTML do M01. Os destaques da aula são 2 callouts (um neutro, um red).',
  termos_lexico: {
    vinculo_declarado_pela_fonte: false,
    nota: 'O glossário da fonte (§ Lex, linhas ~2520-2690) não declara aula por termo. Abaixo: verbetes cujo nome-base, variante por "/" ou abreviação entre parênteses ocorre como palavra no texto da section (incluindo figura e instrumento). Correspondência textual, não posse — ler ocorrencias_contexto antes de ligar (§2 do protocolo).',
    total_verbetes_fonte: gloss.length, candidatos: termos,
  },
  instrumentos: [instrumento],
  invocacoes_no_texto: [
    { id: `${AULA_ID}-inv-01`, alvo: FIG_ID, tipo: 'invocacao_da_figura', texto: strip(inner(1915, /<p>(.*)<\/p>/)), bloco: blocos.find((b) => b.origem.linha_aprox === 1915).id, origem: { seletor: 'h3(7.2) ~ p', trecho_inicial: 'As três potências formam', linha_aprox: 1915 }, posicao_figura: `imediatamente depois deste parágrafo (linhas ${figBounds.ini}-${figBounds.fim}), seguida do INST·05 (linhas ${instrBounds.comentario}-${I1}) e do h3 7.3` },
    { id: `${AULA_ID}-inv-02`, alvo: INST_ID, tipo: 'instrucao_do_instrumento', texto: strip(noteHtml).match(/^Reduza a potência reativa e veja o fator de potência subir\./)[0], bloco: null, origem: { seletor: 'div.instrument-note', trecho_inicial: 'Reduza a potência reativa', linha_aprox: 1970 }, posicao_instrumento: 'A prosa da aula NÃO invoca o instrumento por nome ("abaixo", "use"): o parágrafo de 7.2 termina em dois-pontos e o div.triangle-vis + div.instrument seguem. A instrução está dentro do próprio instrumento.' },
  ],
  remissoes_de_outras_partes: remissoes,
  exercicios, exercicios_varredura: { tags_com_Aula_07: vinculados_varredura, campos_varridos: 'tag, enunciado e gabarito de todos os div.exercise (protocolo §4)' },
  relacionados_nao_vinculados: relacionados,
  criterio_quiz_fonte: { texto: quizCrit, origem: { seletor: '§ Quiz > p', trecho_inicial: quizCrit.slice(0, 60), linha_aprox: 2474 } },
  cobertura_texto_por_token: { ...cobertura, nota: 'Denominador = texto da section (1900-2001) sem o comentário e o div.instrument do INST·05, §5; tokens por palavra com baixa (cada palavra da fonte consome uma do extraído). Tags viram espaço nos dois lados, o que elimina o artefato de spans vizinhos colados visto na A08.' },
  divergencias, comparacao_codigo,
  contagens: {
    blocos: blocos.length,
    blocos_por_tipo: blocos.reduce((a, b) => ((a[b.tipo] = (a[b.tipo] || 0) + 1), a), {}),
    secoes_numeradas: bl('titulo').map((b) => b.numero),
    figuras: figuras.length, elementos_svg: elementosSvg.length, leituras_figura: readouts.length,
    tabelas: 0, listas: 0, destaques: bl('destaque').length, vale_lembrar: 0,
    instrumentos: 1, entradas_instrumento: campos.length, saidas_numericas_instrumento: 0, ramos_semaforo_script: semaforo.length,
    linhas_script: scriptLinhas.length,
    exercicios_vinculados: exercicios.length, relacionados_nao_vinculados: relacionados.length,
    remissoes_de_outras_partes: remissoes.length,
    termos_lexico_candidatos: termos.length, verbetes_lexico_modulo: gloss.length,
    divergencias_fonte: divergencias.length, divergencias_codigo: comparacao_codigo.divergencias.length,
  },
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ blocos: blocos.length, tipos: out.contagens.blocos_por_tipo, svg: elementosSvg.length, readouts: readouts.length, termos: termos.map((t) => [t.termo, t.achados.map((a) => a.variante + ':' + a.n_ocorrencias).join(',')]), cobertura: { ...cobertura, tokens_nao_casados: faltando }, def: def.leituras, ramo: def.ramo, angLido: def.angleDeg, angDes: anguloDesenhado, naoVerb, gloss: gloss.length, glossCod: glossCod.length, remissoes: remissoes.length, checksResumo: { orfaos: checks.span_orfao_no_corpo, ver: checks.vereditos_calc_na_fonte, comAula, sem: checks.glossario.ligados_no_codigo_sem_ocorrencia_textual, sem2: checks.glossario.ocorrencia_textual_sem_ligacao_no_codigo } }, null, 1));
