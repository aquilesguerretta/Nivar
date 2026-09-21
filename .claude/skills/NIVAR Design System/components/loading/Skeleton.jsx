import React from 'react';

const serie = (n) => Array.from({ length: n }, (_, i) => i);

export function Skeleton({ variant = 'texto', rows = 4, columns = 3, className = '' }) {
  if (variant === 'tabela') {
    const cols = { gridTemplateColumns: `1.6fr ${serie(columns - 1).map(() => '1fr').join(' ')}` };
    return (
      <div className={('nv-skel nv-skel--tabela ' + className).trim()} role="status" aria-busy="true" aria-label="Carregando série">
        <div className="nv-skel__cab" style={cols}>
          {serie(columns).map((i) => <span key={i} className="nv-skel__fio nv-skel__fio--forte" style={{ animationDelay: i * 60 + 'ms' }} />)}
        </div>
        {serie(rows).map((r) => (
          <div key={r} className="nv-skel__linha" style={cols}>
            {serie(columns).map((i) => <span key={i} className="nv-skel__fio" style={{ animationDelay: 140 + r * 90 + i * 40 + 'ms' }} />)}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={('nv-skel nv-skel--card ' + className).trim()} role="status" aria-busy="true" aria-label="Carregando indicador">
        <span className="nv-skel__fio nv-skel__fio--curto" />
        <div className="nv-skel__barras">
          {[20, 38, 27, 46, 33, 41].map((h, i) => (
            <span key={i} className="nv-skel__barra" style={{ '--h': h + 'px', animationDelay: i * 80 + 'ms' }} />
          ))}
        </div>
        <span className="nv-skel__fio nv-skel__fio--meio" style={{ animationDelay: '260ms' }} />
      </div>
    );
  }

  return (
    <div className={('nv-skel nv-skel--texto ' + className).trim()} role="status" aria-busy="true" aria-label="Carregando texto">
      {serie(rows).map((i) => (
        <span key={i} className="nv-skel__fio" style={{ animationDelay: i * 90 + 'ms', maxWidth: i === rows - 1 ? '62%' : '100%' }} />
      ))}
    </div>
  );
}
