// Portão de acesso do front.
//
// Founder, 17/11/2026: na internet aberta, a NIVAR inteira (Alexandria e os
// outros produtos) só abre com login, e só para os e-mails liberados; em
// servidor local fica aberta.
//
// Isto é a metade visível. A metade que vale de verdade está no backend
// (app/services/acesso.py): em produção ele só emite sessão para os e-mails
// liberados e recusa qualquer /api sem essa sessão. Aqui o front só evita
// mostrar telas para quem não entrou.
//
// Ativo em qualquer endereço que não seja local (localhost, 127.0.0.1,
// [::1], *.localhost, *.test). Sem login, toda rota leva a /entrar e volta
// para onde a pessoa ia depois de entrar.

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';

const ROTAS_LIVRES = ['/entrar', '/login'];

export function portaoAtivoNoNavegador(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1') return false;
  if (h.endsWith('.localhost') || h.endsWith('.test')) return false;
  return true;
}

export function PortaoDeAcesso({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const local = useLocation();

  if (!portaoAtivoNoNavegador()) return <>{children}</>;
  if (ROTAS_LIVRES.some((r) => local.pathname === r || local.pathname.startsWith(`${r}/`))) return <>{children}</>;
  if (loading) return <div style={{ minHeight: '100vh', background: '#f2ecdf' }} aria-busy="true" />;
  if (!user) return <Navigate to="/entrar" replace state={{ de: `${local.pathname}${local.search}` }} />;
  return <>{children}</>;
}
