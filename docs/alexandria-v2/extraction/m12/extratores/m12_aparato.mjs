// Extrator do aparato do M12 → aparato.json
// §Caso, §Quiz (script), §Final (checklist), §Ex (índice), §Ref, §Lex.
import fs from 'node:fs';
import {
  html, SRC, CATALOGO, hx, texto, inline, origem, section, secIdOf, wrapOf, childrenOf, bloco, all, lineOf,
  scriptBlock, scriptVar, pad, writeJson, importTs, fail,
} from './m12_lib.mjs';

const content = await importTs('alexandria-modulo-12-content.ts');
const glos = (await importTs('alexandria-glossario.ts')).ALEXANDRIA_GLOSSARIO;
const catalogo = fs.readFileSync(CATALOGO, 'utf8');
const P = (sec) => childrenOf(wrapOf(sec)).map(bloco);

// ── §Caso ────────────────────────────────────────────────────
const casoBl = P('caso');
const passos = casoBl.find((b) => b.tipo === 'lista_passos');
const quinto = casoBl.find((b) => b.tipo === 'paragrafo' && /quinto item/.test(b.texto));
const caso = {
  id: 'm12-caso', tipo: 'caso', camada: 'fonte', secao: secIdOf(section('caso')),
  titulo_fonte: secIdOf(section('caso')).rotulo,
  blocos: casoBl.map((b, i) => ({ id: `m12-caso-${pad(i + 1)}`, ...b })),
  partes: casoBl.filter((b) => b.tipo === 'subtitulo').map((b) => ({ numero: b.numero, titulo: b.texto, origem: b.origem })),
  dados: null,
  dados_nota: 'O caso não traz dado numérico da operação (o lede declara "nunca valor específico, operação sempre anonimizada"). O perfil da Operação A vem só como enumeração no lede, que remete às "onze partes anteriores" de outros módulos.',
  perguntas: [
    ...passos.itens.map((p, i) => ({ id: `m12-caso-perg-${pad(i + 1)}`, secao: '§C.1', titulo: p.titulo, vetor: p.etiqueta, pergunta: p.pergunta_em_negrito, contexto: { html: p.html, texto: p.texto } })),
    { id: 'm12-caso-perg-05', secao: '§C.1', titulo: null, vetor: null, pergunta: (quinto.html.match(/(A Operação A tem inventário corporativo, tem inventário de\s+produto, ou não tem nenhum dos dois\?)/) || [])[1]?.replace(/\s+/g, ' ') ?? null,
      nota: 'Quinto item: "não é pergunta ao investidor mas verificação interna"; liga o caso à Aula 05 e ao Instrumento 07 (prosa).', contexto: { html: quinto.html, texto: quinto.texto } },
  ],
  perguntas_nota: 'As perguntas são as que "a Operação A precisaria fazer antes de olhar o número" (dirigidas ao investidor), não perguntas ao learner. A fonte não pede resposta ao learner.',
  decisao: null,
  decisao_nota: 'A fonte recusa explicitamente decisão fechada: "A leitura correta não é "aceite" nem "recuse"" (box cy "O diagnóstico, sem recomendação") e §C.2 conclui "não reestruturar nada em cima de texto que ainda pode mudar". Desafio de decisão, se houver, é camada Alexandria (P17).',
  tabela_c2: casoBl.find((b) => b.tipo === 'tabela'),
  vinculos_em_prosa: [
    { alvo: 'Aula 05', trecho: 'liga esta parte diretamente à Aula 05', linha_aprox: lineOf(html.indexOf('liga esta parte diretamente à Aula 05')) },
    { alvo: 'Inst · 07', trecho: 'Pelo diagnóstico do Instrumento 07', linha_aprox: lineOf(html.indexOf('Pelo diagnóstico do Instrumento 07')) },
    { alvo: 'Módulo 11', trecho: 'a mesma separação que o Módulo 11 aplicou a uma proposta solar', linha_aprox: lineOf(html.indexOf('mesma separação que o')) },
  ],
};

// ── §Quiz ────────────────────────────────────────────────────
const qb = scriptBlock('QUIZ');
const Q = scriptVar(qb, 'Q');
const qStart = html.indexOf('var Q=', qb.start);
const qIdx = all(/\{q:'/g, qStart, qb.end).map((x) => x.idx);
const quiz = {
  id: 'm12-quiz', tipo: 'quiz', camada: 'fonte', secao: secIdOf(section('quiz')),
  lede: P('quiz').find((b) => b.tipo === 'lede'),
  botoes: [...section('quiz').body.matchAll(/<button class="btn(?: ghost)?" id="(quiz-go|quiz-reset)">(.*?)<\/button>/g)].map((m) => ({ id: m[1], rotulo: m[2] })),
  rotulo_questao_script: "'Questão '+(i+1)+' de '+Q.length",
  questoes: Q.valor.map((q, i) => ({
    id: `m12-quiz-${pad(i + 1)}`, ordem: i + 1, enunciado: q.q,
    alternativas: q.o.map((t, j) => ({ indice: j, letra: 'abcd'[j], texto: t, correta: j === q.a })),
    gabarito_indice: q.a, explicacao: q.f,
    vinculo_aula: null,
    origem: origem(qIdx[i], 'script QUIZ var Q'),
  })),
  faixas: [
    { condicao: 'acertos>=8', classe: 'score show pass', mensagem_ref: 'modulo.json criterio.criterios[m12-crit-quiz].mensagens_do_script[0]' },
    { condicao: 'acertos<8', classe: 'score show fail', mensagem_ref: 'modulo.json criterio.criterios[m12-crit-quiz].mensagens_do_script[1]' },
  ],
  comportamento: 'Corrigir marca a correta (right) e a escolhida errada (wrong) e mostra a explicação de TODAS as questões, respondidas ou não; placar "acertos / 10". Refazer reconstrói o quiz. Sem persistência.',
  nota: 'O quiz existe só no script; o código (src/lib/data) não tem quiz do M12. Distribuição do gabarito: ' + Q.valor.map((q) => 'abcd'[q.a]).join(''),
  script_linhas: [Q.linha_ini, Q.linha_fim],
};
if (quiz.questoes.length !== 10) fail('10 questões');

// ── §Final (checklist) ──────────────────────────────────────
const ck = P('final').find((b) => b.tipo === 'lista_ul');
const ckIdx = all(/<li>/g, section('final').start, section('final').end).map((x) => x.idx);
const checklist = {
  id: 'm12-checklist', tipo: 'checklist_final', camada: 'fonte', secao: secIdOf(section('final')),
  lede: P('final').find((b) => b.tipo === 'lede'),
  itens: ck.itens.map((it, i) => ({ id: `m12-check-${pad(i + 1)}`, ordem: i + 1, ...it, destaque_negrito: /<b>/.test(it.html), origem: origem(ckIdx[i], 'section#final ul.ck > li') })),
  nota: 'Marcação P14 dos itens em modulo.json (criterio m12-crit-final). O h2 declara "Vinte e oito itens"; o markup tem ' + ck.itens.length + '.',
};

// ── §Ex ──────────────────────────────────────────────────────
const exSec = section('ex');
const code = content.MODULO_12_EXERCICIOS_SOLTOS;
const exercicios = all(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<div class="det-bd">([\s\S]*?)<\/div>\s*<\/details>/g, exSec.start, exSec.end).map(({ m, idx }, i) => {
  const sm = m[1].match(/^Exercício (\d\d) · (.*?) — ([\s\S]*)$/);
  const ps = [...m[2].matchAll(/<p>([\s\S]*?)<\/p>/g)].map((x) => x[1]);
  const en = ps.find((p) => /^<b>Enunciado\.<\/b>/.test(p));
  const rm = ps.filter((p) => /^<b>Resposta-modelo\.<\/b>/.test(p));
  const outros = ps.filter((p) => p !== en && !rm.includes(p));
  const todo = texto(m[1] + ' ' + m[2]);
  const aulaRefs = [...new Set((todo.match(/Aula \d\d/g) || []))];
  const modRefs = [...new Set((todo.match(/Módulo \d\d/g) || []))];
  const c = code.find((x) => x.id === `ex-12-${sm[1]}`);
  const gabFonte = texto(ps.join(' '));
  const cmp = c ? {
    id: c.id, kind: c.kind, points: c.points, prompt_igual_summary: c.prompt === inline(m[1]).replace(/&quot;/g, '"') || texto(c.prompt) === texto(m[1]),
    gabarito_igual_enunciado_mais_resposta: texto(c.config.gabarito) === gabFonte,
    enunciado_dentro_do_gabarito: !!en && texto(c.config.gabarito).startsWith('Enunciado.'),
  } : null;
  return {
    id: `m12-ex-${sm[1]}`, tipo: 'exercicio', camada: 'fonte', numero: sm[1],
    summary_literal: { ...hx(m[1]) }, tag: sm[2], tipo_fonte: sm[2].split(' ')[0], resumo: { ...hx(sm[3]) },
    enunciado: en ? hx(en.replace(/^<b>Enunciado\.<\/b>\s*/, '')) : null,
    enunciado_nota: en ? undefined : 'Sem parágrafo "Enunciado."; a consigna é o próprio resumo do summary.',
    resposta_referencia: rm.length ? hx(rm.map((x) => x.replace(/^<b>Resposta-modelo\.<\/b>\s*/, '')).join(' ')) : null,
    rotulo_resposta: rm.length ? 'Resposta-modelo.' : null,
    outros_paragrafos: outros.length ? outros.map(hx) : null,
    criterio: null,
    marcacao_p14_nota: 'producao_oral_ou_livre vale para os 14 pelo lede do §Ex ("Responda em voz alta antes de abrir o gabarito"); cronometrado quando o resumo pede "dois minutos". Inferência desta extração.',
    criterio_nota: 'Nenhum critério próprio. Critério comum do §Ex (lede): responder em voz alta antes de abrir o gabarito.',
    marcacao_p14: [/dois minutos/.test(todo) ? 'cronometrado' : null, 'producao_oral_ou_livre', /Classificação/.test(sm[2]) ? 'classificacao' : null].filter(Boolean),
    aula_vinculada: null,
    sem_aula: true,
    referencias_em_prosa: { aulas: aulaRefs, modulos: modRefs },
    vinculo_nota: 'A tag (summary) não aponta aula (padrão desde o M04). Referência em prosa não é tag de posse (§4 do protocolo).',
    codigo: cmp,
    origem: origem(idx, 'section#ex details > summary'),
  };
});
if (exercicios.length !== 14) fail('14 exercícios');

// ── §Ref ─────────────────────────────────────────────────────
const refSec = section('ref');
const refH2 = secIdOf(refSec).h2;
const referencias = all(/<li><span class="src">(.*?)<\/span>([\s\S]*?) <a href="([^"]*)">([\s\S]*?)<\/a><\/li>/g, refSec.start, refSec.end).map(({ m, idx }, i) => {
  const [inst, tipoRef] = m[1].split(' · ');
  const datas = m[2].match(/\d{1,2}º? de [a-zç]+ de \d{4}|(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro) de \d{4}/g);
  const hrefSemProto = m[3].replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return {
    id: `m12-ref-${pad(i + 1)}`, tipo: 'referencia', camada: 'fonte', ordem: i + 1,
    rotulo_src: m[1], instituicao: inst, categoria: tipoRef ?? null,
    titulo: hx(m[2]), url: m[3], texto_do_link: m[4],
    // Verificação (2026-09-17): a barra final é ignorada nos DOIS lados; antes só o href
    // perdia a barra e o ref-08 (texto = URL, com barra) virava falso "encurtado".
    link_texto_igual_url: m[4].replace(/\/$/, '') === hrefSemProto,
    datas_no_texto: datas,
    data_consulta: '2 de agosto de 2026',
    data_consulta_origem: `h2 do §Ref: "${refH2.texto}"`,
    origem: origem(idx, 'section#ref ul.ref-list > li'),
  };
});
if (referencias.length !== 34) fail('34 referências, achei ' + referencias.length);

// ── §Lex ─────────────────────────────────────────────────────
const lexSec = section('lex');
const familias = all(/<details>\s*<summary>(Família (\d) · (.*?) — (\d+) termos)<\/summary>\s*<div class="det-bd">([\s\S]*?)<\/div>\s*<\/details>/g, lexSec.start, lexSec.end).map(({ m, idx }) => {
  const base = idx + m[0].indexOf('<div class="det-bd">');
  const termos = all(/<p><span class="term">(.*?)<\/span> — ([\s\S]*?)<\/p>/g, base, idx + m[0].length).map(({ m: t, idx: ti }) => ({
    termo: t[1], definicao: hx(t[2]), origem: origem(ti, 'section#lex details p > span.term'),
  }));
  return { numero: Number(m[2]), nome: m[3], resumo: m[1], declarados: Number(m[4]), contados: termos.length, termos, origem: origem(idx, 'section#lex details > summary') };
});
const termosAll = familias.flatMap((f) => f.termos.map((t) => ({ ...t, familia: f.numero })));
const norm = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
const glosIdx = new Map(); for (const g of glos) { const k = norm(g.term.replace(/\s*\(.*\)$/, '')); if (!glosIdx.has(k)) glosIdx.set(k, []); glosIdx.get(k).push(g.id); }
const glossario = {
  id: 'm12-glossario', tipo: 'glossario', camada: 'fonte', secao: secIdOf(lexSec),
  lede: P('lex').find((b) => b.tipo === 'lede'),
  familias: familias.map((f) => ({ ...f, termos: undefined, contagem_confere: f.declarados === f.contados })),
  termos: termosAll.map((t, i) => ({
    id: `m12-lex-${String(i + 1).padStart(3, '0')}`, ...t,
    no_codigo_m12: false,
    mesmo_termo_em_outro_modulo_no_codigo: glosIdx.get(norm(t.termo)) ?? [],
  })),
  contagem: { prosa_h2: secIdOf(lexSec).h2.texto, pill_hero: '152 termos', soma_declarada_familias: familias.reduce((a, f) => a + f.declarados, 0), markup: termosAll.length, span_term_no_arquivo: (html.match(/class="term"/g) || []).length },
  codigo: { verbetes_m12_no_glossario: glos.filter((g) => g.id.startsWith('gl-m12-')).length, faltam_no_codigo: termosAll.length, nota: 'alexandria-glossario.ts cobre M01–M08; nenhum verbete gl-m12-*. Todos os 152 termos faltam no código (lista completa em termos[]).' },
};

// catálogo × famílias
const catSec = catalogo.slice(catalogo.indexOf('## Módulo 12 —'), catalogo.indexOf('## Módulo 13 —'));
const catFam = [...catSec.replace(/\n/g, ' ').matchAll(/([A-ZÇÁÉ][^();]*?) \((\d+) —/g)].map((m) => ({ nome: m[1].replace(/^.*: /, '').trim(), n: Number(m[2]) }));

// Verificação 2026-09-17: leitura_b da div-a-07 passa a ser trecho literal do catálogo (antes repetia a leitura_a).
const catFam1Literal = (() => { const c = catSec.replace(/\s+/g, ' '); const i = c.indexOf('Grandezas e contabilidade energética (19 —'); return c.slice(i, c.indexOf(')', i) + 1); })();
// ── divergências ─────────────────────────────────────────────
const D = (id, escopo, tema, a, b, nota) => ({ id, escopo, tema, leitura_a: a, leitura_b: b, nota, decisao: 'não escolhida — registro' });
const exSemEn = exercicios.filter((e) => !e.enunciado).map((e) => e.numero);
const refLinkDif = referencias.filter((r) => !r.link_texto_igual_url);
const divergencias = [
  D('div-a-01', 'fonte × código', 'Exercícios: enunciado dentro do gabarito', { onde: 'fonte details', texto: 'summary = consigna; p "Enunciado." visível só ao abrir; p "Resposta-modelo."' }, { onde: 'MODULO_12_EXERCICIOS_SOLTOS', texto: 'prompt = summary; config.gabarito = Enunciado + Resposta-modelo concatenados' }, `Em ${exercicios.filter((e) => e.codigo?.enunciado_dentro_do_gabarito).length} exercícios o enunciado fica escondido no gabarito do código (C7: tentativa antes da referência).`),
  D('div-a-02', 'fonte × código', 'Pontuação dos exercícios', { onde: 'fonte', texto: 'nenhuma pontuação' }, { onde: 'código', texto: `points: ${[...new Set(code.map((c) => c.points))].join(',')}` }, 'Número sem origem.'),
  D('div-a-03', 'fonte × fonte', 'Exercícios sem parágrafo "Enunciado."', { onde: 'exercícios ' + exSemEn.join(', '), texto: 'só summary + Resposta-modelo' }, { onde: 'demais', texto: 'summary + Enunciado + Resposta-modelo' }, 'Estrutura irregular na fonte; a consigna desses fica no summary.'),
  D('div-a-04', 'fonte × fonte', 'Texto do link × URL nas referências', { onde: refLinkDif.map((r) => r.id).join(', '), texto: refLinkDif.map((r) => r.texto_do_link).join(' | ') }, { onde: 'href', texto: refLinkDif.map((r) => r.url).join(' | ') }, 'O texto exibido encurta a URL (query ou caminho cortado). Mantido como está.'),
  D('div-a-05', 'fonte × código', 'Glossário ausente', { onde: '§Lex', texto: `${termosAll.length} termos em 8 famílias` }, { onde: 'alexandria-glossario.ts', texto: '0 verbetes gl-m12-*' }, 'P22: a contagem exibida deve ser derivada da coleção; hoje a coleção do M12 está vazia no código.'),
  D('div-a-06', 'fonte × código', 'Caso, quiz, checklist e referências', { onde: 'fonte', texto: '§Caso, §Quiz (10), §Final (28), §Ref (34)' }, { onde: 'src/lib/data', texto: 'ausentes (aulas com references: [])' }, 'Dependência para C1/C8/C10.'),
  D('div-a-07', 'fonte × catálogo', 'Famílias do glossário no catálogo', { onde: 'fonte', texto: familias.map((f) => `${f.nome} (${f.declarados})`).join('; ') }, { onde: 'catálogo §Módulo 12 · Termos centrais (Família 1)', texto: catFam1Literal }, `Verificação 2026-09-17: nomes e contagens das 8 famílias são iguais nas duas pontas (${catFam.map((f) => `${f.nome} (${f.n})`).join('; ')}). A diferença é só de recorte: o catálogo lista parte dos termos de cada família (a Família 1 cita 12 nomes para 19 verbetes) e junta pares com "×" ("Estoque × fluxo de capital", "Regime transitório × definitivo"), que na fonte são verbetes separados.`),
  D('div-a-08', 'fonte × fonte', 'Sigla CBAM sem glosa', { onde: '§C.1 h3 L2303', texto: 'A conversa que o CBAM torna cada vez mais comum' }, { onde: '§Lex lede L2847 e Família 4 L2941', texto: 'Onde houver jargão em inglês corrente no mercado, ele vem com glosa em português. | Mecanismo de ajuste de carbono na fronteira' }, `O verbete da Família 4 não traz a sigla. Única ocorrência de "CBAM" no arquivo (${(html.match(/CBAM/g) || []).length}×). Mantido literal.`),
];

writeJson('aparato.json', {
  grupo: 'aparato', modulo: 'm12', fonte: SRC, camada: 'fonte',
  gerado_por: 'extratores/m12_aparato.mjs (Node 24): regex por seção + avaliação do literal var Q do script',
  contagens: {
    caso: { secoes: caso.partes.length, blocos: caso.blocos.length, perguntas: caso.perguntas.length, linhas_tabela: caso.tabela_c2.linhas.length, decisao: 0 },
    quiz: { questoes: quiz.questoes.length, alternativas_por_questao: 4, faixas: quiz.faixas.length },
    checklist: checklist.itens.length,
    exercicios: { total: exercicios.length, com_aula: 0, sem_aula: exercicios.length, com_enunciado: exercicios.filter((e) => e.enunciado).length, por_tipo: exercicios.reduce((a, e) => ({ ...a, [e.tipo_fonte]: (a[e.tipo_fonte] || 0) + 1 }), {}), cronometrados: exercicios.filter((e) => e.marcacao_p14.includes('cronometrado')).length },
    referencias: { total: referencias.length, com_url: referencias.filter((r) => r.url).length, link_encurtado: refLinkDif.length, com_data_no_texto: referencias.filter((r) => r.datas_no_texto).length },
    glossario: { familias: familias.length, termos: termosAll.length, faltam_no_codigo: termosAll.length, com_homonimo_em_outro_modulo: glossario.termos.filter((t) => t.mesmo_termo_em_outro_modulo_no_codigo.length).length },
  },
  divergencias, caso, quiz, checklist, exercicios, referencias, glossario,
});
console.log(JSON.stringify(JSON.parse(fs.readFileSync('C:/dev/gridalpha-v2-alexandria-v2-restructure/docs/alexandria-v2/extraction/m12/aparato.json', 'utf8')).contagens));
console.log(JSON.stringify(familias.map((f) => [f.numero, f.declarados, f.contados])), JSON.stringify(catFam));
console.log(JSON.stringify(exercicios.map((e) => [e.numero, e.tag, !!e.enunciado, e.codigo?.prompt_igual_summary, e.codigo?.gabarito_igual_enunciado_mais_resposta, e.referencias_em_prosa])));
console.log(JSON.stringify(caso.perguntas.map((p) => p.pergunta)));
