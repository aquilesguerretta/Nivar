// gerar-avaliacao-m10.mjs — escreve src/lib/alexandria/avaliacao/m10.dados.ts.
//
// Fonte única: docs/alexandria-v2/extraction/m10/aparato.json (exercícios do §Ex, quiz
// do §Quiz, checklist do §Final) e o texto das aulas como está em
// src/lib/data/alexandria-modulo-10-content.ts (conferido contra o HTML original por
// tools/alexandria-dados/porte/verificar-porte-m10.mjs). Cada trecho citado é procurado
// por substring antes de escrever; se não existir, o gerador PARA.
//
// D04: os exercícios do M10 nunca apareciam na tela; no modelo v3 eles entram por aqui.
//
// VÍNCULO EXERCÍCIO → AULA (regra de colocação de 15/11, PORTE-POR-MODULO.md). Os 14 são
// soltos na fonte. Cada um tem um termo, que precisa estar literalmente no próprio
// exercício; ele vai para a ÚLTIMA aula cujo texto contém o termo; sem casamento, fica em
// EXERCICIOS_DO_MODULO. O vínculo é registrado como "vínculo mecânico" em `alertas`.
//
// DERIVADOS. Seis perguntas de recuperação em voz da Alexandria (decisões 7 e 8), nas
// aulas que ficam sem exercício da fonte (01, 06, 07). A resposta está literalmente no
// texto da aula; em `escolha`, toda alternativa aparece literalmente numa aula do M10.
// Nenhum derivado repete pergunta da prova nem cenário de instrumento.
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m10.mjs

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { RAIZ } from '../porte/porte-m09-m11-comum.mjs';

export const MODULO = 'modulo-10';
const APARATO = 'docs/alexandria-v2/extraction/m10/aparato.json';
const CONTEUDO = 'src/lib/data/alexandria-modulo-10-content.ts';
const SAIDA = path.join(RAIZ, 'src/lib/alexandria/avaliacao/m10.dados.ts');
export const N_AULAS = 9;

const ap = JSON.parse(fs.readFileSync(path.join(RAIZ, APARATO), 'utf8'));
const { MODULO_10_CORPO } = await import(pathToFileURL(path.join(RAIZ, CONTEUDO)).href);

export const editorial = (s) => String(s).replace(/GridAlpha/g, 'NIVAR');
export const texto = (s) => String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/** Texto plano de um bloco da aula (o que o aluno lê). */
export function textoDoBloco(b) {
  if (!b) return '';
  if (b.kind === 'tabela') return texto(b.linhas.map((l) => l.join(' — ')).join(' · '));
  if (b.kind === 'lista') return texto(b.itens.join(' · '));
  if (b.kind === 'titulo') return texto(`${b.numero ?? ''} ${b.texto}`);
  if (b.kind === 'formula') return texto(`${b.eq} ${b.desc ?? ''}`);
  return texto(`${b.label ? b.label + ' ' : ''}${b.html ?? ''}`);
}
const idAula = (n) => `aula-10-0${n}`;
export const blocoDaAula = (n, i) => MODULO_10_CORPO[idAula(n)]?.[i];

function evidencia(n, bloco, trecho) {
  const t = textoDoBloco(blocoDaAula(n, bloco));
  if (!t.includes(trecho)) throw new Error(`A${n} bloco ${bloco}: trecho ausente «${trecho.slice(0, 80)}»`);
  return { arquivo: CONTEUDO, campo: `MODULO_10_CORPO['${idAula(n)}'][${bloco}]`, linha: null, trecho };
}

// ── termos do vínculo mecânico ──────────────────────────────────────────────
export const TERMOS = {
  'm10-ex-01': 'demanda única',
  'm10-ex-02': 'posto de ponta',
  'm10-ex-03': 'tolerância',
  'm10-ex-04': 'franquia',
  'm10-ex-05': 'participação de ponta',
  'm10-ex-06': 'memória de massa',
  'm10-ex-07': 'sobrecompensação',
  'm10-ex-08': 'efeito preço',
  'm10-ex-09': 'modalidades',
  'm10-ex-10': 'custo entregue',
  'm10-ex-11': 'casas decimais',
  'm10-ex-12': 'refaturamento',
  'm10-ex-13': 'aniversário tarifário',
  'm10-ex-14': 'demanda de injeção',
};

export function casamentos(termo) {
  const t = termo.toLowerCase();
  const out = [];
  for (let n = 1; n <= N_AULAS; n++) {
    const bs = MODULO_10_CORPO[idAula(n)] ?? [];
    const i = bs.findIndex((b) => textoDoBloco(b).toLowerCase().includes(t));
    if (i >= 0) out.push({ aula: n, bloco: i });
  }
  return out;
}

// ── os seis derivados ───────────────────────────────────────────────────────
export const DERIVADOS = [
  { id: 'm10-a01-d01', aula: 1, tipo: 'escolha', bloco: 5,
    enunciado: 'Segundo a aula, qual é o único componente da fatura que a empresa negocia — e apenas se estiver no ambiente livre?',
    alternativas: ['a demanda contratada', 'o preço da energia', 'o fator de potência'], certa: 1,
    trecho: 'Um único componente: o preço da energia. E apenas se a unidade estiver no ambiente livre de contratação.' },
  { id: 'm10-a01-d02', aula: 1, tipo: 'aberto', bloco: 16,
    enunciado: 'A aula fala de quatro relógios que movem a conta sem que nada mude dentro da planta. Quais são eles?',
    trecho: 'O primeiro é o ciclo anual de reajuste tarifário da concessionária, com data própria — o aniversário tarifário. Duas plantas do mesmo grupo empresarial, em estados diferentes, atravessam reajustes em meses diferentes; comparar as duas sem declarar isso é comparar bases distintas. O segundo é o ciclo de revisão tarifária periódica, mais espaçado, que pode alterar não só valores mas a própria estrutura — inclusive a definição do posto de ponta da área de concessão. O terceiro é o acionamento mensal de bandeira, que muda o custo marginal do quilowatt-hora consumido sem qualquer alteração de tarifa homologada. O quarto é o calendário legal de mudança de regra: leis com vigência diferida, regulamentação pendente e prazos previstos que alteram encargos, tributos e elegibilidade.' },
  { id: 'm10-a06-d01', aula: 6, tipo: 'aberto', bloco: 1,
    enunciado: 'Uma fatura não mostra nenhuma linha explícita de encargos. Segundo a aula, isso quer dizer que o custo é zero?',
    trecho: 'A ausência de uma linha explícita não significa custo zero: significa que o item está alocado dentro do valor unitário da tarifa aplicada.' },
  { id: 'm10-a06-d02', aula: 6, tipo: 'aberto', bloco: 16,
    enunciado: 'Quais são as quatro perguntas que, segundo a aula, todo valor de encargo citado em proposta comercial precisa passar?',
    trecho: 'Todo valor de encargo citado em proposta comercial precisa passar por quatro perguntas. Qual é a unidade? — reais por megawatt-hora, reais por quilowatt, ou percentual de alguma base. Qual é a data-base? — quotas são fixadas por ciclo e envelhecem em doze meses. Qual é o recorte? — o valor é da concessionária específica, da região, ou média nacional. Está embutido ou explícito? — somar um encargo explícito a uma tarifa que já o contém é dupla contagem' },
  { id: 'm10-a07-d01', aula: 7, tipo: 'escolha', bloco: 4,
    enunciado: 'Pelo entendimento consolidado que a aula descreve, sobre qual demanda incide o imposto estadual?',
    alternativas: ['demanda contratada mas não utilizada', 'demanda de potência efetivamente utilizada', 'demanda de injeção'], certa: 1,
    trecho: 'O imposto estadual incide sobre o valor da tarifa correspondente à demanda de potência efetivamente utilizada' },
  { id: 'm10-a07-d02', aula: 7, tipo: 'aberto', bloco: 13,
    enunciado: 'Segundo a aula, o que muda nos tributos sobre o consumo em 2026, e por que o desembolso total não se altera nesta fase?',
    trecho: 'Desde 1º de janeiro de 2026 vigora uma alíquota de calibração de 0,9% para a contribuição federal nova e 0,1% para o imposto compartilhado novo, com previsão de compensação contra os débitos das contribuições federais vigentes, de modo que o desembolso total não se altera nesta fase.' },
];

function gerar() {
  const exs = ap.exercicios.itens;
  const EXERCICIOS_DAS_AULAS = [];
  const EXERCICIOS_DO_MODULO = [];
  for (const e of exs) {
    const termo = TERMOS[e.id];
    if (!termo) throw new Error(`exercício sem termo: ${e.id}`);
    const doEx = texto(`${e.enunciado.texto} ${e.resposta_referencia.html}`).toLowerCase();
    if (!doEx.includes(termo.toLowerCase())) throw new Error(`${e.id}: o termo «${termo}» não está no próprio exercício`);
    const casa = casamentos(termo);
    const ultima = casa.at(-1) ?? null;
    const aula = ultima ? ultima.aula : null;
    let evAula = null;
    if (ultima) {
      const t = textoDoBloco(blocoDaAula(ultima.aula, ultima.bloco));
      const k = t.toLowerCase().indexOf(termo.toLowerCase());
      evAula = evidencia(ultima.aula, ultima.bloco, t.slice(k, k + termo.length));
    }
    const k = exs.indexOf(e);
    (aula ? EXERCICIOS_DAS_AULAS : EXERCICIOS_DO_MODULO).push({
      id: e.id,
      moduloId: MODULO,
      aula,
      origem: 'fonte',
      tipo: 'aberto',
      enunciado: editorial(e.enunciado.sem_prefixo),
      gabarito: null,
      referencia: editorial(e.resposta_referencia.html),
      contaParaCriterioDoDrill: false,
      tolerancia: null,
      verificacao: 'autoavaliacao',
      fonte: { arquivo: APARATO, campo: `exercicios.itens[${k}].enunciado`, linha: e.origem.linha_aprox ?? null },
      evidencias: [
        { arquivo: APARATO, campo: `exercicios.itens[${k}].enunciado.sem_prefixo`, linha: e.origem.linha_aprox ?? null, trecho: editorial(e.enunciado.sem_prefixo) },
        ...(evAula ? [evAula] : []),
      ],
      alertas: [
        aula
          ? `Vínculo mecânico: a fonte não liga o Ex ${e.tag} a nenhuma aula (§Ex). O termo «${termo}», que está no exercício, aparece literalmente ${casa.length === 1 ? 'só na Aula ' + String(casa[0].aula).padStart(2, '0') + ', e o exercício vai para ela' : 'nas Aulas ' + casa.map((c) => String(c.aula).padStart(2, '0')).join(', ') + ', e o exercício vai para a última'} (regra de colocação de 15/11).`
          : `A fonte não liga o Ex ${e.tag} a nenhuma aula (§Ex), e o termo «${termo}» não aparece em nenhuma aula: fica nos exercícios do módulo (regra de colocação de 15/11).`,
      ],
    });
  }
  for (const d of DERIVADOS) {
    const ev = evidencia(d.aula, d.bloco, d.trecho);
    EXERCICIOS_DAS_AULAS.push({
      id: d.id,
      moduloId: MODULO,
      aula: d.aula,
      origem: 'derivado-da-aula',
      tipo: d.tipo,
      enunciado: d.enunciado,
      ...(d.tipo === 'escolha' ? { alternativas: d.alternativas, gabarito: d.certa } : { gabarito: null }),
      referencia: d.trecho,
      contaParaCriterioDoDrill: false,
      tolerancia: null,
      verificacao: d.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao',
      fonte: { arquivo: CONTEUDO, campo: ev.campo, linha: null },
      evidencias: [ev],
    });
  }
  EXERCICIOS_DAS_AULAS.sort((a, b) => a.aula - b.aula || (a.origem === b.origem ? 0 : a.origem === 'fonte' ? -1 : 1));

  // ── prova ── critério: a frase da lede (Q01: nunca apresentado como "aprovação")
  const av = ap.avaliacao;
  const crit = 'O critério é oito acertos: abaixo disso, a matéria não está no ponto de sustentar uma leitura cronometrada diante de um cliente.';
  if (!av.lede.texto.includes(crit)) throw new Error('critério literal mudou');
  if (!/8 de 10/.test(av.titulo.texto)) throw new Error('"8 de 10" não está no título do §Quiz');
  const PROVAS = [{
    moduloId: MODULO,
    criterio: crit,
    acertosMinimos: 8,
    total: 10,
    questoes: av.questoes.map((q, k) => ({
      id: q.id,
      enunciado: editorial(q.enunciado),
      alternativas: q.alternativas.map((a) => editorial(a.texto)),
      correta: q.gabarito.indice,
      explicacao: editorial(q.explicacao),
      fonte: { arquivo: APARATO, campo: `avaliacao.questoes[${k}]`, linha: q.origem.linha_aprox ?? null },
    })),
    faixas: [
      { min: 8, max: 10, mensagem: av.faixas_do_placar[0].mensagem },
      { min: 0, max: 7, mensagem: av.faixas_do_placar[1].mensagem },
    ],
    faixasFonte: { arquivo: APARATO, campo: 'avaliacao.faixas_do_placar', linha: av.faixas_do_placar[0].origem.linha_aprox ?? null },
    criterioFonte: { arquivo: APARATO, campo: 'avaliacao.lede', linha: av.lede.origem.linha_aprox ?? null },
  }];

  const ck = ap.checklist_final;
  const CHECKLISTS = [{
    moduloId: MODULO,
    introducao: editorial(ck.lede.html),
    itens: ck.itens.map((i, k) => ({ id: i.id, texto: editorial(i.html), fonte: { arquivo: APARATO, campo: `checklist_final.itens[${k}]`, linha: i.origem?.linha_aprox ?? null } })),
  }];

  return { EXERCICIOS_DAS_AULAS, EXERCICIOS_DO_MODULO, PROVAS, CHECKLISTS };
}

export const DADOS = gerar();

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { EXERCICIOS_DAS_AULAS, EXERCICIOS_DO_MODULO, PROVAS, CHECKLISTS } = DADOS;
  const ts = `// Avaliação do M10 (exercícios por aula, prova, checklist). Posse: a sessão de porte do M10.
// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m10.mjs — não editar à mão.
// Conferido por tools/alexandria-dados/avaliacao/verificar-avaliacao-m10.mjs.
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = ${JSON.stringify(EXERCICIOS_DAS_AULAS, null, 2)};

/** Exercícios da fonte cujo termo não casa com nenhuma aula (regra de colocação de 15/11). */
export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = ${JSON.stringify(EXERCICIOS_DO_MODULO, null, 2)};

export const PROVAS: ProvaDoModulo[] = ${JSON.stringify(PROVAS, null, 2)};

export const CHECKLISTS: ChecklistDoModulo[] = ${JSON.stringify(CHECKLISTS, null, 2)};
`;
  fs.writeFileSync(SAIDA, ts);
  const porAula = {};
  for (const e of EXERCICIOS_DAS_AULAS) porAula[e.aula] = (porAula[e.aula] ?? []).concat(e.origem === 'fonte' ? 'F' : 'D');
  console.log(`escrito ${path.relative(RAIZ, SAIDA)}: ${EXERCICIOS_DAS_AULAS.length} itens por aula ${JSON.stringify(porAula)} · do módulo ${EXERCICIOS_DO_MODULO.map((e) => e.id).join(', ') || 'nenhum'} · prova ${PROVAS[0].questoes.length} · checklist ${CHECKLISTS[0].itens.length}`);
}
