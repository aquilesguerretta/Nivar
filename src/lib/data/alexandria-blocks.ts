import type { CurriculumBlock } from '@/lib/types/alexandria';

/** Os 17 blocos do Currículo Definitivo da GridAlpha.
 *  Fonte: GridAlpha_Curriculo_Definitivo.docx
 *  Valores 'confirmar' / null = fonte primária não declara. */
export const ALEXANDRIA_BLOCKS: CurriculumBlock[] = [
  { id: 'bloco-01', number: 1,  level: 1, title: 'Física de Energia e Eletricidade',         track: 'universal', illustrationPrefix: 'fis-', priority: 'media',      estimatedHoursMin: 4,    estimatedHoursMax: 6 },
  { id: 'bloco-02', number: 2,  level: 1, title: 'Como Funciona uma Rede Elétrica',          track: 'universal', illustrationPrefix: 'red-', priority: 'confirmar',  estimatedHoursMin: null, estimatedHoursMax: null },
  { id: 'bloco-03', number: 3,  level: 1, title: 'Tecnologias de Geração',                   track: 'universal', illustrationPrefix: 'ger-', priority: 'confirmar',  estimatedHoursMin: null, estimatedHoursMax: null },
  { id: 'bloco-04', number: 4,  level: 1, title: 'Economia de Mercados de Energia',          track: 'universal', illustrationPrefix: null,   priority: 'media',      estimatedHoursMin: 3,    estimatedHoursMax: 4 },
  { id: 'bloco-05', number: 5,  level: 1, title: 'Regulação e Desenho de Mercados',          track: 'universal', illustrationPrefix: null,   priority: 'media',      estimatedHoursMin: 3,    estimatedHoursMax: 5 },
  { id: 'bloco-06', number: 6,  level: 2, title: 'História do Setor Elétrico Brasileiro',    track: 'brasil',    illustrationPrefix: 'his-', priority: 'alta',       estimatedHoursMin: 3,    estimatedHoursMax: 4 },
  { id: 'bloco-07', number: 7,  level: 2, title: 'Estrutura Institucional Detalhada',        track: 'brasil',    illustrationPrefix: 'ins-', priority: 'maxima',     estimatedHoursMin: 6,    estimatedHoursMax: 8 },
  { id: 'bloco-08', number: 8,  level: 2, title: 'Matriz Elétrica',                          track: 'brasil',    illustrationPrefix: 'mat-', priority: 'confirmar',  estimatedHoursMin: null, estimatedHoursMax: null },
  { id: 'bloco-09', number: 9,  level: 2, title: 'Mercado ACR e ACL',                        track: 'brasil',    illustrationPrefix: 'mer-', priority: 'confirmar',  estimatedHoursMin: null, estimatedHoursMax: null },
  { id: 'bloco-10', number: 10, level: 2, title: 'Tarifas e a Conta de Luz Industrial',      track: 'brasil',    illustrationPrefix: 'tar-', priority: 'maxima',     estimatedHoursMin: 8,    estimatedHoursMax: 10 },
  { id: 'bloco-11', number: 11, level: 2, title: 'Energia Solar e Análise de Propostas',     track: 'brasil',    illustrationPrefix: null,   priority: 'confirmar',  estimatedHoursMin: null, estimatedHoursMax: null },
  { id: 'bloco-12', number: 12, level: 2, title: 'Geopolítica Energética do Brasil',         track: 'brasil',    illustrationPrefix: 'geo-', priority: 'alta',       estimatedHoursMin: 4,    estimatedHoursMax: 5 },
  { id: 'bloco-13', number: 13, level: 3, title: 'Análise Financeira de Empresas e Projetos',track: 'brasil',    illustrationPrefix: null,   priority: 'media-alta', estimatedHoursMin: 4,    estimatedHoursMax: 5 },
  { id: 'bloco-14', number: 14, level: 3, title: 'Biocombustíveis e Bioenergia',             track: 'brasil',    illustrationPrefix: null,   priority: 'media',      estimatedHoursMin: 2,    estimatedHoursMax: 2 },
  { id: 'bloco-15', number: 15, level: 3, title: 'Petróleo, Gás e Petrobras',                track: 'brasil',    illustrationPrefix: null,   priority: 'media',      estimatedHoursMin: 2,    estimatedHoursMax: 2 },
  { id: 'bloco-16', number: 16, level: 3, title: 'Tendências e Disrupções',                  track: 'brasil',    illustrationPrefix: null,   priority: 'media',      estimatedHoursMin: 2,    estimatedHoursMax: 3 },
  { id: 'bloco-17', number: 17, level: 3, title: 'Cenário Internacional Comparativo',        track: 'brasil',    illustrationPrefix: null,   priority: 'media-alta', estimatedHoursMin: 2,    estimatedHoursMax: 3 },
];

/** Helpers de consulta. */
export const getBlockById = (id: string) =>
  ALEXANDRIA_BLOCKS.find(b => b.id === id) ?? null;

export const getBlocksByLevel = (level: 1 | 2 | 3) =>
  ALEXANDRIA_BLOCKS.filter(b => b.level === level);

export const getBlocksByTrack = (track: 'universal' | 'brasil' | 'usa') =>
  ALEXANDRIA_BLOCKS.filter(b => b.track === track);
