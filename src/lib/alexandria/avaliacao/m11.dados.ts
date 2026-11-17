// Avaliação do M11 (exercícios por aula, prova, checklist). Posse: a sessão de porte do M11.
// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m11.mjs — não editar à mão.
// Conferido por tools/alexandria-dados/avaliacao/verificar-avaliacao-m11.mjs.
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m11-a01-d01",
    "moduloId": "modulo-11",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "A conclusão de uma proposta solar é o produto de, tipicamente, sete premissas encadeadas. Quais são elas?",
    "gabarito": null,
    "referencia": "sete premissas encadeadas: irradiância do local, perdas do sistema, geração anual estimada, taxa de degradação, custo de operação e manutenção, trajetória de reajuste tarifário e regime regulatório aplicável ao faturamento da energia compensada.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
      "campo": "MODULO_11_CORPO['aula-11-01'][1]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-01'][1]",
        "linha": null,
        "trecho": "sete premissas encadeadas: irradiância do local, perdas do sistema, geração anual estimada, taxa de degradação, custo de operação e manutenção, trajetória de reajuste tarifário e regime regulatório aplicável ao faturamento da energia compensada."
      }
    ]
  },
  {
    "id": "m11-a01-d02",
    "moduloId": "modulo-11",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Um decisor entrega a proposta e pergunta se vale a pena. Segundo a aula, qual é a resposta correta no minuto zero?",
    "gabarito": null,
    "referencia": "A resposta correta à pergunta \"vale a pena?\" é, no minuto zero, outra pergunta, e ela é sempre a mesma: quais dessas premissas o documento declara, e de onde ele diz que cada uma veio?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
      "campo": "MODULO_11_CORPO['aula-11-01'][2]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-01'][2]",
        "linha": null,
        "trecho": "A resposta correta à pergunta \"vale a pena?\" é, no minuto zero, outra pergunta, e ela é sempre a mesma: quais dessas premissas o documento declara, e de onde ele diz que cada uma veio?"
      }
    ]
  },
  {
    "id": "m11-ex-11",
    "moduloId": "modulo-11",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "O cliente é uma indústria que iniciou processo de migração para o ambiente livre há três meses. A proposta projeta compensação de excedentes. O que precisa ser esclarecido antes de qualquer outra verificação?",
    "gabarito": null,
    "referencia": "Se a unidade efetivamente exerceu a opção de compra de energia. O <b>parágrafo único do artigo 9º</b> da Lei nº 14.300/2022 veda a adesão ao sistema de compensação aos consumidores livres que exerceram essa opção e aos consumidores especiais que adquiriram energia na forma da legislação específica. Se a migração se consumar, o benefício projetado <b>não é aplicável àquela unidade</b>. Isso tem precedência sobre toda a análise técnica, porque invalida a premissa central do documento.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[10].enunciado",
      "linha": 2476
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[10].enunciado.html",
        "linha": 2476,
        "trecho": "O cliente é uma indústria que iniciou processo de migração para o ambiente livre há três meses. A proposta projeta compensação de excedentes. O que precisa ser esclarecido antes de qualquer outra verificação?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-02'][20]",
        "linha": null,
        "trecho": "consumidores livres"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 11 · Dado faltante a nenhuma aula (§Ex). O termo «consumidores livres», que está no exercício, aparece literalmente só na Aula 02, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-a03-d01",
    "moduloId": "modulo-11",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Quais são os quatro termos regulatórios das modalidades de participação, e o que a aula diz das expressões comerciais que circulam como sinônimos?",
    "gabarito": null,
    "referencia": "os termos regulatórios são autoconsumo local, autoconsumo remoto, geração compartilhada e empreendimento com múltiplas unidades consumidoras. Expressões comerciais que circulam como sinônimos — do tipo \"energia por assinatura\" — não são termos da norma. São marcas de posicionamento de plataformas específicas.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
      "campo": "MODULO_11_CORPO['aula-11-03'][11]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-03'][11]",
        "linha": null,
        "trecho": "os termos regulatórios são autoconsumo local, autoconsumo remoto, geração compartilhada e empreendimento com múltiplas unidades consumidoras. Expressões comerciais que circulam como sinônimos — do tipo \"energia por assinatura\" — não são termos da norma. São marcas de posicionamento de plataformas específicas."
      }
    ]
  },
  {
    "id": "m11-a03-d02",
    "moduloId": "modulo-11",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na leitura para o executivo, qual modalidade reúne titulares diferentes em consórcio, cooperativa ou associação civil?",
    "alternativas": [
      "Autoconsumo local",
      "Autoconsumo remoto",
      "Geração compartilhada"
    ],
    "gabarito": 2,
    "referencia": "Geração compartilhada: titulares diferentes reunidos em consórcio, cooperativa ou associação civil.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
      "campo": "MODULO_11_CORPO['aula-11-03'][21]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-03'][21]",
        "linha": null,
        "trecho": "Geração compartilhada: titulares diferentes reunidos em consórcio, cooperativa ou associação civil."
      }
    ]
  },
  {
    "id": "m11-ex-07",
    "moduloId": "modulo-11",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma proposta de geração compartilhada de 800 kW, solar, apresenta a lista de participantes mas não a distribuição de participação no excedente. Por que isso é decisivo?",
    "gabarito": null,
    "referencia": "Porque acima de 500 kW em fonte não despachável, na modalidade geração compartilhada, um <b>titular único com 25% ou mais da participação do excedente</b> aciona o regime do parágrafo 1º do artigo 27: cem por cento das componentes de distribuição, quarenta por cento das de transmissão e conexão, e cem por cento dos encargos de pesquisa e desenvolvimento, eficiência energética e taxa de fiscalização. É a diferença entre dois regimes de faturamento inteiramente distintos, e o campo que a determina foi omitido.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[6].enunciado",
      "linha": 2454
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[6].enunciado.html",
        "linha": 2454,
        "trecho": "Uma proposta de geração compartilhada de 800 kW, solar, apresenta a lista de participantes mas não a distribuição de participação no excedente. Por que isso é decisivo?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-04'][7]",
        "linha": null,
        "trecho": "25%"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 7 · Dado faltante a nenhuma aula (§Ex). O termo «25%», que está no exercício, aparece literalmente nas Aulas 03, 04, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-ex-01",
    "moduloId": "modulo-11",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma proposta declara 100 kWp instalados e geração anual de 190 MWh. A base nacional dá 5,1 kWh/m²·dia para a localidade, no plano dos módulos. A premissa é realista?",
    "gabarito": null,
    "referencia": "Reconstrua: 100 × 5,1 × 365 = 186.150 kWh de energia incidente equivalente antes de perdas. Para chegar a 190 MWh seria necessário desempenho global superior a cem por cento, o que é fisicamente impossível. <b>A premissa não é realista</b> — e o achado é demonstrável sem opinião, porque não depende de qual desempenho global se considere razoável: qualquer valor abaixo de cem por cento já refuta. A pergunta ao vendedor: qual irradiação, de qual base, com qual desempenho global.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[0].enunciado",
      "linha": 2425
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[0].enunciado.html",
        "linha": 2425,
        "trecho": "Uma proposta declara 100 kWp instalados e geração anual de 190 MWh. A base nacional dá 5,1 kWh/m²·dia para a localidade, no plano dos módulos. A premissa é realista?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-05'][8]",
        "linha": null,
        "trecho": "plano dos módulos"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 1 · Verificação de premissa a nenhuma aula (§Ex). O termo «plano dos módulos», que está no exercício, aparece literalmente só na Aula 05, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-ex-02",
    "moduloId": "modulo-11",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A mesma proposta, agora declarando 145 MWh. Realista?",
    "gabarito": null,
    "referencia": "Desempenho global implícito de aproximadamente 78%. Está dentro da faixa técnica usual para instalação bem projetada. <b>A premissa é plausível</b>, e a verificação seguinte é de reprodutibilidade: a proposta declara esse valor, ou ele só apareceu porque você o calculou? Se não está declarado, o achado não é \"está errado\" — é \"não é reprodutível como está\".",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[1].enunciado",
      "linha": 2430
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[1].enunciado.html",
        "linha": 2430,
        "trecho": "A mesma proposta, agora declarando 145 MWh. Realista?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-05'][9]",
        "linha": null,
        "trecho": "faixa técnica"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 2 · Verificação de premissa a nenhuma aula (§Ex). O termo «faixa técnica», que está no exercício, aparece literalmente só na Aula 05, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-ex-03",
    "moduloId": "modulo-11",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma proposta apresenta projeção de vinte e cinco anos e cita \"módulos de alta eficiência com certificação\". O que falta para verificar a premissa técnica?",
    "gabarito": null,
    "referencia": "Falta: <b>modelo específico</b> do módulo e do inversor; <b>datasheet</b> de ambos; <b>termo de garantia de performance</b> do módulo, com a taxa máxima de degradação garantida; <b>número de registro</b> para consulta no portal do instituto de metrologia; a <b>irradiação de referência</b> adotada e a base de onde veio; o <b>desempenho global</b>; e a <b>orientação e inclinação</b> assumidas. \"Certificação\" sem modelo não é verificável, porque o registro é por modelo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[2].enunciado",
      "linha": 2434
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[2].enunciado.html",
        "linha": 2434,
        "trecho": "Uma proposta apresenta projeção de vinte e cinco anos e cita \"módulos de alta eficiência com certificação\". O que falta para verificar a premissa técnica?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-05'][22]",
        "linha": null,
        "trecho": "instituto de metrologia"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 3 · Dado faltante a nenhuma aula (§Ex). O termo «instituto de metrologia», que está no exercício, aparece literalmente só na Aula 05, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-ex-09",
    "moduloId": "modulo-11",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A projeção assume reajuste tarifário de 11% ao ano por vinte anos. A média histórica homologada da concessionária é de 6,5%. A premissa é falsa?",
    "gabarito": null,
    "referencia": "<b>Não é falsa: é não ancorada.</b> Nenhuma taxa futura é verificável, e essa distinção é o núcleo do Eixo 3. O achado correto é que a premissa se afasta materialmente da única referência disponível e que a proposta não declara por quê. A redação: \"a taxa adotada excede em 4,5 pontos percentuais ao ano a média histórica homologada da concessionária; solicite a justificativa da premissa ou a projeção refeita com sensibilidade sobre esse parâmetro\". Não diga qual taxa é a certa.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[8].enunciado",
      "linha": 2464
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[8].enunciado.html",
        "linha": 2464,
        "trecho": "A projeção assume reajuste tarifário de 11% ao ano por vinte anos. A média histórica homologada da concessionária é de 6,5%. A premissa é falsa?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-06'][20]",
        "linha": null,
        "trecho": "não ancorada"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 9 · Verificação de premissa a nenhuma aula (§Ex). O termo «não ancorada», que está no exercício, aparece literalmente só na Aula 06, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-ex-05",
    "moduloId": "modulo-11",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "O contrato diz: \"Garantia de 25 anos.\" O que essa cláusula deixa sem resposta?",
    "gabarito": null,
    "referencia": "Praticamente tudo. Não diz se é garantia de produto ou de performance; não nomeia o garantidor; não descreve o procedimento de acionamento; não diz quem custeia desmontagem, transporte e remontagem; e não diz o que sobrevive à extinção do fornecedor. Uma cláusula de garantia sem esses cinco campos é <b>uma afirmação de marketing dentro de um contrato</b>, não uma obrigação exigível com escopo definido.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[4].enunciado",
      "linha": 2445
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[4].enunciado.html",
        "linha": 2445,
        "trecho": "O contrato diz: \"Garantia de 25 anos.\" O que essa cláusula deixa sem resposta?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-07'][1]",
        "linha": null,
        "trecho": "garantidor"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 5 · Leitura contratual a nenhuma aula (§Ex). O termo «garantidor», que está no exercício, aparece literalmente só na Aula 07, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-ex-08",
    "moduloId": "modulo-11",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "O contrato prevê que \"eventuais obras de reforço de rede exigidas pela distribuidora serão faturadas em aditivo\". Qual pergunta essa cláusula obriga?",
    "gabarito": null,
    "referencia": "Duas. Primeira: <b>existe teto</b> para esse aditivo, ou o cliente assume risco ilimitado sobre um custo que só será conhecido no parecer de acesso? Segunda: o cliente pode <b>rescindir sem penalidade</b> se o orçamento de conexão inviabilizar o projeto? Sem as duas respostas, o preço da proposta não é o preço da proposta. Note que, para <b>microgeração</b>, melhorias e reforços em função exclusiva da conexão são custeados integralmente pela distribuidora — o que torna a cláusula ainda mais estranha nesse porte.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[7].enunciado",
      "linha": 2459
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[7].enunciado.html",
        "linha": 2459,
        "trecho": "O contrato prevê que \"eventuais obras de reforço de rede exigidas pela distribuidora serão faturadas em aditivo\". Qual pergunta essa cláusula obriga?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-07'][9]",
        "linha": null,
        "trecho": "reforço"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 8 · Leitura contratual a nenhuma aula (§Ex). O termo «reforço», que está no exercício, aparece literalmente só na Aula 07, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-ex-10",
    "moduloId": "modulo-11",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um contrato define garantia de produto do fabricante por doze anos, garantia de performance do fabricante por vinte e cinco, mão de obra de substituição coberta pelo integrador por cinco anos, procedimento de acionamento descrito, e cláusula de sobrevivência das obrigações do fabricante à eventual extinção do integrador. Parecer?",
    "gabarito": null,
    "referencia": "<b>O contrato responde às cinco perguntas.</b> Diga isso. A limitação da mão de obra a cinco anos é uma condição, não um defeito: está declarada, é precificável e é negociável. A diferença entre um contrato com risco declarado e um contrato com risco indefinido é a diferença entre poder decidir e não poder — e o primeiro é o que se pede.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[9].enunciado",
      "linha": 2469
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[9].enunciado.html",
        "linha": 2469,
        "trecho": "Um contrato define garantia de produto do fabricante por doze anos, garantia de performance do fabricante por vinte e cinco, mão de obra de substituição coberta pelo integrador por cinco anos, procedimento de acionamento descrito, e cláusula de sobrevivência das obrigações do fabricante à eventual extinção do integrador. Parecer?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-07'][3]",
        "linha": null,
        "trecho": "mão de obra"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 10 · Diagnóstico negativo a nenhuma aula (§Ex). O termo «mão de obra», que está no exercício, aparece literalmente só na Aula 07, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-ex-12",
    "moduloId": "modulo-11",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma proposta de ampliação de sistema existente, cujo original foi protocolado em 2022, projeta o conjunto inteiro sob compensação integral até 2045. Correto?",
    "gabarito": null,
    "referencia": "<b>Não.</b> O inciso III do parágrafo 2º do artigo 26 estabelece que as disposições do regime preservado deixam de ser aplicáveis <b>na parcela de aumento</b> da potência instalada cujo protocolo ocorra após os doze meses da publicação da lei. A parcela nova entra no regime de transição; a original permanece preservada. A projeção precisa <b>separar as duas parcelas</b>, e o erro é de Eixo 2 com efeito por toda a vida útil da ampliação.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[11].enunciado",
      "linha": 2481
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[11].enunciado.html",
        "linha": 2481,
        "trecho": "Uma proposta de ampliação de sistema existente, cujo original foi protocolado em 2022, projeta o conjunto inteiro sob compensação integral até 2045. Correto?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-07'][22]",
        "linha": null,
        "trecho": "parcela de aumento"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 12 · Verificação de premissa a nenhuma aula (§Ex). O termo «parcela de aumento», que está no exercício, aparece literalmente só na Aula 07, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-ex-13",
    "moduloId": "modulo-11",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A usina será instalada em terreno arrendado, e o contrato de arrendamento remunera o proprietário em valor por megawatt-hora gerado. Qual é o problema?",
    "gabarito": null,
    "referencia": "O <b>artigo 10</b> da Lei nº 14.300/2022 impede a distribuidora de incluir o consumidor no sistema de compensação quando o documento de posse ou propriedade demonstrar arrendamento cujo valor se dê em real por unidade de energia elétrica. Não é multa nem ressalva: é <b>causa de não inclusão</b>. O projeto perde o mecanismo que o justifica. A solução é contratual — reestruturar a remuneração do arrendamento — e precisa acontecer antes do protocolo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[12].enunciado",
      "linha": 2486
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[12].enunciado.html",
        "linha": 2486,
        "trecho": "A usina será instalada em terreno arrendado, e o contrato de arrendamento remunera o proprietário em valor por megawatt-hora gerado. Qual é o problema?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-07'][13]",
        "linha": null,
        "trecho": "arrendamento"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 13 · Leitura contratual a nenhuma aula (§Ex). O termo «arrendamento», que está no exercício, aparece literalmente só na Aula 07, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-ex-04",
    "moduloId": "modulo-11",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma proposta declara irradiação com fonte e data, desempenho global de 76%, degradação de 0,55%/ano igual à garantida no datasheet anexo, linha anual de operação e manutenção, substituição de inversor prevista no ano treze, e trajetória tarifária ancorada na média de reajustes homologados da concessionária. Parecer?",
    "gabarito": null,
    "referencia": "<b>A proposta é sólida nos Eixos 1 e 3.</b> Diga isso sem procurar problema. Restam duas verificações que não dependem da qualidade do documento: o <b>Eixo 2</b> — data de protocolo, modalidade, regime — e o <b>Eixo 4</b> — contrato e garantias. Uma proposta pode ser exemplar na planilha e ter lacuna contratual, e as duas coisas são independentes.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[3].enunciado",
      "linha": 2439
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[3].enunciado.html",
        "linha": 2439,
        "trecho": "Uma proposta declara irradiação com fonte e data, desempenho global de 76%, degradação de 0,55%/ano igual à garantida no datasheet anexo, linha anual de operação e manutenção, substituição de inversor prevista no ano treze, e trajetória tarifária ancorada na média de reajustes homologados da concessionária. Parecer?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-08'][4]",
        "linha": null,
        "trecho": "sólida"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 4 · Diagnóstico negativo a nenhuma aula (§Ex). O termo «sólida», que está no exercício, aparece literalmente só na Aula 08, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-ex-06",
    "moduloId": "modulo-11",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A projeção usa degradação de 0,3%/ano. O datasheet do módulo especificado garante degradação máxima de 0,55%/ano após o primeiro ano. Qual é o achado, e de que tipo?",
    "gabarito": null,
    "referencia": "A planilha projeta desempenho <b>mais otimista do que o próprio fabricante garante contratualmente</b>. É achado de Eixo 1, verificável, com fonte independente que é o próprio documento anexo à proposta. A redação correta não é \"a degradação está errada\" — é \"a taxa adotada na projeção é inferior à taxa máxima garantida no termo de garantia do módulo especificado; solicite a projeção refeita com a taxa garantida\".",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[5].enunciado",
      "linha": 2449
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[5].enunciado.html",
        "linha": 2449,
        "trecho": "A projeção usa degradação de 0,3%/ano. O datasheet do módulo especificado garante degradação máxima de 0,55%/ano após o primeiro ano. Qual é o achado, e de que tipo?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-08'][15]",
        "linha": null,
        "trecho": "degradação"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 6 · Verificação de premissa a nenhuma aula (§Ex). O termo «degradação», que está no exercício, aparece literalmente nas Aulas 01, 05, 06, 07, 08, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m11-ex-14",
    "moduloId": "modulo-11",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Ao fim de trinta minutos, você tem: geração verificada e compatível, enquadramento correto, premissas financeiras declaradas e ancoradas, e nenhum contrato — ele \"será enviado na assinatura\". Qual é o veredito?",
    "gabarito": null,
    "referencia": "<b>Não é possível concluir</b>, e a razão precisa ser dita com precisão: a trilha técnico-regulatória fechou favoravelmente e a trilha contratual não pôde ser executada. O veredito não é negativo — é incompleto por indisponibilidade documental, e a insuficiência tem precedência. A entrega é a lista de solicitações: contrato completo, anexo de garantias, e as cinco perguntas de garantia por escrito. E vale nomear o padrão: contrato que só aparece na assinatura é contrato lido por quem já decidiu.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "exercicios.soltos_P9[13].enunciado",
      "linha": 2491
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
        "campo": "exercicios.soltos_P9[13].enunciado.html",
        "linha": 2491,
        "trecho": "Ao fim de trinta minutos, você tem: geração verificada e compatível, enquadramento correto, premissas financeiras declaradas e ancoradas, e nenhum contrato — ele \"será enviado na assinatura\". Qual é o veredito?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-11-content.ts",
        "campo": "MODULO_11_CORPO['aula-11-08'][12]",
        "linha": null,
        "trecho": "insuficiência"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 14 · Dado faltante a nenhuma aula (§Ex). O termo «insuficiência», que está no exercício, aparece literalmente só na Aula 08, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  }
];

/** Exercícios da fonte cujo termo não casa com nenhuma aula (regra de colocação de 15/11). */
export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-11",
    "criterio": "O critério é oito acertos: abaixo disso, a matéria não está no ponto de sustentar uma avaliação cronometrada diante de um cliente.",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m11-quiz-q01",
        "enunciado": "Uma proposta declara potência instalada de 80 kWp em módulos e inversores somando 68 kW. Como se classifica o porte?",
        "alternativas": [
          "Minigeração distribuída, porque a potência de pico supera 75 kW.",
          "Depende da fonte: solar sempre é classificada pela potência de pico.",
          "Microgeração distribuída: a classificação usa a potência instalada em corrente alternada, que é 68 kW.",
          "Não é possível classificar sem saber a modalidade de participação."
        ],
        "correta": 2,
        "explicacao": "A definição legal e a da resolução da agência falam em potência instalada em corrente alternada. São 68 kW, abaixo de 75 kW: microgeração. Classificar pela potência de pico dos módulos é o erro de partida que se propaga para modalidade e regime.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "avaliacao.perguntas[0]",
          "linha": 3847
        }
      },
      {
        "id": "m11-quiz-q02",
        "enunciado": "Um sistema fotovoltaico de 2,4 MW com baterias dimensionadas para modular pelo menos vinte por cento da geração mensal. Ele se enquadra como minigeração?",
        "alternativas": [
          "Sim: com armazenamento nessa proporção a fonte é despachável, e o limite aplicável continua sendo 3 MW para fotovoltaica — 2,4 MW cabe.",
          "Sim, e o limite passa a ser 5 MW, como para qualquer fonte despachável.",
          "Não: fotovoltaica nunca é despachável, e acima de 3 MW o enquadramento é vedado.",
          "Não: sistemas com armazenamento saem do regime de geração distribuída."
        ],
        "correta": 0,
        "explicacao": "A lei inclui fotovoltaica com baterias entre as fontes despacháveis, mas a limita expressamente a 3 MW nesse caso. O teto de 5 MW das demais despacháveis não se estende à fotovoltaica com armazenamento.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "avaliacao.perguntas[1]",
          "linha": 3854
        }
      },
      {
        "id": "m11-quiz-q03",
        "enunciado": "Uma indústria migrou para o ambiente de contratação livre e recebe proposta de autoconsumo local. O que a avaliação precisa apontar primeiro?",
        "alternativas": [
          "Que a modalidade correta seria autoconsumo remoto.",
          "Nada de especial: a modalidade independe do ambiente de contratação.",
          "Que o percentual do componente de rede será maior por ser consumidor livre.",
          "Que consumidores que exerceram a opção de compra no ambiente livre não podem aderir ao sistema de compensação — é vedação de elegibilidade, e antecede qualquer discussão de modalidade."
        ],
        "correta": 3,
        "explicacao": "O artigo 9º da lei do marco legal veda a adesão ao sistema de compensação por consumidores livres e especiais que exerceram a opção. É elegibilidade, não preço, e resolve o caso antes de qualquer conta.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "avaliacao.perguntas[2]",
          "linha": 3861
        }
      },
      {
        "id": "m11-quiz-q04",
        "enunciado": "O que o inciso VII do artigo 27 da lei do marco legal determina para o período a partir de 2029?",
        "alternativas": [
          "Incidência de cem por cento das componentes tarifárias de distribuição sobre a energia compensada.",
          "A aplicação da regra do artigo 17, que delega à agência estabelecer as regras tarifárias, abatidos os benefícios ao sistema — metodologia ainda em elaboração.",
          "A manutenção do percentual de noventa por cento alcançado em 2028.",
          "O encerramento do sistema de compensação para novas unidades."
        ],
        "correta": 1,
        "explicacao": "O inciso não fixa percentual: remete ao artigo 17. Tratar 2029 como cem por cento é a simplificação mais comum do material de mercado e não corresponde ao texto. As diretrizes de valoração vieram em 2024 e a conclusão do projeto regulatório está prevista para 2027.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "avaliacao.perguntas[3]",
          "linha": 3868
        }
      },
      {
        "id": "m11-quiz-q05",
        "enunciado": "Minigeração de 700 kW, fotovoltaica sem armazenamento, em geração compartilhada, com um titular detendo trinta por cento da participação no excedente. Protocolo em 2024. Qual regime?",
        "alternativas": [
          "Direito adquirido, por ser geração compartilhada.",
          "Transição padrão, como qualquer unidade protocolada após janeiro de 2023.",
          "Regime de transição com aplicação da regra posterior a partir de 2031.",
          "Regime especial do parágrafo 1º do artigo 27: acima de 500 kW, fonte não despachável, modalidade alcançada e titular com vinte e cinco por cento ou mais da participação no excedente."
        ],
        "correta": 3,
        "explicacao": "Os quatro requisitos são cumulativos e todos estão presentes. O regime especial incide até 2028 com cem por cento das componentes de distribuição, quarenta por cento das de transmissão e cem por cento dos encargos listados.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "avaliacao.perguntas[4]",
          "linha": 3875
        }
      },
      {
        "id": "m11-quiz-q06",
        "enunciado": "Por quanto tempo os créditos de energia permanecem válidos, e qual é a consequência disso para uma proposta?",
        "alternativas": [
          "Sessenta meses a contar do faturamento em que foram gerados — uma projeção que acumula crédito indefinidamente está errada, não otimista.",
          "Vinte e cinco anos, acompanhando a vida útil do sistema.",
          "Até 2045, para qualquer unidade participante.",
          "Não expiram: são convertidos em desconto permanente na fatura."
        ],
        "correta": 0,
        "explicacao": "Sessenta meses, pelo artigo 13 da lei e pelo artigo correspondente da resolução da agência. Sistema superdimensionado em relação à carga acumula crédito que pode expirar sem uso, e a projeção precisa refletir isso.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "avaliacao.perguntas[5]",
          "linha": 3882
        }
      },
      {
        "id": "m11-quiz-q07",
        "enunciado": "Um inversor de 100 kW não tem registro no programa de avaliação da conformidade. O que a avaliação conclui?",
        "alternativas": [
          "Que o equipamento é irregular e a proposta deve ser rejeitada.",
          "Que a certificação é voluntária para inversores e o item é irrelevante.",
          "Que inversores acima de 75 kW estão fora do escopo da certificação compulsória — a ausência de registro não caracteriza irregularidade, e a pergunta correta é qual documento atesta a conformidade dele.",
          "Que o inversor precisa ser substituído por dois de menor porte para caber no escopo."
        ],
        "correta": 2,
        "explicacao": "O escopo da portaria vigente alcança inversores até 75 kW. Acima disso, ausência de registro não é irregularidade. Repare que esse limite coincide com o limiar entre microgeração e minigeração.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "avaliacao.perguntas[6]",
          "linha": 3889
        }
      },
      {
        "id": "m11-quiz-q08",
        "enunciado": "A planilha de uma proposta usa degradação anual de 0,3% e o termo de garantia do módulo especificado assegura no máximo 0,55% ao ano. O que isso caracteriza?",
        "alternativas": [
          "Nada: 0,3% é a taxa típica de mercado e é aceitável.",
          "Divergência entre a premissa da planilha e o único documento com efeito jurídico sobre o desempenho — a projeção conta com energia que o fabricante não se obriga a entregar.",
          "Erro de unidade: degradação se expressa em percentual acumulado, não anual.",
          "Que a proposta é conservadora, por usar taxa menor que a garantida."
        ],
        "correta": 1,
        "explicacao": "A taxa garantida é o piso contratual; a taxa típica de mercado não obriga ninguém. Usar a segunda no lugar da primeira transfere ao comprador um risco que o documento de garantia não cobre.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "avaliacao.perguntas[7]",
          "linha": 3896
        }
      },
      {
        "id": "m11-quiz-q09",
        "enunciado": "Uma proposta apresenta apenas o resultado financeiro consolidado, sem expor trajetória tarifária, degradação, custo de operação e manutenção nem hipótese para o período posterior à transição. Qual é o achado?",
        "alternativas": [
          "Que o resultado está inflado.",
          "Que faltam anexos técnicos, o que é irrelevante para o resultado.",
          "Que a proposta é sólida se o resultado for compatível com o de outras propostas recebidas.",
          "Que a conclusão não é auditável: sem as premissas visíveis não há como confirmar nem refutar o resultado, e o parecer correto é a lista do que precisa ser fornecido."
        ],
        "correta": 3,
        "explicacao": "Não se conclui sobre o que não se leu. A insuficiência documental tem precedência sobre qualquer juízo de mérito, e a saída correta é a solicitação, não o veredito.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "avaliacao.perguntas[8]",
          "linha": 3903
        }
      },
      {
        "id": "m11-quiz-q10",
        "enunciado": "Todas as premissas técnicas conferem, o enquadramento está correto, as premissas financeiras estão declaradas e ancoradas, e o contrato responde às perguntas de responsabilidade. Qual é a saída correta?",
        "alternativas": [
          "Declarar que a proposta é sólida, registrando o que foi verificado e contra qual fonte, e apontar o que nenhuma avaliação documental resolve — levantamento do local e projeto executivo.",
          "Procurar um achado adicional: nenhuma proposta comercial é integralmente sólida.",
          "Recomendar a contratação e estimar o resultado esperado.",
          "Concluir que a avaliação foi superficial e refazê-la com mais tempo."
        ],
        "correta": 0,
        "explicacao": "O diagnóstico favorável tem o mesmo peso do desfavorável e exige o mesmo rastro. Quem só sabe encontrar problema emite parecer previsível, e parecer previsível não carrega informação. Recomendar contratação e estimar resultado, por outro lado, está fora do escopo de uma avaliação independente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "avaliacao.perguntas[9]",
          "linha": 3910
        }
      }
    ],
    "faixas": [
      {
        "min": 8,
        "max": 10,
        "mensagem": "Critério atingido. A matéria está no ponto de sustentar uma avaliação cronometrada nas duas trilhas — inclusive a saída de que a proposta é sólida, que é a mais difícil de emitir com naturalidade."
      },
      {
        "min": 0,
        "max": 7,
        "mensagem": "Abaixo do critério de oito acertos. Reveja as questões erradas antes de aplicar a ordem de avaliação a uma proposta real: o erro que custa caro não é o sinal de alerta esquecido, é confirmar premissa financeira antes de ter confirmado a premissa técnica que a sustenta."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "avaliacao.faixas_de_placar_script",
      "linha": 3952
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
      "campo": "avaliacao.introducao",
      "linha": null
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-11",
    "introducao": "O primeiro item é a execução completa da avaliação cronometrada nas duas trilhas. O último é a capacidade de dizer que a proposta é sólida quando ela for.",
    "itens": [
      {
        "id": "m11-check-01",
        "texto": "Executei a avaliação completa de uma proposta em trinta minutos, cronometrada, nas duas trilhas — técnico-regulatória e contratual — em paralelo, e não em sequência.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[0]",
          "linha": 2585
        }
      },
      {
        "id": "m11-check-02",
        "texto": "Solicitei contrato, datasheets e termo de garantia de performance nos primeiros cinco minutos, antes de qualquer análise.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[1]",
          "linha": 2586
        }
      },
      {
        "id": "m11-check-03",
        "texto": "Confirmei a irradiação da localidade específica na base nacional, por coordenada, e não usei valor de outro município.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[2]",
          "linha": 2587
        }
      },
      {
        "id": "m11-check-04",
        "texto": "Reconstruí a geração de referência e comparei com a declarada, registrando o desempenho global implícito.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[3]",
          "linha": 2588
        }
      },
      {
        "id": "m11-check-05",
        "texto": "Verifiquei se a proposta declara irradiação de referência, base de origem, desempenho global, orientação e inclinação.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[4]",
          "linha": 2589
        }
      },
      {
        "id": "m11-check-06",
        "texto": "Comparei a degradação usada na projeção com a taxa máxima garantida no termo de garantia do modelo especificado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[5]",
          "linha": 2590
        }
      },
      {
        "id": "m11-check-07",
        "texto": "Confirmei modelo específico de módulo e de inversor, e verifiquei registro por modelo no portal do instituto de metrologia.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[6]",
          "linha": 2591
        }
      },
      {
        "id": "m11-check-08",
        "texto": "Verifiquei se o inversor do projeto está dentro ou fora do escopo da certificação compulsória, e não tratei \"equipamento certificado\" como resposta suficiente para minigeração.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[7]",
          "linha": 2592
        }
      },
      {
        "id": "m11-check-09",
        "texto": "Classifiquei o porte pela potência instalada em corrente alternada, e não pela potência de pico dos módulos.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[8]",
          "linha": 2593
        }
      },
      {
        "id": "m11-check-10",
        "texto": "Confirmei o teto de porte aplicável à fonte, sem supor que armazenamento eleva o limite da minigeração solar para cinco megawatts.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[9]",
          "linha": 2594
        }
      },
      {
        "id": "m11-check-11",
        "texto": "Identifiquei a modalidade regulatória correspondente ao arranjo descrito, traduzindo eventual vocabulário comercial para o termo da norma.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[10]",
          "linha": 2595
        }
      },
      {
        "id": "m11-check-12",
        "texto": "Verifiquei qual documento comprova o enquadramento na modalidade declarada, e confirmei que ele existe.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[11]",
          "linha": 2596
        }
      },
      {
        "id": "m11-check-13",
        "texto": "Obtive a data de protocolo do pedido de acesso e determinei a classe de faturamento aplicável.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[12]",
          "linha": 2597
        }
      },
      {
        "id": "m11-check-14",
        "texto": "Verifiquei se o protocolo cai na janela que posterga a incidência da regra pós-transição para 2031.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[13]",
          "linha": 2598
        }
      },
      {
        "id": "m11-check-15",
        "texto": "Em projeto acima de quinhentos quilowatts não despachável em modalidade remota ou compartilhada, obtive a participação do maior titular no excedente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[14]",
          "linha": 2599
        }
      },
      {
        "id": "m11-check-16",
        "texto": "Confirmei o percentual do ano corrente das componentes de distribuição sobre a energia compensada, com data de consulta.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[15]",
          "linha": 2600
        }
      },
      {
        "id": "m11-check-17",
        "texto": "Registrei que os percentuais incidem sobre as componentes do caput do artigo 27, e não sobre a tarifa integral.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[16]",
          "linha": 2601
        }
      },
      {
        "id": "m11-check-18",
        "texto": "Identifiquei quantos anos da projeção estão sob regra vigente e quantos estão sob regra em elaboração, sem tratar 2029 como percentual fixo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[17]",
          "linha": 2602
        }
      },
      {
        "id": "m11-check-19",
        "texto": "Verifiquei se a trajetória tarifária assumida está declarada e ancorada em histórico homologado da concessionária correta.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[18]",
          "linha": 2603
        }
      },
      {
        "id": "m11-check-20",
        "texto": "Verifiquei a presença de linha de operação e manutenção e de substituição de inversor na projeção.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[19]",
          "linha": 2604
        }
      },
      {
        "id": "m11-check-21",
        "texto": "Comparei a geração estimada ao consumo compensável e verifiquei risco de acúmulo de crédito além do prazo de sessenta meses.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[20]",
          "linha": 2605
        }
      },
      {
        "id": "m11-check-22",
        "texto": "Confirmei que a projeção não zera a fatura, respeitando o valor mínimo faturável.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[21]",
          "linha": 2606
        }
      },
      {
        "id": "m11-check-23",
        "texto": "Em minigeração acima de quinhentos quilowatts, verifiquei se a garantia de fiel cumprimento foi contemplada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[22]",
          "linha": 2607
        }
      },
      {
        "id": "m11-check-24",
        "texto": "Separei garantia de produto e garantia de performance, com prazo, garantidor, procedimento, custeio de mão de obra e sobrevivência à extinção do fornecedor.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[23]",
          "linha": 2608
        }
      },
      {
        "id": "m11-check-25",
        "texto": "Verifiquei prazo legal de início de injeção aplicável e a consequência contratual do atraso imputável ao fornecedor.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[24]",
          "linha": 2609
        }
      },
      {
        "id": "m11-check-26",
        "texto": "Verifiquei se o arranjo de área e a forma de remuneração do arrendamento não impedem a inclusão no sistema de compensação.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[25]",
          "linha": 2610
        }
      },
      {
        "id": "m11-check-27",
        "texto": "Em proposta de ampliação, confirmei que a parcela nova foi tratada em regime próprio e separada da parcela original.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[26]",
          "linha": 2611
        }
      },
      {
        "id": "m11-check-28",
        "texto": "Sei dizer, sem constrangimento e sem procurar um problema que não existe, que a proposta é sólida quando ela for.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m11/aparato.json",
          "campo": "checklist_final.itens[27]",
          "linha": 2612
        }
      }
    ]
  }
];
