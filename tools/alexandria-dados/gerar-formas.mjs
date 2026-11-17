// gerar-formas.mjs — dados das formas prometidas (3.5).
//
// Para cada instrumento que promete desenhar uma forma (`forma_prometida.promete`
// em instrumentos.json), roda o script REAL do módulo (tools/alexandria-dados/
// mini-dom.mjs) e registra o que a figura precisa mostrar:
//   · cenário-padrão executado (entradas, saídas, valor estático do markup);
//   · varreduras — um controle por vez, na faixa que o markup declara (min/max/step),
//     lendo cada saída numérica a cada passo → as curvas y(x);
//   · variáveis do script — os arrays que a figura da fonte plota (instantâneo de
//     escopo no momento em que o script escreve a figura);
//   · cada série prometida pelo overlay, ligada à saída ou à variável que a
//     carrega, ou `null` com o motivo.
// Não decide estilo de desenho: só dado, eixo, unidade, origem.
//
// uso: node tools/alexandria-dados/gerar-formas.mjs [--so m02-inst-04,...]
// saída: docs/alexandria-v2/extraction/instrumentos/formas.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { executarInstrumento } from './executar.mjs';
import { arquivoHtml } from './mini-dom.mjs';
import { ehUnidade, UNIDADE_RE_FONTE } from './unidades.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');
const DIR = path.join(RAIZ, 'docs/alexandria-v2/extraction/instrumentos');
const ENTRADA = path.join(DIR, 'instrumentos.json');
const SAIDA = path.join(DIR, 'formas.json');

const arg = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
const SO = arg('--so') ? new Set(arg('--so').split(',')) : null;

/* ------------------------------ utilitários ------------------------------ */

const sem = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const tokens = (s) => sem(s).replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter((t) => t.length > 2);
const arred = (v) => (typeof v === 'number' && Number.isFinite(v) ? +v.toPrecision(10) : v);
const mais = (arr) => { const c = new Map(); arr.forEach((x) => c.set(x, (c.get(x) || 0) + 1)); return [...c.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null; };

/* ---------------------------- tipo de forma ------------------------------ */

const FAMILIAS = [
  ['curva', /\b(curva|curvas|trajetoria|rampa|serie temporal|ao longo d[oa]s?|perfil horario|evolucao|polilinha|linha de|linhas de|traçado|tracado)\b/],
  ['barras', /\b(barra|barras|coluna|colunas|histograma|degrau|degraus|termometro|barras empilhadas|pilha|pilhas|empilhad[ao]s?)\b/],
  ['cascata', /\b(cascata|waterfall|escada de|degraus? sobre)\b/],
  ['setores', /\b(pizza|pizzas|setores|rosca|torta)\b/],
  ['triangulo', /\b(triangulo|triangulos)\b/],
  ['diagrama', /\b(diagrama|fluxo|fluxograma|cadeia|mapa|grafo|rede|organograma|funil|sankey|arvore|conectores?|setas?)\b/],
  ['regua', /\b(regua|linha do tempo|cronologia|sequencia|etapas|passos|trilha|trilhas)\b/],
  ['grade', /\b(grade|matriz|tabela|celulas?|quadro|painel de celulas)\b/],
  ['dispersao', /\b(dispersao|quadrante|plano|dois eixos|mapa de calor|nuvem)\b/],
];

function tipoDeForma(reg, f) {
  const texto = sem([reg.identidade.titulo, f.o_que_desenhar, ...(f.evidencia_da_promessa || [])].join(' . '));
  const placar = FAMILIAS.map(([nome, re]) => [nome, (texto.match(new RegExp(re.source, 'g')) || []).length]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  if (!placar.length) return { tipo: null, candidatos: [], motivo: 'nenhuma palavra de forma (curva, barra, pilha, triângulo, diagrama, régua, grade…) no título nem no que o overlay manda desenhar' };
  const [p1, p2] = placar;
  if (p2 && p2[1] >= p1[1] * 0.7) return { tipo: null, candidatos: placar.map(([n, c]) => `${n}:${c}`), motivo: `ambígua: ${p1[0]} (${p1[1]}) e ${p2[0]} (${p2[1]}) pesam quase igual no texto da promessa` };
  return { tipo: p1[0], candidatos: placar.map(([n, c]) => `${n}:${c}`), motivo: null };
}

/* -------------------------- unidade de eixo (overlay) --------------------- */

const EM_UNIDADE = new RegExp(`\\bem\\s+(${UNIDADE_RE_FONTE})(?![\\p{L}\\d])`, 'gu');
const A_POR_B = new RegExp(`^(${UNIDADE_RE_FONTE})\\s+por\\s+(\\p{L}+)`, 'u');
/** Unidade sugerida pelo texto do eixo no overlay (julgamento): "GW", "em %", "R$ por mês". */
function unidadeDoEixoOverlay(txt) {
  if (!txt) return null;
  const t = String(txt).trim();
  if (ehUnidade(t)) return { unidade: t, evidencia: `eixo do overlay: "${t}"` };
  const ms = [...t.matchAll(EM_UNIDADE)].filter((m) => ehUnidade(m[1]));
  if (ms.length) { const m = ms[ms.length - 1]; return { unidade: m[1], evidencia: `eixo do overlay: "…${t.slice(Math.max(0, m.index - 20), m.index + m[0].length)}"` }; }
  const m = A_POR_B.exec(t);
  if (m && ehUnidade(`${m[1]}/${m[2]}`)) return { unidade: `${m[1]}/${m[2]}`, evidencia: `eixo do overlay: "${m[0]}"` };
  return null;
}
/** Só vale como unidade do eixo se a fonte a escreve em alguma saída ou entrada do instrumento. */
function corroborada(un, fontes) {
  if (!un) return false;
  return fontes.some((u) => u && (u === un || u.split(/[\/·]/).includes(un) || un.split(/[\/·]/).includes(u)));
}

/* ----------------------------- séries de varredura ----------------------- */

function seriesDeVarreduras(reg, ex) {
  const saidasPorId = new Map(ex.saidas_todas.filter((s) => s.id).map((s) => [s.id, s]));
  const out = [];
  for (const v of ex.varreduras) {
    if (v.pontos.length < 2) continue;
    const categorico = v.tipo === 'selecao' || v.tipo === 'botoes' || v.tipo === 'alternar';
    for (const [sid, s] of saidasPorId) {
      const leituras = v.pontos.map((p) => p.saidas[sid]);
      if (leituras.some((l) => !l)) continue;
      // fontes de leitura: o próprio texto da saída e, se for painel, cada par rótulo/valor
      const fontes = [{ sub: null, rotulo: s.rotulo, ler: (l) => l }];
      const nSub = Math.min(...leituras.map((l) => (l.sub ? l.sub.length : 0)));
      const rotulosSub = leituras[0].sub?.map((x) => x.rotulo) ?? [];
      if (nSub > 0 && leituras.every((l) => l.sub.length === rotulosSub.length && l.sub.every((x, k) => x.rotulo === rotulosSub[k])))
        rotulosSub.forEach((r, k) => fontes.push({ sub: k, rotulo: r, ler: (l) => l.sub[k] }));
      for (const f of fontes) {
        const ls = leituras.map(f.ler);
        const nq = Math.min(...ls.map((l) => l.q.length)), max = Math.max(...ls.map((l) => l.q.length));
        if (nq === 0 || nq !== max) continue; // o formato muda de ponto a ponto: não é série
        if (ls.some((l) => l.texto.length > 60 || (l.q[0] && l.q[0][2] > 2))) continue;
        for (let slot = 0; slot < Math.min(nq, 3); slot++) {
          const fatores = ls.map((l) => l.q[slot][3] ?? 1);
          const variaEscala = new Set(fatores).size > 1;
          const ys = ls.map((l, k) => (variaEscala ? l.q[slot][0] * fatores[k] : l.q[slot][0]));
          const unsVistas = [...new Set(ls.map((l) => (variaEscala ? l.q[slot][4] : l.q[slot][1])).filter(Boolean))];
          const un = mais(ls.map((l) => (variaEscala ? l.q[slot][4] : l.q[slot][1])).filter(Boolean)) ?? (slot === 0 && f.sub == null ? s.unidade : null);
          out.push({
            origem: 'varredura',
            controle: { id: v.id, rotulo: v.rotulo, tipo: v.tipo, unidade: v.unidade, faixa: v.faixa ?? null },
            saida: { id: sid, rotulo: s.rotulo ?? null, descoberta_pelo_script: !!s.descoberta, leitura_do_painel: f.sub == null ? null : f.rotulo, grupo: s.grupo ?? null, posicao_na_leitura: slot, unidade: un, unidade_origem: un ? (f.sub == null && slot === 0 && s.unidade === un ? s.unidade_origem : 'script') : null },
            ...(variaEscala ? { escala_normalizada: 'a fonte troca a escala escrita (mil/mi/bi) conforme o valor; y está na unidade-base' } : {}),
            ...(unsVistas.length > 1 ? { unidade_varia_entre_pontos: unsVistas } : {}),
            constante: ys.every((y) => y === ys[0]),
            pontos: v.pontos.map((p, k) => (categorico ? { x: p.x, rotulo_x: p.rotulo_x ?? null, y: arred(ys[k]) } : { x: arred(p.x), y: arred(ys[k]) })),
          });
        }
      }
    }
  }
  return out;
}

/* ------------------------ variáveis do script (arrays) -------------------- */

const todosNum = (a) => Array.isArray(a) && a.length >= 2 && a.every((x) => typeof x === 'number');
function variaveisDoScript(ex) {
  const porNome = new Map();
  for (const c of ex.capturas_carga) for (const [nome, val] of Object.entries(c.vars)) porNome.set(nome, { val, linha: c.linha });
  // objeto de estado do módulo (ex.: I7 = { sel, meses: [...] }): os arrays de dentro viram variáveis "I7.meses"
  for (const [nome, { val, linha }] of [...porNome]) {
    if (val && typeof val === 'object' && !Array.isArray(val))
      for (const [k, v] of Object.entries(val)) if (Array.isArray(v) && v.length >= 2) porNome.set(`${nome}.${k}`, { val: v, linha });
  }
  const out = [];
  for (const [nome, { val, linha }] of porNome) {
    if (todosNum(val)) out.push({ nome, forma: 'vetor', linha, n: val.length, valores: val.map(arred) });
    else if (Array.isArray(val) && val.length >= 2 && val.every((x) => Array.isArray(x) && x.length && x.every((y) => typeof y === 'number'))) out.push({ nome, forma: 'matriz', linha, n: val.length, valores: val.map((r) => r.map(arred)) });
    else if (Array.isArray(val) && val.length >= 2 && val.every((x) => x && typeof x === 'object' && !Array.isArray(x) && Object.values(x).some((y) => typeof y === 'number'))) {
      const chaves = [...new Set(val.flatMap((x) => Object.keys(x)))];
      out.push({ nome, forma: 'registros', linha, n: val.length, campos: chaves, valores: val.map((x) => Object.fromEntries(Object.entries(x).map(([k, y]) => [k, arred(y)]))) });
    } else if (val && typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length >= 2 && Object.values(val).every((x) => typeof x === 'number')) out.push({ nome, forma: 'mapa', linha, n: Object.keys(val).length, valores: Object.fromEntries(Object.entries(val).map(([k, y]) => [k, arred(y)])) });
  }
  // rótulos de categoria: vetor de strings do mesmo tamanho
  const textos = [...porNome].filter(([, { val }]) => Array.isArray(val) && val.length >= 2 && val.every((x) => typeof x === 'string'));
  for (const v of out) {
    const par = textos.find(([, { val }]) => val.length === v.n);
    if (par) v.categorias_provaveis = { variavel: par[0], valores: par[1].val };
  }
  const escalares = {};
  for (const [nome, { val }] of porNome) if (typeof val === 'number') escalares[nome] = arred(val);
  // estruturas: o que um diagrama, régua ou grade mostra (nós, etapas, células) — constantes do script, não séries
  const jaNumericas = new Set(out.map((v) => v.nome));
  const pixel = (s) => typeof s === 'string' && (/[<>]/.test(s) || /^[\d.,\- ]+$/.test(s));
  const estruturas = [];
  for (const [nome, { val, linha }] of porNome) {
    if (jaNumericas.has(nome) || val == null || typeof val !== 'object') continue;
    const cap = (v) => (JSON.stringify(v).length > 9000 ? { truncado: true, primeiros: (Array.isArray(v) ? v.slice(0, 12) : Object.fromEntries(Object.entries(v).slice(0, 12))) } : v);
    if (Array.isArray(val)) {
      if (val.length < 2) continue;
      if (val.every((x) => typeof x === 'string')) { if (val.some(pixel)) continue; estruturas.push({ nome, forma: 'rotulos', linha, n: val.length, valores: val }); }
      else if (val.every((x) => x && typeof x === 'object')) estruturas.push({ nome, forma: 'registros', linha, n: val.length, valores: cap(val) });
    } else {
      const vs = Object.values(val);
      if (vs.length >= 2 && vs.every((x) => x && typeof x === 'object')) estruturas.push({ nome, forma: 'mapa_de_registros', linha, n: vs.length, chaves: Object.keys(val), valores: cap(val) });
    }
  }
  return { variaveis: out, escalares, estruturas };
}

/* ----------------------- ligação série prometida ↔ dado ------------------- */

function ligar(promessa, reg, ex, sv, vars) {
  const T = sem(promessa), toks = new Set(tokens(promessa));
  const ligacoes = [];
  // 1. saídas cujo rótulo aparece no texto da série (ou vice-versa)
  const alvos = [];
  for (const s of ex.saidas_todas) {
    alvos.push({ s, rotulo: s.rotulo, sub: null });
    const l = ex.padrao_todas[s.id];
    (l?.sub ?? []).forEach((x, k) => alvos.push({ s, rotulo: x.rotulo, sub: k, texto: x.texto, q: x.q }));
  }
  for (const { s, rotulo, sub, texto, q } of alvos) {
    const r = sem(rotulo).trim();
    if (!r || r.length < 4) continue;
    const rt = new Set(tokens(rotulo));
    const inter = [...rt].filter((t) => toks.has(t)).length;
    if (T.includes(r) || r.includes(T.trim()) || (rt.size >= 2 && inter / rt.size >= 0.8) || (rt.size === 1 && inter === 1 && toks.size <= 3)) {
      const l = sub == null ? ex.padrao_todas[s.id] : { texto, q };
      ligacoes.push({ tipo: 'saida', id: s.id, rotulo: s.rotulo ?? null, leitura_do_painel: sub == null ? null : rotulo, grupo: s.grupo ?? null, no_cenario_padrao: l ? { texto: l.texto, quantidades: l.q.map(([valor, unidade]) => ({ valor: arred(valor), unidade })) } : null, unidade: s.unidade ?? null, curvas: sv.filter((x) => x.saida.id === s.id && (sub == null ? x.saida.leitura_do_painel == null : x.saida.leitura_do_painel === rotulo)).length });
    }
  }
  // 2. variáveis do script citadas pelo nome (palavra inteira, caixa exata)
  for (const v of vars.variaveis) {
    if (v.nome.length < 2) continue;
    const exato = new RegExp(`(^|[^\\p{L}\\d_])${v.nome.replace(/[$]/g, '\\$')}([^\\p{L}\\d_]|$)`, 'u').test(promessa);
    const prefixo = v.nome.length >= 3 && [...toks].some((t) => t.startsWith(sem(v.nome)));
    if (exato || prefixo) ligacoes.push({ tipo: 'variavel', nome: v.nome, linha: v.linha, forma: v.forma, n: v.n, como: exato ? 'nome citado no texto da série' : 'nome é prefixo de uma palavra da série' });
  }
  return ligacoes;
}

/* ------------------------------- principal ------------------------------- */

const doc = JSON.parse(fs.readFileSync(ENTRADA, 'utf8'));
const alvo = doc.instrumentos.filter((i) => i.forma_prometida.promete === true && (!SO || SO.has(i.identidade.id)));
const registros = [];
const t0 = Date.now();

for (const reg of alvo) {
  const id = reg.identidade.id;
  const f = reg.forma_prometida;
  let ex;
  try { ex = executarInstrumento(reg, { pontos: 21 }); }
  catch (e) {
    registros.push({ id, modulo: reg.identidade.modulo, titulo: reg.identidade.titulo, forma: null, dado: { estado: null, motivo: `a execução do script falhou no stub: ${e.message}` } });
    continue;
  }
  const tipo = tipoDeForma(reg, f);
  const sv = seriesDeVarreduras(reg, ex);
  const vars = variaveisDoScript(ex);

  // eixos
  const eixoX = f.eixos?.x ?? null, eixoY = f.eixos?.y ?? null;
  const ux = unidadeDoEixoOverlay(eixoX), uy = unidadeDoEixoOverlay(eixoY);
  const unidadesY = [...new Set(sv.map((s) => s.saida.unidade).filter(Boolean))];
  const unidadesX = [...new Set(sv.filter((s) => s.controle.unidade).map((s) => s.controle.unidade))];
  const fontesUn = [...reg.saidas.map((s) => s.unidade), ...reg.saidas.flatMap((s) => s.unidades_observadas ?? []), ...reg.entradas.map((e) => e.unidade),
    ...Object.values(ex.padrao.saidas).flatMap((l) => (l ? l.q.map((q) => q[1]) : []))];
  const eixo = (rotulo, u, extra) => {
    const ok = u && corroborada(u.unidade, fontesUn);
    return {
      rotulo_overlay: rotulo,
      unidade: ok ? u.unidade : null,
      unidade_origem: ok ? 'overlay (camada Alexandria), corroborada por unidade que a fonte escreve em saída ou entrada' : null,
      unidade_evidencia: ok ? u.evidencia : null,
      unidade_motivo: ok ? null : u ? `o overlay sugere "${u.unidade}", mas nenhuma saída nem entrada da fonte escreve essa unidade: não declarada pela fonte` : 'o texto do eixo no overlay não traz unidade e a fonte não rotula o eixo',
      ...extra,
    };
  };
  const eixos = { x: eixo(eixoX, ux, { unidades_dos_controles_varridos: unidadesX }), y: eixo(eixoY, uy, { unidades_das_saidas_varridas: unidadesY }) };

  // séries prometidas ↔ dado
  const prometidas = (f.series || []).map((txt) => {
    const lig = ligar(txt, reg, ex, sv, vars);
    return { texto: txt, camada: 'alexandria (overlay)', ligada_a: lig.length ? lig : null, motivo: lig.length ? null : 'nenhuma saída tem rótulo equivalente e nenhuma variável do script é citada pelo nome no texto da série' };
  });
  const ligadas = prometidas.filter((p) => p.ligada_a).length;

  // entradas / saídas no cenário-padrão
  const entradas = reg.entradas.map((e, k) => ({ id: e.id, rotulo: e.rotulo, unidade: e.unidade ?? null, padrao_na_extracao: e.padrao ?? null, padrao_no_dom_apos_carga: ex.entradas_padrao[k]?.valor_dom ?? null, tipo_do_controle: ex.entradas_padrao[k]?.tipo ?? null }));
  const saidas = reg.saidas.map((s) => {
    const l = s.id ? ex.padrao.saidas[s.id] : null;
    const est = s.id ? ex.padrao.estatico[s.id] : null;
    const exec = l?.texto ?? null;
    let cmp = null;
    if (s.id && l) cmp = !est || est === '—' || est === '-' ? 'placeholder no markup' : est === exec ? 'igual' : 'diferente';
    return { id: s.id, rotulo: s.rotulo, unidade: s.unidade, unidade_origem: s.unidade_origem ?? null, texto_executado: exec, quantidades: l ? l.q.map(([valor, unidade]) => ({ valor: arred(valor), unidade })) : null, estatico_no_markup: est, markup_x_script: cmp };
  });

  // estado do dado
  const temSerie = sv.length > 0 || vars.variaveis.length > 0;
  const temEstrutura = vars.estruturas.length > 0;
  let estado = null, motivo = null;
  if (!temSerie && temEstrutura) { estado = 'estrutura'; motivo = `sem série numérica: a figura é de estrutura (${vars.estruturas.length} constantes do script com rótulos, nós ou células: ${vars.estruturas.map((e) => e.nome + '[' + e.n + ']').join(', ')}); não há fórmula a executar sobre ela`; }
  else if (!temSerie) motivo = [ex.iife ? '' : 'a IIFE do instrumento não foi localizada pelos ids', sv.length ? '' : (ex.varreduras.length ? ex.varreduras.map((v) => `${v.id}: ${v.motivo || (v.pontos.length < 2 ? 'sem pontos' : 'saídas não numéricas')}`).join('; ') : 'sem controles: instrumento percorrido, não parametrizado'), 'o script não escreve array numérico na figura'].filter(Boolean).join(' · ');
  else if (prometidas.length && ligadas === prometidas.length) estado = 'completo';
  else if (ligadas > 0) estado = 'parcial';
  else estado = 'sem ligação';
  if (estado === 'parcial') motivo = `${ligadas} de ${prometidas.length} séries prometidas têm saída ou variável ligada; as demais ficam com motivo em series_prometidas`;
  if (estado === 'sem ligação') motivo = `há dado executado (${sv.length} varreduras, ${vars.variaveis.length} variáveis do script), mas nenhuma das ${prometidas.length} séries prometidas casa por rótulo ou nome com uma saída ou variável; a ligação é julgamento e não foi inventada`;

  registros.push({
    id, modulo: reg.identidade.modulo, titulo: reg.identidade.titulo, aula: reg.identidade.aula,
    promessa: { estado_c5: f.estado_c5, o_que_desenhar: f.o_que_desenhar, desenho_declarado_na_fonte: f.desenho_declarado_na_fonte, custo_estimado: f.custo_estimado, camada: 'alexandria (overlay)' },
    forma: { tipo: tipo.tipo, candidatos: tipo.candidatos, motivo_do_null: tipo.motivo, origem_do_tipo: 'palavras do título e do overlay (julgamento, não fonte)' },
    eixos,
    cenario_padrao: { entradas, saidas },
    series_prometidas: prometidas,
    dados_executados: {
      varreduras: sv,
      variaveis_do_script: vars.variaveis,
      saidas_descobertas_pelo_script: ex.saidas_descobertas.map((id) => ({ id, texto_no_cenario_padrao: ex.padrao_todas[id]?.texto?.slice(0, 160) ?? null, leituras_do_painel: ex.padrao_todas[id]?.sub ?? null })),
      estruturas_do_script: vars.estruturas,
      escalares_do_script: vars.escalares,
      controles_sem_varredura: ex.varreduras.filter((v) => v.pontos.length < 2).map((v) => ({ id: v.id, tipo: v.tipo, motivo: v.motivo ?? 'um único valor' })),
    },
    origem_da_formula: {
      arquivo: path.basename(arquivoHtml(ex.modulo)), modulo: reg.identidade.modulo,
      linhas_do_instrumento: ex.iife?.linhas ?? ex.faixa_da_extracao ?? null,
      linhas_origem: ex.iife ? 'IIFE do script, localizada pelos ids do instrumento' : ex.faixa_da_extracao ? 'faixa de linhas que a extração registrou para o script do instrumento' : null,
      linhas_das_capturas: [...new Set(ex.capturas_carga.map((c) => c.linha))].sort((a, b) => a - b),
      nota: 'o script é o do HTML original, executado literalmente; as linhas são do HTML',
    },
    dado: { estado, series_prometidas_ligadas: ligadas, series_prometidas: prometidas.length, varreduras: sv.length, variaveis: vars.variaveis.length, estruturas: vars.estruturas.length, motivo },
    erros_do_stub: ex.erros,
  });
  process.stderr.write(`${id} ${estado ?? 'null'} (${sv.length} varreduras, ${vars.variaveis.length} variáveis) ${((Date.now() - t0) / 1000).toFixed(0)}s\n`);
}

const por = (k) => registros.filter((r) => r.dado.estado === k).length;
const nulos = registros.filter((r) => r.dado.estado === null);
const tipos = {};
registros.forEach((r) => { const k = r.forma?.tipo ?? '(null)'; tipos[k] = (tipos[k] || 0) + 1; });
const cm = { igual: 0, diferente: 0, 'placeholder no markup': 0 };
registros.forEach((r) => r.cenario_padrao?.saidas.forEach((s) => { if (s.markup_x_script) cm[s.markup_x_script]++; }));
const divergentes = registros.flatMap((r) => (r.cenario_padrao?.saidas ?? []).filter((s) => s.markup_x_script === 'diferente').map((s) => ({ id: r.id, saida: s.id, rotulo: s.rotulo, markup: s.estatico_no_markup, script: s.texto_executado })));

const saida = {
  schema: 'alexandria-v2/formas/1.0',
  titulo: 'Dados das formas prometidas — um registro por instrumento que promete desenhar uma forma',
  gerado_por: 'tools/alexandria-dados/gerar-formas.mjs',
  gerado_em: new Date().toISOString().slice(0, 10),
  metodo: [
    'Entrada: instrumentos.json (especificação) + o HTML original dos módulos, só leitura.',
    'A fórmula é o `<script>` do módulo, executado literalmente em tools/alexandria-dados/mini-dom.mjs (DOM mínimo, sem dependência). Nenhuma fórmula foi reescrita.',
    'Cenário-padrão = estado do DOM depois que o script do módulo carrega. Curvas = um controle por vez na faixa declarada pelo markup (min/max/step), os demais no padrão, lendo cada saída numérica.',
    'Variáveis do script = instantâneo de escopo no momento em que o script escreve a figura (innerHTML/textContent): são os arrays que a figura da fonte plota.',
    'Série prometida = texto do overlay (julgamento). Só é ligada a uma saída ou variável quando o rótulo ou o nome casa; senão sai null com motivo.',
    'Tipo de forma = palavras do título e do overlay (julgamento). Ambíguo → null com motivo. Estilo de desenho não é decidido aqui.',
    'Faixa sem máximo no markup → sem varredura (não se inventa faixa).',
  ],
  contagens: {
    registros: registros.length,
    dado: { estrutura_sem_serie_numerica: por('estrutura'), completo: por('completo'), parcial: por('parcial'), 'dado_executado_sem_ligacao_a_serie_prometida': por('sem ligação'), nulo: nulos.length },
    com_alguma_serie_executada: registros.filter((r) => r.dado.varreduras > 0 || r.dado.variaveis > 0).length,
    com_estrutura_do_script: registros.filter((r) => r.dado.estruturas > 0).length,
    com_varredura: registros.filter((r) => r.dado.varreduras > 0).length,
    com_curva_que_varia: registros.filter((r) => (r.dados_executados?.varreduras ?? []).some((s) => !s.constante)).length,
    com_vetor_ou_matriz_numerica_do_script: registros.filter((r) => (r.dados_executados?.variaveis_do_script ?? []).some((v) => v.forma === 'vetor' || v.forma === 'matriz')).length,
    com_serie_numerica_forte: registros.filter((r) => (r.dados_executados?.varreduras ?? []).some((s) => !s.constante) || (r.dados_executados?.variaveis_do_script ?? []).some((v) => v.forma === 'vetor' || v.forma === 'matriz')).length,
    com_variavel_do_script: registros.filter((r) => r.dado.variaveis > 0).length,
    tipo_de_forma: tipos,
    markup_x_script_no_cenario_padrao: cm,
  },
  divergencias_markup_x_script: divergentes,
  nulos: nulos.map((r) => ({ id: r.id, motivo: r.dado.motivo })),
  registros,
};
fs.writeFileSync(SAIDA, JSON.stringify(saida, null, 1));
console.log(JSON.stringify(saida.contagens, null, 1));
console.log('divergências markup × script:', divergentes.length);
