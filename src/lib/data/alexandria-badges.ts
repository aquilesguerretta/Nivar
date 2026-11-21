import type { Badge } from '@/lib/types/alexandria';

// Catálogo de badges da Alexandria. Duas procedências, nunca misturadas
// sem marca — cada entrada diz de onde veio.
//
// (A) REFERÊNCIA VISUAL já aprovada — o painel "Conquistas" e o rail de
//     `docs/alexandria/design-handoff/.../project/Alexandria Sistema.dc.html`.
//     Nome, critério e EXP são literais da tela, incluindo pontuação.
//
// (B) CHECKLIST REAL dos Módulos 01-03 em `Alexandria modulos/`. O critério
//     é o texto verbatim de um `.checklist-item`, com bloco e linha citados.
//     Os itens dos Módulos 02-03 não terminam em ponto na fonte e os do
//     Módulo 01 terminam — a diferença é da fonte, preservada de propósito.
//     Não "corrigir".
//
// O que é extraído e o que é atribuído: nome e critério de (A) e critério de
// (B) são extração. `category` e o `expReward` das entradas (B) são
// atribuição — o checklist não declara nem categoria nem pontuação. Os
// valores de EXP ficam na faixa 20/25/30 observada na referência.
//
// Escala: a referência mostra "12 de 31 badges", então o catálogo final tem
// ~31. Estes 13 são os que têm fonte hoje; o resto entra quando os Blocos
// 04-17 ganharem HTML.

export const ALEXANDRIA_BADGES: Badge[] = [
  // ── (A) Referência visual ────────────────────────────────────────────────

  /** Referência visual, L1912-1914. Conteúdo por trás é o Bloco 10
   *  (Tarifas e a Conta de Luz Industrial), que ainda não tem HTML. */
  {
    id: 'badge-anatomista-de-faturas',
    name: 'Anatomista de Faturas',
    criterion: 'Concluiu a aula da conta de luz industrial item por item.',
    category: 'conteudo',
    expReward: 25,
    iconAsset: null, // biblioteca de ícone de badge ainda não existe
  },

  /** Referência visual, L1918-1920. Depende de um Atlas interativo de
   *  submercados que a Alexandria ainda não tem. */
  {
    id: 'badge-cartografo-do-sin',
    name: 'Cartógrafo do SIN',
    criterion: 'Explorou os quatro submercados no Atlas interativo.',
    category: 'exploracao',
    expReward: 20,
    iconAsset: null,
  },

  /** Referência visual, L1924-1926. PLD / MRE / GSF são Bloco 09
   *  (Mercado ACR e ACL), sem HTML. A tela L1599 traz um segundo critério
   *  de desbloqueio para o mesmo badge ("12 questões + 1 estudo de caso");
   *  aqui vale o critério do próprio card do badge. */
  {
    id: 'badge-leitor-de-mercado',
    name: 'Leitor de Mercado',
    criterion: 'Acertou 90% das questões de PLD, MRE e GSF.',
    category: 'dominio',
    expReward: 30,
    iconAsset: null,
  },

  /** Referência visual, L1930-1932 — mostrado 'bloqueado' na própria tela.
   *  O limiar de 0,92 é corroborado de forma independente pelo checklist do
   *  Módulo 01, L2507: "Calcular fator de potência e explicar por que abaixo
   *  de 0,92 pode virar cobrança." Único badge com procedência dupla. */
  {
    id: 'badge-guardiao-fp',
    name: 'Guardião do Fator de Potência',
    criterion: 'Atinja 0,92 de FP médio em simulação tarifária.',
    category: 'dominio',
    expReward: 25,
    iconAsset: null,
  },

  // ── (B) Checklist do Módulo 01 · bloco-01 · Física de Energia ────────────

  /** Módulo 01, checklist item 1, L2497. A tese do módulo inteiro. */
  {
    id: 'badge-tradutor-kw-kwh',
    name: 'Tradutor de kW e kWh',
    criterion: 'Explicar kW vs kWh em 30 segundos, com exemplo numérico.',
    category: 'dominio',
    expReward: 25,
    iconAsset: null,
  },

  /** Módulo 01, checklist item 5, L2501. */
  {
    id: 'badge-fator-de-carga',
    name: 'Leitor de Fator de Carga',
    criterion:
      'Calcular fator de carga e interpretar o que ele significa operacionalmente.',
    category: 'dominio',
    expReward: 25,
    iconAsset: null,
  },

  /** Módulo 01, checklist item 6, L2502. */
  {
    id: 'badge-lei-de-ohm',
    name: 'Aluno de Ohm',
    criterion: 'Explicar a Lei de Ohm e por que perdas crescem com I².',
    category: 'dominio',
    expReward: 20,
    iconAsset: null,
  },

  // ── (B) Checklist do Módulo 02 · bloco-02 · Rede Elétrica ────────────────

  /** Módulo 02, checklist item 1, L2765. */
  {
    id: 'badge-cadeia-da-rede',
    name: 'Desenhista da Cadeia',
    criterion:
      'Desenhar num guardanapo a cadeia geração → transmissão → distribuição → consumo, com tensões típicas e dono de cada trecho',
    category: 'conteudo',
    expReward: 25,
    iconAsset: null,
  },

  /** Módulo 02, checklist item 11, L2775. */
  {
    id: 'badge-fronteira-do-ons',
    name: 'Fronteira do ONS',
    criterion:
      'Listar três coisas que o ONS faz e três que ele não faz, nomeando quem faz',
    category: 'dominio',
    expReward: 30,
    iconAsset: null,
  },

  /** Módulo 02, checklist item 15, L2779. */
  {
    id: 'badge-dez-segundos',
    name: 'Os Dez Segundos',
    criterion:
      'Narrar os dez segundos pós-perda de usina: inércia → regulação primária → CAG → ERAC',
    category: 'dominio',
    expReward: 30,
    iconAsset: null,
  },

  // ── (B) Checklist do Módulo 03 · bloco-03 · Tecnologias de Geração ───────

  /** Módulo 03, checklist item 1, L2467. */
  {
    id: 'badge-matriz-em-duas-lentes',
    name: 'Matriz em Duas Lentes',
    criterion:
      'Desenhar num guardanapo a matriz brasileira em capacidade E em energia — dois desenhos diferentes, com ordens de grandeza por fonte',
    category: 'conteudo',
    expReward: 25,
    iconAsset: null,
  },

  /** Módulo 03, checklist item 2, L2468. */
  {
    id: 'badge-fator-de-capacidade',
    name: 'Aferidor de Fator de Capacidade',
    criterion:
      'Definir fator de capacidade pela fórmula e citar as faixas típicas de hidro, eólica NE, solar e nuclear',
    category: 'dominio',
    expReward: 25,
    iconAsset: null,
  },

  /** Módulo 03, checklist item 16, L2482. */
  {
    id: 'badge-vacina-do-lcoe',
    name: 'Vacina do LCOE',
    criterion:
      'Calcular um LCOE didático no guardanapo e recitar os quatro limites como vacina',
    category: 'dominio',
    expReward: 30,
    iconAsset: null,
  },
];

/** Blocos cujo conteúdo existe hoje em HTML. Um badge só é honestamente
 *  conquistável se o conteúdo por trás dele existe — o progresso-mock usa
 *  esta lista para não marcar conquista sobre conteúdo inexistente. */
export const BLOCOS_COM_CONTEUDO = ['bloco-01', 'bloco-02', 'bloco-03'] as const;

/** Helpers de consulta — mesma convenção de `alexandria-blocks.ts`. */
export const getBadgeById = (id: string) =>
  ALEXANDRIA_BADGES.find((b) => b.id === id) ?? null;

export const getBadgesByCategory = (category: Badge['category']) =>
  ALEXANDRIA_BADGES.filter((b) => b.category === category);
