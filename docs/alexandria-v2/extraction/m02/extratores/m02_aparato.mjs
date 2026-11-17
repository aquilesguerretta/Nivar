// Extração programática do grupo "aparato" do M02: caso, quiz, checklist final, exercícios,
// referências e glossário. Quiz lido avaliando o literal `const questions = [...]` do <script>.
import fs from 'node:fs';
import {
  html, fonteInfo, secao, all, one, ht, texto, inner, ini, origem, pad, fail, lineOf,
  carregarTS, DATA, HOJE, escrever, norm, scriptOriginal, divBalanceado,
  achar, acharEm, div,
} from './lib.mjs';
import { marcarP14 } from './p14.mjs';

// ── CASO ───────────────────────────────────────────────────────────────────
const sc = secao('§ Caso');
const cb = sc.body, cbase = sc.start;
const tag = one(/<div class="case-tag">([\s\S]*?)<\/div>/, cb, cbase);
const h3 = one(/<h3[^>]*>([\s\S]*?)<\/h3>/, cb, cbase);
const lead = one(/<p class="lead">([\s\S]*?)<\/p>/, cb, cbase);
const aviso = one(/<div class="case-body">\s*<p>([\s\S]*?)<\/p>/, cb, cbase);
const dados = all(/<div class="case-data-cell">\s*<div class="lbl">([\s\S]*?)<\/div>\s*<div class="val( alert)?">([\s\S]*?)<\/div>/g, cb, cbase);
const h4s = all(/<h4>([\s\S]*?)<\/h4>/g, cb, cbase);
const leituras = all(/<p><strong>([^<]*?)<\/strong>\s*—\s*([\s\S]*?)<\/p>/g, cb, cbase);
const calloutC = one(/<div class="callout gold">\s*<div class="callout-label">([\s\S]*?)<\/div>\s*<p>([\s\S]*?)<\/p>/, cb, cbase);
const pedir = all(/<li[^>]*>([\s\S]*?)<\/li>/g, cb, cbase);
const refsProsa = (t) => [...new Set([...t.matchAll(/(Aula \d\d|INST·\d\d|Módulo \d\d|Parte \d)/g)].map((m) => m[1]))];
const caso = {
  id: 'm02-caso-operacao-a',
  tipo: 'caso',
  camada: 'fonte',
  marcador: sc.num, rotulo_marcador: sc.rotulo,
  titulo: { ...ht(sc.h2), origem: origem('section.aula(§ Caso) h2', ini(sc.h2), sc.h2Idx) },
  lead: { ...ht(lead.m[1]), origem: origem('section.aula(§ Caso) p.lead', ini(lead.m[1]), lead.idx) },
  etiqueta: { ...ht(tag.m[1]), origem: origem('section.aula(§ Caso) .case-tag', texto(tag.m[1]), tag.idx) },
  parte: { literal_na_etiqueta: /Parte \d/.exec(texto(tag.m[1]))?.[0] ?? null, nota: 'A fonte do M02 rotula o caso como "Parte 2" e o primeiro item de "O que pedir" diz "(já solicitadas na Parte 1)", remetendo ao caso do M01 — que não carrega rótulo de parte (extração m01, caso.parte = null). Registrado literal; P17 manda não expor "Partes" da fonte no produto.' },
  cabecalho: { ...ht(h3.m[1]), origem: origem('section.aula(§ Caso) .case-header h3', texto(h3.m[1]), h3.idx) },
  aviso: { ...ht(aviso.m[1]), origem: origem('section.aula(§ Caso) .case-body > p:first', ini(aviso.m[1]), aviso.idx) },
  dados: dados.map(({ m, idx }, i) => ({ id: `m02-caso-dado-${pad(i + 1)}`, tipo: 'dado-do-caso', rotulo: texto(m[1]), valor: texto(m[3]), marcado_como_alerta_na_fonte: !!m[2], origem: origem('section.aula(§ Caso) .case-data-cell', texto(m[1]), idx) })),
  leitura: {
    titulo: texto(h4s[0].m[1]),
    itens: leituras.map(({ m, idx }, i) => ({ id: `m02-caso-leitura-${pad(i + 1)}`, tipo: 'leitura-estruturada', dimensao: texto(m[1]), ...ht(m[0].replace(/^<p>/, '').replace(/<\/p>$/, '')), referencias_em_prosa: refsProsa(texto(m[0])), origem: origem('section.aula(§ Caso) .case-body > p', ini(m[0]), idx) })),
    origem: origem('section.aula(§ Caso) h4', texto(h4s[0].m[1]), h4s[0].idx),
  },
  callout: { rotulo: texto(calloutC.m[1]), ...ht(calloutC.m[2]), origem: origem('section.aula(§ Caso) .callout.gold', texto(calloutC.m[1]), calloutC.idx) },
  o_que_pedir: {
    titulo: texto(h4s[1].m[1]),
    itens: pedir.map(({ m, idx }, i) => ({ id: `m02-caso-pedir-${pad(i + 1)}`, ...ht(m[1]), origem: origem('section.aula(§ Caso) ul > li', ini(m[1]), idx) })),
    origem: origem('section.aula(§ Caso) h4', texto(h4s[1].m[1]), h4s[1].idx),
  },
  perguntas: null,
  perguntas_nota: 'A fonte não faz perguntas ao learner no § Caso (zero "?" dirigido ao learner; as leituras chegam resolvidas). P17: o Desafio de decisão é da camada Alexandria, só com fatos do caso.',
  decisao_pedida: null,
  decisao_nota: 'A fonte não pede decisão. O callout traz a fala recomendada ("vamos decompor as três com doze meses de faturas") e a lista do que pedir ao cliente.',
  vinculos: { aula: null, aula_nota: 'Nenhum vínculo por tag. A prosa das leituras cita aulas/instrumentos (campo referencias_em_prosa) — referência, não posse.', caso_m01: 'm01-caso-operacao-a' },
  codigo: { portado: false, nota: 'Busca literal em src/: nenhum arquivo contém o texto do § Caso do M02.' },
  origem: origem('section.aula .aula-marker "§ Caso"', '§ Caso', sc.markerIdx),
};
if (caso.dados.length !== 6 || caso.leitura.itens.length !== 5 || caso.o_que_pedir.itens.length !== 5) fail('caso contagens');

// ── QUIZ ───────────────────────────────────────────────────────────────────
const sq = secao('§ Quiz');
const pQ = one(/<p>([\s\S]*?)<\/p>/, sq.body, sq.start);
const scoreLabel = one(/<div class="quiz-score-label">(.*?)<\/div>/, sq.body, sq.start);
const scoreTotal = one(/<span class="total">(.*?)<\/span>/, sq.body, sq.start);
const qa = html.indexOf('const questions = [');
const qb = html.indexOf('];', qa);
const qsrc = html.slice(qa + 'const questions = '.length, qb + 1);
// eslint-disable-next-line no-new-func
const questions = new Function(`return ${qsrc};`)();
const qStarts = all(/\{\s*q: "/g, html.slice(qa, qb), qa);
if (questions.length !== 10 || qStarts.length !== 10) fail('10 questões');
const template = one(/<div class="quiz-q-num">(.*?)<\/div>/, html, 0);
const scoreMsgs = [...html.matchAll(/(?:else )?(?:if\((correct >= \d)\) )?scoreMsg\.textContent = "(.*?)";/g)].map((m) => ({
  condicao_literal: m[1] ?? 'else',
  faixa: m[1] ? null : null,
  mensagem: m[2],
  origem: origem('script QUIZ scoreMsg', m[2].slice(0, 50), m.index),
}));
const faixas = ['9–10', '7–8', '5–6', '0–4'];
scoreMsgs.forEach((s, i) => { s.faixa = faixas[i]; s.faixa_nota = 'Faixa derivada da condição literal e da ordem dos if/else (anotação desta extração).'; });
const avaliacao = {
  id: 'm02-quiz',
  tipo: 'avaliacao-do-modulo',
  camada: 'fonte',
  marcador: sq.num, rotulo_marcador: sq.rotulo,
  titulo: ht(sq.h2),
  introducao: { ...ht(pQ.m[1]), origem: origem('section.aula(§ Quiz) > p', ini(pQ.m[1]), pQ.idx) },
  questoes: questions.map((q, i) => ({
    id: `m02-quiz-q${pad(i + 1)}`,
    numero: i + 1,
    enunciado: q.q,
    alternativas: q.options.map((o, k) => ({ letra: String.fromCharCode(65 + k), indice: k, texto: o, correta: k === q.correct })),
    gabarito: { indice: q.correct, letra: String.fromCharCode(65 + q.correct), texto: q.options[q.correct] },
    explicacao: q.feedback,
    explicacao_nota: 'O mesmo feedback é exibido para acerto e erro (fbEl.textContent = q.feedback).',
    vinculos: { aula: null, aula_nota: 'A fonte não declara aula por questão.' },
    origem: origem('script const questions[' + i + ']', q.q.slice(0, 60), qStarts[i].idx),
  })),
  placar: {
    rotulo: texto(scoreLabel.m[1]), total_literal: texto(scoreTotal.m[1]),
    rotulo_por_questao_template: texto(template.m[1]),
    faixas: scoreMsgs,
    nota_p18: 'As mensagens mandam avançar com 7 acertos ("depois avance para o próximo módulo") enquanto a prosa e a faixa 0–4 dizem "8/10". Registro legado; P18: nenhum limiar declara domínio.',
    origem: origem('section.aula(§ Quiz) #quiz-score', texto(scoreLabel.m[1]), scoreLabel.idx),
  },
  codigo: { portado: false, nota: 'Nenhum texto das 10 questões existe em src/.' },
  origem: origem('section.aula .aula-marker "§ Quiz"', '§ Quiz', sq.markerIdx),
};

// ── CHECKLIST FINAL ────────────────────────────────────────────────────────
const sf = secao('§ Final');
const pF = one(/<p>([\s\S]*?)<\/p>/, sf.body, sf.start);
const itensF = all(/<div class="checklist-text">([\s\S]*?)<\/div>/g, sf.body, sf.start);
const badgesSrc = fs.readFileSync(`${DATA}/alexandria-badges.ts`, 'utf8');
const checklist_final = {
  id: 'm02-checklist-final',
  tipo: 'checklist-final',
  camada: 'fonte',
  marcador: sf.num, rotulo_marcador: sf.rotulo,
  titulo: ht(sf.h2),
  introducao: { ...ht(pF.m[1]), origem: origem('section.aula(§ Final) > p', ini(pF.m[1]), pF.idx) },
  itens: itensF.map(({ m, idx }, i) => {
    const t = texto(m[1]);
    const badge = badgesSrc.includes(`'${t}'`) || badgesSrc.includes(`\n      '${t}',`);
    return { id: `m02-check-${pad(i + 1)}`, ordem: i + 1, ...ht(m[1]), marcacao_p14: marcarP14(t), no_codigo_como_badge: badge, origem: origem('section.aula(§ Final) #checklist .checklist-text', t.slice(0, 60), idx) };
  }),
  mecanica: 'toggle visual por clique (classList.toggle("checked")); sem persistência',
  codigo: { portado: 'parcial', nota: 'Só 3 dos itens aparecem literalmente como criterion de badge em alexandria-badges.ts; o checklist como estrutura não existe em src/.' },
  origem: origem('section.aula .aula-marker "§ Final"', '§ Final', sf.markerIdx),
};
if (checklist_final.itens.length !== 18) fail('18 itens');

// ── EXERCÍCIOS ─────────────────────────────────────────────────────────────
const se = secao('§ Ex');
const pE = one(/<p>([\s\S]*?)<\/p>/, se.body, se.start);
const C2 = await carregarTS(`${DATA}/alexandria-modulo-02-content.ts`);
const atividadesCodigo = [
  ...C2.MODULO_02_AULAS.flatMap((a) => a.activities.map((x) => ({ ...x, aulaId: a.id }))),
  ...C2.MODULO_02_EXERCICIOS_SOLTOS.map((x) => ({ ...x, aulaId: null })),
];
const exBlocos = all(/<div class="exercise">/g, se.body, se.start).map(({ idx }) => ({ m: [null, divBalanceado(idx).inner], idx }));
const exercicios = {
  id: 'm02-ex',
  tipo: 'bloco-de-exercicios',
  camada: 'fonte',
  marcador: se.num, rotulo_marcador: se.rotulo,
  titulo: ht(se.h2),
  introducao: { ...ht(pE.m[1]), origem: origem('section.aula(§ Ex) > p', ini(pE.m[1]), pE.idx) },
  itens: exBlocos.map(({ m, idx }, i) => {
    const b = m[1];
    const tagM = /<span class="exercise-tag">(.*?)<\/span>/.exec(b);
    const labM = /<div class="exercise-label">(.*?)<\/div>/.exec(b);
    const rot = texto((tagM || labM)[1]);
    const aula = /Aula (\d\d)/.exec(rot);
    const q = /<div class="exercise-question">([\s\S]*?)<\/div>/.exec(b);
    const btn = /<button class="([^"]+)"[^>]*>(.*?)<\/button>/.exec(b);
    const ans = /<div class="exercise-answer">([\s\S]*)$/.exec(b);
    const ps = [...ans[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((x) => ht(x[1]));
    const mods = rot.split(' · ').slice(2).filter((x) => !/^Aula/.test(x));
    const limite = /(até (?:quatro|oito) (?:frases|linhas)|em três versões)/.exec(texto(q[1]));
    const cod = atividadesCodigo.find((x) => x.config?.tag === rot);
    const gabCodigo = cod ? norm(cod.config.gabarito) : null;
    const gabFonteJunto = ps.map((p) => p.texto).join(' ');
    return {
      id: `m02-ex-${pad(i + 1)}`,
      tag: rot,
      variante_markup: tagM ? 'exercise-header > span.exercise-tag' : 'div.exercise-label',
      aula_vinculada: aula ? `Aula ${aula[1]}` : null,
      sem_aula: !aula,
      sem_aula_nota: aula ? undefined : 'Tag sem "Aula NN" (P9: vai para recursos do módulo). Menção em prosa: o gabarito do Ex · 09 cita "Erro 4 da tabela de mitos"; o do Ex · 10 cita "(Aula 10)" — referência, não posse.',
      modificadores: mods,
      enunciado: ht(q[1]),
      limite_de_resposta_literal: limite ? limite[1] : null,
      botao: { classe: btn[1], rotulo: texto(btn[2]) },
      resposta_de_referencia: { paragrafos: ps },
      criterio: null,
      criterio_nota: 'A fonte não traz critério por exercício (nem rubrica, nem pontuação). O § Ex também não declara limiar.',
      codigo: cod ? {
        id: cod.id, aulaId: cod.aulaId, points: cod.points ?? null,
        enunciado_igual: norm(cod.prompt) === ht(q[1]).texto,
        gabarito_igual: gabCodigo === gabFonteJunto,
        gabarito_paragrafos_fonte: ps.length,
        gabarito_codigo_cobre: gabCodigo === gabFonteJunto ? 'integral' : (gabFonteJunto.startsWith(gabCodigo) ? `truncado (${gabCodigo.length}/${gabFonteJunto.length} caracteres de texto)` : 'divergente'),
      } : { portado: false },
      origem: origem('section.aula(§ Ex) .exercise', rot, idx),
    };
  }),
  codigo: { arquivo: 'src/lib/data/alexandria-modulo-02-content.ts', nota: 'Ex 01–08 em MODULO_02_AULAS[].activities; Ex 09–10 em MODULO_02_EXERCICIOS_SOLTOS. points: 1 não tem origem na fonte.' },
  origem: origem('section.aula .aula-marker "§ Ex"', '§ Ex', se.markerIdx),
};
if (exercicios.itens.length !== 10) fail('10 exercícios, achei ' + exercicios.itens.length);

// ── REFERÊNCIAS ────────────────────────────────────────────────────────────
const sr = secao('§ Ref');
const rLead = one(/<p class="lead">([\s\S]*?)<\/p>/, sr.body, sr.start);
const grupos = all(/<h4>([\s\S]*?)<\/h4>\s*<ul[^>]*>([\s\S]*?)<\/ul>/g, sr.body, sr.start);
let nref = 0;
const referencias = {
  id: 'm02-referencias',
  tipo: 'bloco-de-referencias',
  camada: 'fonte',
  marcador: sr.num, rotulo_marcador: sr.rotulo,
  titulo: ht(sr.h2),
  introducao: { ...ht(rLead.m[1]), origem: origem('section.aula(§ Ref) p.lead', ini(rLead.m[1]), rLead.idx) },
  grupos: grupos.map(({ m, idx }) => ({
    titulo: texto(m[1]),
    origem: origem('section.aula(§ Ref) h4', texto(m[1]), idx),
    itens: all(/<li[^>]*>([\s\S]*?)<\/li>/g, m[2], idx + m[0].indexOf(m[2])).map(({ m: li, idx: lidx }) => {
      nref += 1;
      const strongs = [...li[1].matchAll(/<strong>([\s\S]*?)<\/strong>/g)].map((x) => texto(x[1]));
      const ital = /<i>([\s\S]*?)<\/i>/.exec(li[1]);
      const mono = /<span class="mono"[^>]*>([\s\S]*?)<\/span>/.exec(li[1]);
      const inst = strongs.map((s) => (/^([A-ZÁ-Ú]{3,}) — /.exec(s) || [])[1]).filter(Boolean);
      const semMono = li[1].replace(/<span class="mono"[\s\S]*?<\/span>/, '');
      const cauda = semMono.slice(Math.max(semMono.indexOf('</strong>'), 0));
      const desc = /·\s*([\s\S]*)$/.exec(cauda);
      return {
        id: `m02-ref-${pad(nref)}`,
        ...ht(li[1]),
        titulos_em_negrito: strongs,
        documentos_no_item: strongs.length + (ital ? 0 : 0),
        titulo_obra: ital ? texto(ital[1]) : null,
        autores: ital ? strongs : null,
        instituicao: inst.length ? [...new Set(inst)] : null,
        descricao: desc ? texto(desc[1]) : null,
        dominio_ou_caminho_citado: mono ? texto(mono[1]) : null,
        url: null,
        url_nota: 'A fonte não traz URL clicável nem esquema http(s); só o caminho/domínio em span.mono, preservado como está.',
        datas_citadas: [...new Set([...texto(li[1]).matchAll(/\b(\d{2}\/\d{2}\/\d{4}|\d{1,2}\.\d{3}\/\d{4}|\d{4}–\d{4}|(?:maio)\/\d{4}|\d\.\d{3}\/\d{4}|\d{2}\.\d{3}\/\d{4}|(?<![\d./])\d{4}(?![\d/]))\b/g)].map((x) => x[1]))],
        datas_nota: 'Datas/anos mencionados no texto do item (evento, norma, período) — não são data de publicação nem de acesso, que a fonte não declara.',
        origem: origem('section.aula(§ Ref) ul > li', ini(li[1]), lidx),
      };
    }),
  })),
  colofao: null,
  vinculos: { aula: null, aula_nota: 'Itens citam aulas em prosa (Aula 06, Aula 08, Aulas 02 e 03) — referência, não posse.' },
  codigo: { portado: false, nota: 'src/pages/alexandria/BibliotecaView.tsx tem uma estante genérica (ONS, ANEEL, EPE…) com texto próprio; as 16 entradas do § Ref do M02 não estão em src/.' },
  origem: origem('section.aula .aula-marker "§ Ref"', '§ Ref', sr.markerIdx),
};
const rodapeP2 = /<footer[\s\S]*?<p style="margin-top: 8px;">([\s\S]*?)<\/p>/.exec(html);
referencias.colofao = { ...ht(rodapeP2[1]), origem: origem('footer.alex-footer p:nth(2)', ini(rodapeP2[1]), rodapeP2.index + rodapeP2[0].indexOf(rodapeP2[1])) };

// ── GLOSSÁRIO ──────────────────────────────────────────────────────────────
const sl = secao('§ Lex');
const pL = one(/<p>([\s\S]*?)<\/p>/, sl.body, sl.start);
const termos = all(/<details class="glossary-item">\s*<summary><span class="term">([\s\S]*?)<\/span><span class="unit">([\s\S]*?)<\/span><\/summary>\s*<div class="glossary-content">([\s\S]*?)<\/div>\s*<\/details>/g, sl.body, sl.start);
const nItens = (sl.body.match(/<details class="glossary-item">/g) || []).length;
if (termos.length !== nItens) fail(`glossário: regex ${termos.length} × markup ${nItens}`);
const G = await carregarTS(`${DATA}/alexandria-glossario.ts`);
const verbetesM02 = G.ALEXANDRIA_GLOSSARIO.filter((v) => v.id.startsWith('gl-m02-'));
const lista = termos.map(({ m, idx }, i) => {
  const term = texto(m[1]);
  const cod = verbetesM02.find((v) => norm(v.term) === term);
  const def = ht(m[3]);
  return {
    id: `m02-lex-${pad(i + 1)}`,
    ordem: i + 1,
    termo: term,
    termo_html: inner(m[1]),
    etiqueta: texto(m[2]),
    definicao: def,
    origem: origem('section.aula(§ Lex) details.glossary-item', term, idx),
    codigo: cod ? {
      id: cod.id,
      termo_igual: norm(cod.term) === term,
      etiqueta_igual: norm(cod.unit) === texto(m[2]),
      definicao_igual: norm(cod.definition) === def.texto,
      definicao_html_igual: inner(cod.definition) === def.html,
      aulaIds: cod.aulaIds,
    } : null,
  };
});
const coll = new Intl.Collator('pt-BR', { sensitivity: 'base' });
const quebrasOrdem = lista.slice(1).map((t, i) => [lista[i].termo, t.termo]).filter(([a, b]) => coll.compare(a, b) > 0);
const faltamNoCodigo = lista.filter((t) => !t.codigo).map((t) => t.termo);
const sobramNoCodigo = verbetesM02.filter((v) => !lista.some((t) => t.termo === norm(v.term))).map((v) => ({ id: v.id, term: v.term }));
const divergentes = lista.filter((t) => t.codigo && !(t.codigo.termo_igual && t.codigo.etiqueta_igual && t.codigo.definicao_igual)).map((t) => ({ termo: t.termo, ...t.codigo }));
const glossario = {
  id: 'm02-glossario',
  tipo: 'glossario-do-modulo',
  camada: 'fonte',
  marcador: sl.num, rotulo_marcador: sl.rotulo,
  titulo: ht(sl.h2),
  introducao: { ...ht(pL.m[1]), origem: origem('section.aula(§ Lex) > p', ini(pL.m[1]), pL.idx) },
  contagem: { markup: termos.length, prosa_literal: /^(\S+ e \S+|\S+) termos/.exec(texto(pL.m[1]))?.[1] ?? null, catalogo: 65, codigo_gl_m02: verbetesM02.length },
  ordem_alfabetica_quebras: quebrasOrdem,
  termos: lista,
  comparacao_codigo: {
    arquivo: 'src/lib/data/alexandria-glossario.ts',
    faltam_no_codigo: faltamNoCodigo,
    sobram_no_codigo: sobramNoCodigo,
    divergentes,
    aulaIds_vazios: verbetesM02.filter((v) => !v.aulaIds?.length).length,
    nota: 'Comparação por termo normalizado (tags removidas, entidades decodificadas, espaços colapsados). aulaIds são derivados pelo código (âncora estrutural da Wave 34), não declarados pela fonte.',
  },
  vinculos: { aula: null, aula_nota: 'A fonte não declara aula por verbete.' },
  origem: origem('section.aula .aula-marker "§ Lex"', '§ Lex', sl.markerIdx),
};

// ── DIVERGÊNCIAS (aparato) ─────────────────────────────────────────────────
const CONTENT_REL = 'src/lib/data/alexandria-modulo-02-content.ts';
const ex07 = exercicios.itens.find((e) => e.tag.startsWith('Ex · 07'));
const ex09 = exercicios.itens.find((e) => e.tag === 'Ex · 09');
const ex10 = exercicios.itens.find((e) => e.tag === 'Ex · 10');
const badgesM02 = checklist_final.itens.filter((x) => x.no_codigo_como_badge);
const btnClasses = [...new Set(exercicios.itens.map((e) => e.botao.classe))];
const refsMulti = referencias.grupos.flatMap((g) => g.itens).filter((r) => r.titulos_em_negrito.length > 1);
const divergencias = [
  div('div-a02-01', 'fonte×fonte (P17)', 'média', 'Caso rotulado "Parte 2" e remetendo a uma "Parte 1"',
    { texto: caso.etiqueta.texto, origem: caso.etiqueta.origem },
    { texto: caso.o_que_pedir.itens[0].texto, origem: caso.o_que_pedir.itens[0].origem, nota: 'O caso do M01 não tem rótulo de parte (extração m01).' },
    'P17: no produto não existem "Partes" da fonte; o caso fica intacto como contexto e o Desafio de decisão é da camada Alexandria.'),
  div('div-a02-02', 'fonte×produto (P24)', 'baixa', 'Callout do caso com a marca no rótulo',
    { texto: caso.callout.rotulo, origem: caso.callout.origem },
    { texto: 'P24: "GridAlpha" morta como marca voltada ao learner.', origem: null },
    'Texto mantido literal na camada fonte.'),
  div('div-a02-03', 'fonte×fonte', 'alta', 'Faixas do placar × limiar 8/10 da introdução do quiz',
    { texto: avaliacao.introducao.texto, origem: avaliacao.introducao.origem },
    { texto: scoreMsgs.map((s) => `${s.condicao_literal} → "${s.mensagem}"`).join(' | '), origem: scoreMsgs.map((s) => s.origem) },
    'Com 7 acertos a mensagem já manda avançar; com 8 (o limiar declarado) diz "Revise"; a faixa else repete "8/10". Mesmo registro de modulo.divergencias div-m02-02. P18.'),
  div('div-a02-04', 'fonte×código', 'média', 'Ex · 07: gabarito truncado no código',
    { texto: `${ex07.resposta_de_referencia.paragrafos.length} parágrafos (12 anos / CFO / Especialista)`, origem: ex07.origem },
    { texto: `config.gabarito cobre ${ex07.codigo.gabarito_codigo_cobre}`, origem: { arquivo: CONTENT_REL, id: ex07.codigo.id } },
    'Perda de texto de resposta de referência no código; a fonte é a íntegra.'),
  div('div-a02-05', 'código sem origem', 'baixa', 'points: 1 em todos os exercícios',
    { texto: 'A fonte não pontua exercício (nem rubrica, nem peso).', origem: exercicios.origem },
    { texto: `points: ${[...new Set(exercicios.itens.map((e) => e.codigo.points))].join(', ')} (${exercicios.itens.length} atividades)`, origem: { arquivo: CONTENT_REL } },
    'Valor inventado pelo código (mesmo caso do Ex06 no M01).'),
  div('div-a02-06', 'fonte×fonte', 'baixa', 'Duas variantes de markup de exercício',
    { texto: `Ex · 01–08: div.exercise-header > span.exercise-tag + button.${btnClasses[0]}`, origem: exercicios.itens[0].origem },
    { texto: `Ex · 09–10: div.exercise-label + button.${btnClasses[1]}, sem "Aula NN" na tag`, origem: ex09.origem },
    'Sinal de acréscimo posterior à prosa "Oito exercícios" (ver modulo div-m02-03). Hipótese, não fato da fonte.'),
  div('div-a02-07', 'fonte (vínculo em prosa)', 'baixa', 'Exercícios sem aula com remissões em prosa',
    { texto: `${ex09.tag}: enunciado usa "bateria de 20 MW / 80 MWh" (= cenário-padrão do INST · 06, Aula 07) e o gabarito cita "Erro 4 da tabela de mitos"`, origem: ex09.origem },
    { texto: `${ex10.tag}: gabarito termina em "vira ESS (Aula 10)"`, origem: ex10.origem },
    'P9: referência em prosa não é tag de posse; ambos ficam em recursos do módulo. O código faz o mesmo (MODULO_02_EXERCICIOS_SOLTOS).'),
  div('div-a02-08', 'fonte×código', 'baixa', 'Checklist final × badges',
    { texto: `${checklist_final.itens.length} itens com toggle visual`, origem: checklist_final.origem },
    { texto: `${badgesM02.length} itens viraram badge (${badgesM02.map((b) => `item ${b.ordem}`).join(', ')}), com name/category/expReward sem origem na fonte`, origem: acharEm(`${DATA}/alexandria-badges.ts`, '(B) Checklist do Módulo 02', 'src/lib/data/alexandria-badges.ts') },
    'Os critérios dos badges são literais (conferido). O resto do checklist não existe em src/. P18: marcar o checklist não é evidência de competência.'),
  div('div-a02-09', 'fonte (estrutura)', 'baixa', 'Item de referência com mais de um documento',
    { texto: refsMulti.map((r) => `${r.id}: ${r.titulos_em_negrito.join(' + ')}`).join(' | '), origem: refsMulti.map((r) => r.origem) },
    { texto: 'Um <li> por documento no resto da estante', origem: null },
    'Registrado para quem modelar referência como 1 item = 1 documento.'),
];
const lacunas = [
  { id: 'lac-a02-01', campo: 'caso.perguntas / caso.decisao_pedida', valor: null, nota: caso.perguntas_nota },
  { id: 'lac-a02-02', campo: 'quiz: vínculo por aula', valor: null, nota: 'Nenhuma questão declara aula.' },
  { id: 'lac-a02-03', campo: 'exercicios[].criterio', valor: null, nota: 'Sem rubrica, sem pontuação; "Revelar gabarito" revela direto (sem tentativa registrada).' },
  { id: 'lac-a02-04', campo: 'referencias[].url / data de publicação / data de acesso / tipo', valor: null, nota: 'Só caminho/domínio em span.mono (11 de 16); datas no texto são de evento/norma.' },
  { id: 'lac-a02-05', campo: 'glossario[].aula', valor: null, nota: 'A fonte não declara aula por verbete; aulaIds do código são derivados.' },
  { id: 'lac-a02-06', campo: 'código', valor: null, nota: 'Caso, quiz, referências e checklist (como estrutura) não existem em src/lib/data.' },
];

const out = {
  schema: 'alexandria-v2/extraction/aparato@1',
  modulo: 'M02',
  grupo: 'aparato',
  camada: 'fonte',
  fonte: fonteInfo,
  gerado_por: 'docs/alexandria-v2/extraction/m02/extratores/m02_aparato.mjs',
  gerado_em: HOJE,
  metodo: 'Extração programática (node, regex escopada por section .aula-marker; quiz lido avaliando o literal `const questions = [...]` do <script>; código lido via typescript.transpileModule). Nenhum texto de conteúdo digitado à mão.',
  convencoes: { linha_aprox: 'linha 1-based no HTML-fonte, do início do elemento', null: 'ausência na fonte; cada null tem nota ao lado', html: 'inline preservado, espaços colapsados', texto: 'sem tags, entidades decodificadas' },
  caso, avaliacao, checklist_final, exercicios, referencias, glossario,
  divergencias, lacunas,
  contagens: {
    caso: { dados: caso.dados.length, leituras: caso.leitura.itens.length, callouts: 1, pedidos: caso.o_que_pedir.itens.length, perguntas: 0, decisoes: 0 },
    quiz: { questoes: avaliacao.questoes.length, alternativas_por_questao: [...new Set(avaliacao.questoes.map((q) => q.alternativas.length))], faixas_placar: scoreMsgs.length, gabarito_por_letra: avaliacao.questoes.map((q) => q.gabarito.letra).join('') },
    checklist_itens: checklist_final.itens.length,
    checklist_como_badge_no_codigo: checklist_final.itens.filter((x) => x.no_codigo_como_badge).length,
    exercicios: { total: exercicios.itens.length, com_aula: exercicios.itens.filter((x) => x.aula_vinculada).length, sem_aula: exercicios.itens.filter((x) => !x.aula_vinculada).length, prosa_declara: 'Oito' },
    referencias: { itens_li: nref, grupos: referencias.grupos.length, com_dominio: referencias.grupos.flatMap((g) => g.itens).filter((x) => x.dominio_ou_caminho_citado).length, com_url: 0 },
    divergencias: divergencias.length, lacunas: lacunas.length,
    glossario: { termos: termos.length, faltam_no_codigo: faltamNoCodigo.length, sobram_no_codigo: sobramNoCodigo.length, divergentes: divergentes.length, quebras_ordem: quebrasOrdem.length },
  },
};
escrever('aparato.json', out);
console.log('aparato.json ok', JSON.stringify(out.contagens));
