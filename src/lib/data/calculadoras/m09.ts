// Calculadoras do M09 — os onze instrumentos, porte verbatim do <script> da fonte
// (`Alexandria modulos/alexandria_modulo09.html`, L2400–3304). Posse: a sessão de porte do M09.
//
// COMO FOI FEITO. Os dados (`var FLUXO`, `var COMP`, `var M`…) são o JSON da extração
// verificada, escrito entre os marcadores DADOS-GERADOS por
// tools/alexandria-dados/porte/gerar-dados-calculadoras-m09.mjs — nada digitado. A
// lógica é a do script, linha a linha: as mesmas fórmulas, os mesmos limiares, os
// mesmos ramos e os mesmos textos, só com a E/S do DOM trocada por entradas e saídas.
// O conferidor tools/alexandria-dados/porte/verificar-instrumentos-m09.mjs roda o
// script ORIGINAL no mini-dom e compara saída por saída, em todos os cenários
// enumeráveis.
//
// O QUE O CONTRATO DA AULA PEDE E A FONTE FAZ DIFERENTE (registrado, não escondido):
//   · Cada readout da fonte é uma saída: o número em `valores` (para a previsão) e o
//     texto que a fonte imprime, com o `fmt` dela, em `textos`. O veredito e os cartões
//     (`.ocard`) vão em `veredito`, na ordem da tela da fonte, em HTML curto: cada
//     cartão é "<b>rótulo</b><br>texto". O span de cor da fonte vira texto (a tela só
//     aceita HTML curto). Nenhuma palavra muda. `vereditoPtBr: true` em todos.
//   · Grade de chips e par de seletores exclusivos viram um campo `select`.
//   · INST·04: o campo de texto "mês/ano" vira dois campos numéricos (mês, ano): o
//     contrato não tem campo de texto. A conta é a mesma `addMonths` da fonte.
//
// CORREÇÕES DE SCRIPT (Q07, registradas em docs/alexandria-v3/porte/m09.md):
//   · INST·02 — os quatro contadores eram estáticos no markup (1/3/4/2) e o script nunca
//     os escrevia; os dados dizem 1/4/3/2. Aqui a contagem vem dos dados (D16, QA-M09-A01).
//   · INST·05 — os pesos `cam` somam até 6 e o texto dizia "de cinco": vira "de seis"
//     (nos três ramos e na unidade do readout). O readout "0" do markup é marcador que o
//     script sobrescreve no carregamento; o valor exibido é o calculado (3 no padrão).

import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';

// <DADOS-GERADOS>
// Gerado por tools/alexandria-dados/porte/gerar-dados-calculadoras-m09.mjs. Não editar à mão.
/** INST·01 · `var FLUXO` (L2405–2409). */
const I01_FLUXO = {
  "fisico": "<b>Energia física.</b> Os geradores injetam na rede sob coordenação de despacho do operador. A energia percorre transmissão e distribuição e chega às unidades consumidoras dos dois ambientes pelo mesmo caminho, medida pela mesma distribuidora. Nada neste fluxo distingue um consumidor cativo de um consumidor livre: a topologia é idêntica e a qualidade do fornecimento é a mesma. É por isso que a expressão \"energia do mercado livre\" não descreve nenhum elétron em particular.",
  "contrato": "<b>Contrato.</b> Aqui os dois ambientes se separam. No regulado, o vendedor contrata com a distribuidora por meio de certame, e o consumidor cativo não é parte de contrato de energia algum. No livre, o vendedor contrata diretamente com o consumidor ou com o comercializador que o representa. Em ambos os casos o contrato é registrado na câmara, que não é parte — é registradora. Repare que as setas deste fluxo não coincidem com as do fluxo físico: quem entrega não é quem vende.",
  "dinheiro": "<b>Dinheiro.</b> O consumidor cativo faz um pagamento único à distribuidora, em fatura que reúne energia, rede, encargos e tributos. O consumidor livre faz no mínimo três: energia ao vendedor, uso do sistema à distribuidora, e a liquidação da diferença apurada na câmara — mais encargos, garantias e o custo de representação ou adesão. As setas tracejadas são liquidação de diferença, não pagamento de contrato: a câmara movimenta apenas o desvio entre o que foi contratado e o que foi medido."
} as const;
/** INST·01 · `var NODE` (L2411–2444). */
const I01_NODE = {
  "ger": {
    "n": "Geradores e vendedores",
    "fisico": "Injetam energia na rede conforme o despacho determinado pelo operador, e não conforme os contratos que assinaram. Uma usina pode estar vendida a um consumidor e não gerar naquela hora; outra pode gerar sem ter vendido. A conciliação entre os dois planos é contábil e mensal.",
    "contrato": "Vendem energia em dois canais: contratos regulados firmados com distribuidoras a partir de certames, e contratos bilaterais firmados no ambiente livre com consumidores, comercializadores ou outros geradores. A escolha entre canais depende de preço, prazo, exigência de garantia e necessidade de receita contratada para financiamento.",
    "dinheiro": "Recebem pelo contrato, da contraparte contratual — distribuidora no regulado, comprador no livre. Além disso, liquidam na câmara a diferença entre a energia alocada a eles e a posição vendida, o que para hidrelétricas participantes do mecanismo de realocação depende do fator de ajuste do conjunto."
  },
  "ons": {
    "n": "Operador do sistema",
    "fisico": "Coordena e controla a operação das instalações de geração e transmissão do sistema interligado, determinando o despacho por ordem de mérito e por requisitos de segurança elétrica e energética. É o único agente do mapa que decide o que fisicamente acontece.",
    "contrato": "Não é parte de contrato de compra e venda de energia. Sua atuação define, porém, o volume efetivamente gerado por cada usina, e é essa geração que a contabilização confronta com as posições contratuais.",
    "dinheiro": "Não compra nem vende energia. Suas decisões, no entanto, movem dinheiro no mapa inteiro: despacho fora da ordem de mérito por segurança gera encargo de serviço do sistema, e restrições de intercâmbio produzem diferença de preço entre submercados."
  },
  "ccee": {
    "n": "Câmara de comercialização",
    "fisico": "Não entrega energia e não opera rede. Recebe os dados de medição validados e os utiliza para apurar a energia verificada de cada agente e de cada ponto.",
    "contrato": "Registra e valida os contratos dos dois ambientes, apura posições contratuais por período e por submercado, e aplica as regras de comercialização vigentes. Registro confirma posição para efeito de contabilização — não garante pagamento.",
    "dinheiro": "Liquida financeiramente apenas a <b>diferença</b> entre posição contratada e medição, administra garantias, apura inadimplência e opera os mecanismos de compensação previstos em regra. O pagamento do contrato bilateral permanece entre as partes e nunca passa por ela."
  },
  "rede": {
    "n": "Rede de transmissão e distribuição",
    "fisico": "É o caminho único por onde toda a energia trafega, independentemente do ambiente de contratação. Também é onde as perdas ocorrem e onde as restrições de intercâmbio entre submercados se materializam.",
    "contrato": "O acesso e o uso são regulados por contratos próprios, distintos do contrato de energia: instrumentos de uso e de conexão. Migrar de ambiente não altera esses contratos, salvo por ajustes de montante de uso.",
    "dinheiro": "Remunerada por tarifas de uso reguladas, devidas por consumidores dos dois ambientes. É a parcela do custo que permanece integralmente na esfera regulada mesmo depois da migração."
  },
  "dis": {
    "n": "Distribuidora",
    "fisico": "Entrega e mede a energia de todas as unidades conectadas à sua rede, cativas e livres, e responde pela continuidade e pela qualidade do fornecimento nas duas hipóteses.",
    "contrato": "Para os cativos, compra energia por certame, cotas e mecanismos previstos em lei e monta uma carteira plurianual. Para os livres conectados à sua rede, mantém contrato de uso do sistema, mas não vende energia.",
    "dinheiro": "Recebe tarifa integral do cativo e apenas a tarifa de uso do livre. Paga vendedores, transmissão e encargos, e tem os custos de compra de energia submetidos a regras de reconhecimento tarifário. É o agente que absorve, no primeiro momento, o efeito financeiro de sobra e de falta da carteira."
  },
  "cat": {
    "n": "Consumidor cativo",
    "fisico": "Recebe energia da rede de distribuição local, medida pela distribuidora, exatamente como qualquer outra unidade conectada.",
    "contrato": "Não é parte de contrato de compra de energia. Sua relação é o contrato de fornecimento com a distribuidora, e a escolha de fornecedor não existe para ele.",
    "dinheiro": "Faz um pagamento único, em fatura que reúne energia, uso da rede, encargos e tributos, com adicional de bandeira quando acionada. Todo o risco de portfólio que ele carrega chega diluído e com defasagem, por fórmula regulada."
  },
  "liv": {
    "n": "Consumidor livre",
    "fisico": "Recebe energia pela mesma rede, medida pela mesma distribuidora, com a mesma qualidade e a mesma exposição a interrupção. Nada muda neste fluxo.",
    "contrato": "É parte de um ou mais contratos bilaterais de energia, com volume, perfil, prazo, preço, indexação, submercado de entrega e flexibilidade negociados. Passou a ter, por lei, o dever de garantir cobertura contratual da totalidade da carga, sob penalidade.",
    "dinheiro": "Paga energia ao vendedor, uso do sistema à distribuidora, encargos aplicáveis, tributos, custo de representação ou adesão e garantias — e liquida na câmara a diferença entre o contratado e o medido, ao preço horário do submercado."
  },
  "var": {
    "n": "Comercializador e varejista",
    "fisico": "Não gera, não transporta e não mede energia. Sua existência é integralmente comercial e operacional.",
    "contrato": "Compra e vende energia, estrutura portfólio e, no regime varejista, representa consumidores perante a câmara, assumindo obrigações operacionais de registro, medição, garantias e liquidação. Representar não é o mesmo que ser contraparte da venda — e o contrato precisa dizer qual dos dois papéis está sendo exercido.",
    "dinheiro": "Ganha por margem na venda de energia, por gestão de portfólio, por estruturação e por serviços de representação. Como qualquer agente cuja receita depende do fechamento e da manutenção de contratos, tem incentivo econômico alinhado a que contratos existam — o que é um fato de modelo de negócio e não uma afirmação sobre conduta."
  }
} as const;
/** INST·02 · `var CLS` (L2479–2484). */
const I02_CLS = {
  "f": {
    "t": "Troca de fornecedor",
    "c": "gd2"
  },
  "m": {
    "t": "Muda de mecanismo",
    "c": "gr2"
  },
  "p": {
    "t": "Permanece devido",
    "c": ""
  },
  "n": {
    "t": "Passa a existir",
    "c": "rd2"
  }
} as const;
/** INST·02 · `var COMP` (L2486–2537). */
const I02_COMP = [
  {
    "k": "Energia",
    "cl": "f",
    "acr": "Comprada pela distribuidora por certame, cota e mecanismos previstos em lei, em carteira montada com anos de antecedência, e repassada ao consumidor por tarifa de energia homologada — com defasagem, diluída entre todos os cativos da área de concessão e mediada por regras de reconhecimento de custo.",
    "acl": "Comprada de um vendedor escolhido pelo consumidor, sob preço, prazo, fonte, volume, submercado de entrega e flexibilidade livremente negociados, com o contrato registrado na câmara de comercialização e a diferença entre contratado e medido liquidada mensalmente.",
    "nota": "É o único componente que efetivamente troca de fornecedor. Todo o resto ou muda de mecanismo, ou permanece devido, ou nasce. Reter esse fato é o que impede as três ou quatro conclusões erradas que se seguem naturalmente de uma proposta bem apresentada.",
    "err": "Erro de leitura mais comum: tomar o preço deste único componente e subtraí-lo do valor total da fatura, produzindo uma diferença que não corresponde a nenhuma economia realizável."
  },
  {
    "k": "Uso da distribuição",
    "cl": "p",
    "acr": "Tarifa de uso do sistema de distribuição, calculada por metodologia regulada, homologada em processo tarifário periódico e devida pela unidade consumidora conectada à rede.",
    "acl": "Idêntica em metodologia, em contraparte e em processo tarifário. A migração não altera este componente em nada, salvo por eventual ajuste do montante de uso contratado.",
    "nota": "Permanece integralmente devido. Um consumidor livre não deixa de ser cliente da distribuidora — deixa apenas de comprar energia dela, e continua dependendo dela para conexão, medição, continuidade e qualidade do fornecimento.",
    "err": "Erro de leitura mais comum: supor que a migração reduz o custo de rede, ou que uma proposta de energia pode oferecer desconto sobre ele. Não pode: é tarifa regulada."
  },
  {
    "k": "Uso da transmissão",
    "cl": "p",
    "acr": "Devida conforme o nível de tensão e a configuração de conexão da unidade, com o custo transitando pela cadeia regulada até a tarifa final.",
    "acl": "Devida nos mesmos termos, com contratação de montante de uso quando a unidade for conectada de forma que o exija.",
    "nota": "Aqui entra uma mudança datada e material: a vedação do desconto na tarifa de uso, na parcela consumo, alcança quem exercer a opção pelo ambiente livre a partir da vigência do dispositivo de novembro de 2025, e também as ampliações de montante de uso posteriores.",
    "err": "Erro de leitura mais comum: reaproveitar um estudo de viabilidade feito antes de novembro de 2025 sem refazer a premissa de desconto no fio, o que superestima o resultado de qualquer estrutura baseada em fonte incentivada."
  },
  {
    "k": "Encargos setoriais gerais",
    "cl": "m",
    "acr": "Embutidos na tarifa, com base de cálculo, rateio e periodicidade definidos em norma, sem visibilidade individual para o consumidor.",
    "acl": "Continuam devidos, com base recomposta conforme o ambiente, o nível de tensão e a natureza de cada encargo. Alguns passam a aparecer de forma explícita, o que é diferente de passarem a existir.",
    "nota": "Permanecem nos dois ambientes, e a diferença está na base e na visibilidade. Ignorar essa camada é a segunda causa mais comum de comparação inválida, atrás apenas de ignorar o uso da rede.",
    "err": "Erro de leitura mais comum: interpretar a maior visibilidade dos encargos no ambiente livre como aumento de custo, quando parte deles já estava sendo paga de forma embutida."
  },
  {
    "k": "Conta de desenvolvimento energético",
    "cl": "m",
    "acr": "Quota anual rateada por consumo, com o valor por megawatt-hora redistribuído por nível de tensão desde 1º de janeiro de 2026: quem é atendido em 69 kV ou mais paga metade do valor pago por quem é atendido abaixo de 2,3 kV.",
    "acl": "Mesma lógica e mesma redistribuição: ela vale por nível de tensão e não por ambiente de contratação. Um consumidor industrial de alta tensão foi beneficiado por essa mudança independentemente de ter migrado ou não.",
    "nota": "É uma das raras mudanças recentes que reduz a carga de encargo do consumidor industrial de alta tensão. Some-se a criação do teto de arrecadação a partir do orçamento de 2027 e do encargo de complemento de recursos, cujo desenho depende de regulação ainda não editada.",
    "err": "Erro de leitura mais comum: atribuir a redução dessa quota à migração, quando ela decorre do nível de tensão de atendimento e teria ocorrido de qualquer forma."
  },
  {
    "k": "Encargo de reserva de capacidade",
    "cl": "p",
    "acr": "Rateado entre todos os usuários finais do sistema interligado, com o custo transitando pela cadeia regulada.",
    "acl": "Rateado igualmente, com previsão legal de que o critério venha a considerar também a contribuição do perfil de carga do usuário para a necessidade de contratação — regulamentação pendente na data desta verificação.",
    "nota": "Se a regulamentação sair nesses termos, o perfil horário de uma indústria deixa de ser apenas um problema de estrutura contratual e passa a ser um componente de encargo, o que muda o cálculo de qualquer planta com carga concentrada no pico.",
    "err": "Erro de leitura mais comum: tratar esse encargo como custo do ambiente regulado. Ele alcança consumidores livres e autoprodutores na parcela aplicável, e é indiferente à decisão de migrar."
  },
  {
    "k": "Bandeira tarifária",
    "cl": "m",
    "acr": "Adicional mensal aplicado ao faturamento cativo conforme o patamar acionado, com valores unitários regulados e revisados por ato da agência.",
    "acl": "Não incide sobre a energia contratada. O mesmo risco sistêmico que a bandeira sinaliza chega por outra porta: a liquidação da diferença entre contratado e medido, ao preço horário do submercado.",
    "nota": "Deixar de pagar bandeira não é economia. É troca de mecanismo, de frequência e de volatilidade: sai um adicional mensal uniforme e limitado por patamar, entra um resultado horário que pode ser menor ou várias vezes maior na mesma semana.",
    "err": "Erro de leitura mais comum: apresentar a exclusão da bandeira como ganho líquido da migração, sem contabilizar do outro lado a exposição que a substitui."
  },
  {
    "k": "Tributos",
    "cl": "m",
    "acr": "Incidentes sobre a fatura conforme regime fiscal da empresa, estado e modalidade tarifária, com tratamento de crédito próprio de cada situação.",
    "acl": "Incidentes com base recomposta, com alíquota efetiva e aproveitamento de crédito dependentes da estrutura fiscal, do estado e do desenho da operação.",
    "nota": "Não é matéria deste módulo e exige parecer específico. O que este módulo afirma é apenas isto: ignorar a diferença de base entre os dois ambientes produz uma comparação inválida, e o erro costuma ser material.",
    "err": "Erro de leitura mais comum: comparar valores com e sem tributo entre as duas colunas, o que inverte o resultado de comparações que estavam corretas em todo o resto."
  },
  {
    "k": "Representação, adesão e medição",
    "cl": "n",
    "acr": "Não existe. A relação é única, com a distribuidora, e nenhum custo de intermediação é destacado ao consumidor.",
    "acl": "Custo de representação por comercializador varejista ou de adesão como agente próprio, mais adequação, comunicação e manutenção do sistema de medição para faturamento.",
    "nota": "É custo recorrente e não despesa de projeto. Entra no denominador da comparação desde o primeiro mês e permanece por toda a vigência, o que muda o resultado de qualquer análise feita apenas sobre o primeiro ano.",
    "err": "Erro de leitura mais comum: tratar a adequação de medição como investimento único e esquecer o custo recorrente de representação, que é o que efetivamente pesa no ciclo completo."
  },
  {
    "k": "Garantias e gestão",
    "cl": "n",
    "acr": "Não existe para o consumidor. O risco de portfólio é da distribuidora, e o efeito dele chega diluído pela tarifa.",
    "acl": "Garantias financeiras exigidas pela câmara e por contratos bilaterais, com chamadas de recomposição em cenário adverso, mais o custo interno de acompanhar posição, liquidação, garantias, renovação e reconciliação todo mês.",
    "nota": "A ausência de responsável designado por essa gestão é a falha que mais frequentemente destrói o caso de negócio depois de ele já ter sido aprovado. O custo não aparece na proposta e aparece no primeiro trimestre.",
    "err": "Erro de leitura mais comum: aprovar a migração sem definir quem, dentro da empresa, olhará a posição todo mês — e descobrir a resposta quando a primeira divergência de liquidação já tem três meses."
  }
] as const;
/** INST·02 · `var txt` (L2555–2560). */
const I02_txt = {
  "f": "Um único componente de dez troca efetivamente de fornecedor. É por isso que comparar o preço do contrato livre com o total da fatura cativa produz uma diferença que não descreve nada — e é por isso que a primeira entrega de qualquer análise séria é a reconstrução do denominador.",
  "m": "Componente que muda de mecanismo, não de existência. A contraparte pode ser a mesma e a base de cálculo diferente, e a diferença aparece na fatura e não na proposta. Comparar dois ambientes sem normalizar as bases é comparar duas contabilidades distintas.",
  "p": "Componente devido de qualquer forma. Nenhuma decisão de contratação de energia altera este item, e incluí-lo como economia é erro de escopo — o mais comum e o mais fácil de detectar quando a análise abre a conta linha a linha.",
  "n": "Custo que não existia e passa a existir, de forma recorrente e não pontual. Precisa entrar na comparação desde o primeiro mês e permanecer em todo o horizonte, sob pena de superestimar sistematicamente o resultado da migração."
} as const;
/** INST·03 · `var LEI` (L2573–2610). */
const I03_LEI = {
  "nova": {
    "n": "Energia nova",
    "obj": "Contratar energia de empreendimentos ainda não construídos ou de ampliação habilitada, criando receita contratada de longo prazo capaz de sustentar o financiamento da obra.",
    "risco": "Resolve o problema de financiamento da expansão. Sem contrato de longa duração, o custo de capital de um ativo novo inviabiliza o projeto ou o encarece de tal forma que o preço final ao consumidor seria maior.",
    "prazo": "Entrega iniciada, pela moldura legal vigente, a partir do terceiro e até o sétimo ano subsequente ao da licitação, com prazo de suprimento de até trinta e cinco anos.",
    "cuidado": "O lance mais baixo não encerra a análise: risco de atraso na entrada em operação, indexação, custo de conexão e custo de reposição em caso de inadimplemento podem inverter completamente o resultado no ciclo completo.",
    "ler": "No edital, leia antes de tudo: as garantias de fiel cumprimento exigidas, o regime de penalidade por atraso, o índice de reajuste do preço e o tratamento do risco de conexão. São esses quatro campos, e não o preço-teto, que determinam a probabilidade de a energia efetivamente chegar."
  },
  "exist": {
    "n": "Energia existente",
    "obj": "Recontratar energia de usinas já em operação, para recompor a carteira das distribuidoras à medida que contratos antigos vencem e o mercado se altera.",
    "risco": "Resolve a recomposição de portfólio e cria competição entre ativos já amortizados, cujos custos afundados e necessidades de receita são estruturalmente diferentes dos de um projeto novo.",
    "prazo": "Antecedência menor que a de energia nova, dimensionada pelo calendário de vencimento dos contratos que precisam ser substituídos e pela previsão de mercado da distribuidora.",
    "cuidado": "Misturar ativos novos e existentes num mesmo certame produz competição assimétrica. Por isso os produtos costumam ser separados, com prazos, garantias e critérios de habilitação próprios.",
    "ler": "No edital, leia: o prazo de suprimento oferecido, a origem dos lastros habilitados, o tratamento de usinas em regime de cotas e a existência de limite por vendedor. Um certame de existente com concentração alta de oferta produz resultado de preço que não se repete no ciclo seguinte."
  },
  "ajuste": {
    "n": "Leilão de ajuste",
    "obj": "Corrigir necessidades identificadas próximo ao início do suprimento, com volume limitado por regra e destinação específica.",
    "risco": "Resolve o erro residual de previsão — a parcela que sobra depois que os instrumentos de médio e longo prazo já foram utilizados, e que não justifica um certame estrutural.",
    "prazo": "Curto prazo, com volume restrito e janela de contratação próxima ao período de suprimento.",
    "cuidado": "É instrumento de ajuste fino. Depender dele para volumes relevantes significa que a previsão de mercado falhou antes, e o custo tende a ser superior ao do produto que deveria ter sido usado no momento certo.",
    "ler": "No edital, leia: o limite percentual de contratação por distribuidora, a janela de suprimento e a regra de repasse do custo. Volume de ajuste próximo ao teto regulatório é indicador de estresse na carteira daquela distribuidora, e isso é informação de mercado."
  },
  "fontes": {
    "n": "Fontes alternativas",
    "obj": "Contratar conjunto específico de fontes, conforme definição de política setorial e do edital de cada certame.",
    "risco": "Resolve objetivos de diversificação de matriz, aprendizado tecnológico e política industrial — objetivos legítimos que a competição pura por preço, isoladamente, não alcança.",
    "prazo": "Definido pela política setorial e pelo edital específico, com variação relevante entre certames de anos diferentes.",
    "cuidado": "Como todo produto com objetivo de política, exige avaliação explícita de custo, beneficiário e adicionalidade. Sem essa avaliação declarada, o subsídio existe mas não é auditável — e o que não é auditável não é discutível.",
    "ler": "No edital, leia: quais fontes foram habilitadas e com que critério, se há reserva de volume por tecnologia e qual o tratamento de benefícios regulatórios associados. A comparação de preço entre tecnologias só faz sentido depois de normalizados os benefícios de cada uma."
  },
  "reserva": {
    "n": "Energia de reserva",
    "obj": "Adicionar energia ao sistema para elevar a margem de segurança, fora do atendimento contratual ordinário das distribuidoras.",
    "risco": "Resolve segurança energética sistêmica: cria lastro adicional que não pertence à carteira de nenhuma distribuidora específica e que existe para o sistema como um todo.",
    "prazo": "Produto específico, com custeio por encargo próprio rateado entre os usuários finais do sistema interligado.",
    "cuidado": "O custo é socializado. Isso significa que ele aparece na conta de consumidores dos dois ambientes independentemente de quem se beneficiou diretamente da margem adicional contratada — e é por isso que a avaliação de necessidade precisa ser pública e fundamentada.",
    "ler": "No edital e na portaria de diretrizes, leia: a justificativa técnica do montante contratado, o horizonte de suprimento e a forma de rateio do encargo. Contratação de reserva sem necessidade demonstrada é custo permanente com benefício incerto."
  },
  "cap": {
    "n": "Reserva de capacidade",
    "obj": "Contratar potência, disponibilidade ou flexibilidade para os momentos críticos do sistema, remunerando prontidão e não apenas energia efetivamente gerada.",
    "risco": "Resolve adequação de potência. Uma matriz com muita energia barata em determinadas horas pode ter dificuldade de atender à demanda no pico, e energia e potência são atributos econômicos distintos que precisam ser valorados separadamente sem que se pague duas vezes pelo mesmo serviço.",
    "prazo": "Definido no certame, com custos rateados entre todos os usuários finais do sistema interligado, incluídos consumidores livres e autoprodutores na parcela aplicável.",
    "cuidado": "A lei prevê que o critério de rateio possa considerar a contribuição do perfil de carga do usuário à necessidade de contratação — regulamentação pendente e potencialmente muito relevante para indústria com consumo concentrado no horário de maior demanda do sistema.",
    "ler": "No edital, leia: o produto efetivamente contratado — potência, flexibilidade ou armazenamento —, o regime de verificação de disponibilidade e a penalidade por indisponibilidade. Remunerar prontidão sem fiscalizar prontidão é a falha clássica desta família de produto."
  }
} as const;
/** INST·03 · `var MOD` (L2612–2615). */
const I03_MOD = {
  "qtd": "<b>Por quantidade.</b> O vendedor compromete um montante de energia e assume, em maior medida, o risco de produzir ou adquirir energia suficiente para honrar a posição. Se a usina gera menos que o comprometido, é ele quem compra a diferença. O comprador ganha previsibilidade e paga por ela um prêmio embutido no preço, que é a remuneração desse risco. <b>Campo que troca de dono em relação à outra modalidade: o risco de produção.</b>",
  "disp": "<b>Por disponibilidade.</b> O vendedor recebe receita fixa por manter o ativo disponível, e os custos variáveis associados ao despacho são tratados conforme o contrato e as regras do ambiente regulado. O risco de produção fica compartilhado: o consumidor regulado arca com o custo variável reconhecido quando a usina opera, e continua pagando a receita fixa quando ela não opera. Isso pode ser economicamente correto — uma usina de segurança presta serviço ao estar pronta, e remunerá-la apenas por energia gerada a expulsaria do sistema. <b>Campo que troca de dono: o risco de combustível e de despacho, que passa para a tarifa.</b>"
} as const;
/** INST·04 · `var REQ` (L2648–2654). */
const I04_REQ = [
  {
    "k": "Plano de comunicação",
    "d": "Desenvolvimento e execução de plano de conscientização dos consumidores quanto à opção de migração."
  },
  {
    "k": "Tarifas por ambiente",
    "d": "Definição das tarifas aplicáveis aos consumidores de cada ambiente, considerando a segregação de custos da distribuidora para atender cada um deles."
  },
  {
    "k": "Suprimento de última instância",
    "d": "Regulamentação da atividade, incluindo responsável, beneficiários, hipóteses obrigatórias, prazo máximo, eventual uso de energia de reserva, eventual dispensa de lastro e alocação de custos."
  },
  {
    "k": "Produto padrão",
    "d": "Elaboração do produto padrão e do respectivo preço de referência, para permitir comparação entre ofertas na baixa tensão."
  },
  {
    "k": "Encargo de sobrecontratação",
    "d": "Regulamentação do encargo de sobrecontratação ou exposição involuntária das distribuidoras decorrente das opções de migração."
  }
] as const;
/** INST·05 · `var HZ` (L2732–2736). */
const I05_HZ = {
  "curto": {
    "n": "até 12 meses",
    "r": "Horizonte curto reduz o risco de o preço ficar fora de mercado e reduz a multa potencial de saída, mas concentra o risco de renovação: em doze meses a empresa reabre a posição inteira ao preço daquele momento.",
    "cam": 0
  },
  "medio": {
    "n": "13 a 36 meses",
    "r": "Horizonte médio equilibra previsibilidade orçamentária e flexibilidade de recontratação, e é o intervalo em que o escalonamento de vencimentos começa a fazer diferença mensurável.",
    "cam": 0
  },
  "longo": {
    "n": "acima de 36 meses",
    "r": "Horizonte longo trava preço e reduz risco de renovação, mas amplia a exposição a mudança regulatória e eleva a multa potencial de saída. Num setor com calendário de reforma aberto até 2028, a cláusula de mudança em lei deixa de ser acessória.",
    "cam": 1
  }
} as const;
/** INST·05 · `var VOL` (L2737–2742). */
const I05_VOL = {
  "flat": {
    "n": "plano",
    "exp": "sazonal e horária",
    "cam": 2,
    "r": "Entrega uniforme. Cobre bem carga estável de alto fator de carga e deixa descoberta toda a variação sazonal e horária."
  },
  "sazo": {
    "n": "sazonalizado",
    "exp": "horária",
    "cam": 1,
    "r": "A alocação mensal aproxima a entrega da forma anual do consumo. Resta a variação dentro do mês e a variação horária."
  },
  "mod": {
    "n": "modulado",
    "exp": "desvio não previsto",
    "cam": 0,
    "r": "A alocação por hora ou patamar cobre o descasamento horário previsível. Resta o desvio em relação à curva declarada — e o risco de a curva declarada estar errada."
  },
  "lf": {
    "n": "acompanha a carga",
    "exp": "excedente aos limites",
    "cam": 0,
    "r": "O fornecedor segue a carga dentro dos limites contratados, o que transfere risco de volume e de perfil a ele. Fora dos limites, o risco retorna integralmente ao comprador, e o retorno é abrupto."
  }
} as const;
/** INST·05 · `var FLEX` (L2743–2747). */
const I05_FLEX = {
  "rig": {
    "n": "rígido",
    "cam": 1,
    "r": "Sem banda, todo desvio de volume vira posição liquidada ao preço do momento. É a estrutura mais barata de contratar e a que mais frequentemente surpreende no primeiro trimestre."
  },
  "estr": {
    "n": "banda estreita",
    "cam": 0,
    "r": "Cobre a variação operacional ordinária. Antes de considerá-la suficiente, verifique se a banda é mensal, anual ou acumulada — a diferença muda completamente a cobertura efetiva."
  },
  "ampl": {
    "n": "banda ampla com mínimo",
    "cam": 0,
    "r": "Cobre variação relevante de produção, ao custo de um montante mínimo devido mesmo sem consumo. A pergunta decisiva não é a largura da banda: é a simetria entre o preço do excedente e a remuneração da sobra."
  }
} as const;
/** INST·05 · `var IDX` (L2748–2753). */
const I05_IDX = {
  "fixo": {
    "n": "nominal fixo",
    "cam": 0,
    "r": "Previsibilidade orçamentária simples e auditável, com prêmio embutido pelo vendedor e risco de o contrato ficar fora de mercado num prazo longo."
  },
  "ipca": {
    "n": "índice de preços",
    "cam": 0,
    "r": "Índice amplo e de baixa contestação. Atenção à composição ao longo do prazo, à defasagem de aplicação e à existência de piso de reajuste."
  },
  "cambio": {
    "n": "câmbio",
    "cam": 1,
    "r": "Alinha o contrato à estrutura de custo do vendedor e desloca risco cambial integral ao comprador cuja receita seja em moeda local. Só é defensável se houver hedge natural do lado da receita."
  },
  "pld": {
    "n": "indexado ao curto prazo com teto",
    "cam": 1,
    "r": "Participa de preços baixos e limita a perda em preços altos. A proteção vale o que valer o crédito de quem a vendeu — e ela é acionada exatamente no cenário em que a contraparte está mais pressionada."
  }
} as const;
/** INST·05 · `var SUB` (L2754–2757). */
const I05_SUB = {
  "mesmo": {
    "n": "mesmo submercado",
    "cam": 0,
    "r": "Elimina uma classe inteira de risco pelo custo de uma decisão de estruturação. É a mitigação mais barata disponível neste instrumento."
  },
  "dif": {
    "n": "submercado diferente",
    "cam": 1,
    "r": "Cria exposição à diferença de preço entre a área de entrega contábil e a de consumo, independente de o volume estar coberto. Qualquer desconto oferecido nessa configuração deve ser lido como remuneração desse risco."
  }
} as const;
/** INST·06 · `var RISCOS` (L2802–2805). */
const I06_RISCOS = [
  {
    "k": "preco",
    "n": "Preço"
  },
  {
    "k": "volume",
    "n": "Volume"
  },
  {
    "k": "perfil",
    "n": "Perfil"
  },
  {
    "k": "sub",
    "n": "Submercado"
  },
  {
    "k": "cred",
    "n": "Contraparte"
  },
  {
    "k": "saida",
    "n": "Saída"
  },
  {
    "k": "reg",
    "n": "Regulatório"
  }
] as const;
/** INST·06 · `var CONTRATOS` (L2806–2806). */
const I06_CONTRATOS = {
  "flat": "Plano",
  "sazo": "Sazonalizado",
  "mod": "Modulado",
  "lf": "Acompanha carga",
  "banda": "Banda com mínimo",
  "idx": "Indexado com teto"
} as const;
/** INST·06 · `var M` (L2808–2989). */
const I06_M = {
  "flat": {
    "preco": [
      "O vendedor carrega o preço do montante contratado quando o preço é fixo. O comprador carrega o preço de tudo o que exceder ou faltar em relação a esse montante, hora a hora.",
      "Dispara sempre que a medição de um intervalo difere da entrega uniforme alocada àquele intervalo — o que, numa carga com qualquer sazonalidade, acontece na maioria dos meses do ano.",
      "Mitiga-se dimensionando o montante pela curva real e não pela média anual, e escalonando vencimentos para que a renovação não recaia inteira sobre um único momento de mercado.",
      "Sobra descoberto o preço de toda a parcela desviante, que numa estrutura plana é estruturalmente recorrente. Nenhum ajuste de montante elimina esse resíduo: ele só muda de sinal conforme o mês."
    ],
    "volume": [
      "O comprador carrega integralmente. A entrega é a mesma em todos os períodos, independentemente do que a planta fizer com a produção.",
      "Dispara com qualquer variação de produção — parada não programada, turno cancelado, expansão adiada, queda de demanda do produto final. Do ponto de vista do contrato, todas produzem o mesmo efeito.",
      "Mitiga-se contratando banda de flexibilidade à parte, ou assumindo a exposição como decisão declarada, com limite conhecido e monitoramento mensal do desvio acumulado.",
      "Sobra descoberto tudo o que estiver fora da banda contratada, e sobra descoberta a assimetria de tratamento: numa estrutura sem banda, a sobra e a falta são liquidadas a preços que o comprador não escolhe nem prevê."
    ],
    "perfil": [
      "O comprador carrega integralmente, nas duas dimensões: a mensal e a horária.",
      "Dispara pela sazonalidade da planta e pela assinatura horária de turno, parada de fim de semana e manutenção programada — eventos previsíveis e recorrentes, não excepcionais.",
      "Mitiga-se sazonalizando e modulando a entrega, o que muda a estrutura contratada e o preço, ou deslocando produção quando o processo admite, que é hedge sem prêmio.",
      "Sobra descoberto o desvio não previsto em relação a qualquer curva declarada, e sobra descoberto o custo de oportunidade de uma planta que não pode deslocar carga e por isso precisa comprar toda a proteção."
    ],
    "sub": [
      "O comprador carrega, se o ponto de entrega contábil do contrato for diferente do submercado onde o consumo é medido.",
      "Dispara quando a restrição de intercâmbio separa os preços das duas áreas, o que independe totalmente de o volume estar corretamente dimensionado.",
      "Mitiga-se contratando no submercado de consumo — a mitigação mais barata disponível em todo este instrumento, porque custa apenas uma decisão de estruturação.",
      "Sobra descoberto o risco de a própria configuração de intercâmbio mudar ao longo de um contrato longo, com obras de transmissão alterando a frequência com que os submercados se separam."
    ],
    "cred": [
      "O comprador carrega, e carrega de forma correlacionada com o risco de preço.",
      "Dispara no inadimplemento ou na inexecução do vendedor, tipicamente em cenário de preço alto — que é exatamente quando o contrato valeria mais para o comprador.",
      "Mitiga-se com garantia adequada, limite de exposição por contraparte, análise do grupo econômico e do garantidor, e cláusula de substituição com prazo de cura definido.",
      "Sobra descoberto o risco residual de execução da própria garantia, e sobra descoberta a parcela mutualizada: o déficit involuntário do supridor de última instância é rateado entre todos os consumidores do ambiente livre."
    ],
    "saida": [
      "O comprador carrega, e a assimetria entre entrar e sair é o que torna esse risco maior do que parece na assinatura.",
      "Dispara por encerramento da operação, mudança de escala, venda da unidade ou qualquer evento que torne o contrato maior que a necessidade.",
      "Mitiga-se simulando a multa em cenário de queda e de alta de preço antes de assinar, e negociando fórmula de cálculo, prazo de cura, cessão e portabilidade.",
      "Sobra descoberta a possibilidade de a saída ser juridicamente possível e economicamente inviável — reversibilidade que só existe no cenário bom não é reversibilidade."
    ],
    "reg": [
      "Depende inteiramente da redação da cláusula de mudança em lei. Onde a cláusula é vaga, o risco fica com quem tiver menos poder de barganha na renegociação.",
      "Dispara com alteração de encargo, perda de benefício, mudança de regra de rateio ou nova interpretação administrativa durante a vigência.",
      "Mitiga-se com cláusula que distinga mudança geral de lei, mudança específica da fonte e alteração de interpretação, com fórmula de recomposição, prazo e direito de saída.",
      "Sobra descoberto o risco de a mudança alterar a premissa econômica inteira da decisão. Contra isso não há cláusula: há horizonte mais curto e reavaliação a cada ciclo regulatório."
    ]
  },
  "sazo": {
    "preco": [
      "O vendedor carrega o preço do montante mensal alocado pela curva acordada; o comprador carrega o preço do desvio em relação a essa alocação.",
      "Dispara quando o consumo mensal efetivo diverge da curva sazonal declarada, o que ocorre sempre que a previsão anual que originou a curva se mostra imprecisa.",
      "Mitiga-se construindo a curva com histórico de ao menos dois ciclos completos e negociando janela de revisão da sazonalização declarada.",
      "Sobra descoberto o erro de previsão anual embutido na própria curva, que só se revela ao longo da execução e cujo custo é assumido pelo comprador em cada mês desviante."
    ],
    "volume": [
      "O comprador carrega, mas com o componente sazonal do descasamento substancialmente reduzido pela alocação mensal.",
      "Dispara pelo erro na previsão anual que originou a curva, e por mudanças de regime de produção não antecipadas quando a curva foi declarada.",
      "Mitiga-se sobrepondo banda de flexibilidade à sazonalização, e revisando a curva nas janelas contratualmente previstas.",
      "Sobra descoberta a variação dentro de cada mês, que a sazonalização não enxerga, e o custo de reperfilamento fora das janelas quando o contrato o penaliza."
    ],
    "perfil": [
      "O comprador carrega na dimensão horária. A dimensão mensal está coberta pela alocação declarada.",
      "Dispara pela variação intramensal e pela assinatura horária da carga, que a alocação por mês não distingue.",
      "Mitiga-se modulando a entrega, o que acrescenta uma camada de estrutura e de preço, ou aceitando a camada horária como exposição declarada e monitorada.",
      "Sobra descoberto o descasamento horário integral: sazonalizar sem modular resolve metade do problema de perfil e deixa a outra metade intacta."
    ],
    "sub": [
      "O comprador carrega, se a entrega contábil ocorrer em submercado diferente do consumo.",
      "Dispara com a restrição de intercâmbio entre a área de entrega e a de consumo, com efeito que pode variar mês a mês conforme a hidrologia regional.",
      "Mitiga-se contratando no submercado de consumo, ou contratando a diferença separadamente quando houver contraparte disposta a vendê-la.",
      "Sobra descoberta a variação da própria diferença entre submercados ao longo do ano, que tende a ser maior justamente nos meses de alocação sazonal mais alta."
    ],
    "cred": [
      "O comprador carrega, com exposição concentrada nos meses de maior alocação da curva.",
      "Dispara na falha do vendedor, cujo impacto é desproporcional se ocorrer no período de pico da curva declarada.",
      "Mitiga-se dimensionando a garantia pelo pico da curva e não pela média, e diversificando contrapartes entre períodos do ano.",
      "Sobra descoberto o risco de substituição em período de pico: recontratar volume alto no meio do ano, sob pressão, é a pior configuração possível de negociação."
    ],
    "saida": [
      "O comprador carrega, com o agravante de haver volume já alocado a períodos futuros.",
      "Dispara no término antecipado quando a curva já declarou montantes para meses posteriores à data de saída.",
      "Mitiga-se prevendo em contrato o tratamento do volume alocado a períodos posteriores ao término, e o método de cálculo da multa sobre esse volume.",
      "Sobra descoberto o desencontro entre o calendário da decisão empresarial e o calendário da curva declarada, que raramente coincidem."
    ],
    "reg": [
      "Depende da cláusula, com atenção específica às regras de sazonalização e de contabilização.",
      "Dispara com mudança nas regras de alocação sazonal, no tratamento de perdas ou na apuração por período.",
      "Mitiga-se com cláusula específica sobre alteração de regras de alocação, além da cláusula geral de mudança em lei.",
      "Sobra descoberto o efeito de mudança que torne a curva declarada subótima sem torná-la inválida — hipótese em que não há gatilho contratual e o custo simplesmente permanece."
    ]
  },
  "mod": {
    "preco": [
      "O vendedor carrega o preço do montante alocado a cada intervalo; o comprador carrega o preço do desvio intervalo a intervalo.",
      "Dispara quando a medição de cada hora ou patamar diverge da curva horária declarada no contrato.",
      "Mitiga-se pela qualidade do histórico horário usado para construir a curva — aqui o insumo da mitigação é o próprio dado, e não uma cláusula.",
      "Sobra descoberto o prêmio pago pela modulação quando a carga se comporta de forma mais previsível do que se supunha: cobrir risco que não se materializa também destrói valor."
    ],
    "volume": [
      "Compartilhado. O vendedor entrega num formato mais caro de originar e cobra por isso; o comprador carrega o desvio em relação ao declarado.",
      "Dispara com alteração de regime de produção que desloque a curva horária efetiva em relação à declarada.",
      "Mitiga-se com janela de reprogramação prevista em contrato e com comunicação antecipada de mudanças de regime operacional.",
      "Sobra descoberto o custo de reprogramar fora da janela, e sobra descoberta a rigidez de um contrato modulado diante de mudança estrutural de processo industrial."
    ],
    "perfil": [
      "Coberto em boa parte, dentro dos limites da curva declarada. É a estrutura que melhor trata esta classe de risco.",
      "Dispara pelo desvio em relação à curva e, sobretudo, pelo caso em que a curva declarada foi construída sobre histórico ruim.",
      "Mitiga-se com medição confiável, revisão periódica da modulação e validação da curva contra pelo menos doze meses de dados horários.",
      "Sobra descoberto o erro sistemático de uma curva mal construída, que se repete todos os meses e é difícil de detectar sem reconciliação disciplinada."
    ],
    "sub": [
      "O comprador carrega, se a entrega contábil diferir do submercado de consumo.",
      "Dispara com restrição de intercâmbio, com efeito hora a hora que pode variar dentro de um mesmo dia.",
      "Mitiga-se contratando no submercado de consumo, o que é ainda mais relevante numa estrutura horária do que numa mensal.",
      "Sobra descoberta a interação entre modulação e diferença de submercado: a exposição se concentra justamente nas horas de maior alocação, que costumam ser as de maior separação de preço."
    ],
    "cred": [
      "O comprador carrega, com impacto concentrado nas horas de maior alocação da curva.",
      "Dispara na falha do vendedor, cujo efeito é desigual ao longo do dia por causa da própria modulação.",
      "Mitiga-se com garantia, limite por contraparte e, quando o volume justifica, diversificação por bloco horário entre vendedores distintos.",
      "Sobra descoberta a dificuldade de substituir rapidamente um fornecedor de energia modulada: o mercado de reposição para curva específica é menos líquido que o de volume plano."
    ],
    "saida": [
      "O comprador carrega, com o prêmio de modulação já embutido no preço pago ao longo da vigência.",
      "Dispara no término antecipado de um contrato cujo custo de estruturação foi diluído no preço de todo o prazo.",
      "Mitiga-se com cláusula que trate expressamente o prêmio já pago em hipótese de término antecipado.",
      "Sobra descoberto o valor econômico da curva construída — um ativo informacional que a empresa financiou e que não é recuperável na saída."
    ],
    "reg": [
      "Depende da cláusula, com atenção às regras de contabilização por intervalo.",
      "Dispara com mudança nas regras de apuração por intervalo, no tratamento de perdas ou na granularidade da contabilização.",
      "Mitiga-se com cláusula de mudança em lei que inclua expressamente alteração de regra de contabilização entre os gatilhos.",
      "Sobra descoberto o risco de a granularidade regulatória mudar de forma que torne a curva contratada incompatível com a apuração, sem que isso configure inadimplemento de ninguém."
    ]
  },
  "lf": {
    "preco": [
      "O vendedor carrega, dentro dos limites contratados. Fora deles, o comprador.",
      "Dispara quando o consumo ultrapassa os limites de acompanhamento estabelecidos no contrato.",
      "Mitiga-se dimensionando os limites pela variabilidade histórica real, com folga explícita para o cenário de crescimento.",
      "Sobra descoberto o prêmio pago pela flexibilidade quando ela não é utilizada, e sobra descoberta a ultrapassagem, que devolve o risco de forma abrupta e não gradual."
    ],
    "volume": [
      "O vendedor carrega dentro da regra; o comprador carrega integralmente fora dela.",
      "Dispara na ultrapassagem dos limites, e o efeito não é proporcional: passa de coberto a descoberto num degrau.",
      "Mitiga-se monitorando a fração dos limites já consumida ao longo do ano, com alerta antes de o degrau ser atingido.",
      "Sobra descoberta a possibilidade de a empresa consumir os limites cedo no ano e passar os últimos meses inteiramente exposta, com o pior de dois mundos: prêmio pago e proteção esgotada."
    ],
    "perfil": [
      "O vendedor carrega, dentro dos limites. É a estrutura que mais transfere esta classe de risco.",
      "Dispara com mudança estrutural de regime operacional não comunicada, que descaracteriza a premissa da precificação.",
      "Mitiga-se com cláusula de comunicação de programação e com revisão periódica dos limites diante de mudança de processo.",
      "Sobra descoberto o custo dessa transferência, que é o mais alto entre as seis estruturas — e sobra a dependência de um fornecedor com capacidade real de originar energia flexível."
    ],
    "sub": [
      "O comprador carrega, se a entrega contábil diferir do submercado de consumo.",
      "Dispara com restrição de intercâmbio entre a área de entrega e a de consumo.",
      "Mitiga-se contratando no submercado de consumo, independentemente da flexibilidade contratada.",
      "Sobra descoberto o fato de que nenhuma estrutura de acompanhamento de carga cobre risco de localização contábil: são dimensões independentes e frequentemente confundidas na leitura de proposta."
    ],
    "cred": [
      "O comprador carrega, e de forma agravada, porque o vendedor assumiu mais risco e portanto está mais exposto.",
      "Dispara na falha de uma contraparte que se comprometeu com volume e perfil, e cujo próprio risco é maior que o de um vendedor de bloco plano.",
      "Mitiga-se exigindo garantia proporcional ao risco assumido pelo vendedor e não ao volume nominal, e examinando a capacidade dele de originar energia flexível.",
      "Sobra descoberta a correlação entre o cenário que aciona a flexibilidade e o cenário que estressa a contraparte — os dois tendem a ser o mesmo."
    ],
    "saida": [
      "O comprador carrega, com prêmio de flexibilidade já pago antecipadamente no preço de todo o prazo.",
      "Dispara no término antecipado, quando o comprador já financiou uma proteção que não usará.",
      "Mitiga-se simulando o término considerando o prêmio embutido, e não apenas o volume remanescente, no cálculo de multa.",
      "Sobra descoberto o valor da proteção já contratada e não consumida, que raramente é restituído em qualquer fórmula de rescisão."
    ],
    "reg": [
      "Depende da cláusula, com atenção ao custo de originar energia flexível para o vendedor.",
      "Dispara com mudança que altere o custo ou a viabilidade de o vendedor manter portfólio flexível.",
      "Mitiga-se com cláusula que distinga mudança geral de lei de mudança específica da fonte ou do produto contratado.",
      "Sobra descoberto o risco de o vendedor invocar reequilíbrio por evento regulatório que o afete indiretamente, transformando a flexibilidade contratada em negociação recorrente."
    ]
  },
  "banda": {
    "preco": [
      "O vendedor carrega o preço do montante firme; o comprador carrega o da parcela variável e do excedente à banda.",
      "Dispara quando o consumo sai da banda em qualquer das duas direções, com preços de ajuste frequentemente distintos para cima e para baixo.",
      "Mitiga-se verificando a simetria antes de assinar: preço do excedente contra remuneração da sobra devolvida, e regra de acumulação da banda.",
      "Sobra descoberta a assimetria residual, que é a margem real do vendedor nesta estrutura e raramente aparece na página de preço da proposta."
    ],
    "volume": [
      "Dividido pela banda. Abaixo do montante mínimo, integralmente do comprador, que paga sem consumir.",
      "Dispara na queda de produção que leve o consumo abaixo do mínimo contratado, cenário em que a empresa já está com receita menor.",
      "Mitiga-se dimensionando o mínimo pelo cenário pessimista de produção e não pelo caso central, e simulando o efeito de uma queda relevante de demanda.",
      "Sobra descoberta a coincidência entre o cenário que aciona o montante mínimo e o cenário em que a empresa menos pode pagá-lo — é a correlação mais perversa desta estrutura."
    ],
    "perfil": [
      "O comprador carrega, salvo se a banda for combinada com sazonalização ou modulação.",
      "Dispara pelo descasamento horário e mensal dentro da própria banda de volume, que trata quantidade e não forma.",
      "Mitiga-se combinando a banda com forma de entrega adequada: banda resolve volume, não resolve perfil, e confundir as duas coisas é erro comum.",
      "Sobra descoberto todo o descasamento de forma, que pode consumir a banda inteira sem que o volume total tenha variado um único megawatt-hora."
    ],
    "sub": [
      "O comprador carrega, se a entrega contábil diferir do submercado de consumo.",
      "Dispara com restrição de intercâmbio entre as áreas de entrega e de consumo.",
      "Mitiga-se contratando no submercado de consumo, decisão independente da estrutura de flexibilidade.",
      "Sobra descoberta a interação com o montante mínimo: pagar mínimo por energia entregue em submercado desfavorável combina duas exposições sem nenhuma compensação entre elas."
    ],
    "cred": [
      "O comprador carrega, com o agravante de que o montante mínimo permanece como obrigação sua.",
      "Dispara na falha do vendedor, situação em que a obrigação de mínimo pode subsistir enquanto a entrega não ocorre.",
      "Mitiga-se com garantia que cubra também o valor presente do montante mínimo remanescente, e não apenas a energia do período corrente.",
      "Sobra descoberta a assimetria entre a obrigação de pagar o mínimo e a expectativa de recebê-lo de volta em caso de inexecução — que depende de execução de garantia, não de cláusula."
    ],
    "saida": [
      "O comprador carrega, de forma agravada pelo mínimo pactuado para todo o prazo remanescente.",
      "Dispara no término antecipado, quando a multa se soma ao montante mínimo devido pelo período restante.",
      "Mitiga-se negociando fórmula de multa que abata o mínimo já pago e simulando o término em cenário de queda e de alta antes da assinatura.",
      "Sobra descoberta a possibilidade de a soma de multa e mínimo remanescente tornar a saída economicamente inviável, ainda que juridicamente prevista."
    ],
    "reg": [
      "Depende da cláusula, com atenção específica à economia do montante mínimo.",
      "Dispara com mudança que altere o custo do excedente, o tratamento fiscal do mínimo ou a economia da flexibilidade.",
      "Mitiga-se com cláusula de reequilíbrio que tenha fórmula e prazo, e não apenas a expressão boa-fé.",
      "Sobra descoberto o efeito de uma mudança que torne o mínimo desproporcional sem configurar nenhum gatilho previsto — hipótese em que só resta renegociar de posição fraca."
    ]
  },
  "idx": {
    "preco": [
      "O comprador carrega, limitado pelo teto e pelo piso contratados. Fora do intervalo, quem carrega é quem vendeu a proteção.",
      "Dispara quando o preço de referência rompe o teto, acionando a proteção contratada.",
      "Mitiga-se verificando o crédito de quem vendeu a proteção antes de considerá-la existente, e dimensionando a fração da carga sob esta estrutura.",
      "Sobra descoberto o risco de a proteção não ser honrada exatamente no cenário em que ela seria acionada, que é o risco dominante e o menos discutido desta estrutura."
    ],
    "volume": [
      "O comprador carrega, salvo flexibilidade contratada separadamente.",
      "Dispara com qualquer variação de consumo, já que a indexação trata preço e não quantidade.",
      "Mitiga-se contratando banda em separado, com a advertência de que indexação e flexibilidade são produtos distintos e precificados separadamente.",
      "Sobra descoberta a ilusão de cobertura: é comum um comprador supor que o teto de preço protege também contra desvio de volume, o que não é o caso em nenhuma hipótese."
    ],
    "perfil": [
      "O comprador carrega, e a exposição é agravada por o preço de referência ser horário.",
      "Dispara pelo descasamento horário, com efeito multiplicado nas horas de preço mais alto.",
      "Mitiga-se modulando a entrega ou reduzindo a fração da carga submetida a esta estrutura.",
      "Sobra descoberta a concentração do resultado em poucas horas do ano: numa estrutura indexada, a maior parte da variação anual costuma se decidir em uma fração pequena dos intervalos."
    ],
    "sub": [
      "O comprador carrega, e de forma central, porque a fórmula referencia o preço de um submercado específico.",
      "Dispara com a diferença entre o preço de referência do submercado de entrega e o do submercado de consumo.",
      "Mitiga-se referenciando a fórmula ao submercado de consumo, o que precisa ser negociado explicitamente e não presumido.",
      "Sobra descoberta a hipótese de a fórmula referenciar um submercado e a entrega contábil ocorrer em outro — configuração que cria duas exposições distintas sobre a mesma operação."
    ],
    "cred": [
      "O comprador carrega, e este é o risco dominante desta estrutura.",
      "Dispara na falha de quem vendeu o teto, no exato cenário de preço alto em que ele seria acionado.",
      "Mitiga-se com garantia específica para a proteção, gatilho antecipado de recomposição e limite de exposição por contraparte.",
      "Sobra descoberta a correlação estrutural: a mesma condição sistêmica que aciona a proteção pressiona a capacidade financeira de quem a vendeu."
    ],
    "saida": [
      "O comprador carrega, com marcação a mercado da proteção contratada no momento do término.",
      "Dispara no término antecipado, quando é preciso apurar o valor econômico corrente da proteção.",
      "Mitiga-se prevendo em contrato o método de apuração desse valor, com fonte de referência e data de corte definidas.",
      "Sobra descoberta a disputa sobre metodologia de apuração, que é frequente porque o valor de uma proteção depende de premissas que as partes têm incentivo oposto para escolher."
    ],
    "reg": [
      "Depende da cláusula, com exposição específica à metodologia do preço de referência.",
      "Dispara com mudança na metodologia ou nos limites do preço de referência, que são revisados anualmente por ato da agência.",
      "Mitiga-se com cláusula que trate expressamente a alteração de metodologia do preço de referência como evento de reequilíbrio.",
      "Sobra descoberto o efeito de uma revisão anual de limites que altere a distribuição de resultados sem alterar a metodologia — hipótese que raramente aciona cláusula alguma."
    ]
  }
} as const;
/** INST·09 · `var Q` (L3130–3148). */
const I09_Q = [
  {
    "k": "dados",
    "t": "A unidade tem série horária de medição dos últimos doze meses, acessível e confiável?",
    "tipo": "dado",
    "falta": "Série horária de medição de doze meses. Sem ela não há como dimensionar sazonalização, modulação nem exposição residual — e \"carga razoavelmente plana\" não é um dado."
  },
  {
    "k": "horizonte",
    "t": "O horizonte operacional da unidade é maior que o prazo do contrato pretendido?",
    "tipo": "imped",
    "falta": "Definição do horizonte operacional da unidade, formalizada pela direção.",
    "imp": "Horizonte operacional menor que o prazo contratual. Multa de término, montante mínimo e sobra podem superar qualquer ganho, e a assimetria entre entrar e sair torna isso decisivo."
  },
  {
    "k": "janela",
    "t": "Existe janela de denúncia contratual que torne a data de início pretendida executável?",
    "tipo": "imped",
    "falta": "Contrato vigente com a distribuidora, data de vigência e prazo de denúncia aplicável.",
    "imp": "Data de início não executável pela janela contratual. Nenhuma negociação de energia resolve isto: é regra do contrato de rede, e assinar energia para data impossível cria exposição imediata."
  },
  {
    "k": "governanca",
    "t": "Há governança financeira para avaliar crédito de contraparte, suportar garantias e manter política de contratação?",
    "tipo": "imped",
    "falta": "Posição formal da área financeira sobre limites de contraparte, capacidade de prestar garantia e tolerância a variação orçamentária.",
    "imp": "Ausência de governança financeira para operar no ambiente livre. Garantias e chamadas de recomposição pressionam liquidez exatamente no cenário ruim, e sem política de contratação a decisão fica dependente de opinião individual em dia de mercado volátil."
  },
  {
    "k": "estabilidade",
    "t": "A carga é estável, ou a variabilidade é conhecida e documentada?",
    "tipo": "dado",
    "falta": "Documentação da variabilidade de carga e do plano de produção para o horizonte do contrato.",
    "imp": "Carga volátil sem documentação. Qualquer estrutura contratual escolhida nessas condições é aposta com nome técnico."
  },
  {
    "k": "proposta",
    "t": "As propostas recebidas abrem a composição de custos item a item, declarando o que está dentro e fora do preço?",
    "tipo": "dado",
    "falta": "Abertura item a item da composição de custos das propostas, com declaração do que está incluído.",
    "imp": "Propostas sem abertura de custos. Sem saber o que está dentro e fora do preço não existe comparação — existe impressão."
  }
] as const;
/** INST·10 · `var ET` (L3227–3268). */
const I10_ET = [
  {
    "k": "Medição",
    "ent": "Dados de medição validados de geração e de consumo, por ponto e por intervalo de contabilização, coletados pelo sistema de medição para faturamento.",
    "err": "Falha de comunicação, medidor inadequado ao regime da unidade ou dado ausente, que impede a apuração correta da energia verificada naquele período.",
    "quem": "O custo recai sobre o consumidor. Dado faltante costuma ser tratado por estimativa conforme as regras aplicáveis, e a estimativa raramente favorece quem não mediu.",
    "prev": "Prevenção: validar o sistema de medição e a rota de comunicação antes do início do suprimento, e não no primeiro mês de operação, quando qualquer correção já produziu efeito contábil."
  },
  {
    "k": "Registro de contratos",
    "ent": "Montantes contratados registrados e validados pelas duas partes, por período de suprimento e por submercado de entrega.",
    "err": "Registro fora do prazo, divergência entre as partes quanto ao montante, ou lançamento com submercado incorreto.",
    "quem": "Do consumidor, ainda que a operação seja executada pelo representante: contrato não registrado não produz posição, e a carga fica descoberta na contabilização daquele mês.",
    "prev": "Prevenção: conferir o registro no próprio mês, e não confiar que o representante o fez. Reconciliar montante, período e submercado contra o instrumento assinado."
  },
  {
    "k": "Apuração de posições",
    "ent": "Confronto entre a energia verificada e a posição contratual alocada a cada intervalo de contabilização.",
    "err": "Erro de sazonalização ou de modulação declarada, que desloca o montante contratado para o período errado e cria posição onde não deveria haver.",
    "quem": "Do consumidor. É nesta etapa que o descasamento de perfil deixa de ser um conceito de aula e vira um número no extrato.",
    "prev": "Prevenção: revisar a curva declarada sempre que houver mudança de regime operacional, e não apenas nas janelas contratuais de revisão."
  },
  {
    "k": "Ajustes de regra",
    "ent": "Perdas, mecanismos de realocação, encargos e tratamentos específicos previstos nas regras de comercialização vigentes para o período apurado.",
    "err": "Desconhecimento da versão das regras aplicável àquele período, ou uso de uma versão posterior para analisar um mês anterior.",
    "quem": "Do consumidor, por resultado; e do analista, por credibilidade. Citar regra de versão errada é o erro que mais rapidamente destrói confiança técnica numa reunião.",
    "prev": "Prevenção: registrar, em toda análise, a versão das regras e o período de vigência utilizados — do mesmo modo que se registra a data de consulta de um número."
  },
  {
    "k": "Valoração",
    "ent": "Preço horário por submercado e os parâmetros regulatórios do ano, incluídos piso e tetos aplicáveis.",
    "err": "Assumir a média mensal como referência do resultado, ou aplicar limites de um ano a um período de outro.",
    "quem": "Do consumidor. A média mensal não descreve o resultado de nenhum agente em particular, e a diferença entre média e resultado efetivo cresce com a assinatura horária da carga.",
    "prev": "Prevenção: analisar resultado sempre em base horária, e reservar a média mensal para comunicação, nunca para cálculo."
  },
  {
    "k": "Garantias",
    "ent": "Exposição projetada do agente e os requisitos de garantia dela decorrentes, conforme as regras aplicáveis.",
    "err": "Não antecipar a chamada de recomposição, que tende a ocorrer justamente no cenário de preço alto e de exposição crescente.",
    "quem": "Do consumidor, e no pior momento possível de caixa. É a etapa que mais frequentemente surpreende quem migrou sem envolver a área financeira desde o início.",
    "prev": "Prevenção: modelar a necessidade de garantia em cenário de estresse antes de assinar, e tratar a linha de crédito correspondente como parte do custo da migração."
  },
  {
    "k": "Liquidação",
    "ent": "Mapa financeiro do mercado de curto prazo, com credores e devedores apurados e o tratamento da inadimplência do período.",
    "err": "Supor que a câmara paga o contrato bilateral, ou que o registro do contrato equivale a garantia de pagamento.",
    "quem": "Do consumidor e do vendedor, cada um em sua posição. A câmara liquida apenas a diferença; o contrato é pago entre as partes, e o risco de crédito permanece integralmente com elas.",
    "prev": "Prevenção: separar mentalmente e no controle interno três riscos distintos — o da liquidação na câmara, o do contrato bilateral e o do representante."
  },
  {
    "k": "Reconciliação",
    "ent": "Conferência cruzada entre a fatura do vendedor, o extrato de liquidação, a medição e a posição registrada no período.",
    "err": "Não reconciliar, e descobrir a divergência meses depois, quando a correção já virou discussão contratual em vez de ajuste operacional.",
    "quem": "Do consumidor. É a etapa mais barata de executar e a mais frequentemente omitida — e é ela que transforma gestão de energia em controle, e não em torcida.",
    "prev": "Prevenção: fechar a reconciliação do mês anterior antes do encerramento do mês corrente, com responsável nomeado e prazo interno, como se faz com conciliação bancária."
  }
] as const;
/** INST·11 · `var LD` (L3297–3338). */
const I11_LD = [
  {
    "q": "Quantos consumidores migraram no mês?",
    "s": "Boletim de migrações e comunicados institucionais da câmara de comercialização.",
    "d": "Mensal, com defasagem de algumas semanas após o fechamento do mês de referência.",
    "c": "\"Câmara de comercialização, balanço de migrações de [mês/ano], consultado em [data].\" Declare se o número se refere a unidades consumidoras ou a agentes — não é a mesma coisa e a diferença é grande.",
    "arm": "Armadilha: comparar um mês de forte expansão com a média histórica e concluir tendência. A própria câmara registrou fase de acomodação após dois anos de expansão acelerada — citar apenas o pico produz uma narrativa que os dados não sustentam."
  },
  {
    "q": "Qual a participação do ambiente livre no consumo?",
    "s": "Boletins mensais de contabilização e comunicados da câmara; painéis institucionais do ministério.",
    "d": "Mensal, com defasagem do ciclo de contabilização; os painéis consolidados são menos frequentes.",
    "c": "\"Câmara de comercialização, [publicação], [período], consultado em [data].\" Declare sempre o recorte adotado.",
    "arm": "Armadilha: participação no consumo total do sistema, participação por classe e participação por segmento produzem números diferentes, todos corretos. Citar um deles como \"a\" participação é o erro que o Módulo 08 ensinou a não cometer."
  },
  {
    "q": "Qual foi o preço de curto prazo de determinada hora?",
    "s": "Painel de preços da câmara de comercialização, por submercado e por hora.",
    "d": "Divulgação diária, com a série horária publicada por submercado.",
    "c": "\"Preço de liquidação das diferenças, submercado [X], [data e hora], consultado em [data].\"",
    "arm": "Armadilha: usar média mensal para descrever o resultado de uma operação específica. A média não corresponde ao resultado de nenhum agente em particular, e o descolamento cresce com a assinatura horária da carga analisada."
  },
  {
    "q": "Quais são o piso e o teto do preço neste ano?",
    "s": "Despacho anual da agência que fixa os limites, publicado ao fim do ano anterior, e a resolução normativa que estabelece a metodologia.",
    "d": "Anual, com publicação em dezembro para uso no ano seguinte.",
    "c": "\"Agência reguladora, despacho de [data], limites vigentes para [ano].\" Cite sempre o ano e o ato.",
    "arm": "Armadilha: tratar piso e tetos como constantes do setor. São recalculados anualmente e variam com índices de preços; um valor citado sem ano é um valor errado à espera de ser descoberto."
  },
  {
    "q": "Qual bandeira está acionada e qual o adicional?",
    "s": "Página de bandeiras tarifárias da agência reguladora.",
    "d": "Anúncio mensal, tipicamente nos últimos dias úteis do mês anterior ao de vigência.",
    "c": "\"Agência reguladora, bandeira de [mês/ano], adicional de R$ [x] a cada 100 kWh, consultado em [data].\"",
    "arm": "Armadilha: confundir o acionamento, que é mensal e conjuntural, com os adicionais unitários, que são parâmetros regulados revisados por ato. São duas informações com cadências diferentes e a citação precisa distinguir as duas."
  },
  {
    "q": "Quais leilões estão programados e com que produto?",
    "s": "Portarias de diretrizes do ministério, e editais, cronogramas e resultados publicados pela agência.",
    "d": "Publicação conforme o calendário de cada certame, com consulta pública prévia em boa parte dos casos.",
    "c": "\"Portaria de diretrizes [número/ano] e edital [número/ano].\"",
    "arm": "Armadilha: identificar o produto pela sigla de antecedência. A letra indica calendário; o produto, a modalidade, o prazo e as garantias vêm da portaria e do edital, e mudam entre certames com a mesma sigla."
  },
  {
    "q": "Qual é a regra vigente para determinado cálculo de mercado?",
    "s": "Regras de comercialização e procedimentos de comercialização, nas versões vigentes aprovadas pela agência.",
    "d": "Atualização periódica, com versões numeradas e período de vigência declarado em cada caderno.",
    "c": "\"Regras de comercialização, versão [x], vigência [período], consultado em [data].\"",
    "arm": "Armadilha: citar a regra sem a versão. Em análise operacional isso é equivalente a citar um número sem a data-base, e produz conclusões que não se reproduzem quando alguém confere."
  },
  {
    "q": "Qual o estado da regulamentação de um dispositivo da lei de 2025?",
    "s": "Agenda regulatória da agência, consultas públicas do ministério e da agência, e resoluções efetivamente publicadas.",
    "d": "Contínua. A agenda é bianual; as consultas têm prazos próprios; as resoluções saem quando saem.",
    "c": "\"Agenda regulatória [biênio]\", \"[consulta pública número/ano]\" e, quando houver, a resolução publicada com data.",
    "arm": "Armadilha: tratar dispositivo em vigor como dispositivo aplicável. Há norma vigente cujo efeito prático depende de regulamentação que ainda não existe — a formulação correta é \"prazo previsto em lei, regulamentação pendente\", com o estado de cada frente declarado separadamente."
  }
] as const;
// </DADOS-GERADOS>

// ── auxiliares (os do script: clamp, numOf, fmt) ─────────────────────────────

const esc = (t: string) => String(t);
function clamp(v: number, a: number, b: number): number {
  if (isNaN(v)) return a;
  return v < a ? a : v > b ? b : v;
}
/** `numOf` da fonte: vazio ou não numérico vale o padrão; o resto é preso à faixa. */
function numOf(v: EntradaInstrumento | undefined, def: number, a: number, b: number): number {
  if (v === undefined || v === '') return def;
  const x = parseFloat(String(v).replace(',', '.'));
  if (isNaN(x)) return def;
  return clamp(x, a, b);
}
const txt = (v: EntradaInstrumento | undefined, def: string) => (v === undefined || v === '' ? def : String(v));
type Cartao = [rotulo: string, texto: string];
/** Os cartões (`.ocard`) da fonte: rótulo em negrito, texto embaixo, um por bloco. */
const cartoes = (cs: Cartao[]) => cs.map(([r, t]) => `<b>${r}</b><br>${t}`).join('<br><br>');
/** Partes da tela da fonte (veredito, cartões), na ordem, separadas por linha em branco. */
const juntar = (...partes: string[]) => partes.filter((p) => p && p.trim()).join('<br><br>');
/** O `fmt` do script: número pt-BR com `d` casas. */
const fmt = (x: number, d: number) => (isNaN(x) ? '—' : x.toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }));

// ── INST·01 — Mapa do mercado (§MAP) ─────────────────────────────────────────
const i01: CalculateFn = (i) => {
  const f = txt(i['m09-mp-seg'], 'fisico') as keyof typeof I01_FLUXO;
  const fluxo = I01_FLUXO[f] ? f : 'fisico';
  const node = txt(i['m09-mp-node'], '') as keyof typeof I01_NODE | '';
  const outF = I01_FLUXO[fluxo] || '';
  const outN =
    node && I01_NODE[node]
      ? '<b>' + esc(I01_NODE[node].n) + '</b> · ' + I01_NODE[node][fluxo]
      : 'Clique em um agente do mapa para ver o papel dele no fluxo selecionado.';
  return { valores: {}, veredito: juntar(outF, outN) };
};

// ── INST·02 — Comparador componente a componente ─────────────────────────────
const i02: CalculateFn = (i) => {
  const sel = Math.trunc(numOf(i['m09-cmp-grid'], 0, 0, I02_COMP.length - 1));
  const c = I02_COMP[sel];
  const cl = c.cl as keyof typeof I02_CLS;
  const conta = (k: string) => I02_COMP.filter((x) => x.cl === k).length;
  return {
    valores: {
      'm09-cmp-c1': conta('f'),
      'm09-cmp-c2': conta('m'),
      'm09-cmp-c3': conta('p'),
      'm09-cmp-c4': conta('n'),
    },
    veredito: juntar(
      cartoes([
        ['No ambiente regulado', c.acr],
        ['No ambiente livre', c.acl],
        [esc(I02_CLS[cl].t), c.nota],
        ['Erro de leitura', c.err],
      ]),
      I02_txt[cl],
    ),
  };
};

// ── INST·03 — Anatomia do produto de leilão ──────────────────────────────────
const i03: CalculateFn = (i) => {
  const l = txt(i['m09-lei-seg'], 'nova') as keyof typeof I03_LEI;
  const d = I03_LEI[l] || I03_LEI.nova;
  const m = txt(i['m09-mod-seg'], 'qtd') as keyof typeof I03_MOD;
  return {
    valores: {},
    veredito: juntar(
      cartoes([
        ['Objeto econômico', d.obj],
        ['Risco que resolve', d.risco],
        ['Prazo e uso típico', d.prazo],
        ['Cuidado analítico', d.cuidado],
        ['O que ler no edital', d.ler],
      ]),
      I03_MOD[m] ?? I03_MOD.qtd,
    ),
  };
};

// ── INST·04 — Régua de elegibilidade e cronograma condicionado ───────────────
function addMonths(str: string, m: number): string {
  const p = String(str).split('/');
  const mm = parseInt(p[0], 10);
  const yy = parseInt(p[1], 10);
  if (isNaN(mm) || isNaN(yy)) return '—';
  const t = yy * 12 + (mm - 1) + m;
  const ny = Math.floor(t / 12);
  const nm = (t % 12) + 1;
  const nomes = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  return nomes[nm - 1] + ' de ' + ny;
}
const i04: CalculateFn = (i) => {
  const marc = I04_REQ.map((_, k) => txt(i[`m09-el-req-${k}`], '0') === '1');
  const n = marc.filter(Boolean).length;
  const seg = txt(i['m09-el-seg'], 'ga');
  // o campo "mês/ano" da fonte, em dois números (o contrato não tem campo de texto)
  const d0 = `${txt(i['m09-el-d0-mes'], '11')}/${txt(i['m09-el-d0-ano'], '2025')}`;
  const m1 = numOf(i['m09-el-m1'], 24, 0, 120);
  const m2 = numOf(i['m09-el-m2'], 36, 0, 120);

  let prazo = '—';
  let estado = '—';
  let vtxt = '';
  if (seg === 'ga') {
    prazo = 'não se aplica';
    estado = 'elegível hoje';
    vtxt = '<b>Elegível hoje, sem prazo pendente.</b> Todo o Grupo A — unidades atendidas em média e alta tensão — pode exercer a opção desde 1º de janeiro de 2024, por portaria normativa do ministério publicada em 2022, sem exigência de carga mínima como teste geral. Os requisitos legais marcados acima condicionam a abertura da baixa tensão e não afetam este segmento. A pergunta pertinente aqui não é elegibilidade: é <b>prontidão</b> — janela de denúncia, medição, modelagem, garantias e estrutura contratual.';
  } else {
    const meses = seg === 'bt1' ? m1 : m2;
    prazo = addMonths(d0, meses);
    if (n >= 5) {
      estado = 'condições cumpridas';
      vtxt = '<b>Os cinco requisitos legais foram marcados como cumpridos.</b> Nessa hipótese, o teto de prazo previsto em lei para este segmento é <b>' + esc(prazo) + '</b>, contado a partir de ' + esc(d0) + '. Mesmo assim, a formulação correta continua sendo "prazo previsto em lei": a abertura efetiva depende de ato regulatório que a implemente e de sistemas operacionais em funcionamento. Confirme o estado real de cada requisito na fonte primária antes de comunicar qualquer data a um cliente.';
    } else {
      estado = 'pendente';
      vtxt = '<b>Não elegível hoje, e a data não é afirmável.</b> Faltam ' + (5 - n) + ' de 5 requisitos legais prévios. O teto de prazo previsto em lei para este segmento é <b>' + esc(prazo) + '</b>, contado a partir de ' + esc(d0) + ' — mas o texto legal condiciona a redução dos limites ao cumprimento prévio dos requisitos. A resposta correta a um cliente é: "há prazo previsto em lei, e faltam estes requisitos", seguida da lista. Nunca "a partir de tal data será possível".';
    }
  }
  return {
    valores: { 'm09-el-n': n },
    textos: { 'm09-el-p': prazo, 'm09-el-e': estado },
    veredito: juntar(
      vtxt,
      cartoes(I04_REQ.map((r, k): Cartao => [(marc[k] ? 'cumprido' : 'pendente') + ' · ' + esc(r.k), esc(r.d)])),
    ),
  };
};

// ── INST·05 — Montador de contrato ───────────────────────────────────────────
const i05: CalculateFn = (i) => {
  const hz = I05_HZ[txt(i['m09-mc-hz'], 'curto') as keyof typeof I05_HZ] ?? I05_HZ.curto;
  const vol = I05_VOL[txt(i['m09-mc-vol'], 'flat') as keyof typeof I05_VOL] ?? I05_VOL.flat;
  const fx = I05_FLEX[txt(i['m09-mc-flex'], 'rig') as keyof typeof I05_FLEX] ?? I05_FLEX.rig;
  const ix = I05_IDX[txt(i['m09-mc-idx'], 'fixo') as keyof typeof I05_IDX] ?? I05_IDX.fixo;
  const sb = I05_SUB[txt(i['m09-mc-sub'], 'mesmo') as keyof typeof I05_SUB] ?? I05_SUB.mesmo;

  const cam = hz.cam + vol.cam + fx.cam + ix.cam + sb.cam;

  const rp = ix.n === 'indexado ao curto prazo com teto' ? 'compartilhado' : 'vendedor, sobre o contratado';
  const rv = vol.n === 'acompanha a carga' ? 'vendedor, dentro dos limites' : fx.n === 'rígido' ? 'comprador, integral' : 'compartilhado pela banda';
  const rperf = vol.n === 'modulado' || vol.n === 'acompanha a carga' ? 'coberto em boa parte' : 'comprador';

  // Q07: "de cinco" → "de seis" (os pesos somam até 6; ver o cabeçalho).
  let t = '';
  if (cam >= 4) t = '<b>Exposição residual alta.</b> Esta combinação acumula ' + cam + ' camadas descobertas de seis possíveis. Não significa que a estrutura esteja errada — significa que ela precisa ser uma escolha declarada, com a área financeira ciente de cada camada, e não o resultado de uma negociação conduzida apenas por preço.';
  else if (cam >= 2) t = '<b>Exposição residual moderada.</b> ' + cam + ' camadas descobertas de seis. É o território em que a maior parte dos contratos industriais efetivamente vive. O trabalho aqui é nomear cada camada, decidir se ela é aceitável e definir quem monitora cada uma.';
  else t = '<b>Exposição residual baixa.</b> ' + cam + ' camada' + (cam === 1 ? '' : 's') + ' descoberta' + (cam === 1 ? '' : 's') + ' de seis. Cobertura alta tem preço: quanto mais risco o vendedor assume, mais prêmio ele cobra. Verifique se o custo dessa cobertura é compatível com a volatilidade real da carga — cobrir risco que não existe também destrói valor.';
  t += ' <span style="color:var(--txt-3)">Este instrumento não devolve preço nem economia: devolve o que ficou descoberto.</span>';

  return {
    valores: { 'm09-mc-r4': cam },
    textos: { 'm09-mc-r1': rp, 'm09-mc-r2': rv, 'm09-mc-r3': rperf, 'm09-mc-r4': String(cam) },
    veredito: juntar(
      t,
      cartoes([
        ['Horizonte · ' + esc(hz.n), hz.r],
        ['Volume · ' + esc(vol.n), vol.r],
        ['Flexibilidade · ' + esc(fx.n), fx.r],
        ['Preço · ' + esc(ix.n), ix.r],
        ['Submercado · ' + esc(sb.n), sb.r],
        ['O que fica exposto', 'Nesta combinação, a variação <b>' + esc(vol.exp) + '</b> é a fonte dominante de exposição residual, e a banda escolhida (' + esc(fx.n) + ') define quanto dela é absorvido antes de virar posição liquidada ao preço do momento.'],
      ]),
    ),
  };
};

// ── INST·06 — Matriz contrato × risco ────────────────────────────────────────
const i06: CalculateFn = (i) => {
  const c = txt(i['m09-mx-c'], 'flat') as keyof typeof I06_M;
  const risco = txt(i['m09-mx-risk'], 'preco');
  const linha = I06_M[c] as Record<string, readonly string[]> | undefined;
  const cell = linha && linha[risco] ? linha[risco] : null;
  if (!cell || cell.length < 4) {
    return {
      valores: {},
      veredito: juntar(
        cartoes([['Célula incompleta', 'Combinação não mapeada ou com campo ausente — reporte, porque a matriz deve ser completa e nenhuma célula pode ficar vazia.']]),
        'Célula não encontrada.',
      ),
    };
  }
  const nomeRisco = (I06_RISCOS.filter((r) => r.k === risco)[0] || { n: '' }).n;
  return {
    valores: {},
    veredito: juntar(
      cartoes([
        ['Quem carrega', cell[0]],
        ['O que dispara', cell[1]],
        ['O que mitiga', cell[2]],
        ['O que sobra descoberto', cell[3]],
      ]),
      '<b>' + esc(I06_CONTRATOS[c]) + ' × ' + esc(nomeRisco) + '.</b> Leia lateralmente: percorra esta mesma classe de risco nas seis estruturas antes de concluir qualquer coisa sobre uma delas. A comparação entre células é o que revela onde o preço de cada estrutura está sendo efetivamente pago — e o quarto campo é o que impede a leitura otimista, porque mostra que mitigar não é eliminar.',
    ),
  };
};

// ── INST·07 — Simulador de exposição residual ────────────────────────────────
const i07: CalculateFn = (i) => {
  const C = numOf(i['m09-ex-c'], 1000, 50, 50000);
  const S = numOf(i['m09-ex-s'], 15, 0, 60);
  const H = numOf(i['m09-ex-h'], 20, 0, 80);
  const V = numOf(i['m09-ex-v'], 100, 0, 130);
  const F = numOf(i['m09-ex-f'], 10, 0, 40);
  const e = txt(i['m09-ex-seg'], 'flat');

  const sazRes = e === 'sazo' || e === 'mod' ? S * 0.15 : S;
  const horRes = e === 'mod' ? H * 0.2 : H;
  const nivel = Math.abs(100 - V);

  const base = Math.sqrt(sazRes * sazRes + horRes * horRes) + nivel;
  const exp = Math.max(0, base - F);
  const mwh = (C * exp) / 100;

  let t: string;
  if (exp < 3) t = '<b>Exposição residual baixa.</b> Nesta configuração, a estrutura cobre a maior parte da variação da carga. Duas verificações antes de comemorar: a cobertura alta tem prêmio embutido no preço, e a modelagem aqui usa amplitude média — série horária real costuma revelar exposição maior que a estimada por amplitude.';
  else if (exp < 8) t = '<b>Exposição residual moderada.</b> É o território onde vive a maior parte dos contratos industriais. O trabalho não é reduzi-la a zero: é saber de onde ela vem. Compare as duas origens no painel — se a horária domina, a resposta é modulação; se a sazonal domina, a resposta é sazonalização; se o desvio de nível domina, o volume contratado está mal dimensionado.';
  else t = '<b>Exposição residual alta.</b> Uma fração relevante da carga fica descoberta e será liquidada ao preço do momento, hora a hora. Isso pode ser uma decisão deliberada com apetite declarado — mas precisa ser uma decisão, e não o resultado de uma negociação conduzida só por preço. Lembre ainda que a lei passou a exigir cobertura contratual da totalidade da carga, sob penalidade, na forma que a regulamentação vier a definir.';

  return {
    valores: { 'm09-ex-p': exp, 'm09-ex-m': mwh, 'm09-ex-os': sazRes, 'm09-ex-oh': horRes },
    textos: { 'm09-ex-p': fmt(exp, 1), 'm09-ex-m': fmt(mwh, 0), 'm09-ex-os': fmt(sazRes, 1) + '%', 'm09-ex-oh': fmt(horRes, 1) + '%' },
    veredito: t,
  };
};

// ── INST·08 — Anatomia do fator de ajuste ────────────────────────────────────
const i08: CalculateFn = (i) => {
  const f = numOf(i['m09-gs-f'], 0.92, 0.6, 1.2);
  const g = numOf(i['m09-gs-g'], 100, 1, 2000);
  const v = numOf(i['m09-gs-v'], 95, 0, 130);

  const aloc = g * f;
  const cont = (g * v) / 100;
  const diff = cont - aloc;
  const situacao = diff > 0.05 ? 'posição comprada' : diff < -0.05 ? 'posição vendida' : 'equilibrada';

  let t: string;
  if (f < 0.85) t = '<b>Fator bem abaixo da unidade.</b> O conjunto gerou muito menos que a referência agregada, e a alocação de cada participante cai proporcionalmente. ';
  else if (f < 1.0) t = '<b>Fator abaixo da unidade.</b> A alocação fica abaixo da referência e quem vendeu com base nela fica curto. ';
  else t = '<b>Fator igual ou acima da unidade.</b> A geração do conjunto cobriu ou superou a referência agregada; havendo excedente, ele é tratado como energia secundária e distribuído conforme as regras. ';
  if (diff > 0.05) t += 'Com posição vendida acima da energia alocada, o participante precisa comprar a diferença no mercado de curto prazo, ao preço horário do submercado — e o cenário que produz fator baixo tende a ser o mesmo que produz preço alto. <b>É essa correlação, e não o fator isolado, que torna o risco material.</b>';
  else if (diff < -0.05) t += 'Com posição vendida abaixo da energia alocada, o participante tem sobra a liquidar. Sobra não é ganho garantido: ela é vendida ao preço do momento, e o cenário de fator alto costuma ser o de preço baixo.';
  else t += 'Posição praticamente equilibrada em relação à alocação. É a configuração que minimiza a exposição, e é rara — porque a posição é decidida meses antes de o fator ser conhecido.';
  t += ' <span style="color:var(--txt-3)">Para o consumidor industrial que não gera: este risco chega embutido no preço de contratos lastreados em hidrelétrica, na saúde financeira dessas contrapartes, e no acionamento de bandeira e no preço de curto prazo.</span>';

  return {
    valores: { 'm09-gs-a': aloc, 'm09-gs-c': cont, 'm09-gs-d': Math.abs(diff) },
    textos: { 'm09-gs-a': fmt(aloc, 1), 'm09-gs-c': fmt(cont, 1), 'm09-gs-d': fmt(Math.abs(diff), 1), 'm09-gs-s': situacao },
    veredito: t,
  };
};

// ── INST·09 — Roteador ───────────────────────────────────────────────────────
const i09: CalculateFn = (i) => {
  let n = 0;
  let ns = 0;
  const imped: (typeof I09_Q)[number][] = [];
  const lac: (typeof I09_Q)[number][] = [];
  I09_Q.forEach((q) => {
    const r = txt(i[`m09-rt-${q.k}`], '');
    if (!r) return;
    n++;
    if (r === 'ns') {
      ns++;
      lac.push(q);
    } else if (r === 'nao') {
      if (q.tipo === 'imped') imped.push(q);
      else lac.push(q);
    }
  });
  const valores = { 'm09-rt-n': n, 'm09-rt-l': ns, 'm09-rt-i': imped.length };

  if (n < 6) {
    return { valores, veredito: ('Responda as seis perguntas para receber o diagnóstico. <b>Responder "não sei" é uma resposta válida</b> — e neste instrumento ela é tratada como informação, não como omissão.') };
  }

  let t: string;
  if (ns > 0) t = '<b>Não é possível concluir com o que foi informado.</b> Há ' + ns + ' ponto' + (ns === 1 ? '' : 's') + ' declarado' + (ns === 1 ? '' : 's') + ' como desconhecido. Com informação faltante não se conclui nem pela migração nem contra ela — inclusive porque a lacuna pode esconder tanto um impedimento quanto uma condição favorável. Este é um resultado, não uma evasiva, e ele tem consequência acionável imediata: obter os itens abaixo.';
  else if (imped.length > 0) t = '<b>Não vale nas condições informadas.</b> Há ' + imped.length + ' impedimento' + (imped.length === 1 ? '' : 's') + ' determinado' + (imped.length === 1 ? '' : 's') + ', e nenhum deles se resolve com preço melhor. A conclusão não é "nunca": é que, nas condições atuais, migrar destrói valor esperado ou não é executável. O caminho é remover o impedimento e reavaliar.';
  else if (lac.length > 0) t = '<b>Não é possível concluir com o que foi informado.</b> Não há impedimento determinado, mas faltam ' + lac.length + ' insumo' + (lac.length === 1 ? '' : 's') + ' sem os quais a decisão não é calculável. O perfil pode ser favorável — e ainda assim a resposta honesta é a lista do que falta, com prazo para obter cada item.';
  else t = '<b>Vale investigar.</b> Não há impedimento determinado nem lacuna declarada. Isso <b>não</b> significa que migrar seja vantajoso: significa que a pergunta agora é respondível e que o trabalho seguinte é quantitativo — reconstruir o custo atual comparável, simular a exposição residual por estrutura contratual e por cenário de produção, e ler as propostas pelas onze cláusulas. Nenhum número de economia existe antes desse trabalho.';

  const cs: Cartao[] = [];
  imped.forEach((q) => cs.push(['Impedimento', esc('imp' in q ? q.imp : '')]));
  lac.forEach((q) => cs.push(['Falta para responder', esc(q.falta)]));
  if (!cs.length) {
    cs.push(['Próximo passo', 'Reconstruir o custo atual comparável a partir de doze meses de faturas, e simular a exposição residual das estruturas candidatas contra a série horária real.']);
    cs.push(['O que ainda não se sabe', 'Se o resultado será favorável. A viabilidade da pergunta não antecipa a resposta dela.']);
  }
  return { valores, veredito: juntar(t, cartoes(cs)) };
};

// ── INST·10 — Régua do ciclo comercial ───────────────────────────────────────
const i10: CalculateFn = (i) => {
  const sel = Math.trunc(numOf(i['m09-cc-grid'], 0, 0, I10_ET.length - 1));
  const e = I10_ET[sel];
  return {
    valores: {},
    veredito: juntar(
      cartoes([
        ['O que entra', esc(e.ent)],
        ['O que pode dar errado', esc(e.err)],
        ['Quem paga o erro', esc(e.quem)],
        ['Como evitar', esc(e.prev)],
      ]),
      '<b>Etapa ' + (sel + 1) + ' de 8 · ' + esc(e.k) + '.</b> O Módulo 07 ensinou quem executa cada etapa e em que cadência institucional. Aqui a pergunta é outra e é do lado do consumidor: o que acontece com o caixa de uma indústria quando esta etapa específica dá errado, e quem termina pagando por isso.',
    ),
  };
};

// ── INST·11 — Localizador de dado de mercado ─────────────────────────────────
const i11: CalculateFn = (i) => {
  const sel = Math.trunc(numOf(i['m09-ld-grid'], 0, 0, I11_LD.length - 1));
  const l = I11_LD[sel];
  return {
    valores: {},
    veredito: cartoes([
      ['Onde está', esc(l.s)],
      ['Defasagem', esc(l.d)],
      ['Forma de citação', esc(l.c)],
      ['Armadilha de recorte', esc(l.arm)],
    ]),
  };
};

/** Dados que o arquivo de conteúdo usa para montar as opções dos campos. */
export const OPCOES_M09 = {
  agentes: Object.entries(I01_NODE).map(([value, d]) => ({ value, label: d.n })),
  componentes: I02_COMP.map((c, k) => ({ value: String(k), label: c.k })),
  requisitos: I04_REQ.map((r) => r.k),
  riscos: I06_RISCOS.map((r) => ({ value: r.k, label: r.n })),
  contratos: Object.entries(I06_CONTRATOS).map(([value, label]) => ({ value, label })),
  perguntas: I09_Q.map((q) => ({ k: q.k, t: q.t })),
  etapas: I10_ET.map((e, k) => ({ value: String(k), label: `${k + 1}. ${e.k}` })),
  dados: I11_LD.map((l, k) => ({ value: String(k), label: l.q })),
};

/** Todo veredito do M09 já vem em pt-BR da fonte ("Lei nº 15.269", "0,92"): a tela não troca ponto por vírgula. */
const ptBr = (f: CalculateFn): CalculateFn => (i) => ({ ...f(i), vereditoPtBr: true });

export const CALCULADORAS: Record<string, CalculateFn> = {
  'm09-inst-01': ptBr(i01),
  'm09-inst-02': ptBr(i02),
  'm09-inst-03': ptBr(i03),
  'm09-inst-04': ptBr(i04),
  'm09-inst-05': ptBr(i05),
  'm09-inst-06': ptBr(i06),
  'm09-inst-07': ptBr(i07),
  'm09-inst-08': ptBr(i08),
  'm09-inst-09': ptBr(i09),
  'm09-inst-10': ptBr(i10),
  'm09-inst-11': ptBr(i11),
};
