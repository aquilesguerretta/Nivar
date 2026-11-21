import React from 'react';

export function DownloadLink({
  arquivo,
  tamanho,
  formato,
  nota,
  href = '#',
  disabled = false,
  className = '',
  ...rest
}) {
  const ponto = arquivo ? arquivo.lastIndexOf('.') : -1;
  const nome = ponto > 0 ? arquivo.slice(0, ponto) : arquivo;
  const ext = ponto > 0 ? arquivo.slice(ponto) : '';

  return (
    <a
      className={['nv-baixar', disabled ? 'nv-baixar--desabilitado' : '', className].filter(Boolean).join(' ')}
      href={disabled ? undefined : href}
      download={disabled ? undefined : ''}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      <span className="nv-baixar__glifo" aria-hidden="true">↓</span>
      <span className="nv-baixar__nome">{nome}<b className="nv-baixar__ext">{ext}</b></span>
      <span className="nv-baixar__meta">
        {formato ? <span>{formato}</span> : null}
        {formato && tamanho ? <span className="nv-baixar__sep" aria-hidden="true">·</span> : null}
        {tamanho ? <span>{tamanho}</span> : null}
      </span>
      {nota ? <span className="nv-baixar__nota">{nota}</span> : null}
    </a>
  );
}
