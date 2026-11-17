// Calculadoras do M10 — os onze instrumentos, porte verbatim do <script> da fonte
// (`Alexandria modulos/alexandria_modulo10.html`, L3606–4809). Posse: a sessão de porte do M10.
// Uma chave aqui SUBSTITUI a de mesmo id em INSTRUMENT_CALCULATORS.
//
// POR QUE RE-PORTAR. A extração (m10/instrumentos.md, "Comparação com o código") mediu
// 10 dos 11 instrumentos antigos como divergentes da fonte — números certos, mas rótulos
// de painel reescritos, readouts que não existiam (Maior desvio, Situação do dossiê,
// Estado da leitura), tempo em segundos em vez de "X min Y s", e a árvore de ramos do
// INST·11 reescrita (nenhum dos dois títulos do código existe na fonte). Aqui os onze
// voltam ao script, linha a linha; o INST·02, já fiel, entra junto para que o
// conferidor cubra os onze pelo mesmo caminho.
//
// COMO. Dados (`var LENTE`, `var FAIXA`, `var ENC`…) são o JSON da extração verificada,
// escrito entre os marcadores DADOS-GERADOS por
// tools/alexandria-dados/porte/gerar-dados-calculadoras-m10.mjs — nada digitado.
// Conferido por tools/alexandria-dados/porte/verificar-instrumentos-m10.mjs, que roda o
// script ORIGINAL no mini-dom e compara saída por saída.
//
// O QUE O CONTRATO DA AULA PEDE E A FONTE FAZ DIFERENTE:
//   · Cada readout é uma saída: número em `valores` (previsão) e o texto da fonte, com o
//     `fmt` dela, em `textos`. Veredito, cartões, painéis e barras vão em `veredito`, em
//     HTML curto, na ordem da tela da fonte; cartão = "<b>rótulo</b><br>texto".
//   · Grade de chips vira `select`. Onde a fonte começa sem seleção (INST·01, ·07, ·08,
//     ·10), o padrão é '' e o painel diz o que a fonte diz nesse estado ("Escolha…").
//   · INST·08 e ·10: o segundo clique no chip (marcar como verificada / executado) vira
//     um campo por etapa, com as palavras da fonte ("verificada", "executado").
//   · INST·05 e ·06: a fonte reescreve o campo preso (`pta>tot`, janela excedida); aqui o
//     cálculo é o mesmo, sem reescrever o campo — o valor preso entra na conta igual.
//   · `vereditoPtBr: true` em todos: o texto já vem em pt-BR ("1.050 kW").

import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';

// <DADOS-GERADOS>
// Gerado por tools/alexandria-dados/porte/gerar-dados-calculadoras-m10.mjs. Não editar à mão.
/** INST·01 · `var LENTE` (L3611–3618). */
const I01_LENTE = {
  "unit": {
    "t": "Quem define o valor unitário",
    "d": "Esta lente separa o Eixo 3 de todo o resto. O valor unitário de cada componente vem de uma de quatro origens: processo tarifário conduzido pela agência reguladora para aquela concessionária específica, lei federal que institui encargo, legislação de ente federativo que institui tributo, ou ato da agência que fixa o adicional de bandeira. <b>Nenhuma decisão da empresa move qualquer um desses valores.</b> Repare, ao percorrer as catorze linhas, que a resposta desta lente é sempre a mesma para famílias inteiras — e que isso é justamente o que torna inútil qualquer conversa de negociação sobre elas."
  },
  "qtd": {
    "t": "Quem define a quantidade",
    "d": "Esta é a lente do Eixo 1, e é onde mora o trabalho. A quantidade sobre a qual cada valor unitário incide é determinada por decisões da empresa em quase todas as linhas: quanto de energia consome, em que posto consome, quanto de demanda reservou, quanto de reativo excedeu, quanto tempo o ciclo durou. <b>Toda melhoria aqui se propaga automaticamente pelo Eixo 3</b>, porque reduz a base sobre a qual preços não controláveis incidem. Percorra as linhas e conte quantas têm resposta \"a empresa\" nesta lente: é o tamanho real da alavanca."
  },
  "ciclo": {
    "t": "Em que ciclo aquilo muda",
    "d": "Esta é a lente do Eixo 4, a lente do tempo, e ela existe para impedir o erro analítico mais frequente do setor: comparar dois meses sem declarar o que mudou no meio. Quatro relógios rodam em paralelo — reajuste anual da concessionária na data de aniversário dela, revisão periódica em ciclo contratual mais espaçado, acionamento mensal de bandeira, e calendário legal de mudança de regra. <b>Uma linha cuja resposta aqui é \"mensal\" nunca deve ser comparada entre dois meses sem verificar a cor da bandeira em cada um.</b>"
  }
} as const;
/** INST·01 · `var LINHAS` (L3620–3677). */
const I01_LINHAS = [
  {
    "id": "te-p",
    "n": "Consumo de energia — ponta",
    "c": "Energia",
    "unit": "Tarifa de energia do posto de ponta, homologada no processo tarifário da concessionária que atende a unidade. Não existe valor nacional: o mesmo componente tem valor diferente em cada área de concessão, e muda na data de aniversário tarifário de cada uma.",
    "qtd": "A empresa, integralmente. É a energia efetivamente medida dentro da janela de três horas diárias em dias úteis. Duas alavancas atuam sobre ela: eficiência do processo, que reduz o total, e deslocamento de carga, que transfere volume para fora da janela.",
    "ciclo": "Valor unitário muda no reajuste anual da concessionária e pode mudar de estrutura na revisão periódica. A própria janela de ponta é aprovada na revisão, o que significa que a quantidade faturada neste posto pode mudar sem que a planta tenha alterado nada."
  },
  {
    "id": "te-fp",
    "n": "Consumo de energia — fora de ponta",
    "c": "Energia",
    "unit": "Tarifa de energia do posto fora de ponta, homologada no mesmo processo. Estruturalmente inferior à de ponta, e é dessa diferença que nasce o sinal econômico de deslocamento de carga.",
    "qtd": "A empresa. É o volume medido em todas as horas complementares à ponta, incluindo fins de semana e os feriados relacionados em norma. Deslocamento de carga aumenta esta quantidade ao reduzir a anterior — o total não cai, apenas se reorganiza.",
    "ciclo": "Reajuste anual e revisão periódica, como o componente de ponta. Uma mudança na definição do posto de ponta redistribui automaticamente volume entre esta linha e a anterior."
  },
  {
    "id": "tusd-e",
    "n": "Uso do sistema — parcela sobre energia",
    "c": "Rede",
    "unit": "Componente da tarifa de uso do sistema de distribuição aplicado por unidade de energia, homologado no processo tarifário. Carrega dentro de si componentes de fio e itens setoriais que não aparecem desagregados na fatura.",
    "qtd": "A empresa, pela mesma via da energia: é o volume consumido. Esta é a linha que melhor demonstra a assimetria do Eixo 3 — a empresa não move o valor unitário, mas cada megawatt-hora economizado reduz esta linha na mesma proporção.",
    "ciclo": "Reajuste anual e revisão periódica. Os itens setoriais embutidos podem mudar por lei fora do ciclo tarifário, e o efeito aparece no processo seguinte."
  },
  {
    "id": "tusd-d",
    "n": "Uso do sistema — parcela sobre demanda",
    "c": "Rede",
    "unit": "Componente da tarifa de uso aplicado por unidade de potência, homologado no processo tarifário. Na modalidade que separa demanda por posto, há valores distintos para ponta e fora de ponta, e o de ponta é o mais alto da estrutura.",
    "qtd": "A empresa, pela demanda contratada e pela demanda medida, conforme a regra de faturamento aplicável. É a quantidade mais diretamente contratual de toda a fatura, e a que mais frequentemente carrega uma decisão de anos atrás.",
    "ciclo": "Reajuste anual e revisão periódica no valor unitário. A quantidade só muda por alteração contratual, com prazo de comunicação à distribuidora — ou seja, é decisão com efeito rápido, mas não instantâneo."
  },
  {
    "id": "dem",
    "n": "Demanda faturada",
    "c": "Demanda",
    "unit": "Aplica-se a tarifa de demanda homologada, por posto quando a modalidade separar. O valor unitário é o mesmo para toda a área de concessão dentro do subgrupo e da modalidade.",
    "qtd": "A empresa, com nuance importante: a quantidade faturada decorre das regras contratuais e pode ser a contratada, a medida ou outra referência. É por isso que a fatura pode cobrar capacidade que a planta não usou, e isso não é irregularidade.",
    "ciclo": "Valor unitário no ciclo anual. A quantidade é revisitável a qualquer momento por decisão da empresa, respeitados prazo e procedimento — e é a única linha da fatura em que errar em qualquer das duas direções custa dinheiro."
  },
  {
    "id": "ultr",
    "n": "Demanda de ultrapassagem",
    "c": "Demanda",
    "unit": "Tarifa de demanda multiplicada pelo fator previsto em norma. O multiplicador é parâmetro normativo, não negociável, e há material em circulação reproduzindo a redação anterior à consolidação de 2021.",
    "qtd": "A empresa, integralmente e de forma não linear. A base é a diferença entre demanda medida e demanda contratada, e ela só é cobrada quando o gatilho de tolerância é superado — de modo que um único intervalo de quinze minutos determina a linha inteira do mês.",
    "ciclo": "Valor unitário no ciclo anual. A ocorrência é mensal e depende de um evento operacional; nenhuma outra linha da fatura tem essa característica de tudo ou nada."
  },
  {
    "id": "ere",
    "n": "Energia reativa excedente",
    "c": "Reativo",
    "unit": "Valorada por referência normativa vinculada à tarifa de energia da bandeira verde do subgrupo residencial de baixa tensão. É a única linha da fatura industrial cujo valor unitário se ancora numa tarifa de outro grupo.",
    "qtd": "A empresa, pela apuração intervalo a intervalo do fator de potência abaixo da referência. A quantidade é integralmente controlável por compensação adequada — e integralmente descontrolável se a compensação instalada não acompanhar a variação da carga.",
    "ciclo": "A referência de valoração acompanha o ciclo tarifário. A ocorrência é mensal e reflete o regime de operação do mês, o que torna a série de várias faturas mais informativa que qualquer fatura isolada."
  },
  {
    "id": "dre",
    "n": "Demanda reativa excedente",
    "c": "Reativo",
    "unit": "Aplicada sobre a demanda corrigida pelo fator de potência do intervalo, conforme a fórmula normativa. Como no caso anterior, o parâmetro é regulatório e não admite tratamento individual.",
    "qtd": "A empresa, pelo mesmo mecanismo, mas com efeito sobre a grandeza de potência e não de energia. Uma unidade pode ter cobrança de uma e não da outra, e o padrão distingue problema difuso de problema concentrado em picos.",
    "ciclo": "Igual à linha anterior. Vale a observação de que a nomenclatura exibida na fatura pode ser um rótulo herdado de norma anterior, e mapeá-lo ao conceito vigente é a primeira tarefa da leitura."
  },
  {
    "id": "band",
    "n": "Adicional de bandeira",
    "c": "Curto prazo",
    "unit": "Fixado pela agência reguladora, atualizado ao final do período úmido para o ciclo seguinte, e uniforme nacionalmente dentro do sistema interligado. É a única linha da fatura com valor unitário nacional.",
    "qtd": "A empresa, pelo volume de energia consumida no período. Aplica-se ao consumidor do ambiente regulado; o consumidor do ambiente livre tem exposição a custo de geração por outro caminho.",
    "ciclo": "<b>Mensal.</b> Esta é a única linha cujo valor unitário efetivo pode mudar de um mês para o outro sem qualquer processo tarifário, e é a explicação mais frequente para variação de conta com consumo estável."
  },
  {
    "id": "enc",
    "n": "Encargos setoriais",
    "c": "Encargos",
    "unit": "Instituídos por lei e rateados por metodologia regulada. Na maior parte dos leiautes de fatura, estão embutidos no valor unitário da tarifa de uso e não aparecem como linha própria — a ausência de linha não significa ausência de custo.",
    "qtd": "A empresa, pela energia consumida na maioria dos casos. Há um fator adicional que não é de decisão operacional: desde 2026, o rateio da quota do principal encargo é diferenciado por nível de tensão de conexão da unidade.",
    "ciclo": "As quotas são fixadas por ciclo anual e envelhecem em doze meses. Mudanças estruturais vêm por lei, com vigência própria, e podem não coincidir com o calendário tarifário da concessionária."
  },
  {
    "id": "trib-f",
    "n": "Tributos federais",
    "c": "Tributos",
    "unit": "Alíquotas definidas em legislação federal, com regime de apuração que admite crédito conforme o regime do contribuinte. Em 2026, convivem com a alíquota de calibração dos tributos novos.",
    "qtd": "A empresa, indiretamente: a base é o faturamento, que decorre de todas as quantidades anteriores. Não há decisão que altere a alíquota, mas toda redução de base se propaga aqui automaticamente.",
    "ciclo": "Ciclo legislativo, e em 2026 um <b>calendário legal de substituição</b> em curso. Um modelo de custo projetado além de 2026 que assuma permanência do regime anterior está assumindo premissa contra a lei."
  },
  {
    "id": "trib-e",
    "n": "Imposto estadual",
    "c": "Tributos",
    "unit": "Alíquota fixada em legislação da unidade federativa, sujeita à tese vinculante sobre essencialidade quando adotada a técnica da seletividade. Varia de estado para estado, o que explica diferenças entre plantas do mesmo grupo empresarial.",
    "qtd": "A empresa, indiretamente, pela base. A composição dessa base é objeto de controvérsia ativa quanto à inclusão das tarifas de uso da rede, e há entendimento consolidado separando demanda utilizada de demanda contratada e não utilizada.",
    "ciclo": "Ciclo legislativo estadual, mais decisão judicial com modulação de efeitos, mais o calendário de transição do regime. É a linha da fatura com maior número de fontes de mudança simultâneas."
  },
  {
    "id": "cip",
    "n": "Contribuição de iluminação pública",
    "c": "Tributos",
    "unit": "Instituída por lei municipal, com regra de cálculo local que pode ser valor fixo por faixa, percentual ou combinação. Não remunera consumo da planta: financia a iluminação pública do município.",
    "qtd": "Depende da regra municipal. Em muitos municípios a base é o consumo; em outros, é faixa de valor da fatura. É a linha em que a empresa tem menos influência de todas.",
    "ciclo": "Ciclo legislativo municipal, independente de qualquer calendário setorial. Duas plantas da mesma empresa em municípios vizinhos podem ter regras completamente distintas."
  },
  {
    "id": "fin",
    "n": "Componentes financeiros e ajustes",
    "c": "Ajustes",
    "unit": "Resultam de apuração de exercícios anteriores incorporada ao processo tarifário, ou de refaturamento específico da unidade. Não têm valor unitário no sentido usual: são valores apurados.",
    "qtd": "Nem a empresa nem a decisão corrente. São ajustes de período passado que aparecem no presente, e por isso são a causa mais comum de série temporal que não reconcilia.",
    "ciclo": "Irregular por natureza. <b>Regra operacional: nunca excluir da série.</b> O correto é preservar o ajuste, vinculá-lo ao período de origem e declarar a diferença entre competência e caixa na apresentação."
  }
] as const;
/** INST·02 · `var PERFIL` (L3717–3723). */
const I02_PERFIL = {
  "plana": "carga plana em turnos contínuos, com demanda de ponta próxima da demanda fora de ponta e fator de carga elevado",
  "diurna": "operação diurna com pico concentrado na tarde e redução parcial no fim do dia",
  "pontabaixa": "planta que reduz processos de forma controlada e confiável durante a janela de ponta",
  "erratica": "carga errática, com picos episódicos não previsíveis e baixo controle automático",
  "sazonal": "operação sazonal de safra, com meses de carga alta e meses de carga muito reduzida"
} as const;
/** INST·02 · `var ELEG` (L3725–3725). */
const I02_ELEG = {
  "a4": [
    "azul",
    "verde"
  ],
  "a3a": [
    "azul",
    "verde"
  ],
  "a3": [
    "azul"
  ],
  "a2": [
    "azul"
  ]
} as const;
/** INST·02 · `var SGNOME` (L3726–3726). */
const I02_SGNOME = {
  "a4": "A4",
  "a3a": "A3a",
  "a3": "A3",
  "a2": "A2"
} as const;
/** INST·02 · `var CEL` (L3728–3789). */
const I02_CEL = {
  "azul|plana": {
    "dir": "Separaria a demanda em dois contratos com valores próximos entre si, o que multiplica pontos de exposição a ultrapassagem sem capturar diferença estrutural de perfil.",
    "linhas": "Demanda passaria a duas linhas contratadas e duas faturadas. Energia permaneceria em duas linhas por posto, sem alteração de estrutura.",
    "risco": "Dois pontos independentes de verificação de ultrapassagem, cada um com gatilho próprio. Não utilizar a contratada em um posto não elimina a cobrança no outro.",
    "falta": "Demanda máxima por posto em doze meses, para verificar se a diferença entre postos justifica a separação, e as tarifas homologadas da concessionária."
  },
  "azul|diurna": {
    "dir": "A demanda de ponta pode ser inferior à de fora de ponta se o pico da tarde estiver fora da janela homologada, o que favorece a separação.",
    "linhas": "Demanda separada por posto, com a de ponta possivelmente contratada em valor bem menor. Energia sem alteração de estrutura.",
    "risco": "Depende inteiramente de onde a janela de ponta cai em relação ao pico interno. Se o pico da tarde estiver dentro da janela, a vantagem desaparece.",
    "falta": "O intervalo de ponta homologado da área de concessão e a demanda máxima registrada dentro dele, separada da demanda máxima do dia."
  },
  "azul|pontabaixa": {
    "dir": "É o perfil para o qual a separação foi desenhada: demanda de ponta baixa e controlável permite contratar pouco no posto caro.",
    "linhas": "Demanda de ponta contratada em valor substancialmente inferior. Energia de ponta também reduzida, se a redução de processos for real e não apenas de demanda.",
    "risco": "A palavra decisiva é controlável. Um único evento fora de controle na janela de ponta produz ultrapassagem sobre a tarifa mais cara da estrutura.",
    "falta": "Confiabilidade demonstrada do controle de carga, registro de eventos de falha do controle, e o plano de contingência para retomada após interrupção."
  },
  "azul|erratica": {
    "dir": "Multiplicaria a exposição: duas contratadas, duas verificações de gatilho, sobre um perfil que por definição não é previsível.",
    "linhas": "Duas linhas de demanda contratada e a possibilidade de duas linhas simultâneas de ultrapassagem no mesmo ciclo.",
    "risco": "O maior da matriz. Perfil errático com demanda separada por posto combina o pior de duas características: tarifa alta na ponta e imprevisibilidade.",
    "falta": "A causa operacional dos picos episódicos. Sem isso, nenhum contrato é dimensionável e a discussão de modalidade é prematura."
  },
  "azul|sazonal": {
    "dir": "A separação por posto interage com a sazonalidade de forma que só a série completa revela; meses de safra e de entressafra podem indicar direções opostas.",
    "linhas": "Demanda separada por posto, com a questão adicional de se há tratamento sazonal aplicável ao enquadramento e ao contrato.",
    "risco": "Dimensionar sobre a média anual produz ultrapassagem na safra e ociosidade na entressafra, simultaneamente.",
    "falta": "Doze meses completos cobrindo pelo menos um ciclo de safra, e a verificação de possibilidade e procedimento de tratamento sazonal no contrato."
  },
  "verde|plana": {
    "dir": "Um único contrato de demanda e uma única verificação de gatilho, alinhado a um perfil em que a separação por posto não capturaria diferença.",
    "linhas": "Uma linha de demanda contratada e uma faturada. Energia permanece em duas linhas por posto — a diferenciação horária da energia não desaparece.",
    "risco": "A energia de ponta continua sendo o componente caro. Perfil plano significa consumo proporcional na ponta, e isso não é resolvido pela modalidade.",
    "falta": "A relação entre as tarifas de demanda das duas modalidades na concessionária específica, e a participação real da ponta no consumo total."
  },
  "verde|diurna": {
    "dir": "Simplifica o contrato, mas abre mão da possibilidade de contratar pouco no posto caro se o pico da tarde estiver de fato fora da janela.",
    "linhas": "Uma linha de demanda. Se o pico interno for muito superior à demanda dentro da janela de ponta, a tarifa única é aplicada sobre o pico maior.",
    "risco": "Pagar tarifa única sobre um pico que ocorre fora da janela cara pode ser mais oneroso que separar, dependendo da relação entre tarifas.",
    "falta": "Demanda máxima total do ciclo e demanda máxima dentro da janela de ponta, separadamente — dois números que a fatura da modalidade única não distingue."
  },
  "verde|pontabaixa": {
    "dir": "Abre mão da principal vantagem disponível a este perfil: a tarifa única incide sobre o pico total, inclusive o que ocorre fora da ponta.",
    "linhas": "Uma linha de demanda contratada, dimensionada pelo maior pico do ciclo, independentemente do posto em que ocorreu.",
    "risco": "Baixo em termos de ultrapassagem, alto em termos de oportunidade não capturada. É o caso em que a simplicidade custa caro.",
    "falta": "A confirmação de que a redução na ponta é sistemática e não sazonal, e a relação entre as tarifas de demanda de ponta e única na concessionária."
  },
  "verde|erratica": {
    "dir": "Concentra a imprevisibilidade num único ponto de verificação, o que reduz a superfície de erro do dimensionamento.",
    "linhas": "Uma linha de demanda contratada e uma única possibilidade de ultrapassagem por ciclo.",
    "risco": "A imprevisibilidade permanece; o que muda é que ela produz um evento de cobrança em vez de dois. A causa dos picos continua sendo o problema real.",
    "falta": "Registro de eventos operacionais associado a cada pico da série. A modalidade não resolve perfil errático — apenas simplifica a exposição."
  },
  "verde|sazonal": {
    "dir": "Contrato único facilita a gestão da sazonalidade, mas ainda exige decisão sobre dimensionar para a safra ou para a entressafra.",
    "linhas": "Uma linha de demanda contratada, com a questão de tratamento sazonal aplicável conforme enquadramento e contrato.",
    "risco": "Dimensionar para a safra gera ociosidade paga na entressafra; dimensionar para a entressafra gera ultrapassagem recorrente na safra.",
    "falta": "Calendário produtivo com demanda máxima mês a mês, antecedência exigida para alteração contratual, e verificação de tratamento sazonal disponível."
  },
  "conv|plana": {
    "dir": "Não é opção ordinária de enquadramento na relação vigente de modalidades disponíveis ao grupo A. A comparação não se aplica.",
    "linhas": "Estrutura sem distinção horária em energia e em demanda, que subsiste no arcabouço metodológico tarifário e em situações contratuais específicas.",
    "risco": "Tratá-la como alternativa disponível numa análise nova é o erro mais visível que um material tarifário pode cometer diante de alguém do setor.",
    "falta": "Se a unidade estiver efetivamente nela, o contrato de uso e o ato de enquadramento, para entender a origem da situação antes de qualquer conclusão."
  },
  "conv|diurna": {
    "dir": "Não é opção ordinária de enquadramento na relação vigente. A comparação não se aplica.",
    "linhas": "Energia e demanda em linha única, sem qualificação de posto, numa unidade cujo cadastro indica grupo A.",
    "risco": "Simular esta estrutura como alternativa produz números que não correspondem a nenhuma opção contratável.",
    "falta": "Verificação do cadastro e do contrato de uso, para confirmar se o que se está vendo é situação contratual específica ou leitura equivocada do leiaute."
  },
  "conv|pontabaixa": {
    "dir": "Não é opção ordinária de enquadramento na relação vigente. A comparação não se aplica.",
    "linhas": "Ausência de diferenciação horária, o que anularia justamente a característica que este perfil tem de mais valiosa.",
    "risco": "Para um perfil que reduz processos na ponta, estrutura sem distinção horária desperdiça integralmente o esforço operacional.",
    "falta": "Nada a levantar para efeito de simulação. O que cabe é confirmar a situação cadastral e as opções efetivamente elegíveis ao subgrupo."
  },
  "conv|erratica": {
    "dir": "Não é opção ordinária de enquadramento na relação vigente. A comparação não se aplica.",
    "linhas": "Linha única de demanda e linha única de energia, sem os postos que estruturam as modalidades vigentes.",
    "risco": "Reproduzir esta estrutura numa proposta comercial denuncia leitura de fonte desatualizada.",
    "falta": "Confirmação do subgrupo e das modalidades elegíveis, que é sempre o primeiro campo de qualquer análise."
  },
  "conv|sazonal": {
    "dir": "Não é opção ordinária de enquadramento na relação vigente. A comparação não se aplica.",
    "linhas": "Estrutura sem distinção horária, cuja interação com sazonalidade não chega a ser questão prática porque a modalidade não é contratável.",
    "risco": "O mesmo de todas as células desta coluna: apresentar como alternativa algo que não está disponível.",
    "falta": "Verificação do enquadramento vigente e das opções elegíveis ao subgrupo, antes de qualquer simulação sazonal."
  }
} as const;
/** INST·03 · `var FAIXA` (L3831–3857). */
const I03_FAIXA = [
  {
    "max": 60,
    "cls": "per",
    "t": "Folga muito ampla",
    "sig": "A demanda medida está muito abaixo da contratada. A unidade paga, todos os meses, por capacidade que não utiliza — e essa é a única linha da fatura em que o desperdício é recorrente e silencioso, porque nada na conta o sinaliza como anomalia.",
    "causa": "Costuma decorrer de contrato dimensionado para uma planta que desde então reduziu produção, desativou linha, migrou processo ou substituiu equipamento por versão mais eficiente. Também aparece após entrada de geração própria, quando ninguém revisitou o contrato.",
    "ctrl": "A empresa controla integralmente: a redução de demanda contratada é decisão contratual, sem investimento, com prazo de comunicação à distribuidora e procedimento previsto em norma e no contrato de uso.",
    "falta": "A confirmação de que a folga é estrutural e não sazonal, o que exige a série completa; e o plano de produção, porque uma expansão prevista pode justificar manter a reserva."
  },
  {
    "max": 80,
    "cls": "att",
    "t": "Folga relevante",
    "sig": "Há espaço identificável entre o que foi reservado e o que se usa. É a faixa em que o diagnóstico costuma encontrar a alavanca mais acessível de toda a fatura, porque não exige investimento nem mudança operacional.",
    "causa": "Tipicamente, contrato dimensionado com margem generosa em momento de incerteza, ou dimensionado pelo pico histórico de um evento que não se repetiu. Também ocorre quando o controle de carga foi implantado depois do contrato e nunca motivou revisão.",
    "ctrl": "A empresa controla, mas a decisão exige calibrar risco: reduzir o contrato aproxima a operação do gatilho de ultrapassagem, e a folga tem valor de seguro em processos com partidas pesadas.",
    "falta": "A explicação operacional de cada pico da série, a criticidade do processo e o custo de parada — sem os três, o número recomendado seria arbitrário."
  },
  {
    "max": 95,
    "cls": "ok",
    "t": "Dimensionamento ajustado",
    "sig": "A utilização do contrato está numa faixa que indica dimensionamento coerente com a operação. Há folga suficiente para absorver variação normal e não há ociosidade contratada relevante.",
    "causa": "É o resultado esperado de um contrato revisitado com base em série histórica, ou de uma operação estável cujo perfil não mudou desde a contratação.",
    "ctrl": "A empresa controla, e a ação correta aqui é monitorar, não mexer. Alarme configurado abaixo do limite de disparo e revisão antes de qualquer expansão.",
    "falta": "Nada para concluir sobre adequação atual. Para projeção, o plano de produção — e essa é a única lacuna relevante nesta faixa."
  },
  {
    "max": 105,
    "cls": "att",
    "t": "Operação na borda",
    "sig": "A demanda medida está muito próxima do limite de disparo, ou já o superou. A unidade opera sem margem, e um único evento adicional converte o mês em cobrança de ultrapassagem sobre a diferença inteira entre medida e contratada.",
    "causa": "Contrato apertado por decisão anterior de redução, crescimento de carga não acompanhado por revisão contratual, ou entrada de equipamento novo sem recontratação prévia.",
    "ctrl": "A empresa controla nas duas pontas: pode elevar a demanda contratada, respeitados prazo e procedimento, ou implantar controle de carga com alarme escalonado abaixo do limite.",
    "falta": "A tendência da série — se a demanda está crescendo, o problema é estrutural e a solução é contratual; se é ruído em torno de um patamar, a solução é controle."
  },
  {
    "max": 1000000000,
    "cls": "per",
    "t": "Contrato insuficiente",
    "sig": "A demanda medida excede a contratada de forma substancial. Além da cobrança de ultrapassagem, há risco operacional: a distribuidora reserva capacidade conforme o contratado, e operar sistematicamente acima disso é matéria de contrato de uso, não apenas de custo.",
    "causa": "Crescimento de carga não acompanhado de recontratação, expansão comissionada sem aviso prévio, ou contrato reduzido sem controle de carga que sustentasse a redução.",
    "ctrl": "A empresa controla, e a ação é urgente e contratual. Reduzir contrato sem controle transforma economia aparente em penalidade recorrente — o inverso também vale: manter contrato insuficiente por inércia é a forma mais cara de não decidir.",
    "falta": "A verificação de que a medição está correta, incluindo fator de multiplicação e ponto de medição, antes de recontratar sobre um número que pode estar escalado."
  }
] as const;
/** INST·04 · `var FAIXA` (L3914–3935). */
const I04_FAIXA = [
  {
    "max": 0,
    "cls": "ok",
    "t": "Sem cobrança e com margem",
    "sig": "A demanda medida está abaixo do limite de disparo e a parcela de ultrapassagem não é gerada neste ciclo. O que a fatura cobra de demanda é apenas a parcela normal.",
    "causa": "Contrato dimensionado com folga compatível com a variação do processo, ou controle de carga efetivo mantendo o pico dentro do envelope contratado.",
    "ctrl": "A empresa controla, e a questão que se abre aqui é a oposta: quanto dessa folga é seguro necessário e quanto é ociosidade paga todo mês. As duas perguntas convivem na mesma linha da fatura.",
    "falta": "A série completa, para distinguir margem estrutural de coincidência de um mês tranquilo, e o registro de eventos operacionais dos meses de maior demanda."
  },
  {
    "max": 2,
    "cls": "att",
    "t": "Na borda do gatilho",
    "sig": "A medição ficou muito próxima do limite de disparo, sem superá-lo. Não há cobrança, mas a operação não tem margem: qualquer evento adicional no próximo ciclo converte a diferença inteira em base de ultrapassagem.",
    "causa": "Contrato apertado após redução deliberada, ou crescimento gradual de carga que ainda não motivou revisão contratual.",
    "ctrl": "A empresa controla nas duas direções. Alarme configurado em patamares escalonados abaixo do limite é a intervenção de menor custo, e é operacional, não contratual.",
    "falta": "A tendência da série de demanda medida. Se ela está subindo mês a mês, o problema é estrutural e a solução é recontratação, não alarme."
  },
  {
    "max": 15,
    "cls": "per",
    "t": "Ultrapassagem disparada",
    "sig": "O gatilho foi superado e a parcela de ultrapassagem incide sobre a diferença entre demanda medida e demanda contratada — não sobre o excedente acima da tolerância. É a não linearidade que torna essa linha desproporcional ao evento que a causou.",
    "causa": "Tipicamente um evento operacional isolado: retomada após interrupção com partida simultânea de motores, teste de carga, coincidência de processos batch, ou falha de geração própria que existia para cortar o pico.",
    "ctrl": "A empresa controla, e a ordem de intervenção importa: primeiro identificar o evento, depois decidir entre controle operacional e recontratação. Recontratar sem entender o evento é comprar margem para um problema que pode se repetir maior.",
    "falta": "A memória de massa do intervalo do pico, com data, hora e duração, e o registro operacional do que ocorria na planta naquele quarto de hora."
  },
  {
    "max": 1000000000,
    "cls": "per",
    "t": "Descolamento substancial",
    "sig": "A demanda medida excede a contratada de forma que a parcela de ultrapassagem se torna componente relevante da fatura. Além do custo, há matéria de contrato de uso: a distribuidora reserva capacidade conforme o contratado.",
    "causa": "Expansão comissionada sem recontratação prévia, crescimento sustentado de carga, ou contrato reduzido sem que o controle que sustentava a redução tenha sido implantado ou tenha funcionado.",
    "ctrl": "A empresa controla, e a ação é contratual e urgente. Manter contrato insuficiente por inércia é a forma mais cara de não decidir, porque a penalidade se repete a cada ciclo.",
    "falta": "A verificação prévia da medição — fator de multiplicação, transformadores e ponto de medição — antes de recontratar sobre um número que pode estar escalado por erro de constante."
  }
] as const;
/** INST·05 · `var FAIXA` (L4000–4021). */
const I05_FAIXA = [
  {
    "max": 4,
    "cls": "ok",
    "t": "Participação estruturalmente baixa",
    "sig": "A participação do consumo de ponta no total é baixa por natureza do regime operacional. Deslocar carga produz efeito marginal, porque já há pouco volume dentro da janela cara.",
    "causa": "Operação que já reduz processos na ponta, ou regime com poucas horas de ponta faturadas em relação ao ciclo, ou planta com paradas coincidindo com a janela homologada.",
    "ctrl": "A empresa controla, mas a alavanca está em outro lugar. Insistir em deslocamento aqui é gastar esforço gerencial onde o retorno é estruturalmente pequeno.",
    "falta": "Confirmação do intervalo de ponta homologado da área de concessão e do número de horas de ponta efetivamente faturadas no ciclo, descontados os feriados aplicáveis."
  },
  {
    "max": 10,
    "cls": "ok",
    "t": "Participação compatível com regime contínuo",
    "sig": "A participação está próxima do que se espera de uma operação contínua: a proporção de horas de ponta no ciclo. O consumo não está concentrado na janela cara, apenas distribuído.",
    "causa": "Regime de turnos contínuos com carga plana. É o perfil típico de processo industrial de fluxo, em que o consumo acompanha as horas de operação sem preferência horária.",
    "ctrl": "A empresa controla o volume total pela eficiência do processo; o deslocamento é limitado pela flexibilidade real dos processos, não pela vontade de deslocar.",
    "falta": "A classificação de flexibilidade dos processos que operam na janela: quanto é armazenável, quanto tem janela de qualidade e quanto é fluxo acoplado à produção."
  },
  {
    "max": 18,
    "cls": "att",
    "t": "Concentração acima do proporcional",
    "sig": "A participação da ponta excede o que a proporção de horas explicaria. Há concentração real de carga dentro da janela cara, e isso é um achado — não uma conclusão sobre o que fazer.",
    "causa": "Turno que inicia ou intensifica dentro da janela, processo batch programado sem consideração ao posto, ou pico de climatização e cargas auxiliares coincidindo com o fim de tarde.",
    "ctrl": "A empresa controla parcialmente. A pergunta operacional é qual processo específico está dentro da janela e se ele pode ser reprogramado sem perda de produção ou qualidade.",
    "falta": "A curva de carga por intervalo cruzada com o calendário de produção, para identificar quais processos ocupam a janela — a fatura mostra o agregado, não a atribuição."
  },
  {
    "max": 1000000000,
    "cls": "per",
    "t": "Concentração elevada",
    "sig": "Parcela expressiva do consumo ocorre dentro da janela de três horas diárias em dias úteis. Isso indica programação de produção que ignora sistematicamente o posto tarifário, ou processo com pico obrigatório naquele horário.",
    "causa": "Programação de turnos definida sem referência ao posto homologado, ou processo cujo ciclo térmico ou logístico impõe operação naquele intervalo.",
    "ctrl": "A empresa controla se o motivo for programação; não controla se o motivo for restrição de processo. Distinguir os dois casos é a única pergunta que importa aqui.",
    "falta": "O custo de oportunidade de deslocar cada processo: produção perdida, retrabalho, perda de rendimento térmico ou risco de qualidade. Sem isso, o volume deslocável é hipotético."
  }
] as const;
/** INST·06 · `var FAIXA` (L4080–4106). */
const I06_FAIXA = [
  {
    "k": "limpo",
    "cls": "ok",
    "t": "Sem violação nas duas janelas",
    "sig": "Os fatores típicos informados estão dentro da referência nas duas janelas e não há intervalos em violação. Não há base tarifária para cobrança de excedente reativo neste ciclo.",
    "causa": "Compensação adequadamente dimensionada e com regime de acionamento que acompanha a variação da carga, ou perfil de carga com baixa exigência de reativo.",
    "ctrl": "A empresa controla, e a ação correta é manter: verificar periodicamente o regime de acionamento da compensação e reavaliar após qualquer entrada de carga nova, especialmente carga não linear.",
    "falta": "Ausência de cobrança não prova ausência de problema técnico. Aquecimento anormal, disparo de proteção ou distorção harmônica podem existir sem reflexo tarifário, e exigem medição de qualidade de energia para serem descartados."
  },
  {
    "k": "ind-pont",
    "cls": "att",
    "t": "Violação indutiva pontual",
    "sig": "Há intervalos em violação na janela indutiva, mas em proporção pequena do período. O padrão sugere evento concentrado e não deficiência permanente de compensação.",
    "causa": "Partida simultânea de motores de porte, entrada de carga indutiva em regime específico, ou falha temporária de estágio da compensação automática.",
    "ctrl": "A empresa controla pela sequência de partidas, pela compensação local junto às cargas de maior porte e pela verificação do funcionamento dos estágios existentes.",
    "falta": "A distribuição dos intervalos em violação ao longo do ciclo. Concentrados em poucos dias, o problema é evento; espalhados em todos os dias no mesmo horário, o problema é regime."
  },
  {
    "k": "ind-estr",
    "cls": "per",
    "t": "Violação indutiva estrutural",
    "sig": "A proporção de intervalos em violação na janela indutiva indica deficiência permanente de compensação durante a operação. A cobrança tende a se repetir em todos os ciclos com o mesmo regime.",
    "causa": "Compensação subdimensionada para a carga indutiva instalada, ausência de compensação, ou banco automático com estágios fora de operação sem que ninguém tenha notado.",
    "ctrl": "A empresa controla, mas a solução é de projeto. Este é o único achado deste módulo cuja correção tipicamente exige investimento em ativo — e por isso vem depois de contrato e operação na ordem de intervenção.",
    "falta": "Inventário de cargas, medição por intervalo e, se houver acionamento de velocidade variável, retificadores ou fornos, avaliação de distorção harmônica e risco de ressonância antes de qualquer dimensionamento."
  },
  {
    "k": "cap",
    "cls": "per",
    "t": "Violação capacitiva — sobrecompensação",
    "sig": "Há intervalos em violação na janela noturna de apuração capacitiva. Este é o achado mais mal interpretado do módulo: ele indica compensação em excesso, não em falta.",
    "causa": "Banco de capacitores fixo permanecendo energizado quando a carga indutiva que ele compensava já foi desligada — tipicamente em unidade com operação diurna e madrugada de baixa carga.",
    "ctrl": "A empresa controla, e frequentemente sem investimento: lógica de intertravamento com o regime de operação, reconfiguração de estágios, ou simplesmente desligamento programado do banco fora do turno.",
    "falta": "O regime de acionamento do banco existente e a configuração de estágios. A recomendação errada e frequente é adicionar capacitores, o que agrava exatamente o que se pretendia corrigir."
  },
  {
    "k": "ambas",
    "cls": "per",
    "t": "Violação nas duas janelas",
    "sig": "Há intervalos em violação tanto na janela indutiva quanto na capacitiva. A instalação está fora da referência nos dois sentidos, em momentos diferentes do dia.",
    "causa": "Combinação de compensação insuficiente sob carga e compensação excessiva sem carga — assinatura clássica de banco fixo dimensionado para um regime que a planta já não pratica.",
    "ctrl": "A empresa controla, e a solução é de projeto: compensação automática com estágios que acompanhem a variação real da carga, o que resolve os dois lados simultaneamente.",
    "falta": "Perfil completo por intervalo nas duas janelas e inventário do que está instalado. Este é o caso em que a fatura sozinha é menos suficiente que em qualquer outro achado do módulo."
  }
] as const;
/** INST·07 · `var ENC` (L4173–4229). */
const I07_ENC = [
  {
    "id": "cde",
    "n": "Conta de desenvolvimento energético",
    "tag": "Encargo",
    "fin": "Políticas públicas do setor elétrico: subsídios a fontes e a classes de consumidores, universalização do acesso, tarifa social e desconto social, e mecanismos de modicidade tarifária em regiões específicas. É o encargo de maior peso e o de maior número de finalidades acumuladas.",
    "paga": "Consumidores em geral, por meio de quotas anuais rateadas. Desde 1º de janeiro de 2026, o custo por unidade de energia é diferenciado por nível de tensão: quem é atendido em tensão igual ou superior a 69 kV paga metade do que paga quem é atendido abaixo de 2,3 kV, e a faixa intermediária paga oitenta por cento.",
    "fat": "Tipicamente embutida no valor unitário da tarifa de uso do sistema de distribuição, sem linha própria. A desagregação está na planilha tarifária do processo tarifário da concessionária.",
    "mud": "<b>Lei nº 15.269, de 24 de novembro de 2025</b>, que acresce os §§ 3º-D e 3º-E ao art. 13 da Lei nº 10.438/2002, com o rateio por nível de tensão a partir de 1º de janeiro de 2026. Os §§ 18 e 19 do mesmo artigo instituem teto de arrecadação a partir do Orçamento Anual de 2027 e criam o Encargo de Complemento de Recursos — <b>prazo previsto em lei</b>, com regulamentação a verificar."
  },
  {
    "id": "ess",
    "n": "Encargo de serviços do sistema",
    "tag": "Encargo",
    "fin": "Custos de serviços ancilares e de geração despachada fora da ordem de mérito por razões de segurança energética ou elétrica — ou seja, o custo de operar o sistema de forma diferente da que a economia sozinha determinaria.",
    "paga": "Consumidores, rateado conforme regra de comercialização. É um dos encargos cuja magnitude varia mais entre períodos, porque depende diretamente das condições de operação do sistema.",
    "fat": "Embutido na estrutura tarifária do consumidor regulado; para o consumidor livre, aparece no processo de contabilização e liquidação.",
    "mud": "Não há alteração legal recente específica a registrar na verificação de 1º de agosto de 2026. A variação relevante é de magnitude e acompanha o regime de operação do sistema, não de regra."
  },
  {
    "id": "eer",
    "n": "Encargo de energia de reserva",
    "tag": "Encargo",
    "fin": "Custeio da contratação de energia de reserva, destinada a elevar a segurança do suprimento. Não tem qualquer relação com energia reativa, e a semelhança das siglas usadas em material comercial é fonte recorrente de confusão.",
    "paga": "Consumidores que se beneficiam da reserva, conforme regra aplicável ao ambiente de contratação de cada um.",
    "fat": "Componente da estrutura tarifária no ambiente regulado; no ambiente livre, integra as obrigações apuradas na contabilização.",
    "mud": "Sem alteração legal recente específica a registrar. A magnitude varia com os contratos de reserva vigentes e com o montante contratado."
  },
  {
    "id": "proinfa",
    "n": "Programa de incentivo a fontes alternativas",
    "tag": "Encargo",
    "fin": "Contratação histórica de fontes alternativas de energia elétrica, sob programa instituído em lei. É um encargo de estoque: custeia contratos assinados no passado, com prazo definido.",
    "paga": "Consumidores em geral, rateado por metodologia regulada, com exceções previstas em lei.",
    "fat": "Embutido na estrutura tarifária; raramente aparece como linha própria em fatura de consumidor final.",
    "mud": "Sem alteração legal recente específica a registrar. A tendência estrutural é de redução conforme os contratos do programa se encerram."
  },
  {
    "id": "ped",
    "n": "Obrigação de pesquisa e desenvolvimento",
    "tag": "Obrigação",
    "fin": "Aplicação obrigatória de percentual de receita das concessionárias em projetos de pesquisa, desenvolvimento e inovação do setor, conforme regramento próprio.",
    "paga": "Custeado pela receita regulada da concessionária e, portanto, presente na estrutura de custos que a tarifa remunera.",
    "fat": "Não aparece como linha em fatura de consumidor final; está dentro da parcela de custos reconhecida no processo tarifário.",
    "mud": "Sem alteração legal recente específica a registrar. Vale a nota de que não se confunde com programa interno voluntário de inovação da empresa consumidora."
  },
  {
    "id": "ee",
    "n": "Obrigação de eficiência energética",
    "tag": "Obrigação",
    "fin": "Aplicação obrigatória de percentual de receita em programas regulados de eficiência energética, com regras próprias de elegibilidade de projetos e de medição de resultados.",
    "paga": "Custeado pela receita regulada da concessionária, integrando a estrutura de custos remunerada pela tarifa.",
    "fat": "Não aparece como linha em fatura de consumidor final. Consumidores podem, em alguns casos, participar de chamadas de projeto conduzidas pela distribuidora.",
    "mud": "Sem alteração legal recente específica a registrar na verificação. As regras de elegibilidade de projeto são revisadas periodicamente em procedimento próprio."
  },
  {
    "id": "tfsee",
    "n": "Taxa de fiscalização",
    "tag": "Taxa",
    "fin": "Custeio da atividade de fiscalização dos serviços de energia elétrica exercida pela agência reguladora. É taxa no sentido técnico: contraprestação por atividade estatal específica.",
    "paga": "Agentes setoriais titulares de concessão, permissão ou autorização, e o custo integra a estrutura remunerada pela tarifa.",
    "fat": "Componente setorial embutido; não aparece como linha em fatura de consumidor final e não é comissão de nenhuma natureza.",
    "mud": "Sem alteração legal recente específica a registrar. É o item de menor peso relativo entre os aqui listados."
  },
  {
    "id": "tsee",
    "n": "Tarifa social de energia elétrica",
    "tag": "Política pública",
    "fin": "Desconto na fatura de consumidores enquadrados na subclasse residencial de baixa renda. Desde a reforma de 2025, desconto de cem por cento sobre a parcela de consumo igual ou inferior a 80 kWh por mês.",
    "paga": "Custeada pela conta de desenvolvimento energético, ou seja, rateada entre os demais consumidores — inclusive os industriais. É o vínculo direto entre política social e a linha de encargos de uma fatura industrial.",
    "fat": "Não aparece na fatura industrial como linha própria; aparece indiretamente, no custeio da quota do encargo que a financia.",
    "mud": "<b>Lei nº 15.235, de 8 de outubro de 2025</b>, conversão da Medida Provisória nº 1.300/2025, com a gratuidade em vigor desde 5 de julho de 2025 por força da medida provisória. Regulamentada pela <b>Resolução Normativa ANEEL nº 1.147, de 9 de dezembro de 2025</b>."
  },
  {
    "id": "dsoc",
    "n": "Desconto social",
    "tag": "Política pública",
    "fin": "Segunda camada de proteção tarifária, criada em 2025 para famílias com renda per capita entre meio e um salário mínimo inscritas no cadastro único, com tarifa reduzida e isenção de quotas do encargo de desenvolvimento energético para consumo de até 120 kWh mensais.",
    "paga": "Custeado pelo mesmo encargo, com o mesmo efeito distributivo sobre os demais consumidores. A parcela de consumo acima do limite não recebe redução.",
    "fat": "Não aparece na fatura industrial como linha própria. O efeito chega pela composição da quota do encargo.",
    "mud": "<b>Lei nº 15.235/2025</b>, com vigência declarada a partir de 1º de janeiro de 2026, regulamentada pela <b>Resolução Normativa ANEEL nº 1.147/2025</b>, que também tratou de critérios de enquadramento e de titularidade da conta."
  },
  {
    "id": "ecr",
    "n": "Encargo de complemento de recursos",
    "tag": "Encargo · prazo previsto em lei",
    "fin": "Encargo criado em lei para operacionalizar o teto de arrecadação do encargo de desenvolvimento energético, com o mecanismo previsto de redução proporcional dos benefícios custeados quando o limite for atingido.",
    "paga": "A definir em regulamentação. A lei estabelece a criação e o marco temporal; a operacionalização depende de ato da agência reguladora.",
    "fat": "Ainda não aplicável. Nenhuma fatura de 2026 contém esta linha, e apresentá-la como custo vigente é erro de vigência.",
    "mud": "<b>§ 19 do art. 13 da Lei nº 10.438/2002</b>, na redação da Lei nº 15.269/2025, com marco no Orçamento Anual do encargo de desenvolvimento energético de 2027. <b>Regulamentação não localizada na verificação de 1º de agosto de 2026</b> — entrada marcada como pendente de resolução."
  },
  {
    "id": "cip",
    "n": "Contribuição de iluminação pública",
    "tag": "Contribuição municipal",
    "fin": "Custeio do serviço de iluminação pública do município. Não é encargo setorial nem tributo federal ou estadual, e não remunera consumo da unidade consumidora.",
    "paga": "Contribuintes definidos em lei municipal, com base de cálculo e regra próprias de cada município — que podem ser valor fixo por faixa, percentual da fatura, ou combinação.",
    "fat": "Aparece como linha própria na fatura, frequentemente com denominação que varia entre municípios. É cobrada pela distribuidora por convênio, mas o titular da receita é o município.",
    "mud": "Ciclo legislativo municipal, independente de qualquer calendário setorial. Duas plantas da mesma empresa em municípios vizinhos podem ter regras completamente distintas, e essa é uma das explicações estruturais para diferença de custo unitário entre unidades."
  }
] as const;
/** INST·08 · `var ET` (L4265–4306). */
const I08_ET = [
  {
    "id": "e1",
    "n": "Abertura do processo",
    "et": "Etapa 1",
    "oq": "A agência reguladora abre o processo tarifário da distribuidora conforme o calendário vinculado ao contrato de concessão, com data própria de cada concessionária.",
    "quem": "Agência reguladora, a partir do calendário de processos tarifários publicado.",
    "surp": "A data de abertura não é a data de efeito. Um analista que confunde as duas datas erra o período de comparação e atribui a um mês variação que pertence a outro.",
    "arq": "A data de abertura e a data prevista de efeito, para a concessionária específica da unidade analisada."
  },
  {
    "id": "e2",
    "n": "Apuração de custos",
    "et": "Etapa 2",
    "oq": "Apuração dos custos não gerenciáveis e dos custos gerenciáveis, com aplicação da metodologia dos procedimentos de regulação tarifária.",
    "quem": "Agência reguladora, com participação da distribuidora e contribuições em processo público.",
    "surp": "Componentes financeiros de exercícios anteriores entram nesta etapa e podem descolar a magnitude do resultado da variação de custos do ano corrente.",
    "arq": "A nota técnica e a memória de cálculo, que explicam a composição do índice e a presença de componentes financeiros."
  },
  {
    "id": "e3",
    "n": "Definição da estrutura",
    "et": "Etapa 3",
    "oq": "Conversão da receita requerida em tarifas por subgrupo, modalidade e posto. Na revisão periódica, também a definição dos postos tarifários da área de concessão.",
    "quem": "Agência reguladora, com base na metodologia de estrutura tarifária e nas curvas de carga apresentadas pela distribuidora.",
    "surp": "<b>É aqui que o intervalo de ponta pode mudar.</b> Uma série de doze meses que atravessa uma revisão pode ter horas de ponta diferentes nas duas metades, e nenhuma simulação construída sobre a janela antiga sobrevive a isso.",
    "arq": "Os postos tarifários aprovados, com o intervalo exato e a data de vigência."
  },
  {
    "id": "e4",
    "n": "Deliberação e homologação",
    "et": "Etapa 4",
    "oq": "Decisão colegiada e publicação da resolução homologatória com as tarifas de aplicação e a data de início de vigência.",
    "quem": "Diretoria da agência reguladora.",
    "surp": "A resolução traz tarifas por subgrupo, modalidade e posto, e o analista precisa localizar exatamente a linha correspondente ao enquadramento da unidade — não a média nem o valor de outro subgrupo.",
    "arq": "O número e o ano da resolução homologatória, a data de vigência e a planilha de tarifas de aplicação correspondente."
  },
  {
    "id": "e5",
    "n": "Aplicação na fatura",
    "et": "Etapa 5",
    "oq": "A distribuidora passa a aplicar as tarifas homologadas a partir da data de vigência, com rateio quando o ciclo de leitura da unidade atravessa a data.",
    "quem": "Distribuidora, conforme o ato homologatório.",
    "surp": "O ciclo de leitura raramente coincide com a data de vigência. A primeira fatura após o reajuste costuma misturar dias sob duas tarifas, e comparar essa fatura com a anterior sem considerar o rateio produz conclusão errada.",
    "arq": "As datas de leitura anterior e atual da fatura que atravessa a mudança, e o demonstrativo de rateio quando houver."
  },
  {
    "id": "e6",
    "n": "Camada mensal de bandeira",
    "et": "Etapa 6",
    "oq": "Acionamento mensal da bandeira tarifária conforme as condições de geração avaliadas, com adicional por unidade de energia consumida no ambiente regulado.",
    "quem": "Agência reguladora, com anúncio no fim do mês anterior.",
    "surp": "Esta camada muda o custo por unidade de energia sem qualquer alteração de tarifa homologada. É a explicação mais frequente para variação de conta com consumo estável — e a mais fácil de verificar.",
    "arq": "A cor vigente em cada mês da série e o rateio aplicado quando o ciclo atravessa meses de cores diferentes."
  },
  {
    "id": "e7",
    "n": "Mudança por lei fora do ciclo",
    "et": "Etapa 7",
    "oq": "Alterações legais que modificam encargos, rateios, benefícios e regime tributário, com vigência própria que não coincide com o calendário tarifário.",
    "quem": "Legislativo, com regulamentação pela agência reguladora quando exigida.",
    "surp": "Uma lei pode ter efeito declarado a partir de uma data e regulamentação publicada meses depois. O efeito na fatura pode aparecer no processo tarifário seguinte, e não imediatamente.",
    "arq": "O número e a data da lei, a data declarada de efeito, e o número e a data da norma regulamentadora — ou o registro de que a regulamentação estava pendente."
  },
  {
    "id": "e8",
    "n": "Reconciliação e decomposição",
    "et": "Etapa 8",
    "oq": "Trabalho do analista: separar, componente a componente, a parcela da variação atribuível a preço da parcela atribuível a quantidade.",
    "quem": "O analista, com as faturas, as tarifas homologadas de cada período e o registro do que mudou entre eles.",
    "surp": "Se o modelo não reproduz a fatura, o modelo não pode ser usado para projetar alternativa. Reconciliar primeiro, simular depois — nunca o contrário.",
    "arq": "A planilha de reconciliação com a diferença de arredondamento declarada, e a lista das origens verificadas quando ela não fecha."
  }
] as const;
/** INST·09 · `var NOMES` (L4370–4370). */
const I09_NOMES = [
  "Energia",
  "Uso da rede",
  "Demanda",
  "Encargos",
  "Tributos",
  "Reativo e outros"
] as const;
/** INST·09 · `var DIAG` (L4372–4398). */
const I09_DIAG = {
  "energia": {
    "t": "Viés de superestimação da energia",
    "sig": "Você atribui à energia peso maior do que ela tem. É o viés de quem raciocina a partir do mercado atacadista, onde o preço da energia é o objeto de negociação — e portanto parece ser o objeto do custo.",
    "efeito": "Produz expectativa irrealista sobre o efeito de mudança de ambiente de contratação. Se a energia é uma fração menor do total do que se supunha, a alavanca de negociação de preço é proporcionalmente menor.",
    "ctrl": "Corrige-se com disciplina de extração: transcrever a fatura linha a linha antes de formar opinião sobre composição, em vez de estimar a partir do que se conhece do setor.",
    "falta": "A composição real de faturas de vários perfis, subgrupos e concessionárias. Não existe composição típica nacional, e a intuição formada numa única planta não transfere."
  },
  "demanda": {
    "t": "Viés de subestimação da demanda",
    "sig": "Você atribui à demanda peso menor do que ela tem. É o viés de quem raciocina em energia acumulada e esquece que a parcela de capacidade é cobrada mesmo quando não utilizada.",
    "efeito": "Produz diagnósticos que ignoram a alavanca contratual mais acessível de toda a fatura. Em plantas com fator de carga baixo, a parcela de capacidade pode ser o maior bloco isolado.",
    "ctrl": "Corrige-se olhando primeiro o cadastro e a linha de demanda, antes de olhar consumo. A ordem de leitura deste módulo foi desenhada exatamente para forçar essa inversão.",
    "falta": "O fator de carga da unidade. Sem ele, não há como antecipar se a parcela de capacidade será relevante ou marginal naquela fatura específica."
  },
  "rede": {
    "t": "Viés na leitura do uso da rede",
    "sig": "Seu desvio maior está no bloco de uso da rede. É o bloco mais opaco da fatura, porque agrega componentes de fio e itens setoriais sem desagregação visível.",
    "efeito": "Produz erro em qualquer modelagem de migração de ambiente ou de geração distribuída, que dependem justamente da desagregação desse bloco.",
    "ctrl": "Corrige-se com a planilha tarifária do processo tarifário da concessionária, que desagrega os componentes. Para auditoria de primeira camada, a desagregação não é necessária; para modelagem, é indispensável.",
    "falta": "A planilha tarifária vigente da concessionária, no subgrupo e na modalidade corretos."
  },
  "tributos": {
    "t": "Viés na leitura da carga tributária",
    "sig": "Seu desvio maior está no bloco de tributos. É o bloco cuja composição mais varia entre estados e municípios, e o que está em transição de regime em 2026.",
    "efeito": "Produz erro de reconciliação: a maior parte das divergências entre tarifa homologada e tarifa aparente da fatura se explica por tributo compondo o valor unitário exibido.",
    "ctrl": "Corrige-se verificando o demonstrativo de bases e valores da fatura, e a legislação da unidade federativa e do município da unidade.",
    "falta": "A alíquota efetiva aplicável e a composição da base, incluindo a separação entre demanda utilizada e demanda contratada não utilizada."
  },
  "equilibrado": {
    "t": "Estimativa calibrada",
    "sig": "Seus desvios estão distribuídos e nenhum bloco isolado carrega distorção relevante. Isso indica que a intuição sobre composição de fatura está razoavelmente formada.",
    "efeito": "Reduz o risco de aplicar viés sistemático a uma conta de cliente. Não elimina: a composição varia enormemente por perfil e por concessionária, e calibração num caso não transfere automaticamente.",
    "ctrl": "Mantém-se repetindo o exercício com faturas de perfis diferentes — subgrupos distintos, modalidades distintas, fatores de carga distintos.",
    "falta": "Um conjunto de faturas de perfis variados. Uma calibração formada num único perfil é sorte, não competência."
  }
} as const;
/** INST·10 · `var PASSOS` (L4472–4518). */
const I10_PASSOS = [
  {
    "id": "p1",
    "n": "Cadastro",
    "t": 20,
    "olh": "Número da unidade, grupo, subgrupo, classe, subclasse, modalidade tarifária e tensão de fornecimento. Tudo isso está no cabeçalho, antes de qualquer valor.",
    "par": "Se a modalidade cadastrada não for elegível ao subgrupo, a triagem encerra aqui: esse é o achado principal e tudo o mais depende de resolvê-lo primeiro.",
    "irr": "Enquadramento inválido torna irrelevante qualquer análise de otimização a jusante, porque otimizar dentro de uma estrutura de cobrança que não deveria estar em vigor é otimizar sobre premissa falsa.",
    "reg": "Subgrupo, modalidade, tensão e a data do contrato de uso quando disponível. Esses quatro campos determinam quais instrumentos deste módulo se aplicam ao caso."
  },
  {
    "id": "p2",
    "n": "Período",
    "t": 15,
    "olh": "Data da leitura anterior, data da leitura atual, número de dias do ciclo e data de vencimento.",
    "par": "Ciclo com número de dias muito diferente do usual invalida comparação direta com o mês anterior, e o achado passa a ser a própria atipicidade do ciclo.",
    "irr": "Se o ciclo atravessou uma data de reajuste tarifário ou meses com bandeiras de cores diferentes, nenhuma comparação de valores com o período anterior é válida sem decompor efeito preço de efeito quantidade.",
    "reg": "As duas datas de leitura, o número de dias e a verificação de se o ciclo atravessa reajuste ou mudança de bandeira."
  },
  {
    "id": "p3",
    "n": "Demanda",
    "t": 40,
    "olh": "Demanda contratada, demanda medida e demanda faturada, separadas por posto quando a modalidade separar. Presença ou ausência de linha de ultrapassagem.",
    "par": "Nenhum. Este passo levanta hipótese e nunca conclui: um único ciclo não distingue folga estrutural de mês atípico.",
    "irr": "Nada torna este passo irrelevante, mas ele próprio não torna nada irrelevante. É o passo que mais frequentemente produz a hipótese que motivará o pedido de doze meses.",
    "reg": "Os três valores de demanda, a razão entre medida e contratada, e a presença de ultrapassagem com o valor da base quando houver."
  },
  {
    "id": "p4",
    "n": "Reativo",
    "t": 20,
    "olh": "Presença de linhas de excedente reativo, sob a nomenclatura vigente ou sob rótulo legado da distribuidora. A legenda da fatura é a fonte de tradução.",
    "par": "Ausência da linha em todos os ciclos disponíveis elimina a hipótese tarifária de problema de fator de potência — mas não elimina a hipótese técnica.",
    "irr": "A presença da linha não torna outros passos irrelevantes, mas define desde já que o caso terá um achado que exige estudo elétrico, e não decisão contratual.",
    "reg": "Presença ou ausência, o rótulo exato usado pela distribuidora, e o padrão temporal se a fatura o detalhar."
  },
  {
    "id": "p5",
    "n": "Distribuição por posto",
    "t": 30,
    "olh": "Consumo no posto de ponta contra consumo total do ciclo, e a razão entre os dois.",
    "par": "Participação de ponta muito baixa torna irrelevante qualquer projeto de deslocamento de carga, e essa conclusão negativa economiza semanas de discussão.",
    "irr": "Se a participação for estruturalmente baixa, todo o eixo de gestão de carga sai do escopo e o esforço se redireciona para demanda contratada e reativo.",
    "reg": "Consumo por posto, participação percentual da ponta e o número de horas de ponta faturadas no ciclo."
  },
  {
    "id": "p6",
    "n": "Bandeira e ajustes",
    "t": 25,
    "olh": "Cor da bandeira aplicada, rateio quando o ciclo atravessa meses de cores diferentes, componentes financeiros, refaturamentos e linhas negativas.",
    "par": "Presença de ajuste relevante exige vinculá-lo ao período de origem antes de montar qualquer série. Sem isso, a série mistura competência e caixa.",
    "irr": "Um refaturamento não identificado pode explicar sozinho toda a variação que se pretendia atribuir a decisões operacionais — e torna irrelevante qualquer hipótese construída sobre a variação bruta.",
    "reg": "A cor aplicada, o rateio quando houver, e cada ajuste com o período de origem identificado."
  },
  {
    "id": "p7",
    "n": "Reconciliação de uma linha",
    "t": 60,
    "olh": "Escolher uma linha, multiplicar quantidade por tarifa unitária e comparar com o valor exibido na fatura.",
    "par": "Se fecha dentro da diferença de arredondamento, a leitura da fatura está calibrada e os demais valores podem ser tratados como confiáveis.",
    "irr": "Se não fecha, verificar tributo compondo o valor unitário, casas decimais da tarifa, rateio de ciclo e compensação de perdas <b>antes</b> de suspeitar de erro de faturamento. Suspeitar antes de verificar é o caminho mais curto para uma contestação rejeitada.",
    "reg": "A linha escolhida, os dois valores comparados, a diferença encontrada e a origem verificada quando houver diferença."
  },
  {
    "id": "p8",
    "n": "Tributos",
    "t": 30,
    "olh": "Bases e valores dos tributos incidentes, e a separação entre a parcela tributável e a não tributável no que se refere a demanda.",
    "par": "Ausência de separação entre demanda utilizada e demanda contratada não utilizada, numa unidade cuja demanda medida é inferior à contratada, é ponto de verificação com regra consolidada por trás.",
    "irr": "Nenhum achado deste passo torna outros irrelevantes, mas a composição tributária explica a maior parte das divergências entre tarifa homologada e tarifa aparente — e portanto precisa vir antes de qualquer acusação de erro.",
    "reg": "As bases declaradas, os valores, e a verificação da separação da parcela de demanda."
  },
  {
    "id": "p9",
    "n": "Inventário do que falta",
    "t": 40,
    "olh": "Listar explicitamente o que não está no documento e seria necessário para concluir cada uma das hipóteses levantadas nos passos anteriores.",
    "par": "Nenhum. Este passo sempre produz saída, e é o único da sequência do qual isso é verdade.",
    "irr": "Nada. Este é o passo que determina o veredito do roteador de diagnóstico e, em consequência, se o caso avança ou encerra com parecer.",
    "reg": "A lista específica: quantos meses de histórico faltam, se há memória de massa, se há plano de produção, se há contrato de uso, e quais tarifas homologadas precisam ser buscadas."
  }
] as const;
/** INST·11 · `var ACHADO` (L4588–4609). */
const I11_ACHADO = {
  "enq": {
    "n": "Enquadramento suspeito",
    "exige": "Perfil de demanda e de energia por posto ao longo de doze meses, mais as tarifas homologadas vigentes da concessionária no subgrupo e nas modalidades comparadas.",
    "minimo": "O cadastro da fatura já basta para verificar elegibilidade da modalidade ao subgrupo — e essa verificação isolada pode encerrar o caso com um achado.",
    "semDados": "Indicar em quais linhas o resultado mudaria e em que direção, sem magnitude. Direção é afirmação sobre estrutura de cobrança e é defensável com uma fatura; magnitude não é."
  },
  "dem": {
    "n": "Demanda descolada",
    "exige": "Série de doze meses com memória de massa por intervalo, explicação operacional de cada pico, e o plano de produção com expansões previstas.",
    "minimo": "Uma fatura mostra a folga do ciclo, o que é indício de direção. Não distingue folga estrutural de mês atípico — e em muitas operações o mês atípico é o que define o contrato.",
    "semDados": "Declarar que não é concluível e entregar a lista específica do que falta. Recomendar um valor de demanda sem a série é recomendar um número que não sobrevive à primeira retomada após interrupção."
  },
  "fp": {
    "n": "Excedente reativo presente",
    "exige": "Perfil de fator de potência por intervalo nas duas janelas de apuração e, havendo carga não linear na instalação, medição de qualidade de energia com análise de distorção.",
    "minimo": "A presença da linha na fatura é fato e basta para caracterizar o achado. O padrão temporal, quando a fatura o detalha, já distingue estrutural de pontual.",
    "semDados": "Classificar entre estrutural e pontual conforme o padrão observado e recomendar o estudo elétrico. A fatura prova a cobrança; ela não dimensiona a solução."
  },
  "amb": {
    "n": "Volume compatível com ambiente livre",
    "exige": "Série horária de consumo, custo entregue completo dos dois lados incluindo rede, encargos, tributos, representação e garantias, e apetite de risco declarado pela empresa.",
    "minimo": "Volume, tensão de conexão e perfil declarado permitem verificar elegibilidade. Elegibilidade não é conveniência.",
    "semDados": "Veredito de investigação, sem comparar preço de contrato com total cativo. Essa comparação específica compara uma parte com o todo e produz diferença que não existe."
  },
  "nada": {
    "n": "Nada fora do esperado",
    "exige": "Para afirmar adequação com segurança, a mesma série de doze meses — o diagnóstico negativo tem exigência de evidência idêntica à do positivo.",
    "minimo": "Uma fatura sem linha de ultrapassagem, sem excedente reativo e com demanda coerente é indício de adequação, não prova.",
    "semDados": "Registrar que nada foi identificado com o material disponível, e declarar o que seria necessário para confirmar adequação. É diferente de dizer que está adequado."
  }
} as const;
// </DADOS-GERADOS>

// ── auxiliares (os do script) ────────────────────────────────────────────────
const esc = (t: string) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function clamp(v: number, a: number, b: number): number {
  if (isNaN(v)) return a;
  return v < a ? a : v > b ? b : v;
}
function numOf(v: EntradaInstrumento | undefined, def: number, a: number, b: number): number {
  if (v === undefined || v === '') return def;
  const x = parseFloat(String(v).replace(',', '.'));
  if (isNaN(x)) return def;
  return clamp(x, a, b);
}
function fmt(n: number, d: number): string {
  if (isNaN(n) || !isFinite(n)) return '—';
  return n.toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
}
const txt = (v: EntradaInstrumento | undefined, def: string) => (v === undefined || v === '' ? def : String(v));
type Cartao = [rotulo: string, texto: string];
const cartoes = (cs: Cartao[]) => cs.map(([r, t]) => `<b>${r}</b><br>${t}`).join('<br><br>');
const juntar = (...partes: string[]) => partes.filter((p) => p && p.trim()).join('<br><br>');
/** Painel `.tl-panel` da fonte: linha de cima (yr), título (ti), corpo. */
const painel = (yr: string, ti: string, corpo: string) => `<b>${yr}</b><br><b>${ti}</b><br>${corpo}`;
const semTags = (s: string) => s.replace(/<[^>]+>/g, '');

// ── INST·01 — Mapa da fatura, três lentes (§MAP) ─────────────────────────────
const i01: CalculateFn = (i) => {
  const l = txt(i['mf-seg'], 'unit') as keyof typeof I01_LENTE;
  const lente = I01_LENTE[l] ? l : 'unit';
  const sel = txt(i['mf-linha'], '');
  const lens = painel('Lente ativa', I01_LENTE[lente].t, I01_LENTE[lente].d);
  let line: string;
  const L = I01_LINHAS.find((x) => x.id === sel) as Record<string, string> | undefined;
  if (!sel || !L) {
    line = painel('Detalhe', 'Escolha uma linha', 'Catorze famílias de componentes. A lente ativa determina a pergunta feita a cada uma delas.');
  } else {
    line =
      painel(esc(L.c) + ' · ' + I01_LENTE[lente].t, esc(L.n), L[lente]) +
      '<br><br><b>As outras duas lentes</b><br>' +
      (Object.keys(I01_LENTE) as (keyof typeof I01_LENTE)[])
        .filter((k) => k !== lente)
        .map((k) => '<b>' + I01_LENTE[k].t + ':</b> ' + semTags(L[k]))
        .join('<br>');
  }
  return { valores: {}, veredito: juntar(lens, line) };
};

// ── INST·02 — Comparador de modalidades ──────────────────────────────────────
const i02: CalculateFn = (i) => {
  const p = txt(i['cm-perf'], 'plana') as keyof typeof I02_PERFIL;
  const m = txt(i['cm-mod'], 'azul');
  const s = txt(i['cm-sg'], 'a4') as keyof typeof I02_ELEG;
  const cel = (I02_CEL as Record<string, { dir: string; linhas: string; risco: string; falta: string }>)[m + '|' + p];
  const elegivel = (I02_ELEG[s] as readonly string[]).indexOf(m) >= 0;
  let head: string;
  if (m === 'conv') {
    head = '<b>Não é opção ordinária de enquadramento.</b> A modalidade convencional binômia não figura na relação vigente de modalidades disponíveis ao grupo A. Subsiste como estrutura no arcabouço metodológico tarifário e em situações contratuais específicas, e por isso não entra na comparação entre alternativas contratáveis.';
  } else if (!elegivel) {
    head = '<b>Modalidade indisponível ao subgrupo ' + I02_SGNOME[s] + '.</b> A modalidade de demanda única é disponível apenas aos subgrupos A3a, A4 e AS. Simular esta modalidade para o subgrupo ' + I02_SGNOME[s] + ' é erro de elegibilidade, não de premissa — e é verificável no cadastro da própria fatura antes de qualquer cálculo.';
  } else {
    head = '<b>Modalidade elegível ao subgrupo ' + I02_SGNOME[s] + '.</b> Perfil considerado: ' + I02_PERFIL[p] + '. As direções abaixo são estruturais e derivam da forma de cobrança; a magnitude depende das tarifas homologadas da concessionária e do perfil medido real.';
  }
  return {
    valores: {},
    veredito: juntar(
      head,
      cartoes([
        ['Direção estrutural', esc(cel.dir)],
        ['Linhas que mudariam', esc(cel.linhas)],
        ['Risco dominante', esc(cel.risco)],
        ['O que falta para concluir', esc(cel.falta)],
        ['O que este instrumento não devolve', 'Valor de economia, percentual de redução ou qualquer conclusão financeira. Sem doze meses de medição e sem as tarifas homologadas da concessionária específica, qualquer número seria estimativa apresentada como resultado.'],
      ]),
    ),
  };
};

type Faixa = { readonly t: string; readonly sig: string; readonly causa: string; readonly ctrl: string; readonly falta: string };
const cartoesDaFaixa = (F: Faixa) =>
  cartoes([
    ['O que este resultado significa', esc(F.sig)],
    ['O que costuma causá-lo', esc(F.causa)],
    ['O que a empresa controla', esc(F.ctrl)],
    ['O que ainda falta saber', esc(F.falta)],
  ]);

// ── INST·03 — Dimensionador de demanda ───────────────────────────────────────
const i03: CalculateFn = (i) => {
  const ctr = numOf(i['dd-ctr'], 1200, 10, 20000);
  const max = numOf(i['dd-max'], 1010, 10, 20000);
  const med = numOf(i['dd-med'], 720, 1, 20000);
  const mes = numOf(i['dd-mes'], 12, 1, 36);
  const tol = numOf(i['dd-tol'], 5, 0, 20);

  const util = ctr > 0 ? (max / ctr) * 100 : 0;
  const fc = max > 0 ? (med / max) * 100 : 0;
  const lim = ctr * (1 + tol / 100);
  const folga = lim - max;

  let F: (typeof I03_FAIXA)[number] = I03_FAIXA[I03_FAIXA.length - 1];
  for (let k = 0; k < I03_FAIXA.length; k++) if (util <= I03_FAIXA[k].max) { F = I03_FAIXA[k]; break; }

  let histNota = '';
  if (mes < 6) {
    histNota = ' <b>Atenção ao histórico:</b> com ' + fmt(mes, 0) + ' mes' + (mes === 1 ? '' : 'es') + ' de série, nenhum diagnóstico de dimensionamento é concluível. A faixa acima descreve o que se vê, não o que se pode afirmar.';
  } else if (mes < 12) {
    histNota = ' <b>Histórico parcial:</b> ' + fmt(mes, 0) + ' meses não cobrem um ciclo anual completo. Sazonalidade, parada programada e retomada após interrupção podem estar fora da janela observada.';
  }
  const vd = '<b>' + F.t + '.</b> Utilização do contrato em ' + fmt(util, 1) + '%, com fator de carga aparente de ' + fmt(fc, 1) + '%.' + histNota;

  let zona = '';
  if (util > 80 && util <= 95 && mes >= 12) {
    zona = cartoes([['Zona de decisão de risco', 'Esta é a faixa em que a resposta correta frequentemente é <b>depende do plano de produção</b>. A série histórica sozinha não distingue um contrato bem calibrado de um contrato que ficará apertado com a expansão do ano seguinte. Sem o plano, o instrumento descreve; ele não recomenda.']]);
  }
  if (mes < 12) {
    zona = cartoes([['Não é possível concluir', 'Com menos de doze meses, a distinção entre folga estrutural e mês atípico não é possível. Em muitas operações industriais, o mês atípico é justamente o que define o contrato — retomada após interrupção, teste de carga, coincidência de partidas. A saída correta aqui é a lista do que falta, não um número recomendado.']]);
  }
  return {
    valores: { 'dd-util': util, 'dd-fc': fc, 'dd-lim': lim, 'dd-folga': folga },
    textos: { 'dd-util': fmt(util, 1) + '%', 'dd-fc': fmt(fc, 1) + '%', 'dd-lim': fmt(lim, 0) + ' kW', 'dd-folga': fmt(folga, 0) + ' kW' },
    veredito: juntar(vd, cartoesDaFaixa(F), zona),
  };
};

// ── INST·04 — Simulador de ultrapassagem ─────────────────────────────────────
const i04: CalculateFn = (i) => {
  const ctr = numOf(i['ul-ctr'], 1000, 10, 20000);
  const med = numOf(i['ul-med'], 1060, 10, 20000);
  const tol = numOf(i['ul-tol'], 5, 0, 20);
  const mul = numOf(i['ul-mul'], 2, 1, 4);
  const tar = numOf(i['ul-tar'], 40, 1, 300);

  const lim = ctr * (1 + tol / 100);
  const disparou = med > lim;
  const base = disparou ? med - ctr : 0;
  const normal = ctr * tar;
  const pen = base * mul * tar;
  const total = normal + pen;
  const peso = total > 0 ? (pen / total) * 100 : 0;
  const exc = ctr > 0 ? (med / ctr - 1) * 100 : 0;

  let F: (typeof I04_FAIXA)[number];
  if (!disparou) {
    const margem = ((lim - med) / ctr) * 100;
    F = margem > 2 ? I04_FAIXA[0] : I04_FAIXA[1];
  } else {
    F = exc <= 15 ? I04_FAIXA[2] : I04_FAIXA[3];
  }

  const vd = disparou
    ? '<b>' + F.t + '.</b> A medição de ' + fmt(med, 0) + ' kW superou o limite de disparo de ' + fmt(lim, 0) + ' kW. A base da parcela é <b>' + fmt(base, 0) + ' kW</b> — a diferença entre medida e contratada, e não os ' + fmt(med - lim, 0) + ' kW acima da tolerância. Essa é a distinção que material comercial mais frequentemente inverte.'
    : '<b>' + F.t + '.</b> A medição de ' + fmt(med, 0) + ' kW ficou abaixo do limite de disparo de ' + fmt(lim, 0) + ' kW. Nenhuma parcela de ultrapassagem é gerada neste ciclo. Margem disponível: ' + fmt(lim - med, 0) + ' kW.';

  return {
    valores: { 'ul-lim': lim, 'ul-base': base, 'ul-norm': normal, 'ul-pen': pen, 'ul-peso': peso },
    textos: { 'ul-lim': fmt(lim, 0) + ' kW', 'ul-base': fmt(base, 0) + ' kW', 'ul-norm': fmt(normal, 0), 'ul-pen': fmt(pen, 0), 'ul-peso': fmt(peso, 1) + '%' },
    veredito: juntar(
      vd,
      cartoesDaFaixa(F),
      cartoes([['Parâmetros que você precisa confirmar', 'Tolerância e multiplicador são parâmetros normativos e vêm aqui como entrada editável por decisão de projeto. A tolerância difere conforme a natureza da demanda contratada, e há material em circulação reproduzindo multiplicador de redação anterior à consolidação de 2021. Confirme no texto compilado vigente e no contrato de uso da unidade antes de qualquer uso externo.']]),
    ),
  };
};

// ── INST·05 — Deslocador de carga entre postos ───────────────────────────────
const i05: CalculateFn = (i) => {
  const tot = numOf(i['dl-tot'], 420, 1, 20000);
  let pta = numOf(i['dl-pta'], 42, 0, 20000);
  const des = numOf(i['dl-des'], 30, 0, 100);
  const hrs = numOf(i['dl-hrs'], 63, 1, 200);

  if (pta > tot) pta = tot; // a fonte também reescreve o campo; aqui só a conta

  const p0 = tot > 0 ? (pta / tot) * 100 : 0;
  const vol = (pta * des) / 100;
  const pta1 = pta - vol;
  const p1 = tot > 0 ? (pta1 / tot) * 100 : 0;
  const pot = hrs > 0 ? (pta * 1000) / hrs : 0;

  const barras = ['<b>Ponta hoje</b> ' + fmt(pta, 1) + ' MWh', '<b>Ponta depois</b> ' + fmt(pta1, 1) + ' MWh', '<b>Fora de ponta</b> ' + fmt(tot - pta1, 1) + ' MWh'].join('<br>');

  let F: (typeof I05_FAIXA)[number] = I05_FAIXA[I05_FAIXA.length - 1];
  for (let k = 0; k < I05_FAIXA.length; k++) if (p0 <= I05_FAIXA[k].max) { F = I05_FAIXA[k]; break; }

  const vd =
    '<b>' + F.t + '.</b> A ponta representa ' + fmt(p0, 1) + '% do consumo do ciclo. Deslocando ' + fmt(des, 0) + '% desse volume, a participação cairia para ' + fmt(p1, 1) + '%, com <b>' + fmt(vol, 1) + ' MWh</b> transferidos para fora da janela. ' +
    'A potência média demandada dentro da janela é de aproximadamente ' + fmt(pot, 0) + ' kW — número que não deve ser confundido com a demanda máxima registrada no posto.';

  return {
    valores: { 'dl-p0': p0, 'dl-p1': p1, 'dl-vol': vol, 'dl-pot': pot },
    textos: { 'dl-p0': fmt(p0, 1) + '%', 'dl-p1': fmt(p1, 1) + '%', 'dl-vol': fmt(vol, 1) + ' MWh', 'dl-pot': fmt(pot, 0) + ' kW' },
    veredito: juntar(
      barras,
      vd,
      cartoesDaFaixa(F),
      cartoes([['Por que não há valor em dinheiro aqui', 'Converter volume deslocado em valor exigiria a diferença entre as tarifas de energia dos dois postos na concessionária específica, e, na modalidade que separa demanda por posto, também o efeito sobre a demanda de ponta. Nenhuma dessas informações está na fatura sozinha. O volume é o que o instrumento pode afirmar; o valor é o que o processo tarifário determina.']]),
    ),
  };
};

// ── INST·06 — Apurador de excedente reativo ──────────────────────────────────
const i06: CalculateFn = (i) => {
  const ref = numOf(i['fp-ref'], 0.92, 0.5, 1);
  const ind = numOf(i['fp-ind'], 0.87, 0.3, 1);
  const cap = numOf(i['fp-cap'], 0.95, 0.3, 1);
  let vdi = numOf(i['fp-vd1'], 180, 0, 600);
  let vno = numOf(i['fp-vn1'], 0, 0, 200);
  const hrs = numOf(i['fp-hrs'], 6, 1, 10);

  const totNoite = hrs * 30;
  const totDia = (24 - hrs) * 30;
  if (vdi > totDia) vdi = Math.round(totDia);
  if (vno > totNoite) vno = Math.round(totNoite);

  const pd = totDia > 0 ? (vdi / totDia) * 100 : 0;
  const pn = totNoite > 0 ? (vno / totNoite) * 100 : 0;
  const dd = ref - ind;
  const dn = ref - cap;

  const temInd = vdi > 0 && ind < ref;
  const temCap = vno > 0 && cap < ref;
  let key = 'limpo';
  if (temInd && temCap) key = 'ambas';
  else if (temCap) key = 'cap';
  else if (temInd) key = pd > 25 ? 'ind-estr' : 'ind-pont';

  let F: (typeof I06_FAIXA)[number] = I06_FAIXA[0];
  for (let k = 0; k < I06_FAIXA.length; k++) if (I06_FAIXA[k].k === key) F = I06_FAIXA[k];

  let nota = '';
  if (vdi > 0 && ind >= ref) nota = ' <b>Inconsistência de entrada:</b> foram informados intervalos em violação na janela indutiva, mas o fator típico informado está dentro da referência. Verifique se a violação ocorre em intervalos específicos que a média não representa — o que é comum e é justamente por isso que a apuração é por intervalo.';
  if (vno > 0 && cap >= ref) nota += ' <b>Inconsistência de entrada:</b> foram informados intervalos em violação na janela capacitiva com fator típico dentro da referência. O mesmo raciocínio se aplica: a média mensal esconde violação por intervalo.';
  const vd = '<b>' + F.t + '.</b> ' + fmt(pd, 1) + '% dos intervalos da janela indutiva e ' + fmt(pn, 1) + '% dos intervalos da janela capacitiva foram informados como em violação, considerando janela noturna de ' + fmt(hrs, 0) + ' horas e referência de ' + fmt(ref, 2) + '.' + nota;

  return {
    valores: { 'fp-pd': pd, 'fp-pn': pn, 'fp-dd': -dd, 'fp-dn': -dn },
    textos: { 'fp-pd': fmt(pd, 1) + '%', 'fp-pn': fmt(pn, 1) + '%', 'fp-dd': (dd > 0 ? '−' : '+') + fmt(Math.abs(dd), 3), 'fp-dn': (dn > 0 ? '−' : '+') + fmt(Math.abs(dn), 3) },
    veredito: juntar(
      vd,
      cartoesDaFaixa(F),
      cartoes([['Onde a fatura para de servir', 'A fatura prova que houve cobrança; ela não prova qual banco instalar, em que ponto, com quantos estágios nem com que proteção. Entre o achado e a solução existe um estudo elétrico com medição de qualidade de energia, inventário de cargas e verificação de risco de ressonância, conduzido por profissional habilitado. Este instrumento caracteriza o problema — ele não dimensiona a solução.']]),
    ),
  };
};

// ── INST·07 — Anatomia dos encargos ──────────────────────────────────────────
const i07: CalculateFn = (i) => {
  const sel = txt(i['en-sel'], '');
  const E = I07_ENC.find((x) => x.id === sel);
  if (!E) {
    return { valores: {}, veredito: painel('Anatomia', 'Escolha um item', 'Onze itens da linha de encargos e obrigações setoriais, cada um com quatro campos fixos. Ler o mesmo campo em todos os onze, na vertical, ensina mais do que ler um item inteiro.') };
  }
  return {
    valores: {},
    veredito: painel(esc(E.tag), esc(E.n), cartoes([
      ['O que financia', esc(E.fin)],
      ['Quem paga', esc(E.paga)],
      ['Como aparece na fatura', esc(E.fat)],
      ['O que mudou ou pode mudar', E.mud],
    ])),
  };
};

// ── INST·08 — Régua do ciclo tarifário ───────────────────────────────────────
const i08: CalculateFn = (i) => {
  const sel = txt(i['rc-sel'], '');
  const marc: Record<string, boolean> = {};
  for (const e of I08_ET) marc[e.id] = txt(i[`rc-v-${e.id}`], 'nao') === 'sim';
  let n = 0;
  for (const k in marc) if (marc[k]) n++;

  let est: string;
  if (n === 0) est = 'Dossiê não iniciado';
  else if (n < 4) est = 'Dossiê parcial';
  else if (n < 8) est = 'Dossiê em construção';
  else est = 'Dossiê completo';

  let vd: string;
  if (n === 0) vd = '<b>Nenhuma etapa verificada.</b> Sem o dossiê do ciclo tarifário da concessionária, qualquer comparação entre dois períodos atribui a decisões da empresa efeitos que podem ter sido do calendário. Clique numa etapa para ler o detalhe; clique de novo na etapa já selecionada para marcá-la como verificada.';
  else if (n < 4) vd = '<b>Dossiê parcial — ' + fmt(n, 0) + ' de ' + I08_ET.length + '.</b> Ainda não é possível decompor variação entre efeito preço e efeito quantidade com segurança. As etapas de estrutura, homologação e aplicação são as que mais frequentemente explicam variação inesperada.';
  else if (n < 8) vd = '<b>Dossiê em construção — ' + fmt(n, 0) + ' de ' + I08_ET.length + '.</b> Já há base para explicar parte da variação. Verifique especialmente se a etapa de definição de estrutura foi coberta: é nela que o intervalo de ponta pode ter mudado, e essa mudança invalida silenciosamente qualquer simulação de deslocamento.';
  else vd = '<b>Dossiê completo.</b> Com as oito etapas verificadas, uma comparação de doze meses pode declarar o que mudou no meio, componente a componente. Este é o estado mínimo para que um relatório atribua corretamente cada parcela de variação a preço, a quantidade ou a calendário.';

  const E = I08_ET.find((x) => x.id === sel);
  const p = E
    ? painel(esc(E.et) + (marc[E.id] ? ' · verificada' : ''), esc(E.n), cartoes([
        ['O que acontece', esc(E.oq)],
        ['Quem decide', esc(E.quem)],
        ['O que pode surpreender', E.surp],
        ['O que arquivar', esc(E.arq)],
      ]))
    : painel('Régua', 'Escolha uma etapa', 'Do início do processo tarifário até o efeito na fatura. Clicar numa etapa abre o detalhe; clicar novamente na etapa aberta alterna a marcação de verificada.');

  return {
    valores: { 'rc-cnt': n },
    textos: { 'rc-cnt': fmt(n, 0) + ' de ' + I08_ET.length, 'rc-est': est },
    veredito: juntar(p, vd),
  };
};

// ── INST·09 — Reconstrutor de fatura ─────────────────────────────────────────
const i09: CalculateFn = (i) => {
  const est: number[] = [];
  const real: number[] = [];
  for (let k = 1; k <= 6; k++) {
    est.push(numOf(i['rb-e' + k], 0, 0, 100));
    real.push(numOf(i['rb-r' + k], 0, 0, 100));
  }
  let se = 0;
  let sr = 0;
  for (let j = 0; j < 6; j++) { se += est[j]; sr += real[j]; }

  let errTot = 0;
  let maiorV = 0;
  let maiorI = 0;
  const linhas: string[] = [];
  for (let k = 0; k < 6; k++) {
    const d = est[k] - real[k];
    errTot += Math.abs(d);
    if (Math.abs(d) > Math.abs(maiorV)) { maiorV = d; maiorI = k; }
    linhas.push('<b>' + esc(I09_NOMES[k]) + '</b> ' + (d > 0 ? '+' : '') + fmt(d, 0) + ' p.p.');
  }

  let key: keyof typeof I09_DIAG = 'equilibrado';
  if (Math.abs(maiorV) >= 6) {
    if (maiorI === 0 && maiorV > 0) key = 'energia';
    else if (maiorI === 2 && maiorV < 0) key = 'demanda';
    else if (maiorI === 1) key = 'rede';
    else if (maiorI === 4) key = 'tributos';
    else if (maiorI === 0 && maiorV < 0) key = 'rede';
    else if (maiorI === 2 && maiorV > 0) key = 'demanda';
    else key = 'equilibrado';
  }
  const D = I09_DIAG[key];

  let somaAviso = '';
  if (Math.abs(se - 100) > 2 || Math.abs(sr - 100) > 2) {
    somaAviso = ' <b>Atenção às somas:</b> a estimativa soma ' + fmt(se, 0) + '% e o real soma ' + fmt(sr, 0) + '%. Enquanto as duas não fecharem próximo de cem, o erro por bloco mistura distorção de composição com distorção de escala, e o diagnóstico de viés fica contaminado.';
  }
  const vd = '<b>' + D.t + '.</b> Erro absoluto total de ' + fmt(errTot, 0) + ' pontos percentuais, com o maior desvio em <b>' + I09_NOMES[maiorI] + '</b> (' + (maiorV > 0 ? '+' : '') + fmt(maiorV, 0) + ' p.p.).' + somaAviso;

  return {
    valores: { 'rb-se': se, 'rb-sr': sr, 'rb-err': errTot },
    textos: { 'rb-se': fmt(se, 0) + '%', 'rb-sr': fmt(sr, 0) + '%', 'rb-err': fmt(errTot, 0) + ' p.p.', 'rb-maior': I09_NOMES[maiorI] + ' · ' + (maiorV > 0 ? '+' : '') + fmt(maiorV, 0) },
    veredito: juntar(
      linhas.join('<br>'),
      vd,
      cartoes([
        ['O que este padrão significa', esc(D.sig)],
        ['O efeito prático do viés', esc(D.efeito)],
        ['Como se corrige', esc(D.ctrl)],
        ['O que ainda falta', esc(D.falta)],
      ]),
    ),
  };
};

// ── INST·10 — Ordem de leitura cronometrada ──────────────────────────────────
const i10: CalculateFn = (i) => {
  const sel = txt(i['ol-sel'], '');
  const feito: Record<string, boolean> = {};
  for (const p of I10_PASSOS) feito[p.id] = txt(i[`ol-f-${p.id}`], 'nao') === 'sim';
  let n = 0;
  let tempo = 0;
  I10_PASSOS.forEach((p) => { if (feito[p.id]) { n++; tempo += p.t; } });
  const mmss = fmt(Math.floor(tempo / 60), 0) + ' min ' + fmt(tempo % 60, 0) + ' s';

  let est: string;
  if (n === 0) est = 'Não iniciada';
  else if (n < 3) est = 'Triagem incompleta';
  else if (n < 7) est = 'Leitura parcial';
  else if (n < 9) est = 'Quase completa';
  else est = 'Leitura completa';

  let vd: string;
  if (n === 0) vd = '<b>Leitura não iniciada.</b> Clique num passo para ler o detalhe; clique novamente no passo aberto para marcá-lo como executado. A ordem importa mais do que a completude: o erro que custa caro não é a linha esquecida, é a ordem errada, porque ela faz perder o achado que tornaria os demais irrelevantes.';
  else if (n < 3) vd = '<b>Triagem incompleta — ' + fmt(n, 0) + ' de 9.</b> Os três primeiros passos consomem menos de um minuto e meio somados e respondem à maior parte das perguntas de triagem. Cadastro antes de valores, período antes de comparação: essa é a regra que organiza a sequência inteira.';
  else if (n < 7) vd = '<b>Leitura parcial — ' + fmt(n, 0) + ' de 9, com ' + mmss + ' acumulados.</b> As hipóteses já estão levantadas. Falta a camada de verificação: reconciliação de uma linha e composição tributária são o que distingue hipótese de achado.';
  else if (n < 9) vd = '<b>Quase completa — ' + fmt(n, 0) + ' de 9.</b> Falta o passo que nunca pode ser pulado. O inventário do que falta é o único passo que sempre produz saída, e é ele que determina se o caso avança ou encerra com parecer.';
  else vd = '<b>Leitura completa em ' + mmss + '.</b> Os nove passos foram executados dentro do envelope de cinco minutos previsto pelo critério de domínio. O resultado desta leitura alimenta diretamente o roteador de diagnóstico: o que foi observado e o que falta determinam qual dos três vereditos se aplica ao caso.';

  const idx = I10_PASSOS.findIndex((x) => x.id === sel);
  const P = idx >= 0 ? I10_PASSOS[idx] : null;
  const pn = P
    ? painel('Passo ' + (idx + 1) + ' · ' + P.t + ' segundos' + (feito[P.id] ? ' · executado' : ''), esc(P.n), cartoes([
        ['O que se olha', esc(P.olh)],
        ['Critério de parada', esc(P.par)],
        ['O que torna os demais irrelevantes', P.irr],
        ['O que registrar', esc(P.reg)],
      ]))
    : painel('Sequência', 'Escolha um passo', 'Nove passos, cada um com o que olhar, o critério de parada, o achado que torna os demais irrelevantes e o que registrar. Clicar abre o detalhe; clicar de novo marca como executado.');

  return {
    valores: { 'ol-cnt': n, 'ol-tempo': tempo },
    textos: { 'ol-cnt': fmt(n, 0) + ' de ' + I10_PASSOS.length, 'ol-tempo': mmss, 'ol-est': est },
    veredito: juntar(pn, vd),
  };
};

// ── INST·11 — Roteador de diagnóstico ────────────────────────────────────────
function score(h: string, m: string, p: string): number {
  let s = 0;
  if (h === 'doze') s += 3;
  else if (h === 'seis') s += 1;
  if (m === 'sim') s += 3;
  else if (m === 'parcial') s += 1;
  if (p === 'estavel') s += 2;
  else if (p === 'mudanca') s += 1;
  return s;
}
const i11: CalculateFn = (i) => {
  const h = txt(i['rt-hist'], 'uma');
  const m = txt(i['rt-mm'], 'nao');
  const p = txt(i['rt-plano'], 'nao');
  const a = txt(i['rt-ach'], 'enq') as keyof typeof I11_ACHADO;
  const A = I11_ACHADO[a] ?? I11_ACHADO.enq;
  const s = score(h, m, p);

  const falta: string[] = [];
  if (h === 'uma') falta.push('doze meses de faturas consecutivas, com refaturamentos e ajustes preservados e vinculados ao período de origem');
  else if (h === 'seis') falta.push('os meses restantes para completar um ciclo anual, sem o qual sazonalidade e paradas programadas ficam fora da janela observada');
  if (m === 'nao') falta.push('a memória de massa por intervalo, que é o único registro capaz de mostrar quando e por quanto tempo cada pico ocorreu');
  else if (m === 'parcial') falta.push('a complementação da memória de massa nos períodos ausentes, com verificação de quebra de série por troca de medidor');
  if (p === 'nao') falta.push('o plano de produção com expansões, paradas programadas e mudanças de turno previstas');
  else if (p === 'mudanca') falta.push('o cronograma detalhado da mudança prevista, com potência e simultaneidade das cargas novas');
  falta.push('as tarifas homologadas da concessionária nos períodos analisados, com número e data da resolução de referência');
  if (a === 'fp') falta.push('medição de qualidade de energia, se houver carga não linear relevante na instalação');
  if (a === 'amb') falta.push('o custo entregue consolidado dos dois lados, no mesmo período e na mesma unidade de medida');

  let titulo: string;
  let corpo: string;
  if (a === 'nada' && s >= 6) {
    titulo = 'Não vale investigar nas condições informadas';
    corpo = 'Com histórico e medição disponíveis e nenhum achado observado na leitura, o material sustenta um <b>parecer de adequação</b>. Essa é a saída mais difícil de emitir e a mais valiosa comercialmente: quem só sabe encontrar problema não tem como ser acreditado quando encontra um. Registre a base sobre a qual a adequação foi afirmada e a data — adequação é afirmação sobre um momento, não sobre o futuro.';
  } else if (s >= 6) {
    titulo = 'Vale investigar';
    corpo = 'O material disponível sustenta o avanço para análise completa sobre o achado <b>' + esc(A.n) + '</b>. Há histórico e medição suficientes para distinguir padrão estrutural de evento isolado, que é a condição mínima para qualquer conclusão dimensional. A investigação ainda pode terminar sem achado material, e isso continua sendo entrega.';
  } else if (s <= 1 && a !== 'nada') {
    titulo = 'Não é possível concluir com o que foi informado';
    corpo = 'O achado <b>' + esc(A.n) + '</b> foi observado, mas o material disponível não sustenta conclusão de nenhuma natureza dimensional. ' + esc(A.semDados) + ' Esta é a saída mais frequente de uma varredura honesta, e emiti-la não é falha de análise — é o resultado da análise.';
  } else if (s <= 1 && a === 'nada') {
    titulo = 'Não é possível concluir com o que foi informado';
    corpo = 'Nenhum achado foi observado, mas com uma fatura isolada e sem medição por intervalo <b>a ausência de achado não é prova de adequação</b>. A distinção importa: dizer que nada foi identificado com o material disponível é diferente de dizer que está adequado. A segunda afirmação exige a mesma evidência que um achado positivo exigiria.';
  } else {
    titulo = 'Não é possível concluir — investigação parcial viável';
    corpo = 'O material sustenta caracterizar o achado <b>' + esc(A.n) + '</b> e levantar hipótese, mas não sustenta conclusão dimensional. ' + esc(A.semDados) + ' O caminho correto é entregar o que já é afirmável e a lista do que falta, em vez de esperar todos os dados para dizer qualquer coisa.';
  }

  return {
    valores: {},
    // o título do veredito, para a previsão por escolha (não é readout da fonte: não vai em `outputs`)
    textos: { 'rt-titulo': titulo },
    veredito: juntar(
      '<b>' + titulo + '.</b> ' + corpo,
      cartoes([
        ['O que este achado exige para concluir', esc(A.exige)],
        ['O que já é afirmável com o disponível', esc(A.minimo)],
        ['Lista do que falta', falta.map((f) => '· ' + esc(f)).join('<br>')],
        ['A resposta a "quanto eu economizo"', 'Uma pergunta de volta e uma lista, nunca um número. A pergunta: quantos meses de histórico existem e existe medição por intervalo? A lista é a do campo anterior. Um percentual aproximado dado sem dados vira compromisso na cabeça de quem ouviu — e quando os dados chegam e o número real é outro, o que se perde não é o cliente, é a autoridade.'],
      ]),
    ),
  };
};

/** Opções dos campos, montadas dos dados da fonte (o arquivo de conteúdo as usa). */
export const OPCOES_M10 = {
  linhas: I01_LINHAS.map((l) => ({ value: l.id, label: l.n })),
  encargos: I07_ENC.map((e) => ({ value: e.id, label: e.n })),
  etapas: I08_ET.map((e) => ({ id: e.id, et: e.et, n: e.n })),
  passos: I10_PASSOS.map((p, k) => ({ id: p.id, k: k + 1, n: p.n })),
};

const ptBr = (f: CalculateFn): CalculateFn => (i) => ({ ...f(i), vereditoPtBr: true });

export const CALCULADORAS: Record<string, CalculateFn> = {
  'm10-inst-01': ptBr(i01),
  'm10-inst-02': ptBr(i02),
  'm10-inst-03': ptBr(i03),
  'm10-inst-04': ptBr(i04),
  'm10-inst-05': ptBr(i05),
  'm10-inst-06': ptBr(i06),
  'm10-inst-07': ptBr(i07),
  'm10-inst-08': ptBr(i08),
  'm10-inst-09': ptBr(i09),
  'm10-inst-10': ptBr(i10),
  'm10-inst-11': ptBr(i11),
};
