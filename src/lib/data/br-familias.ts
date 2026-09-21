// src/lib/data/br-familias.ts
// ARCHITECT — Portal BR Wave 8.
//
// As CINCO FAMÍLIAS COMERCIAIS da casa. O design system declara: "A casa
// marca as cinco famílias comerciais, não os 44 produtos. Cada produto
// herda a marca da família e se identifica pelo nome."
//
// ARQUIVO NOVO, nada modificado. `br-destinos.ts` é a fonte dos produtos
// e continua intocada — este módulo só a LÊ e acrescenta a camada de
// família por cima. Se um destino mudar de título, descrição, status ou
// rota lá, a página de família acompanha sozinha; nada é redigitado aqui.
//
// ─── EXTRAÇÃO × ATRIBUIÇÃO, declarado ────────────────────────────────
// EXTRAÍDO, literal do design system (`readme.md`, tabela "Arquitetura de
// marca"): o nome das cinco famílias, o hex de cada uma e a linha de
// DOMÍNIO. Nenhuma dessas strings foi escrita aqui.
//
// ATRIBUÍDO pelo implementador, sujeito a veto: qual produto pertence a
// qual família. A lista pública continua plana em `br-destinos.ts`; esta
// camada registra o vínculo comercial. A fronteira revisada desta wave
// torna Terminal Brasil e Energy Brief instrumentos de Intelligence /
// Argos, enquanto Ariadne permanece como continuidade privada de
// Software. Cada atribuição está justificada em `porQue` abaixo.
//
// ─── HARDWARE FICA VAZIA, E ISSO É O ESTADO REAL ─────────────────────
// Nenhum dos cinco produtos catalogados é medição em campo, telemetria
// ou ativo físico. A regra da wave é não inventar produto fora do
// catálogo, então a família aparece com a lista vazia e a página declara
// isso em texto — mesma disciplina de honestidade de nulo que o resto do
// projeto usa. Os 44 produtos do plano de negócios não estão no
// repositório; só estes cinco estão.

import { DESTINOS_BR, type DestinoBR } from './br-destinos';

export type FamiliaId = 'hardware' | 'academy' | 'software' | 'advisory' | 'intelligence';

export interface FamiliaBR {
  id: FamiliaId;
  /** Nome de exibição — literal do design system. */
  nome: string;
  /** Linha de domínio — VERBATIM da tabela de arquitetura de marca. */
  dominio: string;
  /** Hex literal da escala de incandescência (colors.css, linha 3). */
  hex: string;
  /** Token semântico correspondente, para uso em CSS. */
  token: string;
  /** Parágrafo de página — COPY DO IMPLEMENTADOR, sujeita a veto.
   *  Terceira pessoa, sem "você", sem promessa de economia. */
  paragrafo: string;
  /** Ids de `DESTINOS_BR` que pertencem a esta família. */
  produtoIds: string[];
  /** Por que cada produto caiu aqui — a atribuição, auditável. */
  porQue: string;
}

// A ORDEM É A DA ESCALA DE INCANDESCÊNCIA, não alfabética nem por
// tamanho: hardware → academy → software → advisory → intelligence, do
// mais frio ao mais quente. A faixa lê como o próprio gradiente da casa,
// e "deslocar temperatura quebra a relação entre cor e significado".
export const FAMILIAS_BR: FamiliaBR[] = [
  {
    id: 'hardware',
    nome: 'Hardware',
    dominio: 'Medição em campo, telemetria, ativo físico',
    hex: '#B8481F',
    token: 'var(--family-hardware)',
    // O parágrafo descreve a família e PARA. A declaração de prateleira
    // vazia mora só na seção de produtos — vendo renderizado, as duas
    // frases apareciam quase idênticas na mesma tela.
    paragrafo:
      'O que se instala e se mede no local — medidor de campo, telemetria, ativo físico. É a ponta da casa que toca o equipamento, não o dado sobre ele.',
    produtoIds: [],
    porQue:
      'Nenhum dos cinco produtos catalogados é medição física. A família existe na arquitetura de marca; a prateleira dela ainda está vazia, e a página diz isso.',
  },
  {
    id: 'academy',
    nome: 'Academy',
    dominio: 'Formação e certificação',
    hex: '#A8432A',
    token: 'var(--family-academy)',
    paragrafo:
      'Formação em energia para quem precisa ler o setor por conta própria — do vocabulário básico à fluência profissional, com trilha e certificação.',
    produtoIds: ['alexandria'],
    porQue:
      'Alexandria é biblioteca de formação, "do zero à fluência profissional" — cai direto em "formação e certificação".',
  },
  {
    id: 'software',
    nome: 'Software',
    dominio: 'Produto instrumentado — API, painel, alerta',
    hex: '#C17D1F',
    token: 'var(--family-software)',
    paragrafo:
      'Continuidade do estado privado — organização, versões, cenários e decisões preservados em uma mesma linhagem.',
    produtoIds: [],
    porQue:
      'Ariadne é a espinha de estado e decisão da família Software. Sua bancada existe como superfície operacional, mas ainda não integra o catálogo público de cinco destinos.',
  },
  {
    id: 'advisory',
    nome: 'Advisory',
    dominio: 'Parecer e contraditório',
    hex: '#E8A317',
    token: 'var(--family-advisory)',
    paragrafo:
      'Parecer sobre um caso concreto, com o contraditório produzido junto — não depois. A conclusão vem acompanhada do argumento que a contesta.',
    produtoIds: ['conta-de-luz-express', 'solar-proposal-validator', 'diagnostico-energetico'],
    porQue:
      'Os três são análise de um caso concreto com conclusão a defender — fatura industrial, proposta comercial de sistema solar e custo energético de uma operação. É parecer, não série contínua nem formação.',
  },
  {
    id: 'intelligence',
    nome: 'Intelligence',
    dominio: 'Leitura do mercado — série, publicação, nota técnica',
    hex: '#F5C63C',
    token: 'var(--family-intelligence)',
    paragrafo:
      'Observação do mundo energético compartilhado — o que mudou, onde, quando e com qual cadeia de evidência.',
    produtoIds: ['terminal-brasil', 'energy-brief'],
    porQue:
      'Terminal Brasil observa e investiga realidade externa compartilhada; Energy Brief publica a leitura em ciclo. Ambos pertencem a Argos / Intelligence.',
  },
];

/** Uma família pelo id da rota. `undefined` para id desconhecido — quem
 *  chama decide o que fazer (a rota manda para o Portal). */
export function familiaPorId(id: string): FamiliaBR | undefined {
  return FAMILIAS_BR.find((f) => f.id === id);
}

/** Os destinos de uma família, RESOLVIDOS contra `DESTINOS_BR` — nunca
 *  redigitados. Id que não existe no catálogo é descartado em silêncio,
 *  o que mantém o mapa e o catálogo impossíveis de divergir na tela. */
export function produtosDaFamilia(familia: FamiliaBR): DestinoBR[] {
  return familia.produtoIds
    .map((pid) => DESTINOS_BR.find((d) => d.id === pid))
    .filter((d): d is DestinoBR => d !== undefined);
}

/** Rota canônica de uma família. Uma função só, para que o link da
 *  prévia e a rota do router nunca se soltem um do outro. */
export function rotaDaFamilia(id: FamiliaId): string {
  return `/br/familia/${id}`;
}

// Trava de DEV: todo produto do catálogo pertence a exatamente uma
// família? Não é erro fatal — Hardware vazia é estado legítimo, e um
// produto novo em `br-destinos.ts` sem família é aviso, não crash.
if (import.meta.env.DEV) {
  const atribuidos = FAMILIAS_BR.flatMap((f) => f.produtoIds);
  const orfaos = DESTINOS_BR.filter((d) => !atribuidos.includes(d.id)).map((d) => d.id);
  const duplicados = atribuidos.filter((id, i) => atribuidos.indexOf(id) !== i);
  if (orfaos.length > 0) {
    console.warn(`[br-familias] produto sem família: ${orfaos.join(', ')}`);
  }
  if (duplicados.length > 0) {
    console.warn(`[br-familias] produto em mais de uma família: ${duplicados.join(', ')}`);
  }
}
