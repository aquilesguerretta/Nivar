// Extração programática do grupo "modulo" do M06 (camada fonte). Nada de conteúdo é digitado.
import fs from 'node:fs';
import {
  html, LINES, fonteMeta, lineOf, decode, texto, inl, ini, origem, pad, kids, find, findAll,
  section, secId, blocos, cobertura, strings, codigo, writeJson, hoje, CATALOGO,
} from './lib.mjs';

const C = await codigo();
const norm = (s) => texto(s).normalize('NFC');

// ── identidade ───────────────────────────────────────────────
const lineIdx = (n) => html.split('\n').slice(0, n - 1).join('\n').length + 1;
const at = (n, re) => { const m = LINES[n - 1].match(re); if (!m) throw new Error(`L${n} ${re}`); return m[1]; };
const pills = [];
for (let n = 307; n <= 314; n++) {
  const inner = at(n, /<span class="pill">(.*)<\/span>/);
  pills.push({ id: `m06-pill-${pad(n - 306)}`, html: inner, texto: texto(inner), origem: { seletor: '.hero .pill-row > span.pill', trecho_inicial: texto(inner), linha_aprox: n } });
}
const cat = fs.readFileSync(CATALOGO, 'utf8');
const catH = cat.match(/^## Módulo 06 — (.*)$/m);
const catEscala = cat.slice(cat.indexOf('## Módulo 06')).match(/\*\*Escala\*\* · ([\s\S]*?)\n\n/);
const catLinha = cat.split('\n').findIndex((l) => l.startsWith('## Módulo 06')) + 1;
const blk = C.BLK.ALEXANDRIA_BLOCKS.find((b) => b.id === 'bloco-06');
const mod = C.TRI.ALEXANDRIA_MODULES.find((m) => m.id === 'modulo-06');
const titulo = at(304, /<h1>(.*)<\/h1>/);
const identidade = {
  id: 'm06-identidade',
  tipo: 'identidade',
  kicker: { texto: at(303, /<div class="kicker">(.*)<\/div>/), origem: { seletor: '.hero .kicker', trecho_inicial: at(303, /<div class="kicker">(.*)<\/div>/), linha_aprox: 303 } },
  titulo: { texto: titulo, origem: { seletor: '.hero h1', trecho_inicial: titulo, linha_aprox: 304 } },
  subtitulo: { html: at(305, /<p class="sub">(.*)<\/p>/), texto: texto(at(305, /<p class="sub">(.*)<\/p>/)), origem: { seletor: '.hero p.sub', trecho_inicial: ini(at(305, /<p class="sub">(.*)<\/p>/)), linha_aprox: 305 } },
  pills,
  pills_nota: 'Os 8 pills do hero declaram contagens da própria fonte (aulas, instrumentos, exercícios, questões, perguntas-relâmpago, termos, roteiro oral, horas). Conferidas contra o markup em `contagens.cruzamento`.',
  horas: {
    texto: texto(pills[7].html),
    min: null, max: null,
    nota: 'A fonte declara só a string "3–4h de estudo" (último pill do hero). Os números não foram convertidos aqui. O código (alexandria-blocks.ts, bloco-06) já traz estimatedHoursMin 3 / estimatedHoursMax 4; o catálogo canônico diz "3–4 h declaradas".',
    origem: pills[7].origem,
  },
  eixos: null,
  eixos_nota: 'A fonte não declara "eixos" do módulo. As 16 ocorrências de "eixo" são CSS, o eixo do SVG da linha do tempo, "três eixos" (objetivos de 2003, Aula 04 §4.1, L749) e a etimologia de AXIA (L975). O organizador declarado do módulo é a "régua dos seis" (§00 0.1, L330-337), registrada em `tese` como bloco `formula`, não promovida a eixo.',
  rodape: {
    linhas: [1513, 1514, 1515].map((n) => ({ texto: texto(LINES[n - 1]), origem: { seletor: 'footer .wrap > div', trecho_inicial: ini(LINES[n - 1]), linha_aprox: n } })),
  },
  cabecalho: null,
  cabecalho_nota: 'Não há cabeçalho textual: o topo da página é só `div.header-progress#prog` (barra de progresso de rolagem, L298).',
  catalogo_canonico: {
    arquivo: CATALOGO,
    titulo: catH[1],
    escala: catEscala ? catEscala[1].replace(/\s+/g, ' ') : null,
    linha_aprox: catLinha,
    titulo_igual_ao_h1: catH[1] === titulo,
    titulo_igual_ao_rodape: LINES[1512].includes(catH[1]),
  },
  codigo: {
    bloco: blk, modulo: { id: mod.id, trilhaId: mod.trilhaId, number: mod.number, totalInTrilha: mod.totalInTrilha, title: mod.title, totalAulas: mod.totalAulas },
    titulo_igual_ao_h1: blk.title === titulo && mod.title === titulo,
  },
};

// ── § 00 tese ────────────────────────────────────────────────
const S00 = section('tese');
const tese = {
  id: 'm06-tese', tipo: 'tese', marcador: secId(S00.wrap),
  titulo_secao: { html: inl(kids(S00.wrap).find((k) => k.tag === 'h2').inner), texto: texto(kids(S00.wrap).find((k) => k.tag === 'h2').inner) },
  blocos: blocos(S00.wrap, 'm06-tese', 'section#tese .wrap'),
};

// ── resultado esperado ───────────────────────────────────────
const resultado_esperado = {
  id: 'm06-resultado-esperado',
  itens: null,
  nota: 'A fonte do M06 não tem seção "Resultado esperado" nem lista de capacidades (varredura por "Resultado esperado": zero). O que mais se aproxima é (a) a caixa "Critério de domínio deste módulo" do §00 (L369-372) e (b) as 24 verificações do §Final (L1319-1351, em aparato.json). Nenhuma das duas é promovida a "capacidade" aqui.',
  candidatos: [
    { onde: '§00 .box.gd "Critério de domínio deste módulo"', linha_aprox: 369, ver: 'criterio.itens[m06-crit-01]' },
    { onde: '§Final ul.ck (24 li)', linha_aprox: 1324, ver: 'aparato.json → checklist_final' },
  ],
};

// ── § MAP ────────────────────────────────────────────────────
const SM = section('map');
const mapBlocos = blocos(SM.wrap, 'm06-map', 'section#map .wrap');
const cards = mapBlocos.find((b) => b.tipo === 'mapa_cards').cards;
const mapa = {
  id: 'm06-mapa', tipo: 'mapa_do_modulo', marcador: secId(SM.wrap),
  titulo_secao: { html: inl(kids(SM.wrap).find((k) => k.tag === 'h2').inner), texto: texto(kids(SM.wrap).find((k) => k.tag === 'h2').inner) },
  blocos: mapBlocos,
  perguntas_por_aula: null,
  perguntas_nota: 'O §MAP do M06 não traz pergunta por aula (diferente do M01). Traz 6 cartões com aula, título curto e descrição de período (`blocos[tipo=mapa_cards]`). Pergunta de abertura por aula, se necessária, é derivação da camada Alexandria (P3/P11), não extração.',
};

// ── roteiro: as 16 sections ─────────────────────────────────
const secRe = /<section id="([^"]+)">/g; let m; const roteiro = []; const aulasFonte = [];
while ((m = secRe.exec(html))) {
  const S = section(m[1]); const sid = secId(S.wrap);
  const h2 = kids(S.wrap).find((k) => k.tag === 'h2');
  const isAula = /^Aula \d\d$/.test(sid.marcador);
  const item = {
    id: isAula ? `m06-roteiro-aula-${sid.marcador.slice(5)}` : `m06-roteiro-${m[1]}`,
    tipo: isAula ? 'aula' : 'aparato',
    ordem_na_fonte: roteiro.length + 1,
    section_id: m[1],
    marcador: sid.marcador,
    rotulo_marcador: sid.rotulo,
    titulo: { html: inl(h2.inner), texto: texto(h2.inner) },
    origem: sid.origem,
  };
  if (isAula) {
    const bl = blocos(S.wrap, `m06-a${sid.marcador.slice(5)}`, `section#${m[1]} .wrap`);
    const lede = bl.find((b) => b.tipo === 'lede');
    item.aula_id_codigo = `aula-06-${sid.marcador.slice(5)}`;
    item.lede = { html: lede.html, texto: lede.texto, origem: lede.origem };
    item.subsecoes = bl.filter((b) => b.tipo === 'subtitulo').map((b) => ({ numero: b.numero, titulo: b.titulo, origem: b.origem }));
    item.instrumentos = bl.filter((b) => b.tipo === 'instrumento_ref').map((b) => ({ id_fonte: b.id_fonte, titulo: b.titulo, origem: b.origem }));
    item.tres_niveis = bl.filter((b) => b.tipo === 'tres_niveis_ref').map((b) => ({ titulo: b.titulo, origem: b.origem }));
    item.caixas = bl.filter((b) => b.tipo === 'caixa').map((b) => ({ rotulo: b.rotulo, cor_classe: b.cor_classe, origem: b.origem }));
    item.tabelas = bl.filter((b) => b.tipo === 'tabela').map((b) => ({ cabecalho: b.cabecalho, n_linhas: b.linhas.length, origem: b.origem }));
    item.contagem_blocos = bl.reduce((a, b) => ((a[b.tipo] = (a[b.tipo] || 0) + 1), a), {});
    aulasFonte.push(item);
  }
  roteiro.push(item);
}

// ── critérios (literais) ─────────────────────────────────────
const box00 = tese.blocos.find((b) => b.tipo === 'caixa' && b.rotulo === 'Critério de domínio deste módulo');
const SQ = section('quiz'); const quizLede = kids(SQ.wrap).find((k) => k.cls === 'lede');
const SV = section('voz'); const vozBlocos = blocos(SV.wrap, 'm06-voz', 'section#voz .wrap');
const SF = section('final'); const finalLede = kids(SF.wrap).find((k) => k.cls === 'lede'); const finalH2 = kids(SF.wrap).find((k) => k.tag === 'h2');
const scriptLine = (needle) => { const i = LINES.findIndex((l) => l.includes(needle)); if (i < 0) throw new Error(needle); return i + 1; };
const lPass = scriptLine("Critério de domínio atingido. Passe para o §Voz");
const lFail = scriptLine('Abaixo do critério de 8/10.');
const msg = (n) => LINES[n - 1].match(/textContent='(.*)';/)[1];
const v2 = vozBlocos.filter((b) => b.tipo === 'paragrafo')[1];
const v3 = vozBlocos.filter((b) => b.tipo === 'paragrafo')[2];
const treinar = vozBlocos.find((b) => b.tipo === 'caixa' && b.rotulo === 'Como treinar');
const criterio = {
  id: 'm06-criterio',
  nota: 'Critérios LITERAIS, cada um com a sua origem. Nenhum prevalece nesta camada (P18). `marcacao_p14` é anotação desta extração.',
  itens: [
    { id: 'm06-crit-01', onde: '§00 caixa "Critério de domínio deste módulo"', rotulo: box00.rotulo, html: box00.paragrafos[0].html, texto: box00.paragrafos[0].texto, origem: box00.origem, marcacao_p14: ['oral', 'cronometrado (dez minutos)', 'sem consulta'] },
    { id: 'm06-crit-02', onde: 'hero pill', html: pills[3].html, texto: pills[3].texto, origem: pills[3].origem, marcacao_p14: ['automatizavel (quiz)'] },
    { id: 'm06-crit-03', onde: '§Quiz lede', html: inl(quizLede.inner), texto: texto(quizLede.inner), origem: origem('section#quiz p.lede', quizLede.inner, quizLede.start), marcacao_p14: ['automatizavel (quiz)', 'sem consulta'],
      mensagens_script: [
        { condicao_literal: 'if(sc>=8)', classe: 'score show pass', texto: msg(lPass + 0), origem: { seletor: 'script QUIZ q-go click', trecho_inicial: msg(lPass).slice(0, 70), linha_aprox: lPass } },
        { condicao_literal: 'else', classe: 'score show fail', texto: msg(lFail), origem: { seletor: 'script QUIZ q-go click', trecho_inicial: msg(lFail).slice(0, 70), linha_aprox: lFail } },
      ] },
    { id: 'm06-crit-04', onde: '§Voz lede', html: vozBlocos[0].html, texto: vozBlocos[0].texto, origem: vozBlocos[0].origem, marcacao_p14: ['oral', 'cronometrado (dez minutos)'] },
    { id: 'm06-crit-05', onde: '§Voz V.2 (ataques de decisor)', html: v2.html, texto: v2.texto, origem: v2.origem, marcacao_p14: ['oral', 'cronometrado (noventa segundos por ataque)'] },
    { id: 'm06-crit-06', onde: '§Voz V.3 (roteiro)', html: v3.html, texto: v3.texto, origem: v3.origem, marcacao_p14: ['oral', 'gravado em áudio', 'sem consulta'] },
    { id: 'm06-crit-07', onde: '§Voz caixa "Como treinar" (teste final)', html: treinar.paragrafos[0].html, texto: treinar.paragrafos[0].texto, origem: treinar.origem, marcacao_p14: ['oral', 'cronometrado (dez e três minutos)', 'gravado em áudio'] },
    { id: 'm06-crit-08', onde: '§Final h2 + lede (24 verificações em aparato.json → checklist_final)', h2: texto(finalH2.inner), html: inl(finalLede.inner), texto: texto(finalLede.inner), origem: origem('section#final p.lede', finalLede.inner, finalLede.start), marcacao_p14: ['oral ou livre', 'sem consulta'] },
  ],
};

// ── laboratórios ─────────────────────────────────────────────
const laboratorios = {
  itens: null,
  nota: 'Não há "§ Lab" no M06 (varredura por "§Lab"/"§ Lab": zero). O único instrumento fora de aula é o Inst · 01 (linha do tempo), no §MAP — registrado em instrumentos.json com `secao: "§MAP"`.',
};

// ── voz e princípios ─────────────────────────────────────────
const SR = section('ref'); const refLede = kids(SR.wrap).find((k) => k.cls === 'lede');
const regra = tese.blocos.find((b) => b.tipo === 'caixa' && b.rotulo === 'Regra de leitura deste módulo');
const erroLede = kids(section('erros').wrap).find((k) => k.cls === 'lede');
const exLede = kids(section('ex').wrap).find((k) => k.cls === 'lede');
const numerosVivos = [];
for (const a of aulasFonte) for (const c of a.caixas) if (/Números vivos|números vivos/.test(c.rotulo)) numerosVivos.push({ aula: a.marcador, rotulo: c.rotulo, origem: c.origem });
const voz = {
  id: 'm06-voz',
  secao_voz: { marcador: secId(SV.wrap), titulo: texto(kids(SV.wrap).find((k) => k.tag === 'h2').inner), blocos: vozBlocos },
  principios: [
    { id: 'm06-principio-01', rotulo: regra.rotulo, html: regra.paragrafos[0].html, texto: regra.paragrafos[0].texto, origem: regra.origem },
    { id: 'm06-principio-02', rotulo: null, rotulo_desta_extracao: 'Hierarquia das fontes (§Ref lede)', html: inl(refLede.inner), texto: texto(refLede.inner), origem: origem('section#ref p.lede', refLede.inner, refLede.start) },
    { id: 'm06-principio-03', rotulo: null, rotulo_desta_extracao: 'Antes do gabarito (§Ex lede)', html: inl(exLede.inner), texto: texto(exLede.inner), origem: origem('section#ex p.lede', exLede.inner, exLede.start) },
    { id: 'm06-principio-04', rotulo: null, rotulo_desta_extracao: 'Rodapé (aviso do material)', linhas: identidade.rodape.linhas.slice(1), origem: identidade.rodape.linhas[1].origem },
  ],
  principios_nota: 'A fonte só rotula o principio-01 (tag da caixa). `rotulo_desta_extracao` é anotação; os textos são literais.',
  caixas_numeros_vivos: numerosVivos,
};

// ── erros comuns ─────────────────────────────────────────────
const SE = section('erros');
const erroBlocos = blocos(SE.wrap, 'm06-erros', 'section#erros .wrap');
const erroTab = erroBlocos.find((b) => b.tipo === 'tabela');
const erros_comuns = {
  id: 'm06-erros', marcador: secId(SE.wrap), titulo: texto(kids(SE.wrap).find((k) => k.tag === 'h2').inner),
  lede: erroBlocos.find((b) => b.tipo === 'lede'),
  cabecalho: erroTab.cabecalho,
  itens: erroTab.linhas.map((l, i) => ({ id: `m06-erro-${pad(i + 1)}`, o_que_se_diz: l.celulas[0].texto, correcao: l.celulas[1].texto, origem: l.origem })),
  caixa_final: erroBlocos.find((b) => b.tipo === 'caixa'),
  nas_aulas: aulasFonte.flatMap((a) => a.caixas.filter((c) => /erra/.test(c.rotulo)).map((c) => ({ aula: a.marcador, ...c }))),
};

// ── tradutor / três níveis / produto ─────────────────────────
const tradutor = {
  secao: null,
  nota: 'Não há seção "Tradutor" no M06. O análogo são os 6 blocos "três níveis" (Criança de 12 anos / Executivo / Especialista), um por aula, listados abaixo só como ponteiro (o texto pertence ao grupo de aula).',
  tres_niveis: aulasFonte.flatMap((a) => a.tres_niveis.map((t) => ({ aula: a.marcador, ...t }))),
};
const onde_entra_no_produto = {
  nota: 'Caixas "Onde isso entra no produto" (P7: fora da interface). Citam GridAlpha, Regulatory Radar, Brazil Pulse e Alexandria como produtos (P24). Só ponteiros.',
  itens: aulasFonte.flatMap((a) => a.caixas.filter((c) => c.rotulo === 'Onde isso entra no produto').map((c) => ({ aula: a.marcador, origem: c.origem }))),
};

// ── comparação com o código (P8) ─────────────────────────────
const aulasCod = C.C06.MODULO_06_AULAS;
const comp = aulasFonte.map((a) => {
  const c = aulasCod.find((x) => x.id === a.aula_id_codigo);
  const corpo = C.C06.MODULO_06_CORPO[a.aula_id_codigo] || [];
  const tits = corpo.filter((b) => b.kind === 'titulo');
  const lead = C.C06.MODULO_06_LEAD[a.aula_id_codigo];
  return {
    aula: a.marcador, aula_id_codigo: a.aula_id_codigo,
    titulo_fonte: a.titulo.texto, titulo_codigo: c?.title ?? null, titulo_igual: c?.title === a.titulo.texto,
    subtitulo_fonte: a.rotulo_marcador, subtitulo_codigo: c?.subtitle ?? null, subtitulo_igual: c?.subtitle === a.rotulo_marcador,
    lead_igual: lead ? norm(lead) === a.lede.texto : false,
    lead_diferenca: lead && norm(lead) !== a.lede.texto ? (() => { const x = norm(lead); let i = 0; while (x[i] === a.lede.texto[i]) i++; return { codigo: x.slice(Math.max(0, i - 25), i + 25), fonte: a.lede.texto.slice(Math.max(0, i - 25), i + 25) }; })() : null,
    subsecoes_fonte: a.subsecoes.length, subsecoes_codigo: tits.length,
    subsecoes_iguais: tits.length === a.subsecoes.length && tits.every((t, i) => t.numero === a.subsecoes[i].numero && t.texto === a.subsecoes[i].titulo),
    instrumentos_fonte: a.instrumentos.map((x) => x.id_fonte),
    instrumentos_codigo: (c?.instruments || []).map((x) => x.id),
    totalInModule: c?.totalInModule ?? null,
    track: c?.track ?? null,
    activities_codigo: (c?.activities || []).length,
    illustrations_codigo: c?.illustrations ?? null,
    video_codigo: c?.video ?? null,
  };
});
const cardTitles = cards.map((cd, i) => ({ aula: cd.aula, titulo_card: cd.titulo_card, h2: aulasFonte[i].titulo.texto, igual: cd.titulo_card === aulasFonte[i].titulo.texto, periodo_no_card: cd.descricao.split('.')[0], periodo_sec_id: aulasFonte[i].rotulo_marcador }));

// ── contagens e cruzamento (três sinais) ─────────────────────
const nAulasSecId = aulasFonte.length;
const h2Map = mapa.titulo_secao.texto; // "Seis aulas, cento e cinquenta anos"
const nInstMarkup = (html.match(/<div class="inst">/g) || []).length;
const nEx = (html.match(/<details><summary>\d\d · /g) || []).length;
const nTerm = (section('lex').wrap.inner.match(/class="term"/g) || []).length;
const nRelampago = (vozBlocos.find((b) => b.tipo === 'lista' && b.ordenada && b.classe === 'two-col') || {}).itens?.length;
const nFinal = (section('final').wrap.inner.match(/<li>/g) || []).length;
const nQuiz = (html.match(/\{q:'/g) || []).length;
const contagens = {
  secoes_no_roteiro: roteiro.length,
  aulas: nAulasSecId,
  aparatos: roteiro.length - nAulasSecId,
  subsecoes_por_aula: Object.fromEntries(aulasFonte.map((a) => [a.marcador, a.subsecoes.length])),
  instrumentos_markup: nInstMarkup,
  criterios_literais: criterio.itens.length,
  erros_comuns: erros_comuns.itens.length,
  perguntas_relampago: nRelampago,
  ataques_decisor: vozBlocos.find((b) => b.tipo === 'lista' && b.classe === 'num-list').itens.length,
  minutos_roteiro: vozBlocos.filter((b) => b.tipo === 'paragrafo' && /^<strong>Minuto \d+/.test(b.html)).length,
  tres_niveis: tradutor.tres_niveis.length,
  caixas_onde_entra_no_produto: onde_entra_no_produto.itens.length,
  map_cards: cards.length,
  pills: pills.length,
  cruzamento: [
    { sinal: 'aulas', prosa: `${h2Map} (§MAP h2, L380)`, pill: pills[0].texto, markup: `${nAulasSecId} sec-id "Aula NN"`, subsecoes: 'numeração 1.x…6.x presente', codigo: `${aulasCod.length} MODULO_06_AULAS; totalAulas ${mod.totalAulas}; totalInModule ${aulasCod[0].totalInModule}`, concordam: nAulasSecId === 6 && aulasCod.length === 6 && mod.totalAulas === 6 },
    { sinal: 'instrumentos', pill: pills[1].texto, markup: `${nInstMarkup} div.inst`, codigo: `${C.C06.INSTRUMENTOS_MODULO_06.length} de aula + ${C.C06.MODULO_06_INSTRUMENTOS.length} de módulo`, concordam: nInstMarkup === 8 },
    { sinal: 'exercícios', prosa: 'Dez exercícios com gabarito (§Ex h2)', pill: pills[2].texto, markup: `${nEx} details`, codigo: `${C.C06.MODULO_06_EXERCICIOS_SOLTOS.length} soltos`, concordam: nEx === 10 },
    { sinal: 'questões do quiz', prosa: 'Dez perguntas. (§Quiz h2)', pill: pills[3].texto, markup: `${nQuiz} objetos {q:} no script`, codigo: 'não portado', concordam: nQuiz === 10 },
    { sinal: 'perguntas-relâmpago', prosa: 'Trinta e seis perguntas sem travar (V.1)', pill: pills[4].texto, markup: `${nRelampago} li`, concordam: nRelampago === 36 },
    { sinal: 'termos', prosa: 'Noventa e nove termos (§Lex h2)', pill: pills[5].texto, markup: `${nTerm} span.term`, codigo: `${C.GLO.ALEXANDRIA_GLOSSARIO.filter((g) => g.id.startsWith('gl-m06-')).length} gl-m06-*`, concordam: nTerm === 99 },
    { sinal: 'verificações do §Final', prosa: 'Vinte e quatro verificações (§Final lede)', markup: `${nFinal} li`, concordam: nFinal === 24 },
    { sinal: 'erros', prosa: 'Dezesseis erros (§Erros h2)', markup: `${erros_comuns.itens.length} linhas`, concordam: erros_comuns.itens.length === 16 },
    { sinal: 'marcos da linha do tempo', prosa: 'quatorze marcos (Inst · 01 título; §MAP lede)', markup: 'array M do script (ver instrumentos.json)', codigo: `${C.C06.M06_INST01_MARCOS.length} M06_INST01_MARCOS`, concordam: C.C06.M06_INST01_MARCOS.length === 14 },
  ],
};

// ── divergências ─────────────────────────────────────────────
const divergencias = [
  { id: 'm06-div-01', tipo: 'fonte×fonte', tema: 'Título do cartão da Aula 03 no §MAP × h2 da aula',
    leitura_a: { onde: '§MAP a.map-card L406', texto: cardTitles[2].titulo_card }, leitura_b: { onde: 'Aula 03 h2 L615', texto: cardTitles[2].h2 },
    nota: 'O cartão encurta o título. As outras cinco coincidem.', decisao: 'não escolhida (P5); o código usa o h2' },
  { id: 'm06-div-02', tipo: 'fonte×fonte', tema: 'Critério de domínio em formas diferentes',
    leitura_a: { onde: '§00 caixa L371 e §Voz lede L1229', texto: 'contar a história em dez minutos, sem consultar (critério oral declarado como "o critério")' },
    leitura_b: { onde: 'pill L310, §Quiz lede L1214 e script L2335-2340', texto: 'acertar pelo menos 8 de 10 sem consultar ("O critério de domínio do módulo")' },
    leitura_c: { onde: '§Final h2/lede L1322-1323', texto: '"Você domina o Bloco 6 quando" + 24 verificações' },
    nota: 'A própria mensagem de aprovação do quiz diz "O critério oficial deste bloco é oral, não escrito", enquanto o lede do quiz chama 8/10 de "critério de domínio do módulo". Diferente do M01, aqui o script do quiz e a prosa concordam no limiar 8 (sc>=8).', decisao: 'não escolhida (P18)' },
  { id: 'm06-div-03', tipo: 'fonte×decisão', tema: '"Parte 6" do caso',
    leitura_a: { onde: '§Caso sec-id L1083', texto: 'Operação A — mineração em Minas Gerais · Parte 6' },
    leitura_b: { onde: 'decisões P17', texto: '"Não existe Parte 1" — título "Caso — Operação A"' },
    nota: 'No M06 a fonte numera literalmente a parte ("Parte 6") e o lede fala das "cinco partes anteriores" (física, tecnologia, preço, regulação), que vivem em outros módulos. Registro literal; a aplicação de P17 é da camada de produto.', decisao: 'registrada' },
  { id: 'm06-div-04', tipo: 'fonte×fonte', tema: 'Caso diz "cinco partes anteriores" e enumera quatro lentes',
    leitura_a: { onde: '§Caso lede L1085', texto: 'As cinco partes anteriores olharam a Operação A pela física, pela tecnologia, pelo preço e pela regulação.' },
    leitura_b: { onde: 'mesma frase', texto: 'quatro lentes enumeradas para cinco partes' },
    nota: 'Não há como reconciliar só com este arquivo.', decisao: 'não escolhida' },
  { id: 'm06-div-05', tipo: 'fonte×fonte', tema: 'Vocabulário "Bloco 6" × "Módulo 06"',
    leitura_a: { onde: 'kicker L303, rodapé L1513, lede §00 L324', texto: 'Módulo 06 / Módulo 05 / Módulo 02…' },
    leitura_b: { onde: 'L336, L348, L371, L668, L834, L866, L867, L1322, L1454, L1505', texto: 'Bloco 6 / Bloco 7 / Bloco 9' },
    nota: 'A fonte usa os dois nomes para a mesma unidade. "Bloco 9" (mecânica do MRE/GSF, L866) e "Bloco 7 em diante" (fonte de dado corrente, L1505) são referências cruzadas cuja correspondência com o catálogo atual (M07 Estrutura Institucional; M09 ACR e ACL) não é declarada.', decisao: 'registrada' },
  { id: 'm06-div-06', tipo: 'fonte×catálogo', tema: 'Trilha',
    leitura_a: { onde: 'fonte', texto: identidade.kicker.texto }, leitura_b: { onde: 'catálogo L' + catLinha, texto: 'Trilha · Setor Elétrico Brasileiro — atribuída' },
    nota: 'A fonte não declara trilha; o catálogo e o código (trilha-setor-eletrico-brasileiro, track "brasil") atribuem.', decisao: 'registrada' },
  { id: 'm06-div-07', tipo: 'fonte×produto (P24)', tema: 'Marca GridAlpha em texto voltado ao learner',
    leitura_a: { onde: `${(html.match(/GridAlpha/g) || []).length} ocorrências (kicker, rodapé, caixas "Onde isso entra no produto", §00 critério, lede A06, 6.3, V.2 ataque 5/6, §Final item 24, INST 01/08 no script)`, texto: 'GridAlpha' },
    leitura_b: { onde: 'decisões P24', texto: 'Alexandria (produto) / NIVAR (empresa)' },
    nota: 'Mantido literal. Inclui o critério de domínio (§00) e o item 24 do §Final, que pedem defender "a independência analítica da GridAlpha".', decisao: 'registrada; aplicação na camada de produto' },
  { id: 'm06-div-08', tipo: 'fonte×fonte', tema: 'Rótulo das eras no §MAP × sec-id das aulas',
    leitura_a: { onde: '§MAP cartões', texto: cardTitles.map((c) => c.periodo_no_card).join(' | ') },
    leitura_b: { onde: 'sec-id', texto: cardTitles.map((c) => c.periodo_sec_id).join(' | ') },
    nota: 'Concordam nos anos; a Aula 06 acrescenta "· síntese" no sec-id.', decisao: 'sem conflito material' },
  { id: 'm06-div-09', tipo: 'fonte×código', tema: 'Horas', leitura_a: { onde: 'pill L314', texto: identidade.horas.texto }, leitura_b: { onde: 'alexandria-blocks.ts', texto: `estimatedHoursMin ${blk.estimatedHoursMin} / estimatedHoursMax ${blk.estimatedHoursMax}` }, nota: 'Compatíveis; a conversão em números é do código.', decisao: 'sem conflito' },
  { id: 'm06-div-10', tipo: 'código×catálogo', tema: 'Estado de extração declarado no catálogo',
    leitura_a: { onde: 'catálogo "Estado da extração"', texto: '| 06 | 8 | 8 | completo |' },
    leitura_b: { onde: 'código', texto: 'quiz, caso, §Voz, §Erros, §Final e §Ref não estão em src/lib/data; INST 05 e INST 07 portados parcialmente (ver instrumentos.json)' },
    nota: '"completo" vale para a contagem de instrumentos, não para a mecânica nem para o aparato.', decisao: 'registrada' },
  { id: 'm06-div-11', tipo: 'código×fonte', tema: 'Exercícios sem enunciado próprio no código',
    leitura_a: { onde: '§Ex (10 details)', texto: 'Pergunta e Gabarito em dois <p> separados' },
    leitura_b: { onde: 'MODULO_06_EXERCICIOS_SOLTOS', texto: 'prompt: "" e config.gabarito = "Pergunta. … Gabarito. …" concatenados; points: 1 sem origem' },
    nota: 'Detalhe em aparato.json → exercicios.comparacao_codigo.', decisao: 'registrada' },
  { id: 'm06-div-13', tipo: 'código×fonte', tema: 'Lead das Aulas 04 e 05 com espaço inserido onde havia tag inline',
    leitura_a: { onde: 'lede A04 L746 / A05 L844', texto: comp.filter((c) => c.lead_diferenca).map((c) => `${c.aula}: …${c.lead_diferenca.fonte}…`).join(' | ') },
    leitura_b: { onde: 'MODULO_06_LEAD', texto: comp.filter((c) => c.lead_diferenca).map((c) => `${c.aula}: …${c.lead_diferenca.codigo}…`).join(' | ') },
    nota: 'O código removeu <em>/<strong> e deixou um espaço antes da pontuação ("reforma da reforma : manteve"; "muda de forma . Vira"). Só espaço; nenhuma palavra muda.', decisao: 'registrada (baixa)' },
  { id: 'm06-div-12', tipo: 'código×taxonomia', tema: 'Inst · 01 "nunca materializado"',
    leitura_a: { onde: 'docs/alexandria/instrument-taxonomy.md', texto: 'Linha do tempo, nunca materializado como Instrument' },
    leitura_b: { onde: 'alexandria-modulo-06-content.ts', texto: 'MODULO_06_INSTRUMENTOS[0] = m06-inst-01 (Wave 38), kind explorador' },
    nota: 'A taxonomia está desatualizada; também diz que o INST 07 tem "4 saídas", e o código tem zero.', decisao: 'pendência FOUNDRY' },
];

// ── lacunas ──────────────────────────────────────────────────
const lacunas = [
  'Resultado esperado/capacidades: ausente na fonte (null).',
  'Eixos do módulo: ausentes (null); a régua dos seis é o organizador declarado.',
  'Perguntas por aula no §MAP: ausentes (null).',
  '§ Lab: ausente (null).',
  'Tradutor: ausente como seção; 6 blocos "três níveis" como análogo.',
  'Horas min/max numéricas: não declaradas (só a string "3–4h de estudo").',
  'Duração, dificuldade e vídeo por aula: não declarados (zero <video>/<iframe>/youtube/.mp4). Zero <img> no HTML: as ilustrações "his-*" do código não vêm deste arquivo.',
  'Vínculo aula ↔ critério/verificação: a lede do §Final diz que "cada uma que falhar aponta uma aula específica", mas nenhum item declara a aula.',
];

// ── cobertura por token das seções de módulo ────────────────
const semInst = (w) => { let s = w.inner; for (const k of findAll(w, (x) => x.cls === 'inst' || x.cls === 'lv' || x.cls === 'map-grid')) s = s.replace(k.outer, ''); return s; };
const cob = {
  tese_00: cobertura(semInst(S00.wrap), strings(tese)),
  map: cobertura(semInst(SM.wrap), strings(mapa).concat(cards.flatMap((c) => [c.aula, c.titulo_card, c.descricao]))),
  erros: cobertura(SE.wrap.inner, strings(erros_comuns)),
  voz: cobertura(SV.wrap.inner, strings(voz.secao_voz)),
  nota: 'Denominador sem o markup de instrumento, de três níveis e dos cartões (protocolo §5), que estão em outros campos. As aulas não entram aqui: o roteiro só indexa as aulas (o texto integral é do grupo de aula).',
};

writeJson('modulo.json', {
  schema: 'alexandria-v2/extraction/modulo@1', modulo: 'M06', grupo: 'modulo', camada: 'fonte',
  fonte: fonteMeta, gerado_em: hoje,
  metodo: 'Node: parser de pilha sobre o HTML (elementos de primeiro nível de cada section .wrap), linha derivada do índice de caractere; comparação com o código por bundle esbuild (só leitura) de src/lib/data. Nenhum texto de conteúdo digitado.',
  convencoes: { html: 'fragmento literal, espaços colapsados, inline preservado', texto: 'sem tags, entidades decodificadas', linha_aprox: 'linha 1-based do início do elemento', null: 'ausência na fonte, sempre com nota', marcacao_p14: 'anotação desta extração' },
  identidade, tese, resultado_esperado, mapa, roteiro, criterio, laboratorios, voz, erros_comuns, tradutor, onde_entra_no_produto,
  comparacao_codigo: { aulas: comp, cartoes_map_x_h2: cardTitles },
  contagens, cobertura_por_token: cob, divergencias, lacunas,
});
