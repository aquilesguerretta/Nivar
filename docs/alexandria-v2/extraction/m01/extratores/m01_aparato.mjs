// Extrator deterministico do aparato do M01. Le a fonte (so leitura) e escreve aparato.json.
import fs from 'node:fs';

const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const GLO = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/src/lib/data/alexandria-glossario.ts';
const CON = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/src/lib/data/alexandria-modulo-01-content.ts';
const OUT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/docs/alexandria-v2/extraction/m01/aparato.json';

const html = fs.readFileSync(SRC, 'utf8');
const lineOf = (idx) => html.slice(0, idx).split('\n').length;
const decode = (s) => s
  .replace(/&nbsp;/g, '\u00a0').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const texto = (s) => decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const inner = (s) => s.replace(/\s+/g, ' ').trim();
const ini = (s) => texto(s).slice(0, 60);

// secao por marcador
function secao(num) {
  const m = html.indexOf(`<span class="num">${num}</span>`);
  if (m < 0) throw new Error('secao ' + num);
  const start = html.lastIndexOf('<section class="aula">', m);
  const end = html.indexOf('</section>', m);
  return { start, end, body: html.slice(start, end) };
}
function all(re, s, base) {
  const out = []; let m; re.lastIndex = 0;
  while ((m = re.exec(s))) out.push({ m, idx: base + m.index });
  return out;
}
const origem = (sel, trecho, idx) => ({ seletor: sel, trecho_inicial: trecho, linha_aprox: lineOf(idx) });

// ---------------- CASO ----------------
const caso = secao('§ Caso');
const cb = caso.body, cbase = caso.start;
const pick = (re) => { const r = re.exec(cb); if (!r) throw new Error('caso ' + re); return { v: r[1], idx: cbase + r.index }; };
const casoTitulo = pick(/<h2 class="aula-title">([\s\S]*?)<\/h2>/);
const casoLead = pick(/<p class="lead">([\s\S]*?)<\/p>/);
const casoTag = pick(/<div class="case-tag">([\s\S]*?)<\/div>/);
const casoH3 = pick(/<h3[^>]*>([\s\S]*?)<\/h3>/);
const casoAviso = pick(/<div class="case-body">\s*<p>([\s\S]*?)<\/p>/);
const dados = all(/<div class="case-data-cell">\s*<div class="lbl">([\s\S]*?)<\/div>\s*<div class="val( alert)?">([\s\S]*?)<\/div>/g, cb, cbase)
  .map(({ m, idx }, i) => ({
    id: `m01-caso-a-dado-${String(i + 1).padStart(2, '0')}`,
    tipo: 'dado-do-caso',
    rotulo: texto(m[1]), valor: texto(m[3]),
    marcado_como_alerta_na_fonte: !!m[2],
    origem: origem('section.aula(§ Caso) .case-data-cell', texto(m[1]), idx),
  }));
const leituras = all(/<p><strong>([^<]*?)<\/strong>\s*—\s*([\s\S]*?)<\/p>/g, cb, cbase)
  .map(({ m, idx }, i) => ({
    id: `m01-caso-a-leitura-${String(i + 1).padStart(2, '0')}`,
    tipo: 'leitura-estruturada',
    dimensao: texto(m[1]),
    html: inner(m[0].replace(/^<p>/, '').replace(/<\/p>$/, '')),
    texto: texto(m[0]),
    origem: origem('section.aula(§ Caso) .case-body > p (após h4 "Leitura estruturada")', ini(m[0]), idx),
  }));
const h4s = all(/<h4>([\s\S]*?)<\/h4>/g, cb, cbase).map(({ m, idx }) => ({ texto: texto(m[1]), linha_aprox: lineOf(idx) }));
const callout = pick(/<div class="callout gold">\s*<div class="callout-label">([\s\S]*?)<\/div>\s*<p>([\s\S]*?)<\/p>/);
const calloutFull = /<div class="callout gold">\s*<div class="callout-label">([\s\S]*?)<\/div>\s*<p>([\s\S]*?)<\/p>/.exec(cb);
const ulM = /<h4>O que pedir[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/.exec(cb);
const pedidos = all(/<li[^>]*>([\s\S]*?)<\/li>/g, ulM[1], cbase + ulM.index + ulM[0].indexOf(ulM[1]))
  .map(({ m, idx }, i) => ({
    id: `m01-caso-a-pedido-${String(i + 1).padStart(2, '0')}`,
    tipo: 'dado-a-pedir-ao-cliente',
    texto: texto(m[1]),
    origem: origem('section.aula(§ Caso) .case-body > ul > li', texto(m[1]).slice(0, 60), idx),
  }));

const casoObj = {
  id: 'm01-caso-operacao-a',
  tipo: 'caso',
  marcador: '§ Caso',
  rotulo_marcador: 'Aplicação prática',
  titulo: { html: inner(casoTitulo.v), texto: texto(casoTitulo.v) },
  parte: null,
  nota_parte: 'A fonte do M01 não divide o caso em partes: não há "Parte 1", "Parte 2" nem qualquer numeração de parte no markup ou na prosa (varredura por /parte ?[0-9I]/i: zero ocorrências). O caso inteiro está numa única section. O rótulo "Parte 1" do brief não existe na fonte; o conteúdo abaixo é o caso completo.',
  lead: { html: inner(casoLead.v), texto: texto(casoLead.v), origem: origem('section.aula(§ Caso) p.lead', ini(casoLead.v), casoLead.idx) },
  etiqueta: { texto: texto(casoTag.v), origem: origem('.case-study .case-header .case-tag', texto(casoTag.v), casoTag.idx) },
  subtitulo: { texto: texto(casoH3.v), origem: origem('.case-study .case-header h3', texto(casoH3.v), casoH3.idx) },
  aviso_ficcao: { texto: texto(casoAviso.v), origem: origem('.case-study .case-body > p (primeiro)', ini(casoAviso.v), casoAviso.idx) },
  dados,
  cabecalhos_internos: h4s,
  leitura_estruturada: leituras,
  linguagem_recomendada: {
    id: 'm01-caso-a-linguagem',
    tipo: 'callout',
    rotulo: texto(calloutFull[1]),
    html: inner(calloutFull[2]),
    texto: texto(calloutFull[2]),
    origem: origem('.case-body .callout.gold', texto(calloutFull[1]), callout.idx),
  },
  o_que_pedir_ao_cliente: pedidos,
  perguntas: null,
  nota_perguntas: 'A fonte não formula perguntas ao learner dentro do caso. Os únicos enunciados são os cabeçalhos h4 "Leitura estruturada" e "O que pedir ao cliente antes de prosseguir"; ambos já vêm resolvidos pela própria fonte (leitura feita, lista dada). Nada foi convertido em pergunta.',
  decisao_pedida: null,
  nota_decisao: 'A fonte não pede decisão ao learner. O caso termina na lista de dados a pedir; a "decisão" implícita (não prometer economia antes de 12 faturas) é dita pela fonte como conclusão, no callout "Linguagem GridAlpha para esse caso", e não como escolha a registrar. Relevante para bar C8 ("o caso termina em decisão"): a decisão, se existir no v2, terá de ser derivada (P3/P11) e revisada — não está no HTML.',
  vinculos: {
    aulas_declaradas: [],
    nota: 'O caso não aponta aula por tag. Conceitos usados (demanda, fator de carga, fator de potência 0,92, Grupo A4) pertencem às Aulas 05, 06 e 07 por conteúdo, mas a fonte não declara o vínculo — não inferido aqui.',
    termos_citados_que_existem_no_glossario_m01: null,
    instrumento: null,
  },
  origem: origem('section.aula > .aula-marker "§ Caso"', 'Operação A — leitura de uma fatura industrial.', caso.start),
  codigo_atual: 'Não extraído. Nenhum arquivo em src/lib/data contém "Operação A" (grep). Dependência bar §9 "Caso ... só no HTML".',
};

// ---------------- QUIZ ----------------
const quiz = secao('§ Quiz');
const qb = quiz.body;
const qIntro = /<h2 class="aula-title">([\s\S]*?)<\/h2>\s*<p>([\s\S]*?)<\/p>/.exec(qb);
const qStart = html.indexOf('const questions = [');
const qEnd = html.indexOf('];', qStart) + 2;
const questions = new Function(html.slice(qStart, qEnd) + '; return questions;')();
// linha de cada pergunta
let cursor = qStart;
const perguntas = questions.map((q, i) => {
  const at = html.indexOf('q: ' + JSON.stringify(q.q), cursor);
  cursor = at + 1;
  const letras = ['A', 'B', 'C', 'D', 'E', 'F'];
  return {
    id: `m01-quiz-q${String(i + 1).padStart(2, '0')}`,
    tipo: 'questao-multipla-escolha',
    rotulo_fonte: `Pergunta ${String(i + 1).padStart(2, '0')} / 10`,
    enunciado: q.q,
    alternativas: q.options.map((o, k) => ({ letra: letras[k], indice: k, texto: o })),
    gabarito: { indice: q.correct, letra: letras[q.correct], texto: q.options[q.correct] },
    explicacao: q.feedback,
    nota_explicacao: 'A fonte mostra o mesmo feedback para acerto e erro (fb.textContent = q.feedback), depois de travar as alternativas.',
    vinculos: { aulas_declaradas: [], nota: 'A fonte não associa questão a aula.' },
    origem: origem('<script> const questions[' + i + ']', q.q.slice(0, 60), at),
  };
});
const scoreRe = /if \(correct >= 9\)[\s\S]*?else scoreMsg\.textContent = '[^']*';/;
const scoreM = scoreRe.exec(html);
const faixas = [];
{
  const r = /(?:else )?(?:if \(correct >= (\d+)\) )?scoreMsg\.textContent = '([^']*)';/g; let m;
  while ((m = r.exec(scoreM[0]))) faixas.push({ condicao: m[1] ? `correct >= ${m[1]}` : 'else (correct <= 4)', minimo: m[1] ? +m[1] : 0, mensagem: m[2] });
}
faixas[0].intervalo = '9–10'; faixas[1].intervalo = '7–8'; faixas[2].intervalo = '5–6'; faixas[3].intervalo = '0–4';
const quizObj = {
  id: 'm01-quiz',
  tipo: 'avaliacao-do-modulo',
  marcador: '§ Quiz',
  rotulo_marcador: 'Verificação interativa de domínio',
  titulo: { html: inner(qIntro[1]), texto: texto(qIntro[1]) },
  introducao: { html: inner(qIntro[2]), texto: texto(qIntro[2]), origem: origem('section.aula(§ Quiz) > p', ini(qIntro[2]), quiz.start + qIntro.index) },
  mecanica_fonte: 'Uma tentativa por questão (a questão trava após o primeiro clique); a alternativa correta é destacada e o feedback aparece imediatamente; o placar só aparece quando as 10 foram respondidas. Sem reinício, sem persistência (nada em localStorage). Cor verde/vermelho marca acerto/erro (conflita com bar S2/C7 — registro, não decisão).',
  total_questoes: perguntas.length,
  criterio_literal_prosa: {
    texto: texto(qIntro[2]).match(/O critério de domínio[^.]*\./)[0],
    origem: origem('section.aula(§ Quiz) > p > strong', '8 de 10', quiz.start + qIntro.index),
  },
  faixas_de_placar_script: {
    faixas,
    origem: origem('<script> QUIZ: if (correct >= 9) ... else', "if (correct >= 9) scoreMsg.textContent = 'Domínio sólido...", scoreM.index),
  },
  perguntas,
  codigo_atual: 'Não extraído. Nenhum arquivo em src/lib/data contém o quiz do M01 (grep "quiz"). bar §9: "Avaliação do módulo (quiz) — Só no HTML; critério do M01 contraditório (P5)".',
};

// ---------------- CHECKLIST ----------------
const chk = secao('§ Final');
const kb = chk.body;
const kIntro = /<h2 class="aula-title">([\s\S]*?)<\/h2>\s*<p>([\s\S]*?)<\/p>/.exec(kb);
const itens = all(/<div class="checklist-item"><div class="check"><\/div><div class="text">([\s\S]*?)<\/div><\/div>/g, kb, chk.start)
  .map(({ m, idx }, i) => ({
    id: `m01-checklist-${String(i + 1).padStart(2, '0')}`,
    tipo: 'item-de-checklist',
    html: inner(m[1]),
    texto: texto(m[1]),
    origem: origem('#checklist .checklist-item .text', texto(m[1]).slice(0, 60), idx),
    vinculos: { aulas_declaradas: [], nota: 'A fonte não associa item a aula.' },
  }));
const chkObj = {
  id: 'm01-checklist-final',
  tipo: 'checklist-final',
  marcador: '§ Final',
  rotulo_marcador: 'Checklist de domínio',
  titulo: { html: inner(kIntro[1]), texto: texto(kIntro[1]) },
  introducao: { html: inner(kIntro[2]), texto: texto(kIntro[2]), origem: origem('section.aula(§ Final) > p', ini(kIntro[2]), chk.start + kIntro.index) },
  mecanica_fonte: 'Clique alterna a classe .checked no item (script "CHECKLIST: toggle on click"). Sem persistência, sem contagem, sem gatilho ao completar.',
  total_itens: itens.length,
  itens,
  itens_orais_ou_cronometrados_P14: itens.filter((x) => /30 segundos/.test(x.texto)).map((x) => ({ id: x.id, motivo: 'contém critério cronometrado literal ("em 30 segundos")' })),
  nota_P14: 'Todos os 16 itens são desempenho verbal/manual declarado pelo learner ("sem consultar nenhum material"); nenhum é verificável automaticamente. Só o item 01 tem tempo explícito. Classificação oral/não oral dos demais fica para revisão — não decidida aqui.',
  codigo_atual: 'Não extraído (grep "checklist" em src/lib/data só acha a palavra dentro de um parágrafo da Aula 09 sobre a triagem PQA — outra coisa).',
};

// ---------------- EXERCICIOS ----------------
const dr = secao('§ Drill');
const db = dr.body;
const dIntro = /<h2 class="aula-title">([\s\S]*?)<\/h2>\s*<p>([\s\S]*?)<\/p>/.exec(db);
const exs = all(/<div class="exercise">\s*<div class="exercise-header"><span class="exercise-tag">([\s\S]*?)<\/span><\/div>\s*<div class="exercise-question">([\s\S]*?)<\/div>\s*<button[^>]*>[\s\S]*?<\/button>\s*<div class="exercise-answer">([\s\S]*?)<\/div>\s*<\/div>/g, db, dr.start)
  .map(({ m, idx }) => {
    const tag = texto(m[1]);
    const aula = /Aula (\d\d)/.exec(tag);
    const n = /Ex · (\d\d)/.exec(tag)[1];
    const gabParas = all(/<p[^>]*>([\s\S]*?)<\/p>/g, m[3], 0).map(({ m: p }) => inner(p[1]));
    return {
      id: `m01-ex-${n}`,
      tipo: 'exercicio-com-gabarito',
      tag,
      solto_P9: !aula,
      aula_declarada: aula ? `aula-01-${aula[1]}` : null,
      enunciado: { html: inner(m[2]), texto: texto(m[2]) },
      gabarito: { paragrafos_html: gabParas, texto: texto(m[3]) },
      origem: origem('section.aula(§ Drill) .exercise .exercise-tag', tag, idx),
    };
  });
const soltos = exs.filter((e) => e.solto_P9);
const exObj = {
  id: 'm01-drill',
  tipo: 'bloco-de-exercicios',
  marcador: '§ Drill',
  rotulo_marcador: 'Exercícios com gabarito',
  titulo: { html: inner(dIntro[1]), texto: texto(dIntro[1]) },
  introducao: { html: inner(dIntro[2]), texto: texto(dIntro[2]), origem: origem('section.aula(§ Drill) > p', ini(dIntro[2]), dr.start + dIntro.index) },
  criterio_literal_prosa: texto(dIntro[2]).match(/O critério de domínio[^.]*\./)[0],
  total_na_fonte: exs.length,
  aulas_cobertas_por_tag: [...new Set(exs.filter((e) => e.aula_declarada).map((e) => e.aula_declarada))].sort(),
  soltos_P9: soltos,
  vinculados_a_aula_indice: exs.filter((e) => !e.solto_P9).map((e) => ({ id: e.id, tag: e.tag, aula_declarada: e.aula_declarada, origem: e.origem })),
  nota_vinculados: 'Os 7 exercícios com tag de aula pertencem ao grupo de aulas (não a este). Aqui ficam só como índice, para contagem e para o critério "seis dos oito". Texto completo deles já está em src/lib/data/alexandria-modulo-01-content.ts (activities das aulas).',
  codigo_atual: 'Ex·08 extraído como MODULO_01_SINTESE (id "ex-08", kind "discursiva"), fora de aula — coerente com P9. Os 7 com tag estão nas activities das aulas 01, 02, 04, 05 (×2), 07, 08.',
};

// ---------------- REFERENCIAS ----------------
const rf = secao('§ Ref');
const rb = rf.body;
const rIntro = /<h2 class="aula-title">([\s\S]*?)<\/h2>\s*<p>([\s\S]*?)<\/p>/.exec(rb);
const refs = all(/<li>([\s\S]*?)<\/li>/g, rb, rf.start).map(({ m, idx }, i) => {
  const li = m[1];
  const inst = /^<b>([\s\S]*?)<\/b>\s*·\s*/.exec(li);
  const em = /<em>([\s\S]*?)<\/em>\s*$/.exec(li);
  const corpo = li.slice(inst ? inst[0].length : 0, em ? em.index : li.length);
  return {
    id: `m01-ref-${String(i + 1).padStart(2, '0')}`,
    tipo: 'referencia',
    html: inner(li),
    texto: texto(li),
    instituicao: inst ? texto(inst[1]) : null,
    descricao_verbatim: texto(corpo),
    dominio_citado: em ? texto(em[1]) : null,
    url: null,
    tipo_fonte: null,
    data: null,
    origem: origem('section.aula(§ Ref) ul.ref-list > li', texto(li).slice(0, 60), idx),
    vinculos: { aulas_declaradas: [], nota: 'A fonte declara as referências no nível do módulo; nenhuma aponta aula.' },
  };
});
// datas literais dentro da descricao
for (const r of refs) {
  const d = /(\d{1,2} de [a-zç]+ de \d{4})/.exec(r.texto);
  r.data = d ? { texto: d[1], sentido: 'data de entrada em vigor citada na descrição (não é data de acesso nem de publicação da referência)' } : null;
  r.nota_campos = 'url: a fonte só escreve domínio em <em> (texto, sem <a href>, sem protocolo) — url fica null; dominio_citado é literal. tipo_fonte: a fonte não tipifica as referências — null (o cabeçalho da seção chama o conjunto de "Referências regulatórias e fontes primárias", sem distinguir item a item).';
}
const rCall = /<div class="callout gold">\s*<div class="callout-label">([\s\S]*?)<\/div>\s*<p>([\s\S]*?)<\/p>/.exec(rb);
const footer = /<footer class="alex-footer">([\s\S]*?)<\/footer>/.exec(html);
const refObj = {
  id: 'm01-referencias',
  tipo: 'bloco-de-referencias',
  marcador: '§ Ref',
  rotulo_marcador: 'Referências regulatórias e fontes primárias',
  titulo: { html: inner(rIntro[1]), texto: texto(rIntro[1]) },
  introducao: { html: inner(rIntro[2]), texto: texto(rIntro[2]), origem: origem('section.aula(§ Ref) > p', ini(rIntro[2]), rf.start + rIntro.index) },
  total: refs.length,
  itens: refs,
  padrao_editorial: {
    rotulo: texto(rCall[1]), html: inner(rCall[2]), texto: texto(rCall[2]),
    origem: origem('section.aula(§ Ref) .callout.gold', texto(rCall[1]), rf.start + rCall.index),
  },
  colofao_modulo: {
    texto: texto(footer[1].replace(/<br>/g, ' | ')),
    origem: origem('footer.alex-footer .footer-mono', 'Alexandria Library · GridAlpha Brasil', footer.index),
    nota: 'Única data de versão do módulo na fonte ("Maio de 2026"). Não é data de verificação das referências.',
  },
  codigo_atual: 'As 8 estão hardcoded, com o mesmo texto, em src/pages/alexandria/BibliotecaView.tsx (BIBLIOGRAFIA_MODULO_01, L97-150), com "titulo" e "descricao" separados por julgamento do extrator anterior; e 4 delas repetidas em FONTES (ONS, ANEEL, CCEE, EPE) com "publica" parafraseado no caso da ANEEL. Não estão em src/lib/data.',
};

// ---------------- GLOSSARIO ----------------
const lx = secao('§ Lex');
const lb = lx.body;
const lIntro = /<h2 class="aula-title">([\s\S]*?)<\/h2>\s*<p>([\s\S]*?)<\/p>/.exec(lb);
const termosFonte = all(/<details class="glossary-item">\s*<summary><span class="term">([\s\S]*?)<\/span><span class="unit">([\s\S]*?)<\/span><\/summary>\s*<div class="glossary-content">([\s\S]*?)<\/div>\s*<\/details>/g, lb, lx.start)
  .map(({ m, idx }) => ({ term: decode(m[1]), unit: decode(m[2]), definition_html: m[3], idx }));
const rawCount = (lb.match(/class="glossary-item"/g) || []).length;

// codigo: primeiros verbetes ate o primeiro gl-m02-
const ts = fs.readFileSync(GLO, 'utf8');
const entRe = /\{\s*id: "([^"]+)",\s*term: "((?:[^"\\]|\\.)*)",\s*unit: "((?:[^"\\]|\\.)*)",\s*definition:\s*"((?:[^"\\]|\\.)*)",\s*aulaIds: \[([^\]]*)\],?\s*\}/g;
const code = []; let em;
while ((em = entRe.exec(ts))) {
  if (em[1].startsWith('gl-m02-')) break;
  code.push({ id: em[1], term: JSON.parse('"' + em[2] + '"'), unit: JSON.parse('"' + em[3] + '"'), definition: JSON.parse('"' + em[4] + '"'), aulaIds: em[5].split(',').map((s) => s.trim().replace(/"/g, '')).filter(Boolean) });
}
const byTerm = new Map(code.map((c) => [c.term, c]));
const termos = termosFonte.map((t, i) => {
  const c = byTerm.get(t.term);
  const defFonte = t.definition_html.replace(/\s+/g, ' ').trim();
  let comparacao;
  if (!c) comparacao = { status: 'ausente-no-codigo' };
  else {
    const iguais = { term: c.term === t.term, unit: c.unit === t.unit, definition: c.definition === defFonte || c.definition === decode(defFonte) };
    comparacao = { status: Object.values(iguais).every(Boolean) ? 'identico' : 'diverge', campos: iguais, id_codigo: c.id, aulaIds_codigo: c.aulaIds };
    if (!iguais.definition) comparacao.definicao_codigo = c.definition;
    if (!iguais.unit) comparacao.unit_codigo = c.unit;
  }
  return {
    id: `m01-lex-${String(i + 1).padStart(2, '0')}`,
    tipo: 'termo-de-glossario',
    termo: t.term,
    etiqueta: t.unit,
    definicao_html: defFonte,
    definicao_texto: texto(defFonte),
    origem: origem('section.aula(§ Lex) details.glossary-item', t.term, t.idx),
    vinculos: { aulas_declaradas: [], nota: 'A fonte não liga termo a aula. aulaIds do código foram inferidos pela Wave 8 (varredura + leitura), não declarados pela fonte.' },
    comparacao_codigo: comparacao,
  };
});
const fonteTerms = new Set(termosFonte.map((t) => t.term));
const soNoCodigo = code.filter((c) => !fonteTerms.has(c.term)).map((c) => ({ id: c.id, term: c.term }));
const ordemFonte = termosFonte.map((t) => t.term);
const glObj = {
  id: 'm01-glossario',
  tipo: 'glossario-do-modulo',
  marcador: '§ Lex',
  rotulo_marcador: 'Glossário expansível',
  titulo: { html: inner(lIntro[1]), texto: texto(lIntro[1]) },
  introducao: { html: inner(lIntro[2]), texto: texto(lIntro[2]), origem: origem('section.aula(§ Lex) > p', ini(lIntro[2]), lx.start + lIntro.index) },
  contagem: {
    prosa_declara: 'Vinte e oito termos',
    markup_details_glossary_item: rawCount,
    extraidos_com_term_unit_content: termosFonte.length,
    codigo_bloco_m01: code.length,
    identicos: termos.filter((t) => t.comparacao_codigo.status === 'identico').length,
    divergentes: termos.filter((t) => t.comparacao_codigo.status === 'diverge').length,
    ausentes_no_codigo: termos.filter((t) => t.comparacao_codigo.status === 'ausente-no-codigo').length,
    so_no_codigo: soNoCodigo,
  },
  ordem_fonte_alfabetica: ordemFonte.every((t, i) => i === 0 || ordemFonte[i - 1].localeCompare(t, 'pt-BR') <= 0),
  termos,
  codigo_atual: 'src/lib/data/alexandria-glossario.ts, bloco "MÓDULO 01 (Wave 8) — 38 verbetes", ids gl-<slug> sem prefixo de módulo (os M02+ usam gl-mNN-).',
};

// ---------------- OUTROS CRITERIOS (contexto p/ P5) ----------------
const hero = secao('§ 00');
const resIdx = html.indexOf('<h4>Resultado esperado ao final do módulo</h4>');
const resUl = /<ul[^>]*>([\s\S]*?)<\/ul>/.exec(html.slice(resIdx));
const resultado = all(/<li[^>]*>([\s\S]*?)<\/li>/g, resUl[1], resIdx + resUl.index + resUl[0].indexOf(resUl[1]))
  .map(({ m, idx }, i) => ({ id: `m01-resultado-${String(i + 1).padStart(2, '0')}`, texto: texto(m[1]), linha_aprox: lineOf(idx) }));

const doc = {
  schema: 'alexandria-v2/extraction/aparato@1',
  modulo: 'M01',
  grupo: 'aparato',
  fonte: { arquivo: SRC, linhas_total: html.split('\n').length, bytes: Buffer.byteLength(html) },
  gerado_em: new Date().toISOString().slice(0, 10),
  metodo: 'Extração programática (node, regex escopada por section .aula-marker; quiz lido avaliando o literal `const questions = [...]` do <script>). Nenhum texto digitado à mão. Campos `html` preservam o inline da fonte com espaços colapsados; campos `texto` têm tags removidas e entidades decodificadas.',
  convencoes: {
    linha_aprox: 'linha 1-based no HTML-fonte, do início do elemento',
    null: 'ausência na fonte; cada null tem nota ao lado',
  },
  caso: casoObj,
  avaliacao: quizObj,
  checklist_final: chkObj,
  exercicios: exObj,
  referencias: refObj,
  glossario: glObj,
  divergencias: [
    {
      id: 'div-m01-criterio-P5',
      tema: 'Critério de domínio/conclusão do módulo — contradição citada em bar P5 e §9',
      leituras: [
        { onde: `§ Drill > p (L${lineOf(dr.start + dIntro.index)})`, literal: exObj.criterio_literal_prosa, sentido: 'domínio = ≥ 6 de 8 exercícios sem consulta' },
        { onde: `§ Quiz > p (L${lineOf(quiz.start + qIntro.index)})`, literal: quizObj.criterio_literal_prosa.texto, sentido: 'domínio = ≥ 8 de 10 no quiz' },
        { onde: `<script> QUIZ (L${lineOf(scoreM.index)})`, literal: faixas.map((f) => `[${f.intervalo}] ${f.mensagem}`).join(' / '), sentido: 'só 9–10 recebe "Pronto para o Módulo 02"; 7–8 (inclui 7, abaixo do 8/10 da prosa) recebe "avance para o próximo módulo"; 8 não recebe "pronto"; o 8/10 só é repetido na faixa 0–4' },
        { onde: `§ Final > p (L${lineOf(chk.start + kIntro.index)})`, literal: texto(kIntro[2]), sentido: 'passar = 16 de 16 ações do checklist, sem consulta' },
      ],
      leitura_de_contexto: { onde: `§ 00 > h4 "Resultado esperado" (L${lineOf(resIdx)})`, literal: 'Você consegue, sem consultar nenhum material: [7 itens]', sentido: 'resultado esperado = 7 capacidades (não é limiar numérico)' },
      decisao: 'Nenhuma. P5: preservar o critério literal até a reconciliação. As quatro formulações estão guardadas verbatim; nenhuma foi escolhida como "o" critério.',
    },
    {
      id: 'div-m01-quiz-faixa-7-8',
      tema: 'Dentro do próprio script do quiz',
      leituras: [
        { literal: 'else if (correct >= 7) ... "Bom. Revise os pontos errados, depois avance para o próximo módulo."', sentido: '7 acertos autoriza avançar' },
        { literal: 'else ... "Refaça o estudo. O critério de domínio é 8/10 — sem atalho."', sentido: 'o critério é 8' },
      ],
      decisao: 'Nenhuma. Registrado.',
    },
    {
      id: 'div-m01-drill-alcance',
      tema: 'Alcance declarado dos exercícios × tags',
      leituras: [
        { onde: '§ Drill > p', literal: 'Os exercícios alcançam todas as nove aulas.', sentido: 'as 9 aulas têm exercício' },
        { onde: '.exercise-tag (×8)', literal: exs.map((e) => e.tag).join(' | '), sentido: `tags cobrem só ${exObj.aulas_cobertas_por_tag.join(', ')}; Aulas 03, 06 e 09 sem exercício com tag; Aula 05 com dois` },
      ],
      decisao: 'Markup vence para vínculo (protocolo §5); a prosa fica registrada. Ex·08 é solto (P9) e não aponta aula nenhuma.',
    },
    {
      id: 'div-m01-glossario-contagem',
      tema: 'Contagem do glossário (já registrada no protocolo §5 e no cabeçalho de alexandria-glossario.ts)',
      leituras: [
        { onde: '§ Lex > p', literal: 'Vinte e oito termos.', sentido: '28' },
        { onde: 'details.glossary-item', literal: `${rawCount} elementos`, sentido: String(rawCount) },
      ],
      decisao: 'Markup vence (38). Prosa preservada.',
    },
    {
      id: 'div-m01-trava-war-room',
      tema: 'Numeração da "Trava" de linguagem segura',
      leituras: [
        { onde: '§ 00 .callout-label (L1314)', literal: 'Linguagem segura · Trava 4 do War Room' },
        { onde: 'Aula 05 (L1823) e quiz Q10 feedback (L3150)', literal: 'fere a Trava 4 do War Room' },
        { onde: '§ Caso .case-body > p (L2192)', literal: 'Linguagem segura aplicada conforme Trava 3 do War Room.' },
      ],
      decisao: 'Nenhuma. Duas leituras: (a) o caso cita uma trava diferente (3 = ficção/anonimização?) — a fonte não define as travas; (b) erro de numeração no caso. Não resolvido. Observação: "War Room" e "Trava N" são vocabulário interno GridAlpha visível ao learner (relevante para preflight "texto interno visível").',
    },
    {
      id: 'div-m01-quiz-q05-faixa-fc',
      tema: 'Q05: FC = 0,40 cai na fronteira de duas faixas da tabela da Aula 05',
      leituras: [
        { onde: 'quiz Q05 feedback', literal: 'Esse FC indica operação com sazonalidade moderada', sentido: '0,40 ∈ faixa "0,40 – 0,70"' },
        { onde: 'Aula 05, tabela de FC (alexandria-modulo-01-content.ts L262, fonte ~L1810)', literal: '0,15 – 0,40 | Picos altos, operação concentrada, partidas simultâneas', sentido: '0,40 também ∈ faixa "0,15 – 0,40"' },
      ],
      decisao: 'Nenhuma. Fronteira fechada nos dois lados na fonte. Nota: o script do INST·04 usa limiares próprios (ver grupo de instrumentos); não comparado aqui.',
    },
    {
      id: 'div-m01-glossario-sigla-FC',
      tema: 'Mesma sigla para dois termos distintos',
      leituras: [
        { literal: 'Fator de capacidade (FC)' },
        { literal: 'Fator de carga (FC)' },
      ],
      decisao: 'Não é contradição da fonte, mas ambiguidade real: busca/âncora por "FC" no v2 não pode resolver sozinha. Registrado.',
    },
    {
      id: 'div-m01-glossario-ordem',
      tema: 'Ordem alfabética do § Lex',
      leituras: [{ literal: '"Perdas técnicas" antes de "Perdas não técnicas"', sentido: 'única quebra da ordem alfabética (pt-BR) nos 38' }],
      decisao: 'Ordem da fonte preservada no JSON.',
    },
    {
      id: 'div-m01-biblioteca-codigo',
      tema: 'Referências no código × fonte (insumo da Biblioteca)',
      leituras: [
        { onde: 'fonte § Ref item 8', literal: refs[7].texto },
        { onde: 'BibliotecaView.tsx BIBLIOGRAFIA_MODULO_01[7]', literal: "titulo: 'Canal técnico no YouTube' / descricao: 'Vídeos didáticos sobre rede elétrica, transmissão, fator de potência. Material complementar de excelência.'", sentido: 'título e descrição recortados e recapitalizados pelo extrator anterior ("com vídeos didáticos" → "Vídeos didáticos")' },
        { onde: "BibliotecaView.tsx FONTES[ANEEL].publica", literal: "'Resolução Normativa nº 1.000/2021, PRODIST e os indicadores de qualidade do fornecimento.'", sentido: 'síntese dos itens 1-3, não literal da fonte' },
        { onde: 'BibliotecaView.tsx FONTES', literal: 'nome por extenso de ANEEL ("Agência Nacional de Energia Elétrica")', sentido: 'a fonte do M01 nunca expande "ANEEL" no § Ref; a expansão vem de fora do § Ref' },
      ],
      decisao: 'Nenhuma. O JSON guarda o <li> inteiro verbatim + instituição (<b>) + domínio (<em>); título/descrição não foram separados porque a fonte não os separa (itens 1-3 têm "Título. Descrição."; itens 4-7 têm nome da instituição por extenso na posição de título; item 8 é frase corrida).',
    },
    {
      id: 'div-m01-ex07-paragrafos',
      tema: 'Ex·07 no código (fora do escopo deste grupo — só observado)',
      leituras: [
        { onde: 'fonte .exercise-answer', literal: 'três <p> (12 anos / CFO / Especialista)' },
        { onde: 'alexandria-modulo-01-content.ts L468 config.gabarito', literal: 'os três parágrafos concatenados com espaço, sem <p>' },
      ],
      decisao: 'Sem perda de texto; perda de estrutura. Para o grupo de aulas.',
    },
  ],
  contexto_criterios: {
    nota: 'Não é aparato a extrair; está aqui só para dar as quatro formulações de critério de conclusão lado a lado (divergência P5). O "Resultado esperado" completo pertence ao grupo do módulo/hero.',
    resultado_esperado_7_itens: resultado,
  },
};
fs.mkdirSync(OUT.replace(/\/[^/]+$/, ''), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(doc, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({
  dados: dados.length, leituras: leituras.length, pedidos: pedidos.length, h4s: h4s.map((h) => h.texto),
  quiz: perguntas.length, faixas, itens: itens.length, exs: exs.length, soltos: soltos.map((s) => s.tag),
  refs: refs.length, gl: glObj.contagem, ordem: glObj.ordem_fonte_alfabetica, resultado: resultado.length,
}, null, 1));
