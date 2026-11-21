// AtlasControles — o painel analítico do Atlas Mundial (Wave 35).
//
// Coloração, filtro por matriz dominante e rankings, todos derivados
// dos 12 campos que a CURSOR Wave 10 já ingeriu. Nenhuma ingestão
// nova, nenhum campo inventado.
//
// ── DUAS REGRAS QUE A INTERFACE PRECISA HONRAR ───────────────────────
// 1. Emissão total é DERIVADA (intensidade × geração), não medida. O
//    ranking dela carrega a fórmula na tela e um rótulo próprio — não
//    é apresentada com o mesmo peso de um valor que veio da fonte.
// 2. País sem dado nunca recebe cor de zero: a legenda declara a
//    hachura de ausência ao lado da escala, e o ranking reporta
//    quantos países ficaram de fora em vez de zerá-los.
//
// Vive na coluna lateral, que tem `pointerEvents: none` — cada bloco
// interativo reativa o ponteiro em si mesmo.

import { useMemo, useState } from 'react';
import { A, A2, AT, AS, AE } from '../../../design/alexandria-tokens';
import { fmtNum, nomePaisPt, type MundoAtlas } from '../../../lib/atlas/worldApi';
import {
  COR_FONTE,
  COR_SEM_DADO,
  METRICAS,
  amostrasDaEscala,
  contarPorDominante,
  metricaPorChave,
  rankearPor,
  type ChaveFonte,
  type ChaveMetrica,
  type FiltroFonte,
  type ModoCor,
} from '../../../lib/atlas/atlasDerivacoes';
import { CalloutDadosMedidos } from './CalloutDadosMedidos';

interface AtlasControlesProps {
  mundo: MundoAtlas;
  modoCor: ModoCor;
  aoMudarModoCor: (m: ModoCor) => void;
  filtro: FiltroFonte;
  aoMudarFiltro: (f: FiltroFonte) => void;
  /** Clicar num país do ranking voa até ele — reusa o mesmo mecanismo
   *  do globo e da busca, não duplica seleção. */
  aoEscolherPais?: (iso: string) => void;
}

const MODOS: ReadonlyArray<{ chave: ModoCor; rotulo: string }> = [
  { chave: 'nenhum', rotulo: 'Nenhuma' },
  { chave: 'matriz', rotulo: 'Matriz dominante' },
  { chave: 'intensidade', rotulo: 'Intensidade de carbono' },
  { chave: 'renovavel', rotulo: 'Participação renovável' },
];

const FONTES: ReadonlyArray<{ chave: ChaveFonte; rotulo: string }> = [
  { chave: 'fossilPct', rotulo: 'Fóssil' },
  { chave: 'hydroPct', rotulo: 'Hidráulica' },
  { chave: 'nuclearPct', rotulo: 'Nuclear' },
  { chave: 'windPct', rotulo: 'Eólica' },
  { chave: 'solarPct', rotulo: 'Solar' },
  { chave: 'biofuelPct', rotulo: 'Biocombustível' },
  { chave: 'otherRenewablesExcBiofuelPct', rotulo: 'Outras renováveis' },
];

function Rotulo({ texto }: { texto: string }) {
  return (
    <span style={{ ...AT.rotulo, fontSize: '8px', letterSpacing: '0.13em', color: A2.tintaMetadado }}>
      {texto}
    </span>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: AS.sm,
        borderTop: `1px solid ${A.fioSobreCreme}`,
        paddingTop: AS.sm,
        pointerEvents: 'auto',
      }}
    >
      <Rotulo texto={titulo} />
      {children}
    </div>
  );
}

/** Botão de escolha — fio embaixo quando ativo, o idioma de estado do
 *  sistema. Nunca preenchimento sólido. */
function Opcao({
  rotulo,
  ativo,
  aoClicar,
  contagem,
  amostra,
}: {
  rotulo: string;
  ativo: boolean;
  aoClicar: () => void;
  contagem?: number;
  amostra?: string;
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: AS.sm,
        width: '100%',
        padding: `3px 0`,
        background: 'none',
        border: 'none',
        borderBottom: ativo ? `1px solid ${A.terracota}` : '1px solid transparent',
        cursor: 'pointer',
        textAlign: 'left',
        transition: `border-color ${AE.estado} ${AE.easing}`,
      }}
      aria-pressed={ativo}
    >
      {amostra !== undefined && (
        <span
          aria-hidden="true"
          style={{ width: '9px', height: '9px', background: amostra, border: `1px solid ${A.fioSobreCreme}`, flex: 'none' }}
        />
      )}
      <span
        style={{
          ...AT.dado,
          fontSize: '12px',
          flex: 1,
          color: ativo ? A.tintaSobreCreme : A.tintaSuave,
        }}
      >
        {rotulo}
      </span>
      {contagem !== undefined && (
        <span style={{ ...AT.dado, fontSize: '10px', color: contagem === 0 ? A2.tintaMetadado : A.tintaSuave }}>
          {contagem}
        </span>
      )}
    </button>
  );
}

export function AtlasControles({
  mundo,
  modoCor,
  aoMudarModoCor,
  filtro,
  aoMudarFiltro,
  aoEscolherPais,
}: AtlasControlesProps) {
  const [metricaRank, setMetricaRank] = useState<ChaveMetrica>('geracao');

  const paises = useMemo(() => [...mundo.porIso.values()], [mundo]);
  /** Nome em pt-BR — o mesmo do tooltip, do perfil e do comparador.
   *  Sem isto o ranking diria "United States" numa interface que em
   *  todo o resto diz "Estados Unidos". */
  const nomePt = useMemo(() => {
    const porIso = new Map(
      mundo.features
        .filter((f) => f.properties.a3 !== null)
        .map((f) => [f.properties.a3 as string, f.properties]),
    );
    return (iso: string, doBackend: string) => {
      const props = porIso.get(iso);
      return props ? nomePaisPt(props, doBackend) : doBackend;
    };
  }, [mundo]);
  const contagens = useMemo(() => contarPorDominante(paises), [paises]);
  const ranking = useMemo(() => rankearPor(paises, metricaRank, 8), [paises, metricaRank]);
  const metrica = metricaPorChave(metricaRank);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: AS.md }}>
      {/* ── coloração ────────────────────────────────────────────── */}
      <Secao titulo="Colorir o globo por">
        {MODOS.map((m) => (
          <Opcao
            key={m.chave}
            rotulo={m.rotulo}
            ativo={modoCor === m.chave}
            aoClicar={() => aoMudarModoCor(m.chave)}
          />
        ))}

        {/* Legenda da escala — derivada da MESMA função que colore o
            globo, então legenda e mapa nunca divergem. */}
        {(modoCor === 'intensidade' || modoCor === 'renovavel') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: AS.xs }}>
            <div style={{ display: 'flex', height: '8px' }}>
              {amostrasDaEscala(modoCor).map((a) => (
                <span key={a.rotulo} style={{ flex: 1, background: a.cor }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ ...AT.dado, fontSize: '9px', color: A2.tintaMetadado }}>
                {amostrasDaEscala(modoCor)[0].rotulo}
              </span>
              <span style={{ ...AT.dado, fontSize: '9px', color: A2.tintaMetadado }}>
                {amostrasDaEscala(modoCor)[4].rotulo}
                {modoCor === 'intensidade' ? ' gCO₂/kWh' : ''}
              </span>
            </div>
          </div>
        )}

        {modoCor === 'matriz' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: `2px ${AS.sm}`, marginTop: AS.xs }}>
            {FONTES.filter((f) => contagens.porFonte[f.chave] > 0).map((f) => (
              <span key={f.chave} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span aria-hidden="true" style={{ width: '8px', height: '8px', background: COR_FONTE[f.chave] }} />
                <span style={{ ...AT.dado, fontSize: '9px', color: A.tintaSuave }}>{f.rotulo}</span>
              </span>
            ))}
          </div>
        )}

        {/* Ausência declarada ao lado da escala: sem isto, hachura de
            "não declara" seria lida como extremo frio da rampa. */}
        {modoCor !== 'nenhum' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
            <span
              aria-hidden="true"
              style={{ width: '8px', height: '8px', background: COR_SEM_DADO, border: `1px dashed ${A.fioSobreCreme}` }}
            />
            <span style={{ ...AT.dado, fontSize: '9px', color: A2.tintaMetadado }}>
              sem dado — não é zero
            </span>
          </span>
        )}
      </Secao>

      {/* ── filtro por matriz dominante ──────────────────────────── */}
      <Secao titulo="Filtrar por matriz dominante">
        <Opcao rotulo="Todos" ativo={filtro === null} aoClicar={() => aoMudarFiltro(null)} contagem={paises.length} />
        {FONTES.map((f) => (
          <Opcao
            key={f.chave}
            rotulo={f.rotulo}
            ativo={filtro === f.chave}
            aoClicar={() => aoMudarFiltro(filtro === f.chave ? null : f.chave)}
            contagem={contagens.porFonte[f.chave]}
            amostra={COR_FONTE[f.chave]}
          />
        ))}
        <span style={{ ...AT.dado, fontSize: '9px', lineHeight: 1.5, color: A2.tintaMetadado }}>
          {contagens.semMatriz} países não declaram matriz. País filtrado
          fora fica esmaecido, não some — o mapa continua sendo mapa.
        </span>
      </Secao>

      {/* ── rankings ─────────────────────────────────────────────── */}
      <Secao titulo="Ranking">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {METRICAS.map((m) => (
            <Opcao
              key={m.chave}
              rotulo={m.rotulo}
              ativo={metricaRank === m.chave}
              aoClicar={() => setMetricaRank(m.chave)}
            />
          ))}
        </div>

        {/* Distinção medido × analítico — substitui ◆ Número derivado
            (Wave 38). Sempre visível; a fórmula entra só quando a
            métrica ativa é derivada. */}
        <CalloutDadosMedidos formula={metrica.derivada ? metrica.formula : undefined} />

        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
          {ranking.linhas.map((l) => (
            <li key={l.pais.isoCode}>
              <button
                type="button"
                onClick={() => aoEscolherPais?.(l.pais.isoCode)}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: AS.sm,
                  width: '100%',
                  padding: '2px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: `1px solid ${A2.fioClaroSobreCreme}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ ...AT.dado, fontSize: '9px', color: A2.tintaMetadado, width: '12px' }}>
                  {l.posicao}
                </span>
                <span style={{ ...AT.dado, fontSize: '11px', flex: 1, color: A.tintaSobreCreme }}>
                  {nomePt(l.pais.isoCode, l.pais.countryName)}
                </span>
                <span style={{ ...AT.dado, fontSize: '11px', color: A.tintaSuave, whiteSpace: 'nowrap' }}>
                  {fmtNum(l.valor, metrica.casas)}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <span style={{ ...AT.dado, fontSize: '9px', color: A2.tintaMetadado }}>
          {metrica.unidade}
          {ranking.semDado > 0
            ? ` · ${ranking.semDado} ${ranking.semDado === 1 ? 'país fica de fora por não declarar' : 'países ficam de fora por não declararem'} o campo`
            : ' · todos os países declaram este campo'}
        </span>
      </Secao>
    </div>
  );
}

export default AtlasControles;
