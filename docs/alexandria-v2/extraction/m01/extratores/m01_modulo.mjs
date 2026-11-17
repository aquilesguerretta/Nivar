// Extração programática do grupo "modulo" do M01. Todo texto de conteúdo
// sai do arquivo-fonte por número de linha + regex; nada é digitado.
import fs from 'node:fs';

const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const TS = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/src/lib/data/alexandria-modulo-01-content.ts';
const BLOCKS = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/src/lib/data/alexandria-blocks.ts';
const OUT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/docs/alexandria-v2/extraction/m01/modulo.json';

const L = fs.readFileSync(SRC, 'utf8').split('\n');
const ln = (n) => L[n - 1];
const fail = (m) => { throw new Error(m); };

// match regex on a given line; return group 1 (or whole)
function at(n, re, g = 1) {
  const m = ln(n).match(re);
  if (!m) fail(`linha ${n} não casa ${re}: ${ln(n)}`);
  return m[g];
}
const stripTags = (h) => h.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const inner = (n, tag) => at(n, new RegExp(`<${tag}[^>]*>(.*)</${tag}>`));
const trecho = (n) => ln(n).trim().slice(0, 90);
const origem = (n, seletor) => ({ seletor, trecho_inicial: trecho(n), linha_aprox: n });
const txt = (html) => ({ html, texto: stripTags(html) });

// ── identidade ───────────────────────────────────────────────
const identidade = {
  id: 'm01-identidade',
  tipo: 'identidade',
  eyebrow: { ...txt(at(1257, /hero-eyebrow">(.*)<\/div>/)), origem: origem(1257, 'section.hero .hero-eyebrow') },
  titulo: { ...txt(at(1258, /hero-title">(.*)<\/h1>/)), origem: origem(1258, 'section.hero h1.hero-title') },
  subtitulo: { ...txt(at(1259, /hero-subtitle">(.*)<\/p>/)), origem: origem(1259, 'section.hero p.hero-subtitle') },
  meta: [1263, 1267, 1271, 1275].map((n, i) => ({
    id: `m01-hero-meta-${String(i + 1).padStart(2, '0')}`,
    rotulo: at(n, /hero-meta-label">(.*)<\/div>/),
    valor: at(n + 1, /hero-meta-value[^"]*">(.*)<\/div>/),
    classe_valor: at(n + 1, /class="(hero-meta-value[^"]*)"/),
    origem: origem(n, 'section.hero .hero-meta .hero-meta-cell'),
  })),
  horas: {
    texto: at(1264, /hero-meta-value">(.*)<\/div>/),
    min: null, max: null,
    nota: 'A fonte declara só a string "4 – 6 horas" (hero-meta "Tempo estimado"). Os números 4 e 6 não foram convertidos aqui; o catálogo do código já traz estimatedHoursMin 4 / estimatedHoursMax 6.',
    origem: origem(1264, 'section.hero .hero-meta-cell:nth(1) .hero-meta-value'),
  },
  eixos: null,
  eixos_nota: 'A fonte não declara "eixos" do módulo (zero ocorrências de "eixo"/"eixos" fora de CSS). O mais próximo é a enumeração de cinco dimensões no lead do § 00 ("volume, capacidade, perfil de uso, qualidade e risco") e no hero-subtitle ("consumo e capacidade e perfil e qualidade e risco") — as duas listas não são idênticas (volume × consumo) e nenhuma é rotulada como eixo. Não promovido a eixo.',
  cabecalho: {
    marca: at(1243, /<span>(.*)<\/span>/),
    meta_html: at(1246, /header-meta">(.*)<\/div>/),
    meta_texto: stripTags(at(1246, /header-meta">(.*)<\/div>/)),
    origem: origem(1243, 'header.alex-header'),
  },
  rodape: {
    linhas: [2714, 2715, 2716].map((n) => stripTags(ln(n).trim().replace(/<br>$/, ''))),
    origem: origem(2713, 'footer.alex-footer .footer-mono'),
  },
};

// ── § 00 tese ────────────────────────────────────────────────
const tese = {
  id: 'm01-tese',
  tipo: 'tese',
  marcador: { num: at(1287, /class="num">(.*?)<\/span>/), rotulo: at(1287, /<span class="dot"><\/span><span>(.*?)<\/span>/) },
  titulo_secao: txt(inner(1288, 'h2')),
  lead: txt(at(1290, /class="lead">(.*)<\/p>/)),
  paragrafos: [1292, 1294].map((n, i) => ({ id: `m01-tese-p${i + 1}`, ...txt(inner(n, 'p')), origem: origem(n, 'section.aula(§ 00) > p') })),
  citacao: { ...txt(inner(1297, 'p')), atribuicao: inner(1298, 'cite'), origem: origem(1296, 'section.aula(§ 00) .pull-quote') },
  origem: origem(1287, 'section.aula .aula-marker "§ 00"'),
};

// ── Resultado esperado ───────────────────────────────────────
const resultado = {
  id: 'm01-resultado-esperado',
  tipo: 'capacidades',
  titulo: inner(1301, 'h4'),
  preambulo: inner(1302, 'p'),
  itens: [],
  origem: origem(1301, 'section.aula(§ 00) h4 + p + ul'),
};
for (let n = 1304; n <= 1310; n++) {
  const h = inner(n, 'li');
  resultado.itens.push({ id: `m01-cap-${String(n - 1303).padStart(2, '0')}`, tipo: 'capacidade', ordem: n - 1303, ...txt(h), origem: origem(n, 'section.aula(§ 00) ul > li') });
}
if (resultado.itens.length !== 7) fail('esperava 7 capacidades');

// ── § MAP ────────────────────────────────────────────────────
const mapa = {
  id: 'm01-mapa',
  tipo: 'mapa_do_modulo',
  marcador: { num: at(1325, /class="num">(.*?)<\/span>/), rotulo: at(1325, /<span class="dot"><\/span><span>(.*?)<\/span>/) },
  titulo_secao: txt(inner(1326, 'h2')),
  intro: txt(inner(1327, 'p')),
  cabecalho_tabela: [1333, 1334, 1335].map((n) => inner(n, 'th')),
  linhas: [],
  origem: origem(1325, 'section.aula .aula-marker "§ MAP"'),
};
for (let n = 1339; n <= 1347; n++) {
  const m = ln(n).match(/<tr><td><b>(\d\d)<\/b><\/td><td>(.*?)<\/td><td>(.*)<\/td><\/tr>/);
  if (!m) fail(`MAP linha ${n}`);
  mapa.linhas.push({
    id: `m01-map-aula-${m[1]}`, tipo: 'pergunta_da_aula', aula: m[1], tema: m[2],
    pergunta: txt(m[3]),
    vinculos: { aula_id_codigo: `aula-01-${m[1]}` },
    origem: origem(n, 'section.aula(§ MAP) table tbody tr'),
  });
}

// ── roteiro: todas as 19 section.aula ───────────────────────
const roteiro = [];
L.forEach((line, i) => {
  const m = line.match(/<div class="aula-marker"><span class="num">(.*?)<\/span><span class="dot"><\/span><span>(.*?)<\/span><\/div>/);
  if (!m) return;
  const n = i + 1;
  const h2 = inner(n + 1, 'h2');
  const isAula = /^Aula \d\d$/.test(m[1]);
  roteiro.push({
    id: isAula ? `m01-roteiro-aula-${m[1].slice(5)}` : `m01-roteiro-${m[1].replace('§ ', '').toLowerCase()}-L${n}`,
    tipo: isAula ? 'aula' : 'aparato',
    ordem_na_fonte: roteiro.length + 1,
    marcador_num: m[1],
    marcador_rotulo: m[2],
    titulo: txt(h2),
    vinculos: isAula ? { aula_id_codigo: `aula-01-${m[1].slice(5)}` } : {},
    origem: origem(n, 'section.aula .aula-marker'),
  });
});
if (roteiro.length !== 19) fail('esperava 19 seções');
const aulasRot = roteiro.filter((r) => r.tipo === 'aula');
if (aulasRot.length !== 9) fail('esperava 9 aulas');

// ── critérios ────────────────────────────────────────────────
const drillP = inner(2389, 'p');
const quizP = inner(2474, 'p');
const finalP = inner(2494, 'p');
const verboP14 = (t) => {
  const tags = [];
  if (/\d+\s*segundos/.test(t)) tags.push('cronometrado');
  const v = t.split(' ')[0];
  if (['Explicar', 'Justificar', 'Listar', 'Diferenciar', 'Identificar', 'Saber', 'Dar', 'Ler', 'Conectar'].includes(v) || / e (explicar|interpretar|identificar) /.test(t)) tags.push('producao_oral_ou_livre');
  if (v === 'Desenhar') tags.push('desenho');
  if (v === 'Calcular') tags.push('calculo');
  return tags;
};
const checklist = [];
for (let n = 2497; n <= 2512; n++) {
  const h = at(n, /<div class="text">(.*)<\/div><\/div>$/);
  checklist.push({ id: `m01-crit-check-${String(n - 2496).padStart(2, '0')}`, tipo: 'item_de_checklist', ordem: n - 2496, ...txt(h), marcacao_p14: verboP14(stripTags(h)), origem: origem(n, '#checklist .checklist-item .text') });
}
resultado.itens.forEach((it) => { it.marcacao_p14 = verboP14(it.texto); });
// quiz: mensagens de pontuação (script)
const quizMsgs = [3199, 3200, 3201, 3202].map((n) => {
  const m = ln(n).match(/(?:else )?(?:if \((correct >= \d)\) )?scoreMsg\.textContent = '(.*)';/);
  if (!m) fail(`quiz msg ${n}`);
  return { condicao: m[1] ?? 'else (correct < 5)', mensagem: m[2], origem: origem(n, 'script QUIZ scoreMsg') };
});

const criterio = {
  id: 'm01-criterio',
  tipo: 'criterio_do_modulo',
  nota_p5: 'Três critérios literais coexistem na fonte (Drill, Quiz, Checklist) e as mensagens do script do quiz não batem com o limiar 8/10 da prosa. Registrado, não reconciliado (P5).',
  criterios: [
    {
      id: 'm01-crit-drill', tipo: 'criterio_exercicios', secao: '§ Drill',
      ...txt(drillP),
      frase_criterio: at(2389, /(O critério de domínio é resolver pelo menos seis dos oito sem consulta\.)/),
      marcacao_p14: ['autoavaliado_sem_registro'],
      nota: 'O gabarito é revelado por botão; a fonte não registra acerto. O exercício 08 pede resposta "em até oito linhas" (limite de extensão, não de tempo).',
      origem: origem(2389, 'section.aula(§ Drill) > p'),
    },
    {
      id: 'm01-crit-quiz', tipo: 'criterio_quiz', secao: '§ Quiz',
      ...txt(quizP),
      limiar: { acertos: 8, total: 10, fonte_literal: at(2474, /<strong>(8 de 10)<\/strong>/) },
      rotulo_pontuacao: at(2479, /quiz-score-label">(.*)<\/div>/),
      mensagens_do_script: quizMsgs,
      marcacao_p14: ['automatizavel_mas_P5_limiar_nao_e_evidencia'],
      origem: origem(2474, 'section.aula(§ Quiz) > p'),
    },
    {
      id: 'm01-crit-checklist', tipo: 'criterio_conclusao', secao: '§ Final',
      titulo_secao: txt(inner(2492, 'h2')),
      ...txt(finalP),
      itens: checklist,
      nota: 'A marcação é um toggle visual (script CHECKLIST: classList.toggle("checked")), sem persistência nem verificação. marcacao_p14 é anotação desta extração inferida do verbo inicial de cada item — não é texto da fonte.',
      origem: origem(2494, 'section.aula(§ Final) > p + #checklist'),
    },
  ],
};

// ── LAB · 01 ─────────────────────────────────────────────────
const field = (nLabel, nInput, nRange) => {
  const lab = ln(nLabel).match(/<label class="field-label">(.*?)(?: <span class="unit">(.*)<\/span>)?<\/label>/);
  if (!lab) fail(`label ${nLabel}`);
  const attrs = (n) => Object.fromEntries([...ln(n).matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
  const out = { rotulo: lab[1], unidade: lab[2] ?? null, input_number: attrs(nInput), origem: origem(nLabel, 'section.aula(§ Lab) .instrument .field') };
  delete out.input_number.class;
  if (nRange) { out.input_range = attrs(nRange); delete out.input_range.class; }
  return out;
};
const rows = (a, b) => { const r = []; for (let n = a; n <= b; n++) { const m = ln(n).match(/<span class="lbl">(.*?)<\/span><span class="val" id="(.*?)">(.*?)<\/span>/); r.push({ rotulo: m[1], output_id: m[2], valor_estatico_no_markup: m[3], origem: origem(n, '.compare-row') }); } return r; };
const lab = {
  id: 'm01-lab-01',
  tipo: 'laboratorio',
  instrument_id_fonte: at(2266, /instrument-id">(.*)<\/div>/),
  titulo_instrumento: at(2265, /instrument-title">(.*)<\/div>/),
  secao: { marcador_num: at(2258, /class="num">(.*?)<\/span>/), marcador_rotulo: at(2258, /<span class="dot"><\/span><span>(.*?)<\/span>/), titulo: txt(inner(2259, 'h2')) },
  enunciado: { ...txt(at(2261, /class="lead">(.*)<\/p>/)), origem: origem(2261, 'section.aula(§ Lab) p.lead') },
  instrucao_interna: { ...txt(inner(2270, 'p')), origem: origem(2270, '.instrument-body > p') },
  passos: null,
  passos_nota: 'A fonte não enumera passos. A única instrução de ação é a frase do enunciado ("Ajuste as variáveis nas duas fábricas — mantendo o mesmo consumo total — e observe como a fatura mensal estimada diverge.").',
  entregavel: null,
  entregavel_nota: 'A fonte não declara entregável, registro nem pergunta de fechamento para o LAB · 01.',
  campos_comuns: [field(2274, 2275), field(2278, 2279)],
  colunas: [
    { id: 'm01-lab-01-a', cabecalho: inner(2285, 'h5'), campos: [field(2287, 2288, 2289), field(2292, 2293, 2294), field(2297, 2298, 2299)], saidas: rows(2303, 2306), total: { rotulo: at(2309, /label">(.*)<\/div>/), output_id: at(2310, /id="(.*?)"/), valor_estatico_no_markup: at(2310, />([^<]*)<\/div>/) } },
    { id: 'm01-lab-01-b', cabecalho: inner(2315, 'h5'), campos: [field(2317, 2318, 2319), field(2322, 2323, 2324), field(2327, 2328, 2329)], saidas: rows(2333, 2336), total: { rotulo: at(2339, /label">(.*)<\/div>/), output_id: at(2340, /id="(.*?)"/), valor_estatico_no_markup: at(2340, />([^<]*)<\/div>/) } },
  ],
  nota_instrumento: { html: at(2346, /^\s*(.*)$/), texto: stripTags(at(2346, /^\s*(.*)$/)), origem: origem(2345, '.instrument-note') },
  script_coeficientes_verbatim: [3031, 3032, 3033, 3034, 3035, 3036, 3038, 3039, 3040, 3041, 3042, 3044].map((n) => ({ codigo: ln(n).trim(), linha_aprox: n })),
  vinculos: {
    aula: null,
    aula_nota: 'Nenhuma aula referencia o LAB · 01; ele vive no aparato § Lab (P9/§3 do protocolo: vai para os recursos do módulo).',
    tese: 'm01-tese',
    tese_nota: 'Vínculo declarado em prosa pelo enunciado: "valida toda a tese central do módulo".',
    codigo: { arquivo: 'src/lib/data/alexandria-modulo-01-content.ts', instrument_id: 'lab-01', kind: 'laboratorio' },
  },
  origem: origem(2258, 'section.aula .aula-marker "§ Lab"'),
};
// verificação dos valores calculados pelo script nos defaults
(function () {
  const kwh = 100000, tarifa = 450;
  const side = (D, FP, P) => { const e = (kwh / 1000) * tarifa, d = D * 25, r = FP < 0.92 ? (0.92 - FP) * kwh * 0.4 : 0, a = e * P * 0.5; const f = (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR'); return { energia: f(e), demanda: f(d), reativo: f(r), adicponta: f(a), total: f(e + d + r + a) }; };
  lab.valores_do_script_nos_defaults = {
    metodo: 'Coeficientes do script (linhas 3031-3044) aplicados aos value= dos campos, em Node 24 com toLocaleString("pt-BR"). O script roda update() no carregamento e sobrescreve o markup.',
    a: side(250, 0.96, 0.05),
    b: side(600, 0.84, 0.25),
  };
})();

// ── voz / princípios editoriais ──────────────────────────────
const callout = (nLabel, nP, sec) => ({ rotulo: at(nLabel, /callout-label">(.*)<\/div>/), ...txt(inner(nP, 'p')), origem: origem(nLabel - 1, sec) });
const voz = [
  { id: 'm01-voz-linguagem-segura', tipo: 'principio_editorial', ...callout(1314, 1315, 'section.aula(§ 00) .callout.gold') },
  { id: 'm01-voz-padrao-editorial', tipo: 'principio_editorial', ...callout(2704, 2705, 'section.aula(§ Ref) .callout.gold') },
  { id: 'm01-voz-ref-intro', tipo: 'principio_editorial', rotulo: null, ...txt(inner(2690, 'p')), origem: origem(2690, 'section.aula(§ Ref) > p') },
  { id: 'm01-voz-caso-linguagem', tipo: 'exemplo_de_voz', ...callout(2232, 2233, 'section.aula(§ Caso) .case-body .callout.gold'), nota: 'Vive dentro do § Caso; incluído aqui só como ponteiro de voz. O conteúdo do caso pertence ao grupo do caso.' },
];

// ── erros comuns ─────────────────────────────────────────────
const erros = {
  id: 'm01-erros-comuns',
  tipo: 'erros_comuns',
  secao_de_modulo: null,
  nota: 'A fonte não tem seção de "erros comuns" no nível do módulo. Há callouts de erro/cuidado DENTRO de aulas (ponteiros abaixo, só rótulo); o corpo pertence ao grupo das aulas.',
  ponteiros_em_aula: [
    { rotulo: at(1453, /callout-label">(.*)<\/div>/), classe: 'callout red', aula: '01', vinculos: { aula_id_codigo: 'aula-01-01' }, origem: origem(1452, 'Aula 01 · 1.5 .callout.red') },
    { rotulo: at(1756, /callout-label">(.*)<\/div>/), classe: 'callout red', aula: '05', vinculos: { aula_id_codigo: 'aula-01-05' }, origem: origem(1755, 'Aula 05 .callout.red') },
    { rotulo: at(1997, /callout-label">(.*)<\/div>/), classe: 'callout red', aula: '07', vinculos: { aula_id_codigo: 'aula-01-07' }, origem: origem(1996, 'Aula 07 .callout.red') },
  ],
};

// ── § Map (Tradutor) ─────────────────────────────────────────
const tradutor = {
  id: 'm01-tradutor',
  tipo: 'sintese_de_modulo',
  marcador: { num: at(2358, /class="num">(.*?)<\/span>/), rotulo: at(2358, /<span class="dot"><\/span><span>(.*?)<\/span>/) },
  titulo_secao: txt(inner(2359, 'h2')),
  intro: txt(inner(2361, 'p')),
  cabecalho_tabela: [...ln(2365).matchAll(/<th>(.*?)<\/th>/g)].map((m) => m[1]),
  linhas: [],
  nota: 'Aparato de módulo, sem vínculo de aula. Incluído neste grupo por ser síntese do módulo; deduplicar por id se outro grupo também extrair.',
  origem: origem(2358, 'section.aula .aula-marker "§ Map"'),
};
for (let n = 2367; n <= 2374; n++) {
  const m = ln(n).match(/<tr><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/);
  tradutor.linhas.push({ id: `m01-tradutor-${String(n - 2366).padStart(2, '0')}`, celulas: [m[1], m[2], m[3]].map(txt), origem: origem(n, 'section.aula(§ Map) table tbody tr') });
}

// ── comparação com o código ─────────────────────────────────
const ts = fs.readFileSync(TS, 'utf8');
const codeAulas = [...ts.matchAll(/id: 'aula-01-(\d\d)',[\s\S]*?title: "(.*?)",\s*subtitle: "(.*?)"/g)].map((m) => ({ n: m[1], title: m[2], subtitle: m[3] }));
const comparacao_titulos = aulasRot.map((r) => {
  const n = r.marcador_num.slice(5);
  const c = codeAulas.find((x) => x.n === n);
  const map = mapa.linhas.find((x) => x.aula === n);
  return {
    aula: n,
    fonte_h2_texto: r.titulo.texto,
    fonte_marcador: r.marcador_rotulo,
    fonte_map_tema: map.tema,
    codigo_title: c?.title ?? null,
    codigo_subtitle: c?.subtitle ?? null,
    title_igual_h2: c ? c.title === r.titulo.texto : false,
    subtitle_igual_marcador: c ? c.subtitle === r.marcador_rotulo : false,
    marcador_igual_map_tema: r.marcador_rotulo === map.tema,
  };
});
const blocks = fs.readFileSync(BLOCKS, 'utf8');
const b01 = blocks.match(/\{ id: 'bloco-01'.*\}/)[0];
const b02 = blocks.match(/\{ id: 'bloco-02'.*\}/)[0];


const D = (id, tema, leitura_a, leitura_b, linhas, nota) => ({ id, tema, leitura_a, leitura_b, linhas_aprox: linhas, nota, decisao: 'não escolhida — registrar para reconciliação (P5/P8)' });
const divergencias = [
  D('div-01-criterio-drill-quiz-checklist', 'Três critérios de domínio/conclusão',
    { onde: '§ Drill L2389', texto: at(2389, /(O critério de domínio é resolver pelo menos seis dos oito sem consulta\.)/) },
    { onde: '§ Quiz L2474 e § Final L2494', texto: stripTags(quizP) + ' | ' + stripTags(finalP) },
    [2389, 2474, 2494], 'A fonte chama dois limiares diferentes de "critério de domínio" (6/8 exercícios; 8/10 quiz) e ainda diz que "só passa" quem cumpre todos os 16 itens do checklist. Nenhum declara precedência.'),
  D('div-02-quiz-mensagens-x-limiar', 'Mensagens do script do quiz contradizem o limiar 8/10',
    { onde: 'prosa L2474', texto: 'acertar pelo menos 8 de 10' },
    { onde: 'script L3199-3202', texto: quizMsgs.map((q) => `${q.condicao} → ${q.mensagem}`).join(' | ') },
    [2474, 3199, 3200, 3201, 3202], 'Com 7 acertos (abaixo do limiar) a mensagem manda avançar para o próximo módulo; com 8 (no limiar) recebe a mesma mensagem de "Revise"; "Pronto para o Módulo 02" só a partir de 9. É a contradição do M01 citada em bar.md §9/P5.'),
  D('div-03-drill-nove-aulas', 'Drill diz alcançar as nove aulas; as tags não cobrem 03, 06 e 09',
    { onde: '§ Drill L2389', texto: at(2389, /(Os exercícios alcançam todas as nove aulas\.)/) },
    { onde: 'span.exercise-tag L2392-2457', texto: [2392, 2401, 2410, 2419, 2428, 2437, 2446, 2457].map((n) => at(n, /exercise-tag">(.*?)<\/span>/)).join(' | ') },
    [2389, 2392, 2457], 'Tags apontam Aulas 01, 02, 04, 05 (x2), 07, 08 e uma "Síntese" sem aula. A contagem 8 bate com "seis dos oito"; o protocolo (§5) cita "seis dos oito, há 8" como precedente de divergência prosa x markup, mas a medição aqui dá 8=8 — a divergência real medida é a cobertura de aulas.'),
  D('div-04-dois-marcadores-map', 'Mesmo marcador "§ MAP"/"§ Map" para duas seções diferentes',
    { onde: 'L1325', texto: 'num="§ MAP", rótulo "Mapa das aulas"' },
    { onde: 'L2358', texto: 'num="§ Map", rótulo "Tradutor"' },
    [1325, 2358], 'Só a caixa distingue os dois. Qualquer chave por marcador sem normalização de caixa colide (ids desta extração levam sufixo de linha por isso).'),
  D('div-05-trava-3-x-trava-4', 'Número da "Trava" do War Room para linguagem segura',
    { onde: '§ 00 L1314', texto: at(1314, /callout-label">(.*)<\/div>/) },
    { onde: '§ Caso L2192', texto: at(2192, /(Linguagem segura aplicada conforme Trava 3 do War Room\.)/) },
    [1314, 2192], 'O corpo da Aula 05 (callout "Onde isso entra no produto") e o feedback da pergunta 10 do quiz também citam "Trava 4". Só o § Caso diz "Trava 3".'),
  D('div-06-nome-modulo-02', 'Nome do próximo módulo',
    { onde: 'hero-meta L1276 e § Final L2494', texto: at(1276, /hero-meta-value">(.*)<\/div>/) + ' | Módulo 02 — A Rede Elétrica' },
    { onde: 'código alexandria-blocks.ts bloco-02', texto: 'Como Funciona uma Rede Elétrica (priority: confirmar)' },
    [1276, 2494], 'P8: divergência de título entre a fonte do M01 e o catálogo do código para o M02.'),
  D('div-07-titulo-modulo', 'Título do módulo: h1 x rodapé x catálogo',
    { onde: 'h1 L1258', texto: stripTags(at(1258, /hero-title">(.*)<\/h1>/)) },
    { onde: 'rodapé L2715 e catálogo bloco-01', texto: stripTags(ln(2715).trim().replace(/<br>$/, '')) + ' | Física de Energia e Eletricidade' },
    [1258, 2715], 'O catálogo bate com o rodapé (nome curto, caixa de título). O h1 é o nome curto em caixa de frase + subtítulo editorial após dois-pontos. Qual string é o "título" fica para P8.'),
  D('div-08-lab-markup-x-script', 'Valores estáticos da Fábrica B no markup diferem do que o script calcula nos defaults',
    { onde: 'markup L2335 / L2340', texto: 'Reativo excedente R$ 1.800 · Fatura estimada R$ 67.425' },
    { onde: 'script L3031-3044 (calculado)', texto: 'Reativo excedente R$ 3.200 · Fatura estimada R$ 68.825' },
    [2335, 2340, 3040], '(0,92 − 0,84) × 100.000 × 0,4 = 3.200. O script roda update() no carregamento, então a tela mostra 3.200/68.825; o HTML estático está desatualizado. Fábrica A bate nos dois.'),
  D('div-09-lab-faixas-number-x-range', 'Faixas do campo numérico x deslizador gêmeo no LAB · 01',
    { onde: 'input number', texto: 'dem min 50 sem max · fp min 0.5 max 1 · ponta min 0 max 100' },
    { onde: 'input range', texto: 'dem A 100–800 / B 100–1500 · fp 0.7–1 · ponta 0–50' },
    [2288, 2289, 2293, 2294, 2298, 2299], 'syncIR copia number→range e range→number; o range limita o valor, o number não. O código (lab-01) adotou as faixas do range (§12 do protocolo). Também: `parseFloat(fp.value) || 1` faz FP vazio virar 1 (resíduo a sinalizar, §10).'),
  D('div-10-lab-rotulos-codigo', 'Rótulos dos campos do LAB · 01 no código não são literais',
    { onde: 'fonte h5 L2285/L2315 + label', texto: `${inner(2285, 'h5')} / ${inner(2315, 'h5')} + "Demanda máxima"` },
    { onde: 'código lab-01', texto: 'label "Fábrica A · Demanda máxima" (prefixo composto, sem "Operação estável"/"Operação concentrada")' },
    [2285, 2315], 'Composição da extração anterior, não texto da fonte. Os cabeçalhos completos das colunas não existem no código.'),
  D('div-11-protocolo-lab-map', 'Localização do LAB · 01 descrita no protocolo',
    { onde: 'extraction-protocol.md §3', texto: 'padrão `§MAP`, primeiro visto como `LAB·01` no Módulo 1' },
    { onde: 'fonte L2258', texto: 'LAB · 01 vive em "§ Lab" (Comparador interativo), não em § MAP' },
    [2258], 'Imprecisão no documento de protocolo; instrument-taxonomy.md diz corretamente "§ Lab, aparato".'),
  D('div-12-glossario-contagem', 'Prosa do § Lex x markup',
    { onde: 'L2524', texto: at(2524, /(Vinte e oito termos\.)/) },
    { onde: 'markup', texto: '38 details.glossary-item' },
    [2524], 'Já registrada no código (alexandria-glossario.ts). Repetida aqui por ser contagem de módulo (P8).'),
  D('div-13-dimensoes-tese', 'Enumerações das "cinco dimensões" não coincidem',
    { onde: '§ 00 lead L1290', texto: 'volume, capacidade, perfil de uso, qualidade e risco' },
    { onde: 'hero-subtitle L1259', texto: 'consumo e capacidade e perfil e qualidade e risco' },
    [1259, 1290], 'Volume x consumo; "perfil de uso" x "perfil". Provavelmente a mesma lista, mas a fonte não diz. Nenhuma das duas é rotulada como eixo.'),
  D('div-14-marca', 'Marca na fonte x produto atual',
    { onde: 'header L1243, hero-meta L1271, footer L2714', texto: 'GridAlpha · Alexandria Library / Produtos GridAlpha / GridAlpha Brasil' },
    { onde: 'AGENTS.md', texto: 'produto se chama NIVAR' },
    [1243, 1271, 2714], 'Texto de marca literal da fonte; não trocado. P7 manda não exibir "onde isso entra no produto" nesta fase — vale para o hero-meta "Produtos GridAlpha".'),
];

const out = {
  grupo: 'modulo',
  modulo: 'm01',
  fonte: SRC,
  gerado_por: 'extração programática (Node) por linha + regex; nenhum texto de conteúdo digitado',
  convencoes: {
    html: 'fragmento literal da fonte, com inline preservado',
    texto: 'o mesmo fragmento com tags removidas e entidades &lt; &gt; &amp; decodificadas',
    linha_aprox: 'número de linha 1-based no HTML-fonte (LF, 3.212 linhas)',
    marcacao_p14: 'anotação desta extração, não texto da fonte',
  },
  divergencias, identidade, tese, resultado_esperado: resultado, mapa, roteiro, criterio, lab_01: lab, voz, erros_comuns: erros, tradutor,
  comparacao_codigo: {
    arquivos: [TS, BLOCKS, 'src/lib/data/alexandria-trilhas.ts', 'src/lib/data/alexandria-glossario.ts', 'src/lib/data/alexandria-badges.ts'],
    contagem_aulas: { fonte_marcadores: aulasRot.length, fonte_map_linhas: mapa.linhas.length, fonte_prosa_map: mapa.titulo_secao.texto, codigo_aulas: codeAulas.length, codigo_AULAS_POR_BLOCO: 9 },
    titulos: comparacao_titulos,
    catalogo_bloco_01: b01,
    catalogo_bloco_02: b02,
  },
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log('ok', roteiro.length, mapa.linhas.length, checklist.length, codeAulas.length);
console.log(JSON.stringify(comparacao_titulos.filter((c) => !c.title_igual_h2 || !c.subtitle_igual_marcador || !c.marcador_igual_map_tema)));
console.log(JSON.stringify(lab.valores_do_script_nos_defaults));
console.log(JSON.stringify(quizMsgs.map(q=>q.condicao)));
