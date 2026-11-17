// InstrumentoV3.tsx — o instrumento da aula como etapa (C5), com previsão.
//
// TRÊS TEMPOS, NESTA ORDEM, SEM ATALHO:
//   1 · prever — a pergunta com os valores do cenário, e um campo. Nenhuma
//       saída, nenhum controle, nenhuma nota interpretativa no DOM: o véu é
//       real (nada renderizado), não visual. A ação nunca fica desabilitada;
//       sem palpite, o clique diz o que falta e não revela nada.
//   2 · comparar — previsto × calculado, lado a lado, no MESMO cenário, numa
//       régua com as duas marcas. Sem cor de certo/errado e sem "dentro" ou
//       "fora": a fonte não declara tolerância (P6). A diferença é dita como
//       número, não como veredito.
//   3 · explorar — os controles do instrumento, a partir do cenário, com as
//       saídas ao vivo e a leitura da fonte. O quadro da comparação continua
//       à vista enquanto o aluno mexe (C5).
//
// REGISTRO. A previsão sai como `exercicio_respondido` com `ato: 'previsao'`
// e `aulaId` (pelo `useLoopDaAula` da aula); cada ajuste assentado de
// controle sai como `instrumento_usado`. Sem conta, nada sai — o ato
// funciona igual e a linha de aparato diz que registrar exige conta.

import { useId, useMemo, useState } from 'react';
import type { Instrument, InstrumentField } from '@/lib/types/alexandria';
import {
  INSTRUMENT_CALCULATORS,
  type EntradaInstrumento,
  type ResultadoInstrumento,
} from '@/lib/data/alexandria-instrument-calculators';
import type { EstadoDaConta } from '@/lib/alexandria/useLoopDaAula';
import { ReguaDeslizante } from '../ReguaDeslizante';
import type { PrevisaoDoInstrumento } from './previsoes';
import { Html } from './texto';

export const nf = (v: number, casas: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

/** Lê número escrito à brasileira ("25,1", "1.200") ou à inglesa ("25.1"). */
export function lerNumero(s: string): number | null {
  const t = s.trim().replace(/\s/g, '').replace(/%$/, '');
  if (!t) return null;
  let norm = t;
  if (t.includes(',')) norm = t.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(t)) norm = t.replace(/\./g, '');
  const n = Number(norm);
  return Number.isFinite(n) ? n : null;
}

type Escolha = 'a' | 'b' | 'igual';

export type PrevisaoRegistrada =
  | { tipo: 'numero'; valor: number }
  | { tipo: 'comparacao'; escolha: Escolha }
  | { tipo: 'escolha'; valor: string };

/** Calculado de uma grandeza de escolha: a opção cuja `valor` ou `rotulo`
 *  bate com a saída da calculadora no cenário. null se nenhuma bate. */
function opcaoCalculada(
  g: { saida: string; opcoes: { valor: string; rotulo: string }[] },
  r: ResultadoInstrumento,
): { valor: string; rotulo: string } | null {
  const bruto = r.textos?.[g.saida] ?? (r.valores[g.saida] !== undefined ? String(r.valores[g.saida]) : null);
  if (bruto === null) return null;
  const norm = (s: string) => s.replace(/<[^>]*>/g, '').trim().toLowerCase();
  const alvo = norm(bruto);
  return g.opcoes.find((o) => norm(o.valor) === alvo || norm(o.rotulo) === alvo) ?? null;
}

function separarTitulo(t: string): { genero: string | null; nome: string } {
  const i = t.indexOf(' · ');
  return i < 0 ? { genero: null, nome: t } : { genero: t.slice(0, i), nome: t.slice(i + 3) };
}

export function InstrumentoV3({
  instrumento,
  previsao,
  numeroNoModulo,
  codigoModulo,
  rotuloDaAula,
  conta,
  previsto,
  espera,
  aoPrever,
  aoUsar,
}: {
  instrumento: Instrument;
  previsao: PrevisaoDoInstrumento | null;
  numeroNoModulo: string;
  codigoModulo: string;
  rotuloDaAula: string;
  conta: EstadoDaConta;
  previsto: PrevisaoRegistrada | null;
  /** O calculado deste cenário é a resposta de um exercício ainda não
   *  tentado: depois da previsão, ele espera essa tentativa. */
  espera: { rotulo: string; aoIr: () => void } | null;
  aoPrever: (p: PrevisaoRegistrada, resposta: string) => void;
  aoUsar: (valores: Record<string, EntradaInstrumento>) => void;
}) {
  const calc = INSTRUMENT_CALCULATORS[instrumento.id];
  const { genero, nome } = separarTitulo(instrumento.title);
  const idTitulo = useId();
  const aberto = !previsao || (previsto !== null && !espera);

  return (
    <section className="av-instrumento" aria-labelledby={idTitulo} id={`instrumento-${instrumento.id}`} data-capture="instrumento">
      <header className="av-inst-cabeca">
        <span className="av-rotulo">
          {genero ?? 'Instrumento'} {numeroNoModulo} · {codigoModulo}
        </span>
        <h3 id={idTitulo}>{nome}</h3>
        {instrumento.formula && <span className="av-inst-formula">{instrumento.formula}</span>}
      </header>

      {previsao && !previsto && <Prever previsao={previsao} instrumento={instrumento} conta={conta} aoPrever={aoPrever} />}

      {previsao && previsto && calc && !espera && (
        <Comparacao previsao={previsao} previsto={previsto} calc={calc} />
      )}

      {previsao && previsto && espera && (
        <div className="av-prever" data-capture="espera">
          <span className="av-rotulo">Sua previsão está registrada</span>
          {previsto.tipo === 'escolha' && previsao.grandeza.tipo === 'escolha' && (
            <span className="av-comparar-valor av-comparar-texto" data-capture="previsto">
              {previsao.grandeza.opcoes.find((o) => o.valor === previsto.valor)?.rotulo ?? previsto.valor}
            </span>
          )}
          {previsto.tipo === 'numero' && previsao.grandeza.tipo === 'numero' && (
            <span className="av-comparar-valor" data-capture="previsto">
              {nf(previsto.valor, Number.isInteger(previsto.valor) ? 0 : previsao.grandeza.casas)}
              <span className="av-comparar-u">{previsao.grandeza.unidade ? ` ${previsao.grandeza.unidade}` : ''}</span>
            </span>
          )}
          <p className="av-prever-pergunta">
            O cálculo deste cenário é a resposta do {espera.rotulo}, mais abaixo. Ele aparece aqui, ao lado da sua
            previsão, depois da sua tentativa lá.
          </p>
          <div className="av-acao-linha">
            <button type="button" className="av-link" onClick={espera.aoIr}>
              Ir ao {espera.rotulo}
            </button>
          </div>
        </div>
      )}

      {aberto && calc && (
        <Explorar
          instrumento={instrumento}
          inicial={previsao?.cenario ?? null}
          calc={calc}
          aoUsar={aoUsar}
        />
      )}

      {aberto && instrumento.note && (!previsao || !previsao.velarNota || previsto) && (
        <p className="av-inst-nota">
          <Html html={instrumento.note} />
        </p>
      )}

      <p className="av-inst-fonte">
        {instrumento.formula ? `${instrumento.formula} · ` : ''}Fonte: {rotuloDaAula}, instrumento {numeroNoModulo}
        {previsao ? ` · cenário: ${previsao.origemDoCenario}` : ''}.
      </p>
    </section>
  );
}

// ── 1 · prever ───────────────────────────────────────────────

function Prever({
  previsao,
  instrumento,
  conta,
  aoPrever,
}: {
  previsao: PrevisaoDoInstrumento;
  instrumento: Instrument;
  conta: EstadoDaConta;
  aoPrever: (p: PrevisaoRegistrada, resposta: string) => void;
}) {
  const [texto, setTexto] = useState('');
  const [escolha, setEscolha] = useState<Escolha | null>(null);
  const [opcao, setOpcao] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const idCampo = useId();
  const g = previsao.grandeza;

  const cenario = Object.entries(previsao.cenario).map(([id, v]) => {
    const f = instrumento.fields.find((x) => x.id === id);
    // Campo de escolha: mostra o rótulo da opção, nunca o código ("e1").
    const opcao = f?.options?.find((o) => o.value === String(v));
    const valor = opcao ? opcao.label.replace(/<[^>]*>/g, '') : typeof v === 'number' ? nf(v, casasDoValor(v, f?.step)) : v;
    return { id, rotulo: f?.label ?? id, valor, unidade: opcao ? '' : (f?.unit ?? '') };
  });

  const registrar = () => {
    if (g.tipo === 'numero') {
      const n = lerNumero(texto);
      if (n === null) {
        setAviso(texto.trim() ? 'Escreva um número, como 30 ou 12,5.' : 'Escreva o seu palpite antes de ver o cálculo.');
        return;
      }
      aoPrever({ tipo: 'numero', valor: n }, `${texto.trim()}${g.unidade ? ` ${g.unidade}` : ''}`);
    } else if (g.tipo === 'escolha') {
      const o = g.opcoes.find((x) => x.valor === opcao);
      if (!o) {
        setAviso('Escolha uma das opções antes de ver o cálculo.');
        return;
      }
      aoPrever({ tipo: 'escolha', valor: o.valor }, o.rotulo);
    } else {
      if (!escolha) {
        setAviso('Escolha uma das três antes de ver o cálculo.');
        return;
      }
      const rot = escolha === 'a' ? g.rotuloA : escolha === 'b' ? g.rotuloB : 'as duas, igual';
      aoPrever({ tipo: 'comparacao', escolha }, rot);
    }
  };

  return (
    <div className="av-prever" data-capture="prever">
      <span className="av-rotulo">Antes de calcular · sua previsão</span>
      <p className="av-prever-pergunta">{previsao.pergunta}</p>
      {g.tipo !== 'comparacao' && cenario.length > 0 && (
        <dl className="av-cenario">
          {cenario.map((c) => (
            <div key={c.id}>
              <dt>{c.rotulo}</dt>
              <dd>
                {c.valor} <span className="av-unidade">{c.unidade}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {g.tipo === 'numero' ? (
        <div className="av-prever-campo">
          <label htmlFor={idCampo} className="so-leitor">
            Sua previsão{g.unidade ? `, em ${g.unidade}` : ''}
          </label>
          <input
            id={idCampo}
            inputMode="decimal"
            autoComplete="off"
            // Não controlado: o primeiro gesto da aula é ouvido no documento
            // (useLoopDaAula) e re-renderiza antes do onChange; um campo
            // controlado perderia o primeiro valor colado.
            defaultValue=""
            onChange={(e) => {
              setTexto(e.target.value);
              setAviso(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') registrar();
            }}
            placeholder="seu palpite"
            data-capture="campo-previsao"
          />
          {g.unidade && <span className="av-prever-unidade">{g.unidade}</span>}
        </div>
      ) : g.tipo === 'escolha' ? (
        <div className="av-escolhas" role="radiogroup" aria-label="Sua previsão">
          {g.opcoes.map((o) => (
            <button
              key={o.valor}
              type="button"
              role="radio"
              aria-checked={opcao === o.valor}
              className="av-escolha"
              onClick={() => {
                setOpcao(o.valor);
                setAviso(null);
              }}
            >
              <span className="av-marca" aria-hidden="true" data-marcada={opcao === o.valor || undefined} />
              {o.rotulo}
            </button>
          ))}
        </div>
      ) : (
        <div className="av-escolhas" role="radiogroup" aria-label="Sua previsão">
          {(
            [
              ['a', g.rotuloA],
              ['b', g.rotuloB],
              ['igual', 'As duas, igual'],
            ] as [Escolha, string][]
          ).map(([id, rot]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={escolha === id}
              className="av-escolha"
              onClick={() => {
                setEscolha(id);
                setAviso(null);
              }}
            >
              <span className="av-marca" aria-hidden="true" data-marcada={escolha === id || undefined} />
              {rot}
            </button>
          ))}
        </div>
      )}

      <div className="av-acao-linha">
        <button type="button" className="av-acao" onClick={registrar} data-capture="registrar-previsao">
          Registrar previsão e ver o cálculo
        </button>
        {aviso && (
          <span role="status" className="av-aviso">
            {aviso}
          </span>
        )}
      </div>
      <p className="av-aparato">
        O cálculo, os controles e a leitura do instrumento aparecem depois do registro.
        {conta === 'visitante' && ' Sem conta, a previsão vale nesta leitura; guardar o registro exige conta.'}
      </p>
    </div>
  );
}

// ── 2 · comparar ─────────────────────────────────────────────

function Comparacao({
  previsao,
  previsto,
  calc,
}: {
  previsao: PrevisaoDoInstrumento;
  previsto: PrevisaoRegistrada;
  calc: (i: Record<string, EntradaInstrumento>) => ResultadoInstrumento;
}) {
  const g = previsao.grandeza;

  if (g.tipo === 'escolha' && previsto.tipo === 'escolha') {
    const calculada = opcaoCalculada(g, calc(previsao.cenario));
    const sua = g.opcoes.find((o) => o.valor === previsto.valor);
    return (
      <div className="av-comparar" data-capture="comparacao">
        <span className="av-rotulo">Sua previsão × o cálculo · mesmo cenário</span>
        <div className="av-comparar-par">
          <div>
            <span className="av-comparar-valor av-comparar-texto">{sua?.rotulo ?? previsto.valor}</span>
            <span className="av-comparar-quem">você previu</span>
          </div>
          <div>
            <span className="av-comparar-valor av-comparar-texto" data-capture="calculado">
              {calculada?.rotulo ?? 'o cálculo não aponta uma das opções'}
            </span>
            <span className="av-comparar-quem">calculado</span>
          </div>
        </div>
        <p className="av-comparar-frase">
          {calculada
            ? calculada.valor === previsto.valor
              ? 'O cálculo aponta a mesma opção que você previu.'
              : 'O cálculo aponta outra opção.'
            : 'Neste cenário a saída do instrumento não corresponde a nenhuma das opções.'}{' '}
          Mexa nos controles abaixo para ver o que move o resultado; este quadro fica com o cenário da pergunta.
        </p>
      </div>
    );
  }

  if (g.tipo === 'comparacao' && previsto.tipo === 'comparacao') {
    const a = calc(previsao.cenario).valores[g.saida] ?? NaN;
    const b = calc(g.cenarioB).valores[g.saida] ?? NaN;
    const calculado: Escolha = Math.abs(a - b) < 1e-9 ? 'igual' : a > b ? 'a' : 'b';
    const frase = (e: Escolha) => (e === 'igual' ? 'as duas, igual' : e === 'a' ? `${g.rotuloA} consome mais` : `${g.rotuloB} consome mais`);
    return (
      <div className="av-comparar" data-capture="comparacao">
        <span className="av-rotulo">Sua previsão × o cálculo · mesmo cenário</span>
        <div className="av-comparar-par">
          <div>
            <span className="av-comparar-valor av-comparar-texto">{frase(previsto.escolha)}</span>
            <span className="av-comparar-quem">você previu</span>
          </div>
          <div>
            <span className="av-comparar-valor av-comparar-texto">{frase(calculado)}</span>
            <span className="av-comparar-quem">calculado</span>
          </div>
        </div>
        <dl className="av-cenario">
          <div>
            <dt>{g.rotuloA}</dt>
            <dd>
              {nf(a, 0)} <span className="av-unidade">{g.unidade}</span>
            </dd>
          </div>
          <div>
            <dt>{g.rotuloB}</dt>
            <dd>
              {nf(b, 0)} <span className="av-unidade">{g.unidade}</span>
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  if (g.tipo !== 'numero' || previsto.tipo !== 'numero') return null;
  const valor = calc(previsao.cenario).valores[g.saida];
  if (valor === undefined || !Number.isFinite(valor)) return null;
  const u = g.unidade ? ` ${g.unidade}` : '';
  const dif = valor - previsto.valor;
  const ehPercentual = g.unidade === '%';

  // Régua comum às duas marcas: de 0 até um teto redondo acima das duas.
  const maior = Math.max(valor, previsto.valor, 0);
  const teto = ehPercentual && maior <= 100 ? 100 : tetoRedondo(maior);
  const pos = (v: number) => `${Math.min(100, Math.max(0, (v / (teto || 1)) * 100))}%`;
  const marcas = [0, 0.25, 0.5, 0.75, 1].map((f) => f * teto);
  const casasMarca = marcas.every((m) => Number.isInteger(m)) ? 0 : marcas.every((m) => Number.isInteger(m * 10)) ? 1 : 2;

  return (
    <div className="av-comparar" data-capture="comparacao">
      <span className="av-rotulo">Sua previsão × o cálculo · mesmo cenário</span>
      <div className="av-comparar-par">
        <div>
          <span className="av-comparar-valor" data-capture="previsto">
            {nf(previsto.valor, Number.isInteger(previsto.valor) ? 0 : g.casas)}
            <span className="av-comparar-u">{u}</span>
          </span>
          <span className="av-comparar-quem">
            <span className="av-glifo av-glifo-vazado" aria-hidden="true" /> você previu
          </span>
        </div>
        <div>
          <span className="av-comparar-valor" data-capture="calculado">
            {nf(valor, g.casas)}
            <span className="av-comparar-u">{u}</span>
          </span>
          <span className="av-comparar-quem">
            <span className="av-glifo av-glifo-cheio" aria-hidden="true" /> calculado
          </span>
        </div>
      </div>
      <div className="av-comparar-regua" aria-hidden="true">
        <span className="av-comparar-trilho" />
        {marcas.map((m) => (
          <span key={m} className="av-comparar-tique" style={{ left: pos(m) }}>
            <span>
              {nf(m, casasMarca)}
              {ehPercentual ? '%' : ''}
            </span>
          </span>
        ))}
        <span className="av-comparar-marca av-glifo-vazado" style={{ left: pos(previsto.valor) }} />
        <span className="av-comparar-marca av-glifo-cheio" style={{ left: pos(valor) }} />
      </div>
      <p className="av-comparar-frase">
        {Math.abs(dif) < Math.pow(10, -g.casas) / 2
          ? 'O cálculo deu o mesmo número que você previu.'
          : `O cálculo deu ${nf(Math.abs(dif), g.casas)}${ehPercentual ? ' pontos percentuais' : u} ${dif > 0 ? 'acima' : 'abaixo'} da sua previsão.`}{' '}
        Mexa nos controles abaixo para ver o que move o resultado; este quadro fica com o cenário da pergunta.
      </p>
    </div>
  );
}

/** Teto da régua cujos quartos são números limpos (0 · 10 · 20 · 30 · 40). */
function tetoRedondo(v: number): number {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 2, 4, 10]) if (v <= m * p) return m * p;
  return 10 * p;
}

/** O veredito das calculadoras antigas formata decimal com ponto
 *  (`toFixed`): "22.000 Ω" leria "vinte e dois mil". Aqui vira vírgula. */
const decimalBr = (s: string) => s.replace(/(\d)\.(\d)/g, '$1,$2');

// ── 3 · explorar ─────────────────────────────────────────────

function Explorar({
  instrumento,
  inicial,
  calc,
  aoUsar,
}: {
  instrumento: Instrument;
  inicial: Record<string, EntradaInstrumento> | null;
  calc: (i: Record<string, EntradaInstrumento>) => ResultadoInstrumento;
  aoUsar: (valores: Record<string, EntradaInstrumento>) => void;
}) {
  const semente = useMemo(() => {
    const o: Record<string, EntradaInstrumento> = {};
    for (const f of instrumento.fields) {
      if (f.defaultValue !== '' && f.defaultValue !== undefined) o[f.id] = f.defaultValue;
    }
    return { ...o, ...(inicial ?? {}) };
  }, [instrumento, inicial]);
  const [valores, setValores] = useState(semente);
  const r = useMemo(() => calc(valores), [calc, valores]);

  const mudar = (id: string, v: EntradaInstrumento | undefined) => {
    const novo = { ...valores };
    if (v === undefined) delete novo[id];
    else novo[id] = v;
    setValores(novo);
    aoUsar(novo);
  };

  // Texto verbatim da fonte tem precedência sobre o número do mesmo id.
  const saidas = instrumento.outputs.flatMap((o): { id: string; label: string; unit: string | null; texto: string | null; v: number | undefined }[] => {
    const t = r.textos?.[o.id];
    if (t !== undefined && t !== '') return [{ ...o, texto: t, v: undefined }];
    const v = r.valores[o.id];
    return v !== undefined && Number.isFinite(v) ? [{ ...o, texto: null, v }] : [];
  });

  return (
    <div className="av-explorar" data-capture="explorar">
      <span className="av-rotulo">Explore · os controles partem do cenário da pergunta</span>
      <div className="av-explorar-grade">
        <div className="av-controles">
          {instrumento.fields.map((f) => (
            <Controle key={f.id} campo={f} valor={valores[f.id]} aoMudar={(v) => mudar(f.id, v)} calculado={r.valores[f.id]} />
          ))}
        </div>
        <div className="av-saidas" aria-live="polite">
          {instrumento.id === 'inst-05' && <Triangulo kw={r.valores['tri-kw'] ?? 0} kvar={r.valores['tri-kvar'] ?? 0} />}
          {saidas.map((o) => (
            <div key={o.id} className="av-saida">
              <span className="av-saida-rotulo">{o.label}</span>
              {o.texto !== null ? (
                <span className="av-saida-valor av-saida-texto">
                  <Html html={o.texto} />
                </span>
              ) : (
                <span className="av-saida-valor">
                  {nf(o.v as number, casasDe(o.v as number))} <span className="av-unidade">{o.unit ?? ''}</span>
                </span>
              )}
            </div>
          ))}
          {instrumento.id === 'inst-05' && (
            <>
              <div className="av-saida">
                <span className="av-saida-rotulo">Potência aparente</span>
                <span className="av-saida-valor">
                  {nf(r.valores['tri-kva'] ?? 0, 0)} <span className="av-unidade">kVA</span>
                </span>
              </div>
              <div className="av-saida">
                <span className="av-saida-rotulo">Fator de potência</span>
                <span className="av-saida-valor">{nf(r.valores['tri-fp'] ?? 0, 2)}</span>
              </div>
            </>
          )}
          {r.veredito && (
            <p className="av-veredito">
              <Html html={r.vereditoPtBr ? r.veredito : decimalBr(r.veredito)} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Casas do próprio cenário: as do número escrito ou as do passo do campo, o que for maior (R$ 4,15 fica 4,15). */
const casasDoValor = (v: number, passo?: number) => {
  const do_ = (x: number) => (Number.isInteger(x) ? 0 : Math.min(4, (String(x).split('.')[1] ?? '').length));
  return Math.max(do_(v), passo !== undefined ? do_(passo) : 0);
};

/** Casas de uma saída: menos casas para número grande; número pequeno
 *  mantém dois algarismos significativos (0,0051 não vira 0,01). */
const casasDe = (v: number) => {
  const a = Math.abs(v);
  if (a >= 100) return 0;
  if (a >= 10) return 1;
  if (a >= 0.1 || a === 0) return 2;
  return Math.min(6, 1 - Math.floor(Math.log10(a)));
};

function Controle({
  campo,
  valor,
  aoMudar,
  calculado,
}: {
  campo: InstrumentField;
  valor: EntradaInstrumento | undefined;
  aoMudar: (v: EntradaInstrumento | undefined) => void;
  calculado: number | undefined;
}) {
  const id = useId();
  const num = typeof valor === 'number' ? valor : valor === undefined ? undefined : Number(valor);
  if (campo.kind === 'range' && campo.min !== undefined && campo.max !== undefined) {
    const passo = campo.step ?? 1;
    const casas = passo < 1 ? String(passo).split('.')[1]?.length ?? 1 : 0;
    return (
      <ReguaDeslizante
        id={id}
        rotulo={campo.label}
        unidade={campo.unit ?? ''}
        valor={num ?? campo.min}
        min={campo.min}
        max={campo.max}
        passo={passo}
        formatar={(v) => nf(v, casas)}
        aoMudar={(v) => aoMudar(v)}
      />
    );
  }
  if (campo.kind === 'select' && campo.options?.length) {
    const atual = valor !== undefined ? String(valor) : String(campo.defaultValue ?? '');
    return (
      <div className="av-campo av-campo-opcoes">
        <span className="av-campo-rotulo" id={id}>
          {campo.label}
          {campo.unit ? <span className="av-unidade"> · {campo.unit}</span> : null}
        </span>
        <div className="av-opcoes" role="radiogroup" aria-labelledby={id}>
          {campo.options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={atual === o.value}
              className="av-opcao"
              onClick={() => aoMudar(o.value)}
            >
              <Html html={o.label} />
            </button>
          ))}
        </div>
      </div>
    );
  }
  const mostrado = valor !== undefined ? String(valor).replace('.', ',') : calculado !== undefined ? '' : '';
  return (
    <div className="av-campo">
      <label htmlFor={id}>{campo.label}</label>
      <span className="av-campo-linha">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          defaultValue={mostrado}
          placeholder={calculado !== undefined ? nf(calculado, casasDe(calculado)) : undefined}
          onChange={(e) => {
            const n = lerNumero(e.target.value);
            aoMudar(n === null ? undefined : n);
          }}
        />
        <span className="av-unidade">{campo.unit ?? ''}</span>
      </span>
    </div>
  );
}

/** A forma que o nome do INST·05 promete: o triângulo, com os catetos em
 *  escala dos valores e a hipotenusa calculada. Diagrama comum (regra 3). */
function Triangulo({ kw, kvar }: { kw: number; kvar: number }) {
  const W = 300;
  const H = 180;
  const esc = Math.min((W - 70) / Math.max(kw, 1), (H - 40) / Math.max(kvar, 1), 0.2);
  const x0 = 20;
  const y0 = H - 24;
  const x1 = x0 + kw * esc;
  const y1 = y0 - kvar * esc;
  return (
    <svg className="av-triangulo" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Triângulo de potência: ${nf(kw, 0)} kW de base, ${nf(kvar, 0)} kVAr de altura`}>
      <polygon points={`${x0},${y0} ${x1},${y0} ${x1},${y1}`} className="av-tri-forma" />
      <rect x={x1 - 9} y={y0 - 9} width={9} height={9} className="av-tri-reto" />
      <text x={(x0 + x1) / 2} y={y0 + 17} textAnchor="middle">kW</text>
      <text x={x1 + 6} y={(y0 + y1) / 2} dominantBaseline="middle">kVAr</text>
      <text x={(x0 + x1) / 2 - 8} y={(y0 + y1) / 2 - 8} textAnchor="end">kVA</text>
    </svg>
  );
}
