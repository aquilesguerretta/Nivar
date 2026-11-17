// src/lib/progress/progressApi.ts
// LYCEUM — Alexandria Wave 31.
//
// Cliente fino dos Endpoints 22-24 (`docs/v2-backend-contract.md` §
// "Per-account learning progress (Wave 11)"). Mesma convenção de
// `credentials: 'include'` + caminho relativo que `src/lib/auth/authApi.ts`
// (ARCHITECT, Identidade Wave 1) já estabeleceu — primeira vez que esse
// padrão se repete fora da autenticação, confirmado por leitura antes de
// assumir que valia igual aqui: o cookie de sessão é `SameSite=lax` e não
// viaja em fetch cross-site, então caminho relativo é o que serve dev e
// produção sem `if (dev)`.
//
// O Atlas Mundial e o cliente canônico também usam caminhos relativos;
// progresso acrescenta `credentials: 'include'` porque precisa do cookie
// httpOnly de sessão em toda chamada, exatamente como identidade.
//
// Endpoint 22 (`POST /events`) devolve JSON PLANO, mesmo idioma do
// `activate` da Wave 9 — reporta o que acabou de acontecer, não é leitura
// de referência. Endpoints 23-24 (`GET /me`, `GET /aulas/{id}`) usam o
// envelope canônico `{meta, data, summary}`, porque é dado de referência
// do usuário. `getMyProgress`/`getAulaStatus` devolvem só `.data` — os
// hooks de mercado já fazem esse mesmo achatamento.
//
// Alexandria v3 (eventos): os quatro leitores da Peça D — `/streak`,
// `/pratica`, `/aulas/{id}/pratica`, `/pratica/entidades/{id}` — com
// formatos lidos de `app/routers/progress.py` e
// `app/services/progress_service.py`, NÃO de `docs/v2-backend-contract.md`,
// que nesta árvore ainda descreve a sequência da Wave 11 (incremento cego,
// sem `semRegistro`). O router é a fonte.

export type ProgressEventType =
  | 'aula_iniciada'
  | 'aula_concluida'
  | 'instrumento_usado'
  | 'exercicio_respondido'
  | 'badge_conquistado';

/**
 * Sequência de dias, DERIVADA do log (`app/services/progress_service.py`
 * · `streak_payload`, Peça D). Contrato lido do router real, não da
 * memória:
 *
 * - `semRegistro: true` = a conta NUNCA teve dia de estudo. Todos os
 *   números vêm `null` — ausência, não zero.
 * - `semRegistro: false` e `atual: 0` = estudou, e a corrida quebrou
 *   (dois dias ou mais sem estudo). Zero aqui é medida.
 * - `atual` segue viva durante o dia seguinte ao último dia de estudo.
 *
 * As duas primeiras são FRASES DIFERENTES na tela — ver
 * `src/lib/alexandria/progresso/regras.ts` (`fraseDaSequencia`).
 */
export interface StreakInfo {
  atual: number | null;
  maior: number | null;
  /** ISO `YYYY-MM-DD`, no fuso do aluno. */
  ultimoDiaAtivo: string | null;
  /** ISO `YYYY-MM-DD` do dia em que a sequência mais longa terminou. */
  maiorAte: string | null;
  /** Fuso IANA que transformou instante em dia. */
  fuso: string;
  /** "Hoje" no fuso, segundo o relógio do banco. */
  diaDeReferencia: string;
  semRegistro: boolean;
}

/** `GET /api/progress/streak` acrescenta a lista de tipos que contam —
 *  para o front nunca guardar uma cópia dela (e `badge_conquistado` não
 *  está nela: a máquina não estende a sequência do aluno). */
export interface StreakComTipos extends StreakInfo {
  tiposQueContam: ProgressEventType[];
}

export interface AulaStatusInfo {
  status: 'em_andamento' | 'concluido';
  startedAt: string;
  completedAt: string | null;
}

export interface ProgressEventResponse {
  eventId: string;
  eventType: ProgressEventType;
  entityId: string;
  occurredAt: string;
  streak: StreakInfo;
  /** Presente só para `aula_iniciada` / `aula_concluida`. */
  aulaStatus?: AulaStatusInfo;
  /** Presente só para `badge_conquistado`. */
  badgeAlreadyAwarded?: boolean;
}

/** Contagem de tentativas por tipo de evento de prática. */
export interface ContagemDePratica {
  tentativas: number;
  distintos: number;
}

/** O eixo Praticado da conta (`GET /api/progress/pratica`). EVIDÊNCIA de
 *  tentativa — nunca Demonstrado, nunca somado com a sequência (bar S3).
 *  A tentativa só pertence a uma aula pelo `metadata.aulaId` do evento;
 *  sem ele, conta em `eventosSemAulaVinculada`. */
export interface PraticaGeral {
  semRegistro: boolean;
  totalTentativas: number;
  aulasComPratica: string[];
  totalAulasComPratica: number;
  eventosSemAulaVinculada: number;
  instrumentos: ContagemDePratica;
  exercicios: ContagemDePratica;
  primeiraTentativa: string | null;
  ultimaTentativa: string | null;
  vinculoPor: 'metadata.aulaId';
}

export interface TentativasDeEntidade {
  entityId: string;
  tentativas: number;
  primeiraTentativa: string | null;
  ultimaTentativa: string | null;
}

/** `GET /api/progress/aulas/{id}/pratica` — 200 com `semRegistro` (não
 *  404) quando nada foi praticado na aula: é estado, não erro. */
export interface PraticaDaAula {
  aulaId: string;
  semRegistro: boolean;
  totalTentativas: number;
  instrumentos: TentativasDeEntidade[];
  exercicios: TentativasDeEntidade[];
  vinculoPor: 'metadata.aulaId';
}

/** `GET /api/progress/pratica/entidades/{id}` — um instrumento ou exercício. */
export interface PraticaDaEntidade {
  entityId: string;
  semRegistro: boolean;
  totalTentativas: number;
  porTipo: {
    eventType: 'instrumento_usado' | 'exercicio_respondido';
    tentativas: number;
    primeiraTentativa: string | null;
    ultimaTentativa: string | null;
  }[];
  /** Aulas a que as tentativas foram vinculadas por `metadata.aulaId`. */
  aulas: string[];
  vinculoPor: 'metadata.aulaId';
}

export interface MyProgress {
  aulasConcluidas: string[];
  aulasEmAndamento: string[];
  badges: { badgeId: string; awardedAt: string }[];
  streak: StreakInfo;
  /** Peça D. Opcional no tipo porque fixtures antigas do harness não o
   *  trazem; o backend atual sempre manda. */
  pratica?: PraticaGeral;
}

/**
 * Erro de progresso com o status HTTP preservado — mesmo idioma de
 * `AuthError` em `authApi.ts`.
 */
export class ProgressError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ProgressError';
    this.status = status;
  }
}

interface PedidoOpts {
  method?: 'GET' | 'POST';
  body?: unknown;
  signal?: AbortSignal;
}

async function pedir<T>(path: string, opts: PedidoOpts = {}): Promise<T> {
  const { method = 'GET', body, signal } = opts;

  let res: Response;
  try {
    res = await fetch(path, {
      method,
      signal,
      // Cookie httpOnly de sessão viaja aqui — sem isto o backend não
      // reconhece a conta e todo endpoint devolve 401.
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    throw new ProgressError(err instanceof Error ? err.message : 'Falha de rede.', 0);
  }

  if (!res.ok) {
    let detalhe = `HTTP ${res.status}`;
    try {
      const corpo = (await res.json()) as { detail?: unknown };
      if (typeof corpo?.detail === 'string') detalhe = corpo.detail;
    } catch {
      /* corpo não-JSON: fica o status */
    }
    throw new ProgressError(detalhe, res.status);
  }

  return (await res.json()) as T;
}

/** ENDPOINT 22 — registra um evento de progresso. `entityId` é opaco
 *  (aula_id, instrumento_id, exercicio_id ou badge_id, conforme
 *  `eventType`) — este cliente nunca o interpreta, só repassa.
 *
 *  Chamadores da Alexandria não usam isto direto para prática: passam por
 *  `emitirPratica` (`src/lib/alexandria/emitirPratica.ts`), que garante
 *  `metadata.aulaId` e não envia nada sem conta. */
export function recordEvent(
  eventType: ProgressEventType,
  entityId: string,
  metadata?: Record<string, unknown>,
  tz?: string | null,
): Promise<ProgressEventResponse> {
  return pedir<ProgressEventResponse>('/api/progress/events', {
    method: 'POST',
    body: { eventType, entityId, ...(metadata ? { metadata } : {}), ...(tz ? { tz } : {}) },
  });
}

/** O fuso do navegador, quando ele declara um nome IANA plausível. O
 *  backend aceita `tz` em toda leitura e cai em `America/Sao_Paulo` sem
 *  ele — o dia do aluno é o dia no fuso do aluno. */
export function fusoDoNavegador(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return typeof tz === 'string' && /^[A-Za-z][A-Za-z0-9_+-]*(?:\/[A-Za-z0-9_+-]+){0,2}$/.test(tz) ? tz : null;
  } catch {
    return null;
  }
}

const comFuso = (path: string, tz?: string | null) =>
  tz ? `${path}?tz=${encodeURIComponent(tz)}` : path;

/** ENDPOINT 23 — progresso agregado da conta. Fatos crus do backend
 *  (`aulaIds`, não "X de Y") — a junção contra o currículo é de quem
 *  consome, nunca deste cliente. */
export async function getMyProgress(signal?: AbortSignal, tz?: string | null): Promise<MyProgress> {
  const envelope = await pedir<{ data: MyProgress }>(comFuso('/api/progress/me', tz), { signal });
  return envelope.data;
}

/** ENDPOINT 24 — status de uma aula específica. `null` (não `throw`) em
 *  404: "esta conta nunca iniciou esta aula" é estado normal, mesmo
 *  idioma do 401 de `/api/auth/me` em `authApi.ts` — não uma falha a
 *  reportar. */
export async function getAulaStatus(
  aulaId: string,
  signal?: AbortSignal,
): Promise<AulaStatusInfo | null> {
  try {
    const envelope = await pedir<{ data: AulaStatusInfo }>(
      `/api/progress/aulas/${encodeURIComponent(aulaId)}`,
      { signal },
    );
    return envelope.data;
  } catch (err) {
    if (err instanceof ProgressError && err.status === 404) return null;
    throw err;
  }
}

/** `GET /api/progress/streak` — sequência derivada do log, com os tipos de
 *  evento que contam. Motivação, nunca evidência (bar S3). */
export async function getStreak(signal?: AbortSignal, tz?: string | null): Promise<StreakComTipos> {
  const envelope = await pedir<{ data: StreakComTipos }>(comFuso('/api/progress/streak', tz), { signal });
  return envelope.data;
}

/** `GET /api/progress/pratica` — o eixo Praticado da conta inteira. */
export async function getPratica(signal?: AbortSignal): Promise<PraticaGeral> {
  const envelope = await pedir<{ data: PraticaGeral }>('/api/progress/pratica', { signal });
  return envelope.data;
}

/** `GET /api/progress/aulas/{id}/pratica` — o Praticado de uma aula. */
export async function getPraticaDaAula(aulaId: string, signal?: AbortSignal): Promise<PraticaDaAula> {
  const envelope = await pedir<{ data: PraticaDaAula }>(
    `/api/progress/aulas/${encodeURIComponent(aulaId)}/pratica`,
    { signal },
  );
  return envelope.data;
}

/** `GET /api/progress/pratica/entidades/{id}` — um instrumento ou exercício. */
export async function getPraticaDaEntidade(entityId: string, signal?: AbortSignal): Promise<PraticaDaEntidade> {
  const envelope = await pedir<{ data: PraticaDaEntidade }>(
    `/api/progress/pratica/entidades/${encodeURIComponent(entityId)}`,
    { signal },
  );
  return envelope.data;
}
