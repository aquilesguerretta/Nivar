// src/lib/auth/authApi.ts
// ARCHITECT — Identidade de Plataforma, Wave 1.
//
// Cliente fino dos seis endpoints de identidade (16-21 do contrato).
// Uma conta por pessoa no nível da PLATAFORMA — Alexandria, Portal
// Brasil e o futuro terminal americano leem esta base; nenhum deles
// guarda usuário próprio.
//
// POR QUE NÃO PASSA PELO fetchEnvelope DE services/api/client.ts:
// as Endpoints 16-21 devolvem JSON PLANO, não o envelope canônico
// `{meta, data, summary}` das Endpoints 1-15 (contrato, "Response
// shape — not the canonical envelope"). Aquele envelope existe para
// carregar frescor de dado (`timestamp`, `data_age_seconds`), que não
// significa nada numa chamada de identidade. Passar por lá seria
// forçar um validador de envelope sobre respostas que legitimamente
// não têm um. Todas as chamadas de browser usam `/api/*` same-origin.
//
// PRIMEIRO USO DE `credentials: 'include'` NO PROJETO. Grep no fechamento
// da Fase 1: a única ocorrência de `credentials:` em todo o src/ era
// `'omit'` no client.ts, que serve dado público de mercado. O cookie
// httpOnly `ga_session` da Wave 9 precisa viajar em toda chamada de
// identidade — sem isso, nada é reconhecido.
//
// POR QUE CAMINHO RELATIVO E NÃO `BASE_URL` (medido, não presumido):
// o cookie de sessão é `SameSite=lax` (verificado no Set-Cookie real
// de produção). `lax` NÃO viaja em fetch cross-site — provado no
// browser: login devolve 200 com o usuário, e o `/me` seguinte
// devolve 401, porque o cookie foi setado e nunca reenviado. Chamar
// `https://…railway.app` a partir de `localhost` é cross-site, então
// a sessão morreria em desenvolvimento.
//
// Caminho relativo resolve nos dois ambientes sem `if (dev)`:
//   · dev  — `server.proxy['/api']` do vite.config.ts encaminha para o
//            Railway, e o browser vê tudo como mesma origem;
//   · prod — o rewrite do vercel.json encaminha `/api/*` ao Railway.

// ─── Formas do contrato (camelCase, literais do backend) ──────────

/** Usuário da plataforma. Endpoints 16, 17 e 19 devolvem esta forma. */
export interface PlatformUser {
  id: string;
  email: string;
  name: string;
  /** Hoje só `['password']` — Google OAuth não shipou (contrato §Google). */
  authMethods: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionResponse {
  user: PlatformUser;
  expiresAt: string;
}

export interface ActivateResponse {
  productId: string;
  activatedAt: string;
  /** Distingue o primeiro clique da repetição — a rota é idempotente. */
  alreadyActive: boolean;
}

export interface ProductsResponse {
  products: { productId: string; activatedAt: string }[];
  /** Catálogo canônico servido pelo backend, para o front NÃO manter
   *  uma segunda cópia que deriva (decisão explícita do contrato). */
  catalog: string[];
}

// ─── Erro ─────────────────────────────────────────────────────────

/**
 * Erro de identidade com o status HTTP preservado.
 *
 * O status é o que as telas leem para decidir o que dizer: 409 é
 * "email já cadastrado" (específico, e o backend QUER que seja), 401
 * é a mensagem genérica única anti-enumeração, 422 é validação.
 */
export class AuthError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

// ─── Fetcher interno ──────────────────────────────────────────────

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
      // O cookie httpOnly de sessão viaja aqui. Sem isto a sessão
      // simplesmente não existe do ponto de vista do backend.
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    throw new AuthError(
      err instanceof Error ? err.message : 'Falha de rede.',
      0,
    );
  }

  if (!res.ok) {
    // O backend responde `{"detail": "..."}` (verificado por smoke
    // contra produção na Fase 1). Se o corpo não vier, o status
    // sozinho já basta para as telas decidirem.
    let detalhe = `HTTP ${res.status}`;
    try {
      const corpo = (await res.json()) as { detail?: unknown };
      if (typeof corpo?.detail === 'string') detalhe = corpo.detail;
    } catch {
      /* corpo não-JSON: fica o status */
    }
    throw new AuthError(detalhe, res.status);
  }

  return (await res.json()) as T;
}

// ─── Os seis endpoints ────────────────────────────────────────────

/** ENDPOINT 16 — cria conta. 409 se o email já existe (case-insensitive),
 *  422 em email malformado, senha < 8 ou nome vazio. */
export function signup(entrada: {
  email: string;
  password: string;
  name: string;
}): Promise<SessionResponse> {
  return pedir<SessionResponse>('/api/auth/signup', { method: 'POST', body: entrada });
}

/** ENDPOINT 17 — entra. 401 com a MESMA mensagem para todo modo de
 *  falha (endereço desconhecido, senha errada, conta só-Google) — é
 *  anti-enumeração deliberada, não uma lacuna a preencher no front. */
export function login(entrada: { email: string; password: string }): Promise<SessionResponse> {
  return pedir<SessionResponse>('/api/auth/login', { method: 'POST', body: entrada });
}

/** ENDPOINT 18 — sai. Limpa o cookie do navegador e nada mais: o token
 *  é stateless, então um Bearer já emitido vale até expirar. */
export function logout(): Promise<{ ok: boolean }> {
  return pedir<{ ok: boolean }>('/api/auth/logout', { method: 'POST' });
}

/** ENDPOINT 19 — usuário da sessão. 401 é o estado NORMAL de "não
 *  logado", não uma falha a reportar. */
export function me(signal?: AbortSignal): Promise<{ user: PlatformUser }> {
  return pedir<{ user: PlatformUser }>('/api/auth/me', { signal });
}

/** ENDPOINT 20 — ativa um produto. Idempotente por constraint no banco;
 *  dois cliques simultâneos não escrevem duas linhas. 404 para id fora
 *  do catálogo. */
export function activateProduct(productId: string): Promise<ActivateResponse> {
  return pedir<ActivateResponse>(
    `/api/products/${encodeURIComponent(productId)}/activate`,
    { method: 'POST' },
  );
}

/** ENDPOINT 21 — produtos ativados + catálogo canônico. */
export function myProducts(signal?: AbortSignal): Promise<ProductsResponse> {
  return pedir<ProductsResponse>('/api/products/me', { signal });
}
