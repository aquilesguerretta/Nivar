// Verifica o porte do corpo das aulas do M14 ou do M15 contra o HTML original.
//
// Uso: node tools/alexandria-dados/porte/verificar-porte-m14-m15.mjs <14|15> [--aula N] [--detalhe]
// (os atalhos verificar-porte-m14.mjs / verificar-porte-m15.mjs chamam este.)
//
// Lê o .ts DE VERDADE (import; o Node 24 remove os tipos) e compara o que o produto
// entrega — MODULO_NN_LEAD, MODULO_NN_CORPO, título e subtítulo de MODULO_NN_AULAS —
// com a leitura do HTML (fonte-html-m14-m15.mjs). Quatro verificações:
//
//   1. FALTA     — trecho-folha da fonte que não aparece no .ts, na ordem da fonte.
//                  Folha = elemento sem filho de bloco (só texto e tags de linha);
//                  texto solto entre filhos de bloco também é folha. O corpo do .ts é
//                  lido como uma sequência única (entradas unidas por espaço), para
//                  que uma estrutura da fonte partida em itens de lista ainda case.
//   2. INVENTADO — entrada do .ts (parágrafo, célula, item, rótulo, fórmula) cujo
//                  texto NÃO é substring do texto da aula na fonte. É o que pega
//                  rótulo composto, cabeçalho de tabela que a fonte não tem, frase nova.
//                  Voz da Alexandria entra só pela lista VOZ, com rótulo e razão.
//   3. ÓRFÃO     — tag HTML aberta sem fechar (ou o contrário) numa string do .ts.
//   4. CABEÇA    — lead = p.lede; título = div.sec-id (parte em <b>); subtítulo = h2.
//
// Substituições editoriais (Q03): aplicadas ao lado da FONTE antes de comparar, cada
// uso contado e impresso. Nada é explicado em silêncio.
// Sai com 1 se houver FALTA, INVENTADO, ÓRFÃO ou CABEÇA divergente.

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lerModulo, temClasse } from './fonte-html-m14-m15.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const argv = process.argv.slice(2);
const N = Number(argv[0]);
if (N !== 14 && N !== 15) { console.error('uso: verificar-porte-m14-m15.mjs <14|15>'); process.exit(2); }
const SO_AULA = argv.includes('--aula') ? Number(argv[argv.indexOf('--aula') + 1]) : null;
const DETALHE = argv.includes('--detalhe');
const NN = String(N);

// Q03 — "GridAlpha" e vocabulário interno não chegam ao aluno. Nas aulas do M14/M15
// só "GridAlpha" ocorre (War Room/Trava aparecem no aparato, fora das aulas).
const EDITORIAIS = [
  [/GridAlpha/g, 'NIVAR', 'Q03 (GridAlpha → NIVAR)'],
  // Q13: palavra composta partida na quebra de linha do HTML ("pré-" + quebra + "tratamento")
  [/([A-Za-zÀ-ÿ])-[ \t]*\r?\n\s*/g, '$1-', 'Q13 (hífen partido na quebra de linha)'],
  // Q02/Q03 (QA-M14-05): remissão interna "Bloco NN" → "Módulo NN", o nome que o aluno vê
  [/\bBloco (\d+)/g, 'Módulo $1', 'Q02 (Bloco NN → Módulo NN)'],
  // S4 (QA-M14-05): remissão a seção interna que a aula não mostra
  [/\s*Ver §00\.1\./g, '', 'S4 (remissão "Ver §00.1." fora)'],
];

// P7 (bar.md): a nota "Onde isso entra no produto" não é exibida. Sai do esperado, contada.
const FORA_P7 = 'Onde isso entra no produto';
const foraP7 = { n: 0 };
const ehForaP7 = (f) => f.tag === 'div' && f.classes.includes('box') && /<span class="tag">\s*Onde isso entra no produto\s*<\/span>/.test(f.html);

// Entradas do .ts que não vêm da fonte e estão autorizadas, com a razão.
// Chave: prefixo do texto normalizado.
const VOZ = {};

// ── normalização ────────────────────────────────────────────
const ENT = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ndash: '–', mdash: '—', hellip: '…', times: '×', middot: '·', divide: '÷', deg: '°', sup2: '²', sup3: '³', micro: 'µ', rarr: '→', larr: '←', ge: '≥', le: '≤', plusmn: '±', asymp: '≈', ne: '≠', minus: '−' };
const decodificar = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return ENT[e.toLowerCase()] ?? m;
});
const norm = (s) => decodificar(String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/[\s ]+/g, ' ').trim()
  // "·" é separador tipográfico, não palavra: o gerador o usa para juntar rótulo e
  // nome que a fonte separava por CSS, e a fonte o usa à vontade. Não conta.
  .replace(/\s*·\s*/g, ' ').replace(/ ([,.;:)])/g, '$1').replace(/\( /g, '(').trim();
const compacto = (s) => norm(s).replace(/\s+/g, '');
const uso = {};
const editorial = (s) => {
  let r = s;
  for (const [re, por, nome] of EDITORIAIS) {
    const k = (r.match(re) || []).length;
    if (k) { uso[nome] = (uso[nome] || 0) + k; r = r.replace(re, por); }
  }
  return r;
};

// ── fonte ───────────────────────────────────────────────────
const fonte = lerModulo(N);
const LINHA = new Set(['b', 'strong', 'i', 'em', 'small', 'span', 'sub', 'sup', 'a', 'u', 'br', 'code', 'mark', 'abbr']);
const ehBloco = (no) => !LINHA.has(no.tag);
const temBloco = (no) => no.filhos.some((f) => ehBloco(f) || temBloco(f));

/** Folhas de um nó: textos contíguos sem estrutura de bloco por dentro. */
function folhas(no) {
  if (!temBloco(no)) return [fonte.inner(no)];
  // Texto solto e elementos de linha vizinhos formam UMA folha; cada filho de
  // bloco fecha a folha corrente e contribui as próprias folhas.
  const juntas = [];
  let acc = '';
  const fecha = () => { if (norm(acc)) juntas.push(acc); acc = ''; };
  let pos = no.o1;
  for (const f of no.filhos) {
    acc += fonte.html.slice(pos, f.o0);
    if (ehBloco(f)) { fecha(); juntas.push(...folhas(f)); }
    else acc += fonte.html.slice(f.o0, f.c1);
    pos = f.c1;
  }
  acc += fonte.html.slice(pos, no.c0);
  fecha();
  return juntas;
}

const safs = [];
function esperadoDaAula(a) {
  const exp = [];
  for (const f of a.filhos) {
    if (f.instrumento) continue;
    if (ehForaP7(f)) { foraP7.n++; continue; }
    if (f.tag === 'h3') {
      const m = /<span class="num">§?\s*([^<]*)<\/span>([\s\S]*)/.exec(f.html);
      exp.push({ linha: f.linha, t: m ? `${m[1]} ${m[2]}` : f.html, de: 'h3' });
      continue;
    }
    if (f.tag === 'div' && f.classes.includes('fx')) {
      for (const g of f.no.filhos) {
        const t = fonte.inner(g);
        exp.push({ linha: f.linha, t, de: `fx.${(/class="([^"]*)"/.exec(g.attrs) || [])[1]}`, compacto: temClasse(g, 'fe') });
      }
      continue;
    }
    if (f.tag === 'div' && f.classes.includes('lv')) {
      // ordem intercalada (aba, painel): a leitura não tem abas; cada nível vira
      // uma nota com o rótulo da aba
      const hd = f.no.filhos.find((x) => temClasse(x, 'lv-hd'));
      const abas = f.no.filhos.find((x) => temClasse(x, 'lv-tabs')).filhos;
      const paineis = f.no.filhos.find((x) => temClasse(x, 'lv-bd')).filhos;
      exp.push({ linha: f.linha, t: fonte.inner(hd), de: 'lv-hd' });
      abas.forEach((ab, i) => {
        exp.push({ linha: f.linha, t: fonte.inner(ab), de: 'lv-tab' });
        exp.push({ linha: f.linha, t: fonte.inner(paineis[i]), de: 'lv-pane' });
      });
      continue;
    }
    if (f.tag === 'div' && f.classes.includes('saf')) {
      // calendário de safra: o dado está na CLASSE de cada mês → diagrama;
      // conferido contra DADOS_DA_FONTE mais abaixo. A nota de rodapé é texto.
      if (!safs.some((s) => s.no === f.no)) safs.push({ aula: a.numero, no: f.no, linha: f.linha });
      exp.push({ linha: f.linha, t: fonte.inner(f.no.filhos.find((x) => temClasse(x, 'saf-n'))), de: 'saf-n' });
      continue;
    }
    for (const t of folhas(f.no)) exp.push({ linha: f.linha, t, de: `${f.tag}.${f.classes.join('.')}` });
  }
  return exp;
}

function textoDaAula(a) {
  return a.filhos
    .filter((f) => !f.instrumento && !ehForaP7(f))
    .map((f) => (f.classes.includes('saf') ? folhas(f.no.filhos.find((x) => temClasse(x, 'saf-n'))) : folhas(f.no)).map((x) => norm(editorial(x))).join(' '))
    .join(' ');
}

// ── o .ts ───────────────────────────────────────────────────
const TS = path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`);
const mod = await import(pathToFileURL(TS).href);
const LEAD = mod[`MODULO_${NN}_LEAD`];
const CORPO = mod[`MODULO_${NN}_CORPO`];
const AULAS = mod[`MODULO_${NN}_AULAS`];
const idAula = (n) => `aula-${NN}-${String(n).padStart(2, '0')}`;

function entradas(n) {
  const out = [];
  for (const b of CORPO[idAula(n)] ?? []) {
    switch (b.kind) {
      case 'titulo': out.push({ k: 'titulo', t: `${b.numero ?? ''} ${b.texto}` }); break;
      case 'paragrafo': out.push({ k: 'paragrafo', t: b.html }); break;
      case 'formula': out.push({ k: 'formula', t: b.eq, compacto: true }); if (b.desc) out.push({ k: 'formula-desc', t: b.desc }); break;
      case 'nota': if (b.label) out.push({ k: 'nota-label', t: b.label }); out.push({ k: 'nota', t: b.html }); break;
      case 'lista': for (const it of b.itens) out.push({ k: 'lista', t: it }); break;
      case 'tabela': for (const l of b.linhas) for (const c of l) out.push({ k: 'celula', t: c }); break;
      default: out.push({ k: `?${b.kind}`, t: '' });
    }
  }
  return out;
}

const PARES = ['span', 'b', 'strong', 'i', 'em', 'u', 'sub', 'sup', 'p', 'ul', 'li', 'small', 'a'];
function orfaos(strs) {
  const r = [];
  for (const { onde, s } of strs) for (const tag of PARES) {
    const ab = (s.match(new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi')) || []).length;
    const fe = (s.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (ab !== fe) r.push({ onde, tag, ab, fe, trecho: norm(s).slice(0, 70) });
  }
  return r;
}

// ── execução ────────────────────────────────────────────────
let falhou = false;
const resumo = [];
for (const a of fonte.aulas) {
  if (SO_AULA && a.numero !== SO_AULA) continue;
  const id = idAula(a.numero);
  const ent = entradas(a.numero);
  const seq = ent.map((e) => norm(e.t)).join(' ');
  const seqC = ent.map((e) => compacto(e.t)).join('');

  // 1 · FALTA
  const faltas = [];
  let pos = 0, posC = 0;
  for (const e of esperadoDaAula(a)) {
    if (e.compacto) {
      const alvo = compacto(editorial(e.t));
      const i = seqC.indexOf(alvo);
      if (i < 0) faltas.push({ ...e, alvo });
      continue;
    }
    const alvo = norm(editorial(e.t));
    if (!alvo) continue;
    const i = seq.indexOf(alvo, pos);
    if (i < 0) faltas.push({ ...e, alvo, foraDeOrdem: seq.includes(alvo) });
    else pos = i + alvo.length;
  }
  void posC;

  // 2 · INVENTADO
  const texto = norm(editorial(textoDaAula(a)));
  const textoC = texto.replace(/\s+/g, '');
  const inventados = [];
  for (const e of ent) {
    const t = norm(e.t);
    if (!t) continue;
    const ok = e.compacto ? textoC.includes(compacto(e.t)) : texto.includes(t);
    if (ok) continue;
    const voz = Object.keys(VOZ).find((k) => t.startsWith(k));
    if (voz) continue;
    inventados.push({ k: e.k, t });
  }

  // 3 · ÓRFÃO
  const strs = [{ onde: 'lead', s: LEAD[id] ?? '' }, ...ent.map((e, i) => ({ onde: `#${i}(${e.k})`, s: e.t }))];
  const orf = orfaos(strs);
  const desconhecidos = ent.filter((e) => e.k.startsWith('?'));

  // 4 · CABEÇA
  const cab = [];
  const aula = AULAS.find((x) => x.id === id);
  const tituloFonte = norm(editorial((/<b>([\s\S]*?)<\/b>/.exec(a.secId) || [])[1] ?? ''));
  if (norm(LEAD[id]) !== norm(editorial(a.lede))) cab.push(`lead difere: «${norm(LEAD[id]).slice(0, 60)}» × «${norm(a.lede).slice(0, 60)}»`);
  if (!aula) cab.push('aula ausente em AULAS');
  else {
    // Q02: o nome vem do catálogo; no M14 é o <b> do sec-id, no M15 o h2 partido
    // em nome + descritor. Basta que título e subtítulo sejam trechos da fonte.
    const h2 = norm(editorial(a.h2));
    if (!norm(aula.title) || !(tituloFonte === norm(aula.title) || h2.includes(norm(aula.title)))) cab.push(`título: «${aula.title}» não é o sec-id «${tituloFonte}» nem trecho do h2`);
    if (norm(aula.subtitle) && !h2.includes(norm(aula.subtitle))) cab.push(`subtítulo: «${aula.subtitle}» não é trecho do h2 «${h2}»`);
  }

  const n = faltas.length + inventados.length + orf.length + desconhecidos.length + cab.length;
  if (n) falhou = true;
  resumo.push({ aula: a.numero, esperado: esperadoDaAula(a).length, entradas: ent.length, falta: faltas.length, inventado: inventados.length, orfao: orf.length, cabeca: cab.length });
  console.log(`\n══ M${NN} · Aula ${String(a.numero).padStart(2, '0')} (L${a.linha}) — FALTA ${faltas.length} · INVENTADO ${inventados.length} · ÓRFÃO ${orf.length} · CABEÇA ${cab.length}${desconhecidos.length ? ` · tipo desconhecido ${desconhecidos.length}` : ''}`);
  const lim = DETALHE ? Infinity : 12;
  for (const f of faltas.slice(0, lim)) console.log(`   - FALTA L${f.linha} [${f.de}]${f.foraDeOrdem ? ' (existe, fora de ordem)' : ''}: «${f.alvo.slice(0, 140)}»`);
  for (const f of inventados.slice(0, lim)) console.log(`   + INVENTADO [${f.k}]: «${f.t.slice(0, 140)}»`);
  for (const o of orf) console.log(`   ! ÓRFÃO ${o.onde} <${o.tag}> ${o.ab}/${o.fe}: «${o.trecho}»`);
  for (const c of cab) console.log(`   ~ ${c}`);
}

// ── dado de diagrama extraído de classe de CSS (calendário de safra) ──
if (safs.length) {
  const arq = path.join(RAIZ, `src/components/alexandria/v3/diagramas/m${NN}/dados-da-fonte.ts`);
  let dados = null;
  try { dados = (await import(pathToFileURL(arq).href)).DADOS_DA_FONTE; } catch { /* ausente */ }
  for (const s of safs) {
    const chave = `a${String(s.aula).padStart(2, '0')}-saf`;
    const lido = s.no.filhos.filter((r) => temClasse(r, 'saf-r')).map((r) => ({
      cadeia: norm(fonte.inner(r.filhos.find((x) => temClasse(x, 'saf-k')))),
      meses: r.filhos.find((x) => temClasse(x, 'saf-b')).filhos.map((m) => ({ mes: norm(fonte.inner(m)), ativo: ((/class="([^"]*)"/.exec(m.attrs) || [])[1] ?? '').split(/\s+/).find((k) => k.startsWith('on')) ?? null })),
    }));
    const normDados = (d) => d && d.map((r) => ({ cadeia: norm(r.cadeia), meses: r.meses.map((m) => ({ mes: norm(m.mes), ativo: m.ativo })) }));
    const ok = dados && JSON.stringify(normDados(dados[chave])) === JSON.stringify(lido);
    console.log(`\n══ Diagrama ${chave} (L${s.linha}): ${ok ? 'dados batem com a fonte' : 'DIVERGE da fonte'} — ${lido.map((r) => `${r.cadeia}: ${r.meses.filter((m) => m.ativo).length} meses ativos`).join(' · ')}`);
    if (!ok) falhou = true;
  }
}

console.log('\n══ Resumo');
console.log('   aula  esperado  entradas  FALTA  INVENTADO  ÓRFÃO  CABEÇA');
for (const r of resumo) console.log(`   ${String(r.aula).padStart(4)}  ${String(r.esperado).padStart(8)}  ${String(r.entradas).padStart(8)}  ${String(r.falta).padStart(5)}  ${String(r.inventado).padStart(9)}  ${String(r.orfao).padStart(5)}  ${String(r.cabeca).padStart(6)}`);
console.log(`   fora da interface por P7 ("${FORA_P7}"): ${foraP7.n / 2} nota(s) — contadas duas vezes (esperado e lista)`);
if (Object.keys(uso).length) console.log(`   substituições editoriais aplicadas à fonte: ${JSON.stringify(uso)}`);
console.log(falhou ? '   RESULTADO: FALHA' : '   RESULTADO: 0 falta, 0 inventado, 0 órfão');
process.exit(falhou ? 1 : 0);
