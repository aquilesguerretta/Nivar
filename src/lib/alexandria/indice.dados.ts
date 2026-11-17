// GERADO por tools/alexandria-dados/gerar-indice.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction (identidade-modulos, mNN/modulo.json,
// m01/aula-0N.json, instrumentos/instrumentos.json, glossario/glossario.json).
// 17 módulos · 141 aulas · gerado em 2026-11-15.

import type { IndiceAlexandria } from './indice';

export const INDICE: IndiceAlexandria = {
  "trilhas": [
    {
      "id": "trilha-fundamentos-universais",
      "romano": "I",
      "nome": "Fundamentos Universais",
      "modulos": [
        "modulo-01",
        "modulo-02",
        "modulo-03",
        "modulo-04",
        "modulo-05"
      ]
    },
    {
      "id": "trilha-setor-eletrico-brasileiro",
      "romano": "II",
      "nome": "Setor Elétrico Brasileiro",
      "modulos": [
        "modulo-06",
        "modulo-07",
        "modulo-08",
        "modulo-09",
        "modulo-10",
        "modulo-11",
        "modulo-12"
      ]
    },
    {
      "id": "trilha-especializacao-estrategica",
      "romano": "III",
      "nome": "Especialização Estratégica",
      "modulos": [
        "modulo-13",
        "modulo-14",
        "modulo-15",
        "modulo-16",
        "modulo-17"
      ]
    }
  ],
  "modulos": [
    {
      "id": "modulo-01",
      "codigo": "M01",
      "numero": 1,
      "trilhaId": "trilha-fundamentos-universais",
      "titulo": "Física de Energia e Eletricidade",
      "tese": "Uma conta de luz não é uma cobrança por energia.",
      "totalInstrumentos": 7,
      "totalTermos": 38,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Energia é volume. Potência é velocidade.",
          "tema": "Energia × Potência",
          "sinopse": "Por que kW e kWh não são a mesma coisa?"
        },
        {
          "numero": 2,
          "titulo": "Sete símbolos. Toda a linguagem.",
          "tema": "As sete unidades essenciais",
          "sinopse": "O que volt, ampere, watt, kVA e kVAr realmente medem?"
        },
        {
          "numero": 3,
          "titulo": "A rede tem um batimento cardíaco. Ele se chama 60 Hz.",
          "tema": "Corrente alternada e frequência",
          "sinopse": "Por que a rede oscila 60 vezes por segundo, e por que isso importa?"
        },
        {
          "numero": 4,
          "titulo": "Por que perdas crescem ao quadrado. E por que isso desenhou toda a rede.",
          "tema": "Tensão, corrente e perdas",
          "sinopse": "Por que transmissão usa alta tensão? Por que perdas crescem ao quadrado?"
        },
        {
          "numero": 5,
          "titulo": "Por que uma fábrica paga por capacidade reservada.",
          "tema": "Demanda e fator de carga",
          "sinopse": "Por que uma fábrica paga por capacidade reservada, não só por energia?"
        },
        {
          "numero": 6,
          "titulo": "A tensão de fornecimento define a tarifa que você paga.",
          "tema": "Tensão como categoria econômica",
          "sinopse": "Por que sua tensão de fornecimento define seu grupo tarifário?"
        },
        {
          "numero": 7,
          "titulo": "Existe energia que ocupa a rede e não vira produção.",
          "tema": "Triângulo de potência e fator de potência",
          "sinopse": "Por que existe energia que ocupa a rede mas não vira produção?"
        },
        {
          "numero": 8,
          "titulo": "100 MW solar ≠ 100 MW térmica.",
          "tema": "Capacidade instalada e fator de capacidade",
          "sinopse": "Por que 100 MW solar ≠ 100 MW térmica?"
        },
        {
          "numero": 9,
          "titulo": "Energia ruim pode custar mais do que energia cara.",
          "tema": "Qualidade de energia",
          "sinopse": "Por que tensão ruim é problema financeiro, não só técnico?"
        }
      ]
    },
    {
      "id": "modulo-02",
      "codigo": "M02",
      "numero": 2,
      "trilhaId": "trilha-fundamentos-universais",
      "titulo": "Como Funciona uma Rede Elétrica",
      "tese": "Eletricidade, em escala de rede, não se armazena de forma economicamente significativa.",
      "totalInstrumentos": 9,
      "totalTermos": 65,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Quatro camadas, um organismo.",
          "tema": "Anatomia da rede e o SIN",
          "sinopse": null
        },
        {
          "numero": 2,
          "titulo": "A matemática que desenha o sistema.",
          "tema": "Alta tensão, HVDC e os limites do fio",
          "sinopse": null
        },
        {
          "numero": 3,
          "titulo": "As articulações do sistema.",
          "tema": "Subestações e proteção",
          "sinopse": null
        },
        {
          "numero": 4,
          "titulo": "A demanda respira — e o operador respira junto.",
          "tema": "Carga, curva de carga e curva líquida",
          "sinopse": null
        },
        {
          "numero": 5,
          "titulo": "Quem liga agora — e por quê.",
          "tema": "Despacho e ordem de mérito",
          "sinopse": null
        },
        {
          "numero": 6,
          "titulo": "A sala que enxerga um continente.",
          "tema": "ONS, centros de operação e horizontes",
          "sinopse": null
        },
        {
          "numero": 7,
          "titulo": "Os bastidores que ninguém vê — e todo mundo paga.",
          "tema": "Reservas e serviços ancilares",
          "sinopse": null
        },
        {
          "numero": 8,
          "titulo": "Os dez segundos que decidem tudo.",
          "tema": "Estabilidade, inércia e a anatomia de um apagão",
          "sinopse": null
        },
        {
          "numero": 9,
          "titulo": "A energia que some — e quem paga por ela.",
          "tema": "Perdas técnicas e não técnicas",
          "sinopse": null
        },
        {
          "numero": 10,
          "titulo": "Onde a infraestrutura encosta no dinheiro.",
          "tema": "Da física ao custo: fio, congestionamento e curtailment",
          "sinopse": null
        }
      ]
    },
    {
      "id": "modulo-03",
      "codigo": "M03",
      "numero": 3,
      "trilhaId": "trilha-fundamentos-universais",
      "titulo": "Tecnologias de Geração",
      "tese": "O sistema elétrico não compra fontes — compra atributos.",
      "totalInstrumentos": 9,
      "totalTermos": 63,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Capacidade, energia e o fator que liga as duas.",
          "tema": "A matriz em três lentes",
          "sinopse": null
        },
        {
          "numero": 2,
          "titulo": "A bateria que veio antes do lítio.",
          "tema": "Hidrelétrica com reservatório",
          "sinopse": null
        },
        {
          "numero": 3,
          "titulo": "A hidrelétrica que não escolhe quando gerar.",
          "tema": "Fio d'água",
          "sinopse": null
        },
        {
          "numero": 4,
          "titulo": "O vento de classe mundial do Nordeste.",
          "tema": "Eólica",
          "sinopse": null
        },
        {
          "numero": 5,
          "titulo": "A fonte que quebrou a curva de custos — e endureceu o relógio.",
          "tema": "Solar — UFV e MMGD",
          "sinopse": null
        },
        {
          "numero": 6,
          "titulo": "A flexibilidade que se paga — e o sistema paga.",
          "tema": "Térmicas a gás",
          "sinopse": null
        },
        {
          "numero": 7,
          "titulo": "O resto do parque térmico: o que cada um ainda resolve.",
          "tema": "Carvão, óleo e biomassa",
          "sinopse": null
        },
        {
          "numero": 8,
          "titulo": "Angra 3, ou: uma aula de custo de capital em concreto armado.",
          "tema": "Nuclear",
          "sinopse": null
        },
        {
          "numero": 9,
          "titulo": "A bateria desloca energia. Quem gera é o resto.",
          "tema": "Armazenamento",
          "sinopse": null
        },
        {
          "numero": 10,
          "titulo": "A planilha que ordena custos não é a planilha que decide o sistema.",
          "tema": "LCOE, valor de sistema e portfólio",
          "sinopse": null
        }
      ]
    },
    {
      "id": "modulo-04",
      "codigo": "M04",
      "numero": 4,
      "trilhaId": "trilha-fundamentos-universais",
      "titulo": "Economia de Mercados de Energia",
      "tese": "O mercado elétrico não precifica MWh.",
      "totalInstrumentos": 7,
      "totalTermos": 58,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Ordem de mérito como formador de preço",
          "tema": "Formação de preço",
          "sinopse": "Você já sabe que as usinas entram por ordem de custo variável. A pergunta desta aula é outra: uma vez montada a fila, qual preço ela produz — e para quem esse preço vale."
        },
        {
          "numero": 2,
          "titulo": "PLD: o preço do curto prazo",
          "tema": "Curto prazo",
          "sinopse": "O PLD é o número mais citado e mais mal-usado do setor elétrico brasileiro. Ele não é o preço da energia. Ele é o preço de uma diferença."
        },
        {
          "numero": 3,
          "titulo": "Energia × capacidade e o missing money",
          "tema": "Desenho de mercado",
          "sinopse": "A pergunta que fecha o Módulo 03 tem resposta aqui: se o LCOE da solar é menor que o do gás, por que o gás roda? Porque LCOE e disponibilidade medem coisas diferentes — e o mercado paga separado por cada uma. Ou deveria."
        },
        {
          "numero": 4,
          "titulo": "Leilões: como o regulador descobre o preço",
          "tema": "Descoberta de preço",
          "sinopse": "Num mercado onde o comprador é uma distribuidora regulada obrigada a contratar, ninguém pode simplesmente negociar. O leilão é o instrumento que substitui a negociação bilateral por competição pública — e o preço que sai dele vira referência para todo mundo."
        },
        {
          "numero": 5,
          "titulo": "PPA: onde mora a economia real",
          "tema": "Longo prazo",
          "sinopse": "Um PPA é apresentado como um preço. Ele é, na verdade, uma alocação de riscos entre duas partes, em que o preço é apenas a cláusula que todo mundo lê. As outras doze é que decidem se o contrato foi bom."
        },
        {
          "numero": 6,
          "titulo": "Hedge: travando exposição ao PLD",
          "tema": "Gestão de risco",
          "sinopse": "Hedge não é uma aposta de que o preço vai subir. É a decisão consciente de abrir mão do cenário bom para eliminar o cenário ruim. Quem confunde as duas coisas acaba explicando prejuízo para o conselho."
        },
        {
          "numero": 7,
          "titulo": "Portfólio de contratação",
          "tema": "Síntese",
          "sinopse": "Nenhuma empresa madura decide \"spot ou contrato\". Ela decide quanto de cada um, em quais prazos, sob qual política escrita — e revisa isso periodicamente. Comprar energia é gerir uma carteira, não fechar uma compra."
        }
      ]
    },
    {
      "id": "modulo-05",
      "codigo": "M05",
      "numero": 5,
      "trilhaId": "trilha-fundamentos-universais",
      "titulo": "Regulação e Desenho de Mercados",
      "tese": "O desenho do setor elétrico não escolhe entre mercado e Estado.",
      "totalInstrumentos": 6,
      "totalTermos": 72,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Por que regulado",
          "tema": null,
          "sinopse": null
        },
        {
          "numero": 2,
          "titulo": "Unbundling",
          "tema": null,
          "sinopse": null
        },
        {
          "numero": 3,
          "titulo": "Pool e bilateral",
          "tema": null,
          "sinopse": null
        },
        {
          "numero": 4,
          "titulo": "Captura regulatória",
          "tema": null,
          "sinopse": null
        },
        {
          "numero": 5,
          "titulo": "Revisão tarifária",
          "tema": null,
          "sinopse": null
        },
        {
          "numero": 6,
          "titulo": "Desenho de mercado comparado",
          "tema": null,
          "sinopse": null
        }
      ]
    },
    {
      "id": "modulo-06",
      "codigo": "M06",
      "numero": 6,
      "trilhaId": "trilha-setor-eletrico-brasileiro",
      "titulo": "História do Setor Elétrico Brasileiro",
      "tese": "Toda estrutura de hoje tem uma data e uma causa.",
      "totalInstrumentos": 8,
      "totalTermos": 99,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Antes do Estado",
          "tema": null,
          "sinopse": "O setor elétrico brasileiro nasceu privado, urbano, estrangeiro e fragmentado. Quem começa a estudar o setor pelo desenho atual tem a intuição invertida: acha que o Estado sempre esteve lá e que a abertura é a novidade. É o contrário. A presença do Estado é que é a novidade — ela começa em 1934, mais de meio século depois da primeira lâmpada."
        },
        {
          "numero": 2,
          "titulo": "O Estado dono de tudo",
          "tema": null,
          "sinopse": "Meio século em que o Brasil construiu o esqueleto físico que ainda usa. Nenhuma das grandes hidrelétricas do país, nenhuma das grandes linhas de transmissão, nenhum dos centros de operação regional é obra do mercado — todos são obra de empresa estatal financiada por imposto, empréstimo compulsório e dívida externa. Entender esse período é entender por que o setor tem a musculatura que tem, e por que ele saiu dos anos 1980 falido."
        },
        {
          "numero": 3,
          "titulo": "A reforma inacabada e o trauma fundador",
          "tema": null,
          "sinopse": "Esta é a aula central do bloco. Tudo que veio antes explica como o Brasil chegou aqui; tudo que veio depois é resposta ao que aconteceu aqui. E o resumo que circula — \"privatizaram e faltou luz\" — é curto demais para ser útil e errado o bastante para custar credibilidade em qualquer conversa técnica. A história real é mais interessante e muito mais instrutiva."
        },
        {
          "numero": 4,
          "titulo": "A reconstrução deliberada",
          "tema": null,
          "sinopse": "O Novo Modelo de 2004 é o marco que ainda rege o setor, e é sistematicamente mal contado. Não foi reestatização, não foi fechamento do mercado livre e não foi ruptura com a reforma dos anos 1990. Foi uma reforma da reforma: manteve tudo que a década anterior tinha criado de competitivo e recolocou no lugar exatamente aquilo cuja ausência tinha custado o racionamento — um dono para a pergunta \"quem garante que a expansão aconteça\"."
        },
        {
          "numero": 5,
          "titulo": "O modelo é testado de novo",
          "tema": null,
          "sinopse": "Uma década que o setor levou para aprender uma frase: risco mal alocado não desaparece — ele muda de forma. Vira dívida, vira encargo, vira bandeira na conta, vira liminar. A década de 2010 é o laboratório dessa lei, e é também onde nasce quase toda a agenda regulatória que ainda está aberta hoje."
        },
        {
          "numero": 6,
          "titulo": "Onde a história pousa hoje",
          "tema": null,
          "sinopse": "Esta aula fecha o arco e faz a única coisa que o resto do bloco não podia fazer: colocar a GridAlpha dentro da história. O que a sequência de cento e cinquenta anos mostra não é que o setor esteja indo para algum lugar definitivo — é que ele nunca foi. E é exatamente daí que sai o argumento de independência, que é histórico antes de ser comercial."
        }
      ]
    },
    {
      "id": "modulo-07",
      "codigo": "M07",
      "numero": 7,
      "trilhaId": "trilha-setor-eletrico-brasileiro",
      "titulo": "Estrutura Institucional do Setor Elétrico Brasileiro",
      "tese": "O setor elétrico brasileiro não tem um chefe.",
      "totalInstrumentos": 10,
      "totalTermos": 118,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Onde a diretriz nasce",
          "tema": "Política · MME e CNPE",
          "sinopse": "Política escolhe direção. Regulação transforma direção em regra aplicável. São camadas diferentes, com instrumentos diferentes, prazos diferentes e efeitos diferentes — e confundir as duas é a origem de metade dos erros de leitura do setor."
        },
        {
          "numero": 2,
          "titulo": "Indicativo, não determinativo",
          "tema": "Planejamento · EPE",
          "sinopse": "Duas palavras que parecem detalhe de vocabulário e que definem a instituição inteira. Um plano indicativo aponta necessidade e alternativa; ele não autoriza, não obriga e não contrata. Quem lê o plano decenal como lista de obras aprovadas está a um passo de errar uma decisão de investimento."
        },
        {
          "numero": 3,
          "titulo": "A agência é um processo antes de ser uma decisão",
          "tema": "Regulação · ANEEL por dentro",
          "sinopse": "Esta é a aula mais densa do módulo, e a razão é aritmética: a agência é a instituição que aparece no cotidiano de praticamente todo agente do setor. Tarifa e qualidade para o consumidor. Autorização e fiscalização para o gerador. Receita e disponibilidade para o transmissor. Metas e revisão para o distribuidor. Regras e garantias para o comercializador. Conexão e acesso para qualquer projeto novo."
        },
        {
          "numero": 4,
          "titulo": "Uma entidade privada com função pública",
          "tema": "Operação · ONS",
          "sinopse": "O operador é a instituição do setor cuja natureza jurídica mais surpreende quem chega de fora: não é órgão público, não é empresa estatal e não é agência. É associação civil de direito privado, sem fins lucrativos, mantida pelos próprios agentes — e é ela que decide, hora a hora, quais usinas geram no país inteiro."
        },
        {
          "numero": 5,
          "titulo": "Onde o físico vira financeiro",
          "tema": "Liquidação · CCEE",
          "sinopse": "A câmara de comercialização é a instituição que resolve um problema criado pela arquitetura da operação: se o despacho é sistêmico e o contrato é bilateral, alguém precisa apurar a diferença entre o que foi contratado e o que foi medido — e transformar essa diferença em obrigação financeira exigível. Esse alguém não pode ser quem opera. Daí existirem duas entidades e não uma."
        },
        {
          "numero": 6,
          "titulo": "Os órgãos que não aparecem no organograma e travam projeto",
          "tema": "Monitoramento e periferia",
          "sinopse": "Sete atores fora do núcleo setorial clássico. Dois deles — o comitê de monitoramento e o conselho de defesa da concorrência — estão na frase para decorar. Os outros cinco não estão em lugar nenhum do vocabulário de quem começa, e são justamente os que decidem coisas que param cronograma, travam financiamento e adiam entrada em operação."
        },
        {
          "numero": 7,
          "titulo": "A decisão real atravessa quatro órgãos",
          "tema": "Síntese · onde a frase não se sustenta",
          "sinopse": "A frase para decorar é uma âncora, não uma descrição completa. Quem só sabe a frase trava na primeira pergunta de segunda ordem — e as perguntas de segunda ordem são exatamente as que um decisor cético faz. Esta aula mostra as costuras, segue um ato do início ao fim e entrega as três ferramentas que convertem o mapa em uso."
        }
      ]
    },
    {
      "id": "modulo-08",
      "codigo": "M08",
      "numero": 8,
      "trilhaId": "trilha-setor-eletrico-brasileiro",
      "titulo": "Matriz Elétrica Brasileira em Profundidade",
      "tese": "Não existe a matriz elétrica brasileira.",
      "totalInstrumentos": 11,
      "totalTermos": 124,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Seis pizzas para a mesma pergunta",
          "tema": "Os três eixos · a aula que vem antes de qualquer número",
          "sinopse": null
        },
        {
          "numero": 2,
          "titulo": "Seis fontes, dois rankings, uma troca que explica tudo",
          "tema": "A matriz por fonte · quanto, onde, e por que a ordem muda",
          "sinopse": null
        },
        {
          "numero": 3,
          "titulo": "A matriz muda de forma três vezes: no ano, no dia e na hora",
          "tema": "Sazonalidade e complementaridade · três escalas de tempo",
          "sinopse": null
        },
        {
          "numero": 4,
          "titulo": "O maior sistema de armazenamento de energia do mundo não tem uma bateria",
          "tema": "Hidro-dependência · a mesma característica é vantagem e vulnerabilidade",
          "sinopse": null
        },
        {
          "numero": 5,
          "titulo": "O recurso está a dois mil quilômetros da carga",
          "tema": "Transmissão e gargalos · onde a energia trava",
          "sinopse": null
        },
        {
          "numero": 6,
          "titulo": "Dois casos, um decreto, desfechos opostos",
          "tema": "Distribuição e consumo · a concessão como ativo com prazo",
          "sinopse": null
        },
        {
          "numero": 7,
          "titulo": "Três forças, e o que cada uma já mudou de forma mensurável",
          "tema": "Síntese · a matriz é fluxo, não foto",
          "sinopse": null
        }
      ]
    },
    {
      "id": "modulo-09",
      "codigo": "M09",
      "numero": 9,
      "trilhaId": "trilha-setor-eletrico-brasileiro",
      "titulo": "Os Mercados ACR e ACL em Profundidade",
      "tese": "A comparação entre os dois nunca é uma comparação de preço.",
      "totalInstrumentos": 11,
      "totalTermos": 136,
      "aulas": [
        {
          "numero": 1,
          "titulo": "O que muda e o que não muda quando se migra",
          "tema": "Os quatro eixos",
          "sinopse": "Toda conversa sobre economia que aconteça antes de o interlocutor saber exatamente o que muda de fornecedor, o que muda de mecanismo e o que permanece devido de qualquer forma é uma conversa sem denominador. Esta aula existe para impedir todas as conclusões erradas das aulas seguintes."
        },
        {
          "numero": 2,
          "titulo": "O regulado por dentro: como a carteira é montada e como o resultado chega",
          "tema": "Ambiente regulado",
          "sinopse": "A distribuidora não compra energia todo mês. Ela monta uma carteira com anos de antecedência, erra a previsão como todo mundo erra, e o erro chega ao consumidor por caminhos que têm nome, norma e defasagem. Entender esses caminhos é entender o que exatamente se está deixando para trás."
        },
        {
          "numero": 3,
          "titulo": "O livre por dentro: quem pode, quando, por qual porta e sob qual obrigação",
          "tema": "Ambiente livre",
          "sinopse": "Elegibilidade não é prontidão, cronograma legal não é data de abertura, e representação não é transferência de risco econômico. Três distinções que separam quem entende o mercado livre de quem repete o que ouviu numa apresentação comercial."
        },
        {
          "numero": 4,
          "titulo": "O contrato é um sistema de alocação de risco. O preço é uma cláusula entre onze.",
          "tema": "Anatomia do contrato",
          "sinopse": "Ler um contrato de energia por preço é como avaliar um seguro pelo valor da parcela. As dez outras cláusulas decidem o que acontece quando a realidade diverge da premissa — e a realidade sempre diverge."
        },
        {
          "numero": 5,
          "titulo": "Os riscos, um a um: quem carrega, o que dispara, o que mitiga e o que sobra descoberto",
          "tema": "Risco",
          "sinopse": "Uma lista de riscos é inútil. O que decide é a matriz: cada estrutura de contrato aloca cada classe de risco de um jeito, e a única leitura que importa é a da célula específica em que a sua empresa está."
        },
        {
          "numero": 6,
          "titulo": "O preço que liquida a diferença — e por que a variável é a exposição, não o preço",
          "tema": "Preço de curto prazo",
          "sinopse": "O Módulo 04 ensinou como o preço se forma. Esta aula é sobre outra coisa: o que ele faz com o caixa de uma indústria. Ele não é a tarifa dela, não é o preço do contrato dela e não é uma previsão. É o número que valora aquilo que ela errou."
        },
        {
          "numero": 7,
          "titulo": "Realocação e fator de ajuste: por que uma indústria que não gera precisa entender isto",
          "tema": "Realocação e fator de ajuste",
          "sinopse": "O mecanismo compartilha risco hidrológico entre hidrelétricas, e nenhuma indústria participa dele. Mesmo assim, ele aparece no preço do contrato que ela assina, na bandeira que ela paga se for cativa e na exposição que ela carrega se for livre. É um risco de terceiros que chega por três portas."
        },
        {
          "numero": 8,
          "titulo": "Quando vale, quando não vale e quando não dá para dizer",
          "tema": "Síntese",
          "sinopse": "As três saídas têm o mesmo status técnico. A terceira é a mais frequente na realidade e a mais rara nas apresentações — e essa discrepância é, ela própria, um dado sobre o mercado."
        }
      ]
    },
    {
      "id": "modulo-10",
      "codigo": "M10",
      "numero": 10,
      "trilhaId": "trilha-setor-eletrico-brasileiro",
      "titulo": "Tarifas e a Conta de Luz Industrial",
      "tese": "A fatura industrial é composta por quatro eixos de controle.",
      "totalInstrumentos": 11,
      "totalTermos": 161,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Os quatro eixos de controle",
          "tema": "Fundamento",
          "sinopse": "Esta é a aula que impede todas as promessas erradas posteriores. Ela não ensina nenhum mecanismo tarifário novo; ensina uma classificação. E é a classificação que determina, para cada linha de qualquer fatura, se existe alavanca, de que natureza é a alavanca, e quanto tempo ela leva para produzir efeito."
        },
        {
          "numero": 2,
          "titulo": "Grupos, subgrupos e modalidades",
          "tema": "Enquadramento",
          "sinopse": "O primeiro campo de qualquer análise não é um valor: é uma classificação. Se o grupo, o subgrupo e a modalidade estiverem lidos errado, toda a aritmética a jusante está errada, e nenhuma conferência de tarifa faz sentido. Esta aula ensina o mapa completo, o que efetivamente subsiste como opção hoje, o que sobrevive apenas como situação específica, e como se descobre — na própria fatura — em qual célula do mapa a unidade está."
        },
        {
          "numero": 3,
          "titulo": "Demanda contratada: o custo de errar para cada lado",
          "tema": "Demanda",
          "sinopse": "A demanda contratada é a decisão do Eixo 1 com maior efeito financeiro imediato e a que mais frequentemente carrega uma escolha de uma década atrás. Ela também é a única linha da fatura em que errar em qualquer direção custa dinheiro: contratar demais gera pagamento recorrente por capacidade ociosa; contratar de menos expõe à parcela de ultrapassagem e pode comprometer a operação."
        },
        {
          "numero": 4,
          "titulo": "Como a mesma energia custa diferente conforme a hora",
          "tema": "Postos horários",
          "sinopse": "Um megawatt-hora consumido às onze da manhã e um megawatt-hora consumido às sete da noite são fisicamente idênticos e economicamente distintos. A diferença é regulatória e existe por uma razão de engenharia: a rede é dimensionada para o pico, e quem consome no pico impõe custo de capacidade a todos os demais. Esta aula ensina como esse sinal é construído, onde ele erra, e o que uma planta industrial pode e não pode deslocar."
        },
        {
          "numero": 5,
          "titulo": "Fator de potência e excedente reativo",
          "tema": "Reativo",
          "sinopse": "O Módulo 01 ensinou o triângulo de potência, a diferença entre potência ativa, reativa e aparente, e por que carga indutiva exige reativo. Esta aula não volta lá. Ela ensina outra coisa: como o excedente é medido, em que janelas é apurado, sob que nomenclatura é cobrado, e o que na fatura distingue um problema estrutural de um problema pontual — que é a diferença entre um projeto necessário e um investimento desnecessário."
        },
        {
          "numero": 6,
          "titulo": "Encargos setoriais, um a um",
          "tema": "Encargos",
          "sinopse": "Encargo não é tarifa e não é tributo. É um custo coletivo do sistema, instituído por lei, rateado por metodologia regulada e cobrado dentro da estrutura tarifária. A distinção importa comercialmente: eficiência energética reduz a quantidade sobre a qual o encargo incide, mas ninguém negocia a quota unitária de um encargo com a distribuidora — e uma recomendação que sugere o contrário revela desconhecimento da natureza do item."
        },
        {
          "numero": 7,
          "titulo": "Tributos e a transição em curso",
          "tema": "Tributos",
          "sinopse": "Esta aula tem uma fronteira estrita e ela é declarada de saída: a matéria tributária entra aqui apenas na medida em que altera a base sobre a qual o consumidor industrial paga. Não há doutrina, não há estratégia de contencioso, não há juízo sobre quem tem razão. Há mecanismo, posições dos envolvidos, estado de vigência e o que isso muda numa linha de fatura. Toda decisão tributária concreta exige validação contábil e jurídica própria."
        },
        {
          "numero": 8,
          "titulo": "O ciclo que produz o número",
          "tema": "Ciclo",
          "sinopse": "O Módulo 07 ensinou o rito institucional: quem homologa, em que cadência, sob qual instrumento. Esta aula não repete isso. Ela pergunta outra coisa: o que acontece com o custo de uma indústria quando o resultado do ciclo é publicado, e por que a mesma unidade paga valores diferentes por unidade de energia em meses diferentes sem ter mudado absolutamente nada dentro da planta."
        },
        {
          "numero": 9,
          "titulo": "A ordem de leitura em cinco minutos",
          "tema": "Síntese",
          "sinopse": "Todas as aulas anteriores existem para tornar esta possível. O critério de domínio deste bloco é cronometrado, e cinco minutos é pouco tempo para um documento de quarenta linhas. O que cabe em cinco minutos não é ler tudo: é executar uma sequência em que cada passo pode encerrar a análise ou determinar o passo seguinte. Esta aula ensina a sequência, o critério de parada de cada passo, e a saída mais frequente de todas — a que diz que ainda não é possível concluir."
        }
      ]
    },
    {
      "id": "modulo-11",
      "codigo": "M11",
      "numero": 11,
      "trilhaId": "trilha-setor-eletrico-brasileiro",
      "titulo": "Geração Distribuída e a Anatomia de uma Proposta Solar",
      "tese": "A proposta solar não é um orçamento.",
      "totalInstrumentos": 11,
      "totalTermos": 150,
      "aulas": [
        {
          "numero": 1,
          "titulo": "A aula que impede toda promessa de retorno prematura",
          "tema": "Os quatro eixos",
          "sinopse": null
        },
        {
          "numero": 2,
          "titulo": "De 2012 a 2025: seis instrumentos, duas pendências e duas fronteiras",
          "tema": "Marco regulatório",
          "sinopse": null
        },
        {
          "numero": 3,
          "titulo": "Dois limiares, quatro modalidades, e o que a proposta precisa provar",
          "tema": "Porte e modalidades",
          "sinopse": null
        },
        {
          "numero": 4,
          "titulo": "GD I, GD II, GD III — e o ano em que a regra ainda não existe",
          "tema": "Regimes e cronograma",
          "sinopse": null
        },
        {
          "numero": 5,
          "titulo": "Irradiância, geração estimada, degradação e certificação",
          "tema": "Premissa técnica",
          "sinopse": null
        },
        {
          "numero": 6,
          "titulo": "Trajetória tarifária, operação e manutenção, e o crédito que expira",
          "tema": "Premissa financeira",
          "sinopse": null
        },
        {
          "numero": 7,
          "titulo": "O que fica sem resposta se o equipamento falhar — e como se perde o regime",
          "tema": "Contrato e enquadramento",
          "sinopse": null
        },
        {
          "numero": 8,
          "titulo": "Trinta minutos, duas trilhas, três vereditos",
          "tema": "Síntese",
          "sinopse": null
        }
      ]
    },
    {
      "id": "modulo-12",
      "codigo": "M12",
      "numero": 12,
      "trilhaId": "trilha-setor-eletrico-brasileiro",
      "titulo": "Geopolítica Energética do Brasil",
      "tese": "O Brasil não escolheu entre ser potência renovável e potência fóssil.",
      "totalInstrumentos": 11,
      "totalTermos": 152,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Oitenta e sete por cento de quê, exatamente",
          "tema": "O paradoxo",
          "sinopse": "A frase mais repetida sobre energia no Brasil é também a mais mal citada. \"O Brasil tem quase noventa por cento de energia renovável\" é verdadeira e falsa ao mesmo tempo, e o que decide qual das duas é a palavra que quase nunca vem junto: se a grandeza é matriz elétrica ou matriz energética. São duas contas diferentes, com dois denominadores diferentes, e a diferença entre elas é de quase quarenta pontos percentuais — grande o bastante para inverter completamente a conclusão de uma conversa."
        },
        {
          "numero": 2,
          "titulo": "O que foi decidido, o que ficou de fora, e por que a distinção é o conteúdo",
          "tema": "COP30 e o ciclo climático",
          "sinopse": "A COP30 aconteceu. Isso precisa ser dito de saída porque boa parte do material disponível sobre geopolítica energética brasileira ainda foi escrito quando ela era evento futuro, e trata a conferência como algo a se preparar em vez de resultado a relatar. Ela ocorreu em Belém, de 10 a 22 de novembro de 2025, e produziu um resultado formal que precisa ser contado com as duas metades: o que entrou no consenso e o que não entrou."
        },
        {
          "numero": 3,
          "titulo": "Complementaridade forte, concentração alta, e a diferença entre as duas",
          "tema": "China",
          "sinopse": "A relação energética entre Brasil e China é a mais densa que o país mantém, e a mais fácil de descrever mal. Descrevê-la como ameaça é ignorar que ela financiou expansão de infraestrutura que ninguém mais quis financiar e barateou equipamento que viabilizou o boom solar do Módulo 11. Descrevê-la como parceria sem atrito é ignorar que ela concentra, em um único país, simultaneamente o comprador de commodity, o fornecedor de equipamento e o investidor de infraestrutura. A leitura correta separa complementaridade de concentração — são coisas diferentes, e só a segunda é risco."
        },
        {
          "numero": 4,
          "titulo": "Duas políticas simultâneas que puxam em direções opostas",
          "tema": "Estados Unidos",
          "sinopse": "A relação energética com os Estados Unidos é, em 2026, o objeto mais rápido de mudar em todo este currículo — mais rápido que qualquer cronograma regulatório brasileiro, que muda uma vez por ano. Ela mudou de configuração pelo menos quatro vezes entre julho de 2025 e julho de 2026, e é razoável esperar que mude de novo antes de você terminar de ler esta aula. Por isso, a aula ensina mecanismo e taxonomia de instrumento, que não envelhecem, e isola os valores pontuais em callout datado."
        },
        {
          "numero": 5,
          "titulo": "Quando a regra é o produto de exportação",
          "tema": "Europa e capital multilateral",
          "sinopse": "A União Europeia se relaciona com o Brasil em energia por três canais simultâneos — comprador, financiador e regulador — e o terceiro é o mais subestimado. A Europa exporta padrão. Regra de carbono na fronteira, exigência de rastreabilidade de desmatamento, critério de certificação de hidrogênio, diligência de cadeia de suprimento: são normas europeias que produzem efeito sobre a operação de uma indústria brasileira que nunca pisou na Europa. Entender isso muda a natureza da conversa: com a Europa, o item negociado não é preço, é metodologia."
        },
        {
          "numero": 6,
          "titulo": "Duas leis sancionadas, um regime que ainda não opera",
          "tema": "Hidrogênio de baixa emissão",
          "sinopse": "O hidrogênio é o tema deste bloco em que a distinção entre lei existente e regime operacional existente tem consequência financeira imediata e mensurável. O Brasil tem, desde 2024, dois marcos legais sancionados que criam política, sistema de certificação, regime de incentivo e programa de crédito fiscal bilionário. Nenhum deles opera plenamente sem decreto regulamentador. Na data de verificação deste módulo, esse decreto ainda não havia sido publicado — dois anos depois da primeira lei, e mais de oito meses depois de o governo anunciar que a assinatura ocorreria \"na próxima semana\"."
        },
        {
          "numero": 7,
          "titulo": "Vinte e cinco por cento da reserva, menos de um por cento da produção",
          "tema": "Minerais críticos e estratégicos",
          "sinopse": "Esta aula contém o paradoxo deste bloco em miniatura, e por isso ela fecha a sequência temática. O Brasil detém uma das maiores dotações mundiais de minerais considerados críticos para a transição energética e responde por uma fração desprezível da produção mundial deles. A distância entre esses dois números não é um detalhe de execução — é a definição operacional do vetor cadeia de valor, e é o que o país está tentando fechar com uma política que, na data de verificação, ainda não é lei."
        },
        {
          "numero": 8,
          "titulo": "Os trinta minutos: oito movimentos, nenhum argumento repetido",
          "tema": "Síntese",
          "sinopse": "As sete aulas anteriores entregaram material. Esta entrega ordem. A diferença entre saber os fatos e sustentar meia hora de conversa não está na quantidade de informação — está em ter uma sequência de movimentos em que cada um responde a uma pergunta diferente e prepara o seguinte, de modo que nunca seja necessário voltar ao mesmo ponto duas vezes. Antes do andaime, porém, duas ferramentas de higiene: uma sobre que nomes podem entrar num ativo publicado, e outra sobre a favor de quem cada narrativa geopolítica foi construída."
        }
      ]
    },
    {
      "id": "modulo-13",
      "codigo": "M13",
      "numero": 13,
      "trilhaId": "trilha-especializacao-estrategica",
      "titulo": "Análise Financeira de Empresas e Projetos",
      "tese": "Nenhum múltiplo se lê sozinho.",
      "totalInstrumentos": 11,
      "totalTermos": 180,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Por que EV/EBITDA e não P/E — e por que alavancagem infla os dois por razões opostas",
          "tema": null,
          "sinopse": "A resposta curta que circula é que EV/EBITDA \"é melhor para utilities porque neutraliza a estrutura de capital\". Está certa e é insuficiente, porque não explica o que acontece quando a estrutura de capital é justamente o fato mais importante da empresa — que é o caso de pelo menos três companhias deste rol na data de verificação."
        },
        {
          "numero": 2,
          "titulo": "O que acontece com um fluxo de caixa descontado quando o direito econômico tem data para acabar",
          "tema": null,
          "sinopse": "Um DCF padrão de empresa aberta é composto por duas partes: os fluxos do período explícito e um valor terminal que representa tudo depois. Em companhias comuns, o terminal costuma responder por mais da metade do valor — às vezes por dois terços. Em concessão com prazo definido, essa arquitetura simplesmente não se aplica, e insistir nela é o erro de valuation mais caro do setor."
        },
        {
          "numero": 3,
          "titulo": "Trinta minutos no release, sessenta no Formulário de Referência, e a pergunta que só a segunda leitura permite",
          "tema": null,
          "sinopse": "O critério de domínio deste bloco é cronometrado por uma razão: em situação real, ninguém tem uma semana. A diferença entre quem produz três teses defensáveis em uma hora e quem produz uma opinião em três dias não é velocidade de leitura — é ordem de leitura, e saber de antemão qual pergunta cada seção do documento responde."
        },
        {
          "numero": 4,
          "titulo": "Participação econômica não é poder de voto — e no Brasil elas divergem com frequência",
          "tema": null,
          "sinopse": "Existe uma frase que aparece em quase todo material de imprensa sobre operação societária e que está errada com uma frequência desconfortável: \"a empresa X comprou 68% da empresa Y e passou a controlá-la\". Comprar 68% do capital total e comprar o controle são coisas diferentes sempre que houver ação preferencial, acordo de acionistas ou limitação estatutária de voto — e há pelo menos três casos assim no rol deste módulo."
        },
        {
          "numero": 5,
          "titulo": "A dívida que o projeto paga sozinho — e a métrica que decide quanto dela cabe",
          "tema": null,
          "sinopse": "Project finance não é \"financiamento de projeto\" no sentido genérico. É uma arquitetura jurídica e financeira específica em que a capacidade de pagamento está principalmente no próprio ativo, o devedor é uma sociedade criada só para isso, e o recurso aos patrocinadores é limitado ou condicionado. A pergunta que organiza a estrutura inteira não é \"qual o retorno\" — é quanto de dívida este fluxo suporta sem quebrar."
        },
        {
          "numero": 6,
          "titulo": "Oito categorias de risco, e a que o currículo não nomeia",
          "tema": null,
          "sinopse": "O currículo lista cinco riscos específicos do setor: hidrológico, regulatório, cambial, de descasamento de indexador e operacional, mais a dimensão socioambiental e de governança. A lista está certa e está incompleta para 2026, porque omite exatamente a categoria que dominou o setor entre outubro de 2025 e julho de 2026 — risco de crédito e de estrutura de capital. Dois casos deste rol tornam a omissão impossível de sustentar."
        },
        {
          "numero": 7,
          "titulo": "Seis fichas, um arquétipo cada, e um campo deixado deliberadamente em branco",
          "tema": null,
          "sinopse": "O currículo pede ficha de uma página por empresa. Dez fichas estruturalmente idênticas não ensinariam mais que seis: a partir da sexta, o que se aprende é a repetir o formato, não a lê-lo. A decisão de escopo deste módulo é seis fichas completas — uma por arquétipo de controle — mais um instrumento comparativo que cobre as quatro restantes por indicador. As seis foram escolhidas para que cada arquétipo apareça exatamente uma vez."
        },
        {
          "numero": 8,
          "titulo": "O andaime: três teses, três riscos, três lacunas — em uma hora, com âncora e contraponto",
          "tema": null,
          "sinopse": "Tudo antes desta aula foi preparação. O critério de domínio deste bloco não é saber o que é EV/EBITDA nem reconhecer um arquétipo de controle: é produzir nove itens estruturados a partir de um documento real, cronometrado. Esta aula é o instrumento que constrói exatamente essa saída, e o resto do módulo existe para alimentá-la."
        }
      ]
    },
    {
      "id": "modulo-14",
      "codigo": "M14",
      "numero": 14,
      "trilhaId": "trilha-especializacao-estrategica",
      "titulo": "Biocombustíveis e Bioenergia",
      "tese": "A mesma tonelada vira quatro produtos.",
      "totalInstrumentos": 10,
      "totalTermos": 158,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Dois produtos da mesma destilaria, dois mercados que não se parecem em nada",
          "tema": "Etanol hidratado e etanol anidro",
          "sinopse": null
        },
        {
          "numero": 2,
          "titulo": "A arbitragem que a planta faz todo dia, e a restrição que o preço relativo não mostra",
          "tema": "O mix açúcar-etanol",
          "sinopse": null
        },
        {
          "numero": 3,
          "titulo": "Uma rota que não tem safra do mesmo jeito, e outra que come o insumo da própria caldeira",
          "tema": "Rotas alternativas de etanol",
          "sinopse": null
        },
        {
          "numero": 4,
          "titulo": "Como um percentual fixado por resolução cria um mercado inteiro — e quem paga por ele",
          "tema": "Biodiesel e a política de conteúdo obrigatório",
          "sinopse": null
        },
        {
          "numero": 5,
          "titulo": "Três números para a mesma planta, e por que meio ano de entrega é complementaridade",
          "tema": "Bagaço, cogeração e a sazonalidade",
          "sinopse": null
        },
        {
          "numero": 6,
          "titulo": "O resíduo como insumo, e uma economia que é de logística e de escala mínima",
          "tema": "Biogás e biometano",
          "sinopse": null
        },
        {
          "numero": 7,
          "titulo": "O produto que não é físico: quem tem obrigação, como o preço se forma, e por que ele não pode ser cravado",
          "tema": "RenovaBio e o crédito de descarbonização",
          "sinopse": null
        },
        {
          "numero": 8,
          "titulo": "Seis fichas de campo fixo, e um campo deixado deliberadamente em branco",
          "tema": "Síntese — ler uma cadeia",
          "sinopse": null
        }
      ]
    },
    {
      "id": "modulo-15",
      "codigo": "M15",
      "numero": 15,
      "trilhaId": "trilha-especializacao-estrategica",
      "titulo": "Petróleo, Gás e Petrobras",
      "tese": "Todo número pertence a um regime e a uma camada.",
      "totalInstrumentos": 10,
      "totalTermos": 174,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Três regimes, um subsolo: quem é dono da molécula",
          "tema": "Lente de Regime",
          "sinopse": null
        },
        {
          "numero": 2,
          "titulo": "Recurso, reserva e produção: três grandezas, e a maior é sempre a citada",
          "tema": "Lente de Regime",
          "sinopse": null
        },
        {
          "numero": 3,
          "titulo": "A parcela do Estado: royalty não é participação especial, e nenhum dos dois é imposto",
          "tema": "Lente de Regime",
          "sinopse": null
        },
        {
          "numero": 4,
          "titulo": "\"Preço do petróleo\" não é um preço: seis camadas entre o reservatório e a bomba",
          "tema": "Lente de Camada",
          "sinopse": null
        },
        {
          "numero": 5,
          "titulo": "Refino: por que o país exporta petróleo e importa derivado ao mesmo tempo",
          "tema": "Lente de Camada",
          "sinopse": null
        },
        {
          "numero": 6,
          "titulo": "Gás natural: o preço quase nunca é preço de mercado",
          "tema": "Lente de Camada",
          "sinopse": null
        },
        {
          "numero": 7,
          "titulo": "GNL e o Novo Mercado de Gás: o que a reforma abriu e o que ainda depende de norma",
          "tema": "Lente de Camada",
          "sinopse": null
        },
        {
          "numero": 8,
          "titulo": "Do contrato de gás ao preço da eletricidade — e por que a térmica despacha sem sinal econômico",
          "tema": "Lente de Acoplamento Elétrico",
          "sinopse": null
        },
        {
          "numero": 9,
          "titulo": "Ler um número ponta a ponta, e o dilema apresentado pelos dois lados",
          "tema": "Síntese",
          "sinopse": null
        }
      ]
    },
    {
      "id": "modulo-16",
      "codigo": "M16",
      "numero": 16,
      "trilhaId": "trilha-especializacao-estrategica",
      "titulo": "Tendências e Disrupções",
      "tese": "Toda tendência tem um estágio e um gargalo.",
      "totalInstrumentos": 11,
      "totalTermos": 184,
      "aulas": [
        {
          "numero": 1,
          "titulo": "Cinco posições, e a evidência que cada uma exige",
          "tema": "Lente de Estágio",
          "sinopse": null
        },
        {
          "numero": 2,
          "titulo": "Cinco candidatos, e quase nunca é o primeiro",
          "tema": "Lente de Gargalo",
          "sinopse": null
        },
        {
          "numero": 3,
          "titulo": "Eletrificação de transporte: converter frota em MW",
          "tema": "Lente de Carga",
          "sinopse": null
        },
        {
          "numero": 4,
          "titulo": "Armazenamento: potência, energia e duração são três números",
          "tema": "Lente de Carga",
          "sinopse": null
        },
        {
          "numero": 5,
          "titulo": "Medição avançada: o que ela habilita, quem paga, e de quem é o dado",
          "tema": "Lente de Gargalo",
          "sinopse": null
        },
        {
          "numero": 6,
          "titulo": "Descentralização depois da geração distribuída",
          "tema": "Lente de Gargalo",
          "sinopse": null
        },
        {
          "numero": 7,
          "titulo": "Carbono: dois mercados sem relação de substituição",
          "tema": "Lente de Estágio",
          "sinopse": null
        },
        {
          "numero": 8,
          "titulo": "Centros de dados: os cinco números do mesmo empreendimento",
          "tema": "Lente de Carga",
          "sinopse": null
        },
        {
          "numero": 9,
          "titulo": "Inteligência artificial aplicada: separar previsão de decisão",
          "tema": "Lente de Gargalo",
          "sinopse": null
        },
        {
          "numero": 10,
          "titulo": "Mapear posicionamento sem emitir veredito sobre ninguém",
          "tema": "Síntese",
          "sinopse": null
        }
      ]
    },
    {
      "id": "modulo-17",
      "codigo": "M17",
      "numero": 17,
      "trilhaId": "trilha-especializacao-estrategica",
      "titulo": "Cenário Internacional Comparativo",
      "tese": "Nenhum número de um mercado é comparável ao de outro.",
      "totalInstrumentos": 12,
      "totalTermos": 192,
      "aulas": [
        {
          "numero": 1,
          "titulo": "As sete declarações que precedem qualquer comparação de preço",
          "tema": "Perímetro",
          "sinopse": "Quando alguém diz que a energia é mais barata em outro lugar, o instinto é perguntar pelo câmbio. É o instinto errado, e ele é errado com uma frequência que surpreende: na maioria esmagadora dos casos, a conversão de moeda é o menor dos sete problemas, e às vezes é o único que está correto."
        },
        {
          "numero": 2,
          "titulo": "Dotação, desenho e política: a diferença que sobreviveu ao perímetro",
          "tema": "Atribuição",
          "sinopse": "Suponha que as sete declarações foram feitas e a diferença permaneceu. Agora existe uma pergunta legítima: por quê? A resposta quase nunca é mérito, e o erro que gera toda recomendação ruim de importação de modelo é atribuir a diferença à parcela errada."
        },
        {
          "numero": 3,
          "titulo": "Por custo declarado ou por oferta; nodal, zonal ou uniforme",
          "tema": "Desenho de despacho",
          "sinopse": "O Módulo 04 ensinou formação de preço marginal e o Módulo 09 ensinou o despacho centralizado brasileiro. Nenhum dos dois se reabre aqui. O que é novo é que aquelas escolhas são variantes de desenho, que outras jurisdições fizeram de outro modo, e que cada variante entrega uma coisa e custa outra."
        },
        {
          "numero": 4,
          "titulo": "Mercado de capacidade é um produto, não uma quantidade",
          "tema": "Disponibilidade",
          "sinopse": "Esta é a pior colisão semântica do currículo, e ela é de outra natureza que as demais. “Capacidade” já colidia em quatro sentidos no Módulo 16 — instalada, de armazenamento, de transporte, de processamento. Todos os quatro são quantidades que se medem. O quinto sentido é um mecanismo de remuneração que se compra, e a confusão entre ele e os outros quatro produz duas frases erradas em direções opostas."
        },
        {
          "numero": 5,
          "titulo": "Sete operadores, um país, e o experimento mais limpo do mundo",
          "tema": "Mercados organizados",
          "sinopse": "Não existe “o mercado americano”. Existe um regulador federal com jurisdição sobre o comércio atacadista interestadual e sobre tarifas de transmissão, seis operadores regionais sob essa jurisdição, um sétimo que opera quase inteiramente dentro de uma única fronteira estadual e responde à comissão de serviços públicos e à legislatura daquele estado, e um vasto território fora dos mercados organizados onde concessionárias verticalmente integradas continuam sendo a estrutura dominante."
        },
        {
          "numero": 6,
          "titulo": "A parcela de política, isolada no ambiente mais limpo possível",
          "tema": "Ciclo político",
          "sinopse": "Se você quer ver a parcela de política agir sozinha, precisa de um lugar onde a dotação e o desenho fiquem parados enquanto ela se move. Existe um: os mesmos mercados organizados da aula anterior, atravessados por uma mudança de orientação da política energética federal a partir de 2025. O desenho de mercado não mudou. A dotação não mudou. O custo de capital de projetos inteiros mudou."
        },
        {
          "numero": 7,
          "titulo": "O maior sistema do mundo em capacidade instalada, e o que isso não significa",
          "tema": "Escala e direcionamento",
          "sinopse": "O Módulo 12 já tratou a China pela ótica do poder — cadeia de suprimento, capital, disputa tecnológica entre potências. Aquele argumento não se reconta aqui. Nesta aula o objeto é outro: desenho de mercado e escala de sistema. Como se planeja, como se despacha, como se remunera, e o que significa, operacionalmente, ser o maior sistema do mundo em capacidade instalada."
        },
        {
          "numero": 8,
          "titulo": "Teto e comércio, tributo e fronteira são três mecanismos distintos",
          "tema": "Carbono comparado",
          "sinopse": "O Módulo 16 já tratou o sistema brasileiro de comércio de emissões, o escopo 2 e a régua de estágio. Nada disso se reabre. O objeto novo aqui é que existem três mecanismos diferentes de precificar carbono, que eles fazem coisas diferentes, e que o terceiro é o único que chega diretamente ao bolso de um exportador industrial brasileiro."
        },
        {
          "numero": 9,
          "titulo": "Quatro números diferentes recebem o mesmo nome",
          "tema": "Penetração",
          "sinopse": "“Eles têm 60% de renovável” é a segunda frase mais comum deste gênero e, como a primeira, ela não nomeia um objeto. Nomeia quatro, que diferem entre si por múltiplos, e o interlocutor escolheu — quase sempre sem má-fé e sem declarar — aquele que sustenta a sua tese."
        },
        {
          "numero": 10,
          "titulo": "Cinco casos que ensinam o que os grandes não ensinam",
          "tema": "Os outros mercados",
          "sinopse": "Os mercados grandes ensinam desenho. Os cinco desta aula ensinam o que acontece com o desenho quando uma das condições que o sustentam falha — e essa é a lição mais transferível de todas, porque no Brasil a condição que falha raramente é a mesma que falha lá."
        },
        {
          "numero": 11,
          "titulo": "O verificador aplicado, e o fechamento sem ranking",
          "tema": "Síntese",
          "sinopse": "As dez aulas anteriores construíram três lentes e uma disciplina. Esta aula as põe para trabalhar contra o material que você vai efetivamente encontrar: enunciados comparativos que são verdadeiros e insuficientes ao mesmo tempo. Nenhum dos doze enunciados do instrumento abaixo é falso. Todos os doze levam a uma conclusão errada."
        }
      ]
    }
  ]
};
