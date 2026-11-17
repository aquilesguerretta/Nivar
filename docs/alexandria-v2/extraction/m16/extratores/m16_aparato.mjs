// Extrator deterministico do aparato do M16 -> aparato.json
// §Caso, §Fichas, §Quiz (script), §Final, §Ex, §Ref, §Lex. Nenhum texto de conteudo e digitado.
import {
  html, LINES, lineOf, inline, texto, hx, origem, pad, all, divBlock, secao, writeJson, read, CODE, CATALOGO,
  SCRIPT_BASE, evalVar, decode,
} from './lib.mjs';

const one = (re, s, base, sel, n = 60) => {
  const m = re.exec(s); if (!m) throw new Error('nao achado: ' + re);
  return { ...hx(m[1]), origem: origem(sel, texto(m[1]).slice(0, n), base + m.index) };
};
const cab = (id) => { const s = secao(id); return { s, sec_id: one(/<div class="sec-id">([\s\S]*?)<\/div>/, s.body, s.start, `section#${id} .sec-id`), titulo: one(/<h2>([\s\S]*?)<\/h2>/, s.body, s.start, `section#${id} h2`), lede: /<p class="lede">/.test(s.body) ? one(/<p class="lede">([\s\S]*?)<\/p>/, s.body, s.start, `section#${id} p.lede`) : null }; };

// ---------------- CASO ----------------
const C = cab('caso');
const cb = C.s.body, cbase = C.s.start;
const caso = {
  id: 'm16-caso-operacao-a',
  tipo: 'caso',
  camada: 'fonte',
  sec_id: C.sec_id,
  titulo: C.titulo,
  parte: { texto: 'parte 16', origem: C.sec_id.origem },
  nota_parte: 'Diferente do M01, a fonte do M16 numera o caso: sec-id "Operação A — parte 16", h3 16.1-16.3, e o lede cita as partes 9 a 15. P17 (decidida no M01) proíbe "Parte 1" inventada; aqui a numeração é literal da fonte. A aplicação de P17 ao título é da camada Alexandria.',
  lede: C.lede,
  subsecoes: all(/<h3[^>]*><span class="num">([\s\S]*?)<\/span>([\s\S]*?)<\/h3>/g, cb, cbase).map(({ m, idx }) => ({ numero: texto(m[1]), titulo: texto(m[2]), origem: origem('section#caso h3', texto(m[1]), idx) })),
  diagnostico_16_1: all(/<div class="grg-r (\w+)"><div class="grg-k">([\s\S]*?)<\/div><div\s+class="grg-v"><span class="tg2">([\s\S]*?)<\/span>([\s\S]*?)<\/div><\/div>/g, cb, cbase)
    .map(({ m, idx }, i) => ({ id: `m16-caso-grg-${pad(i + 1)}`, classe: m[1], rotulo: texto(m[2]), rotulo_html: inline(m[2]), nota_rotulo: 'no markup o rótulo tem <br> entre o marcador e o tema', etiqueta: texto(m[3]), ...hx(m[4]), origem: origem('section#caso div.grg .grg-r', texto(m[2]).slice(0, 40), idx) })),
  paragrafos: all(/<p>([\s\S]*?)<\/p>/g, cb, cbase).filter(({ idx }) => !html.slice(cbase, idx).includes('<div class="box rd">') || html.slice(cbase, idx).lastIndexOf('</div>') > html.slice(cbase, idx).lastIndexOf('<div class="box rd">'))
    .map(({ m, idx }) => ({ ...hx(m[1]), origem: origem('section#caso > p', texto(m[1]).slice(0, 60), idx) })),
  caixa_16_3: (() => { const i = cb.indexOf('<div class="box rd">'); const blk = divBlock(cb, i); const t = /<span class="tag">([\s\S]*?)<\/span>\s*<p>([\s\S]*?)<\/p>/.exec(blk); return { rotulo: texto(t[1]), ...hx(t[2]), origem: origem('section#caso div.box.rd', texto(t[1]), cbase + i) }; })(),
  dados: null,
  nota_dados: 'O M16 não traz tabela de dados do caso. As características da operação estão no lede (mineração em Minas Gerais, submercado Sudeste/Centro-Oeste, fator de carga elevado, bombeamento como carga deslocável). A caixa 16.3 diz que a operação "permanece anonimizada: sem nome, sem município exato, sem valor de operação".',
  perguntas: null,
  perguntas_embutidas_no_diagnostico: (() => {
    const m = /exige uma pergunta que quase nunca é feita: <b>([\s\S]*?)<\/b>/.exec(decode(cb));
    const at = cbase + cb.indexOf('<b>a recarga cai dentro');
    return [{ texto: texto(m[1]), origem: origem('section#caso 16.2 p > b', texto(m[1]).slice(0, 60), at), nota: 'Pergunta formulada pela fonte dentro do diagnóstico e respondida condicionalmente no mesmo parágrafo ("Se cair dentro… Se cair fora…"). Não é pergunta dirigida ao learner com resposta a registrar.' },
      (() => { const i0 = cb.indexOf('<b>Registrar como pergunta a monitorar'); const t = [cb.slice(i0, cb.indexOf('</b>', i0) + 4)]; return { texto: texto(t[0]), origem: origem('section#caso div.grg (Ruído · 3)', texto(t[0]), cbase + i0), nota: 'Instrução da fonte sobre como tratar o efeito indireto de centros de dados; não formula a pergunta.' }; })()];
  })(),
  nota_perguntas: 'A fonte não formula perguntas ao learner nem pede decisão: entrega o diagnóstico resolvido (3 tendências que mudam a posição, 3 que são ruído) e declara que nada é recomendação.',
  decisao_pedida: null,
  nota_decisao: 'Não há decisão pedida. A caixa 16.3 recusa explicitamente recomendar ("Nada acima é recomendação de adoção de tecnologia"). Desafio de decisão, se houver, é da camada Alexandria (P17), só com fatos do caso.',
  vinculos: { aulas_declaradas: [], citacoes_em_prosa: [{ texto: 'É a mesma conta de simultaneidade da Aula 03, aplicada a uma única instalação', onde: '16.2' }], nota: 'A única menção a aula é em prosa (Aula 03); não é tag de posse (protocolo §4).' },
  codigo_atual: 'Não extraído: nenhum arquivo em src/lib/data contém o caso do M16.',
};

// ---------------- FICHAS ----------------
const F = cab('fichas');
const fichas = {
  id: 'm16-fichas', tipo: 'fichas-de-tendencia', sec_id: F.sec_id, titulo: F.titulo, lede: F.lede,
  itens: all(/<div class="emp">/g, F.s.body, F.s.start).map(({ idx }, i) => {
    const blk = divBlock(html, idx);
    const nm = /<div class="nm">([\s\S]*?)<small>([\s\S]*?)<\/small><\/div>\s*<div\s+class="ar">([\s\S]*?)<\/div>/.exec(blk);
    return {
      id: `m16-ficha-${pad(i + 1)}`, nome: texto(nm[1]), rotulo_ficha: texto(nm[2]), estagio_declarado: texto(nm[3]),
      campos: all(/<div class="emp-row( vazio)?"><div class="emp-k">([\s\S]*?)<\/div><div\s+class="emp-v">([\s\S]*?)<\/div><\/div>/g, blk, idx).map(({ m, idx: ri }) => {
        const mini = /<span class="mini">([\s\S]*?)<\/span>/.exec(m[3]);
        return { campo: texto(m[2]), deliberadamente_incompleto: !!m[1], ...hx(m[3]), nota_menor: mini ? texto(mini[1]) : null, origem: origem('div.emp .emp-row', texto(m[2]), ri) };
      }),
      origem: origem('section#fichas div.emp', texto(nm[1]), idx),
      codigo_atual: 'não extraído',
    };
  }),
};

// ---------------- QUIZ ----------------
const Qz = cab('quiz');
const qStart = html.indexOf('/* ===================== QUIZ', SCRIPT_BASE);
const Q = evalVar(qStart, 'Q');
const L = ['A', 'B', 'C', 'D'];
let cur = Q.idx;
const avaliacao = {
  id: 'm16-quiz', tipo: 'avaliacao', sec_id: Qz.sec_id, titulo: Qz.titulo, lede: Qz.lede,
  criterio_literal: { prosa: 'O critério é oito de dez.', origem: Qz.lede.origem, script: 'acertos>=8' },
  perguntas: Q.val.map((q, i) => {
    const at = html.indexOf(`{q:'${q.q.slice(0, 30)}`, cur); cur = at + 1;
    return {
      id: `m16-quiz-q${pad(i + 1)}`, tipo: 'questao-multipla-escolha',
      rotulo_fonte: `Questão ${i + 1} de ${Q.val.length}`,
      enunciado: decode(q.q),
      alternativas: q.o.map((o, k) => ({ letra: L[k], indice: k, texto: decode(o) })),
      gabarito: { indice: q.a, letra: L[q.a], texto: decode(q.o[q.a]) },
      explicacao: decode(q.f),
      nota_explicacao: 'O feedback é o mesmo para acerto e erro e aparece para todas as questões ao clicar "Corrigir" (fb.innerHTML=q.f).',
      vinculos: { aulas_declaradas: [], nota: 'A fonte não associa questão a aula.' },
      origem: origem(`<script> Q[${i}]`, decode(q.q).slice(0, 60), at),
    };
  }),
  faixas_de_placar_script: [
    { condicao: 'acertos>=8', classe: 'score show pass' },
    { condicao: 'acertos<8', classe: 'score show fail' },
  ].map((f, i) => {
    const a = html.indexOf('sc.innerHTML=', qStart);
    const mm = /\(acertos>=8\s*\?\s*'([^']*)'\s*:\s*'([^']*)'\)/.exec(html.slice(a));
    return { ...f, mensagem_html: mm[i + 1], mensagem: texto(mm[i + 1]), origem: origem('<script> corrigir() sc.innerHTML', texto(mm[i + 1]).slice(0, 60), a) };
  }),
  nota_faixas: '`condicao` e `classe` são lidas da lógica; só `mensagem` é texto verbatim. Formato do placar: `acertos + " / " + Q.length`.',
  rotulos_de_interface_fonte: [
    { texto: 'Corrigir', origem: origem('section#quiz button#quiz-go', 'Corrigir', html.indexOf('id="quiz-go"')) },
    { texto: 'Refazer', origem: origem('section#quiz button#quiz-reset', 'Refazer', html.indexOf('id="quiz-reset"')) },
    { texto: "'Questão '+(i+1)+' de '+Q.length", origem: origem('<script> build()', 'Questão', html.indexOf("Questão '+(i+1)", qStart)), nota: '`rotulo_fonte` de cada questão é o texto já renderizado deste template' },
  ],
  nota_mecanica_fonte: 'anotação: rádios por questão; "Corrigir" marca a certa em todas (classe right), a escolhida errada (wrong), mostra todos os feedbacks e o placar; questão sem resposta conta como erro e recebe a marcação da certa; "Refazer" reconstrói tudo e limpa o placar; sem persistência.',
  codigo_atual: 'Não extraído: nenhum arquivo em src/lib/data contém o quiz do M16.',
};

// ---------------- CHECKLIST FINAL ----------------
const Fi = cab('final');
const checklist_final = {
  id: 'm16-checklist-final', tipo: 'checklist', sec_id: Fi.sec_id, titulo: Fi.titulo,
  itens: all(/<li>([\s\S]*?)<\/li>/g, Fi.s.body, Fi.s.start).map(({ m, idx }, i) => ({
    id: `m16-check-${pad(i + 1)}`, ...hx(m[1]),
    marcacao_p14: [/em menos de um minuto/.test(texto(m[1])) ? 'cronometrado' : null, 'autodeclarado'].filter(Boolean),
    origem: origem('section#final ul.ck > li', texto(m[1]).slice(0, 60), idx),
  })),
  caixa: (() => { const i = Fi.s.body.indexOf('<div class="box gd">'); const blk = divBlock(Fi.s.body, i); const t = /<span class="tag">([\s\S]*?)<\/span>\s*<p>([\s\S]*?)<\/p>/.exec(blk); return { rotulo: texto(t[1]), ...hx(t[2]), origem: origem('section#final div.box.gd', texto(t[1]), Fi.s.start + i) }; })(),
  nota: 'A lista é ul.ck sem checkbox nem script: não há marcação nem persistência na fonte.',
  codigo_atual: 'Não extraído (alexandria-badges.ts só tem checklists dos Módulos 01-03).',
};

// ---------------- EXERCICIOS ----------------
const E = cab('ex');
const conteudo = read(CODE.conteudo);
const codeEx = [...conteudo.matchAll(/id: "(m16-ex-\d\d)",\s*kind: '(\w+)',\s*prompt: ("(?:[^"\\]|\\.)*"),\s*points: (\d+),\s*config: \{ tag: ("(?:[^"\\]|\\.)*"), gabarito: ("(?:[^"\\]|\\.)*") \}/g)]
  .map((m) => ({ id: m[1], kind: m[2], prompt: JSON.parse(m[3]), points: +m[4], tag: JSON.parse(m[5]), gabarito: JSON.parse(m[6]) }));
const fams = all(/<h4>([\s\S]*?)<\/h4>/g, E.s.body, E.s.start);
const exItens = all(/<details><summary>([\s\S]*?)<\/summary>\s*<div class="det-bd">([\s\S]*?)<\/div><\/details>/g, E.s.body, E.s.start).map(({ m, idx }, i) => {
  const fam = fams.filter((f) => f.idx < idx).pop();
  const sum = texto(m[1]);
  const num = /^(\d\d) · /.exec(sum);
  const ps = all(/<p>([\s\S]*?)<\/p>/g, m[2]).map(({ m: p }) => inline(p[1]));
  const cod = codeEx.find((c) => c.id === `m16-ex-${num[1]}`);
  const alvo = `${sum} ${texto(m[2])}`;
  return {
    id: `m16-ex-${num[1]}`,
    numero_fonte: num[1],
    familia: texto(fam.m[1]),
    tag: null,
    nota_tag: 'A fonte não tem tag por exercício (só o número no summary e o h4 da família).',
    enunciado: { html: inline(m[1]).replace(/^\d\d · /, ''), texto: sum.replace(/^\d\d · /, ''), summary_completo: sum },
    resposta_de_referencia: { html: ps.length === 1 ? ps[0] : ps, texto: texto(m[2]), paragrafos: ps.length },
    criterio: null,
    nota_criterio: 'Sem critério por exercício; orientação geral no lede do §Ex (ver modulo.json criterio m16-crit-exercicios).',
    aula_vinculada: null,
    solto_P9: true,
    mencoes_a_aula_em_prosa: (alvo.match(/\b[Aa]ula\s*\d+/g) || []),
    origem: origem('section#ex details > summary', sum.slice(0, 60), idx),
    codigo_atual: cod ? {
      id: cod.id, kind: cod.kind,
      prompt_igual_summary: cod.prompt === sum,
      gabarito_igual: cod.gabarito === (ps.length === 1 ? ps[0] : ps.join(' ')),
      tag_codigo: cod.tag, tag_tem_origem: false,
      points_codigo: cod.points, points_tem_origem: false,
    } : null,
  };
});
const exercicios = {
  id: 'm16-exercicios', tipo: 'indice-de-exercicios', sec_id: E.sec_id, titulo: E.titulo, lede: E.lede,
  familias: fams.map(({ m, idx }) => ({ texto: texto(m[1]), origem: origem('section#ex h4', texto(m[1]), idx) })),
  itens: exItens,
  contagens: { na_fonte: exItens.length, vinculados_a_aula: exItens.filter((x) => x.aula_vinculada).length, soltos: exItens.filter((x) => x.solto_P9).length, no_codigo: codeEx.length },
  rotulo_de_revelacao: { texto: null, nota: 'Não há botão: a revelação é o <details> nativo (marcador "+" via CSS summary::after). O h2 diz "gabarito fechado até você tentar", mas nada impede abrir sem tentar.' },
  codigo_atual: 'MODULO_16_EXERCICIOS_SOLTOS (16) em alexandria-modulo-16-content.ts; não registrado em RecursosDoModulo.tsx.',
};

// ---------------- REFERENCIAS ----------------
const Rf = cab('ref');
const rb = Rf.s.body, rbase = Rf.s.start;
const ulAt = rb.indexOf('<ul class="ref-list">');
const MES = '(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)';
const reData = new RegExp(`\\b\\d{1,2}º?(?: de ${MES} de \\d{4}|\\/\\d{2}\\/\\d{4}|\\/\\d{2})|\\b${MES} de \\d{4}|\\b(?:19|20)\\d{2}(?:[–-]\\d{4})?\\b`, 'g');
const referencias = {
  id: 'm16-referencias', tipo: 'referencias', sec_id: Rf.sec_id, titulo: Rf.titulo, lede: Rf.lede,
  data_de_consulta_global: { texto: '4 de agosto de 2026', origem: Rf.lede.origem, nota: 'Declarada uma vez no lede para todas as fontes; nenhum item traz data de consulta própria.' },
  itens: all(/<li><span class="src">([\s\S]*?)<\/span>([\s\S]*?)<\/li>/g, rb.slice(ulAt, rb.indexOf('</ul>', ulAt)), rbase + ulAt).map(({ m, idx }, i) => {
    const t = texto(m[2]);
    return {
      id: `m16-ref-${pad(i + 1)}`, tipo: 'referencia',
      categoria_fonte: texto(m[1]),
      ...hx(m[2]),
      titulo: null,
      nota_titulo: 'A fonte não separa título de descrição; o item inteiro é o texto.',
      instituicao: null,
      nota_instituicao: 'Descrita por estrutura (régua de nomeação §00.7); nenhum nome próprio de instituição em <b>.',
      dominio_citado: null, url: null,
      datas_citadas: t.match(reData) || [],
      nota_datas: 'Datas extraídas por regex do texto (anotação); o sentido de cada data (publicação, vigência, prazo) está no próprio texto.',
      destaques: all(/<b>([\s\S]*?)<\/b>/g, m[2]).map(({ m: b }) => texto(b[1])),
      origem: origem('section#ref ul.ref-list > li', texto(m[1]), idx),
    };
  }),
  gatilhos_de_reverificacao: (() => {
    const h3 = /<h3[^>]*><span class="num">([\s\S]*?)<\/span>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/.exec(rb);
    const tb = rb.indexOf('<table class="tbl">');
    const tbl = rb.slice(tb, rb.indexOf('</table>', tb));
    return {
      numero: texto(h3[1]), titulo: texto(h3[2]), introducao: hx(h3[3]), origem: origem('section#ref h3 Ref.2', texto(h3[2]), rbase + h3.index),
      cabecalho: all(/<th>([\s\S]*?)<\/th>/g, tbl).map(({ m }) => texto(m[1])),
      linhas: all(/<tr><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td><\/tr>/g, tbl, rbase + tb).map(({ m, idx }) => ({ tema: texto(m[1]), onde_verificar: texto(m[2]), gatilho: hx(m[3]), origem: origem('section#ref table.tbl tr', texto(m[1]), idx) })),
    };
  })(),
  caixa: (() => { const i = rb.indexOf('<div class="box rd">'); const blk = divBlock(rb, i); const t = /<span class="tag">([\s\S]*?)<\/span>\s*<p>([\s\S]*?)<\/p>/.exec(blk); return { rotulo: texto(t[1]), ...hx(t[2]), origem: origem('section#ref div.box.rd', texto(t[1]), rbase + i) }; })(),
  colofao_modulo: { nota: 'O M16 não tem colofão com versão; o rodapé (modulo.json identidade.rodape) repete a data de verificação.' },
  codigo_atual: 'Não extraído (BibliotecaView.tsx cobre o M01).',
};

// ---------------- GLOSSARIO ----------------
const Lx = cab('lex');
const glo = read(CODE.glossario);
const codeTerms = [...glo.matchAll(/id: "([^"]+)",\s*term: "([^"]*)",\s*unit: "([^"]*)",\s*definition:\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => ({ id: m[1], term: m[2], unit: m[3], definition: JSON.parse(`"${m[4]}"`) }));
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const familias = all(/<details><summary>([\s\S]*?)<\/summary>\s*<div class="det-bd">\s*<p>([\s\S]*?)<\/p>\s*<\/div><\/details>/g, Lx.s.body, Lx.s.start).map(({ m, idx }, fi) => {
  const sum = texto(m[1]);
  const fm = /^Família (\d) · (.+) — (\d+) termos$/.exec(sum);
  const pStart = idx + m[0].indexOf(m[2]);
  const spans = all(/<span class="term">([\s\S]*?)<\/span>/g, m[2], pStart);
  const termos = spans.map(({ m: s, idx: si }, k) => {
    const endRel = k + 1 < spans.length ? spans[k + 1].idx - pStart : m[2].length;
    const startRel = si - pStart + s[0].length;
    const def = m[2].slice(startRel, endRel);
    const defTxt = texto(def).replace(/^—\s*/, '');
    const term = texto(s[1]);
    const homon = codeTerms.filter((c) => norm(c.term) === norm(term));
    return {
      id: `m16-lex-${fi + 1}-${pad(k + 1)}`,
      termo: term,
      familia: fm ? fm[2] : sum,
      definicao: { html: inline(def).replace(/^—\s*/, ''), texto: defTxt },
      vinculos: { aulas_declaradas: [], nota: 'A fonte não liga verbete a aula.' },
      codigo_atual: { status: 'ausente', homonimos_em_outros_modulos: homon.map((h) => ({ id: h.id, term: h.term, definicao_igual: h.definition === defTxt })) },
      origem: origem('section#lex details p span.term', term, si),
    };
  });
  return { numero: fm ? +fm[1] : null, nome: fm ? fm[2] : null, contagem_declarada: fm ? +fm[3] : null, contagem_markup: termos.length, summary: sum, origem: origem('section#lex details > summary', sum, idx), termos };
});
const todos = familias.flatMap((f) => f.termos);
const cat = read(CATALOGO);
const catSec = cat.slice(cat.indexOf('## Módulo 16 — Tendências e Disrupções'), cat.indexOf('## Módulo 17'));
const catFam = [...catSec.replace(/\r?\n/g, ' ').matchAll(/([A-ZÁÉ][^;:()]*?) \((\d+)(?: —|\))/g)].map((m) => ({ nome: m[1].replace(/^.*?famílias: /, '').trim(), n: +m[2] }));
const glossario = {
  id: 'm16-glossario', tipo: 'glossario-do-modulo', sec_id: Lx.sec_id, titulo: Lx.titulo, lede: Lx.lede,
  contagem: {
    prosa_declara: Lx.titulo.texto,
    markup_span_term_no_lex: todos.length,
    soma_declarada_por_familia: familias.reduce((a, f) => a + (f.contagem_declarada || 0), 0),
    familias: familias.map((f) => ({ numero: f.numero, nome: f.nome, declarada: f.contagem_declarada, markup: f.contagem_markup })),
    catalogo_familias: catFam,
    codigo_gl_m16: codeTerms.filter((c) => /^gl-m16-/.test(c.id)).length,
    termos_ausentes_no_codigo: todos.length,
    termos_com_homonimo_em_outro_modulo: todos.filter((t) => t.codigo_atual.homonimos_em_outros_modulos.length).length,
  },
  palavras_de_colisao_declaradas: {
    lede: 'crédito, carga, capacidade e flexibilidade',
    presentes_como_verbete: ['crédito', 'carga', 'capacidade', 'flexibilidade'].map((w) => ({ palavra: w, verbetes: todos.filter((t) => norm(t.termo).startsWith(norm(w))).map((t) => t.termo) })),
  },
  familias,
  termos_ausentes_no_codigo: todos.map((t) => t.termo),
  codigo_atual: 'alexandria-glossario.ts não tem bloco do M16 (ids gl-m02..gl-m08 + os 38 do M01).',
};

// ---------------- DIVERGENCIAS ----------------
const f03 = fichas.itens[2];
const orto = [['ministérial', /ministérial/g], ['prórroga', /prórroga/g], ['controvéria', /controvéria/g], ['milhóes', /milhóes/g], ['acção', /acção/g], ['perimetro', /perimetro/g]].map(([w, re]) => {
  const src = decode(html); const lines = [];
  let m; while ((m = re.exec(src))) lines.push(src.slice(0, m.index).split('\n').length);
  return { forma: w, ocorrencias: lines.length, linhas: lines };
}).filter((x) => x.ocorrencias);
const divergencias = [
  { id: 'div-m16-estagio-medicao', tema: 'Estágio da medição avançada: rótulo da ficha × régua', leitura_a: { onde: `§Fichas ficha 03 L${f03.origem.linha_aprox}`, texto: f03.estagio_declarado }, leitura_b: { onde: 'INST·02 REAL.med=3 + POS[3].n (script L5079/L5084); INST·01 ROT.est.med', texto: 'Regulado e não construído / 3 · regulado' }, nota: 'A ficha e o painel do INST·01 (D.est.med.t = "Regulado, em implantação inicial") qualificam a posição 3; o veredito do INST·02 para medição na posição 3 diz "classificada como regulado e não construído". A régua (§00.3) define a posição 3 com "não há ativo operando", e a fonte registra obrigação de instalação correndo desde 1º/03/2026.', decisao: 'não escolhida' },
  { id: 'div-m16-ref-data-consulta', tema: '"com data de consulta" × itens sem data', leitura_a: { onde: 'section#ref h2', texto: Rf.titulo.texto }, leitura_b: { onde: 'section#ref p.lede', texto: 'Todas verificadas em 4 de agosto de 2026.' }, nota: 'A data de consulta é única e global; nenhum dos 38 itens tem data própria de consulta, URL ou domínio.', decisao: 'registrar (lacuna D5)' },
  { id: 'div-m16-ex-gabarito-fechado', tema: '"gabarito fechado até você tentar" × <details> livre', leitura_a: { onde: 'section#ex h2', texto: E.titulo.texto }, leitura_b: { onde: 'section#ex details', texto: '16 <details> abríveis sem registro de tentativa' }, nota: 'Relevante para C7 (tentativa antes da referência).', decisao: 'registrar' },
  { id: 'div-m16-quiz-q02-microhibridos', tema: 'Q02: frase sobre micro-híbridos', leitura_a: { onde: 'Q[1].f', texto: 'Micro-híbridos sequer entram no rótulo, mas entram nele em vários materiais.' }, leitura_b: { onde: 'Q[1].o[3]', texto: '244.961 — os 215.023 somados aos micro-híbridos do período.' }, nota: 'A explicação diz que micro-híbridos não entram no rótulo e, na mesma frase, que entram "em vários materiais" (sujeito implícito). Leitura ambígua registrada; não reescrita.', decisao: 'registrar' },
  { id: 'div-m16-lex-colisao', tema: 'Lede do §Lex promete as quatro palavras de colisão', leitura_a: { onde: 'section#lex p.lede', texto: Lx.lede.texto }, leitura_b: { onde: 'verbetes', texto: glossario.palavras_de_colisao_declaradas.presentes_como_verbete.map((p) => `${p.palavra}: ${p.verbetes.join(', ') || '(nenhum verbete começando pela palavra)'}`).join(' | ') }, nota: 'Conferência por prefixo do termo (anotação). As glosas completas estão no §00.5 (modulo.json tese.glosas_de_desambiguacao).', decisao: glossario.palavras_de_colisao_declaradas.presentes_como_verbete.every((p) => p.verbetes.length) ? 'sem divergência: as quatro palavras têm verbete' : 'registrar' },
  { id: 'div-m16-ortografia', tema: 'Resíduos ortográficos da fonte', leitura_a: { onde: 'fonte', texto: orto.map((o) => `${o.forma} ×${o.ocorrencias}`).join(', ') }, leitura_b: { onde: 'norma culta', texto: 'ministerial, prorroga, controvérsia, milhões, ação (grafia pós-Acordo), perímetro' }, nota: 'Mantidos literais nesta extração (camada fonte). Linhas: ' + orto.map((o) => `${o.forma} L${o.linhas.join('/L')}`).join('; '), decisao: 'registrar; correção é editorial (camada Alexandria)' },
  { id: 'div-m16-exercicios-codigo', tema: 'Exercícios: campos sem origem no código', leitura_a: { onde: 'fonte §Ex', texto: 'summary "NN · enunciado" + det-bd; sem tag, sem pontuação' }, leitura_b: { onde: 'alexandria-modulo-16-content.ts', texto: `tag "Ex N", points: ${[...new Set(codeEx.map((c) => c.points))].join('/')}, kind 'discursiva'` }, nota: `tag e points são invenção do código (como COD-09 do M01). prompt igual ao summary: ${exItens.filter((x) => x.codigo_atual?.prompt_igual_summary).length}/16; gabarito igual: ${exItens.filter((x) => x.codigo_atual?.gabarito_igual).length}/16.`, decisao: 'registrar (fonte × código)' },
  { id: 'div-m16-glossario-codigo', tema: 'Glossário do M16 ausente no código', leitura_a: { onde: 'section#lex', texto: `${todos.length} span.term em 8 famílias` }, leitura_b: { onde: 'alexandria-glossario.ts', texto: '0 verbetes gl-m16' }, nota: `Os ${todos.length} termos faltam. ${glossario.contagem.termos_com_homonimo_em_outro_modulo} têm homônimo (mesmo termo, outro módulo) — verbetes distintos por decisão do próprio código.`, decisao: 'registrar (fonte × código)' },
];

const doc = {
  grupo: 'aparato',
  modulo: 'M16',
  camada: 'fonte',
  fonte: { arquivo: 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo16.html', linhas: LINES.length, acesso: 'somente leitura' },
  gerado_por: 'docs/alexandria-v2/extraction/m16/extratores/m16_aparato.mjs',
  convencoes: {
    html: 'HTML inline preservado, entidades decodificadas, espaços colapsados',
    texto: 'mesmo conteúdo sem tags',
    anotacao: 'campos `nota*`, `tipo`, `marcacao_p14`, `mecanica_fonte`, `datas_citadas`, `homonimos*`, `decisao`, `tema` são anotação',
  },
  contagens: {
    caso: { subsecoes: caso.subsecoes.length, linhas_diagnostico: caso.diagnostico_16_1.length, paragrafos: caso.paragrafos.length, perguntas: 0, decisao: 0 },
    fichas: { fichas: fichas.itens.length, campos_por_ficha: [...new Set(fichas.itens.map((f) => f.campos.length))], campos_incompletos: fichas.itens.reduce((a, f) => a + f.campos.filter((c) => c.deliberadamente_incompleto).length, 0) },
    quiz: { questoes: avaliacao.perguntas.length, alternativas_por_questao: [...new Set(avaliacao.perguntas.map((p) => p.alternativas.length))], faixas_placar: avaliacao.faixas_de_placar_script.length, gabarito_por_letra: avaliacao.perguntas.reduce((a, p) => ((a[p.gabarito.letra] = (a[p.gabarito.letra] || 0) + 1), a), {}) },
    checklist: { itens: checklist_final.itens.length, cronometrados: checklist_final.itens.filter((i) => i.marcacao_p14.includes('cronometrado')).length },
    exercicios: exercicios.contagens,
    referencias: { itens: referencias.itens.length, com_url: 0, com_dominio: 0, gatilhos: referencias.gatilhos_de_reverificacao.linhas.length },
    glossario: { termos: todos.length, familias: familias.length, ausentes_no_codigo: todos.length },
    divergencias: divergencias.length,
  },
  caso, fichas, avaliacao, checklist_final, exercicios, referencias, glossario, divergencias,
};
writeJson('aparato.json', doc);
console.log(JSON.stringify(doc.contagens, null, 1));
console.log(glossario.contagem.familias, catFam);
console.log(exItens.map((x) => `${x.id} ${x.codigo_atual?.prompt_igual_summary}/${x.codigo_atual?.gabarito_igual} ${x.mencoes_a_aula_em_prosa}`).join('\n'));
