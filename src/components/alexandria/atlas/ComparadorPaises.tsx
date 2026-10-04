// ComparadorPaises — dois ou três países lado a lado (Wave 35).
//
// A seleção NÃO é um mecanismo novo: entra pelo mesmo caminho do
// clique no globo e da busca, que já resolvem ISO → voo → perfil. O
// comparador só guarda a lista e busca o perfil completo de cada um.
//
// ── AS DUAS REGRAS DE HONESTIDADE ────────────────────────────────────
// 1. Campo `null` mostra "não declara" explícito — nunca zero, nunca
//    célula vazia sem explicação. Um traço mudo faria o leitor supor
//    que o país tem valor baixo.
// 2. Cada número carrega a fonte, no mesmo padrão do PaisPerfil: as
//    citações idênticas se consolidam num rodapé, e só as que
//    genuinamente divergem ficam na linha.
//
// Emissão total NÃO aparece aqui: é derivada, e o lugar dela é o
// ranking, onde a fórmula está visível ao lado. Comparar países por um
// número calculado, no meio de uma tabela de valores medidos, apagaria
// justamente a distinção que a wave existe para preservar.

import { useEffect, useState } from 'react';
import { A, A2, AF, AT, AS, AE } from '../../../design/alexandria-tokens';
import {
  CAMPOS_MATRIZ,
  FONTE_CAMPO,
  buscarPerfilPais,
  fmtNum,
  fmtPct,
  type PaisPerfil,
} from '../../../lib/atlas/worldApi';

interface ComparadorPaisesProps {
  /** ISOs alpha-3, na ordem em que foram adicionados. 2 ou 3. */
  isos: string[];
  /** Nome em pt-BR, resolvido pelo Stub com a mesma função que o
   *  tooltip e o perfil usam (`nomePaisPt`, CLDR do browser). Sem
   *  isto o comparador mostraria "United States" ao lado de um perfil
   *  que diz "Estados Unidos". */
  nomeDe: (iso: string, nomeDoBackend: string) => string;
  aoRemover: (iso: string) => void;
  aoFechar: () => void;
}

/** "Ember - Yearly … [https://…]; Energy Institute - …" → só os nomes.
 *  Mesmo tratamento que o PaisPerfil dá; a função é local nos dois
 *  porque `PaisPerfil.tsx` é NUNCA MODIFICAR nesta wave e exportar de
 *  lá exigiria tocá-lo. */
function nomesDasFontes(citacao: string): string {
  return citacao
    .split(';')
    .map((s) => s.split('[')[0].trim())
    .filter(Boolean)
    .join(' · ');
}

interface Linha {
  rotulo: string;
  fonteCampo: string;
  /** null = o país não declara o campo. */
  valorDe: (p: PaisPerfil) => number | null;
  formatar: (v: number) => string;
  /** Linha de matriz recebe recuo, para a tabela ler como matriz +
   *  indicadores em vez de uma lista plana de onze números. */
  daMatriz?: boolean;
}

const LINHAS: Linha[] = [
  ...CAMPOS_MATRIZ.map((c) => ({
    rotulo: c.rotulo,
    fonteCampo: c.fonteCampo,
    valorDe: (p: PaisPerfil) => p.fuelMix[c.chave],
    formatar: (v: number) => fmtPct(v),
    daMatriz: true,
  })),
  {
    rotulo: 'Renovável na eletricidade',
    fonteCampo: FONTE_CAMPO.renewablesShareElecPct,
    valorDe: (p) => p.renewablesShareElecPct,
    formatar: (v) => fmtPct(v),
  },
  {
    rotulo: 'Intensidade de carbono',
    fonteCampo: FONTE_CAMPO.carbonIntensityElecGco2PerKwh,
    valorDe: (p) => p.carbonIntensityElecGco2PerKwh,
    formatar: (v) => `${fmtNum(v, 1)} g`,
  },
  {
    rotulo: 'Geração elétrica',
    fonteCampo: FONTE_CAMPO.electricityGenerationTwh,
    valorDe: (p) => p.electricityGenerationTwh,
    formatar: (v) => `${fmtNum(v, 1)} TWh`,
  },
  {
    rotulo: 'Energia per capita',
    fonteCampo: FONTE_CAMPO.energyPerCapitaKwh,
    valorDe: (p) => p.energyPerCapitaKwh,
    formatar: (v) => `${fmtNum(v, 0)} kWh`,
  },
  {
    rotulo: 'População',
    fonteCampo: FONTE_CAMPO.population,
    valorDe: (p) => p.population,
    formatar: (v) => fmtNum(v),
  },
];

export function ComparadorPaises({ isos, nomeDe, aoRemover, aoFechar }: ComparadorPaisesProps) {
  const [perfis, setPerfis] = useState<Record<string, PaisPerfil>>({});
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    const controle = new AbortController();
    Promise.all(
      isos.map((iso) =>
        buscarPerfilPais(iso, controle.signal).then((env) => [iso, env.data] as const),
      ),
    )
      .then((pares) => setPerfis(Object.fromEntries(pares)))
      .catch(() => { if (!controle.signal.aborted) setFalhou(true); });
    return () => controle.abort();
  }, [isos]);

  const carregados = isos.map((i) => perfis[i]).filter(Boolean) as PaisPerfil[];
  const pronto = carregados.length === isos.length && isos.length > 0;

  // Consolidação de citação: idêntica em todas as células da linha E
  // em todos os países? então vai uma vez ao rodapé. Computado em
  // runtime, nunca presumido.
  const citacaoDe = (fonteCampo: string): string | null => {
    const cits = carregados.map((p) => p.fieldSources[fonteCampo]?.sourceCitation);
    if (cits.some((c) => c === undefined)) return null;
    return cits.every((c) => c === cits[0]) ? (cits[0] as string) : null;
  };
  const citacoesComuns = pronto
    ? [...new Set(LINHAS.map((l) => citacaoDe(l.fonteCampo)).filter((c): c is string => c !== null))]
    : [];

  return (
    <aside
      aria-label="Comparação entre países"
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: AS.md,
        width: `min(${180 + isos.length * 132}px, calc(100% - ${AS.xl} * 2))`,
        maxHeight: '58%',
        background: A2.cremeSuperficie,
        border: `1px solid ${A.fioSobreCreme}`,
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto',
        transition: `opacity ${AE.estado} ${AE.easing}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: AS.md,
          padding: `${AS.sm} ${AS.md}`,
          borderBottom: `1px solid ${A.fioSobreCreme}`,
        }}
      >
        <span style={{ ...AT.rotulo, fontSize: '9px', color: A2.tintaMetadado }}>
          Comparação · {isos.length} {isos.length === 1 ? 'país' : 'países'}
        </span>
        <button
          type="button"
          onClick={aoFechar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            ...AT.rotulo,
            fontSize: '9px',
            color: A.terracota,
          }}
        >
          Fechar ✕
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: `${AS.sm} ${AS.md}` }}>
        {falhou && (
          <span style={{ ...AT.dado, fontSize: '11px', color: A.tintaSuave }}>
            Não foi possível carregar os perfis agora.
          </span>
        )}

        {!falhou && !pronto && (
          <span style={{ ...AT.rotulo, fontSize: '9px', color: A2.tintaMetadado }}>Carregando…</span>
        )}

        {pronto && (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: '46%' }} />
                  {carregados.map((p) => (
                    <th key={p.isoCode} style={{ textAlign: 'right', paddingBottom: AS.xs, verticalAlign: 'bottom' }}>
                      <span
                        style={{
                          display: 'block',
                          fontFamily: AF.display,
                          fontSize: '12px',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: A.tintaSobreCreme,
                        }}
                      >
                        {nomeDe(p.isoCode, p.countryName)}
                      </span>
                      <button
                        type="button"
                        onClick={() => aoRemover(p.isoCode)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          ...AT.dado,
                          fontSize: '9px',
                          color: A2.tintaMetadado,
                        }}
                      >
                        {p.isoCode} · remover
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LINHAS.map((l, i) => {
                  const primeiraNaoMatriz = !l.daMatriz && LINHAS[i - 1]?.daMatriz === true;
                  const citacao = citacaoDe(l.fonteCampo);
                  const divergente = citacao === null;
                  return (
                    <tr key={l.rotulo}>
                      <td
                        style={{
                          ...AT.dado,
                          fontSize: '11px',
                          color: l.daMatriz ? A.tintaSuave : A.tintaSobreCreme,
                          paddingLeft: l.daMatriz ? AS.sm : 0,
                          paddingTop: primeiraNaoMatriz ? AS.sm : '2px',
                          paddingBottom: '2px',
                          borderTop: primeiraNaoMatriz ? `1px solid ${A.fioSobreCreme}` : undefined,
                          borderBottom: `1px solid ${A2.fioClaroSobreCreme}`,
                        }}
                      >
                        {l.rotulo}
                        {divergente && (
                          <span style={{ ...AT.dado, display: 'block', fontSize: '8px', color: A2.tintaMetadado }}>
                            {carregados
                              .map((p) => p.fieldSources[l.fonteCampo]?.sourceCitation)
                              .filter((c): c is string => !!c)
                              .map(nomesDasFontes)
                              .filter((v, k, arr) => arr.indexOf(v) === k)
                              .join(' / ')}
                          </span>
                        )}
                      </td>
                      {carregados.map((p) => {
                        const v = l.valorDe(p);
                        return (
                          <td
                            key={p.isoCode}
                            style={{
                              ...AT.dado,
                              fontSize: '12px',
                              textAlign: 'right',
                              // AUSÊNCIA DECLARADA — nunca zero, nunca
                              // célula vazia: o leitor precisa saber que
                              // a fonte não declara, não supor valor baixo.
                              color: v === null ? A2.tintaMetadado : A.tintaSobreCreme,
                              fontStyle: v === null ? 'italic' : 'normal',
                              paddingTop: primeiraNaoMatriz ? AS.sm : '2px',
                              paddingBottom: '2px',
                              borderTop: primeiraNaoMatriz ? `1px solid ${A.fioSobreCreme}` : undefined,
                              borderBottom: `1px solid ${A2.fioClaroSobreCreme}`,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {v === null ? 'não declara' : l.formatar(v)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {citacoesComuns.length > 0 && (
              <div style={{ marginTop: AS.sm, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {citacoesComuns.map((c) => (
                  <span key={c} style={{ ...AT.dado, fontSize: '9px', color: A2.tintaMetadado }}>
                    Fonte: {nomesDasFontes(c)}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

export default ComparadorPaises;
