// Aula 06 — D-A06-1 (grupos e subgrupos por tensão) e D-A06-2 (mono, bi e
// trifásico). Dado: extraction/m01/aula-06.json, tabelas L1843 (grupos), L1856
// (subgrupos) e L1884 (fases), e o verbete "Trifásico" do § Lex (L2661: "três
// fases defasadas em 120°"). Mesma escala logarítmica de tensão da escada da
// Aula 02, para as duas figuras se lerem juntas.
//
// Decisão 1 de 15/11/2026 (QA-M01-A06): o Grupo A vai, em regra, de 2,3 kV para
// cima; a exceção é o AS, que a tabela 6.2 lista abaixo de 2,3 kV.

import { Diagrama, Ponta, escalaLinear, escalaLog, fmt } from './base';

interface Linha {
  nome: string;
  tensao: string;
  perfil: string;
  /** kV */
  de: number;
  ate: number;
  /** extremo sem limite na tabela */
  aberta?: 'direita' | 'esquerda';
  /** sobrepõe o intervalo de outra linha por construção */
  tracejada?: boolean;
  ponto?: boolean;
}

const KV_MIN = 0.1;
const KV_MAX = 1000;

/** Tabelas da aula, verbatim. */
const LINHAS: Linha[] = [
  { nome: 'Grupo B', tensao: 'Baixa tensão (< 2,3 kV)', perfil: 'Residências, pequenos comércios, pequenas propriedades rurais', de: KV_MIN, ate: 2.3, aberta: 'esquerda' },
  { nome: 'Grupo A', tensao: 'Alta e média tensão (em regra, ≥ 2,3 kV)', perfil: 'Indústrias, grandes comércios, grandes consumidores', de: 2.3, ate: KV_MAX, aberta: 'direita' },
  { nome: 'A1', tensao: '≥ 230 kV', perfil: 'Indústrias eletrointensivas', de: 230, ate: KV_MAX, aberta: 'direita' },
  { nome: 'A2', tensao: '88 a 138 kV', perfil: 'Grandes indústrias e parques industriais', de: 88, ate: 138 },
  { nome: 'A3', tensao: '69 kV', perfil: 'Indústrias de grande porte', de: 69, ate: 69, ponto: true },
  { nome: 'A3a', tensao: '30 a 44 kV', perfil: 'Indústrias médias e grandes', de: 30, ate: 44 },
  { nome: 'A4', tensao: '2,3 a 25 kV', perfil: 'Indústrias médias e grandes comércios', de: 2.3, ate: 25 },
  { nome: 'AS', tensao: '< 2,3 kV (subterrâneo)', perfil: 'Centros urbanos com rede subterrânea', de: KV_MIN, ate: 2.3, aberta: 'esquerda', tracejada: true },
];

export function SubgruposPorTensao() {
  const x0 = 392;
  const x1 = 690;
  const x = escalaLog(KV_MIN, KV_MAX, x0, x1);
  const topo = 66;
  const passo = 40;
  const sep = 14; // respiro entre grupos e subgrupos
  const yDe = (i: number) => topo + i * passo + (i >= 2 ? sep : 0);
  const fundo = yDe(LINHAS.length - 1) + passo;
  const ticks = [
    { v: 0.1, r: '0,1 kV' },
    { v: 1, r: '1 kV' },
    { v: 10, r: '10 kV' },
    { v: 100, r: '100 kV' },
    { v: 1000, r: '1.000 kV' },
  ];
  return (
    <Diagrama
      titulo="Grupos e subgrupos tarifários por tensão"
      subtitulo="Grupo B e Grupo A, e os subgrupos A1 a AS, sobre o eixo de tensão"
      descricao="Faixas de tensão em escala logarítmica: Grupo B abaixo de 2,3 quilovolts; Grupo A, em regra, de 2,3 quilovolts para cima; subgrupos A1, 230 quilovolts ou mais; A2, 88 a 138; A3, 69; A3a, 30 a 44; A4, 2,3 a 25; AS, abaixo de 2,3, subterrâneo: a exceção à regra do Grupo A."
      altura={fundo + 74}
      fonte="Módulo 01, Aula 06, seções 6.1 e 6.2 (tabelas de grupos e subgrupos da aula)."
      nota="Mesma escala da escada de tensões da Aula 02. A tabela não define subgrupo para 25–30 kV, 44–69 kV e 138–230 kV: esses trechos ficam vazios. AS (tracejado) fica abaixo de 2,3 kV, no mesmo intervalo do Grupo B: é a exceção à regra do Grupo A."
    >
      {ticks.map((t) => (
        <g key={t.v}>
          <line x1={x(t.v)} y1={topo - 8} x2={x(t.v)} y2={fundo} className="dg-grade" />
          <text x={x(t.v)} y={fundo + 18} className="dg-n dg-meio">
            {t.r}
          </text>
        </g>
      ))}
      <line x1={x0} y1={fundo} x2={x1} y2={fundo} className="dg-eixo" />
      <text x={x1} y={fundo + 40} className="dg-eixo-titulo dg-fim">
        Tensão (kV, escala logarítmica)
      </text>
      <line x1={16} y1={yDe(2) - 8} x2={x1} y2={yDe(2) - 8} className="dg-grade" />
      {LINHAS.map((l, i) => {
        const y = yDe(i);
        const cy = y + 14;
        const xa = x(l.de);
        const xb = x(l.ate);
        return (
          <g key={l.nome}>
            <text x={16} y={y + 12} className="dg-n dg-forte dg-negrito">
              {`${l.nome} · ${l.tensao}`}
            </text>
            <text x={16} y={y + 27} className="dg-s">
              {l.perfil}
            </text>
            {l.ponto ? (
              <circle cx={xa} cy={cy} r={5} className="dg-ponto" />
            ) : l.tracejada ? (
              <rect x={xa} y={cy - 7} width={xb - xa} height={14} className="dg-vazio dg-tracejado" />
            ) : (
              <rect x={xa} y={cy - 7} width={xb - xa} height={14} className={i < 2 ? 'dg-barra-suave' : 'dg-barra'} />
            )}
            {l.aberta === 'direita' ? <Ponta x={x1 + 4} y={cy} dir="direita" tam={9} /> : null}
            {l.aberta === 'esquerda' ? <Ponta x={x0 - 4} y={cy} dir="esquerda" tam={9} /> : null}
          </g>
        );
      })}
    </Diagrama>
  );
}

// ── D-A06-2 · Mono, bi e trifásico ─────────────────────────────────────────

/** 60 Hz (Aula 03, L1596): um ciclo dura 1000/60 ≈ 16,7 ms. */
const PERIODO_MS = 1000 / 60;
/** § Lex, verbete "Trifásico" (L2661): três fases defasadas em 120°. */
const DEFASAGEM_GRAUS = 120;
/** Tabela 6.4 (L1884), coluna "Limitação típica": "≤ ~10 kW" e "acima de ~15 kW". */
const MONO_ATE_KW = 10;
const TRI_DESDE_KW = 15;

export function SistemasDeFases() {
  const ox = 70;
  const ex = 690;
  const tmax = 2 * PERIODO_MS;
  const x = escalaLinear(0, tmax, ox, ex);
  const topo = 84;
  const alt = 120;
  const y = escalaLinear(-1.25, 1.25, topo + alt, topo);
  const atraso = (DEFASAGEM_GRAUS / 360) * PERIODO_MS;
  const fases = [
    { nome: 'fase 1', d: 0, classe: 'dg-linha' },
    { nome: 'fase 2', d: atraso, classe: 'dg-linha-suave' },
    { nome: 'fase 3', d: 2 * atraso, classe: 'dg-linha-dest' },
  ];
  const onda = (d: number) =>
    Array.from({ length: 361 }, (_, i) => {
      const t = (i / 360) * tmax;
      return `${i === 0 ? 'M' : 'L'}${x(t).toFixed(2)} ${y(Math.sin((2 * Math.PI * (t - d)) / PERIODO_MS)).toFixed(2)}`;
    }).join(' ');
  /** Pico de cada fase no primeiro ciclo: t = defasagem + T/4. */
  const pico = (d: number) => x(d + PERIODO_MS / 4);
  const fundoOnda = topo + alt;
  const eixoT = fundoOnda + 50;

  // Régua de potência da tabela 6.4.
  const rTopo = eixoT + 92;
  const k = escalaLinear(0, 25, 310, ex);
  const linhas = [
    { nome: 'Monofásico', lim: 'Cargas pequenas (≤ ~10 kW), sem motores grandes' },
    { nome: 'Bifásico', lim: 'Limites regionais variam' },
    { nome: 'Trifásico', lim: 'Padrão acima de ~15 kW' },
  ];
  const passo = 44;
  const rFundo = rTopo + linhas.length * passo;
  const yl = (i: number) => rTopo + i * passo + 22;
  return (
    <Diagrama
      titulo="Monofásico, bifásico e trifásico"
      subtitulo="Em cima, as três fases do trifásico a 60 Hz; embaixo, a limitação típica de cada sistema, em kW"
      descricao={`Em cima, três senoides de 60 hertz, uma por fase, deslocadas de 120 graus, cerca de ${fmt(atraso, 1, 1)} milissegundos, uma da outra, ao longo de dois ciclos. Embaixo, uma régua de potência em quilowatts: monofásico até cerca de 10 kW; trifásico como padrão acima de cerca de 15 kW; o bifásico fica acima do monofásico, com limites que variam por região e sem número na tabela.`}
      altura={rFundo + 70}
      fonte="Módulo 01, Aula 06, seção 6.4 (tabela de sistemas) e verbete “Trifásico” do glossário do módulo (três fases defasadas em 120°); 60 Hz da Aula 03."
      nota="Amplitude relativa: a aula não dá a tensão de cada fase. A tabela não dá faixa em kW para o bifásico (“limites regionais variam”), por isso ele não tem barra."
    >
      <text x={ox} y={topo - 14} className="dg-t dg-negrito">
        {`Trifásico: três fases defasadas em ${DEFASAGEM_GRAUS}°`}
      </text>
      <line x1={ox} y1={y(0)} x2={ex} y2={y(0)} className="dg-grade dg-tracejado" />
      <line x1={ox} y1={topo} x2={ox} y2={fundoOnda} className="dg-eixo" />
      {fases.map((f) => (
        <path key={f.nome} d={onda(f.d)} className={f.classe} />
      ))}
      {fases.map((f, i) => (
        <text key={`r${f.nome}`} x={pico(f.d)} y={y(1) - 8} className={`dg-n dg-meio dg-negrito ${i === 2 ? 'dg-dest' : 'dg-forte'}`}>
          {f.nome}
        </text>
      ))}
      {[0, 1].map((i) => {
        const xa = pico(fases[i].d);
        const xb = pico(fases[i + 1].d);
        const yc = fundoOnda + 12;
        return (
          <g key={`c${i}`}>
            <line x1={xa} y1={yc} x2={xb} y2={yc} className="dg-fino" />
            <line x1={xa} y1={yc - 4} x2={xa} y2={yc + 4} className="dg-fino" />
            <line x1={xb} y1={yc - 4} x2={xb} y2={yc + 4} className="dg-fino" />
            <text x={(xa + xb) / 2} y={yc + 16} className="dg-n dg-meio">
              {`${DEFASAGEM_GRAUS}° ≈ ${fmt(atraso, 1, 1)} ms`}
            </text>
          </g>
        );
      })}
      <line x1={ox} y1={eixoT} x2={ex} y2={eixoT} className="dg-eixo" />
      {[0, 5, 10, 15, 20, 25, 30].map((t) => (
        <g key={`t${t}`}>
          <line x1={x(t)} y1={eixoT} x2={x(t)} y2={eixoT + 5} className="dg-eixo" />
          <text x={x(t)} y={eixoT + 19} className="dg-n dg-meio">
            {t}
          </text>
        </g>
      ))}
      <text x={ex} y={eixoT + 38} className="dg-eixo-titulo dg-fim">
        Tempo (ms) · um ciclo a 60 Hz ≈ 16,7 ms
      </text>
      <text x={26} y={topo + alt / 2} className="dg-eixo-titulo dg-meio" transform={`rotate(-90 26 ${topo + alt / 2})`}>
        Tensão (relativa)
      </text>

      {[0, 5, 10, 15, 20, 25].map((t) => (
        <g key={`k${t}`}>
          <line x1={k(t)} y1={rTopo} x2={k(t)} y2={rFundo} className="dg-grade" />
          <text x={k(t)} y={rFundo + 18} className="dg-n dg-meio">
            {t}
          </text>
        </g>
      ))}
      <line x1={k(0)} y1={rFundo} x2={ex} y2={rFundo} className="dg-eixo" />
      <text x={ex} y={rFundo + 40} className="dg-eixo-titulo dg-fim">
        Potência da carga (kW)
      </text>
      {linhas.map((l, i) => (
        <g key={l.nome}>
          <text x={16} y={yl(i) - 4} className="dg-n dg-forte dg-negrito">
            {l.nome}
          </text>
          <text x={16} y={yl(i) + 11} className="dg-s" fontSize={11}>
            {l.lim}
          </text>
        </g>
      ))}
      <rect x={k(0)} y={yl(0) - 13} width={k(MONO_ATE_KW) - k(0)} height={16} className="dg-barra" />
      <text x={k(MONO_ATE_KW) + 6} y={yl(0)} className="dg-n">
        ≤ ~10 kW
      </text>
      <text x={k(MONO_ATE_KW) + 6} y={yl(1)} className="dg-s dg-fraco">
        acima do monofásico · sem número na tabela
      </text>
      <rect x={k(TRI_DESDE_KW)} y={yl(2) - 13} width={ex - k(TRI_DESDE_KW)} height={16} className="dg-barra" />
      <Ponta x={ex + 11} y={yl(2) - 5} dir="direita" tam={9} />
      <text x={k(TRI_DESDE_KW) - 6} y={yl(2)} className="dg-n dg-fim">
        acima de ~15 kW
      </text>
    </Diagrama>
  );
}
