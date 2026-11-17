// emitirPratica.ts — a única porta de saída do eixo Praticado.
//
// `instrumento_usado` e `exercicio_respondido` nunca foram emitidos por
// arquivo nenhum do front até esta wave. Agora saem SÓ por aqui, e esta
// porta garante três coisas que o backend não pode garantir sozinho:
//
//   1. `metadata.aulaId` sempre presente. Sem ele, a tentativa vira
//      `eventosSemAulaVinculada` e o Praticado da aula nunca a vê — então,
//      sem `aulaId`, o evento NÃO sai (`motivo: 'invalido'`).
//   2. Sem conta, nada é enviado e nada é guardado. Nem fila local, nem
//      `localStorage`: progresso fica atrás do cadastro (decisão do
//      Founder). O ato continua funcionando na página; só o registro não.
//   3. Falha de rede é best-effort: loga e devolve `falha-de-rede`. Nunca
//      lança para dentro da aula, nunca bloqueia o aluno.

import { recordEvent, type ProgressEventResponse } from '@/lib/progress/progressApi';
import {
  montarMetadataDePratica,
  type EstadoDaConta,
  type EventoDePratica,
} from './progresso/regras';

export type { EventoDePratica, GeneroDoAto, ValorDeControle } from './progresso/regras';

export type ResultadoDeEmissao =
  | { enviado: true; evento: ProgressEventResponse }
  | { enviado: false; motivo: 'sem-conta' | 'verificando-conta' | 'invalido' }
  | { enviado: false; motivo: 'falha-de-rede'; erro: unknown };

export async function emitirPratica(
  evento: EventoDePratica,
  contexto: { conta: EstadoDaConta },
): Promise<ResultadoDeEmissao> {
  if (contexto.conta === 'visitante') return { enviado: false, motivo: 'sem-conta' };
  if (contexto.conta === 'carregando') return { enviado: false, motivo: 'verificando-conta' };

  const metadata = montarMetadataDePratica(evento);
  if (!metadata) {
    if (import.meta.env.DEV) {
      console.warn('[alexandria] prática sem aulaId ou entidade — não enviada', evento);
    }
    return { enviado: false, motivo: 'invalido' };
  }

  try {
    const r = await recordEvent(evento.tipo, evento.entidadeId, metadata);
    return { enviado: true, evento: r };
  } catch (erro) {
    console.error(`[alexandria] falha ao registrar ${evento.tipo}`, evento.entidadeId, erro);
    return { enviado: false, motivo: 'falha-de-rede', erro };
  }
}
