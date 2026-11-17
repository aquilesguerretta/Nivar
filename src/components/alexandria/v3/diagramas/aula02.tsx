// Aula 02 — D-A02-1 (escada de tensões) e D-A02-2 (cadeia de unidades).
// Dado: extraction/m01/aula-02.json, tabela 2.1 (L1496–1509) e o apoio da
// fórmula 2.3 (L1517).

import { Diagrama, Ponta, escalaLog } from './base';

interface Faixa {
  tensao: string;
  onde: string;
  quem: string;
  /** volts; `de === ate` é ponto; `aberta` = sem teto na tabela */
  de: number;
  ate: number;
  aberta?: boolean;
}

/** Tabela 2.1 da aula, verbatim. */
const FAIXAS: Faixa[] = [
  { tensao: '127 / 220 V', onde: 'Baixa tensão residencial e comercial', quem: 'Casas, lojas, pequenos comércios', de: 127, ate: 220 },
  { tensao: '220 / 380 / 440 V', onde: 'Baixa tensão trifásica', quem: 'Pequenas indústrias e cargas comerciais', de: 220, ate: 440 },
  { tensao: '13,8 kV', onde: 'Distribuição em média tensão', quem: 'Grandes comércios e indústrias médias (Grupo A4)', de: 13_800, ate: 13_800 },
  { tensao: '23 / 34,5 kV', onde: 'Distribuição média tensão expandida', quem: 'Indústrias maiores (A4 / A3a)', de: 23_000, ate: 34_500 },
  { tensao: '69 kV', onde: 'Subtransmissão', quem: 'Grandes consumidores industriais (A3)', de: 69_000, ate: 69_000 },
  { tensao: '88 / 138 kV', onde: 'Subtransmissão de alta capacidade', quem: 'Indústrias muito grandes (A2)', de: 88_000, ate: 138_000 },
  { tensao: '230 kV +', onde: 'Transmissão de alta tensão', quem: 'Indústrias eletrointensivas (A1)', de: 230_000, ate: 1_000_000, aberta: true },
];

export function EscadaDeTensoes() {
  const x0 = 392;
  const x1 = 690;
  const x = escalaLog(100, 1_000_000, x0, x1);
  const topo = 66;
  const passo = 50;
  const fundo = topo + FAIXAS.length * passo;
  const ticks = [
    { v: 100, r: '100 V' },
    { v: 1_000, r: '1 kV' },
    { v: 10_000, r: '10 kV' },
    { v: 100_000, r: '100 kV' },
    { v: 1_000_000, r: '1.000 kV' },
  ];
  return (
    <Diagrama
      titulo="Escada de tensões no Brasil"
      subtitulo="As sete linhas da tabela 2.1, sobre um eixo logarítmico de tensão"
      descricao="Sete faixas de tensão, de 127 e 220 volts até 230 quilovolts e acima, em escala logarítmica, cada uma com onde aparece e quem consome."
      altura={fundo + 66}
      fonte="Módulo 01, Aula 02, seção 2.1 (tabela de tensões da aula)."
      nota="Escala logarítmica. A tabela não traz tensões entre 1 kV e 13,8 kV nem entre 34,5 kV e 69 kV, e '230 kV +' não tem teto: a seta aberta indica isso. Procedência dos níveis não declarada na aula."
    >
      {ticks.map((t) => (
        <g key={t.v}>
          <line x1={x(t.v)} y1={topo - 6} x2={x(t.v)} y2={fundo} className="dg-grade" />
          <text x={x(t.v)} y={fundo + 18} className="dg-n dg-meio">
            {t.r}
          </text>
        </g>
      ))}
      <line x1={x0} y1={fundo} x2={x1} y2={fundo} className="dg-eixo" />
      <text x={x1} y={fundo + 40} className="dg-eixo-titulo dg-fim">
        Tensão (escala logarítmica)
      </text>
      {FAIXAS.map((f, i) => {
        const y = topo + i * passo;
        const cy = y + 20;
        return (
          <g key={f.tensao}>
            <text x={16} y={y + 12} className="dg-n dg-forte dg-negrito">
              {f.tensao}
            </text>
            <text x={16} y={y + 27} className="dg-s">
              {f.onde}
            </text>
            <text x={16} y={y + 41} className="dg-s dg-fraco">
              {f.quem}
            </text>
            {f.de === f.ate ? (
              <circle cx={x(f.de)} cy={cy} r={5} className="dg-ponto" />
            ) : (
              <>
                <rect x={x(f.de)} y={cy - 7} width={x(f.ate) - x(f.de)} height={14} className="dg-barra" />
                {f.aberta ? <Ponta x={x1 + 4} y={cy} dir="direita" tam={9} /> : null}
              </>
            )}
          </g>
        );
      })}
    </Diagrama>
  );
}

/** Apoio da fórmula 2.3 (L1517): V × A → W → kW → kWh × tarifa = custo. */
export function CadeiaDeUnidades() {
  const caixas = [
    { r: 'V × A', s: 'volt × ampere' },
    { r: 'W', s: 'potência' },
    { r: 'kW', s: 'quilowatt' },
    { r: 'kWh', s: 'energia' },
    { r: 'custo', s: 'R$' },
  ];
  const ops = ['=', '÷ 1.000', '× horas', '× tarifa'];
  const larg = 88;
  const alt = 64;
  const gap = 63;
  const x0 = 14;
  const y = 78;
  return (
    <Diagrama
      titulo="Da tensão e da corrente ao custo"
      subtitulo="A cadeia da seção 2.3: cada passo muda a grandeza e a unidade"
      descricao="Cinco caixas ligadas por setas: volts vezes amperes; watts; quilowatts; quilowatts-hora; custo em reais. Entre elas: igual; dividir por mil; multiplicar pelas horas; multiplicar pela tarifa."
      altura={184}
      fonte="Módulo 01, Aula 02, seção 2.3; 1 kW = 1.000 W e E = P × t, Aula 01, seções 1.3 e 1.4."
    >
      {caixas.map((c, i) => {
        const x = x0 + i * (larg + gap);
        return (
          <g key={c.r}>
            <rect x={x} y={y} width={larg} height={alt} className="dg-vazio" />
            <text x={x + larg / 2} y={y + 30} className="dg-n dg-meio dg-forte dg-negrito" fontSize={16}>
              {c.r}
            </text>
            <text x={x + larg / 2} y={y + 50} className="dg-s dg-meio">
              {c.s}
            </text>
          </g>
        );
      })}
      {ops.map((o, i) => {
        const xa = x0 + i * (larg + gap) + larg;
        const xb = xa + gap;
        return (
          <g key={`${o}${i}`}>
            <line x1={xa + 2} y1={y + alt / 2} x2={xb - 7} y2={y + alt / 2} className="dg-eixo" />
            <Ponta x={xb - 1} y={y + alt / 2} dir="direita" tam={8} />
            <text x={(xa + xb) / 2} y={y + alt / 2 - 8} className="dg-n dg-meio">
              {o}
            </text>
          </g>
        );
      })}
    </Diagrama>
  );
}
