// src/lib/progress/badgeRules.ts
// LYCEUM — Alexandria Wave 39.
//
// A regra de concessão dos 13 badges de `alexandria-badges.ts`, e o
// registro — executável, não em prosa — de por que cada um ainda não
// pode ser concedido.
//
// ─────────────────────────────────────────────────────────────────────
// O VEREDITO DESTA WAVE: nenhum dos 13 tem regra automática hoje.
// ─────────────────────────────────────────────────────────────────────
//
// Não é conclusão preguiçosa: é o que a auditoria mediu. A superfície de
// observação disponível ao produto inteiro hoje é EXATAMENTE dois sinais
// — `aula_iniciada` e `aula_concluida` —, porque `AulaViewer` é o único
// arquivo em todo o `src/` que chama `recordEvent`. Os outros três tipos
// de evento que o backend aceita (`instrumento_usado`,
// `exercicio_respondido`, `badge_conquistado`) nunca foram emitidos por
// ninguém.
//
// Contra essa superfície, os 13 critérios caem em quatro classes de
// bloqueio, nenhuma resolvível sem sair da posse desta wave:
//
//   competencia-humana      8 · o critério é demonstração no mundo real
//                               ("explicar em 30 segundos", "desenhar num
//                               guardanapo", "narrar", "recitar"). Nenhum
//                               evento prova isso. Uma autodeclaração
//                               provaria a AFIRMAÇÃO do aluno, não o
//                               critério — seria proxy, e proxy está
//                               proibido nesta wave.
//   instrumentacao-ausente  3 · o critério É mecanicamente verificável e
//                               o número já é calculado hoje — mas vive
//                               no estado interno de `InstrumentPanel`,
//                               que tem prop única (`{ instrumento }`),
//                               nenhum callback, e é NUNCA MODIFICAR
//                               aqui. É o bloqueio mais barato de abrir.
//   conteudo-ausente        1 · o conteúdo por trás não foi extraído.
//   feature-ausente         1 · a superfície exigida não existe.
//
// O que este arquivo entrega, então, não é concessão — é (a) a auditoria
// em forma consultável e travada por tipo, para a próxima wave ler código
// em vez de CLAUDE.md, e (b) o caminho de emissão pronto e ligado, para
// que abrir um bloqueio seja uma linha de regra e não uma wave de
// encanamento. Enquanto nenhuma regra existir, `avaliarPorConclusao`
// devolve lista vazia SEM tocar a rede.

import { ALEXANDRIA_BADGES } from '@/lib/data/alexandria-badges';
import { recordEvent } from './progressApi';

/** Por que um critério ainda não pode ser verificado automaticamente.
 *  Classificação, não desculpa: cada valor aponta para um trabalho
 *  diferente, em posse diferente. */
export type BloqueioBadge =
  /** O critério é demonstração humana (explicar / desenhar / narrar /
   *  recitar / interpretar). Nenhum evento prova. Abrir isto é decisão
   *  de produto sobre o que conta como prova — não de engenharia. */
  | 'competencia-humana'
  /** O valor que o critério exige já é calculado hoje, mas nada o
   *  observa. Abrir isto é dar a `InstrumentPanel` um callback de
   *  resultado. */
  | 'instrumentacao-ausente'
  /** A aula ou o módulo por trás do critério ainda não foi extraído. */
  | 'conteudo-ausente'
  /** A superfície que o critério nomeia ainda não existe no produto. */
  | 'feature-ausente';

/** Sinais que o produto sabe observar hoje. Cresce quando um bloqueio
 *  abre — e crescer aqui é o gatilho para escrever `avaliar`. */
export interface SinaisConclusao {
  /** A aula que acabou de ser marcada como concluída. */
  aulaId: string;
}

export interface RegraBadge {
  badgeId: string;
  /** `null` = não existe regra automática honesta hoje. Nunca preencher
   *  com aproximação: um gatilho que "quase" prova o critério concede
   *  badge falso, e badge falso é pior que badge ausente. */
  avaliar: ((sinais: SinaisConclusao) => boolean) | null;
  bloqueio: BloqueioBadge | null;
  /** O que exatamente falta, em uma frase verificável. */
  razao: string;
}

export const REGRAS_BADGE: RegraBadge[] = [
  // ── (A) Referência visual ────────────────────────────────────────────
  {
    badgeId: 'badge-anatomista-de-faturas',
    avaliar: null,
    bloqueio: 'conteudo-ausente',
    razao:
      'É o único dos 13 cujo critério é puramente conclusão de aula — "Concluiu a aula da conta de luz industrial item por item" mapeia direto em `aula_concluida`, o sinal que já existe. Falta a aula: o Bloco 10 (Tarifas e a Conta de Luz Industrial) não tem HTML extraído, e nenhuma aula dos módulos 01-09 trata da conta industrial. Sem id de aula para nomear, a regra não pode ser escrita sem generalizar para o módulo inteiro — o que seria proxy. Extraído o Bloco 10, esta linha vira uma comparação de id.',
  },
  {
    badgeId: 'badge-cartografo-do-sin',
    avaliar: null,
    bloqueio: 'feature-ausente',
    razao:
      'Exige "os quatro submercados no Atlas interativo". O Atlas da Wave 27 é mundial (188 países da OWID); a camada Brasil com os quatro submercados está declarada na própria página como wave separada, ainda não construída. Além da camada, exigiria um evento de exploração por região — que também não existe.',
  },
  {
    badgeId: 'badge-leitor-de-mercado',
    avaliar: null,
    bloqueio: 'instrumentacao-ausente',
    razao:
      '"Acertou 90% das questões" exige questão corrigida, e nada no produto corrige resposta: `ExercicioBlock` tem apenas revelar/ocultar gabarito, sem campo de resposta e sem checagem. O backend já aceita `exercicio_respondido`, mas nenhum arquivo o emite. Abrir isto é uma wave de exercício avaliado, não um callback.',
  },
  {
    badgeId: 'badge-guardiao-fp',
    avaliar: null,
    bloqueio: 'instrumentacao-ausente',
    razao:
      'O critério mais próximo de automático de todos os 13: "Atinja 0,92 de FP médio em simulação tarifária" é um limiar numérico sobre uma saída que JÁ é calculada. `lab-01` (Comparador de perfil elétrico, Módulo 01) é literalmente a simulação tarifária, tem FP por perfil como campo, e usa 0,92 como o limiar que dispara a cobrança de reativo. Falta só observar: `InstrumentPanel` não expõe resultado, e é NUNCA MODIFICAR nesta wave.',
  },

  // ── (B) Checklist do Módulo 01 ───────────────────────────────────────
  {
    badgeId: 'badge-tradutor-kw-kwh',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao:
      '"Explicar kW vs kWh em 30 segundos, com exemplo numérico." Usar o `inst-01` produz um exemplo numérico, mas usar não é explicar — e conceder pelo uso seria exatamente o proxy que esta wave proíbe.',
  },
  {
    badgeId: 'badge-fator-de-carga',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao:
      'Critério composto: "Calcular fator de carga E interpretar o que ele significa operacionalmente." A primeira metade é observável em princípio (o `inst-04` calcula FC, e o veredito dele É a interpretação operacional); a segunda é compreensão, que nenhum evento alcança. Conceder pela metade mensurável é conceder por proxy do todo. Duplamente bloqueado, aliás: mesmo a primeira metade está atrás do `InstrumentPanel`.',
  },
  {
    badgeId: 'badge-lei-de-ohm',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao:
      '"Explicar a Lei de Ohm e por que perdas crescem com I²." O `inst-02` resolve Ohm e o `inst-03` calcula perdas resistivas, mas o critério pede a explicação do porquê — não o resultado.',
  },

  // ── (B) Checklist do Módulo 02 ───────────────────────────────────────
  {
    badgeId: 'badge-cadeia-da-rede',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao: '"Desenhar num guardanapo" a cadeia com tensões e dono de cada trecho. Desenho fora da tela.',
  },
  {
    badgeId: 'badge-fronteira-do-ons',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao:
      '"Listar três coisas que o ONS faz e três que ele não faz, nomeando quem faz." Produção de lista pelo aluno; o produto não tem campo onde ela caiba, nem correção para ela.',
  },
  {
    badgeId: 'badge-dez-segundos',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao: '"Narrar os dez segundos pós-perda de usina." Narração falada, em sequência, sem superfície no produto.',
  },

  // ── (B) Checklist do Módulo 03 ───────────────────────────────────────
  {
    badgeId: 'badge-matriz-em-duas-lentes',
    avaliar: null,
    bloqueio: 'instrumentacao-ausente',
    razao:
      'O segundo mais próximo de automático. O critério — "desenhar a matriz brasileira em capacidade E em energia, dois desenhos diferentes, com ordens de grandeza por fonte" — é exatamente o que o Reconstrutor de matriz do Módulo 08 (`m08-inst-04-cap` e `m08-inst-04-ger`, LYCEUM Wave 34) faz: o aluno PRODUZ as seis fatias de memória e o instrumento corrige contra referência com tolerância. O próprio veredito da fonte chama ordem certa + seis fatias dentro da tolerância de "o critério oficial de domínio deste bloco cumprido". Falta observar as duas rodadas: `InstrumentPanel` não expõe resultado, e `ordemOk` nem sequer sai em `valores` (só `i4-acertos`, `i4-err`, `i4-soma`).',
  },
  {
    badgeId: 'badge-fator-de-capacidade',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao:
      '"Definir fator de capacidade pela fórmula e citar as faixas típicas de hidro, eólica NE, solar e nuclear." O `inst-06` calcula FC e seus seis vereditos nomeiam essas faixas — mas quem cita é o instrumento, não o aluno. Percorrer as faixas não é citá-las.',
  },
  {
    badgeId: 'badge-vacina-do-lcoe',
    avaliar: null,
    bloqueio: 'competencia-humana',
    razao:
      'Composto como o do fator de carga: "Calcular um LCOE didático no guardanapo E recitar os quatro limites como vacina." O cálculo tem instrumento no Módulo 03; a recitação dos quatro limites não tem prova possível.',
  },
];

/** Trava de DEV: cobertura 1:1 entre catálogo e regras. Sem isto, um badge
 *  novo entra em `alexandria-badges.ts` e fica silenciosamente sem regra —
 *  e "sem regra" é indistinguível de "regra que nunca dispara". */
if (import.meta.env.DEV) {
  const doCatalogo = new Set(ALEXANDRIA_BADGES.map((b) => b.id));
  const dasRegras = new Set(REGRAS_BADGE.map((r) => r.badgeId));
  const semRegra = [...doCatalogo].filter((id) => !dasRegras.has(id));
  const orfas = [...dasRegras].filter((id) => !doCatalogo.has(id));
  if (semRegra.length || orfas.length || dasRegras.size !== REGRAS_BADGE.length) {
    console.warn(
      '[alexandria] regras de badge fora de sincronia com o catálogo.',
      { semRegra, orfas },
    );
  }
}

/** Badges cujo critério NÃO tem regra automática hoje, com o bloqueio de
 *  cada um. Consumido pelo Perfil para declarar a pendência ao aluno em
 *  vez de deixar a lista de insígnias vazia e muda. */
export const BADGES_SEM_REGRA = REGRAS_BADGE.filter((r) => r.avaliar === null);

/** Quantos badges estão bloqueados por cada classe. Derivado — a soma
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

/**
 * Avalia os badges concedíveis a partir de uma conclusão de aula — o
 * único sinal que o produto emite hoje.
 *
 * Devolve `[]` quando nenhuma regra existe, o que é o caso de todas as
 * treze neste fechamento. Nenhuma chamada de rede acontece nesse caminho:
 * a lista vazia sai antes de qualquer `fetch`.
 */
export function avaliarPorConclusao(sinais: SinaisConclusao): string[] {
  return REGRAS_BADGE.filter((r) => r.avaliar !== null && r.avaliar(sinais)).map(
    (r) => r.badgeId,
  );
}

/**
 * Emite `badge_conquistado` para cada badge satisfeito. Idempotente do
 * lado do backend (`badgeAlreadyAwarded` distingue primeira concessão de
 * repetição), então reenviar não duplica — mas a lista vazia nem chega a
 * abrir requisição.
 *
 * Best-effort, como os outros eventos de progresso: falha loga e segue,
 * nunca bloqueia a aula.
 */
export async function concederBadges(badgeIds: string[]): Promise<string[]> {
  if (badgeIds.length === 0) return [];
  const concedidos: string[] = [];
  await Promise.all(
    badgeIds.map(async (id) => {
      try {
        const r = await recordEvent('badge_conquistado', id);
        if (r.badgeAlreadyAwarded === false) concedidos.push(id);
      } catch (err) {
        console.error('[alexandria] falha ao registrar badge_conquistado', id, err);
      }
    }),
  );
  return concedidos;
}
