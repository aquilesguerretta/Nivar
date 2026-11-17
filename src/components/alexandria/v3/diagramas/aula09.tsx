// Aula 09 — D-A09-1 (janela de medição de tensão). Dado:
// extraction/m01/aula-09.json, L2152: medição em intervalos de 10 minutos por
// pelo menos sete dias consecutivos, 1.008 leituras (7 × 24 × 6). A fonte não dá
// valor de tensão nem faixa em volts: o desenho mostra só a amostragem.
//
// D-A09-2 (fenômenos de tensão em forma de onda). Dado: tabela da seção 9.3
// (L2140), nome do fenômeno e "o que é", verbatim; três fases defasadas em 120°
// do verbete "Trifásico" do § Lex (L2661). A fonte não dá nenhuma magnitude
// (quanto afunda, quanto sobe, por quantos ciclos, que ordem harmônica): as
// formas são ILUSTRATIVAS, sem número em nenhum eixo, com a etiqueta "ilustrativo,
// sem escala de norma" na própria figura. Publicada pela decisão de 15/11/2026
// (docs/alexandria-v3/m01-decisoes.md).

import { Diagrama, escalaLinear, fmt } from './base';

const DIAS = 7;
const LEITURAS_POR_HORA = 6; // intervalo de 10 min
const POR_DIA = 24 * LEITURAS_POR_HORA; // 144
const TOTAL = DIAS * POR_DIA; // 1.008

export function JanelaDeMedicao() {
  const ox = 90;
  const ex = 666;
  const x = escalaLinear(0, 24, ox, ex);
  const topo = 100;
  const linha = 24;
  const fundo = topo + DIAS * linha;
  const ticksH = [0, 6, 12, 18, 24];
  return (
    <Diagrama
      titulo="A janela de medição de tensão"
      subtitulo={`Uma leitura a cada 10 minutos, durante 7 dias: ${fmt(TOTAL)} leituras`}
      descricao={`Sete linhas, uma por dia, cada uma com 144 marcas, uma por leitura de 10 minutos. Ao todo, 7 dias vezes 24 horas vezes 6 leituras por hora, 1.008 leituras.`}
      altura={fundo + 100}
      fonte="Módulo 01, Aula 09, seção 9.3 (janela de medição conforme a aula)."
      nota="O desenho mostra só a amostragem. A aula não traz valores de tensão nem as faixas adequada, precária e crítica em volts; DRP e DRC são calculados sobre essa amostra."
    >
      {/* intervalo de 10 min, ampliado */}
      <line x1={x(0)} y1={topo - 22} x2={x(1 / LEITURAS_POR_HORA)} y2={topo - 22} className="dg-fino" />
      <line x1={x(0)} y1={topo - 27} x2={x(0)} y2={topo - 17} className="dg-fino" />
      <line x1={x(1 / LEITURAS_POR_HORA)} y1={topo - 27} x2={x(1 / LEITURAS_POR_HORA)} y2={topo - 17} className="dg-fino" />
      <text x={x(1 / LEITURAS_POR_HORA) + 10} y={topo - 18} className="dg-n dg-forte">
        10 min entre leituras
      </text>
      {ticksH.map((t) => (
        <g key={t}>
          <line x1={x(t)} y1={topo - 8} x2={x(t)} y2={fundo} className="dg-grade" />
          <text x={x(t)} y={fundo + 18} className="dg-n dg-meio">
            {t}
          </text>
        </g>
      ))}
      {Array.from({ length: DIAS }, (_, d) => {
        const y = topo + d * linha;
        const marcas = Array.from({ length: POR_DIA }, (_, k) => `M${x(k / LEITURAS_POR_HORA).toFixed(2)} ${y + 3} v14`).join(' ');
        return (
          <g key={d}>
            <text x={ox - 10} y={y + 15} className="dg-n dg-fim">
              {`dia ${d + 1}`}
            </text>
            <path d={marcas} className="dg-fino" strokeWidth={1.2} />
          </g>
        );
      })}
      <line x1={ox} y1={fundo} x2={ex} y2={fundo} className="dg-eixo" />
      <text x={ex} y={fundo + 40} className="dg-eixo-titulo dg-fim">
        Hora do dia (h)
      </text>
      <text x={ox} y={fundo + 66} className="dg-n dg-forte dg-negrito">
        {`${DIAS} dias × 24 h × ${LEITURAS_POR_HORA} leituras por hora = ${fmt(TOTAL)} leituras`}
      </text>
    </Diagrama>
  );
}

// ── D-A09-2 · Fenômenos de tensão em forma de onda ─────────────────────────

type Onda = (t: number, fase: number) => number;

/** Fração de ciclo das três fases (§ Lex: defasadas em 120°). */
const TERCO = 1 / 3;
const seno = (t: number, fase = 0) => Math.sin(2 * Math.PI * (t - fase));
/** Janela que liga entre `a` e `b` (em ciclos), com rampa curta. */
const janela = (t: number, a: number, b: number) => {
  const r = 0.15;
  if (t < a - r || t > b + r) return 0;
  if (t < a) return (t - (a - r)) / r;
  if (t > b) return ((b + r) - t) / r;
  return 1;
};

/** Formas ilustrativas: nenhum coeficiente abaixo vem da aula, e por isso
 *  nenhum eixo da figura mostra número. */
const FENOMENOS: readonly { nome: string; oQueE: string; fases: number; onda: Onda }[] = [
  { nome: 'Sem perturbação', oQueE: 'referência para comparar', fases: 1, onda: (t) => seno(t) },
  {
    nome: 'Harmônicos',
    oQueE: 'Distorções na forma de onda elétrica',
    fases: 1,
    onda: (t) => seno(t) + 0.22 * Math.sin(6 * Math.PI * t) + 0.12 * Math.sin(10 * Math.PI * t),
  },
  {
    nome: 'Afundamento de tensão (voltage sag)',
    oQueE: 'Queda rápida e temporária da tensão',
    fases: 1,
    onda: (t) => (1 - 0.5 * janela(t, 1.5, 3)) * seno(t),
  },
  { nome: 'Sobretensão', oQueE: 'Elevação acima dos limites', fases: 1, onda: (t) => (1 + 0.35 * janela(t, 1.5, 3)) * seno(t) },
  {
    nome: 'Desequilíbrio entre fases',
    oQueE: 'Tensão desigual nas três fases de um sistema trifásico',
    fases: 3,
    onda: (t, f) => [1, 0.7, 0.88][f] * seno(t, f * TERCO),
  },
  {
    nome: 'Flicker (flutuação de tensão)',
    oQueE: 'Variações rápidas e visíveis',
    fases: 1,
    onda: (t) => (1 + 0.18 * Math.sin(2 * Math.PI * t * 0.45)) * seno(t),
  },
];

export function FenomenosDeTensao() {
  const CICLOS = 4.5;
  const colunas = 2;
  const larg = 300;
  const alt = 70;
  const gx = [40, 380];
  const topo = 84;
  const passoY = 128;
  const linhas = Math.ceil(FENOMENOS.length / colunas);
  const fundo = topo + linhas * passoY;
  const classes = ['dg-linha', 'dg-linha-suave', 'dg-linha-dest'];
  return (
    <Diagrama
      titulo="Fenômenos que degradam a tensão"
      subtitulo="Ilustrativo, sem escala de norma: a forma de cada fenômeno da tabela 9.3, comparada a uma onda sem perturbação"
      descricao="Seis pequenos gráficos de tensão contra o tempo, sem números nos eixos. Sem perturbação: uma senoide regular. Harmônicos: a senoide deformada. Afundamento: a amplitude cai por alguns ciclos e volta. Sobretensão: a amplitude sobe por alguns ciclos e volta. Desequilíbrio entre fases: três senoides defasadas com amplitudes diferentes. Flicker: a amplitude oscila devagar. A linha tracejada marca a amplitude da onda sem perturbação."
      altura={fundo + 30}
      fonte="Módulo 01, Aula 09, seção 9.3 (tabela de fenômenos); três fases defasadas em 120° do verbete “Trifásico” do glossário do módulo."
      nota="Ilustrativo: a aula não diz quanto a tensão afunda ou sobe, por quantos ciclos, nem a ordem dos harmônicos, e por isso nenhum eixo tem número. As formas mostram só o tipo de cada fenômeno; não servem para medir nem para comparar com limite de norma."
    >
      {FENOMENOS.map((fen, i) => {
        const cx = gx[i % colunas];
        const cy = topo + Math.floor(i / colunas) * passoY + 34;
        const x = escalaLinear(0, CICLOS, cx, cx + larg);
        const y = escalaLinear(-1.5, 1.5, cy + alt, cy);
        const caminho = (f: number) =>
          Array.from({ length: 541 }, (_, k) => {
            const t = (k / 540) * CICLOS;
            return `${k === 0 ? 'M' : 'L'}${x(t).toFixed(2)} ${y(fen.onda(t, f)).toFixed(2)}`;
          }).join(' ');
        return (
          <g key={fen.nome}>
            <text x={cx} y={cy - 22} className="dg-n dg-forte dg-negrito">
              {fen.nome}
            </text>
            <text x={cx} y={cy - 8} className="dg-s" fontSize={11}>
              {fen.oQueE}
            </text>
            <line x1={cx} y1={y(0)} x2={cx + larg} y2={y(0)} className="dg-grade" />
            <line x1={cx} y1={y(1)} x2={cx + larg} y2={y(1)} className="dg-grade dg-tracejado" />
            <line x1={cx} y1={y(-1)} x2={cx + larg} y2={y(-1)} className="dg-grade dg-tracejado" />
            <line x1={cx} y1={cy} x2={cx} y2={cy + alt} className="dg-eixo" />
            {Array.from({ length: fen.fases }, (_, f) => (
              <path key={f} d={caminho(f)} className={fen.fases === 1 ? (i === 0 ? 'dg-linha-suave' : 'dg-linha') : classes[f]} />
            ))}
          </g>
        );
      })}
      <text x={gx[1] + larg} y={fundo + 6} className="dg-eixo-titulo dg-fim">
        tempo → · tensão em unidade relativa
      </text>
    </Diagrama>
  );
}
