// Atlas da Alexandria v3 — cabeçalho de tempo dos capítulos com série mensal:
// o mês corrente, o botão de percorrer e os momentos que as aulas citam.

import type { ReactNode } from 'react';
import { mesBr } from '@/lib/alexandria/atlas/dados';
import type { VistaDoAtlas } from '@/lib/alexandria/atlas/vistas';
import { ReguaDoTempo } from '../ReguaDoTempo';

interface TempoProps {
  meses: string[];
  mes: number;
  aoMudarMes: (i: number) => void;
  tocando: boolean;
  aoTocar: () => void;
  reduzido: boolean;
  /** Último dia publicado do mês em curso (AAAA-MM-DD). Quando o mês mostrado
   *  é o desse dia, o cabeçalho diz que ele ainda não fechou. */
  parcialAte?: string | null;
  /** o dado do capítulo no mês, em escala de manchete (item 4 da leva 4): com ele, a data desce
   *  a sobretítulo da régua */
  heroi?: ReactNode;
  /** uma linha visível sob a régua (Roraima antes de set/2025, item 7 da leva 4) */
  nota?: ReactNode;
}

/** "mês em curso, até dd/mm" quando o mês mostrado é o do último dia publicado. */
export function textoDoMesParcial(mesMostrado: string, parcialAte: string | null | undefined): string | null {
  if (!parcialAte || parcialAte.slice(0, 7) !== mesMostrado) return null;
  return `mês em curso, até ${parcialAte.slice(8, 10)}/${parcialAte.slice(5, 7)}`;
}

/** Lê series.<nome>.mesCorrenteParcial do índice, campo que pode ainda não existir. */
export function parcialDoIndice(serie: unknown): string | null {
  const p = (serie as { mesCorrenteParcial?: { mes?: string; ultimoDia?: string } | null } | null | undefined)?.mesCorrenteParcial;
  return p?.ultimoDia ?? null;
}

export function CabecaDoTempo({ meses, mes, aoMudarMes, tocando, aoTocar, reduzido, parcialAte, heroi, nota }: TempoProps) {
  const ultimo = meses.length - 1;
  const parcial = textoDoMesParcial(meses[mes], parcialAte);
  return (
    <div className="atl-tempo">
      {heroi ? (
        <>
          {heroi}
          <p className="atl-tempo-data">
            {mesBr(meses[mes])}
            {parcial && <> · {parcial}</>}
          </p>
        </>
      ) : (
        <p className="atl-tempo-mes">
          {mesBr(meses[mes])}
          {parcial && <span className="atl-tempo-sub">{parcial}</span>}
        </p>
      )}
      <ReguaDoTempo valor={mes} min={0} max={ultimo} salto={12} rotulo="Mês" falado={parcial ? `${mesBr(meses[mes])}, ${parcial}` : mesBr(meses[mes])} aoMudar={aoMudarMes} />
      <p className="atl-regua-anos" aria-hidden="true">
        <span>{meses[0].slice(0, 4)}</span>
        <span>{meses[ultimo].slice(0, 4)}</span>
      </p>
      {nota && <p className="atl-tempo-nota">{nota}</p>}
      <div className="atl-tempo-acoes">
        <span className="atl-passos">
          <button type="button" className="atl-passo" onClick={() => aoMudarMes(Math.max(0, mes - 1))} disabled={mes <= 0} aria-label="Mês anterior">
            ‹
          </button>
          <button type="button" className="atl-passo" onClick={() => aoMudarMes(Math.min(ultimo, mes + 1))} disabled={mes >= ultimo} aria-label="Mês seguinte">
            ›
          </button>
        </span>
        {!reduzido && (
          <button type="button" className="atl-tocar" onClick={aoTocar} aria-pressed={tocando}>
            {tocando ? (
              <>
                Pausar <span aria-hidden="true">❚❚</span>
              </>
            ) : mes >= ultimo ? (
              <>
                Percorrer {meses[0].slice(0, 4)}–{meses[ultimo].slice(0, 4)} <span aria-hidden="true">▸</span>
              </>
            ) : (
              <>
                Continuar <span aria-hidden="true">▸</span>
              </>
            )}
          </button>
        )}
        {mes < ultimo && !tocando && (
          <button type="button" className="atl-tocar" onClick={() => aoMudarMes(ultimo)}>
            Ir para {mesBr(meses[ultimo])}
          </button>
        )}
      </div>
    </div>
  );
}

/** Momentos que as aulas citam, ancorados na linha do tempo. Recolhidos por padrão: com 14
 *  itens a lista ocupava metade do painel com o mesmo peso de tudo (relatório painel-e-tita). */
export function MomentosDasAulas({ marcas, aoAbrirVista }: { marcas: VistaDoAtlas[]; aoAbrirVista: (id: string) => void }) {
  if (!marcas.length) return null;
  const ordenadas = marcas.slice().sort((a, b) => (a.momento ?? '').localeCompare(b.momento ?? ''));
  return (
    <details className="atl-grupo atl-momentos-grupo">
      <summary className="atl-momentos-resumo">
        <span className="atl-grupo-titulo">Momentos que as aulas citam</span> <span className="atl-num atl-fraco">{marcas.length}</span>
      </summary>
      <ul className="atl-momentos">
        {ordenadas.map((v) => (
          <li key={v.id}>
            <button type="button" onClick={() => aoAbrirVista(v.id)}>
              <span className="atl-num">{mesBr(v.momento as string)}</span>
              <span>{v.titulo}</span>
              <span className="atl-momento-aula">
                M{v.modulo.slice(-2)} · aula {String(v.aula).padStart(2, '0')}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Roraima entrou no Norte (no SIN) em set/2025: antes disso o mapa não a pinta como Norte, e a
 *  linha visível diz desde quando (item 7 da leva 4). O mês vem do índice (submercados ›
 *  roraimaAParte, publicado pelo construtor a partir do cadastro do ONS). */
export function notaDeRoraima(mesMostrado: string, indice: unknown): string | null {
  const r = (indice as { camadas?: { submercados?: { roraimaAParte?: { primeiroMesNoNorte?: string } } } } | null)?.camadas?.submercados?.roraimaAParte;
  const desde = r?.primeiroMesNoNorte;
  if (!desde || mesMostrado >= desde) return null;
  return `Roraima no Norte a partir de ${mesBr(desde).replace(' ', '/')}; antes disso ela não estava ligada ao sistema interligado.`;
}
