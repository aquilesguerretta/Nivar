// Verifica o porte do texto do Módulo 16 (e, importado, do M17) contra o HTML
// original. A extração do M16/M17 (docs/alexandria-v2/extraction/mNN/) não
// guarda o corpo por aula — o README declara "o corpo das aulas fica fora do
// escopo" —, então a régua aqui é o próprio HTML-fonte, lido só para consulta
// e parseado por `tools/alexandria-dados/mini-dom.mjs` (o mesmo DOM que roda o
// <script> dos instrumentos). Nada é digitado: cada unidade de texto é lida do
// markup.
//
// Modelo: tools/alexandria-dados/verificar-porte-m01.mjs. Mesmas três checagens:
//   1. FALTA — unidade de texto da fonte que não aparece no .ts, ou aparece fora
//              da ordem da fonte.
//   2. ÓRFÃO — tag HTML aberta sem fechar (ou o contrário) no .ts.
//   3. VOCABULÁRIO — "GridAlpha", "War Room", "Trava", "Cobaia Zero", "Summit"
//              no texto entregue (Q03): conta como falha.
//
// UNIDADE DE TEXTO. Cada corrida de texto inline entre dois elementos de bloco
// da aula: parágrafo, h3, item de lista, célula, rótulo de caixa, rótulo de
// painel de três níveis, aba, painel, linha de grade. O que fica de fora:
// `div.inst` (conferido à parte, contra INSTRUMENTOS_MODULO_NN), o sec-id e o
// h2 (conferidos contra o título e o subtítulo da aula) e o p.lede (contra o
// LEAD).
//
// NORMALIZAÇÃO. Entidades decodificadas, tags fora, espaço colapsado. Fronteira
// de <sub>/<sup> conta como espaço ("P<sub>ponto</sub>" lê "P ponto"): a
// descrição de fórmula do produto é texto puro, e colar o índice ao símbolo
// ("Pponto") seria dano tipográfico. A equação compara sem espaço nenhum.
// Antes de comparar, o lado da fonte recebe as trocas editoriais decididas
// (P24 e Q03), contadas na saída.
//
// Uso: node tools/alexandria-dados/porte/verificar-porte-m16.mjs [--aula 4] [--v]
// Sai com 1 se houver falta não explicada, órfão ou vocabulário interno.

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { carregarModulo } from '../mini-dom.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const INLINE = new Set(['b', 'strong', 'em', 'i', 'u', 'span', 'sub', 'sup', 'a', 'br', 'code', 'small', 'abbr', 'mark', 's', 'q', 'cite']);

export const ENT = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ndash: '–', mdash: '—', hellip: '…', times: '×', middot: '·', divide: '÷', deg: '°', sup2: '²', sup3: '³', micro: 'µ', rarr: '→', larr: '←', harr: '↔', ge: '≥', le: '≤', asymp: '≈', minus: '−', plusmn: '±', eta: 'η', alpha: 'α', beta: 'β', Delta: 'Δ', delta: 'δ', sigma: 'σ', Sigma: 'Σ', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', laquo: '«', raquo: '»', sect: '§', ordm: 'º', ordf: 'ª', para: '¶', euro: '€', bull: '•', prime: '′', infin: '∞', ne: '≠', thinsp: ' ', ensp: ' ', emsp: ' ', shy: '' };
const DIACRITICO = { acute: '́', grave: '̀', circ: '̂', tilde: '̃', uml: '̈', cedil: '̧', ring: '̊' };
export const ENTIDADES_DESCONHECIDAS = new Set();
// O mini-dom decodifica só parte das entidades no parse e re-escapa '&' ao
// serializar ('&amp;uacute;'): decodifica até estabilizar.
export const decodificar = (s) => {
  let r = String(s);
  for (let k = 0; k < 4; k++) { const d = decodificar1(r); if (d === r) break; r = d; }
  return r;
};
const decodificar1 = (s) =>
  String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    if (e in ENT) return ENT[e];
    const d = e.match(/^([A-Za-z])(acute|grave|circ|tilde|uml|cedil|ring)$/);
    if (d) return (d[1] + DIACRITICO[d[2]]).normalize('NFC');
    ENTIDADES_DESCONHECIDAS.add(m);
    return m;
  });
const semTags = (s) => s.replace(/<br\s*\/?>/gi, ' ').replace(/<\/?(su[bp]|span)\b[^>]*>/gi, ' ').replace(/<[^>]+>/g, '');
const colapsar = (s) => s.replace(/[\s ]+/g, ' ').trim();
// pontuação depois de espaço criado por fronteira de tag: "tomada ;" → "tomada;"
const pontuacao = (s) => s.replace(/ ([,.;:!?)])/g, '$1').replace(/\( /g, '(');
export const norm = (s) => pontuacao(colapsar(decodificar(semTags(String(s ?? '')))));
export const compacto = (s) => norm(s).replace(/\s+/g, '');

// ── unidades de texto da fonte ───────────────────────────────────────────────
// Spans que a fonte desenha como pílula ou etiqueta à parte (estado de política
// em `div.est`): cada um é uma unidade, não parte da frase vizinha.
const SPAN_BLOCO = new Set(['vige', 'anun', 'teto', 'venc', 'pc']);
const ehBloco = (f) => !INLINE.has(f.tag) || (f.tag === 'span' && (f.attrs.class ?? '').split(/\s+/).some((c) => SPAN_BLOCO.has(c)));
function temBloco(el) {
  return el.filhos.some((f) => f.tag && (ehBloco(f) || temBloco(f)));
}
function textoDeNo(f) {
  return f.tag ? f.outerHTML : f.data;
}
const ctxDe = (f) => `${f.tag}${f.attrs.class ? '.' + f.attrs.class.split(/\s+/).join('.') : ''}`;
/** Percorre `el` e devolve as corridas inline entre elementos de bloco. */
function unidades(el, contexto, out) {
  let corrida = '';
  const fechar = () => {
    if (norm(corrida)) out.push({ html: corrida, ctx: contexto });
    corrida = '';
  };
  if (/(^|\s)lv(\s|$)/.test(el.attrs.class ?? '')) {
    // Painel de três níveis: título, depois (aba, painel) intercalados — o
    // produto não tem abas; cada nível vira uma nota com o rótulo da aba.
    const hd = el.querySelector('.lv-hd');
    if (hd) out.push({ html: hd.innerHTML, ctx: 'div.lv-hd' });
    const abas = el.querySelectorAll('.lv-tab');
    const paineis = el.querySelectorAll('.lv-pane');
    abas.forEach((a, i) => {
      out.push({ html: a.innerHTML, ctx: 'lv-tab' });
      if (paineis[i]) out.push({ html: paineis[i].innerHTML, ctx: 'lv-pane' });
    });
    if (abas.length !== paineis.length) out.push({ html: `[painel de três níveis com ${abas.length} abas e ${paineis.length} painéis]`, ctx: 'lv' });
    return;
  }
  for (const f of el.filhos) {
    if (!f.tag) { corrida += f.data; continue; }
    if (f.tag === 'script' || f.tag === 'style' || f.tag === 'svg') continue;
    if (!ehBloco(f) && !temBloco(f)) { corrida += textoDeNo(f); continue; }
    fechar();
    const cls = f.attrs.class ?? '';
    if (f.tag === 'div' && /(^|\s)inst(\s|$)/.test(cls)) { out.push({ inst: f }); continue; }
    if (!temBloco(f)) { if (norm(f.innerHTML)) out.push({ html: f.innerHTML, ctx: ctxDe(f) }); continue; }
    unidades(f, ctxDe(f), out);
  }
  fechar();
}

export function aulasDaFonte(n) {
  const m = carregarModulo(n, { instrumentar: false });
  const aulas = [];
  for (let k = 1; k <= 20; k++) {
    const sec = m.doc.getElementById(`a${String(k).padStart(2, '0')}`);
    if (!sec) break;
    const wrap = sec.querySelector('div.wrap') ?? sec;
    const secId = wrap.querySelector('div.sec-id');
    const h2 = wrap.querySelector('h2');
    const lede = wrap.querySelector('p.lede');
    const corpo = [];
    for (const f of wrap.filhos) {
      if (f === secId || f === h2 || f === lede) continue;
      if (!f.tag) { if (norm(f.data)) corpo.push({ html: f.data, ctx: 'texto-solto' }); continue; }
      const cls = f.attrs.class ?? '';
      if (f.tag === 'div' && /(^|\s)inst(\s|$)/.test(cls)) { corpo.push({ inst: f }); continue; }
      if (!ehBloco(f) && !temBloco(f)) { corpo.push({ html: f.outerHTML, ctx: f.tag }); continue; }
      // um elemento-folha (p, h3) vira uma unidade só
      if (!temBloco(f) && !/(^|\s)lv(\s|$)/.test(cls)) { corpo.push({ html: f.innerHTML, ctx: ctxDe(f) }); continue; }
      const out = [];
      unidades(f, ctxDe(f), out);
      corpo.push(...out);
    }
    aulas.push({
      k,
      secId: secId ? secId.innerHTML : null,
      h2: h2 ? h2.innerHTML : null,
      lede: lede ? lede.innerHTML : null,
      corpo,
    });
  }
  return { modulo: m, aulas };
}

/** Texto do instrumento na fonte: id, nome, intro, rótulos, opções, nota. */
export function textoDoInstrumento(inst) {
  const q = (s) => inst.querySelectorAll(s);
  const t = (e) => (e ? e.innerHTML : null);
  return {
    id: norm(t(inst.querySelector('.inst-hd .id'))),
    nome: t(inst.querySelector('.inst-hd .nm')) ?? t(inst.querySelector('.inst-hd .ti')),
    intro: t(inst.querySelector('p.inst-intro')),
    // o rótulo de campo traz a unidade num <span class="unit"> — o contrato a guarda em `unit`
    rotulos: [...q('.seg-lb'), ...q('.field-label'), ...q('.ro .k'), ...q('label')]
      .map((e) => (e ? e.innerHTML.replace(/<span class="unit">[\s\S]*?<\/span>/g, '') : null))
      .filter((x) => x && norm(x)),
    unidades: q('.field-label .unit').map(t),
    opcoes: [...q('.seg button'), ...q('select option')].map(t).filter((x) => x && norm(x)),
    nota: [...q('p.disc'), ...q('p.srcnote'), ...q('.srcnote')].map(t).filter(Boolean),
  };
}

// ── o que o .ts entrega ─────────────────────────────────────────────────────
function entradasDoCorpo(lead, blocos) {
  const out = [];
  if (lead) out.push({ k: 'lead', t: lead });
  for (const b of blocos ?? []) {
    switch (b.kind) {
      case 'titulo': out.push({ k: 'titulo', t: `${b.numero ?? ''} ${b.texto}` }); break;
      case 'paragrafo': out.push({ k: 'paragrafo', t: b.html }); break;
      case 'formula': out.push({ k: 'formula', t: b.eq }); if (b.desc) out.push({ k: 'formula-desc', t: b.desc }); break;
      case 'nota': if (b.label) out.push({ k: 'nota-label', t: b.label }); out.push({ k: 'nota', t: b.html }); break;
      case 'lista': for (const it of b.itens) out.push({ k: 'lista', t: it }); break;
      case 'tabela': for (const l of b.linhas) for (const c of l) out.push({ k: 'celula', t: c }); break;
      default: out.push({ k: `?${b.kind}`, t: '' });
    }
  }
  return out;
}

const PARES = ['span', 'b', 'strong', 'i', 'em', 'u', 'sub', 'sup', 'p', 'ul', 'li'];
export function orfaos(strings) {
  const achados = [];
  for (const { onde, s } of strings) {
    for (const tag of PARES) {
      const ab = (s.match(new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi')) || []).length;
      const fe = (s.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
      if (ab !== fe) achados.push({ onde, tag, ab, fe, trecho: norm(s).slice(0, 70) });
    }
  }
  return achados;
}

export const VOCABULARIO_INTERNO = /GridAlpha|War Room|\bTravas?\b|Cobaia Zero|Summit/;

// ── verificação ──────────────────────────────────────────────────────────────
export async function verificarModulo({ n, editoriais, faltasExplicadas = {}, soAula = null, verboso = false }) {
  const NN = String(n).padStart(2, '0');
  const mod = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
  const LEAD = mod[`MODULO_${NN}_LEAD`];
  const CORPO = mod[`MODULO_${NN}_CORPO`];
  const AULAS = mod[`MODULO_${NN}_AULAS`];
  const INSTS = mod[`INSTRUMENTOS_MODULO_${NN}`] ?? [];
  const CALC = (await import(pathToFileURL(path.join(RAIZ, `src/lib/data/calculadoras/m${NN}.ts`)).href)).CALCULADORAS ?? {};
  const uso = {};
  const editorial = (s) => {
    // Q13: rótulo em <b> colado ao valor na fonte ("<b>Cliente</b>A própria",
    // pares chave-valor que o CSS da fonte separava em linhas) recebe " — ".
    const separado = String(s).replace(/<\/b>(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/g, () => { uso['Q13 (rótulo colado → " — ")'] = (uso['Q13 (rótulo colado → " — ")'] || 0) + 1; return '</b> — '; });
    let r = norm(separado);
    for (const [re, por, nome] of editoriais) {
      const k = (r.match(re) || []).length;
      if (k) { uso[nome] = (uso[nome] || 0) + k; r = r.replace(re, por); }
    }
    return r;
  };

  const { aulas } = aulasDaFonte(n);
  const resumo = [];
  let falhou = false;
  const instVistos = new Set();

  for (const a of aulas) {
    if (soAula && a.k !== soAula) continue;
    const id = `aula-${NN}-${String(a.k).padStart(2, '0')}`;
    const meta = AULAS.find((x) => x.id === id);
    const lead = LEAD[id];
    const entradas = entradasDoCorpo(lead, CORPO[id]);
    const faltas = [];

    // título e subtítulo: h2 → title; lente do sec-id → subtitle
    if (!meta) faltas.push({ id: `${id}/meta`, t: '[aula ausente em MODULO_NN_AULAS]' });
    else {
      if (norm(meta.title) !== editorial(a.h2)) faltas.push({ id: `${id}/titulo`, t: a.h2 });
      const lente = a.secId ? norm(a.secId).replace(/^Aula \d+ · /, '') : null;
      if (lente && norm(meta.subtitle) !== editorial(lente)) faltas.push({ id: `${id}/subtitulo`, t: lente });
    }
    if (a.lede && editorial(a.lede) !== norm(lead)) faltas.push({ id: `${id}/lede`, t: a.lede });
    if (!a.lede && lead) faltas.push({ id: `${id}/lede`, t: '[o .ts traz lead que a fonte não tem]' });

    // corpo, em ordem
    let pos = 0;
    let u = 0;
    const instDaAula = [];
    for (const x of a.corpo) {
      if (x.inst) { instDaAula.push(x.inst); continue; }
      u++;
      const ehEq = /\bfe\b/.test(x.ctx);
      let alvo = ehEq ? editorial(x.html).replace(/\s+/g, '') : editorial(x.html);
      // Nome que o próprio script trunca para caber na grade (`n.slice(0,24)+'…'`, M17 jg-us):
      // o produto traz o nome inteiro; confere-se o prefixo, sem as reticências.
      if (/^div\.jg-k/.test(x.ctx) && alvo.endsWith('…')) alvo = alvo.slice(0, -1).trim();
      if (!alvo) continue;
      const cmp = (e) => (ehEq ? compacto(e.t) : norm(e.t));
      let i = -1;
      for (let k = pos; k < entradas.length; k++) if (cmp(entradas[k]).includes(alvo)) { i = k; break; }
      if (i >= 0) {
        pos = i;
        // índice e expoente: a equação do produto leva <sub>/<sup> como a fonte
        const conta = (s) => (String(s).match(/<su[bp]>/g) || []).join('');
        if (ehEq && conta(x.html) !== conta(entradas[i].t)) faltas.push({ id: `${id}/u${u}(sub/sup)`, t: x.html });
        continue;
      }
      const fora = entradas.findIndex((e) => cmp(e).includes(alvo));
      faltas.push({ id: `${id}/u${u}(${x.ctx})`, t: x.html, foraDeOrdem: fora >= 0 });
    }

    // instrumentos da aula
    const idsDaAula = (meta?.instruments ?? []).map((x) => (typeof x === 'string' ? x : x.id));
    for (const el of instDaAula) {
      const f = textoDoInstrumento(el);
      const num = f.id.replace(/\D/g, '').padStart(2, '0');
      const instId = `m${NN}-inst-${num}`;
      instVistos.add(instId);
      const obj = INSTS.find((x) => x.id === instId);
      if (!obj) { faltas.push({ id: `${instId}`, t: `[instrumento ${f.id} não portado]` }); continue; }
      if (!idsDaAula.includes(instId)) faltas.push({ id: `${instId}/aula`, t: `[instrumento ${f.id} não ligado à ${id}]` });
      // rótulos que o script escreve no painel (p. ex. "Defeito dominante") estão no veredito do cenário-padrão
      const padrao = Object.fromEntries(obj.fields.map((c) => [c.id, c.defaultValue]));
      const vereditoPadrao = CALC[instId]?.(padrao)?.veredito ?? null;
      const textos = [obj.title, obj.note, obj.formula, vereditoPadrao, ...obj.fields.flatMap((c) => [c.label, c.unit, ...(c.options ?? []).map((o) => o.label)]), ...obj.outputs.map((o) => o.label)]
        .filter(Boolean).map(norm);
      const exige = [['nome', f.nome], ['intro', f.intro], ...f.rotulos.map((r) => ['rótulo', r]), ...f.unidades.map((r) => ['unidade', r]), ...f.opcoes.map((o) => ['opção', o]), ...f.nota.map((t) => ['nota', t])];
      for (const [k, t] of exige) {
        const alvo = editorial(t);
        if (alvo && !textos.some((x) => x.includes(alvo))) faltas.push({ id: `${instId}/${k}`, t });
      }
    }

    const explicadas = [];
    const reais = [];
    for (const f of faltas) {
      const chave = Object.keys(faltasExplicadas).find((k) => f.id.startsWith(k));
      if (chave) explicadas.push({ ...f, razao: faltasExplicadas[chave] });
      else reais.push(f);
    }

    const strs = [];
    if (lead) strs.push({ onde: 'lead', s: lead });
    entradas.forEach((e, i) => strs.push({ onde: `corpo#${i}(${e.k})`, s: e.t }));
    const orf = orfaos(strs);
    const vocab = entradas.filter((e) => VOCABULARIO_INTERNO.test(norm(e.t)));
    if (meta && VOCABULARIO_INTERNO.test(`${meta.title} ${meta.subtitle}`)) vocab.push({ k: 'meta', t: meta.title });
    const desconhecidos = entradas.filter((e) => e.k.startsWith('?'));

    console.log(`\n══ Aula ${String(a.k).padStart(2, '0')} — ${norm(a.h2)}`);
    console.log(`   unidades da fonte: ${u} · instrumentos: ${instDaAula.length}   FALTA: ${reais.length}   explicadas: ${explicadas.length}   ÓRFÃO: ${orf.length}   VOCABULÁRIO: ${vocab.length}`);
    for (const f of reais) console.log(`   - ${f.id}${f.foraDeOrdem ? ' (existe, fora da ordem)' : ''}: «${norm(f.t).slice(0, verboso ? 400 : 120)}»`);
    for (const f of explicadas) console.log(`   · explicada ${f.id}: ${f.razao}`);
    for (const o of orf) console.log(`   ! órfão ${o.onde} <${o.tag}>: ${o.ab} abre, ${o.fe} fecha — «${o.trecho}»`);
    for (const v of vocab) console.log(`   ! vocabulário interno (${v.k}): «${norm(v.t).match(VOCABULARIO_INTERNO)?.[0]}» em «${norm(v.t).slice(0, 90)}»`);
    resumo.push({ k: a.k, u, falta: reais.length, explicadas: explicadas.length, orfaos: orf.length, vocab: vocab.length });
    if (reais.length || orf.length || vocab.length || desconhecidos.length) falhou = true;
  }

  // instrumento de módulo (§MAP): fora de aula
  if (!soAula) {
    const m = carregarModulo(n, { instrumentar: false });
    const mapa = m.doc.getElementById('map');
    for (const el of mapa ? mapa.querySelectorAll('div.inst') : []) {
      const f = textoDoInstrumento(el);
      const instId = `m${NN}-inst-${f.id.replace(/\D/g, '').padStart(2, '0')}`;
      const obj = INSTS.find((x) => x.id === instId);
      const ok = Boolean(obj);
      console.log(`\n══ §MAP — ${f.id} ${norm(f.nome)}: ${ok ? 'portado em INSTRUMENTOS' : 'NÃO PORTADO'}`);
      if (!ok) falhou = true;
    }
  }

  console.log('\n══ Resumo');
  console.log('   aula  unidades  FALTA  explicadas  ÓRFÃO  VOCAB');
  for (const r of resumo) console.log(`   ${String(r.k).padStart(4)}  ${String(r.u).padStart(8)}  ${String(r.falta).padStart(5)}  ${String(r.explicadas).padStart(10)}  ${String(r.orfaos).padStart(5)}  ${String(r.vocab).padStart(5)}`);
  const tot = (k) => resumo.reduce((s, r) => s + r[k], 0);
  console.log(`   total ${String(tot('u')).padStart(8)}  ${String(tot('falta')).padStart(5)}  ${String(tot('explicadas')).padStart(10)}  ${String(tot('orfaos')).padStart(5)}  ${String(tot('vocab')).padStart(5)}`);
  if (Object.keys(uso).length) console.log(`   trocas editoriais aplicadas à fonte: ${JSON.stringify(uso)}`);
  if (ENTIDADES_DESCONHECIDAS.size) { console.log(`   ! entidades sem tradução: ${[...ENTIDADES_DESCONHECIDAS].join(' ')}`); falhou = true; }
  console.log(falhou ? '   RESULTADO: FALHA' : '   RESULTADO: 0 falta, 0 órfão');
  return falhou ? 1 : 0;
}

// ── M16 ──────────────────────────────────────────────────────────────────────
// P24: GridAlpha → NIVAR. Q03: "Trava 2" (do War Room) é a lista de fontes
// oficiais do §00.9 (L1273–1274); o rótulo vira o nome da coisa, com registro
// em docs/alexandria-v3/porte/m16.md.
export const EDITORIAIS_M16 = [
  [/GridAlpha/g, 'NIVAR', 'P24 (GridAlpha → NIVAR)'],
  [/Extensão declarada da Trava 2, em uso/g, 'Extensão declarada da lista de fontes oficiais, em uso', 'Q03 (Trava 2 → lista de fontes oficiais)'],
  // O §00 (tese) não é tela da aula v3: a remissão a uma subseção dele vira
  // "a abertura do módulo" (o porte antigo já fazia isso em dois lugares).
  [/declarada no §00\.\d/g, 'declarada na abertura do módulo', 'remissão ao §00 → abertura do módulo'],
  [/“crédito” do §00\.\d/g, '“crédito” da abertura do módulo', 'remissão ao §00 → abertura do módulo'],
];

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const soAula = argv.includes('--aula') ? Number(argv[argv.indexOf('--aula') + 1]) : null;
  process.exit(await verificarModulo({ n: 16, editoriais: EDITORIAIS_M16, soAula, verboso: argv.includes('--v') }));
}
