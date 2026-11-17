// InstrumentPanel — um componente para os nove `kind` de instrumento.
//
// Lê `fields` do `Instrument`, renderiza número / range / select conforme
// declarado, chama a função de `INSTRUMENT_CALCULATORS` a cada mudança e
// mostra os `outputs` reais mais o veredito quando existir.
//
// Caso do diagrama: quando `formula` é null e `outputs` é vazio, o
// instrumento não imprime número — desenha. É o `Controles · Triângulo de
// potência` (INST 05), que na fonte tem zero `.instrument-output` porque os
// readouts moram no bloco de visualização do corpo, não no instrumento.
//
// Raio zero, sem sombra, tinta e fio do sistema Alexandria.

import { useMemo, useState, type ReactNode } from 'react';
import type { Instrument, InstrumentField } from '@/lib/types/alexandria';
import {
  INSTRUMENT_CALCULATORS,
  type CalculateFn,
  type EntradaInstrumento,
  type ResultadoInstrumento,
} from '@/lib/data/alexandria-instrument-calculators';
import { A, A2, AF, AT, AT2, AS } from '@/design/alexandria-tokens';
import {
  AssentoDeValor,
  EscalaDePosicoes,
  MarcaDeAcao,
  ReguaGraduada,
} from './ControlesDeInstrumento';
import { useLargura } from '../shell/navegacao';

/** O LAB 01 é comparador de dois lados. A coluna vem prefixada no rótulo
 *  ("Fábrica A · Demanda máxima"), porque `InstrumentField` não tem campo
 *  de agrupamento e inventar um não era necessário. */
function separaColuna(label: string): { coluna: string | null; texto: string } {
  const m = label.match(/^(Fábrica [AB])\s*·\s*(.+)$/);
  return m ? { coluna: m[1], texto: m[2] } : { coluna: null, texto: label };
}

/** Tira do título o prefixo que a seção acima já disse. Só o prefixo, só
 *  quando é exatamente a mesma palavra, e nunca deixando o título vazio. */
function tituloSemEco(titulo: string, contexto: string | null): string {
  if (!contexto) return titulo;
  const sem = titulo.replace(new RegExp(String.raw`^\s*${contexto}\s*·\s*`, 'i'), '');
  return sem.trim() ? sem : titulo;
}

const fmt = (v: number, casas = 2) =>
  v.toLocaleString('pt-BR', { maximumFractionDigits: casas });

/** Casas FIXAS. Numa régua graduada o número tem sempre a mesma forma: o
 *  fator de potência lê 0,96 e 1,00, nunca 0,96 e 1 — a leitura de um
 *  instrumento não muda de casa no meio da escala. */
const fixo = (v: number, casas: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

/** O `f1` da fonte do Módulo 08: uma casa fixa, vírgula. Usado só na
 *  comparação do modo de correção sob demanda. */
const umaCasa = (v: number) => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');

export function InstrumentPanel({
  instrumento,
  contexto = null,
  fonte = null,
  aoUsar,
}: {
  instrumento: Instrument;
  /** Callback de USO — v3 (eventos). Chamado a cada mudança de controle
   *  feita pelo aluno (`ajuste`) e a cada pedido de correção (`correcao`),
   *  com os valores daquele momento. O painel não agrupa nem envia nada:
   *  quem o monta numa aula liga isto a `useLoopDaAula().usarInstrumento`,
   *  que agrupa o arrasto num evento só e põe `aulaId`. Sem o callback (a
   *  folha do módulo), o instrumento funciona igual e nada é registrado. */
  aoUsar?: (uso: { modo: 'ajuste' | 'correcao'; valores: Record<string, EntradaInstrumento> }) => void;
  /** A procedência dos números deste instrumento, renderizada junto ao
   *  bloco e antes da nota que o interpreta (S4). Quem monta o instrumento
   *  é quem sabe de que estante ele veio. */
  fonte?: ReactNode;
  /** O nome da seção que ABRE este instrumento, quando há uma. A folha do
   *  módulo já imprime "LABORATÓRIO" na margem do roteiro, e o título da
   *  fonte começa com a mesma palavra ("Laboratório · Comparador de perfil
   *  elétrico"): sem isto a mesma palavra aparecia três vezes em 90 px. */
  contexto?: string | null;
}) {
  // Semeia TODO campo que declara default, número ou string.
  //
  // Até a Wave 18 esta linha era `if (typeof f.defaultValue === 'number')`,
  // e todo `kind:'select'` ficava de fora — porque select entrega string
  // ('500' kV, 'ger'). O Módulo 01 não tem select nenhum, então o buraco
  // nunca apareceu; no Módulo 02, que tem seis, o instrumento nascia com
  // `∞` e `NaN` nas saídas e só passava a calcular depois que o aluno
  // mexia no controle. Campo com `defaultValue: ''` (a Lei de Ohm, que
  // começa vazia de propósito) continua fora — string vazia não é valor.
  const inicial = useMemo(() => {
    const o: Record<string, EntradaInstrumento> = {};
    for (const f of instrumento.fields) {
      if (f.defaultValue !== '' && f.defaultValue !== undefined) o[f.id] = f.defaultValue;
    }
    return o;
  }, [instrumento]);

  const [valores, setValores] = useState<Record<string, EntradaInstrumento>>(inicial);
  const movel = useLargura() === 'movel';

  // ── Modo de correção sob demanda — LYCEUM Wave 34 ────────────────
  // Quando `correcaoSobDemanda` existe, NADA calcula ao vivo: o resultado
  // só nasce no clique do botão e congela ali (`revelado` é snapshot, não
  // deriva de `valores`). Instrumento sem o campo segue o caminho de
  // sempre — o useMemo abaixo é o mesmo de antes para os 54 existentes.
  const correcao = instrumento.correcaoSobDemanda;
  const [revelado, setRevelado] = useState<{
    produzido: Record<string, number>;
    completo: boolean;
    resultado: ResultadoInstrumento;
  } | null>(null);

  // Tipado como possivelmente ausente — id sem calculadora registrada é
  // estado real (indexação de Record não garante a chave).
  const calc: CalculateFn | undefined = INSTRUMENT_CALCULATORS[instrumento.id];
  const resultado = useMemo(
    () =>
      correcao
        ? { valores: {} as Record<string, number> }
        : calc
          ? calc(valores)
          : { valores: {} as Record<string, number> },
    [calc, correcao, valores],
  );

  /** Corrige com um conjunto explícito de valores — o clique usa o estado
   *  atual; o normalizar usa o registro recém-reescalado, porque setState
   *  é assíncrono e a fonte corrige com os valores novos. */
  const corrigir = (v: Record<string, EntradaInstrumento>) => {
    if (!correcao) return;
    const produzido: Record<string, number> = {};
    let completo = true;
    for (const id of Object.keys(correcao.referencia)) {
      const bruto = v[id];
      const num = typeof bruto === 'string' ? Number(bruto) : bruto;
      if (num === undefined || !Number.isFinite(num)) {
        completo = false;
        continue;
      }
      // Mesmo clamp que a fonte aplica na entrada — a comparação exibida
      // e a calculadora leem o mesmo valor.
      const campo = instrumento.fields.find((f) => f.id === id);
      const lo = campo?.min ?? -Infinity;
      const hi = campo?.max ?? Infinity;
      produzido[id] = Math.min(hi, Math.max(lo, num));
    }
    setRevelado({
      produzido,
      completo,
      resultado: calc ? calc(v) : { valores: {} },
    });
    aoUsar?.({ modo: 'correcao', valores: v });
  };

  /** Reescala os campos da referência para somarem `alvo` e corrige em
   *  seguida — literal da fonte (`i4inputs(); i4check()`), incluindo o
   *  arredondamento a uma casa (`Math.round(v/s*1000)/10`) e o no-op
   *  quando a soma é zero. */
  const normalizar = () => {
    if (!correcao?.normalizar) return;
    const ids = Object.keys(correcao.referencia);
    const soma = ids.reduce((a, id) => {
      const num = Number(valores[id]);
      return a + (Number.isFinite(num) ? num : 0);
    }, 0);
    if (soma <= 0) return;
    const alvo = correcao.normalizar.alvo;
    const novo: Record<string, EntradaInstrumento> = { ...valores };
    for (const id of ids) {
      const num = Number(valores[id]);
      novo[id] = Math.round(((Number.isFinite(num) ? num : 0) / soma) * alvo * 10) / 10;
    }
    setValores(novo);
    corrigir(novo);
  };

  const zerar = () => {
    if (!correcao) return;
    setValores((v) => {
      const novo = { ...v };
      for (const id of Object.keys(correcao.referencia)) delete novo[id];
      return novo;
    });
    setRevelado(null);
  };

  // Guarda número quando o valor É numérico, e a string crua quando não é.
  //
  // `Number(bruto)` cego quebraria os selects CATEGÓRICOS do Módulo 02 — o
  // Explorador de camadas ('ger'/'tra'/'dis'/'con') e a Cadeia por perfil
  // ('a2'/'a4'/'bt') viravam NaN ao primeiro clique. Os selects numéricos
  // ('500' kV, '2' circuitos) seguem chegando como número, que é o que as
  // calculadoras esperam.
  const proximoValor = (v: Record<string, EntradaInstrumento>, id: string, bruto: string) => {
    const proximo = { ...v };
    if (bruto === '') delete proximo[id];
    else {
      const comoNumero = Number(bruto);
      proximo[id] = Number.isFinite(comoNumero) ? comoNumero : bruto;
    }
    return proximo;
  };
  const setCampo = (id: string, bruto: string) => {
    setValores((v) => proximoValor(v, id, bruto));
    // Fora do updater (efeito colateral não entra em setState). Os valores
    // são os do render corrente mais esta mudança; quem agrupa fica com o
    // último, que é o assentado.
    aoUsar?.({ modo: 'ajuste', valores: proximoValor(valores, id, bruto) });
  };

  // Campos que a própria calculadora resolveu (Lei de Ohm preenche a
  // incógnita) aparecem no campo, em vez de só no veredito. Em modo de
  // correção sob demanda esse eco NÃO acontece — imprimiria a resposta
  // dentro do campo enquanto o aluno digita.
  const mostrado = (f: InstrumentField) => {
    const doUsuario = valores[f.id];
    if (doUsuario !== undefined) return String(doUsuario);
    if (correcao) return '';
    const resolvido = resultado.valores[f.id];
    return resolvido === undefined ? '' : String(Math.round(resolvido * 1000) / 1000);
  };

  const colunas = [...new Set(instrumento.fields.map((f) => separaColuna(f.label).coluna))].filter(
    (c): c is string => c !== null,
  );

  // Ancorado no ID, não em "formula null + zero saídas": a heurística
  // antiga foi desenhada para o INST 05 do Módulo 01, mas casava também
  // com os exploradores de saída vazia dos Módulos 06-07 — todos
  // desenhavam um Triângulo de Potência espúrio (0 kVA / FP 1 / 0°)
  // desde as Waves 29/30. O diagrama lê `tri-*` da calculadora do
  // inst-05; ele é DAQUELE instrumento, não de uma classe de forma.
  const ehDiagrama = instrumento.id === 'inst-05';

  return (
    // A PRANCHA NÃO É UM CARTÃO. Ela era uma caixa com fio nos quatro lados
    // e fundo creme próprio, colada sobre o creme da folha: mobília de
    // aplicação dentro de um documento gravado. Agora é uma prancha do
    // atlas — fio de abertura pesado, título e fólio na mesma linha, e o
    // papel da folha correndo por baixo. A profundidade vem do fio, como
    // em todo o resto da casa.
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: movel ? AS.lg : AS.xl,
        borderTop: `1.4px solid ${A.tintaSobreCreme}`,
        paddingTop: AS.md,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: AS.md,
          flexWrap: 'wrap',
        }}
      >
        {/* Título de objeto em serifa, caixa alta e baixa: o `AT.h3` que
            estava aqui carrega `text-transform: uppercase`, e título de
            conteúdo em versalete é o tique T23. O versalete fica para o
            aparato à direita, que é metadado. */}
        <span
          style={{
            fontFamily: AF.corpo,
            fontSize: movel ? '18px' : '20px',
            fontWeight: 500,
            lineHeight: 1.22,
            color: A.tintaSobreCreme,
          }}
        >
          {tituloSemEco(instrumento.title, contexto)}
        </span>
        <span style={{ ...AT2.eyebrow, fontSize: '11px', color: A2.tintaMetadado }}>
          instrumento de bancada
        </span>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: movel ? AS.lg : AS.xl }}>
        {instrumento.formula && (
          // A fórmula é a inscrição da prancha: ela fica em tinta, sobre um
          // fio. A barra terracota de 3px saiu — terracota é pontuação
          // rara, e aqui ela competia com o total da leitura.
          <div
            style={{
              ...AT.dado,
              fontSize: '15px',
              color: A.tintaSobreCreme,
              borderLeft: `1.2px solid ${A.tintaSobreCreme}`,
              paddingLeft: AS.md,
            }}
          >
            {instrumento.formula}
          </div>
        )}

        {/* Em modo de correção sob demanda a nota é INSTRUÇÃO ("estime sem
            consultar as fichas") e vem antes dos campos — o aluno precisa
            dela antes de produzir, não depois. Só neste modo; nos demais
            instrumentos a nota segue no rodapé, como sempre. */}
        {correcao && instrumento.note && (
          <p
            style={{
              ...AT.corpo,
              fontSize: '12.5px',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 'none',
              color: A2.tintaMetadado,
            }}
            dangerouslySetInnerHTML={{ __html: instrumento.note }}
          />
        )}

        {/* Campos. Comparador de dois lados vira duas colunas. */}
        {colunas.length > 0 ? (
          <>
            <CamposGrade
              campos={instrumento.fields.filter((f) => separaColuna(f.label).coluna === null)}
              mostrado={mostrado}
              setCampo={setCampo}
              movel={movel}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${colunas.length}, 1fr)`,
                borderTop: `1px solid ${A.fioSobreCreme}`,
              }}
            >
              {colunas.map((col, ci) => (
                <div
                  key={col}
                  style={{
                    padding: `${AS.md} ${AS.md} 0`,
                    borderLeft: ci > 0 ? `1px solid ${A.fioSobreCreme}` : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: AS.md,
                  }}
                >
                  <span style={{ ...AT2.eyebrow, fontSize: '11px', color: A.tintaSobreCreme }}>{col}</span>
                  <CamposGrade
                    campos={instrumento.fields.filter((f) => separaColuna(f.label).coluna === col)}
                    mostrado={mostrado}
                    setCampo={setCampo}
                    movel={movel}
                    umaColuna
                  />
                  <Saidas
                    saidas={instrumento.outputs.filter(
                      (o) => separaColuna(o.label).coluna === col,
                    )}
                    valores={resultado.valores}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <CamposGrade
            campos={instrumento.fields}
            mostrado={mostrado}
            setCampo={setCampo}
            movel={movel}
          />
        )}

        {!correcao && colunas.length === 0 && instrumento.outputs.length > 0 && (
          <Saidas saidas={instrumento.outputs} valores={resultado.valores} />
        )}

        {ehDiagrama && <TrianguloDePotencia valores={resultado.valores} />}

        {resultado.veredito && (
          <p
            style={{
              ...AT.corpo,
              fontSize: '13px',
              lineHeight: 1.55,
              margin: 0,
              maxWidth: 'none',
              color: A.tintaSuave,
              borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
              paddingTop: AS.md,
            }}
            // HTML da fonte, como o `note` logo abaixo e o modo de correção
            // sob demanda já fazem. Era texto puro, e os vereditos de
            // m07-inst-04/06 mostravam "<b>…</b>" cru na tela desde a Wave
            // 30. Auditados os ~54 vereditos antes da troca: nenhum carrega
            // "<" fora das tags intencionais — texto sem tag renderiza
            // idêntico ao que era.
            dangerouslySetInnerHTML={{ __html: resultado.veredito }}
          />
        )}

        {correcao && (
          <CorrecaoBloco
            correcao={correcao}
            campos={instrumento.fields}
            movel={movel}
            saidas={instrumento.outputs}
            revelado={revelado}
            onCorrigir={() => corrigir(valores)}
            onNormalizar={correcao.normalizar ? normalizar : undefined}
            onZerar={correcao.zerarRotulo ? zerar : undefined}
          />
        )}

        {/* A FONTE VEM ANTES DA PROSA QUE INTERPRETA (S4). O instrumento
            devolve número, e número factual tem procedência junto ao
            bloco, na mesma tela — nunca só no rodapé da página. Quem monta
            o instrumento passa a linha; onde ela não vier, nada é
            inventado aqui. */}
        {fonte}

        {!correcao && instrumento.note && (
          <p
            style={{
              ...AT.corpo,
              fontSize: '12.5px',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 'none',
              color: A2.tintaMetadado,
            }}
            dangerouslySetInnerHTML={{ __html: instrumento.note }}
          />
        )}
      </div>
    </section>
  );
}

/** O bloco de correção sob demanda — LYCEUM Wave 34. Botões de ação e,
 *  depois do clique, a comparação campo a campo (produzido × referência ×
 *  desvio, com a tolerância aplicada), as leituras da calculadora e o
 *  veredito. O snapshot congela até o próximo clique — fiel à fonte. */
function CorrecaoBloco({
  correcao,
  campos,
  movel,
  saidas,
  revelado,
  onCorrigir,
  onNormalizar,
  onZerar,
}: {
  correcao: NonNullable<Instrument['correcaoSobDemanda']>;
  campos: InstrumentField[];
  movel: boolean;
  saidas: { id: string; label: string; unit: string | null }[];
  revelado: {
    produzido: Record<string, number>;
    completo: boolean;
    resultado: ResultadoInstrumento;
  } | null;
  onCorrigir: () => void;
  onNormalizar?: () => void;
  onZerar?: () => void;
}) {
  // Ordem e rótulo dos campos vêm da declaração do instrumento, não das
  // chaves da referência — a fonte itera `I4.fontes` na ordem declarada.
  const comparaveis = campos.filter((f) => f.id in correcao.referencia);
  const temSaidas =
    revelado !== null && Object.keys(revelado.resultado.valores).length > 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: AS.lg,
        borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
        paddingTop: AS.md,
      }}
    >
      {/* Os comandos da bancada eram três retângulos com fio nos quatro
          lados — e o principal em terracota, que é a cor que a casa guarda
          para a posição atual. Agora são cartelas entalhadas, a mesma peça
          terminal da Retomada, com a principal em tinta cheia e as outras
          em tinta suave. */}
      <div style={{ display: 'flex', gap: AS.lg, flexWrap: 'wrap', alignItems: 'center' }}>
        <MarcaDeAcao principal movel={movel} onClick={onCorrigir}>
          {correcao.botaoRotulo}
        </MarcaDeAcao>
        {onNormalizar && (
          <MarcaDeAcao movel={movel} onClick={onNormalizar}>
            {correcao.normalizar?.rotulo}
          </MarcaDeAcao>
        )}
        {onZerar && (
          <MarcaDeAcao movel={movel} onClick={onZerar}>
            {correcao.zerarRotulo}
          </MarcaDeAcao>
        )}
      </div>

      {revelado?.completo && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {comparaveis.map((f, i) => {
            const prod = revelado.produzido[f.id] ?? 0;
            const ref = correcao.referencia[f.id];
            const d = prod - ref;
            const dentro = Math.abs(d) <= correcao.tolerancia;
            // Largura do desvio como na fonte: min(50, |d|/30*50)% de cada
            // metade da barra, a partir do centro.
            const w = Math.min(50, (Math.abs(d) / 30) * 50);
            const cor = dentro ? A.oliva : A.terracota;
            return (
              <div
                key={f.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(110px, 1fr) 2fr auto',
                  alignItems: 'center',
                  gap: AS.md,
                  padding: `${AS.sm} 0`,
                  borderTop: i > 0 ? `1px solid ${A2.fioClaroSobreCreme}` : 'none',
                }}
              >
                <span style={{ ...AT.dado, fontSize: '12px', color: A.tintaSuave }}>
                  {separaColuna(f.label).texto}
                </span>
                <div
                  style={{
                    position: 'relative',
                    height: '10px',
                    background: A.cremePapel,
                    border: `1px solid ${A2.fioClaroSobreCreme}`,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      bottom: 0,
                      width: '1px',
                      background: A2.fioColunaSobreCreme,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '2px',
                      bottom: '2px',
                      background: dentro ? A2.fioColunaSobreCreme : A.terracota,
                      ...(d >= 0
                        ? { left: '50%', width: `${w}%` }
                        : { right: '50%', width: `${w}%` }),
                    }}
                  />
                </div>
                <span style={{ ...AT.dado, fontSize: '12px', color: cor, textAlign: 'right' }}>
                  {umaCasa(prod)} × {umaCasa(ref)} · {d >= 0 ? '+' : '−'}
                  {umaCasa(Math.abs(d))} pp
                </span>
              </div>
            );
          })}
        </div>
      )}

      {temSaidas && <Saidas saidas={saidas} valores={revelado.resultado.valores} />}

      {revelado?.resultado.veredito && (
        <div
          style={{
            ...AT.corpo,
            fontSize: '13px',
            lineHeight: 1.55,
            margin: 0,
            maxWidth: 'none',
            color: A.tintaSuave,
            borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
            paddingTop: AS.md,
          }}
          // O veredito da fonte carrega <b> e <br> — mesmo idioma do `note`,
          // que já renderiza HTML da fonte. Só neste modo; o veredito dos
          // instrumentos ao vivo segue texto puro.
          dangerouslySetInnerHTML={{ __html: revelado.resultado.veredito }}
        />
      )}
    </div>
  );
}

/** A BANCADA: um controle por campo, cada um um objeto do atlas.
 *
 *  Até a r01 esta função era um formulário — rótulo, `<input type="number">`
 *  com fundo próprio e, quando `kind` era `range`, um `<input type="range">`
 *  de trilho terracota com o botão redondo do sistema operacional por cima.
 *  Era a caixa default e o círculo de formulário na mesma linha, dentro de
 *  um documento gravado. O que entra no lugar está em
 *  `ControlesDeInstrumento.tsx`, e a escolha do controle continua sendo a
 *  que a fonte declara: `range` vira régua graduada, `select` vira escala
 *  de posições, o resto vira assento de valor. */
function CamposGrade({
  campos,
  mostrado,
  setCampo,
  movel,
  umaColuna = false,
}: {
  campos: InstrumentField[];
  mostrado: (f: InstrumentField) => string;
  setCampo: (id: string, v: string) => void;
  movel: boolean;
  umaColuna?: boolean;
}) {
  if (!campos.length) return null;
  const colunas = umaColuna ? 1 : Math.min(campos.length, movel ? 1 : 3);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))`,
        gap: movel ? AS.lg : AS.xl,
      }}
    >
      {campos.map((f) => {
        const { texto } = separaColuna(f.label);
        const mostradoTexto = mostrado(f);

        if (f.kind === 'select') {
          return (
            <EscalaDePosicoes
              key={f.id}
              rotulo={texto}
              unidade={f.unit ?? null}
              opcoes={f.options ?? []}
              valor={mostradoTexto}
              movel={movel}
              onMudar={(v) => setCampo(f.id, v)}
            />
          );
        }

        if (f.kind === 'range' && f.min !== undefined && f.max !== undefined) {
          const passo = f.step ?? 1;
          const bruto = Number(mostradoTexto);
          const valor = Number.isFinite(bruto) ? Math.min(f.max, Math.max(f.min, bruto)) : f.min;
          return (
            <ReguaGraduada
              key={f.id}
              rotulo={texto}
              unidade={f.unit ?? null}
              valor={valor}
              min={f.min}
              max={f.max}
              passo={passo}
              movel={movel}
              // A escala herda as casas decimais do passo da fonte: o fator
              // de potência anda de 0,01 e precisa de duas; a demanda anda
              // de 10 kW e não precisa de nenhuma.
              formatar={(v) => fixo(v, (String(passo).split('.')[1] ?? '').length)}
              onMudar={(v) => setCampo(f.id, String(v))}
            />
          );
        }

        return (
          <AssentoDeValor
            key={f.id}
            rotulo={texto}
            unidade={f.unit ?? null}
            texto={mostradoTexto}
            min={f.min}
            max={f.max}
            passo={f.step}
            movel={movel}
            onMudar={(v) => setCampo(f.id, v)}
          />
        );
      })}
    </div>
  );
}

function Saidas({
  saidas,
  valores,
}: {
  saidas: { id: string; label: string; unit: string | null }[];
  valores: Record<string, number>;
}) {
  if (!saidas.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {saidas.map((o, i) => {
        const v = valores[o.id];
        const { texto } = separaColuna(o.label);
        const total = /fatura estimada/i.test(texto);
        return (
          <div
            key={o.id}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: AS.md,
              padding: `${AS.sm} 0`,
              borderTop: i > 0 ? `1px solid ${A2.fioClaroSobreCreme}` : 'none',
            }}
          >
            <span style={{ ...AT.dado, fontSize: '12px', color: A.tintaSuave }}>{texto}</span>
            <span
              style={{
                ...AT.dado,
                fontSize: total ? '17px' : '15px',
                color: total ? A.terracota : A.tintaSobreCreme,
              }}
            >
              {v === undefined ? '—' : `${o.unit === 'R$' ? 'R$ ' : ''}${fmt(v, o.unit === 'R$' ? 0 : 2)}`}
              {o.unit && o.unit !== 'R$' && (
                <span style={{ color: A2.tintaMetadado }}> {o.unit}</span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** O diagrama do INST 05. Geometria portada do original: origem (40,240),
 *  comprimento máximo 200 px, escalas MAX_KW 1500 e MAX_KVAR 1200. */
function TrianguloDePotencia({ valores }: { valores: Record<string, number> }) {
  const kw = valores['tri-kw'] ?? 0;
  const kvar = valores['tri-kvar'] ?? 0;
  const kva = valores['tri-kva'] ?? 0;
  const fp = valores['tri-fp'] ?? 1;
  const ang = valores['tri-angulo'] ?? 0;

  const OX = 40, OY = 240, MAX_LEN = 200, MAX_KW = 1500, MAX_KVAR = 1200;
  const fimX = OX + (kw / MAX_KW) * MAX_LEN;
  const fimY = OY - (kvar / MAX_KVAR) * (MAX_LEN * 0.85);
  const rad = (ang * Math.PI) / 180;
  const r = 30;

  const corFp = fp >= 0.92 ? A.oliva : fp >= 0.85 ? A2.ouroSobreNavy : A.terracota;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: AS.xl, alignItems: 'center' }}>
      <svg viewBox="0 0 300 270" style={{ width: '100%', maxWidth: 320, overflow: 'visible' }}>
        <line x1={OX} y1={OY} x2={OX + MAX_LEN} y2={OY} stroke={A2.fioClaroSobreCreme} strokeWidth="1" />
        <line x1={OX} y1={OY} x2={OX} y2={OY - MAX_LEN} stroke={A2.fioClaroSobreCreme} strokeWidth="1" />
        <path
          d={`M ${OX + r} ${OY} A ${r} ${r} 0 0 0 ${(OX + r * Math.cos(-rad)).toFixed(2)} ${(OY + r * Math.sin(-rad)).toFixed(2)}`}
          fill="none"
          stroke={A2.tintaMetadado}
          strokeWidth="1"
        />
        <line x1={OX} y1={OY} x2={fimX} y2={OY} stroke={A.tintaSobreCreme} strokeWidth="2" />
        <line x1={fimX} y1={OY} x2={fimX} y2={fimY} stroke={A.terracota} strokeWidth="2" />
        <line x1={OX} y1={OY} x2={fimX} y2={fimY} stroke={corFp} strokeWidth="2.5" />
        <text x={OX + 8} y={OY + 16} style={{ ...AT.rotulo, fontSize: '9px' }} fill={A2.tintaMetadado}>
          kW
        </text>
        <text x={fimX + 6} y={(OY + fimY) / 2} style={{ ...AT.rotulo, fontSize: '9px' }} fill={A.terracota}>
          kVAr
        </text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.sm, minWidth: 130 }}>
        {[
          ['Potência aparente', `${fmt(kva, 0)} kVA`, A.tintaSobreCreme],
          ['Fator de potência', fmt(fp, 2), corFp],
          ['Ângulo φ', `${fmt(ang, 1)}°`, A.tintaSuave],
        ].map(([r0, r1, cor], i) => (
          <div
            key={r0 as string}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              paddingTop: i > 0 ? AS.sm : 0,
              borderTop: i > 0 ? `1px solid ${A2.fioClaroSobreCreme}` : 'none',
            }}
          >
            <span style={{ ...AT.rotulo, fontSize: '9px', color: A2.tintaMetadado }}>{r0}</span>
            <span style={{ ...AT.dado, fontSize: '17px', color: cor as string }}>{r1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstrumentPanel;
