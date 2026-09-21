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

import { useMemo, useState } from 'react';
import type { Instrument, InstrumentField } from '@/lib/types/alexandria';
import {
  INSTRUMENT_CALCULATORS,
  type CalculateFn,
  type EntradaInstrumento,
  type ResultadoInstrumento,
} from '@/lib/data/alexandria-instrument-calculators';
import { A, A2, AT, AS, AR, AE } from '@/design/alexandria-tokens';

/** O LAB 01 é comparador de dois lados. A coluna vem prefixada no rótulo
 *  ("Fábrica A · Demanda máxima"), porque `InstrumentField` não tem campo
 *  de agrupamento e inventar um não era necessário. */
function separaColuna(label: string): { coluna: string | null; texto: string } {
  const m = label.match(/^(Fábrica [AB])\s*·\s*(.+)$/);
  return m ? { coluna: m[1], texto: m[2] } : { coluna: null, texto: label };
}

const fmt = (v: number, casas = 2) =>
  v.toLocaleString('pt-BR', { maximumFractionDigits: casas });

/** O `f1` da fonte do Módulo 08: uma casa fixa, vírgula. Usado só na
 *  comparação do modo de correção sob demanda. */
const umaCasa = (v: number) => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');

export function InstrumentPanel({ instrumento }: { instrumento: Instrument }) {
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
  const setCampo = (id: string, bruto: string) => {
    setValores((v) => {
      const proximo = { ...v };
      if (bruto === '') delete proximo[id];
      else {
        const comoNumero = Number(bruto);
        proximo[id] = Number.isFinite(comoNumero) ? comoNumero : bruto;
      }
      return proximo;
    });
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
    <section
      style={{
        border: `1px solid ${A.fioSobreCreme}`,
        borderRadius: AR.none,
        background: A2.cremeSuperficie,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: AS.md,
          padding: `${AS.md} ${AS.lg}`,
          borderBottom: `1px solid ${A.fioSobreCreme}`,
        }}
      >
        <span style={{ ...AT.h3, color: A.tintaSobreCreme, letterSpacing: '0.06em' }}>
          {instrumento.title}
        </span>
        <span style={{ ...AT.rotulo, fontSize: '10px', color: A2.tintaMetadado }}>
          {instrumento.id.replace('-', ' · ').toUpperCase()}
        </span>
      </header>

      <div style={{ padding: AS.lg, display: 'flex', flexDirection: 'column', gap: AS.lg }}>
        {instrumento.formula && (
          <div
            style={{
              ...AT.dado,
              fontSize: '15px',
              color: A.terracota,
              borderLeft: `3px solid ${A.terracota}`,
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
                  <span style={{ ...AT.rotulo, color: A.terracota }}>{col}</span>
                  <CamposGrade
                    campos={instrumento.fields.filter((f) => separaColuna(f.label).coluna === col)}
                    mostrado={mostrado}
                    setCampo={setCampo}
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
          <CamposGrade campos={instrumento.fields} mostrado={mostrado} setCampo={setCampo} />
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
            saidas={instrumento.outputs}
            revelado={revelado}
            onCorrigir={() => corrigir(valores)}
            onNormalizar={correcao.normalizar ? normalizar : undefined}
            onZerar={correcao.zerarRotulo ? zerar : undefined}
          />
        )}

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
  saidas,
  revelado,
  onCorrigir,
  onNormalizar,
  onZerar,
}: {
  correcao: NonNullable<Instrument['correcaoSobDemanda']>;
  campos: InstrumentField[];
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

  const botaoBase: React.CSSProperties = {
    ...AT.rotulo,
    fontSize: '10px',
    background: 'none',
    borderRadius: AR.none,
    padding: `${AS.xs} ${AS.md}`,
    cursor: 'pointer',
    transition: `color ${AE.estado} ${AE.easing}, border-color ${AE.estado} ${AE.easing}`,
  };

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
      <div style={{ display: 'flex', gap: AS.md, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onCorrigir}
          style={{ ...botaoBase, color: A.terracota, border: `1px solid ${A.terracota}` }}
        >
          {correcao.botaoRotulo}
        </button>
        {onNormalizar && (
          <button
            type="button"
            onClick={onNormalizar}
            style={{
              ...botaoBase,
              color: A2.tintaMetadado,
              border: `1px solid ${A2.fioClaroSobreCreme}`,
            }}
          >
            {correcao.normalizar?.rotulo}
          </button>
        )}
        {onZerar && (
          <button
            type="button"
            onClick={onZerar}
            style={{
              ...botaoBase,
              color: A2.tintaMetadado,
              border: `1px solid ${A2.fioClaroSobreCreme}`,
            }}
          >
            {correcao.zerarRotulo}
          </button>
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

function CamposGrade({
  campos,
  mostrado,
  setCampo,
  umaColuna = false,
}: {
  campos: InstrumentField[];
  mostrado: (f: InstrumentField) => string;
  setCampo: (id: string, v: string) => void;
  umaColuna?: boolean;
}) {
  if (!campos.length) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: umaColuna ? '1fr' : `repeat(${Math.min(campos.length, 3)}, 1fr)`,
        gap: AS.lg,
      }}
    >
      {campos.map((f) => {
        const { texto } = separaColuna(f.label);
        return (
          <label key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: AS.xs }}>
            <span style={{ ...AT.rotulo, fontSize: '10px', color: A2.tintaMetadado }}>
              {texto}
              {f.unit && <span style={{ color: A.terracota }}> · {f.unit}</span>}
            </span>

            {f.kind === 'select' ? (
              <select
                value={mostrado(f)}
                onChange={(e) => setCampo(f.id, e.target.value)}
                style={campoEstilo}
              >
                {(f.options ?? []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                value={mostrado(f)}
                min={f.min}
                max={f.max}
                step={f.step}
                onChange={(e) => setCampo(f.id, e.target.value)}
                style={campoEstilo}
              />
            )}

            {f.kind === 'range' && (
              <input
                type="range"
                value={mostrado(f) || f.min || 0}
                min={f.min}
                max={f.max}
                step={f.step}
                onChange={(e) => setCampo(f.id, e.target.value)}
                style={{ width: '100%', accentColor: A.terracota }}
              />
            )}
          </label>
        );
      })}
    </div>
  );
}

const campoEstilo: React.CSSProperties = {
  ...AT.dado,
  color: A.tintaSobreCreme,
  background: A.cremePapel,
  border: 'none',
  borderBottom: `1px solid ${A2.fioColunaSobreCreme}`,
  borderRadius: AR.none,
  padding: `${AS.xs} 0`,
  outline: 'none',
  width: '100%',
};

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
