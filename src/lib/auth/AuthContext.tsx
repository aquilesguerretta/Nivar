// src/lib/auth/AuthContext.tsx
// ARCHITECT — Identidade de Plataforma, Wave 1.
//
// O provedor que faz "logar uma vez, reconhecido em todo lugar" ser
// verdade. Isso NÃO é um mecanismo de sincronização — é consequência
// de existir um provedor único montado na raiz da árvore React, que
// todo produto lê do mesmo lugar em vez de reimplementar estado de
// login próprio. O cookie httpOnly da Wave 9 já viaja sozinho em
// qualquer chamada de mesma origem; a peça que faltava era este
// contexto compartilhado, não sincronia adicional.
//
// Montado em main.tsx envolvendo TODA a árvore de rotas — inclusive
// `/alexandria/*`, mesmo que nada lá dentro consuma ainda (isso é
// wave do LYCEUM). O contexto existir antes do consumidor é de
// propósito: quando a Alexandria for ler, já vai estar lá.
//
// 401 é o ESTADO NORMAL de "não logado", não erro. Não há UI de falha
// para ele em lugar nenhum deste arquivo.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import * as api from './authApi';
import type { PlatformUser, ActivateResponse, ProductsResponse } from './authApi';

export interface AuthContextValue {
  /** Usuário da sessão, ou null quando não há sessão. */
  user: PlatformUser | null;
  /** True até a primeira resposta de `/api/auth/me`. Enquanto isso,
   *  ninguém deve concluir "não logado" — só "ainda não sabemos". */
  loading: boolean;
  login: (email: string, password: string) => Promise<PlatformUser>;
  signup: (name: string, email: string, password: string) => Promise<PlatformUser>;
  logout: () => Promise<void>;
  activateProduct: (productId: string) => Promise<ActivateResponse>;
  myProducts: (signal?: AbortSignal) => Promise<ProductsResponse>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PlatformUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Hidratação no mount: o cookie httpOnly já está no navegador se a
  // pessoa entrou antes, então `me()` responde 200 sem nada mais.
  useEffect(() => {
    const ctrl = new AbortController();
    api
      .me(ctrl.signal)
      .then(({ user: u }) => setUser(u))
      .catch((err: unknown) => {
        // 401 = não logado. Estado normal, não falha.
        if (err instanceof Error && err.name === 'AbortError') return;
        setUser(null);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u } = await api.login({ email, password });
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { user: u } = await api.signup({ name, email, password });
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      // O estado local zera mesmo se a chamada falhar — do ponto de
      // vista de quem clicou "sair", a sessão acabou.
      setUser(null);
    }
  }, []);

  const activateProduct = useCallback((productId: string) => api.activateProduct(productId), []);
  const myProducts = useCallback((signal?: AbortSignal) => api.myProducts(signal), []);

  const valor = useMemo<AuthContextValue>(
    () => ({ user, loading, login, signup, logout, activateProduct, myProducts }),
    [user, loading, login, signup, logout, activateProduct, myProducts],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

/**
 * Lê a identidade de plataforma de qualquer ponto da árvore.
 *
 * Lança se usado fora do provedor — é bug de montagem, não estado
 * possível: o AuthProvider envolve a árvore inteira em main.tsx.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  return ctx;
}

/**
 * Variante que NÃO lança fora do provedor.
 *
 * Existe para consumidores opcionais — um componente que só quer
 * saudar pelo nome se houver sessão, sem exigir o provedor para
 * montar. Consumidor obrigatório usa `useAuth`.
 */
export function useAuthOpcional(): AuthContextValue | null {
  return useContext(AuthContext);
}
