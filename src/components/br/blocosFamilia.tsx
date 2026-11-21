// blocosFamilia — ARCHITECT, Solar Proposal Validator Wave 2 · Fase 1.
//
// O SLOT DE PROFUNDIDADE da página de família. Substitui os dois
// condicionais hardcoded (`ehAcademy`, `ehAdvisory`) que a FamiliaPage
// carregava — a recon desta trilha
// (`docs/solar-proposal-validator-recon-frontend.md`, §2.5, Saída A,
// confirmada pelo war room) mediu que o gate era de FAMÍLIA mas o
// conteúdo era de PRODUTO, e que o segundo produto Advisory aberto
// quebraria o mecanismo: ou sumia da camada de profundidade, ou o
// número de seção `02` colidia num segundo bloco colado.
//
// MÓDULO PRÓPRIO, NÃO `br-familias.ts`: a recon recomendou
// explicitamente não misturar copy de produto no arquivo de catálogo.
// Este módulo LÊ o catálogo (a rota do CTA vem de `DestinoBR.rota`,
// nunca digitada) e acrescenta a camada de apresentação por cima —
// mesmo desenho que `br-familias.ts` usa sobre `br-destinos.ts`.
//
// CONTRATO DE RENDERIZAÇÃO (quem renderiza é a FamiliaPage):
//   · numeração DERIVADA — o bloco N do produto na posição i da
//     família recebe `String(2 + i)`, nunca um literal digitado. Era
//     esse o defeito de fundo: `02` escrito em dois lugares do mesmo
//     arquivo.
//   · `Antes` (opcional) renderiza ACIMA do cabeçalho da seção — a
//     gravura da Alexandria, que sempre veio antes do header.
//   · `Corpo` (opcional) substitui a faixa de colunas + CTA — a grade
//     de contadores da Academy carrega o próprio CTA embutido na
//     última célula, então o corpo dela é dono do bloco inteiro.
//   · sem `Corpo`, renderiza `colunas` como faixa de bordas colapsadas
//     e, se houver `ctaRotulo` E o produto tiver rota no catálogo, a
//     linha de CTA. Produto sem rota nunca ganha link morto.
//
// Papéis tipográficos e `comTransicao` DECLARADOS AQUI de novo, de
// propósito — é o idioma do Portal (ver DestinoCard.tsx, que documenta
// a mesma duplicação: componente não importa de página, e a referência
// `var()` garante que o valor nunca diverge).

import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';

import type { DestinoBR } from '../../lib/data/br-destinos';
// Números REAIS do produto aberto da Academy — derivados do catálogo
// da Alexandria (LEITURA, nunca modificação). Migraram da landing na
// Portal BR Wave 9 e da FamiliaPage para cá na Fase 1 desta wave.
import { ALEXANDRIA_TRILHAS } from '../../lib/data/alexandria-trilhas';
import { ALEXANDRIA_BLOCKS } from '../../lib/data/alexandria-blocks';

// ─── Papéis tipográficos (locais, como todo componente do Portal) ────
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
  corpo: {
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--fw-corpo)' as CSSProperties['fontWeight'],
    fontSize: 'var(--ts-corpo)',
    lineHeight: 'var(--lh-corpo)' as CSSProperties['lineHeight'],
  } satisfies CSSProperties,
} as const;

/** startViewTransition com checagem de suporte — mesma técnica e mesma
 *  duplicação deliberada do DestinoCard (componente não importa de
 *  página). Reduced-motion pula a transição por inteiro. */
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

// ─── O contrato do slot ──────────────────────────────────────────────

export interface CorpoBlocoProps {
  /** Os destinos da família, resolvidos do catálogo — para o corpo
   *  achar a própria rota sem digitá-la. */
  produtos: DestinoBR[];
  /** prefers-reduced-motion no mount da página. */
  reduzido: boolean;
}

export interface BlocoFamiliaProduto {
  /** Id de `DESTINOS_BR` — o bloco só renderiza se o produto pertencer
   *  à família da página, na ordem dos produtos dela. */
  produtoId: string;
  ariaLabel: string;
  /** Etiqueta do cabeçalho da seção. */
  titulo: string;
  /** Canto direito do cabeçalho. */
  nota: string;
  /** Faixa de colunas de bordas colapsadas. Ignorada quando há `Corpo`. */
  colunas: Array<{ k: string; v: string }>;
  /** Rótulo do CTA; a rota vem do catálogo. `null` = sem CTA (ou o
   *  `Corpo` carrega o dele). Produto sem rota não ganha link morto. */
  ctaRotulo: string | null;
  /** Texto ao lado do CTA. */
  ctaNota: string | null;
  /** Conteúdo ACIMA do cabeçalho (gravura da Academy). */
  Antes?: () => ReactElement;
  /** Corpo próprio, substitui colunas + CTA (grade de contadores da
   *  Academy, com o CTA embutido na última célula). */
  Corpo?: (props: CorpoBlocoProps) => ReactElement;
}

// ─── Academy · A Alexandria em números ───────────────────────────────
// Conteúdo VERBATIM do bloco `ehAcademy` da FamiliaPage (que veio da
// landing na Wave 9) — a migração para o slot muda o mecanismo, nunca
// o texto visível. Verificação da fase é por conteúdo renderizado.

// A gravura do produto — o mesmo arquivo que ilustrava o card do
// destino na landing antes da Wave 8. A cor de papel é a do sistema
// ALEXANDRIA, literal: a gravura tem cantos transparentes e foi
// desenhada para esse fundo. Hardcoded de propósito — importar
// `alexandria-tokens.ts` é proibido; a página CITA o produto, não
// acopla os dois sistemas. O papel NÃO inverte com o modo.
const ALEXANDRIA_GRAVURA_SRC = '/alexandria/gravuras/alexandria-gravura.png';
const ALEXANDRIA_PAPEL = '#F2E9D6';

/** Entrou na tela uma vez (IntersectionObserver, dispara uma vez e
 *  desconecta — mesmo padrão do DestinoCard). */
function useEntrouNaTela<T extends HTMLElement>(limiar = 0.25) {
  const ref = useRef<T | null>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || visto) return;
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisto(true);
          io.disconnect();
        }
      },
      { threshold: limiar },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visto, limiar]);
  return { ref, visto };
}

/** Contador que sobe com smoothstep quando entra na tela (1400ms), em
 *  rAF. Reduced-motion nasce pronto. */
function ContadorVivo({ valor, reduzido }: { valor: number; reduzido: boolean }) {
  const { ref, visto } = useEntrouNaTela<HTMLSpanElement>(0.4);
  const [mostrado, setMostrado] = useState(reduzido ? valor : 0);
  useEffect(() => {
    if (!visto || reduzido) {
      if (reduzido) setMostrado(valor);
      return;
    }
    const DUR = 1400;
    let raf = 0;
    let inicio: number | null = null;
    const passo = (ts: number) => {
      if (inicio === null) inicio = ts;
      const p = Math.min(1, (ts - inicio) / DUR);
      const suave = p * p * (3 - 2 * p);
      setMostrado(Math.round(valor * suave));
      if (p < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [visto, valor, reduzido]);
  return (
    <span
      ref={ref}
      data-numeric
      style={{
        fontFamily: 'var(--font-data)',
        fontWeight: 'var(--fw-dado-forte)' as CSSProperties['fontWeight'],
        fontSize: 'var(--ts-dado-1)',
        lineHeight: 'var(--lh-dado-1)' as CSSProperties['lineHeight'],
        letterSpacing: 'var(--tr-dado-1)',
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--accent-house)',
      }}
    >
      {mostrado.toLocaleString('pt-BR')}
    </span>
  );
}

/** Derivado, nunca digitado. */
const ALEXANDRIA_STATS = (() => {
  const trilhas = ALEXANDRIA_TRILHAS.length;
  const modulos = ALEXANDRIA_BLOCKS.length;
  const aulas = ALEXANDRIA_TRILHAS.reduce((soma, t) => soma + (t.totalAulas ?? 0), 0);
  return [
    { rotulo: 'trilhas de formação', valor: trilhas },
    { rotulo: 'módulos catalogados', valor: modulos },
    { rotulo: 'aulas confirmadas', valor: aulas },
  ];
})();

function GravuraAlexandria() {
  return (
    <div
      style={{
        background: ALEXANDRIA_PAPEL,
        border: 'var(--fio) solid var(--rule)',
        padding: '16px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <img
        src={ALEXANDRIA_GRAVURA_SRC}
        alt="Bússola, mapa do Brasil e torre de transmissão — gravura da Alexandria"
        style={{
          width: '100%',
          maxWidth: '520px',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
}

function CorpoAcademy({ produtos, reduzido }: CorpoBlocoProps) {
  const navigate = useNavigate();
  const alexandria = produtos.find((d) => d.id === 'alexandria');
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        borderTop: 'var(--fio) solid var(--rule)',
        borderBottom: 'var(--fio) solid var(--rule)',
      }}
    >
      {ALEXANDRIA_STATS.map((st, i) => (
        <div
          key={st.rotulo}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '20px 24px',
            borderLeft: i > 0 ? 'var(--fio) solid var(--rule)' : 'none',
          }}
        >
          <ContadorVivo valor={st.valor} reduzido={reduzido} />
          <span style={{ ...NT.etiqueta, color: 'var(--text-muted)' }}>{st.rotulo}</span>
        </div>
      ))}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '10px',
          padding: '20px 24px',
          borderLeft: 'var(--fio) solid var(--rule)',
        }}
      >
        {alexandria && alexandria.rota ? (
          <Link
            className="nv-btn nv-btn--secundario"
            to={alexandria.rota}
            onClick={(e) => {
              if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              comTransicao(() => navigate(alexandria.rota as string));
            }}
          >
            Entrar na Alexandria
            <span className="nv-btn__glifo" aria-hidden="true">
              →
            </span>
          </Link>
        ) : null}
        <span style={{ ...NT.proc, color: 'var(--text-faint)' }}>
          Contagem derivada do catálogo extraído
        </span>
      </div>
    </div>
  );
}

// ─── As declarações ──────────────────────────────────────────────────
// Copy dos blocos existentes VERBATIM dos condicionais que este módulo
// substitui. Bloco novo entra aqui quando o produto dele tiver o que
// declarar — e a numeração da página acompanha sozinha.

export const BLOCOS_FAMILIA: BlocoFamiliaProduto[] = [
  {
    produtoId: 'alexandria',
    ariaLabel: 'A Alexandria em números',
    titulo: 'A Alexandria em números',
    nota: 'o produto aberto hoje',
    colunas: [],
    ctaRotulo: null,
    ctaNota: null,
    Antes: GravuraAlexandria,
    Corpo: CorpoAcademy,
  },
  {
    produtoId: 'conta-de-luz-express',
    ariaLabel: 'Conta de Luz Express',
    titulo: 'Conta de Luz Express',
    // Segue verdadeira dentro da Advisory enquanto for o único ABERTO
    // da família — quando o segundo abrir de verdade, a wave que abrir
    // troca esta string junto.
    nota: 'o produto aberto hoje',
    // Três colunas de bordas colapsadas: o que entra · o que sai · o
    // que não é. A terceira é a tese da casa aplicada ao produto — não
    // é rodapé legal, é o que o diferencia.
    colunas: [
      {
        k: 'O que entra',
        v: 'Uma fatura de energia industrial — PDF ou imagem — enviada pela conta.',
      },
      {
        k: 'O que sai',
        v: 'Parecer sobre modalidade tarifária, demanda contratada e oportunidades a validar, com o contraditório junto.',
      },
      {
        k: 'O que não é',
        v: 'Não vende energia, não intermedia contrato, não recebe comissão. Nenhuma economia é prometida.',
      },
    ],
    ctaRotulo: 'Enviar uma fatura',
    ctaNota: 'Leitura manual · sem cobrança nesta etapa',
  },
  {
    // Solar Proposal Validator Wave 2, Fase 4 — REGISTRADO, não
    // ativado. O produto está `em-breve` no catálogo (rota null), então
    // o CTA não renderiza — só a nota. Copy do MÓDULO 11 da Alexandria,
    // a especificação real do produto: separar fato de premissa,
    // perguntas de negociação com base normativa citada, e a disciplina
    // de linguagem que o próprio módulo trava (oportunidades a validar,
    // nunca economia prometida).
    produtoId: 'solar-proposal-validator',
    ariaLabel: 'Solar Proposal Validator',
    titulo: 'Solar Proposal Validator',
    nota: 'em construção',
    colunas: [
      {
        k: 'O que entra',
        v: 'Uma proposta comercial de sistema solar — PDF ou imagem — enviada pela conta.',
      },
      {
        k: 'O que sai',
        v: 'Parecer que separa fato de premissa em cada linha — enquadramento, regime de compensação, geração estimada — com as perguntas de negociação e a base normativa citada.',
      },
      {
        k: 'O que não é',
        v: 'Não vende sistema, não indica instalador, não recebe comissão. Nenhuma economia é prometida.',
      },
    ],
    ctaRotulo: null,
    ctaNota: 'Em construção · o envio abre com a ativação do produto',
  },
  // ─── Advisory · Diagnóstico Energético ─────────────────────────────
  // Diagnóstico Energético Wave 2. O TERCEIRO produto Advisory a
  // declarar bloco — e a prova de que o slot aguenta: a numeração de
  // seção deriva da ordem do catálogo, então esta entrada nasce como
  // `04` sem ninguém digitar o número.
  //
  // Sem `Corpo` e sem `Antes`: a faixa de três colunas é a forma que
  // CLE e Solar usam, e a terceira coluna é sempre a tese da casa
  // aplicada ao produto. `ctaRotulo: null` porque o catálogo mantém
  // `rota: null` — produto sem rota anunciada não ganha link morto,
  // mesmo com a página existindo em demonstração.
  {
    produtoId: 'diagnostico-energetico',
    ariaLabel: 'Diagnóstico Energético',
    titulo: 'Diagnóstico Energético',
    nota: 'em construção',
    colunas: [
      {
        k: 'O que entra',
        v: 'Um escopo — setor, porte de consumo e o que está em jogo — mais a fatura e o contrato vigente da operação.',
      },
      {
        k: 'O que sai',
        v: 'Leitura da estrutura inteira: enquadramento, modalidade tarifária, demanda contratada e exposição, com o contraditório de cada conclusão e o percurso registrado enquanto a análise corre.',
      },
      {
        k: 'O que não é',
        v: 'Não vende energia, não intermedia contrato, não recebe comissão. Nenhuma economia é prometida.',
      },
    ],
    ctaRotulo: null,
    ctaNota: 'Em construção · o escopo abre com a ativação do produto',
  },
];

/** Os blocos de uma família, NA ORDEM dos produtos dela — a numeração
 *  de seção da página deriva desta ordem. Produto sem bloco declarado
 *  simplesmente não aparece na camada de profundidade. */
export function blocosDosProdutos(produtos: DestinoBR[]): BlocoFamiliaProduto[] {
  return produtos
    .map((p) => BLOCOS_FAMILIA.find((b) => b.produtoId === p.id))
    .filter((b): b is BlocoFamiliaProduto => b !== undefined);
}
