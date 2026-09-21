import React from 'react';

const FAMILIAS = ['intelligence', 'advisory', 'software', 'academy', 'hardware'];
const DIRECOES = { alta: 'var(--data-alta)', baixa: 'var(--data-baixa)', atencao: 'var(--data-atencao)', neutro: 'var(--data-neutro)' };

function resolverCor(cor) {
  if (!cor) return 'var(--serie-linha)';
  if (FAMILIAS.indexOf(cor) !== -1) return 'var(--family-' + cor + ')';
  if (DIRECOES[cor]) return DIRECOES[cor];
  return cor;
}

export function ChartLegend({ itens = [], tipo = 'linha', fio = true, className = '' }) {
  return (
    <div className={['nv-graf__legenda', fio ? '' : 'nv-graf__legenda--sem-fio', className].filter(Boolean).join(' ')}>
      {itens.map((it) => {
        const t = it.tipo || tipo;
        return (
          <span key={it.rotulo} className="nv-graf__leg-item">
            <i
              className={'nv-graf__leg-amostra nv-graf__leg-amostra--' + t}
              style={{ background: resolverCor(it.cor) }}
              aria-hidden="true"
            ></i>
            {it.rotulo}
            {it.valor !== undefined ? <b className="nv-graf__leg-valor">{it.valor}</b> : null}
          </span>
        );
      })}
    </div>
  );
}
