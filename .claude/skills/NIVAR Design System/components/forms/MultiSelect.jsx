import React from 'react';

export function MultiSelect({
  label,
  hint,
  error,
  selecionados = [],
  onRemover,
  valor = '',
  onChange,
  placeholder = 'Buscar e adicionar',
  sugestoes = [],
  aberto,
  onEscolher,
  obrigatorio = false,
  disabled = false,
  state,
  id = 'multi',
  className = '',
}) {
  const mostra = aberto !== undefined ? aberto : Boolean(valor);

  return (
    <div className={['nv-campo', 'nv-multi', error ? 'nv-campo--erro' : '', disabled ? 'nv-campo--desabilitado' : '', className].filter(Boolean).join(' ')}>
      {label ? (
        <label className="nv-campo__rotulo" htmlFor={id}>
          {label}
          {obrigatorio ? <span className="nv-campo__obrig" aria-hidden="true">*</span> : null}
          {obrigatorio ? <span className="nv-sr"> obrigatório</span> : null}
        </label>
      ) : null}
      <div className={'nv-campo__caixa nv-multi__caixa' + (state === 'foco' ? ' nv-campo__caixa--foco' : '')}>
        {selecionados.map((s) => {
          const chave = typeof s === 'string' ? s : s.id;
          const rot = typeof s === 'string' ? s : s.rotulo;
          return (
            <span className="nv-multi__chip" key={chave}>
              {rot}
              <button
                type="button"
                className="nv-multi__x"
                aria-label={'Remover ' + rot}
                disabled={disabled}
                onClick={() => onRemover && onRemover(chave)}
              ><span aria-hidden="true">×</span></button>
            </span>
          );
        })}
        <input
          id={id}
          type="text"
          className="nv-campo__ctrl nv-multi__ctrl"
          value={valor}
          placeholder={selecionados.length ? '' : placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={mostra}
          aria-controls={id + '-lista'}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      </div>
      {mostra ? (
        <ul className="nv-multi__lista" id={id + '-lista'} role="listbox">
          {sugestoes.length ? sugestoes.map((s) => {
            const chave = typeof s === 'string' ? s : s.id;
            const rot = typeof s === 'string' ? s : s.rotulo;
            const meta = typeof s === 'string' ? null : s.meta;
            return (
              <li className="nv-multi__item" key={chave} role="option" aria-selected="false">
                <button type="button" className="nv-multi__item-b" onClick={() => onEscolher && onEscolher(s)}>
                  <span className="nv-multi__item-t">{rot}</span>
                  {meta ? <span className="nv-multi__item-m">{meta}</span> : null}
                </button>
              </li>
            );
          }) : <li className="nv-multi__vazio">Nenhuma opção restante.</li>}
        </ul>
      ) : null}
      {error ? <p className="nv-campo__erro"><i aria-hidden="true">×</i>{error}</p> : hint ? <p className="nv-campo__nota">{hint}</p> : null}
    </div>
  );
}
