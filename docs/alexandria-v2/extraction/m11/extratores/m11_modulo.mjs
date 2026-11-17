// Extração programática do grupo "modulo" do M11 → modulo.json.
// Texto de conteúdo sai do arquivo-fonte por árvore (m11_lib) — nada digitado.
import fs from 'node:fs';
import * as L from './m11_lib.mjs';
import { wrapOf, marcador, blocos } from './m11_blocos.mjs';

const fail = (m) => { throw new Error(m); };
const cod = await L.loadCodigo();
const CONTENT = L.readRepo('src/lib/data/alexandria-modulo-11-content.ts');
const BLOCKS_TS = L.readRepo('src/lib/data/alexandria-blocks.ts');
const TRILHAS_TS = L.readRepo('src/lib/data/alexandria-trilhas.ts');
const BADGES_TS = L.readRepo('src/lib/data/alexandria-badges.ts');
const RECURSOS_TSX = L.readRepo('src/components/alexandria/navigation/RecursosDoModulo.tsx');
const CAT = fs.readFileSync(L.CATALOGO, 'utf8');

// ── identidade ───────────────────────────────────────────────
const hero = L.find(L.DOC, (x) => x.tag === 'div' && L.hasClass(x, 'hero'));
const kicker = L.find(hero, (x) => L.hasClass(x, 'kicker'));
const h1 = L.find(hero, (x) => x.tag === 'h1');
const sub = L.find(hero, (x) => L.hasClass(x, 'sub'));
const pills = L.byClass(hero, 'pill');
const titleTag = L.byTag(L.DOC, 'title')[0];
const footer = L.byTag(L.DOC, 'footer')[0];
const footPs = L.byTag(footer, 'p');
const pillObj = pills.map((p, i) => {
  const t = L.stripTags(L.inner(p));
  const b = L.find(p, (x) => x.tag === 'b');
  return { id: `m11-hero-pill-${L.pad(i + 1)}`, ...L.lit(p), valor_em_negrito: b ? L.stripTags(L.inner(b)) : null, origem: L.origem(p, '.hero .pill-row .pill') };
});
const gaCount = (L.RAW.match(/GridAlpha/g) || []).length;
const gaLines = L.LINES.map((l, i) => (/GridAlpha/.test(l) ? i + 1 : null)).filter(Boolean);

// eixos: § 00.1 — quatro parágrafos que abrem com <b>Eixo N — …</b>
const { sec: secTese, wrap: wTese } = wrapOf('tese');
const eixos = L.kids(wTese, (x) => x.tag === 'p' && /^<b>Eixo \d/.test(L.inner(x).trim())).map((p, i) => {
  const h = L.inner(p);
  const b = h.match(/^\s*<b>([\s\S]*?)<\/b>/)[1];
  return { id: `m11-eixo-${i + 1}`, rotulo: L.stripTags(b), ...L.lit(p), origem: L.origem(p, 'section#tese h3(00.1) ~ p') };
});
if (eixos.length !== 4) fail('esperava 4 eixos');

const identidade = {
  id: 'm11-identidade', tipo: 'identidade',
  title_tag: { texto: L.stripTags(L.inner(titleTag)), origem: L.origem(titleTag, 'head > title') },
  kicker: { ...L.lit(kicker), origem: L.origem(kicker, '.hero .kicker') },
  titulo: { ...L.lit(h1), origem: L.origem(h1, '.hero h1') },
  subtitulo: { ...L.lit(sub), origem: L.origem(sub, '.hero p.sub') },
  pills: pillObj,
  horas: null,
  horas_nota: 'A fonte não declara carga horária do módulo: nenhum "hora"/"horas" como duração fora do <style> (as 3 ocorrências de "hora" são de unidade: "quilowatt-hora" L1525 e L2738, "megawatt-hora" L2487). O único tempo declarado no hero é a pill "roteiro oral 10 min" (duração do § Voz, não do módulo). alexandria-blocks.ts também tem estimatedHoursMin/Max = null para bloco-11.',
  eixos,
  eixos_nota: 'Diferente do M01, aqui os eixos SÃO declarados: § 00.1 "Os quatro eixos" (h3 L476), um parágrafo por eixo.',
  rodape: {
    linhas: footPs.map((p) => ({ ...L.lit(p), origem: L.origem(p, 'footer p') })),
  },
  marca_gridalpha: { ocorrencias: gaCount, linhas: gaLines, nota: 'Contagem literal de "GridAlpha" no arquivo inteiro (P24: registro de proveniência; o texto fica literal nesta camada).' },
};

// ── § 00 tese ────────────────────────────────────────────────
const tese = {
  id: 'm11-tese', tipo: 'tese',
  marcador: marcador(secTese),
  titulo_secao: { ...L.lit(secTese.h2), origem: L.origem(secTese.h2, 'section#tese h2') },
  blocos: blocos(wTese, 'm11-tese', 'tese'),
  origem: L.origem(secTese.secId, 'section#tese .sec-id'),
};

// ── resultado esperado ───────────────────────────────────────
const resultado_esperado = {
  id: 'm11-resultado-esperado',
  capacidades: null,
  nota: 'A fonte não tem bloco "Resultado esperado" nem lista de capacidades: zero ocorrência de "Resultado esperado" como rótulo, "você será capaz", "ao final deste" (a única ocorrência de "resultado esperado", em minúsculas, é alternativa da Q10 do quiz, L3913). Pontos da fonte que falam do que o módulo entrega, SEM serem lista de capacidades (não promovidos a capacidade): § 00.3 último parágrafo ("O que este módulo entrega no lugar é melhor…", ver tese.blocos), lede da Aula 08 (critério de domínio, ver criterios), lede do § Final e os 28 itens do checklist (ver criterios).',
  ponteiros: [
    { onde: 'section#tese § 00.3', linha_aprox: L.findLine(/O que este módulo entrega no lugar é melhor/) },
    { onde: 'section#a08 p.lede', linha_aprox: L.findLine(/Esta aula converte as sete anteriores em procedimento/) },
    { onde: 'section#final p.lede', linha_aprox: L.findLine(/O primeiro item é a execução completa da avaliação cronometrada/) },
  ],
};

// ── § MAP ────────────────────────────────────────────────────
const { sec: secMap, wrap: wMap } = wrapOf('map');
const segMap = L.find(wMap, (x) => x.attrs.id === 'mp-seg');
const lentes = L.kids(segMap, (x) => x.tag === 'button').map((b) => ({ valor: b.attrs['data-l'], rotulo: L.stripTags(L.inner(b)), padrao: L.hasClass(b, 'on'), origem: L.origem(b, '#mp-seg > button') }));
const itensStart = L.findLine(/var ITENS=\[/);
const itensEnd = L.findLine(/^\s*\];\s*$/, itensStart);
const ITENS = L.evalLiteral(itensStart, itensEnd);
const mapa = {
  id: 'm11-mapa', tipo: 'mapa_do_modulo',
  marcador: marcador(secMap),
  titulo_secao: { ...L.lit(secMap.h2), origem: L.origem(secMap.h2, 'section#map h2') },
  blocos: blocos(wMap, 'm11-map', 'map'),
  perguntas_por_aula: null,
  perguntas_por_aula_nota: 'Diferente do M01 (tabela aula × pergunta), o § MAP do M11 ("Anatomia") não lista pergunta por aula: é uma seção com lede, o INST·01 e três parágrafos. As "perguntas" que o § MAP declara são as quatro LENTES do INST·01 (rótulos dos botões) aplicadas aos dez itens da proposta (script ITENS). Nenhuma aula é citada no § MAP.',
  lentes_como_perguntas: lentes,
  itens_da_proposta: ITENS.map((o, i) => ({ chave: o.k, rotulo: o.n, origem: { seletor: 'script INST·01 var ITENS[].n', trecho_inicial: o.n, linha_aprox: L.findLine(new RegExp(`\\{k:'${o.k}',n:`), itensStart, itensEnd) } })),
  instrumento: 'm11-inst-01 (ver instrumentos.json)',
  origem: L.origem(secMap.secId, 'section#map .sec-id'),
};

// ── roteiro ──────────────────────────────────────────────────
const roteiro = L.sections.map((s, i) => {
  const mk = marcador(s);
  const isAula = /^Aula \d\d$/.test(mk.num);
  const h3s = L.findAll(s.node, (x) => x.tag === 'h3').map((h) => {
    const num = L.find(h, (x) => L.hasClass(x, 'num'));
    return { numero: num ? L.stripTags(L.inner(num)) : null, texto: L.stripTags(L.inner(h).replace(/<span class="num">[\s\S]*?<\/span>/, '')), linha_aprox: h.line };
  });
  const insts = L.byClass(s.node, 'inst').map((n) => L.stripTags(L.inner(L.find(n, (x) => L.hasClass(x, 'id')))));
  const fichas = L.byClass(s.node, 'fi').map((n) => {
    const sg = L.find(n, (x) => L.hasClass(x, 'sg')); const tp = L.find(n, (x) => L.hasClass(x, 'tp'));
    return { sigla: L.stripTags(L.inner(sg)), tipo: L.stripTags(L.inner(tp)), linhas_pares: L.byClass(n, 'fi-row').length, linha_aprox: n.line };
  });
  return {
    id: isAula ? `m11-roteiro-aula-${mk.num.slice(5)}` : `m11-roteiro-${s.id}`,
    tipo: isAula ? 'aula' : 'aparato',
    ordem_na_fonte: i + 1,
    section_id: s.id,
    marcador_num: mk.num,
    marcador_rotulo: mk.rotulo,
    titulo: L.lit(s.h2),
    subsecoes: h3s,
    instrumentos_na_secao: insts,
    fichas_de_campo_fixo: fichas,
    vinculos: isAula ? { aula_id_codigo: `aula-11-${mk.num.slice(5)}` } : {},
    origem: L.origem(s.secId, `section#${s.id} .sec-id`),
  };
});
const aulasRot = roteiro.filter((r) => r.tipo === 'aula');
if (aulasRot.length !== 8) fail('esperava 8 aulas');

// ── critérios ────────────────────────────────────────────────
const p14 = (t) => {
  const tags = [];
  if (/\b(trinta|cinco|dez) minutos\b|cronometrad/i.test(t)) tags.push('cronometrado');
  if (/^Sei dizer|\bdizer\b|em voz alta/i.test(t)) tags.push('producao_oral_ou_livre');
  if (/^(Verifiquei|Confirmei|Comparei|Identifiquei|Obtive|Registrei|Separei|Classifiquei|Solicitei|Executei|Em )/.test(t)) tags.push('verificacao_documental_em_proposta_real');
  if (/^Reconstruí/.test(t)) tags.push('calculo');
  return tags;
};
const { sec: secFinal, wrap: wFinal } = wrapOf('final');
const ck = L.find(wFinal, (x) => x.tag === 'ul' && L.hasClass(x, 'ck'));
const checklist = L.kids(ck, (x) => x.tag === 'li').map((li, i) => ({ id: `m11-check-${L.pad(i + 1)}`, tipo: 'item_de_checklist', ordem: i + 1, ...L.lit(li), marcacao_p14: p14(L.stripTags(L.inner(li))), origem: L.origem(li, 'section#final ul.ck > li') }));
const finalLede = L.find(wFinal, (x) => L.hasClass(x, 'lede'));
const { sec: secQuiz, wrap: wQuiz } = wrapOf('quiz');
const quizLede = L.find(wQuiz, (x) => L.hasClass(x, 'lede'));
const lnScore = L.findLine(/sc\.className='score show '\+\(acertos>=8\?'pass':'fail'\)/);
const lnPass = L.findLine(/\? 'Critério atingido\./, lnScore);
const lnFail = L.findLine(/: 'Abaixo do critério de oito acertos\./, lnScore);
const msg = (ln) => L.LINES[ln - 1].match(/'(.*)'\)?\+?\s*$/)[1];
const a08 = wrapOf('a08');
const a08Lede = L.find(a08.wrap, (x) => L.hasClass(x, 'lede'));
const { sec: secVoz, wrap: wVoz } = wrapOf('voz');
const vozBlocos = blocos(wVoz, 'm11-voz', 'voz');
const { wrap: wEx } = wrapOf('ex');
const exLede = L.find(wEx, (x) => L.hasClass(x, 'lede'));
const regraOrdem = L.kids(wTese, (x) => x.tag === 'p' && /regra de ordem que organiza a avaliação cronometrada/.test(L.inner(x)))[0];
const inst11 = L.byClass(L.DOC, 'inst').find((n) => /Inst · 11/.test(L.inner(n)));
const inst11Note = L.find(inst11, (x) => L.hasClass(x, 'srcnote'));
const criterios = {
  id: 'm11-criterios', tipo: 'criterios_do_modulo',
  nota_p18: 'P18: nenhum destes limiares vira "aprovado"/"dominado" no produto. Registrados literalmente. Diferente do M01, prosa do quiz (8 de 10) e script (acertos>=8) CONCORDAM aqui.',
  itens: [
    { id: 'm11-crit-dominio-a08', tipo: 'criterio_de_dominio', secao: 'Aula 08', ...L.lit(a08Lede), marcacao_p14: ['cronometrado', 'producao_oral_ou_livre'], nota_p14: '"em trinta minutos" (tempo) e duas dimensões de julgamento sobre proposta real; não automatizável.', origem: L.origem(a08Lede, 'section#a08 p.lede') },
    { id: 'm11-crit-regra-de-ordem', tipo: 'regra_de_procedimento_do_criterio', secao: '§ 00.2', ...L.lit(regraOrdem), marcacao_p14: ['cronometrado'], origem: L.origem(regraOrdem, 'section#tese h3(00.2) ~ p') },
    {
      id: 'm11-crit-quiz', tipo: 'criterio_quiz', secao: '§ Quiz',
      titulo_secao: L.lit(secQuiz.h2), lede: L.lit(quizLede),
      limiar: { acertos: 8, total: 10, literais: ['critério de aprovação 8 de 10', 'O critério é oito acertos'] },
      script: {
        condicao_literal: "acertos>=8",
        codigo: L.LINES[lnScore - 1].trim(),
        mensagem_se_verdadeiro: msg(lnPass), mensagem_se_falso: msg(lnFail),
        origem: { seletor: 'script QUIZ corrigir()', trecho_inicial: L.LINES[lnScore - 1].trim().slice(0, 70), linha_aprox: lnScore },
      },
      marcacao_p14: ['automatizavel_P18_limiar_nao_e_evidencia'],
      origem: L.origem(secQuiz.h2, 'section#quiz h2'),
    },
    {
      id: 'm11-crit-checklist', tipo: 'criterio_conclusao', secao: '§ Final',
      titulo_secao: L.lit(secFinal.h2), lede: L.lit(finalLede),
      total_itens: checklist.length,
      itens: checklist,
      mecanica_fonte: 'ul.ck > li estático: o <script> NÃO tem handler de checklist (zero ocorrência de "ck" no script). Não há marcação, persistência nem contagem na fonte.',
      nota_p14: 'marcacao_p14 é anotação desta extração inferida do verbo/termos de cada item, não texto da fonte; requer revisão humana.',
      origem: L.origem(secFinal.h2, 'section#final h2'),
    },
    {
      id: 'm11-crit-roteiro-oral', tipo: 'criterio_oral', secao: '§ Voz',
      titulo_secao: L.lit(secVoz.h2),
      blocos: vozBlocos,
      marcacao_p14: ['producao_oral_ou_livre', 'cronometrado'],
      nota: 'O lede declara "Para ser dito em voz alta, na ordem"; cada bloco tem duração em negrito. A soma declarada das seis durações (1 + 2 + 3 + 2 + 1,5 + 0,5 min) fecha os "Dez minutos" do h2 — conta desta extração.',
      origem: L.origem(secVoz.h2, 'section#voz h2'),
    },
    { id: 'm11-crit-exercicios', tipo: 'regra_de_uso_do_gabarito', secao: '§ Ex', ...L.lit(exLede), limiar: null, limiar_nota: 'O § Ex não declara número mínimo de acertos (diferente do "seis dos oito" do M01).', marcacao_p14: ['autoavaliado_sem_registro'], origem: L.origem(exLede, 'section#ex p.lede') },
    { id: 'm11-crit-janela-inst11', tipo: 'nota_de_instrumento_sobre_criterio', secao: 'Aula 08 · Inst · 11', ...L.lit(inst11Note), marcacao_p14: ['cronometrado'], origem: L.origem(inst11Note, 'Inst · 11 p.srcnote') },
  ],
};

// ── laboratórios ─────────────────────────────────────────────
const laboratorios = { itens: null, nota: `Nenhum § Lab no M11: zero marcador "§Lab", zero id "lab-", zero class "instrument". Os 11 instrumentos são div.inst (instrumentos.json). Medição: /§Lab|lab-0/ → ${(L.RAW.match(/§Lab|lab-0/g) || []).length} ocorrências.` };

// ── voz / princípios ─────────────────────────────────────────
const callouts = [];
for (const s of L.sections) {
  const { wrap } = wrapOf(s.id);
  for (const b of L.byClass(wrap, 'box')) {
    const tag = L.find(b, (x) => L.hasClass(x, 'tag'));
    if (!tag) continue;
    callouts.push({ secao: s.id, classe: b.attrs.class, rotulo: L.stripTags(L.inner(tag)), linha_aprox: b.line });
  }
}
const { wrap: wLex } = wrapOf('lex');
const { wrap: wRef } = wrapOf('ref');
const principio = (n, id, sel) => ({ id, tipo: 'principio_editorial', ...L.lit(n), origem: L.origem(n, sel) });
const numerosVivos = L.byClass(wTese, 'box').find((b) => L.hasClass(b, 'rd'));
const linguagem = L.kids(wTese, (x) => x.tag === 'p' && /oportunidades potenciais de economia/.test(L.inner(x)))[0];
const voz = {
  roteiro_oral: 'ver criterios.itens[m11-crit-roteiro-oral] (§ Voz, 6 blocos + lede)',
  principios: [
    { id: 'm11-voz-numeros-vivos', tipo: 'principio_editorial', rotulo: L.stripTags(L.inner(L.find(numerosVivos, (x) => L.hasClass(x, 'tag')))), paragrafos: L.kids(numerosVivos, (x) => x.tag === 'p').map((p) => L.lit(p)), origem: L.origem(numerosVivos, 'section#tese div.box.rd') },
    principio(linguagem, 'm11-voz-linguagem-de-oportunidade', 'section#tese h3(00.3) ~ p'),
    principio(exLede, 'm11-voz-ex-sem-economia', 'section#ex p.lede'),
    principio(L.find(wLex, (x) => L.hasClass(x, 'lede')), 'm11-voz-lex-sem-marca', 'section#lex p.lede'),
    principio(L.find(wRef, (x) => L.hasClass(x, 'lede')), 'm11-voz-ref-numero-data', 'section#ref p.lede'),
    ...footPs.map((p, i) => principio(p, `m11-voz-rodape-${i + 1}`, 'footer p')),
  ],
  ponteiros_referencias: 'aparato.json referencias: itens 25 (currículo), 26 (política de linguagem · War Room), 27 (especificação de produto), 28-29 (notas metodológicas).',
  callouts_rotulados: callouts,
  callouts_nota: 'Todos os div.box com span.tag do arquivo (rótulo só). "Onde isso entra no produto" é bloco de produto — P7: não exibir nesta fase.',
};

// ── erros comuns ─────────────────────────────────────────────
const { sec: secErr, wrap: wErr } = wrapOf('erros');
const olErr = L.find(wErr, (x) => x.tag === 'ol');
const erros_comuns = {
  id: 'm11-erros-comuns', tipo: 'erros_comuns',
  marcador: marcador(secErr), titulo_secao: L.lit(secErr.h2),
  itens: L.kids(olErr, (x) => x.tag === 'li').map((li, i) => {
    const h = L.inner(li);
    const b = h.match(/^\s*<b>([\s\S]*?)<\/b>\s*([\s\S]*)$/);
    return { id: `m11-erro-${L.pad(i + 1)}`, ordem: i + 1, titulo: L.stripTags(b[1]), explicacao: L.stripTags(b[2]), ...L.lit(li), vinculos: { aula: null }, origem: L.origem(li, 'section#erros ol.num-list > li') };
  }),
  vinculos_nota: 'A fonte não vincula erro a aula.',
  origem: L.origem(secErr.secId, 'section#erros .sec-id'),
};

const tradutor = { itens: null, nota: 'Não há seção "Tradutor" nem segundo marcador "§ Map" no M11 (só "§MAP · Anatomia"). Medição: /Tradutor/ → ' + (L.RAW.match(/Tradutor/g) || []).length + ' ocorrências.' };

// ── contagens medidas × pills ────────────────────────────────
const termos = L.byClass(wLex, 'term').length;
const nRefs = L.kids(L.find(wRef, (x) => x.tag === 'ol'), (x) => x.tag === 'li').length;
const nEx = L.kids(wEx, (x) => L.hasClass(x, 'box')).length;
const medidas = {
  aulas: aulasRot.length,
  instrumentos: L.byClass(L.DOC, 'inst').length,
  fichas_de_campo_fixo: L.byClass(L.DOC, 'fi').length,
  termos,
  exercicios: nEx,
  erros_comuns: erros_comuns.itens.length,
  checklist: checklist.length,
  referencias: nRefs,
  quiz_questoes: (L.scriptText().match(/\{q:'/g) || []).length,
};
const pillCheck = [
  ['aulas', /aulas$/], ['instrumentos', /instrumentos$/], ['fichas_de_campo_fixo', /fichas de campo fixo$/], ['termos', /termos$/],
  ['exercicios', /exercícios$/], ['erros_comuns', /erros comuns$/], ['checklist', /itens de checklist$/], ['referencias', /referências$/],
].map(([k, re]) => {
  const p = pillObj.find((x) => re.test(x.texto));
  return { chave: k, pill: p?.texto ?? null, declarado: p ? Number(p.valor_em_negrito) : null, medido: medidas[k], confere: p ? Number(p.valor_em_negrito) === medidas[k] : null };
});

// ── comparação com o código e o catálogo ─────────────────────
const codeAulas = cod.MODULO_11_AULAS;
const titulos = aulasRot.map((r) => {
  const n = r.marcador_num.slice(5);
  const c = codeAulas.find((x) => x.id === `aula-11-${n}`);
  const catRow = CAT.split('\n').slice(CAT.indexOf('## Módulo 11') >= 0 ? CAT.slice(0, CAT.indexOf('## Módulo 11')).split('\n').length : 0).find((l) => l.startsWith(`| ${n} |`));
  const catCells = catRow ? catRow.split('|').map((x) => x.trim()) : null;
  return {
    aula: n,
    fonte_h2: r.titulo.texto, fonte_marcador: r.marcador_rotulo,
    codigo_title: c?.title ?? null, codigo_subtitle: c?.subtitle ?? null,
    catalogo_aula: catCells?.[2] ?? null, catalogo_titulo: catCells?.[3] ?? null,
    title_igual_h2: c?.title === r.titulo.texto, subtitle_igual_marcador: c?.subtitle === r.marcador_rotulo,
    catalogo_igual: catCells ? catCells[2] === r.marcador_rotulo && catCells[3] === r.titulo.texto : null,
    codigo_instrumentos: c?.instruments.map((x) => x.id) ?? null,
    fonte_instrumentos: r.instrumentos_na_secao,
    codigo_activities: c?.activities.length ?? null,
    lead: (() => {
      const ld = L.find(wrapOf(`a${n}`).wrap, (x) => L.hasClass(x, 'lede'));
      const fonte = L.htmlNorm(L.inner(ld));
      const codigo = cod.MODULO_11_LEAD?.[`aula-11-${n}`] ?? null;
      const igual = codigo === fonte;
      const igual_ws = codigo != null && L.ws(codigo).replace(/s+([,.;:!?])/g, '$1') === fonte.replace(/s+([,.;:!?])/g, '$1');
      return { fonte_linha: ld.line, igual_literal: igual, igual_apos_normalizar_espaco: igual_ws, codigo_len: codigo?.length ?? null, fonte_len: fonte.length };
    })(),
  };
});
const bloco11 = BLOCKS_TS.match(/\{ id: 'bloco-11'.*\}/)[0];
const catHead = CAT.split('\n').find((l) => l.startsWith('| 11 |'));
const catSec = CAT.slice(CAT.indexOf('## Módulo 11'), CAT.indexOf('## Módulo 12'));
const catEscala = catSec.match(/\*\*Escala\*\*[\s\S]*?\n\n/)[0].trim();

const D = (id, sev, tema, leitura_a, leitura_b, nota) => ({ id, severidade: sev, tema, leitura_a, leitura_b, nota, decisao: 'não escolhida nesta camada (fonte) — registrar' });
const L_sinc1 = L.findLine(/sincronização em três pontos/);
const L_sinc2 = L.findLine(/três pontos de sincronização/);
const divergencias = [
  D('div-m11-01-titulo', 'média', 'Título do módulo: fonte × catálogo do repositório × currículo interno citado pela fonte',
    { onde: `h1 L${h1.line}, <title> L${titleTag.line}, footer, catálogo canônico (catalogo-modulos-alexandria.md L${CAT.slice(0, CAT.indexOf('## Módulo 11')).split('\n').length})`, texto: identidade.titulo.texto },
    { onde: 'src/lib/data/alexandria-blocks.ts bloco-11 (priority: confirmar); comentário de alexandria-trilhas.ts', texto: 'Energia Solar e Análise de Propostas' },
    `P24: o catálogo canônico (docs) usa o título da fonte e registra o do repositório entre parênteses. Terceira forma dentro da própria fonte: referência 25 ("GridAlpha — Currículo Definitivo, Bloco 11: Geração Distribuída e o Boom Solar", L${L.findLine(/Bloco 11: Geração Distribuída e o Boom Solar/)}).`),
  D('div-m11-02-pontos-de-sincronizacao', 'alta', 'Quantos pontos de sincronização a avaliação cronometrada tem',
    { onde: `Aula 08 lede L${L_sinc1} e 08.3 L${L_sinc2}`, texto: 'sincronização em três pontos / três pontos de sincronização' },
    { onde: 'Inst · 11 (script P[], L3791 e L3811)', texto: 'dois passos com sinc:true (04 e 08); o texto do passo 04 diz "Este é o primeiro ponto de sincronização" e o do 08 "Este é o segundo ponto de sincronização"' },
    'A prosa promete três; o instrumento assinatura marca dois. Nenhum terceiro ponto é nomeado na fonte.'),
  D('div-m11-03-divisao-do-tempo', 'alta', 'Divisão dos trinta minutos: prosa de 08.3 × Inst · 11 × checklist',
    { onde: `08.3 L${L.findLine(/Os <b>primeiros cinco minutos<\/b>/)}-${L.findLine(/Os <b>últimos dez minutos<\/b>/)}`, texto: 'primeiros cinco minutos = solicitações; quinze minutos seguintes = Eixo 1 e Eixo 2 (+ cláusulas); últimos dez minutos = Eixo 3 e fechamento' },
    { onde: 'Inst · 11 script P[] (L3776-3815) e checklist item 2', texto: 'passos 01-02 em 0–3 min (02 = "Inventariar os documentos", não "solicitar"); 03 3–8; 04 8–12; 05 12–17; 06 17–22 e 07 22–26 (contratual); 08 26–30 (fechar). Nenhum passo é de Eixo 3. Checklist item 2: "Solicitei contrato, datasheets e termo de garantia de performance nos primeiros cinco minutos"' },
    'As janelas não coincidem e o Eixo 3 (que a prosa põe nos últimos dez minutos) não aparece como passo do instrumento.'),
  D('div-m11-04-seis-instrumentos-sete-marcos', 'baixa', 'Contagem da cadeia normativa da Aula 02',
    { onde: `Aula 02 h2 L${wrapOf('a02').sec.h2.line} e lede`, texto: 'seis instrumentos, duas pendências e duas fronteiras / seis instrumentos normativos, duas peças ainda não escritas' },
    { onde: 'Inst · 03 (L993, script M[] L3247-3289)', texto: 'Régua do marco regulatório — sete marcos; o marco 2024 agrupa dois atos (REN 1.098 e Resolução CNPE nº 2) e o marco 2027 é a metodologia não editada' },
    'Não é contradição necessária (sete marcos incluem uma pendência e um marco duplo), mas a fonte não diz quais são os "seis". Registrado para conferência.'),
  D('div-m11-05-parte-11', 'média', 'Caso "Operação A — Parte 11" e série de partes entre módulos',
    { onde: `§Caso sec-id L${wrapOf('caso').sec.secId.line}`, texto: 'Operação A — Parte 11 / As dez partes anteriores construíram o perfil' },
    { onde: 'decisoes/2026-09-16 P17', texto: 'Não existe "Parte 1" (M01); título "Caso — Operação A"; etapas de interface nunca são "Partes" da fonte' },
    'Aqui a numeração é da própria fonte (série transversal do caso ao longo dos módulos; o caso cita "Parte 10" e "Módulo 10"). Mantida literal nesta camada; a aplicação de P17 é do produto.'),
  D('div-m11-06-marca', 'baixa', 'Marca GridAlpha na fonte × NIVAR/Alexandria no produto (P24)',
    { onde: `${gaCount} ocorrências, linhas ${gaLines.join(', ')}`, texto: 'GridAlpha' },
    { onde: 'decisoes P24', texto: 'Alexandria (produto) / NIVAR (empresa)' }, 'Texto literal nesta camada.'),
  D('div-m11-07-fc-no-m08', 'informativa', 'Onde o fator de capacidade foi ensinado',
    { onde: `§Lex "Fator de capacidade" L${L.findLine(/<span class="term">Fator de capacidade<\/span>/)}`, texto: 'conceito tratado no Módulo 08' },
    { onde: 'catálogo canônico: Módulo 01 aula 08 (L137, INST · 06 L157), Módulo 03 (INST · 02 L315) e Módulo 08 (INST · 02/03 L771-772, glossário L788); alexandria-glossario.ts gl-fator-de-capacidade-fc (M01), gl-m03-, gl-m08-fator-de-capacidade', texto: 'Capacidade instalada e fator de capacidade (Módulo 01, Aula 08)' },
    'Não é contradição: o catálogo também põe o fator de capacidade no M08 (calculadora e glossário), de modo que "tratado no Módulo 08" é verdadeiro. O registro é só de que o verbete do M11 remete ao M08 e não ao M01, onde o conceito é introduzido (Aula 08) (correção do verificador: a versão anterior lia o catálogo só no M01). P21 (FCap/FCarga) não é acionado: o M11 não usa a sigla "FC" (0 ocorrências de \\bFC\\b).'),
  D('div-m11-08-codigo-recursos', 'alta', 'Recursos do módulo 11 nunca renderizados no código',
    { onde: 'alexandria-modulo-11-content.ts', texto: 'MODULO_11_INSTRUMENTOS = [m11-inst-01] e MODULO_11_EXERCICIOS_SOLTOS (14) exportados' },
    { onde: 'src/components/alexandria/navigation/RecursosDoModulo.tsx RECURSOS', texto: `sem chave 'modulo-11' (${/'modulo-11'/.test(RECURSOS_TSX) ? 'presente' : 'ausente'}); o registro vai só até modulo-09` },
    'O INST·01 (§ MAP) e os 14 exercícios soltos existem como dado mas nenhuma tela os lê. Somente leitura aqui: registrar para a Peça B/C.'),
  D('div-m11-09-codigo-aparato-ausente', 'média', 'Aparato do módulo fora do código',
    { onde: 'fonte', texto: '§00 Tese (eixos), §MAP, §Caso, §Erros (20), §Quiz (10), §Voz, §Final (28), §Lex (150), §Ref (32)' },
    { onde: 'src/lib/data', texto: `nenhum destes está em alexandria-modulo-11-content.ts (só LEAD, CORPO, EXERCICIOS_SOLTOS, dados de instrumento, AULAS); glossário sem nenhum gl-m11-; badges sem regra do M11 (${/m11|modulo-11/i.test(BADGES_TS) ? 'há menção' : 'zero menção'})` },
    'Dependência para C1/C2 (bar §9).'),
  D('div-m11-10-catalogo-horas', 'informativa', 'Horas do módulo',
    { onde: 'fonte', texto: 'não declara' }, { onde: 'alexandria-blocks.ts bloco-11', texto: 'estimatedHoursMin: null, estimatedHoursMax: null' }, 'Concordam na ausência.'),
];

const out = {
  schema: 'alexandria-v2/extraction/modulo@1',
  grupo: 'modulo', modulo: 'm11', camada: 'fonte',
  fonte: { arquivo: L.SRC, linhas_total: L.LINES.length, bytes: Buffer.byteLength(L.RAW) },
  gerado_por: 'extratores/m11_modulo.mjs — árvore HTML por offsets (m11_lib.mjs); nenhum texto de conteúdo digitado',
  convencoes: {
    html: 'fatia literal da fonte com espaços colapsados (quebras de linha do arquivo viram espaço); inline preservado',
    texto: 'o mesmo sem tags, entidades decodificadas',
    linha_aprox: 'linha 1-based do elemento no HTML-fonte (LF)',
    marcacao_p14: 'anotação desta extração, não texto da fonte',
    null: 'ausência medida na fonte; sempre acompanhada de nota',
  },
  contagens: { secoes: roteiro.length, aulas: aulasRot.length, aparatos: roteiro.length - aulasRot.length, eixos: eixos.length, pills: pillObj.length, criterios: criterios.itens.length, checklist: checklist.length, erros_comuns: erros_comuns.itens.length, voz_blocos: vozBlocos.length, lentes_map: lentes.length, itens_map: ITENS.length, medidas_no_arquivo: medidas },
  identidade, tese, resultado_esperado, mapa, roteiro, criterios, laboratorios, voz, erros_comuns, tradutor,
  divergencias,
  comparacao_codigo: {
    arquivos: ['src/lib/data/alexandria-modulo-11-content.ts', 'src/lib/data/alexandria-blocks.ts', 'src/lib/data/alexandria-trilhas.ts', 'src/lib/data/alexandria-curriculo.ts', 'src/lib/data/alexandria-badges.ts', 'src/components/alexandria/navigation/RecursosDoModulo.tsx', L.CATALOGO],
    contagem_aulas: {
      fonte_sec_id_aula: aulasRot.length,
      fonte_pill: pillObj.find((p) => /aulas$/.test(p.texto))?.texto,
      codigo_MODULO_11_AULAS: codeAulas.length,
      codigo_totalInModule: [...new Set(codeAulas.map((a) => a.totalInModule))],
      codigo_AULAS_POR_BLOCO: Number(TRILHAS_TS.match(/'bloco-11':\s*(\d+)/)[1]),
      catalogo_canonico: (catEscala.match(/(\d+) aulas/) || [])[1] ? Number(catEscala.match(/(\d+) aulas/)[1]) : null,
      confere: true,
    },
    pills_x_medido: pillCheck,
    catalogo_canonico_escala: catEscala,
    titulos,
    catalogo_linha_titulos: catHead,
    catalogo_bloco_11: bloco11,
    codigo_ausente: ['tese/eixos', '§MAP (texto)', 'critérios', 'caso', 'erros comuns', 'quiz', 'roteiro oral', 'checklist', 'referências', 'glossário (150)'],
  },
};
// autoverificação de contagem declarada
out.comparacao_codigo.contagem_aulas.confere = [out.comparacao_codigo.contagem_aulas.fonte_sec_id_aula, out.comparacao_codigo.contagem_aulas.codigo_MODULO_11_AULAS, out.comparacao_codigo.contagem_aulas.codigo_AULAS_POR_BLOCO, out.comparacao_codigo.contagem_aulas.catalogo_canonico].every((x) => x === 8);
L.writeJson('modulo.json', out);
console.log(JSON.stringify(out.contagens), JSON.stringify(pillCheck.filter((p) => !p.confere)), JSON.stringify(titulos.filter((t) => !t.title_igual_h2 || !t.subtitle_igual_marcador || !t.catalogo_igual)));
console.log(tese.blocos.filter((b) => b.tipo.startsWith('nao_mapeado')).length, mapa.blocos.map((b) => b.tipo).join(','), vozBlocos.map((b) => b.tipo).join(','));
