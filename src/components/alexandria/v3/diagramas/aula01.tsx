// Aula 01 — D-A01-1 (escala de potência) e D-A01-2 (mesma energia, perfis
// opostos). Dado: extraction/m01/aula-01.json, tabela 1.3 (L1403–1406) e a nota
// do INST·01. Especificação: docs/alexandria-v3/figuras-m01.md.

import { Diagrama, escalaLinear, escalaLog, fmt } from './base';

/** Tabela 1.3 da aula, em watts. Procedência dos números: não declarada. */
const POTENCIAS = [
  { rotulo: 'Lâmpada LED', valor: 9, texto: '≈ 9 W' },
  { rotulo: 'Chuveiro elétrico', valor: 5500, texto: '≈ 5,5 kW' },
  { rotulo: 'Britador de mineração', valor: 2_000_000, texto: '≈ 2 MW' },
  { rotulo: 'Itaipu (capacidade)', valor: 14_000_000_000, texto: '≈ 14 GW' },
] as const;

const PREFIXOS = [
  { w: 1, r: '1 W' },
  { w: 1_000, r: '1 kW' },
  { w: 1_000_000, r: '1 MW' },
  { w: 1_000_000_000, r: '1 GW' },
] as const;

export function EscalaDePotencia() {
  const x0 = 56;
  const x1 = 676;
  const eixoY = 168;
  const x = escalaLog(1, 100_000_000_000, x0, x1);
  const decadas = Array.from({ length: 12 }, (_, i) => 10 ** i);
  const alturas = [92, 118, 92, 118];
  return (
    <Diagrama
      titulo="Escala de potência, do watt ao gigawatt"
      subtitulo="Quatro exemplos da tabela 1.3 da aula, sobre um eixo em que cada passo vale mil vezes o anterior"
      descricao="Eixo horizontal logarítmico de potência, de 1 W a 100 GW, com quatro marcas: lâmpada LED, cerca de 9 W; chuveiro elétrico, cerca de 5,5 kW; britador de mineração, cerca de 2 MW; Itaipu, cerca de 14 GW de capacidade."
      altura={236}
      fonte="Módulo 01, Aula 01, seção 1.3 (valores da aula)."
      nota="Escala logarítmica: a distância entre dois traços principais é de mil vezes. Procedência dos valores não declarada na aula."
    >
      <line x1={x0} y1={eixoY} x2={x1} y2={eixoY} className="dg-eixo" />
      {decadas.map((d) => (
        <line key={d} x1={x(d)} y1={eixoY} x2={x(d)} y2={eixoY + 5} className="dg-eixo" />
      ))}
      {PREFIXOS.map((p) => (
        <g key={p.w}>
          <line x1={x(p.w)} y1={eixoY - 6} x2={x(p.w)} y2={eixoY + 9} className="dg-eixo" />
          <text x={x(p.w)} y={eixoY + 26} className="dg-n dg-meio">
            {p.r}
          </text>
        </g>
      ))}
      <text x={x1} y={eixoY + 50} className="dg-eixo-titulo dg-fim">
        Potência (escala logarítmica)
      </text>
      {POTENCIAS.map((p, i) => {
        const px = x(p.valor);
        const top = alturas[i];
        return (
          <g key={p.rotulo}>
            <line x1={px} y1={eixoY} x2={px} y2={top + 8} className="dg-fino" />
            <circle cx={px} cy={eixoY} r={4.5} className="dg-ponto-dest" />
            <text x={px} y={top - 8} className="dg-n dg-meio dg-forte dg-negrito">
              {p.texto}
            </text>
            <text x={px} y={top + 6} className="dg-s dg-meio" dy={0}>
              {p.rotulo}
            </text>
          </g>
        );
      })}
    </Diagrama>
  );
}

/** Cenários da nota do INST·01: ambos dão 50 kWh (execução do script, aula-01.json). */
export function EnergiaPotenciaTempo() {
  // dois painéis, cada um na própria escala (declarada no rótulo do eixo)
  const painel = (
    ox: number,
    pot: number,
    horas: number,
    xmax: number,
    ymax: number,
    xticks: number[],
    yticks: number[],
    titulo: string,
  ) => {
    const w = 270;
    const h = 150;
    const oy = 78;
    const ex = escalaLinear(0, xmax, ox, ox + w);
    const ey = escalaLinear(0, ymax, oy + h, oy);
    return (
      <g>
        <text x={ox} y={oy - 12} className="dg-t dg-negrito">
          {titulo}
        </text>
        {yticks.map((t) => (
          <g key={`y${t}`}>
            <line x1={ox} y1={ey(t)} x2={ox + w} y2={ey(t)} className="dg-grade" />
            <text x={ox - 8} y={ey(t) + 4} className="dg-n dg-fim">
              {fmt(t, 1)}
            </text>
          </g>
        ))}
        {xticks.map((t) => (
          <g key={`x${t}`}>
            <line x1={ex(t)} y1={oy + h} x2={ex(t)} y2={oy + h + 5} className="dg-eixo" />
            <text x={ex(t)} y={oy + h + 20} className="dg-n dg-meio">
              {fmt(t, 1)}
            </text>
          </g>
        ))}
        <rect x={ex(0)} y={ey(pot)} width={ex(horas) - ex(0)} height={ey(0) - ey(pot)} className="dg-area" />
        <line x1={ox} y1={oy} x2={ox} y2={oy + h} className="dg-eixo" />
        <line x1={ox} y1={oy + h} x2={ox + w} y2={oy + h} className="dg-eixo" />
        <text x={ox + w / 2} y={oy + h + 42} className="dg-eixo-titulo dg-meio">
          Tempo (h)
        </text>
        <text x={ox + w} y={oy + 14} className="dg-n dg-fim dg-forte dg-negrito">
          {`${fmt(pot, 1)} kW × ${fmt(horas, 1)} h = ${fmt(pot * horas)} kWh`}
        </text>
      </g>
    );
  };
  return (
    <Diagrama
      titulo="Mesma energia, perfis opostos"
      subtitulo="A área do retângulo é a energia: potência (kW) × tempo (h). Cada painel tem a própria escala."
      descricao="Dois retângulos de mesma área, 50 quilowatts-hora. À esquerda, 50 kW durante 1 hora: alto e estreito. À direita, 1 kW durante 50 horas: baixo e largo. As escalas dos eixos são diferentes nos dois painéis."
      altura={310}
      fonte="Módulo 01, Aula 01, seção 1.4 (cenários da nota do instrumento 01)."
      nota="Potência no eixo vertical (kW), tempo no horizontal (h). O painel da direita não cabe na escala do da esquerda: o eixo de cada painel vai até onde o retângulo precisa."
    >
      {painel(60, 50, 1, 2, 60, [0, 1, 2], [0, 20, 40, 60], 'Alta potência, curto')}
      {painel(400, 1, 50, 60, 2, [0, 20, 40, 60], [0, 1, 2], 'Baixa potência, longo')}
      <text x={14} y={160} className="dg-eixo-titulo dg-meio" transform="rotate(-90 14 160)">
        Potência (kW)
      </text>
      <text x={354} y={160} className="dg-eixo-titulo dg-meio" transform="rotate(-90 354 160)">
        Potência (kW)
      </text>
    </Diagrama>
  );
}
