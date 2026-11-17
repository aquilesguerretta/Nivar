// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m14-m15.mjs 15 — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m15/aparato.json (§Ex, §Quiz, §Final, fichas declaradas nas aulas) e o texto das aulas
// (MODULO_15_CORPO, conferido contra o HTML). Conferência: verificar-avaliacao-m14-m15.mjs 15.
// 31 itens por aula (20 da fonte, 11 derivados) · 10 questões na prova · 28 itens no checklist.
// Relatório: docs/alexandria-v3/porte/m15.md.

import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m15-ex-01",
    "moduloId": "modulo-15",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Dois campos vizinhos produzem 100 mil bbl/d cada. Qual a receita combinada de quem os produziu?",
    "gabarito": null,
    "referencia": "<p><b>A resposta correta recusa somar.</b> Volume físico soma: são 200 mil bbl/d. Receita não soma sem saber o regime de cada um. Se ambos forem de concessão, os concessionários são titulares de toda a produção e a receita bruta de cada um é volume × preço realizado × participação econômica no consórcio. Se um deles for de partilha, a molécula é da União: o operador recebe custo em óleo mais uma fatia do excedente, e a receita dele pode ser uma fração pequena do volume que produziu. Antes de qualquer conta, três perguntas: <b>regime de cada campo, participação econômica de cada sócio, e — na partilha — percentual de excedente ofertado e estágio de recuperação de custo.</b></p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[0].enunciado",
      "linha": 2807
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[0].enunciado",
        "linha": 2807,
        "trecho": "Dois campos vizinhos produzem 100 mil bbl/d cada. Qual a receita combinada de quem os produziu?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[0].resposta_referencia",
        "linha": 2807,
        "trecho": "A resposta correta recusa somar. Volume físico soma: são 200 mil bbl/d. Receita não soma sem saber o regime de cada um. Se ambos forem de concessão, os concessionários são titulares de toda a produção e a receita bruta de cada um é volume × preço realizado × participação econômica no consórcio. Se um deles for de partilha, a molécula é da União: o operador recebe custo em óleo mais uma fatia do excedente, e a receita dele pode ser uma fração pequena do volume que produziu. Antes de qualquer conta, três perguntas: regime de cada campo, participação econômica de cada sócio, e — na partilha — percentual de excedente ofertado e estágio de recuperação de custo."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 01 · identificação de regime\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 01 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-ex-02",
    "moduloId": "modulo-15",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma fonte informa que 11 das 272 áreas produtoras do país estão em regime de partilha. O que você conclui sobre a importância desse regime?",
    "gabarito": null,
    "referencia": "<p><b>Nada, ainda.</b> Número de áreas não é volume, e volume não é receita. Onze áreas de partilha podem representar uma fatia desproporcional da produção nacional, porque os campos do polígono do pré-sal contratados sob esse regime estão entre os mais produtivos do país. E mesmo o volume não decide a importância fiscal: em partilha a União recebe royalty <em>e</em> excedente em óleo, o que a torna titular física de hidrocarboneto — um fluxo que não existe em concessão. A pergunta correta é: <b>qual a participação dessas áreas na produção, e qual o volume do excedente da União?</b></p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[1].enunciado",
      "linha": 2810
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[1].enunciado",
        "linha": 2810,
        "trecho": "Uma fonte informa que 11 das 272 áreas produtoras do país estão em regime de partilha. O que você conclui sobre a importância desse regime?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[1].resposta_referencia",
        "linha": 2810,
        "trecho": "Nada, ainda. Número de áreas não é volume, e volume não é receita. Onze áreas de partilha podem representar uma fatia desproporcional da produção nacional, porque os campos do polígono do pré-sal contratados sob esse regime estão entre os mais produtivos do país. E mesmo o volume não decide a importância fiscal: em partilha a União recebe royalty e excedente em óleo, o que a torna titular física de hidrocarboneto — um fluxo que não existe em concessão. A pergunta correta é: qual a participação dessas áreas na produção, e qual o volume do excedente da União?"
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 02 · identificação de regime\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 01 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-ex-03",
    "moduloId": "modulo-15",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um material afirma que \"o mesmo campo opera sob dois regimes\". Isso é possível?",
    "gabarito": null,
    "referencia": "<p><b>Sim, e é o caso de campos originários da cessão onerosa.</b> A cessão onerosa foi contratada com teto volumétrico. Quando o volume recuperável de um campo excedeu o teto cedido, o excedente foi objeto de licitação própria, sob regime de partilha. O resultado é um campo físico único com dois contratos sobre volumes distintos, governança de individualização por cima, e — consequentemente — duas apurações de participação governamental. Qualquer leitura de receita desse campo que use um só regime está errada por construção.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[2].enunciado",
      "linha": 2813
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[2].enunciado",
        "linha": 2813,
        "trecho": "Um material afirma que \"o mesmo campo opera sob dois regimes\". Isso é possível?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[2].resposta_referencia",
        "linha": 2813,
        "trecho": "Sim, e é o caso de campos originários da cessão onerosa. A cessão onerosa foi contratada com teto volumétrico. Quando o volume recuperável de um campo excedeu o teto cedido, o excedente foi objeto de licitação própria, sob regime de partilha. O resultado é um campo físico único com dois contratos sobre volumes distintos, governança de individualização por cima, e — consequentemente — duas apurações de participação governamental. Qualquer leitura de receita desse campo que use um só regime está errada por construção."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 03 · identificação de regime\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 01 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-ex-04",
    "moduloId": "modulo-15",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Numa licitação de partilha, o que as empresas disputam?",
    "gabarito": null,
    "referencia": "<p><b>O percentual de excedente em óleo ofertado à União</b>, a partir de um mínimo definido no edital. O bônus de assinatura é fixo. Isso inverte a lógica da concessão, em que se disputa dinheiro adiantado e programa exploratório. E tem consequência analítica: em partilha, o resultado do leilão informa diretamente quanto da produção futura ficará com o Estado, o que não acontece em concessão, onde a parcela pública depende de alíquotas e de rentabilidade apurada depois.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[3].enunciado",
      "linha": 2816
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[3].enunciado",
        "linha": 2816,
        "trecho": "Numa licitação de partilha, o que as empresas disputam?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[3].resposta_referencia",
        "linha": 2816,
        "trecho": "O percentual de excedente em óleo ofertado à União, a partir de um mínimo definido no edital. O bônus de assinatura é fixo. Isso inverte a lógica da concessão, em que se disputa dinheiro adiantado e programa exploratório. E tem consequência analítica: em partilha, o resultado do leilão informa diretamente quanto da produção futura ficará com o Estado, o que não acontece em concessão, onde a parcela pública depende de alíquotas e de rentabilidade apurada depois."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 04 · identificação de regime\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 01 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-ficha-elo-01",
    "moduloId": "modulo-15",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Campo produtor · regime de concessão</b> — O que este número não diz: <b>Preencha.</b> A produção do campo não diz a participação econômica de cada sócio no consórcio, não diz o preço realizado, não diz…",
    "gabarito": null,
    "referencia": "Sem resposta-modelo na fonte para este campo da ficha.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.fichas_de_elo_em_aula[0].campo_a_preencher",
      "linha": 1226
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.fichas_de_elo_em_aula[0].campo_a_preencher",
        "linha": 1226,
        "trecho": "Preencha. A produção do campo não diz a participação econômica de cada sócio no consórcio, não diz o preço realizado, não diz…"
      }
    ],
    "alertas": [
      "Exercício declarado pela própria aula (campo \"Preencha.\" da ficha de elo). A fonte não traz gabarito; a referência declara a ausência (voz da Alexandria)."
    ]
  },
  {
    "id": "m15-ficha-elo-02",
    "moduloId": "modulo-15",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Campo produtor · regime de partilha</b> — O que este número não diz: <b>Preencha.</b> A produção do campo não diz o percentual de excedente ofertado, não diz o estágio de recuperação de custo, não diz…",
    "gabarito": null,
    "referencia": "Sem resposta-modelo na fonte para este campo da ficha.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.fichas_de_elo_em_aula[1].campo_a_preencher",
      "linha": 1240
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.fichas_de_elo_em_aula[1].campo_a_preencher",
        "linha": 1240,
        "trecho": "Preencha. A produção do campo não diz o percentual de excedente ofertado, não diz o estágio de recuperação de custo, não diz…"
      }
    ],
    "alertas": [
      "Exercício declarado pela própria aula (campo \"Preencha.\" da ficha de elo). A fonte não traz gabarito; a referência declara a ausência (voz da Alexandria)."
    ]
  },
  {
    "id": "m15-a01-d01",
    "moduloId": "modulo-15",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "No regime de partilha, de quem é a molécula produzida?",
    "alternativas": [
      "Da empresa contratada, a partir do ponto de medição",
      "Da União",
      "Dos estados produtores"
    ],
    "gabarito": 1,
    "referencia": "A lógica é invertida: a molécula produzida é da União",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo15.html",
      "campo": "section#a01 · bloco 4 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo15.html",
        "campo": "section#a01 · bloco 4 (paragrafo)",
        "linha": null,
        "trecho": "A lógica é invertida: a molécula produzida é da União"
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m15-ex-09",
    "moduloId": "modulo-15",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um país tem 15 bilhões de barris de reserva provada e produz 1,5 bilhão por ano. Quanto tempo dura?",
    "gabarito": null,
    "referencia": "<p>A relação reserva/produção é de <b>10 anos</b>. E <b>não é prazo de esgotamento.</b> O indicador congela o denominador, ignora adições futuras, revisões, declínio natural dos campos e mudança de premissa de preço. Um país com R/P de 10 anos e índice de reposição consistentemente acima de 100% pode produzir por décadas. Um com R/P de 25 anos e reposição zero está encolhendo.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[8].enunciado",
      "linha": 2835
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[8].enunciado",
        "linha": 2835,
        "trecho": "Um país tem 15 bilhões de barris de reserva provada e produz 1,5 bilhão por ano. Quanto tempo dura?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[8].resposta_referencia",
        "linha": 2835,
        "trecho": "A relação reserva/produção é de 10 anos. E não é prazo de esgotamento. O indicador congela o denominador, ignora adições futuras, revisões, declínio natural dos campos e mudança de premissa de preço. Um país com R/P de 10 anos e índice de reposição consistentemente acima de 100% pode produzir por décadas. Um com R/P de 25 anos e reposição zero está encolhendo."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 09 · separação de grandeza\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 02 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-ex-10",
    "moduloId": "modulo-15",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um material cita \"reservas de 28,9 bilhões de barris\" e outro cita \"17,5 bilhões\". Qual está desatualizado?",
    "gabarito": null,
    "referencia": "<p><b>Nenhum.</b> São a mesma data de referência — 31 de dezembro de 2025 — sob critérios diferentes: 3P e 1P. A diferença é de 65%, e as duas afirmações são corretas dentro do seu critério. Este é o erro de fusão mais comum em material externo: citar o número maior sem declarar o critério. Toda menção a reserva exige <b>critério de certeza e data de referência</b>, e a ausência de qualquer um dos dois torna o número incomparável.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[9].enunciado",
      "linha": 2838
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[9].enunciado",
        "linha": 2838,
        "trecho": "Um material cita \"reservas de 28,9 bilhões de barris\" e outro cita \"17,5 bilhões\". Qual está desatualizado?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[9].resposta_referencia",
        "linha": 2838,
        "trecho": "Nenhum. São a mesma data de referência — 31 de dezembro de 2025 — sob critérios diferentes: 3P e 1P. A diferença é de 65%, e as duas afirmações são corretas dentro do seu critério. Este é o erro de fusão mais comum em material externo: citar o número maior sem declarar o critério. Toda menção a reserva exige critério de certeza e data de referência, e a ausência de qualquer um dos dois torna o número incomparável."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 10 · separação de grandeza\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 02 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-a02-d01",
    "moduloId": "modulo-15",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O que faz um recurso virar reserva, segundo a aula, e isso é definitivo?",
    "gabarito": null,
    "referencia": "Um recurso vira reserva por decisão de comercialidade — que depende de preço, custo, tecnologia, logística e licença, e que pode ser revertida se qualquer uma dessas variáveis mudar.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo15.html",
      "campo": "section#a02 · bloco 2 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo15.html",
        "campo": "section#a02 · bloco 2 (paragrafo)",
        "linha": null,
        "trecho": "Um recurso vira reserva por decisão de comercialidade — que depende de preço, custo, tecnologia, logística e licença, e que pode ser revertida se qualquer uma dessas variáveis mudar."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m15-a03-d01",
    "moduloId": "modulo-15",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Royalty e participação especial são tributos?",
    "alternativas": [
      "Sim, são tributos sobre o lucro da operadora",
      "Não: são compensações financeiras, não tributos",
      "Sim, são tarifas reguladas pela ANP"
    ],
    "gabarito": 1,
    "referencia": "royalty e participação especial — são compensações financeiras, não tributos",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo15.html",
      "campo": "section#a03 · bloco 2 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo15.html",
        "campo": "section#a03 · bloco 2 (paragrafo)",
        "linha": null,
        "trecho": "royalty e participação especial — são compensações financeiras, não tributos"
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m15-a03-d02",
    "moduloId": "modulo-15",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Na forma mais simples, de que se compõe a receita de royalty de um mês?",
    "gabarito": null,
    "referencia": "A receita de royalty de um mês é, na sua forma mais simples, volume produzido × preço de referência × alíquota",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo15.html",
      "campo": "section#a03 · bloco 12 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo15.html",
        "campo": "section#a03 · bloco 12 (paragrafo)",
        "linha": null,
        "trecho": "A receita de royalty de um mês é, na sua forma mais simples, volume produzido × preço de referência × alíquota"
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m15-ex-06",
    "moduloId": "modulo-15",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A companhia estatal anunciou reajuste de R$ 0,48 por litro na gasolina. Quanto sobe na bomba?",
    "gabarito": null,
    "referencia": "<p><b>Não se sabe pelo anúncio.</b> O reajuste é da camada 4 — preço do produtor à distribuidora. Entre ela e a bomba há mistura obrigatória, tributos federais, tributo estadual, subvenção econômica quando vigente, custo de base e frete, e margem de revenda. No caso concreto de 28 de maio de 2026, o mesmo comunicado informava desconto de R$ 0,44 por litro no âmbito da subvenção federal — movimento líquido de quatro centavos para a distribuidora. A pergunta certa é: <b>quais outras camadas se moveram na mesma janela?</b></p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[5].enunciado",
      "linha": 2824
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[5].enunciado",
        "linha": 2824,
        "trecho": "A companhia estatal anunciou reajuste de R$ 0,48 por litro na gasolina. Quanto sobe na bomba?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[5].resposta_referencia",
        "linha": 2824,
        "trecho": "Não se sabe pelo anúncio. O reajuste é da camada 4 — preço do produtor à distribuidora. Entre ela e a bomba há mistura obrigatória, tributos federais, tributo estadual, subvenção econômica quando vigente, custo de base e frete, e margem de revenda. No caso concreto de 28 de maio de 2026, o mesmo comunicado informava desconto de R$ 0,44 por litro no âmbito da subvenção federal — movimento líquido de quatro centavos para a distribuidora. A pergunta certa é: quais outras camadas se moveram na mesma janela?"
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 06 · identificação de camada\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 04 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-ex-08",
    "moduloId": "modulo-15",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "O que é \"preço de referência\" no vocabulário da ANP, e por que ele não é o preço de venda?",
    "gabarito": null,
    "referencia": "<p>É a camada 3 — o preço apurado por metodologia própria da agência para servir de base ao cálculo de royalty e de participação especial. Ele existe porque a base de cálculo de uma compensação pública não pode depender do preço que cada operador negociou com cada cliente: isso criaria incentivo direto a subavaliar a venda. <b>Consequência analítica:</b> o valor da produção para efeito fiscal e a receita contábil de um campo são números diferentes, e nenhum dos dois é erro do outro.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[7].enunciado",
      "linha": 2830
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[7].enunciado",
        "linha": 2830,
        "trecho": "O que é \"preço de referência\" no vocabulário da ANP, e por que ele não é o preço de venda?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[7].resposta_referencia",
        "linha": 2830,
        "trecho": "É a camada 3 — o preço apurado por metodologia própria da agência para servir de base ao cálculo de royalty e de participação especial. Ele existe porque a base de cálculo de uma compensação pública não pode depender do preço que cada operador negociou com cada cliente: isso criaria incentivo direto a subavaliar a venda. Consequência analítica: o valor da produção para efeito fiscal e a receita contábil de um campo são números diferentes, e nenhum dos dois é erro do outro."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 08 · identificação de camada\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 04 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-a04-d01",
    "moduloId": "modulo-15",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que um reajuste na camada 4 pode não chegar à bomba?",
    "gabarito": null,
    "referencia": "Um reajuste de camada 4 pode ser integralmente neutralizado por movimento em sentido contrário nas camadas 5 ou 6",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo15.html",
      "campo": "section#a04 · bloco 2 (nota)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo15.html",
        "campo": "section#a04 · bloco 2 (nota)",
        "linha": null,
        "trecho": "Um reajuste de camada 4 pode ser integralmente neutralizado por movimento em sentido contrário nas camadas 5 ou 6"
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m15-ficha-elo-03",
    "moduloId": "modulo-15",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Refinaria · elo 7 da cadeia</b> — O que este número não diz: <b>Preencha.</b> A capacidade instalada não diz o rendimento por produto, não diz a disponibilidade real, não diz…",
    "gabarito": null,
    "referencia": "Sem resposta-modelo na fonte para este campo da ficha.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.fichas_de_elo_em_aula[2].campo_a_preencher",
      "linha": 1922
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.fichas_de_elo_em_aula[2].campo_a_preencher",
        "linha": 1922,
        "trecho": "Preencha. A capacidade instalada não diz o rendimento por produto, não diz a disponibilidade real, não diz…"
      }
    ],
    "alertas": [
      "Exercício declarado pela própria aula (campo \"Preencha.\" da ficha de elo). A fonte não traz gabarito; a referência declara a ausência (voz da Alexandria)."
    ]
  },
  {
    "id": "m15-a05-d01",
    "moduloId": "modulo-15",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Ser autossuficiente em petróleo basta para ser autossuficiente em derivados? O que a aula diz que é preciso?",
    "gabarito": null,
    "referencia": "Autossuficiência em petróleo é uma métrica de volume de cru. Autossuficiência em derivados exige compatibilidade entre quatro coisas: demanda por produto, capacidade instalada, rendimento da configuração e logística de entrega.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo15.html",
      "campo": "section#a05 · bloco 2 (nota)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo15.html",
        "campo": "section#a05 · bloco 2 (nota)",
        "linha": null,
        "trecho": "Autossuficiência em petróleo é uma métrica de volume de cru. Autossuficiência em derivados exige compatibilidade entre quatro coisas: demanda por produto, capacidade instalada, rendimento da configuração e logística de entrega."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m15-ex-05",
    "moduloId": "modulo-15",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um preço de gás de US$ 6 por MMBtu é competitivo?",
    "gabarito": null,
    "referencia": "<p><b>A pergunta anterior é: qual preço?</b> Molécula na saída do processamento, molécula entregue no <i>city gate</i>, gás com transporte contratado até um ponto específico, gás importado por gasoduto, gás liquefeito na origem, ou preço final ao consumidor industrial pela distribuidora estadual — são seis camadas, e a distância entre a primeira e a última não é uma constante. US$ 6 na origem de uma carga liquefeita e US$ 6 entregues a uma fábrica são realidades econômicas incomparáveis: falta somar frete marítimo, internalização, regaseificação, transporte e distribuição ao primeiro.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[4].enunciado",
      "linha": 2821
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[4].enunciado",
        "linha": 2821,
        "trecho": "Um preço de gás de US$ 6 por MMBtu é competitivo?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[4].resposta_referencia",
        "linha": 2821,
        "trecho": "A pergunta anterior é: qual preço? Molécula na saída do processamento, molécula entregue no city gate, gás com transporte contratado até um ponto específico, gás importado por gasoduto, gás liquefeito na origem, ou preço final ao consumidor industrial pela distribuidora estadual — são seis camadas, e a distância entre a primeira e a última não é uma constante. US$ 6 na origem de uma carga liquefeita e US$ 6 entregues a uma fábrica são realidades econômicas incomparáveis: falta somar frete marítimo, internalização, regaseificação, transporte e distribuição ao primeiro."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 05 · identificação de camada\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 06 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-ex-07",
    "moduloId": "modulo-15",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma fonte compara o preço médio do gás industrial no Brasil com o de outro país e conclui que o Brasil é caro. O que verificar antes de aceitar?",
    "gabarito": null,
    "referencia": "<p><b>Cinco coisas.</b> Se as duas cotações estão na mesma camada da cadeia; se ambas incluem ou excluem tributos; se o volume de referência é o mesmo, porque tarifa industrial é escalonada por faixa de consumo; se o câmbio usado é o de mercado ou paridade de poder de compra; e <b>quem produziu a comparação e o que ganha com ela</b>. Comparação entre preço final ao consumidor de um lado e preço de <i>hub</i> do outro é o erro mais comum, e é sempre favorável à tese de quem compara.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[6].enunciado",
      "linha": 2827
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[6].enunciado",
        "linha": 2827,
        "trecho": "Uma fonte compara o preço médio do gás industrial no Brasil com o de outro país e conclui que o Brasil é caro. O que verificar antes de aceitar?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[6].resposta_referencia",
        "linha": 2827,
        "trecho": "Cinco coisas. Se as duas cotações estão na mesma camada da cadeia; se ambas incluem ou excluem tributos; se o volume de referência é o mesmo, porque tarifa industrial é escalonada por faixa de consumo; se o câmbio usado é o de mercado ou paridade de poder de compra; e quem produziu a comparação e o que ganha com ela. Comparação entre preço final ao consumidor de um lado e preço de hub do outro é o erro mais comum, e é sempre favorável à tese de quem compara."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 07 · identificação de camada\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 06 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-ex-12",
    "moduloId": "modulo-15",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Produção bruta de gás de 217 milhões de m³/d significa oferta de 217 milhões de m³/d?",
    "gabarito": null,
    "referencia": "<p><b>Não.</b> O balanço físico é: disponível ≈ bruta − reinjeção − consumo nas unidades − queima e perdas. Em junho de 2026, com 217,35 milhões de m³/d produzidos, chegaram ao mercado <b>64,36 milhões</b> — menos de 30%. O aproveitamento reportado foi de 97%, porque reinjeção e consumo operacional contam como uso e não como perda. As duas afirmações — \"aproveitamento de 97%\" e \"menos de 30% chega ao mercado\" — são simultaneamente verdadeiras e medem coisas diferentes.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[11].enunciado",
      "linha": 2844
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[11].enunciado",
        "linha": 2844,
        "trecho": "Produção bruta de gás de 217 milhões de m³/d significa oferta de 217 milhões de m³/d?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[11].resposta_referencia",
        "linha": 2844,
        "trecho": "Não. O balanço físico é: disponível ≈ bruta − reinjeção − consumo nas unidades − queima e perdas. Em junho de 2026, com 217,35 milhões de m³/d produzidos, chegaram ao mercado 64,36 milhões — menos de 30%. O aproveitamento reportado foi de 97%, porque reinjeção e consumo operacional contam como uso e não como perda. As duas afirmações — \"aproveitamento de 97%\" e \"menos de 30% chega ao mercado\" — são simultaneamente verdadeiras e medem coisas diferentes."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 12 · separação de grandeza\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 06 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-a06-d01",
    "moduloId": "modulo-15",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "O transportador de gás pode ser dono da molécula que transporta?",
    "alternativas": [
      "Pode, desde que tenha autorização da ANP",
      "Não: por desenho regulatório, o transportador não pode ser dono da molécula que transporta",
      "Pode, se for também o distribuidor estadual"
    ],
    "gabarito": 1,
    "referencia": "ela existe por desenho regulatório: o transportador não pode ser dono da molécula que transporta.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo15.html",
      "campo": "section#a06 · bloco 6 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo15.html",
        "campo": "section#a06 · bloco 6 (paragrafo)",
        "linha": null,
        "trecho": "ela existe por desenho regulatório: o transportador não pode ser dono da molécula que transporta."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m15-ficha-elo-04",
    "moduloId": "modulo-15",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Gasoduto de transporte · elo 5 da cadeia</b> — O que este número não diz: <b>Preencha.</b> A capacidade do gasoduto não diz quanto está contratado, não diz quanto está disponível para terceiros, não diz…",
    "gabarito": null,
    "referencia": "Sem resposta-modelo na fonte para este campo da ficha.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.fichas_de_elo_em_aula[3].campo_a_preencher",
      "linha": 2274
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.fichas_de_elo_em_aula[3].campo_a_preencher",
        "linha": 2274,
        "trecho": "Preencha. A capacidade do gasoduto não diz quanto está contratado, não diz quanto está disponível para terceiros, não diz…"
      }
    ],
    "alertas": [
      "Exercício declarado pela própria aula (campo \"Preencha.\" da ficha de elo). A fonte não traz gabarito; a referência declara a ausência (voz da Alexandria)."
    ]
  },
  {
    "id": "m15-ficha-elo-05",
    "moduloId": "modulo-15",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Terminal de regaseificação · elo 6 da cadeia</b> — O que este número não diz: <b>Preencha.</b> A capacidade do terminal não diz quanto do volume é reservado ao uso preferencial do proprietário, não diz…",
    "gabarito": null,
    "referencia": "Sem resposta-modelo na fonte para este campo da ficha.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.fichas_de_elo_em_aula[4].campo_a_preencher",
      "linha": 2288
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.fichas_de_elo_em_aula[4].campo_a_preencher",
        "linha": 2288,
        "trecho": "Preencha. A capacidade do terminal não diz quanto do volume é reservado ao uso preferencial do proprietário, não diz…"
      }
    ],
    "alertas": [
      "Exercício declarado pela própria aula (campo \"Preencha.\" da ficha de elo). A fonte não traz gabarito; a referência declara a ausência (voz da Alexandria)."
    ]
  },
  {
    "id": "m15-a07-d01",
    "moduloId": "modulo-15",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "O que a Lei nº 14.134/2021 mudou no regime do transporte de gás?",
    "alternativas": [
      "Passou de autorização a concessão",
      "Passou de concessão a autorização",
      "Passou a exigir licitação prévia"
    ],
    "gabarito": 1,
    "referencia": "Transporte passou de concessão a autorização, o que remove a necessidade de licitação prévia e muda o modelo de entrada.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo15.html",
      "campo": "section#a07 · bloco 5 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo15.html",
        "campo": "section#a07 · bloco 5 (paragrafo)",
        "linha": null,
        "trecho": "Transporte passou de concessão a autorização, o que remove a necessidade de licitação prévia e muda o modelo de entrada."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m15-ex-13",
    "moduloId": "modulo-15",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma térmica a gás está despachando. O que isso diz sobre o preço do gás?",
    "gabarito": null,
    "referencia": "<p><b>Sozinho, nada.</b> Cinco motivos levam uma térmica a gerar: ordem de mérito, inflexibilidade declarada, restrição elétrica, requisito de acionamento e decisão de garantia de suprimento. Só o primeiro carrega informação econômica sobre o combustível. A pergunta que separa os casos é: <b>a geração está acima ou abaixo da inflexibilidade declarada?</b> A parcela até o patamar de inflexibilidade ocorreria de todo modo, e sua origem econômica costuma ser a retirada mínima do contrato de gás.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[12].enunciado",
      "linha": 2849
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[12].enunciado",
        "linha": 2849,
        "trecho": "Uma térmica a gás está despachando. O que isso diz sobre o preço do gás?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[12].resposta_referencia",
        "linha": 2849,
        "trecho": "Sozinho, nada. Cinco motivos levam uma térmica a gerar: ordem de mérito, inflexibilidade declarada, restrição elétrica, requisito de acionamento e decisão de garantia de suprimento. Só o primeiro carrega informação econômica sobre o combustível. A pergunta que separa os casos é: a geração está acima ou abaixo da inflexibilidade declarada? A parcela até o patamar de inflexibilidade ocorreria de todo modo, e sua origem econômica costuma ser a retirada mínima do contrato de gás."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 13 · acoplamento elétrico\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 08 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-ex-14",
    "moduloId": "modulo-15",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Gás a US$ 10 por MMBtu, câmbio de R$ 5,50 e consumo específico de 7,2 MMBtu/MWh. Qual o custo de combustível por MWh?",
    "gabarito": null,
    "referencia": "<p>10 × 5,50 × 7,2 = <b>R$ 396 por MWh</b>. Somando O&amp;M variável e demais componentes — digamos R$ 55 por MWh — o custo variável simplificado fica em torno de <b>R$ 451 por MWh</b>. Duas observações que a conta não mostra: o preço de US$ 10 é <em>entregue à usina</em> e já inclui transporte contratado; e uma variação de R$ 0,50 no câmbio move o custo de combustível em cerca de R$ 36 por MWh sem que o preço do gás tenha mudado.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[13].enunciado",
      "linha": 2852
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[13].enunciado",
        "linha": 2852,
        "trecho": "Gás a US$ 10 por MMBtu, câmbio de R$ 5,50 e consumo específico de 7,2 MMBtu/MWh. Qual o custo de combustível por MWh?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[13].resposta_referencia",
        "linha": 2852,
        "trecho": "10 × 5,50 × 7,2 = R$ 396 por MWh. Somando O&M variável e demais componentes — digamos R$ 55 por MWh — o custo variável simplificado fica em torno de R$ 451 por MWh. Duas observações que a conta não mostra: o preço de US$ 10 é entregue à usina e já inclui transporte contratado; e uma variação de R$ 0,50 no câmbio move o custo de combustível em cerca de R$ 36 por MWh sem que o preço do gás tenha mudado."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 14 · acoplamento elétrico\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 08 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md).",
      "O cenário (US$ 10/MMBtu, R$ 5,50, 7,2 MMBtu/MWh) é outro que o padrão do INST·09; a conta é a fórmula do §08.1."
    ]
  },
  {
    "id": "m15-ex-15",
    "moduloId": "modulo-15",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Por que o desenho do leilão de reserva de capacidade exclui usinas com inflexibilidade anual positiva?",
    "gabarito": null,
    "referencia": "<p>Porque o produto que o leilão compra é <b>flexibilidade</b>: capacidade de gerar quando o sistema precisar e de não gerar quando não precisar. Uma usina com inflexibilidade anual positiva entrega o contrário — geração que ocorre independentemente da necessidade sistêmica. A consequência é notável: <b>a estrutura de um contrato de gás, negociada anos antes com um vendedor de molécula, determina a elegibilidade de uma usina a um produto do setor elétrico.</b> É a demonstração mais limpa de que as duas cadeias não estão apenas conectadas — estão acopladas.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[14].enunciado",
      "linha": 2855
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[14].enunciado",
        "linha": 2855,
        "trecho": "Por que o desenho do leilão de reserva de capacidade exclui usinas com inflexibilidade anual positiva?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[14].resposta_referencia",
        "linha": 2855,
        "trecho": "Porque o produto que o leilão compra é flexibilidade: capacidade de gerar quando o sistema precisar e de não gerar quando não precisar. Uma usina com inflexibilidade anual positiva entrega o contrário — geração que ocorre independentemente da necessidade sistêmica. A consequência é notável: a estrutura de um contrato de gás, negociada anos antes com um vendedor de molécula, determina a elegibilidade de uma usina a um produto do setor elétrico. É a demonstração mais limpa de que as duas cadeias não estão apenas conectadas — estão acopladas."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 15 · acoplamento elétrico\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 08 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m15.md)."
    ]
  },
  {
    "id": "m15-ficha-elo-06",
    "moduloId": "modulo-15",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>Termelétrica a gás · elo 9 · a fronteira</b> — O que este número não diz: <b>Preencha.</b> O despacho da usina não diz o preço do gás, não diz se houve mérito ou inflexibilidade, não diz…",
    "gabarito": null,
    "referencia": "Sem resposta-modelo na fonte para este campo da ficha.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.fichas_de_elo_em_aula[5].campo_a_preencher",
      "linha": 2476
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.fichas_de_elo_em_aula[5].campo_a_preencher",
        "linha": 2476,
        "trecho": "Preencha. O despacho da usina não diz o preço do gás, não diz se houve mérito ou inflexibilidade, não diz…"
      }
    ],
    "alertas": [
      "Exercício declarado pela própria aula (campo \"Preencha.\" da ficha de elo). A fonte não traz gabarito; a referência declara a ausência (voz da Alexandria)."
    ]
  },
  {
    "id": "m15-a08-d01",
    "moduloId": "modulo-15",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "O que o consumo específico (heat rate) mede?",
    "alternativas": [
      "Quanto gás a usina compra por mês",
      "Quanta energia térmica de combustível a usina consome para entregar um MWh elétrico",
      "Quanto da capacidade a usina declara como inflexível"
    ],
    "gabarito": 1,
    "referencia": "O consumo específico — em inglês heat rate — mede quanta energia térmica de combustível a usina consome para entregar um MWh elétrico.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo15.html",
      "campo": "section#a08 · bloco 2 (formula)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo15.html",
        "campo": "section#a08 · bloco 2 (formula)",
        "linha": null,
        "trecho": "O consumo específico — em inglês heat rate — mede quanta energia térmica de combustível a usina consome para entregar um MWh elétrico."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m15-a09-d01",
    "moduloId": "modulo-15",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Sobre a companhia estatal listada, que quatro coisas a aula manda separar, e quais delas são verificáveis em documento?",
    "gabarito": null,
    "referencia": "A leitura boa separa quatro coisas que costumam ser confundidas: obrigação legal — o que a lei e o estatuto impõem; estratégia aprovada — o que o plano de negócios registra e o conselho sancionou; expectativa política — o que autoridades declaram desejar; e especulação — o que analistas projetam. Só a primeira e a segunda são verificáveis em documento.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo15.html",
      "campo": "section#a09 · bloco 4 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo15.html",
        "campo": "section#a09 · bloco 4 (paragrafo)",
        "linha": null,
        "trecho": "A leitura boa separa quatro coisas que costumam ser confundidas: obrigação legal — o que a lei e o estatuto impõem; estratégia aprovada — o que o plano de negócios registra e o conselho sancionou; expectativa política — o que autoridades declaram desejar; e especulação — o que analistas projetam. Só a primeira e a segunda são verificáveis em documento."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m15-a09-d02",
    "moduloId": "modulo-15",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O que uma licença para perfurar um poço exploratório autoriza — e o que ela não prova?",
    "gabarito": null,
    "referencia": "licença para perfurar um poço exploratório autoriza testar um prospecto sob condicionantes; não prova descoberta, não estabelece reserva e não autoriza produção comercial.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo15.html",
      "campo": "section#a09 · bloco 15 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo15.html",
        "campo": "section#a09 · bloco 15 (paragrafo)",
        "linha": null,
        "trecho": "licença para perfurar um poço exploratório autoriza testar um prospecto sob condicionantes; não prova descoberta, não estabelece reserva e não autoriza produção comercial."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  }
];

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [
  {
    "id": "m15-ex-11",
    "moduloId": "modulo-15",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "O índice de reposição de reservas de um país foi de 147% num ano. Isso é bom?",
    "gabarito": null,
    "referencia": "<p>Significa que se incorporou 47% mais reserva do que se produziu naquele ano — mas a leitura útil <b>decompõe a adição</b>. Nova descoberta, extensão de campo conhecido, revisão técnica, revisão por mudança de premissa de preço, aquisição de participação e reclassificação entre critérios produzem o mesmo indicador com significados muito diferentes. Reposição por revisão de preço se desfaz quando o preço cai. Reposição por descoberta, não. E um ano isolado é volátil por construção.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "exercicios.itens[10].enunciado",
      "linha": 2841
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[10].enunciado",
        "linha": 2841,
        "trecho": "O índice de reposição de reservas de um país foi de 147% num ano. Isso é bom?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
        "campo": "exercicios.itens[10].resposta_referencia",
        "linha": 2841,
        "trecho": "Significa que se incorporou 47% mais reserva do que se produziu naquele ano — mas a leitura útil decompõe a adição. Nova descoberta, extensão de campo conhecido, revisão técnica, revisão por mudança de premissa de preço, aquisição de participação e reclassificação entre critérios produzem o mesmo indicador com significados muito diferentes. Reposição por revisão de preço se desfaz quando o preço cai. Reposição por descoberta, não. E um ano isolado é volátil por construção."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 11 · separação de grandeza\". A fonte não liga este exercício a aula (P9). Fica nos exercícios do módulo: o enunciado dá o IRR do ano (\"147%\"), que é o calculado da previsão do INST·03 na Aula 02, e a fórmula da aula já o escreve (147,03%, velada até a previsão). Na Aula 02 ele entregaria a resposta antes do registro."
    ]
  }
];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-15",
    "criterio": "O critério é oito de dez.",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m15-quiz-q01",
        "enunciado": "Em junho de 2026 o Brasil produziu petróleo e gás em 272 áreas produtoras. Qual a distribuição por regime, e o que ela permite concluir?",
        "alternativas": [
          "254 em partilha, 11 em concessão e 7 em cessão onerosa; a partilha domina porque o pré-sal domina a produção.",
          "272 em concessão; a partilha se aplica apenas a áreas ainda não produtoras.",
          "254 em concessão, 7 em cessão onerosa e 11 em partilha; a distribuição permite somar o volume das três, mas não a receita.",
          "254 em concessão e 18 em partilha; a cessão onerosa foi extinta em 2019."
        ],
        "correta": 2,
        "explicacao": "A distribuição correta é 254 em concessão, 7 em cessão onerosa e 11 em partilha. E a segunda metade da resposta é a que importa: volume físico soma entre regimes, receita não. Nas áreas de partilha, a molécula produzida é da União, e o operador recebe custo em óleo mais fatia do excedente — o que torna a soma de receitas dos três regimes um erro estrutural, e não de arredondamento.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "avaliacao.perguntas[0]",
          "linha": 4022
        }
      },
      {
        "id": "m15-quiz-q02",
        "enunciado": "Uma fonte informa que o Brasil tem 28,877 bilhões de barris de reserva. O que está faltando?",
        "alternativas": [
          "O critério de certeza e a data de referência: o número é 3P em 31/12/2025, e sob critério provado são 17,488 bilhões — 65% menos.",
          "Nada; é o número oficial mais recente publicado pela agência.",
          "Apenas a atualização: o número correto para 2026 é superior a 30 bilhões.",
          "A conversão para metros cúbicos, sem a qual não se compara com o gás."
        ],
        "correta": 0,
        "explicacao": "Os dois números estão corretos na mesma data de referência, sob critérios diferentes. Toda menção a reserva exige critério de certeza e data — sem os dois, o volume não é comparável com nenhum outro, inclusive com o do próprio país no ano anterior. Note ainda uma imprecisão frequente: as reservas brasileiras são <b>declaradas pelas operadoras</b> à agência, que consolida e publica. Não é certificação independente por terceiro.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "avaliacao.perguntas[1]",
          "linha": 4029
        }
      },
      {
        "id": "m15-quiz-q03",
        "enunciado": "Em junho de 2026, a produção bruta de gás foi de 217,35 milhões de m³/d e o aproveitamento reportado foi de 97%. Quanto chegou ao mercado?",
        "alternativas": [
          "Cerca de 210 milhões de m³/d, que é 97% da produção bruta.",
          "Todo o volume, já que o aproveitamento de 97% indica perda de apenas 3%.",
          "Cerca de 150 milhões de m³/d, descontada a queima de 6,63 milhões.",
          "64,36 milhões de m³/d — menos de 30% do bruto, porque reinjeção e consumo nas unidades contam como uso e não como perda."
        ],
        "correta": 3,
        "explicacao": "As duas afirmações — aproveitamento de 97% e menos de 30% chegando ao mercado — são simultaneamente verdadeiras e medem coisas diferentes. O balanço físico é: disponível ≈ bruta − reinjeção − consumo nas unidades − queima e perdas. O indicador de aproveitamento trata reinjeção e consumo operacional como destinos legítimos, o que eles em geral são; mas nenhum dos dois cria oferta comercial.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "avaliacao.perguntas[2]",
          "linha": 4036
        }
      },
      {
        "id": "m15-quiz-q04",
        "enunciado": "Royalty e participação especial: qual afirmação está correta?",
        "alternativas": [
          "São o mesmo tributo, com nomes distintos conforme o ente beneficiário.",
          "Royalty incide sobre o valor da produção e é mensal; participação especial incide sobre receita líquida trimestral após deduções, e alcança um conjunto muito menor de municípios.",
          "Participação especial é mensal e royalty é trimestral, e ambos incidem sobre a mesma base.",
          "Ambos são tributos e por isso só são devidos quando há lucro apurado no campo."
        ],
        "correta": 1,
        "explicacao": "São dois fluxos com bases, periodicidades e beneficiários diferentes — e nenhum dos dois é tributo: são compensações financeiras pela exploração de recurso não renovável. A diferença de alcance é o dado que fixa a distinção na memória: na distribuição de royalties da produção de um único mês, a parcela de partilha sozinha alcançou 546 municípios; na participação especial de um trimestre inteiro, foram 21.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "avaliacao.perguntas[3]",
          "linha": 4043
        }
      },
      {
        "id": "m15-quiz-q05",
        "enunciado": "A companhia estatal anunciou reajuste de R$ 0,48 por litro na gasolina A em 28 de maio de 2026. Qual o efeito correto a reportar?",
        "alternativas": [
          "Aumento de R$ 0,48 por litro na bomba, com defasagem de alguns dias.",
          "Aumento de R$ 0,48 mais o efeito proporcional dos tributos, resultando em mais de R$ 0,60 na bomba.",
          "Nenhum efeito, porque reajustes de refinaria não chegam ao consumidor.",
          "O mesmo comunicado trazia desconto de R$ 0,44 por litro no âmbito da subvenção econômica federal — o efeito líquido para a distribuidora foi de quatro centavos."
        ],
        "correta": 3,
        "explicacao": "É o caso mais limpo de camada confundida do módulo. O reajuste é da camada do produtor; entre ela e a bomba há mistura obrigatória, tributos federais, tributo estadual, subvenção quando vigente, distribuição e revenda. E a subvenção econômica é uma camada nova, de sinal negativo, que praticamente nenhum material de referência anterior a 2026 incorpora.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "avaliacao.perguntas[4]",
          "linha": 4050
        }
      },
      {
        "id": "m15-quiz-q06",
        "enunciado": "Sobre o acesso de terceiros a infraestruturas essenciais de gás, em 4 de agosto de 2026:",
        "alternativas": [
          "Está regulamentado para terminais de gás liquefeito pela Resolução ANP nº 1.003/2026, publicada em 02/07/2026; escoamento e processamento estavam em consulta pública desde 10/07/2026, sem norma vigente.",
          "Está integralmente regulamentado desde a Lei nº 14.134/2021, que dispensa norma infralegal.",
          "Não há regulamentação de nenhuma das três infraestruturas; o princípio permanece inaplicado.",
          "Está regulamentado para escoamento e processamento, e os terminais de gás liquefeito seguem sem norma."
        ],
        "correta": 0,
        "explicacao": "O quarto estado de política é o que separa quem leu a lei de quem leu a resolução. O princípio do art. 28 vige desde 2021; a primeira norma que o operacionaliza saiu cinco anos depois e cobre um dos três tipos de infraestrutura. A norma de solução de conflitos foi adiada para dezembro de 2026, e a própria agência havia previsto concluir a regulamentação de escoamento e processamento em maio de 2026 — prazo interno vencido.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "avaliacao.perguntas[5]",
          "linha": 4057
        }
      },
      {
        "id": "m15-quiz-q07",
        "enunciado": "Gás entregue a US$ 10 por MMBtu, câmbio de R$ 5,50 e consumo específico de 7,2 MMBtu/MWh. Qual o custo de combustível por MWh?",
        "alternativas": [
          "R$ 72,00, obtidos pela divisão do preço do gás pelo consumo específico.",
          "R$ 396,00, obtidos multiplicando preço, câmbio e consumo específico.",
          "R$ 55,00, que é o preço em reais por MMBtu.",
          "Não é possível calcular sem conhecer a potência instalada da usina."
        ],
        "correta": 1,
        "explicacao": "10 × 5,50 × 7,2 = R$ 396 por MWh. Somados operação, manutenção e demais componentes, chega-se ao custo variável unitário. Duas observações que a conta não mostra e que a alternativa quatro testa: potência instalada não entra em nenhum ponto do cálculo de custo variável; e uma variação de R$ 0,50 no câmbio move o custo em cerca de R$ 36 por MWh sem que o preço do gás tenha mudado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "avaliacao.perguntas[6]",
          "linha": 4064
        }
      },
      {
        "id": "m15-quiz-q08",
        "enunciado": "Uma térmica a gás está gerando. O que isso permite inferir sobre o preço do gás?",
        "alternativas": [
          "Que o gás está barato, porque o despacho segue a ordem de mérito.",
          "Que o gás está caro, porque só se aciona térmica em situação de escassez.",
          "Nada, isoladamente: cinco motivos levam uma térmica a despachar — mérito, inflexibilidade declarada, restrição elétrica, requisitos de acionamento e decisão de garantia de suprimento — e só o primeiro carrega sinal econômico.",
          "Que o custo variável declarado é inferior ao preço de curto prazo do submercado."
        ],
        "correta": 2,
        "explicacao": "A pergunta que separa os cinco casos é: a geração está acima ou abaixo do patamar de inflexibilidade declarada? A parcela até a inflexibilidade ocorreria de todo modo, e sua origem econômica costuma ser a retirada mínima do contrato de gás — se o combustível será pago de qualquer forma, gerar é melhor que não gerar. A distinção também aparece na contabilidade: o combustível da parcela inflexível compõe receita fixa, e o do despacho comandado, receita variável.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "avaliacao.perguntas[7]",
          "linha": 4071
        }
      },
      {
        "id": "m15-quiz-q09",
        "enunciado": "Por que o leilão de reserva de capacidade de 2026 excluiu usinas com valor de inflexibilidade de geração anual superior a zero?",
        "alternativas": [
          "Porque usinas inflexíveis têm custo variável mais alto por definição.",
          "Porque a legislação proíbe contratos de longo prazo com térmicas a gás.",
          "Porque a inflexibilidade só se aplica a usinas a carvão, que foram excluídas do certame.",
          "Porque o produto comprado é flexibilidade — capacidade de gerar quando o sistema precisar e de não gerar quando não precisar —, e uma usina com inflexibilidade positiva entrega o oposto disso."
        ],
        "correta": 3,
        "explicacao": "É a demonstração mais limpa de que as duas cadeias não estão apenas conectadas, e sim acopladas: a estrutura de um contrato de gás, negociada anos antes com um vendedor de molécula, determina a elegibilidade de uma usina a um produto do setor elétrico. O mesmo certame exigiu, para usinas a gás, comprovação de disponibilidade de combustível mediante parecer da agência de petróleo — outro ponto em que uma jurisdição decide sobre a outra.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "avaliacao.perguntas[8]",
          "linha": 4078
        }
      },
      {
        "id": "m15-quiz-q10",
        "enunciado": "Um interlocutor pergunta: \"o pré-sal é compatível com os compromissos climáticos?\". Qual é a resposta correta?",
        "alternativas": [
          "Sim: o barril brasileiro tem intensidade de carbono de produção relativamente baixa e desloca barris mais intensivos.",
          "Não: qualquer expansão de produção fóssil é incompatível com orçamentos de carbono.",
          "Devolver a estrutura — compatível com o quê, medido em qual grandeza, sob qual cenário de demanda e em qual horizonte —, apresentar as duas leituras com a mesma qualidade e nomear as três coisas que mudariam a conclusão de cada lado.",
          "Depende exclusivamente do preço do carbono aplicado às operações de produção."
        ],
        "correta": 2,
        "explicacao": "As alternativas um e dois não são falsas — são as duas posições reais da controvérsia, e cada uma tem defensores sérios. Mas elas medem coisas diferentes: a primeira mede custo e emissão por barril produzido e assume demanda dada; a segunda mede emissão acumulada do sistema e questiona a demanda dada. Nenhum ativo da NIVAR emite juízo sobre política pública de preços, sobre estratégia de transição de companhia, nem sobre a continuidade da exploração de hidrocarbonetos. Entrega mecanismo, quem paga, quem recebe e as duas posições.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "avaliacao.perguntas[9]",
          "linha": 4085
        }
      }
    ],
    "faixas": [
      {
        "min": 8,
        "max": 10,
        "mensagem": "Critério atingido. A matéria sustenta uma conversa de uma hora com um analista de óleo e gás, um comprador industrial de molécula ou um gestor de ente produtor — inclusive a parte mais difícil: recusar a pergunta sobre se o pré-sal é compatível com o clima, devolvendo grandeza, cenário, horizonte e as duas posições."
      },
      {
        "min": 0,
        "max": 7,
        "mensagem": "Abaixo do critério de oito acertos. Antes de refazer, verifique o padrão do erro: quase todas estas questões testam <b>regime</b> — quem é dono da molécula, e por que receitas não se somam —, <b>camada</b> — em qual dos seis pontos aquele preço se formou —, <b>grandeza</b> — recurso, reserva ou produção, bruta ou disponibilizada — ou <b>acoplamento</b> — mérito econômico contra inflexibilidade contratual. São esses quatro que derrubam a credibilidade de tudo que veio antes."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "avaliacao.faixas_de_placar_script",
      "linha": null
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
      "campo": "avaliacao.criterio_literal_prosa",
      "linha": 2863
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-15",
    "introducao": "O primeiro item é o critério construído no §00.4, na sua forma operacional. O último é o mais difícil de todos, e é o que separa analista de militante.",
    "itens": [
      {
        "id": "m15-checklist-01",
        "texto": "Diante de qualquer número de petróleo ou gás, nomeio em menos de um minuto o <b>regime</b>, a <b>camada</b> e a <b>grandeza</b> — e digo qual dos três a fonte omitiu.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[0].html",
          "linha": 2928
        }
      },
      {
        "id": "m15-checklist-02",
        "texto": "Recuso somar receitas de campos sob regimes diferentes, e explico por que o volume físico soma e a receita não.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[1].html",
          "linha": 2929
        }
      },
      {
        "id": "m15-checklist-03",
        "texto": "Distingo concessão, partilha e cessão onerosa por titularidade da molécula, e não por tamanho de campo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[2].html",
          "linha": 2930
        }
      },
      {
        "id": "m15-checklist-04",
        "texto": "Sei que em licitação de partilha o bônus é fixo e o que se disputa é o percentual de excedente em óleo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[3].html",
          "linha": 2931
        }
      },
      {
        "id": "m15-checklist-05",
        "texto": "Sei que a União recebe hidrocarboneto em espécie na partilha, que a PPSA o comercializa, e que os leilões de gás da União começaram a ser estruturados em 2026.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[4].html",
          "linha": 2932
        }
      },
      {
        "id": "m15-checklist-06",
        "texto": "Reconheço quando um campo único opera sob dois regimes simultâneos, e por que isso obriga a duas apurações.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[5].html",
          "linha": 2933
        }
      },
      {
        "id": "m15-checklist-07",
        "texto": "Explico o que é acordo de individualização da produção e por que ele existe.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[6].html",
          "linha": 2934
        }
      },
      {
        "id": "m15-checklist-08",
        "texto": "Separo recurso contingente, reserva e produção sem converter um no outro por regra de três.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[7].html",
          "linha": 2935
        }
      },
      {
        "id": "m15-checklist-09",
        "texto": "Nunca cito reserva sem critério de certeza declarado e sem data de referência.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[8].html",
          "linha": 2936
        }
      },
      {
        "id": "m15-checklist-10",
        "texto": "Sei que reservas brasileiras são <b>declaradas pelas operadoras</b> à agência, e não certificadas por terceiro independente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[9].html",
          "linha": 2937
        }
      },
      {
        "id": "m15-checklist-11",
        "texto": "Leio relação reserva/produção como indicador estático, nunca como prazo de esgotamento.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[10].html",
          "linha": 2938
        }
      },
      {
        "id": "m15-checklist-12",
        "texto": "Decomponho índice de reposição por origem: descoberta, extensão, revisão técnica, revisão de preço, aquisição, reclassificação.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[11].html",
          "linha": 2939
        }
      },
      {
        "id": "m15-checklist-13",
        "texto": "Separo os sete fluxos ao Estado, e sei que royalty e participação especial têm bases, periodicidades e beneficiários diferentes.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[12].html",
          "linha": 2940
        }
      },
      {
        "id": "m15-checklist-14",
        "texto": "Sei que royalty e participação especial são compensações financeiras, não tributos.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[13].html",
          "linha": 2941
        }
      },
      {
        "id": "m15-checklist-15",
        "texto": "Apresento a disputa federativa por rendas petrolíferas com os dois argumentos nomeados, sem declarar vencedor.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[14].html",
          "linha": 2942
        }
      },
      {
        "id": "m15-checklist-16",
        "texto": "Leio receita fiscal de petróleo como função simultânea de volume, preço de referência e câmbio — nunca de um só.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[15].html",
          "linha": 2943
        }
      },
      {
        "id": "m15-checklist-17",
        "texto": "Nomeio as seis camadas de preço entre a referência internacional e a bomba, e digo em qual delas o número citado se formou.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[16].html",
          "linha": 2944
        }
      },
      {
        "id": "m15-checklist-18",
        "texto": "Sei que a subvenção econômica é uma camada de sinal negativo, temporária, e verifico o estado dela na data.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[17].html",
          "linha": 2945
        }
      },
      {
        "id": "m15-checklist-19",
        "texto": "Descrevo a estratégia comercial de preços como mecanismo, com as duas posições, e não emito juízo sobre ela.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[18].html",
          "linha": 2946
        }
      },
      {
        "id": "m15-checklist-20",
        "texto": "Explico por que exportar cru e importar derivado pode ser economicamente correto, separando as quatro causas possíveis do déficit.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[19].html",
          "linha": 2947
        }
      },
      {
        "id": "m15-checklist-21",
        "texto": "Leio margem de refino como spread e não como preço, e sei que ela depende de configuração antes de depender de eficiência.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[20].html",
          "linha": 2948
        }
      },
      {
        "id": "m15-checklist-22",
        "texto": "Distingo produção bruta de gás de gás disponibilizado ao mercado, e sei por que aproveitamento de 97% convive com menos de 30% chegando ao mercado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[21].html",
          "linha": 2949
        }
      },
      {
        "id": "m15-checklist-23",
        "texto": "Sei que molécula e transporte são contratos separados, com retirada mínima e indexação defasada, e que o preço do gás quase nunca é o do dia.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[22].html",
          "linha": 2950
        }
      },
      {
        "id": "m15-checklist-24",
        "texto": "Aplico os quatro estados de política ao Novo Mercado de Gás, dispositivo por dispositivo, com data.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[23].html",
          "linha": 2951
        }
      },
      {
        "id": "m15-checklist-25",
        "texto": "Somo frete, internalização, regaseificação e transporte antes de comparar gás liquefeito na origem com gás no <i>city gate</i>.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[24].html",
          "linha": 2952
        }
      },
      {
        "id": "m15-checklist-26",
        "texto": "Nomeio os cinco motivos de despacho térmico e sei que só um carrega informação econômica sobre o combustível.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[25].html",
          "linha": 2953
        }
      },
      {
        "id": "m15-checklist-27",
        "texto": "Monto o custo variável a partir de gás entregue, câmbio e consumo específico, e sei que uma variação cambial move o custo sem que o gás tenha mudado de preço.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[26].html",
          "linha": 2954
        }
      },
      {
        "id": "m15-checklist-28",
        "texto": "<b>Recuso tanto \"o pré-sal financia a transição\" quanto \"o pré-sal é incompatível com o clima\" como conclusões</b> — devolvo mecanismo, quem paga, quem recebe, e as três coisas que mudariam a leitura de cada lado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m15/aparato.json",
          "campo": "checklist_final.itens[27].html",
          "linha": 2955
        }
      }
    ]
  }
];
