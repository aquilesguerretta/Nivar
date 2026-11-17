// Diagramas do M03 (regra 3: visual comum de demonstração, com eixo, unidade e fonte
// dentro da figura). Todo número vem do texto da aula (alexandria-modulo-03-content.ts,
// conferido contra o HTML com 0 falta). Posse: a sessão de porte do M03.

import type { ComponentType } from 'react';
import { Diagrama, Ponta, escalaLinear } from '../base';

// ── A01 · tabela de fator de capacidade típico no Brasil ────────────────────
/** As sete linhas da tabela da Aula 01, verbatim. `de`/`ate` em %; `aberta` = a tabela não dá a ponta. */
const FCS: { fonte: string; faixa: string; governa: string; de: number; ate: number; abertaEsq?: boolean; abertaDir?: boolean; ponto?: boolean }[] = [
  { fonte: 'Hidro com reservatório', faixa: '~50–55%', governa: 'Hidrologia + decisão de despacho', de: 50, ate: 55 },
  { fonte: "Hidro fio d'água", faixa: '~40–55%, sazonal', governa: 'A vazão do rio', de: 40, ate: 55 },
  { fonte: 'Eólica (Nordeste)', faixa: '~40–55%', governa: 'Alísios', de: 40, ate: 55 },
  { fonte: 'Solar UFV (com tracker)', faixa: '~25–30%', governa: 'O relógio e a latitude', de: 25, ate: 30 },
  { fonte: 'Biomassa (bagaço)', faixa: '~50% na safra, baixo fora', governa: 'O calendário da cana', de: 50, ate: 50, ponto: true },
  { fonte: 'Gás natural', faixa: 'de <15% a >60%', governa: 'O despacho', de: 15, ate: 60, abertaEsq: true, abertaDir: true },
  { fonte: 'Nuclear', faixa: '~85–90%', governa: 'Paradas programadas', de: 85, ate: 90 },
];

export function FatoresDeCapacidade() {
  const x0 = 330;
  const x1 = 700;
  const x = escalaLinear(0, 100, x0, x1);
  const topo = 64;
  const passo = 44;
  const fundo = topo + FCS.length * passo;
  return (
    <Diagrama
      titulo="Fator de capacidade típico no Brasil, por fonte"
      subtitulo="As sete linhas da tabela da Aula 01; faixa = ordem de grandeza que a aula dá"
      descricao="Faixas de fator de capacidade: hidro com reservatório, 50 a 55%; fio d'água, 40 a 55%, sazonal; eólica do Nordeste, 40 a 55%; solar com tracker, 25 a 30%; biomassa, cerca de 50% na safra e baixo fora; gás natural, de menos de 15% a mais de 60%; nuclear, 85 a 90%."
      altura={fundo + 66}
      fonte="Módulo 03, Aula 01 (tabela de FC típico no Brasil)."
      nota="Faixas do M03, como a aula as dá (EPE/ONS/ABEEólica/ABSOLAR, ordens de grandeza vivas, segundo a própria aula). Biomassa: a aula só dá ~50% na safra. Gás: setas abertas, porque a aula não dá as pontas."
    >
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={x(v)} y1={topo - 6} x2={x(v)} y2={fundo} className="dg-grade" />
          <text x={x(v)} y={fundo + 18} className="dg-n dg-meio">{`${v}%`}</text>
        </g>
      ))}
      <line x1={x0} y1={fundo} x2={x1} y2={fundo} className="dg-eixo" />
      <text x={x1} y={fundo + 40} className="dg-eixo-titulo dg-fim">Fator de capacidade (%)</text>
      {FCS.map((f, i) => {
        const y = topo + i * passo;
        const cy = y + 14;
        return (
          <g key={f.fonte}>
            <text x={16} y={y + 10} className="dg-s dg-forte dg-negrito">{f.fonte}</text>
            <text x={16} y={y + 26} className="dg-s dg-fraco">{`${f.faixa} · ${f.governa}`}</text>
            {f.ponto ? (
              <circle cx={x(f.de)} cy={cy} r={5} className="dg-ponto" />
            ) : (
              <>
                <rect x={x(f.de)} y={cy - 7} width={x(f.ate) - x(f.de)} height={14} className="dg-barra" />
                {f.abertaEsq ? <Ponta x={x(f.de) - 12} y={cy} dir="esquerda" tam={9} /> : null}
                {f.abertaDir ? <Ponta x={x(f.ate) + 12} y={cy} dir="direita" tam={9} /> : null}
              </>
            )}
          </g>
        );
      })}
    </Diagrama>
  );
}

// ── A04 · a curva de potência da turbina (bloco 1) ──────────────────────────
export function CurvaDePotencia() {
  const CUTIN = 3;
  const NOMINAL = 12;
  const CUTOUT = 25;
  const x0 = 70;
  const x1 = 690;
  const y0 = 270;
  const y1 = 80;
  const x = escalaLinear(0, 30, x0, x1);
  const y = escalaLinear(0, 100, y0, y1);
  const pontos: string[] = [`${x(0)},${y(0)}`, `${x(CUTIN)},${y(0)}`];
  for (let v = CUTIN; v <= NOMINAL + 1e-9; v += 0.25) pontos.push(`${x(v).toFixed(1)},${y(100 * Math.pow(v / NOMINAL, 3)).toFixed(1)}`);
  pontos.push(`${x(CUTOUT)},${y(100)}`, `${x(CUTOUT)},${y(0)}`, `${x(30)},${y(0)}`);
  const marcas = [
    { v: CUTIN, r: 'cut-in · ~3 m/s' },
    { v: NOMINAL, r: 'nominal · ~12 m/s' },
    { v: CUTOUT, r: 'cut-out · ~25 m/s' },
  ];
  return (
    <Diagrama
      titulo="A curva de potência de uma turbina eólica"
      subtitulo="Abaixo do cut-in não gira; até a nominal sobe com o cubo; até o cut-out entrega potência cheia; acima, desliga"
      descricao="Potência, em porcentagem da nominal, contra a velocidade do vento: zero até 3 metros por segundo; sobe seguindo o cubo até 12; fica em 100% até 25; acima de 25, zero."
      altura={330}
      fonte="Módulo 03, Aula 04 (a operação da máquina, abertura da aula)."
      nota="Forma esquemática: entre o cut-in e a nominal o desenho usa (v ÷ 12)³, porque a aula diz que a potência sobe seguindo o cubo; a curva real é a de cada modelo de turbina, como a própria aula diz."
    >
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={x0} y1={y(v)} x2={x1} y2={y(v)} className="dg-grade" />
          <text x={x0 - 8} y={y(v) + 4} className="dg-n dg-fim">{`${v}%`}</text>
        </g>
      ))}
      {[0, 5, 10, 15, 20, 25, 30].map((v) => (
        <text key={v} x={x(v)} y={y0 + 18} className="dg-n dg-meio">{v}</text>
      ))}
      <line x1={x0} y1={y0} x2={x1} y2={y0} className="dg-eixo" />
      <line x1={x0} y1={y0} x2={x0} y2={y1 - 6} className="dg-eixo" />
      <text x={x1} y={y0 + 38} className="dg-eixo-titulo dg-fim">Velocidade do vento (m/s)</text>
      <text x={x0 + 6} y={y1 - 22} className="dg-eixo-titulo">Potência (% da nominal)</text>
      <polyline points={pontos.join(' ')} className="dg-linha" />
      {marcas.map((m, i) => (
        <g key={m.v}>
          <line x1={x(m.v)} y1={y1} x2={x(m.v)} y2={y0} className="dg-tracejado" />
          <text x={x(m.v) + (i === 2 ? -6 : 6)} y={y1 + 14 + i * 16} className={`dg-s dg-forte ${i === 2 ? 'dg-fim' : ''}`}>{m.r}</text>
        </g>
      ))}
    </Diagrama>
  );
}

// ── A08 · o parque nuclear no tempo ─────────────────────────────────────────
const MARCOS: { ano: number; r: string; baixo?: boolean; alto?: number }[] = [
  { ano: 1984, r: 'Angra 3 iniciada', baixo: true },
  { ano: 1985, r: 'Angra 1 em operação (640 MW)', alto: 84 },
  { ano: 2001, r: 'Angra 2 em operação (1.350 MW)', alto: 58 },
  { ano: 2025, r: 'Fim de 2025: fatia na Eletronuclear vendida à Âmbar', baixo: true },
];

export function ParqueNuclear() {
  const x0 = 60;
  const x1 = 680;
  const x = escalaLinear(1980, 2030, x0, x1);
  const yLinha = 186;
  return (
    <Diagrama
      titulo="Angra 1, Angra 2 e o canteiro de Angra 3"
      subtitulo="Os marcos que a seção 8.1 dá; a decisão sobre Angra 3 estava pendente na última verificação da aula (jun/2026)"
      descricao="Linha do tempo de 1980 a 2030: Angra 3 iniciada em 1984; Angra 1 em operação desde 1985; Angra 2 desde 2001; no fim de 2025, a fatia na Eletronuclear vendida à Âmbar. A decisão sobre concluir Angra 3 segue pendente."
      altura={286}
      fonte="Módulo 03, Aula 08, seção 8.1."
      nota="Números vivos, segundo a própria aula: a situação de Angra 3 pode ter mudado depois de jun/2026."
    >
      <line x1={x0} y1={yLinha} x2={x1} y2={yLinha} className="dg-eixo" />
      {[1980, 1990, 2000, 2010, 2020, 2030].map((a) => (
        <g key={a}>
          <line x1={x(a)} y1={yLinha - 4} x2={x(a)} y2={yLinha + 4} className="dg-eixo" />
          <text x={x(a)} y={yLinha + 20} className="dg-n dg-meio">{a}</text>
        </g>
      ))}
      <rect x={x(1984)} y={yLinha - 30} width={x(2026) - x(1984)} height={10} className="dg-barra-suave" />
      <text x={x(2004)} y={yLinha - 36} className="dg-s dg-fraco">Angra 3: canteiro desde 1984 — "39 anos de canteiro"</text>
      {MARCOS.map((m) => (
        <g key={m.ano}>
          <circle cx={x(m.ano)} cy={yLinha} r={5} className="dg-ponto-dest" />
          <line x1={x(m.ano)} y1={yLinha} x2={x(m.ano)} y2={m.baixo ? yLinha + 44 : yLinha - (m.alto ?? 56) + 4} className="dg-tracejado" />
          <text x={x(m.ano) + (m.ano > 2010 ? -6 : 6)} y={m.baixo ? yLinha + 58 : yLinha - (m.alto ?? 56)} className={`dg-s dg-forte ${m.ano > 2010 ? 'dg-fim' : ''}`}>{`${m.ano} · ${m.r}`}</text>
        </g>
      ))}
    </Diagrama>
  );
}

export const DIAGRAMAS_M03: Record<string, ComponentType> = { FatoresDeCapacidade, CurvaDePotencia, ParqueNuclear };
