// Atlas da Alexandria v3 — capítulo "As trocas": o intercâmbio líquido entre os
// quatro subsistemas, média de cada mês, de 2000 até hoje.

import type { CSSProperties } from 'react';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { dataBr, inteiro } from '@/lib/alexandria/atlas/dados';
import { PALETA } from '@/lib/alexandria/atlas/estilo';
import { ROTULO_SUBSISTEMA, type IndiceDoAtlas, type SerieIntercambio, type Subsistema } from '@/lib/alexandria/atlas/tipos';
import type { VistaDoAtlas } from '@/lib/alexandria/atlas/vistas';
import { FaixasDoAno } from '../graficos';
import type { Troca } from '../mapa/controleDoMapa';
import { ComoLer, NOTA_RORAIMA } from './PainelRede';
import { CabecaDoTempo, MomentosDasAulas, notaDeRoraima, parcialDoIndice, textoDoMesParcial } from './Tempo';

/** Os quatro elos entre subsistemas, na ordem em que o painel os lista. */
const ELOS: [Subsistema, Subsistema][] = [
  ['N', 'NE'],
  ['N', 'SE'],
  ['NE', 'SE'],
  ['SE', 'S'],
];

/** Fluxo líquido A→B no mês. O ONS publica cada elo num sentido, com sinal
 *  (positivo = da origem para o destino); em alguns anos o mesmo elo aparece
 *  com o par invertido. Medido no arquivo de 2024: NE→SE + NE→N fecha com a
 *  coluna de intercâmbio do balanço do Nordeste na mesma hora. */
function liquido(serie: SerieIntercambio, a: Subsistema, b: Subsistema, i: number): number | null {
  const ida = serie.pares[`${a}>${b}`]?.[i] ?? null;
  const volta = serie.pares[`${b}>${a}`]?.[i] ?? null;
  if (ida == null && volta == null) return null;
  return (ida ?? 0) - (volta ?? 0);
}

export function trocasDoMes(serie: SerieIntercambio, i: number): Troca[] {
  const saida: Troca[] = [];
  for (const [a, b] of ELOS) {
    const v = liquido(serie, a, b, i);
    if (v == null || v === 0) continue;
    saida.push(v > 0 ? { de: a, para: b, mw: Math.round(v) } : { de: b, para: a, mw: Math.round(-v) });
  }
  return saida;
}

interface PainelTrocasProps {
  serie: SerieIntercambio | null;
  indice: IndiceDoAtlas | null;
  mes: number;
  aoMudarMes: (i: number) => void;
  tocando: boolean;
  aoTocar: () => void;
  reduzido: boolean;
  modo: ModoV3;
  marcas: VistaDoAtlas[];
  aoAbrirVista: (id: string) => void;
  /** último dia publicado do mês em curso (AAAA-MM-DD); se não vier, é lido do índice */
  parcialAte?: string | null;
}

/** Cor de cada elo. Se a paleta do mapa oferecer `elo` (por chave "N>NE"…),
 *  o gráfico usa a mesma cor que o mapa; senão, a escolha anterior. */
export function coresDosElos(modo: ModoV3): string[] {
  const p = PALETA[modo];
  const elo = (p as unknown as { elo?: Partial<Record<string, string>> }).elo;
  const anteriores = [p.linha.ca345, p.categoria.solar, p.categoria.nuclear, p.categoria.eolica];
  return ELOS.map(([a, b], k) => elo?.[`${a}>${b}`] ?? anteriores[k]);
}

export function PainelTrocas({ serie, indice, mes, aoMudarMes, tocando, aoTocar, reduzido, modo, marcas, aoAbrirVista, parcialAte }: PainelTrocasProps) {
  if (!serie) return <p className="atl-carregando">Carregando a série de intercâmbio…</p>;
  const fonte = indice?.series.intercambio.fontes[0];
  const cores = coresDosElos(modo);
  const parcial = parcialAte ?? parcialDoIndice(indice?.series.intercambio);
  const emCurso = textoDoMesParcial(serie.meses[serie.meses.length - 1], parcial);
  const series = ELOS.map(([a, b], k) => ({
    chave: `${a}-${b}`,
    rotulo: `${a} → ${b}`,
    cor: cores[k],
    valores: serie.meses.map((_, i) => liquido(serie, a, b, i)),
  }));
  let teto = 1000;
  for (const s of series) for (const v of s.valores) if (v != null && Math.abs(v) > teto) teto = Math.abs(v);
  teto = Math.ceil(teto / 1000) * 1000;

  // o número grande é o maior intercâmbio do mês (item 4 da leva 4), com o sentido dito uma vez
  const maior = trocasDoMes(serie, mes).reduce<Troca | null>((a, t) => (!a || t.mw > a.mw ? t : a), null);
  return (
    <div className="atl-trocas">
      <CabecaDoTempo
        meses={serie.meses}
        mes={mes}
        aoMudarMes={aoMudarMes}
        tocando={tocando}
        aoTocar={aoTocar}
        reduzido={reduzido}
        parcialAte={parcial}
        nota={notaDeRoraima(serie.meses[mes], indice)}
        heroi={
          <div className="atl-tempo-heroi">
            <p className="atl-tempo-heroi-rotulo">O maior intercâmbio do mês</p>
            <p className="atl-tempo-heroi-valor">
              {maior ? <>{inteiro(maior.mw)}<span className="atl-tempo-heroi-unidade">MW médios</span></> : <span className="atl-ausente">nenhum fluxo líquido na fonte</span>}
            </p>
            {maior && <p className="atl-tempo-heroi-linha">do {ROTULO_SUBSISTEMA[maior.de]} para o {ROTULO_SUBSISTEMA[maior.para]}</p>}
          </div>
        }
      />

      <ul className="atl-elos">
        {ELOS.map(([a, b], k) => {
          const v = liquido(serie, a, b, mes);
          const de = v != null && v < 0 ? b : a;
          const para = v != null && v < 0 ? a : b;
          return (
            <li key={`${a}${b}`}>
              <span className="atl-traco" style={{ '--cor': cores[k] } as CSSProperties} aria-hidden="true" />
              <span className="atl-elo-sentido">{v == null ? `${ROTULO_SUBSISTEMA[a]} e ${ROTULO_SUBSISTEMA[b]}` : `${ROTULO_SUBSISTEMA[de]} → ${ROTULO_SUBSISTEMA[para]}`}</span>
              <span className="atl-elo-valor">{v == null ? 'sem dado' : `${inteiro(Math.abs(v))} MW médios`}</span>
            </li>
          );
        })}
      </ul>

      <FaixasDoAno
        meses={serie.meses}
        indice={mes}
        aoMudar={aoMudarMes}
        series={series}
        dominio={[-teto, teto]}
        referencia={0}
        valorNoTitulo={false}
        formato={(v) => `${v < 0 ? '−' : ''}${inteiro(Math.abs(v))} MW`}
        descricao={`Intercâmbio líquido de cada elo em ${serie.meses[mes].slice(0, 4)}, mês a mês, contra a faixa de ${serie.meses[0].slice(0, 4)} a ${serie.meses[serie.meses.length - 1].slice(0, 4)}. Clique num mês para escolhê-lo.`}
      />
      <p className="atl-legenda-linha">Acima da linha do zero, no sentido do nome do quadro; abaixo, no contrário · setas do mapa são esquema</p>
      {fonte && (
        <p className="atl-fonte-linha">
          {fonte.orgao}, {fonte.conjunto.replace('Dados Abertos · ', '')} — acesso <span className="atl-num">{dataBr(fonte.acesso)}</span>
        </p>
      )}
      <ComoLer>
        <p>No gráfico, cada elo tem um sentido de referência: Norte → Nordeste, Norte → Sudeste, Nordeste → Sudeste e Sudeste → Sul. Acima do zero, a energia vai nesse sentido; abaixo, no contrário.</p>
        <p>
          As setas do mapa são um esquema: ligam o centro de um subsistema ao de outro e engrossam com o fluxo. Ao fundo estão as linhas de 500 kV ou mais e os elos de corrente contínua em operação; interligações de tensão menor não são desenhadas neste capítulo.
        </p>
        <p>Média de cada mês dos valores horários{emCurso ? `; o último mês é parcial (${emCurso})` : ''}.</p>
        <p>{NOTA_RORAIMA}</p>
      </ComoLer>

      <MomentosDasAulas marcas={marcas} aoAbrirVista={aoAbrirVista} />
    </div>
  );
}
