// Extração programática do grupo "modulo" do M15 → modulo.json
// Todo texto de conteúdo sai do HTML-fonte por índice/regex. Nada digitado.
import {
  html, LINES, SRC, CODE, CATALOGO, read, lineOf, inl, txt, both, origem, balancedEnd, innerOf,
  allMatches, must, SECTIONS, sec, topBlocks, classOf, tableRows, describeBlock, writeJSON, pad, scriptLiteral, evalLiteral,
} from './lib.mjs';

const afterH2 = (s) => s.h2_idx + html.slice(s.h2_idx).indexOf('</h2>') + 5;
const blocksOf = (s) => topBlocks(afterH2(s), s.end);

// ── identidade ───────────────────────────────────────────────
const titleTag = html.match(/<title>(.*?)<\/title>/);
const heroStart = html.indexOf('<div class="hero">');
const heroEnd = balancedEnd(heroStart);
const hero = html.slice(heroStart, heroEnd);
const kicker = hero.match(/<div class="kicker">(.*?)<\/div>/);
const h1 = hero.match(/<h1>(.*?)<\/h1>/);
const sub = hero.match(/<p class="sub">([\s\S]*?)<\/p>/);
const pills = allMatches(/<span class="pill">(.*?)<\/span>/, html, heroStart, heroEnd).map((m, i) => ({
  id: `m15-hero-pill-${pad(i + 1)}`, ...both(m[1]), origem: origem('div.hero .pill-row span.pill', m[1], m.index),
}));
must(pills.length === 11, 'pills');
const footStart = html.indexOf('<footer>');
const footer = html.slice(footStart, html.indexOf('</footer>'));
const footLines = allMatches(/<div(?: class="bd")?>([\s\S]*?)<\/div>/, footer).filter((m) => !m[1].includes('<div')).map((m, i) => ({
  id: `m15-rodape-${pad(i + 1)}`, ...both(m[1]), origem: origem('footer .wrap > div', m[1], footStart + m.index),
}));
must(footLines.length === 4, 'rodape ' + footLines.length);

const tese = sec('tese');
const idxHoras = html.search(/duas horas\s+estimadas/);
must(idxHoras > 0, 'horas');
const fraseHoras = html.slice(html.lastIndexOf('<p>', idxHoras) + 3, html.indexOf('</p>', idxHoras));

const gridalpha = LINES.map((l, i) => ({ l, n: i + 1 })).filter((x) => x.l.includes('GridAlpha'))
  .map((x) => ({ linha_aprox: x.n, trecho: x.l.trim().slice(Math.max(0, x.l.trim().indexOf('GridAlpha') - 40), x.l.trim().indexOf('GridAlpha') + 60), no_script: x.n > 3265 }));

// catálogo canônico e código
const cat = read(CATALOGO);
const catIni = cat.indexOf('## Módulo 15 — ');
const catSec = cat.slice(catIni, cat.indexOf('\n---', catIni));
const catTitulo = catSec.match(/^## Módulo 15 — (.*)$/m)[1];
const catTrilha = catSec.match(/^\*\*Trilha\*\* · ([\s\S]*?)\n\*\*Escala/m)[1].replace(/\n/g, ' ');
const catEscala = catSec.match(/\*\*Escala\*\* · ([\s\S]*?)\n\n/)[1].replace(/\n/g, ' ');
const blocks = read(CODE.blocks);
const bloco15 = blocks.match(/\{ id: 'bloco-15'.*\}/)[0];
const blocoTitle = bloco15.match(/title: '([^']*)'/)[1];
const hMin = +bloco15.match(/estimatedHoursMin: (\d+)/)[1];
const hMax = +bloco15.match(/estimatedHoursMax: (\d+)/)[1];

const identidade = {
  id: 'm15-identidade',
  tipo: 'identidade',
  title_tag: { texto: titleTag[1], origem: origem('head > title', titleTag[1], titleTag.index) },
  kicker: { ...both(kicker[1]), origem: origem('div.hero .kicker', kicker[1], heroStart + kicker.index) },
  titulo: { ...both(h1[1]), origem: origem('div.hero h1', h1[1], heroStart + h1.index) },
  subtitulo: { ...both(sub[1]), origem: origem('div.hero p.sub', sub[1], heroStart + sub.index) },
  pills_hero: pills,
  verificado_em: { texto: txt(pills[10].html), nota: 'Data de verificação declarada no hero (pill 11). O §Ref e o rodapé repetem "4 de agosto de 2026".' },
  horas: {
    texto: null,
    min: null,
    max: null,
    nota: 'O hero NÃO declara tempo estimado (as 11 pills não trazem horas). A única menção a horas é a frase do §00.4 sobre o currículo externo, citada abaixo, que descreve o que "o currículo definitivo" fornece — não é declaração do módulo. O código (alexandria-blocks.ts) tem estimatedHoursMin 2 / estimatedHoursMax 2; a origem provável é essa frase. A pill "roteiro oral 9 min" mede só o §Voz.',
    frase_unica: { ...both(fraseHoras), origem: origem('section#tese §00.4 > p', fraseHoras, idxHoras) },
    codigo: { estimatedHoursMin: hMin, estimatedHoursMax: hMax, arquivo: 'src/lib/data/alexandria-blocks.ts' },
  },
  trilha: {
    fonte: null,
    nota: 'A fonte não declara trilha (kicker: "Alexandria · GridAlpha · Módulo 15"). O catálogo canônico marca a trilha como atribuída.',
    catalogo_canonico: catTrilha,
  },
  eixos: null,
  eixos_nota: 'A fonte não usa "eixo". A estrutura declarada é de três LENTES (§00.2: Regime; Camada e precificação; Acoplamento elétrico), registradas em tese.lentes. Não promovidas a eixo aqui.',
  rodape: footLines,
  titulo_catalogo: {
    catalogo_canonico: catTitulo,
    codigo_bloco_15: blocoTitle,
    fonte_h1: txt(h1[1]),
    iguais: catTitulo === txt(h1[1]) && blocoTitle === txt(h1[1]),
    nota: 'P24: o catálogo canônico governa o nome. Aqui os três coincidem literalmente. O <title> e o rodapé acrescentam "Alexandria · Módulo 15 — " antes do nome.',
  },
  escala_catalogo: catEscala,
  marca_gridalpha_ocorrencias: gridalpha,
  marca_nota: 'P24: "GridAlpha" é marca morta voltada ao learner. As ocorrências ficam literais nesta camada fonte e servem de lista de trabalho para a camada Alexandria.',
};

// ── §00 tese ─────────────────────────────────────────────────
const teseBlocks = blocksOf(tese);
const lentes = [], glosas = [], regua = [], teseItens = [];
let lenteN = 0, glosaN = 0, boxN = 0;
for (const b of teseBlocks) {
  const cls = classOf(b.open) ?? '';
  if (cls.startsWith('cbox')) {
    const m = b.inner.match(/<span class="ck2">(.*?)<\/span>([\s\S]*)/);
    lentes.push({ id: `m15-lente-${pad(++lenteN)}`, tipo: 'lente', rotulo: m[1], ...both(m[2]), origem: origem(`section#tese div.${cls.replace(' ', '.')}`, m[1], b.start) });
    continue;
  }
  if (cls === 'glo') {
    const hd = b.inner.match(/<div class="glo-hd">(.*?)<\/div>/)[1];
    const gw = b.inner.match(/<span class="gw">(.*?)<\/span>/)[1];
    const pares = [...b.inner.matchAll(/<div class="gak">([\s\S]*?)<\/div>\s*<div class="gav">([\s\S]*?)<\/div>/g)].map((p) => ({ chave: inl(p[1]), ...both(p[2]) }));
    must(pares.length === 3, 'glosa pares');
    glosas.push({ id: `m15-glosa-${pad(++glosaN)}`, tipo: 'glosa_de_desambiguacao', cabecalho: hd, palavra: gw, pares, origem: origem('section#tese div.glo', hd, b.start) });
    continue;
  }
  if (cls === 'tax') {
    for (const r of allMatches(/<div class="tax-row (\w+)"><div class="tax-n">(\d)<\/div><div class="tax-b">\s*<b>(.*?)<span class="st">(.*?)<\/span><\/b>([\s\S]*?)<\/div><\/div>/, html, b.start, b.end)) {
      regua.push({ id: `m15-regua-nomeacao-${r[2]}`, tipo: 'regua_de_nomeacao', classe: r[1], numero: +r[2], titulo: r[3], estado: r[4], ...both(r[5]), origem: origem('section#tese div.tax .tax-row', r[3], r.index) });
    }
    must(regua.length === 3, 'regua');
    continue;
  }
  const d = describeBlock(b, '§00');
  if (d.tipo === 'caixa') d.id = `m15-tese-caixa-${pad(++boxN)}`;
  teseItens.push(d);
}
const teseObj = {
  id: 'm15-tese',
  tipo: 'tese',
  marcador: { num: tese.sec_num, rotulo: tese.sec_rotulo },
  titulo_secao: both(tese.h2),
  blocos: teseItens,
  lentes,
  glosas,
  regua_de_nomeacao: regua,
  nota: 'blocos = todos os blocos do §00 na ordem da fonte, exceto lentes (div.cbox), glosas (div.glo) e régua (div.tax), que ficam nas chaves próprias. §00.6 "O que este módulo não faz" é a tabela final de blocos.',
  origem: origem('section#tese .sec-id', `${tese.sec_num} · ${tese.sec_rotulo}`, tese.sid_idx),
};
must(lentes.length === 3 && glosas.length === 3, 'lentes/glosas');

// ── Resultado esperado / critério construído ──────────────────
const criterioBox = teseItens.find((b) => b.tipo === 'caixa' && b.rotulo === 'Critério construído — Bloco 15');
must(criterioBox, 'criterio construido');
const resultado = {
  id: 'm15-resultado-esperado',
  tipo: 'capacidades',
  itens: null,
  nota: 'A fonte não tem seção "Resultado esperado" nem lista de capacidades (grep sem "Resultado esperado"/"Você consegue"). O que a fonte declara no lugar é o CRITÉRIO CONSTRUÍDO do §00.4 (ver criterios[0]) e o checklist de 28 itens do §Final (aparato.json), que o próprio §Final chama de forma operacional do critério. Nenhuma capacidade foi derivada aqui.',
  mais_proximo: { criterio_construido: 'm15-crit-construido', checklist: 'aparato.checklist_final' },
};

// ── §MAP ─────────────────────────────────────────────────────
const map = sec('map');
const mapBlocks = blocksOf(map);
const cadB = mapBlocks.find((b) => classOf(b.open) === 'cad');
const elos = allMatches(/<div class="cad-r (\w+)"><div class="cad-n">(\d)<\/div><div class="cad-k">(.*?)<span>(.*?)<\/span><\/div><div class="cad-v">(.*?)<\/div><\/div>/, html, cadB.start, cadB.end).map((m) => {
  const pc = m[5].match(/\s*<span class="pc (\w+)">(.*?)<\/span>$/);
  const corpo = pc ? m[5].slice(0, m[5].length - pc[0].length) : m[5];
  return {
    id: `m15-map-elo-${m[2]}`, tipo: 'elo_da_cadeia', numero: +m[2], faixa_classe: m[1], elo: m[3], segmento: m[4],
    ...both(corpo), natureza_preco: pc ? { classe: pc[1], ...both(pc[2]) } : null,
    origem: origem('section#map div.cad .cad-r', m[3], m.index),
  };
});
must(elos.length === 9, 'elos ' + elos.length);
const mapLede = mapBlocks.find((b) => classOf(b.open) === 'lede');
const mapBox = mapBlocks.find((b) => (classOf(b.open) ?? '').startsWith('box'));
const inst01 = mapBlocks.find((b) => classOf(b.open) === 'inst');
const mapa = {
  id: 'm15-mapa',
  tipo: 'mapa_do_modulo',
  marcador: { num: map.sec_num, rotulo: map.sec_rotulo },
  titulo_secao: both(map.h2),
  lede: { ...both(mapLede.inner), origem: origem('section#map p.lede', mapLede.inner, mapLede.start) },
  elos,
  perguntas_por_aula: null,
  perguntas_por_aula_nota: 'Diferente do M01, o §MAP do M15 não é "mapa das aulas" com pergunta por aula: é o mapa da cadeia em 9 elos. Não existe na fonte uma pergunta declarada por aula. Candidatos de pergunta por aula (lede, títulos h2) NÃO foram promovidos (P3/P11).',
  instrumento: { id: 'm15-inst-01', id_fonte: 'INST·01', ver: 'instrumentos.json', origem: origem('section#map div.inst', 'INST·01', inst01.start) },
  caixa_produto_p7: { ...describeBlock(mapBox, '§MAP'), nota_p7: 'Bloco "Onde isso entra no produto" — P7: não exibir ao learner; cita "GridAlpha Brasil Terminal" (P24).' },
  origem: origem('section#map .sec-id', `${map.sec_num} · ${map.sec_rotulo}`, map.sid_idx),
};

// ── roteiro ──────────────────────────────────────────────────
const roteiro = SECTIONS.map((s, i) => {
  const isAula = /^Aula \d\d$/.test(s.sec_num);
  const n = isAula ? s.sec_num.slice(5) : null;
  const subs = allMatches(/<h3><span class="num">(.*?)<\/span>\s*([\s\S]*?)<\/h3>/, html, s.start, s.end).map((m) => ({ numero: m[1], ...both(m[2]), linha_aprox: lineOf(m.index) }));
  const h4 = allMatches(/<h4>([\s\S]*?)<\/h4>/, html, s.start, s.end).map((m) => ({ ...both(m[1]), linha_aprox: lineOf(m.index) }));
  const insts = allMatches(/<span class="id">(INST·\d\d)<\/span> <span class="nm">(.*?)<\/span>/, html, s.start, s.end).map((m) => ({ id_fonte: m[1], titulo: m[2], id: `m15-inst-${m[1].slice(5)}` }));
  const fichas = subs.filter((x) => /^Ficha de elo/.test(x.texto)).map((x) => x.numero);
  return {
    id: isAula ? `m15-roteiro-aula-${n}` : `m15-roteiro-${s.anchor}`,
    tipo: isAula ? 'aula' : 'aparato',
    ordem_na_fonte: i + 1,
    ancora_html: s.anchor,
    marcador_num: s.sec_num,
    marcador_rotulo: s.sec_rotulo,
    titulo: both(s.h2),
    subsecoes: subs,
    subtitulos_h4: h4,
    instrumentos: insts,
    fichas_de_elo: fichas,
    vinculos: isAula ? { aula_id_codigo: `aula-15-${n}` } : {},
    origem: origem('section .sec-id', `${s.sec_num} · ${s.sec_rotulo}`, s.sid_idx),
  };
});
const aulasRot = roteiro.filter((r) => r.tipo === 'aula');
must(roteiro.length === 19 && aulasRot.length === 9, 'roteiro');

// ── critérios (P14) ──────────────────────────────────────────
const exS = sec('ex'), quizS = sec('quiz'), vozS = sec('voz'), finS = sec('final');
const lede = (s) => { const b = blocksOf(s).find((x) => classOf(x.open) === 'lede'); return { ...both(b.inner), origem: origem(`section#${s.anchor} p.lede`, b.inner, b.start) }; };
const scoreIdx = html.indexOf("sc.className='score show '");
const passMsg = html.match(/\? 'Critério atingido\.([^']*)'/);
const failMsg = html.match(/: '(Abaixo do critério de oito acertos\.[^']*)'/);
const p00_4 = teseItens.find((b) => b.tipo === 'paragrafo' && b.texto.startsWith('O currículo definitivo não fornece critério'));
const item1 = html.match(/<ul class="ck">\s*<li>([\s\S]*?)<\/li>/);
const criterio = {
  id: 'm15-criterio',
  tipo: 'criterio_do_modulo',
  nota_p18: 'A fonte declara o critério de domínio como CONSTRUÇÃO PRÓPRIA (§00.4) e o repete em cinco lugares com formas diferentes (construído oral <1 min; quiz 8/10; checklist 28 itens com o item 1 como "forma operacional"; roteiro oral gravado de 9 min; exercícios "em menos de um minuto"). Registrado sem escolher nenhum (P18). marcacao_p14 é anotação desta extração.',
  criterios: [
    {
      id: 'm15-crit-construido', secao: '§00.4', tipo: 'criterio_construido',
      introducao: { ...both(p00_4.html), origem: p00_4.origem },
      rotulo: criterioBox.rotulo,
      ...criterioBox.paragrafos[0],
      marcacao_p14: ['cronometrado', 'producao_oral_ou_livre', 'sem_consulta'],
      nota: '"em menos de um minuto" (cronometrado) e "explicar, sem consultar nota" (oral/livre). A própria fonte diz que é construção do módulo, "oferecida a correção".',
      origem: criterioBox.origem,
    },
    {
      id: 'm15-crit-exercicios', secao: '§Ex', tipo: 'criterio_exercicios', ...lede(exS),
      marcacao_p14: ['cronometrado', 'autoavaliado_sem_registro'],
      nota: 'Pede "a pergunta correta em menos de um minuto". Gabarito em <details> nativo (abre sem registro). Não há limiar numérico de exercícios.',
    },
    {
      id: 'm15-crit-quiz', secao: '§Quiz', tipo: 'criterio_quiz',
      titulo_secao: both(quizS.h2), ...lede(quizS),
      limiar_script: { condicao: "acertos>=8", classe_sim: 'pass', classe_nao: 'fail', origem: origem('<script> QUIZ corrigir()', "sc.className='score show '+(acertos>=8?'pass':'fail')", scoreIdx) },
      mensagem_atingido: { html: `Critério atingido.${passMsg[1]}`, origem: origem('<script> QUIZ corrigir() ramo acertos>=8', 'Critério atingido.', passMsg.index) },
      mensagem_abaixo: { html: failMsg[1], texto: txt(failMsg[1]), origem: origem('<script> QUIZ corrigir() ramo else', failMsg[1], failMsg.index) },
      pill_hero: txt(pills[6].html),
      marcacao_p14: ['automatizavel', 'P18_limiar_nao_e_evidencia'],
      nota: 'Prosa, h2, pill do hero e script concordam em 8/10 (≥8 = "Critério atingido"). Diferente do M01, aqui não há contradição interna do limiar. Pelo P18 o limiar continua sendo só registro legado.',
    },
    {
      id: 'm15-crit-voz', secao: '§Voz', tipo: 'criterio_oral',
      titulo_secao: both(vozS.h2), ...lede(vozS),
      pill_hero: txt(pills[7].html),
      marcacao_p14: ['producao_oral_ou_livre', 'cronometrado', 'gravado_autoavaliado'],
      nota: 'A fonte afirma que "o teste real deste bloco não é escrito — é falado": 9 minutos gravados, ouvidos de volta, com métrica de autoavaliação (número citado sem regime, camada ou critério de certeza).',
    },
    {
      id: 'm15-crit-checklist', secao: '§Final', tipo: 'criterio_conclusao',
      titulo_secao: both(finS.h2), ...lede(finS),
      item_1_forma_operacional: { ...both(item1[1]), origem: origem('section#final ul.ck > li:first-child', item1[1], item1.index) },
      itens: 'aparato.json → checklist_final (28 itens, com marcacao_p14 por item)',
      marcacao_p14: ['producao_oral_ou_livre', 'cronometrado_no_item_1'],
      nota: 'ul.ck sem script: a fonte não tem marcação/toggle nem persistência para o checklist do M15 (grep: nenhum handler para .ck).',
    },
  ],
};

// ── laboratórios ─────────────────────────────────────────────
const laboratorios = {
  id: 'm15-laboratorios',
  itens: null,
  nota: 'A fonte não tem seção "§ Lab" nem "LAB ·" (grep sem ocorrências). O único instrumento fora de aula é o INST·01 do §MAP (m15-inst-01), extraído em instrumentos.json e destinado a Recursos do Módulo (protocolo §3).',
  instrumento_de_modulo: 'm15-inst-01',
};

// ── voz ──────────────────────────────────────────────────────
const clk = allMatches(/<div class="clk-r"><div class="clk-t">(.*?)<\/div><div class="clk-b"><b>(.*?)<\/b>([\s\S]*?)<\/div><\/div>/, html, vozS.start, vozS.end).map((m, i) => ({
  id: `m15-voz-${pad(i + 1)}`, tipo: 'trecho_de_roteiro_oral', tempo: m[1], titulo: m[2], ...both(m[3]), origem: origem('section#voz .clk .clk-r', m[2], m.index),
}));
must(clk.length === 9, 'clk');
const vozBox = blocksOf(vozS).find((b) => (classOf(b.open) ?? '').startsWith('box'));
const voz = {
  id: 'm15-voz',
  tipo: 'roteiro_oral',
  marcador: { num: vozS.sec_num, rotulo: vozS.sec_rotulo },
  titulo_secao: both(vozS.h2),
  lede: lede(vozS),
  trechos: clk,
  caixa_final: { id: 'm15-voz-caixa', ...describeBlock(vozBox, '§Voz') },
  origem: origem('section#voz .sec-id', `${vozS.sec_num} · ${vozS.sec_rotulo}`, vozS.sid_idx),
};

// ── princípios editoriais ────────────────────────────────────
const refS = sec('ref');
const finBox = blocksOf(finS).find((b) => (classOf(b.open) ?? '').startsWith('box'));
const principios = [
  ...teseItens.filter((b) => b.tipo === 'caixa' && b.rotulo !== 'Critério construído — Bloco 15').map((b) => ({ ...b, papel: 'principio_ou_advertencia_do_§00' })),
  { id: 'm15-principio-regua', tipo: 'ponteiro', papel: 'régua de nomeação em três estados (P24/voz)', ver: 'tese.regua_de_nomeacao' },
  { id: 'm15-principio-regua-final', ...describeBlock(finBox, '§Final'), papel: 'régua de nomeação, versão de consulta rápida' },
  { id: 'm15-principio-ref', tipo: 'lede', papel: 'política de fonte (primária × parte interessada)', ...lede(refS) },
  { id: 'm15-principio-nao-faz', tipo: 'ponteiro', papel: '§00.6 O que este módulo não faz', ver: 'tese.blocos (última tabela)' },
  ...footLines.slice(2).map((f) => ({ ...f, tipo: 'aviso_de_rodape', papel: 'isenção de responsabilidade / perecibilidade' })),
];

// ── erros comuns ─────────────────────────────────────────────
const errS = sec('erros');
const errTab = blocksOf(errS).find((b) => classOf(b.open) === 'cmpx');
const errRows = tableRows(errTab.inner.match(/<table>([\s\S]*?)<\/table>/)[1]);
const errTrIdx = allMatches(/<tr><td>/, html, errTab.start, errTab.end).map((m) => m.index);
const erros = {
  id: 'm15-erros-comuns',
  tipo: 'erros_comuns',
  marcador: { num: errS.sec_num, rotulo: errS.sec_rotulo },
  titulo_secao: both(errS.h2),
  lede: lede(errS),
  cabecalho: errRows[0].map((c) => c.texto),
  itens: errRows.slice(1).map((r, i) => ({
    id: `m15-erro-${pad(i + 1)}`, tipo: 'erro_comum',
    afirmacao: r[0], correcao: r[1], teste_imediato: r[2],
    vinculos: { aulas_declaradas: [], nota: 'A fonte não liga erro a aula.' },
    origem: origem('section#erros div.cmpx table tr', r[0].html, errTrIdx[i]),
  })),
  contagem: { declarada_sec_id: errS.sec_rotulo, declarada_pill: txt(pills[5].html), markup: errRows.length - 1 },
  origem: origem('section#erros .sec-id', `${errS.sec_num} · ${errS.sec_rotulo}`, errS.sid_idx),
};
must(erros.itens.length === 20, 'erros');

// ── blocos "Onde isso entra no produto" (P7) ─────────────────
// [verificação] o regex exigia o rótulo exato e perdia o bloco da Aula 08 (L2489), cujo rótulo continua
// ("Onde isso entra no produto — e este é o gancho mais direto do currículo até aqui"). Agora casa o prefixo
// e guarda o rótulo literal em `rotulo`.
const p7 = allMatches(/<span class="tag">(Onde isso entra no produto[^<]*)<\/span>/).map((m, i) => {
  const s = SECTIONS.find((x) => x.start < m.index && x.end > m.index);
  const pStart = html.indexOf('<p>', m.index);
  const p = html.slice(pStart + 3, html.indexOf('</p>', pStart));
  return { id: `m15-p7-${pad(i + 1)}`, secao: s.sec_num, rotulo: m[1], ...both(p), cita_gridalpha: p.includes('GridAlpha'), origem: origem(`section#${s.anchor} .box .tag "${m[1]}"`, p, m.index + m[0].length) };
});
must(p7.length === 10, 'p7');

// ── comparação com o código ─────────────────────────────────
const ts = read(CODE.content);
const codeAulas = [...ts.matchAll(/id: "aula-15-(\d\d)",[\s\S]*?totalInModule: (\d+),\s*title: ("(?:[^"\\]|\\.)*"),\s*subtitle: ("(?:[^"\\]|\\.)*")/g)]
  .map((m) => ({ n: m[1], total: +m[2], title: JSON.parse(m[3]), subtitle: JSON.parse(m[4]) }));
const leadBlock = ts.slice(ts.indexOf('export const MODULO_15_LEAD'), ts.indexOf('export const MODULO_15_CORPO'));
const codeLeads = Object.fromEntries([...leadBlock.matchAll(/'aula-15-(\d\d)': ("(?:[^"\\]|\\.)*")/g)].map((m) => [m[1], JSON.parse(m[2])]));
const catAulas = Object.fromEntries([...catSec.matchAll(/^\| (\d\d) \| ([^|]+) \| (.+) \|$/gm)].map((m) => [m[1], { lente: m[2].trim(), titulo: m[3].trim() }]));
const titulos = aulasRot.map((r) => {
  const n = r.marcador_num.slice(5);
  const c = codeAulas.find((x) => x.n === n);
  const s = SECTIONS.find((x) => x.sec_num === r.marcador_num);
  const ledeB = blocksOf(s).find((b) => classOf(b.open) === 'lede');
  const joined = c ? (c.subtitle ? [`${c.title}: ${c.subtitle}`, `${c.title} — ${c.subtitle}`, `${c.title}, ${c.subtitle}`] : [c.title]) : [];
  return {
    aula: n,
    fonte_h2_texto: r.titulo.texto,
    fonte_rotulo_sec_id: r.marcador_rotulo,
    codigo_title: c?.title ?? null,
    codigo_subtitle: c?.subtitle ?? null,
    codigo_title_mais_subtitle_reconstroi_h2: joined.includes(r.titulo.texto),
    rotulo_sec_id_no_codigo: ts.includes(r.marcador_rotulo),
    codigo_lead_igual_lede: c ? codeLeads[n] === inl(ledeB.inner) : false,
    catalogo_titulo: catAulas[n]?.titulo ?? null,
    catalogo_titulo_igual_h2: catAulas[n]?.titulo === r.titulo.texto,
    catalogo_lente: catAulas[n]?.lente ?? null,
  };
});
const trilhas = read(CODE.trilhas);
const recursos = read(CODE.recursos);
const curriculo = read(CODE.curriculo);
const corpoCount = (ts.match(/^\s*\{ kind: '/gm) || []).length;
const comparacao_codigo = {
  arquivos: ['src/lib/data/alexandria-modulo-15-content.ts', 'src/lib/data/alexandria-curriculo.ts', 'src/lib/data/alexandria-trilhas.ts', 'src/lib/data/alexandria-blocks.ts', 'src/lib/data/alexandria-badges.ts', 'src/components/alexandria/navigation/RecursosDoModulo.tsx'],
  contagem_aulas: {
    fonte_sec_id_aula: aulasRot.length,
    fonte_pill: txt(pills[0].html),
    codigo_MODULO_15_AULAS: codeAulas.length,
    codigo_totalInModule: [...new Set(codeAulas.map((c) => c.total))],
    codigo_AULAS_POR_BLOCO: +trilhas.match(/'bloco-15': (\d+)/)[1],
    catalogo_tabela: Object.keys(catAulas).length,
    concordam: aulasRot.length === 9 && codeAulas.length === 9 && Object.keys(catAulas).length === 9,
  },
  titulos,
  catalogo_bloco_15_codigo: bloco15,
  corpo_blocos_codigo: corpoCount,
  exportacoes_nao_consumidas: {
    MODULO_15_EXERCICIOS_SOLTOS_importado_em_RecursosDoModulo: recursos.includes('MODULO_15_EXERCICIOS_SOLTOS'),
    MODULO_15_INSTRUMENTOS_importado_em_RecursosDoModulo: recursos.includes('MODULO_15_INSTRUMENTOS'),
    modulo_15_no_registro_RECURSOS: recursos.includes("'modulo-15'"),
    curriculo_importa: [...curriculo.matchAll(/MODULO_15_\w+/g)].map((m) => m[0]).filter((v, i, a) => a.indexOf(v) === i),
    nota: 'Leitura de código, não medição na tela: os 15 exercícios e o INST·01 existem como dado, mas RecursosDoModulo.tsx só registra modulo-01..09.',
  },
  badges_m15: read(CODE.badges).includes('bloco-15') ? 'há referência' : 'nenhum badge usa o checklist do M15 (BLOCOS_COM_CONTEUDO = 01..03)',
  o_que_o_codigo_nao_tem: '§00 (tese, lentes, glosas, régua, critério construído), §MAP (9 elos), §Caso, §Erros, §Quiz, §Voz, §Final, §Lex e §Ref não estão em src/lib/data para o M15 (o cabeçalho do arquivo declara o §Lex fora de escopo).',
};

// ── divergências ─────────────────────────────────────────────
const inst01ELOS = evalLiteral(scriptLiteral(html.indexOf('INST·01 — MAPA DA CADEIA'), 'ELOS').code);
const distinct = (k) => [...new Set(Object.values(inst01ELOS).map((e) => e[k]))];
const mapLedeTxt = mapa.lede.texto;
const D = (id, grupo, tema, leituras, nota) => ({ id, grupo, tema, leituras, nota, decisao: 'não escolhida — registrar (P5/P8)' });
const divergencias = [
  D('div-m15-01-nove-elos', 'fonte×fonte', 'Os "nove elos" do div.cad não são os nove elos do INST·01',
    [
      { onde: `§MAP div.cad (L${lineOf(cadB.start)})`, literal: elos.map((e) => e.elo).join(' · ') },
      { onde: `<script> INST·01 ELOS (L${scriptLiteral(html.indexOf('INST·01 — MAPA DA CADEIA'), 'ELOS').linha})`, literal: Object.values(inst01ELOS).map((e) => e.n).join(' · ') },
    ],
    'O lede do §MAP diz que "os mesmos nove objetos se reagrupam". O div.cad tem Reservatório e Consumo; o INST·01 troca esses dois por Ponto de medição fiscal e Termelétrica a gás, e nomeia os demais de outro modo (Escoamento × Gasoduto de escoamento, Refino × Refinaria…).'),
  D('div-m15-02-reagrupamentos', 'fonte×fonte', 'Contagem de grupos por dimensão: prosa do §MAP × dados do INST·01',
    [
      { onde: `§MAP p.lede (L${lineOf(mapLede.start)})`, literal: mapLedeTxt.slice(mapLedeTxt.indexOf('agrupados'), mapLedeTxt.indexOf('— e nenhum')).trim() },
      { onde: 'INST·01 ELOS (valores distintos medidos)', literal: `seg ${distinct('seg').length} · reg ${distinct('reg').length} · ac ${distinct('ac').length} · pr ${distinct('pr').length}` },
    ],
    `Segmento (3), regime (5) e acoplamento (4) batem. "Natureza do preço, quatro outros" não bate: o campo pr tem ${distinct('pr').length} valores distintos (${distinct('pr').join(' | ')}).`),
  D('div-m15-03-rotulo-recebe', 'fonte×fonte', 'INST·01: rótulo "Recebe" exibe o segmento',
    [{ onde: 'script INST·01 painel()', literal: `'<div class="fz i"><span class="fzk">Recebe</span><span class="fzv">'+esc(e.seg)+` }],
    'O cartão rotulado "Recebe" mostra o segmento (Upstream/Midstream/Downstream) e o texto "faz". Não há campo "recebe" nos dados. Resíduo do original, sinalizado e não corrigido (§10).'),
  D('div-m15-04-criterio-formas', 'fonte×fonte', 'Critério de domínio em cinco formas',
    criterio.criterios.map((c) => ({ onde: c.secao, literal: c.texto ?? c.item_1_forma_operacional?.texto })),
    'P18: nenhuma forma prevalece. O §Final diz que o item 1 é "o critério construído no §00.4, na sua forma operacional", mas o conteúdo difere: o §00.4 pede também explicar a passagem do custo do gás para o CVU e para o preço (não está no item 1; aparece nos itens 26-27), e o item 1 acrescenta "digo qual dos três a fonte omitiu".'),
  D('div-m15-05-parte-15', 'fonte×decisão', 'O §Caso se rotula "Operação A — parte 15"',
    [{ onde: `§Caso .sec-id (L${lineOf(sec('caso').sid_idx)})`, literal: sec('caso').sec_rotulo }, { onde: 'decisão P17', literal: 'Não existe "Parte 1"; título "Caso — Operação A"' }],
    'A fonte numera o caso como parte de uma série (a lede cita "as catorze partes anteriores" e a "parte 09"). Literal preservado; P17 governa a camada Alexandria.'),
  D('div-m15-06-horas', 'fonte×código', 'Horas do módulo',
    [{ onde: 'fonte', literal: `hero sem horas; §00.4: "${txt(fraseHoras).slice(txt(fraseHoras).indexOf('Ele fornece'), txt(fraseHoras).indexOf('posicionamento') + 14)}"` }, { onde: 'alexandria-blocks.ts bloco-15', literal: `estimatedHoursMin ${hMin} · estimatedHoursMax ${hMax}` }],
    'A frase descreve o currículo externo, não o módulo (9 aulas, 10 instrumentos, 28 itens, 9 min de oral). O 2–2 do código não tem declaração própria do módulo como origem.'),
  D('div-m15-07-titulos-aula', 'fonte×código', 'Título/subtítulo das aulas no código são cortes do h2; o rótulo de lente do sec-id não existe no código',
    titulos.map((t) => ({ onde: `Aula ${t.aula}`, literal: `h2 "${t.fonte_h2_texto}" | sec-id "${t.fonte_rotulo_sec_id}" | código title "${t.codigo_title}" / subtitle "${t.codigo_subtitle}"` })),
    `O código corta o h2 em ":"/" — " (título + subtítulo); o h2 se reconstrói em ${titulos.filter((t) => t.codigo_title_mais_subtitle_reconstroi_h2).length}/9. A Aula 09 fica com subtitle "". O rótulo do sec-id ("Lente de Regime", "Lente de Camada", "Lente de Acoplamento Elétrico", "Síntese") não aparece em lugar nenhum do arquivo de conteúdo (${titulos.filter((t) => t.rotulo_sec_id_no_codigo).length}/9).`),
  D('div-m15-08-recursos-nao-registrados', 'fonte×código', 'Exercícios soltos e INST·01 portados mas não registrados na interface',
    [{ onde: 'alexandria-modulo-15-content.ts', literal: 'export MODULO_15_EXERCICIOS_SOLTOS (15) e MODULO_15_INSTRUMENTOS (m15-inst-01)' }, { onde: 'RecursosDoModulo.tsx', literal: "RECURSOS registra só 'modulo-01'..'modulo-09'" }],
    'Deduzido por leitura de código (não medido na tela). Nenhum outro arquivo importa as duas exportações.'),
  D('div-m15-09-catalogo-citacao-truncada', 'fonte×catálogo', 'Citação do §00.4 truncada no catálogo canônico',
    [{ onde: 'fonte §00.4', literal: p00_4.texto }, { onde: 'catalogo-modulos-alexandria.md', literal: catSec.match(/> "O currículo definitivo[\s\S]*?"\n/)[0].replace(/\n> /g, ' ').replace(/^> /, '').trim() }],
    'O catálogo fecha a citação com ponto depois de "construção deste módulo" e omite ", derivada da justificativa declarada no currículo e da frase-chave, e é oferecida a correção:".'),
  D('div-m15-10-catalogo-siglas', 'fonte×catálogo', 'Termos centrais no catálogo usam siglas que não são nomes de verbete',
    [{ onde: 'catálogo "Termos centrais"', literal: ['UPGN', 'FSRU', 'CVU', 'CMO', 'GNL'].filter((s) => catSec.includes(s)).join(', ') }, { onde: 'fonte §Lex', literal: 'Unidade de processamento de gás natural · Unidade flutuante de armazenamento e regaseificação · Custo variável unitário · Custo marginal de operação · Gás natural liquefeito' }],
    'Paráfrase do catálogo; a lista literal dos 174 está em aparato.json. "Oferta Permanente" do catálogo junta dois verbetes (Concessão e Partilha).'),
  D('div-m15-11-marca', 'fonte×decisão', 'Marca GridAlpha em texto voltado ao learner',
    [{ onde: 'fonte', literal: `${gridalpha.length} linhas com "GridAlpha" (${gridalpha.filter((g) => g.no_script).length} no script)` }, { onde: 'P24', literal: 'Alexandria (produto) / NIVAR (empresa)' }],
    'Kicker, rodapé, régua de nomeação ("concorrente direto da GridAlpha"), blocos P7 e o feedback da Q10 do quiz. Literal preservado.'),
  D('div-m15-12-oito-topicos', 'fonte×fonte', '"Oito tópicos" do currículo externo × 9 aulas do módulo',
    [{ onde: 'fonte §00.4', literal: txt(fraseHoras).slice(txt(fraseHoras).indexOf('Ele fornece'), txt(fraseHoras).indexOf('tópicos') + 7) }, { onde: 'fonte (sec-id "Aula NN")', literal: `${[...html.matchAll(/class="sec-id">Aula \d+/g)].length} seções de aula` }],
    'A frase descreve o que o currículo externo fornece, não o roteiro do módulo; o markup (9 aulas) vence para a contagem (P8). O mapeamento tópico→aula não é declarado na fonte. Registrado, não resolvido.'),
];

writeJSON('modulo.json', {
  grupo: 'modulo',
  modulo: 'm15',
  camada: 'fonte',
  fonte: SRC,
  fonte_linhas: LINES.length - (LINES[LINES.length - 1] === '' ? 1 : 0), // [verificação] o arquivo termina em LF: 4140 linhas (wc -l), não 4141
  gerado_em: '2026-09-17',
  gerado_por: 'extratores/m15_modulo.mjs — extração programática (Node) por índice/regex sobre o HTML; nenhum texto de conteúdo digitado',
  convencoes: {
    html: 'fragmento literal da fonte com espaços colapsados; inline preservado',
    texto: 'o mesmo fragmento sem tags, entidades decodificadas',
    linha_aprox: 'linha 1-based no HTML-fonte (LF)',
    marcacao_p14: 'anotação desta extração, não texto da fonte',
    nota: 'campos nota/nota_*: anotação desta extração',
  },
  identidade, tese: teseObj, resultado_esperado: resultado, mapa, roteiro, criterio, laboratorios, voz,
  principios_editoriais: principios, erros_comuns: erros,
  tradutor: null,
  tradutor_nota: 'Não há seção "Tradutor" no M15 (o §Map minúsculo do M01 não existe aqui). O único §MAP é o mapa da cadeia (mapa).',
  blocos_produto_p7: p7,
  divergencias,
  comparacao_codigo,
  contagens: {
    secoes: roteiro.length, aulas: aulasRot.length, aparatos: roteiro.length - aulasRot.length,
    subsecoes_h3_aulas: aulasRot.reduce((a, r) => a + r.subsecoes.length, 0),
    fichas_de_elo: aulasRot.reduce((a, r) => a + r.fichas_de_elo.length, 0),
    pills_hero: pills.length, elos_map: elos.length, lentes: lentes.length, glosas: glosas.length, regua_estados: regua.length,
    criterios: criterio.criterios.length, voz_trechos: clk.length, erros_comuns: erros.itens.length,
    blocos_p7: p7.length, principios: principios.length, marca_gridalpha_linhas: gridalpha.length, divergencias: divergencias.length,
  },
});
console.log('modulo ok', JSON.stringify({ aulas: aulasRot.length, p7: p7.length, gridalpha: gridalpha.length, pr: distinct('pr').length }));
console.log(JSON.stringify(titulos.map((t) => [t.aula, t.codigo_title_mais_subtitle_reconstroi_h2, t.codigo_lead_igual_lede, t.catalogo_titulo_igual_h2])));
