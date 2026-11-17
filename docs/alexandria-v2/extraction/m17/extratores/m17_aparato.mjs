// Extrator deterministico do grupo "aparato" do M17 -> aparato.json
import * as L from './lib.mjs';
import * as B from './blocos.mjs';

const { T, H, find, findAll, classIs, hasClass, origem, lineOf, pad, els } = L;
const D = 'file:///' + L.DATA + '/';
const C17 = await import(D + 'alexandria-modulo-17-content.ts');
const GLO = await import(D + 'alexandria-glossario.ts');

const blocos = (id) => B.blocosDaSecao(id).map((b, i) => ({ id: `m17-${id}-b${pad(i + 1)}`, ...b }));

// ───────────── CASO ─────────────
const caso = L.secao('caso');
const cb = blocos('caso');
const h3s = cb.filter((b) => b.tipo === 'subtitulo');
const esc = cb.find((b) => b.tipo === 'escada');
const p7 = cb.find((b) => b.tipo === 'sete_declaracoes');
const boxes = cb.filter((b) => b.tipo === 'destaque');
const casoObj = {
  id: 'm17-caso-operacao-a',
  tipo: 'caso',
  marcador: { html: caso.marcador_html, texto: caso.marcador_texto, origem: origem('section#caso .sec-id', caso.sid) },
  rotulo_marcador: caso.rotulo,
  parte: (/Parte (\d+)/.exec(caso.rotulo) || [])[0] || null,
  nota_parte: 'Diferente do M01, aqui a fonte numera literalmente a parte ("Parte 17", no .sec-id) e o lede recapitula as Partes 11–16. P17 (título "Caso — Operação A") é decisão de produto; o registro literal fica.',
  titulo: { html: H(caso.h2), texto: T(caso.h2), origem: origem('section#caso h2', caso.h2) },
  lede: (() => { const b = cb.find((x) => x.tipo === 'lede'); return { html: b.html, texto: b.texto, origem: b.origem }; })(),
  blocos: cb,
  perguntas: h3s.map((h, i) => ({ id: `m17-caso-pergunta-${pad(i + 1)}`, html: h.html, texto: h.texto, origem: h.origem })),
  nota_perguntas: 'As duas perguntas são os <h3> literais do caso. A fonte as responde no próprio texto (etapas + diagnóstico); não há campo de resposta do learner.',
  etapas_pergunta_1: esc.itens.map((it, i) => ({ id: `m17-caso-etapa-${pad(i + 1)}`, ...it })),
  diagnostico_pergunta_2: p7.itens.map((it) => ({ id: `m17-caso-decl-${it.numero}`, estado_fonte: /\bhave\b/.test(it.classe) ? 'declarada' : /\bmiss\b/.test(it.classe) ? 'ausente' : null, ...it })),
  destaques: boxes.map((b) => ({ id: b.id, rotulo: b.rotulo, variante: b.variante, origem: b.origem })),
  decisao_pedida: null,
  nota_decisao: 'A fonte não pede decisão ao learner. Ela declara o contrário: "nenhuma das duas admite recomendação fechada" (lede) e "Diagnóstico, sempre; recomendação fechada, nunca." (destaque "Fronteira desta análise, declarada"). P17 autoriza um Desafio de decisão da camada Alexandria, fora desta extração.',
  dados_do_caso: null,
  nota_dados: 'Não há tabela de dados do caso (diferente do M01). Os fatos do perfil estão no lede: "Operação A — mineração em Minas Gerais", submercado Sudeste/Centro-Oeste, fator de carga elevado, bombeamento como carga deslocável, e as referências às Partes 11–16.',
  vinculos_aula_declarados: null,
  nota_vinculos: 'A fonte não liga o caso a aula por id. O texto remete a "Módulo 10" e "Módulo 16" (outros módulos) e ao conteúdo das Aulas 01 (sete declarações) e 08 (mecanismo de fronteira) sem citá-las por número.',
  codigo_atual: 'ausente de src/lib/data',
};

// ───────────── FICHAS ─────────────
const fb = blocos('fichas');
const fichas = {
  id: 'm17-fichas',
  tipo: 'fichas_de_jurisdicao',
  marcador: { html: L.secao('fichas').marcador_html, texto: L.secao('fichas').marcador_texto },
  titulo: { html: H(L.secao('fichas').h2), texto: T(L.secao('fichas').h2) },
  lede: (() => { const b = fb.find((x) => x.tipo === 'lede'); return { html: b.html, texto: b.texto, origem: b.origem }; })(),
  itens: fb.filter((b) => b.tipo === 'ficha').map((b, i) => ({ ...b, id: `m17-ficha-${pad(i + 1)}`, lacuna_c_exercicio: /\(c\) _+/.test(b.campos[b.campos.length - 1].texto) })),
  nota_de_fonte: (() => { const b = fb.find((x) => x.tipo === 'nota_de_fonte'); return { html: b.html, texto: b.texto, origem: b.origem }; })(),
  codigo_atual: 'ausente de src/lib/data',
};

// ───────────── QUIZ ─────────────
const Q = L.evalLiteral('var Q=');
const quizSec = L.secao('quiz');
const corr = L.scriptSlice('function corrigir(){', "$id('quiz-go')");
const render = L.scriptSlice('box.innerHTML = Q.map(', 'var picked={};');
// [verificação 2026-09-17] o 1º ternário do corrigir() é a classe ('pass':'fail'); as mensagens exibidas
// estão no ternário de sc.innerHTML. A versão anterior capturava 'pass'/'fail' como mensagem.
const msgs = /\?\s*'([^']*)'\s*:\s*'([^']*)'/.exec(corr.codigo.slice(corr.codigo.indexOf('sc.innerHTML')));
const qStart = L.lineOfScript('var Q=[');
const avaliacao = {
  id: 'm17-quiz',
  tipo: 'avaliacao-do-modulo',
  marcador: { html: quizSec.marcador_html, texto: quizSec.marcador_texto, origem: origem('section#quiz .sec-id', quizSec.sid) },
  titulo: { html: H(quizSec.h2), texto: T(quizSec.h2), origem: origem('section#quiz h2', quizSec.h2) },
  introducao: L.lit(find(quizSec.node, (n) => classIs(n, 'lede')), 'section#quiz p.lede'),
  mecanica_fonte: 'Anotação: as 10 questões são renderizadas de uma vez; o clique numa alternativa só registra a escolha (sem feedback). O botão "Corrigir" marca certo/errado em todas, mostra o feedback de todas ("Resposta correta: alternativa N." + explicação) e o placar N/10 com uma de duas mensagens. "Refazer" limpa tudo. Sem persistência. Feedback idêntico para acerto e erro. Classes right/wrong e pass/fail (cor) — registro, não decisão.',
  total_questoes: Q.valor.length,
  criterio_literal: { titulo: T(quizSec.h2), limiar: { acertos: 8, total: 10 } },
  faixas_de_placar_script: {
    faixas: [
      { condicao: 'acertos>=8', intervalo: '8–10', classe: 'pass', mensagem: msgs[1] },
      { condicao: 'acertos<8', intervalo: '0–7', classe: 'fail', mensagem: msgs[2] },
    ],
    formato_placar: "'<div class=\"big\">'+acertos+'/10</div>'",
    origem: { seletor: '<script> QUIZ corrigir()', trecho_inicial: "sc.className='score show '+(acertos>=8?'pass':'fail')", linha_aprox: L.lineOfScript("sc.className='score show '") },
    nota: '`condicao`, `intervalo` e `classe` descrevem a lógica; só `mensagem` é texto exibido.',
  },
  rotulos_de_interface_fonte: {
    cabecalho_questao: "'Questão '+(i+1)+' de '+Q.length",
    botao_corrigir: 'Corrigir', botao_refazer: 'Refazer',
    prefixo_feedback: "'<b>Resposta correta: alternativa '+(q.a+1)+'.</b> '",
    origem: { seletor: '<script> QUIZ render', trecho_inicial: 'box.innerHTML = Q.map(', linha_aprox: render.linha_inicio },
  },
  perguntas: Q.valor.map((q, i) => ({
    id: `m17-quiz-q${pad(i + 1)}`,
    numero: i + 1,
    enunciado_html: q.q, enunciado_texto: L.texto(q.q),
    alternativas: q.o.map((o, j) => ({ indice: j, numero_exibido: j + 1, html: o, texto: L.texto(o) })),
    gabarito: { indice: q.a, numero_exibido: q.a + 1, texto: L.texto(q.o[q.a]) },
    explicacao_html: q.f, explicacao_texto: L.texto(q.f),
    feedback_igual_para_acerto_e_erro: true,
    vinculo_aula_declarado: null,
    mencoes_em_prosa: [...new Set(((q.q + ' ' + q.f).match(/Aula \d+|Instrumento \d+|Módulo \d+/g) || []))],
    origem: { seletor: '<script> var Q=[…]', trecho_inicial: L.texto(q.q).slice(0, 60), linha_aprox: null },
  })),
  distribuicao_gabarito: Q.valor.reduce((a, q) => (a[q.a + 1] = (a[q.a + 1] || 0) + 1, a), {}),
  codigo_atual: 'ausente de src/lib/data (nenhum quiz M17 no código)',
};
// origem das questões: busca pelo início do enunciado no script
for (const p of avaliacao.perguntas) {
  const raw = Q.valor[p.numero - 1].q.slice(0, 40);
  p.origem.linha_aprox = L.lineOfScript("{q:'" + raw);
}

// ───────────── CHECKLIST ─────────────
const fin = blocos('final');
const ck = fin.find((b) => b.tipo === 'lista');
const P14 = (t) => {
  const m = [];
  if (/^(Enumerei|Identifiquei|Declarei|Verifiquei|Tratei|Decompus|Disse|Apliquei|Nomeei|Não comparei|Classifiquei|Cruzei|Recusei)/.test(t)) m.push('autodeclarado');
  if (/Disse|Recusei|devolvendo/.test(t)) m.push('producao_oral_ou_livre');
  return m;
};
const checklist_final = {
  id: 'm17-checklist-final',
  tipo: 'checklist-final',
  marcador: { html: L.secao('final').marcador_html, texto: L.secao('final').marcador_texto },
  titulo: { html: H(L.secao('final').h2), texto: T(L.secao('final').h2) },
  introducao: (() => { const b = fin.find((x) => x.tipo === 'lede'); return { html: b.html, texto: b.texto, origem: b.origem }; })(),
  mecanica_fonte: 'Anotação: <ul class="ck"> estática, sem caixa de marcar, sem script, sem persistência. Não declara regra de aprovação.',
  total_itens: ck.itens.length,
  itens: ck.itens.map((it, i) => ({ id: `m17-check-${pad(i + 1)}`, numero: i + 1, ...it, marcacao_p14: P14(it.texto) })),
  nota_P14: 'Todos os 30 são autodeclarados ("Enumerei…", "Verifiquei…"); nenhum é cronometrado. `marcacao_p14` é inferência pelo verbo. Nenhum vira evidência automatizada.',
  destaque_de_produto_P7: (() => { const b = fin.find((x) => x.tipo === 'destaque'); return { rotulo: b.rotulo, partes: b.partes, origem: b.origem }; })(),
  codigo_atual: 'ausente de src/lib/data; alexandria-badges.ts não usa itens do M17',
};

// ───────────── EXERCÍCIOS ─────────────
const exKids = L.wrapKids(L.secao('ex'));
let cat = null; const exs = [];
for (const k of exKids) {
  if (classIs(k, 'dvs')) { cat = { texto: T(k), linha_aprox: lineOf(k.start) }; continue; }
  if (k.tag !== 'details') continue;
  const sum = find(k, (n) => n.tag === 'summary'); const bd = find(k, (n) => classIs(n, 'det-bd'));
  const numB = find(sum, (n) => n.tag === 'b');
  const tag = T(numB).replace(/\.$/, '');
  const enunciadoHtml = L.inline(L.html.slice(numB.end, sum.closeStart));
  const code = C17.MODULO_17_EXERCICIOS_SOLTOS.find((e) => e.config && e.config.tag === tag);
  const scan = (T(sum) + ' ' + T(bd)).match(/Aula\s*\d+/gi) || [];
  exs.push({
    id: `m17-ex-${tag}`,
    tag,
    categoria_estrutural: cat.texto,
    categoria_origem: `div.dvs L${cat.linha_aprox} (irmão anterior)`,
    aula_vinculada: null,
    sem_aula_P9: true,
    varredura_aula_nn: scan,
    enunciado_html: enunciadoHtml, enunciado_texto: L.texto(enunciadoHtml),
    resposta_referencia_html: H(bd), resposta_referencia_texto: T(bd),
    criterio: null,
    mencoes_em_prosa: [...new Set((T(sum) + ' ' + T(bd)).match(/Módulo \d+|Instrumento \d+/g) || [])],
    codigo: code ? { id: code.id, kind: code.kind, points: code.points, prompt_igual: L.texto(code.prompt) === L.texto(enunciadoHtml), gabarito_igual: L.texto(code.config.gabarito) === T(bd) } : null,
    origem: origem('section#ex details > summary', k, T(sum).slice(0, 70)),
  });
}
const exSec = L.secao('ex');
const fichasC = fichas.itens.map((f) => ({ id: `m17-ficha-c-${f.id.slice(-2)}`, ficha: f.jurisdicao, campo: f.campos[f.campos.length - 1].campo,
  enunciado_implicito_html: f.campos[f.campos.length - 1].html, resposta_referencia: null, aula_vinculada: null,
  nota: 'O lede do §Fichas diz: "Preenchê-la é o exercício." A fonte não traz resposta de referência para o item (c).', linha_aprox: f.campos[f.campos.length - 1].linha_aprox }));
const exercicios = {
  id: 'm17-exercicios',
  tipo: 'indice-de-exercicios',
  marcador: { html: exSec.marcador_html, texto: exSec.marcador_texto },
  titulo: { html: H(exSec.h2), texto: T(exSec.h2) },
  introducao: L.lit(find(exSec.node, (n) => classIs(n, 'lede')), 'section#ex p.lede'),
  mecanica_fonte: 'Anotação: <details>/<summary>; o <summary> é "<b>NN.</b> enunciado" e o .det-bd é a resposta de referência, revelada ao abrir (sem registro de tentativa).',
  total_na_fonte: exs.length,
  por_categoria: exs.reduce((a, e) => (a[e.categoria_estrutural] = (a[e.categoria_estrutural] || 0) + 1, a), {}),
  aulas_cobertas_por_tag: [],
  soltos_P9: exs.length,
  itens: exs,
  exercicios_implicitos_fichas: fichasC,
  codigo_atual: {
    arquivo: 'src/lib/data/alexandria-modulo-17-content.ts (MODULO_17_EXERCICIOS_SOLTOS)',
    total: C17.MODULO_17_EXERCICIOS_SOLTOS.length,
    prompts_iguais: exs.filter((e) => e.codigo && e.codigo.prompt_igual).length,
    gabaritos_iguais: exs.filter((e) => e.codigo && e.codigo.gabarito_igual).length,
    categoria_no_codigo: false,
    points_sem_origem: [...new Set(C17.MODULO_17_EXERCICIOS_SOLTOS.map((e) => e.points))],
    consumido_por_src: false,
  },
};

// ───────────── REFERÊNCIAS ─────────────
const rb = blocos('ref');
const refTab = rb.find((b) => b.tipo === 'tabela');
const refList = rb.find((b) => b.tipo === 'lista_de_blocos_de_fonte');
const refBox = rb.find((b) => b.tipo === 'destaque');
const refItens = refList.itens.map((it, i) => {
  const m = /^<b>([^<]*)<\/b>\s*([\s\S]*)$/.exec(it.html);
  const datas = [...new Set((it.texto.match(/\d{1,2}º? de [a-zç]+ de \d{4}|[a-zç]+ de \d{4}|\b(?:19|20)\d{2}(?:[/–-]\d{2,4})?\b/gi) || []))];
  const consulta = /Consulta em ([^.]*)\./.exec(it.texto);
  return {
    id: `m17-ref-${pad(i + 1)}`, tipo: 'bloco-de-fonte',
    bloco: m ? L.texto(m[1]).replace(/\.$/, '') : null,
    html: it.html, texto: it.texto,
    descricao_verbatim: m ? L.texto(m[2]) : it.texto,
    instituicoes: null,
    instituicoes_nota: 'A fonte descreve as instituições por estrutura ("operador nacional", "agência reguladora"…), sem nome, salvo siglas brasileiras na tabela e no §MAP. Nomes não foram inferidos.',
    url: null, dominio_citado: null,
    data_consulta: consulta ? consulta[1] : null,
    datas_citadas: datas,
    norma_citada: (it.texto.match(/Lei nº [\d.]+\/\d{4}/g) || []),
    linha_aprox: it.linha_aprox,
  };
});
const referencias = {
  id: 'm17-referencias',
  tipo: 'referencias',
  marcador: { html: L.secao('ref').marcador_html, texto: L.secao('ref').marcador_texto },
  titulo: { html: H(L.secao('ref').h2), texto: T(L.secao('ref').h2) },
  introducao: (() => { const b = rb.find((x) => x.tipo === 'lede'); return { html: b.html, texto: b.texto, origem: b.origem }; })(),
  data_de_verificacao_geral: '4 de agosto de 2026',
  data_nota: 'Literal do lede ("Todas verificadas em <b>4 de agosto de 2026</b>").',
  hierarquia_de_fontes: { cabecalho: refTab.cabecalho, linhas: refTab.linhas.map((l, i) => ({ id: `m17-ref-cat-${pad(i + 1)}`, categoria: l.celulas[0].texto, serve_html: l.celulas[1].html, serve_texto: l.celulas[1].texto, nao_serve_html: l.celulas[2].html, nao_serve_texto: l.celulas[2].texto, linha_aprox: l.linha_aprox })), origem: refTab.origem },
  subtitulo_blocos: (() => { const b = rb.find((x) => x.tipo === 'subtitulo'); return { texto: b.texto, origem: b.origem }; })(),
  total_blocos: refItens.length,
  itens: refItens,
  nota_itens: 'A fonte não lista referências individuais com título/URL: são 8 parágrafos-bloco, cada um agregando várias publicações descritas por estrutura. Nenhum tem URL nem domínio. `datas_citadas` é recorte programático de datas presentes no texto.',
  destaque_recursos_primarios: { rotulo: refBox.rotulo, partes: refBox.partes, origem: refBox.origem },
  contagem_do_hero_script: { valor: refItens.length + refTab.linhas.length, regra: "ref-list p + (#ref .tbl tr − 1)" },
  sem_campos_D5: 'A fonte não declara, por referência: o que responde (há só "Serve como fonte de" por CATEGORIA), tema, recorte nem última verificação individual.',
  codigo_atual: 'ausente de src/lib/data',
};

// ───────────── GLOSSÁRIO ─────────────
const lexSec = L.secao('lex');
const fams = findAll(lexSec.node, (n) => n.tag === 'details');
const termos = []; const anomalias = [];
fams.forEach((d, fi) => {
  const fam = T(find(d, (n) => n.tag === 'summary'));
  for (const p of findAll(d, (n) => n.tag === 'p')) {
    const spans = findAll(p, (n) => classIs(n, 'term'));
    spans.forEach((sp, si) => {
      const endOff = si + 1 < spans.length ? spans[si + 1].start : p.closeStart;
      let defRaw = L.html.slice(sp.end, endOff);
      const sepOk = /^\s*—\s*/.test(defRaw);
      if (!sepOk) anomalias.push({ termo: T(sp), linha: lineOf(sp.start), inicio: defRaw.slice(0, 20) });
      defRaw = defRaw.replace(/^\s*—\s*/, '');
      termos.push({
        id: `m17-lex-${String(termos.length + 1).padStart(3, '0')}`,
        tipo: 'termo-de-glossario',
        familia: fam, familia_indice: fi + 1,
        termo: T(sp),
        definicao_html: L.inline(defRaw), definicao_texto: L.texto(defRaw),
        origem: origem(`section#lex details:nth(${fi + 1}) span.term`, sp, T(sp)),
      });
    });
  }
});
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const codeGlo = GLO.ALEXANDRIA_GLOSSARIO;
const m17noCodigo = codeGlo.filter((g) => /^gl-m17-/.test(g.id));
const homonimos = termos.map((t) => ({ termo: t.termo, em_outros_modulos: codeGlo.filter((g) => norm(g.term) === norm(t.termo)).map((g) => g.id) })).filter((x) => x.em_outros_modulos.length);
// parentes por prefixo: verbete de outro modulo cujo nome e prefixo de palavra do termo M17 (ou vice-versa), sem igualdade exata
const normP = (s) => norm(s).replace(/\s*\(.*?\)\s*/g, ' ').trim();
const parentesPorPrefixo = termos.map((t) => {
  const tt = normP(t.termo);
  const m = codeGlo.filter((g) => {
    const cc = normP(g.term);
    if (norm(g.term) === norm(t.termo)) return false;
    return cc === tt || cc.startsWith(tt + ' ') || (tt.startsWith(cc + ' ') && cc.length > 6);
  });
  return { termo: t.termo, verbetes_relacionados: m.map((g) => ({ id: g.id, term: g.term })) };
}).filter((x) => x.verbetes_relacionados.length);
const glossario = {
  id: 'm17-glossario',
  tipo: 'glossario-do-modulo',
  marcador: { html: lexSec.marcador_html, texto: lexSec.marcador_texto },
  titulo: { html: H(lexSec.h2), texto: T(lexSec.h2) },
  introducao: L.lit(find(lexSec.node, (n) => classIs(n, 'lede')), 'section#lex p.lede'),
  contagem: {
    prosa_declara: 'oito famílias (sem número de termos na prosa)',
    familias: fams.length,
    por_familia: fams.map((d, i) => ({ familia: T(find(d, (n) => n.tag === 'summary')), termos: termos.filter((t) => t.familia_indice === i + 1).length })),
    markup_span_term: findAll(lexSec.node, (n) => classIs(n, 'term')).length,
    extraidos: termos.length,
    codigo_bloco_m17: m17noCodigo.length,
    ausentes_no_codigo: termos.length - m17noCodigo.length,
    anomalias_separador: anomalias,
  },
  ordem_fonte: 'por família (declarado no lede: "Agrupados por família e não por ordem alfabética")',
  termos,
  codigo_atual: {
    arquivo: 'src/lib/data/alexandria-glossario.ts',
    verbetes_m17: m17noCodigo.length,
    nota: 'O arquivo cobre M01–M08 (637 verbetes). Nenhum dos 192 termos do M17 está portado; TODOS faltam no código. A lista completa dos que faltam é `termos` (192).',
    homonimos_em_outros_modulos: homonimos,
    homonimos_nota: 'Mesmo nome de termo (sem acento/caixa) em verbete de outro módulo. Não são o verbete do M17: a definição é própria de cada §Lex (ids namespaçados). Informativo.',
    parentes_por_prefixo: parentesPorPrefixo,
    parentes_por_prefixo_nota: 'Verbete de outro módulo cujo nome é prefixo de palavra do termo do M17 (ou o contrário), sem igualdade exata: são as colisões que o próprio lede do §Lex anuncia (capacidade, despacho, reserva...). Não cobrem o termo do M17, que continua faltando no código. Informativo; comparação sem acento, caixa ou parêntese.',
  },
};

// ───────────── DIVERGÊNCIAS ─────────────
const ex02 = exs.find((e) => e.tag === '02');
const q1 = avaliacao.perguntas[0];
const q7 = avaliacao.perguntas[6];
const divergencias = [
  { id: 'div-m17-ap-01-seis-que-faltam', tipo: 'fonte×fonte', tema: 'Quais seis declarações faltam no exemplo canônico (€89/MWh × liquidação)',
    leitura_a: { onde: `§Ex 02 L${ex02.origem.linha_aprox}`, texto: ex02.resposta_referencia_texto },
    leitura_b: { onde: `§Quiz Q1 (script L${q1.origem.linha_aprox})`, texto: q1.explicacao_texto },
    evidencia: 'O Ex 02 separa "granularidade" e "período" e não cita tributo; a Q1 junta "granularidade e período" e inclui "tratamento tributário". As duas somam seis com conjuntos diferentes. A Aula 01 (box, L1517) diz só "seis das sete".', decisao: 'não resolvida' },
  { id: 'div-m17-ap-02-quando-aparece-o-gabarito', tipo: 'fonte×script', tema: 'Momento do gabarito comentado',
    leitura_a: { onde: `section#quiz p.lede L${avaliacao.introducao.origem.linha_aprox}`, texto: avaliacao.introducao.texto },
    leitura_b: { onde: `<script> corrigir() L${corr.linha_inicio}`, texto: 'o feedback só é escrito dentro de corrigir(), acionado pelo botão "Corrigir"; o clique na alternativa só grava picked[i].' },
    evidencia: 'A prosa diz "ao responder"; o script mostra tudo ao corrigir.', decisao: 'não resolvida' },
  { id: 'div-m17-ap-03-q7-teto', tipo: 'fonte×fonte (prosa×números)', tema: 'Feedback da Q7 repete "a diferença entre o teto e a estimativa sem teto é maior que o próprio teto"',
    leitura_a: { onde: `§Quiz Q7 (script L${q7.origem.linha_aprox})`, texto: q7.explicacao_texto },
    leitura_b: { onde: 'section#a05 .cn5 item 3', texto: 'US$ 325/MW-dia (teto) e US$ 554,72/MW-dia (estimativa sem teto)' },
    evidencia: '554,72 − 325 = 229,72 < 325. Ver modulo.json div-m17-14. Aritmética desta extração.', decisao: 'não resolvida; CONTENT QA (P20)' },
  { id: 'div-m17-ap-04-regua-rotulos', tipo: 'fonte×fonte', tema: 'Rótulo do estágio do sistema brasileiro de comércio de emissões',
    leitura_a: { onde: 'section#fichas (Brasil, Preço de carbono)', texto: fichas.itens[0].campos.find((c) => c.campo === 'Preço de carbono').texto },
    leitura_b: { onde: 'instrumentos.json m17-inst-07 (OBJ "Sistema brasileiro de comércio de emissões")', texto: "p:'regulamentado' → exibido como \"Regulamentado\" (e a nota diz \"Estágio: regulado e não construído\")" },
    evidencia: 'O Instrumento 07 cita "a régua de cinco posições do Módulo 16" com as posições Anunciado/Proposto/Aprovado/Regulamentado/Em operação; a ficha, o caso e o §Lex usam "regulado e não construído", que é outra formulação. O M16 (fora deste escopo) usa rótulos como "anunciado com data" e "regulado e não construído" (alexandria_modulo16.html L2539, L5034) — verificação cruzada completa pendente.', decisao: 'não resolvida' },
  { id: 'div-m17-ap-05-caso-parte', tipo: 'fonte×decisão', tema: 'Parte numerada do caso', leitura_a: { onde: 'section#caso .sec-id', texto: caso.marcador_texto }, leitura_b: { onde: 'P17', texto: 'Não existe "Parte 1".' }, evidencia: 'Ver modulo.json div-m17-11.', decisao: 'nenhuma' },
  { id: 'div-m17-ap-06-war-room-travas', tipo: 'vocabulario_interno (P23 análogo)', tema: '"Trava 2 estendida" e "War Room — quatro travas" em texto voltado ao learner',
    leitura_a: { onde: 'section#map p.srcnote', texto: (/Trava 2 estendida:[^.]*\./.exec(T(find(L.secao('map').node, (n) => classIs(n, 'srcnote')))) || [])[0] },
    leitura_b: { onde: `section#ref .ref-list p (Documentos internos) L${refItens[refItens.length - 1].linha_aprox}`, texto: refItens[refItens.length - 1].texto },
    evidencia: 'A fonte não define as travas para o learner. "War Room", "Currículo Definitivo" e "Plano de Negócios" são documentos internos citados como fonte. P23/P24 governam a exibição; aqui fica literal.', decisao: 'nenhuma nesta camada' },
];

const out = {
  schema: 'alexandria-v2/extraction/aparato',
  modulo: 'M17',
  grupo: 'aparato',
  fonte: { arquivo: L.SRC, linhas_total: L.LINHAS_TOTAL, bytes: L.BYTES },
  gerado_por: 'extratores/m17_aparato.mjs',
  metodo: 'DOM próprio (lib.mjs) para markup; quiz lido avaliando o literal `var Q=[…]` do <script> com vm; nenhum texto digitado.',
  convencoes: { html: 'HTML inline literal, entidades preservadas, espaços colapsados', texto: 'sem tags, entidades decodificadas', linha_aprox: 'linha 1-based da abertura', null: 'ausência declarada; sempre com nota' },
  caso: casoObj,
  fichas,
  avaliacao,
  checklist_final,
  exercicios,
  referencias,
  glossario,
  divergencias,
  desconhecidos_do_walker: B.DESCONHECIDOS,
  contagens: {
    caso_blocos: cb.length, caso_perguntas: casoObj.perguntas.length, caso_etapas: casoObj.etapas_pergunta_1.length, caso_declaracoes: casoObj.diagnostico_pergunta_2.length,
    caso_declaracoes_ausentes: casoObj.diagnostico_pergunta_2.filter((d) => d.estado_fonte === 'ausente').length,
    fichas: fichas.itens.length, campos_por_ficha: [...new Set(fichas.itens.map((f) => f.campos.length))],
    quiz_questoes: avaliacao.perguntas.length, quiz_alternativas: avaliacao.perguntas.reduce((a, p) => a + p.alternativas.length, 0), quiz_faixas: 2,
    checklist_itens: checklist_final.itens.length,
    exercicios: exs.length, exercicios_por_categoria: exercicios.por_categoria, exercicios_sem_aula: exs.length, exercicios_implicitos_fichas: fichasC.length,
    referencias_blocos: refItens.length, referencias_categorias_hierarquia: refTab.linhas.length, referencias_com_url: 0,
    termos: termos.length, familias: fams.length, termos_ausentes_no_codigo: termos.length - m17noCodigo.length, homonimos_em_outros_modulos: homonimos.length, parentes_por_prefixo_em_outros_modulos: parentesPorPrefixo.length,
    divergencias: divergencias.length,
  },
};
L.writeJSON('aparato.json', out);
console.log(JSON.stringify(out.contagens));
console.log('ex codigo', JSON.stringify(exercicios.codigo_atual), 'scan', exs.filter((e) => e.varredura_aula_nn.length).map((e) => e.tag));
console.log('anomalias', anomalias);
console.log(refItens.map((r) => r.bloco + ' | ' + r.data_consulta + ' | ' + r.datas_citadas.join(',')).join('\n'));
console.log(avaliacao.perguntas.map((p) => p.numero + ' L' + p.origem.linha_aprox + ' g' + p.gabarito.numero_exibido + ' ' + p.mencoes_em_prosa).join('\n'));
