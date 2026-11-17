// ControlesDeInstrumento — o controle de instrumento como OBJETO DO ATLAS.
//
// O QUE ISTO SUBSTITUI, E POR QUÊ. A prancha do Laboratório era um
// formulário genérico colado dentro de um documento gravado: seis
// `<input type="range">` de trilho terracota chapado com botão circular do
// sistema operacional, e cinco campos numéricos retangulares com fundo
// próprio. As duas regras de sistema da casa quebraram juntas ali —
// **nenhuma caixa default** (retângulo com fio não é campo) e **nenhum
// círculo de formulário** (disco, anel, botão redondo de slider). É o
// mesmo defeito de duas rodadas antes, reaparecido numa superfície nova,
// porque foi corrigido por superfície e não por sistema.
//
// O SISTEMA, ENTÃO. Um instrumento da Alexandria é lido como um
// instrumento de gabinete do século XIX é lido:
//
//   RÉGUA GRADUADA — o valor mora numa escala gravada, com traço maior a
//   cada divisão inteira e traço menor entre elas, e um CURSOR de fio com
//   índice em losango corre sobre ela. É o mesmo losango que marca estação
//   na carta e no localizador: o cursor é a posição, na mesma língua.
//
//   ASSENTO DE VALOR — onde o número é digitado, ele se assenta sobre um
//   fio de 1px que tem a largura do próprio número. Sem caixa, sem fundo,
//   sem moldura: o papel passa por baixo, como debaixo de toda a folha.
//
//   ESCALA DE POSIÇÕES — onde a escolha é entre estados nomeados, eles são
//   posições gravadas numa régua, com o mesmo índice em losango. Nenhum
//   `<select>` nativo, que desenha a seta e o realce do sistema operacional
//   e faz a materialidade deixar de ser nossa.
//
//   MARCA DE AÇÃO — onde há um comando, ele é uma cartela entalhada, a
//   mesma peça terminal da Retomada, e não um retângulo com fio nos quatro
//   lados.
//
// NADA DISSO É DECORAÇÃO. Cada peça carrega rótulo, unidade e valor
// legíveis (≥ 11px), opera por teclado com a semântica ARIA do controle
// que ela é, e tem alvo ≥ 24×24 px (≥ 44×44 a 390) — S7. O foco vem dos
// colchetes gravados do chrome (`Marcas.tsx::CSS_CHROME`), que ancoram em
// qualquer elemento focável dentro do shell; nenhum outline do navegador.
//
// TERRACOTA NÃO ENTRA AQUI. Ela é pontuação rara da casa — a posição atual,
// uma vez por viewport. Seis trilhos terracota numa prancha só era o
// oposto disso. A régua inteira é tinta e fio; a cor volta a significar
// alguma coisa no total da fatura, que é onde a prancha quer o olho.

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { A, A2, AF, AR, AS, AT2 } from '@/design/alexandria-tokens';

const rotuloEstilo: CSSProperties = { ...AT2.eyebrow, fontSize: '11px', color: A2.tintaMetadado };
const valorEstilo: CSSProperties = {
  fontFamily: AF.corpo,
  fontSize: '15px',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums lining-nums',
  color: A.tintaSobreCreme,
};

/** Altura da régua. O alvo do S7 é o corpo inteiro da régua, não o índice:
 *  ≥ 24 px em mesa e ≥ 44 px a 390, onde o dedo é o instrumento. */
const ALTURA_REGUA = 28;
const ALTURA_REGUA_MOVEL = 46;

// ── 1 · RÉGUA GRADUADA ───────────────────────────────────────

/** A GRADUAÇÃO É ESCOLHIDA PELA LARGURA MEDIDA, não fixada.
 *
 *  Uma escala gravada tem vão de ar entre os traços; sem isso ela deixa de
 *  ser escala e vira hachura. Oito divisões com quatro subdivisões são 33
 *  traços — certo numa régua de 300 px, e ilegível nos 135 px da coluna do
 *  comparador a 390, onde os mesmos 33 traços ficavam a 4 px um do outro.
 *  O piso é 9 px de vão: abaixo dele a régua perde uma camada de traço, e
 *  nunca o contrário. */
const GRADUACOES: { divisoes: number; subdivisoes: number }[] = [
  { divisoes: 8, subdivisoes: 4 },
  { divisoes: 8, subdivisoes: 2 },
  { divisoes: 8, subdivisoes: 1 },
  { divisoes: 4, subdivisoes: 1 },
];
const VAO_MINIMO = 9;

function graduacaoPara(largura: number) {
  if (largura <= 0) return GRADUACOES[GRADUACOES.length - 1];
  return (
    GRADUACOES.find((g) => largura / (g.divisoes * g.subdivisoes) >= VAO_MINIMO) ??
    GRADUACOES[GRADUACOES.length - 1]
  );
}

function Traco({
  fracao,
  altura,
  cor,
  espessura,
}: {
  fracao: number;
  altura: number;
  cor: string;
  espessura: number;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${fracao * 100}%`,
        bottom: 0,
        width: `${espessura}px`,
        height: `${altura}px`,
        marginLeft: `${-espessura / 2}px`,
        background: cor,
      }}
    />
  );
}

/** O cursor: fio de leitura com índice em losango assentado na linha de
 *  base. O losango é vazado — é a marca de estação da carta, não um disco
 *  de formulário. */
function Cursor({ fracao, altura, movel }: { fracao: number; altura: number; movel: boolean }) {
  const lado = movel ? 12 : 10;
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${fracao * 100}%`,
        bottom: 0,
        height: `${altura}px`,
        width: 0,
        transform: 'translateX(-0.7px)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          width: '1.4px',
          height: `${altura}px`,
          background: A.tintaSobreCreme,
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: `${-lado / 2}px`,
          bottom: `${-lado / 2 + 0.5}px`,
          width: `${lado}px`,
          height: `${lado}px`,
          border: `1.4px solid ${A.tintaSobreCreme}`,
          borderRadius: AR.none,
          background: A2.cremeSuperficie,
          transform: 'rotate(45deg)',
        }}
      />
    </span>
  );
}

export function ReguaGraduada({
  rotulo,
  unidade,
  valor,
  min,
  max,
  passo,
  movel,
  formatar,
  onMudar,
}: {
  rotulo: string;
  unidade: string | null;
  valor: number;
  min: number;
  max: number;
  passo: number;
  movel: boolean;
  formatar: (v: number) => string;
  onMudar: (v: number) => void;
}) {
  const trilho = useRef<HTMLDivElement | null>(null);
  const alturaRegua = movel ? ALTURA_REGUA_MOVEL : ALTURA_REGUA;
  const vao = max - min;
  const fracao = vao > 0 ? Math.min(1, Math.max(0, (valor - min) / vao)) : 0;

  // A densidade da gravura é MEDIDA na própria régua, não estimada a
  // partir da largura da prancha: na coluna de 165 px do comparador a 390,
  // uma conta feita na prancha inteira deixava 33 traços num espaço em que
  // cabem 9. Abaixo do vão mínimo os traços menores simplesmente saem.
  const [larguraRegua, setLarguraRegua] = useState(0);
  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const medir = () => setLarguraRegua((w) => (w === el.clientWidth ? w : el.clientWidth));
    medir();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { divisoes, subdivisoes } = graduacaoPara(larguraRegua);

  const prender = (v: number) => {
    const emPassos = Math.round((v - min) / passo) * passo + min;
    // O passo da fonte carrega casas decimais (0,01 no fator de potência):
    // sem este arredondamento o valor acumula ruído de ponto flutuante e a
    // leitura do cursor deixa de bater com a do assento.
    const casas = (String(passo).split('.')[1] ?? '').length;
    return Number(Math.min(max, Math.max(min, emPassos)).toFixed(casas));
  };

  const doPonteiro = (clienteX: number) => {
    const el = trilho.current;
    if (!el) return;
    const caixa = el.getBoundingClientRect();
    if (caixa.width <= 0) return;
    onMudar(prender(min + ((clienteX - caixa.left) / caixa.width) * vao));
  };

  const porTecla = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const salto = passo * 10;
    const mapa: Record<string, number | 'min' | 'max'> = {
      ArrowLeft: -passo,
      ArrowDown: -passo,
      ArrowRight: passo,
      ArrowUp: passo,
      PageDown: -salto,
      PageUp: salto,
      Home: 'min',
      End: 'max',
    };
    const acao = mapa[e.key];
    if (acao === undefined) return;
    e.preventDefault();
    onMudar(acao === 'min' ? min : acao === 'max' ? max : prender(valor + acao));
  };

  const tracos: ReactNode[] = [];
  for (let i = 0; i <= divisoes; i++) {
    tracos.push(
      <Traco
        key={`m${i}`}
        fracao={i / divisoes}
        altura={alturaRegua * (movel ? 0.42 : 0.46)}
        cor={A.tintaSuave}
        espessura={1.1}
      />,
    );
    if (i < divisoes) {
      for (let j = 1; j < subdivisoes; j++) {
        tracos.push(
          <Traco
            key={`s${i}-${j}`}
            fracao={(i + j / subdivisoes) / divisoes}
            altura={alturaRegua * (movel ? 0.22 : 0.26)}
            cor={A.fioSobreCreme}
            espessura={1}
          />,
        );
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xs, minWidth: 0 }}>
      <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: AS.sm }}>
        <span style={rotuloEstilo}>{rotulo}</span>
        <span style={valorEstilo}>
          {formatar(valor)}
          {unidade && <span style={{ ...rotuloEstilo, marginLeft: '4px' }}>{unidade}</span>}
        </span>
      </span>

      <div
        ref={trilho}
        role="slider"
        tabIndex={0}
        aria-label={unidade ? `${rotulo}, em ${unidade}` : rotulo}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={valor}
        aria-valuetext={unidade ? `${formatar(valor)} ${unidade}` : formatar(valor)}
        onKeyDown={porTecla}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          doPonteiro(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) doPonteiro(e.clientX);
        }}
        style={{
          position: 'relative',
          height: `${alturaRegua}px`,
          // A linha de base É a régua: um fio de tinta correndo de ponta a
          // ponta, com os traços erguidos sobre ele. Não há trilho cheio,
          // não há parte "preenchida" e não há segunda cor.
          borderBottom: `1.2px solid ${A.tintaSobreCreme}`,
          cursor: 'ew-resize',
          touchAction: 'none',
          // O losango do cursor desce meio lado abaixo da linha de base.
          marginBottom: movel ? '7px' : '6px',
        }}
      >
        {tracos}
        <Cursor fracao={fracao} altura={alturaRegua} movel={movel} />
      </div>

      <span style={{ display: 'flex', justifyContent: 'space-between', ...rotuloEstilo }}>
        <span>{formatar(min)}</span>
        <span>{formatar(max)}</span>
      </span>
    </div>
  );
}

// ── 2 · ASSENTO DE VALOR ─────────────────────────────────────

/** O número digitado, assentado sobre um fio. Sem fundo próprio e sem
 *  moldura: o campo era um retângulo creme sobre o creme da prancha, e
 *  retângulo com fio não é campo (regra 1 da casa). */
export function AssentoDeValor({
  rotulo,
  unidade,
  texto,
  min,
  max,
  passo,
  movel,
  onMudar,
}: {
  rotulo: string;
  unidade: string | null;
  texto: string;
  min?: number;
  max?: number;
  passo?: number;
  movel: boolean;
  onMudar: (v: string) => void;
}) {
  const id = useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xs, minWidth: 0 }}>
      <label htmlFor={id} style={rotuloEstilo}>
        {rotulo}
        {unidade && <span style={{ color: A.tintaSuave }}> · {unidade}</span>}
      </label>
      <span
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: AS.sm,
          // O fio é o assento do número e tem a largura do bloco, como a
          // pauta de uma tabela de atlas. Um lado só: nunca quatro.
          borderBottom: `1.2px solid ${A.tintaSobreCreme}`,
        }}
      >
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={texto}
          min={min}
          max={max}
          step={passo}
          onChange={(e) => onMudar(e.target.value)}
          style={{
            ...valorEstilo,
            fontSize: movel ? '17px' : '16px',
            flex: 1,
            minWidth: 0,
            // O ALVO É O CAMPO, não o embrulho (S7). A altura morava no
            // `<span>` e o `<input>` ficava com 29,5 px a 390, abaixo dos
            // 44 do piso móvel: o embrulho passava na medida e o alvo que
            // o dedo acerta, não. Agora a medida está no próprio controle,
            // e o número continua assentado no fio pelo alinhamento de
            // baixo do texto dentro da caixa.
            minHeight: movel ? '44px' : '28px',
            boxSizing: 'border-box',
            alignSelf: 'stretch',
            display: 'block',
            background: 'none',
            border: 'none',
            borderRadius: AR.none,
            // A folga cresce POR CIMA: o número continua assentado no fio,
            // e o que cresce é o campo de toque acima dele.
            padding: `${movel ? '15px' : '0'} 0 ${AS.xs}`,
            outline: 'none',
          }}
        />
      </span>
    </div>
  );
}

// ── 3 · ESCALA DE POSIÇÕES ───────────────────────────────────

/** A escolha entre estados nomeados: posições gravadas numa régua, com o
 *  mesmo índice em losango do cursor. Substitui o `<select>` nativo, que
 *  entrega a seta e o realce ao sistema operacional. */
export function EscalaDePosicoes({
  rotulo,
  unidade,
  opcoes,
  valor,
  movel,
  onMudar,
}: {
  rotulo: string;
  unidade: string | null;
  opcoes: { value: string; label: string }[];
  valor: string;
  movel: boolean;
  onMudar: (v: string) => void;
}) {
  const atual = Math.max(0, opcoes.findIndex((o) => o.value === valor));
  const irPara = (i: number) => onMudar(opcoes[Math.min(opcoes.length - 1, Math.max(0, i))].value);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xs, minWidth: 0 }}>
      <span style={rotuloEstilo}>
        {rotulo}
        {unidade && <span style={{ color: A.tintaSuave }}> · {unidade}</span>}
      </span>
      <div
        role="radiogroup"
        aria-label={rotulo}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${opcoes.length}, minmax(0, 1fr))`,
          borderBottom: `1.2px solid ${A.tintaSobreCreme}`,
        }}
      >
        {opcoes.map((o, i) => {
          const marcado = i === atual;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={marcado}
              tabIndex={marcado ? 0 : -1}
              onClick={() => irPara(i)}
              onKeyDown={(e) => {
                const passo =
                  e.key === 'ArrowRight' || e.key === 'ArrowDown'
                    ? 1
                    : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
                      ? -1
                      : 0;
                if (!passo) return;
                e.preventDefault();
                irPara(atual + passo);
              }}
              // Posição gravada: o traço da escala e o nome embaixo dele.
              // Sem fio nos quatro lados — a moldura seria a caixa default.
              data-tratamento="posicao-de-escala"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '3px',
                minHeight: movel ? '44px' : '30px',
                padding: `${AS.xs} 2px 0`,
                background: 'none',
                border: 'none',
                borderRadius: AR.none,
                font: 'inherit',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  ...rotuloEstilo,
                  color: marcado ? A.tintaSobreCreme : A2.tintaMetadado,
                  textAlign: 'center',
                  lineHeight: 1.25,
                }}
              >
                {o.label}
              </span>
              {/* A posição não escolhida é um TRAÇO da escala; a escolhida
                  é o índice em losango assentado sobre a linha de base — o
                  mesmo cursor da régua graduada, para o learner ler as duas
                  peças com o mesmo olho. */}
              {marcado ? (
                <span
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    width: '9px',
                    height: '9px',
                    marginBottom: '-5px',
                    border: `1.4px solid ${A.tintaSobreCreme}`,
                    background: A2.cremeSuperficie,
                    borderRadius: AR.none,
                    transform: 'rotate(45deg)',
                  }}
                />
              ) : (
                <span
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    width: '1.1px',
                    height: '8px',
                    background: A.tintaSuave,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 4 · MARCA DE AÇÃO ────────────────────────────────────────

/** O comando da prancha, como a cartela entalhada que fecha a Retomada:
 *  duas pontas em chanfro e fio duplo na dobra, sem retângulo fechado.
 *  Substitui os três botões com `border` nos quatro lados. */
export function MarcaDeAcao({
  children,
  principal = false,
  movel,
  onClick,
}: {
  children: ReactNode;
  principal?: boolean;
  movel: boolean;
  onClick: () => void;
}) {
  const tinta = principal ? A.tintaSobreCreme : A.tintaSuave;
  return (
    <button
      type="button"
      onClick={onClick}
      data-tratamento="cartela-gravada"
      style={{
        ...AT2.eyebrow,
        fontSize: '11px',
        color: tinta,
        display: 'inline-flex',
        alignItems: 'center',
        gap: AS.sm,
        minHeight: movel ? '44px' : '30px',
        padding: `0 ${AS.md}`,
        background: 'none',
        border: 'none',
        borderTop: `${principal ? 1.4 : 1}px solid ${tinta}`,
        borderBottom: `${principal ? 1.4 : 1}px solid ${tinta}`,
        borderRadius: AR.none,
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <Chanfro lado="esquerda" cor={tinta} />
      {children}
      <Chanfro lado="direita" cor={tinta} />
    </button>
  );
}

/** A ponta entalhada da cartela: dois fios em ângulo, desenhados por
 *  borda, sem área chapada e sem raio. */
function Chanfro({ lado, cor }: { lado: 'esquerda' | 'direita'; cor: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        flex: 'none',
        width: '7px',
        height: '7px',
        borderTop: `1.2px solid ${cor}`,
        borderRadius: AR.none,
        transform: lado === 'esquerda' ? 'rotate(-58deg)' : 'rotate(58deg)',
        transformOrigin: lado === 'esquerda' ? 'right center' : 'left center',
      }}
    />
  );
}
