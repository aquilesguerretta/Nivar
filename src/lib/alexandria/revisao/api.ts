// api.ts — a leitura e a escrita da revisão espaçada.
//
// LEITURA: `GET /api/progress/revisao` devolve as tentativas de exercício da
// conta, cada uma com o dia no fuso do aluno, e o "hoje" nesse mesmo fuso.
// Caminho relativo de propósito: o cookie de sessão é `SameSite=lax` e só
// viaja no mesmo site (AGENTS.md, topologia).
//
// ESCRITA: uma revisão É uma tentativa — o aluno escreve a resposta antes de
// ver a referência — e sai como `exercicio_respondido`, igual à da aula, com
// as garantias de `emitirPratica` (sem conta nada sai; sem `aulaId` nada sai).
// O que a revisão acrescenta vai no `metadata`, sem tipo de evento novo e
// sem migration: `origem: 'revisao'` e `autoavaliacao`. É UM evento por item
// revisto, enviado quando o aluno fecha o item — julgar a própria resposta
// não vira uma segunda tentativa, e o Praticado não infla.

import { fusoDoNavegador, recordEvent } from '@/lib/progress/progressApi';
import { montarMetadataDePratica, type EstadoDaConta } from '../progresso/regras';
import type { Resultado, TentativaDoLog } from './agenda';

export interface TentativasDeRevisao {
  fuso: string;
  /** "Hoje" no fuso do aluno, `YYYY-MM-DD`, dito pelo servidor. */
  diaDeReferencia: string;
  semRegistro: boolean;
  /** O servidor devolveu só as tentativas mais recentes (teto declarado). */
  truncado: boolean;
  tentativas: TentativaDoLog[];
}

export class RevisaoIndisponivel extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'RevisaoIndisponivel';
    this.status = status;
  }
}

export async function lerTentativasDeRevisao(signal?: AbortSignal): Promise<TentativasDeRevisao> {
  const tz = fusoDoNavegador();
  const url = tz ? `/api/progress/revisao?tz=${encodeURIComponent(tz)}` : '/api/progress/revisao';
  let res: Response;
  try {
    res = await fetch(url, { signal, credentials: 'include', headers: { Accept: 'application/json' } });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    throw new RevisaoIndisponivel(err instanceof Error ? err.message : 'Falha de rede.', 0);
  }
  if (!res.ok) throw new RevisaoIndisponivel(`HTTP ${res.status}`, res.status);
  const corpo = (await res.json()) as { data?: TentativasDeRevisao };
  const d = corpo?.data;
  if (!d || typeof d.diaDeReferencia !== 'string' || !Array.isArray(d.tentativas)) {
    throw new RevisaoIndisponivel('Resposta fora do contrato.', res.status);
  }
  return d;
}

export interface RevisaoFeita {
  entidadeId: string;
  aulaId: string;
  moduloId: string;
  /** O que o aluno escreveu (ou o texto da alternativa escolhida). */
  resposta: string;
  /** Autoavaliação, nos itens abertos. Escolha: `null` — o julgamento é a
   *  comparação com a alternativa, que a regra refaz a partir da resposta. */
  autoavaliacao: Resultado;
}

export type ResultadoDoEnvio = 'enviado' | 'sem-conta' | 'invalido' | 'falhou';

export async function registrarRevisao(r: RevisaoFeita, conta: EstadoDaConta): Promise<ResultadoDoEnvio> {
  if (conta !== 'conta') return 'sem-conta';
  const base = montarMetadataDePratica({
    tipo: 'exercicio_respondido',
    entidadeId: r.entidadeId,
    aulaId: r.aulaId,
    moduloId: r.moduloId,
    ato: 'exercicio',
    resposta: r.resposta,
    // A resposta foi escrita com a referência fora da tela.
    antesDaReferencia: true,
  });
  if (!base) return 'invalido';
  const metadata = { ...base, origem: 'revisao', ...(r.autoavaliacao ? { autoavaliacao: r.autoavaliacao } : {}) };
  try {
    await recordEvent('exercicio_respondido', r.entidadeId, metadata, fusoDoNavegador());
    return 'enviado';
  } catch (err) {
    console.error('[alexandria] falha ao registrar a revisão', r.entidadeId, err);
    return 'falhou';
  }
}
