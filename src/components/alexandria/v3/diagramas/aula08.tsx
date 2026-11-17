// Aula 08 — D-A08-1 (capacidade × geração no exemplo). Dado:
// extraction/m01/aula-08.json, L2023: usina de 100 MW, 100 × 8.760 = 876.000 MWh
// de máximo teórico, geração efetiva de 220.000 MWh → fator de capacidade 25,1%.
//
// D-A08-2 (FCs típicos por fonte). Dado: a figura `cf-chart` da própria aula
// (extraction/m01/aula-08.json, m01-a08-fig-01, L2059–2085), sete faixas com
// rótulo "~a–b%". Decisão 3 de 15/11/2026 (QA-FCap-01): essa figura governa as
// faixas do M01; o script do INST·06 e o § Lex não entram. Não marca o cenário
// do INST·06, então não precisa de véu.
//
// D-A08-3 espera dado (docs/alexandria-v3/figuras-m01.md).

import { Diagrama, escalaLinear, fmt } from './base';

const CAP_MW = 100;
const HORAS = 8760;
const GERACAO_MWH = 220_000;
const MAXIMO = CAP_MW * HORAS; // 876.000 MWh
const FC = GERACAO_MWH / MAXIMO;

export function CapacidadeGeracaoExemplo() {
  const ox = 130;
  const ex = 440;
  const oy = 82;
  const fy = 296;
  const y = escalaLinear(0, 1_000_000, fy, oy);
  const larg = 100;
  const barras = [
    { r: 'Máximo teórico', s: `${CAP_MW} MW × ${fmt(HORAS)} h`, v: MAXIMO, c: 'dg-barra-suave' },
    { r: 'Geração efetiva', s: 'no ano', v: GERACAO_MWH, c: 'dg-barra' },
  ];
  return (
    <Diagrama
      titulo="Capacidade instalada e geração efetiva em um ano"
      subtitulo="Usina de 100 MW que gerou 220.000 MWh"
      descricao="Duas barras de energia anual em megawatts-hora: máximo teórico de 876.000 MWh, que é 100 megawatts vezes 8.760 horas, e geração efetiva de 220.000 MWh. A razão entre elas é o fator de capacidade, 25,1 por cento."
      altura={380}
      fonte="Módulo 01, Aula 08, seção 8.2 (cenário didático: 100 MW, 220.000 MWh, 8.760 h)."
      nota="Fator de capacidade = geração real ÷ (capacidade instalada × horas do período)."
    >
      {[0, 250_000, 500_000, 750_000, 1_000_000].map((t) => (
        <g key={t}>
          <line x1={ox} y1={y(t)} x2={ex} y2={y(t)} className="dg-grade" />
          <text x={ox - 10} y={y(t) + 4} className="dg-n dg-fim">
            {fmt(t)}
          </text>
        </g>
      ))}
      <line x1={ox} y1={oy} x2={ox} y2={fy} className="dg-eixo" />
      <line x1={ox} y1={fy} x2={ex} y2={fy} className="dg-eixo" />
      {barras.map((b, i) => {
        const cx = ox + 90 + i * 150;
        return (
          <g key={b.r}>
            <rect x={cx - larg / 2} y={y(b.v)} width={larg} height={fy - y(b.v)} className={b.c} />
            <text x={cx} y={y(b.v) - 8} className="dg-n dg-meio dg-forte dg-negrito">
              {`${fmt(b.v)} MWh`}
            </text>
            <text x={cx} y={fy + 20} className="dg-s dg-meio dg-forte">
              {b.r}
            </text>
            <text x={cx} y={fy + 36} className="dg-n dg-meio">
              {b.s}
            </text>
          </g>
        );
      })}
      <text x={20} y={(oy + fy) / 2} className="dg-eixo-titulo dg-meio" transform={`rotate(-90 20 ${(oy + fy) / 2})`}>
        Energia em um ano (MWh)
      </text>
      <g>
        <text x={490} y={150} className="dg-s">
          Fator de capacidade
        </text>
        <text x={490} y={172} className="dg-n dg-forte">
          {`${fmt(GERACAO_MWH)} ÷ ${fmt(MAXIMO)}`}
        </text>
        <text x={490} y={206} className="dg-n dg-dest dg-negrito" fontSize={22}>
          {`= ${fmt(FC * 100, 1, 1)}%`}
        </text>
      </g>
    </Diagrama>
  );
}

// ── D-A08-2 · FCs típicos por fonte ────────────────────────────────────────

/** Figura `cf-chart` (L2061–2085): fonte de geração e faixa, na ordem da aula. */
const FAIXAS_CF: readonly { fonte: string; de: number; ate: number }[] = [
  { fonte: 'Nuclear', de: 85, ate: 95 },
  { fonte: 'Carvão (base load)', de: 55, ate: 75 },
  { fonte: 'Gás natural CCGT', de: 40, ate: 60 },
  { fonte: 'Hidrelétrica (BR · média)', de: 45, ate: 55 },
  { fonte: 'Eólica onshore (NE BR)', de: 40, ate: 55 },
  { fonte: 'Solar fotovoltaica (BR)', de: 20, ate: 28 },
  { fonte: 'Térmica a óleo (peaker)', de: 5, ate: 15 },
];

export function FatoresDeCapacidadeTipicos() {
  const x0 = 250;
  const x1 = 690;
  const x = escalaLinear(0, 100, x0, x1);
  const topo = 74;
  const passo = 34;
  const fundo = topo + FAIXAS_CF.length * passo + 4;
  return (
    <Diagrama
      titulo="Fatores de capacidade típicos por fonte"
      subtitulo="As sete faixas da figura da seção 8.3, do mínimo ao máximo de cada uma"
      descricao={`Barras horizontais de fator de capacidade, de 0 a 100 por cento: ${FAIXAS_CF.map((f) => `${f.fonte}, cerca de ${f.de} a ${f.ate} por cento`).join('; ')}.`}
      altura={fundo + 70}
      fonte="Módulo 01, Aula 08, seção 8.3 (figura de FCs típicos da aula)."
      nota="A aula não cita a procedência das faixas; o til (~) é dela: os valores são aproximados. Os rótulos de fonte são os da aula."
    >
      {[0, 20, 40, 60, 80, 100].map((t) => (
        <g key={t}>
          <line x1={x(t)} y1={topo - 6} x2={x(t)} y2={fundo} className="dg-grade" />
          <text x={x(t)} y={fundo + 18} className="dg-n dg-meio">
            {`${t}%`}
          </text>
        </g>
      ))}
      <line x1={x0} y1={fundo} x2={x1} y2={fundo} className="dg-eixo" />
      <text x={x1} y={fundo + 40} className="dg-eixo-titulo dg-fim">
        Fator de capacidade (% do máximo teórico)
      </text>
      {FAIXAS_CF.map((f, i) => {
        const y = topo + i * passo;
        return (
          <g key={f.fonte}>
            <text x={16} y={y + 17} className="dg-n dg-forte dg-negrito">
              {f.fonte}
            </text>
            <rect x={x(f.de)} y={y + 5} width={x(f.ate) - x(f.de)} height={16} className="dg-barra" />
            {/* rótulo à direita da barra; à esquerda quando a barra encosta no fim do eixo */}
            <text x={f.ate > 80 ? x(f.de) - 6 : x(f.ate) + 6} y={y + 17} className={f.ate > 80 ? 'dg-n dg-fim' : 'dg-n'}>
              {`~${f.de}–${f.ate}%`}
            </text>
          </g>
        );
      })}
    </Diagrama>
  );
}
