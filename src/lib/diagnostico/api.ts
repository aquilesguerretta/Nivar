// src/lib/diagnostico/api.ts
// ARCHITECT — Diagnóstico Energético Wave 3, Fase 2.
//
// Cliente do intake estruturado. Contrato lido em
// `app/routers/diagnostico.py` (CURSOR Wave 2) e reconciliado na Fase 1
// desta wave — ver `docs/diagnostico-energetico-recon-frontend.md`,
// adendo da Wave 3.
//
// ─── POR QUE NÃO É O CLIENTE CANÔNICO ────────────────────────────────
// `src/lib/submissoes/api.ts` serve CLE e Solar, e a incompatibilidade
// com este produto é de CONTRATO, não só de transporte:
//
//   · `enviar(arquivo: File)` exige `File`; aqui não há arquivo;
//   · o tipo `Submissao` de lá tem `status`, `source` (obrigatório),
//     `deliverable` e `deliveredAt` — NENHUM existe no payload daqui;
//   · o `summary` de lá é `{count, submitted, ready}`; aqui é `{count}`.
//
// Alargar aquele tipo para caber este deixaria `source` e `status`
// opcionais para todos — enfraquecendo justamente os campos de que CLE
// e Solar dependem. Os três compartilham a palavra "submissions" na
// URL, não a forma do dado. Módulo próprio, canônico intocado.

import { AuthError } from '../auth/authApi';

const BASE = '/api/diagnostico-energetico';

/** Resposta de `_payload` do router, campo a campo. Sem `status` e sem
 *  `deliverable`: este produto não tem entrega de arquivo. */
export interface SubmissaoDiagnostico {
  id: string;
  productId: string;
  sector: string;
  monthlyConsumptionBand: string;
  /** `null` quando o cliente não sabe dizer — o backend converte
   *  string vazia em `null`, e "não sei" NUNCA viaja como texto. */
  tariffModality: string | null;
  concern: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListaDiagnostico {
  data: SubmissaoDiagnostico[];
  summary: { count: number };
}

/** O corpo do POST, nos nomes exatos do alias camelCase do router. */
export interface EscopoDiagnostico {
  sector: string;
  monthlyConsumptionBand: string;
  /** `null` = não sei dizer. Nunca a string 'nao-sei'. */
  tariffModality: string | null;
  /** Obrigatório no backend (`_strip_required`, teto 4000). */
  concern: string;
}

/** Lê `{"detail": "..."}` e devolve `AuthError` com o status
 *  preservado — mesmo idioma do `pedir()` de `authApi.ts`. */
async function falhar(res: Response): Promise<never> {
  let detalhe = `HTTP ${res.status}`;
  try {
    const corpo = (await res.json()) as { detail?: unknown };
    if (typeof corpo?.detail === 'string') detalhe = corpo.detail;
  } catch {
    /* corpo não-JSON: fica o status */
  }
  throw new AuthError(detalhe, res.status);
}

async function pedir<T>(caminho: string, init: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(caminho, {
      ...init,
      credentials: 'include',
      headers: { Accept: 'application/json', ...(init.headers ?? {}) },
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    throw new AuthError(err instanceof Error ? err.message : 'Falha de rede.', 0);
  }
  if (!res.ok) return falhar(res);
  return (await res.json()) as T;
}

/** `POST /submissions` — JSON estruturado, sem arquivo. */
export function enviarEscopo(
  escopo: EscopoDiagnostico,
  signal?: AbortSignal,
): Promise<SubmissaoDiagnostico> {
  return pedir<SubmissaoDiagnostico>(`${BASE}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(escopo),
    signal,
  });
}

/** `GET /submissions` — os escopos da conta, mais recente primeiro. */
export function listarEscopos(signal?: AbortSignal): Promise<ListaDiagnostico> {
  return pedir<ListaDiagnostico>(`${BASE}/submissions`, { signal });
}
