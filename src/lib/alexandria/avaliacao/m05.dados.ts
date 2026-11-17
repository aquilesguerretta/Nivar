// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m05.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m05/aparato.json (exercícios, quiz, checklist) e a apostila
// do módulo (MODULO_05_CORPO, conferida contra o HTML original). Conferência:
// node tools/alexandria-dados/avaliacao/verificar-avaliacao-m05.mjs
// 22 itens por aula (10 da fonte, 12 derivados) · 0 sem aula · 10 questões na prova · 21 itens no checklist.
// Os 10 da fonte não têm aula declarada na fonte: o vínculo é do porte (ver `alertas` de cada um).
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m05-ex-01",
    "moduloId": "modulo-05",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma cidade com 200 mil consumidores avalia autorizar cinco distribuidoras, cada uma com postes, cabos e subestações próprios. Nomeie a falha econômica e diga por que o problema não se resolve com a concorrência entre as cinco.",
    "gabarito": null,
    "referencia": "Monopólio natural por economias de escala e de densidade. O custo fixo de uma rede completa é replicado cinco vezes para atender o mesmo mercado, então o custo médio por consumidor sobe substancialmente — a concorrência não reduz custo aqui, ela o multiplica. A resposta eficiente é uma rede regulada com acesso não discriminatório, adjudicada por competição <em>pelo</em> mercado, não competição <em>no</em> mercado.<br><br>Detalhe que separa a boa resposta da resposta decorada: a duplicação também consome bem público não replicável — espaço no subsolo e na via, licença ambiental, servidão. Não é só capital desperdiçado; é capital desperdiçado consumindo um recurso escasso que não pertence a nenhuma das cinco.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
      "campo": "exercicios.itens[0].enunciado.html",
      "linha": 1069
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[0].enunciado.texto",
        "linha": 1069,
        "trecho": "Uma cidade com 200 mil consumidores avalia autorizar cinco distribuidoras, cada uma com postes, cabos e subestações próprios. Nomeie a falha econômica e diga por que o problema não se resolve com a concorrência entre as cinco."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[0].resposta_referencia[0].texto",
        "linha": 1069,
        "trecho": "Monopólio natural por economias de escala e de densidade. O custo fixo de uma rede completa é replicado cinco vezes para atender o mesmo mercado, então o custo médio por consumidor sobe substancialmente — a concorrência não reduz custo aqui, ela o multiplica. A resposta eficiente é uma rede regulada com acesso não discriminatório, adjudicada por competição pelo mercado, não competição no mercado."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[0].resposta_referencia[1].texto",
        "linha": 1069,
        "trecho": "Detalhe que separa a boa resposta da resposta decorada: a duplicação também consome bem público não replicável — espaço no subsolo e na via, licença ambiental, servidão. Não é só capital desperdiçado; é capital desperdiçado consumindo um recurso escasso que não pertence a nenhuma das cinco."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"Existe monopólio natural quando\" aparece só na Aula 1.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m05-a01-d01",
    "moduloId": "modulo-05",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na expressão \"monopólio natural\", o que a palavra \"natural\" significa, segundo a aula?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
      "campo": "MODULO_05_CORPO['aula-05-01']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
        "campo": "MODULO_05_CORPO['aula-05-01']",
        "linha": null,
        "trecho": "significa apenas que a tecnologia e a estrutura de custos empurram para um único operador, independentemente do que se ache disso."
      }
    ],
    "alternativas": [
      "bom, justo, necessário ou desejável",
      "que a tecnologia e a estrutura de custos empurram para um único operador",
      "propriedade estatal"
    ],
    "gabarito": 1,
    "referencia": "significa apenas que a tecnologia e a estrutura de custos empurram para um único operador, independentemente do que se ache disso.",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m05-a01-d02",
    "moduloId": "modulo-05",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Num monopólio de rede, o cliente não pode ameaçar ir embora. O que, segundo a aula, a regulação tenta reconstruir no lugar dessa ameaça?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
      "campo": "MODULO_05_CORPO['aula-05-01']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
        "campo": "MODULO_05_CORPO['aula-05-01']",
        "linha": null,
        "trecho": "Numa atividade competitiva, o cliente disciplina o fornecedor com a ameaça de ir embora. Num monopólio de rede, essa ameaça não existe. A regulação tenta reconstruir artificialmente cada função que a ameaça de saída exercia: pressão sobre custo (benchmark e Fator X), pressão sobre qualidade (indicadores e penalidade), pressão sobre preço (receita regulada) e pressão sobre investimento (obrigação de expansão e teste de prudência)."
      }
    ],
    "gabarito": null,
    "referencia": "Numa atividade competitiva, o cliente disciplina o fornecedor com a ameaça de ir embora. Num monopólio de rede, essa ameaça não existe. A regulação tenta reconstruir artificialmente cada função que a ameaça de saída exercia: pressão sobre custo (benchmark e Fator X), pressão sobre qualidade (indicadores e penalidade), pressão sobre preço (receita regulada) e pressão sobre investimento (obrigação de expansão e teste de prudência).",
    "verificacao": "autoavaliacao"
  },
  {
    "id": "m05-ex-02",
    "moduloId": "modulo-05",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma transmissora conecta a geradora do próprio grupo em 60 dias e conecta rivais em 240 dias, sem justificativa técnica registrada. A tarifa cobrada é idêntica e publicada. Qual conceito se aplica e qual instrumento regulatório endereça isso?",
    "gabarito": null,
    "referencia": "Discriminação vertical por meio de infraestrutura essencial. A tarifa igual não resolve nada, porque a discriminação opera no prazo e na fila, não no preço. Os instrumentos são unbundling em grau suficiente, regra pública de fila, obrigação de acesso não discriminatório e — o item que efetivamente muda o comportamento — publicação do prazo médio de conexão segmentado por vínculo societário do solicitante. Sem esse dado, a regra existe e não é fiscalizável.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
      "campo": "exercicios.itens[1].enunciado.html",
      "linha": 1075
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[1].enunciado.texto",
        "linha": 1075,
        "trecho": "Uma transmissora conecta a geradora do próprio grupo em 60 dias e conecta rivais em 240 dias, sem justificativa técnica registrada. A tarifa cobrada é idêntica e publicada. Qual conceito se aplica e qual instrumento regulatório endereça isso?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[1].resposta_referencia[0].texto",
        "linha": 1075,
        "trecho": "Discriminação vertical por meio de infraestrutura essencial. A tarifa igual não resolve nada, porque a discriminação opera no prazo e na fila, não no preço. Os instrumentos são unbundling em grau suficiente, regra pública de fila, obrigação de acesso não discriminatório e — o item que efetivamente muda o comportamento — publicação do prazo médio de conexão segmentado por vínculo societário do solicitante. Sem esse dado, a regra existe e não é fiscalizável."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"Pode colocar o pedido de conexão do concorrente no fim da fila\" aparece só na Aula 2.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m05-a02-d01",
    "moduloId": "modulo-05",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na arquitetura que resultou do unbundling brasileiro, quem registra contratos, mede, contabiliza e liquida?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
      "campo": "MODULO_05_CORPO['aula-05-02']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
        "campo": "MODULO_05_CORPO['aula-05-02']",
        "linha": null,
        "trecho": "a câmara de comercialização registra contratos, mede, contabiliza e liquida"
      }
    ],
    "alternativas": [
      "a agência reguladora",
      "o operador nacional",
      "a câmara de comercialização"
    ],
    "gabarito": 2,
    "referencia": "a câmara de comercialização registra contratos, mede, contabiliza e liquida",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m05-a02-d02",
    "moduloId": "modulo-05",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que, segundo a aula, a resposta regulatória à integração vertical não é apenas proibir a conduta?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
      "campo": "MODULO_05_CORPO['aula-05-02']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
        "campo": "MODULO_05_CORPO['aula-05-02']",
        "linha": null,
        "trecho": "Repare que nenhuma dessas condutas exige violar a tarifa publicada. Elas operam nas margens do processo, na fila, no prazo, no dado e na alocação contábil — precisamente onde é difícil provar intenção. É por isso que a resposta regulatória não é apenas proibir a conduta, e sim remover a estrutura que torna a conduta lucrativa."
      }
    ],
    "gabarito": null,
    "referencia": "Repare que nenhuma dessas condutas exige violar a tarifa publicada. Elas operam nas margens do processo, na fila, no prazo, no dado e na alocação contábil — precisamente onde é difícil provar intenção. É por isso que a resposta regulatória não é apenas proibir a conduta, e sim remover a estrutura que torna a conduta lucrativa.",
    "verificacao": "autoavaliacao"
  },
  {
    "id": "m05-ex-03",
    "moduloId": "modulo-05",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma fábrica no Sudeste compra 10 MW médios de uma eólica no Nordeste. No mês seguinte, o operador despacha térmicas no Sudeste e restringe geração eólica no Nordeste. O contrato foi descumprido?",
    "gabarito": null,
    "referencia": "Não. O contrato é obrigação econômica sobre volume e preço, não promessa de trajetória física — nada no papel determina por onde o elétron viaja. O despacho atende segurança e otimização sistêmica. Medição e liquidação de diferenças resolvem economicamente o que não coincidiu.<br><br>Onde o exercício fica interessante: a resposta completa precisa mencionar que <em>existe</em> um risco real ali, só que outro. Restrição de geração e diferença de preço entre submercados são riscos contratuais concretos, e a pergunta certa é qual cláusula do contrato aloca cada um — assunto do Módulo 04, não invalidação do princípio desta aula.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
      "campo": "exercicios.itens[2].enunciado.html",
      "linha": 1080
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[2].enunciado.texto",
        "linha": 1080,
        "trecho": "Uma fábrica no Sudeste compra 10 MW médios de uma eólica no Nordeste. No mês seguinte, o operador despacha térmicas no Sudeste e restringe geração eólica no Nordeste. O contrato foi descumprido?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[2].resposta_referencia[0].texto",
        "linha": 1080,
        "trecho": "Não. O contrato é obrigação econômica sobre volume e preço, não promessa de trajetória física — nada no papel determina por onde o elétron viaja. O despacho atende segurança e otimização sistêmica. Medição e liquidação de diferenças resolvem economicamente o que não coincidiu."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[2].resposta_referencia[1].texto",
        "linha": 1080,
        "trecho": "Onde o exercício fica interessante: a resposta completa precisa mencionar que existe um risco real ali, só que outro. Restrição de geração e diferença de preço entre submercados são riscos contratuais concretos, e a pergunta certa é qual cláusula do contrato aloca cada um — assunto do Módulo 04, não invalidação do princípio desta aula."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"o contrato não foi descumprido\" aparece só na Aula 3.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m05-ex-08",
    "moduloId": "modulo-05",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um investidor pergunta por que o Brasil não substitui a otimização central por um mercado em que geradores ofertem preço a cada meia hora. Responda em até quatro frases, sem citar nenhum outro país.",
    "gabarito": null,
    "referencia": "Porque o custo de gerar de uma hidrelétrica com reservatório hoje não é um custo de hoje: é o valor de oportunidade da água que deixará de existir amanhã. Esse valor depende de afluência futura, do estado de todos os outros reservatórios e do risco de escassez do sistema inteiro — informação que nenhum gerador individual tem nem tem incentivo para internalizar. Num parque predominantemente térmico, o custo de gerar é o combustível de hoje e a oferta revela bem esse custo; num parque com armazenamento plurianual, não revela. O despacho por custo é consequência da fisiografia do sistema, não uma preferência sobre o papel do Estado.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
      "campo": "exercicios.itens[7].enunciado.html",
      "linha": 1109
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[7].enunciado.texto",
        "linha": 1109,
        "trecho": "Um investidor pergunta por que o Brasil não substitui a otimização central por um mercado em que geradores ofertem preço a cada meia hora. Responda em até quatro frases, sem citar nenhum outro país."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[7].resposta_referencia[0].texto",
        "linha": 1109,
        "trecho": "Porque o custo de gerar de uma hidrelétrica com reservatório hoje não é um custo de hoje: é o valor de oportunidade da água que deixará de existir amanhã. Esse valor depende de afluência futura, do estado de todos os outros reservatórios e do risco de escassez do sistema inteiro — informação que nenhum gerador individual tem nem tem incentivo para internalizar. Num parque predominantemente térmico, o custo de gerar é o combustível de hoje e a oferta revela bem esse custo; num parque com armazenamento plurianual, não revela. O despacho por custo é consequência da fisiografia do sistema, não uma preferência sobre o papel do Estado."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"Um gerador individual, otimizando o próprio lucro, não internaliza o valor sistêmico de guardar água\" aparece só na Aula 3.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m05-a03-d01",
    "moduloId": "modulo-05",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na frase que a Aula 03 manda carregar, o operador coordena elétrons. E o contrato coordena…",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
      "campo": "MODULO_05_CORPO['aula-05-03']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
        "campo": "MODULO_05_CORPO['aula-05-03']",
        "linha": null,
        "trecho": "o contrato coordena dinheiro e risco"
      }
    ],
    "alternativas": [
      "o fluxo físico",
      "dinheiro e risco",
      "elétrons"
    ],
    "gabarito": 1,
    "referencia": "o contrato coordena dinheiro e risco",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m05-a03-d02",
    "moduloId": "modulo-05",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Que patologias, segundo a aula, tem um mercado exclusivamente bilateral?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
      "campo": "MODULO_05_CORPO['aula-05-03']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
        "campo": "MODULO_05_CORPO['aula-05-03']",
        "linha": null,
        "trecho": "Um mercado exclusivamente bilateral, porém, tem patologias conhecidas. A informação de preço fica dispersa em contratos privados, o que enfraquece a formação de uma referência pública confiável. A liquidez é baixa e o custo de busca é alto. Agentes pequenos negociam em desvantagem estrutural contra contrapartes que veem o mercado inteiro. E o operador do sistema, sem um mecanismo central de revelação de custo, tem menos informação para despachar economicamente."
      }
    ],
    "gabarito": null,
    "referencia": "Um mercado exclusivamente bilateral, porém, tem patologias conhecidas. A informação de preço fica dispersa em contratos privados, o que enfraquece a formação de uma referência pública confiável. A liquidez é baixa e o custo de busca é alto. Agentes pequenos negociam em desvantagem estrutural contra contrapartes que veem o mercado inteiro. E o operador do sistema, sem um mecanismo central de revelação de custo, tem menos informação para despachar economicamente.",
    "verificacao": "autoavaliacao"
  },
  {
    "id": "m05-ex-05",
    "moduloId": "modulo-05",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A agência aprova um retorno maior após alta de juros, publica a metodologia com antecedência, disponibiliza os dados de entrada, responde às contribuições contrárias e aplica a mesma regra a todas as distribuidoras do ciclo. Associações de consumidores denunciam captura. Quem tem razão?",
    "gabarito": null,
    "referencia": "Com essa descrição, não há evidência de captura. Anterioridade metodológica, dado público, resposta motivada e simetria de tratamento são justamente as quatro condições que caracterizam decisão técnica. Resultado desfavorável ao consumidor não é sinônimo de desvio.<br><br>A resposta madura acrescenta o que ainda faltaria verificar: a metodologia publicada é reproduzível por terceiro a partir dos dados divulgados? Se sim, o caso está encerrado. Se a memória de cálculo não permite reconstruir o número, o processo é transparente na forma e opaco no efeito — e é aí, e só aí, que o argumento das associações ganha tração.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
      "campo": "exercicios.itens[4].enunciado.html",
      "linha": 1091
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[4].enunciado.texto",
        "linha": 1091,
        "trecho": "A agência aprova um retorno maior após alta de juros, publica a metodologia com antecedência, disponibiliza os dados de entrada, responde às contribuições contrárias e aplica a mesma regra a todas as distribuidoras do ciclo. Associações de consumidores denunciam captura. Quem tem razão?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[4].resposta_referencia[0].texto",
        "linha": 1091,
        "trecho": "Com essa descrição, não há evidência de captura. Anterioridade metodológica, dado público, resposta motivada e simetria de tratamento são justamente as quatro condições que caracterizam decisão técnica. Resultado desfavorável ao consumidor não é sinônimo de desvio."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[4].resposta_referencia[1].texto",
        "linha": 1091,
        "trecho": "A resposta madura acrescenta o que ainda faltaria verificar: a metodologia publicada é reproduzível por terceiro a partir dos dados divulgados? Se sim, o caso está encerrado. Se a memória de cálculo não permite reconstruir o número, o processo é transparente na forma e opaco no efeito — e é aí, e só aí, que o argumento das associações ganha tração."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"Uma decisão favorável à concessionária não prova captura\" aparece só na Aula 4.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m05-ex-09",
    "moduloId": "modulo-05",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Num processo decisório, você identifica: metodologia divulgada depois da decisão, dados de entrada não disponibilizados, contribuições registradas sem resposta, e materialidade de R$ 400 milhões por ano. Qual conclusão você publica?",
    "gabarito": null,
    "referencia": "Que a decisão <strong>não é reproduzível por terceiro</strong> e que a materialidade é alta — e nada além disso. Não se publica acusação de captura, porque captura é padrão institucional inferido ao longo do tempo, e não diagnóstico de um ato isolado. O que se publica é a lacuna verificável, o pedido formal dos dados e o compromisso de refazer a conta quando eles vierem.<br><br>Esta é a disciplina que separa análise independente de ativismo. Ativismo publica a conclusão que quer; análise publica o que consegue reproduzir e diz explicitamente o que não conseguiu — o que, feito de forma consistente, é mais devastador e infinitamente mais defensável.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
      "campo": "exercicios.itens[8].enunciado.html",
      "linha": 1114
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[8].enunciado.texto",
        "linha": 1114,
        "trecho": "Num processo decisório, você identifica: metodologia divulgada depois da decisão, dados de entrada não disponibilizados, contribuições registradas sem resposta, e materialidade de R$ 400 milhões por ano. Qual conclusão você publica?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[8].resposta_referencia[0].texto",
        "linha": 1114,
        "trecho": "Que a decisão não é reproduzível por terceiro e que a materialidade é alta — e nada além disso. Não se publica acusação de captura, porque captura é padrão institucional inferido ao longo do tempo, e não diagnóstico de um ato isolado. O que se publica é a lacuna verificável, o pedido formal dos dados e o compromisso de refazer a conta quando eles vierem."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[8].resposta_referencia[1].texto",
        "linha": 1114,
        "trecho": "Esta é a disciplina que separa análise independente de ativismo. Ativismo publica a conclusão que quer; análise publica o que consegue reproduzir e diz explicitamente o que não conseguiu — o que, feito de forma consistente, é mais devastador e infinitamente mais defensável."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"O teste de sete perguntas\" aparece só na Aula 4.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m05-a04-d01",
    "moduloId": "modulo-05",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na definição de captura regulatória da aula, por que a palavra \"persistente\"?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
      "campo": "MODULO_05_CORPO['aula-05-04']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
        "campo": "MODULO_05_CORPO['aula-05-04']",
        "linha": null,
        "trecho": "Persistente, porque um resultado isolado favorável ao regulado não é captura; é apenas um resultado."
      }
    ],
    "alternativas": [
      "porque o mecanismo depende de capacidade de ação coletiva",
      "porque um resultado isolado favorável ao regulado não é captura",
      "porque a referência é a metodologia declarada e o mandato legal"
    ],
    "gabarito": 1,
    "referencia": "Persistente, porque um resultado isolado favorável ao regulado não é captura; é apenas um resultado.",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m05-a04-d02",
    "moduloId": "modulo-05",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "No teste de sete perguntas, em quais perguntas a falha costuma se concentrar, e o que cada uma delas indica?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
      "campo": "MODULO_05_CORPO['aula-05-04']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
        "campo": "MODULO_05_CORPO['aula-05-04']",
        "linha": null,
        "trecho": "A falha se concentra tipicamente nas perguntas 1, 2 e 7 — método construído depois, dado indisponível, resultado irreproduzível. Essas três são as que valem a pena investigar primeiro."
      }
    ],
    "gabarito": null,
    "referencia": "A falha se concentra tipicamente nas perguntas 1, 2 e 7 — método construído depois, dado indisponível, resultado irreproduzível. Essas três são as que valem a pena investigar primeiro.",
    "verificacao": "autoavaliacao"
  },
  {
    "id": "m05-ex-04",
    "moduloId": "modulo-05",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A base de remuneração líquida de uma distribuidora é de R$ 6 bilhões. O custo de capital regulatório passa de 7,2% para 8,0%, tudo o mais constante. Qual o efeito anual aproximado sobre a remuneração do capital, e isso é evidência de captura?",
    "gabarito": null,
    "referencia": "Variação de 0,8 ponto percentual = 0,008. Efeito ≈ 6.000 × 0,008 = <strong>R$ 48 milhões por ano</strong>, antes de qualquer outro efeito. E não, não é evidência de nada: o custo de capital de mercado pode ter subido, e o parâmetro deve seguir o mercado. A avaliação exige comparar período de dados, estrutura de capital de referência, prêmios de risco, consistência de convenção real ou nominal, e verificar se a mesma metodologia foi aplicada às concessionárias comparáveis no mesmo ciclo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
      "campo": "exercicios.itens[3].enunciado.html",
      "linha": 1086
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[3].enunciado.texto",
        "linha": 1086,
        "trecho": "A base de remuneração líquida de uma distribuidora é de R$ 6 bilhões. O custo de capital regulatório passa de 7,2% para 8,0%, tudo o mais constante. Qual o efeito anual aproximado sobre a remuneração do capital, e isso é evidência de captura?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[3].resposta_referencia[0].texto",
        "linha": 1086,
        "trecho": "Variação de 0,8 ponto percentual = 0,008. Efeito ≈ 6.000 × 0,008 = R$ 48 milhões por ano, antes de qualquer outro efeito. E não, não é evidência de nada: o custo de capital de mercado pode ter subido, e o parâmetro deve seguir o mercado. A avaliação exige comparar período de dados, estrutura de capital de referência, prêmios de risco, consistência de convenção real ou nominal, e verificar se a mesma metodologia foi aplicada às concessionárias comparáveis no mesmo ciclo."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"WACC regulatório: o parâmetro que move tudo\" aparece só na Aula 5.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m05-ex-06",
    "moduloId": "modulo-05",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A fatura de uma indústria cativa subiu 12% no ano. A Parcela B da distribuidora subiu 2%. Dê três explicações possíveis para o restante e diga qual dado você pediria primeiro.",
    "gabarito": null,
    "referencia": "Três candidatos: aumento do custo de compra de energia repassado pela Parcela A; aumento de encargos setoriais ou de custo de transmissão; e variação tributária ou de componente financeiro. Uma quarta possibilidade, frequentemente esquecida: mudança de estrutura tarifária que realocou custo para o perfil daquela indústria sem alterar a receita total.<br><br>Primeiro dado a pedir: a decomposição da variação por componente na própria fatura, comparada com a nota técnica do reajuste. Sem isso, qualquer atribuição de causa é chute — e chute com número é a forma mais rápida de perder um cliente técnico.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
      "campo": "exercicios.itens[5].enunciado.html",
      "linha": 1097
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[5].enunciado.texto",
        "linha": 1097,
        "trecho": "A fatura de uma indústria cativa subiu 12% no ano. A Parcela B da distribuidora subiu 2%. Dê três explicações possíveis para o restante e diga qual dado você pediria primeiro."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[5].resposta_referencia[0].texto",
        "linha": 1097,
        "trecho": "Três candidatos: aumento do custo de compra de energia repassado pela Parcela A; aumento de encargos setoriais ou de custo de transmissão; e variação tributária ou de componente financeiro. Uma quarta possibilidade, frequentemente esquecida: mudança de estrutura tarifária que realocou custo para o perfil daquela indústria sem alterar a receita total."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[5].resposta_referencia[1].texto",
        "linha": 1097,
        "trecho": "Primeiro dado a pedir: a decomposição da variação por componente na própria fatura, comparada com a nota técnica do reajuste. Sem isso, qualquer atribuição de causa é chute — e chute com número é a forma mais rápida de perder um cliente técnico."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"Um aumento tarifário grande pode ocorrer com a Parcela B praticamente estável\" aparece só na Aula 5.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m05-ex-07",
    "moduloId": "modulo-05",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma planta migrou 100% para o ambiente livre e reduziu o preço contratado de energia. O diretor financeiro conclui que a empresa \"saiu do regulado\" e que revisão tarifária deixou de importar. Onde está o erro?",
    "gabarito": null,
    "referencia": "A planta saiu do mercado <em>de energia</em> regulado; continua integralmente dentro da <em>rede</em> regulada. A tarifa de uso do sistema de distribuição continua sendo paga e é, no essencial, a Parcela B rateada entre usuários. Revisão tarifária, Fator X e custo de capital regulatório seguem afetando o custo total de energia da operação.<br><br>Consequência prática: uma economia anunciada apenas sobre o componente de energia superestima o resultado se, no mesmo período, o componente de rede subiu. A leitura correta compara custo total por MWh consumido, decomposto, antes e depois — e mesmo isso é uma oportunidade a validar com dados completos, não uma economia comprovada.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
      "campo": "exercicios.itens[6].enunciado.html",
      "linha": 1103
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[6].enunciado.texto",
        "linha": 1103,
        "trecho": "Uma planta migrou 100% para o ambiente livre e reduziu o preço contratado de energia. O diretor financeiro conclui que a empresa \"saiu do regulado\" e que revisão tarifária deixou de importar. Onde está o erro?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[6].resposta_referencia[0].texto",
        "linha": 1103,
        "trecho": "A planta saiu do mercado de energia regulado; continua integralmente dentro da rede regulada. A tarifa de uso do sistema de distribuição continua sendo paga e é, no essencial, a Parcela B rateada entre usuários. Revisão tarifária, Fator X e custo de capital regulatório seguem afetando o custo total de energia da operação."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[6].resposta_referencia[1].texto",
        "linha": 1103,
        "trecho": "Consequência prática: uma economia anunciada apenas sobre o componente de energia superestima o resultado se, no mesmo período, o componente de rede subiu. A leitura correta compara custo total por MWh consumido, decomposto, antes e depois — e mesmo isso é uma oportunidade a validar com dados completos, não uma economia comprovada."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"Não deixou de usar a rede dela\" aparece só na Aula 5.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m05-a05-d01",
    "moduloId": "modulo-05",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "O que a Parcela A agrupa?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
      "campo": "MODULO_05_CORPO['aula-05-05']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
        "campo": "MODULO_05_CORPO['aula-05-05']",
        "linha": null,
        "trecho": "A Parcela A agrupa os custos considerados predominantemente não gerenciáveis pela distribuidora: compra de energia, uso da transmissão e encargos setoriais."
      }
    ],
    "alternativas": [
      "custo operacional, remuneração do capital investido e depreciação regulatória",
      "compra de energia, uso da transmissão e encargos setoriais",
      "o Fator X e a empresa de referência"
    ],
    "gabarito": 1,
    "referencia": "A Parcela A agrupa os custos considerados predominantemente não gerenciáveis pela distribuidora: compra de energia, uso da transmissão e encargos setoriais.",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m05-a05-d02",
    "moduloId": "modulo-05",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O que é o Fator X, e como ele entra na correção da Parcela B?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
      "campo": "MODULO_05_CORPO['aula-05-05']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
        "campo": "MODULO_05_CORPO['aula-05-05']",
        "linha": null,
        "trecho": "O Fator X é o instrumento que compartilha com o consumidor o ganho de produtividade esperado ao longo do ciclo. Ele entra subtraindo do índice de correção da Parcela B: se o índice de preços subiu e o Fator X é positivo, a Parcela B sobe menos que a inflação."
      }
    ],
    "gabarito": null,
    "referencia": "O Fator X é o instrumento que compartilha com o consumidor o ganho de produtividade esperado ao longo do ciclo. Ele entra subtraindo do índice de correção da Parcela B: se o índice de preços subiu e o Fator X é positivo, a Parcela B sobe menos que a inflação.",
    "verificacao": "autoavaliacao"
  },
  {
    "id": "m05-ex-10",
    "moduloId": "modulo-05",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um sistema tem 70% da energia vinda de reservatórios plurianuais, despacho coordenado a partir de custos declarados e auditados, nenhum pagamento permanente por disponibilidade e teto regulatório apertado sobre o preço de curto prazo. Onde ele fica no mapa de dois eixos e qual o risco dominante?",
    "gabarito": null,
    "referencia": "Alto no eixo de revelação por custo — coerente com o peso do recurso armazenável — e baixo no eixo de remuneração de capacidade. O risco dominante é o <em>missing money</em>: o teto suprime exatamente o sinal de preço que financiaria a capacidade de ponta, e não há produto de disponibilidade que o substitua. É a combinação que produz, com o tempo, subinvestimento em capacidade firme ou contratação emergencial cara.<br><br>A resposta completa nota que a saída não é remover o teto — remover o teto num sistema de demanda inelástica transfere risco extremo ao consumidor. A saída é criar um produto próprio de disponibilidade, que é precisamente o caminho híbrido descrito na Aula 06.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
      "campo": "exercicios.itens[9].enunciado.html",
      "linha": 1120
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[9].enunciado.texto",
        "linha": 1120,
        "trecho": "Um sistema tem 70% da energia vinda de reservatórios plurianuais, despacho coordenado a partir de custos declarados e auditados, nenhum pagamento permanente por disponibilidade e teto regulatório apertado sobre o preço de curto prazo. Onde ele fica no mapa de dois eixos e qual o risco dominante?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[9].resposta_referencia[0].texto",
        "linha": 1120,
        "trecho": "Alto no eixo de revelação por custo — coerente com o peso do recurso armazenável — e baixo no eixo de remuneração de capacidade. O risco dominante é o missing money: o teto suprime exatamente o sinal de preço que financiaria a capacidade de ponta, e não há produto de disponibilidade que o substitua. É a combinação que produz, com o tempo, subinvestimento em capacidade firme ou contratação emergencial cara."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "exercicios.itens[9].resposta_referencia[1].texto",
        "linha": 1120,
        "trecho": "A resposta completa nota que a saída não é remover o teto — remover o teto num sistema de demanda inelástica transfere risco extremo ao consumidor. A saída é criar um produto próprio de disponibilidade, que é precisamente o caminho híbrido descrito na Aula 06."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"Os dois eixos que organizam qualquer desenho\" aparece só na Aula 6.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m05-a06-d01",
    "moduloId": "modulo-05",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "No eixo 1 — como o custo é revelado para coordenar o despacho —, onde a aula põe o Brasil?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
      "campo": "MODULO_05_CORPO['aula-05-06']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
        "campo": "MODULO_05_CORPO['aula-05-06']",
        "linha": null,
        "trecho": "No eixo 1, o Brasil está próximo do extremo de despacho por custo."
      }
    ],
    "alternativas": [
      "numa posição intermediária",
      "próximo do extremo de despacho por custo",
      "ofertas voluntárias com preço locacional"
    ],
    "gabarito": 1,
    "referencia": "No eixo 1, o Brasil está próximo do extremo de despacho por custo.",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m05-a06-d02",
    "moduloId": "modulo-05",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "A frase \"no Brasil o despacho é centralizado, lá fora o mercado é descentralizado\" está errada. O que, segundo a aula, varia de fato entre os desenhos?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
      "campo": "MODULO_05_CORPO['aula-05-06']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-05-content.ts",
        "campo": "MODULO_05_CORPO['aula-05-06']",
        "linha": null,
        "trecho": "O que varia entre desenhos não é se há coordenação central, e sim qual informação alimenta a coordenação e quem carrega o risco do resultado. Ofertas voluntárias com preço locacional de um lado; custos declarados e modelos de otimização hidrotérmica do outro. E a contratação comercial — a camada de dinheiro da Aula 03 — pode ser descentralizada nos dois casos, e geralmente é. Quem enuncia a dicotomia \"centralizado versus descentralizado\" está misturando a camada física com a camada comercial."
      }
    ],
    "gabarito": null,
    "referencia": "O que varia entre desenhos não é se há coordenação central, e sim qual informação alimenta a coordenação e quem carrega o risco do resultado. Ofertas voluntárias com preço locacional de um lado; custos declarados e modelos de otimização hidrotérmica do outro. E a contratação comercial — a camada de dinheiro da Aula 03 — pode ser descentralizada nos dois casos, e geralmente é. Quem enuncia a dicotomia \"centralizado versus descentralizado\" está misturando a camada física com a camada comercial.",
    "verificacao": "autoavaliacao"
  }
];

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [];

export const PROVAS: ProvaDoModulo[] = [{
  "moduloId": "modulo-05",
  "criterio": "O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar.",
  "acertosMinimos": 8,
  "total": 10,
  "questoes": [
    {
      "id": "m05-quiz-q01",
      "enunciado": "Qual afirmação sobre monopólio natural está correta?",
      "alternativas": [
        "É uma atividade que, por lei, só pode ser explorada pelo Estado",
        "É uma atividade em que atender todo o mercado com uma única infraestrutura custa menos que dividi-lo entre redes concorrentes",
        "É qualquer atividade em que existe apenas uma empresa operando hoje",
        "É uma atividade cujo preço é fixado pelo regulador"
      ],
      "correta": 1,
      "explicacao": "Aula 01. O conceito descreve a estrutura de custos da atividade — subaditividade na faixa relevante de demanda —, e nada diz sobre propriedade. O operador pode ser público, privado ou misto; o que não muda é a necessidade de disciplina externa, porque não há rival para exercê-la.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "avaliacao.questoes[0]",
        "linha": 1785
      }
    },
    {
      "id": "m05-quiz-q02",
      "enunciado": "Um leilão para escolher quem vai construir e operar uma linha de transmissão por trinta anos é um exemplo de quê?",
      "alternativas": [
        "Competição no mercado, porque várias empresas disputam",
        "Competição pelo mercado, porque a disputa é pelo direito de ser o monopolista",
        "Ausência de competição, porque o vencedor não terá concorrente",
        "Unbundling, porque separa quem constrói de quem opera"
      ],
      "correta": 1,
      "explicacao": "Aula 01. A competição foi real e aconteceu antes, num único momento e sob regras predefinidas. Depois disso, o ativo é monopólio. É por isso que planejamento centralizado da expansão e leilão competitivo de adjudicação são compatíveis, e não contraditórios.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "avaliacao.questoes[1]",
        "linha": 1791
      }
    },
    {
      "id": "m05-quiz-q03",
      "enunciado": "Uma transmissora conecta a geradora do próprio grupo em 60 dias e rivais em 240, cobrando a mesma tarifa publicada. O que isso caracteriza?",
      "alternativas": [
        "Nada de irregular, já que a tarifa cobrada é idêntica para todos",
        "Discriminação vertical, que opera na fila e no prazo em vez de operar no preço",
        "Captura regulatória, porque envolve favorecimento",
        "Subsídio cruzado, porque a afiliada é beneficiada"
      ],
      "correta": 1,
      "explicacao": "Aula 02. A tarifa igual não resolve o problema, porque a discriminação usa prazo, fila, exigência técnica e acesso a dado. É exatamente por isso que a resposta regulatória não se limita a proibir conduta: ela busca remover a estrutura que torna a conduta lucrativa.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "avaliacao.questoes[2]",
        "linha": 1797
      }
    },
    {
      "id": "m05-quiz-q04",
      "enunciado": "Em qual grau de separação o Brasil parou?",
      "alternativas": [
        "Separação contábil apenas, com livros distintos por atividade",
        "Separação jurídica, com camada regulatória e contábil, sem separação societária plena",
        "Separação societária plena, com controle acionário obrigatoriamente distinto",
        "Não há unbundling no Brasil"
      ],
      "correta": 1,
      "explicacao": "Aula 02. As distribuidoras do sistema interligado ficam restritas às atividades próprias de distribuição, mas grupos econômicos podem manter empresas em segmentos diferentes. Dizer que \"no Brasil nenhum grupo faz as duas coisas\" é impreciso e derruba credibilidade numa conversa técnica.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "avaliacao.questoes[3]",
        "linha": 1803
      }
    },
    {
      "id": "m05-quiz-q05",
      "enunciado": "Uma fábrica compra energia de uma usina distante por contrato bilateral e o operador despacha outra usina. O contrato foi descumprido?",
      "alternativas": [
        "Sim, porque a energia contratada não foi entregue pela usina indicada",
        "Não, porque o contrato é obrigação econômica e o fluxo físico obedece à rede e ao despacho",
        "Sim, salvo se o contrato previr expressamente essa hipótese",
        "Depende do submercado em que a usina está localizada"
      ],
      "correta": 1,
      "explicacao": "Aula 03. O contrato coordena dinheiro e risco; o operador coordena elétrons. A diferença entre contratado e medido é apurada e liquidada segundo as regras do sistema. Confundir os dois invalida qualquer análise séria de contrato de energia.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "avaliacao.questoes[4]",
        "linha": 1809
      }
    },
    {
      "id": "m05-quiz-q06",
      "enunciado": "Por que o despacho brasileiro é coordenado a partir de custos declarados e modelos, e não de ofertas voluntárias?",
      "alternativas": [
        "Porque o Estado brasileiro desconfia da capacidade de o mercado formar preço",
        "Porque com reservatórios plurianuais o custo de gerar hoje depende do risco de escassez futura, que nenhum gerador individual internaliza",
        "Porque o parque brasileiro é pequeno demais para sustentar um mercado de ofertas",
        "Porque contratos bilaterais são proibidos no Brasil"
      ],
      "correta": 1,
      "explicacao": "Aula 03. É a otimização hidrotérmica intertemporal. Usar água hoje muda o custo e o risco de amanhã para o sistema inteiro, e essa externalidade temporal só pode ser calculada olhando o conjunto. O desenho é consequência da fisiografia, não preferência política.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "avaliacao.questoes[5]",
        "linha": 1815
      }
    },
    {
      "id": "m05-quiz-q07",
      "enunciado": "Qual das situações abaixo é a evidência MAIS forte de risco de captura regulatória?",
      "alternativas": [
        "A decisão final foi favorável à concessionária",
        "A metodologia foi publicada depois da decisão e os dados de entrada não permitem que um terceiro refaça o cálculo",
        "A concessionária participou ativamente da consulta pública",
        "O reajuste aprovado ficou acima da inflação do período"
      ],
      "correta": 1,
      "explicacao": "Aula 04. Resultado favorável, participação do regulado e reajuste acima da inflação podem ter explicação técnica integral. Anterioridade da metodologia e reprodutibilidade por terceiro são as condições que, quando ausentes, impedem qualquer verificação — e é a ausência delas, não o resultado, que constitui sinal.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "avaliacao.questoes[6]",
        "linha": 1821
      }
    },
    {
      "id": "m05-quiz-q08",
      "enunciado": "Qual a origem estrutural do desequilíbrio de participação nos processos regulatórios?",
      "alternativas": [
        "Falta de interesse dos consumidores em assuntos técnicos",
        "Benefício concentrado em poucos agentes e custo diluído entre milhões, o que torna racional a organização de um lado e não do outro",
        "Restrições legais que impedem consumidores de participar de consultas públicas",
        "Falta de transparência das agências, que não publicam as consultas"
      ],
      "correta": 1,
      "explicacao": "Aula 04. É um problema de ação coletiva. Quem ganha muito individualmente financia equipe permanente; quem perde pouco individualmente não tem incentivo para se organizar. Não é uma questão de caráter, e nenhuma regra de conduta corrige sozinha — por isso o contrapeso analítico externo é parte do desenho.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "avaliacao.questoes[7]",
        "linha": 1827
      }
    },
    {
      "id": "m05-quiz-q09",
      "enunciado": "A conta de uma indústria cativa subiu 12% e a Parcela B da distribuidora subiu 2%. O que se pode concluir?",
      "alternativas": [
        "Que a distribuidora aumentou sua margem em 12%",
        "Que a maior parte do aumento veio de outros componentes — energia comprada, transmissão, encargos, tributos ou componentes financeiros",
        "Que houve erro de cálculo no reajuste",
        "Que a estrutura tarifária permaneceu inalterada"
      ],
      "correta": 1,
      "explicacao": "Aula 05. Parcela A agrupa custos predominantemente não gerenciáveis e é repassada conforme regra. Atribuir um reajuste inteiro à distribuidora sem decompor as parcelas é o erro mais comum do debate público sobre tarifa — e a decomposição é pública.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "avaliacao.questoes[8]",
        "linha": 1833
      }
    },
    {
      "id": "m05-quiz-q10",
      "enunciado": "Uma planta migrou 100% para o ambiente livre. O que a revisão tarifária da distribuidora local ainda afeta?",
      "alternativas": [
        "Nada — ao migrar, a planta deixou de ter relação com a distribuidora",
        "A tarifa de uso da rede, que continua sendo paga e é, em essência, a Parcela B rateada entre os usuários",
        "Apenas o preço da energia contratada no ambiente livre",
        "Somente os tributos incidentes sobre a fatura"
      ],
      "correta": 1,
      "explicacao": "Aula 05 e §Caso. Migrar muda onde a energia é comprada; não muda a dependência da rede. Custo de capital regulatório, base de remuneração e Fator X seguem afetando o custo total de energia da operação — e ignorar isso subestima sistematicamente esse custo.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "avaliacao.questoes[9]",
        "linha": 1839
      }
    }
  ],
  "faixas": [
    {
      "min": 8,
      "max": 10,
      "mensagem": "Critério de domínio atingido. Passe para o §Voz: as trinta e quatro perguntas-relâmpago primeiro, os seis ataques de decisor depois, e só então o roteiro de cinco minutos — tudo em voz alta, sem consultar."
    },
    {
      "min": 0,
      "max": 7,
      "mensagem": "Abaixo do critério de 8/10. Leia os retornos acima, refaça por inteiro as aulas indicadas e volte. Não avance para o §Voz antes de fechar 8."
    }
  ],
  "faixasFonte": {
    "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
    "campo": "avaliacao.faixas_de_placar_script",
    "linha": 1872
  },
  "criterioFonte": {
    "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
    "campo": "avaliacao.lede.html",
    "linha": 1133
  }
}];

export const CHECKLISTS: ChecklistDoModulo[] = [{
  "moduloId": "modulo-05",
  "introducao": "Vinte e uma verificações. Responda sem travar e sem consultar. Cada uma que falhar aponta uma aula específica — e a aula é para ser refeita inteira, não consultada em diagonal.",
  "itens": [
    {
      "id": "m05-checklist-01",
      "texto": "Aplica a régua das quatro perguntas — falha corrigida, incentivo criado, dono do risco, caminho até o consumidor — a qualquer regra do setor, na ordem correta",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[0].html",
        "linha": 1225
      }
    },
    {
      "id": "m05-checklist-02",
      "texto": "Define monopólio natural como propriedade de custo e mostra por que não implica propriedade estatal",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[1].html",
        "linha": 1226
      }
    },
    {
      "id": "m05-checklist-03",
      "texto": "Explica por que o problema do monopólio de rede aparece depois do investimento, e não antes",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[2].html",
        "linha": 1227
      }
    },
    {
      "id": "m05-checklist-04",
      "texto": "Distingue competir no mercado de competir pelo mercado, com exemplo concreto de cada",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[3].html",
        "linha": 1228
      }
    },
    {
      "id": "m05-checklist-05",
      "texto": "Nomeia pelo menos quatro externalidades do setor, diz quem arca com cada uma e por que o preço privado não as internaliza sozinho",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[4].html",
        "linha": 1229
      }
    },
    {
      "id": "m05-checklist-06",
      "texto": "Compara falha de mercado com falha de governo sem tratar nenhuma das duas como ideal",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[5].html",
        "linha": 1230
      }
    },
    {
      "id": "m05-checklist-07",
      "texto": "Lista os quatro graus de unbundling e o conflito específico que cada um resolve",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[6].html",
        "linha": 1231
      }
    },
    {
      "id": "m05-checklist-08",
      "texto": "Diz em qual grau o Brasil parou e o que isso permite que continue acontecendo",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[7].html",
        "linha": 1232
      }
    },
    {
      "id": "m05-checklist-09",
      "texto": "Descreve três formas de discriminar concorrentes sem violar a tarifa publicada — prazo, exigência técnica, acesso a dado ou alocação contábil de custo",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[8].html",
        "linha": 1233
      }
    },
    {
      "id": "m05-checklist-10",
      "texto": "Explica por que acesso formal não é acesso efetivo e nomeia o dado que prova a diferença",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[9].html",
        "linha": 1234
      }
    },
    {
      "id": "m05-checklist-11",
      "texto": "Descreve pool e bilateral em suas formas puras, com força e patologia de cada",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[10].html",
        "linha": 1235
      }
    },
    {
      "id": "m05-checklist-12",
      "texto": "Explica por que contrato bilateral não determina o fluxo físico da energia",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[11].html",
        "linha": 1236
      }
    },
    {
      "id": "m05-checklist-13",
      "texto": "Nomeia as três dimensões do hibridismo brasileiro — operação, contratação e contabilização — sem confundi-las entre si",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[12].html",
        "linha": 1237
      }
    },
    {
      "id": "m05-checklist-14",
      "texto": "Justifica o despacho por custo pela otimização hidrotérmica intertemporal, não por ideologia",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[13].html",
        "linha": 1238
      }
    },
    {
      "id": "m05-checklist-15",
      "texto": "Define captura regulatória sem recorrer a corrupção, nomeia os seis mecanismos e identifica qual deles é o mais difícil de detectar",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[14].html",
        "linha": 1239
      }
    },
    {
      "id": "m05-checklist-16",
      "texto": "Explica a assimetria entre benefício concentrado e custo difuso como origem estrutural do problema",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[15].html",
        "linha": 1240
      }
    },
    {
      "id": "m05-checklist-17",
      "texto": "Aplica o teste de sete perguntas a uma decisão concreta e diz o que consegue e o que não consegue afirmar",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[16].html",
        "linha": 1241
      }
    },
    {
      "id": "m05-checklist-18",
      "texto": "Defende a independência analítica como propriedade do modelo de receita, e responde à pergunta cética sobre a própria NIVAR",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[17].html",
        "linha": 1242
      }
    },
    {
      "id": "m05-checklist-19",
      "texto": "Decompõe um reajuste em Parcela A, Parcela B, tributos e componentes antes de atribuir causa",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[18].html",
        "linha": 1243
      }
    },
    {
      "id": "m05-checklist-20",
      "texto": "Escreve de cabeça a identidade da Parcela B e calcula o efeito de uma variação de custo de capital sobre a base",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[19].html",
        "linha": 1244
      }
    },
    {
      "id": "m05-checklist-21",
      "texto": "Plota o Brasil nos dois eixos do desenho de mercado e desmonta a dicotomia centralizado versus descentralizado",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m05/aparato.json",
        "campo": "checklist_final.itens[20].html",
        "linha": 1245
      }
    }
  ]
}];
