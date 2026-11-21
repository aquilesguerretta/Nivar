// AlexandriaShell — composição invariante do produto.
//
//   header navy full-bleed
//   ├─ [rail esquerdo creme, opcional, 232px]
//   ├─ canvas creme (textura de fibra a 4%) → conteúdo → rodapé, em fluxo
//   └─ rail direito navy, retrátil — colapsado (64px) por padrão,
//      painel de 300px como overlay ao expandir (Wave 16)
//
// O rodapé (Wave 16) não é mais faixa permanente: mora dentro do <main>,
// última posição, e só aparece quando o usuário rola até o fim de cada
// página. Antes disso ele era irmão desta linha inteira, sempre visível,
// tirando altura de canvas em toda tela do produto o tempo inteiro.
//
// Raio zero em tudo. Sem box-shadow — profundidade vem de fio de 1px.
// Sem Tailwind em superfície nenhuma da Alexandria.

import { useEffect, type ReactNode } from 'react';
import { A, AS, AR, AE, ATEXTURA, AFONT_HREF } from '../../../design/alexandria-tokens';
import { AlexandriaHeader, type AlexandriaNavItem } from './AlexandriaHeader';
import { RailLeft } from './RailLeft';
import { RailRight, type RailRightSlots } from './RailRight';
import { AlexandriaFooter } from './AlexandriaFooter';

export interface AlexandriaShellProps {
  children: ReactNode;              // canvas central creme
  showLeftRail?: boolean;           // default false
  leftRailContent?: ReactNode;
  rightRailSlots?: RailRightSlots;
  navItens?: AlexandriaNavItem[];
  navAtivo?: string;
  onNavegar?: (id: string) => void;
}

// Cinzel e Lora não são carregadas pelo index.html do projeto (que só
// traz Instrument Serif + Geist para o terminal). index.html não é
// território desta wave, então o shell injeta o próprio <link> uma
// única vez. Playfair Display fica de fora de propósito — é o defeito
// conhecido do handoff, com 36 declarações lá.
const FONT_LINK_ID = 'alx-fontes';

function useFontesAlexandria() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href = AFONT_HREF;
    document.head.appendChild(link);
    // Sem cleanup: outras telas da Alexandria reaproveitam o mesmo link,
    // e remover no unmount causaria flash de fallback ao navegar.
  }, []);
}

export function AlexandriaShell({
  children,
  showLeftRail = false,
  leftRailContent,
  rightRailSlots,
  navItens,
  navAtivo,
  onNavegar,
}: AlexandriaShellProps) {
  useFontesAlexandria();

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: A.cremePapel,
        color: A.tintaSobreCreme,
        borderRadius: AR.none,
        overflow: 'hidden',
      }}
    >
      <AlexandriaHeader
        itens={navItens}
        itemAtivo={navAtivo}
        onNavegar={onNavegar}
      />

      {/* `position: relative` é o que ancora o painel/backdrop/selo
          retráteis do RailRight (Wave 16) — eles são `position: absolute`
          e saem do cálculo de flex desta linha, mas precisam de um
          ancestral posicionado pra saber onde "direita" e "topo" ficam. */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
        {showLeftRail && <RailLeft>{leftRailContent}</RailLeft>}

        {/* Canvas central creme. A fibra fica numa camada própria para
            que a opacidade de 4% não afete o conteúdo. */}
        <main
          style={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
            background: A.cremePapel,
            overflowY: 'auto',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: ATEXTURA.fibraUrl,
              backgroundSize: ATEXTURA.fibraTile,
              opacity: ATEXTURA.fibraOpacidade,
              pointerEvents: 'none',
            }}
          />
          {/* Medida máxima da prancha. Sem ela, em 3440px os blocos de
              conteúdo esticam para ~3000px e a tela vira landing page de
              SaaS — o modo de falha que o brief nomeia. O handoff não
              cobre ultrawide: as maquetes são frames fixos de 1440px,
              onde o canvas mede ~908px depois dos dois rails. 1120px
              mantém a proporção de prancha e centraliza como página de
              monografia. */}
          <div
            style={{
              position: 'relative',
              maxWidth: '1120px',
              margin: '0 auto',
              padding: `${AS.xxl} ${AS.xxl}`,
            }}
          >
            {children}
          </div>

          {/* Rodapé em FLUXO (Wave 16) — dentro do <main>, última posição,
              depois de todo conteúdo de página. Antes ele era faixa
              permanente fora do scroll, irmã desta linha inteira; agora só
              aparece quando o usuário rola até o fim de verdade.

              Fica FORA do wrapper de 1120px de propósito, não dentro: o
              rodapé nasceu como banda navy full-bleed (largura da shell
              inteira), e o wrapper de 1120px é medida de PRANCHA de
              leitura, não do produto inteiro. Confinar o rodapé a 1120px
              trocaria "banda full-bleed" por "rodapé de artigo", que não é
              a identidade que a Wave 10 desenhou. Aqui ele ainda é
              full-bleed — só que da largura do CANVAS (a coluna entre os
              rails), não mais da shell inteira, porque agora mora dentro
              de <main>.

              `AlexandriaFooter` segue com `flex: 'none'` no próprio
              arquivo (fora da posse desta wave — "você só move onde ele
              mora no DOM"). Isso é inofensivo aqui: `flex` só tem efeito
              como filho direto de um container `display: flex`, e `<main>`
              é bloco comum. Verificado: nenhuma diferença visual entre
              essa regra presente ou ausente nesta posição. */}
          <AlexandriaFooter />
        </main>

        <RailRight slots={rightRailSlots} />
      </div>

      {/* prefers-reduced-motion cai para o ESTADO FINAL, nunca para
          vazio: dashoffset 0 = traço inteiro desenhado. Um leitor que
          desliga animação vê o atlas pronto, não uma página em branco. */}
      <style>{`
        @keyframes alx-draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
        .alx-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: alx-draw ${AE.desenhoCurto} ${AE.easing} forwards;
        }
        .alx-draw-long { animation-duration: ${AE.desenhoLongo}; }
        @media (prefers-reduced-motion: reduce) {
          .alx-draw, .alx-draw-long {
            animation: none !important;
            stroke-dashoffset: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AlexandriaShell;
