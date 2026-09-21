import React from 'react';

export function Breadcrumb({ items = [], className = '' }) {
  return (
    <nav className={('nv-mig ' + className).trim()} aria-label="Trilha">
      {items.map((it, i) => {
        const ultimo = i === items.length - 1;
        return (
          <React.Fragment key={it.label}>
            {i > 0 ? <span className="nv-mig__sep" aria-hidden="true">/</span> : null}
            {ultimo || !it.href
              ? <span className={ultimo ? 'nv-mig__atual' : undefined} aria-current={ultimo ? 'page' : undefined}>{it.label}</span>
              : <a href={it.href}>{it.label}</a>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
