// CaminhoExpedicao — os módulos da trilha como nós num percurso.
//
// Prancha de levantamento: papel milimetrado, rota tracejada sinuosa, nós
// marcados por primitivo. A rota serpenteia porque um traverse de campo
// serpenteia — a variação de recuo segue um ciclo de quatro passos em vez
// de zigue-zague de dois, que leria mecânico.
//
// Nota sobre a grade: a Wave 2 proíbe grade de pontos como TEXTURA DE
// PAPEL, e isso continua valendo — o canvas usa fibra irregular. Aqui é
// outra coisa: papel milimetrado é instrumento de desenho técnico, pedido
// explicitamente pelo brief, e é feito de LINHAS, não de pontos.

import { A, A2, AT, AS, AE } from '@/design/alexandria-tokens';
import type { ModuloComEstado } from '@/pages/alexandria/AlexandriaRouter';
import { ModuloNode } from './ModuloNode';

const ALTURA_LINHA = 132;
const RAIO_NO = 23;
/** Ciclo de recuo em px. Quatro passos dão percurso errante; dois dariam
 *  zigue-zague regular. */
const RECUOS = [0, 92, 36, 132];

const recuoDe = (i: number) => RECUOS[i % RECUOS.length];

/** Cúbica entre os centros de nós consecutivos, com pontos de controle
 *  nos meios verticais — curva suave, sem cotovelo. */
function construirRota(total: number): string {
  if (total < 2) return '';
  const ponto = (i: number) => ({ x: recuoDe(i) + RAIO_NO, y: i * ALTURA_LINHA + RAIO_NO });

  let d = '';
  for (let i = 0; i < total - 1; i++) {
    const a = ponto(i);
    const b = ponto(i + 1);
    const dy = (b.y - a.y) / 2;
    if (i === 0) d += `M ${a.x} ${a.y} `;
    d += `C ${a.x} ${a.y + dy} ${b.x} ${b.y - dy} ${b.x} ${b.y} `;
  }
  return d.trim();
}

interface CaminhoExpedicaoProps {
  itens: ModuloComEstado[];
  onAbrirModulo: (moduloId: string) => void;
}

export function CaminhoExpedicao({ itens, onAbrirModulo }: CaminhoExpedicaoProps) {
  const altura = itens.length * ALTURA_LINHA;
  const rota = construirRota(itens.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: AS.lg }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: AS.md, flexWrap: 'wrap' }}>
        <span style={{ ...AT.rotulo, color: A.terracota }}>Percurso</span>
        <span style={{ ...AT.dado, color: A2.tintaMetadado }}>
          {itens.length} módulos · {itens.filter((i) => i.estado === 'em-producao').length} em produção
        </span>
      </div>

      <div style={{ position: 'relative', height: altura, minWidth: 0 }}>
        {/* Papel milimetrado — linhas finas, dois passos. */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: `-${AS.lg} -${AS.xl}`,
            backgroundImage: [
              `linear-gradient(to right, ${A.fioSobreCreme} 1px, transparent 1px)`,
              `linear-gradient(to bottom, ${A.fioSobreCreme} 1px, transparent 1px)`,
              `linear-gradient(to right, ${A.fioSobreCreme} 1px, transparent 1px)`,
              `linear-gradient(to bottom, ${A.fioSobreCreme} 1px, transparent 1px)`,
            ].join(','),
            backgroundSize: '40px 40px, 40px 40px, 8px 8px, 8px 8px',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />

        {/* Rota tracejada. O desenho por dashoffset não serve aqui porque o
            stroke-dasharray já está ocupado desenhando o tracejado — os dois
            usos brigam pela mesma propriedade. Entrada por fade, na duração
            longa de AE. */}
        <svg
          aria-hidden="true"
          width="100%"
          height={altura}
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        >
          <path
            className="alx-rota"
            d={rota}
            fill="none"
            stroke={A2.fioColunaSobreCreme}
            strokeWidth="1.5"
            strokeDasharray="5 5"
            strokeLinecap="round"
          />
        </svg>

        {itens.map((item, i) => (
          <div
            key={item.modulo.id}
            style={{
              position: 'absolute',
              top: i * ALTURA_LINHA,
              left: recuoDe(i),
              // Reserva largura para o rótulo sem deixar o nó mais fundo
              // estourar a prancha.
              maxWidth: `calc(100% - ${recuoDe(i)}px)`,
            }}
          >
            <ModuloNode item={item} onAbrir={() => onAbrirModulo(item.modulo.id)} />
          </div>
        ))}
      </div>

      <style>{`
        .alx-rota {
          opacity: 0;
          animation: alx-rota-entra ${AE.desenhoLongo} ${AE.easing} forwards;
        }
        @keyframes alx-rota-entra { from { opacity: 0 } to { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          .alx-rota { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
    </div>
  );
}

export default CaminhoExpedicao;
