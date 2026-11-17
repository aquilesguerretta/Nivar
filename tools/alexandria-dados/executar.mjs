// executar.mjs — roda UM instrumento da especificação contra o script real do módulo.
//
//   const r = executarInstrumento(registro, { pontos: 21 });
//
// Devolve o cenário-padrão executado (texto de cada saída logo depois que o
// script do módulo carregou), as varreduras (um controle por vez, os outros no
// padrão) e os instantâneos de escopo — os arrays que a figura da fonte plota.
// Nada aqui é fórmula nossa: a fórmula é o `<script>` do HTML, executado.

import { carregarModulo, Elemento } from './mini-dom.mjs';
import { quantidades } from './unidades.mjs';

const num = (s) => { const n = parseFloat(String(s ?? '').replace(',', '.')); return Number.isFinite(n) ? n : null; };
const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

const SUF_GEMEO = ['-n', '-r', '-range', '-num', '-number', '-s', '-sl', '-slider', '-rng', '-v', '-val', '-input', '-num-in'];

function gemeosDe(m, id) {
  const base = id.replace(new RegExp(`(${SUF_GEMEO.map((s) => s.replace(/-/g, '\\-')).join('|')})$`), '');
  const out = [];
  for (const cand of [base, ...SUF_GEMEO.map((s) => base + s)]) {
    if (cand === id) continue;
    const e = m.el(cand);
    if (e && e.tag === 'input' && !out.includes(e)) out.push(e);
  }
  return out;
}

function clicaveis(el) {
  if (!el) return [];
  const bt = el.querySelectorAll('button');
  if (bt.length) return bt;
  const comOuv = el.todosDentro((e) => (e._ouvintes.click || []).length > 0);
  if (comOuv.length) return comOuv;
  const comData = el.children.filter((c) => Object.keys(c.attrs).some((a) => a.startsWith('data-')));
  if (comData.length) return comData;
  return el.children;
}
const ligado = (e) => /(^|\s)(on|active|ativo|sel|selected|is-on|is-active)(\s|$)/.test(e.attrs.class || '') || e.attrs['aria-pressed'] === 'true' || e.attrs['aria-selected'] === 'true';

/** Constrói o controle (ou null) para uma entrada da especificação. */
function controleDe(m, entrada) {
  const ids = String(entrada.id ?? '').split(' / ').map((s) => s.trim()).filter(Boolean);
  const el = ids.map((i) => m.el(i)).find(Boolean);
  if (!el) return { entrada, ids, tipo: null, motivo: ids.length ? 'id da entrada não existe no DOM depois do carregamento' : 'entrada sem id na extração' };
  const base = { entrada, ids, el };
  if (el.tag === 'select') {
    return { ...base, tipo: 'selecao', opcoes: el.options.map((o) => ({ valor: o.valorOpcao, rotulo: norm(o.textContent) })), padrao: el.selectedIndex };
  }
  if (el.tag === 'input') {
    const t = el.type;
    if (t === 'checkbox') return { ...base, tipo: 'alternar', padrao: el.checked };
    if (t === 'number' || t === 'range' || t === 'text') {
      const g = gemeosDe(m, el.id);
      const fonte = [el, ...g];
      const pega = (k) => fonte.map((e) => e.attrs[k]).find((v) => v !== undefined && v !== '');
      const min = num(pega('min')), max = num(pega('max')), passo = num(pega('step'));
      return { ...base, tipo: 'numerico', gemeos: g, faixa: { min, max, passo }, padrao: el.value };
    }
  }
  const bs = clicaveis(el);
  if (bs.length) return { ...base, tipo: 'botoes', n: bs.length, padrao: Math.max(0, bs.findIndex(ligado)), rotulosBotoes: bs.map((b) => norm(b.textContent).slice(0, 60)) };
  return { ...base, tipo: null, motivo: `elemento <${el.tag}> sem input, select nem botões` };
}

function valoresDaFaixa({ min, max, passo }, padrao, N) {
  if (min == null || max == null || !(max > min)) return null;
  const p = passo && passo > 0 ? passo : null;
  const passos = p ? Math.floor((max - min) / p + 1e-9) : null;
  let vs = [];
  if (p && passos + 1 <= N) for (let k = 0; k <= passos; k++) vs.push(min + k * p);
  else for (let k = 0; k < N; k++) {
    let v = min + (max - min) * k / (N - 1);
    if (p) v = min + Math.round((v - min) / p) * p;
    vs.push(v);
  }
  const d = num(padrao);
  if (d != null && d >= min && d <= max) vs.push(d);
  vs = [...new Set(vs.map((v) => +v.toFixed(10)))].sort((a, b) => a - b);
  return vs;
}

function aplicar(m, c, v) {
  if (c.tipo === 'numerico') {
    const els = [c.el, ...c.gemeos];
    els.forEach((e) => { e.value = String(v); });
    els.forEach((e) => { m.disparar(e, 'input'); m.disparar(e, 'change'); });
  } else if (c.tipo === 'selecao') {
    c.el.value = c.opcoes[v].valor;
    m.disparar(c.el, 'input'); m.disparar(c.el, 'change');
  } else if (c.tipo === 'botoes') {
    const bs = clicaveis(c.el);
    if (bs[v]) m.disparar(bs[v], 'click');
  } else if (c.tipo === 'alternar') {
    c.el.checked = !!v; m.disparar(c.el, 'input'); m.disparar(c.el, 'change'); m.disparar(c.el, 'click');
  }
}


/** Painéis de leitura: pares rótulo/valor dentro do container (`.ro > .k + .n`, `.gk + .gv`, …). */
const CLASSE_K = /^(k|kk|gk|lbl|label|rot|rotulo|nm|key|ro-k)$/;
const CLASSE_V = /^(n|nn|gv|v|val|value|num|vl|valor|ro-n)$/;
const temClasse = (e, re) => (e.attrs.class || '').split(/s+/).some((c) => re.test(c));
function subLeituras(el) {
  const out = [];
  const visita = (p) => {
    let rotulo = null;
    for (const f of p.filhos) {
      if (!(f instanceof Elemento)) continue;
      if (temClasse(f, CLASSE_K)) rotulo = norm(f.textContent);
      else if (temClasse(f, CLASSE_V) && rotulo != null) {
        const texto = norm(f.textContent);
        out.push({ rotulo, texto, q: quantidades(texto).map((x) => [x.valor, x.unidade, x.indice, x.fator, x.unidadeBase]) });
        rotulo = null;
      } else visita(f);
    }
  };
  visita(el);
  if (!out.length) { // lista de itens "Nome · 43,0%" (legendas)
    const itens = el.children.filter((c) => c.tag !== 'svg');
    const lidos = itens.map((c) => /^(D{2,50}?)s*[·:—–]s*([+-−]?d[^s]*(?:s?S{0,8})?)/u.exec(norm(c.textContent)));
    if (itens.length >= 2 && lidos.every(Boolean)) lidos.forEach((m) => out.push({ rotulo: m[1].trim(), texto: m[2].trim(), q: quantidades(m[2]).map((x) => [x.valor, x.unidade, x.indice, x.fator, x.unidadeBase]) }));
  }
  return out.length ? out : undefined;
}

function lerSaidas(m, saidas) {
  const o = {};
  for (const s of saidas) {
    if (!s.id) continue;
    const el = m.el(s.id);
    if (!el) { o[s.id] = null; continue; }
    const texto = norm(el.textContent);
    o[s.id] = { texto, sub: subLeituras(el), q: quantidades(texto).map((x) => [x.valor, x.unidade, x.indice, x.fator, x.unidadeBase]), svg: /^(svg|g)$/.test(el.tag) || /<(svg|polyline|rect|circle|path)\b/.test(el.innerHTML) ? el.innerHTML.length : undefined };
  }
  return o;
}

/** IIFE do instrumento: a menor IIFE que mais ids do registro cita como literal. */
function iifeDoInstrumento(m, ids) {
  const alvo = new Set(ids);
  let melhor = null, nmelhor = 0;
  for (const i of m.iifes) {
    let n = 0; for (const x of i.ids) if (alvo.has(x)) n++;
    if (n > nmelhor || (n === nmelhor && n > 0 && melhor && (i.fim - i.ini) < (melhor.fim - melhor.ini))) { melhor = i; nmelhor = n; }
  }
  return melhor;
}
const descendeDe = (m, iifeId, raizId) => { for (let i = iifeId; i != null; i = m.iifes[i]?.pai) if (i === raizId) return true; return false; };

/** Faixa de linhas do script do instrumento, como a EXTRAÇÃO a registrou (camada fonte). */
export function faixaDeLinhas(reg) {
  const s = reg.formulas_da_fonte?.script;
  if (!s || typeof s !== 'object') return null;
  for (const k of ['bloco_linhas', 'linhas']) if (Array.isArray(s[k]) && s[k].length === 2 && s[k].every(Number.isFinite)) return s[k];
  for (const [a, b] of [['linha_ini', 'linha_fim'], ['linha_inicio', 'linha_fim']]) if (Number.isFinite(s[a]) && Number.isFinite(s[b])) return [s[a], s[b]];
  return null;
}

export function executarInstrumento(reg, opcoes = {}) {
  const N = opcoes.pontos ?? 21;
  const n = +(reg.identidade?.modulo ?? reg.modulo).slice(1);
  const m = carregarModulo(n);
  const ids = [...reg.entradas.flatMap((e) => String(e.id ?? '').split(' / ')), ...reg.saidas.map((s) => s.id)].filter(Boolean);
  const iife = iifeDoInstrumento(m, ids);
  const padrao = {
    saidas: lerSaidas(m, reg.saidas),
    estatico: Object.fromEntries(reg.saidas.filter((s) => s.id).map((s) => [s.id, m.estatico.get(s.id)?.texto ?? null])),
  };
  const nCapCarga = m.capturas.length; // tudo o que o script escreveu até aqui é do carregamento

  // controles: um por id (uma entrada "a / b" são dois campos)
  const controles = reg.entradas.map((e) => controleDe(m, e));
  const entradasPadrao = controles.map((c) => ({
    id: c.ids.join(' / ') || null, tipo: c.tipo,
    valor_dom: c.tipo === 'numerico' ? c.padrao : c.tipo === 'selecao' ? c.opcoes[c.padrao]?.valor : c.tipo === 'botoes' ? c.padrao : c.tipo === 'alternar' ? c.padrao : null,
    padrao_extracao: c.entrada.padrao ?? null,
  }));
  const controlesX = reg.entradas.flatMap((e) => {
    const is = String(e.id ?? '').split(' / ').map((s) => s.trim()).filter(Boolean);
    return is.length > 1 ? is.map((id) => controleDe(m, { ...e, id, rotulo: e.rotulo ? e.rotulo + ' · ' + id : id })) : [controleDe(m, e)];
  });
  const valorPadrao = (c) => (c.tipo === 'numerico' ? num(c.padrao) : c.padrao);

  // saídas que o script escreve em resposta aos controles e que a especificação não lista
  const idsEspec = new Set(reg.saidas.map((s) => s.id).filter(Boolean));
  const idsControles = new Set(controlesX.flatMap((c) => c.ids));
  const descobertas = new Map();
  const log = m.registrar(true);
  for (const c of controlesX) {
    if (!c.tipo) continue;
    log.length = 0;
    aplicar(m, c, valorPadrao(c));
    for (const w of log) if (w.id && !idsEspec.has(w.id) && !idsControles.has(w.id)) descobertas.set(w.id, w.tag);
  }
  m.registrar(null);
  const saidasTodas = [...reg.saidas, ...[...descobertas.keys()].map((id) => ({ id, rotulo: null, unidade: null, descoberta: true }))];
  const padraoTodas = lerSaidas(m, saidasTodas);

  // instantâneos do carregamento: das IIFEs do instrumento OU de escritas cujo alvo é um elemento do instrumento
  const idsSet = new Set([...ids, ...descobertas.keys()]);
  const faixa = faixaDeLinhas(reg);
  const capDef = m.capturas.slice(0, nCapCarga).filter((c) => (iife && c.iife != null && c.iife >= 0 && descendeDe(m, c.iife, iife.id)) || (c.alvo && idsSet.has(c.alvo)) || (faixa && c.linha >= faixa[0] && c.linha <= faixa[1]));

  const varreduras = [];
  for (const c of controlesX) {
    const v = { id: c.ids.join(' / ') || null, rotulo: c.entrada.rotulo ?? null, unidade: c.entrada.unidade ?? null, tipo: c.tipo, pontos: [], motivo: null, faixa: null };
    if (!c.tipo) { v.motivo = c.motivo; varreduras.push(v); continue; }
    let vals = null;
    if (c.tipo === 'numerico') {
      v.faixa = c.faixa;
      vals = valoresDaFaixa(c.faixa, c.padrao, N);
      if (!vals) v.motivo = 'faixa sem mínimo e máximo declarados no markup (atributos min/max)';
    } else if (c.tipo === 'selecao') { v.opcoes = c.opcoes; vals = c.opcoes.map((_, k) => k); }
    else if (c.tipo === 'botoes') { v.rotulos = c.rotulosBotoes; vals = Array.from({ length: Math.min(c.n, 30) }, (_, k) => k); }
    else if (c.tipo === 'alternar') vals = [false, true];
    if (vals) {
      const err0 = m.erros.length;
      for (const x of vals) {
        aplicar(m, c, x);
        v.pontos.push({ x, rotulo_x: c.tipo === 'selecao' ? c.opcoes[x].rotulo : c.tipo === 'botoes' ? c.rotulosBotoes[x] : undefined, saidas: lerSaidas(m, saidasTodas) });
      }
      v.erros_do_stub = m.erros.length - err0;
      aplicar(m, c, valorPadrao(c)); // restaura o padrão
    }
    varreduras.push(v);
  }
  return {
    modulo: n, iife: iife ? { id: iife.id, linhas: [iife.ini, iife.fim] } : null, faixa_da_extracao: faixa, padrao, padrao_todas: padraoTodas, saidas_todas: saidasTodas,
    saidas_descobertas: [...descobertas.keys()], entradas_padrao: entradasPadrao, capturas_carga: capDef, varreduras,
    erros: m.erros.length ? m.erros.slice(0, 5) : [], m,
  };
}

export { Elemento };
