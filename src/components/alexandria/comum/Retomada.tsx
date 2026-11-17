// Retomada — o bloco "onde você parou" / "por onde começar", UMA peça só,
// usada na Home, no hub das Trilhas e na carta do território (bar A3, S1).
//
// POR QUE ELE MUDOU. O bloco anterior era caixa creme com fio, barra de
// acento navy na borda esquerda e faixa cheia navy embaixo como botão: a
// gramática de qualquer produto genérico, e a peça que mais destoava da
// gravura ao lado. O julgamento cego de seis direções (registro em
// `docs/alexandria-v2/media-lab/retomada/`) deu a vitória por soma de
// rankings à direção DIÁRIO DE BORDO — a única sem caixa nenhuma:
//
//   soma dos três julgamentos: diário 7 · escala 8 · marcador 10 · ficha ≥11
//   · atual ≥13 · cartucho ≥14 · plaqueta ≥15
//
// ANATOMIA. Cabeça corrida em versalete, fio de abertura de 1,4px, margem
// de nota à esquerda (vinheta gravada, código em algarismo tabular, data) e
// o registro à direita. Zero preenchimento, zero moldura, zero segunda cor
// de fundo: o papel passa por baixo de tudo, então nada foi colado.
//
// AS DUAS LACUNAS QUE O JULGAMENTO APONTOU, E A CORREÇÃO DE CADA UMA:
//
//  1. "Ela pertence por AUSÊNCIA: removeu tudo e removeu junto o objeto —
//     não há nada que a marque como registro SEU, e o CONTINUAR virou um
//     filete com setinha indistinguível das réguas acima."
//     → a margem ganhou uma VINHETA GRAVADA do território (mídia real,
//       reentintada na tinta da casa — ver `vinhetaDoTerritorio`), e a ação
//       virou uma CARTELA GRAVADA (r08 — ver `CartelaAcao`). Tudo por
//       desenho: nenhum fill sólido entrou de volta.
//
//  2. "O estado está dissolvido dentro da prosa corrida: exige leitura de
//     parágrafo para saber onde se está."
//     → o estado saiu da prosa e virou LINHA PRÓPRIA — glifo, palavra em
//       peso 600 e a data —, com o motivo abaixo dela, em itálico e menor.
//       Três camadas de leitura, nenhuma caixa.
//
// A AÇÃO COM MASSA (r08). A r07 tirou a mobília da r06 (cartão creme +
// barra navy) e não pôs objeto nenhum no lugar: o Craft mediu a linha da
// ação em 3,99 % de tinta por área contra 4,03 % da nota em itálico e
// 5,71 % da linha de metadado do MESMO bloco — o CONTINUAR era o traço
// mais leve da coluna. E o Founder vetou a manícula "em qualquer forma".
// O laboratório mediu cinco objetos terminais sem mão
// (`docs/alexandria-v2/media-lab/manicula/sem-mao/medidas.json`) e a
// CARTELA GRAVADA venceu: 10,14 % a 1440, 9,70 % em E0 e 9,72 % a 390 —
// acima da nota, acima do metadado e acima do próprio título da aula
// (9,50 %), que é a peça pequena mais densa do quadro.
//
// Por que a cartela e não um símbolo novo: ela já é a marca de REGISTRO
// do cabeçalho (`Marcas.tsx::SeloRegistro`) — a mesma cartela de portulano
// de duas pontas entalhadas. O que fecha a coluna é a peça que abre a
// folha. A massa vem do entalhe, do fio duplo da dobra e da têmpera;
// área chapada, zero. Junto saiu o FIO-FLECHA da r07 (régua de 1,6px com
// ponta de seta), que terminava no ar 109px depois da cartela e era o
// duplicado: a coluna passa a ter UM objeto terminal em vez de dois fios.
//
// Regras travadas (bar S2, S7): raio 0, sem sombra, sem gradiente, sem
// barra cheia navy como botão; UMA ação principal, que nomeia objeto
// (código da aula) E motivo (título dela); alvo ≥ 44px a 390 e contraste
// ≥ 4,5:1 (navy #0D2340 sobre pergaminho #F2E9D6 mede 13,0:1).

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { A, A2, AF, AR, AT2 } from '@/design/alexandria-tokens';
import { MarcaEstacao, type EstadoEstacaoMarca } from './Marcas';

export type Ilha = 'I' | 'II' | 'III';

export type EstadoRetomada = 'em leitura' | 'a seguir' | 'ponto de partida' | 'percorrida';

export interface AcaoRetomada {
  /** Verbo da ação: Continuar, Começar, Começar a próxima, Rever. */
  verbo: string;
  /** O OBJETO: o código da aula, ex. 'M01·A08'. */
  codigo: string;
  /** O MOTIVO: o título da aula — por que esta, e não outra (S1). */
  motivo: string;
  destino: string;
  /** Navegação de SPA, quando a superfície precisar dela. */
  aoIr?: (evento: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface DadosRetomada {
  /** Cabeça corrida: "Onde você parou", "Por onde começar", "Você está aqui". */
  titulo: string;
  /** Aparato à direita da cabeça: "registro de estudo", contagem com escopo…
   *  Omitido onde a superfície já imprime a linha de aparato logo abaixo. */
  escopo?: string;
  /** O bloco assenta SOBRE a prancha gravada (a entrada), não sobre papel
   *  limpo. Ver `CabecaCorrida`: o rótulo de procedência muda de corpo e de
   *  tinta, porque é ele que decide o S7 dessa composição. */
  sobreGravura?: boolean;
  /** Código do ponto, na margem de nota. */
  codigo: string;
  /** Início da leitura (ISO), quando houver. Em E0 é sempre null. */
  data: string | null;
  estado: EstadoRetomada;
  /** Título do objeto: o módulo (Home) ou a aula (carta). */
  cabeca: string;
  /** Linha de aparato: módulo, aula de N, trilha. */
  meta: string;
  /** Motivo em prosa, uma linha (A3). */
  motivo: string;
  /** Vinheta gravada do território na margem; null onde a superfície já
   *  carrega a marca do território ao lado (hub e carta levam o emblema no
   *  cabeçalho da mesma coluna — duas marcas ali seriam ruído). */
  vinheta: Ilha | null;
  /** A ação única. null só enquanto não há destino conhecido. */
  acao: AcaoRetomada | null;
  /** Id do h2, para `aria-labelledby` da seção. */
  id?: string;
}

// ── Vinheta gravada do território ───────────────────────────────────────
//
// Mídia real, não desenho de UI: prancha gerada no Higgsfield na MESMA
// linguagem de chapa do Titã da Home ("sepia copperplate engraving on warm
// parchment, fine parallel burin hatching") e reentintada na tinta da casa
// (#2A2620) por `media-lab/retomada/_scripts/vinhetas.py` — o papel da
// prancha vira transparente e sobra só a linha gravada. Classe atmosfera;
// crédito e proveniência em `docs/alexandria-v2/media-provenance.md` e nos
// créditos da rota ("Sobre esta figura").
const RAIZ_VINHETA = '/alexandria/v2/comum';

/** Proporção real de cada peça, medida no recorte (`_vinhetas/vinhetas.json`).
 *  A vinheta é publicada na proporção do DESENHO, sem caixa quadrada: a
 *  margem transparente de um quadrado abria um buraco entre o desenho e o
 *  código logo abaixo. A altura é que é constante entre as três. */
const VINHETA_DIM: Record<Ilha, { w: number; h: number }> = {
  I: { w: 253, h: 336 },
  II: { w: 297, h: 336 },
  III: { w: 238, h: 336 },
};

export const vinhetaDoTerritorio = (ilha: Ilha) => ({
  src: `${RAIZ_VINHETA}/retomada-vinheta-${ilha}-168.webp`,
  srcSet: `${RAIZ_VINHETA}/retomada-vinheta-${ilha}-168.webp ${Math.round(VINHETA_DIM[ilha].w / 2)}w, ${RAIZ_VINHETA}/retomada-vinheta-${ilha}-336.webp ${VINHETA_DIM[ilha].w}w`,
  ...VINHETA_DIM[ilha],
});

const ALT_VINHETA: Record<Ilha, string> = {
  I: 'Vinheta gravada: dínamo de bancada com ímã de ferradura e correia.',
  II: 'Vinheta gravada: torre de transmissão treliçada com isoladores e cabos.',
  III: 'Vinheta gravada: compasso de pontas secas aberto sobre a mesa.',
};

// ── Glifos ──────────────────────────────────────────────────────────────

/** Glifo de estado — literalmente o mesmo desenho do globo, da legenda da
 *  figura e da faixa navy (`comum/Marcas.tsx`). Antes era a série de radio
 *  button (disco cheio / meia-lua / anel), que é o vocabulário de formulário
 *  que a varredura reprovou no T18. */
const ESTACAO_DO_ESTADO: Record<EstadoRetomada, EstadoEstacaoMarca> = {
  'em leitura': 'em-curso',
  'a seguir': 'a-seguir',
  'ponto de partida': 'partida',
  percorrida: 'percorrido',
};

export function GlifoEstado({ estado, cor = A.tintaSobreCreme, tamanho = 14 }: { estado: EstadoRetomada; cor?: string; tamanho?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignSelf: 'center', flex: 'none' }}>
      <MarcaEstacao estado={ESTACAO_DO_ESTADO[estado]} tamanho={tamanho} cor={cor} />
    </span>
  );
}

// ── A cartela da ação ───────────────────────────────────────────────────
//
// Receita medida em `media-lab/manicula/sem-mao/acao.json :: opcoes.cartela`
// (px do quadro 1440; a 390 multiplica por k = 0,90):
//
//   altura 32 · entalhe em V 6 · recuo da dobra 10 · folga até o texto 15
//   fios: corpo 1,6 · dobra 1,1 · têmpera 0,6 a 55 % de opacidade
//   largura total = largura do rótulo + 2 × (10 + 15)
//   preenchimento: NENHUM — o papel da prancha passa por dentro
//
// A caixa é medida no render (o rótulo muda de largura com o estado e com
// a superfície), então o desenho é paramétrico nas duas dimensões: se o
// rótulo quebrar em duas linhas na coluna estreita do hub, o entalhe
// continua na meia-altura e a dobra continua a 10px das pontas.

/** Escala da cartela: 1 na medida larga, 0,90 na estreita. */
const K_CARTELA = { largo: 1, estreito: 0.9 } as const;

const CLASSE_CARTELA = 'alx-cartela';

/** A cartela gravada que embrulha o rótulo da ação. Sem fill: o papel
 *  passa por dentro, como na cartela do registro no cabeçalho.
 *
 *  EXPORTADA na Peça C: a aula precisa da MESMA cartela em volta de um
 *  `<button>` (registrar previsão, registrar resposta), e não de um
 *  segundo desenho de ação. Um objeto terminal só no produto inteiro. */
export function CartelaAcao({ children, movel }: { children: ReactNode; movel: boolean }) {
  const k = movel ? K_CARTELA.estreito : K_CARTELA.largo;
  const ref = useRef<HTMLSpanElement>(null);
  const [caixa, setCaixa] = useState({ w: 0, h: 32 * k });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      const r = el.getBoundingClientRect();
      setCaixa((a) => (Math.abs(a.w - r.width) < 0.5 && Math.abs(a.h - r.height) < 0.5 ? a : { w: r.width, h: r.height }));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const corpo = 1.6 * k;
  const dobra = 1.1 * k;
  const tempera = 0.6 * k;
  const entalhe = 6 * k;
  const recuo = 10 * k;
  const m = corpo / 2;
  const W = Math.max(caixa.w, (entalhe + recuo) * 2 + corpo);
  const H = caixa.h;
  const x0 = m;
  const x1 = W - m;
  const y0 = m;
  const y1 = H - m;
  const cy = H / 2;
  const dDobraE = recuo + m;
  const dDobraD = W - recuo - m;
  const tDentro = 3 * k;
  const tx0 = dDobraE + 4 * k;
  const tx1 = dDobraD - 4 * k;

  return (
    <span
      ref={ref}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        // recuo da dobra (10) + folga até o texto (15), nos dois lados
        padding: `${6 * k}px ${25 * k}px`,
        // a altura da receita; o rótulo, com entrelinha 1, nunca a estoura
        minHeight: `${32 * k}px`,
        boxSizing: 'border-box',
        minWidth: 0,
      }}
    >
      {caixa.w > 0 && (
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          aria-hidden="true"
          focusable="false"
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', overflow: 'visible' }}
        >
          {/* corpo: seis vértices — dois cantos de cima, o entalhe em V da
              ponta direita na meia-altura, dois cantos de baixo e o entalhe
              da ponta esquerda */}
          <path
            className={CLASSE_CARTELA}
            d={`M ${x0} ${y0} L ${x1} ${y0} L ${x1 - entalhe} ${cy} L ${x1} ${y1} L ${x0} ${y1} L ${x0 + entalhe} ${cy} Z`}
            fill="none"
            stroke={A.navy}
            strokeWidth={corpo}
            strokeLinejoin="miter"
            strokeLinecap="butt"
          />
          {/* fio duplo da dobra */}
          <path d={`M ${dDobraE} ${y0} L ${dDobraE} ${y1}`} stroke={A.navy} strokeWidth={dobra} fill="none" />
          <path d={`M ${dDobraD} ${y0} L ${dDobraD} ${y1}`} stroke={A.navy} strokeWidth={dobra} fill="none" />
          {/* têmpera interna — declarada como têmpera, não como borda de
              controle (mede 2,73:1, igual ao fio pálido da banderole) */}
          <path d={`M ${tx0} ${y0 + tDentro} L ${tx1} ${y0 + tDentro}`} stroke={A.navy} strokeWidth={tempera} opacity={0.55} fill="none" />
          <path d={`M ${tx0} ${y1 - tDentro} L ${tx1} ${y1 - tDentro}`} stroke={A.navy} strokeWidth={tempera} opacity={0.55} fill="none" />
        </svg>
      )}
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', minWidth: 0 }}>{children}</span>
    </span>
  );
}

// ── Datas ───────────────────────────────────────────────────────────────

const MES_CURTO = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];

function partesDaData(iso: string | null): { curta: string; longa: string } | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const fuso = 'America/Sao_Paulo';
  const dia = Number(d.toLocaleDateString('pt-BR', { day: 'numeric', timeZone: fuso }));
  const mes = Number(d.toLocaleDateString('pt-BR', { month: 'numeric', timeZone: fuso })) - 1;
  return {
    curta: `${dia} ${MES_CURTO[mes] ?? ''}`.trim(),
    longa: d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', timeZone: fuso }),
  };
}

// ── Medidas da peça ─────────────────────────────────────────────────────

/** Margem de nota: a coluna da vinheta, do código e da data. */
// Largura da margem de nota. A 390 ela é o mínimo que cabe o código em
// algarismo tabular sem sangrar para fora da calha (medido: 'M01·A08' em
// Lora 700 13,5px dá 64px, mais os 12px de respiro até o fio da coluna).
const MARGEM = { largo: 104, movel: 78 } as const;
const VINHETA_PX = { largo: 84, movel: 60 } as const;
/** Altura reservada do bloco inteiro, para o registro chegar sem mover nada
 *  (bar A5): o bloco de espera e o bloco final ocupam a mesma caixa.
 *  Medida no render com as fontes finais. */
export const RESERVA_RETOMADA = { movel: 226, medio: 218, largo: 238 } as const;

const CLASSE_ACAO = 'alx-retomada-acao';

/** Estilos de foco e hover da ação. Sem preenchimento em nenhum estado: o
 *  que muda é a mordida do buril no corpo da cartela. */
export const ESTILO_RETOMADA = `
.${CLASSE_ACAO}:hover .${CLASSE_CARTELA} { stroke-width: 2.6px; }
.${CLASSE_ACAO}:hover .alx-retomada-verbo { text-decoration: underline; text-underline-offset: 3px; }
.${CLASSE_ACAO}:focus-visible { outline: 2px solid ${A.navy}; outline-offset: 3px; }
`;

// ── A peça ──────────────────────────────────────────────────────────────

/** Cabeça corrida. Em coluna estreita o aparato desce para a própria linha
 *  inteira em vez de partir a frase no meio: `flex-wrap` com o rótulo em
 *  `white-space: nowrap` faz exatamente isso, medido nas três larguras.
 *
 *  O RÓTULO DE PROCEDÊNCIA SOBRE A GRAVURA (r09). Sobre papel limpo ele é
 *  metadado (#6B6255, 12px), que mede 4,97:1 sobre o pergaminho — e só
 *  sobre o pergaminho: para 4,5:1 essa tinta exige um fundo de luminância
 *  ≥ 0,74, e a nuvem mais clara da prancha já fica abaixo disso. Foi por
 *  isso que a r07 mediu 3,74:1 e a r08 respondeu cortando a folha em duas.
 *  Na entrada o mesmo string sobe para TINTA PLENA (#2A2620) e 12,5px: essa
 *  tinta precisa de fundo ≥ 0,26, e o trecho mais escuro da prancha sob a
 *  coluna fica em ≈ 0,52. A composição não muda; muda o peso do rótulo, que
 *  é o que o bar chama de "legibilidade por corpo". */
function CabecaCorrida({
  titulo,
  escopo,
  id,
  sobreGravura = false,
}: {
  titulo: string;
  escopo?: string;
  id?: string;
  sobreGravura?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        columnGap: '12px',
        rowGap: '1px',
        paddingBottom: '4px',
      }}
    >
      <h2
        id={id}
        style={{
          ...AT2.eyebrow,
          color: sobreGravura ? A.tintaSobreCreme : A.tintaSuave,
          margin: 0,
          lineHeight: 1.5,
          whiteSpace: 'nowrap',
        }}
      >
        {titulo}
      </h2>
      {escopo && (
        <span
          style={{
            fontFamily: AF.corpo,
            fontSize: sobreGravura ? '12.5px' : '12px',
            fontWeight: sobreGravura ? 500 : 400,
            lineHeight: 1.5,
            color: sobreGravura ? A.tintaSobreCreme : A2.tintaMetadado,
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'right',
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {escopo}
        </span>
      )}
    </div>
  );
}

/** A entrada: fio de abertura, margem de nota e o registro. */
function Entrada({ children, movel, fioDaColuna = true }: { children: ReactNode; movel: boolean; fioDaColuna?: boolean }) {
  const margem = movel ? MARGEM.movel : MARGEM.largo;
  const calha = movel ? 12 : 20;
  return (
    <div style={{ position: 'relative', borderTop: `1.4px solid ${A.tintaSobreCreme}`, paddingTop: movel ? '9px' : '11px' }}>
      {fioDaColuna && (
        <span
          aria-hidden="true"
          style={{ position: 'absolute', top: 0, bottom: 0, left: `${margem}px`, width: '1px', background: A.fioSobreCreme }}
        />
      )}
      <div style={{ display: 'grid', gridTemplateColumns: `${margem}px minmax(0, 1fr)`, columnGap: `${calha}px` }}>
        {children}
      </div>
    </div>
  );
}

/** `estreita` = a coluna tem menos de ~400px de medida. Vale a 390 e vale
 *  também nas colunas de papel do hub (340px) e da carta (380px) a 1440: o
 *  que governa a margem de nota é a MEDIDA da coluna, não o viewport. */
export function Retomada({
  dados,
  movel,
  larguraReserva,
}: {
  dados: DadosRetomada;
  /** medida estreita */
  movel: boolean;
  larguraReserva?: keyof typeof RESERVA_RETOMADA;
}) {
  const { titulo, escopo, codigo, estado, cabeca, meta, motivo, vinheta, acao, id, sobreGravura = false } = dados;
  // Sobre a prancha, as vozes de aparato sobem um degrau de tinta: tinta
  // suave (#5C5346) só alcança 4,5:1 em fundo ≥ 0,58, e a nuvem mais escura
  // sob a coluna mede ≈ 0,52 (r09). É o mesmo movimento do rótulo de
  // procedência, e não muda hierarquia nenhuma: a manchete continua em
  // tinta plena e corpo 23, o aparato continua em 13,5.
  const aparato = sobreGravura ? A.tintaSobreCreme : A.tintaSuave;
  const data = partesDaData(dados.data);
  const ladoVinheta = movel ? VINHETA_PX.movel : VINHETA_PX.largo;
  const v = vinheta ? vinhetaDoTerritorio(vinheta) : null;

  return (
    <section
      aria-labelledby={id}
      data-retomada
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: larguraReserva ? `${RESERVA_RETOMADA[larguraReserva]}px` : undefined,
        boxSizing: 'border-box',
      }}
    >
      <CabecaCorrida titulo={titulo} escopo={escopo} id={id} sobreGravura={sobreGravura} />
      <Entrada movel={movel}>
        {/* margem de nota — a vinheta gravada, o código e a data */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px',
            paddingRight: movel ? '12px' : '20px',
            textAlign: 'right',
          }}
        >
          {v && vinheta && (
            <img
              src={v.src}
              srcSet={v.srcSet}
              sizes={`${Math.round((ladoVinheta * v.w) / v.h)}px`}
              width={Math.round((ladoVinheta * v.w) / v.h)}
              height={ladoVinheta}
              alt={ALT_VINHETA[vinheta]}
              data-media-class="atmosfera"
              decoding="async"
              style={{ width: Math.round((ladoVinheta * v.w) / v.h), height: ladoVinheta, display: 'block', marginBottom: '4px' }}
            />
          )}
          <span
            style={{
              fontFamily: AF.corpo,
              fontWeight: 700,
              fontSize: movel ? '13.5px' : '16px',
              letterSpacing: '0.05em',
              lineHeight: 1.2,
              color: A.navy,
              fontVariantNumeric: 'tabular-nums lining-nums',
            }}
          >
            {codigo}
          </span>
          {data && (
            <span
              style={{
                fontFamily: AF.corpo,
                fontSize: '12.5px',
                lineHeight: 1.4,
                color: aparato,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {data.curta}
            </span>
          )}
        </div>

        {/* o registro */}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* A MANCHETE é a tese da aula (r07): é ela que diz por que esta,
              e não outra. O nome de catálogo do módulo desceu para a linha
              de aparato logo abaixo. */}
          <p
            style={{
              ...AT2.tituloObjeto,
              fontSize: movel ? '18.5px' : '23px',
              color: A.tintaSobreCreme,
              margin: '0 0 4px',
            }}
          >
            {cabeca}
          </p>
          <p style={{ ...AT2.metadado, fontSize: movel ? '13px' : '13.5px', lineHeight: 1.45, color: aparato, margin: 0 }}>{meta}</p>
          {/* Estado em linha própria: o julgamento reprovou o estado
              dissolvido em prosa corrida — aqui ele é varrido de relance. */}
          <p
            style={{
              ...AT2.metadado,
              fontSize: '14px',
              color: A.tintaSobreCreme,
              margin: '5px 0 0',
              display: 'flex',
              gap: '8px',
              alignItems: 'baseline',
            }}
          >
            <GlifoEstado estado={estado} />
            <span>
              <strong style={{ fontWeight: 600 }}>{estado}</strong>
              {data ? ` desde ${data.longa}` : ''}
            </span>
          </p>
          <p style={{ ...AT2.metadado, fontSize: movel ? '13px' : '13.5px', lineHeight: 1.45, fontStyle: 'italic', color: aparato, margin: '2px 0 0' }}>
            {motivo}
          </p>
          {acao && <AcaoGravada acao={acao} movel={movel} curto={acao.motivo === cabeca} />}
        </div>
      </Entrada>
      <style>{ESTILO_RETOMADA}</style>
    </section>
  );
}

/** A ação única: a CARTELA GRAVADA com o rótulo por dentro. Nunca barra
 *  cheia, nunca caixa com fio de controle — a cartela é objeto do atlas
 *  (a mesma do selo de registro), com entalhe, fio duplo e têmpera.
 *
 *  O alvo é o bloco inteiro da linha (largura da coluna de texto × ≥ 48px),
 *  o que a 390 dá folga sobre os 44px exigidos.
 *
 *  HIERARQUIA (r07). Quando a TESE já é a manchete do bloco — que é o caso
 *  sempre que `acao.motivo` é o título que está impresso logo acima —, o
 *  rótulo visível fica CURTO: verbo e objeto, numa linha só que não quebra.
 *  O nome acessível continua nomeando objeto E motivo (S1). A r06 fazia o
 *  contrário: o nome de catálogo mandava e a tese chegava como cauda de um
 *  parágrafo dentro da barra — a regressão que os três juízes apontaram. */
export function AcaoGravada({
  acao,
  movel,
  marginTop,
  curto = false,
  captura = 'cta-primario',
}: {
  acao: AcaoRetomada;
  movel: boolean;
  marginTop?: number;
  /** O motivo já está impresso, em destaque, dentro do mesmo bloco. */
  curto?: boolean;
  /** Nome do alvo no plano de captura. A aula usa `proximo-passo` (T11). */
  captura?: string;
}) {
  const recuo = marginTop ?? (movel ? 10 : 14);
  const rotulo = `${acao.verbo} · ${acao.codigo} — ${acao.motivo}`;
  // Nenhuma borda no alvo: a afordância É a cartela. O fio-flecha da r07
  // saiu com a manícula — ele terminava no ar depois da ponta direita e
  // era o segundo fio horizontal de uma coluna que já tem três.
  const linha: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: movel ? '10px' : '12px',
    rowGap: '2px',
    // o alvo (e o anel de foco) tem a medida do OBJETO, não da coluna: um
    // retângulo de 376px aparecendo no foco seria a caixa que a peça não tem
    alignSelf: 'flex-start',
    maxWidth: '100%',
    minHeight: '48px',
    boxSizing: 'border-box',
    position: 'relative',
    padding: 0,
    marginTop: `${recuo}px`,
    textDecoration: 'none',
    borderRadius: AR.none,
    color: A.navy,
  };
  return (
    <a href={acao.destino} data-capture={captura} aria-label={rotulo} onClick={acao.aoIr} className={CLASSE_ACAO} style={linha}>
      <CartelaAcao movel={movel}>
        <span
          className="alx-retomada-verbo"
          style={{
            ...AT2.navV2,
            // altura de maiúscula 10px na receita: Cinzel 600 a 14px
            fontSize: movel ? '12.6px' : '14px',
            letterSpacing: '0.185em',
            lineHeight: 1,
            color: A.navy,
            whiteSpace: 'nowrap',
          }}
        >
          {acao.verbo} ·{' '}
          <b style={{ fontWeight: 700, letterSpacing: '0.12em' }}>{acao.codigo}</b>
        </span>
      </CartelaAcao>
      {/* o motivo só volta ao rótulo onde ele NÃO é a manchete do bloco —
          e fica FORA da cartela, que é curta por receita */}
      {!curto && (
        <span style={{ fontFamily: AF.corpo, fontSize: movel ? '14px' : '14.5px', fontWeight: 500, lineHeight: 1.45, color: A.tintaSobreCreme, minWidth: 0 }}>
          {acao.motivo}
        </span>
      )}
    </a>
  );
}

/** O mesmo bloco enquanto o registro de estudo não respondeu: mesma
 *  estrutura, mesma altura, nada pessoal. */
export function RetomadaCarregando({
  movel,
  larguraReserva,
  titulo = 'Seu ponto de estudo',
  id,
  sobreGravura = false,
}: {
  movel: boolean;
  larguraReserva?: keyof typeof RESERVA_RETOMADA;
  titulo?: string;
  id?: string;
  /** O bloco de espera assenta sobre a prancha (entrada a 1100+). */
  sobreGravura?: boolean;
}) {
  return (
    <section
      aria-busy="true"
      aria-labelledby={id}
      data-retomada
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: larguraReserva ? `${RESERVA_RETOMADA[larguraReserva]}px` : undefined,
        boxSizing: 'border-box',
      }}
    >
      <CabecaCorrida titulo={titulo} escopo="registro de estudo" id={id} sobreGravura={sobreGravura} />
      <Entrada movel={movel} fioDaColuna={false}>
        <span aria-hidden="true" />
        <p style={{ ...AT2.metadado, color: sobreGravura ? A.tintaSobreCreme : A.tintaSuave, margin: 0 }}>
          Lendo seu registro de estudo…
        </p>
      </Entrada>
    </section>
  );
}
