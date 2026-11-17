// A lista de medalhas de uma conta, montada uma vez para o Perfil e o Início.
// CONCLUSÃO vem gravada (`badge_award`, catálogo em progresso/conquistas.ts);
// HÁBITO e EXPLORAÇÃO são derivadas do log (perfil/regras.ts).

import { indice } from '@/lib/alexandria/indice';
import { estadoDasConquistasDeConclusao } from '@/lib/progress/badgeRules';
import type { MyProgress } from '@/lib/progress/progressApi';
import { medalhasDerivadas, type DiaDeEstudo, type FamiliaDeMedalha, type PrimeiraVez } from '@/lib/alexandria/perfil/regras';
import type { MotivoDaMedalha } from './Medalha';

export interface MedalhaNaTela {
  id: string;
  familia: FamiliaDeMedalha;
  motivo: MotivoDaMedalha;
  nome: string;
  criterio: string;
  obtida: boolean;
  /** ISO ou AAAA-MM-DD; null quando obtida sem registro de data, ou não obtida. */
  data: string | null;
  falta: string | null;
}

export const ROTULO_FAMILIA: Record<FamiliaDeMedalha, string> = {
  conclusao: 'Conclusão',
  habito: 'Hábito',
  exploracao: 'Exploração',
};

const ROMANO_DA_TRILHA = new Map(indice.trilhas.map((t) => [t.id, t.romano]));
const MODULO_POR_NUMERO = new Map(indice.modulos.map((m) => [m.numero, m]));

export function territorioDaAula(aulaId: string): string | null {
  const m = /^aula-(\d{2})-\d{2}$/.exec(aulaId);
  const modulo = m ? MODULO_POR_NUMERO.get(Number(m[1])) : null;
  return modulo?.trilhaId ? ROMANO_DA_TRILHA.get(modulo.trilhaId) ?? null : null;
}

function motivoDaConclusao(id: string): MotivoDaMedalha {
  if (id === 'conclusao.primeira-aula') return 'ponto';
  if (id.startsWith('conclusao.modulo.')) return 'estacao';
  if (id === 'conclusao.curriculo') return 'curriculo';
  if (id.startsWith('conclusao.contagem.')) return 'contagem';
  return 'territorio';
}

function motivoDerivado(id: string): MotivoDaMedalha {
  if (id.startsWith('habito.sequencia')) return 'corrida';
  if (id.startsWith('habito.dias')) return 'calendario';
  if (id.startsWith('exploracao.instrumentos')) return 'instrumento';
  return 'rosa';
}

export function listaDeMedalhas(
  progresso: MyProgress,
  perfil: { dias: readonly DiaDeEstudo[]; primeiras: readonly PrimeiraVez[] } | null,
): MedalhaNaTela[] {
  const conclusao: MedalhaNaTela[] = estadoDasConquistasDeConclusao(progresso)
    .filter((c) => c.avaliacao.estado !== 'indisponivel')
    .map((c) => ({
      id: c.conquista.id,
      familia: 'conclusao',
      motivo: motivoDaConclusao(c.conquista.id),
      nome: c.conquista.nome,
      criterio: c.conquista.criterio,
      obtida: c.avaliacao.estado === 'obtida',
      data: c.registradaEm,
      falta:
        c.avaliacao.estado === 'nao-obtida' && c.avaliacao.total != null && c.avaliacao.feitas != null && c.avaliacao.total > 1
          ? `${c.avaliacao.feitas} de ${c.avaliacao.total}`
          : null,
    }));
  const derivadas: MedalhaNaTela[] = perfil
    ? medalhasDerivadas({ dias: perfil.dias, primeiras: perfil.primeiras, territorioDaAula }).map((m) => ({
        id: m.id,
        familia: m.familia,
        motivo: motivoDerivado(m.id),
        nome: m.nome,
        criterio: m.criterio,
        obtida: m.obtidaEm !== null,
        data: m.obtidaEm,
        falta: m.obtidaEm === null && m.alvo > 1 ? `${m.feito} de ${m.alvo}` : null,
      }))
    : [];
  return [...conclusao, ...derivadas];
}

/** Obtidas, mais recente primeiro (as sem data vão para o fim). */
export const obtidasPorData = (lista: MedalhaNaTela[]): MedalhaNaTela[] =>
  lista.filter((m) => m.obtida).sort((a, b) => (b.data ?? '').localeCompare(a.data ?? ''));
