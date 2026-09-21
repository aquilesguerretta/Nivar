// DestinoCard — ARCHITECT, Portal BR Wave 2 · Jaguar.
//
// Cinco cards, mesma moldura e tamanho (spec §3). A hierarquia mora
// DENTRO do card, nos dois estados:
//
//   disponível — gravura própria do destino, sobre o papel real do
//                sistema dele (decisão direta do Aquiles — ver
//                PreviaAlexandria abaixo).
//   em breve   — planta baixa: retângulos vazios em traço fino ocre,
//                sem preenchimento, desenhando via stroke-dashoffset.
//                Sugere o layout do que existirá, sem fingir conteúdo.
//
// Clique tem o mesmo comportamento de zoom do hero — consistência de
// interação pela página inteira. Card em breve NÃO é disabled: abre o
// estado "em breve" em planta baixa, nunca link morto.

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';

import type { DestinoBR } from '../../lib/data/br-destinos';
import { useAuth } from '../../lib/auth/AuthContext';

// Papéis tipográficos NIVAR — valores nos tokens CSS (ver PortalBR).
const NT = {
  etiqueta: {
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: 'var(--ts-etiqueta)',
    lineHeight: 'var(--lh-etiqueta)' as CSSProperties['lineHeight'],
    letterSpacing: 'var(--tr-etiqueta)',
    textTransform: 'uppercase',
  } satisfies CSSProperties,
  titulo2: {
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--fw-display)' as CSSProperties['fontWeight'],
    fontSize: 'var(--ts-titulo-2)',
    lineHeight: 'var(--lh-titulo-2)' as CSSProperties['lineHeight'],
    letterSpacing: 'var(--tr-titulo-2)',
  } satisfies CSSProperties,
  corpo: {
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--fw-corpo)' as CSSProperties['fontWeight'],
    fontSize: 'var(--ts-corpo)',
    lineHeight: 'var(--lh-corpo)' as CSSProperties['lineHeight'],
  } satisfies CSSProperties,
} as const;

// Cor REAL de papel do sistema Alexandria, literal da spec §3 ("papel
// #F2E9D6"). Hardcoded de propósito: importar de alexandria-tokens.ts
// é proibido — a prévia cita o destino, não acopla os dois sistemas.
const ALEXANDRIA_PAPEL = '#F2E9D6';

/** startViewTransition com checagem de suporte — mesma técnica do
 *  PortalBR; duplicado aqui de propósito (componente não importa de
 *  página). flushSync para o snapshot novo capturar o DOM atualizado.
 *  Reduced-motion pula a transição por inteiro: o kill-switch CSS do
 *  PortalBR desmonta junto com a página na navegação, então confiar
 *  nele deixaria o crossfade default do UA animar mesmo assim. */
function comTransicao(mudanca: () => void) {
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduzido && 'startViewTransition' in document) {
    document.startViewTransition(() => {
      flushSync(mudanca);
    });
  } else {
    mudanca();
  }
}

// ─── Planta baixa ────────────────────────────────────────────────────
// Um esboço de layout por destino — traço fino ocre, sem preenchimento.
// Cada forma leva pathLength=1 + data-traco; o CSS do PortalBR anima o
// stroke-dashoffset quando .nivar-planta--visivel entra. Reduced
// motion cai para o estado final via a mesma folha.

interface Traco {
  el: 'rect' | 'line' | 'polyline';
  attrs: Record<string, string | number>;
}

const moldura: Traco = { el: 'rect', attrs: { x: 6, y: 6, width: 268, height: 138 } };

// viewBox 0 0 280 150. Cada destino sugere o próprio layout futuro.
const PLANTAS: Record<string, Traco[]> = {
  'terminal-brasil': [
    moldura,
    { el: 'line', attrs: { x1: 6, y1: 30, x2: 274, y2: 30 } },
    { el: 'line', attrs: { x1: 76, y1: 30, x2: 76, y2: 144 } },
    { el: 'rect', attrs: { x: 88, y: 42, width: 82, height: 42 } },
    { el: 'rect', attrs: { x: 180, y: 42, width: 82, height: 42 } },
    { el: 'rect', attrs: { x: 88, y: 94, width: 174, height: 38 } },
    { el: 'polyline', attrs: { points: '96,122 118,108 140,116 166,100 196,110 224,96 252,104' } },
  ],
  'energy-brief': [
    moldura,
    { el: 'line', attrs: { x1: 6, y1: 34, x2: 274, y2: 34 } },
    { el: 'rect', attrs: { x: 24, y: 48, width: 152, height: 12 } },
    { el: 'line', attrs: { x1: 24, y1: 76, x2: 176, y2: 76 } },
    { el: 'line', attrs: { x1: 24, y1: 90, x2: 176, y2: 90 } },
    { el: 'line', attrs: { x1: 24, y1: 104, x2: 176, y2: 104 } },
    { el: 'line', attrs: { x1: 24, y1: 118, x2: 148, y2: 118 } },
    { el: 'rect', attrs: { x: 192, y: 48, width: 64, height: 84 } },
  ],
  'conta-de-luz-express': [
    moldura,
    { el: 'rect', attrs: { x: 24, y: 20, width: 108, height: 20 } },
    { el: 'line', attrs: { x1: 24, y1: 58, x2: 256, y2: 58 } },
    { el: 'line', attrs: { x1: 24, y1: 74, x2: 256, y2: 74 } },
    { el: 'line', attrs: { x1: 24, y1: 90, x2: 256, y2: 90 } },
    { el: 'line', attrs: { x1: 24, y1: 106, x2: 256, y2: 106 } },
    { el: 'rect', attrs: { x: 168, y: 118, width: 88, height: 18 } },
  ],
  'diagnostico-energetico': [
    moldura,
    { el: 'rect', attrs: { x: 20, y: 20, width: 72, height: 44 } },
    { el: 'rect', attrs: { x: 104, y: 20, width: 72, height: 44 } },
    { el: 'rect', attrs: { x: 188, y: 20, width: 72, height: 44 } },
    { el: 'line', attrs: { x1: 20, y1: 84, x2: 216, y2: 84 } },
    { el: 'line', attrs: { x1: 20, y1: 100, x2: 184, y2: 100 } },
    { el: 'line', attrs: { x1: 20, y1: 116, x2: 244, y2: 116 } },
    { el: 'line', attrs: { x1: 20, y1: 132, x2: 152, y2: 132 } },
  ],
  // Solar Proposal Validator (Wave 2 da trilha): o documento da
  // proposta à esquerda, a divisa das DUAS TRILHAS de leitura
  // (regulatória / técnica) e os TRÊS vereditos possíveis à direita —
  // a estrutura real do Módulo 11 ("roteador de veredito — três
  // classes, todas alcançáveis"), não layout genérico.
  'solar-proposal-validator': [
    moldura,
    { el: 'rect', attrs: { x: 24, y: 20, width: 130, height: 18 } },
    { el: 'line', attrs: { x1: 24, y1: 56, x2: 154, y2: 56 } },
    { el: 'line', attrs: { x1: 24, y1: 72, x2: 154, y2: 72 } },
    { el: 'line', attrs: { x1: 24, y1: 88, x2: 154, y2: 88 } },
    { el: 'line', attrs: { x1: 24, y1: 104, x2: 154, y2: 104 } },
    { el: 'line', attrs: { x1: 24, y1: 120, x2: 130, y2: 120 } },
    { el: 'line', attrs: { x1: 170, y1: 20, x2: 170, y2: 130 } },
    { el: 'rect', attrs: { x: 186, y: 20, width: 70, height: 26 } },
    { el: 'rect', attrs: { x: 186, y: 62, width: 70, height: 26 } },
    { el: 'rect', attrs: { x: 186, y: 104, width: 70, height: 26 } },
  ],
};

const PLANTA_GENERICA: Traco[] = [
  moldura,
  { el: 'line', attrs: { x1: 6, y1: 32, x2: 274, y2: 32 } },
  { el: 'rect', attrs: { x: 24, y: 48, width: 232, height: 36 } },
  { el: 'rect', attrs: { x: 24, y: 96, width: 108, height: 36 } },
  { el: 'rect', attrs: { x: 148, y: 96, width: 108, height: 36 } },
];

export interface PlantaBaixaProps {
  destinoId: string;
  /** Dispara o desenho do traço. */
  visivel: boolean;
  /** Altura do bloco em px; a largura acompanha o container. */
  altura?: number;
}

export function PlantaBaixa({ destinoId, visivel, altura = 150 }: PlantaBaixaProps) {
  const tracos = PLANTAS[destinoId] ?? PLANTA_GENERICA;
  return (
    <svg
      viewBox="0 0 280 150"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className={`nivar-planta${visivel ? ' nivar-planta--visivel' : ''}`}
      style={{ width: '100%', height: `${altura}px`, display: 'block' }}
    >
      {tracos.map((t, i) => {
        const Tag = t.el;
        return (
          <Tag
            key={i}
            {...t.attrs}
            pathLength={1}
            data-traco
            fill="none"
            strokeWidth={1}
            // Família SOFTWARE — "produto instrumentado", que é
            // exatamente o que a planta baixa promete. Sobrevive aos
            // dois substratos como fio: 3,0:1 sobre papel, 5,5:1 sobre
            // tinta (tabela medida do sistema). var() não resolve em
            // atributo de apresentação de SVG — cor via style.
            style={{ stroke: 'var(--family-software)', animationDelay: `${i * 90}ms` }}
          />
        );
      })}
    </svg>
  );
}

// ─── Card ────────────────────────────────────────────────────────────

export interface DestinoCardProps {
  destino: DestinoBR;
  /** Zoom "em breve" — mesmo comportamento do clique de região no hero. */
  onZoom?: (destino: DestinoBR) => void;
}

export function DestinoCard({ destino, onZoom }: DestinoCardProps) {
  const [sobre, setSobre] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authCarregando, activateProduct } = useAuth();
  // Só o estado inicial importa aqui — mudança de preferência no meio
  // da visita re-renderiza no próximo mount.
  const [reduzido] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  // A planta baixa desenha AO ENTRAR EM VIEWPORT (spec §3), não no
  // mount — quem chega rolando do hero vê o traço acontecer. Uma vez
  // visto, fica desenhado.
  const quadroRef = useRef<HTMLElement | null>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = quadroRef.current;
    if (!el || visto) return;
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisto(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visto]);

  const disponivel = destino.status === 'disponivel' && destino.rota !== null;

  // Entrada por viewport: sobe 12px e assenta. Com reduced-motion o
  // card nasce pronto — mesma regra de estado final de sempre.
  const entrou = visto || reduzido;
  // Card NIVAR: região delimitada por fio de 1px, sem raio, sem
  // sombra, sem preenchimento próprio — profundidade vem do fio.
  // Hover muda cor de fio (nunca elevação, nunca escala). Entrada por
  // viewport é OPACIDADE PURA — o translateY da Wave 2 sai: o sistema
  // nunca anima posição de layout; quem desenha a chegada é a planta
  // baixa (stroke-dashoffset), não o card se movendo.
  const quadro: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--surface-page)',
    border: `var(--fio) solid ${sobre ? 'var(--rule-strong)' : 'var(--rule)'}`,
    borderRadius: 0,
    padding: 0,
    textAlign: 'left',
    textDecoration: 'none',
    cursor: 'pointer',
    opacity: entrou ? 1 : 0,
    transition:
      'border-color var(--dur-hover) var(--ease), opacity var(--dur-hover) var(--ease)',
  };

  const corpo = (
    <>
      {/* Prévia — a diferença entre os dois estados mora aqui. O papel
          da Alexandria é CITAÇÃO do destino (retrato do outro produto)
          e viaja igual nos dois modos — não é superfície do Portal. */}
      <div
        style={{
          height: '150px',
          borderBottom: 'var(--fio) solid var(--rule)',
          overflow: 'hidden',
          background: disponivel ? ALEXANDRIA_PAPEL : 'transparent',
        }}
      >
        {disponivel ? <PreviaAlexandria /> : <PlantaBaixa destinoId={destino.id} visivel={visto} />}
      </div>

      <div
        style={{
          padding: '16px 18px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
        }}
      >
        <h3 style={{ ...NT.titulo2, margin: 0, color: 'var(--text-strong)' }}>{destino.titulo}</h3>
        <p style={{ ...NT.corpo, margin: 0, color: 'var(--text-muted)' }}>{destino.descricao}</p>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {disponivel ? (
            <>
              <span style={{ ...NT.etiqueta, color: 'var(--text-strong)' }}>Acessar</span>
              {/* Glifo de avanço no acento da casa. SEM translateX de
                  hover — o sistema nunca anima posição; o hover do
                  card fala pelo fio. */}
              <span
                aria-hidden="true"
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: '13px',
                  color: 'var(--accent-house)',
                }}
              >
                →
              </span>
            </>
          ) : (
            // Tag do sistema — retângulo de fio, sem preenchimento.
            // O wash de fundo do Jaguar sai: NIVAR não preenche tag.
            <span
              style={{
                ...NT.etiqueta,
                color: 'var(--text-muted)',
                border: 'var(--fio) solid var(--tag-fio)',
                borderRadius: 0,
                padding: '4px 8px',
              }}
            >
              Em breve
            </span>
          )}
        </div>
      </div>
    </>
  );

  const eventos = {
    onMouseEnter: () => setSobre(true),
    onMouseLeave: () => setSobre(false),
    onFocus: () => setSobre(true),
    onBlur: () => setSobre(false),
  };

  if (disponivel) {
    const rota = destino.rota as string;

    /**
     * Entrar no produto é o que o ATIVA (contrato Wave 9: "Creating an
     * account activates nothing; a product becomes active only when
     * the user enters it").
     *
     * Sem sessão → /entrar, carregando o destino pretendido para a
     * pessoa cair no produto depois de entrar, não numa tela solta.
     *
     * Com sessão → dispara a ativação e navega. A navegação NÃO espera
     * a resposta: ativar é registro de uso, não portão de entrada, e
     * `POST /activate` é idempotente por constraint no banco. Se a
     * chamada falhar, quem clicou entra na Alexandria assim mesmo —
     * bloquear a leitura porque um insert de telemetria falhou seria
     * inverter a prioridade. O erro fica no console para diagnóstico.
     */
    const aoAbrir = () => {
      if (!user) {
        navigate('/entrar', { state: { de: rota } });
        return;
      }
      void activateProduct(destino.id).catch((err: unknown) => {
        console.warn(`[identidade] falha ao ativar "${destino.id}":`, err);
      });
      comTransicao(() => navigate(rota));
    };

    return (
      <Link
        to={rota}
        ref={(el) => {
          quadroRef.current = el;
        }}
        {...eventos}
        onClick={(e) => {
          // Clique modificado (Ctrl/Cmd/Shift/Alt, botão do meio) fica
          // com o browser — nova aba/janela. Só o clique simples entra
          // na view transition: papel Jaguar cruza em fade para o papel
          // Alexandria, a razão de o portal ser claro.
          if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          // Enquanto /api/auth/me não respondeu, não dá para saber se
          // há sessão — mandar para /entrar aqui expulsaria quem está
          // logado. Espera o contexto resolver; é questão de ms.
          if (authCarregando) return;
          aoAbrir();
        }}
        style={quadro}
      >
        {corpo}
      </Link>
    );
  }

  // Card em breve: <article> com botão esticado por cima, NÃO <button>
  // envolvendo o corpo — botão só aceita phrasing content, e o <h3> lá
  // dentro seria achatado da árvore de acessibilidade (navegação por
  // cabeçalho de leitor de tela perderia 4 dos 5 destinos).
  return (
    <article
      ref={(el) => {
        quadroRef.current = el;
      }}
      onMouseEnter={eventos.onMouseEnter}
      onMouseLeave={eventos.onMouseLeave}
      style={{ ...quadro, position: 'relative' }}
    >
      {corpo}
      <button
        type="button"
        aria-label={`${destino.titulo} — em breve; ver a planta do destino`}
        onFocus={eventos.onFocus}
        onBlur={eventos.onBlur}
        onClick={() => onZoom?.(destino)}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          border: 'none',
          borderRadius: 0,
          padding: 0,
          cursor: 'pointer',
        }}
      />
    </article>
  );
}

// Gravura própria do card, salva em disco pelo Aquiles e comprimida
// aqui do mesmo jeito que a LYCEUM trata o acervo da Alexandria
// (pngquant --quality=65-90, isolado no scratchpad): 3,4MB → 655KB,
// 1536×1024 preservado. Paleta indexada com tRNS — cantos
// transparentes, mesma assinatura dos outros PNGs do acervo.
const ALEXANDRIA_GRAVURA_SRC = '/alexandria/gravuras/alexandria-gravura.png';

/** Prévia da Alexandria — decisão direta do Aquiles substituindo o
 *  mockup de interface fake que a spec §3 original pedia ("prévia real
 *  da interface, conteúdo genuíno, nada ilustrativo"). Aqui é o oposto
 *  de propósito: a gravura, não a UI. object-fit: contain sobre o
 *  papel Alexandria — mesma técnica que o Prancha da LYCEUM usa no
 *  viewer (Wave 5): imagem nunca esticada, cantos transparentes
 *  revelam o papel por baixo. */
function PreviaAlexandria(): ReactNode {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
      }}
    >
      <img
        src={ALEXANDRIA_GRAVURA_SRC}
        alt="Bússola, mapa do Brasil e torre de transmissão — gravura da Alexandria"
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
      />
    </div>
  );
}

export default DestinoCard;
