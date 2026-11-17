import fs from 'node:fs';
// Extrator dos 11 instrumentos do M10 → instrumentos.json.
// Markup lido da árvore; dados e lógica lidos do <script> original por
// avaliação de literal; cenário-padrão e varredura medidos EXECUTANDO o
// script original em DOM simulado (shim.mjs) e comparando com a porta em
// src/lib/data (só leitura). Nenhum texto de conteúdo digitado.
import {
  doc, html, FONTE, SCRIPT, SCRIPT_START, lineOf, texto, inline, frag, ini, origem,
  find, findAll, byClass, byTag, classes, hasClass, inner, secoes, literal, writeJSON, collapse, decode,
} from './lib.mjs';
import { runtime } from './shim.mjs';
import { C10, CALC } from './code.mjs';

// ---------------------------------------------------------------- config (harness)
const CFG = {
  1: { dados: [['LENTE', 'var LENTE=', 'MODULO_10_LENTES'], ['LINHAS', 'var LINHAS=', 'MODULO_10_LINHAS_FATURA']], chips: { grid: 'mf-grid', de: 'LINHAS', rotulo: 'n', tag: 'c' }, paineis: ['mf-lens', 'mf-line'], mencoes: [/instrumento abaixo lista/i, /mapa da fatura/i, /O que o mapa já demonstra/i, /ao alternar as lentes/i] },
  2: { dados: [['PERFIL', 'var PERFIL=', 'MODULO_10_PERFIS_CARGA'], ['ELEG', 'var ELEG=', 'MODULO_10_ELEGIBILIDADE'], ['SGNOME', 'var SGNOME=', 'MODULO_10_SUBGRUPOS'], ['CEL', 'var CEL=', 'MODULO_10_CELULAS_MODALIDADE']], vd: 'cm-vd', out: 'cm-out', mencoes: [/comparador de modalidades/i, /comparador desta aula/i] },
  3: { dados: [['FAIXA', 'var FAIXA=', 'MODULO_10_FAIXAS_DEMANDA']], vd: 'dd-vd', out: 'dd-out', mencoes: [/dimensionador de demanda/i] },
  4: { dados: [['FAIXA', 'var FAIXA=', 'MODULO_10_FAIXAS_ULTRAPASSAGEM']], vd: 'ul-vd', out: 'ul-out', mencoes: [/simulador de ultrapassagem/i, /entra nos instrumentos deste módulo como/i] },
  5: { dados: [['FAIXA', 'var FAIXA=', 'MODULO_10_FAIXAS_DESLOCAMENTO']], vd: 'dl-vd', out: 'dl-out', extra: ['dl-bars'], mencoes: [/deslocador de carga/i, /instrumento correto para\s+avaliar deslocamento/i] },
  6: { dados: [['FAIXA', 'var FAIXA=', 'MODULO_10_FAIXAS_REATIVO']], vd: 'fp-vdt', out: 'fp-out', mencoes: [/apurador de excedente reativo/i, /instrumento de reativo/i] },
  7: { dados: [['ENC', 'var ENC=', 'MODULO_10_ENCARGOS']], chips: { grid: 'en-grid', de: 'ENC', rotulo: 'n', tag: 'tag' }, paineis: ['en-panel'], mencoes: [/anatomia dos encargos/i] },
  8: { dados: [['ET', 'var ET=', 'MODULO_10_ETAPAS_CICLO']], chips: { grid: 'rc-grid', de: 'ET', rotulo: 'n', tag: 'et' }, vd: 'rc-vd', paineis: ['rc-panel'], mencoes: [/régua do ciclo/i] },
  9: { dados: [['NOMES', 'var NOMES=', 'MODULO_10_BLOCOS_FATURA'], ['DIAG', 'var DIAG=', 'MODULO_10_VIESES_COMPOSICAO']], vd: 'rb-vd', out: 'rb-out', extra: ['rb-rows'], mencoes: [/reconstrutor de fatura/i, /este módulo transforma em instrumento/i] },
  10: { dados: [['PASSOS', 'var PASSOS=', 'MODULO_10_PASSOS_LEITURA']], chips: { grid: 'ol-grid', de: 'PASSOS', rotulo: 'n', tag: null }, vd: 'ol-vd', paineis: ['ol-panel'], mencoes: [/ordem de leitura cronometrada/i] },
  11: { dados: [['ACHADO', 'var ACHADO=', 'MODULO_10_ACHADOS']], vd: 'rt-vd', out: 'rt-out', mencoes: [/roteador de diagnóstico/i, /veredito do roteador/i] },
};

const CODE_AULA = {};
for (const a of C10.MODULO_10_AULAS) for (const ins of a.instruments) CODE_AULA[ins.id] = a.id;
const CODE_INST = Object.fromEntries(C10.INSTRUMENTOS_MODULO_10.map((x) => [x.id, x]));

// ---------------------------------------------------------------- helpers
const nid = (n) => `m10-inst-${String(n).padStart(2, '0')}`;

function deepDiff(a, b, path = '', out = []) {
  if (typeof a === 'number' && typeof b === 'number') { if (a !== b && !(a >= 1e9 && b >= 1e9)) out.push({ caminho: path, fonte: a, codigo: b }); return out; }
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b) || a === null || b === null) {
    if (a !== b) out.push({ caminho: path, fonte: a === undefined ? '(ausente)' : a, codigo: b === undefined ? '(ausente)' : b });
    return out;
  }
  if (typeof a === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) deepDiff(a[k], b[k], path ? `${path}.${k}` : k, out);
    return out;
  }
  if (a !== b) out.push({ caminho: path, fonte: a, codigo: b });
  return out;
}

const leafText = (s) => collapse(decode(String(s).replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ')));
// folhas de texto de um fragmento HTML do script: cada div/span sem filho-elemento de bloco
function leaves(h) {
  const out = [];
  const re = /<span class="ok2">([\s\S]*?)<\/span>([\s\S]*?)<\/div>/g;
  let m;
  const rest = h.replace(re, (_, lab, body) => { out.push(leafText(lab)); out.push(leafText(body)); return ' '; });
  for (const m2 of rest.matchAll(/<div class="(?:yr|ti|bd2|lg)"[^>]*>([\s\S]*?)<\/div>/g)) out.push(leafText(m2[1]));
  for (const m3 of rest.matchAll(/<span class="(?:lb|vl|err-nm|err-v[^"]*)"[^>]*>([\s\S]*?)<\/span>/g)) out.push(leafText(m3[1]));
  return out.filter(Boolean);
}
function verdictLeaves(h) {
  // o veredito é prosa corrida com <b>; vale como uma folha
  return h ? [leafText(h)] : [];
}

function compareText(srcLeaves, codeHtml) {
  const code = leafText(codeHtml);
  const faltando = srcLeaves.filter((l) => l && !code.includes(l));
  let resid = code;
  for (const l of [...new Set(srcLeaves)].sort((x, y) => y.length - x.length)) if (l) resid = resid.split(l).join(' ¦ ');
  const residuo = resid.split('¦').map((x) => x.replace(/^[\s.:·—-]+|[\s.:·—-]+$/g, '').trim()).filter((x) => x && /[A-Za-zÀ-ú]{3}/.test(x));
  return { faltando, residuo };
}

// número pt-BR de um texto de readout
function numPt(t) {
  const m = /[−+-]?\d[\d.]*(,\d+)?/.exec(t);
  if (!m) return null;
  const s = m[0].replace('−', '-').replace(/\./g, '').replace(',', '.');
  const dec = m[1] ? m[1].length - 1 : 0;
  return { v: parseFloat(s), dec };
}

function seeded(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// ---------------------------------------------------------------- markup
const secs = secoes();
const instNodes = findAll(doc, (n) => n.tag === 'div' && classes(n).length === 1 && hasClass(n, 'inst'));
if (instNodes.length !== 11) throw new Error('esperava 11 div.inst, achou ' + instNodes.length);

function secaoDe(node) {
  return secs.find((s) => s.node.start <= node.start && s.node.end >= node.end);
}

function entradasMarkup(bd) {
  const out = [];
  let pendingSegLb = null;
  let subtitulo = null;
  for (const c of bd.children) {
    if (hasClass(c, 'seg-lb')) { pendingSegLb = c; continue; }
    if (c.tag === 'h4') { subtitulo = { texto: texto(inner(c)), linha_aprox: lineOf(c.start) }; continue; }
    if (hasClass(c, 'seg')) {
      const btns = c.children.filter((b) => b.tag === 'button');
      const attr = Object.keys(btns[0].attrs).find((k) => k.startsWith('data-'));
      out.push({
        dom_id: c.attrs.id, tipo: 'segmentado (seleção única)', rotulo: pendingSegLb ? texto(inner(pendingSegLb)) : null,
        unidade: null, faixa: null, atributo: attr,
        opcoes: btns.map((b) => ({ valor: b.attrs[attr], rotulo: texto(inner(b)), padrao: hasClass(b, 'on') })),
        padrao: (btns.find((b) => hasClass(b, 'on')) || {}).attrs?.[attr] ?? null,
        origem: origem(`#${c.attrs.id}`, c, pendingSegLb ? inner(pendingSegLb) : ''),
      });
      pendingSegLb = null;
      continue;
    }
    if (hasClass(c, 'tr-grid')) {
      out.push({ dom_id: c.attrs.id, tipo: 'grade de chips gerada pelo script', rotulo: pendingSegLb ? texto(inner(pendingSegLb)) : null, origem: origem(`#${c.attrs.id}`, c, pendingSegLb ? inner(pendingSegLb) : '') });
      pendingSegLb = null;
      continue;
    }
    if (hasClass(c, 'field-grid')) {
      for (const f of c.children.filter((x) => hasClass(x, 'field'))) {
        const lab = find(f, byClass('field-label'));
        const spans = lab.children.filter((x) => x.tag === 'span');
        const ins = findAll(f, byTag('input'));
        const num = ins.find((x) => x.attrs.type === 'number');
        const rng = ins.find((x) => x.attrs.type === 'range');
        const A = (x) => x ? { id: x.attrs.id, value: x.attrs.value, min: x.attrs.min, max: x.attrs.max, step: x.attrs.step } : null;
        const faixaIgual = num && rng && ['value', 'min', 'max', 'step'].every((k) => num.attrs[k] === rng.attrs[k]);
        out.push({
          dom_id: num.attrs.id, tipo: rng ? 'número + deslizador gêmeo' : 'número', grupo: subtitulo ? subtitulo.texto : null,
          rotulo: texto(inner(spans[0])), unidade: spans[1] ? texto(inner(spans[1])) : null,
          faixa: { min: Number(num.attrs.min), max: Number(num.attrs.max), passo: Number(num.attrs.step) },
          padrao: Number(num.attrs.value),
          atributos_literais: { numero: A(num), deslizador: A(rng) },
          deslizador_com_mesma_faixa: rng ? faixaIgual : null,
          origem: origem(`.field #${num.attrs.id}`, f, inner(spans[0])),
        });
      }
    }
  }
  return { entradas: out, subtitulo };
}

function saidasMarkup(bd) {
  return findAll(bd, byClass('ro')).map((ro) => {
    const k = find(ro, byClass('k'));
    const n = find(ro, byClass('n'));
    const id = n.attrs.id;
    const re = new RegExp(`\\$id\\('${id}'\\)\\.textContent=([^;]*);`);
    const m = re.exec(SCRIPT);
    return {
      dom_id: id, rotulo: texto(inner(k)), classe_visual: classes(n).filter((x) => x !== 'n').join(' ') || null,
      texto_inicial_markup: texto(inner(n)),
      expressao_exata: m ? m[0] : null,
      expressao_linha: m ? lineOf(SCRIPT_START + m.index) : null,
      origem: origem(`.readout #${id}`, ro, inner(k)),
    };
  });
}

// Lógica literal: o bloco do IIFE com os literais de dados elididos.
function logica(num) {
  const head = `/* ===================== INST·${String(num).padStart(2, '0')}`;
  const a = SCRIPT.indexOf(head);
  const b = SCRIPT.indexOf('/* =====================', a + head.length);
  let bloco = SCRIPT.slice(a, b).replace(/\s+$/, '');
  const elididos = [];
  for (const [nome, marcador] of CFG[num].dados) {
    const L = literal(marcador, a);
    bloco = bloco.replace(L.text, `/* ${nome}: literal elidido, ver dados_do_script.${nome} (L${L.linha}–${L.linha_fim}) */`);
    elididos.push(nome);
  }
  return { codigo: bloco, linha: lineOf(SCRIPT_START + a), linha_fim: lineOf(SCRIPT_START + b) - 1, literais_elididos: elididos };
}

// Frases literais da fonte (sentença inteira que contém a âncora).
const BODY_START = html.indexOf('<body>');
function frase(ancora, desde = BODY_START) {
  const rx = new RegExp(ancora.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+'), 'g');
  rx.lastIndex = desde;
  const mm = rx.exec(html);
  if (!mm) throw new Error('âncora não achada: ' + ancora);
  const i = mm.index;
  // bloco que contém a âncora
  const blk = findAll(doc, (n) => (['p', 'li', 'td'].includes(n.tag) || hasClass(n, 'srcnote') || hasClass(n, 'lv-pane')) && n.innerStart <= i && n.innerEnd >= i).pop();
  const t = texto(inner(blk));
  const at = t.indexOf(texto(ancora));
  const ini0 = Math.max(t.lastIndexOf('. ', at) + 2, 0);
  let fim = t.indexOf('. ', at); fim = fim < 0 ? t.length : fim + 1;
  return { texto: t.slice(ini0 === 1 ? 0 : ini0, fim), origem: { seletor: blk.tag, trecho_inicial: ini(inner(blk)), linha_aprox: lineOf(blk.start) } };
}

const FONTE_NUM = {
  1: { nota: 'Instrumento de consulta; sem número de entrada. As afirmações por linha citam o mecanismo, não uma fonte externa específica por item.', frases: ['A nomenclatura de cada linha varia por'] },
  2: { nota: 'A elegibilidade (ELEG) coincide com a tabela 02.1, cuja nota de fonte é literal abaixo. As células CEL não citam fonte.', frases: ['ANEEL, página oficial de Modalidades Tarifárias, e', 'lista, para o grupo A, exatamente'] },
  3: { nota: 'Contrato 1.200 kW, medida 1.010 kW, média 720 kW e 12 meses são valores iniciais sem fonte declarada. A tolerância de 5% é declarada como referência geral, a confirmar. Os limites das faixas (60/80/95/105) não têm fonte declarada.', frases: ['A tolerância vem', 'A referência geral para demanda contratada de consumo do grupo A é de cinco por'] },
  4: { nota: 'A tarifa 40 é declarada genérica (unidades monetárias genéricas). O multiplicador 2 é declarado como valor inicial conforme a leitura da REN 1.000/2021, art. 301, com divergência ativa registrada pela própria fonte. Contrato 1.000 / medida 1.060 coincidem com o exemplo do texto 03.3 ("mil quilowatts com medição de mil e sessenta"). Os cortes 2% e 15% da escolha de faixa não têm fonte.', frases: ['A tarifa é entrada editável em unidades monetárias', 'com valor', 'Um contrato de mil quilowatts com medição de mil e sessenta'] },
  5: { nota: 'Horas de ponta 63 = três horas × vinte e um dias úteis, declarado no aviso. Consumo 420 / ponta 42 / 30% deslocável sem fonte. Cortes das faixas (4/10/18%) sem fonte.', frases: ['o valor inicial supõe'] },
  6: { nota: 'Referência 0,92 declarada com artigo (REN 1.000/2021, art. 302). Janela noturna de 6 h declarada na prosa da Aula 05 (período de seis horas consecutivas entre 23h30 e 6h30). O ciclo de 30 dias é suposição declarada no aviso. O corte de 25% (estrutural × pontual) não tem fonte.', frases: ['Fator de potência de referência de 0,92 para o grupo A', 'restrita a um período de seis horas', 'supõem apuração'] },
  7: { nota: 'Os textos citam as normas dentro de cada item (Lei nº 15.269/2025, Lei nº 15.235/2025, REN ANEEL nº 1.147/2025, § 19 do art. 13 da Lei nº 10.438/2002). Data de verificação: 1º de agosto de 2026.', frases: ['Data de consulta das verificações'] },
  8: { nota: 'Sem número de entrada. O limiar de estados (0/4/8) não tem fonte.', frases: ['A cadência da revisão periódica é definida no contrato'] },
  9: { nota: 'Os valores iniciais (estimativa 30/25/15/10/18/2; real 26/22/21/9/19/3) são declarados como não típicos e sem fonte. Os cortes 6 p.p., 12 e 28 p.p. e 2 p.p. (somas) não têm fonte.', frases: ['não existe composição típica nacional, e os valores iniciais servem apenas'] },
  10: { nota: 'Os tempos por passo (20/15/40/20/30/25/60/30/40 s, soma 280 s) são declarados orientativos. O envelope de cinco minutos vem do critério de domínio (§00.3).', frases: ['Os tempos são orientativos', 'O tempo indicado é orientativo'] },
  11: { nota: 'A pontuação (3/1, 3/1, 2/1) e os cortes (≥6, ≤1) não têm fonte declarada.', frases: [] },
};

// ---------------------------------------------------------------- varreduras
function sweep(num) {
  const cases = [];
  const R = seeded(1000 + num);
  const pick = (arr) => arr[Math.floor(R() * arr.length)];
  if (num === 1) {
    cases.push({ src: {}, code: { 'mf-seg': 'unit' }, nota: 'estado inicial (nenhuma linha escolhida)' });
    for (const l of ['unit', 'qtd', 'ciclo']) for (const L of C10.MODULO_10_LINHAS_FATURA) cases.push({ src: { seg: [['mf-seg', 'data-l', l]], chip: [['mf-grid', L.id]] }, code: { 'mf-seg': l, 'mf-linha': L.id } });
  }
  if (num === 2) for (const p of ['plana', 'diurna', 'pontabaixa', 'erratica', 'sazonal']) for (const m of ['azul', 'verde', 'conv']) for (const s of ['a4', 'a3a', 'a3', 'a2']) cases.push({ src: { seg: [['cm-perf', 'data-p', p], ['cm-mod', 'data-m', m], ['cm-sg', 'data-s', s]] }, code: { 'cm-perf': p, 'cm-mod': m, 'cm-sg': s } });
  const grid = (spec) => {
    const keys = Object.keys(spec);
    const rec = (i, acc) => { if (i === keys.length) { cases.push({ src: { num: { ...acc } }, code: { ...acc } }); return; } for (const v of spec[keys[i]]) rec(i + 1, { ...acc, [keys[i]]: v }); };
    rec(0, {});
  };
  if (num === 3) grid({ 'dd-ctr': [10, 500, 1000, 1200, 20000], 'dd-max': [10, 300, 900, 1010, 1100, 1300, 20000], 'dd-med': [1, 720], 'dd-mes': [1, 3, 6, 11, 12, 36], 'dd-tol': [0, 5, 20] });
  if (num === 4) grid({ 'ul-ctr': [10, 1000, 20000], 'ul-med': [10, 900, 1000, 1030, 1049, 1050, 1051, 1060, 1150, 1200, 20000], 'ul-tol': [0, 5, 20], 'ul-mul': [1, 2, 4], 'ul-tar': [1, 40, 300] });
  if (num === 5) grid({ 'dl-tot': [1, 100, 420, 20000], 'dl-pta': [0, 4, 10, 42, 60, 100, 500, 20000], 'dl-des': [0, 30, 100], 'dl-hrs': [1, 63, 200] });
  if (num === 6) grid({ 'fp-hrs': [1, 6, 10], 'fp-ref': [0.5, 0.92, 1], 'fp-ind': [0.3, 0.87, 0.92, 1], 'fp-cap': [0.3, 0.95, 1], 'fp-vd1': [0, 10, 100, 180, 600], 'fp-vn1': [0, 5, 200] });
  if (num === 7) {
    cases.push({ src: {}, code: {}, nota: 'estado inicial (nenhum item escolhido)' });
    for (const E of C10.MODULO_10_ENCARGOS) cases.push({ src: { chip: [['en-grid', E.id]] }, code: { 'en-sel': E.id } });
  }
  if (num === 8 || num === 10) {
    const arr = num === 8 ? C10.MODULO_10_ETAPAS_CICLO : C10.MODULO_10_PASSOS_LEITURA;
    const gridId = num === 8 ? 'rc-grid' : 'ol-grid';
    const selK = num === 8 ? 'rc-sel' : 'ol-sel';
    const markK = (id) => (num === 8 ? `rc-v-${id}` : `ol-f-${id}`);
    cases.push({ src: {}, code: {}, nota: 'estado inicial (nenhuma etapa/passo escolhido nem marcado)' });
    for (let n = 0; n <= arr.length; n++) for (const alvo of arr) {
      const marcados = arr.slice(0, n).map((x) => x.id);
      const code = { [selK]: alvo.id };
      for (const x of arr) code[markK(x.id)] = marcados.includes(x.id) ? 'sim' : 'nao';
      cases.push({ src: { marcar: [gridId, marcados], alvo: [gridId, alvo.id] }, code });
    }
  }
  if (num === 9) {
    const base = { 'rb-e1': 30, 'rb-e2': 25, 'rb-e3': 15, 'rb-e4': 10, 'rb-e5': 18, 'rb-e6': 2, 'rb-r1': 26, 'rb-r2': 22, 'rb-r3': 21, 'rb-r4': 9, 'rb-r5': 19, 'rb-r6': 3 };
    cases.push({ src: { num: base }, code: base });
    for (let t = 0; t < 400; t++) {
      const v = {};
      for (let k = 1; k <= 6; k++) { v[`rb-e${k}`] = Math.floor(R() * 40); v[`rb-r${k}`] = Math.floor(R() * 40); }
      cases.push({ src: { num: v }, code: v });
    }
    for (let k = 1; k <= 6; k++) for (const d of [-12, -6, -5, 5, 6, 12]) { const v = { ...base }; v[`rb-e${k}`] = Math.max(0, base[`rb-r${k}`] + d); cases.push({ src: { num: v }, code: v }); }
  }
  if (num === 11) for (const h of ['uma', 'seis', 'doze']) for (const m of ['nao', 'parcial', 'sim']) for (const p of ['nao', 'estavel', 'mudanca']) for (const a of ['enq', 'dem', 'fp', 'amb', 'nada']) cases.push({ src: { seg: [['rt-hist', 'data-h', h], ['rt-mm', 'data-m', m], ['rt-plano', 'data-p', p], ['rt-ach', 'data-a', a]] }, code: { 'rt-hist': h, 'rt-mm': m, 'rt-plano': p, 'rt-ach': a } });
  void pick;
  return cases;
}

function runSource(num, cs, saidas) {
  const r = runtime();
  if (cs.src.num) for (const [k, v] of Object.entries(cs.src.num)) r.set(k, String(v));
  for (const [id, attr, val] of cs.src.seg || []) r.seg(id, attr, val);
  for (const [g, k] of cs.src.chip || []) r.chip(g, k);
  if (cs.src.marcar) { const [g, ks] = cs.src.marcar; for (const k of ks) { r.chip(g, k); r.chip(g, k); } }
  if (cs.src.alvo) {
    const [g, k] = cs.src.alvo;
    const panelId = CFG[num].paineis[0];
    const cur = /<div class="ti">([\s\S]*?)<\/div>/.exec(r.htmlOf(panelId));
    const arr = num === 8 ? C10.MODULO_10_ETAPAS_CICLO : C10.MODULO_10_PASSOS_LEITURA;
    const alvoN = arr.find((x) => x.id === k).n;
    const selAtual = cs.src.marcar[1].length ? cs.src.marcar[1][cs.src.marcar[1].length - 1] : null;
    if (selAtual !== k) r.chip(g, k);
    void cur; void alvoN;
  }
  const C = CFG[num];
  const out = { saidas: {}, veredito: C.vd ? r.htmlOf(C.vd) : null, classe: C.vd ? r.cls(C.vd) : null, cartoes: C.out ? r.htmlOf(C.out) : null, paineis: {}, extra: {} };
  for (const s of saidas) out.saidas[s.dom_id] = r.text(s.dom_id);
  for (const p of C.paineis || []) out.paineis[p] = r.htmlOf(p);
  for (const e of C.extra || []) out.extra[e] = r.htmlOf(e);
  return out;
}

// ---------------------------------------------------------------- montagem
const instrumentos = [];
const statusResumo = {};

for (const node of instNodes) {
  const idN = find(node, byClass('id'));
  const nm = find(node, byClass('nm'));
  const ref = texto(inner(idN));
  const num = Number(/(\d+)/.exec(ref)[1]);
  const id = nid(num);
  const sec = secaoDe(node);
  const bd = find(node, byClass('inst-bd'));
  const intro = find(bd, byClass('inst-intro'));
  const disc = find(bd, byClass('disc'));
  const { entradas } = entradasMarkup(bd);
  const saidas = saidasMarkup(bd);
  const cfg = CFG[num];

  // dados do script
  const headOff = SCRIPT.indexOf(`/* ===================== INST·${String(num).padStart(2, '0')}`);
  const dados = {};
  for (const [nome, marcador] of cfg.dados) {
    const L = literal(marcador, headOff);
    dados[nome] = { linha: L.linha, linha_fim: L.linha_fim, valor: L.value };
  }
  // grade de chips: opções vindas do script
  for (const e of entradas) {
    if (e.tipo === 'grade de chips gerada pelo script' && cfg.chips) {
      const arr = dados[cfg.chips.de].valor;
      e.opcoes = arr.map((x, i) => ({ valor: x.id, rotulo: x[cfg.chips.rotulo], ...(cfg.chips.tag ? { etiqueta: x[cfg.chips.tag] } : {}), ...(x.t != null ? { segundos: x.t } : {}) }));
      e.padrao = null;
      e.nota = num === 8 || num === 10
        ? 'Nenhum chip selecionado no carregamento (sel=null). Primeiro clique seleciona; clique repetido no chip já selecionado alterna a marcação (verificada/executado).'
        : 'Nenhum chip selecionado no carregamento (sel=null); o painel mostra o texto inicial.';
      e.origem_opcoes = { seletor: `<script> ${cfg.chips.de}`, trecho_inicial: `var ${cfg.chips.de}=[`, linha_aprox: dados[cfg.chips.de].linha };
    }
  }

  // estado inicial / cenário-padrão (execução do original)
  const padrao = runSource(num, { src: {} }, saidas);

  // invocação no texto
  const pai = node.parent;
  const idx = pai.children.indexOf(node);
  const antes = pai.children[idx - 1];
  const depois = pai.children[idx + 1];
  const descr = (n) => n ? { elemento: `${n.tag}${classes(n).length ? '.' + classes(n).join('.') : ''}`, texto_inicial: ini(inner(n), 160), linha_aprox: lineOf(n.start) } : null;
  const mencoes = [];
  const bodyTexts = findAll(doc, (n) => ['p', 'li', 'td', 'span'].includes(n.tag) && !(n.start >= node.start && n.end <= node.end) && n.start > BODY_START && !findAll(n, (x) => ['p', 'li'].includes(x.tag)).length);
  for (const n of bodyTexts) {
    const t = texto(inner(n));
    for (const re of cfg.mencoes) {
      const m = re.exec(t);
      if (m && !mencoes.some((x) => x.linha_aprox === lineOf(n.start))) {
        const at = m.index;
        const s0 = Math.max(0, t.lastIndexOf('. ', at) + 2);
        let s1 = t.indexOf('. ', at); s1 = s1 < 0 ? t.length : s1 + 1;
        const s = secaoDe(n);
        mencoes.push({ secao: s ? `${s.marcador} · ${s.rotulo}` : null, frase: t.slice(s0 === 1 ? 0 : s0, s1), linha_aprox: lineOf(n.start) });
      }
    }
  }

  // fonte dos números
  const fn = FONTE_NUM[num];
  const frases = fn.frases.map((a) => frase(a));

  // ------------ comparação com o código
  const code = CODE_INST[id];
  const comp = { id_codigo: id, presente: !!code, divergencias: [] };
  if (code) {
    comp.kind_codigo = code.kind;
    comp.aula_no_codigo = CODE_AULA[id] || null;
    comp.titulo_igual = code.title === texto(inner(nm));
    if (!comp.titulo_igual) comp.divergencias.push({ tema: 'título', fonte: texto(inner(nm)), codigo: code.title });
    const aulaFonte = sec.marcador.startsWith('Aula') ? `aula-10-${sec.marcador.slice(5)}` : null;
    if (aulaFonte !== comp.aula_no_codigo) comp.divergencias.push({ tema: 'vínculo com aula', fonte: aulaFonte ?? `${sec.marcador} (fora de aula)`, codigo: comp.aula_no_codigo ?? 'nenhuma aula (só em INSTRUMENT_CALCULATORS)' });
    const noteSrc = `${texto(inner(intro))} ${texto(inner(disc))}`;
    comp.nota_igual_intro_mais_aviso = collapse(code.note) === collapse(noteSrc);
    if (!comp.nota_igual_intro_mais_aviso) comp.divergencias.push({ tema: 'nota (intro + aviso)', fonte: noteSrc, codigo: code.note, detalhe: 'O código perde o <b> do intro e deixa espaço antes da pontuação.' });
    // campos
    const campos = [];
    for (const e of entradas) {
      if (e.tipo.startsWith('número')) {
        const f = code.fields.find((x) => x.id === e.dom_id);
        if (!f) { campos.push({ campo: e.dom_id, problema: 'ausente no código' }); continue; }
        const d = [];
        if (f.label !== e.rotulo) d.push(`rótulo: fonte «${e.rotulo}» × código «${f.label}»`);
        if (f.unit !== e.unidade) d.push(`unidade: fonte «${e.unidade}» × código «${f.unit}»`);
        if (f.min !== e.faixa.min || f.max !== e.faixa.max || f.step !== e.faixa.passo) d.push(`faixa: fonte ${e.faixa.min}–${e.faixa.max}/${e.faixa.passo} × código ${f.min}–${f.max}/${f.step}`);
        if (f.defaultValue !== e.padrao) d.push(`padrão: fonte ${e.padrao} × código ${f.defaultValue}`);
        if (d.length) campos.push({ campo: e.dom_id, problema: d.join('; ') });
      } else if (e.tipo.startsWith('segmentado')) {
        const f = code.fields.find((x) => x.id === e.dom_id);
        if (!f) { campos.push({ campo: e.dom_id, problema: 'ausente no código' }); continue; }
        const d = [];
        if (f.label !== e.rotulo) d.push(`rótulo: fonte «${e.rotulo}» × código «${f.label}»`);
        if (f.defaultValue !== e.padrao) d.push(`padrão: fonte ${e.padrao} × código ${f.defaultValue}`);
        const o1 = JSON.stringify(e.opcoes.map((o) => [o.valor, o.rotulo]));
        const o2 = JSON.stringify((f.options || []).map((o) => [o.value, o.label]));
        if (o1 !== o2) d.push(`opções diferentes: fonte ${o1} × código ${o2}`);
        if (d.length) campos.push({ campo: e.dom_id, problema: d.join('; ') });
      } else {
        const CHIPF = { 1: 'mf-linha', 7: 'en-sel', 8: 'rc-sel', 10: 'ol-sel' };
        const f = code.fields.find((x) => x.id === CHIPF[num]);
        const d = [];
        if (!f) d.push('sem campo equivalente');
        else {
          d.push(`grade de chips (sem seleção inicial) virou select «${f.id}» com rótulo «${f.label}» e padrão «${f.defaultValue}»`);
          const o1 = JSON.stringify(e.opcoes.map((o) => [o.valor, o.rotulo]));
          const o2 = JSON.stringify((f.options || []).map((o) => [o.value, o.label]));
          if (o1 !== o2) d.push(`opções diferentes: fonte ${o1} × código ${o2}`);
          if (e.rotulo && f.label !== e.rotulo) d.push(`rótulo da fonte: «${e.rotulo}»`);
          if (!e.rotulo) d.push('a fonte não rotula a grade');
        }
        const marks = code.fields.filter((x) => /-(v|f)-/.test(x.id));
        if (marks.length) d.push(`a marcação por segundo clique virou ${marks.length} selects Não/Sim com rótulos compostos pelo código (ex.: «${marks[0].label}»)`);
        campos.push({ campo: e.dom_id, problema: d.join('; ') });
      }
    }
    const codeFieldIds = code.fields.map((x) => x.id);
    const extras = codeFieldIds.filter((x) => !entradas.some((e) => e.dom_id === x) && !/^(mf-linha|en-sel|rc-sel|ol-sel|rc-v-|ol-f-)/.test(x));
    for (const x of extras) campos.push({ campo: x, problema: 'campo existe só no código' });
    comp.campos = campos;
    for (const c of campos) comp.divergencias.push({ tema: `entrada ${c.campo}`, detalhe: c.problema });
    // saídas
    const outs = [];
    for (const s of saidas) {
      const o = code.outputs.find((x) => x.id === s.dom_id);
      if (!o) outs.push({ saida: s.dom_id, problema: `ausente no código (rótulo da fonte: «${s.rotulo}»)` });
      else if (o.label !== s.rotulo) outs.push({ saida: s.dom_id, problema: `rótulo: fonte «${s.rotulo}» × código «${o.label}»` });
    }
    for (const o of code.outputs) if (!saidas.some((s) => s.dom_id === o.id)) outs.push({ saida: o.id, problema: 'saída existe só no código' });
    comp.saidas = outs;
    for (const o of outs) comp.divergencias.push({ tema: `saída ${o.saida}`, detalhe: o.problema });
    if (saidas.length && code.outputs.every((o) => o.unit === null)) comp.divergencias.push({ tema: 'unidade das saídas', detalhe: `Todas as saídas no código têm unit: null; na fonte a unidade/sufixo vem da expressão (ex.: ${saidas[0].expressao_exata}).` });
    if (code.formula !== null) comp.divergencias.push({ tema: 'formula', detalhe: `código: ${code.formula}` });
    // dados
    const dd = [];
    for (const [nome, , cname] of cfg.dados) {
      const diffs = deepDiff(dados[nome].valor, C10[cname]);
      dd.push({ fonte: nome, codigo: cname, diferencas: diffs.length, exemplos: diffs.slice(0, 6) });
      if (diffs.length) comp.divergencias.push({ tema: `dados ${nome} × ${cname}`, detalhe: `${diffs.length} diferença(s)`, exemplos: diffs.slice(0, 4) });
    }
    comp.dados = dd;
    // varredura
    const cases = sweep(num);
    const calc = CALC[id];
    let numDiff = 0; const numEx = [];
    const falt = new Map(); const resid = new Map();
    const valoresSoCodigo = new Set();
    const classes_ = new Map();
    const classesCod = new Map();
    for (const cs of cases) {
      const s = runSource(num, cs, saidas);
      const c = calc(cs.code);
      for (const k of Object.keys(c.valores || {})) if (!saidas.some((sd) => sd.dom_id === k)) valoresSoCodigo.add(k);
      const tituloV = s.veredito ? (/^<b>([\s\S]*?)<\/b>/.exec(s.veredito) || [])[1] : null;
      if (tituloV) classes_.set(tituloV, (classes_.get(tituloV) || 0) + 1);
      const tituloC = s.veredito ? (/^<b>([\s\S]*?)<\/b>/.exec(c.veredito || '') || [])[1] : null;
      if (tituloC) classesCod.set(tituloC, (classesCod.get(tituloC) || 0) + 1);
      // numérico
      for (const sd of saidas) {
        const st = s.saidas[sd.dom_id];
        const cv = c.valores?.[sd.dom_id];
        const p = numPt(st);
        if (cv === undefined) continue;
        if (p === null) continue;
        let ref = cv;
        if (sd.dom_id === 'ol-tempo') { const mm = /(\d+) min (\d+) s/.exec(st); p.v = +mm[1] * 60 + +mm[2]; p.dec = 0; }
        if (sd.dom_id === 'fp-dd' || sd.dom_id === 'fp-dn') { ref = Math.abs(cv); p.v = Math.abs(p.v); }
        const tol = 0.5 * 10 ** -p.dec + 1e-9;
        if (Math.abs(ref - p.v) > tol) { numDiff++; if (numEx.length < 5) numEx.push({ entradas: cs.code, saida: sd.dom_id, fonte_texto: st, codigo_valor: cv }); }
      }
      // texto
      const srcLeaves = [...verdictLeaves(s.veredito), ...(s.cartoes ? leaves(s.cartoes) : []), ...Object.values(s.paineis).flatMap(leaves), ...Object.values(s.extra).flatMap(leaves)];
      const { faltando, residuo } = compareText(srcLeaves, c.veredito || '');
      for (const f of faltando) falt.set(f, (falt.get(f) || 0) + 1);
      for (const r of residuo) resid.set(r, (resid.get(r) || 0) + 1);
    }
    const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([t, k]) => ({ casos: k, texto: t.length > 400 ? t.slice(0, 400) + '…' : t }));
    comp.varredura = {
      metodo: 'Script original executado em DOM simulado (extratores/shim.mjs) × INSTRUMENT_CALCULATORS do código, nos mesmos casos. Texto: cada folha da fonte (veredito, rótulo e corpo de cartão, painel) precisa aparecer como substring no veredito do código; resíduo = texto do código que não vem de nenhuma folha da fonte. Número: valor do código contra o número exibido pela fonte, na precisão exibida.',
      casos: cases.length,
      vereditos_da_fonte_alcancados: Object.fromEntries(classes_),
      vereditos_do_codigo_nos_mesmos_casos: Object.fromEntries(classesCod),
      titulos_de_veredito_da_fonte_ausentes_no_codigo: [...classes_.keys()].filter((k) => !classesCod.has(k)),
      titulos_de_veredito_so_no_codigo: [...classesCod.keys()].filter((k) => !classes_.has(k)),
      divergencias_numericas: numDiff, exemplos_numericos: numEx,
      folhas_da_fonte_ausentes_no_codigo: { distintas: falt.size, amostra: top(falt, 12) },
      residuo_so_no_codigo: { distintos: resid.size, amostra: top(resid, 12) },
    };
    // Reescrita do campo pelo original (valor preso fica gravado no campo).
    if (num === 5 || num === 6) {
      const r = runtime();
      let probe;
      if (num === 6) {
        r.set('fp-vn1', '200'); const campoDepois = r.els['fp-vn1'].value; r.set('fp-hrs', '10');
        const cv = CALC[id]({ 'fp-vn1': 200, 'fp-hrs': 10 }).valores['fp-pn'];
        probe = { passos: 'fp-vn1 := 200 (com janela 6 h), depois fp-hrs := 10', campo_fp_vn1_na_fonte_apos_o_primeiro_passo: campoDepois, fonte_fp_pn: r.text('fp-pn'), codigo_fp_pn_com_as_mesmas_entradas_finais: cv };
      } else {
        r.set('dl-pta', '500'); const campoDepois = r.els['dl-pta'].value; r.set('dl-tot', '1000');
        const cv = CALC[id]({ 'dl-pta': 500, 'dl-tot': 1000 }).valores['dl-p0'];
        probe = { passos: 'dl-pta := 500 (com total 420), depois dl-tot := 1000', campo_dl_pta_na_fonte_apos_o_primeiro_passo: campoDepois, fonte_dl_p0: r.text('dl-p0'), codigo_dl_p0_com_as_mesmas_entradas_finais: cv };
      }
      comp.reescrita_de_campo = probe;
      comp.divergencias.push({ tema: 'reescrita do campo pelo original', detalhe: 'A fonte grava de volta no campo o valor preso ao limite; o código não grava (sinalizado no próprio comentário do código). Com a mesma sequência de edições, o resultado exibido difere.', exemplos: [probe] });
    }
    { const aus = [...classes_.keys()].filter((k) => !classesCod.has(k)); const so = [...classesCod.keys()].filter((k) => !classes_.has(k)); if (aus.length || so.length) comp.divergencias.push({ tema: 'ramos de veredito', detalhe: `Títulos de veredito da fonte ausentes no código: ${aus.length}; títulos só no código: ${so.length}.`, exemplos: [{ fonte: Object.fromEntries(classes_), codigo: Object.fromEntries(classesCod) }] }); }
    if (valoresSoCodigo.size) comp.divergencias.push({ tema: 'valor só no código', detalhe: `A calculadora do código devolve em valores ${[...valoresSoCodigo].map((k) => `«${k}»`).join(', ')}, sem readout correspondente na fonte (não declarado em outputs, portanto sem rótulo nem exibição).` });
    if (numDiff) comp.divergencias.push({ tema: 'saídas numéricas', detalhe: `${numDiff} diferença(s) na varredura` });
    if (falt.size) comp.divergencias.push({ tema: 'texto de leitura', detalhe: `${falt.size} folha(s) da fonte não aparecem literalmente no código em algum caso` });
    if (resid.size) comp.divergencias.push({ tema: 'texto só no código', detalhe: `${resid.size} trecho(s) distintos no veredito do código sem correspondente na fonte (rótulos reescritos, frases acrescentadas ou ramos inventados)` });
    comp.status = comp.divergencias.length ? 'divergente' : 'portado';
  } else {
    comp.status = 'não portado';
  }
  statusResumo[id] = comp.status;

  instrumentos.push({
    id, ref_fonte: ref, titulo: texto(inner(nm)),
    secao: { dom_id: sec.id, marcador: sec.marcador, rotulo: sec.rotulo, titulo: sec.titulo },
    aula: sec.marcador.startsWith('Aula') ? { numero: Number(sec.marcador.slice(5)), id_codigo: `aula-10-${sec.marcador.slice(5)}` } : null,
    nota_aula: sec.marcador.startsWith('Aula') ? null : 'Instrumento de módulo: vive no § MAP, fora de qualquer aula.',
    origem: origem('div.inst .inst-hd', node, inner(nm)),
    intro: { ...frag(inner(intro)), origem: origem('div.inst p.inst-intro', intro) },
    aviso: { ...frag(inner(disc)), origem: origem('div.inst p.disc', disc) },
    pergunta: null,
    nota_pergunta: 'A fonte não formula pergunta própria para o instrumento. O intro é instrução de uso, não pergunta. Pergunta de previsão, se houver, é da camada Alexandria (P19).',
    entradas,
    saidas,
    alvos_de_texto: { veredito: cfg.vd || null, cartoes: cfg.out || null, paineis: cfg.paineis || [], outros: cfg.extra || [] },
    logica_literal: logica(num),
    dados_do_script: dados,
    cenario_padrao: {
      entradas: Object.fromEntries(entradas.map((e) => [e.dom_id, e.padrao ?? null])),
      saidas_na_tela: padrao.saidas,
      veredito_classe: padrao.classe,
      veredito_html: padrao.veredito,
      cartoes_html: padrao.cartoes,
      paineis_html: padrao.paineis,
      outros_html: padrao.extra,
      metodo: 'medido executando o <script> original em DOM simulado no carregamento, sem interação',
    },
    fonte_dos_numeros: { nota: fn.nota, frases_literais: frases.length ? frases : null },
    tolerancias: null,
    nota_tolerancias: 'Nenhuma tolerância de resposta declarada pela fonte. Os limiares de faixa são lógica de classificação, não tolerância de correção.',
    invocacao: {
      posicao: { antes: descr(antes), depois: descr(depois) },
      mencoes_no_texto: mencoes,
    },
    comparacao_codigo: comp,
  });
}

instrumentos.sort((a, b) => a.id.localeCompare(b.id));

// Catálogo canônico (só leitura): tabela "### Instrumentos" da seção do Módulo 10.
{
  const CAT = fs.readFileSync('C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md', 'utf8').split(/\r?\n/);
  const ini = CAT.findIndex((l) => l.startsWith('## Módulo 10 '));
  const fim = CAT.findIndex((l, k) => k > ini && l.startsWith('## Módulo 11 '));
  const rows = {};
  let tab = false;
  for (let k = ini; k < fim; k++) {
    const l = CAT[k];
    if (l.startsWith('### ')) tab = l.trim() === '### Instrumentos';
    const m = tab && /^\| (Inst · \d\d) \| (.+?) \| (.+?) \|$/.exec(l);
    if (m) rows[m[1]] = { nome: m[2], descricao: m[3], linha: k + 1 };
  }
  for (const i of instrumentos) {
    const r = rows[i.ref_fonte];
    i.catalogo_canonico = r
      ? { arquivo: 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md', linha: r.linha, nome: r.nome, nome_igual_ao_titulo_da_fonte: r.nome === i.titulo, descricao: r.descricao, nota: 'A descrição é paráfrase do catálogo, não texto da fonte; fica fora da verificação verbatim.' }
      : { arquivo: 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md', linha: null, nome: null, nome_igual_ao_titulo_da_fonte: false, descricao: null, nota: 'Instrumento ausente da tabela do catálogo.' };
  }
}

// Achados fonte × fonte (P: registrar, nunca corrigir). Medidos executando o
// script ORIGINAL no DOM simulado; nenhum texto digitado além do rótulo do teste.
{
  const titulo = (h) => ((/^<b>([\s\S]*?)<\/b>/.exec(h || '') || [])[1] || null);
  const rb = (est, real) => {
    const r = runtime();
    est.forEach((v, k) => r.set('rb-e' + (k + 1), String(v)));
    real.forEach((v, k) => r.set('rb-r' + (k + 1), String(v)));
    return { maior_desvio: r.text('rb-maior'), titulo_do_veredito: titulo(r.htmlOf('rb-vd')) };
  };
  const real = [26, 22, 21, 9, 19, 3];
  const casos = [
    { teste: 'demanda SUPERestimada em +10 p.p. (energia −5, rede −5)', est: [21, 17, 31, 9, 19, 3] },
    { teste: 'demanda SUBestimada em −10 p.p. (energia +5, rede +5)', est: [31, 27, 11, 9, 19, 3] },
    { teste: 'energia SUBestimada em −10 p.p. (rede +10, empate resolvido pelo primeiro bloco)', est: [16, 32, 21, 9, 19, 3] },
    { teste: 'encargos desviados em +12 p.p. (energia −6, rede −6)', est: [20, 16, 21, 21, 19, 3] },
    { teste: 'reativo e outros desviado em +12 p.p. (energia −6, rede −6)', est: [20, 16, 21, 9, 19, 15] },
  ].map((c) => ({ teste: c.teste, estimativa: c.est, real, ...rb(c.est, real) }));
  const i09 = instrumentos.find((i) => i.id === 'm10-inst-09');
  i09.achados_na_fonte = [{
    id: 'inst09-mapeamento-de-vies',
    tema: 'mapeamento maior desvio → diagnóstico (DIAG)',
    expressao_exata: SCRIPT.slice(SCRIPT.indexOf("var key='equilibrado';", SCRIPT.indexOf('INST·09')), SCRIPT.indexOf('var D=DIAG[key];', SCRIPT.indexOf('INST·09'))).replace(/\s+/g, ' ').trim(),
    leitura_a: 'O título DIAG.demanda é «Viés de subestimação da demanda» e o corpo diz que o aluno atribui à demanda peso menor do que ela tem.',
    leitura_b: 'O ramo maiorI===2&&maiorV>0 (demanda SUPERestimada) também cai em key=demanda; maiorI===0&&maiorV<0 (energia subestimada) cai em key=rede; desvio máximo em encargos (3) ou reativo (5) cai em key=equilibrado («Estimativa calibrada») mesmo com |desvio| ≥ 6.',
    medicao: casos,
    nota: 'Registrado como achado do script original (protocolo §10: bug do original se sinaliza, nunca se corrige). O código portado reproduz o mesmo mapeamento (varredura sem divergência de título de veredito).',
  }];
  const i10 = instrumentos.find((i) => i.id === 'm10-inst-10');
  const tempos = i10.dados_do_script.PASSOS.valor.map((x) => x.t);
  i10.achados_na_fonte = [{
    id: 'inst10-tres-primeiros-passos',
    tema: 'duração dos três primeiros passos',
    leitura_a: 'Aula 09, 09.2 (L2502): «primeiros passos consomem menos de um minuto somados».',
    leitura_b: 'Veredito do script (L4553): «Os três primeiros passos consomem menos de um minuto e meio somados».',
    medicao: { tempos_por_passo_s: tempos, soma_tres_primeiros_s: tempos.slice(0, 3).reduce((a, b) => a + b, 0), soma_total_s: tempos.reduce((a, b) => a + b, 0) },
    nota: 'Mesma divergência registrada em modulo.json (div-09). Não resolvida.',
  }];
}

const porAula = {};
for (const i of instrumentos) { const k = i.aula ? `Aula ${String(i.aula.numero).padStart(2, '0')}` : i.secao.marcador; (porAula[k] ||= []).push(i.ref_fonte); }

const out = {
  schema: 'alexandria-v2/extraction/instrumentos@1',
  modulo: 'M10',
  grupo: 'instrumentos',
  fonte: FONTE,
  gerado_em: '2026-09-17',
  metodo: 'Extração programática (Node): markup por árvore (extratores/lib.mjs), dados por avaliação dos literais do <script>, cenário-padrão e varredura executando o script original em DOM simulado (extratores/shim.mjs). Código do repositório importado só para leitura (extratores/code.mjs).',
  convencoes: {
    html: 'fragmento literal da fonte, com espaços colapsados',
    texto: 'o mesmo sem tags e com entidades decodificadas',
    logica_literal: 'bloco do IIFE copiado do script; só os literais de dados foram substituídos por um comentário que aponta para dados_do_script',
    status: 'portado = título, entradas, saídas, dados, textos e números iguais na varredura e vínculo de aula certo; divergente = presente com qualquer diferença listada; não portado = ausente',
  },
  contagens: {
    instrumentos: instrumentos.length,
    declarado_no_hero: (() => { const p = findAll(doc, byClass('pill')).map((x) => texto(inner(x))).find((t) => /instrumentos/.test(t)); return p; })(),
    por_secao: porAula,
    entradas_total: instrumentos.reduce((a, i) => a + i.entradas.length, 0),
    saidas_numericas_total: instrumentos.reduce((a, i) => a + i.saidas.length, 0),
    status: statusResumo,
  },
  instrumentos,
};
writeJSON('instrumentos.json', out);
console.log(JSON.stringify(out.contagens, null, 1));
for (const i of instrumentos) {
  const v = i.comparacao_codigo.varredura;
  console.log(i.ref_fonte, i.comparacao_codigo.status, i.comparacao_codigo.divergencias.length, v ? `casos=${v.casos} num=${v.divergencias_numericas} falt=${v.folhas_da_fonte_ausentes_no_codigo.distintas} res=${v.residuo_so_no_codigo.distintos}` : '');
}
