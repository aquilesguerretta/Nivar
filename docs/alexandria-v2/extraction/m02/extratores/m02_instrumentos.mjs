// Extração dos 9 instrumentos do M02: markup (entradas/saídas/nota), script original (cálculo,
// formatação, ramos de texto — verbatim), cenário-padrão e espaço de entrada executados em DOM
// simulado, e comparação com o que está portado em src/lib/data. Escreve instrumentos.json.
import {
  html, fonteInfo, secoes, all, ht, texto, inner, ini, origem, pad, fail, lineOf,
  carregarTS, calculadorasM02, DATA, HOJE, escrever, norm, scriptOriginal, divBalanceado, div,
  executarScript, setCampo, montarDOM, LINHAS,
} from './lib.mjs';

const SECS = secoes();
const mapaAula = {};
for (const { m } of all(/<tr><td><b>(\d\d)<\/b><\/td><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td><\/tr>/g, SECS.find((s) => s.num === '§ MAP').body, 0)) mapaAula[`Aula ${m[1]}`] = texto(m[3]);

const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const numOuStr = (v) => (v != null && v !== '' && !isNaN(Number(v)) ? Number(v) : v);
const fb = (v, d) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const g1 = (x) => x.toFixed(1).replace('.', ',');

// ── script: blocos por instrumento ─────────────────────────────────────────
const { codigo: SCRIPT } = scriptOriginal();
const scriptIdx = html.lastIndexOf('<script>') + 8;
const blocos = all(/\/\* =+\s*\n\s*INSTRUMENT (\d\d): (.*)\n\s*=+ \*\//g, SCRIPT, scriptIdx).map(({ m, idx }, i, arr) => {
  const fim = SCRIPT.indexOf('/* ====', idx - scriptIdx + m[0].length);
  const codigo = SCRIPT.slice(idx - scriptIdx, fim);
  return { numero_comentario: m[1], titulo_comentario: m[2].trim(), codigo, linha_ini: lineOf(idx), linha_fim: lineOf(scriptIdx + fim) - 1 };
});
if (blocos.length !== 9) fail('9 blocos de script');

// cabeçalho de ramo com parênteses balanceados
function cabecalhoRamo(linha) {
  const m = /^\s*(?:\}\s*)?(else if|if|else)\b/.exec(linha);
  if (!m) return null;
  let i = m.index + m[0].length;
  let cond = null;
  if (m[1] !== 'else') {
    while (linha[i] === ' ') i++;
    if (linha[i] !== '(') return null;
    let d = 0, j = i;
    for (; j < linha.length; j++) { if (linha[j] === '(') d++; else if (linha[j] === ')') { d--; if (d === 0) break; } }
    cond = linha.slice(i + 1, j);
    i = j + 1;
  }
  const resto = linha.slice(i).replace(/^\s*\{?\s*/, '').trim();
  return { tipo: m[1], condicao: cond, resto };
}
const ehTextoDeLeitura = (l) => /(verd\.innerHTML|verd\.className|\bmsg = |\bcls = |\bst = |\bvoc = )/.test(l);
function ramosDe(codigo, linhaBase) {
  const linhas = codigo.split('\n');
  const grupos = [];
  let atual = null;
  linhas.forEach((l, k) => {
    const h = cabecalhoRamo(l);
    if (h) {
      const corpo = h.resto && ehTextoDeLeitura(h.resto) ? [h.resto] : [];
      const temTexto = corpo.length || linhas.slice(k + 1, k + 4).some((x) => ehTextoDeLeitura(x) && !cabecalhoRamo(x));
      if (!temTexto) { atual = null; return; }
      if (h.tipo === 'if') { grupos.push([]); }
      atual = { tipo: h.tipo, condicao: h.condicao, atribuicoes: corpo, linha_aprox: linhaBase + k };
      grupos[grupos.length - 1].push(atual);
      return;
    }
    if (atual && ehTextoDeLeitura(l)) atual.atribuicoes.push(l.trim());
    if (atual && /^\s*\}\s*$/.test(l)) atual = null;
  });
  return grupos.filter((g) => g.length > 1);
}
const linhasDeCalculo = (codigo, linhaBase) => codigo.split('\n').map((l, k) => ({ l: l.trim(), linha: linhaBase + k }))
  .filter(({ l }) => /^(var |let |const )?[\w\[\]".]+ *[+\-*/]?= *[^=]/.test(l) && /[*/+\-]|Math\.|\? /.test(l) && !/textContent|innerHTML|className|svg|pts\.|html \+=|x0|fmax|fmin|mono|function|addEventListener|document\.|\$id\(/.test(l))
  .map(({ l, linha }) => ({ codigo: l, linha_aprox: linha }));
const linhasDeEntrada = (codigo, linhaBase) => codigo.split('\n').map((l, k) => ({ l: l.trim(), linha: linhaBase + k }))
  .filter(({ l }) => /parseFloat\(|parseInt\(|\.dataset\./.test(l))
  .map(({ l, linha }) => ({ codigo: l, linha_aprox: linha, fallback_literal: (/\|\|\s*(-?\d+(?:\.\d+)?)/.exec(l) || [])[1] ?? null }));
const linhasDeSaida = (codigo, linhaBase) => codigo.split('\n').map((l, k) => ({ l: l.trim(), linha: linhaBase + k }))
  .filter(({ l }) => /(Out|El)\.(textContent|innerHTML) = /.test(l) || /\$id\("i01-\w+"\)\.textContent/.test(l))
  .map(({ l, linha }) => ({ codigo: l, linha_aprox: linha }));

// ── markup: 9 instrumentos ─────────────────────────────────────────────────
const inst = all(/<div class="instrument">/g, html, 0).map(({ idx }, i) => {
  const { inner: body, end } = divBalanceado(idx);
  const sec = SECS.find((s) => s.start <= idx && idx < s.end);
  const antes = html.slice(sec.start, idx);
  const comentario = /<!--\s*(INSTRUMENT[^>]*?)\s*-->\s*$/.exec(antes);
  const h3s = [...antes.matchAll(/<h3><span class="num">(.*?)<\/span>([\s\S]*?)<\/h3>/g)];
  const h3 = h3s[h3s.length - 1];
  const h3Abs = sec.start + h3.index;
  const entreH3 = html.slice(h3Abs + h3[0].length, idx);
  const psAntes = all(/<p>([\s\S]*?)<\/p>/g, entreH3, h3Abs + h3[0].length);
  const depois = html.slice(end, sec.end);
  const pDepois = /^\s*<p>([\s\S]*?)<\/p>/.exec(depois);
  const titulo = texto(/<div class="instrument-title">(.*?)<\/div>/.exec(body)[1]);
  const idFonte = texto(/<div class="instrument-id">(.*?)<\/div>/.exec(body)[1]);
  // campos
  const campos = all(/<div class="field">/g, body, 0).map(({ idx: fi }) => {
    const fAbs = idx + (html.slice(idx).indexOf(body)) + fi;
    const fb2 = divBalanceado(fAbs).inner;
    const lab = /<label class="field-label">(.*?)(?: <span class="unit">(.*?)<\/span>)?<\/label>/.exec(fb2);
    const num = /<input type="number"([^>]*)>/.exec(fb2);
    const rng = /<input type="range"([^>]*)>/.exec(fb2);
    const sel = /<select([^>]*)>([\s\S]*?)<\/select>/.exec(fb2);
    const c = { rotulo: texto(lab[1]), unidade: lab[2] ? texto(lab[2]) : null };
    if (num) {
      const a = attrs(num[1]);
      Object.assign(c, { id: a.id, tipo: rng ? 'numero+deslizador' : 'numero', padrao: numOuStr(a.value), min: numOuStr(a.min), max: numOuStr(a.max), passo: numOuStr(a.step) });
      if (rng) {
        const r = attrs(rng[1]);
        c.deslizador = { id: r.id, min: numOuStr(r.min), max: numOuStr(r.max), passo: numOuStr(r.step), padrao: numOuStr(r.value) };
        c.faixas_campo_e_deslizador_iguais = r.min === a.min && r.max === a.max && r.step === a.step && r.value === a.value;
      }
    } else if (sel) {
      const a = attrs(sel[1]);
      const opts = [...sel[2].matchAll(/<option value="([^"]*)"( selected)?>(.*?)<\/option>/g)].map((o) => ({ valor: o[1], rotulo: texto(o[3]), selecionada: !!o[2] }));
      Object.assign(c, { id: a.id, tipo: 'selecao', padrao: (opts.find((o) => o.selecionada) || opts[0]).valor, padrao_implicito: !opts.some((o) => o.selecionada), opcoes: opts });
    }
    c.origem = origem(`.instrument(${idFonte}) .field`, c.rotulo, fAbs);
    return c;
  });
  const pillRow = /<div class="pill-row" id="([^"]+)">([\s\S]*?)<\/div>/.exec(body);
  if (pillRow) {
    const opts = [...pillRow[2].matchAll(/<button class="pill( active)?" data-(\w+)="(\w+)">(.*?)<\/button>/g)].map((b) => ({ valor: b[3], rotulo: texto(b[4]), selecionada: !!b[1], atributo: `data-${b[2]}` }));
    campos.push({ rotulo: null, rotulo_nota: 'A fonte não rotula o grupo de pílulas (div.pill-row sem label).', unidade: null, id: pillRow[1], tipo: 'pilulas', padrao: opts.find((o) => o.selecionada).valor, opcoes: opts, origem: origem(`.instrument(${idFonte}) .pill-row`, opts[0].rotulo, idx + html.slice(idx).indexOf(pillRow[0])) });
  }
  // saídas
  const saidas = [];
  for (const r of body.matchAll(/<div class="readout"><span class="readout-label">(.*?)<\/span><span class="readout-value ?([\w ]*)" id="([^"]+)"[^>]*>(.*?)<\/span><\/div>/g)) saidas.push({ id: r[3], rotulo: texto(r[1]), tipo: 'readout', classe_cor: r[2] || null, valor_estatico_no_markup: texto(r[4]) });
  for (const r of body.matchAll(/<div class="case-data-cell"><div class="lbl">(.*?)<\/div><div class="val" id="([^"]+)"[^>]*>(.*?)<\/div><\/div>/g)) saidas.push({ id: r[2], rotulo: texto(r[1]), tipo: 'celula', classe_cor: null, valor_estatico_no_markup: texto(r[3]) });
  const outp = /<span class="output-label">(.*?)<\/span>\s*<span class="output-value" id="([^"]+)">(.*?)<\/span>/.exec(body);
  if (outp) saidas.push({ id: outp[2], rotulo: texto(outp[1]), tipo: 'output', classe_cor: null, valor_estatico_no_markup: inner(outp[3]) });
  const verd = /<div class="verdict" id="([^"]+)">/.exec(body);
  if (verd) saidas.push({ id: verd[1], rotulo: null, rotulo_nota: 'div.verdict não tem rótulo na fonte.', tipo: 'veredito', classe_cor: null, valor_estatico_no_markup: '—' });
  const noteDyn = /<div class="instrument-note" id="([^"]+)">(.*?)<\/div>/.exec(body);
  if (noteDyn) saidas.push({ id: noteDyn[1], rotulo: null, tipo: 'nota_dinamica', classe_cor: null, valor_estatico_no_markup: texto(noteDyn[2]) });
  const noteSt = /<div class="instrument-note">([\s\S]*?)<\/div>/.exec(body);
  const visuais = [];
  const svg = /<svg id="([^"]+)" viewBox="([^"]+)"/.exec(body); if (svg) visuais.push({ id: svg[1], tipo: 'svg', viewBox: svg[2] });
  const chain = /<div class="chain" id="([^"]+)">/.exec(body); if (chain) visuais.push({ id: chain[1], tipo: 'cadeia (html gerado)' });
  const stack = /<div class="dispatch-stack" id="([^"]+)">/.exec(body); if (stack) visuais.push({ id: stack[1], tipo: 'pilha de despacho (html gerado)' });
  const prefixo = /id="(i\d\d)-/.exec(body)[1];
  const bloco = blocos.find((b) => b.codigo.includes(`$id("${prefixo}-`) || b.codigo.includes(`#${prefixo}-pills`));
  return {
    idx, body, sec, prefixo, bloco, titulo, idFonte, campos, saidas, visuais,
    comentario_html: comentario ? comentario[1].trim() : null,
    nota: noteSt ? { ...ht(noteSt[1]), origem: origem(`.instrument(${idFonte}) .instrument-note`, ini(noteSt[1]), idx + html.slice(idx).indexOf(noteSt[0])) } : null,
    invocacao: {
      aula: sec.num,
      subsecao: { numero: h3[1], titulo: texto(h3[2]), linha_aprox: lineOf(h3Abs) },
      paragrafos_antes: psAntes.map(({ m, idx: pi }) => ({ ...ht(m[1]), origem: origem(`section.aula(${sec.num}) h3 ${h3[1]} ~ p`, ini(m[1]), pi) })),
      paragrafo_imediatamente_depois: pDepois ? { ...ht(pDepois[1]), origem: origem(`section.aula(${sec.num}) .instrument + p`, ini(pDepois[1]), end + pDepois.index) } : null,
    },
    origem: origem(`section.aula(${sec.num}) div.instrument`, idFonte, idx),
  };
});
if (inst.length !== 9) fail('9 instrumentos');

// menções textuais "INST·NN" / "INST · NN" fora do cabeçalho
const mencoes = [...html.matchAll(/INST ?· ?(\d\d)/g)].filter((m) => !/instrument-id/.test(html.slice(m.index - 30, m.index))).map((m) => {
  const sec = SECS.find((s) => s.start <= m.index && m.index < s.end);
  const inScript = m.index > html.lastIndexOf('<script>');
  return { id_citado: `INST · ${m[1]}`, onde: inScript ? 'script (texto de veredito)' : sec?.num ?? 'fora de seção', trecho: texto(html.slice(Math.max(0, m.index - 80), m.index + 40)), linha_aprox: lineOf(m.index) };
});

// ── execução: cenário-padrão e espaço de entrada ───────────────────────────
const lerSaidas = (dom, it) => Object.fromEntries(it.saidas.map((s) => {
  const e = dom.els[s.id];
  const v = s.tipo === 'veredito' || s.tipo === 'output' ? e.innerHTML : e.textContent;
  return [s.id, { valor: v, texto: texto(v), classe: e.className || null }];
}));
const domPadrao = executarScript();
const valoresDeCampo = (c) => {
  if (c.tipo === 'selecao' || c.tipo === 'pilulas') return c.opcoes.map((o) => o.valor);
  const out = [];
  for (let v = c.min; v <= c.max + 1e-9; v = Math.round((v + c.passo) * 1e6) / 1e6) out.push(v);
  return out;
};
function* produto(listas, i = 0, acc = []) {
  if (i === listas.length) { yield acc; return; }
  for (const v of listas[i]) yield* produto(listas, i + 1, [...acc, v]);
}
const mascarar = (s) => texto(s).replace(/[−+-]?\d[\d.,]*/g, '#');

const { CALC, linhas: linhasCalc } = await calculadorasM02();
const C2 = await carregarTS(`${DATA}/alexandria-modulo-02-content.ts`);

// formatação da fonte aplicada aos valores do código (harness de comparação, não conteúdo)
const esperado = {
  'm02-inst-02': (v) => ({ 'i02-i': fb(v['i02-i'], 0) + ' A', 'i02-loss': fb(v['i02-loss'], 1) + ' MW', 'i02-pct': (v['i02-pct'] > 100 ? '> 100' : fb(v['i02-pct'], 1)) + ' %', 'i02-yr': 'R$ ' + fb(v['i02-yr'] / 1e6, 1) + ' mi' }),
  'm02-inst-03': (v) => ({ 'i03-total': '~' + v['i03-total'].toFixed(1).replace('.', ',') + '%' }),
  'm02-inst-04': (v) => ({ 'i08-min': fb(v['i08-min'], 0) + ' GW às ' + v['i08-minh'] + 'h', 'i08-rampa': '+' + fb(v['i08-rampa'], 1) + ' GW/h (' + v['i08-rampah'] + '→' + (v['i08-rampah'] + 1) + 'h)', 'i08-solpico': fb(v['i08-solpico'], 0) + ' GW' }),
  'm02-inst-05': (v) => ({ 'i04-cmo': 'R$ ' + v['i04-cmo'], 'i04-term': g1(v['i04-term']) + ' GW', 'i04-cut': g1(v['i04-cut']) + ' GW' }),
  'm02-inst-06': (v) => ({ 'i09-h': fb(v['i09-h'], 1) + ' h' }),
  'm02-inst-07': (v) => ({ 'i05-rocof': '−' + fb(v['i05-rocof'], 2) + ' Hz/s', 'i05-nadir': fb(v['i05-nadir'], 2) + ' Hz' }),
  'm02-inst-08': (v) => ({ 'i06-inj': fb(v['i06-inj'], 0) + ' MWh', 'i06-perd': fb(v['i06-perd'], 1) + ' MWh', 'i06-rs': v['i06-rs'] >= 1e6 ? 'R$ ' + fb(v['i06-rs'] / 1e6, 2) + ' mi' : 'R$ ' + fb(v['i06-rs'] / 1000, 1) + ' mil' }),
  'm02-inst-09': (v) => ({ 'i07-ne': 'R$ ' + v['i07-ne'], 'i07-se': 'R$ ' + v['i07-se'], 'i07-cut': g1(v['i07-cut']) + ' GW' }),
};

const saida = [];
for (const [k, it] of inst.entries()) {
  const idCod = `m02-inst-${pad(k + 1)}`;
  const cod = C2.INSTRUMENTOS_MODULO_02.find((x) => x.id === idCod);
  const entradas = it.campos.filter((c) => c.id);
  // cenário-padrão
  const padrao = lerSaidas(domPadrao, it);
  // dados textuais por opção (explorador / cadeia)
  let dados_por_opcao = null;
  const pills = entradas.find((c) => c.tipo === 'pilulas');
  if (pills) {
    const dom = executarScript();
    dados_por_opcao = pills.opcoes.map((o) => {
      dom.els[`${pills.id}:${o.valor}`].fire('click');
      const r = { opcao: o.valor, rotulo: o.rotulo, saidas: lerSaidas(dom, it) };
      if (it.prefixo === 'i03') {
        r.trechos = [...dom.els['i03-chain'].innerHTML.matchAll(/<div class='cs-volt'>(.*?)<\/div><div class='cs-name'>(.*?)<\/div><div class='cs-loss'>(.*?)<\/div>/g)].map((m) => ({ tensao: m[1], trecho: m[2], perda_exibida: m[3] }));
      }
      return r;
    });
  }
  // espaço de entrada
  const listas = entradas.map(valoresDeCampo);
  const total = listas.reduce((a, l) => a * l.length, 1);
  const ramos = new Map();
  let divergNum = 0, comparados = 0, exemploDiv = null, nanOuInf = 0;
  const divergTexto = new Map();
  const curtas = { i04: ['i04-marg'], i09: ['i09-voc'], i05: ['i05-status'], i07: ['i07-flow'] }[it.prefixo] || [];
  const curtasCmp = {};
  const dom = montarDOM();
  new Function('document', 'window', SCRIPT)(dom.document, dom.window);
  for (const combo of produto(listas)) {
    const inputs = {};
    combo.forEach((v, j) => {
      const c = entradas[j];
      inputs[c.id] = c.tipo === 'selecao' || c.tipo === 'pilulas' ? String(v) : v;
      if (c.tipo !== 'pilulas') dom.els[c.id].value = String(v);
    });
    // um único disparo por combinação: o handler relê todos os campos (o script original lê .value no calc)
    const pil = entradas.find((c) => c.tipo === 'pilulas');
    if (pil) dom.els[`${pil.id}:${inputs[pil.id]}`].fire('click');
    else dom.els[entradas[0].id].fire('input');
    const s = lerSaidas(dom, it);
    const verdSaida = it.saidas.find((x) => x.tipo === 'veredito');
    const chave = verdSaida ? `${s[verdSaida.id].classe} | ${mascarar(s[verdSaida.id].valor)}` : (it.prefixo === 'i06' ? '(sem veredito)' : null);
    if (chave) {
      const r = ramos.get(chave) || { n: 0, exemplo_entrada: inputs, exemplo_texto: verdSaida ? s[verdSaida.id].texto : null, exemplo_html: verdSaida ? s[verdSaida.id].valor : null };
      r.n++; ramos.set(chave, r);
    }
    if (Object.values(s).some((x) => /NaN|Infinity/.test(x.valor))) nanOuInf++;
    // código
    const res = CALC[idCod](inputs);
    const exp = esperado[idCod]?.(res.valores);
    if (exp) {
      comparados++;
      const bad = Object.entries(exp).filter(([id, v]) => norm(v) !== s[id].texto);
      if (bad.length) { divergNum++; if (!exemploDiv) exemploDiv = { entrada: inputs, fonte: Object.fromEntries(bad.map(([id]) => [id, s[id].texto])), codigo_formatado: Object.fromEntries(bad) }; }
    }
    for (const sid of curtas) {
      const ft = s[sid].texto;
      const ok = typeof res.veredito === 'string' && res.veredito.startsWith(ft);
      const e = curtasCmp[sid] || (curtasCmp[sid] = { saida: sid, combinacoes: 0, preservada_no_veredito_do_codigo: 0, exemplo_falha: null });
      e.combinacoes++; if (ok) e.preservada_no_veredito_do_codigo++; else if (!e.exemplo_falha) e.exemplo_falha = { entrada: { ...inputs }, fonte: ft, codigo_veredito: res.veredito ?? null };
    }
    if (verdSaida && res.veredito != null) {
      const ft = s[verdSaida.id].texto;
      const key = mascarar(ft).slice(0, 60);
      if (!divergTexto.has(key)) divergTexto.set(key, { fonte_exemplo: ft, codigo_exemplo: res.veredito, igual: norm(res.veredito) === ft });
    }
  }
  const ramosVerb = ramosDe(it.bloco.codigo, it.bloco.linha_ini);
  const inicioLiteral = (r) => { const a = r.atribuicoes.find((x) => /innerHTML|msg = /.test(x)); const m = a && /"<b>([^"<]*)/.exec(a); return m ? m[1] : null; };
  const alcancados = [...ramos.values()].map((r) => r.exemplo_html || '');
  const ramos_nao_alcancados = ramosVerb.flat().filter((r) => inicioLiteral(r) != null && !alcancados.some((h) => h.startsWith('<b>' + inicioLiteral(r)))).map((r) => ({ tipo: r.tipo, condicao: r.condicao, inicio_literal: inicioLiteral(r), linha_aprox: r.linha_aprox }));
  const ramosLista = [...ramos.entries()].map(([chave, r]) => ({ chave_mascarada: chave, combinacoes: r.n, exemplo_entrada: r.exemplo_entrada, exemplo_texto_renderizado: r.exemplo_texto }));

  // comparação de metadados
  const metaCmp = {
    titulo_igual: cod?.title === it.titulo,
    kind_codigo: cod?.kind ?? null,
    campos: entradas.map((c) => {
      const f = cod?.fields.find((x) => x.id === c.id);
      if (!f) return { id: c.id, no_codigo: false };
      const optsIguais = c.opcoes ? JSON.stringify(c.opcoes.map((o) => [o.valor, o.rotulo])) === JSON.stringify((f.options || []).map((o) => [o.value, o.label])) : null;
      return {
        id: c.id, no_codigo: true,
        rotulo: { fonte: c.rotulo, codigo: f.label, igual: c.rotulo === f.label },
        unidade_igual: (c.unidade ?? null) === (f.unit ?? null),
        padrao_igual: String(c.padrao) === String(f.defaultValue),
        faixa_igual: c.min === undefined ? null : c.min === f.min && c.max === f.max && c.passo === f.step,
        opcoes_iguais: optsIguais,
      };
    }),
    saidas: it.saidas.map((s) => {
      const o = cod?.outputs.find((x) => x.id === s.id);
      return { id: s.id, no_codigo: !!o, rotulo_fonte: s.rotulo, rotulo_codigo: o?.label ?? null, rotulo_igual: o ? (s.rotulo ?? null) === o.label : null };
    }),
    nota: { fonte: it.nota?.html ?? null, codigo: cod?.note ?? null, igual: (it.nota?.html ?? null) === (cod?.note ?? null) },
    formula_codigo: cod?.formula ?? null,
  };
  const textosIguais = [...divergTexto.values()];
  const numOk = comparados ? divergNum === 0 : null;
  const textoOk = textosIguais.length ? textosIguais.every((x) => x.igual) : null;
  const metaOk = metaCmp.titulo_igual && metaCmp.campos.every((c) => c.no_codigo && c.rotulo.igual && c.unidade_igual && c.padrao_igual && c.faixa_igual !== false && c.opcoes_iguais !== false) && metaCmp.saidas.every((s) => s.no_codigo);
  const problemas = [];
  if (!metaOk) problemas.push('metadados (campos/saídas) diferentes');
  if (numOk === false) problemas.push(`cálculo difere em ${divergNum}/${comparados} combinações`);
  if (textoOk === false) problemas.push('textos de leitura não são verbatim (abreviados/parafraseados, sem interpolação numérica)');
  if (!metaCmp.nota.igual) problemas.push(it.nota ? 'nota estática diferente' : 'nota dinâmica (por opção) não portada; note = null');
  if (dados_por_opcao) problemas.push('dados textuais por opção (tabela do script) não portados');
  if (it.visuais.length) problemas.push(`visual não portado (${it.visuais.map((v) => v.tipo).join(', ')}) — limitação §12`);
  const semNumericoPortado = it.saidas.filter((s) => s.tipo !== 'veredito' && !(esperado[idCod] && Object.keys(esperado[idCod](Object.fromEntries(Object.keys(CALC[idCod]({}).valores || {}).map((x) => [x, 0])))).includes(s.id)));

  saida.push({
    id: `m02-inst-${pad(k + 1)}`,
    id_fonte: it.idFonte,
    titulo: it.titulo,
    camada: 'fonte',
    aula: it.sec.num,
    prefixo_ids_internos: it.prefixo,
    prefixo_bate_com_numero: it.prefixo === `i${it.idFonte.slice(-2)}`,
    comentario_html: it.comentario_html,
    comentario_script: `INSTRUMENT ${it.bloco.numero_comentario}: ${it.bloco.titulo_comentario}`,
    kind_taxonomia: cod?.kind ?? null,
    kind_nota: 'kind vem do código/taxonomia (instrument-taxonomy.md); a fonte só dá o prefixo do título.',
    pergunta: null,
    pergunta_nota: 'A fonte não dá pergunta própria ao instrumento. Candidatas literais: a pergunta do § MAP da aula e a instrução do parágrafo que o invoca (abaixo). Pergunta de previsão seria camada Alexandria (P3/P11/P19).',
    pergunta_candidatas: { map_da_aula: mapaAula[it.sec.num] ?? null, titulo_da_subsecao: it.invocacao.subsecao.titulo },
    invocacao: it.invocacao,
    entradas: entradas.map(({ origem: o, ...c }) => ({ ...c, origem: o })),
    saidas: it.saidas,
    visuais: it.visuais,
    nota_do_instrumento: it.nota,
    script: {
      linhas: [it.bloco.linha_ini, it.bloco.linha_fim],
      leitura_entradas_verbatim: linhasDeEntrada(it.bloco.codigo, it.bloco.linha_ini),
      calculo_verbatim: linhasDeCalculo(it.bloco.codigo, it.bloco.linha_ini),
      formatacao_saida_verbatim: linhasDeSaida(it.bloco.codigo, it.bloco.linha_ini),
      ramos_de_leitura_verbatim: ramosDe(it.bloco.codigo, it.bloco.linha_ini),
      codigo_completo: it.bloco.codigo.replace(/\s+$/, ''),
    },
    cenario_padrao: {
      entradas: Object.fromEntries(entradas.map((c) => [c.id, c.padrao])),
      saidas_renderizadas: padrao,
      metodo: 'Script original executado sem reescrita em DOM simulado (node), com os value/selected do markup; o script roda calc()/show()/render() no carregamento e sobrescreve o "—" estático.',
    },
    dados_por_opcao,
    espaco_de_entrada: {
      combinacoes: total,
      metodo: 'Varredura exaustiva: todos os valores de cada campo (min..max no passo do markup; todas as opções), script original disparado por evento input/click.',
      ramos_alcancados: ramosLista,
      saidas_com_NaN_ou_Infinity: nanOuInf,
      ramos_nao_alcancados,
      ramos_nao_alcancados_nota: ramos_nao_alcancados.length ? 'Ramo presente no script mas nunca exibido em todo o espaço de entrada do markup (condição anterior sempre vence). Registrado; não corrigido.' : undefined,
    },
    fonte_dos_numeros: null,
    fonte_dos_numeros_nota: 'A fonte não cita origem externa para constantes, cenário-padrão ou limiares. O que declara está na nota do instrumento (ex.: "ilustrativos", "didático"). Tratar como cenário didático (P19/P20).',
    tolerancias: null,
    tolerancias_nota: 'Nenhuma tolerância declarada na fonte.',
    codigo: {
      arquivo_meta: 'src/lib/data/alexandria-modulo-02-content.ts (INSTRUMENTOS_MODULO_02)',
      arquivo_calculo: `src/lib/data/alexandria-instrument-calculators.ts (L${linhasCalc[0]}–${linhasCalc[1]})`,
      id: idCod,
      metadados: metaCmp,
      calculo_numerico: { combinacoes_comparadas: comparados, divergentes: divergNum, exemplo_divergencia: exemploDiv, saidas_de_texto_sem_equivalente_numerico: semNumericoPortado.map((s) => s.id) },
      textos_de_leitura: textosIguais,
      saidas_textuais_curtas: Object.values(curtasCmp),
      status_por_parte: {
        metadados: metaOk ? 'portado' : 'divergente',
        calculo: comparados ? (numOk ? 'portado' : 'divergente') : (dados_por_opcao ? 'não se aplica (consulta a tabela textual)' : 'não se aplica'),
        textos_de_leitura: textoOk == null ? 'não se aplica' : (textoOk ? 'portado' : 'divergente'),
        saidas_textuais_curtas: Object.values(curtasCmp).length ? (Object.values(curtasCmp).every((x) => x.preservada_no_veredito_do_codigo === x.combinacoes) ? 'portado (concatenado no veredito)' : 'não portado') : 'não se aplica',
        dados_textuais_por_opcao: dados_por_opcao ? 'não portado' : 'não se aplica',
        nota_dinamica: it.saidas.some((x) => x.tipo === 'nota_dinamica') ? 'não portado' : 'não se aplica',
        visual: it.visuais.length ? 'não portado (limitação §12)' : 'não se aplica',
      },
      status: problemas.length === 0 ? 'portado' : (it.prefixo === 'i01' ? 'não portado' : 'divergente'),
      status_nota: it.prefixo === 'i01' ? 'O código só devolve a chave da pílula; os 7 textos por camada (a substância do explorador) não existem em src/.' : undefined,
      problemas,
    },
    origem: it.origem,
  });
}

// ── divergências e lacunas ─────────────────────────────────────────────────
const porId = (f) => saida.find((s) => s.id_fonte === f);
const prefixoErrado = saida.filter((s) => !s.prefixo_bate_com_numero);
const fallbacks1 = saida.flatMap((s) => s.script.leitura_entradas_verbatim.filter((l) => l.fallback_literal != null && l.fallback_literal !== '0').map((l) => ({ inst: s.id_fonte, ...l })));
const naoAlc = saida.flatMap((s) => s.espaco_de_entrada.ramos_nao_alcancados.map((r) => ({ inst: s.id_fonte, ...r })));
const textoDiv = saida.filter((s) => s.codigo.status_por_parte.textos_de_leitura === 'divergente');
const curtasNao = saida.flatMap((s) => s.codigo.saidas_textuais_curtas.filter((c) => c.preservada_no_veredito_do_codigo < c.combinacoes).map((c) => ({ inst: s.id_fonte, ...c })));
const rotulosInventados = saida.flatMap((s) => [
  ...s.codigo.metadados.campos.filter((c) => c.no_codigo && c.rotulo && c.rotulo.fonte == null).map((c) => ({ inst: s.id_fonte, id: c.id, codigo: c.rotulo.codigo })),
  ...s.codigo.metadados.saidas.filter((o) => o.no_codigo && o.rotulo_fonte == null).map((o) => ({ inst: s.id_fonte, id: o.id, codigo: o.rotulo_codigo })),
]);
const visuaisNao = saida.filter((s) => s.visuais.length);
const i01 = porId('INST · 01'), i03 = porId('INST · 03');
const divergencias = [
  div('div-i02-01', 'fonte×fonte', 'baixa', 'Numeração INST · NN × prefixo dos ids internos',
    { texto: prefixoErrado.map((s) => `${s.id_fonte} → ${s.prefixo_ids_internos}-*`).join('; '), origem: prefixoErrado.map((s) => s.origem) },
    { texto: 'INST · 01–03 usam i01–i03 (batem)', origem: porId('INST · 01').origem },
    'Resíduo de reordenação (protocolo §10). Os ids internos são o que o script lê; o código já registra o mesmo quirk no cabeçalho.'),
  div('div-i02-02', 'fonte (script)', 'baixa', 'Ramo de leitura nunca exibido no espaço de entrada do markup',
    { texto: naoAlc.map((r) => `${r.inst}: ${r.tipo} (${r.condicao}) "${r.inicio_literal}" L${r.linha_aprox}`).join('; '), origem: naoAlc.map((r) => ({ seletor: 'script', trecho_inicial: r.condicao, linha_aprox: r.linha_aprox })) },
    { texto: 'Varredura exaustiva de todas as combinações do markup não alcança o ramo (uma condição anterior sempre vence).', origem: null },
    'Registrado, não corrigido. O ramo continua literal em script.ramos_de_leitura_verbatim.'),
  div('div-i02-03', 'fonte (script)', 'baixa', 'Campo vazio vira valor não nulo (fallback "|| 1" / "|| 95")',
    { texto: fallbacks1.map((f) => `${f.inst}: ${f.codigo}`).join(' | '), origem: fallbacks1.map((f) => ({ seletor: 'script', trecho_inicial: f.codigo, linha_aprox: f.linha_aprox })) },
    { texto: 'Os demais campos numéricos usam "|| 0".', origem: null },
    'Protocolo §10: resíduo do original sinalizado, nunca corrigido em silêncio. Com o campo vazio, a potência (INST · 06) e a carga (INST · 07) valem 1 e o pico do dia (INST · 04) vale 95.'),
  div('div-i02-04', 'fonte×código', 'alta', 'Textos de leitura (vereditos) não são verbatim no código',
    { texto: textoDiv.map((s) => s.id_fonte).join(', '), origem: textoDiv.map((s) => ({ seletor: 'script', linha_aprox: s.script.linhas[0] })) },
    { texto: 'alexandria-instrument-calculators.ts devolve vereditos abreviados/parafraseados, sem a interpolação numérica da fonte (exemplos lado a lado em instrumentos[].codigo.textos_de_leitura)', origem: { arquivo: saida[0].codigo.arquivo_calculo } },
    'O cálculo numérico bate em 100% das combinações; só a prosa diverge. Porte por transliteração mecânica (protocolo §10) resolveria na camada de código.'),
  div('div-i02-05', 'fonte×código', 'alta', 'Explorador e cadeia: tabela textual por opção não portada',
    { texto: `INST · 01: ${i01.dados_por_opcao.length} opções × ${i01.saidas.length} saídas textuais (inclui a nota dinâmica i01-note); INST · 03: ${i03.dados_por_opcao.length} perfis com ${i03.dados_por_opcao.map((d) => d.trechos.length).join('/')} trechos`, origem: [i01.origem, i03.origem] },
    { texto: `INST · 01: ${i01.codigo.status}; INST · 03, dados_textuais_por_opcao: ${i03.codigo.status_por_parte.dados_textuais_por_opcao}`, origem: { arquivo: saida[0].codigo.arquivo_meta } },
    'A substância do explorador (tensões, dono, operador, regulador, remuneração, lugar na fatura) não existe em src/.'),
  div('div-i02-06', 'fonte×código', 'média', 'Saídas textuais curtas ausentes do código',
    { texto: curtasNao.map((c) => `${c.inst}: ${c.saida} (ex.: "${c.exemplo_falha?.fonte}")`).join('; '), origem: curtasNao.map((c) => ({ seletor: '#' + c.saida })) },
    { texto: 'Nem saída própria nem prefixo do veredito no código.', origem: { arquivo: saida[0].codigo.arquivo_calculo } },
    'INST · 06 (i09-voc) e INST · 07 (i05-status) ficam preservadas como prefixo do veredito do código; estas não.'),
  div('div-i02-07', 'código sem origem', 'baixa', 'Rótulos que a fonte não tem',
    { texto: 'A fonte não rotula div.verdict nem o grupo de pílulas.', origem: null },
    { texto: rotulosInventados.map((r) => `${r.inst} ${r.id}: "${r.codigo}"`).join('; '), origem: { arquivo: saida[0].codigo.arquivo_meta } },
    'No INST · 07 isso produz duas saídas "Veredito" (i05-status, rótulo literal da fonte, e i05-verdict).'),
  div('div-i02-08', 'fonte×código (limitação §12)', 'média', 'Visuais gerados pelo script não portados',
    { texto: visuaisNao.map((s) => `${s.id_fonte}: ${s.visuais.map((v) => v.tipo + ' #' + v.id).join(', ')}`).join('; '), origem: visuaisNao.map((s) => s.origem) },
    { texto: 'O contrato de instrumento só carrega números e veredito.', origem: null },
    'O conteúdo textual da cadeia (INST · 03) está em dados_por_opcao; a pilha do INST · 05 e as curvas SVG são desenho.'),
];
const lacunas = [
  { id: 'lac-i02-01', campo: 'instrumentos[].pergunta', valor: null, nota: 'Nenhum dos 9 tem pergunta própria; candidatas literais em pergunta_candidatas (P19: pergunta de previsão é camada Alexandria).' },
  { id: 'lac-i02-02', campo: 'instrumentos[].fonte_dos_numeros', valor: null, nota: 'Nenhuma constante, cenário-padrão ou limiar tem fonte externa declarada; as notas dizem "didático", "ilustrativos", "maquete pedagógica" (P19/P20).' },
  { id: 'lac-i02-03', campo: 'instrumentos[].tolerancias', valor: null, nota: 'Nenhuma tolerância declarada.' },
  { id: 'lac-i02-04', campo: 'instrumentos_de_modulo', valor: [], nota: 'Sem § Lab / LAB·NN; a Aula 06 não tem instrumento.' },
  { id: 'lac-i02-05', campo: 'fórmula por instrumento', valor: null, nota: 'Não há div.formula dentro de instrumento; a relação aparece só na nota (INST · 06, INST · 08) e no script. O código tem formula: null nos 9 (coerente).' },
];

escrever('instrumentos.json', {
  grupo: 'instrumentos',
  modulo: 'M02',
  camada: 'fonte',
  fonte: fonteInfo,
  gerado_por: 'docs/alexandria-v2/extraction/m02/extratores/m02_instrumentos.mjs',
  gerado_em: HOJE,
  metodo: 'Markup por regex escopada em div.instrument (balanceada); script lido por bloco de comentário INSTRUMENT NN e executado sem reescrita em DOM simulado; código lido com typescript.transpileModule (bloco m02 das calculadoras isolado).',
  instrumentos_de_modulo: { itens: [], nota: 'O M02 não tem instrumento fora de aula (sem § Lab, sem LAB·NN). Todos os 9 estão dentro de aulas; a Aula 06 é a única sem instrumento.' },
  mencoes_textuais: mencoes,
  instrumentos: saida,
  divergencias,
  lacunas,
  contagens: {
    instrumentos: saida.length,
    por_aula: Object.fromEntries(saida.map((s) => [s.aula, s.id_fonte])),
    entradas: saida.reduce((a, s) => a + s.entradas.length, 0),
    saidas: saida.reduce((a, s) => a + s.saidas.length, 0),
    ramos_de_leitura_alcancados: saida.reduce((a, s) => a + s.espaco_de_entrada.ramos_alcancados.length, 0),
    combinacoes_varridas: saida.reduce((a, s) => a + s.espaco_de_entrada.combinacoes, 0),
    status: Object.fromEntries(saida.map((s) => [s.id_fonte, s.codigo.status])),
    divergencias: divergencias.length, lacunas: lacunas.length,
  },
});
console.log('instrumentos.json ok');
for (const s of saida) console.log(s.id_fonte, s.prefixo_ids_internos, s.aula, s.espaco_de_entrada.combinacoes, 'ramos', s.espaco_de_entrada.ramos_alcancados.length, 'num', s.codigo.calculo_numerico.combinacoes_comparadas, s.codigo.calculo_numerico.divergentes, '|', s.codigo.status, '|', s.codigo.problemas.join('; '));
