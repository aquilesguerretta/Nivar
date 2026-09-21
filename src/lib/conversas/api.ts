// src/lib/conversas/api.ts
// ARCHITECT — Diagnóstico Energético Wave 3, Fase 3.
//
// Cliente de conversa e mensagem. Contrato lido em
// `app/routers/conversations.py` (CURSOR Wave 2).
//
// ─── DOMÍNIO DE PLATAFORMA, NÃO DE DIAGNÓSTICO ───────────────────────
// A CURSOR modelou `conversation`/`message` como domínio da plataforma
// de propósito: o endpoint recebe `productId` e um par
// `originKind`/`originId` OPACO. Diagnóstico Energético é o primeiro
// consumidor, não o dono — este módulo mora em `src/lib/conversas/`
// para que CLE e Solar herdem sem reescrever nada.

import { AuthError } from '../auth/authApi';

const BASE = '/api/conversations';

/** `origin_kind` do caso de Diagnóstico. Literal do backend
 *  (`app/db/models/conversation.py:41`) — digitar errado aqui faz o
 *  `_verify_diagnostico_origin` recusar em silêncio. */
export const ORIGEM_DIAGNOSTICO = 'diagnostico_energetico_submission';

/** `role` vem do SERVIDOR — quem é a casa e quem é o cliente não é
 *  decisão da tela. `customer` é o dono da conta; qualquer outro papel
 *  é operador. */
export interface Mensagem {
  id: string;
  conversationId: string;
  authorUserId: string;
  role: string;
  body: string;
  createdAt: string;
}

export interface Conversa {
  id: string;
  userId: string;
  productId: string;
  status: string;
  subject: string | null;
  originKind: string | null;
  originId: string | null;
  createdAt: string;
  updatedAt: string;
  /** Só em `GET /{id}` — a listagem devolve sem mensagens. */
  messages?: Mensagem[];
  messageCount?: number;
}

export interface ListaConversas {
  data: Conversa[];
  summary: { count: number };
}

/** Corpo do `POST /api/conversations`. `originKind` e `originId` são
 *  opcionais, mas o `model_validator` do backend exige os DOIS juntos
 *  ou nenhum — por isso viajam como um par só neste tipo. */
export interface NovaConversa {
  productId: string;
  origem?: { kind: string; id: string };
  subject?: string;
  body?: string;
}

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

async function pedir<T>(caminho: string, init: RequestInit = {}): Promise<T> {
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

/** `POST /api/conversations`. IDEMPOTENTE POR ORIGEM: com `origem`
 *  presente, o backend devolve a conversa existente daquele par em vez
 *  de criar uma segunda — então chamar de novo para o mesmo caso é
 *  seguro, e é assim que a tela resolve "abrir ou continuar". */
export function abrirConversa(nova: NovaConversa, signal?: AbortSignal): Promise<Conversa> {
  const corpo: Record<string, unknown> = { productId: nova.productId };
  if (nova.origem) {
    corpo.originKind = nova.origem.kind;
    corpo.originId = nova.origem.id;
  }
  if (nova.subject) corpo.subject = nova.subject;
  if (nova.body) corpo.body = nova.body;
  return pedir<Conversa>(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
    signal,
  });
}

/** `GET /api/conversations` — as conversas da conta, `updatedAt desc`,
 *  SEM mensagens. */
export function listarConversas(signal?: AbortSignal): Promise<ListaConversas> {
  return pedir<ListaConversas>(BASE, { signal });
}

/** `GET /api/conversations/{id}` — a conversa COM `messages[]`,
 *  ordenadas `createdAt asc`. */
export function lerConversa(id: string, signal?: AbortSignal): Promise<Conversa> {
  return pedir<Conversa>(`${BASE}/${id}`, { signal });
}

/** `POST /api/conversations/{id}/messages` — o cliente escrevendo.
 *  `403` se a conversa não for da conta. */
export function enviarMensagem(
  id: string,
  body: string,
  signal?: AbortSignal,
): Promise<Mensagem> {
  return pedir<Mensagem>(`${BASE}/${id}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
    signal,
  });
}
