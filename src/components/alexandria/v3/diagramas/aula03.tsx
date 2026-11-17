// Aula 03 — D-A03-1 (DC × AC) e D-A03-2 (geração ≈ consumo → frequência).
// Dado: extraction/m01/aula-03.json — figura m01-a03-fig-01 (L1599–1619),
// "60 vezes por segundo — 60 Hz" (L1596) e o parágrafo L1636.

import { Diagrama, Ponta, escalaLinear } from './base';

const F_REDE = 60; // Hz, aula-03 L1596
const PERIODO_MS = 1000 / F_REDE; // 16,67 ms: derivado da frequência da aula

export function CorrenteDcAc() {
  const ox = 96;
  const ex = 690;
  const tmax = 70;
  const x = escalaLinear(0, tmax, ox, ex);
  const cima = { topo: 78, alt: 96 };
  const baixo = { topo: 214, alt: 96 };
  const yDc = escalaLinear(-1.4, 1.4, cima.topo + cima.alt, cima.topo);
  const yAc = escalaLinear(-1.4, 1.4, baixo.topo + baixo.alt, baixo.topo);
  const ciclos = 4;
  const n = 480;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = (i / n) * ciclos * PERIODO_MS;
    return `${i === 0 ? 'M' : 'L'}${x(t).toFixed(2)} ${yAc(Math.sin(2 * Math.PI * F_REDE * (t / 1000))).toFixed(2)}`;
  }).join(' ');
  const ticks = [0, 10, 20, 30, 40, 50, 60];
  const fim = baixo.topo + baixo.alt;
  return (
    <Diagrama
      titulo="Corrente contínua e corrente alternada"
      subtitulo="Tensão no tempo: constante em DC, senoidal a 60 Hz em AC"
      descricao="Dois gráficos de tensão contra tempo em milissegundos. Em cima, corrente contínua: uma linha horizontal constante. Embaixo, corrente alternada de 60 hertz: quatro ciclos de uma senoide, cada ciclo com 16,7 milissegundos."
      altura={fim + 70}
      fonte="Módulo 01, Aula 03, seções 3.1 e 3.2; figura da aula refeita com eixos."
      nota="Amplitude em unidade relativa: a aula não liga a figura a uma tensão em volts. O período de 16,7 ms (1 ÷ 60 s) é derivado da frequência da aula."
    >
      {/* DC */}
      <text x={ox} y={cima.topo - 8} className="dg-t dg-negrito">
        Corrente contínua (DC)
      </text>
      <text x={ex} y={cima.topo - 8} className="dg-s dg-fim">
        baterias, solar pré-inversor, eletrônica
      </text>
      <line x1={ox} y1={yDc(0)} x2={ex} y2={yDc(0)} className="dg-grade dg-tracejado" />
      <line x1={ox} y1={cima.topo} x2={ox} y2={cima.topo + cima.alt} className="dg-eixo" />
      <line x1={ox} y1={yDc(1)} x2={x(tmax)} y2={yDc(1)} className="dg-linha" />
      <text x={ox - 8} y={yDc(0) + 4} className="dg-n dg-fim">
        0
      </text>
      {/* AC */}
      <text x={ox} y={baixo.topo - 8} className="dg-t dg-negrito">
        Corrente alternada (AC) — 60 Hz
      </text>
      <text x={ex} y={baixo.topo - 8} className="dg-s dg-fim">
        padrão da rede pública brasileira
      </text>
      <line x1={ox} y1={yAc(0)} x2={ex} y2={yAc(0)} className="dg-grade dg-tracejado" />
      <line x1={ox} y1={baixo.topo} x2={ox} y2={baixo.topo + baixo.alt} className="dg-eixo" />
      <path d={pts} className="dg-linha" />
      <text x={ox - 8} y={yAc(0) + 4} className="dg-n dg-fim">
        0
      </text>
      {/* um ciclo */}
      <line x1={x(0)} y1={yAc(1.25)} x2={x(PERIODO_MS)} y2={yAc(1.25)} className="dg-fino" />
      <line x1={x(0)} y1={yAc(1.25) - 4} x2={x(0)} y2={yAc(1.25) + 4} className="dg-fino" />
      <line x1={x(PERIODO_MS)} y1={yAc(1.25) - 4} x2={x(PERIODO_MS)} y2={yAc(1.25) + 4} className="dg-fino" />
      <text x={x(PERIODO_MS) + 8} y={yAc(1.25) + 4} className="dg-n dg-forte">
        1 ciclo = 16,7 ms
      </text>
      {/* eixo do tempo */}
      <line x1={ox} y1={fim} x2={ex} y2={fim} className="dg-eixo" />
      {ticks.map((t) => (
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
      <text x={20} y={(cima.topo + fim) / 2} className="dg-eixo-titulo dg-meio" transform={`rotate(-90 20 ${(cima.topo + fim) / 2})`}>
        Tensão (unidade relativa)
      </text>
    </Diagrama>
  );
}

/** Seção 3.4: "Geração ≈ Consumo, em tempo real" e o parágrafo L1636. Sem número além dos 60 Hz. */
export function GeracaoConsumoFrequencia() {
  const estados = [
    { r: 'Geração = consumo', inc: 0, f: 'Frequência estável em 60 Hz', seta: null as null | 'cima' | 'baixo' },
    { r: 'Consumo maior que a geração', inc: 1, f: 'A frequência cai', seta: 'baixo' as const },
    { r: 'Geração maior que o consumo', inc: -1, f: 'A frequência sobe', seta: 'cima' as const },
  ];
  const larg = 224;
  return (
    <Diagrama
      titulo="Geração, consumo e frequência"
      subtitulo="Não há buffer físico: o desequilíbrio aparece na frequência, no mesmo instante"
      descricao="Três balanças de dois pratos, geração à esquerda e consumo à direita. Equilíbrio: frequência estável em 60 hertz. Consumo maior que a geração: a frequência cai. Geração maior que o consumo: a frequência sobe."
      altura={290}
      fonte="Módulo 01, Aula 03, seção 3.4."
      nota="Diagrama conceitual, sem escala: a aula não dá faixa nem valor de desvio de frequência, só os 60 Hz da rede brasileira."
    >
      {estados.map((e, i) => {
        const cx = 16 + i * (larg + 16) + larg / 2;
        const pivoY = 112;
        const meio = 74; // meia-viga
        const dy = e.inc * 16; // o lado do consumo (direita) desce quando inc > 0
        const yL = pivoY - dy;
        const yR = pivoY + dy;
        const painel = (px: number, py: number, r: string) => (
          <g>
            <line x1={px} y1={py} x2={px} y2={py + 30} className="dg-fino" />
            <rect x={px - 30} y={py + 30} width={60} height={9} className="dg-barra-suave" />
            <text x={px} y={py + 56} className="dg-s dg-meio dg-forte">
              {r}
            </text>
          </g>
        );
        return (
          <g key={e.r}>
            <rect x={cx - larg / 2} y={58} width={larg} height={200} className="dg-vazio" />
            <text x={cx} y={80} className="dg-t dg-meio dg-negrito">
              {e.r}
            </text>
            <line x1={cx} y1={pivoY} x2={cx} y2={pivoY + 88} className="dg-eixo" />
            <rect x={cx - 24} y={pivoY + 88} width={48} height={5} className="dg-barra" />
            <line x1={cx - meio} y1={yL} x2={cx + meio} y2={yR} className="dg-linha" />
            <circle cx={cx} cy={pivoY} r={4} className="dg-ponto" />
            {painel(cx - meio, yL, 'Geração')}
            {painel(cx + meio, yR, 'Consumo')}
            <text x={e.seta ? cx - 40 : cx} y={236} className={`dg-s dg-negrito ${e.seta ? 'dg-dest' : 'dg-forte dg-meio'}`}>
              {e.f}
            </text>
            {e.seta ? <Ponta x={cx - 56} y={e.seta === 'cima' ? 222 : 237} dir={e.seta} tam={11} /> : null}
          </g>
        );
      })}
    </Diagrama>
  );
}
