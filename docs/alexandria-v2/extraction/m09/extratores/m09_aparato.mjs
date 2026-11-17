// Grupo "aparato" do M09 → aparato.json (caso, quiz, checklist final, exercícios, referências, glossário).
import * as X from './lib.mjs';

const { ln, at, txt, strip, origem, pad, fail } = X;
const S = X.secoes();
const sec = (id) => S.find((s) => s.id_html === id) || fail('seção ' + id);
const corpo = (s) => X.blocos(s.lede ? s.lede_linha + 1 : s.lede_linha, s.fim - 1, `section#${s.id_html}`);
const cab = (s) => ({
  marcador: s.marcador, rotulo_marcador: s.rotulo,
  titulo: { ...txt(s.h2), origem: origem(s.h2_linha, `section#${s.id_html} h2`) },
  introducao: s.lede ? { ...txt(s.lede), origem: origem(s.lede_linha, `section#${s.id_html} p.lede`) } : null,
  origem: origem(s.sec_id_linha, `section#${s.id_html} .sec-id`),
});
const code = X.lerCodigo('conteudo');

// ── CASO ─────────────────────────────────────────────────────
const sCaso = sec('caso');
const cb = corpo(sCaso);
cb.forEach((b, i) => { b.id = `m09-caso-b${pad(i + 1)}`; });
const partes = [];
let atual = null;
for (const b of cb) {
  if (b.tipo === 'titulo') { atual = { id: `m09-caso-sec-${b.numero}`, numero: b.numero, titulo: b.texto, origem: b.origem, blocos: [] }; partes.push(atual); continue; }
  if (atual) atual.blocos.push(b);
}
const abertura = cb.slice(0, cb.findIndex((b) => b.tipo === 'titulo'));
const s6 = partes.find((p) => p.numero === '6');
const perguntaLit = s6.blocos.find((b) => b.tipo === 'paragrafo');
const cartoes = s6.blocos.find((b) => b.tipo === 'cartoes');
const diag = s6.blocos.find((b) => b.tipo === 'destaque');
const caso = {
  id: 'm09-caso',
  tipo: 'caso',
  ...cab(sCaso),
  nome_do_caso: 'Operação A',
  parte_literal: at(1771, /(parte 9)/),
  nota_parte: 'A fonte do M09 DECLARA "parte 9" (sec-id L1771) e "As oito partes anteriores construíram o perfil" (lede L1773). É a série Operação A, uma parte por módulo. P17 (título "Caso — Operação A", sem "Parte N" como estrutura de produto) vale para a camada Alexandria; aqui fica o literal.',
  contexto_da_operacao: abertura.map((b) => ({ ...b })),
  dados_literais: {
    setor_e_local: at(1773, /(Operação A — mineração em Minas Gerais\.)/),
    perfil_das_partes_anteriores: at(1775, /(carga razoavelmente plana, operação em turnos, submercado Sudeste\/Centro-Oeste, fator de carga elevado e pouca flexibilidade operacional natural)/),
    nota: 'Recortes literais do lede (L1773) e do primeiro parágrafo (L1775). O caso não traz números (consumo, demanda, preço); fator de carga só aparece como exemplo hipotético "0,85 e um de 0,93" (L1796).',
  },
  secoes: partes,
  perguntas: [{
    id: 'm09-caso-pergunta-01',
    tipo: 'pergunta_do_caso',
    ...txt(perguntaLit.html),
    resposta_da_fonte: cartoes.cartoes.map((c, i) => ({ id: `m09-caso-resposta-${pad(i + 1)}`, rotulo: c.rotulo, classe: c.classe, html: c.html, texto: c.texto, linha_aprox: c.linha_aprox })),
    nota: 'A pergunta é da própria fonte (h3 "6 · A pergunta que este bloco serve para responder"), e a fonte já responde com seis cartões. Não é pergunta aberta ao learner.',
    origem: perguntaLit.origem,
  }],
  decisao_pedida: null,
  nota_decisao: 'A fonte não pede decisão ao learner: entrega o veredito pronto no destaque "Diagnóstico da parte 9" (L1840-1841) — "não é possível concluir com o que foi informado". P17 autoriza um Desafio de decisão na camada Alexandria, só com fatos do caso.',
  veredito_da_fonte: { rotulo: diag.rotulo, paragrafos: diag.paragrafos, origem: diag.origem },
  vinculos: { aulas_declaradas: [], nota: 'A fonte não liga as seções do caso a aulas. As seções 1–5 retomam, em ordem, temas das Aulas 03, 01, 04, 05 e 01/03 — correspondência de tema, não declarada.' },
  codigo_atual: 'Não extraído: nenhuma ocorrência de "Operação A" nem "parte 9" em alexandria-modulo-09-content.ts.',
};
if (/Operação A/.test(code)) caso.codigo_atual = 'ATENÇÃO: "Operação A" aparece no código — revisar.';

// ── QUIZ ─────────────────────────────────────────────────────
const sQuiz = sec('quiz');
const QZ = X.literal('§QUIZ', 'QZ');
const qb = X.blocoScript('§QUIZ');
const LETRA = ['A', 'B', 'C', 'D'];
const qzLinha = (t) => X.achaLinha(`{t:'${t.slice(0, 40)}`, qb.ini, qb.fim);
const perguntas = QZ.valor.map((q, i) => {
  const n = qzLinha(q.t);
  return {
    id: `m09-quiz-q${pad(i + 1)}`,
    tipo: 'questao_multipla_escolha',
    rotulo_fonte: `Pergunta ${i + 1} de 10`,
    enunciado: q.t,
    alternativas: q.o.map((o, j) => ({ numero: j + 1, letra_derivada: LETRA[j], texto: o })),
    gabarito: { numero: q.a, letra_derivada: LETRA[q.a - 1], texto: q.o[q.a - 1], valor_script: `a:${q.a}` },
    explicacao: q.f,
    nota_explicacao: 'O script mostra o mesmo texto f para acerto e erro, precedido de "Correto." ou "Resposta correta: opção N." (L3421).',
    vinculos: { aulas_declaradas: [], nota: 'A fonte não liga questão a aula.' },
    origem: origem(n, 'script §QUIZ var QZ[]', q.t),
  };
});
const nFb = X.achaLinha("'Correto.':'Resposta correta: opção '", qb.ini, qb.fim);
const nPass = X.achaLinha('var pass=acertos>=8;', qb.ini, qb.fim);
const nMsgA = X.achaLinha("(pass?'Critério atendido.", qb.ini, qb.fim);
const nMsgB = X.achaLinha(":'Critério é 8 de 10.", qb.ini, qb.fim);
const avaliacao = {
  id: 'm09-quiz',
  tipo: 'avaliacao',
  ...cab(sQuiz),
  sec_id_texto: strip(sQuiz.sec_id_html),
  mecanica_fonte: 'Rádio por questão; botão "Corrigir" corrige todas de uma vez, marca certa/errada, mostra o retorno e o placar; "Refazer" re-renderiza em branco. Sem persistência. Questão não respondida vale 0 (erro).',
  total_questoes: perguntas.length,
  distribuicao_gabarito: Object.fromEntries([1, 2, 3, 4].map((k) => [`opcao_${k}`, perguntas.filter((p) => p.gabarito.numero === k).length])),
  criterio_literal: { sec_id: strip(sQuiz.sec_id_html), lede: sQuiz.lede },
  faixas_de_placar_script: {
    limiar_codigo: ln(nPass).trim(),
    faixas: [
      { condicao: 'acertos >= 8', intervalo: '8–10', classe: 'score show pass', mensagem: at(nMsgA, /\(pass\?'(.*)'\s*$/) },
      { condicao: 'acertos < 8', intervalo: '0–7', classe: 'score show fail', mensagem: at(nMsgB, /:'(.*)'\)\+'<\/p>';\s*$/) },
    ],
    formato_placar: at(X.achaLinha("+acertos+' / 10</div>'", qb.ini, qb.fim), /(\+acertos\+' \/ 10)/),
    origem: origem(nPass, 'script §QUIZ corrigir()'),
    nota_p18: 'Registro legado. A mensagem "Critério atendido." não vira "Aprovado" na interface (P18).',
  },
  rotulos_de_interface_fonte: {
    botao_corrigir: at(1977, />(Corrigir)</),
    botao_refazer: at(1978, />(Refazer)</),
    cabecalho_questao: "'Pergunta '+(i+1)+' de 10'",
    retorno_codigo: ln(nFb).trim(),
  },
  perguntas,
  codigo_atual: /QZ|quiz/i.test(code) ? 'revisar' : 'Não extraído: alexandria-modulo-09-content.ts não tem quiz.',
};

// ── CHECKLIST FINAL ──────────────────────────────────────────
const sFinal = sec('final');
const ck = corpo(sFinal)[0];
const checklist_final = {
  id: 'm09-checklist-final',
  tipo: 'checklist',
  ...cab(sFinal),
  mecanica_fonte: 'Lista estática (ul.ck). Nenhum script de marcação; "Marque mentalmente" é literal.',
  total_itens: ck.itens.length,
  itens: ck.itens.map((it, i) => ({
    id: `m09-final-${pad(i + 1)}`, tipo: 'item_de_checklist', ordem: i + 1, ...it,
    vinculos: { aulas_declaradas: [], nota: 'A lede diz que a aula correspondente "está indicada na estrutura do módulo", mas nenhum item a indica.' },
    origem: origem(it.linha_aprox, 'section#final ul.ck > li', it.html),
  })),
  itens_orais_ou_cronometrados_P14: 'Todos os 28 são produção oral/livre em primeira pessoa ("Reconstruo", "Explico", "Digo"…); nenhum é cronometrado. O item 01 é recordação "de memória". Marcação detalhada em modulo.json → criterios.checklist.',
  codigo_atual: 'Não extraído.',
};

// ── EXERCÍCIOS ───────────────────────────────────────────────
const sEx = sec('ex');
const eb = corpo(sEx);
let bloco = null;
const exs = [];
for (const b of eb) {
  if (b.tipo === 'titulo') { bloco = { numero: b.numero, texto: b.texto }; continue; }
  const m = b.resumo.html.match(/^<b>(Ex\. (\d+))<\/b> — (.*)$/) || fail('ex ' + b.origem.linha_aprox);
  exs.push({
    id: `m09-ex-${pad(+m[2])}`, tipo: 'exercicio', numero: +m[2], tag: m[1],
    bloco: `${bloco.numero} · ${bloco.texto}`,
    enunciado: txt(m[3]),
    resposta_de_referencia: b.corpo,
    criterio: null,
    criterio_nota: 'Sem critério por exercício. A regra geral do §Ex é o lede ("Produza a resposta inteira antes de abrir o gabarito").',
    aula_vinculada: null,
    aula_nota: 'Solto (P9): a tag é só "Ex. N"; nenhuma aula declarada no resumo, no enunciado ou no gabarito.',
    marcacao_p14: [/^Desenhe/.test(strip(m[3])) ? 'desenho' : null, /de memória/.test(m[3]) ? 'recordacao_sem_consulta' : null, /quatro frases/.test(m[3]) ? 'limite_de_extensao' : null, 'producao_livre'].filter(Boolean),
    origem: b.origem,
  });
}
// varredura de menções a aula/módulo nos três campos (protocolo §4)
exs.forEach((e) => {
  const tudo = [e.enunciado.texto, ...e.resposta_de_referencia.map((p) => p.texto)].join(' ');
  e.mencoes_em_prosa = [...tudo.matchAll(/(Aula \d\d|Módulo \d\d|Bloco \d\d)/g)].map((m) => m[1]);
});
// comparação com o código
const codeEx = [...code.matchAll(/id: "(.*?)",\s*kind: '(.*?)' as const,\s*prompt: ("(?:[^"\\]|\\.)*"),\s*points: (\d+),\s*config: \{ tag: ("(?:[^"\\]|\\.)*"), gabarito: ("(?:[^"\\]|\\.)*")/g)]
  .map((m) => ({ id: m[1], kind: m[2], prompt: JSON.parse(m[3]), points: +m[4], tag: JSON.parse(m[5]), gabarito: JSON.parse(m[6]) }));
const norm = (s) => s.replace(/\s+/g, ' ').trim();
exs.forEach((e, i) => {
  const c = codeEx[i];
  const fonteGab = e.resposta_de_referencia.map((p) => p.texto).join(' ');
  e.codigo = c ? {
    id: c.id, kind: c.kind, prompt: c.prompt, points: c.points, tag: c.tag,
    tag_contem_enunciado: c.tag.includes(e.enunciado.texto),
    gabarito_igual_texto_fonte: norm(c.gabarito) === norm(fonteGab),
    gabarito_diferencas: norm(c.gabarito) === norm(fonteGab) ? [] : (() => {
      const a = norm(c.gabarito), b = norm(fonteGab); let k = 0; while (k < a.length && a[k] === b[k]) k++;
      return [{ posicao: k, codigo: a.slice(Math.max(0, k - 20), k + 30), fonte: b.slice(Math.max(0, k - 20), k + 30) }];
    })(),
  } : null;
});
const exercicios = {
  id: 'm09-exercicios',
  tipo: 'indice_de_exercicios',
  ...cab(sEx),
  sec_id_texto: strip(sEx.sec_id_html),
  rotulo_botao_gabarito: null,
  rotulo_botao_nota: 'Não há botão: o gabarito é o corpo de um <details> (h2 "Exercícios com gabarito oculto"). O resumo é o próprio enunciado.',
  blocos: eb.filter((b) => b.tipo === 'titulo').map((b) => ({ numero: b.numero, texto: b.texto, linha_aprox: b.origem.linha_aprox, total: exs.filter((e) => e.bloco.startsWith(b.numero)).length })),
  total_na_fonte: exs.length,
  vinculados_a_aula: 0,
  soltos_P9: exs.length,
  itens: exs,
  codigo_atual: {
    arquivo: 'src/lib/data/alexandria-modulo-09-content.ts → MODULO_09_EXERCICIOS_SOLTOS (usado por RecursosDoModulo.tsx L72)',
    total: codeEx.length,
    ids_distintos: new Set(codeEx.map((c) => c.id)).size,
    ids: [...new Set(codeEx.map((c) => c.id))],
    prompts_vazios: codeEx.filter((c) => c.prompt === '').length,
    tags_com_prefixo_null: codeEx.filter((c) => c.tag.startsWith('null · ')).length,
    points: [...new Set(codeEx.map((c) => c.points))],
    gabaritos_divergentes: exs.filter((e) => e.codigo && !e.codigo.gabarito_igual_texto_fonte).map((e) => e.id),
  },
};

// ── REFERÊNCIAS ──────────────────────────────────────────────
const sRef = sec('ref');
const rb = corpo(sRef);
const refLista = rb.find((b) => b.tipo === 'lista');
const advert = rb.find((b) => b.tipo === 'destaque');
const reData = /(\d{1,2}(?:º)? de (?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro) de \d{4}|\d{2}\/\d{2}\/\d{4}|(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro) de \d{4}|biênio \d{4}-\d{4}|(?:publicada|editada) em \d{4}|para 2026|de 2026|em 2022|\b\d{4}\/\d{4}\b|nº \d[\d.]*\/\d{4})/g;
const referencias = {
  id: 'm09-referencias',
  tipo: 'referencias',
  ...cab(sRef),
  total: refLista.itens.length,
  itens: refLista.itens.map((it, i) => {
    const m = it.html.match(/^<span class="src">(.*?)<\/span>(.*)$/) || fail('ref ' + it.linha_aprox);
    const corpoRef = m[2];
    const titulo = corpoRef.split(' — ')[0];
    return {
      id: `m09-ref-${pad(i + 1)}`, tipo: 'referencia', ordem: i + 1,
      tipo_fonte: m[1],
      html: it.html, texto: it.texto,
      titulo_literal: strip(titulo),
      descricao_literal: corpoRef.includes(' — ') ? strip(corpoRef.slice(titulo.length + 3)) : null,
      instituicao: null,
      instituicao_nota: 'A fonte não nomeia instituição por sigla: usa "ministério", "agência", "câmara", "operador". Nenhuma sigla (MME, ANEEL, CCEE, ONS, EPE) foi inferida.',
      url: null, dominio: null,
      marcas_de_data_no_texto: [...new Set([...strip(corpoRef).matchAll(reData)].map((x) => x[1]))],
      secundaria: /secundária/i.test(m[1]),
      origem: origem(it.linha_aprox, 'section#ref ul.ref-list > li', it.html),
    };
  }),
  data_de_verificacao_declarada: at(sRef.lede_linha, /(Verificação em 1º de agosto de 2026\.)/),
  advertencia_final: { rotulo: advert.rotulo, paragrafos: advert.paragrafos, origem: advert.origem },
  lacunas: 'Zero URL e zero domínio nos 30 itens. Vários itens não têm número nem data (ex.: "Portaria normativa do ministério publicada em 2022", "Resolução normativa que estabelece a metodologia…"). Faltam os campos D5 (o que responde e o que não responde, recorte, última verificação por item).',
  codigo_atual: 'Não extraído (nenhuma referência do M09 em src/lib/data).',
};

// ── GLOSSÁRIO ────────────────────────────────────────────────
const sLex = sec('lex');
const lb = corpo(sLex);
const termos = [];
const grupos = lb.map((d, gi) => {
  const m = d.resumo.html.match(/^<b>(Grupo \d)<\/b> — (.*) · (\d+) termos$/) || fail('grupo lex');
  const itens = d.corpo.map((p) => {
    const t = X.ln(p.linha_aprox).match(/<p><span class="term">(.*?)<\/span> — (.*)<\/p>/) || fail('termo ' + p.linha_aprox);
    const reg = { id: `m09-lex-${String(termos.length + 1).padStart(3, '0')}`, tipo: 'termo_de_glossario', termo: t[1], grupo: m[1], rotulo_grupo: m[2], definicao_html: t[2], definicao_texto: strip(t[2]), origem: origem(p.linha_aprox, 'section#lex details > .det-bd > p > span.term', t[1]) };
    termos.push(reg);
    return reg.id;
  });
  return { grupo: m[1], rotulo: m[2], contagem_declarada: +m[3], contagem_medida: itens.length, aberto_por_padrao: d.aberto, origem: d.origem };
});
// comparação com o glossário do código
const glo = X.lerCodigo('glossario');
const gloTerms = [...glo.matchAll(/id: "(gl-[^"]+)",\s*term: ("(?:[^"\\]|\\.)*"),\s*unit: ("(?:[^"\\]|\\.)*"),\s*definition:\s*("(?:[^"\\]|\\.)*")/g)].map((m) => ({ id: m[1], term: JSON.parse(m[2]), unit: JSON.parse(m[3]), definition: JSON.parse(m[4]) }));
const nk = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
const m09NoCodigo = gloTerms.filter((g) => g.id.startsWith('gl-m09'));
termos.forEach((t) => {
  const iguais = gloTerms.filter((g) => nk(g.term) === nk(t.termo));
  t.codigo = {
    presente_como_m09: m09NoCodigo.some((g) => nk(g.term) === nk(t.termo)),
    mesmo_termo_em_outros_modulos: iguais.map((g) => ({ id: g.id, definicao_identica: g.definition === t.definicao_texto })),
  };
});
const ordem = termos.map((t) => t.termo);
const glossario = {
  id: 'm09-glossario',
  tipo: 'glossario',
  ...cab(sLex),
  contagem: { prosa: at(sLex.lede_linha, /(Cento e trinta e seis termos)/), pill_hero: '136 termos', soma_declarada_grupos: grupos.reduce((a, g) => a + g.contagem_declarada, 0), markup: termos.length, catalogo_canonico: 136 },
  grupos,
  ordem_na_fonte: 'Por função, dentro de cada grupo (não alfabética).',
  termos,
  codigo_atual: {
    arquivo: 'src/lib/data/alexandria-glossario.ts',
    verbetes_m09_no_codigo: m09NoCodigo.length,
    faltam_no_codigo: termos.filter((t) => !t.codigo.presente_como_m09).map((t) => t.termo),
    total_faltando: termos.filter((t) => !t.codigo.presente_como_m09).length,
    homonimos_em_outros_modulos: termos.filter((t) => t.codigo.mesmo_termo_em_outros_modulos.length).map((t) => ({ termo: t.termo, ids: t.codigo.mesmo_termo_em_outros_modulos.map((x) => x.id) })),
    nota: 'O código tem blocos gl-m02 … gl-m08 e nenhum gl-m09. Homônimo em outro módulo não substitui o verbete do M09 (ids namespaçados por módulo, definição própria).',
  },
};

// ── divergências do aparato ─────────────────────────────────
const D = (id, sev, tema, leituras, nota, grupo) => ({ id, severidade: sev, grupo, tema, leituras, nota, decisao: 'não escolhida — registrar' });
const divergencias = [
  D('div-m09-ex-ids-codigo', 'alta', 'Exercícios no código: id duplicado, prompt vazio, tag com "null"', [
    { onde: 'fonte §Ex', literal: '14 details, "Ex. 1" … "Ex. 14", sem aula' },
    { onde: 'MODULO_09_EXERCICIOS_SOLTOS', literal: `${exercicios.codigo_atual.total} itens, ${exercicios.codigo_atual.ids_distintos} id distinto (${exercicios.codigo_atual.ids.join(', ')}), ${exercicios.codigo_atual.prompts_vazios} prompts vazios, ${exercicios.codigo_atual.tags_com_prefixo_null} tags "null · Ex. N — …", points ${exercicios.codigo_atual.points.join('/')}` },
  ], 'O enunciado foi parar dentro da tag; o id m09-ex-null é o mesmo nos 14 (colisão de chave em qualquer lista React/estado). points: 1 não tem origem na fonte.', 'fonte×codigo'),
  D('div-m09-ex-gabarito-espaco', 'baixa', 'Gabaritos do código não são verbatim', [
    { onde: 'fonte (texto sem tags)', literal: 'ex.: "<b>perfil</b>, mensal"' },
    { onde: 'código', literal: `${exercicios.codigo_atual.gabaritos_divergentes.length} de 14 gabaritos diferem da fonte normalizada (ver itens[].codigo.gabarito_diferencas)` },
  ], 'A remoção de tags do extrator antigo deixou espaço antes da pontuação.', 'fonte×codigo'),
  D('div-m09-glossario-ausente', 'alta', 'Glossário do M09 ausente no código', [
    { onde: '§Lex', literal: `${termos.length} termos em 6 grupos` },
    { onde: 'alexandria-glossario.ts', literal: '0 verbetes gl-m09' },
  ], 'O cabeçalho do glossário cobre só M01–M08.', 'fonte×codigo'),
  D('div-m09-caso-quiz-final-ausentes', 'média', 'Caso, quiz, checklist e referências só no HTML', [
    { onde: 'fonte', literal: 'caso (6 seções), quiz (10), checklist (28), ref (30)' },
    { onde: 'código', literal: 'nenhum dos quatro em src/lib/data' },
  ], 'Mesma situação do M01 (dependência §9 do bar).', 'fonte×codigo'),
  D('div-m09-caso-sete-coisas', 'baixa', 'Prontidão "consultando sete coisas"', [
    { onde: '§Caso 1 L1779', literal: 'Prontidão se resolve consultando sete coisas, e nenhuma delas é o preço da energia.' },
    { onde: 'Aula 03.2 L1020', literal: 'o contrato vigente com a distribuidora e a janela de denúncia; o sistema de medição para faturamento e o custo e prazo de eventual adequação; a documentação societária e cadastral; a escolha entre adesão direta e representação; o contrato de energia; e o cronograma de modelagem na câmara de comercialização' },
  ], 'A enumeração da Aula 03 tem seis itens separados por ponto e vírgula (sete, se "contrato vigente" e "janela de denúncia" contarem separados). O caso não lista as sete.', 'fonte×fonte'),
];

const out = {
  schema: 'alexandria-v2/extraction/aparato@1',
  modulo: 'm09',
  grupo: 'aparato',
  fonte: { arquivo: X.SRC, linhas_total: X.L.length, bytes: Buffer.byteLength(X.RAW) },
  gerado_em: '2026-09-17',
  metodo: 'extratores/m09_aparato.mjs: seções por section#id + .sec-id; parser de blocos por linha; o quiz vem da avaliação (vm) do literal var QZ=[…] do <script>, sem executar lógica.',
  convencoes: { linha_aprox: 'linha 1-based no HTML-fonte', null: 'ausência medida; sempre com nota', letra_derivada: 'a fonte numera opções (1–4); a letra é derivação desta extração' },
  caso, avaliacao, checklist_final, exercicios, referencias, glossario, divergencias,
};
X.escreve('aparato.json', out);
console.log('aparato ok · caso seções', partes.length, '· quiz', perguntas.length, JSON.stringify(avaliacao.distribuicao_gabarito), '· checklist', checklist_final.total_itens, '· ex', exs.length, '· ref', referencias.total, '· termos', termos.length);
console.log(JSON.stringify(grupos.map((g) => [g.grupo, g.contagem_declarada, g.contagem_medida])));
console.log(JSON.stringify(exercicios.codigo_atual), JSON.stringify(exs.map((e) => e.mencoes_em_prosa)));
console.log('homônimos', glossario.codigo_atual.homonimos_em_outros_modulos.length, JSON.stringify(glossario.codigo_atual.homonimos_em_outros_modulos.map((h) => h.termo)));
console.log(JSON.stringify(exs.filter((e) => e.codigo.gabarito_diferencas.length).map((e) => [e.id, e.codigo.gabarito_diferencas[0]])).slice(0, 1500));
console.log(JSON.stringify(referencias.itens.map((r) => r.marcas_de_data_no_texto)));
