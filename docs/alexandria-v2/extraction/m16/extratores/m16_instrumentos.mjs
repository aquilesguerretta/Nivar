// Extrator deterministico dos 11 instrumentos do M16 -> instrumentos.json
// Marcacao: div.inst (L1312..L3349). Logica e dados: <script> (L4898..L5818).
// Saidas no cenario-padrao e ramos alcancados vem da EXECUCAO do script original num DOM simulado
// (lib.mjs/runScript), nao de reimplementacao.
import {
  html, LINES, lineOf, inline, texto, hx, origem, pad, all, divBlock, secao, SCRIPT_BASE, SCRIPT_END,
  evalVar, runScript, clickSeg, clickChip, setField, writeJson, read, CODE, decode,
} from './lib.mjs';

const SEC_ORDER = ['map', 'a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'a08', 'a09', 'a10'];

// ---------- localizar cada div.inst e o contexto de invocacao ----------
function contexto(secId, instIdx) {
  const s = secao(secId);
  const secid = /<div class="sec-id">([\s\S]*?)<\/div>/.exec(s.body);
  const h2 = /<h2>([\s\S]*?)<\/h2>/.exec(s.body);
  const antes = html.slice(s.start, instIdx);
  const h3s = all(/<h3[^>]*>([\s\S]*?)<\/h3>/g, antes, s.start);
  const h3 = h3s.length ? h3s[h3s.length - 1] : null;
  // ultimo bloco de texto imediatamente antes do instrumento (p, div.fx, div.box, div.chain, div.lv)
  const tail = antes.replace(/\s+$/, '');
  const blocos = all(/<(p|div class="fx"|div class="box[^"]*"|div class="chain"|div class="lv"|div class="grg"|div class="esc")[^>]*>/g, antes, s.start);
  let anterior = null;
  if (blocos.length) {
    const last = blocos[blocos.length - 1];
    const blk = last.m[1] === 'p' ? html.slice(last.idx, html.indexOf('</p>', last.idx) + 4) : divBlock(html, last.idx);
    anterior = {
      tipo: last.m[1].replace(/^div class="/, 'div.').replace(/"$/, '').replace(/ /g, '.'),
      trecho_final: texto(blk).slice(-160),
      origem: origem(last.m[1] === 'p' ? 'p' : last.m[1], texto(blk).slice(0, 60), last.idx),
    };
  }
  const depoisIdx = instIdx + divBlock(html, instIdx).length;
  const depois = html.slice(depoisIdx, s.end);
  const prox = /<(h3|p|div class="[^"]*")[^>]*>/.exec(depois);
  let seguinte = null;
  if (prox) {
    const at = depoisIdx + prox.index;
    const blk = prox[1] === 'p' ? html.slice(at, html.indexOf('</p>', at) + 4)
      : prox[1] === 'h3' ? html.slice(at, html.indexOf('</h3>', at) + 5) : divBlock(html, at);
    seguinte = { tipo: prox[1].replace(/^div class="/, 'div.').replace(/"$/, '').replace(/ /g, '.'), trecho_inicial: texto(blk).slice(0, 160), origem: origem(prox[1], texto(blk).slice(0, 60), at) };
  }
  return {
    secao_id: secId,
    sec_id: { ...hx(secid[1]), origem: origem(`section#${secId} .sec-id`, texto(secid[1]), s.start + secid.index) },
    h2: { ...hx(h2[1]), origem: origem(`section#${secId} h2`, texto(h2[1]).slice(0, 60), s.start + h2.index) },
    aula: /^a\d\d$/.test(secId) ? `aula-16-${secId.slice(1)}` : null,
    subsecao_anterior: h3 ? { ...hx(h3.m[1]), origem: origem(`section#${secId} h3`, texto(h3.m[1]).slice(0, 60), h3.idx) } : null,
    bloco_imediatamente_anterior: anterior,
    bloco_imediatamente_seguinte: seguinte,
  };
}

function parseMarkup(blk, base) {
  const idm = /<span class="id">([\s\S]*?)<\/span><span class="nm">([\s\S]*?)<\/span>/.exec(blk);
  const intro = /<p class="inst-intro">([\s\S]*?)<\/p>/.exec(blk);
  const disc = /<p class="disc">([\s\S]*?)<\/p>/.exec(blk);
  // seletores (seg-lb seguido de seg)
  const seletores = all(/<div class="seg-lb"[^>]*>([\s\S]*?)<\/div>\s*<div class="seg" id="([^"]+)">([\s\S]*?)<\/div>/g, blk, base)
    .map(({ m, idx }) => ({
      tipo: 'seletor-segmentado',
      id_fonte: m[2],
      rotulo: hx(m[1]),
      opcoes: all(/<button([^>]*)>([\s\S]*?)<\/button>/g, m[3]).map(({ m: b }) => {
        const da = /data-(\w+)="([^"]*)"/.exec(b[1]);
        return { atributo: `data-${da[1]}`, valor: da[2], rotulo: texto(b[2]), padrao: /class="on"/.test(b[1]) };
      }),
      origem: origem(`div.seg#${m[2]}`, texto(m[1]), idx),
    }));
  const campos = all(/<div class="field"><div class="field-label"><span>([\s\S]*?)<\/span><span\s+class="unit">([\s\S]*?)<\/span><\/div>\s*<input([^>]*)>\s*<input([^>]*)><\/div>/g, blk, base)
    .map(({ m, idx }) => {
      const at = (s) => Object.fromEntries(all(/(\w+)="([^"]*)"/g, s).map(({ m: a }) => [a[1], a[2]]));
      const n = at(m[3]), r = at(m[4]);
      return {
        tipo: 'numero-com-deslizador-gemeo',
        rotulo: texto(m[1]), unidade: texto(m[2]),
        numero: { id_fonte: n.id, min: n.min, max: n.max, step: n.step, value: n.value },
        deslizador: { id_fonte: r.id, min: r.min, max: r.max, step: r.step, value: r.value },
        faixas_iguais: n.min === r.min && n.max === r.max,
        passos_iguais: n.step === r.step,
        origem: origem('div.field', texto(m[1]), idx),
      };
    });
  const readouts = all(/<div class="ro"><div class="k">([\s\S]*?)<\/div><div\s+class="([^"]*)"\s+id="([^"]+)">/g, blk, base)
    .map(({ m, idx }) => ({ id_fonte: m[3], rotulo: hx(m[1]), classe: m[2].replace(/\s+/g, ' '), origem: origem('div.readout .ro', texto(m[1]), idx) }));
  const duais = all(/<div class="dc (\w)"><div class="dk">([\s\S]*?)<\/div><div class="dv"\s+id="([^"]+)">[\s\S]*?<\/div><div class="dm" id="([^"]+)">/g, blk, base)
    .map(({ m, idx }) => ({ coluna: m[1], rotulo: texto(m[2]), id_valor: m[3], id_memoria: m[4], origem: origem('div.dual .dc', texto(m[2]), idx) }));
  const ids = all(/<div[^>]*\bid="([^"]+)"[^>]*>/g, blk, base).map(({ m }) => ({ id: m[1], classe: (/class="([^"]*)"/.exec(m[0]) || [])[1] || null }));
  return {
    codigo_fonte: texto(idm[1]),
    titulo: { ...hx(idm[2]), origem: origem('div.inst .inst-hd span.nm', texto(idm[2]).slice(0, 60), base + idm.index) },
    intro: { ...hx(intro[1]), origem: origem('div.inst p.inst-intro', texto(intro[1]).slice(0, 60), base + intro.index) },
    nota_de_rodape: disc ? { ...hx(disc[1]), origem: origem('div.inst p.disc', texto(disc[1]).slice(0, 60), base + disc.index) } : null,
    seletores, campos, readouts, duais,
    alvos_dinamicos: ids.filter((x) => !seletores.some((s) => s.id_fonte === x.id)),
  };
}

// ---------- script: bloco de cada instrumento ----------
function blocoScript(nn) {
  const tag = `/* ===================== INST·${nn} `;
  const a = html.indexOf(tag, SCRIPT_BASE);
  if (a < 0) throw new Error('script INST ' + nn);
  const b = html.indexOf('/* =====================', a + tag.length);
  const end = b < 0 || b > SCRIPT_END ? SCRIPT_END : b;
  const la = lineOf(a), lb = lineOf(end) - 1;
  return { idx: a, end, linha_ini: la, linha_fim: lb, cabecalho: LINES[la - 1].trim() };
}
const linhas = (la, lb) => {
  const out = [];
  for (let i = la; i <= lb; i++) if (LINES[i - 1].trim()) out.push({ linha: i, codigo: decode(LINES[i - 1]).replace(/\s+$/, '') });
  return out;
};
function comentarioIntervalos(sb) {
  const c = html.slice(sb.idx, sb.end);
  const m = /\*\/\s*\n(\/\*[\s\S]*?\*\/)/.exec(c);
  if (!m || c.indexOf(m[1]) > c.indexOf('(function')) return null;
  const at = sb.idx + c.indexOf(m[1]);
  return { texto: m[1], origem: origem('<script> comentario antes do IIFE', m[1].slice(0, 60), at) };
}
// para instrumentos numericos: leitura, calculo, formato, veredito — linhas verbatim
function logicaNumerica(sb) {
  const L = linhas(sb.linha_ini, sb.linha_fim);
  const upd = L.findIndex((x) => /function upd\(\)\{/.test(x.codigo));
  const vdAt = L.findIndex((x) => /var vd=\$id\(/.test(x.codigo));
  const leitura = L.filter((x, i) => i > upd && /numOf\(|segVal\(/.test(x.codigo));
  const calculo = L.filter((x, i) => i > upd && i < vdAt && /^\s*var\s/.test(x.codigo) && !/numOf\(|segVal\(/.test(x.codigo));
  const formato = L.filter((x, i) => i > upd && i < vdAt && /\$id\('[^']+'\)\.(innerHTML|textContent)\s*=/.test(x.codigo));
  const barras = [];
  const bi = L.findIndex((x) => /bars\('/.test(x.codigo));
  if (bi >= 0) for (let i = bi; i < L.length; i++) { barras.push(L[i]); if (/\]\);/.test(L[i].codigo)) break; }
  const fim = L.findIndex((x, i) => i > vdAt && /vd\.innerHTML\s*=/.test(x.codigo));
  const veredito = L.slice(vdAt, fim + 1);
  const eventos = L.filter((x) => /pair\(|segBind\(/.test(x.codigo) && !/function /.test(x.codigo));
  return { leitura_das_entradas: leitura, calculo, formatacao_das_saidas: formato, barras, veredito_codigo: veredito, ligacao_de_eventos: eventos };
}

// ---------- amostragem de ramos (numericos) ----------
function lcg(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
const assinatura = (vd) => (vd.className + ' :: ' + (vd.innerHTML.match(/<b>[^<]*<\/b>/g) || []).filter((b) => !/^<b>(O veredito cruza|Este instrumento|E a recusa central|Os cinco números|Apenas o penúltimo|Nota sobre)/.test(b)).join(' + '));
function amostrarRamos(prefixo, campos, extraSeg = null, n = 4000) {
  const rnd = lcg(16);
  const achados = new Map();
  const grade = (c) => {
    const min = +c.numero.min, max = +c.numero.max, st = +c.numero.step;
    const k = Math.round((max - min) / st);
    return (u) => +(min + Math.round(u * k) * st).toFixed(6);
  };
  const g = campos.map(grade);
  const dom = runScript(); // um DOM por instrumento: upd() relê todos os campos a cada evento
  const tentar = (vals, seg) => {
    if (seg) clickSeg(dom, seg.id, seg.attr, seg.val);
    campos.forEach((c, i) => setField(dom, c.numero.id_fonte, vals[i]));
    const vd = dom.byId[`${prefixo}-vd`];
    const sig = assinatura(vd) + (seg ? ` @ ${seg.id}=${seg.val}` : "");
    if (!achados.has(sig)) achados.set(sig, { assinatura: sig, classe: vd.className, entradas: Object.fromEntries(campos.map((c, i) => [c.numero.id_fonte, vals[i]])), seletor: seg ? `${seg.id}=${seg.val}` : null, veredito_html: vd.innerHTML, veredito_texto: texto(vd.innerHTML) });
  };
  const segs = extraSeg ? extraSeg.valores.map((v) => ({ id: extraSeg.id, attr: extraSeg.attr, val: v })) : [null];
  // cantos (2^k) e amostra aleatoria
  const k = campos.length;
  for (const seg of segs) {
    for (let mask = 0; mask < (1 << k); mask++) tentar(campos.map((c, i) => ((mask >> i) & 1 ? +c.numero.max : +c.numero.min)), seg);
    for (let t = 0; t < n; t++) tentar(g.map((f) => f(rnd())), seg);
  }
  return [...achados.values()].sort((a, b) => a.assinatura.localeCompare(b.assinatura));
}

// ---------- cenario-padrao ----------
function cenarioPadrao(dom, parsed, prefixoVd) {
  const saidas = parsed.readouts.map((r) => ({ id_fonte: r.id_fonte, rotulo: r.rotulo.texto, html: dom.byId[r.id_fonte].innerHTML, texto: texto(dom.byId[r.id_fonte].innerHTML) }));
  const duais = parsed.duais.flatMap((d) => [d.id_valor, d.id_memoria]).map((id) => ({ id_fonte: id, html: dom.byId[id].innerHTML, texto: texto(dom.byId[id].innerHTML) }));
  const vd = prefixoVd ? dom.byId[prefixoVd] : null;
  return {
    entradas: Object.fromEntries(parsed.campos.map((c) => [c.numero.id_fonte, c.numero.value]).concat(parsed.seletores.map((s) => [s.id_fonte, s.opcoes.find((o) => o.padrao)?.valor ?? null]))),
    saidas: saidas.concat(duais),
    veredito: vd ? { classe: vd.className, html: vd.innerHTML, texto: texto(vd.innerHTML) } : null,
    barras_html: parsed.alvos_dinamicos.filter((x) => x.classe === 'bars').map((x) => ({ id_fonte: x.id, html: dom.byId[x.id].innerHTML })),
    metodo: 'execucao do <script> original em DOM simulado (extratores/lib.mjs), valores do markup como semente — os mesmos que o navegador usa no primeiro paint',
  };
}

// ---------- estado no codigo ----------
const conteudo = read(CODE.conteudo);
const calc = read(CODE.calculadoras);
const instArr = /export const MODULO_16_INSTRUMENTOS: Instrument\[\] = \[\];/.test(conteudo);
const aulasInstVazios = (conteudo.match(/instruments: \[\],/g) || []).length;
const codigoAtual = (nn) => ({
  status: 'não portado',
  evidencia: [
    `alexandria-modulo-16-content.ts: MODULO_16_INSTRUMENTOS é array vazio (${instArr ? 'confirmado' : 'NÃO confirmado'})`,
    `alexandria-modulo-16-content.ts: ${aulasInstVazios} de 10 aulas com instruments: []`,
    `alexandria-instrument-calculators.ts: ${/m16|inst-16|modulo-16/i.test(calc) ? 'há menção a m16 — conferir' : 'nenhuma calculadora com id do M16'}`,
    'RecursosDoModulo.tsx: sem entrada para modulo-16',
  ],
  nota: nn === '01' ? 'O comentário do código chama MODULO_16_INSTRUMENTOS de "Instrumento de MÓDULO — o do § MAP, fora de qualquer aula", mas o array está vazio.' : null,
});

// ---------- montar ----------
const instIdxs = all(/<div class="inst">/g, html).map((x) => x.idx);
const out = [];
const domPadrao = runScript();

for (const idx of instIdxs) {
  const blk = divBlock(html, idx);
  const p = parseMarkup(blk, idx);
  const nn = p.codigo_fonte.replace(/\D/g, '');
  const secId = SEC_ORDER.filter((s) => secao(s).start < idx).pop();
  const ctx = contexto(secId, idx);
  const sb = blocoScript(nn);
  const base = {
    id: `m16-inst-${nn}`,
    tipo: 'instrumento',
    camada: 'fonte',
    codigo_fonte: p.codigo_fonte,
    titulo: p.titulo,
    escopo: ctx.aula ? 'aula' : 'modulo',
    invocacao: ctx,
    pergunta: null,
    nota_pergunta: 'O instrumento não formula pergunta própria ao learner: o markup traz só a instrução (p.inst-intro). Nenhuma pergunta foi derivada aqui (camada fonte).',
    intro: p.intro,
    nota_de_rodape: p.nota_de_rodape,
    marcacao: { origem: origem('div.inst', p.codigo_fonte, idx), linha_ini: lineOf(idx), linha_fim: lineOf(idx + blk.length), alvos_dinamicos: p.alvos_dinamicos },
    script: { cabecalho: sb.cabecalho, linha_ini: sb.linha_ini, linha_fim: sb.linha_fim, comentario_de_intervalos: comentarioIntervalos(sb) },
    tolerancias: null,
    nota_tolerancias: 'A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).',
    codigo_atual: codigoAtual(nn),
  };
  out.push({ nn, base, p, sb, ctx });
}

// ---- detalhes por instrumento ----
const TND = domPadrao.TND;
const R = {};
for (const { nn, base, p, sb } of out) {
  const d = { ...base };
  const start = sb.idx;
  if (nn === '01') {
    const ORD = evalVar(start, 'ORD'), ROT = evalVar(start, 'ROT'), D = evalVar(start, 'D'), LAB = evalVar(start, 'LAB');
    d.mecanica = 'anotação: seletor de dimensão (4) × chip de tendência (6) → painel de texto fixo; sem cálculo, sem veredito computado';
    d.entradas = [...p.seletores, { tipo: 'chips-gerados-pelo-script', id_fonte: 'mp-chips', opcoes: 'as seis tendências, na ordem de ORD[dimensão], com o rótulo ROT[dimensão][tendência]' }];
    d.dados = {
      TND: { valor: TND, origem: origem('<script> var TND', 'var TND={', html.indexOf('var TND=')) },
      ORD: { valor: ORD.val, linhas: [ORD.linha_ini, ORD.linha_fim] },
      ROT: { valor: ROT.val, linhas: [ROT.linha_ini, ROT.linha_fim] },
      LAB: { valor: LAB.val, linhas: [LAB.linha_ini, LAB.linha_fim] },
      D: { valor: D.val, linhas: [D.linha_ini, D.linha_fim], campos: { t: 'título do painel', d: 'corpo', f: 'nota de leitura' } },
    };
    d.saidas = [
      { id_fonte: 'mp-flux', descricao: 'anotação: fila ordenada 1º..6º com a primeira palavra do nome da tendência e ROT', codigo: linhas(lineOf(html.indexOf('function fluxPara', start)), lineOf(html.indexOf('function render(d,k)', start)) - 1) },
      { id_fonte: 'mp-panel', descricao: 'anotação: painel LAB[d] / nome — D[d][k].t / D[d][k].d / "Nota de leitura" + D[d][k].f', codigo: linhas(lineOf(html.indexOf('function painel(d,k)', start)), lineOf(html.indexOf('function fluxPara', start)) - 1) },
    ];
    d.textos_fixos_do_script = [{ texto: 'Nota de leitura', origem: origem('<script> INST·01 painel()', '<b>Nota de leitura</b>', html.indexOf('Nota de leitura', start)) }];
    // render exaustivo
    const dom = runScript();
    d.renderizacoes = [];
    for (const dim of Object.keys(ORD.val)) {
      clickSeg(dom, 'mp-dim', 'data-d', dim);
      const flux = texto(dom.byId['mp-flux'].innerHTML);
      for (const k of ORD.val[dim]) {
        clickChip(dom, 'mp-chips', 't', k);
        d.renderizacoes.push({ dimensao: dim, tendencia: k, painel_texto: texto(dom.byId['mp-panel'].innerHTML), fila_texto: flux });
      }
    }
    d.cenario_padrao = { entradas: { 'mp-dim': 'est', 'mp-chips': 'ele' }, painel_texto: texto(domPadrao.byId['mp-panel'].innerHTML), fila_texto: texto(domPadrao.byId['mp-flux'].innerHTML) };
    d.fonte_dos_numeros = { texto: texto(p.nota_de_rodape.html), nota: 'A fonte diz que as fontes por tendência estão declaradas no painel (campo D[...].f); não há referência bibliográfica ligada.' };
    d.leitura_complementar = (() => {
      const s = secao('map'); const m = /<div class="box cy">\s*<span class="tag">([\s\S]*?)<\/span>\s*<p>([\s\S]*?)<\/p>/.exec(s.body);
      return { rotulo: texto(m[1]), ...hx(m[2]), origem: origem('section#map div.box.cy (após INST·01)', texto(m[1]), s.start + m.index) };
    })();
    d.contagens = { dimensoes: 4, tendencias: 6, paineis: 24 };
  }
  if (nn === '02') {
    const POS = evalVar(start, 'POS'), REAL = evalVar(start, 'REAL'), DISP = evalVar(start, 'DISP');
    d.mecanica = 'anotação: seletor de tendência (6) × posição (5) → 3 cartões de texto + veredito por comparação p vs REAL[t] (3 ramos)';
    d.entradas = p.seletores;
    d.dados = {
      POS: { valor: POS.val, linhas: [POS.linha_ini, POS.linha_fim] },
      REAL: { valor: REAL.val, linhas: [REAL.linha_ini, REAL.linha_fim], comentario_fonte: '/* posição real de cada tendência em 04/08/2026 */' },
      DISP: { valor: DISP.val, linhas: [DISP.linha_ini, DISP.linha_fim] },
    };
    d.saidas = [{ id_fonte: 'rg-out', rotulos_fixos: ['Posição testada', 'Evidência que esta posição exigiria', 'Evidência disponível em 04/08/2026'] }, { id_fonte: 'rg-vd', tipo: 'veredito' }];
    d.veredito_codigo = linhas(lineOf(html.indexOf("var vd=$id('rg-vd')", start)), lineOf(html.indexOf("segBind('rg-tnd'", start)) - 2);
    const dom = runScript();
    d.renderizacoes = [];
    for (const t of Object.keys(REAL.val)) for (const pp of ['1', '2', '3', '4', '5']) {
      clickSeg(dom, 'rg-tnd', 'data-t', t); clickSeg(dom, 'rg-pos', 'data-p', pp);
      const vd = dom.byId['rg-vd'];
      d.renderizacoes.push({ tendencia: t, posicao: +pp, ramo: vd.className, cartoes_texto: texto(dom.byId['rg-out'].innerHTML), veredito_html: vd.innerHTML, veredito_texto: texto(vd.innerHTML) });
    }
    d.cenario_padrao = { entradas: { 'rg-tnd': 'ele', 'rg-pos': '1' }, veredito: { classe: domPadrao.byId['rg-vd'].className, texto: texto(domPadrao.byId['rg-vd'].innerHTML) } };
    d.fonte_dos_numeros = { texto: null, nota: 'Os números de DISP (215.023, 167.026, 25.429, 21.061, 627 GWh, 7,8 TWh, 38 GW, 7,1 GW, R$ 159 bilhões, 26,3 GW, 1,2%–12,9%) não trazem referência ligada no instrumento; a nota de rodapé declara só a data de classificação. Várias descrições coincidem com itens do § Ref (ver aparato.json), sem vínculo declarado.' };
    d.contagens = { tendencias: 6, posicoes: 5, celulas: 30, ramos_veredito: 3 };
  }
  if (nn === '03') {
    const CAND = evalVar(start, 'CAND'), VINC = evalVar(start, 'VINC'), G = evalVar(start, 'G');
    d.mecanica = 'anotação: seletor de tendência (6) → 5 linhas (vincula / não vincula, texto G[t][c]) + veredito fixo com nome do candidato';
    d.entradas = p.seletores;
    d.dados = { CAND: { valor: CAND.val, linhas: [CAND.linha_ini, CAND.linha_fim] }, VINC: { valor: VINC.val, linhas: [VINC.linha_ini, VINC.linha_fim] }, G: { valor: G.val, linhas: [G.linha_ini, G.linha_fim], nota: 'valores contêm HTML inline (<b>) inserido sem esc()' } };
    d.saidas = [{ id_fonte: 'gg-out', rotulos_fixos: ['Vincula', 'Não vincula'] }, { id_fonte: 'gg-vd', tipo: 'veredito' }];
    d.veredito_codigo = linhas(lineOf(html.indexOf("var nome=CAND", start)), lineOf(html.indexOf("segBind('gg-tnd'", start)) - 2);
    const dom = runScript();
    d.renderizacoes = Object.keys(VINC.val).map((t) => { clickSeg(dom, 'gg-tnd', 'data-t', t); return { tendencia: t, linhas_texto: texto(dom.byId['gg-out'].innerHTML), veredito_html: dom.byId['gg-vd'].innerHTML, veredito_texto: texto(dom.byId['gg-vd'].innerHTML), classe: dom.byId['gg-vd'].className }; });
    d.cenario_padrao = { entradas: { 'gg-tnd': 'ele' }, veredito: { classe: domPadrao.byId['gg-vd'].className, texto: texto(domPadrao.byId['gg-vd'].innerHTML) } };
    d.fonte_dos_numeros = { texto: null, nota: 'Nenhuma referência ligada; a nota de rodapé declara a data de classificação (4 de agosto de 2026).' };
    d.contagens = { tendencias: 6, candidatos: 5, combinacoes: 30, ramos_veredito: 1 };
  }
  if (nn === '07') {
    const Lx = evalVar(start, 'L'), CLS = evalVar(start, 'CLS');
    d.mecanica = 'anotação: chips (um por dispositivo, 15) → painel de texto (data, nome, estado, corpo, "A pergunta que você faz")';
    d.entradas = [{ tipo: 'chips-gerados-pelo-script', id_fonte: 'cb-chips', opcoes: Lx.val.map((o) => ({ valor: o.k, rotulo: o.n, rotulo_secundario: o.y })) }];
    d.dados = { L: { valor: Lx.val, linhas: [Lx.linha_ini, Lx.linha_fim], entidades_decodificadas: Lx.entidades_decodificadas, nota_entidades: 'L[12].q traz "veda&ccedil;ão" no script (entidade misturada a caractere cru); o navegador a decodifica porque o.q entra por innerHTML sem esc(). Valor guardado decodificado.', campos: { k: 'chave', n: 'nome', y: 'data', est: 'código de estado (classe CSS)', e: 'rótulo de estado', d: 'corpo', q: 'pergunta (inserida sem esc())' } }, CLS: { valor: CLS.val, linhas: [CLS.linha_ini, CLS.linha_fim] } };
    d.saidas = [{ id_fonte: 'cb-panel', rotulos_fixos: ['A pergunta que você faz'] }];
    const dom = runScript();
    d.renderizacoes = Lx.val.map((o) => { clickChip(dom, 'cb-chips', 'c', o.k); return { dispositivo: o.k, painel_texto: texto(dom.byId['cb-panel'].innerHTML) }; });
    d.cenario_padrao = { entradas: { 'cb-chips': Lx.val[0].k }, painel_texto: texto(domPadrao.byId['cb-panel'].innerHTML) };
    d.fonte_dos_numeros = { texto: null, nota: 'Datas e dispositivos sem referência ligada no instrumento; coincidem com itens do § Ref (Lei nº 15.042/2024, decreto de 16/10/2025, resoluções do comitê de 11/05/2026, proposta de 19/05/2026, consulta até 28/08/2026), sem vínculo declarado.' };
    d.contagens = { dispositivos: Lx.val.length, por_codigo_estado: Lx.val.reduce((a, o) => ((a[o.est] = (a[o.est] || 0) + 1), a), {}) };
  }
  if (nn === '10') {
    const ELO = evalVar(start, 'ELO'), GP = evalVar(start, 'GP');
    d.mecanica = 'anotação: seletor de tendência (6) × elo (5) → capacidade exigida + 3 perguntas + caixa fixa "O que este painel não faz"';
    d.entradas = p.seletores;
    d.dados = { ELO: { valor: ELO.val, linhas: [ELO.linha_ini, ELO.linha_fim] }, GP: { valor: GP.val, linhas: [GP.linha_ini, GP.linha_fim], campos: { c: 'capacidade exigida', q: 'três perguntas de verificação' } } };
    const fixo = /<div class="box rd" style="margin-top:14px"><span class="tag">([^<]*)<\/span>'\+\s*'<p>([^<]*)<\/p>/.exec(html.slice(start, sb.end));
    d.textos_fixos_do_script = [
      { texto: 'Capacidade exigida para ocupar este elo', origem: origem('<script> INST·10 render()', 'Capacidade exigida para ocupar este elo', html.indexOf('Capacidade exigida para ocupar este elo', start)) },
      { texto: 'Três perguntas de verificação — resposta em documento, número ou data', origem: origem('<script> INST·10 render()', 'Três perguntas de verificação', html.indexOf('Três perguntas de verificação', start)) },
      { rotulo: decode(fixo[1]), texto: decode(fixo[2]), origem: origem('<script> INST·10 render() box rd', decode(fixo[1]), start + fixo.index) },
    ];
    const dom = runScript();
    d.renderizacoes = [];
    for (const t of Object.keys(GP.val)) for (const e of Object.keys(ELO.val)) { clickSeg(dom, 'gp-tnd', 'data-t', t); clickSeg(dom, 'gp-elo', 'data-e', e); d.renderizacoes.push({ tendencia: t, elo: e, painel_texto: texto(dom.byId['gp-out'].innerHTML) }); }
    d.cenario_padrao = { entradas: { 'gp-tnd': 'ele', 'gp-elo': 'fab' }, painel_texto: texto(domPadrao.byId['gp-out'].innerHTML) };
    d.fonte_dos_numeros = { texto: null, nota: 'Não há números de mercado; as perguntas não citam fonte.' };
    d.contagens = { tendencias: 6, elos: 5, combinacoes: 30, perguntas: 90 };
  }
  if (nn === '11') {
    const E = evalVar(start, 'E'), DF = evalVar(start, 'DF');
    d.mecanica = 'anotação: filtro por defeito (5) → chips dos enunciados filtrados → cartão (enunciado, defeito dominante, o que falta, pergunta, forma corrigida, nota fixa)';
    d.entradas = [...p.seletores, { tipo: 'chips-gerados-pelo-script', id_fonte: 'vf-chips', opcoes: E.val.map((o) => ({ valor: o.k, rotulo: o.t, rotulo_secundario: o.f })) }];
    d.dados = { E: { valor: E.val, linhas: [E.linha_ini, E.linha_fim], campos: { k: 'chave', f: 'família de defeito', t: 'rótulo do chip', en: 'enunciado', df: 'defeito (não exibido: o cartão usa DF[f])', fa: 'o que exatamente falta', pq: 'a pergunta que você faz', ok: 'forma corrigida' } }, DF: { valor: DF.val, linhas: [DF.linha_ini, DF.linha_fim] } };
    const nota = /<p class="vf-nt">([^<]*)<\/p>/.exec(html.slice(start, sb.end));
    d.textos_fixos_do_script = ['Defeito dominante', 'O que exatamente falta', 'A pergunta que você faz', 'Forma corrigida'].map((t) => ({ texto: t, origem: origem('<script> INST·11 painel()', t, html.indexOf(t, start)) }))
      .concat([{ texto: decode(nota[1]), origem: origem('<script> INST·11 painel() p.vf-nt', decode(nota[1]).slice(0, 60), start + nota.index) }]);
    const dom = runScript();
    d.renderizacoes = [];
    for (const f of ['all', 'A', 'B', 'C', 'D']) {
      clickSeg(dom, 'vf-flt', 'data-f', f);
      const chipsTxt = dom.byId['vf-chips'].querySelectorAll('button').map((b) => b.getAttribute('data-v'));
      if (f === 'all') for (const k of chipsTxt) { clickChip(dom, 'vf-chips', 'v', k); d.renderizacoes.push({ filtro: f, enunciado: k, cartao_texto: texto(dom.byId['vf-panel'].innerHTML) }); }
      else d.renderizacoes.push({ filtro: f, chips: chipsTxt, cartao_inicial_texto: texto(dom.byId['vf-panel'].innerHTML) });
    }
    d.cenario_padrao = { entradas: { 'vf-flt': 'all', 'vf-chips': 'e1' }, cartao_texto: texto(domPadrao.byId['vf-panel'].innerHTML) };
    d.leitura_complementar = (() => {
      const s = secao('a10'); const i = s.body.indexOf('<div class="chain">'); const blk = divBlock(s.body, i);
      return { tipo: 'div.chain (4 defeitos, imediatamente antes do INST·11)', itens: all(/<div class="cbox \w+"><span class="ck2">([\s\S]*?)<\/span>([\s\S]*?)<\/div>/g, blk, s.start + i).map(({ m, idx }) => ({ rotulo: texto(m[1]), ...hx(m[2]), origem: origem('div.chain .cbox', texto(m[1]), idx) })) };
    })();
    d.fonte_dos_numeros = { texto: texto(p.nota_de_rodape.html), nota: 'A nota declara a data de verificação; números sem referência ligada.' };
    d.contagens = { enunciados: E.val.length, por_familia: E.val.reduce((a, o) => ((a[o.f] = (a[o.f] || 0) + 1), a), {}) };
  }
  // numericos
  const NUM = { '04': 'fc', '05': 'ar', '06': 'am', '08': 'e2', '09': 'dc' };
  if (NUM[nn]) {
    const pre = NUM[nn];
    d.mecanica = `anotação: ${p.campos.length} campos numéricos (número + deslizador gêmeo)${p.seletores.length ? ' + 1 seletor' : ''} → ${p.readouts.length} readouts${p.duais.length ? ' + 2 colunas lado a lado' : ''} + barras + veredito com interpolação`;
    d.entradas = [...p.campos, ...p.seletores];
    d.saidas = { readouts: p.readouts, duais: p.duais, barras_id: `${pre}-bars`, veredito_id: `${pre}-vd` };
    d.logica = logicaNumerica(sb);
    d.cenario_padrao = cenarioPadrao(domPadrao, p, `${pre}-vd`);
    const seg = p.seletores[0] ? { id: p.seletores[0].id_fonte, attr: p.seletores[0].opcoes[0].atributo, valores: p.seletores[0].opcoes.map((o) => o.valor) } : null;
    d.ramos_alcancados = { metodo: `execução do script com 2^${p.campos.length} cantos (min/max) + 4000 combinações pseudoaleatórias na grade de step de cada campo${seg ? ', para cada opção do seletor' : ''}; assinatura = classe do veredito + frases em <b> que abrem cada ramo`, achados: amostrarRamos(pre, p.campos, seg) };
    d.divergencias_locais = p.campos.filter((c) => !c.faixas_iguais || !c.passos_iguais).map((c) => ({ campo: c.rotulo, numero: c.numero, deslizador: c.deslizador }));
  }
  if (nn === '04') {
    d.fonte_dos_numeros = { texto: 'O padrão inicial usa a frota plug-in comercializada no primeiro semestre de 2026 (167.026 unidades) e o consumo de referência do cenário de referência do plano decenal para 2035 (939 TWh).', origem: d.intro.origem, nota: 'Declaração do próprio intro. Os padrões 12.000 km/ano, 0,170 kWh/km, 90%, 7,4 kW, 30% e 100 MW não têm fonte declarada.' };
    d.formulas_da_aula_relacionadas = ['E = N × km × e ÷ η', 'P = N × Pponto × fc'].map((f) => ({ texto: f, nota: 'div.fx imediatamente antes do instrumento (Aula 03, 03.2)' }));
  }
  if (nn === '05') {
    d.fonte_dos_numeros = { texto: 'Os valores iniciais reproduzem os parâmetros mínimos do certame de dezembro de 2026 — 30 MW, quatro horas, teto de 366 ciclos — e todos são editáveis.', origem: d.intro.origem, nota: 'Declaração do intro para 30 MW, 4 h e 366 ciclos. 90% de profundidade, 86% de eficiência, R$ 80 e R$ 400/MWh não têm fonte declarada (86% aparece também na fórmula da aula, 04.5).' };
  }
  if (nn === '06') {
    d.fonte_dos_numeros = { texto: texto(p.nota_de_rodape.html), origem: p.nota_de_rodape.origem, nota: 'A fonte declara que o custo por ponto (R$ 550) não é valor de referência oficial. 3.000 mil UCs, 10 anos e R$ 20 bi/ano não têm fonte declarada; 2%/ano corresponde à obrigação citada na aula (portaria ministerial nº 126/2026 no § Ref), sem vínculo declarado no instrumento.' };
  }
  if (nn === '08') {
    d.fonte_dos_numeros = { texto: texto(p.nota_de_rodape.html), origem: p.nota_de_rodape.origem, nota: 'Fatores declarados como entradas editáveis; 120 GWh, 0,080 e 0,120 coincidem com o Ex 14 (que usa 60% de atributo; o instrumento abre com 0%). Sem fonte declarada para os valores.' };
    d.textos_de_memoria = { 'e2-locm': "'Consumo integral a '+fmt(fm,3)+' tCO2e/MWh, o fator médio da rede no período.'", 'e2-mktm': "fmt((1-at)*100,0)+'% do consumo ao fator residual de '+fmt(fr,3)+' e '+fmt(at*100,0)+'% ao fator do instrumento contratado, de '+fmt(fi,3)+'.'", 'e2-fis': "'0<span class=\"u\">tCO2e alterada</span>' (constante)" };
    d.seletor_metodo_efeito = 'anotação: o seletor e2-mt só troca a "Nota sobre o método em discussão" do veredito; as duas colunas são sempre calculadas (intro: "o seletor apenas destaca qual está sendo discutido"). No script, nenhuma classe de destaque é aplicada às colunas.';
  }
  if (nn === '09') {
    d.fonte_dos_numeros = { texto: texto(p.nota_de_rodape.html), origem: p.nota_de_rodape.origem, nota: 'Padrões 100 MW, 1,30, 90% coincidem com o exemplo da ficha 06 e do Ex 12; 200 MW solicitados, 4 anos e 939 TWh sem fonte declarada no instrumento (939 TWh é o cenário de referência do caderno de demanda citado no § Ref).' };
    d.formulas_da_aula_relacionadas = ['PUE = energia total da instalação ÷ energia dos equipamentos de tecnologia da informação', 'E = PTI × PUE × FC × 8.760'].map((f) => ({ texto: f, nota: 'div.fx imediatamente antes do instrumento (Aula 08, 08.3)' }));
  }
  R[nn] = d;
}

const ordenados = Object.keys(R).sort().map((k) => R[k]);
const doc = {
  grupo: 'instrumentos',
  modulo: 'M16',
  camada: 'fonte',
  fonte: { arquivo: 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo16.html', linhas: LINES.length, acesso: 'somente leitura' },
  gerado_por: 'docs/alexandria-v2/extraction/m16/extratores/m16_instrumentos.mjs',
  convencoes: {
    html: 'HTML inline preservado, entidades decodificadas, espaços colapsados',
    texto: 'mesmo conteúdo sem tags',
    codigo: 'linhas do <script> verbatim (entidades decodificadas), com número de linha',
    dados: 'objetos literais do <script> avaliados sem alteração (valores são strings/números do arquivo)',
    anotacao: 'campos `mecanica`, `descricao`, `nota*` e `assinatura` são anotação desta extração, não texto da fonte',
  },
  contagens: {
    instrumentos: ordenados.length,
    de_modulo: ordenados.filter((x) => x.escopo === 'modulo').length,
    de_aula: ordenados.filter((x) => x.escopo === 'aula').length,
    numericos: Object.keys({ '04': 1, '05': 1, '06': 1, '08': 1, '09': 1 }).length,
    selecao_texto: 6,
    por_aula: ordenados.reduce((a, x) => ((a[x.invocacao.aula || 'modulo(§MAP)'] = [...(a[x.invocacao.aula || 'modulo(§MAP)'] || []), x.codigo_fonte]), a), {}),
    aulas_sem_instrumento: ['aula-16-06', 'aula-16-09'],
    portados_no_codigo: 0,
    nao_portados: ordenados.length,
    divergentes: 0,
  },
  instrumentos: ordenados,
};
writeJson('instrumentos.json', doc);
console.log('ok', ordenados.length, ordenados.map((x) => x.codigo_fonte + ':' + x.invocacao.secao_id).join(' '));
for (const x of ordenados) if (x.ramos_alcancados) console.log(x.codigo_fonte, x.ramos_alcancados.achados.length, x.ramos_alcancados.achados.map((a) => a.assinatura).join('\n   '));
