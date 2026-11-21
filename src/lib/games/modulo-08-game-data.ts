import type {
  ClaimMagnitude,
  ClaimPeriod,
  ClaimUnit,
  ClaimUniverse,
  DecisionGameScenario,
  GameLens,
  ReconciliationDecision,
  SourceStatus,
} from './alexandria-game-types.ts';
// LYCEUM Wave 40 — os números deixaram de ser digitados aqui. Todos os
// valores citados pelos documentos vêm da camada canônica, que o
// conteúdo de aula também consome; o teste de invariante em
// `tests/alexandria-games/modulo-08-fatos.test.ts` falha se os dois
// lados deixarem de concordar.
import {
  M08_FATOS,
  M08_PLANEJAMENTO_MEDIO_PRAZO,
  M08_PLANO_DECENAL_BASE,
  M08_FATIA_CAPACIDADE_PCT,
} from '../data/alexandria-modulo-08-fatos.ts';

const F = M08_FATOS;
/** 24,83 % — DERIVADO de 64,8 GW ÷ 261,0 GW, não digitado. A prosa da
 *  fonte arredonda para "cerca de 25%". */
const SOLAR_PCT_CAPACIDADE = Math.round(M08_FATIA_CAPACIDADE_PCT.sol);

const ALL_LENSES: readonly GameLens[] = ['explorador', 'analista', 'especialista'];
const ADVANCED_LENSES: readonly GameLens[] = ['analista', 'especialista'];
const SPECIALIST_LENS: readonly GameLens[] = ['especialista'];

export const MAGNITUDE_LABELS: Record<ClaimMagnitude, string> = {
  capacidade: 'Capacidade instalada',
  geracao: 'Geração de energia',
  carga: 'Carga observada',
  curtailment: 'Restrição de geração',
  transmissao: 'Transmissão',
  renovabilidade: 'Renovabilidade',
};

export const UNIT_LABELS: Record<ClaimUnit, string> = {
  gw: 'GW',
  twh: 'TWh',
  gwh: 'GWh',
  'mw-medio': 'MW médios',
  percentual: '%',
  quilometro: 'km',
};

export const UNIVERSE_LABELS: Record<ClaimUniverse, string> = {
  'eletrico-amplo': 'Elétrico amplo (centralizada + autoprodução + MMGD)',
  'energetico-nacional': 'Matriz energética nacional',
  'sin-operativo': 'SIN supervisionado pelo ONS',
  'centralizado-regulatorio': 'Cadastro regulatório centralizado',
  planejamento: 'Base de planejamento',
  'perimetro-corporativo': 'Perímetro corporativo declarado',
};

export const PERIOD_LABELS: Record<ClaimPeriod, string> = {
  'ano-base': 'Ano-base / ano civil',
  'fotografia-data': 'Fotografia em uma data',
  'intervalo-operativo': 'Intervalo operativo',
  'horizonte-cenario': 'Horizonte de cenário',
  'data-publicacao': 'Data de publicação',
};

export const STATUS_LABELS: Record<SourceStatus, string> = {
  'fato-consolidado': 'Fato consolidado',
  operacao: 'Operação / dado operativo',
  cadastro: 'Cadastro ou outorga',
  cenario: 'Cenário / simulação',
  anuncio: 'Anúncio institucional',
};

export const DECISION_LABELS: Record<ReconciliationDecision, string> = {
  comparavel: 'Comparável diretamente',
  normalizar: 'Comparável após normalização',
  'nao-comparavel': 'Não comparável diretamente',
  insuficiente: 'Informação insuficiente',
};

export const MODULO_08_GAME: DecisionGameScenario = {
  id: 'numero-impossivel',
  moduleId: 'modulo-08',
  title: 'O Número Impossível',
  subtitle: 'Expedição decisória de reconciliação de fontes',
  competenceIds: [
    'm8-reconciliar-grandeza-unidade-universo-periodo-status',
    'm8-comunicar-divergencia-sem-apagar-nuance',
  ],
  transferCaseIds: ['m8-09', 'm8-10', 'm8-11'],
  documents: [
    {
      id: 'm8-01',
      code: 'DOC 01',
      title: 'A segunda maior categoria',
      source: 'Balanço elétrico · conceito amplo',
      sourceStatusLabel: 'Fechamento anual, ano-base 2025',
      claim: `A fonte solar representa cerca de ${SOLAR_PCT_CAPACIDADE}% da capacidade, com ${F.solarCapacidade.texto} em 2025.`,
      context: 'O conceito inclui geração centralizada, autoprodução e micro e minigeração distribuída; mais de dois terços da solar está em MMGD.',
      lenses: ALL_LENSES,
      expected: { magnitude: 'capacidade', unidade: 'gw', universo: 'eletrico-amplo', periodo: 'ano-base', status: 'fato-consolidado' },
      expectedDecision: 'normalizar',
      criticalWhenWrong: { magnitude: 'capacidade-versus-geracao', universo: 'universos-incompativeis', decisao: 'capacidade-versus-geracao' },
      reconstruction: `${F.solarCapacidade.texto} é estoque de potência no conceito amplo. Só conversa com geração depois de explicitar período e fator de capacidade.`,
      assistance: 'Pergunte se GW mede tamanho do parque ou energia produzida.',
    },
    {
      id: 'm8-02',
      code: 'DOC 02',
      title: 'A fonte que cai de posição',
      source: 'Balanço elétrico · geração anual',
      sourceStatusLabel: 'Fechamento anual, ano-base 2025',
      claim: `A solar produziu ${F.solarGeracao.texto} e respondeu por cerca de 11% da geração em 2025.`,
      context: 'A produção existe apenas quando há recurso e depende de disponibilidade, despacho e restrição. O número é fluxo acumulado no ano.',
      lenses: ALL_LENSES,
      expected: { magnitude: 'geracao', unidade: 'twh', universo: 'eletrico-amplo', periodo: 'ano-base', status: 'fato-consolidado' },
      expectedDecision: 'normalizar',
      criticalWhenWrong: { magnitude: 'capacidade-versus-geracao', decisao: 'capacidade-versus-geracao' },
      reconstruction: `${F.solarGeracao.texto} é energia acumulada. Os ${SOLAR_PCT_CAPACIDADE}% e 11% podem estar corretos porque medem grandezas diferentes.`,
      assistance: 'TWh é fluxo acumulado; GW é potência fotografada.',
    },
    {
      id: 'm8-03',
      code: 'DOC 03',
      title: 'Quase noventa por cento',
      source: 'Balanço elétrico nacional',
      sourceStatusLabel: 'Fechamento anual, ano-base 2025',
      claim: `A renovabilidade da matriz elétrica foi de ${F.renovabilidadeEletrica.texto} em 2025.`,
      context: 'O indicador cobre eletricidade gerada, importada e consumida. A queda ante 2024 acompanhou menor geração hidráulica e maior despacho térmico.',
      lenses: ALL_LENSES,
      expected: { magnitude: 'renovabilidade', unidade: 'percentual', universo: 'eletrico-amplo', periodo: 'ano-base', status: 'fato-consolidado' },
      expectedDecision: 'nao-comparavel',
      criticalWhenWrong: { universo: 'energetica-versus-eletrica', decisao: 'energetica-versus-eletrica' },
      reconstruction: `${F.renovabilidadeEletrica.texto} descreve eletricidade, não toda a energia usada na economia.`,
      assistance: 'Pergunte se o denominador inclui combustível de transporte e calor industrial.',
    },
    {
      id: 'm8-04',
      code: 'DOC 04',
      title: 'A outra matriz',
      source: 'Balanço energético nacional',
      sourceStatusLabel: 'Fechamento anual, ano-base 2025',
      claim: 'A renovabilidade da matriz energética permaneceu próxima de 50% em 2025.',
      context: 'O universo inclui petróleo, gás, biomassa, eletricidade, carvão, etanol e as demais formas de energia usadas na economia.',
      lenses: ALL_LENSES,
      expected: { magnitude: 'renovabilidade', unidade: 'percentual', universo: 'energetico-nacional', periodo: 'ano-base', status: 'fato-consolidado' },
      expectedDecision: 'nao-comparavel',
      criticalWhenWrong: { universo: 'energetica-versus-eletrica', decisao: 'energetica-versus-eletrica' },
      reconstruction: `Os 50% e ${F.renovabilidadeEletrica.texto} têm denominadores diferentes. Compará-los como se fossem a mesma matriz muda a conclusão.`,
      assistance: 'A tomada é um subconjunto da energia consumida pelo país.',
    },
    {
      id: 'm8-05',
      code: 'DOC 05',
      title: 'O contrafactual do operador',
      source: 'ONS · exercício contrafactual sobre 2024',
      sourceStatusLabel: 'Simulação publicada pelo operador',
      claim: `Sem geração distribuída, a restrição por razão energética cairia de cerca de ${F.curtailmentEnergetico2024.texto} para ${F.curtailmentContrafactual.texto} em 2024.`,
      context: 'A simulação usa balanço horário do SIN. Ela testa um mundo alternativo; não registra a energia efetivamente cortada nesse mundo.',
      lenses: ADVANCED_LENSES,
      expected: { magnitude: 'curtailment', unidade: 'gwh', universo: 'sin-operativo', periodo: 'ano-base', status: 'cenario' },
      expectedDecision: 'normalizar',
      criticalWhenWrong: { status: 'cenario-como-fato', decisao: 'cenario-como-fato' },
      reconstruction: 'O ONS fornece a lógica operativa, mas o contrafactual continua sendo simulação. Ele sustenta causalidade, não um fato ocorrido.',
      assistance: 'A expressão “sem geração distribuída” descreve um mundo observado ou simulado?',
    },
    {
      id: 'm8-06',
      code: 'DOC 06',
      title: 'Outorga não é operação',
      source: 'ANEEL · base de outorgas e cadastro',
      sourceStatusLabel: 'Registro regulatório vivo',
      claim: 'Uma soma em GW inclui empreendimentos outorgados; a apresentação conclui que toda a potência já está em operação.',
      context: 'O recorte não informa quanto está em construção, em teste ou efetivamente operando, nem declara a data da fotografia.',
      lenses: ADVANCED_LENSES,
      expected: { magnitude: 'capacidade', unidade: 'gw', universo: 'centralizado-regulatorio', periodo: 'fotografia-data', status: 'cadastro' },
      expectedDecision: 'insuficiente',
      criticalWhenWrong: { status: 'cadastro-como-operacao', decisao: 'cadastro-como-operacao' },
      reconstruction: 'Cadastro responde sobre situação regulatória. Para afirmar operação, é preciso filtrar situação e data de entrada comercial.',
      assistance: 'Procure as colunas de situação do empreendimento e data de operação comercial.',
    },
    {
      // LYCEUM Wave 40 — este documento dizia "78 GW", número que não
      // existe em `alexandria_modulo08.html` (o único casamento de "78"
      // no arquivo é o hexadecimal `A78BFA` de uma cor), atribuído a um
      // "PDE" que a fonte nunca escreve como sigla. Um jogo cujo tema é
      // proveniência não pode inventar o próprio número.
      //
      // A MECÂNICA não mudou: o slide segue sem universo, sem ano e sem
      // cenário, e a resposta esperada segue sendo "insuficiente". O que
      // mudou é que agora o número é real — e a armadilha ficou mais
      // rica, porque a fonte traz DOIS valores de planejamento que o
      // slide confunde: 269 GW é do plano da operação de médio prazo do
      // operador, previsto para 2030, enquanto o plano decenal declara
      // ~255 GW como ponto de partida. Dizer "o plano prevê 269 GW" já
      // mistura os dois planos antes de omitir o resto.
      id: 'm8-07',
      code: 'DOC 07',
      title: 'Um número no horizonte',
      source: 'Slide sem fonte · atribuído a “o plano”',
      sourceStatusLabel: 'Cenário de planejamento',
      claim: `“O plano prevê ${M08_PLANEJAMENTO_MEDIO_PRAZO.gw} GW”, afirma o slide, sem informar qual plano, o universo nem o ano do horizonte.`,
      context: `Há mais de um plano, e eles não medem a mesma coisa: ${M08_PLANEJAMENTO_MEDIO_PRAZO.rotulo} é ${M08_PLANEJAMENTO_MEDIO_PRAZO.universo.toLowerCase()}, publicado no ${M08_PLANEJAMENTO_MEDIO_PRAZO.publicacao.toLowerCase()}; o plano decenal declara ${M08_PLANO_DECENAL_BASE.rotulo} como ponto de partida. Cenário não é potência já instalada nem previsão garantida.`,
      lenses: ADVANCED_LENSES,
      expected: { magnitude: 'capacidade', unidade: 'gw', universo: 'planejamento', periodo: 'horizonte-cenario', status: 'cenario' },
      expectedDecision: 'insuficiente',
      criticalWhenWrong: { status: 'cenario-como-fato', periodo: 'publicacao-versus-ano-base', decisao: 'cenario-como-fato' },
      reconstruction: `Antes de usar ${M08_PLANEJAMENTO_MEDIO_PRAZO.gw} GW, recupere qual plano, edição, horizonte, tecnologia e universo. Plano expressa trajetória de cenário, não garantia — e trocar o plano da operação de médio prazo pelo decenal troca o número junto.`,
      assistance: `Pergunte “${M08_PLANEJAMENTO_MEDIO_PRAZO.gw} GW de quê, em qual plano, em qual ano e sob qual cenário?”.`,
    },
    {
      id: 'm8-08',
      code: 'DOC 08',
      title: 'Uma série que muda por dentro',
      source: 'ONS · série de restrição eólica e solar',
      sourceStatusLabel: 'Série operativa com quebra metodológica',
      claim: `A restrição sobe de cerca de ${F.corte2021.texto} para cerca de ${F.corte2025.texto}.`,
      context: 'Até março de 2024 a série considerava somente eólicas; as fotovoltaicas entram a partir de abril. Parte da inclinação é mudança de universo.',
      lenses: ADVANCED_LENSES,
      expected: { magnitude: 'curtailment', unidade: 'percentual', universo: 'sin-operativo', periodo: 'intervalo-operativo', status: 'operacao' },
      expectedDecision: 'normalizar',
      criticalWhenWrong: { universo: 'universos-incompativeis', decisao: 'universos-incompativeis' },
      reconstruction: 'A série precisa marcar abril de 2024 como quebra; emendar os extremos sem nota mistura universos.',
      assistance: 'Duas séries no mesmo eixo só são contínuas se universo e método permanecerem iguais.',
    },
    {
      id: 'm8-09',
      code: 'DOC 09',
      title: 'Trinta e sete por cento — de quê?',
      source: 'AXIA Energia · divulgação institucional',
      sourceStatusLabel: 'Posição informada ao fim de 2025',
      claim: `A companhia informa participação de ${F.axiaParticipacao.texto} nas linhas acima de ${F.axiaLimiarTensao.valor} kV, incluindo participações em SPEs.`,
      context: `A reprodução “${F.axiaParticipacao.texto} das linhas do país” remove o limiar de tensão e o perímetro societário que definem o denominador.`,
      lenses: SPECIALIST_LENS,
      expected: { magnitude: 'transmissao', unidade: 'percentual', universo: 'perimetro-corporativo', periodo: 'fotografia-data', status: 'anuncio' },
      expectedDecision: 'normalizar',
      criticalWhenWrong: { universo: 'universos-incompativeis', decisao: 'universos-incompativeis' },
      reconstruction: 'O número é utilizável com os dois qualificadores. A nota metodológica deve preservar tensão e participações societárias.',
    },
    {
      id: 'm8-10',
      code: 'DOC 10',
      title: 'Cinco datas para uma interligação',
      source: 'ONS, ANEEL e comunicação institucional',
      sourceStatusLabel: 'Eventos entre setembro de 2025 e janeiro de 2026',
      claim: `Uma notícia usa 10 de setembro de 2025 como data da interligação da linha de aproximadamente ${F.roraimaLinha.valor} km até Roraima.`,
      context: 'Essa é a cerimônia de início dos testes. A interligação física ocorreu em 16 de setembro; a operação comercial começou em outubro; a comercialização mudou em 1º de janeiro de 2026.',
      lenses: SPECIALIST_LENS,
      expected: { magnitude: 'transmissao', unidade: 'quilometro', universo: 'sin-operativo', periodo: 'fotografia-data', status: 'anuncio' },
      expectedDecision: 'normalizar',
      criticalWhenWrong: { periodo: 'publicacao-versus-ano-base', decisao: 'publicacao-versus-ano-base' },
      reconstruction: 'A data correta depende da pergunta: licença, teste, interligação física, operação comercial ou comercialização.',
    },
    {
      id: 'm8-11',
      code: 'DOC 11',
      title: 'Ano do relatório não é ano do dado',
      source: 'Síntese publicada após o fechamento anual',
      sourceStatusLabel: 'Publicação posterior ao ano-base',
      claim: `Um relatório publicado em 2026 apresenta a renovabilidade elétrica de ${F.renovabilidadeEletrica.texto} referente ao ano-base 2025.`,
      context: 'A apresentação renomeia o indicador como “renovabilidade de 2026” porque leu apenas a capa da publicação.',
      lenses: SPECIALIST_LENS,
      expected: { magnitude: 'renovabilidade', unidade: 'percentual', universo: 'eletrico-amplo', periodo: 'ano-base', status: 'fato-consolidado' },
      expectedDecision: 'normalizar',
      criticalWhenWrong: { periodo: 'publicacao-versus-ano-base', decisao: 'publicacao-versus-ano-base' },
      reconstruction: 'O título deve preservar “ano-base 2025”. Data de publicação informa quando soubemos, não quando o fenômeno ocorreu.',
    },
  ],
};
