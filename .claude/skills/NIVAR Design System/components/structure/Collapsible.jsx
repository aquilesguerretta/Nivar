import React from 'react';

export function Collapsible({
  titulo,
  nota,
  aberta,
  onToggle,
  padrao = false,
  id = 'secao',
  fio = true,
  children,
  className = '',
}) {
  const [interno, setInterno] = React.useState(padrao);
  const controlado = aberta !== undefined;
  const aberto = controlado ? aberta : interno;
  const alternar = () => (controlado ? onToggle && onToggle(!aberta) : setInterno((v) => !v));

  return (
    <div className={['nv-recol', fio ? 'nv-recol--fio' : '', aberto ? 'nv-recol--aberta' : '', className].filter(Boolean).join(' ')}>
      <h3 className="nv-recol__cab">
        <button
          type="button"
          className="nv-recol__b"
          aria-expanded={aberto}
          aria-controls={id + '-corpo'}
          onClick={alternar}
        >
          <span className="nv-recol__marca" aria-hidden="true">{aberto ? '−' : '+'}</span>
          <span className="nv-recol__t">{titulo}</span>
          {nota ? <span className="nv-recol__nota">{nota}</span> : null}
        </button>
      </h3>
      {aberto ? (
        <div className="nv-recol__corpo" id={id + '-corpo'}>
          <svg className="nv-recol__fio-desenho" viewBox="0 0 1000 1" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="0.5" x2="1000" y2="0.5"></line>
          </svg>
          <div className="nv-recol__interno">{children}</div>
        </div>
      ) : null}
    </div>
  );
}
