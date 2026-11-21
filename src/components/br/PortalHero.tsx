// PortalHero — ARCHITECT, Portal BR Wave 3 · hero imersivo.
// Wave 5: sistema visual NIVAR nos dois modos — apresentação apenas;
// fases, geometria, dados e comportamento intocados.
//
// O mapa deixa de morar num painel fixo e vira o protagonista físico
// da sequência. Cinco fases sobre uma pista de 340vh:
//
//   0–25%   contorno IBGE desenha — mapa nasce menor, próximo do
//           centro da viewport, não ancorado à direita
//   20–50%  quatro submercados reais preenchem, escalonados
//   45–75%  intercâmbios esquemáticos conectam os centroides
//   75–95%  o mapa cresce e recentraliza até dominar a tela; título e
//           parágrafo esmaecem; rótulos regionais (sigla + PLD
//           ilustrativo) ancoram nos centroides
//   95–100% assentamento — barra compacta reintegra o headline e o
//           PLD agregado; a seção solta o scroll e o documento segue
//
// MECANISMO: cálculo de progresso em JS (validado na Wave 2),
// estendido para dirigir também transform/opacity. animation-timeline:
// view() foi avaliado e descartado nesta wave: cobertura ainda parcial
// fora do Chromium para view()+animation-range, e a sequência dirige
// ESTADO React (contadores, rótulos, interpolações SVG) — duas linhas
// do tempo (CSS e JS) dessincronizariam a mesma cena.
//
// WAVE 6: o botão "Pular apresentação" SAIU por decisão do Aquiles —
// o mapa se construindo na rolagem fica; o escape dedicado sai. O
// <main> focável continua rolável por teclado (setas/PageDown). A
// TESE entra entre o H1 e o subtítulo, nos dois layouts; o
// MethodDisclosure do sistema ancora na procedência do PLD.
//
// REDUCED-MOTION: sem pista, sem sticky, sem fase — layout ESTÁTICO em
// fluxo com todo o conteúdo legível (eyebrow, headline, parágrafo,
// mapa grande com rótulos, PLD). Não é o estado final da animação com
// texto esmaecido: é uma composição própria, porque esmaecer o
// parágrafo para quem nunca viu as fases seria perda de conteúdo, não
// redução de movimento.
//
// Os conectores seguem ESQUEMÁTICOS (diagrama de intercâmbio, não
// traçado físico); PLD segue MOCK, marcado ilustrativo em texto
// visível. Regra de geometria real: contorno e fronteira vêm de
// src/lib/geo/brasil-outline.ts (IBGE), nunca de path desenhado.
//
// TRATAMENTO NIVAR DO MAPA (decisão desta wave): preenchimento de
// região é LAVAGEM DE TINTA (--text-strong em opacidade baixa — no
// noturno vira lavagem de papel sozinho, pelo remapeio do alias);
// contorno é --rule-heavy; a camada de DADO (intercâmbio, nó,
// valor) leva --accent-house — brasa no claro, intelligence no
// noturno, os dois lados legais da escala. NOTA DE SVG: var() não
// resolve em atributo de apresentação — toda cor de token entra via
// style, nunca via fill=/stroke= cru.

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';

import {
  BRASIL_OUTLINE_D,
  BRASIL_VIEWBOX,
  SUBMERCADOS,
  type SubmercadoPath,
} from '../../lib/geo/brasil-outline';

export interface PortalHeroProps {
  titulo: string;
  subtitulo: string;
  /** O elemento que rola (o <main> do PortalBR). O hero lê o scroll dele —
   *  o documento não rola neste layout. */
  scrollHost: RefObject<HTMLElement | null>;
  /** Clique num polígono de submercado. */
  onRegiaoClick: (regiao: SubmercadoPath) => void;
}

// ─── Papéis tipográficos NIVAR (valores nos tokens CSS; ver PortalBR) ─
const NT = {
  etiqueta: {
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: 'var(--ts-etiqueta)',
    lineHeight: 'var(--lh-etiqueta)' as CSSProperties['lineHeight'],
    letterSpacing: 'var(--tr-etiqueta)',
    textTransform: 'uppercase',
  } satisfies CSSProperties,
  proc: {
    fontFamily: 'var(--font-data)',
    fontWeight: 400,
    fontSize: '10.5px',
    lineHeight: 1.5,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontVariantNumeric: 'tabular-nums lining-nums',
  } satisfies CSSProperties,
  display2: {
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--fw-display)' as CSSProperties['fontWeight'],
    fontSize: 'var(--ts-display-2)',
    lineHeight: 'var(--lh-display-2)' as CSSProperties['lineHeight'],
    letterSpacing: 'var(--tr-display-2)',
  } satisfies CSSProperties,
  titulo2: {
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--fw-display)' as CSSProperties['fontWeight'],
    fontSize: 'var(--ts-titulo-2)',
    lineHeight: 'var(--lh-titulo-2)' as CSSProperties['lineHeight'],
    letterSpacing: 'var(--tr-titulo-2)',
  } satisfies CSSProperties,
  lede: {
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--fw-corpo-leve)' as CSSProperties['fontWeight'],
    fontSize: 'var(--ts-lede)',
    lineHeight: 'var(--lh-lede)' as CSSProperties['lineHeight'],
    letterSpacing: 'var(--tr-lede)',
  } satisfies CSSProperties,
  /** Dado protagonista — o maior corpo de dado do sistema (40px). O
   *  84px do Jaguar não tem equivalente na escala NIVAR; registrado no
   *  fechamento da wave. */
  dado1: {
    fontFamily: 'var(--font-data)',
    fontWeight: 'var(--fw-dado-forte)' as CSSProperties['fontWeight'],
    fontSize: 'var(--ts-dado-1)',
    lineHeight: 'var(--lh-dado-1)' as CSSProperties['lineHeight'],
    letterSpacing: 'var(--tr-dado-1)',
    fontVariantNumeric: 'tabular-nums lining-nums',
  } satisfies CSSProperties,
} as const;

// Valores ILUSTRATIVOS — nenhum feed de PLD existe no front hoje.
// Mesma linguagem de submercado que Atlas e Alexandria já usam; o
// rótulo na tela diz "ilustrativo" em texto corrido.
const PLD_AGREGADO_MOCK = 138.72; // referência SE/CO
const PLD_REGIONAL_MOCK: Record<SubmercadoPath['id'], number> = {
  norte: 132.45,
  nordeste: 129.8,
  sudesteCentroOeste: 138.72,
  sul: 141.1,
};

// Deslocamento do rótulo regional em relação ao centroide (unidades do
// viewBox), escolhido para não cobrir o polígono vizinho.
const ROTULO_OFFSET: Record<SubmercadoPath['id'], readonly [number, number]> = {
  norte: [12, -10],
  nordeste: [16, -2],
  sudesteCentroOeste: [14, 26],
  sul: [14, 14],
};

const fase = (p: number, ini: number, fim: number) =>
  Math.min(1, Math.max(0, (p - ini) / (fim - ini)));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const CONEXOES: ReadonlyArray<readonly [string, string]> = [
  ['sul', 'sudesteCentroOeste'],
  ['sudesteCentroOeste', 'nordeste'],
  ['sudesteCentroOeste', 'norte'],
  ['norte', 'nordeste'],
];

// Opacidade de preenchimento por região — vizinhos alternam contraste;
// o fio interno hairline faz o resto (decisão da Wave 2).
const PESO_FILL: Record<SubmercadoPath['id'], number> = {
  norte: 0.34,
  nordeste: 0.18,
  sudesteCentroOeste: 0.26,
  sul: 0.12,
};

function usePrefereMenosMovimento(): boolean {
  const [reduzido, setReduzido] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduzido(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduzido;
}

const formatoBRL = (v: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function PortalHero({ titulo, subtitulo, scrollHost, onRegiaoClick }: PortalHeroProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progresso, setProgresso] = useState(0);
  const [regiaoSobre, setRegiaoSobre] = useState<string | null>(null);
  // MethodDisclosure (Wave 6) — fechado por padrão, como o componente.
  const [metodoAberto, setMetodoAberto] = useState(false);
  const reduzido = usePrefereMenosMovimento();

  useEffect(() => {
    if (reduzido) {
      setProgresso(1);
      return;
    }
    const host = scrollHost.current;
    const wrap = wrapRef.current;
    if (!host || !wrap) return;

    let raf = 0;
    const medir = () => {
      raf = 0;
      const runway = wrap.offsetHeight - host.clientHeight;
      if (runway <= 0) {
        setProgresso(1);
        return;
      }
      const delta = host.getBoundingClientRect().top - wrap.getBoundingClientRect().top;
      setProgresso(Math.min(1, Math.max(0, delta / runway)));
    };
    const aoRolar = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    host.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    return () => {
      host.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollHost, reduzido]);

  const p = progresso;
  const tContorno = easeOut(fase(p, 0, 0.25));
  const tCresce = easeInOut(fase(p, 0.75, 0.95));
  const opTexto = reduzido ? 1 : 1 - easeOut(fase(p, 0.75, 0.88));
  const opBarra = reduzido ? 1 : easeOut(fase(p, 0.9, 0.98));
  const tNumero = easeOut(fase(p, 0.75, 0.98));
  const valorAgregado = reduzido ? PLD_AGREGADO_MOCK : PLD_AGREGADO_MOCK * tNumero;

  const conectores = useMemo(() => {
    const porId = new Map(SUBMERCADOS.map((s) => [s.id, s]));
    return CONEXOES.map(([a, b], i) => {
      const ca = porId.get(a as SubmercadoPath['id'])!.centroid;
      const cb = porId.get(b as SubmercadoPath['id'])!.centroid;
      const mx = (ca[0] + cb[0]) / 2;
      const my = (ca[1] + cb[1]) / 2;
      const dx = cb[0] - ca[0];
      const dy = cb[1] - ca[1];
      const norma = Math.hypot(dx, dy) || 1;
      const bojo = 0.14 * norma * (i % 2 === 0 ? 1 : -1);
      const cx = mx - (dy / norma) * bojo;
      const cy = my + (dx / norma) * bojo;
      return { d: `M${ca[0]} ${ca[1]}Q${cx} ${cy} ${cb[0]} ${cb[1]}`, chave: `${a}-${b}` };
    });
  }, []);

  // ─── O SVG do mapa — compartilhado pelos dois layouts ─────────────
  // Tamanhos de texto em UNIDADES DE VIEWBOX (geometria do mapa, que
  // escala com o palco — o piso de legibilidade foi calibrado na Wave
  // 4); famílias e cores vêm dos tokens, via style.
  const mapa = (
    <svg
      viewBox={BRASIL_VIEWBOX}
      role="group"
      aria-label="Mapa do Brasil com os quatro submercados do SIN"
      style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
    >
      {SUBMERCADOS.map((s, i) => {
        const ini = 0.2 + i * 0.055;
        const t = reduzido ? 1 : easeOut(fase(p, ini, ini + 0.13));
        const sobre = regiaoSobre === s.id;
        const clicavel = t > 0.15;
        return (
          <path
            key={s.id}
            d={s.d}
            fillRule="evenodd"
            fillOpacity={t * (PESO_FILL[s.id] + (sobre ? 0.16 : 0))}
            strokeOpacity={sobre ? 1 : 0.3 * t}
            strokeWidth={sobre ? 1.2 : 0.7}
            role="button"
            tabIndex={clicavel ? 0 : -1}
            aria-label={`Submercado ${s.nome} — Terminal Brasil, em breve`}
            style={{
              // Lavagem de tinta: no noturno o alias vira papel e a
              // lavagem inverte junto — um tratamento, dois substratos.
              fill: 'var(--text-strong)',
              stroke: sobre ? 'var(--accent-house)' : 'var(--text-strong)',
              cursor: clicavel ? 'pointer' : 'default',
              pointerEvents: clicavel ? 'auto' : 'none',
              transition: 'fill-opacity var(--dur-estado) var(--ease)',
            }}
            onMouseEnter={() => setRegiaoSobre(s.id)}
            onMouseLeave={() => setRegiaoSobre(null)}
            onFocus={() => setRegiaoSobre(s.id)}
            onBlur={() => setRegiaoSobre(null)}
            onClick={() => onRegiaoClick(s)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRegiaoClick(s);
              }
            }}
          />
        );
      })}

      <path
        d={BRASIL_OUTLINE_D}
        fillRule="evenodd"
        fill="none"
        strokeWidth={1.1}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={reduzido ? 0 : 1 - tContorno}
        style={{ stroke: 'var(--rule-heavy)', pointerEvents: 'none' }}
      />

      {conectores.map((c, i) => {
        const ini = 0.45 + i * 0.06;
        const t = reduzido ? 1 : easeOut(fase(p, ini, ini + 0.12));
        return (
          <path
            key={c.chave}
            d={c.d}
            fill="none"
            // Camada de dado — o intercâmbio leva o acento da casa.
            strokeWidth={1.8}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - t}
            style={{ stroke: 'var(--accent-house)', pointerEvents: 'none' }}
          />
        );
      })}

      {/* No assentamento, a CORRENTE atravessa os intercâmbios — a
          peça 03 do especimen (janela de traço em velocidade
          constante, loop linear). O mapa fica vivo sem inventar dado:
          é o desenho do fluxo, não medição. Reduced-motion não ganha
          loop. */}
      {!reduzido &&
        p >= 0.98 &&
        conectores.map((c, i) => (
          <path
            key={`pulso-${c.chave}`}
            className="nivar-pulso"
            d={c.d}
            fill="none"
            strokeWidth={2.4}
            pathLength={1}
            style={{
              stroke: 'var(--accent-house)',
              pointerEvents: 'none',
              animationDelay: `${i * 350}ms`,
            }}
          />
        ))}

      {/* Nós dos centroides — aparecem com os conectores. Círculo
          pleno: a exceção de raio do sistema. */}
      {SUBMERCADOS.map((s, i) => {
        const t = reduzido ? 1 : easeOut(fase(p, 0.45 + i * 0.04, 0.58 + i * 0.04));
        return (
          <circle
            key={`no-${s.id}`}
            cx={s.centroid[0]}
            cy={s.centroid[1]}
            r={3.6}
            strokeWidth={0.6}
            opacity={t}
            style={{
              fill: 'var(--accent-house)',
              stroke: 'var(--surface-page)',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Fase 75–95%: rótulos regionais ancorados — sigla + PLD
          ilustrativo. Halo de papel via paint-order: a etiqueta cai
          DENTRO do fill da própria região (achado da revisão da Wave
          3); no noturno o halo vira tinta pelo mesmo alias. */}
      {SUBMERCADOS.map((s, i) => {
        const t = reduzido ? 1 : easeOut(fase(p, 0.78 + i * 0.03, 0.9 + i * 0.03));
        if (t === 0) return null;
        const [dx, dy] = ROTULO_OFFSET[s.id];
        const x = s.centroid[0] + dx;
        const y = s.centroid[1] + dy;
        const valor = reduzido ? PLD_REGIONAL_MOCK[s.id] : PLD_REGIONAL_MOCK[s.id] * t;
        return (
          <g key={`rotulo-${s.id}`} opacity={t} style={{ pointerEvents: 'none' }}>
            <line
              x1={s.centroid[0]}
              y1={s.centroid[1]}
              x2={x - 3}
              y2={y - 4}
              strokeWidth={1}
              style={{ stroke: 'var(--accent-house)' }}
            />
            <text
              x={x}
              y={y}
              fontSize={14}
              letterSpacing="0.14em"
              strokeWidth={4}
              strokeLinejoin="round"
              style={{
                fontFamily: 'var(--font-data)',
                fill: 'var(--text-muted)',
                stroke: 'var(--surface-page)',
                paintOrder: 'stroke',
              }}
            >
              {s.sigla}
            </text>
            <text
              x={x}
              y={y + 21}
              fontSize={20}
              fontWeight={500}
              strokeWidth={5}
              strokeLinejoin="round"
              style={{
                fontFamily: 'var(--font-data)',
                fill: 'var(--accent-house)',
                stroke: 'var(--surface-page)',
                paintOrder: 'stroke',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatoBRL(valor)}
            </text>
          </g>
        );
      })}

      {/* A marca de ilustrativo entra JUNTO com os primeiros valores
          regionais (78%), não só na barra final (90%) — sem janela em
          que número mock apareça sem aviso. Idioma --ilustrativa-fg:
          tinta forte no claro, advisory no noturno. O fio embaixo do
          idioma não existe em <text> de SVG — adaptação registrada. */}
      <text
        x={360}
        y={750}
        textAnchor="middle"
        fontSize={13}
        letterSpacing="0.14em"
        strokeWidth={4}
        strokeLinejoin="round"
        opacity={reduzido ? 1 : easeOut(fase(p, 0.78, 0.9))}
        style={{
          fontFamily: 'var(--font-data)',
          fill: 'var(--ilustrativa-fg)',
          stroke: 'var(--surface-page)',
          paintOrder: 'stroke',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        PLD por submercado · R$/MWh · valores ilustrativos
      </text>
    </svg>
  );

  // Eyebrow — etiqueta versalete no acento da casa (brasa no claro,
  // 9,3:1; intelligence no noturno, 11,6:1) + traço líder de 2px, o
  // fio de acento do sistema.
  const eyebrow = (
    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span
        aria-hidden="true"
        style={{ width: '22px', height: '2px', background: 'var(--accent-house)', flexShrink: 0 }}
      />
      <span style={{ ...NT.etiqueta, color: 'var(--accent-house)' }}>Portal · Brasil</span>
    </span>
  );

  // A TESE (Wave 6) — linha própria entre o H1 e o subtítulo, copy do
  // war room, verbatim. Zilla em corpo de título: afirmação editorial,
  // não parágrafo.
  const tese = (
    <p style={{ ...NT.titulo2, margin: 0, color: 'var(--text-strong)' }}>
      O dado do setor elétrico é público. A leitura não é.
    </p>
  );

  const barraPld = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        // Fio de acento de 2px — o acento marcando o dado vivo.
        borderLeft: '2px solid var(--accent-house)',
        paddingLeft: '18px',
      }}
    >
      <span style={{ ...NT.titulo2, color: 'var(--text-strong)' }}>{titulo}</span>
      <span style={{ ...NT.proc, color: 'var(--text-muted)' }}>
        PLD médio SE/CO · R$/MWh ·{' '}
        <span
          style={{
            color: 'var(--ilustrativa-fg)',
            fontWeight: 500,
            borderBottom: 'var(--fio) solid var(--ilustrativa-fio)',
            paddingBottom: '1px',
          }}
        >
          valor ilustrativo
        </span>
      </span>
      <span
        data-numeric
        // O dado vivo É o lugar da cor: acento da casa nos dois modos.
        // fontVariantNumeric literal repetido do NT.dado1 — o auditor
        // não resolve spread de token; o valor é o mesmo.
        style={{
          ...NT.dado1,
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--accent-house)',
        }}
      >
        {formatoBRL(valorAgregado)}
      </span>

      {/* MethodDisclosure (Wave 6) — o componente do sistema, ancorado
          na procedência: método → fonte → método publicado em → dado
          coletado em → premissas. A ordem é do COMPONENTE ("o método é
          público antes de existir número para defender"), e a copy é a
          do war room, verbatim. [DATA] é placeholder literal — a data
          real vem do Aquiles; registrado no fechamento. Sem link
          "metodologia completa": não existe página de metodologia
          ainda, e link morto é proibido. */}
      <div className="nv-metodo" style={{ marginTop: '4px' }}>
        <div className="nv-metodo__ancora">
          <button
            type="button"
            className="nv-metodo__gatilho"
            aria-expanded={metodoAberto}
            aria-controls="metodo-pld-painel"
            onClick={() => setMetodoAberto((v) => !v)}
          >
            Como este número é calculado
          </button>
        </div>
        {metodoAberto && (
          <div className="nv-metodo__painel" id="metodo-pld-painel">
            <svg
              className="nv-metodo__fio-desenho"
              viewBox="0 0 1000 1"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line x1="0" y1="0.5" x2="1000" y2="0.5" />
            </svg>
            <div className="nv-metodo__corpo">
              <div className="nv-metodo__linha">
                <span className="nv-metodo__rot">Método</span>
                <p className="nv-metodo__v">
                  Leitura por submercado segue a divisão oficial do Operador Nacional do
                  Sistema Elétrico. Os valores desta tela são ilustrativos — não são
                  apuração ao vivo.
                </p>
              </div>
              <div className="nv-metodo__linha">
                <span className="nv-metodo__rot">Fonte</span>
                <p className="nv-metodo__v nv-metodo__v--dado">Divisão de submercado: ONS.</p>
              </div>
              <div className="nv-metodo__linha">
                <span className="nv-metodo__rot">Método publicado em</span>
                <p className="nv-metodo__v nv-metodo__v--dado">[DATA]</p>
              </div>
              <div className="nv-metodo__linha">
                <span className="nv-metodo__rot">Dado coletado em</span>
                <p className="nv-metodo__v nv-metodo__v--dado">
                  não aplicável — amostra construída para demonstração.
                </p>
              </div>
              <div className="nv-metodo__linha">
                <span className="nv-metodo__rot">Premissas</span>
                <ul className="nv-metodo__premissas">
                  <li>Nenhum valor nesta tela deve orientar decisão de mercado.</li>
                  <li>Leitura ao vivo chega com o Terminal Brasil.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Reduced-motion: composição estática própria, em fluxo ────────
  // Nada de pista, nada de sticky, nada esmaecido. Todo o conteúdo
  // (parágrafo incluso) legível — esmaecer texto para quem nunca viu
  // as fases seria perda de conteúdo, não redução de movimento.
  if (reduzido) {
    return (
      <section
        aria-label="O Sistema Interligado Nacional em quatro submercados"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          padding: '32px 0',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '62ch' }}>
          {eyebrow}
          <h1 style={{ ...NT.display2, margin: 0, color: 'var(--text-strong)' }}>{titulo}</h1>
          {tese}
          <p style={{ ...NT.lede, margin: 0, color: 'var(--text-muted)' }}>{subtitulo}</p>
        </div>
        {/* min 770px: abaixo disso a escala do viewBox (720u) derruba a
            sigla de 14u para menos de 13px renderizados — piso da Wave
            4, mantido. */}
        <div style={{ width: 'min(770px, 94%)', aspectRatio: '720 / 755', alignSelf: 'center' }}>
          {mapa}
        </div>
        {barraPld}
      </section>
    );
  }

  // ─── Sequência imersiva ───────────────────────────────────────────
  return (
    <div ref={wrapRef} style={{ height: '340vh' }}>
      <section
        aria-label="O Sistema Interligado Nacional em quatro submercados"
        style={{
          position: 'sticky',
          top: 0,
          // Scrollport do <main>: 100vh menos o header de 64px do
          // PortalBR. Acoplamento consciente com o layout do pai.
          height: 'calc(100vh - 64px)',
          overflow: 'hidden',
        }}
      >
        {/* Fio de progresso da sequência — orientação de onde se está
            na pista presa. Some no assentamento. */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '2px',
            width: `${p * 100}%`,
            background: 'var(--accent-house)',
            opacity: p >= 0.98 ? 0 : 1,
            transition: 'opacity var(--dur-hover) var(--ease)',
            zIndex: 3,
          }}
        />

        {/* Legenda de hover — redundância VISUAL do aria-label que os
            polígonos já carregam; aria-hidden para não virar live
            region tagarela no leitor de tela. À esquerda, longe do
            botão de pular, com teto de largura. */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            bottom: '20px',
            maxWidth: '58%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            ...NT.etiqueta,
            color: 'var(--accent-house)',
            opacity: regiaoSobre ? 1 : 0,
            transition: 'opacity var(--dur-estado) var(--ease)',
            pointerEvents: 'none',
            zIndex: 3,
            whiteSpace: 'nowrap',
          }}
        >
          {regiaoSobre
            ? `${SUBMERCADOS.find((s) => s.id === regiaoSobre)?.nome} — Terminal Brasil, em breve`
            : ''}
        </span>

        {/* Camada do mapa — nasce menor, levemente à direita do centro;
            cresce e recentraliza em 75–95% até dominar o palco. */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            height: '58%',
            aspectRatio: '720 / 755',
            // 1.65 no fim: garante escala ≥1 do viewBox mesmo em palco
            // de 836px — os rótulos de 14u nunca caem abaixo de 13px.
            transform: `translate(-50%, -50%) translateX(${(1 - tCresce) * 14}vw) scale(${
              1 + 0.65 * tCresce
            })`,
            zIndex: 1,
          }}
        >
          {mapa}
        </div>

        {/* Camada de texto — recua quando o mapa assume (75–88%). */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'min(40%, 560px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            opacity: opTexto,
            pointerEvents: opTexto < 0.1 ? 'none' : 'auto',
            zIndex: 2,
          }}
        >
          {eyebrow}
          <h1 style={{ ...NT.display2, margin: 0, color: 'var(--text-strong)' }}>{titulo}</h1>
          {tese}
          <p style={{ ...NT.lede, margin: 0, color: 'var(--text-muted)' }}>{subtitulo}</p>
          <span
            style={{
              ...NT.etiqueta,
              color: 'var(--text-muted)',
              opacity: Math.max(0, 1 - fase(p, 0, 0.1)),
            }}
          >
            Role — o mapa se constrói
          </span>
        </div>

        {/* Assentamento (90–100%): headline reintegrado + PLD agregado.
            O agregado É a referência SE/CO — o mesmo número que o
            rótulo regional mostra no mapa, promovido a figura. */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: '9%',
            zIndex: 2,
            opacity: opBarra,
            pointerEvents: opBarra < 0.1 ? 'none' : 'auto',
          }}
        >
          {barraPld}
        </div>
      </section>
    </div>
  );
}

export default PortalHero;
