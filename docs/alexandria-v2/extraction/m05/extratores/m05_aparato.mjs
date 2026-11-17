// Extração do grupo "aparato" do M05 → aparato.json
// Uso: node m05_aparato.mjs
import fs from 'node:fs';
import {
  L, ln, fail, FONTE, at, find, findAll, walk, txt, stripTags, collapse, origem,
  writeJson, buildCodigo, HOJE, SCRIPT, REPO,
} from './m05_lib.mjs';

const COD = buildCodigo();
const { MODULO_05_EXERCICIOS_SOLTOS } = await import(COD.content05);
const { ALEXANDRIA_GLOSSARIO } = await import(COD.glossario);

const one = (w, tipo) => { const r = w.blocos.filter((b) => b.tipo === tipo); if (r.length !== 1) fail(`${w.secao}/${tipo}: ${r.length}`); return r[0]; };
const all = (w, tipo) => w.blocos.filter((b) => b.tipo === tipo);
const pad = (i) => String(i).padStart(2, '0');
const SEM_AULA = { aulas_declaradas: [], nota: 'A fonte não associa este item a nenhuma aula (sem tag, sem atributo).' };

// ═══ § Caso ════════════════════════════════════════════════════════════
const WC = walk('caso');
const cSec = one(WC, 'sec_id');
const cLede = one(WC, 'lede');
const cPs = all(WC, 'paragrafo');
const cTit = all(WC, 'titulo');
const cLista = one(WC, 'lista');
const cBoxes = all(WC, 'box');
const idxC2 = WC.blocos.indexOf(cTit[1]);
const parteLit = cSec.rotulo.match(/Parte \d+/)?.[0] ?? null;
const identLit = cLede.texto.match(/^Operação A — [^.]+/)?.[0] ?? null;
const caso = {
  id: 'm05-caso',
  tipo: 'caso',
  camada: 'fonte',
  marcador: cSec.marcador,
  rotulo_marcador: cSec.rotulo,
  titulo: one(WC, 'titulo_secao'),
  parte: parteLit ? { texto: parteLit, origem: cSec.origem } : null,
  nota_parte: 'A fonte do M05 numera o caso: "Operação A — Parte 5", e o lede diz que "As Partes 1 a 4 olharam consumo, rede, tecnologia e exposição de mercado" (fio condutor entre módulos 01–05). P17 (decidido sobre o M01, onde não há "Parte") fixa o título de produto "Caso — Operação A" e proíbe tratar etapas de interface como "Partes" da fonte; aqui o "Parte 5" É texto da fonte e fica registrado. Ver div-m05-apa-01.',
  identificacao: identLit ? { texto: identLit, origem: cLede.origem } : null,
  lead: cLede,
  contexto: cPs.filter((p) => WC.blocos.indexOf(p) < WC.blocos.indexOf(cTit[0])).map((p, i) => ({ id: `m05-caso-p${i + 1}`, ...p })),
  dados: null,
  nota_dados: 'O caso do M05 não traz dados numéricos (nenhuma tabela, fatura, tarifa ou valor). Os únicos "dados" são a identificação literal ("Operação A — mineração em Minas Gerais") e a afirmação de que a planta pode ter migrado ao mercado livre (Parte 4).',
  perguntas: {
    titulo: { numero: cTit[0].numero, texto: cTit[0].texto, html: cTit[0].html, origem: cTit[0].origem },
    total: cLista.itens.length,
    itens: cLista.itens.map((it) => ({ id: `m05-caso-q${pad(it.ordem)}`, tipo: 'pergunta_de_diagnostico', ordem: it.ordem, rotulo_html: it.cabeca_html, rotulo_texto: it.cabeca_texto, pergunta_html: it.corpo_html, pergunta_texto: it.corpo_texto, html: it.html, origem: it.origem })),
    nota: 'São perguntas de diagnóstico que a operação/analista responde sobre a planta — não perguntas com resposta de referência. A fonte não dá gabarito.',
  },
  escopo_negativo: { titulo: { numero: cTit[1].numero, html: cTit[1].html, texto: cTit[1].texto, origem: cTit[1].origem }, paragrafo: WC.blocos[idxC2 + 1] },
  disciplina: cBoxes.find((b) => b.rotulo === 'Disciplina do caso'),
  bloco_de_produto_P7: cBoxes.find((b) => b.rotulo === 'Onde isso entra no produto'),
  decisao_pedida: null,
  nota_decisao: 'A fonte não pede decisão: o §C.2 diz que a parte "não recomenda ação regulatória" e o box "Disciplina do caso" diz "Nada aqui é recomendação". O produto do caso é "um mapa de exposição regulatória e um inventário" (C.2). P17 autoriza um Desafio de decisão da camada Alexandria, só com fatos do caso.',
  vinculos: {
    aulas_declaradas: [],
    mencoes_em_prosa: WC.blocos.flatMap((b) => (b.texto && /Aula \d\d|Parte \d|Partes \d/.test(b.texto) ? [{ literal: b.texto.match(/(Aula \d\d|Partes? \d( a \d)?)/g), linha_aprox: b.origem.linha_aprox }] : [])),
    nota: 'O caso não aponta aula por tag; a prosa cita a Aula 04 (mecanismo de captura) e as Partes 1–4 do caso (módulos anteriores). O quiz Q10 cita "Aula 05 e §Caso".',
  },
  codigo_atual: 'Não extraído: nenhum arquivo de src/lib/data traz o §Caso do M05.',
  origem: origem(WC.ini, 'section#caso'),
};
if (caso.perguntas.total !== 8) fail('caso: esperava 8 perguntas');

// ═══ § Quiz ════════════════════════════════════════════════════════════
const WQ = walk('quiz');
const nQ = find(/^\s*var Q=\[$/, SCRIPT.ini);
const nQend = find(/^\s*\];$/, nQ);
const Q = new Function(`return ${L.slice(nQ - 1, nQend).join('\n').replace(/^\s*var Q=/, '').replace(/;\s*$/, '')}`)();
const nQs = findAll(/^\s*\{q:'/, nQ, nQend);
if (Q.length !== 10 || nQs.length !== 10) fail('quiz: esperava 10');
const LETRAS = ['A', 'B', 'C', 'D'];
const nTpl = find(/Questão '\+\(i\+1\)\+' de 10/, nQend);
const nScoreIf = find(/if\(sc>=8\)\{/, nQend);
const avaliacao = {
  id: 'm05-quiz',
  tipo: 'avaliacao',
  marcador: one(WQ, 'sec_id').marcador,
  rotulo_marcador: one(WQ, 'sec_id').rotulo,
  titulo: one(WQ, 'titulo_secao'),
  introducao: one(WQ, 'lede'),
  mecanica_fonte: 'As 10 questões são renderizadas por script (var Q) com radio por questão; o botão "Corrigir" corrige tudo de uma vez, marca a alternativa certa (opt right) e a escolhida errada (opt wrong), mostra o feedback f de TODAS as questões (acerto, erro ou sem resposta) e o placar "sc / 10". Questão sem resposta conta como erro, sem marcação. "Refazer" limpa tudo.',
  total_questoes: Q.length,
  criterio_literal_prosa: { texto: one(WQ, 'lede').texto.match(/O critério[^.]*\./)[0], origem: one(WQ, 'lede').origem },
  faixas_de_placar_script: {
    faixas: [
      { condicao: 'sc>=8', minimo: 8, intervalo: '8–10', classe: 'score show pass', mensagem: at(nScoreIf + 2, /textContent='(.*)';/), linha_aprox: nScoreIf + 2 },
      { condicao: 'else', minimo: 0, intervalo: '0–7', classe: 'score show fail', mensagem: at(nScoreIf + 5, /textContent='(.*)';/), linha_aprox: nScoreIf + 5 },
    ],
    origem: origem(nScoreIf, 'script QUIZ q-go click'),
    nota_P18: 'A faixa ≥8 afirma "Critério de domínio atingido" — P18: registro legado; o produto não declara domínio por limiar.',
  },
  rotulos_de_interface_fonte: {
    rotulo_questao_template: { texto: "Questão '+(i+1)+' de 10", origem: origem(nTpl, 'script QUIZ .qh') },
    botoes: all(WQ, 'ui_quiz').filter((b) => /<button/.test(b.html)).map((b) => ({ texto: stripTags(b.html), linha_aprox: b.linha_aprox })),
    placar: { texto: "sc+' / 10'", origem: origem(find(/q-num'\)\.textContent=sc/, nQend), 'script QUIZ #q-num') },
  },
  perguntas: Q.map((q, i) => {
    const aulaCit = q.f.match(/^((?:Aula \d\d)(?: e §\w+)?)\./)?.[1] ?? null;
    return {
      id: `m05-quiz-q${pad(i + 1)}`,
      tipo: 'questao-multipla-escolha',
      rotulo_fonte: `Questão ${i + 1} de 10`,
      enunciado: q.q,
      alternativas: q.o.map((o, j) => ({ letra: LETRAS[j], indice: j, texto: o })),
      gabarito: { indice: q.a, letra: LETRAS[q.a], texto: q.o[q.a] },
      explicacao: q.f,
      vinculos: {
        aula_citada_na_explicacao: aulaCit,
        aulas_declaradas: aulaCit ? [...aulaCit.matchAll(/Aula (\d\d)/g)].map((m) => `aula-05-${m[1]}`) : [],
        nota: 'O vínculo vem do prefixo literal da explicação ("Aula NN."), não de atributo.',
      },
      origem: origem(nQs[i], `<script> var Q[${i}]`),
    };
  }),
  codigo_atual: 'Não extraído: nenhum arquivo de src/lib/data traz o quiz do M05.',
};
const gabIdx = [...new Set(Q.map((q) => q.a))];

// ═══ § Final ═══════════════════════════════════════════════════════════
const WF = walk('final');
const fItens = one(WF, 'lista').itens;
const p14 = (t) => {
  const tags = ['producao_oral_ou_livre', 'sem_consulta'];
  if (/Calcula|calcula/.test(t)) tags.push('calculo');
  if (/Escreve de cabeça/.test(t)) tags.push('escrita_de_memoria');
  if (/Aplica .* a uma decisão concreta|Plota/.test(t)) tags.push('aplicacao');
  return tags;
};
const checklist_final = {
  id: 'm05-final',
  tipo: 'checklist_final',
  marcador: one(WF, 'sec_id').marcador,
  rotulo_marcador: one(WF, 'sec_id').rotulo,
  titulo: one(WF, 'titulo_secao'),
  introducao: one(WF, 'lede'),
  mecanica_fonte: 'Lista estática <ul class="ck"> — sem checkbox, sem script, sem persistência.',
  declarado_prosa: 'Vinte e uma',
  total_itens: fItens.length,
  itens: fItens.map((it) => ({ id: `m05-checklist-${pad(it.ordem)}`, tipo: 'item-de-checklist', ordem: it.ordem, html: it.html, texto: it.texto, marcacao_p14: p14(it.texto), origem: it.origem, vinculos: { ...SEM_AULA, nota: 'A prosa diz "Cada uma que falhar aponta uma aula específica", mas nenhum item declara a aula.' } })),
  itens_orais_ou_cronometrados_P14: fItens.map((it) => `m05-checklist-${pad(it.ordem)}`),
  nota_P14: 'Todos os 21 são orais/livres pela instrução do lede ("Responda sem travar e sem consultar"). Nenhum é cronometrado no §Final (os cronômetros estão no §Voz). marcacao_p14 é inferência desta extração.',
  codigo_atual: 'Não extraído: nenhum arquivo de src/lib/data traz o §Final do M05 (alexandria-badges.ts usa checklists só dos M01–M03).',
};
if (checklist_final.total_itens !== 21) fail('final: esperava 21');

// ═══ § Ex ══════════════════════════════════════════════════════════════
const WE = walk('ex');
const codEx = Object.fromEntries(MODULO_05_EXERCICIOS_SOLTOS.map((e) => [e.id, e]));
const exItens = all(WE, 'details').map((d) => {
  const m = d.resumo.match(/^(\d\d) · (.*)$/);
  if (!m) fail(`ex resumo ${d.resumo}`);
  const [pe, pg, ...extra] = d.paragrafos;
  if (!/^<span class="term">Enunciado\.<\/span>/.test(pe.html) || !/^<span class="term">Gabarito\.<\/span>/.test(pg.html)) fail(`ex ${m[1]} estrutura`);
  const gab = [pg, ...extra];
  const all3 = [d.resumo, ...d.paragrafos.map((p) => p.texto)].join(' ');
  const mencoes = [...new Set(all3.match(/Aula \d\d|Módulo \d\d|termômetro|mapa de dois eixos|régua/gi) ?? [])];
  const id = `ex-${m[1]}`;
  const c = codEx[id];
  const codGab = c ? collapse(c.config.gabarito) : null;
  return {
    id: `m05-ex-${m[1]}`,
    tipo: 'exercicio',
    tag: d.resumo,
    numero: m[1],
    titulo: m[2],
    enunciado: { html: pe.html, texto: pe.texto.replace(/^Enunciado\.\s*/, ''), linha_aprox: pe.linha_aprox },
    resposta_de_referencia: { paragrafos: gab.map((p) => ({ html: p.html, texto: p.texto, linha_aprox: p.linha_aprox })), texto: gab.map((p) => p.texto).join(' ').replace(/^Gabarito\.\s*/, '') },
    criterio: null,
    nota_criterio: 'A fonte não dá critério por exercício; o critério geral está no lede do §Ex (modulo.json#criterio m05-crit-ex).',
    tem_calculo_no_gabarito: /\d\s*[×=]\s*\d|≈/.test(gab.map((p) => p.texto).join(' ')),
    aula_vinculada: null,
    sem_aula_P9: true,
    mencoes_em_prosa: mencoes,
    vinculos_nota: 'Tag "NN · Título" sem aula. Menções em prosa não são tag de posse (protocolo §4).',
    comparacao_codigo: c ? {
      id_codigo: c.id,
      tag_igual: c.config.tag === d.resumo,
      enunciado_igual: collapse(c.prompt) === pe.html,
      gabarito_igual_concat: codGab === gab.map((p) => p.html).join(' '),
      gabarito_codigo_inicio: codGab.slice(0, 60),
      paragrafos_fonte: gab.length,
      points_codigo: c.points,
      nota: 'O código concatena os parágrafos do gabarito numa string só (sem <p>); points: 1 não tem origem na fonte.',
    } : { status: 'ausente' },
    origem: d.origem,
  };
});
const exercicios = {
  id: 'm05-ex',
  tipo: 'exercicios',
  marcador: one(WE, 'sec_id').marcador,
  rotulo_marcador: one(WE, 'sec_id').rotulo,
  titulo: one(WE, 'titulo_secao'),
  introducao: one(WE, 'lede'),
  mecanica_fonte: '<details><summary> — o gabarito abre ao clicar no resumo, sem tentativa registrada.',
  declarado_prosa: { total: 'Dez', com_conta: 'cinco', raciocinio: 'outros cinco' },
  total_na_fonte: exItens.length,
  com_calculo_explicito_no_gabarito: exItens.filter((e) => e.tem_calculo_no_gabarito).map((e) => e.numero),
  soltos_P9: exItens.map((e) => e.id),
  vinculados_a_aula_indice: [],
  itens: exItens,
  codigo_atual: 'Os 10 estão em alexandria-modulo-05-content.ts → MODULO_05_EXERCICIOS_SOLTOS (ids ex-01..ex-10), exibidos em Recursos do Módulo.',
};

// ═══ § Ref ═════════════════════════════════════════════════════════════
const WR = walk('ref');
const refItens = one(WR, 'lista').itens.map((it) => {
  const m = it.html.match(/^<span class="src">(.*?)<\/span>(.*?)(?:<br><a href="(.*?)">(.*?)<\/a>)?$/);
  if (!m) fail(`ref ${it.ordem}`);
  const [esq, ...dir] = m[1].split(' · ');
  const inst = /^(ANEEL|ONS|CCEE)$/.test(esq) ? esq : null;
  return {
    id: `m05-ref-${pad(it.ordem)}`,
    tipo: 'referencia',
    html: it.html,
    texto: it.texto,
    rotulo_src: m[1],
    rotulo_esquerda: esq,
    rotulo_direita: dir.join(' · ') || null,
    instituicao: inst,
    descricao_html: collapse(m[2]),
    descricao_texto: stripTags(m[2]),
    url: m[3] ?? null,
    link_texto: m[4] ?? null,
    dominio_citado: m[3] ? new URL(m[3]).hostname : null,
    tipo_fonte: null,
    data: null,
    ano_no_rotulo: m[1].match(/\/(\d{4})/g)?.map((y) => y.slice(1)) ?? [],
    nota_campos: `instituicao: preenchida só quando o rótulo começa pelo nome da instituição (ANEEL/ONS/CCEE); normas (Lei/Decreto/Constituição) ficam null — a fonte não diz o órgão emissor. tipo_fonte e data: a fonte não tipifica nem data as referências (sem data de acesso/publicação); ano_no_rotulo é o ano literal do número da norma.${m[3] ? '' : ' url: sem <a href> neste item.'}`,
    vinculos: { aulas_declaradas: [], mencoes_em_prosa: [...new Set(stripTags(m[2]).match(/Aula \d\d|Bloco \d+/g) ?? [])], nota: 'A fonte declara as referências no nível do módulo.' },
    origem: it.origem,
  };
});
const referencias = {
  id: 'm05-ref',
  tipo: 'referencias',
  marcador: one(WR, 'sec_id').marcador,
  rotulo_marcador: one(WR, 'sec_id').rotulo,
  titulo: one(WR, 'titulo_secao'),
  introducao: one(WR, 'lede'),
  total: refItens.length,
  com_url: refItens.filter((r) => r.url).length,
  itens: refItens,
  codigo_atual: 'Não extraído para o M05 (nenhuma das 16 referências está em src/lib/data como referência do módulo; "Lei nº 8.987/1995" e "PRORET" aparecem só como verbetes de glossário dos M06/M07).',
};

// ═══ § Lex ═════════════════════════════════════════════════════════════
const WL = walk('lex');
const codM05 = ALEXANDRIA_GLOSSARIO.filter((t) => t.id.startsWith('gl-m05-'));
const grupos = all(WL, 'details').map((d, gi) => {
  const m = d.resumo.match(/^(.*) · (\d+) termos$/);
  if (!m) fail(`lex resumo ${d.resumo}`);
  return { ordem: gi + 1, nome: m[1], declarado: +m[2], resumo: d.resumo, paragrafos: d.paragrafos, origem: d.origem };
});
let k = 0;
const termos = grupos.flatMap((g) => g.paragrafos.map((p) => {
  const m = p.html.match(/^<span class="term">(.*?)<\/span>\s*(.*)$/);
  if (!m) fail(`lex termo ${p.linha_aprox}`);
  k++;
  const termo = stripTags(m[1]).replace(/\.$/, '');
  const defHtml = collapse(m[2]);
  const cands = codM05.filter((t) => t.term === termo);
  const c = cands.length === 1 ? cands[0] : null;
  const campos = c ? { term: c.term === termo, unit: c.unit === g.nome, definition: collapse(c.definition) === defHtml } : null;
  return {
    id: `m05-lex-${pad(k)}`,
    tipo: 'termo-de-glossario',
    termo,
    termo_html_fonte: m[1],
    grupo: g.nome,
    definicao_html: defHtml,
    definicao_texto: stripTags(m[2]),
    origem: origem(p.linha_aprox, `section#lex details(${g.nome}) > p > span.term`),
    vinculos: { aulas_declaradas: [], nota: 'A fonte não liga termo a aula.' },
    comparacao_codigo: c ? { status: Object.values(campos).every(Boolean) ? 'identico' : 'divergente', campos, id_codigo: c.id, aulaIds_codigo: c.aulaIds, ...(campos.definition ? {} : { definicao_codigo: c.definition }) } : { status: cands.length ? 'ambiguo' : 'ausente_no_codigo' },
  };
}));
const somaGrupos = grupos.reduce((a, g) => a + g.declarado, 0);
const soNoCodigo = codM05.filter((c) => !termos.some((t) => t.comparacao_codigo.id_codigo === c.id)).map((c) => ({ id: c.id, term: c.term }));
const glossario = {
  id: 'm05-lex',
  tipo: 'glossario',
  marcador: one(WL, 'sec_id').marcador,
  rotulo_marcador: one(WL, 'sec_id').rotulo,
  titulo: one(WL, 'titulo_secao'),
  introducao: one(WL, 'lede'),
  grupos: grupos.map((g) => ({ ordem: g.ordem, nome: g.nome, resumo_literal: g.resumo, declarado: g.declarado, markup: g.paragrafos.length, origem: g.origem })),
  contagem: {
    prosa_h2: one(WL, 'titulo_secao').texto,
    pilula_hero: '72 termos',
    soma_declarada_grupos: somaGrupos,
    markup_span_term_no_lex: termos.length,
    codigo_gl_m05: codM05.length,
    identicos: termos.filter((t) => t.comparacao_codigo.status === 'identico').length,
    divergentes: termos.filter((t) => t.comparacao_codigo.status === 'divergente').map((t) => t.id),
    ausentes_no_codigo: termos.filter((t) => t.comparacao_codigo.status === 'ausente_no_codigo').map((t) => t.termo),
    so_no_codigo: soNoCodigo,
    span_term_no_arquivo_inteiro: findAll(/class="term"/).reduce((a, n) => a + (ln(n).match(/class="term"/g) || []).length, 0),
    nota: 'O arquivo tem 92 span.term: 72 no §Lex + 20 no §Ex (Enunciado./Gabarito. × 10). A contagem vale só dentro do §Lex.',
  },
  ordem_fonte: 'Por família temática (5 <details>), não alfabética.',
  termos,
  codigo_atual: `Os ${codM05.length} verbetes gl-m05-* estão em src/lib/data/alexandria-glossario.ts (unit = nome da família).`,
};
if (termos.length !== 72) fail(`lex: ${termos.length}`);

// ═══ divergências ══════════════════════════════════════════════════════
const divergencias = [
  {
    id: 'div-m05-apa-01', tema: 'Numeração do caso: "Operação A — Parte 5"', tipo: 'fonte_x_decisao',
    leituras: [
      { onde: `§Caso sec-id (L${cSec.origem.linha_aprox})`, literal: cSec.rotulo },
      { onde: `§Caso lede (L${cLede.origem.linha_aprox})`, literal: cLede.texto.match(/As Partes 1 a 4[^.]*\./)?.[0] },
      { onde: `§Caso p (L${cPs[1].origem.linha_aprox})`, literal: cPs[1].texto.match(/[^.]*Parte 4[^.]*\./)?.[0] },
      { onde: 'decisão P17 (sobre o M01)', literal: 'Não existe "Parte 1". O título é Caso — Operação A.' },
    ],
    nota: 'No M05 a "Parte" é texto da fonte e pressupõe Partes 1–4 nos módulos 01–04; a extração do M01 registrou zero "Parte" no caso do M01. A continuidade Parte 1→5 não se verifica pelo M01.',
    decisao: 'Nenhuma na camada fonte. Para o produto: P17 (título "Caso — Operação A"; etapas de interface não são "Partes").',
  },
  {
    id: 'div-m05-apa-02', tema: 'Gabarito do quiz sempre na mesma posição', tipo: 'qualidade_fonte',
    nota: `As 10 questões têm a: ${JSON.stringify(gabIdx)} — a alternativa correta é sempre a segunda (B). Chutar "B" dá 10/10 e dispara "Critério de domínio atingido".`,
    decisao: 'Registrar para CONTENT QA; a camada de produto pode embaralhar alternativas sem alterar o texto.',
  },
  {
    id: 'div-m05-apa-03', tema: '"Em cinco deles há conta"', tipo: 'fonte_x_fonte',
    leituras: [
      { onde: `§Ex lede (L${exercicios.introducao.origem.linha_aprox})`, literal: exercicios.introducao.texto.match(/Em cinco deles há conta[^.]*\./)?.[0] },
      { onde: 'gabaritos (markup)', literal: `cálculo explícito (× = ≈) só nos exercícios ${exercicios.com_calculo_explicito_no_gabarito.join(', ')}` },
    ],
    nota: 'Números aparecem nos enunciados 01 (200 mil), 02 (60/240 dias), 03 (10 MW), 06 (12%/2%), 09 (R$ 400 mi) e 10 (70%), mas só o 04 pede e mostra uma conta. A divisão 5 + 5 não é verificável pelo markup.',
    decisao: 'Nenhuma.',
  },
  {
    id: 'div-m05-apa-04', tema: 'Itens que "apontam a aula" sem declarar a aula', tipo: 'fonte_x_fonte',
    leituras: [
      { onde: '§Ex lede', literal: exercicios.introducao.texto.match(/Os que travarem[^.]*\./)?.[0] },
      { onde: '§Final lede', literal: checklist_final.introducao.texto.match(/Cada uma que falhar[^.]*\./)?.[0] },
    ],
    nota: 'Nenhum exercício nem item do §Final tem aula declarada (P9). Só o quiz declara aula (prefixo da explicação).',
    decisao: 'Vínculo aula ↔ exercício/checklist, se usado, é derivação (camada Alexandria).',
  },
  {
    id: 'div-m05-apa-05', tema: 'Contagens declaradas × markup', tipo: 'concordancia',
    itens: [
      { item: 'termos', prosa: glossario.contagem.prosa_h2, pilula: '72', soma_grupos: somaGrupos, markup: termos.length },
      { item: 'exercícios', prosa: 'Dez', pilula: '10', markup: exercicios.total_na_fonte },
      { item: 'questões', prosa: 'Dez', pilula: '10', markup: avaliacao.total_questoes },
      { item: 'checklist', prosa: 'Vinte e uma', markup: checklist_final.total_itens },
      { item: 'perguntas-relâmpago', prosa: 'trinta e quatro', pilula: '34', markup: 34 },
      { item: 'referências', prosa: null, markup: referencias.total },
    ],
    nota: 'Todas as contagens declaradas batem com o markup (diferente do M01 "28 × 38").',
    decisao: 'Nenhuma.',
  },
  {
    id: 'div-m05-apa-06', tema: 'Exercícios no código', tipo: 'fonte_x_codigo', severidade: 'baixa',
    nota: `Enunciados idênticos: ${exItens.filter((e) => e.comparacao_codigo.enunciado_igual).length}/10; tags idênticas: ${exItens.filter((e) => e.comparacao_codigo.tag_igual).length}/10; gabarito = concatenação dos <p>: ${exItens.filter((e) => e.comparacao_codigo.gabarito_igual_concat).length}/10. O enunciado e o gabarito do código mantêm o <span class="term">Enunciado./Gabarito.</span>. points: 1 em todos, sem origem. O §Ex não tem limiar numérico.`,
    decisao: 'Registrar.',
  },
  {
    id: 'div-m05-apa-07', tema: 'Glossário no código', tipo: 'fonte_x_codigo',
    nota: `${glossario.contagem.identicos}/72 idênticos (termo, família, definição); divergentes: ${glossario.contagem.divergentes.length}; ausentes no código: ${glossario.contagem.ausentes_no_codigo.length}; só no código: ${soNoCodigo.length}.`,
    decisao: 'Registrar.',
  },
  {
    id: 'div-m05-apa-08', tema: 'Sequência imposta pelo placar do quiz', tipo: 'fonte_x_decisao',
    leituras: avaliacao.faixas_de_placar_script.faixas.map((f) => ({ onde: `script L${f.linha_aprox}`, literal: f.mensagem })),
    nota: 'A mensagem <8 proíbe avançar para o §Voz ("Não avance para o §Voz antes de fechar 8"): um limiar legado travando progressão.',
    decisao: 'P18: nenhum limiar legado trava a próxima etapa no produto.',
  },
];

const out = {
  schema: 'alexandria-v2/extraction/aparato@1',
  modulo: '05',
  grupo: 'aparato',
  fonte: FONTE,
  gerado_em: HOJE,
  gerado_por: 'docs/alexandria-v2/extraction/m05/extratores/m05_aparato.mjs',
  metodo: 'Seções pelo percorredor m05_lib.walk (falha em linha não classificada); quiz avaliando o literal `var Q=[…]` do <script> (new Function), sem digitação; código lido por bundle temporário (esbuild) só para comparar.',
  convencoes: { linha_aprox: 'Linha 1-based na fonte.', null: 'Ausência declarada; sempre acompanhada de nota.', camada: 'Tudo aqui é camada "fonte".' },
  caso,
  avaliacao,
  checklist_final,
  exercicios,
  referencias,
  glossario,
  divergencias,
};
writeJson('aparato.json', out);
console.log('aparato.json', {
  caso_perguntas: caso.perguntas.total, quiz: avaliacao.total_questoes, gabIdx, faixas: avaliacao.faixas_de_placar_script.faixas.length,
  checklist: checklist_final.total_itens, ex: exercicios.total_na_fonte, ex_calc: exercicios.com_calculo_explicito_no_gabarito,
  ex_cmp: exItens.map((e) => [e.comparacao_codigo.tag_igual, e.comparacao_codigo.enunciado_igual, e.comparacao_codigo.gabarito_igual_concat].map(Number).join('')),
  refs: referencias.total, refs_url: referencias.com_url, termos: termos.length, grupos: grupos.map((g) => `${g.declarado}/${g.paragrafos.length}`),
  lex: { ident: glossario.contagem.identicos, div: glossario.contagem.divergentes, aus: glossario.contagem.ausentes_no_codigo, so: soNoCodigo, spans: glossario.contagem.span_term_no_arquivo_inteiro },
  caso_mencoes: caso.vinculos.mencoes_em_prosa,
});
