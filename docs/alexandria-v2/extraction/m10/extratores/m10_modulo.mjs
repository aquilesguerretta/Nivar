// Extrator do grupo "modulo" do M10 → modulo.json.
import fs from 'node:fs';
import {
  doc, html, FONTE, lineOf, texto, inline, frag, ini, origem, find, findAll, byClass, byTag,
  classes, hasClass, inner, secoes, blocos, writeJSON, collapse, SCRIPT, SCRIPT_START, kids,
} from './lib.mjs';
import { C10, BLOCKS } from './code.mjs';

const CATALOGO = 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md';
const TRILHAS = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/src/lib/data/alexandria-trilhas.ts';
const BADGES = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/src/lib/data/alexandria-badges.ts';
const BADGERULES = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/src/lib/progress/badgeRules.ts';
const RECURSOS = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/src/components/alexandria/navigation/RecursosDoModulo.tsx';
const secs = secoes();
const S = Object.fromEntries(secs.map((s) => [s.id, s]));

// ---------------- identidade
const hero = find(doc, byClass('hero'));
const kicker = find(hero, byClass('kicker'));
const h1 = find(hero, byTag('h1'));
const sub = find(hero, byClass('sub'));
const titleTag = find(doc, byTag('title'));
const pills = findAll(hero, byClass('pill')).map((p, i) => {
  const b = find(p, byTag('b'));
  return { id: `m10-pill-${String(i + 1).padStart(2, '0')}`, numero: texto(inner(b)), resto: texto(inner(p).replace(/<b>[\s\S]*?<\/b>/, '')), ...frag(inner(p)), origem: origem('.hero .pill-row .pill', p) };
});
const footer = find(doc, byTag('footer'));
const fps = findAll(footer, byTag('p'));
const rodape = {
  bd: { ...frag(inner(fps[0])), origem: origem('footer p.bd', fps[0]) },
  linhas: inner(fps[1]).split(/<br\s*\/?>/).map((l) => texto(l)),
  html: inline(inner(fps[1])),
  origem: origem('footer p (2º)', fps[1]),
};

// catálogo canônico (md) — trechos literais
const cat = fs.readFileSync(CATALOGO, 'utf8');
const catIni = cat.indexOf('## Módulo 10 — ');
const catFim = cat.indexOf('\n## Módulo 11', catIni);
const catSec = cat.slice(catIni, catFim);
const catLine = (s) => cat.slice(0, cat.indexOf(s)).split('\n').length;
const catTitulo = catSec.split('\n')[0].replace('## Módulo 10 — ', '');
const catEscala = collapse(/\*\*Escala\*\*[\s\S]*?\n\n/.exec(catSec)[0]);
const catTrilha = collapse(/\*\*Trilha\*\*[\s\S]*?\n\*\*Escala/.exec(catSec)[0].replace(/\n\*\*Escala$/, ''));
const catAulas = [...catSec.matchAll(/^\| (\d\d) \| ([^|]+) \| ([^|]+) \|$/gm)].map((m) => ({ numero: m[1], rotulo: m[2].trim(), titulo: m[3].trim() }));
const bloco10 = BLOCKS.ALEXANDRIA_BLOCKS.find((b) => b.id === 'bloco-10');

const identidade = {
  kicker: { ...frag(inner(kicker)), origem: origem('.hero .kicker', kicker) },
  titulo: { ...frag(inner(h1)), origem: origem('.hero h1', h1) },
  titulo_tag_title: { texto: texto(inner(titleTag)), origem: origem('head title', titleTag) },
  subtitulo: { ...frag(inner(sub)), origem: origem('.hero p.sub', sub) },
  pills,
  trilha_declarada: { texto: texto(inner(kicker)).split(' · ').slice(-1)[0], nota: 'Recorte do kicker literal (último segmento após " · ").' },
  horas: {
    texto: null, min: null, max: null,
    nota: 'A fonte não declara carga horária: nenhum pill, kicker, rodapé ou seção traz duração do módulo (varredura por /\\bhoras?\\b/ só acha "horas" de posto tarifário e de janela de apuração).',
    codigo: { arquivo: 'src/lib/data/alexandria-blocks.ts', estimatedHoursMin: bloco10.estimatedHoursMin, estimatedHoursMax: bloco10.estimatedHoursMax, nota: 'Sem origem na fonte do M10.' },
    catalogo_canonico: 'O catálogo canônico não traz horas para o Módulo 10 (a linha "Escala" não tem duração).',
  },
  eixos: {
    nota: 'A fonte declara "quatro eixos de controle" como organização do conteúdo (§00 e Aula 01). São eixos do objeto (a fatura), não eixos curriculares; registrados literalmente.',
    afirmacao: (() => { const b = findAll(S.tese.node, byClass('box')).find((x) => /A afirmação que organiza o módulo/.test(inner(x))); const p = find(b, byTag('p')); return { rotulo: texto(inner(find(b, byClass('tag')))), ...frag(inner(p)), origem: origem('#tese div.box.cy', b, inner(p)) }; })(),
    titulos_na_aula_01: findAll(S.a01.node, byTag('h3')).filter((h) => /Eixo \d/.test(inner(h))).map((h) => ({ numero: texto(inner(find(h, byClass('num')))), texto: texto(inner(h).replace(/<span class="num">[\s\S]*?<\/span>/, '')), origem: origem('#a01 h3', h) })),
  },
  rodape,
  catalogo_canonico: {
    arquivo: CATALOGO,
    titulo: catTitulo, titulo_linha: catLine('## Módulo 10 — '),
    trilha: catTrilha, escala: catEscala,
    aulas: catAulas,
  },
  catalogo_codigo: { arquivo: 'src/lib/data/alexandria-blocks.ts', entrada: bloco10 },
};

// ---------------- tese (§00)
const tese = { marcador: S.tese.marcador, rotulo: S.tese.rotulo, titulo: S.tese.titulo, origem: origem('#tese .sec-id', S.tese.secId), blocos: blocos(S.tese.node, 'm10-tese') };

// ---------------- mapa (§MAP)
const mapCards = findAll(S.map.node, byClass('map-card')).map((a, i) => ({
  id: `m10-map-${String(i + 1).padStart(2, '0')}`,
  href: a.attrs.href,
  aula: texto(inner(find(a, byClass('n')))),
  titulo_curto: texto(inner(find(a, byClass('t')))),
  descricao: texto(inner(find(a, byClass('d')))),
  pergunta: null,
  origem: origem('#map .map-grid a.map-card', a),
}));
const lentesP = findAll(S.map.node, byTag('p')).find((p) => /A primeira lente pergunta/.test(inner(p)));
const mapa = {
  marcador: S.map.marcador, rotulo: S.map.rotulo, titulo: S.map.titulo, origem: origem('#map .sec-id', S.map.secId),
  blocos: blocos(S.map.node, 'm10-map'),
  perguntas_do_mapa: {
    nota: 'As "três perguntas" do título do § MAP são as três lentes do Inst · 01. Literal do parágrafo e dos botões.',
    paragrafo: { ...frag(inner(lentesP)), origem: origem('#map p', lentesP) },
    perguntas: findAll(lentesP, byTag('b')).map((b) => texto(inner(b))),
    botoes_do_instrumento: findAll(find(doc, (n) => n.attrs?.id === 'mf-seg'), byTag('button')).map((b) => ({ valor: b.attrs['data-l'], rotulo: texto(inner(b)) })),
  },
  cartoes_das_aulas: mapCards,
  nota_cartoes: 'Os cartões do § MAP trazem título curto e descrição por aula, sem pergunta. `pergunta` = null em cada um.',
};

// ---------------- roteiro
const codeAula = Object.fromEntries(C10.MODULO_10_AULAS.map((a) => [a.id, a]));
const roteiro = secs.map((s, i) => {
  const isAula = /^Aula \d+$/.test(s.marcador);
  const n = isAula ? s.marcador.slice(5) : null;
  const wrap = find(s.node, byClass('wrap'));
  const cont = {
    titulos_h3: findAll(s.node, byTag('h3')).length,
    paragrafos: kids(wrap, (c) => c.tag === 'p').length,
    boxes: findAll(s.node, (x) => hasClass(x, 'box')).length,
    tres_niveis_lv: findAll(s.node, (x) => hasClass(x, 'lv')).length,
    fichas_fi: findAll(s.node, (x) => hasClass(x, 'fi')).length,
    tabelas: findAll(s.node, byTag('table')).length,
    cadeias_chain: findAll(s.node, (x) => hasClass(x, 'chain')).length,
    formulas_form: findAll(s.node, (x) => hasClass(x, 'form')).length,
    notas_de_fonte: findAll(s.node, (x) => hasClass(x, 'srcnote')).length,
    listas_ol_ul: findAll(s.node, (x) => x.tag === 'ol' || x.tag === 'ul').length,
    details: findAll(s.node, byTag('details')).length,
    instrumentos: findAll(s.node, (x) => x.tag === 'div' && classes(x).join(' ') === 'inst').map((x) => texto(inner(find(x, byClass('id'))))),
  };
  const card = mapCards.find((c) => c.href === `#${s.id}`);
  const code = isAula ? codeAula[`aula-10-${n}`] : null;
  const lede = find(s.node, byClass('lede'));
  return {
    ordem: i + 1, dom_id: s.id, tipo: isAula ? 'aula' : 'aparato', numero_aula: n ? Number(n) : null,
    marcador: s.marcador, rotulo: s.rotulo, titulo: s.titulo,
    titulo_no_mapa: card ? card.titulo_curto : null,
    lede: lede ? frag(inner(lede)) : null,
    origem: origem(`section#${s.id} .sec-id`, s.secId),
    contagens: cont,
    codigo: code ? { id: code.id, title: code.title, subtitle: code.subtitle, title_igual_h2: code.title === s.titulo, subtitle_igual_rotulo: code.subtitle === s.rotulo, instruments: code.instruments.map((x) => x.id), illustrations: code.illustrations, lead_igual_lede: collapse(C10.MODULO_10_LEAD[code.id]) === texto(inner(lede)), lead_igual_ignorando_espaco_antes_de_pontuacao: collapse(C10.MODULO_10_LEAD[code.id]).replace(/ ([:;,.])/g, '$1') === texto(inner(lede)), lead_codigo: C10.MODULO_10_LEAD[code.id] } : null,
  };
});
const aulas = roteiro.filter((r) => r.tipo === 'aula');

// ---------------- critério
const h3crit = findAll(S.tese.node, byTag('h3')).find((h) => /critério de domínio/.test(inner(h)));
const pCrit = S.tese.node && (() => { const w = find(S.tese.node, byClass('wrap')); const idx = w.children.indexOf(h3crit); return w.children[idx + 1]; })();
const quizLede = find(S.quiz.node, byClass('lede'));
const finalLede = find(S.final.node, byClass('lede'));
const a09Lede = find(S.a09.node, byClass('lede'));
const p093 = findAll(S.a09.node, byTag('p')).find((p) => /O critério de domínio nomeia/.test(inner(p)));
const scoreIdx = SCRIPT.indexOf("sc.className='score show '");
const scoreBlock = SCRIPT.slice(scoreIdx, SCRIPT.indexOf("'</div>';", scoreIdx) + 9);
const msgs = [...scoreBlock.matchAll(/'((?:Critério|Abaixo)[^']*)'/g)].map((m) => m[1]);
const pillCrit = pills.find((p) => /critério/.test(p.texto));
const vozLede = find(S.voz.node, byClass('lede'));
const inst10Final = /Os nove passos foram executados dentro do envelope de cinco minutos previsto pelo critério de domínio\./.exec(SCRIPT);
const criterio = {
  nota: 'Formas literais em que a fonte declara critério. Nenhuma é escolhida (P18). marcacao_p14 é anotação desta extração.',
  itens: [
    { id: 'm10-crit-01', onde: '§00.3', titulo: texto(inner(h3crit).replace(/<span class="num">[\s\S]*?<\/span>/, '')), ...frag(inner(pCrit)), marcacao_p14: ['cronometrado', 'producao_oral_ou_livre'], origem: origem('#tese h3 + p', pCrit) },
    { id: 'm10-crit-02', onde: 'hero · pill', ...pillCrit, marcacao_p14: ['automatizavel_quiz'] },
    { id: 'm10-crit-03', onde: '§Quiz · h2', texto: S.quiz.titulo, marcacao_p14: ['automatizavel_quiz'], origem: origem('#quiz h2', S.quiz.h2) },
    { id: 'm10-crit-04', onde: '§Quiz · lede', ...frag(inner(quizLede)), marcacao_p14: ['automatizavel_quiz'], origem: origem('#quiz p.lede', quizLede) },
    { id: 'm10-crit-05', onde: '§Quiz · <script> placar', codigo: scoreBlock, limiar: 'acertos>=8', mensagens: { 'acertos>=8': msgs[0], 'acertos<8': msgs[1] }, marcacao_p14: ['automatizavel_quiz'], origem: { seletor: '<script> corrigir()', trecho_inicial: scoreBlock.slice(0, 60), linha_aprox: lineOf(SCRIPT_START + scoreIdx) } },
    { id: 'm10-crit-06', onde: 'Aula 09 · lede', ...frag(inner(a09Lede)), marcacao_p14: ['cronometrado'], origem: origem('#a09 p.lede', a09Lede) },
    { id: 'm10-crit-07', onde: 'Aula 09 · 09.3', ...frag(inner(p093)), marcacao_p14: [], origem: origem('#a09 p', p093) },
    { id: 'm10-crit-08', onde: '§Final · h2 + lede', titulo: S.final.titulo, ...frag(inner(finalLede)), marcacao_p14: ['autodeclarado'], nota: 'Os 28 itens estão em aparato.json → checklist_final, com a marcação P14 por item.', origem: origem('#final p.lede', finalLede) },
    { id: 'm10-crit-09', onde: '§Voz · lede', ...frag(inner(vozLede)), marcacao_p14: ['producao_oral_ou_livre', 'cronometrado'], nota: 'Roteiro "para ser dito em voz alta"; o h2 fixa dez minutos.', origem: origem('#voz p.lede', vozLede) },
    { id: 'm10-crit-10', onde: 'Inst · 10 · veredito com 9 passos', texto: inst10Final[0], marcacao_p14: ['cronometrado'], origem: { seletor: '<script> INST·10 render()', trecho_inicial: inst10Final[0].slice(0, 60), linha_aprox: lineOf(SCRIPT_START + inst10Final.index) } },
  ],
  quatro_achados_do_criterio: (() => { const t = findAll(S.a09.node, byTag('table'))[0]; return findAll(t, byTag('tr')).slice(1).map((tr) => texto(inner(find(tr, byTag('td'))))); })(),
};

// ---------------- voz
const vozPs = kids(find(S.voz.node, byClass('wrap')), (c) => c.tag === 'p' && !hasClass(c, 'lede'));
const voz = {
  roteiro_oral: {
    marcador: S.voz.marcador, rotulo: S.voz.rotulo, titulo: S.voz.titulo, lede: frag(inner(vozLede)),
    marcacao_p14: ['producao_oral_ou_livre', 'cronometrado'],
    blocos: vozPs.map((p, i) => {
      const b = find(p, byTag('b'));
      return { id: `m10-voz-${String(i + 1).padStart(2, '0')}`, rotulo: texto(inner(b)), corpo: texto(inner(p).replace(/<b>[\s\S]*?<\/b>/, '')), ...frag(inner(p)), origem: origem('#voz p', p) };
    }),
    origem: origem('#voz .sec-id', S.voz.secId),
  },
  principios: [
    { id: 'm10-voz-pr-01', onde: 'rodapé', linhas: rodape.linhas, origem: rodape.origem },
    { id: 'm10-voz-pr-02', onde: '§Ref · lede', ...frag(inner(find(S.ref.node, byClass('lede')))), origem: origem('#ref p.lede', find(S.ref.node, byClass('lede'))) },
    { id: 'm10-voz-pr-03', onde: '§Erros · lede', ...frag(inner(find(S.erros.node, byClass('lede')))), origem: origem('#erros p.lede', find(S.erros.node, byClass('lede'))) },
    { id: 'm10-voz-pr-04', onde: '§Ex · lede', ...frag(inner(find(S.ex.node, byClass('lede')))), origem: origem('#ex p.lede', find(S.ex.node, byClass('lede'))) },
  ],
  caixas_numeros_vivos: findAll(doc, (x) => hasClass(x, 'box') && hasClass(x, 'rd')).map((b) => {
    const s = secs.find((q) => q.node.start <= b.start && q.node.end >= b.end);
    const tag = find(b, byClass('tag'));
    return { secao: s.marcador, rotulo: texto(inner(tag)), ...frag(inner(find(b, byTag('p')))), origem: origem(`#${s.id} div.box.rd`, b, inner(find(b, byTag('p')))) };
  }),
};

// ---------------- erros comuns
const errT = find(S.erros.node, byTag('table'));
const errRows = findAll(errT, byTag('tr'));
const erros_comuns = {
  marcador: S.erros.marcador, rotulo: S.erros.rotulo, titulo: S.erros.titulo,
  lede: frag(inner(find(S.erros.node, byClass('lede')))),
  cabecalho: findAll(errRows[0], byTag('th')).map((x) => texto(inner(x))),
  itens: errRows.slice(1).map((tr, i) => { const td = findAll(tr, byTag('td')); return { id: `m10-erro-${String(i + 1).padStart(2, '0')}`, afirmacao: frag(inner(td[0])), correcao: frag(inner(td[1])), origem: origem('#erros table tr', tr) }; }),
  origem: origem('#erros .sec-id', S.erros.secId),
};

// ---------------- tradutor (três níveis)
const tradutor = {
  nota: 'Não há seção "Tradutor" no M10. O equivalente são os blocos .lv de três níveis dentro das aulas (Criança de 12 anos / Executivo não técnico / Especialista do setor). Extraídos literalmente.',
  blocos: findAll(doc, (x) => x.tag === 'div' && classes(x).join(' ') === 'lv').map((lv, i) => {
    const s = secs.find((q) => q.node.start <= lv.start && q.node.end >= lv.end);
    const tabs = findAll(lv, byClass('lv-tab'));
    return {
      id: `m10-lv-${String(i + 1).padStart(2, '0')}`, secao: s.marcador, cabecalho: texto(inner(find(lv, byClass('lv-hd')))),
      niveis: findAll(lv, byClass('lv-pane')).map((p) => ({ chave: p.attrs['data-p'], aba: texto(inner(tabs.find((t) => t.attrs['data-lv'] === p.attrs['data-p']))), aberto_no_carregamento: hasClass(p, 'on'), ...frag(inner(p)) })),
      origem: origem(`#${s.id} div.lv`, lv, inner(find(lv, byClass('lv-hd')))),
    };
  }),
};

// ---------------- fichas de modalidade (declaradas no hero)
const fichas = findAll(doc, (x) => x.tag === 'div' && classes(x).join(' ') === 'fi').map((fi, i) => ({
  id: `m10-ficha-${String(i + 1).padStart(2, '0')}`,
  nome: texto(inner(find(fi, byClass('sg')))), tipo: texto(inner(find(fi, byClass('tp')))),
  campos: findAll(fi, byClass('fi-row')).map((r) => ({ campo: texto(inner(find(r, byClass('fi-k')))), ...frag(inner(find(r, byClass('fi-v')))) })),
  origem: origem('#a02 div.fi', fi, inner(find(fi, byClass('sg')))),
}));

// ---------------- produto (P7) e marca (P24)
const produto = findAll(doc, (x) => hasClass(x, 'box') && hasClass(x, 'gd')).map((b) => {
  const s = secs.find((q) => q.node.start <= b.start && q.node.end >= b.end);
  return { secao: s.marcador, rotulo: texto(inner(find(b, byClass('tag')))), menciona_gridalpha: /GridAlpha/.test(inner(b)), linha_aprox: lineOf(b.start) };
});
const gridalpha = [];
{
  const body = html.indexOf('<body>');
  let i = body;
  while ((i = html.indexOf('GridAlpha', i + 1)) > 0) gridalpha.push({ linha: lineOf(i), contexto: collapse(html.slice(Math.max(0, i - 60), i + 40).replace(/<[^>]+>/g, '')) });
}

// ---------------- comparação com código
const trilhas = fs.readFileSync(TRILHAS, 'utf8');
const badges = fs.readFileSync(BADGES, 'utf8');
const rules = fs.readFileSync(BADGERULES, 'utf8');
const recursos = fs.readFileSync(RECURSOS, 'utf8');
const comparacao_codigo = {
  contagem_de_aulas: {
    sec_id_aula_nn: aulas.length,
    cartoes_do_map: mapCards.length,
    pill_hero: pills[0].texto,
    subsecoes_numeradas_nn_x: (() => { const s = new Set(); for (const a of aulas) for (const h of findAll(S[a.dom_id].node, byClass('num'))) s.add(texto(inner(h)).split('.')[0]); return [...s]; })(),
    codigo_MODULO_10_AULAS: C10.MODULO_10_AULAS.length,
    codigo_totalInModule: [...new Set(C10.MODULO_10_AULAS.map((a) => a.totalInModule))],
    codigo_AULAS_POR_BLOCO: Number(/'bloco-10':\s*(\d+)/.exec(trilhas)[1]),
    catalogo_canonico: catAulas.length,
  },
  titulos_das_aulas: aulas.map((a) => ({ aula: a.marcador, h2: a.titulo, rotulo: a.rotulo, titulo_no_mapa: a.titulo_no_mapa, codigo_title: a.codigo.title, codigo_subtitle: a.codigo.subtitle, catalogo: (catAulas.find((c) => `Aula ${c.numero}` === a.marcador) || {}).titulo ?? null, h2_igual_codigo: a.codigo.title_igual_h2, rotulo_igual_codigo: a.codigo.subtitle_igual_rotulo, h2_igual_mapa: a.titulo === a.titulo_no_mapa })),
  leads: aulas.map((a) => ({ aula: a.marcador, igual: a.codigo.lead_igual_lede, igual_ignorando_espaco_antes_de_pontuacao: a.codigo.lead_igual_ignorando_espaco_antes_de_pontuacao })),
  nota_leads: 'Onde o lede tem <b>…</b> seguido de pontuação, o código removeu a tag e deixou um espaço antes da pontuação ("dinheiro :", "paga .", "publicado ,"). O texto é o mesmo.',
  catalogo_codigo_bloco_10: bloco10,
  badge: { existe: badges.includes('badge-anatomista-de-faturas'), regra_bloqueio: /badge-anatomista-de-faturas',\s*avaliar: null,\s*bloqueio: '([^']+)'/.exec(rules)?.[1] ?? null, nota: 'A razão da regra diz que o Bloco 10 "não tem HTML extraído"; o M10 já está em alexandria-modulo-10-content.ts.' },
  recursos_do_modulo_registra_m10: /MODULO_10|modulo-10-content/.test(recursos),
  nao_existe_no_codigo: ['tese (§00)', 'cartões do § MAP (título curto + descrição)', 'critérios', 'caso (§Caso)', 'erros comuns (§Erros)', 'quiz (§Quiz)', 'roteiro oral (§Voz)', 'checklist (§Final)', 'glossário (§Lex, 161 termos)', 'referências (§Ref, 35)'],
};

// ---------------- divergências
const div = [];
const D = (id, tema, a, b, nota, linhas) => div.push({ id, tema, leitura_a: a, leitura_b: b, linhas_aprox: linhas || [], nota, decisao: 'não escolhida — registrar para reconciliação (P5/P8/P18)' });
D('div-01-criterio', 'Critério do módulo em formas diferentes', { onde: '§00.3 L531-539', texto: criterio.itens[0].texto }, { onde: '§Quiz h2/lede L3009-3011 + pill L436 + script', texto: `${S.quiz.titulo} | ${criterio.itens[3].texto} | ${msgs[0]}` }, 'O §00.3 declara o critério "oficial" como operacional e cronometrado (5 minutos); o § Quiz chama 8/10 de "critério de aprovação"; o § Final lista 28 verificações "antes de assinar um parecer" sem linguagem de aprovação. Nenhuma forma declara precedência. P18.', [531, 436, 3009, 3087]);
D('div-02-quiz-sem-faixas', 'Placar do quiz: só dois ramos', { onde: 'script L4791-4796', texto: 'acertos>=8 → mensagem de critério atingido; senão → mensagem de abaixo do critério' }, { onde: '—', texto: 'Diferente do M01, o M10 não tem faixa intermediária. Questão sem resposta conta como erro (sel nulo).' }, 'Registro de mecânica; o quiz marca right/wrong (verde/vermelho) e mostra todos os feedbacks ao corrigir.', [4791]);
D('div-03-parte-10', 'Caso numerado como "Parte 10"', { onde: '§Caso sec-id L2699', texto: 'Parte 10' }, { onde: 'P17 (decisões)', texto: 'Para o M01, P17 diz que não existe "Parte 1" e o título é "Caso — Operação A".' }, 'No M10 a numeração existe literalmente ("Parte 10", "Parte 9", "As nove partes anteriores") e pressupõe uma série de partes nos Módulos 01–09 que a fonte do M10 não contém. P17 manda não expor "Partes" da fonte como estrutura.', [2699, 2702]);
D('div-04-horas', 'Carga horária', { onde: 'fonte', texto: 'não declarada' }, { onde: 'alexandria-blocks.ts bloco-10', texto: `estimatedHoursMin ${bloco10.estimatedHoursMin}, estimatedHoursMax ${bloco10.estimatedHoursMax}, priority ${bloco10.priority}` }, 'O código tem 8–10 h sem origem na fonte do M10; o catálogo canônico não traz horas.', []);
D('div-05-trilha', 'Nome da trilha', { onde: 'kicker L425', texto: texto(inner(kicker)) }, { onde: 'catálogo canônico', texto: catTrilha }, 'Caixa e artigo diferentes ("O setor elétrico brasileiro" × "Setor Elétrico Brasileiro"). O catálogo já registra isso.', [425]);
D('div-06-titulos-mapa', 'Títulos curtos do § MAP × h2 das aulas', { onde: '§MAP cartões', texto: mapCards.filter((c, i) => c.titulo_curto !== aulas[i].titulo).map((c) => `${c.aula}: ${c.titulo_curto}`).join(' | ') }, { onde: 'h2 das aulas', texto: aulas.filter((a) => a.titulo !== a.titulo_no_mapa).map((a) => `${a.marcador}: ${a.titulo}`).join(' | ') }, 'Três aulas têm título curto no mapa diferente do h2. O código e o catálogo usam o h2.', mapCards.map((c) => c.origem.linha_aprox));
D('div-07-marca', 'Marca GridAlpha em texto voltado ao learner', { onde: `${gridalpha.length} ocorrências`, texto: gridalpha.map((g) => `L${g.linha}`).join(', ') }, { onde: 'P24', texto: 'GridAlpha está morta como marca voltada ao learner (Alexandria / NIVAR).' }, 'Texto mantido literal. Inclui o rodapé ("Material de estudo da GridAlpha") e caixas "Onde isso entra no produto" (P7).', gridalpha.map((g) => g.linha));
D('div-08-exercicios-categorias', 'Distribuição declarada dos exercícios', { onde: '§Ex lede L2892', texto: texto(inner(find(S.ex.node, byClass('lede')))) }, { onde: 'prefixos dos summaries', texto: 'ver aparato.json → exercicios.contagem_por_prefixo' }, 'Detalhe no grupo aparato.', [2892]);
D('div-09-tempo-envelope', 'Soma dos tempos da ordem de leitura × "cinco minutos"', { onde: 'Aula 09 · 09.5 (li .sw) e Inst · 10 (PASSOS.t)', texto: 'soma 280 s (4 min 40 s)' }, { onde: '§00.3 / Aula 09 / §Final item 1', texto: 'cinco minutos' }, 'Não é contradição: 280 s cabe em 300 s. Registrado para quem exibir o envelope. O 09.2 diz que "os três primeiros passos consomem menos de um minuto somados" (20+15+40 = 75 s) e o Inst · 10 diz "menos de um minuto e meio somados": duas leituras do mesmo número.', [2507, 4553]);
D('div-10-leads-espaco', 'Leads do código com espaço antes da pontuação', { onde: 'fonte (p.lede das Aulas 03, 07, 08)', texto: 'pontuação colada ao </b>' }, { onde: 'MODULO_10_LEAD', texto: 'espaço antes de ":", "." e ","' }, 'Artefato de remoção de tag; o texto é o mesmo. O mesmo artefato aparece nas notas dos Inst · 03, 05 e 11. Nota: o cabeçalho do código diz "359.726 bytes"; o arquivo tem 359.726 caracteres e ' + FONTE.bytes + ' bytes UTF-8 — a fonte não mudou, a unidade do cabeçalho é que está trocada.', []);
D('div-11-badge-razao', 'Razão da regra do badge desatualizada', { onde: 'badgeRules.ts', texto: 'o Bloco 10 (Tarifas e a Conta de Luz Industrial) não tem HTML extraído' }, { onde: 'código', texto: 'MODULO_10_AULAS existe com 9 aulas' }, 'Fora do escopo de conteúdo; registrado.', []);
D('div-12-recursos', 'Recursos do Módulo sem o M10', { onde: 'RecursosDoModulo.tsx', texto: `registra M10: ${comparacao_codigo.recursos_do_modulo_registra_m10}` }, { onde: 'código de dados', texto: 'm10-inst-01 (fora de aula) e MODULO_10_EXERCICIOS_SOLTOS (14) existem' }, 'Deduzido da leitura, não medido na tela: o Inst · 01 e os 14 exercícios parecem inalcançáveis na interface.', []);

const out = {
  schema: 'alexandria-v2/extraction/modulo@1',
  modulo: 'M10', grupo: 'modulo', fonte: FONTE, gerado_em: '2026-09-17',
  metodo: 'Extração programática (Node) por árvore de elementos com offsets (extratores/lib.mjs); nenhum texto de conteúdo digitado. Código e catálogo lidos só para comparação.',
  convencoes: {
    html: 'fragmento literal da fonte, espaços colapsados, inline preservado',
    texto: 'o mesmo sem tags, entidades decodificadas',
    linha_aprox: 'linha 1-based no HTML-fonte (LF)',
    marcacao_p14: 'anotação desta extração (cronometrado, producao_oral_ou_livre, automatizavel_quiz, autodeclarado), não texto da fonte',
  },
  contagens: {
    secoes: roteiro.length, aulas: aulas.length, aparatos: roteiro.length - aulas.length,
    pills: pills.length, cartoes_map: mapCards.length, criterios_literais: criterio.itens.length,
    voz_blocos: voz.roteiro_oral.blocos.length, caixas_numeros_vivos: voz.caixas_numeros_vivos.length,
    erros_comuns: erros_comuns.itens.length, tradutor_lv: tradutor.blocos.length,
    fichas_de_modalidade: fichas.length, caixas_produto: produto.length, gridalpha_ocorrencias: gridalpha.length,
    divergencias: div.length,
  },
  identidade, tese,
  resultado_esperado: null,
  nota_resultado_esperado: 'A fonte do M10 não tem bloco "Resultado esperado" nem lista de capacidades. O que mais se aproxima é o critério do §00.3 (quatro achados em cinco minutos) e a tabela dos quatro achados da Aula 09, em criterio.',
  mapa, roteiro, criterio,
  laboratorios: null,
  nota_laboratorios: 'Não há § Lab no M10. O instrumento de módulo (fora de aula) é o Inst · 01, no § MAP; ver instrumentos.json.',
  voz, erros_comuns, tradutor, fichas_de_modalidade: fichas,
  produto_p7: { nota: 'Caixas "Onde isso entra no produto" (box gd). Pelo P7 não vão para a interface; listadas só por posição.', caixas: produto },
  marca_p24: gridalpha,
  comparacao_codigo,
  divergencias: div,
};
writeJSON('modulo.json', out);
console.log(JSON.stringify(out.contagens), JSON.stringify(comparacao_codigo.contagem_de_aulas));
console.log(comparacao_codigo.titulos_das_aulas.map((t) => `${t.aula} h2=code:${t.h2_igual_codigo} rot=code:${t.rotulo_igual_codigo} mapa:${t.h2_igual_mapa} cat:${t.catalogo === t.h2}`).join('\n'));
console.log(comparacao_codigo.leads.map((l) => `${l.aula}:${l.igual}`).join(' '));
