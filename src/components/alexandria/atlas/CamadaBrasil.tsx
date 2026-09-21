// CamadaBrasil — os quatro submercados do SIN sobre a mesma esfera
// (Wave 36). Fecha a pendência declarada em contorno tracejado desde
// a Wave 27.
//
// ── O QUE ESTA CAMADA TEM, E O QUE ELA NÃO TEM ───────────────────────
// TEM: geometria REAL (o GeoJSON que o ARCHITECT construiu na Portal
// BR Wave 2, malha por UF do IBGE dissolvida pela classificação
// CCEE/ONS) e contexto qualitativo LITERAL, extraído da tabela do
// § do Módulo 08 do próprio currículo (alexandria-modulo-08-content.ts
// L537, extração da LYCEUM Wave 32).
//
// NÃO TEM: nenhum número por submercado. Confirmado medindo o endpoint
// real — o perfil do Brasil traz `fuelMix` NACIONAL e mais nada
// regional. Percentual de matriz por submercado exigiria ingestão nova
// (ONS/CCEE), que é wave do Cursor, não desta. Inventar aqui seria
// exatamente o que o Atlas inteiro existe para não fazer.
//
// ── RORAIMA ──────────────────────────────────────────────────────────
// Aparece no contorno do Brasil e NÃO recebe submercado. Não é
// esquecimento: a definição CCEE documentada não a atribui a nenhum
// dos quatro, e o `ufsIbge` do GeoJSON confirma — o código 14 não
// consta em nenhuma das quatro listas. Mesma decisão que o ARCHITECT
// registrou no Portal BR, pela mesma razão.

import { useEffect, useState } from 'react';
import type { Feature, Geometry } from 'geojson';

/** Contexto por submercado — TEXTO LITERAL da tabela do Módulo 08.
 *  Nenhuma frase redigida aqui; nenhum número em lugar nenhum. */
export interface ContextoSubmercado {
  caracteristica: string;
  papel: string;
}

export const CONTEXTO_SUBMERCADO: Record<string, ContextoSubmercado> = {
  sudesteCentroOeste: {
    caracteristica:
      'Maior concentração de carga e de reservatórios; indústria e centros urbanos',
    papel:
      'Principal centro de consumo e de armazenamento hidráulico; é o destino da maioria dos intercâmbios',
  },
  sul: {
    caracteristica:
      'Hidrologia própria e descolada das demais, eólica relevante, carga industrial e agrícola forte',
    papel:
      'Alterna importação e exportação conforme água, vento e carga — o mais bidirecional dos quatro',
  },
  nordeste: {
    caracteristica:
      'Grande expansão eólica e solar; carga menor que o potencial de oferta em vários períodos',
    papel: 'Exportador renovável e foco dos limites de escoamento e do corte de geração',
  },
  norte: {
    caracteristica:
      "Grandes hidrelétricas a fio d'água, longas distâncias, integração amazônica complexa",
    papel: 'Exporta blocos sazonais e conecta empreendimentos remotos',
  },
};

export interface PropsSubmercado {
  /** Marca que distingue esta feature das de país no mesmo array de
   *  polígonos do globo. */
  ehSubmercado: true;
  id: string;
  nome: string;
  sigla: string;
  ufsIbge: string[];
}

export type FeatureSubmercado = Feature<Geometry, PropsSubmercado>;

interface RespostaGeo {
  type: string;
  features: Array<Feature<Geometry, { id: string; nome: string; sigla: string; ufsIbge: string[] }>>;
}

let cache: Promise<FeatureSubmercado[]> | null = null;

/** Carrega os quatro submercados uma vez por sessão. Geometria REAL —
 *  nunca gerada, nunca aproximada. */
export function carregarSubmercados(): Promise<FeatureSubmercado[]> {
  if (!cache) {
    cache = fetch('/br/submercados.geojson')
      .then((r) => {
        if (!r.ok) throw new Error(`submercados.geojson respondeu ${r.status}`);
        return r.json() as Promise<RespostaGeo>;
      })
      .then((g) =>
        g.features.map((f) => ({
          ...f,
          properties: { ...f.properties, ehSubmercado: true as const },
        })),
      )
      .catch((e) => {
        cache = null;
        throw e;
      });
  }
  return cache;
}

export function useSubmercados(ativo: boolean): FeatureSubmercado[] | null {
  const [feats, setFeats] = useState<FeatureSubmercado[] | null>(null);
  useEffect(() => {
    if (!ativo) return;
    let vivo = true;
    carregarSubmercados()
      .then((f) => { if (vivo) setFeats(f); })
      .catch(() => { /* o painel declara a ausência */ });
    return () => { vivo = false; };
  }, [ativo]);
  return feats;
}

/** Cor de cada submercado — quatro tons do sistema, distintos entre si
 *  e todos legíveis sobre o navy da esfera. Não codificam matriz
 *  (não temos o dado): são identidade de região, como as cores de um
 *  mapa político impresso.
 *
 *  OPACAS de propósito: a fronteira é desenhada como fat line (traço
 *  com espessura angular), e o react-globe.gl declara que "transparent
 *  colors are not supported in Fat Lines with set width" — com rgba
 *  o traço simplesmente não aparecia, medido. */
/** Ponto dentro de anel, por cruzamento de raio. `anel` é [lng, lat][]. */
function dentroDoAnel(lng: number, lat: number, anel: number[][]): boolean {
  let dentro = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const [xi, yi] = anel[i];
    const [xj, yj] = anel[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      dentro = !dentro;
    }
  }
  return dentro;
}

/**
 * Qual submercado contém este ponto — ou null.
 *
 * Hit-testing GEODÉSICO, sobre a geometria real, em vez de um mesh
 * invisível na cena. Duas razões medidas, as duas descobertas tentando
 * o caminho do mesh primeiro:
 *
 *  1. A tampa transparente do polígono ESCREVE no depth buffer e
 *     ocultava as quatro fronteiras desenhadas — provado por
 *     isolamento (sem os polígonos na cena, o traço volta).
 *  2. A triangulação por earcut destes polígonos é errada nas três
 *     resoluções de curvatura testadas, então o mesh acertava a região
 *     VIZINHA: um ponto do Nordeste devolvia "norte". O hit por
 *     geometria não tem esse erro — usa os mesmos vértices do IBGE que
 *     desenham a fronteira.
 *
 * Furo de anel é respeitado: o primeiro anel de cada parte é a casca,
 * os seguintes são buracos.
 */
export function submercadoEm(
  lng: number,
  lat: number,
  feats: FeatureSubmercado[],
): string | null {
  for (const f of feats) {
    const g = f.geometry as
      | { type: 'Polygon'; coordinates: number[][][] }
      | { type: 'MultiPolygon'; coordinates: number[][][][] };
    const partes = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
    for (const parte of partes) {
      if (parte.length === 0 || !dentroDoAnel(lng, lat, parte[0])) continue;
      const emBuraco = parte.slice(1).some((furo) => dentroDoAnel(lng, lat, furo));
      if (!emBuraco) return f.properties.id;
    }
  }
  return null;
}

export const COR_SUBMERCADO: Record<string, string> = {
  norte: '#8E9E6B',              // A2.olivaSobreNavy
  nordeste: '#CBAA6E',           // A2.ouroSobreNavy
  sudesteCentroOeste: '#C2683C', // A2.terracotaClara
  sul: '#5C7A99',                // azul-aço, o mesmo da eólica
};
