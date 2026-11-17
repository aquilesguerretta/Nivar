// Aula 04 — D-A04-1 (perdas I²R) e D-A04-2 (mesma potência com mais tensão).
// Dado: extraction/m01/aula-04.json — fórmula 4.1 (L1661), INST·03 (R = 0,5 Ω,
// corrente 10–500 A; 100 A → 5.000 W, 200 A → 20.000 W, 300 A → 45.000 W, pela
// execução do script original) e o parágrafo L1698.

import { Diagrama, escalaLinear, fmt } from './base';

const R_OHM = 0.5; // padrão do INST·03
const perda = (i: number) => i * i * R_OHM; // fórmula da aula: P = I² × R

export function PerdasI2R() {
  const ox = 96;
  const ex = 676;
  const oy = 70;
  const fy = 300;
  const x = escalaLinear(0, 500, ox, ex);
  const y = escalaLinear(0, 125_000, fy, oy);
  const curva = Array.from({ length: 101 }, (_, k) => {
    const i = k * 5;
    return `${k === 0 ? 'M' : 'L'}${x(i).toFixed(2)} ${y(perda(i)).toFixed(2)}`;
  }).join(' ');
  const pontos = [100, 200, 300];
  const xt = [0, 100, 200, 300, 400, 500];
  const yt = [0, 25_000, 50_000, 75_000, 100_000, 125_000];
  return (
    <Diagrama
      titulo="Perda por efeito Joule cresce com o quadrado da corrente"
      subtitulo="P = I² × R, com R = 0,5 Ω"
      descricao="Curva da perda dissipada em watts contra a corrente em amperes, de 0 a 500 amperes, com resistência de 0,5 ohm. Pontos marcados: 100 A dá 5.000 W; 200 A dá 20.000 W; 300 A dá 45.000 W."
      altura={382}
      fonte="Módulo 01, Aula 04, seção 4.1 (cenário didático do instrumento 03, R = 0,5 Ω)."
      nota="Dobrar a corrente quadruplica a perda; triplicar multiplica por nove (texto da aula). A aula não declara procedência para o cenário."
    >
      {yt.map((t) => (
        <g key={`y${t}`}>
          <line x1={ox} y1={y(t)} x2={ex} y2={y(t)} className="dg-grade" />
          <text x={ox - 10} y={y(t) + 4} className="dg-n dg-fim">
            {fmt(t)}
          </text>
        </g>
      ))}
      {xt.map((t) => (
        <g key={`x${t}`}>
          <line x1={x(t)} y1={fy} x2={x(t)} y2={fy + 5} className="dg-eixo" />
          <text x={x(t)} y={fy + 21} className="dg-n dg-meio">
            {t}
          </text>
        </g>
      ))}
      <line x1={ox} y1={oy} x2={ox} y2={fy} className="dg-eixo" />
      <line x1={ox} y1={fy} x2={ex} y2={fy} className="dg-eixo" />
      <path d={curva} className="dg-linha" />
      {pontos.map((i) => (
        <g key={i}>
          <line x1={ox} y1={y(perda(i))} x2={x(i)} y2={y(perda(i))} className="dg-fino dg-tracejado" />
          <circle cx={x(i)} cy={y(perda(i))} r={5} className="dg-ponto-dest" />
          <text x={x(i) - 12} y={y(perda(i)) - 12} className="dg-n dg-forte dg-negrito dg-fim">
            {`${i} A: ${fmt(perda(i))} W`}
          </text>
        </g>
      ))}
      <text x={ex} y={fy + 46} className="dg-eixo-titulo dg-fim">
        Corrente (A)
      </text>
      <text x={20} y={(oy + fy) / 2} className="dg-eixo-titulo dg-meio" transform={`rotate(-90 20 ${(oy + fy) / 2})`}>
        Perda dissipada (W)
      </text>
    </Diagrama>
  );
}

/** Aplicação das duas fórmulas da aula (P = V × I, L1698; P = I² × R, L1661). */
export function MesmaPotenciaMaisTensao() {
  const fatores = [1, 2, 4];
  const ox = 110;
  const ex = 640;
  const oy = 76;
  const fy = 256;
  const y = escalaLinear(0, 100, fy, oy);
  const larg = 92;
  const passo = (ex - ox) / fatores.length;
  return (
    <Diagrama
      titulo="Mais tensão para a mesma potência, menos perda"
      subtitulo="Com P = V × I fixa, tensão ×k dá corrente ÷k e perda ÷k²"
      descricao="Três barras de perda relativa: com tensão ×1, 100 por cento; com tensão ×2, 25 por cento; com tensão ×4, 6,25 por cento."
      altura={338}
      fonte="Módulo 01, Aula 04, seção 4.2; derivado das fórmulas P = V × I e P = I² × R da aula."
      nota="Os valores 25 e 6,25 não aparecem na aula: são a aplicação das duas fórmulas dela. A aula não dá um exemplo numérico de baixa e alta tensão."
    >
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={ox} y1={y(t)} x2={ex} y2={y(t)} className="dg-grade" />
          <text x={ox - 10} y={y(t) + 4} className="dg-n dg-fim">
            {t}
          </text>
        </g>
      ))}
      <line x1={ox} y1={oy} x2={ox} y2={fy} className="dg-eixo" />
      <line x1={ox} y1={fy} x2={ex} y2={fy} className="dg-eixo" />
      {fatores.map((k, i) => {
        const v = 100 / (k * k);
        const cx = ox + passo * (i + 0.5);
        return (
          <g key={k}>
            <rect x={cx - larg / 2} y={y(v)} width={larg} height={fy - y(v)} className={k === 1 ? 'dg-barra-suave' : 'dg-barra'} />
            <text x={cx} y={y(v) - 8} className="dg-n dg-meio dg-forte dg-negrito">
              {`${fmt(v, 2)}%`}
            </text>
            <text x={cx} y={fy + 20} className="dg-n dg-meio dg-forte">
              {`tensão ×${k}`}
            </text>
            <text x={cx} y={fy + 37} className="dg-s dg-meio">
              {k === 1 ? 'corrente base' : `corrente ÷${k}`}
            </text>
          </g>
        );
      })}
      <text x={20} y={(oy + fy) / 2} className="dg-eixo-titulo dg-meio" transform={`rotate(-90 20 ${(oy + fy) / 2})`}>
        Perda relativa (% da perda com tensão ×1)
      </text>
    </Diagrama>
  );
}
