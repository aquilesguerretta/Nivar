// Diagramas do M02 (regra 3 da regra de imagem: visual comum de demonstração,
// com eixo, unidade e fonte dentro da figura). Todo número vem do texto da aula
// (alexandria-modulo-02-content.ts, conferido contra o HTML com 0 falta) ou, na
// curva líquida, do perfil horário do script do INST·04 (calculadoras/m02.ts).
// Nada é digitado sem a linha de fonte dizer de onde veio. Posse: porte do M02.

import type { ComponentType } from 'react';
import { Diagrama, Ponta, escalaLinear, escalaLog, fmt } from '../base';
import { PERFIL_CARGA } from '@/lib/data/calculadoras/m02';

// ── A01 · 1.1 — a cadeia de tensões ─────────────────────────────────────────
/** Os cinco passos do `div.chain` da seção 1.1, verbatim (faixa em volts para o eixo). */
const CADEIA = [
  { tensao: '13,8 – 18 kV', nome: 'Geração', obs: 'terminal da usina', de: 13_800, ate: 18_000 },
  { tensao: '230 – 765 kV', nome: 'Transmissão', obs: 'Rede Básica · ONS', de: 230_000, ate: 765_000 },
  { tensao: '69 – 138 kV', nome: 'Subtransmissão', obs: 'DIT / distribuidora', de: 69_000, ate: 138_000 },
  { tensao: '13,8 – 34,5 kV', nome: 'Distribuição MT', obs: 'Grupo A4 conecta aqui', de: 13_800, ate: 34_500 },
  { tensao: '127 – 440 V', nome: 'Distribuição BT', obs: 'Grupo B', de: 127, ate: 440 },
];

export function CadeiaDeTensoes() {
  const x0 = 300;
  const x1 = 670;
  const x = escalaLog(100, 1_000_000, x0, x1);
  const topo = 66;
  const passo = 46;
  const fundo = topo + CADEIA.length * passo;
  const ticks = [100, 1_000, 10_000, 100_000, 1_000_000];
  const rot = (v: number) => (v < 1000 ? `${v} V` : `${fmt(v / 1000)} kV`);
  return (
    <Diagrama
      titulo="A cadeia de tensões, da usina ao consumo"
      subtitulo="Os cinco trechos da seção 1.1, na ordem da cadeia, sobre um eixo logarítmico de tensão"
      descricao="Cinco faixas de tensão em escala logarítmica: geração, 13,8 a 18 kV; transmissão, 230 a 765 kV; subtransmissão, 69 a 138 kV; distribuição em média tensão, 13,8 a 34,5 kV; distribuição em baixa tensão, 127 a 440 V."
      altura={fundo + 62}
      fonte="Módulo 02, Aula 01, seção 1.1."
      nota="Escala logarítmica: cada linha da grade vale dez vezes a anterior. Faixas típicas da aula, sem procedência declarada."
    >
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} y1={topo - 6} x2={x(t)} y2={fundo} className="dg-grade" />
          <text x={x(t)} y={fundo + 18} className="dg-n dg-meio">{rot(t)}</text>
        </g>
      ))}
      <line x1={x0} y1={fundo} x2={x1} y2={fundo} className="dg-eixo" />
      <text x={x1} y={fundo + 40} className="dg-eixo-titulo dg-fim">Tensão (escala logarítmica)</text>
      {CADEIA.map((c, i) => {
        const y = topo + i * passo;
        const cy = y + 16;
        return (
          <g key={c.nome}>
            <text x={16} y={y + 12} className="dg-s dg-forte dg-negrito">{`${i + 1} · ${c.nome}`}</text>
            <text x={16} y={y + 28} className="dg-s dg-fraco">{c.obs}</text>
            <text x={x0 - 10} y={cy + 4} className="dg-n dg-fim">{c.tensao}</text>
            <rect x={x(c.de)} y={cy - 7} width={Math.max(4, x(c.ate) - x(c.de))} height={14} className="dg-barra" />
          </g>
        );
      })}
    </Diagrama>
  );
}

// ── A02 · 2.1 — perdas × tensão, mesma potência ─────────────────────────────
export function PerdasPorTensao() {
  const x0 = 70;
  const x1 = 690;
  const y0 = 276;
  const y1 = 96;
  const x = escalaLinear(1, 10, x0, x1);
  const y = escalaLinear(0, 100, y0, y1);
  const pontos: string[] = [];
  for (let k = 1; k <= 10.0001; k += 0.1) pontos.push(`${x(k).toFixed(1)},${y(100 / (k * k)).toFixed(1)}`);
  const marcas = [
    { k: 1, r: 'tensão original · perdas 100%' },
    { k: 2, r: 'tensão × 2 · perdas ÷ 4' },
    { k: 10, r: 'tensão × 10 · perdas ÷ 100' },
  ];
  return (
    <Diagrama
      titulo="Mesma potência, mais tensão: as perdas caem com o quadrado"
      subtitulo="Perdas relativas à tensão original, quando a tensão é multiplicada por um fator"
      descricao="Curva decrescente: com a tensão multiplicada por 2, as perdas caem para um quarto; multiplicada por 10, para um centésimo."
      altura={336}
      fonte="Módulo 02, Aula 02, seção 2.1 (Pperdas ∝ I² ∝ (P/V)²)."
      nota="Relação da aula, sem número de linha real: os três pontos marcados são os que o texto da seção 2.1 dá."
    >
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={x0} y1={y(v)} x2={x1} y2={y(v)} className="dg-grade" />
          <text x={x0 - 8} y={y(v) + 4} className="dg-n dg-fim">{`${v}%`}</text>
        </g>
      ))}
      {[1, 2, 4, 6, 8, 10].map((k) => (
        <text key={k} x={x(k)} y={y0 + 18} className="dg-n dg-meio">{`× ${k}`}</text>
      ))}
      <line x1={x0} y1={y0} x2={x1} y2={y0} className="dg-eixo" />
      <line x1={x0} y1={y0} x2={x0} y2={y1 - 6} className="dg-eixo" />
      <text x={x1} y={y0 + 38} className="dg-eixo-titulo dg-fim">Fator de multiplicação da tensão</text>
      <text x={x0 + 6} y={y1 - 30} className="dg-eixo-titulo">Perdas (% das perdas na tensão original)</text>
      <polyline points={pontos.join(' ')} className="dg-linha" />
      {marcas.map((m, i) => (
        <g key={m.k}>
          <circle cx={x(m.k)} cy={y(100 / (m.k * m.k))} r={4.5} className="dg-ponto-dest" />
          <text x={x(m.k) + (i === 2 ? -8 : 12)} y={y(100 / (m.k * m.k)) + (i === 0 ? 4 : -10)} className={`dg-s dg-forte ${i === 2 ? 'dg-fim' : ''}`}>{m.r}</text>
        </g>
      ))}
    </Diagrama>
  );
}

// ── A04 · 4.2/4.3 — carga total e carga líquida no cenário do INST·04 ────────
// Desenha o cenário resolvido do simulador: fica velado até a previsão
// (previsoes de modulos-v3/m02.ts, velarFiguras).
export function CurvaLiquida() {
  const pico = 95;
  const S = 30;
  const total: number[] = [];
  const liquida: number[] = [];
  for (let h = 0; h <= 24; h++) {
    const L = pico * PERFIL_CARGA[h];
    const s = h >= 6 && h <= 18 ? S * Math.pow(Math.max(0, Math.sin((Math.PI * (h - 6)) / 12)), 1.5) : 0;
    total.push(L);
    liquida.push(L - s);
  }
  const x0 = 70;
  const x1 = 690;
  const y0 = 270;
  const y1 = 70;
  const x = escalaLinear(0, 24, x0, x1);
  const y = escalaLinear(40, 100, y0, y1);
  const linha = (vs: number[]) => vs.map((v, h) => `${x(h).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return (
    <Diagrama
      titulo="Carga total e carga líquida ao longo do dia"
      subtitulo="Cenário-padrão do simulador da seção 4.3: pico de 95 GW, 30 GW de solar instalada, céu limpo"
      descricao="Duas curvas horárias de 0 a 24 horas. A carga total sobe de madrugada até o pico no início da noite. A carga líquida, que desconta a solar, afunda no meio do dia e sobe rápido quando o sol se põe."
      altura={330}
      fonte="Módulo 02, Aula 04, seção 4.3 (perfil horário e solar do simulador da aula)."
      nota="Curvas didáticas do instrumento, com formato típico do SIN; não são dado medido. Sem eólica no cenário."
    >
      {[40, 60, 80, 100].map((v) => (
        <g key={v}>
          <line x1={x0} y1={y(v)} x2={x1} y2={y(v)} className="dg-grade" />
          <text x={x0 - 8} y={y(v) + 4} className="dg-n dg-fim">{v}</text>
        </g>
      ))}
      {[0, 6, 12, 18, 24].map((h) => (
        <text key={h} x={x(h)} y={y0 + 18} className="dg-n dg-meio">{`${h}h`}</text>
      ))}
      <line x1={x0} y1={y0} x2={x1} y2={y0} className="dg-eixo" />
      <line x1={x0} y1={y0} x2={x0} y2={y1 - 6} className="dg-eixo" />
      <text x={x1} y={y0 + 38} className="dg-eixo-titulo dg-fim">Hora do dia</text>
      <text x={x0 + 6} y={y1 - 10} className="dg-eixo-titulo">Potência (GW)</text>
      <polyline points={linha(total)} className="dg-linha-suave" />
      <polyline points={linha(liquida)} className="dg-linha-dest" />
      <text x={x(2)} y={y(total[2]) - 10} className="dg-s">Carga total</text>
      <text x={x(12)} y={y(liquida[12]) + 20} className="dg-s dg-dest dg-meio">Carga líquida</text>
    </Diagrama>
  );
}

// ── A06 · 6.2 — a cascata de horizontes ─────────────────────────────────────
const ETAPAS = [
  { nome: 'PMO', longo: 'Programa Mensal', horizonte: 'mês, por semanas' },
  { nome: 'PDO', longo: 'Programa Diário', horizonte: 'dia seguinte, por hora' },
  { nome: 'Tempo real', longo: '', horizonte: 'agora, segundos a minutos' },
  { nome: 'Pós-operação', longo: '', horizonte: 'depois' },
];

export function HorizontesDaOperacao() {
  const larg = 150;
  const gap = 24;
  const x0 = 16;
  const y = 74;
  const alt = 86;
  return (
    <Diagrama
      titulo="Do mês ao segundo: a cascata de horizontes da operação"
      subtitulo="Cada etapa reduz incerteza e custo, e entrega à seguinte um plano mais fino"
      descricao="Quatro caixas ligadas por setas: PMO, mês por semanas; PDO, dia seguinte por hora; tempo real, segundos a minutos; pós-operação, depois."
      altura={210}
      fonte="Módulo 02, Aula 06, seção 6.2 (tabela de etapas)."
    >
      {ETAPAS.map((e, i) => {
        const x = x0 + i * (larg + gap);
        return (
          <g key={e.nome}>
            <rect x={x} y={y} width={larg} height={alt} className="dg-vazio" />
            <text x={x + larg / 2} y={y + 28} className="dg-s dg-meio dg-forte dg-negrito">{e.nome}</text>
            {e.longo ? <text x={x + larg / 2} y={y + 46} className="dg-s dg-meio dg-fraco">{e.longo}</text> : null}
            <text x={x + larg / 2} y={y + 70} className="dg-n dg-meio">{e.horizonte}</text>
            {i < ETAPAS.length - 1 ? (
              <>
                <line x1={x + larg + 2} y1={y + alt / 2} x2={x + larg + gap - 4} y2={y + alt / 2} className="dg-eixo" />
                <Ponta x={x + larg + gap - 2} y={y + alt / 2} dir="direita" />
              </>
            ) : null}
          </g>
        );
      })}
      <text x={x0} y={y + alt + 30} className="dg-eixo-titulo">Horizonte cada vez mais curto →</text>
    </Diagrama>
  );
}

// ── A08 · 8.4 — anatomia de uma falha em cascata ────────────────────────────
const CASCATA = [
  { etapa: 'Defeito local', linhas: ['Um curto, uma falha de equipamento,', 'uma linha que sai de operação.'] },
  { etapa: 'Proteção atua', linhas: ['Relés desligam o trecho com defeito — corretamente —', 'mas removem um caminho de fluxo.'] },
  { etapa: 'Sobrecarga vizinha', linhas: ['A potência que passava ali se redistribui para linhas', 'vizinhas, que podem sobrecarregar e também desarmar.'] },
  { etapa: 'Instabilidade', linhas: ['Se a perda é grande, frequência e tensão se deterioram', 'mais rápido do que as reservas conseguem responder.'] },
  { etapa: 'Corte ou colapso', linhas: ['O ERAC corta carga para salvar o resto. Se não basta:', 'separação em ilhas, colapso regional — e depois, black start.'] },
];

export function FalhaEmCascata() {
  const topo = 62;
  const passo = 62;
  const xCaixa = 16;
  const lCaixa = 190;
  return (
    <Diagrama
      titulo="Anatomia de uma falha em cascata"
      subtitulo="As cinco etapas da seção 8.4, em sequência: um defeito local pode se propagar em segundos"
      descricao="Cinco etapas ligadas por setas para baixo: defeito local; proteção atua; sobrecarga vizinha; instabilidade; corte ou colapso."
      altura={topo + CASCATA.length * passo + 20}
      fonte="Módulo 02, Aula 08, seção 8.4 (tabela de etapas)."
    >
      {CASCATA.map((c, i) => {
        const y = topo + i * passo;
        return (
          <g key={c.etapa}>
            <rect x={xCaixa} y={y} width={lCaixa} height={40} className={i === CASCATA.length - 1 ? 'dg-barra-suave' : 'dg-vazio'} />
            <text x={xCaixa + 12} y={y + 25} className="dg-s dg-forte dg-negrito">{`${i + 1} · ${c.etapa}`}</text>
            <text x={xCaixa + lCaixa + 18} y={y + 16} className="dg-s">{c.linhas[0]}</text>
            <text x={xCaixa + lCaixa + 18} y={y + 32} className="dg-s">{c.linhas[1]}</text>
            {i < CASCATA.length - 1 ? (
              <>
                <line x1={xCaixa + lCaixa / 2} y1={y + 41} x2={xCaixa + lCaixa / 2} y2={y + passo - 3} className="dg-eixo" />
                <Ponta x={xCaixa + lCaixa / 2} y={y + passo - 1} dir="baixo" />
              </>
            ) : null}
          </g>
        );
      })}
    </Diagrama>
  );
}

// ── A09 · 9.2 — perdas por trecho ───────────────────────────────────────────
const TRECHOS: { nome: string; base: string; de: number | null; ate: number | null; rotulo: string }[] = [
  { nome: 'Rede Básica (transmissão)', base: 'do transportado', de: 2, ate: 2, rotulo: '~2%' },
  { nome: 'Distribuição — técnicas', base: 'em média', de: 6, ate: 7, rotulo: '~6–7%' },
  { nome: 'Distribuição — não técnicas', base: 'média nacional de um dígito alto;', de: null, ate: null, rotulo: 'extremos regionais muito acima · sem número na tabela' },
  { nome: 'Total sistema (geração → tomada)', base: 'da injetada', de: 13, ate: 14, rotulo: '~13–14%' },
];

export function PerdasPorTrecho() {
  const x0 = 270;
  const x1 = 690;
  const x = escalaLinear(0, 16, x0, x1);
  const topo = 70;
  const passo = 54;
  const fundo = topo + TRECHOS.length * passo;
  return (
    <Diagrama
      titulo="Perdas por trecho, em ordem de grandeza"
      subtitulo="As quatro linhas da tabela da seção 9.2"
      descricao="Rede Básica, cerca de 2% do transportado; distribuição, perdas técnicas de cerca de 6 a 7% em média; perdas não técnicas sem número na tabela; total do sistema, cerca de 13 a 14% da energia injetada."
      altura={fundo + 62}
      fonte="Módulo 02, Aula 09, seção 9.2 (tabela de perdas)."
      nota="Ordens de grandeza da aula, cada uma na base que a tabela declara. As perdas não técnicas não têm número na tabela e ficam sem barra."
    >
      {[0, 4, 8, 12, 16].map((v) => (
        <g key={v}>
          <line x1={x(v)} y1={topo - 6} x2={x(v)} y2={fundo} className="dg-grade" />
          <text x={x(v)} y={fundo + 18} className="dg-n dg-meio">{`${v}%`}</text>
        </g>
      ))}
      <line x1={x0} y1={fundo} x2={x1} y2={fundo} className="dg-eixo" />
      <text x={x1} y={fundo + 40} className="dg-eixo-titulo dg-fim">Perdas (%)</text>
      {TRECHOS.map((t, i) => {
        const y = topo + i * passo;
        const cy = y + 18;
        return (
          <g key={t.nome}>
            <text x={16} y={y + 14} className="dg-s dg-forte dg-negrito">{t.nome}</text>
            <text x={16} y={y + 30} className="dg-s dg-fraco">{t.base}</text>
            {t.de === null || t.ate === null ? (
              <text x={x0 + 6} y={cy + 4} className="dg-s dg-fraco">{t.rotulo}</text>
            ) : (
              <>
                <rect x={x0} y={cy - 7} width={x(t.ate) - x0} height={14} className={i === TRECHOS.length - 1 ? 'dg-barra' : 'dg-barra-suave'} />
                {t.de !== t.ate ? <line x1={x(t.de)} y1={cy - 10} x2={x(t.de)} y2={cy + 10} className="dg-eixo" /> : null}
                <text x={x(t.ate) + 8} y={cy + 4} className="dg-n dg-forte">{t.rotulo}</text>
              </>
            )}
          </g>
        );
      })}
    </Diagrama>
  );
}

export const DIAGRAMAS_M02: Record<string, ComponentType> = {
  CadeiaDeTensoes,
  PerdasPorTensao,
  CurvaLiquida,
  HorizontesDaOperacao,
  FalhaEmCascata,
  PerdasPorTrecho,
};
