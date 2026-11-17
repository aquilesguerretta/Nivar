// Especificação da avaliação do M05 — o que o porte decidiu, e só isso. O texto dos itens da
// fonte vem da extração; o dos derivados, da aula (evidência literal). Conferido por
// verificar-avaliacao-m05.mjs.

export const ESPEC = {
  // Os 10 Ex·NN são soltos na fonte (P9; o Ex·10 cita "Aula 06" no fecho do gabarito como
  // referência de conteúdo, não como vínculo). `ancora`: a expressão que o exercício pede e que
  // o texto de aula traz literalmente. O destino é MECÂNICO (guia de porte, 15/11): a última
  // aula cujo texto contém a âncora; sem casamento, exercícios do módulo.
  exercicios: {
    'm05-ex-01': { ancora: 'Existe monopólio natural quando' },
    'm05-ex-02': { ancora: 'Pode colocar o pedido de conexão do concorrente no fim da fila' },
    'm05-ex-03': { ancora: 'o contrato não foi descumprido' },
    'm05-ex-04': { ancora: 'WACC regulatório: o parâmetro que move tudo' },
    'm05-ex-05': { ancora: 'Uma decisão favorável à concessionária não prova captura' },
    'm05-ex-06': { ancora: 'Um aumento tarifário grande pode ocorrer com a Parcela B praticamente estável' },
    'm05-ex-07': { ancora: 'Não deixou de usar a rede dela' },
    'm05-ex-08': { ancora: 'Um gerador individual, otimizando o próprio lucro, não internaliza o valor sistêmico de guardar água' },
    'm05-ex-09': { ancora: 'O teste de sete perguntas' },
    'm05-ex-10': { ancora: 'Os dois eixos que organizam qualquer desenho' },
  },

  // Dois por aula. Nenhum repete uma questão da prova (q01–q10) nem pede cálculo.
  derivados: [
    {
      id: 'm05-a01-d01', aula: 1, tipo: 'escolha',
      enunciado: 'Na expressão "monopólio natural", o que a palavra "natural" significa, segundo a aula?',
      alternativas: ['bom, justo, necessário ou desejável', 'que a tecnologia e a estrutura de custos empurram para um único operador', 'propriedade estatal'],
      gabarito: 1,
      evidencia: 'significa apenas que a tecnologia e a estrutura de custos empurram para um único operador, independentemente do que se ache disso.',
    },
    {
      id: 'm05-a01-d02', aula: 1, tipo: 'aberto',
      enunciado: 'Num monopólio de rede, o cliente não pode ameaçar ir embora. O que, segundo a aula, a regulação tenta reconstruir no lugar dessa ameaça?',
      evidencia: 'Numa atividade competitiva, o cliente disciplina o fornecedor com a ameaça de ir embora. Num monopólio de rede, essa ameaça não existe. A regulação tenta reconstruir artificialmente cada função que a ameaça de saída exercia: pressão sobre custo (benchmark e Fator X), pressão sobre qualidade (indicadores e penalidade), pressão sobre preço (receita regulada) e pressão sobre investimento (obrigação de expansão e teste de prudência).',
    },
    {
      id: 'm05-a02-d01', aula: 2, tipo: 'escolha',
      enunciado: 'Na arquitetura que resultou do unbundling brasileiro, quem registra contratos, mede, contabiliza e liquida?',
      alternativas: ['a agência reguladora', 'o operador nacional', 'a câmara de comercialização'],
      gabarito: 2,
      evidencia: 'a câmara de comercialização registra contratos, mede, contabiliza e liquida',
    },
    {
      id: 'm05-a02-d02', aula: 2, tipo: 'aberto',
      enunciado: 'Por que, segundo a aula, a resposta regulatória à integração vertical não é apenas proibir a conduta?',
      evidencia: 'Repare que nenhuma dessas condutas exige violar a tarifa publicada. Elas operam nas margens do processo, na fila, no prazo, no dado e na alocação contábil — precisamente onde é difícil provar intenção. É por isso que a resposta regulatória não é apenas proibir a conduta, e sim remover a estrutura que torna a conduta lucrativa.',
    },
    {
      id: 'm05-a03-d01', aula: 3, tipo: 'escolha',
      enunciado: 'Na frase que a Aula 03 manda carregar, o operador coordena elétrons. E o contrato coordena…',
      alternativas: ['o fluxo físico', 'dinheiro e risco', 'elétrons'],
      gabarito: 1,
      evidencia: 'o contrato coordena dinheiro e risco',
    },
    {
      id: 'm05-a03-d02', aula: 3, tipo: 'aberto',
      enunciado: 'Que patologias, segundo a aula, tem um mercado exclusivamente bilateral?',
      evidencia: 'Um mercado exclusivamente bilateral, porém, tem patologias conhecidas. A informação de preço fica dispersa em contratos privados, o que enfraquece a formação de uma referência pública confiável. A liquidez é baixa e o custo de busca é alto. Agentes pequenos negociam em desvantagem estrutural contra contrapartes que veem o mercado inteiro. E o operador do sistema, sem um mecanismo central de revelação de custo, tem menos informação para despachar economicamente.',
    },
    {
      id: 'm05-a04-d01', aula: 4, tipo: 'escolha',
      enunciado: 'Na definição de captura regulatória da aula, por que a palavra "persistente"?',
      alternativas: [
        'porque o mecanismo depende de capacidade de ação coletiva',
        'porque um resultado isolado favorável ao regulado não é captura',
        'porque a referência é a metodologia declarada e o mandato legal',
      ],
      gabarito: 1,
      evidencia: 'Persistente, porque um resultado isolado favorável ao regulado não é captura; é apenas um resultado.',
    },
    {
      id: 'm05-a04-d02', aula: 4, tipo: 'aberto',
      enunciado: 'No teste de sete perguntas, em quais perguntas a falha costuma se concentrar, e o que cada uma delas indica?',
      evidencia: 'A falha se concentra tipicamente nas perguntas 1, 2 e 7 — método construído depois, dado indisponível, resultado irreproduzível. Essas três são as que valem a pena investigar primeiro.',
    },
    {
      id: 'm05-a05-d01', aula: 5, tipo: 'escolha',
      enunciado: 'O que a Parcela A agrupa?',
      alternativas: [
        'custo operacional, remuneração do capital investido e depreciação regulatória',
        'compra de energia, uso da transmissão e encargos setoriais',
        'o Fator X e a empresa de referência',
      ],
      gabarito: 1,
      evidencia: 'A Parcela A agrupa os custos considerados predominantemente não gerenciáveis pela distribuidora: compra de energia, uso da transmissão e encargos setoriais.',
    },
    {
      id: 'm05-a05-d02', aula: 5, tipo: 'aberto',
      enunciado: 'O que é o Fator X, e como ele entra na correção da Parcela B?',
      evidencia: 'O Fator X é o instrumento que compartilha com o consumidor o ganho de produtividade esperado ao longo do ciclo. Ele entra subtraindo do índice de correção da Parcela B: se o índice de preços subiu e o Fator X é positivo, a Parcela B sobe menos que a inflação.',
    },
    {
      id: 'm05-a06-d01', aula: 6, tipo: 'escolha',
      enunciado: 'No eixo 1 — como o custo é revelado para coordenar o despacho —, onde a aula põe o Brasil?',
      alternativas: ['numa posição intermediária', 'próximo do extremo de despacho por custo', 'ofertas voluntárias com preço locacional'],
      gabarito: 1,
      evidencia: 'No eixo 1, o Brasil está próximo do extremo de despacho por custo.',
    },
    {
      id: 'm05-a06-d02', aula: 6, tipo: 'aberto',
      enunciado: 'A frase "no Brasil o despacho é centralizado, lá fora o mercado é descentralizado" está errada. O que, segundo a aula, varia de fato entre os desenhos?',
      evidencia: 'O que varia entre desenhos não é se há coordenação central, e sim qual informação alimenta a coordenação e quem carrega o risco do resultado. Ofertas voluntárias com preço locacional de um lado; custos declarados e modelos de otimização hidrotérmica do outro. E a contratação comercial — a camada de dinheiro da Aula 03 — pode ser descentralizada nos dois casos, e geralmente é. Quem enuncia a dicotomia "centralizado versus descentralizado" está misturando a camada física com a camada comercial.',
    },
  ],

  // Placar do script (L1870–1875): `if (sc>=8)` e `else`. Mensagens literais.
  faixas: (fx, total) => [
    { min: 8, max: total, mensagem: fx[0].mensagem },
    { min: 0, max: 7, mensagem: fx[1].mensagem },
  ],
};
