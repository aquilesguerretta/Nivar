/**
 * An authored, deterministic fixture. These observations are NOT measurements,
 * forecasts, market prices, or data supplied by ONS / CCEE. Geometry has its
 * separate, real provenance in lib/geo/brasil-outline.ts.
 */
export type RegionId = "norte" | "nordeste" | "sudesteCentroOeste" | "sul";
export type MetricId = "price" | "load" | "storage";
export type PeriodId = "24h" | "7d" | "30d";

export const SAMPLE_VERSION = "NVR-DEMO-2026.09.10-v1";
export const SAMPLE_END = "2026-09-10";

export const REGIONS: {
  id: RegionId;
  short: string;
  name: string;
  code: string;
}[] = [
  { id: "norte", short: "Norte", name: "Norte", code: "N" },
  { id: "nordeste", short: "Nordeste", name: "Nordeste", code: "NE" },
  {
    id: "sudesteCentroOeste",
    short: "Sudeste / C. Oeste",
    name: "Sudeste / Centro-Oeste",
    code: "SE/CO",
  },
  { id: "sul", short: "Sul", name: "Sul", code: "S" },
];

export const METRICS: Record<
  MetricId,
  {
    label: string;
    longLabel: string;
    unit: string;
    decimals: number;
    explanation: string;
  }
> = {
  price: {
    label: "Preço",
    longLabel: "Preço de referência simulado",
    unit: "R$/MWh",
    decimals: 2,
    explanation:
      "Trajetória sintética em R$/MWh. Não representa PLD, cotação executável nem previsão.",
  },
  load: {
    label: "Carga",
    longLabel: "Carga simulada",
    unit: "GW",
    decimals: 1,
    explanation:
      "Perfil sintético de carga, em gigawatts. Não representa uma medição do SIN.",
  },
  storage: {
    label: "Reservas",
    longLabel: "Armazenamento simulado",
    unit: "%",
    decimals: 1,
    explanation:
      "Percentual sintético de armazenamento. Não representa EAR ou medição de reservatórios.",
  },
};

const profiles = {
  price: [
    114, 108, 103, 101, 105, 111, 128, 146, 157, 151, 148, 154, 166, 158, 149,
    154, 170, 195, 218, 231, 222, 205, 186, 172,
  ],
  load: [
    47.2, 45.8, 44.6, 44.1, 45, 47.5, 51.4, 54.9, 57.6, 59.3, 60.1, 60.7, 59.8,
    60.4, 61.2, 62.6, 63.7, 66.2, 68.1, 67.4, 64.9, 61.6, 56.8, 52.4,
  ],
  storage: [
    61.7, 61.7, 61.6, 61.6, 61.6, 61.5, 61.5, 61.5, 61.4, 61.4, 61.4, 61.3,
    61.3, 61.3, 61.3, 61.2, 61.2, 61.2, 61.1, 61.1, 61, 61, 61, 60.9,
  ],
};

const dailyPrice = [
  96, 102, 98, 111, 120, 117, 114, 108, 116, 132, 128, 145, 149, 136, 132, 141,
  152, 145, 138, 147, 153, 162, 166, 158, 154, 161, 178, 190, 181, 172,
];
const dailyLoad = [
  48.3, 49.2, 47.8, 50.3, 51.1, 49.8, 46.3, 47.6, 51.2, 52.6, 50.8, 52.2, 53.1,
  48.5, 47.9, 51.4, 52.8, 51.2, 53.3, 54.1, 49.4, 48.2, 52.6, 53.4, 54.7, 55.8,
  54.2, 51.3, 50.2, 52.4,
];
const dailyStorage = [
  65.2, 65.1, 65.3, 65.2, 65, 64.7, 64.4, 64.5, 64.3, 64.1, 64, 64.2, 64, 63.8,
  63.5, 63.4, 63.1, 63.3, 63, 62.8, 62.6, 62.5, 62.3, 62.2, 62, 61.8, 61.6,
  61.4, 61.1, 60.9,
];

const adjustments: Record<
  RegionId,
  Record<MetricId, [number, number, number]>
> = {
  sudesteCentroOeste: { price: [1, 0, 0], load: [1, 0, 0], storage: [1, 0, 0] },
  norte: {
    price: [0.66, 8, 5],
    load: [0.17, 0.1, 0.5],
    storage: [0.63, 32, 0.3],
  },
  nordeste: {
    price: [0.72, -9, -8],
    load: [0.25, 0.8, 1.3],
    storage: [0.84, 17, 0.5],
  },
  sul: {
    price: [1.04, 6, 6],
    load: [0.25, 1.6, -0.8],
    storage: [0.73, 32, -0.4],
  },
};

export interface Observation {
  index: number;
  label: string;
  timestamp: string;
  value: number;
}

export function getSeries(
  region: RegionId,
  period: PeriodId,
  metric: MetricId,
): Observation[] {
  const daily =
    metric === "price"
      ? dailyPrice
      : metric === "load"
        ? dailyLoad
        : dailyStorage;
  const values =
    period === "24h"
      ? profiles[metric]
      : period === "7d"
        ? daily.slice(-7)
        : daily;
  const [scale, offset, amplitude] = adjustments[region][metric];
  return values.map((v, index) => {
    const dayOffset = period === "24h" ? 0 : values.length - 1 - index;
    const date = new Date(`${SAMPLE_END}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() - dayOffset);
    if (period === "24h") date.setUTCHours(index);
    // Preserve identical observations when a daily window is narrowed to 7d.
    const profileIndex =
      period === "24h" ? index : daily.length - values.length + index;
    const value =
      v * scale + offset + Math.sin(profileIndex * 0.68) * amplitude;
    return {
      index,
      label:
        period === "24h"
          ? `${String(index).padStart(2, "0")}h`
          : `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
      timestamp:
        period === "24h"
          ? `${date.toISOString().slice(0, 13)}:00:00-03:00`
          : date.toISOString().slice(0, 10),
      value: Number(value.toFixed(METRICS[metric].decimals)),
    };
  });
}

export function formatValue(value: number, metric: MetricId) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: METRICS[metric].decimals,
    maximumFractionDigits: METRICS[metric].decimals,
  }).format(value);
}

export function describeSeries(series: Observation[], metric: MetricId) {
  const first = series[0].value;
  const last = series[series.length - 1].value;
  const min = Math.min(...series.map((d) => d.value));
  const max = Math.max(...series.map((d) => d.value));
  const change = last - first;
  const relativeChange = first === 0 ? null : (change / first) * 100;
  const delta =
    metric === "storage"
      ? `${change > 0 ? "+" : ""}${change.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} p.p.`
      : `${change > 0 ? "+" : ""}${relativeChange?.toLocaleString("pt-BR", { maximumFractionDigits: 1 }) ?? "—"}%`;
  return { first, last, min, max, change, relativeChange, delta };
}

export const SOURCE_RECORDS = [
  {
    id: "amostra",
    kind: "DADOS DEMONSTRATIVOS",
    title: "Uma base para explorar o produto",
    text: `Conjunto sintético NIVAR ${SAMPLE_VERSION}. Perfis horários e diários fixos, definidos no código, com ajustes determinísticos por submercado. Nenhum número foi extraído de uma fonte oficial.`,
    detail:
      "Janela ilustrativa: 12/08 a 10/09/2026. 24h mostra observações horárias em 10/09; 7d e 30d mostram observações diárias. Frequências distintas: o diário não é a média calculada do horário. Os intervalos não são intercambiáveis para agregação.",
  },
  {
    id: "metodo",
    kind: "MÉTODO",
    title: "Como esta leitura é calculada",
    text: "O valor em destaque é a última observação. A variação compara a última e a primeira observação da janela selecionada. Preço e carga usam variação percentual; reservas usam pontos percentuais. Mínimo e máximo pertencem à mesma seleção.",
    detail:
      "A linha tracejada fixa a primeira observação. A curva liga pontos sintéticos, sem suavização que sugira observações intermediárias. Não há previsão, interpolação estatística, score de risco ou recomendação automática.",
  },
  {
    id: "limites",
    kind: "LIMITES E CONTRADITÓRIO",
    title: "Coincidência não demonstra causa",
    text: "As marcações na série e as notas do caderno são situações ilustrativas, escritas para demonstrar o exame de hipóteses. A seleção de um evento localiza uma observação; não comprova uma relação causal.",
    detail:
      "Faltam dados reais de despacho, intercâmbio, disponibilidade, meteorologia e contratos. Esta tela não deve orientar uma decisão operacional ou comercial.",
  },
  {
    id: "geografia",
    kind: "GEOGRAFIA DOCUMENTADA",
    title: "Contorno do Brasil e submercados",
    text: "Geometria existente do projeto: malha IBGE v3, qualidade mínima, capturada em 26/07/2026. Agregação de UFs por submercado, projeção Web Mercator e coordenadas quantizadas em 0,1 unidade.",
    detail:
      "Esta agregação local de UFs inclui Acre e Rondônia em SE/CO e deixa Roraima sem atribuição. Não certifica os limites elétricos ou comerciais atuais: o ONS registra a interligação de Roraima ao SIN em setembro de 2025. A seleção espacial usa valores sintéticos, com legenda própria, quando ativada.",
    href: "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&qualidade=minima",
  },
  {
    id: "conexao",
    kind: "DISPONIBILIDADE",
    title: "Conexão de dados ainda não disponível",
    text: "Não há uma API de dados do mercado brasileiro conectada a esta versão. O modo “Fonte indisponível” exibe a ausência sem reutilizar a amostra como se fosse um dado real.",
    detail:
      "Não existe atualização automática, SLA de frescor, integração ONS / CCEE ou alerta operacional ativo. O horário da amostra é fixo e não representa o momento de uma ingestão.",
  },
];

export function sampleCsv(
  region: RegionId,
  period: PeriodId,
  metric: MetricId,
) {
  const regionName = REGIONS.find((r) => r.id === region)!.name;
  const rows = getSeries(region, period, metric).map((d) => [
    SAMPLE_VERSION,
    "DEMONSTRACAO_SINTETICA",
    regionName,
    period,
    METRICS[metric].longLabel,
    d.timestamp,
    d.value,
    METRICS[metric].unit,
  ]);
  const escape = (value: string | number) =>
    `"${String(value).replace(/"/g, '""')}"`;
  return (
    "\uFEFF" +
    [
      [
        "versao",
        "classificacao",
        "submercado",
        "janela",
        "metrica",
        "referencia",
        "valor",
        "unidade",
      ],
      ...rows,
    ]
      .map((row) => row.map(escape).join(";"))
      .join("\r\n")
  );
}
