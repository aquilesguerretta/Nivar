// Grupo "aparato" do M03: § Caso, § Quiz (script), § Final, § Ex, § Ref, § Lex.
// Quiz lido avaliando o literal `const questions = [...]` do <script> em vm.
import vm from 'node:vm';
import {
  SRC, CODE, L, ln, at, find, findAll, inner, txt, stripTags, collapse, origem, pad, secao, SECOES,
  blockEnd, writeJson, readCode, marcacaoP14, fail, TOTAL_LINHAS, hoje, decode,
} from './lib.mjs';

const ts = readCode('content');
const glossTs = readCode('glossario');
const badgesTs = readCode('badges');

// ── § Caso ──────────────────────────────────────────────────
const sC = secao('§ Caso');
const nLead = find(/class="lead"/, sC.start, sC.end);
const nTag = find(/class="case-tag"/, sC.start, sC.end);
const nH3 = find(/<h3/, sC.start, sC.end);
const nBody = find(/class="case-body"/, sC.start, sC.end);
const nAviso = find(/^\s*<p>/, nBody, sC.end);
const h4s = findAll(/<h4>/, sC.start, sC.end);
const nCallout = find(/class="callout gold"/, sC.start, sC.end);
const nUl = find(/<ul/, sC.start, sC.end);
const leituraPs = findAll(/^\s*<p><strong>/, h4s[0], nCallout);
const caso = {
  id: 'm03-caso-operacao-a',
  tipo: 'caso',
  camada: 'fonte',
  marcador: sC.num,
  rotulo_marcador: sC.rotulo,
  titulo: { ...txt(inner(sC.h2, 'h2')), origem: origem(sC.h2, 'section.aula(§ Caso) h2') },
  comentario_html_da_fonte: ln(find(/CASO: Operação A/)).trim(),
  parte: 'Parte 3',
  nota_parte: 'A fonte do M03 declara a parte literalmente na etiqueta ("… · Parte 3") e no lead ("Parte 1 leu a fatura…; Parte 2, com a lente da rede. Agora a terceira leitura"). Registrado como texto da fonte. P17: na camada de produto o título é "Caso — Operação A" e etapas de interface não são "Partes" da fonte.',
  lead: { ...txt(at(nLead, /class="lead">(.*)<\/p>/)), origem: origem(nLead, 'section.aula(§ Caso) p.lead') },
  etiqueta: { texto: at(nTag, /case-tag">(.*)<\/div>/), origem: origem(nTag, '.case-study .case-tag') },
  subtitulo: { ...txt(inner(nH3, 'h3')), origem: origem(nH3, '.case-study .case-header h3') },
  aviso_ficcao: { ...txt(inner(nAviso, 'p')), origem: origem(nAviso, '.case-body > p:first') },
  dados: findAll(/class="case-data-cell"/, sC.start, sC.end).map((n, i) => ({
    id: `m03-caso-dado-${pad(i + 1)}`, tipo: 'dado-do-caso',
    rotulo: at(n + 1, /class="lbl">(.*)<\/div>/),
    valor: at(n + 2, /class="val[^"]*">(.*)<\/div>/),
    marcado_como_alerta_na_fonte: /class="val alert"/.test(ln(n + 2)),
    origem: origem(n + 1, 'section.aula(§ Caso) .case-data-cell'),
  })),
  cabecalhos_internos: h4s.map((n) => ({ texto: inner(n, 'h4'), origem: origem(n, '.case-body h4') })),
  leitura_estruturada: leituraPs.map((n, i) => {
    const h = inner(n, 'p');
    const m = h.match(/^<strong>(.*?)<\/strong>\s*—\s*([\s\S]*)$/);
    return {
      id: `m03-caso-leitura-${pad(i + 1)}`, tipo: 'leitura-do-caso',
      titulo: m ? stripTags(m[1]) : null,
      aulas_citadas_no_titulo: m ? (m[1].match(/\((Aulas? [^)]*)\)/) || [null, null])[1] : null,
      corpo: m ? txt(m[2]) : null,
      ...txt(h),
      origem: origem(n, '.case-body > p'),
    };
  }),
  linguagem_recomendada: {
    rotulo: at(nCallout + 1, /callout-label">(.*)<\/div>/),
    ...txt(inner(nCallout + 2, 'p')),
    origem: origem(nCallout, '.case-body .callout.gold'),
  },
  o_que_pedir_ao_cliente: {
    titulo: inner(h4s[1], 'h4'),
    itens: findAll(/<li/, nUl, find(/<\/ul>/, nUl)).map((n, i) => ({ id: `m03-caso-pedido-${pad(i + 1)}`, ...txt(inner(n, 'li')), origem: origem(n, '.case-body ul > li') })),
  },
  perguntas: null,
  nota_perguntas: 'A fonte não faz perguntas ao learner no § Caso. Entrega a leitura já resolvida ("Leitura estruturada…"), a linguagem recomendada e a lista do que pedir ao cliente.',
  decisao_pedida: null,
  nota_decisao: 'A fonte não pede decisão. P17 autoriza um "Desafio de decisão" da camada Alexandria, só com fatos do caso (não extraído aqui).',
  vinculos: {
    aulas_citadas_em_prosa: [...new Set([...slice2(sC.start, sC.end).matchAll(/Aulas? (\d\d)(?:[–e ]+(\d\d))?/g)].map((m) => m[0]))],
    checklist: 'm03-checklist-18 ("Reproduzir a leitura da Operação A Parte 3…")',
    nota: 'As aulas são citadas em prosa (títulos das leituras e dado "Exposição sistêmica"), não por tag. O item 18 do checklist final remete ao caso.',
  },
  origem: origem(sC.start, 'section.aula .aula-marker "§ Caso"'),
  codigo_atual: /Mineração de médio porte|Operação A — a mesma planta/.test(ts) ? 'presente' : 'Não extraído: nenhum texto do § Caso em alexandria-modulo-03-content.ts. (Os callouts "Onde isso entra no produto" das Aulas 05 e 09 citam a Operação A, mas são corpo de aula.)',
};
function slice2(a, b) { return L.slice(a - 1, b).join('\n'); }
if (caso.dados.length !== 6 || caso.leitura_estruturada.length !== 4 || caso.o_que_pedir_ao_cliente.itens.length !== 5) fail('caso: contagens');

// ── § Quiz ──────────────────────────────────────────────────
const sQ = secao('§ Quiz');
const nQP = find(/^\s*<p>/, sQ.start, sQ.end);
const nQStart = find(/const questions = \[/);
let nQEnd = nQStart;
{ let d = 0; for (let n = nQStart; n <= L.length; n++) { d += (ln(n).match(/\[/g) || []).length - (ln(n).match(/\]/g) || []).length; if (d === 0) { nQEnd = n; break; } } }
const qSrc = L.slice(nQStart - 1, nQEnd).join('\n').replace(/^\s*const questions = /, '');
const QUESTIONS = vm.runInNewContext('(' + qSrc.replace(/;\s*$/, '') + ')');
/** Linha exata (1-based) da primeira ocorrência literal de `t` na fonte. */
const linhaDe = (t) => { const i = L.findIndex((x) => x.includes(t)); if (i < 0) fail(`literal ausente: ${t}`); return i + 1; };
const qLines = findAll(/^\s*q: "/, nQStart, nQEnd);
const LET = ['A', 'B', 'C', 'D', 'E'];
const perguntas = QUESTIONS.map((q, i) => ({
  id: `m03-quiz-q${pad(i + 1)}`,
  tipo: 'questao-multipla-escolha',
  rotulo_fonte: `Pergunta ${pad(i + 1)} / 10`,
  rotulo_nota: 'Rótulo gerado pelo template do script: `Pergunta ${String(idx + 1).padStart(2, "0")} / 10`.',
  enunciado: q.q,
  alternativas: q.options.map((t, k) => ({ letra: LET[k], indice: k, texto: t })),
  gabarito: { indice: q.correct, letra: LET[q.correct], texto: q.options[q.correct] },
  explicacao: q.feedback,
  nota_explicacao: 'A fonte mostra o mesmo feedback para acerto e erro (fbEl.textContent = q.feedback), depois de travar as alternativas.',
  vinculos: { aulas_declaradas: [], nota: 'A fonte não associa questão a aula; algumas explicações citam aula em prosa ("A lição estrutural da Aula 06").' },
  origem: { seletor: `<script> const questions[${i}]`, trecho_inicial: q.q.slice(0, 90), linha_aprox: qLines[i] },
}));
const nScore = find(/if\(correct >= 9\) scoreMsg/);
const faixas = [0, 1, 2, 3].map((k) => {
  const n = nScore + k;
  const m = ln(n).match(/^\s*(?:else )?(?:if\((correct >= (\d))\) )?scoreMsg\.textContent = "(.*)";\s*$/);
  return { condicao: m[1] ?? 'else (correct <= 4)', minimo: m[2] ? Number(m[2]) : 0, intervalo: ['9–10', '7–8', '5–6', '0–4'][k], mensagem: m[3], origem: origem(n, '<script> QUIZ scoreMsg') };
});
const avaliacao = {
  id: 'm03-quiz',
  tipo: 'avaliacao',
  camada: 'fonte',
  marcador: sQ.num,
  rotulo_marcador: sQ.rotulo,
  titulo: txt(inner(sQ.h2, 'h2')),
  introducao: { ...txt(inner(nQP, 'p')), origem: origem(nQP, 'section.aula(§ Quiz) > p') },
  mecanica_fonte: 'Uma resposta por questão (block.classList "answered" trava). Marca a correta e, se errou, a escolhida. Mostra o feedback. Ao responder as 10, mostra o placar e a mensagem por faixa. Sem persistência nem nova tentativa.',
  total_questoes: perguntas.length,
  distribuicao_gabarito: perguntas.reduce((a, p) => { a[p.gabarito.letra] = (a[p.gabarito.letra] || 0) + 1; return a; }, {}),
  criterio_literal_prosa: stripTags(inner(nQP, 'p')),
  faixas_de_placar_script: { faixas, nota_P18: 'Limiares legados; nenhum declara domínio na camada de produto (P18). 7 acertos já manda "avance", abaixo dos 8/10 da prosa.' },
  rotulos_de_interface_fonte: {
    placar: at(find(/quiz-score-label/, sQ.start, sQ.end), /quiz-score-label">(.*)<\/div>/),
    total: at(find(/class="total"/, sQ.start, sQ.end), /class="total">(.*?)<\/span>/),
  },
  perguntas,
  codigo_atual: /A solar responde por ~25% da capacidade/.test(ts) ? 'presente' : 'Não extraído: nenhuma questão do quiz do M03 em src/lib/data (grep do enunciado da Q01).',
};
if (perguntas.length !== 10 || perguntas.some((p) => p.alternativas.length !== 4)) fail('quiz');

// ── § Final ─────────────────────────────────────────────────
const sF = secao('§ Final');
const nFP = find(/^\s*<p>/, sF.start, sF.end);
const badgeCrit = [...badgesTs.matchAll(/\/\*\* Módulo 03, checklist item (\d+), L(\d+)\. \*\/\s*\{[\s\S]*?id: '(.*?)'[\s\S]*?criterion:\s*'(.*?)'/g)].map((m) => ({ item: Number(m[1]), linha: Number(m[2]), id: m[3], criterion: m[4] }));
const checkItens = findAll(/class="checklist-item"/, sF.start, sF.end).map((n, i) => {
  const h = at(n, /class="checklist-text">(.*)<\/div><\/div>$/);
  const b = badgeCrit.find((x) => x.item === i + 1);
  return {
    id: `m03-checklist-${pad(i + 1)}`, tipo: 'item-de-checklist', ordem: i + 1, ...txt(h),
    marcacao_p14: marcacaoP14(stripTags(h)),
    origem: origem(n, '#checklist .checklist-item .checklist-text'),
    vinculos: { aulas_declaradas: [], nota: 'A fonte não associa item a aula.' },
    codigo_badge: b ? { id: b.id, linha_citada: b.linha, linha_confere: b.linha === n, criterion_literal: b.criterion === stripTags(h) } : null,
  };
});
const checklist_final = {
  id: 'm03-checklist-final', tipo: 'checklist', camada: 'fonte',
  marcador: sF.num, rotulo_marcador: sF.rotulo,
  titulo: txt(inner(sF.h2, 'h2')),
  introducao: { ...txt(inner(nFP, 'p')), origem: origem(nFP, 'section.aula(§ Final) > p') },
  mecanica_fonte: 'Clique alterna a classe "checked" (script CHECKLIST). Sem persistência, sem verificação, sem contagem.',
  total_itens: checkItens.length,
  itens: checkItens,
  itens_orais_ou_cronometrados_P14: checkItens.filter((x) => x.marcacao_p14.some((t) => /oral|cronometrado/.test(t))).map((x) => x.id),
  nota_P14: 'marcacao_p14 é inferida por regra (verbo inicial, "sem travar", "5 minutos") e não é texto da fonte. Item 17 é o único com tempo declarado ("roteiro de 5 minutos").',
  codigo_atual: `Parcial: 3 dos ${checkItens.length} itens viraram critério de badge em alexandria-badges.ts (${badgeCrit.map((b) => `item ${b.item} → ${b.id}`).join('; ')}). Os demais não estão no código.`,
};
if (checkItens.length !== 18) fail('checklist');

// ── § Ex ────────────────────────────────────────────────────
const sE = secao('§ Ex');
const nEL = find(/class="lead"/, sE.start, sE.end);
const codeActs = [...ts.matchAll(/id: "(ex-\d\d)",\s*kind: 'discursiva' as const,\s*prompt: (".*?"),\s*points: (\d+),\s*config: \{ tag: (".*?"), gabarito: (".*?") \}/g)]
  .map((m) => ({ id: m[1], prompt: JSON.parse(m[2]), points: Number(m[3]), tag: JSON.parse(m[4]), gabarito: JSON.parse(m[5]) }));
const codeAulaOf = (exId) => {
  const idx = ts.indexOf(`id: "${exId}"`);
  const before = ts.slice(0, idx);
  const iSoltos = ts.indexOf('export const MODULO_03_EXERCICIOS_SOLTOS');
  const iAulas = ts.indexOf('export const MODULO_03_AULAS');
  if (idx > iSoltos && idx < iAulas) return 'MODULO_03_EXERCICIOS_SOLTOS';
  const m = [...before.matchAll(/id: 'aula-03-(\d\d)'/g)].pop();
  return m ? `aula-03-${m[1]}` : null;
};
const exercicios = findAll(/class="exercise">/, sE.start, sE.end).map((n, i) => {
  const nTagE = find(/class="exercise-tag"/, n, n + 2);
  const tag = at(nTagE, /exercise-tag">(.*?)<\/span>/);
  const nQ = find(/class="exercise-question"/, n, n + 3);
  const nBtn = find(/class="exercise-toggle"/, n, n + 4);
  const nA = find(/^\s*<p>/, find(/class="exercise-answer"/, n, n + 6));
  const q = at(nQ, /exercise-question">(.*)<\/div>/);
  const a = inner(nA, 'p');
  const tm = tag.match(/^Ex · (\d\d) · (.*)$/);
  const alvo = tm[2];
  let aulas = [];
  if (/^Aula (\d\d)$/.test(alvo)) aulas = [alvo.slice(5)];
  else if (/^Aulas (\d\d)–(\d\d)$/.test(alvo)) { const [, x, y] = alvo.match(/^Aulas (\d\d)–(\d\d)$/); for (let k = Number(x); k <= Number(y); k++) aulas.push(pad(k)); }
  const c = codeActs.find((x) => x.id === `ex-${tm[1]}`);
  return {
    id: `m03-ex-${tm[1]}`, tipo: 'exercicio', camada: 'fonte',
    tag_fonte: tag,
    vinculo_declarado: aulas.length ? aulas.map((x) => `aula-03-${x}`) : null,
    solto_P9: aulas.length === 0,
    nota_vinculo: aulas.length > 1 ? 'Tag plural: a fonte declara as duas aulas ("Aulas 02–03").' : aulas.length === 0 ? `Tag "${alvo}" não aponta aula: exercício solto (P9 → recursos do módulo).` : null,
    enunciado: { ...txt(q), origem: origem(nQ, '.exercise .exercise-question') },
    resposta_referencia: { ...txt(a), origem: origem(nA, '.exercise .exercise-answer > p') },
    criterio: null,
    criterio_nota: 'Sem critério por exercício na fonte. Regra de módulo em modulo.json (m03-regra-ex): tentativa completa antes do gabarito.',
    marcacao_p14: marcacaoP14(stripTags(q)).concat(/em voz alta|Fale/.test(q) ? ['producao_oral'] : []).concat(/Calcule|Quanta|quantas|estime/i.test(stripTags(q)) ? ['calculo'] : []),
    rotulo_botao: at(nBtn, />(.*)<\/button>/),
    comparacao_codigo: c ? {
      id_codigo: c.id,
      local_codigo: codeAulaOf(c.id),
      prompt_identico: c.prompt === collapse(q),
      gabarito_identico: c.gabarito === collapse(a),
      tag_identica: c.tag === tag,
      points_codigo: c.points,
      nota: 'points: 1 não tem origem na fonte (invenção do código, como no M01).' + (aulas.length > 1 ? ' A tag plural "Aulas 02–03" foi alocada só na aula-03-02 (decisão da Wave 19, registrada no comentário do arquivo); a aula-03-03 fica sem exercício no código.' : ''),
    } : { status: 'ausente no código' },
    origem: origem(nTagE, 'section.aula(§ Ex) .exercise .exercise-tag'),
  };
});
const exIdx = {
  id: 'm03-exercicios', tipo: 'indice_de_exercicios', camada: 'fonte',
  marcador: sE.num, rotulo_marcador: sE.rotulo,
  titulo: txt(inner(sE.h2, 'h2')),
  introducao: { ...txt(at(nEL, /class="lead">(.*)<\/p>/)), origem: origem(nEL, 'section.aula(§ Ex) p.lead') },
  total_na_fonte: exercicios.length,
  prosa_declara: at(sE.h2, /(Dez exercícios)/),
  aulas_cobertas_por_tag: [...new Set(exercicios.flatMap((e) => e.vinculo_declarado ?? []))].sort(),
  aulas_sem_exercicio: Array.from({ length: 10 }, (_, k) => `aula-03-${pad(k + 1)}`).filter((a) => !exercicios.some((e) => (e.vinculo_declarado ?? []).includes(a))),
  soltos_P9: exercicios.filter((e) => e.solto_P9).map((e) => e.id),
  itens: exercicios,
  codigo_atual: `Os ${codeActs.length} exercícios estão em alexandria-modulo-03-content.ts (9 em MODULO_03_AULAS, 1 em MODULO_03_EXERCICIOS_SOLTOS). Ver comparacao_codigo por item.`,
};
if (exercicios.length !== 10) fail('ex');

// ── § Ref ───────────────────────────────────────────────────
const sR = secao('§ Ref');
const nRL = find(/class="lead"/, sR.start, sR.end);
const refH4 = findAll(/<h4>/, sR.start, sR.end);
let refK = 0;
const referencias = refH4.map((h, gi) => {
  const nU = find(/<ul/, h, sR.end);
  const nUE = find(/<\/ul>/, nU);
  return {
    grupo: inner(h, 'h4'),
    origem: origem(h, 'section.aula(§ Ref) h4'),
    itens: findAll(/<li/, nU, nUE).map((n) => {
      refK++;
      const h0 = inner(n, 'li');
      const dom = h0.match(/<span class="mono"[^>]*>(.*?)<\/span>/);
      const strongs = [...h0.matchAll(/<strong>(.*?)<\/strong>/g)].map((m) => decode(m[1]));
      const obras = [...h0.matchAll(/<i>(.*?)<\/i>/g)].map((m) => decode(m[1]));
      const semDom = dom ? h0.replace(dom[0], '') : h0;
      const dataM = stripTags(h0).match(/\b(\d{2}\/\d{2}\/\d{4})\b/);
      return {
        id: `m03-ref-${pad(refK)}`, tipo: 'referencia', grupo: gi === 0 ? 'fontes_primarias_instituicoes' : 'canonicos_internacionais',
        ...txt(h0),
        titulos_em_negrito: strongs,
        obras_em_italico: obras.length ? obras : null,
        instituicao_ou_autor: strongs[0].split(/ — /)[0],
        descricao_verbatim: stripTags(semDom).replace(/^.*? · /, ''),
        dominio_citado: dom ? decode(dom[1]) : null,
        url: null,
        tipo_fonte: gi === 0 ? null : null,
        data: dataM ? { texto: dataM[1], sentido: 'data do DOU citada junto ao domínio (publicação da portaria), não data de acesso' } : null,
        origem: origem(n, 'section.aula(§ Ref) ul > li'),
        vinculos: { aulas_citadas_em_prosa: (stripTags(h0).match(/Aulas? \d\d(?:[–-]\d\d)?|INST·[\d, e]+/g) || []), nota: 'Citação em prosa, não tag.' },
      };
    }),
  };
});
const refFlat = referencias.flatMap((g) => g.itens);
const refObj = {
  id: 'm03-referencias', tipo: 'referencias', camada: 'fonte',
  marcador: sR.num, rotulo_marcador: sR.rotulo,
  titulo: txt(inner(sR.h2, 'h2')),
  introducao: { ...txt(at(nRL, /class="lead">(.*)<\/p>/)), origem: origem(nRL, 'section.aula(§ Ref) p.lead') },
  total: refFlat.length,
  total_por_grupo: referencias.map((g) => ({ grupo: g.grupo, itens: g.itens.length })),
  sem_dominio: refFlat.filter((r) => !r.dominio_citado).map((r) => r.id),
  grupos: referencias,
  nota_campos: 'url = null em todos: a fonte só escreve domínio/caminho em span.mono (ex.: "gov.br/aneel › SIGA"), sem href. tipo_fonte não é declarado. Campos D5 (o que responde/não responde, recorte, última verificação) não existem na fonte.',
  codigo_atual: refFlat.some((x) => ts.includes(x.descricao_verbatim.slice(0, 50))) ? 'presente' : 'Não extraído como lista de referências. "RALIE" aparece só dentro de um callout da Aula 01 (corpo). Kirschen/MacKay aparecem em src/lib/curriculum/entries/* com citação própria, não a do M03.',
};

// ── § Lex ───────────────────────────────────────────────────
const sL = secao('§ Lex');
const nLP = find(/^\s*<p>/, sL.start, sL.end);
const glossCode = [...glossTs.matchAll(/\{\s*id: "(gl-m03-[^"]+)",\s*term: (".*?"),\s*unit: (".*?"),\s*definition:\s*(".*?"),\s*aulaIds: \[(.*?)\],?\s*\}/gs)]
  .map((m) => ({ id: m[1], term: JSON.parse(m[2]), unit: JSON.parse(m[3]), definition: JSON.parse(m[4]), aulaIds: [...m[5].matchAll(/"(.*?)"/g)].map((x) => x[1]) }));
const termos = findAll(/<details class="glossary-item">/, sL.start, sL.end).map((n, i) => {
  const m = ln(n + 1).match(/<span class="term">(.*?)<\/span><span class="unit">(.*?)<\/span>/);
  const def = at(n + 2, /glossary-content">(.*)<\/div>/);
  const termo = decode(m[1]);
  const c = glossCode.find((x) => x.term === termo) ?? glossCode.find((x) => decode(x.term) === termo);
  return {
    id: `m03-lex-${pad(i + 1)}`, tipo: 'termo-de-glossario', camada: 'fonte',
    termo, etiqueta: decode(m[2]),
    definicao_html: collapse(def), definicao_texto: stripTags(def),
    origem: origem(n + 1, 'section.aula(§ Lex) details.glossary-item'),
    vinculos: { aulas_declaradas: [], nota: 'A fonte não liga termo a aula. aulaIds do código são âncora estrutural da Wave 34 (título/subtítulo/cabeçalho), não declaração da fonte.' },
    comparacao_codigo: c ? {
      status: c.term === termo && c.unit === decode(m[2]) && c.definition === collapse(def) ? 'identico' : 'divergente',
      campos: { term: c.term === termo, unit: c.unit === decode(m[2]), definition: c.definition === collapse(def) },
      id_codigo: c.id, aulaIds_codigo: c.aulaIds,
    } : { status: 'ausente_no_codigo' },
  };
});
const nomes = termos.map((t) => t.termo);
const ordenado = [...nomes].sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
const glossario = {
  id: 'm03-glossario', tipo: 'glossario', camada: 'fonte',
  marcador: sL.num, rotulo_marcador: sL.rotulo,
  titulo: txt(inner(sL.h2, 'h2')),
  introducao: { ...txt(inner(nLP, 'p')), origem: origem(nLP, 'section.aula(§ Lex) > p') },
  contagem: { markup: termos.length, prosa: at(nLP, /^\s*<p>(Sessenta e três) termos/), prosa_numero: 63, confere: termos.length === 63, codigo_gl_m03: glossCode.length },
  ordem_fonte_alfabetica: { ordenada: nomes.every((t, k) => t === ordenado[k]), quebras: nomes.map((t, k) => (t !== ordenado[k] ? { posicao: k + 1, fonte: t, alfabetica: ordenado[k] } : null)).filter(Boolean) },
  termos,
  codigo_atual: {
    arquivo: CODE.glossario,
    total_gl_m03: glossCode.length,
    identicos: termos.filter((t) => t.comparacao_codigo.status === 'identico').length,
    divergentes: termos.filter((t) => t.comparacao_codigo.status === 'divergente').map((t) => ({ termo: t.termo, campos: t.comparacao_codigo.campos })),
    faltam_no_codigo: termos.filter((t) => t.comparacao_codigo.status === 'ausente_no_codigo').map((t) => t.termo),
    sobram_no_codigo: glossCode.filter((c) => !nomes.includes(c.term)).map((c) => c.term),
    com_aulaIds: glossCode.filter((c) => c.aulaIds.length).map((c) => ({ term: c.term, aulaIds: c.aulaIds })),
  },
};

// ── divergências (fonte × fonte; fonte × código) ────────────
const q = (id) => perguntas.find((p) => p.id === id);
const divergencias = [
  {
    id: 'div-m03-ap-01-criterio-P18',
    tema: 'Limiar do quiz × mensagens do script × checklist',
    leituras: [
      { onde: `§ Quiz > p (L${nQP})`, literal: stripTags(inner(nQP, 'p')) },
      { onde: `<script> QUIZ (L${nScore}–${nScore + 3})`, literal: faixas.map((f) => `[${f.intervalo}] ${f.mensagem}`).join(' / '), nota_literal: 'mensagens do script separadas por " / " (separador desta extração); o prefixo entre colchetes é a faixa de acertos derivada do if/else por esta extração, não texto exibido' },
      { onde: `§ Final > p (L${nFP})`, literal: stripTags(inner(nFP, 'p')) },
    ],
    leitura_de_contexto: '7 acertos → "avance para o próximo módulo" (abaixo do 8/10); 8 acertos → mesma mensagem de revisão; só ≥9 → "Pronto para o Módulo 04".',
    decisao: 'não escolhida (P18)',
  },
  {
    id: 'div-m03-ap-02-erro-n5',
    tema: 'Referência a "erro nº 5 da tabela de mitos"',
    leituras: [
      { onde: `Ex · 08 gabarito (L${linhaDe('Confundir os dois produtos é confundir MW com MWh')})`, literal: 'Confundir os dois produtos é confundir MW com MWh — o erro nº 5 da tabela de mitos.' },
      { onde: `Quiz Q09 feedback (L${linhaDe('Confundir MW com MWh é o erro nº 5 da tabela de mitos')})`, literal: 'Confundir MW com MWh é o erro nº 5 da tabela de mitos' },
      { onde: `§ Erros, linha 5 da tabela (L${linhaDe('X gigawatts instalados')})`, literal: stripTags(ln(linhaDe('X gigawatts instalados')).replace(/<\/td>\s*<td[^>]*>/g, ' | ')), nota_literal: 'células da linha unidas por " | " (separador desta extração)' },
    ],
    leitura_de_contexto: 'Confere: o 5º mito é o de MW × MWh. Registrado porque a referência depende da ORDEM da tabela; reordenar os mitos na camada de produto quebraria a remissão.',
    decisao: 'sem conflito; dependência de ordem registrada',
  },
  {
    id: 'div-m03-ap-03-angra-1-4-gw',
    tema: 'Potência de Angra 3 no distrator do quiz × corpo',
    leituras: [
      { onde: `Quiz Q08 alternativa D (L${linhaDe(q('m03-quiz-q08').alternativas[3].texto)})`, literal: q('m03-quiz-q08').alternativas[3].texto },
      { onde: `Aula 08 (L${linhaDe('<strong>Angra 1</strong> (640 MW')})`, literal: stripTags(ln(linhaDe('<strong>Angra 1</strong> (640 MW'))).match(/Angra 1 \(640 MW[^)]*\) e Angra 2 \(1\.350 MW[^)]*\)/)[0], nota: 'A aula dá a potência de Angra 1 e Angra 2 e não declara a de Angra 3 (anotação desta extração).' },
    ],
    leitura_de_contexto: 'O número "1,4 GW" (Angra 3) só aparece no distrator errado do quiz; não há outra ocorrência na fonte. Não é contradição, é número sem âncora no texto.',
    decisao: 'registrado; verificação autoritativa se for exibido fora do distrator',
  },
  {
    id: 'div-m03-ap-04-perda-bateria',
    tema: 'Perda do ciclo de bateria: 10–15% × "uns dez por cento" × 85–90% de eficiência',
    leituras: [
      { onde: '§ Erros, mito 6', literal: 'perdendo ~10–15% no caminho' },
      { onde: '§ Voz, roteiro (parágrafo 5)', literal: 'perdendo uns dez por cento no caminho' },
      { onde: 'Aula 09 lead / Lex "Eficiência de ciclo"', literal: 'eficiência de ciclo completo de 85–90% para lítio / 85–90% típico em lítio' },
      { onde: 'INST · 07 script L3200', literal: 'var carga = E / eff;' },
      { onde: 'INST · 07 script L3201', literal: 'var perda = carga - E;' },
      { onde: 'Ex · 08 gabarito (L2348)', literal: 'consome 400 ÷ 0,88 ≈ 455 MWh; perde ≈ 55 MWh/dia em calor.' },
    ],
    leitura_de_contexto: 'Duas bases diferentes: 10–15% da energia consumida (1 − eff) e ~13,6% sobre a energia entregue (1/eff − 1). A fonte usa as duas sem dizer qual é a base.',
    decisao: 'não escolhida; content QA (P20)',
  },
  {
    id: 'div-m03-ap-05-caso-parte-3',
    tema: 'Caso com "Parte 3" declarada × P17',
    leituras: [
      { onde: `case-tag L${nTag}`, literal: caso.etiqueta.texto },
      { onde: `lead L${nLead}`, literal: caso.lead.texto.slice(0, 110) + '…' },
      { onde: `checklist item 18 (L${checkItens[17].origem.linha_aprox})`, literal: checkItens[17].texto },
    ],
    leitura_de_contexto: 'A fonte do M03 numera o caso como terceira parte de uma série que atravessa módulos. P17 (decisão do M01) proíbe "Parte" como estrutura de interface; o texto da fonte fica intacto aqui.',
    decisao: 'camada de produto aplica P17',
  },
  {
    id: 'div-m03-ap-06-lex-codigo',
    tema: 'Glossário: fonte × alexandria-glossario.ts',
    leituras: [
      { onde: '§ Lex', medido: `${termos.length} termos` },
      { onde: 'código gl-m03-*', medido: `${glossCode.length} verbetes; ${glossario.codigo_atual.identicos} idênticos; divergentes: ${glossario.codigo_atual.divergentes.length}; faltam: ${glossario.codigo_atual.faltam_no_codigo.length}` },
    ],
    leitura_de_contexto: 'Medido programaticamente campo a campo (term, unit, definition).',
    decisao: 'informativo',
  },
  {
    id: 'div-m03-ap-07-ex-codigo',
    tema: 'Exercícios: fonte × código',
    leituras: [
      { onde: '§ Ex', medido: `${exercicios.length} exercícios; tag plural Ex·03 (Aulas 02–03); Ex·10 Síntese solto` },
      { onde: 'alexandria-modulo-03-content.ts', medido: exercicios.map((e) => `${e.comparacao_codigo.id_codigo}@${e.comparacao_codigo.local_codigo}: prompt ${e.comparacao_codigo.prompt_identico ? '=' : '≠'}, gabarito ${e.comparacao_codigo.gabarito_identico ? '=' : '≠'}`).join('; ') },
    ],
    leitura_de_contexto: 'Ex·03 no código só na aula-03-02 (a fonte declara 02 e 03). points: 1 sem origem. Mecânica "Revelar gabarito" da fonte revela direto, sem tentativa registrada.',
    decisao: 'registrado (P8/P9)',
  },
  {
    id: 'div-m03-ap-08-badges-linhas',
    tema: 'Badges do M03 citam linha e texto do checklist',
    leituras: checkItens.filter((x) => x.codigo_badge).map((x) => ({ onde: `${x.codigo_badge.id}`, medido: `linha citada L${x.codigo_badge.linha_citada} (fonte L${x.origem.linha_aprox}; confere=${x.codigo_badge.linha_confere}); criterion literal=${x.codigo_badge.criterion_literal}` })),
    leitura_de_contexto: 'Verificação de proveniência dos 3 badges que usam itens do checklist.',
    decisao: 'informativo',
  },
];

writeJson('aparato.json', {
  schema: 'alexandria-v2/extraction/aparato@1',
  modulo: 'm03', grupo: 'aparato', camada: 'fonte',
  fonte: { arquivo: SRC, linhas_total: TOTAL_LINHAS, somente_leitura: true },
  gerado_em: hoje,
  metodo: 'extratores/m03_aparato.mjs — seções por .aula-marker; quiz avaliado em vm a partir do literal `const questions = [...]`; comparação com o código por regex + JSON.parse dos literais TS.',
  convencoes: { linha_aprox: `linha 1-based (${TOTAL_LINHAS} linhas)`, null: 'ausência medida, sempre com nota', html: 'inline preservado, espaços colapsados', texto: 'sem tags, entidades decodificadas' },
  caso, avaliacao, checklist_final, exercicios: exIdx, referencias: refObj, glossario, divergencias,
});
console.log('ok aparato', {
  dados: caso.dados.length, leituras: caso.leitura_estruturada.length, pedidos: caso.o_que_pedir_ao_cliente.itens.length,
  quiz: perguntas.length, gab: avaliacao.distribuicao_gabarito, check: checkItens.length, p14: checklist_final.itens_orais_ou_cronometrados_P14.length,
  ex: exercicios.length, soltos: exIdx.soltos_P9, semEx: exIdx.aulas_sem_exercicio, ref: refFlat.length, grupos: refObj.total_por_grupo, semDom: refObj.sem_dominio,
  lex: termos.length, lexCode: glossCode.length, ordem: glossario.ordem_fonte_alfabetica,
});
console.log(JSON.stringify(glossario.codigo_atual, null, 1).slice(0, 3000));
console.log(JSON.stringify(exercicios.map((e) => e.comparacao_codigo)));
console.log(JSON.stringify(checkItens.filter((x) => x.codigo_badge).map((x) => x.codigo_badge)));
