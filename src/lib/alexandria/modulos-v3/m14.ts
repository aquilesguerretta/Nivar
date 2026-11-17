// Módulo 14 no modelo de aula v3. Posse: a sessão de porte do M14.
//
// Relatório (o que entrou, o que ficou de fora e por quê): docs/alexandria-v3/porte/m14.md.
//
// PREVISÕES. Regras do cabeçalho de components/alexandria/v3/aula/previsoes.ts: o cenário é o
// padrão do instrumento (o script da fonte, `numOf(..., padrão, ...)`), a grandeza prevista é
// uma saída da calculadora (calculadoras/m14.ts) e a pergunta só junta rótulo, valor e unidade
// que a fonte escreve. A âncora é o bloco que a fonte põe logo antes do `div.inst` (posição
// medida em extraction/m14/instrumentos.json → `posicao.bloco_anterior`).
//
// Os exploradores INST·09 e INST·10 preveem por escolha (estado da combinação; categoria do
// defeito). INST·01 e INST·04 são consulta pura e ficam sem previsão (ver o fim da lista).

import type { ModuloV3 } from './tipos';
import { CalendarioDeSafra } from '@/components/alexandria/v3/diagramas/m14/CalendarioDeSafra';

export const MODULO_V3: ModuloV3 = {
  moduloId: 'modulo-14',
  pronto: true,
  figuras: [
    {
      id: 'm14-a03-calendario-de-safra',
      moduloId: 'modulo-14',
      aula: 3,
      classe: 'diagrama',
      ancora: 'm14-a03-b01',
      diagrama: 'm14-calendario-de-safra',
      alt: 'Calendário de doze meses com duas linhas: cana do Centro-Sul com moagem típica de abril a novembro, e milho com moagem típica o ano inteiro.',
      legenda: 'O ciclo da cana no Centro-Sul atravessa dois anos-calendário; a operação com grão não precisa atravessar.',
      credito: 'diagrama · dado do Módulo 14, Aula 03, seção 03.1',
      fonte: 'Alexandria modulos/alexandria_modulo14.html, div.saf (L1423–L1446)',
    },
  ],
  trechos: {
    // A figura da fonte está entre o 1º parágrafo da §03.1 e a nota "Esquema ilustrativo…".
    'm14-a03-b01': 'A diferença que organiza tudo é banal e decisiva: cana apodrece, grão não.',
  },
  diagramas: {
    'm14-calendario-de-safra': CalendarioDeSafra,
  },
  previsoes: [
    {
      // A01 · §01.3, depois da fórmula "Índice de paridade — triagem, não decisão" (bloco 19),
      // onde a fonte põe o INST·02. Cenário: o padrão do instrumento.
      instrumentoId: 'm14-inst-02',
      depoisDoBloco: 19,
      cenario: { 'pd-pg-n': 6.2, 'pd-pe-n': 4.15, 'pd-cg-n': 11.5, 'pd-ce-n': 8 },
      pergunta:
        'A gasolina C custa R$ 6,20 por litro e o carro faz 11,5 km/L com ela; o etanol hidratado custa R$ 4,15 por litro e o mesmo carro faz 8,0 km/L. Quanto custa rodar um quilômetro com etanol?',
      grandeza: { tipo: 'numero', saida: 'pd-ce', unidade: 'R$/km', casas: 3 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 02',
    },
    {
      // A02 · §02.3, depois de "A consequência é direta…" (bloco 13). Padrão do INST·03:
      // perfil misto (faixa 30% a 65% de açúcar, tabela PERFIS do script), ATR a R$ 1,18 no
      // açúcar e R$ 1,26 no etanol, mix em 48%. A grandeza é o deslocamento que o veredito do
      // script escreve ("restam N pontos percentuais de deslocamento dentro da faixa").
      instrumentoId: 'm14-inst-03',
      depoisDoBloco: 13,
      cenario: { 'mx-pa-n': 1.18, 'mx-pe-n': 1.26, 'mx-mx-n': 48 },
      pergunta:
        'Uma unidade mista pode operar entre 30% e 65% de açúcar no mix. O quilo de ATR rende R$ 1,18 virando açúcar e R$ 1,26 virando etanol, e o mix praticado está em 48% para açúcar. Quantos pontos percentuais o mix ainda consegue se deslocar na direção que o preço indica?',
      grandeza: { tipo: 'numero', saida: 'mx-desloc', unidade: 'p.p.', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 03',
    },
    {
      // A04 · §04.3, depois de "A aritmética é trivial…" (bloco 9). Padrão do INST·05.
      instrumentoId: 'm14-inst-05',
      depoisDoBloco: 9,
      cenario: { 'dm-vol-n': 60, 'dm-pct-n': 15, 'dm-cmp-n': 16 },
      pergunta:
        'Um mercado consome 60 bilhões de litros de diesel B por ano, com teor obrigatório de 15% de biodiesel. Quantos bilhões de litros de biodiesel a regra obriga a comprar?',
      grandeza: { tipo: 'numero', saida: 'dm-q1', unidade: 'bi L', casas: 2 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 05',
    },
    {
      // A05 · §05.2, depois da nota "Uma leitura fina que a maioria não faz" (bloco 8). O
      // padrão do INST·06 (80 MW, 210 dias, 55%, 88%) é o cenário do gabarito do Ex 02 — o
      // calculado é a resposta dele, então só abre depois da tentativa lá.
      instrumentoId: 'm14-inst-06',
      depoisDoBloco: 8,
      cenario: { 'cg-pot-n': 80, 'cg-dia-n': 210, 'cg-aut-n': 55, 'cg-dis-n': 88 },
      pergunta:
        'Uma cogeração a bagaço tem 80 MW instalados, mói 210 dias por ano, fica disponível 88% das horas da safra e consome 55% da geração no próprio processo. Quanta energia ela exporta para a rede no ano?',
      grandeza: { tipo: 'numero', saida: 'cg-p3', unidade: 'GWh', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 06',
      abreDepoisDoExercicio: 'm14-ex-02',
    },
    {
      // A06 · §06.2, depois da tabela das rotas de entrega (bloco 7). A saída é a que o
      // conserto D01 corrigiu (era mil vezes menor). A regra "36 MJ por Nm³" está na fórmula
      // da §06.1 (bloco 4), com outro exemplo (10 milhões → 360 TJ).
      instrumentoId: 'm14-inst-07',
      depoisDoBloco: 7,
      cenario: { 'bm-vol-n': 15 },
      pergunta:
        'Uma planta vende 15 milhões de Nm³ de biometano por ano, a 36 MJ por Nm³. Quanta energia ela entrega, em TJ por ano?',
      grandeza: { tipo: 'numero', saida: 'bm-en', unidade: 'TJ/ano', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valor padrão do instrumento 07',
    },
    {
      // A07 · §07.4, depois da nota "Números vivos" sobre o preço do crédito (bloco 19). O
      // padrão do INST·08 (etanol de cana, 100 milhões de litros, 55 gCO₂e/MJ) com 21,1 MJ/L é
      // o enunciado do Ex 13 — o calculado é a resposta dele.
      instrumentoId: 'm14-inst-08',
      depoisDoBloco: 19,
      cenario: { 'cb-vol-n': 100, 'cb-dic-n': 55 },
      pergunta:
        'Uma usina de etanol de cana vende 100 milhões de litros elegíveis, a 21,1 MJ por litro, com diferencial de intensidade de carbono de 55 gCO₂e/MJ. Quantas toneladas de CO₂e evitadas isso representa?',
      grandeza: { tipo: 'numero', saida: 'cb-ev', unidade: 't CO₂e', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 08',
      abreDepoisDoExercicio: 'm14-ex-13',
    },
    {
      // A08 · §08.1, logo depois do título (bloco 19), onde a fonte põe o INST·09. Padrão do
      // script: insumo cana-de-açúcar, destino açúcar. A grandeza é o "Estado da combinação"
      // (tabela S do script); as opções são os cinco estados, com o rótulo do script.
      instrumentoId: 'm14-inst-09',
      depoisDoBloco: 19,
      cenario: {},
      pergunta: 'Cana-de-açúcar destinada a açúcar: em que estado está essa combinação de insumo e destino?',
      grandeza: {
        tipo: 'escolha',
        saida: 'cl-estado',
        opcoes: [
          { valor: 'DESTINO CONSOLIDADO', rotulo: 'Destino consolidado' },
          { valor: 'APLICÁVEL POR ROTA INDIRETA — O INSUMO CORRETO É OUTRO', rotulo: 'Aplicável por rota indireta — o insumo correto é outro' },
          { valor: 'TECNICAMENTE POSSÍVEL, LIMITADO EM ESCALA', rotulo: 'Tecnicamente possível, limitado em escala' },
          { valor: 'USO REAL, MERCADO MARGINAL', rotulo: 'Uso real, mercado marginal' },
          { valor: 'COMBINAÇÃO NÃO APLICÁVEL', rotulo: 'Combinação não aplicável' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 09',
    },
    {
      // A08 · §08.2, depois de "Este é o instrumento assinatura do módulo…" (bloco 21). A
      // fonte pede "decida antes de clicar", mas o clique já revelava (QA-M14-03): a previsão
      // é esse compromisso. Padrão do script: o enunciado e1; as opções são as quatro
      // categorias do próprio instrumento (tabela LB). Sobre "estado de política" × "Base
      // temporal" no e3, ver docs/alexandria-v3/porte/m14.md (caso Q15).
      instrumentoId: 'm14-inst-10',
      depoisDoBloco: 21,
      cenario: {},
      pergunta: '“A gasolina brasileira tem 30% de etanol anidro.” Qual é a categoria do defeito dominante desse enunciado?',
      grandeza: {
        tipo: 'escolha',
        saida: 'vf-cat',
        opcoes: [
          { valor: 'Base temporal', rotulo: 'Base temporal' },
          { valor: 'Rota não declarada', rotulo: 'Rota não declarada' },
          { valor: 'Grandeza confundida', rotulo: 'Grandeza confundida' },
          { valor: 'Concorrente omitido', rotulo: 'Concorrente omitido' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 10',
    },
    // INST·01 (§MAP, Aula 01) e INST·04 (Aula 03) são exploradores de consulta: nenhum
    // cálculo deles aponta uma opção, então ficam sem previsão e entram depois da leitura
    // (regra de PORTE-POR-MODULO.md). Registro em docs/alexandria-v3/porte/m14.md.
  ],
};
