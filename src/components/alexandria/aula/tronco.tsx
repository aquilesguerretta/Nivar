// tronco.tsx — o TRONCO COMUM das 141 aulas (SISTEMA.md §2).
//
// A variedade da aula mora no corpo; a moldura não varia. Esta folha é a
// moldura: abertura (T2), ato registrado (T3), fonte (T4), voz da camada
// (T5), leitura (T8), recuperação (T9), registro (T10), próximo passo (T11),
// ausência honesta (T12) e as medidas de acessibilidade (T13). O shell
// (`AlexandriaShell`) já entrega o T1 — cabeçalho, localizador, rodapé e
// barra móvel —, e por isso nada aqui redesenha chrome.
//
// PORTE, NÃO REINVENÇÃO. A especificação visual são os protótipos estáticos
// de `docs/alexandria-v2/estudos/aulas/prototipos/` (tronco.css + um .html
// por arquétipo), já passados pelo critic e corrigidos em CORRECOES.md. O
// que mudou no porte foi só o que a VARREDURA ANTI-IA
// (`docs/alexandria-v2/briefs/varredura-anti-ia.md`) reprova como tique de
// produto genérico, e mudou por SISTEMA, não por superfície:
//
//   (a) NENHUMA CAIXA DEFAULT. O protótipo desenhava o ato, a prancha, o
//       quadro previsto × calculado, a ficha de fonte e o véu como
//       retângulos com fio (alguns com faixa de acento navy de 3px no topo
//       — T2/T11 literal). Aqui a hierarquia vem de FIO e de TROCA DE
//       SUPERFÍCIE, que é a materialidade que o resto da casa já usa: fio
//       de abertura de 1,4px, margem de nota com fio de coluna, papel
//       `cremeSuperficie` sob a prancha. Zero border-radius, zero sombra,
//       zero preenchimento decorativo.
//   (b) NENHUM CÍRCULO DE FORMULÁRIO. O protótipo marcava opção com o
//       `::before` redondo do radio button (T18 literal). Aqui a escolha usa
//       a MESMA geometria de levantamento do chrome (`Marcas.tsx`
//       §9 `tracosDeEstacao`): losango cheio = marcada, cruz de referência =
//       não marcada. Um vocabulário de silhueta só no produto inteiro, e
//       ele sobrevive à captura em cinza (S2/S3).
//   (c) O CAMPO É O FIO (T8). Nenhuma entrada tem caixa: rótulo em
//       versalete, valor em Lora tabular assentado sobre fio de tinta, e a
//       unidade como sufixo em aparato. O exemplo do que digitar vive no
//       rótulo, não num placeholder.
//   (d) A AÇÃO É A CARTELA GRAVADA (`Retomada.tsx::CartelaAcao`), a mesma
//       peça que fecha a coluna da Home e abre o cabeçalho — nunca a barra
//       navy de largura total com seta (T9/T17).
//   (e) O DESLIZADOR VIROU RÉGUA GRADUADA. `input[type=range]` é controle de
//       navegador: track, thumb e `accent-color`. A régua é desenhada, tem
//       limbo com marcas nomeadas, o valor corrente marcado com a flâmula do
//       levantamento, e é operável por teclado (role="slider").
//
// ESTADO. Uma máquina de estados só, para os dez arquétipos (T3): cada ato
// vai de `vazio` → `registrado`, o véu cai quando o ato que ele protege é
// registrado, e o registro do fim conta "k de N atos". Nada de "Revelar
// gabarito", nada de cor para certo/errado.

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { A, A2, AF, AR, AT2 } from '@/design/alexandria-tokens';
import { MarcaEstacao, fioDaEscala, tracosDeEstacao } from '../comum/Marcas';
import { CartelaAcao } from '../comum/Retomada';
import type { LoopDaAulaMecanico } from '@/lib/alexandria/useLoopDaAula';
import { idDoAto, type GeneroDoAto } from '@/lib/alexandria/progresso/regras';

// ── Vozes ────────────────────────────────────────────────────

export const aparato = { ...AT2.eyebrow, color: A2.tintaMetadado } as const;
export const aparatoForte = { ...AT2.eyebrow, color: A.tintaSobreCreme } as const;

export const corpoDeLeitura: CSSProperties = {
  fontFamily: AF.corpo,
  fontSize: '17px',
  lineHeight: 1.65,
  color: A.tintaSobreCreme,
  margin: '0 0 18px',
};

export const MEDIDA_LEITURA = 680;
export const MEDIDA_PALCO = 1000;

/** Autoria da peça (T5). A distinção entre o que a Alexandria criou e o que
 *  é texto do curso é dita em PALAVRA — nenhuma cor, nenhum glifo novo.
 *  Uma voz só nos dez arquétipos. */
export function Voz({
  rotulo,
  fonte,
  forte = true,
}: {
  rotulo: string;
  /** "Alexandria", "texto do curso", "Alexandria, sobre o quadro do curso"… */
  fonte: string;
  forte?: boolean;
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '7px', flexWrap: 'wrap', rowGap: '2px' }}>
      <span style={{ ...(forte ? aparatoForte : aparato), fontSize: '11px', lineHeight: 1.4 }}>{rotulo}</span>
      <span
        style={{
          fontFamily: AF.corpo,
          fontStyle: 'italic',
          fontSize: '12.5px',
          lineHeight: 1.4,
          color: A2.tintaMetadado,
        }}
      >
        · {fonte}
      </span>
    </span>
  );
}

// ── Fio ──────────────────────────────────────────────────────

export function Fio({
  peso = 1,
  cor = A.fioSobreCreme,
  margem,
}: {
  peso?: number;
  cor?: string;
  margem?: string;
}) {
  return <span aria-hidden="true" style={{ display: 'block', height: `${peso}px`, background: cor, margin: margem }} />;
}

// ── T12 · ausência honesta e véu (C7) ────────────────────────

/** Hachura de buril sobre o lugar do valor. Sem moldura: o véu é textura,
 *  não caixa tracejada (T22). O texto DIZ o que falta acontecer. */
export function Velado({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px 8px 2px',
        fontFamily: AF.corpo,
        fontSize: '14px',
        fontStyle: 'italic',
        lineHeight: 1.5,
        color: A.tintaSuave,
        backgroundImage: `repeating-linear-gradient(45deg, ${A2.fioClaroSobreCreme} 0 1px, transparent 1px 6px)`,
      }}
    >
      {children}
    </span>
  );
}

/** MEDIDA — o número vivo do instrumento, que só existe depois do ato que o
 *  vela (T3, L2).
 *
 *  Um instrumento com previsão calcula o resultado a todo instante: ele é a
 *  resposta do primeiro ato. A saída principal sempre soube disso e vela.
 *  O que o verificador do véu achou na r12, na M01·A08 **e** na M02·A04, foi
 *  a MESMA leitura escapando pela porta de trás: a linha de estado do ato
 *  seguinte ("ainda abaixo da faixa · FCap 25,1%", "a rampa já passou do
 *  limiar (+11,4 GW/h)") imprimia o número cru antes do registro da
 *  previsão. Dois arquétipos, um defeito — então a correção é uma peça, não
 *  dois remendos.
 *
 *  A linha de estado continua dizendo ONDE o learner está (acima, abaixo,
 *  dentro): isso orienta o ato de meta sem entregar o ato de previsão. O que
 *  some é só a grandeza. */
export function Medida({ ato, valor, sem }: { ato: string; valor: ReactNode; sem?: ReactNode }) {
  const loop = useLoop();
  if (loop.temRegistro(ato)) return <>{valor}</>;
  return <>{sem ?? null}</>;
}

/** VELATURA — o véu de uma REGIÃO inteira, não de um valor solto (T3, L2).
 *
 *  A r12 reprovou a M01·A08 porque o Ato 2 tinha a resposta em três lugares
 *  fora do próprio ato: no enunciado, na régua da figura 8.3 e na nota que
 *  nomeia a hidro junto do número. Velar só o campo de saída não resolve —
 *  a L2 diz que fica velado TUDO que permite ler **ou calcular** a
 *  referência. Quando a referência é uma figura, uma tabela ou um parágrafo,
 *  o que se vela é a região, e ela abre no registro do ato que ela responde
 *  (é o mesmo movimento da L3, em que a matriz da MESA abre no registro).
 *
 *  Forma: hachura de buril sobre o papel, fio de abertura em cima, rótulo em
 *  versalete e uma linha que DIZ o que abre e o que falta acontecer. Sem
 *  moldura, sem fundo chapado, sem cadeado — o véu é textura, não caixa
 *  (varredura anti-IA (a)). `reserva` segura a altura para que a queda do
 *  véu não salte a página. */
export function Velatura({
  ato,
  oQue,
  reserva = 180,
  largura,
  children,
}: {
  /** O `id` do ato que este véu protege. */
  ato: string;
  /** O que está velado, em uma linha, na voz do learner. */
  oQue: ReactNode;
  reserva?: number;
  /** A medida do que vai abrir. O véu tem a largura da coisa velada — um
   *  campo de têmpera mais largo que a figura denuncia que é remendo. */
  largura?: number;
  children: ReactNode;
}) {
  const loop = useLoop();
  if (loop.temRegistro(ato)) return <>{children}</>;
  return (
    <div
      data-veu="velatura"
      data-veu-ato={ato}
      style={{
        minHeight: `${reserva}px`,
        maxWidth: largura ? `${largura}px` : undefined,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '8px',
        padding: '18px 16px 20px',
        borderTop: `1.4px solid ${A.tintaSobreCreme}`,
        backgroundImage: `repeating-linear-gradient(45deg, ${A2.fioClaroSobreCreme} 0 1px, transparent 1px 7px)`,
      }}
    >
      <p style={{ display: 'flex', alignItems: 'center', gap: '9px', margin: 0 }}>
        <MarcaEstacao estado="por-percorrer" tamanho={13} />
        <span style={{ ...aparatoForte, fontSize: '11px' }}>Velado até o ato</span>
      </p>
      <p style={{ fontFamily: AF.corpo, fontSize: '15px', fontStyle: 'italic', lineHeight: 1.55, color: A.tintaSuave, margin: 0, maxWidth: '58ch' }}>
        {oQue}
      </p>
    </div>
  );
}

/** Linha de metadado para o que a fonte não declara (T12/S4). Nunca no topo
 *  da aula, nunca como zero, nunca com aparência de controle. */
export function Ausencia({ children }: { children: ReactNode }) {
  return (
    <p style={{ ...AT2.metadado, fontStyle: 'italic', color: A2.tintaMetadado, margin: '8px 0 0' }}>{children}</p>
  );
}

// ── Seções e leitura (T8) ────────────────────────────────────

export function Secao({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', margin: '38px 0 14px' }}>
      <span
        style={{
          ...aparato,
          fontSize: '12px',
          minWidth: '32px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {n}
      </span>
      <h2 style={{ fontFamily: AF.corpo, fontWeight: 600, fontSize: '25px', lineHeight: 1.25, margin: 0 }}>
        {children}
      </h2>
    </div>
  );
}

export function P({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <p style={{ ...corpoDeLeitura, ...style }}>{children}</p>;
}

/** Termo do léxico ligado à definição sem sair da aula (T6, C4). A prévia
 *  abre em uma ação, no lugar, sob o parágrafo. Sem hover: a 390 nada
 *  depende dele. */
export function Termo({ termo, previa, verbete }: { termo: string; previa: string; verbete?: string }) {
  const [aberto, setAberto] = useState(false);
  const id = useId();
  return (
    <>
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={id}
        onClick={() => setAberto((v) => !v)}
        style={{
          font: 'inherit',
          color: 'inherit',
          background: 'none',
          border: 'none',
          borderRadius: AR.none,
          padding: 0,
          cursor: 'pointer',
          fontWeight: 600,
        }}
        className="alx-travessia alx-travessia-latente"
      >
        {termo}
      </button>
      {aberto && (
        <span
          id={id}
          style={{
            display: 'block',
            margin: '10px 0 12px',
            paddingLeft: '14px',
            borderLeft: `1px solid ${A.fioSobreCreme}`,
            fontFamily: AF.corpo,
            fontSize: '15px',
            lineHeight: 1.55,
            color: A.tintaSobreCreme,
          }}
        >
          <span style={{ ...aparato, display: 'block', marginBottom: '3px' }}>Léxico · no fluxo da aula</span>
          {previa}
          {verbete && (
            <span style={{ display: 'block', ...AT2.metadado, color: A2.tintaMetadado, marginTop: '4px' }}>
              {verbete}
            </span>
          )}
        </span>
      )}
    </>
  );
}

/** Nota editorial do curso ou da Alexandria. Margem de nota com fio, nunca
 *  cartão com fundo (T2). */
export function Nota({ titulo, children, tom = 'tinta' }: { titulo: string; children: ReactNode; tom?: 'tinta' | 'ouro' }) {
  return (
    <div
      style={{
        borderLeft: `3px solid ${tom === 'ouro' ? A2.ouroSobreNavy : A.tintaSobreCreme}`,
        paddingLeft: '18px',
        margin: '10px 0 26px',
      }}
    >
      <div style={{ ...aparatoForte, marginBottom: '6px' }}>{titulo}</div>
      {children}
    </div>
  );
}

export function Formula({ eq, detalhe }: { eq: ReactNode; detalhe?: string }) {
  return (
    <div style={{ borderTop: `1px solid ${A.fioSobreCreme}`, borderBottom: `1px solid ${A.fioSobreCreme}`, padding: '14px 0 16px', margin: '6px 0 22px' }}>
      <div style={{ ...aparato, marginBottom: '5px' }}>Fórmula</div>
      <div style={{ fontFamily: AF.corpo, fontWeight: 500, fontSize: '19px', lineHeight: 1.45, fontVariantNumeric: 'tabular-nums' }}>
        {eq}
      </div>
      {detalhe && <div style={{ ...AT2.metadado, color: A.tintaSuave, marginTop: '5px' }}>{detalhe}</div>}
    </div>
  );
}

/** Coluna de leitura + pilha lateral de figuras. A prosa da seção corre
 *  INTEIRA na coluna; as figuras empilham ao lado (§2.6 L7). */
export function Fila({ children, lado, movel }: { children: ReactNode; lado?: ReactNode; movel: boolean }) {
  if (movel || !lado) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ maxWidth: `${MEDIDA_LEITURA}px` }}>{children}</div>
        {lado}
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `${MEDIDA_LEITURA}px minmax(0, 1fr)`, gap: '56px', alignItems: 'start' }}>
      <div style={{ maxWidth: `${MEDIDA_LEITURA}px` }}>{children}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingTop: '6px' }}>{lado}</div>
    </div>
  );
}

// ── T4 · fonte à vista ───────────────────────────────────────

/** Selo de estado datado (`C-SELO`). Fio e palavra, sem pílula. */
export function Selo({ children, pendente = false }: { children: ReactNode; pendente?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: AF.corpo,
        fontSize: '12.5px',
        lineHeight: 1.4,
        color: A.tintaSobreCreme,
        borderBottom: `${pendente ? '1px dashed' : '1.4px solid'} ${A.tintaSuave}`,
        paddingBottom: '1px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/** O bloco de fonte, a ≈24px de toda figura, tabela ou instrumento com
 *  número factual, ANTES da prosa que o interpreta (S4). A ficha abre em
 *  uma ação e some a ficha em duas. */
export function Fonte({ resumo, ficha }: { resumo: ReactNode; ficha?: ReactNode }) {
  return (
    <details style={{ borderTop: `1px solid ${A.fioSobreCreme}`, marginTop: '24px', paddingTop: '10px' }}>
      <summary
        style={{
          listStyle: 'none',
          cursor: 'pointer',
          display: 'block',
          // alvo ≥ 24×24 (S7): o gatilho da ficha é uma linha de 13px, e sem
          // o respiro ele media 21px de altura (medido no render da r02).
          minHeight: '26px',
          padding: '2px 0 3px',
          fontFamily: AF.corpo,
          fontSize: '13px',
          lineHeight: 1.5,
          color: A.tintaSuave,
        }}
      >
        <span style={{ ...aparatoForte, fontSize: '11px', marginRight: '8px' }}>Fonte</span>
        {resumo}
        {ficha && (
          <span className="alx-travessia alx-travessia-latente" style={{ marginLeft: '8px', whiteSpace: 'nowrap', color: A.tintaSobreCreme }}>
            Ficha
          </span>
        )}
      </summary>
      {ficha && (
        <div
          style={{
            marginTop: '10px',
            paddingLeft: '14px',
            borderLeft: `1px solid ${A.fioSobreCreme}`,
            fontFamily: AF.corpo,
            fontSize: '13px',
            lineHeight: 1.55,
            color: A.tintaSuave,
          }}
        >
          {ficha}
        </div>
      )}
    </details>
  );
}

/** Ficha em pares rótulo/valor, sem célula e sem fundo. */
export function ParesDaFicha({ pares }: { pares: [string, ReactNode][] }) {
  return (
    <dl style={{ display: 'grid', gridTemplateColumns: 'minmax(96px, 150px) minmax(0, 1fr)', gap: '4px 14px', margin: 0 }}>
      {pares.map(([k, v]) => (
        <div key={k} style={{ display: 'contents' }}>
          <dt style={{ ...aparato, fontSize: '11px', paddingTop: '2px' }}>{k}</dt>
          <dd style={{ margin: 0 }}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// ── T14 · figura e mídia ─────────────────────────────────────

export type ClasseDeMidia = 'documental' | 'explicacao' | 'atmosfera';

const ROTULO_CLASSE: Record<ClasseDeMidia, string> = {
  documental: 'Documental',
  explicacao: 'Explicação · ilustração gerada',
  atmosfera: 'Atmosfera',
};

/** Figura programática: título-afirmação → subtítulo com unidade → figura →
 *  fonte → classe (C6). */
export function Figura({
  titulo,
  subtitulo,
  children,
  fonte,
  esquematico,
  style,
}: {
  titulo: string;
  subtitulo?: ReactNode;
  children: ReactNode;
  fonte?: ReactNode;
  esquematico?: string;
  style?: CSSProperties;
}) {
  return (
    <figure style={{ margin: 0, ...style }}>
      <p style={{ fontFamily: AF.corpo, fontWeight: 600, fontSize: '17px', lineHeight: 1.35, margin: 0 }}>{titulo}</p>
      {subtitulo && <p style={{ ...AT2.metadado, color: A.tintaSuave, margin: '3px 0 10px' }}>{subtitulo}</p>}
      {children}
      {esquematico && (
        <p style={{ ...AT2.metadado, fontSize: '12.5px', color: A.tintaSuave, margin: '8px 0 0', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'baseline' }}>
          <Selo>esquemático</Selo>
          {esquematico}
        </p>
      )}
      {fonte}
    </figure>
  );
}

export interface AssetDaAula {
  /** Base publicada em `public/alexandria/v2/aulas/`, sem largura nem extensão. */
  base: string;
  slots: [number, number];
  largura: number;
  altura: number;
  classe: ClasseDeMidia;
  alt: string;
  legenda: ReactNode;
  credito: string;
}

const RAIZ_AULAS = '/alexandria/v2/aulas';

/** Imagem curada da aula. Entra JUNTO do parágrafo que ela explica, nunca no
 *  topo (T14). Declara a classe no DOM, para o harness medir. */
export function ImagemDaAula({ asset, sizes }: { asset: AssetDaAula; sizes: string }) {
  const src = `${RAIZ_AULAS}/${asset.base}-${asset.slots[1]}.webp`;
  const srcSet = asset.slots
    .flatMap((s) => [`${RAIZ_AULAS}/${asset.base}-${s}.webp ${s}w`, `${RAIZ_AULAS}/${asset.base}-${s}@2x.webp ${s * 2}w`])
    .join(', ');
  return (
    <figure data-media-class={asset.classe} style={{ margin: 0 }}>
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={asset.alt}
        width={asset.largura}
        height={asset.altura}
        style={{ display: 'block', width: '100%', height: 'auto', border: `1px solid ${A.fioSobreCreme}` }}
      />
      <figcaption style={{ fontFamily: AF.corpo, fontSize: '13.5px', lineHeight: 1.5, color: A.tintaSuave, marginTop: '8px' }}>
        <span style={{ ...aparato, fontSize: '11px', marginRight: '7px' }}>{ROTULO_CLASSE[asset.classe]}</span>
        {asset.legenda}
        <span style={{ display: 'block', ...AT2.metadado, fontSize: '12px', color: A2.tintaMetadado, marginTop: '4px' }}>
          {asset.credito}
        </span>
      </figcaption>
    </figure>
  );
}

// ── T3 · a máquina de estados dos atos ───────────────────────

export interface RegistroDeAto {
  /** O que o learner registrou, em uma linha, para a comparação e o registro. */
  resumo: string;
  /** `null` = sem veredito (previsão livre). */
  atende?: 'atende' | 'atende em parte' | 'não atende' | null;
}

interface LoopDaAula {
  total: number;
  registrados: Record<string, RegistroDeAto>;
  praticados: number;
  aRevisar: number;
  registrar: (id: string, r: RegistroDeAto) => void;
  autoavaliar: (id: string, v: RegistroDeAto['atende']) => void;
  temRegistro: (id: string) => boolean;
  registroDe: (id: string) => RegistroDeAto | null;
  leituraSemPratica: boolean;
  registrarLeitura: () => void;
  /** Sem sessão: o ato funciona, e a aula diz que registrar exige conta (C9). */
  visitante: boolean;
  /** O registro REAL da aula (`useLoopDaAula`), quando a aula o liga. Sem
   *  ele o loop é só desta leitura, como era até a v3. */
  mecanica: LoopDaAulaMecanico | null;
}

const CtxLoop = createContext<LoopDaAula | null>(null);

export function useLoop(): LoopDaAula {
  const ctx = useContext(CtxLoop);
  if (!ctx) throw new Error('useLoop fora de <LoopDaAulaProvider>');
  return ctx;
}

/**
 * O loop de atos da aula. Desde a v3 (eventos), quando a aula passa
 * `mecanica` (de `useLoopDaAula`) e o gênero de cada ato em `tiposDosAtos`,
 * o PRIMEIRO registro de cada ato sai como `exercicio_respondido`, com
 * `aulaId`, entidade `idDoAto(aulaId, atoId)` e `antesDaReferencia: true`
 * — o véu do tronco garante que a referência só aparece depois dele. Ato
 * sem gênero declarado não é enviado: o gênero é contrato, não palpite.
 */
export function LoopDaAulaProvider({
  total,
  visitante,
  mecanica = null,
  tiposDosAtos,
  children,
}: {
  total: number;
  visitante: boolean;
  mecanica?: LoopDaAulaMecanico | null;
  tiposDosAtos?: Record<string, GeneroDoAto>;
  children: ReactNode;
}) {
  const [registrados, setRegistrados] = useState<Record<string, RegistroDeAto>>({});
  const [leituraSemPratica, setLeitura] = useState(false);

  // Espelho síncrono: "este ato é novo?" precisa de resposta no clique,
  // e efeito colateral (o envio) não pode morar dentro do updater do
  // setState — o StrictMode o chamaria duas vezes.
  const registradosRef = useRef<Record<string, RegistroDeAto>>({});
  const envio = useRef({ mecanica, tiposDosAtos });
  envio.current = { mecanica, tiposDosAtos };

  const registrar = useCallback((id: string, r: RegistroDeAto) => {
    if (registradosRef.current[id]) return;
    registradosRef.current = { ...registradosRef.current, [id]: r };
    setRegistrados(registradosRef.current);
    const { mecanica: m, tiposDosAtos: tipos } = envio.current;
    const ato = tipos?.[id];
    if (m && ato) {
      void m.emitirExercicio({
        entidadeId: idDoAto(m.aulaId, id),
        ato,
        resposta: r.resumo,
        antesDaReferencia: true,
      });
    }
  }, []);
  const autoavaliar = useCallback((id: string, v: RegistroDeAto['atende']) => {
    const atual = registradosRef.current[id];
    if (!atual) return;
    registradosRef.current = { ...registradosRef.current, [id]: { ...atual, atende: v } };
    setRegistrados(registradosRef.current);
  }, []);

  const valor = useMemo<LoopDaAula>(() => {
    const vals = Object.values(registrados);
    return {
      total,
      registrados,
      praticados: vals.length,
      aRevisar: vals.filter((r) => r.atende === 'não atende' || r.atende === 'atende em parte').length,
      registrar,
      autoavaliar,
      temRegistro: (id: string) => Boolean(registrados[id]),
      registroDe: (id: string) => registrados[id] ?? null,
      leituraSemPratica,
      registrarLeitura: () => setLeitura(true),
      visitante,
      mecanica,
    };
  }, [registrados, total, registrar, autoavaliar, leituraSemPratica, visitante, mecanica]);

  return <CtxLoop.Provider value={valor}>{children}</CtxLoop.Provider>;
}

/** Estado do ato em silhueta + palavra (S2/S3): nunca por cor. */
export function EstadoDoAto({ registrado, palavra }: { registrado: boolean; palavra?: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: AF.corpo,
        fontSize: '12.5px',
        color: A.tintaSuave,
        whiteSpace: 'nowrap',
      }}
    >
      <MarcaEstacao estado={registrado ? 'percorrido' : 'por-percorrer'} tamanho={12} cor={A.tintaSuave} />
      {palavra ?? (registrado ? 'registrado' : 'vazio')}
    </span>
  );
}

// ── Cabeça corrida e margem de nota ──────────────────────────
// A MESMA anatomia da retomada (`Retomada.tsx`): versalete à esquerda,
// aparato à direita, fio de abertura de 1,4px e margem de nota com fio de
// coluna. Zero caixa — é essa a gramática de bloco da casa.

export function CabecaCorrida({ esquerda, direita, id }: { esquerda: ReactNode; direita?: ReactNode; id?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        columnGap: '12px',
        rowGap: '2px',
        paddingBottom: '5px',
      }}
      id={id}
    >
      {esquerda}
      {direita}
    </div>
  );
}

export function Entrada({
  margem,
  children,
  movel,
  peso = 1.4,
}: {
  margem: ReactNode;
  children: ReactNode;
  movel: boolean;
  peso?: number;
}) {
  const larguraMargem = movel ? 58 : 76;
  return (
    <div style={{ position: 'relative', borderTop: `${peso}px solid ${A.tintaSobreCreme}`, paddingTop: movel ? '9px' : '11px' }}>
      <span
        aria-hidden="true"
        style={{ position: 'absolute', top: 0, bottom: 0, left: `${larguraMargem}px`, width: '1px', background: A.fioSobreCreme }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: `${larguraMargem}px minmax(0, 1fr)`, columnGap: movel ? '12px' : '18px' }}>
        <div style={{ paddingRight: '10px' }}>{margem}</div>
        <div style={{ minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
}

// ── T3 · o ato ───────────────────────────────────────────────

export interface CenarioItem {
  rotulo: string;
  valor: string;
  unidade?: string;
  sub?: string;
}

/** Os valores do cenário na própria pergunta (C3). Colunas separadas por fio
 *  de coluna — nenhuma célula, nenhuma moldura. O que o 1º ato pergunta fica
 *  visível também a 390 (T13). */
export function Cenario({ itens, movel }: { itens: CenarioItem[]; movel: boolean }) {
  return (
    <dl
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${movel ? Math.min(itens.length, 2) : itens.length}, minmax(0, 1fr))`,
        borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
        borderBottom: `1px solid ${A2.fioClaroSobreCreme}`,
        margin: '0 0 8px',
      }}
    >
      {itens.map((it, i) => (
        <div
          key={it.rotulo}
          style={{
            padding: '8px 12px 8px 0',
            ...(i > 0 ? { paddingLeft: '12px', borderLeft: `1px solid ${A2.fioClaroSobreCreme}` } : null),
          }}
        >
          <dt style={{ ...aparato, fontSize: '11px' }}>{it.rotulo}</dt>
          <dd style={{ margin: '3px 0 0', fontFamily: AF.corpo, fontWeight: 500, fontSize: movel ? '16px' : '18px', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
            {it.valor}
            {it.unidade && <span style={{ fontSize: '13px', color: A.tintaSuave, fontWeight: 400 }}> {it.unidade}</span>}
            {it.sub && (
              <span style={{ display: 'block', ...AT2.metadado, fontSize: '12px', color: A2.tintaMetadado }}>{it.sub}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Ato({
  id,
  ordem,
  genero,
  fonte = 'Alexandria',
  enunciado,
  cenario,
  notaCenario,
  movel,
  children,
  aoRegistrar,
  ancora,
}: {
  id: string;
  ordem: number;
  /** "previsão", "meta", "classificar", "exercício"… */
  genero: string;
  fonte?: string;
  enunciado: ReactNode;
  cenario?: CenarioItem[];
  notaCenario?: string;
  movel: boolean;
  children: ReactNode;
  aoRegistrar?: never;
  ancora?: string;
}) {
  const loop = useLoop();
  const registrado = loop.temRegistro(id);
  void aoRegistrar;
  return (
    <section aria-labelledby={`${id}-h`} id={ancora} style={{ display: 'flex', flexDirection: 'column' }}>
      <CabecaCorrida
        esquerda={<span id={`${id}-h`}><Voz rotulo={`Ato ${ordem} de ${loop.total} · ${genero}`} fonte={fonte} /></span>}
        direita={<EstadoDoAto registrado={registrado} />}
      />
      <Entrada
        movel={movel}
        margem={
          <span style={{ ...AT2.codigo, fontSize: '12px', color: A2.tintaMetadado, display: 'block' }}>
            {ordem}/{loop.total}
          </span>
        }
      >
        <p style={{ fontFamily: AF.corpo, fontWeight: 500, fontSize: movel ? '16px' : '18px', lineHeight: 1.45, margin: '0 0 10px' }}>
          {enunciado}
        </p>
        {cenario && <Cenario itens={cenario} movel={movel} />}
        {notaCenario && (
          <p style={{ ...AT2.metadado, fontSize: '12.5px', fontStyle: 'italic', color: A2.tintaMetadado, margin: '4px 0 10px' }}>
            {notaCenario}
          </p>
        )}
        {children}
      </Entrada>
    </section>
  );
}

/** Em E0 o ato funciona; só o registro precisa de conta (C9). */
export function AvisoDeVisitante() {
  const loop = useLoop();
  if (!loop.visitante) return null;
  return (
    <p style={{ ...AT2.metadado, fontSize: '12.5px', fontStyle: 'italic', color: A2.tintaMetadado, margin: '10px 0 0' }}>
      O ato funciona sem conta. Guardar o registro entre sessões é que exige entrar.
    </p>
  );
}

// ── Entradas: o fio É o campo ────────────────────────────────

export function CampoNumerico({
  rotulo,
  exemplo,
  unidade,
  valor,
  aoMudar,
  captura,
  grande = true,
  ariaLabel,
}: {
  rotulo: string;
  exemplo?: string;
  unidade: string;
  valor: string;
  aoMudar: (v: string) => void;
  captura?: string;
  grande?: boolean;
  ariaLabel: string;
}) {
  const [foco, setFoco] = useState(false);
  return (
    <label style={{ display: 'block', margin: '0 0 10px' }}>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
        <span style={{ ...aparatoForte, fontSize: '11px' }}>{rotulo}</span>
        {exemplo && <span style={{ ...AT2.metadado, fontSize: '12.5px', fontStyle: 'italic', color: A2.tintaMetadado }}>{exemplo}</span>}
      </span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: '8px', minHeight: '44px' }}>
        <input
          data-capture={captura}
          inputMode="decimal"
          value={valor}
          aria-label={ariaLabel}
          onChange={(e) => aoMudar(e.target.value)}
          onFocus={() => setFoco(true)}
          onBlur={() => setFoco(false)}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            borderRadius: AR.none,
            background: 'transparent',
            outline: 'none',
            padding: '10px 0 6px',
            fontFamily: AF.corpo,
            fontWeight: 500,
            fontSize: grande ? '26px' : '19px',
            lineHeight: 1.1,
            color: A.tintaSobreCreme,
            fontVariantNumeric: 'tabular-nums',
          }}
        />
        <span style={{ ...AT2.metadado, color: A.tintaSuave, whiteSpace: 'nowrap' }}>{unidade}</span>
      </span>
      <Fio peso={foco ? 1.8 : 1.2} cor={A.tintaSobreCreme} />
    </label>
  );
}

/** Marca de escolha. MESMA geometria do levantamento (`Marcas.tsx` §9):
 *  losango cravado = marcada, cruz de referência = por marcar. Nunca um
 *  disco de rádio. */
export function MarcaEscolha({ marcada, tamanho = 13 }: { marcada: boolean; tamanho?: number }) {
  const tracos = tracosDeEstacao(marcada ? 'percorrido' : 'por-percorrer', 4.1);
  const fio = fioDaEscala(tamanho, 'principal') * (14 / tamanho);
  return (
    <svg width={tamanho} height={tamanho} viewBox="-7 -7 14 14" aria-hidden="true" focusable="false" style={{ flex: 'none', display: 'block' }}>
      {tracos.map((t, i) => (
        <path
          key={i}
          d={t.d}
          fill={t.papel === 'fio' ? 'none' : A.tintaSobreCreme}
          stroke={t.papel === 'cheio' ? 'none' : A.tintaSobreCreme}
          strokeWidth={t.papel === 'cheio' ? undefined : fio * (t.peso ?? 1)}
          strokeLinejoin="miter"
        />
      ))}
    </svg>
  );
}

export interface OpcaoEscolha {
  id: string;
  rotulo: ReactNode;
  captura?: string;
}

/** Bandeja de escolha (`C-CLASSIF`). Cada opção é uma linha de texto sobre
 *  fio: pálido por marcar, de tinta quando marcada. Sem caixa, sem chip, sem
 *  disco. Alvo ≥44px. */
export function Escolhas({
  opcoes,
  valor,
  aoEscolher,
  colunas = 1,
  multipla = false,
  marcadas,
  rotuloGrupo,
}: {
  opcoes: OpcaoEscolha[];
  valor?: string | null;
  aoEscolher: (id: string) => void;
  colunas?: number;
  multipla?: boolean;
  marcadas?: string[];
  rotuloGrupo: string;
}) {
  const sel = (id: string) => (multipla ? (marcadas ?? []).includes(id) : valor === id);
  return (
    <div
      role="group"
      aria-label={rotuloGrupo}
      // `data-veu` marca a bandeja para o verificador do véu
      // (`tools/alexandria-veu/verificar-veu.mjs`): uma escolha múltipla
      // contém a resposta certa por construção, e é o ÚNICO lugar da página
      // onde ela pode estar antes do registro. Todo o resto é falta (L2).
      data-veu="escolhas"
      style={{ display: 'grid', gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))`, gap: '2px 22px', margin: '0 0 14px' }}
    >
      {opcoes.map((o) => {
        const m = sel(o.id);
        return (
          <button
            key={o.id}
            type="button"
            data-capture={o.captura}
            aria-pressed={m}
            onClick={() => aoEscolher(o.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minHeight: '44px',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              borderRadius: AR.none,
              borderBottom: `${m ? 1.6 : 1}px solid ${m ? A.tintaSobreCreme : A.fioSobreCreme}`,
              padding: '6px 2px',
              cursor: 'pointer',
              fontFamily: AF.corpo,
              fontSize: '15px',
              lineHeight: 1.35,
              fontWeight: m ? 600 : 400,
              color: A.tintaSobreCreme,
            }}
          >
            <MarcaEscolha marcada={m} />
            <span style={{ minWidth: 0 }}>{o.rotulo}</span>
          </button>
        );
      })}
    </div>
  );
}

/** A ação que registra. Cartela gravada — a mesma da retomada e do selo de
 *  registro do cabeçalho. Nunca barra navy com seta.
 *
 *  A ação NUNCA fica desabilitada. Um botão desabilitado é um beco: não diz
 *  o que falta, e um alvo morto no meio do ato é exatamente o que o §6
 *  chama de controle inerte. Quando o ato ainda não tem o que registrar, o
 *  clique DIZ o que falta — e não revela referência nenhuma (C7). */
export function AcaoDeRegistro({
  rotulo,
  objeto,
  aoClicar,
  captura,
  movel,
  pronto = true,
  oQueFalta = 'Faça a sua tentativa antes de registrar. A referência só aparece depois dela.',
}: {
  rotulo: string;
  objeto?: string;
  aoClicar: () => void;
  captura?: string;
  movel: boolean;
  /** false = ainda não há tentativa para registrar. */
  pronto?: boolean;
  oQueFalta?: string;
}) {
  const [avisado, setAvisado] = useState(false);
  return (
    <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: '12px', rowGap: '4px', minWidth: 0 }}>
      <button
        type="button"
        data-capture={captura}
        onClick={() => {
          if (!pronto) {
            setAvisado(true);
            return;
          }
          aoClicar();
        }}
        className="alx-retomada-acao"
        aria-label={objeto ? `${rotulo} · ${objeto}` : rotulo}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          alignSelf: 'flex-start',
          minHeight: '48px',
          background: 'none',
          border: 'none',
          borderRadius: AR.none,
          padding: 0,
          cursor: 'pointer',
          color: A.navy,
        }}
      >
        {/* O OBJETO fica FORA da cartela em toda largura. A cartela é curta
            por receita, e o rótulo inteiro numa linha só estourava a medida da
            coluna do ato — 497px em 358 a 390, 510px em 483 a 1280 (medido no
            render da r02). O nome acessível continua nomeando verbo E objeto. */}
        <CartelaAcao movel={movel}>
          <span
            className="alx-retomada-verbo"
            style={{ ...AT2.navV2, fontSize: movel ? '12.2px' : '13px', letterSpacing: '0.17em', lineHeight: 1, color: A.navy, whiteSpace: 'nowrap' }}
          >
            {rotulo}
          </span>
        </CartelaAcao>
      </button>
      {objeto && (
        <span style={{ ...AT2.metadado, fontSize: '14px', fontWeight: 500, color: A.tintaSobreCreme, minWidth: 0 }}>{objeto}</span>
      )}
      {avisado && !pronto && (
        <span role="status" style={{ ...AT2.metadado, fontSize: '13px', color: A.tintaSobreCreme, maxWidth: '34em', flexBasis: '100%' }}>
          {oQueFalta}
        </span>
      )}
    </span>
  );
}

/** Ação secundária: palavra sobre fio de travessia. Sem botão com fio (T14). */
export function AcaoSecundaria({
  children,
  aoClicar,
  href,
  captura,
}: {
  children: ReactNode;
  aoClicar?: () => void;
  href?: string;
  captura?: string;
}) {
  const estilo: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '44px',
    background: 'none',
    border: 'none',
    borderRadius: AR.none,
    padding: 0,
    cursor: 'pointer',
    fontFamily: AF.corpo,
    fontSize: '14.5px',
    color: A.tintaSobreCreme,
    textDecoration: 'none',
  };
  if (href) {
    return (
      <a href={href} data-capture={captura} className="alx-travessia alx-travessia-latente" style={estilo} onClick={aoClicar}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" data-capture={captura} className="alx-travessia alx-travessia-latente" style={estilo} onClick={aoClicar}>
      {children}
    </button>
  );
}

export function AvisoDeReferencia({ children }: { children: ReactNode }) {
  return (
    <span style={{ ...AT2.metadado, fontSize: '12.5px', fontStyle: 'italic', color: A2.tintaMetadado }}>{children}</span>
  );
}

// ── Régua graduada — o controle do instrumento ───────────────

/** Limbo graduado com o valor corrente marcado pela flâmula do levantamento.
 *  Operável por teclado (setas, Home/End, PageUp/PageDown) e por ponteiro.
 *  Substitui `input[type=range]`, que é controle de navegador. */
export function ReguaGraduada({
  rotulo,
  unidade,
  min,
  max,
  passo,
  valor,
  aoMudar,
  captura,
  formatar,
  marcas,
  nota,
}: {
  rotulo: string;
  unidade: string;
  min: number;
  max: number;
  passo: number;
  valor: number;
  aoMudar: (v: number) => void;
  captura?: string;
  formatar?: (v: number) => string;
  /** Graduações nomeadas do limbo. */
  marcas?: number[];
  nota?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fmt = formatar ?? ((v: number) => v.toLocaleString('pt-BR'));
  const limites = useCallback((v: number) => Math.min(max, Math.max(min, Math.round(v / passo) * passo)), [min, max, passo]);
  const fracao = (valor - min) / (max - min || 1);

  const teclado = (e: React.KeyboardEvent) => {
    const grande = (max - min) / 10;
    let novo: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') novo = valor + passo;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') novo = valor - passo;
    else if (e.key === 'PageUp') novo = valor + grande;
    else if (e.key === 'PageDown') novo = valor - grande;
    else if (e.key === 'Home') novo = min;
    else if (e.key === 'End') novo = max;
    if (novo === null) return;
    e.preventDefault();
    aoMudar(limites(novo));
  };

  const doPonteiro = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientX - r.left - 10) / Math.max(1, r.width - 20)));
    aoMudar(limites(min + f * (max - min)));
  };

  const graduacoes = marcas ?? [min, (min + max) / 2, max];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
        <span style={{ ...aparatoForte, fontSize: '11px' }}>{rotulo}</span>
        <span style={{ fontFamily: AF.corpo, fontWeight: 500, fontSize: '17px', fontVariantNumeric: 'tabular-nums', color: A.tintaSobreCreme }}>
          {fmt(valor)}
          <span style={{ fontSize: '12.5px', color: A.tintaSuave, fontWeight: 400 }}> {unidade}</span>
        </span>
      </span>
      <div
        ref={ref}
        data-capture={captura}
        role="slider"
        tabIndex={0}
        aria-label={`${rotulo}, em ${unidade}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={valor}
        aria-valuetext={`${fmt(valor)} ${unidade}`}
        onKeyDown={teclado}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          doPonteiro(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) doPonteiro(e.clientX);
        }}
        style={{ position: 'relative', height: '52px', cursor: 'pointer', touchAction: 'none' }}
      >
        <svg
          width="100%"
          height="52"
          viewBox="0 0 100 52"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          style={{ position: 'absolute', inset: 0, display: 'block' }}
        >
          <line x1="0" y1="26" x2="100" y2="26" stroke={A.tintaSobreCreme} strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
          {graduacoes.map((g) => {
            const f = (g - min) / (max - min || 1);
            return (
              <line
                key={g}
                x1={f * 100}
                y1="26"
                x2={f * 100}
                y2="33"
                stroke={A.tintaSuave}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: `calc(10px + ${fracao} * (100% - 20px))`,
            top: '8px',
            transform: 'translateX(-4px)',
          }}
        >
          <MarcaEstacao estado="atual" tamanho={20} cor={A.navy} />
        </span>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
            ...AT2.metadado,
            fontSize: '11px',
            color: A2.tintaMetadado,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <span>{fmt(min)}</span>
          <span>{fmt(max)}</span>
        </span>
      </div>
      {nota && <span style={{ ...AT2.metadado, fontSize: '12px', color: A2.tintaMetadado, lineHeight: 1.4 }}>{nota}</span>}
    </div>
  );
}

// ── Palco (C5) ───────────────────────────────────────────────

/** A prancha do instrumento. Troca de SUPERFÍCIE (papel levantado) com fio de
 *  cabeceira — não um cartão com moldura e faixa navy de título. */
export function Palco({
  numero,
  titulo,
  modo,
  id,
  children,
  largo = false,
  movel,
}: {
  numero: string;
  titulo: string;
  modo: string;
  id: string;
  children: ReactNode;
  largo?: boolean;
  movel: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-t`}
      style={{
        maxWidth: largo ? 'none' : `${MEDIDA_PALCO}px`,
        margin: '14px 0 40px',
        background: A2.cremeSuperficie,
        borderTop: `2px solid ${A.tintaSobreCreme}`,
        borderBottom: `1px solid ${A.fioSobreCreme}`,
        padding: movel ? '12px 14px 18px' : '14px 24px 22px',
      }}
    >
      {/* A 1440 a cabeceira é UMA linha: versalete · nome · modo. A 390 ela não
       *  é essa linha espremida — é composição própria (D1, r12): o par de
       *  aparato (número à esquerda, modo à direita) corre na primeira linha,
       *  e o nome do instrumento ocupa a segunda inteira. Sem isso o `flex: 1`
       *  do nome colapsa para ~26 px e o título despenca uma palavra por linha
       *  por baixo do modo. Grade com posição explícita: a ORDEM DO DOM não
       *  muda, só a composição. */}
      <div
        style={
          movel
            ? {
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                columnGap: '12px',
                rowGap: '4px',
                alignItems: 'baseline',
                marginBottom: '12px',
              }
            : { display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap', rowGap: '2px', marginBottom: '12px' }
        }
      >
        <span
          style={{
            ...aparatoForte,
            fontSize: '11px',
            letterSpacing: '0.2em',
            ...(movel ? { gridRow: 1, gridColumn: 1 } : null),
          }}
        >
          {numero}
        </span>
        <h3
          id={`${id}-t`}
          style={{
            fontFamily: AF.corpo,
            fontWeight: 500,
            fontSize: movel ? '17px' : '19px',
            lineHeight: 1.3,
            margin: 0,
            ...(movel ? { gridRow: 2, gridColumn: '1 / -1' } : { flex: 1, minWidth: 0 }),
          }}
        >
          {titulo}
        </h3>
        <span
          style={{
            ...AT2.metadado,
            fontStyle: 'italic',
            color: A2.tintaMetadado,
            ...(movel ? { gridRow: 1, gridColumn: 2, justifySelf: 'end', textAlign: 'right' } : null),
          }}
        >
          {modo}
        </span>
      </div>
      {children}
    </section>
  );
}

export interface ColunaQuadro {
  rotulo: string;
  valor: ReactNode;
  /** Valor em prosa (comparação), com corpo menor. */
  prosa?: boolean;
}

/** Quadro previsto × calculado, fixo no topo da prancha enquanto o learner
 *  explora (C5, PR-3/PR-8). Fio de coluna, sem moldura. */
export function QuadroDeComparacao({ colunas, movel }: { colunas: ColunaQuadro[]; movel: boolean }) {
  return (
    <dl
      style={{
        display: 'grid',
        gridTemplateColumns: movel ? '1fr 1fr' : `repeat(${colunas.length - 1}, minmax(0, 1fr)) minmax(0, 1.4fr)`,
        borderTop: `1.4px solid ${A.tintaSobreCreme}`,
        borderBottom: `1px solid ${A.fioSobreCreme}`,
        background: A.cremePapel,
        margin: '0 0 18px',
        position: movel ? 'sticky' : undefined,
        top: movel ? 0 : undefined,
        zIndex: movel ? 5 : undefined,
      }}
    >
      {colunas.map((c, i) => (
        <div
          key={c.rotulo}
          style={{
            padding: '10px 14px',
            ...(i > 0 ? { borderLeft: movel && i === 2 ? 'none' : `1px solid ${A.fioSobreCreme}` } : null),
            ...(movel && i === colunas.length - 1 ? { gridColumn: '1 / -1', borderTop: `1px solid ${A.fioSobreCreme}` } : null),
          }}
        >
          <dt style={{ ...aparato, fontSize: '11px' }}>{c.rotulo}</dt>
          <dd
            style={{
              margin: '3px 0 0',
              fontFamily: AF.corpo,
              fontWeight: c.prosa ? 400 : 500,
              fontSize: c.prosa ? '14px' : movel ? '20px' : '24px',
              lineHeight: c.prosa ? 1.45 : 1.2,
              fontVariantNumeric: 'tabular-nums',
              color: A.tintaSobreCreme,
            }}
          >
            {c.valor}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Saidas({ itens, movel }: { itens: { rotulo: string; valor: ReactNode }[]; movel: boolean }) {
  return (
    <dl
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${movel ? 1 : itens.length}, minmax(0, 1fr))`,
        borderTop: `1px solid ${A.fioSobreCreme}`,
        marginTop: '16px',
      }}
    >
      {itens.map((it, i) => (
        <div
          key={it.rotulo}
          style={{
            padding: '10px 12px 6px 0',
            ...(i > 0 && !movel ? { paddingLeft: '12px', borderLeft: `1px solid ${A2.fioClaroSobreCreme}` } : null),
            ...(i > 0 && movel ? { borderTop: `1px solid ${A2.fioClaroSobreCreme}` } : null),
          }}
        >
          <dt style={{ fontFamily: AF.corpo, fontSize: '12.5px', lineHeight: 1.3, color: A.tintaSuave }}>{it.rotulo}</dt>
          <dd style={{ margin: '4px 0 0', fontFamily: AF.corpo, fontWeight: 500, fontSize: '19px', lineHeight: 1.25, fontVariantNumeric: 'tabular-nums' }}>
            {it.valor}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Leitura de um parágrafo do instrumento, mostrando SÓ o ramo ativo. */
export function LeituraDoInstrumento({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: '16px', paddingLeft: '14px', borderLeft: `2px solid ${A.tintaSobreCreme}` }}>
      <span style={{ ...aparato, display: 'block', marginBottom: '4px' }}>{titulo}</span>
      <span style={{ fontFamily: AF.corpo, fontSize: '15px', lineHeight: 1.55 }}>{children}</span>
    </div>
  );
}

/** Rastro do ato dentro do palco (S6, C9). */
export function Praticado({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        margin: '16px 0 0',
        borderTop: `1.4px solid ${A.tintaSobreCreme}`,
        paddingTop: '8px',
        fontFamily: AF.corpo,
        fontSize: '14.5px',
        lineHeight: 1.45,
      }}
    >
      <MarcaEstacao estado="em-curso" tamanho={14} />
      <span>{children}</span>
    </p>
  );
}

// ── C7 · comparação e autoavaliação ──────────────────────────

export function Comparacao({
  sua,
  suaNota,
  referencia,
  tituloReferencia,
  criterio,
  movel,
}: {
  sua: ReactNode;
  suaNota?: ReactNode;
  referencia: ReactNode;
  tituloReferencia: string;
  criterio?: ReactNode;
  movel: boolean;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: movel ? '1fr' : '1fr 1.2fr',
        borderTop: `1.4px solid ${A.tintaSobreCreme}`,
        marginTop: '14px',
      }}
    >
      <div style={{ padding: '12px 16px 12px 0' }}>
        <h4 style={{ ...aparato, margin: '0 0 5px' }}>Sua resposta</h4>
        <p style={{ fontFamily: AF.corpo, fontSize: '15px', lineHeight: 1.5, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{sua}</p>
        {suaNota && <p style={{ ...AT2.metadado, color: A.tintaSuave, margin: '6px 0 0' }}>{suaNota}</p>}
      </div>
      <div
        style={{
          padding: movel ? '12px 0' : '12px 0 12px 20px',
          borderLeft: movel ? 'none' : `1px solid ${A.fioSobreCreme}`,
          borderTop: movel ? `1px solid ${A.fioSobreCreme}` : 'none',
        }}
      >
        <h4 style={{ ...aparato, margin: '0 0 5px' }}>{tituloReferencia}</h4>
        <div style={{ fontFamily: AF.corpo, fontSize: '15px', lineHeight: 1.55 }}>{referencia}</div>
        {criterio && (
          <>
            <h4 style={{ ...aparato, margin: '10px 0 4px' }}>Critério</h4>
            <div style={{ fontFamily: AF.corpo, fontSize: '14px', lineHeight: 1.5, color: A.tintaSuave }}>{criterio}</div>
          </>
        )}
      </div>
    </div>
  );
}

const NIVEIS: RegistroDeAto['atende'][] = ['atende', 'atende em parte', 'não atende'];

/** T-AUTOAV. Três níveis, com nova tentativa. Sem tolerância inventada (P6). */
export function Autoavaliacao({ id, pergunta }: { id: string; pergunta: string }) {
  const loop = useLoop();
  const r = loop.registroDe(id);
  return (
    <div style={{ display: 'flex', gap: '8px 20px', flexWrap: 'wrap', alignItems: 'center', marginTop: '14px' }}>
      <span style={{ ...AT2.metadado, color: A.tintaSuave }}>{pergunta}</span>
      <Escolhas
        rotuloGrupo={pergunta}
        opcoes={NIVEIS.map((n) => ({ id: String(n), rotulo: String(n) }))}
        valor={r?.atende ? String(r.atende) : null}
        aoEscolher={(v) => loop.autoavaliar(id, v as RegistroDeAto['atende'])}
        colunas={3}
      />
    </div>
  );
}

// ── T9 · recuperação ─────────────────────────────────────────

export function Recuperacao({
  origem,
  pergunta,
  children,
  movel,
}: {
  origem: string;
  pergunta: ReactNode;
  children: ReactNode;
  movel: boolean;
}) {
  return (
    <section aria-label={`Recuperação de ${origem}`} style={{ display: 'flex', flexDirection: 'column' }}>
      <CabecaCorrida
        esquerda={<Voz rotulo="Recuperação" fonte="Alexandria" />}
        direita={
          <span style={{ ...AT2.codigo, color: A.tintaSobreCreme, borderBottom: `1.4px solid ${A.tintaSobreCreme}`, paddingBottom: '1px', whiteSpace: 'nowrap' }}>
            De {origem}
          </span>
        }
      />
      <Entrada movel={movel} peso={1} margem={<span style={{ ...aparato, fontSize: '11px' }}>antes</span>}>
        <p style={{ fontFamily: AF.corpo, fontSize: '15.5px', lineHeight: 1.5, margin: '0 0 10px' }}>{pergunta}</p>
        {children}
      </Entrada>
    </section>
  );
}

// ── Mini-rota do módulo (marcador anti-LMS 1) ────────────────

export function MiniRota({
  codigoModulo,
  total,
  atual,
  percorridas,
  movel,
  rota,
}: {
  codigoModulo: string;
  total: number;
  atual: number;
  /** Números das aulas já percorridas. */
  percorridas: number[];
  movel: boolean;
  rota: (n: number) => string;
}) {
  const estado = (n: number) =>
    n === atual ? 'atual' : percorridas.includes(n) ? 'percorrido' : 'por-percorrer';
  if (movel) {
    return (
      <nav aria-label={`Rota do Módulo ${codigoModulo}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: `1px solid ${A.fioSobreCreme}`, borderBottom: `1px solid ${A.fioSobreCreme}`, padding: '10px 0' }}>
        <MarcaEstacao estado="atual" tamanho={16} />
        <span style={{ ...AT2.metadado, fontVariantNumeric: 'tabular-nums' }}>
          Você está aqui · Aula {String(atual).padStart(2, '0')} de {String(total).padStart(2, '0')} · Módulo {codigoModulo.slice(1)}
        </span>
      </nav>
    );
  }
  return (
    <nav aria-label={`Rota do Módulo ${codigoModulo}`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
        <span style={{ ...aparato, fontSize: '11px' }}>Rota do Módulo {codigoModulo}</span>
        <span style={{ ...AT2.metadado, fontSize: '12.5px', color: A.tintaSuave, fontVariantNumeric: 'tabular-nums' }}>
          Aula {String(atual).padStart(2, '0')} de {String(total).padStart(2, '0')}
        </span>
      </div>
      <div style={{ position: 'relative', borderTop: `1px solid ${A.fioSobreCreme}`, paddingTop: '12px' }}>
        <ol style={{ display: 'flex', justifyContent: 'space-between', listStyle: 'none', margin: 0, padding: 0, gap: '2px' }}>
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
            const e = estado(n);
            const marca = (
              <>
                <MarcaEstacao estado={e} tamanho={e === 'atual' ? 18 : 12} titulo={undefined} />
                <span
                  style={{
                    ...AT2.codigo,
                    fontSize: '11px',
                    fontWeight: n === atual ? 700 : 400,
                    color: n === atual ? A.tintaSobreCreme : A.tintaSuave,
                  }}
                >
                  {String(n).padStart(2, '0')}
                </span>
              </>
            );
            return (
              <li key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '28px' }}>
                {n === atual ? (
                  <span aria-current="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    {marca}
                  </span>
                ) : (
                  <a
                    href={rota(n)}
                    aria-label={`Aula ${String(n).padStart(2, '0')} do Módulo ${codigoModulo}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      textDecoration: 'none',
                      color: 'inherit',
                      // alvo ≥ 24×24 (S7): o glifo tem 12px, a caixa é que
                      // precisa ser clicável
                      minWidth: '28px',
                      minHeight: '34px',
                    }}
                  >
                    {marca}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
        <div style={{ display: 'flex', gap: '16px', marginTop: '6px', ...AT2.metadado, fontSize: '12px', color: A2.tintaMetadado }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <MarcaEstacao estado="atual" tamanho={12} /> você está aqui
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <MarcaEstacao estado="percorrido" tamanho={11} /> percorrida
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <MarcaEstacao estado="por-percorrer" tamanho={11} /> sem registro ainda
          </span>
        </div>
      </div>
    </nav>
  );
}

// ── T2 · abertura ────────────────────────────────────────────

/** PRANCHA DE ENTRADA — a matéria da primeira dobra (C6, T5, T8).
 *
 *  A r12 mediu a dobra de entrada da aula e achou "integralmente tipo e fio
 *  de 1 px", com a coluna de leitura morrendo ~280 px antes do trilho e o
 *  quadrante inferior esquerdo morto. A aula perdeu 3–0, no cego, para a
 *  página de Módulo de onde ela é aberta.
 *
 *  A correção é de COMPOSIÇÃO, não de vitrine: nenhuma fotografia sobe para
 *  o topo (C3, T14 — a imagem curada continua entrando junto do parágrafo
 *  que ela explica, C4). O que entra é uma prancha gravada da camada
 *  Alexandria, na coluna de leitura, **abaixo da tese**, e ela precisa
 *  passar no mesmo teste de qualquer figura de aula (C6): ter um trabalho
 *  cognitivo nomeável e desenhar a relação que a aula afirma. O
 *  `titulo` é esse trabalho, escrito como afirmação.
 *
 *  Um palco por aula (§2.5): a prancha de entrada é ESTAÇÃO, não palco. Ela
 *  nunca traz o resultado do instrumento, nunca traz a referência de um ato
 *  e nunca disputa a região dominante com a abertura.
 *
 *  A 390 ela não entra: ali a dobra pertence ao primeiro ato (S7), e a
 *  abertura já é uma coluna só. */
export function PranchaDeEntrada({
  titulo,
  nota,
  children,
}: {
  titulo: string;
  nota: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure style={{ margin: '26px 0 0', maxWidth: `${MEDIDA_LEITURA}px` }}>
      <p style={{ fontFamily: AF.corpo, fontWeight: 600, fontSize: '15.5px', lineHeight: 1.35, margin: '0 0 9px' }}>
        {titulo}
      </p>
      <div style={{ border: `1px solid ${A.fioSobreCreme}`, background: A2.cremeSuperficie }}>{children}</div>
      <figcaption
        style={{
          ...AT2.metadado,
          fontSize: '12.5px',
          color: A.tintaSuave,
          lineHeight: 1.5,
          margin: '8px 0 0',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'baseline',
        }}
      >
        <Selo>esquemático</Selo>
        <span style={{ flex: '1 1 260px', minWidth: 0 }}>{nota}</span>
      </figcaption>
    </figure>
  );
}

export function Abertura({
  eyebrow,
  titulo,
  subtitulo,
  vozPergunta,
  pergunta,
  objetivo,
  lede,
  materia,
  ladoDireito,
  movel,
}: {
  eyebrow: string;
  titulo: string;
  subtitulo?: string;
  vozPergunta: ReactNode;
  pergunta: string;
  objetivo?: ReactNode;
  lede?: ReactNode;
  /** A prancha de entrada (`PranchaDeEntrada`). Só a 1100+; ver acima. */
  materia?: ReactNode;
  ladoDireito: ReactNode;
  movel: boolean;
}) {
  return (
    <section
      aria-labelledby="aula-titulo"
      style={{
        display: 'grid',
        gridTemplateColumns: movel ? '1fr' : '7fr 5fr',
        gap: movel ? '14px' : '56px',
        padding: movel ? '2px 0 26px' : '30px 0 40px',
        borderBottom: `1px solid ${A.fioSobreCreme}`,
      }}
    >
      <div>
        <p style={{ ...aparato, margin: 0 }}>{eyebrow}</p>
        <h1
          id="aula-titulo"
          style={{
            fontFamily: AF.corpo,
            fontWeight: 500,
            fontSize: movel ? '29px' : '44px',
            lineHeight: movel ? 1.14 : 1.1,
            letterSpacing: '-0.005em',
            margin: movel ? '6px 0 4px' : '14px 0 8px',
            textWrap: 'balance',
          }}
        >
          {titulo}
        </h1>
        {subtitulo && !movel && (
          <p style={{ fontFamily: AF.corpo, fontSize: '16px', color: A.tintaSuave, margin: '0 0 26px' }}>{subtitulo}</p>
        )}
        {vozPergunta}
        <p style={{ fontFamily: AF.corpo, fontStyle: 'italic', fontSize: movel ? '17.5px' : '24px', lineHeight: 1.4, margin: movel ? '5px 0 4px' : '10px 0 18px', maxWidth: '30em' }}>
          {pergunta}
        </p>
        {objetivo && !movel && (
          <p style={{ fontFamily: AF.corpo, fontSize: '15px', color: A.tintaSuave, maxWidth: '36em', margin: 0 }}>
            <span style={{ ...aparato, marginRight: '7px' }}>Objetivo</span>
            {objetivo}
          </p>
        )}
        {lede && !movel && (
          <div style={{ marginTop: '26px', paddingTop: '20px', borderTop: `1px solid ${A2.fioClaroSobreCreme}`, fontFamily: AF.corpo, fontStyle: 'italic', fontSize: '18.5px', lineHeight: 1.6, maxWidth: '34em' }}>
            {lede}
          </div>
        )}
        {materia && !movel && materia}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: movel ? '18px' : '20px' }}>{ladoDireito}</div>
    </section>
  );
}

// ── T10 · registro · T11 · próximo passo ─────────────────────

export function RegistroDaAula({
  serveA,
  serveANota,
  demonstrado,
  avaliacao,
  movel,
}: {
  serveA: ReactNode;
  serveANota?: ReactNode;
  demonstrado?: string;
  avaliacao: string;
  movel: boolean;
}) {
  const loop = useLoop();
  const praticado = loop.praticados > 0;
  const m = loop.mecanica;
  // PERCORRIDO, do registro real quando a aula o liga: "percorrida" só com
  // confirmação do servidor; antes dela, "em leitura" — como sempre foi.
  const percorrida = m?.status === 'concluido';
  const linhaDoPercorrido = !m
    ? null
    : percorrida
      ? null
      : m.envioDaConclusao === 'falhou'
        ? 'não foi possível registrar agora'
        : m.conta === 'visitante'
          ? 'registrar exige conta'
          : null;
  return (
    <section aria-labelledby="reg-t" style={{ marginTop: '56px', borderTop: `2px solid ${A.tintaSobreCreme}`, padding: '18px 0 22px' }}>
      {/* O FIM DO TEXTO da regra de conclusão (`vereditoDeConclusao`): o
          registro da aula é o que vem depois do último ato e da última
          seção. Marcador de 0 px, sem papel visual. */}
      {m && <span ref={m.refFim} aria-hidden="true" data-capture="fim-do-texto" style={{ display: 'block', height: 0 }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
        <h2 id="reg-t" style={{ ...aparatoForte, fontSize: '11px', letterSpacing: '0.22em', margin: 0 }}>
          Registro da aula
        </h2>
        {!praticado && !loop.leituraSemPratica && (
          <AcaoSecundaria aoClicar={loop.registrarLeitura}>Registrar leitura sem prática</AcaoSecundaria>
        )}
      </div>
      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: movel ? '1fr' : '1fr 1fr 2fr',
          borderTop: `1px solid ${A.fioSobreCreme}`,
          borderBottom: `1px solid ${A.fioSobreCreme}`,
        }}
      >
        {[
          {
            k: 'Percorrido',
            v: percorrida ? (
              <span data-capture="percorrido-registrado" style={{ display: 'contents' }}>
                <MarcaEstacao estado="percorrido" tamanho={14} /> percorrida · registrada
              </span>
            ) : (
              <>
                <MarcaEstacao estado="em-curso" tamanho={14} /> em leitura
                {linhaDoPercorrido ? ` · ${linhaDoPercorrido}` : ''}
              </>
            ),
          },
          {
            k: 'Praticado',
            v: praticado ? (
              <>
                <MarcaEstacao estado="percorrido" tamanho={14} /> com prática · {loop.praticados} de {loop.total} atos
                {loop.aRevisar > 0 ? ` · ${loop.aRevisar} a revisar` : ''}
              </>
            ) : loop.leituraSemPratica ? (
              <>
                <MarcaEstacao estado="em-curso" tamanho={14} /> leitura registrada, sem prática · 0 de {loop.total} atos
              </>
            ) : (
              <>
                <MarcaEstacao estado="por-percorrer" tamanho={14} /> ainda sem prática · 0 de {loop.total} atos
              </>
            ),
          },
          { k: 'Serve a', v: serveA, nota: serveANota },
        ].map((c, i) => (
          <div
            key={c.k}
            style={{
              padding: '12px 16px 12px 0',
              ...(i > 0 && !movel ? { paddingLeft: '16px', borderLeft: `1px solid ${A.fioSobreCreme}` } : null),
              ...(i > 0 && movel ? { borderTop: `1px solid ${A.fioSobreCreme}` } : null),
            }}
          >
            <dt style={{ ...aparato, marginBottom: '5px' }}>{c.k}</dt>
            <dd style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ display: 'flex', gap: '8px', alignItems: 'center', fontFamily: AF.corpo, fontSize: '15.5px', lineHeight: 1.4, flexWrap: 'wrap' }}>
                {c.v}
              </span>
              {'nota' in c && c.nota && (
                <span style={{ ...AT2.metadado, color: A.tintaSuave }}>{c.nota}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <p style={{ ...AT2.metadado, color: A2.tintaMetadado, margin: '10px 0 0', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <span>{demonstrado ?? 'Demonstrado: ainda não avaliado.'}</span>
        <span>{avaliacao}</span>
      </p>
    </section>
  );
}

export interface DestinoDaAula {
  rotulo: string;
  codigo: string;
  titulo: string;
  destino: string;
}

/** O próximo passo DEPENDE do que aconteceu (C10). Três ramos: sem prática,
 *  com item a revisar, e o caminho normal. */
export function ProximoPasso({
  semPratica,
  aRevisar,
  normal,
  sequencia,
  movel,
  aoIr,
}: {
  semPratica: DestinoDaAula;
  aRevisar: DestinoDaAula | null;
  normal: DestinoDaAula;
  /** Linha Aula → Revisão → Avaliação, sempre visível (T11). */
  sequencia: string;
  movel: boolean;
  aoIr?: (destino: string) => void;
}) {
  const loop = useLoop();
  const escolhido = loop.praticados === 0 ? semPratica : loop.aRevisar > 0 && aRevisar ? aRevisar : normal;
  const motivo =
    loop.praticados === 0
      ? 'Próximo passo · o ato desta aula ainda está pendente'
      : loop.aRevisar > 0 && aRevisar
        ? 'Próximo passo · um ato ficou diferente da referência'
        : 'Próximo passo';
  return (
    <nav
      aria-label="Próximo passo"
      style={{
        display: 'grid',
        gridTemplateColumns: movel ? '1fr' : 'minmax(0, 1fr) auto',
        gap: '16px',
        alignItems: 'center',
        borderTop: `1px solid ${A.fioSobreCreme}`,
        padding: '18px 0 40px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
        <span style={{ ...AT2.metadado, fontSize: '13px', color: A2.tintaMetadado }}>{motivo}</span>
        <a
          href={escolhido.destino}
          data-capture="proximo-passo"
          className="alx-retomada-acao"
          aria-label={`${escolhido.rotulo} · ${escolhido.codigo} — ${escolhido.titulo}`}
          onClick={(e) => {
            if (aoIr) {
              e.preventDefault();
              aoIr(escolhido.destino);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            columnGap: movel ? '10px' : '12px',
            rowGap: '4px',
            alignSelf: 'flex-start',
            maxWidth: '100%',
            minHeight: '48px',
            textDecoration: 'none',
            borderRadius: AR.none,
            color: A.navy,
          }}
        >
          <CartelaAcao movel={movel}>
            <span
              className="alx-retomada-verbo"
              style={{ ...AT2.navV2, fontSize: movel ? '12.2px' : '13px', letterSpacing: '0.17em', lineHeight: 1, color: A.navy, whiteSpace: 'nowrap' }}
            >
              {escolhido.rotulo} · <b style={{ fontWeight: 700, letterSpacing: '0.12em' }}>{escolhido.codigo}</b>
            </span>
          </CartelaAcao>
          <span style={{ fontFamily: AF.corpo, fontSize: movel ? '14px' : '14.5px', fontWeight: 500, lineHeight: 1.45, color: A.tintaSobreCreme, minWidth: 0 }}>
            {escolhido.titulo}
          </span>
        </a>
      </div>
      <p style={{ ...AT2.metadado, color: A.tintaSuave, margin: 0, textAlign: movel ? 'left' : 'right', maxWidth: '30em' }}>
        {sequencia}
      </p>
    </nav>
  );
}

// ── Rodapé de créditos da rota (colofão) ─────────────────────

export function CreditosDaRota({ linhas }: { linhas: ReactNode[] }) {
  if (linhas.length === 0) return null;
  return (
    <section aria-labelledby="cred-t" style={{ borderTop: `1px solid ${A.fioSobreCreme}`, paddingTop: '14px', marginBottom: '8px' }}>
      <h2 id="cred-t" style={{ ...aparato, margin: '0 0 8px' }}>
        Créditos desta aula
      </h2>
      <ol style={{ margin: 0, paddingLeft: '18px', ...AT2.metadado, fontSize: '12.5px', color: A2.tintaMetadado }}>
        {linhas.map((l, i) => (
          <li key={i} style={{ marginBottom: '4px' }}>
            {l}
          </li>
        ))}
      </ol>
    </section>
  );
}

// ── Registro real da aula ────────────────────────────────────
//
// Aqui morava `useAbrirRegistro`, que disparava `aula_iniciada` na
// MONTAGEM — o defeito que a v3 (eventos) corrige. Ninguém o importava; a
// mecânica inteira agora é `useLoopDaAula` (`src/lib/alexandria/`), ligada
// pela aula em `LoopDaAulaProvider mecanica={…}`.
