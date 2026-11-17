// Extração programática do grupo "aparato" do M15 → aparato.json
// §Caso, §Quiz (+script), §Final, §Ex (+ fichas de elo "Preencha"), §Ref, §Lex.
import {
  html, LINES, SRC, CODE, read, lineOf, inl, txt, txtSp, both, origem, balancedEnd, innerOf,
  allMatches, must, SECTIONS, sec, topBlocks, classOf, tableRows, describeBlock, writeJSON, pad, scriptLiteral, evalLiteral,
} from './lib.mjs';

const afterH2 = (s) => s.h2_idx + html.slice(s.h2_idx).indexOf('</h2>') + 5;
const blocksOf = (s) => topBlocks(afterH2(s), s.end);
const head = (s) => ({ marcador: s.sec_num, rotulo_marcador: s.sec_rotulo, titulo: both(s.h2), origem: origem(`section#${s.anchor} .sec-id`, `${s.sec_num} · ${s.sec_rotulo}`, s.sid_idx) });
const ledeOf = (s) => { const b = blocksOf(s).find((x) => classOf(x.open) === 'lede'); return { ...both(b.inner), origem: origem(`section#${s.anchor} p.lede`, b.inner, b.start) }; };
const semAula = (o) => ({ aulas_declaradas: [], nota: o });
const ts = read(CODE.content);

// ── tokens (cobertura, protocolo §5) ─────────────────────────
const SKIP = new Set(['origem', 'seletor', 'linha_aprox', 'trecho_inicial', 'nota', 'id', 'tipo', 'vinculos', 'comparacao_codigo', 'codigo_atual', 'classe', 'tag', 'html']);
const tok = (s) => (s.toLowerCase().normalize('NFC').match(/[\p{L}\p{N}]+/gu) || []);
function strings(o, acc = []) {
  if (typeof o === 'string') acc.push(o);
  else if (Array.isArray(o)) o.forEach((x) => strings(x, acc));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) if (!SKIP.has(k)) strings(v, acc);
  return acc;
}
function cobertura(srcText, obj) {
  const bag = new Map();
  for (const t of tok(strings(obj).join(' '))) bag.set(t, (bag.get(t) || 0) + 1);
  const src = tok(srcText); let hit = 0; const miss = [];
  for (const t of src) { const c = bag.get(t) || 0; if (c > 0) { bag.set(t, c - 1); hit++; } else miss.push(t); }
  return { tokens_fonte: src.length, tokens_casados: hit, pct: +(100 * hit / src.length).toFixed(1), nao_casados: miss.slice(0, 40) };
}
const secText = (s) => txtSp(html.slice(s.start, s.end));

// ── CASO ─────────────────────────────────────────────────────
const casoS = sec('caso');
const casoBlocks = blocksOf(casoS).map((b) => describeBlock(b, '§Caso'));
const diag = casoBlocks.find((b) => b.tipo === 'caixa' && b.rotulo.startsWith('Diagnóstico'));
const diagQ = [...diag.paragrafos[0].html.matchAll(/<b>(Primeira|Segunda|Terceira):<\/b>\s*([\s\S]*?)(?=\s*<b>(?:Segunda|Terceira):|\s*As três respostas|$)/g)].map((m) => ({ ordinal: m[1], ...both(m[2]) }));
must(diagQ.length === 3, 'diag ' + diagQ.length);
const fecho = casoBlocks.find((b) => b.tipo === 'caixa' && b.rotulo === 'O que a Operação A recebe deste bloco');
const caso = {
  id: 'm15-caso', tipo: 'caso', ...head(casoS),
  titulo_p17: 'P17: na camada Alexandria o título é "Caso — Operação A"; o rótulo literal da fonte é o de rotulo_marcador ("Operação A — parte 15").',
  blocos: casoBlocks.map((b, i) => ({ id: `m15-caso-b${pad(i + 1)}`, ...b })),
  perguntas: casoBlocks.filter((b) => b.tipo === 'titulo').map((b) => ({ numero: b.numero, html: b.html, texto: b.texto, origem: b.origem })),
  perguntas_nota: 'A fonte declara DUAS perguntas como subtítulos (15.1, 15.2) e três perguntas de diagnóstico dentro da caixa "Diagnóstico". Nenhuma pede resposta registrada do learner.',
  perguntas_de_diagnostico: diagQ,
  decisao_pedida: null,
  decisao_nota: 'A fonte recusa explicitamente a decisão: a caixa final começa por "Um diagnóstico, não uma decisão." e diz que "nenhuma decisão de contratação é sugerida". P17 autoriza um Desafio de decisão na camada Alexandria, só com fatos do caso.',
  decisao_literal: fecho.paragrafos[0],
  dados: casoBlocks.filter((b) => b.tipo === 'tabela'),
  dados_nota: 'Os dados do caso são as duas tabelas (3 situações × 3 colunas; 4 condições × 3 colunas). Não há número da Operação A: a fonte diz que o caso "permanece anonimizado, sem nome, sem município exato e sem qualquer dado de operação".',
  vinculos: { aulas_citadas_em_prosa: [], modulos_citados: ['parte 09 (Operação A)'], nota: 'A lede resume as "catorze partes anteriores" e cita a "parte 09". Nenhuma aula do M15 é apontada.' },
  codigo_atual: 'ausente em src/lib/data (nenhuma ocorrência de "Operação A" no arquivo do M15)',
  codigo_confirmacao: ts.includes('Operação A') ? 'ATENÇÃO: o arquivo cita "Operação A"' : 'confirmado: 0 ocorrências',
};

// ── QUIZ ─────────────────────────────────────────────────────
const quizS = sec('quiz');
const qLit = scriptLiteral(html.indexOf('/* ===================== QUIZ'), 'Q');
const Q = evalLiteral(qLit.code);
must(Q.length === 10, 'Q');
const qStarts = allMatches(/\{q:'/, html, qLit.idx, qLit.idx + qLit.code.length + 20).map((m) => m.index);
const L = 'ABCD';
const btnGo = html.match(/<button class="btn" id="quiz-go">(.*?)<\/button>/);
const btnRe = html.match(/<button class="btn ghost" id="quiz-reset">(.*?)<\/button>/);
const avaliacao = {
  id: 'm15-quiz', tipo: 'avaliacao', ...head(quizS),
  introducao: ledeOf(quizS),
  mecanica_fonte: 'Radio por questão; botão "Corrigir" marca certa/errada em todas e mostra o feedback (q.f) de TODAS as questões, respondidas ou não; questão sem resposta conta como não acerto, sem aviso. Placar "N / 10" com classe pass (≥8) ou fail. "Refazer" reconstrói as questões. Alternativas passam por esc() (texto); feedback e mensagens entram como HTML.',
  total_questoes: Q.length,
  criterio_literal_prosa: ledeOf(quizS).texto.split('. ')[0] + '.',
  faixas_de_placar_script: [
    { condicao: 'acertos>=8', intervalo: '8–10', classe: 'pass', mensagem: html.match(/\? '(Critério atingido\.[^']*)'/)[1] },
    { condicao: 'else (acertos<8)', intervalo: '0–7', classe: 'fail', mensagem_html: html.match(/: '(Abaixo do critério de oito acertos\.[^']*)'/)[1] },
  ],
  faixas_nota: 'intervalo/condicao descrevem o if/else; só mensagem/mensagem_html são texto exibido. P18: o limiar é registro legado.',
  rotulos_de_interface_fonte: { cabecalho_questao: "'Questão '+(i+1)+' de '+Q.length", botao_corrigir: btnGo[1], botao_refazer: btnRe[1], placar: "acertos+' / '+Q.length" },
  perguntas: Q.map((q, i) => ({
    id: `m15-quiz-q${pad(i + 1)}`, tipo: 'questao-multipla-escolha',
    rotulo_renderizado: `Questão ${i + 1} de ${Q.length}`,
    rotulo_renderizado_nota: "montado pelo script ('Questão '+(i+1)+' de '+Q.length); não é literal contíguo da fonte",
    enunciado: q.q,
    alternativas: q.o.map((o, j) => ({ letra: L[j], indice: j, texto: o })),
    gabarito: { indice: q.a, letra: L[q.a], texto: q.o[q.a] },
    explicacao_html: q.f,
    explicacao_texto: txt(q.f),
    vinculos: semAula('A fonte não associa questão a aula nem a exercício.'),
    origem: { seletor: `<script> QUIZ var Q[${i}]`, trecho_inicial: q.q.slice(0, 70), linha_aprox: lineOf(qStarts[i]) },
  })),
  distribuicao_gabarito: Object.fromEntries(L.split('').map((l, j) => [l, Q.filter((q) => q.a === j).length])),
  codigo_atual: ts.includes(Q[0].q.slice(0, 40)) ? 'presente' : 'ausente em src/lib/data',
};
const rotuloQ = html.slice(qLit.idx - 200, qLit.idx);

// ── CHECKLIST FINAL ──────────────────────────────────────────
const finS = sec('final');
const ul = html.indexOf('<ul class="ck">', finS.start);
const ulEnd = balancedEnd(ul, 'ul');
const p14 = (t) => {
  const tags = [];
  if (/menos de um minuto|segundos/.test(t)) tags.push('cronometrado');
  const v = t.split(' ')[0];
  if (/^(Nomeio|Explico|Apresento|Descrevo|Distingo|Separo|Leio|Recuso|Reconheço|Decomponho|Aplico)$/.test(v) || /nomeio/.test(t)) tags.push('producao_oral_ou_livre');
  if (/^(Sei|Nunca)$/.test(v)) tags.push('conhecimento_declarativo');
  if (/^(Monto|Somo)$/.test(v)) tags.push('calculo');
  return tags;
};
const ckItems = allMatches(/<li>([\s\S]*?)<\/li>/, html, ul, ulEnd).map((m, i) => ({
  id: `m15-checklist-${pad(i + 1)}`, tipo: 'item-de-checklist', ordem: i + 1, ...both(m[1]),
  marcacao_p14: p14(txt(m[1])),
  vinculos: semAula('A fonte não associa item a aula.'),
  origem: origem('section#final ul.ck > li', m[1], m.index),
}));
must(ckItems.length === 28, 'ck');
const finBox = blocksOf(finS).find((b) => (classOf(b.open) ?? '').startsWith('box'));
const checklist_final = {
  id: 'm15-checklist', tipo: 'checklist', ...head(finS),
  introducao: ledeOf(finS),
  mecanica_fonte: 'ul.ck estático: nenhum script lê ou marca os itens (sem toggle, sem persistência).',
  total_itens: ckItems.length,
  contagem_declarada: { h2: txt(finS.h2), pill: 'ver modulo.json identidade.pills_hero[8]' },
  itens: ckItems,
  itens_por_marcacao_P14: Object.fromEntries(['cronometrado', 'producao_oral_ou_livre', 'conhecimento_declarativo', 'calculo'].map((k) => [k, ckItems.filter((c) => c.marcacao_p14.includes(k)).map((c) => c.ordem)])),
  nota_P14: 'marcacao_p14 é inferida do verbo inicial (anotação desta extração, revisão humana pendente). Itens em 1ª pessoa ("nomeio", "explico") são produção livre/oral; nenhum vira evidência automatizada.',
  caixa_final: describeBlock(finBox, '§Final'),
  codigo_atual: 'ausente em src/lib/data; alexandria-badges.ts não usa o M15',
};

// ── EXERCÍCIOS ───────────────────────────────────────────────
const exS = sec('ex');
const fams = allMatches(/<h4>(.*?)<\/h4>/, html, exS.start, exS.end).map((m) => ({ idx: m.index, t: m[1] }));
const codeEx = Object.fromEntries([...ts.matchAll(/id: "m15-ex-(\d\d)",\s*kind: '(\w+)',\s*prompt: ("(?:[^"\\]|\\.)*"),\s*points: (\d+),\s*config: \{ tag: ("(?:[^"\\]|\\.)*"), gabarito: ("(?:[^"\\]|\\.)*")/g)]
  .map((m) => [m[1], { kind: m[2], prompt: JSON.parse(m[3]), points: +m[4], tag: JSON.parse(m[5]), gabarito: JSON.parse(m[6]) }]));
const exItems = allMatches(/<details><summary>(\d\d) · ([\s\S]*?)<\/summary>\s*<div class="det-bd">([\s\S]*?)<\/div><\/details>/, html, exS.start, exS.end).map((m) => {
  const fam = fams.filter((f) => f.idx < m.index).pop();
  const c = codeEx[m[1]];
  const refHtml = m[3].trim();
  const aulaHits = [m[2], m[3]].join(' ').match(/[Aa]ula\s*\d+/g) || [];
  return {
    id: `m15-ex-${m[1]}`, tipo: 'exercicio',
    tag: `${m[1]}`, familia: fam.t,
    aula_declarada: null,
    aula_nota: aulaHits.length ? `Menção em prosa: ${aulaHits.join(', ')} (não é tag de posse, §4).` : 'Sem vínculo: nenhuma menção a "Aula NN" no enunciado nem na resposta (P9 → Recursos do Módulo).',
    enunciado: both(m[2]),
    resposta_referencia: { html: inl(refHtml), texto: txt(refHtml) },
    criterio: null,
    criterio_nota: 'A fonte não dá critério por exercício. O critério da seção (lede do §Ex) é produzir "a pergunta correta em menos de um minuto".',
    rotulo_revelacao_fonte: '<details> nativo (summary = enunciado); não há botão rotulado',
    origem: origem('section#ex details > summary', m[2], m.index),
    comparacao_codigo: c ? {
      id_codigo: `m15-ex-${m[1]}`,
      prompt_igual: c.prompt === txt(m[2]) || c.prompt === inl(m[2]),
      gabarito_igual: c.gabarito === inl(refHtml),
      tag_igual_familia: c.tag === fam.t,
      kind: c.kind, points: c.points,
      points_nota: 'points: 10 não tem origem na fonte.',
    } : { id_codigo: null, status: 'ausente' },
  };
});
must(exItems.length === 15, 'ex ' + exItems.length);

// fichas de elo "Preencha" (atividade dentro de aula)
const fichas = allMatches(/<div class="emp">/).map((m, i) => {
  const s = SECTIONS.find((x) => x.start < m.index && x.end > m.index);
  const body = innerOf(m.index);
  const h3 = [...html.slice(s.start, m.index).matchAll(/<h3><span class="num">(.*?)<\/span>\s*([\s\S]*?)<\/h3>/g)].pop();
  const hd = body.match(/<div class="nm">(.*?) <small>(.*?)<\/small><\/div>\s*<div class="ar">(.*?)<\/div>/);
  const rows = [...body.matchAll(/<div class="emp-row( vazio)?"><div class="emp-k">(.*?)<\/div><div class="emp-v">([\s\S]*?)<\/div><\/div>/g)];
  const vz = rows.find((r) => r[1]);
  const mini = vz[3].match(/<span class="mini">([\s\S]*?)<\/span>$/);
  return {
    id: `m15-ficha-elo-${pad(i + 1)}`, tipo: 'ficha_de_elo_com_campo_a_preencher',
    aula: s.sec_num, aula_id_codigo: `aula-15-${s.sec_num.slice(5)}`, subsecao: h3[1], titulo_subsecao: txt(h3[2]),
    cabecalho: { elo: hd[1], qualificador: hd[2], rotulo: hd[3] },
    campos: rows.filter((r) => !r[1]).map((r) => ({ chave: r[2], ...both(r[3]) })),
    campo_a_preencher: { chave: vz[2], enunciado: both(mini ? vz[3].slice(0, vz[3].length - mini[0].length) : vz[3]), dica: mini ? both(mini[1]) : null },
    resposta_referencia: null,
    resposta_nota: 'A fonte não traz gabarito para o campo "Preencha"; o INST·01 (campo "nao" de cada elo) e o INST·08 trazem textos "O que este número não diz" para elos equivalentes, mas não são declarados como gabarito.',
    vinculo: 'por posição (dentro da section da aula)',
    origem: origem(`section#${s.anchor} div.emp`, hd[1], m.index),
  };
});
must(fichas.length === 6, 'fichas');
const exercicios = {
  id: 'm15-exercicios', tipo: 'indice_de_exercicios', ...head(exS),
  introducao: ledeOf(exS),
  familias: fams.map((f) => ({ ...both(f.t), linha_aprox: lineOf(f.idx), exercicios: exItems.filter((e) => e.familia === f.t).map((e) => e.id) })),
  total_na_fonte: exItems.length,
  contagem_declarada: exS.sec_rotulo,
  itens: exItems,
  soltos_P9: exItems.filter((e) => !e.aula_declarada).map((e) => e.id),
  vinculados_a_aula: [],
  vinculados_nota: 'Zero exercício do §Ex aponta aula (varredura /[Aa]ula\\s*\\d+/ em enunciado e resposta). Os 15 vão para Recursos do Módulo (P9).',
  fichas_de_elo_em_aula: fichas,
  fichas_nota: 'As 6 fichas de elo (pill "6 fichas de elo") vivem DENTRO das aulas 01, 05, 07 e 08 e têm um campo "O que este número não diz" marcado "Preencha." — atividade de produção vinculada à aula por posição. Não estão no §Ex. No código viram nota estática (kind: "nota") com o "Preencha." como texto.',
  codigo_atual: 'MODULO_15_EXERCICIOS_SOLTOS (15, kind discursiva, points 10) em alexandria-modulo-15-content.ts — não registrado em RecursosDoModulo.tsx',
};

// ── REFERÊNCIAS ──────────────────────────────────────────────
const refS = sec('ref');
const MESES = 'janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro';
const dateRe = new RegExp(`\\b(?:\\d{1,2}º? de (?:${MESES}) de \\d{4}|\\d{2}/\\d{2}/\\d{4}|(?:${MESES}) de \\d{4}|\\d{1,2}º? de (?:${MESES}))\\b`, 'g');
const refItems = allMatches(/<li><span class="src">(.*?)<\/span>([\s\S]*?)<\/li>/, html, refS.start, refS.end).map((m, i) => {
  const t = txt(m[2]);
  const inst = t.match(/^(ANP|Petrobras|ONS|PPSA|EPE),/);
  const [cat, ...tema] = m[1].split(' · ');
  return {
    id: `m15-ref-${pad(i + 1)}`, tipo: 'referencia',
    rotulo_fonte: m[1],
    tipo_declarado: cat, tema_declarado: tema.join(' · ') || null,
    ...both(m[2]),
    titulo: null,
    titulo_nota: 'A fonte não separa título: o texto do item é descrição corrida (norma com número e data, ou documento com órgão).',
    instituicao_citada: inst ? inst[1] : null,
    instituicao_nota: inst ? 'Nome literal no início do texto.' : 'Sem nome de instituição destacado no início do texto; não inferido.',
    url: null, dominio_citado: null,
    datas_citadas: t.match(dateRe) || [],
    data_de_consulta: null,
    data_de_consulta_nota: 'Só declarada no nível da seção (lede: "Todas verificadas em 4 de agosto de 2026").',
    vinculos: semAula('A fonte declara as referências no nível do módulo.'),
    origem: origem('section#ref ul.ref-list > li', m[2], m.index),
  };
});
must(refItems.length === 36, 'refs');
must(!/https?:|www\./.test(html.slice(refS.start, refS.end)), 'url na ref');
// normas citadas no corpo × referências
const normRe = /\b(Lei|Decreto|Medida Provisória|MP|Resolução(?: ANP| CNPE)?|Portaria)\s+nº\s+[\d.]+(?:\/\d{4})?/g;
const normKey = (s) => s.replace(/Medida Provisória/, 'MP').replace(/^Resolução (?:ANP|CNPE) /, 'Resolução ').replace(/\/\d{4}$/, '').replace(/\s+/g, ' ');
const refNorms = new Set(refItems.flatMap((r) => (r.texto.match(normRe) || []).map(normKey)));
const bodyNorms = new Map();
for (const s of SECTIONS.filter((x) => x.anchor !== 'ref')) {
  for (const m of txt(html.slice(s.start, s.end)).matchAll(normRe)) {
    const k = normKey(m[0]); if (!bodyNorms.has(k)) bodyNorms.set(k, new Set()); bodyNorms.get(k).add(s.sec_num);
  }
}
for (const m of html.slice(html.indexOf('<script>')).matchAll(normRe)) { const k = normKey(m[0]); if (!bodyNorms.has(k)) bodyNorms.set(k, new Set()); bodyNorms.get(k).add('<script>'); }
const normasSemRef = [...bodyNorms].filter(([k]) => !refNorms.has(k)).map(([k, v]) => ({ norma: k, onde: [...v] }));
const referencias = {
  id: 'm15-referencias', tipo: 'referencias', ...head(refS),
  introducao: ledeOf(refS),
  data_de_consulta_da_secao: '4 de agosto de 2026',
  total: refItems.length,
  contagem_declarada: txt(refS.h2),
  itens: refItems,
  por_tipo_declarado: refItems.reduce((a, r) => ((a[r.tipo_declarado] = (a[r.tipo_declarado] || 0) + 1), a), {}),
  normas_citadas_no_corpo_sem_item_proprio: normasSemRef,
  normas_nota: 'Comparação mecânica "Lei/Decreto/MP/Resolução/Portaria nº X" do corpo e do script contra o texto dos 36 itens (número sem o ano). Itens do §Ref que agrupam atos ("Decretos e portarias ministeriais de maio e junho de 2026…") não trazem número, então a lista pode conter atos cobertos genericamente.',
  codigo_atual: 'ausente em src/lib/data para o M15',
};

// ── GLOSSÁRIO ────────────────────────────────────────────────
const lexS = sec('lex');
const glo = read(CODE.glossario);
const codeTerms = [...glo.matchAll(/id: "([^"]+)",\s*term: ("(?:[^"\\]|\\.)*")/g)].map((m) => ({ id: m[1], term: JSON.parse(m[2]) }));
const nrm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const byName = new Map();
for (const c of codeTerms) { const k = nrm(c.term); if (!byName.has(k)) byName.set(k, []); byName.get(k).push(c.id); }
const famDet = allMatches(/<details><summary>Família (\d) · (.*?) <b>(\d+) termos<\/b><\/summary>/, html, lexS.start, lexS.end);
must(famDet.length === 8, 'familias lex');
const termos = [];
const familias = famDet.map((f) => {
  const s = f.index; const e = balancedEnd(s, 'details');
  const ps = allMatches(/<p><span class="term">(.*?)<\/span> — ([\s\S]*?)<\/p>/, html, s, e);
  const allSpans = allMatches(/<span class="term">/, html, s, e).length;
  ps.forEach((p) => termos.push({
    id: `m15-lex-${String(termos.length + 1).padStart(3, '0')}`, tipo: 'termo-de-glossario',
    familia_numero: +f[1], familia: f[2],
    termo_html: p[1], termo: txt(p[1]),
    definicao_html: inl(p[2]), definicao_texto: txt(p[2]),
    glosa_de_desambiguacao: p[2].includes('Glosa de desambiguação'),
    vinculos: semAula('A fonte não liga termo a aula.'),
    origem: origem(`section#lex details(Família ${f[1]}) p > span.term`, p[1], p.index),
    comparacao_codigo: { status: 'ausente_no_codigo', mesmo_nome_em_outro_modulo: byName.get(nrm(txt(p[1]))) ?? [] },
  }));
  return { numero: +f[1], nome: f[2], sumario: both(f[0].replace(/^<details><summary>|<\/summary>$/g, '')), declarado: +f[3], markup_p: ps.length, markup_span_term: allSpans, origem: origem('section#lex details > summary', `Família ${f[1]} · ${f[2]}`, s) };
});
must(termos.length === 174, 'termos ' + termos.length);
const dupl = termos.map((t) => nrm(t.termo)).filter((v, i, a) => a.indexOf(v) !== i);
const codeM15 = codeTerms.filter((c) => /m15/.test(c.id)).length;
const glossario = {
  id: 'm15-glossario', tipo: 'glossario', ...head(lexS),
  introducao: ledeOf(lexS),
  contagem: {
    prosa_h2: txt(lexS.h2), markup_termos: termos.length,
    soma_declarada_familias: familias.reduce((a, f) => a + f.declarado, 0),
    familias,
    termos_com_glosa: termos.filter((t) => t.glosa_de_desambiguacao).map((t) => t.termo),
    nomes_duplicados: dupl,
  },
  termos,
  codigo_atual: {
    arquivo: 'src/lib/data/alexandria-glossario.ts',
    verbetes_m15_no_codigo: codeM15,
    faltam_no_codigo: termos.length - codeM15,
    lista_faltantes: 'todos os 174 (ver termos[].termo); o arquivo cobre só M01–M08 (cabeçalho: "Os verbetes, organizados por MODULO"; blocos Wave 8 e Wave 34)',
    homonimos_em_outros_modulos: termos.filter((t) => t.comparacao_codigo.mesmo_nome_em_outro_modulo.length).map((t) => ({ termo: t.termo, ids_codigo: t.comparacao_codigo.mesmo_nome_em_outro_modulo })),
    homonimos_nota: 'Mesmo nome (normalizado sem acento/caixa) em verbete de outro módulo. São verbetes distintos, não duplicata (regra dos ids gl-mNN-); a definição do M15 não foi comparada com a deles.',
  },
};

// ── divergências ─────────────────────────────────────────────
const D = (id, grupo, tema, leituras, nota) => ({ id, grupo, tema, leituras, nota, decisao: 'não escolhida — registrar (P5/P8)' });
const q10 = Q[9].f;
const divergencias = [
  D('div-m15-ap-01-quiz-feedback-todas', 'fonte (mecânica)', 'Feedback exibido para todas as questões, inclusive não respondidas',
    [{ onde: `<script> QUIZ corrigir() (L${lineOf(html.indexOf("var fb=$id('fb-'+i)"))})`, literal: "var fb=$id('fb-'+i); fb.innerHTML=q.f; fb.classList.add('show');" }],
    'A explicação revela o gabarito de questões em branco; questão em branco conta como erro sem aviso. Relevante para C7 (tentativa antes da referência).'),
  D('div-m15-ap-02-gridalpha-q10', 'fonte×decisão', 'Explicação da Q10 cita a marca',
    [{ onde: `Q[9].f (L${lineOf(qStarts[9])})`, literal: q10.slice(q10.indexOf('Nenhum ativo'), q10.indexOf('hidrocarbonetos.') + 16) }, { onde: 'P24', literal: 'GridAlpha morta como marca voltada ao learner' }],
    'Literal preservado.'),
  D('div-m15-ap-03-quiz-x-exercicios', 'fonte×fonte (sobreposição)', 'Questões do quiz repetem exercícios do §Ex',
    [{ onde: 'Q07', literal: Q[6].q }, { onde: 'Ex 14', literal: exItems[13].enunciado.texto }, { onde: 'Q08 × Ex 13; Q09 × Ex 15; Q03 × Ex 12; Q05 × Ex 06; Q02 × Ex 10', literal: 'mesmo conteúdo, formulação diferente' }],
    'Não é contradição: os números batem (10 × 5,50 × 7,2 = 396). Registrado porque a Ex 14 abre a resposta da Q07 se feita antes (C7).'),
  D('div-m15-ap-04-caso-parte', 'fonte×decisão', 'Caso numerado como "parte 15"',
    [{ onde: '§Caso .sec-id', literal: casoS.sec_rotulo }, { onde: 'P17', literal: 'Não existe "Parte 1"; título "Caso — Operação A"' }], 'Ver modulo.json div-m15-05.'),
  D('div-m15-ap-05-ref-sem-data-item', 'fonte (lacuna declarada)', 'h2 do §Ref promete "data de consulta" por fonte; os itens não a trazem',
    [{ onde: '§Ref h2', literal: txt(refS.h2) }, { onde: '§Ref lede', literal: 'Todas verificadas em 4 de agosto de 2026.' }],
    'A data é única para a seção; nenhum item tem data de consulta própria.'),
  D('div-m15-ap-06-normas-sem-ref', 'fonte×fonte', 'Normas citadas no corpo sem item próprio no §Ref',
    normasSemRef.map((n) => ({ onde: n.onde.join(', '), literal: n.norma })),
    'Ver referencias.normas_nota (comparação mecânica; alguns atos podem estar cobertos por item genérico).'),
  D('div-m15-ap-07-fichas-codigo', 'fonte×código', 'Campo "Preencha." das 6 fichas de elo vira nota estática no código',
    [{ onde: 'fonte', literal: fichas[0].campo_a_preencher.enunciado.texto }, { onde: 'alexandria-modulo-15-content.ts', literal: 'kind: "nota" (tom neutro, label null) com os pares em <b>…</b>' }],
    'A atividade de produção (preencher e depois comparar) não existe como atividade no código.'),
  D('div-m15-ap-08-exercicios-points', 'fonte×código', 'points: 10 nos 15 exercícios',
    [{ onde: 'código', literal: 'points: 10' }, { onde: 'fonte', literal: 'sem pontuação por exercício' }], 'Valor sem origem na fonte.'),
];

// ── cobertura ────────────────────────────────────────────────
const quizSrcText = txtSp(html.slice(quizS.start, quizS.end)) + ' ' + Q.map((q) => [q.q, ...q.o, txt(q.f)].join(' ')).join(' ');
const cob = {
  caso: cobertura(secText(casoS), caso),
  quiz_secao_mais_script_Q: cobertura(quizSrcText, avaliacao),
  final: cobertura(secText(finS), checklist_final),
  ex: cobertura(secText(exS), exercicios),
  ref: cobertura(secText(refS), referencias),
  lex: cobertura(secText(lexS), glossario),
  nota: 'Cobertura por token com baixa (protocolo §5). Denominador = texto da section (sem tags). No quiz somam-se as strings de var Q. Chaves de anotação (nota, origem, id…) e html ficam fora do numerador. Resíduo típico: rótulos de botão e marcadores de seção.',
};

writeJSON('aparato.json', {
  schema: 'alexandria-v2/extraction/aparato@1',
  modulo: 'M15', grupo: 'aparato', camada: 'fonte',
  fonte: { arquivo: SRC, linhas_total: LINES.length - (LINES[LINES.length - 1] === '' ? 1 : 0), bytes: Buffer.byteLength(html) },
  gerado_em: '2026-09-17',
  metodo: 'extratores/m15_aparato.mjs — regex escopada por section#id + .sec-id; quiz lido avaliando o literal `var Q=[...]` do <script>; tabelas/caixas por walker de tags balanceadas.',
  convencoes: { linha_aprox: 'linha 1-based no HTML-fonte', null: 'toda ausência vem com *_nota', html: 'literal com espaços colapsados', texto: 'sem tags, entidades decodificadas', marcacao_p14: 'anotação desta extração' },
  caso, avaliacao, checklist_final, exercicios, referencias, glossario, divergencias,
  cobertura_por_token: cob,
  contagens: {
    caso_blocos: caso.blocos.length, caso_tabelas: caso.dados.length, caso_perguntas_subtitulo: caso.perguntas.length, caso_perguntas_diagnostico: diagQ.length,
    quiz_questoes: Q.length, quiz_alternativas: Q.reduce((a, q) => a + q.o.length, 0), quiz_faixas: 2,
    checklist_itens: ckItems.length, exercicios: exItems.length, exercicios_vinculados: 0, exercicios_soltos: exItems.length, fichas_de_elo: fichas.length,
    referencias: refItems.length, referencias_com_url: 0, referencias_com_data_citada: refItems.filter((r) => r.datas_citadas.length).length,
    termos: termos.length, familias: familias.length, termos_no_codigo: codeM15, homonimos_em_outros_modulos: glossario.codigo_atual.homonimos_em_outros_modulos.length,
    divergencias: divergencias.length,
  },
});
console.log('aparato ok', JSON.stringify(cob, (k, v) => (k === 'nao_casados' ? undefined : v)));
console.log('ex código:', JSON.stringify(exItems.map((e) => [e.id, e.comparacao_codigo.prompt_igual, e.comparacao_codigo.gabarito_igual, e.comparacao_codigo.tag_igual_familia])));
console.log('familias', JSON.stringify(familias.map((f) => [f.declarado, f.markup_p, f.markup_span_term])), 'dupl', dupl, 'normasSemRef', JSON.stringify(normasSemRef));
console.log('homonimos', glossario.codigo_atual.homonimos_em_outros_modulos.length, 'p14', JSON.stringify(checklist_final.itens_por_marcacao_P14));
void rotuloQ;
