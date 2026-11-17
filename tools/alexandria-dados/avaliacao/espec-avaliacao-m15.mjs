// Especificação da avaliação do M15, lida por gerar-avaliacao-m14-m15.mjs.
//
// `afinidade`: aula → Ex NN do §Ex. A fonte não liga nenhum Ex a aula (P9). O vínculo segue a
//   sugestão por família do estudo docs/alexandria-v2/estudos/aulas/m15.md (F1 → A01; F2 →
//   A04/A06; F3 → A02/A06; F4 → A08), item a item pelo tema do enunciado.
// `doModulo`: Ex que fica nos exercícios do módulo, com a razão.
// `derivados`: pergunta de recuperação + trecho LITERAL da aula que a responde. Pergunta e
//   distratores são voz da Alexandria (decisões 7 e 8).

export default {
  afinidade: {
    1: [1, 2, 3, 4], // F1 · regime
    2: [9, 10], // F3 · R/P e critério de certeza
    4: [6, 8], // F2 · reajuste e camada; preço de referência (camada 3)
    6: [5, 7, 12], // F2 · preço de gás e comparação; F3 · produção bruta × oferta
    8: [13, 14, 15], // F4 · acoplamento elétrico
  },
  doModulo: {
    11: 'o enunciado dá o IRR do ano ("147%"), que é o calculado da previsão do INST·03 na Aula 02, e a fórmula da aula já o escreve (147,03%, velada até a previsão). Na Aula 02 ele entregaria a resposta antes do registro.',
  },
  alertasEx: {
    14: ['O cenário (US$ 10/MMBtu, R$ 5,50, 7,2 MMBtu/MWh) é outro que o padrão do INST·09; a conta é a fórmula do §08.1.'],
  },
  derivados: [
    // ── Aula 01 ──
    {
      aula: 1, tipo: 'escolha',
      enunciado: 'No regime de partilha, de quem é a molécula produzida?',
      alternativas: ['Da empresa contratada, a partir do ponto de medição', 'Da União', 'Dos estados produtores'],
      correta: 1,
      evidencias: ['A lógica é invertida: a molécula produzida é da União'],
    },
    // ── Aula 02 ──
    {
      aula: 2, tipo: 'aberto',
      enunciado: 'O que faz um recurso virar reserva, segundo a aula, e isso é definitivo?',
      evidencias: ['Um recurso vira reserva por decisão de comercialidade — que depende de preço, custo, tecnologia, logística e licença, e que pode ser revertida se qualquer uma dessas variáveis mudar.'],
    },
    // ── Aula 03 ──
    {
      aula: 3, tipo: 'escolha',
      enunciado: 'Royalty e participação especial são tributos?',
      alternativas: ['Sim, são tributos sobre o lucro da operadora', 'Não: são compensações financeiras, não tributos', 'Sim, são tarifas reguladas pela ANP'],
      correta: 1,
      evidencias: ['royalty e participação especial — são compensações financeiras, não tributos'],
    },
    {
      aula: 3, tipo: 'aberto',
      enunciado: 'Na forma mais simples, de que se compõe a receita de royalty de um mês?',
      evidencias: ['A receita de royalty de um mês é, na sua forma mais simples, volume produzido × preço de referência × alíquota'],
    },
    // ── Aula 04 ──
    {
      aula: 4, tipo: 'aberto',
      enunciado: 'Por que um reajuste na camada 4 pode não chegar à bomba?',
      evidencias: ['Um reajuste de camada 4 pode ser integralmente neutralizado por movimento em sentido contrário nas camadas 5 ou 6'],
    },
    // ── Aula 05 ──
    {
      aula: 5, tipo: 'aberto',
      enunciado: 'Ser autossuficiente em petróleo basta para ser autossuficiente em derivados? O que a aula diz que é preciso?',
      evidencias: ['Autossuficiência em petróleo é uma métrica de volume de cru. Autossuficiência em derivados exige compatibilidade entre quatro coisas: demanda por produto, capacidade instalada, rendimento da configuração e logística de entrega.'],
    },
    // ── Aula 06 ──
    {
      aula: 6, tipo: 'escolha',
      enunciado: 'O transportador de gás pode ser dono da molécula que transporta?',
      alternativas: ['Pode, desde que tenha autorização da ANP', 'Não: por desenho regulatório, o transportador não pode ser dono da molécula que transporta', 'Pode, se for também o distribuidor estadual'],
      correta: 1,
      evidencias: ['ela existe por desenho regulatório: o transportador não pode ser dono da molécula que transporta.'],
    },
    // ── Aula 07 ──
    {
      aula: 7, tipo: 'escolha',
      enunciado: 'O que a Lei nº 14.134/2021 mudou no regime do transporte de gás?',
      alternativas: ['Passou de autorização a concessão', 'Passou de concessão a autorização', 'Passou a exigir licitação prévia'],
      correta: 1,
      evidencias: ['Transporte passou de concessão a autorização, o que remove a necessidade de licitação prévia e muda o modelo de entrada.'],
    },
    // ── Aula 08 ──
    {
      aula: 8, tipo: 'escolha',
      enunciado: 'O que o consumo específico (heat rate) mede?',
      alternativas: ['Quanto gás a usina compra por mês', 'Quanta energia térmica de combustível a usina consome para entregar um MWh elétrico', 'Quanto da capacidade a usina declara como inflexível'],
      correta: 1,
      evidencias: ['O consumo específico — em inglês heat rate — mede quanta energia térmica de combustível a usina consome para entregar um MWh elétrico.'],
    },
    // ── Aula 09 ──
    {
      aula: 9, tipo: 'aberto',
      enunciado: 'Sobre a companhia estatal listada, que quatro coisas a aula manda separar, e quais delas são verificáveis em documento?',
      evidencias: ['A leitura boa separa quatro coisas que costumam ser confundidas: obrigação legal — o que a lei e o estatuto impõem; estratégia aprovada — o que o plano de negócios registra e o conselho sancionou; expectativa política — o que autoridades declaram desejar; e especulação — o que analistas projetam. Só a primeira e a segunda são verificáveis em documento.'],
    },
    {
      aula: 9, tipo: 'aberto',
      enunciado: 'O que uma licença para perfurar um poço exploratório autoriza — e o que ela não prova?',
      evidencias: ['licença para perfurar um poço exploratório autoriza testar um prospecto sob condicionantes; não prova descoberta, não estabelece reserva e não autoriza produção comercial.'],
    },
  ],
};
