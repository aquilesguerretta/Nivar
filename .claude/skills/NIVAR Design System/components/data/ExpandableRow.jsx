import React from 'react';

export function ExpandableRow({
  celulas = [],
  colunas,
  aberta,
  onToggle,
  padrao = false,
  indentado = false,
  hover = false,
  id = 'linha',
  children,
  className = '',
}) {
  const [interno, setInterno] = React.useState(padrao);
  const controlado = aberta !== undefined;
  const aberto = controlado ? aberta : interno;
  const alternar = () => (controlado ? onToggle && onToggle(!aberta) : setInterno((v) => !v));
  const vao = colunas || celulas.length;

  return (
    <>
      <tr
        className={['nv-tab__linha-exp', aberto ? 'nv-tab__linha-exp--aberta' : '', hover ? 'nv-tab__linha--hover' : '', className].filter(Boolean).join(' ')}
      >
        {celulas.map((c, i) => (
          <td key={i} className={c.num ? 'nv-num' : undefined}>
            {i === 0 ? (
              <button
                type="button"
                className="nv-exp__b"
                aria-expanded={aberto}
                aria-controls={id + '-painel'}
                onClick={alternar}
              >
                <span className="nv-exp__marca" aria-hidden="true">{aberto ? '−' : '+'}</span>
                <span>{c.valor}</span>
              </button>
            ) : c.valor}
          </td>
        ))}
      </tr>
      {aberto ? (
        <tr className="nv-tab__painel" id={id + '-painel'}>
          <td colSpan={vao} className={indentado ? 'nv-exp__cel nv-exp__cel--indentado' : 'nv-exp__cel'}>
            <svg className="nv-exp__fio-desenho" viewBox="0 0 1000 1" preserveAspectRatio="none" aria-hidden="true">
              <line x1="0" y1="0.5" x2="1000" y2="0.5"></line>
            </svg>
            <div className="nv-exp__interno">{children}</div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
