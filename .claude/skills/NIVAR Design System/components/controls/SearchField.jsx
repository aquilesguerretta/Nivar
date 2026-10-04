import React from 'react';

function Realce({ texto, termo }) {
  const t = (termo || '').trim();
  if (!t) return <>{texto}</>;
  const i = texto.toLowerCase().indexOf(t.toLowerCase());
  if (i === -1) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, i)}
      <b className="nv-busca__marca">{texto.slice(i, i + t.length)}</b>
      {texto.slice(i + t.length)}
    </>
  );
}

export function SearchField({
  rotulo,
  valor = '',
  onChange,
  placeholder = 'Termo, submercado ou publicação',
  resultados = [],
  total,
  aberto,
  ancorado = true,
  vazio = 'Nenhum resultado. A busca cobre publicação, série e verbete.',
  onEscolher,
  id = 'busca',
  className = '',
}) {
  const mostra = aberto !== undefined ? aberto : Boolean(valor);
  const n = total !== undefined ? total : resultados.length;

  return (
    <div className={['nv-busca', ancorado ? '' : 'nv-busca--fluxo', className].filter(Boolean).join(' ')}>
      {rotulo ? <label className="nv-busca__rotulo" htmlFor={id}>{rotulo}</label> : null}
      <input
        id={id}
        type="search"
        className="nv-busca__ctrl"
        value={valor}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={mostra}
        aria-controls={id + '-lista'}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
      {mostra ? (
        <div className="nv-busca__lista" id={id + '-lista'} role="listbox">
          <p className="nv-busca__total">
            <span>{n} {n === 1 ? 'resultado' : 'resultados'}</span>
            {valor ? <span className="nv-busca__termo">{valor}</span> : null}
          </p>
          {resultados.length ? (
            <ul className="nv-busca__itens">
              {resultados.map((r) => (
                <li key={r.id || r.titulo} className="nv-busca__item" role="option" aria-selected="false">
                  <button type="button" className="nv-busca__item-b" onClick={() => onEscolher && onEscolher(r)}>
                    <span className="nv-busca__item-t"><Realce texto={r.titulo} termo={valor} /></span>
                    {r.meta ? <span className="nv-busca__item-m">{r.meta}</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="nv-busca__vazio">{vazio}</p>}
        </div>
      ) : null}
    </div>
  );
}
