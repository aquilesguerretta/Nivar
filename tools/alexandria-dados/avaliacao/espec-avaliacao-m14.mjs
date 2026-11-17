// Especificação da avaliação do M14, lida por gerar-avaliacao-m14-m15.mjs.
//
// `afinidade`: aula → Ex NN do §Ex. A fonte não liga nenhum Ex a aula (P9); este é o
//   vínculo por tema do estudo docs/alexandria-v2/estudos/aulas/m14.md ("Afinidade: …"),
//   e o Ex 14 (Síntese) vai à aula de síntese (A08).
// `derivados`: pergunta de recuperação + trecho LITERAL da aula que a responde (o gerador
//   localiza o trecho no texto da aula e para se não achar). Nenhum é cálculo: os cenários
//   numéricos são dos instrumentos e dos Ex NN. Pergunta e distratores são voz da Alexandria.

export default {
  afinidade: {
    1: [1, 5, 7],
    2: [9],
    3: [4, 11],
    4: [3, 6, 10],
    5: [2],
    6: [8, 12],
    7: [13],
    8: [14],
  },
  alertasEx: {
    2: ['O padrão do INST·06 (80 MW, 210 dias, 55% de autoconsumo, 88% de disponibilidade) é o cenário deste gabarito: a previsão do instrumento só abre o cálculo depois da tentativa deste exercício.'],
    13: [
      'O padrão do INST·08 (etanol de cana, 100 milhões de litros, 55 gCO₂e/MJ, 21,1 MJ/L) é este enunciado: a previsão do instrumento só abre o cálculo depois da tentativa deste exercício.',
      'QA-M14-02b: o gabarito usa 21,1 MJ/L e o script do INST·08 usava 21,3 MJ/L; o instrumento foi alinhado ao gabarito (21,1).',
    ],
  },
  derivados: [
    // ── Aula 01 ──
    {
      aula: 1, tipo: 'escolha',
      enunciado: 'Segundo a aula, a demanda de etanol anidro é igual a quê?',
      alternativas: [
        'Ao preço relativo do hidratado contra a gasolina C, que cada motorista decide na bomba',
        'Ao volume de gasolina C vendido multiplicado pelo percentual de mistura obrigatória',
        'À capacidade de destilação instalada nas usinas do Centro-Sul',
      ],
      correta: 1,
      evidencias: ['O anidro não compete com nada: a demanda dele é derivada, e igual ao volume de gasolina C vendido multiplicado pelo percentual de mistura obrigatória.'],
    },
    {
      aula: 1, tipo: 'aberto',
      enunciado: 'Em 2025 a produção total de etanol caiu 2,8%. O que a aula diz que esse total, citado sozinho, esconde?',
      evidencias: ['uma das metades subiu por decisão regulatória e a outra desceu por preço relativo, e a soma das duas coisas produziu um número agregado que não descreve nenhuma das duas.'],
    },
    // ── Aula 02 ──
    {
      aula: 2, tipo: 'escolha',
      enunciado: 'Qual é o indicador central da cadeia da cana, segundo a aula?',
      alternativas: ['A tonelada de cana moída', 'O ATR, em quilos de açúcares totais recuperáveis por tonelada de cana', 'O TCH, em toneladas de cana por hectare'],
      correta: 1,
      evidencias: ['O indicador central da cadeia da cana não é a tonelada — é o ATR, sigla de Açúcares Totais Recuperáveis, expresso em quilos de ATR por tonelada de cana.'],
    },
    {
      aula: 2, tipo: 'aberto',
      enunciado: 'Por que um preço relativo favorável ao etanol pode não mover nenhum quilo de ATR?',
      evidencias: ['um sinal de preço favorável ao etanol não move nenhum ATR se a planta já está no teto de etanol da sua faixa.'],
    },
    // ── Aula 03 ──
    {
      aula: 3, tipo: 'escolha',
      enunciado: 'De onde vem o vapor de processo de uma unidade de etanol de milho?',
      alternativas: ['Do bagaço que a própria unidade gera', 'De fonte térmica externa contratada', 'Da palha recolhida no campo'],
      correta: 1,
      evidencias: ['A unidade de milho não tem resíduo combustível equivalente e precisa contratar fonte térmica externa — biomassa comprada, cavaco, ou gás.'],
    },
    {
      aula: 3, tipo: 'aberto',
      enunciado: 'O que significa, para a mesma planta, retirar fibra do circuito térmico para a hidrólise de segunda geração?',
      evidencias: ['Retirar fibra do circuito para a hidrólise significa faltar vapor ou faltar exportação elétrica, e o valor do 2G precisa superar o valor do que deixou de ser produzido, não apenas cobrir o próprio custo.'],
    },
    // ── Aula 04 ──
    {
      aula: 4, tipo: 'escolha',
      enunciado: 'Segundo a aula, qual matéria-prima responde pela maior parte do biodiesel brasileiro?',
      alternativas: ['Sebo bovino', 'Óleo de soja', 'Óleo de cozinha usado'],
      correta: 1,
      evidencias: ['A cadeia brasileira de biodiesel é fortemente concentrada em óleo de soja, que responde pela maior parte das matérias-primas segundo o Balanço Energético Nacional 2026'],
    },
    {
      aula: 4, tipo: 'aberto',
      enunciado: 'Como a aula define a demanda teórica de B100?',
      evidencias: ['A demanda teórica de B100 é o produto entre o volume de diesel B comercializado e o teor obrigatório.'],
    },
    // ── Aula 05 ──
    {
      aula: 5, tipo: 'escolha',
      enunciado: 'Com que período o período de safra do Centro-Sul coincide, segundo a aula?',
      alternativas: ['Com o período chuvoso das principais bacias hidrográficas', 'Com o período seco das principais bacias hidrográficas', 'Com o ano-calendário inteiro'],
      correta: 1,
      evidencias: ['O período de safra do Centro-Sul coincide, aproximadamente, com o período seco das principais bacias hidrográficas que sustentam a geração hidrelétrica brasileira.'],
    },
    {
      aula: 5, tipo: 'aberto',
      enunciado: 'Em que sentido a energia de bagaço é "firme", segundo a aula, e de que essa firmeza depende?',
      evidencias: ['a energia é firme enquanto a planta está moendo, e a firmeza depende de combustível disponível, disponibilidade da planta, capacidade de conexão e do próprio contrato'],
    },
    // ── Aula 06 ──
    {
      aula: 6, tipo: 'escolha',
      enunciado: 'Segundo a aula, o que é o biometano?',
      alternativas: [
        'A mistura gasosa produzida por digestão anaeróbia, com metano, dióxido de carbono, umidade e contaminantes',
        'O biogás purificado até atender à especificação da agência',
        'O gás natural fóssil injetado na mesma rede que o biogás',
      ],
      correta: 1,
      evidencias: ['Biometano é o biogás purificado até atender à especificação da agência'],
    },
    {
      aula: 6, tipo: 'aberto',
      enunciado: 'A meta inicial de 0,5% do programa do gás natural é uma obrigação de comprar 0,5% de todo o gás como biometano?',
      evidencias: ['a meta de 0,5% é expressa em redução de emissões, e não é uma obrigação volumétrica de 0,5% de todo o gás — as duas coisas produzem números diferentes.'],
    },
    // ── Aula 07 ──
    {
      aula: 7, tipo: 'escolha',
      enunciado: 'O que um crédito de descarbonização representa, segundo a aula?',
      alternativas: ['Um litro de biocombustível comercializado', 'Uma tonelada de dióxido de carbono equivalente evitada segundo a metodologia do programa', 'Um megawatt-hora de energia renovável'],
      correta: 1,
      evidencias: ['Um crédito de descarbonização representa uma tonelada de dióxido de carbono equivalente evitada segundo a metodologia do programa.'],
    },
    {
      aula: 7, tipo: 'aberto',
      enunciado: 'Uma usina recebe crédito de descarbonização por ter capacidade instalada?',
      evidencias: ['o produtor não recebe crédito por ter capacidade instalada. Ele precisa estar certificado, vender volume elegível e comprovar a documentação — capacidade autorizada não gera nenhum crédito.'],
    },
    // ── Aula 08 ──
    {
      aula: 8, tipo: 'aberto',
      enunciado: 'Diante de qualquer número de bioenergia, quais são as três perguntas que a aula manda fazer, e em que ordem?',
      evidencias: [
        'Um — base temporal: isto é ano-safra ou ano-calendário, e qual ciclo? Se for safra, é levantamento preliminar ou fechamento?',
        'Dois — rota: de qual insumo, por qual conversão? "Etanol" não é uma rota; etanol de cana de primeira geração é.',
        'Três — concorrente: o que deixou de ser feito com o mesmo insumo para que este número existisse?',
      ],
    },
  ],
};
