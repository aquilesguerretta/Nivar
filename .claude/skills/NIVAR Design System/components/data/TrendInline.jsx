import React from 'react';
import { formatarNumero, formatarDelta } from './formatar.js';

const GLIFO = { alta: '↑', baixa: '↓', neutro: '→', atencao: '±' };
const LEITURA = { alta: 'em alta', baixa: 'em baixa', neutro: 'sem variação', atencao: 'fora de faixa' };

export function TrendInline({
  delta,
  valor,
  unidade,
  casas = 1,
  base,
  direcao,
  glifo,
  tamanho = 'padrao',
  className = '',
}) {
  const n = Number(delta);
  const dir = direcao || (!Number.isFinite(n) || n === 0 ? 'neutro' : n > 0 ? 'alta' : 'baixa');
  const texto = valor !== undefined && valor !== null
    ? formatarNumero(valor, casas)
    : formatarDelta(delta, casas);

  return (
    <span
      className={['nv-tend', 'nv-' + dir, tamanho === 'compacto' ? 'nv-tend--compacto' : '', className].filter(Boolean).join(' ')}
      title={LEITURA[dir]}
    >
      <span className="nv-tend__dir" aria-hidden="true">{glifo || GLIFO[dir]}</span>
      <span className="nv-tend__v">{texto}</span>
      {unidade ? <span className="nv-tend__un">{unidade}</span> : null}
      {base ? <span className="nv-tend__base">{base}</span> : null}
    </span>
  );
}
