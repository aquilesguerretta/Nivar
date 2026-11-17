// Atlas da Alexandria v3 — o mapa como componente React.
//
// Este arquivo só faz a ponte: cria o ControleDoMapa uma vez, repassa o estado
// a cada render e expõe a câmera por ref. Toda regra de desenho mora em
// controleDoMapa.ts.

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { AtivoSelecionado, TipoDeAtivo } from '@/lib/alexandria/atlas/tipos';
import { ControleDoMapa, type CameraAlvo, type EstadoDoMapa, type GloboNaTela, type Pairado } from './controleDoMapa';

export interface MapaAtlasRef {
  voarPara: (alvo: CameraAlvo, seco?: boolean) => void;
  enquadrar: (sel: AtivoSelecionado) => void;
  /** desliza a câmera até o ponto sair de baixo da ficha ou da folha */
  manterVisivel: (lngLat: [number, number], tipo?: TipoDeAtivo) => void;
  relevo3d: (ligar: boolean) => void;
  aproximar: (delta: number) => void;
  inclinar: () => void;
  norte: () => void;
  contar: () => Record<string, number>;
  /** gira a câmera (graus) de forma contínua: usado para medir FPS em movimento */
  girar: (graus: number, duracao: number) => void;
  /** [oeste, sul, leste, norte] da área livre do mapa (sem os painéis); null antes de montar ou com o globo inteiro na tela */
  limitesDaTela: () => [number, number, number, number] | null;
  /** a mesma área livre como anel [lon, lat] no chão; null de cima e sem rumo (vale a caixa) */
  poligonoDaTela: () => [number, number][] | null;
  /** assina o globo na tela, quadro a quadro (a gravura do Titã); devolve o cancelamento */
  seguirGlobo: (f: (g: GloboNaTela | null) => void) => () => void;
  /** "O comércio": metade das âncoras das URFs na área útil e na face visível do globo (A2.3) */
  comercioBrasilNaTela: () => boolean;
  /** o número do pedido de câmera mais novo: o que a página agenda para depois de um voo só vale
   *  se nenhum pedido mais novo chegou (leva 5, câmera intermitente) */
  geracaoDaCamera: () => number;
  /** a câmera está se movendo agora */
  cameraEmMovimento: () => boolean;
}

interface MapaAtlasProps {
  estado: EstadoDoMapa;
  cameraInicial: CameraAlvo | null;
  aoSelecionar: (a: AtivoSelecionado | null) => void;
  aoPairar: (p: Pairado | null) => void;
  aoMoverCamera: (c: { zoom: number; centro: [number, number]; inclinacao: number; rumo: number }) => void;
  aoFicarPronto: (m: { msAtePronto: number }) => void;
  aoFalhar: (mensagem: string) => void;
  /** a câmera assentou (moveend), com os limites da área livre naquele instante */
  aoAssentar?: (c: { limites: [number, number, number, number] | null; poligono: [number, number][] | null; zoom: number }) => void;
}

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

export const MapaAtlas = forwardRef<MapaAtlasRef, MapaAtlasProps>(function MapaAtlas(
  { estado, cameraInicial, aoSelecionar, aoPairar, aoMoverCamera, aoFicarPronto, aoFalhar, aoAssentar },
  ref,
) {
  const caixa = useRef<HTMLDivElement | null>(null);
  const controle = useRef<ControleDoMapa | null>(null);
  // os retornos mudam de identidade a cada render; o controle chama sempre o mais novo
  const retornos = useRef({ aoSelecionar, aoPairar, aoMoverCamera, aoFicarPronto, aoFalhar, aoAssentar });
  retornos.current = { aoSelecionar, aoPairar, aoMoverCamera, aoFicarPronto, aoFalhar, aoAssentar };

  useEffect(() => {
    if (!caixa.current) return;
    if (!TOKEN) {
      retornos.current.aoFalhar('O mapa precisa da chave do Mapbox (VITE_MAPBOX_TOKEN), que não está configurada neste ambiente.');
      return;
    }
    let c: ControleDoMapa;
    try {
      c = new ControleDoMapa(
        caixa.current,
        TOKEN,
        estado,
        {
          aoSelecionar: (a) => retornos.current.aoSelecionar(a),
          aoPairar: (p) => retornos.current.aoPairar(p),
          aoMoverCamera: (cam) => retornos.current.aoMoverCamera({ ...cam, inclinacao: c.mapa.getPitch(), rumo: c.mapa.getBearing() }),
          aoFicarPronto: (m) => retornos.current.aoFicarPronto(m),
          aoFalhar: (m) => retornos.current.aoFalhar(m),
          aoAssentar: (a) => retornos.current.aoAssentar?.(a),
        },
        cameraInicial,
      );
    } catch (e) {
      // WebGL indisponível (navegador antigo, GPU bloqueada): o Atlas diz, não quebra a página
      retornos.current.aoFalhar(e instanceof Error ? e.message : 'Este navegador não conseguiu iniciar o mapa.');
      return;
    }
    controle.current = c;
    const obs = new ResizeObserver(() => c.redimensionar());
    obs.observe(caixa.current);
    return () => {
      obs.disconnect();
      controle.current = null;
      c.destruir();
    };
    // o mapa nasce uma vez; o estado seguinte chega pelo efeito abaixo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    controle.current?.atualizar(estado);
  }, [estado]);

  useImperativeHandle(
    ref,
    () => ({
      voarPara: (alvo, seco) => controle.current?.voarPara(alvo, seco),
      enquadrar: (sel) => controle.current?.enquadrar(sel),
      manterVisivel: (lngLat, tipo) => controle.current?.manterVisivel(lngLat, tipo),
      relevo3d: (ligar) => controle.current?.relevo3d(ligar),
      // os botões passam pelo controle: contam como gesto do leitor (o pouso inicial não os desfaz)
      aproximar: (delta) => {
        const c = controle.current;
        // critico-celular 3: em torno do último selecionado, enquanto ele estiver na área livre
        if (c) c.moverPorBotao({ zoom: c.mapa.getZoom() + delta, duration: 300, ...c.ancoraDoZoom() });
      },
      // na escala do Titã leva ao Brasil já inclinado (A1.4); fora dela alterna 0° ↔ 55°
      inclinar: () => controle.current?.inclinarPorBotao(),
      norte: () => {
        const c = controle.current;
        if (c) c.moverPorBotao({ bearing: 0, pitch: 0, duration: 600 });
      },
      contar: () => controle.current?.contarDesenhadas() ?? {},
      limitesDaTela: () => controle.current?.limitesDaTela() ?? null,
      poligonoDaTela: () => controle.current?.poligonoDaTela() ?? null,
      comercioBrasilNaTela: () => controle.current?.comercio.brasilNaTela() ?? true,
      geracaoDaCamera: () => controle.current?.geracao() ?? 0,
      cameraEmMovimento: () => controle.current?.cameraEmMovimento() ?? false,
      seguirGlobo: (f) => {
        // o controle nasce no efeito de montagem, depois do primeiro render dos filhos
        const c = controle.current;
        if (c) return c.seguirGlobo(f);
        let fim: (() => void) | null = null;
        let vivo = true;
        const q = requestAnimationFrame(() => {
          if (vivo && controle.current) fim = controle.current.seguirGlobo(f);
        });
        return () => {
          vivo = false;
          cancelAnimationFrame(q);
          fim?.();
        };
      },
      girar: (graus, duracao) => {
        const m = controle.current?.mapa;
        if (m) m.easeTo({ bearing: m.getBearing() + graus, duration: duracao, easing: (x) => x, essential: true });
      },
    }),
    [],
  );

  return <div ref={caixa} className="atl-mapa" data-testid="atlas-mapa" />;
});
