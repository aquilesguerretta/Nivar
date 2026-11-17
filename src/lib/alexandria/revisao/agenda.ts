// agenda.ts — a regra PURA da revisão espaçada da Alexandria.
//
// Sem React, sem `fetch`, sem alias `@/`, sem global do Vite: roda igual no
// navegador e no `node --test` (`tests/alexandria-progresso/revisao-agenda.test.ts`).
//
// DERIVADA DO LOG, SEM COLUNA NOVA. A agenda de cada item é recalculada a
// cada leitura a partir das tentativas `exercicio_respondido` (ato
// `exercicio`) que o backend já guarda (`GET /api/progress/revisao`). Nada
// de "próxima revisão" é gravado: se a regra mudar, a agenda muda junto, sem
// migration e sem dado velho a corrigir.
//
// O QUE ISTO NÃO É. Os intervalos abaixo são REGRA DE PRODUTO DA CASA,
// escolhida para o aluno voltar em dias crescentes. Não são fato pedagógico,
// não têm fonte citada e nunca devem aparecer na tela como "a ciência diz".
// A revisão também não é evidência de domínio (bar S3): ela devolve um item
// ao aluno; quem julga a resposta é o próprio aluno, e o julgamento só
// escolhe quando o item volta.

// ── A regra de produto, num lugar só ──────────────────────────

/**
 * INTERVALOS DA REVISÃO, em dias de calendário no fuso do aluno.
 *
 * Regra de produto da casa (LYCEUM, aprovada pelo Founder em 15/11/2026 como
 * "pode fazer a revisão"), NÃO fato pedagógico com fonte. Crescem mais ou
 * menos ao dobro para que um item bem lembrado volte cada vez mais espaçado
 * e o aluno não reveja tudo todo dia. Mudar estes números muda a agenda de
 * todo mundo na próxima leitura — é de propósito: nada fica gravado.
 *
 * A etapa de um item é o índice aqui. Etapa 0 = volta amanhã.
 */
export const INTERVALOS_EM_DIAS = [1, 3, 7, 14, 30, 60] as const;

/**
 * Quantos itens uma revisão do dia traz no máximo. Também regra de produto:
 * uma sessão curta que se termina é melhor do que uma fila que assusta. O
 * que passar do teto continua vencido e entra no dia seguinte.
 */
export const TETO_DA_REVISAO_DO_DIA = 12;

// ── Tipos ─────────────────────────────────────────────────────

/** A escala de autoavaliação da casa (bar C7), a mesma da aula. */
export const NIVEIS = ['atende', 'atende em parte', 'não atende'] as const;
export type Autoavaliacao = (typeof NIVEIS)[number];

/** O julgamento de UMA tentativa. `null` = nenhum julgamento registrado
 *  (o exercício aberto da aula não envia a autoavaliação — ver o doc). */
export type Resultado = Autoavaliacao | null;

/** Uma linha de `GET /api/progress/revisao`, como o backend devolve. */
export interface TentativaDoLog {
  entityId: string;
  aulaId: string | null;
  moduloId: string | null;
  /** `'revisao'` quando a tentativa veio da tela de revisão; `null` na aula. */
  origem: string | null;
  autoavaliacao: string | null;
  /** Até 600 caracteres; só serve para comparar escolha com a alternativa. */
  resposta: string | null;
  respostaCortada: boolean;
  occurredAt: string | null;
  /** Dia de calendário no fuso do aluno, `YYYY-MM-DD`. */
  dia: string;
}

/** O que a regra precisa saber de um exercício para julgar a tentativa. */
export interface ItemRevisavel {
  id: string;
  /** Escolha com gabarito: o TEXTO da alternativa certa (a aula registra o
   *  texto, não o índice). Aberto: `null` — só a autoavaliação julga. */
  textoDoGabarito: string | null;
}

export interface AgendaDoItem {
  id: string;
  /** Índice em `INTERVALOS_EM_DIAS`. */
  etapa: number;
  /** Último dia com tentativa. */
  ultimoDia: string;
  ultimoResultado: Resultado;
  /** Dias distintos em que o item foi praticado. */
  diasPraticados: number;
  /** Dia em que o item volta: `ultimoDia + INTERVALOS_EM_DIAS[etapa]`. */
  vence: string;
}

// ── Datas de calendário, sem relógio e sem fuso ───────────────

const DIA_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function paraUtc(dia: string): number | null {
  const m = DIA_RE.exec(dia);
  if (!m) return null;
  const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isFinite(t) ? t : null;
}

const UM_DIA = 86_400_000;

/** `2026-11-15` + 3 → `2026-11-18`. Aritmética de calendário em UTC: o dia
 *  já chega no fuso do aluno, e aqui só se conta. */
export function somarDias(dia: string, n: number): string {
  const t = paraUtc(dia);
  if (t === null) return dia;
  return new Date(t + n * UM_DIA).toISOString().slice(0, 10);
}

/** Dias de `de` até `ate` (positivo se `ate` vem depois). */
export function diasEntre(de: string, ate: string): number {
  const a = paraUtc(de);
  const b = paraUtc(ate);
  if (a === null || b === null) return 0;
  return Math.round((b - a) / UM_DIA);
}

// ── O julgamento de uma tentativa ─────────────────────────────

const ehNivel = (s: string | null): s is Autoavaliacao =>
  s !== null && (NIVEIS as readonly string[]).includes(s);

/**
 * O resultado de uma tentativa, na ordem de confiança:
 *   1. a autoavaliação registrada (tela de revisão);
 *   2. escolha com gabarito: a resposta é o texto da alternativa certa →
 *      `atende`; outra alternativa → `não atende` (a aula compara sozinha,
 *      em palavras, e a regra lê a mesma comparação);
 *   3. nada disso → `null` (aberto sem autoavaliação registrada).
 * Resposta cortada no transporte nunca é comparada: dado ruim não julga.
 */
export function resultadoDaTentativa(t: TentativaDoLog, item: ItemRevisavel): Resultado {
  if (ehNivel(t.autoavaliacao)) return t.autoavaliacao;
  if (item.textoDoGabarito !== null && t.resposta !== null && !t.respostaCortada) {
    return t.resposta.trim() === item.textoDoGabarito.trim() ? 'atende' : 'não atende';
  }
  return null;
}

// ── A progressão da etapa ─────────────────────────────────────

const ULTIMA_ETAPA = INTERVALOS_EM_DIAS.length - 1;

/**
 * A etapa depois de um dia de prática com resultado `r`, partindo de `antes`
 * (`-1` = item nunca praticado).
 *
 *   atende          → sobe uma etapa (o intervalo cresce), até a última;
 *   atende em parte → desce uma etapa (o intervalo ENCURTA), nunca abaixo de 0;
 *   não atende      → volta à etapa 0 (o item volta amanhã);
 *   sem julgamento  → fica onde estava (primeira vez: etapa 0). Sem
 *                     julgamento não há por que promover nem rebaixar.
 */
export function proximaEtapa(antes: number, r: Resultado): number {
  switch (r) {
    case 'atende':
      return Math.min(antes + 1, ULTIMA_ETAPA);
    case 'atende em parte':
      return Math.max(antes - 1, 0);
    case 'não atende':
      return 0;
    default:
      return Math.max(antes, 0);
  }
}

/**
 * A agenda de UM item a partir das tentativas dele (qualquer ordem).
 *
 * Várias tentativas no MESMO dia contam como um dia de prática: vale o
 * último julgamento daquele dia (refazer na aula, minutos depois, não
 * empurra o item três etapas). Dias sem julgamento algum ficam `null`.
 *
 * `null` quando não há tentativa com dia válido.
 */
export function agendaDoItem(tentativas: readonly TentativaDoLog[], item: ItemRevisavel): AgendaDoItem | null {
  const validas = tentativas
    .filter((t) => t.entityId === item.id && paraUtc(t.dia) !== null)
    .map((t, i) => ({ t, i }))
    // dia, depois instante, depois ordem de chegada: estável e determinístico
    .sort((a, b) =>
      a.t.dia !== b.t.dia
        ? a.t.dia < b.t.dia ? -1 : 1
        : (a.t.occurredAt ?? '') !== (b.t.occurredAt ?? '')
          ? (a.t.occurredAt ?? '') < (b.t.occurredAt ?? '') ? -1 : 1
          : a.i - b.i,
    )
    .map((x) => x.t);
  if (!validas.length) return null;

  const porDia: { dia: string; resultado: Resultado }[] = [];
  for (const t of validas) {
    const r = resultadoDaTentativa(t, item);
    const ultimo = porDia[porDia.length - 1];
    if (ultimo && ultimo.dia === t.dia) {
      if (r !== null) ultimo.resultado = r;
    } else {
      porDia.push({ dia: t.dia, resultado: r });
    }
  }

  let etapa = -1;
  for (const d of porDia) etapa = proximaEtapa(etapa, d.resultado);
  const ultimo = porDia[porDia.length - 1];

  return {
    id: item.id,
    etapa,
    ultimoDia: ultimo.dia,
    ultimoResultado: ultimo.resultado,
    diasPraticados: porDia.length,
    vence: somarDias(ultimo.dia, INTERVALOS_EM_DIAS[etapa]),
  };
}

/**
 * A agenda de todos os itens que o log alcança. Tentativa de exercício que
 * o catálogo não conhece (id fora de `avaliacao.ts`) fica de fora: sem
 * enunciado não há o que devolver ao aluno.
 */
export function agendaDoLog(
  tentativas: readonly TentativaDoLog[],
  catalogo: ReadonlyMap<string, ItemRevisavel>,
): AgendaDoItem[] {
  const porItem = new Map<string, TentativaDoLog[]>();
  for (const t of tentativas) {
    if (!catalogo.has(t.entityId)) continue;
    const lista = porItem.get(t.entityId);
    if (lista) lista.push(t);
    else porItem.set(t.entityId, [t]);
  }
  const agendas: AgendaDoItem[] = [];
  for (const [id, lista] of porItem) {
    const a = agendaDoItem(lista, catalogo.get(id)!);
    if (a) agendas.push(a);
  }
  return agendas;
}

// ── O que a Home e a tela de revisão leem ─────────────────────

export interface RevisaoDoDia {
  /** Vencidos hoje ou antes, o mais atrasado primeiro, até o teto. */
  hoje: AgendaDoItem[];
  /** Quantos estão vencidos ao todo (pode passar do teto). */
  vencidos: number;
  /** O próximo dia, depois de hoje, em que algum item vence; `null` se nenhum. */
  proximoDia: string | null;
  /** Quantos itens vencem nesse próximo dia. */
  noProximoDia: number;
  /** Itens na agenda ao todo (já praticados e reconhecidos). */
  naAgenda: number;
}

/**
 * A revisão do dia. Ordem: mais atrasado primeiro; empate → etapa menor
 * (o que está mais frágil) → id, para a lista não trocar de ordem entre
 * leituras.
 */
export function revisaoDoDia(agendas: readonly AgendaDoItem[], hoje: string, teto = TETO_DA_REVISAO_DO_DIA): RevisaoDoDia {
  const vencidos = agendas
    .filter((a) => a.vence <= hoje)
    .sort((a, b) =>
      a.vence !== b.vence ? (a.vence < b.vence ? -1 : 1) : a.etapa !== b.etapa ? a.etapa - b.etapa : a.id < b.id ? -1 : a.id > b.id ? 1 : 0,
    );
  const futuros = agendas.filter((a) => a.vence > hoje).map((a) => a.vence).sort();
  const proximoDia = futuros[0] ?? null;
  return {
    hoje: vencidos.slice(0, Math.max(0, teto)),
    vencidos: vencidos.length,
    proximoDia,
    noProximoDia: proximoDia ? futuros.filter((d) => d === proximoDia).length : 0,
    naAgenda: agendas.length,
  };
}

/**
 * Para onde o item vai depois de uma revisão feita HOJE com resultado `r`:
 * a mesma regra, aplicada ao log mais a tentativa nova. É o que a tela diz
 * logo depois da autoavaliação ("volta em 7 dias").
 */
export function depoisDaRevisao(
  tentativas: readonly TentativaDoLog[],
  item: ItemRevisavel,
  hoje: string,
  r: Resultado,
): AgendaDoItem {
  const nova: TentativaDoLog = {
    entityId: item.id,
    aulaId: null,
    moduloId: null,
    origem: 'revisao',
    autoavaliacao: r,
    resposta: null,
    respostaCortada: false,
    // Sentinela que ordena depois de qualquer instante ISO do mesmo dia: a
    // tentativa de agora é a última do dia, e é o julgamento dela que vale.
    occurredAt: '￿',
    dia: hoje,
  };
  // `agendaDoItem` só devolve null sem tentativa válida, e `nova` é válida.
  return agendaDoItem([...tentativas, nova], item)!;
}

// ── Frases ────────────────────────────────────────────────────

const MESES = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];

/** Quando o item volta, em palavras, relativo a `hoje`. */
export function quandoVolta(vence: string, hoje: string): string {
  const n = diasEntre(hoje, vence);
  if (n <= 0) return 'hoje';
  if (n === 1) return 'amanhã';
  if (n < 7) return `em ${n} dias`;
  const m = DIA_RE.exec(vence);
  const data = m ? `${Number(m[3])} ${MESES[Number(m[2]) - 1]}` : vence;
  return `em ${n} dias · ${data}`;
}

/** Há quanto tempo o item está esperando, para a lista da Home. */
export function atraso(vence: string, hoje: string): string {
  const n = diasEntre(vence, hoje);
  if (n <= 0) return 'vence hoje';
  if (n === 1) return 'esperando desde ontem';
  return `esperando há ${n} dias`;
}
