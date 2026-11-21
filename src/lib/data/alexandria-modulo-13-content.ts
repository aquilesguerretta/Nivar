// alexandria-modulo-13-content.ts
// Bloco 13 — Análise Financeira de Empresas e Projetos.
// Nível 3, track 'brasil'. PRIMEIRO módulo da Trilha 3.
//
// ── CATÁLOGO CONFIRMADO, e a suposição do brief NÃO se sustentou ─
// O brief supunha que o track mudaria para algo como 'estrategica' na
// travessia para a Trilha 3. O catálogo real da FOUNDRY diz outra
// coisa:
//   { id: 'bloco-13', number: 13, level: 3,
//     title: 'Análise Financeira de Empresas e Projetos',
//     track: 'brasil', illustrationPrefix: null,
//     priority: 'media-alta', estimatedHours 4-5 }
//
// O track permanece 'brasil' — a Trilha 3 NÃO introduz track novo. Só
// o `level` muda, de 2 para 3. Confirmado por leitura, não herdado.
//
// ── SEM GRAVURA, dois sinais concordando ──────────────────────
// `illustrationPrefix: null` no catálogo E zero <img> no markup —
// mesmo padrão do Módulo 11. `illustrations: []` nas oito aulas.
//
// ── VOCABULÁRIO ───────────────────────────────────────────────
// Medido, não herdado (Seção 6): seletores dos Módulos 01-03 dão ZERO;
// é o vocabulário dos Módulos 04-12 (`sec-id` 18, `lede` 18, `inst` 11,
// `det-bd` 22, `box` 27, `term` 180). `src-card` e `fi` dão zero — as
// estruturas dos Módulos 08 e 09 não existem aqui.
//
// ── CONTAGEM REAL ─────────────────────────────────────────────
// 18 seções = 8 aulas + 10 de aparato. 155 blocos de apostila.
// §Ex "Catorze exercícios" = 14 <details>; §Lex "Cento e oitenta
// termos" = 180 .term. Fonte: 386.583 bytes, a maior do currículo.
//
// ── CINCO ESTRUTURAS NOVAS, e o que a cobertura revelou ───────
// A Seção 5 do protocolo se pagou de novo. A extração inicial fechou
// com a Aula 07 em 16,1% de cobertura — perdendo 13.235 caracteres.
// Cinco estruturas que o extrator herdado atravessava sem capturar,
// todas usando divs PURAS (sem <p> dentro):
//
//   `emp`  15.880 chars — ficha de empresa (Aula 07): cabeçalho +
//          linhas chave/valor. TERCEIRA variante da mesma família de
//          `src-card` (Módulo 08) e `fi` (Módulo 09), nome novo.
//   `fx`    3.677 chars — fórmula: `fn` nome, `fe` equação, `fd` a
//          leitura. Mapeia direto no kind `formula` do AulaBloco.
//   `clk`   2.707 chars — cronologia: data + corpo por linha.
//   `and`   1.324 chars — andaime de nav + corpo GERADO POR SCRIPT
//          (`an-bd` nasce vazio no markup). Não capturável
//          estaticamente; é o resíduo da Aula 08.
//   `t333`/`dual`  2.175 chars — três colunas e comparação lado a
//          lado.
//
// Depois da correção: 120 → 155 blocos.
//
// ── NOTA DE MÉTODO: cobertura por trecho engana ───────────────
// A medida por trecho contíguo de 40 chars deixou cinco aulas em
// 78-81% mesmo depois de tudo capturado, e a investigação mostrou que
// era FALSO NEGATIVO do medidor: ele concatena elementos adjacentes da
// fonte numa string que nunca existe no extraído, porque a extração
// separa em blocos (um <h3> seguido de <p> vira `titulo` + `paragrafo`).
//
// A medida imune a isso é COBERTURA POR PALAVRA, e ela fecha em
// 98,4% a 99,5% nas Aulas 01-07. A Aula 08 fica em 92,1%, e o resíduo
// é exatamente o `and` gerado por script. Mesma família das notas de
// método da Seção 10: falha investigada até a causa se prova defeito
// do harness, não da extração.
//
// ── EXERCÍCIO SEM VÍNCULO, sétima vez ─────────────────────────
// Varredura por /[Aa]ula\s*\d+/ no enunciado E no gabarito dos catorze:
// ZERO. Padrão desde o Módulo 04 (Seção 4). Vão para SOLTOS.
//
// ── INSTRUMENTOS: NÃO PORTADOS NESTA WAVE ─────────────────────
// São ONZE: um no § MAP (fora de aula) e dez de aula, com as Aulas 03
// e 04 tendo dois cada. TODOS geram campos por script — mesmo perfil
// dos Módulos 08 e 09.
//
// Razão adicional, e é a Seção 11 do protocolo: no momento desta
// extração `alexandria-instrument-calculators.ts` estava MODIFICADO e
// não commitado por outra sessão. Tocá-lo exigiria reconciliação de
// três vias, e o risco de apagar trabalho alheio não se justifica
// quando o conteúdo de apostila fecha sozinho. `instruments: []`.
//
// ── video: null, MEDIDO ───────────────────────────────────────
// Zero video, iframe, youtube, vimeo e mp4 no arquivo inteiro.

import type { CurriculumAula, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';

export const MODULO_13_LEAD: Record<string, string> = {
  'aula-13-01': "A resposta curta que circula é que EV/EBITDA \"é melhor para utilities porque neutraliza a estrutura de capital\". Está certa e é insuficiente, porque não explica o que acontece quando a estrutura de capital é justamente o fato mais importante da empresa — que é o caso de pelo menos três companhias deste rol na data de verificação.",
  'aula-13-02': "Um DCF padrão de empresa aberta é composto por duas partes: os fluxos do período explícito e um valor terminal que representa tudo depois. Em companhias comuns, o terminal costuma responder por mais da metade do valor — às vezes por dois terços. Em concessão com prazo definido, essa arquitetura simplesmente não se aplica, e insistir nela é o erro de valuation mais caro do setor.",
  'aula-13-03': "O critério de domínio deste bloco é cronometrado por uma razão: em situação real, ninguém tem uma semana. A diferença entre quem produz três teses defensáveis em uma hora e quem produz uma opinião em três dias não é velocidade de leitura — é ordem de leitura, e saber de antemão qual pergunta cada seção do documento responde.",
  'aula-13-04': "Existe uma frase que aparece em quase todo material de imprensa sobre operação societária e que está errada com uma frequência desconfortável: \"a empresa X comprou 68% da empresa Y e passou a controlá-la\". Comprar 68% do capital total e comprar o controle são coisas diferentes sempre que houver ação preferencial, acordo de acionistas ou limitação estatutária de voto — e há pelo menos três casos assim no rol deste módulo.",
  'aula-13-05': "Project finance não é \"financiamento de projeto\" no sentido genérico. É uma arquitetura jurídica e financeira específica em que a capacidade de pagamento está principalmente no próprio ativo, o devedor é uma sociedade criada só para isso, e o recurso aos patrocinadores é limitado ou condicionado. A pergunta que organiza a estrutura inteira não é \"qual o retorno\" — é quanto de dívida este fluxo suporta sem quebrar .",
  'aula-13-06': "O currículo lista cinco riscos específicos do setor: hidrológico, regulatório, cambial, de descasamento de indexador e operacional, mais a dimensão socioambiental e de governança. A lista está certa e está incompleta para 2026, porque omite exatamente a categoria que dominou o setor entre outubro de 2025 e julho de 2026 — risco de crédito e de estrutura de capital . Dois casos deste rol tornam a omissão impossível de sustentar.",
  'aula-13-07': "O currículo pede ficha de uma página por empresa. Dez fichas estruturalmente idênticas não ensinariam mais que seis: a partir da sexta, o que se aprende é a repetir o formato, não a lê-lo. A decisão de escopo deste módulo é seis fichas completas — uma por arquétipo de controle — mais um instrumento comparativo que cobre as quatro restantes por indicador. As seis foram escolhidas para que cada arquétipo apareça exatamente uma vez.",
  'aula-13-08': "Tudo antes desta aula foi preparação. O critério de domínio deste bloco não é saber o que é EV/EBITDA nem reconhecer um arquétipo de controle: é produzir nove itens estruturados a partir de um documento real, cronometrado . Esta aula é o instrumento que constrói exatamente essa saída, e o resto do módulo existe para alimentá-la.",
};

/** 155 blocos nas oito aulas, na ordem do documento. */
export const MODULO_13_CORPO: Record<string, AulaBloco[]> = {
  'aula-13-01': [
    { kind: 'titulo', numero: "01.1", texto: "O que cada múltiplo mede, mecanicamente" },
    { kind: 'paragrafo', html: "Um múltiplo é uma razão entre um valor e um resultado. A diferença entre EV/EBITDA e P/E não é de sofisticação — é de <b>a quem pertence</b> o numerador e o denominador de cada um." },
    { kind: 'titulo', numero: null, texto: "Enterprise Value · valor da firma" },
    { kind: 'formula', eq: "EV = Valor de mercado do capital próprio + Dívida líquida + Ajustes", desc: "Os ajustes não são detalhe: incluem participação de acionistas não controladores, obrigações de arrendamento reconhecidas em balanço, passivos atuariais, ações preferenciais resgatáveis e caixa não operacional. <b>Duas casas que calculem EV da mesma empresa com definições diferentes de ajuste produzem múltiplos que não se comparam</b> — e nenhuma das duas está errada." },
    { kind: 'titulo', numero: null, texto: "Preço sobre lucro" },
    { kind: 'formula', eq: "P/E = Preço por ação ÷ Lucro por ação", desc: "Numerador e denominador pertencem ambos ao acionista. O preço é o que o acionista paga; o lucro é o que sobra depois de o credor ser pago. Isso torna o P/E <b>diretamente sensível à alavancagem</b> — o que é uma vantagem quando se quer medir exatamente isso, e um defeito quando se quer comparar empresas com dívidas diferentes." },
    { kind: 'paragrafo', html: "O EV/EBITDA compara o valor de <em>toda</em> a firma — credor mais acionista — com um resultado que também pertence aos dois, porque o EBITDA é anterior a juros. É uma comparação internamente coerente. O P/E compara o que pertence apenas ao acionista com o que sobra apenas para o acionista, e também é internamente coerente. O erro não é usar um ou outro: é usar um deles e supor que o resultado é comparável a uma empresa com estrutura de capital diferente." },
    { kind: 'titulo', numero: "01.2", texto: "A razão específica do setor de utilities" },
    { kind: 'paragrafo', html: "Três características do setor elétrico brasileiro explicam por que o EV/EBITDA domina a conversa aqui e não em outros setores. A primeira é a intensidade de capital: uma distribuidora ou uma transmissora carrega dívida estruturalmente alta porque o ativo é longo e o fluxo é previsível — o que torna o P/E ruidoso, já que a despesa financeira consome uma parcela variável e grande do lucro. A segunda é a depreciação: ativos de rede têm vida longa e depreciação contábil pesada, que reduz o lucro sem reduzir o caixa do período. A terceira, específica do Brasil, é contábil — as normas de concessão produzem <b>receita de construção</b>, uma linha que infla receita e resultado sem margem econômica proporcional, e que precisa ser expurgada antes de qualquer comparação." },
    { kind: 'nota', tom: "neutro", label: "EV/EBITDA contra P/E — três níveis", html: "<b>Criança de 12 anos.</b> Imagine uma casa que custa um milhão e tem uma dívida de quatrocentos mil. Se você quer saber quanto vale <em>a casa</em>, precisa somar o que o dono tem com o que ele deve — isso é o valor da firma. Se você quer saber quanto vale <em>a parte do dono</em>, olha só o que sobra depois da dívida. As duas perguntas são boas; elas só não são a mesma pergunta, e misturá-las dá resposta errada.<br/><b>Executivo não técnico.</b> EV/EBITDA compara o valor total do negócio — capital próprio mais dívida líquida — com o resultado operacional antes de juros, impostos e depreciação. Isso permite comparar empresas com endividamentos diferentes na mesma régua. P/E compara o preço da ação com o lucro por ação e, portanto, já incorpora o efeito da dívida, dos impostos e de itens não recorrentes. Em utilities maduras com lucro estável e estrutura de capital comparável, o P/E acrescenta informação real sobre o retorno do acionista. Em empresas com alavancagem alta, ativos em construção ou eventos societários recentes, ele oscila por razões que não têm nada a ver com a operação.<br/><b>Especialista.</b> O par EV/EBITDA é preferido em segmentos regulados por três razões acumuladas: neutraliza estrutura de capital, neutraliza política de depreciação — que diverge entre societário e regulatório — e permite comparação com transações de controle, cujo referencial é o valor da firma. As armadilhas específicas do setor brasileiro são: receita e custo de construção reconhecidos por norma de concessão, que inflam receita sem margem econômica; ativos e passivos regulatórios, que descolam competência de caixa; arrendamentos reconhecidos em balanço, que elevam simultaneamente EBITDA e dívida e exigem base consistente dos dois lados; e equivalência patrimonial de participações relevantes, que contribui para o lucro sem transitar por EBITDA consolidado. Em grupos com segmentos de risco distinto, a comparação por múltiplo consolidado deve ceder lugar à soma das partes com alocação explícita de dívida e de custos corporativos." },
    { kind: 'titulo', numero: "01.3", texto: "Por que alavancagem infla os dois múltiplos por razões opostas" },
    { kind: 'paragrafo', html: "Este é o ponto que quase nunca é dito e que separa quem entende de quem repete. Alavancagem alta faz o P/E <em>subir</em> e o EV/EBITDA <em>subir</em>, mas por mecanismos contrários — e por isso o mesmo fato produz duas leituras que parecem confirmar uma à outra quando na verdade apontam para coisas diferentes." },
    { kind: 'tabela', linhas: [["Efeito sobre P/E","↑","A dívida gera despesa financeira, que reduz o denominador — o lucro por ação. Com o preço constante, a razão sobe. O P/E parece \"caro\" porque a empresa ganha menos por ação depois de pagar juros, não porque o mercado esteja pagando mais pelo negócio."],["Efeito sobre EV/EBITDA","↑","A dívida líquida entra no numerador — o valor da firma. Com o EBITDA constante, a razão sobe. O EV/EBITDA parece \"caro\" porque o comprador teórico teria de assumir a dívida além de pagar pelo capital próprio, não porque o resultado operacional seja fraco."]] },
    { kind: 'paragrafo', html: "A consequência prática é severa: <b>um múltiplo elevado nunca é evidência de \"caro\" antes de se saber de onde veio a elevação</b>. Um EV/EBITDA de sete vezes pode ser barato para um ativo com concessão longa, dívida já amortizada e investimento pesado já executado; e caro para um portfólio com contratos vencendo, obrigação de investimento à frente e risco de refinanciamento próximo. O número é idêntico; a leitura é oposta. É por isso que o instrumento a seguir se recusa a classificar qualquer coisa sem cruzar pelo menos dois sinais." },
    { kind: 'titulo', numero: "01.4", texto: "Quando P/E volta a ser o instrumento certo" },
    { kind: 'paragrafo', html: "Descartar o P/E é tão errado quanto usá-lo sozinho. Ele é o múltiplo adequado quando três condições se acumulam: o lucro é recorrente e normalizado, a estrutura de capital é estável e comparável entre os pares, e a política de dividendos é o eixo da tese. Uma transmissora madura, com receita anual permitida contratada, investimento já executado e distribuição previsível, é exatamente esse caso — e ali o P/E carrega informação que o EV/EBITDA descarta por construção: quanto do resultado efetivamente chega ao acionista depois de juros e impostos." },
    { kind: 'paragrafo', html: "Há ainda um caso em que o P/E é o único múltiplo possível: quando o EBITDA não é comparável. Uma companhia em reestruturação de dívida, com parte dos créditos em conversão para capital, tem uma estrutura de capital que muda <em>durante</em> o período medido. O EV do início do trimestre não descreve o EV do fim. Nesses casos, nenhum múltiplo funciona bem, e a análise correta migra para a lente de credor — capacidade de pagamento, liquidez, ordem de prioridade entre credores e acionistas — antes de qualquer discussão sobre valor do capital próprio." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto · Energy Brief", html: "Saber qual múltiplo é o normal para cada arquétipo — e qual variação está fora do padrão do setor — é conteúdo de <b>padrão de mercado</b>, não de análise individual de companhia. É exatamente o material do Energy Brief, a síntese analítica semanal cujo público nomeado inclui investidores e analistas que cobrem os setores brasileiros de utilities e energia. A capacidade construída aqui é a de reconhecer, em segundos, quando um múltiplo divulgado está descrevendo a operação e quando está descrevendo o balanço." },
  ],
  'aula-13-02': [
    { kind: 'titulo', numero: "02.1", texto: "A pergunta decisiva" },
    { kind: 'paragrafo', html: "A Lei nº 8.987, de 1995, estrutura a prestação do serviço público por prazo e condições definidos. Investimentos são remunerados e amortizados ao longo do contrato, sujeitos à disciplina setorial. Em valuation, isso significa que existe uma data, escrita em contrato, a partir da qual a empresa <b>não tem mais direito</b> ao fluxo de caixa daquele ativo — a menos que algo específico e verificável diga o contrário." },
    { kind: 'nota', tom: "gold", label: "A pergunta decisiva de qualquer DCF de concessão", html: "Qual fluxo de caixa <b>legalmente pertence</b> à empresa depois do último ano modelado? Se a resposta não estiver documentada — em cláusula contratual, em norma vigente, em decisão do regulador ou em prorrogação já formalizada —, não há justificativa para valor terminal cheio. Renovação é <em>cenário</em> até virar <em>direito comprovável</em>, e a diferença entre as duas coisas vale bilhões numa planilha." },
    { kind: 'paragrafo', html: "Existe um caso real e recente que torna a distinção concreta. Uma distribuidora do Rio de Janeiro chegou a 2026 com a concessão vencendo em junho daquele ano, em meio a um processo de recuperação judicial iniciado em 2023. Em dezembro de 2025, a diretoria do regulador recomendou ao ministério a prorrogação por mais trinta anos, com contrapartida de investimento da ordem de R$ 10 bilhões até 2030, cobrindo trinta e um municípios e mais de quatro milhões de unidades consumidoras. Antes dessa recomendação, o horizonte contratual do DCF era de meses. Depois, de três décadas. <b>O ativo físico não mudou. O direito econômico mudou.</b> Quem tivesse modelado perpetuidade \"porque concessões sempre são renovadas\" acertaria por sorte, e teria errado o processo — que é o que se repete na próxima empresa." },
    { kind: 'titulo', numero: "02.2", texto: "A estrutura correta do modelo" },
    { kind: 'paragrafo', html: "Um DCF de concessão bem construído separa cinco componentes que o modelo perpétuo funde em um só. Cada um tem uma fonte documental distinta, e cada um deve ser rastreável." },
    { kind: 'tabela', linhas: [["Componente","O que é","Onde se documenta","Erro típico"],["Fluxo até o termo","Caixa livre para a firma ano a ano até a data de vencimento da outorga","Contrato de concessão; ciclo de revisão tarifária; plano de investimento divulgado","Projetar crescimento indefinido de mercado sem checar o ciclo de revisão que recalibra a receita"],["Investimento obrigatório","Aporte exigido por contrato ou por meta de qualidade, independente de retorno","Contrato; plano de desenvolvimento da distribuição; condicionantes da prorrogação","Tratar todo investimento como discricionário e cortá-lo no cenário adverso"],["Ativos reversíveis","Bens que retornam ao poder concedente ao fim do contrato","Contrato; base de remuneração regulatória; laudo de avaliação","Contabilizar o valor do ativo no terminal quando ele reverte sem contrapartida integral"],["Indenização","Valor devido pelos investimentos não amortizados ao fim da concessão","Norma setorial; contrato; precedentes de cálculo do regulador","Usar o valor cheio, sem probabilidade e sem desconto pelo tempo até o recebimento efetivo"],["Prorrogação","Direito ou expectativa de continuar operando depois do termo","Norma; decisão do regulador; contrato aditado e assinado","Tratar expectativa como direito — o erro que a distribuidora do exemplo acima torna concreto"]] },
    { kind: 'titulo', numero: "02.3", texto: "A taxa de desconto: onde a Selic corrente entra, e onde não entra" },
    { kind: 'paragrafo', html: "O currículo afirma que o WACC do setor brasileiro é \"tipicamente 8-12% real\". A verificação em fonte primária revelou algo mais interessante que uma defasagem: <b>esse intervalo não é uma faixa de custos de capital de empresas diferentes</b>. Ele é, com precisão quase exata, o mesmo número regulatório expresso duas vezes." },
    { kind: 'tabela', linhas: [["Taxa Regulatória de Remuneração do Capital — 2026","Distribuição","Transmissão e geração"],["Real, depois de impostos","8,10%","8,00%"],["Real, antes de impostos","12,28%","12,11%"]] },
    { kind: 'paragrafo', html: "<b>Fonte primária:</b> ANEEL, Despacho nº 1.567/2026, publicado no Diário Oficial da União em 4 de março de 2026, aplicável aos processos de revisão tarifária a partir de 1º de março de 2026; parâmetros referenciados no Submódulo 2.4 dos Procedimentos de Regulação Tarifária. A variação declarada sobre o ano anterior foi de +0,07 ponto percentual na distribuição e +0,11 ponto na transmissão e geração. Consulta em 2 de agosto de 2026." },
    { kind: 'paragrafo', html: "Isso transforma a \"faixa 8-12%\" de um intervalo de incerteza em uma <b>pergunta de definição</b>. Quando alguém disser \"o WACC do setor é 10%\", a resposta correta não é concordar nem discordar: é perguntar <em>antes ou depois de impostos, e de que segmento</em>. Os dois números descrevem o mesmo capital; a diferença de mais de quatro pontos percentuais é inteiramente carga tributária." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "A Taxa Regulatória de Remuneração do Capital é <b>atualizada anualmente</b> pela ANEEL e vale por um ciclo de doze meses a partir de 1º de março. A taxa Selic estava em <b>14,25% ao ano</b> em 2 de agosto de 2026, definida na reunião do Comitê de Política Monetária de 17 de junho de 2026, com a reunião seguinte marcada para 4 e 5 de agosto de 2026 — ou seja, <b>dois e três dias depois da data de verificação deste módulo</b>. O boletim de expectativas do Banco Central apontava, em julho de 2026, Selic de 14,00% e inflação medida pelo índice oficial de 5,16% para o fim de 2026. Nenhum desses valores é constante; todos são entradas editáveis nos instrumentos deste módulo, e nenhum deles está cravado em código." },
    { kind: 'titulo', numero: "02.4", texto: "WACC corporativo não é WACC regulatório" },
    { kind: 'paragrafo', html: "São duas taxas com finalidades diferentes, e confundi-las é um dos erros mais comuns de quem vem de finanças corporativas para o setor elétrico. O WACC regulatório é um <b>parâmetro administrativo</b>: o regulador o define para calcular quanto do investimento reconhecido entra na tarifa. O WACC corporativo é uma <b>estimativa do analista</b>: quanto custa, para aquela empresa específica, o capital que ela usa. O primeiro entra no cálculo da receita; o segundo, no cálculo do valor." },
    { kind: 'titulo', numero: null, texto: "Custo médio ponderado de capital" },
    { kind: 'formula', eq: "WACC = [E ÷ (D+E)] × Ke + [D ÷ (D+E)] × Kd × (1 − t)", desc: "Use pesos a valor de mercado, ou uma estrutura-alvo justificável e declarada. O custo da dívida deve refletir moeda, prazo e risco efetivos da companhia — não uma média setorial. O benefício fiscal da dívida só existe se houver <b>lucro tributável</b> para absorvê-lo, o que não é automático em empresa com prejuízo acumulado." },
    { kind: 'titulo', numero: null, texto: "Custo do capital próprio" },
    { kind: 'formula', eq: "Ke = Rf + β × Prêmio de risco de mercado + Prêmio-país + ajustes justificáveis", desc: "O erro mais comum aqui é a <b>soma de prêmios sobrepostos</b>: beta setorial, prêmio de mercado e prêmio-país já capturam parcelas correlacionadas do mesmo risco. Adicionar um \"prêmio de risco regulatório\" por cima, sem demonstrar que ele não está já embutido nos outros três, é aumentar a taxa por conforto, não por método." },
    { kind: 'titulo', numero: null, texto: "Conversão entre taxa nominal e taxa real" },
    { kind: 'formula', eq: "(1 + nominal) = (1 + real) × (1 + inflação)", desc: "Com Selic nominal de 14,25% ao ano e inflação projetada de 5,16%, a taxa real implícita é de aproximadamente <b>8,7% ao ano</b> — não 9,09%, que é a subtração simples. Em patamares altos de juros e inflação, a diferença entre a relação multiplicativa e a subtração passa de meio ponto percentual, e propagada por vinte anos de fluxo produz um erro de valor de dois dígitos percentuais." },
    { kind: 'nota', tom: "neutro", label: "DCF aplicado a concessão com prazo definido — três níveis", html: "<b>Criança de 12 anos.</b> A empresa recebeu permissão para operar um serviço durante um número de anos. Quando esse tempo acaba, ela precisa devolver. Então, ao calcular quanto a empresa vale, você só pode contar o dinheiro que ela vai ganhar até essa data — mais o que estiver escrito que ela recebe de volta no fim. Contar dinheiro depois disso é contar dinheiro que não é dela.<br/><b>Executivo não técnico.</b> O valor de uma concessionária termina no contrato, salvo se houver renovação já formalizada ou indenização com base verificável. A consequência prática é que o valor terminal — que em empresas comuns domina o modelo — aqui é pequeno e precisa ser justificado documento por documento. Um modelo com perpetuidade automática num ativo que expira está estruturalmente errado, independentemente de quão detalhadas sejam as premissas operacionais.<br/><b>Especialista.</b> Modele fluxo de caixa livre para a firma até o termo contratual, com investimento obrigatório separado do discricionário, reconhecimento regulatório do investimento no ciclo de revisão correspondente, depreciação regulatória distinta da societária, e ativos reversíveis excluídos do valor residual quando revertem sem contrapartida integral. A indenização entra como fluxo probabilístico, descontado pela taxa apropriada até a data provável de recebimento efetivo — não de apuração. Prorrogação entra como cenário com probabilidade declarada e condicionantes precificadas, incluindo obrigações de investimento associadas. A coerência nominal-real, pré e pós-impostos, e alavancada contra desalavancada precisa ser verificada em cada linha: descontar fluxo livre para a firma por custo do capital próprio, ou deduzir juros do fluxo e ainda descontá-lo pelo WACC, são duplas contagens que produzem erros de sinal contrário e não se anulam." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto · GridAlpha Research", html: "A capacidade construída aqui é a de abrir um modelo de terceiro e localizar, em minutos, se o valor terminal está justificado por direito documentado ou por expectativa. É o teste que qualquer relatório de avaliação de ativo concedido tem de passar, e é uma das perguntas mais diretas que um trabalho de diligência energética do GridAlpha Research entrega ao cliente: <b>o que exatamente sustenta o último número desta planilha?</b>" },
  ],
  'aula-13-03': [
    { kind: 'titulo', numero: "03.1", texto: "O que cada documento é, juridicamente" },
    { kind: 'paragrafo', html: "Três documentos, três naturezas diferentes, e a confusão entre elas é a origem de metade dos erros de leitura financeira do setor." },
    { kind: 'tabela', linhas: [["Documento","Natureza","Quem escreve","Como ler"],["Release de resultados","Comunicação voluntária ao mercado, em formato livre","A administração, com objetivo declarado de explicar o desempenho","Como documento informativo com incentivos . Todo número material deve ser confirmado no documento arquivado"],["Informações trimestrais e demonstrações financeiras padronizadas","Informação periódica obrigatória, revisada ou auditada por auditor independente","A companhia, sob responsabilidade legal perante a CVM","Como fonte primária de número. É aqui que a ponte entre lucro e caixa se reconstrói"],["Formulário de Referência","Informação periódica obrigatória, estruturada por norma — a Resolução CVM nº 80 é a base do regime atual","A companhia, com conteúdo definido item a item pela norma","Como mapa de risco, controle, contrato e governança . É o documento em que a lente de controle e a lente de lacuna se resolvem"]] },
    { kind: 'paragrafo', html: "O ponto operacional: <b>o release e o Formulário de Referência respondem perguntas diferentes e não se substituem</b>. O release diz o que aconteceu no trimestre. O Formulário diz quem é a empresa, quem manda nela, o que ela deve, a quem, com que garantia, e o que pode dar errado. Um analista que só lê release produz teses operacionais; um que só lê o Formulário produz teses estruturais sem calibração de momento. O critério de uma hora exige os dois." },
    { kind: 'titulo', numero: "03.2", texto: "Release em trinta minutos, na ordem certa" },
    { kind: 'titulo', numero: "03.3", texto: "A ponte que separa quem lê de quem entende" },
    { kind: 'paragrafo', html: "Existe uma única reconstrução que, feita à mão uma vez, muda permanentemente a forma como se lê qualquer release de utility: a ponte entre o resultado reconhecido e o caixa que sobrou." },
    { kind: 'titulo', numero: null, texto: "Do EBITDA ao caixa livre — aproximação de trabalho" },
    { kind: 'formula', eq: "FCF ≈ EBITDA − Δ capital de giro − Impostos pagos − Investimento", desc: "Uma companhia com EBITDA de R$ 1,0 bilhão, aumento de capital de giro de R$ 250 milhões, impostos pagos de R$ 80 milhões e investimento de R$ 500 milhões converteu <b>R$ 170 milhões</b> em caixa antes de juros — dezessete por cento do EBITDA divulgado. Não há nada de anormal nisso em uma distribuidora em ciclo pesado de investimento. O que seria anormal é alguém citar o EBITDA de R$ 1,0 bilhão como se fosse capacidade de pagar dívida e dividendo." },
    { kind: 'paragrafo', html: "É por isso que \"EBITDA é caixa\" é o primeiro item da seção de erros comuns deste módulo. O EBITDA ignora, por construção, quatro saídas obrigatórias: capital de giro, impostos, juros e investimento. Em um setor onde o investimento é a própria condição de manter a concessão, ignorar investimento não é simplificação — é omitir o custo principal do negócio." },
    { kind: 'titulo', numero: "03.4", texto: "A terceira lente: como se lê o que não está escrito" },
    { kind: 'paragrafo', html: "Aqui está a habilidade que nenhum módulo anterior treinou. Detectar lacuna não é encontrar erro — é reconhecer que uma informação <b>necessária para decidir</b> não está suficientemente aberta. O documento pode estar impecável, auditado, sem ressalva, e ainda assim deixar de fora o dado de que a sua conclusão depende." },
    { kind: 'paragrafo', html: "Lacuna tem categorias. E como categorias, elas são aprendíveis — que é exatamente o que torna a habilidade treinável em vez de intuitiva." },
    { kind: 'paragrafo', html: "As cinco categorias que o instrumento percorre — garantia não detalhada, contingência sem valor provisionado, transação com parte relacionada sem preço de referência, covenant não divulgado e plano de refinanciamento ausente — não esgotam o universo, mas cobrem a maior parte do que aparece na prática. Há uma sexta, mais sutil e específica do setor: <b>caixa restrito por sociedade de propósito específico</b>. Um grupo pode divulgar caixa consolidado robusto e ter, na holding, liquidez insuficiente para pagar a própria dívida — porque o caixa está preso em projetos cujos contratos de financiamento restringem distribuição enquanto testes de cobertura não forem cumpridos. O número consolidado está correto. A conclusão que se tira dele, não." },
    { kind: 'nota', tom: "gold", label: "Lacuna vira pergunta, não vira acusação", html: "A saída correta da lente de lacuna é sempre uma pergunta formulável — a alguém de relações com investidores, a um comitê de crédito, a uma sala de diligência. \"Não informa a composição das garantias da terceira emissão\" é uma lacuna. \"A empresa esconde as garantias\" é uma acusação sem base, e destrói a credibilidade do resto da análise. A diferença entre as duas formulações é o que separa análise publicável de opinião." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto · GridAlpha Research", html: "Um relatório que entrega três teses, três riscos e <b>três lacunas nomeadas com a pergunta correspondente</b> é qualitativamente diferente de um que entrega apenas conclusões. É o que distingue diligência de resumo — e é o formato de entrega que o GridAlpha Research adota justamente porque a lacuna declarada é o que o cliente não consegue produzir sozinho a partir do mesmo documento público." },
  ],
  'aula-13-04': [
    { kind: 'titulo', numero: "04.1", texto: "Por que as duas grandezas divergem" },
    { kind: 'paragrafo', html: "O direito societário brasileiro permite que uma companhia tenha classes de ações com direitos diferentes. A ação ordinária dá voto; a preferencial, tipicamente, dá prioridade em dividendo ou em reembolso de capital em troca de voto restrito ou nulo. A consequência aritmética é imediata: quem detém uma fatia grande do <b>capital total</b> pode ter uma fatia pequena do <b>capital votante</b>, e vice-versa." },
    { kind: 'paragrafo', html: "Sobre essa base se acumulam três mecanismos adicionais, e cada um deles pode inverter o resultado de novo. O primeiro é o <b>acordo de acionistas</b>: um contrato entre sócios que vincula o voto de todos os signatários, criando um bloco de controle que não aparece na tabela de participações. O segundo é a <b>limitação estatutária de voto</b>: uma cláusula que fixa um teto ao poder de voto de qualquer acionista, independentemente de quanto ele possua. O terceiro é a <b>regra setorial</b>: em alguns segmentos, a lei exige que o controle permaneça com determinado tipo de sócio, tornando irrelevante qualquer participação econômica em contrário." },
    { kind: 'titulo', numero: "04.2", texto: "O caso que torna a distinção inesquecível" },
    { kind: 'paragrafo', html: "Em outubro de 2025, a Âmbar Energia assinou contrato para adquirir a totalidade da participação da AXIA Energia na Eletronuclear — a operadora das usinas nucleares brasileiras. A operação envolveu <b>68% do capital total</b> e cerca de <b>35,3% do capital votante</b>, por R$ 535 milhões. O Cade aprovou sem restrições em dezembro de 2025. A estatal federal que representa a União no capital tinha direito de preferência contratual, previsto no acordo de acionistas firmado em 2022; renunciou a ele em fevereiro de 2026, e a operação foi concluída em março de 2026." },
    { kind: 'tabela', linhas: [["Participação econômica adquirida","68 % do capital total","É a fatia do resultado econômico e do patrimônio que passou a pertencer ao comprador. Em qualquer conta de valor, é este número que importa."],["Poder de voto adquirido","35,3 % do capital votante","É a fatia da capacidade de decidir. A União, por meio da estatal federal, permaneceu com cerca de 64,7% do capital votante e cerca de 32% do capital total — e segue, portanto, controlando a companhia."]] },
    { kind: 'paragrafo', html: "Quem lesse apenas a manchete concluiria que o setor nuclear brasileiro foi privatizado. Quem lesse os dois números concluiria a coisa certa: entrou um sócio privado relevante, com participação econômica majoritária e sem controle. As duas conclusões levam a teses de investimento completamente diferentes sobre qualquer empresa envolvida — e a diferença entre elas cabe em uma coluna de tabela." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Percentuais de capital total e votante conforme divulgação das companhias envolvidas e decisão do Cade de dezembro de 2025; conclusão da operação verificada em cobertura setorial de março de 2026. Estruturas societárias mudam por emissão, resgate, conversão de ações e acordo entre sócios. <b>Confirme sempre no Formulário de Referência mais recente, no item de estrutura de capital e composição societária, e nos fatos relevantes posteriores.</b> Consulta em 2 de agosto de 2026." },
    { kind: 'titulo', numero: "04.3", texto: "O segundo caso: privatização com voto limitado por desenho" },
    { kind: 'paragrafo', html: "A AXIA Energia — a companhia que resultou do rebrand anunciado em 22 de outubro de 2025, com negociação sob os novos códigos a partir de 10 de novembro daquele ano — é o exemplo do mecanismo de limitação estatutária. Após a capitalização e privatização de 2022, a União manteve participação relevante no capital total, mas os direitos de voto de qualquer acionista ficaram estatutariamente limitados a um teto — um desenho adotado precisamente para impedir recaptura de controle pelo Estado." },
    { kind: 'paragrafo', html: "O que aconteceu depois é a parte instrutiva. A limitação de voto não encerrou a disputa sobre influência: ela a deslocou para outro foro. Um termo de conciliação entre a União e a companhia, homologado pelo Supremo Tribunal Federal ao fim de 2025, ampliou o conselho de administração de sete para dez membros, com três indicações adicionais da União, e desobrigou a companhia de novos aportes na terceira usina nuclear. Ou seja: <b>a influência estatal foi restaurada parcialmente por via judicial e contratual, não por via de voto em assembleia</b>. Nenhum percentual de participação capturava isso." },
    { kind: 'nota', tom: "gold", label: "A lição estrutural", html: "Poder de decisão em companhia brasileira mora em <b>quatro lugares simultâneos</b>: a tabela de capital votante, o acordo de acionistas, o estatuto social e — cada vez mais — decisões judiciais e termos de conciliação. Um battlecard que preencha o campo \"Controlador\" olhando apenas o primeiro dos quatro está incompleto por construção, e a incompletude só aparece exatamente quando importa: numa crise." },
    { kind: 'titulo', numero: "04.4", texto: "Quando a listagem acaba: a Neoenergia como caso didático" },
    { kind: 'paragrafo', html: "O rol do currículo trata dividend yield e valor de mercado como indicadores padrão de toda empresa da lista. A Neoenergia mostra por que essa é uma generalização e não uma regra." },
    { kind: 'paragrafo', html: "A controladora espanhola comprou, em setembro de 2025, a fatia detida por um fundo de pensão brasileiro, elevando sua posição para pouco mais de quatro quintos do capital. Lançou em seguida oferta pública de aquisição das ações remanescentes, com leilão em 9 de abril de 2026 e liquidação em 24 de abril. Com o capital em circulação abaixo do limite regulamentar, convocou assembleia, realizada em 4 de maio de 2026, que aprovou o <b>resgate compulsório</b> das 24.255.394 ações ainda em circulação a R$ 34,02 por ação — preço do leilão corrigido pela Selic acumulada até a data do depósito —, com pagamento em 15 de maio de 2026. A companhia saiu do segmento especial de listagem e migrou de categoria de emissor." },
    { kind: 'tabela', linhas: [["Indicador","Companhia aberta","Companhia de capital fechado com dívida pública"],["Valor de mercado","Observável a cada pregão","Não existe. Só há valor por avaliação ou por transação"],["Dividend yield","Calculável: provento por ação sobre preço","Não existe — não há preço de mercado no denominador"],["EV/EBITDA","Calculável","Não calculável a mercado; só por avaliação"],["Dívida líquida / EBITDA","Calculável","Continua calculável e continua sendo o indicador central"],["Cobertura de juros, cronograma, covenants","Divulgados","Continuam divulgados enquanto houver registro de emissor para dívida"],["Formulário de Referência","Completo","Escopo reduzido conforme a categoria de registro, mas ainda existe"]] },
    { kind: 'paragrafo', html: "A conclusão prática é que o fechamento de capital <b>não encerra a análise</b> — muda a lente. Uma companhia que mantém registro de emissor para continuar emitindo debênture segue divulgando demonstrações, cronograma de dívida e fatores de risco. O que desaparece é a metade do battlecard que depende de preço de ação. O que permanece é a metade que depende de capacidade de pagamento. E para um comprador industrial de energia que assina um contrato de quinze anos com essa companhia, a segunda metade sempre importou mais que a primeira." },
    { kind: 'nota', tom: "neutro", label: "Participação econômica contra poder de voto — três níveis", html: "<b>Criança de 12 anos.</b> Imagine um clube em que algumas pessoas têm o direito de receber uma parte maior do dinheiro, e outras têm o direito de levantar a mão para votar. Dá para ter muito do dinheiro e pouco do voto — e quem decide o que o clube vai fazer é quem tem o voto, não quem tem o dinheiro.<br/><b>Executivo não técnico.</b> Participação econômica define quanto do resultado pertence ao sócio. Poder de voto define quem decide. As duas divergem quando existem ações sem direito de voto, acordos entre acionistas, limitação estatutária ou exigência legal de que o controle permaneça com determinado tipo de sócio. Ao avaliar governança, a pergunta relevante é sempre a segunda — porque é ela que determina o que a empresa fará numa decisão difícil.<br/><b>Especialista.</b> Verifique, nessa ordem: composição por classe de ação no Formulário de Referência; existência, partes e vigência de acordo de acionistas arquivado na companhia; cláusulas estatutárias de limitação de voto, de poison pill e de quórum qualificado; regra setorial de controle obrigatório quando aplicável; e decisões judiciais ou termos de conciliação que alterem composição de conselho ou obrigações societárias. A soma dos cinco é o mapa real de controle. Nenhum deles isolado é suficiente, e a tabela de participação — que é o único dos cinco que costuma ser citado — é o menos informativo quando há divergência entre as classes." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto · GridAlpha Research", html: "O campo \"Controlador\" é o primeiro de qualquer battlecard sério, e é onde a maior parte dos materiais de mercado erra por simplificação. Preenchê-lo corretamente — com a ressalva de participação contra voto quando as duas divergem, e com a data de verificação — é uma das entregas mais concretas de um trabalho de diligência do GridAlpha Research, porque é a informação que determina como todas as outras devem ser lidas." },
  ],
  'aula-13-05': [
    { kind: 'titulo', numero: "05.1", texto: "Por que a sociedade de propósito específico existe" },
    { kind: 'paragrafo', html: "A sociedade de propósito específico — SPE — isola ativos, contratos, contas bancárias e dívida de um projeto do resto do grupo. O credor que financia essa SPE analisa o projeto, não a controladora: contratos de construção, de operação e manutenção, de venda de energia, seguros, ordem de uso do caixa e cenários de estresse, com granularidade que uma análise corporativa jamais atinge." },
    { kind: 'paragrafo', html: "O isolamento é jurídico e econômico, mas <b>não é absoluto</b>, e a leitura ingênua desse ponto produz erro nas duas direções. De um lado, garantias dos patrocinadores, obrigações de conclusão de obra, contratos com partes relacionadas e cláusulas de inadimplemento cruzado podem reintroduzir risco corporativo em uma estrutura que parecia isolada. De outro — e este é o erro mais frequente na análise de holding —, o caixa que existe dentro de uma SPE frequentemente <b>não está livre</b> para pagar dívida da controladora, porque os contratos de financiamento restringem distribuição enquanto testes de cobertura não forem cumpridos." },
    { kind: 'nota', tom: "gold", label: "A consequência para leitura de balanço consolidado", html: "Caixa consolidado não é caixa disponível. Um grupo pode divulgar posição de liquidez robusta e ter, na holding, recursos insuficientes para o próprio vencimento — porque a maior parte do caixa está retida em projetos sob bloqueio de distribuição. A pergunta correta, e ela é uma lacuna clássica: <b>quanto do caixa consolidado é livre para transitar até a holding, e sob que condições?</b>" },
    { kind: 'titulo', numero: "05.2", texto: "Setenta por trinta é heurística, não regra" },
    { kind: 'paragrafo', html: "O currículo descreve a estrutura típica como 70% de dívida e 30% de capital próprio. É uma referência útil e um ponto de partida ruim se tratada como regra, porque a capacidade de dívida não é uma proporção arbitrária — é uma <b>saída de cálculo</b>. Ela depende da previsibilidade do caixa disponível para o serviço da dívida, do prazo do contrato de receita, do risco de construção, dos indexadores, da cobertura mínima exigida, das reservas e da vida útil do ativo." },
    { kind: 'paragrafo', html: "Projetos com receita contratada de longo prazo e risco de construção baixo suportam alavancagem acima da referência. Projetos expostos a preço de mercado, ou sujeitos a cortes de geração relevantes — fenômeno que se tornou material no sistema brasileiro nos últimos ciclos — suportam bem menos. A referência de 70/30 descreve a média de um universo, e nenhum projeto é a média do universo." },
    { kind: 'titulo', numero: "05.3", texto: "Fontes e usos: o teste de sanidade" },
    { kind: 'tabela', linhas: [["Usos","R$ mi","Fontes","R$ mi"],["Construção e equipamentos","1.650","Dívida sênior","1.470"],["Conexão e obras associadas","180","Capital próprio dos patrocinadores","630"],["Desenvolvimento e licenças","70","—","—"],["Juros durante a construção","110","—","—"],["Contingência","60","—","—"],["Conta-reserva e custos de fechamento","30","—","—"],["Total","2.100","Total","2.100"]] },
    { kind: 'paragrafo', html: "Exemplo hipotético de projeto de 300 MW. O modelo só fecha quando fontes igualam usos, o cronograma de desembolso respeita o cronograma físico da obra, os <b>juros durante a construção estão financiados</b> — porque o projeto não gera caixa antes de operar — e a contingência não está sendo usada para disfarçar orçamento subestimado. Um modelo em que a contingência é o item de ajuste que faz a conta fechar é um modelo sem contingência." },
    { kind: 'titulo', numero: "05.4", texto: "DSCR e as duas coberturas que ele não substitui" },
    { kind: 'titulo', numero: null, texto: "Índice de cobertura do serviço da dívida — por período" },
    { kind: 'formula', eq: "DSCR = CFADS ÷ Serviço da dívida no período", desc: "CFADS é o caixa disponível para o serviço da dívida, e sua <b>definição está no contrato</b>, não no manual. Tipicamente deduz custos operacionais, impostos pagos, variação de capital de giro e investimento de manutenção necessário <em>antes</em> de chegar ao credor. O serviço inclui juros, principal e, conforme a documentação, taxas e liquidação de instrumentos de proteção." },
    { kind: 'titulo', numero: null, texto: "Cobertura pela vida da dívida e pela vida do projeto" },
    { kind: 'formula', eq: "LLCR = VP do CFADS até o vencimento ÷ Saldo da dívida PLCR = VP do CFADS até o fim do projeto ÷ Saldo da dívida", desc: "O DSCR mede um período; a cobertura pela vida da dívida mede o conjunto até o vencimento; a cobertura pela vida do projeto captura a <b>cauda</b> — o caixa que existe depois de a dívida terminar. Uma diferença grande entre as duas últimas sinaliza capacidade de refinanciamento, mas <b>não é garantia</b>: mercado de capitais aberto hoje não é mercado aberto no vencimento." },
    { kind: 'nota', tom: "neutro", label: "O erro clássico, e ele é frequente", html: "Calcular DSCR com EBITDA. O EBITDA ignora impostos pagos, capital de giro e investimento de manutenção — três saídas que, em qualquer estrutura de project finance, são <b>prioritárias em relação ao credor</b> na ordem contratual de uso do caixa. Um DSCR calculado com EBITDA superestima sistematicamente a cobertura, e o erro aparece exatamente no cenário em que ele importa: o adverso." },
    { kind: 'titulo', numero: "05.5", texto: "As fontes de financiamento e o que cada uma cobra em troca" },
    { kind: 'tabela', linhas: [["Fonte","Vantagem","O que cobra em troca","Documento central"],["Banco de desenvolvimento","Prazo longo e familiaridade setorial","Elegibilidade, processo, garantias e conformidade com políticas socioambientais","Contrato de financiamento e condições da linha"],["Bancos comerciais locais","Flexibilidade e financiamento-ponte","Prazo menor e repactuação de custo","Termo de condições e contrato"],["Debênture incentivada — Lei nº 12.431/2011","Benefício tributário ao investidor , o que amplia a base compradora","Enquadramento como projeto prioritário, destinação vinculada dos recursos e obrigações de acompanhamento","Escritura de emissão e ato de enquadramento"],["Debênture de infraestrutura — Lei nº 14.801/2024","Benefício tributário concentrado no emissor","Regras próprias de enquadramento; exige comparação caso a caso com o regime anterior","Escritura e enquadramento do projeto prioritário"],["Título de dívida no mercado internacional","Escala e prazo","Exposição cambial, custo de proteção, exigência de divulgação e covenants em padrão internacional","Memorando de oferta e contrato de emissão"],["Capital próprio","Absorve risco e não tem serviço fixo","Custo mais alto e diluição","Acordo de acionistas"]] },
    { kind: 'paragrafo', html: "A escolha entre os dois regimes de debênture incentivada não é automática. O regime de 2011 concentra o benefício no investidor, o que reduz a taxa exigida pelo mercado; o regime de 2024 concentra o benefício no emissor, o que reduz o custo depois de imposto. Qual dos dois produz o menor custo total depende do perfil tributário do emissor, da base de investidores acessível e do prazo — e é uma conta a fazer, não uma preferência a declarar. <b>Um decreto disciplina os critérios de enquadramento de projeto prioritário; verifique a versão vigente na data da operação</b>, porque enquadramento é o requisito de que todo o resto depende." },
    { kind: 'nota', tom: "neutro", label: "Índice de cobertura do serviço da dívida — três níveis", html: "<b>Criança de 12 anos.</b> Mostra quantas vezes o dinheiro que o projeto ganha dá para pagar a parcela daquele ano. Se der uma vez e um quarto, sobra um pouco. Se der menos de uma vez, não dá para pagar — e aí alguém precisa colocar dinheiro novo ou renegociar.<br/><b>Executivo não técnico.</b> Divide o caixa disponível pela soma de juros e principal do período. Abaixo do gatilho de bloqueio, os dividendos ficam retidos; abaixo do mínimo contratual, há inadimplemento técnico, que pode exigir dispensa formal do credor, aporte de capital ou renegociação. O número não é uma nota de qualidade: é um limite operacional com consequência contratual imediata.<br/><b>Especialista.</b> Use o caixa disponível conforme definido no contrato — não EBITDA —, por período, e teste histórico e prospectivo. Credores modelam cenários de geração em percentis de excedência, estresse de preço, atraso de obra e custo acima do orçado, com correlação entre variáveis. A amortização esculpida ajusta o principal para manter uma cobertura alvo, o que transfere risco de refinanciamento para o fim do prazo se houver saldo residual relevante. Verifique se a definição contratual de caixa disponível permite exclusões oportunistas, se o teste de bloqueio é histórico, prospectivo ou ambos, e se há mecanismo de amortização acelerada por excesso de caixa — que protege o credor e reduz o retorno do capital próprio." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto · GridAlpha Research", html: "Montar fontes e usos, calcular cobertura sob cenário adverso e nomear as garantias que efetivamente protegem o credor é o núcleo de qualquer trabalho de diligência sobre financiamento de projeto energético — e é uma das linhas de entrega nomeadas do GridAlpha Research. O que o produto entrega não é o número: é a <b>rastreabilidade da premissa</b>, que é o que permite ao cliente refazer a conta com os próprios dados." },
  ],
  'aula-13-06': [
    { kind: 'titulo', numero: "06.1", texto: "A matriz, com o mesmo risco visto de dois lugares" },
    { kind: 'paragrafo', html: "Um mesmo risco se manifesta de forma diferente conforme o objeto seja uma companhia aberta ou uma sociedade de projeto isolada. A geração abaixo do previsto, numa geradora diversificada, é uma variação de resultado; na sociedade de projeto financiada com cobertura apertada, é um gatilho de bloqueio de dividendo. O instrumento abaixo percorre as oito categorias nas duas lentes." },
    { kind: 'titulo', numero: "06.2", texto: "A sexta categoria: o caso da reestruturação de dívida" },
    { kind: 'paragrafo', html: "Risco de crédito não é a probabilidade de a empresa ir mal. É a probabilidade de que ela não consiga <b>honrar obrigações no vencimento</b> — o que pode acontecer com uma companhia operacionalmente sólida se o desenho da dívida colidir com a geração de caixa. Foi exatamente isso que o setor brasileiro observou em 2026." },
    { kind: 'paragrafo', html: "A Raízen — sociedade constituída como associação entre dois grupos de referência — ajuizou pedido de recuperação extrajudicial em março de 2026, com dívida financeira quirografária sujeita de aproximadamente R$ 65,1 bilhões. O plano foi protocolado em 6 de junho de 2026 com 75,45% de adesão dos credores e <b>homologado em 30 de julho de 2026</b> pela 3ª Vara de Falências e Recuperações Judiciais de São Paulo, com adesão final de 81,6% dos créditos quirografários sujeitos e nenhuma impugnação apresentada. O reperfilamento efetivo alcança cerca de R$ 61,4 bilhões e, pela lei de recuperação e falências, passa a <b>vincular a totalidade dos credores sujeitos</b>, inclusive os que não aderiram. A companhia listou ainda cerca de R$ 33,5 bilhões em obrigações entre empresas do próprio grupo, subordinadas às dívidas financeiras externas na ordem de pagamento." },
    { kind: 'tabela', linhas: [["Instituto","Recuperação judicial","Recuperação extrajudicial"],["Como começa","Pedido em juízo, com deferimento e suspensão de execuções por prazo determinado","Negociação prévia com credores; o plano chega ao juízo já com adesão relevante"],["Quem participa","Todas as classes de credores sujeitas, com assembleia geral","Apenas as espécies de crédito abrangidas pelo plano, definidas pelo próprio plano"],["Quórum","Aprovação por classe em assembleia","Adesão mínima legal, sem assembleia; a homologação estende as condições aos não aderentes"],["Velocidade típica","Meses a anos, com fase de habilitação de créditos","Mais rápida, porque a negociação já ocorreu antes do protocolo"],["Efeito sobre operação","Estigma comercial relevante; fornecedores encurtam prazo","Menos disruptivo, porque o processo é anunciado já com acordo"],["Caso no rol","A distribuidora do Rio de Janeiro, desde 2023","A associação de bioenergia e combustíveis, em 2026"]] },
    { kind: 'paragrafo', html: "A diferença entre os dois institutos não é jurídica apenas — é <b>informacional</b>. Uma recuperação extrajudicial protocolada com adesão majoritária já pré-negociada sinaliza que os credores de referência aceitaram uma solução; uma recuperação judicial pedida sem acordo prévio sinaliza o contrário. Para quem avalia contraparte de contrato de longo prazo, os dois estados implicam níveis de risco distintos, mesmo com o mesmo montante de dívida." },
    { kind: 'titulo', numero: "06.3", texto: "Estudo de caso: uma recuperação judicial de distribuidora a um passo do fim" },
    { kind: 'paragrafo', html: "O currículo cobra, em critério de prontidão separado, o domínio do caso de recuperação judicial de distribuidora de energia — causas, lições e implicações regulatórias. É um dos poucos casos brasileiros em que uma concessionária de serviço público entrou em recuperação judicial e chegou perto de sair dela com a concessão renovada. Vale como quadro de estudo, não como ficha de battlecard." },
    { kind: 'tabela', linhas: [["Mai 2023","Pedido de recuperação judicial Dívida da ordem de R$ 11 bilhões, agravada por furto de energia e inadimplência em áreas de ocupação irregular. Concessão de distribuição com vencimento previsto para 2026 — ou seja, o horizonte contratual do ativo era curto no momento da crise"],["Mai-Jun 2024","Plano aprovado e homologado Aprovação em assembleia de credores em 29 de maio de 2024, com 99,41% de votos favoráveis, e homologação judicial em 18 de junho de 2024. Parte da dívida convertida em ações; novas condições de pagamento"],["Dez 2025","Sinal do regulador A diretoria da agência recomendou ao ministério a prorrogação da concessão de distribuição por mais trinta anos — decisão que altera o horizonte de qualquer modelo de valuation do ativo, de meses para décadas"],["Jul 2026","Última obrigação cumprida Aumento de capital de R$ 1,5 bilhão homologado — acima do mínimo de R$ 1 bilhão exigido pelo plano —, com 238.473.768 novas ações a R$ 6,29 e emissão de 476,9 milhões de bônus de subscrição. Pedido formal de encerramento protocolado na 3ª Vara Empresarial da comarca da capital do Rio de Janeiro"],["02·08·2026","Estado verificado A decisão judicial sobre o encerramento formal ainda estava pendente na data de verificação deste módulo. Cumprir as obrigações do plano e ter a recuperação judicial encerrada são estados diferentes, e a distância entre eles é uma sentença"]] },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Cronologia compilada de fatos relevantes da companhia, decisões judiciais noticiadas e deliberação da agência reguladora. <b>O último item é o mais perecível de todo o módulo</b>: quem repetir \"está em recuperação judicial\" depois de eventual sentença de encerramento comete erro factual, e quem afirmar \"encerrou\" antes da sentença comete o erro simétrico. Verifique o andamento processual e os fatos relevantes da companhia antes de qualquer afirmação. Consulta em 2 de agosto de 2026." },
    { kind: 'paragrafo', html: "As três lições que o caso produz, e que se transferem para qualquer outra concessionária em dificuldade:" },
    { kind: 'lista', itens: ["<b>Risco regulatório e risco de crédito não são independentes.</b> A recuperação da companhia dependeu de o regulador decidir prorrogar a concessão — e o regulador só teria razão para prorrogar se a companhia fosse capaz de investir. Cada um dos dois era condição do outro, e um modelo que tratasse os dois riscos como variáveis separadas erraria a correlação no cenário que importa.","<b>Perda não técnica de energia é um risco de crédito disfarçado de risco operacional.</b> Energia distribuída e não faturada aparece como perda no indicador operacional, mas o efeito financeiro é idêntico ao de inadimplência: caixa que não entra contra custo que já foi pago. Em área de concessão com alta perda não técnica, os dois riscos são a mesma coisa medida de dois jeitos.","<b>Conversão de dívida em capital muda a estrutura de controle sem transação de controle.</b> Quando parte da dívida vira ação, credores viram acionistas — e a tabela de controle da empresa no fim do processo pode não se parecer com a do início. É por isso que a lente de controle precisa ser <b>reverificada</b> depois de qualquer reestruturação, e não herdada da leitura anterior."] },
    { kind: 'titulo', numero: "06.4", texto: "Risco de contraparte: o que importa para quem compra energia" },
    { kind: 'paragrafo', html: "Há uma inversão de perspectiva que este módulo torna possível e que nenhum anterior permitia. Nos Módulos 09 e 10, a geradora aparecia como <em>fornecedora</em> — a contraparte de um contrato de compra de energia, avaliada por preço, prazo e flexibilidade. A partir daqui, ela também é uma <b>contraparte de risco de crédito</b>, e a avaliação muda de natureza." },
    { kind: 'paragrafo', html: "Um contrato de compra de energia de quinze anos com uma geradora não é apenas um preço travado: é uma exposição de quinze anos à capacidade daquela companhia de honrar o contrato. Se a geradora entrar em reestruturação, o comprador industrial pode enfrentar renegociação de condições, descontinuidade de fornecimento contratado, ou a necessidade de recontratar energia a preço de mercado no pior momento possível. Nenhuma cláusula de preço resolve isso sozinha — resolve-se com garantia, com estrutura de contrato e, antes de tudo, com <b>avaliação de crédito da contraparte antes de assinar</b>." },
    { kind: 'nota', tom: "gold", label: "A pergunta que muda de lado", html: "Nos módulos anteriores: <em>este contrato tem bom preço?</em> A partir daqui, e sem substituir a primeira: <em>esta contraparte estará em condições de honrar este contrato no ano dez?</em> As duas perguntas se respondem com documentos diferentes — a primeira com a proposta comercial, a segunda com o Formulário de Referência e o cronograma de dívida da contraparte." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto · GridAlpha Research", html: "Avaliar a saúde de crédito de fornecedores e contrapartes é uma linha de entrega distinta da análise de custo de energia, e é frequentemente a que o cliente industrial não sabe que precisa até precisar. É onde o GridAlpha Research encontra o cliente industrial que veio pela conta de luz: a mesma disciplina de leitura de Formulário de Referência responde <b>quem é seguro contratar por quinze anos</b>, que é uma pergunta de estrutura, nunca de recomendação de compra de qualquer ativo." },
  ],
  'aula-13-07': [
    { kind: 'nota', tom: "gold", label: "O campo em branco não é omissão", html: "Toda ficha abaixo tem um último campo — <b>três teses, três riscos, três lacunas</b> — que está intencionalmente vazio. Ele é o exercício, não o conteúdo. O módulo entrega a estrutura verificável; a peça analítica é sua, e o Andaime da Aula 08 é o instrumento que a constrói. Uma ficha que já viesse com as nove conclusões prontas seria um relatório de corretora com outro nome — e ensinaria a copiar, não a produzir." },
    { kind: 'titulo', numero: null, texto: "AXIA Energia AXIA3 · AXIA5 · AXIA6 · Arquétipo · estatal com voto limitado" },
    { kind: 'tabela', linhas: [["Controlador","Companhia sem controlador único desde a capitalização e privatização de 2022. A União mantém participação relevante no capital total, com direitos de voto estatutariamente limitados a um teto , mecanismo desenhado para impedir recaptura de controle. Termo de conciliação homologado pelo Supremo Tribunal Federal ao fim de 2025 ampliou o conselho de administração de sete para dez membros, com três indicações da União. Participação econômica ≠ poder de voto ≠ assentos de conselho. Neste caso, as três grandezas divergem, e as três importam. Verificar no Formulário de Referência e no estatuto vigente."],["Segmento e geografia","Geração e transmissão em escala nacional. Cerca de 44,0 GW de capacidade instalada e cerca de 74,8 mil km de linhas de transmissão, com atuação nos quatro submercados. Base declarada 1T26. Parcela relevante da matriz de geração nacional e da rede básica."],["Estrutura de capital","Dívida líquida ajustada de aproximadamente R$ 46,0 bi no 1T26, praticamente estável contra o trimestre anterior. Alavancagem divulgada de 1,8× por EBITDA regulatório ajustado e cerca de 1,9× por EBITDA societário dos últimos doze meses. Prazo médio superior a quatro anos e meio; custo médio referenciado ao CDI. 1T26 · release de resultados e material de relações com investidores · reconstruir no ITR antes de uso externo. Os dois números de alavancagem estão corretos e medem coisas diferentes."],["Indicadores-chave","EBITDA ajustado IFRS de cerca de R$ 8,5 bi e EBITDA regulatório ajustado de cerca de R$ 8,6 bi no 1T26; EBITDA IFRS reportado sem ajustes de cerca de R$ 6,8 bi. Lucro líquido de cerca de R$ 2,6 bi; lucro ajustado divulgado entre R$ 3,2 bi e R$ 3,7 bi conforme o critério. Investimento no trimestre de cerca de R$ 1,4 bi. 1T26 · a dispersão entre rótulos é o próprio conteúdo desta linha, não um erro de compilação. Sempre declare qual rótulo está sendo citado."],["Evento estrutural mais recente","Rebrand de Eletrobras para AXIA Energia anunciado em 22 de outubro de 2025 , com negociação sob os novos códigos a partir de 10 de novembro de 2025 — mudança de nome e identidade, não de compromissos contratuais ou regulatórios. Alienação da participação na operadora nuclear (68% do capital total, cerca de 35,3% do votante, R$ 535 milhões): contrato em outubro de 2025, aprovação do Cade em dezembro, renúncia ao direito de preferência pela estatal federal em fevereiro de 2026, conclusão em março de 2026 . A União segue controlando a operadora nuclear com cerca de 64,7% do capital votante. Verificado em 02·08·2026. Este é o caso didático central do módulo sobre participação contra voto."],["3 teses · 3 riscos · 3 lacunas","Campo reservado ao exercício. Produza as nove a partir desta ficha, com âncora e contraponto, usando o Andaime da Aula 08. Cronometre uma hora."]] },
    { kind: 'titulo', numero: null, texto: "Cemig CMIG3 · CMIG4 · Arquétipo · estatal subnacional" },
    { kind: 'tabela', linhas: [["Controlador","Controlada pelo Governo do Estado de Minas Gerais , com capital dividido entre ações ordinárias e preferenciais. O controle estadual é exercido pelo capital votante; a participação econômica do controlador no capital total é menor que sua fatia do votante. Caso em que a divergência entre as duas grandezas favorece o controlador — o inverso do caso da operadora nuclear. Confirmar percentuais correntes no Formulário de Referência."],["Segmento e geografia","Integrada: distribuição, geração, transmissão, comercialização e distribuição de gás natural, com concentração em Minas Gerais e presença em outros estados via geração e comercialização. Estrutura de holding com subsidiárias operacionais separadas por segmento — o que torna a soma das partes obrigatória e o múltiplo consolidado enganoso."],["Estrutura de capital","Alavancagem ajustada reportada em torno de 2,3× ao fim de 2025. Perfil de dívida predominantemente doméstico e indexado a índices locais, o que reduz exposição cambial direta mas cria descasamento potencial entre indexador da receita e indexador da dívida. Exercício 2025 · demonstrações e relatório anual · reconstruir por subsidiária, porque a alavancagem da holding e a de cada operacional divergem."],["Indicadores-chave","EBITDA consolidado de cerca de R$ 1,8 bi e lucro líquido de cerca de R$ 979 mi no 1T26. Política de dividendos com histórico de distribuição relevante — variável conforme o plano de investimento e a necessidade fiscal do controlador. 1T26 · release de resultados · conferir a abertura por subsidiária antes de qualquer comparação com pares de segmento único."],["Evento estrutural mais recente","Ciclo de investimento plurianual em curso, com plano declarado para o período 2026-2030 e revisão tarifária da distribuidora como evento regulatório determinante. A hipótese de privatização circula periodicamente no debate público estadual e não estava decidida na data de verificação — tratá-la como cenário, nunca como fato. Verificado em 02·08·2026. Evento de mudança de controle em companhia estatal subnacional depende de decisão legislativa estadual, não apenas de decisão da administração."],["3 teses · 3 riscos · 3 lacunas","Campo reservado ao exercício. Atenção ao risco de governança: o arquétipo estatal subnacional tem um vetor que os demais não têm — o calendário eleitoral do controlador."]] },
    { kind: 'titulo', numero: null, texto: "ENGIE Brasil Energia EGIE3 · Arquétipo · controlador estrangeiro privado majoritário" },
    { kind: 'tabela', linhas: [["Controlador","Controlada pelo grupo francês Engie , por meio de holding brasileira. Capital composto exclusivamente por ações ordinárias, o que torna participação econômica e poder de voto coincidentes — caso em que a distinção que organiza a Aula 04 não se aplica. Que as duas grandezas coincidam é informação, não ausência de informação: significa que a estrutura de controle é lida diretamente da tabela de participação, sem camadas adicionais."],["Segmento e geografia","Geração — com predominância renovável —, transmissão e comercialização, além de participação em infraestrutura de transporte de gás. Ativos distribuídos por múltiplos submercados. Portfólio com hidrelétricas de grande porte, complexos eólicos e solares, e ativos de transmissão contratados."],["Estrutura de capital","Perfil historicamente conservador para o setor, com dívida majoritariamente doméstica e indexada a índices locais. A oferta primária de julho de 2026 alterou materialmente a estrutura : parte dos recursos captados foi declarada como destinada a fortalecer a estrutura de capital e reduzir alavancagem, além de financiar a incorporação de ativo. Qualquer múltiplo calculado com base anterior a julho de 2026 descreve um perímetro que não existe mais. Reconstruir com a base de ações posterior à oferta."],["Indicadores-chave","Receita operacional líquida de cerca de R$ 3,4 bi e EBITDA ajustado de cerca de R$ 2,2 bi no 1T26, com crescimento de dois dígitos sobre o mesmo trimestre do ano anterior; lucro líquido ajustado de cerca de R$ 789 mi. 1T26 · release de resultados · anterior à oferta e à incorporação. Não compare com trimestres posteriores sem normalizar o número de ações."],["Evento estrutural mais recente","Assembleia de 2 de julho de 2026 aprovou a aquisição de participação de 40% em usina hidrelétrica de grande porte detida pela controladora, com valor atribuído de cerca de R$ 5,7 bi; dois acionistas relevantes votaram contra. Oferta pública primária lançada em 6 de julho e encerrada em 20 de julho de 2026 : 274.082.684 ações a R$ 30,50, totalizando cerca de R$ 8,36 bi — dos quais cerca de R$ 5,74 bi subscritos pela própria controladora, integralizados com as ações da hidrelétrica em vez de dinheiro. Verificado em 02·08·2026. Aquisição de ativo do próprio controlador é transação com parte relacionada — categoria de lacuna clássica, e a razão de os dois votos contrários serem informação relevante."],["3 teses · 3 riscos · 3 lacunas","Campo reservado ao exercício. Pelo menos uma das três lacunas deveria tratar do preço de referência da transação com parte relacionada. Ela está aberta por construção."]] },
    { kind: 'titulo', numero: null, texto: "Eneva ENEV3 · Arquétipo · patrocinador financeiro sem controle majoritário clássico" },
    { kind: 'tabela', linhas: [["Controlador","Companhia sem acionista controlador majoritário . O maior acionista é um banco de investimento brasileiro , com participação relevante e influência de governança, num capital que permanece disperso entre investidores institucionais. Maior acionista não é o mesmo que controlador. A pergunta de verificação: existe acordo de acionistas arquivado que agregue votos de mais de um sócio? Confirmar no Formulário de Referência."],["Segmento e geografia","Modelo integrado de gás natural conectado a geração térmica : exploração e produção de gás em bacias terrestres, transporte dedicado e usinas termelétricas no mesmo complexo, com contratos de capacidade. Concentração nas regiões Norte e Nordeste. É o único arquétipo de negócio do rol em que a companhia é simultaneamente produtora de combustível e geradora — o que muda a natureza do risco de custo."],["Estrutura de capital","Alavancagem reportada em torno de 2,6× ao fim de 2025. Perfil de dívida com componente relevante de instrumentos de infraestrutura incentivados, associados a projetos específicos. Exercício 2025 · demonstrações e release · verificar quanto da dívida está em sociedade de projeto com restrição de distribuição contra quanto está no balanço corporativo."],["Indicadores-chave","EBITDA de cerca de R$ 1,7 bi , receita de cerca de R$ 4,7 bi, lucro líquido de cerca de R$ 523 mi e investimento de cerca de R$ 2,1 bi no 1T26. 1T26 · release de resultados · observe que o investimento no trimestre supera o EBITDA do trimestre: é uma companhia em fase de construção, e o caixa livre reflete isso."],["Evento estrutural mais recente","Ciclo de expansão com projetos contratados em construção e ampliação de complexos existentes. Sem evento de mudança de controle registrado na data de verificação. Verificado em 02·08·2026. Ausência de evento societário é, ela mesma, um dado de battlecard — significa que a leitura da estrutura de controle anterior permanece válida."],["3 teses · 3 riscos · 3 lacunas","Campo reservado ao exercício. O arquétipo de patrocinador financeiro tem um risco próprio: pressão por evento de liquidez em horizonte que pode não coincidir com o ciclo de maturação dos projetos."]] },
    { kind: 'titulo', numero: null, texto: "Equatorial Energia EQTL3 · Arquétipo · corporação sem controlador definido" },
    { kind: 'tabela', linhas: [["Controlador","Não há acionista controlador. Capital pulverizado entre investidores institucionais nacionais e estrangeiros, com apenas ações ordinárias. As decisões estratégicas são tomadas pela administração sob supervisão de um conselho eleito por esse capital disperso. O arquétipo mais raro do rol brasileiro. Sem controlador, a governança formal — estatuto, competências do conselho, quóruns qualificados — deixa de ser formalidade e passa a ser o único freio real sobre a administração."],["Segmento e geografia","Holding multi-utility : distribuição de energia em múltiplos estados, transmissão, geração renovável, saneamento básico e participações societárias relevantes. Presença concentrada nas regiões Norte, Nordeste e Sudeste. É o caso do rol em que a soma das partes deixa de ser recomendação metodológica e vira obrigação: os segmentos têm risco, intensidade de capital e regulador diferentes."],["Estrutura de capital","Dívida líquida de cerca de R$ 44,3 bi no 1T26, com alavancagem de covenant de cerca de 2,7× . Dívida distribuída entre a holding e múltiplas subsidiárias e sociedades de projeto — o que torna a pergunta sobre caixa restrito especialmente material aqui. 1T26 · release de resultados · a definição de alavancagem usada no covenant pode diferir da razão contábil simples. Verificar a definição na escritura."],["Indicadores-chave","EBITDA ajustado de cerca de R$ 2,9 bi , lucro líquido ajustado de cerca de R$ 359 mi e investimento de cerca de R$ 2,6 bi no 1T26. 1T26 · a distância entre EBITDA ajustado e lucro líquido ajustado é a pergunta central desta ficha: o que consome os outros dois bilhões e meio, e quanto disso é caixa?"],["Evento estrutural mais recente","Expansão continuada do portfólio para além da distribuição elétrica, com entrada em saneamento e participação societária relevante em companhia do setor. Integração de ativos adquiridos em ciclos anteriores em curso. Verificado em 02·08·2026. Companhia sem controlador que faz aquisições sucessivas concentra o risco de execução na administração — e a lacuna correspondente é o retorno incremental de cada aquisição, raramente divulgado de forma isolada."],["3 teses · 3 riscos · 3 lacunas","Campo reservado ao exercício. Pelo menos um dos três riscos deveria ser de execução simultânea: a companhia opera concessões em turnaround, obras de transmissão e ativos de saneamento ao mesmo tempo."]] },
    { kind: 'titulo', numero: null, texto: "Raízen RAIZ4 · Arquétipo · associação com dois controladores coordenados · caso de crédito" },
    { kind: 'tabela', linhas: [["Controlador","Associação entre um grupo brasileiro de capital aberto e uma companhia integrada global de energia , em estrutura que exige convergência entre os dois para decisões relevantes. Nenhum dos dois decide sozinho — e é exatamente esse desenho que se torna crítico quando a decisão é aportar capital novo. A homologação do plano prevê aumento de capital de R$ 3,5 bi a R$ 4 bi e conversão de parte dos créditos em títulos representativos de capital. A estrutura de controle ao fim do processo pode não ser a mesma do início — reverificar obrigatoriamente."],["Segmento e geografia","Bioenergia, açúcar, combustíveis e logística em estrutura integrada. Este módulo trata a companhia estritamente como caso financeiro e de estrutura de capital. O lado agroindustrial — cana, moagem, safra, cogeração e créditos de descarbonização — pertence integralmente ao Bloco 14 e não é desenvolvido aqui. Fronteira de escopo declarada, não omissão."],["Estrutura de capital","Dívida bruta consolidada informada no ajuizamento de aproximadamente R$ 65,1 bi em créditos sujeitos, mais cerca de R$ 33,5 bi em obrigações entre empresas do próprio grupo — subordinadas às dívidas financeiras externas na ordem de pagamento estabelecida na sentença. Reperfilamento efetivo de cerca de R$ 61,4 bi . Alavancagem reportada de cerca de 5,2× no fechamento do ano-safra 2025/26. Ano-safra 2025/26 e petições do processo · esta ficha é a única do rol em que a estrutura de capital é o objeto, e não o contexto."],["Indicadores-chave","EBITDA ajustado de cerca de R$ 2,8 bi e prejuízo de cerca de R$ 7,3 bi no quarto trimestre do ano-safra 2025/26. Múltiplo de mercado não é o instrumento aqui : numa companhia com parte da dívida em conversão para capital, a estrutura muda durante o período medido, e a análise correta migra para liquidez, ordem de prioridade entre credores e acionistas, e capacidade de pagamento. Ano-safra 2025/26 · o prejuízo contábil e a saída de caixa do período não são a mesma grandeza: efeitos de redução ao valor recuperável não consomem caixa no período em que são reconhecidos."],["Evento estrutural mais recente","Pedido de recuperação extrajudicial ajuizado em março de 2026. Plano protocolado em 6 de junho de 2026 com 75,45% de adesão. Homologado em 30 de julho de 2026 pela 3ª Vara de Falências e Recuperações Judiciais de São Paulo, com adesão final de 81,6% dos créditos quirografários sujeitos e nenhuma impugnação — o que estende as condições à totalidade dos credores sujeitos. Passos seguintes declarados: conversão de créditos em títulos representativos de capital para os credores que optarem pela modalidade correspondente, emissão de novos títulos de dívida garantidos, aumento de capital de R$ 3,5 bi a R$ 4 bi, reorganizações societárias e desinvestimentos com segregação entre distribuição de combustíveis e energia. Verificado em 02·08·2026 — três dias após a homologação. Item mais perecível deste módulo. A sentença ainda comportava recurso na data de verificação."],["3 teses · 3 riscos · 3 lacunas","Campo reservado ao exercício. Nesta ficha, a ordem se inverte: comece pelos riscos, não pelas teses. Análise de crédito precede análise de capital próprio sempre que a solvência estiver em questão."]] },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Todos os valores das seis fichas têm trimestre declarado e foram compilados de releases de resultados, materiais de relações com investidores e cobertura de imprensa financeira especializada, com data de corte em 1º de agosto de 2026 e verificação estrutural em 2 de agosto de 2026. <b>Notícia de imprensa é fonte aceitável de evento — quando algo aconteceu, quem anunciou o quê — e não é fonte aceitável de número financeiro.</b> Para número, volte sempre ao release da própria companhia, às informações trimestrais e ao Formulário de Referência arquivados na CVM. As fichas ensinam o formato e a leitura estrutural; elas não substituem a fonte primária, e nenhum valor aqui deve ser citado externamente sem reconstrução." },
    { kind: 'titulo', numero: "07.1", texto: "As quatro restantes, por indicador" },
    { kind: 'paragrafo', html: "As quatro empresas vivas que não receberam ficha completa — porque seus arquétipos de controle já estão representados — entram pelo instrumento comparativo, junto com as seis. A leitura lateral por indicador é o que uma ficha isolada não permite: mostra que o mesmo rótulo significa coisas diferentes em cada linha." },
    { kind: 'titulo', numero: "07.2", texto: "A ficha que não existe: o predecessor" },
    { kind: 'paragrafo', html: "A AES Brasil aparece no rol de onze do currículo e <b>não recebe ficha neste módulo</b>, porque não é uma companhia. A americana AES Corporation vendeu a totalidade de sua participação à Auren Energia em operação anunciada em maio de 2024, aprovada pelo Cade em julho e <b>concluída em 31 de outubro de 2024</b>, com as ações deixando de ser negociadas a partir de 1º de novembro de 2024. A incorporação de ações, por meio de holding intermediária, elevou a capacidade instalada combinada de cerca de 3,6 GW para cerca de 8,8 GW, e a integração dos ativos estava substancialmente concluída em setembro de 2025." },
    { kind: 'paragrafo', html: "O campo correto de battlecard para esse nome é <b>\"evento estrutural mais recente\" dentro da ficha da adquirente</b> — exatamente como o Módulo 06 trata fato histórico concluído. E a lição metodológica que ele carrega vale mais que a ficha que não existe:" },
    { kind: 'nota', tom: "gold", label: "Uma empresa pode desaparecer como código de negociação e continuar existindo como risco", html: "Os ativos, os contratos, a dívida e os riscos da companhia incorporada não evaporaram — eles migraram para o balanço da adquirente e continuam precisando ser rastreados ali. Comparar múltiplos anteriores e posteriores a uma combinação de negócios sem ajustar perímetro, número de ações e dívida assumida é o erro de <b>perímetro</b>, e ele produz séries históricas que parecem consistentes e não são." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto · GridAlpha Research", html: "Uma ficha de empresa com campos fixos, fonte declarada por linha e data de verificação explícita é o formato mais direto do que o GridAlpha Research entrega — e o campo deixado em branco é a parte que o cliente paga para receber preenchida com as suas premissas, não com as de quem escreveu a ficha. É a diferença entre entregar um veredito e entregar a capacidade de produzir um." },
  ],
  'aula-13-08': [
    { kind: 'titulo', numero: "08.1", texto: "O que torna uma tese defensável" },
    { kind: 'paragrafo', html: "Uma tese de investimento não é uma opinião sobre a ação. É uma afirmação sobre <b>mecanismo</b>: como o valor será criado, por qual via, em que horizonte, e o que precisa ser verdade para que funcione. Ela tem duas partes obrigatórias, e uma tese sem as duas não é publicável." },
    { kind: 'tabela', linhas: [["Parte","O que é","Formulação errada","Formulação defensável"],["Âncora","O número ou o fato específico, com fonte e data, que sustenta a afirmação","\"A empresa tem bom perfil de dívida\"","\"O prazo médio da dívida é de X anos com Y% indexado a índice de preços, contra receita majoritariamente indexada ao mesmo índice — release do trimestre Z\""],["Contraponto","O que, se fosse verdade, enfraqueceria ou derrubaria a tese","Ausente — a tese é apresentada como se não tivesse condição de falha","\"Esta tese deixa de valer se o ciclo de revisão tarifária não reconhecer o investimento executado, porque a receita deixa de acompanhar o índice\""]] },
    { kind: 'paragrafo', html: "A exigência do contraponto não é uma formalidade de prudência. É o que transforma a tese em objeto testável: uma afirmação que não pode ser derrubada por nenhuma evidência não está dizendo nada. E, na prática de trabalho, é o contraponto que define <b>o que monitorar</b> — porque monitorar tudo é impossível, e monitorar o gatilho de falha da própria tese é suficiente." },
    { kind: 'titulo', numero: "08.2", texto: "A simetria dos riscos e das lacunas" },
    { kind: 'paragrafo', html: "Riscos e lacunas seguem a mesma estrutura de duas partes, com nomes diferentes." },
    { kind: 'titulo', numero: null, texto: "Tese · âncora + contraponto" },
    { kind: 'lista', itens: ["<b>Mecanismo</b>Por qual via específica o valor é criado — não \"a empresa vai bem\"<i>Âncora: o número que sustenta. Contraponto: o que a derruba.</i>","<b>Horizonte</b>Em quanto tempo o mecanismo se realiza<i>Uma tese sem horizonte não pode ser avaliada nem abandonada.</i>","<b>Condição</b>O que precisa ser verdade e ainda não é<i>Se tudo já é verdade, o mecanismo já está no preço.</i>"] },
    { kind: 'titulo', numero: null, texto: "Risco · evento + caminho até o caixa" },
    { kind: 'lista', itens: ["<b>Evento</b>O que pode acontecer, descrito de forma observável<i>\"Regulação piorar\" não é evento; \"parâmetro X ser revisado no ciclo Y\" é.</i>","<b>Transmissão</b>Como o evento chega ao caixa da empresa<i>Sem o caminho, o risco é uma preocupação, não uma análise.</i>","<b>Mitigação e alerta</b>O que reduz o risco e qual sinal aparece antes<i>O indicador de alerta é o que torna o risco monitorável.</i>"] },
    { kind: 'titulo', numero: null, texto: "Lacuna · dado + como mudaria" },
    { kind: 'lista', itens: ["<b>Dado ausente</b>A informação necessária que não está suficientemente aberta<i>Lacuna não é erro nem irregularidade da companhia.</i>","<b>Onde procurar</b>Relações com investidores, nota explicativa, escritura, sala de diligência<i>Lacuna que não vira pergunta formulável não serve.</i>","<b>Impacto</b>Como a resposta mudaria a conclusão<i>Se a resposta não muda nada, não era lacuna — era curiosidade.</i>"] },
    { kind: 'titulo', numero: "08.3", texto: "A hora, distribuída" },
    { kind: 'tabela', linhas: [["0-5 min","Perímetro Empresa, código, data-base, trimestre, moeda, escopo de consolidação, e — obrigatoriamente — mudanças de perímetro desde o período anterior . Sem isso, toda comparação subsequente é inválida"],["5-12 min","Arquétipo e controle Qual dos seis arquétipos, e participação econômica é igual a poder de voto neste caso? Se não souber, é a primeira lacuna"],["12-25 min","Release Motores operacionais, EBITDA — com o rótulo declarado —, caixa, investimento, dívida e projeções da administração. Reconstrua a ponte do EBITDA ao caixa à mão"],["25-40 min","Formulário de Referência, por risco Fatores de risco com linguagem específica, endividamento e garantias, contratos relevantes, transações com partes relacionadas, contingências. É aqui que as lacunas aparecem"],["40-48 min","Normalização Seu próprio EBITDA, seu próprio caixa livre, sua própria alavancagem — as três com a definição que você escolheu e declarou, e a mesma para todas as empresas que pretende comparar"],["48-58 min","Três, três e três Escreva. Cada tese com âncora e contraponto; cada risco com evento, caminho até o caixa e indicador de alerta; cada lacuna com pergunta formulável e impacto na conclusão"],["58-60 min","Conclusão condicional Uma frase, em três partes: a tese funciona se…; muda se…; ainda falta confirmar… Se você não conseguir escrever as três partes, a análise não terminou"]] },
    { kind: 'titulo', numero: "08.4", texto: "A pergunta que encerra o bloco, e a resposta que o define" },
    { kind: 'paragrafo', html: "No fim de qualquer conversa em que você tenha produzido três teses, três riscos e três lacunas bem construídos, alguém vai fazer a pergunta. Ela vem em várias formas — \"então, você compraria?\", \"vale a pena?\", \"essa ação é uma boa compra?\" — e todas pedem a mesma coisa: que você troque nove itens estruturados por um veredito." },
    { kind: 'paragrafo', html: "A resposta correta <b>não é sim, não é não, e não é \"não posso responder\"</b>. É devolver a estrutura e a pergunta que falta:" },
    { kind: 'lista', itens: ["<b>A estrutura, em três fatos</b>Quem controla, qual é a alavancagem e com que desenho de dívida, e qual evento societário ou regulatório está pendente. Três frases.","<b>A condição de cada tese</b>\"A tese principal funciona se o investimento executado for reconhecido no próximo ciclo de revisão. Se não for, ela deixa de valer.\"","<b>A pergunta de volta</b>\"Em que horizonte, e com que tolerância a um evento adverso de crédito? Porque a mesma estrutura é aceitável para dez anos e desconfortável para dezoito meses.\""] },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto · GridAlpha Research", html: "O formato três-mais-três-mais-três, com âncora, contraponto e pergunta formulável em cada item, <b>é</b> o entregável. Não é uma etapa intermediária de um relatório que termina em recomendação — é o produto inteiro. Um cliente institucional que recebe nove itens rastreáveis e nenhuma recomendação recebeu exatamente o que uma camada independente pode entregar sem conflito: o material com que ele decide, não a decisão dele." },
  ],
};

/** Os catorze exercícios do § Ex — todos soltos. */
export const MODULO_13_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: "m13-ex-01",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "01 · Do EBITDA ao caixa", gabarito: "Pergunta. Uma companhia reporta EBITDA de R$ 1,0 bilhão, aumento de capital de giro de R$ 250 milhões, impostos pagos de R$ 80 milhões e investimento de R$ 500 milhões, sem outros ajustes. Estime o caixa livre antes de juros e diga o que a diferença revela. Resposta. R$ 170 milhões: 1.000 − 250 − 80 − 500. A conversão foi de dezessete por cento do EBITDA divulgado. Isso não indica problema em si — é o perfil esperado de uma distribuidora em ciclo pesado de investimento. O que a conta revela é que o EBITDA, isolado, não descreve capacidade de pagar dívida nem de distribuir dividendo, e que qualquer afirmação sobre essas duas coisas precisa passar pela demonstração de fluxo de caixa." },
  },
  {
    id: "m13-ex-02",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "02 · Valor da firma e múltiplo", gabarito: "Pergunta. Uma empresa tem capital próprio avaliado em R$ 10 bilhões, dívida líquida de R$ 5 bilhões e EBITDA de R$ 2 bilhões. Calcule o EV/EBITDA e diga o que ainda falta antes de qualquer conclusão. Resposta. Valor da firma de R$ 15 bilhões; múltiplo de 7,5×. Faltam, no mínimo: prazo remanescente de concessão ou de contratos, investimento obrigatório à frente, qualidade e definição do EBITDA usado, os ajustes de valor da firma — participação de não controladores, arrendamentos, passivos atuariais, caixa não operacional — e um conjunto de comparáveis do mesmo arquétipo e do mesmo estágio de ciclo. Sem isso, 7,5× não é caro nem barato: é apenas 7,5×." },
  },
  {
    id: "m13-ex-03",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "03 · Conversão entre taxa real e nominal", gabarito: "Pergunta. Com Selic nominal de 14,25% ao ano e inflação projetada de 5,16%, calcule a taxa real implícita corretamente e mostre o erro da subtração simples. Resposta. (1,1425 ÷ 1,0516) − 1 ≈ 8,64% ao ano. A subtração simples daria 9,09%, um erro de cerca de 0,45 ponto percentual. Parece pequeno; propagado por vinte anos de fluxo descontado, produz um erro de valor presente de dois dígitos percentuais. Em patamares altos de juros e inflação, a relação multiplicativa não é preciosismo." },
  },
  {
    id: "m13-ex-04",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "04 · Cobertura do serviço da dívida", gabarito: "Pergunta. Um projeto tem caixa disponível para o serviço da dívida de R$ 180 milhões e serviço de R$ 150 milhões no período. O covenant exige mínimo de 1,25×. Calcule e interprete. Resposta. 1,20×. Está abaixo do mínimo contratual, o que caracteriza inadimplemento técnico e pode exigir dispensa formal do credor, aporte de capital ou renegociação. Nota importante: se o cálculo tivesse sido feito com EBITDA em vez do caixa disponível definido em contrato, o índice apareceria mais alto e o problema passaria despercebido até o teste formal." },
  },
  {
    id: "m13-ex-05",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "05 · Tese sobre companhia com ciclo pesado de investimento", gabarito: "Pergunta. A partir de uma ficha de distribuidora com investimento trimestral próximo do EBITDA trimestral, produza uma tese de investimento com âncora e contraponto. Resposta de referência. Tese: o investimento executado hoje entra na base de remuneração regulatória e passa a gerar receita reconhecida a partir do próximo ciclo de revisão tarifária, convertendo um período de caixa livre negativo em um degrau de receita permanente. Âncora: valor do investimento no trimestre, abertura entre manutenção e expansão quando divulgada, e a data do próximo ciclo de revisão da concessão. Contraponto: a tese deixa de valer se o investimento não for integralmente reconhecido como prudente na revisão, ou se o ciclo de revisão for adiado — em ambos os casos, a companhia terá consumido caixa sem o degrau de receita correspondente." },
  },
  {
    id: "m13-ex-06",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "06 · Tese sobre companhia após combinação de negócios", gabarito: "Pergunta. Produza uma tese sobre uma companhia que incorporou outra e reporta alavancagem elevada, com âncora e contraponto. Resposta de referência. Tese: as sinergias declaradas na combinação se convertem em caixa ao longo do período de integração, e a desalavancagem resultante reduz a despesa financeira, que hoje consome a maior parte do resultado operacional. Âncora: alavancagem reportada e sua trajetória trimestral, valor das sinergias declaradas contra o valor efetivamente realizado quando divulgado, e o cronograma de vencimentos. Contraponto: a tese cai se as sinergias forem majoritariamente contábeis em vez de caixa, ou se a integração exigir investimento não previsto — em ambos os casos, a alavancagem não cede e a despesa financeira permanece." },
  },
  {
    id: "m13-ex-07",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "07 · Tese sobre companhia sem controlador", gabarito: "Pergunta. Produza uma tese cujo mecanismo dependa do arquétipo de controle, não da operação. Resposta de referência. Tese: a ausência de acionista controlador dá à administração liberdade para alocar capital pelo melhor retorno disponível, sem a restrição de prioridade de política pública ou de necessidade fiscal de um controlador estatal — o que, num setor em consolidação, permite capturar oportunidades que companhias controladas não podem perseguir. Âncora: composição acionária sem bloco de controle no Formulário de Referência; histórico de decisões de alocação. Contraponto: a mesma ausência de controlador remove o principal freio sobre a administração, e a tese se inverte se a companhia demonstrar retorno incremental abaixo do custo de capital em aquisições sucessivas — momento em que a liberdade vira risco de execução sem contrapeso." },
  },
  {
    id: "m13-ex-08",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "08 · O que este trecho não diz", gabarito: "Pergunta. Trecho hipotético: \"A Companhia mantém garantias reais e fidejussórias constituídas em favor de credores no âmbito de contratos de financiamento de suas controladas.\" Identifique a lacuna e formule a pergunta. Resposta. Garantia não detalhada. O trecho confirma a existência de garantias e não informa: quais ativos foram dados, em que valor, a favor de qual credor, com que gatilho de execução, e se há garantia prestada pela controladora que reintroduza risco corporativo numa estrutura que parecia isolada. Pergunta: qual o valor contábil dos ativos onerados, e quais garantias corporativas existem em favor de dívidas de controladas? Impacto: altera diretamente o ativo efetivamente livre para novos financiamentos e a exposição real da holding." },
  },
  {
    id: "m13-ex-09",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "09 · Contingência sem valor", gabarito: "Pergunta. Trecho hipotético: \"A Companhia figura como parte em processos de natureza tributária cuja perda é classificada como possível, sem provisão constituída.\" O que perguntar? Resposta. Contingência sem valor provisionado. A classificação como perda possível dispensa provisão pela norma contábil e exige divulgação do valor envolvido em nota explicativa . Se o valor não estiver na nota, é lacuna; se estiver, o exercício é comparar a magnitude com o patrimônio líquido e com a geração anual de caixa. Pergunta: qual o montante total das contingências classificadas como possíveis, por natureza, e qual a expectativa de prazo de julgamento? Impacto: uma contingência tributária relevante pode consumir anos de caixa livre e não aparece em nenhum múltiplo." },
  },
  {
    id: "m13-ex-10",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "10 · Transação com parte relacionada", gabarito: "Pergunta. Uma companhia adquire de seu próprio controlador uma participação em ativo operacional, com valor atribuído declarado. Dois acionistas relevantes votam contra na assembleia. Qual a lacuna? Resposta. Transação com parte relacionada sem preço de referência de mercado demonstrado. O valor atribuído está divulgado; o que a lacuna pede é o referencial : houve laudo de avaliação independente, qual metodologia, qual a faixa de valor produzida, e como o preço acordado se situa dentro dela. Os votos contrários não provam nada sobre o preço — mas sinalizam que a lacuna foi percebida por outros acionistas, o que a torna prioritária. Pergunta: qual laudo suportou o valor atribuído, e qual comitê independente se manifestou? Impacto: define se a transação transferiu valor entre controlador e minoritários, e em que direção." },
  },
  {
    id: "m13-ex-11",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "11 · \"A AES Brasil está entre as maiores geradoras independentes do país\"", gabarito: "Pergunta. O que mudou, desde quando, e como reverificar? Resposta. A companhia deixou de existir como emissora independente. A americana AES Corporation vendeu a totalidade de sua participação à Auren Energia; operação anunciada em maio de 2024, aprovada pelo Cade em julho e concluída em 31 de outubro de 2024 , com as ações deixando de ser negociadas a partir de 1º de novembro de 2024. A incorporação elevou a capacidade combinada da adquirente de cerca de 3,6 GW para cerca de 8,8 GW. Como reverificar: consulta ao cadastro de emissores da CVM e à lista de companhias listadas da bolsa; fatos relevantes da adquirente; e a seção de combinação de negócios nas demonstrações financeiras. Formulação correta hoje: os ativos e riscos daquela companhia estão no balanço da adquirente, e é ali que precisam ser rastreados." },
  },
  {
    id: "m13-ex-12",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "12 · \"A Neoenergia é negociada com free float de 16%\"", gabarito: "Pergunta. O que mudou, desde quando, e o que isso faz com o battlecard? Resposta. O fechamento de capital foi consumado. A controladora espanhola elevou sua posição em setembro de 2025 comprando a fatia de um fundo de pensão; a oferta pública de aquisição teve leilão em 9 de abril de 2026 e liquidação em 24 de abril; assembleia de 4 de maio de 2026 aprovou o resgate compulsório das 24.255.394 ações remanescentes a R$ 34,02, pagas em 15 de maio de 2026, com saída do segmento especial de listagem e migração de categoria de emissor. Efeito no battlecard: valor de mercado, dividend yield e EV/EBITDA a mercado deixam de existir; alavancagem, cobertura de juros, cronograma de vencimentos e covenants continuam — e a análise migra integralmente para a lente de credor. Como reverificar: cadastro de emissores da CVM, categoria de registro, e a página de relações com investidores para divulgações de dívida." },
  },
  {
    id: "m13-ex-13",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "13 · Participação de 68% sem controle", gabarito: "Pergunta. Uma companhia adquire 68% do capital total de outra e cerca de 35,3% do capital votante. Quem controla, e por quê? Resposta. Não é a adquirente. Controle é poder de voto, e a União — por meio da estatal federal que a representa — permaneceu com cerca de 64,7% do capital votante e cerca de 32% do capital total, seguindo controladora. A divergência decorre de classes de ações com direitos distintos, e o resultado é uma companhia com sócio privado economicamente majoritário e sem controle. Como verificar em qualquer caso: composição por classe de ação no Formulário de Referência, acordo de acionistas arquivado, cláusulas estatutárias de limitação de voto, e exigência setorial de controle obrigatório quando aplicável." },
  },
  {
    id: "m13-ex-14",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "14 · Caso hipotético — classifique o arquétipo", gabarito: "Pergunta. Uma geradora tem 45% do capital votante com um fundo de infraestrutura estrangeiro, 30% com um fundo de pensão nacional, e os dois assinaram acordo de acionistas que vincula o voto de ambos em matérias relevantes. Os 25% restantes estão pulverizados. Qual o arquétipo, e participação é igual a voto? Resposta. O arquétipo é joint venture coordenada — não \"patrocinador financeiro\" nem \"sem controlador\". O acordo de acionistas cria um bloco de 75% do votante que exerce controle de fato, ainda que nenhum dos dois sócios individualmente detenha maioria. A pergunta de verificação decisiva é a vigência e o escopo do acordo: quais matérias vincula, por quanto tempo, e o que acontece se um dos dois quiser sair. Sobre participação contra voto: se o capital for composto apenas por ações ordinárias, as duas grandezas coincidem para cada sócio isolado — mas a soma vinculada pelo acordo é uma terceira grandeza, e é ela que define o controle. Nenhuma tabela de participação, sozinha, mostraria isso." },
  },
];

export const MODULO_13_AULAS: CurriculumAula[] = [
  {
    id: 'aula-13-01',
    moduleId: 'modulo-13',
    number: 1,
    totalInModule: 8,
    title: "Por que EV/EBITDA e não P/E — e por que alavancagem infla os dois por razões opostas",
    subtitle: "Múltiplos",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: 'aula-13-02',
    moduleId: 'modulo-13',
    number: 2,
    totalInModule: 8,
    title: "O que acontece com um fluxo de caixa descontado quando o direito econômico tem data para acabar",
    subtitle: "DCF de concessão",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: 'aula-13-03',
    moduleId: 'modulo-13',
    number: 3,
    totalInModule: 8,
    title: "Trinta minutos no release, sessenta no Formulário de Referência, e a pergunta que só a segunda leitura permite",
    subtitle: "Leitura de documento",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: 'aula-13-04',
    moduleId: 'modulo-13',
    number: 4,
    totalInModule: 8,
    title: "Participação econômica não é poder de voto — e no Brasil elas divergem com frequência",
    subtitle: "Lente de controle",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: 'aula-13-05',
    moduleId: 'modulo-13',
    number: 5,
    totalInModule: 8,
    title: "A dívida que o projeto paga sozinho — e a métrica que decide quanto dela cabe",
    subtitle: "Project finance",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: 'aula-13-06',
    moduleId: 'modulo-13',
    number: 6,
    totalInModule: 8,
    title: "Seis categorias de risco, e a sexta é a que o currículo não nomeia",
    subtitle: "Riscos",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: 'aula-13-07',
    moduleId: 'modulo-13',
    number: 7,
    totalInModule: 8,
    title: "Seis fichas, um arquétipo cada, e um campo deixado deliberadamente em branco",
    subtitle: "Fichas de empresa",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: 'aula-13-08',
    moduleId: 'modulo-13',
    number: 8,
    totalInModule: 8,
    title: "O andaime: três teses, três riscos, três lacunas — em uma hora, com âncora e contraponto",
    subtitle: "Síntese",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
];

export const getAulaModulo13 = (id: string): CurriculumAula | undefined =>
  MODULO_13_AULAS.find((a) => a.id === id);
