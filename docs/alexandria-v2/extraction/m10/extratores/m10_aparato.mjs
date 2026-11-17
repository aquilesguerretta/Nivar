// Extrator do grupo "aparato" do M10 → aparato.json.
// Caso, quiz (literal do <script>), checklist final, índice de exercícios,
// referências e glossário. Nenhum texto de conteúdo digitado.
import fs from 'node:fs';
import {
  doc, FONTE, lineOf, texto, inline, frag, ini, origem, find, findAll, byClass, byTag,
  classes, hasClass, inner, secoes, blocos, writeJSON, collapse, SCRIPT, SCRIPT_START, literal, trechoScript,
} from './lib.mjs';
import { C10, GLO } from './code.mjs';

const secs = secoes();
const S = Object.fromEntries(secs.map((s) => [s.id, s]));
const pad = (n) => String(n).padStart(2, '0');
const LETRAS = ['A', 'B', 'C', 'D', 'E'];
const div = [];
const D = (id, tema, a, b, nota, linhas) => div.push({ id, tema, leitura_a: a, leitura_b: b, linhas_aprox: linhas || [], nota, decisao: 'não escolhida — registrar para reconciliação (P5/P8)' });

// ================================================================ CASO
const caso = S.caso;
const cb = blocos(caso.node, 'm10-caso');
const partes = [];
let cur = null;
for (const b of cb) {
  if (b.tipo === 'titulo') { cur = { id: `m10-caso-${b.numero.replace('.', '')}`, numero: b.numero, titulo: b.texto, titulo_eh_interrogativo: /\?$/.test(b.texto) || /^(Qual|Que|Quanto|O que|A demanda)/.test(b.texto), origem: b.origem, blocos: [] }; partes.push(cur); continue; }
  if (cur) cur.blocos.push(b);
}
const ledeCaso = cb.find((b) => b.tipo === 'lede');
const parecer = cb.filter((b) => b.tipo === 'box').pop();
const mencoesAula = [];
for (const n of findAll(caso.node, (x) => ['p', 'td'].includes(x.tag))) {
  const t = texto(inner(n));
  for (const m of t.matchAll(/\b(Aula \d+|Parte \d+|desta aula|instrumento de [a-zà-ú]+)\b/g)) mencoesAula.push({ trecho: m[0], contexto: t.slice(Math.max(0, m.index - 60), m.index + 60), linha_aprox: lineOf(n.start) });
}
const casoObj = {
  id: 'm10-caso-operacao-a',
  tipo: 'caso',
  marcador: caso.marcador,
  rotulo_marcador: caso.rotulo,
  titulo: { texto: caso.titulo, origem: origem('#caso h2', caso.h2) },
  parte: caso.rotulo,
  nota_parte: 'A fonte do M10 rotula o caso como "Parte 10" (sec-id) e o lede cita "As nove partes anteriores" e "A Parte 9". Numeração literal da fonte, que pressupõe uma série de partes em outros módulos; P17 manda não usar "Partes" da fonte como estrutura da interface.',
  lede: ledeCaso,
  dados: null,
  nota_dados: 'O caso não tem grade de dados numéricos (consumo, demanda, FP etc.). O perfil vem em prosa no lede: carga plana, turnos, submercado Sudeste/Centro-Oeste, fator de carga elevado, pouca flexibilidade.',
  secoes: partes,
  perguntas_da_fonte: partes.map((p) => ({ numero: p.numero, texto: p.titulo, termina_com_interrogacao: /\?$/.test(p.titulo) })),
  nota_perguntas: 'Os seis h3 (C.1–C.6) são títulos interrogativos respondidos no próprio texto (só C.3 termina em "?"). Não há pergunta aberta ao learner nem espaço de resposta.',
  perguntas_ao_learner: null,
  parecer: parecer,
  decisao_pedida: null,
  nota_decisao: 'A fonte entrega o parecer pronto ("O parecer da Parte 10"); não pede decisão ao learner. Desafio de decisão, se houver, é camada Alexandria (P17).',
  mencoes: mencoesAula,
  vinculos: { aula: null, nota: 'Nenhum vínculo declarado por marcação. A prosa cita "a classificação de flexibilidade da Aula 04" (C.5) e "o instrumento de reativo desta aula" (C.4), ver mencoes.' },
  origem: origem('#caso .sec-id', caso.secId),
};

// ================================================================ QUIZ
const Qlit = literal('var Q=', SCRIPT.indexOf('/* ===================== QUIZ'));
const Q = Qlit.value;
const quizLede = find(S.quiz.node, byClass('lede'));
const qStart = SCRIPT.indexOf('/* ===================== QUIZ');
const questoes = Q.map((q, i) => {
  const at = SCRIPT.indexOf(`{q:'${q.q.slice(0, 30)}`, qStart);
  return {
    id: `m10-quiz-${pad(i + 1)}`,
    numero: i + 1,
    enunciado: q.q,
    alternativas: q.o.map((o, j) => ({ indice: j, letra: LETRAS[j], texto: o })),
    gabarito: { indice: q.a, letra: LETRAS[q.a], texto: q.o[q.a] },
    explicacao: q.f,
    feedback_igual_para_acerto_e_erro: true,
    vinculo_aula: null,
    origem: { seletor: '<script> var Q[' + i + ']', trecho_inicial: q.q.slice(0, 60), linha_aprox: lineOf(SCRIPT_START + at) },
  };
});
const botoes = ['quiz-go', 'quiz-reset'].map((id) => { const n = find(doc, (x) => x.attrs?.id === id); return { dom_id: id, rotulo: texto(inner(n)), origem: origem(`#${id}`, n) }; });
const build = trechoScript('function build(){', '\n  }', qStart);
const corrigir = trechoScript('function corrigir(){', '\n  }\n', qStart);
const scoreIdx = SCRIPT.indexOf("sc.className='score show '");
const scoreBlock = SCRIPT.slice(scoreIdx, SCRIPT.indexOf("'</div>';", scoreIdx) + 9);
const msgs = [...scoreBlock.matchAll(/'((?:Critério|Abaixo)[^']*)'/g)].map((m) => m[1]);
const avaliacao = {
  id: 'm10-quiz',
  marcador: S.quiz.marcador, rotulo_marcador: S.quiz.rotulo,
  titulo: { texto: S.quiz.titulo, origem: origem('#quiz h2', S.quiz.h2) },
  lede: { ...frag(inner(quizLede)), origem: origem('#quiz p.lede', quizLede) },
  criterio_literal: [S.quiz.titulo, texto(inner(quizLede))],
  questoes,
  gabarito_resumo: Q.map((q) => LETRAS[q.a]).join(''),
  faixas_do_placar: [
    // [verificação 2026-09-17] origem acrescentada a cada faixa (mensagem é conteúdo e estava sem origem)
    { condicao: 'acertos >= 8', classe: 'pass', mensagem: msgs[0], origem: { seletor: '<script> corrigir() · ramo acertos>=8', trecho_inicial: msgs[0].slice(0, 60), linha_aprox: lineOf(SCRIPT_START + SCRIPT.indexOf(msgs[0])) } },
    { condicao: 'acertos < 8', classe: 'fail', mensagem: msgs[1], origem: { seletor: '<script> corrigir() · ramo senão', trecho_inicial: msgs[1].slice(0, 60), linha_aprox: lineOf(SCRIPT_START + SCRIPT.indexOf(msgs[1])) } },
  ],
  placar_codigo: { codigo: scoreBlock, linha_aprox: lineOf(SCRIPT_START + scoreIdx) },
  cabecalho_da_questao: { modelo: "'Questão '+(i+1)+' de '+Q.length", linha_aprox: build.linha },
  botoes,
  mecanica: {
    nota: 'Registro da fonte, sem decisão. Todas as questões numa página; "Corrigir" avalia tudo de uma vez, marca a correta (right) e a escolhida errada (wrong), mostra o feedback de todas; questão sem resposta conta como erro; "Refazer" reconstrói. Sem persistência.',
    build: build.codigo, build_linha: build.linha,
    corrigir: corrigir.codigo, corrigir_linha: corrigir.linha,
  },
  origem_literal: { seletor: '<script> var Q', linha_aprox: Qlit.linha, linha_fim: Qlit.linha_fim },
  codigo: { presente: false, nota: 'Nenhum quiz do M10 em src/lib/data.' },
};

// ================================================================ CHECKLIST
const ck = find(S.final.node, (x) => x.tag === 'ul' && hasClass(x, 'ck'));
const P14 = (t) => {
  const m = [];
  if (/cronometrad|em cinco minutos/.test(t)) m.push('cronometrado');
  if (/^Sei dizer/.test(t)) m.push('producao_oral_ou_livre');
  if (/^Calculei/.test(t) || /calculei/.test(t)) m.push('calculo');
  if (/^(Registrei|Declarei|Listei|Etiquetei|Ordenei)/.test(t)) m.push('producao_escrita');
  m.push('autodeclarado');
  return m;
};
const finalLede = find(S.final.node, byClass('lede'));
const checklist_final = {
  id: 'm10-checklist-final',
  marcador: S.final.marcador, rotulo_marcador: S.final.rotulo,
  titulo: { texto: S.final.titulo, origem: origem('#final h2', S.final.h2) },
  lede: { ...frag(inner(finalLede)), origem: origem('#final p.lede', finalLede) },
  itens: findAll(ck, byTag('li')).map((li, i) => ({ id: `m10-check-${pad(i + 1)}`, ordem: i + 1, ...frag(inner(li)), marcacao_p14: P14(texto(inner(li))), origem: origem('#final ul.ck li', li) })),
  mecanica: 'Lista estática (ul.ck), sem caixa de marcação nem script.',
  codigo: { presente: false },
};

// ================================================================ EXERCÍCIOS
const exLede = find(S.ex.node, byClass('lede'));
const PREF = /^(Leitura de fatura|Diagnóstico negativo|Dado faltante)\.\s*/;
const exercicios = findAll(S.ex.node, byTag('details')).map((d) => {
  const sum = find(d, byTag('summary'));
  const bd = find(d, byClass('det-bd'));
  const st = texto(inner(sum));
  const m = /^(\d+) · ([\s\S]*)$/.exec(st);
  const pm = PREF.exec(m[2]);
  const code = C10.MODULO_10_EXERCICIOS_SOLTOS.find((x) => x.id === `ex-10-${m[1]}`);
  const gabHtml = inline(inner(bd));
  const cmp = code ? {
    id: code.id, kind: code.kind, points: code.points,
    prompt_igual_summary: code.prompt === st,
    gabarito_igual_html: collapse(code.config.gabarito) === gabHtml,
    divergencias: [
      ...(code.prompt === st ? [] : [{ campo: 'prompt', codigo: code.prompt }]),
      ...(collapse(code.config.gabarito) === gabHtml ? [] : [{ campo: 'gabarito', codigo: code.config.gabarito }]),
      { campo: 'points', codigo: code.points, nota: 'sem origem na fonte' },
      { campo: 'kind', codigo: code.kind, nota: 'rótulo do código; a fonte não tipa o exercício' },
    ],
  } : { presente: false };
  const aulas = [...`${st} ${texto(inner(bd))}`.matchAll(/Aula\s*\d+/g)].map((x) => x[0]);
  return {
    id: `m10-ex-${m[1]}`,
    tag: m[1],
    categoria_no_enunciado: pm ? pm[1] : null,
    enunciado: { texto: st, sem_numero: m[2], sem_prefixo: pm ? m[2].slice(pm[0].length) : m[2] },
    resposta_referencia: { html: gabHtml, texto: texto(inner(bd)) },
    criterio: null,
    aula_vinculada: null,
    sem_aula: true,
    mencoes_a_aula_no_texto: aulas,
    mecanica: 'details/summary nativo: o gabarito abre com um clique, sem tentativa registrada.',
    origem: origem('#ex details > summary', sum),
    comparacao_codigo: cmp,
  };
});
const contPref = {};
for (const e of exercicios) { const k = e.categoria_no_enunciado || '(sem prefixo)'; contPref[k] = (contPref[k] || []); contPref[k].push(e.tag); }
D('div-ap-01-exercicios-categorias', 'Distribuição declarada dos 14 exercícios × prefixos',
  { onde: '§Ex lede L2892', texto: texto(inner(exLede)) },
  { onde: 'prefixos dos summaries', texto: Object.entries(contPref).map(([k, v]) => `${k}: ${v.length} (${v.join(', ')})`).join(' | ') },
  'A prosa diz 4 de leitura de fatura, 4 de diagnóstico negativo, 4 de dado faltante e 2 de armadilha de comparação. Os prefixos marcam 3 + 3 + 3, e 5 exercícios não têm prefixo; nenhum é rotulado "armadilha de comparação". A contagem total (14) confere.', [2892]);

// ================================================================ REFERÊNCIAS
const refLede = find(S.ref.node, byClass('lede'));
const ol = find(S.ref.node, (x) => x.tag === 'ol' && hasClass(x, 'ref-list'));
const DATA_RE = /\b(\d{1,2}º?|1º) de (janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro) de \d{4}\b/g;
const referencias = findAll(ol, byTag('li')).map((li, i) => {
  const src = find(li, byClass('src'));
  const a = find(li, byTag('a'));
  const corpoHtml = inner(li).replace(/<span class="src">[\s\S]*?<\/span>/, '').replace(/<a [\s\S]*?<\/a>/, '');
  const rot = texto(inner(src));
  const url = a ? a.attrs.href : null;
  const t = texto(corpoHtml);
  return {
    id: `m10-ref-${pad(i + 1)}`,
    ordem: i + 1,
    rotulo: rot,
    tipo: rot.split(' · ')[0],
    titulo: t.split(' — ')[0],
    descricao: { ...frag(corpoHtml) },
    instituicao_citada: (/^(ANEEL|STF|STJ|CCEE|Proret)\b/.exec(t) || [])[1] ?? null,
    url,
    texto_do_link: a ? texto(inner(a)) : null,
    url_igual_texto_do_link: a ? url === texto(inner(a)) : null,
    dominio: url ? new URL(url).hostname : null,
    datas_citadas: [...t.matchAll(DATA_RE)].map((x) => x[0]),
    pendente: rot === 'Pendente de resolução',
    origem: origem('#ref ol.ref-list li', li),
  };
});
const urls = referencias.map((r) => r.url).filter(Boolean);
const refs = {
  marcador: S.ref.marcador, rotulo_marcador: S.ref.rotulo,
  titulo: { texto: S.ref.titulo, origem: origem('#ref h2', S.ref.h2) },
  lede: { ...frag(inner(refLede)), origem: origem('#ref p.lede', refLede) },
  data_de_consulta_de_todas: texto(inner(find(refLede, byTag('b')))),
  itens: referencias,
  contagem_por_tipo: referencias.reduce((a, r) => ((a[r.tipo] = (a[r.tipo] || 0) + 1), a), {}),
  com_url: urls.length, sem_url: referencias.length - urls.length,
  urls_duplicadas: urls.filter((u, i) => urls.indexOf(u) !== i),
  pendentes: referencias.filter((r) => r.pendente).length,
  campos_ausentes: 'Nenhuma referência declara "o que responde / o que não responde", tema ou última verificação individual; vale a data global do lede. tipo é o prefixo do rótulo literal.',
  codigo: { presente: false, nota: 'O § Ref do M10 não está em src/.' },
};

// ================================================================ GLOSSÁRIO
const lexLede = find(S.lex.node, byClass('lede'));
const familias = findAll(S.lex.node, byTag('details')).map((d) => {
  const sum = find(d, byTag('summary'));
  return {
    familia: texto(inner(sum)),
    origem: origem('#lex details > summary', sum),
    termos: findAll(d, byTag('p')).map((p) => {
      const t = find(p, byClass('term'));
      const rest = inner(p).slice(inner(p).indexOf('</span>') + 7);
      const defHtml = rest.replace(/^\s*—\s*/, '');
      return { termo: texto(inner(t)), definicao: frag(defHtml), origem: origem('#lex details p > span.term', p) };
    }),
  };
});
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const codeTerms = GLO.ALEXANDRIA_GLOSSARIO;
const codeM10 = codeTerms.filter((x) => /^gl-m10-/.test(x.id));
const codeByNorm = new Map();
for (const x of codeTerms) { const k = norm(x.term); (codeByNorm.get(k) || codeByNorm.set(k, []).get(k)).push(x.id); }
let n = 0;
const termos = [];
for (const f of familias) for (const t of f.termos) {
  n++;
  const outros = codeByNorm.get(norm(t.termo)) || [];
  termos.push({ id: `m10-lex-${String(n).padStart(3, '0')}`, familia: f.familia, ...t, no_codigo_m10: false, mesmo_nome_em_outro_modulo_do_codigo: outros });
}
const dupl = termos.map((t) => norm(t.termo)).filter((k, i, arr) => arr.indexOf(k) !== i);
const glossario = {
  marcador: S.lex.marcador, rotulo_marcador: S.lex.rotulo,
  titulo: { texto: S.lex.titulo, origem: origem('#lex h2', S.lex.h2) },
  lede: { ...frag(inner(lexLede)), origem: origem('#lex p.lede', lexLede) },
  contagem_markup: termos.length,
  contagem_declarada: { hero: '161 termos', prosa_lex: null, nota: 'O § Lex não declara número; o pill do hero diz 161.' },
  por_familia: familias.map((f) => ({ familia: f.familia, termos: f.termos.length })),
  termos,
  duplicados_no_modulo: dupl,
  comparacao_codigo: {
    arquivo: 'src/lib/data/alexandria-glossario.ts',
    termos_m10_no_codigo: codeM10.length,
    faltam_no_codigo: termos.length - codeM10.length,
    lista_dos_que_faltam: 'todos os termos acima (no_codigo_m10 = false em cada um)',
    mesmo_nome_ja_definido_em_outro_modulo: termos.filter((t) => t.mesmo_nome_em_outro_modulo_do_codigo.length).map((t) => ({ termo: t.termo, ids_no_codigo: t.mesmo_nome_em_outro_modulo_do_codigo })),
    nota: 'O código tem os § Lex dos M01–M08 (gl-*, gl-m02…gl-m08). Nenhum gl-m10. O lede do § Lex diz que termos já definidos nos Módulos 01 a 09 só se repetem com sentido operacional distinto; os homônimos listados são verbetes distintos por módulo (convenção do código).',
  },
};

// ================================================================ ÍNDICE E SAÍDA
const out = {
  schema: 'alexandria-v2/extraction/aparato@1',
  modulo: 'M10', grupo: 'aparato', fonte: FONTE, gerado_em: '2026-09-17',
  metodo: 'Extração programática (Node): árvore de elementos (extratores/lib.mjs); quiz lido avaliando o literal `var Q=[...]` do <script>. Campos html preservam o inline da fonte com espaços colapsados; texto sem tags e com entidades decodificadas.',
  convencoes: { linha_aprox: 'linha 1-based no HTML-fonte', null: 'ausência na fonte; cada null tem nota ao lado', marcacao_p14: 'anotação desta extração, inferida do verbo/termo do item' },
  contagens: {
    caso: { secoes: partes.length, tabelas: cb.filter((b) => b.tipo === 'tabela').length, linhas_de_tabela: cb.filter((b) => b.tipo === 'tabela').map((b) => b.linhas.length - 1), perguntas_ao_learner: 0, decisao_pedida: 0 },
    quiz: { questoes: questoes.length, alternativas_por_questao: [...new Set(questoes.map((q) => q.alternativas.length))], faixas_de_placar: 2, gabarito: Q.map((q) => LETRAS[q.a]).join('') },
    checklist_final: { itens: checklist_final.itens.length, declarado: 'Vinte e oito', cronometrados: checklist_final.itens.filter((i) => i.marcacao_p14.includes('cronometrado')).length, orais: checklist_final.itens.filter((i) => i.marcacao_p14.includes('producao_oral_ou_livre')).length },
    exercicios: { total: exercicios.length, declarado: 'Catorze', com_aula: 0, sem_aula: exercicios.length, por_prefixo: Object.fromEntries(Object.entries(contPref).map(([k, v]) => [k, v.length])), no_codigo: C10.MODULO_10_EXERCICIOS_SOLTOS.length },
    referencias: { total: referencias.length, declarado_hero: '35 referências', com_url: urls.length, pendentes: refs.pendentes, com_data_citada: referencias.filter((r) => r.datas_citadas.length).length },
    glossario: { termos: termos.length, familias: familias.length, no_codigo: codeM10.length, faltam_no_codigo: termos.length - codeM10.length, homonimos_em_outros_modulos: glossario.comparacao_codigo.mesmo_nome_ja_definido_em_outro_modulo.length },
    divergencias: 0,
  },
  caso: casoObj,
  avaliacao,
  checklist_final,
  exercicios: {
    marcador: S.ex.marcador, rotulo_marcador: S.ex.rotulo,
    titulo: { texto: S.ex.titulo, origem: origem('#ex h2', S.ex.h2) },
    lede: { ...frag(inner(exLede)), origem: origem('#ex p.lede', exLede) },
    contagem_por_prefixo: contPref,
    itens: exercicios,
    nota_p9: 'Nenhum dos 14 tem tag de aula; a varredura por /Aula\\s*\\d+/ no enunciado e no gabarito dá zero. Todos são soltos (sem aula). Nenhum declara critério próprio.',
  },
  referencias: refs,
  glossario,
  divergencias: div,
};
// divergências adicionais medidas
const exCodDiv = exercicios.filter((e) => e.comparacao_codigo.divergencias?.some((d) => d.campo === 'prompt' || d.campo === 'gabarito'));
D('div-ap-02-exercicios-codigo', 'Exercícios no código', { onde: 'fonte', texto: `${exercicios.length} exercícios, gabarito com <b>` }, { onde: 'MODULO_10_EXERCICIOS_SOLTOS', texto: `${C10.MODULO_10_EXERCICIOS_SOLTOS.length} exercícios; prompt/gabarito diferentes em ${exCodDiv.length}; points: 10 e kind: 'discursiva' sem origem` }, 'Os textos batem com a fonte onde não listados; points e kind são do código.', []);
D('div-ap-03-caso-parte', 'Caso rotulado "Parte 10"', { onde: '§Caso sec-id', texto: caso.rotulo }, { onde: 'P17', texto: 'não usar "Partes" da fonte como estrutura' }, 'Ver modulo.json div-03.', [lineOf(caso.secId.start)]);
D('div-ap-04-quiz-questoes-soltas', 'Quiz sem vínculo de aula', { onde: 'script Q', texto: '10 questões sem campo de aula' }, { onde: '—', texto: 'as questões tratam de A02 (Q1), A03 (Q2; Q9 também A09), A04 (Q3), A05 (Q4), A08 (Q5, Q10), A06 (Q6), A07 (Q7), A01 (Q8) por conteúdo' }, 'O vínculo por conteúdo é leitura desta extração, não da fonte; vinculo_aula = null em cada questão.', [Qlit.linha]);
D('div-ap-05-lex-contagem', 'Contagem do § Lex', { onde: 'hero pill', texto: '161 termos' }, { onde: 'markup', texto: `${termos.length} span.term em ${familias.length} famílias` }, termos.length === 161 ? 'Confere.' : 'Não confere.', []);
D('div-ap-06-ref-contagem', 'Contagem do § Ref', { onde: 'hero pill', texto: '35 referências' }, { onde: 'markup', texto: `${referencias.length} li, ${refs.pendentes} marcadas "Pendente de resolução", ${referencias.length - urls.length} sem URL` }, 'A contagem confere, mas 3 das 35 são pendências declaradas, não fontes; e a "Fonte de campo" não tem URL.', []);
D('div-ap-07-checklist-contagem', 'Contagem do § Final', { onde: 'h2 + pill', texto: 'Vinte e oito / 28 itens de checklist' }, { onde: 'markup', texto: `${checklist_final.itens.length} li` }, checklist_final.itens.length === 28 ? 'Confere.' : 'Não confere.', []);
out.contagens.divergencias = div.length;
writeJSON('aparato.json', out);
console.log(JSON.stringify(out.contagens, null, 1));
console.log(JSON.stringify(contPref));
console.log(glossario.comparacao_codigo.mesmo_nome_ja_definido_em_outro_modulo.map((x) => x.termo).join(' | '));
console.log(exCodDiv.map((e) => e.tag + ':' + e.comparacao_codigo.divergencias.map((d) => d.campo).join(',')).join(' '));
console.log(dupl, referencias.filter((r) => !r.url).map((r) => r.rotulo));
