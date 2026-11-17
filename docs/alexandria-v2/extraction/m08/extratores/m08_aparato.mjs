// Extrator do grupo "aparato" do M08: caso, quiz, checklist final, exercícios,
// §Voz, referências e glossário. Texto sai da fonte (só leitura); o quiz sai
// do literal `QZ` do <script> executado num DOM falso.
import fs from 'node:fs';
import {
  html, lineOf, texto, inner, ini, origem, pad, secao, all, one, txt,
  filhosDoWrap, bloco, detalhes, runSource, importTs, writeJson, SCRIPT, SCRIPT_START, REPO,
} from './m08_lib.mjs';

const S = runSource();
const X = S.ctx;

// ── CASO ─────────────────────────────────────────────────────
const casoEls = filhosDoWrap('caso');
const casoBlocos = casoEls.map((el, i) => bloco(el, 'caso', i + 1));
const mk = casoBlocos[0];
const partes = [];
let atual = null;
for (const b of casoBlocos.slice(3)) {
  if (b.tipo === 'subtitulo') { atual = { id: `m08-caso-${b.numero.replace('.', '')}`, numero: b.numero, titulo: b.texto, blocos: [], origem: b.origem }; partes.push(atual); continue; }
  if (atual) atual.blocos.push(b);
}
const tabelas = casoBlocos.filter((b) => b.tipo === 'tabela');
const caso = {
  id: 'm08-caso-operacao-a-parte-8',
  tipo: 'caso',
  marcador: mk.marcador,
  rotulo_marcador: mk.rotulo,
  parte_declarada: /Parte (\d+)/.exec(mk.rotulo)?.[0] ?? null,
  parte_nota: 'Diferente do M01, o M08 declara a parte no próprio marcador ("· Parte 8") e no cartão do §MAP ("Operação A · Parte 8"); o lead cita "as sete partes anteriores". O título de produto segue P17 na camada Alexandria.',
  titulo: casoBlocos[1],
  lead: casoBlocos[2],
  secoes: partes,
  dados: {
    tabelas: tabelas.map((t) => ({ cabecalho: t.cabecalho, linhas: t.linhas, origem: t.origem })),
    nota: 'O caso não tem células de dado numérico (case-data-cell) como o M01. Os dados literais são: estado (Minas Gerais), submercado (Sudeste/Centro-Oeste), perfil de carga (plano, em turnos) e a projeção de "aproximadamente 25%" no limite de recebimento (C.3). Nenhum valor de consumo, demanda ou custo da planta.',
  },
  perguntas: null,
  decisao_pedida: null,
  nota_perguntas_decisao: 'Nenhuma pergunta dirigida ao learner e nenhuma decisão pedida. A coluna "Diagnóstico — o que investigar" (C.2) e a frase "O que ele diz é qual pergunta fazer antes de olhar preço" (L1500) são diagnóstico, e o próprio texto diz que não recomenda ("Ele não diz qual fonte contratar…"). Desafio de decisão, se houver, é camada Alexandria (P17).',
  bloco_de_produto_P7: casoBlocos.filter((b) => b.bloco_de_produto_P7),
  vinculos: { modulo_anterior: 'Módulo 07 (C.4: "fecha o ciclo aberto no Módulo 07")', modulo_seguinte: 'Bloco 9 (C.3: "matéria do Bloco 9")' },
  origem: mk.origem,
};

// ── QUIZ ─────────────────────────────────────────────────────
const quizEls = filhosDoWrap('quiz');
const qStart = SCRIPT.indexOf('var QZ = [');
const qLinhas = [...SCRIPT.slice(qStart).matchAll(/\{q:'/g)].map((m) => lineOf(SCRIPT_START + qStart + m.index));
const qMsg = one(/\$id\('q-msg'\)\.textContent = n >= 8\s*\?\s*'([^']*)'\s*:\s*'([^']*)';/, html, 0);
const fbFmt = one(/fb\.innerHTML = \(s === q\.a \? '([^']*)' : '([^']*)'\+\(q\.a\+1\)\+'([^']*)'\) \+ esc\(q\.fb\);/, html, 0);
const quiz = {
  id: 'm08-quiz',
  marcador: bloco(quizEls[0], 'quiz', 0),
  titulo: bloco(quizEls[1], 'quiz', 0),
  lead: bloco(quizEls[2], 'quiz', 0),
  botoes: [...html.slice(secao('quiz').start, secao('quiz').end).matchAll(/<button class="btn[^"]*" id="([^"]+)">([^<]*)<\/button>/g)].map((b) => ({ id_fonte: b[1], rotulo: b[2] })),
  questoes: X.QZ.map((q, i) => ({
    id: `m08-quiz-${pad(i + 1)}`,
    ordem: i + 1,
    enunciado: q.q,
    alternativas: q.o.map((o, j) => ({ indice: j, rotulo_exibido: `opção ${j + 1}`, texto: o, correta: j === q.a })),
    gabarito_indice: q.a,
    explicacao: q.fb,
    aulas_citadas_na_explicacao: [...q.fb.matchAll(/Aula (\d\d)/g)].map((m) => `aula-08-${m[1]}`),
    origem: { seletor: 'script var QZ[' + i + ']', trecho_inicial: q.q.slice(0, 60), linha_aprox: qLinhas[i] },
  })),
  feedback_formato: { correta: fbFmt.m[1], incorreta: `${fbFmt.m[2]}N${fbFmt.m[3]}`, origem: origem('script q-go', 'fb.innerHTML', fbFmt.idx) },
  placar: {
    formato: "n + '/10'",
    faixas: [
      { condicao: 'n >= 8', ramo: 'verdadeiro', classe: 'score show pass', mensagem: qMsg.m[1] },
      { condicao: 'n >= 8', ramo: 'falso', classe: 'score show fail', mensagem: qMsg.m[2] },
    ],
    origem: origem('script q-go', 'q-msg', qMsg.idx),
  },
  nota: 'A ordem das alternativas é fixa (sem embaralhamento). A alternativa correta está na posição 1, 2, 3 ou 4 conforme gabarito_indice. O lead diz "Cada resposta tem retorno explicativo com a aula de origem": o vínculo com aula vem só do parêntese no fim da explicação.',
};

// ── CHECKLIST FINAL ──────────────────────────────────────────
const finEls = filhosDoWrap('final');
const finUl = finEls.find((e) => e.tag === 'ul');
const checklist = {
  id: 'm08-checklist-final',
  marcador: bloco(finEls[0], 'final', 0),
  titulo: bloco(finEls[1], 'final', 0),
  lead: bloco(finEls[2], 'final', 0),
  itens: all(/<li>([\s\S]*?)<\/li>/g, finUl.inner, finUl.openEnd).map(({ m, idx }, i) => ({ id: `m08-check-${pad(i + 1)}`, ordem: i + 1, ...txt(m[1]), aula_vinculada: null, origem: origem('section#final ul.ck > li', ini(m[1], 60), idx) })),
  nota: 'O lead diz que cada verificação "aponta uma aula específica", mas nenhum item declara a aula. Vínculo item → aula, se necessário, é derivado. Marcação P14 por item em modulo.json › criterio[m08-crit-final].',
};

// ── EXERCÍCIOS ───────────────────────────────────────────────
const exS = secao('ex');
const exEls = filhosDoWrap('ex');
const C08 = await importTs('src/lib/data/alexandria-modulo-08-content.ts');
const exCod = Object.fromEntries(C08.MODULO_08_EXERCICIOS_SOLTOS.map((e) => [e.id, e]));
let blocoAtual = null;
const exercicios = [];
for (const el of exEls) {
  if (el.tag === 'h4') { blocoAtual = texto(el.inner); continue; }
  if (el.tag !== 'details') continue;
  const sm = /<summary>([\s\S]*?)<\/summary>/.exec(el.outer);
  const bd = /<div class="det-bd">([\s\S]*)<\/div><\/details>$/.exec(el.outer);
  const tag = /^(\d\d) · /.exec(texto(sm[1]));
  const paras = all(/<p>([\s\S]*?)<\/p>/g, bd[1], el.start + el.outer.indexOf(bd[1])).map(({ m, idx }) => {
    const r = /^<strong>([\s\S]*?)<\/strong>\s*([\s\S]*)$/.exec(m[1].trim());
    return { rotulo: r ? texto(r[1]) : null, ...txt(m[1]), origem: origem(`section#ex details(${tag[1]}) p`, ini(m[1], 50), idx) };
  });
  const id = `m08-ex-${tag[1]}`;
  const cod = exCod[id];
  const refs = [...texto(bd[1]).matchAll(/Aula (\d\d)|Módulo (\d\d)|Bloco (\d+)/g)].map((m) => m[0]);
  const gabTxt = texto(bd[1]);
  exercicios.push({
    id,
    tag: tag[1],
    bloco: blocoAtual,
    enunciado: { html: inner(sm[1]).replace(/^\d\d · /, ''), texto: texto(sm[1]).replace(/^\d\d · /, '') },
    resumo_literal: texto(sm[1]),
    resposta_de_referencia: paras,
    criterio: paras.find((p) => /^Critério/.test(p.rotulo || '')) ?? null,
    criterio_nota: paras.some((p) => /^Critério/.test(p.rotulo || '')) ? null : 'Sem critério próprio declarado (só o Ex·02 traz "Critério de acerto").',
    aula_vinculada: null,
    sem_aula: true,
    referencias_em_prosa: refs,
    comparacao_codigo: cod ? {
      id: cod.id, kind: cod.kind, prompt: cod.prompt, points: cod.points,
      tag_igual_summary: cod.config?.tag === texto(sm[1]),
      gabarito_igual_texto: cod.config?.gabarito === gabTxt,
      gabarito_igual_salvo_espacos: (cod.config?.gabarito || '').replace(/\s+([.,;:])/g, '$1').replace(/\s+/g, ' ') === gabTxt.replace(/\s+([.,;:])/g, '$1'),
    } : null,
    origem: origem(`section#ex details (${blocoAtual})`, texto(sm[1]).slice(0, 60), el.start),
  });
}
const exIndice = {
  id: 'm08-exercicios',
  marcador: bloco(exEls[0], 'ex', 0),
  titulo: bloco(exEls[1], 'ex', 0),
  lead: bloco(exEls[2], 'ex', 0),
  blocos: exEls.filter((e) => e.tag === 'h4').map((e) => texto(e.inner)),
  itens: exercicios,
  nota: 'Nenhum exercício tem tag de aula (as tags são só 01–12). Todos são soltos (P9), como o protocolo §4 já registrava para o M08. Referências em prosa não são posse.',
};

// ── §VOZ ─────────────────────────────────────────────────────
const vozEls = filhosDoWrap('voz');
const vozBl = vozEls.map((el, i) => bloco(el, 'voz', i + 1));
const ol = vozEls.find((e) => e.tag === 'ol');
const ataques = vozEls.filter((e) => e.tag === 'details').map((el, i) => {
  const sm = /<summary>([\s\S]*?)<\/summary>/.exec(el.outer);
  const bd = /<div class="det-bd">([\s\S]*)<\/div><\/details>$/.exec(el.outer);
  const hd = /^Ataque (\d+) · ([^:]+): ([\s\S]*)$/.exec(texto(sm[1]));
  return {
    id: `m08-ataque-${pad(i + 1)}`, numero: Number(hd[1]), interlocutor: hd[2], pergunta: hd[3], resumo_literal: texto(sm[1]),
    partes: all(/<p>([\s\S]*?)<\/p>/g, bd[1], el.start).map(({ m }) => { const r = /^<strong>([\s\S]*?)<\/strong>\s*([\s\S]*)$/.exec(m[1].trim()); return { rotulo: r ? texto(r[1]) : null, ...txt(m[1]) }; }),
    origem: origem('section#voz details', texto(sm[1]).slice(0, 60), el.start),
  };
});
const roteiroTab = vozBl.find((b) => b.tipo === 'tabela');
const voz_oral = {
  id: 'm08-voz',
  marcador: vozBl[0], titulo: vozBl[1], lead: vozBl[2],
  perguntas_relampago: {
    subtitulo: vozBl.find((b) => b.numero === 'V.1'),
    instrucao: vozBl[4],
    itens: all(/<li>([\s\S]*?)<\/li>/g, ol.inner, ol.openEnd).map(({ m, idx }, i) => ({ id: `m08-relampago-${pad(i + 1)}`, ordem: i + 1, ...txt(m[1]), origem: origem('section#voz ol.num-list > li', ini(m[1], 50), idx) })),
    marcacao_p14: ['producao_oral_ou_livre', 'cronometrado', 'sem_consulta'],
    nota_p14: 'Instrução literal: "Responda em voz alta … sem consultar. Onde hesitar mais de três segundos, marque".',
  },
  ataques_de_decisor: {
    subtitulo: vozBl.find((b) => b.numero === 'V.2'),
    instrucao: vozBl[vozBl.findIndex((b) => b.numero === 'V.2') + 1],
    itens: ataques,
    marcacao_p14: ['producao_oral_ou_livre'],
  },
  roteiro_oral: {
    subtitulo: vozBl.find((b) => b.numero === 'V.3'),
    instrucao: vozBl[vozBl.findIndex((b) => b.numero === 'V.3') + 1],
    tabela: roteiroTab,
    fecho: vozBl[vozBl.length - 1],
    marcacao_p14: ['producao_oral_ou_livre', 'cronometrado', 'sem_consulta'],
    nota_p14: '"Grave-se … em dez minutos, sem consultar nada"; corte final "em três minutos".',
  },
};

// ── REFERÊNCIAS ──────────────────────────────────────────────
const refEls = filhosDoWrap('ref');
let grupo = null; const refs = [];
for (const el of refEls) {
  if (el.tag === 'h4') { grupo = texto(el.inner); continue; }
  if (el.tag !== 'ol') continue;
  const start = Number(/start="(\d+)"/.exec(el.outer.slice(0, 60))?.[1] ?? 1);
  all(/<li>([\s\S]*?)<\/li>/g, el.inner, el.openEnd).forEach(({ m, idx }, k) => {
    const r = /^<strong>([\s\S]*?)<\/strong>\s*([\s\S]*)$/.exec(m[1].trim());
    const resto = r ? texto(r[2]) : '';
    const primeira = resto.split(/(?<=\.)\s+/)[0] || '';
    const inst = /^(Empresa de Pesquisa Energética|Operador nacional)\b/.exec(primeira);
    refs.push({
      id: `m08-ref-${pad(start + k)}`, numero: start + k, grupo,
      titulo: r ? texto(r[1]) : null,
      descricao: resto,
      html: inner(m[1]),
      instituicao: inst ? inst[1] : null,
      instituicao_nota: inst ? 'Primeira frase após o título.' : 'Não declarada em campo próprio; quando aparece, está dentro do título ou da descrição (ex.: "do operador", "da agência").',
      datas_e_anos_literais: [...texto(m[1]).matchAll(/(\d{1,2}º? de [a-zç]+ de \d{4}|(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?: e [a-zç]+)? de \d{4}|ano-base \d{4}|ciclo \d{4}–\d{4}|\b(?:19|20)\d{2}\b)/g)].map((d) => d[0]),
      datas_nota: 'Recorte mecânico de datas e anos presentes no texto (inclui anos que fazem parte do nome do documento, como "2035").',
      url: null, dominio: null,
      origem: origem(`section#ref ol.ref-list > li (${grupo})`, texto(m[1]).slice(0, 60), idx),
    });
  });
}
const refBox = bloco(refEls.find((e) => e.tag === 'div' && /^box/.test(e.classe || '')), 'ref', 0);
const referencias = {
  id: 'm08-referencias',
  marcador: bloco(refEls[0], 'ref', 0), titulo: bloco(refEls[1], 'ref', 0), lead: bloco(refEls[2], 'ref', 0),
  grupos: refEls.filter((e) => e.tag === 'h4').map((e) => texto(e.inner)),
  itens: refs,
  data_de_corte: refBox,
  nota: 'Nenhuma referência tem URL nem domínio (zero <a>/<em> com endereço no §Ref). As instituições aparecem por perífrase ("operador nacional", "agência", "câmara de comercialização", "planejador"), não por sigla.',
};

// ── GLOSSÁRIO ────────────────────────────────────────────────
const lexS = secao('lex');
const lexEls = filhosDoWrap('lex');
const termos = []; const grupos = [];
for (const el of lexEls.filter((e) => e.tag === 'details')) {
  const sm = /<summary>([\s\S]*?)<\/summary>/.exec(el.outer);
  const g = /^([\s\S]*?) · (\d+) termos$/.exec(texto(sm[1]));
  const ts = all(/<p><span class="term">([\s\S]*?)<\/span>\s*([\s\S]*?)<\/p>/g, el.outer, el.start);
  grupos.push({ rotulo: g[1], declarados: Number(g[2]), medidos: ts.length, origem: origem('section#lex details summary', texto(sm[1]), el.start) });
  ts.forEach(({ m, idx }) => termos.push({
    termo_bruto: texto(m[1]),
    termo: texto(m[1]).replace(/\.$/, ''),
    grupo: g[1],
    definicao: txt(m[2]),
    origem: origem('section#lex details p > span.term', texto(m[1]), idx),
  }));
}
const GL = (await importTs('src/lib/data/alexandria-glossario.ts'));
const glList = (GL.GLOSSARIO ?? GL.VERBETES ?? GL.default ?? Object.values(GL).find((v) => Array.isArray(v) && v[0]?.term)) || [];
const glM08 = glList.filter((g) => String(g.id).startsWith('gl-m08-'));
const glByTerm = new Map(glM08.map((g) => [g.term, g]));
const glAll = new Map(); for (const g of glList) { if (!glAll.has(g.term)) glAll.set(g.term, []); glAll.get(g.term).push(g.id); }
const comp = termos.map((t, i) => {
  const g = glByTerm.get(t.termo);
  return {
    id: `m08-termo-${String(i + 1).padStart(3, '0')}`, ...t,
    codigo: g ? { id: g.id, definicao_igual: g.definition === t.definicao.html || g.definition === t.definicao.texto, grupo_igual: g.unit === t.grupo, aulaIds: g.aulaIds } : null,
    outros_modulos_com_mesmo_termo: (glAll.get(t.termo) || []).filter((x) => !x.startsWith('gl-m08-')),
  };
});
const faltam = comp.filter((c) => !c.codigo).map((c) => c.termo);
const defDif = comp.filter((c) => c.codigo && !c.codigo.definicao_igual).map((c) => ({ termo: c.termo, fonte: c.definicao.texto, codigo: glByTerm.get(c.termo).definition }));
const extras = glM08.filter((g) => !termos.some((t) => t.termo === g.term)).map((g) => ({ id: g.id, term: g.term }));
const glossario = {
  id: 'm08-glossario',
  marcador: bloco(lexEls[0], 'lex', 0), titulo: bloco(lexEls[1], 'lex', 0), lead: bloco(lexEls[2], 'lex', 0),
  grupos,
  contagem: { declarada_h2: Number(/(\d+) termos/.exec(texto(lexEls[1].inner))[1]), declarada_hero: 124, soma_declarada_grupos: grupos.reduce((a, g) => a + g.declarados, 0), medida: termos.length },
  termos: comp,
  comparacao_codigo: {
    verbetes_gl_m08_no_codigo: glM08.length,
    faltam_no_codigo: faltam,
    definicoes_diferentes: defDif,
    no_codigo_sem_termo_na_fonte: extras,
    ordem_alfabetica_na_fonte: false,
    aulaIds_preenchidos_no_codigo: glM08.filter((g) => g.aulaIds?.length).length,
  },
  nota: 'O termo é o texto do span.term sem o ponto final (pontuação de frase). Os grupos não estão em ordem alfabética; a ordem é de leitura por camada ("Agrupado por camada, para permitir leitura lateral").',
};

// ── divergências do aparato ──────────────────────────────────
const divergencias = [
  { id: 'apa-div-01', tipo: 'fonte (P18)', tema: 'Quiz: lead diz que o critério de domínio é 8 de 10; §00 e §Final dão outras formas do critério', nota: 'Ver modulo.json › mod-div-07. Aqui o script concorda com o lead (n >= 8).' },
  { id: 'apa-div-02', tipo: 'fonte×fonte', tema: 'Quiz Q02: "49,5% renovável" é descrito como matriz energética "plausível"; o texto das aulas diz "próxima de cinquenta por cento" e o §Erros diz "Cinquenta por cento é a matriz energética"', nota: 'Não é contradição de valor, mas o 49,5 só aparece no quiz (zero ocorrências em outra seção).', medicao: { ocorrencias_49_5: [...html.matchAll(/49,5/g)].map((m) => lineOf(m.index)) } },
  { id: 'apa-div-03', tipo: 'fonte×fonte', tema: 'Quiz Q09: "renovação da concessão por trinta anos" só aparece no feedback do quiz', medicao: { ocorrencias_trinta_anos: [...html.matchAll(/trinta anos/g)].map((m) => lineOf(m.index)) } },
  { id: 'apa-div-04', tipo: 'fonte×fonte', tema: 'Checklist: o lead diz "Cada uma que falhar aponta uma aula específica", mas nenhum item nomeia a aula' },
  { id: 'apa-div-05', tipo: 'fonte×fonte', tema: '§Lex: h2 "124 termos", hero "124 termos" e soma dos grupos concordam com a contagem medida', medicao: glossario.contagem, nota: 'Sem divergência de contagem (diferente do M01).' },
  { id: 'apa-div-06', tipo: 'fonte×fonte', tema: 'Glossário "Fator de carga" (média/máxima) × fórmula do INST 10', nota: 'Ver instrumentos.json › inst-div-09.' },
  { id: 'apa-div-07', tipo: 'fonte×código', tema: 'Exercícios no código: prompt vazio e points: 1 sem origem; gabarito achatado em texto', medicao: exercicios.map((e) => ({ id: e.id, prompt: e.comparacao_codigo?.prompt, points: e.comparacao_codigo?.points, tag_igual: e.comparacao_codigo?.tag_igual_summary, gabarito_igual: e.comparacao_codigo?.gabarito_igual_texto, gabarito_igual_salvo_espacos: e.comparacao_codigo?.gabarito_igual_salvo_espacos })) },
  (() => {
    const dir = `${REPO}/src/lib/data`;
    const todos = fs.readdirSync(dir).filter((f) => /\.ts$/.test(f)).map((f) => [f, fs.readFileSync(`${dir}/${f}`, 'utf8')]);
    const amostras = {
      caso_lead: caso.lead.texto.slice(0, 40),
      quiz_q01: quiz.questoes[0].enunciado.slice(0, 40),
      checklist_01: checklist.itens[0].texto.slice(0, 40),
      voz_relampago_01: voz_oral.perguntas_relampago.itens[0].texto?.slice(0, 40) ?? null,
      voz_ataque_01: JSON.stringify(voz_oral.ataques_de_decisor.itens[0]).match(/"texto":"([^"]{10,40})/)?.[1] ?? null,
      ref_01: referencias.itens[0].titulo.slice(0, 40),
    };
    const busca = Object.fromEntries(Object.entries(amostras).map(([k, v]) => [k, { amostra: v, arquivos: v ? todos.filter(([, t]) => t.includes(v)).map(([f]) => f) : null }]));
    return { id: 'apa-div-08', tipo: 'fonte×código', tema: 'Caso, quiz, checklist final, §Voz e §Ref não existem em src/lib/data (medido: os primeiros 40 caracteres de um item de cada grupo, procurados em todos os .ts da pasta)', medicao: busca };
  })(),
  { id: 'apa-div-09', tipo: 'fonte×fonte (leitura)', tema: 'Siglas: o lead do §Lex promete "Toda sigla é expandida na primeira aparição de cada grupo", mas os verbetes não usam siglas (MW, MWh, GW, TWh, tep, MWmed são termos, não siglas expandidas)', nota: 'Registro de leitura; nenhuma sigla de instituição (ONS, ANEEL, EPE, CCEE) aparece no módulo inteiro. P21: a sigla "FC" aparece uma única vez, no rótulo de unidade gerado pelo script do INST 02 ("GW · FC %", L2224), com sentido de fator de capacidade; "MLT" aparece no INST 08 sem expansão no próprio instrumento.', medicao: { FC_linhas: [...html.matchAll(/\bFC\b/g)].map((m) => lineOf(m.index)), MLT: (html.match(/\bMLT\b/g) || []).length,  ONS: (html.match(/\bONS\b/g) || []).length, ANEEL: (html.match(/\bANEEL\b/g) || []).length, EPE: (html.match(/\bEPE\b/g) || []).length, CCEE: (html.match(/\bCCEE\b/g) || []).length } },
];

writeJson('aparato.json', {
  modulo: 'm08',
  fonte: 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo08.html',
  camada: 'fonte',
  gerado_por: 'extratores/m08_aparato.mjs',
  contagens: {
    caso_secoes: caso.secoes.length, caso_tabelas: tabelas.length, caso_perguntas: 0, caso_decisao: 0,
    quiz_questoes: quiz.questoes.length, quiz_alternativas: quiz.questoes.reduce((a, q) => a + q.alternativas.length, 0), quiz_faixas_placar: quiz.placar.faixas.length,
    checklist_itens: checklist.itens.length,
    exercicios: exercicios.length, exercicios_com_aula: exercicios.filter((e) => e.aula_vinculada).length, exercicios_com_criterio: exercicios.filter((e) => e.criterio).length,
    voz_perguntas_relampago: voz_oral.perguntas_relampago.itens.length, voz_ataques: ataques.length, voz_roteiro_linhas: roteiroTab.linhas.length,
    referencias: refs.length, referencias_com_url: 0, referencias_com_data_ou_ano: refs.filter((r) => r.datas_e_anos_literais.length).length,
    glossario_termos: termos.length, glossario_grupos: grupos.length, glossario_faltam_no_codigo: faltam.length, glossario_definicoes_diferentes: defDif.length,
  },
  caso, quiz, checklist_final: checklist, exercicios: exIndice, voz_oral, referencias, glossario, divergencias,
});
console.log('aparato ok', JSON.stringify({ q: quiz.questoes.length, ck: checklist.itens.length, ex: exercicios.length, refs: refs.length, termos: termos.length, faltam: faltam.length, defDif: defDif.length, extras: extras.length, glM08: glM08.length }));
