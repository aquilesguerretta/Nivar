// Atlas da Alexandria v3 — tipos compartilhados entre os dados, o mapa e as
// vistas das aulas. Nada aqui importa mapbox-gl: este arquivo entra no bundle
// das aulas (via nas-aulas.ts) e precisa continuar leve.

/** Os capítulos do Atlas. Cada um é um jeito de ler o mesmo mapa. */
export type CapituloId = 'rede' | 'agua' | 'combustivel' | 'trocas' | 'dia' | 'mundo' | 'comercio';

/** Fonte de geração, como o mapa agrupa. A ordem é a da legenda. */
export const CATEGORIAS = ['hidro', 'eolica', 'solar', 'nuclear', 'biomassa', 'gas', 'carvao', 'oleo', 'outros'] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const ROTULO_CATEGORIA: Record<Categoria, string> = {
  hidro: 'Hidrelétrica',
  eolica: 'Eólica',
  solar: 'Solar',
  nuclear: 'Nuclear',
  biomassa: 'Biomassa',
  gas: 'Gás natural',
  carvao: 'Carvão',
  oleo: 'Óleo e diesel',
  outros: 'Outros fósseis',
};

export type Subsistema = 'SE' | 'S' | 'NE' | 'N';

export const ROTULO_SUBSISTEMA: Record<Subsistema, string> = {
  SE: 'Sudeste/Centro-Oeste',
  S: 'Sul',
  NE: 'Nordeste',
  N: 'Norte',
};

/** Id do submercado no GeoJSON do Portal BR → sigla do ONS. */
export const SUBSISTEMA_DO_SUBMERCADO: Record<string, Subsistema> = {
  sudesteCentroOeste: 'SE',
  sul: 'S',
  nordeste: 'NE',
  norte: 'N',
};

/** Camadas que o leitor liga e desliga. */
export type CamadaId =
  | Categoria
  | 'linhas'
  | 'linhas-previstas'
  | 'subestacoes'
  | 'submercados'
  | 'reservatorios'
  | 'bacias'
  | 'usinas-futuras'
  | 'satelite'
  | 'relevo'
  | 'maquetes'
  /** áreas de atuação das distribuidoras (ANEEL · BDGD), capítulo "A rede"; desligada ao abrir */
  | 'distribuicao'
  | CamadaDoCombustivel;

/** Camadas do capítulo "O combustível" (ANP · GeoServer). */
export const CAMADAS_DO_COMBUSTIVEL = ['gasodutos', 'gnl', 'upgn', 'refinarias', 'terminais', 'campos', 'presal', 'blocos', 'bacias-sedimentares'] as const;
export type CamadaDoCombustivel = (typeof CAMADAS_DO_COMBUSTIVEL)[number];

/** Ligadas ao abrir o capítulo: as que contam a história. Terminais de líquidos, blocos
 *  exploratórios e bacias sedimentares são contexto pesado e começam desligados. */
export const COMBUSTIVEL_LIGADAS: CamadaDoCombustivel[] = ['gasodutos', 'gnl', 'upgn', 'refinarias', 'campos', 'presal'];

/** Usinas que o capítulo do combustível põe por cima: as térmicas que queimam gás, óleo e carvão. */
export const CATEGORIAS_DO_COMBUSTIVEL = ['gas', 'oleo', 'carvao'] as const satisfies readonly Categoria[];

export type TipoDeAtivo =
  | 'usina'
  | 'linha'
  | 'subestacao'
  | 'reservatorio'
  | 'submercado'
  | 'bacia'
  | 'pais'
  // gás e petróleo (ANP): a chave é sempre o `id` da feição
  | 'gasoduto'
  | 'instalacao'
  | 'campo'
  | 'bloco'
  | 'bacia-sedimentar'
  | 'presal'
  // área de atuação de distribuidora (ANEEL · BDGD): a chave é o `codigo` ANEEL
  | 'distribuidora'
  // capítulo "O comércio" (MDIC/Comex Stat · ONS): rota, veículo, interligação ou gasoduto; a
  // chave é opaca, da camada do comércio (`v:<viagem>`, `e:<país>`, `g:<país>`)
  | 'comercio'
  // capítulo "Um dia", modo dia real (ONS): usina ou conjunto despachado; a chave é opaca, da
  // camada do pulso (mapa/pulso.ts)
  | 'operacao';

/** Um ativo escolhido no mapa. `chave` identifica dentro do tipo. */
export interface AtivoSelecionado {
  tipo: TipoDeAtivo;
  chave: string;
  /** propriedades da feição, como vieram do arquivo de dados */
  props: Record<string, unknown>;
  lngLat: [number, number];
}

// ── arquivos de dados (public/alexandria/atlas/dados) ────────────────

export interface FonteDeDado {
  orgao: string;
  conjunto: string;
  pagina: string;
  licenca: string;
  acesso: string;
  sha256?: string;
  nota?: string;
  arquivos?: number;
}

/** Último mês de uma série que a fonte ainda não fechou; null quando está completo. */
export interface MesParcial {
  /** 'AAAA-MM' */
  mes: string;
  /** último dia com dado, 'AAAA-MM-DD' */
  ultimoDia: string;
}

/** Ativo cuja coordenada cai em outro submercado que não o do estado declarado. */
export interface PosicaoIncoerente {
  nome: string | null;
  uf: string | null;
  lon: number;
  lat: number;
  /** nome do submercado onde o ponto cai */
  caiEm: string;
  ceg?: string;
  id?: string;
  mun?: string | null;
  kw?: number;
}

export interface IndiceDoAtlas {
  gerado: string;
  camadas: {
    linhas: {
      /** linhas distintas (por identificador) */
      total: number;
      /** feições desenhadas: algumas linhas vêm em mais de um trecho */
      trechos: number;
      alternada: number;
      continua: number;
      previstas: number;
      previstasComPrevisaoVencida: number;
      /** previstas cuja previsão é marcador de "sem previsão" (2090 ou depois): publicada como null */
      previstasComPrevisaoSentinela?: number;
      /** em operação, mas com a data de carga do cadastro no lugar da de entrada (op = null, opAntesDe = ano) */
      emOperacaoComDataDeCarga?: number;
      /** dias ('AAAA-MM-DD') lidos como data de carga do cadastro do SINDAT */
      datasDeCargaDoCadastro?: string[];
      kmEmOperacao: number;
      /** por identificador, todas as linhas (em operação e previstas) */
      porTensao: Record<string, number>;
      /** por identificador, só as linhas em operação (mesmas chaves de porTensao) */
      porTensaoEmOperacao?: Record<string, number>;
      fontes: FonteDeDado[];
      nota: string;
    };
    subestacoes: {
      total: number;
      doMapaSindat: number;
      soNoCadastro: number;
      comTensao: number;
      /** do SINDAT, sem data de entrada em operação */
      previstas: number;
      /** do SINDAT, com data de entrada em operação (inclui as com data de carga) */
      emOperacao?: number;
      emOperacaoComDataDeCarga?: number;
      previstasComPrevisaoSentinela?: number;
      /** pontos do SINDAT com identificador já visto, descartados */
      repetidasNaFonte?: number;
      idsRepetidosNaFonte?: string[];
      foraPorFaltaDeNome: number;
      foraPorFaltaDeCoordenada: number;
      posicaoDivergenteEntreAsDuasBases: number;
      posicaoIncoerenteComOEstado?: number;
      exemplosDePosicaoIncoerente?: PosicaoIncoerente[];
      fontes: FonteDeDado[];
      nota: string;
    };
    usinas: {
      /** empreendimentos (CEG distintos) */
      total: number;
      /** linhas do arquivo da fonte (inclui as repetidas) */
      linhasNaFonte?: number;
      repetidasNaFonte?: { ceg: string; nome: string | null; outorgas: string[] }[];
      noMapa: number;
      semCoordenadaNaFonte: number;
      principais: number;
      menores: number;
      limiarKw: number;
      dataBase: string;
      emOperacao: number;
      /** ainda não operam (em construção ou só outorgadas), no cadastro */
      naoOperam?: number;
      /** ainda não operam e têm coordenada: o que a camada usinas-futuras desenha */
      naoOperamNoMapa?: number;
      gwEmOperacao: number;
      /** usinas e noMapa: todas as fases. gwOperacao: em operação, no cadastro inteiro.
       *  Pares coerentes: (emOperacao, gwOperacao) no cadastro; (noMapaEmOperacao, gwOperacaoNoMapa) no mapa. */
      porCategoria: Record<
        Categoria,
        { usinas: number; noMapa: number; gwOperacao: number; emOperacao?: number; noMapaEmOperacao?: number; gwOperacaoNoMapa?: number }
      >;
      vinculadasAoOns: number;
      /** unidades do ONS fora dos quatro subsistemas (Itaipu 50 Hz), fora da soma */
      unidadesOnsForaDoSin?: { usina: string; unidades: number }[];
      emOperacaoSemDataNaFonte: number;
      posicaoIncoerenteComOEstado: number;
      exemplosDePosicaoIncoerente?: PosicaoIncoerente[];
      fontes: FonteDeDado[];
      nota: string;
    };
    reservatorios: {
      /** linhas do cadastro: uma por usina */
      total: number;
      /** reservatórios distintos (por cod) */
      distintos?: number;
      noMapa: number;
      semCoordenadaNaFonte: number;
      comRegularizacao: number;
      repetidosPorUsina?: { cod: string; linhas: number; usinas: (string | null)[] }[];
      /** reservatórios do cadastro com série própria de EAR */
      comSerie?: number;
      /** idem, com ponto no mapa */
      comSerieNoMapa?: number;
      fontes: FonteDeDado[];
    };
    bacias: { total: number; verticesNaFonte: number; verticesNoMapa: number; toleranciaGraus: number; fontes: FonteDeDado[]; nota: string };
  };
  series: {
    ear: { de: string; ate: string; ultimoDia: string; mesCorrenteParcial?: MesParcial | null; fontes: FonteDeDado[] };
    earReservatorios: {
      /** séries na fonte (inclui reservatórios fora do cadastro) */
      reservatorios: number;
      /** séries de reservatórios com ponto no mapa */
      noMapa?: number;
      /** séries de reservatórios que não estão no cadastro (sem ponto no mapa) */
      semCadastro?: { cod: string; n: string }[];
      fontes: FonteDeDado[];
    };
    intercambio: { de: string; ate: string; ultimoInstante?: string; mesCorrenteParcial?: MesParcial | null; pares: string[]; fontes: FonteDeDado[] };
    balanco: {
      de: string;
      ate: string;
      ultimoInstante?: string;
      mesCorrenteParcial?: MesParcial | null;
      perfilHorario: string[];
      /** linhas de preenchimento da fonte, fora das médias */
      horasSemDadoNaFonte?: { mes: string; sub: string; horas: number }[];
      fontes: FonteDeDado[];
    };
  };
  arquivos: Record<string, { bytes: number; sha256: string }>;
}

/** Arquivo colunar de usinas (ANEEL · SIGA). */
export interface UsinasColunar {
  dataBase: string;
  tipos: string[];
  categorias: Categoria[];
  fases: string[];
  subsistemas: Subsistema[];
  combustiveis: string[];
  modalidades: string[];
  limiarKw: number;
  n: number;
  nome: (string | null)[];
  ceg: string[];
  uf: string[];
  mun: (string | null)[];
  tipo: number[];
  cat: number[];
  comb: number[];
  kw: number[];
  fase: number[];
  ano: (number | null)[];
  /** índice em `donos`, ou -1 */
  dono: number[];
  donos: string[];
  /** 1 = a coordenada cai em outro submercado que não o do estado declarado */
  susp: number[];
  lon: number[];
  lat: number[];
  mod: number[];
  sub: number[];
  mwOns: (number | null)[];
  ug: (number | null)[];
  /** casas decimais significativas da coordenada NA FONTE bruta (0 a 4; 4 = "4 ou mais") */
  prec?: (number | null)[];
  /** rumo da barragem pelo reservatório mapeado pela ANA (graus; null = sem) */
  rumoB?: (number | null)[];
  /** potência por ano pelas unidades do ONS (decisões leva 4, 6.1): array plano
   *  [ano1, kwAcum1, ano2, kwAcum2, …], anos crescentes, último kw == kw; null = sem casamento */
  etapas?: (number[] | null)[];
}

/** Propriedades de uma usina já expandida em feição. */
export interface PropsUsina {
  ceg: string;
  nome: string;
  uf: string;
  /** municípios como a fonte escreve, cada um com a própria UF ("Selvíria - MS, Ilha Solteira - SP") */
  mun: string | null;
  tipo: string;
  cat: Categoria;
  comb: string;
  kw: number;
  /** 0 operação · 1 construção · 2 construção não iniciada */
  fase: number;
  ano: number | null;
  /** proprietário e regime, como o cadastro escreve ("100% para X (PIE)") */
  dono: string | null;
  /** a coordenada do cadastro cai em outro submercado que não o do estado declarado */
  susp: boolean;
  modalidade: string | null;
  sub: Subsistema | null;
  mwOns: number | null;
  ug: number | null;
  /** casas decimais significativas da coordenada na fonte (0 a 4); ausente = arquivo sem o campo */
  prec?: number;
  /** rumo (graus do norte, horário) da crista para o lado da água; ausente = convenção leste–oeste */
  rumoB?: number;
  /** etapas por unidade do ONS ([ano, kW acumulado, …]); ausente = entra inteira no ano do cadastro */
  etapas?: number[];
  /** só nas cópias que o mapa põe na fonte com um ano escolhido: a potência de hoje (o kw
   *  da cópia é a potência naquele ano, kwNoAno) */
  kwHoje?: number;
}

export interface SerieEar {
  meses: string[];
  ultimoDia: string;
  mesCorrenteParcial?: MesParcial | null;
  unidade: string;
  SE: (number | null)[];
  S: (number | null)[];
  NE: (number | null)[];
  N: (number | null)[];
  SE_mwmes: (number | null)[];
  S_mwmes: (number | null)[];
  NE_mwmes: (number | null)[];
  N_mwmes: (number | null)[];
  SE_max: (number | null)[];
  S_max: (number | null)[];
  NE_max: (number | null)[];
  N_max: (number | null)[];
}

export interface SerieEarReservatorios {
  meses: string[];
  unidade: string;
  reservatorios: Record<string, { n: string; bacia: string; sub: string; pct: (number | null)[] }>;
}

export interface SerieIntercambio {
  meses: string[];
  /** último registro horário da fonte, 'AAAA-MM-DD HH:MM:SS' */
  ultimoInstante?: string;
  mesCorrenteParcial?: MesParcial | null;
  unidade: string;
  pares: Record<string, (number | null)[]>;
}

export type ChaveBalanco = 'hidro' | 'termica' | 'eolica' | 'solar' | 'carga' | 'intercambio';

export interface SerieBalancoMensal {
  meses: string[];
  ultimoInstante?: string;
  mesCorrenteParcial?: MesParcial | null;
  unidade: string;
  chaves: ChaveBalanco[];
  sub: Record<Subsistema, Record<ChaveBalanco, (number | null)[]>>;
}

export interface SeriePerfilHorario {
  meses: string[];
  unidade: string;
  chaves: ChaveBalanco[];
  sub: Record<Subsistema, Record<ChaveBalanco, (number | null)[][]>>;
}

// ── gás e petróleo (ANP · GeoServer) ─────────────────────────────────
// Arquivos combustivel-*.geojson, gerados por construir.mjs. Regra comum:
// campo ausente na fonte é null; `fora: true` aparece só na feição com alguma
// coordenada fora da caixa do Brasil e da ZEE (marcada, não corrigida).

/** Trecho de gasoduto de transporte (LineString ou MultiLineString). */
export interface PropsGasoduto {
  /** id estável: 'gd-<duto>--<trecho>' (sufixo -2 quando a fonte repete os dois) */
  id: string;
  duto: string | null;
  trecho: string | null;
  /** diâmetro nominal em polegadas */
  diam: number | null;
  /** extensão declarada pela ANP, km */
  km: number | null;
  /** extensão medida no traçado da fonte antes da simplificação, km */
  kmTraco: number;
  /** instalação de origem e de destino, como a fonte escreve (inclui city gates e ECOMPs) */
  orig: string | null;
  dest: string | null;
  /** 'Município / UF', como a fonte escreve */
  munOrig: string | null;
  munDest: string | null;
  prop: string | null;
  oper: string | null;
  /** 'Gás', 'GNL', 'Gás Xisto' ou null */
  fluido: string | null;
  fora?: true;
}

export type TipoInstalacaoCombustivel = 'refinaria' | 'gnl' | 'upgn' | 'terminal';

interface PropsInstalacaoBase {
  /** id estável: '<tipo>-<sigla ou nome>' (terminal: 'terminal-<código SIMP>') */
  id: string;
  nome: string | null;
  mun: string | null;
  uf: string | null;
  /** número do ato de autorização, como a fonte escreve */
  aut: string | null;
  fora?: true;
}

export interface PropsRefinaria extends PropsInstalacaoBase {
  tipo: 'refinaria';
  sigla: string | null;
  emp: string | null;
  /** publicação da autorização, como a fonte escreve ('DOU de 29/09/2022') */
  autFonte: string | null;
  /** capacidade de refino, barris por dia */
  bpd: number | null;
  /** a mesma capacidade, m³ por dia */
  m3d: number | null;
}

export interface PropsTerminalGnl extends PropsInstalacaoBase {
  tipo: 'gnl';
  emp: string | null;
  sit: string | null;
  /** capacidade: UNIDADE NÃO DECLARADA NA FONTE (indice.combustivel.instalacoes.gnl.capacidadeUnidade = null) */
  cap: number | null;
}

export interface PropsUpgn extends PropsInstalacaoBase {
  tipo: 'upgn';
  /** 'UPGN' ou 'UPCGN', como a fonte escreve */
  sub: string | null;
  autFonte: string | null;
}

export interface PropsTerminalLiquidos extends PropsInstalacaoBase {
  tipo: 'terminal';
  /** código da instalação no SIMP da ANP */
  simp: number | null;
  emp: string | null;
  sit: string | null;
}

export type PropsInstalacaoCombustivel = PropsRefinaria | PropsTerminalGnl | PropsUpgn | PropsTerminalLiquidos;

/** Campo de produção de petróleo e gás (Polygon). */
export interface PropsCampoProducao {
  /** 'campo-<código ANP>' */
  id: string;
  cod: number | null;
  nome: string | null;
  sigla: string | null;
  bacia: string | null;
  oper: string | null;
  /** 'Produção', 'Desenvolvimento', 'Em Devolução', 'Fase de Reabilitação' */
  etapa: string | null;
  fluido: 'oleo' | 'gas' | 'outros' | null;
  /** código de ambiente da fonte: 'T' (terra), 'M' (mar), 'A' (não declarado) */
  amb: string | null;
  rodada: string | null;
  contrato: string | null;
  /** datas 'AAAA-MM-DD' */
  assinatura: string | null;
  descoberta: string | null;
  inicio: string | null;
  termino: string | null;
  /** unidade não declarada na fonte */
  area: number | null;
  /** lâmina d'água: unidade não declarada na fonte */
  lamina: number | null;
  fora?: true;
}

/** Bloco exploratório sob contrato (MultiPolygon). */
export interface PropsBlocoExploratorio {
  id: string;
  cod: string | null;
  nome: string | null;
  fantasia: string | null;
  nomeAlt: string | null;
  bacia: string | null;
  oper: string | null;
  rodada: string | null;
  /** código de fase do contrato, como a fonte escreve ('E') */
  fase: string | null;
  amb: string | null;
  contrato: string | null;
  assinatura: string | null;
  termino: string | null;
  descobertas: number | null;
  /** unidade não declarada na fonte */
  area: number | null;
  fora?: true;
}

/** Bacia sedimentar (Polygon ou MultiPolygon). */
export interface PropsBaciaSedimentar {
  id: string;
  nome: string | null;
  sit: 'terrestre' | 'maritima' | null;
  /** área declarada pela fonte, km² */
  km2: number | null;
  fora?: true;
}

export interface PropsPreSal {
  id: 'presal';
  fora?: true;
}

export interface OcorrenciaNaFonte {
  camada: string;
  item: string | null;
  problema?: string;
}

/** Bloco `combustivel` de indice.json. */
export interface IndiceCombustivel {
  /** data da consulta ao GeoServer ('AAAA-MM-DD'): as camadas não trazem data própria */
  acesso: string;
  licenca: string;
  capacidadesDoServico: FonteDeDado;
  gasodutos: {
    trechos: number;
    dutos: number;
    kmDeclarado: number;
    kmTraco: number;
    trechosSemExtensaoDeclarada: string[];
    verticesNaFonte: number;
    verticesNoMapa: number;
    toleranciaGraus: number;
    porOperador: Record<string, number>;
    porFluido: Record<string, number>;
    fontes: (FonteDeDado & { camada: string | null })[];
    nota: string;
  };
  instalacoes: {
    total: number;
    porTipo: Partial<Record<TipoInstalacaoCombustivel, number>>;
    refino: {
      refinarias: number;
      semCapacidadeNaFonte: string[];
      bpdTotal: number;
      m3dTotal: number;
      unidades: { bpd: string; m3d: string };
      razaoBpdPorM3: [number, number];
      nota: string;
    };
    gnl: { terminais: number; comCapacidade: number; capacidadeUnidade: null; nota: string };
    fontes: (FonteDeDado & { camada: string | null })[];
  };
  campos: {
    total: number;
    porEtapa: Record<string, number>;
    porFluido: Record<string, number>;
    porAmbiente: Record<string, number>;
    fluidosIlegiveis: string[];
    verticesNaFonte: number;
    verticesNoMapa: number;
    aneisPreservadosSemSimplificar: number;
    toleranciaGraus: number;
    fontes: (FonteDeDado & { camada: string | null })[];
  };
  blocos: {
    total: number;
    porAmbiente: Record<string, number>;
    porBacia: Record<string, number>;
    verticesNaFonte: number;
    verticesNoMapa: number;
    toleranciaGraus: number;
    fontes: (FonteDeDado & { camada: string | null })[];
  };
  baciasSedimentares: {
    total: number;
    porSituacao: Record<string, number>;
    verticesNaFonte: number;
    verticesNoMapa: number;
    toleranciaGraus: number;
    fontes: (FonteDeDado & { camada: string | null })[];
  };
  presal: { total: number; vertices: number; fontes: (FonteDeDado & { camada: string | null })[] };
  /** o que a fonte não traz, em frase pronta para a interface */
  ausencias: string[];
  incoerencias: OcorrenciaNaFonte[];
  repetidas: OcorrenciaNaFonte[];
  foraDoBrasilOuZee: string[];
  datasIlegiveis: string[];
}

/** indice.json com o bloco de gás e petróleo (ausente em índices gerados antes dele). */
export type IndiceDoAtlasComCombustivel = IndiceDoAtlas & { combustivel?: IndiceCombustivel };

// ── distribuição: áreas de atuação (ANEEL · BDGD · camada ARAT) ──────
// Arquivo distribuicao-areas.geojson, montado em tools/alexandria-atlas/concessoes/
// e registrado no índice por construir.mjs. Ordem das feições: da maior área para
// a menor (a permissionária fica por cima da concessionária que a contém).

export type TipoDeOutorgaDistribuicao = 'concessionária' | 'permissionária';

/** Propriedades de cada área de atuação. */
export interface PropsAreaDistribuidora {
  /** código ANEEL da distribuidora */
  codigo: number;
  nome: string;
  /** da letra C ou P do COD_ID da própria ARAT; nada deduzido do nome */
  tipo: TipoDeOutorgaDistribuicao;
  /** número do contrato, 'NNN/AAAA', do COD_ID */
  contrato: string;
  /** COD_ID cru da ARAT ('C.017.SP.1998'); a UF dentro dele NÃO é confiável e não é publicada à parte */
  codArat: string;
  /** data-base da BDGD de onde a área saiu, 'AAAA-MM-DD' */
  dataBase: string;
  /** id do item da BDGD no ArcGIS Online da ANEEL */
  item: string;
}

/** Código da BDGD que ficou de fora do arquivo. */
export interface DistribuidoraForaDoArquivo {
  codigo: number;
  nome: string;
  /** 'AAAA-MM-DD' (sucedidas) ou 'AAAA' (sem camada ARAT) */
  dataBase: string;
}

/** Bloco `distribuicao` de indice.json quando o arquivo está publicado. */
export interface IndiceDistribuicao {
  arquivo: string;
  ausente?: undefined;
  total: number;
  concessionarias: number;
  permissionarias: number;
  porDataBase: Record<string, number>;
  vertices: number;
  toleranciaGraus: number;
  bytes: number;
  /** SHA-256 completo do arquivo publicado */
  sha256: string;
  fonte: FonteDeDado & { urls: string; camada: string };
  nota: string;
  fora: {
    sucedidas: (DistribuidoraForaDoArquivo & { por: number; fracao: number; sucessora: string })[];
    semCamadaArat: DistribuidoraForaDoArquivo[];
    nota: string;
  };
  /** o que a fonte não traz, em frase pronta para a interface */
  ausencias: string[];
}

/** Bloco `distribuicao` quando o build não encontrou o arquivo publicado. */
export interface IndiceDistribuicaoAusente {
  ausente: true;
  arquivo: string;
  motivo: string;
}

/** indice.json com o bloco de distribuição (ausente em índices gerados antes dele). */
export type IndiceDoAtlasComDistribuicao = IndiceDoAtlas & { distribuicao?: IndiceDistribuicao | IndiceDistribuicaoAusente };
