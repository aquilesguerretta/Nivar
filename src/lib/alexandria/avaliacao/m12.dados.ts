// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m12.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m12 (aparato.json, modulo.json) e o texto das aulas
// (alexandria-modulo-12-content.ts, conferido contra o HTML original). Conferência:
// tools/alexandria-dados/avaliacao/verificar-avaliacao-m12.mjs. Relatório: docs/alexandria-v3/porte/m12.md.
// 21 itens por aula (4 da fonte, 17 derivados) · 10 Ex·NN do módulo (sem vínculo mecânico) · 10 questões na prova · 28 itens no checklist.
// A fonte não liga exercício a aula: cada Ex·NN vai para a última aula com vínculo mecânico, ou fica no módulo (ver o gerador).

import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m12-a01-d01",
    "moduloId": "modulo-12",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, qual é o denominador da matriz elétrica?",
    "alternativas": [
      "A Oferta Interna de Energia",
      "A Oferta Interna de Energia Elétrica",
      "A geração"
    ],
    "gabarito": 1,
    "referencia": "A matriz elétrica mede apenas a eletricidade. O denominador é a Oferta Interna de Energia Elétrica",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a01",
      "linha": 828
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a01",
        "linha": 828,
        "trecho": "A matriz elétrica mede apenas a eletricidade. O denominador é a Oferta Interna de Energia Elétrica"
      }
    ]
  },
  {
    "id": "m12-a01-d02",
    "moduloId": "modulo-12",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O Aquífero Guarani é um ativo de geração elétrica? Segundo a aula, de que depende a geração hidrelétrica brasileira?",
    "gabarito": null,
    "referencia": "O Aquífero Guarani é uma reserva de água subterrânea transfronteiriça, compartilhada com Argentina, Paraguai e Uruguai, relevante para abastecimento humano, irrigação e cooperação regional — sem relação direta com geração hidrelétrica. A geração hidrelétrica brasileira depende de hidrologia de superfície: as bacias do São Francisco, Tocantins-Araguaia, Paraná e Madeira, com seus reservatórios, suas vazões e sua variabilidade climática.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a01",
      "linha": 992
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a01",
        "linha": 992,
        "trecho": "O Aquífero Guarani é uma reserva de água subterrânea transfronteiriça, compartilhada com Argentina, Paraguai e Uruguai, relevante para abastecimento humano, irrigação e cooperação regional — sem relação direta com geração hidrelétrica."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a01",
        "linha": 997,
        "trecho": "A geração hidrelétrica brasileira depende de hidrologia de superfície: as bacias do São Francisco, Tocantins-Araguaia, Paraná e Madeira, com seus reservatórios, suas vazões e sua variabilidade climática."
      }
    ]
  },
  {
    "id": "m12-a02-d01",
    "moduloId": "modulo-12",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que, segundo a aula, a vantagem da matriz elétrica limpa não compensa automaticamente o desmatamento no inventário brasileiro?",
    "gabarito": null,
    "referencia": "No Brasil, mudança de uso da terra e agropecuária têm peso elevado — o que significa que a vantagem da matriz elétrica limpa, por maior que seja, não compensa automaticamente desmatamento.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a02",
      "linha": 1127
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a02",
        "linha": 1127,
        "trecho": "No Brasil, mudança de uso da terra e agropecuária têm peso elevado — o que significa que a vantagem da matriz elétrica limpa, por maior que seja, não compensa automaticamente desmatamento."
      }
    ]
  },
  {
    "id": "m12-a02-d02",
    "moduloId": "modulo-12",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Dentro do setor de energia, de onde veio a maior parcela das emissões brasileiras em 2025, segundo a aula?",
    "alternativas": [
      "geração elétrica",
      "transportes",
      "mudança de uso da terra",
      "agropecuária"
    ],
    "gabarito": 1,
    "referencia": "a maior parcela — 220,8 milhões de toneladas, praticamente metade — veio de transportes, não de geração elétrica.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a02",
      "linha": 1134
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a02",
        "linha": 1134,
        "trecho": "a maior parcela — 220,8 milhões de toneladas, praticamente metade — veio de transportes, não de geração elétrica."
      }
    ]
  },
  {
    "id": "m12-a03-d01",
    "moduloId": "modulo-12",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Qual é a diferença entre complementaridade e concentração, e qual das duas a aula trata como risco?",
    "gabarito": null,
    "referencia": "Complementaridade é quando dois países têm o que o outro não tem, e trocam. Concentração é quando uma cadeia inteira depende de um único fornecedor, comprador ou financiador, e é isso — não a nacionalidade de ninguém — que constitui risco analítico.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a03",
      "linha": 1261
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a03",
        "linha": 1261,
        "trecho": "Complementaridade é quando dois países têm o que o outro não tem, e trocam."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a03",
        "linha": 1262,
        "trecho": "Concentração é quando uma cadeia inteira depende de um único fornecedor, comprador ou financiador, e é isso — não a nacionalidade de ninguém — que constitui risco analítico."
      }
    ]
  },
  {
    "id": "m12-a03-d02",
    "moduloId": "modulo-12",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, quem pergunta se o Brasil vai conseguir certificar cadeia de suprimento sob padrões europeus usando equipamento de origem chinesa?",
    "alternativas": [
      "Um investidor americano",
      "Um investidor europeu",
      "Um cientista político"
    ],
    "gabarito": 1,
    "referencia": "Um investidor europeu pergunta se o Brasil vai conseguir certificar cadeia de suprimento sob padrões europeus usando equipamento dessa origem.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a03",
      "linha": 1332
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a03",
        "linha": 1332,
        "trecho": "Um investidor europeu pergunta se o Brasil vai conseguir certificar cadeia de suprimento sob padrões europeus usando equipamento dessa origem."
      }
    ]
  },
  {
    "id": "m12-a04-d01",
    "moduloId": "modulo-12",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, o que importa mais que o percentual de uma medida comercial?",
    "alternativas": [
      "setor afetado",
      "base jurídica",
      "nome de setor"
    ],
    "gabarito": 1,
    "referencia": "a base jurídica de uma medida comercial importa mais que o seu percentual",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a04",
      "linha": 1412
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a04",
        "linha": 1412,
        "trecho": "a base jurídica de uma medida comercial importa mais que o seu percentual"
      }
    ]
  },
  {
    "id": "m12-a04-d02",
    "moduloId": "modulo-12",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que a reviravolta dos incentivos americanos importa para o Brasil? A aula dá duas razões.",
    "gabarito": null,
    "referencia": "A primeira é competição por capital: capital global de infraestrutura renovável que estava sendo alocado nos Estados Unidos por causa do incentivo precisa de destino, e países com recurso natural competitivo e regulação estável entram na lista curta. A segunda é competição por equipamento: uma desaceleração da instalação americana afrouxa demanda global por módulo e célula, com efeito sobre preço para todo comprador — inclusive o brasileiro.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a04",
      "linha": 1395
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a04",
        "linha": 1395,
        "trecho": "A primeira é competição por capital: capital global de infraestrutura renovável que estava sendo alocado nos Estados Unidos por causa do incentivo precisa de destino, e países com recurso natural competitivo e regulação estável entram na lista curta."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a04",
        "linha": 1398,
        "trecho": "A segunda é competição por equipamento: uma desaceleração da instalação americana afrouxa demanda global por módulo e célula, com efeito sobre preço para todo comprador — inclusive o brasileiro."
      }
    ]
  },
  {
    "id": "m12-a05-d01",
    "moduloId": "modulo-12",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "No mecanismo europeu de ajuste de carbono na fronteira, quem paga o certificado?",
    "alternativas": [
      "o exportador brasileiro",
      "o importador europeu",
      "o país de origem"
    ],
    "gabarito": 1,
    "referencia": "quem paga o certificado é o importador europeu, não o exportador brasileiro.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a05",
      "linha": 1576
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a05",
        "linha": 1576,
        "trecho": "quem paga o certificado é o importador europeu, não o exportador brasileiro."
      }
    ]
  },
  {
    "id": "m12-a05-d02",
    "moduloId": "modulo-12",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Quando o mecanismo europeu de ajuste de carbono na fronteira entrou em regime definitivo?",
    "alternativas": [
      "outubro de 2023",
      "dezembro de 2024",
      "1º de janeiro de 2026",
      "22 de julho de 2026"
    ],
    "gabarito": 2,
    "referencia": "O mecanismo europeu de ajuste de carbono na fronteira entrou em regime definitivo em 1º de janeiro de 2026, encerrando o período transitório que começara em outubro de 2023.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a05",
      "linha": 1566
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a05",
        "linha": 1566,
        "trecho": "O mecanismo europeu de ajuste de carbono na fronteira entrou em regime definitivo em 1º de janeiro de 2026, encerrando o período transitório que começara em outubro de 2023."
      }
    ]
  },
  {
    "id": "m12-a05-d03",
    "moduloId": "modulo-12",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Diante de qualquer capital estrangeiro, a aula diz que a pergunta não é \"de onde vem o dinheiro\". Que quatro campos ela manda verificar?",
    "gabarito": null,
    "referencia": "moeda de denominação e quem carrega o risco cambial; condicionalidade de compra, de tecnologia ou de origem de equipamento; horizonte de saída do investidor, que diferencia capital de concessão regulada de capital de fundo com prazo; e governança, isto é, que direito de veto ou de indicação o capital adquire sobre decisão operacional.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a05",
      "linha": 1634
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a05",
        "linha": 1634,
        "trecho": "moeda de denominação e quem carrega o risco cambial; condicionalidade de compra, de tecnologia ou de origem de equipamento; horizonte de saída do investidor, que diferencia capital de concessão regulada de capital de fundo com prazo; e governança, isto é, que direito de veto ou de indicação o capital adquire sobre decisão operacional."
      }
    ]
  },
  {
    "id": "m12-ex-06",
    "moduloId": "modulo-12",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Atualização</b> — \"o Brasil tem R$ 18,3 bilhões em incentivo ao hidrogênio\"<br>A afirmação é verdadeira ou incompleta? O que você responde?",
    "gabarito": null,
    "referencia": "É verdadeira quanto ao texto da lei e incompleta quanto ao estado. O valor está na Lei nº 14.990, de 27 de setembro de 2024, que institui o programa de desenvolvimento do hidrogênio de baixa emissão de carbono com crédito fiscal de até esse montante, em limites anuais escalonados. Duas ressalvas obrigatórias. Primeira: a janela de anos em que o crédito pode ser concedido foi alterada por legislação posterior, então o texto a consultar é o consolidado, não a redação original. Segunda, e mais importante: o programa depende de decreto regulamentador para operar — habilitação, critérios, contabilidade de ciclo de vida — e esse decreto não havia sido publicado na data de verificação, dois anos depois da primeira lei do marco e mais de oito meses depois do anúncio oficial de assinatura iminente. A resposta correta, portanto, não é concordar nem discordar: é perguntar se o decreto já saiu. Um incentivo com prazo de validade legal e sem regra de acesso publicada é um incentivo que ninguém pode requerer.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[5]",
      "linha": 2526
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[5].summary_literal.texto",
        "linha": 2526,
        "trecho": "Exercício 06 · Atualização — \"o Brasil tem R$ 18,3 bilhões em incentivo ao hidrogênio\""
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[5].enunciado.texto",
        "linha": 2526,
        "trecho": "A afirmação é verdadeira ou incompleta? O que você responde?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[5].resposta_referencia.texto",
        "linha": 2526,
        "trecho": "É verdadeira quanto ao texto da lei e incompleta quanto ao estado. O valor está na Lei nº 14.990, de 27 de setembro de 2024, que institui o programa de desenvolvimento do hidrogênio de baixa emissão de carbono com crédito fiscal de até esse montante, em limites anuais escalonados. Duas ressalvas obrigatórias. Primeira: a janela de anos em que o crédito pode ser concedido foi alterada por legislação posterior, então o texto a consultar é o consolidado, não a redação original. Segunda, e mais importante: o programa depende de decreto regulamentador para operar — habilitação, critérios, contabilidade de ciclo de vida — e esse decreto não havia sido publicado na data de verificação, dois anos depois da primeira lei do marco e mais de oito meses depois do anúncio oficial de assinatura iminente. A resposta correta, portanto, não é concordar nem discordar: é perguntar se o decreto já saiu. Um incentivo com prazo de validade legal e sem regra de acesso publicada é um incentivo que ninguém pode requerer."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "vínculo mecânico · section#a06 (escolhida: a última)",
        "linha": null,
        "trecho": "o brasil tem r 18,3 bilhões em incentivo ao hidrogênio a"
      }
    ]
  },
  {
    "id": "m12-a06-d01",
    "moduloId": "modulo-12",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Como as leis brasileiras definem hidrogênio de baixa emissão de carbono?",
    "alternativas": [
      "Por convenção de cores",
      "Por desempenho, não por rota",
      "Por rota"
    ],
    "gabarito": 1,
    "referencia": "é a definição de hidrogênio de baixa emissão de carbono por desempenho, não por rota.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a06",
      "linha": 1753
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a06",
        "linha": 1753,
        "trecho": "é a definição de hidrogênio de baixa emissão de carbono por desempenho, não por rota."
      }
    ]
  },
  {
    "id": "m12-a06-d02",
    "moduloId": "modulo-12",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que, segundo a aula, não se somam os valores anunciados de projetos de hidrogênio?",
    "gabarito": null,
    "referencia": "Somar valores anunciados de projetos em estágios diferentes produz uma cifra grande, impressionante e analiticamente vazia. Anúncio agregado não equivale a capacidade contratada",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a06",
      "linha": 1829
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a06",
        "linha": 1829,
        "trecho": "Somar valores anunciados de projetos em estágios diferentes produz uma cifra grande, impressionante e analiticamente vazia."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a06",
        "linha": 1833,
        "trecho": "Anúncio agregado não equivale a capacidade contratada"
      }
    ]
  },
  {
    "id": "m12-ex-07",
    "moduloId": "modulo-12",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Articulação</b> — \"se o Brasil tem a segunda maior reserva de terras-raras, por que não domina o mercado?\"",
    "gabarito": null,
    "referencia": "Porque o gargalo global não está no minério. Está na separação química dos elementos, no refino e na fabricação de ímãs permanentes — etapas concentradas majoritariamente em um só país, que domina de longe tanto o refino quanto a manufatura de ímãs. Extrair minério e separar elementos são indústrias diferentes, com tecnologia, capital e escala diferentes; possuir a jazida não dá acesso à cadeia. Os números tornam isso literal: a produção brasileira foi de vinte toneladas em 2024, contra 390 mil toneladas mundiais — menos de um centésimo de um por cento —, com uma única mina em operação comercial, em Goiás, iniciada em janeiro de 2024. E, antes de citar a reserva, é preciso dizer qual: circula 21 milhões de toneladas pelo levantamento internacional e 11,4 milhões pelo levantamento brasileiro, que aplica padrão de classificação mais restritivo. Os dois entram, cada um com sua fonte.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[6]",
      "linha": 2545
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[6].summary_literal.texto",
        "linha": 2545,
        "trecho": "Exercício 07 · Articulação — \"se o Brasil tem a segunda maior reserva de terras-raras, por que não domina o mercado?\""
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[6].resposta_referencia.texto",
        "linha": 2545,
        "trecho": "Porque o gargalo global não está no minério. Está na separação química dos elementos, no refino e na fabricação de ímãs permanentes — etapas concentradas majoritariamente em um só país, que domina de longe tanto o refino quanto a manufatura de ímãs. Extrair minério e separar elementos são indústrias diferentes, com tecnologia, capital e escala diferentes; possuir a jazida não dá acesso à cadeia. Os números tornam isso literal: a produção brasileira foi de vinte toneladas em 2024, contra 390 mil toneladas mundiais — menos de um centésimo de um por cento —, com uma única mina em operação comercial, em Goiás, iniciada em janeiro de 2024. E, antes de citar a reserva, é preciso dizer qual: circula 21 milhões de toneladas pelo levantamento internacional e 11,4 milhões pelo levantamento brasileiro, que aplica padrão de classificação mais restritivo. Os dois entram, cada um com sua fonte."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "vínculo mecânico · section#a07 (escolhida: a última)",
        "linha": null,
        "trecho": "se o brasil tem a segunda maior reserva"
      }
    ]
  },
  {
    "id": "m12-a07-d01",
    "moduloId": "modulo-12",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, o que é reserva mineral?",
    "alternativas": [
      "Uma concentração com perspectiva razoável de eventual extração econômica",
      "A parcela do recurso demonstrada como economicamente lavrável depois de aplicados os fatores modificadores",
      "Uma ocorrência geológica gigantesca sem estudo de processamento"
    ],
    "gabarito": 1,
    "referencia": "Reserva mineral é a parcela do recurso demonstrada como economicamente lavrável depois de aplicados os fatores modificadores",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a07",
      "linha": 1926
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a07",
        "linha": 1926,
        "trecho": "Reserva mineral é a parcela do recurso demonstrada como economicamente lavrável depois de aplicados os fatores modificadores"
      }
    ]
  },
  {
    "id": "m12-a07-d02",
    "moduloId": "modulo-12",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "No nióbio, em que o Brasil de fato lidera a produção mundial, qual continua sendo o mercado principal?",
    "alternativas": [
      "bateria",
      "liga de aço de alta resistência",
      "material ativo de ânodo",
      "ímãs permanentes"
    ],
    "gabarito": 1,
    "referencia": "No nióbio, onde o Brasil de fato lidera a produção mundial, o mercado principal continua sendo liga de aço de alta resistência",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a07",
      "linha": 2005
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a07",
        "linha": 2005,
        "trecho": "No nióbio, onde o Brasil de fato lidera a produção mundial, o mercado principal continua sendo liga de aço de alta resistência"
      }
    ]
  },
  {
    "id": "m12-ex-01",
    "moduloId": "modulo-12",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Sustentação</b> — dois minutos sobre o paradoxo, sem citar percentual duas vezes<br>Você já disse a um investidor que a matriz elétrica brasileira é 86,8% renovável em 2025 e que a produção de petróleo chegou a 3,8 milhões de barris por dia no mesmo ano. Ele responde: \"entendi os números, mas continue — por que isso não é uma contradição?\" Sustente dois minutos sem repetir nenhum dos dois números.",
    "gabarito": null,
    "referencia": "Porque as duas colunas ocupam espaços econômicos diferentes. Eletricidade é um vetor doméstico: gera-se e consome-se dentro do país, e a exportação de elétron é limitada por interconexão física. Petróleo é uma commodity global: produz-se para vender fora, e a decisão de produzir depende de custo de extração e preço internacional, não de política energética doméstica. Um país pode descarbonizar seu próprio consumo de eletricidade sem alterar em nada a sua posição como exportador de energia primária, porque as duas coisas atendem mercados diferentes. A tensão real não é física — é de três naturezas: <em>intertemporal</em>, porque ativo de petróleo tem vida útil de décadas e enfrenta risco de demanda de longo prazo; <em>fiscal</em>, porque renda petrolífera pode financiar capacidade produtiva duradoura ou apenas despesa corrente, e a diferença define se a expansão fortalece ou fragiliza o país; e <em>diplomática</em>, porque um país que preside a conferência do clima e expande produção fóssil simultaneamente recebe uma pergunta que outros produtores não recebem.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[0]",
      "linha": 2421
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[0].summary_literal.texto",
        "linha": 2421,
        "trecho": "Exercício 01 · Sustentação — dois minutos sobre o paradoxo, sem citar percentual duas vezes"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[0].enunciado.texto",
        "linha": 2421,
        "trecho": "Você já disse a um investidor que a matriz elétrica brasileira é 86,8% renovável em 2025 e que a produção de petróleo chegou a 3,8 milhões de barris por dia no mesmo ano. Ele responde: \"entendi os números, mas continue — por que isso não é uma contradição?\" Sustente dois minutos sem repetir nenhum dos dois números."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[0].resposta_referencia.texto",
        "linha": 2421,
        "trecho": "Porque as duas colunas ocupam espaços econômicos diferentes. Eletricidade é um vetor doméstico: gera-se e consome-se dentro do país, e a exportação de elétron é limitada por interconexão física. Petróleo é uma commodity global: produz-se para vender fora, e a decisão de produzir depende de custo de extração e preço internacional, não de política energética doméstica. Um país pode descarbonizar seu próprio consumo de eletricidade sem alterar em nada a sua posição como exportador de energia primária, porque as duas coisas atendem mercados diferentes. A tensão real não é física — é de três naturezas: intertemporal, porque ativo de petróleo tem vida útil de décadas e enfrenta risco de demanda de longo prazo; fiscal, porque renda petrolífera pode financiar capacidade produtiva duradoura ou apenas despesa corrente, e a diferença define se a expansão fortalece ou fragiliza o país; e diplomática, porque um país que preside a conferência do clima e expande produção fóssil simultaneamente recebe uma pergunta que outros produtores não recebem."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "vínculo mecânico · section#a08 (escolhida: a última)",
        "linha": null,
        "trecho": "3,8 milhões de barris por dia no mesmo ano"
      }
    ]
  },
  {
    "id": "m12-ex-14",
    "moduloId": "modulo-12",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Sustentação final</b> — \"então o Brasil é uma boa aposta ou não?\"",
    "gabarito": null,
    "referencia": "A resposta correta não é sim nem não, e não por diplomacia — por imprecisão. \"Sim\" escolhe a coluna renovável; \"não\" escolhe a coluna fóssil; as duas descartam metade do fato. A estrutura da resposta tem três partes. Primeira: articule as duas colunas em uma frase cada, com um número datado em cada uma. Segunda: explique por que coexistem sem contradição física — não há incompatibilidade entre gerar eletricidade limpa e produzir petróleo para exportação, porque atendem mercados diferentes; a tensão é intertemporal, fiscal e diplomática. Terceira, e é a que devolve a conversa: pergunte <b>em qual das duas colunas o interlocutor está exposto</b>. Quem investe em geração renovável está exposto à coluna verde e ao risco de rede, curtailment e preço local. Quem compra commodity está exposto à coluna fóssil e ao risco de demanda de longo prazo. Quem exporta manufatura para a Europa está exposto ao vetor regulação, e a nenhuma das duas colunas diretamente. \"O Brasil é uma boa aposta\" não é uma pergunta até que se diga aposta em quê — e explicitar a premissa antes de responder é a mesma disciplina que o Módulo 11 ensinou para proposta comercial.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[13]",
      "linha": 2672
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[13].summary_literal.texto",
        "linha": 2672,
        "trecho": "Exercício 14 · Sustentação final — \"então o Brasil é uma boa aposta ou não?\""
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[13].resposta_referencia.texto",
        "linha": 2672,
        "trecho": "A resposta correta não é sim nem não, e não por diplomacia — por imprecisão. \"Sim\" escolhe a coluna renovável; \"não\" escolhe a coluna fóssil; as duas descartam metade do fato. A estrutura da resposta tem três partes. Primeira: articule as duas colunas em uma frase cada, com um número datado em cada uma. Segunda: explique por que coexistem sem contradição física — não há incompatibilidade entre gerar eletricidade limpa e produzir petróleo para exportação, porque atendem mercados diferentes; a tensão é intertemporal, fiscal e diplomática. Terceira, e é a que devolve a conversa: pergunte em qual das duas colunas o interlocutor está exposto. Quem investe em geração renovável está exposto à coluna verde e ao risco de rede, curtailment e preço local. Quem compra commodity está exposto à coluna fóssil e ao risco de demanda de longo prazo. Quem exporta manufatura para a Europa está exposto ao vetor regulação, e a nenhuma das duas colunas diretamente. \"O Brasil é uma boa aposta\" não é uma pergunta até que se diga aposta em quê — e explicitar a premissa antes de responder é a mesma disciplina que o Módulo 11 ensinou para proposta comercial."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "vínculo mecânico · section#a08 (escolhida: a última)",
        "linha": null,
        "trecho": "então o brasil é uma boa aposta ou não"
      }
    ]
  },
  {
    "id": "m12-a08-d01",
    "moduloId": "modulo-12",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Na tabela de narrativas, o que a aula manda verificar antes de aceitar \"O Brasil está sentado sobre uma fortuna em terras-raras\"?",
    "gabarito": null,
    "referencia": "Reserva contra produção, e sob qual das duas metodologias. Onde está o gargalo — mina, separação ou ímã.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a08",
      "linha": 2205
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a08",
        "linha": 2205,
        "trecho": "Reserva contra produção, e sob qual das duas metodologias. Onde está o gargalo — mina, separação ou ímã."
      }
    ]
  },
  {
    "id": "m12-a08-d02",
    "moduloId": "modulo-12",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Quantos campos tem cada movimento do andaime de conversa?",
    "alternativas": [
      "Três",
      "Quatro",
      "Oito"
    ],
    "gabarito": 1,
    "referencia": "Cada movimento tem quatro campos: a pergunta que o governa, duas ou três âncoras concretas com fonte, a ponte declarada para o movimento seguinte, e o erro que faz a conversa voltar a um ponto já percorrido.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo12.html",
      "campo": "section#a08",
      "linha": 2221
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo12.html",
        "campo": "section#a08",
        "linha": 2221,
        "trecho": "Cada movimento tem quatro campos: a pergunta que o governa, duas ou três âncoras concretas com fonte, a ponte declarada para o movimento seguinte, e o erro que faz a conversa voltar a um ponto já percorrido."
      }
    ]
  }
];

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [
  {
    "id": "m12-ex-02",
    "moduloId": "modulo-12",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Atualização</b> — \"a legislação climática americana está financiando forte a expansão solar\"<br>Um interlocutor afirma isso com naturalidade. O que mudou, desde quando, e com que fonte?",
    "gabarito": null,
    "referencia": "Mudou por lei orçamentária sancionada em 4 de julho de 2025, que acelerou a extinção dos créditos fiscais à energia limpa. Especificamente para eólica e solar, os créditos de produção e de investimento passaram a exigir início de obra até 4 de julho de 2026 ou entrada em operação até 31 de dezembro de 2027 — e o prazo de início de obra já venceu. A mesma lei antecipou em cinco anos o fim do crédito ao hidrogênio limpo e criou restrições de assistência material que desqualificam projetos com cadeia de suprimento ligada a entidades estrangeiras designadas. Duas ressalvas mantêm a resposta honesta: tecnologias que não sejam eólica e solar mantiveram prazo bem mais longo, e a aplicação da regra de início de obra seguiu em disputa judicial ao longo de 2026. Fonte: texto da lei e ordens executivas subsequentes, não resumo de imprensa. Para reverificar no futuro, o caminho é o texto consolidado dos artigos 45Y e 48E do código tributário americano e a orientação da autoridade tributária.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[1]",
      "linha": 2444
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[1].summary_literal.texto",
        "linha": 2444,
        "trecho": "Exercício 02 · Atualização — \"a legislação climática americana está financiando forte a expansão solar\""
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[1].enunciado.texto",
        "linha": 2444,
        "trecho": "Um interlocutor afirma isso com naturalidade. O que mudou, desde quando, e com que fonte?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[1].resposta_referencia.texto",
        "linha": 2444,
        "trecho": "Mudou por lei orçamentária sancionada em 4 de julho de 2025, que acelerou a extinção dos créditos fiscais à energia limpa. Especificamente para eólica e solar, os créditos de produção e de investimento passaram a exigir início de obra até 4 de julho de 2026 ou entrada em operação até 31 de dezembro de 2027 — e o prazo de início de obra já venceu. A mesma lei antecipou em cinco anos o fim do crédito ao hidrogênio limpo e criou restrições de assistência material que desqualificam projetos com cadeia de suprimento ligada a entidades estrangeiras designadas. Duas ressalvas mantêm a resposta honesta: tecnologias que não sejam eólica e solar mantiveram prazo bem mais longo, e a aplicação da regra de início de obra seguiu em disputa judicial ao longo de 2026. Fonte: texto da lei e ordens executivas subsequentes, não resumo de imprensa. Para reverificar no futuro, o caminho é o texto consolidado dos artigos 45Y e 48E do código tributário americano e a orientação da autoridade tributária."
      }
    ]
  },
  {
    "id": "m12-ex-03",
    "moduloId": "modulo-12",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Articulação</b> — \"como vocês podem ser líderes em renovável e ainda importar derivados de petróleo?\"<br>Responda sem negar nenhum dos dois lados.",
    "gabarito": null,
    "referencia": "Porque petróleo bruto e derivado são produtos diferentes, e ser exportador líquido de um não implica autossuficiência no outro. O parque de refino de um país é configurado para um perfil específico de óleo e de demanda; quando o óleo produzido tem características que atendem melhor a compradores externos, e quando a demanda doméstica por um derivado específico cresce mais rápido que a capacidade de refino, a solução economicamente racional é exportar o bruto e importar o derivado. Isso não é incoerência contábil, é especialização. E não tem relação com a matriz elétrica: derivado de petróleo no Brasil vai majoritariamente para transporte, que é o setor onde estão praticamente metade das emissões de energia do país e onde a renovabilidade é de 26,1%, não de 87%. A resposta completa termina apontando que é exatamente por isso que eletrificar transporte e processo industrial é o maior salto de descarbonização disponível ao Brasil — a eletricidade que substituiria o combustível já é limpa.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[2]",
      "linha": 2464
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[2].summary_literal.texto",
        "linha": 2464,
        "trecho": "Exercício 03 · Articulação — \"como vocês podem ser líderes em renovável e ainda importar derivados de petróleo?\""
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[2].enunciado.texto",
        "linha": 2464,
        "trecho": "Responda sem negar nenhum dos dois lados."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[2].resposta_referencia.texto",
        "linha": 2464,
        "trecho": "Porque petróleo bruto e derivado são produtos diferentes, e ser exportador líquido de um não implica autossuficiência no outro. O parque de refino de um país é configurado para um perfil específico de óleo e de demanda; quando o óleo produzido tem características que atendem melhor a compradores externos, e quando a demanda doméstica por um derivado específico cresce mais rápido que a capacidade de refino, a solução economicamente racional é exportar o bruto e importar o derivado. Isso não é incoerência contábil, é especialização. E não tem relação com a matriz elétrica: derivado de petróleo no Brasil vai majoritariamente para transporte, que é o setor onde estão praticamente metade das emissões de energia do país e onde a renovabilidade é de 26,1%, não de 87%. A resposta completa termina apontando que é exatamente por isso que eletrificar transporte e processo industrial é o maior salto de descarbonização disponível ao Brasil — a eletricidade que substituiria o combustível já é limpa."
      }
    ]
  },
  {
    "id": "m12-ex-04",
    "moduloId": "modulo-12",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Classificação de nome</b> — quatro entidades apareceram na sua pesquisa<br>Classifique cada uma na taxonomia de seis categorias e diga o que fazer com ela: (a) um fabricante asiático de células de bateria; (b) uma agência intergovernamental de energia cujo relatório traz o dado que você quer citar; (c) uma distribuidora brasileira adquirida por capital estatal estrangeiro em 2017; (d) uma plataforma internacional de dados de mercado de energia.",
    "gabarito": null,
    "referencia": "(a) <b>Categoria 3</b> — fabricante de equipamento. Proibido em qualquer forma. Substitua por \"um pequeno número de fabricantes de grande escala concentra a cadeia de célula\". (b) <b>Categoria 5</b> — organismo intergovernamental. Permitido citar como fonte em referência bibliográfica e em nota de fonte; nunca como personagem da prosa. (c) Depende do uso. Se a menção explicar a estrutura de controle atual e for necessária ao argumento, tende a <b>Categoria 1</b>: descreva por estrutura, sem nome. A <b>Categoria 2</b> só se aplica se a menção explicar uma estrutura já concluída e não promover serviço contratável hoje — e, no caso de uma distribuidora ativa, promove. Além disso, análise de empresa individual pertence a outro bloco do currículo. (d) <b>Categoria 4</b> — plataforma de dados concorrente ou adjacente. Proibida no ativo publicado mesmo quando listada como recurso recomendado. Use na pesquisa privada; substitua por fonte brasileira primária no texto.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[3]",
      "linha": 2483
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[3].summary_literal.texto",
        "linha": 2483,
        "trecho": "Exercício 04 · Classificação de nome — quatro entidades apareceram na sua pesquisa"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[3].enunciado.texto",
        "linha": 2483,
        "trecho": "Classifique cada uma na taxonomia de seis categorias e diga o que fazer com ela: (a) um fabricante asiático de células de bateria; (b) uma agência intergovernamental de energia cujo relatório traz o dado que você quer citar; (c) uma distribuidora brasileira adquirida por capital estatal estrangeiro em 2017; (d) uma plataforma internacional de dados de mercado de energia."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[3].resposta_referencia.texto",
        "linha": 2483,
        "trecho": "(a) Categoria 3 — fabricante de equipamento. Proibido em qualquer forma. Substitua por \"um pequeno número de fabricantes de grande escala concentra a cadeia de célula\". (b) Categoria 5 — organismo intergovernamental. Permitido citar como fonte em referência bibliográfica e em nota de fonte; nunca como personagem da prosa. (c) Depende do uso. Se a menção explicar a estrutura de controle atual e for necessária ao argumento, tende a Categoria 1: descreva por estrutura, sem nome. A Categoria 2 só se aplica se a menção explicar uma estrutura já concluída e não promover serviço contratável hoje — e, no caso de uma distribuidora ativa, promove. Além disso, análise de empresa individual pertence a outro bloco do currículo. (d) Categoria 4 — plataforma de dados concorrente ou adjacente. Proibida no ativo publicado mesmo quando listada como recurso recomendado. Use na pesquisa privada; substitua por fonte brasileira primária no texto."
      }
    ]
  },
  {
    "id": "m12-ex-05",
    "moduloId": "modulo-12",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Sustentação</b> — dois minutos sobre a relação com a China sem usar a palavra \"dependência\"<br>A restrição é deliberada: a palavra carrega julgamento e encurta a análise.",
    "gabarito": null,
    "referencia": "A relação tem três camadas com dinâmicas diferentes. Na camada de ativos regulados, há capital estatal estrangeiro controlando transmissão e distribuição, sob regulação brasileira e com receita definida em revisão tarifária — capital de horizonte longo, tolerante a retorno regulado, estruturalmente diferente de fundo com prazo de saída. Na camada de equipamento, um pequeno número de fabricantes de grande escala concentra a cadeia global de módulo, inversor e célula de bateria, e a expansão solar brasileira foi construída sobre essa cadeia; há montagem local, mas a etapa de célula, onde está o valor tecnológico, permanece externa. Na camada comercial, o padrão agregado é matéria-prima em troca de manufatura. A pergunta analítica que ordena as três é sempre a mesma: se essa fonte parasse por seis meses, existe alternativa a que preço e em que prazo? A resposta muda por camada — baixa exposição no ativo regulado, exposição imediata no equipamento, exposição de preço e câmbio no comércio. E a conclusão operacional não é ruptura: é criar segunda alternativa qualificada, o que muda a posição de negociação com a primeira mesmo comprando pouco dela.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[4]",
      "linha": 2505
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[4].summary_literal.texto",
        "linha": 2505,
        "trecho": "Exercício 05 · Sustentação — dois minutos sobre a relação com a China sem usar a palavra \"dependência\""
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[4].enunciado.texto",
        "linha": 2505,
        "trecho": "A restrição é deliberada: a palavra carrega julgamento e encurta a análise."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[4].resposta_referencia.texto",
        "linha": 2505,
        "trecho": "A relação tem três camadas com dinâmicas diferentes. Na camada de ativos regulados, há capital estatal estrangeiro controlando transmissão e distribuição, sob regulação brasileira e com receita definida em revisão tarifária — capital de horizonte longo, tolerante a retorno regulado, estruturalmente diferente de fundo com prazo de saída. Na camada de equipamento, um pequeno número de fabricantes de grande escala concentra a cadeia global de módulo, inversor e célula de bateria, e a expansão solar brasileira foi construída sobre essa cadeia; há montagem local, mas a etapa de célula, onde está o valor tecnológico, permanece externa. Na camada comercial, o padrão agregado é matéria-prima em troca de manufatura. A pergunta analítica que ordena as três é sempre a mesma: se essa fonte parasse por seis meses, existe alternativa a que preço e em que prazo? A resposta muda por camada — baixa exposição no ativo regulado, exposição imediata no equipamento, exposição de preço e câmbio no comércio. E a conclusão operacional não é ruptura: é criar segunda alternativa qualificada, o que muda a posição de negociação com a primeira mesmo comprando pouco dela."
      }
    ]
  },
  {
    "id": "m12-ex-08",
    "moduloId": "modulo-12",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Sustentação</b> — dois minutos sobre a COP30 sem dizer se foi sucesso ou fracasso",
    "gabarito": null,
    "referencia": "Ocorreu em Belém, de 10 a 22 de novembro de 2025. Cerca de 195 partes aprovaram por consenso um conjunto de 29 decisões, que ficou conhecido como Pacote de Belém, cobrindo transição justa, financiamento de adaptação, comércio, gênero e tecnologia. Entre as decisões concretas estão o compromisso de triplicar o financiamento de adaptação até 2035, a conclusão de um roteiro de adaptação que estabelece o trabalho de 2026 a 2028, e a adoção de 59 indicadores voluntários para a meta global de adaptação. Não houve consenso para incluir no texto final linguagem de eliminação de combustíveis fósseis nem linguagem explícita sobre desmatamento; a presidência brasileira respondeu criando, fora do texto de consenso, dois roteiros voluntários sobre esses temas, a serem construídos ao longo de 2026. A distinção entre decisão aprovada por consenso e iniciativa voluntária de presidência é de natureza jurídica e de força política, e é o que precisa ser dito antes de qualquer juízo. O Brasil segue na presidência até novembro de 2026, quando ela passa à COP31.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[7]",
      "linha": 2561
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[7].summary_literal.texto",
        "linha": 2561,
        "trecho": "Exercício 08 · Sustentação — dois minutos sobre a COP30 sem dizer se foi sucesso ou fracasso"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[7].resposta_referencia.texto",
        "linha": 2561,
        "trecho": "Ocorreu em Belém, de 10 a 22 de novembro de 2025. Cerca de 195 partes aprovaram por consenso um conjunto de 29 decisões, que ficou conhecido como Pacote de Belém, cobrindo transição justa, financiamento de adaptação, comércio, gênero e tecnologia. Entre as decisões concretas estão o compromisso de triplicar o financiamento de adaptação até 2035, a conclusão de um roteiro de adaptação que estabelece o trabalho de 2026 a 2028, e a adoção de 59 indicadores voluntários para a meta global de adaptação. Não houve consenso para incluir no texto final linguagem de eliminação de combustíveis fósseis nem linguagem explícita sobre desmatamento; a presidência brasileira respondeu criando, fora do texto de consenso, dois roteiros voluntários sobre esses temas, a serem construídos ao longo de 2026. A distinção entre decisão aprovada por consenso e iniciativa voluntária de presidência é de natureza jurídica e de força política, e é o que precisa ser dito antes de qualquer juízo. O Brasil segue na presidência até novembro de 2026, quando ela passa à COP31."
      }
    ]
  },
  {
    "id": "m12-ex-09",
    "moduloId": "modulo-12",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Classificação de número</b> — três cifras chegaram numa apresentação<br>\"Capacidade instalada de 218 GW\", \"50 GW de geração distribuída\" e \"US$ 4 bilhões em projeto de hidrogênio\". Que perguntas você faz antes de repetir cada uma?",
    "gabarito": null,
    "referencia": "Para as duas primeiras: capacidade instalada não é energia gerada, e essa é a confusão de grandeza mais comum do setor. Pergunte a data de referência, a fonte — que para capacidade é o regulador ou o operador, não o balanço energético — e se o número inclui ou exclui geração distribuída, porque somá-los duas vezes é erro frequente. Para a terceira: pergunte o estágio. Valor anunciado, valor com decisão final de investimento tomada, e valor desembolsado são três categorias que não se somam. Aplique a régua de maturidade: existe contrato de energia, comprador contratado e financiamento aprovado? Sem esses três, o número é uma intenção com uma cifra ao lado, e a redação correta é \"anunciou intenção de desenvolver projeto de até X, condicionado a energia, licenciamento, contrato de compra e financiamento\".",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[8]",
      "linha": 2579
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[8].summary_literal.texto",
        "linha": 2579,
        "trecho": "Exercício 09 · Classificação de número — três cifras chegaram numa apresentação"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[8].enunciado.texto",
        "linha": 2579,
        "trecho": "\"Capacidade instalada de 218 GW\", \"50 GW de geração distribuída\" e \"US$ 4 bilhões em projeto de hidrogênio\". Que perguntas você faz antes de repetir cada uma?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[8].resposta_referencia.texto",
        "linha": 2579,
        "trecho": "Para as duas primeiras: capacidade instalada não é energia gerada, e essa é a confusão de grandeza mais comum do setor. Pergunte a data de referência, a fonte — que para capacidade é o regulador ou o operador, não o balanço energético — e se o número inclui ou exclui geração distribuída, porque somá-los duas vezes é erro frequente. Para a terceira: pergunte o estágio. Valor anunciado, valor com decisão final de investimento tomada, e valor desembolsado são três categorias que não se somam. Aplique a régua de maturidade: existe contrato de energia, comprador contratado e financiamento aprovado? Sem esses três, o número é uma intenção com uma cifra ao lado, e a redação correta é \"anunciou intenção de desenvolver projeto de até X, condicionado a energia, licenciamento, contrato de compra e financiamento\"."
      }
    ],
    "alertas": [
      "O INST·03 da Aula 01 tem cartões para \"218 GW de capacidade instalada\" e \"US$ 4 bilhões em projeto de hidrogênio\" com \"o que verificar\" — é a resposta deste exercício. Hoje a AulaV3 só monta o primeiro instrumento da aula (INST·02), então o INST·03 não aparece; se passar a aparecer, abra-o só depois da tentativa."
    ]
  },
  {
    "id": "m12-ex-10",
    "moduloId": "modulo-12",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Articulação</b> — um cientista político pergunta se a presidência brasileira da COP é substância ou protocolo",
    "gabarito": null,
    "referencia": "A pergunta é boa e a resposta honesta tem os dois lados. É substância no sentido de que a presidência define agenda, conduz negociação e pode criar instrumentos — a brasileira criou dois roteiros voluntários justamente sobre os temas em que o consenso falhou, o que é uso ativo da prerrogativa. É protocolo no sentido de que a presidência não tem poder de impor decisão: o texto final depende de consenso das partes, e a ausência de linguagem sobre combustível fóssil e desmatamento no Pacote de Belém demonstra exatamente esse limite. A leitura útil é uma terceira: o teste de substância não é o que a presidência conseguiu aprovar em Belém, é <b>o que o país faz com o mandato até novembro de 2026 e o que implementa domesticamente depois</b>. Conferência produz texto; texto vira efeito por plano nacional, orçamento, regulamento e mensuração — e nenhuma dessas quatro etapas acontece automaticamente. É um critério datado e verificável, o que é melhor do que uma opinião.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[9]",
      "linha": 2597
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[9].summary_literal.texto",
        "linha": 2597,
        "trecho": "Exercício 10 · Articulação — um cientista político pergunta se a presidência brasileira da COP é substância ou protocolo"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[9].resposta_referencia.texto",
        "linha": 2597,
        "trecho": "A pergunta é boa e a resposta honesta tem os dois lados. É substância no sentido de que a presidência define agenda, conduz negociação e pode criar instrumentos — a brasileira criou dois roteiros voluntários justamente sobre os temas em que o consenso falhou, o que é uso ativo da prerrogativa. É protocolo no sentido de que a presidência não tem poder de impor decisão: o texto final depende de consenso das partes, e a ausência de linguagem sobre combustível fóssil e desmatamento no Pacote de Belém demonstra exatamente esse limite. A leitura útil é uma terceira: o teste de substância não é o que a presidência conseguiu aprovar em Belém, é o que o país faz com o mandato até novembro de 2026 e o que implementa domesticamente depois. Conferência produz texto; texto vira efeito por plano nacional, orçamento, regulamento e mensuração — e nenhuma dessas quatro etapas acontece automaticamente. É um critério datado e verificável, o que é melhor do que uma opinião."
      }
    ]
  },
  {
    "id": "m12-ex-11",
    "moduloId": "modulo-12",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Sustentação</b> — dois minutos sobre por que a tarifa americana atingiu etanol e não energia",
    "gabarito": null,
    "referencia": "Porque o critério que organiza a lista de isenção não é diplomático, é de interesse industrial do importador. Petróleo bruto, produtos energéticos e terras-raras são insumos que a indústria doméstica do país importador precisa e não produz em quantidade suficiente; taxá-los seria elevar o custo da própria cadeia interna — motivo pelo qual energia apareceu isenta em todas as configurações da medida desde 2025. Etanol é produto processado que compete diretamente com produção doméstica, e o acesso ao mercado de etanol consta expressamente entre as práticas questionadas na investigação que originou a medida. Açúcar segue a mesma lógica. O padrão, portanto, é consistente e independe de governo: a matéria-prima passa, o produto transformado é taxado. Isso confirma, em um caso concreto, o diagnóstico do vetor cadeia de valor — o Brasil tem acesso preferencial de fato exatamente onde é fornecedor primário, e enfrenta barreira exatamente na etapa em que tentaria agregar valor. E a leitura correta termina com a ressalva de método: a incidência é definida por código tarifário, produto a produto, não por nome de setor.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[10]",
      "linha": 2614
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[10].summary_literal.texto",
        "linha": 2614,
        "trecho": "Exercício 11 · Sustentação — dois minutos sobre por que a tarifa americana atingiu etanol e não energia"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[10].resposta_referencia.texto",
        "linha": 2614,
        "trecho": "Porque o critério que organiza a lista de isenção não é diplomático, é de interesse industrial do importador. Petróleo bruto, produtos energéticos e terras-raras são insumos que a indústria doméstica do país importador precisa e não produz em quantidade suficiente; taxá-los seria elevar o custo da própria cadeia interna — motivo pelo qual energia apareceu isenta em todas as configurações da medida desde 2025. Etanol é produto processado que compete diretamente com produção doméstica, e o acesso ao mercado de etanol consta expressamente entre as práticas questionadas na investigação que originou a medida. Açúcar segue a mesma lógica. O padrão, portanto, é consistente e independe de governo: a matéria-prima passa, o produto transformado é taxado. Isso confirma, em um caso concreto, o diagnóstico do vetor cadeia de valor — o Brasil tem acesso preferencial de fato exatamente onde é fornecedor primário, e enfrenta barreira exatamente na etapa em que tentaria agregar valor. E a leitura correta termina com a ressalva de método: a incidência é definida por código tarifário, produto a produto, não por nome de setor."
      }
    ]
  },
  {
    "id": "m12-ex-12",
    "moduloId": "modulo-12",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Atualização</b> — \"a política brasileira de minerais críticos entrou em vigor\"",
    "gabarito": null,
    "referencia": "Não entrou. O que existe é o Projeto de Lei nº 2.780, de 2024, que institui a Política Nacional de Minerais Críticos e Estratégicos e cria um conselho nacional para industrialização desses minerais, vinculado à Presidência da República. Ele foi aprovado pela Câmara dos Deputados em maio de 2026 e tramita no Senado Federal, com pedido protocolado de tramitação conjunta com projeto correlato — o que tende a alongar o rito. Aprovação em uma Casa não é lei. A consequência prática mais relevante é que o Brasil <b>não tem lista oficial de minerais críticos ou estratégicos</b>: a definição dessa lista seria atribuição do conselho a ser criado. Enquanto isso, o marco mineral em vigor é o dos anos 1960, e esse vazio já teve efeito diplomático concreto — a negociação de cooperação com os Estados Unidos em minerais críticos foi condicionada, pelo lado brasileiro, à consolidação do marco. Para reverificar: a ficha de tramitação nos portais da Câmara e do Senado.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[11]",
      "linha": 2633
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[11].summary_literal.texto",
        "linha": 2633,
        "trecho": "Exercício 12 · Atualização — \"a política brasileira de minerais críticos entrou em vigor\""
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[11].resposta_referencia.texto",
        "linha": 2633,
        "trecho": "Não entrou. O que existe é o Projeto de Lei nº 2.780, de 2024, que institui a Política Nacional de Minerais Críticos e Estratégicos e cria um conselho nacional para industrialização desses minerais, vinculado à Presidência da República. Ele foi aprovado pela Câmara dos Deputados em maio de 2026 e tramita no Senado Federal, com pedido protocolado de tramitação conjunta com projeto correlato — o que tende a alongar o rito. Aprovação em uma Casa não é lei. A consequência prática mais relevante é que o Brasil não tem lista oficial de minerais críticos ou estratégicos: a definição dessa lista seria atribuição do conselho a ser criado. Enquanto isso, o marco mineral em vigor é o dos anos 1960, e esse vazio já teve efeito diplomático concreto — a negociação de cooperação com os Estados Unidos em minerais críticos foi condicionada, pelo lado brasileiro, à consolidação do marco. Para reverificar: a ficha de tramitação nos portais da Câmara e do Senado."
      }
    ]
  },
  {
    "id": "m12-ex-13",
    "moduloId": "modulo-12",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Articulação</b> — \"vocês não são um hub verde, vocês são uma fronteira de commodity\"<br>A provocação é dura e parcialmente verdadeira. Responda sem concordar integralmente nem negar.",
    "gabarito": null,
    "referencia": "A parte verdadeira é o vetor cadeia de valor, e vale reconhecê-la de saída porque negá-la destrói credibilidade: em quatro das cinco frentes deste bloco, o Brasil está do lado do recurso primário e não da etapa de transformação. Terras-raras é o caso extremo — algo em torno de um quarto da reserva mundial pelo levantamento internacional, menos de um por cento da produção. Etanol é o caso confirmado por terceiro: o produto transformado foi taxado, a matéria-prima não. A parte que a provocação omite é que a posição não é estática e tem um ativo raro por trás. A eletricidade brasileira tem fator de emissão de 64,8 quilogramas de CO₂ equivalente por megawatt-hora, o que é vantagem material e verificável para qualquer produto eletrointensivo — alumínio, aço em rota elétrica, materiais de bateria, processamento de dados. Isso não é narrativa: é um número que um comprador europeu sujeito a ajuste de carbono na fronteira consegue usar. A conclusão honesta é que o Brasil tem a <em>condição</em> de agregar valor e ainda não tem a <em>cadeia</em>, e que a diferença entre as duas é execução — infraestrutura, capital, escala e demanda contratada —, não geologia nem recurso natural.",
    "criterio": "Responda em voz alta antes de abrir o gabarito.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "exercicios[12]",
      "linha": 2650
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[12].summary_literal.texto",
        "linha": 2650,
        "trecho": "Exercício 13 · Articulação — \"vocês não são um hub verde, vocês são uma fronteira de commodity\""
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[12].enunciado.texto",
        "linha": 2650,
        "trecho": "A provocação é dura e parcialmente verdadeira. Responda sem concordar integralmente nem negar."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
        "campo": "exercicios[12].resposta_referencia.texto",
        "linha": 2650,
        "trecho": "A parte verdadeira é o vetor cadeia de valor, e vale reconhecê-la de saída porque negá-la destrói credibilidade: em quatro das cinco frentes deste bloco, o Brasil está do lado do recurso primário e não da etapa de transformação. Terras-raras é o caso extremo — algo em torno de um quarto da reserva mundial pelo levantamento internacional, menos de um por cento da produção. Etanol é o caso confirmado por terceiro: o produto transformado foi taxado, a matéria-prima não. A parte que a provocação omite é que a posição não é estática e tem um ativo raro por trás. A eletricidade brasileira tem fator de emissão de 64,8 quilogramas de CO₂ equivalente por megawatt-hora, o que é vantagem material e verificável para qualquer produto eletrointensivo — alumínio, aço em rota elétrica, materiais de bateria, processamento de dados. Isso não é narrativa: é um número que um comprador europeu sujeito a ajuste de carbono na fronteira consegue usar. A conclusão honesta é que o Brasil tem a condição de agregar valor e ainda não tem a cadeia, e que a diferença entre as duas é execução — infraestrutura, capital, escala e demanda contratada —, não geologia nem recurso natural."
      }
    ]
  }
];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-12",
    "criterio": "O critério é oito de dez.",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m12-quiz-q01",
        "enunciado": "Um interlocutor afirma que o Brasil tem \"87% de energia renovável\". Qual é a resposta correta?",
        "alternativas": [
          "Está certo: é o número oficial do balanço nacional para 2025.",
          "Está errado: o número oficial é 86,8%, e a diferença decorre de arredondamento.",
          "Depende da grandeza: a matriz elétrica foi 86,8% renovável em 2025 pelo balanço nacional, e cerca de 87% pelo ranking de instituto internacional; a matriz energética é de cerca de metade.",
          "Está errado: a matriz energética brasileira é de cerca de 50%, e é ela que define a posição do país."
        ],
        "correta": 2,
        "explicacao": "Matriz elétrica e matriz energética são grandezas distintas, e o ranking comparativo entre países do G20 vem de instituto internacional com metodologia própria, não de órgão brasileiro. Escolher só a matriz elétrica infla; escolher só a energética deprime. Citar as duas, com a fonte de cada uma, é a formulação que resiste ao contraditório.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "quiz.questoes[0]",
          "linha": 3942
        }
      },
      {
        "id": "m12-quiz-q02",
        "enunciado": "Em 2 de agosto de 2026, qual é o estado do regime de incentivos ao hidrogênio de baixa emissão de carbono?",
        "alternativas": [
          "Duas leis de 2024 estão em vigor, mas o decreto regulamentador não foi publicado — logo, não há procedimento de habilitação ao regime especial nem edital do crédito fiscal.",
          "O decreto foi publicado durante a COP30, em novembro de 2025, e o regime está operacional.",
          "Não há marco legal: o tema depende de projeto de lei ainda em tramitação.",
          "O regime está operacional, mas restrito aos cinco polos priorizados na chamada pública."
        ],
        "correta": 0,
        "explicacao": "As Leis nº 14.948 e nº 14.990, ambas de 2024, estão vigentes. O decreto foi anunciado como iminente em novembro de 2025 e reiterado ao longo de 2026 sem publicação. Marco legal existente e regime operacional são estados diferentes, e confundi-los altera completamente a leitura de qualquer projeto brasileiro de hidrogênio.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "quiz.questoes[1]",
          "linha": 3949
        }
      },
      {
        "id": "m12-quiz-q03",
        "enunciado": "Como descrever corretamente a situação da política nacional de minerais críticos e estratégicos?",
        "alternativas": [
          "É lei desde maio de 2026, com lista oficial de minerais definida por decreto.",
          "É lei desde 2024, e o que falta é apenas a regulamentação.",
          "Não existe iniciativa legislativa; o marco em vigor é o dos anos 1960.",
          "Há projeto de lei aprovado na Câmara em maio de 2026 e em tramitação no Senado; não é lei, e o país não tem lista oficial de minerais críticos."
        ],
        "correta": 3,
        "explicacao": "Aprovação em uma Casa não é sanção. O projeto seguia no Senado, com pedido de tramitação conjunta com proposta correlata, e a definição da lista seria atribuição do conselho que a própria lei criaria. O marco mineral em vigor continua sendo o dos anos 1960.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "quiz.questoes[2]",
          "linha": 3956
        }
      },
      {
        "id": "m12-quiz-q04",
        "enunciado": "Uma indústria exportadora pergunta se o preço de carbono brasileiro reduz sua exposição ao mecanismo europeu de ajuste na fronteira. Qual é a resposta?",
        "alternativas": [
          "Sim: a lei de dezembro de 2024 já constitui regime equivalente reconhecido.",
          "Não hoje: o regulamento europeu admite desconto por preço de carbono efetivamente pago em regime operante, e o sistema brasileiro seguia em regulamentação, com mercado regulado previsto para o início da década de 2030.",
          "Não, em nenhuma hipótese: o mecanismo não prevê desconto por preço doméstico.",
          "Sim, desde que a empresa participe voluntariamente do mercado de crédito de carbono."
        ],
        "correta": 1,
        "explicacao": "O desconto existe na norma e depende de pagamento efetivo em regime operante. Lei aprovada não é sistema operante — é a mesma distinção do hidrogênio, aplicada a outro objeto. E crédito de mercado voluntário não é preço de carbono regulado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "quiz.questoes[3]",
          "linha": 3963
        }
      },
      {
        "id": "m12-quiz-q05",
        "enunciado": "O que o tratamento tarifário americano dado ao Brasil em 2026 revela sobre a posição do país nas cadeias globais?",
        "alternativas": [
          "Que o Brasil foi poupado, já que mais de dois mil produtos entraram no anexo de isenção.",
          "Que a energia é o setor mais exposto, por ser o principal item da pauta exportadora.",
          "Que a medida foi indiscriminada, atingindo igualmente todos os produtos brasileiros.",
          "Que matéria-prima necessária à indústria importadora passa — produtos energéticos e terras-raras foram isentados — enquanto produto transformado que compete com produção doméstica é taxado, como etanol e açúcar."
        ],
        "correta": 3,
        "explicacao": "O contraste é o diagnóstico mais nítido disponível sobre onde o Brasil está posicionado na cadeia de valor. E o padrão é estrutural: independe de governo, e reaparece na relação com outros parceiros sob formas diferentes.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "quiz.questoes[4]",
          "linha": 3970
        }
      },
      {
        "id": "m12-quiz-q06",
        "enunciado": "Qual afirmação sobre a presidência brasileira da Conferência das Partes estava correta em 2 de agosto de 2026?",
        "alternativas": [
          "Estava vigente, e se encerra com a abertura da COP31, prevista para novembro de 2026, em Antália, com a Austrália conduzindo as negociações.",
          "Havia se encerrado com o fim da conferência de Belém, em novembro de 2025.",
          "Estava vigente e se estende até a COP32, na Etiópia, em 2027.",
          "Havia sido transferida antecipadamente à Turquia em janeiro de 2026."
        ],
        "correta": 0,
        "explicacao": "A presidência é exercida até a abertura da conferência seguinte. Este é um dos itens mais perecíveis do bloco: quem repetir \"presidência vigente\" depois de novembro de 2026 comete erro factual, e a formulação correta passa ao pretérito.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "quiz.questoes[5]",
          "linha": 3977
        }
      },
      {
        "id": "m12-quiz-q07",
        "enunciado": "Por que este módulo apresenta dois números diferentes para a reserva brasileira de terras-raras?",
        "alternativas": [
          "Porque um deles é obsoleto e o outro é o valor corrente.",
          "Porque levantamento internacional e órgão nacional usam metodologias distintas — cerca de 21 milhões de toneladas contra 11,4 milhões —, e apresentar os dois é mais defensável do que escolher o mais favorável.",
          "Porque um mede reserva e o outro mede recurso, e são grandezas incomparáveis.",
          "Porque um valor inclui todos os elementos e o outro apenas os de maior valor comercial."
        ],
        "correta": 1,
        "explicacao": "A distinção recurso-reserva é real e o módulo a trata separadamente, mas não é a razão desta divergência específica: aqui são duas metodologias medindo reserva. A regra do bloco é apresentar ambos com a fonte de cada um — a mesma disciplina aplicada à matriz elétrica.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "quiz.questoes[6]",
          "linha": 3984
        }
      },
      {
        "id": "m12-quiz-q08",
        "enunciado": "Um relatório cita o Aquífero Guarani como \"reserva hídrica estratégica para a geração elétrica brasileira\". O que há de errado?",
        "alternativas": [
          "Nada: o aquífero alimenta os reservatórios das principais bacias.",
          "O aquífero não é brasileiro, e sim compartilhado com outros três países.",
          "A geração hidrelétrica depende de hidrologia de superfície e de armazenamento em reservatórios; o aquífero é água subterrânea transfronteiriça, sem relação operacional com o despacho.",
          "O aquífero está fora do território das bacias com maior potência instalada."
        ],
        "correta": 2,
        "explicacao": "O compartilhamento com outros países é verdadeiro e irrelevante para o erro. A confusão entre água subterrânea e hidrologia de superfície aparece em material de divulgação e é imediatamente identificada por qualquer interlocutor do setor — o que compromete a credibilidade do restante do documento.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "quiz.questoes[7]",
          "linha": 3991
        }
      },
      {
        "id": "m12-quiz-q09",
        "enunciado": "O que ocorreu com os créditos fiscais americanos à geração eólica e solar?",
        "alternativas": [
          "Foram substancialmente extintos por lei de julho de 2025, com prazos de corte por início de obra e por entrada em operação, além de restrições de cadeia de suprimento; a aplicação da regra de início de obra permanecia em disputa judicial em 2026.",
          "Foram ampliados, com prorrogação até meados da década de 2030 para todas as tecnologias.",
          "Permanecem inalterados: a legislação de 2022 segue integralmente vigente.",
          "Foram extintos para todas as tecnologias de geração de baixa emissão, sem exceção."
        ],
        "correta": 0,
        "explicacao": "Duas ressalvas de precisão importam aqui: outras tecnologias mantiveram prazos mais longos, e a regra de comprovação de início de obra foi objeto de litígio em 2026. Dizer que \"o incentivo americano acabou\" sem essas ressalvas é impreciso nos dois sentidos.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "quiz.questoes[8]",
          "linha": 3998
        }
      },
      {
        "id": "m12-quiz-q10",
        "enunciado": "Um interlocutor cita o total de capacidade de hidrogênio anunciada para o Brasil e conclui que o país será um polo exportador. Qual é a réplica correta?",
        "alternativas": [
          "Que o total está superestimado e o número correto é menor.",
          "Que o hidrogênio não é economicamente viável em nenhum país.",
          "Que a conclusão é prematura porque o decreto regulamentador ainda não saiu.",
          "Que anúncio agregado não equivale a capacidade contratada: projetos em estágios distintos — memorando, estudo conceitual e planta com contrato e financiamento — não pertencem à mesma tabela, e a formulação honesta é potencial de implementação com horizonte declarado."
        ],
        "correta": 3,
        "explicacao": "A opção sobre o decreto é verdadeira, mas é apenas um dos itens em falta e não sustenta sozinha a réplica. O erro de método é a soma entre estágios, e é ele que a régua de maturidade existe para desfazer — em hidrogênio e em qualquer outro projeto de infraestrutura energética.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "quiz.questoes[9]",
          "linha": 4005
        }
      }
    ],
    "faixas": [
      {
        "min": 0,
        "max": 7,
        "mensagem": "Abaixo do critério de oito acertos. Antes de refazer, verifique o padrão do erro: quase todas estas questões testam estado — lei contra regulamento, aprovado em uma Casa contra sancionado, anunciado contra contratado — ou grandeza — matriz elétrica contra energética, reserva contra produção. São esses dois os erros que o interlocutor identifica primeiro, e são eles que derrubam a credibilidade do que veio antes."
      },
      {
        "min": 8,
        "max": 10,
        "mensagem": "Critério atingido. A matéria sustenta trinta minutos com interlocutor cético, inclusive a parte mais difícil: recusar a resposta binária sobre se o Brasil é uma boa aposta, e devolver a pergunta em vez de escolher uma das duas colunas."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/modulo.json",
      "campo": "criterio.criterios[m12-crit-quiz].mensagens_do_script",
      "linha": 4047
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
      "campo": "quiz.lede.texto",
      "linha": 2699
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-12",
    "introducao": "O primeiro item é o critério de domínio deste bloco. O último é a pergunta que encerra qualquer conversa de investimento — e a competência que ele testa é a mesma que o Módulo 11 ensinou para proposta comercial, aplicada a afirmação geopolítica.",
    "itens": [
      {
        "id": "m12-checklist-01",
        "texto": "Sustento trinta minutos de conversa geopolítica com um interlocutor cético sem repetir um argumento, percorrendo os oito movimentos do andaime em qualquer ordem de entrada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[0].texto",
          "linha": 2808
        }
      },
      {
        "id": "m12-checklist-02",
        "texto": "Articulo as duas colunas do paradoxo em uma frase cada, com um número datado em cada uma, sem precisar consultar nada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[1].texto",
          "linha": 2809
        }
      },
      {
        "id": "m12-checklist-03",
        "texto": "Nunca cito um percentual de renovabilidade sem dizer se é matriz elétrica ou matriz energética.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[2].texto",
          "linha": 2810
        }
      },
      {
        "id": "m12-checklist-04",
        "texto": "Declaro o ano-base de todo dado do Balanço Energético Nacional, e sei que ele muda anualmente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[3].texto",
          "linha": 2811
        }
      },
      {
        "id": "m12-checklist-05",
        "texto": "Sei que o ranking do G20 não vem de fonte brasileira, e cito as duas fontes com seus números ligeiramente diferentes em vez de escolher o mais favorável.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[4].texto",
          "linha": 2812
        }
      },
      {
        "id": "m12-checklist-06",
        "texto": "Não associo reserva de água subterrânea a geração hidrelétrica, e sei que o referente correto são as bacias de superfície.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[5].texto",
          "linha": 2813
        }
      },
      {
        "id": "m12-checklist-07",
        "texto": "Trato a COP30 como fato consumado, com data, resultado e o que ficou fora do consenso.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[6].texto",
          "linha": 2814
        }
      },
      {
        "id": "m12-checklist-08",
        "texto": "Distingo decisão aprovada por consenso das partes de iniciativa voluntária da presidência.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[7].texto",
          "linha": 2815
        }
      },
      {
        "id": "m12-checklist-09",
        "texto": "Sei que a presidência brasileira da COP tem data de término, e verifico se ela ainda está vigente antes de afirmar.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[8].texto",
          "linha": 2816
        }
      },
      {
        "id": "m12-checklist-10",
        "texto": "Trato a Contribuição Nacionalmente Determinada como compromisso, não como previsão, e cito a faixa em vez de um ponto.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[9].texto",
          "linha": 2817
        }
      },
      {
        "id": "m12-checklist-11",
        "texto": "Sei que uso da terra e agropecuária pesam muito no inventário brasileiro, e que eletricidade limpa não compensa desmatamento automaticamente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[10].texto",
          "linha": 2818
        }
      },
      {
        "id": "m12-checklist-12",
        "texto": "Separo as três camadas da relação com a China — ativo regulado, cadeia de equipamento, comércio — em vez de tratá-las como uma só.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[11].texto",
          "linha": 2819
        }
      },
      {
        "id": "m12-checklist-13",
        "texto": "Distingo complementaridade de concentração, e uso a pergunta dos seis meses para testar qual das duas está em jogo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[12].texto",
          "linha": 2820
        }
      },
      {
        "id": "m12-checklist-14",
        "texto": "Sei que os créditos americanos a eólica e solar foram substancialmente extintos por lei de julho de 2025, com prazos datados, e conheço as duas ressalvas que mantêm a descrição honesta.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[13].texto",
          "linha": 2821
        }
      },
      {
        "id": "m12-checklist-15",
        "texto": "Pergunto o dispositivo jurídico antes de perguntar o percentual, e sei que base jurídica define duração, escopo e reversibilidade.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[14].texto",
          "linha": 2822
        }
      },
      {
        "id": "m12-checklist-16",
        "texto": "Distingo alíquota adicional de alíquota total, e sei que a incidência é definida por código tarifário, não por nome de setor.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[15].texto",
          "linha": 2823
        }
      },
      {
        "id": "m12-checklist-17",
        "texto": "Sei que produtos energéticos e terras-raras foram isentados e que etanol e açúcar não foram, e sei o que esse contraste revela sobre a posição do país na cadeia.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[16].texto",
          "linha": 2824
        }
      },
      {
        "id": "m12-checklist-18",
        "texto": "Descrevo mecanismo, cronograma e setor afetado sem avaliar o mérito de processo judicial doméstico nem tomar partido em disputa comercial.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[17].texto",
          "linha": 2825
        }
      },
      {
        "id": "m12-checklist-19",
        "texto": "Sei que o mecanismo europeu de ajuste de carbono cobra do importador, e que o primeiro investimento que ele impõe ao exportador é inventário de emissão por produto, verificado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[18].texto",
          "linha": 2826
        }
      },
      {
        "id": "m12-checklist-20",
        "texto": "Ligo a ausência de regime brasileiro de carbono operacional à ausência de desconto no mecanismo europeu, como cadeia causal e não como coincidência.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[19].texto",
          "linha": 2827
        }
      },
      {
        "id": "m12-checklist-21",
        "texto": "Trato lei sancionada e regulamento em vigor como dois fatos com dois estados de verificação separados.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[20].texto",
          "linha": 2828
        }
      },
      {
        "id": "m12-checklist-22",
        "texto": "Verifico o texto consolidado de uma lei antes de citar prazo, porque a redação original pode ter sido alterada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[21].texto",
          "linha": 2829
        }
      },
      {
        "id": "m12-checklist-23",
        "texto": "Nunca somo valores anunciados de projetos em estágios diferentes, e aplico a régua de maturidade antes de comentar qualquer cifra.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[22].texto",
          "linha": 2830
        }
      },
      {
        "id": "m12-checklist-24",
        "texto": "Digo que a política de minerais críticos é projeto de lei em tramitação, e que o país não tem lista oficial de minerais críticos.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[23].texto",
          "linha": 2831
        }
      },
      {
        "id": "m12-checklist-25",
        "texto": "Cito reserva mineral sempre com fonte e metodologia, e apresento os dois números quando eles divergem.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[24].texto",
          "linha": 2832
        }
      },
      {
        "id": "m12-checklist-26",
        "texto": "Nunca cito dotação mineral sem citar produção, e sei explicar onde está o gargalo de cada cadeia.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[25].texto",
          "linha": 2833
        }
      },
      {
        "id": "m12-checklist-27",
        "texto": "Classifico corretamente, na hora, em qual das seis categorias da taxonomia de nomeação uma entidade encontrada em pesquisa cai, e o que fazer com ela.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[26].texto",
          "linha": 2834
        }
      },
      {
        "id": "m12-checklist-28",
        "texto": "Respondo a \"vale a pena o Brasil apostar nisso?\" com a mesma pergunta de volta sobre premissa e fonte — em qual das duas colunas você está exposto, e a afirmação que você trouxe tem fonte primária e data?",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m12/aparato.json",
          "campo": "checklist.itens[27].texto",
          "linha": 2835
        }
      }
    ]
  }
];
