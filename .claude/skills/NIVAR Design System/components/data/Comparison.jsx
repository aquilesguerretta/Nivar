import React from 'react';
import { formatarNumero, formatarDelta } from './formatar.js';
import { TrendInline } from './TrendInline.jsx';

function valorTexto(v, casas, texto) {
  if (texto) return texto;
  if (v === null || v === undefined || v === '') return '—';
  return typeof v === 'number' ? formatarNumero(v, casas) : String(v);
}

export function Comparison({ a, b, linhas = [], delta = true, nota, className = '' }) {
  return (
    <div className={['nv-comp', className].filter(Boolean).join(' ')}>
      <div className="nv-comp__cel nv-comp__cel--a nv-comp__cel--cab">
        <span className="nv-comp__nome">{a.nome}</span>
        {a.sub ? <span className="nv-comp__sub">{a.sub}</span> : null}
      </div>
      <div className="nv-comp__cel nv-comp__cel--b nv-comp__cel--cab">
        <span className="nv-comp__nome">{b.nome}</span>
        {b.sub ? <span className="nv-comp__sub">{b.sub}</span> : null}
      </div>
      {linhas.map((l) => {
        const auto = typeof l.a === 'number' && typeof l.b === 'number' && l.a !== 0
          ? ((l.b - l.a) / Math.abs(l.a)) * 100
          : null;
        const d = l.delta !== undefined ? l.delta : auto;
        return (
          <React.Fragment key={l.rotulo}>
            <div className="nv-comp__cel nv-comp__cel--a">
              <span className="nv-comp__rot">{l.rotulo}</span>
              <span className="nv-comp__v">{valorTexto(l.a, l.casas, l.textoA)}</span>
              {l.unidade ? <span className="nv-comp__un">{l.unidade}</span> : null}
            </div>
            <div className="nv-comp__cel nv-comp__cel--b">
              <span className="nv-comp__rot">{l.rotulo}</span>
              {delta && d !== null && d !== undefined
                ? <TrendInline delta={d} direcao={l.direcao} tamanho="compacto" />
                : null}
              {l.unidade ? <span className="nv-comp__un">{l.unidade}</span> : null}
              <span className="nv-comp__v">{valorTexto(l.b, l.casas, l.textoB)}</span>
            </div>
          </React.Fragment>
        );
      })}
      {nota ? <p className="nv-comp__nota">{nota}</p> : null}
    </div>
  );
}
