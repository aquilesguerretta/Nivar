// src/lib/operador/mock.ts
// ARCHITECT — Portal do Operador Wave 2, Fase 4.
//
// A fila de amostra. **Nada aqui é dado real, e a tela diz isso** — o
// carimbo `.nv-frescor--ilustrativa` fica no topo de toda superfície que
// consome este módulo.
//
// ─── ZERO REDE ───────────────────────────────────────────────────────
// Este arquivo não importa cliente de API e não faz `fetch`. O endpoint
// de fila não existe: a recon da CURSOR mediu que
// `GET {prefixo}/submissions` é escopado à conta de quem pede, e que
// `GET /api/operator/conversations` lista conversa, não submissão. A
// wave de ligação troca este módulo por leitura real.
//
// ─── O FORMATO SEGUE O CONTRATO REAL, NÃO O CONTRÁRIO ────────────────
// Os campos abaixo são os que os clientes de verdade já devolvem
// (`src/lib/submissoes/api.ts:39-51` e `src/lib/diagnostico/api.ts:29`),
// para a wave de ligação ser troca de origem e não reescrita de tela:
//
//   · `status` só existe em CLE e Solar, e só assume 'submitted' ou
//     'ready'. Diagnóstico NÃO TEM o campo — aqui ele é `null`, e a
//     coluna declara a ausência em vez de inventar um terceiro valor.
//   · `createdAt` é ISO, como vem do backend.
//   · `deliveredAt` só é preenchido com `status: 'ready'`.
//
// ─── O NOME DO CLIENTE É A MAIOR LICENÇA DESTE ARQUIVO ───────────────
// O backend devolve `userId` OPACO — a recon da CURSOR mediu que a
// listagem não faz join com `users`, então nome e e-mail não chegam. Os
// nomes abaixo são inventados para a coluna ter forma; na wave de
// ligação, ou o join existe, ou a coluna passa a declarar ausência como
// o `status` do Diagnóstico já faz. Registrado para ninguém confundir
// "a tela mostra" com "o dado existe".

/** Uma linha da fila. União dos três produtos: o que é específico de um
 *  vira campo opcional, e o que um produto não tem é `null` explícito —
 *  nunca ausência silenciosa. */
export interface PedidoNaFila {
  id: string;
  produtoId: string;
  /** Inventado — o backend não devolve nome (ver cabeçalho). */
  cliente: string;
  /** ISO, como o backend devolve. */
  criadoEm: string;
  /** `null` para produto sem vocabulário de estado (Diagnóstico). */
  status: 'submitted' | 'ready' | null;
  entregueEm: string | null;
  /** Nome do arquivo que chegou. `null` quando o produto não recebe
   *  arquivo — que é o caso do Diagnóstico, e é a diferença que faz a
   *  tela de detalhe dele ter outra forma. */
  arquivo: string | null;
}

/** Base fixa para os carimbos. Data ABSOLUTA e não `Date.now()` menos
 *  N: com base móvel a fila mudaria de idade a cada render, e uma
 *  captura de tela nunca bateria com a seguinte. O `agora` da amostra
 *  viaja junto, para as idades serem estáveis e reproduzíveis. */
export const AGORA_DA_AMOSTRA = new Date('2026-09-03T14:00:00-03:00');

const h = (horas: number) =>
  new Date(AGORA_DA_AMOSTRA.getTime() - horas * 3_600_000).toISOString();

export const FILA_MOCK: PedidoNaFila[] = [
  {
    id: 'cle-8f2a',
    produtoId: 'conta-de-luz-express',
    cliente: 'Metalúrgica Vale Verde',
    criadoEm: h(103),
    status: 'submitted',
    entregueEm: null,
    arquivo: 'fatura-julho.pdf',
  },
  {
    id: 'sol-3c71',
    produtoId: 'solar-proposal-validator',
    cliente: 'Condomínio Alto da Serra',
    criadoEm: h(76),
    status: 'submitted',
    entregueEm: null,
    arquivo: 'proposta-comercial.pdf',
  },
  {
    id: 'dia-0b19',
    produtoId: 'diagnostico-energetico',
    cliente: 'Frigorífico Serra Azul',
    criadoEm: h(52),
    status: null,
    entregueEm: null,
    arquivo: null,
  },
  {
    id: 'cle-1d44',
    produtoId: 'conta-de-luz-express',
    cliente: 'Padaria Trigo de Ouro',
    criadoEm: h(29),
    status: 'ready',
    entregueEm: h(4),
    arquivo: 'conta-agosto.jpg',
  },
  {
    id: 'dia-77e3',
    produtoId: 'diagnostico-energetico',
    cliente: 'Lavanderia Industrial Nortex',
    criadoEm: h(11),
    status: null,
    entregueEm: null,
    arquivo: null,
  },
  {
    id: 'sol-9a05',
    produtoId: 'solar-proposal-validator',
    cliente: 'Hotel Praia do Meio',
    criadoEm: h(3),
    status: 'submitted',
    entregueEm: null,
    arquivo: 'orcamento-solar-v2.pdf',
  },
  {
    id: 'cle-5e60',
    produtoId: 'conta-de-luz-express',
    cliente: 'Clínica São Bento',
    criadoEm: h(0.4),
    status: 'submitted',
    entregueEm: null,
    arquivo: 'fatura.png',
  },
];

/** A fila de um produto, ou tudo. Filtro, não consulta. */
export function filaDe(produtoId?: string): PedidoNaFila[] {
  return produtoId ? FILA_MOCK.filter((p) => p.produtoId === produtoId) : FILA_MOCK;
}

export function pedidoPorId(id: string): PedidoNaFila | undefined {
  return FILA_MOCK.find((p) => p.id === id);
}

/** Quantos pedidos ainda não foram respondidos. É o número do indicador
 *  de notificação do console — o outro canal (e-mail) já existe e é do
 *  backend. `null` de status conta como não respondido: o Diagnóstico
 *  não tem estado, mas tem pedido esperando. */
export function pendentes(produtoId?: string): number {
  return filaDe(produtoId).filter((p) => p.status !== 'ready').length;
}

// ─── O QUE CADA DETALHE MOSTRA ───────────────────────────────────────
// Campos por natureza de pedido. Os três blocos abaixo NÃO são invenção
// de UI: cada um sai da copy pública do próprio produto, que é o
// contrato que a casa já assumiu com o cliente.

/** Ficha do Diagnóstico — os quatro campos que o cliente preenche, nos
 *  nomes exatos de `src/lib/diagnostico/api.ts:29-40`. `tariffModality`
 *  é `null` quando o cliente não sabe dizer, e "não sei" NUNCA viaja
 *  como texto — o backend converte string vazia em `null`. */
export interface FichaDiagnostico {
  sector: string;
  monthlyConsumptionBand: string;
  tariffModality: string | null;
  concern: string;
}

/** Uma mensagem do fio. `role` vem do SERVIDOR
 *  (`src/lib/conversas/api.ts:23-25`): `customer` é o dono da conta,
 *  qualquer outro papel é operador. */
export interface MensagemMock {
  id: string;
  role: 'customer' | 'operator';
  body: string;
  createdAt: string;
}

export const FICHAS_MOCK: Record<string, FichaDiagnostico> = {
  'dia-0b19': {
    sector: 'Frigorífico / processamento de carnes',
    monthlyConsumptionBand: '150 a 500 MWh/mês',
    tariffModality: 'Azul A4',
    concern:
      'A conta subiu 30% de maio para agosto sem a produção ter mudado. Suspeito de ultrapassagem de demanda, mas não sei ler a fatura para confirmar.',
  },
  'dia-77e3': {
    sector: 'Lavanderia industrial',
    monthlyConsumptionBand: '30 a 150 MWh/mês',
    tariffModality: null,
    concern:
      'Recebi proposta de mercado livre e quero entender se faz sentido antes de assinar qualquer coisa.',
  },
};

export const FIO_MOCK: Record<string, MensagemMock[]> = {
  'dia-0b19': [
    {
      id: 'm1',
      role: 'customer',
      body: 'Enviei o escopo. Consigo mandar a fatura por aqui se ajudar.',
      createdAt: h(51),
    },
    {
      id: 'm2',
      role: 'operator',
      body: 'Recebido. Vou precisar das páginas de demanda dos últimos três ciclos — pode anexar quando puder.',
      createdAt: h(30),
    },
  ],
  'dia-77e3': [],
};

/** Anatomia da fatura — os campos que o operador extrai de TODA fatura,
 *  sempre os mesmos. Saem da copy pública da CLE, passo 2: "Modalidade
 *  tarifária, demanda contratada e medida, tributos e encargos."
 *  A ordem é a da leitura da fatura, não alfabética. */
export const ANATOMIA_FATURA: { chave: string; rotulo: string; unidade?: string }[] = [
  { chave: 'distribuidora', rotulo: 'Distribuidora' },
  { chave: 'modalidade', rotulo: 'Modalidade tarifária' },
  { chave: 'subgrupo', rotulo: 'Subgrupo' },
  { chave: 'demandaContratada', rotulo: 'Demanda contratada', unidade: 'kW' },
  { chave: 'demandaMedida', rotulo: 'Demanda medida', unidade: 'kW' },
  { chave: 'ultrapassagem', rotulo: 'Ultrapassagem', unidade: 'kW' },
  { chave: 'consumoPonta', rotulo: 'Consumo ponta', unidade: 'kWh' },
  { chave: 'consumoForaPonta', rotulo: 'Consumo fora ponta', unidade: 'kWh' },
  { chave: 'tributos', rotulo: 'Tributos' },
  { chave: 'encargos', rotulo: 'Encargos' },
];

/** As duas trilhas de leitura da proposta solar. Copy pública, passo 2:
 *  a regulatória "verifica porte, modalidade e regime de compensação";
 *  a técnica "confronta geração estimada, degradação e trajetória
 *  tarifária contra referência citável". */
export const TRILHAS_SOLAR = ['regulatória', 'técnica'] as const;
export type TrilhaSolar = (typeof TRILHAS_SOLAR)[number];

/** A classificação de cada linha da proposta. Copy pública, passo 3 —
 *  os quatro valores são literais dela, não escala inventada:
 *  "fato com fonte, premissa ancorada, premissa não ancorada ou
 *  embutida por omissão". */
export const NATUREZAS_SOLAR = [
  'fato com fonte',
  'premissa ancorada',
  'premissa não ancorada',
  'embutida por omissão',
] as const;
export type NaturezaSolar = (typeof NATUREZAS_SOLAR)[number];

/** Uma linha do livro-razão do Solar. A copy promete, por linha, a
 *  natureza mais "as perguntas de negociação e a base normativa
 *  citada" — as três colunas de trabalho saem daí. */
export interface LinhaProposta {
  id: string;
  trilha: TrilhaSolar;
  /** O que a proposta afirma, na letra dela. */
  afirmacao: string;
  natureza: NaturezaSolar | null;
  pergunta: string;
  baseNormativa: string;
}

export const LIVRO_RAZAO_MOCK: Record<string, LinhaProposta[]> = {
  'sol-3c71': [
    {
      id: 'l1',
      trilha: 'regulatória',
      afirmacao: 'Sistema de 92 kWp enquadrado em microgeração distribuída.',
      natureza: null,
      pergunta: '',
      baseNormativa: '',
    },
    {
      id: 'l2',
      trilha: 'regulatória',
      afirmacao: 'Compensação integral dos créditos por 25 anos.',
      natureza: null,
      pergunta: '',
      baseNormativa: '',
    },
    {
      id: 'l3',
      trilha: 'técnica',
      afirmacao: 'Geração média de 11.400 kWh/mês no primeiro ano.',
      natureza: null,
      pergunta: '',
      baseNormativa: '',
    },
    {
      id: 'l4',
      trilha: 'técnica',
      afirmacao: 'Payback de 3,2 anos considerando reajuste tarifário de 8% ao ano.',
      natureza: null,
      pergunta: '',
      baseNormativa: '',
    },
  ],
  'sol-9a05': [
    {
      id: 'l1',
      trilha: 'regulatória',
      afirmacao: 'Enquadramento em minigeração, modalidade autoconsumo remoto.',
      natureza: null,
      pergunta: '',
      baseNormativa: '',
    },
  ],
};
