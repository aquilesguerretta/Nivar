// Extração programática do grupo "aparato" do M11 → aparato.json.
import * as L from './m11_lib.mjs';
import { wrapOf, marcador, blocos } from './m11_blocos.mjs';

const fail = (m) => { throw new Error(m); };
const cod = await L.loadCodigo();
const CONTENT = L.readRepo('src/lib/data/alexandria-modulo-11-content.ts');
const norm = (s) => L.stripTags(String(s ?? '')).replace(/\s+/g, ' ').trim();
const fold = (s) => norm(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s*\(.*?\)\s*/g, ' ').replace(/[.,;:]+$/, '').trim();

// ── Caso ─────────────────────────────────────────────────────
const { sec: secCaso, wrap: wCaso } = wrapOf('caso');
const bCaso = blocos(wCaso, 'm11-caso', 'caso');
const lede = bCaso.find((b) => b.tipo === 'lede');
const pergunta = lede.texto.match(/[^.]*\?$/)[0].trim();
// dados do perfil: fragmentos literais da enumeração do lede (split por vírgula da frase após os dois-pontos)
const frase = lede.texto.match(/construíram o perfil: (.*?)\. Suponha/)[1];
const dados = frase.split(/, (?![^()]*\))/).map((f, i) => ({ id: `m11-caso-dado-${L.pad(i + 1)}`, texto: f.replace(/^e /, (x) => x), origem: { seletor: 'section#caso p.lede', trecho_inicial: f.slice(0, 70), linha_aprox: lede.origem.linha_aprox } }));
const sub = (num) => {
  const i = bCaso.findIndex((b) => b.tipo === 'titulo' && b.numero === num);
  const j = bCaso.findIndex((b, k) => k > i && b.tipo === 'titulo');
  return { titulo: bCaso[i], paragrafos: bCaso.slice(i + 1, j < 0 ? undefined : j) };
};
const afirmacoes = (ps) => ps.map((p) => ({ rotulo_em_negrito: L.stripTags((p.html.match(/^<b>([\s\S]*?)<\/b>/) || [])[1] ?? '') || null, bloco: p.id, linha_aprox: p.origem.linha_aprox }));
const s111 = sub('11.1'), s112 = sub('11.2'), s113 = sub('11.3');
const caso = {
  id: 'm11-caso', tipo: 'caso',
  marcador: marcador(secCaso),
  parte: { literal: marcador(secCaso).rotulo, nota: 'A fonte numera o caso como parte 11 de uma série transversal ("As dez partes anteriores construíram o perfil"). Registrado literal; P17 decide a apresentação no produto.' },
  titulo: { ...L.lit(secCaso.h2), origem: L.origem(secCaso.h2, 'section#caso h2') },
  lead: lede,
  pergunta_do_caso: { texto: pergunta, origem: { seletor: 'section#caso p.lede (última frase)', trecho_inicial: pergunta.slice(0, 70), linha_aprox: L.findLine(/O que já é possível dizer, e o que ainda não é\?/) } },
  pergunta_nota: 'Única pergunta literal do caso (última frase do lede). A fonte não pede resposta do learner: ela mesma responde em 11.1–11.3.',
  dados_do_perfil: dados,
  dados_nota: 'Fragmentos literais da enumeração do lede, separados por vírgula (a fonte não usa lista). O último fragmento inclui o "e" da enumeração.',
  cabecalhos_internos: [s111.titulo, s112.titulo, s113.titulo].map((t) => ({ numero: t.numero, texto: t.texto, linha_aprox: t.origem.linha_aprox })),
  o_que_ja_e_verificavel: { afirmacoes: afirmacoes(s111.paragrafos) },
  dados_faltantes: { afirmacoes: afirmacoes(s112.paragrafos), nota: 'Cada parágrafo de 11.2 abre com o dado faltante em negrito; o próprio parecer (11.3) chama isso de "a lista dos dados que faltam está em 11.2".' },
  parecer_da_fonte: { afirmacoes: afirmacoes(s113.paragrafos) },
  blocos: bCaso,
  decisao_pedida: null,
  decisao_nota: 'A fonte não pede decisão ao learner; 11.3 é o parecer do próprio texto (o que se pode e o que não se pode dizer). P17 autoriza um Desafio de decisão na camada Alexandria, só com os fatos do caso.',
  vinculos: { aulas_citadas_no_texto: [...new Set((bCaso.map((b) => b.texto || '').join(' ').match(/Aula \d\d|Módulo \d\d|Parte \d\d?/g) || []))], nota: 'Citações em prosa, não tags de posse.' },
  codigo_atual: `Não extraído: nenhum arquivo em src/lib/data contém o caso do M11 (grep "Operação A" em alexandria-modulo-11-content.ts: ${/Operação A/.test(CONTENT) ? 'presente' : 'ausente'}).`,
};

// ── Quiz ─────────────────────────────────────────────────────
const qStart = L.findLine(/var Q=\[/);
const qEnd = L.findLine(/^\s*\];\s*$/, qStart);
const Q = L.evalLiteral(qStart, qEnd);
if (Q.length !== 10) fail('quiz ≠ 10');
const { sec: secQuiz, wrap: wQuiz } = wrapOf('quiz');
const LET = 'ABCD';
const qLine = (q) => L.findLine(new RegExp('\\{q:\'' + q.q.slice(0, 30).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), qStart, qEnd);
const lnScore = L.findLine(/sc\.className='score show '\+\(acertos>=8\?'pass':'fail'\)/);
const avaliacao = {
  id: 'm11-quiz', tipo: 'quiz',
  marcador: marcador(secQuiz),
  titulo: L.lit(secQuiz.h2),
  introducao: L.lit(L.find(wQuiz, (x) => L.hasClass(x, 'lede'))),
  mecanica_fonte: 'Script QUIZ (L3843-3960): monta 10 cartões com radio (ordem fixa, sem embaralhar); botão "Corrigir" marca a alternativa certa (.right) e a escolhida errada (.wrong), mostra o feedback q.f em TODAS as questões (certas, erradas e em branco) e o placar "acertos / 10"; "Refazer" reconstrói. Sem persistência, sem trava de resposta.',
  total_questoes: Q.length,
  rotulos_de_interface_fonte: {
    cabecalho_questao: "'Questão '+(i+1)+' de '+Q.length",
    botoes: L.byTag(L.find(L.DOC, (x) => x.attrs?.id === 'quiz-go').parent, 'button').map((b) => ({ id: b.attrs.id, rotulo: L.stripTags(L.inner(b)), linha_aprox: b.line })),
    placar: "'<div class=\"big\">'+acertos+' / '+Q.length+'</div>'",
  },
  faixas_de_placar_script: [
    { condicao: 'acertos>=8', minimo: 8, intervalo: '8–10', classe: 'pass', mensagem: L.LINES[L.findLine(/\? 'Critério atingido\./, lnScore) - 1].match(/'(.*)'/)[1], linha_aprox: L.findLine(/\? 'Critério atingido\./, lnScore) },
    { condicao: 'else (acertos<8)', minimo: 0, intervalo: '0–7', classe: 'fail', mensagem: L.LINES[L.findLine(/: 'Abaixo do critério/, lnScore) - 1].match(/'(.*)'/)[1], linha_aprox: L.findLine(/: 'Abaixo do critério/, lnScore) },
  ],
  criterio_literal_prosa: ['Dez questões · critério de aprovação 8 de 10', 'O critério é oito acertos'],
  perguntas: Q.map((q, i) => ({
    id: `m11-quiz-q${L.pad(i + 1)}`, tipo: 'questao-multipla-escolha',
    rotulo_composto_pelo_script: `Questão ${i + 1} de ${Q.length}`,
    enunciado: q.q,
    alternativas: q.o.map((t, j) => ({ letra: LET[j], indice: j, texto: t })),
    gabarito: { indice: q.a, letra: LET[q.a], texto: q.o[q.a] },
    explicacao: q.f,
    nota_explicacao: 'O mesmo feedback aparece para acerto, erro e questão em branco (fb.innerHTML=esc(q.f)).',
    vinculos: { aulas_declaradas: [], nota: 'A fonte não associa questão a aula.' },
    origem: { seletor: `<script> var Q[${i}]`, trecho_inicial: q.q.slice(0, 70), linha_aprox: qLine(q) },
  })),
  distribuicao_gabarito: Q.reduce((a, q) => ((a[LET[q.a]] = (a[LET[q.a]] || 0) + 1), a), {}),
  codigo_atual: `Não extraído: zero ocorrência do enunciado da Q1 em src/lib/data (${CONTENT.includes(Q[0].q.slice(0, 40)) ? 'presente' : 'ausente'} em alexandria-modulo-11-content.ts).`,
};

// ── Checklist ────────────────────────────────────────────────
const { sec: secFinal, wrap: wFinal } = wrapOf('final');
const ck = L.find(wFinal, (x) => x.tag === 'ul' && L.hasClass(x, 'ck'));
const cronometrado = (t) => /\b(trinta|cinco) minutos\b|cronometrad/.test(t);
const oral = (t) => /^Sei dizer/.test(t);
const itensCk = L.kids(ck, (x) => x.tag === 'li').map((li, i) => ({ id: `m11-check-${L.pad(i + 1)}`, ordem: i + 1, ...L.lit(li), cronometrado_P14: cronometrado(L.stripTags(L.inner(li))), oral_P14: oral(L.stripTags(L.inner(li))), origem: L.origem(li, 'section#final ul.ck > li') }));
const checklist_final = {
  id: 'm11-checklist', tipo: 'checklist',
  marcador: marcador(secFinal), titulo: L.lit(secFinal.h2),
  introducao: L.lit(L.find(wFinal, (x) => L.hasClass(x, 'lede'))),
  mecanica_fonte: 'Lista estática (ul.ck); nenhum handler no <script>, nenhuma marcação clicável.',
  total_itens: itensCk.length,
  itens: itensCk,
  itens_orais_ou_cronometrados_P14: itensCk.filter((x) => x.cronometrado_P14 || x.oral_P14).map((x) => x.id),
  nota_P14: 'Anotação inferida desta extração (tempo explícito no texto; "Sei dizer"). Os 28 itens descrevem ações sobre proposta real — nenhum é automatizável como evidência.',
  codigo_atual: `Não extraído (${CONTENT.includes(L.stripTags(L.inner(L.kids(ck)[0])).slice(0, 40)) ? 'presente' : 'ausente'} em alexandria-modulo-11-content.ts); alexandria-badges.ts não referencia o M11.`,
};

// ── Exercícios ───────────────────────────────────────────────
const { sec: secEx, wrap: wEx } = wrapOf('ex');
const boxes = L.kids(wEx, (x) => L.hasClass(x, 'box'));
const codEx = cod.MODULO_11_EXERCICIOS_SOLTOS;
const exercicios = boxes.map((b, i) => {
  const p = L.kids(b, (x) => x.tag === 'p')[0];
  const h = L.inner(p);
  const m = h.match(/^\s*<b>([\s\S]*?)<\/b>\s*([\s\S]*)$/);
  const tagTxt = L.stripTags(m[1]).replace(/\.$/, '');
  const det = L.find(b, (x) => x.tag === 'details');
  const summ = L.find(det, (x) => x.tag === 'summary');
  const bd = L.find(det, (x) => L.hasClass(x, 'det-bd'));
  const gab = L.kids(bd, (x) => x.tag === 'p');
  const enun = { html: L.htmlNorm(m[2]), texto: L.stripTags(m[2]) };
  const aulaRef = [enun.texto, ...gab.map((g) => L.stripTags(L.inner(g)))].join(' ').match(/Aula \d\d/g);
  const c = codEx[i];
  const cmp = c ? {
    id: c.id,
    prompt_igual: norm(c.prompt) === enun.texto,
    tag_igual: c.config?.tag === L.stripTags(m[1]).replace(/\.$/, ''),
    tag_codigo: c.config?.tag ?? null,
    gabarito_igual: norm(c.config?.gabarito) === gab.map((g) => L.stripTags(L.inner(g))).join(' '),
    kind: c.kind, points: c.points,
  } : null;
  return {
    id: `m11-ex-${L.pad(i + 1)}`, tipo: 'exercicio-com-gabarito',
    tag: L.stripTags(m[1]),
    numero: Number(tagTxt.split(' · ')[0]),
    tipo_fonte: tagTxt.split(' · ')[1],
    solto_P9: true,
    aula_declarada: null,
    aula_citada_no_texto: aulaRef,
    enunciado: enun,
    rotulo_botao_gabarito: L.stripTags(L.inner(summ)),
    gabarito: { paragrafos_html: gab.map((g) => L.htmlNorm(L.inner(g))), texto: gab.map((g) => L.stripTags(L.inner(g))).join(' ') },
    criterio: null,
    criterio_nota: 'A fonte não dá critério por exercício; a regra geral está no lede do § Ex (ver introducao).',
    origem: L.origem(b, 'section#ex > .wrap > div.box', h),
    codigo_atual: cmp,
  };
});
if (exercicios.length !== 14) fail('ex ≠ 14');
const tipos = exercicios.reduce((a, e) => ((a[e.tipo_fonte] = (a[e.tipo_fonte] || 0) + 1), a), {});
const exBloco = {
  id: 'm11-exercicios', tipo: 'exercicios',
  marcador: marcador(secEx), titulo: L.lit(secEx.h2),
  introducao: L.lit(L.find(wEx, (x) => L.hasClass(x, 'lede'))),
  rotulo_botao_gabarito: exercicios[0].rotulo_botao_gabarito,
  total_na_fonte: exercicios.length,
  por_tipo: tipos,
  aulas_cobertas_por_tag: [],
  soltos_P9: exercicios,
  vinculados_a_aula_indice: [],
  nota_vinculados: 'Zero exercício com tag ou citação de aula (varredura /Aula \\d\\d/ em enunciado e gabarito). Todos soltos — mesmo estado registrado no protocolo §4 para o M11.',
  codigo_atual: {
    arquivo: 'src/lib/data/alexandria-modulo-11-content.ts MODULO_11_EXERCICIOS_SOLTOS',
    total: codEx.length,
    iguais_prompt: exercicios.filter((e) => e.codigo_atual?.prompt_igual).length,
    iguais_tag: exercicios.filter((e) => e.codigo_atual?.tag_igual).length,
    iguais_gabarito: exercicios.filter((e) => e.codigo_atual?.gabarito_igual).length,
    points_sem_origem: [...new Set(codEx.map((x) => x.points))],
    renderizado: false,
    renderizado_nota: "RecursosDoModulo.tsx não tem 'modulo-11' no registro RECURSOS: os 14 existem como dado e nenhuma tela os mostra.",
  },
};

// ── Referências ──────────────────────────────────────────────
const { sec: secRef, wrap: wRef } = wrapOf('ref');
const olRef = L.find(wRef, (x) => x.tag === 'ol');
const INST = ['Agência Nacional de Energia Elétrica', 'ANEEL', 'Inmetro', 'Instituto Nacional de Metrologia, Qualidade e Tecnologia', 'CNPE', 'Instituto Nacional de Pesquisas Espaciais', 'Laboratório de Modelagem e Estudos de Recursos Renováveis de Energia', 'INPE', 'LABREN', 'Centro de Referência para Energia Solar e Eólica', 'Empresa de Pesquisa Energética', 'Congresso Nacional', 'Diário Oficial da União', 'GridAlpha', 'Alexandria'];
const DATE_RE = /\b(?:\d{1,2}º? de )?(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?: de \d{4})?\b|\b(?:19|20)\d\d(?:–(?:19|20)\d\d)?\b/g;
const referencias = L.kids(olRef, (x) => x.tag === 'li').map((li, i) => {
  const src = L.find(li, (x) => L.hasClass(x, 'src'));
  const corpoHtml = L.inner(li).slice(L.outer(src).length + (L.inner(li).indexOf(L.outer(src))));
  const corpo = L.stripTags(corpoHtml);
  const [tipoFonte, tema] = L.stripTags(L.inner(src)).split(' · ');
  const marcas = [...corpoHtml.matchAll(/<b>([\s\S]*?)<\/b>/g)].map((m) => L.stripTags(m[1]));
  return {
    id: `m11-ref-${L.pad(i + 1)}`, tipo: 'referencia',
    rotulo_fonte: L.stripTags(L.inner(src)),
    tipo_fonte: tipoFonte, tema: tema ?? null,
    html: L.htmlNorm(corpoHtml), texto: corpo,
    primeira_frase: corpo.match(/^[\s\S]*?(?:\.(?=\s+[A-ZÁÉÍÓÚ])|$)/)[0],
    instituicoes_citadas: INST.filter((n) => corpo.includes(n)),
    url: null,
    dominio_citado: (corpo.match(/(?:https?:\/\/|www\.)\S+/) || [null])[0],
    datas_e_anos_citados: [...new Set(corpo.match(DATE_RE) || [])],
    marcadores_em_negrito: marcas,
    pendente: marcas.some((m) => /^Pendente/.test(m)) || /^Pendência/.test(tipoFonte),
    interna: /interno/.test(tipoFonte),
    origem: L.origem(li, 'section#ref ol.ref-list > li'),
  };
});
const refBloco = {
  id: 'm11-referencias', tipo: 'referencias',
  marcador: marcador(secRef), titulo: L.lit(secRef.h2),
  introducao: L.lit(L.find(wRef, (x) => L.hasClass(x, 'lede'))),
  total: referencias.length,
  por_tipo_fonte: referencias.reduce((a, r) => ((a[r.tipo_fonte] = (a[r.tipo_fonte] || 0) + 1), a), {}),
  com_url: referencias.filter((r) => r.url).length,
  com_dominio: referencias.filter((r) => r.dominio_citado).length,
  pendentes: referencias.filter((r) => r.pendente).map((r) => r.id),
  internas: referencias.filter((r) => r.interna).map((r) => r.id),
  data_de_consulta_declarada: '1º de agosto de 2026',
  nota: 'Nenhuma referência tem URL nem domínio (zero "http"/"www." na seção). "titulo" e "instituição" não são campos separados na fonte: o texto é literal; primeira_frase e instituicoes_citadas são recortes literais (substring), não reescrita. datas_e_anos_citados é varredura por regex no texto.',
  itens: referencias,
  codigo_atual: `Não extraído (referências por aula no código: ${[...new Set(cod.MODULO_11_AULAS.map((a) => a.references.length))].join(',')}).`,
};

// ── Glossário ────────────────────────────────────────────────
const { sec: secLex, wrap: wLex } = wrapOf('lex');
const familias = L.kids(wLex, (x) => x.tag === 'details');
const codGl = cod.ALEXANDRIA_GLOSSARIO;
const codMap = new Map();
for (const g of codGl) { const k = fold(g.term); if (!codMap.has(k)) codMap.set(k, []); codMap.get(k).push(g.id); }
const termos = [];
familias.forEach((d, fi) => {
  const summ = L.find(d, (x) => x.tag === 'summary');
  const bd = L.find(d, (x) => L.hasClass(x, 'det-bd'));
  for (const p of L.kids(bd, (x) => x.tag === 'p')) {
    const h = L.inner(p);
    const m = h.match(/^\s*<span class="term">([\s\S]*?)<\/span>\s*—\s*([\s\S]*)$/);
    if (!m) fail(`lex sem padrão L${p.line}`);
    const termo = L.stripTags(m[1]);
    termos.push({
      id: `m11-lex-${String(termos.length + 1).padStart(3, '0')}`, tipo: 'termo-de-glossario',
      termo, familia: L.stripTags(L.inner(summ)), familia_ordem: fi + 1,
      definicao_html: L.htmlNorm(m[2]), definicao_texto: L.stripTags(m[2]),
      aberto_por_padrao: 'open' in d.attrs,
      codigo_atual: { gl_m11: null, homonimos_em_outros_modulos: codMap.get(fold(termo)) ?? [] },
      origem: L.origem(p, `section#lex details:nth(${fi + 1}) p`),
    });
  }
});
const glossario = {
  id: 'm11-glossario', tipo: 'glossario',
  marcador: marcador(secLex), titulo: L.lit(secLex.h2),
  introducao: L.lit(L.find(wLex, (x) => L.hasClass(x, 'lede'))),
  contagem: { markup: termos.length, pill_hero: '150 termos', prosa: null, prosa_nota: 'O § Lex não declara número em prosa; só a pill do hero.', familias: familias.map((d) => ({ nome: L.stripTags(L.inner(L.find(d, (x) => x.tag === 'summary'))), termos: termos.filter((t) => t.familia === L.stripTags(L.inner(L.find(d, (x) => x.tag === 'summary')))).length, linha_aprox: d.line })) },
  ordem_fonte: 'por família, não alfabética',
  termos,
  duplicatas_na_fonte: Object.entries(termos.reduce((a, t) => ((a[fold(t.termo)] = (a[fold(t.termo)] || 0) + 1), a), {})).filter(([, n]) => n > 1),
  codigo_atual: {
    arquivo: 'src/lib/data/alexandria-glossario.ts',
    termos_m11_no_codigo: codGl.filter((g) => /^gl-m11-/.test(g.id)).length,
    faltam_no_codigo: termos.length,
    faltam_no_codigo_lista: termos.map((t) => t.termo),
    homonimos: termos.filter((t) => t.codigo_atual.homonimos_em_outros_modulos.length).map((t) => ({ termo: t.termo, ids_codigo: t.codigo_atual.homonimos_em_outros_modulos })),
    nota: 'O código tem 637 verbetes (M01-M08) e nenhum do M11: os 150 faltam. "Homônimo" = mesmo termo normalizado (sem acento, caixa, parênteses) definido em outro módulo; o lede do § Lex diz que só repete termo de módulo anterior quando "este módulo lhes dá sentido operacional distinto".',
  },
};

// ── divergências do aparato ──────────────────────────────────
const D = (id, sev, tema, a, b, nota) => ({ id, severidade: sev, tema, leitura_a: a, leitura_b: b, nota, decisao: 'não escolhida nesta camada (fonte) — registrar' });
const ex = (n) => exercicios[n - 1];
const divergencias = [
  D('div-m11-ap-01-ex-sem-aula', 'média', 'Exercícios sem vínculo de aula (P9)', { onde: '§ Ex', texto: '14 exercícios em 4 tipos, nenhuma tag de aula' }, { onde: 'código', texto: 'MODULO_11_EXERCICIOS_SOLTOS, activities: [] nas 8 aulas; bucket não renderizado' }, 'Não é erro da fonte; é o padrão do protocolo §4. Registrado por impactar C7/C9.'),
  D('div-m11-ap-02-points', 'baixa', 'points: 1 nos 14 exercícios do código', { onde: 'fonte', texto: 'nenhuma pontuação por exercício' }, { onde: 'código', texto: `points: ${exBloco.codigo_atual.points_sem_origem.join(',')}` }, 'Valor sem origem na fonte (mesmo achado COD-09 do M01).'),
  D('div-m11-ap-03-glossario-ausente', 'alta', 'Glossário do M11 fora do código', { onde: '§ Lex', texto: `${termos.length} termos em ${familias.length} famílias` }, { onde: 'alexandria-glossario.ts', texto: '0 verbetes gl-m11-' }, 'Lista completa em glossario.codigo_atual.faltam_no_codigo_lista.'),
  D('div-m11-ap-04-caso-parte', 'média', 'Rótulo "Parte 11" do caso × P17', { onde: `L${secCaso.secId.line}`, texto: caso.parte.literal }, { onde: 'P17', texto: 'Caso — Operação A; sem "Partes" da fonte na interface' }, 'Literal mantido aqui.'),
  D('div-m11-ap-05-ref-titulo-bloco', 'baixa', 'Nome do bloco no currículo interno citado', { onde: 'ref 25 (m11-ref-25)', texto: 'Bloco 11: Geração Distribuída e o Boom Solar' }, { onde: 'h1 / catálogo', texto: 'Geração Distribuída e a Anatomia de uma Proposta Solar / Energia Solar e Análise de Propostas' }, 'Três nomes para o mesmo módulo.'),
  D('div-m11-ap-06-ref-m09', 'baixa', 'Título do Módulo 09 citado na ref 22', { onde: 'ref 22 (m11-ref-22)', texto: 'Alexandria · Módulo 09 — Mercados ACR e ACL em Profundidade' }, { onde: 'catálogo canônico', texto: 'Módulo 09 — Os Mercados ACR e ACL em Profundidade (repo: Mercado ACR e ACL)' }, 'Diferença de artigo "Os".'),
  D('div-m11-ap-07-quiz-q2-x-lex', 'baixa', 'Teto da fotovoltaica com baterias: quiz Q2 × erro 4 × léxico', { onde: 'Quiz Q2 (gabarito A), erro comum 4, § Lex "Fonte despachável"', texto: 'limitada a 3 MW' }, { onde: '§ Lex "Minigeração distribuída"', texto: 'até 5 MW para fontes despacháveis ou 3 MW para as demais' }, 'Coerentes entre si quando lidos juntos (a exceção da fotovoltaica com baterias está no verbete "Fonte despachável"); registrado porque o verbete de Minigeração, lido isolado, classifica a solar com bateria (despachável) em 5 MW.'),
  D('div-m11-ap-08-garantia-limiar', 'baixa', 'Faixa da garantia de fiel cumprimento no limiar de 1.000 kW', { onde: '§ Lex "Garantia de fiel cumprimento"', texto: 'dois e meio por cento do investimento entre 500 kW e 1.000 kW, e cinco por cento a partir de 1.000 kW' }, { onde: 'Inst · 04 script L3376-3377', texto: 'pot>1000 → "Para centrais de 1.000 kW ou mais… cinco por cento"; pot>500 → "acima de 500 kW e abaixo de 1.000 kW… dois e meio"' }, 'Com exatamente 1.000 kW o script devolve o texto de "abaixo de 1.000 kW" (2,5%), e o léxico diz 5% "a partir de 1.000 kW". Ver instrumentos.json.'),
  D('div-m11-ap-09-tag-ponto-final', 'baixa', 'Tag dos 14 exercícios: ponto final dentro do <b> na fonte, ausente no código',
    { onde: `§ Ex, p > b (L${L.findLine(/<b>1 · Verificação de premissa\.<\/b>/)})`, texto: '1 · Verificação de premissa.' },
    { onde: 'alexandria-modulo-11-content.ts MODULO_11_EXERCICIOS_SOLTOS config.tag', texto: '1 · Verificação de premissa' },
    'Os 14 casos. codigo_atual.tag_igual compara depois de retirar o ponto final (normalização declarada no extrator); sem ela, 0 de 14 seriam iguais.'),
  D('div-m11-ap-10-portaria-140', 'baixa', 'Duas "Portaria Inmetro nº 140" com anos diferentes',
    { onde: `§ Ref ref 10 (L${L.findLine(/^Portaria Inmetro nº 140, de 21 de março de 2022/)}), Aula 05 (L${L.findLine(/<b>Portaria Inmetro nº 140, de 21 de março de 2022/)}) e notas L${L.findLine(/Portarias Inmetro nº 140\/2022 e nº 515\/2023/)}`, texto: 'Portaria Inmetro nº 140, de 21 de março de 2022' },
    { onde: `§ Ref ref 11 (L${L.findLine(/^Portaria Inmetro nº 140\/2021/)})`, texto: 'Portaria Inmetro nº 140/2021 (requisitos gerais para declaração da conformidade de produtos)' },
    'Mesmo número, anos e objetos diferentes. Pode ser duas portarias distintas ou erro de digitação; a fonte não esclarece e esta camada não verifica fora do arquivo.'),
];
// checagens aritméticas dos gabaritos (conta desta extração)
const contas = [
  { ex: 1, literal: '100 × 5,1 × 365 = 186.150 kWh', calculo: 100 * 5.1 * 365, confere: Math.round(100 * 5.1 * 365) === 186150 },
  { ex: 2, literal: 'Desempenho global implícito de aproximadamente 78%', calculo: +(145000 / (100 * 5.1 * 365) * 100).toFixed(2), confere: Math.round(145000 / (100 * 5.1 * 365) * 100) === 78 },
  { ex: 9, literal: 'excede em 4,5 pontos percentuais ao ano', calculo: 11 - 6.5, confere: 11 - 6.5 === 4.5 },
];

const out = {
  schema: 'alexandria-v2/extraction/aparato@1',
  modulo: 'm11', grupo: 'aparato', camada: 'fonte',
  fonte: { arquivo: L.SRC, linhas_total: L.LINES.length, bytes: Buffer.byteLength(L.RAW) },
  metodo: 'extratores/m11_aparato.mjs — árvore HTML por offsets; quiz avaliado do literal `var Q` do <script> (new Function), sem digitação',
  convencoes: { linha_aprox: 'linha 1-based no HTML-fonte', null: 'ausência medida, com nota' },
  contagens: { caso_secoes: 1, caso_subsecoes: 3, caso_dados: dados.length, caso_perguntas: 1, quiz_questoes: Q.length, quiz_alternativas: Q.length * 4, quiz_faixas: 2, checklist: itensCk.length, checklist_cronometrados_ou_orais: checklist_final.itens_orais_ou_cronometrados_P14.length, exercicios: exercicios.length, exercicios_soltos: exercicios.length, exercicios_por_tipo: tipos, referencias: referencias.length, referencias_pendentes: refBloco.pendentes.length, referencias_internas: refBloco.internas.length, glossario_termos: termos.length, glossario_familias: familias.length, glossario_faltam_no_codigo: termos.length, glossario_homonimos_no_codigo: glossario.codigo_atual.homonimos.length, divergencias: divergencias.length },
  caso, avaliacao, checklist_final, exercicios: exBloco, referencias: refBloco, glossario, divergencias,
  contas_de_gabarito: contas,
};
L.writeJson('aparato.json', out);
console.log(JSON.stringify(out.contagens));
console.log(JSON.stringify(exBloco.codigo_atual), JSON.stringify(exercicios.filter((e) => !e.codigo_atual?.prompt_igual || !e.codigo_atual?.tag_igual || !e.codigo_atual?.gabarito_igual).map((e) => e.codigo_atual)));
console.log(JSON.stringify(glossario.codigo_atual.homonimos), JSON.stringify(glossario.duplicatas_na_fonte), JSON.stringify(avaliacao.distribuicao_gabarito));
console.log(dados.map((d) => d.texto));
