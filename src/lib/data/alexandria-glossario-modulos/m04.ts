// GERADO por tools/alexandria-dados/glossario/gerar-glossario.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/glossario/glossario.json, módulo m04 (Economia de Mercados de Energia).
// 58 verbetes, na ordem do glossário do módulo. Literal da extração.
// Sem troca editorial neste módulo.

import type { VerbeteDaFonte } from './tipo';

export const GLOSSARIO_M04: readonly VerbeteDaFonte[] = [
  {
    id: "gl-m04-custo-fixo",
    fonte: "m04-lex-custo-fixo",
    term: "Custo fixo",
    unit: "Formação de preço e despacho",
    definition:
      "Custo que existe independentemente de a usina gerar: investimento, serviço da dívida, depreciação, seguros, conexão e equipe mínima. Define quanto o ativo precisa faturar no ano para não destruir valor, mas não influencia a decisão de despachar hoje.",
  },
  {
    id: "gl-m04-custo-variavel",
    fonte: "m04-lex-custo-variavel",
    term: "Custo variável",
    unit: "Formação de preço e despacho",
    definition:
      "Custo que cresce com a geração, dominado por combustível em usinas térmicas e praticamente ausente em solar e eólica. É o que entra na ordem de mérito e, portanto, o que determina se a usina roda.",
  },
  {
    id: "gl-m04-custo-marginal",
    fonte: "m04-lex-custo-marginal",
    term: "Custo marginal",
    unit: "Formação de preço e despacho",
    definition:
      "Custo de produzir um megawatt-hora adicional a partir da condição atual do sistema. Único dos três custos que forma preço de curto prazo.",
  },
  {
    id: "gl-m04-custo-medio",
    fonte: "m04-lex-custo-medio",
    term: "Custo médio",
    unit: "Formação de preço e despacho",
    definition:
      "Custo total dividido pela energia gerada no período. Útil para avaliar desempenho histórico de um ativo e enganoso para decidir despacho, porque embute custo fixo já afundado.",
  },
  {
    id: "gl-m04-cvu",
    fonte: "m04-lex-cvu",
    term: "CVU",
    unit: "Formação de preço e despacho",
    definition:
      "Custo Variável Unitário declarado de uma usina térmica, em R$/MWh, segundo regra regulatória. É a informação que posiciona a usina na fila de despacho centralizado.",
  },
  {
    id: "gl-m04-ordem-de-merito",
    fonte: "m04-lex-ordem-de-merito",
    term: "Ordem de mérito",
    unit: "Formação de preço e despacho",
    definition:
      "Ordenação dos recursos de geração por custo variável crescente, do mais barato ao mais caro, até que a demanda seja atendida. É a espinha dorsal do despacho econômico e da formação de preço.",
  },
  {
    id: "gl-m04-usina-marginal",
    fonte: "m04-lex-usina-marginal",
    term: "Usina marginal",
    unit: "Formação de preço e despacho",
    definition:
      "Última usina necessária para atender a demanda em determinado instante. Seu custo define o custo marginal do sistema e, por consequência, o preço de curto prazo.",
  },
  {
    id: "gl-m04-margem-inframarginal",
    fonte: "m04-lex-margem-inframarginal",
    term: "Margem inframarginal",
    unit: "Formação de preço e despacho",
    definition:
      "Diferença entre o preço formado e o custo próprio de uma usina que gerou abaixo da margem. É a receita com a qual usinas de baixo custo variável recuperam seu custo fixo num mercado que remunera apenas energia.",
  },
  {
    id: "gl-m04-cmo",
    fonte: "m04-lex-cmo",
    term: "CMO",
    unit: "Formação de preço e despacho",
    definition:
      "Custo Marginal de Operação — custo de atender uma unidade adicional de carga, obtido pela otimização do sistema considerando disponibilidade, restrições e valor futuro da água. É o insumo direto do PLD.",
  },
  {
    id: "gl-m04-valor-da-agua",
    fonte: "m04-lex-valor-da-agua",
    term: "Valor da água",
    unit: "Formação de preço e despacho",
    definition:
      "Custo de oportunidade de usar hoje a água armazenada em vez de preservá-la para o futuro. Não é desembolso, é decisão intertemporal — e é o que posiciona a hidráulica na ordem de mérito num sistema hidrotérmico.",
  },
  {
    id: "gl-m04-despacho-centralizado",
    fonte: "m04-lex-despacho-centralizado",
    term: "Despacho centralizado",
    unit: "Formação de preço e despacho",
    definition:
      "Modelo em que o operador determina a geração de cada usina por otimização de custo do sistema, e não por cruzamento de lances de preço dos agentes. É o modelo brasileiro e a razão de o preço ser calculado, não negociado.",
  },
  {
    id: "gl-m04-efeito-ordem-de-merito",
    fonte: "m04-lex-efeito-ordem-de-merito",
    term: "Efeito ordem de mérito",
    unit: "Formação de preço e despacho",
    definition:
      "Redução do preço de curto prazo causada pela entrada de geração de custo marginal baixo, que desloca a curva de oferta e empurra a usina marginal para uma posição mais barata. O preço cai porque a margem mudou, não porque a fonte nova é barata.",
  },
  {
    id: "gl-m04-heat-rate",
    fonte: "m04-lex-heat-rate",
    term: "Heat rate",
    unit: "Formação de preço e despacho",
    definition:
      "Quantidade de combustível necessária por unidade de energia gerada. Mede a eficiência de uma térmica e explica boa parte da diferença de custo variável entre duas usinas que queimam o mesmo combustível.",
  },
  {
    id: "gl-m04-curva-de-oferta",
    fonte: "m04-lex-curva-de-oferta",
    term: "Curva de oferta",
    unit: "Formação de preço e despacho",
    definition:
      "Representação da capacidade disponível ordenada por custo marginal crescente. Cruzá-la com a demanda produz o preço; deslocá-la para a direita reduz o preço sem que nenhum custo tenha mudado.",
  },
  {
    id: "gl-m04-demanda-flexivel",
    fonte: "m04-lex-demanda-flexivel",
    term: "Demanda flexível",
    unit: "Formação de preço e despacho",
    definition:
      "Carga capaz de reduzir ou deslocar consumo em resposta a sinal econômico ou a despacho. Compete com geração na formação do preço, mas seu custo marginal é o custo de oportunidade da produção não realizada — em geral alto.",
  },
  {
    id: "gl-m04-pld",
    fonte: "m04-lex-pld",
    term: "PLD",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Preço de Liquidação das Diferenças. Preço que valora o descasamento entre energia contratada e energia efetivamente medida, apurado por hora e por submercado. Não é o preço da energia contratada nem o preço da conta de luz.",
  },
  {
    id: "gl-m04-pldmin",
    fonte: "m04-lex-pldmin",
    term: "PLDmin",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Piso regulatório do PLD, fixado anualmente pela ANEEL e correspondente ao maior valor entre a TEO e a TEO Itaipu. Impede que o preço vá a zero mesmo em situação de sobreoferta severa.",
  },
  {
    id: "gl-m04-pldmax-horario",
    fonte: "m04-lex-pldmax-horario",
    term: "PLDmax horário",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Teto aplicável a cada hora individualmente, referenciado no custo variável das térmicas mais caras representadas na programação da operação.",
  },
  {
    id: "gl-m04-pldmax-estrutural",
    fonte: "m04-lex-pldmax-estrutural",
    term: "PLDmax estrutural",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Teto aplicável à média do período. Os valores horários do dia são ajustados para que a média o respeite, preservando o formato da curva de preços ao longo das 24 horas.",
  },
  {
    id: "gl-m04-submercado",
    fonte: "m04-lex-submercado",
    term: "Submercado",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Região de referência para preço e contabilização. São quatro: Sudeste/Centro-Oeste, Sul, Nordeste e Norte. Preços diferentes entre eles indicam restrição de intercâmbio.",
  },
  {
    id: "gl-m04-acoplamento",
    fonte: "m04-lex-acoplamento",
    term: "Acoplamento",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Situação em que os limites de intercâmbio não estão saturados e os preços dos submercados convergem. O descolamento é o sinal de que a rede, e não a economia, passou a determinar o preço local.",
  },
  {
    id: "gl-m04-liquidacao",
    fonte: "m04-lex-liquidacao",
    term: "Liquidação",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Processo de apuração e pagamento das diferenças entre contratado e medido no mercado de curto prazo, conduzido pela CCEE segundo as regras de comercialização vigentes.",
  },
  {
    id: "gl-m04-exposicao",
    fonte: "m04-lex-exposicao",
    term: "Exposição",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Volume, em MWh, não coberto por contrato e portanto valorado ao preço de curto prazo. É a variável que transforma volatilidade de preço em variação de caixa — e a única sobre a qual o consumidor tem controle direto.",
  },
  {
    id: "gl-m04-ena",
    fonte: "m04-lex-ena",
    term: "ENA",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Energia Natural Afluente. Energia equivalente à vazão que chega aos aproveitamentos hidrelétricos, comparada à média de longo termo. É o fluxo que entra no sistema.",
  },
  {
    id: "gl-m04-ear",
    fonte: "m04-lex-ear",
    term: "EAR",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Energia Armazenada. Energia equivalente ao volume útil disponível nos reservatórios. É o estoque — e é a variável que o modelo protege quando o fluxo decepciona.",
  },
  {
    id: "gl-m04-periodo-umido-e-seco",
    fonte: "m04-lex-periodo-umido-e-seco",
    term: "Período úmido e seco",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Ciclo hidrológico anual do sistema brasileiro: aproximadamente dezembro a abril recompõe reservatórios, maio a novembro consome estoque. Um período úmido frustrado eleva o preço antes do período seco começar, porque o modelo antecipa.",
  },
  {
    id: "gl-m04-preco-spot",
    fonte: "m04-lex-preco-spot",
    term: "Preço spot",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Preço de curto prazo de uma commodity. No mercado elétrico brasileiro, essa função é cumprida pelo PLD, com a diferença de que ele é calculado por modelo e não formado por negociação.",
  },
  {
    id: "gl-m04-curva-forward",
    fonte: "m04-lex-curva-forward",
    term: "Curva forward",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Conjunto de preços negociados hoje para entrega futura. Reflete a expectativa do mercado somada ao prêmio de risco cobrado por quem carrega a incerteza — por isso pode divergir bastante do spot corrente.",
  },
  {
    id: "gl-m04-premio-de-risco",
    fonte: "m04-lex-premio-de-risco",
    term: "Prêmio de risco",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Diferença entre o preço de um contrato futuro e o valor esperado do preço spot no mesmo período. É o que o vendedor cobra para assumir a incerteza no lugar do comprador, e é a razão econômica de o contrato existir.",
  },
  {
    id: "gl-m04-ppa",
    fonte: "m04-lex-ppa",
    term: "PPA",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Power Purchase Agreement — contrato de compra e venda de energia de médio ou longo prazo que define preço, volume, prazo e condições comerciais, alocando riscos explicitamente entre vendedor e comprador.",
  },
  {
    id: "gl-m04-ppa-fisico",
    fonte: "m04-lex-ppa-fisico",
    term: "PPA físico",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Contrato associado à entrega e ao registro do montante de energia entre as partes. Substitui suprimento e é o formato padrão de contratação industrial no mercado livre brasileiro.",
  },
  {
    id: "gl-m04-ppa-financeiro",
    fonte: "m04-lex-ppa-financeiro",
    term: "PPA financeiro",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Contrato que liquida apenas a diferença entre o preço contratado e um preço de referência. Funciona como proteção de preço e não coloca energia física na planta — o comprador continua precisando de suprimento.",
  },
  {
    id: "gl-m04-contrato-por-diferenca",
    fonte: "m04-lex-contrato-por-diferenca",
    term: "Contrato por diferença",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Estrutura em que as partes liquidam contra um preço de exercício: se o mercado fica abaixo, uma paga; se fica acima, a outra compensa. É a forma financeira mais pura de travar preço.",
  },
  {
    id: "gl-m04-ppa-virtual",
    fonte: "m04-lex-ppa-virtual",
    term: "PPA virtual",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Contrato financeiro vinculado a um projeto renovável específico, em que o comprador não recebe fisicamente aquela energia mas liquida diferenças e normalmente recebe os atributos ambientais associados.",
  },
  {
    id: "gl-m04-modulacao",
    fonte: "m04-lex-modulacao",
    term: "Modulação",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Distribuição horária do volume contratado. É a cláusula que determina se o contrato acompanha o perfil real de consumo ou entrega energia nas horas erradas.",
  },
  {
    id: "gl-m04-sazonalizacao",
    fonte: "m04-lex-sazonalizacao",
    term: "Sazonalização",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Distribuição mensal do volume contratado. Crítica para consumidores com ciclo definido — safra, irrigação, refrigeração, mineração sazonal — cujo consumo anual está certo mas mal distribuído.",
  },
  {
    id: "gl-m04-contrato-flat",
    fonte: "m04-lex-contrato-flat",
    term: "Contrato flat",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Contrato com volume uniforme em todos os períodos. Simples de precificar e frequentemente inadequado, porque quase nenhuma planta industrial consome de forma uniforme.",
  },
  {
    id: "gl-m04-flexibilidade",
    fonte: "m04-lex-flexibilidade",
    term: "Flexibilidade",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Banda percentual dentro da qual o consumo pode variar sem penalidade contratual. Banda larga custa mais caro no preço e vale mais quando a produção é volátil; banda estreita transfere o risco de volume ao comprador.",
  },
  {
    id: "gl-m04-take-or-pay",
    fonte: "m04-lex-take-or-pay",
    term: "Take-or-pay",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Obrigação de pagar um volume mínimo mesmo sem consumi-lo. Protege a receita do vendedor e converte queda de produção em custo morto para o comprador.",
  },
  {
    id: "gl-m04-sobrecontratacao",
    fonte: "m04-lex-sobrecontratacao",
    term: "Sobrecontratação",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Situação em que o volume contratado excede o consumo medido, gerando sobra liquidada ao preço de curto prazo — tipicamente baixo, porque as causas da queda de consumo e da queda de preço costumam ser as mesmas.",
  },
  {
    id: "gl-m04-indexacao",
    fonte: "m04-lex-indexacao",
    term: "Indexação",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Mecanismo contratual de reajuste do preço ao longo do tempo, por índice de inflação, câmbio ou fórmula híbrida. Determina o custo total do contrato mais do que o preço de partida.",
  },
  {
    id: "gl-m04-change-in-law",
    fonte: "m04-lex-change-in-law",
    term: "Change in law",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Cláusula que define como mudanças regulatórias, tributárias ou setoriais afetam preço e obrigações. Em setor tão regulado quanto o elétrico brasileiro, é cláusula estrutural e não formalidade jurídica.",
  },
  {
    id: "gl-m04-lastro",
    fonte: "m04-lex-lastro",
    term: "Lastro",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Respaldo físico ou comercial exigido para que um agente possa vender energia. Vender sem lastro suficiente é infração de regra de mercado, não apenas risco comercial.",
  },
  {
    id: "gl-m04-acr",
    fonte: "m04-lex-acr",
    term: "ACR",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Ambiente de Contratação Regulada, no qual distribuidoras contratam energia por leilão para atender consumidores cativos, que pagam tarifa regulada e não escolhem fornecedor.",
  },
  {
    id: "gl-m04-acl",
    fonte: "m04-lex-acl",
    term: "ACL",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Ambiente de Contratação Livre, no qual consumidores elegíveis negociam diretamente preço, prazo, fonte, indexação e condições comerciais, assumindo em troca a gestão do próprio portfólio e da própria exposição.",
  },
  {
    id: "gl-m04-capacidade",
    fonte: "m04-lex-capacidade",
    term: "Capacidade",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Disponibilidade de potência, medida em MW. Responde à pergunta \"quem estará disponível quando o sistema precisar\" — e não à pergunta de quanto foi produzido.",
  },
  {
    id: "gl-m04-energia",
    fonte: "m04-lex-energia",
    term: "Energia",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Produção ou consumo ao longo do tempo, medido em MWh. Responde à pergunta \"quanto foi produzido\" e é o produto que praticamente todo mercado remunera bem.",
  },
  {
    id: "gl-m04-missing-money",
    fonte: "m04-lex-missing-money",
    term: "Missing money",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Insuficiência estrutural da receita de energia para remunerar a capacidade necessária à confiabilidade do sistema, causada por tetos de preço, raridade dos eventos de escassez e inaceitabilidade política de preços extremos.",
  },
  {
    id: "gl-m04-energy-only",
    fonte: "m04-lex-energy-only",
    term: "Energy-only",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Desenho de mercado que remunera principalmente energia, dependendo de margens inframarginais e de preços de escassez para financiar capacidade. Funciona em teoria e exige tetos altos ou nulos para funcionar na prática.",
  },
  {
    id: "gl-m04-preco-de-escassez",
    fonte: "m04-lex-preco-de-escassez",
    term: "Preço de escassez",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Elevação deliberada do preço em momentos de oferta insuficiente, com a função de remunerar disponibilidade e sinalizar necessidade de investimento. Economicamente eficiente e politicamente difícil de sustentar.",
  },
  {
    id: "gl-m04-valor-da-energia-nao-suprida",
    fonte: "m04-lex-valor-da-energia-nao-suprida",
    term: "Valor da energia não suprida",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Estimativa do custo econômico de não atender uma carga. Varia por ordens de grandeza entre uma residência e um processo industrial contínuo, e é a referência conceitual para calibrar preço de escassez.",
  },
  {
    id: "gl-m04-reserva-de-capacidade",
    fonte: "m04-lex-reserva-de-capacidade",
    term: "Reserva de capacidade",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Produto de disponibilidade contratado para segurança de suprimento, desacoplado da entrega de energia. O vencedor se compromete a estar disponível, e é remunerado por isso independentemente de gerar.",
  },
  {
    id: "gl-m04-lrcap",
    fonte: "m04-lex-lrcap",
    term: "LRCAP",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Leilão de Reserva de Capacidade na forma de Potência. Instrumento brasileiro de contratação de disponibilidade, realizado de forma pontual em vez de por mercado permanente de capacidade.",
  },
  {
    id: "gl-m04-leilao-reverso",
    fonte: "m04-lex-leilao-reverso",
    term: "Leilão reverso",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Disputa em que os vendedores competem reduzindo preço até que a quantidade demandada seja atendida. Substitui a negociação bilateral por competição pública quando o comprador é regulado.",
  },
  {
    id: "gl-m04-preco-de-corte",
    fonte: "m04-lex-preco-de-corte",
    term: "Preço de corte",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Preço do último lance aceito num leilão reverso. Coincide com o preço médio apenas quando o edital liquida por preço uniforme; quando liquida por lance individual, a média fica abaixo.",
  },
  {
    id: "gl-m04-revenue-stacking",
    fonte: "m04-lex-revenue-stacking",
    term: "Revenue stacking",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Combinação de múltiplas fontes de receita sobre o mesmo ativo — energia, capacidade, serviços ancilares, redução de demanda, atributos. É o que viabiliza projetos que nenhuma dessas receitas pagaria sozinha.",
  },
  {
    id: "gl-m04-risco-de-base",
    fonte: "m04-lex-risco-de-base",
    term: "Risco de base",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Diferença entre o preço da referência contratual ou do instrumento de proteção e o preço da exposição efetiva. Aparece tipicamente como descasamento de submercado, e é o risco que sobra depois que todos os outros foram tratados.",
  },
  {
    id: "gl-m04-canibalizacao",
    fonte: "m04-lex-canibalizacao",
    term: "Canibalização",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Redução do preço capturado por uma fonte causada pela concentração da geração dessa mesma fonte nas mesmas horas. Explica por que o valor marginal de um projeto cai conforme a penetração da tecnologia cresce na região.",
  },
];
