// Keep only source metadata and original NIVAR summaries.
export const dossierCutoff = "2026-11-18";

const sources = {
  sec: ["Petrobras · SEC EDGAR", "Divulgação do emissor protocolada na SEC", "O protocolo na SEC não resolve os direitos sobre a expressão do emissor."],
  dou: ["Diário Oficial da União · via EPE", "Extrato oficial de instrumento público", "O extrato e os demais materiais da publicação têm escopos de reúso distintos."],
  anp: ["ANP", "Regulador de petróleo e gás no Brasil", "A reutilização de tabelas, bases e mapas depende de avaliação por recurso."],
  mme: ["Ministério de Minas e Energia", "Comunicado oficial do ministério", "A notícia institucional e o instrumento jurídico têm escopos de reúso distintos."],
  auction: ["Agência Petrobras", "Comunicado da adquirente", "Material editorial e imagens do emissor exigem avaliação própria."],
  ri: ["Petrobras · Relações com Investidores", "Divulgação societária do emissor", "Material do emissor sujeito a revisão por canal."],
  misc: ["MISC", "Ficha técnica do fornecedor", "A reprodução da ficha e de suas imagens exige avaliação própria."],
} as const;

const rightsTerms: Partial<Record<keyof typeof sources, string>> = {
  sec: "https://www.sec.gov/about/webmaster-frequently-asked-questions",
  anp: "https://www.gov.br/anp/pt-br/acesso-a-informacao/termos-de-uso-privacidade-e-seguranca-1",
  ri: "https://www.investidorpetrobras.com.br/politicas-e-termos-de-uso/",
};

type DocumentMetadata = {
  source: keyof typeof sources;
  title: string;
  publishedOn: string | null;
  version: string;
  language: "pt" | "en";
  url: string;
};

const documents = {
  "sec-20f": {
    source: "sec", title: "Petrobras · Form 20-F FY2025", publishedOn: "2026-04-09", version: "EDGAR 0001292814-26-002168", language: "en",
    url: "https://www.sec.gov/Archives/edgar/data/1119639/000129281426002168/pbrform20f_2025.htm",
  },
  "dou-addendum": {
    source: "dou", title: "Extrato do aditivo de Mero", publishedOn: "2024-11-18", version: "DOU · Seção 3, p. 108", language: "pt",
    url: "https://www.epe.gov.br/sites-pt/acesso-a-informacao/licitacoes-e-contratos/LicitacoesArquivos/licitacao-contrato-2201/CT-EPE-108-2024%20-%20DOU.pdf",
  },
  "anp-aip": {
    source: "anp", title: "Mero e área adjacente · Sumário executivo", publishedOn: null, version: "RD 0758/2021", language: "pt",
    url: "https://www.gov.br/anp/pt-br/assuntos/exploracao-e-producao-de-oleo-e-gas/desenvolvimento-e-producao/pd/rd-0758-mero-e-anc-sumario-executivo-aip.pdf",
  },
  "anp-unitisation": {
    source: "anp", title: "Individualização da produção", publishedOn: "2020-08-19", version: "Página atualizada em 11/05/2026", language: "pt",
    url: "https://www.gov.br/anp/pt-br/assuntos/exploracao-e-producao-de-oleo-e-gas/desenvolvimento-e-producao/individualizacao-da-producao-ou-unitizacao",
  },
  "mme-signing": {
    source: "mme", title: "Assinatura da alienação da parcela da União", publishedOn: "2026-03-10", version: "Notícia atualizada em 26/10/2026", language: "pt",
    url: "https://www.gov.br/mme/pt-br/assuntos/noticias/2023-2026/assinatura-de-contratos-de-mero-e-atapu-consolida-resultado-do-leilao-de-areas-nao-contratadas",
  },
  "petrobras-auction": {
    source: "auction", title: "Resultado do leilão de áreas não contratadas", publishedOn: "2025-12-04", version: "Comunicado de 04/12/2025", language: "pt",
    url: "https://agencia.petrobras.com.br/w/petrobras-informa-sobre-resultado-do-leil%C3%A3o-de-%C3%A1reas-n%C3%A3o-contratadas",
  },
  "petrobras-bylaws": {
    source: "ri", title: "Estatuto Social da Petrobras", publishedOn: null, version: "Aprovado em 16/04/2025", language: "pt",
    url: "https://api.mziq.com/mzfilemanager/v2/d/25fdf098-34f5-4608-b7fa-17d60b2de47d/ef2195e6-f2b6-8127-240e-1417c9c8be04?origin=2",
  },
  "misc-factsheet": {
    source: "misc", title: "Ficha do FPSO Marechal Duque de Caxias", publishedOn: null, version: "Ficha sem data de revisão identificada", language: "en",
    url: "https://www.miscgroup.com/awcontent/Web/Documents/OffshoreBusiness/OBU-Factsheets-v2-FPSO-MDdC.pdf",
  },
} as const satisfies Record<string, DocumentMetadata>;

type Claim = {
  document: keyof typeof documents;
  type: "observed_fact" | "actor_statement";
  referencePeriod: string;
  locator: string;
  summary: string;
  limit: string;
};

export const claims = {
  "legal-identity": {
    document: "dou-addendum", type: "observed_fact", referencePeriod: "Aditivo assinado em 09/09/2024", locator: "Seção 3, p. 108",
    summary: "O extrato identifica as cinco contratadas do acordo de Mero pelos nomes jurídicos e CNPJs.",
    limit: "Situação cadastral e vínculos com controladoras exigem fontes próprias.",
  },
  "issuer-identity": {
    document: "sec-20f", type: "actor_statement", referencePeriod: "Exercício de 2025", locator: "Capa e referência ao arquivo EDGAR",
    summary: "O Form 20-F vincula a razão social da Petrobras ao seu registro de emissor na SEC.",
    limit: "O CIK identifica o emissor na SEC. A entidade jurídica brasileira tem identificação própria por CNPJ.",
  },
  "issuer-governance": {
    document: "petrobras-bylaws", type: "observed_fact", referencePeriod: "Estatuto aprovado em 16/04/2025", locator: "Arts. 1º e 12",
    summary: "O estatuto identifica o controle societário da União e sua base no capital votante.",
    limit: "Frações do capital total e direitos sobre ativos exigem evidência própria.",
  },
  "field-operator": {
    document: "anp-aip", type: "observed_fact", referencePeriod: "Sumário associado à deliberação de 09/12/2021", locator: "Identificação do projeto e operadora",
    summary: "O sumário da ANP situa Mero na Bacia de Santos e identifica a Petrobras como operadora.",
    limit: "O recorte geográfico é regional. A geometria e a posição exata do campo e das instalações seguem sem validação.",
  },
  "aip-approval": {
    document: "anp-aip", type: "observed_fact", referencePeriod: "09/12/2021", locator: "RD 0758/2021",
    summary: "A ANP aprovou o Acordo de Individualização da Produção e o plano de desenvolvimento de Mero e da área adjacente.",
    limit: "A aprovação é documentada. O início jurídico exato da composição de 2026 segue sem reconstrução.",
  },
  "aip-addendum": {
    document: "dou-addendum", type: "observed_fact", referencePeriod: "09/09/2024", locator: "Seção 3, p. 108",
    summary: "O aditivo incorporou o acordo de individualização da jazida compartilhada ao instrumento de partilha.",
    limit: "A publicação disponível é um extrato. A vigência exata de cada participação não foi reconstruída.",
  },
  "contract-split": {
    document: "anp-unitisation", type: "observed_fact", referencePeriod: "Composição consultada no recorte de 2026", locator: "Linha Mero / área não contratada (AnC)",
    summary: "A ANP informa a divisão entre contratadas e a composição da jazida entre área contratada e área da União.",
    limit: "A participação dentro da área contratada tem denominador próprio. A identificação das partes é conferida no extrato do DOU.",
  },
  "reservoir-split": {
    document: "sec-20f", type: "actor_statement", referencePeriod: "31/12/2025, informado no Form 20-F FY2025", locator: "Relevant Shared Reservoirs (AIPs) e seção Mero",
    summary: "A Petrobras divulga sua participação na jazida compartilhada de Mero e a parcela atribuída à União.",
    limit: "O denominador é a totalidade da jazida compartilhada. A data jurídica inicial da composição segue sem confirmação.",
  },
  "auction-allocation": {
    document: "petrobras-auction", type: "actor_statement", referencePeriod: "04/12/2025", locator: "Resultado de Mero · consórcio comprador",
    summary: "A Petrobras divulgou a divisão do bloco arrematado entre a própria empresa e a Shell.",
    limit: "A alocação do bloco adquirido e a transferência dos direitos têm marcos distintos.",
  },
  "transfer-signing": {
    document: "mme-signing", type: "observed_fact", referencePeriod: "Assinatura em 10/03/2026", locator: "Assinatura dos contratos de Mero e Atapu",
    summary: "O MME registrou a assinatura da alienação da parcela da União. O comunicado mantém os direitos de produção da parcela com a União, comercializados pela PPSA, até a transferência anunciada.",
    limit: "A íntegra executada e seus anexos seguem indisponíveis no dossiê.",
  },
  "transfer-schedule": {
    document: "mme-signing", type: "actor_statement", referencePeriod: "Transferência prevista para 01/03/2027", locator: "Cronograma de transferência",
    summary: "O MME anunciou 1º de março de 2027 como data prevista para os efeitos da transferência.",
    limit: "A efetivação e o cumprimento de eventuais condições exigem nova evidência e revisão.",
  },
  "petrobras-projection": {
    document: "sec-20f", type: "actor_statement", referencePeriod: "Projeção para 2027, divulgada em 09/04/2026", locator: "Bidding rounds · Leilão de áreas não contratadas",
    summary: "O Form 20-F projeta que a participação da Petrobras na jazida compartilhada passe de 38,60% a 41,40% em 2027.",
    limit: "A previsão do emissor depende da efetivação da transferência.",
  },
  "vessel-roles": {
    document: "misc-factsheet", type: "actor_statement", referencePeriod: "Ficha sem data, consultada no recorte de 2026", locator: "P. 1 · papéis do campo e da unidade",
    summary: "A MISC vincula o FPSO a Mero e identifica separadamente a titular do navio e a prestadora de operação e manutenção.",
    limit: "A titularidade é declarada pelo fornecedor. Registro naval, fração de propriedade e início da vigência seguem sem confirmação.",
  },
} as const satisfies Record<string, Claim>;

export type ClaimKey = keyof typeof claims;

export function resolveEvidence(key: ClaimKey) {
  const claim = claims[key];
  const document = documents[claim.document];
  const [publisher, authority, condition] = sources[document.source];

  return {
    claim: { ...claim, id: "niv79:claim:" + key + ":v1", knownAt: dossierCutoff },
    document: { ...document, id: "niv79:document:" + claim.document + ":v1", retrievedOn: dossierCutoff },
    source: { publisher, authority, id: "niv79:source:" + document.source },
    rights: {
      id: "niv79:rights:" + claim.document,
      status: "conditional-private" as const,
      condition,
      termsUrl: rightsTerms[document.source] ?? null,
      allowed: "Curadoria manual privada com metadados, link e síntese factual da NIVAR.",
      gated: "Exibição pública ou a clientes, cópia integral, imagens, exportação, API e coleta automatizada exigem decisão por recurso e canal.",
    },
  };
}
