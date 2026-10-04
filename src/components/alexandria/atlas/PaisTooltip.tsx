// PaisTooltip — a etiqueta de leitura do Atlas Mundial (Wave 27).
//
// HTML de verdade, <div> comum por cima do canvas — NUNCA texto
// renderizado dentro da cena 3D. Texto em 3D fica embaçado, não é
// selecionável e ignora acessibilidade; como HTML, Cinzel e Lora
// carregam de verdade.
//
// Ancorado em coordenada de TELA, seguindo o cursor — não preso à
// esfera, senão treme quando o globo gira. O posicionamento é
// transform direto no DOM dentro de um listener de mousemove: zero
// re-render de React por movimento de mouse.
//
// Visual: cartão de papel (creme superfície + fio de 1px) sobre a
// prancha escura — a ficha de catálogo do gabinete. Raio zero, sem
// sombra: profundidade vem de fio.

import { useEffect, useRef, type RefObject } from 'react';
import { A, A2, AF, AT, AE, AS, AR } from '../../../design/alexandria-tokens';
import { fmtNum, fmtPct, type PaisResumo } from '../../../lib/atlas/worldApi';

export interface AlvoTooltip {
  nome: string;
  /** null = país desenhado sem perfil no backend (ausência honesta). */
  resumo: PaisResumo | null;
  dominante: { rotulo: string; pct: number } | null;
}

interface PaisTooltipProps {
  alvo: AlvoTooltip | null;
  /** Wrapper da prancha — é nele que o mousemove é escutado. */
  areaRef: RefObject<HTMLDivElement | null>;
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: AS.lg }}>
      <span style={{ ...AT.rotulo, fontSize: '8px', letterSpacing: '0.13em', color: A2.tintaMetadado, alignSelf: 'center' }}>
        {rotulo}
      </span>
      <span style={{ ...AT.dado, fontSize: '12px', color: A.tintaSobreCreme, whiteSpace: 'nowrap' }}>
        {valor}
      </span>
    </div>
  );
}

export function PaisTooltip({ alvo, areaRef }: PaisTooltipProps) {
  const caixaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const mover = (e: MouseEvent) => {
      const caixa = caixaRef.current;
      if (!caixa) return;
      const r = area.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // vira para o outro lado do cursor perto das bordas da prancha
      const dx = x + 16 + caixa.offsetWidth > r.width ? x - caixa.offsetWidth - 16 : x + 16;
      const dy = y + 18 + caixa.offsetHeight > r.height ? y - caixa.offsetHeight - 18 : y + 18;
      caixa.style.transform = `translate(${Math.max(4, dx)}px, ${Math.max(4, dy)}px)`;
    };
    area.addEventListener('mousemove', mover);
    return () => area.removeEventListener('mousemove', mover);
  }, [areaRef]);

  return (
    <div
      ref={caixaRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        opacity: alvo ? 1 : 0,
        transition: `opacity ${AE.estado} ${AE.easing}`,
        background: A2.cremeSuperficie,
        border: `1px solid ${A.fioSobreCreme}`,
        borderRadius: AR.none,
        padding: `${AS.sm} ${AS.md}`,
        minWidth: '220px',
        maxWidth: '280px',
        display: 'flex',
        flexDirection: 'column',
        gap: AS.xs,
      }}
    >
      {alvo && (
        <>
          <span
            style={{
              fontFamily: AF.display,
              fontSize: '13px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: A.tintaSobreCreme,
            }}
          >
            {alvo.nome}
          </span>

          {alvo.resumo === null ? (
            <span style={{ ...AT.dado, fontSize: '11px', fontStyle: 'italic', color: A.tintaSuave, maxWidth: '30ch' }}>
              Sem dado disponível — fora do conjunto de 188 países
              soberanos com perfil OWID.
            </span>
          ) : (
            <div
              style={{
                borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
                paddingTop: AS.xs,
                display: 'flex',
                flexDirection: 'column',
                gap: AS.xs,
              }}
            >
              <Linha
                rotulo="Matriz dominante"
                valor={
                  alvo.dominante
                    ? `${alvo.dominante.rotulo} · ${fmtPct(alvo.dominante.pct)}`
                    : '—'
                }
              />
              <Linha rotulo="Renovável na eletricidade" valor={fmtPct(alvo.resumo.renewablesShareElecPct)} />
              <Linha
                rotulo="Intensidade de carbono"
                valor={
                  alvo.resumo.carbonIntensityElecGco2PerKwh === null
                    ? '—'
                    : `${fmtNum(alvo.resumo.carbonIntensityElecGco2PerKwh, 0)} gCO₂/kWh`
                }
              />
              <span style={{ ...AT.dado, fontSize: '10px', color: A2.tintaMetadado }}>
                Ano de referência {alvo.resumo.year}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PaisTooltip;
