// Grupo "modulo" do M09 → modulo.json. Todo texto de conteúdo sai da fonte por linha/regex.
import fs from 'node:fs';
import * as X from './lib.mjs';

const { ln, at, txt, strip, origem, pad, fail } = X;
const S = X.secoes();
const sec = (id) => S.find((s) => s.id_html === id) || fail('seção ' + id);
const corpo = (s) => X.blocos(s.lede ? s.lede_linha + 1 : s.lede_linha, s.fim - 1, `section#${s.id_html}`);
const cab = (s) => ({
  marcador: s.marcador, rotulo: s.rotulo, sec_id_html: s.sec_id_html,
  titulo: { ...txt(s.h2), origem: origem(s.h2_linha, `section#${s.id_html} h2`) },
  lede: s.lede ? { ...txt(s.lede), origem: origem(s.lede_linha, `section#${s.id_html} p.lede`) } : null,
  origem: origem(s.sec_id_linha, `section#${s.id_html} .sec-id`),
});

// P14 — anotação desta extração (não é texto da fonte)
const p14 = (t) => {
  const tags = [];
  if (/(\d+|quinze|trinta|dez) (segundos|minutos)/i.test(t)) tags.push('cronometrado');
  if (/de memória/i.test(t)) tags.push('recordacao_sem_consulta');
  if (/^(Reconstruo|Explico|Nomeio|Digo|Distingo|Descrevo|Trato|Enuncio|Uso|Leio|Avalio|Percorro|Conecto|Produzo)\b/.test(t)) tags.push('producao_oral_ou_livre');
  if (/^(Desenhe|Reconstruo de memória os dois ambientes)/.test(t)) tags.push('desenho_ou_reconstrucao_estrutural');
  if (/em voz alta|Responda em voz alta|Roteiro oral|fala/i.test(t)) tags.push('oral');
  return tags;
};

// ── identidade ───────────────────────────────────────────────
const tituloTag = at(6, /<title>(.*)<\/title>/);
const pills = [];
for (let n = 430; n <= 441; n++) {
  const m = ln(n).match(/<span class="pill"><b>(.*?)<\/b> (.*)<\/span>/) || fail('pill ' + n);
  pills.push({ id: `m09-hero-pill-${pad(n - 429)}`, valor: m[1], rotulo: m[2], origem: origem(n, 'header.hero .pill-row .pill') });
}
const rodape = [2352, 2353, 2354].map((n) => ({ texto: strip(ln(n).trim().replace(/<br>$/, '')), linha_aprox: n }));
const eixosLista = X.blocos(502, 507, 'section#tese')[0];
const identidade = {
  id: 'm09-identidade',
  tipo: 'identidade',
  titulo_documento: { texto: tituloTag, origem: origem(6, 'head > title') },
  kicker: { ...txt(at(426, /<div class="kicker">(.*)<\/div>/)), origem: origem(426, 'header.hero .kicker') },
  titulo: { ...txt(at(427, /<h1>(.*)<\/h1>/)), origem: origem(427, 'header.hero h1') },
  subtitulo: { ...txt(at(428, /<p class="sub">(.*)<\/p>/)), origem: origem(428, 'header.hero p.sub') },
  meta_pills: pills,
  horas: {
    texto: `${pills[11].valor} ${pills[11].rotulo}`,
    valor_literal: pills[11].valor,
    min: null, max: null,
    nota: 'A fonte declara só a pill "6-8 h de estudo" (hífen simples, sem espaço). Os números 6 e 8 não foram convertidos aqui. O catálogo do código (bloco-09) tem estimatedHoursMin/Max = null; o catálogo canônico escreve "6–8 h declaradas".',
    origem: pills[11].origem,
  },
  trilha: { texto: 'Trilha 2 — Setor Elétrico Brasileiro', nota: 'Substring literal do kicker (L426) e do rodapé (L2353). O código usa track: \'brasil\', level: 2.', origem: origem(426, 'header.hero .kicker') },
  eixos: {
    titulo_secao: { ...txt(at(498, /<h3><span class="num">.*?<\/span> (.*)<\/h3>/)), numero: at(498, /<span class="num">(.*?)<\/span>/), origem: origem(498, 'section#tese h3') },
    introducao: { ...txt(at(500, /<p>(.*)<\/p>/)), origem: origem(500, 'section#tese > p') },
    itens: eixosLista.itens.map((it, i) => ({ id: `m09-eixo-${i + 1}`, tipo: 'eixo', ordem: i + 1, rotulo: strip(it.html.match(/^<b>(.*?)<\/b>/)[1]), ...it })),
    nota: 'Ao contrário do M01 (eixos = null), o M09 declara quatro eixos literais em §00.3 ("Os quatro eixos, anunciados"). A Aula 01 os abre como h3 "Eixo 1", "Eixo 1b", "Eixo 2", "Eixo 3", "Eixo 4" — o "Eixo 1b" não está na lista do §00.3.',
  },
  rodape: { linhas: rodape, origem: origem(2351, 'footer p') },
  cabecalho: null,
  cabecalho_nota: 'Não há header de marca (o M01 tinha "GridAlpha · Alexandria Library"). O topo é só a barra de progresso div#hp e o header.hero.',
};

// ── §00 tese ─────────────────────────────────────────────────
const sTese = sec('tese');
const tese = { id: 'm09-tese', tipo: 'tese', ...cab(sTese), blocos: corpo(sTese) };
tese.blocos.forEach((b, i) => { b.id = `m09-tese-b${pad(i + 1)}`; });

// ── resultado esperado ───────────────────────────────────────
const resultado_esperado = {
  id: 'm09-resultado-esperado',
  tipo: 'capacidades',
  itens: null,
  nota: 'A fonte do M09 NÃO tem bloco "Resultado esperado" (zero ocorrências de "Resultado esperado"/"Ao final"). O que mais se aproxima, sem ser promovido a capacidade: (a) o último parágrafo do §00.2 (L491), que nomeia as três saídas que o módulo quer tornar fluentes; (b) os quatro eixos do §00.3 (identidade.eixos); (c) os 28 itens do §Final (criterios.checklist).',
  ponteiros: [
    { onde: '§00.2 > p (L491)', trecho_inicial: X.trecho(ln(491)), linha_aprox: 491 },
    { onde: '§00.3 ol.num-list (L502-507)', trecho_inicial: X.trecho(ln(503)), linha_aprox: 502 },
    { onde: '§Final ul.ck (L2105-2134)', trecho_inicial: X.trecho(ln(2106)), linha_aprox: 2105 },
  ],
};

// ── §MAP ─────────────────────────────────────────────────────
const sMap = sec('map');
const mapa = {
  id: 'm09-mapa',
  tipo: 'mapa_do_mercado',
  ...cab(sMap),
  blocos: corpo(sMap),
  perguntas_por_aula: null,
  perguntas_por_aula_nota: 'O §MAP do M09 não é mapa de aulas (o do M01 era uma tabela aula × pergunta). Aqui ele é "Mapa do mercado": três parágrafos, o instrumento INST·01 (fora de aula) e um destaque. Nenhuma aula tem pergunta declarada em lugar nenhum da fonte.',
  vinculos: { instrumento: 'm09-inst-01', instrumento_nota: 'Conteúdo do instrumento no grupo instrumentos.json.' },
};
mapa.blocos.forEach((b, i) => { b.id = `m09-map-b${pad(i + 1)}`; });

// ── roteiro ──────────────────────────────────────────────────
const code = X.lerCodigo('conteudo');
const codeAulas = [...code.matchAll(/id: 'aula-09-(\d\d)',[\s\S]*?title: "(.*?)",\s*subtitle: "(.*?)"/g)].map((m) => ({ n: m[1], title: m[2], subtitle: m[3] }));
const codeLead = Object.fromEntries([...code.matchAll(/'aula-09-(\d\d)': ("(?:[^"\\]|\\.)*"),/g)].map((m) => [m[1], JSON.parse(m[2])]));
const catalogo = fs.readFileSync(X.CATALOGO, 'utf8').split('\n');
const catIni = catalogo.findIndex((x) => x.startsWith('## Módulo 09'));
const catFim = catalogo.findIndex((x, i) => i > catIni && x.startsWith('## Módulo 10'));
const catAulas = {};
for (let i = catIni; i < catFim; i++) {
  const m = catalogo[i].match(/^\| (0\d) \| (.*?) \| (.*?) \|$/);
  if (m) catAulas[m[1]] = { rotulo: m[2], titulo: m[3], linha: i + 1 };
}
const catInst = {};
for (let i = catIni; i < catFim; i++) {
  const m = catalogo[i].match(/^\| (INST·\d\d) \| (.*?) \| (.*?) \|$/);
  if (m) catInst[m[1]] = { nome: m[2], descricao: m[3], linha: i + 1 };
}
const roteiro = S.map((s, i) => {
  const isAula = /^Aula \d\d$/.test(s.marcador);
  const n = isAula ? s.marcador.slice(5) : null;
  const bl = corpo(s);
  const r = {
    id: isAula ? `m09-roteiro-aula-${n}` : `m09-roteiro-${s.id_html}`,
    tipo: isAula ? 'aula' : (s.id_html === 'tese' || s.id_html === 'map' ? 'abertura' : 'aparato'),
    ordem_na_fonte: i + 1,
    id_html: s.id_html,
    ...cab(s),
    linhas: [s.ini, s.fim],
    estrutura: {
      subsecoes: bl.filter((b) => b.tipo === 'titulo').map((b) => ({ numero: b.numero, texto: b.texto, linha_aprox: b.origem.linha_aprox })),
      instrumentos: bl.filter((b) => b.tipo === 'instrumento_ref').map((b) => ({ inst_id: b.inst_id, nome: b.nome, linha_aprox: b.origem.linha_aprox })),
      destaques: bl.filter((b) => b.tipo === 'destaque').map((b) => ({ classe: b.classe, rotulo: b.rotulo, linha_aprox: b.origem.linha_aprox })),
      tres_niveis: bl.filter((b) => b.tipo === 'tres_niveis_ref').map((b) => ({ id_html: b.id_html, rotulo: b.rotulo, linha_aprox: b.origem.linha_aprox })),
      fichas: bl.filter((b) => b.tipo === 'ficha_ref').map((b) => ({ rotulo: b.rotulo, linha_aprox: b.origem.linha_aprox })),
      tabelas: bl.filter((b) => b.tipo === 'tabela').length,
      listas: bl.filter((b) => b.tipo === 'lista').length,
      paragrafos: bl.filter((b) => b.tipo === 'paragrafo').length,
    },
    vinculos: isAula ? { aula_id_codigo: `aula-09-${n}` } : {},
  };
  if (isAula) {
    const c = codeAulas.find((x) => x.n === n);
    r.codigo = {
      title: c?.title ?? null, subtitle: c?.subtitle ?? null,
      title_igual_h2: c ? c.title === s.h2 : false,
      subtitle_igual_rotulo_sec_id: c ? c.subtitle === s.rotulo : false,
      lead_igual_lede: codeLead[n] === s.lede,
      instruments_no_codigo: 0,
    };
    const k = catAulas[n];
    r.catalogo_canonico = k ? { rotulo: k.rotulo, titulo: k.titulo, linha: k.linha, rotulo_igual: k.rotulo === s.rotulo, titulo_igual: k.titulo === s.h2 } : null;
  }
  return r;
});
const aulasRot = roteiro.filter((r) => r.tipo === 'aula');
if (aulasRot.length !== 8) fail('esperava 8 aulas');

// ── critérios ────────────────────────────────────────────────
const sQuiz = sec('quiz'), sFinal = sec('final'), sEx = sec('ex'), sVoz = sec('voz');
const qb = X.blocoScript('§QUIZ');
const nPass = X.achaLinha('var pass=acertos>=8;', qb.ini, qb.fim);
const nMsgA = X.achaLinha("(pass?'Critério atendido.", qb.ini, qb.fim);
const nMsgB = X.achaLinha(":'Critério é 8 de 10.", qb.ini, qb.fim);
const msgA = at(nMsgA, /\(pass\?'(.*)'\s*$/);
const msgB = at(nMsgB, /:'(.*)'\)\+'<\/p>';\s*$/);
const ckLista = corpo(sFinal)[0];
const checklist = ckLista.itens.map((it, i) => ({ id: `m09-final-${pad(i + 1)}`, tipo: 'item_de_checklist', ordem: i + 1, ...it, marcacao_p14: p14(it.texto), origem: origem(it.linha_aprox, 'section#final ul.ck > li', it.html) }));
const a08 = sec('a08');
const critA08 = [1631, 1695].map((n) => ({ ...txt(at(n, /<p>(.*)<\/p>/)), origem: origem(n, 'section#a08 > p') }));
const criterios = {
  id: 'm09-criterios',
  tipo: 'criterios_do_modulo',
  nota_p18: 'Vários critérios literais coexistem (quiz 8/10; checklist de 28 itens "marque mentalmente"; o "critério de domínio deste bloco" citado na Aula 08 sem estar definido no arquivo; os tempos do §Voz). Registrados sem escolher nenhum (P18). A marcação P14 é anotação desta extração, inferida do texto de cada item.',
  quiz: {
    id: 'm09-crit-quiz', secao: '§Quiz',
    sec_id: { html: sQuiz.sec_id_html, texto: strip(sQuiz.sec_id_html), origem: origem(sQuiz.sec_id_linha, 'section#quiz .sec-id') },
    titulo: { ...txt(sQuiz.h2), origem: origem(sQuiz.h2_linha, 'section#quiz h2') },
    lede: { ...txt(sQuiz.lede), origem: origem(sQuiz.lede_linha, 'section#quiz p.lede') },
    limiar_script: { codigo: ln(nPass).trim(), acertos_minimos: 8, total: 10, origem: origem(nPass, 'script §QUIZ corrigir()') },
    mensagens_do_script: [
      { condicao: 'acertos >= 8', classe: 'score show pass', mensagem: msgA, origem: origem(nMsgA, 'script §QUIZ sc.innerHTML') },
      { condicao: 'acertos < 8', classe: 'score show fail', mensagem: msgB, origem: origem(nMsgB, 'script §QUIZ sc.innerHTML') },
    ],
    marcacao_p14: ['automatizavel', 'P18_limiar_nao_e_evidencia'],
    nota: 'Duas faixas só (≥8 / <8), não quatro como no M01. As perguntas estão em aparato.json.',
  },
  checklist: {
    id: 'm09-crit-final', secao: '§Final',
    sec_id: { texto: strip(sFinal.sec_id_html), origem: origem(sFinal.sec_id_linha, 'section#final .sec-id') },
    titulo: { ...txt(sFinal.h2), origem: origem(sFinal.h2_linha, 'section#final h2') },
    lede: { ...txt(sFinal.lede), origem: origem(sFinal.lede_linha, 'section#final p.lede') },
    total_itens: checklist.length,
    itens: checklist,
    mecanica_fonte: 'Nenhuma. ul.ck é lista estática: o script não tem bloco de checklist (o M01 tinha toggle). "Marque mentalmente" é literal.',
    contagem_p14: {
      cronometrado: checklist.filter((c) => c.marcacao_p14.includes('cronometrado')).length,
      producao_oral_ou_livre: checklist.filter((c) => c.marcacao_p14.includes('producao_oral_ou_livre')).length,
      recordacao_sem_consulta: checklist.filter((c) => c.marcacao_p14.includes('recordacao_sem_consulta')).length,
    },
  },
  exercicios: {
    id: 'm09-crit-ex', secao: '§Ex',
    lede: { ...txt(sEx.lede), origem: origem(sEx.lede_linha, 'section#ex p.lede') },
    marcacao_p14: ['producao_livre', 'autoavaliado_sem_registro'],
    nota: 'Não há limiar numérico (o M01 tinha "seis dos oito"). A regra é de procedimento: produzir antes de abrir o gabarito. O gabarito é um <details> que abre direto (C7).',
  },
  aula_08_criterio_de_dominio: {
    id: 'm09-crit-a08',
    paragrafos: critA08,
    nota: 'A Aula 08 cita duas vezes "o critério de domínio deste bloco" como algo que "exige simetria" e "pede explicitamente a conexão entre um fato regulatório e a tese comercial da GridAlpha". Esse critério não está escrito em nenhum outro lugar do arquivo (lacuna — provavelmente um documento externo de currículo).',
  },
  voz_cronometrados: [
    { id: 'm09-crit-voz-relampago', ...txt(at(1991, /<p>(.*)<\/p>/)), marcacao_p14: ['oral', 'cronometrado'], tempo_literal: 'em até quinze segundos cada', origem: origem(1991, 'section#voz > p') },
    { id: 'm09-crit-voz-ataques', ...txt(at(2037, /<p>(.*)<\/p>/)), marcacao_p14: ['oral', 'cronometrado'], tempo_literal: 'caber em trinta segundos', origem: origem(2037, 'section#voz > p') },
    { id: 'm09-crit-voz-roteiro', ...txt(at(2079, /<h3><span class="num">.*?<\/span> (.*)<\/h3>/)), marcacao_p14: ['oral', 'cronometrado'], tempo_literal: 'dez minutos', origem: origem(2079, 'section#voz h3') },
  ],
};

// ── laboratórios ─────────────────────────────────────────────
const laboratorios = {
  id: 'm09-laboratorios',
  itens: null,
  nota: 'O M09 não tem § Lab (zero ocorrências de "§Lab"/"LAB ·"). O único instrumento fora de aula é o INST·01, dentro do §MAP (instrumentos.json, m09-inst-01), que vai para Recursos do Módulo pela regra do protocolo §3.',
};

// ── voz: seção §Voz + princípios editoriais ──────────────────
const vb = corpo(sVoz);
const relampago = vb.find((b) => b.tipo === 'lista').itens.map((it, i) => {
  const m = it.html.match(/^<b>(.*?)<\/b> (.*)$/) || fail('relâmpago ' + it.linha_aprox);
  return { id: `m09-voz-relampago-${pad(i + 1)}`, tipo: 'pergunta_relampago', ordem: i + 1, pergunta: m[1], resposta: txt(m[2]), marcacao_p14: ['oral', 'cronometrado'], origem: origem(it.linha_aprox, 'section#voz ol.num-list > li', it.html) };
});
const ataques = vb.filter((b) => b.tipo === 'details').map((d, i) => {
  const m = d.resumo.html.match(/^<b>(.*?):<\/b> (.*)$/) || fail('ataque');
  return { id: `m09-voz-ataque-${pad(i + 1)}`, tipo: 'ataque_de_decisor', ordem: i + 1, interlocutor: m[1], pergunta: m[2], resposta: d.corpo, marcacao_p14: ['oral', 'cronometrado'], origem: d.origem };
});
const roteiroOral = vb.filter((b) => b.tipo === 'paragrafo' && /^<b>Minuto/.test(b.html)).map((b, i) => ({ id: `m09-voz-roteiro-${pad(i + 1)}`, tipo: 'trecho_de_roteiro_oral', rotulo: strip(b.html.match(/^<b>(.*?)<\/b>/)[1]), ...b }));
const principios = [];
for (const s of S) for (const b of corpo(s)) {
  if (b.tipo !== 'destaque') continue;
  if (/Números vivos|Regra em movimento|Advertência final/.test(b.rotulo)) principios.push({ secao: s.id_html, tipo: 'aviso_de_verificacao', rotulo: b.rotulo, paragrafos: b.paragrafos, origem: b.origem });
}
const ondeProduto = [];
for (const s of S) for (const b of corpo(s)) if (b.tipo === 'destaque' && b.rotulo === 'Onde isso entra no produto') ondeProduto.push({ secao: s.id_html, rotulo: b.rotulo, produtos_nomeados: [...b.paragrafos[0].html.matchAll(/<b>(.*?)<\/b>/g)].map((m) => m[1]), contem_GridAlpha: /GridAlpha/.test(b.paragrafos[0].html), origem: b.origem });
const voz = {
  id: 'm09-voz',
  tipo: 'voz',
  secao_voz: {
    ...cab(sVoz),
    subsecoes: vb.filter((b) => b.tipo === 'titulo').map((b) => ({ numero: b.numero, texto: b.texto, linha_aprox: b.origem.linha_aprox })),
    instrucoes: vb.filter((b) => b.tipo === 'paragrafo' && !/^<b>Minuto/.test(b.html)).map((b) => ({ ...b })),
    perguntas_relampago: relampago,
    ataques_de_decisor: ataques,
    roteiro_oral_dez_minutos: roteiroOral,
  },
  principios_editoriais: {
    avisos_de_verificacao: principios,
    ledes_de_politica: [
      { secao: 'lex', ...txt(sec('lex').lede), origem: origem(sec('lex').lede_linha, 'section#lex p.lede') },
      { secao: 'ref', ...txt(sec('ref').lede), origem: origem(sec('ref').lede_linha, 'section#ref p.lede') },
      { secao: 'erros', ...txt(sec('erros').lede), origem: origem(sec('erros').lede_linha, 'section#erros p.lede') },
    ],
    regra_de_formulacao: { ...txt(at(511, /<p>(.*)<\/p>/)), nota: 'Mesmo parágrafo já listado em avisos_de_verificacao (§00); repetido aqui como a regra "qual norma, desde quando, e se está regulamentada" + "prazo previsto em lei".', origem: origem(511, 'section#tese .box.rd p') },
    rodape_aviso_legal: rodape[2],
  },
  onde_isso_entra_no_produto: {
    nota: 'P7: blocos "Onde isso entra no produto" não vão para a interface nesta fase. P24: vários citam a marca GridAlpha. Só ponteiros aqui; o texto integral está em tese.blocos (§00) e nas aulas.',
    total: ondeProduto.length,
    itens: ondeProduto,
  },
};

// ── erros comuns ─────────────────────────────────────────────
const sErr = sec('erros');
const tErr = corpo(sErr)[0];
const correcoesEmAula = [];
for (const s of S) for (const b of corpo(s)) if (b.tipo === 'destaque' && /Correção/.test(b.rotulo)) correcoesEmAula.push({ secao: s.id_html, rotulo: b.rotulo, classe: b.classe, origem: b.origem });
const erros_comuns = {
  id: 'm09-erros-comuns',
  tipo: 'erros_comuns',
  ...cab(sErr),
  cabecalho_tabela: tErr.cabecalho,
  total: tErr.linhas.length,
  itens: tErr.linhas.map((r, i) => ({ id: `m09-erro-${pad(i + 1)}`, tipo: 'erro_e_correcao', ordem: i + 1, erro: r.celulas[0], correcao: r.celulas[1], vinculos: { aulas_declaradas: [], nota: 'A fonte não liga o erro a aula.' }, origem: origem(r.linha_aprox, 'section#erros table.tbl tbody tr', r.celulas[0].html) })),
  correcoes_dentro_de_aula: correcoesEmAula,
};

// ── tradutor ────────────────────────────────────────────────
const tradutor = { id: 'm09-tradutor', itens: null, nota: 'O M09 não tem "§ Map · Tradutor" (o M01 tinha). O único marcador parecido é §MAP "Mapa do mercado" — ver mapa.' };

// ── divergências ─────────────────────────────────────────────
const D = (id, sev, tema, leituras, nota, grupo) => ({ id, severidade: sev, grupo, tema, leituras, nota, decisao: 'não escolhida — registrar (P5/P8); resolução na camada Alexandria' });
const blocos09 = X.lerCodigo('blocos').match(/\{ id: 'bloco-09'.*\}/)[0];
const blocos10 = X.lerCodigo('blocos').match(/\{ id: 'bloco-10'.*\}/)[0];
const catCont = catalogo.find((x) => /^\| 09 \| Os Mercados ACR e ACL \|/.test(x));
const divergencias = [
  D('div-m09-titulo', 'média', 'Título do módulo: fonte × catálogo do código × catálogo canônico', [
    { onde: 'h1 L427 e <title> L6', literal: identidade.titulo.texto },
    { onde: 'rodapé L2352', literal: rodape[0].texto },
    { onde: 'src/lib/data/alexandria-blocks.ts bloco-09', literal: "title: 'Mercado ACR e ACL' (priority: 'confirmar')" },
    { onde: 'catálogo canônico, cabeçalho §Módulo 09 e tabela de títulos', literal: 'Os Mercados ACR e ACL em Profundidade (repo: "Mercado ACR e ACL")' },
    { onde: 'catálogo canônico, tabela de contagens', literal: catCont?.split('|')[2].trim() ?? null },
  ], 'P24: o catálogo canônico governa o nome. Ele usa o título da fonte no cabeçalho, mas a forma curta "Os Mercados ACR e ACL" na tabela de contagens. O código ainda tem o nome curto antigo.', 'fonte×codigo×catalogo'),
  D('div-m09-horas', 'baixa', 'Horas de estudo', [
    { onde: 'pill L441', literal: '6-8 h de estudo' },
    { onde: 'bloco-09', literal: 'estimatedHoursMin: null, estimatedHoursMax: null' },
    { onde: 'catálogo canônico', literal: '6–8 h declaradas' },
  ], 'A fonte declara horas; o código ainda está null. O catálogo troca o hífen por meia-risca.', 'fonte×codigo'),
  D('div-m09-aula07-catalogo', 'baixa', 'Título da Aula 07 no catálogo canônico', [
    { onde: 'h2 L1525', literal: sec('a07').h2 },
    { onde: 'catálogo canônico L' + (catAulas['07']?.linha ?? '?'), literal: catAulas['07']?.titulo ?? null },
  ], 'O catálogo corta o prefixo "Realocação e fator de ajuste:" e capitaliza "Por". O código está literal.', 'fonte×catalogo'),
  D('div-m09-quatro-eixos-1b', 'baixa', 'Quatro eixos × cinco cabeçalhos de eixo', [
    { onde: '§00.3 L502-507', literal: identidade.eixos.itens.map((e) => e.rotulo).join(' | ') },
    { onde: 'Aula 01 h3', literal: roteiro.find((r) => r.id_html === 'a01').estrutura.subsecoes.map((s) => s.numero).join(' | ') },
  ], '"Eixo 1b" (o que não muda) é subdivisão do Eixo 1 que o §00.3 não enumera.', 'fonte×fonte'),
  D('div-m09-final-aula-indicada', 'média', '§Final promete aula indicada; a fonte não indica', [
    { onde: 'lede §Final L2103', literal: 'Se algum item ficar em branco, a aula correspondente está indicada na estrutura do módulo.' },
    { onde: 'ul.ck L2105-2134 e §MAP', literal: 'nenhum item traz aula; não há mapa aula × pergunta' },
  ], 'O vínculo item → aula teria de ser derivado (camada Alexandria), nunca atribuído à fonte.', 'fonte×fonte'),
  D('div-m09-criterio-bloco', 'alta', 'Critério de domínio: várias formas, uma delas sem texto', [
    { onde: 'sec-id §Quiz L1973 e lede L1975', literal: `${strip(sQuiz.sec_id_html)} / ${sQuiz.lede}` },
    { onde: 'script §QUIZ', literal: `${ln(nPass).trim()} → "${msgA.slice(0, 60)}…" / "${msgB.slice(0, 40)}…"` },
    { onde: '§Final h2 L2102', literal: sFinal.h2 },
    { onde: 'Aula 08 L1631 e L1695', literal: 'o critério de domínio deste bloco exige simetria / pede explicitamente a conexão entre um fato regulatório e a tese comercial da GridAlpha' },
  ], 'P18: nenhum vira critério de aprovação. A mensagem de aprovação do quiz ("Critério atendido. O bloco está fechado do lado do reconhecimento") fica como registro legado.', 'fonte×fonte'),
  D('div-m09-bloco-x-modulo', 'baixa', 'O arquivo se chama de "módulo" e de "bloco"', [
    { onde: 'title, kicker, rodapé', literal: 'Módulo 09' },
    { onde: '§Lex h2 L2142, §Voz, Aula 08, §Final, disc do INST·02', literal: 'O vocabulário do bloco / este bloco / matéria do Bloco 10' },
  ], 'Resíduo do "Currículo Definitivo" (blocos). O código usa bloco-09 e modulo-09 ao mesmo tempo.', 'fonte×fonte'),
  D('div-m09-marca', 'média', 'Marca GridAlpha em texto voltado ao learner', [
    { onde: 'destaques "Onde isso entra no produto"', literal: `${ondeProduto.filter((o) => o.contem_GridAlpha).length} de ${ondeProduto.length} citam GridAlpha` },
    { onde: 'Aula 08 L1695 (prosa, fora de destaque)', literal: 'a conexão entre um fato regulatório e a tese comercial da GridAlpha' },
  ], 'P24 e P7. A ocorrência da L1695 está num parágrafo comum da apostila, não num destaque de produto — não some só escondendo os destaques.', 'fonte×produto'),
  D('div-m09-onze-clausulas', 'baixa', 'Contrato decomposto em 12 blocos × "uma cláusula entre onze"', [
    { onde: 'h2 e lede Aula 04 (L1088-1089)', literal: 'O preço é uma cláusula entre onze. / As dez outras cláusulas' },
    { onde: 'Aula 04 > p L1091', literal: 'objeto, entrega, quantidade, perfil, preço, reajuste, garantias, inadimplemento, força maior, mudança regulatória, cessão e término' },
    { onde: 'tabela 04.1 L1099-1109', literal: '11 linhas, com nomes diferentes (Partes e grupo econômico … Rescisão e cessão)' },
  ], 'A enumeração em prosa tem 12 itens; a tabela tem 11, e os nomes não coincidem.', 'fonte×fonte'),
  D('div-m09-sinais-caso', 'média', '"quatro dos sete sinais favoráveis" no §Caso × tabela da Aula 08', [
    { onde: '§Caso destaque L1841', literal: 'carga estável, fator de carga alto, submercado de consumo bem definido e horizonte operacional longo são quatro dos sete sinais favoráveis' },
    { onde: 'Aula 08 tabela "Sinal favorável" L1639-1645', literal: 'Carga estável e previsível | Horizonte operacional longo | Histórico de medição horária confiável | Governança financeira madura | Concorrência real entre fornecedores | Flexibilidade operacional de processo | Janela contratual próxima' },
  ], 'Só dois dos quatro citados ("carga estável", "horizonte operacional longo") estão entre os sete sinais. "Fator de carga alto" e "submercado bem definido" não estão na tabela.', 'fonte×fonte'),
  D('div-m09-preco-fixo-restam', 'baixa', 'Riscos que sobram com preço fixo', [
    { onde: '§Voz relâmpago 29 L2022', literal: 'Elimina um; restam seis.' },
    { onde: '§Erros linha 8 L1865', literal: 'Permanecem volume, perfil, submercado, crédito, regulatório, saída e renovação' },
  ], 'Seis classes (Aula 05) × sete itens (o §Erros acrescenta "renovação", que a Aula 05.1 trata como face do risco de preço).', 'fonte×fonte'),
  D('div-m09-ref-todas-primarias', 'baixa', 'Título do §Ref × item 30', [
    { onde: 'h2 §Ref L2306', literal: sec('ref').h2 },
    { onde: 'li 30 L2339', literal: 'Fonte secundária · estrutura conceitual' },
  ], 'O lede explica a exceção ("está marcada como tal"), mas o título diz "todas primárias ou institucionais".', 'fonte×fonte'),
  D('div-m09-caso-parte', 'média', 'Caso "Operação A — parte 9" × P17', [
    { onde: 'sec-id §Caso L1771 e lede L1773', literal: 'Operação A — parte 9 / As oito partes anteriores construíram o perfil.' },
    { onde: 'decisão P17 (2026-09-16)', literal: 'Não existe "Parte 1". O título é Caso — Operação A' },
    { onde: 'outros HTMLs (grep, só leitura; corrigido na verificação de 2026-09-17)', literal: 'M02 "Operação A · Caso de referência · Parte 2" (L2475); M03 "Parte 3" só no comentário (L2170) e no checklist (L2484), com o lead citando "Parte 1" e "Parte 2" (L2177); M04 "Parte 4"; M05 "Parte 5"; M06 "· Parte 6" (sec-id L1083); M07/M08 "· Parte 7/8"; M10 "§Caso · Parte 10" (L2699), citando "Parte 9"; M11–M14 "Parte N"; M15 "parte 15"; M16 "parte 16" (sec-id com entidades HTML, L3686); M17 "Parte 17". Só o M01 não tem número de parte.' },
  ], 'A fonte do M09 declara literalmente uma série por módulo (parte N = módulo N). A série vai do M02 ao M17, e o M01 não tem número de parte. A caixa ("parte" × "Parte") e o separador (" — " × " · ") variam. P17 foi decidida sobre o M01; o título de produto segue P17, e o "parte 9" fica só na camada fonte.', 'fonte×decisao'),
  D('div-m09-codigo-cabecalho', 'baixa', 'Comentário do código sobre gravuras e instrumentos', [
    { onde: 'alexandria-modulo-09-content.ts L43-52', literal: 'INSTRUMENTOS: NÃO PORTADOS NESTA WAVE … instruments: [] nas oito aulas' },
    { onde: 'catálogo canônico L1871', literal: '09 | 11 | 0 | instruments: [] em todas as 8 aulas' },
  ], 'Coerentes entre si e com a fonte (11 na fonte, 0 no código). Registrado para o gate: RecursosDoModulo.tsx também tem instrumentos: [] para modulo-09, então o INST·01 (fora de aula) não aparece em lugar nenhum.', 'codigo'),
  D('div-m09-badge-pld', 'baixa', 'Badge "Leitor de Mercado" diz que o Bloco 09 não tem HTML', [
    { onde: 'alexandria-badges.ts L50-51', literal: 'PLD / MRE / GSF são Bloco 09 (Mercado ACR e ACL), sem HTML.' },
    { onde: 'fonte', literal: 'O HTML existe. Ele evita as siglas: "preço de liquidação das diferenças", "mecanismo de realocação de energia", "fator de ajuste". PLD, MRE e GSF não aparecem como texto. Só há "pld" em data-v="pld" (INST·05, L1277) e na chave pld: do script (L2752), e "gsf" no id="lv-gsf" (três níveis da Aula 07, L1593). MRE não aparece.' },
  ], 'O critério do badge ("90% das questões de PLD, MRE e GSF") não tem questões correspondentes no quiz do M09 com esses nomes.', 'fonte×codigo'),
];

// ── comparação com o código ─────────────────────────────────
const trilhas = X.lerCodigo('trilhas');
const comparacao_codigo = {
  arquivos: Object.values(X.CODE),
  contagem: {
    fonte_secoes: S.length,
    fonte_aulas: aulasRot.length,
    fonte_pill_aulas: pills[0].valor,
    codigo_aulas: codeAulas.length,
    codigo_totalInModule: [...code.matchAll(/totalInModule: (\d+)/g)].map((m) => +m[1]),
    trilhas_AULAS_POR_BLOCO: +trilhas.match(/'bloco-09': (\d+)/)[1],
    catalogo_contagens: catCont ?? null,
  },
  aulas: roteiro.filter((r) => r.tipo === 'aula').map((r) => ({ aula: r.id_html, ...r.codigo, catalogo: r.catalogo_canonico })),
  catalogo_codigo_bloco_09: blocos09,
  catalogo_codigo_bloco_10: blocos10,
  curriculo: 'alexandria-curriculo.ts importa MODULO_09_AULAS, MODULO_09_CORPO e MODULO_09_LEAD (L67-70) e os espalha nos índices globais (L121, L140, L159).',
  catalogo_canonico_instrumentos: catInst,
};

const out = {
  schema: 'alexandria-v2/extraction/modulo@1',
  grupo: 'modulo',
  modulo: 'm09',
  fonte: { arquivo: X.SRC, linhas_total: X.L.length, bytes: Buffer.byteLength(X.RAW) },
  gerado_em: '2026-09-17',
  gerado_por: 'extratores/m09_modulo.mjs — extração por linha + regex; nenhum texto de conteúdo digitado',
  convencoes: {
    html: 'fragmento literal da fonte, inline preservado',
    texto: 'o mesmo fragmento sem tags, espaços colapsados (a fonte não usa entidades HTML em conteúdo)',
    linha_aprox: 'linha 1-based no HTML-fonte (LF, 3.441 linhas)',
    marcacao_p14: 'anotação desta extração, não texto da fonte',
    null: 'ausência medida na fonte; sempre acompanhada de nota',
  },
  identidade, tese, resultado_esperado, mapa, roteiro, criterios, laboratorios, voz, erros_comuns, tradutor, divergencias, comparacao_codigo,
};
X.escreve('modulo.json', out);
console.log('modulo ok · seções', S.length, '· aulas', aulasRot.length, '· checklist', checklist.length, '· relâmpago', relampago.length, '· ataques', ataques.length, '· roteiro oral', roteiroOral.length, '· erros', erros_comuns.total, '· onde-produto', ondeProduto.length, '· avisos', principios.length, '· div', divergencias.length);
console.log(JSON.stringify(comparacao_codigo.aulas.map((a) => [a.aula, a.title_igual_h2, a.subtitle_igual_rotulo_sec_id, a.lead_igual_lede, a.catalogo?.rotulo_igual, a.catalogo?.titulo_igual])));
console.log(JSON.stringify(criterios.checklist.contagem_p14), catCont);
