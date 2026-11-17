// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m13.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m13 (aparato.json, modulo.json) e o texto das aulas
// (alexandria-modulo-13-content.ts, conferido contra o HTML original). Conferência:
// tools/alexandria-dados/avaliacao/verificar-avaliacao-m13.mjs. Relatório: docs/alexandria-v3/porte/m13.md.
// 19 itens por aula (4 da fonte, 15 derivados) · 10 Ex·NN do módulo (sem vínculo mecânico) · 10 questões na prova · 28 itens no checklist.
// A fonte não liga exercício a aula: cada Ex·NN vai para a última aula com vínculo mecânico, ou fica no módulo (ver o gerador).

import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m13-a01-d01",
    "moduloId": "modulo-13",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, por que o P/E é diretamente sensível à alavancagem?",
    "gabarito": null,
    "referencia": "Numerador e denominador pertencem ambos ao acionista. O preço é o que o acionista paga; o lucro é o que sobra depois de o credor ser pago.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a01",
      "linha": 916
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a01",
        "linha": 916,
        "trecho": "Numerador e denominador pertencem ambos ao acionista. O preço é o que o acionista paga; o lucro é o que sobra depois de o credor ser pago."
      }
    ]
  },
  {
    "id": "m13-a01-d02",
    "moduloId": "modulo-13",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Em que condições, segundo a aula, o P/E volta a ser o múltiplo adequado?",
    "gabarito": null,
    "referencia": "o lucro é recorrente e normalizado, a estrutura de capital é estável e comparável entre os pares, e a política de dividendos é o eixo da tese.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a01",
      "linha": 1065
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a01",
        "linha": 1065,
        "trecho": "o lucro é recorrente e normalizado, a estrutura de capital é estável e comparável entre os pares, e a política de dividendos é o eixo da tese."
      }
    ]
  },
  {
    "id": "m13-ex-03",
    "moduloId": "modulo-13",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Conversão entre taxa real e nominal</b><br>Com Selic nominal de 14,25% ao ano e inflação projetada de 5,16%, calcule a taxa real implícita corretamente e mostre o erro da subtração simples.",
    "gabarito": null,
    "referencia": "(1,1425 ÷ 1,0516) − 1 ≈ <b>8,64%</b> ao ano. A subtração simples daria 9,09%, um erro de cerca de 0,45 ponto percentual. Parece pequeno; propagado por vinte anos de fluxo descontado, produz um erro de valor presente de dois dígitos percentuais. Em patamares altos de juros e inflação, a relação multiplicativa não é preciosismo.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[2]",
      "linha": 2648
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[2].tag",
        "linha": 2648,
        "trecho": "03 · Conversão entre taxa real e nominal"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[2].enunciado.texto",
        "linha": 2648,
        "trecho": "Com Selic nominal de 14,25% ao ano e inflação projetada de 5,16%, calcule a taxa real implícita corretamente e mostre o erro da subtração simples."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[2].resposta_referencia.texto",
        "linha": 2648,
        "trecho": "(1,1425 ÷ 1,0516) − 1 ≈ 8,64% ao ano. A subtração simples daria 9,09%, um erro de cerca de 0,45 ponto percentual. Parece pequeno; propagado por vinte anos de fluxo descontado, produz um erro de valor presente de dois dígitos percentuais. Em patamares altos de juros e inflação, a relação multiplicativa não é preciosismo."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "vínculo mecânico · section#a02 (escolhida: a última)",
        "linha": null,
        "trecho": "com selic nominal de 14,25% ao ano e inflação projetada de 5,16%"
      }
    ],
    "alertas": [
      "A fonte dizia \"aproximadamente 8,7%\" e \"passa de meio ponto percentual\" na fórmula 02.4; a aula foi corrigida para \"aproximadamente 8,6%\" e \"chega a quase meio ponto percentual\" pela conta da própria fórmula (div-m13-taxa-real-8-6-vs-8-7, decidido em 15/11), que é o que esta resposta-modelo e o script dão: 8,64% e 0,45 ponto."
    ]
  },
  {
    "id": "m13-a02-d01",
    "moduloId": "modulo-13",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Quando alguém disser \"o WACC do setor é 10%\", o que a aula manda responder?",
    "gabarito": null,
    "referencia": "a resposta correta não é concordar nem discordar: é perguntar antes ou depois de impostos, e de que segmento.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a02",
      "linha": 1167
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a02",
        "linha": 1167,
        "trecho": "a resposta correta não é concordar nem discordar: é perguntar antes ou depois de impostos, e de que segmento."
      }
    ]
  },
  {
    "id": "m13-a02-d02",
    "moduloId": "modulo-13",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na tabela dos componentes de um DCF de concessão, o que são os ativos reversíveis?",
    "alternativas": [
      "Valor devido pelos investimentos não amortizados ao fim da concessão",
      "Bens que retornam ao poder concedente ao fim do contrato",
      "Aporte exigido por contrato ou por meta de qualidade, independente de retorno",
      "Direito ou expectativa de continuar operando depois do termo"
    ],
    "gabarito": 1,
    "referencia": "Bens que retornam ao poder concedente ao fim do contrato",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a02",
      "linha": 1139
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a02",
        "linha": 1139,
        "trecho": "Bens que retornam ao poder concedente ao fim do contrato"
      }
    ]
  },
  {
    "id": "m13-ex-01",
    "moduloId": "modulo-13",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Do EBITDA ao caixa</b><br>Uma companhia reporta EBITDA de R$ 1,0 bilhão, aumento de capital de giro de R$ 250 milhões, impostos pagos de R$ 80 milhões e investimento de R$ 500 milhões, sem outros ajustes. Estime o caixa livre antes de juros e diga o que a diferença revela.",
    "gabarito": null,
    "referencia": "R$ 170 milhões: 1.000 − 250 − 80 − 500. A conversão foi de dezessete por cento do EBITDA divulgado. Isso não indica problema em si — é o perfil esperado de uma distribuidora em ciclo pesado de investimento. O que a conta revela é que o EBITDA, isolado, não descreve capacidade de pagar dívida nem de distribuir dividendo, e que qualquer afirmação sobre essas duas coisas precisa passar pela demonstração de fluxo de caixa.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[0]",
      "linha": 2626
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[0].tag",
        "linha": 2626,
        "trecho": "01 · Do EBITDA ao caixa"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[0].enunciado.texto",
        "linha": 2626,
        "trecho": "Uma companhia reporta EBITDA de R$ 1,0 bilhão, aumento de capital de giro de R$ 250 milhões, impostos pagos de R$ 80 milhões e investimento de R$ 500 milhões, sem outros ajustes. Estime o caixa livre antes de juros e diga o que a diferença revela."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[0].resposta_referencia.texto",
        "linha": 2626,
        "trecho": "R$ 170 milhões: 1.000 − 250 − 80 − 500. A conversão foi de dezessete por cento do EBITDA divulgado. Isso não indica problema em si — é o perfil esperado de uma distribuidora em ciclo pesado de investimento. O que a conta revela é que o EBITDA, isolado, não descreve capacidade de pagar dívida nem de distribuir dividendo, e que qualquer afirmação sobre essas duas coisas precisa passar pela demonstração de fluxo de caixa."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "vínculo mecânico · section#a03 (escolhida: a última)",
        "linha": null,
        "trecho": "ebitda de r 1,0 bilhão aumento de capital de giro de r 250 milhões impostos pagos de r 80 milhões e investimento de r 500 milhões"
      }
    ],
    "alertas": [
      "O enunciado é o exemplo da fórmula 03.3 (EBITDA R$ 1,0 bi, capital de giro R$ 250 mi, impostos R$ 80 mi, investimento R$ 500 mi → R$ 170 mi), que a leitura da Aula 03 já resolve antes do exercício."
    ]
  },
  {
    "id": "m13-a03-d01",
    "moduloId": "modulo-13",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, qual dos dois documentos diz quem é a empresa, quem manda nela, o que ela deve, a quem e com que garantia?",
    "alternativas": [
      "O release",
      "O Formulário"
    ],
    "gabarito": 1,
    "referencia": "O Formulário diz quem é a empresa, quem manda nela, o que ela deve, a quem, com que garantia, e o que pode dar errado.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a03",
      "linha": 1378
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a03",
        "linha": 1378,
        "trecho": "O Formulário diz quem é a empresa, quem manda nela, o que ela deve, a quem, com que garantia, e o que pode dar errado."
      }
    ]
  },
  {
    "id": "m13-ex-13",
    "moduloId": "modulo-13",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Participação de 68% sem controle</b><br>Uma companhia adquire 68% do capital total de outra e cerca de 35,3% do capital votante. Quem controla, e por quê?",
    "gabarito": null,
    "referencia": "<b>Não é a adquirente.</b> Controle é poder de voto, e a União — por meio da estatal federal que a representa — permaneceu com cerca de 64,7% do capital votante e cerca de 32% do capital total, seguindo controladora. A divergência decorre de classes de ações com direitos distintos, e o resultado é uma companhia com sócio privado economicamente majoritário e sem controle. <em>Como verificar em qualquer caso:</em> composição por classe de ação no Formulário de Referência, acordo de acionistas arquivado, cláusulas estatutárias de limitação de voto, e exigência setorial de controle obrigatório quando aplicável.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[12]",
      "linha": 2781
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[12].tag",
        "linha": 2781,
        "trecho": "13 · Participação de 68% sem controle"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[12].enunciado.texto",
        "linha": 2781,
        "trecho": "Uma companhia adquire 68% do capital total de outra e cerca de 35,3% do capital votante. Quem controla, e por quê?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[12].resposta_referencia.texto",
        "linha": 2781,
        "trecho": "Não é a adquirente. Controle é poder de voto, e a União — por meio da estatal federal que a representa — permaneceu com cerca de 64,7% do capital votante e cerca de 32% do capital total, seguindo controladora. A divergência decorre de classes de ações com direitos distintos, e o resultado é uma companhia com sócio privado economicamente majoritário e sem controle. Como verificar em qualquer caso: composição por classe de ação no Formulário de Referência, acordo de acionistas arquivado, cláusulas estatutárias de limitação de voto, e exigência setorial de controle obrigatório quando aplicável."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "vínculo mecânico · section#a04 (escolhida: a última)",
        "linha": null,
        "trecho": "e cerca de 35,3% do capital votante"
      }
    ],
    "alertas": [
      "O enunciado é o caso da seção 04.2, que a leitura resolve antes do exercício; e o INST·07 (Aula 04, segundo instrumento) mostra o mesmo caso."
    ]
  },
  {
    "id": "m13-a04-d01",
    "moduloId": "modulo-13",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, onde mora o poder de decisão em companhia brasileira?",
    "gabarito": null,
    "referencia": "mora em quatro lugares simultâneos: a tabela de capital votante, o acordo de acionistas, o estatuto social e — cada vez mais — decisões judiciais e termos de conciliação.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a04",
      "linha": 1581
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a04",
        "linha": 1581,
        "trecho": "mora em quatro lugares simultâneos: a tabela de capital votante, o acordo de acionistas, o estatuto social e — cada vez mais — decisões judiciais e termos de conciliação."
      }
    ]
  },
  {
    "id": "m13-ex-04",
    "moduloId": "modulo-13",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Cobertura do serviço da dívida</b><br>Um projeto tem caixa disponível para o serviço da dívida de R$ 180 milhões e serviço de R$ 150 milhões no período. O covenant exige mínimo de 1,25×. Calcule e interprete.",
    "gabarito": null,
    "referencia": "1,20×. Está <b>abaixo</b> do mínimo contratual, o que caracteriza inadimplemento técnico e pode exigir dispensa formal do credor, aporte de capital ou renegociação. Nota importante: se o cálculo tivesse sido feito com EBITDA em vez do caixa disponível definido em contrato, o índice apareceria mais alto e o problema passaria despercebido até o teste formal.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[3]",
      "linha": 2657
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[3].tag",
        "linha": 2657,
        "trecho": "04 · Cobertura do serviço da dívida"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[3].enunciado.texto",
        "linha": 2657,
        "trecho": "Um projeto tem caixa disponível para o serviço da dívida de R$ 180 milhões e serviço de R$ 150 milhões no período. O covenant exige mínimo de 1,25×. Calcule e interprete."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[3].resposta_referencia.texto",
        "linha": 2657,
        "trecho": "1,20×. Está abaixo do mínimo contratual, o que caracteriza inadimplemento técnico e pode exigir dispensa formal do credor, aporte de capital ou renegociação. Nota importante: se o cálculo tivesse sido feito com EBITDA em vez do caixa disponível definido em contrato, o índice apareceria mais alto e o problema passaria despercebido até o teste formal."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "vínculo mecânico · section#a05 (escolhida: a última)",
        "linha": null,
        "trecho": "caixa disponível para o serviço da dívida"
      }
    ]
  },
  {
    "id": "m13-a05-d01",
    "moduloId": "modulo-13",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que, segundo a aula, caixa consolidado não é caixa disponível?",
    "gabarito": null,
    "referencia": "Caixa consolidado não é caixa disponível. Um grupo pode divulgar posição de liquidez robusta e ter, na holding, recursos insuficientes para o próprio vencimento — porque a maior parte do caixa está retida em projetos sob bloqueio de distribuição.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a05",
      "linha": 1731
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a05",
        "linha": 1731,
        "trecho": "Caixa consolidado não é caixa disponível. Um grupo pode divulgar posição de liquidez robusta e ter, na holding, recursos insuficientes para o próprio vencimento — porque a maior parte do caixa está retida em projetos sob bloqueio de distribuição."
      }
    ]
  },
  {
    "id": "m13-a05-d02",
    "moduloId": "modulo-13",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Entre os dois regimes de debênture incentivada, qual concentra o benefício no emissor?",
    "alternativas": [
      "o regime de 2011",
      "o regime de 2024"
    ],
    "gabarito": 1,
    "referencia": "o regime de 2024 concentra o benefício no emissor, o que reduz o custo depois de imposto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a05",
      "linha": 1891
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a05",
        "linha": 1891,
        "trecho": "o regime de 2024 concentra o benefício no emissor, o que reduz o custo depois de imposto."
      }
    ]
  },
  {
    "id": "m13-a06-d01",
    "moduloId": "modulo-13",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, o que é risco de crédito?",
    "alternativas": [
      "a probabilidade de a empresa ir mal",
      "a probabilidade de que ela não consiga honrar obrigações no vencimento"
    ],
    "gabarito": 1,
    "referencia": "Risco de crédito não é a probabilidade de a empresa ir mal. É a probabilidade de que ela não consiga honrar obrigações no vencimento",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a06",
      "linha": 1985
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a06",
        "linha": 1985,
        "trecho": "Risco de crédito não é a probabilidade de a empresa ir mal. É a probabilidade de que ela não consiga honrar obrigações no vencimento"
      }
    ]
  },
  {
    "id": "m13-a06-d02",
    "moduloId": "modulo-13",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Que pedido a associação de bioenergia e combustíveis ajuizou em março de 2026?",
    "alternativas": [
      "recuperação judicial",
      "recuperação extrajudicial"
    ],
    "gabarito": 1,
    "referencia": "ajuizou pedido de recuperação extrajudicial em março de 2026",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a06",
      "linha": 1990
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a06",
        "linha": 1990,
        "trecho": "ajuizou pedido de recuperação extrajudicial em março de 2026"
      }
    ]
  },
  {
    "id": "m13-a06-d03",
    "moduloId": "modulo-13",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, como a geração abaixo do previsto se manifesta numa geradora diversificada e numa sociedade de projeto?",
    "gabarito": null,
    "referencia": "A geração abaixo do previsto, numa geradora diversificada, é uma variação de resultado; na sociedade de projeto financiada com cobertura apertada, é um gatilho de bloqueio de dividendo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a06",
      "linha": 1952
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a06",
        "linha": 1952,
        "trecho": "A geração abaixo do previsto, numa geradora diversificada, é uma variação de resultado; na sociedade de projeto financiada com cobertura apertada, é um gatilho de bloqueio de dividendo."
      }
    ]
  },
  {
    "id": "m13-a07-d01",
    "moduloId": "modulo-13",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Na ficha da ENGIE Brasil Energia, por que a distinção entre participação econômica e poder de voto não se aplica?",
    "gabarito": null,
    "referencia": "Capital composto exclusivamente por ações ordinárias, o que torna participação econômica e poder de voto coincidentes",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a07",
      "linha": 2152
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a07",
        "linha": 2152,
        "trecho": "Capital composto exclusivamente por ações ordinárias, o que torna participação econômica e poder de voto coincidentes"
      }
    ]
  },
  {
    "id": "m13-a07-d02",
    "moduloId": "modulo-13",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Na ficha da Eneva, o maior acionista é o controlador? Que pergunta de verificação a aula propõe?",
    "gabarito": null,
    "referencia": "Maior acionista não é o mesmo que controlador. A pergunta de verificação: existe acordo de acionistas arquivado que agregue votos de mais de um sócio?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a07",
      "linha": 2165
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a07",
        "linha": 2165,
        "trecho": "Maior acionista não é o mesmo que controlador. A pergunta de verificação: existe acordo de acionistas arquivado que agregue votos de mais de um sócio?"
      }
    ]
  },
  {
    "id": "m13-a08-d01",
    "moduloId": "modulo-13",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, por que a exigência do contraponto não é uma formalidade de prudência?",
    "gabarito": null,
    "referencia": "É o que transforma a tese em objeto testável: uma afirmação que não pode ser derrubada por nenhuma evidência não está dizendo nada.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a08",
      "linha": 2305
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a08",
        "linha": 2305,
        "trecho": "É o que transforma a tese em objeto testável: uma afirmação que não pode ser derrubada por nenhuma evidência não está dizendo nada."
      }
    ]
  },
  {
    "id": "m13-a08-d02",
    "moduloId": "modulo-13",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Que frase em três partes a aula pede como conclusão condicional, no fim da hora?",
    "gabarito": null,
    "referencia": "a tese funciona se…; muda se…; ainda falta confirmar…",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo13.html",
      "campo": "section#a08",
      "linha": 2376
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo13.html",
        "campo": "section#a08",
        "linha": 2376,
        "trecho": "a tese funciona se…; muda se…; ainda falta confirmar…"
      }
    ]
  }
];

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [
  {
    "id": "m13-ex-02",
    "moduloId": "modulo-13",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Valor da firma e múltiplo</b><br>Uma empresa tem capital próprio avaliado em R$ 10 bilhões, dívida líquida de R$ 5 bilhões e EBITDA de R$ 2 bilhões. Calcule o EV/EBITDA e diga o que ainda falta antes de qualquer conclusão.",
    "gabarito": null,
    "referencia": "Valor da firma de R$ 15 bilhões; múltiplo de 7,5×. Faltam, no mínimo: prazo remanescente de concessão ou de contratos, investimento obrigatório à frente, qualidade e definição do EBITDA usado, os ajustes de valor da firma — participação de não controladores, arrendamentos, passivos atuariais, caixa não operacional — e um conjunto de comparáveis do mesmo arquétipo e do mesmo estágio de ciclo. Sem isso, 7,5× não é caro nem barato: é apenas 7,5×.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[1]",
      "linha": 2637
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[1].tag",
        "linha": 2637,
        "trecho": "02 · Valor da firma e múltiplo"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[1].enunciado.texto",
        "linha": 2637,
        "trecho": "Uma empresa tem capital próprio avaliado em R$ 10 bilhões, dívida líquida de R$ 5 bilhões e EBITDA de R$ 2 bilhões. Calcule o EV/EBITDA e diga o que ainda falta antes de qualquer conclusão."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[1].resposta_referencia.texto",
        "linha": 2637,
        "trecho": "Valor da firma de R$ 15 bilhões; múltiplo de 7,5×. Faltam, no mínimo: prazo remanescente de concessão ou de contratos, investimento obrigatório à frente, qualidade e definição do EBITDA usado, os ajustes de valor da firma — participação de não controladores, arrendamentos, passivos atuariais, caixa não operacional — e um conjunto de comparáveis do mesmo arquétipo e do mesmo estágio de ciclo. Sem isso, 7,5× não é caro nem barato: é apenas 7,5×."
      }
    ]
  },
  {
    "id": "m13-ex-05",
    "moduloId": "modulo-13",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Tese sobre companhia com ciclo pesado de investimento</b><br>A partir de uma ficha de distribuidora com investimento trimestral próximo do EBITDA trimestral, produza <b>uma</b> tese de investimento com âncora e contraponto.",
    "gabarito": null,
    "referencia": "<em>Tese:</em> o investimento executado hoje entra na base de remuneração regulatória e passa a gerar receita reconhecida a partir do próximo ciclo de revisão tarifária, convertendo um período de caixa livre negativo em um degrau de receita permanente. <em>Âncora:</em> valor do investimento no trimestre, abertura entre manutenção e expansão quando divulgada, e a data do próximo ciclo de revisão da concessão. <em>Contraponto:</em> a tese deixa de valer se o investimento não for integralmente reconhecido como prudente na revisão, ou se o ciclo de revisão for adiado — em ambos os casos, a companhia terá consumido caixa sem o degrau de receita correspondente.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[4]",
      "linha": 2669
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[4].tag",
        "linha": 2669,
        "trecho": "05 · Tese sobre companhia com ciclo pesado de investimento"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[4].enunciado.texto",
        "linha": 2669,
        "trecho": "A partir de uma ficha de distribuidora com investimento trimestral próximo do EBITDA trimestral, produza uma tese de investimento com âncora e contraponto."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[4].resposta_referencia.texto",
        "linha": 2669,
        "trecho": "Tese: o investimento executado hoje entra na base de remuneração regulatória e passa a gerar receita reconhecida a partir do próximo ciclo de revisão tarifária, convertendo um período de caixa livre negativo em um degrau de receita permanente. Âncora: valor do investimento no trimestre, abertura entre manutenção e expansão quando divulgada, e a data do próximo ciclo de revisão da concessão. Contraponto: a tese deixa de valer se o investimento não for integralmente reconhecido como prudente na revisão, ou se o ciclo de revisão for adiado — em ambos os casos, a companhia terá consumido caixa sem o degrau de receita correspondente."
      }
    ]
  },
  {
    "id": "m13-ex-06",
    "moduloId": "modulo-13",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Tese sobre companhia após combinação de negócios</b><br>Produza uma tese sobre uma companhia que incorporou outra e reporta alavancagem elevada, com âncora e contraponto.",
    "gabarito": null,
    "referencia": "<em>Tese:</em> as sinergias declaradas na combinação se convertem em caixa ao longo do período de integração, e a desalavancagem resultante reduz a despesa financeira, que hoje consome a maior parte do resultado operacional. <em>Âncora:</em> alavancagem reportada e sua trajetória trimestral, valor das sinergias declaradas contra o valor efetivamente realizado quando divulgado, e o cronograma de vencimentos. <em>Contraponto:</em> a tese cai se as sinergias forem majoritariamente contábeis em vez de caixa, ou se a integração exigir investimento não previsto — em ambos os casos, a alavancagem não cede e a despesa financeira permanece.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[5]",
      "linha": 2682
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[5].tag",
        "linha": 2682,
        "trecho": "06 · Tese sobre companhia após combinação de negócios"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[5].enunciado.texto",
        "linha": 2682,
        "trecho": "Produza uma tese sobre uma companhia que incorporou outra e reporta alavancagem elevada, com âncora e contraponto."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[5].resposta_referencia.texto",
        "linha": 2682,
        "trecho": "Tese: as sinergias declaradas na combinação se convertem em caixa ao longo do período de integração, e a desalavancagem resultante reduz a despesa financeira, que hoje consome a maior parte do resultado operacional. Âncora: alavancagem reportada e sua trajetória trimestral, valor das sinergias declaradas contra o valor efetivamente realizado quando divulgado, e o cronograma de vencimentos. Contraponto: a tese cai se as sinergias forem majoritariamente contábeis em vez de caixa, ou se a integração exigir investimento não previsto — em ambos os casos, a alavancagem não cede e a despesa financeira permanece."
      }
    ]
  },
  {
    "id": "m13-ex-07",
    "moduloId": "modulo-13",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Tese sobre companhia sem controlador</b><br>Produza uma tese cujo mecanismo dependa do arquétipo de controle, não da operação.",
    "gabarito": null,
    "referencia": "<em>Tese:</em> a ausência de acionista controlador dá à administração liberdade para alocar capital pelo melhor retorno disponível, sem a restrição de prioridade de política pública ou de necessidade fiscal de um controlador estatal — o que, num setor em consolidação, permite capturar oportunidades que companhias controladas não podem perseguir. <em>Âncora:</em> composição acionária sem bloco de controle no Formulário de Referência; histórico de decisões de alocação. <em>Contraponto:</em> a mesma ausência de controlador remove o principal freio sobre a administração, e a tese se inverte se a companhia demonstrar retorno incremental abaixo do custo de capital em aquisições sucessivas — momento em que a liberdade vira risco de execução sem contrapeso.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[6]",
      "linha": 2695
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[6].tag",
        "linha": 2695,
        "trecho": "07 · Tese sobre companhia sem controlador"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[6].enunciado.texto",
        "linha": 2695,
        "trecho": "Produza uma tese cujo mecanismo dependa do arquétipo de controle, não da operação."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[6].resposta_referencia.texto",
        "linha": 2695,
        "trecho": "Tese: a ausência de acionista controlador dá à administração liberdade para alocar capital pelo melhor retorno disponível, sem a restrição de prioridade de política pública ou de necessidade fiscal de um controlador estatal — o que, num setor em consolidação, permite capturar oportunidades que companhias controladas não podem perseguir. Âncora: composição acionária sem bloco de controle no Formulário de Referência; histórico de decisões de alocação. Contraponto: a mesma ausência de controlador remove o principal freio sobre a administração, e a tese se inverte se a companhia demonstrar retorno incremental abaixo do custo de capital em aquisições sucessivas — momento em que a liberdade vira risco de execução sem contrapeso."
      }
    ]
  },
  {
    "id": "m13-ex-08",
    "moduloId": "modulo-13",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>O que este trecho não diz</b><br>Trecho hipotético: \"A Companhia mantém garantias reais e fidejussórias constituídas em favor de credores no âmbito de contratos de financiamento de suas controladas.\" Identifique a lacuna e formule a pergunta.",
    "gabarito": null,
    "referencia": "<b>Garantia não detalhada.</b> O trecho confirma a existência de garantias e não informa: quais ativos foram dados, em que valor, a favor de qual credor, com que gatilho de execução, e se há garantia prestada pela controladora que reintroduza risco corporativo numa estrutura que parecia isolada. <em>Pergunta:</em> qual o valor contábil dos ativos onerados, e quais garantias corporativas existem em favor de dívidas de controladas? <em>Impacto:</em> altera diretamente o ativo efetivamente livre para novos financiamentos e a exposição real da holding.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[7]",
      "linha": 2711
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[7].tag",
        "linha": 2711,
        "trecho": "08 · O que este trecho não diz"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[7].enunciado.texto",
        "linha": 2711,
        "trecho": "Trecho hipotético: \"A Companhia mantém garantias reais e fidejussórias constituídas em favor de credores no âmbito de contratos de financiamento de suas controladas.\" Identifique a lacuna e formule a pergunta."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[7].resposta_referencia.texto",
        "linha": 2711,
        "trecho": "Garantia não detalhada. O trecho confirma a existência de garantias e não informa: quais ativos foram dados, em que valor, a favor de qual credor, com que gatilho de execução, e se há garantia prestada pela controladora que reintroduza risco corporativo numa estrutura que parecia isolada. Pergunta: qual o valor contábil dos ativos onerados, e quais garantias corporativas existem em favor de dívidas de controladas? Impacto: altera diretamente o ativo efetivamente livre para novos financiamentos e a exposição real da holding."
      }
    ],
    "alertas": [
      "O INST·05 da Aula 03 traz este trecho com o diagnóstico (categoria, pergunta, impacto): é a resposta. Hoje a AulaV3 só monta o primeiro instrumento da aula (INST·04); se o INST·05 passar a aparecer, abra-o só depois da tentativa."
    ]
  },
  {
    "id": "m13-ex-09",
    "moduloId": "modulo-13",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Contingência sem valor</b><br>Trecho hipotético: \"A Companhia figura como parte em processos de natureza tributária cuja perda é classificada como possível, sem provisão constituída.\" O que perguntar?",
    "gabarito": null,
    "referencia": "<b>Contingência sem valor provisionado.</b> A classificação como perda possível dispensa provisão pela norma contábil e <b>exige divulgação do valor envolvido em nota explicativa</b>. Se o valor não estiver na nota, é lacuna; se estiver, o exercício é comparar a magnitude com o patrimônio líquido e com a geração anual de caixa. <em>Pergunta:</em> qual o montante total das contingências classificadas como possíveis, por natureza, e qual a expectativa de prazo de julgamento? <em>Impacto:</em> uma contingência tributária relevante pode consumir anos de caixa livre e não aparece em nenhum múltiplo.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[8]",
      "linha": 2724
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[8].tag",
        "linha": 2724,
        "trecho": "09 · Contingência sem valor"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[8].enunciado.texto",
        "linha": 2724,
        "trecho": "Trecho hipotético: \"A Companhia figura como parte em processos de natureza tributária cuja perda é classificada como possível, sem provisão constituída.\" O que perguntar?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[8].resposta_referencia.texto",
        "linha": 2724,
        "trecho": "Contingência sem valor provisionado. A classificação como perda possível dispensa provisão pela norma contábil e exige divulgação do valor envolvido em nota explicativa. Se o valor não estiver na nota, é lacuna; se estiver, o exercício é comparar a magnitude com o patrimônio líquido e com a geração anual de caixa. Pergunta: qual o montante total das contingências classificadas como possíveis, por natureza, e qual a expectativa de prazo de julgamento? Impacto: uma contingência tributária relevante pode consumir anos de caixa livre e não aparece em nenhum múltiplo."
      }
    ],
    "alertas": [
      "Mesmo alerta do Ex·08: o INST·05 traz o diagnóstico deste trecho."
    ]
  },
  {
    "id": "m13-ex-10",
    "moduloId": "modulo-13",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Transação com parte relacionada</b><br>Uma companhia adquire de seu próprio controlador uma participação em ativo operacional, com valor atribuído declarado. Dois acionistas relevantes votam contra na assembleia. Qual a lacuna?",
    "gabarito": null,
    "referencia": "<b>Transação com parte relacionada sem preço de referência de mercado demonstrado.</b> O valor atribuído está divulgado; o que a lacuna pede é o <em>referencial</em>: houve laudo de avaliação independente, qual metodologia, qual a faixa de valor produzida, e como o preço acordado se situa dentro dela. Os votos contrários não provam nada sobre o preço — mas sinalizam que a lacuna foi percebida por outros acionistas, o que a torna prioritária. <em>Pergunta:</em> qual laudo suportou o valor atribuído, e qual comitê independente se manifestou? <em>Impacto:</em> define se a transação transferiu valor entre controlador e minoritários, e em que direção.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[9]",
      "linha": 2736
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[9].tag",
        "linha": 2736,
        "trecho": "10 · Transação com parte relacionada"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[9].enunciado.texto",
        "linha": 2736,
        "trecho": "Uma companhia adquire de seu próprio controlador uma participação em ativo operacional, com valor atribuído declarado. Dois acionistas relevantes votam contra na assembleia. Qual a lacuna?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[9].resposta_referencia.texto",
        "linha": 2736,
        "trecho": "Transação com parte relacionada sem preço de referência de mercado demonstrado. O valor atribuído está divulgado; o que a lacuna pede é o referencial: houve laudo de avaliação independente, qual metodologia, qual a faixa de valor produzida, e como o preço acordado se situa dentro dela. Os votos contrários não provam nada sobre o preço — mas sinalizam que a lacuna foi percebida por outros acionistas, o que a torna prioritária. Pergunta: qual laudo suportou o valor atribuído, e qual comitê independente se manifestou? Impacto: define se a transação transferiu valor entre controlador e minoritários, e em que direção."
      }
    ]
  },
  {
    "id": "m13-ex-11",
    "moduloId": "modulo-13",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>\"A AES Brasil está entre as maiores geradoras independentes do país\"</b><br>O que mudou, desde quando, e como reverificar?",
    "gabarito": null,
    "referencia": "A companhia deixou de existir como emissora independente. A americana AES Corporation vendeu a totalidade de sua participação à Auren Energia; operação anunciada em maio de 2024, aprovada pelo Cade em julho e <b>concluída em 31 de outubro de 2024</b>, com as ações deixando de ser negociadas a partir de 1º de novembro de 2024. A incorporação elevou a capacidade combinada da adquirente de cerca de 3,6 GW para cerca de 8,8 GW. <em>Como reverificar:</em> consulta ao cadastro de emissores da CVM e à lista de companhias listadas da bolsa; fatos relevantes da adquirente; e a seção de combinação de negócios nas demonstrações financeiras. <em>Formulação correta hoje:</em> os ativos e riscos daquela companhia estão no balanço da adquirente, e é ali que precisam ser rastreados.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[10]",
      "linha": 2752
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[10].tag",
        "linha": 2752,
        "trecho": "11 · \"A AES Brasil está entre as maiores geradoras independentes do país\""
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[10].enunciado.texto",
        "linha": 2752,
        "trecho": "O que mudou, desde quando, e como reverificar?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[10].resposta_referencia.texto",
        "linha": 2752,
        "trecho": "A companhia deixou de existir como emissora independente. A americana AES Corporation vendeu a totalidade de sua participação à Auren Energia; operação anunciada em maio de 2024, aprovada pelo Cade em julho e concluída em 31 de outubro de 2024, com as ações deixando de ser negociadas a partir de 1º de novembro de 2024. A incorporação elevou a capacidade combinada da adquirente de cerca de 3,6 GW para cerca de 8,8 GW. Como reverificar: consulta ao cadastro de emissores da CVM e à lista de companhias listadas da bolsa; fatos relevantes da adquirente; e a seção de combinação de negócios nas demonstrações financeiras. Formulação correta hoje: os ativos e riscos daquela companhia estão no balanço da adquirente, e é ali que precisam ser rastreados."
      }
    ]
  },
  {
    "id": "m13-ex-12",
    "moduloId": "modulo-13",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>\"A Neoenergia é negociada com free float de 16%\"</b><br>O que mudou, desde quando, e o que isso faz com o battlecard?",
    "gabarito": null,
    "referencia": "O fechamento de capital foi consumado. A controladora espanhola elevou sua posição em setembro de 2025 comprando a fatia de um fundo de pensão; a oferta pública de aquisição teve leilão em 9 de abril de 2026 e liquidação em 24 de abril; assembleia de 4 de maio de 2026 aprovou o resgate compulsório das 24.255.394 ações remanescentes a R$ 34,02, pagas em 15 de maio de 2026, com saída do segmento especial de listagem e migração de categoria de emissor. <em>Efeito no battlecard:</em> valor de mercado, dividend yield e EV/EBITDA a mercado deixam de existir; alavancagem, cobertura de juros, cronograma de vencimentos e covenants continuam — e a análise migra integralmente para a lente de credor. <em>Como reverificar:</em> cadastro de emissores da CVM, categoria de registro, e a página de relações com investidores para divulgações de dívida.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[11]",
      "linha": 2765
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[11].tag",
        "linha": 2765,
        "trecho": "12 · \"A Neoenergia é negociada com free float de 16%\""
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[11].enunciado.texto",
        "linha": 2765,
        "trecho": "O que mudou, desde quando, e o que isso faz com o battlecard?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[11].resposta_referencia.texto",
        "linha": 2765,
        "trecho": "O fechamento de capital foi consumado. A controladora espanhola elevou sua posição em setembro de 2025 comprando a fatia de um fundo de pensão; a oferta pública de aquisição teve leilão em 9 de abril de 2026 e liquidação em 24 de abril; assembleia de 4 de maio de 2026 aprovou o resgate compulsório das 24.255.394 ações remanescentes a R$ 34,02, pagas em 15 de maio de 2026, com saída do segmento especial de listagem e migração de categoria de emissor. Efeito no battlecard: valor de mercado, dividend yield e EV/EBITDA a mercado deixam de existir; alavancagem, cobertura de juros, cronograma de vencimentos e covenants continuam — e a análise migra integralmente para a lente de credor. Como reverificar: cadastro de emissores da CVM, categoria de registro, e a página de relações com investidores para divulgações de dívida."
      }
    ]
  },
  {
    "id": "m13-ex-14",
    "moduloId": "modulo-13",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Caso hipotético — classifique o arquétipo</b><br>Uma geradora tem 45% do capital votante com um fundo de infraestrutura estrangeiro, 30% com um fundo de pensão nacional, e os dois assinaram acordo de acionistas que vincula o voto de ambos em matérias relevantes. Os 25% restantes estão pulverizados. Qual o arquétipo, e participação é igual a voto?",
    "gabarito": null,
    "referencia": "O arquétipo é <b>joint venture coordenada</b> — não \"patrocinador financeiro\" nem \"sem controlador\". O acordo de acionistas cria um bloco de 75% do votante que exerce controle de fato, ainda que nenhum dos dois sócios individualmente detenha maioria. A pergunta de verificação decisiva é a vigência e o escopo do acordo: quais matérias vincula, por quanto tempo, e o que acontece se um dos dois quiser sair. <em>Sobre participação contra voto:</em> se o capital for composto apenas por ações ordinárias, as duas grandezas coincidem para cada sócio isolado — mas a soma vinculada pelo acordo é uma terceira grandeza, e é ela que define o controle. Nenhuma tabela de participação, sozinha, mostraria isso.",
    "criterio": "Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "exercicios.itens[13]",
      "linha": 2793
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[13].tag",
        "linha": 2793,
        "trecho": "14 · Caso hipotético — classifique o arquétipo"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[13].enunciado.texto",
        "linha": 2793,
        "trecho": "Uma geradora tem 45% do capital votante com um fundo de infraestrutura estrangeiro, 30% com um fundo de pensão nacional, e os dois assinaram acordo de acionistas que vincula o voto de ambos em matérias relevantes. Os 25% restantes estão pulverizados. Qual o arquétipo, e participação é igual a voto?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
        "campo": "exercicios.itens[13].resposta_referencia.texto",
        "linha": 2793,
        "trecho": "O arquétipo é joint venture coordenada — não \"patrocinador financeiro\" nem \"sem controlador\". O acordo de acionistas cria um bloco de 75% do votante que exerce controle de fato, ainda que nenhum dos dois sócios individualmente detenha maioria. A pergunta de verificação decisiva é a vigência e o escopo do acordo: quais matérias vincula, por quanto tempo, e o que acontece se um dos dois quiser sair. Sobre participação contra voto: se o capital for composto apenas por ações ordinárias, as duas grandezas coincidem para cada sócio isolado — mas a soma vinculada pelo acordo é uma terceira grandeza, e é ela que define o controle. Nenhuma tabela de participação, sozinha, mostraria isso."
      }
    ],
    "alertas": [
      "O INST·06 da Aula 04 tem este caso hipotético (\"fundo com 45% e acordo\") e devolve o arquétipo: é a resposta. Abra o instrumento só depois da tentativa."
    ]
  }
];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-13",
    "criterio": "O critério é oito de dez.",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m13-quiz-q01",
        "enunciado": "Uma companhia divulga, no mesmo trimestre, resultado operacional reportado de R$ 6,8 bi, ajustado de R$ 8,5 bi e regulatório ajustado de R$ 8,6 bi. Qual é a leitura correta?",
        "alternativas": [
          "Os três são o mesmo número com arredondamentos diferentes; use o maior, que é o mais recente.",
          "Dois deles estão errados: só o auditado é utilizável, e os ajustados devem ser descartados.",
          "A divergência indica manipulação da divulgação e desqualifica o release inteiro.",
          "Os três podem estar corretos e medem coisas diferentes; qualquer indicador derivado precisa declarar qual denominador usou, sob pena de não ser comparável com nenhuma outra companhia."
        ],
        "correta": 3,
        "explicacao": "Rótulo diferente, base diferente. O reportado parte das linhas auditadas; o ajustado exclui itens definidos pela administração; o regulatório parte de outra contabilidade. Nenhum é falso, e nenhum é comparável com o de outra empresa sem que a definição esteja declarada. A alavancagem da mesma companhia no mesmo trimestre aparece como 1,8× ou 1,9× dependendo apenas dessa escolha.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "avaliacao.perguntas[0]",
          "linha": 4149
        }
      },
      {
        "id": "m13-quiz-q02",
        "enunciado": "Uma empresa adquire 68% do capital total de outra e cerca de 35,3% do capital votante. Quem passa a controlar a companhia adquirida?",
        "alternativas": [
          "A adquirente, porque detém a maioria do capital total.",
          "Não a adquirente: controle é poder de voto, e a maioria do capital votante permaneceu com o sócio anterior, que segue controlando.",
          "O controle passa a ser compartilhado automaticamente, por força da participação econômica majoritária.",
          "Depende exclusivamente da aprovação do órgão de defesa da concorrência."
        ],
        "correta": 1,
        "explicacao": "Participação econômica e poder de voto são grandezas distintas sempre que houver classes de ações com direitos diferentes, acordo de acionistas, limitação estatutária de voto ou exigência setorial de controle. No caso real que sustenta esta questão, o sócio estatal permaneceu com cerca de 64,7% do votante e cerca de 32% do total — economicamente minoritário e controlador.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "avaliacao.perguntas[1]",
          "linha": 4156
        }
      },
      {
        "id": "m13-quiz-q03",
        "enunciado": "Em 2 de agosto de 2026, qual é o estado da Neoenergia como emissora?",
        "alternativas": [
          "Companhia de capital fechado: o resgate compulsório das ações remanescentes a R$ 34,02 foi aprovado em 4 de maio de 2026 e pago em 15 de maio, com saída do segmento especial de listagem.",
          "Em processo de oferta pública de aquisição, com resultado ainda indefinido.",
          "Companhia aberta com capital em circulação reduzido após oferta pública de aquisição.",
          "Companhia aberta, tendo a oferta pública de aquisição sido cancelada por insuficiência de adesão."
        ],
        "correta": 0,
        "explicacao": "O fechamento foi consumado. Efeito prático no battlecard: valor de mercado, retorno em dividendos e múltiplos a mercado deixam de existir; alavancagem, cobertura de juros, cronograma de vencimentos e covenants continuam sendo divulgados enquanto houver registro de emissor voltado a dívida. A análise migra integralmente para a lente de credor.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "avaliacao.perguntas[2]",
          "linha": 4163
        }
      },
      {
        "id": "m13-quiz-q04",
        "enunciado": "O currículo afirma que o custo de capital do setor brasileiro é \"tipicamente 8% a 12% real\". Qual é a correção mais precisa?",
        "alternativas": [
          "O intervalo está desatualizado: hoje seria de 5% a 8% real, por conta da queda dos juros.",
          "Não é uma faixa de custos de empresas diferentes: é o mesmo parâmetro regulatório expresso duas vezes — 8,10% real depois de impostos e 12,28% antes, para distribuição, pelo despacho vigente desde março de 2026.",
          "O intervalo está correto e é uma constante setorial estável ao longo do tempo.",
          "O intervalo não faz sentido porque não existe custo de capital regulatório no Brasil."
        ],
        "correta": 1,
        "explicacao": "Os dois extremos da faixa citada são, com precisão quase exata, o mesmo número antes e depois de impostos. Quando alguém disser \"o custo de capital do setor é 10%\", a resposta correta não é concordar nem discordar: é perguntar antes ou depois de impostos, e de que segmento — transmissão e geração têm 8,00% e 12,11% no mesmo ato.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "avaliacao.perguntas[3]",
          "linha": 4170
        }
      },
      {
        "id": "m13-quiz-q05",
        "enunciado": "Qual é a diferença central entre o custo de capital regulatório e o custo de capital que o analista usa para avaliar a companhia?",
        "alternativas": [
          "Não há diferença: o regulador calcula exatamente o custo de capital de cada empresa.",
          "O regulatório é sempre mais alto, por incluir prêmio de risco de política pública.",
          "O regulatório é um parâmetro administrativo aplicado à base de ativos reconhecida para calcular a receita; o do analista é uma estimativa do custo do capital daquela companhia, usada para calcular valor.",
          "O regulatório se aplica apenas a geração, e o do analista apenas a distribuição."
        ],
        "correta": 2,
        "explicacao": "Um entra no cálculo da receita, o outro no cálculo do valor. Confundi-los transforma um parâmetro de tarifa numa promessa de rentabilidade que ninguém fez: eficiência operacional, investimento não reconhecido como prudente, qualidade e estrutura de capital real fazem o retorno efetivo divergir do parâmetro.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "avaliacao.perguntas[4]",
          "linha": 4177
        }
      },
      {
        "id": "m13-quiz-q06",
        "enunciado": "Um analista aplica crescimento perpétuo ao fluxo de uma concessão com doze anos remanescentes, argumentando que concessões historicamente são renovadas. Qual é a correção?",
        "alternativas": [
          "Nenhuma: o histórico de renovações justifica a perpetuidade.",
          "Remover a perpetuidade, ou modelar a renovação como cenário com probabilidade declarada e condicionantes precificadas, sustentado por norma, contrato ou decisão do regulador.",
          "Reduzir a taxa de crescimento perpétuo pela metade, mantendo a estrutura.",
          "Substituir o fluxo de caixa descontado por múltiplo de mercado, que não tem esse problema."
        ],
        "correta": 1,
        "explicacao": "Renovação é cenário até virar direito comprovável. O caso da distribuidora do Rio de Janeiro é a demonstração: o horizonte contratual do ativo era de meses até a recomendação de prorrogação por trinta anos, em dezembro de 2025. O ativo físico não mudou; o direito econômico mudou. Substituir por múltiplo não resolve — só esconde a mesma premissa dentro do comparável.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "avaliacao.perguntas[5]",
          "linha": 4184
        }
      },
      {
        "id": "m13-quiz-q07",
        "enunciado": "Uma sociedade de projeto tem caixa disponível para o serviço da dívida de R$ 180 milhões e serviço de R$ 150 milhões, com covenant mínimo de 1,25×. Como interpretar?",
        "alternativas": [
          "Cobertura de 1,20×, abaixo do mínimo: caracteriza inadimplemento técnico, que pode exigir dispensa formal do credor, aporte de capital ou renegociação.",
          "Cobertura de 1,20×, acima do mínimo, porque o covenant só é testado ao fim do prazo.",
          "A informação é insuficiente: sem o resultado operacional, o índice não pode ser calculado.",
          "Cobertura de 0,83×, já que o índice se calcula dividindo o serviço pelo caixa disponível."
        ],
        "correta": 0,
        "explicacao": "O índice é o caixa disponível dividido pelo serviço, e 180 sobre 150 dá 1,20×. A alternativa que pede o resultado operacional contém o erro que a Aula 05 combate: o índice se calcula com o caixa disponível definido em contrato, que deduz impostos pagos, capital de giro e investimento de manutenção antes de chegar ao credor — nunca com resultado operacional, que ignora as três saídas.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "avaliacao.perguntas[6]",
          "linha": 4191
        }
      },
      {
        "id": "m13-quiz-q08",
        "enunciado": "Qual é o efeito de alavancagem alta sobre o preço sobre lucro e sobre o valor da firma sobre resultado operacional?",
        "alternativas": [
          "Reduz os dois, porque a dívida é mais barata que o capital próprio.",
          "Eleva o preço sobre lucro e reduz o valor da firma sobre resultado operacional.",
          "Não tem efeito sistemático sobre nenhum dos dois, porque ambos neutralizam a estrutura de capital.",
          "Eleva os dois, mas por mecanismos opostos: no primeiro a dívida reduz o denominador, via juros; no segundo a dívida entra no numerador, via valor da firma."
        ],
        "correta": 3,
        "explicacao": "O mesmo fato produz duas leituras que parecem confirmar uma à outra e apontam para coisas diferentes. É por isso que nenhum instrumento sério classifica uma companhia como cara ou barata a partir de um múltiplo isolado: é preciso cruzar pelo menos dois sinais — múltiplo com alavancagem, ou retorno em dividendos com política de distribuição.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "avaliacao.perguntas[7]",
          "linha": 4198
        }
      },
      {
        "id": "m13-quiz-q09",
        "enunciado": "Um grupo divulga posição consolidada de caixa suficiente para os compromissos de curto prazo. Qual é a lacuna, e qual a pergunta correta?",
        "alternativas": [
          "Não há lacuna: caixa consolidado é caixa disponível para o grupo.",
          "A lacuna é o prazo de aplicação do caixa; a pergunta é qual a rentabilidade obtida.",
          "A lacuna é caixa restrito por sociedade de projeto; a pergunta é quanto do consolidado está na holding e em subsidiárias sem restrição, e sob que condições o caixa das sociedades de projeto pode ser distribuído.",
          "A lacuna é a moeda em que o caixa está denominado; a pergunta é qual a exposição cambial."
        ],
        "correta": 2,
        "explicacao": "É a lacuna mais específica do setor de infraestrutura e a que mais passa despercebida. Caixa em sociedade de projeto frequentemente está bloqueado por contrato enquanto testes de cobertura não forem cumpridos, e não transita até a holding — que é onde o vencimento costuma estar. O número consolidado está correto e a conclusão tirada dele, não.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "avaliacao.perguntas[8]",
          "linha": 4205
        }
      },
      {
        "id": "m13-quiz-q10",
        "enunciado": "Um investidor pergunta, ao fim de uma análise bem construída: \"então essa ação é uma boa compra?\". Qual é a resposta correta?",
        "alternativas": [
          "Sim ou não, conforme o resultado da análise: recusar responder desqualifica o trabalho.",
          "Devolver a estrutura em três fatos — quem controla, qual a alavancagem e com que desenho, qual evento está pendente —, a condição de cada tese, e a pergunta de volta sobre horizonte e tolerância a risco.",
          "Não posso responder por restrições regulatórias, encerrando o assunto.",
          "Apresentar um preço-alvo com faixa de confiança, deixando a decisão com o investidor."
        ],
        "correta": 1,
        "explicacao": "A resposta correta nunca é sim, não, nem uma evasiva. Um veredito binário é derrubável por qualquer contra-exemplo e não sobrevive a mudança de premissa; uma estrutura com condições declaradas sobrevive e, quando a premissa muda, diz exatamente o que muda junto. Preço-alvo com faixa continua sendo preço-alvo — e não é entregue em nenhum ativo da NIVAR, em nenhuma hipótese.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "avaliacao.perguntas[9]",
          "linha": 4212
        }
      }
    ],
    "faixas": [
      {
        "min": 0,
        "max": 7,
        "mensagem": "Abaixo do critério de oito acertos. Antes de refazer, verifique o padrão do erro: quase todas estas questões testam definição — qual rótulo de resultado operacional, qual denominador de alavancagem, qual caixa entra na cobertura —, status societário — aberta contra fechada, concluída contra anunciada — ou sinal cruzado — múltiplo sozinho contra múltiplo com alavancagem. São esses três que derrubam a credibilidade de tudo que veio antes."
      },
      {
        "min": 8,
        "max": 10,
        "mensagem": "Critério atingido. A matéria sustenta uma hora com um Formulário de Referência aberto, inclusive a parte mais difícil: recusar a pergunta binária sobre se a ação é uma boa compra, devolvendo estrutura, condição e a pergunta sobre horizonte e tolerância a risco."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "avaliacao.faixas_de_placar_script",
      "linha": null
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
      "campo": "avaliacao.criterio_literal_prosa.texto",
      "linha": 2816
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-13",
    "introducao": "O primeiro item é o critério de domínio inteiro. O último é a disciplina que torna todos os outros publicáveis. Marque mentalmente cada um; os que ficarem em branco são a agenda de estudo.",
    "itens": [
      {
        "id": "m13-checklist-01",
        "texto": "Produzo três teses, três riscos e três lacunas a partir de uma ficha de empresa em menos de uma hora, sem consultar o gabarito — cada tese com âncora e contraponto, cada risco com evento e caminho até o caixa, cada lacuna com pergunta formulável e impacto na conclusão.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[0].texto",
          "linha": 2950
        }
      },
      {
        "id": "m13-checklist-02",
        "texto": "Digo, sem hesitar, qual dos seis arquétipos de controle cada uma das dez empresas vivas representa.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[1].texto",
          "linha": 2951
        }
      },
      {
        "id": "m13-checklist-03",
        "texto": "Verifico se participação econômica é igual a poder de voto antes de escrever \"controlada por\" em qualquer ficha.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[2].texto",
          "linha": 2952
        }
      },
      {
        "id": "m13-checklist-04",
        "texto": "Sei que a AES Brasil deixou de existir como emissora independente em 31 de outubro de 2024, e trato o nome como campo histórico dentro da ficha da adquirente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[3].texto",
          "linha": 2953
        }
      },
      {
        "id": "m13-checklist-05",
        "texto": "Sei que a Neoenergia consumou o fechamento de capital em maio de 2026, e que isso elimina metade dos indicadores padrão e mantém a outra metade.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[4].texto",
          "linha": 2954
        }
      },
      {
        "id": "m13-checklist-06",
        "texto": "Sei que a alienação da participação na operadora nuclear pela AXIA foi concluída em março de 2026, e que a União segue controlando a operadora por poder de voto.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[5].texto",
          "linha": 2955
        }
      },
      {
        "id": "m13-checklist-07",
        "texto": "Sei que a recuperação extrajudicial da Raízen foi homologada em 30 de julho de 2026, e que a sentença ainda comportava recurso na data de verificação.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[6].texto",
          "linha": 2956
        }
      },
      {
        "id": "m13-checklist-08",
        "texto": "Recuso classificar uma empresa como cara ou barata a partir de um múltiplo isolado, e digo qual é o segundo sinal que preciso cruzar.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[7].texto",
          "linha": 2957
        }
      },
      {
        "id": "m13-checklist-09",
        "texto": "Explico por que alavancagem alta infla o preço sobre lucro e o valor da firma sobre EBITDA por mecanismos opostos.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[8].texto",
          "linha": 2958
        }
      },
      {
        "id": "m13-checklist-10",
        "texto": "Declaro sempre qual rótulo de EBITDA estou usando — reportado, societário, ajustado pela administração, ou regulatório ajustado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[9].texto",
          "linha": 2959
        }
      },
      {
        "id": "m13-checklist-11",
        "texto": "Reconstruo a ponte do EBITDA ao caixa livre à mão, deduzindo capital de giro, impostos pagos e investimento.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[10].texto",
          "linha": 2960
        }
      },
      {
        "id": "m13-checklist-12",
        "texto": "Testo recorrência, efeito de caixa, controle da administração e simetria antes de aceitar qualquer ajuste gerencial.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[11].texto",
          "linha": 2961
        }
      },
      {
        "id": "m13-checklist-13",
        "texto": "Mantenho três colunas em qualquer normalização: reportado, ajuste da administração, ajuste do analista.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[12].texto",
          "linha": 2962
        }
      },
      {
        "id": "m13-checklist-14",
        "texto": "Distingo WACC corporativo de taxa regulatória de remuneração do capital, e sei que a segunda é fixada anualmente pelo regulador.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[13].texto",
          "linha": 2963
        }
      },
      {
        "id": "m13-checklist-15",
        "texto": "Sei que a faixa de 8% a 12% real não é intervalo de incerteza: é o mesmo número regulatório antes e depois de impostos.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[14].texto",
          "linha": 2964
        }
      },
      {
        "id": "m13-checklist-16",
        "texto": "Converto taxa real em nominal pela relação multiplicativa, nunca por subtração.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[15].texto",
          "linha": 2965
        }
      },
      {
        "id": "m13-checklist-17",
        "texto": "Não aplico perpetuidade a concessão com prazo definido sem direito documentado, e sei qual documento sustentaria esse direito.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[16].texto",
          "linha": 2966
        }
      },
      {
        "id": "m13-checklist-18",
        "texto": "Modelo indenização como fluxo probabilístico descontado até a data provável de recebimento efetivo, não de apuração.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[17].texto",
          "linha": 2967
        }
      },
      {
        "id": "m13-checklist-19",
        "texto": "Verifico a coerência nominal contra real, pré contra pós-impostos, e alavancado contra desalavancado em cada linha do modelo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[18].texto",
          "linha": 2968
        }
      },
      {
        "id": "m13-checklist-20",
        "texto": "Calculo cobertura do serviço da dívida com o caixa disponível definido em contrato, nunca com EBITDA.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[19].texto",
          "linha": 2969
        }
      },
      {
        "id": "m13-checklist-21",
        "texto": "Trato a proporção de setenta por trinta como referência de universo, e a capacidade de dívida como saída do cálculo de cobertura.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[20].texto",
          "linha": 2970
        }
      },
      {
        "id": "m13-checklist-22",
        "texto": "Pergunto quanto do caixa consolidado é livre para transitar até a holding, e sob que condições.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[21].texto",
          "linha": 2971
        }
      },
      {
        "id": "m13-checklist-23",
        "texto": "Uso soma das partes em grupo com segmentos de risco distinto, com alocação explícita de dívida e de custos corporativos.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[22].texto",
          "linha": 2972
        }
      },
      {
        "id": "m13-checklist-24",
        "texto": "Trato relatório de corretora como pesquisa de terceiro, citável com casa e data, e nunca como origem de um número financeiro.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[23].texto",
          "linha": 2973
        }
      },
      {
        "id": "m13-checklist-25",
        "texto": "Registro, em toda ficha, o trimestre do dado e a data em que verifiquei o status societário.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[24].texto",
          "linha": 2974
        }
      },
      {
        "id": "m13-checklist-26",
        "texto": "Avalio a geradora que me oferece contrato de longo prazo também como contraparte de risco de crédito, não apenas como fornecedora.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[25].texto",
          "linha": 2975
        }
      },
      {
        "id": "m13-checklist-27",
        "texto": "Nunca nomeio executivo, presidente ou conselheiro de nenhuma companhia em ativo publicado, porque mandato muda e um nome errado destrói a credibilidade do resto.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[26].texto",
          "linha": 2976
        }
      },
      {
        "id": "m13-checklist-28",
        "texto": "Recuso a pergunta \"essa ação é uma boa compra?\" devolvendo estrutura, condição e a pergunta de volta sobre horizonte e tolerância a risco — e nunca emito recomendação de compra, venda ou manutenção, nem preço-alvo, em nenhuma hipótese.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m13/aparato.json",
          "campo": "checklist_final.itens[27].texto",
          "linha": 2977
        }
      }
    ]
  }
];
