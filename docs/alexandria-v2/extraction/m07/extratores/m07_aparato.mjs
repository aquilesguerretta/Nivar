// Extrator do aparato do M07 -> aparato.json: caso (Operação A · Parte 7), quiz, checklist final,
// exercicios (§Ex), referencias (§Ref) e glossario (§Lex). Fonte so leitura; comparacao com o codigo
// por leitura dos literais TS.
import {
  html, lineOf, texto, inner, ini, origem, pad, sec, all, one, blocks,
  literalAfter, scriptBlock, tsLiteral, writeJSON, idxOfString, SCRIPT_START,
} from './m07_lib.mjs';
import { runSim } from './m07_sim.mjs';

const secHead = (s) => {
  const b = blocks(s);
  const sid = b.find((x) => x.cls === 'sec-id');
  const m = /<b>([\s\S]*?)<\/b> · ([\s\S]*)/.exec(sid.inner);
  const h2 = b.find((x) => x.tag === 'h2');
  const lede = b.find((x) => x.cls === 'lede');
  return {
    marcador: texto(m[1]), rotulo: texto(m[2]),
    titulo: { texto: texto(h2.inner), origem: origem(`section#${s.id} h2`, texto(h2.inner), h2.idx) },
    lede: lede ? { html: inner(lede.inner), texto: texto(lede.inner), origem: origem(`section#${s.id} p.lede`, ini(lede.inner), lede.idx) } : null,
    origem: origem(`section#${s.id} .sec-id`, texto(sid.inner), sid.idx),
    blocos: b,
  };
};
const liItems = (blk, idPrefix, sel) => all(/<li>([\s\S]*?)<\/li>/g, blk.outer, blk.idx).map(({ m, idx }, i) => ({
  id: `${idPrefix}-${pad(i + 1)}`, html: inner(m[1]), texto: texto(m[1]), origem: origem(sel, ini(m[1]), idx),
}));

// =================== CASO ===================
const caso = sec('caso');
const ch = secHead(caso);
const subsecoes = [];
let cur = null;
for (const b of ch.blocos) {
  if (['sec-id', 'lede'].includes(b.cls) || b.tag === 'h2') continue;
  if (b.tag === 'h3') {
    const m = /<span class="num">([^<]*)<\/span>([\s\S]*)/.exec(b.inner);
    cur = { id: `m07-caso-${m[1].replace('.', '').toLowerCase()}`, numero: m[1], titulo: texto(m[2]), eh_pergunta: /\?\s*$/.test(texto(m[2])), origem: origem('section#caso h3', texto(m[2]), b.idx), blocos: [] };
    subsecoes.push(cur); continue;
  }
  const n = cur.blocos.length + 1;
  const bid = `${cur.id}-b${pad(n)}`;
  if (b.tag === 'p') {
    const rot = /^<strong>([^<]*?:)<\/strong>/.exec(b.inner);
    cur.blocos.push({ id: bid, tipo: 'paragrafo', rotulo_inline: rot ? rot[1] : null, html: inner(b.inner), texto: texto(b.inner), origem: origem('section#caso p', ini(b.inner), b.idx) });
  } else if (b.tag === 'ol' && b.cls === 'stp') {
    cur.blocos.push({
      id: bid, tipo: 'lista-ordenada-de-degraus', classe: b.cls,
      itens: all(/<li><span class="sh">([\s\S]*?)<span class="sw">([^<]*)<\/span><\/span>([\s\S]*?)<\/li>/g, b.outer, b.idx).map(({ m, idx }, i) => ({
        id: `${bid}-${pad(i + 1)}`, rotulo: texto(m[1]), marcador: texto(m[2]), html: inner(m[3]), texto: texto(m[3]), origem: origem('section#caso ol.stp li', texto(m[1]), idx),
      })),
      origem: origem('section#caso ol.stp', 'Canal de atendimento da distribuidora', b.idx),
    });
  } else if (b.tag === 'ul') {
    cur.blocos.push({ id: bid, tipo: 'lista', classe: b.cls, itens: liItems(b, bid, 'section#caso ul.ck li'), origem: origem('section#caso ul.ck', ini(b.inner), b.idx) });
  } else if (b.tag === 'div' && /^box/.test(b.cls)) {
    const tag = /<span class="tag">([\s\S]*?)<\/span>/.exec(b.inner);
    cur.blocos.push({
      id: bid, tipo: 'callout', classe: b.cls, rotulo: texto(tag[1]),
      paragrafos: all(/<p>([\s\S]*?)<\/p>/g, b.outer, b.idx).map(({ m, idx }) => ({ html: inner(m[1]), texto: texto(m[1]), origem: origem(`section#caso div.${b.cls.replace(' ', '.')} p`, ini(m[1]), idx) })),
      origem: origem(`section#caso div.${b.cls.replace(' ', '.')} .tag`, texto(tag[1]), b.idx),
    });
  } else throw new Error('bloco de caso nao previsto: ' + b.tag + ' ' + b.cls);
}
const ledeQ = /<em>([^<]*\?)<\/em>/.exec(ch.lede.html);
const mapCard = one(/<a class="map-card" href="#caso"><div class="n">([^<]*)<\/div><div class="t">([^<]*)<\/div><div class="d">([^<]*)<\/div><\/a>/, html);
const casoObj = {
  id: 'm07-caso-operacao-a',
  camada: 'fonte',
  tipo: 'caso',
  marcador: ch.marcador,
  rotulo_marcador: ch.rotulo,
  titulo: ch.titulo,
  parte: { texto: 'Parte 7', origem: origem('section#caso .sec-id', 'Parte 7', html.indexOf('Parte 7', caso.start)) },
  parte_nota: 'A fonte do M07 numera a parte: o sec-id diz "Operação A — mineração em Minas Gerais · Parte 7" e o lede abre com "Seis partes construíram o caso…". O card do § MAP repete "Operação A · Parte 7". Registrado literal (camada fonte); P17 manda não expor "Parte" como estrutura do produto — ver divergências.',
  cartao_no_mapa: { n: mapCard.m[1], t: mapCard.m[2], d: mapCard.m[3], origem: origem('section#map a.map-card[href="#caso"]', mapCard.m[2], mapCard.idx) },
  lede: ch.lede,
  dados: null,
  dados_nota: 'O caso do M07 não traz tabela de dados numéricos da planta (nenhuma célula de dado, nenhuma cifra). Os "dados" são fatos institucionais descritos em prosa nas subseções C.1–C.5.',
  subsecoes,
  perguntas: [
    { id: 'm07-caso-pergunta-lede', texto: ledeQ[1], respondida_pela_fonte: true, onde: 'lede', origem: origem('section#caso p.lede em', ledeQ[1], ch.lede.origem.linha_aprox ? html.indexOf(ledeQ[1]) : 0) },
    ...subsecoes.flatMap((s) => [
      ...(s.eh_pergunta ? [{ id: `${s.id}-pergunta-titulo`, texto: s.titulo, respondida_pela_fonte: true, onde: `h3 ${s.numero}`, origem: s.origem }] : []),
      ...s.blocos.filter((b) => b.tipo === 'paragrafo').flatMap((b) => (b.texto.match(/[^.?!:]*\?/g) || []).map((q, k) => ({ id: `${b.id}-pergunta-${k + 1}`, texto: q.trim(), respondida_pela_fonte: true, onde: `parágrafo em ${s.numero}`, origem: { ...b.origem, trecho_inicial: q.trim().slice(0, 60), linha_aprox: lineOf(html.indexOf(q.trim().slice(0, 30), caso.start)) } }))),
    ]),
  ],
  perguntas_nota: 'São as perguntas que a própria fonte formula (lede, títulos h3 e frases interrogativas dos parágrafos). Todas vêm respondidas pela fonte, com parágrafos rotulados "Diagnóstico:" — não são perguntas abertas ao learner. Nenhuma pergunta foi criada aqui.',
  decisao_pedida: null,
  decisao_nota: 'A fonte não pede decisão ao learner. O lede declara "Diagnóstico, sempre. Nenhuma recomendação fechada, nenhuma promessa de economia." e C.4 declara que a decisão de migrar "é escopo do Bloco 9 e não é tratada aqui". Um Desafio de decisão (P17) será da camada Alexandria, só com fatos deste caso.',
  vinculos: {
    aulas_declaradas: [...new Set([...caso.body.matchAll(/Aula (\d{2})/g)].map((m) => `aula-07-${m[1]}`))],
    aulas_nota: 'Único vínculo explícito: C.4 cita "A Aula 05 tem a sequência completa em nove passos". Blocos citados: "Bloco 9" (C.4).',
    blocos_citados: [...new Set([...caso.body.matchAll(/Bloco (\d+)/g)].map((m) => `Bloco ${m[1]}`))],
    instrumento: null,
  },
  origem: ch.origem,
  codigo_atual: 'Não extraído: nenhum arquivo em src/ contém o texto do § Caso do M07 (grep "A planta pela lente institucional" / "Operação A" em src/lib/data: só o M03 cita a Operação A).',
};

// =================== QUIZ ===================
const quiz = sec('quiz');
const qh = secHead(quiz);
const qblk = scriptBlock('QUIZ — 10 QUESTÕES');
const Q = literalAfter(html, 'var Q=', qblk.start);
let qcur = Q.start;
const perguntas = Q.value.map((q, i) => {
  const at = idxOfString(q.q, qcur, Q.end); qcur = at + 1;
  const fAt = idxOfString(q.f, at, Q.end);
  const prefixo = /^([^.]*?(?:Aula|Aulas)[^.]*)\./.exec(q.f);
  const aulas = prefixo ? [...prefixo[1].matchAll(/\b(\d{2})\b/g)].filter((m) => !/Inst·$/.test(prefixo[1].slice(0, m.index))).map((m) => m[1]) : [];
  const insts = [...q.f.matchAll(/Inst·(\d{2})/g)].map((m) => m[1]);
  return {
    id: `m07-quiz-q${pad(i + 1)}`,
    numero: i + 1,
    rotulo_renderizado: `Questão ${i + 1} de 10`,
    enunciado: q.q,
    alternativas: q.o.map((o, j) => ({ indice: j, letra: 'ABCD'[j], letra_nota: 'a fonte não exibe letra; índice do array', texto: o, linha_aprox: lineOf(idxOfString(o, at, Q.end)) })),
    gabarito: { indice: q.a, texto: q.o[q.a] },
    explicacao: q.f,
    explicacao_nota: 'Na fonte o mesmo texto (f) aparece para acerto e erro, depois de "Corrigir".',
    vinculos_declarados_na_explicacao: {
      prefixo_literal: prefixo ? prefixo[1] + '.' : null,
      aulas: [...new Set(prefixo ? [...prefixo[1].replace(/Inst·\d{2}/g, '').matchAll(/\b(\d{2})\b/g)].map((m) => `aula-07-${m[1]}`) : [])],
      instrumentos: [...new Set(prefixo ? [...prefixo[1].matchAll(/Inst·(\d{2})/g)].map((m) => m[1]) : [])].map((n) => `m07-inst-${n}`),
      instrumentos_citados_no_restante: [...new Set(insts)].filter((n) => !(prefixo && prefixo[1].includes('Inst·' + n))).map((n) => `m07-inst-${n}`),
    },
    origem: origem('script › QUIZ › var Q', ini(q.q), at),
    origem_explicacao: origem('script › QUIZ › var Q[].f', ini(q.f), fAt),
  };
});
// placar: roda o script original para cada numero de acertos
const sim = runSim();
const sb = sim.$('q-score');
const faixas = [];
const goBtn = sim.$('q-go');
for (let acertos = 0; acertos <= 10; acertos++) {
  sim.doc._quizPick = (sel) => {
    const i = +/qq(\d+)/.exec(sel)[1];
    if (i < acertos) return { value: String(Q.value[i].a) };
    return { value: String((Q.value[i].a + 1) % 4) };
  };
  goBtn.fire('click');
  faixas.push({ acertos, placar_renderizado: sim.$('q-num').textContent, classe: sb.className, mensagem: sim.$('q-msg').textContent });
}
const msgPass = one(/if\(sc>=8\)\{[\s\S]*?\$id\('q-msg'\)\.textContent='([^']*)'/, qblk.text, qblk.start);
const msgFail = one(/\}else\{[\s\S]*?\$id\('q-msg'\)\.textContent='([^']*)'/, qblk.text, qblk.start);
const btnGo = one(/<button class="btn" id="q-go">([^<]*)<\/button>/, quiz.body, quiz.start);
const btnRst = one(/<button class="btn ghost" id="q-rst">([^<]*)<\/button>/, quiz.body, quiz.start);
const qPlaceholder = one(/<div class="big" id="q-num">([^<]*)<\/div>/, quiz.body, quiz.start);
const hero10 = one(/<span class="pill"><b>10<\/b> questões · critério 8\/10<\/span>/, html);
const avaliacao = {
  id: 'm07-quiz',
  camada: 'fonte',
  marcador: qh.marcador,
  rotulo_marcador: qh.rotulo,
  titulo: qh.titulo,
  lede: qh.lede,
  criterio_literal: [
    { texto: qh.titulo.texto, origem: qh.titulo.origem },
    { texto: 'Abaixo de oito, não avance para o §Voz — volte às aulas indicadas nos retornos e refaça.', origem: origem('section#quiz p.lede', 'Abaixo de oito, não avance', qh.lede.origem.linha_aprox ? html.indexOf('Abaixo de oito') : 0) },
    { texto: texto(hero10.m[0]), origem: origem('.hero .pill', '10 questões · critério 8/10', hero10.idx) },
  ],
  mecanica_fonte: {
    tentativas: 'Todas as questões são respondidas e corrigidas de uma vez pelo botão "Corrigir"; "Refazer" limpa marcações e placar. Sem persistência.',
    marcacao: 'Na correção, a alternativa certa recebe a classe "opt right" e a marcada errada "opt wrong" (verde/vermelho no CSS da fonte). Questão sem resposta conta como erro e também revela o gabarito.',
    rotulos_de_interface: [
      { texto: btnGo.m[1], origem: origem('#q-go', btnGo.m[1], btnGo.idx) },
      { texto: btnRst.m[1], origem: origem('#q-rst', btnRst.m[1], btnRst.idx) },
      { texto: qPlaceholder.m[1], nota: 'placar antes da correção', origem: origem('#q-num', qPlaceholder.m[1], qPlaceholder.idx) },
      { texto_template: "'Questão '+(i+1)+' de 10'", origem: origem('script › QUIZ', "Questão '+(i+1)+' de 10", html.indexOf("Questão '+(i+1)+' de 10")) },
      { texto_template: "sc+' / 10'", origem: origem('script › QUIZ', "' / 10'", html.indexOf("' / 10'")) },
    ],
  },
  perguntas,
  faixas_de_placar_script: [
    { condicao: 'sc>=8', intervalo: '8–10', classe: 'score show pass', mensagem: msgPass.m[1], origem: origem('script › QUIZ › if(sc>=8)', ini(msgPass.m[1]), msgPass.idx) },
    { condicao: 'else', intervalo: '0–7', classe: 'score show fail', mensagem: msgFail.m[1], origem: origem('script › QUIZ › else', ini(msgFail.m[1]), msgFail.idx) },
  ],
  faixas_nota: '`condicao` é o texto do if; `intervalo` é derivado da condição. Só `mensagem` é verbatim. Diferente do M01, o script do M07 é coerente com o critério 8/10 da prosa.',
  placar_simulado: faixas,
  gabarito_distribuicao: Object.fromEntries([0, 1, 2, 3].map((k) => [k, Q.value.filter((q) => q.a === k).length])),
  codigo_atual: 'Não extraído: o quiz do M07 não existe em src/lib/data (nenhum literal "Dez questões · critério 8/10" nem os enunciados).',
};

// =================== CHECKLIST FINAL ===================
const fin = sec('final');
const fh = secHead(fin);
const ck = fh.blocos.find((b) => b.tag === 'ul' && b.cls === 'ck');
const P14 = (t) => {
  const tags = ['producao_oral_ou_livre'];
  if (/Encontro, sem tutorial/.test(t)) tags.push('operacional_navegacao');
  if (/Cito|Nomeio|Enuncio|Recito/.test(t)) tags.push('recordacao');
  return tags;
};
const itensCk = liItems(ck, 'm07-check', 'section#final ul.ck li').map((x) => ({ ...x, marcacao_p14: P14(x.texto) }));
const boxFin = fh.blocos.find((b) => b.cls === 'box gd');
const boxFinTag = /<span class="tag">([^<]*)<\/span>/.exec(boxFin.inner)[1];
const boxFinP = /<p>([\s\S]*?)<\/p>/.exec(boxFin.inner)[1];
const checklist = {
  id: 'm07-checklist-final',
  camada: 'fonte',
  marcador: fh.marcador,
  rotulo_marcador: fh.rotulo,
  titulo: fh.titulo,
  lede: fh.lede,
  itens: itensCk,
  marcacao_p14_nota: 'Anotação desta extração, não texto da fonte. O lede manda marcar "apenas o que você consegue sustentar em voz alta, sem consultar, diante de alguém que trabalha no setor" — por isso todos os 26 são `producao_oral_ou_livre`. O item 26 é também operacional (navegação real nos portais); a caixa "Sequência recomendada" pede executar os exercícios de navegação "com o cronômetro rodando" (cronometrado).',
  sequencia_recomendada: { rotulo: boxFinTag, html: inner(boxFinP), texto: texto(boxFinP), origem: origem('section#final div.box.gd', boxFinTag, boxFin.idx) },
  contagem_prosa: 'Vinte e seis',
  contagem_markup: itensCk.length,
  codigo_atual: 'Não extraído (nenhum item do § Final em src/lib/data; alexandria-badges.ts não tem entrada do M07).',
};

// =================== EXERCICIOS ===================
const ex = sec('ex');
const eh = secHead(ex);
const EXC = tsLiteral('alexandria-modulo-07-content.ts', 'export const MODULO_07_EXERCICIOS_SOLTOS').value;
let grupo = null;
const exercicios = [];
for (const b of eh.blocos) {
  if (b.tag === 'h4') { grupo = { texto: texto(b.inner), origem: origem('section#ex h4', texto(b.inner), b.idx) }; continue; }
  if (b.tag !== 'details') continue;
  const sm = /<summary>([\s\S]*?)<\/summary>/.exec(b.inner);
  const tm = /^(\d{2}) · ([\s\S]*)$/.exec(texto(sm[1]));
  const ps = all(/<p>([\s\S]*?)<\/p>/g, b.outer, b.idx).map(({ m, idx }) => ({ html: inner(m[1]), texto: texto(m[1]), origem: origem(`section#ex details:nth(${tm[1]}) .det-bd p`, ini(m[1]), idx) }));
  const allTxt = texto(b.inner);
  const aulaRefs = [...allTxt.matchAll(/Aula\s*\d+/gi)].map((m) => m[0]);
  const instRefs = [...allTxt.matchAll(/Inst ?·/g)].length;
  const cod = EXC.find((e) => e.id === `m07-ex-${tm[1]}`);
  const div = [];
  if (!cod) div.push('ausente no código');
  else {
    if (cod.config.tag !== texto(sm[1])) div.push('tag difere do summary');
    const joined = ps.map((p) => p.texto).join(' ');
    if (cod.config.gabarito !== joined) {
      const a = cod.config.gabarito, bb = joined;
      let k = 0; while (k < a.length && a[k] === bb[k]) k++;
      div.push(`gabarito difere do texto da fonte a partir do caractere ${k}: código «${a.slice(Math.max(0, k - 25), k + 25)}» × fonte «${bb.slice(Math.max(0, k - 25), k + 25)}»`);
    }
    if (ps.length > 1) div.push(`${ps.length} parágrafos da fonte concatenados num único texto; negritos de rótulo ("${ps[0].html.match(/<strong>([^<]*)<\/strong>/)?.[1] ?? ''}") removidos`);
    if (cod.prompt === '') div.push('prompt vazio no código; o enunciado vive em config.tag junto com o número');
    if (cod.points === 1) div.push('points: 1 sem origem na fonte');
  }
  exercicios.push({
    id: `m07-ex-${tm[1]}`,
    camada: 'fonte',
    tag: tm[1],
    grupo: grupo ? grupo.texto : null,
    grupo_origem: grupo ? grupo.origem : null,
    enunciado: tm[2],
    summary_literal: texto(sm[1]),
    resposta_de_referencia: ps,
    rotulos_inline_da_resposta: ps.flatMap((p) => [...p.html.matchAll(/<strong>([^<]*?:)<\/strong>/g)].map((m) => m[1])),
    criterio: null,
    criterio_nota: 'A fonte não dá critério por exercício. Critério de grupo no lede do § Ex (ver `exercicios.lede`).',
    aula_vinculada: null,
    sem_aula_P9: true,
    vinculo_nota: aulaRefs.length ? `menciona ${aulaRefs.join(', ')} em prosa, sem tag de posse` : 'Nenhuma menção a "Aula NN" no summary nem na resposta; tag é só o número. Solto (P9).',
    instrumentos_citados: instRefs,
    rotulo_revelacao: null,
    rotulo_revelacao_nota: 'A fonte usa <details>/<summary> sem rótulo de botão: o enunciado é o próprio summary, e clicar revela a resposta.',
    origem: origem('section#ex details summary', ini(sm[1]), b.idx),
    codigo: { status: div.length ? 'divergente' : 'portado', id_codigo: cod ? cod.id : null, onde: 'MODULO_07_EXERCICIOS_SOLTOS (alexandria-modulo-07-content.ts) → RecursosDoModulo', divergencias: div },
  });
}
const exObj = {
  camada: 'fonte',
  marcador: eh.marcador,
  rotulo_marcador: eh.rotulo,
  titulo: eh.titulo,
  lede: eh.lede,
  contagem_prosa: 'Doze exercícios — seis de roteamento, seis de navegação',
  contagem_markup: exercicios.length,
  por_grupo: Object.fromEntries(Object.entries(exercicios.reduce((a, e) => { a[e.grupo] = (a[e.grupo] || 0) + 1; return a; }, {}))),
  com_aula: exercicios.filter((e) => e.aula_vinculada).length,
  sem_aula_P9: exercicios.filter((e) => e.sem_aula_P9).length,
  itens: exercicios,
};

// =================== REFERENCIAS ===================
const ref = sec('ref');
const rh = secHead(ref);
const ul = rh.blocos.find((b) => b.cls === 'ref-list');
const DATE_RE = /\b\d{1,2} de (?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro) de \d{4}\b|\b(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?: e (?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro))? de \d{4}\b|\bao longo de \d{4}\b|\bentre \d{4} e \d{4}\b|\b\d{4}–\d{4}\b/g;
const ORGS = ['MME', 'CNPE', 'CMSE', 'ANEEL', 'EPE', 'ONS', 'CCEE', 'CADE', 'GridAlpha'];
const refs = all(/<li><span class="src">([^<]*)<\/span>([\s\S]*?)<\/li>/g, ul.outer, ul.idx).map(({ m, idx }, i) => {
  const src = m[1];
  const a = /<br><a href="([^"]*)">([^<]*)<\/a>$/.exec(m[2]);
  const desc = a ? m[2].slice(0, a.index) : m[2];
  const prefixo = src.split(' · ')[0];
  return {
    id: `m07-ref-${pad(i + 1)}`,
    camada: 'fonte',
    titulo: src,
    instituicao: ORGS.includes(prefixo) ? prefixo : null,
    instituicao_nota: ORGS.includes(prefixo) ? 'prefixo do span.src antes de " · "' : `o span.src não abre com sigla de instituição ("${prefixo}")`,
    descricao_html: inner(desc),
    descricao_texto: texto(desc),
    url: a ? a[1] : null,
    texto_do_link: a ? a[2] : null,
    url_nota: a ? null : 'item sem <a> na fonte',
    datas_citadas: [...texto(desc).matchAll(DATE_RE)].map((d) => d[0]),
    marca_numeros_vivos: /Números vivos/.test(desc),
    li_html: inner(m[0]),
    origem: origem('section#ref ul.ref-list li span.src', src, idx),
  };
});
const boxRef = rh.blocos.find((b) => b.cls === 'box rd');
const brTag = /<span class="tag">([^<]*)<\/span>/.exec(boxRef.inner)[1];
const brP = /<p>([\s\S]*?)<\/p>/.exec(boxRef.inner)[1];
const verifAt = html.indexOf('Data de verificação institucional deste módulo');
const referencias = {
  camada: 'fonte',
  marcador: rh.marcador,
  rotulo_marcador: rh.rotulo,
  titulo: rh.titulo,
  lede: rh.lede,
  data_de_verificacao_do_modulo: { texto: '29 de julho de 2026', origem: origem('section#ref p.lede strong', '29 de julho de 2026', verifAt) },
  contagem_prosa: 'Vinte e cinco fontes, todas primárias',
  contagem_markup: refs.length,
  com_url: refs.filter((r) => r.url).length,
  sem_url: refs.filter((r) => !r.url).map((r) => r.id),
  itens: refs,
  aviso_final: { rotulo: brTag, html: inner(brP), texto: texto(brP), origem: origem('section#ref div.box.rd', brTag, boxRef.idx) },
  rodape: (() => {
    const f = one(/<footer>([\s\S]*?)<\/footer>/, html);
    const bd = /<div class="bd">([\s\S]*?)<\/div>/.exec(f.m[1]);
    const rest = f.m[1].slice(f.m[1].indexOf('</div>', f.m[1].indexOf('class="bd"')) + 6);
    return {
      frase_html: inner(bd[1]), frase_linhas: bd[1].split('<br>').map((x) => texto(x)),
      linhas: rest.split('<br>').map((x) => texto(x)).filter(Boolean),
      html: inner(f.m[1]),
      origem: origem('footer', 'Política escolhe. Planejamento testa.', f.idx),
    };
  })(),
  campos_ausentes_D5: ['o que responde', 'o que não responde', 'tema', 'recorte', 'última verificação por item', 'tipo de fonte'],
  codigo_atual: 'Não extraído: BibliotecaView.tsx só traz o § Ref do M01; nenhum item do § Ref do M07 está em src/.',
};

// =================== GLOSSARIO ===================
const lex = sec('lex');
const lh = secHead(lex);
const grupos = lh.blocos.filter((b) => b.tag === 'details').map((b) => {
  const sm = /<summary>([^<]*) · (\d+) termos<\/summary>/.exec(b.inner);
  const termos = all(/<p><span class="term">([\s\S]*?)<\/span>\s*([\s\S]*?)<\/p>/g, b.outer, b.idx).map(({ m, idx }) => ({
    termo_bruto: m[1],
    termo: texto(m[1]).replace(/\.$/, ''),
    definicao_html: inner(m[2]),
    definicao_texto: texto(m[2]),
    idx,
  }));
  return { rotulo: sm[1], contagem_declarada: +sm[2], termos, idx: b.idx };
});
const VERB = tsLiteral('alexandria-glossario.ts', 'const VERBETES').value.filter((v) => v.id.startsWith('gl-m07-'));
const usados = new Set();
const termos = [];
let tn = 0;
for (const g of grupos) {
  for (const t of g.termos) {
    tn++;
    const cands = VERB.filter((v) => v.term === t.termo && v.unit === g.rotulo);
    const c = cands.find((v) => !usados.has(v.id));
    const cmp = { status: 'ausente no código' };
    if (c) {
      usados.add(c.id);
      const difs = [];
      if (c.definition !== t.definicao_html) difs.push(c.definition === t.definicao_texto ? 'definição sem o HTML inline da fonte' : 'definição difere');
      cmp.status = difs.length ? 'divergente' : 'idêntico';
      cmp.id_codigo = c.id; cmp.aulaIds_codigo = c.aulaIds; if (difs.length) cmp.divergencias = difs;
    }
    termos.push({
      id: `m07-lex-${String(tn).padStart(3, '0')}`,
      camada: 'fonte',
      termo: t.termo,
      termo_bruto_html: t.termo_bruto,
      grupo: g.rotulo,
      definicao_html: t.definicao_html,
      definicao_texto: t.definicao_texto,
      aula_vinculada: null,
      origem: origem(`section#lex details(${g.rotulo}) p span.term`, texto(t.termo_bruto), t.idx),
      codigo: cmp,
    });
  }
}
const soCodigo = VERB.filter((v) => !usados.has(v.id)).map((v) => ({ id: v.id, term: v.term, unit: v.unit }));
const glossario = {
  camada: 'fonte',
  marcador: lh.marcador,
  rotulo_marcador: lh.rotulo,
  titulo: lh.titulo,
  lede: lh.lede,
  contagem_prosa: '118 termos do Bloco 7',
  contagem_markup: termos.length,
  grupos: grupos.map((g) => ({ rotulo: g.rotulo, contagem_declarada: g.contagem_declarada, contagem_markup: g.termos.length, origem: origem('section#lex details summary', g.rotulo, g.idx) })),
  vinculo_aula_nota: 'A fonte não declara vínculo termo→aula. `aulaIds` do código são derivados (Wave 34, âncora estrutural) e ficam só em `codigo.aulaIds_codigo`.',
  termos,
  comparacao_codigo: {
    arquivo: 'src/lib/data/alexandria-glossario.ts (bloco "Modulo 07", ids gl-m07-*)',
    no_codigo: VERB.length,
    identicos: termos.filter((t) => t.codigo.status === 'idêntico').length,
    divergentes: termos.filter((t) => t.codigo.status === 'divergente').map((t) => ({ id: t.id, termo: t.termo, divergencias: t.codigo.divergencias })),
    ausentes_no_codigo: termos.filter((t) => t.codigo.status === 'ausente no código').map((t) => ({ id: t.id, termo: t.termo, grupo: t.grupo })),
    so_no_codigo: soCodigo,
    com_aulaIds_no_codigo: termos.filter((t) => t.codigo.aulaIds_codigo && t.codigo.aulaIds_codigo.length).length,
  },
};

// =================== divergencias do aparato ===================
const divergencias = [];
const addDiv = (id, tipo, tema, a, b, nota) => divergencias.push({ id, tipo, tema, leitura_a: a, leitura_b: b, nota: nota || null, resolvida: false });
addDiv('div-m07-caso-parte', 'fonte × decisão P17', 'Numeração "Parte 7" do caso',
  { texto: 'Operação A — mineração em Minas Gerais · Parte 7 (sec-id) / "Seis partes construíram o caso…" (lede) / "Operação A · Parte 7" (card do § MAP)', linhas: [lineOf(caso.start) + 2, ch.lede.origem.linha_aprox, mapCard ? lineOf(mapCard.idx) : null] },
  { texto: 'P17: o título do produto é "Caso — Operação A"; "Partes" da fonte não viram estrutura de interface.' },
  'Na fonte a numeração existe (diferente do M01, que não tinha partes). Mantida literal aqui; a exibição é decisão da camada Alexandria.');
addDiv('div-m07-ref-contagem', 'prosa × markup', 'Contagem do § Ref',
  { texto: 'h2 "Vinte e cinco fontes, todas primárias"', linha: rh.titulo.origem.linha_aprox },
  { texto: `${refs.length} <li> em ul.ref-list`, linha: lineOf(ul.idx) },
  'O catálogo canônico repete "25 fontes". Markup vence a prosa na contagem (protocolo §5); a prosa fica registrada.');
addDiv('div-m07-ref-primarias', 'prosa × markup', '"todas primárias"',
  { texto: 'h2 "Vinte e cinco fontes, todas primárias"' },
  { texto: `o item ${refs.find((r) => /GridAlpha/.test(r.titulo)).id} é "GridAlpha · documentos internos" (Currículo Definitivo, War Room, Plano de Negócios) — documento interno, não fonte primária pública` });
addDiv('div-m07-trava', 'fonte × fonte (entre módulos)', 'Numeração de travas de linguagem',
  { texto: 'Caso C.3: callout "Linguagem — trava 4" (linguagem segura, sem promessa de economia)', linha: lineOf(html.indexOf('Linguagem — trava 4')) },
  { texto: 'Aula 07 §7.5: "fundamentação técnica da Trava 1" (independência); o M01 usa "Trava 4" (§00, A05, Q10) e "Trava 3" (§ Caso) para a mesma regra de linguagem', linha: lineOf(html.indexOf('Trava 1')) },
  'P23: a fonte não define as travas; "War Room, travas de linguagem" aparece só no item de referência interno. No M07 a trava de linguagem é 4, coerente com a maioria das ocorrências do M01.');
addDiv('div-m07-quiz-avancar', 'fonte × decisão P18', 'Critério 8/10 como trava de avanço',
  { texto: 'lede do § Quiz: "Abaixo de oito, não avance para o §Voz"; mensagem de reprovação: "Não avance para o §Voz antes de fechar 8."' },
  { texto: 'P18: nenhum limiar legado trava a próxima etapa nem declara domínio; a mensagem de aprovação diz "Critério de domínio atingido."' },
  'Script coerente com a prosa (≥8 aprova). Registro legado apenas.');
addDiv('div-m07-glossario-grupo-comercializacao', 'catálogo × fonte', 'Rótulo do grupo de Comercialização',
  { texto: `summary "${grupos[5].rotulo} · ${grupos[5].contagem_declarada} termos"` },
  { texto: 'catálogo canônico: "Comercialização (22 — …)"' }, 'Abreviação do catálogo; contagem confere.');
if (glossario.comparacao_codigo.divergentes.length || glossario.comparacao_codigo.ausentes_no_codigo.length || soCodigo.length) {
  addDiv('div-m07-glossario-codigo', 'fonte × código', 'Glossário',
    { texto: `${termos.length} termos na fonte` },
    { texto: `${VERB.length} no código; ${glossario.comparacao_codigo.divergentes.length} divergentes, ${glossario.comparacao_codigo.ausentes_no_codigo.length} ausentes, ${soCodigo.length} só no código` });
}
addDiv('div-m07-quiz-retornos-cruzados', 'fonte × fonte', 'Retornos do quiz apontam instrumento de outra seção',
  { texto: 'Q03: "Aula 04 e Inst·01." — o Inst · 01 vive no § MAP, não na Aula 04; Q08: "Aulas 04 e 05, Inst·02…" e Q10: "Aula 03 e Inst·02." — o Inst · 02 vive na Aula 01; Q02: "Aula 05 e Inst·08.", Q05: "Aulas 04 e 05, Inst·05 e Inst·08.", Q06: "Aula 03, Inst·04 e Inst·08.", Q07: "Aula 06 e Inst·08." e Q08: "…Inst·02 e Inst·08." — o Inst · 08 vive na Aula 07', linhas: [perguntas[2].origem_explicacao.linha_aprox, perguntas[7].origem_explicacao.linha_aprox, perguntas[9].origem_explicacao.linha_aprox, perguntas[1].origem_explicacao.linha_aprox, perguntas[4].origem_explicacao.linha_aprox, perguntas[5].origem_explicacao.linha_aprox, perguntas[6].origem_explicacao.linha_aprox] },
  { texto: 'posição real: Inst · 01 em section#map (L442); Inst · 02 em section#a01 (L564); Inst · 08 em section#a07 (L1314)' },
  // verificador adversarial 2026-09-17: a lista original omitia os 5 retornos que citam o Inst · 08 (Aula 07) junto de outra aula
  'Não é erro necessariamente (o retorno cita aula + instrumento de apoio), mas o vínculo aula↔instrumento do retorno não coincide com a posição do instrumento.');
addDiv('div-m07-semaforo', 'fonte × invariante de design', 'Marcação verde/vermelho',
  { texto: 'quiz: classes "opt right"/"opt wrong" e "score show pass"/"score show fail"; vereditos dos Inst · 04/06 com classes ok/att/per' },
  { texto: 'AGENTS.md: "zero semáforo"; bar S2/C7 (registro, sem decisão aqui)' });
const exDiv = exercicios.filter((e) => e.codigo.divergencias.some((d) => d.startsWith('gabarito difere')));
if (exDiv.length) addDiv('div-m07-ex-gabarito-codigo', 'fonte × código', 'Gabaritos do § Ex',
  { texto: 'resposta em parágrafos com rótulos em <strong>' },
  { texto: `${exDiv.length} gabaritos no código não são iguais ao texto concatenado da fonte: ${exDiv.map((e) => e.id).join(', ')}` },
  'Detalhe por item em exercicios.itens[].codigo.divergencias.');

writeJSON('aparato.json', {
  modulo: 'M07',
  camada: 'fonte',
  fonte: 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo07.html',
  gerado_por: 'extratores/m07_aparato.mjs',
  metodo: 'Seções por <section id>; blocos de nível de seção por walker de elemento; quiz pelo literal var Q do <script> avaliado; placar obtido executando o script original em DOM simulado para 0–10 acertos; glossário e exercícios comparados com os literais TS avaliados.',
  contagens: {
    caso: { subsecoes: subsecoes.length, blocos: subsecoes.reduce((a, s) => a + s.blocos.length, 0), perguntas_da_fonte: casoObj.perguntas.length, degraus: 4, itens_ck: 5, callouts: 1 },
    quiz: { questoes: perguntas.length, alternativas_por_questao: 4, faixas_de_placar: 2 },
    checklist_final: itensCk.length,
    exercicios: { total: exercicios.length, com_aula: exObj.com_aula, sem_aula_P9: exObj.sem_aula_P9, por_grupo: exObj.por_grupo },
    referencias: { total: refs.length, com_url: referencias.com_url, sem_url: referencias.sem_url.length, com_data_citada: refs.filter((r) => r.datas_citadas.length).length },
    glossario: { termos: termos.length, grupos: grupos.length, identicos_codigo: glossario.comparacao_codigo.identicos, ausentes_codigo: glossario.comparacao_codigo.ausentes_no_codigo.length, divergentes_codigo: glossario.comparacao_codigo.divergentes.length },
    divergencias: divergencias.length,
  },
  caso: casoObj,
  avaliacao,
  checklist_final: checklist,
  exercicios: exObj,
  referencias,
  glossario,
  divergencias,
});
console.log(JSON.stringify({ sub: subsecoes.map((s) => [s.numero, s.blocos.map((b) => b.tipo).join(',')]), perg: casoObj.perguntas.map((p) => p.texto), faixas: faixas.map((f) => [f.acertos, f.placar_renderizado, f.classe]), dist: avaliacao.gabarito_distribuicao, vinc: perguntas.map((p) => [p.vinculos_declarados_na_explicacao.prefixo_literal, p.vinculos_declarados_na_explicacao.aulas.join('/'), p.vinculos_declarados_na_explicacao.instrumentos.join('/')]), ck: itensCk.length, ex: exObj.por_grupo, exdiv: exercicios.map((e) => [e.id, e.codigo.divergencias.length]), refs: [refs.length, referencias.com_url, referencias.sem_url], datas: refs.filter((r) => r.datas_citadas.length).map((r) => [r.id, r.datas_citadas]), lex: glossario.grupos, cmp: { ...glossario.comparacao_codigo, divergentes: glossario.comparacao_codigo.divergentes.slice(0, 5) } }, null, 1));
