// src/lib/progress/badgeRules.ts
// LYCEUM — Alexandria Wave 39; família CONCLUSÃO ligada na v3 (eventos).
//
// Duas tabelas, dois destinos:
//
// (1) A FAMÍLIA CONCLUSÃO — LIGADA. É a única computável hoje: lê
//     `aula_concluida` (pela lista `aulasConcluidas` do servidor) e mostra
//     a data real de `badge_award.awarded_at`. O catálogo e a regra de cada
//     uma são lógica pura em `src/lib/alexandria/progresso/conquistas.ts`;
//     aqui só se monta o currículo real e se fala com a rede. Especificação:
//     `docs/alexandria-v2/estudos/movimento-e-conquistas/sistema-de-conquistas.md`
//     §2.1. Conquista é comportamento registrado — "concluiu as aulas
//     listadas" —, nunca prova de aprendizagem (bar S3).
//
// (2) OS 13 BADGES LEGADOS de `alexandria-badges.ts` — NENHUM LIGADO.
//     Doze ficam explicitamente EM DESENHO (`situacao: 'em-desenho'`), cada
//     um com o bloqueio e a razão. O décimo terceiro, Anatomista de
//     Faturas, é SUBSTITUÍDO: o critério dele era a conclusão de uma aula da
//     conta industrial, e o §3 da especificação o cobre por
//     `conclusao.modulo.modulo-10`. Ele não ganha regra própria — um nome
//     de persona para um fato que a família CONCLUSÃO já registra seria
//     duas medalhas para o mesmo evento.
//
// Os nomes legados ("Guardião", "Leitor de…", "Aferidor…") são de persona
// e alguns têm critério de competência; por isso nenhum deles é exposto
// como conquista obtível. A tela mostra a família em desenho como UMA
// linha (§5), sem lista de nomes indisponíveis.

import { ALEXANDRIA_BADGES } from '@/lib/data/alexandria-badges';
import { ALEXANDRIA_MODULES } from '@/lib/data/alexandria-trilhas';
import { idDaAula, indice } from '@/lib/alexandria/indice';
import {
  catalogoDeConclusao,
  conquistasARegistrar,
  TERRITORIOS,
  type AvaliacaoDeConquista,
  type ConquistaDeConclusao,
  type CurriculoParaConquistas,
  type Territorio,
} from '@/lib/alexandria/progresso/conquistas';
import { getMyProgress, recordEvent, type MyProgress } from './progressApi';

// ─────────────────────────────────────────────────────────────────────
// (1) CONCLUSÃO
// ─────────────────────────────────────────────────────────────────────

/**
 * O currículo das conquistas, montado do índice v3 (`indice.dados.ts`,
 * gerado da extração verificada).
 *
 * RECONCILIAÇÃO (P8), DERIVADA E NÃO DIGITADA: um módulo só conta como
 * reconciliado quando as DUAS contagens independentes do repositório
 * concordam — o número de aulas do índice v3 (extração) e o
 * `totalAulas` de `ALEXANDRIA_MODULES` (medido sobre o HTML de origem,
 * Waves 2–41). Divergência ou ausência = "indisponível", e a conquista do
 * módulo não é concedida nem negada.
 */
export const CURRICULO_DAS_CONQUISTAS: CurriculoParaConquistas = {
  modulos: indice.modulos.map((m) => {
    const trilha = indice.trilhas.find((t) => t.id === m.trilhaId);
    const romano = trilha?.romano;
    const territorio: Territorio | null =
      romano && (TERRITORIOS as readonly string[]).includes(romano) ? (romano as Territorio) : null;
    const legado = ALEXANDRIA_MODULES.find((x) => x.id === m.id);
    const n = m.aulas.length;
    return {
      id: m.id,
      codigo: m.codigo,
      territorio,
      aulaIds: n > 0 ? m.aulas.map((a) => idDaAula(m, a.numero)) : null,
      reconciliado: n > 0 && legado?.totalAulas === n,
    };
  }),
};

export const CONQUISTAS_DE_CONCLUSAO: ConquistaDeConclusao[] = catalogoDeConclusao(CURRICULO_DAS_CONQUISTAS);

export interface ConquistaRegistrada {
  id: string;
  nome: string;
  criterio: string;
  /** `occurredAt` do evento que a registrou — o dia do REGISTRO (§8). */
  registradaEm: string;
  retroativa: boolean;
}

/**
 * Depois de uma `aula_concluida` CONFIRMADA pelo servidor: lê o progresso
 * real, avalia a família CONCLUSÃO e registra `badge_conquistado` para o
 * que acabou de ser obtido. Devolve só as registradas AGORA pela primeira
 * vez (`badgeAlreadyAwarded === false`) — é o que o fim de aula pode
 * mostrar como "REGISTRO DE PERCURSO".
 *
 * Best-effort como todo evento de progresso: falha loga e devolve o que
 * deu; "a regra roda de novo no próximo evento confirmado" (§5).
 */
export async function registrarConquistasDeConclusao(aulaId: string): Promise<ConquistaRegistrada[]> {
  let progresso: MyProgress;
  try {
    progresso = await getMyProgress();
  } catch (err) {
    console.error('[alexandria] conquistas: progresso indisponível, avaliação adiada', err);
    return [];
  }

  const aRegistrar = conquistasARegistrar(
    CONQUISTAS_DE_CONCLUSAO,
    progresso.aulasConcluidas,
    aulaId,
    progresso.badges.map((b) => b.badgeId),
  );
  if (aRegistrar.length === 0) return [];

  const porId = new Map(CONQUISTAS_DE_CONCLUSAO.map((c) => [c.id, c]));
  const registradas: ConquistaRegistrada[] = [];
  await Promise.all(
    aRegistrar.map(async ({ id, retroativa }) => {
      try {
        const r = await recordEvent('badge_conquistado', id, {
          familia: 'conclusao',
          origem: 'aula_concluida',
          aulaId,
          retroativa,
        });
        const c = porId.get(id);
        if (r.badgeAlreadyAwarded === false && c) {
          registradas.push({ id, nome: c.nome, criterio: c.criterio, registradaEm: r.occurredAt, retroativa });
        }
      } catch (err) {
        console.error('[alexandria] falha ao registrar badge_conquistado', id, err);
      }
    }),
  );
  // Ordem do catálogo, não ordem de chegada da rede.
  const ordem = new Map(CONQUISTAS_DE_CONCLUSAO.map((c, i) => [c.id, i]));
  return registradas.sort((a, b) => (ordem.get(a.id) ?? 0) - (ordem.get(b.id) ?? 0));
}

export interface EstadoDeConquista {
  conquista: ConquistaDeConclusao;
  avaliacao: AvaliacaoDeConquista;
  /** `badge_award.awarded_at`, quando registrada. */
  registradaEm: string | null;
}

/** O caderno de marcos da família CONCLUSÃO para um progresso real: cada
 *  conquista com a avaliação de agora e a data de registro, quando houver.
 *  Mecânica para o chat visual consumir; nenhuma decisão de aparência. */
export function estadoDasConquistasDeConclusao(p: MyProgress): EstadoDeConquista[] {
  const concluidas = new Set(p.aulasConcluidas);
  const datas = new Map(p.badges.map((b) => [b.badgeId, b.awardedAt]));
  return CONQUISTAS_DE_CONCLUSAO.map((c) => ({
    conquista: c,
    avaliacao: c.avaliar(concluidas),
    registradaEm: datas.get(c.id) ?? null,
  }));
}

/** A linha única das famílias que não estão ligadas (§5, "Família em
 *  desenho"): sem discos, sem lista de nomes indisponíveis (S4). */
export const FRASE_FAMILIAS_EM_DESENHO = 'Registros de prática, exploração e hábito: em desenho.';

// ─────────────────────────────────────────────────────────────────────
// (2) LEGADOS
// ─────────────────────────────────────────────────────────────────────

/** Por que um critério legado ainda não pode ser verificado. Classificação,
 *  não desculpa: cada valor aponta para um trabalho diferente. */
export type BloqueioBadge =
  /** O critério é demonstração humana (explicar / desenhar / narrar /
   *  recitar / interpretar). Nenhum evento prova. Abrir isto é decisão
   *  de produto sobre o que conta como prova — não de engenharia. */
  | 'competencia-humana'
  /** O critério é mecanicamente verificável, mas o evento que o provaria
   *  não carrega o dado necessário (resultado corrigido, limiar). */
  | 'instrumentacao-ausente'
  /** A aula ou o módulo por trás do critério ainda não foi extraído. */
  | 'conteudo-ausente'
  /** A superfície que o critério nomeia ainda não existe no produto. */
  | 'feature-ausente';

export interface RegraBadge {
  badgeId: string;
  /** `em-desenho` = sem regra automática honesta hoje. `substituida` = o
   *  fato que o critério pedia já é registrado por outra conquista. */
  situacao: 'em-desenho' | 'substituida';
  /** Sempre `null` para os legados: nenhum tem regra hoje. Nunca preencher
   *  com aproximação — badge falso é pior que badge ausente. */
  avaliar: null;
  bloqueio: BloqueioBadge | null;
  /** Para `substituida`: o id da conquista que registra o mesmo fato. */
  substituidaPor?: string;
  /** O que exatamente falta, em uma frase verificável. */
  razao: string;
}

export const REGRAS_BADGE: RegraBadge[] = [
  // ── (A) Referência visual ────────────────────────────────────────────
  {
    badgeId: 'badge-anatomista-de-faturas',
    situacao: 'substituida',
    avaliar: null,
    bloqueio: null,
    substituidaPor: 'conclusao.modulo.modulo-10',
    razao:
      'O critério ("concluiu a aula da conta de luz industrial item por item") é conclusão de UMA aula, recorte arbitrário, com nome de persona. A especificação de conquistas (§3) o tira do catálogo: o fato que importa é registrado por `conclusao.modulo.modulo-10` (Tarifas e a Conta de Luz Industrial), e a aula específica ganha só o estado "percorrida".',
  },
  {
    badgeId: 'badge-cartografo-do-sin',
    situacao: 'em-desenho',
    avaliar: null,
    bloqueio: 'feature-ausente',
    razao:
      'Exige "os quatro submercados no Atlas interativo". O Atlas é mundial e está congelado por decisão do Founder; a camada Brasil com os quatro submercados não existe, nem um evento de exploração por região. Destino no catálogo novo: `exploracao.atlas-submercados`.',
  },
  {
    badgeId: 'badge-leitor-de-mercado',
    situacao: 'em-desenho',
    avaliar: null,
    bloqueio: 'instrumentacao-ausente',
    razao:
      '"Acertou 90% das questões" exige questão corrigida, e nada no produto corrige resposta: `exercicio_respondido` agora é emitido com a resposta, mas a checagem é autoavaliação em três níveis, sem gabarito computável. O ponto de corte também não tem fonte (P18). Destino: resultado de avaliação na camada de evidência, não conquista.',
  },
  {
    badgeId: 'badge-guardiao-fp',
    situacao: 'em-desenho',
    avaliar: null,
    bloqueio: 'instrumentacao-ausente',
    razao:
      '"Atinja 0,92 de FP médio" é desempenho apresentado como conquista. `instrumento_usado` agora sai com os valores do controle, mas a especificação converte o critério em exploração do limiar (`pratica.dois-lados-092`), família ainda em desenho.',
  },

  // ── (B) Checklist do Módulo 01 ───────────────────────────────────────
  {
    badgeId: 'badge-tradutor-kw-kwh',
    situacao: 'em-desenho',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao:
      '"Explicar kW vs kWh em 30 segundos, com exemplo numérico." Usar o `inst-01` produz um exemplo numérico, mas usar não é explicar — conceder pelo uso seria proxy.',
  },
  {
    badgeId: 'badge-fator-de-carga',
    situacao: 'em-desenho',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao:
      'Critério composto: "Calcular fator de carga E interpretar o que ele significa operacionalmente." A primeira metade é observável (o `inst-04` calcula FC); a segunda é compreensão, que nenhum evento alcança. Conceder pela metade mensurável é conceder por proxy do todo.',
  },
  {
    badgeId: 'badge-lei-de-ohm',
    situacao: 'em-desenho',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao:
      '"Explicar a Lei de Ohm e por que perdas crescem com I²." O `inst-02` resolve Ohm e o `inst-03` calcula perdas resistivas, mas o critério pede a explicação do porquê — não o resultado.',
  },

  // ── (B) Checklist do Módulo 02 ───────────────────────────────────────
  {
    badgeId: 'badge-cadeia-da-rede',
    situacao: 'em-desenho',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao: '"Desenhar num guardanapo" a cadeia com tensões e dono de cada trecho. Desenho fora da tela.',
  },
  {
    badgeId: 'badge-fronteira-do-ons',
    situacao: 'em-desenho',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao:
      '"Listar três coisas que o ONS faz e três que ele não faz, nomeando quem faz." Produção de lista pelo aluno, sem correção possível hoje.',
  },
  {
    badgeId: 'badge-dez-segundos',
    situacao: 'em-desenho',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao: '"Narrar os dez segundos pós-perda de usina." Narração falada, em sequência, sem superfície no produto.',
  },

  // ── (B) Checklist do Módulo 03 ───────────────────────────────────────
  {
    badgeId: 'badge-matriz-em-duas-lentes',
    situacao: 'em-desenho',
    avaliar: null,
    bloqueio: 'instrumentacao-ausente',
    razao:
      'O Reconstrutor de matriz do Módulo 08 (`m08-inst-04-cap` / `m08-inst-04-ger`) corrige as seis fatias contra referência, e cada correção agora sai como `instrumento_usado` com `modo: correcao`. Falta o veredito no evento (`ordemOk` não sai em `valores`) e a revisão da tolerância (P6, P18). Destino: `pratica.matriz-duas-lentes`, família em desenho.',
  },
  {
    badgeId: 'badge-fator-de-capacidade',
    situacao: 'em-desenho',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao:
      '"Definir fator de capacidade pela fórmula e citar as faixas típicas." Quem cita as faixas é o instrumento, não o aluno — e as faixas estão em verificação (P20).',
  },
  {
    badgeId: 'badge-vacina-do-lcoe',
    situacao: 'em-desenho',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao:
      'Composto: "Calcular um LCOE didático no guardanapo E recitar os quatro limites como vacina." A recitação não tem prova possível.',
  },
];

/** Trava de DEV: cobertura 1:1 entre catálogo legado e regras, e ids únicos
 *  na família CONCLUSÃO. "Sem regra" é indistinguível de "regra que nunca
 *  dispara" — por isso a tabela tem de cobrir o catálogo inteiro. */
if (import.meta.env.DEV) {
  const doCatalogo = new Set(ALEXANDRIA_BADGES.map((b) => b.id));
  const dasRegras = new Set(REGRAS_BADGE.map((r) => r.badgeId));
  const semRegra = [...doCatalogo].filter((id) => !dasRegras.has(id));
  const orfas = [...dasRegras].filter((id) => !doCatalogo.has(id));
  if (semRegra.length || orfas.length || dasRegras.size !== REGRAS_BADGE.length) {
    console.warn('[alexandria] regras de badge fora de sincronia com o catálogo.', { semRegra, orfas });
  }
  const ids = CONQUISTAS_DE_CONCLUSAO.map((c) => c.id);
  if (new Set(ids).size !== ids.length) console.warn('[alexandria] id repetido na família CONCLUSÃO.');
}

/** Os legados EM DESENHO (12), com o bloqueio de cada um. O substituído
 *  não entra: ele não está pendente, está coberto. */
export const BADGES_SEM_REGRA = REGRAS_BADGE.filter((r) => r.situacao === 'em-desenho');

/** Quantos legados em desenho por classe de bloqueio. Derivado — a soma
 *  nunca diverge da tabela. */
export function contarBloqueios(): Record<BloqueioBadge, number> {
  const conta: Record<BloqueioBadge, number> = {
    'competencia-humana': 0,
    'instrumentacao-ausente': 0,
    'conteudo-ausente': 0,
    'feature-ausente': 0,
  };
  for (const r of BADGES_SEM_REGRA) if (r.bloqueio) conta[r.bloqueio] += 1;
  return conta;
}
