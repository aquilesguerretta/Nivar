import React from 'react';
import { formatarNumero } from '../data/formatar.js';

function janela(pagina, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, pagina, pagina - 1, pagina + 1]);
  const ns = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const saida = [];
  ns.forEach((n, i) => {
    if (i > 0 && n - ns[i - 1] > 1) saida.push('…');
    saida.push(n);
  });
  return saida;
}

export function Pagination({ pagina = 1, porPagina = 25, total = 0, onChange, className = '' }) {
  const paginas = Math.max(1, Math.ceil(total / porPagina));
  const de = total === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const ate = Math.min(pagina * porPagina, total);
  const ir = (n) => { if (onChange && n >= 1 && n <= paginas && n !== pagina) onChange(n); };

  return (
    <div className={('nv-pag ' + className).trim()}>
      <span className="nv-pag__faixa">
        <b>{formatarNumero(de, 0)}–{formatarNumero(ate, 0)}</b> de <b>{formatarNumero(total, 0)}</b> linhas
      </span>
      <div className="nv-pag__ctrl">
        <button type="button" className="nv-pag__n" disabled={pagina <= 1} onClick={() => ir(pagina - 1)}>anterior</button>
        {janela(pagina, paginas).map((n, i) => (
          n === '…'
            ? <span key={'e' + i} className="nv-pag__elipse" aria-hidden="true">…</span>
            : <button key={n} type="button" className={'nv-pag__n' + (n === pagina ? ' nv-pag__n--ativo' : '')} aria-current={n === pagina ? 'page' : undefined} onClick={() => ir(n)}>{formatarNumero(n, 0)}</button>
        ))}
        <button type="button" className="nv-pag__n" disabled={pagina >= paginas} onClick={() => ir(pagina + 1)}>próxima</button>
      </div>
    </div>
  );
}
