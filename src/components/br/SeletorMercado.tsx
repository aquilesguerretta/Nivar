// SeletorMercado — ARCHITECT, Portal BR Wave 2 · Jaguar.
// Wave 5: item de navegação no idioma NIVAR (texto com fio, nunca
// caixa) — itens e comportamento intocados.
//
// Troca o prefixo de mercado da URL. Mercado é segmento de rota, não
// estado em store: o link é compartilhável, o bookmark funciona, e não
// há hidratação nem flash de mercado errado no primeiro paint.

import { useState, type CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';

export type MercadoId = 'br' | 'us';

interface Mercado {
  id: MercadoId;
  rotulo: string;
  rota: string;
}

// Topologia de Shell Wave 2: a entrada de Estados Unidos SAIU. O lado
// americano continua inteiro no disco e segue alcançável digitando
// `/us`, mas não é mais anunciado por navegação nenhuma — decisão do
// produto, não limitação técnica. Não virou item desabilitado nem
// "em breve": saiu da interface.
//
// `MercadoId` mantém `'us'` de propósito: o mercado existe como
// conceito e como rota; o que mudou é ele não ser oferecido aqui.
// Quando o portal US ganhar página própria, a entrada volta para esta
// lista e nada mais neste componente muda.
const MERCADOS: Mercado[] = [
  { id: 'br', rotulo: 'Brasil', rota: '/br' },
];

export interface SeletorMercadoProps {
  /** Mercado ativo. Se omitido, deriva do pathname. */
  ativo?: MercadoId;
}

export function SeletorMercado({ ativo }: SeletorMercadoProps) {
  const { pathname } = useLocation();
  const [sobre, setSobre] = useState<MercadoId | null>(null);

  const atual: MercadoId = ativo ?? (pathname.startsWith('/br') ? 'br' : 'us');

  // Rótulo do grupo — mono versalete pequeno (o registro do ModeToggle
  // ao lado, components/navigation do sistema).
  const rotulo: CSSProperties = {
    fontFamily: 'var(--font-data)',
    fontWeight: 400,
    fontSize: '11px',
    lineHeight: 1.2,
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    color: 'var(--text-faint)',
  };

  return (
    <nav
      aria-label="Seleção de mercado"
      style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
    >
      <span style={rotulo}>Mercado</span>

      <span
        aria-hidden="true"
        style={{ width: '1px', height: '12px', background: 'var(--rule)' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {MERCADOS.map((m) => {
          const selecionado = m.id === atual;
          const emHover = sobre === m.id && !selecionado;

          return (
            <Link
              key={m.id}
              to={m.rota}
              aria-current={selecionado ? 'page' : undefined}
              onMouseEnter={() => setSobre(m.id)}
              onMouseLeave={() => setSobre(null)}
              onFocus={() => setSobre(m.id)}
              onBlur={() => setSobre(null)}
              style={{
                // NavItem do sistema: texto com fio, nunca caixa.
                // Ativo = texto forte 500 + fio de 2px no acento da
                // casa (redundante com aria-current, que carrega o
                // estado de verdade); hover sobe um passo na escala.
                fontFamily: 'var(--font-body)',
                fontWeight: selecionado ? 500 : 400,
                fontSize: 'var(--ts-corpo-2)',
                lineHeight: 1.2,
                letterSpacing: '0.01em',
                textDecoration: 'none',
                color: selecionado
                  ? 'var(--text-strong)'
                  : emHover
                    ? 'var(--fg-hover)'
                    : 'var(--text-muted)',
                borderRadius: 0,
                borderBottom: `2px solid ${
                  selecionado ? 'var(--accent-house)' : emHover ? 'var(--fio-hover)' : 'transparent'
                }`,
                paddingBottom: '3px',
                transition: 'color var(--dur-hover) var(--ease), border-bottom-color var(--dur-hover) var(--ease)',
              }}
            >
              {m.rotulo}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default SeletorMercado;
