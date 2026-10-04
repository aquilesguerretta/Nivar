import type {
  CurriculumLevel,
  CurriculumModule,
  CurriculumTrilha,
} from '@/lib/types/alexandria';
import { getBlocksByLevel } from './alexandria-blocks';

/** Contagem real de aulas, extraída do HTML de cada módulo em
 *  `Alexandria modulos/`. Um bloco só entra aqui quando o HTML existe.
 *
 *  Método de contagem — três sinais independentes, todos concordando:
 *  1. marcadores `.aula-marker` com `Aula NN` (aulas reais)
 *  2. marcadores `.aula-marker` com `§ ...` (aparato: filosofia, mapa,
 *     caso, quiz, glossário, checklist — mesma classe `.aula`, não são aula)
 *  3. o que o próprio hero anuncia em prosa
 *
 *  | módulo | `.aula` bruto | `Aula NN` | `§` aparato | hero        |
 *  | ------ | ------------- | --------- | ----------- | ----------- |
 *  | 01     | 19            | 9         | 10          | "Nove aulas"|
 *  | 02     | 20            | 10        | 10          | "Dez aulas" |
 *  | 03     | 20            | 10        | 10          | "Dez aulas" |
 *  | 04     | —             | 7         | 10          | "Sete aulas"|
 *  | 05     | —             | 6         | 10          | mapa de 6   |
 *
 *  Os Módulos 04 e 05 não entram na coluna de `.aula` bruto porque não
 *  usam essa marcação: a fonte dos dois tem vocabulário próprio (`sec-id`
 *  delimita seção, e `class="aula"` ocorre ZERO vez). A contagem vem das
 *  divisões `sec-id` — 17 no Módulo 04 (7 aulas + 10 aparato) e 16 no
 *  Módulo 05 (6 aulas + 10 aparato). O § MAP do 04 anuncia "Sete aulas"; o
 *  do 05 desenha um mapa com seis cartões, um por aula, e os seis títulos
 *  batem 1:1 com os `<h3>` da fonte. LYCEUM Waves 24 e 25.
 *
 *  | 06     | —             | 6         | 10          | "Seis aulas"|
 *
 *  O Módulo 06 usa o MESMO vocabulário abreviado dos 04-05 (medido antes
 *  de escolher extrator: `class="aula"` ocorre zero vez). São 16 seções
 *  `sec-id` — 6 casam `Aula NN`, 10 são aparato — e o § MAP anuncia
 *  "Seis aulas". LYCEUM Wave 29.
 *
 *  Blocos 10-17 ficam fora deste mapa de propósito — não têm HTML no
 *  repositório, e estimar seria inventar. */
const AULAS_POR_BLOCO: Record<string, number> = {
  'bloco-01': 9,   // Física de Energia e Eletricidade
  'bloco-02': 10,  // Como Funciona uma Rede Elétrica
  'bloco-03': 10,  // Tecnologias de Geração
  'bloco-04': 7,   // Economia de Mercados de Energia
  'bloco-05': 6,   // Regulação e Desenho de Mercados
  // Primeiro bloco do Nível 2 / track 'brasil' — a Trilha 2 deixa de
  // ter contagem desconhecida e passa a 6 aulas em 1 de 7 módulos.
  'bloco-06': 6,   // História do Setor Elétrico Brasileiro
  // Segundo módulo da Trilha 2. Mesma medição: 17 seções `sec-id`,
  // das quais 7 casam `Aula NN` e 10 são aparato. LYCEUM Wave 30.
  'bloco-07': 7,   // Estrutura Institucional Detalhada
  // Terceiro módulo da Trilha 2. 17 seções `sec-id`, das quais 7 casam
  // `Aula NN` e 10 são aparato. LYCEUM Wave 32.
  'bloco-08': 7,   // Matriz Elétrica
  // Quarto módulo da Trilha 2, e o primeiro com OITO aulas: 18 seções
  // `sec-id`, das quais 8 casam `Aula NN` e 10 são aparato.
  // LYCEUM Wave 37.
  'bloco-09': 8,   // Mercado ACR e ACL
  // Quinto módulo da Trilha 2. 19 seções `sec-id` — 9 casam `Aula NN`,
  // 10 são aparato. A cobertura de TEXTO ficou entre 93,0% e 96,6% nas
  // nove, medida depois de recuperar `div.fi`, `div.chain` e `div.form`,
  // que o extrator herdado descartava em silêncio. LYCEUM Wave 41.
  'bloco-10': 9,   // Tarifas e a Conta de Luz Industrial
  // Sexto módulo da Trilha 2. 18 seções `sec-id` — 8 casam `Aula NN`,
  // 10 são aparato. Terceira variante de vocabulário da série. O título
  // real da fonte ("Geração Distribuída e a Anatomia de uma Proposta
  // Solar") diverge do catálogo, que traz o derivado da Wave 1 com
  // priority 'confirmar'. LYCEUM Wave 42.
  'bloco-11': 8,   // Energia Solar e Análise de Propostas (título do catálogo)
  // SÉTIMO e último módulo da Trilha 2 — e é ele que a FECHA. 18 seções
  // `sec-id`: 8 casam `Aula NN`, 10 são aparato. Com este bloco nenhum
  // módulo do Nível 2 tem `totalAulas: null`, então `totalAulasPartial`
  // da Trilha 2 passa a `false` SOZINHO — o campo é derivado, não
  // digitado. Mesmo evento que a Wave 25 tratou para a Trilha 1.
  // LYCEUM Wave 44.
  'bloco-12': 8,   // Geopolítica Energética do Brasil
  // PRIMEIRO módulo da Trilha 3 (level 3). O track permanece
  // 'brasil' — a Trilha 3 não introduz track novo, confirmado no
  // catálogo. 18 seções `sec-id`, das quais 8 casam `Aula NN`.
  // LYCEUM Wave 45.
  'bloco-13': 8,   // Análise Financeira de Empresas e Projetos
  // SEGUNDO módulo da Trilha 3 (level 3), e o primeiro do currículo a
  // integrar vocabulário de commodity agrícola a vocabulário de energia
  // (ano-safra, ATR, mix açúcar-etanol, bagaço, CBIO). Track segue
  // 'brasil', confirmado no catálogo. 18 seções `sec-id`, das quais 8
  // casam `Aula NN`. Cobertura de texto 99,5-99,9% nas oito.
  // LYCEUM Wave 46.
  'bloco-14': 8,   // Biocombustíveis e Bioenergia
  // TERCEIRO módulo da Trilha 3 (level 3), track 'brasil' — a Trilha 3
  // NÃO introduz track novo, só muda o `level`. 19 seções sec-id, das
  // quais 9 casam "Aula NN"; os quatro sinais da fonte concordam (9
  // aulas, 10 instrumentos, 15 exercícios, 174 termos). Cobertura de
  // texto POR PALAVRA entre 93,4% e 100% nas nove, agregado 98,9%.
  // LYCEUM Wave 47.
  'bloco-15': 9,   // Petróleo, Gás e Petrobras
  // QUARTO módulo da Trilha 3 (level 3). A fonte é a maior do
  // currículo (438 KB) e a primeira com entidade HTML nomeada em
  // massa: 7.842 em 29 tipos, contra ZERO no Módulo 12 — sem
  // decodificar, todo texto extraído sairia corrompido. 21 seções
  // sec-id, das quais 10 casam "Aula NN". Cobertura de texto por
  // token entre 99,2% e 99,9% nas dez. LYCEUM Wave 48.
  'bloco-16': 10,  // Tendências e Disrupções
  // ÚLTIMO bloco do currículo planejado (level 3). O track segue
  // 'brasil' pelo terceiro módulo seguido da Trilha 3 — comparar
  // jurisdições estrangeiras não muda de quem é o currículo.
  // 22 seções `sec-id`: 11 casam `Aula NN` e 11 são aparato (uma a
  // mais que o padrão de dez — existe um §Fichas próprio). Onze é
  // o maior número de aulas de um módulo do currículo. Cobertura
  // de texto por palavra 99,8-100% nas onze. LYCEUM Wave 49.
  'bloco-17': 11,  // Cenário Internacional Comparativo
};

const TRILHA_ID_BY_LEVEL: Record<CurriculumLevel, string> = {
  1: 'trilha-fundamentos-universais',
  2: 'trilha-setor-eletrico-brasileiro',
  3: 'trilha-especializacao-estrategica',
};

/** Um módulo por bloco, 1:1. `id` carrega o índice global do bloco, para
 *  ser estável se as trilhas forem reagrupadas depois; `number` é a
 *  posição de exibição dentro da trilha ("Módulo 3 de 7"). Para o Nível 1
 *  os dois coincidem, o que bate com os nomes dos arquivos de origem
 *  (`alexandria_modulo01.html` = bloco-01 = módulo 1 da trilha 1).
 *  Título vem do bloco — nunca digitado de novo, nunca diverge. */
function buildModules(level: CurriculumLevel): CurriculumModule[] {
  const blocks = getBlocksByLevel(level);
  const trilhaId = TRILHA_ID_BY_LEVEL[level];

  return blocks.map((block, index) => ({
    id: `modulo-${String(block.number).padStart(2, '0')}`,
    trilhaId,
    number: index + 1,
    totalInTrilha: blocks.length,
    title: block.title,
    blockId: block.id,
    totalAulas: AULAS_POR_BLOCO[block.id] ?? null,
  }));
}

/** Os 17 módulos, um por bloco do Currículo Definitivo. */
export const ALEXANDRIA_MODULES: CurriculumModule[] = [
  ...buildModules(1),
  ...buildModules(2),
  ...buildModules(3),
];

/** Soma só o que tem fonte. null quando nenhum módulo da trilha tem
 *  contagem — 'desconhecido', não 'zero'. */
function sumKnownAulas(modules: CurriculumModule[]): number | null {
  const known = modules.filter((m): m is CurriculumModule & { totalAulas: number } =>
    m.totalAulas !== null,
  );
  return known.length > 0 ? known.reduce((sum, m) => sum + m.totalAulas, 0) : null;
}

/** Uma trilha por nível — decisão v1. O tipo permite trilha
 *  transversal a níveis no futuro (ex: por persona); esta
 *  é a estrutura mais simples defensável para o primeiro ship.
 *
 *  Procedência dos títulos, os três estados são diferentes:
 *
 *  - Nível 1 — LITERAL CONFIRMADO. Aparece na forma exata
 *    'Nível 1 — Fundamentos Universais' no rodapé dos Módulos 02 e 03, e
 *    como 'Nível 1 · Fundamentos Universais · Módulo NN' no hero dos três.
 *  - Nível 2 — NÃO CONFIRMADO. Herdado do brief da Wave 2, derivado da
 *    descrição em prosa do currículo.
 *  - Nível 3 — NÃO CONFIRMADO. O brief o declara literal, mas não há
 *    ocorrência em nenhuma fonte disponível.
 *
 *  As seis menções a 'Nível' nos três HTML são todas ao Nível 1 — os
 *  módulos dos Níveis 2 e 3 ainda não têm HTML, e o
 *  GridAlpha_Curriculo_Definitivo.docx não está no repositório. Os títulos
 *  2 e 3 ficam válidos por decisão, não por extração; reconfirmar quando a
 *  fonte primária entrar.
 *
 *  Contagem de aula por trilha, no fechamento da Wave 2:
 *  - Nível 1 → 29 aulas confirmadas em 3 dos 5 módulos. Parcial.
 *  - Nível 2 → nenhum dos 7 módulos tem HTML. Desconhecida.
 *  - Nível 3 → nenhum dos 5 módulos tem HTML. Desconhecida. */
function buildTrilha(
  level: CurriculumLevel,
  title: string,
  description: string,
  track: CurriculumTrilha['track'],
): CurriculumTrilha {
  const modules = ALEXANDRIA_MODULES.filter(
    (m) => m.trilhaId === TRILHA_ID_BY_LEVEL[level],
  );

  return {
    id: TRILHA_ID_BY_LEVEL[level],
    title,
    description,
    level,
    track,
    language: 'pt-BR',
    moduleIds: modules.map((m) => m.id),
    totalAulas: sumKnownAulas(modules),
    totalAulasPartial: modules.some((m) => m.totalAulas === null),
  };
}

export const ALEXANDRIA_TRILHAS: CurriculumTrilha[] = [
  buildTrilha(
    1,
    'Fundamentos Universais',
    'Física de energia, redes, tecnologias de geração, economia e regulação de mercado — a base que qualquer profissional de energia precisa, em qualquer país.',
    'universal',
  ),
  buildTrilha(
    2,
    'Setor Elétrico Brasileiro',
    'Instituições, matriz, mercado ACR/ACL, tarifas e geopolítica — o diferencial competitivo, onde mora a maior densidade do currículo.',
    'brasil',
  ),
  buildTrilha(
    3,
    'Especialização Estratégica',
    'Análise financeira, biocombustíveis, petróleo e gás, tendências e cenário internacional — o que diferencia de qualquer outro fundador estudante.',
    'brasil',
  ),
];

/** Helpers de consulta — mesma convenção de `alexandria-blocks.ts`. */
export const getTrilhaById = (id: string) =>
  ALEXANDRIA_TRILHAS.find((t) => t.id === id) ?? null;

export const getTrilhaByLevel = (level: CurriculumLevel) =>
  ALEXANDRIA_TRILHAS.find((t) => t.level === level) ?? null;

export const getModuleById = (id: string) =>
  ALEXANDRIA_MODULES.find((m) => m.id === id) ?? null;

export const getModulesByTrilha = (trilhaId: string) =>
  ALEXANDRIA_MODULES.filter((m) => m.trilhaId === trilhaId);
