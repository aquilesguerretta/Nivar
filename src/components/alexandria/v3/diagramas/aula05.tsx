// Aula 05 — D-A05-1 (capacidade que se paga × média que se usa) e D-A05-3
// (faixas de fator de carga). Dado: extraction/m01/aula-05.json — cenário-padrão
// do INST·04 (144.000 kWh em 720 h, demanda máxima 800 kW → média 200 kW,
// fator de carga 0,25), fórmulas L1763/L1769 e tabela L1811–1816.
//
// "FC" designa fator de carga aqui e fator de capacidade na Aula 08 (DIV-04):
// os rótulos escrevem "fator de carga" por extenso.

import { Diagrama, escalaLinear, fmt } from './base';

const KWH = 144_000;
const HORAS = 720;
const PMAX = 800;
const PMED = KWH / HORAS; // 200 kW, fórmula da aula
const FATOR = PMED / PMAX; // 0,25

export function DemandaMaximaMedia() {
  const ox = 116;
  const ex = 420;
  const oy = 78;
  const fy = 290;
  const y = escalaLinear(0, 800, fy, oy);
  const larg = 96;
  const barras = [
    { r: 'Demanda máxima', v: PMAX, c: 'dg-barra-suave' },
    { r: 'Demanda média', v: PMED, c: 'dg-barra' },
  ];
  return (
    <Diagrama
      titulo="A capacidade que se paga e a média que se usa"
      subtitulo="Cenário-padrão do instrumento: 144.000 kWh em 720 h, demanda máxima de 800 kW"
      descricao="Duas barras em quilowatts: demanda máxima de 800 kW e demanda média de 200 kW. A razão entre elas é o fator de carga, 0,25."
      altura={372}
      fonte="Módulo 01, Aula 05, seção 5.3 (cenário didático do instrumento 04)."
      nota="Demanda média = kWh consumido ÷ horas do período; fator de carga = demanda média ÷ demanda máxima (fórmulas da aula)."
    >
      {[0, 200, 400, 600, 800].map((t) => (
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
        const cx = ox + 80 + i * 150;
        return (
          <g key={b.r}>
            <rect x={cx - larg / 2} y={y(b.v)} width={larg} height={fy - y(b.v)} className={b.c} />
            <text x={cx} y={y(b.v) - 8} className="dg-n dg-meio dg-forte dg-negrito">
              {`${fmt(b.v)} kW`}
            </text>
            <text x={cx} y={fy + 20} className="dg-s dg-meio dg-forte">
              {b.r}
            </text>
          </g>
        );
      })}
      <text x={20} y={(oy + fy) / 2} className="dg-eixo-titulo dg-meio" transform={`rotate(-90 20 ${(oy + fy) / 2})`}>
        Demanda (kW)
      </text>
      {/* leitura */}
      <g>
        <text x={470} y={118} className="dg-s">
          Demanda média
        </text>
        <text x={470} y={138} className="dg-n dg-forte">
          {`${fmt(KWH)} kWh ÷ ${HORAS} h = ${fmt(PMED)} kW`}
        </text>
        <text x={470} y={182} className="dg-s">
          Fator de carga
        </text>
        <text x={470} y={202} className="dg-n dg-forte">
          {`${fmt(PMED)} kW ÷ ${fmt(PMAX)} kW = ${fmt(FATOR, 2, 2)}`}
        </text>
        <text x={470} y={238} className="dg-n dg-dest dg-negrito" fontSize={20}>
          {`${fmt(FATOR * 100)}%`}
        </text>
        <text x={470} y={258} className="dg-s">
          da capacidade que se paga
        </text>
        <text x={470} y={274} className="dg-s">
          é usada, em média
        </text>
      </g>
    </Diagrama>
  );
}

/** Tabela L1811–1816, verbatim. A fonte não diz nada acima de 0,90. */
const FAIXAS = [
  { r: '0,70 – 0,90', de: 0.7, ate: 0.9, perfil: ['Operação contínua,', 'carga estável (24/7)'] },
  { r: '0,40 – 0,70', de: 0.4, ate: 0.7, perfil: ['Operação em turnos,', 'sazonalidade moderada'] },
  { r: '0,15 – 0,40', de: 0.15, ate: 0.4, perfil: ['Picos altos, operação concentrada,', 'partidas simultâneas'] },
  { r: '< 0,15', de: 0, ate: 0.15, perfil: ['Padrão raro — pode indicar erro de medição', 'ou contratação superdimensionada'] },
] as const;

export function FaixasFatorDeCarga() {
  const x0 = 366;
  const x1 = 690;
  const x = escalaLinear(0, 1, x0, x1);
  const topo = 98;
  const passo = 54;
  const fundo = topo + FAIXAS.length * passo;
  return (
    <Diagrama
      titulo="Como ler o fator de carga"
      subtitulo="As quatro faixas da tabela 5.4, com o cenário do instrumento marcado"
      descricao="Régua de fator de carga de 0 a 1 com quatro faixas: 0,70 a 0,90, operação contínua; 0,40 a 0,70, operação em turnos; 0,15 a 0,40, picos altos; abaixo de 0,15, padrão raro. O cenário do instrumento, 0,25, cai na faixa de 0,15 a 0,40."
      altura={fundo + 76}
      fonte="Módulo 01, Aula 05, seção 5.4 (tabela de leitura do fator de carga)."
      nota="A tabela não traz faixa acima de 0,90: aquele trecho fica vazio, de propósito. As bordas 0,15, 0,40 e 0,70 aparecem nas duas faixas vizinhas, como na tabela."
    >
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={x(t)} y1={topo - 8} x2={x(t)} y2={fundo} className="dg-grade" />
          <text x={x(t)} y={fundo + 18} className="dg-n dg-meio">
            {fmt(t, 2, t === 0 || t === 1 ? 0 : 2)}
          </text>
        </g>
      ))}
      <line x1={x0} y1={fundo} x2={x1} y2={fundo} className="dg-eixo" />
      <text x={x1} y={fundo + 40} className="dg-eixo-titulo dg-fim">
        Fator de carga (adimensional)
      </text>
      <rect x={x(0.9)} y={topo} width={x(1) - x(0.9)} height={FAIXAS.length * passo - 6} className="dg-vazio dg-tracejado" />
      <text x={(x(0.9) + x(1)) / 2 + 4} y={topo + 100} className="dg-s dg-meio" fontSize={11} transform={`rotate(-90 ${(x(0.9) + x(1)) / 2 + 4} ${topo + 100})`}>
        sem faixa na tabela
      </text>
      {FAIXAS.map((f, i) => {
        const y = topo + i * passo;
        return (
          <g key={f.r}>
            <text x={16} y={y + 16} className="dg-n dg-forte dg-negrito">
              {f.r}
            </text>
            <text x={16} y={y + 31} className="dg-s">
              {f.perfil[0]}
            </text>
            <text x={16} y={y + 44} className="dg-s">
              {f.perfil[1]}
            </text>
            <rect x={x(f.de)} y={y + 10} width={x(f.ate) - x(f.de)} height={24} className="dg-barra" />
          </g>
        );
      })}
      <line x1={x(FATOR)} y1={topo - 14} x2={x(FATOR)} y2={fundo} className="dg-linha-dest" />
      <text x={x(FATOR) + 8} y={topo - 24} className="dg-n dg-dest dg-negrito">
        cenário do instrumento: 0,25
      </text>
    </Diagrama>
  );
}
