// M14 · Aula 03 · §03.1 — calendário de safra (o `div.saf` da fonte, L1423–L1446).
//
// Na fonte, quais meses estão "ativos" não está no texto: está na classe de cada mês
// (`saf-m on` / `saf-m on2`). É dado de relação (mês × cadeia), então vira diagrama comum
// (regra de imagem 3). Os rótulos e o estado de cada mês vêm de DADOS_DA_FONTE, gerado do
// HTML por tools/alexandria-dados/porte/gerar-corpo-m14-m15.mjs e reconferido pelo
// verificador de porte. Nenhum mês, rótulo ou estado é digitado aqui.

import { Diagrama } from '../base';
import { DADOS_DA_FONTE } from './dados-da-fonte';

const LINHAS = DADOS_DA_FONTE['a03-saf'];

export function CalendarioDeSafra() {
  const ox = 210; // início da grade de meses
  const larg = 40;
  const alt = 34;
  const oy = 78;
  const passoY = 64;
  const meses = LINHAS[0].meses.map((m) => m.mes);
  return (
    <Diagrama
      titulo="Janela operacional típica, mês a mês"
      subtitulo="Meses preenchidos: moagem típica de cada cadeia"
      descricao={LINHAS.map((l) => `${l.cadeia}: moagem em ${l.meses.filter((m) => m.ativo).map((m) => m.mes).join(', ')}.`).join(' ')}
      altura={oy + (LINHAS.length - 1) * passoY + alt + 24}
      fonte="Módulo 14, Aula 03, seção 03.1."
      nota="Esquema ilustrativo de janela operacional típica, não de qualquer unidade específica (texto da fonte)."
    >
      {meses.map((m, i) => (
        <text key={m} x={ox + i * larg + larg / 2} y={oy - 8} className="dg-s dg-meio">
          {m}
        </text>
      ))}
      {LINHAS.map((l, r) => {
        const y = oy + r * passoY;
        const [nome, ...resto] = l.cadeia.split(' moagem');
        return (
          <g key={l.cadeia}>
            <text x={ox - 12} y={y + alt / 2 - 2} className="dg-s dg-fim dg-forte dg-negrito">
              {nome}
            </text>
            <text x={ox - 12} y={y + alt / 2 + 14} className="dg-s dg-fim">
              {resto.length ? `moagem${resto.join(' moagem')}` : ''}
            </text>
            {l.meses.map((m, i) => (
              <rect
                key={m.mes}
                x={ox + i * larg + 2}
                y={y}
                width={larg - 4}
                height={alt}
                className={m.ativo ? 'dg-barra' : 'dg-vazio'}
              />
            ))}
          </g>
        );
      })}
    </Diagrama>
  );
}
