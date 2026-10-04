import React from 'react';

/** vírgula decimal, espaço fino (U+2009) no milhar */
export function formatarNumero(valor, casas = 2) {
  if (valor === null || valor === undefined || valor === '') return '—';
  const n = typeof valor === 'number' ? valor : Number(valor);
  if (!Number.isFinite(n)) return String(valor);
  const fixo = Math.abs(n).toFixed(casas);
  const [inteira, decimal] = fixo.split('.');
  const agrupada = inteira.replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');
  return (n < 0 ? '\u2212' : '') + agrupada + (decimal ? ',' + decimal : '');
}

export function formatarDelta(valor, casas = 1) {
  const n = Number(valor);
  if (!Number.isFinite(n)) return '—';
  const sinal = n > 0 ? '+' : n < 0 ? '\u2212' : '';
  return sinal + formatarNumero(Math.abs(n), casas) + ' %';
}

export function classeDirecao(valor) {
  const n = Number(valor);
  if (!Number.isFinite(n) || n === 0) return 'nv-neutro';
  return n > 0 ? 'nv-alta' : 'nv-baixa';
}
