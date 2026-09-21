// RailToggle — o botão flutuante que abre e fecha o rail direito.
//
// ─────────────────────────────────────────────────────────────
// POR QUE VETOR, NÃO MAIS O PNG DA BIBLIOTECA DE ÍCONES
//
// A primeira versão usava `icon-compass-simple-on-cream.png` — funcionou,
// mas três problemas vieram do próprio arquivo, não de como eu o usava:
//
// 1. QUALIDADE. É uma ilustração pintada de 1024px com brilho suave, não
//    um ícone vetorial. Em 30-40px de exibição — o tamanho real do botão
//    — o traço fino e o glow ficam borrados. Escalar mais o recorte só
//    ampliava o borrão, nunca corrigia.
// 2. DESCENTRALIZA AO GIRAR. Medido por decodificação de pixel: o glifo
//    real dentro do PNG não fica no centro geométrico do canvas — o
//    centro de massa está ~4% deslocado pra cima (bounding box de
//    alpha>10: y de 150 a 798 num canvas de 1024, centro em 474 contra
//    os 512 esperados). `transform: rotate()` gira ao redor do centro da
//    CAIXA, não do centro visual do desenho — por isso a agulha "descia"
//    ao abrir o painel.
// 3. ANEL DUPLO. O PNG já traz um anel fino desenhado nele. Combinado com
//    a borda do próprio botão, virava dois círculos concêntricos — e o
//    espaço que a estrela podia ocupar ficava menor por causa do anel
//    redundante, não maior.
//
// A correção pros três de uma vez é desenhar o glifo — mesma técnica de
// `currentColor` que os primitivos da Wave 1 usam (ring-track,
// check-mark, etc.), só que inline: é glifo de um consumidor só, então
// fetch+cache de arquivo separado seria complexidade sem ganho.
//
// A estrela de quatro pontas é construída simétrica ao redor de (32,32)
// num viewBox de 64×64 — o centro de rotação do CSS (`50% 50%` da caixa
// renderizada) coincide exatamente com o centro visual por construção,
// não por ajuste de `transform-origin`. Sem anel desenhado: o círculo já
// vem da borda do próprio botão, e a estrela sozinha ocupa os 90% do
// disco que o pedido especificou.

import { A, AE } from '@/design/alexandria-tokens';

// Pequeno, para não colidir com o painel (ver RailRight.tsx).
const DIAMETRO = 40;

// 90% do disco, valor pedido diretamente — sem anel redundante disputando
// esse espaço, a estrela pode usar quase toda a caixa.
const ESTRELA_TAMANHO = 36;

// Estrela de 4 pontas centrada em (32,32) — ponta longa a 30 do centro,
// reentrância curta a 8. Construída por trigonometria, não por olho, pra
// garantir simetria perfeita nas quatro direções.
const R_LONGO = 30;
const R_CURTO = 8;
const C = 32;
const D = R_CURTO * Math.SQRT1_2; // projeção de R_CURTO a 45°

const ESTRELA_PATH = [
  `M ${C} ${C - R_LONGO}`,
  `L ${C + D} ${C - D}`,
  `L ${C + R_LONGO} ${C}`,
  `L ${C + D} ${C + D}`,
  `L ${C} ${C + R_LONGO}`,
  `L ${C - D} ${C + D}`,
  `L ${C - R_LONGO} ${C}`,
  `L ${C - D} ${C - D}`,
  'Z',
].join(' ');

export interface RailToggleProps {
  expanded: boolean;
  onClick: () => void;
}

export function RailToggle({ expanded, onClick }: RailToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-label={expanded ? 'Fechar painel de progresso' : 'Abrir painel de progresso'}
      className="alx-rail-toggle"
      style={{
        width: DIAMETRO,
        height: DIAMETRO,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: A.cremePapel,
        border: `1px solid ${A.fioSobreCreme}`,
        borderRadius: '50%',
        padding: 0,
        cursor: 'pointer',
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width={ESTRELA_TAMANHO}
        height={ESTRELA_TAMANHO}
        aria-hidden="true"
        className="alx-rail-toggle-agulha"
        style={{
          display: 'block',
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
      >
        <path d={ESTRELA_PATH} fill={A.navy} />
      </svg>

      <style>{`
        .alx-rail-toggle {
          transition: border-color ${AE.hover} ${AE.easing};
        }
        .alx-rail-toggle:hover,
        .alx-rail-toggle:focus-visible {
          border-color: ${A.terracota};
        }
        .alx-rail-toggle:focus-visible {
          outline: 1px solid ${A.terracota};
          outline-offset: 3px;
        }
        .alx-rail-toggle-agulha {
          transition: transform ${AE.hover} ${AE.easing};
        }
        @media (prefers-reduced-motion: reduce) {
          .alx-rail-toggle, .alx-rail-toggle-agulha { transition: none !important; }
        }
      `}</style>
    </button>
  );
}

export default RailToggle;
