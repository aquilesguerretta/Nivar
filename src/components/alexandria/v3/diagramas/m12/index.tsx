// Diagramas do M12 (regra 3 da regra de imagem: visual comum de demonstração).
// Dois eixos de tempo datados, com o dado tirado literalmente do texto das aulas
// (alexandria-modulo-12-content.ts, conferido contra o HTML original). Nenhuma
// data aqui é nova: cada marca cita a frase da aula de onde vem (comentário ao lado).
// Primitivos e classes: ../base (os mesmos dos diagramas do M01, só tokens da v3).

import type { ComponentType } from 'react';
import { Diagrama, escalaLinear } from '../base';

interface Marco {
  /** Mês contado desde janeiro de 2024 (0 = jan/2024), com fração para o dia. */
  t: number;
  data: string;
  texto: string;
}

interface Faixa {
  rotulo: string;
  marcos: Marco[];
}

const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const m = (ano: number, mes: number, dia = 1) => (ano - 2024) * 12 + (mes - 1) + (dia - 1) / 30;

/** Eixo de tempo com uma ou duas faixas de marcos numerados e a lista numerada embaixo. */
function LinhaDoTempo({
  inicio,
  fim,
  faixas,
  verificacao,
}: {
  inicio: number;
  fim: number;
  faixas: Faixa[];
  verificacao: number;
}) {
  const ox = 150;
  const ex = 700;
  const x = escalaLinear(inicio, fim, ox, ex);
  const y0 = 80;
  const passo = 64;
  const eixoY = y0 + passo * faixas.length - 24;
  let n = 0;
  const numerados = faixas.map((f) => f.marcos.map((mc) => ({ ...mc, n: ++n })));
  const meses: number[] = [];
  for (let k = Math.ceil(inicio); k <= fim; k++) if (k % 3 === 0) meses.push(k);
  const listaY = eixoY + 44;
  const todos = numerados.flat();
  const meio = Math.ceil(todos.length / 2);
  return (
    <>
      {faixas.map((f, i) => {
        const y = y0 + passo * i;
        return (
          <g key={f.rotulo}>
            <text x={16} y={y + 4} className="dg-s dg-forte">
              {f.rotulo}
            </text>
            <line x1={ox} y1={y} x2={ex} y2={y} className="dg-grade" />
            {numerados[i].map((mc) => (
              <g key={mc.n}>
                <circle cx={x(mc.t)} cy={y} r={9} className="dg-ponto" />
                <text x={x(mc.t)} y={y + 4} className="dg-n dg-meio" style={{ fill: 'var(--sobre-tinta)', fontWeight: 600 }}>
                  {mc.n}
                </text>
              </g>
            ))}
          </g>
        );
      })}
      <line x1={ox} y1={eixoY} x2={ex} y2={eixoY} className="dg-eixo" />
      {meses.map((k) => (
        <g key={k}>
          <line x1={x(k)} y1={eixoY} x2={x(k)} y2={eixoY + 5} className="dg-eixo" />
          <text x={x(k)} y={eixoY + 18} className="dg-n dg-meio">
            {`${MES[((k % 12) + 12) % 12]}/${String(2024 + Math.floor(k / 12)).slice(2)}`}
          </text>
        </g>
      ))}
      <line x1={x(verificacao)} y1={y0 - 26} x2={x(verificacao)} y2={eixoY} className="dg-tracejado" />
      <text x={x(verificacao) + 4} y={y0 - 30} className="dg-n dg-dest">
        verificação do módulo · 2 ago 2026
      </text>
      {todos.map((mc, i) => {
        const col = i < meio ? 0 : 1;
        const lin = i < meio ? i : i - meio;
        return (
          <text key={mc.n} x={16 + col * 352} y={listaY + lin * 20} className="dg-s">
            <tspan className="dg-forte dg-negrito">{`${mc.n} · ${mc.data}`}</tspan>
            {` — ${mc.texto}`}
          </text>
        );
      })}
    </>
  );
}

const alturaDe = (faixas: number, marcos: number) => 80 + 64 * faixas - 24 + 44 + Math.ceil(marcos / 2) * 20 + 8;

// ── Aula 04 · duas políticas simultâneas ─────────────────────────────────────
const POLITICAS: Faixa[] = [
  {
    rotulo: 'Créditos fiscais',
    marcos: [
      // 04.1: "Em 4 de julho de 2025, foi sancionada nos Estados Unidos uma lei orçamentária…"
      { t: m(2025, 7, 4), data: '4 jul 2025', texto: 'lei orçamentária sancionada' },
      // 04.1: "…que não iniciem obra até 4 de julho de 2026…"
      { t: m(2026, 7, 4), data: '4 jul 2026', texto: 'fim do prazo de início de obra' },
      // 04.1: "…ou não entrem em operação até 31 de dezembro de 2027."
      { t: m(2027, 12, 31), data: '31 dez 2027', texto: 'fim do prazo de operação' },
    ],
  },
  {
    rotulo: 'Tarifas',
    marcos: [
      // 04.2: "Julho de 2025 — … com base em lei de poderes econômicos de emergência"
      { t: m(2025, 7, 15), data: 'jul 2025', texto: 'anúncio, sob lei de emergência' },
      // 04.2: "Agosto de 2025 — a medida entra em vigor com isenções expressas… aberta investigação sob a Seção 301"
      { t: m(2025, 8, 15), data: 'ago 2025', texto: 'em vigor, com isenções; abre a Seção 301' },
      // 04.2: "Fevereiro de 2026 — a Suprema Corte … decide que aquela lei de emergência não autoriza…"
      { t: m(2026, 2, 15), data: 'fev 2026', texto: 'Suprema Corte derruba a base de emergência' },
      // 04.2: "Junho de 2026 — a investigação da Seção 301 é concluída"
      { t: m(2026, 6, 15), data: 'jun 2026', texto: 'investigação da Seção 301 concluída' },
      // 04.2: "15 a 22 de julho de 2026 — … tarifa adicional de 25% … vigência a partir de 22 de julho"
      { t: m(2026, 7, 22), data: '22 jul 2026', texto: '25% adicional em vigor, sob a Seção 301' },
    ],
  },
];

export function DuasPoliticasAmericanas() {
  return (
    <Diagrama
      titulo="Duas políticas americanas ao mesmo tempo"
      subtitulo="Créditos fiscais à energia limpa e tarifas sobre produtos brasileiros, 2025–2027"
      descricao="Eixo de tempo de julho de 2025 a dezembro de 2027 com duas faixas. Créditos fiscais: lei orçamentária sancionada em 4 de julho de 2025; fim do prazo de início de obra para eólica e solar em 4 de julho de 2026; fim do prazo de entrada em operação em 31 de dezembro de 2027. Tarifas: anúncio em julho de 2025 sob lei de emergência; em vigor em agosto de 2025, com isenções, e abertura da investigação da Seção 301; em fevereiro de 2026 a Suprema Corte decide que a lei de emergência não autoriza tarifa; em junho de 2026 a investigação da Seção 301 é concluída; em 22 de julho de 2026 entra em vigor tarifa adicional de 25% sob a Seção 301. Uma linha tracejada marca a data de verificação do módulo, 2 de agosto de 2026."
      altura={alturaDe(2, 8)}
      fonte="Módulo 12, Aula 04, seções 04.1 e 04.2."
      nota="Datas como a aula as escreve; onde a aula dá só o mês, a marca fica no meio do mês."
    >
      <LinhaDoTempo inicio={m(2025, 6)} fim={m(2028, 1)} faixas={POLITICAS} verificacao={m(2026, 8, 2)} />
    </Diagrama>
  );
}

// ── Aula 06 · a lei e o decreto que não veio ────────────────────────────────
const DECRETO: Faixa[] = [
  {
    rotulo: 'Leis',
    marcos: [
      // 06.1: "A Lei nº 14.948, de 2 de agosto de 2024…"
      { t: m(2024, 8, 2), data: '2 ago 2024', texto: 'Lei nº 14.948 (política e Rehidro)' },
      // 06.1: "A Lei nº 14.990, de 27 de setembro de 2024…"
      { t: m(2024, 9, 27), data: '27 set 2024', texto: 'Lei nº 14.990 (crédito de R$ 18,3 bi)' },
    ],
  },
  {
    rotulo: 'Decreto',
    marcos: [
      // 06.2: "Em novembro de 2025, durante a COP30 … seria assinado 'na próxima semana'"
      { t: m(2025, 11, 15), data: 'nov 2025', texto: '"na próxima semana", na COP30' },
      // 06.2: "reiteraram a publicação como iminente em março, abril, junho e julho"
      { t: m(2026, 3, 15), data: 'mar 2026', texto: 'publicação reiterada como iminente' },
      { t: m(2026, 4, 15), data: 'abr 2026', texto: 'reiterada como iminente' },
      { t: m(2026, 6, 15), data: 'jun 2026', texto: 'reiterada como iminente' },
      // 06.2: "Na primeira semana de julho de 2026 … voltou a indicar publicação para 'esta semana'"
      { t: m(2026, 7, 4), data: '1ª sem. jul 2026', texto: '"esta semana"' },
    ],
  },
];

export function EsperaPeloDecreto() {
  return (
    <Diagrama
      titulo="Duas leis sancionadas, um decreto que não veio"
      subtitulo="Hidrogênio de baixa emissão: da lei à data de verificação do módulo"
      descricao="Eixo de tempo de agosto de 2024 a setembro de 2026 com duas faixas. Leis: Lei nº 14.948 em 2 de agosto de 2024 e Lei nº 14.990 em 27 de setembro de 2024. Decreto: em novembro de 2025, durante a COP30, o anúncio de assinatura 'na próxima semana'; publicação reiterada como iminente em março, abril e junho de 2026; na primeira semana de julho de 2026, a indicação de publicação para 'esta semana'. Uma linha tracejada marca 2 de agosto de 2026, data de verificação do módulo, em que o decreto não havia sido publicado."
      altura={alturaDe(2, 7)}
      fonte="Módulo 12, Aula 06, seções 06.1 e 06.2."
      nota="Na data de verificação, 2 de agosto de 2026, o decreto não havia sido publicado. A reiteração de julho é a da primeira semana (marca 7)."
    >
      <LinhaDoTempo inicio={m(2024, 7)} fim={m(2026, 10)} faixas={DECRETO} verificacao={m(2026, 8, 2)} />
    </Diagrama>
  );
}

export const DIAGRAMAS_M12: Record<string, ComponentType> = {
  DuasPoliticasAmericanas,
  EsperaPeloDecreto,
};
