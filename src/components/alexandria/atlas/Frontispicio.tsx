// Atlas da Alexandria v3 — o frontispício: o Titã que segura o globo.
//
// A gravura vai POR CIMA do mapa (o espaço do Mapbox é pintado de papel, então ela não pode
// ficar atrás) e uma máscara circular abre o lugar do globo: as mãos, que entram ~1% do raio no
// globo, ficam cortadas no limbo, segurando-o. Ela segue o globo quadro a quadro pelo
// controle (`seguirGlobo`: centro projetado e raio do limbo) e some pela distância ao zoom de
// repouso da composição e pela inclinação. Não recebe ponteiro; fica abaixo da busca, dos
// controles, da ficha e do rodapé de fontes. O estilo é escrito direto no elemento, sem
// render do React por quadro.

import { useEffect, useRef, type RefObject } from 'react';
import { GRAVURA_DO_TITA, type GloboNaTela } from './mapa/controleDoMapa';
import type { MapaAtlasRef } from './mapa/MapaAtlas';

const SRC = '/alexandria/gravuras/grav-atlas-segurando-o-globo.png';
/** Borda esquerda do pedestal, em fração da largura da gravura (alfa > 20 da linha 0,6 à base). */
const PEDESTAL_ESQUERDA = 0.2415;

/** Opacidade da gravura: inteira até zRepouso + 0,1, nenhuma em zRepouso + 0,55; cai com a
 *  inclinação até sumir em 8°; e vezes o "cabe na área livre" do controle. */
export function opacidadeDoTita(g: GloboNaTela): number {
  const pz = Math.max(0, Math.min(1, (g.zRepouso + 0.55 - g.zoom) / 0.45));
  const pi = Math.max(0, Math.min(1, 1 - g.inclinacao / 8));
  // a composição não cabe na área livre (ficha aberta numa tela estreita): o controle mede (A1.2)
  const pa = Math.max(0, Math.min(1, g.opacidade ?? 1));
  return pz * pi * pa;
}

export function Frontispicio({ mapa, ativo }: { mapa: RefObject<MapaAtlasRef | null>; ativo: boolean }) {
  const img = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const el = img.current;
    const m = mapa.current;
    if (!el || !m) return;
    if (!ativo) {
      el.style.opacity = '0';
      el.style.visibility = 'hidden';
      return;
    }
    const G = GRAVURA_DO_TITA;
    // o crédito do rodapé (canto inferior esquerdo do palco) não encosta na gravura: o palco
    // recebe a borda esquerda do pedestal e o crédito encolhe até ela (atlas-v3.css, A1.6)
    const palco = el.parentElement;
    let pedestalAnterior = '';
    const publicarPedestal = (v: string) => {
      if (v === pedestalAnterior || !palco) return;
      pedestalAnterior = v;
      if (v) palco.style.setProperty('--tita-pedestal', v);
      else palco.style.removeProperty('--tita-pedestal');
    };
    const pintar = (g: GloboNaTela | null) => {
      const op = g ? opacidadeDoTita(g) : 0;
      if (!g || op <= 0.004) {
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
        publicarPedestal('');
        return;
      }
      const largura = g.r / G.raio;
      const altura = largura * G.proporcao;
      const esquerda = g.cx - G.centroX * largura;
      const topo = g.cy + -G.centroY * altura;
      // o centro do globo dentro da caixa da imagem (para a máscara)
      const mx = g.cx - esquerda;
      const my = g.cy - topo;
      // máscara: só o alfa conta (a cor opaca é qualquer uma); transparente dentro do limbo
      const mascara = `radial-gradient(circle at ${mx.toFixed(1)}px ${my.toFixed(1)}px, transparent ${(g.r - 0.5).toFixed(1)}px, red ${(g.r + 1).toFixed(1)}px)`;
      const s = el.style;
      s.visibility = 'visible';
      s.opacity = op.toFixed(3);
      s.width = `${largura.toFixed(1)}px`;
      s.height = `${altura.toFixed(1)}px`;
      s.transform = `translate(${esquerda.toFixed(1)}px, ${topo.toFixed(1)}px)`;
      s.maskImage = mascara;
      s.setProperty('-webkit-mask-image', mascara);
      // a pedra do pedestal é a parte mais larga da gravura (medida no alfa: de 0,2415 a 0,7708
      // da largura, scratchpad l3-pagina/pedestal.cjs); só a borda esquerda interessa ao crédito
      publicarPedestal(`${Math.round(esquerda + PEDESTAL_ESQUERDA * largura)}px`);
    };
    const parar = m.seguirGlobo(pintar);
    return () => {
      parar?.();
      publicarPedestal('');
    };
  }, [mapa, ativo]);

  return <img ref={img} className="atl-tita" src={SRC} alt="" aria-hidden="true" draggable={false} decoding="async" />;
}

export default Frontispicio;
