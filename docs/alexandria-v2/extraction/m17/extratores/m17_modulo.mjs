// Extrator deterministico do grupo "modulo" do M17 -> modulo.json
import fs from 'node:fs';
import * as L from './lib.mjs';
import * as B from './blocos.mjs';

const { T, H, find, findAll, classIs, hasClass, origem, lineOf, pad } = L;
const D = 'file:///' + L.DATA + '/';
const C17 = await import(D + 'alexandria-modulo-17-content.ts');
const BL = await import(D + 'alexandria-blocks.ts');
const trilhasSrc = L.readData('alexandria-trilhas.ts');
const catalogo = fs.readFileSync(L.CATALOGO, 'utf8');

const R = L.runOriginal();
const J = L.evalLiteral('var J = ');
const DIMS = L.evalLiteral('var DIMS = ');

// ───────────── identidade ─────────────
const titleTag = find(L.DOM, (n) => n.tag === 'title');
const hero = find(L.DOM, (n) => classIs(n, 'hero'));
const kicker = find(hero, (n) => classIs(n, 'kicker'));
const h1 = find(hero, (n) => n.tag === 'h1');
const sub = find(hero, (n) => classIs(n, 'sub'));
const pills = findAll(hero, (n) => classIs(n, 'pill'));
const heroCountRule = L.scriptSlice('function set(id,v)', '})();');
const regraPill = (id) => {
  const i = heroCountRule.codigo.indexOf(`set('${id}'`);
  if (i < 0) return null;
  const j = heroCountRule.codigo.indexOf(');', i);
  // hp-err depende da linha anterior (errTbl)
  const pre = id === 'hp-err' ? heroCountRule.codigo.slice(heroCountRule.codigo.indexOf('var errTbl'), heroCountRule.codigo.indexOf(';', heroCountRule.codigo.indexOf('var errTbl')) + 1) + ' ' : '';
  return L.collapse(pre + heroCountRule.codigo.slice(i, j + 2));
};
// contagens que o script escreveria no hero (medidas aqui no DOM, mesma regra)
const secs = L.SECOES;
const contagemScript = {
  'hp-aulas': secs.filter((s) => /^a[01]/.test(s.id)).length,
  'hp-inst': findAll(L.DOM, (n) => classIs(n, 'inst-hd')).length,
  'hp-jur': J.valor.length,
  'hp-termos': findAll(L.DOM, (n) => classIs(n, 'term')).length,
  'hp-ex': findAll(L.byId('ex'), (n) => n.tag === 'details').length,
  'hp-err': findAll(find(L.byId('erros'), (n) => n.tag === 'table'), (n) => n.tag === 'tr').length - 1,
  'hp-ck': findAll(L.byId('final'), (n) => n.tag === 'li').length,
  'hp-ref': findAll(find(L.byId('ref'), (n) => classIs(n, 'ref-list')), (n) => n.tag === 'p').length + findAll(find(L.byId('ref'), (n) => n.tag === 'table'), (n) => n.tag === 'tr').length - 1,
};
const footer = find(L.DOM, (n) => n.tag === 'footer');
const footerPs = findAll(footer, (n) => n.tag === 'p');

const identidade = {
  id: 'm17-identidade',
  tipo: 'identidade',
  title_tag: { html: H(titleTag), texto: T(titleTag), origem: origem('head > title', titleTag) },
  kicker: L.lit(kicker, 'div.hero .kicker'),
  titulo: L.lit(h1, 'div.hero h1'),
  subtitulo: L.lit(sub, 'div.hero p.sub'),
  pills: pills.map((p, i) => {
    const b = find(p, (n) => n.tag === 'b');
    const id = b && b.attrs.id ? b.attrs.id : null;
    return {
      id: `m17-pill-${pad(i + 1)}`, html: H(p), texto: T(p),
      valor_markup: b ? T(b) : null,
      id_alvo_script: id,
      valor_calculado_pelo_script: id ? contagemScript[id] : null,
      regra_script: id ? regraPill(id) : null,
      origem: origem('div.hero .pill-row .pill', p),
    };
  }),
  pills_nota: 'Oito pills trazem "—" no markup e recebem o número do <script> ("contagens do hero", L' + heroCountRule.linha_inicio + '). `valor_calculado_pelo_script` foi medido aqui no DOM com a mesma regra do script; é anotação desta extração, não texto da fonte.',
  horas: null,
  horas_nota: 'A fonte não declara carga horária: zero ocorrência de "hora"/"horas" no arquivo inteiro e nenhum pill de tempo além de "roteiro oral 10 min". O catálogo do código (alexandria-blocks.ts, bloco-17) traz estimatedHoursMin 2 / estimatedHoursMax 3 sem origem nesta fonte (ver divergências).',
  trilha: null,
  trilha_nota: 'A fonte não declara trilha nem nível: o kicker diz só "Alexandria · GridAlpha · Módulo 17". O catálogo canônico registra "Especialização Estratégica — atribuída"; o código tem level 3, track "brasil".',
  eixos: null,
  eixos_nota: 'Não há "eixos" rotulados. O mais próximo: as quatro dimensões do critério do currículo (§MAP) e as "três lentes" / "três parcelas" do §00 (em `tese`).',
  data_verificacao: (() => { const p = pills.find((x) => /verificado em/.test(T(x))); return { html: H(p), texto: T(p), origem: origem('div.hero .pill (verificado em)', p) }; })(),
  rodape: footerPs.map((p, i) => ({ id: `m17-rodape-${pad(i + 1)}`, html: H(p), texto: T(p), origem: origem('footer .wrap > p', p) })),
  marca_P24: {
    ocorrencias_GridAlpha_no_body: (L.html.slice(L.html.indexOf('<body>'), L.html.indexOf('<script>')).match(/GridAlpha/g) || []).length,
    nota: 'A fonte usa "GridAlpha" no kicker, na tese, nos blocos "Onde isso entra no produto", no §Erros (19), no §Final (item 27), no §Ref e no rodapé. Mantido literal (camada fonte). P24: marca morta para o learner; P7: blocos de produto não se exibem.',
  },
};

// ───────────── §00 tese ─────────────
const teseBlocos = B.blocosDaSecao('tese').map((b, i) => ({ id: `m17-tese-b${pad(i + 1)}`, ...b }));
const tese = {
  id: 'm17-tese',
  tipo: 'tese',
  marcador: teseBlocos[0].texto,
  titulo_secao: { html: teseBlocos[1].html, texto: teseBlocos[1].texto },
  nota: 'Seção §00 inteira, bloco a bloco, na ordem da fonte. Inclui a afirmação que organiza o módulo, as três lentes, a decomposição em três parcelas (declarada "construção deste módulo, não do currículo"), a régua de nomeação (4 faixas), a declaração de conflito, as seis glosas de desambiguação, a tabela "O que este módulo não faz", o destaque "Números vivos" e o encaixe no currículo. Blocos com `bloco_de_produto_P7: true` são "Onde isso entra no produto" (P7: não exibir).',
  blocos: teseBlocos,
  origem: origem('section#tese', L.secao('tese').node, T(L.secao('tese').sid)),
};

// ───────────── resultado esperado / capacidades ─────────────
const capacidades = [];
for (const s of secs) {
  for (const box of findAll(s.node, (n) => n.tag === 'div' && /^box\b/.test(n.attrs.class || ''))) {
    const tag = find(box, (n) => classIs(n, 'tag'));
    if (!tag || !/^Onde isso entra no produto/.test(T(tag))) continue;
    const inner = L.innerHTML(box);
    const m = /(Capacidade(?: analítica)? entregue(?: por este módulo)?:)\s*<b>([\s\S]*?)<\/b>/.exec(inner);
    capacidades.push({
      id: `m17-cap-${pad(capacidades.length + 1)}`,
      secao: s.id,
      aula_id: s.eh_aula ? `aula-17-${s.id.slice(1)}` : null,
      frase_introdutoria: m ? m[1] : null,
      html: m ? L.inline(m[2]) : null,
      texto: m ? L.texto(m[2]) : null,
      sem_frase_capacidade: !m,
      dentro_de_bloco_de_produto_P7: true,
      marcacao_p14: m ? (/menos de um minuto/.test(m[2]) ? ['cronometrado', 'producao_oral_ou_livre'] : ['producao_oral_ou_livre']) : null,
      origem: origem(`section#${s.id} div.box.gd (Onde isso entra no produto)`, box, m ? L.texto(m[2]).slice(0, 70) : T(box).slice(0, 70)),
    });
  }
}
const resultado_esperado = {
  id: 'm17-resultado-esperado',
  secao_de_modulo: null,
  nota: 'O M17 não tem seção "Resultado esperado" nem lista de capacidades. As únicas declarações de capacidade estão DENTRO dos blocos "Onde isso entra no produto" (P7), na forma "Capacidade entregue: <b>…</b>". Estão abaixo, literais, como candidatas; todas vivem em bloco de produto e por isso não podem ser exibidas no formato da fonte (P7). `marcacao_p14` é inferência pelo verbo/ tempo ("em menos de um minuto").',
  capacidades_em_blocos_de_produto: capacidades,
  outras_formulacoes_de_objetivo: [
    (() => { const p = find(L.secao('tese').node, (n) => n.tag === 'p' && /Este módulo não existe para responder/.test(T(n))); return { onde: '§00', ...L.lit(p, 'section#tese > .wrap > p'), marcacao_p14: ['cronometrado'], nota_p14: '"em menos de um minuto" (inferência)' }; })(),
  ],
};

// ───────────── §MAP ─────────────
const mapBlocos = B.blocosDaSecao('map').map((b, i) => ({ id: `m17-map-b${pad(i + 1)}`, ...b }));
const dimTable = mapBlocos.find((b) => b.tipo === 'tabela' && b.cabecalho && b.cabecalho[0].texto === 'Dimensão do critério');
const mapa = {
  id: 'm17-mapa',
  tipo: 'mapa',
  marcador: mapBlocos[0].texto,
  titulo_secao: { html: mapBlocos[1].html, texto: mapBlocos[1].texto },
  perguntas_por_aula: null,
  perguntas_por_aula_nota: 'Diferente do M01, o §MAP do M17 não traz tabela aula × pergunta. Ele mapeia as 17 jurisdições nas 4 dimensões do critério do currículo. As "perguntas" que a fonte associa ao mapa são as quatro perguntas das dimensões (tabela e objeto DIMS do script), abaixo.',
  dimensoes: dimTable.linhas.map((l, i) => {
    const key = Object.keys(DIMS.valor)[i];
    return {
      id: `m17-dim-${key}`,
      dimensao: l.celulas[0].texto,
      agrupa_html: l.celulas[1].html, agrupa_texto: l.celulas[1].texto,
      nao_agrupa_html: l.celulas[2].html, nao_agrupa_texto: l.celulas[2].texto,
      script: { chave: key, label: DIMS.valor[key].label, pergunta: DIMS.valor[key].pergunta, nao: DIMS.valor[key].nao, grupos: DIMS.valor[key].buckets, origem: { seletor: '<script> var DIMS', trecho_inicial: `${key}:{ label:'${DIMS.valor[key].label}'`, linha_aprox: L.lineOfScript(`${key}:{ label:`) } },
      linha_aprox: l.linha_aprox,
    };
  }),
  grade_17: J.valor.map((j) => ({ chave: j.k, nome: j.n, ficha: !!j.core, etiqueta: j.tagl, preco: j.preco, descarb: j.descarb, regul: j.regul, invest: j.invest, resumo_4d: j.d4 })),
  grade_17_origem: { seletor: '<script> var J = [...] (renderizado em #jg-main)', trecho_inicial: "var J = [", linha_aprox: J.linha_aprox },
  blocos: mapBlocos,
  origem: origem('section#map', L.secao('map').node, T(L.secao('map').sid)),
};

// ───────────── roteiro ─────────────
const codeAulas = C17.MODULO_17_AULAS;
const roteiro = secs.map((s, i) => {
  const num = s.eh_aula ? s.id.slice(1) : null;
  const code = num ? codeAulas.find((a) => a.id === `aula-17-${num}`) : null;
  const lede = find(s.node, (n) => classIs(n, 'lede'));
  const insts = findAll(s.node, (n) => classIs(n, 'inst'));
  return {
    id: s.eh_aula ? `aula-17-${num}` : `m17-sec-${s.id}`,
    ordem: i + 1,
    tipo: s.eh_aula ? 'aula' : 'aparato',
    id_fonte: s.id,
    marcador_html: s.marcador_html,
    marcador_texto: s.marcador_texto,
    prefixo: s.prefixo,
    rotulo: s.rotulo,
    titulo: { html: H(s.h2), texto: T(s.h2) },
    lede: lede ? { html: H(lede), texto: T(lede) } : null,
    instrumentos: insts.map((n) => ({ id_fonte: n.attrs.id, rotulo: T(find(n, (k) => classIs(k, 'id'))), titulo: T(find(n, (k) => classIs(k, 'ti'))) })),
    tres_niveis: findAll(s.node, (n) => classIs(n, 'lv')).map((n) => ({ id_fonte: n.attrs.id, rotulo: T(find(n, (k) => classIs(k, 'lv-hd'))) })),
    codigo: code ? { id: code.id, title: code.title, subtitle: code.subtitle, totalInModule: code.totalInModule, title_igual_h2: code.title === T(s.h2), subtitle_igual_rotulo: code.subtitle === s.rotulo, instruments: code.instruments.length, activities: code.activities.length } : null,
    origem: origem(`section#${s.id} .sec-id`, s.sid),
  };
});

// ───────────── critérios ─────────────
const quizSec = L.secao('quiz');
const quizLede = find(quizSec.node, (n) => classIs(n, 'lede'));
const quizScore = L.scriptSlice("sc.className='score show '", 'sc.scrollIntoView');
const mapLede = find(L.secao('map').node, (n) => classIs(n, 'lede'));
const tesePcurr = find(L.secao('tese').node, (n) => n.tag === 'p' && /O currículo pede que você/.test(T(n)));
const exSec = L.secao('ex');
const exLede = find(exSec.node, (n) => classIs(n, 'lede'));
const finalSec = L.secao('final');
const finalLede = find(finalSec.node, (n) => classIs(n, 'lede'));
const vozSec = L.secao('voz');
const quizPill = pills.find((p) => /quiz/.test(T(p)));
const vozPill = pills.find((p) => /roteiro oral/.test(T(p)));
// mensagens do placar, lidas do ternário literal de sc.innerHTML no corrigir()
// [verificação 2026-09-17] o 1º ternário do bloco é a classe ('pass':'fail'); as mensagens exibidas
// estão no ternário de sc.innerHTML. A versão anterior capturava 'pass'/'fail' como mensagem.
const qMsgs = (() => {
  const src = quizScore.codigo;
  const m = /\?\s*'([^']*)'\s*:\s*'([^']*)'/.exec(src.slice(src.indexOf('sc.innerHTML')));
  return { acertos_ge_8: m[1], acertos_lt_8: m[2] };
})();
const criterio = {
  id: 'm17-criterio',
  tipo: 'criterio_do_modulo',
  nota_P18: 'P18: nenhuma forma abaixo é "o" critério. Diferente do M01, aqui a prosa do §Quiz (8 de 10) e o limiar do script (acertos>=8) CONCORDAM. O critério do currículo (comparar em 4 dimensões e explicar a diferença) é qualitativo e não tem limiar. §Ex e §Final não declaram limiar nem regra de aprovação.',
  criterios: [
    { id: 'm17-crit-curriculo', tipo: 'criterio_do_curriculo_citado', secao: '§MAP', ...L.lit(mapLede, 'section#map p.lede'),
      frase_criterio: 'O critério do currículo pede comparar o Brasil com cinco outros mercados em quatro dimensões — preço, descarbonização, regulação e investimento — e explicar por que cada um é diferente.',
      marcacao_p14: ['producao_oral_ou_livre'], nota: 'Citação do Currículo Definitivo feita pela fonte (não é o texto do currículo em si). `frase_criterio` é a 1ª frase do lede, recortada da fonte.' },
    { id: 'm17-crit-metodo', tipo: 'metodo_declarado_como_construcao', secao: '§00', ...L.lit(tesePcurr, 'section#tese > .wrap > p'), marcacao_p14: [], nota: 'A fonte declara a decomposição em três parcelas como escolha própria para cumprir a 2ª metade do critério do currículo.' },
    { id: 'm17-crit-quiz', tipo: 'criterio_quiz', secao: '§Quiz',
      titulo_secao: { html: H(quizSec.h2), texto: T(quizSec.h2), origem: origem('section#quiz h2', quizSec.h2) },
      lede: L.lit(quizLede, 'section#quiz p.lede'),
      pill_hero: { html: H(quizPill), texto: T(quizPill), origem: origem('div.hero .pill', quizPill) },
      limiar: { acertos: 8, total: 10, fonte_literal: 'Critério: 8 de 10' },
      script: { condicao: 'acertos>=8', mensagens: qMsgs, codigo_verbatim: quizScore.codigo, origem: { seletor: '<script> QUIZ corrigir()', trecho_inicial: "sc.className='score show '", linha_aprox: quizScore.linha_inicio } },
      marcacao_p14: ['automatizavel_quiz'],
      nota: 'Prosa e script concordam (>=8 aprova). A mensagem de reprovação repete "Critério é 8 de 10".' },
    { id: 'm17-crit-exercicios', tipo: 'orientacao_exercicios', secao: '§Ex', titulo_secao: { html: H(exSec.h2), texto: T(exSec.h2) }, ...L.lit(exLede, 'section#ex p.lede'), limiar: null, marcacao_p14: ['autoavaliado_sem_registro', 'producao_oral_ou_livre'], nota: 'O título diz "nas quatro categorias do critério", mas não há limiar numérico. A fonte revela o gabarito ao abrir o <details>, sem registrar tentativa.' },
    { id: 'm17-crit-checklist', tipo: 'checklist_de_uso', secao: '§Final', titulo_secao: { html: H(finalSec.h2), texto: T(finalSec.h2) }, ...L.lit(finalLede, 'section#final p.lede'), limiar: null, marcacao_p14: ['autoavaliado_sem_registro'], nota: 'O §Final não diz "só passa quem…" (diferente do M01). É protocolo de uso ("Percorra antes de aceitar, produzir ou repetir…"), com 30 itens (em aparato.json).' },
    { id: 'm17-crit-voz', tipo: 'producao_oral_cronometrada', secao: '§Voz', titulo_secao: { html: H(vozSec.h2), texto: T(vozSec.h2) }, lede: L.lit(find(vozSec.node, (n) => classIs(n, 'lede')), 'section#voz p.lede'),
      pill_hero: { html: H(vozPill), texto: T(vozPill), origem: origem('div.hero .pill', vozPill) },
      limiar: null, marcacao_p14: ['producao_oral_ou_livre', 'cronometrado'], nota: 'P14: roteiro oral de 10 minutos, em 7 faixas de tempo. Não vira evidência automatizada.' },
  ],
};

// ───────────── laboratórios ─────────────
const laboratorios = {
  id: 'm17-laboratorios',
  secao_lab: null,
  nota: 'Não há "§ Lab" no M17 (varredura: zero "§Lab"/"Lab ·"/"Laboratório"). O único instrumento fora de aula é o Instrumento 01 (Mapa das jurisdições), no §MAP — está em instrumentos.json com `fora_de_aula: true`. O §Fichas (6 fichas × 7 campos) é recurso de módulo e está em aparato.json.',
  instrumentos_fora_de_aula: ['m17-inst-01'],
};

// ───────────── voz / princípios ─────────────
const vozBlocos = B.blocosDaSecao('voz');
const rot = vozBlocos.find((b) => b.tipo === 'roteiro_cronometrado');
const pick = (pred) => teseBlocos.find(pred);
const principios = [
  ['A afirmação que organiza o módulo', (b) => b.tipo === 'destaque' && b.rotulo === 'A afirmação que organiza o módulo'],
  ['Simetria obrigatória', (b) => b.tipo === 'destaque' && b.rotulo === 'Simetria obrigatória'],
  ['Régua de nomeação (4 faixas)', (b) => b.tipo === 'escada'],
  ['O que isso custa em precisão', (b) => b.tipo === 'destaque' && /custa em precisão/.test(b.rotulo || '')],
  ['Declaração de conflito de interesse', (b) => b.tipo === 'declaracao_conflito'],
  ['O que este módulo não faz', (b) => b.tipo === 'tabela'],
  ['Números vivos', (b) => b.tipo === 'destaque' && /^Números vivos/.test(b.rotulo || '')],
].map(([nome, pred]) => { const b = pick(pred); return { nome_anotacao: nome, ref_bloco: b.id, tipo_bloco: b.tipo, rotulo_fonte: b.rotulo ?? null, linha_aprox: b.origem.linha_aprox }; });
const voz = {
  id: 'm17-voz',
  roteiro_oral: {
    id: 'm17-roteiro-oral',
    marcador: vozBlocos[0].texto,
    titulo_secao: { html: vozBlocos[1].html, texto: vozBlocos[1].texto },
    lede: { html: vozBlocos[2].html, texto: vozBlocos[2].texto, origem: vozBlocos[2].origem },
    faixas: rot.itens.map((it, i) => ({ id: `m17-voz-${pad(i + 1)}`, ...it })),
    nota_de_fonte: (() => { const b = vozBlocos.find((x) => x.tipo === 'nota_de_fonte'); return { html: b.html, texto: b.texto, origem: b.origem }; })(),
    marcacao_p14: ['producao_oral_ou_livre', 'cronometrado'],
    origem: rot.origem,
  },
  principios_editoriais: principios,
  principios_nota: 'Ponteiros para blocos literais de `tese.blocos` (nomes em `nome_anotacao` são anotação). Outros princípios literais: `identidade.rodape` (régua de nomeação e recusas), a nota de fonte do §Voz, e o destaque do §Ref sobre recursos primários (aparato.json).',
};

// ───────────── erros comuns ─────────────
const errosBlocos = B.blocosDaSecao('erros');
const errTab = errosBlocos.find((b) => b.tipo === 'tabela');
const ponteiros = [];
for (const s of secs.filter((x) => x.eh_aula)) {
  for (const box of findAll(s.node, (n) => n.tag === 'div' && /^box rd/.test(n.attrs.class || ''))) {
    const tag = find(box, (n) => classIs(n, 'tag'));
    if (tag && /erro|errad/i.test(T(tag))) ponteiros.push({ aula_id: `aula-17-${s.id.slice(1)}`, rotulo: T(tag), origem: origem(`section#${s.id} div.box.rd`, box, T(tag)) });
  }
}
const erros_comuns = {
  id: 'm17-erros',
  marcador: errosBlocos[0].texto,
  titulo_secao: { html: errosBlocos[1].html, texto: errosBlocos[1].texto },
  cabecalho: errTab.cabecalho,
  itens: errTab.linhas.map((l) => ({ id: `m17-erro-${l.celulas[0].texto}`, numero: l.celulas[0].texto, erro_html: l.celulas[1].html, erro_texto: l.celulas[1].texto, correcao_html: l.celulas[2].html, correcao_texto: l.celulas[2].texto, linha_aprox: l.linha_aprox })),
  ponteiros_em_aula: ponteiros,
  origem: errTab.origem,
};

// ───────────── tradutor ─────────────
const tradutor = {
  id: 'm17-tradutor',
  secao: null,
  nota: 'O M17 não tem "Tradutor" nem "§ Map" (caixa baixa). A função mais próxima são os 6 blocos "três níveis" (Criança de 12 anos / Executivo / Especialista) dentro das aulas 01, 02, 03 (2), 04 e 08 — listados em `roteiro[].tres_niveis`; o texto deles é conteúdo de aula (grupo de aulas), não do módulo.',
  tres_niveis_ponteiros: roteiro.flatMap((r) => r.tres_niveis.map((t) => ({ aula_id: r.id, ...t }))),
};

// ───────────── comparação com código e catálogo ─────────────
const aulasPorBloco = +(/'bloco-17':\s*(\d+)/.exec(trilhasSrc) || [])[1];
const bloco17 = BL.ALEXANDRIA_BLOCKS.find((b) => b.id === 'bloco-17');
const catIdx = catalogo.indexOf('## Módulo 17 — ');
const catSec = catalogo.slice(catIdx, catalogo.indexOf('\n# ', catIdx + 10));
const catTitulo = /## Módulo 17 — (.*)/.exec(catSec)[1];
const catAulas = [...catSec.matchAll(/^\| (\d\d) \| ([^|]+) \| ([^|]+) \|$/gm)].map((m) => ({ n: m[1], rotulo: m[2].trim(), titulo: m[3].trim() }));
const catInst = [...catSec.matchAll(/^\| Instrumento (\d\d) \| ([^|]+) \|/gm)].map((m) => ({ n: m[1], titulo: m[2].trim() }));
const leadCmp = roteiro.filter((r) => r.tipo === 'aula').map((r) => {
  const code = C17.MODULO_17_LEAD[r.id];
  return { aula_id: r.id, lead_codigo_igual_lede_fonte_texto: L.texto(code) === r.lede.texto };
});
// cobertura por palavra do corpo do código contra a aula na fonte (sem markup de instrumento)
const cobertura = secs.filter((s) => s.eh_aula).map((s) => {
  const id = `aula-17-${s.id.slice(1)}`;
  let body = L.innerHTML(s.node);
  for (const inst of findAll(s.node, (n) => classIs(n, 'inst'))) body = body.replace(L.outerHTML(inst), ' ');
  const sid = L.outerHTML(s.sid);
  body = body.replace(sid, ' ');
  const src = L.tokens(body);
  const a = codeAulas.find((x) => x.id === id);
  const corpo = C17.MODULO_17_CORPO[id].map((b) => [b.html, b.texto, b.label, b.numero, ...(b.itens || []), ...((b.linhas || []).flat())].filter(Boolean).join(' ')).join(' ');
  const ext = [a.title, C17.MODULO_17_LEAD[id], corpo].join(' ');
  return { aula_id: id, ...L.coverage(src, ext) };
});
// tabelas do código cuja 1ª linha não é cabeçalho <th> na fonte (protocolo §15)
const thRows = new Set(findAll(L.DOM, (n) => n.tag === 'tr' && findAll(n, (k) => k.tag === 'th').length).map((tr) => findAll(tr, (k) => k.tag === 'th').map((c) => T(c).replace(/\u00a0/g, '')).join(' | ')));
const tabelasSemCabecalho = [];
for (const [aid, bl] of Object.entries(C17.MODULO_17_CORPO)) {
  bl.forEach((b, i) => {
    if (b.kind !== 'tabela') return;
    const first = b.linhas[0].map((c) => L.texto(c).replace(/\u00a0/g, '')).join(' | ');
    if (!thRows.has(first)) tabelasSemCabecalho.push({ aula_id: aid, indice_bloco: i, primeira_linha: first.slice(0, 90) });
  });
}
const comparacao_codigo = {
  arquivos: ['src/lib/data/alexandria-modulo-17-content.ts', 'src/lib/data/alexandria-blocks.ts', 'src/lib/data/alexandria-trilhas.ts', 'src/lib/data/alexandria-curriculo.ts', 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md'],
  contagem_aulas: {
    fonte_secoes_Aula_NN: secs.filter((s) => s.eh_aula).length,
    fonte_regra_hero_script: contagemScript['hp-aulas'],
    fonte_prosa: 'Aula 11 lede: "As dez aulas anteriores…" (implica 11)',
    codigo_MODULO_17_AULAS: codeAulas.length,
    codigo_totalInModule: [...new Set(codeAulas.map((a) => a.totalInModule))],
    codigo_AULAS_POR_BLOCO: aulasPorBloco,
    catalogo_canonico: catAulas.length,
    concordam: [secs.filter((s) => s.eh_aula).length, codeAulas.length, aulasPorBloco, catAulas.length].every((x) => x === 11),
  },
  titulos: roteiro.filter((r) => r.tipo === 'aula').map((r) => {
    const c = catAulas.find((x) => x.n === r.id.slice(-2));
    return { aula_id: r.id, fonte_rotulo: r.rotulo, fonte_h2: r.titulo.texto, codigo_subtitle: r.codigo.subtitle, codigo_title: r.codigo.title, catalogo_rotulo: c && c.rotulo, catalogo_titulo: c && c.titulo,
      iguais: r.codigo.title === r.titulo.texto && r.codigo.subtitle === r.rotulo && c && c.titulo === r.titulo.texto && c.rotulo === r.rotulo };
  }),
  leads: leadCmp,
  cobertura_por_palavra_codigo_vs_fonte: cobertura,
  cobertura_nota: 'Tokens da seção da aula na fonte (sem o markup dos instrumentos e sem o sec-id) casados, com baixa, contra title + lead + corpo do código. Medida desta extração, para P8.',
  tabelas_do_codigo_sem_cabecalho_na_fonte: tabelasSemCabecalho,
  tabelas_nota: 'Protocolo §15: o componente Tabela promove a 1ª linha a <thead>. Estas tabelas do código vêm de estruturas sem <th> na fonte (p7, cn5, tri, grg, esc…), então a 1ª linha de dado vira cabeçalho.',
  instrumentos_no_codigo: codeAulas.reduce((a, x) => a + x.instruments.length, 0),
  exercicios_no_codigo: { MODULO_17_EXERCICIOS_SOLTOS: C17.MODULO_17_EXERCICIOS_SOLTOS.length, importado_em_alexandria_curriculo_ts: /MODULO_17_EXERCICIOS_SOLTOS/.test(L.readData('alexandria-curriculo.ts')) },
  catalogo_codigo_bloco_17: bloco17,
  catalogo_canonico: {
    titulo: catTitulo,
    titulo_igual_fonte: catTitulo === T(h1),
    escala_declarada: L.collapse(/\*\*Escala\*\* · ([\s\S]*?)\n\n/.exec(catSec)[1]),
    aulas: catAulas,
    instrumentos: catInst,
    instrumentos_titulos_iguais_fonte: catInst.filter((c) => {
      const n = findAll(L.DOM, (k) => classIs(k, 'inst')).find((k) => T(find(k, (x) => classIs(x, 'id'))) === `Instrumento ${c.n}`);
      const t = n ? T(find(n, (x) => classIs(x, 'ti'))) : null;
      return t === c.titulo || t === c.titulo.replace(/\s*\(instrumento assinatura\)$/, ' · instrumento assinatura');
    }).length + ' de ' + catInst.length,
  },
  AULAS_POR_BLOCO_bloco_17: aulasPorBloco,
};

// ───────────── divergências ─────────────
const lv2 = findAll(L.byId('lv2'), (n) => hasClass(n, 'lv-pane'))[2];
const a07lede = find(L.secao('a07').node, (n) => n.tag === 'p' && /Aula 09 separa/.test(T(n)));
const gloCarb = findAll(L.secao('tese').node, (n) => classIs(n, 'glo'))[5];
const gloCap = findAll(L.secao('tese').node, (n) => classIs(n, 'glo'))[0];
const lexMerc = find(L.secao('lex').node, (n) => n.tag === 'p' && /glosa quíntupla do §00/.test(T(n)));
// assinaturas 4D
const sig = new Map();
for (const j of J.valor) { const k = [j.preco, j.descarb, j.regul, j.invest].join('|'); sig.set(k, [...(sig.get(k) || []), j.n]); }
const unicas = [...sig.values()].filter((v) => v.length === 1).length;
const colisoes = [...sig.values()].filter((v) => v.length > 1);
const pQuinze = find(L.secao('map').node, (n) => n.tag === 'p' && /Quinze das dezessete/.test(T(n)));
// concordância entre dimensões: tentativa de reprodução (anotação)
const dimsK = ['preco', 'descarb', 'regul', 'invest'];
const pairs = []; for (let a = 0; a < J.valor.length; a++) for (let b = a + 1; b < J.valor.length; b++) pairs.push([J.valor[a], J.valor[b]]);
const conc = {};
for (let x = 0; x < 4; x++) for (let y = x + 1; y < 4; y++) {
  const A = dimsK[x], Bk = dimsK[y];
  const sA = pairs.filter(([p, q]) => p[A] === q[A]).length, sB = pairs.filter(([p, q]) => p[Bk] === q[Bk]).length;
  const both = pairs.filter(([p, q]) => p[A] === q[A] && p[Bk] === q[Bk]).length;
  const either = pairs.filter(([p, q]) => p[A] === q[A] || p[Bk] === q[Bk]).length;
  conc[`${A}×${Bk}`] = { jaccard_pares_mesmo_grupo: +(both / either).toFixed(3), ambos: both, algum: either, so_A: sA, so_B: sB };
}
const concTable = mapBlocos.find((b) => b.tipo === 'tabela' && b.cabecalho && b.cabecalho[0].texto === 'Par de dimensões');
const heroBox = teseBlocos.find((b) => b.rotulo === 'A afirmação que organiza o módulo');
const catTravessao = /como no Módulo 16, o hero\s+> traz travessão no lugar do número em (\w+) campos — ([^.]*)\./.exec(catSec);
const catRef = /apenas o total de referências não é declarado em lugar nenhum/.test(catSec);

const a06p = find(L.secao('a06').node, (n) => n.tag === 'p' && /^Duas coisas mudaram/.test(T(n)));
const a06t = find(L.secao('a06').node, (n) => n.tag === 'table');
const par3 = B.bloco(L.byId('par3-demo'), 'a02');
const par3bar1 = par3.partes.find((p) => p.tipo === 'barra');
const par3nt1 = par3.partes.find((p) => p.tipo === 'nota');
const a05box = findAll(L.secao('a05').node, (n) => n.tag === 'div' && n.attrs.class === 'box rd')[0];
const a05cn3 = findAll(L.secao('a05').node, (n) => classIs(n, 'cn5-r'))[2];
const verificacoes_da_fonte = [
  { id: 'ver-m17-01-concordancia', tema: 'Tabela de concordância entre dimensões (§MAP)', fonte: concTable.linhas.map((l) => `${l.celulas[0].texto}: ${l.celulas[1].texto}`).join('; '),
    medicao: conc, resultado: 'REPRODUZIDA: Jaccard sobre os 136 pares (pares no mesmo grupo nas duas dimensões ÷ pares no mesmo grupo em pelo menos uma) dá preço×investimento 0,500, regulação×investimento 0,395, preço×regulação 0,190 e as outras três 0,094/0,125/0,125 (≤0,125). A fórmula não está escrita na fonte; é a que reproduz os valores.', origem: concTable.origem },
  { id: 'ver-m17-02-colisoes', tema: 'As duas colisões declaradas', resultado: `Conferem nos dados do script: ${colisoes.map((c) => c.join(' = ')).join('; ')}.` },
  { id: 'ver-m17-03-nodais-sem-capacidade', tema: '"dois dos sete mercados nodais norte-americanos não têm nenhum" (mercado de capacidade)', resultado: 'Confere: entre os 7 da família (pjm, erc, cai, nyi, mis, ine, spp), regul = so_energia em erc e spp; cai tem obrigacao_supridor.' },
  { id: 'ver-m17-04-leilao-quatro', tema: '"leilão de longo prazo é o arranjo dominante em quatro das dezessete" (Aula 11)', resultado: `Confere: regul = leilao_longo_prazo em ${J.valor.filter((j) => j.regul === 'leilao_longo_prazo').map((j) => j.k).join(', ')}.` },
  { id: 'ver-m17-05-contagens-de-prosa', tema: 'Contagens anunciadas × markup', resultado: `§Ex "Dezoito" = ${contagemScript['hp-ex']}; §Erros "Vinte" = ${contagemScript['hp-err']}; §Final "Trinta" = ${contagemScript['hp-ck']}; §Lex "oito famílias" = ${findAll(L.secao('lex').node, (n) => n.tag === 'details').length}; §Fichas "Seis"/"Sete campos" = ${findAll(L.secao('fichas').node, (n) => classIs(n, 'fi')).length} × ${findAll(L.secao('fichas').node, (n) => classIs(n, 'fi-row')).length / 6}; Aula 05 "Sete operadores" = 7 no #jg-us; Aula 10 "Cinco casos" = ${findAll(L.secao('a10').node, (n) => n.tag === 'h3').length} h3; Aula 11 "doze enunciados" = 12 no script do Instrumento 12.` },
];
const codigo_divergencias = [
  { id: 'COD-M17-01', sev: 'media', tema: 'Rótulos dos 6 blocos "três níveis" (lv-hd) ausentes no código', evidencia: 'O código grava label "Três níveis" e perde o rótulo da fonte: ' + tradutor.tres_niveis_ponteiros.map((t) => `${t.aula_id}: "${t.rotulo}"`).join('; ') + '. Tokens desses rótulos são os únicos não casados na cobertura.' },
  { id: 'COD-M17-02', sev: 'media', tema: 'Protocolo §15: 6 tabelas do código vêm de estruturas sem <th> (p7, tri, cn5, grg) e têm a 1ª linha de dado promovida a cabeçalho', evidencia: 'ver comparacao_codigo.tabelas_do_codigo_sem_cabecalho_na_fonte' },
  { id: 'COD-M17-03', sev: 'media', tema: 'Aula 02: o exemplo estático #par3-demo (3 exemplos, 3 barras) virou uma nota "Proporção" única', evidencia: 'Os três exemplos foram fundidos numa nota; as proporções (flex) das barras se perderam (só os rótulos dos segmentos sobraram); o html termina com um "<" solto.' },
  { id: 'COD-M17-04', sev: 'baixa', tema: 'Aula 05: a declaração de conflito (div.conf) virou `titulo` + dois parágrafos', evidencia: 'O rótulo "Conflito de interesse · repetido aqui por obrigação" é renderizado como título de seção.' },
  { id: 'COD-M17-05', sev: 'media', tema: 'Aula 05: grade #jg-us (7 operadores, gerada pelo script) ausente', evidencia: 'Os 7 "traços" do script (ex.: "Maior em carga da família…") não estão no código.' },
  { id: 'COD-M17-06', sev: 'alta', tema: 'Instrumentos: 0 de 12 portados', evidencia: 'Todas as 11 aulas têm instruments: []; não há calculadora M17 em alexandria-instrument-calculators.ts. Detalhe em instrumentos.json.' },
  { id: 'COD-M17-07', sev: 'media', tema: 'Exercícios sem categoria, com points: 1 sem origem, e não consumidos', evidencia: 'MODULO_17_EXERCICIOS_SOLTOS (18) não é importado por alexandria-curriculo.ts nem por outro arquivo de src; categoria estrutural (div.dvs) descartada.' },
  { id: 'COD-M17-08', sev: 'alta', tema: 'Aparato do módulo ausente do código', evidencia: '§00, §MAP (grade 17×4), §Fichas, §Caso, §Erros, §Quiz, §Voz, §Final, §Lex (192 termos) e §Ref não existem em src/lib/data. Glossário: zero verbete gl-m17.' },
  { id: 'COD-M17-09', sev: 'baixa', tema: 'Horas 2–3 no catálogo do código sem origem na fonte', evidencia: 'ver div-m17-07-horas' },
];

const divergencias = [
  { id: 'div-m17-01-aula-dos-quatro-numeros', tipo: 'fonte×fonte', tema: 'Qual aula separa os quatro números de penetração',
    leitura_a: { onde: `section#a02 #lv2 (Especialista) L${lineOf(lv2.start)}`, texto: (/A distinção se ramifica[^:]*:/.exec(T(lv2)) || [])[0] },
    leitura_b: { onde: `section#a07 p L${lineOf(a07lede.start)}`, texto: ((/[^.]*Aula 09 separa[^.]*\./.exec(T(a07lede)) || [])[0] || '').trim() },
    evidencia: 'Os "quatro números" são o objeto da Aula 09 (Penetração) na marcação; a Aula 08 é "Carbono comparado".', decisao: 'não resolvida (camada fonte)' },
  { id: 'div-m17-02-glosa-carbono-aula', tipo: 'fonte×fonte', tema: 'Glosa "carbono" aponta a Aula 07 como objeto',
    leitura_a: { onde: `section#tese .glo (6 de 6) L${lineOf(gloCarb.start)}`, texto: T(find(gloCarb, (n) => n.tag === 'p')) },
    leitura_b: { onde: 'section#a08 .sec-id', texto: secs.find((s) => s.id === 'a08').marcador_texto },
    evidencia: 'Preço de carbono e carbono incorporado são tratados na Aula 08; a Aula 07 é "Escala e direcionamento" (China).', decisao: 'não resolvida' },
  { id: 'div-m17-03-onde-mora-a-glosa-capacidade', tipo: 'fonte×fonte', tema: 'Onde "mora" a glosa quíntupla de capacidade',
    leitura_a: { onde: `section#tese .glo (1 de 6), sentido E, L${lineOf(gloCap.start)}`, texto: (/Aula 04, onde mora esta glosa\./.exec(T(gloCap)) || [])[0] },
    leitura_b: { onde: `section#lex Família 4 L${lineOf(lexMerc.start)}`, texto: (/ver a glosa quíntupla do §00\./.exec(T(lexMerc)) || [])[0] },
    evidencia: 'Na marcação, a glosa está no §00 (L1082); a Aula 04 trata do assunto.', decisao: 'não resolvida' },
  { id: 'div-m17-04-assinaturas-unicas', tipo: 'fonte×script', tema: '"Quinze das dezessete jurisdições têm assinatura de quatro dimensões única"',
    leitura_a: { onde: `section#map p L${lineOf(pQuinze.start)}`, texto: T(pQuinze) },
    leitura_b: { onde: `<script> var J L${J.linha_aprox}`, texto: `Medido nos dados do script: ${sig.size} assinaturas distintas; ${unicas} jurisdições com assinatura exclusiva; ${colisoes.length} colisões (${colisoes.map((c) => c.join(' = ')).join('; ')}).` },
    evidencia: 'As duas colisões declaradas conferem. O número 15 corresponde a assinaturas DISTINTAS; jurisdições com assinatura única são 13 (as outras 4 formam os 2 pares). leitura_b é medição desta extração.', decisao: 'não resolvida' },
  { id: 'div-m17-06-duas-versoes-da-tese', tipo: 'fonte×fonte (forma)', tema: 'Tese em duas redações',
    leitura_a: { onde: `div.hero p.sub L${lineOf(sub.start)}`, texto: T(sub) },
    leitura_b: { onde: `section#tese .box (A afirmação que organiza o módulo) L${heroBox.origem.linha_aprox}`, texto: heroBox.partes[0].texto },
    evidencia: 'O subtítulo é versão curta; o box acrescenta "e não se importa", "é a única parcela discutível como escolha", "muda com ciclo eleitoral" e a frase sobre o Brasil. Não é contradição de conteúdo; são duas formas literais.', decisao: 'nenhuma' },
  { id: 'div-m17-07-horas', tipo: 'fonte×código', tema: 'Carga horária',
    leitura_a: { onde: 'fonte inteira', texto: 'nenhuma declaração de horas' },
    leitura_b: { onde: 'src/lib/data/alexandria-blocks.ts bloco-17', texto: `estimatedHoursMin: ${bloco17.estimatedHoursMin}, estimatedHoursMax: ${bloco17.estimatedHoursMax}` },
    evidencia: 'O comentário do código diz "estimatedHours 2-3" como "CATÁLOGO CONFIRMADO"; a fonte HTML não traz o número. O catálogo canônico também não declara horas para o M17.', decisao: 'não resolvida; o código tem valor sem origem nesta fonte' },
  { id: 'div-m17-08-catalogo-travessoes', tipo: 'fonte×catálogo', tema: 'Pills com travessão no hero',
    leitura_a: { onde: 'div.hero .pill b[id]', texto: `${pills.filter((p) => { const b = find(p, (n) => n.tag === 'b'); return b && b.attrs.id; }).length} pills com "—": ${pills.filter((p) => { const b = find(p, (n) => n.tag === 'b'); return b && b.attrs.id; }).map((p) => T(p).replace('— ', '')).join(', ')}` },
    leitura_b: { onde: 'catalogo-modulos-alexandria.md, Módulo 17', texto: catTravessao ? `"${catTravessao[1]} campos — ${L.collapse(catTravessao[2].replace(/\n>\s*/g, ' '))}"` : null },
    evidencia: `O catálogo diz "sete campos" e lista oito. E diz que o total de referências "não é declarado em lugar nenhum" (${catRef}), mas o script calcula ${contagemScript['hp-ref']} (7 parágrafos do .ref-list + 6 linhas da tabela de hierarquia).`, decisao: 'pendência do catálogo (FOUNDRY); não corrigido aqui' },
  { id: 'div-m17-09-referencias-contagem-script', tipo: 'fonte (script)×prosa', tema: 'O que conta como "referência"',
    leitura_a: { onde: `<script> hp-ref L${lineOfPill('hp-ref')}`, texto: regraPill('hp-ref') },
    leitura_b: { onde: 'section#ref', texto: 'A tabela é de categorias ("Categoria / Serve como fonte de / Não serve como fonte de"), não de referências; o .ref-list tem 8 blocos de fonte, cada um agregando várias publicações (8 + 6 categorias = 14). [verificação 2026-09-17: corrigido de "7 blocos"]' },
    evidencia: `O pill "referências" mostra ${contagemScript['hp-ref']}, somando categorias de hierarquia a blocos de fonte.`, decisao: 'não resolvida' },
  { id: 'div-m17-10-codigo-comentario-categorias-ex', tipo: 'fonte×código', tema: 'Categoria dos exercícios',
    leitura_a: { onde: 'section#ex div.dvs (4 divisores)', texto: B.blocosDaSecao('ex').filter((b) => b.tipo === 'divisor').map((b) => b.texto).join(' | ') },
    leitura_b: { onde: 'alexandria-modulo-17-content.ts (comentário "EXERCÍCIO")', texto: 'o markup NÃO marca cada exercício com a sua. Atribuir por posição seria inferência, não extração — então os 18 vão sem categoria' },
    evidencia: 'Os divisores .dvs precedem cada grupo (5+5+4+4, igual à prosa do lede). A categoria é estrutural (irmão anterior), não inferida. aparato.json a registra com essa origem.', decisao: 'código sem categoria; não corrigido aqui' },
  { id: 'div-m17-11-caso-parte-17', tipo: 'fonte×decisão', tema: 'Numeração de parte do caso Operação A',
    leitura_a: { onde: 'section#caso .sec-id', texto: secs.find((s) => s.id === 'caso').marcador_texto },
    leitura_b: { onde: 'decisoes/2026-09-16 P17', texto: 'Não existe "Parte 1". O título é Caso — Operação A.' },
    evidencia: 'P17 foi decidido sobre o M01, onde não há numeração de parte. No M17 a fonte numera literalmente "Parte 17" e o lede diz "Dezesseis partes construíram o perfil". A decisão P17 sobre título continua aplicável; o registro literal é "Parte 17".', decisao: 'nenhuma nesta camada' },
  { id: 'div-m17-12-duas-coisas-quatro-linhas', tipo: 'fonte×fonte (prosa×markup)', tema: 'Aula 06: "Duas coisas mudaram" antes de uma tabela de quatro linhas',
    leitura_a: { onde: `section#a06 p L${lineOf(a06p.start)}`, texto: T(a06p) },
    leitura_b: { onde: `section#a06 table L${lineOf(a06t.start)}`, texto: `${findAll(a06t, (n) => n.tag === 'tr').length - 1} linhas: ` + findAll(a06t, (n) => n.tag === 'tr').slice(1).map((tr) => T(findAll(tr, (k) => k.tag === 'td')[0])).join(' | ') },
    evidencia: 'Prosa anuncia 2 mudanças; a tabela tem 4 itens (o markup vence na contagem; a divergência fica registrada).', decisao: 'não resolvida' },
  { id: 'div-m17-13-barra-par3-empate', tipo: 'fonte×fonte (barra×prosa)', tema: 'Aula 02, exemplo estático 1: desenho "é a que menos explica" com a mesma largura de dotação',
    leitura_a: { onde: `section#a02 #par3-demo barra 1 L${par3bar1.linha_aprox}`, texto: par3bar1.segmentos.map((g) => `${g.rotulo} flex:${g.flex}`).join(' · ') },
    leitura_b: { onde: `section#a02 #par3-demo nota 1 L${par3nt1.linha_aprox}`, texto: (/A parcela de desenho é a que menos explica/.exec(par3nt1.texto) || [])[0] },
    evidencia: 'Na barra, dotação e desenho têm o mesmo peso (2); a prosa diz que desenho é a que menos explica. O próprio bloco declara as proporções "ilustrativas e ordinais". leitura_a é leitura do atributo style, não texto exibido.', decisao: 'não resolvida' },
  { id: 'div-m17-14-teto-maior-que-o-teto', tipo: 'fonte×fonte (prosa×números)', tema: '"a diferença entre o teto e a estimativa sem teto é maior que o próprio teto"',
    leitura_a: { onde: `section#a05 .box.rd L${lineOf(a05box.start)} (repetido no feedback da Q7 do quiz)`, texto: (/a diferença entre o teto e a estimativa sem teto é maior que o próprio teto/.exec(T(a05box)) || [])[0] },
    leitura_b: { onde: `section#a05 .cn5 item 3 L${lineOf(a05cn3.start)}`, texto: T(find(a05cn3, (n) => classIs(n, 'cn5-k'))) + ': ' + T(find(a05cn3, (n) => classIs(n, 'cn5-v'))) },
    evidencia: 'Com os números da própria fonte, US$ 554,72 − US$ 325 = US$ 229,72/MW-dia, que é MENOR que o teto de US$ 325. O Instrumento 07 diz "cerca de 70% acima" (554,72/325 = 1,707), o que confere. Aritmética desta extração; nenhuma leitura escolhida (P20: CONTENT QA).', decisao: 'não resolvida; verificação autoritativa pendente' },
];
function lineOfPill(id) { return L.lineOfScript(`set('${id}'`); }

const out = {
  grupo: 'modulo',
  modulo: 'M17',
  fonte: { arquivo: L.SRC, linhas_total: L.LINHAS_TOTAL, bytes: L.BYTES },
  gerado_por: 'extratores/m17_modulo.mjs (parser de DOM próprio em lib.mjs + blocos.mjs; literais do <script> avaliados com vm; nenhum texto de conteúdo digitado)',
  convencoes: {
    html: 'HTML inline literal da fonte, entidades preservadas, espaços colapsados.',
    texto: 'Mesmo conteúdo sem tags, entidades decodificadas, espaços colapsados.',
    linha_aprox: 'Linha (1-based) da abertura do elemento na fonte.',
    marcacao_p14: 'Anotação desta extração, inferida do verbo/tempo. Não é texto da fonte.',
    anotacao: 'Campos `nota`, `evidencia`, `nome_anotacao`, `decisao` e `leitura_b` marcados "medição desta extração" não são texto da fonte.',
  },
  identidade, tese, resultado_esperado, mapa, roteiro, criterio, laboratorios, voz, erros_comuns, tradutor,
  comparacao_codigo, codigo_divergencias, verificacoes_da_fonte, divergencias,
  desconhecidos_do_walker: B.DESCONHECIDOS,
  contagens: {
    secoes: secs.length, aulas: secs.filter((s) => s.eh_aula).length, aparatos: secs.filter((s) => !s.eh_aula).length,
    pills: pills.length, pills_com_valor_de_script: pills.filter((p) => { const b = find(p, (n) => n.tag === 'b'); return b && b.attrs.id; }).length,
    tese_blocos: teseBlocos.length, glosas: teseBlocos.filter((b) => b.tipo === 'glosa').length,
    sentidos_de_glosa: teseBlocos.filter((b) => b.tipo === 'glosa').reduce((a, b) => a + b.sentidos.length, 0),
    capacidades_em_blocos_de_produto: capacidades.filter((c) => !c.sem_frase_capacidade).length,
    blocos_de_produto_P7_total: capacidades.length,
    dimensoes_mapa: mapa.dimensoes.length, jurisdicoes_grade: J.valor.length, jurisdicoes_com_ficha: J.valor.filter((j) => j.core).length,
    criterios_literais: criterio.criterios.length,
    faixas_roteiro_oral: voz.roteiro_oral.faixas.length,
    erros_comuns: erros_comuns.itens.length, ponteiros_erro_em_aula: ponteiros.length,
    tres_niveis: tradutor.tres_niveis_ponteiros.length,
    instrumentos_em_aula: roteiro.filter((r) => r.tipo === 'aula').reduce((a, r) => a + r.instrumentos.length, 0),
    instrumentos_fora_de_aula: roteiro.filter((r) => r.tipo !== 'aula').reduce((a, r) => a + r.instrumentos.length, 0),
    divergencias_fonte_catalogo_codigo: divergencias.length, codigo_divergencias: codigo_divergencias.length, verificacoes_da_fonte: verificacoes_da_fonte.length,
  },
};
L.writeJSON('modulo.json', out);
console.log(JSON.stringify(out.contagens), 'desconhecidos', B.DESCONHECIDOS.length);
console.log('cobertura', cobertura.map((c) => c.aula_id.slice(-2) + ':' + c.pct).join(' '));
console.log('tabelas sem th', tabelasSemCabecalho.length, 'leads iguais', leadCmp.filter((x) => x.lead_codigo_igual_lede_fonte_texto).length, 'titulos iguais', comparacao_codigo.titulos.filter((t) => t.iguais).length);
console.log(JSON.stringify(conc));
console.log(divergencias.map((d) => d.id + ' A=' + (d.leitura_a.texto || 'NULL').slice(0, 60) + ' B=' + (d.leitura_b.texto || 'NULL').slice(0, 60)).join('\n'));
