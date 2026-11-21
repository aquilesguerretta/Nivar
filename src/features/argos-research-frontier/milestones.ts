import { tandem } from "./model.ts";
import type { EvidenceRef, Metric, Milestone, Observation, TestSetup } from "./model.ts";
import { evidence } from "./sources.ts";

const missingDates = { observedPeriod: null, knownOn: null };
const stc = (protocol: "stabilized-mpp" | "iv-sweep" | null, details: string): TestSetup =>
  ({ regime: "stc", spectrum: "AM1.5G", irradiance: 1000, temperature: 25, protocol, details });
const pce = (value: number, digits: number, uncertainty: number | null): Metric =>
  ({ kind: "pce", value, digits, uncertainty, denominator: "Potência luminosa incidente sobre a área declarada." });

const outdoorStudy = {
  id: "observation:frontier:nicosia-upper-layer-pce-loss",
  subject: "device:frontier:nicosia-five-mini-tandems",
  knownOn: null,
  observedPeriod: "19 jan 2023 a 1 set 2024. A redução corresponde aos primeiros 12 meses.",
  authority: "research-team",
  reporter: "Norton et al. (imec e Universidade de Chipre)",
  measurer: "Equipe do estudo (imec e Universidade de Chipre)",
  area: { basis: "active", description: "4 cm² ativos por amostra. Encapsulamento externo de 10 × 10 cm." },
  setup: {
    regime: "outdoor",
    details: "Cinco amostras em Nicósia, voltadas ao sul a 35°. Mais de 210 dias de céu limpo selecionados ao longo de cerca de 20 meses. Cada circuito pôde ser medido separadamente.",
  },
  metrics: [{
    kind: "relative-pce-loss", value: 50, digits: 0, uncertainty: null,
    denominator: "PCE inicial do submódulo superior de perovskita. A redução é relativa e se refere ao subconjunto de observações de céu limpo.",
  }],
  limitations: "Estimativa aproximada. A campanha descreve desempenho do submódulo em um sítio. A produção anual do sistema (kWh) e a durabilidade em outros climas permanecem sem avaliação neste marco.",
} satisfies Omit<Observation, "publishedOn" | "version" | "evidence">;

export const milestones = [
  {
    id: "milestone:frontier:ise-oxford-prototype",
    title: "Módulo protótipo Fraunhofer ISE / Oxford PV",
    variant: tandem,
    reachedBy: "Resultado divulgado em 31 jan 2024",
    device: {
      id: "device:frontier:ise-oxford-60-cell-prototype", kind: "prototype-module", terminals: 2, silicon: null,
      description: "Módulo monofacial vidro–vidro montado pelo Fraunhofer ISE com 60 células M6 da Oxford PV, de 274,1 cm² cada.",
    },
    versions: [
      {
        id: "observation:frontier:ise-oxford-prototype-performance",
        subject: "device:frontier:ise-oxford-60-cell-prototype",
        ...missingDates, publishedOn: "2025-05-21", version: "2025-05-21", previousVersion: "2024-01-31",
        authority: "research-team", reporter: "Chojniak et al.", measurer: "CalLab do Fraunhofer ISE, instituição que também montou o protótipo",
        area: { basis: "active", description: "1,682 ± 0,015 m² de área ativa do módulo. Bordas inativas e barra central mascaradas." },
        setup: stc("stabilized-mpp", "Simulador LED de 26 canais ajustado à resposta espectral das junções. Potência determinada por rastreamento manual no ponto de máxima potência, com janela estabilizada de 300 s e correção para 25 °C."),
        metrics: [
          pce(25, 2, 0.83),
          { kind: "max-power", value: 421, digits: 0, uncertainty: 13, denominator: "Potência elétrica máxima do único módulo ensaiado." },
        ],
        limitations: "Dia do ensaio e qualificação comercial do modelo sem confirmação. A amostra única deixa a distribuição de desempenho de produção em aberto.",
        evidence: [evidence("document:frontier:chojniak-3928")],
      },
      {
        id: "observation:frontier:ise-oxford-prototype-performance",
        subject: "device:frontier:ise-oxford-60-cell-prototype",
        ...missingDates, publishedOn: "2024-01-31", version: "2024-01-31",
        authority: "project-announcement", reporter: "Fraunhofer ISE", measurer: "CalLab do Fraunhofer ISE",
        area: { basis: "designated-illumination", description: "Aproximadamente 1,68 m² de área de iluminação designada, conforme comunicado." },
        setup: null,
        metrics: [
          pce(25, 0, null),
          { kind: "max-power", value: 421, digits: 0, uncertainty: null, denominator: "Potência anunciada para um módulo protótipo." },
        ],
        limitations: "Nesta divulgação, o método completo e as incertezas permanecem sem detalhamento. O artigo posterior documenta o mesmo protótipo.",
        evidence: [evidence("document:frontier:ise-oxford-prototype")],
      },
    ],
    nextEvidence: "Ensaios rastreáveis de módulos de lotes representativos, com distribuição de potência, PCE estabilizada e área total declarada.",
  },
  {
    id: "milestone:frontier:nicosia-outdoor",
    title: "Minimódulos 4T em campo · Nicósia",
    variant: tandem,
    reachedBy: "Campanha de jan 2023 a set 2024",
    device: {
      id: "device:frontier:nicosia-five-mini-tandems", kind: "mini-tandem", terminals: 4, silicon: "TOPCon",
      description: "Cinco minimódulos. Cada amostra combina sete subcélulas superiores em série com uma célula inferior TOPCon bifacial, em circuitos separados.",
    },
    versions: [
      {
        ...outdoorStudy, publishedOn: "2026-06-25", version: "2026-06-25", previousVersion: "2024-09",
        evidence: [evidence("document:frontier:norton-zenodo")],
      },
      {
        ...outdoorStudy, publishedOn: "2024-09 (EU PVSEC, 23–27 set)", version: "2024-09",
        evidence: [evidence("document:frontier:norton-eu-pvsec")],
      },
    ],
    nextEvidence: "Séries de energia e meteorologia de módulos identificados, com controle colocalizado e retestes de potência em mais de um clima.",
  },
  {
    id: "milestone:frontier:ise-topcon-research",
    title: "Célula de pesquisa Fraunhofer ISE · TOPCon",
    variant: tandem,
    reachedBy: "Resultado publicado em 24 nov 2025",
    device: {
      id: "device:frontier:ise-topcon2-research-cell", kind: "research-cell", terminals: 2, silicon: "TOPCon",
      description: "Célula monolítica com contatos TOPCon nas duas faces do silício e textura de micropirâmides de dimensões industriais na face frontal.",
    },
    versions: [{
      id: "observation:frontier:ise-topcon2-cell-pce",
      subject: "device:frontier:ise-topcon2-research-cell",
      ...missingDates, publishedOn: "2025-11-24", version: "2025-11-24", authority: "research-team",
      reporter: "Hanser et al. (Fraunhofer ISE)", measurer: "Equipe experimental do Fraunhofer ISE",
      area: { basis: "nominal-active", description: "Região ativa nominal de 1 × 1 cm² da estrutura de ensaio." },
      setup: stc("iv-sweep", "Curva corrente–tensão em simulador calibrado pela resposta espectral das duas junções."),
      metrics: [pce(30.6, 1, null)],
      limitations: "Melhor amostra reportada pelos autores. Incerteza da PCE, dia do ensaio e certificado externo individual sem confirmação.",
      evidence: [
        evidence("document:frontier:hanser-202500835"),
      ],
    }],
    nextEvidence: "Módulos de lotes representativos com esse desenho, qualificação identificável e reavaliação da prontidão pela entidade competente.",
  },
  {
    id: "milestone:frontier:longi-esti-cell",
    title: "Célula de pesquisa LONGi · medição ESTI",
    variant: tandem,
    reachedBy: "Ensaio em fev 2026",
    device: {
      id: "device:frontier:longi-esti-feb-2026-cell", kind: "research-cell", terminals: 2, silicon: null,
      description: "Amostra de célula tandem de dois terminais fabricada pela LONGi.",
    },
    versions: [{
      id: "observation:frontier:longi-esti-cell-pce",
      subject: "device:frontier:longi-esti-feb-2026-cell",
      observedPeriod: "Fevereiro de 2026 (dia não informado)", knownOn: null,
      publishedOn: "2026-05-28", version: "2026-05-28", authority: "external-lab",
      reporter: "Green et al., Joule v68", measurer: "European Solar Test Installation (JRC-ESTI), laboratório distinto da LONGi",
      area: { basis: "designated-illumination", description: "0,9994 cm² de área de iluminação designada." },
      setup: stc(null, "Condições de referência reportadas na publicação. Protocolo individual de estabilização sem confirmação."),
      metrics: [pce(35.2, 1, 1.1)],
      limitations: "O valor caracteriza uma célula de pesquisa. Desempenho de módulo comercial, certificado individual assinado e série temporal bruta permanecem sem comprovação nesta evidência.",
      evidence: [evidence("document:frontier:green-v68")],
    }],
    nextEvidence: "Registro metrológico individual com rastreabilidade da amostra e protocolo. Para módulos comerciais, medições independentes de dispositivos dessa classe.",
  },
  {
    id: "milestone:frontier:saitama-hjt-demonstration",
    title: "Demonstração Kaneka–Saitama · HJT",
    variant: tandem,
    reachedBy: "Início documentado em mar 2026",
    device: {
      id: "device:frontier:saitama-hjt-field-system", kind: "field-system", terminals: null, silicon: "HJT",
      description: "Sistema externo com bateria na prefeitura de Saitama, Japão. Kaneka identifica silício de heterojunção (HJT) na camada inferior dos módulos.",
    },
    versions: [{
      id: "observation:frontier:saitama-demonstration-onset",
      subject: "device:frontier:saitama-hjt-field-system",
      observedPeriod: "Início em mar 2026, com apresentação em 18 mar", knownOn: null,
      publishedOn: "2026-03-27", version: "2026-03-27", authority: "host-and-issuer",
      reporter: "Prefeitura de Saitama (início); Kaneka (quantidade, arquitetura e dimensões)",
      measurer: null,
      area: { basis: "external-dimensions", description: "Cerca de 995 × 1.085 mm por módulo, segundo Kaneka. Área ativa para PCE desconhecida." },
      setup: { regime: "installation", details: "Instalação ao ar livre. Kaneka prevê avaliar geração e durabilidade até 26 mar 2027." },
      metrics: [{
        kind: "installed-module-count", value: 2, digits: 0, uncertainty: null,
        denominator: "Módulos previstos na instalação, conforme especificação da fabricante. A prefeitura confirma o início da demonstração.",
      }],
      limitations: "PCE independente desses módulos, protocolo completo, kWh anuais e avaliação final sem comprovação no registro.",
      evidence: [
        evidence("document:frontier:saitama-demonstration"),
        evidence("document:frontier:kaneka-demonstration"),
      ],
    }],
    nextEvidence: "Relatório identificado por instalação e período, com irradiância, energia medida, disponibilidade e reteste dos módulos.",
  },
] as const satisfies readonly Milestone[];

export const longiAnnouncement = {
  id: "claim:frontier:longi-july-2026-cell",
  subject: "device:frontier:longi-july-2026-announced-cell",
  summary: "Em 14 jul 2026, a LONGi anunciou 35,5% de PCE para uma célula tandem e afirmou que o teste foi certificado pela ESTI. Área, data do ensaio, incerteza e atestado da amostra seguem sem confirmação independente. A identidade da amostra permanece sem vínculo com a medição de fevereiro.",
  evidence: evidence("document:frontier:longi-july-claim"),
} as const;

export const readiness = {
  subject: milestones[2].device.id,
  milestone: milestones[2].id,
  level: 6,
  assessor: "IEA",
  publishedOn: "2026-02-17",
  evidence: evidence("document:frontier:iea-innovation-2026"),
} as const;

export const deployment = {
  subject: milestones[4].device.id,
  milestone: milestones[4].id,
  stage: "Demonstração",
  assessor: "NIVAR",
  assessedOn: "2026-11-18",
  evidence: milestones[4].versions[0].evidence[0],
} as const;

export const contextEvidence: EvidenceRef = evidence("document:frontier:doe-perovskite");
