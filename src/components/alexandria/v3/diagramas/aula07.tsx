// Aula 07 — D-A07-1 (triângulo de potência) e D-A07-2 (corrente em fase ×
// atrasada). Dado: extraction/m01/aula-07.json — estado inicial do INST·05
// (800 kW, 480 kVAr, 933 kVA, FP 0,86; L1942–1944) e o texto 7.1 (L1908–1910).
// O ângulo e a hipotenusa são calculados dos catetos, não digitados.
//
// D-A07-3 (referência 0,92 e leitura do FP 0,85). Dado: 7.3 (L1981, FP 1,00 e
// FP 0,85) e 7.4 (L1986, mínimo de referência de 0,92 para o Grupo A, indutivo e
// capacitivo). Decisão 2 de 15/11/2026 (QA-M01-A07): com FP 0,85 a reativa é a
// outra perna do triângulo, sen(arccos 0,85) ≈ 53% da aparente, e não 15%. O
// valor é calculado aqui, não digitado. Não desenha o cenário do INST·05
// (800 kW / 480 kVAr), então não precisa de véu.

import { Diagrama, escalaLinear, fmt } from './base';

const KW = 800;
const KVAR = 480;

export function TrianguloDePotencia({ kW = KW, kVAr = KVAR }: { kW?: number; kVAr?: number }) {
  const kVA = Math.hypot(kW, kVAr);
  const phi = Math.atan2(kVAr, kW);
  const fp = kW / kVA;
  const k = 0.45; // px por kW/kVAr: a mesma escala nos dois eixos
  const ox = 70;
  const by = 292;
  const A = { x: ox, y: by };
  const B = { x: ox + kW * k, y: by };
  const C = { x: ox + kW * k, y: by - kVAr * k };
  const grau = (phi * 180) / Math.PI;
  const r = 62;
  const arco = `M${A.x + r} ${A.y} A${r} ${r} 0 0 0 ${(A.x + r * Math.cos(phi)).toFixed(2)} ${(A.y - r * Math.sin(phi)).toFixed(2)}`;
  const xk = escalaLinear(0, kW, A.x, B.x);
  const yk = escalaLinear(0, kVAr, by, C.y);
  const mx = (A.x + C.x) / 2;
  const my = (A.y + C.y) / 2;
  return (
    <Diagrama
      titulo="O triângulo de potência"
      subtitulo={`Desenhado em escala, com o cenário do instrumento: ${fmt(kW)} kW e ${fmt(kVAr)} kVAr`}
      descricao={`Triângulo retângulo em escala. Cateto horizontal: potência ativa, ${fmt(kW)} quilowatts. Cateto vertical: potência reativa, ${fmt(kVAr)} quilovolt-ampères reativos. Hipotenusa: potência aparente, ${fmt(kVA)} quilovolt-ampères. O ângulo entre kW e kVA é phi, cerca de ${fmt(grau)} graus; o fator de potência é ${fmt(fp, 2, 2)}.`}
      altura={372}
      fonte="Módulo 01, Aula 07, seção 7.2 (cenário didático do instrumento 05)."
      nota="Os dois eixos usam a mesma escala. A aula define FP = kW ÷ kVA = cos φ; o ângulo φ sai da razão entre os catetos (tan φ = kVAr ÷ kW)."
    >
      {/* eixos */}
      <line x1={A.x} y1={by} x2={B.x + 20} y2={by} className="dg-eixo" />
      <line x1={B.x} y1={by} x2={B.x} y2={C.y - 18} className="dg-eixo" />
      {[0, 200, 400, 600, 800].map((t) => (
        <g key={`x${t}`}>
          <line x1={xk(t)} y1={by} x2={xk(t)} y2={by + 5} className="dg-eixo" />
          <text x={xk(t)} y={by + 20} className="dg-n dg-meio">
            {t}
          </text>
        </g>
      ))}
      {[0, 200, 400].map((t) => (
        <g key={`y${t}`}>
          <line x1={B.x} y1={yk(t)} x2={B.x + 5} y2={yk(t)} className="dg-eixo" />
          <text x={B.x + 10} y={yk(t) + 4} className="dg-n">
            {t}
          </text>
        </g>
      ))}
      <text x={A.x + (B.x - A.x) / 2} y={by + 46} className="dg-eixo-titulo dg-meio">
        Potência ativa (kW)
      </text>
      <text x={B.x + 56} y={(C.y + by) / 2} className="dg-eixo-titulo dg-meio" transform={`rotate(-90 ${B.x + 56} ${(C.y + by) / 2})`}>
        Potência reativa (kVAr)
      </text>
      {/* triângulo */}
      <path d={`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} Z`} className="dg-vazio" fill="none" />
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="dg-linha" />
      <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} className="dg-linha-suave" />
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} className="dg-linha-dest" />
      <path d={`M${B.x - 12} ${B.y} L${B.x - 12} ${B.y - 12} L${B.x} ${B.y - 12}`} className="dg-fino" />
      <path d={arco} className="dg-fino" />
      <text x={A.x + r + 8} y={A.y - 12} className="dg-n dg-forte dg-negrito">
        {`φ ≈ ${fmt(grau)}°`}
      </text>
      {/* rótulos dos lados */}
      <text x={mx - 10} y={my - 12} className="dg-n dg-dest dg-negrito dg-meio" transform={`rotate(${(-grau).toFixed(2)} ${mx - 10} ${my - 12})`}>
        {`Potência aparente · ${fmt(kVA)} kVA`}
      </text>
      <text x={A.x + (B.x - A.x) / 2} y={by - 10} className="dg-n dg-forte dg-negrito dg-meio">
        {`${fmt(kW)} kW`}
      </text>
      <text x={B.x - 12} y={(C.y + by) / 2 + 4} className="dg-n dg-negrito dg-fim">
        {`${fmt(kVAr)} kVAr`}
      </text>
      {/* leitura */}
      <text x={566} y={106} className="dg-s">
        Fator de potência
      </text>
      <text x={566} y={128} className="dg-n dg-forte">
        FP = kW ÷ kVA
      </text>
      <text x={566} y={148} className="dg-n dg-forte">
        {`= ${fmt(kW)} ÷ ${fmt(kVA)}`}
      </text>
      <text x={566} y={176} className="dg-n dg-dest dg-negrito" fontSize={20}>
        {`= ${fmt(fp, 2, 2)}`}
      </text>
      <text x={566} y={198} className="dg-n">
        = cos φ
      </text>
    </Diagrama>
  );
}

/** φ do cenário do triângulo (arctan 480/800 ≈ 31°), usado como atraso ilustrativo. */
export function FaseCorrente() {
  const T = 1000 / 60; // ms, 60 Hz (aula 03, L1596)
  const phi = Math.atan2(KVAR, KW);
  const atrasoMs = (phi / (2 * Math.PI)) * T;
  const ox = 96;
  const ex = 690;
  const tmax = 33.4;
  const x = escalaLinear(0, tmax, ox, ex);
  const alt = 92;
  const paineis = [
    { topo: 84, titulo: 'Carga resistiva', sub: 'corrente em fase com a tensão', atraso: 0 },
    { topo: 232, titulo: 'Carga indutiva', sub: `corrente atrasada em relação à tensão: φ ≈ ${fmt((phi * 180) / Math.PI)}° ≈ ${fmt(atrasoMs, 1, 1)} ms`, atraso: atrasoMs },
  ];
  const fim = paineis[1].topo + alt;
  const onda = (y: (v: number) => number, atraso: number) =>
    Array.from({ length: 401 }, (_, i) => {
      const t = (i / 400) * tmax;
      return `${i === 0 ? 'M' : 'L'}${x(t).toFixed(2)} ${y(Math.sin((2 * Math.PI * (t - atraso)) / T)).toFixed(2)}`;
    }).join(' ');
  return (
    <Diagrama
      titulo="Corrente em fase e corrente atrasada"
      subtitulo="Tensão e corrente senoidais a 60 Hz: em carga resistiva coincidem, em carga indutiva a corrente atrasa"
      descricao={`Dois gráficos de tensão e corrente contra o tempo em milissegundos, dois ciclos de 16,7 milissegundos. Em cima, carga resistiva: as duas ondas coincidem. Embaixo, carga indutiva: a onda da corrente está atrasada em cerca de ${fmt(atrasoMs, 1, 1)} milissegundos, o equivalente a ${fmt((phi * 180) / Math.PI)} graus.`}
      altura={fim + 76}
      fonte="Módulo 01, Aula 07, seção 7.1; ângulo derivado do cenário do instrumento 05 (800 kW e 480 kVAr)."
      nota="Ilustrativo: a aula não dá o ângulo de atraso. O valor de 31° (≈ 1,4 ms) é o φ do cenário didático do triângulo de potência, arctan(480 ÷ 800)."
    >
      {paineis.map((p) => {
        const y = escalaLinear(-1.3, 1.3, p.topo + alt, p.topo);
        return (
          <g key={p.titulo}>
            <text x={ox} y={p.topo - 10} className="dg-t dg-negrito">
              {p.titulo}
            </text>
            <text x={ox + 128} y={p.topo - 10} className="dg-s">
              {p.sub}
            </text>
            <line x1={ox} y1={y(0)} x2={ex} y2={y(0)} className="dg-grade dg-tracejado" />
            <line x1={ox} y1={p.topo} x2={ox} y2={p.topo + alt} className="dg-eixo" />
            <path d={onda(y, 0)} className="dg-linha" />
            <path d={onda(y, p.atraso)} className="dg-linha-dest" strokeDasharray={p.atraso === 0 ? '6 4' : undefined} />
            <text x={ox - 8} y={y(0) + 4} className="dg-n dg-fim">
              0
            </text>
            {p.atraso > 0 ? (
              <g>
                <line x1={x(0)} y1={y(0) - 14} x2={x(p.atraso)} y2={y(0) - 14} className="dg-fino" />
                <line x1={x(0)} y1={y(0) - 18} x2={x(0)} y2={y(0) - 10} className="dg-fino" />
                <line x1={x(p.atraso)} y1={y(0) - 18} x2={x(p.atraso)} y2={y(0) - 10} className="dg-fino" />
              </g>
            ) : null}
          </g>
        );
      })}
      <line x1={ox} y1={fim} x2={ex} y2={fim} className="dg-eixo" />
      {[0, 10, 20, 30].map((t) => (
        <g key={t}>
          <line x1={x(t)} y1={fim} x2={x(t)} y2={fim + 5} className="dg-eixo" />
          <text x={x(t)} y={fim + 20} className="dg-n dg-meio">
            {t}
          </text>
        </g>
      ))}
      <text x={ex} y={fim + 42} className="dg-eixo-titulo dg-fim">
        Tempo (ms)
      </text>
      {/* legenda */}
      <line x1={ox} y1={fim + 40} x2={ox + 28} y2={fim + 40} className="dg-linha" />
      <text x={ox + 36} y={fim + 44} className="dg-s">
        tensão
      </text>
      <line x1={ox + 100} y1={fim + 40} x2={ox + 128} y2={fim + 40} className="dg-linha-dest" />
      <text x={ox + 136} y={fim + 44} className="dg-s">
        corrente
      </text>
      <text x={20} y={(paineis[0].topo + fim) / 2} className="dg-eixo-titulo dg-meio" transform={`rotate(-90 20 ${(paineis[0].topo + fim) / 2})`}>
        Tensão e corrente (unidade relativa)
      </text>
    </Diagrama>
  );
}

// ── D-A07-3 · Referência 0,92 e leitura do FP ──────────────────────────────

/** 7.4 (L1986): mínimo de referência para o Grupo A. */
const FP_REFERENCIA = 0.92;
/** 7.3 (L1981): o exemplo da aula. */
const FP_EXEMPLO = 0.85;

export function ReferenciaFatorDePotencia() {
  // ── régua de FP ──
  const x0 = 70;
  const x1 = 650;
  const FP_MIN = 0.8;
  const x = escalaLinear(FP_MIN, 1, x0, x1);
  const rY = 116;
  const marcas = [
    { v: FP_EXEMPLO, rot: 'exemplo da aula (7.3)', dest: false },
    { v: FP_REFERENCIA, rot: 'mínimo de referência do Grupo A (7.4)', dest: true },
    { v: 1, rot: 'toda a aparente vira ativa (7.3)', dest: false },
  ];

  // ── triângulo do FP 0,85, com a aparente = 100% ──
  const reativa = Math.sin(Math.acos(FP_EXEMPLO)); // ≈ 0,527
  const s = 330; // px por unidade de potência aparente
  const tY = 470;
  const A = { x: 90, y: tY };
  const B = { x: A.x + FP_EXEMPLO * s, y: tY };
  const C = { x: B.x, y: tY - reativa * s };
  const phi = Math.acos(FP_EXEMPLO);
  const grau = (phi * 180) / Math.PI;
  const mx = (A.x + C.x) / 2;
  const my = (A.y + C.y) / 2;
  const pct = (v: number) => fmt(v * 100, 0);
  const lx = 440;
  return (
    <Diagrama
      titulo="O mínimo de 0,92 e o que o FP 0,85 quer dizer"
      subtitulo="Em cima, a régua de fator de potência; embaixo, o triângulo de um FP de 0,85 com a aparente valendo 100%"
      descricao={`Régua de fator de potência de 0,80 a 1,00, com três marcas: 0,85, o exemplo da aula; 0,92, o mínimo de referência do Grupo A, no comportamento indutivo e no capacitivo; 1,00, toda a potência aparente vira ativa. Abaixo de 0,92 pode haver cobrança do excedente reativo. Embaixo, um triângulo retângulo em escala com a potência aparente igual a 100%: a ativa vale 85% e a reativa, o outro cateto, cerca de ${pct(reativa)}%, e não 15%.`}
      altura={tY + 70}
      fonte="Módulo 01, Aula 07, seções 7.3 (FP 1,00 e FP 0,85) e 7.4 (mínimo de referência de 0,92); a reativa sai do triângulo da seção 7.2."
      nota={`A reativa é calculada, não lida da aula: kVAr ÷ kVA = sen(arccos 0,85) ≈ ${fmt(reativa, 2, 2)}. As três potências não se somam como parcelas; a aparente é a combinação vetorial da ativa e da reativa (Aula 02, seção 2.5).`}
    >
      {/* régua */}
      <rect x={x0} y={rY - 18} width={x(FP_REFERENCIA) - x0} height={36} className="dg-area" style={{ stroke: 'none' }} />
      <text x={(x0 + x(FP_REFERENCIA)) / 2} y={rY + 58} className="dg-s dg-meio">
        abaixo de 0,92: pode haver cobrança do excedente reativo (7.4)
      </text>
      <line x1={x0} y1={rY} x2={x1} y2={rY} className="dg-eixo" />
      {[0.8, 0.85, 0.9, 0.95, 1].map((t) => (
        <g key={`t${t}`}>
          <line x1={x(t)} y1={rY + 18} x2={x(t)} y2={rY + 23} className="dg-eixo" />
          <text x={x(t)} y={rY + 36} className="dg-n dg-meio dg-fraco">
            {fmt(t, 2, 2)}
          </text>
        </g>
      ))}
      {marcas.map((m, i) => (
        <g key={m.v}>
          <line x1={x(m.v)} y1={rY - 30} x2={x(m.v)} y2={rY + 18} className={m.dest ? 'dg-linha-dest' : 'dg-linha'} />
          <text x={m.v === 1 ? x(m.v) + 4 : x(m.v)} y={rY - 36 - (i === 1 ? 18 : 0)} className={`dg-n dg-negrito ${m.v === 1 ? 'dg-fim' : 'dg-meio'} ${m.dest ? 'dg-dest' : 'dg-forte'}`}>
            {`${fmt(m.v, 2, 2)} · ${m.rot}`}
          </text>
        </g>
      ))}
      <text x={x1} y={rY + 80} className="dg-eixo-titulo dg-fim">
        Fator de potência (FP = kW ÷ kVA)
      </text>

      {/* triângulo */}
      <text x={A.x - 20} y={C.y - 40} className="dg-t dg-negrito">
        FP 0,85 no triângulo de potência
      </text>
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="dg-linha" />
      <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} className="dg-linha-suave" />
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} className="dg-linha-dest" />
      <path d={`M${B.x - 12} ${B.y} L${B.x - 12} ${B.y - 12} L${B.x} ${B.y - 12}`} className="dg-fino" />
      <path d={`M${A.x + 50} ${A.y} A50 50 0 0 0 ${(A.x + 50 * Math.cos(phi)).toFixed(2)} ${(A.y - 50 * Math.sin(phi)).toFixed(2)}`} className="dg-fino" />
      <text x={A.x + 58} y={A.y - 10} className="dg-n dg-forte">
        {`φ ≈ ${fmt(grau)}°`}
      </text>
      <text x={(A.x + B.x) / 2} y={A.y + 22} className="dg-n dg-forte dg-negrito dg-meio">
        {`ativa · ${pct(FP_EXEMPLO)}% da aparente`}
      </text>
      <text x={B.x + 10} y={(B.y + C.y) / 2 + 4} className="dg-n dg-negrito">
        {`reativa · ≈ ${pct(reativa)}%`}
      </text>
      <text x={mx - 12} y={my - 12} className="dg-n dg-dest dg-negrito dg-meio" transform={`rotate(${(-grau).toFixed(2)} ${mx - 12} ${my - 12})`}>
        aparente · 100%
      </text>
      <text x={lx + 60} y={C.y + 6} className="dg-s">
        A conta, pelo triângulo
      </text>
      <text x={lx + 60} y={C.y + 28} className="dg-n dg-forte">
        reativa ÷ aparente = sen φ
      </text>
      <text x={lx + 60} y={C.y + 48} className="dg-n dg-forte">
        = sen(arccos 0,85)
      </text>
      <text x={lx + 60} y={C.y + 74} className="dg-n dg-dest dg-negrito" fontSize={18}>
        {`≈ ${fmt(reativa, 2, 2)}`}
      </text>
      <text x={lx + 60} y={C.y + 100} className="dg-s">
        e não 1 − 0,85 = 0,15
      </text>
    </Diagrama>
  );
}
