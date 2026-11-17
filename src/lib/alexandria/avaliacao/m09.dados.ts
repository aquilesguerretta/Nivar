// Avaliação do M09 (exercícios por aula, prova, checklist). Posse: a sessão de porte do M09.
// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m09.mjs — não editar à mão.
// Conferido por tools/alexandria-dados/avaliacao/verificar-avaliacao-m09.mjs.
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m09-ex-01",
    "moduloId": "modulo-09",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Desenhe os dois ambientes e diga por onde o dinheiro entra em cada um.",
    "gabarito": null,
    "referencia": "No ambiente regulado: o consumidor cativo faz <b>um</b> pagamento, à distribuidora, em fatura única que reúne energia, uso da rede, encargos e tributos, com adicional de bandeira quando acionada. A distribuidora paga os vendedores dos contratos regulados, paga transmissão e encargos, e tem custos de compra de energia tratados por regras de reconhecimento tarifário.<br><br>No ambiente livre: o consumidor faz <b>no mínimo três</b> — energia ao vendedor por contrato bilateral, uso do sistema à distribuidora, e a liquidação da diferença no mercado de curto prazo, além de encargos, garantias e o custo de representação ou adesão. A câmara não paga o contrato bilateral: ela registra a posição, contabiliza contra a medição e liquida apenas a diferença.<br><br><b>Erro que importa:</b> desenhar uma seta de dinheiro do consumidor livre direto para a câmara como se ela fosse a compradora. Ela é a contabilizadora e liquidante da diferença, não a contraparte do contrato.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[0].enunciado",
      "linha": 1893
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[0].enunciado.texto",
        "linha": 1893,
        "trecho": "Desenhe os dois ambientes e diga por onde o dinheiro entra em cada um."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-01'][0]",
        "linha": null,
        "trecho": "fatura única"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 1 a nenhuma aula (§Ex, Bloco A · Reconstrução estrutural). O termo «fatura única», que está no exercício, aparece literalmente só na Aula 01, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-ex-02",
    "moduloId": "modulo-09",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma pessoa afirma que o consumidor livre \"compra energia de uma usina eólica específica\". Corrija sem ser pedante.",
    "gabarito": null,
    "referencia": "Ela compra uma posição comercial: o direito e a obrigação sobre um montante de energia, com atributo de fonte, entregue contabilmente num submercado. A energia física que aciona os motores da fábrica vem do despacho do sistema interligado, coordenado pelo operador, e não segue o contrato. Um contrato com usina específica define de quem se compra, qual atributo se adquire e quem carrega qual risco — não a trajetória física dos elétrons.<br><br>A correção que importa comercialmente: comprar de fonte específica, comprar de portfólio de uma fonte, comprar energia incentivada e comprar certificado ambiental são quatro produtos distintos, com implicações diferentes de risco, de benefício regulatório e de alegação ambiental.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[1].enunciado",
      "linha": 1899
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[1].enunciado.texto",
        "linha": 1899,
        "trecho": "Uma pessoa afirma que o consumidor livre \"compra energia de uma usina eólica específica\". Corrija sem ser pedante."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-01'][15]",
        "linha": null,
        "trecho": "elétron"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 2 a nenhuma aula (§Ex, Bloco A · Reconstrução estrutural). O termo «elétron», que está no exercício, aparece literalmente só na Aula 01, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-ex-14",
    "moduloId": "modulo-09",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um contrato firmado em 2023 previa desconto na tarifa de uso por energia incentivada. Em 2026 a empresa quer ampliar a demanda contratada. O que acontece?",
    "gabarito": null,
    "referencia": "A vedação introduzida em 2025 alcança expressamente as ampliações do montante de uso dos sistemas de transmissão ou distribuição solicitadas por quem já havia exercido a opção, mantida a possibilidade de redução sobre o montante já contratado na data de entrada em vigor do dispositivo. Em linguagem operacional: o benefício tende a permanecer sobre o patamar original e a não se estender à ampliação.<br><br><b>A resposta completa inclui a ressalva de método:</b> a aplicação concreta depende da regulamentação e da leitura da agência sobre casos em transição. A conduta correta é verificar o texto compilado vigente e o estado da regulamentação antes de dimensionar o efeito na expansão — e, sobretudo, antes de aprovar um projeto de ampliação cujo caso de negócio dependa desse desconto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[13].enunciado",
      "linha": 1962
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[13].enunciado.texto",
        "linha": 1962,
        "trecho": "Um contrato firmado em 2023 previa desconto na tarifa de uso por energia incentivada. Em 2026 a empresa quer ampliar a demanda contratada. O que acontece?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-01'][5]",
        "linha": null,
        "trecho": "ampliações"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 14 a nenhuma aula (§Ex, Bloco C · Leitura de contrato). O termo «ampliações», que está no exercício, aparece literalmente só na Aula 01, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-a02-d01",
    "moduloId": "modulo-09",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, o que significa a sobra contratual de uma distribuidora — e o que ela não significa?",
    "gabarito": null,
    "referencia": "Sobra contratual não significa energia física desperdiçada. Significa que a posição contratada da distribuidora excede a necessidade reconhecida.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
      "campo": "MODULO_09_CORPO['aula-09-02'][8]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-02'][8]",
        "linha": null,
        "trecho": "Sobra contratual não significa energia física desperdiçada. Significa que a posição contratada da distribuidora excede a necessidade reconhecida."
      }
    ]
  },
  {
    "id": "m09-a02-d02",
    "moduloId": "modulo-09",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Para energia de novos empreendimentos, qual é hoje a janela legal de antecedência da entrega, contada a partir da licitação?",
    "alternativas": [
      "cento e oitenta dias",
      "vinte e quatro meses",
      "de três a sete anos"
    ],
    "gabarito": 2,
    "referencia": "A janela de antecedência da energia nova, portanto, é hoje uma faixa legal de três a sete anos",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
      "campo": "MODULO_09_CORPO['aula-09-02'][14]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-02'][14]",
        "linha": null,
        "trecho": "A janela de antecedência da energia nova, portanto, é hoje uma faixa legal de três a sete anos"
      }
    ]
  },
  {
    "id": "m09-a02-d03",
    "moduloId": "modulo-09",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O consumidor livre não paga bandeira sobre a energia contratada. Por que, segundo a aula, isso não é uma economia?",
    "gabarito": null,
    "referencia": "o consumidor livre não paga bandeira sobre a energia contratada, e isso não é uma economia. É uma troca de mecanismo. Ele passa a pagar, sobre a parcela descoberta, o preço horário do submercado — que pode ser menor que o adicional de bandeira, ou várias vezes maior, na mesma semana.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
      "campo": "MODULO_09_CORPO['aula-09-02'][30]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-02'][30]",
        "linha": null,
        "trecho": "o consumidor livre não paga bandeira sobre a energia contratada, e isso não é uma economia. É uma troca de mecanismo. Ele passa a pagar, sobre a parcela descoberta, o preço horário do submercado — que pode ser menor que o adicional de bandeira, ou várias vezes maior, na mesma semana."
      }
    ]
  },
  {
    "id": "m09-ex-06",
    "moduloId": "modulo-09",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma empresa quer migrar em dois meses; o contrato com a distribuidora exige antecedência maior de denúncia. O que você responde?",
    "gabarito": null,
    "referencia": "Que a data não é executável, e que isso não é negociável com o fornecedor de energia — é regra de contrato de rede. As opções são: adiar o início de suprimento para a primeira data executável, contada a partir do protocolo da denúncia; ou verificar, no instrumento específico e com a distribuidora, se há hipótese aplicável de antecedência reduzida.<br><br>O que <b>não</b> se faz: assinar contrato de energia com início numa data que a janela contratual não permite. Isso cria posição contratada sem carga correspondente, com liquidação da sobra ao preço do momento, e a responsabilidade é integralmente do comprador.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[5].enunciado",
      "linha": 1920
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[5].enunciado.texto",
        "linha": 1920,
        "trecho": "Uma empresa quer migrar em dois meses; o contrato com a distribuidora exige antecedência maior de denúncia. O que você responde?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-03'][9]",
        "linha": null,
        "trecho": "denúncia"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 6 a nenhuma aula (§Ex, Bloco B · Diagnóstico negativo e inconclusivo). O termo «denúncia», que está no exercício, aparece literalmente nas Aulas 01, 03, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-a03-d01",
    "moduloId": "modulo-09",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Em 1º de janeiro de 2024, para quem a abertura do ambiente livre foi ampliada, sem exigência de carga mínima como teste geral?",
    "alternativas": [
      "cargas acima de 10 MW",
      "todos os consumidores do Grupo A",
      "consumidores atendidos em tensão inferior a 2,3 kV"
    ],
    "gabarito": 1,
    "referencia": "a abertura foi ampliada para todos os consumidores do Grupo A",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
      "campo": "MODULO_09_CORPO['aula-09-03'][0]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-03'][0]",
        "linha": null,
        "trecho": "a abertura foi ampliada para todos os consumidores do Grupo A"
      }
    ]
  },
  {
    "id": "m09-a03-d02",
    "moduloId": "modulo-09",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, quem arca com os custos do déficit involuntário do supridor de última instância, e por qual meio?",
    "gabarito": null,
    "referencia": "os custos e efeitos financeiros decorrentes do déficit involuntário do supridor de última instância serão rateados entre todos os consumidores do ambiente livre, por meio de encargo tarifário específico, conforme regulamentação.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
      "campo": "MODULO_09_CORPO['aula-09-03'][19]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-03'][19]",
        "linha": null,
        "trecho": "os custos e efeitos financeiros decorrentes do déficit involuntário do supridor de última instância serão rateados entre todos os consumidores do ambiente livre, por meio de encargo tarifário específico, conforme regulamentação."
      }
    ]
  },
  {
    "id": "m09-ex-10",
    "moduloId": "modulo-09",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Contrato de trinta e seis meses, volume plano, sem banda, preço fixo, entrega no mesmo submercado do consumo. Qual risco ficou descoberto?",
    "gabarito": null,
    "referencia": "Preço está travado sobre o montante contratado; submercado está resolvido. Ficam descobertos: <b>volume</b> integralmente, sem banda alguma; <b>perfil</b>, mensal e horário, porque a entrega é plana; <b>crédito da contraparte</b>, salvo garantia contratada à parte; <b>regulatório</b>, salvo cláusula específica de mudança em lei; e <b>renovação</b>, concentrada num único vencimento em trinta e seis meses.<br><br>Observe a assimetria: a estrutura mais simples de precificar é também a que deixa mais classes de risco descobertas. Simplicidade contratual não é conservadorismo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[9].enunciado",
      "linha": 1942
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[9].enunciado.texto",
        "linha": 1942,
        "trecho": "Contrato de trinta e seis meses, volume plano, sem banda, preço fixo, entrega no mesmo submercado do consumo. Qual risco ficou descoberto?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-04'][13]",
        "linha": null,
        "trecho": "Volume plano"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 10 a nenhuma aula (§Ex, Bloco C · Leitura de contrato). O termo «volume plano», que está no exercício, aparece literalmente só na Aula 04, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-ex-11",
    "moduloId": "modulo-09",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma proposta oferece banda de mais ou menos vinte por cento. O que você lê antes de considerar isso vantajoso?",
    "gabarito": null,
    "referencia": "A simetria dos dois lados. Qual é o preço do excedente acima do teto da banda e qual é o preço de devolução da sobra abaixo do piso — são frequentemente diferentes, e a diferença é a margem real do vendedor. Depois: se há montante mínimo por trás da banda; qual é a janela de declaração e de reprogramação; se a banda é mensal, anual ou acumulada; e se o não uso da banda gera crédito.<br><br>Uma banda ampla com excedente caro e devolução mal remunerada pode ser economicamente pior que uma banda estreita simétrica, com o mesmo preço de capa.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[10].enunciado",
      "linha": 1947
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[10].enunciado.texto",
        "linha": 1947,
        "trecho": "Uma proposta oferece banda de mais ou menos vinte por cento. O que você lê antes de considerar isso vantajoso?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-04'][9]",
        "linha": null,
        "trecho": "devolução da sobra"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 11 a nenhuma aula (§Ex, Bloco C · Leitura de contrato). O termo «devolução da sobra», que está no exercício, aparece literalmente só na Aula 04, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-ex-12",
    "moduloId": "modulo-09",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Contrato de dez anos indexado a índice de preços, com cláusula de \"reequilíbrio de boa-fé\" em caso de mudança regulatória. Avalie a cláusula.",
    "gabarito": null,
    "referencia": "Insuficiente, e num setor com calendário de reforma aberto isso é material. Reequilíbrio de boa-fé sem fórmula, sem prazo, sem gatilho definido e sem direito de saída não aloca risco: apenas define que haverá uma negociação futura, cujo resultado dependerá do poder relativo das partes naquele momento — que tende a ser desfavorável a quem já está travado.<br><br>O que a cláusula precisa distinguir: mudança geral de lei, mudança específica da fonte contratada, perda de benefício por culpa do vendedor, e alteração de interpretação administrativa sem alteração de norma. E o que precisa prever: fórmula de recomposição, prazo para acordo e o que acontece se não houver acordo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[11].enunciado",
      "linha": 1952
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[11].enunciado.texto",
        "linha": 1952,
        "trecho": "Contrato de dez anos indexado a índice de preços, com cláusula de \"reequilíbrio de boa-fé\" em caso de mudança regulatória. Avalie a cláusula."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-04'][2]",
        "linha": null,
        "trecho": "reequilíbrio"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 12 a nenhuma aula (§Ex, Bloco C · Leitura de contrato). O termo «reequilíbrio», que está no exercício, aparece literalmente só na Aula 04, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-ex-07",
    "moduloId": "modulo-09",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma unidade consome doze mil megawatt-hora por ano e contrata exatamente doze mil, planos. Está protegida?",
    "gabarito": null,
    "referencia": "Não necessariamente, e provavelmente não. A cobertura anual não diz nada sobre a distribuição mensal nem horária. Se o consumo varia entre meses, há posição comprada nos meses altos e vendida nos baixos, liquidadas a preços diferentes. Se a carga tem assinatura horária, o mesmo acontece dentro de cada mês, com frequência muito maior.<br><br>Para responder de verdade é preciso sazonalizar, modular e calcular a exposição residual por período. E para isso é preciso série horária. <b>Sem ela, a resposta correta é \"não é possível concluir\"</b> — não \"provavelmente está protegida\".",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[6].enunciado",
      "linha": 1925
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[6].enunciado.texto",
        "linha": 1925,
        "trecho": "Uma unidade consome doze mil megawatt-hora por ano e contrata exatamente doze mil, planos. Está protegida?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-05'][8]",
        "linha": null,
        "trecho": "cobertura anual"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 7 a nenhuma aula (§Ex, Bloco B · Diagnóstico negativo e inconclusivo). O termo «cobertura anual», que está no exercício, aparece literalmente nas Aulas 04, 05, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-ex-09",
    "moduloId": "modulo-09",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "O diretor financeiro pergunta: \"e se a gente ficar cem por cento exposto ao preço de curto prazo e comprar só quando estiver barato?\"",
    "gabarito": null,
    "referencia": "Duas objeções, e a primeira encerra o assunto. <b>Primeira, legal:</b> a lei passou a exigir que o consumidor optante garanta o atendimento da totalidade da carga mediante contratação, sujeito a penalidade pelo descumprimento, com possibilidade de flexibilização por regulamento. Estar deliberadamente descoberto não é estratégia agressiva permitida.<br><br><b>Segunda, econômica:</b> a estratégia embute a premissa de que se consegue identificar o momento barato e contratar nele, o que exige acertar preço futuro — e o preço de curto prazo corrente não é previsão do preço de contrato futuro. Além disso, o cenário em que a exposição total dói mais é justamente aquele em que contratar fica mais caro, o que inverte a ordem pretendida.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[8].enunciado",
      "linha": 1935
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[8].enunciado.texto",
        "linha": 1935,
        "trecho": "O diretor financeiro pergunta: \"e se a gente ficar cem por cento exposto ao preço de curto prazo e comprar só quando estiver barato?\""
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-05'][18]",
        "linha": null,
        "trecho": "totalidade da carga"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 9 a nenhuma aula (§Ex, Bloco B · Diagnóstico negativo e inconclusivo). O termo «totalidade da carga», que está no exercício, aparece literalmente nas Aulas 01, 05, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-a06-d01",
    "moduloId": "modulo-09",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Desde 2021, em que base o preço de liquidação das diferenças é calculado e publicado?",
    "alternativas": [
      "em base mensal",
      "em base horária",
      "por patamar"
    ],
    "gabarito": 1,
    "referencia": "Desde 2021 é calculado e publicado em base horária, para os quatro submercados.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
      "campo": "MODULO_09_CORPO['aula-09-06'][0]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-06'][0]",
        "linha": null,
        "trecho": "Desde 2021 é calculado e publicado em base horária, para os quatro submercados."
      }
    ]
  },
  {
    "id": "m09-a06-d02",
    "moduloId": "modulo-09",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, o que determina a exposição de uma empresa ao preço de curto prazo?",
    "alternativas": [
      "o tamanho da fábrica",
      "o preço do contrato",
      "o desenho contratual"
    ],
    "gabarito": 2,
    "referencia": "O que determina a exposição é o desenho contratual — não o tamanho da fábrica nem o preço do contrato.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
      "campo": "MODULO_09_CORPO['aula-09-06'][2]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-06'][2]",
        "linha": null,
        "trecho": "O que determina a exposição é o desenho contratual — não o tamanho da fábrica nem o preço do contrato."
      }
    ]
  },
  {
    "id": "m09-a06-d03",
    "moduloId": "modulo-09",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que, segundo a aula, usar o preço de curto prazo de hoje para justificar um contrato de cinco anos é um erro — e em que sentido esse erro é simétrico?",
    "gabarito": null,
    "referencia": "Usar o preço de hoje para justificar contrato de cinco anos é erro de horizonte, e ele é simétrico — quem se recusa a contratar porque o preço está alto hoje comete o mesmo erro com o sinal trocado.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
      "campo": "MODULO_09_CORPO['aula-09-06'][8]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-06'][8]",
        "linha": null,
        "trecho": "Usar o preço de hoje para justificar contrato de cinco anos é erro de horizonte, e ele é simétrico — quem se recusa a contratar porque o preço está alto hoje comete o mesmo erro com o sinal trocado."
      }
    ]
  },
  {
    "id": "m09-ex-04",
    "moduloId": "modulo-09",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Explique o mecanismo de realocação para um diretor industrial em quatro frases, sem usar a palavra \"condomínio\".",
    "gabarito": null,
    "referencia": "As hidrelétricas participantes somam a geração de todas e dividem o total entre si na proporção da referência de energia atribuída a cada uma. Isso protege cada usina da má sorte do próprio rio, mas não protege o conjunto de um ano ruim para todos. Quando a geração total fica abaixo da referência do conjunto, cada participante recebe menos do que a própria referência e precisa comprar a diferença no mercado de curto prazo. O custo desse risco aparece no preço dos contratos lastreados em hidrelétrica — inclusive nos que a sua empresa assina.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[3].enunciado",
      "linha": 1909
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[3].enunciado.texto",
        "linha": 1909,
        "trecho": "Explique o mecanismo de realocação para um diretor industrial em quatro frases, sem usar a palavra \"condomínio\"."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-07'][0]",
        "linha": null,
        "trecho": "realocação"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 4 a nenhuma aula (§Ex, Bloco A · Reconstrução estrutural). O termo «realocação», que está no exercício, aparece literalmente só na Aula 07, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-a07-d01",
    "moduloId": "modulo-09",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Que limite a Lei nº 15.269/2025 impôs às revisões ordinárias de garantia física das usinas participantes do mecanismo?",
    "alternativas": [
      "cinquenta por cento",
      "cinco por cento por revisão, e dez por cento no total acumulado ao longo da vigência da outorga",
      "limitada a sete anos"
    ],
    "gabarito": 1,
    "referencia": "cinco por cento por revisão, e dez por cento no total acumulado ao longo da vigência da outorga",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
      "campo": "MODULO_09_CORPO['aula-09-07'][9]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-07'][9]",
        "linha": null,
        "trecho": "cinco por cento por revisão, e dez por cento no total acumulado ao longo da vigência da outorga"
      }
    ]
  },
  {
    "id": "m09-a07-d02",
    "moduloId": "modulo-09",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, o que acontece quando o fator de ajuste fica abaixo de um — e quando fica acima?",
    "gabarito": null,
    "referencia": "Se ele fica abaixo de um, a alocação de cada participante é proporcionalmente menor que a referência, e quem tiver posição contratual acima da energia alocada precisa comprar a diferença no mercado de curto prazo. Se fica acima de um, há energia secundária a ser distribuída conforme as regras.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
      "campo": "MODULO_09_CORPO['aula-09-07'][1]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-07'][1]",
        "linha": null,
        "trecho": "Se ele fica abaixo de um, a alocação de cada participante é proporcionalmente menor que a referência, e quem tiver posição contratual acima da energia alocada precisa comprar a diferença no mercado de curto prazo. Se fica acima de um, há energia secundária a ser distribuída conforme as regras."
      }
    ]
  },
  {
    "id": "m09-ex-03",
    "moduloId": "modulo-09",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Reconstrua, de memória, as cinco condições que a lei impõe antes da abertura da baixa tensão.",
    "gabarito": null,
    "referencia": "Plano de comunicação para conscientização dos consumidores; definição das tarifas aplicáveis a cada ambiente com segregação dos custos da distribuidora; regulamentação do suprimento de última instância, incluindo responsável, beneficiários, hipóteses obrigatórias, prazo máximo, eventual uso de energia de reserva, eventual dispensa de lastro e alocação de custos; elaboração de produto padrão com preço de referência para comparação de ofertas; e regulamentação do encargo de sobrecontratação ou exposição involuntária das distribuidoras.<br><br><b>Por que isso é o exercício mais importante do bloco:</b> quem sabe as cinco condições responde corretamente à pergunta \"quando abre?\" com \"depende do estado de cinco requisitos, e aqui está o estado de cada um\" — que é uma resposta de analista. Quem só sabe a data responde com a data, que é uma resposta de folheto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[2].enunciado",
      "linha": 1904
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[2].enunciado.texto",
        "linha": 1904,
        "trecho": "Reconstrua, de memória, as cinco condições que a lei impõe antes da abertura da baixa tensão."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-08'][14]",
        "linha": null,
        "trecho": "produto padrão"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 3 a nenhuma aula (§Ex, Bloco A · Reconstrução estrutural). O termo «produto padrão», que está no exercício, aparece literalmente nas Aulas 03, 08, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-ex-05",
    "moduloId": "modulo-09",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma fábrica pretende encerrar a operação da unidade em dezoito meses e recebe proposta de contrato de cinco anos com preço competitivo. Diga por que não deveria migrar agora.",
    "gabarito": null,
    "referencia": "O horizonte operacional é menor que o horizonte contratual, e a assimetria entre entrar e sair torna isso decisivo. Ao término da operação, a empresa continua devendo o contrato: se houver montante mínimo, paga sem consumir; se houver multa calculada sobre valor presente, a saída pode ser economicamente proibitiva; e a sobra contratual é vendida ao preço do momento, sem qualquer garantia de recuperar o valor pago.<br><br>O preço competitivo não é irrelevante — ele é a compensação pelo prazo, e o prazo é exatamente o que a empresa não pode dar. <b>Diagnóstico:</b> não vale nas condições informadas. <b>Alternativa a investigar:</b> estrutura de prazo compatível com o horizonte real, ainda que a preço pior, ou permanência no ambiente regulado até a definição do futuro da unidade.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[4].enunciado",
      "linha": 1915
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[4].enunciado.texto",
        "linha": 1915,
        "trecho": "Uma fábrica pretende encerrar a operação da unidade em dezoito meses e recebe proposta de contrato de cinco anos com preço competitivo. Diga por que não deveria migrar agora."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-08'][2]",
        "linha": null,
        "trecho": "Horizonte operacional"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 5 a nenhuma aula (§Ex, Bloco B · Diagnóstico negativo e inconclusivo). O termo «horizonte operacional», que está no exercício, aparece literalmente só na Aula 08, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-ex-08",
    "moduloId": "modulo-09",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma comercializadora oferece preço oito por cento menor que os concorrentes, mas não apresenta demonstrações, garantidor nem política de risco. Como você trata a proposta?",
    "gabarito": null,
    "referencia": "O desconto precisa ser lido como possível remuneração por risco de crédito, e não como eficiência. A conduta correta é solicitar evidências — entidade contratante e grupo econômico, garantidor e força dele, concentração da carteira, histórico de adimplemento —, impor limite de exposição àquela contraparte, exigir garantia adequada e prever substituição.<br><br>Se as evidências não vierem, o diagnóstico não é \"arriscado, mas atraente\": é <b>não é possível avaliar</b>, e uma contraparte que não se deixa avaliar já respondeu parte da pergunta. Note ainda que o momento em que uma contraparte fraca falha tende a coincidir com o de preço alto — a proteção falha justamente quando valeria mais.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[7].enunciado",
      "linha": 1930
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[7].enunciado.texto",
        "linha": 1930,
        "trecho": "Uma comercializadora oferece preço oito por cento menor que os concorrentes, mas não apresenta demonstrações, garantidor nem política de risco. Como você trata a proposta?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-08'][3]",
        "linha": null,
        "trecho": "risco de crédito"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex. 8 a nenhuma aula (§Ex, Bloco B · Diagnóstico negativo e inconclusivo). O termo «risco de crédito», que está no exercício, aparece literalmente nas Aulas 03, 05, 08, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m09-a08-d01",
    "moduloId": "modulo-09",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na tabela de sinais de cautela, por que um contrato de rede sem janela próxima recomenda adiar a migração?",
    "alternativas": [
      "Montante mínimo, multa e sobra podem superar qualquer ganho, e o risco é assimétrico",
      "A data de migração não é executável, e comprar energia para data impossível cria exposição imediata",
      "Não há como dimensionar estrutura; qualquer contrato assinado é aposta com nome técnico"
    ],
    "gabarito": 1,
    "referencia": "Contrato de rede sem janela próxima — A data de migração não é executável, e comprar energia para data impossível cria exposição imediata",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
      "campo": "MODULO_09_CORPO['aula-09-08'][3]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-08'][3]",
        "linha": null,
        "trecho": "Contrato de rede sem janela próxima — A data de migração não é executável, e comprar energia para data impossível cria exposição imediata"
      }
    ]
  },
  {
    "id": "m09-a08-d02",
    "moduloId": "modulo-09",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, qual é a competência escassa de um analista de migração, e qual é a mais escassa ainda?",
    "gabarito": null,
    "referencia": "A competência escassa é o \"não\" fundamentado, e a competência mais escassa ainda é o \"não é possível concluir com o que foi apresentado\" dito sem constrangimento.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
      "campo": "MODULO_09_CORPO['aula-09-08'][0]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-09-content.ts",
        "campo": "MODULO_09_CORPO['aula-09-08'][0]",
        "linha": null,
        "trecho": "A competência escassa é o \"não\" fundamentado, e a competência mais escassa ainda é o \"não é possível concluir com o que foi apresentado\" dito sem constrangimento."
      }
    ]
  }
];

/** Exercícios da fonte cujo termo não casa com nenhuma aula (regra de colocação de 15/11). */
export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [
  {
    "id": "m09-ex-13",
    "moduloId": "modulo-09",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A proposta declara preço \"tudo incluso\". O que isso significa e como você verifica?",
    "gabarito": null,
    "referencia": "Não significa nada até ser aberto. \"Tudo incluso\" pode cobrir apenas energia; ou energia mais perdas; ou energia, perdas, encargos específicos e serviços de representação. A verificação é linha a linha: o que está dentro, o que está fora, qual é a base de cálculo de cada item, e como a fatura será apresentada.<br><br>O custo comparável no ambiente livre soma contrato, uso da rede, encargos, tributos, perdas, custos de câmara e representação, garantias, exposição residual e gestão interna. O custo cativo comparável usa tarifa vigente e cenário de bandeira, não média desatualizada. Só depois de as duas somas estarem completas existe comparação — e o que se compara são estruturas, não números soltos.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "exercicios.itens[12].enunciado",
      "linha": 1957
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
        "campo": "exercicios.itens[12].enunciado.texto",
        "linha": 1957,
        "trecho": "A proposta declara preço \"tudo incluso\". O que isso significa e como você verifica?"
      }
    ],
    "alertas": [
      "A fonte não liga o Ex. 13 a nenhuma aula (§Ex, Bloco C · Leitura de contrato), e o termo «tudo incluso» não aparece em nenhuma aula: fica nos exercícios do módulo (regra de colocação de 15/11)."
    ]
  }
];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-09",
    "criterio": "Oito acertos em dez é o critério.",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m09-quiz-q01",
        "enunciado": "Uma indústria migra para o ambiente livre. Quantos componentes do custo trocam efetivamente de fornecedor?",
        "alternativas": [
          "Todos, exceto os tributos",
          "A energia e o uso do fio",
          "Apenas a energia",
          "A energia, os encargos e a bandeira"
        ],
        "correta": 2,
        "explicacao": "Só a energia troca de fornecedor. O uso da rede permanece devido à distribuidora sob tarifa regulada; encargos permanecem com base recomposta; a bandeira deixa de incidir sobre a energia contratada, mas isso é troca de mecanismo, não economia.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "avaliacao.perguntas[0]",
          "linha": 3364
        }
      },
      {
        "id": "m09-quiz-q02",
        "enunciado": "O cronograma legal da baixa tensão estabelecido em 2025 deve ser comunicado a um cliente como:",
        "alternativas": [
          "Prazo previsto em lei, condicionado ao cumprimento de cinco requisitos prévios",
          "Data certa de abertura, já definida em lei",
          "Estimativa de mercado sem base normativa",
          "Prazo já regulamentado pela agência"
        ],
        "correta": 0,
        "explicacao": "A lei fixa tetos de vinte e quatro e trinta e seis meses e condiciona a redução dos limites ao cumprimento prévio de cinco requisitos, entre eles a regulamentação do suprimento de última instância e a criação do produto padrão. A regulamentação da agência está prevista na agenda para 2027.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "avaliacao.perguntas[1]",
          "linha": 3367
        }
      },
      {
        "id": "m09-quiz-q03",
        "enunciado": "Uma unidade consome doze mil megawatt-hora por ano e contrata exatamente doze mil, em volume plano. A afirmação correta é:",
        "alternativas": [
          "Está integralmente protegida, pois o volume anual coincide",
          "Está protegida se o contrato for de longo prazo",
          "Está protegida desde que o preço seja fixo",
          "Permanece exposta à variação mensal e horária da carga"
        ],
        "correta": 3,
        "explicacao": "Cobertura anual não é cobertura. Sem sazonalização e modulação adequadas, há posição comprada nos períodos de alta e vendida nos de baixa, liquidadas a preços diferentes. O prazo e a indexação tratam preço, não perfil.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "avaliacao.perguntas[2]",
          "linha": 3370
        }
      },
      {
        "id": "m09-quiz-q04",
        "enunciado": "Sobre os efeitos financeiros de sobrecontratação das distribuidoras decorrentes da migração de consumidores, a lei de 2025 determina que sejam:",
        "alternativas": [
          "Suportados integralmente pelas distribuidoras",
          "Rateados entre consumidores dos ambientes regulado e livre",
          "Suportados apenas pelos consumidores cativos",
          "Cobertos pela conta de desenvolvimento energético"
        ],
        "correta": 1,
        "explicacao": "O dispositivo determina rateio entre consumidores dos dois ambientes, mediante encargo tarifário na proporção do consumo. Migrar não é sair do arranjo de custos legados do próprio movimento de abertura.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "avaliacao.perguntas[3]",
          "linha": 3373
        }
      },
      {
        "id": "m09-quiz-q05",
        "enunciado": "A diferença central entre as duas modalidades do contrato regulado é:",
        "alternativas": [
          "O prazo de suprimento",
          "A fonte de geração contratada",
          "O índice de reajuste aplicável",
          "Quem assume o risco de produção e de combustível"
        ],
        "correta": 3,
        "explicacao": "Na modalidade por quantidade o vendedor assume, em maior medida, o risco de produzir ou adquirir energia. Na modalidade por disponibilidade ele recebe receita fixa por prontidão, e o custo variável de despacho é tratado conforme contrato e regras, chegando à tarifa. A modalidade não se infere pela tecnologia.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "avaliacao.perguntas[4]",
          "linha": 3376
        }
      },
      {
        "id": "m09-quiz-q06",
        "enunciado": "A afirmação \"a judicialização do fator de ajuste ainda trava as liquidações\" é, em agosto de 2026:",
        "alternativas": [
          "Verdadeira, e o passivo segue crescendo",
          "Verdadeira apenas para as usinas não despachadas centralizadamente",
          "Falsa: a última liminar foi revogada em dezembro de 2025",
          "Impossível de verificar em fonte pública"
        ],
        "correta": 2,
        "explicacao": "A última liminar relacionada à judicialização do risco hidrológico no mercado de curto prazo foi revogada em 18 de dezembro de 2025, depois de o mecanismo concorrencial ter reduzido o montante represado em 72%. O risco hidrológico permanece; o bloqueio judicial das liquidações, não.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "avaliacao.perguntas[5]",
          "linha": 3379
        }
      },
      {
        "id": "m09-quiz-q07",
        "enunciado": "Um consumidor pergunta quanto vai economizar migrando. A resposta tecnicamente correta é:",
        "alternativas": [
          "Uma pergunta de volta sobre curva horária, horizonte, estrutura pretendida e tolerância a risco",
          "Um percentual aproximado, ajustado depois",
          "A diferença entre o preço ofertado e a tarifa atual",
          "Uma faixa baseada em casos comparáveis do mesmo setor"
        ],
        "correta": 0,
        "explicacao": "Sem os quatro insumos a pergunta não é respondível, e um percentual sem eles não é aproximação — é um número inventado que vai ancorar todas as decisões seguintes. Faixas de casos comparáveis embutem perfis de carga e estruturas contratuais que não são os do cliente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "avaliacao.perguntas[6]",
          "linha": 3382
        }
      },
      {
        "id": "m09-quiz-q08",
        "enunciado": "O teto estrutural do preço de curto prazo tem por função:",
        "alternativas": [
          "Limitar o preço de uma hora específica",
          "Limitar a persistência de preços elevados ao longo do dia",
          "Definir o piso das tarifas reguladas",
          "Fixar o preço de referência dos contratos de longo prazo"
        ],
        "correta": 1,
        "explicacao": "O teto horário limita o pior instante; o estrutural limita a persistência. Quando a média diária dos preços horários supera o teto estrutural, a série do dia é ajustada de forma uniforme e proporcional, respeitado o piso e independentemente por submercado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "avaliacao.perguntas[7]",
          "linha": 3385
        }
      },
      {
        "id": "m09-quiz-q09",
        "enunciado": "Sobre a autoprodução por equiparação após a lei de 2025, a formulação correta é:",
        "alternativas": [
          "Exige apenas participação de trinta por cento no capital social da usina",
          "Foi extinta como modalidade",
          "Exige demanda agregada mínima, demanda individual por unidade e participação com direito a voto",
          "Passou a ser permitida apenas para empreendimentos novos"
        ],
        "correta": 2,
        "explicacao": "A regra geral é demanda contratada agregada de no mínimo trinta mil quilowatts, composta por unidades de no mínimo três mil quilowatts cada, com participação societária proporcional e com direito a voto — e o aproveitamento é limitado ao menor entre consumo próprio e participação. O piso de trinta por cento do capital só se aplica na hipótese específica de ações sem direito a voto com direitos econômicos superiores. O dispositivo que restringiria a empreendimentos novos foi vetado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "avaliacao.perguntas[8]",
          "linha": 3388
        }
      },
      {
        "id": "m09-quiz-q10",
        "enunciado": "Um roteador de decisão sobre migração que nunca consegue devolver \"não é possível concluir\" apresenta qual problema?",
        "alternativas": [
          "Nenhum, se o modelo for bem calibrado",
          "Um problema de desempenho computacional",
          "Um problema apenas de interface",
          "Um defeito: a saída mais frequente na prática é inalcançável, o que transforma diagnóstico em peça de venda"
        ],
        "correta": 3,
        "explicacao": "Com informação incompleta não se conclui nem a favor nem contra. Um instrumento incapaz de devolver a saída inconclusiva força uma conclusão que os dados não sustentam — e veredito inalcançável é, além disso, código morto.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "avaliacao.perguntas[9]",
          "linha": 3391
        }
      }
    ],
    "faixas": [
      {
        "min": 8,
        "max": 10,
        "mensagem": "Critério atendido. O bloco está fechado do lado do reconhecimento — falta o lado da produção: reconstrua os dois ambientes de memória, produza um \"não vale\" fundamentado e responda \"quanto eu economizo?\" com a pergunta de volta."
      },
      {
        "min": 0,
        "max": 7,
        "mensagem": "Critério é 8 de 10. Releia o retorno de cada erro antes de refazer: o diagnóstico do erro vale mais que a nota."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "avaliacao.faixas_de_placar_script",
      "linha": 3425
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
      "campo": "avaliacao.introducao",
      "linha": 1975
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-09",
    "introducao": "O primeiro item é reconstrução de memória. O último é a capacidade de dizer, sem constrangimento, que a pergunta não é respondível com o que foi apresentado. Se algum item ficar em branco, a aula correspondente está indicada na estrutura do módulo.",
    "itens": [
      {
        "id": "m09-final-01",
        "texto": "Reconstruo de memória os dois ambientes, com os três fluxos separados — energia física, contrato e dinheiro — e coloco cada seta no lugar certo",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[0]",
          "linha": 2106
        }
      },
      {
        "id": "m09-final-02",
        "texto": "Explico por que a mesma usina e a mesma rede atendem consumidores dos dois ambientes sem que existam elétrons livres e cativos",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[1]",
          "linha": 2107
        }
      },
      {
        "id": "m09-final-03",
        "texto": "Nomeio, componente a componente, o que troca de fornecedor, o que muda de mecanismo, o que permanece devido e o que passa a existir",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[2]",
          "linha": 2108
        }
      },
      {
        "id": "m09-final-04",
        "texto": "Digo quantos pagamentos faz um consumidor cativo e quantos faz um consumidor livre, e a quem",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[3]",
          "linha": 2109
        }
      },
      {
        "id": "m09-final-05",
        "texto": "Explico por que comparar preço de contrato com valor de fatura é comparar uma parte com o todo",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[4]",
          "linha": 2110
        }
      },
      {
        "id": "m09-final-06",
        "texto": "Distingo as famílias de produto de leilão por função, não por sigla, e digo qual problema cada uma resolve",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[5]",
          "linha": 2111
        }
      },
      {
        "id": "m09-final-07",
        "texto": "Explico a diferença entre as duas modalidades do contrato regulado e digo quem carrega produção, combustível e despacho em cada uma",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[6]",
          "linha": 2112
        }
      },
      {
        "id": "m09-final-08",
        "texto": "Descrevo como uma distribuidora forma e ajusta a carteira diante de previsão, migração, sobra, déficit e cotas",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[7]",
          "linha": 2113
        }
      },
      {
        "id": "m09-final-09",
        "texto": "Explico por que a regra decorada dos cento e cinco por cento é insuficiente e o que consultar no lugar dela",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[8]",
          "linha": 2114
        }
      },
      {
        "id": "m09-final-10",
        "texto": "Explico modicidade tarifária como restrição de custo sustentável, não como menor preço instantâneo",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[9]",
          "linha": 2115
        }
      },
      {
        "id": "m09-final-11",
        "texto": "Trato a bandeira como mecanismo de repasse de risco no ambiente regulado, e não como composição de fatura",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[10]",
          "linha": 2116
        }
      },
      {
        "id": "m09-final-12",
        "texto": "Distingo bandeira de preço de curto prazo em três dimensões: periodicidade, abrangência e metodologia",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[11]",
          "linha": 2117
        }
      },
      {
        "id": "m09-final-13",
        "texto": "Digo quem é elegível hoje, sob qual norma, e por que os limites históricos de carga não são mais o teste geral",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[12]",
          "linha": 2118
        }
      },
      {
        "id": "m09-final-14",
        "texto": "Enuncio os dois prazos do cronograma da baixa tensão e os cinco requisitos legais que o condicionam",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[13]",
          "linha": 2119
        }
      },
      {
        "id": "m09-final-15",
        "texto": "Uso a expressão \"prazo previsto em lei\" e nunca afirmo que numa data futura a migração estará disponível",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[14]",
          "linha": 2120
        }
      },
      {
        "id": "m09-final-16",
        "texto": "Descrevo o rito de migração em dez etapas e identifico qual delas é inegociável",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[15]",
          "linha": 2121
        }
      },
      {
        "id": "m09-final-17",
        "texto": "Explico o papel do comercializador varejista e por que representação não transfere risco econômico",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[16]",
          "linha": 2122
        }
      },
      {
        "id": "m09-final-18",
        "texto": "Descrevo o supridor de última instância e digo quem arca com o déficit involuntário dele",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[17]",
          "linha": 2123
        }
      },
      {
        "id": "m09-final-19",
        "texto": "Enuncio os critérios da autoprodução por equiparação sem repetir a versão simplificada dos trinta por cento",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[18]",
          "linha": 2124
        }
      },
      {
        "id": "m09-final-20",
        "texto": "Leio um contrato pelas onze cláusulas e identifico onde cada risco foi alocado",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[19]",
          "linha": 2125
        }
      },
      {
        "id": "m09-final-21",
        "texto": "Distingo sazonalização, modulação e flexibilidade, e digo o que cada uma cobre e o que deixa descoberto",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[20]",
          "linha": 2126
        }
      },
      {
        "id": "m09-final-22",
        "texto": "Avalio uma banda de flexibilidade pela simetria dos dois lados, não pela largura",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[21]",
          "linha": 2127
        }
      },
      {
        "id": "m09-final-23",
        "texto": "Percorro as sete classes de risco dizendo quem carrega, o que dispara e o que mitiga em cada estrutura",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[22]",
          "linha": 2128
        }
      },
      {
        "id": "m09-final-24",
        "texto": "Explico o preço de curto prazo como valorador de diferença, com piso e teto anuais e teto em duas camadas",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[23]",
          "linha": 2129
        }
      },
      {
        "id": "m09-final-25",
        "texto": "Explico o mecanismo de realocação e o fator de ajuste, e digo por que uma indústria que não gera precisa entender isso",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[24]",
          "linha": 2130
        }
      },
      {
        "id": "m09-final-26",
        "texto": "Digo em que sentido a frase \"a judicialização ainda dura\" é falsa, verdadeira e parcialmente verdadeira, declarando o recorte",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[25]",
          "linha": 2131
        }
      },
      {
        "id": "m09-final-27",
        "texto": "Conecto janeiro de 2024 ao mercado endereçável usando fato, dimensionamento datado e interpretação — sem superlativo",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[26]",
          "linha": 2132
        }
      },
      {
        "id": "m09-final-28",
        "texto": "Produzo um \"não vale nas condições informadas\" com a mesma fluência de um \"vale investigar\", e digo \"não é possível concluir com o que você me deu\" sem constrangimento",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m09/aparato.json",
          "campo": "checklist_final.itens[27]",
          "linha": 2133
        }
      }
    ]
  }
];
