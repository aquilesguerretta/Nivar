// src/lib/atlas/worldApi.ts
// Alexandria — Atlas Mundial (Wave 27). Camada de dado: busca os 188
// perfis reais do backend (CURSOR Wave 10) e os junta com a geometria
// de fronteira da Natural Earth 110m, indexados por ISO alpha-3.
//
// ── PROCEDÊNCIA DA GEOMETRIA ─────────────────────────────────────────
// public/alexandria/geo/world-110m.json é cópia byte-idêntica
// (MD5 0aa0a4363768f1e281ef8b92100c2592) de
// https://unpkg.com/world-atlas@2.0.2/countries-110m.json — a
// distribuição TopoJSON canônica da Natural Earth 110m. 177 geometrias;
// 174 com id ISO 3166-1 NUMÉRICO; nenhuma propriedade alpha-3 no
// arquivo (medido, não presumido). As 3 sem id são Kosovo, Chipre do
// Norte e Somalilândia — entidades sem código ISO próprio.
//
// ── A TABELA NUMÉRICO → [ALPHA-3, ALPHA-2] ───────────────────────────
// O backend fala alpha-3; o TopoJSON fala numérico; o Intl.DisplayNames
// do browser (nome do país em pt-BR) SÓ resolve alpha-2 — medido no
// Chrome: .of('076') devolve '076', .of('BR') devolve 'Brasil'. As 174
// entradas abaixo foram DERIVADAS das propriedades do GeoJSON Natural
// Earth 110m (ISO_N3 → ISO_A3/ISO_A2, com ADM0_A3 quando ISO_A3 = -99,
// o defeito conhecido da NE), não digitadas de memória. Duas correções
// manuais, ambas atribuições ISO 3166-1 padrão: '250': FRA/FR (a NE
// marca o ISO_A2 da França como -99) e '578': NOR/NO (a NE marca até o
// ISO_N3 da Noruega como -99, mas o world-atlas carrega o id 578).
//
// ── DIVERGÊNCIA TOPOJSON × BACKEND, MEDIDA ───────────────────────────
// 8 polígonos com ISO sem dado no backend (TWN GRL ESH PRI NCL FLK ATF
// ATA — fora do critério "membro da ONU" da Wave 10) + 3 sem ISO.
// Todos continuam desenhados; o hover mostra ausência honesta.
// 22 países do backend SEM polígono a 110m — micro-Estados insulares
// (SGP MLT BHR MDV BRB…): têm perfil, não têm geometria nesta
// resolução. Limitação real do 110m, registrada, não escondida.

import { feature as topoFeature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, Geometry } from 'geojson';
import { browserApiUrl } from '@/lib/backendBase';

// ─────────────────────────────────────────────────────────────────────
// Tipos — espelho do contrato real (docs/v2-backend-contract.md § Wave
// 10). Toda métrica é anulável: o backend usa null para "fonte não
// declara", nunca zero inventado.
// ─────────────────────────────────────────────────────────────────────

export interface MatrizGeracao {
  fossilPct: number | null;
  nuclearPct: number | null;
  hydroPct: number | null;
  windPct: number | null;
  solarPct: number | null;
  biofuelPct: number | null;
  otherRenewablesExcBiofuelPct: number | null;
}

export interface PaisResumo {
  isoCode: string;
  countryName: string;
  year: number;
  population: number | null;
  electricityGenerationTwh: number | null;
  renewablesShareElecPct: number | null;
  carbonIntensityElecGco2PerKwh: number | null;
  energyPerCapitaKwh: number | null;
  fuelMix: MatrizGeracao;
}

export interface FonteCampo {
  unit: string;
  sourceCitation: string;
}

/** Perfil completo: mesmo shape do resumo + citação por campo.
 *  As chaves de fieldSources são os nomes snake_case do OWID —
 *  deliberado no backend, rastreável ao codebook sem tabela de
 *  tradução. */
export interface PaisPerfil extends PaisResumo {
  fieldSources: Record<string, FonteCampo>;
}

interface EnvelopeMeta {
  timestamp: string;
  source: string;
  count?: number;
  year?: string;
}

interface Envelope<T> {
  meta: EnvelopeMeta;
  data: T;
  summary: string;
}

/** Propriedades anotadas em cada feature na junção. */
export interface PaisFeatureProps {
  name: string;      // nome do TopoJSON (inglês, curto)
  a3: string | null; // alpha-3 via tabela; null = entidade sem ISO
  a2: string | null; // alpha-2 — é o que o Intl.DisplayNames aceita
  n3: string | null; // id numérico original do TopoJSON
}

export type PaisFeature = Feature<Geometry, PaisFeatureProps>;

export interface MundoAtlas {
  features: PaisFeature[];
  /** Índice O(1) alpha-3 → perfil resumido. Nunca busca linear no
   *  array a cada movimento de mouse. */
  porIso: Map<string, PaisResumo>;
  meta: EnvelopeMeta;
}

// ─────────────────────────────────────────────────────────────────────
// Correspondência ISO numérico → [alpha-3, alpha-2] (procedência no
// cabeçalho).
// ─────────────────────────────────────────────────────────────────────

const N3_ISO: Record<string, readonly [string, string]> = {
  '004': ['AFG', 'AF'], '008': ['ALB', 'AL'], '010': ['ATA', 'AQ'], '012': ['DZA', 'DZ'],
  '024': ['AGO', 'AO'], '031': ['AZE', 'AZ'], '032': ['ARG', 'AR'], '036': ['AUS', 'AU'],
  '040': ['AUT', 'AT'], '044': ['BHS', 'BS'], '050': ['BGD', 'BD'], '051': ['ARM', 'AM'],
  '056': ['BEL', 'BE'], '064': ['BTN', 'BT'], '068': ['BOL', 'BO'], '070': ['BIH', 'BA'],
  '072': ['BWA', 'BW'], '076': ['BRA', 'BR'], '084': ['BLZ', 'BZ'], '090': ['SLB', 'SB'],
  '096': ['BRN', 'BN'], '100': ['BGR', 'BG'], '104': ['MMR', 'MM'], '108': ['BDI', 'BI'],
  '112': ['BLR', 'BY'], '116': ['KHM', 'KH'], '120': ['CMR', 'CM'], '124': ['CAN', 'CA'],
  '140': ['CAF', 'CF'], '144': ['LKA', 'LK'], '148': ['TCD', 'TD'], '152': ['CHL', 'CL'],
  '156': ['CHN', 'CN'], '158': ['TWN', 'TW'], '170': ['COL', 'CO'], '178': ['COG', 'CG'],
  '180': ['COD', 'CD'], '188': ['CRI', 'CR'], '191': ['HRV', 'HR'], '192': ['CUB', 'CU'],
  '196': ['CYP', 'CY'], '203': ['CZE', 'CZ'], '204': ['BEN', 'BJ'], '208': ['DNK', 'DK'],
  '214': ['DOM', 'DO'], '218': ['ECU', 'EC'], '222': ['SLV', 'SV'], '226': ['GNQ', 'GQ'],
  '231': ['ETH', 'ET'], '232': ['ERI', 'ER'], '233': ['EST', 'EE'], '238': ['FLK', 'FK'],
  '242': ['FJI', 'FJ'], '246': ['FIN', 'FI'], '250': ['FRA', 'FR'], '260': ['ATF', 'TF'],
  '262': ['DJI', 'DJ'], '266': ['GAB', 'GA'], '268': ['GEO', 'GE'], '270': ['GMB', 'GM'],
  '275': ['PSE', 'PS'], '276': ['DEU', 'DE'], '288': ['GHA', 'GH'], '300': ['GRC', 'GR'],
  '304': ['GRL', 'GL'], '320': ['GTM', 'GT'], '324': ['GIN', 'GN'], '328': ['GUY', 'GY'],
  '332': ['HTI', 'HT'], '340': ['HND', 'HN'], '348': ['HUN', 'HU'], '352': ['ISL', 'IS'],
  '356': ['IND', 'IN'], '360': ['IDN', 'ID'], '364': ['IRN', 'IR'], '368': ['IRQ', 'IQ'],
  '372': ['IRL', 'IE'], '376': ['ISR', 'IL'], '380': ['ITA', 'IT'], '384': ['CIV', 'CI'],
  '388': ['JAM', 'JM'], '392': ['JPN', 'JP'], '398': ['KAZ', 'KZ'], '400': ['JOR', 'JO'],
  '404': ['KEN', 'KE'], '408': ['PRK', 'KP'], '410': ['KOR', 'KR'], '414': ['KWT', 'KW'],
  '417': ['KGZ', 'KG'], '418': ['LAO', 'LA'], '422': ['LBN', 'LB'], '426': ['LSO', 'LS'],
  '428': ['LVA', 'LV'], '430': ['LBR', 'LR'], '434': ['LBY', 'LY'], '440': ['LTU', 'LT'],
  '442': ['LUX', 'LU'], '450': ['MDG', 'MG'], '454': ['MWI', 'MW'], '458': ['MYS', 'MY'],
  '466': ['MLI', 'ML'], '478': ['MRT', 'MR'], '484': ['MEX', 'MX'], '496': ['MNG', 'MN'],
  '498': ['MDA', 'MD'], '499': ['MNE', 'ME'], '504': ['MAR', 'MA'], '508': ['MOZ', 'MZ'],
  '512': ['OMN', 'OM'], '516': ['NAM', 'NA'], '524': ['NPL', 'NP'], '528': ['NLD', 'NL'],
  '540': ['NCL', 'NC'], '548': ['VUT', 'VU'], '554': ['NZL', 'NZ'], '558': ['NIC', 'NI'],
  '562': ['NER', 'NE'], '566': ['NGA', 'NG'], '578': ['NOR', 'NO'], '586': ['PAK', 'PK'],
  '591': ['PAN', 'PA'], '598': ['PNG', 'PG'], '600': ['PRY', 'PY'], '604': ['PER', 'PE'],
  '608': ['PHL', 'PH'], '616': ['POL', 'PL'], '620': ['PRT', 'PT'], '624': ['GNB', 'GW'],
  '626': ['TLS', 'TL'], '630': ['PRI', 'PR'], '634': ['QAT', 'QA'], '642': ['ROU', 'RO'],
  '643': ['RUS', 'RU'], '646': ['RWA', 'RW'], '682': ['SAU', 'SA'], '686': ['SEN', 'SN'],
  '688': ['SRB', 'RS'], '694': ['SLE', 'SL'], '703': ['SVK', 'SK'], '704': ['VNM', 'VN'],
  '705': ['SVN', 'SI'], '706': ['SOM', 'SO'], '710': ['ZAF', 'ZA'], '716': ['ZWE', 'ZW'],
  '724': ['ESP', 'ES'], '728': ['SSD', 'SS'], '729': ['SDN', 'SD'], '732': ['ESH', 'EH'],
  '740': ['SUR', 'SR'], '748': ['SWZ', 'SZ'], '752': ['SWE', 'SE'], '756': ['CHE', 'CH'],
  '760': ['SYR', 'SY'], '762': ['TJK', 'TJ'], '764': ['THA', 'TH'], '768': ['TGO', 'TG'],
  '780': ['TTO', 'TT'], '784': ['ARE', 'AE'], '788': ['TUN', 'TN'], '792': ['TUR', 'TR'],
  '795': ['TKM', 'TM'], '800': ['UGA', 'UG'], '804': ['UKR', 'UA'], '807': ['MKD', 'MK'],
  '818': ['EGY', 'EG'], '826': ['GBR', 'GB'], '834': ['TZA', 'TZ'], '840': ['USA', 'US'],
  '854': ['BFA', 'BF'], '858': ['URY', 'UY'], '860': ['UZB', 'UZ'], '862': ['VEN', 'VE'],
  '887': ['YEM', 'YE'], '894': ['ZMB', 'ZM'],
};

// ─────────────────────────────────────────────────────────────────────
// Fetch — perfis passam pelo `/api` same-origin (Vite em desenvolvimento,
// rewrite da Vercel em produção). O TopoJSON continua relativo porque é
// um asset empacotado no mesmo deploy.
// ─────────────────────────────────────────────────────────────────────

async function buscarJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`${url} respondeu ${res.status}`);
  }
  return (await res.json()) as T;
}

export function buscarPaisesMundo(signal?: AbortSignal): Promise<Envelope<PaisResumo[]>> {
  return buscarJson<Envelope<PaisResumo[]>>(
    browserApiUrl('/api/atlas/world/countries'),
    signal,
  );
}

export function buscarPerfilPais(iso: string, signal?: AbortSignal): Promise<Envelope<PaisPerfil>> {
  return buscarJson<Envelope<PaisPerfil>>(
    browserApiUrl(`/api/atlas/world/countries/${encodeURIComponent(iso)}`),
    signal,
  );
}

// ─────────────────────────────────────────────────────────────────────
// Junção geometria × dado — uma vez por sessão, com cache de módulo.
// ─────────────────────────────────────────────────────────────────────

type TopoMundo = Topology<{ countries: GeometryCollection<{ name: string }> }>;

let cacheMundo: Promise<MundoAtlas> | null = null;

async function montarMundo(): Promise<MundoAtlas> {
  const [topo, envelope] = await Promise.all([
    buscarJson<TopoMundo>('/alexandria/geo/world-110m.json'),
    buscarPaisesMundo(),
  ]);

  const fc = topoFeature(topo, topo.objects.countries);
  const features: PaisFeature[] = fc.features.map((f) => {
    const n3 = f.id !== undefined ? String(f.id) : null;
    const iso = n3 ? N3_ISO[n3] : undefined;
    return {
      ...f,
      properties: {
        name: f.properties?.name ?? '—',
        a3: iso?.[0] ?? null,
        a2: iso?.[1] ?? null,
        n3,
      },
    };
  });

  const porIso = new Map<string, PaisResumo>();
  for (const pais of envelope.data) {
    porIso.set(pais.isoCode, pais);
  }

  return { features, porIso, meta: envelope.meta };
}

/** Carrega TopoJSON + os 188 perfis em paralelo e devolve a junção.
 *  Cache de módulo: remontar a página não refaz nenhuma das duas
 *  buscas. Falha limpa o cache para permitir nova tentativa. */
export function carregarMundo(): Promise<MundoAtlas> {
  if (!cacheMundo) {
    cacheMundo = montarMundo().catch((err) => {
      cacheMundo = null;
      throw err;
    });
  }
  return cacheMundo;
}

// ─────────────────────────────────────────────────────────────────────
// Derivações de apresentação — calculadas do dado real, nunca
// inventadas.
// ─────────────────────────────────────────────────────────────────────

/** Rótulos pt-BR da matriz + a chave snake_case do OWID de cada campo,
 *  para o perfil citar a fonte exata via fieldSources. */
export const CAMPOS_MATRIZ: ReadonlyArray<{
  chave: keyof MatrizGeracao;
  rotulo: string;
  fonteCampo: string;
}> = [
  { chave: 'fossilPct', rotulo: 'Fóssil', fonteCampo: 'fossil_share_elec' },
  { chave: 'nuclearPct', rotulo: 'Nuclear', fonteCampo: 'nuclear_share_elec' },
  { chave: 'hydroPct', rotulo: 'Hidráulica', fonteCampo: 'hydro_share_elec' },
  { chave: 'windPct', rotulo: 'Eólica', fonteCampo: 'wind_share_elec' },
  { chave: 'solarPct', rotulo: 'Solar', fonteCampo: 'solar_share_elec' },
  { chave: 'biofuelPct', rotulo: 'Biocombustível', fonteCampo: 'biofuel_share_elec' },
  {
    chave: 'otherRenewablesExcBiofuelPct',
    rotulo: 'Outras renováveis',
    fonteCampo: 'other_renewables_share_elec_exc_biofuel',
  },
];

/** Chave snake_case do OWID dos campos fora da matriz. */
export const FONTE_CAMPO: Record<string, string> = {
  population: 'population',
  electricityGenerationTwh: 'electricity_generation',
  renewablesShareElecPct: 'renewables_share_elec',
  carbonIntensityElecGco2PerKwh: 'carbon_intensity_elec',
  energyPerCapitaKwh: 'energy_per_capita',
};

/** Maior participação entre os campos da matriz — null quando TODOS
 *  são null (nunca inventa dominância a partir de ausência). */
export function combustivelDominante(
  mix: MatrizGeracao,
): { rotulo: string; pct: number } | null {
  let melhor: { rotulo: string; pct: number } | null = null;
  for (const campo of CAMPOS_MATRIZ) {
    const v = mix[campo.chave];
    if (v !== null && (melhor === null || v > melhor.pct)) {
      melhor = { rotulo: campo.rotulo, pct: v };
    }
  }
  return melhor;
}

/** Nome do país em pt-BR via Intl.DisplayNames (CLDR do browser, dado
 *  padrão da plataforma — não é tradução inventada). Usa o ALPHA-2 da
 *  tabela: medido no Chrome, o código numérico M49 não resolve para
 *  país ('076' → '076'), só o alpha-2 ('BR' → 'Brasil'). Fallback:
 *  nome vindo do backend, depois o do TopoJSON. */
let displayNames: Intl.DisplayNames | null | undefined;

export function nomePaisPt(props: PaisFeatureProps, backendName?: string): string {
  if (displayNames === undefined) {
    try {
      displayNames = new Intl.DisplayNames(['pt-BR'], { type: 'region' });
    } catch {
      displayNames = null;
    }
  }
  if (displayNames && props.a2) {
    try {
      const nome = displayNames.of(props.a2);
      // Intl devolve o próprio código quando não conhece a região.
      if (nome && nome !== props.a2) return nome;
    } catch {
      /* código fora do padrão — cai no fallback */
    }
  }
  return backendName ?? props.name;
}

// ─────────────────────────────────────────────────────────────────────
// Formatação pt-BR.
// ─────────────────────────────────────────────────────────────────────

export function fmtPct(v: number | null, casas = 1): string {
  if (v === null) return '—';
  return `${v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`;
}

export function fmtNum(v: number | null, casas = 0): string {
  if (v === null) return '—';
  return v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
}
