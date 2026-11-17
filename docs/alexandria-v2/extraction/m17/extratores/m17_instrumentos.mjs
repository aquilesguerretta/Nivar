// Extrator deterministico dos 12 instrumentos do M17 -> instrumentos.json
// Dados: literais do <script> avaliados com vm. Saidas e textos de leitura:
// capturados EXECUTANDO o script original num DOM simulado (protocolo §10),
// estado por estado, sem transcricao.
import fs from 'node:fs';
import * as L from './lib.mjs';

const { T, H, find, findAll, classIs, hasClass, origem, lineOf, pad, els } = L;
const D = 'file:///' + L.DATA + '/';
const C17 = await import(D + 'alexandria-modulo-17-content.ts');
const calcSrc = L.readData('alexandria-instrument-calculators.ts');
const catalogo = fs.readFileSync(L.CATALOGO, 'utf8');
const catSec = catalogo.slice(catalogo.indexOf('## Módulo 17 — '));
const catInst = [...catSec.matchAll(/^\| Instrumento (\d\d) \| ([^|]+) \| ([^|]+) \|$/gm)].map((m) => ({ n: m[1], titulo: m[2].trim(), descricao: m[3].trim() }));

const R = L.runOriginal();
const get = (id) => R.get(id);
const html2text = (h) => L.texto(String(h).replace(/<br\s*\/?>/g, ' '));
// clique generico: o handler do alvo le closest(...).getAttribute(...)
function click(wrapId, attrVal) {
  const w = get(wrapId);
  const target = { closest: () => ({ getAttribute: () => String(attrVal) }) };
  (w.handlers.click || []).forEach((f) => f({ target }));
}
function setNum(id, v) { get(id).value = String(v); (get(id).handlers.input || []).forEach((f) => f({})); }
function resetNums(ids) { ids.forEach((id) => { get(id).value = undefined; }); }
const verdictOf = (id) => ({ classe: get(id).className || null, html: get(id).innerHTML, texto: html2text(get(id).innerHTML) });
function readouts(id) {
  const h = get(id).innerHTML;
  return [...h.matchAll(/<div class="ro"><div class="k">([\s\S]*?)<\/div><div class="n([^"]*)">([\s\S]*?)(?:<span class="u">([\s\S]*?)<\/span>)?<\/div><\/div>/g)]
    .map((m) => ({ rotulo: L.texto(m[1]), valor: L.texto(m[3]), unidade: m[4] ? L.texto(m[4]) : null, classe: m[2].trim() || null }));
}
function gcmpRows(h) {
  return [...String(h).matchAll(/<div class="gk">([\s\S]*?)<\/div><div class="gv">([\s\S]*?)<\/div>/g)].map((m) => ({ chave: L.texto(m[1]), valor_html: m[2], valor_texto: html2text(m[2]) }));
}

// ---------- metadados comuns por instrumento, lidos do markup ----------
const INSTS = findAll(L.DOM, (n) => classIs(n, 'inst'));
function meta(n) {
  const sec = L.SECOES.find((s) => s.node.start < n.start && s.node.end > n.end);
  const hd = find(n, (k) => classIs(k, 'inst-hd'));
  const intro = find(n, (k) => classIs(k, 'inst-intro'));
  const src = find(n, (k) => classIs(k, 'srcnote'));
  const num = T(find(hd, (k) => classIs(k, 'id'))).replace(/\D/g, '');
  const wrapKids = L.wrapKids(sec);
  const idx = wrapKids.indexOf(n);
  const desc = (k) => (k ? { tag: k.tag, classe: k.attrs.class || null, id_fonte: k.attrs.id || null, texto_inicial: L.collapse(L.decode(L.innerHTML(k).replace(/<[^>]+>/g, ' '))).slice(0, 100), linha_aprox: lineOf(k.start) } : null);
  // menções ao instrumento no texto
  const mencoes = [];
  const re = new RegExp(`Instrumento ${num}\\b`, 'g');
  let m; const body = L.html.slice(L.html.indexOf('<body>'), L.html.indexOf('<script>'));
  const bodyOff = L.html.indexOf('<body>');
  while ((m = re.exec(body))) {
    const off = bodyOff + m.index;
    if (off >= hd.start && off <= hd.end) continue;
    const s2 = L.SECOES.find((s) => s.node.start < off && s.node.end > off);
    mencoes.push({ secao: s2 ? s2.id : null, linha_aprox: lineOf(off), contexto: L.texto(L.html.slice(Math.max(0, off - 80), off + 40)) });
  }
  return {
    num,
    id: `m17-inst-${num}`,
    rotulo: T(find(hd, (k) => classIs(k, 'id'))),
    id_fonte: n.attrs.id,
    titulo: { html: H(find(hd, (k) => classIs(k, 'ti'))), texto: T(find(hd, (k) => classIs(k, 'ti'))) },
    secao: sec.id,
    aula_id: sec.eh_aula ? `aula-17-${sec.id.slice(1)}` : null,
    fora_de_aula: !sec.eh_aula,
    instrucao: { html: H(intro), texto: T(intro), origem: origem(`#${n.attrs.id} p.inst-intro`, intro) },
    pergunta: null,
    pergunta_nota: 'O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).',
    ponto_de_invocacao: {
      posicao_na_secao: `${idx + 1}º de ${wrapKids.length} blocos de .wrap`,
      bloco_anterior: desc(wrapKids[idx - 1]),
      bloco_seguinte: desc(wrapKids[idx + 1]),
      origem: origem(`section#${sec.id} div.inst#${n.attrs.id}`, n, T(hd)),
    },
    mencoes_no_texto: mencoes,
    fonte_dos_numeros: src ? { html: H(src), texto: T(src), origem: origem(`#${n.attrs.id} p.srcnote`, src) } : null,
    tolerancias: null,
    tolerancias_nota: 'A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.',
    markup_alvos: findAll(n, (k) => k.attrs.id).map((k) => ({ id: k.attrs.id, classe: k.attrs.class || null })),
    estado_codigo: 'não portado',
    estado_codigo_evidencia: `aula ${sec.eh_aula ? `aula-17-${sec.id.slice(1)}` : '(fora de aula)'}: instruments: []; nenhuma calculadora "${n.attrs.id}"/"m17" em alexandria-instrument-calculators.ts`,
    catalogo_canonico: (() => { const c = catInst.find((x) => x.n === num); return c ? { titulo: c.titulo, titulo_igual_fonte: L.texto(c.titulo.replace(/\s*\(instrumento assinatura\)$/, ' · instrumento assinatura')) === T(find(hd, (k) => classIs(k, 'ti'))) || c.titulo === T(find(hd, (k) => classIs(k, 'ti'))), descricao_catalogo: c.descricao } : null; })(),
  };
}
const M = Object.fromEntries(INSTS.map((n) => { const m = meta(n); return [m.id_fonte, m]; }));
const iife = (a, b) => L.scriptSlice(a, b);
// As chaves do mapa de calculadoras seguem o prefixo `mNN-` (os ids `i01-`…`i12-` do M17 também existem em
// calculadoras de OUTROS módulos, por isso não servem de sinal: foi o falso positivo que deixava 'verificar').
const codeCheck = {
  calculadoras_com_m17: (calcSrc.match(/^\s*'m17-[^']*'\s*:/gm) || []).length,
  calculadoras_com_m17_nota: "contagem das chaves `'m17-…'` do mapa de calculadoras; os ids `i01-`…`i12-` casam com calculadoras de outros módulos e não indicam porte do M17",
  instruments_nas_aulas: C17.MODULO_17_AULAS.reduce((a, x) => a + x.instruments.length, 0),
};

// ================= i01 =================
const DIMS = L.evalLiteral('var DIMS = ').valor;
const J = L.evalLiteral('var J = ');
const i01states = ['preco', 'descarb', 'regul', 'invest'].map((k, i) => {
  click('i01-dim', i);
  const out = get('i01-out').innerHTML;
  return { entrada: { dimensao: DIMS[k].label }, disc: L.texto((/<p class="disc">([\s\S]*?)<\/p>/.exec(out) || [])[1]), grupos: gcmpRows(out), leitura: verdictOf('i01-v') };
});
click('i01-dim', 0);
const i01 = {
  ...M.i01,
  kind_sugerido: 'explorador',
  kind_nota: 'Anotação (taxonomia): 1 seletor de 4 opções → revela agrupamento textual; sem cálculo numérico além da contagem de membros.',
  entradas: [{ id: 'i01-dim', rotulo: null, tipo: 'chips', opcoes: ['preco', 'descarb', 'regul', 'invest'].map((k) => DIMS[k].label), padrao: DIMS.preco.label, fonte_opcoes: 'DIMS[k].label' }],
  dados: { DIMS, J_origem_linha: J.linha_aprox, nota: 'A grade de 17 jurisdições (J) está em modulo.json › mapa.grade_17.' },
  saidas: [
    { id: 'i01-out', tipo: 'texto', descricao_anotacao: 'Frase "Agrupamento por: <pergunta>." + um par (grupo → membros · (n)) por bucket da dimensão.', formula: "J.filter(function(j){ return j[it.k]===b; })  // membros; contagem = membros.length" },
    { id: 'i01-v', tipo: 'veredito', classe_fixa: 'att' },
  ],
  cenario_padrao: i01states[0],
  estados: i01states,
  leituras_nota: 'O veredito é um só modelo, com a frase `nao` da dimensão interpolada.',
  script_verbatim: iife('i01 — MAPA DAS JURISDIÇÕES', 'i02 — VERIFICADOR'),
};

// ================= i02 =================
const DECL = L.evalLiteral('var DECL=').valor;
const i02 = (() => {
  const estado = (label) => ({ rotulo_anotacao: label, leitura: verdictOf('i02-v'), linhas: [...get('i02-rows').innerHTML.matchAll(/<div class="p7-r (have|miss)"[\s\S]*?<div class="p7-k">([\s\S]*?)<\/div><div class="p7-v">([\s\S]*?)<\/div><\/div>/g)].map((m) => ({ estado: m[1], chave: L.texto(m[2]), texto: html2text(m[3]) })) });
  const inicial = estado('inicial: nenhuma declarada (7 ausentes)');
  // declara uma a uma e captura por numero de ausentes
  const porAusentes = {};
  const ordem = DECL.map((d) => d.k);
  // canonico: so cambio declarado
  click('i02-rows', 'cambio');
  const canonico = estado('só a base cambial declarada (6 ausentes) — caso canônico da Aula 01');
  click('i02-rows', 'cambio');
  for (let i = 0; i < ordem.length; i++) { click('i02-rows', ordem[i]); const e = estado(`${i + 1} declaradas na ordem da fonte`); porAusentes[7 - (i + 1)] = { classe: e.leitura.classe, texto: e.leitura.texto }; }
  const todas = estado('todas as 7 declaradas');
  for (const k of ordem) click('i02-rows', k); // volta ao inicial
  // classe por quantidade de ausentes, sobre as 128 combinacoes
  const classes = {};
  for (let mask = 0; mask < 128; mask++) {
    const st = {}; DECL.forEach((d, i) => { st[d.k] = !!(mask & (1 << i)); });
    for (const d of DECL) { const cur = get('i02-rows').innerHTML.includes(`p7-r have" data-k="${d.k}"`); if (cur !== st[d.k]) click('i02-rows', d.k); }
    const falta = DECL.filter((d) => !st[d.k]).length;
    const c = get('i02-v').className;
    (classes[falta] ||= new Set()).add(c);
  }
  for (const d of DECL) { if (get('i02-rows').innerHTML.includes(`p7-r have" data-k="${d.k}"`)) click('i02-rows', d.k); }
  return {
    ...M.i02,
    kind_sugerido: 'quebra-cabeca',
    kind_nota: 'Anotação: 7 chaves booleanas sem peso (declarada/ausente) → veredito por contagem; mesma família do "Quebra-cabeça" do M03 (4 chaves sem peso). Confirmar.',
    entradas: DECL.map((d, i) => ({ id: `i02-${d.k}`, numero: i + 1, rotulo: d.n, tipo: 'alternar (clique na linha)', estados: ['Ausente.', 'Declarada.'], padrao: 'Ausente.', texto_de_apoio_html: d.f, texto_de_apoio: L.texto(d.f) })),
    entradas_origem: { seletor: '<script> var DECL=[…]', linha_aprox: L.lineOfScript('var DECL=[') },
    saidas: [
      { id: 'i02-rows', tipo: 'lista', descricao_anotacao: '7 linhas p7-r com "Declarada."/"Ausente." + texto de apoio' },
      { id: 'i02-v', tipo: 'veredito', formula: "falta = DECL.filter(d => !state[d.k]); classe = falta.length===0 ? 'ok' : (falta.length>=4 ? 'per' : 'att')" },
    ],
    cenario_padrao: inicial,
    ramos: [
      { condicao: 'falta.length===0', classe: 'ok', exemplo: todas.leitura },
      { condicao: 'falta.length 1–3', classe: 'att', exemplo: porAusentes[1], exemplo_3: porAusentes[3] },
      { condicao: 'falta.length>=4', classe: 'per', exemplo: canonico.leitura },
    ],
    classes_medidas_sobre_128_combinacoes: Object.fromEntries(Object.entries(classes).map(([k, v]) => [k, [...v]])),
    estados_exemplo: [inicial, canonico, todas],
    leituras_nota: 'O texto do veredito interpola a quantidade e a lista (em minúsculas) das declarações ausentes; "ausente"/"ausentes" conforme a contagem. Espaço de entrada inteiro (128) percorrido para as classes.',
    script_verbatim: iife('i02 — VERIFICADOR DE PERÍMETRO', 'i03 — DECOMPOSITOR'),
  };
})();

// ================= i03 =================
const PARES = L.evalLiteral('var PARES=').valor;
const DIMSEL = L.evalLiteral('var DIMSEL=').valor;
const MM = { linha_aprox: L.lineOfScript('var M={') };
const Mdata = L.evalLiteral('var M=').valor;
const i03 = (() => {
  const estados = [];
  const anomalias = [];
  PARES.forEach((p, pi) => {
    click('i03-par', pi);
    DIMSEL.forEach((d, di) => {
      click('i03-dim', di);
      const out = get('i03-out').innerHTML;
      const m = Mdata[p.k][d.k];
      const no = (/<div class="par3-no">([\s\S]*?)<\/div>/.exec(out) || [])[1];
      const legenda = [...out.matchAll(/<i class="(dot|des|pol)"><\/i>([^<]*)/g)].map((x) => x[2]);
      estados.push({ entrada: { par: p.label, dimensao: d.label }, pesos: { dotacao: m.dot, desenho: m.des, politica: m.pol }, legenda, nota_html: m.nota, nao_explica_html: no, nao_explica_texto: html2text(no), leitura: verdictOf('i03-v') });
      const zeroKey = { 'dotação': 'dot', desenho: 'des', 'política': 'pol' }[m.zero];
      if (zeroKey && m[zeroKey] !== 0) anomalias.push({ par: p.label, dimensao: d.label, zero_declarado: m.zero, peso_da_parcela: m[zeroKey] });
      const pesos = [m.dot, m.des, m.pol]; const mx = Math.max(...pesos);
      if (pesos.filter((x) => x === mx).length > 1) anomalias.push({ par: p.label, dimensao: d.label, empate_no_maximo: pesos, regra_de_desempate: "dot>=des && dot>=pol → dotação; senão des>=pol → desenho" });
    });
  });
  click('i03-par', 0); click('i03-dim', 0);
  return {
    ...M.i03,
    kind_sugerido: 'comparador',
    kind_nota: 'Anotação: par de jurisdições × dimensão → decomposição em 3 parcelas + veredito. Sem entrada numérica.',
    entradas: [
      { id: 'i03-par', tipo: 'chips', rotulo: null, opcoes: PARES.map((p) => p.label), padrao: PARES[0].label },
      { id: 'i03-dim', tipo: 'chips', rotulo: null, opcoes: DIMSEL.map((d) => d.label), padrao: DIMSEL[0].label },
    ],
    dados: { M: Mdata, M_origem_linha: MM.linha_aprox, comentario_fonte: '/* pares × dimensão → {dot,des,pol, vinc, zero, nota} — pesos ordinais, não medida */' },
    saidas: [
      { id: 'i03-out', tipo: 'barra+legenda+nota', formula: "tot = m.dot+m.des+m.pol; legenda '<parcela> '+peso+'/'+tot; segmento zero → 'par3-seg zero' com flex 0.6 e rótulo '<parcela>: 0'" },
      { id: 'i03-v', tipo: 'veredito', formula: "vinc = (m.dot>=m.des && m.dot>=m.pol) ? 'dotação' : (m.des>=m.pol ? 'desenho' : 'política'); classe fixa 'ok'" },
    ],
    cenario_padrao: estados[0],
    estados,
    anomalias_dos_dados: anomalias,
    anomalias_nota: '`zero_declarado` é o campo `zero` do script, exibido como "A parcela que não explica nada aqui: X", mesmo quando o peso de X na barra é 1 (não 0). Medição desta extração.',
    fonte_dos_numeros_script: 'O próprio veredito declara: "Os pesos acima são ordinais e ilustrativos, não medida".',
    script_verbatim: iife('i03 — DECOMPOSITOR DE DIFERENÇA', 'i04 — COMPARADOR'),
  };
})();

// ================= i04 =================
const VIS = L.evalLiteral('var VIS=').valor;
const core = J.valor.filter((j) => j.core);
const i04 = (() => {
  const estados = [];
  core.forEach((j, ji) => {
    click('i04-jur', ji);
    VIS.forEach((v, vi) => {
      click('i04-dim', vi);
      estados.push({ entrada: { jurisdicao: j.n, dimensao: v.label }, linhas: gcmpRows(get('i04-out').innerHTML), leitura: verdictOf('i04-v') });
    });
  });
  click('i04-jur', 0); click('i04-dim', 0);
  const ramos = [...new Set(estados.map((e) => e.leitura.texto))];
  return {
    ...M.i04,
    kind_sugerido: 'explorador',
    kind_nota: 'Anotação: jurisdição × pergunta → revela 4 campos da base J e um veredito por ramo.',
    entradas: [
      { id: 'i04-jur', tipo: 'chips', opcoes: core.map((j) => (j.n.length > 24 ? j.n.slice(0, 22) + '…' : j.n)), opcoes_nome_completo: core.map((j) => j.n), padrao: core[0].n, nota: 'Rótulo truncado pelo script a 22 caracteres + "…" quando o nome passa de 24.' },
      { id: 'i04-dim', tipo: 'chips', opcoes: VIS.map((v) => v.label), padrao: VIS[0].label },
    ],
    saidas: [
      { id: 'i04-out', tipo: 'pares', rotulos: ['Despacho', 'Granularidade', 'Risco de volume', 'Dotação relevante'], formula: 'j.desp · j.gran · j.risco · j.dot (base J)' },
      { id: 'i04-v', tipo: 'veredito', formula: "desp: custo declarado se j.desp começa com 'Custo declarado' ou contém 'custo auditado' (índice>0); gran: j.preco==='nodal' | 'zonal' | outro; risco: texto fixo; + sufixo fixo" },
    ],
    cenario_padrao: estados[0],
    estados,
    ramos_distintos: ramos.length,
    script_verbatim: iife('i04 — COMPARADOR DE DESENHO', 'i05 — GRADE'),
  };
})();

// ================= i05 =================
const i05 = (() => {
  const estados = core.map((j, ji) => { click('i05-jur', ji); return { entrada: { jurisdicao: j.n }, regul: j.regul, linhas: gcmpRows(get('i05-out').innerHTML), leitura: verdictOf('i05-v') }; });
  click('i05-jur', 0);
  return {
    ...M.i05,
    kind_sugerido: 'explorador',
    kind_nota: 'Anotação: jurisdição → 4 campos de J + veredito por j.regul.',
    entradas: [{ id: 'i05-jur', tipo: 'chips', opcoes: core.map((j) => (j.n.length > 24 ? j.n.slice(0, 22) + '…' : j.n)), opcoes_nome_completo: core.map((j) => j.n), padrao: core[0].n }],
    saidas: [
      { id: 'i05-out', tipo: 'pares', rotulos: ['Quem remunera e com que produto', 'Como o preço se forma', 'Penalidade por não-desempenho', 'Pressuposto institucional'], formula: 'j.disp · j.dispPreco · j.dispPen · j.dispInst' },
      { id: 'i05-v', tipo: 'veredito', formula: "ramo por j.regul: capacidade_central | so_energia | leilao_longo_prazo | else (planejamento); classe fixa 'ok'" },
    ],
    cenario_padrao: estados[0],
    estados,
    script_verbatim: iife('i05 — GRADE DE REMUNERAÇÃO', 'i06 — CONVERSOR'),
  };
})();

// ---------- numéricos: CFG ----------
function cfgBlock(marker) {
  // devolve a lista CFG do bloco do instrumento
  const s = L.scriptSlice(marker, 'wrap.innerHTML = CFG.map(field)');
  const i = s.codigo.indexOf('var CFG=');
  const lit = s.codigo.slice(i + 'var CFG='.length, s.codigo.indexOf('];', i) + 1);
  return { cfg: (0, eval)('(' + lit + ')'), linha: L.lineOfScript(s.codigo.slice(i, i + 40)) };
}
const entradaNum = (c) => ({ id: c.id, rotulo: c.label, unidade: c.unit, padrao: c.val, min: c.min, max: c.max, passo: c.step, tipo: 'number + range espelhado', regra_de_entrada: 'parseNum (vírgula decimal aceita; ponto de milhar removido) → clamp(min,max); vazio/ inválido → padrão' });

// ================= i06 =================
const i06 = (() => {
  const { cfg, linha } = cfgBlock('i06 — CONVERSOR');
  const ids = cfg.map((c) => c.id);
  resetNums(ids); R.fire('x', 'noop');
  // recomputa via evento de input do primeiro campo
  const recompute = () => (get(ids[0]).handlers.input || []).forEach((f) => f({}));
  recompute();
  const padrao = { entradas: Object.fromEntries(cfg.map((c) => [c.label, c.val])), saidas: readouts('i06-r'), leitura: verdictOf('i06-v') };
  setNum('i06-fc', 30); const fcBaixo = { entradas: { 'Fator de carga da carga': 30 }, saidas: readouts('i06-r'), leitura: verdictOf('i06-v') };
  setNum('i06-p', 0); const p0 = { entradas: { 'Preço de capacidade': 0, 'Fator de carga da carga': 30 }, saidas: readouts('i06-r'), leitura: verdictOf('i06-v') };
  resetNums(ids); recompute();
  return {
    ...M.i06,
    kind_sugerido: 'calculadora',
    entradas: cfg.map(entradaNum), entradas_origem_linha: linha,
    saidas: [
      { rotulo: 'Custo da janela', unidade: 'mi', formula: 'anual = p*mw*d; exibido \'US$ \'+nfmt(anual/1e6,2)', casas: 2 },
      { rotulo: 'Energia no período', unidade: 'GWh', formula: 'mwh = mw*fc*24*d; exibido nfmt(mwh/1000,1)', casas: 1 },
      { rotulo: 'Equivalente', unidade: '/MWh', formula: 'perMwh = mwh>0 ? anual/mwh : NaN; exibido \'US$ \'+nfmt(perMwh,2)', casas: 2 },
      { rotulo: 'Sobre a placa?', unidade: null, formula: "texto fixo 'não'" },
      { id: 'i06-v', tipo: 'veredito', classe_fixa: 'att' },
    ],
    cenario_padrao: padrao,
    ramos: [
      { condicao: 'sempre', descricao_anotacao: 'texto-base do veredito', exemplo: padrao.leitura },
      { condicao: 'fc<0.35', exemplo: fcBaixo.leitura },
      { condicao: 'p===0 (substitui o alerta de fc)', exemplo: p0.leitura },
    ],
    script_verbatim: iife('i06 — CONVERSOR DE PREÇO', 'window.M17 = '),
    observacoes: ['Se p===0 e fc<0.35, só o alerta de preço zero aparece (a atribuição sobrescreve `alerta`).', 'O texto-base afirma que "o preço vigente está no teto negociado" para qualquer valor digitado.'],
  };
})();

// ================= i07 =================
const POS = L.evalLiteral('var POS=').valor;
const OBJ = L.evalLiteral('var OBJ=').valor;
const i07 = (() => {
  const estados = OBJ.map((o, i) => { click('i07-obj', i); return { entrada: o.label, posicao: POS[o.p].n, linhas: gcmpRows(get('i07-out').innerHTML), leitura: verdictOf('i07-v') }; });
  click('i07-obj', 0);
  return {
    ...M.i07,
    kind_sugerido: 'explorador',
    entradas: [{ id: 'i07-obj', tipo: 'chips', opcoes: OBJ.map((o) => o.label), padrao: OBJ[0].label }],
    dados: { POS, OBJ, POS_origem_linha: L.lineOfScript('var POS={'), OBJ_origem_linha: L.lineOfScript('var OBJ=[') },
    saidas: [
      { id: 'i07-out', tipo: 'pares', rotulos: ['Posição na régua', 'Evidência que a posição exige', 'Estado verificado em 04·08·2026', 'Gatilho que mudaria a posição'] },
      { id: 'i07-v', tipo: 'veredito', formula: 'classe = POS[o.p].cls; texto = "O que esta posição não autoriza concluir." + o.nao + sufixo fixo' },
    ],
    cenario_padrao: estados[0],
    estados,
    distribuicao_posicoes: OBJ.reduce((a, o) => (a[POS[o.p].n] = (a[POS[o.p].n] || 0) + 1, a), {}),
    script_verbatim: iife('i07 — RÉGUA DE ESTÁGIO', 'i08 — VERIFICADOR'),
  };
})();

// ================= i08 =================
const E8 = L.evalLiteral('var E={').valor;
const MEC = L.evalLiteral('var MEC=').valor;
const i08 = (() => {
  const estados = MEC.map((m, i) => {
    click('i08-mec', i);
    const aus = m.f.filter((r) => r[2] === 'aus').length, dif = m.f.filter((r) => r[2] === 'dif').length, ok = m.f.filter((r) => r[2] === 'ok').length;
    return { entrada: m.label, contagem: { ausente: aus, natureza_distinta: dif, ocupada: ok, total: m.f.length }, sintese_texto: html2text(m.s), linhas: gcmpRows(get('i08-out').innerHTML), leitura: verdictOf('i08-v') };
  });
  click('i08-mec', 0);
  const funcoesUsadas = [...new Set(MEC.flatMap((m) => m.f.map((r) => r[0])))];
  return {
    ...M.i08,
    kind_sugerido: 'explorador',
    entradas: [{ id: 'i08-mec', tipo: 'chips', opcoes: MEC.map((m) => m.label), padrao: MEC[0].label }],
    dados: { E: E8, MEC, E_origem_linha: L.lineOfScript('var E={'), MEC_origem_linha: L.lineOfScript('var MEC=[') },
    saidas: [
      { id: 'i08-out', tipo: 'pares', formula: "chave = função+' — '+requisito; valor = selo(E[estado]) + '<br>' + situação brasileira" },
      { id: 'i08-v', tipo: 'veredito', formula: "aus = nº de 'aus'; classe = aus>=3 ? 'per' : (aus>=1 ? 'att' : 'ok'); texto = m.s + ' Funções ausentes: '+aus+' de '+m.f.length+'.' + sufixo" },
    ],
    cenario_padrao: estados[0],
    estados,
    funcoes_usadas: funcoesUsadas,
    nota_funcoes: 'A instrução lista 6 funções (operar, contabilizar, liquidar, fiscalizar, julgar, financiar); cada mecanismo usa 5 delas. Anotação.',
    script_verbatim: iife('i08 — VERIFICADOR DE PRESSUPOSTO', 'i09 — CALCULADORA'),
  };
})();

// ================= i09 =================
const SET9 = L.evalLiteral('var SET=').valor;
const i09 = (() => {
  const { cfg, linha } = cfgBlock('i09 — CALCULADORA DE AJUSTE');
  const ids = cfg.map((c) => c.id);
  const recompute = () => (get(ids[0]).handlers.input || []).forEach((f) => f({}));
  resetNums(ids); click('i09-set', 0); recompute();
  const snap = (label) => ({ rotulo_anotacao: label, saidas: readouts('i09-r'), leitura: verdictOf('i09-v') });
  const porSetor = SET9.map((s, i) => { click('i09-set', i); return snap(`padrão · setor ${s.label}`); });
  click('i09-set', 0);
  setNum('i09-or', 10); const comOrigem = snap('Ferro e aço · preço pago na origem = 10');
  resetNums(ids); recompute();
  setNum('i09-fe', 100); const fe100 = snap('Ferro e aço · fator de entrada = 100% (razão bruto/obrigação = 1)');
  resetNums(ids); recompute();
  // sensibilidade no cenário padrão (medição desta extração)
  const liq = (s, over = {}) => { const v = Object.fromEntries(cfg.map((c) => [c.id, c.val])); Object.assign(v, over); const vol = v['i09-vol'] * 1000; const intens = v['i09-dir'] + (s.ind ? v['i09-ind'] : 0); return vol * intens * Math.max(0, v['i09-pc'] - v['i09-or']) * (v['i09-fe'] / 100); };
  const base = liq(SET9[0]);
  return {
    ...M.i09,
    kind_sugerido: 'calculadora',
    entradas: [{ id: 'i09-set', tipo: 'chips', rotulo: 'setor', opcoes: SET9.map((s) => s.label), padrao: SET9[0].label, dados: SET9 }, ...cfg.map(entradaNum)],
    entradas_origem_linha: linha,
    saidas: [
      { rotulo: 'Base contabilizada', unidade: 'kt CO₂e', formula: 'vol=kt*1000; intens = dir + (setor.ind ? ind : 0); tco2 = vol*intens; nfmt(tco2/1000,1)', casas: 1 },
      { rotulo: 'Exposição bruta', unidade: 'mi', formula: "bruto = tco2*pc; '€ '+nfmt(bruto/1e6,2)", casas: 2 },
      { rotulo: 'Com fator de entrada', unidade: 'mi', formula: "comFe = bruto*fe (fe = %/100); '€ '+nfmt(comFe/1e6,2)", casas: 2 },
      { rotulo: 'Após abatimento', unidade: 'mi', formula: "liq = tco2*Math.max(0, pc-or)*fe; '€ '+nfmt(liq/1e6,2)", casas: 2 },
      { rotulo: 'Por tonelada', unidade: '/t', formula: "porT = vol>0 ? liq/vol : 0; '€ '+nfmt(porT,2)", casas: 2 },
      { rotulo: 'Indireta contabilizada', unidade: null, formula: "setor.ind ? 'sim' : 'não'" },
      { id: 'i09-v', tipo: 'veredito', classe_fixa: 'att' },
    ],
    cenario_padrao: porSetor[0],
    estados: [...porSetor, comOrigem, fe100],
    ramos: [
      { condicao: 'setor.ind true (Cimento, Fertilizantes)', exemplo: porSetor[2].leitura },
      { condicao: 'setor.ind false (Ferro e aço, Alumínio)', exemplo: porSetor[0].leitura },
      { condicao: 'razao = bruto/comFe > 1.5 → acrescenta "Exposição bruta é N× a obrigação do período…"', exemplo: porSetor[0].leitura },
      { condicao: 'razao <= 1.5 → sem a frase', exemplo: fe100.leitura },
      { condicao: 'or>0 → acrescenta "Atenção ao abatimento…"', exemplo: comOrigem.leitura },
    ],
    sensibilidade_cenario_padrao_anotacao: {
      liq_ferro_aco_eur: base,
      liq_cimento_eur: liq(SET9[2]),
      efeito_incluir_indireta_pct: +(100 * (liq(SET9[2]) / base - 1)).toFixed(1),
      efeito_fator_entrada_5_para_10_pct: +(100 * (liq(SET9[0], { 'i09-fe': 10 }) / base - 1)).toFixed(1),
      efeito_preco_75_para_90_pct: +(100 * (liq(SET9[0], { 'i09-pc': 90 }) / base - 1)).toFixed(1),
      nota: 'Medição desta extração, para confrontar a instrução "a inclusão ou não da parcela elétrica altera o resultado mais do que qualquer outro parâmetro" (ver divergências).',
    },
    script_verbatim: iife('i09 — CALCULADORA DE AJUSTE', 'i10 — DECOMPOSITOR'),
  };
})();

// ================= i10 =================
const i10 = (() => {
  const { cfg, linha } = cfgBlock('i10 — DECOMPOSITOR DE PENETRAÇÃO');
  const ids = cfg.map((c) => c.id);
  const recompute = () => (get(ids[0]).handlers.input || []).forEach((f) => f({}));
  resetNums(ids); recompute();
  const snap = (label) => ({ rotulo_anotacao: label, saidas: readouts('i10-r'), leitura: verdictOf('i10-v') });
  const padrao = snap('padrão');
  setNum('i10-sx', -45); const exportador = snap('saldo = −45 (exportador)');
  resetNums(ids); recompute();
  setNum('i10-cr', 100); setNum('i10-ct', 250); setNum('i10-gr', 200); setNum('i10-gt', 520); setNum('i10-pk', 45); setNum('i10-cu', 1); setNum('i10-sx', 0);
  const proximos = snap('quatro números próximos (cr 100, ct 250, gr 200, gt 520, pk 45, cu 1, sx 0)');
  resetNums(ids); recompute();
  return {
    ...M.i10,
    kind_sugerido: 'calculadora',
    entradas: cfg.map(entradaNum), entradas_origem_linha: linha,
    regra_de_consistencia: 'if(cr>ct) cr=ct; if(gr>gt) gr=gt;',
    saidas: [
      { rotulo: '1 · Capacidade instalada', unidade: '%', formula: 'n1 = ct>0 ? cr/ct*100 : 0; nfmt(n1,1)' },
      { rotulo: '2 · Geração no ano', unidade: '%', formula: 'n2 = gt>0 ? gr/gt*100 : 0' },
      { rotulo: '3 · Pico instantâneo', unidade: '%', formula: 'n3 = pk' },
      { rotulo: '4 · Consumida líquida', unidade: '%', formula: 'sx>=0: consumo = gt+sx, renCons = gr; sx<0: consumo = max(1e-9, gt+sx), renCons = max(0, gr+sx); n4 = renCons/consumo*100', comentario_fonte: '/* n4: importação tratada como não renovável; exportação abatida da parcela renovável */' },
      { rotulo: 'Corte sobre disponível', unidade: '%', formula: 'perda = (gr+cu)>0 ? cu/(gr+cu)*100 : 0' },
      { rotulo: 'Maior ÷ menor', unidade: null, formula: "razao = mn>0 ? mx/mn : Infinity; isFinite ? nfmt(razao,2)+'×' : '—'" },
      { id: 'i10-v', tipo: 'veredito', classe_fixa: 'att' },
    ],
    cenario_padrao: padrao,
    estados: [padrao, exportador, proximos],
    ramos: [
      { condicao: 'isFinite(razao) && razao>=1.4', exemplo: padrao.leitura },
      { condicao: 'senão', exemplo: proximos.leitura },
      { condicao: 'perda>=8 → acrescenta "Corte de geração elevado…"', exemplo: null, nota: 'no padrão perda = 12/(190+12) = 5,9% (não dispara)' },
      { condicao: 'sx>0 → acrescenta "Sistema importador líquido…"', exemplo: padrao.leitura },
      { condicao: 'sempre → "Regra de atribuição usada no número 4, declarada…"', exemplo: padrao.leitura },
    ],
    script_verbatim: iife('i10 — DECOMPOSITOR DE PENETRAÇÃO', 'i11 — NORMALIZADOR'),
  };
})();
// ramo perda>=8, capturado à parte
{
  const ids = ['i10-cr', 'i10-ct', 'i10-gr', 'i10-gt', 'i10-pk', 'i10-cu', 'i10-sx'];
  setNum('i10-cu', 40);
  i10.ramos[2].exemplo = verdictOf('i10-v');
  i10.ramos[2].nota = 'capturado com corte = 40 TWh (demais no padrão)';
  resetNums(ids); (get(ids[0]).handlers.input || []).forEach((f) => f({}));
}

// ================= i11 =================
const i11 = (() => {
  const { cfg, linha } = cfgBlock('i11 — NORMALIZADOR');
  const ids = cfg.map((c) => c.id);
  const recompute = () => (get(ids[0]).handlers.input || []).forEach((f) => f({}));
  resetNums(ids); recompute();
  const snap = (label) => ({ rotulo_anotacao: label, saidas: readouts('i11-r'), leitura: verdictOf('i11-v') });
  const padrao = snap('padrão (inverte)');
  setNum('i11-ar', 20); const mantem = snap('A · transporte e encargos = 20 (mantém)');
  resetNums(ids); recompute();
  return {
    ...M.i11,
    kind_sugerido: 'comparador',
    entradas: cfg.map(entradaNum), entradas_origem_linha: linha,
    saidas: [
      { rotulo: 'Só energia', formula: "nfmt(ae,1)+' vs '+nfmt(be,1)" },
      { rotulo: '+ transporte e encargos', formula: "nfmt(ae+ar,1)+' vs '+nfmt(be+br,1)" },
      { rotulo: 'Fatura cheia', formula: "nfmt(ae+ar+at,1)+' vs '+nfmt(be+br+bt,1)" },
      { rotulo: 'Δ só energia', unidade: '%', formula: 'd(a,b) = b!==0 ? (a-b)/b*100 : 0 sobre a camada 1' },
      { rotulo: 'Δ fatura cheia', unidade: '%', formula: 'd(c3a,c3b)' },
      { rotulo: 'Mais barato na cheia', formula: "cheaper(a,b) = a<b ? 'A' : (a>b ? 'B' : 'empate')" },
      { id: 'i11-v', tipo: 'veredito', classe_fixa: 'att', formula: "inv = cheaper(c1)!==cheaper(c3) && nenhum 'empate'" },
    ],
    unidade_declarada: 'un/MWh (adimensional, declarado no veredito)',
    cenario_padrao: padrao,
    estados: [padrao, mantem],
    ramos: [{ condicao: 'inv (ordenação inverte entre camadas)', exemplo: padrao.leitura }, { condicao: 'senão', exemplo: mantem.leitura }],
    observacoes: ['A camada intermediária (+ transporte e encargos) é exibida mas não entra no teste de inversão, que compara só a camada 1 com a fatura cheia.'],
    script_verbatim: iife('i11 — NORMALIZADOR', 'i12 — VERIFICADOR'),
  };
})();

// ================= i12 =================
const CAT = L.evalLiteral('var CAT={').valor;
const E12 = L.evalLiteral('var E=[').valor;
const i12 = (() => {
  const estados = E12.map((x, i) => {
    // navega com o filtro "Todos"
    click('i12-fil', 0);
    for (let k = 0; k < i; k++) click('i12-nav', 1);
    const out = get('i12-out').innerHTML;
    return { indice: i + 1, categoria: CAT[x.c].n, cabecalho: L.texto((/<div class="yr">([\s\S]*?)<\/div>/.exec(out) || [])[1]), enunciado_html: x.e, enunciado_texto: L.texto(x.e), linhas: gcmpRows(out) };
  });
  click('i12-fil', 0);
  const filtros = ['Todos', 'Perímetro', 'Atribuição', 'Pressuposto', 'Unidade'];
  return {
    ...M.i12,
    kind_sugerido: 'explorador',
    kind_nota: 'Anotação: filtro + navegação sobre 12 enunciados com análise revelada; nenhum campo de resposta do learner (não é reconstrutor).',
    entradas: [
      { id: 'i12-fil', tipo: 'chips', opcoes: filtros, padrao: 'Todos' },
      { id: 'i12-nav', tipo: 'botões', opcoes: ['← anterior', 'próximo →'], nota: 'Navegação circular dentro da lista filtrada.' },
    ],
    dados: { CAT, E: E12, CAT_origem_linha: L.lineOfScript('var CAT={'), E_origem_linha: L.lineOfScript('var E=[') },
    saidas: [{ id: 'i12-out', tipo: 'painel', rotulos: ['Defeito dominante', 'O que exatamente falta', 'A pergunta que você faz', 'Forma corrigida do enunciado'], cabecalho: "'Enunciado '+(idx+1)+' de '+L.length+' · verdadeiro e insuficiente'" }],
    veredito: null,
    veredito_nota: 'O markup do Instrumento 12 não tem div.verdict; o painel é a saída.',
    cenario_padrao: estados[0],
    estados,
    por_categoria: E12.reduce((a, x) => (a[CAT[x.c].n] = (a[CAT[x.c].n] || 0) + 1, a), {}),
    script_verbatim: iife('i12 — VERIFICADOR DE COMPARAÇÃO', 'QUIZ — 10 questões'),
  };
})();

// ---------- grades estáticas geradas por script ----------
const grades = {
  jg_main: { alvo: '#jg-main', secao: 'map', linhas: [...get('jg-main').innerHTML.matchAll(/<div class="jg-r( core)?"><div class="jg-k">([\s\S]*?)<\/div><div class="jg-v">([\s\S]*?)<\/div><\/div>/g)].map((m) => ({ ficha: !!m[1], rotulo_exibido: L.texto(m[2]), resumo: L.texto(m[3]) })), origem_linha: L.lineOfScript("var box=$id('jg-main')") },
  jg_us: { alvo: '#jg-us', secao: 'a05', aula_id: 'aula-17-05', linhas: [...get('jg-us').innerHTML.matchAll(/<div class="jg-r( core)?"><div class="jg-k">([\s\S]*?)<\/div><div class="jg-v">([\s\S]*?)<\/div><\/div>/g)].map((m) => ({ destaque: !!m[1], rotulo_exibido: L.texto(m[2]), traco: L.texto(m[3]) })), dados_traco: L.evalLiteral('var traco=').valor, origem_linha: L.lineOfScript("var box=$id('jg-us')"), estado_codigo: 'ausente do código (COD-M17-05)' },
  nota: 'Não são instrumentos (não estão em div.inst), mas são conteúdo gerado pelo script. O rótulo exibido é truncado a 24 caracteres + "…" quando o nome passa de 26.',
};

const lista = [i01, i02, i03, i04, i05, i06, i07, i08, i09, i10, i11, i12];

// ---------- divergências ----------
const i09intro = M.i09.instrucao.texto;
const sens = i09.sensibilidade_cenario_padrao_anotacao;
const i05chile = i05.estados.find((e) => /Chile/.test(e.entrada.jurisdicao));
const i08cap = i08.estados[0];
const i08teto = i08.estados.find((e) => /teto e comércio/.test(e.entrada));
const divergencias = [
  { id: 'div-m17-inst-01-i09-sensibilidade', tipo: 'instrução×script', tema: 'Instrumento 09: "a inclusão ou não da parcela elétrica altera o resultado mais do que qualquer outro parâmetro"',
    leitura_a: { onde: `#i09 p.inst-intro L${M.i09.instrucao.origem.linha_aprox}`, texto: i09intro },
    leitura_b: { onde: 'execução do script no cenário padrão (medição desta extração)', texto: `Incluir a indireta (Ferro e aço → Cimento, mesmos números) muda o resultado em +${sens.efeito_incluir_indireta_pct}%; levar o fator de entrada de 5% para 10% muda +${sens.efeito_fator_entrada_5_para_10_pct}%; preço 75→90 €/t muda +${sens.efeito_preco_75_para_90_pct}%.` },
    evidencia: 'Com os valores de partida da própria fonte (direta 1,6; indireta 0,25), a parcela elétrica não é o parâmetro de maior efeito. A frase pode valer para outro cenário (ex.: alumínio primário, citado na Aula 08). Não resolvido.', decisao: 'CONTENT QA (P20)' },
  { id: 'div-m17-inst-02-i03-zero-com-peso', tipo: 'dados do script (rótulo×peso)', tema: 'Instrumento 03: "A parcela que não explica nada aqui: X" com X de peso 1',
    leitura_a: { onde: `<script> var M L${MM.linha_aprox}`, texto: i03.anomalias_dos_dados.filter((a) => a.zero_declarado).map((a) => `${a.par} / ${a.dimensao}: zero='${a.zero_declarado}', peso=${a.peso_da_parcela}`).join('; ') },
    leitura_b: { onde: 'mesma tela (legenda)', texto: 'a legenda exibe "<parcela> 1/10" para a parcela declarada como a que não explica nada' },
    evidencia: 'O próprio veredito diz que os pesos são ordinais e ilustrativos. A regra de renderização trata só peso 0 como segmento "zero".', decisao: 'não resolvida' },
  { id: 'div-m17-inst-03-i05-texto-brasileiro-no-chile', tipo: 'script (ramo)', tema: 'Instrumento 05: ramo leilao_longo_prazo fala de "obrigação de lastro" e das "duas frases erradas" também para o Chile',
    leitura_a: { onde: 'estado Chile', texto: i05chile.leitura.texto },
    leitura_b: { onde: 'estado Chile (dados J)', texto: i05chile.linhas.map((l) => `${l.chave}: ${l.valor_texto}`).join(' | ') },
    evidencia: 'O ramo é escrito para o instrumento brasileiro ("não tem mercado de capacidade" / "mesma coisa com outro nome") e é reusado para o Chile, cuja linha descreve "pagamento por potência de suficiência".', decisao: 'não resolvida' },
  { id: 'div-m17-inst-04-i08-contagem-na-sintese', tipo: 'dados do script (síntese×tabela)', tema: 'Instrumento 08, "Mercado central de capacidade": "Duas das cinco funções mudariam de natureza"',
    leitura_a: { onde: 'MEC[0].s', texto: i08cap.sintese_texto },
    leitura_b: { onde: 'MEC[0].f (estados)', texto: `natureza distinta: ${i08cap.contagem.natureza_distinta}; ausente: ${i08cap.contagem.ausente}; ocupada: ${i08cap.contagem.ocupada}` },
    evidencia: 'A tabela tem 2 "existe, natureza distinta" e 1 "ausente" (preço separado), e o veredito imprime "Funções ausentes: 1 de 5". A síntese conta 2 mudanças. O Ex 11 também diz "duas das cinco funções mudariam de natureza", com outro mapeamento.', decisao: 'não resolvida' },
  { id: 'div-m17-inst-05-i08-teto-classe-ok', tipo: 'script (classe×texto)', tema: 'Instrumento 08, "Sistema de teto e comércio": classe ok com "nenhuma em operação"',
    leitura_a: { onde: 'estado "Sistema de teto e comércio"', texto: `classe ${i08teto.leitura.classe}; ${i08teto.leitura.texto.slice(0, 120)}…` },
    leitura_b: { onde: 'regra de classe', texto: "aus>=3 ? 'per' : (aus>=1 ? 'att' : 'ok') — todas as 5 são 'dif', aus=0" },
    evidencia: 'A classe visual de "ok" acompanha "Cinco funções previstas e nenhuma em operação". Registro (a cor não é texto; conflita com S2/zero semáforo na camada de produto).', decisao: 'não resolvida' },
  { id: 'div-m17-inst-06-i04-quatro-perguntas', tipo: 'instrução×script', tema: 'Instrumento 04: "quatro perguntas"',
    leitura_a: { onde: `#i04 p.inst-intro`, texto: M.i04.instrucao.texto },
    leitura_b: { onde: 'script', texto: `3 chips (${VIS.map((v) => v.label).join(' / ')}) e 4 linhas (Despacho, Granularidade, Risco de volume, Dotação relevante)` },
    evidencia: 'A instrução lista quem despacha, critério, granularidade e risco; o painel mostra "Dotação relevante" em vez de separar critério.', decisao: 'não resolvida' },
  { id: 'div-m17-inst-07-i05-cada-jurisdicao', tipo: 'instrução×script', tema: 'Instrumento 05: "Para cada jurisdição"',
    leitura_a: { onde: '#i05 p.inst-intro', texto: M.i05.instrucao.texto },
    leitura_b: { onde: 'script', texto: `chips só das ${core.length} jurisdições com ficha (J.filter(core)); a grade tem ${J.valor.length}` },
    evidencia: 'Mesmo recorte no Instrumento 04. O Instrumento 01 usa as 17.', decisao: 'não resolvida' },
  { id: 'div-m17-inst-08-i07-regua', tipo: 'fonte×fonte', tema: 'Rótulos da "régua de cinco posições do Módulo 16"',
    leitura_a: { onde: 'Instrumento 07 POS', texto: Object.values(POS).map((p) => p.n).join(' · ') },
    leitura_b: { onde: 'ficha Brasil / §Lex / caso', texto: 'regulado e não construído' },
    evidencia: 'Ver aparato.json div-m17-ap-04. O item "Sistema brasileiro de comércio de emissões" é posicionado em "Regulamentado" e a nota diz "Estágio: regulado e não construído".', decisao: 'não resolvida' },
  { id: 'div-m17-inst-09-catalogo-descricoes', tipo: 'catálogo×fonte', tema: 'Descrições do catálogo canônico',
    leitura_a: { onde: 'catalogo-modulos-alexandria.md', texto: 'descrições dos 12 instrumentos parafraseiam a instrução (p.inst-intro)' },
    leitura_b: { onde: 'fonte', texto: 'títulos conferem 12/12 (o 12 com "(instrumento assinatura)" em vez de "· instrumento assinatura")' },
    evidencia: 'Registro: o catálogo é descritivo, não literal.', decisao: 'nenhuma' },
  // [verificação 2026-09-17] acrescentada pelo verificador adversarial
  { id: 'div-m17-inst-10-i12-entidade-escapada', tipo: 'script (escape duplo)', tema: 'Instrumento 12, enunciado 2: "Forma corrigida do enunciado" exibe entidades HTML como texto',
    leitura_a: { onde: '<script> i12 E[1].corr L5100', texto: "corr:'Dois agregados chamados &ldquo;tarifa industrial média&rdquo; diferem em 30%. …'" },
    leitura_b: { onde: '<script> i12 render() L5156', texto: "['Forma corrigida do enunciado', esc(x.corr)]" },
    evidencia: 'esc() (L4101) troca & por &amp;; o innerHTML fica "&amp;ldquo;…&amp;rdquo;" e o learner vê os caracteres "&ldquo;" e "&rdquo;" literais em vez de aspas. É o único dos 12 corr (e dos 12 perg, também passados por esc) com entidade. Capturado assim em estados[1].linhas[3]. CONTENT QA (P20).', decisao: 'não resolvida' },
];

const out = {
  grupo: 'instrumentos',
  modulo: 'M17',
  fonte: { arquivo: L.SRC, linhas_total: L.LINHAS_TOTAL, bytes: L.BYTES },
  gerado_por: 'extratores/m17_instrumentos.mjs',
  metodo: 'Markup (título, instrução, alvos, nota de fonte, ponto de invocação) pelo DOM próprio; dados pelo literal do <script> avaliado com vm; saídas e textos de leitura capturados executando os dois <script> originais num DOM simulado (lib.runOriginal), estado a estado (protocolo §10). Nenhum veredito digitado. `formula` é o trecho de cálculo do script, recortado/condensado; `script_verbatim` traz o bloco inteiro literal.',
  convencoes: {
    numeros: 'Formatação exibida = nfmt (toLocaleString pt-BR com casas fixas), capturada da execução.',
    kind_sugerido: 'anotação pela taxonomia (docs/alexandria/instrument-taxonomy.md), a confirmar na porta',
    estado_codigo: 'portado | não portado | divergente',
    anotacao: 'campos *_anotacao, *_nota, observacoes, kind_* e divergencias.evidencia não são texto da fonte',
  },
  resumo: lista.map((x) => ({ id: x.id, rotulo: x.rotulo, titulo: x.titulo.texto, secao: x.secao, aula_id: x.aula_id, kind_sugerido: x.kind_sugerido, entradas: x.entradas.length, fonte_dos_numeros: !!x.fonte_dos_numeros, estado_codigo: x.estado_codigo, catalogo_titulo_igual: x.catalogo_canonico && x.catalogo_canonico.titulo_igual_fonte })),
  instrumentos: lista,
  grades_geradas_por_script: grades,
  comparacao_codigo: { ...codeCheck, conclusao: '0 de 12 portados; nenhum divergente (não há o que comparar).' },
  divergencias,
  contagens: {
    instrumentos: lista.length, em_aula: lista.filter((x) => !x.fora_de_aula).length, fora_de_aula: lista.filter((x) => x.fora_de_aula).length,
    numericos: [i06, i09, i10, i11].length, categoricos: 8,
    entradas_numericas: [i06, i09, i10, i11].reduce((a, x) => a + x.entradas.filter((e) => e.tipo && e.tipo.startsWith('number')).length, 0),
    estados_capturados: lista.reduce((a, x) => a + ((x.estados || x.estados_exemplo || []).length), 0),
    com_fonte_dos_numeros: lista.filter((x) => x.fonte_dos_numeros).length,
    com_tolerancia_declarada: 0,
    portados: 0, nao_portados: lista.length, divergentes: 0,
    mencoes_no_texto: lista.reduce((a, x) => a + x.mencoes_no_texto.length, 0),
    divergencias: divergencias.length,
  },
};
L.writeJSON('instrumentos.json', out);
console.log(JSON.stringify(out.contagens));
console.log(JSON.stringify(out.resumo.map((r) => [r.id, r.aula_id, r.kind_sugerido, r.entradas, r.catalogo_titulo_igual])));
console.log('i06', JSON.stringify(i06.cenario_padrao.saidas));
console.log('i09', JSON.stringify(i09.cenario_padrao.saidas), JSON.stringify(sens));
console.log('i10', JSON.stringify(i10.cenario_padrao.saidas));
console.log('i11', JSON.stringify(i11.cenario_padrao.saidas));
console.log('i02 classes', JSON.stringify(i02.classes_medidas_sobre_128_combinacoes));
console.log('i03 anom', i03.anomalias_dos_dados.length, 'i04 ramos', i04.ramos_distintos);
console.log('mencoes', lista.map((x) => x.id + ':' + x.mencoes_no_texto.map((m) => m.secao + '@' + m.linha_aprox).join(',')).join(' '));
console.log(i12.estados.map((e) => e.cabecalho).join(' | '));
console.log(i02.cenario_padrao.leitura.texto.slice(0, 200));
