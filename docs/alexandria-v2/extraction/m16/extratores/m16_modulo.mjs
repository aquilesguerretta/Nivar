// Extrator deterministico do grupo "modulo" do M16 -> modulo.json
// hero, §00 (tese), §MAP, roteiro das 21 secoes, criterios, §Voz, §Erros, principios de voz,
// comparacao com o codigo e com o catalogo. Nenhum texto de conteudo e digitado.
import {
  html, LINES, lineOf, inline, texto, hx, origem, pad, all, divBlock, secao, writeJson, read, CODE, CATALOGO,
  SCRIPT_BASE, runScript, decode,
} from './lib.mjs';

const SECS = ['tese', 'map', 'a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'a08', 'a09', 'a10', 'fichas', 'caso', 'erros', 'ex', 'quiz', 'voz', 'final', 'lex', 'ref'];
const one = (re, s, base, sel, n = 60) => {
  const m = re.exec(s); if (!m) throw new Error('nao achado: ' + re);
  return { ...hx(m[1]), origem: origem(sel, texto(m[1]).slice(0, n), base + m.index) };
};
// caixas .box <cor> com tag + paragrafos
function boxes(sec) {
  return all(/<div class="box (\w+)"[^>]*>/g, sec.body, sec.start).map(({ m, idx }) => {
    const blk = divBlock(html, idx);
    const tag = /<span class="tag">([\s\S]*?)<\/span>/.exec(blk);
    const ps = all(/<p>([\s\S]*?)<\/p>/g, blk, idx).map(({ m: p, idx: pi }) => ({ ...hx(p[1]), origem: origem(`section#${sec.id} div.box.${m[1]} p`, texto(p[1]).slice(0, 60), pi) }));
    return { cor: m[1], rotulo: tag ? texto(tag[1]) : null, paragrafos: ps, origem: origem(`section#${sec.id} div.box.${m[1]}`, tag ? texto(tag[1]) : '', idx) };
  });
}
const h3s = (sec) => all(/<h3[^>]*>(?:<span class="num">([\s\S]*?)<\/span>)?([\s\S]*?)<\/h3>/g, sec.body, sec.start)
  .map(({ m, idx }) => ({ numero: m[1] ? texto(m[1]) : null, titulo: texto(m[2]), origem: origem(`section#${sec.id} h3`, texto(m[0]).slice(0, 60), idx) }));

// ---------------- IDENTIDADE ----------------
const titleTag = /<title>([\s\S]*?)<\/title>/.exec(html);
const hero = { start: html.indexOf('<div class="hero">') }; hero.body = divBlock(html, hero.start);
const pills = all(/<span class="pill">([\s\S]*?)<\/span>/g, hero.body, hero.start);
const dom = runScript();
const identidade = {
  id: 'm16-identidade',
  tipo: 'identidade',
  title_tag: { ...hx(titleTag[1]), origem: origem('head > title', texto(titleTag[1]), titleTag.index) },
  kicker: one(/<div class="kicker">([\s\S]*?)<\/div>/, hero.body, hero.start, 'div.hero .kicker'),
  titulo: one(/<h1>([\s\S]*?)<\/h1>/, hero.body, hero.start, 'div.hero h1'),
  subtitulo: one(/<p class="sub">([\s\S]*?)<\/p>/, hero.body, hero.start, 'div.hero p.sub'),
  pills: pills.map(({ m, idx }, i) => {
    const idm = /<b id="([^"]+)">/.exec(m[1]);
    return {
      id: `m16-pill-${pad(i + 1)}`, ...hx(m[1]),
      preenchido_pelo_script: idm ? { id_fonte: idm[1], valor_no_markup: '—', valor_renderizado: dom.byId[idm[1]].textContent, codigo: LINES[lineOf(html.indexOf(`setTxt('${idm[1]}'`)) - 1].trim(), linha: lineOf(html.indexOf(`setTxt('${idm[1]}'`)) } : null,
      origem: origem('div.hero .pill-row span.pill', texto(m[1]), idx),
    };
  }),
  horas: null,
  nota_horas: 'A fonte não declara carga horária: nenhuma ocorrência de "horas" no hero ou no §00 (as ocorrências de "horas" no arquivo são de duração de armazenamento, de recarga e de interrupção). Só há "roteiro oral 10 min" (pill) e "Dez minutos" (§Voz).',
  eixos: null,
  nota_eixos: 'A fonte não rotula "eixos". O que organiza o módulo é declarado como "três lentes" (§00.2, ver tese.lentes) e a lente de cada aula vem no sec-id.',
  rodape: (() => {
    const f = html.indexOf('<footer>'); const b = html.slice(f, html.indexOf('</footer>', f));
    return { linhas: all(/<div(?: class="bd")?>([\s\S]*?)<\/div>\n/g, b, f).map(({ m, idx }) => ({ ...hx(m[1]), origem: origem('footer div', texto(m[1]).slice(0, 60), idx) })) };
  })(),
};

// ---------------- TESE (§00) ----------------
const tese = secao('tese');
const tb = tese.body, tbase = tese.start;
const teseObj = {
  id: 'm16-tese',
  tipo: 'tese',
  sec_id: one(/<div class="sec-id">([\s\S]*?)<\/div>/, tb, tbase, 'section#tese .sec-id'),
  titulo: one(/<h2>([\s\S]*?)<\/h2>/, tb, tbase, 'section#tese h2'),
  lede: one(/<p class="lede">([\s\S]*?)<\/p>/, tb, tbase, 'section#tese p.lede'),
  subsecoes: h3s(tese),
  caixas: boxes(tese),
  lentes: all(/<div class="cbox (c\d)"><span class="ck2">([\s\S]*?)<\/span>([\s\S]*?)<\/div>/g, tb.slice(0, tb.indexOf('§00.3')), tbase)
    .map(({ m, idx }, i) => ({ id: `m16-lente-${i + 1}`, rotulo: texto(m[2]), ...hx(m[3]), origem: origem('section#tese div.chain .cbox', texto(m[2]), idx) })),
  regua_de_estagio: all(/<div class="esc-r (p\d)"><div class="esc-n">(\d)<\/div><div class="esc-b"><b>([\s\S]*?)<\/b>([\s\S]*?)<span class="ev"><i>Exige<\/i>([\s\S]*?)<\/span><\/div><\/div>/g, tb, tbase)
    .map(({ m, idx }) => ({ posicao: +m[2], nome: texto(m[3]), descricao: texto(m[4]), exige_rotulo: 'Exige', exige: texto(m[5]), origem: origem('section#tese div.esc .esc-r', texto(m[3]), idx) })),
  candidatos_a_gargalo: (() => {
    const at = tb.indexOf('<div class="num-list">'); const blk = divBlock(tb, at);
    return all(/<li><b>([\s\S]*?)<\/b>\s*(?:&mdash;|—)\s*([\s\S]*?)<\/li>/g, blk, tbase + at)
      .map(({ m, idx }, i) => ({ ordem: i + 1, nome: texto(m[1]), html: inline(m[2]), texto: texto(m[2]), origem: origem('section#tese div.num-list > li', texto(m[1]), idx) }));
  })(),
  glosas_de_desambiguacao: all(/<div class="glo">/g, tb, tbase).map(({ idx }, i) => {
    const blk = divBlock(html, idx);
    const hd = /<div class="glo-hd">([\s\S]*?)<\/div>/.exec(blk);
    const gw = /<span class="gw">([\s\S]*?)<\/span>/.exec(blk);
    const ga = blk.indexOf('<div class="ga">');
    const ps = all(/<p>([\s\S]*?)<\/p>/g, blk, idx).map(({ m, idx: pi }) => ({ ...hx(m[1]), antes_dos_sentidos: pi - idx < ga, origem: origem('div.glo p', texto(m[1]).slice(0, 60), pi) }));
    return {
      id: `m16-glosa-${i + 1}`, cabecalho: texto(hd[1]), palavra: texto(gw[1]), paragrafos: ps,
      sentidos: all(/<div class="gak">([\s\S]*?)<\/div><div class="gav">([\s\S]*?)<\/div>/g, blk, idx).map(({ m, idx: si }) => {
        const mini = /<span class="mini">([\s\S]*?)<\/span>/.exec(m[2]);
        return { rotulo: texto(m[1]), html: inline(m[2]), texto: texto(m[2]), remissao: mini ? texto(mini[1]) : null, origem: origem('div.glo .ga', texto(m[1]), si) };
      }),
      origem: origem('section#tese div.glo', texto(hd[1]), idx),
    };
  }),
  regua_de_nomeacao: all(/<div class="tax-row (\w+)"><div class="tax-n">(\d)<\/div><div class="tax-b"><b>([\s\S]*?)<\/b><span\s+class="st">([\s\S]*?)<\/span><br>([\s\S]*?)<\/div><\/div>/g, tb, tbase)
    .map(({ m, idx }) => ({ estado: +m[2], classe: m[1], nome: texto(m[3]), etiqueta: texto(m[4]), ...hx(m[5]), origem: origem('section#tese div.tax .tax-row', texto(m[3]), idx) })),
  o_que_o_modulo_nao_faz: all(/<div class="mot-r (\w+)"><b>([\s\S]*?)<span\s+class="mt">([\s\S]*?)<\/span><\/b>([\s\S]*?)<\/div>/g, tb, tbase)
    .map(({ m, idx }) => ({ classe: m[1], titulo: texto(m[2]), etiqueta: texto(m[3]), texto: texto(m[4]), origem: origem('section#tese div.mot .mot-r', texto(m[2]), idx) })),
  paragrafos: all(/<p>([\s\S]*?)<\/p>/g, tb, tbase).filter(({ idx }) => !/class="(box|glo|tax|mot)/.test(enclosingDivClass(idx))).map(({ m, idx }) => ({ ...hx(m[1]), origem: origem('section#tese > p', texto(m[1]).slice(0, 60), idx) })),
};
function enclosingDivClass(idx) {
  // classe da div aberta mais proxima que ainda nao fechou
  const before = html.slice(tese.start, idx); const stack = []; let m; const re = /<div\b([^>]*)>|<\/div>/g;
  while ((m = re.exec(before))) { if (m[0] === '</div>') stack.pop(); else stack.push(m[1]); }
  return stack.slice(1).join(' ');
}

// ---------------- MAPA (§MAP) ----------------
const map = secao('map');
const mapa = {
  id: 'm16-mapa',
  tipo: 'mapa-do-modulo',
  sec_id: one(/<div class="sec-id">([\s\S]*?)<\/div>/, map.body, map.start, 'section#map .sec-id'),
  titulo: one(/<h2>([\s\S]*?)<\/h2>/, map.body, map.start, 'section#map h2'),
  lede: one(/<p class="lede">([\s\S]*?)<\/p>/, map.body, map.start, 'section#map p.lede'),
  paragrafo: one(/<\/p>\s*<p>([\s\S]*?)<\/p>/, map.body, map.start, 'section#map > p'),
  instrumento: { codigo_fonte: 'INST·01', ref: 'instrumentos.json#m16-inst-01' },
  caixa_como_ler: boxes(map)[0],
  perguntas_por_aula: null,
  nota_perguntas: 'O §MAP do M16 não tem tabela aula × pergunta (diferente do § MAP do M01). O mapa é das seis tendências, reagrupadas em quatro dimensões pelo INST·01. Nenhuma pergunta por aula foi derivada.',
  tendencias_declaradas: ['eletrificação de transporte', 'armazenamento em baterias', 'medição avançada e digitalização', 'agregação de recursos distribuídos', 'mercado regulado de carbono', 'demanda de centros de dados'],
  nota_tendencias: 'Lista copiada dos <b> do parágrafo do §MAP (L1301-1304), na ordem da fonte.',
};

// ---------------- ROTEIRO ----------------
const conteudo = read(CODE.conteudo);
const codeAulas = [...conteudo.matchAll(/id: "(aula-16-\d\d)",[\s\S]*?number: (\d+),\s*totalInModule: (\d+),\s*title: "([^"]*)",\s*subtitle: "([^"]*)"/g)]
  .map((m) => ({ id: m[1], number: +m[2], total: +m[3], title: m[4], subtitle: m[5] }));
const codeCorpoNums = {};
for (const m of conteudo.matchAll(/'(aula-16-\d\d)': \[([\s\S]*?)\n  \],/g)) codeCorpoNums[m[1]] = [...m[2].matchAll(/kind: 'titulo', numero: (null|"[^"]*"), texto: "([^"]*)"/g)].map((x) => ({ numero: x[1] === 'null' ? null : JSON.parse(x[1]), texto: x[2] }));
const codeLead = {};
for (const m of conteudo.matchAll(/'(aula-16-\d\d)': ("(?:[^"\\]|\\.)*"),\r?\n/g)) codeLead[m[1]] = JSON.parse(m[2]);

const instDe = (s) => all(/<span class="id">([\s\S]*?)<\/span>/g, s.body).map(({ m }) => texto(m[1]));
const roteiro = SECS.map((id, i) => {
  const s = secao(id);
  const sid = /<div class="sec-id">([\s\S]*?)<\/div>/.exec(s.body);
  const h2 = /<h2>([\s\S]*?)<\/h2>/.exec(s.body);
  const b = /<b>([\s\S]*?)<\/b>/.exec(sid[1]);
  const aulaM = /^Aula (\d\d)/.exec(texto(sid[1]));
  const lede = /<p class="lede">([\s\S]*?)<\/p>/.exec(s.body);
  return {
    ordem: i + 1,
    secao_id: id,
    tipo: aulaM ? 'aula' : 'aparato',
    aula_id: aulaM ? `aula-16-${aulaM[1]}` : null,
    sec_id: { ...hx(sid[1]), origem: origem(`section#${id} .sec-id`, texto(sid[1]), s.start + sid.index) },
    marcador: texto(sid[1]).split(' · ')[0],
    rotulo: texto(b[1]),
    titulo: { ...hx(h2[1]), origem: origem(`section#${id} h2`, texto(h2[1]).slice(0, 60), s.start + h2.index) },
    lede_presente: !!lede,
    lede_inicio: lede ? texto(lede[1]).slice(0, 80) : null,
    subsecoes: h3s(s),
    instrumentos: instDe(s),
    linhas: [lineOf(s.start), lineOf(s.end)],
  };
});
const aulas = roteiro.filter((r) => r.tipo === 'aula');

// ---------------- CRITERIOS ----------------
const crit = teseObj.caixas.find((c) => /Critério de domínio/.test(c.rotulo));
const resol = teseObj.caixas.find((c) => /Resolução declarada/.test(c.rotulo));
const quiz = secao('quiz');
const fin = secao('final');
const ex = secao('ex');
const voz = secao('voz');
const quizScript = (() => {
  const a = html.indexOf("sc.className='score show '", SCRIPT_BASE);
  const lA = lineOf(a);
  const lines = [];
  for (let l = lA; l <= lA + 6; l++) lines.push({ linha: l, codigo: LINES[l - 1].replace(/\s+$/, '') });
  const mm = /\(acertos>=8\s*\?\s*'([^']*)'\s*:\s*'([^']*)'\)/.exec(html.slice(html.indexOf('sc.innerHTML=', a), a + 4000));
  const msgs = [mm[1], mm[2]];
  return { codigo: lines, limiar: "acertos>=8", mensagens: [{ condicao: 'acertos>=8', classe: 'score show pass', html: msgs[0] }, { condicao: 'acertos<8', classe: 'score show fail', html: msgs[1] }].map((x) => ({ ...x, texto: texto(x.html) })) };
})();
const a10 = secao('a10');
const tresTendencias = all(/<div class="clk-r"><div class="clk-t">([\s\S]*?)<\/div><div class="clk-b"><b>([\s\S]*?)<\/b>([\s\S]*?)<\/div><\/div>/g, a10.body, a10.start)
  .map(({ m, idx }) => ({ data: texto(m[1]), tendencia: texto(m[2]), ...hx(m[3]), origem: origem('section#a10 div.clk .clk-r', texto(m[1]), idx) }));
const checklistH2 = one(/<h2>([\s\S]*?)<\/h2>/, fin.body, fin.start, 'section#final h2');
const ckItens = all(/<li>([\s\S]*?)<\/li>/g, fin.body, fin.start);
const criterio = {
  id: 'm16-criterio',
  tipo: 'criterio_do_modulo',
  nota_p5_p18: 'Cinco formulações de critério coexistem (currículo §00.6, quiz 8/10, checklist de 30, §Ex "menos de um minuto", §Voz oral de 10 min). A fonte chama o do §00.6 de "critério de domínio" e o do quiz de "critério". Nenhuma declara precedência; registrado, não escolhido (P18).',
  criterios: [
    {
      id: 'm16-crit-curriculo', tipo: 'criterio_de_dominio_do_curriculo', secao: '§00.6',
      rotulo: crit.rotulo, ...crit.paragrafos[0], observacoes_da_fonte: teseObj.paragrafos.filter((p) => /âncora|segunda metade do critério/.test(p.texto)),
      resolucao_declarada: resol,
      resposta_da_fonte_a_primeira_metade: { secao: 'Aula 10 · 10.3', itens: tresTendencias, nota: 'A fonte dá três tendências "apenas na data desta verificação".' },
      marcacao_p14: ['producao_oral_ou_livre', 'nao_automatizavel'],
    },
    {
      id: 'm16-crit-quiz', tipo: 'criterio_quiz', secao: '§Quiz',
      titulo: one(/<h2>([\s\S]*?)<\/h2>/, quiz.body, quiz.start, 'section#quiz h2'),
      lede: one(/<p class="lede">([\s\S]*?)<\/p>/, quiz.body, quiz.start, 'section#quiz p.lede'),
      pill_hero: identidade.pills.find((p) => /quiz/.test(p.texto)),
      script: quizScript,
      marcacao_p14: ['automatizavel'],
      nota: 'Limiar da prosa (oito de dez) e do script (acertos>=8) coincidem; o script só tem 2 faixas.',
    },
    {
      id: 'm16-crit-checklist', tipo: 'criterio_checklist', secao: '§Final',
      titulo: checklistH2,
      sec_id: one(/<div class="sec-id">([\s\S]*?)<\/div>/, fin.body, fin.start, 'section#final .sec-id'),
      itens_ref: 'aparato.json#checklist_final (30 itens)',
      contagem_itens: ckItens.length,
      caixa: boxes(fin)[0],
      marcacao_p14: ['cronometrado (item 01: "em menos de um minuto")', 'autodeclarado'],
    },
    {
      id: 'm16-crit-exercicios', tipo: 'orientacao_exercicios', secao: '§Ex',
      lede: one(/<p class="lede">([\s\S]*?)<\/p>/, ex.body, ex.start, 'section#ex p.lede'),
      marcacao_p14: ['cronometrado ("em menos de um minuto")', 'autoavaliado_sem_registro'],
      nota: 'A fonte não fixa limiar de acertos para os 16 exercícios.',
    },
    {
      id: 'm16-crit-voz', tipo: 'teste_oral', secao: '§Voz',
      titulo: one(/<h2>([\s\S]*?)<\/h2>/, voz.body, voz.start, 'section#voz h2'),
      lede: one(/<p class="lede">([\s\S]*?)<\/p>/, voz.body, voz.start, 'section#voz p.lede'),
      marcacao_p14: ['oral', 'cronometrado (10 min)', 'autoavaliado (gravar e ouvir de volta)'],
    },
  ],
};

// ---------------- VOZ ----------------
const vozObj = {
  id: 'm16-voz',
  tipo: 'voz-e-principios',
  roteiro_oral: {
    sec_id: one(/<div class="sec-id">([\s\S]*?)<\/div>/, voz.body, voz.start, 'section#voz .sec-id'),
    titulo: criterio.criterios[4].titulo,
    lede: criterio.criterios[4].lede,
    blocos: all(/<div class="clk-r"><div class="clk-t">([\s\S]*?)<\/div><div class="clk-b"><b>([\s\S]*?)<\/b>([\s\S]*?)<\/div><\/div>/g, voz.body, voz.start)
      .map(({ m, idx }, i) => ({ id: `m16-voz-${pad(i + 1)}`, tempo: texto(m[1]), tema: texto(m[2]), ...hx(m[3]), origem: origem('section#voz div.clk .clk-r', texto(m[1]), idx) })),
  },
  principios: [
    { chave: 'regua_de_nomeacao', ref: 'tese.regua_de_nomeacao (§00.7, 3 estados)' },
    { chave: 'conflito_de_interesse', caixa: teseObj.caixas.find((c) => /Obrigatória neste módulo/.test(c.rotulo)) },
    { chave: 'o_que_o_modulo_nao_faz', ref: 'tese.o_que_o_modulo_nao_faz (§00.9, 6 linhas)' },
    { chave: 'numeros_vivos', caixa: teseObj.caixas.find((c) => /Números vivos/.test(c.rotulo)) },
    { chave: 'extensao_trava_2', caixa: teseObj.caixas.find((c) => /Trava 2/.test(c.rotulo)) },
    { chave: 'regra_do_verbo', caixa: boxes(fin)[0], nota: 'mesma frase aparece no §00.1 (parágrafo) e na caixa do §Final' },
    { chave: 'politica_de_fontes', lede_ref: (() => { const r = secao('ref'); return one(/<p class="lede">([\s\S]*?)<\/p>/, r.body, r.start, 'section#ref p.lede'); })() },
  ],
};

// ---------------- ERROS COMUNS ----------------
const er = secao('erros');
const erros = {
  id: 'm16-erros',
  tipo: 'erros-comuns',
  sec_id: one(/<div class="sec-id">([\s\S]*?)<\/div>/, er.body, er.start, 'section#erros .sec-id'),
  titulo: one(/<h2>([\s\S]*?)<\/h2>/, er.body, er.start, 'section#erros h2'),
  cabecalho: all(/<th>([\s\S]*?)<\/th>/g, er.body).map(({ m }) => texto(m[1])),
  itens: all(/<tr><td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td><\/tr>/g, er.body, er.start)
    .map(({ m, idx }, i) => ({ id: `m16-erro-${pad(i + 1)}`, erro: texto(m[1]), correcao: { ...hx(m[2]) }, pergunta_que_evita: null, origem: origem('section#erros table.tbl tr', texto(m[1]).slice(0, 60), idx) })),
  nota_pergunta: 'O h2 promete "a correção e a pergunta que o evita", mas a tabela só tem as colunas "Erro" e "Correção imediata". `pergunta_que_evita` fica null em todos (ver divergências).',
};

// ---------------- COMPARACAO COM CODIGO E CATALOGO ----------------
const cat = read(CATALOGO);
const catSec = cat.slice(cat.indexOf('## Módulo 16 — Tendências e Disrupções'), cat.indexOf('## Módulo 17'));
const catAulas = [...catSec.matchAll(/^\| (\d\d) \| ([^|]+?) \| (.+?) \|\r?$/gm)].map((m) => ({ n: m[1], lente: m[2], titulo: m[3] }));
const blocks = read(CODE.blocks);
const bloco16 = (/\{ id: 'bloco-16'[^\n]*/.exec(blocks) || [''])[0];
const trilhas = read(CODE.trilhas);
const comparacao = {
  contagem_de_aulas: {
    secoes_Aula_NN: aulas.length,
    pill_hero: identidade.pills[0].texto,
    codigo_MODULO_16_AULAS: codeAulas.length,
    codigo_totalInModule: [...new Set(codeAulas.map((a) => a.total))],
    trilhas_bloco_16: (/'bloco-16': (\d+)/.exec(trilhas) || [])[1],
    catalogo_tabela: catAulas.length,
    veredito: 'os seis sinais concordam em 10',
  },
  aulas: aulas.map((a) => {
    const c = codeAulas.find((x) => x.id === a.aula_id);
    const k = catAulas.find((x) => `aula-16-${x.n}` === a.aula_id);
    const src = a.subsecoes.map((h) => h.numero);
    const cod = (codeCorpoNums[a.aula_id] || []).filter((x) => x.numero).map((x) => x.numero);
    const lede = /<p class="lede">([\s\S]*?)<\/p>/.exec(secao(a.secao_id).body);
    return {
      aula_id: a.aula_id,
      fonte_h2: a.titulo.texto,
      fonte_lente: a.rotulo,
      codigo_title: c?.title ?? null,
      codigo_subtitle: c?.subtitle ?? null,
      catalogo_titulo: k?.titulo ?? null,
      catalogo_lente: k?.lente ?? null,
      title_igual_h2: c?.title === a.titulo.texto,
      subtitle_igual_lente: c?.subtitle === a.rotulo,
      catalogo_igual_h2: k?.titulo === a.titulo.texto,
      subsecoes_fonte: src,
      subsecoes_codigo: cod,
      subsecoes_iguais: JSON.stringify(src) === JSON.stringify(cod),
      lead_fonte_presente: !!lede,
      lead_codigo: codeLead[a.aula_id] === undefined ? 'ausente' : codeLead[a.aula_id] === '' ? 'string vazia' : 'presente',
      lead_igual: lede ? codeLead[a.aula_id] === inline(lede[1]) : null,
      instrumentos_fonte: a.instrumentos,
      instrumentos_codigo: [],
    };
  }),
  catalogo_canonico: {
    arquivo: CATALOGO,
    titulo: (/^## Módulo 16 — (.+?)\r?$/m.exec(catSec) || [])[1],
    trilha: (/\*\*Trilha\*\* · ([\s\S]+?)\r?\n\*\*/.exec(catSec) || [])[1]?.replace(/\r?\n/g, ' '),
    escala: (/\*\*Escala\*\* · ([\s\S]+?)\n\n/.exec(catSec) || [])[1]?.replace(/\n/g, ' '),
    afirmacao_sobre_hero: (/> \*\*Duas medições sobre este módulo\.\*\* ([\s\S]+?)\n\n/.exec(catSec) || [])[1]?.replace(/\n> /g, ' '),
  },
  alexandria_blocks: bloco16.trim(),
  codigo_nao_tem: ['tese/§00 (lentes, régua, candidatos, glosas, régua de nomeação, conflito, recusas)', '§MAP e INST·01', 'critério de domínio e resolução', '§Voz', '§Erros', 'instrumentos (MODULO_16_INSTRUMENTOS = [])', 'caso, fichas, quiz, checklist, referências, glossário (ver aparato.json)'],
  exercicios_no_codigo: {
    exportados: (conteudo.match(/id: "m16-ex-\d\d"/g) || []).length,
    lidos_por_RecursosDoModulo: /modulo-16/.test(read(CODE.recursos)),
    nota: 'MODULO_16_EXERCICIOS_SOLTOS existe (16 itens) mas RecursosDoModulo.tsx só registra modulo-01..09; nenhum componente importa o bucket do M16.',
  },
};

// ---------------- DIVERGENCIAS ----------------
const divergencias = [
  { id: 'div-m16-hero-contagens-catalogo', tema: 'Hero com travessão × catálogo', leitura_a: { onde: 'fonte L829-835 + script L5809-5817', texto: 'Cinco pills trazem "—" no markup e são preenchidas no carregamento por setTxt(...) com as contagens do DOM: 184 termos, 16 exercícios, 20 erros, 30 itens, 38 referências.' }, leitura_b: { onde: 'catálogo canônico, Módulo 16', texto: comparacao.catalogo_canonico.afirmacao_sobre_hero?.slice(0, 260) }, nota: 'O catálogo afirma que o hero "ficou incompleto"; o script do próprio HTML preenche os cinco campos na renderização. Divergência fonte × catálogo; não resolvida.', decisao: 'não escolhida (P8)' },
  { id: 'div-m16-criterios', tema: 'Cinco formulações de critério', leitura_a: { onde: '§00.6 L1125', texto: crit.paragrafos[0].texto }, leitura_b: { onde: '§Quiz L4056-4058 / §Final L4146 / §Ex L3881 / §Voz L4080', texto: `${criterio.criterios[1].titulo.texto} | ${checklistH2.texto} | ${texto(/<b>([\s\S]*?)<\/b>/.exec(criterio.criterios[3].lede.html)[1])} | ${criterio.criterios[4].titulo.texto}` }, nota: 'P18: nenhuma é escolhida; nenhuma vira aprovação.', decisao: 'não escolhida (P18)' },
  { id: 'div-m16-erros-pergunta', tema: '§Erros promete pergunta que não existe', leitura_a: { onde: 'section#erros h2 L3798', texto: erros.titulo.texto }, leitura_b: { onde: 'section#erros th L3802', texto: erros.cabecalho.join(' | ') }, nota: 'A tabela tem 2 colunas; a "pergunta que o evita" não está no markup.', decisao: 'registrar; não preencher' },
  { id: 'div-m16-caso-parte', tema: 'Caso numerado como "parte 16"', leitura_a: { onde: 'section#caso .sec-id L3686', texto: '§Caso · Operação A — parte 16' }, leitura_b: { onde: 'decisões P17 (M01)', texto: 'Não existe "Parte 1"; título "Caso — Operação A".' }, nota: 'No M16 a própria fonte usa "parte 16" e numera as subseções 16.1-16.3 e cita partes 9-15. P17 foi decidida para o M01; a aplicação ao M16 é da camada Alexandria.', decisao: 'registrar' },
  { id: 'div-m16-lead-a08', tema: 'Aula 08 sem lede', leitura_a: { onde: 'section#a08 L2814-2829', texto: 'Aula 08 abre com div.box.rd "Declaração de conflito de interesse"; não há p.lede.' }, leitura_b: { onde: 'alexandria-modulo-16-content.ts MODULO_16_LEAD', texto: "'aula-16-08': \"\"" }, nota: 'getLeadAula documenta "undefined quando a fonte não traz"; o código guarda string vazia.', decisao: 'registrar (fonte × código)' },
  { id: 'div-m16-horas-codigo', tema: 'Horas sem origem', leitura_a: { onde: 'fonte', texto: 'nenhuma carga horária declarada' }, leitura_b: { onde: 'alexandria-blocks.ts bloco-16', texto: bloco16.trim() }, nota: 'estimatedHoursMin 2 / estimatedHoursMax 3 não têm origem no HTML; o catálogo canônico também não traz horas para o M16.', decisao: 'registrar (fonte × código)' },
  { id: 'div-m16-instrumentos-codigo', tema: '11 instrumentos não portados', leitura_a: { onde: 'fonte', texto: '11 div.inst (INST·01..11) com script completo' }, leitura_b: { onde: 'alexandria-modulo-16-content.ts', texto: 'export const MODULO_16_INSTRUMENTOS: Instrument[] = []; e instruments: [] nas 10 aulas' }, nota: 'O catálogo canônico registra o mesmo fato.', decisao: 'registrar (fonte × código)' },
  { id: 'div-m16-exercicios-inalcancaveis', tema: 'Exercícios extraídos e não renderizados', leitura_a: { onde: 'alexandria-modulo-16-content.ts', texto: '16 LessonActivity em MODULO_16_EXERCICIOS_SOLTOS' }, leitura_b: { onde: 'RecursosDoModulo.tsx', texto: 'RECURSOS só tem modulo-01..modulo-09' }, nota: 'Os 16 exercícios não chegam à tela.', decisao: 'registrar (código × código)' },
  { id: 'div-m16-marca-gridalpha', tema: 'Marca GridAlpha visível ao learner', leitura_a: { onde: 'fonte: kicker L819, rodapé L4884, §00.8 L1211, caixas "Onde isso entra no produto" (a01, a03, …), §Ref item 38', texto: identidade.kicker.texto }, leitura_b: { onde: 'decisões P24', texto: 'GridAlpha está morta como marca voltada ao learner; Alexandria / NIVAR.' }, nota: 'Texto mantido literal na camada fonte. O código já copia "GridAlpha Energy Brief" / "GridAlpha Brasil Terminal" nas notas das aulas.', decisao: 'registrar (P24/P7 na camada de produto)' },
  { id: 'div-m16-trava-war-room', tema: '"Trava 2 do War Room" e "Travas" visíveis ao learner', leitura_a: { onde: '§00 L1273-1274; a07 L2562; §Caso L3772; §Ref item 38', texto: 'Extensão declarada da Trava 2 · fontes oficiais' }, leitura_b: { onde: 'M01 div-m01-trava-war-room / P23', texto: 'vocabulário interno visível; numeração de trava sem definição na fonte' }, nota: 'A fonte do M16 não define as Travas; cita "War Room (Quatro Travas de Segurança)" como documento interno não publicado (§Ref). A caixa da extensão fica sob o h3 §00.9 ("O que este módulo não faz"), e a Aula 07 a cita como "a extensão declarada no §00.9" — consistente.', decisao: 'registrar' },
  { id: 'div-m16-map-maiusculas', tema: '§MAP do M16 não é o § MAP do M01', leitura_a: { onde: 'M16 section#map', texto: 'Mapa das seis tendências (instrumento INST·01, sem tabela de aulas)' }, leitura_b: { onde: 'M01 § MAP', texto: 'tabela aula × tema × pergunta' }, nota: 'Mesmo marcador, estrutura diferente (protocolo §3/§6).', decisao: 'registrar' },
  { id: 'div-m16-lente-contagem-codigo', tema: 'Comentário do código diz "três lentes" e conta Síntese à parte', leitura_a: { onde: 'fonte sec-id das aulas', texto: aulas.map((a) => a.rotulo).join(' | ') }, leitura_b: { onde: 'alexandria-modulo-16-content.ts comentário', texto: 'Lente de Estágio (a01, a07), Lente de Gargalo (a02, a05, a06, a09), Lente de Carga (a03, a04, a08), Síntese (a10)' }, nota: 'Concordam. Registrado só como verificação (sem divergência).', decisao: 'sem divergência' },
  { id: 'div-m16-trilhas-comentario', tema: 'Comentário de alexandria-trilhas.ts', leitura_a: { onde: 'fonte', texto: `${SECS.length} sections com sec-id; 10 Aula NN` }, leitura_b: { onde: 'alexandria-trilhas.ts (comentário do bloco-16)', texto: (/QUARTO módulo da Trilha 3[\s\S]*?LYCEUM Wave 48\./.exec(trilhas) || [''])[0].replace(/\s*\/\/\s*/g, ' ') }, nota: 'Concorda (21 seções, 10 aulas).', decisao: 'sem divergência' },
];

const doc = {
  grupo: 'modulo',
  modulo: 'M16',
  camada: 'fonte',
  fonte: { arquivo: 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo16.html', linhas: LINES.length, acesso: 'somente leitura' },
  gerado_por: 'docs/alexandria-v2/extraction/m16/extratores/m16_modulo.mjs',
  convencoes: {
    html: 'HTML inline preservado, entidades decodificadas, espaços colapsados',
    texto: 'mesmo conteúdo sem tags',
    anotacao: 'campos `nota*`, `tipo`, `marcacao_p14`, `veredito`, `decisao` e `tema` são anotação desta extração',
    marcacao_p14: 'inferida do texto de cada critério; precisa de revisão humana',
  },
  contagens: {
    secoes: roteiro.length, aulas: aulas.length, aparatos: roteiro.length - aulas.length,
    subsecoes_por_aula: Object.fromEntries(aulas.map((a) => [a.aula_id, a.subsecoes.length])),
    pills: identidade.pills.length, pills_preenchidas_por_script: identidade.pills.filter((p) => p.preenchido_pelo_script).length,
    lentes: teseObj.lentes.length, posicoes_regua: teseObj.regua_de_estagio.length, candidatos: teseObj.candidatos_a_gargalo.length,
    glosas: teseObj.glosas_de_desambiguacao.length, sentidos_glosas: teseObj.glosas_de_desambiguacao.reduce((a, g) => a + g.sentidos.length, 0),
    estados_regua_nomeacao: teseObj.regua_de_nomeacao.length, recusas_s00_9: teseObj.o_que_o_modulo_nao_faz.length,
    criterios: criterio.criterios.length, blocos_voz: vozObj.roteiro_oral.blocos.length, erros_comuns: erros.itens.length,
    divergencias: divergencias.length,
  },
  divergencias,
  identidade,
  tese: teseObj,
  resultado_esperado: null,
  nota_resultado_esperado: 'O M16 não tem bloco "Resultado esperado" nem lista de capacidades (busca por "Resultado esperado", "Ao final", "capacidade de": zero no sentido de objetivo de aprendizagem). O que declara o que o learner deve conseguir é o critério de domínio do currículo (§00.6, em criterio) e o checklist de 30 itens (§Final, em aparato.json). Nada foi derivado.',
  mapa,
  roteiro,
  criterio,
  laboratorios: null,
  nota_laboratorios: 'Não há seção § Lab nem instrumento LAB·NN no M16. O instrumento fora de aula é o INST·01 (§MAP), em instrumentos.json.',
  voz: vozObj,
  erros_comuns: erros,
  tradutor: null,
  nota_tradutor: 'Não há seção "Tradutor"/§ Map (minúsculo) no M16. Os "três níveis" (div.lv: Criança / Executivo / Especialista) vivem dentro das aulas e ficam no corpo de aula (fora deste grupo).',
  comparacao_codigo: comparacao,
};
writeJson('modulo.json', doc);
console.log(JSON.stringify(doc.contagens, null, 1));
console.log(comparacao.aulas.map((a) => `${a.aula_id} t=${a.title_igual_h2} s=${a.subtitle_igual_lente} c=${a.catalogo_igual_h2} sub=${a.subsecoes_iguais} lead=${a.lead_codigo}/${a.lead_igual}`).join('\n'));
