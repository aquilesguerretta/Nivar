// Gera MODULO_NN_LEAD e MODULO_NN_CORPO (M14 ou M15) a partir do HTML original.
//
// Uso: node tools/alexandria-dados/porte/gerar-corpo-m14-m15.mjs <14|15> [--escrever]
// Sem --escrever, só imprime a contagem por aula. Com ele, reescreve os dois
// `export const` no arquivo de conteúdo do módulo (o resto do arquivo fica intacto).
// Conferência: verificar-porte-m14-m15.mjs.
//
// Nenhum texto é digitado aqui: tudo sai de fatias do HTML. A leitura v3 tem seis
// tipos de bloco (titulo · paragrafo · formula · nota · lista · tabela) e renderiza só
// b/strong/i/em/br/sub/sup/code; cada estrutura própria do módulo vira um deles por
// uma regra fixa, listada em REGRAS. Os únicos caracteres que este gerador acrescenta
// são separadores tipográficos — " · " entre rótulo e nome, e <br> onde a fonte
// separava por CSS (bloco) dois trechos que no texto cru ficariam colados. Estrutura
// sem regra LANÇA: nada é engolido em silêncio.
//
// Editorial (Q03): "GridAlpha" → "NIVAR". Dano tipográfico de transporte (Q13):
// espaço antes de vírgula/ponto que o HTML quebrado em linhas deixa.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerModulo, temClasse, classes } from './fonte-html-m14-m15.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const N = Number(process.argv[2]);
if (N !== 14 && N !== 15) { console.error('uso: gerar-corpo-m14-m15.mjs <14|15> [--escrever]'); process.exit(2); }
const ESCREVER = process.argv.includes('--escrever');
const NN = String(N);
const fonte = lerModulo(N);
const inner = (no) => fonte.inner(no);
const filho = (no, c) => no.filhos.find((f) => temClasse(f, c)) ?? null;
const filhos = (no, c) => no.filhos.filter((f) => temClasse(f, c));

// ── limpeza de HTML inline ──────────────────────────────────
const MANTER = new Set(['b', 'strong', 'i', 'em', 'br', 'sub', 'sup', 'code']);
function limpar(h) {
  let s = String(h).replace(/GridAlpha/g, 'NIVAR');
  // Q02/Q03 (QA-M14-05): remissão interna "Bloco NN" vira o nome que o aluno vê, "Módulo NN"
  s = s.replace(/\bBloco (\d+)/g, 'Módulo $1');
  // S4 (QA-M14-05): remissão a seção interna que a aula não mostra ("Ver §00.1.") sai
  s = s.replace(/\s*Ver §00\.1\./g, '');
  // Q13: palavra composta partida na quebra de linha do HTML ("pré-\ntratamento")
  s = s.replace(/([A-Za-zÀ-ÿ])-[ \t]*\r?\n\s*/g, '$1-');
  // span/small/div/a de linha: a marca sai, o texto fica, com um espaço antes
  s = s.replace(/<(span|small|a|div)\b[^>]*>/gi, ' ').replace(/<\/(span|small|a|div)>/gi, ' ');
  // atributos das tags mantidas saem; tag fora da lista sai
  s = s.replace(/<(\/?)([a-zA-Z0-9]+)(\s[^>]*)?>/g, (m, b, t) => (MANTER.has(t.toLowerCase()) ? `<${b}${t.toLowerCase()}>` : ' '));
  // negrito-título colado ao texto seguinte (clk-b, par li, mot, stp): a fonte
  // separava por display:block; no texto corrido, <br>
  s = s.replace(/<\/(b|strong)>(?=[A-Za-zÀ-ÿ"“(])/g, '</$1><br>');
  s = s.replace(/[\s ]+/g, ' ').replace(/&nbsp;/g, ' ');
  s = s.replace(/ ([,.;:!?)])/g, '$1').replace(/\( /g, '(');
  s = s.replace(/<br> /g, '<br>').replace(/ <br>/g, '<br>').replace(/<(b|strong|i|em)> /g, '<$1>').replace(/ <\/(b|strong|i|em)>/g, '</$1> ');
  return s.replace(/\s+/g, ' ').replace(/ ([,.;:!?)])/g, '$1').trim();
}
const plano = (h) => limpar(h).replace(/<br>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
/** Texto de um nó sem os filhos de uma classe (ex.: nm sem o <small>). */
function semFilhos(no, pred) {
  let s = '', pos = no.o1;
  for (const f of no.filhos) { s += fonte.html.slice(pos, f.o0); if (!pred(f)) s += fonte.html.slice(f.o0, f.c1); pos = f.c1; }
  return s + fonte.html.slice(pos, no.c0);
}
const tom = (no) => (temClasse(no, 'rd') ? 'red' : temClasse(no, 'gd') ? 'gold' : 'neutro');

// ── regras ──────────────────────────────────────────────────
const usadas = {};
const diagramas = {};
function blocos(f, aula) {
  const no = f.no;
  const regra = (nome) => { usadas[nome] = (usadas[nome] || 0) + 1; };
  if (f.tag === 'h3') {
    regra('h3 → titulo');
    const m = /<span class="num">§?\s*([^<]*)<\/span>([\s\S]*)/.exec(f.html);
    return [{ kind: 'titulo', numero: m ? m[1].trim() : null, texto: plano(m ? m[2] : f.html) }];
  }
  if (f.tag === 'p') { regra(`p${f.classes.length ? '.' + f.classes.join('.') : ''} → paragrafo`); return [{ kind: 'paragrafo', html: limpar(f.html) }]; }
  if (f.tag !== 'div') throw new Error(`L${f.linha}: <${f.tag}> sem regra`);
  const c = f.classes;
  if (c.includes('box')) {
    const tag = filho(no, 'tag');
    // P7 (bar.md; decisões de 2026-09-16): "onde isso entra no produto" não é exibido.
    if (tag && plano(inner(tag)) === 'Onde isso entra no produto') { regra('div.box "Onde isso entra no produto" → fora (P7)'); return []; }
    regra('div.box → nota (rd red · gd gold · cy neutro; span.tag = rótulo)');
    const ps = no.filhos.filter((x) => x !== tag);
    for (const p of ps) if (p.tag !== 'p') throw new Error(`L${f.linha}: box com <${p.tag}>`);
    return [{ kind: 'nota', tom: tom(no), label: tag ? plano(inner(tag)) : null, html: ps.map((p) => limpar(inner(p))).join('<br><br>') }];
  }
  if (c.includes('fx')) {
    regra('div.fx → titulo (fn) + formula (fe, fd)');
    return [
      { kind: 'titulo', numero: null, texto: plano(inner(filho(no, 'fn'))) },
      { kind: 'formula', eq: limpar(inner(filho(no, 'fe'))), desc: filho(no, 'fd') ? plano(inner(filho(no, 'fd'))) : null },
    ];
  }
  if (c.includes('scroll') || c.includes('cmpx')) {
    regra(`div.${c[0]} > table → tabela`);
    const tab = no.filhos.find((x) => x.tag === 'table');
    const linhas = [];
    const andar = (x) => { for (const y of x.filhos) { if (y.tag === 'tr') linhas.push(y); else andar(y); } };
    andar(tab);
    return [{ kind: 'tabela', linhas: linhas.map((tr) => tr.filhos.filter((x) => x.tag === 'td' || x.tag === 'th').map((td) => limpar(inner(td)))) }];
  }
  if (c.includes('dual')) {
    regra('div.dual → uma nota por cartão (dk = rótulo; dv em negrito, dm)');
    return filhos(no, 'dc').map((dc) => ({ kind: 'nota', tom: 'neutro', label: plano(inner(filho(dc, 'dk'))), html: `<b>${plano(inner(filho(dc, 'dv')))}</b><br>${limpar(inner(filho(dc, 'dm')))}` }));
  }
  if (c.includes('lv')) {
    regra('div.lv → titulo (lv-hd) + uma nota por nível (rótulo = aba)');
    const abas = filho(no, 'lv-tabs').filhos.filter((x) => x.tag === 'button');
    const paineis = filhos(filho(no, 'lv-bd'), 'lv-pane');
    if (abas.length !== paineis.length) throw new Error(`L${f.linha}: lv com ${abas.length} abas e ${paineis.length} painéis`);
    return [
      { kind: 'titulo', numero: null, texto: plano(inner(filho(no, 'lv-hd'))) },
      ...abas.map((a, i) => ({ kind: 'nota', tom: 'neutro', label: plano(inner(a)), html: limpar(inner(paineis[i])) })),
    ];
  }
  if (c.includes('est')) {
    regra('div.est → lista (um item por estado)');
    return [{ kind: 'lista', itens: no.filhos.map((s) => limpar(inner(s))) }];
  }
  if (c.includes('rt')) {
    regra('div.rt → lista (rq · rn em negrito, depois o texto)');
    return [{ kind: 'lista', itens: filhos(no, 'rt-c').map((x) => `<b>${plano(inner(filho(x, 'rq')))} · ${plano(inner(filho(x, 'rn')))}</b><br>${limpar(semFilhos(x, (y) => temClasse(y, 'rq') || temClasse(y, 'rn')))}`) }];
  }
  if (c.includes('flux')) {
    regra('div.flux → lista (fzk · nome em negrito, depois fzn)');
    return [{ kind: 'lista', itens: filhos(no, 'fz').map((x) => {
      const v = filho(x, 'fzv');
      return `<b>${plano(inner(filho(x, 'fzk')))} · ${plano(semFilhos(v, (y) => temClasse(y, 'fzn')))}</b><br>${limpar(inner(filho(v, 'fzn')))}`;
    }) }];
  }
  if (c.includes('clk')) {
    regra('div.clk → lista (clk-t em negrito · clk-b)');
    return [{ kind: 'lista', itens: filhos(no, 'clk-r').map((r) => `<b>${plano(inner(filho(r, 'clk-t')))}</b> · ${limpar(inner(filho(r, 'clk-b')))}`) }];
  }
  if (c.includes('emp')) {
    regra('div.emp → titulo (nome) + paragrafo (<small> · ar) + lista (um campo por item)');
    const hd = filho(no, 'emp-hd');
    const nm = filho(hd, 'nm');
    const small = nm.filhos.find((y) => y.tag === 'small');
    const ar = filho(hd, 'ar');
    return [
      { kind: 'titulo', numero: null, texto: plano(semFilhos(nm, (y) => y.tag === 'small')) },
      { kind: 'paragrafo', html: `<b>${plano(inner(small))}</b> · ${plano(inner(ar))}` },
      { kind: 'lista', itens: filhos(no, 'emp-row').map((r) => `<b>${plano(inner(filho(r, 'emp-k')))}</b><br>${limpar(inner(filho(r, 'emp-v')))}`) },
    ];
  }
  if (c.includes('cad')) {
    regra('div.cad → lista (n · elo em negrito · camada, depois o texto)');
    return [{ kind: 'lista', itens: filhos(no, 'cad-r').map((r) => {
      const k = filho(r, 'cad-k');
      const sp = k.filhos.find((y) => y.tag === 'span');
      return `<b>${plano(inner(filho(r, 'cad-n')))} · ${plano(semFilhos(k, (y) => y.tag === 'span'))}</b> · ${plano(inner(sp))}<br>${limpar(inner(filho(r, 'cad-v')))}`;
    }) }];
  }
  if (c.includes('par')) {
    regra('div.par → por coluna: titulo (ph) + lista');
    return filhos(no, 'par-col').flatMap((col) => [
      { kind: 'titulo', numero: null, texto: plano(inner(filho(col, 'ph'))) },
      { kind: 'lista', itens: col.filhos.find((y) => y.tag === 'ul').filhos.filter((y) => y.tag === 'li').map((li) => limpar(inner(li))) },
    ]);
  }
  if (c.includes('mot')) {
    regra('div.mot → lista (título do motivo · natureza em negrito, depois o texto)');
    return [{ kind: 'lista', itens: filhos(no, 'mot-r').map((r) => {
      const b = r.filhos.find((y) => y.tag === 'b');
      const mt = filho(b, 'mt');
      return `<b>${limpar(semFilhos(b, (y) => temClasse(y, 'mt')))} · ${plano(inner(mt))}</b><br>${limpar(semFilhos(r, (y) => y === b))}`;
    }) }];
  }
  if (c.includes('stp')) {
    regra('div.stp → lista (passo · marca em negrito, depois o texto)');
    return [{ kind: 'lista', itens: no.filhos.filter((y) => y.tag === 'li').map((li) => {
      const sh = filho(li, 'sh');
      const sw = filho(sh, 'sw');
      return `<b>${plano(semFilhos(sh, (y) => y === sw))} · ${plano(inner(sw))}</b><br>${limpar(semFilhos(li, (y) => y === sh))}`;
    }) }];
  }
  if (c.includes('saf')) {
    // Calendário de safra: o dado (meses ativos por cadeia) está na CLASSE de cada
    // mês, não no texto — é figura de dado (regra de imagem 3). Vira diagrama
    // (diagramas/m14/), com os dados abaixo; a nota de rodapé vira parágrafo.
    regra('div.saf → diagrama (dados extraídos) + paragrafo (saf-n)');
    diagramas[`a${String(aula.numero).padStart(2, '0')}-saf`] = filhos(no, 'saf-r').map((r) => ({
      cadeia: plano(inner(filho(r, 'saf-k'))),
      meses: filhos(filho(r, 'saf-b'), 'saf-m').map((m) => ({ mes: plano(inner(m)), ativo: classes(m).find((k) => k.startsWith('on')) ?? null })),
    }));
    return [{ kind: 'paragrafo', html: limpar(inner(filho(no, 'saf-n'))) }];
  }
  throw new Error(`L${f.linha}: div.${c.join('.')} sem regra`);
}

// ── geração ─────────────────────────────────────────────────
const LEAD = {};
const CORPO = {};
for (const a of fonte.aulas) {
  const id = `aula-${NN}-${String(a.numero).padStart(2, '0')}`;
  LEAD[id] = limpar(a.lede);
  CORPO[id] = a.filhos.filter((f) => !f.instrumento).flatMap((f) => blocos(f, a));
}

const lit = (v) => JSON.stringify(v);
// Falso positivo do auditor (alexandria-no-internal-vocabulary): palavra da FONTE com
// sentido do domínio, não do nosso pipeline. A supressão vai na linha anterior, com a razão.
const FALSOS_POSITIVOS = [
  [/extração do caldo/, '"extração do caldo" é etapa industrial da fonte (moagem), não o pipeline de conteúdo'],
  [/extração de vapor/, '"extração de vapor" é etapa da turbina de cogeração na fonte, não o pipeline de conteúdo'],
];
function supressao(b) {
  const t = JSON.stringify(b);
  const f = FALSOS_POSITIVOS.find(([re]) => re.test(t));
  return f ? `    // gridalpha-detect-disable-next-line alexandria-no-internal-vocabulary — ${f[1]}
` : '';
}
function bloco(b) {
  switch (b.kind) {
    case 'titulo': return `{ kind: 'titulo', numero: ${lit(b.numero)}, texto: ${lit(b.texto)} }`;
    case 'paragrafo': return `{ kind: 'paragrafo', html: ${lit(b.html)} }`;
    case 'formula': return `{ kind: 'formula', eq: ${lit(b.eq)}, desc: ${lit(b.desc)} }`;
    case 'nota': return `{ kind: 'nota', tom: ${lit(b.tom)}, label: ${lit(b.label)}, html: ${lit(b.html)} }`;
    case 'lista': return `{ kind: 'lista', itens: ${lit(b.itens)} }`;
    case 'tabela': return `{ kind: 'tabela', linhas: ${lit(b.linhas)} }`;
    default: throw new Error(b.kind);
  }
}
const total = Object.values(CORPO).reduce((s, v) => s + v.length, 0);
const tsLead = `export const MODULO_${NN}_LEAD: Record<string, string> = {\n${Object.entries(LEAD).map(([k, v]) => `  ${lit(k)}: ${lit(v)},`).join('\n')}\n};\n`;
const tsCorpo = `/** ${total} blocos nas ${Object.keys(CORPO).length} aulas, na ordem do documento.\n *  GERADO por tools/alexandria-dados/porte/gerar-corpo-m14-m15.mjs a partir do HTML\n *  original — não editar à mão; conferido por verificar-porte-m14-m15.mjs. */\nexport const MODULO_${NN}_CORPO: Record<string, AulaBloco[]> = {\n${Object.entries(CORPO).map(([k, v]) => `  ${lit(k)}: [\n${v.map((b) => `${supressao(b)}    ${bloco(b)},`).join('\n')}\n  ],`).join('\n')}\n};\n`;

for (const [k, v] of Object.entries(CORPO)) console.log(`${k}: ${v.length} blocos`);
console.log('regras usadas:'); for (const [k, v] of Object.entries(usadas)) console.log(`  ${String(v).padStart(3)} × ${k}`);
if (Object.keys(diagramas).length) console.log('dados de diagrama:', JSON.stringify(diagramas));

if (ESCREVER) {
  const arq = path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`);
  const cru = fs.readFileSync(arq, 'utf8');
  const crlf = cru.includes('\r\n');
  let ts = cru.replace(/\r\n/g, '\n');
  const troca = (nome, novo) => {
    const iniExp = ts.indexOf(`export const ${nome}`);
    if (iniExp < 0) throw new Error(`${nome} não encontrado`);
    // o comentário JSDoc imediatamente acima (só espaço entre ele e o export) entra na troca
    const docIni = ts.lastIndexOf('/**', iniExp);
    const docFim = docIni >= 0 ? ts.indexOf('*/', docIni) : -1;
    const de = docIni >= 0 && docFim >= 0 && !ts.slice(docFim + 2, iniExp).trim() ? docIni : iniExp;
    const fim = ts.indexOf('\n};\n', iniExp);
    if (fim < 0) throw new Error(`fim de ${nome} não encontrado`);
    ts = ts.slice(0, de) + novo + ts.slice(fim + 4);
  };
  troca(`MODULO_${NN}_LEAD`, tsLead);
  troca(`MODULO_${NN}_CORPO`, tsCorpo);
  fs.writeFileSync(arq, crlf ? ts.replace(/\n/g, '\r\n') : ts);
  if (Object.keys(diagramas).length) {
    const dArq = path.join(RAIZ, `src/components/alexandria/v3/diagramas/m${NN}/dados-da-fonte.ts`);
    fs.mkdirSync(path.dirname(dArq), { recursive: true });
    fs.writeFileSync(dArq, `// GERADO por tools/alexandria-dados/porte/gerar-corpo-m14-m15.mjs a partir do HTML\n// original do Módulo ${NN} — não editar à mão. Dados de figura que a fonte guarda em classe\n// de CSS (não em texto) e que a leitura v3 desenha como diagrama (regra de imagem 3).\n\nexport const DADOS_DA_FONTE = ${JSON.stringify(diagramas, null, 2)} as const;\n`);
  }
  console.log('escrito:', arq);
}
