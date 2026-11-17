// Extrator do grupo "modulo" do M08. Todo texto de conteúdo sai da fonte
// (só leitura) por walker de tags + regex; nada é digitado. Anotações desta
// extração ficam em campos `nota*`, `marcacao_p14`, `tema` de divergência.
import fs from 'node:fs';
import {
  html, lineOf, texto, inner, ini, origem, pad, secao, all, one, txt, SECOES,
  filhosDoWrap, bloco, runSource, importTs, writeJson, CATALOGO, REPO,
} from './m08_lib.mjs';

const blocosDe = (sid) => filhosDoWrap(sid).map((el, i) => bloco(el, sid, i + 1));
const S = runSource();

// ── identidade ───────────────────────────────────────────────
const hero = one(/<header class="hero">([\s\S]*?)<\/header>/, html, 0, 'hero');
const hb = hero.m[1]; const hbase = hero.idx + hero.m[0].indexOf(hb);
const kicker = one(/<div class="kicker">([\s\S]*?)<\/div>/, hb, hbase);
const h1 = one(/<h1>([\s\S]*?)<\/h1>/, hb, hbase);
const sub = one(/<p class="sub">([\s\S]*?)<\/p>/, hb, hbase);
const pills = all(/<span class="pill"><b>([\s\S]*?)<\/b>\s*([\s\S]*?)<\/span>/g, hb, hbase).map(({ m, idx }, i) => ({
  id: `m08-hero-pill-${pad(i + 1)}`, valor: texto(m[1]), rotulo: texto(m[2]), origem: origem('header.hero .pill-row .pill', `${texto(m[1])} ${texto(m[2])}`, idx),
}));
const title = one(/<title>([\s\S]*?)<\/title>/, html, 0);
const foot = one(/<footer>\s*<div class="wrap">\s*<p>([\s\S]*?)<\/p>/, html, 0);
const horasPill = pills.find((p) => /de estudo/.test(p.rotulo));
const eixosTab = filhosDoWrap('tese').find((e) => e.tag === 'table' && /<th>Eixo<\/th>/.test(e.inner));
const eixosBloco = bloco(eixosTab, 'tese', 0);

const identidade = {
  id: 'm08-identidade',
  tipo: 'identidade',
  titulo_tag: { texto: texto(title.m[1]), origem: origem('head > title', texto(title.m[1]), title.idx) },
  eyebrow: { ...txt(kicker.m[1]), origem: origem('header.hero .kicker', texto(kicker.m[1]), kicker.idx) },
  titulo: { ...txt(h1.m[1]), origem: origem('header.hero h1', texto(h1.m[1]), h1.idx) },
  subtitulo: { ...txt(sub.m[1]), origem: origem('header.hero p.sub', ini(sub.m[1]), sub.idx) },
  trilha_declarada: { texto: texto(kicker.m[1]).split(' · ').pop(), nota: 'Recorte mecânico do eyebrow (último segmento após " · ").', origem: origem('header.hero .kicker', texto(kicker.m[1]), kicker.idx) },
  contagens_declaradas: pills,
  horas: {
    texto: horasPill ? `${horasPill.valor} ${horasPill.rotulo}` : null,
    min: null, max: null,
    nota: 'A fonte declara só a pílula "4-5 h de estudo". Os números não foram convertidos. O catálogo do repositório (alexandria-blocks.ts, bloco-08) tem estimatedHoursMin/Max = null.',
    origem: horasPill?.origem ?? null,
  },
  eixos: eixosBloco.linhas.map((l, i) => ({
    id: `m08-eixo-${pad(i + 1)}`, eixo: l[0].texto, pontas: l[1], o_que_muda: l[2],
  })),
  eixos_origem: { ...eixosBloco.origem, nota: 'A fonte declara literalmente três eixos na tabela de T.3 (§00): Grandeza, Escopo, Recorte. Não é inferência.' },
  rodape: { ...txt(foot.m[1]), origem: origem('footer p', ini(foot.m[1]), foot.idx) },
  marca_na_fonte: {
    ocorrencias_gridalpha: [...html.matchAll(/GridAlpha/g)].map((m) => ({ linha: lineOf(m.index), trecho: ini(html.slice(Math.max(0, m.index - 60), m.index + 40), 100) })),
    nota: 'P24: "GridAlpha" é marca morta para o learner; texto mantido literal aqui (camada fonte).',
  },
};

// ── § 00 tese (todos os blocos) ─────────────────────────────
const tese = { id: 'm08-tese', tipo: 'tese', blocos: blocosDe('tese') };

// ── critério de domínio / capacidades ───────────────────────
const teseEls = filhosDoWrap('tese');
const critBox = teseEls.find((e) => e.tag === 'div' && /Critério de domínio deste módulo/.test(e.inner));
const regraBox = teseEls.find((e) => e.tag === 'div' && /A regra que organiza este módulo/.test(e.inner));
const t2p = teseEls.find((e) => e.tag === 'p' && /O critério de domínio deste bloco manda/.test(e.inner));
const resultado = {
  id: 'm08-resultado-esperado',
  secao_resultado_esperado: null,
  nota: 'A fonte do M08 não tem h4 "Resultado esperado" nem lista de capacidades (zero ocorrências de "Resultado esperado"/"Ao final"). O que existe: (1) o destaque "Critério de domínio deste módulo" no §00, (2) a lista "O que sobra quando os números vencerem" (Aula 07, 7.5) e (3) o checklist do §Final. Nenhum dos três é rotulado como capacidade; ficam abaixo sem conversão.',
  criterio_de_dominio_do_modulo: bloco(critBox, 'tese', 0),
  sintese_duravel_aula07: (() => {
    const el = filhosDoWrap('a07').find((e) => e.tag === 'ul');
    const intro = filhosDoWrap('a07').filter((e) => e.start < el.start && e.tag === 'p').pop();
    return {
      titulo_subsecao: '7.5 · O que sobra quando os números vencerem',
      intro: { ...txt(intro.inner), origem: origem('section#a07 p', ini(intro.inner), intro.start) },
      itens: all(/<li>([\s\S]*?)<\/li>/g, el.inner, el.openEnd).map(({ m, idx }, i) => ({ id: `m08-sobra-${pad(i + 1)}`, ...txt(m[1]), origem: origem('section#a07 ul.ck > li', ini(m[1], 60), idx) })),
      nota: 'Lista literal dentro da Aula 07 (não é seção de módulo). Usa a mesma classe ul.ck do §Final.',
    };
  })(),
};

// ── § MAP ───────────────────────────────────────────────────
const mapEls = filhosDoWrap('map');
const grid = mapEls.find((e) => e.classe === 'map-grid');
const mapa = {
  id: 'm08-mapa',
  tipo: 'mapa_do_modulo',
  blocos: mapEls.filter((e) => e.classe !== 'map-grid').map((el, i) => bloco(el, 'map', i + 1)),
  cartoes: all(/<a class="map-card" href="#([^"]+)"><div class="n">([\s\S]*?)<\/div><div class="t">([\s\S]*?)<\/div><div class="d">([\s\S]*?)<\/div><\/a>/g, grid.inner, grid.openEnd)
    .map(({ m, idx }) => ({
      id: `m08-map-${m[1]}`, alvo: m[1], rotulo: texto(m[2]), tema: texto(m[3]), descricao: txt(m[4]),
      vinculos: { aula_id_codigo: /^a0\d$/.test(m[1]) ? `aula-08-${m[1].slice(1)}` : null },
      origem: origem('section#map .map-grid a.map-card', texto(m[2]), idx),
    })),
  perguntas: null,
  perguntas_nota: 'O §MAP do M08 não tem tabela aula × pergunta (diferente do M01). Os cartões trazem número, tema e descrição; nenhuma pergunta por aula. Se a camada Alexandria precisar de pergunta de aula, ela é derivada (P3/P11).',
};

// ── roteiro (17 seções) ─────────────────────────────────────
const C08 = await importTs('src/lib/data/alexandria-modulo-08-content.ts');
const aulasCod = Object.fromEntries(C08.MODULO_08_AULAS.map((a) => [a.id, a]));
const roteiro = SECOES.map((sid, i) => {
  const els = filhosDoWrap(sid);
  const mk = bloco(els.find((e) => e.classe === 'sec-id'), sid, 0);
  const h2 = els.find((e) => e.tag === 'h2');
  const lede = els.find((e) => e.tag === 'p' && e.classe === 'lede');
  const isAula = /^Aula \d\d$/.test(mk.marcador);
  const cid = isAula ? `aula-08-${mk.marcador.slice(5)}` : null;
  const c = cid ? aulasCod[cid] : null;
  const leadCod = cid ? C08.MODULO_08_LEAD[cid] : null;
  return {
    id: isAula ? `m08-roteiro-aula-${mk.marcador.slice(5)}` : `m08-roteiro-${sid}`,
    tipo: isAula ? 'aula' : 'aparato',
    ordem_na_fonte: i + 1,
    section_id: sid,
    marcador: mk.marcador,
    rotulo: mk.rotulo,
    titulo: txt(h2.inner),
    lead: lede ? txt(lede.inner) : null,
    subsecoes: els.filter((e) => e.tag === 'h3').map((e) => { const b = bloco(e, sid, 0); return `${b.numero} ${b.texto}`; }),
    instrumentos: els.filter((e) => e.classe === 'inst').map((e) => bloco(e, sid, 0).ref),
    vinculos: { aula_id_codigo: cid },
    comparacao_codigo: c ? {
      title_igual_h2: c.title === texto(h2.inner),
      subtitle_igual_rotulo: c.subtitle === mk.rotulo,
      lead_igual_fonte: leadCod === texto(lede.inner),
      lead_igual_salvo_espacos: leadCod != null && leadCod.replace(/\s+([.,;:])/g, '$1') === texto(lede.inner),
      lead_codigo: leadCod === texto(lede.inner) ? null : leadCod,
      totalInModule: c.totalInModule,
      instrumentos_codigo: c.instruments.map((x) => x.id),
      durationMinutes: c.durationMinutes, difficulty: c.difficulty, video: c.video,
    } : null,
    origem: mk.origem,
  };
});
const aulas = roteiro.filter((r) => r.tipo === 'aula');

// ── critérios literais (P14) ────────────────────────────────
const quizLede = filhosDoWrap('quiz').find((e) => e.classe === 'lede');
const vozLede = filhosDoWrap('voz').find((e) => e.classe === 'lede');
const finEls = filhosDoWrap('final');
const finH2 = finEls.find((e) => e.tag === 'h2');
const finLede = finEls.find((e) => e.classe === 'lede');
const finUl = finEls.find((e) => e.tag === 'ul');
const exLede = filhosDoWrap('ex').find((e) => e.classe === 'lede');
const qMsg = one(/\$id\('q-msg'\)\.textContent = n >= 8\s*\?\s*'([^']*)'\s*:\s*'([^']*)';/, html, 0, 'q-msg');
const qCls = one(/sc\.className = 'score show ' \+ \(n >= 8 \? 'pass' : 'fail'\);/, html, 0, 'q-cls');
const i4ok = one(/msg = '<b>Reconstrução correta\.<\/b>([^;]*);/, html, 0);
const i4ordem = one(/msg = '<b>Ordem correta, com '([^;]*);/, html, 0);

function p14(t) {
  const m = [];
  if (/segundos|minutos|Grave|três minutos|dez minutos/i.test(t)) m.push('cronometrado');
  if (/^(Enuncia|Distingue|Diferencia|Cita|Explica|Descreve|Nomeia|Define|Justifica|Enumera|Trata|Aplica|Responda|Explicar)/.test(t) || /voz alta|sem travar|oral/i.test(t)) m.push('producao_oral_ou_livre');
  if (/^Reconstrói|desenha de memória|reconstruir/i.test(t)) m.push('reconstrucao_de_memoria');
  if (/sem consultar/i.test(t)) m.push('sem_consulta');
  return m;
}
const criterio = [
  {
    id: 'm08-crit-00-dominio', local: '§00 · destaque "Critério de domínio deste módulo"',
    ...bloco(critBox, 'tese', 0), marcacao_p14: ['reconstrucao_de_memoria', 'producao_oral_ou_livre', 'sem_consulta'],
    nota: 'Três cláusulas ("desenha de memória as duas pizzas…"; "qualifica pelos três eixos…"; "explica a complementaridade… sem consultar gráfico nenhum"). Mantidas num só texto.',
  },
  { id: 'm08-crit-00-t2', local: '§00 · T.2', ...bloco(t2p, 'tese', 0), marcacao_p14: ['reconstrucao_de_memoria'] },
  { id: 'm08-crit-00-regra', local: '§00 · destaque "A regra que organiza este módulo"', ...bloco(regraBox, 'tese', 0), marcacao_p14: [] },
  {
    id: 'm08-crit-quiz', local: '§Quiz · lead + script',
    lead: { ...txt(quizLede.inner), origem: origem('section#quiz p.lede', ini(quizLede.inner), quizLede.start) },
    limiar_script: { codigo: 'n >= 8', origem: origem('script quiz q-go', qCls.m[0], qCls.idx) },
    mensagens: [
      { condicao: 'n >= 8', ramo: 'verdadeiro', classe: 'pass', texto: qMsg.m[1], origem: origem('script $id(q-msg)', qMsg.m[1].slice(0, 60), qMsg.idx) },
      { condicao: 'n >= 8', ramo: 'falso', classe: 'fail', texto: qMsg.m[2], origem: origem('script $id(q-msg)', qMsg.m[2].slice(0, 60), qMsg.idx + qMsg.m[0].indexOf(qMsg.m[2])) },
    ],
    marcacao_p14: ['sem_consulta'],
    nota: 'Aqui o limiar do script (n >= 8) concorda com o lead (8 de 10), diferente do M01. Pelo P18, ele não é critério de competência.',
  },
  {
    id: 'm08-crit-final', local: '§Final',
    titulo: txt(finH2.inner), lead: { ...txt(finLede.inner), origem: origem('section#final p.lede', ini(finLede.inner), finLede.start) },
    itens: all(/<li>([\s\S]*?)<\/li>/g, finUl.inner, finUl.openEnd).map(({ m, idx }, i) => ({
      id: `m08-check-${pad(i + 1)}`, ordem: i + 1, ...txt(m[1]), marcacao_p14: p14(texto(m[1])),
      origem: origem('section#final ul.ck > li', ini(m[1], 60), idx),
    })),
    marcacao_p14: ['producao_oral_ou_livre', 'sem_consulta'],
    nota: 'O lead declara "O primeiro item é o critério oficial e vale por sozinho." e "Responda sem travar e sem consultar".',
  },
  {
    id: 'm08-crit-inst04', local: 'INST 04 · veredito do script',
    textos: [
      { codigo: `msg = '<b>Reconstrução correta.</b>${i4ok.m[1]};`.slice(0, 400), origem: origem('script i4check()', 'Reconstrução correta.', i4ok.idx) },
      { codigo: `msg = '<b>Ordem correta, com '${i4ordem.m[1]};`.slice(0, 400), origem: origem('script i4check()', 'Ordem correta, com', i4ordem.idx) },
    ],
    marcacao_p14: ['reconstrucao_de_memoria'],
    nota: 'O ramo "Reconstrução correta" chama o resultado de "o critério oficial de domínio deste bloco cumprido"; o ramo "Ordem correta, com N fatias fora" chama de "aprovação no critério que importa" — contradiz o item 1 do §Final, que exige também a tolerância de três pontos.',
  },
  { id: 'm08-crit-voz', local: '§Voz · lead', lead: { ...txt(vozLede.inner), origem: origem('section#voz p.lede', ini(vozLede.inner), vozLede.start) }, marcacao_p14: ['producao_oral_ou_livre', 'cronometrado'] },
  { id: 'm08-crit-ex', local: '§Ex · lead', lead: { ...txt(exLede.inner), origem: origem('section#ex p.lede', ini(exLede.inner), exLede.start) }, marcacao_p14: ['producao_oral_ou_livre'] },
];

// ── laboratório, voz/princípios, erros, tradutor ────────────
const laboratorios = {
  secao_lab: null,
  nota: 'Não há "§ Lab" no M08 (zero ocorrências de "§Lab"/"§ Lab"/"LAB"). O instrumento fora de aula é o INST 01, no §MAP (ver instrumentos.json, m08-inst-01).',
  instrumento_de_modulo: 'm08-inst-01',
};
const boxes = SECOES.flatMap((sid) => filhosDoWrap(sid).filter((e) => e.tag === 'div' && /^box/.test(e.classe || '')).map((e) => ({ sid, b: bloco(e, sid, 0) })));
const principios = {
  regra_do_modulo: bloco(regraBox, 'tese', 0),
  destaques_numeros_vivos: boxes.filter((x) => x.b.classe === 'box rd').map((x) => ({ secao: x.sid, rotulo: x.b.rotulo, paragrafos: x.b.paragrafos, origem: x.b.origem })),
  destaques_de_metodo: boxes.filter((x) => x.b.classe === 'box cy').map((x) => ({ secao: x.sid, rotulo: x.b.rotulo, paragrafos: x.b.paragrafos, origem: x.b.origem })),
  rodape_escopo: identidade.rodape,
  voz_pointer: 'O §Voz (40 perguntas, 7 ataques, roteiro oral) está em aparato.json › voz_oral.',
};
const blocosProduto = boxes.filter((x) => x.b.bloco_de_produto_P7).map((x) => ({ secao: x.sid, paragrafos: x.b.paragrafos, origem: x.b.origem }));
const erEls = filhosDoWrap('erros');
const erTab = bloco(erEls.find((e) => e.tag === 'table'), 'erros', 0);
const erTabEl = erEls.find((e) => e.tag === 'table');
const erRows = all(/<tr><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td><\/tr>/g, erTabEl.inner, erTabEl.openEnd);
const erros_comuns = {
  id: 'm08-erros',
  marcador: bloco(erEls[0], 'erros', 0),
  titulo: txt(erEls[1].inner),
  lead: txt(erEls[2].inner),
  cabecalho: erTab.cabecalho,
  itens: erRows.map(({ m, idx }, i) => ({ id: `m08-erro-${pad(i + 1)}`, erro: txt(m[1]), correcao: txt(m[2]), origem: origem('section#erros table.tbl tr', ini(m[1], 60), idx) })),
};

// ── comparação com código e catálogos ───────────────────────
const blocksTs = fs.readFileSync(`${REPO}/src/lib/data/alexandria-blocks.ts`, 'utf8');
const trilhasTs = fs.readFileSync(`${REPO}/src/lib/data/alexandria-trilhas.ts`, 'utf8');
const cat = fs.readFileSync(CATALOGO, 'utf8');
const catLinhas = cat.split('\n');
const catIni = catLinhas.findIndex((l) => /^## Módulo 08/.test(l));
const catIdx = (re, desde = 0) => { const i = catLinhas.findIndex((l, k) => k >= desde && re.test(l)); return i < 0 ? null : { linha: i + 1, texto: catLinhas[i] }; };
const comparacao = {
  aulas: { fonte: aulas.length, codigo_MODULO_08_AULAS: C08.MODULO_08_AULAS.length, totalInModule: [...new Set(C08.MODULO_08_AULAS.map((a) => a.totalInModule))], AULAS_POR_BLOCO: Number(/'bloco-08':\s*(\d+)/.exec(trilhasTs)[1]), pill_hero: Number(pills.find((p) => p.rotulo === 'aulas').valor), cartoes_map: mapa.cartoes.filter((c) => /^a0/.test(c.alvo)).length },
  titulos_aulas: aulas.map((a) => ({ aula: a.marcador, title_igual: a.comparacao_codigo.title_igual_h2, subtitle_igual: a.comparacao_codigo.subtitle_igual_rotulo, lead_igual: a.comparacao_codigo.lead_igual_fonte })),
  bloco_catalogo_repo: { linha: blocksTs.split('\n').find((l) => /'bloco-08'/.test(l)).trim() },
  catalogo_canonico: {
    arquivo: CATALOGO,
    cabecalho: catIdx(/^## Módulo 08/),
    nome_no_repo: catIdx(/catálogo do repositório: "Matriz Elétrica"/),
    escala: (() => { const a = catIdx(/^\*\*Escala\*\*/, catIni); return { linha: a.linha, texto: catLinhas.slice(a.linha - 1, a.linha + 3).join(' ') }; })(),
    criterio_citado: (() => { const i = catLinhas.findIndex((l) => /Você domina o Bloco 8 quando desenha/.test(l)); const j = catLinhas.findIndex((l, k) => k > i && /"s*$/.test(l)); return { linhas: [i + 1, j + 1], texto: catLinhas.slice(i, j + 1).join(' ') }; })(), // verificador 2026-09-17: antes slice(i, i + 4) cortava a L813, onde o critério citado termina
    frase_entre_aspas: (() => { const a = catIdx(/o critério manda desenhar de memória a pizza/); return { linha: a.linha, linhas: [a.linha, a.linha + 1], texto: catLinhas.slice(a.linha - 1, a.linha + 1).join(' ') }; })(), // verificador 2026-09-17: a citação continua na L817 ("pizza" — ...)
    tabela_resumo: catIdx(/^\| 08 \| Matriz Elétrica Brasileira \|/),
    estado_extracao: catIdx(/^\| 08 \| 11 \| 11 \| completo \|/),
  },
  nao_existe_no_codigo: ['tese (§00) — só a tabela de 4 universos em alexandria-modulo-08-fatos.ts (M08_UNIVERSOS_CAPACIDADE)', 'critério de domínio e critérios literais', 'cartões do §MAP', 'eixos (tabela T.3) como dado de módulo', '§Erros (18)', 'síntese 7.5 como dado de módulo (está só dentro do corpo da aula 07, se portada)', 'badge de M08 (alexandria-badges.ts não tem item do M08)'],
};

// cobertura por token do corpo portado (protocolo §5): fonte da aula, sem o
// markup de instrumento, contra MODULO_08_CORPO + lead do código
{
  const NT = (x) => texto(String(x).replace(/<[^>]+>/g, ' ')).toLowerCase().normalize('NFC').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  comparacao.cobertura_corpo_por_token = aulas.map((a) => {
    const cid = a.vinculos?.aula_id_codigo ?? `aula-08-${a.section_id.slice(1)}`;
    const els = filhosDoWrap(a.section_id).filter((e) => e.classe !== 'inst' && e.classe !== 'sec-id' && e.tag !== 'h2' && e.classe !== 'lede');
    const bag = new Map();
    for (const t of NT(JSON.stringify(C08.MODULO_08_CORPO[cid] ?? []).replace(/\\"/g, '"'))) bag.set(t, (bag.get(t) || 0) + 1);
    const perdidos = [];
    const codTxt = ini(JSON.stringify(C08.MODULO_08_CORPO[cid] ?? []).replace(/\\"/g, '"').replace(/\n/g, ' '), 1e9);
    let tot = 0, hit = 0;
    for (const el of els) {
      const ts = NT(el.inner); let h = 0;
      for (const t of ts) { const n = bag.get(t) || 0; if (n) { h++; bag.set(t, n - 1); } }
      tot += ts.length; hit += h;
      const inicio = ini(el.inner, 40);
      const inicioPresente = !['p', 'div', 'ol', 'ul'].includes(el.tag) || /^box/.test(el.classe || '') || el.classe === 'lv' || el.classe === 'src-card' || codTxt.includes(inicio);
      if ((ts.length && h / ts.length < 0.6) || !inicioPresente) perdidos.push({ elemento: `${el.tag}${el.classe ? '.' + el.classe : ''}`, tokens: ts.length, cobertos: h, inicio_presente_no_codigo: inicioPresente, trecho: ini(el.inner, 80), linha_aprox: lineOf(el.start) });
    }
    return { aula: a.marcador, aula_id_codigo: cid, blocos_no_codigo: (C08.MODULO_08_CORPO[cid] ?? []).length, tokens_fonte: tot, cobertura: +(100 * hit / Math.max(1, tot)).toFixed(1), elementos_perdidos: perdidos };
  });
  comparacao.cobertura_corpo_nota = 'Tokens do corpo da aula na fonte (filhos do .wrap, sem sec-id, h2, lede e div.inst) consumidos uma vez contra os tokens de MODULO_08_CORPO[aula]. Mede presença de palavra, não ordem; por isso um bloco inteiro ausente pode ficar mascarado por palavras iguais em outros blocos. Segundo sinal: os primeiros 40 caracteres de cada p/div/ol/ul (exceto box, lv e src-card, que o código reetiqueta; src-card virou titulo + tabela, protocolo §15) precisam existir no texto do código.';
  // fatos canônicos do código (alexandria-modulo-08-fatos.ts): o texto de cada fato existe na fonte?
  const F = await importTs('src/lib/data/alexandria-modulo-08-fatos.ts');
  const FT = texto(html);
  comparacao.fatos_codigo = {
    arquivo: 'src/lib/data/alexandria-modulo-08-fatos.ts',
    M08_FATOS: Object.entries(F.M08_FATOS).map(([k, v]) => ({ chave: k, texto: v.texto, na_fonte: FT.includes(v.texto), ocorrencias: FT.split(v.texto).length - 1 })),
    M08_UNIVERSOS_CAPACIDADE: F.M08_UNIVERSOS_CAPACIDADE.map((u) => ({ rotulo: u.rotulo, rotulo_na_fonte: FT.includes(u.rotulo), dataBase_na_fonte: FT.includes(u.dataBase), universo_na_fonte: FT.includes(u.universo), publicacao_na_fonte: FT.includes(u.publicacao) })),
    M08_CAPACIDADE_POR_FONTE: F.M08_CAPACIDADE_POR_FONTE.map((s) => ({ ...s })),
    nota: 'M08_CAPACIDADE_POR_FONTE é o vetor I2.src do INST 02 (ver instrumentos.json m08-inst-02); a conferência numérica está na prova diferencial.',
  };
}

// divergências
const catCrit =comparacao.catalogo_canonico.criterio_citado.texto;
const divergencias = [
  { id: 'mod-div-01', tipo: 'fonte×catálogo(repo)', tema: 'Título', leitura_a: { fonte: identidade.titulo.texto, onde: 'h1 L427 e <title> L6' }, leitura_b: { repo: /title: '([^']+)'/.exec(comparacao.bloco_catalogo_repo.linha)[1], onde: 'alexandria-blocks.ts bloco-08 (priority: confirmar)' }, nota: 'O catálogo canônico (docs/catalogo-modulos-alexandria.md) usa o título da fonte e registra o do repo entre parênteses. P24: o catálogo canônico governa o nome.' },
  { id: 'mod-div-02', tipo: 'fonte×catálogo(canônico)', tema: 'Título abreviado na tabela-resumo do catálogo', leitura_a: { fonte: identidade.titulo.texto }, leitura_b: comparacao.catalogo_canonico.tabela_resumo },
  { id: 'mod-div-03', tipo: 'fonte×catálogo(repo)', tema: 'Horas', leitura_a: { fonte: identidade.horas.texto }, leitura_b: { repo: 'estimatedHoursMin: null, estimatedHoursMax: null' }, nota: 'O catálogo canônico registra "4–5 h declaradas".' },
  { id: 'mod-div-04', tipo: 'fonte×catálogo(canônico)', tema: 'Critério de domínio citado entre aspas está truncado no catálogo', leitura_a: { fonte: texto(critBox.inner).replace(/^Critério de domínio deste módulo\s*/, '') }, leitura_b: { catalogo: catCrit, linhas: comparacao.catalogo_canonico.criterio_citado.linhas }, nota: 'O catálogo termina em "explica a complementaridade hidro-eólica." e omite "-solar nas três escalas em que ela opera — mês a mês, dia a dia e hora a hora — sem consultar gráfico nenhum".' },
  { id: 'mod-div-05', tipo: 'fonte×catálogo(canônico)', tema: 'Frase entre aspas atribuída ao módulo não existe na fonte', leitura_a: { fonte: 'zero ocorrências de "não existe a pizza" no HTML; o texto real de T.2 está em criterio[m08-crit-00-t2]' }, leitura_b: comparacao.catalogo_canonico.frase_entre_aspas },
  { id: 'mod-div-06', tipo: 'fonte×fonte', tema: 'Nome da unidade: "Módulo 08" × "Bloco 8"', leitura_a: { texto: 'Alexandria · Módulo 08 (eyebrow, <title>, rodapé)' }, leitura_b: { texto: '"Bloco 8" em §00 (critério), §Final h2 ("Você domina o Bloco 8 quando") e §Lex h2 ("124 termos do Bloco 8"); "Bloco 9"/"Bloco 10" como referência a outros módulos' } },
  { id: 'mod-div-07', tipo: 'fonte×fonte (P18)', tema: 'Critério de domínio em várias formas', leituras: ['§00 destaque: três cláusulas (duas pizzas de memória com ordem e troca explicada; três eixos; complementaridade nas três escalas sem gráfico)', '§Quiz: "acertar pelo menos 8 de 10 sem consultar" (script n >= 8 → "Critério de domínio atingido")', '§Final: 26 verificações; "O primeiro item é o critério oficial e vale por sozinho" (item 1 exige tolerância de três pontos por fonte)', 'INST 04: "Reconstrução correta" = "critério oficial … cumprido para a pizza de …"; "Ordem correta" com fatias fora da tolerância = "aprovação no critério que importa"'], nota: 'Nenhuma forma prevalece (P18).' },
  { id: 'mod-div-08', tipo: 'fonte×fonte', tema: 'O §00 T.2 chama o reconstrutor de "o único instrumento de todo o sistema Alexandria que exige que você produza a resposta antes de ver a correção"', leitura_a: { fonte: 'L497 e inst-intro do INST 04 (L806)' }, leitura_b: { protocolo: 'extraction-protocol.md §3 registra um "Reconstrutor" no Módulo 10 com o mesmo verbo e pedagogia (mecânica diferente)' }, nota: 'Afirmação de exclusividade não verificável dentro do M08; registrada.' },
  { id: 'mod-div-09', tipo: 'fonte (vocabulário interno)', tema: '"Trava" como vocabulário interno visível ao learner', ocorrencias: [...html.matchAll(/[Tt]rava( \d| de)/g)].map((m) => ({ linha: lineOf(m.index), trecho: ini(html.slice(Math.max(0, m.index - 30), m.index + 40), 80) })), nota: 'P23: "Trava 1" (bloco de produto da Aula 07) e "trava de verificação"/"trava de dados verificados" sem definição no módulo.' },
  { id: 'mod-div-10', tipo: 'fonte (marca)', tema: 'GridAlpha no conteúdo', ocorrencias: identidade.marca_na_fonte.ocorrencias_gridalpha, nota: 'P24.' },
  { id: 'mod-div-11', tipo: 'fonte×código', tema: 'Comentário de cabeçalho do código desatualizado', leitura_a: { codigo: 'alexandria-modulo-08-content.ts L30-55: "INSTRUMENTOS: SÓ O INST · 04 PORTADO" e "Os OUTROS DEZ instrumentos seguem não portados"' }, leitura_b: { codigo_real: 'as 7 aulas têm instruments preenchidos e MODULO_08_INSTRUMENTOS tem o INST 01; INSTRUMENT_CALCULATORS tem os 11 (12 ids)' } },
  { id: 'mod-div-12', tipo: 'fonte (P17)', tema: 'O caso declara "Parte 8"', leitura_a: { fonte: '§Caso sec-id "Operação A — mineração em Minas Gerais · Parte 8" (L1475) e cartão do §MAP "Operação A · Parte 8"' }, leitura_b: { decisao: 'P17 (decidido para o M01: "Não existe Parte 1")' }, nota: 'No M08 a numeração de parte existe na fonte (caso seriado entre módulos); a decisão de título da camada Alexandria fica para o produto.' },
];
{
  const orf = [];
  for (const [a, bs] of Object.entries(C08.MODULO_08_CORPO)) bs.forEach((b, i) => {
    const h = b.html || ''; const o = (h.match(/<b>/g) || []).length; const c = (h.match(/<\/b>/g) || []).length;
    if (c > o) orf.push({ aula: a, bloco: i, trecho: h.slice(Math.max(0, h.indexOf('</b>') - 50), h.indexOf('</b>') + 5) });
  });
  const hlAulas = SECOES.filter((s) => /^a0\d$/.test(s)).reduce((n, s) => n + (secao(s).body.match(/class="hl"/g) || []).length, 0);
  divergencias.push({ id: 'mod-div-cod-hl', tipo: 'fonte×código', severidade: 'média', tema: 'Parágrafos com <span class="hl"> perderam a abertura do destaque e ficaram com um </b> órfão no código (mesmo defeito do M01 COD-03)', medicao: { spans_hl_nas_aulas_da_fonte: hlAulas, fechamentos_orfaos_no_codigo: orf.length, casos: orf } });
}
for (const a of aulas) if (a.comparacao_codigo && !a.comparacao_codigo.lead_igual_fonte) divergencias.push({ id: `mod-div-lead-${a.marcador.slice(5)}`, tipo: 'fonte×código', tema: `Lead da ${a.marcador} não é verbatim no código${a.comparacao_codigo.lead_igual_salvo_espacos ? ' (só um espaço antes do ponto final: resíduo de <span class="hl"> removido)' : ''}`, severidade: a.comparacao_codigo.lead_igual_salvo_espacos ? 'baixa' : 'média', leitura_a: { fonte: a.lead.texto }, leitura_b: { codigo: a.comparacao_codigo.lead_codigo } });

for (const c of comparacao.cobertura_corpo_por_token) if (c.cobertura < 85 || c.elementos_perdidos.length) divergencias.push({ id: `mod-div-cob-${c.aula.slice(5)}`, tipo: 'fonte×código', severidade: c.cobertura < 85 ? 'alta' : 'média', tema: `Corpo da ${c.aula} no código: cobertura por token ${c.cobertura}%, ${c.elementos_perdidos.length} elemento(s) da fonte ausente(s) no código ou abaixo de 60% de cobertura`, medicao: c });
{
  const fx = comparacao.fatos_codigo;
  const ruins = [...fx.M08_FATOS.filter((f) => !f.na_fonte), ...fx.M08_UNIVERSOS_CAPACIDADE.filter((u) => !(u.rotulo_na_fonte && u.dataBase_na_fonte && u.universo_na_fonte && u.publicacao_na_fonte))];
  if (ruins.length) divergencias.push({ id: 'mod-div-fatos', tipo: 'fonte×código', severidade: 'média', tema: 'Fatos canônicos do código cujo texto não aparece literal na fonte', casos: ruins });
}

writeJson('modulo.json', {
  modulo: 'm08',
  fonte: 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo08.html',
  camada: 'fonte',
  gerado_por: 'extratores/m08_modulo.mjs',
  contagens: {
    secoes: roteiro.length, aulas: aulas.length, aparatos: roteiro.length - aulas.length,
    pilulas_hero: pills.length, eixos: identidade.eixos.length, blocos_tese: tese.blocos.length,
    cartoes_map: mapa.cartoes.length, itens_checklist_final: criterio.find((c) => c.id === 'm08-crit-final').itens.length,
    itens_sintese_7_5: resultado.sintese_duravel_aula07.itens.length, erros_comuns: erros_comuns.itens.length,
    destaques_numeros_vivos: principios.destaques_numeros_vivos.length, destaques_de_metodo: principios.destaques_de_metodo.length,
    blocos_de_produto_P7: blocosProduto.length, divergencias: divergencias.length,
  },
  identidade, tese, resultado_esperado: resultado, mapa, roteiro, criterio,
  laboratorios, voz_principios: principios, erros_comuns,
  tradutor: null,
  tradutor_nota: 'Não há "Tradutor" nem segundo "§ Map" no M08 (só §MAP · Percurso e mapa físico).',
  blocos_de_produto_P7: blocosProduto,
  comparacao_codigo: comparacao,
  divergencias,
});
console.log('modulo.json ok', roteiro.length, aulas.length, divergencias.length);
