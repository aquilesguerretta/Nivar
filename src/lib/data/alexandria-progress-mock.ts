import type { UserBadgeProgress, UserProgress } from '@/lib/types/alexandria';
import { ALEXANDRIA_BADGES } from './alexandria-badges';
import { getTrilhaByLevel } from './alexandria-trilhas';

// Dado de demonstração para os cinco slots do RailRight. Não representa
// usuário real nem estado de produção.
//
// Regra da wave: o progresso só afirma o que tem lastro. Tudo que depende de
// conteúdo inexistente fica zerado ou bloqueado, nunca preenchido para a tela
// ficar bonita.

/** 29 — soma real dos Módulos 01-03, lida do catálogo da Wave 2 em vez de
 *  digitada, para não divergir. Os Módulos 04-05 do Nível 1 têm
 *  `totalAulas: null`, então este é piso confirmado, não total do nível. */
const AULAS_CONFIRMADAS_N1 = getTrilhaByLevel(1)?.totalAulas ?? 0;

/** 12 = Módulo 01 inteiro (9 aulas) + 3 das 10 do Módulo 02. Escolha de
 *  demonstração, mas coerente: cai numa fronteira real de módulo em vez de
 *  ser número solto. */
const AULAS_COMPLETADAS = 12;

/** Conquista exige a ação de domínio (resolver o drill do checklist), não só
 *  ter lido a aula. Por isso o Módulo 01 aparece concluído e mesmo assim só
 *  2 dos seus 3 badges estão conquistados — `badge-lei-de-ohm` está
 *  disponível e ainda não reivindicado.
 *
 *  Nenhum badge de procedência (A) é marcado conquistado: os quatro da
 *  referência visual dependem de conteúdo que não existe — conta de luz
 *  industrial é Bloco 10, PLD/MRE/GSF é Bloco 09, o Atlas de submercados não
 *  foi construído. `badge-guardiao-fp` tem o conteúdo (Módulo 01, Aula 07 +
 *  o instrumento LAB · 01), mas a própria tela de referência o mostra
 *  bloqueado, então fica bloqueado.
 *
 *  Datas são fixas de propósito — mock não deve depender de "hoje". */
export const MOCK_BADGE_PROGRESS: UserBadgeProgress[] = [
  // Conquistados — ambos com conteúdo real por trás (Módulo 01, com HTML).
  { badgeId: 'badge-tradutor-kw-kwh', status: 'conquistado', earnedAt: '2026-07-23' },
  { badgeId: 'badge-fator-de-carga', status: 'conquistado', earnedAt: '2026-07-25' },

  // Disponível, não reivindicado — Módulo 01 concluído.
  { badgeId: 'badge-lei-de-ohm', status: 'bloqueado', earnedAt: null },

  // Módulo 02 em curso (3 de 10 aulas), Módulo 03 não iniciado.
  { badgeId: 'badge-cadeia-da-rede', status: 'bloqueado', earnedAt: null },
  { badgeId: 'badge-fronteira-do-ons', status: 'bloqueado', earnedAt: null },
  { badgeId: 'badge-dez-segundos', status: 'bloqueado', earnedAt: null },
  { badgeId: 'badge-matriz-em-duas-lentes', status: 'bloqueado', earnedAt: null },
  { badgeId: 'badge-fator-de-capacidade', status: 'bloqueado', earnedAt: null },
  { badgeId: 'badge-vacina-do-lcoe', status: 'bloqueado', earnedAt: null },

  // Referência visual — conteúdo por trás não existe.
  { badgeId: 'badge-anatomista-de-faturas', status: 'bloqueado', earnedAt: null },
  { badgeId: 'badge-cartografo-do-sin', status: 'bloqueado', earnedAt: null },
  { badgeId: 'badge-leitor-de-mercado', status: 'bloqueado', earnedAt: null },
  { badgeId: 'badge-guardiao-fp', status: 'bloqueado', earnedAt: null },
];

const BADGES_CONQUISTADOS = MOCK_BADGE_PROGRESS.filter(
  (b) => b.status === 'conquistado',
).length;

/** Dado de demonstração. Escopo apenas ao que é real hoje —
 *  Trilha 1, módulos 1-3, 29 aulas confirmadas. Não representa
 *  usuário real nem estado de produção. */
export const MOCK_USER_PROGRESS: UserProgress = {
  aulasCompleted: AULAS_COMPLETADAS,
  aulasTotal: AULAS_CONFIRMADAS_N1,
  /** 480 é valor de demonstração — nenhuma fonte declara EXP por aula.
   *  Decomposto: 50 vêm dos dois badges conquistados (25 + 25, valores reais
   *  do catálogo); os 430 restantes são atribuídos às 12 aulas. Se a
   *  economia de EXP por aula for definida algum dia, este número passa a
   *  ser derivado. */
  exp: 480,
  badgesEarned: BADGES_CONQUISTADOS,
  badgesTotal: ALEXANDRIA_BADGES.length,
  /** Percentual 0-100. O Nível 1 é medido contra as 29 aulas CONFIRMADAS,
   *  não contra o Nível 1 inteiro — os Módulos 04-05 não têm contagem, então
   *  o denominador do nível completo é desconhecido. Este número sobe-estima
   *  o progresso real do nível, e é o mais honesto que dá para calcular.
   *  Níveis 2 e 3 ficam em 0 porque nenhum dos seus 12 módulos tem conteúdo —
   *  é 'nada disponível', não 'aluno não estudou'. */
  byLevel: {
    1: Math.round((AULAS_COMPLETADAS / AULAS_CONFIRMADAS_N1) * 100), // 41
    2: 0,
    3: 0,
  },
  /** Todos zerados, incluindo os totais. Submercado é discutido nos três
   *  módulos (~40 menções na prosa), mas `CurriculumAula` ainda não tem
   *  nenhum registro — a Wave 2 shipou estrutura e contagem, não conteúdo.
   *  Sem inventário de aula, não existe aula para contar por submercado, e
   *  qualquer total aqui seria número inventado. O widget de cobertura
   *  regional da referência renderiza vazio até as aulas existirem com o
   *  campo `submercados` preenchido. */
  bySubmercado: {
    norte: { completed: 0, total: 0 },
    nordeste: { completed: 0, total: 0 },
    'sudeste-centro-oeste': { completed: 0, total: 0 },
    sul: { completed: 0, total: 0 },
  },
  studyStreakDays: 4,
};
