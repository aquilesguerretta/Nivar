import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { C, F, R } from '@/design/tokens';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Platform', 'Profiles', 'Markets', 'Pricing', 'Docs'];

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-colors duration-300"
      style={{
        height: '72px',
        backgroundColor: scrolled ? 'rgba(10,10,15,0.90)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex h-full items-center justify-between px-8 max-w-[1440px]">
        <div className="flex items-center gap-2.5">
          <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
            <path
              d="M11 1L20.5263 6.5V17.5L11 23L1.47372 17.5V6.5L11 1Z"
              stroke={C.electricBlue}
              strokeWidth="1.5"
              fill="rgba(59,130,246,0.08)"
            />
            <path
              d="M11 7L15 9.5V14.5L11 17L7 14.5V9.5L11 7Z"
              fill={C.electricBlue}
            />
          </svg>
          <span
            style={{
              fontFamily: F.display,
              fontStyle: 'italic',
              fontSize: '20px',
              color: C.textPrimary,
              letterSpacing: '-0.01em',
            }}
          >
            GridAlpha
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l, i) => (
            <div key={l} className="flex items-center">
              <a
                href="#"
                className="px-3 py-2 transition-colors hover:text-white"
                style={{
                  fontFamily: F.sans,
                  fontSize: '13px',
                  color: C.textSecondary,
                }}
              >
                {l}
              </a>
              {i < links.length - 1 && (
                <span style={{ color: 'rgba(241,241,243,0.20)', fontSize: '10px' }}>·</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* /entrar, não /login: conta de PLATAFORMA (uma por pessoa,
              lida por Alexandria, Portal Brasil e este terminal). O
              /login legado valida formato e navega para /nest sem
              chamar API nenhuma — deixa de ser alcançável daqui.
              "Access Terminal" ao lado continua indo para /signup de
              propósito: lá o gate cuida da conta e segue para a escolha
              de arquétipo. Dois caminhos com destinos diferentes, não
              dois "entrar" competindo. */}
          <Link
            to="/entrar"
            className="px-4 py-2 transition-colors hover:text-white"
            style={{
              fontFamily: F.sans,
              fontSize: '13px',
              color: 'rgba(241,241,243,0.72)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="group flex items-center gap-1.5 px-4 py-2 transition-all hover:brightness-110"
            style={{
              fontFamily: F.sans,
              fontSize: '13px',
              fontWeight: 500,
              color: '#ffffff',
              backgroundColor: C.electricBlue,
              borderRadius: R.lg,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px -8px rgba(59,130,246,0.5)',
              textDecoration: 'none',
            }}
          >
            Access Terminal
            <span
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
