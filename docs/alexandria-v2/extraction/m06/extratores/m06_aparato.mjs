// Extração programática do grupo "aparato" do M06 (camada fonte). Nada de conteúdo é digitado.
// O quiz é lido avaliando o literal `var Q=[...]` do <script> num contexto vm isolado.
import vm from 'node:vm';
import {
  html, LINES, fonteMeta, lineOf, decode, texto, inl, ini, origem, pad, kids, findAll,
  section, secId, blocos, cobertura, strings, codigo, writeJson, hoje,
} from './lib.mjs';

const C = await codigo();

// ── CASO ─────────────────────────────────────────────────────
const SC = section('caso');
const casoSid = secId(SC.wrap);
const casoH2 = kids(SC.wrap).find((k) => k.tag === 'h2');
const casoBlocos = blocos(SC.wrap, 'm06-caso', 'section#caso .wrap');
const perguntas = [];
for (const b of casoBlocos.filter((x) => x.tipo === 'paragrafo')) {
  for (const s of b.texto.match(/[^.?!:]*\?/g) || []) {
    perguntas.push({ id: `m06-caso-pergunta-${pad(perguntas.length + 1)}`, texto: s.trim(), bloco: b.id, origem: b.origem });
  }
}
const entregavel = casoBlocos.filter((x) => x.tipo === 'paragrafo').find((b) => b.texto.startsWith('A entrega desta parte'));
const caso = {
  id: 'm06-caso-operacao-a',
  tipo: 'caso',
  marcador: casoSid,
  titulo: { html: inl(casoH2.inner), texto: texto(casoH2.inner), origem: origem('section#caso h2', casoH2.inner, casoH2.start) },
  parte: casoSid.rotulo.match(/Parte \d+/)[0],
  nota_parte: 'A fonte numera literalmente esta parte ("· Parte 6", L1083) e o lede fala de "cinco partes anteriores". As partes 1-5 não estão neste arquivo. Registro literal: a regra P17 ("não existe Parte 1"; título "Caso — Operação A") é da camada de produto e não reescreve a fonte.',
  subtitulo_do_caso: casoSid.rotulo,
  blocos: casoBlocos,
  dados: [],
  dados_nota: 'O caso do M06 não traz nenhum dado numérico da Operação A (nem consumo, nem demanda, nem distribuidora). C.3 manda aplicar "a demanda contratada da Operação A" sem declarar o valor, que vive em partes de outros módulos. Nenhum valor foi preenchido.',
  perguntas_na_prosa: perguntas,
  perguntas_nota: 'Perguntas literais de diagnóstico que o caso dirige ao analista, extraídas por frase terminada em "?". Não são questões com gabarito nem decisão pedida.',
  decisao_pedida: null,
  decisao_nota: 'A fonte não pede decisão. Diz que a resposta sobre a migração "precisa ser uma escolha consciente, não uma omissão herdada" (C.3) e que a parte não produz "recomendação fechada" (C.4). Um Desafio de decisão seria camada Alexandria (P17), só com fatos do caso.',
  entregavel: entregavel ? { html: entregavel.html, texto: entregavel.texto, origem: entregavel.origem } : null,
  vinculos: {
    declarados_na_fonte: [
      { texto: 'Use a escada da Aula 05 e o instrumento da Aula 06', origem: { seletor: 'section#caso C.3 p', trecho_inicial: 'Use a escada da Aula 05 e o instrumento da Aula 06', linha_aprox: 1098 }, nota: 'Aula 05 §5.4 (tabela da escada) e um instrumento da Aula 06; a Aula 06 tem dois (Inst · 07 e 08). O contexto (limiar de elegibilidade) aponta o Inst · 07, mas a fonte não diz o número.' },
    ],
  },
  no_codigo: false,
  no_codigo_nota: 'Nenhum trecho do §Caso está em src/lib/data (varredura por "Operação A" e "A planta pela lente da história" no arquivo do M06: zero).',
};

// ── QUIZ ─────────────────────────────────────────────────────
const qStart = LINES.findIndex((l) => l.trim() === 'var Q=[');
const qEnd = LINES.findIndex((l, i) => i > qStart && l.trim() === '];');
const Q = vm.runInNewContext('(' + LINES.slice(qStart, qEnd + 1).join('\n').replace(/^\s*var Q=/, '').replace(/;\s*$/, '') + ')');
const qLines = []; LINES.forEach((l, i) => { if (/^\s*\{q:'/.test(l)) qLines.push(i + 1); });
const aLines = []; LINES.forEach((l, i) => { if (i > qStart && i < qEnd && /^\s*a:\d,f:'/.test(l)) aLines.push(i + 1); });
const SQ = section('quiz');
const quizLede = kids(SQ.wrap).find((k) => k.cls === 'lede');
const L = (needle) => LINES.findIndex((l) => l.includes(needle)) + 1;
const lPass = L('Critério de domínio atingido. Passe para o §Voz');
const lFail = L('Abaixo do critério de 8/10.');
const msg = (n) => LINES[n - 1].match(/textContent='(.*)';/)[1];
const LET = 'ABCD';
const avaliacao = {
  id: 'm06-quiz',
  tipo: 'quiz',
  marcador: secId(SQ.wrap),
  titulo: texto(kids(SQ.wrap).find((k) => k.tag === 'h2').inner),
  lede: { html: inl(quizLede.inner), texto: texto(quizLede.inner), origem: origem('section#quiz p.lede', quizLede.inner, quizLede.start) },
  criterio_literal: '8 de 10',
  questoes: Q.map((q, i) => {
    const pref = q.f.match(/^(Aulas? [^.]*?(?: e Inst·\d\d)?)\. /);
    return {
      id: `m06-q${pad(i + 1)}`,
      numero: i + 1,
      cabecalho_exibido_composto: { expressao_literal: `Questão '+(i+1)+' de 10`, linha_script: L("Questão '+(i+1)+' de 10"), resultado: `Questão ${i + 1} de 10` },
      enunciado: q.q,
      alternativas: q.o.map((o, j) => ({ indice: j, letra: LET[j], texto: o })),
      gabarito: { indice: q.a, letra: LET[q.a], texto: q.o[q.a] },
      explicacao: q.f,
      explicacao_nota: 'Na fonte o mesmo texto aparece para acerto e erro (fb.textContent=Q[i].f para todas as questões ao clicar "Corrigir").',
      aula_declarada_no_feedback: pref ? pref[1] : null,
      origem: { seletor: 'script QUIZ var Q[' + i + ']', trecho_inicial: q.q.slice(0, 70), linha_aprox: qLines[i] },
      origem_gabarito: { seletor: 'script QUIZ var Q[' + i + '].a/.f', trecho_inicial: q.f.slice(0, 70), linha_aprox: aLines[i] },
    };
  }),
  faixas: [
    { condicao_literal: 'sc>=8', faixa: '8–10', classe: 'score show pass', mensagem: msg(lPass), origem: { seletor: 'script QUIZ q-go', trecho_inicial: msg(lPass).slice(0, 70), linha_aprox: lPass } },
    { condicao_literal: 'else', faixa: '0–7', classe: 'score show fail', mensagem: msg(lFail), origem: { seletor: 'script QUIZ q-go', trecho_inicial: msg(lFail).slice(0, 70), linha_aprox: lFail } },
  ],
  placar_exibido: "sc+' / 10'",
  mecanica_fonte: {
    botoes: ['Corrigir', 'Refazer'],
    descricao_desta_extracao: 'Todas as 10 questões são renderizadas de uma vez (radio por questão). "Corrigir" marca a alternativa certa com classe "opt right" e a escolhida errada com "opt wrong", mostra a explicação de TODAS as questões (inclusive as não respondidas) e o placar. Questão sem resposta conta como erro. "Refazer" limpa as marcações. Sem persistência e sem limite de tentativas.',
    origem: { seletor: 'script QUIZ q-go / q-rst', trecho_inicial: "$id('q-go').addEventListener('click',function(){", linha_aprox: L("$id('q-go').addEventListener") },
    conflitos_registrados: 'Verde/vermelho para certo/errado (zero semáforo, AGENTS.md) e revelação direta do gabarito sem tentativa registrada (C7) são da camada de produto; registrados, não resolvidos.',
  },
  vinculos_nota: 'A fonte não declara vínculo estrutural questão→aula; só o prefixo textual do feedback ("Aula 01.", "Aula 01 e Inst·02." …), guardado em `aula_declarada_no_feedback`.',
  no_codigo: false,
  no_codigo_nota: 'O quiz não existe em src/lib/data (varredura pelo enunciado da Q01: zero).',
};

// ── CHECKLIST FINAL ──────────────────────────────────────────
const SF = section('final');
const finalBlocos = blocos(SF.wrap, 'm06-final', 'section#final .wrap');
const ck = finalBlocos.find((b) => b.tipo === 'lista');
const p14 = (t) => {
  const tags = ['sem consulta (lede)', 'autodeclarado'];
  if (/minutos|segundos/.test(t)) tags.unshift('cronometrado');
  if (/^(Conta|Explica|Demonstra|Descreve|Defende|Diferencia|Distingue|Relaciona|Mapeia|Aplica)/.test(t) || /defende/.test(t)) tags.unshift('producao_oral_ou_livre');
  if (/^(Cita|Dá|Diz|Nomeia|Enumera|Recita)/.test(t)) tags.unshift('recordacao (datas, nomes, normas)');
  return tags;
};
const checklist_final = {
  id: 'm06-checklist-final',
  marcador: secId(SF.wrap),
  titulo: texto(kids(SF.wrap).find((k) => k.tag === 'h2').inner),
  lede: finalBlocos.find((b) => b.tipo === 'lede'),
  itens: ck.itens.map((it) => ({ id: `m06-check-${pad(it.ordem)}`, ordem: it.ordem, html: it.html, texto: it.texto, marcacao_p14: p14(it.texto), aula_vinculada: null, origem: it.origem })),
  aula_vinculada_nota: 'O lede diz que cada verificação que falhar "aponta uma aula específica", mas nenhum item declara a aula. Nenhum vínculo foi inferido.',
  mecanica_fonte: 'Lista ul.ck estática: sem checkbox, sem persistência, sem script.',
  no_codigo: false,
  no_codigo_nota: 'Não existe em src/lib/data; alexandria-badges.ts não tem badge do M06 (BLOCOS_COM_CONTEUDO = bloco-01..03).',
};

// ── EXERCÍCIOS ───────────────────────────────────────────────
const SX = section('ex');
const detalhes = findAll(SX.wrap, (k) => k.tag === 'details');
const exCod = C.C06.MODULO_06_EXERCICIOS_SOLTOS;
const exercicios = {
  id: 'm06-exercicios',
  marcador: secId(SX.wrap),
  titulo: texto(kids(SX.wrap).find((k) => k.tag === 'h2').inner),
  lede: blocos(SX.wrap, 'm06-ex', 'section#ex .wrap').find((b) => b.tipo === 'lede'),
  itens: detalhes.map((d, i) => {
    const sum = kids(d).find((k) => k.tag === 'summary');
    const bd = kids(d).find((k) => k.cls === 'det-bd');
    const [pP, pG] = kids(bd).filter((k) => k.tag === 'p');
    const perg = pP.inner.match(/^<strong>(Pergunta\.)<\/strong>\s*([\s\S]*)$/);
    const gab = pG.inner.match(/^<strong>(Gabarito[^<]*)<\/strong>\s*([\s\S]*)$/);
    const tag = decode(sum.inner);
    const m = tag.match(/^(\d\d) · (.*)$/);
    const campos = [tag, perg[2], gab[2]].join(' ');
    const cod = exCod[i];
    const codGab = cod ? cod.config.gabarito : null;
    const esperadoConcat = `${perg[1]} ${texto(perg[2])} ${texto(gab[1])} ${texto(gab[2])}`;
    return {
      id: `m06-ex-${m[1]}`,
      tag, numero: m[1], titulo: m[2],
      enunciado: { rotulo: perg[1], html: inl(perg[2]), texto: texto(perg[2]), origem: origem('section#ex details .det-bd > p (1º)', pP.inner, pP.start) },
      resposta_referencia: { rotulo: decode(gab[1]), html: inl(gab[2]), texto: texto(gab[2]), origem: origem('section#ex details .det-bd > p (2º)', pG.inner, pG.start) },
      criterio: null,
      criterio_nota: 'Nenhum exercício tem critério próprio. A instrução geral está no lede do §Ex ("Escreva ou fale a resposta inteira antes de abrir o gabarito").',
      aula_vinculada: null,
      sem_aula_P9: true,
      varredura_vinculo: { padrao: '/Aula\\s*\\d+|Inst\\s*·\\s*\\d+|§/', ocorrencias: (campos.match(/Aula\s*\d+|Inst\s*·\s*\d+|§/g) || []) },
      origem: origem('section#ex details > summary', sum.inner, d.start),
      comparacao_codigo: cod ? {
        id: cod.id, tag_igual: cod.config.tag === tag, prompt_codigo: cod.prompt, points_codigo: cod.points, kind_codigo: cod.kind,
        gabarito_codigo_e_concatenacao: texto(codGab) === esperadoConcat,
        gabarito_diferenca: texto(codGab) === esperadoConcat ? null : (() => { const x = texto(codGab); let k = 0; while (x[k] === esperadoConcat[k]) k++; return { codigo: x.slice(Math.max(0, k - 30), k + 20), fonte: esperadoConcat.slice(Math.max(0, k - 30), k + 20), nota: 'espaço inserido onde havia <em> na fonte' }; })(),
        status: 'divergente',
        motivos: ['prompt vazio: o enunciado está dentro de config.gabarito', 'Pergunta e Gabarito concatenados num único campo', 'points: 1 sem origem na fonte'],
      } : { status: 'não portado' },
    };
  }),
  vinculo_nota: 'P9: os 10 exercícios não têm aula vinculada na fonte (summary só "NN · Título"; varredura nos três campos: zero "Aula NN"). Todos são soltos; no código estão em MODULO_06_EXERCICIOS_SOLTOS e as aulas têm activities: [].',
};

// ── REFERÊNCIAS ──────────────────────────────────────────────
const SR = section('ref');
const refUl = kids(SR.wrap).find((k) => k.tag === 'ul');
const MESES = 'janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro';
const referencias = {
  id: 'm06-referencias',
  marcador: secId(SR.wrap),
  titulo: texto(kids(SR.wrap).find((k) => k.tag === 'h2').inner),
  lede: blocos(SR.wrap, 'm06-ref', 'section#ref .wrap').find((b) => b.tipo === 'lede'),
  itens: kids(refUl).filter((k) => k.tag === 'li').map((li, i) => {
    const src = kids(li).find((k) => k.cls === 'src');
    const resto = html.slice(src.end, li.innerEnd);
    const desc = resto.split('<br>')[0];
    const links = [...resto.matchAll(/<a href="([^"]+)">([\s\S]*?)<\/a>/g)].map((a) => ({ href: a[1], texto: decode(a[2]) }));
    const t = texto(li.inner);
    return {
      id: `m06-ref-${pad(i + 1)}`,
      titulo: decode(src.inner),
      descricao: { html: inl(desc), texto: texto(desc) },
      links,
      url: links.length ? links.map((l) => l.href) : null,
      instituicao: null,
      instituicao_nota: 'A fonte não tem campo de instituição; quando ela aparece, está dentro do título (ex.: "MME ·", "ANEEL, ONS e CCEE ·").',
      datas_no_texto: [...new Set([...t.matchAll(new RegExp(`\\d{1,2} de (?:${MESES}) de \\d{4}|(?:${MESES}) de \\d{4}`, 'g'))].map((x) => x[0]))],
      numeros_vivos: /Números vivos/.test(li.inner),
      origem: origem('section#ref ul.ref-list > li', li.inner, li.start),
    };
  }),
  lacunas: 'Nenhuma referência tem tipo, data de consulta/verificação, "o que responde / o que não responde" ou recorte (D5). A maioria das normas não tem URL (só 5 itens têm <a>).',
  no_codigo: null,
};
const refCodigo = C.C06 && JSON.stringify(C.C06).includes('memoriadaeletricidade');
referencias.no_codigo = refCodigo;
referencias.no_codigo_nota = 'Varredura do bundle do M06 por "memoriadaeletricidade": ' + (refCodigo ? 'presente' : 'ausente') + '. As referências do M06 não estão em src/lib/data.';

// ── GLOSSÁRIO ────────────────────────────────────────────────
const SL = section('lex');
const lexDet = findAll(SL.wrap, (k) => k.tag === 'details');
const glCod = C.GLO.ALEXANDRIA_GLOSSARIO.filter((g) => g.id.startsWith('gl-m06-'));
const termos = [];
const familias = lexDet.map((d) => {
  const sum = decode(kids(d).find((k) => k.tag === 'summary').inner);
  const [, fam, n] = sum.match(/^(.*) · (\d+) termos$/);
  const ps = kids(kids(d).find((k) => k.cls === 'det-bd')).filter((k) => k.tag === 'p');
  for (const p of ps) {
    const mm = p.inner.match(/^<span class="term">([\s\S]*?)<\/span>\s*([\s\S]*)$/);
    termos.push({ id: `m06-termo-${pad(termos.length + 1)}`, familia: fam, termo_marcado: decode(mm[1]), termo: decode(mm[1]).replace(/\.$/, ''), definicao: { html: inl(mm[2]), texto: texto(mm[2]) }, origem: origem('section#lex details .det-bd > p', p.inner, p.start) });
  }
  return { familia: fam, contagem_declarada: +n, contagem_markup: ps.length, resumo_literal: sum };
});
const glosComp = termos.map((t) => {
  const c = glCod.find((g) => g.term === t.termo && g.unit === t.familia);
  if (!c) return { termo: t.termo, status: 'ausente no código' };
  const defIgual = texto(c.definition) === t.definicao.texto;
  return { termo: t.termo, id_codigo: c.id, status: defIgual ? 'idêntico' : 'divergente', aulaIds_codigo: c.aulaIds, ...(defIgual ? {} : { definicao_codigo: c.definition }) };
});
const soNoCodigo = glCod.filter((g) => !termos.some((t) => t.termo === g.term && t.familia === g.unit)).map((g) => g.id);
const glossario = {
  id: 'm06-glossario',
  marcador: secId(SL.wrap),
  titulo: texto(kids(SL.wrap).find((k) => k.tag === 'h2').inner),
  lede: blocos(SL.wrap, 'm06-lex', 'section#lex .wrap').find((b) => b.tipo === 'lede'),
  familias,
  termos,
  termo_nota: '`termo_marcado` é o conteúdo literal do span.term (com o ponto final); `termo` remove só esse ponto, como o código faz.',
  comparacao_codigo: {
    total_fonte: termos.length, total_codigo: glCod.length,
    identicos: glosComp.filter((x) => x.status === 'idêntico').length,
    divergentes: glosComp.filter((x) => x.status === 'divergente'),
    ausentes_no_codigo: glosComp.filter((x) => x.status === 'ausente no código').map((x) => x.termo),
    so_no_codigo: soNoCodigo,
    aulaIds_nota: 'Os aulaIds do código são derivados (âncora por título/subtítulo, Wave 34); a fonte não declara vínculo termo→aula.',
    com_aula_no_codigo: glosComp.filter((x) => x.aulaIds_codigo && x.aulaIds_codigo.length).map((x) => `${x.termo} → ${x.aulaIds_codigo.join(',')}`),
    catalogo_nota: 'O catálogo canônico lista os 99 com nomes abreviados ("Imposto Único", "Revisão extraordinária", "Portarias MME 514/2018, 465/2019 e 50/2022", "Consumidor livre e especial"); os nomes literais estão em `termos`.',
  },
};

// ── cobertura e divergências ─────────────────────────────────
const cob = {
  caso: cobertura(SC.wrap.inner, strings(caso).concat([caso.marcador.html])),
  quiz_secao: cobertura(SQ.wrap.inner.replace(/<button[\s\S]*?<\/button>/g, ''), strings(avaliacao).concat([avaliacao.marcador.html])),
  quiz_script: cobertura(LINES.slice(qStart, qEnd + 1).join('\n').replace(/var Q=/, '').replace(/a:\d,/g, '').replace(/(^|[{,\s])[qof]:/g, '$1'), avaliacao.questoes.flatMap((q) => [q.enunciado, q.explicacao, ...q.alternativas.map((a) => a.texto)])),
  final: cobertura(SF.wrap.inner, strings(checklist_final).concat([checklist_final.marcador.html])),
  ex: cobertura(SX.wrap.inner, strings(exercicios).concat([exercicios.marcador.html])),
  ref: cobertura(SR.wrap.inner, strings(referencias).concat([referencias.marcador.html])),
  lex: cobertura(SL.wrap.inner, strings(glossario).concat([glossario.marcador.html], familias.map((f) => f.resumo_literal))),
  nota: 'Cobertura por token (protocolo §5), consumindo cada token uma vez. Denominador: a section inteira (o quiz: a section sem botões, e o literal var Q sem as chaves JS q:/o:/a:N/f:).',
};
const divergencias = [
  { id: 'm06-ap-div-01', tipo: 'fonte×fonte', tema: 'Critério: quiz 8/10 × critério oral',
    leitura_a: { onde: 'lede §Quiz L1214', texto: avaliacao.lede.texto }, leitura_b: { onde: `script L${lPass}`, texto: avaliacao.faixas[0].mensagem },
    nota: 'A mesma mensagem que declara "Critério de domínio atingido" diz que "o critério oficial deste bloco é oral". O limiar numérico (8) é consistente entre prosa, pill e script.', decisao: 'não escolhida (P18)' },
  { id: 'm06-ap-div-02', tipo: 'fonte×fonte', tema: 'Quiz Q10 cita duas aulas e o Inst·07; Q03 e Q09 citam Inst·02 e Inst·06',
    leitura_a: { onde: 'feedback', texto: avaliacao.questoes.map((q) => `Q${q.numero}: ${q.aula_declarada_no_feedback}`).join(' | ') },
    leitura_b: { onde: 'estrutura', texto: 'nenhum vínculo estrutural questão→aula' }, nota: 'Registro. O quiz cita só os Inst · 02, 06 e 07; os Inst · 01, 03, 04, 05 e 08 não aparecem em nenhuma questão. Todas as seis aulas aparecem ao menos uma vez.', decisao: 'registrada' },
  { id: 'm06-ap-div-03', tipo: 'fonte×fonte', tema: 'Caso: "cinco partes anteriores" × quatro lentes; "Parte 6"', leitura_a: { onde: 'L1083/L1085', texto: `${casoSid.rotulo} | ${casoBlocos[0].texto.slice(0, 110)}` }, leitura_b: { onde: 'P17', texto: 'não existe "Parte 1"' }, nota: 'Ver modulo.json m06-div-03/04.', decisao: 'registrada' },
  { id: 'm06-ap-div-04', tipo: 'fonte×fonte', tema: 'Caso aponta "o instrumento da Aula 06" sem número (a Aula 06 tem dois)', leitura_a: { onde: 'L1098', texto: 'Use a escada da Aula 05 e o instrumento da Aula 06' }, leitura_b: { onde: 'Aula 06', texto: 'Inst · 07 (Linha da abertura) e Inst · 08 (Mapa trauma → cicatriz)' }, nota: 'O contexto (limiar de elegibilidade) é o do Inst · 07; a fonte não diz.', decisao: 'não escolhida' },
  { id: 'm06-ap-div-05', tipo: 'fonte×código', tema: 'Exercícios: estrutura', leitura_a: { onde: '§Ex', texto: 'enunciado e resposta em <p> separados, rótulo "Gabarito (uma composição possível)." no Ex 10' }, leitura_b: { onde: 'MODULO_06_EXERCICIOS_SOLTOS', texto: 'prompt "" e gabarito concatenado; points: 1' }, nota: `${exercicios.itens.filter((e) => e.comparacao_codigo.gabarito_codigo_e_concatenacao).length}/10 gabaritos do código são exatamente a concatenação literal.`, decisao: 'registrada' },
  { id: 'm06-ap-div-06', tipo: 'fonte×código', tema: 'Glossário', leitura_a: { onde: '§Lex', texto: `${termos.length} termos em ${familias.length} famílias` }, leitura_b: { onde: 'alexandria-glossario.ts', texto: `${glCod.length} gl-m06-*; ${glossario.comparacao_codigo.identicos} idênticos; ${glossario.comparacao_codigo.divergentes.length} divergentes; ${glossario.comparacao_codigo.ausentes_no_codigo.length} ausentes` }, nota: 'aulaIds são derivação do código.', decisao: 'registrada' },
  { id: 'm06-ap-div-07', tipo: 'fonte×fonte', tema: 'Ordem da §Voz × mensagem do quiz', leitura_a: { onde: 'mensagem de aprovação', texto: 'Passe para o §Voz: as trinta e seis perguntas-relâmpago primeiro, os seis ataques de decisor depois, e então o roteiro de dez minutos' }, leitura_b: { onde: 'ordem do HTML', texto: '§Quiz (L1210) → §Voz (L1225) → §Final (L1319)' }, nota: 'Coerentes; a mensagem de reprovação proíbe avançar ao §Voz antes de 8/10 (gate da fonte, P18 não adota).', decisao: 'registrada' },
];
const lacunas = [
  'Caso: sem dados numéricos, sem decisão pedida (null); só perguntas de diagnóstico na prosa e um entregável.',
  'Quiz: vínculo questão→aula só textual (prefixo do feedback); feedback igual para acerto e erro.',
  'Checklist: nenhum item declara aula; todos autodeclarados.',
  'Exercícios: nenhum critério próprio; nenhuma aula vinculada (P9: 10 soltos).',
  'Referências: sem tipo, sem data de verificação, sem "o que responde/não responde"; instituição só dentro do título; 16 de 21 sem URL.',
  'Glossário: sem vínculo termo→aula declarado.',
  'Fora do código: caso, quiz, checklist final e referências só existem no HTML.',
];

writeJson('aparato.json', {
  schema: 'alexandria-v2/extraction/aparato@1', modulo: 'M06', grupo: 'aparato', camada: 'fonte',
  fonte: fonteMeta, gerado_em: hoje,
  metodo: 'Node: parser de pilha sobre o HTML por section#id; quiz lido avaliando o literal `var Q=[...]` do <script> em vm isolado; comparação com o código por bundle esbuild (só leitura). Nenhum texto de conteúdo digitado.',
  convencoes: { html: 'fragmento literal, espaços colapsados', texto: 'sem tags, entidades decodificadas', linha_aprox: 'linha 1-based', null: 'ausência na fonte, com nota' },
  caso, avaliacao, checklist_final, exercicios, referencias, glossario,
  contagens: {
    caso: { blocos: casoBlocos.length, subsecoes: casoBlocos.filter((b) => b.tipo === 'subtitulo').length, perguntas_na_prosa: perguntas.length, dados: 0, caixas: casoBlocos.filter((b) => b.tipo === 'caixa').length },
    quiz: { questoes: Q.length, alternativas_por_questao: [...new Set(Q.map((q) => q.o.length))], faixas: 2, gabaritos_por_indice: Q.reduce((a, q) => ((a[LET[q.a]] = (a[LET[q.a]] || 0) + 1), a), {}) },
    checklist_final: checklist_final.itens.length,
    exercicios: { total: exercicios.itens.length, com_aula: 0, soltos: exercicios.itens.length },
    referencias: { total: referencias.itens.length, com_url: referencias.itens.filter((r) => r.url).length, links: referencias.itens.reduce((a, r) => a + r.links.length, 0), com_data_no_texto: referencias.itens.filter((r) => r.datas_no_texto.length).length, numeros_vivos: referencias.itens.filter((r) => r.numeros_vivos).length },
    glossario: { termos: termos.length, familias: familias.length, por_familia: Object.fromEntries(familias.map((f) => [f.familia, f.contagem_markup])), declarado_igual_markup: familias.every((f) => f.contagem_declarada === f.contagem_markup) },
  },
  cobertura_por_token: cob,
  divergencias, lacunas,
});
