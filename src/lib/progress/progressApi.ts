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

export type ProgressEventType =
  | 'aula_iniciada'
  | 'aula_concluida'
  | 'instrumento_usado'
  | 'exercicio_respondido'
  | 'badge_conquistado';

export interface StreakInfo {
  atual: number;
  maior: number;
  ultimoDiaAtivo: string;
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

export interface MyProgress {
  aulasConcluidas: string[];
  aulasEmAndamento: string[];
  badges: { badgeId: string; awardedAt: string }[];
  streak: StreakInfo;
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
 *  `eventType`) — este cliente nunca o interpreta, só repassa. */
export function recordEvent(
  eventType: ProgressEventType,
  entityId: string,
  metadata?: Record<string, unknown>,
): Promise<ProgressEventResponse> {
  return pedir<ProgressEventResponse>('/api/progress/events', {
    method: 'POST',
    body: { eventType, entityId, ...(metadata ? { metadata } : {}) },
  });
}

/** ENDPOINT 23 — progresso agregado da conta. Fatos crus do backend
 *  (`aulaIds`, não "X de Y") — a junção contra o currículo é de quem
 *  consome, nunca deste cliente. */
export async function getMyProgress(signal?: AbortSignal): Promise<MyProgress> {
  const envelope = await pedir<{ data: MyProgress }>('/api/progress/me', { signal });
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
