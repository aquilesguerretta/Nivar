// Atlas da Alexandria v3 — as vistas: um enquadramento do mapa que ilustra uma
// frase de uma aula. O arquivo completo (câmera, destaque, trecho) é gerado por
// tools/alexandria-atlas/gerar-vistas.mjs e buscado só pela página do Atlas.

import type { CamadaId, CapituloId, Subsistema } from './tipos';

export interface VistaDoAtlas {
  id: string;
  /** 'modulo-08' */
  modulo: string;
  aula: number;
  /** rótulo de interface (não é conteúdo de aula) */
  titulo: string;
  capitulo: CapituloId;
  camera: { limites?: [number, number, number, number]; centro?: [number, number]; zoom?: number; inclinacao?: number; rumo?: number };
  camadas: CamadaId[];
  destaque: {
    usinas?: string[];
    linhas?: string[];
    subestacoes?: string[];
    reservatorios?: string[];
    submercados?: Subsistema[];
    bacias?: string[];
    paises?: string[];
    /** id dos ativos de gás e petróleo da ANP (prefixos gd-, refinaria-, gnl-, upgn-, terminal-, campo-, bloco-, bacia-sed-, e 'presal') */
    combustivel?: string[];
  };
  satelite: boolean;
  /** 'AAAA-MM' nos capítulos com tempo */
  momento: string | null;
  /** citação literal da aula, já sem marcação; `arquivo` e `linha` dizem de onde saiu */
  trecho: { texto: string; arquivo: string; linha: number };
  /** quando o mapa mostra menos do que a frase diz */
  nota: string | null;
}

let cache: Promise<VistaDoAtlas[]> | null = null;

export function carregarVistas(): Promise<VistaDoAtlas[]> {
  if (!cache) {
    cache = fetch('/alexandria/atlas/vistas.json')
      .then((r) => {
        if (!r.ok) throw new Error(`vistas.json respondeu ${r.status}`);
        return r.json() as Promise<{ vistas: VistaDoAtlas[] }>;
      })
      .then((d) => d.vistas);
    cache.catch(() => (cache = null));
  }
  return cache;
}
