// PaisPerfil — o perfil de país do Atlas Mundial (Wave 27).
//
// Painel HTML com fundo próprio, montado SOBRE a lateral direita da
// prancha — o globo continua sendo globo ao lado, nunca substituído.
// Todo texto é HTML: Cinzel e Lora de verdade, selecionável, legível
// por leitor de tela. Nada renderizado dentro da cena 3D.
//
// Cada número carrega a fonte citada, vinda do fieldSources que o
// backend entrega (chaves snake_case do OWID, rastreáveis ao codebook)
// — o mesmo padrão de "números vivos com fonte nomeada" que rege a
// Alexandria inteira. A unidade exibida também vem do codebook quando
// o perfil completo carrega; nada de unidade inventada.
//
// País desenhado sem perfil no backend abre em estado de ausência
// honesta: nome + explicação + retorno. Nenhum número inventado.

import { useEffect, useState } from 'react';
import { A, A2, AF, AT, AE, AS, AR } from '../../../design/alexandria-tokens';
import {
  buscarPerfilPais,
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
  /** null = país sem perfil no backend — painel de ausência honesta. */
  resumo: PaisResumo | null;
  aoVoltar: () => void;
  /** No modo imersivo a barra de busca ocupa o mesmo canto superior
   *  direito. Sem este recuo o perfil cobre a busca inteira (medido:
   *  x 1068–1428 sobre x 1208–1428, os dois em z-index auto), e quem
   *  monta depois vence — o usuário ficava sem conseguir buscar outro
   *  país com um perfil aberto. */
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

function Rotulinho({ texto }: { texto: string }) {
  return (
    <span style={{ ...AT.rotulo, fontSize: '8px', letterSpacing: '0.13em', color: A2.tintaMetadado }}>
      {texto}
    </span>
  );
}

function FonteLinha({ fonte }: { fonte: FonteCampo | undefined }) {
  if (!fonte) return null;
  return (
    <span style={{ ...AT.dado, fontSize: '9px', color: A2.tintaMetadado }}>
      Fonte: {nomesDasFontes(fonte.sourceCitation)}
    </span>
  );
}

function BarraMatriz({
  rotulo,
  pct,
  fonte,
}: {
  rotulo: string;
  pct: number | null;
  fonte: FonteCampo | undefined;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ ...AT.dado, fontSize: '12px', color: A.tintaSobreCreme }}>{rotulo}</span>
        <span style={{ ...AT.dado, fontSize: '12px', color: pct === null ? A2.tintaMetadado : A.tintaSobreCreme }}>
          {pct === null ? 'sem dado' : fmtPct(pct)}
        </span>
      </div>
      <div style={{ height: '6px', background: A2.fioClaroSobreCreme, borderRadius: AR.none }}>
        {pct !== null && (
          <div
            style={{
              height: '100%',
              width: `${Math.max(0, Math.min(100, pct))}%`,
              background: A.navy,
              borderRadius: AR.none,
            }}
          />
        )}
      </div>
      <FonteLinha fonte={fonte} />
    </div>
  );
}

function Indicador({
  rotulo,
  valor,
  fonte,
}: {
  rotulo: string;
  valor: string;
  fonte: FonteCampo | undefined;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <Rotulinho texto={rotulo} />
      <span style={{ ...AT.dado, fontSize: '15px', color: A.tintaSobreCreme }}>{valor}</span>
      <FonteLinha fonte={fonte} />
    </div>
  );
}

export function PaisPerfil({ nome, isoA3, resumo, aoVoltar, recuarDoTopo = false }: PaisPerfilProps) {
  const [perfil, setPerfil] = useState<PerfilCompleto | null>(null);
  const [falhaFontes, setFalhaFontes] = useState(false);
  const [visivel, setVisivel] = useState(false);

  // entrada por fade na escala do sistema
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisivel(true));
    return () => cancelAnimationFrame(id);
  }, []);

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

  const fontes = perfil?.fieldSources;
  const fonteDe = (chave: string): FonteCampo | undefined => fontes?.[chave];

  // ── Consolidação de citação (Wave 28) — computada em RUNTIME, nunca
  // presumida: os 7 campos da matriz só perdem a linha individual se a
  // citação for byte-idêntica em todos (medido no dado real: matriz +
  // geração total + renovável compartilham a mesma; carbono, per
  // capita e população divergem e mantêm a própria linha). ───────────
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
    return [
      'matriz de geração',
      ...extras.filter(([k]) => fontes[k]?.sourceCitation === citacaoComum).map(([, r]) => r),
    ];
  })();

  return (
    <aside
      aria-label={`Perfil energético: ${nome}`}
      style={{
        position: 'absolute',
        // recuo: ver `recuarDoTopo` — no imersivo a busca ocupa este canto
        top: recuarDoTopo ? '52px' : AS.md,
        right: AS.md,
        bottom: AS.md,
        width: 'min(360px, calc(100% - 96px))',
        background: A2.cremeSuperficie,
        border: `1px solid ${A.fioSobreCreme}`,
        borderRadius: AR.none,
        display: 'flex',
        flexDirection: 'column',
        opacity: visivel ? 1 : 0,
        transition: `opacity ${AE.hover} ${AE.easing}`,
      }}
    >
      {/* cabeçalho fixo: retorno + identidade */}
      <div
        style={{
          padding: `${AS.md} ${AS.lg}`,
          borderBottom: `1px solid ${A.fioSobreCreme}`,
          display: 'flex',
          flexDirection: 'column',
          gap: AS.sm,
        }}
      >
        <button
          type="button"
          onClick={aoVoltar}
          style={{
            alignSelf: 'flex-start',
            background: 'none',
            border: `1px solid ${A2.fioColunaSobreCreme}`,
            borderRadius: AR.none,
            padding: `${AS.xs} ${AS.md}`,
            cursor: 'pointer',
            ...AT.rotulo,
            fontSize: '9px',
            color: A.tintaSobreCreme,
          }}
        >
          ← Voltar ao globo
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span
            style={{
              fontFamily: AF.display,
              fontSize: '18px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: A.tintaSobreCreme,
            }}
          >
            {nome}
          </span>
          <span style={{ ...AT.dado, fontSize: '10px', color: A2.tintaMetadado }}>
            {isoA3 ?? 'sem código ISO'}
            {resumo ? ` · ano de referência ${resumo.year} · Our World in Data` : ''}
          </span>
        </div>
      </div>

      {/* corpo com scroll próprio */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: `${AS.lg} ${AS.lg}`,
          display: 'flex',
          flexDirection: 'column',
          gap: AS.lg,
        }}
      >
        {resumo === null ? (
          <p style={{ ...AT.corpo, fontSize: '13px', color: A.tintaSuave, margin: 0 }}>
            Este território está desenhado no globo porque a fronteira é
            real — Natural Earth 1:110m — mas não tem perfil energético:
            o conjunto do backend cobre os 188 Estados-membros e
            observadores da ONU, e nenhum número será inventado para
            quem está fora dele.
          </p>
        ) : (
          <>
            <section style={{ display: 'flex', flexDirection: 'column', gap: AS.md }}>
              <Rotulinho texto="Matriz de geração elétrica" />
              {CAMPOS_MATRIZ.map((campo) => (
                <BarraMatriz
                  key={campo.chave}
                  rotulo={campo.rotulo}
                  pct={resumo.fuelMix[campo.chave]}
                  fonte={citacaoComum !== null ? undefined : fonteDe(campo.fonteCampo)}
                />
              ))}
            </section>

            <section
              style={{
                borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
                paddingTop: AS.md,
                display: 'flex',
                flexDirection: 'column',
                gap: AS.md,
              }}
            >
              <Indicador
                rotulo="Renovável na eletricidade"
                valor={fmtPct(resumo.renewablesShareElecPct)}
                fonte={fonteSeDiverge(FONTE_CAMPO.renewablesShareElecPct)}
              />
              <Indicador
                rotulo="Intensidade de carbono da eletricidade"
                valor={
                  resumo.carbonIntensityElecGco2PerKwh === null
                    ? '—'
                    : `${fmtNum(resumo.carbonIntensityElecGco2PerKwh, 1)} ${fonteDe(FONTE_CAMPO.carbonIntensityElecGco2PerKwh)?.unit ?? 'gCO₂eq/kWh'}`
                }
                fonte={fonteSeDiverge(FONTE_CAMPO.carbonIntensityElecGco2PerKwh)}
              />
              <Indicador
                rotulo="Consumo de energia primária per capita"
                valor={
                  resumo.energyPerCapitaKwh === null
                    ? '—'
                    : `${fmtNum(resumo.energyPerCapitaKwh, 0)} ${fonteDe(FONTE_CAMPO.energyPerCapitaKwh)?.unit ?? 'kWh'}`
                }
                fonte={fonteSeDiverge(FONTE_CAMPO.energyPerCapitaKwh)}
              />
              <Indicador
                rotulo="Geração elétrica total"
                valor={
                  resumo.electricityGenerationTwh === null
                    ? '—'
                    : `${fmtNum(resumo.electricityGenerationTwh, 1)} ${fonteDe(FONTE_CAMPO.electricityGenerationTwh)?.unit ?? 'TWh'}`
                }
                fonte={fonteSeDiverge(FONTE_CAMPO.electricityGenerationTwh)}
              />
              <Indicador
                rotulo="População"
                valor={fmtNum(resumo.population)}
                fonte={fonteSeDiverge(FONTE_CAMPO.population)}
              />
            </section>

            {citacaoComum !== null && (
              <span
                style={{
                  ...AT.dado,
                  fontSize: '9px',
                  color: A2.tintaMetadado,
                  borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
                  paddingTop: AS.sm,
                }}
              >
                Fonte de {rotulosCobertos.join(', ')}:{' '}
                {nomesDasFontes(citacaoComum)}.
              </span>
            )}

            {falhaFontes && (
              <span style={{ ...AT.dado, fontSize: '10px', fontStyle: 'italic', color: A2.tintaMetadado }}>
                As citações de fonte por campo não carregaram agora — os
                valores acima vêm da lista já carregada; recarregue para
                as citações.
              </span>
            )}

            {fontes && (
              <details style={{ borderTop: `1px solid ${A2.fioClaroSobreCreme}`, paddingTop: AS.md }}>
                <summary
                  style={{
                    ...AT.rotulo,
                    fontSize: '9px',
                    color: A.terracota,
                    cursor: 'pointer',
                    listStyle: 'none',
                  }}
                >
                  Fontes completas, campo a campo →
                </summary>
                <dl style={{ margin: `${AS.sm} 0 0`, display: 'flex', flexDirection: 'column', gap: AS.sm }}>
                  {Object.entries(fontes).map(([campo, fonte]) => (
                    <div key={campo}>
                      <dt style={{ ...AT.dado, fontSize: '10px', color: A.tintaSobreCreme }}>
                        {campo} {fonte.unit ? `(${fonte.unit})` : ''}
                      </dt>
                      <dd style={{ ...AT.dado, fontSize: '9px', color: A2.tintaMetadado, margin: 0, overflowWrap: 'anywhere' }}>
                        {fonte.sourceCitation}
                      </dd>
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
