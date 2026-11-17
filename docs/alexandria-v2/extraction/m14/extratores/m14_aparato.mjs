// Extrator deterministico do grupo "aparato" do M14 -> aparato.json
import {
  FONTE, ROOT, html, find, findAll, kids, sel, inner, texto, inline, ht, origem, line, secao, blocos,
  readRepo, write, pad, HOJE, cobertura, lineOf,
} from './m14_lib.mjs';

const SCRIPT0 = html.indexOf('<script>');
const literalJS = (inicio, fim) => {
  const a = html.indexOf(inicio, SCRIPT0);
  const b = html.indexOf(fim, a);
  if (a < 0 || b < 0) throw new Error('literal ' + inicio);
  const fecha = fim.search(/[\]}]/);
  const code = html.slice(a + inicio.search(/[\[{]/), b + fecha + 1); // inclui [ ... ] ou { ... }
  // eslint-disable-next-line no-new-func
  return { valor: new Function(`return ${code};`)(), linha_ini: lineOf(a), linha_fim: lineOf(b) };
};
const L = (i) => 'ABCD'[i];

// ================================================================= CASO
const cs = secao('caso');
const csBl = blocos(cs.wrap, 'm14-caso', 'section#caso');
const csOl = find(cs.wrap, sel('ol', 'num-list'));
const perguntasCaso = kids(csOl, sel('li')).map((li, i) => {
  const b = find(li, sel('b'));
  const resto = inner(li).replace(/^\s*<b>[\s\S]*?<\/b>/, '');
  return { id: `m14-caso-pergunta-${pad(i + 1)}`, tipo: 'pergunta-diagnostica-do-caso', ordem: i + 1, pergunta: texto(inner(b)), desdobramento_html: inline(resto), desdobramento_texto: texto(resto), vinculos: { aulas_citadas: texto(inner(li)).match(/Aula \d\d/g) || [] }, origem: origem('section#caso ol.num-list > li', li) };
});
const t333 = csBl.find((b) => b.tipo === 'tres_colunas');
const caso33 = csBl.filter((b) => b.tipo === 'paragrafo');
const csBox = csBl.find((b) => b.tipo === 'callout');
const caso = {
  id: 'm14-caso', tipo: 'caso',
  marcador: csBl[0].texto,
  rotulo_marcador: csBl[0].rotulo,
  titulo: { html: csBl[1].html, texto: csBl[1].texto },
  parte: 'Parte 14',
  nota_parte: 'A fonte numera o caso literalmente como "Operação A — Parte 14" e se refere a "treze partes anteriores" (Partes 11, 12 e 13 citadas). É uma série transversal aos módulos, não uma divisão interna deste caso: dentro do M14 não há Parte 1/2. Pelo P17, "Parte" não vira estrutura de interface; o texto fica literal aqui.',
  lead: { html: csBl[2].html, texto: csBl[2].texto, origem: csBl[2].origem },
  blocos: csBl,
  subsecoes: csBl.filter((b) => b.tipo === 'titulo' && b.nivel === 'h3').map((b) => ({ numero: b.numero, titulo: b.titulo_sem_numero, linha_aprox: b.origem.linha_aprox })),
  dados: null,
  nota_dados: 'O caso não tem grade de dados. Os fatos da Operação A aparecem só em prosa, no lead ("mineração em Minas Gerais", "submercado Sudeste/Centro-Oeste", "fator de carga elevado", "bombeamento como carga flexível") e no §Caso.1 ("15% de cada litro de diesel B comprado é B100"). Nenhum volume, preço ou consumo da operação é dado — e a própria fonte diz que sem doze meses de dados nenhum número de economia é defensável.',
  perguntas: perguntasCaso,
  nota_perguntas: 'As cinco perguntas do §Caso.1 são literais, mas a fonte as apresenta como perguntas "que a operação deveria conseguir responder sobre a própria linha de combustível", não como perguntas feitas ao learner, e não traz resposta de referência para elas. O §Caso.3 faz uma pergunta e responde em seguida (ver pergunta_respondida).',
  diagnostico_biometano: t333 ? { colunas: t333.colunas, origem: t333.origem } : null,
  pergunta_respondida: {
    pergunta: caso33.find((p) => p.texto.startsWith('Separadamente'))?.texto ?? null,
    resposta_html: caso33.find((p) => p.texto.startsWith('A resposta liga'))?.html ?? null,
    resposta_texto: caso33.find((p) => p.texto.startsWith('A resposta liga'))?.texto ?? null,
    origem: caso33.find((p) => p.texto.startsWith('Separadamente'))?.origem ?? null,
  },
  linguagem_obrigatoria: csBox,
  decisao_pedida: null,
  nota_decisao: 'A fonte não pede decisão: o callout final declara "Tudo acima é diagnóstico, não recomendação" e que o ativo "não emite esse tipo de conclusão em nenhuma hipótese". Um Desafio de decisão (P17) seria da camada Alexandria.',
  vinculos: {
    aulas_citadas: [...new Set(texto(inner(cs.wrap)).match(/Aula \d\d/g) || [])],
    modulos_citados: [...new Set(texto(inner(cs.wrap)).match(/Módulo \d\d/g) || [])],
    nota: 'Vínculos por menção em prosa, não declarados como posse.',
  },
  origem: origem('section#caso', cs.s, 'Operação A — Parte 14'),
  codigo_atual: 'Não extraído: nenhum arquivo de src/lib/data traz o caso do M14.',
};

// ================================================================= QUIZ
const qz = secao('quiz');
const qzBl = blocos(qz.wrap, 'm14-quiz', 'section#quiz');
const Q = literalJS('var Q=[', '\n  ];');
const qTexto = (s) => s; // strings do script ja sao texto (sem tags)
const perguntas = Q.valor.map((q, i) => ({
  id: `m14-quiz-q${pad(i + 1)}`,
  tipo: 'questao-multipla-escolha',
  rotulo_fonte: `Questão ${i + 1} de ${Q.valor.length}`,
  enunciado: qTexto(q.q),
  alternativas: q.o.map((o, j) => ({ indice: j, letra: L(j), texto: o })),
  gabarito: { indice: q.a, letra: L(q.a), texto: q.o[q.a] },
  explicacao: q.f,
  nota_explicacao: 'Na fonte, o mesmo texto `f` é mostrado para acerto e erro, depois de "Corrigir".',
  vinculos: { instrumentos_citados: (q.f.match(/INST·\d\d/g) || []), aulas_citadas: [] },
  origem: { seletor: 'script > QUIZ > var Q', trecho_inicial: q.q.slice(0, 60), linha_aprox: lineOf(html.indexOf(q.q.slice(0, 40), SCRIPT0)) },
}));
const scQuiz = html.slice(html.indexOf('/* ===================== QUIZ', SCRIPT0));
const msgOk = scQuiz.match(/\? '(Critério atingido\.[^']*)'/);
const msgNo = scQuiz.match(/: '(Abaixo do critério[^']*)'/);
const avaliacao = {
  id: 'm14-quiz', tipo: 'avaliacao',
  marcador: qzBl[0].texto, rotulo_marcador: qzBl[0].rotulo,
  titulo: { html: qzBl[1].html, texto: qzBl[1].texto },
  introducao: { html: qzBl[2].html, texto: qzBl[2].texto, origem: qzBl[2].origem },
  criterio_literal_prosa: { texto: 'O critério é oito de dez.', origem: qzBl[2].origem },
  total_questoes: perguntas.length,
  mecanica_fonte: [
    'as 10 questões são renderizadas juntas (build), com rádio por alternativa',
    'o botão "Corrigir" corrige todas de uma vez: marca a correta (classe right) e a escolhida errada (classe wrong), mostra o feedback `f` de todas e o placar',
    'questão sem resposta conta como erro e também recebe o feedback',
    'o botão "Refazer" reconstrói o quiz e limpa o placar; não há persistência',
  ],
  faixas_de_placar_script: {
    faixas: [
      { condicao: 'acertos >= 8', classe: 'pass', minimo: 8, mensagem: msgOk?.[1] ?? null },
      { condicao: 'acertos < 8', classe: 'fail', maximo: 7, mensagem_html: msgNo?.[1] ?? null, mensagem_texto: msgNo ? texto(msgNo[1]) : null },
    ],
    formato_placar: "acertos+' / '+Q.length",
    origem: { seletor: 'script > QUIZ > corrigir()', trecho_inicial: "sc.className='score show '+(acertos>=8?'pass':'fail');", linha_aprox: lineOf(html.indexOf("sc.className='score show '")) },
    nota_intervalo: '`condicao`, `minimo` e `maximo` são derivados do ternário; só as mensagens são verbatim. A mensagem de reprovação usa innerHTML e contém <b>.',
  },
  rotulos_de_interface_fonte: {
    botao_corrigir: { texto: texto(inner(find(qz.wrap, (n) => n.attrs?.id === 'quiz-go'))), linha_aprox: line(find(qz.wrap, (n) => n.attrs?.id === 'quiz-go')) },
    botao_refazer: { texto: texto(inner(find(qz.wrap, (n) => n.attrs?.id === 'quiz-reset'))), linha_aprox: line(find(qz.wrap, (n) => n.attrs?.id === 'quiz-reset')) },
    rotulo_questao_template: { texto: "'Questão '+(i+1)+' de '+Q.length", linha_aprox: lineOf(html.indexOf("Questão '+(i+1)")) },
    nota: '`perguntas[].rotulo_fonte` é o texto já renderizado pelo template, não um literal do arquivo.',
  },
  script: { linha_ini: Q.linha_ini, linha_fim: Q.linha_fim },
  perguntas,
  codigo_atual: 'Não extraído: nenhum arquivo de src/lib/data traz o quiz do M14.',
};

// =========================================================== CHECKLIST
const fn = secao('final');
const fnBl = blocos(fn.wrap, 'm14-final', 'section#final');
const ul = find(fn.wrap, sel('ul', 'ck'));
const p14 = (t) => {
  const m = [];
  if (/menos de um minuto|minuto/.test(t)) m.push('cronometrado');
  if (/sem consultar nota|Sei dizer|explicar|Recuso .* e devolvo|pergunto:/i.test(t)) m.push('producao_oral_ou_livre');
  if (m.length === 0) m.push('autodeclarado');
  return m;
};
const itensCk = kids(ul, sel('li')).map((li, i) => ({ id: `m14-check-${pad(i + 1)}`, tipo: 'item-checklist', ordem: i + 1, ...ht(li), marcacao_p14: p14(texto(inner(li))), vinculos: { instrumentos_citados: [], aulas_citadas: texto(inner(li)).match(/Aula \d\d/g) || [] }, origem: origem('section#final ul.ck > li', li) }));
const checklist_final = {
  id: 'm14-final', tipo: 'checklist-final',
  marcador: fnBl[0].texto, rotulo_marcador: fnBl[0].rotulo,
  titulo: { html: fnBl[1].html, texto: fnBl[1].texto },
  introducao: { html: fnBl[2].html, texto: fnBl[2].texto, origem: fnBl[2].origem },
  mecanica_fonte: 'Lista ul.ck estática: nenhum script lê ou marca os itens; não há caixa de seleção nem persistência.',
  total_itens: itensCk.length,
  itens: itensCk,
  nota_P14: '`marcacao_p14` é inferida do texto por regra desta extração ("minuto" → cronometrado; "sem consultar nota", "Sei dizer", "pergunto:", "Recuso ... e devolvo" → produção oral/livre; demais → autodeclarado). Precisa de revisão humana. O item 01 é o critério construído (m14-crit-01).',
  fecho: fnBl.find((b) => b.tipo === 'callout'),
  codigo_atual: 'Não extraído: nenhum arquivo de src/lib/data traz o checklist do M14. alexandria-badges.ts não o usa.',
};

// =========================================================== EXERCICIOS
const ex = secao('ex');
const exBl = blocos(ex.wrap, 'm14-ex', 'section#ex');
const tsC = readRepo('src/lib/data/alexandria-modulo-14-content.ts');
const tsEx = [...tsC.matchAll(/id: "(m14-ex-\d\d)",\s*kind: '([^']*)',\s*prompt: ("(?:[^"\\]|\\.)*"),\s*points: (\d+),\s*config: \{ tag: ("(?:[^"\\]|\\.)*"), gabarito: ("(?:[^"\\]|\\.)*") \}/g)]
  .map((m) => ({ id: m[1], kind: m[2], prompt: JSON.parse(m[3]), points: +m[4], tag: JSON.parse(m[5]), gabarito: JSON.parse(m[6]) }));
const exercicios = kids(ex.wrap, sel('details')).map((d, i) => {
  const sm = texto(inner(find(d, sel('summary'))));
  const k = sm.indexOf(' — ');
  const tag = sm.slice(0, k);
  const enun = sm.slice(k + 3);
  const bd = find(d, sel('div', 'det-bd'));
  const ps = kids(bd, sel('p'));
  const gabHtml = ps.map((p) => inline(inner(p)));
  const idd = `m14-ex-${pad(i + 1)}`;
  const aulaDecl = (sm + ' ' + texto(inner(bd))).match(/Aula \d\d/g);
  const c = tsEx.find((x) => x.id === idd);
  return {
    id: idd, tipo: 'exercicio', tag, familia: tag.split(' · ')[1] ?? null,
    aula_declarada: aulaDecl ? aulaDecl : null,
    solto_P9: !aulaDecl,
    enunciado: enun,
    resposta_referencia_html: gabHtml.length === 1 ? gabHtml[0] : gabHtml,
    resposta_referencia_texto: ps.map((p) => texto(inner(p))).join('\n'),
    criterio: null,
    nota_criterio: 'A fonte não dá critério por exercício; só a instrução geral do lede ("Faça o cálculo ou formule a resposta antes de abrir o gabarito").',
    referencias_em_prosa: { modulos: [...new Set((sm + texto(inner(bd))).match(/Módulo \d\d/g) || [])], instrumentos: [...new Set((sm + texto(inner(bd))).match(/INST·\d\d/g) || [])] },
    origem: origem('section#ex details > summary', d, sm),
    comparacao_codigo: c ? {
      id_codigo: c.id,
      prompt_igual: c.prompt === enun,
      tag_igual: c.tag === tag,
      gabarito_igual: c.gabarito === (gabHtml.length === 1 ? gabHtml[0] : gabHtml.join(' ')),
      kind_codigo: c.kind, points_codigo: c.points,
      nota: '`kind: discursiva` e `points: 10` não têm origem na fonte.',
    } : { id_codigo: null, nota: 'ausente no código' },
  };
});
const exIdx = {
  id: 'm14-ex', tipo: 'indice-exercicios',
  marcador: exBl[0].texto, rotulo_marcador: exBl[0].rotulo,
  titulo: { html: exBl[1].html, texto: exBl[1].texto },
  introducao: { html: exBl[2].html, texto: exBl[2].texto, origem: exBl[2].origem },
  familias_declaradas_no_lede: ['identificação de base temporal', 'classificação de rota', 'separação de grandeza', 'estado de política'],
  familias_nas_tags: [...new Set(exercicios.map((e) => e.familia))],
  mecanica_fonte: '<details>/<summary> nativo: o gabarito abre ao clicar no enunciado; não há rótulo de botão nem registro de tentativa.',
  total_na_fonte: exercicios.length,
  vinculados_a_aula: exercicios.filter((e) => !e.solto_P9).length,
  soltos_P9: exercicios.filter((e) => e.solto_P9).length,
  nota_vinculo: 'Varredura por "Aula NN" em tag, enunciado e gabarito dos 14: zero ocorrência. Todos são soltos (P9), como no código. Menções a Módulo 12/13 são referência em prosa, não posse.',
  exercicios,
  codigo_atual: {
    arquivo: 'src/lib/data/alexandria-modulo-14-content.ts (MODULO_14_EXERCICIOS_SOLTOS)',
    total_codigo: tsEx.length,
    identicos: exercicios.filter((e) => e.comparacao_codigo.prompt_igual && e.comparacao_codigo.tag_igual && e.comparacao_codigo.gabarito_igual).length,
    renderizado: false,
    nota: "O array existe, mas RecursosDoModulo.tsx não registra 'modulo-14': os 14 exercícios não aparecem na interface.",
  },
};

// ========================================================== REFERENCIAS
const rf = secao('ref');
const rfBl = blocos(rf.wrap, 'm14-ref', 'section#ref');
const grupos = [];
let atual = null;
for (const n of kids(rf.wrap)) {
  if (n.tag === 'h4') { atual = { titulo: texto(inner(n)), linha_aprox: line(n), itens: [] }; grupos.push(atual); }
  if (n.tag === 'ol' && atual) for (const li of kids(n, sel('li'))) atual.itens.push(li);
}
const DATA_RE = /\b\d{1,2}º? de (?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro) de \d{4}\b|\bde \d{4}\b(?= —|$)|\bano-base \d{4}\b|\b\d{4}(?=\b)/g;
let rn = 0;
const refItens = grupos.flatMap((g) => g.itens.map((li) => {
  rn++;
  const src = find(li, sel('span', 'src'));
  const b = kids(li, sel('b'))[0];
  const resto = inner(li).slice(inner(li).indexOf('</b>') + 4);
  const semSrc = inner(li).replace(/<span class="src">[\s\S]*?<\/span>/, '');
  const t = texto(semSrc);
  const datas = [...new Set((texto(inner(b)) + ' ' + texto(resto)).match(/\b\d{1,2}º? de (?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro) de \d{4}\b/g) || [])];
  const anoTitulo = texto(inner(b)).match(/, de (\d{4})$|nº [\d.]+, de (\d{4})|, de \d{1,2}º? de [a-zç]+ de (\d{4})|\b(\d{4})\b/);
  return {
    id: `m14-ref-${pad(rn)}`, tipo: 'referencia', grupo: g.titulo,
    html: inline(inner(li)), texto: t,
    nota_texto: '`texto` omite o span.src (guardado em natureza_ou_emissor) para não colar as duas palavras.',
    natureza_ou_emissor: texto(inner(src)),
    instituicao: null,
    titulo: texto(inner(b)),
    descricao_html: inline(resto.replace(/^\s*(—|\.)\s*/, '')),
    descricao_texto: texto(resto).replace(/^(—|\.)\s*/, ''),
    dominio_citado: null, url: null,
    datas_literais: datas,
    ano_no_titulo: anoTitulo ? (anoTitulo.slice(1).find(Boolean) ?? null) : null,
    vinculos: { instrumentos_citados: t.match(/INST·\d\d/g) || [], secoes_citadas: t.match(/§\d\d\.\d/g) || [] },
    origem: origem('section#ref ol.ref-list > li', li),
  };
}));
const referencias = {
  id: 'm14-ref', tipo: 'referencias',
  marcador: rfBl[0].texto, rotulo_marcador: rfBl[0].rotulo,
  titulo: { html: rfBl[1].html, texto: rfBl[1].texto },
  introducao: { html: rfBl[2].html, texto: rfBl[2].texto, origem: rfBl[2].origem },
  grupos: grupos.map((g) => ({ titulo: g.titulo, total: g.itens.length, linha_aprox: g.linha_aprox })),
  total: refItens.length,
  itens: refItens,
  nota_campos: '`natureza_ou_emissor` é o span.src literal (ora natureza — "Lei federal", "Decreto", "Interno" —, ora emissor — "ANP", "EPE", "B3"). `instituicao: null` porque a fonte não separa instituição em campo próprio; o emissor, quando existe, está no span.src ou no título. Nenhuma referência tem URL nem domínio (zero <a> e zero <em> no § Ref). `datas_literais` são as datas por extenso achadas por regex; `ano_no_titulo` é o primeiro ano do título.',
  limites: rfBl.find((b) => b.tipo === 'callout'),
  codigo_atual: 'Não extraído: nenhum arquivo de src/lib/data traz as referências do M14.',
};

// ============================================================ GLOSSARIO
const lx = secao('lex');
const lxBl = blocos(lx.wrap, 'm14-lex', 'section#lex');
const gloTS = readRepo('src/lib/data/alexandria-glossario.ts');
const gloCod = [...gloTS.matchAll(/id: "([^"]+)",\s*term: ("(?:[^"\\]|\\.)*")/g)].map((m) => ({ id: m[1], term: JSON.parse(m[2]) }));
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
const familias = [];
const termos = [];
for (const d of kids(lx.wrap, sel('details'))) {
  const sm = find(d, sel('summary'));
  const cnt = find(sm, sel('span'));
  const nome = texto(inner(sm).replace(/<span[\s\S]*<\/span>/, ''));
  const fam = { nome, contagem_declarada: texto(inner(cnt)), itens_medidos: 0, linha_aprox: line(d) };
  familias.push(fam);
  for (const p of findAll(d, sel('p'))) {
    const tspan = find(p, sel('span', 'term'));
    if (!tspan) continue;
    fam.itens_medidos++;
    const resto = inner(p).slice(inner(p).indexOf('</span>') + 7).replace(/^\s*—\s*/, '');
    const termo = texto(inner(tspan));
    const hom = gloCod.filter((g) => norm(g.term) === norm(termo)).map((g) => g.id);
    termos.push({
      id: `m14-lex-${String(termos.length + 1).padStart(3, '0')}`, tipo: 'termo', familia: nome,
      termo, definicao_html: inline(resto), definicao_texto: texto(resto),
      origem: origem('section#lex details .det-bd > p > span.term', p),
      vinculos: { aulas: null, nota: 'A fonte não declara vínculo termo↔aula.' },
      comparacao_codigo: { presente_no_bloco_m14: false, homonimos_em_outros_modulos_do_codigo: hom },
    });
  }
}
const somaDecl = familias.reduce((a, f) => a + parseInt(f.contagem_declarada, 10), 0);
const glossario = {
  id: 'm14-lex', tipo: 'glossario',
  marcador: lxBl[0].texto, rotulo_marcador: lxBl[0].rotulo,
  titulo: { html: lxBl[1].html, texto: lxBl[1].texto },
  introducao: { html: lxBl[2].html, texto: lxBl[2].texto, origem: lxBl[2].origem },
  contagem: {
    prosa_h2: lxBl[1].texto, pill_hero: '158 termos',
    soma_das_familias_declaradas: somaDecl,
    markup_span_term: termos.length,
    familias: familias.length,
    familias_divergentes: familias.filter((f) => parseInt(f.contagem_declarada, 10) !== f.itens_medidos).map((f) => f.nome),
    codigo_bloco_m14: 0,
    ausentes_no_codigo: termos.length,
    com_homonimo_em_outro_modulo_do_codigo: termos.filter((t) => t.comparacao_codigo.homonimos_em_outros_modulos_do_codigo.length).length,
  },
  familias,
  termos,
  codigo_atual: 'alexandria-glossario.ts cobre só os Módulos 01-08 (blocos "Modulo 02..08" e o do M01). Nenhum dos 158 termos do M14 está no código. `homonimos_em_outros_modulos_do_codigo` lista verbetes de outros módulos com o mesmo termo (ids gl-mNN-… são namespaçados; mesma palavra não é duplicata).',
  termos_ausentes_no_codigo: termos.map((t) => t.termo),
};

// ======================================================== DIVERGENCIAS
const refWR = refItens.find((r) => r.titulo.includes('War Room'));
const i8 = literalJS("var R={\n    e1g", '\n  };\n  var C=');
const ex13 = exercicios.find((e) => e.id === 'm14-ex-13');
const divergencias = [
  { id: 'div-m14-caso-parte', tema: 'Caso numerado como "Parte 14"', leitura_a: { onde: '§Caso marcador', texto: caso.marcador }, leitura_b: { onde: 'P17 (decisões do Founder)', texto: 'Não existe "Parte 1"; título "Caso — Operação A"' }, classe: 'fonte × decisão de produto', nota: 'A fonte trata a Operação A como série de 14 partes espalhadas pelos módulos. O texto fica literal; a camada de produto aplica o P17.', decisao: null },
  { id: 'div-m14-caso-familia', tema: 'Trava de anonimização fala em "caso da família"', leitura_a: { onde: '§Ref (Documentos internos)', texto: refWR?.texto ?? null }, leitura_b: { onde: '§Caso', texto: 'Caso sempre anonimizado: Operação A — mineração em Minas Gerais' }, classe: 'fonte × fonte', nota: 'A descrição das travas cita "o caso da família", mas o caso do módulo é uma operação de mineração. Pode ser herança de outro material; não resolvido.', decisao: null },
  { id: 'div-m14-ex13-inst08', tema: 'Ex 13 × INST·08: densidade energética e unidade do diferencial', leitura_a: { onde: 'Ex 13', texto: `${ex13.enunciado} → ${ex13.resposta_referencia_texto.slice(0, 120)}` }, leitura_b: { onde: 'script INST·08', texto: `rota e1g: mj ${i8.valor.e1g.mj}, ref ${i8.valor.e1g.ref}; evit = energiaMJ*ref*(dic/100)/1e6 — o diferencial entra como % da referência fóssil, não como gCO₂e/MJ (o rótulo do campo diz gCO₂e/MJ)` }, classe: 'fonte × fonte', nota: 'Com os padrões do INST·08 (100 mi L, 55, rota e1g) o painel dá ~102.389 t, o Ex 13 dá 116.050 t para os "mesmos" 100 mi L e 55. Ver instrumentos.json (m14-inst-08).', decisao: null },
  { id: 'div-m14-quiz-placar', tema: 'Placar do quiz tem só duas faixas', leitura_a: { onde: '§Quiz lede', texto: 'O critério é oito de dez.' }, leitura_b: { onde: 'script', texto: 'acertos>=8 → "Critério atingido..."; senão → "Abaixo do critério de oito acertos..."' }, classe: 'fonte × fonte (sem conflito)', nota: 'Prosa e script concordam em 8/10 neste módulo. Registrado porque P18 impede que o limiar declare domínio ou libere trilha; a mensagem "Critério atingido. A matéria sustenta uma conversa de uma hora…" afirma competência.', decisao: null },
  { id: 'div-m14-lex-familia-04', tema: 'Nome da Família 04 do glossário', leitura_a: { onde: 'fonte', texto: familias[3]?.nome }, leitura_b: { onde: 'catálogo canônico', texto: 'Biodiesel (20 — …)' }, classe: 'fonte × catálogo', nota: 'O catálogo encurta o nome da família.', decisao: null },
  { id: 'div-m14-ex-familias', tema: 'Famílias do §Ex: lede × tags', leitura_a: { onde: '§Ex lede', texto: exIdx.familias_declaradas_no_lede.join('; ') }, leitura_b: { onde: 'tags dos 14', texto: exIdx.familias_nas_tags.join('; ') }, classe: 'fonte × fonte', nota: 'O lede declara quatro famílias; as tags usam seis rótulos (há "Cálculo" e "Síntese", que não são famílias do lede). Ver também div-m14-quatro-defeitos em modulo.json.', decisao: null },
];

// ============================================================= COBERTURA
const cob = {
  caso: cobertura(inner(cs.wrap), [caso.marcador, caso.titulo.texto, caso.blocos]),
  quiz_markup: cobertura(inner(qz.wrap), [avaliacao.marcador, avaliacao.titulo.texto, avaliacao.introducao.texto, avaliacao.rotulos_de_interface_fonte]),
  quiz_script: cobertura(html.slice(html.indexOf('var Q=[', SCRIPT0), html.indexOf('\n  ];', html.indexOf('var Q=[', SCRIPT0))), perguntas.map((p) => [p.enunciado, p.alternativas.map((a) => a.texto), p.explicacao])),
  final: cobertura(inner(fn.wrap), [checklist_final.marcador, checklist_final.titulo.texto, checklist_final.introducao.texto, itensCk.map((x) => x.texto), checklist_final.fecho]),
  ex: cobertura(inner(ex.wrap), [exIdx.marcador, exIdx.titulo.texto, exIdx.introducao.texto, exercicios.map((e) => [e.tag, e.enunciado, e.resposta_referencia_texto])]),
  ref: cobertura(inner(rf.wrap), [referencias.marcador, referencias.titulo.texto, referencias.introducao.texto, grupos.map((g) => g.titulo), refItens.map((r) => [r.natureza_ou_emissor, r.texto]), referencias.limites]),
  lex: cobertura(inner(lx.wrap), [glossario.marcador, glossario.titulo.texto, glossario.introducao.texto, familias.map((f) => [f.nome, f.contagem_declarada]), termos.map((t) => [t.termo, t.definicao_texto])]),
};

const out = {
  schema: 'alexandria-v2/extracao-fonte/aparato@1',
  modulo: 14, grupo: 'aparato', camada: 'fonte',
  fonte: FONTE, gerado_em: HOJE,
  metodo: 'Seções localizadas por section#id (vocabulário sec-id). Quiz lido avaliando o literal `var Q=[...]` do <script> (L' + Q.linha_ini + '-' + Q.linha_fim + '). Extrator: extratores/m14_aparato.mjs.',
  convencoes: { linha_aprox: 'linha 1-based da abertura do elemento (ou da string no script)', null: 'ausência na fonte, sempre com nota' },
  caso,
  avaliacao,
  checklist_final,
  exercicios: exIdx,
  referencias,
  glossario,
  divergencias,
  cobertura_por_token: cob,
  contagens: {
    caso_perguntas_diagnosticas: perguntasCaso.length,
    caso_colunas_diagnostico: t333?.colunas.length ?? 0,
    caso_itens_diagnostico: t333?.colunas.reduce((a, c) => a + c.itens.length, 0) ?? 0,
    quiz_questoes: perguntas.length,
    quiz_alternativas: perguntas.reduce((a, p) => a + p.alternativas.length, 0),
    quiz_faixas_placar: avaliacao.faixas_de_placar_script.faixas.length,
    checklist_itens: itensCk.length,
    checklist_cronometrados: itensCk.filter((x) => x.marcacao_p14.includes('cronometrado')).length,
    checklist_orais_ou_livres: itensCk.filter((x) => x.marcacao_p14.includes('producao_oral_ou_livre')).length,
    exercicios: exercicios.length,
    exercicios_soltos: exIdx.soltos_P9,
    exercicios_identicos_ao_codigo: exIdx.codigo_atual.identicos,
    referencias: refItens.length,
    referencias_por_grupo: grupos.map((g) => g.itens.length),
    referencias_com_url: 0,
    referencias_com_data_por_extenso: refItens.filter((r) => r.datas_literais.length).length,
    glossario_termos: termos.length,
    glossario_familias: familias.length,
    glossario_ausentes_no_codigo: termos.length,
    divergencias: divergencias.length,
  },
};
write('aparato.json', out);
console.log(JSON.stringify(out.contagens), JSON.stringify(cob));
