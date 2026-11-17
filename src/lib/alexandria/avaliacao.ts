// Exercícios por aula e prova do módulo — Alexandria v3.
//
// Os dados vêm de `avaliacao.dados.ts`, GERADO a partir da extração verificada
// (tools/alexandria-dados/gerar-avaliacao.mjs; conferido por verificar-avaliacao.mjs).
// Este arquivo só declara os tipos e oferece leituras. Nada aqui calcula nota de
// competência: a prova devolve acertos contra o critério da fonte, e o rótulo que o
// produto mostra nunca diz "Demonstrado" (bar.md S3, C7, C10).
//
// Ausência se declara:
//   - `tolerancia` é sempre `null`: a fonte não declara tolerância em nenhuma resposta.
//     Sem tolerância não há veredito certo/errado em resposta aberta ou numérica — o
//     fechamento é autoavaliação em três níveis (`NIVEIS_DE_AUTOAVALIACAO`).
//   - A fonte não liga questão da prova a aula, nem traz critério por exercício.

import * as M01 from './avaliacao.dados';
import * as M02_M17 from './avaliacao/index';

// M01 (gerado em avaliacao.dados.ts) + M02–M17 (um arquivo por módulo em avaliacao/).
const EXERCICIOS_DAS_AULAS = [...M01.EXERCICIOS_DAS_AULAS, ...M02_M17.EXERCICIOS_DAS_AULAS];
const EXERCICIOS_DO_MODULO = [...M01.EXERCICIOS_DO_MODULO, ...M02_M17.EXERCICIOS_DO_MODULO];
const PROVAS = [...M01.PROVAS, ...M02_M17.PROVAS];
const CHECKLISTS = [...M01.CHECKLISTS, ...M02_M17.CHECKLISTS];

/** Onde, na extração verificada, o texto do item está. `linha` é a do HTML-fonte. */
export interface FonteDoItem {
  arquivo: string;
  campo: string;
  linha: number | null;
}

/** Um trecho citado: a fonte mais o texto literal (já com a troca editorial P24). */
export interface EvidenciaDoItem extends FonteDoItem {
  trecho: string;
}

export interface ExercicioDaAula {
  /** `m01-ex-04` (fonte) ou `m01-a03-d02` (derivado). */
  id: string;
  moduloId: string;
  aula: number;
  /**
   * `fonte`: Ex·NN do § Drill, literal. `derivado-da-aula`: pergunta de recuperação cuja
   * resposta está no texto da própria aula; precisa da aprovação do Founder antes do deploy.
   */
  origem: 'fonte' | 'derivado-da-aula';
  /** Os itens atuais são `escolha` ou `aberto`; `numerico` e `ordenar` existem no contrato, sem uso no M01. */
  tipo: 'escolha' | 'numerico' | 'aberto' | 'ordenar';
  enunciado: string;
  /** Só em `escolha`. */
  alternativas?: string[];
  /** `escolha`: índice da alternativa correta. Aberto/numérico: `null` (a resposta é a `referencia`, fechada por autoavaliação). */
  gabarito?: number | string | null;
  /** Texto literal de referência (resposta-modelo da fonte, ou o trecho da aula que responde). Só depois da tentativa. */
  referencia?: string;
  /** Critério literal da fonte. No M01 só existe o do § Drill (módulo inteiro), ver `contaParaCriterioDoDrill`. */
  criterio?: string;
  /** `true` nos 8 Ex·NN da fonte — os únicos a que "seis dos oito" se refere. Derivados nunca contam. */
  contaParaCriterioDoDrill: boolean;
  /** Sempre `null`: nenhuma tolerância é declarada pela fonte e nenhuma é criada. */
  tolerancia: null;
  /** `alternativa-correta`: só `escolha`. `autoavaliacao`: três níveis, sem veredito. */
  verificacao: 'alternativa-correta' | 'autoavaliacao';
  fonte: FonteDoItem;
  /** Trechos literais que sustentam o item (enunciado e referência na fonte; frases da aula nos derivados). */
  evidencias: EvidenciaDoItem[];
  /** Fatos medidos que quem renderiza precisa respeitar (p. ex. cenário igual ao do instrumento). */
  alertas?: string[];
}

/** Exercício que a fonte não liga a nenhuma aula (Ex·08, Síntese). */
export type ExercicioDoModulo = Omit<ExercicioDaAula, 'aula'> & { aula: null };

export interface QuestaoDaProva {
  id: string;
  enunciado: string;
  alternativas: string[];
  /** Índice em `alternativas`. */
  correta: number;
  /** Feedback literal da fonte (a fonte mostra o mesmo texto no acerto e no erro). */
  explicacao?: string;
  alertas?: string[];
  fonte: FonteDoItem;
}

export interface FaixaDoPlacar {
  min: number;
  max: number;
  /** Literal da fonte. As de "Domínio" usam a palavra sem Demonstrado (S3): quem renderiza decide a redação. */
  mensagem: string;
}

export interface ProvaDoModulo {
  moduloId: string;
  /** Literal: "O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar." */
  criterio: string;
  /** Lidos do `N de M` do critério literal. */
  acertosMinimos: number;
  total: number;
  questoes: QuestaoDaProva[];
  faixas: FaixaDoPlacar[];
  faixasFonte: FonteDoItem;
  criterioFonte: FonteDoItem;
}

export interface ChecklistDoModulo {
  moduloId: string;
  introducao: string;
  /** Afirmações de capacidade ("Explicar kW vs kWh…"), não perguntas. Autodeclaração; nunca Demonstrado. */
  itens: { id: string; texto: string; fonte: FonteDoItem }[];
}

/** Escala de autoavaliação do C7 (bar.md), usada onde não há tolerância declarada. */
export const NIVEIS_DE_AUTOAVALIACAO = ['atende', 'atende em parte', 'não atende'] as const;
export type NivelDeAutoavaliacao = (typeof NIVEIS_DE_AUTOAVALIACAO)[number];

/** Exercícios da aula, na ordem de leitura (fonte antes de derivado). `[]` se o módulo ou a aula não existe. */
export function exerciciosDaAula(moduloId: string, aula: number): ExercicioDaAula[] {
  return EXERCICIOS_DAS_AULAS.filter((e) => e.moduloId === moduloId && e.aula === aula);
}

/** Exercícios que a fonte não prende a uma aula (Ex·08, Síntese). */
export function exerciciosDoModulo(moduloId: string): ExercicioDoModulo[] {
  return EXERCICIOS_DO_MODULO.filter((e) => e.moduloId === moduloId);
}

/** A prova do módulo, ou `null` onde a fonte não tem (só o M01 tem hoje). */
export function provaDoModulo(moduloId: string): ProvaDoModulo | null {
  return PROVAS.find((p) => p.moduloId === moduloId) ?? null;
}

export function checklistDoModulo(moduloId: string): ChecklistDoModulo | null {
  return CHECKLISTS.find((c) => c.moduloId === moduloId) ?? null;
}

/** Faixa de placar da fonte para `acertos`, ou `null` fora de 0..total. */
export function faixaDoPlacar(prova: ProvaDoModulo, acertos: number): FaixaDoPlacar | null {
  return prova.faixas.find((f) => acertos >= f.min && acertos <= f.max) ?? null;
}

export interface ResultadoDaProva {
  acertos: number;
  total: number;
  /** Atingiu o critério da fonte (acertos ≥ acertosMinimos). Não é competência. */
  aprovada: boolean;
  /** Rótulo de produto (bar.md S3): "Avaliação do módulo: aprovada · 8/10 · critério da fonte". */
  rotulo: string;
  /** Mensagem literal da faixa da fonte. */
  faixa: FaixaDoPlacar | null;
}

/**
 * Resultado da avaliação do módulo. O rótulo "aprovada" é o do contrato (S3); o de não
 * aprovada ("ainda não aprovada") é texto novo do produto, sem fonte — o Founder assina.
 * Nunca "Demonstrado".
 */
export function resultadoDaProva(prova: ProvaDoModulo, acertos: number): ResultadoDaProva {
  const aprovada = acertos >= prova.acertosMinimos;
  return {
    acertos,
    total: prova.total,
    aprovada,
    rotulo: `Avaliação do módulo: ${aprovada ? 'aprovada' : 'ainda não aprovada'} · ${acertos}/${prova.total} · critério da fonte`,
    faixa: faixaDoPlacar(prova, acertos),
  };
}
