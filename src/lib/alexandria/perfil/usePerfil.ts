// Lê o perfil da conta uma vez (dias de estudo, primeiras vezes, faixa, foto).
// null = carregando; 'falhou' = o servidor não respondeu — quem usa decide o
// que mostrar sem inventar número.

import { useEffect, useState } from 'react';
import { fusoDoNavegador } from '@/lib/progress/progressApi';
import { getPerfil, type PerfilDaConta } from './perfilApi';

export function usePerfilDaConta(ativo: boolean): PerfilDaConta | null | 'falhou' {
  const [perfil, setPerfil] = useState<PerfilDaConta | null | 'falhou'>(null);
  useEffect(() => {
    if (!ativo) return;
    const ctrl = new AbortController();
    getPerfil(fusoDoNavegador(), ctrl.signal)
      .then(setPerfil)
      .catch((e: unknown) => {
        if (e instanceof Error && e.name === 'AbortError') return;
        setPerfil('falhou');
      });
    return () => ctrl.abort();
  }, [ativo]);
  return perfil;
}
