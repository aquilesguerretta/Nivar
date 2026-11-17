// Extrator do grupo "modulo" do M12 → modulo.json
// Identidade, tese (§00), mapa (§MAP), roteiro (18 seções), critérios, voz (§Voz),
// erros comuns (§Erros), fichas, callouts de módulo, comparação com código e catálogo.
import fs from 'node:fs';
import {
  html, SRC, CATALOGO, ROOT, hx, texto, inline, origem, section, secIdOf, SECOES, wrapOf, childrenOf, bloco,
  scriptBlock, scriptVar, scriptFn, all, lineOf, pad, writeJson, importTs, fail, LINES,
} from './m12_lib.mjs';

const content = await importTs('alexandria-modulo-12-content.ts');
const trilhas = fs.readFileSync(`${ROOT}/src/lib/data/alexandria-trilhas.ts`, 'utf8');
const blocksTs = fs.readFileSync(`${ROOT}/src/lib/data/alexandria-blocks.ts`, 'utf8');
const badges = fs.readFileSync(`${ROOT}/src/lib/data/alexandria-badges.ts`, 'utf8');
const curriculo = fs.readFileSync(`${ROOT}/src/lib/data/alexandria-curriculo.ts`, 'utf8');
const catalogo = fs.readFileSync(CATALOGO, 'utf8');
const P = (sec) => childrenOf(wrapOf(sec)).map(bloco);

// ── identidade ───────────────────────────────────────────────
const heroStart = html.indexOf('<div class="hero">');
const kicker = html.match(/<div class="kicker">(.*?)<\/div>/);
const h1 = html.match(/<h1>(.*?)<\/h1>/);
const sub = html.match(/<p class="sub">([\s\S]*?)<\/p>/);
const pills = all(/<span class="pill">(.*?)<\/span>/g, heroStart, html.indexOf('<section id="tese">')).map(({ m, idx }) => ({
  html: m[1], texto: texto(m[1]), valor_em_negrito: (m[1].match(/<b>(.*?)<\/b>/) || [])[1] ?? null, origem: origem(idx, '.hero .pill-row .pill'),
}));
const footerStart = html.indexOf('<footer>');
const footerDivs = all(/<div(?: class="bd")?>([\s\S]*?)<\/div>/g, html.indexOf('<div class="wrap">', footerStart) + 18, html.indexOf('</footer>')).map(({ m, idx }) => ({ ...hx(m[1]), origem: origem(idx, 'footer .wrap > div') }));
const identidade = {
  id: 'm12-identidade', tipo: 'identidade', camada: 'fonte',
  kicker: { texto: kicker[1], origem: origem(kicker.index, '.hero .kicker') },
  titulo: { texto: h1[1], origem: origem(h1.index, '.hero h1') },
  subtitulo: { ...hx(sub[1]), origem: origem(sub.index, '.hero p.sub') },
  pills,
  horas: { texto: null, min: null, max: null, nota: 'A fonte não declara carga horária (zero "hora(s)" como duração no hero, no rodapé ou no §00). O único tempo declarado é o pill "roteiro oral 10 min" (§Voz). O código (alexandria-blocks.ts bloco-12) traz estimatedHoursMin 4 / estimatedHoursMax 5 SEM origem nesta fonte.' },
  data_de_verificacao: { texto: pills.find((p) => /verificado/.test(p.texto)).texto, nota: 'pill do hero; o §Ref e o rodapé repetem "2 de agosto de 2026"' },
  eixos: null,
  eixos_nota: 'A fonte não usa a palavra "eixo" para o módulo (o único "eixo" é do INST·07 e do andaime). Ela declara duas estruturas próprias, extraídas abaixo com o nome da fonte: "três vetores" (§00.2, div.chain) e "cinco frentes" (§MAP lede). Não promovidas a eixo.',
  rodape: { linhas: footerDivs, origem: origem(footerStart, 'footer') },
  marca_na_fonte: [kicker[1], ...footerDivs.filter((d) => /GridAlpha/.test(d.texto)).map((d) => d.texto)],
};

// ── §00 tese ─────────────────────────────────────────────────
const teseBlocos = P('tese');
const tese = {
  id: 'm12-tese', tipo: 'tese', camada: 'fonte', secao: secIdOf(section('tese')),
  blocos: teseBlocos.map((b, i) => ({ id: `m12-tese-${pad(i + 1)}`, ...b })),
  vetores: teseBlocos.find((b) => b.tipo === 'cadeia').itens,
  colunas: teseBlocos.find((b) => b.tipo === 'duas_colunas').colunas,
  frase_organizadora: teseBlocos.find((b) => b.tipo === 'box' && /frase que organiza/.test(b.rotulo)),
  nota: 'Os blocos box.gd "Onde isso entra no produto" são texto literal da fonte; pelo P7 não são exibidos ao learner. Citam "China Energy Watch", "Regulatory Radar" e a Alexandria como produto.',
};

// ── §MAP ─────────────────────────────────────────────────────
const mapBlocos = P('map');
const inst01 = scriptBlock('INST·01');
const renderItem = scriptFn(inst01, 'renderItem');
const pv = [...renderItem.codigo.matchAll(/'([A-ZÀ-Ú][^']*\?[^']*)'/g)].map((m) => m[1]);
if (pv.length !== 3) fail('3 perguntas de verificação');
const mapa = {
  id: 'm12-mapa', tipo: 'mapa_do_modulo', camada: 'fonte', secao: secIdOf(section('map')),
  blocos: mapBlocos.map((b, i) => ({ id: `m12-map-${pad(i + 1)}`, ...b })),
  frentes: { texto_lede: (mapBlocos.find((b) => b.tipo === 'lede').html.match(/— (protagonismo global.*?minerais críticos) —/) || [])[1] ?? null, rotulos_no_instrumento: scriptVar(inst01, 'FRENTES').valor.map((f) => f.n) },
  perguntas_por_aula: null,
  perguntas_por_aula_nota: 'Diferente do M01, o §MAP do M12 não tem tabela "aula × pergunta". Nenhuma aula recebe pergunta declarada no §MAP. As únicas perguntas do §MAP são as três "Pergunta de verificação" do INST·01, uma por vetor (abaixo), que são saída do instrumento.',
  perguntas_de_verificacao_do_tabuleiro: ['cap', 'reg', 'cad'].map((v, i) => ({ vetor: v, pergunta: pv[i], origem: origem(html.indexOf(pv[i]), 'script INST·01 renderItem') })),
  niveis_de_leitura: mapBlocos.find((b) => b.tipo === 'tres_niveis'),
};

// ── roteiro (18 seções) ──────────────────────────────────────
const codeAulas = content.MODULO_12_AULAS;
const roteiro = SECOES.map((sid, i) => {
  const s = section(sid); const x = secIdOf(s);
  const isAula = /^Aula \d\d$/.test(x.marcador);
  const bl = childrenOf(wrapOf(sid)).map(bloco);
  const r = {
    id: isAula ? `m12-roteiro-aula-${x.marcador.slice(5)}` : `m12-roteiro-${x.marcador.replace('§', '').toLowerCase()}`,
    tipo: isAula ? 'aula' : 'aparato', ordem_na_fonte: i + 1, id_html: sid,
    marcador: x.marcador, rotulo: x.rotulo, titulo: x.h2,
    origem: origem(s.start, `section#${sid} .sec-id`),
  };
  if (isAula) {
    const n = x.marcador.slice(5);
    const lede = bl.find((b) => b.tipo === 'lede');
    const c = codeAulas.find((a) => a.id === `aula-12-${n}`);
    Object.assign(r, {
      lede,
      subsecoes: bl.filter((b) => b.tipo === 'subtitulo').map((b) => ({ numero: b.numero, texto: b.texto, linha_aprox: b.origem.linha_aprox })),
      instrumentos: bl.filter((b) => b.tipo === 'instrumento').map((b) => b.id_fonte),
      fichas: bl.filter((b) => b.tipo === 'ficha').map((b) => ({ rotulo: b.rotulo, contador: b.contador })),
      callouts: bl.filter((b) => b.tipo === 'box').map((b) => ({ cor: b.cor, rotulo: b.rotulo, linha_aprox: b.origem.linha_aprox })),
      estruturas_especiais: bl.filter((b) => /^div\./.test(b.tipo)).map((b) => ({ tipo: b.tipo, linha_aprox: b.origem.linha_aprox })),
      contagem_blocos: bl.length,
      duracao: null, dificuldade: null, video: null,
      vinculos: { aula_id_codigo: `aula-12-${n}` },
      comparacao_codigo: c ? {
        title: c.title, subtitle: c.subtitle, title_igual_h2: c.title === x.h2.texto, subtitle_igual_rotulo: c.subtitle === x.rotulo,
        lead_igual_lede_texto: texto(content.MODULO_12_LEAD[c.id] || '') === lede.texto,
        lead_igual_lede_normalizado: texto(content.MODULO_12_LEAD[c.id] || '').replace(/\s+([,.;:])/g, '$1') === lede.texto.replace(/\s+([,.;:])/g, '$1'),
        illustrations_codigo: c.illustrations, instrumentos_codigo: c.instruments.map((z) => z.id),
        durationMinutes: c.durationMinutes, activities: c.activities.length, references: c.references.length,
      } : null,
    });
  }
  return r;
});
const aulas = roteiro.filter((r) => r.tipo === 'aula');
if (roteiro.length !== 18 || aulas.length !== 8) fail('contagem de seções');

// ── critérios (P14/P18) ─────────────────────────────────────
const quizBlk = scriptBlock('QUIZ');
const corrigir = scriptFn(quizBlk, 'corrigir');
const msgs = [...corrigir.codigo.matchAll(/\? '(.*?)'\s*\n\s*: '(.*?)'\)/g)][0];
const finalItens = P('final').find((b) => b.tipo === 'lista_ul').itens;
const tese4 = teseBlocos.filter((b, i) => i > teseBlocos.findIndex((x) => x.numero === '§00.4') && b.tipo === 'paragrafo');
const P14 = (t) => {
  const tags = ['autodeclarado_primeira_pessoa'];
  if (/trinta minutos|dois minutos|dez minutos|\d+ segundos|na hora|cronometrad/i.test(t)) tags.push('cronometrado');
  if (/conversa|voz alta|sustent|articul|respond|digo|descrevo|explicar|explique|Responda|devolv/i.test(t)) tags.push('producao_oral_ou_livre');
  if (/^Classifico|classific/i.test(t)) tags.push('classificacao');
  if (/^(Nunca|Não)/.test(t)) tags.push('conduta_negativa');
  return tags;
};
const criterio = {
  id: 'm12-criterio', tipo: 'criterio_do_modulo', camada: 'fonte',
  nota_p18: 'A fonte usa "critério" em quatro lugares com objetos diferentes: a conversa de trinta minutos (§00.4 e item 1 do §Final), o quiz 8/10 (hero, h2 e lede do §Quiz, script), o §Ex (critério "de conversa sustentada") e o §Voz (leitura cronometrada, sem limiar). Aqui o script do quiz É coerente com o limiar (acertos>=8), ao contrário do M01. Registrado, não reconciliado (P18: nenhum vira critério de aprovação).',
  criterios: [
    { id: 'm12-crit-conversa', secao: '§00.4', titulo: teseBlocos.find((b) => b.numero === '§00.4'), paragrafos: tese4.slice(0, 2),
      frase_criterio: (tese4[0].html.match(/<b>(sustentar trinta minutos.*?argumento)<\/b>/) || [])[1],
      marcacao_p14: ['cronometrado', 'producao_oral_ou_livre', 'nao_automatizavel'] },
    { id: 'm12-crit-quiz', secao: '§Quiz', pill_hero: pills.find((p) => /quiz/.test(p.texto)), titulo: secIdOf(section('quiz')).h2, lede: P('quiz').find((b) => b.tipo === 'lede'),
      limiar: { acertos: 8, total: 10, condicao_script: (corrigir.codigo.match(/acertos>=8/g) || []).length ? 'acertos>=8' : null, origem: { seletor: 'script QUIZ corrigir', trecho_inicial: 'sc.className=\'score show \'+(acertos>=8?\'pass\':\'fail\');', linha_aprox: lineOf(html.indexOf("acertos>=8?'pass'")) } },
      mensagens_do_script: [
        { condicao: 'acertos>=8', classe: 'pass', ...hx(msgs[1]), origem: origem(html.indexOf(msgs[1].slice(0, 40)), 'script QUIZ corrigir') },
        { condicao: 'acertos<8', classe: 'fail', ...hx(msgs[2]), origem: origem(html.indexOf(msgs[2].slice(0, 40)), 'script QUIZ corrigir') },
      ],
      marcacao_p14: ['automatizavel', 'P18_limiar_nao_e_evidencia'] },
    { id: 'm12-crit-ex', secao: '§Ex', lede: P('ex').find((b) => b.tipo === 'lede'), marcacao_p14: ['producao_oral_ou_livre', 'autoavaliado_sem_registro'],
      nota: 'Pede resposta em voz alta antes de abrir o gabarito (details/summary: revelação direta, sem registro de tentativa).' },
    { id: 'm12-crit-final', secao: '§Final', titulo: secIdOf(section('final')).h2, lede: P('final').find((b) => b.tipo === 'lede'),
      itens: finalItens.map((it, i) => ({ id: `m12-check-${pad(i + 1)}`, ordem: i + 1, ...it, marcacao_p14: P14(it.texto) })),
      nota: 'Lista estática ul.ck: o script não tem handler para o checklist (nenhum toggle, nenhuma persistência). marcacao_p14 é inferência desta extração pelo verbo/termos do item, não texto da fonte.' },
    { id: 'm12-crit-voz', secao: '§Voz', pill_hero: pills.find((p) => /roteiro oral/.test(p.texto)), lede: P('voz').find((b) => b.tipo === 'lede'), marcacao_p14: ['cronometrado', 'producao_oral_ou_livre', 'autoavaliado_sem_registro'], limiar: null },
  ],
};

// ── §Voz (roteiro oral) ──────────────────────────────────────
const vozBlocos = P('voz');
const voz = {
  id: 'm12-voz', tipo: 'roteiro_oral', camada: 'fonte', secao: secIdOf(section('voz')),
  lede: vozBlocos.find((b) => b.tipo === 'lede'),
  trechos: vozBlocos.filter((b) => b.tipo === 'box').map((b, i) => ({ id: `m12-voz-${pad(i + 1)}`, rotulo: b.rotulo, ...b.paragrafos[0], cor: b.cor })),
};
const principios = [
  { id: 'm12-principio-numeros-vivos', ...teseBlocos.find((b) => b.tipo === 'box' && b.cor === 'rd') },
  { id: 'm12-principio-rodape-neutralidade', ...footerDivs[2] },
  { id: 'm12-principio-ref-fonte-primaria', ...P('ref').find((b) => b.tipo === 'lede') },
  { id: 'm12-principio-caso-diagnostico', ...P('caso').find((b) => b.tipo === 'lede'), nota: 'princípio na última frase ("Como sempre: diagnóstico, nunca recomendação fechada, nunca valor específico, operação sempre anonimizada."); o corpo do caso está em aparato.json' },
  { id: 'm12-principio-taxonomia-ponteiro', tipo: 'ponteiro', ponteiro: 'Aula 08 §08.1 div.tax — taxonomia de nomeação em seis categorias (conteúdo de aula; extraída como bloco em roteiro/aula-08 e no INST·10)', origem: origem(html.indexOf('<div class="tax">'), 'section#a08 div.tax') },
];

// ── §Erros ───────────────────────────────────────────────────
const errosBl = P('erros');
const errosLista = errosBl.find((b) => b.tipo === 'lista_ol');
const errosItens = all(/<li><b>(.*?)<\/b> ([\s\S]*?)<\/li>/g, section('erros').start, section('erros').end).map(({ m, idx }, i) => ({
  id: `m12-erro-${pad(i + 1)}`, tipo: 'erro_comum', ordem: i + 1,
  erro: { html: m[1], texto: texto(m[1]) },
  correcao: { html: inline(m[2]), texto: texto(m[2]) },
  vinculo_aula: null,
  origem: origem(idx, 'section#erros ol.num-list > li'),
}));
const erros = { id: 'm12-erros-comuns', tipo: 'erros_comuns', camada: 'fonte', secao: secIdOf(section('erros')), itens: errosItens,
  nota: 'Cada item é <b>erro</b> + "Correção: …". Nenhum declara aula; o vínculo fica null (derivável por leitura, não declarado).' };
if (errosItens.length !== 20 || errosLista.itens.length !== 20) fail('20 erros');

// ── fichas e callouts (índice) ──────────────────────────────
const fichas = [], callouts = [];
for (const sid of SECOES) for (const b of P(sid)) {
  if (b.tipo === 'ficha') fichas.push({ id: `m12-ficha-${pad(fichas.length + 1)}`, secao_html: sid, ...b });
  if (b.tipo === 'box') callouts.push({ secao_html: sid, cor: b.cor, rotulo: b.rotulo, cita_gridalpha: /GridAlpha/.test(JSON.stringify(b)), linha_aprox: b.origem.linha_aprox });
}

// ── comparação com código e catálogo ─────────────────────────
const b12 = blocksTs.match(/\{ id: 'bloco-12'.*\}/)[0];
const catSec = catalogo.slice(catalogo.indexOf('## Módulo 12 —'), catalogo.indexOf('## Módulo 13 —'));
const catTitulo = catSec.match(/^## Módulo 12 — (.*)$/m)[1];
const catTabela = catalogo.match(/^\| 12 \| Geopolítica.*$/m)[0];
const catAulas = [...catSec.matchAll(/^\| (\d\d) \| (.*?) \| (.*?) \|$/gm)].map((m) => ({ n: m[1], aula: m[2], titulo: m[3] }));
const catInst = [...catSec.matchAll(/^\| Inst · (\d\d) \| (.*?) \|/gm)].map((m) => ({ id: m[1], nome: m[2] }));
const instNm = all(/<span class="nm">(.*?)<\/span>/g).map(({ m }) => m[1]);
const D = (id, escopo, tema, a, b, nota) => ({ id, escopo, tema, leitura_a: a, leitura_b: b, nota, decisao: 'não escolhida — registro (P5/P8/P18/P24)' });
const divergencias = [
  D('div-m-01', 'fonte × código', 'Carga horária', { onde: 'fonte (hero/rodapé)', texto: 'nenhuma declaração de horas' }, { onde: 'alexandria-blocks.ts bloco-12', texto: 'estimatedHoursMin: 4, estimatedHoursMax: 5' }, 'Número sem origem nesta fonte. O catálogo canônico também não declara horas para o M12.'),
  D('div-m-02', 'fonte × catálogo', 'Trilha', { onde: 'kicker L511', texto: kicker[1] }, { onde: 'catálogo', texto: (catSec.match(/\*\*Trilha\*\* · (.*?);/) || [])[1] }, 'O catálogo marca a trilha como "atribuída". O código tem track "brasil", level 2 e comenta que o M12 fecha a Trilha 2.'),
  D('div-m-03', 'fonte × catálogo', 'Nomes curtos dos instrumentos no catálogo', { onde: 'span.nm', texto: instNm.join(' | ') }, { onde: 'catálogo', texto: catInst.map((x) => x.nome).join(' | ') }, 'O catálogo encurta 8 dos 11 nomes: 02, 03, 04, 05, 06, 09 e 10 cortados no travessão; o 11 perde ", sem repetição"; 01, 07 e 08 iguais. Não é outro título; registrado para P24 (o catálogo governa nome global de módulo, não de instrumento).'),
  D('div-m-04', 'fonte × fonte', 'Critério em quatro formas', { onde: '§00.4 L671 e §Final item 1', texto: 'sustentar trinta minutos de conversa com um interlocutor cético sem repetir um argumento' }, { onde: 'hero pill, §Quiz h2/lede, script', texto: 'quiz 8/10 · "Dez questões, critério de oito acertos" · acertos>=8' }, 'P18: nenhum limiar vira aprovação. O §00.4 diz que o critério é "diferente em espécie" (oral) e o quiz chama de critério um limiar automático.'),
  D('div-m-05', 'fonte × decisão P17', 'Caso com número de parte', { onde: '§Caso sec-id L2293', texto: 'Operação A — Parte 12' }, { onde: 'decisões P17 (M01)', texto: 'Não existe "Parte 1"; título "Caso — Operação A"' }, 'Aqui a fonte numera a parte (12) e o lede cita "As onze partes anteriores" e "na Parte 11". A série de partes é afirmação da fonte que depende dos outros módulos; P17 foi decidida sobre o M01. Não reconciliado.'),
  D('div-m-06', 'fonte × P24', 'Marca GridAlpha na fonte', { onde: 'kicker L511, box.gd L1191, rodapé L3106/L3111', texto: 'Alexandria · GridAlpha · Módulo 12 · "o produto de acompanhamento regulatório da GridAlpha" · "currículo GridAlpha" · "GridAlpha — uma nova camada independente…"' }, { onde: 'P24', texto: 'GridAlpha não aparece ao learner; Alexandria (produto) / NIVAR (empresa)' }, `Texto literal mantido. ${callouts.filter((c) => c.cita_gridalpha).length} callout(s) citam GridAlpha; o código (MODULO_12_CORPO aula-12-02) ainda carrega "da GridAlpha" em nota.`),
  D('div-m-07', 'fonte × código', 'Gravuras', { onde: 'fonte', texto: `zero <img> (${(html.match(/<img\b/g) || []).length})` }, { onde: 'MODULO_12_AULAS.illustrations', texto: aulas.map((a) => `${a.marcador}: ${(a.comparacao_codigo.illustrations_codigo || []).join(',') || '—'}`).join(' · ') }, 'As gravuras são escolha do código por leitura de frase (prefixo geo-), não conteúdo da fonte.'),
  D('div-m-08', 'fonte × código', 'Lead das aulas com espaço antes de pontuação', { onde: 'p.lede', texto: 'tags inline (<em>/<b>) coladas à pontuação' }, { onde: 'MODULO_12_LEAD', texto: 'tags removidas deixando " ." / " ," (ex.: "matriz energética .")' }, `Igualdade exata do texto: ${aulas.filter((a) => a.comparacao_codigo.lead_igual_lede_texto).length}/8; igual após normalizar espaço antes de pontuação: ${aulas.filter((a) => a.comparacao_codigo.lead_igual_lede_normalizado).length}/8.`),
  D('div-m-09', 'fonte × fonte', 'INST·02 anuncia três campos e tem quatro', { onde: 'inst-intro L881', texto: 'Os três campos abaixo são entradas editáveis com fonte declarada' }, { onde: 'markup L888-909', texto: '4 div.field (elétrica, peso, fora da eletricidade, valor oficial)' }, 'O quarto campo é o "valor oficial" que o usuário informa; a prosa conta só os três parâmetros. Registrado.'),
  D('div-m-10', 'fonte × fonte', 'Termo em inglês na taxonomia', { onde: 'Aula 08 div.tax categoria 4 L2163', texto: 'Use como pesquisa privada; nunca published.' }, { onde: '§Lex lede L2847', texto: 'Onde houver jargão em inglês corrente no mercado, ele vem com glosa em português.' }, 'Provável resíduo de tradução ("published"). Mantido literal.'),
  D('div-m-11', 'fonte × fonte', 'Nomes próprios nas referências × taxonomia', { onde: '§Ref L3093-3095', texto: 'Ember — Global Electricity Review; Council on Foreign Relations; Wilson Center, Brazil Institute' }, { onde: 'Aula 08 taxonomia cat. 4/5 e INST·10 e6/e8', texto: 'pesquisa sem fins lucrativos: "Somente na seção de referências"; plataforma de dados concorrente: "Proibido em todo o ativo, inclusive em referência"' }, 'Compatível se os três forem categoria 5 (instituto/centro de estudos). A fonte não classifica cada um; registrado para content QA.'),
  D('div-m-12', 'fonte × fonte', 'Contador das fichas de campo fixo', { onde: 'fi-hd .tp (Aulas 03–05)', texto: fichas.slice(0, 4).map((f) => f.contador).join(' · ') }, { onde: 'fi-hd .tp (Aulas 06–07)', texto: fichas.slice(4).map((f) => f.contador).join(' · ') }, 'Duas séries com denominadores diferentes (4 fichas de parceiro, depois "5 de 6" e "6 de 6"); o hero declara "6 fichas de campo fixo". Não reconciliado.'),
  // Verificação (2026-09-17): div-m-14 REMOVIDA. O comentário "PRIMEIRO módulo da Trilha 3"
  // de alexandria-trilhas.ts fica ACIMA de 'bloco-13' e descreve o bloco-13 (convenção do
  // arquivo: comentário antes da entrada; cf. "SÉTIMO e último módulo da Trilha 2" acima de
  // 'bloco-12' e "SEGUNDO/TERCEIRO/QUARTO" acima de 14/15/16). Não havia divergência.
  D('div-m-13', 'fonte × fonte', 'Seis categorias × sete classes no INST·10', { onde: 'Aula 08 §08.1 e checklist item 27', texto: 'taxonomia de seis categorias' }, { onde: 'script INST·10 var CAT', texto: 'chaves 0–6; a 0 é "Fora da restrição" (órgão público brasileiro, nomeação livre)' }, 'A classe 0 não é categoria da taxonomia (é o que fica fora dela); registrado para a interface não contar sete.'),
];
divergencias.sort((x, y) => x.id.localeCompare(y.id));

const out = {
  grupo: 'modulo', modulo: 'm12', fonte: SRC, camada: 'fonte',
  gerado_por: 'extratores/m12_modulo.mjs (Node 24): walker de elementos de topo por seção + regex; nenhum texto de conteúdo digitado',
  convencoes: { html: 'fragmento literal, espaço em branco colapsado', texto: 'sem tags, entidades decodificadas', linha_aprox: 'linha 1-based do HTML-fonte', marcacao_p14: 'anotação desta extração, não texto da fonte' },
  contagens: {
    secoes: roteiro.length, aulas: aulas.length, aparatos: roteiro.length - aulas.length, pills_hero: pills.length,
    blocos_tese: tese.blocos.length, vetores: tese.vetores.length, frentes: mapa.frentes.rotulos_no_instrumento.length,
    perguntas_map_por_aula: 0, perguntas_verificacao_tabuleiro: mapa.perguntas_de_verificacao_do_tabuleiro.length,
    criterios_literais: criterio.criterios.length, itens_checklist: finalItens.length, mensagens_quiz: 2,
    trechos_voz: voz.trechos.length, erros_comuns: errosItens.length, fichas: fichas.length, callouts: callouts.length,
    callouts_onde_entra_no_produto: callouts.filter((c) => /Onde isso entra/.test(c.rotulo)).length,
    callouts_numeros_vivos: callouts.filter((c) => /Números vivos/.test(c.rotulo || '')).length,
    laboratorios: 0, tradutor: 0, niveis_de_leitura: 1,
  },
  divergencias, identidade, tese, resultado_esperado: null,
  resultado_esperado_nota: 'A fonte não tem bloco "Resultado esperado" nem lista de capacidades (zero h4/ul no §00). O mais próximo são os 28 itens em primeira pessoa do §Final ("Sustento…", "Articulo…") e o §00.4. Não promovidos a capacidade.',
  mapa, roteiro, criterio, laboratorios: null,
  laboratorios_nota: 'Não há "§ Lab" no M12 (zero ocorrência). O único instrumento fora de aula é o Inst · 01, dentro do §MAP (ver instrumentos.json).',
  voz, principios, erros_comuns: erros, fichas, callouts,
  tradutor: null, tradutor_nota: 'Não há "§ Map · Tradutor". O equivalente mais próximo é o bloco div.lv "As duas colunas do paradoxo, em três níveis" no §MAP (mapa.niveis_de_leitura).',
  comparacao: {
    catalogo: {
      arquivo: CATALOGO, titulo: catTitulo, titulo_igual_h1: catTitulo === h1[1], linha_tabela: catTabela,
      escala: (catSec.match(/\*\*Escala\*\* · ([\s\S]*?)\n\n/) || [])[1]?.replace(/\s+/g, ' '),
      aulas: catAulas.map((c) => { const a = aulas.find((x) => x.marcador === `Aula ${c.n}`); return { ...c, igual_rotulo: a?.rotulo === c.aula, igual_h2: a?.titulo.texto === c.titulo }; }),
      estado_extracao: (catalogo.match(/^\| 12 \| 11 \| 11 \| .*$/m) || [])[0],
    },
    codigo: {
      bloco_12: b12, aulas_por_bloco: (trilhas.match(/'bloco-12': (\d+)/) || [])[1],
      aulas_codigo: codeAulas.length, totalInModule: [...new Set(codeAulas.map((a) => a.totalInModule))],
      titulos: aulas.map((a) => ({ aula: a.marcador, ...a.comparacao_codigo, illustrations_codigo: undefined })),
      curriculo_importa: ['MODULO_12_AULAS', 'MODULO_12_CORPO', 'MODULO_12_LEAD'].filter((k) => curriculo.includes(k)),
      badges_citam_m12: /bloco-12|modulo-12|Geopol/.test(badges),
      ausentes_no_codigo: ['tese (§00)', 'mapa (§MAP) exceto INST·01', 'critérios', '§Caso', '§Erros', '§Quiz', '§Voz', '§Final (checklist)', '§Ref', '§Lex (glossário: 0 de 152)', 'pills do hero'],
    },
  },
};
writeJson('modulo.json', out);
console.log(JSON.stringify(out.contagens));
console.log(JSON.stringify(out.comparacao.catalogo.aulas.filter((x) => !x.igual_rotulo || !x.igual_h2)));
console.log(JSON.stringify(out.comparacao.codigo.titulos.map((t) => [t.aula, t.title_igual_h2, t.subtitle_igual_rotulo, t.lead_igual_lede_texto, t.lead_igual_lede_normalizado])));
console.log(criterio.criterios[0].frase_criterio, '|', mapa.frentes.texto_lede, '|', JSON.stringify(mapa.perguntas_de_verificacao_do_tabuleiro.map((p) => p.pergunta.slice(0, 30))));
console.log(JSON.stringify(criterio.criterios[3].itens.map((i) => i.marcacao_p14.join('+'))));
