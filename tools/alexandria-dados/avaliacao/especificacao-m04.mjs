// Especificação da avaliação do M04 — o que o porte decidiu, e só isso. O texto dos itens da
// fonte vem da extração; o dos derivados, da aula (evidência literal). Conferido por
// verificar-avaliacao-m04.mjs.

export const ESPEC = {
  // Os 9 Ex·NN são soltos na fonte (P9). `ancora`: a expressão que o exercício pede e que o texto
  // de aula traz literalmente. O destino é MECÂNICO (guia de porte, 15/11): a última aula cujo
  // texto contém a âncora; sem casamento, exercícios do módulo. Calculado pelo gerador e
  // recalculado pelo verificador.
  exercicios: {
    'm04-ex-01': { ancora: 'margem inframarginal' },
    'm04-ex-02': { ancora: 'Reservatório cheio empurra a hidráulica para baixo na ordem de mérito' },
    'm04-ex-03': { ancora: 'qual é a minha exposição, em MWh' },
    'm04-ex-04': { ancora: 'O PLD valora apenas a diferença contratual' },
    'm04-ex-05': { ancora: 'missing money' },
    'm04-ex-06': { ancora: 'preço de corte não é preço médio contratado' },
    'm04-ex-07': { ancora: 'Perfil é mais importante que preço médio' },
    'm04-ex-08': { ancora: 'No swap, uma parte troca preço variável por preço fixo' },
    'm04-ex-09': { ancora: 'A política de risco, por escrito' },
  },

  // Dois por aula. Nenhum repete uma questão da prova (q01–q10) nem pede cálculo: os
  // cenários numéricos são dos Ex·NN e dos instrumentos.
  derivados: [
    {
      id: 'm04-a01-d01', aula: 1, tipo: 'escolha',
      enunciado: 'Com a solar despachando, o preço daquela hora cai. Pela aula, cai porque…',
      alternativas: ['a solar é barata', 'quem ficou na margem é mais barato', 'o custo marginal operacional é próximo de zero'],
      gabarito: 1,
      evidencia: 'O preço cai porque quem ficou na margem é mais barato',
    },
    {
      id: 'm04-a01-d02', aula: 1, tipo: 'aberto',
      enunciado: 'Por que, segundo a aula, o preço brasileiro de curto prazo pode se mover sem que nada tenha se movido fisicamente naquele instante?',
      evidencia: 'Primeira: o preço brasileiro de curto prazo é um resultado de modelo, não de pregão. Ele responde a premissas de afluência, a funções de custo futuro e a decisões de política operativa — e por isso pode se mover sem que nada tenha se movido fisicamente naquele instante.',
    },
    {
      id: 'm04-a02-d01', aula: 2, tipo: 'escolha',
      enunciado: 'Desde 2021, em que base o PLD é calculado?',
      alternativas: ['semanal, em três patamares de carga', 'horária', 'mensal'],
      gabarito: 1,
      evidencia: 'Desde 2021 a base é horária',
    },
    {
      id: 'm04-a02-d02', aula: 2, tipo: 'aberto',
      enunciado: 'O que acontece com os preços dos submercados quando um limite de transmissão satura, e que nome comercial tem a diferença que aparece?',
      evidencia: 'Quando um limite de transmissão satura, os preços descolam, e essa diferença tem nome comercial: risco de submercado, ou risco de base.',
    },
    {
      id: 'm04-a03-d01', aula: 3, tipo: 'escolha',
      enunciado: 'Na Aula 03, energia e capacidade são produtos distintos. Em que unidade a aula mede a capacidade?',
      alternativas: ['MWh', 'MW', 'R$/MWh'],
      gabarito: 1,
      evidencia: 'Capacidade é MW: quanta potência estará disponível no instante em que o sistema precisar.',
    },
    {
      id: 'm04-a03-d02', aula: 3, tipo: 'aberto',
      enunciado: 'Segundo a aula, que três coisas quebram, na prática, o mecanismo do preço de escassez?',
      evidencia: 'Na prática, três coisas quebram o mecanismo. Tetos regulatórios impedem que o preço de escassez chegue ao valor que a teoria exige — no Brasil, o PLDmax horário e o estrutural da Aula 02. Eventos críticos são raros, o que torna a receita altamente incerta e cara de financiar: um fluxo de caixa que depende de 50 horas por ano tem variância que nenhum banco precifica com conforto. E preços muito altos são politicamente insustentáveis: nenhum regulador aceita repassar ao consumidor final o preço que faria a matemática fechar sozinha.',
    },
    {
      id: 'm04-a04-d01', aula: 4, tipo: 'escolha',
      enunciado: 'Se o certame liquida por preço uniforme, o que acontece com o preço médio e o preço de corte?',
      alternativas: ['a média fica abaixo do corte', 'média e corte coincidem', 'cada vencedor recebe o preço que ofertou'],
      gabarito: 1,
      evidencia: 'Se liquida por preço uniforme, todos recebem o corte, e média e corte coincidem.',
    },
    {
      id: 'm04-a04-d02', aula: 4, tipo: 'aberto',
      enunciado: 'Por que comparar o preço de um leilão de energia nova com o de um leilão de energia existente, e concluir que "a energia ficou mais cara", é um erro?',
      evidencia: 'Energia nova viabiliza empreendimento que ainda não existe: o contrato é a garantia de receita que destrava o financiamento, e o preço precisa cobrir capital novo. Energia existente vem de usina já operando e já amortizada, ou parcialmente: a lógica é de recontratação, não de expansão, e o preço tende a ser mais baixo porque o capital afundado já foi pago.',
    },
    {
      id: 'm04-a05-d01', aula: 5, tipo: 'escolha',
      enunciado: 'Que nome a aula dá ao fenômeno em que muita geração da mesma fonte nas mesmas horas derruba o valor capturado por todos os projetos dessa fonte?',
      alternativas: ['curtailment', 'canibalização', 'risco de base'],
      gabarito: 1,
      evidencia: 'Quando muita geração da mesma fonte se concentra nas mesmas horas, o preço daquelas horas cai e o valor capturado por todos os projetos daquela fonte cai junto — fenômeno que se chama canibalização.',
    },
    {
      id: 'm04-a05-d02', aula: 5, tipo: 'aberto',
      enunciado: 'Um PPA financeiro coloca energia na fábrica? O que ele faz, segundo a aula?',
      evidencia: 'Num PPA financeiro, as partes liquidam apenas a diferença entre o preço contratado e um preço de referência — o contrato funciona como proteção de preço, não como suprimento. A distinção é decisiva e frequentemente obscurecida em apresentação comercial: um PPA financeiro não coloca um elétron a mais na fábrica, e a empresa continua precisando comprar energia física de alguém.',
    },
    {
      id: 'm04-a06-d01', aula: 6, tipo: 'escolha',
      enunciado: 'Na Aula 06, o que sobra como "risco de base" depois de um hedge?',
      alternativas: [
        'quando a proteção é mensal e a exposição é horária',
        'a diferença entre o preço da referência do hedge e o preço da exposição real',
        'quando o hedge cobre uma quantidade e o consumo entrega outra',
      ],
      gabarito: 1,
      evidencia: 'Sobra risco de base — a diferença entre o preço da referência do hedge e o preço da exposição real.',
    },
    {
      id: 'm04-a06-d02', aula: 6, tipo: 'aberto',
      enunciado: 'O mercado caiu depois que a empresa fez hedge. O hedge foi um erro? Responda como a aula responde.',
      evidencia: 'Se o mercado cair depois, o hedge vai parecer um erro. Não foi. Foi um seguro que não precisou ser acionado, e ninguém chama o seguro do carro de erro porque não houve batida.',
    },
    {
      id: 'm04-a07-d01', aula: 7, tipo: 'escolha',
      enunciado: 'Na contratação em camadas, para que serve a exposição residual deliberada?',
      alternativas: [
        'uma base longa que cobre o consumo estrutural',
        'é a folga que permite absorver variação de produção sem cair em sobrecontratação',
        'uma camada curta ajustada ao ano corrente',
      ],
      gabarito: 1,
      evidencia: 'A exposição residual não é descuido — é a folga que permite absorver variação de produção sem cair em sobrecontratação.',
    },
    {
      id: 'm04-a07-d02', aula: 7, tipo: 'aberto',
      enunciado: 'Qual é a diferença entre análise de sensibilidade e simulação estocástica, e quando a segunda é útil?',
      evidencia: 'Testar um cenário por vez é análise de sensibilidade — muda-se uma premissa e observa-se o efeito. Testar milhares de combinações simultâneas é simulação estocástica, útil quando o risco não é linear, que é justamente o caso quando existem cláusulas de take-or-pay, bandas de flexibilidade e multas: essas cláusulas criam degraus na função de custo, e degraus não aparecem numa análise de sensibilidade simples.',
    },
  ],

  // Placar do script (L1832–1835): `if (sc>=8)` e `else`. Mensagens literais.
  faixas: (fx, total) => [
    { min: 8, max: total, mensagem: fx[0].mensagem },
    { min: 0, max: 7, mensagem: fx[1].mensagem },
  ],
};
