// PaisPerfil — o perfil de país do capítulo "O mundo" do Atlas.
//
// Mora na mesma moldura da ficha do ativo (.atl-ficha): mesma posição ao
// lado dos controles do mapa, mesma largura, mesmo cabeçalho e o mesmo botão
// "Fechar"; no celular vira a mesma folha inferior. Cor e tipografia vêm das
// classes de atlas-v3.css (tokens da casa v3), nada fixo no componente.
//
// Cada número carrega a fonte citada, vinda do fieldSources que o
// servidor entrega (chaves snake_case do OWID, rastreáveis ao codebook).
// A unidade exibida também vem do codebook quando o perfil completo
// carrega; nada de unidade inventada.
//
// País desenhado sem perfil no servidor abre em estado de ausência
// honesta: nome + explicação. Nenhum número inventado.

import { useEffect, useState } from 'react';
import {
  buscarPerfilPais,
  carregarMundo,
  CAMPOS_MATRIZ,
  FONTE_CAMPO,
  fmtNum,
  fmtPct,
  type FonteCampo,
  type PaisPerfil as PerfilCompleto,
  type PaisResumo,
} from '../../../lib/atlas/worldApi';

interface PaisPerfilProps {
  nome: string;
  isoA3: string | null;
  /** null = país sem perfil no servidor — painel de ausência honesta. */
  resumo: PaisResumo | null;
  aoVoltar: () => void;
  /** Herdado do globo antigo; a moldura da ficha já se posiciona sozinha. Ignorado. */
  recuarDoTopo?: boolean;
}

/** "Ember - Yearly Electricity Data (2026) [https://…]; Energy
 *  Institute - …" → só os nomes, sem URL, separados por ponto médio.
 *  A citação integral fica no bloco Fontes completas. */
function nomesDasFontes(citacao: string): string {
  return citacao
    .split(';')
    .map((s) => s.split('[')[0].trim())
    .filter(Boolean)
    .join(' · ');
}

function FonteLinha({ fonte }: { fonte: FonteCampo | undefined }) {
  if (!fonte) return null;
  return <p className="atl-pais-fonte">Fonte: {nomesDasFontes(fonte.sourceCitation)}</p>;
}

/** Unidades do codebook do OWID (em inglês) com o rótulo em português. É tradução
 *  de rótulo, não dado novo: unidade que não está na tabela aparece como a fonte escreve. */
const UNIDADE_PT: Record<string, string> = {
  'grams of co₂ equivalents per kilowatt-hour': 'gCO₂eq/kWh',
  'grams of co2 equivalents per kilowatt-hour': 'gCO₂eq/kWh',
  'kilowatt-hours per person': 'kWh por pessoa',
  'kilowatt-hours': 'kWh',
  'terawatt-hours': 'TWh',
  '%': '%',
  'people': 'pessoas',
  'persons': 'pessoas',
};

function unidadePt(u: string | undefined | null, padrao: string): string {
  if (!u) return padrao;
  // "kilowatt-hours per person (kWh)" → chave sem a sigla entre parênteses
  const chave = u.replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase();
  return UNIDADE_PT[chave] ?? u;
}

function BarraMatriz({ rotulo, pct, fonte }: { rotulo: string; pct: number | null; fonte: FonteCampo | undefined }) {
  return (
    <li className="atl-pais-barra">
      <span className="atl-pais-barra-rotulo">{rotulo}</span>
      <span className={`atl-pais-barra-valor${pct === null ? ' atl-ausente' : ''}`}>{pct === null ? 'sem dado' : fmtPct(pct)}</span>
      <span className="atl-pais-trilho" aria-hidden="true">
        {pct !== null && <span className="atl-pais-preenchimento" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />}
      </span>
      {fonte && (
        <span className="atl-pais-barra-fonte">
          <FonteLinha fonte={fonte} />
        </span>
      )}
    </li>
  );
}

function Indicador({ rotulo, valor, fonte }: { rotulo: string; valor: string; fonte: FonteCampo | undefined }) {
  return (
    <div className="atl-ficha-linha">
      <dt>{rotulo}</dt>
      {/* a citação de cada número fica em "Fonte de cada número", no pé da ficha; aqui, só o
          aviso de que ela diverge da fonte comum */}
      <dd>
        {valor === '—' ? <span className="atl-ausente">sem dado</span> : valor}
        {fonte && <p className="atl-pais-fonte">fonte própria, citada no pé da ficha</p>}
      </dd>
    </div>
  );
}

export function PaisPerfil({ nome, isoA3, resumo, aoVoltar }: PaisPerfilProps) {
  const [perfil, setPerfil] = useState<PerfilCompleto | null>(null);
  const [falhaFontes, setFalhaFontes] = useState(false);
  /** quantos países a base de perfis tem, lido da mesma lista que o mapa usa */
  const [naBase, setNaBase] = useState<number | null>(null);

  // perfil completo (com fieldSources) só existe para país com dado
  useEffect(() => {
    if (!isoA3 || resumo === null) return;
    const controle = new AbortController();
    buscarPerfilPais(isoA3, controle.signal)
      .then((env) => setPerfil(env.data))
      .catch(() => {
        if (!controle.signal.aborted) setFalhaFontes(true);
      });
    return () => controle.abort();
  }, [isoA3, resumo]);

  // a contagem vem de quem a mede (carregarMundo tem cache de módulo: não refaz a busca)
  useEffect(() => {
    if (resumo !== null) return;
    let vivo = true;
    carregarMundo()
      .then((m) => {
        if (vivo) setNaBase(m.porIso.size);
      })
      .catch(() => undefined);
    return () => {
      vivo = false;
    };
  }, [resumo]);

  const fontes = perfil?.fieldSources;
  const fonteDe = (chave: string): FonteCampo | undefined => fontes?.[chave];

  // ── Consolidação de citação — computada em RUNTIME, nunca presumida:
  // os 7 campos da matriz só perdem a linha individual se a citação for
  // byte-idêntica em todos. ───────────
  const citacaoComum: string | null = (() => {
    if (!fontes) return null;
    const citacoes = CAMPOS_MATRIZ.map((c) => fontes[c.fonteCampo]?.sourceCitation);
    if (citacoes.some((c) => c === undefined)) return null;
    return citacoes.every((c) => c === citacoes[0]) ? (citacoes[0] as string) : null;
  })();

  /** Fonte individual só quando diverge da consolidada. */
  const fonteSeDiverge = (chave: string): FonteCampo | undefined => {
    const f = fonteDe(chave);
    if (!f) return undefined;
    return citacaoComum !== null && f.sourceCitation === citacaoComum ? undefined : f;
  };

  /** Rótulos pt dos campos cobertos pela citação consolidada, para o
   *  rodapé declarar exatamente o que cobre. */
  const rotulosCobertos: string[] = (() => {
    if (citacaoComum === null || !fontes) return [];
    const extras: Array<[string, string]> = [
      [FONTE_CAMPO.renewablesShareElecPct, 'participação renovável'],
      [FONTE_CAMPO.carbonIntensityElecGco2PerKwh, 'intensidade de carbono'],
      [FONTE_CAMPO.energyPerCapitaKwh, 'consumo per capita'],
      [FONTE_CAMPO.electricityGenerationTwh, 'geração total'],
      [FONTE_CAMPO.population, 'população'],
    ];
    return ['matriz de geração', ...extras.filter(([k]) => fontes[k]?.sourceCitation === citacaoComum).map(([, r]) => r)];
  })();

  return (
    <aside className="atl-ficha atl-pais" aria-label={`Perfil energético: ${nome}`}>
      <header className="atl-ficha-cabeca">
        <p className="v-dado atl-ficha-sobre">
          País · {isoA3 ?? 'sem código ISO'}
          {resumo ? ` · ano de referência ${resumo.year} · Our World in Data` : ''}
        </p>
        <h2 className="atl-ficha-titulo">{nome}</h2>
        <button type="button" className="atl-ficha-fechar" onClick={aoVoltar} aria-label="Fechar a ficha">
          Fechar
        </button>
      </header>

      <div className="atl-ficha-corpo">
        {resumo === null ? (
          <p className="atl-nota atl-ausencia">
            Este território está desenhado no mapa porque a fronteira é real (Natural Earth, 1:110 milhões), mas não tem perfil energético:{' '}
            {naBase != null
              ? `a base de perfis do Our World in Data usada aqui tem ${fmtNum(naBase)} países, e este não está entre eles.`
              : 'ele não está na base de perfis do Our World in Data usada aqui.'}{' '}
            Nenhum número é preenchido para quem fica fora dela.
          </p>
        ) : (
          <>
            <section className="atl-pais-secao" aria-label="Matriz de geração elétrica">
              <h3 className="atl-pais-secao-titulo">Matriz de geração elétrica</h3>
              <ul className="atl-pais-matriz">
                {CAMPOS_MATRIZ.map((campo) => (
                  <BarraMatriz
                    key={campo.chave}
                    rotulo={campo.rotulo}
                    pct={resumo.fuelMix[campo.chave]}
                    fonte={citacaoComum !== null ? undefined : fonteDe(campo.fonteCampo)}
                  />
                ))}
              </ul>
            </section>

            <dl className="atl-ficha-dados">
              <Indicador rotulo="Renovável na eletricidade" valor={fmtPct(resumo.renewablesShareElecPct)} fonte={fonteSeDiverge(FONTE_CAMPO.renewablesShareElecPct)} />
              <Indicador
                rotulo="Intensidade de carbono"
                valor={
                  resumo.carbonIntensityElecGco2PerKwh === null
                    ? '—'
                    : `${fmtNum(resumo.carbonIntensityElecGco2PerKwh, 1)} ${unidadePt(fonteDe(FONTE_CAMPO.carbonIntensityElecGco2PerKwh)?.unit, 'gCO₂eq/kWh')}`
                }
                fonte={fonteSeDiverge(FONTE_CAMPO.carbonIntensityElecGco2PerKwh)}
              />
              <Indicador
                rotulo="Energia primária per capita"
                valor={resumo.energyPerCapitaKwh === null ? '—' : `${fmtNum(resumo.energyPerCapitaKwh, 0)} ${unidadePt(fonteDe(FONTE_CAMPO.energyPerCapitaKwh)?.unit, 'kWh')}`}
                fonte={fonteSeDiverge(FONTE_CAMPO.energyPerCapitaKwh)}
              />
              <Indicador
                rotulo="Geração elétrica total"
                valor={resumo.electricityGenerationTwh === null ? '—' : `${fmtNum(resumo.electricityGenerationTwh, 1)} ${unidadePt(fonteDe(FONTE_CAMPO.electricityGenerationTwh)?.unit, 'TWh')}`}
                fonte={fonteSeDiverge(FONTE_CAMPO.electricityGenerationTwh)}
              />
              <Indicador rotulo="População" valor={fmtNum(resumo.population)} fonte={fonteSeDiverge(FONTE_CAMPO.population)} />
            </dl>

            {citacaoComum !== null && (
              <p className="atl-pais-fonte">
                Fonte de {rotulosCobertos.join(', ')}: {nomesDasFontes(citacaoComum)}.
              </p>
            )}

            {falhaFontes && (
              <p className="atl-nota atl-ausencia">
                As citações de fonte por campo não carregaram agora. Os valores acima vêm da lista já carregada; recarregue a página para ver as citações.
              </p>
            )}

            {fontes && (
              <details className="atl-pais-fontes">
                <summary>Fonte de cada número, campo a campo</summary>
                <dl>
                  {Object.entries(fontes).map(([campo, fonte]) => (
                    <div key={campo}>
                      <dt className="v-dado">
                        {campo} {fonte.unit ? `(${fonte.unit})` : ''}
                      </dt>
                      <dd>{fonte.sourceCitation}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

export default PaisPerfil;
