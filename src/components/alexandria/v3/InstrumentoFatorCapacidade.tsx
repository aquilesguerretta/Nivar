// Demonstração na Home: o INST·06 do M01 (fator de capacidade), com a fórmula
// e a formatação exatas da fonte (extraction/m01/aula-08.json, script do
// instrumento, L2935–2962) e o cenário-padrão da fonte (100 MW, 220.000 MWh,
// 8.760 h → 25,1%).
//
// Fica de fora, de propósito, o texto de leitura por faixa do script: as
// faixas de fator de capacidade estão em conflito na própria fonte
// (QA-FCap-01, decisão pendente do Founder) e, no cenário-padrão, o script e
// a marcação inicial dizem coisas diferentes (COD-06).
//
// Os limites das réguas são de interface (a fonte só declara mínimo 0 e
// passo); não são afirmação sobre o mundo.

import { useEffect, useRef, useState } from 'react';
import { ReguaDeslizante } from './ReguaDeslizante';

const nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Fórmula literal do script da fonte. */
export function fatorDeCapacidade(capMW: number, geracaoMWh: number, horas: number): number {
  const C = capMW || 0;
  const G = geracaoMWh || 0;
  const T = horas || 1;
  const max = C * T;
  return max > 0 ? G / max : 0;
}

/** O número na tela corre até o novo valor (≈ 280 ms), em vez de saltar. */
function useNumeroCorrido(alvo: number) {
  const [mostrado, setMostrado] = useState(alvo);
  const de = useRef(alvo);
  useEffect(() => {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduzir) {
      setMostrado(alvo);
      de.current = alvo;
      return;
    }
    const inicio = performance.now();
    const origem = de.current;
    let raf = 0;
    const passo = (t: number) => {
      const k = Math.min(1, (t - inicio) / 280);
      const suave = 1 - Math.pow(1 - k, 3);
      const v = origem + (alvo - origem) * suave;
      setMostrado(v);
      de.current = v;
      if (k < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [alvo]);
  return mostrado;
}

export function InstrumentoFatorCapacidade() {
  const [cap, setCap] = useState(100);
  const [ger, setGer] = useState(220000);
  const [horas, setHoras] = useState(8760);
  const fc = fatorDeCapacidade(cap, ger, horas);
  const mostrado = useNumeroCorrido(fc * 100);

  return (
    <figure className="inst">
      <header className="inst-cabeca">
        <p className="v-manchete inst-titulo">Fator de capacidade</p>
        <p className="v-dado">Instrumento 06 · Módulo 01 · Aula 08</p>
      </header>
      <div className="inst-corpo">
        <div className="inst-entradas">
          <ReguaDeslizante
            id="inst-cap"
            rotulo="Capacidade instalada"
            unidade="MW"
            valor={cap}
            min={10}
            max={1000}
            passo={10}
            formatar={(v) => nf0.format(v)}
            aoMudar={setCap}
          />
          <ReguaDeslizante
            id="inst-ger"
            rotulo="Geração no período"
            unidade="MWh"
            valor={ger}
            min={0}
            max={2000000}
            passo={1000}
            formatar={(v) => nf0.format(v)}
            aoMudar={setGer}
          />
          <ReguaDeslizante
            id="inst-horas"
            rotulo="Horas do período"
            unidade="h"
            valor={horas}
            min={24}
            max={8784}
            passo={24}
            formatar={(v) => nf0.format(v)}
            aoMudar={setHoras}
          />
        </div>
        <div className="inst-saida" aria-live="polite">
          <span className="v-dado">Fator de capacidade</span>
          <span className="inst-numero">
            {nf1.format(mostrado)}
            <span className="inst-unidade">%</span>
          </span>
          <span className="inst-medidor" aria-hidden="true">
            <span className="inst-medidor-cheio" style={{ width: `${Math.min(100, fc * 100)}%` }} />
          </span>
        </div>
      </div>
      <figcaption className="v-dado inst-fonte">
        FC = geração ÷ (capacidade instalada × horas do período) · Fonte: Módulo 01, Aula 08, seção 8.2
      </figcaption>
    </figure>
  );
}
