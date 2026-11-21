// AlexandriaHeader — faixa navy full-bleed no topo do produto.
//
// Regra da seção 4 aplicada aqui: elemento de navegação, busca e
// destaque NÃO recebe caixa por padrão. Item de nav ativo é marcado por
// fio de 1px embaixo — nunca por caixa, nunca por fundo. O campo de
// busca é fio embaixo e nada mais.
//
// Isso diverge do handoff de propósito: quatro dos cinco campos de
// busca do handoff têm container de quatro lados (L1181, L1356, L1660,
// L108). O quinto — a linha de consulta do ⌘K (L2038) — é só fio
// embaixo, e é esse o padrão que o brief manda seguir.
//
// ─────────────────────────────────────────────────────────────
// LYCEUM WAVE 17 — CARÁTER DE FRONTISPÍCIO, zero token novo
//
// O header funcionava desde a Wave 6, mas lia genérico — qualquer app
// escuro com cor trocada. Quatro mudanças, todas dentro do vocabulário
// já declarado em `A`/`A2`/`AT`/`AS`:
//
//   1. Rosa dos ventos: `rosa-sm-on-navy.png` (estrela nua) trocada por
//      `rosa-lg-on-navy.png` — mesmo diretório somente-leitura, e essa
//      variante JÁ TEM moldura circular gravada + coroa ornamental. Não
//      construí frame nenhum; o ativo que faltava já existia.
//   2. Moldura de frontispício: fio duplo (ouro, não terracota — cor de
//      estado nunca é decorativa) no topo e na base do header, como
//      masthead de jornal do século XIX.
//   3. Separador de nav: ponto médio entre itens em vez de espaço em
//      branco puro — a nav lê como linha de índice, não como toolbar.
//   4. Busca: ícone de lupa (a assinatura universal de "app moderno")
//      removido; um rótulo Cinzel ("Buscar") faz o mesmo trabalho de
//      anunciar a função, como o campo de um índice impresso.
//
// Veredito: resolveu. Diferente do teto que o Portal BR bateu (onde
// ajuste de código parou de render diferença perceptível e a resposta
// foi referência visual nova), aqui cada iteração produziu ganho visível
// e cumulativo — não bateu no mesmo teto.
//
// Ajuste pós-fechamento: brasão 46px → 52px, e o header recolhe (altura
// + flex-basis + opacidade, não só `transform`, para que o `<main>`
// ocupe o espaço liberado sem deixar vão) ao rolar para baixo — ver
// `useEsconderAoRolar` abaixo. Respeita `prefers-reduced-motion`
// desligando o listener por completo.

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { A, A2, AT, AS, AR, AE, ALAYOUT } from '../../../design/alexandria-tokens';
import { useAuth } from '../../../lib/auth/AuthContext';

export interface AlexandriaNavItem {
  id: string;
  rotulo: string;
  /** Destino absoluto. O header navega sozinho — não depende de o
   *  chamador passar `onNavegar`, que era o motivo de a nav estar morta
   *  até a Wave 6. */
  destino: string;
}

interface AlexandriaHeaderProps {
  itens?: AlexandriaNavItem[];
  itemAtivo?: string;
  onNavegar?: (id: string) => void;
  termoBusca?: string;
  onBuscar?: (termo: string) => void;
}

// Quatro itens, quatro destinos distintos. Até a Wave 15, Biblioteca e
// Trilhas apontavam os DOIS para o hub, porque Biblioteca não tinha
// superfície própria — e o efeito visível era clicar em Trilhas e ver
// "Biblioteca" acender, que lê como navegação quebrada mesmo estando
// funcionando por baixo. A Wave 15 deu à Biblioteca a rota que as
// referências visuais sempre desenharam (fontes e documentos), e o hub
// passou a pertencer a Trilhas, que é o que ele de fato lista.
const NAV_PADRAO: AlexandriaNavItem[] = [
  { id: 'biblioteca', rotulo: 'Biblioteca', destino: '/alexandria/biblioteca' },
  { id: 'trilhas', rotulo: 'Trilhas', destino: '/alexandria' },
  { id: 'atlas', rotulo: 'Atlas', destino: '/alexandria/atlas' },
  { id: 'glossario', rotulo: 'Glossário', destino: '/alexandria/glossario' },
];

/** Deriva o item ativo do endereço atual. `itemAtivo` explícito vence —
 *  é assim que as páginas marcam a própria seção.
 *
 *  O hub acende TRILHAS: ele é o índice das três trilhas, e é para lá
 *  que o item Trilhas navega. Cada item acende na própria rota e em
 *  nenhuma outra — nenhum par colide.
 *
 *  `/alexandria/perfil` não acende nenhum: Perfil tem rota mas não tem
 *  item de nav. */
function ativoPorRota(pathname: string): string | null {
  const p = pathname.replace(/\/+$/, '');
  if (p === '/alexandria' || p === '') return 'trilhas';
  if (p.startsWith('/alexandria/biblioteca')) return 'biblioteca';
  if (p.startsWith('/alexandria/trilha')) return 'trilhas';
  if (p.startsWith('/alexandria/atlas')) return 'atlas';
  if (p.startsWith('/alexandria/glossario')) return 'glossario';
  return null;
}

/** Esconde o header ao rolar para baixo, devolve ao rolar para cima ou ao
 *  chegar perto do topo. O scroller real é o `<main>` do Shell, não a
 *  janela — mesmo idioma que a Wave 7 já usou para o CTA do hero
 *  (`closest('main')`), porque `index.css` trava o documento em 100vh e
 *  quem rola é o container interno.
 *
 *  Sem `AlexandriaShell.tsx` — que segue fora da posse deste
 *  componente — não há como injetar o listener no próprio `<main>`;
 *  encontrá-lo por travessia do DOM a partir do header evita tocar
 *  naquele arquivo. */
function useEsconderAoRolar() {
  const headerRef = useRef<HTMLElement>(null);
  const [escondido, setEscondido] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    const scroller = header?.parentElement?.querySelector('main');
    if (!scroller) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ultimoTopo = scroller.scrollTop;
    const TOLERANCIA = 6;

    function aoRolar() {
      const atual = scroller!.scrollTop;
      if (atual <= 4) setEscondido(false);
      else if (atual > ultimoTopo + TOLERANCIA) setEscondido(true);
      else if (atual < ultimoTopo - TOLERANCIA) setEscondido(false);
      ultimoTopo = atual;
    }

    scroller.addEventListener('scroll', aoRolar, { passive: true });
    return () => scroller.removeEventListener('scroll', aoRolar);
  }, []);

  return { headerRef, escondido };
}

/** Inicial do nome, maiúscula. Nunca vazia: nome em branco cai em '—',
 *  que é marca de campo sem valor no sistema, e não uma letra inventada. */
function inicialDe(nome: string): string {
  const limpo = nome.trim();
  if (!limpo) return '—';
  return limpo[0].toLocaleUpperCase('pt-BR');
}

/** Ponto de acesso ao Perfil — a porta que a Wave 23 não teve.
 *
 *  A Wave 23 construiu `/alexandria/perfil` inteiro (guarda de rota,
 *  identidade real, ativação automática) e nenhuma superfície linkava
 *  para lá: dava para chegar digitando a URL, e mais nada.
 *
 *  TRÊS ESTADOS, o vocabulário replicado do `AcessoConta` do Portal
 *  Brasil (ARCHITECT · Identidade Wave 1) e não inventado aqui — só os
 *  tokens mudam, de Jaguar para os da Alexandria:
 *
 *  · `loading` — espaço reservado que NÃO afirma nada. Enquanto
 *    `/api/auth/me` não respondeu, dizer "Entrar" a quem tem sessão
 *    válida é mentira de ~200ms piscando em toda carga. O próprio
 *    `AuthContextValue` documenta isso: "ninguém deve concluir 'não
 *    logado' — só 'ainda não sabemos'".
 *  · sem sessão — "Entrar" em CAIXA DE FIO, nunca fio-embaixo. Essa é
 *    a razão declarada no Portal e vale igual aqui: fio embaixo é o
 *    vocabulário de item de nav ATIVO (ver a nav acima, com o fio
 *    terracota), e usá-lo faria "Entrar" ler como estado — "você está
 *    em Entrar" — em vez de ação. Retângulo de fio é o idioma de ação,
 *    raio zero como tudo. Leva o endereço atual junto, então quem entra
 *    daqui volta para a Alexandria, não para `/conta`.
 *  · com sessão — círculo com a inicial.
 *
 *  SEM FOTO, e não é omissão: `PlatformUser` é
 *  `{ id, email, name, authMethods, createdAt, updatedAt }` — não existe
 *  campo de imagem. Um `<img>` apontando para nada renderiza ícone de
 *  quebrado, então aqui é sempre inicial.
 *
 *  O círculo é a única exceção de raio que a identidade concede
 *  (círculo pleno: anel de progresso, avatar). Desenhado com FIO de 1px
 *  e não com disco preenchido, porque neste sistema profundidade vem de
 *  fio — e em OURO, não terracota: terracota é cor de estado (em
 *  andamento / crítico) e a Wave 17 já registrou que ela nunca é
 *  decorativa. O mesmo ouro do fio duplo de frontispício logo acima. */
function AcessoPerfil() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Reserva a largura do círculo para o header não pular quando a
    // sessão resolve. Não desenha fio nem letra: não sabemos ainda.
    return <span aria-hidden="true" style={{ width: '32px', height: '32px', flex: 'none' }} />;
  }

  if (!user) {
    return (
      <Link
        to="/entrar"
        state={{ de: location.pathname + location.search }}
        style={{
          ...AT.rotulo,
          fontSize: '10px',
          color: A.tintaSobreNavy,
          textDecoration: 'none',
          border: `1px solid ${A2.fioCampoSobreNavy}`,
          borderRadius: AR.none,
          padding: '5px 12px',
          flex: 'none',
          outlineColor: A2.ouroSobreNavy,
          transition: `border-color ${AE.estado} ${AE.easing}`,
        }}
      >
        Entrar
      </Link>
    );
  }

  return (
    <Link
      to="/alexandria/perfil"
      aria-label={`Perfil de ${user.name}`}
      title={user.name}
      style={{
        ...AT.rotulo,
        fontSize: '12px',
        letterSpacing: 0,          // uma letra só: tracking empurraria fora do centro
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        flex: 'none',
        color: A2.ouroSobreNavy,
        textDecoration: 'none',
        border: `1px solid ${A2.ouroSobreNavy}`,
        borderRadius: AR.circulo,
        outlineColor: A2.ouroSobreNavy,
        transition: `color ${AE.estado} ${AE.easing}, border-color ${AE.estado} ${AE.easing}`,
      }}
    >
      {inicialDe(user.name)}
    </Link>
  );
}

export function AlexandriaHeader({
  itens = NAV_PADRAO,
  itemAtivo,
  onNavegar,
  termoBusca = '',
  onBuscar,
}: AlexandriaHeaderProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ativo = itemAtivo ?? ativoPorRota(pathname);
  const { headerRef, escondido } = useEsconderAoRolar();

  return (
    <header
      ref={headerRef}
      style={{
        position: 'relative',
        height: escondido ? '0px' : ALAYOUT.headerHeight,
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: escondido ? '0px' : ALAYOUT.headerHeight,
        overflow: 'hidden',
        opacity: escondido ? 0 : 1,
        background: A.navy,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: AS.xl,
        padding: `0 ${AS.xl}`,
        borderRadius: AR.none,
        transition: `flex-basis ${AE.hover} ${AE.easing}, height ${AE.hover} ${AE.easing}, opacity ${AE.hover} ${AE.easing}`,
      }}
    >
      {/* Moldura de frontispício — fio duplo, como masthead de jornal do
          século XIX, ancorando a faixa inteira do header. Ouro porque
          terracota é cor de estado (em andamento/crítico) — nunca
          decorativa — e este traço não marca estado nenhum. */}
      <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: A2.ouroSobreNavy }} />
      <span aria-hidden="true" style={{ position: 'absolute', top: '3px', left: 0, right: 0, height: '1px', background: A2.ouroSobreNavy, opacity: 0.5 }} />
      <span aria-hidden="true" style={{ position: 'absolute', bottom: '3px', left: 0, right: 0, height: '1px', background: A2.ouroSobreNavy, opacity: 0.5 }} />
      <span aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: A2.ouroSobreNavy }} />
      {/* Marca — rosa dos ventos + wordmark + subtítulo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: AS.md, flex: 'none' }}>
        <img
          src="/alexandria/marca/rosa-lg-on-navy.png"
          alt=""
          width={52}
          height={52}
          style={{ display: 'block', flex: 'none' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ ...AT.h2, color: A.tintaSobreNavy, lineHeight: 1 }}>
            Alexandria
          </span>
          <span
            style={{
              ...AT.rotulo,
              fontSize: '8px',
              letterSpacing: '0.24em',
              color: A2.tintaMetadadoNavy,
              lineHeight: 1,
            }}
          >
            Atlas vivo da energia do Brasil
          </span>
        </div>
      </div>

      {/* Nav em linha única. Ativo = fio de 1px embaixo. Sem caixa.
          Separador entre itens é ornamental — ponto médio, não espaço em
          branco puro — para que a nav leia como índice de catálogo, não
          como barra de app genérica. */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: AS.md, flex: 'none' }}>
        {itens.map((item, i) => {
          const estaAtivo = item.id === ativo;
          return (
            <span key={item.id} style={{ display: 'flex', alignItems: 'center', gap: AS.md }}>
              {i > 0 && (
                <span aria-hidden="true" style={{ ...AT.rotulo, fontSize: '11px', color: A.fioSobreNavy }}>
                  ·
                </span>
              )}
              <button
                type="button"
                aria-current={estaAtivo ? 'page' : undefined}
                onClick={() => {
                  // `onNavegar` continua sendo o override do chamador; sem ele,
                  // o header navega por conta própria.
                  if (onNavegar) onNavegar(item.id);
                  else navigate(item.destino);
                }}
                style={{
                  ...AT.nav,
                  color: estaAtivo ? A.tintaSobreNavy : A2.tintaMetadadoNavy,
                  background: 'none',
                  border: 'none',
                  borderBottom: `1px solid ${estaAtivo ? A2.terracotaClara : 'transparent'}`,
                  borderRadius: AR.none,
                  padding: `0 0 ${AS.xs} 0`,
                  cursor: 'pointer',
                  transition: `color ${AE.estado} ${AE.easing}, border-color ${AE.estado} ${AE.easing}`,
                }}
              >
                {item.rotulo}
              </button>
            </span>
          );
        })}
      </nav>

      {/* Bloco direito — busca + acesso ao perfil. Agrupados num
          container só para que o `space-between` do header continue
          distribuindo TRÊS blocos (marca · nav · direita); soltos,
          seriam quatro e a nav sairia do centro. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: AS.lg, flex: 'none' }}>
      {/* Busca — entrada de catálogo, não input de app. Sem ícone de lupa
          (afirmação universal de "app moderno"): um rótulo Cinzel faz o
          mesmo trabalho de anunciar a função, como o campo de busca de um
          índice impresso. Fio embaixo, sem caixa de quatro lados. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: AS.sm,
          flex: 'none',
          width: '230px',
          borderBottom: `1px solid ${A2.fioCampoSobreNavy}`,
          paddingBottom: AS.xs,
        }}
      >
        <span style={{ ...AT.rotulo, fontSize: '10px', color: A2.tintaMetadadoNavy, flex: 'none' }}>
          Buscar
        </span>
        <input
          value={termoBusca}
          onChange={(e) => onBuscar?.(e.target.value)}
          placeholder="no atlas…"
          style={{
            ...AT.dado,
            fontStyle: 'italic',
            flex: 1,
            minWidth: 0,
            background: 'none',
            border: 'none',
            borderRadius: AR.none,
            outline: 'none',
            color: A.tintaSobreNavy,
            padding: 0,
          }}
        />
      </div>

        <AcessoPerfil />
      </div>
    </header>
  );
}

export default AlexandriaHeader;
