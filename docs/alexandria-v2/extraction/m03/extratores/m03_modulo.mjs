// Grupo "modulo" do M03: identidade, § 00 (tese, critério, capacidades),
// § MAP, roteiro, critérios, voz (§ Voz + princípios), § Erros, três níveis,
// comparação com código e catálogo. Nada digitado: tudo sai da fonte.
import {
  SRC, CODE, L, ln, at, find, findAll, inner, txt, stripTags, collapse, origem, pad, secao, SECOES,
  blockEnd, writeJson, readCode, marcacaoP14, fail, TOTAL_LINHAS, hoje,
} from './lib.mjs';

// ── identidade ──────────────────────────────────────────────
const nTitle = find(/<title>/);
const nEyebrow = find(/class="hero-eyebrow"/);
const nH1 = find(/class="hero-title"/);
const nSub = find(/class="hero-subtitle"/);
const metaLabels = findAll(/class="hero-meta-label"/);
const nBrand = find(/<span>GridAlpha · Alexandria Library<\/span>|class="alex-brand"/);
const nBrandSpan = find(/^\s*<span>[^<]+<\/span>\s*$/, nBrand, nBrand + 3);
const nHeaderMeta = find(/class="header-meta"/);
const nFooterBrand = find(/class="footer-brand"/);
const footerPs = findAll(/^\s*<p[\s>]/, nFooterBrand, find(/<\/footer>/));

const identidade = {
  id: 'm03-identidade',
  tipo: 'identidade',
  title_tag: { texto: at(nTitle, /<title>(.*)<\/title>/), origem: origem(nTitle, 'head > title') },
  eyebrow: { ...txt(at(nEyebrow, /hero-eyebrow">(.*)<\/div>/)), origem: origem(nEyebrow, 'section.hero .hero-eyebrow') },
  titulo: { ...txt(at(nH1, /hero-title">(.*)<\/h1>/)), origem: origem(nH1, 'section.hero h1.hero-title') },
  subtitulo: { ...txt(at(nSub, /hero-subtitle">(.*)<\/p>/)), origem: origem(nSub, 'section.hero p.hero-subtitle') },
  meta: metaLabels.map((n, i) => ({
    id: `m03-hero-meta-${pad(i + 1)}`,
    rotulo: at(n, /hero-meta-label">(.*)<\/div>/),
    valor: at(n + 1, /hero-meta-value[^"]*">(.*)<\/div>/),
    classe_valor: at(n + 1, /class="(hero-meta-value[^"]*)"/),
    origem: origem(n, 'section.hero .hero-meta .hero-meta-cell'),
  })),
  horas: {
    texto: at(metaLabels[0] + 1, /hero-meta-value">(.*)<\/div>/),
    min: null,
    max: null,
    nota: 'A fonte declara só a string do hero-meta "Tempo estimado". Os números não foram convertidos aqui. O catálogo do código (alexandria-blocks.ts, bloco-03) tem estimatedHoursMin/Max = null e priority "confirmar"; o catálogo canônico escreve "4–5 h declaradas".',
    origem: origem(metaLabels[0] + 1, 'section.hero .hero-meta-cell:nth(1) .hero-meta-value'),
  },
  eixos: null,
  eixos_nota: 'A fonte não declara "eixos" do módulo. O mais próximo é a fórmula do § 00 ("Papel na matriz = f (estrutura de custo, despachabilidade, fator de capacidade, localização)", quatro variáveis) e a lista de atributos do lead ("energia barata, potência firme, flexibilidade para subir e descer, inércia, localização certa"). Nenhuma das duas é rotulada como eixo. Não promovido a eixo.',
  cabecalho: {
    marca: at(nBrandSpan, /<span>(.*)<\/span>/),
    meta_html: at(nHeaderMeta, /header-meta">(.*)<\/div>/),
    meta_texto: stripTags(at(nHeaderMeta, /header-meta">(.*)<\/div>/)),
    origem: origem(nHeaderMeta, 'header.alex-header'),
  },
  rodape: {
    marca: at(nFooterBrand, /footer-brand">(.*)<\/div>/),
    paragrafos: footerPs.map((n) => ({ ...txt(inner(n, 'p')), origem: origem(n, 'footer.alex-footer p') })),
    origem: origem(nFooterBrand, 'footer.alex-footer'),
  },
};

// ── § 00 ────────────────────────────────────────────────────
const s00 = secao('§ 00');
const pLines = (a, b) => findAll(/^\s*<p>/, a, b);
const nLead00 = find(/class="lead"/, s00.start, s00.end);
const nGrid = find(/class="tech-grid"/, s00.start, s00.end);
const nGridEnd = blockEnd(nGrid);
const nFormula00 = find(/class="formula"/, s00.start, s00.end);
const nQuote = find(/class="pull-quote"/, s00.start, s00.end);
const nH4crit = find(/<h4>/, s00.start, s00.end);
const nUl = find(/<ul/, s00.start, s00.end);
const nUlEnd = find(/<\/ul>/, nUl);
const nCallout00 = find(/class="callout gold"/, s00.start, s00.end);
const ps00 = pLines(s00.start, s00.end).filter((n) => !(n > nGrid && n < nGridEnd) && !(n > nQuote && n < nQuote + 4) && !(n > nCallout00));
// ps00: [p antes do grid, p hl, p do critério, p "Além disso"]
if (ps00.length !== 4) fail(`§00 esperava 4 <p> soltos, achou ${ps00.length}: ${ps00}`);

const tese = {
  id: 'm03-tese',
  tipo: 'tese',
  marcador: { num: s00.num, rotulo: s00.rotulo },
  titulo_secao: { ...txt(inner(s00.h2, 'h2')), origem: origem(s00.h2, 'section.aula(§ 00) h2.aula-title') },
  lead: { ...txt(at(nLead00, /class="lead">(.*)<\/p>/)), origem: origem(nLead00, 'section.aula(§ 00) p.lead') },
  blocos: [
    { id: 'm03-tese-p1', tipo: 'paragrafo', ...txt(inner(ps00[0], 'p')), origem: origem(ps00[0], 'section.aula(§ 00) > p') },
    {
      id: 'm03-tese-familias', tipo: 'grade_de_duas_celulas',
      celulas: findAll(/<h5>/, nGrid, nGridEnd).map((n, i) => ({
        id: `m03-tese-familia-${i + 1}`,
        classe: at(n - 1, /class="(tech-cell[^"]*)"/),
        titulo: inner(n, 'h5'),
        ...txt(inner(n + 1, 'p')),
        origem: origem(n, 'section.aula(§ 00) .tech-grid .tech-cell'),
      })),
      origem: origem(nGrid, 'section.aula(§ 00) .tech-grid'),
    },
    { id: 'm03-tese-p2', tipo: 'paragrafo', ...txt(inner(ps00[1], 'p')), origem: origem(ps00[1], 'section.aula(§ 00) > p') },
    {
      id: 'm03-tese-formula', tipo: 'formula',
      eq: txt(at(nFormula00 + 1, /class="eq">(.*)<\/div>/)),
      desc: txt(at(nFormula00 + 2, /class="desc">(.*)<\/div>/)),
      origem: origem(nFormula00, 'section.aula(§ 00) .formula'),
    },
    {
      id: 'm03-tese-citacao', tipo: 'citacao',
      ...txt(inner(nQuote + 1, 'p')),
      atribuicao: inner(nQuote + 2, 'cite'),
      origem: origem(nQuote, 'section.aula(§ 00) .pull-quote'),
    },
  ],
  origem: origem(s00.start, 'section.aula .aula-marker "§ 00"'),
};

// critério de domínio do § 00 + capacidades
const criterioTese = {
  id: 'm03-crit-tese',
  tipo: 'criterio_dominio_modulo',
  secao: '§ 00',
  titulo: inner(nH4crit, 'h4'),
  ...txt(inner(ps00[2], 'p')),
  frase_teste_honesto: at(ps00[2], /(O teste honesto: .*)<\/p>/),
  marcacao_p14: ['producao_oral_ou_livre', 'desenho', 'sem_consulta', 'fluencia_tres_frases'],
  nota: 'marcacao_p14 é anotação desta extração: (1) "desenhar num guardanapo" = desenho; (2) "explicar em voz alta" = oral; "responde em três frases sem travar" = fluência (não há tempo em segundos/minutos declarado aqui). O texto diz "Você passa no Bloco 3" — "Bloco" é vocabulário de currículo, não de módulo.',
  origem: origem(nH4crit, 'section.aula(§ 00) h4 + p'),
};
const resultado = {
  id: 'm03-resultado-esperado',
  tipo: 'capacidades',
  titulo: null,
  titulo_nota: 'A fonte do M03 não tem o cabeçalho "Resultado esperado" (o M01 tinha). O equivalente é o parágrafo "Além disso, ao final você consegue:" seguido de uma lista, logo após o critério de domínio do § 00.',
  preambulo: inner(ps00[3], 'p'),
  itens: findAll(/<li/, nUl, nUlEnd).map((n, i) => {
    const h = inner(n, 'li');
    return { id: `m03-cap-${pad(i + 1)}`, tipo: 'capacidade', ordem: i + 1, ...txt(h), marcacao_p14: marcacaoP14(stripTags(h)), origem: origem(n, 'section.aula(§ 00) ul > li') };
  }),
  origem: origem(ps00[3], 'section.aula(§ 00) p + ul'),
};
if (resultado.itens.length !== 8) fail(`esperava 8 capacidades, achou ${resultado.itens.length}`);

// ── § MAP ───────────────────────────────────────────────────
const sMap = secao('§ MAP');
const nMapP = find(/^\s*<p>/, sMap.start, sMap.end);
const mapa = {
  id: 'm03-mapa',
  tipo: 'mapa_do_modulo',
  marcador: { num: sMap.num, rotulo: sMap.rotulo },
  titulo_secao: { ...txt(inner(sMap.h2, 'h2')), origem: origem(sMap.h2, 'section.aula(§ MAP) h2') },
  intro: { ...txt(inner(nMapP, 'p')), origem: origem(nMapP, 'section.aula(§ MAP) > p') },
  cabecalho_tabela: findAll(/<th[ >]/, sMap.start, sMap.end).map((n) => inner(n, 'th')),
  linhas: findAll(/<tr><td><b>\d\d<\/b>/, sMap.start, sMap.end).map((n) => {
    const m = ln(n).match(/<tr><td><b>(\d\d)<\/b><\/td><td>(.*?)<\/td><td>(.*)<\/td><\/tr>/);
    return {
      id: `m03-map-aula-${m[1]}`, tipo: 'pergunta_da_aula', aula: m[1], tema: m[2],
      pergunta: txt(m[3]),
      vinculos: { aula_id_codigo: `aula-03-${m[1]}` },
      origem: origem(n, 'section.aula(§ MAP) table tbody tr'),
    };
  }),
  origem: origem(sMap.start, 'section.aula .aula-marker "§ MAP"'),
};
if (mapa.linhas.length !== 10) fail('MAP: esperava 10 linhas');

// ── roteiro ─────────────────────────────────────────────────
const roteiro = SECOES.map((s, i) => {
  const isAula = /^Aula \d\d$/.test(s.num);
  const lineCount = s.end - s.start + 1;
  return {
    id: isAula ? `m03-roteiro-aula-${s.num.slice(5)}` : `m03-roteiro-${s.num.replace('§ ', '').toLowerCase()}`,
    tipo: isAula ? 'aula' : 'aparato',
    ordem_na_fonte: i + 1,
    marcador_num: s.num,
    marcador_rotulo: s.rotulo,
    titulo: txt(inner(s.h2, 'h2')),
    instrumentos_na_secao: findAll(/class="instrument-id"/, s.start, s.end).map((n) => at(n, /instrument-id">(.*)<\/div>/)),
    linhas: { inicio: s.start, fim: s.end, total: lineCount },
    vinculos: isAula ? { aula_id_codigo: `aula-03-${s.num.slice(5)}` } : {},
    origem: origem(s.start, 'section.aula .aula-marker'),
  };
});
const aulasRot = roteiro.filter((r) => r.tipo === 'aula');
if (roteiro.length !== 20 || aulasRot.length !== 10) fail(`roteiro ${roteiro.length}/${aulasRot.length}`);

// subseções numeradas x.y por aula (terceiro sinal de contagem, §5)
const subsecoes = aulasRot.map((r) => ({
  aula: r.marcador_num.slice(5),
  subsecoes: findAll(/<h3><span class="num">/, r.linhas.inicio, r.linhas.fim).map((n) => {
    const m = ln(n).match(/<h3><span class="num">(.*?)<\/span>(.*)<\/h3>/);
    return { numero: m[1], ...txt(m[2]), linha_aprox: n };
  }),
}));

// ── critérios ───────────────────────────────────────────────
const sQuiz = secao('§ Quiz');
const nQuizP = find(/^\s*<p>/, sQuiz.start, sQuiz.end);
const sFinal = secao('§ Final');
const nFinalP = find(/^\s*<p>/, sFinal.start, sFinal.end);
const sEx = secao('§ Ex');
const nExLead = find(/class="lead"/, sEx.start, sEx.end);
const sVoz = secao('§ Voz');
const nVozLead = find(/class="lead"/, sVoz.start, sVoz.end);
const nScore = find(/if\(correct >= 9\) scoreMsg/);
const faixas = [0, 1, 2, 3].map((k) => {
  const n = nScore + k;
  const m = ln(n).match(/^\s*(?:else )?(?:if\((correct >= (\d))\) )?scoreMsg\.textContent = "(.*)";\s*$/);
  if (!m) fail(`placar ${n}`);
  return { condicao: m[1] ?? 'else (correct <= 4)', minimo: m[2] ? Number(m[2]) : 0, mensagem: m[3], origem: origem(n, '<script> QUIZ scoreMsg') };
});
const checklistLines = findAll(/class="checklist-item"/, sFinal.start, sFinal.end);
const criterio = {
  id: 'm03-criterio',
  tipo: 'criterios_do_modulo',
  nota_p18: 'Várias formas literais de critério coexistem na fonte (§ 00, § Quiz, § Final, placar do script, regra do § Ex, regra do § Voz). Registradas sem escolha. P18: nenhum limiar legado declara domínio, aprovação ou competência na camada de produto.',
  criterios: [
    criterioTese,
    {
      id: 'm03-crit-quiz', tipo: 'criterio_quiz', secao: '§ Quiz',
      ...txt(inner(nQuizP, 'p')),
      limiar: { acertos: 8, total: 10, fonte_literal: at(nQuizP, /<strong>(8 de 10)<\/strong>/) },
      marcacao_p14: ['automatizavel', 'P18_limiar_legado_nao_e_evidencia'],
      mensagens_do_script: faixas,
      origem: origem(nQuizP, 'section.aula(§ Quiz) > p'),
    },
    {
      id: 'm03-crit-final', tipo: 'criterio_conclusao', secao: '§ Final',
      titulo_secao: txt(inner(sFinal.h2, 'h2')),
      ...txt(inner(nFinalP, 'p')),
      total_itens: checklistLines.length,
      itens_ref: 'aparato.json → checklist_final.itens (texto literal e marcação P14 por item)',
      marcacao_p14: ['autodeclarado_sem_registro', 'sem_consulta', 'P18_limiar_legado_nao_e_evidencia'],
      nota: 'A marcação é um toggle visual (script CHECKLIST: item.classList.toggle("checked")), sem persistência. A frase combina os 18 itens com "o quiz fechar em 8/10 ou mais".',
      origem: origem(nFinalP, 'section.aula(§ Final) > p'),
    },
    {
      id: 'm03-regra-ex', tipo: 'regra_de_estudo', secao: '§ Ex',
      ...txt(at(nExLead, /class="lead">(.*)<\/p>/)),
      marcacao_p14: ['tentativa_antes_do_gabarito', 'escrita_ou_oral'],
      nota: 'Não é limiar numérico. A fonte revela o gabarito por botão ("Revelar gabarito") sem registrar tentativa.',
      origem: origem(nExLead, 'section.aula(§ Ex) p.lead'),
    },
    {
      id: 'm03-regra-voz', tipo: 'regra_de_estudo', secao: '§ Voz',
      ...txt(at(nVozLead, /class="lead">(.*)<\/p>/)),
      marcacao_p14: ['producao_oral', 'cronometrado_ou_fluencia'],
      nota: '"trinta perguntas-relâmpago — responda sem travar" e "roteiro de cinco minutos para gravar, ouvir e refazer de cabeça": oral e com tempo declarado (5 minutos).',
      origem: origem(nVozLead, 'section.aula(§ Voz) p.lead'),
    },
  ],
};

// ── voz: § Voz + princípios editoriais ──────────────────────
const nV1 = find(/<h3><span class="num">V\.1/, sVoz.start, sVoz.end);
const nOl = find(/<ol/, sVoz.start, sVoz.end);
const nOlEnd = find(/<\/ol>/, nOl);
const nV2 = find(/<h3><span class="num">V\.2/, sVoz.start, sVoz.end);
const nV2p = find(/^\s*<p>/, nV2, sVoz.end);
const nRotTitle = find(/class="case-title"/, sVoz.start, sVoz.end);
const nRotSub = find(/class="case-subtitle"/, sVoz.start, sVoz.end);
const nRotBody = find(/class="case-body"/, sVoz.start, sVoz.end);
const rotPs = findAll(/^\s*<p>/, nRotBody, sVoz.end);
const h3 = (n) => { const m = ln(n).match(/<h3><span class="num">(.*?)<\/span>(.*)<\/h3>/); return { numero: m[1], ...txt(m[2]) }; };
const vozSecao = {
  id: 'm03-voz',
  tipo: 'dominio_oral',
  marcador: { num: sVoz.num, rotulo: sVoz.rotulo },
  titulo_secao: txt(inner(sVoz.h2, 'h2')),
  lead: { ...txt(at(nVozLead, /class="lead">(.*)<\/p>/)), origem: origem(nVozLead, 'section.aula(§ Voz) p.lead') },
  perguntas_relampago: {
    subtitulo: { ...h3(nV1), origem: origem(nV1, 'section.aula(§ Voz) h3') },
    itens: findAll(/<li/, nOl, nOlEnd).map((n, i) => ({
      id: `m03-voz-q${pad(i + 1)}`, tipo: 'pergunta_oral', ordem: i + 1, ...txt(inner(n, 'li')),
      resposta_referencia: null,
      marcacao_p14: ['producao_oral', 'sem_consulta', 'fluencia_sem_travar'],
      origem: origem(n, 'section.aula(§ Voz) ol > li'),
    })),
    resposta_referencia_nota: 'A fonte não traz gabarito para as 30 perguntas-relâmpago. O vínculo pergunta→aula também não é declarado.',
  },
  roteiro_5min: {
    subtitulo: { ...h3(nV2), origem: origem(nV2, 'section.aula(§ Voz) h3') },
    instrucao: { ...txt(inner(nV2p, 'p')), origem: origem(nV2p, 'section.aula(§ Voz) > p') },
    titulo: { ...txt(at(nRotTitle, /case-title">(.*)<\/div>/)), origem: origem(nRotTitle, '.case-study .case-title') },
    subtitulo_roteiro: { ...txt(at(nRotSub, /case-subtitle">(.*)<\/div>/)), origem: origem(nRotSub, '.case-study .case-subtitle') },
    paragrafos: rotPs.map((n, i) => ({ id: `m03-voz-roteiro-p${i + 1}`, ...txt(inner(n, 'p')), origem: origem(n, '.case-study .case-body > p') })),
    marcacao_p14: ['producao_oral', 'cronometrado_ou_fluencia'],
    nota: 'O roteiro usa a mesma marcação visual do caso (.case-study) mas é material de voz, não o caso. O texto do roteiro abre e fecha aspas (fala em primeira pessoa).',
  },
  origem: origem(sVoz.start, 'section.aula .aula-marker "§ Voz"'),
};
const sRef = secao('§ Ref');
const nRefLead = find(/class="lead"/, sRef.start, sRef.end);
const nCalloutLabel00 = nCallout00 + 1;
const principios = [
  { id: 'm03-principio-disciplina-editorial', tipo: 'principio_editorial', rotulo: at(nCalloutLabel00, /callout-label">(.*)<\/div>/), ...txt(inner(nCalloutLabel00 + 1, 'p')), origem: origem(nCallout00, 'section.aula(§ 00) .callout.gold') },
  { id: 'm03-principio-ref', tipo: 'principio_editorial', rotulo: null, ...txt(at(nRefLead, /class="lead">(.*)<\/p>/)), origem: origem(nRefLead, 'section.aula(§ Ref) p.lead') },
  { id: 'm03-principio-rodape', tipo: 'principio_editorial', rotulo: null, ...identidade.rodape.paragrafos[1], nota: 'Segundo parágrafo do rodapé; declara o estatuto didático dos instrumentos.' },
  { id: 'm03-principio-caso-linguagem', tipo: 'exemplo_de_voz', ponteiro: 'aparato.json → caso.linguagem_recomendada', nota: 'Callout "Linguagem GridAlpha para esse caso" dentro do § Caso; conteúdo no grupo aparato.' },
];

// ── § Erros ─────────────────────────────────────────────────
const sErr = secao('§ Erros');
const nErrLead = find(/class="lead"/, sErr.start, sErr.end);
const erros = {
  id: 'm03-erros-comuns',
  tipo: 'erros_comuns',
  marcador: { num: sErr.num, rotulo: sErr.rotulo },
  titulo_secao: txt(inner(sErr.h2, 'h2')),
  lead: { ...txt(at(nErrLead, /class="lead">(.*)<\/p>/)), origem: origem(nErrLead, 'section.aula(§ Erros) p.lead') },
  cabecalho_tabela: [...ln(find(/<th[ >]/, sErr.start, sErr.end)).matchAll(/<th[^>]*>(.*?)<\/th>/g)].map((m) => m[1]),
  itens: findAll(/^\s*<tr><td>/, sErr.start, sErr.end).map((n, i) => {
    const m = ln(n).match(/<tr><td>(.*?)<\/td><td>(.*)<\/td><\/tr>/);
    const ref = m[2].match(/\((Aulas? [^)]*)\)\.?$/);
    return {
      id: `m03-erro-${pad(i + 1)}`, tipo: 'mito_e_correcao', ordem: i + 1,
      mito: txt(m[1]), correcao: txt(m[2]),
      referencia_em_prosa: ref ? ref[1] : null,
      vinculos: { declarado_por_tag: false, nota: 'A referência à aula está em prosa, entre parênteses, no fim da correção (não é tag de posse, §4 do protocolo).' },
      origem: origem(n, 'section.aula(§ Erros) table tbody tr'),
    };
  }),
  ponteiros_callout_red_em_aula: SECOES.filter((s) => /^Aula/.test(s.num)).flatMap((s) => findAll(/class="callout red"/, s.start, s.end).map((n) => ({
    aula: s.num.slice(5), rotulo: at(n + 1, /callout-label">(.*)<\/div>/), origem: origem(n, `${s.num} .callout.red`),
  }))),
  origem: origem(sErr.start, 'section.aula .aula-marker "§ Erros"'),
};
if (erros.itens.length !== 8) fail('Erros: esperava 8');

// ── três níveis (tradutor por público, dentro das aulas) ────
const tresNiveis = SECOES.filter((s) => /^Aula/.test(s.num)).flatMap((s) => findAll(/class="three-levels">/, s.start, s.end).map((n) => {
  const end = blockEnd(n);
  const tabs = findAll(/class="three-levels-tab[" ]/, n, end).map((k) => at(k, /<button[^>]*>(.*)<\/button>/));
  const panels = findAll(/class="three-levels-panel/, n, end).map((k) => ({ ...txt(at(k, /<div class="three-levels-panel[^"]*">(.*)<\/div>/)), linha_aprox: k }));
  return {
    id: `m03-tres-niveis-a${s.num.slice(5)}`, tipo: 'tres_niveis', aula: s.num.slice(5),
    vinculos: { aula_id_codigo: `aula-03-${s.num.slice(5)}`, declarado_por_posicao: true },
    paineis: tabs.map((t, i) => ({ publico: t, ...panels[i] })),
    origem: origem(n, `${s.num} .three-levels`),
  };
}));

// ── "Onde isso entra no produto" (P7: fora da interface) ────
const produto = findAll(/callout-label">Onde isso entra no produto</).map((n) => {
  const s = SECOES.filter((x) => x.start <= n).pop();
  return { secao: s.num, linha_aprox: n };
});

// ── comparação com código e catálogo ────────────────────────
const ts = readCode('content');
const codeAulas = [...ts.matchAll(/id: 'aula-03-(\d\d)',[\s\S]*?title: "(.*?)",\s*subtitle: "(.*?)"/g)].map((m) => ({ n: m[1], title: m[2], subtitle: m[3] }));
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
const blocks = readCode('blocks');
const b03 = blocks.match(/\{ id: 'bloco-03'.*\}/)[0];
const b04 = blocks.match(/\{ id: 'bloco-04'.*\}/)[0];
const trilhas = readCode('trilhas');
const aulasPorBloco = Number(trilhas.match(/'bloco-03':\s*(\d+)/)[1]);
const catalogo = readCode('catalogo');
const catIni = catalogo.indexOf('## Módulo 03 — ');
const catFim = catalogo.indexOf('\n---', catIni);
const catSec = catalogo.slice(catIni, catFim);
const catalogo_canonico = {
  arquivo: CODE.catalogo,
  titulo_linha: catSec.split('\n')[0],
  escala_linha: catSec.match(/\*\*Escala\*\*[^\n]*\n[^\n]*/)[0].replace(/\n/g, ' '),
  trilha_linha: catSec.match(/\*\*Trilha\*\*[^\n]*/)[0],
  aulas_tabela: [...catSec.matchAll(/^\| (\d\d) \| (.*?) \| (.*?) \|$/gm)].map((m) => ({ aula: m[1], tema: m[2], afirma: m[3] })),
  instrumentos_tabela: [...catSec.matchAll(/^\| (INST · \d\d) \| (.*?) \| (.*?) \|$/gm)].map((m) => ({ id: m[1], nome: m[2] })),
};
const catComp = catalogo_canonico.aulas_tabela.map((c) => {
  const r = aulasRot.find((x) => x.marcador_num === `Aula ${c.aula}`);
  return { aula: c.aula, tema_igual_marcador: c.tema === r.marcador_rotulo, afirma_igual_h2: c.afirma === r.titulo.texto };
});

const D = (id, tema, leituras, nota) => ({ id, tema, leituras, nota, decisao: 'não escolhida — registrada (P5/P8/P18/P24)' });
const map05 = mapa.linhas.find((x) => x.aula === '05');
const div = [
  D('div-m03-mod-01-titulo', 'Título do módulo: h1 longo × title/rodapé × catálogo (P24)', [
    { onde: `h1 L${nH1}`, literal: identidade.titulo.texto },
    { onde: `<title> L${nTitle}`, literal: identidade.title_tag.texto },
    { onde: `rodapé L${footerPs[0]}`, literal: identidade.rodape.paragrafos[0].texto },
    { onde: 'catálogo canônico', literal: catalogo_canonico.titulo_linha },
    { onde: 'alexandria-blocks.ts bloco-03', literal: 'Tecnologias de Geração' },
  ], 'title, rodapé e os dois catálogos concordam em "Tecnologias de Geração". O h1 é um título editorial longo. P24: o catálogo governa o nome; o h1 pode virar subtítulo/descritor, nunca segundo título oficial (decisão da camada de produto, não desta extração).'),
  D('div-m03-mod-02-horas', 'Horas estimadas: fonte × catálogo do código', [
    { onde: `hero-meta L${metaLabels[0] + 1}`, literal: identidade.horas.texto },
    { onde: 'alexandria-blocks.ts bloco-03', literal: 'priority: \'confirmar\',  estimatedHoursMin: null, estimatedHoursMax: null' },
    { onde: 'catálogo canônico', literal: catalogo_canonico.escala_linha },
  ], 'A fonte declara "4 – 5 horas"; o código ainda está null. Divergência de preenchimento (P8), não de valor.'),
  D('div-m03-mod-03-proximo-modulo', 'Nome do Módulo 04 em três lugares', [
    { onde: `hero-meta L${metaLabels[3] + 1}`, literal: identidade.meta[3].valor },
    { onde: `§ Final L${nFinalP} / placar L${nScore} / rodapé L${footerPs[2]}`, literal: 'Módulo 04 — Economia de Mercados' },
    { onde: 'alexandria-blocks.ts bloco-04 e catálogo canônico', literal: 'Economia de Mercados de Energia' },
  ], 'A fonte escreve "Economia de Mercados" (sem "de Energia"). P24: catálogo governa o nome.'),
  D('div-m03-mod-04-criterio', 'Formas de critério coexistentes (P18)', [
    { onde: `§ 00 L${ps00[2]}`, literal: criterioTese.texto },
    { onde: `§ Quiz L${nQuizP}`, literal: stripTags(inner(nQuizP, 'p')) },
    { onde: `§ Final L${nFinalP}`, literal: stripTags(inner(nFinalP, 'p')) },
    { onde: `script L${nScore}-${nScore + 3}`, literal: faixas.map((f) => `[${f.condicao}] ${f.mensagem}`).join(' / '), nota_literal: 'mensagens do script separadas por " / " (separador desta extração); o prefixo entre colchetes é a condição do if/else anotada por esta extração, não texto exibido' },
  ], 'Com 7 acertos o script manda "avance para o próximo módulo" (abaixo do 8/10 da prosa); com 8 recebe a mesma mensagem de "Revise"; "Pronto para o Módulo 04" só com ≥9. O § 00 fala em "passa no Bloco 3" com duas capacidades orais; o § Final exige os 18 itens E quiz ≥ 8/10. Nenhuma forma prevalece (P18).'),
  D('div-m03-mod-05-map-aula05', 'Tema da Aula 05: § MAP × marcador da aula', [
    { onde: `§ MAP L${map05.origem.linha_aprox}`, literal: map05.tema },
    { onde: `marcador Aula 05 L${secao('Aula 05').start}`, literal: secao('Aula 05').rotulo },
  ], 'Dois-pontos × travessão. O código usa o marcador como subtitle; o catálogo canônico também usa o marcador.'),
  D('div-m03-mod-06-dez-aulas-origem', 'Onde a fonte declara "Dez aulas"', [
    { onde: `§ MAP h2 L${sMap.h2}`, literal: mapa.titulo_secao.texto },
    { onde: 'alexandria-modulo-03-content.ts (comentário) e alexandria-trilhas.ts (tabela)', literal: 'o hero declara "Dez aulas"' },
  ], 'O hero do M03 não contém "Dez aulas"; a frase está no h2 do § MAP. Imprecisão de proveniência nos comentários do código; a contagem (10) está certa.'),
  D('div-m03-mod-07-marca', 'Marca GridAlpha em texto visível ao learner (P24)', [
    { onde: `header L${nBrandSpan}`, literal: identidade.cabecalho.marca },
    { onde: `hero-meta L${metaLabels[2]}`, literal: `${identidade.meta[2].rotulo} | ${identidade.meta[2].valor}`, nota_literal: 'rótulo | valor da célula (separador desta extração)' },
    { onde: `pull-quote L${nQuote + 2}`, literal: tese.blocos[4].atribuicao },
    { onde: `rodapé L${nFooterBrand}`, literal: identidade.rodape.marca },
    { onde: 'callouts e caso', literal: 'Linguagem GridAlpha para esse caso | GridAlpha Simulate | toda entrega GridAlpha', nota_literal: 'três trechos separados por " | " (separador desta extração)' },
  ], 'Texto literal preservado na camada fonte. P24: na camada de produto, "Alexandria"/"NIVAR"; P7: blocos "Onde isso entra no produto" fora da interface.'),
  D('div-m03-mod-08-cabecalho-versao', 'Cabeçalho "Cobaia Zero v3.0" e comentário de CSS "Módulo 02"', [
    { onde: `header-meta L${nHeaderMeta}`, literal: identidade.cabecalho.meta_texto },
    { onde: `<style> L${find(/Módulo 02 — estilos adicionais/)}`, literal: '/* ===== Módulo 02 — estilos adicionais ===== */' },
  ], 'Resíduo de template: o M03 carrega um bloco de CSS rotulado "Módulo 02". Não afeta conteúdo; "Cobaia Zero" é rótulo interno visível no cabeçalho.'),
  D('div-m03-mod-09-comentario-caso', 'Comentário HTML do caso × marcador visível', [
    { onde: `comentário L${find(/CASO: Operação A/)}`, literal: ln(find(/CASO: Operação A/)).trim() },
    { onde: `case-tag L${find(/class="case-tag"/)}`, literal: at(find(/class="case-tag"/), /case-tag">(.*)<\/div>/) },
  ], 'A fonte do M03 declara explicitamente "Parte 3" (tag e lead: "Parte 1 leu a fatura…; Parte 2, com a lente da rede"). P17 se aplica na camada de produto (título "Caso — Operação A", sem "Partes" da fonte como estrutura). Ver aparato.json.'),
  D('div-m03-mod-10-catalogo-criterio', 'Citação do critério no catálogo canônico truncada', [
    { onde: `§ 00 L${ps00[2]}`, literal: criterioTese.texto },
    { onde: 'catálogo canônico, "Critério de domínio"', literal: (catSec.match(/> "Você passa no Bloco 3[\s\S]*?"\n/) || [''])[0].replace(/\n> ?/g, ' ').replace(/^> /, '').trim() },
  ], 'O catálogo corta a frase em "por que ela ocupa o lugar que ocupa." sem reticências; a fonte continua "na ordem de mérito — usando estrutura de custo, despachabilidade e fator de capacidade, não opinião." O catálogo também omite a sentença "O teste honesto: …".'),
];

const out = {
  grupo: 'modulo',
  modulo: 'm03',
  fonte: { arquivo: SRC, linhas_total: TOTAL_LINHAS, somente_leitura: true },
  gerado_em: hoje,
  gerado_por: 'extratores/m03_modulo.mjs — busca ancorada por linha + regex; nenhum texto de conteúdo digitado',
  convencoes: {
    camada: 'fonte (todos os itens deste arquivo)',
    html: 'fragmento literal da fonte, espaços colapsados, inline preservado',
    texto: 'o mesmo fragmento sem tags e com entidades decodificadas',
    linha_aprox: `linha 1-based no HTML-fonte (${TOTAL_LINHAS} linhas)`,
    marcacao_p14: 'anotação desta extração inferida por regra (verbo inicial, menção a tempo/voz); não é texto da fonte; requer revisão humana',
    null: 'ausência medida na fonte, sempre acompanhada de nota',
  },
  identidade, tese, resultado_esperado: resultado, mapa, roteiro, subsecoes_por_aula: subsecoes, criterio,
  laboratorios: null,
  laboratorios_nota: `A fonte do M03 não tem seção "§ Lab" nem "LAB · NN" (${findAll(/LAB ·|§ Lab/).length} ocorrências). Todos os 9 instrumentos estão dentro de aulas (ver instrumentos.json).`,
  voz: { secao: vozSecao, principios },
  erros_comuns: erros,
  tradutor: null,
  tradutor_nota: `A fonte do M03 não tem "§ Map" (Tradutor) (${findAll(/§ Map</).length} ocorrências). O recurso de tradução por público existe dentro das aulas como "três níveis" (tres_niveis abaixo).`,
  tres_niveis: tresNiveis,
  onde_entra_no_produto: { total: produto.length, ponteiros: produto, nota: 'Callouts gold "Onde isso entra no produto" (um por aula). P7/P24: fora da interface. Só ponteiros; o corpo está no código (MODULO_03_CORPO) e na fonte.' },
  divergencias: div,
  comparacao_codigo: {
    arquivos: [CODE.content, CODE.blocks, CODE.trilhas, CODE.catalogo],
    contagem_aulas: {
      fonte_marcadores: aulasRot.length, fonte_map_linhas: mapa.linhas.length, fonte_prosa_map: mapa.titulo_secao.texto,
      fonte_subsecoes_numeradas: subsecoes.reduce((t, s) => t + s.subsecoes.length, 0),
      codigo_MODULO_03_AULAS: codeAulas.length, codigo_AULAS_POR_BLOCO: aulasPorBloco,
      catalogo_canonico_aulas: catalogo_canonico.aulas_tabela.length,
      confere: aulasRot.length === codeAulas.length && codeAulas.length === aulasPorBloco && aulasPorBloco === catalogo_canonico.aulas_tabela.length,
    },
    titulos: comparacao_titulos,
    catalogo_bloco_03: b03,
    catalogo_bloco_04: b04,
    catalogo_canonico,
    catalogo_canonico_x_fonte_aulas: catComp,
    ausentes_no_codigo: {
      tres_niveis: !/nota de presença/.test(ts),
      tese_familias: !/Capital pesado, combustível zero/.test(ts),
      voz_30_perguntas: !/Trinta perguntas sem travar/.test(ts),
      erros_tabela: !/Vacina contra mitos|A fonte de menor LCOE é a melhor escolha/.test(ts),
      capacidades_resultado: !/nunca mais ser enganado por manchete/.test(ts),
      nota: 'true = o texto não aparece em alexandria-modulo-03-content.ts (grep literal).',
    },
  },
};
writeJson('modulo.json', out);
console.log('ok modulo', { roteiro: roteiro.length, aulas: aulasRot.length, cap: resultado.itens.length, map: mapa.linhas.length, erros: erros.itens.length, voz: vozSecao.perguntas_relampago.itens.length, roteiroPs: vozSecao.roteiro_5min.paragrafos.length, tres: tresNiveis.length, produto: produto.length, div: div.length, checklist: checklistLines.length });
console.log(JSON.stringify(comparacao_titulos.filter((c) => !c.title_igual_h2 || !c.subtitle_igual_marcador || !c.marcador_igual_map_tema)));
console.log(JSON.stringify(catComp.filter((c) => !c.tema_igual_marcador || !c.afirma_igual_h2)));
console.log(out.comparacao_codigo.contagem_aulas, out.comparacao_codigo.ausentes_no_codigo);
