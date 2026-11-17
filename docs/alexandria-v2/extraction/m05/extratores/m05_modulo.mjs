// Extração do grupo "modulo" do M05 → modulo.json
// Uso: node m05_modulo.mjs   (lê a fonte e o código só para leitura)
import fs from 'node:fs';
import {
  L, ln, fail, FONTE, at, inner, find, findAll, secao, walk, txt, stripTags, collapse, origem,
  writeJson, buildCodigo, CATALOGO, HOJE, REPO,
} from './m05_lib.mjs';

const COD = buildCodigo();
const { MODULO_05_AULAS, MODULO_05_LEAD, MODULO_05_CORPO, INSTRUMENTOS_MODULO_05 } = await import(COD.content05);
const { ALEXANDRIA_BLOCKS } = await import(COD.blocks);
const { ALEXANDRIA_MODULES } = await import(COD.trilhas);

const ORDEM = ['tese', 'map', 'a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'caso', 'erros', 'ex', 'quiz', 'voz', 'final', 'lex', 'ref'];
const W = Object.fromEntries(ORDEM.map((id) => [id, walk(id)]));
const byTipo = (id, tipo) => W[id].blocos.filter((b) => b.tipo === tipo);
const one = (id, tipo) => { const r = byTipo(id, tipo); if (r.length !== 1) fail(`${id}/${tipo}: ${r.length}`); return r[0]; };

// ── P14: marcação inferida (não é texto da fonte) ──────────────────────
function marcaP14(t) {
  const tags = [];
  if (/\b(segundos|minutos?)\b/i.test(t)) tags.push('cronometrado');
  if (/voz alta|em voz|falar|grave|gravar|responda|responde|explica|explicar|defende|diz |nomeia|descreve|justifica|define|distingue|compara|lista|enuncie|desmonta|plota|aplica/i.test(t)) tags.push('producao_oral_ou_livre');
  if (/calcula|conta\b/i.test(t)) tags.push('calculo');
  if (/escreve/i.test(t)) tags.push('escrita');
  return tags;
}

// ── identidade ─────────────────────────────────────────────────────────
const nTitle = find(/<title>/);
const nKicker = find(/<div class="kicker">/);
const nH1 = find(/^\s*<h1>/);
const nSub = find(/<p class="sub">/);
const nPills = findAll(/<span class="pill">/);
const nFooter = find(/^<footer>/);
const pills = nPills.map((n, i) => {
  const h = at(n, /<span class="pill">(.*)<\/span>/);
  const m = h.match(/^<b>(\d+)<\/b> (.*)$/);
  return {
    id: `m05-hero-pill-${String(i + 1).padStart(2, '0')}`,
    ...txt(h),
    numero: m ? +m[1] : null,
    rotulo: m ? m[2] : null,
    nota: m ? undefined : 'Pílula sem <b> numérico; texto preservado inteiro.',
    origem: origem(n, '.hero .pill-row .pill'),
  };
});
const rodape = [nFooter + 2, nFooter + 3, nFooter + 4].map((n) => ({ ...txt(inner(n, 'div')), classe: /class="bd"/.test(ln(n)) ? 'bd' : null, origem: origem(n, 'footer .wrap > div') }));

// catálogo canônico (md) — trecho literal do cabeçalho do M05
const CAT = fs.readFileSync(CATALOGO, 'utf8').split('\n');
const catIni = CAT.findIndex((l) => l.startsWith('## Módulo 05 — '));
if (catIni < 0) fail('catálogo sem Módulo 05');
const catTitulo = CAT[catIni].replace(/^## Módulo 05 — /, '');
const catEscala = CAT.slice(catIni, catIni + 8).join(' ').match(/\*\*Escala\*\* · (.*?)(?=\s*$|\s*###)/)?.[1] ?? null;
const catTrilha = CAT.slice(catIni + 1, catIni + 6).join(' ').match(/\*\*Trilha\*\* · (.*?)\s+\*\*Escala/)?.[1] ?? null;
const bloco = ALEXANDRIA_BLOCKS.find((b) => b.id === 'bloco-05');
const modCod = ALEXANDRIA_MODULES.find((m) => m.id === 'modulo-05');

const tituloH1 = inner(nH1, 'h1');
const identidade = {
  id: 'm05-identidade',
  tipo: 'identidade',
  titulo_documento: { texto: inner(nTitle, 'title'), origem: origem(nTitle, 'head > title') },
  eyebrow: { ...txt(inner(nKicker, 'div')), origem: origem(nKicker, '.hero .kicker'), nota_p24: 'Contém a marca "GridAlpha" — P24: não exibir ao learner; manter só como proveniência.' },
  titulo: { ...txt(tituloH1), origem: origem(nH1, '.hero h1') },
  subtitulo: { ...txt(inner(nSub, 'p')), origem: origem(nSub, '.hero p.sub') },
  pilulas: pills,
  horas: {
    texto: pills.find((p) => /estudo/.test(p.texto))?.texto ?? null,
    min: null,
    max: null,
    nota: 'A fonte declara só a string "3–5h de estudo" (última pílula do hero). Os números não foram convertidos aqui; o código (alexandria-blocks.ts, bloco-05) já traz estimatedHoursMin 3 / estimatedHoursMax 5, e o catálogo canônico diz "3–5 h declaradas".',
    origem: pills.find((p) => /estudo/.test(p.texto))?.origem ?? null,
  },
  trilha_declarada: null,
  trilha_nota: 'A fonte não declara trilha nem nível (o kicker traz só "Alexandria · GridAlpha · Módulo 05"). O catálogo canônico marca a trilha como "atribuída".',
  eixos: null,
  eixos_nota: 'A fonte não declara eixos do MÓDULO. Os "dois eixos" que ela nomeia são do mapa de desenho de mercado (Aula 06 §6.1: "Eixo 1 — como o custo é revelado…", "Eixo 2 — como a capacidade firme é remunerada") e do INST·06; não são eixos do módulo. Não promovidos.',
  rodape,
  comparacao_catalogo: {
    catalogo_md: { arquivo: CATALOGO, titulo: catTitulo, trilha: catTrilha, escala: catEscala, linha_aprox: catIni + 1 },
    codigo_blocks: bloco ? { id: bloco.id, title: bloco.title, level: bloco.level, track: bloco.track, estimatedHoursMin: bloco.estimatedHoursMin, estimatedHoursMax: bloco.estimatedHoursMax, illustrationPrefix: bloco.illustrationPrefix, priority: bloco.priority } : null,
    codigo_modulo: modCod ?? null,
    titulo_fonte_igual_catalogo: stripTags(tituloH1) === catTitulo,
    titulo_fonte_igual_codigo: stripTags(tituloH1) === bloco?.title,
    nota_p24: 'P24: o catálogo canônico governa o nome. Aqui o h1, o <title> (sem o prefixo "Alexandria · Módulo 05 — "), o rodapé, o catálogo e o código coincidem em "Regulação e Desenho de Mercados" — nenhuma divergência de título.',
  },
  origem: origem(nKicker - 3, '.hero'),
};

// ── § 00 tese ──────────────────────────────────────────────────────────
const numerar = (prefixo, blocos) => blocos.map((b, i) => ({ id: `${prefixo}-b${String(i + 1).padStart(2, '0')}`, camada: 'fonte', ...b }));
const teseSec = one('tese', 'sec_id');
const tese = {
  id: 'm05-tese',
  tipo: 'tese',
  marcador: teseSec.marcador,
  rotulo_marcador: teseSec.rotulo,
  titulo_secao: one('tese', 'titulo_secao'),
  lead: one('tese', 'lede'),
  blocos: numerar('m05-tese', W.tese.blocos.filter((b) => !['sec_id', 'titulo_secao', 'lede'].includes(b.tipo))),
  nota: 'Seção §00 inteira, em ordem, bloco a bloco. Inclui a "régua das quatro perguntas" (div.form), a tabela falha × instrumento (§0.3), o box "Ideia central do módulo" e o box "Critério de domínio deste módulo" (este também aparece em criterio.criterios).',
  origem: origem(W.tese.ini, 'section#tese'),
};

// ── Resultado esperado ─────────────────────────────────────────────────
const resultado_esperado = {
  id: 'm05-resultado-esperado',
  tipo: 'capacidades',
  itens: null,
  nota: 'A fonte do M05 NÃO tem seção/h4 "Resultado esperado" (zero ocorrências de "Resultado esperado"/"Você consegue"). As listas mais próximas de capacidades são: (1) as 21 verificações do §Final ("Você domina o Bloco 5 quando"), extraídas em aparato.json → checklist_final; (2) o box "Critério de domínio deste módulo" do §00. Nenhuma foi promovida a "resultado esperado".',
  ponteiros: ['aparato.json#checklist_final', 'modulo.json#criterio.criterios[m05-crit-tese]'],
};
if (/Resultado esperado|Você consegue/.test(L.join('\n'))) fail('fonte tem "Resultado esperado" — revisar');

// ── § MAP ──────────────────────────────────────────────────────────────
const mapSec = one('map', 'sec_id');
const cards = one('map', 'mapa_cards').cards;
const aulaH2 = Object.fromEntries(['a01', 'a02', 'a03', 'a04', 'a05', 'a06'].map((id) => [id, one(id, 'titulo_secao').texto]));
const mapa = {
  id: 'm05-mapa',
  tipo: 'mapa_do_modulo',
  marcador: mapSec.marcador,
  rotulo_marcador: mapSec.rotulo,
  titulo_secao: one('map', 'titulo_secao'),
  lead: one('map', 'lede'),
  linhas: cards.map((c) => {
    const aid = c.href.slice(1);
    const num = aid.slice(1);
    return {
      id: `m05-map-aula-${num}`,
      tipo: 'cartao_da_aula',
      aula: num,
      rotulo_aula: c.rotulo_aula,
      titulo_card: c.titulo_card,
      descricao: c.descricao,
      pergunta: null,
      titulo_h2_da_aula: aulaH2[aid],
      titulo_card_igual_h2: c.titulo_card === aulaH2[aid],
      vinculos: { secao_html: c.href, aula_id_codigo: `aula-05-${num}` },
      origem: c.origem,
    };
  }),
  perguntas: null,
  perguntas_nota: 'O §MAP do M05 é uma grade de 6 cartões (n/t/d) com descrição, não uma tabela aula × pergunta como no M01. Nenhum cartão formula pergunta; a descrição (div.d) está em linhas[].descricao. A pergunta da aula, se necessária, é derivação da camada Alexandria (P3/P11).',
  origem: origem(W.map.ini, 'section#map'),
};

// ── roteiro ────────────────────────────────────────────────────────────
const codAula = Object.fromEntries(MODULO_05_AULAS.map((a) => [a.id, a]));
const roteiro = ORDEM.map((id, i) => {
  const s = one(id, 'sec_id');
  const isAula = /^Aula \d\d$/.test(s.marcador);
  const base = {
    id: isAula ? `m05-roteiro-aula-${s.marcador.slice(5)}` : `m05-roteiro-${id}`,
    tipo: isAula ? 'aula' : 'aparato',
    ordem_na_fonte: i + 1,
    secao_html: `#${id}`,
    marcador: s.marcador,
    rotulo_marcador: s.rotulo,
    titulo: one(id, 'titulo_secao'),
    linhas: [W[id].ini, W[id].fim],
    origem: s.origem,
  };
  if (!isAula) return base;
  const num = s.marcador.slice(5);
  const cid = `aula-05-${num}`;
  const ca = codAula[cid];
  const insts = byTipo(id, 'instrumento');
  const lede = one(id, 'lede');
  return {
    ...base,
    numero: +num,
    subsecoes: byTipo(id, 'titulo').map((t) => ({ numero: t.numero, titulo: t.texto, linha_aprox: t.origem.linha_aprox })),
    instrumentos: insts.map((b) => ({ id_fonte: b.id_fonte, titulo: b.titulo, linhas: b.linhas, ref: `instrumentos.json#m05-inst-${b.id_fonte.slice(-2)}` })),
    tres_niveis: byTipo(id, 'tres_niveis').map((b) => b.titulo),
    boxes: byTipo(id, 'box').map((b) => ({ classe: b.classe, rotulo: b.rotulo, linha_aprox: b.origem.linha_aprox })),
    contagem_blocos: Object.fromEntries(Object.entries(W[id].blocos.reduce((a, b) => { a[b.tipo] = (a[b.tipo] || 0) + 1; return a; }, {}))),
    comparacao_codigo: ca ? {
      aula_id: cid,
      title: ca.title, title_igual: ca.title === base.titulo.texto,
      subtitle: ca.subtitle, subtitle_igual: ca.subtitle === s.rotulo,
      totalInModule: ca.totalInModule,
      instrumentos_codigo: ca.instruments.map((x) => x.id),
      lead_igual: collapse(MODULO_05_LEAD[cid] ?? '') === lede.html,
      blocos_corpo_codigo: (MODULO_05_CORPO[cid] ?? []).length,
      durationMinutes: ca.durationMinutes, difficulty: ca.difficulty, video: ca.video,
    } : null,
  };
});
const aulasRot = roteiro.filter((r) => r.tipo === 'aula');
if (roteiro.length !== 16 || aulasRot.length !== 6) fail('esperava 16 seções / 6 aulas');

// ── critérios ──────────────────────────────────────────────────────────
const boxCrit = byTipo('tese', 'box').find((b) => b.rotulo === 'Critério de domínio deste módulo');
const pillQuiz = pills.find((p) => /critério/.test(p.texto));
const quizLede = one('quiz', 'lede');
const nScoreIf = find(/if\(sc>=8\)\{/, 1381);
const quizMsgs = [
  { condicao: 'sc>=8', classe: 'score show pass', mensagem: at(nScoreIf + 2, /textContent='(.*)';/), origem: origem(nScoreIf + 2, 'script QUIZ q-msg') },
  { condicao: 'else (sc<8)', classe: 'score show fail', mensagem: at(nScoreIf + 5, /textContent='(.*)';/), origem: origem(nScoreIf + 5, 'script QUIZ q-msg') },
];
const finalSec = one('final', 'sec_id');
const finalLede = one('final', 'lede');
const finalItens = one('final', 'lista').itens;
const exLede = one('ex', 'lede');
const vozW = W.voz.blocos;
const criterio = {
  id: 'm05-criterio',
  tipo: 'criterio_do_modulo',
  nota_p18: 'Várias formulações de "domínio"/"conclusão" coexistem na fonte (box do §00, pílula do hero, lede do §Quiz, mensagens do script do quiz, h2/lede do §Final com 21 verificações, lede do §Ex, §Voz). Registradas literalmente; nenhuma é "o" critério (P18). Nenhum limiar declara domínio no produto.',
  criterios: [
    { id: 'm05-crit-tese', tipo: 'criterio_dominio_qualitativo', secao: '§00', rotulo: boxCrit.rotulo, html: boxCrit.html, texto: boxCrit.texto, marcacao_p14: ['producao_oral_ou_livre', 'sem_consulta'], nota: 'Exige responder a régua "sem consultar nada" e "explicar, para um decisor cético" — produção oral/livre, sem limiar numérico.', origem: boxCrit.origem },
    { id: 'm05-crit-hero', tipo: 'criterio_quiz_resumo', secao: 'hero', html: pillQuiz.html, texto: pillQuiz.texto, limiar: { acertos: 8, total: 10, fonte_literal: '8/10' }, marcacao_p14: [], origem: pillQuiz.origem },
    { id: 'm05-crit-quiz', tipo: 'criterio_quiz', secao: '§Quiz', html: quizLede.html, texto: quizLede.texto, limiar: { acertos: 8, total: 10, fonte_literal: '8 de 10' }, mensagens_do_script: quizMsgs, marcacao_p14: ['sem_consulta', 'automatizavel_mas_P18_limiar_nao_e_evidencia'], nota: 'Aqui (diferente do M01) prosa, pílula e script concordam no 8/10. A mensagem de aprovação diz "Critério de domínio atingido" — P18: não exibir como domínio/aprovação.', origem: quizLede.origem },
    {
      id: 'm05-crit-final', tipo: 'criterio_conclusao', secao: '§Final', rotulo_marcador: finalSec.rotulo,
      titulo_secao: one('final', 'titulo_secao'), html: finalLede.html, texto: finalLede.texto,
      total_declarado_prosa: 'Vinte e uma', total_markup: finalItens.length,
      itens_ref: 'aparato.json#checklist_final',
      marcacao_p14: ['producao_oral_ou_livre', 'sem_consulta'],
      nota: 'Lista estática <ul class="ck"> sem script (não há toggle nem persistência no M05). "Responda sem travar e sem consultar" torna todos os 21 itens orais/livres; a marcação por item está em aparato.json.',
      origem: finalLede.origem,
    },
    { id: 'm05-crit-ex', tipo: 'criterio_exercicios', secao: '§Ex', html: exLede.html, texto: exLede.texto, limiar: null, marcacao_p14: ['producao_oral_ou_livre'], nota: 'Não há limiar numérico para os exercícios (diferente do "seis dos oito" do M01). O lede exige que metade saia "inteiro em voz alta". Os gabaritos são revelados por <details> (sem tentativa registrada — gate C7).', origem: exLede.origem },
    {
      id: 'm05-crit-voz', tipo: 'criterio_oral', secao: '§Voz', titulo_secao: one('voz', 'titulo_secao'), html: one('voz', 'lede').html, texto: one('voz', 'lede').texto,
      partes: vozW.filter((b) => b.tipo === 'titulo').map((t) => {
        const idx = vozW.indexOf(t);
        const p = vozW[idx + 1];
        return { numero: t.numero, titulo: t.texto, instrucao: p && p.tipo === 'paragrafo' && t.numero !== 'V.3' ? { html: p.html, texto: p.texto, origem: p.origem } : null, marcacao_p14: t.numero === 'V.1' ? ['oral', 'cronometrado (hesitação > 3 segundos marca lacuna)'] : t.numero === 'V.2' ? ['oral', 'cronometrado (90 segundos por ataque)'] : ['oral', 'cronometrado (5 minutos)', 'gravado'] };
      }),
      marcacao_p14: ['oral', 'cronometrado'],
      nota: 'Conteúdo completo do §Voz em voz_dominio_oral.',
      origem: one('voz', 'sec_id').origem,
    },
  ],
};

// ── laboratórios / tradutor ────────────────────────────────────────────
const laboratorios = { itens: null, nota: 'A fonte do M05 não tem seção "§ Lab" nem instrumento fora de aula (zero "LAB", zero "§ Lab"/"§Lab"). Os 6 instrumentos vivem dentro das aulas 01–06 (ver instrumentos.json).' };
const tradutor = { itens: null, nota: 'A fonte do M05 não tem "Tradutor" nem "§ Map" (minúsculo) como no M01; o único mapa é o §MAP (percurso).' };
if (/§ ?Lab|LAB ?·|Tradutor/.test(L.join('\n'))) fail('fonte tem Lab/Tradutor — revisar');

// ── voz / princípios editoriais ────────────────────────────────────────
const teseBlocos = W.tese.blocos;
const regua = teseBlocos.find((b) => b.tipo === 'formula');
const reguaOrdem = teseBlocos[teseBlocos.indexOf(regua) + 1];
const boxBy = (sec, rot) => { const b = byTipo(sec, 'box').find((x) => x.rotulo === rot); if (!b) fail(`box ${sec}/${rot}`); return b; };
const voz = [
  { id: 'm05-voz-regua', tipo: 'principio_editorial', rotulo: teseBlocos.find((b) => b.tipo === 'titulo' && b.numero === '0.1').texto, formula: regua, complemento: reguaOrdem, nota: 'Ferramenta transversal do módulo ("A régua do Bloco 5"); a Aula 06 §6.5 a desdobra em nove perguntas.' },
  { id: 'm05-voz-regra-oral', tipo: 'principio_editorial', rotulo: null, ...one('voz', 'lede') },
  { id: 'm05-voz-como-treinar', tipo: 'principio_editorial', ...boxBy('voz', 'Como treinar') },
  { id: 'm05-voz-hierarquia-fontes', tipo: 'principio_editorial', rotulo: null, ...one('ref', 'lede') },
  { id: 'm05-voz-vocabulario', tipo: 'principio_editorial', rotulo: null, ...one('lex', 'lede') },
  { id: 'm05-voz-erros', tipo: 'principio_editorial', rotulo: null, ...one('erros', 'lede') },
  { id: 'm05-voz-disciplina-caso', tipo: 'principio_editorial', ...boxBy('caso', 'Disciplina do caso'), nota: 'Vive no §Caso; incluído como princípio de linguagem (achado = "oportunidade potencial… a ser validada").' },
  { id: 'm05-voz-numeros-vivos', tipo: 'principio_editorial', ...boxBy('a05', 'Números vivos · verificar na fonte antes de uso externo'), nota: 'Vive na Aula 05; declara que os percentuais do módulo são hipotéticos.' },
  { id: 'm05-voz-pergunta-cetica', tipo: 'exemplo_de_voz', ...boxBy('a04', 'A pergunta cética que você precisa responder'), nota: 'Vive na Aula 04; cita "GridAlpha" (P24).' },
  { id: 'm05-voz-rodape', tipo: 'principio_editorial', rotulo: null, linhas: rodape.slice(1), nota: 'Rodapé: disclaimer de uso; a linha 1 cita "GridAlpha" (P24).' },
];

// ── § Voz completo ─────────────────────────────────────────────────────
const vozListas = byTipo('voz', 'lista');
const v3ini = vozW.findIndex((b) => b.tipo === 'titulo' && b.numero === 'V.3');
const voz_dominio_oral = {
  id: 'm05-voz-oral',
  tipo: 'dominio_oral',
  marcador: one('voz', 'sec_id').marcador,
  rotulo_marcador: one('voz', 'sec_id').rotulo,
  titulo_secao: one('voz', 'titulo_secao'),
  lead: one('voz', 'lede'),
  perguntas_relampago: { declarado_prosa: 'trinta e quatro', total_markup: vozListas[0].itens.length, itens: vozListas[0].itens.map((it) => ({ id: `m05-voz-v1-${String(it.ordem).padStart(2, '0')}`, ...it, marcacao_p14: ['oral', 'cronometrado'] })) },
  ataques_decisor_cetico: { declarado_prosa: 'Seis', total_markup: vozListas[1].itens.length, itens: vozListas[1].itens.map((it) => ({ id: `m05-voz-v2-${String(it.ordem).padStart(2, '0')}`, ...it, marcacao_p14: ['oral', 'cronometrado (90 s)'] })) },
  roteiro_cinco_minutos: { paragrafos: vozW.slice(v3ini + 1).filter((b) => b.tipo === 'paragrafo').map((p, i) => ({ id: `m05-voz-v3-min${i + 1}`, ...p })), total: vozW.slice(v3ini + 1).filter((b) => b.tipo === 'paragrafo').length },
  box: boxBy('voz', 'Como treinar'),
  blocos_em_ordem: numerar('m05-voz', vozW.filter((b) => !['sec_id', 'titulo_secao', 'lede'].includes(b.tipo)).map((b) => (b.tipo === 'lista' ? { tipo: 'lista', classe: b.classe, total_itens: b.itens.length, origem: b.origem } : b))),
  marcacao_p14: ['oral', 'cronometrado', 'gravado'],
  nota: 'V.2 declara "Duas delas são sobre a própria GridAlpha" (ataques 2 e 4 citam analistas independentes/GridAlpha) — P24.',
  origem: origem(W.voz.ini, 'section#voz'),
};

// ── erros comuns ───────────────────────────────────────────────────────
const errosLista = one('erros', 'lista');
const erros_comuns = {
  id: 'm05-erros',
  tipo: 'erros_comuns',
  marcador: one('erros', 'sec_id').marcador,
  rotulo_marcador: one('erros', 'sec_id').rotulo,
  titulo_secao: one('erros', 'titulo_secao'),
  lead: one('erros', 'lede'),
  declarado_prosa: 'Doze',
  total_markup: errosLista.itens.length,
  itens: errosLista.itens.map((it) => ({ id: `m05-erro-${String(it.ordem).padStart(2, '0')}`, tipo: 'erro_comum', ordem: it.ordem, frase_errada_html: it.cabeca_html, frase_errada_texto: it.cabeca_texto, correcao_html: it.corpo_html, correcao_texto: it.corpo_texto, html: it.html, origem: it.origem, vinculos: { aula: null, nota: 'A fonte não liga erro a aula.' } })),
  codigo_atual: 'Não extraído: nenhum arquivo de src/lib/data traz os 12 erros do §Erros do M05.',
  origem: origem(W.erros.ini, 'section#erros'),
};

// ── três níveis (ponteiros; conteúdo é de aula) ────────────────────────
const tres_niveis = ['a01', 'a02', 'a03', 'a04', 'a05', 'a06'].flatMap((id) => byTipo(id, 'tres_niveis').map((b) => {
  const cid = `aula-05-${id.slice(1)}`;
  const nota = (MODULO_05_CORPO[cid] ?? []).find((x) => x.kind === 'nota' && x.label === b.titulo);
  const html = nota?.html ?? '';
  return {
    id: `m05-lv-${id}`,
    aula: id.slice(1),
    titulo: b.titulo,
    abas: b.abas,
    paineis: b.paineis,
    comparacao_codigo: {
      presente: !!nota,
      paineis_presentes: b.paineis.map((p) => html.includes(p.html)),
      prefixo_codigo: html.slice(0, html.indexOf('</b>') + 4),
      nota: 'O código porta o explicador como nota com as três abas fundidas em "<b>Criança de 12 anos Executivo Especialista</b>" e só o painel 0; os painéis Executivo e Especialista estão ausentes.',
    },
    origem: b.origem,
  };
}));

// ── blocos de produto (P7) ─────────────────────────────────────────────
const blocos_de_produto = ORDEM.flatMap((id) => byTipo(id, 'box').filter((b) => b.rotulo === 'Onde isso entra no produto').map((b) => ({ id: `m05-produto-${id}`, secao: `#${id}`, ...b })));
const aula46 = byTipo('a04', 'titulo').find((t) => t.numero === '4.6');

// ── marca (P24) ────────────────────────────────────────────────────────
const nBody = find(/^<body>/);
const marca = findAll(/GridAlpha/, nBody, nFooter + 5).map((n) => ({ linha_aprox: n, trecho: collapse(ln(n)).slice(0, 120) }));

// ── divergências do grupo ──────────────────────────────────────────────
const divergencias = [
  {
    id: 'div-m05-mod-01', tema: 'Título do cartão da Aula 06 no §MAP × h2 da aula', tipo: 'fonte_x_fonte',
    leitura_a: { onde: `§MAP card (L${mapa.linhas[5].origem.linha_aprox})`, literal: mapa.linhas[5].titulo_card },
    leitura_b: { onde: `section#a06 h2 (L${one('a06', 'titulo_secao').origem.linha_aprox})`, literal: aulaH2.a06 },
    nota: 'O código usa o h2 ("Desenho de mercado comparado"), como o catálogo canônico. Os outros 5 cartões são idênticos ao h2.',
    decisao: 'Nenhuma na camada fonte.',
  },
  {
    id: 'div-m05-mod-02', tema: '"Módulo 05" × "Bloco 5"', tipo: 'fonte_x_fonte',
    leitura_a: { onde: 'kicker, <title>, rodapé', literal: 'Módulo 05' },
    leitura_b: { onde: '§00 form .note (L287), §00 box gd (L325), §Final h2 (L1222). Em minúscula, sem número ("este bloco", "do bloco", "Neste bloco"): §00 L282, Aula 05 lede L761, §Erros lede L1044, §Voz lede L1148, §Voz box L1213, §Lex lede L1255, §Ref L1358 (verificação independente, 2026-09-17)', literal: 'Bloco 5' },
    nota: `A fonte chama o próprio módulo de "Bloco 5" (${findAll(/Bloco 5/).length} linhas) e remete a "Bloco 6" e "Bloco 9" como outros módulos. O produto usa "Módulo".`,
    decisao: 'P24 (catálogo governa nomes); registrar, não reescrever na fonte.',
  },
  {
    id: 'div-m05-mod-03', tema: 'Critério de domínio em várias formas', tipo: 'fonte_x_fonte',
    leituras: criterio.criterios.map((c) => ({ id: c.id, onde: `${c.secao} (L${c.origem.linha_aprox})`, literal: c.texto })),
    nota: 'Formas qualitativa (§00), numérica 8/10 (hero, §Quiz, script), 21 verificações orais (§Final), voz alta (§Ex, §Voz). A mensagem ≥8 do script diz "Critério de domínio atingido" e manda seguir para o §Voz; a mensagem <8 proíbe avançar para o §Voz.',
    decisao: 'P18: nenhuma forma é o critério; nenhum limiar declara domínio.',
  },
  {
    id: 'div-m05-mod-04', tema: 'Marca GridAlpha em texto voltado ao learner', tipo: 'fonte_x_decisao',
    ocorrencias: marca,
    nota: 'Inclui: o kicker (L255); o h3 de aula "4.6 Onde isso vira a tese da GridAlpha" (L721) e dois parágrafos da §4.6 (L722, L728); o box cético da Aula 04 (L732); o box de produto da Aula 06 (L996); a instrução de V.2 no §Voz (L1190, "Duas delas são sobre a própria GridAlpha") e um ataque de V.2 (L1195); um item do §Final (L1242); o rodapé (L1376).',
    decisao: 'P24: GridAlpha não é exibida ao learner; o texto da fonte fica intacto aqui.',
  },
  {
    id: 'div-m05-mod-05', tema: 'Blocos "Onde isso entra no produto"', tipo: 'fonte_x_decisao',
    total: blocos_de_produto.length,
    nota: `${blocos_de_produto.length} boxes (6 aulas + §Caso), mais a subseção de aula ${aula46.numero} "${aula46.texto}" (L${aula46.origem.linha_aprox}), que é argumento de posicionamento de produto dentro da aula. O código (MODULO_05_CORPO) porta os 6 boxes de aula como nota tom "gold" sem rótulo.`,
    decisao: 'P7: blocos de produto fora da interface; aqui ficam registrados literalmente.',
  },
  {
    id: 'div-m05-mod-06', tema: 'Explicador "três níveis" portado pela metade', tipo: 'fonte_x_codigo', severidade: 'media',
    nota: `Em ${tres_niveis.length} explicadores, o código tem ${tres_niveis.filter((t) => t.comparacao_codigo.paineis_presentes[0]).length} painéis "Criança de 12 anos" e ${tres_niveis.filter((t) => t.comparacao_codigo.paineis_presentes[1] || t.comparacao_codigo.paineis_presentes[2]).length} painéis Executivo/Especialista; os rótulos das abas viram um <b> único.`,
    decisao: 'Registrar para a camada de produto (perda de texto).',
  },
  {
    id: 'div-m05-mod-07', tema: 'Rótulos de box perdidos no código', tipo: 'fonte_x_codigo', severidade: 'baixa',
    itens: ['a01', 'a02', 'a03', 'a04', 'a05', 'a06'].flatMap((id) => byTipo(id, 'box').map((b) => {
      const cid = `aula-05-${id.slice(1)}`;
      const nota = (MODULO_05_CORPO[cid] ?? []).find((x) => x.kind === 'nota' && collapse(x.html) === b.html);
      return { aula: id.slice(1), classe: b.classe, rotulo_fonte: b.rotulo, label_codigo: nota ? nota.label : '(ausente)', tom_codigo: nota ? nota.tom : null };
    })),
    nota: 'O <span class="tag"> de cada box não é portado (label null); box rd e box cy viram tom "neutro".',
    decisao: 'Registrar.',
  },
];

// ── código: comentário de trilhas e badges (só leitura) ────────────────
const TRILHAS_SRC = fs.readFileSync(`${REPO}/src/lib/data/alexandria-trilhas.ts`, 'utf8');
const trilhasComentario = collapse(TRILHAS_SRC.replace(/\r?\n\s*\*\s?/g, ' ')).match(/do 05 desenha um mapa[^.]*\./)?.[0] ?? null;
const trilhasLinha = TRILHAS_SRC.split('\n').findIndex((l) => l.includes('do 05 desenha')) + 1;
const BADGES_SRC = fs.readFileSync(`${REPO}/src/lib/data/alexandria-badges.ts`, 'utf8');
const badgesM05 = /modulo-05|bloco-05|m05|Módulo 05/.test(BADGES_SRC);
divergencias.push({
  id: 'div-m05-mod-08', tema: 'Comentário de alexandria-trilhas.ts afirma títulos 1:1 no §MAP', tipo: 'fonte_x_codigo', severidade: 'baixa',
  codigo_literal: trilhasComentario, codigo_linha_aprox: trilhasLinha,
  nota: `O comentário diz que os seis títulos do mapa "batem 1:1"; na fonte o cartão da Aula 06 ("${mapa.linhas[5].titulo_card}") difere do h2 ("${aulaH2.a06}") — ver div-m05-mod-01. A contagem (6) do comentário confere.`,
  decisao: 'Registrar (comentário, sem efeito em tela).',
});
divergencias.push({
  id: 'div-m05-mod-09', tema: 'alexandria-badges.ts não referencia o M05', tipo: 'lacuna_codigo', severidade: 'informativa',
  medido: { referencia_m05_em_badges: badgesM05 },
  nota: 'A fonte do M05 não define insígnia/badge; o código também não. Nada a comparar.',
  decisao: 'Registrar.',
});

const out = {
  schema: 'alexandria-v2/extraction/modulo@1',
  modulo: '05',
  grupo: 'modulo',
  fonte: FONTE,
  gerado_em: HOJE,
  gerado_por: 'docs/alexandria-v2/extraction/m05/extratores/m05_modulo.mjs',
  metodo: 'Percorredor de blocos por <section id> (m05_lib.walk) que falha em linha não classificada; texto por regex na linha, sem digitação. Código lido por esbuild (bundle temporário) só para comparar.',
  convencoes: {
    html: 'HTML inline preservado, espaços colapsados.',
    texto: 'Tags removidas, entidades decodificadas (&nbsp; → espaço).',
    linha_aprox: 'Linha 1-based no arquivo-fonte (exata para itens de uma linha).',
    marcacao_p14: 'Anotação desta extração (inferida do verbo/instrução), não texto da fonte.',
    camada: 'Tudo aqui é camada "fonte".',
  },
  identidade,
  tese,
  resultado_esperado,
  mapa,
  roteiro,
  criterio,
  laboratorios,
  voz,
  voz_dominio_oral,
  erros_comuns,
  tradutor,
  tres_niveis,
  blocos_de_produto,
  comparacao_codigo: {
    arquivos: ['src/lib/data/alexandria-modulo-05-content.ts', 'src/lib/data/alexandria-curriculo.ts', 'src/lib/data/alexandria-trilhas.ts', 'src/lib/data/alexandria-blocks.ts', 'src/lib/data/alexandria-badges.ts'],
    curriculo_nota: 'alexandria-curriculo.ts só reexporta de alexandria-modulo-05-content.ts (import na L45); não tem dado próprio do M05.',
    badges_referenciam_m05: badgesM05,
    contagem_aulas: {
      fonte_secid_aula: aulasRot.length,
      fonte_map_cards: mapa.linhas.length,
      fonte_h2_map: mapa.titulo_secao.texto,
      fonte_pilula_hero: pills[0].texto,
      codigo_MODULO_05_AULAS: MODULO_05_AULAS.length,
      codigo_totalAulas_modulo: modCod?.totalAulas ?? null,
      codigo_instrumentos: INSTRUMENTOS_MODULO_05.length,
      concordam: aulasRot.length === 6 && mapa.linhas.length === 6 && MODULO_05_AULAS.length === 6 && modCod?.totalAulas === 6,
    },
    titulos: aulasRot.map((r) => ({ aula: r.numero, fonte_h2: r.titulo.texto, fonte_rotulo: r.rotulo_marcador, codigo_title: r.comparacao_codigo.title, codigo_subtitle: r.comparacao_codigo.subtitle, iguais: r.comparacao_codigo.title_igual && r.comparacao_codigo.subtitle_igual, lead_igual: r.comparacao_codigo.lead_igual })),
    nao_portado: ['tese (§00)', '§MAP', 'critérios', '§Voz', '§Erros', 'blocos de produto (só os 6 de aula, como nota gold)'],
  },
  divergencias,
};
writeJson('modulo.json', out);
console.log('modulo.json', {
  roteiro: roteiro.length, aulas: aulasRot.length, pilulas: pills.length, tese_blocos: tese.blocos.length,
  map: mapa.linhas.length, criterios: criterio.criterios.length, voz: voz.length, v1: voz_dominio_oral.perguntas_relampago.total_markup,
  v2: voz_dominio_oral.ataques_decisor_cetico.total_markup, v3: voz_dominio_oral.roteiro_cinco_minutos.total, erros: erros_comuns.total_markup,
  lv: tres_niveis.length, produto: blocos_de_produto.length, marca: marca.length, div: divergencias.length,
  titulos_iguais: out.comparacao_codigo.titulos.map((t) => t.iguais && t.lead_igual),
});
