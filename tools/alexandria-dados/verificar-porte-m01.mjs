// Verifica o porte do Módulo 01: cada string de conteúdo da extração verificada
// (docs/alexandria-v2/extraction/m01/aula-0N.json) precisa aparecer em
// src/lib/data/alexandria-modulo-01-content.ts — e aparecer na ordem da fonte.
//
// Como lê o .ts: importa o módulo de verdade (Node 24 remove os tipos sozinho),
// em vez de regex sobre texto. O que se compara é o que o produto entrega:
// MODULO_01_LEAD, MODULO_01_CORPO, INSTRUMENTOS_MODULO_01, MODULO_01_AULAS.
//
// Comparação por substring, em texto: tags fora, entidades HTML decodificadas,
// espaço colapsado. Fórmulas comparam sem nenhum espaço (o `.eq` do bloco é texto
// puro: <sub>/<sup> viram texto solto). Três verificações:
//   1. FALTA   — string da extração que não aparece no .ts (ou fora de ordem).
//   2. ÓRFÃO   — tag HTML fechada sem abertura (ou aberta sem fechar) no .ts.
//   3. HTML    — informativo: parágrafos cujo HTML difere do HTML da fonte além
//                das diferenças declaradas (span.hl e atributos class removidos).
//
// Faltas declaradas (FALTAS_EXPLICADAS) saem listadas à parte, com a razão. Nada
// é explicado em silêncio: a razão aparece na saída.
//
// Uso: node tools/alexandria-dados/verificar-porte-m01.mjs [--html] [--aula 4]
// Sai com 1 se houver falta não explicada ou tag órfã.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const EXT = path.join(RAIZ, 'docs/alexandria-v2/extraction/m01');
const TS = path.join(RAIZ, 'src/lib/data/alexandria-modulo-01-content.ts');

const argv = process.argv.slice(2);
const MOSTRAR_HTML = argv.includes('--html');
const SO_AULA = argv.includes('--aula') ? Number(argv[argv.indexOf('--aula') + 1]) : null;

// Troca editorial já decidida pelo Founder (P24): GridAlpha → NIVAR no texto visível.
// Aplicada ao lado da EXTRAÇÃO antes de comparar; cada uso é contado e reportado.
// Decisões de conteúdo de 15/11/2026 (docs/alexandria-v3/DECISOES-2026-11-15.md),
// registradas uma a uma em docs/alexandria-v3/m01-decisoes.md. As frases novas
// (notas "Nota da Alexandria") são acréscimo e não entram aqui: o verificador só
// confere que nada da fonte sumiu sem nome.
const EDITORIAIS = [
  [/GridAlpha/g, 'NIVAR', 'P24 (empresa = NIVAR)'],
  [/a Trava 4 do War Room/g, 'uma trava operacional da NIVAR', 'Q03 / D09 (vocabulário interno)'],
  [/O exponencial é o que muda tudo/g, 'O quadrático é o que muda tudo', 'QA-M01-A04 (quadrático)'],
  [/Esse comportamento exponencial/g, 'Esse comportamento quadrático', 'QA-M01-A04 (quadrático)'],
  [/Alta e média tensão \(≥ 2,3 kV\)/g, 'Alta e média tensão (em regra, ≥ 2,3 kV)', 'QA-M01-A06 (Grupo A em regra)'],
  [/; os outros 15% são reativos circulando pela rede\./g, '.', 'QA-M01-A07 (15% não são reativos)'],
];

// Faltas conhecidas que não cabem no tipo atual do produto. A chave é o prefixo
// de `id` do item esperado; o valor é a razão, impressa na saída.
const FALTAS_EXPLICADAS = {
  'm01-a07-fig-01':
    'Figura do triângulo de potência (SVG + 5 leituras): o desenho e as leituras são do InstrumentPanel (ehDiagrama, inst-05), com valores dinâmicos; AulaBloco não tem tipo de figura e a posição no fluxo é de AulaViewer.tsx (fora da posse desta tarefa).',
  'instrucao-inst-02':
    'Instrução do instrumento ("Preencha dois campos. O terceiro é calculado."): o tipo Instrument não tem campo para ela (tipo compartilhado, FOUNDRY).',
};

// ── normalização ────────────────────────────────────────────────────────────
const ENTIDADES = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ndash: '–', mdash: '—', hellip: '…', times: '×', middot: '·', divide: '÷', deg: '°', sup2: '²', sup3: '³', micro: 'µ', ohm: 'Ω', rarr: '→', laquo: '«', raquo: '»', ge: '≥', le: '≤', plusmn: '±', asymp: '≈', ne: '≠' };
const decodificar = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTIDADES[e.toLowerCase()] ?? m;
  });
const semTags = (s) => s.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '');
const colapsar = (s) => s.replace(/[\s ]+/g, ' ').trim();
const norm = (s) => colapsar(decodificar(semTags(String(s ?? ''))));
const compacto = (s) => norm(s).replace(/\s+/g, '');
const editorial = (s, uso) => {
  let r = s;
  for (const [re, por, nome] of EDITORIAIS) {
    const n = (r.match(re) || []).length;
    if (n) { uso[nome] = (uso[nome] || 0) + n; r = r.replace(re, por); }
  }
  return r;
};

// ── o .ts de verdade ────────────────────────────────────────────────────────
const mod = await import(pathToFileURL(TS).href);
const { MODULO_01_LEAD, MODULO_01_CORPO, INSTRUMENTOS_MODULO_01, MODULO_01_AULAS } = mod;
const idAula = (n) => `aula-01-0${n}`;
const idInst = (n) => `inst-0${n}`;

// Entradas planas do que o .ts entrega na apostila, na ordem do fluxo.
function entradasDoCorpo(n) {
  const out = [];
  const lead = MODULO_01_LEAD[idAula(n)];
  if (lead) out.push({ k: 'lead', t: lead });
  for (const b of MODULO_01_CORPO[idAula(n)] ?? []) {
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

// ── o que a extração exige ──────────────────────────────────────────────────
// Lê o HTML de uma célula/item/parágrafo; se o formato não for reconhecido,
// LANÇA — nunca devolve vazio (vazio faria a conferência passar em silêncio).
const htmlDe = (x, onde) => {
  const v = typeof x === 'string' ? x : x?.html ?? x?.texto;
  if (typeof v !== 'string') throw new Error(`formato de extração não reconhecido em ${onde}: ${JSON.stringify(x)?.slice(0, 80)}`);
  return v;
};
function pars(b, chaveLista, chaveHtml, onde) {
  if (Array.isArray(b[chaveLista])) return b[chaveLista].map((p, i) => htmlDe(p, `${onde}/${chaveLista}[${i}]`));
  return [htmlDe(b[chaveHtml], `${onde}/${chaveHtml}`)];
}
function esperadoDoCorpo(j) {
  const exp = [];
  for (const b of j.blocos) {
    const id = b.id;
    switch (b.tipo) {
      case 'lead': exp.push({ id, k: 'lead', t: b.html }); break;
      case 'titulo': exp.push({ id, k: 'titulo', t: `${b.numero ?? ''} ${b.texto}` }); break;
      case 'paragrafo': exp.push({ id, k: 'paragrafo', t: b.html }); break;
      case 'destaque':
        // A01 grava os parágrafos em `paragrafos[]`; A03–A09 gravam o corpo em `html`.
        if (b.rotulo) exp.push({ id: `${id}/rotulo`, k: 'destaque', t: b.rotulo });
        pars(b, 'paragrafos', 'html', id).forEach((p, i) => exp.push({ id: `${id}/p${i + 1}`, k: 'destaque', t: p }));
        break;
      case 'tabela':
        (b.cabecalho ?? []).forEach((c, i) => exp.push({ id: `${id}/cab${i}`, k: 'celula', t: htmlDe(c, `${id}/cab${i}`) }));
        (b.linhas ?? []).forEach((l, r) => l.celulas.forEach((c, i) => exp.push({ id: `${id}/l${r}c${i}`, k: 'celula', t: htmlDe(c, `${id}/l${r}c${i}`) })));
        break;
      case 'formula':
        exp.push({ id, k: 'formula', t: b.eq_texto, compacto: true });
        if (b.desc_texto ?? b.desc) exp.push({ id: `${id}/desc`, k: 'formula-desc', t: b.desc_html ?? b.desc_texto ?? b.desc });
        break;
      case 'lista': b.itens.forEach((it, i) => exp.push({ id: `${id}/i${i}`, k: 'lista', t: htmlDe(it, `${id}/i${i}`) })); break;
      case 'tres_niveis':
        // Ordem intercalada (aba, painel): o produto não tem abas; cada nível vira
        // uma nota com o rótulo da aba como label e o painel como corpo.
        b.abas.forEach((a, i) => {
          exp.push({ id: `${id}/aba${i}`, k: 'nota-label', t: htmlDe(a.rotulo ?? a.html, `${id}/aba${i}`) });
          exp.push({ id: `${id}/painel${i}`, k: 'nota', t: htmlDe(b.paineis[i], `${id}/painel${i}`) });
        });
        break;
      case 'figura': break; // tratada abaixo, a partir de j.figuras
      case 'instrumento': break; // fora do fluxo do corpo; ver esperadoDoInstrumento
      default: exp.push({ id, k: 'DESCONHECIDO', t: `[bloco de tipo não tratado pelo verificador: ${b.tipo}]` });
    }
    if (b.tipo === 'figura') {
      const f = (j.figuras ?? []).find((x) => x.id === b.ref);
      if (!f) { exp.push({ id, k: 'figura', t: `[figura ${b.ref} sem especificação]` }); continue; }
      if (f.celulas) {
        // A03: duas células, cada uma com h5 e rótulo.
        f.celulas.forEach((c, i) => {
          exp.push({ id: `${f.id}/c${i}/h5`, k: 'lista', t: c.h5 });
          exp.push({ id: `${f.id}/c${i}/label`, k: 'lista', t: c.label });
        });
      } else if (f.dados) {
        // A08: sete barras, cada uma com fonte de geração e faixa.
        f.dados.forEach((d, i) => exp.push({ id: `${f.id}/barra${i}`, k: 'lista', t: `${d.fonte_geracao} ${d.faixa_rotulo}` }));
      } else {
        exp.push({ id: f.id, k: 'figura', t: `[figura ${f.id}: ${f.tipo}]` });
      }
    }
  }
  return exp;
}

function esperadoDoInstrumento(j) {
  const exp = [];
  for (const it of j.instrumentos ?? []) {
    const p = `${it.id}`;
    if (it.titulo) exp.push({ id: `${p}/titulo`, t: it.titulo });
    const nota = it.nota_estatica?.html ?? it.nota_estatica?.texto ?? it.nota_estatica;
    if (typeof nota === 'string') exp.push({ id: `${p}/nota`, t: nota });
    (it.entradas ?? []).forEach((e, i) => e.rotulo && exp.push({ id: `${p}/entrada${i}`, t: e.rotulo }));
    (it.saidas ?? []).forEach((s, i) => s.rotulo && exp.push({ id: `${p}/saida${i}`, t: s.rotulo }));
  }
  return exp;
}

// ── execução ────────────────────────────────────────────────────────────────
function achaOrdenado(entradas, esperado, uso) {
  let pos = 0;
  const achados = []; const faltas = [];
  for (const e of esperado) {
    const alvo = e.compacto ? compacto(editorial(e.t, uso)) : norm(editorial(e.t, uso));
    if (!alvo) continue;
    const cmp = (x) => (e.compacto ? compacto(x.t) : norm(x.t));
    let i = -1;
    for (let k = pos; k < entradas.length; k++) if (cmp(entradas[k]).includes(alvo)) { i = k; break; }
    if (i >= 0) { pos = i; achados.push(e); continue; }
    // achou em algum lugar, só que fora de ordem?
    const fora = entradas.findIndex((x) => cmp(x).includes(alvo));
    faltas.push({ ...e, foraDeOrdem: fora >= 0 });
  }
  return { achados, faltas };
}

function achaSolto(textos, esperado, uso) {
  const feno = textos.map(norm);
  const faltas = [];
  for (const e of esperado) {
    const alvo = norm(editorial(e.t, uso));
    if (alvo && !feno.some((x) => x.includes(alvo))) faltas.push(e);
  }
  return faltas;
}

const PARES = ['span', 'b', 'strong', 'i', 'em', 'u', 'sub', 'sup', 'p', 'ul', 'li'];
function orfaos(strings) {
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

// HTML da fonte reduzido ao que o produto guarda: sem span.hl (e o </span> que o
// fecha), sem atributo class/style, sem span.op/num.
function htmlReduzido(h) {
  let s = String(h);
  s = s.replace(/<span class="(?:hl|op|num|calc)"[^>]*>([\s\S]*?)<\/span>/g, '$1');
  s = s.replace(/<(\w+)\s+(?:class|style)="[^"]*"/g, '<$1');
  return colapsar(s.replace(/&nbsp;/g, ' '));
}

const resumo = []; let exitCode = 0;
const uso = {};
const aulas = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !SO_AULA || n === SO_AULA);

for (const n of aulas) {
  const j = JSON.parse(fs.readFileSync(path.join(EXT, `aula-0${n}.json`), 'utf8'));
  const corpo = entradasDoCorpo(n);
  const exp = esperadoDoCorpo(j);
  const { achados, faltas } = achaOrdenado(corpo, exp, uso);

  // instrumento(s) da aula
  const instIds = (MODULO_01_AULAS.find((a) => a.id === idAula(n))?.instruments ?? []).map((x) => (typeof x === 'string' ? x : x.id));
  const instObjs = INSTRUMENTOS_MODULO_01.filter((x) => instIds.includes(x.id));
  const instTextos = instObjs.flatMap((x) => [x.title, x.note, ...(x.fields ?? []).map((f) => f.label), ...(x.outputs ?? []).map((o) => o.label)].filter(Boolean));
  const expInst = esperadoDoInstrumento(j);
  const faltasInst = achaSolto(instTextos, expInst, uso);

  // exercícios da aula
  const acts = MODULO_01_AULAS.find((a) => a.id === idAula(n))?.activities ?? [];
  const actTextos = acts.flatMap((a) => [a.prompt, a.config?.tag, a.config?.gabarito].filter(Boolean));
  const expEx = (j.exercicios ?? []).flatMap((e) => [
    { id: `${e.id}/tag`, t: e.tag_fonte },
    { id: `${e.id}/enunciado`, t: e.enunciado_html },
    { id: `${e.id}/gabarito`, t: e.resposta_referencia_html },
  ].filter((x) => x.t));
  const faltasEx = achaSolto(actTextos, expEx, uso);

  // instrução do instrumento (A02): não há campo no tipo
  const faltasExtra = [];
  for (const it of j.instrumentos ?? []) {
    const instr = it.instrucao ?? it.instrucao_na_prancha ?? it.texto_instrucao;
    const t = typeof instr === 'string' ? instr : instr?.texto;
    if (t) faltasExtra.push({ id: `instrucao-${it.id.replace(/^m01-/, '')}`, t });
  }
  const faltasExtraReais = achaSolto(instTextos, faltasExtra, uso).map((f) => f);

  const todasFaltas = [
    ...faltas.map((f) => ({ ...f, grupo: 'corpo' })),
    ...faltasInst.map((f) => ({ ...f, grupo: 'instrumento' })),
    ...faltasEx.map((f) => ({ ...f, grupo: 'exercício' })),
    ...faltasExtraReais.map((f) => ({ ...f, grupo: 'instrumento' })),
  ];
  const explicadas = []; const reais = [];
  for (const f of todasFaltas) {
    const chave = Object.keys(FALTAS_EXPLICADAS).find((k) => f.id.startsWith(k));
    if (chave) explicadas.push({ ...f, razao: FALTAS_EXPLICADAS[chave] }); else reais.push(f);
  }

  // órfãos
  const strs = [];
  const lead = MODULO_01_LEAD[idAula(n)]; if (lead) strs.push({ onde: 'lead', s: lead });
  corpo.forEach((e, i) => strs.push({ onde: `corpo#${i}(${e.k})`, s: e.t }));
  instObjs.forEach((x) => x.note && strs.push({ onde: `${x.id}.note`, s: x.note }));
  acts.forEach((a) => { a.prompt && strs.push({ onde: `${a.id}.prompt`, s: a.prompt }); a.config?.gabarito && strs.push({ onde: `${a.id}.gabarito`, s: a.config.gabarito }); });
  const orf = orfaos(strs);
  const desconhecidos = corpo.filter((e) => e.k.startsWith('?'));

  // HTML (informativo)
  const difHtml = [];
  if (MOSTRAR_HTML) {
    const paraFonte = j.blocos.filter((b) => b.tipo === 'paragrafo').map((b) => htmlReduzido(editorial(b.html, {})));
    const paraTs = new Set(corpo.filter((e) => e.k === 'paragrafo').map((e) => colapsar(e.t)));
    for (const h of paraFonte) if (!paraTs.has(h)) difHtml.push(h.slice(0, 110));
  }

  console.log(`\n══ Aula 0${n} — ${j.aula?.marcador?.nome ?? ''}`);
  console.log(`   esperado: corpo ${exp.length} · instrumento ${expInst.length} · exercício ${expEx.length}   |   encontrado no corpo: ${achados.length}/${exp.length}`);
  console.log(`   FALTA: ${reais.length}   explicadas: ${explicadas.length}   ÓRFÃO: ${orf.length}${desconhecidos.length ? `   tipos de bloco desconhecidos: ${desconhecidos.length}` : ''}`);
  for (const f of reais) console.log(`   - [${f.grupo}] ${f.id}${f.foraDeOrdem ? ' (existe, mas fora da ordem da fonte)' : ''}: «${norm(f.t).slice(0, 110)}»`);
  for (const f of explicadas) console.log(`   · explicada [${f.grupo}] ${f.id}: ${f.razao}`);
  for (const o of orf) console.log(`   ! órfão ${o.onde} <${o.tag}>: ${o.ab} abre, ${o.fe} fecha — «${o.trecho}»`);
  if (MOSTRAR_HTML) for (const h of difHtml) console.log(`   ~ html difere: ${h}`);
  resumo.push({ n, esperado: exp.length + expInst.length + expEx.length, falta: reais.length, explicadas: explicadas.length, orfaos: orf.length });
  if (reais.length || orf.length || desconhecidos.length) exitCode = 1;
}

console.log('\n══ Resumo');
console.log('   aula  esperado  FALTA  explicadas  ÓRFÃO');
for (const r of resumo) console.log(`   ${String(r.n).padStart(4)}  ${String(r.esperado).padStart(8)}  ${String(r.falta).padStart(5)}  ${String(r.explicadas).padStart(10)}  ${String(r.orfaos).padStart(5)}`);
const tot = (k) => resumo.reduce((a, r) => a + r[k], 0);
console.log(`   total ${String(tot('esperado')).padStart(8)}  ${String(tot('falta')).padStart(5)}  ${String(tot('explicadas')).padStart(10)}  ${String(tot('orfaos')).padStart(5)}`);
if (Object.keys(uso).length) console.log(`   substituições editoriais aplicadas à extração: ${JSON.stringify(uso)}`);
console.log(exitCode ? '   RESULTADO: FALHA' : '   RESULTADO: 0 falta, 0 órfão');
process.exit(exitCode);
