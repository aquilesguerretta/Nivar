// estudo.ts — o estado de estudo da entrada, a partir do registro REAL.
//
// Fontes: `useAuth` (sessão) → `getMyProgress()` e `getAulaStatus()`
// (`src/lib/progress/progressApi.ts`). Sem sessão, nada pessoal é lido nem
// mostrado (bar S3, A1). Nenhum mock: o `MOCK_USER_PROGRESS` não é
// importado aqui.
//
// Mapeamento de vocabulário (bar S3):
//   backend `concluido`    → "percorrida"   (consumo registrado)
//   backend `em_andamento` → "em leitura"
// Praticado e Demonstrado não têm evento emitido hoje (§9): o estado é dito
// em palavras, nunca 0.

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  getAulaStatus,
  getMyProgress,
  type AulaStatusInfo,
  type MyProgress,
} from '@/lib/progress/progressApi';
import { ALEXANDRIA_MODULES, ALEXANDRIA_TRILHAS } from '@/lib/data/alexandria-trilhas';
import { getAulaDoModulo, idDaAula } from '@/lib/data/alexandria-curriculo';
import type { CurriculumAula, CurriculumModule, CurriculumTrilha } from '@/lib/types/alexandria';
import type { EstadoEstacaoMarca } from '../comum/Marcas';
import { partesDaAula } from '../shell/navegacao';

export type EstadoModulo = 'percorrido' | 'em-curso' | 'por-vir';

export interface PontoDeEstudo {
  aula: CurriculumAula;
  modulo: CurriculumModule;
  trilha: CurriculumTrilha;
  /** Palavra de estado da aula (bar S3). */
  estado: 'em leitura' | 'a seguir' | 'ponto de partida';
  /** Motivo em uma linha (bar A3). */
  motivo: string;
  /** Início da leitura, quando houver. */
  desde: string | null;
}

export type Estudo =
  | { fase: 'carregando' }
  | { fase: 'visitante'; ponto: PontoDeEstudo }
  | { fase: 'indisponivel'; ponto: PontoDeEstudo }
  | {
      fase: 'conta';
      nome: string;
      progresso: MyProgress;
      ponto: PontoDeEstudo;
      semEventos: boolean;
    };

/** Sequência de estudo: todas as aulas extraídas, na ordem do currículo. */
export const SEQUENCIA: { aula: CurriculumAula; modulo: CurriculumModule }[] = (() => {
  const out: { aula: CurriculumAula; modulo: CurriculumModule }[] = [];
  const ordenados = [...ALEXANDRIA_MODULES].sort((a, b) => a.id.localeCompare(b.id));
  for (const m of ordenados) {
    if (m.totalAulas === null) continue;
    for (let n = 1; n <= m.totalAulas; n++) {
      const aula = getAulaDoModulo(m.id, n);
      if (aula) out.push({ aula, modulo: m });
    }
  }
  return out;
})();

const trilhaDe = (m: CurriculumModule) => ALEXANDRIA_TRILHAS.find((t) => t.id === m.trilhaId)!;

function pontoDePartida(motivo: string): PontoDeEstudo {
  const { aula, modulo } = SEQUENCIA[0];
  return { aula, modulo, trilha: trilhaDe(modulo), estado: 'ponto de partida', motivo, desde: null };
}

const MOTIVO_PARTIDA = 'Primeira aula da Trilha I. Nenhuma aula tem pré-requisito obrigatório.';

async function escolherPonto(p: MyProgress, signal: AbortSignal): Promise<PontoDeEstudo> {
  const concluidas = new Set(p.aulasConcluidas);

  // 1) Aula em leitura — a mais recente, pelo início registrado.
  if (p.aulasEmAndamento.length > 0) {
    const candidatas = p.aulasEmAndamento.slice(0, 8);
    const status = await Promise.all(
      candidatas.map((id) => getAulaStatus(id, signal).catch(() => null as AulaStatusInfo | null)),
    );
    let melhor: { id: string; st: AulaStatusInfo | null } | null = null;
    candidatas.forEach((id, i) => {
      const st = status[i];
      if (!melhor || (st && (!melhor.st || st.startedAt > melhor.st.startedAt))) melhor = { id, st };
    });
    const escolhido = melhor as { id: string; st: AulaStatusInfo | null } | null;
    const item = escolhido && SEQUENCIA.find((s) => s.aula.id === escolhido.id);
    if (escolhido && item) {
      const anteriores = Array.from({ length: item.aula.number - 1 }, (_, i) => idDaAula(item.modulo.id, i + 1));
      const feitas = anteriores.filter((id) => concluidas.has(id)).length;
      const mod = `M${item.modulo.id.slice(-2)}`;
      return {
        ...item,
        trilha: trilhaDe(item.modulo),
        estado: 'em leitura',
        desde: escolhido.st?.startedAt ?? null,
        motivo:
          anteriores.length === 0
            ? `Ficou aberta no seu registro; é a primeira aula do ${mod}.`
            : feitas === anteriores.length
              ? `Ficou aberta; as ${feitas} aulas anteriores do ${mod} já estão percorridas.`
              : `Ficou aberta; ${feitas} de ${anteriores.length} aulas anteriores do ${mod} estão percorridas.`,
      };
    }
  }

  // 2) Nada em leitura: a próxima não percorrida depois da última percorrida.
  if (concluidas.size > 0) {
    let ultima = -1;
    SEQUENCIA.forEach((s, i) => {
      if (concluidas.has(s.aula.id)) ultima = i;
    });
    const depois = SEQUENCIA.slice(ultima + 1).find((s) => !concluidas.has(s.aula.id));
    const qualquer = depois ?? SEQUENCIA.find((s) => !concluidas.has(s.aula.id));
    if (qualquer) {
      const ref = SEQUENCIA[ultima];
      const cod = ref ? `${ref.modulo.id.slice(-2)}·A${String(ref.aula.number).padStart(2, '0')}` : '';
      return {
        ...qualquer,
        trilha: trilhaDe(qualquer.modulo),
        estado: 'a seguir',
        desde: null,
        motivo: ref
          ? `Próxima aula não percorrida depois de M${cod}, a última do seu registro.`
          : 'Primeira aula ainda não percorrida no seu registro.',
      };
    }
  }

  return pontoDePartida(MOTIVO_PARTIDA);
}

export function useEstudo(): Estudo {
  const { user, loading } = useAuth();
  const [estudo, setEstudo] = useState<Estudo>({ fase: 'carregando' });

  useEffect(() => {
    if (loading) {
      setEstudo({ fase: 'carregando' });
      return;
    }
    if (!user) {
      setEstudo({ fase: 'visitante', ponto: pontoDePartida(MOTIVO_PARTIDA) });
      return;
    }
    const ctrl = new AbortController();
    setEstudo({ fase: 'carregando' });
    getMyProgress(ctrl.signal)
      .then(async (p) => {
        const ponto = await escolherPonto(p, ctrl.signal);
        if (ctrl.signal.aborted) return;
        setEstudo({
          fase: 'conta',
          nome: user.name,
          progresso: p,
          ponto,
          semEventos: p.aulasConcluidas.length === 0 && p.aulasEmAndamento.length === 0,
        });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setEstudo({
          fase: 'indisponivel',
          ponto: pontoDePartida('Seu registro não respondeu agora; este é o ponto de partida do currículo.'),
        });
      });
    return () => ctrl.abort();
  }, [user, loading]);

  return estudo;
}

// ── Derivações por módulo e trilha ───────────────────────────

export function aulasDoModulo(m: CurriculumModule): string[] {
  if (m.totalAulas === null) return [];
  return Array.from({ length: m.totalAulas }, (_, i) => idDaAula(m.id, i + 1));
}

export function estadoDoModulo(m: CurriculumModule, p: MyProgress | null): EstadoModulo {
  if (!p) return 'por-vir';
  const ids = aulasDoModulo(m);
  if (ids.length === 0) return 'por-vir';
  const conc = new Set(p.aulasConcluidas);
  const and = new Set(p.aulasEmAndamento);
  if (ids.every((id) => conc.has(id))) return 'percorrido';
  if (ids.some((id) => conc.has(id) || and.has(id))) return 'em-curso';
  return 'por-vir';
}

/** ESTADO DE CADA MÓDULO, FONTE ÚNICA (r08).
 *
 *  O Brief da r07 pegou a Home dizendo duas coisas sobre o MESMO módulo na
 *  mesma folha: o selo do globo chamava o M02 de "a seguir" e a faixa de
 *  rota, 900 px abaixo, chamava o mesmo M02 de "a percorrer" — a palavra
 *  que ela usava para todos os outros. Eram duas derivações paralelas do
 *  mesmo registro: o globo distinguia o PRÓXIMO da fila, a faixa não.
 *
 *  Agora há uma só. Quem quiser o estado de um módulo — o letreiro do
 *  globo, a faixa de rota, a legenda da figura — chama esta função e diz a
 *  palavra com `NOME_ESTACAO`. Duas gramáticas para os mesmos seis estados
 *  foi o erro de método que o agente de conferência achou na r07; a
 *  correção é de sistema, não de superfície.
 *
 *  Sem posição registrada (E0/E1) não existe "a seguir": há o ponto de
 *  partida e o resto a percorrer. */
export function estadosDasEstacoes(
  ponto: PontoDeEstudo,
  progresso: MyProgress | null,
  comPosicao: boolean,
): Record<string, EstadoEstacaoMarca> {
  const ordenados = [...ALEXANDRIA_MODULES].sort((a, b) => a.id.localeCompare(b.id));
  const alvo = ponto.modulo.id;
  const out: Record<string, EstadoEstacaoMarca> = {};
  for (const m of ordenados) {
    if (!comPosicao) {
      out[m.id] = m.id === alvo ? 'partida' : 'por-percorrer';
      continue;
    }
    if (m.id === alvo) {
      out[m.id] = 'atual';
      continue;
    }
    const e = estadoDoModulo(m, progresso);
    out[m.id] = e === 'percorrido' ? 'percorrido' : e === 'em-curso' ? 'em-curso' : 'por-percorrer';
  }
  if (comPosicao) {
    const i = ordenados.findIndex((m) => m.id === alvo);
    const seguinte = ordenados.slice(i + 1).find((m) => out[m.id] !== 'percorrido');
    if (seguinte && out[seguinte.id] === 'por-percorrer') out[seguinte.id] = 'a-seguir';
  }
  return out;
}

export interface ContagemTrilha {
  trilha: CurriculumTrilha;
  percorridas: number;
  emLeitura: number;
  total: number | null;
}

export function contagemPorTrilha(p: MyProgress): ContagemTrilha[] {
  return ALEXANDRIA_TRILHAS.map((t) => {
    const doTrilha = (id: string) => {
      const partes = partesDaAula(id);
      return partes ? ALEXANDRIA_MODULES.find((m) => m.id === partes.moduloId)?.trilhaId === t.id : false;
    };
    return {
      trilha: t,
      percorridas: p.aulasConcluidas.filter(doTrilha).length,
      emLeitura: p.aulasEmAndamento.filter(doTrilha).length,
      total: t.totalAulas,
    };
  });
}

/** Estado de cada aula do módulo atual, para o arco de posição da carta. */
export function aulasDoPonto(ponto: PontoDeEstudo, p: MyProgress | null): ('percorrida' | 'atual' | 'por vir')[] {
  const conc = new Set(p?.aulasConcluidas ?? []);
  return aulasDoModulo(ponto.modulo).map((id) =>
    id === ponto.aula.id ? 'atual' : conc.has(id) ? 'percorrida' : 'por vir',
  );
}
