import React from 'react';
import { formatarNumero, classeDirecao } from './formatar.js';

export function DataTable({
  columns = [],
  rows = [],
  caption,
  zebra = true,
  hover = true,
  footer,
  linhaHover,
  className = '',
}) {
  const cls = ['nv-tab', zebra ? 'nv-tab--zebra' : '', hover ? 'nv-tab--hover' : '', className].filter(Boolean).join(' ');
  const celula = (col, row) => {
    const bruto = row[col.key];
    if (col.tipo === 'numero') return formatarNumero(bruto, col.casas ?? 2);
    if (col.tipo === 'delta') {
      const n = Number(bruto);
      const sinal = n > 0 ? '+' : n < 0 ? '\u2212' : '';
      return sinal + formatarNumero(Math.abs(n), col.casas ?? 1) + (col.sufixo ?? ' %');
    }
    return bruto;
  };
  return (
    <div className="nv-tab-rolo">
    <table className={cls}>
      {caption ? <caption>{caption}</caption> : null}
      <thead>
        <tr>{columns.map((c) => <th key={c.key} className={c.tipo && c.tipo !== 'texto' ? 'nv-num' : undefined} scope="col">{c.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id ?? i} className={linhaHover === i ? 'nv-tab__linha--hover' : undefined}>
            {columns.map((c) => {
              const num = c.tipo && c.tipo !== 'texto';
              const dir = c.tipo === 'delta' ? ' ' + classeDirecao(row[c.key]) : '';
              return <td key={c.key} className={(num ? 'nv-num' : '') + dir || undefined}>{celula(c, row)}</td>;
            })}
          </tr>
        ))}
      </tbody>
      {footer ? (
        <tfoot>
          <tr>{columns.map((c) => <td key={c.key} className={c.tipo && c.tipo !== 'texto' ? 'nv-num' : undefined}>{c.tipo === 'numero' ? formatarNumero(footer[c.key], c.casas ?? 2) : footer[c.key]}</td>)}</tr>
        </tfoot>
      ) : null}
    </table>
    </div>
  );
}
