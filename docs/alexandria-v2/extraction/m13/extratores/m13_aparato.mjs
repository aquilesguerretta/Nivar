// Grupo "aparato" do M13 → aparato.json.
import {
  S, LINES, SRC, DOC, JS, all, first, kids, inner, byTag, byClass, hasClass, txt, texto, htmlN, origem, origemOff,
  byId, writeJSON, readRepo, pad, fail, lineOf, jsLiteral, jsBlock, jsFind, jsLine, runScript, innerSkipping, collapse,
} from './m13_lib.mjs';
import { secId, blocosDaSecao, envolvente } from './m13_blocos.mjs';
import { marcacaoP14, NOTA_P14 } from './m13_p14.mjs';

const secs = all(DOC, byTag('section'));
const secOf = (off) => secs.find((s) => s.start <= off && s.end >= off)?.attrs.id ?? null;
const aulaRefs = (t) => [...new Set((t.match(/Aulas?\s+\d\d(?:\s+e\s+\d\d)?/g) || []))];

// ── caso ─────────────────────────────────────────────────────
const casoSec = byId('caso');
const casoBl = blocosDaSecao(casoSec);
const casoMk = secId(casoSec);
const perguntasCaso = [];
{
  const walk = (b, path) => {
    for (const [k, v] of Object.entries(b)) {
      if ((k === 'texto' || k === 'titulo') && typeof v === 'string') {
        for (const m of v.matchAll(/[^.?!:]*\?/g)) {
          const frase = m[0].trim();
          if (frase.length <= 8) continue;
          // bloco sem origem própria (itens do t333): localiza a frase na section
          let org = b.origem ?? null;
          if (!org) {
            const off = S.indexOf(frase.slice(0, 40), casoSec.start);
            if (off < 0 || off > casoSec.end) fail(`pergunta do caso não localizada: ${frase}`);
            org = origemOff(off, `section#caso div.t333 li (${path})`);
          }
          perguntasCaso.push({ frase, bloco: path, origem: org });
        }
      } else if (v && typeof v === 'object') walk(v, `${path}.${k}`);
    }
  };
  casoBl.forEach((b, i) => walk(b, `blocos[${i}]`));
}
const casoTexto = texto(inner(casoSec));
const caso = {
  id: 'm13-caso-operacao-a',
  tipo: 'caso',
  marcador: casoMk,
  parte: { texto: 'Parte 13', origem: casoMk.origem },
  parte_nota: 'Ao contrário do M01, a fonte do M13 numera o caso como parte de série: "Operação A — Parte 13" no sec-id, e o lede cita "As doze partes anteriores", "Parte 11", "Parte 12" e "A Parte 13 inverte o lado da mesa". Registrado literal; ver div-m13-caso-parte-13 (P17).',
  blocos: casoBl,
  perguntas_literais: perguntasCaso.map((p, i) => ({ id: `m13-caso-pergunta-${pad(i + 1)}`, ...p })),
  perguntas_nota: 'Frases terminadas em "?" dentro do §Caso, recortadas por programa. As três "perguntas de estrutura" (C.2) já vêm com a leitura da própria fonte (corpo + âncora); as lacunas (C.2) trazem "Pergunta:" e "Impacto:". A fonte não pede resposta do learner a nenhuma delas.',
  decisao_pedida: null,
  decisao_nota: 'A fonte não pede decisão: o box final (L2508-2516) declara que as perguntas "são diagnósticas" e "não constituem recomendação de contratar, de não contratar, nem de estruturar qualquer operação financeira". P17 autoriza um Desafio de decisão na camada Alexandria, só com fatos do caso.',
  referencias_em_prosa: {
    aulas: aulaRefs(casoTexto),
    modulos: [...new Set(casoTexto.match(/Módulos? \d\d(?: e \d\d)?/g) || [])],
    instrumentos: [...new Set(casoTexto.match(/Andaime/g) || [])],
    nota: 'Menções em prosa, não tags de vínculo (protocolo §4).',
  },
  estado_no_codigo: 'ausente (o §Caso não existe em src/lib/data)',
};

// ── avaliação (quiz) ─────────────────────────────────────────
const quizSec = byId('quiz');
const qb = jsBlock('/* ===================== QUIZ ===================== */');
const Q = jsLiteral('Q', qb.start);
const LET = ['A', 'B', 'C', 'D'];
// Há dois ternários `acertos>=8 ? … : …` no script: o 1º dá a classe
// ('pass'/'fail'); o 2º dá a mensagem. Separados pelo comprimento.
const ternarios = [...qb.code.matchAll(/\(acertos>=8\s*\?\s*'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)'\)/g)];
const faixa = ternarios.find((m) => m[1].length > 20);
const classeFaixa = ternarios.find((m) => m[1].length <= 20);
if (!faixa || !classeFaixa) fail('faixas quiz');
const unq = (s) => s.replace(/\\'/g, "'");
// execução do script: placar com 0 e com 10 acertos
const run0 = runScript(); run0.$('quiz-go').click();
const run10 = runScript();
Q.value.forEach((q, i) => { const inp = run10.document.querySelector(`input[name="q${i}"][value="${q.a}"]`); inp.checked = true; });
run10.$('quiz-go').click();
const quizBl = blocosDaSecao(quizSec);
const avaliacao = {
  id: 'm13-quiz',
  tipo: 'avaliacao',
  marcador: secId(quizSec),
  titulo: quizBl.find((b) => b.tipo === 'titulo_secao'),
  criterio_literal_prosa: quizBl.find((b) => b.tipo === 'lede'),
  perguntas: Q.value.map((q, i) => {
    const at = JS.indexOf(`{q:'${q.q.slice(0, 30).replace(/'/g, "\\'")}`, qb.start);
    return {
      id: `m13-quiz-q${pad(i + 1)}`, ordem: i + 1,
      rotulo_fonte_renderizado: `Questão ${i + 1} de ${Q.value.length}`,
      enunciado: q.q,
      alternativas: q.o.map((o, j) => ({ letra: LET[j], indice: j, texto: o })),
      gabarito: { indice: q.a, letra: LET[q.a], texto: q.o[q.a] },
      explicacao: q.f,
      feedback_nota: 'O mesmo texto `f` é mostrado para acerto e para erro, em todas as questões, depois de "Corrigir".',
      aula_citada_em_prosa: aulaRefs(`${q.q} ${q.o.join(' ')} ${q.f}`),
      origem: { seletor: 'script › QUIZ › var Q[]', trecho_inicial: collapse(JS.slice(at, at + 90)), linha_aprox: jsLine(at) },
    };
  }),
  faixas_de_placar_script: [
    { condicao: 'acertos>=8', classe: `score show ${classeFaixa[1]}`, mensagem_html: unq(faixa[1]), mensagem_texto: texto(unq(faixa[1])) },
    { condicao: 'acertos<8', classe: `score show ${classeFaixa[2]}`, mensagem_html: unq(faixa[2]), mensagem_texto: texto(unq(faixa[2])) },
  ],
  faixas_nota: '`condicao` e `classe` vêm do código (L4251-4255); só `mensagem_*` é texto verbatim. A fonte tem duas faixas, coerentes com "critério de oito acertos" (ao contrário do M01). P18: o limiar é registro legado; não declara domínio nem aprovação.',
  execucao_script: {
    zero_acertos: { placar_html: run0.$('quiz-score').innerHTML, classe: run0.$('quiz-score').className, mensagem_e_a_faixa_fail: run0.$('quiz-score').innerHTML.includes(unq(faixa[2])) },
    dez_acertos: { placar_html: run10.$('quiz-score').innerHTML, classe: run10.$('quiz-score').className, mensagem_e_a_faixa_pass: run10.$('quiz-score').innerHTML.includes(unq(faixa[1])) },
    nota: 'Script original executado em DOM simulado (m13_lib.runScript): sem marcar nada → faixa fail; marcando os 10 gabaritos → faixa pass.',
  },
  rotulos_de_interface_fonte: {
    botao_corrigir: texto(inner(byId('quiz-go'))),
    botao_refazer: texto(inner(byId('quiz-reset'))),
    template_questao: "'Questão '+(i+1)+' de '+Q.length",
    template_placar: "acertos+' / '+Q.length",
    origem: origem(byId('quiz-go'), 'section#quiz button#quiz-go'),
  },
  mecanica_fonte: [
    'Uma tentativa por clique em "Corrigir": todas as 10 questões são corrigidas juntas, e o feedback `f` aparece em todas, respondidas ou não.',
    'Questão sem resposta conta como erro (não soma acerto).',
    'A alternativa correta recebe a classe `right`; a marcada errada, `wrong` (cor), o que conflita com S2/C7.',
    '"Refazer" reconstrói o quiz e limpa o placar; não há persistência.',
  ],
  mecanica_nota: 'Descrição desta extração a partir do código L4220-4261, não texto da fonte.',
  estado_no_codigo: 'ausente (o quiz não existe em src/lib/data)',
};
if (avaliacao.perguntas.length !== 10) fail('10 questões');

// ── checklist final ──────────────────────────────────────────
const finSec = byId('final');
const ck = first(finSec, byClass('ck'));
const checklist_final = {
  id: 'm13-checklist-final',
  marcador: secId(finSec),
  titulo: blocosDaSecao(finSec).find((b) => b.tipo === 'titulo_secao'),
  lede: blocosDaSecao(finSec).find((b) => b.tipo === 'lede'),
  itens: kids(ck).map((li, i) => {
    const t = txt(inner(li));
    return { id: `m13-check-${pad(i + 1)}`, ordem: i + 1, ...t, marcacao_p14: marcacaoP14(t.texto), autodeclarado: true, origem: origem(li, 'section#final ul.ck > li') };
  }),
  nota_p14: NOTA_P14,
  estado_no_codigo: 'ausente (nenhum badge ou item do M13 em alexandria-badges.ts)',
};
if (checklist_final.itens.length !== 28) fail('28 itens');

// ── exercícios ───────────────────────────────────────────────
const exSec = byId('ex');
const exWrap = first(exSec, byClass('wrap'));
const EVID = {
  '01': ['a03', 'converteu <b>R$ 170 milhões</b>'],
  '02': ['a01', 'EV = Valor de mercado do capital próprio + Dívida líquida + Ajustes'],
  '03': ['a02', 'não 9,09%, que é a subtração simples'],
  '04': ['a05', 'DSCR = CFADS ÷ Serviço da dívida no período'],
  '05': ['a08', 'se o investimento executado for reconhecido no próximo ciclo de revisão'],
  '06': ['map', "sinergias declaradas na combinação de negócios"],
  '07': ['a07', 'Companhia sem controlador que faz aquisições sucessivas'],
  '08': ['a03', 'garantias reais e fidejussórias constituídas em favor de credores'],
  '09': ['a03', 'cuja expectativa de perda é classificada como possível'],
  '10': ['a07', 'dois acionistas relevantes votaram contra'],
  '11': ['a07', '<b>concluída em 31 de outubro de 2024</b>, com as ações deixando de ser negociadas'],
  '12': ['a04', 'resgate compulsório</b> das\n24.255.394 ações'],
  '13': ['a04', '<b>68% do capital total</b> e cerca de <b>35,3% do capital votante</b>'],
  '14': ['a04', "Hipotética · fundo com 45% e acordo"],
};
const findEvid = (sub) => {
  const re = new RegExp(sub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'));
  const exSecN = byId('ex');
  const mm = [...S.matchAll(new RegExp(re.source, 'g'))].find((x) => x.index < exSecN.start || x.index > exSecN.end);
  if (!mm) fail(`evidência não achada fora do §Ex: ${sub}`);
  const i = mm.index;
  const inScript = i > first(DOC, byTag('script')).start;
  let instr = null;
  if (inScript) { const hdr = [...JS.slice(0, i - first(DOC, byTag('script')).openEnd).matchAll(/INST·(\d\d)/g)].pop(); instr = hdr ? `INST·${hdr[1]}` : null; }
  return { trecho: collapse(sub), linha: lineOf(i), onde: inScript ? `script (${instr})` : `section#${secOf(i)}` };
};
const exercicios = { id: 'm13-exercicios', marcador: secId(exSec), titulo: null, lede: null, grupos: [], itens: [] };
{
  const bl = blocosDaSecao(exSec);
  exercicios.titulo = bl.find((b) => b.tipo === 'titulo_secao');
  exercicios.lede = bl.find((b) => b.tipo === 'lede');
  let grupo = null;
  for (const n of kids(exWrap)) {
    if (n.tag === 'h3') {
      const num = first(n, byClass('num'));
      grupo = { numero: texto(inner(num)), titulo: texto(innerSkipping(n, (k) => k === num)), origem: origem(n, 'section#ex h3') };
      exercicios.grupos.push({ ...grupo, exercicios: [] });
    }
    if (n.tag !== 'details') continue;
    const sm = first(n, byTag('summary'));
    const ps = kids(first(n, byClass('det-bd'))).filter((k) => k.tag === 'p');
    if (ps.length !== 2) fail(`exercício com ${ps.length} p`);
    const [pp, pr] = ps.map(inner);
    const mp = pp.match(/^\s*<b>Pergunta\.<\/b>\s*([\s\S]*)$/);
    const mr = pr.match(/^\s*<b>(Resposta(?: de referência)?\.)<\/b>\s*([\s\S]*)$/);
    if (!mp || !mr) fail('rótulos do exercício');
    const tag = texto(inner(sm));
    const nn = tag.slice(0, 2);
    const all3 = `${tag} ${texto(mp[1])} ${texto(mr[2])}`;
    const ev = findEvid(EVID[nn][1]);
    const it = {
      id: `m13-ex-${nn}`, ordem: Number(nn),
      grupo: grupo.numero, grupo_titulo: grupo.titulo,
      tag, rotulo_pergunta: 'Pergunta.', enunciado: txt(mp[1]),
      rotulo_resposta: mr[1], resposta_referencia: txt(mr[2]),
      criterio: null,
      criterio_nota: 'Nenhum critério próprio por exercício. A instrução geral está no lede do §Ex ("Faça cada um antes de abrir o gabarito").',
      aula_vinculada: null,
      solto_P9: true,
      aulas_citadas_em_prosa: aulaRefs(all3),
      relacao_tematica_inferida: { aula_ou_secao: EVID[nn][0], evidencia: ev, nota: 'Anotação desta extração (não é vínculo da fonte): trecho da seção/instrumento que trata do mesmo conteúdo.' },
      origem: origem(n, 'section#ex details'),
    };
    exercicios.itens.push(it);
    exercicios.grupos[exercicios.grupos.length - 1].exercicios.push(it.id);
  }
}
if (exercicios.itens.length !== 14) fail('14 exercícios');
// comparação com o código
{
  const ts = readRepo('src/lib/data/alexandria-modulo-13-content.ts');
  const code = [...ts.matchAll(/id: "(m13-ex-\d\d)",\s*kind: '(\w+)' as const,\s*prompt: "((?:[^"\\]|\\.)*)",\s*points: (\d+),\s*config: \{ tag: "((?:[^"\\]|\\.)*)", gabarito: "((?:[^"\\]|\\.)*)" \}/g)]
    .map((m) => ({ id: m[1], kind: m[2], prompt: JSON.parse(`"${m[3]}"`), points: Number(m[4]), tag: JSON.parse(`"${m[5]}"`), gabarito: JSON.parse(`"${m[6]}"`) }));
  const recursos = readRepo('src/components/alexandria/navigation/RecursosDoModulo.tsx');
  const norm = (s) => s.replace(/\s+([.,;:])/g, '$1').replace(/\s+/g, ' ').trim();
  exercicios.comparacao_codigo = {
    arquivo: 'src/lib/data/alexandria-modulo-13-content.ts › MODULO_13_EXERCICIOS_SOLTOS',
    no_codigo: code.length,
    registrado_em_RecursosDoModulo: /'modulo-13'/.test(recursos),
    itens: exercicios.itens.map((e) => {
      const c = code.find((x) => x.id === e.id);
      const esperado = `Pergunta. ${e.enunciado.texto} ${e.rotulo_resposta} ${e.resposta_referencia.texto}`;
      return {
        id: e.id,
        presente: !!c,
        tag_igual: c?.tag === e.tag,
        prompt_vazio: c?.prompt === '',
        gabarito_funde_pergunta_e_resposta: c ? c.gabarito.startsWith('Pergunta. ') : null,
        gabarito_igual_apos_normalizar_espacos: c ? norm(c.gabarito) === norm(esperado) : null,
        gabarito_igual_exato: c ? c.gabarito === esperado : null,
        points_sem_origem: c?.points ?? null,
      };
    }),
  };
}
// variações fonte × fonte entre Ex 08-10 e INST·05
{
  const lc = jsLiteral('CASOS', JS.indexOf('INST·05'));
  const par = (ex, k) => ({
    exercicio: ex.id, trecho_exercicio: ex.enunciado.texto.match(/"([^"]+)"/)?.[1] ?? ex.enunciado.texto,
    instrumento: `INST·05 ${k}`, trecho_instrumento: lc.value.find((x) => x.k === k).tr.replace(/^"|"$/g, ''),
  });
  exercicios.variacoes_vs_INST05 = [par(exercicios.itens[7], 'g1'), par(exercicios.itens[8], 'g2'), par(exercicios.itens[9], 'g3')];
}

// ── referências ──────────────────────────────────────────────
const refSec = byId('ref');
const MES = '(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)';
const referencias = { id: 'm13-referencias', marcador: secId(refSec), titulo: blocosDaSecao(refSec).find((b) => b.tipo === 'titulo_secao'), lede: blocosDaSecao(refSec).find((b) => b.tipo === 'lede'), grupos: [], itens: [] };
{
  let g = null, k = 0;
  for (const n of kids(first(refSec, byClass('wrap')))) {
    if (n.tag === 'h3') {
      const num = first(n, byClass('num'));
      g = { numero: texto(inner(num)), titulo: texto(innerSkipping(n, (x) => x === num)), origem: origem(n, 'section#ref h3'), itens: [] };
      referencias.grupos.push(g);
    }
    if (n.tag === 'ul') {
      for (const li of kids(n)) {
        k++;
        const src = first(li, byClass('src'));
        const desc = innerSkipping(li, (x) => x === src);
        const t = texto(desc);
        const it = {
          id: `m13-ref-${pad(k)}`, ordem: k, grupo: g.numero,
          ...txt(inner(li)),
          natureza_ou_instituicao: texto(inner(src)),
          descricao: txt(desc),
          titulo: null,
          titulo_nota: 'A fonte não separa título de descrição; o nome do documento é o início de `descricao`.',
          url: null,
          dominio_citado: (t.match(/\b(?:www\.|https?:\/\/)\S+/) || [null])[0],
          datas_citadas: t.match(new RegExp(`\\d{1,2} e \\d{1,2} de ${MES} de \\d{4}|\\d{1,2}º? de ${MES} de \\d{4}|${MES} de \\d{4}|\\d{4} a \\d{4}|\\d{4}-\\d{4}`, 'g')) || [],
          consulta_em: (t.match(new RegExp(`Consulta em (\\d{1,2}º? de ${MES} de \\d{4})`)) || [null, null])[1],
          origem: origem(li, 'section#ref ul.ref-list > li'),
        };
        g.itens.push(it.id);
        referencias.itens.push(it);
      }
    }
  }
  const box = blocosDaSecao(refSec).find((b) => b.tipo === 'caixa');
  referencias.caixa_atualizacao = box;
  referencias.notas = {
    url: 'Nenhuma referência tem URL nem domínio (zero "www"/"http" na seção).',
    tipo_fonte: 'A fonte classifica por grupo (R.1 norma e regulação — fonte primária; R.2 divulgação de companhia — fonte primária de número; R.3 pesquisa de terceiro e notícia de evento — citável, nunca origem de número; R.4 referência metodológica e complemento acadêmico). `grupo` guarda isso; não há tipo por item.',
    D5: `A fonte não informa, por referência, o que responde/não responde, tema, recorte nem última verificação; só ${referencias.itens.filter((r) => r.consulta_em).length} itens trazem "Consulta em" (${referencias.itens.filter((r) => r.consulta_em).map((r) => r.id).join(", ")}).`,
  };
  referencias.estado_no_codigo = 'ausente (nenhuma referência do M13 em src; BibliotecaView não cita o M13)';
}
if (referencias.itens.length !== 36) fail(`36 refs, achei ${referencias.itens.length}`);

// ── glossário ────────────────────────────────────────────────
const lexSec = byId('lex');
const codeGl = readRepo('src/lib/data/alexandria-glossario.ts');
const codeTerms = [...codeGl.matchAll(/id: "([^"]+)",\s*term: "((?:[^"\\]|\\.)*)"/g)].map((m) => ({ id: m[1], term: JSON.parse(`"${m[2]}"`) }));
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const glossario = { id: 'm13-glossario', marcador: secId(lexSec), titulo: null, lede: null, familias: [], termos: [] };
{
  const bl = blocosDaSecao(lexSec);
  glossario.titulo = bl.find((b) => b.tipo === 'titulo_secao');
  glossario.lede = bl.find((b) => b.tipo === 'lede');
  let k = 0;
  for (const d of all(lexSec, byTag('details'))) {
    const sm = texto(inner(first(d, byTag('summary'))));
    const m = sm.match(/^Família (\d) · (.+) — (\d+) termos$/);
    if (!m) fail(`família: ${sm}`);
    const ps = kids(first(d, byClass('det-bd'))).filter((x) => x.tag === 'p');
    const fam = { numero: Number(m[1]), nome: m[2], resumo: sm, declarado: Number(m[3]), medido: ps.length, origem: origem(d, 'section#lex details > summary') };
    glossario.familias.push(fam);
    for (const p of ps) {
      k++;
      const term = first(p, byClass('term'));
      const rest = innerSkipping(p, (x) => x === term);
      const md = rest.match(/^\s*—\s*([\s\S]*)$/);
      if (!md) fail(`definição sem travessão: ${inner(p).slice(0, 60)}`);
      const termo = texto(inner(term));
      const hom = codeTerms.filter((c) => fold(c.term) === fold(termo) || fold(c.term).startsWith(fold(termo) + ' ('));
      glossario.termos.push({
        id: `m13-lex-${String(k).padStart(3, '0')}`, ordem: k, familia: fam.numero, familia_nome: fam.nome,
        termo, definicao: txt(md[1]),
        aula_ids: null,
        no_codigo_m13: false,
        homonimos_no_codigo_outros_modulos: hom.map((h) => h.id),
        origem: origem(p, `section#lex details:nth(${fam.numero}) p`),
      });
    }
  }
  const nomes = glossario.termos.map((t) => fold(t.termo));
  glossario.contagem = {
    prosa_declara: glossario.titulo.texto,
    hero_pill: '180 termos',
    soma_declarada_familias: glossario.familias.reduce((a, f) => a + f.declarado, 0),
    medido: glossario.termos.length,
    familias_com_contagem_divergente: glossario.familias.filter((f) => f.declarado !== f.medido).map((f) => f.numero),
    duplicatas_na_fonte: nomes.filter((n, i) => nomes.indexOf(n) !== i),
    codigo_bloco_m13: codeTerms.filter((c) => c.id.startsWith('gl-m13')).length,
    ausentes_no_codigo: glossario.termos.length,
    com_homonimo_em_outro_modulo: glossario.termos.filter((t) => t.homonimos_no_codigo_outros_modulos.length).length,
  };
  glossario.notas = {
    aula_ids: 'A fonte não declara vínculo termo → aula; aula_ids = null.',
    codigo: 'alexandria-glossario.ts só tem os blocos M01-M08 (Waves 8 e 34). Nenhum dos 180 verbetes do M13 está no código; todos faltam. Homônimos em outros módulos são verbetes distintos (ids namespaçados), não cobertura.',
    ordem: 'A fonte agrupa por família, sem ordem alfabética declarada.',
  };
}

// ── divergências ─────────────────────────────────────────────
const divergencias = [
  {
    id: 'div-m13-ex-vs-inst05-trechos', eixo: 'fonte × fonte', severidade: 'baixa',
    leitura_a: 'Ex 08, 09 e 10 citam trechos hipotéticos (ver exercicios.variacoes_vs_INST05).',
    leitura_b: 'INST·05 g1, g2 e g3 tratam das mesmas categorias com redação diferente (g1 acrescenta ", conforme detalhado nas notas explicativas."; g2 diz "tributária e cível"; g3 é outra frase).',
    decisao: null,
  },
  {
    id: 'div-m13-quiz-q01-rotulos', eixo: 'fonte × fonte', severidade: 'baixa',
    leitura_a: '§00.1 (tabela L658-662): quatro rótulos de EBITDA — ≈ R$ 6,78 bi, ≈ R$ 7,45 bi, ≈ R$ 8,54 bi, ≈ R$ 8,6 bi.',
    leitura_b: 'Quiz Q01: três valores ("resultado operacional reportado de R$ 6,8 bi, ajustado de R$ 8,5 bi e regulatório ajustado de R$ 8,6 bi"), chamando EBITDA de "resultado operacional" — termo que o §Lex não usa para EBITDA (o §Lex distingue EBITDA, EBIT e "Lucro operacional após impostos").',
    decisao: null,
  },
  {
    id: 'div-m13-ex14-arquetipo', eixo: 'fonte × fonte', severidade: 'baixa',
    leitura_a: 'Ex 14 (resposta): "O arquétipo é joint venture coordenada".',
    leitura_b: 'INST·06 (caso h1, o mesmo cenário 45%+30% com acordo): arquétipo "Associação com dois controladores coordenados".',
    decisao: null,
  },
  {
    id: 'div-m13-exercicios-codigo', eixo: 'fonte × código', severidade: 'media',
    leitura_a: 'Fonte: cada exercício tem "Pergunta." e "Resposta."/"Resposta de referência." em parágrafos separados, com <b>/<em>.',
    leitura_b: 'Código: `prompt: ""` nos 14; pergunta e resposta fundidas em `config.gabarito` (com o rótulo "Pergunta." dentro do gabarito); `points: 1` sem origem; espaços antes de pontuação onde havia <b>/<em>; MODULO_13_EXERCICIOS_SOLTOS não está registrado em RecursosDoModulo.tsx (não aparece na interface).',
    decisao: null,
  },
  {
    id: 'div-m13-marca-quiz', eixo: 'fonte × P24', severidade: 'baixa',
    leitura_a: 'Quiz Q10 (explicação): "não é entregue em nenhum ativo da GridAlpha".',
    leitura_b: 'P24: marca morta voltada ao learner. Mantido literal.',
    decisao: null,
  },
];

writeJSON('aparato.json', {
  schema: 'alexandria-v2/extraction/aparato@1',
  modulo: 'M13',
  grupo: 'aparato',
  fonte: { arquivo: SRC, linhas_total: LINES.length - (S.endsWith('\n') ? 1 : 0), bytes: Buffer.byteLength(S, 'utf8') },
  gerado_em: '2026-09-17',
  metodo: 'Extração programática (node; parser HTML próprio escopado por section#id; quiz lido avaliando o literal `var Q=[…]` do <script> em vm e o placar conferido executando o script original em DOM simulado). Nenhum texto de conteúdo digitado. `html` = recorte literal com espaços colapsados; `texto` = sem tags, entidades decodificadas.',
  convencoes: { linha_aprox: 'linha 1-based no HTML-fonte, do início do elemento (no script: da chave do item)', null: 'ausência na fonte; cada null tem nota ao lado' },
  caso,
  avaliacao,
  checklist_final,
  exercicios,
  referencias,
  glossario,
  divergencias,
  contagens: {
    caso_blocos: caso.blocos.length, caso_perguntas_literais: caso.perguntas_literais.length,
    quiz_questoes: avaliacao.perguntas.length, quiz_alternativas: avaliacao.perguntas.reduce((a, q) => a + q.alternativas.length, 0), quiz_faixas: 2,
    checklist_itens: checklist_final.itens.length,
    checklist_cronometrados: checklist_final.itens.filter((i) => i.marcacao_p14.includes('cronometrado')).length,
    checklist_orais: checklist_final.itens.filter((i) => i.marcacao_p14.includes('oral')).length,
    exercicios: exercicios.itens.length, exercicios_com_aula: 0, exercicios_soltos: exercicios.itens.length,
    referencias: referencias.itens.length, referencias_com_url: 0,
    glossario_familias: glossario.familias.length, glossario_termos: glossario.termos.length,
    glossario_ausentes_no_codigo: glossario.contagem.ausentes_no_codigo,
  },
});
console.log('aparato.json ok');
