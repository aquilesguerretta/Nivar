import React from 'react';

export function NavItem({ children, href, ativo = false, state, onClick, className = '' }) {
  const cls = [
    'nv-nav__item',
    ativo ? 'nv-nav__item--ativo' : '',
    state === 'hover' ? 'nv-nav__item--is-hover' : '',
    className,
  ].filter(Boolean).join(' ');
  if (href) return <a className={cls} href={href} aria-current={ativo ? 'page' : undefined}>{children}</a>;
  return <button type="button" className={cls} aria-current={ativo ? 'page' : undefined} onClick={onClick}>{children}</button>;
}

export function Nav({ children, className = '' }) {
  return <nav className={('nv-nav ' + className).trim()}>{children}</nav>;
}
