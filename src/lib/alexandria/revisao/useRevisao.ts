// useRevisao.ts — a revisão do dia, lida do log e agendada pela regra pura.
//
// Sem conta, nada é lido e nada é mostrado (progresso fica atrás do
// cadastro). `indisponivel` ≠ "nada a revisar": o backend não respondeu, e a
// tela diz isso em vez de fingir que não há item.

import { useEffect, useMemo, useState } from 'react';
import { useEstadoDaConta } from '../useLoopDaAula';
import { agendaDoLog, revisaoDoDia, type AgendaDoItem, type RevisaoDoDia, type TentativaDoLog } from './agenda';
import { lerTentativasDeRevisao } from './api';
import { catalogoDeRevisao, type ItemDeRevisao } from './catalogo';

export interface RevisaoPronta {
  estado: 'pronta';
  hoje: string;
  tentativas: TentativaDoLog[];
  agendas: AgendaDoItem[];
  dia: RevisaoDoDia;
  catalogo: Map<string, ItemDeRevisao>;
  truncado: boolean;
}

export type EstadoDaRevisao =
  | { estado: 'carregando' }
  | { estado: 'visitante' }
  | { estado: 'indisponivel' }
  | RevisaoPronta;

type Lido = { hoje: string; tentativas: TentativaDoLog[]; truncado: boolean } | 'indisponivel' | null;

export function useRevisao(): EstadoDaRevisao {
  const conta = useEstadoDaConta();
  const [lido, setLido] = useState<Lido>(null);

  useEffect(() => {
    if (conta !== 'conta') {
      setLido(null);
      return;
    }
    const ctrl = new AbortController();
    setLido(null);
    lerTentativasDeRevisao(ctrl.signal)
      .then((d) => {
        if (!ctrl.signal.aborted) setLido({ hoje: d.diaDeReferencia, tentativas: d.tentativas, truncado: d.truncado });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('[alexandria] falha ao ler a revisão', err);
        setLido('indisponivel');
      });
    return () => ctrl.abort();
  }, [conta]);

  return useMemo<EstadoDaRevisao>(() => {
    if (conta === 'visitante') return { estado: 'visitante' };
    if (conta === 'carregando' || lido === null) return { estado: 'carregando' };
    if (lido === 'indisponivel') return { estado: 'indisponivel' };
    const catalogo = catalogoDeRevisao();
    const agendas = agendaDoLog(lido.tentativas, catalogo);
    return {
      estado: 'pronta',
      hoje: lido.hoje,
      tentativas: lido.tentativas,
      agendas,
      dia: revisaoDoDia(agendas, lido.hoje),
      catalogo,
      truncado: lido.truncado,
    };
  }, [conta, lido]);
}
