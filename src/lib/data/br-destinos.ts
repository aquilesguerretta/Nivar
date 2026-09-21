// src/lib/data/br-destinos.ts
// ARCHITECT — Portal BR Wave 1.
//
// Catálogo dos cinco destinos do lado brasileiro do GridAlpha. Um está
// disponível hoje; os outros quatro são antecipação declarada, não
// indisponibilidade — o DestinoCard trata os dois estados como leituras
// visuais distintas, nunca como "ativo" versus "desabilitado".
//
// Alexandria fica fora do prefixo de mercado de propósito: ela tem trilhas
// universal / brasil / usa. O portal BR aponta pra ela passando a trilha
// brasileira como padrão; o portal US futuro apontará pra mesma rota com
// trilha americana.
//
// DISCIPLINA DE LINGUAGEM, NÃO-NEGOCIÁVEL: nenhuma descrição promete
// economia garantida. "Oportunidades a validar", nunca "economize X%".
// Regra do projeto — vale em todo texto de face pública.

export type DestinoStatus = 'disponivel' | 'em-breve';

export interface DestinoBR {
  id: string;
  titulo: string;
  descricao: string;
  status: DestinoStatus;
  /** Rota interna quando disponível; null quando em breve. */
  rota: string | null;
}

export const DESTINOS_BR: DestinoBR[] = [
  {
    id: 'alexandria',
    titulo: 'Alexandria',
    descricao:
      'Biblioteca de energia — do zero à fluência profissional no setor elétrico brasileiro.',
    status: 'disponivel',
    rota: '/alexandria?trilha=brasil',
  },
  {
    id: 'terminal-brasil',
    titulo: 'Terminal Brasil',
    descricao:
      'Investigação por território, mudança e cadeia de evidência — demonstração com base sintética.',
    status: 'em-breve',
    rota: null,
  },
  {
    id: 'energy-brief',
    titulo: 'Energy Brief',
    descricao: 'Boletim semanal de inteligência do mercado de energia brasileiro.',
    status: 'em-breve',
    rota: null,
  },
  {
    id: 'conta-de-luz-express',
    titulo: 'Conta de Luz Express',
    descricao:
      'Análise independente de fatura industrial — modalidade, demanda e oportunidades a validar.',
    // Wave 2 de Conta de Luz Express: a superfície de intake existe em
    // rota de TOPO (main.tsx), no mesmo precedente da Alexandria acima.
    // Virar estes dois campos é o que faz a página de família renderizar
    // "Aberto →" sozinha — nenhum componente muda para isso.
    status: 'disponivel',
    rota: '/conta-de-luz-express',
  },
  {
    id: 'solar-proposal-validator',
    titulo: 'Solar Proposal Validator',
    descricao:
      'Análise independente de proposta solar — enquadramento, regime de compensação e premissas a validar.',
    // Solar Proposal Validator Wave 2: REGISTRADO, não ativado. O id já
    // existe no PRODUCT_CATALOG do backend e o router está no ar
    // (CURSOR Wave 2), mas abrir o produto é a próxima wave — regra
    // absoluta desta. Virar é o mesmo par de campos da CLE:
    // status: 'disponivel' + rota: '/solar-proposal-validator' (a rota
    // de topo já existe em main.tsx; a página roda em demonstração).
    status: 'em-breve',
    rota: null,
  },
  {
    id: 'diagnostico-energetico',
    titulo: 'Diagnóstico Energético',
    descricao: 'Análise 360° do custo energético de uma operação industrial.',
    // Diagnóstico Energético Wave 2: REGISTRADO, não ativado — mesma
    // disciplina da Solar. A rota de topo `/diagnostico-energetico` já
    // existe em main.tsx e a página roda em demonstração, mas o
    // catálogo não anuncia: a família mostra "Em construção" sem link.
    // Abrir é a wave de ativação, e é o mesmo par de campos:
    // status: 'disponivel' + rota: '/diagnostico-energetico'.
    status: 'em-breve',
    rota: null,
  },
];
