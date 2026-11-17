// useSequencia.ts — a sequência de dias com estudo registrado.
//
// CAMADA DE MOTIVAÇÃO, NUNCA DE EVIDÊNCIA (bar S3). A sequência diz que o
// aluno ESTUDOU em dias seguidos — não que aprendeu. Ela nunca se soma ao
// Praticado num número só, e a frase nunca usa palavra de competência.
//
// Derivada do log pelo backend (`GET /api/progress/streak`, Peça D), no
// fuso do navegador quando ele declara um. Sem conta, nada é lido nem
// mostrado: progresso fica atrás do cadastro.
//
// As DUAS AUSÊNCIAS são estados diferentes, com frases diferentes
// (`fraseDaSequencia`):
//   `nunca`  — `semRegistro: true`: nenhum dia de estudo, números `null`.
//   `parada` — `atual: 0`: estudou, e a corrida quebrou. O zero é medida.

import { useEffect, useState } from 'react';
import { fusoDoNavegador, getStreak, type StreakComTipos } from '@/lib/progress/progressApi';
import { useEstadoDaConta } from './useLoopDaAula';
import { fraseDaSequencia, type FraseDaSequencia } from './progresso/regras';

export type { FraseDaSequencia } from './progresso/regras';

export type EstadoDaSequencia =
  | { estado: 'carregando' }
  /** Sem conta: não há sequência a mostrar, e a tela não inventa uma. */
  | { estado: 'visitante' }
  /** O backend não respondeu. Diferente de "nunca estudou". */
  | { estado: 'indisponivel' }
  | { estado: 'pronta'; sequencia: StreakComTipos; frase: FraseDaSequencia };

export function useSequencia(): EstadoDaSequencia {
  const conta = useEstadoDaConta();
  const [estado, setEstado] = useState<EstadoDaSequencia>({ estado: 'carregando' });

  useEffect(() => {
    if (conta === 'carregando') {
      setEstado({ estado: 'carregando' });
      return;
    }
    if (conta === 'visitante') {
      setEstado({ estado: 'visitante' });
      return;
    }
    const ctrl = new AbortController();
    setEstado({ estado: 'carregando' });
    getStreak(ctrl.signal, fusoDoNavegador())
      .then((sequencia) => {
        if (!ctrl.signal.aborted) setEstado({ estado: 'pronta', sequencia, frase: fraseDaSequencia(sequencia) });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('[alexandria] falha ao ler a sequência', err);
        setEstado({ estado: 'indisponivel' });
      });
    return () => ctrl.abort();
  }, [conta]);

  return estado;
}
