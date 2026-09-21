// src/lib/types/alexandria.ts
// FOUNDRY contract — Alexandria, produto educacional standalone.
//
// NÃO confundir com src/lib/types/curriculum.ts, que pertence ao Vault
// legado do terminal e permanece travado até a Alexandria nova atingir
// paridade de conteúdo. Os dois coexistem de propósito.
//
// Consumidores desta wave: LYCEUM (shell, viewer, exercícios),
// e qualquer wave futura de conteúdo curricular da Alexandria.

/** Trilha de conteúdo. Universal se repete em qualquer mercado;
 *  brasil e usa carregam a peculiaridade de cada polo energético. */
export type CurriculumTrack = 'universal' | 'brasil' | 'usa';

export type CurriculumLanguage = 'pt-BR' | 'en';

/** Nível de profundidade do Currículo Definitivo.
 *  1 = fundamentos universais · 2 = setor elétrico brasileiro
 *  3 = especialização estratégica */
export type CurriculumLevel = 1 | 2 | 3;

/** Tipos de exercício observados nas telas de referência.
 *  'calculo' cobre o Bloco Especial de Matemática Operacional. */
export type ActivityKind = 'objetiva' | 'discursiva' | 'estudo-de-caso' | 'calculo';

/** Os quatro submercados do SIN. Usado para marcar cobertura
 *  regional de uma aula — nem toda aula tem recorte regional. */
export type SubmercadoTag =
  | 'norte'
  | 'nordeste'
  | 'sudeste-centro-oeste'
  | 'sul';

/** Prioridade declarada no Currículo Definitivo.
 *  'confirmar' = fonte primária não confirma, pendente de verificação. */
export type BlockPriority =
  | 'maxima'
  | 'alta'
  | 'media-alta'
  | 'media'
  | 'confirmar';

/** Dificuldade da aula. Mapeia para a tag visual
 *  Básico / Intermediário / Avançado das telas de referência. */
export type AulaDifficulty = 'basico' | 'intermediario' | 'avancado';

/** Bloco do Currículo Definitivo. São 17, fixos.
 *  O bloco é a unidade de conteúdo; o módulo é a unidade de navegação.
 *  Um módulo referencia um bloco. */
export interface CurriculumBlock {
  id: string;                        // 'bloco-01' .. 'bloco-17'
  number: number;                    // 1-17
  level: CurriculumLevel;
  title: string;
  track: CurriculumTrack;
  /** Prefixo de 3 letras da biblioteca de gravuras ('fis-', 'red-', ...).
   *  null onde a metáfora visual ainda não foi decidida. */
  illustrationPrefix: string | null;
  priority: BlockPriority;
  /** null onde o Currículo Definitivo não declara carga horária. */
  estimatedHoursMin: number | null;
  estimatedHoursMax: number | null;
}

/** Trilha — o agrupamento de mais alto nível que o aluno escolhe.
 *  Ex: "Fundamentos do SIN", "Operação e mercados de energia". */
export interface CurriculumTrilha {
  id: string;
  title: string;
  description: string;
  level: CurriculumLevel;
  track: CurriculumTrack;
  language: CurriculumLanguage;
  moduleIds: string[];
  /** Soma das aulas dos módulos cuja contagem é conhecida. null quando
   *  nenhum módulo da trilha tem fonte ainda — 'desconhecido', não 'zero'.
   *  Wave 2. */
  totalAulas: number | null;
  /** true quando ao menos um módulo da trilha está com totalAulas null.
   *  O número acima é piso confirmado, não total. Wave 2. */
  totalAulasPartial: boolean;
}

/** Módulo — subdivisão da trilha. Exibido como "Módulo 3 de 6". */
export interface CurriculumModule {
  id: string;
  trilhaId: string;
  number: number;
  totalInTrilha: number;
  title: string;
  blockId: string;                   // referência a CurriculumBlock
  /** Contagem real de aulas, extraída do HTML do módulo. null onde o
   *  módulo ainda não tem HTML — não estimar. Wave 2. */
  totalAulas: number | null;
}

/** Aula — a unidade que o aluno consome. Exibida como "Aula 8". */
export interface CurriculumAula {
  id: string;
  moduleId: string;
  number: number;
  totalInModule: number;
  title: string;
  subtitle: string | null;
  track: CurriculumTrack;
  language: CurriculumLanguage;
  /** null onde a fonte não declara. O HTML do Módulo 01 não traz duração
   *  por aula — o hero declara 4-6 horas para o MÓDULO inteiro (é de lá
   *  que `estimatedHours` do bloco saiu), e o § MAP lista as nove aulas
   *  sem tempo. Dividir 4-6 h por nove seria inventar. LYCEUM Wave 4. */
  durationMinutes: number | null;
  /** null onde a fonte não declara. O Módulo 01 não marca dificuldade em
   *  nenhuma das nove aulas. Mesmo idioma de `estimatedHoursMin` do
   *  bloco e de `totalAulas` do módulo. LYCEUM Wave 4. */
  difficulty: AulaDifficulty | null;
  /** Vazio quando a aula não tem recorte regional. */
  submercados: SubmercadoTag[];
  /** Eixo de categorização transversal aos níveis.
   *  Ex: 'Preço e mercado', 'Regulação', 'Tarifas', 'Operação do SIN'. */
  competencies: string[];
  /** Nomes de arquivo da biblioteca de gravuras, sem caminho.
   *  Ex: 'ger-03-turbina-francis-corte.png' */
  illustrations: string[];
  video: LessonVideo | null;
  activities: LessonActivity[];
  /** Documentos de referência ligados à aula. */
  references: LessonReference[];
  /** Instrumentos interativos da aula. Vazio quando a aula não tem
   *  nenhum — a maioria tem zero ou um. Wave 2. */
  instruments: Instrument[];
}

export interface LessonVideo {
  id: string;
  url: string;
  provider: 'vimeo' | 'youtube' | 'self-hosted' | 'other';
  title: string;
  durationSeconds: number;
  captionsUrl: string | null;
  /** Caminho do poster estático exibido antes do play. */
  posterAsset: string | null;
}

export interface LessonActivity {
  id: string;
  kind: ActivityKind;
  prompt: string;
  points: number;
  /** Formato específico por kind. LYCEUM tipa em detalhe quando
   *  construir cada mecânica — deixado solto de propósito porque
   *  as mecânicas ainda não foram especificadas. */
  config: Record<string, unknown>;
}

/** Documento de apoio: PDF, planilha, link externo.
 *  Alimenta a seção "Material de apoio" e a Biblioteca. */
export interface LessonReference {
  id: string;
  title: string;
  source: string;                    // 'ONS', 'EPE', 'CCEE', 'ANEEL', ...
  kind: 'pdf' | 'xlsx' | 'csv' | 'link';
  url: string;
  sizeBytes: number | null;
  publishedAt: string | null;        // ISO date
}

/** Badge com critério mensurável. As telas de referência mostram
 *  critérios como "Atinja 0,92 de FP médio em simulação tarifária" —
 *  o critério é dado, não texto decorativo. */
export interface Badge {
  id: string;
  name: string;
  criterion: string;
  category: 'conteudo' | 'exploracao' | 'dominio';
  expReward: number;
  /** Ícone de centro do badge. A moldura é única e composta por CSS.
   *  null enquanto a biblioteca de ícones de badge não existe. */
  iconAsset: string | null;
}

export interface UserBadgeProgress {
  badgeId: string;
  status: 'bloqueado' | 'conquistado';
  earnedAt: string | null;
}

export interface Certificate {
  id: string;
  levelCompleted: CurriculumLevel;
  trilhaId: string;
  issuedAt: string;                  // ISO date
  /** Padrão: 'alx-{track}-{level}-{sequencial}'. */
  verificationId: string;
  totalAulas: number;
  totalHours: number;
  scorePercent: number;
}

/** Progresso agregado do aluno. Alimenta o painel de progresso
 *  e o rail direito de toda tela. */
export interface UserProgress {
  aulasCompleted: number;
  aulasTotal: number;
  exp: number;
  badgesEarned: number;
  badgesTotal: number;
  byLevel: Record<CurriculumLevel, number>;   // percentual 0-100
  bySubmercado: Record<SubmercadoTag, { completed: number; total: number }>;
  studyStreakDays: number;
}

// ── WAVE 2 — Instrumentos ──────────────────────────────────────────────────
//
// Um instrumento é dado, não componente. O LYCEUM implementa UM primitivo de
// renderização que lê estas interfaces e monta qualquer calculadora, simulador
// ou laboratório configurado aqui.
//
// Procedência: os 25 instrumentos dos três HTML de módulo em
// `Alexandria modulos/` — Módulo 01 (7), Módulo 02 (9), Módulo 03 (9).
// Nada aqui é inventado; cada variante existe na fonte.
//
// Três generalizações sobre o contrato do brief da Wave 2, cada uma
// superconjunto estrito do que ele especifica, cada uma forçada pela fonte:
//
// 1. InstrumentKind vai de 3 para 9 membros. Os três do brief
//    (calculadora / controles / laboratorio) vêm do Módulo 01 e cobrem os 7
//    instrumentos dele. Os Módulos 02-03 acrescentam seis prefixos —
//    'simulador' sozinho tem 8 ocorrências, empatado com 'calculadora' como
//    o mais frequente do currículo.
// 2. `outputs: InstrumentOutput[]` no lugar de `outputLabel` + `outputUnit`.
//    Só ~7 dos 25 têm saída única (`.instrument-output`); 19 têm saída
//    múltipla (`.sim-readouts` com 4 readouts, `.case-data-grid` com 6
//    células). Saída única vira array de um; `Controles · Triângulo de
//    potência`, que não tem elemento de saída nenhum, vira array vazio.
// 3. `formula: string | null`. `Explorador · Camadas da rede` é consulta
//    pura — pill de camada dentro, seis campos descritivos fora. Não há
//    fórmula a exibir.
//
// O que NÃO precisou de extensão: as pills de preset (`.pill-row`, 4
// ocorrências) são select de escolha única renderizado como botões — mapeiam
// direto em `kind: 'select'` + `options`. O `.verdict` (15 ocorrências) é
// saída qualitativa derivada — vira um InstrumentOutput com `unit: null`.

/** Prefixo do título do instrumento na fonte ('Calculadora · ...').
 *  Nove valores observados nos Módulos 01-03. Os três primeiros são os
 *  do Módulo 01; os seis seguintes entram com os Módulos 02-03.
 *  Catálogo completo dos 54 instrumentos extraídos dos Módulos 01-07,
 *  agrupado por `kind` com a mecânica de cada um — e o registro de que
 *  nome de instrumento não decide `kind`, mecânica decide — está em
 *  `docs/alexandria/instrument-taxonomy.md`. Confirmado nesse documento
 *  (auditoria pós-Módulo 07): os 9 membros seguem suficientes. */
export type InstrumentKind =
  | 'calculadora'
  | 'controles'
  | 'laboratorio'
  | 'simulador'
  | 'comparador'
  | 'explorador'
  | 'cadeia-de-transformacao'
  | 'dimensionador'
  | 'quebra-cabeca'
  /** Décimo membro — LYCEUM Wave 34, Módulo 08 Inst · 04 ("Reconstrutor
   *  de matriz"). Mecânica genuinamente nova que nenhum dos 9 cobria: o
   *  aluno PRODUZ a resposta e só então vê a correção (a fonte declara
   *  "é o único do sistema Alexandria que exige que você produza a
   *  resposta antes de ver a correção"). Requer `correcaoSobDemanda`.
   *  Pendência: refletir no catálogo `docs/alexandria/instrument-taxonomy.md`
   *  (posse FOUNDRY). */
  | 'reconstrutor';

export interface InstrumentField {
  id: string;
  label: string;
  unit: string | null;
  kind: 'number' | 'range' | 'select';
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

/** Uma saída do instrumento. Instrumento de saída única tem um item;
 *  simulador tem quatro; explorador tem seis; `Controles · Triângulo de
 *  potência` tem zero, porque desenha um diagrama em vez de imprimir número. */
export interface InstrumentOutput {
  id: string;
  label: string;
  /** null em saída qualitativa — o `.verdict` da fonte. */
  unit: string | null;
}

/** Modo de correção sob demanda — LYCEUM Wave 34.
 *
 *  Capacidade OPCIONAL, ativada só por instrumento que declare precisar
 *  dela. Quando presente, o `InstrumentPanel` NÃO calcula ao vivo: as
 *  saídas e o veredito ficam ocultos até o aluno clicar no botão de
 *  correção, e o resultado revelado CONGELA até o próximo clique (fiel
 *  à fonte do Inst · 04 do Módulo 08, onde editar um campo não re-roda
 *  a checagem). Instrumento SEM este campo se comporta exatamente como
 *  antes — os 54 já portados não mudam.
 *
 *  `referencia` é o gabarito por id de campo — na fonte, `I4.ref`, com
 *  proveniência citada no próprio instrumento (balanço energético
 *  nacional, ano-base 2025). `tolerancia` é o `I4.tol` (3 pontos
 *  percentuais por fonte). Nova tentativa é permitida sem limite —
 *  confirmado no script da fonte, onde nada tranca após `i4check()`. */
export interface CorrecaoSobDemanda {
  /** Rótulo literal do botão de correção na fonte ('Corrigir esta rodada'). */
  botaoRotulo: string;
  /** Gabarito por id de campo. A comparação campo a campo (produzido ×
   *  referência × desvio, com a tolerância aplicada) é renderizada pelo
   *  painel; leituras derivadas (acertos, erro total, ordem, viés) são
   *  da calculadora do instrumento, como todo cálculo do sistema. */
  referencia: Record<string, number>;
  /** Tolerância de acerto por campo, na unidade do campo. */
  tolerancia: number;
  /** Botão opcional de normalização proporcional — reescala os campos da
   *  referência para somarem `alvo`, e re-roda a correção em seguida
   *  (comportamento literal da fonte: `i4inputs(); i4check()`). */
  normalizar?: { rotulo: string; alvo: number };
  /** Botão opcional de zerar — limpa os campos da referência e o
   *  resultado revelado. */
  zerarRotulo?: string;
}

export interface Instrument {
  id: string;                      // 'inst-01', 'lab-01' — mantém convenção da fonte
  kind: InstrumentKind;
  title: string;                   // 'Calculadora · kWh = kW × h'
  /** Fórmula legível, ex: 'kWh = kW × h'. null onde o instrumento é
   *  consulta e não cálculo. */
  formula: string | null;
  fields: InstrumentField[];
  outputs: InstrumentOutput[];
  note: string | null;             // texto de contexto, se existir na fonte
  /** Ver doc de `CorrecaoSobDemanda`. Ausente em todos os instrumentos
   *  exceto os que a fonte declara como produzir-antes-de-corrigir. */
  correcaoSobDemanda?: CorrecaoSobDemanda;
}

// ─── Glossário (LYCEUM Wave 8) ──────────────────────────────────────────
// Verbete do § Lex do módulo. Fonte: `details.glossary-item` em
// `Alexandria modulos/alexandria_modulo01.html` — `.term`, `.unit` e
// `.glossary-content` extraídos literalmente.

export interface GlossaryTerm {
  id: string;                      // 'gl-<slug do termo>'
  term: string;                    // literal do `.term`, ex: 'Fator de potência (FP)'
  /** Etiqueta de categoria — literal do `.unit` da fonte, ex: 'Corrente',
   *  'Instituição', 'Contrato'. Campo além do contrato do brief da Wave 8:
   *  é dado real da fonte, descartá-lo seria perda. */
  unit: string;
  /** HTML inline preservado da fonte (`<b>`, entidades). Renderizar com o
   *  mesmo idioma dos blocos de apostila. */
  definition: string;
  /** Aulas onde o termo genuinamente aparece no corpo extraído
   *  (`MODULO_01_CORPO` + lead + título). Vazio é estado honesto — CCEE,
   *  CUSD e PLD são definidos no § Lex mas o corpo do módulo não os usa. */
  aulaIds: string[];
}
