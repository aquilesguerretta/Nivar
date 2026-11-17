// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m07.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m07/aparato.json e o texto das aulas (Alexandria modulos/alexandria_modulo07.html).
// Itens 'fonte' são literais da extração; 'derivado-da-aula' citam o trecho da aula que os responde.
// Vínculo Ex·NN → aula: regra de 15/11 (última aula que casar por trecho literal); sem casamento → EXERCICIOS_DO_MODULO.
// 14 itens por aula (0 da fonte, 14 derivados) · 12 do módulo · 10 questões na prova · 26 itens no checklist.
// Trocas editoriais: {}.
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m07-a01-d01",
    "moduloId": "modulo-07",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a ficha institucional da aula, quem preside o Conselho Nacional de Política Energética?",
    "alternativas": [
      "Ministro de Minas e Energia",
      "diretor-geral",
      "Casa Civil"
    ],
    "gabarito": 0,
    "referencia": "presidido pelo Ministro de Minas e Energia",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-01 · corpo[13]",
      "linha": 533
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-01 · corpo[13]",
        "linha": 533,
        "trecho": "presidido pelo Ministro de Minas e Energia"
      }
    ]
  },
  {
    "id": "m07-a01-d02",
    "moduloId": "modulo-07",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, o que a política pública escolhe, e o que a regulação faz com essa escolha?",
    "gabarito": null,
    "referencia": "Política pública escolhe o que priorizar Regulação converte essa direção em procedimentos, metodologias, obrigações, incentivos e sanções aplicáveis a agentes identificáveis, dentro de competência definida em lei e com dever de motivação técnica.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-01 · corpo[0]",
      "linha": 480
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-01 · corpo[0]",
        "linha": 480,
        "trecho": "Política pública escolhe o que priorizar"
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-01 · corpo[0]",
        "linha": 480,
        "trecho": "Regulação converte essa direção em procedimentos, metodologias, obrigações, incentivos e sanções aplicáveis a agentes identificáveis, dentro de competência definida em lei e com dever de motivação técnica."
      }
    ]
  },
  {
    "id": "m07-a02-d01",
    "moduloId": "modulo-07",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Pela regra de uso da aula, o que é o plano decenal?",
    "alternativas": [
      "contabilidade histórica",
      "projeção sob premissas para decisão de médio prazo",
      "exploração estratégica de longo prazo"
    ],
    "gabarito": 1,
    "referencia": "o plano decenal é projeção sob premissas para decisão de médio prazo",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-02 · corpo[6]",
      "linha": 630
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-02 · corpo[6]",
        "linha": 630,
        "trecho": "o plano decenal é projeção sob premissas para decisão de médio prazo"
      }
    ]
  },
  {
    "id": "m07-a02-d02",
    "moduloId": "modulo-07",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual é, segundo a ficha da aula, a decisão da EPE com efeito prático mais direto?",
    "alternativas": [
      "outorga",
      "a habilitação",
      "tarifa"
    ],
    "gabarito": 1,
    "referencia": "A habilitação é a decisão da EPE com efeito prático mais direto: projeto não habilitado não participa do certame.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-02 · corpo[2]",
      "linha": 606
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-02 · corpo[2]",
        "linha": 606,
        "trecho": "A habilitação é a decisão da EPE com efeito prático mais direto: projeto não habilitado não participa do certame."
      }
    ]
  },
  {
    "id": "m07-a03-d01",
    "moduloId": "modulo-07",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Quantos membros tem a diretoria da agência reguladora, segundo a aula?",
    "alternativas": [
      "três",
      "cinco",
      "sete",
      "dez"
    ],
    "gabarito": 1,
    "referencia": "A diretoria tem cinco membros, um deles o diretor-geral.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-03 · corpo[4]",
      "linha": 711
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-03 · corpo[4]",
        "linha": 711,
        "trecho": "A diretoria tem cinco membros, um deles o diretor-geral."
      }
    ]
  },
  {
    "id": "m07-a03-d02",
    "moduloId": "modulo-07",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, qual é a diferença entre resolução normativa e resolução homologatória?",
    "gabarito": null,
    "referencia": "A diferença não é de importância — é de natureza jurídica: geral e abstrata contra concreta e individual.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-03 · corpo[19]",
      "linha": 777
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-03 · corpo[19]",
        "linha": 777,
        "trecho": "A diferença não é de importância — é de natureza jurídica: geral e abstrata contra concreta e individual."
      }
    ]
  },
  {
    "id": "m07-a04-d01",
    "moduloId": "modulo-07",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Nos Procedimentos de Rede, quem propõe e quem aprova, segundo a aula?",
    "alternativas": [
      "o operador escreve e aprova as próprias regras",
      "o operador propõe; a agência aprova",
      "a câmara forma e publica"
    ],
    "gabarito": 1,
    "referencia": "o operador propõe; a agência aprova.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-04 · corpo[22]",
      "linha": 979
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-04 · corpo[22]",
        "linha": 979,
        "trecho": "o operador propõe; a agência aprova."
      }
    ]
  },
  {
    "id": "m07-a04-d02",
    "moduloId": "modulo-07",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, quais são as áreas operadas pelos centros regionais do operador?",
    "gabarito": null,
    "referencia": "centros regionais que operam as áreas — Norte e Centro-Oeste, Nordeste, Sudeste e Sul.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-04 · corpo[10]",
      "linha": 939
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-04 · corpo[10]",
        "linha": 939,
        "trecho": "centros regionais que operam as áreas — Norte e Centro-Oeste, Nordeste, Sudeste e Sul."
      }
    ]
  },
  {
    "id": "m07-a05-d01",
    "moduloId": "modulo-07",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, como é a liquidação na câmara de comercialização?",
    "alternativas": [
      "uma bolsa onde toda a energia é comprada na hora",
      "multilateral e por rateio"
    ],
    "gabarito": 1,
    "referencia": "a liquidação é multilateral e por rateio.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-05 · corpo[8]",
      "linha": 1062
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-05 · corpo[8]",
        "linha": 1062,
        "trecho": "a liquidação é multilateral e por rateio."
      }
    ]
  },
  {
    "id": "m07-a05-d02",
    "moduloId": "modulo-07",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, o que o mecanismo de realocação de energia socializa, e o que ele não elimina?",
    "gabarito": null,
    "referencia": "o mecanismo socializa o risco operativo intrassistema — o risco de a sua usina específica ter sido despachada menos — mas não elimina o risco hidrológico agregado do conjunto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-05 · corpo[13]",
      "linha": 1074
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-05 · corpo[13]",
        "linha": 1074,
        "trecho": "o mecanismo socializa o risco operativo intrassistema — o risco de a sua usina específica ter sido despachada menos — mas não elimina o risco hidrológico agregado do conjunto."
      }
    ]
  },
  {
    "id": "m07-a06-d01",
    "moduloId": "modulo-07",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, o que o comitê de monitoramento faz, e o que ele não faz?",
    "gabarito": null,
    "referencia": "O comitê integra informação e recomenda; ele não contrata, não despacha e não regula.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-06 · corpo[2]",
      "linha": 1197
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-06 · corpo[2]",
        "linha": 1197,
        "trecho": "O comitê integra informação e recomenda; ele não contrata, não despacha e não regula."
      }
    ]
  },
  {
    "id": "m07-a06-d02",
    "moduloId": "modulo-07",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, a competência para licenciar um empreendimento se define por quê?",
    "alternativas": [
      "automaticamente federal",
      "critérios legais de porte, localização e natureza do impacto"
    ],
    "gabarito": 1,
    "referencia": "a competência para licenciar não é automaticamente federal. Ela se define por critérios legais de porte, localização e natureza do impacto",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-06 · corpo[11]",
      "linha": 1242
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-06 · corpo[11]",
        "linha": 1242,
        "trecho": "a competência para licenciar não é automaticamente federal. Ela se define por critérios legais de porte, localização e natureza do impacto"
      }
    ]
  },
  {
    "id": "m07-a07-d01",
    "moduloId": "modulo-07",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, a frase institucional descreve o quê — e o que ela não descreve?",
    "gabarito": null,
    "referencia": "a frase descreve a função primária de cada instituição, não o conjunto de suas competências.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-07 · corpo[3]",
      "linha": 1285
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-07 · corpo[3]",
        "linha": 1285,
        "trecho": "a frase descreve a função primária de cada instituição, não o conjunto de suas competências."
      }
    ]
  },
  {
    "id": "m07-a07-d02",
    "moduloId": "modulo-07",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, como é quase todo evento de valor no setor?",
    "alternativas": [
      "agendado com antecedência",
      "invisível",
      "tempo real"
    ],
    "gabarito": 0,
    "referencia": "Quase todo evento de valor no setor é agendado com antecedência",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo07.html",
      "campo": "aula-07-07 · corpo[12]",
      "linha": 1343
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo07.html",
        "campo": "aula-07-07 · corpo[12]",
        "linha": 1343,
        "trecho": "Quase todo evento de valor no setor é agendado com antecedência"
      }
    ]
  }
];

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [
  {
    "id": "m07-ex-01",
    "moduloId": "modulo-07",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A tarifa de uma distribuidora do Nordeste subiu em julho. Quem decidiu, sob qual instrumento, e o que veio antes?",
    "gabarito": null,
    "referencia": "Quem: a agência, em processo tarifário da concessão específica. Instrumento: resolução homologatória com anexos tarifários — não normativa, porque o ato é concreto e individual. Antes: nota técnica da superintendência de gestão tarifária e regulação econômica, aplicação da metodologia do PRORET, fase pública com consulta, voto do relator e deliberação em reunião pública da diretoria colegiada. O que a resposta completa acrescenta: a data não é aleatória — é a data contratual de reajuste ou revisão daquela concessão. E o percentual anunciado é efeito médio: modalidade, nível de tensão, demanda contratada e posto horário mudam o efeito real na unidade.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "exercicios.itens[0].enunciado",
      "linha": 1477
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[0].enunciado",
        "linha": 1477,
        "trecho": "A tarifa de uma distribuidora do Nordeste subiu em julho. Quem decidiu, sob qual instrumento, e o que veio antes?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[0].resposta_de_referencia[0].html",
        "linha": 1477,
        "trecho": "Quem: a agência, em processo tarifário da concessão específica. Instrumento: resolução homologatória com anexos tarifários — não normativa, porque o ato é concreto e individual. Antes: nota técnica da superintendência de gestão tarifária e regulação econômica, aplicação da metodologia do PRORET, fase pública com consulta, voto do relator e deliberação em reunião pública da diretoria colegiada."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[0].resposta_de_referencia[1].html",
        "linha": 1477,
        "trecho": "O que a resposta completa acrescenta: a data não é aleatória — é a data contratual de reajuste ou revisão daquela concessão. E o percentual anunciado é efeito médio: modalidade, nível de tensão, demanda contratada e posto horário mudam o efeito real na unidade."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·01 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco A · roteamento\"."
    ]
  },
  {
    "id": "m07-ex-02",
    "moduloId": "modulo-07",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma usina eólica teve geração cortada por restrição de transmissão. Quem determinou, quem regula a compensação e quem calcula o efeito financeiro?",
    "gabarito": null,
    "referencia": "Determinou: o operador, por limitação operacional decorrente de restrição de rede ou de critério de segurança. Regula: a agência — critérios, tratamento e eventuais mecanismos de compensação são matéria regulatória. Calcula o efeito: a câmara, na contabilização, aplicando as regras vigentes. Armadilha: a tentação é dizer que \"o operador cortou, então o operador paga\". Não é assim. O operador não tem competência para decidir consequência financeira; ele decide o físico. Quem decide se e como há compensação é a norma, e quem apura é a contabilização.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "exercicios.itens[1].enunciado",
      "linha": 1482
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[1].enunciado",
        "linha": 1482,
        "trecho": "Uma usina eólica teve geração cortada por restrição de transmissão. Quem determinou, quem regula a compensação e quem calcula o efeito financeiro?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[1].resposta_de_referencia[0].html",
        "linha": 1482,
        "trecho": "Determinou: o operador, por limitação operacional decorrente de restrição de rede ou de critério de segurança. Regula: a agência — critérios, tratamento e eventuais mecanismos de compensação são matéria regulatória. Calcula o efeito: a câmara, na contabilização, aplicando as regras vigentes."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[1].resposta_de_referencia[1].html",
        "linha": 1482,
        "trecho": "Armadilha: a tentação é dizer que \"o operador cortou, então o operador paga\". Não é assim. O operador não tem competência para decidir consequência financeira; ele decide o físico. Quem decide se e como há compensação é a norma, e quem apura é a contabilização."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·02 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco A · roteamento\"."
    ]
  },
  {
    "id": "m07-ex-03",
    "moduloId": "modulo-07",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Duas comercializadoras anunciaram fusão. Quem analisa, sob quais perguntas, e quando a operação está concluída?",
    "gabarito": null,
    "referencia": "Analisa: o conselho de defesa da concorrência, se preenchidos os critérios legais de notificação obrigatória — sob a pergunta \"isso reduz concorrência?\", com definição de mercado relevante, medição de sobreposição e integração e avaliação de rivalidade e entrada. Em paralelo: a agência setorial pode analisar transferência de controle e requisitos regulatórios, e a câmara pode ter validações próprias. São perguntas diferentes sobre o mesmo fato. Concluída quando: depois das aprovações aplicáveis e do fechamento societário — que é um evento distinto e posterior. Consumar antes da aprovação obrigatória é gun jumping.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "exercicios.itens[2].enunciado",
      "linha": 1487
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[2].enunciado",
        "linha": 1487,
        "trecho": "Duas comercializadoras anunciaram fusão. Quem analisa, sob quais perguntas, e quando a operação está concluída?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[2].resposta_de_referencia[0].html",
        "linha": 1487,
        "trecho": "Analisa: o conselho de defesa da concorrência, se preenchidos os critérios legais de notificação obrigatória — sob a pergunta \"isso reduz concorrência?\", com definição de mercado relevante, medição de sobreposição e integração e avaliação de rivalidade e entrada. Em paralelo: a agência setorial pode analisar transferência de controle e requisitos regulatórios, e a câmara pode ter validações próprias. São perguntas diferentes sobre o mesmo fato."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[2].resposta_de_referencia[1].html",
        "linha": 1487,
        "trecho": "Concluída quando: depois das aprovações aplicáveis e do fechamento societário — que é um evento distinto e posterior. Consumar antes da aprovação obrigatória é gun jumping."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·03 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco A · roteamento\"."
    ]
  },
  {
    "id": "m07-ex-04",
    "moduloId": "modulo-07",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Saiu portaria mudando prazo de migração ao mercado livre. Qual secretaria, qual é o próximo passo, e quando isso muda a vida de alguém?",
    "gabarito": null,
    "referencia": "Secretaria: tema de mercado e elegibilidade é da secretaria nacional de energia elétrica. Instrumento: portaria — ato de política, não de regulação. Próximo passo: regulamentação pela agência, ajuste de procedimentos e sistemas pela câmara, e adequação operacional de distribuidoras, varejistas e consumidores. Quando muda a vida de alguém: não na publicação da portaria. Na entrada em vigor da norma regulatória que a implementa, e depois do prazo de adaptação nela previsto. A portaria abre a janela; ela não move ninguém.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "exercicios.itens[3].enunciado",
      "linha": 1492
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[3].enunciado",
        "linha": 1492,
        "trecho": "Saiu portaria mudando prazo de migração ao mercado livre. Qual secretaria, qual é o próximo passo, e quando isso muda a vida de alguém?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[3].resposta_de_referencia[0].html",
        "linha": 1492,
        "trecho": "Secretaria: tema de mercado e elegibilidade é da secretaria nacional de energia elétrica. Instrumento: portaria — ato de política, não de regulação. Próximo passo: regulamentação pela agência, ajuste de procedimentos e sistemas pela câmara, e adequação operacional de distribuidoras, varejistas e consumidores."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[3].resposta_de_referencia[1].html",
        "linha": 1492,
        "trecho": "Quando muda a vida de alguém: não na publicação da portaria. Na entrada em vigor da norma regulatória que a implementa, e depois do prazo de adaptação nela previsto. A portaria abre a janela; ela não move ninguém."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·04 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco A · roteamento\"."
    ]
  },
  {
    "id": "m07-ex-05",
    "moduloId": "modulo-07",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "O comitê de monitoramento deliberou sobre parâmetro de aversão a risco. Por que isso é notícia de mercado?",
    "gabarito": null,
    "referencia": "Porque parâmetro de modelo não é detalhe técnico: os modelos otimizam sob premissas declaradas, e alterar o peso dado a cenários adversos altera a decisão de despacho e, por consequência, o preço de curto prazo. Cadeia: deliberação no comitê → conversão em ato pelas instituições competentes → efeito na cadeia de modelos → efeito em despacho e preço → efeito na contabilização de quem está exposto. O erro correlato: tratar a deliberação como se já fosse o efeito. O comitê recomenda e coordena; a conversão em ato é de outro órgão, e o prazo dessa conversão é a variável que decide se o efeito é neste ciclo ou no próximo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "exercicios.itens[4].enunciado",
      "linha": 1497
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[4].enunciado",
        "linha": 1497,
        "trecho": "O comitê de monitoramento deliberou sobre parâmetro de aversão a risco. Por que isso é notícia de mercado?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[4].resposta_de_referencia[0].html",
        "linha": 1497,
        "trecho": "Porque parâmetro de modelo não é detalhe técnico: os modelos otimizam sob premissas declaradas, e alterar o peso dado a cenários adversos altera a decisão de despacho e, por consequência, o preço de curto prazo. Cadeia: deliberação no comitê → conversão em ato pelas instituições competentes → efeito na cadeia de modelos → efeito em despacho e preço → efeito na contabilização de quem está exposto."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[4].resposta_de_referencia[1].html",
        "linha": 1497,
        "trecho": "O erro correlato: tratar a deliberação como se já fosse o efeito. O comitê recomenda e coordena; a conversão em ato é de outro órgão, e o prazo dessa conversão é a variável que decide se o efeito é neste ciclo ou no próximo."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·05 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco A · roteamento\"."
    ]
  },
  {
    "id": "m07-ex-06",
    "moduloId": "modulo-07",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um consumidor industrial reclama que a distribuidora não resolve um problema de qualidade. Qual é a escada?",
    "gabarito": null,
    "referencia": "Quatro degraus, nesta ordem: canal de atendimento da distribuidora com registro de protocolo; ouvidoria da distribuidora; agência estadual conveniada, quando houver convênio no estado; ouvidoria setorial da agência federal. Pular degrau atrasa, porque cada instância pede o registro da anterior. Base normativa a citar: o módulo de qualidade dos procedimentos de distribuição contém os padrões de continuidade e conformidade que transformam a reclamação de percepção em descumprimento verificável. Reclamação com indicador publicado tem tratamento diferente de reclamação sem.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "exercicios.itens[5].enunciado",
      "linha": 1502
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[5].enunciado",
        "linha": 1502,
        "trecho": "Um consumidor industrial reclama que a distribuidora não resolve um problema de qualidade. Qual é a escada?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[5].resposta_de_referencia[0].html",
        "linha": 1502,
        "trecho": "Quatro degraus, nesta ordem: canal de atendimento da distribuidora com registro de protocolo; ouvidoria da distribuidora; agência estadual conveniada, quando houver convênio no estado; ouvidoria setorial da agência federal. Pular degrau atrasa, porque cada instância pede o registro da anterior."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[5].resposta_de_referencia[1].html",
        "linha": 1502,
        "trecho": "Base normativa a citar: o módulo de qualidade dos procedimentos de distribuição contém os padrões de continuidade e conformidade que transformam a reclamação de percepção em descumprimento verificável. Reclamação com indicador publicado tem tratamento diferente de reclamação sem."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·06 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco A · roteamento\"."
    ]
  },
  {
    "id": "m07-ex-07",
    "moduloId": "modulo-07",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Você precisa da tarifa homologada vigente de uma distribuidora específica. Onde, sob qual filtro, e qual campo se lê primeiro?",
    "gabarito": null,
    "referencia": "Caminho: portal da agência → área de tarifas → busca por distribuidora → processo tarifário vigente → resolução homologatória e seus anexos tarifários. Campo que se lê primeiro: a data de vigência. Depois, o subgrupo e a modalidade tarifária correspondentes à unidade — porque a tabela tem dezenas de linhas e apenas uma se aplica. Só então os valores de demanda e de energia por posto horário. Erro clássico: pegar o percentual de reajuste da notícia em vez do valor homologado da tabela. O percentual é média; a tabela é o que a unidade paga.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "exercicios.itens[6].enunciado",
      "linha": 1509
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[6].enunciado",
        "linha": 1509,
        "trecho": "Você precisa da tarifa homologada vigente de uma distribuidora específica. Onde, sob qual filtro, e qual campo se lê primeiro?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[6].resposta_de_referencia[0].html",
        "linha": 1509,
        "trecho": "Caminho: portal da agência → área de tarifas → busca por distribuidora → processo tarifário vigente → resolução homologatória e seus anexos tarifários."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[6].resposta_de_referencia[1].html",
        "linha": 1509,
        "trecho": "Campo que se lê primeiro: a data de vigência. Depois, o subgrupo e a modalidade tarifária correspondentes à unidade — porque a tabela tem dezenas de linhas e apenas uma se aplica. Só então os valores de demanda e de energia por posto horário."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[6].resposta_de_referencia[2].html",
        "linha": 1509,
        "trecho": "Erro clássico: pegar o percentual de reajuste da notícia em vez do valor homologado da tabela. O percentual é média; a tabela é o que a unidade paga."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·07 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco B · navegação\"."
    ]
  },
  {
    "id": "m07-ex-08",
    "moduloId": "modulo-07",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Você quer saber se existe consulta pública aberta sobre armazenamento. Onde e como?",
    "gabarito": null,
    "referencia": "Caminho: portal da agência → Acesso à informação → Participação social → consultas públicas, filtrando por status \"aberta\" e por tema. Verifique também audiências públicas e tomadas de subsídios, que são listadas separadamente e frequentemente contêm as fases mais precoces. O que baixar: a nota técnica antes da minuta, e a análise de impacto regulatório se houver. A nota técnica revela a premissa; a análise revela quais alternativas foram descartadas e por quê — que é onde mora o melhor ponto de contribuição técnica. Campo que se lê primeiro: a data-limite de contribuição. Tudo o mais é irrelevante se o prazo fechou.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "exercicios.itens[7].enunciado",
      "linha": 1515
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[7].enunciado",
        "linha": 1515,
        "trecho": "Você quer saber se existe consulta pública aberta sobre armazenamento. Onde e como?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[7].resposta_de_referencia[0].html",
        "linha": 1515,
        "trecho": "Caminho: portal da agência → Acesso à informação → Participação social → consultas públicas, filtrando por status \"aberta\" e por tema. Verifique também audiências públicas e tomadas de subsídios, que são listadas separadamente e frequentemente contêm as fases mais precoces."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[7].resposta_de_referencia[1].html",
        "linha": 1515,
        "trecho": "O que baixar: a nota técnica antes da minuta, e a análise de impacto regulatório se houver. A nota técnica revela a premissa; a análise revela quais alternativas foram descartadas e por quê — que é onde mora o melhor ponto de contribuição técnica."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[7].resposta_de_referencia[2].html",
        "linha": 1515,
        "trecho": "Campo que se lê primeiro: a data-limite de contribuição. Tudo o mais é irrelevante se o prazo fechou."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·08 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco B · navegação\"."
    ]
  },
  {
    "id": "m07-ex-09",
    "moduloId": "modulo-07",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Você precisa da série de geração por fonte e subsistema dos últimos doze meses. Onde, em qual formato, com qual defasagem?",
    "gabarito": null,
    "referencia": "Caminho: portal de dados abertos do operador → catálogo de séries → geração por fonte e subsistema, com seleção de período e granularidade. Formato: arquivos em formato aberto, tabulares, adequados a ingestão automatizada. Defasagem: varia por série; dado recente pode ser preliminar e sofrer revisão após apuração de pós-operação. Armadilha declarada: geração medida pelo operador e geração contabilizada pela câmara respondem a perguntas diferentes, com definições e finalidades diferentes. Cruzar as duas séries sem declarar a diferença produz um gráfico que não se defende.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "exercicios.itens[8].enunciado",
      "linha": 1521
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[8].enunciado",
        "linha": 1521,
        "trecho": "Você precisa da série de geração por fonte e subsistema dos últimos doze meses. Onde, em qual formato, com qual defasagem?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[8].resposta_de_referencia[0].html",
        "linha": 1521,
        "trecho": "Caminho: portal de dados abertos do operador → catálogo de séries → geração por fonte e subsistema, com seleção de período e granularidade."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[8].resposta_de_referencia[1].html",
        "linha": 1521,
        "trecho": "Formato: arquivos em formato aberto, tabulares, adequados a ingestão automatizada. Defasagem: varia por série; dado recente pode ser preliminar e sofrer revisão após apuração de pós-operação."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[8].resposta_de_referencia[2].html",
        "linha": 1521,
        "trecho": "Armadilha declarada: geração medida pelo operador e geração contabilizada pela câmara respondem a perguntas diferentes, com definições e finalidades diferentes. Cruzar as duas séries sem declarar a diferença produz um gráfico que não se defende."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·09 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco B · navegação\"."
    ]
  },
  {
    "id": "m07-ex-10",
    "moduloId": "modulo-07",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Você precisa saber quando sai a próxima revisão tarifária da distribuidora que atende uma planta. Como descobre?",
    "gabarito": null,
    "referencia": "Caminho: portal da agência → área de tarifas → concessão específica → processos tarifários, onde constam o histórico e a periodicidade contratual. O contrato de concessão é a fonte definitiva da data e da periodicidade, e está disponível publicamente. Por que isso vale mais que parece: a data define três janelas simultâneas — de renegociação comercial, de participação técnica na fase pública e de acesso à estrutura de custo da distribuidora, que só fica exposta publicamente durante o processo. Nenhuma dessas três aparece na conta de luz.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "exercicios.itens[9].enunciado",
      "linha": 1527
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[9].enunciado",
        "linha": 1527,
        "trecho": "Você precisa saber quando sai a próxima revisão tarifária da distribuidora que atende uma planta. Como descobre?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[9].resposta_de_referencia[0].html",
        "linha": 1527,
        "trecho": "Caminho: portal da agência → área de tarifas → concessão específica → processos tarifários, onde constam o histórico e a periodicidade contratual. O contrato de concessão é a fonte definitiva da data e da periodicidade, e está disponível publicamente."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[9].resposta_de_referencia[1].html",
        "linha": 1527,
        "trecho": "Por que isso vale mais que parece: a data define três janelas simultâneas — de renegociação comercial, de participação técnica na fase pública e de acesso à estrutura de custo da distribuidora, que só fica exposta publicamente durante o processo. Nenhuma dessas três aparece na conta de luz."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·10 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco B · navegação\"."
    ]
  },
  {
    "id": "m07-ex-11",
    "moduloId": "modulo-07",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma manchete diz \"resolução da agência muda regra de comercialização\". Como você verifica em cinco minutos se isso afeta um consumidor livre?",
    "gabarito": null,
    "referencia": "Passo 1: identifique o número e o tipo do ato. Normativa muda regra geral; homologatória não; despacho pode aprovar versão de procedimento com efeito imediato. Passo 2: abra a ementa e o campo de sujeitos — quais agentes são abrangidos e quais estão expressamente fora. Passo 3: vá direto a prazos e transição e a vigência: publicação não é aplicação. Passo 4: verifique revogações, para não continuar operando sob regra revogada. Passo 5: confira no portal da câmara se já existe versão atualizada das regras ou dos procedimentos correspondentes — porque o efeito operacional chega por lá, no sistema, não pelo texto da resolução.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "exercicios.itens[10].enunciado",
      "linha": 1532
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[10].enunciado",
        "linha": 1532,
        "trecho": "Uma manchete diz \"resolução da agência muda regra de comercialização\". Como você verifica em cinco minutos se isso afeta um consumidor livre?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[10].resposta_de_referencia[0].html",
        "linha": 1532,
        "trecho": "Passo 1: identifique o número e o tipo do ato. Normativa muda regra geral; homologatória não; despacho pode aprovar versão de procedimento com efeito imediato. Passo 2: abra a ementa e o campo de sujeitos — quais agentes são abrangidos e quais estão expressamente fora. Passo 3: vá direto a prazos e transição e a vigência: publicação não é aplicação."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[10].resposta_de_referencia[1].html",
        "linha": 1532,
        "trecho": "Passo 4: verifique revogações, para não continuar operando sob regra revogada. Passo 5: confira no portal da câmara se já existe versão atualizada das regras ou dos procedimentos correspondentes — porque o efeito operacional chega por lá, no sistema, não pelo texto da resolução."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·11 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco B · navegação\"."
    ]
  },
  {
    "id": "m07-ex-12",
    "moduloId": "modulo-07",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Você quer ler o diagnóstico oficial mais recente sobre risco de suprimento. Qual documento e onde?",
    "gabarito": null,
    "referencia": "Documento: atas, notas e deliberações do comitê de monitoramento do setor elétrico — que reúne mensalmente o ministério e os titulares da agência, da agência de petróleo e gás, da câmara, da empresa de planejamento e do operador. Caminho: portal do ministério → Assuntos → Conselhos e comitês → CMSE → calendário e reuniões. Por que essa é a resposta certa: é o único documento que integra, num só lugar, armazenamento, carga, disponibilidade, combustível, obras atrasadas e restrição de rede — com a assinatura conjunta das instituições que teriam que agir. Boletins isolados de cada órgão dão pedaços; a ata dá a leitura integrada e, com frequência, antecipa medida com efeito econômico.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "exercicios.itens[11].enunciado",
      "linha": 1537
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[11].enunciado",
        "linha": 1537,
        "trecho": "Você quer ler o diagnóstico oficial mais recente sobre risco de suprimento. Qual documento e onde?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[11].resposta_de_referencia[0].html",
        "linha": 1537,
        "trecho": "Documento: atas, notas e deliberações do comitê de monitoramento do setor elétrico — que reúne mensalmente o ministério e os titulares da agência, da agência de petróleo e gás, da câmara, da empresa de planejamento e do operador."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[11].resposta_de_referencia[1].html",
        "linha": 1537,
        "trecho": "Caminho: portal do ministério → Assuntos → Conselhos e comitês → CMSE → calendário e reuniões."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
        "campo": "exercicios.itens[11].resposta_de_referencia[2].html",
        "linha": 1537,
        "trecho": "Por que essa é a resposta certa: é o único documento que integra, num só lugar, armazenamento, carga, disponibilidade, combustível, obras atrasadas e restrição de rede — com a assinatura conjunta das instituições que teriam que agir. Boletins isolados de cada órgão dão pedaços; a ata dá a leitura integrada e, com frequência, antecipa medida com efeito econômico."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·12 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco B · navegação\"."
    ]
  }
];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-07",
    "criterio": "Dez questões · critério 8/10",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m07-quiz-q01",
        "enunciado": "Uma resolução do conselho de política é publicada com a frase \"caberá à agência reguladora disciplinar a matéria\". O que mudou naquele dia para um agente do setor?",
        "alternativas": [
          "Nada de exigível: abriu-se uma janela em que a regra futura ainda é alterável por contribuição técnica no processo regulatório",
          "Nasceu uma obrigação nova, exigível a partir da publicação",
          "A tarifa passou a ser calculada de outra forma",
          "O operador passou a ter de alterar a programação da operação"
        ],
        "correta": 0,
        "explicacao": "Aula 01 e Inst·02. Resolução de conselho é o ato de maior densidade política e menor autoexecutabilidade do setor. Quando ela delega, o evento contratável não é ela: é o ato regulatório que vem depois — e entre um e outro existe a janela de influência que o Inst·04 mede.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "avaliacao.perguntas[0]",
          "linha": 2926
        }
      },
      {
        "id": "m07-quiz-q02",
        "enunciado": "Quem apura e divulga o preço de curto prazo usado na valoração das diferenças?",
        "alternativas": [
          "A agência reguladora, por resolução homologatória mensal",
          "O operador do sistema, junto com a programação diária",
          "O ministério, por portaria",
          "A câmara de comercialização, conforme metodologia e limites aprovados pela agência"
        ],
        "correta": 3,
        "explicacao": "Aula 05 e Inst·08. A frase correta, palavra por palavra: a agência aprova as regras e os limites; a câmara calcula e publica. Dizer que \"a agência define o preço\" é impreciso e é uma das duas ou três frases que mais custam credibilidade numa conversa técnica.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "avaliacao.perguntas[1]",
          "linha": 2932
        }
      },
      {
        "id": "m07-quiz-q03",
        "enunciado": "Qual é a natureza jurídica do operador do sistema?",
        "alternativas": [
          "Pessoa jurídica de direito privado, associação civil sem fins lucrativos, sob autorização e fiscalização da agência",
          "Empresa pública vinculada ao ministério",
          "Autarquia federal em regime especial",
          "Órgão da administração direta federal"
        ],
        "correta": 0,
        "explicacao": "Aula 04 e Inst·01. E o ponto que a resposta carrega é maior que a resposta: uma entidade de direito privado, que não regula nada, emite instrução operativa vinculante. Autoridade no setor não vem de posição no organograma — vem de competência funcional atribuída em lei e detalhada em procedimento aprovado pelo regulador.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "avaliacao.perguntas[2]",
          "linha": 2938
        }
      },
      {
        "id": "m07-quiz-q04",
        "enunciado": "O plano decenal indica determinada expansão de capacidade por fonte até o fim do horizonte. O que isso obriga?",
        "alternativas": [
          "Obriga os agentes daquela fonte a construírem o montante indicado",
          "Obriga a agência a outorgar autorizações até atingir o montante",
          "Obriga o ministério a realizar leilões daquele volume",
          "Não obriga ninguém: o planejamento é indicativo, não determinativo"
        ],
        "correta": 3,
        "explicacao": "Aula 02 e Inst·03. Indicativo não é determinativo. O plano é o documento que mais move expectativa no setor e o que menos cria obrigação — e somar expansão indicada como se fosse oferta contratada é o erro que transforma planejamento em promessa.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "avaliacao.perguntas[3]",
          "linha": 2944
        }
      },
      {
        "id": "m07-quiz-q05",
        "enunciado": "Uma usina termelétrica com contrato de venda vigente não é despachada durante determinado período. Isso caracteriza descumprimento do contrato?",
        "alternativas": [
          "Sim: se há contrato de venda, a usina precisa gerar",
          "Não necessariamente: despacho é decisão física de operação do sistema e contrato é posição comercial — são planos distintos",
          "Sim, e a apuração cabe ao operador do sistema",
          "Depende de autorização prévia da agência para não gerar"
        ],
        "correta": 1,
        "explicacao": "Aulas 04 e 05, Inst·05 e Inst·08. A separação entre o físico e o financeiro é a ideia mais importante da arquitetura brasileira. Confundir os dois planos é o erro de roteamento mais frequente do setor — e o que este bloco existe para eliminar.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "avaliacao.perguntas[4]",
          "linha": 2950
        }
      },
      {
        "id": "m07-quiz-q06",
        "enunciado": "Onde está a janela real de influência sobre o resultado de uma revisão tarifária periódica?",
        "alternativas": [
          "No processo individual da concessionária, quando a revisão já está em curso",
          "Na reunião pública de deliberação da diretoria",
          "No recurso administrativo posterior à resolução homologatória",
          "Na consulta e audiência pública da metodologia do ciclo, que ocorre antes e vale para todas as concessionárias"
        ],
        "correta": 3,
        "explicacao": "Aula 03, Inst·04 e Inst·08. Quando o processo individual começa, a metodologia já está fechada. É a diferença entre participar do desenho da regra e recorrer da aplicação dela — e é por isso que o Inst·04 separa janela de influência de aviso prévio.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "avaliacao.perguntas[5]",
          "linha": 2956
        }
      },
      {
        "id": "m07-quiz-q07",
        "enunciado": "O comitê de monitoramento do setor elétrico pode determinar uma contratação emergencial de energia?",
        "alternativas": [
          "Sim: é a função para a qual foi criado",
          "Sim, desde que homologado pela agência reguladora",
          "Não: ele acompanha, avalia e recomenda — a execução cabe a quem tem competência para editar o ato correspondente",
          "Não, porque ele só se manifesta sobre combustíveis"
        ],
        "correta": 2,
        "explicacao": "Aula 06 e Inst·08. O comitê não emite ato normativo e não manda em ninguém. E é justamente por isso que o comunicado mensal dele funciona como termômetro: quando o vocabulário muda, alguma coisa muda de rota depois — em outro órgão, por outro instrumento.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "avaliacao.perguntas[6]",
          "linha": 2962
        }
      },
      {
        "id": "m07-quiz-q08",
        "enunciado": "Quem propõe e quem aprova os procedimentos de rede?",
        "alternativas": [
          "A agência propõe e o operador aprova",
          "O operador propõe e a agência aprova",
          "O operador propõe e aprova, por ser o responsável técnico pela operação",
          "O ministério aprova, por portaria"
        ],
        "correta": 1,
        "explicacao": "Aulas 04 e 05, Inst·02 e Inst·08. Nem o operador aprova os próprios procedimentos, nem a câmara aprova as próprias regras. Quem executa não normatiza; quem normatiza não executa. Enunciar essa simetria corretamente vale mais numa conversa técnica do que recitar dez siglas.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "avaliacao.perguntas[7]",
          "linha": 2968
        }
      },
      {
        "id": "m07-quiz-q09",
        "enunciado": "O licenciamento ambiental de um empreendimento de geração é sempre de competência federal?",
        "alternativas": [
          "Sim, por se tratar de infraestrutura de interesse nacional",
          "Sim, sempre que a usina se conectar ao sistema interligado",
          "Não: a competência se define por critérios legais de porte, localização e natureza do impacto, podendo ser federal, estadual ou municipal",
          "Não: a competência é sempre estadual, salvo em unidades de conservação"
        ],
        "correta": 2,
        "explicacao": "Aula 06 e Inst·07. Presumir competência federal e protocolar no lugar errado custa meses só para descobrir o engano. É também o travamento que mais mata projeto no país — e o único da escada em que a instituição competente não é setorial.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "avaliacao.perguntas[8]",
          "linha": 2974
        }
      },
      {
        "id": "m07-quiz-q10",
        "enunciado": "Qual é a diferença entre uma resolução normativa e uma resolução homologatória da agência?",
        "alternativas": [
          "Nenhuma: são nomes distintos para o mesmo tipo de ato",
          "A normativa é geral e abstrata e cria obrigação para todos os que estão na hipótese; a homologatória aplica metodologia já existente a um caso concreto",
          "A homologatória tem hierarquia superior, por depender de deliberação do colegiado",
          "A normativa vale por um ano e a homologatória é permanente"
        ],
        "correta": 1,
        "explicacao": "Aula 03 e Inst·02. É a distinção que organiza a leitura do diário oficial. Resolução normativa muda a regra do jogo e tem janela de participação prévia; resolução homologatória aplica a regra a uma concessão específica, em data contratual conhecida com um ano de antecedência.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "avaliacao.perguntas[9]",
          "linha": 2980
        }
      }
    ],
    "faixas": [
      {
        "min": 8,
        "max": 10,
        "mensagem": "Critério de domínio atingido. Passe para o §Voz na ordem: as quarenta perguntas-relâmpago primeiro, os sete ataques de decisor depois, e então o roteiro de dez minutos — gravado, sem consultar. O critério oficial deste bloco é duplo e é oral: rotear qualquer decisão do setor em quinze segundos e navegar os portais oficiais sem tutorial."
      },
      {
        "min": 0,
        "max": 7,
        "mensagem": "Abaixo do critério de 8/10. Erro de roteamento é a falha mais grave possível neste bloco. Leia os retornos acima, refaça por inteiro as aulas indicadas, repasse o Inst·08 respondendo os seis campos de cabeça antes de clicar, e volte. Não avance para o §Voz antes de fechar 8."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "avaliacao.faixas_de_placar_script",
      "linha": 3011
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
      "campo": "avaliacao.criterio_literal[0]",
      "linha": 1549
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-07",
    "introducao": "Cada item corresponde a uma afirmação que o critério de domínio deste bloco exige. Marque apenas o que você consegue sustentar em voz alta, sem consultar, diante de alguém que trabalha no setor. Item não marcado é aula a refazer, não item a ignorar.",
    "itens": [
      {
        "id": "m07-checklist-01",
        "texto": "Recito a frase institucional completa e faço, sem que ninguém peça, as duas correções que ela exige.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[0].texto",
          "linha": 1682
        }
      },
      {
        "id": "m07-checklist-02",
        "texto": "Enuncio a régua das quatro perguntas e explico por que a quarta é a que separa análise de leitura.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[1].texto",
          "linha": 1683
        }
      },
      {
        "id": "m07-checklist-03",
        "texto": "Distingo política pública de regulação sem usar exemplo, e depois com exemplo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[2].texto",
          "linha": 1684
        }
      },
      {
        "id": "m07-checklist-04",
        "texto": "Digo quais são as duas secretarias do ministério relevantes para eletricidade e endereço uma portaria por tema entre elas.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[3].texto",
          "linha": 1685
        }
      },
      {
        "id": "m07-checklist-05",
        "texto": "Descrevo os seis passos de leitura de uma portaria e sei qual campo revela o que foi delegado a outro órgão.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[4].texto",
          "linha": 1686
        }
      },
      {
        "id": "m07-checklist-06",
        "texto": "Explico o que é o conselho de política energética, quem preside, a quem assessora e por que sua resolução raramente produz obrigação sozinha.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[5].texto",
          "linha": 1687
        }
      },
      {
        "id": "m07-checklist-07",
        "texto": "Explico por que o ministério tem mais poder operacional do que o organograma sugere.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[6].texto",
          "linha": 1688
        }
      },
      {
        "id": "m07-checklist-08",
        "texto": "Enuncio a natureza jurídica da empresa de planejamento e as cinco coisas que ela expressamente não faz.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[7].texto",
          "linha": 1689
        }
      },
      {
        "id": "m07-checklist-09",
        "texto": "Distingo planejamento indicativo de determinativo e identifico a única decisão dela com efeito excludente direto.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[8].texto",
          "linha": 1690
        }
      },
      {
        "id": "m07-checklist-10",
        "texto": "Diferencio plano decenal, balanço e plano nacional pela pergunta que cada um responde e pelo que se lê primeiro em cada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[9].texto",
          "linha": 1691
        }
      },
      {
        "id": "m07-checklist-11",
        "texto": "Enuncio as seis verificações antes de usar um estudo de planejamento em análise própria.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[10].texto",
          "linha": 1692
        }
      },
      {
        "id": "m07-checklist-12",
        "texto": "Descrevo o desenho da diretoria colegiada da agência e listo três filtros que ele cria e o que cada um não resolve.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[11].texto",
          "linha": 1693
        }
      },
      {
        "id": "m07-checklist-13",
        "texto": "Cito os cinco campos que procuro para ler corretamente uma decisão da agência.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[12].texto",
          "linha": 1694
        }
      },
      {
        "id": "m07-checklist-14",
        "texto": "Nomeio os seis eixos da divisão por matéria e sei em qual cai tarifa, em qual cai outorga e em qual cai mediação de conflito.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[13].texto",
          "linha": 1695
        }
      },
      {
        "id": "m07-checklist-15",
        "texto": "Diferencio tomada de subsídios, consulta pública e audiência pública, e digo qual tem maior alavancagem e por quê.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[14].texto",
          "linha": 1696
        }
      },
      {
        "id": "m07-checklist-16",
        "texto": "Diferencio resolução normativa, homologatória, autorizativa e despacho, com um exemplo real de cada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[15].texto",
          "linha": 1697
        }
      },
      {
        "id": "m07-checklist-17",
        "texto": "Enuncio os dez campos da anatomia de uma resolução normativa, em ordem, e sei qual erro nasce de pular o campo de revogações.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[16].texto",
          "linha": 1698
        }
      },
      {
        "id": "m07-checklist-18",
        "texto": "Diferencio PRORET de PRODIST e sei qual deles citar numa reclamação de qualidade de fornecimento.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[17].texto",
          "linha": 1699
        }
      },
      {
        "id": "m07-checklist-19",
        "texto": "Explico por que cada distribuidora tem data própria de reajuste e quais três janelas essa data abre.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[18].texto",
          "linha": 1700
        }
      },
      {
        "id": "m07-checklist-20",
        "texto": "Enuncio a natureza jurídica do operador, quem o compõe, e por que isso torna a fiscalização da agência sobre ele não formal.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[19].texto",
          "linha": 1701
        }
      },
      {
        "id": "m07-checklist-21",
        "texto": "Explico as três propriedades do despacho centralizado brasileiro sem comparar com nenhum outro sistema.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[20].texto",
          "linha": 1702
        }
      },
      {
        "id": "m07-checklist-22",
        "texto": "Descrevo programa mensal e programação diária como produtos com cadência, e identifico o evento semanal que quase ninguém monitora.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[21].texto",
          "linha": 1703
        }
      },
      {
        "id": "m07-checklist-23",
        "texto": "Descrevo o ciclo comercial mensal em etapas e explico o que significa liquidação multilateral por rateio.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[22].texto",
          "linha": 1704
        }
      },
      {
        "id": "m07-checklist-24",
        "texto": "Explico o mecanismo de realocação em uma frase e digo com precisão o que ele não elimina.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[23].texto",
          "linha": 1705
        }
      },
      {
        "id": "m07-checklist-25",
        "texto": "Cito quatro das sete costuras em que a frase para decorar não se sustenta.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[24].texto",
          "linha": 1706
        }
      },
      {
        "id": "m07-checklist-26",
        "texto": "Encontro, sem tutorial: a tarifa homologada de uma concessão, uma consulta pública aberta por tema, uma série de geração no portal aberto, a data do próximo ciclo tarifário de uma distribuidora e a ata mais recente do comitê de monitoramento.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m07/aparato.json",
          "campo": "checklist_final.itens[25].texto",
          "linha": 1707
        }
      }
    ]
  }
];
