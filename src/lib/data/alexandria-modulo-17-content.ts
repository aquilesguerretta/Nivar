// alexandria-modulo-17-content.ts
// Bloco 17 — Cenário Internacional Comparativo.
// Nível 3, track 'brasil'. ÚLTIMO módulo do currículo.
//
// ── CATÁLOGO CONFIRMADO ───────────────────────────────────────
//   { id: 'bloco-17', number: 17, level: 3,
//     title: 'Cenário Internacional Comparativo',
//     track: 'brasil', illustrationPrefix: null,
//     priority: 'media-alta', estimatedHours 2-3 }
//
// O título da fonte (<title> e <h1>) é literalmente 'Cenário
// Internacional Comparativo' — CONFERE com o catálogo, sem a
// divergência que os Módulos 06 e 11 tiveram. O track permanece
// 'brasil' pelo terceiro módulo seguido da Trilha 3: comparar
// jurisdições estrangeiras não muda de quem é o currículo.
//
// ── CONTEÚDO COMPARATIVO, NÃO INTEGRAÇÃO TÉCNICA ─────────────
// Este é o primeiro módulo do currículo a tratar de mercados
// organizados norte-americanos. É PROSA PEDAGÓGICA — texto
// extraído como o de qualquer outro módulo. Não há, e não deve
// haver, ligação com feed de dado, com os hooks de dado do
// terminal ou com o produto americano: a aula fala SOBRE um
// mercado, ela não LÊ um mercado.
//
// POLÍTICA DE NOMEAÇÃO DA FONTE, medida e não presumida: os nomes
// próprios dos operadores norte-americanos ocorrem UMA vez cada, e
// SOMENTE no § MAP, que é aparato. Nas ONZE aulas extraídas nenhum
// deles aparece — o texto trata por descrição funcional ("um dos
// sete operadores", "o operador que atende quase toda a carga").
// A única exceção é a China, nomeada na Aula 07, que é a aula
// sobre ela. O § 00 traz uma escada de liberação declarando o que
// pode ser citado e sob que condição.
//
// A fonte é transparente sobre o vínculo comercial. A seção
// `conf` ("Parte interessada · leia antes da Aula 05") e a própria
// Aula 05 declaram que o estudo detalhado de um dos sete
// operadores se justifica pela construção de um terminal do
// GridAlpha sobre ele, que ele recebe cerca do dobro do espaço dos
// outros seis, e que "toda afirmação desta aula sobre a riqueza
// analítica daquele mercado é feita por parte interessada". Esse
// texto foi extraído integralmente — não suavizado, não omitido.
//
// ── VOCABULÁRIO ───────────────────────────────────────────────
// Medido, não herdado (Seção 6): os oito seletores dos Módulos
// 01-03 dão ZERO. É o vocabulário dos Módulos 04-14 (`sec-id` 22,
// `lede` 21, `inst` 12, `det-bd` 28, `box` 35, `term` 192).
//
// ── CONTAGEM REAL ─────────────────────────────────────────────
// 22 seções = 11 AULAS + 11 de aparato. O aparato tem ONZE, não
// dez: além do conjunto padrão (§00 §MAP §Caso §Erros §Ex §Quiz
// §Voz §Final §Lex §Ref) existe `§Fichas · Seis jurisdições`,
// seção nova. 11 aulas é o maior número do currículo.
//
// Os três sinais concordam: §Ex anuncia "Dezoito" e há 18
// <details>; §Fichas anuncia "Sete campos, os mesmos para as
// seis" e há 42 `fi-row` (6 × 7); §Lex traz 192 termos em oito
// famílias. 122 blocos de apostila.
//
// ── SETE FAMÍLIAS DE ESTRUTURA NOVAS ──────────────────────────
// Todas divs puras, sem <p> dentro, e o extrator herdado passava
// por elas sem capturar. Achadas por FALLBACK QUE AVISA: qualquer
// div com texto não reconhecida é reportada, nunca descartada.
//
//   `ga/gak/gav`      glossário de ambiguidade (Sentido A/B/C/D)
//   `esc/esc-r/-n/-b` escada numerada
//   `p7/p7-r/-n/-k/-v` as sete declarações de perímetro
//   `tri/tg/tk/tv`    grade das três lentes
//   `grg/grg-r/-k/-v` dotação · desenho · política
//   `cn5/cn5-r/-n/-k/-v` casos numerados
//   `conf`/`glo`      declaração de parte interessada + glossário
//
// Mais `par3` (barra de proporção), `clk-r` e `fi-row`, estas duas
// já conhecidas dos Módulos 13 e 09/10.
//
// ARMADILHA DE ANINHAMENTO, e é o achado de método desta wave: as
// famílias de LINHA (`p7-r`, `cn5-r`, `esc-r`, `grg-r`) vivem
// dentro de um CONTAINER de mesmo prefixo (`p7`, `cn5`, `esc`,
// `grg`). O walker via o PAI, não o reconhecia, e pulava o filho
// inteiro — perdendo tudo. A correção é recursar no container em
// vez de descartá-lo. Sem o fallback que avisa, essa perda seria
// silenciosa: 109 blocos pareceriam um número plausível.
//
// ── COBERTURA POR PALAVRA ─────────────────────────────────────
// 99,8% a 100,0% nas ONZE aulas, agregado 99,9%, zero abaixo de
// 85%. Medida por palavra, não por trecho contíguo (Seção 5).
//
// ── EXERCÍCIO: forma própria desta fonte ──────────────────────
// Nos Módulos 04-13 o <summary> era "NN · Título" e o corpo trazia
// Enunciado + gabarito. AQUI o <summary> É O ENUNCIADO inteiro e o
// `det-bd` é o gabarito. Os 18 têm gabarito; nenhum vazio.
//
// O §Ex declara quatro categorias (cinco de perímetro, cinco de
// atribuição, quatro de pressuposto institucional, quatro de
// unidade) mas o markup NÃO marca cada exercício com a sua.
// Atribuir por posição seria inferência, não extração — então os
// 18 vão sem categoria, e a contagem fica registrada aqui.
//
// Varredura por /[Aa]ula\s*\d+/ no enunciado E no gabarito dos
// dezoito: ZERO. Todos soltos, padrão desde o Módulo 04.
//
// ── SEM GRAVURA, dois sinais concordando ──────────────────────
// `illustrationPrefix: null` no catálogo E zero <img> no markup.
// `illustrations: []` nas onze; nenhuma biblioteca de outro bloco
// foi puxada por semelhança de tema.
//
// ── video: null, MEDIDO ───────────────────────────────────────
// Zero <video>, <iframe>, youtube, vimeo, .mp4 e <audio>.

import type { CurriculumAula, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';

export const MODULO_17_LEAD: Record<string, string> = {
  'aula-17-01': "Quando alguém diz que a energia é mais barata em outro lugar, o instinto é perguntar pelo câmbio. É o instinto errado, e ele é errado com uma frequência que surpreende: na maioria esmagadora dos casos, a conversão de moeda é o menor dos sete problemas, e às vezes é o único que está correto.",
  'aula-17-02': "Suponha que as sete declarações foram feitas e a diferença permaneceu. Agora existe uma pergunta legítima: por quê? A resposta quase nunca é mérito, e o erro que gera toda recomendação ruim de importação de modelo é atribuir a diferença à parcela errada.",
  'aula-17-03': "O Módulo 04 ensinou formação de preço marginal e o Módulo 09 ensinou o despacho centralizado brasileiro. Nenhum dos dois se reabre aqui. O que é novo é que aquelas escolhas são <b>variantes de desenho</b>, que outras jurisdições fizeram de outro modo, e que cada variante entrega uma coisa e custa outra.",
  'aula-17-04': "Esta é a pior colisão semântica do currículo, e ela é de outra natureza que as demais. “Capacidade” já colidia em quatro sentidos no Módulo 16 — instalada, de armazenamento, de transporte, de processamento. Todos os quatro são <b>quantidades que se medem</b>. O quinto sentido é um <b>mecanismo de remuneração que se compra</b>, e a confusão entre ele e os outros quatro produz duas frases erradas em direções opostas.",
  'aula-17-05': "Não existe “o mercado americano”. Existe um regulador federal com jurisdição sobre o comércio atacadista interestadual e sobre tarifas de transmissão, seis operadores regionais sob essa jurisdição, um sétimo que opera quase inteiramente dentro de uma única fronteira estadual e responde à comissão de serviços públicos e à legislatura daquele estado, e um vasto território fora dos mercados organizados onde concessionárias verticalmente integradas continuam sendo a estrutura dominante.",
  'aula-17-06': "Se você quer ver a parcela de política agir sozinha, precisa de um lugar onde a dotação e o desenho fiquem parados enquanto ela se move. Existe um: os mesmos mercados organizados da aula anterior, atravessados por uma mudança de orientação da política energética federal a partir de 2025. O desenho de mercado não mudou. A dotação não mudou. <b>O custo de capital de projetos inteiros mudou.</b>",
  'aula-17-07': "O Módulo 12 já tratou a China pela ótica do poder — cadeia de suprimento, capital, disputa tecnológica entre potências. <b>Aquele argumento não se reconta aqui.</b> Nesta aula o objeto é outro: desenho de mercado e escala de sistema. Como se planeja, como se despacha, como se remunera, e o que significa, operacionalmente, ser o maior sistema do mundo em capacidade instalada.",
  'aula-17-08': "O Módulo 16 já tratou o sistema brasileiro de comércio de emissões, o escopo 2 e a régua de estágio. Nada disso se reabre. O objeto novo aqui é que existem <b>três mecanismos diferentes</b> de precificar carbono, que eles fazem coisas diferentes, e que o terceiro é o único que chega diretamente ao bolso de um exportador industrial brasileiro.",
  'aula-17-09': "“Eles têm 60% de renovável” é a segunda frase mais comum deste gênero e, como a primeira, ela não nomeia um objeto. Nomeia quatro, que diferem entre si por múltiplos, e o interlocutor escolheu — quase sempre sem má-fé e sem declarar — aquele que sustenta a sua tese.",
  'aula-17-10': "Os mercados grandes ensinam desenho. Os cinco desta aula ensinam <b>o que acontece com o desenho quando uma das condições que o sustentam falha</b> — e essa é a lição mais transferível de todas, porque no Brasil a condição que falha raramente é a mesma que falha lá.",
  'aula-17-11': "As dez aulas anteriores construíram três lentes e uma disciplina. Esta aula as põe para trabalhar contra o material que você vai efetivamente encontrar: enunciados comparativos que são <b>verdadeiros e insuficientes</b> ao mesmo tempo. Nenhum dos doze enunciados do instrumento abaixo é falso. Todos os doze levam a uma conclusão errada.",
};

/** 122 blocos nas onze aulas, na ordem do documento. */
export const MODULO_17_CORPO: Record<string, AulaBloco[]> = {
  'aula-17-01': [
    { kind: 'paragrafo', html: "O problema real é que “preço da eletricidade” não nomeia um objeto. Nomeia pelo menos seis, conforme a glosa do §00, e a frase compara dois deles sem dizer quais. Antes de comparar dois números de preço entre jurisdições, sete coisas precisam estar declaradas iguais ou ajustadas. Se qualquer uma faltar, <b>a comparação não é imprecisa — ela é inválida</b>, e a resposta correta não é estimar a diferença, é devolver a pergunta." },
    { kind: 'tabela', linhas: [["1. O que está dentro","Energia, transporte (transmissão e distribuição), encargos setoriais e tributos são quatro camadas distintas. Uma tarifa industrial cheia contém as quatro; um preço de curto prazo de atacado contém uma. <b>A razão entre as duas pode passar de três.</b> O Módulo 10 dissecou a fatura brasileira camada por camada — não a reabro aqui; o que é novo é que a mesma dissecação precisa ser feita no número estrangeiro antes de encostar um no outro."],["2. Quem é o consumidor","Residencial, comercial, industrial — e, dentro de industrial, <b>em que nível de tensão e com que fator de carga</b>. Um consumidor de alta tensão com fator de carga acima de 0,85 e um consumidor de média tensão com fator de carga de 0,45 pagam preços médios que diferem estruturalmente pela parcela de demanda, não pela energia. Comparar “a indústria” de dois países sem declarar isso é comparar dois agregados de composição diferente."],["3. Qual mercado formou","Atacadista de curto prazo, contratado bilateralmente, resultado de leilão, tarifa regulada ou preço ao consumidor final. São cinco processos de formação distintos. Um preço de curto prazo é uma distribuição, não um número: quem o cita como “o preço” escolheu, quase sempre sem declarar, uma estatística dessa distribuição."],["4. Granularidade e período","Média aritmética horária, média ponderada pela carga do sistema, média ponderada pelo perfil daquele consumidor, valor de ponta, ano civil ou ano hidrológico. <b>A média aritmética atribui o mesmo peso à madrugada e à ponta</b> — e nenhum consumidor consome desse jeito. Um sistema hidrotérmico comparado em ano civil contra ano hidrológico produz diferença que é puramente de calendário."],["5. Regime tributário e subsídio","Tributos recuperáveis pela indústria não são custo; tributos não recuperáveis são. Subsídio explícito aparece no orçamento; <b>subsídio cruzado não aparece em lugar nenhum</b> — ele está embutido na tarifa de outra classe de consumidor. Um preço industrial baixo sustentado por subsídio cruzado residencial não é vantagem estrutural; é uma escolha de política que pode ser revertida sem mudar uma linha do desenho de mercado."],["6. Base cambial","Nominal ou paridade de poder de compra — e de que data. As duas respondem a perguntas diferentes e não são intercambiáveis. Paridade serve para acessibilidade doméstica; <b>não serve</b> para investimento com equipamento importado, dívida em moeda forte ou competitividade de exportação, que correm em câmbio nominal. Para comparar anos, deflacionar é obrigatório e a escolha do índice é declaração, não detalhe."],["7. Qual desenho formou","A sétima é a que quase ninguém faz, e é a que este módulo acrescenta. <b>Preço nodal, preço zonal e preço uniforme por submercado não são o mesmo tipo de objeto.</b> Um preço nodal é o custo de atender mais um megawatt naquele ponto específico da rede, com congestionamento e perdas dentro; um preço zonal é uma média sobre uma área em que o congestionamento interno foi assumido como inexistente por convenção; um preço uniforme por submercado com valor modelado por custo declarado não é sequer o resultado de um processo de oferta. Comparar os três é comparar três definições."]] },
    { kind: 'nota', tom: "neutro", label: "O caso concreto que ilustra as sete de uma vez", html: "Suponha que um interlocutor apresente dois números verdadeiros: o preço médio de curto prazo de um mercado europeu num ano recente, em torno de <b>€89/MWh</b>, e o preço de curto prazo médio de um submercado brasileiro no mesmo ano. Converte um no outro pelo câmbio médio e conclui que a energia brasileira é mais cara ou mais barata. Os dois números podem estar corretos na fonte, e a conclusão é inválida por <b>seis das sete declarações</b>. O primeiro é uma média aritmética de um mercado de ofertas com preço uniforme por zona nacional, sem rede, sem encargos e sem tributos; o segundo é o valor de liquidação de diferenças de um sistema de despacho por custo declarado, que a maior parte da carga industrial <b>não paga</b> porque está contratada. Nenhum dos dois é o que uma fábrica desembolsa. A única declaração que o interlocutor fez foi a sexta, e é a única que não era o problema." },
    { kind: 'nota', tom: "neutro", label: "Três níveis", html: "<b>Criança de 12 anos:</b> Imagine que uma bala custa uma moeda no seu país e duas moedas no país vizinho. Se você só quer saber quantas balas cada criança consegue comprar com a mesada dela, você compara o poder de compra. Mas se você vai comprar um brinquedo importado, que chega de navio e é pago na moeda do outro país, o poder de compra não ajuda — você precisa saber quantas moedas suas valem uma moeda de lá. As duas contas estão certas; elas respondem a perguntas diferentes.<br><b>Executivo:</b> A conversão nominal responde “quanto isto custa em moeda forte” e é a base correta para qualquer coisa que se compre ou se financie fora do país: equipamento importado, dívida denominada em moeda estrangeira, competitividade de um produto exportado. A paridade de poder de compra responde “quanto isto pesa na renda local” e é a base correta para acessibilidade doméstica e para comparação de tarifa residencial entre países. Usar paridade para comparar competitividade industrial exportadora infla artificialmente a posição do país de moeda fraca; usar nominal para comparar acessibilidade residencial faz o oposto. A escolha precisa ser declarada e precisa ser a mesma nos dois lados da comparação.<br><b>Especialista:</b> O fator de paridade é uma razão entre cestas de bens cuja composição é determinada por metodologia de organismo de estatística e revisada em rodadas plurianuais, o que significa que ele carrega defasagem própria e sensibilidade à cesta escolhida. Para eletricidade industrial, o problema é agravado porque a estrutura de custo do insumo é ela própria internacionalmente arbitrada em parte — equipamento, combustível, capital — e domesticamente formada em parte — mão de obra, encargos, tributos. Aplicar um fator de paridade agregado a um custo de composição mista produz viés cuja direção depende da parcela importada, que raramente é declarada. A prática defensável é reportar os dois valores, rotulados, e declarar qual pergunta cada um responde — nunca escolher o que favorece a conclusão desejada." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "As sete declarações são um instrumento de conversa antes de serem um instrumento de análise. Capacidade entregue: <b>ouvir uma comparação de preço e enumerar, em menos de um minuto, o que precisa ser declarado antes de a frase significar alguma coisa</b>. No <b>GridAlpha Brasil Terminal</b>, três das sete são variáveis que o terminal já exibe e que decidem a maior parte das comparações que aparecem numa conversa: a separação entre energia contratada e liquidação de diferenças, a composição da fatura por camada, e o encargo setorial como parcela do total." },
  ],
  'aula-17-02': [
    { kind: 'titulo', numero: null, texto: "Uma diferença dominada por dotação não é lição — é geografia" },
    { kind: 'paragrafo', html: "Este é o teste mais rápido e o mais frequentemente pulado. Antes de perguntar o que aprender, pergunte o que o país tem e não escolheu. Um sistema cuja matriz elétrica é majoritariamente renovável porque uma bacia hidrográfica continental atravessa o território não descobriu nada que possa ser copiado por um país sem aquela bacia. Um sistema com fator de capacidade eólico excepcional numa faixa costeira específica não tem uma política melhor — tem vento melhor." },
    { kind: 'paragrafo', html: "A recíproca também vale e é menos confortável: quando um sistema é mais caro porque precisa transportar energia por milhares de quilômetros entre onde ela é gerada e onde é consumida, isso também é dotação, e também não é falha de gestão. <b>A geografia entra nos dois lados da conta.</b>" },
    { kind: 'titulo', numero: null, texto: "Uma diferença dominada por política não é modelo — é um governo" },
    { kind: 'paragrafo', html: "A parcela de política é a mais visível porque é a que aparece em manchete: incentivo fiscal, meta de descarbonização, preço de carbono, subsídio, política industrial. É também a mais volátil. Um pacote de crédito tributário que orientou bilhões em investimento pode ter o seu prazo antecipado por lei nova em menos de três anos; uma reforma que estabelece prevalência de empresa estatal pode ser aprovada e implementada dentro de um mandato; um mecanismo de mercado que levou uma década para ser desenhado normalmente sobrevive a três administrações." },
    { kind: 'paragrafo', html: "A regra operacional: <b>mudança de governo altera a parcela de política; raramente altera desenho no mesmo mandato; nunca altera dotação.</b> Material que trate as três como a mesma coisa produz previsão de reversão que não se realiza — e o inverso também, porque o analista que assume que tudo sobrevive à eleição erra do outro lado." },
    { kind: 'titulo', numero: null, texto: "Só a parcela de desenho é discutível como escolha — e mesmo ela depende da dotação" },
    { kind: 'paragrafo', html: "Desenho é o que o país escolheu na arquitetura: critério de despacho, granularidade do preço, existência ou não de remuneração explícita de disponibilidade, alocação de risco de volume. É a única parcela sobre a qual uma conversa de importação faz sentido, e é a que exige a lente de pressuposto institucional, porque nenhum mecanismo existe fora das instituições que o operam." },
    { kind: 'paragrafo', html: "E há uma condicionalidade que costuma ser esquecida: o desenho ótimo depende da dotação. Preço nodal resolve um problema de congestionamento que só existe onde recurso e carga estão separados de um modo específico. Mercado de capacidade resolve um problema de adequação que tem forma diferente num sistema com estocagem hidráulica plurianual. <b>Importar um desenho para uma dotação diferente importa a solução de um problema que você talvez não tenha.</b>" },
    { kind: 'titulo', numero: null, texto: "Exemplo estático · três diferenças reais, decompostas" },
    { kind: 'paragrafo', html: "As proporções abaixo são ilustrativas e ordinais — servem para mostrar a forma da decomposição, não para serem citadas como medida. O instrumento seguinte permite que você as construa a partir dos seus próprios critérios." },
    { kind: 'paragrafo', html: "<b>“A matriz elétrica deles é muito mais limpa que a nossa” — sistema com base nuclear grande contra sistema hidrotérmico</b>" },
    { kind: 'nota', tom: "neutro", label: "Proporção", html: "<b>dotação · desenho · política</b> — Uma frota nuclear grande e padronizada é <b>escolha de política</b> mantida por décadas, com custo fiscal e industrial que foi assumido explicitamente. A dotação contribui — urânio, água de resfriamento, densidade de carga que justifica unidades grandes — e o desenho contribui pouco, porque a mesma frota existiria sob outra arquitetura de mercado. <b>A parcela de desenho é a que menos explica</b>, e dizer isso é o ponto: quem lê essa diferença como lição de desenho de mercado está atribuindo à parcela errada. <b>“O preço de curto prazo deles varia muito mais que o nosso” — mercado energy-only contra despacho por custo declarado</b> dot. desenho pol. Aqui é quase pura parcela de <b>desenho</b>. Um mercado que remunera adequação exclusivamente por receita de energia precisa deixar o preço subir muito em momento de escassez, ou o sinal de investimento desaparece. Um sistema de despacho por custo declarado com teto regulatório produz uma distribuição de forma completamente diferente pelo mesmo motivo invertido. <b>A dotação não explica quase nada</b>, e a política tampouco. <b>“Eles têm muito mais renovável variável que nós” — sistema com irradiação e vento excepcionais contra sistema hidráulico</b> dotação des. política Dominada por <b>dotação</b>, com contribuição real de política — leilão, incentivo, meta — e contribuição pequena de desenho. Note a assimetria que isso cria: o sistema hidráulico já era de baixa emissão antes de qualquer política renovável, o que significa que a métrica de “crescimento da participação renovável” penaliza estruturalmente quem começou limpo. <b>É a mesma armadilha de base de comparação, agora na dimensão de descarbonização.</b><" },
    { kind: 'nota', tom: "neutro", label: "Três níveis", html: "<b>Criança de 12 anos:</b> Uma torneira grande não quer dizer muita água no balde. Depende de quanto tempo ela fica aberta. A capacidade instalada é o tamanho da torneira; a geração é a água que realmente caiu no balde durante o ano. Um país pode ter torneiras enormes que ficam fechadas boa parte do tempo, e um vizinho com torneiras menores que ficam abertas quase sempre pode acabar com mais água.<br><b>Executivo:</b> Capacidade instalada é potência, medida em MW ou GW, e representa o máximo instantâneo. Geração é energia, medida em MWh ou TWh, e representa o que foi efetivamente produzido ao longo de um período. A razão entre as duas é o fator de utilização, e ele varia entre tecnologias por um múltiplo grande — uma térmica de base e um parque solar com a mesma placa entregam volumes de energia que diferem por um fator de três a quatro. Consequência direta: uma frase do tipo “metade da capacidade do país já é renovável variável” é compatível com uma participação na geração de menos da metade disso. As duas afirmações podem ser verdadeiras simultaneamente e descrevem sistemas muito diferentes.<br><b>Especialista:</b> A distinção se ramifica em quatro números, não dois, e a Aula 08 os separa: capacidade instalada; geração no ano; geração em instante de pico de participação; e energia efetivamente consumida, líquida de corte de geração e de saldo de intercâmbio. A razão entre o primeiro e o último é rotineiramente de múltiplos, e cada um responde a uma pergunta distinta — adequação de placa, contribuição energética anual, capacidade do sistema de operar em regime de alta penetração instantânea, e substituição real de combustível. Comparar o primeiro número de uma jurisdição com o segundo de outra é o defeito de unidade mais comum do gênero comparativo, e ele sobrevive porque cada lado cita o número que favorece a sua tese sem que nenhum dos dois esteja mentindo." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "A decomposição é o que separa uma análise comparativa de um ranking. Capacidade entregue: <b>diante de qualquer diferença observada, dizer qual parcela vincula, quais concorrem e qual não explica nada</b>. Alimenta o <b>GridAlpha Research</b>, cujo interlocutor natural é o consumidor industrial brasileiro exportador — para quem a pergunta “quanto disso é desenho?” deixa de ser acadêmica no dia em que um mecanismo de fronteira passa a incidir sobre o produto dele." },
  ],
  'aula-17-03': [
    { kind: 'titulo', numero: null, texto: "Primeira escolha: quem informa o custo" },
    { kind: 'paragrafo', html: "Há dois regimes, e a diferença entre eles não é técnica — é sobre quem carrega a informação e quem carrega o risco de ela estar errada." },
    { kind: 'tabela', linhas: [["","Despacho por custo declarado","Despacho por oferta"],["<b>Como se ordena</b>","O operador ordena as usinas por custo variável apurado ou modelado, segundo regra pública. O agente não escolhe o preço com que entra","O agente oferta um preço e o operador ordena pela oferta. Preço e despacho saem do mesmo processo de otimização"],["<b>O que entrega</b>","Otimização de um recurso estocado plurianual — água em reservatório — contra combustível, num horizonte que nenhum agente individual internaliza. Reduz espaço para exercício de poder de mercado na formação do preço","Revelação descentralizada de custo de oportunidade e de disponibilidade real. Incorpora automaticamente indisponibilidade, restrição operativa e expectativa do agente"],["<b>O que custa</b>","Depende inteiramente da qualidade do modelo e dos parâmetros regulatórios que o alimentam. Um erro de parâmetro vira preço para o sistema inteiro, e o agente não tem como sinalizar discordância pelo preço","Depende de haver concorrência suficiente e monitoramento de mercado. Sem os dois, oferta vira poder de mercado. Exige capacidade de fiscalização que é ela própria uma instituição"],["<b>Pressuposto institucional</b>","Um operador com mandato de otimização, um modelo auditável e um regulador com competência para fixar parâmetros","Um monitor de mercado independente com poder de mitigação de oferta e um regulador com jurisdição sobre o atacado"]] },
    { kind: 'nota', tom: "neutro", label: "A confusão que essa escolha produz numa conversa", html: "Um interlocutor de mercado de ofertas pergunta “qual foi o preço da energia ontem?” e espera um número que resultou de um leilão. O interlocutor brasileiro responde com um valor que resultou de um modelo de otimização e que serve à liquidação de diferenças. <b>Os dois números têm a mesma unidade e não têm a mesma natureza</b>, e a conversa segue por vinte minutos sem que nenhum dos dois perceba. Declarar o regime de despacho na primeira frase resolve isso." },
    { kind: 'nota', tom: "neutro", label: "Três níveis", html: "<b>Criança de 12 anos:</b> Imagine uma fila de sorveteiros. No primeiro jeito, um fiscal pergunta quanto custa para cada um fazer mais um sorvete, confere as contas, e manda trabalhar primeiro quem tem o custo menor. No segundo jeito, cada sorveteiro diz por quanto aceita trabalhar, e o fiscal chama primeiro quem pediu menos. No primeiro, o fiscal precisa saber fazer as contas. No segundo, precisa haver sorveteiros suficientes para ninguém pedir demais.<br><b>Executivo:</b> No despacho por custo declarado, a ordem de acionamento vem de custos variáveis apurados ou modelados segundo regra pública, e o preço de curto prazo é um resultado do mesmo processo de otimização. No despacho por oferta, o agente informa o preço pelo qual aceita gerar, e preço e ordem saem do mesmo leilão. A primeira arquitetura consegue otimizar um recurso estocado plurianual, como água em reservatório, contra combustível — algo que nenhum agente individual internaliza. A segunda revela de forma descentralizada custo de oportunidade e disponibilidade real. Cada uma transfere o risco de erro para um lugar diferente: para o modelo, na primeira; para a concorrência e o monitoramento, na segunda.<br><b>Especialista:</b> A diferença decisiva não é filosófica: é onde reside a informação sobre valor da água e sobre custo de oportunidade intertemporal. Num sistema com estocagem plurianual, o valor marginal da água é função de estado — nível, afluência esperada, demanda futura — e é calculado por modelo de otimização estocástica cujos parâmetros são fixados por regulação. Num sistema sem estocagem relevante, esse problema não existe na mesma forma, e a oferta descentralizada revela custo com menos perda. Daí decorre que a escolha entre os dois regimes é condicionada pela dotação, e não é um teste de sofisticação institucional: importar despacho por oferta para um sistema com estocagem plurianual transferiria ao agente a precificação de um recurso comum intertemporal, o que é um problema de desenho diferente e não necessariamente melhor resolvido." },
    { kind: 'titulo', numero: null, texto: "Segunda escolha: com que granularidade o preço se forma" },
    { kind: 'paragrafo', html: "Independente do regime de despacho, o preço pode se formar em três granularidades. A escolha responde a uma pergunta física — onde está o congestionamento — e a uma pergunta distributiva — quem paga por ele." },
    { kind: 'tabela', linhas: [["Nodal","Um preço por ponto de injeção ou retirada da rede, decomposto em energia, congestionamento e perdas. Entrega o sinal locacional mais preciso que existe: diz onde vale a pena construir e onde vale a pena consumir. Custa complexidade de liquidação, exige instrumento financeiro de proteção contra a diferença entre pontos, e produz resultado distributivo que precisa ser politicamente aceito — <b>a mesma energia custa mais para quem está do lado errado de uma linha congestionada</b>."],["Zonal","Um preço por área ampla, tipicamente o território de um país ou de um estado, com o congestionamento interno assumido como inexistente por convenção e resolvido depois por redespacho. Entrega simplicidade e aceitabilidade política. Custa a perda do sinal locacional e o surgimento de um custo de redespacho que alguém paga, normalmente socializado. Quando a zona é grande e o congestionamento interno é grande, o custo cresce."],["Uniforme por submercado","Um preço por área de mercado definida administrativamente, com valor derivado de otimização e não de ofertas, e com separação de preço entre áreas só quando o intercâmbio satura. Entrega previsibilidade e uma base contratual simples para um mercado de contratos de longo prazo. Custa sinal locacional dentro da área e transfere para o planejamento a decisão que o preço tomaria."]] },
    { kind: 'paragrafo', html: "As três coexistem no mundo e nenhuma domina as outras em abstrato. O que decide não é sofisticação — é a relação entre onde está o recurso, onde está a carga e quanto custa a linha entre os dois. <b>Um sistema com recurso e carga próximos ganha pouco com preço nodal e paga a complexidade inteira.</b> Um sistema em que a geração está a milhares de quilômetros do consumo ganha muito e paga o custo distributivo." },
    { kind: 'nota', tom: "neutro", label: "Três níveis", html: "<b>Criança de 12 anos:</b> Imagine uma estrada com um trecho estreito. Se muita gente quer passar, forma fila. Alguns lugares ficam antes do trecho estreito e outros depois. No preço nodal, cada lugar tem o seu próprio preço, e quem está do lado ruim paga mais. No preço zonal, a cidade inteira paga o mesmo, e o custo da fila é dividido entre todos. Nos dois casos a fila existe — muda quem paga por ela.<br><b>Executivo:</b> Preço nodal expõe o custo do congestionamento no ponto exato em que ele ocorre, o que orienta localização de nova geração e de nova carga com precisão. Preço zonal esconde o congestionamento dentro da zona e o resolve por redespacho, cujo custo é recuperado de forma socializada. A escolha é, no fundo, sobre se o sinal econômico de localização deve chegar ao investidor ou se a decisão de localização pertence ao planejamento. Nenhuma das duas é errada; elas alocam a mesma decisão a agentes diferentes, e a qualidade do resultado depende de qual dos dois está mais bem informado naquele sistema.<br><b>Especialista:</b> Sob preço nodal, a exposição de um consumidor entre o ponto onde ele contratou e o ponto onde ele consome é um risco de base que exige instrumento financeiro específico, tipicamente um direito sobre a diferença de congestionamento entre dois pontos numa programação do dia anterior. Esse instrumento é hedge de um componente, não de todos: não cobre risco de volume, não cobre a diferença entre a programação do dia anterior e o tempo real, não cobre indisponibilidade da unidade e não cobre insuficiência de receita do conjunto de direitos emitidos. Um consumidor que muda o ponto de consumo e mantém o mesmo direito fica descoberto exatamente na variável que pretendia proteger. Sob preço zonal, esse risco não existe na mesma forma, e em troca aparece um custo de redespacho cuja alocação é objeto de disputa regulatória permanente." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Capacidade entregue: <b>ler um preço de curto prazo sabendo qual desenho o formou, e separar componente locacional de componente sistêmico</b>. É a variável mais decisiva de toda comparação de preço e a que menos aparece declarada. No <b>GridAlpha Brasil Terminal</b>, a separação de preço entre submercados e a saturação de intercâmbio são a manifestação brasileira do mesmo fenômeno, e lê-las com o vocabulário comparativo correto é o que permite a conversa com um interlocutor estrangeiro sem tradução mal-feita." },
  ],
  'aula-17-04': [
    { kind: 'nota', tom: "neutro", label: "As duas frases erradas", html: "<b>“O Brasil não tem mercado de capacidade, então não remunera disponibilidade.”</b> Falso. O Brasil tem instrumentos com função equivalente e nome diferente, tratados no Módulo 09: a obrigação de lastro de garantia física que vincula todo contrato de venda a uma capacidade efetivamente disponível, e leilões dedicados a contratar potência com pagamento recuperado por encargo. Não é o mesmo produto, e a função é a mesma. <b>“O instrumento brasileiro é a mesma coisa com outro nome.”</b> Também falso. Um mercado de capacidade organizado forma <b>preço</b> por disponibilidade num leilão com curva de demanda administrada, acredita cada recurso por contribuição probabilística à confiabilidade, e penaliza não-desempenho em momento de estresse. Uma obrigação de lastro vinculada a contrato não forma preço separado para o atributo; ela o embute no preço da energia contratada." },
    { kind: 'titulo', numero: null, texto: "O que exatamente um mercado de capacidade compra" },
    { kind: 'paragrafo', html: "Compra <b>disponibilidade futura acreditada</b>. Não compra energia, não compra a placa da usina, e não compra a promessa do proprietário. A cadeia tem cinco elos, e cada um deles é uma instituição antes de ser uma regra:" },
    { kind: 'lista', itens: ["<b>1.</b> <b>Requisito</b> — alguém calcula quanta capacidade acreditada o sistema precisa para atender um padrão probabilístico de confiabilidade, tipicamente expresso como expectativa de dias com insuficiência ao longo de um número de anos. Exige previsão de carga e modelo estocástico auditáveis.","<b>2.</b> <b>Acreditação</b> — cada recurso recebe um valor de contribuição que <b>não é a sua placa</b>. Uma térmica é descontada por indisponibilidade forçada; um recurso variável é avaliado pela contribuição marginal efetiva à confiabilidade, que cai à medida que mais unidades daquele tipo entram. Exige série histórica e metodologia publicada.","<b>3.</b> <b>Curva de demanda</b> — a disposição a pagar do sistema não é vertical no requisito; é uma curva administrada que evita que pequenos desvios de oferta produzam saltos enormes de preço. <b>A forma dessa curva é uma decisão regulatória, não um resultado de mercado</b>, e ela determina o preço tanto quanto a oferta.","<b>4.</b> <b>Leilão e obrigação</b> — o produto é vendido com antecedência de alguns anos, e quem venceu assume obrigação de estar disponível na janela de entrega. O consumidor paga por meio do seu agente supridor.","<b>5.</b> <b>Penalidade</b> — sem penalidade crível por não-desempenho no momento de estresse, o mecanismo paga por uma promessa. É o elo que mais frequentemente falha e o que separa um mercado de capacidade funcional de uma transferência de renda."] },
    { kind: 'titulo', numero: null, texto: "O desenho oposto: só energia, com escassez" },
    { kind: 'paragrafo', html: "A alternativa é não comprar disponibilidade e deixar que a receita de energia e de serviços ancilares a remunere — o que exige que o preço possa subir muito quando as reservas ficam escassas. Não é ausência de mecanismo; é um mecanismo diferente, com um pressuposto institucional próprio: <b>a credibilidade de que o preço alto será permitido</b>. Se o regulador intervém no primeiro evento de preço extremo, o sinal de investimento desaparece e o desenho não funciona." },
    { kind: 'tabela', linhas: [["","Mercado central de capacidade","Só energia, com escassez"],["<b>Entrega</b>","Receita previsível para capacidade firme, horizonte de investimento explícito, adequação verificável ex ante","Sinal econômico agudo para flexibilidade e resposta de demanda; não paga por ativo que não é necessário"],["<b>Custa</b>","Pode sobrepagar quando a previsão de carga erra para cima; pode institucionalizar uma previsão errada por anos; o consumidor paga mesmo em ano folgado","Receita concentrada em poucos eventos raros, o que exige gestão de risco e crédito sofisticada; tolerância política a preço extremo"],["<b>Falha típica</b>","Pagar ativo que não performa no momento de estresse — falha de acreditação ou de penalidade","Subinvestimento silencioso até um evento que revela a lacuna"],["<b>Pressuposto institucional</b>","Modelo de confiabilidade auditável, metodologia de acreditação publicada, autoridade para penalizar","Compromisso regulatório crível de não intervir no preço, mais resposta de demanda real"]] },
    { kind: 'nota', tom: "neutro", label: "Três níveis", html: "<b>Criança de 12 anos:</b> Um time de futebol pode pagar o goleiro reserva todo mês para ele estar pronto, mesmo que ele quase nunca jogue. Ou pode não pagar nada e prometer um prêmio enorme nos raros dias em que ele precisar entrar. Os dois jeitos podem funcionar. No primeiro, você gasta todo mês mesmo sem precisar. No segundo, você precisa mesmo pagar o prêmio quando o dia chegar — se não pagar, nenhum goleiro reserva aparece no ano seguinte.<br><b>Executivo:</b> Um mercado de capacidade separa o pagamento por estar disponível do pagamento por produzir, e o contrata com anos de antecedência contra um requisito calculado. Um mercado só de energia deixa a receita de disponibilidade emergir dos preços elevados em horas de escassez. O primeiro compra previsibilidade e aceita o risco de pagar por capacidade desnecessária; o segundo compra eficiência alocativa e aceita o risco de subinvestimento e de volatilidade extrema de receita. A escolha entre os dois é menos técnica do que parece: ela depende de quanta volatilidade o sistema político daquele lugar tolera.<br><b>Especialista:</b> O parâmetro que efetivamente decide não é a existência do mercado, e sim a qualidade da acreditação e o rigor da penalidade. Um leilão que acredita recursos por placa em vez de por contribuição marginal à confiabilidade compra um número nominal e entrega menos do que contratou, e a diferença só aparece no evento de estresse. Um leilão com acreditação probabilística correta mas penalidade fraca produz o mesmo resultado por outro caminho. No desenho só-energia, o equivalente é a curva administrativa que precifica a escassez de reserva: se ela é rasa demais, a receita não recupera custo fixo de nenhum ativo de ponta; se é íngreme demais, transfere renda em eventos que não eram de escassez real. Nos dois desenhos, portanto, o mecanismo visível não é o que determina o resultado — determina-o um parâmetro regulatório de segunda ordem que quase nunca aparece na conversa." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Capacidade entregue: <b>distinguir mercado de energia de mercado de capacidade, explicar o que o segundo compra, e reconhecer o instrumento brasileiro de função equivalente sob outro nome</b>. É a pergunta que um parceiro estrangeiro faz com mais frequência — “por que o Brasil não tem mercado de capacidade?” — e a resposta correta não é sim nem não: é descrever a função, apontar o instrumento que a ocupa aqui e nomear a diferença de desenho. Alimenta o <b>GridAlpha Brasil Terminal</b> na leitura de encargo e de contratação de potência." },
  ],
  'aula-17-05': [
    { kind: 'titulo', numero: null, texto: "Conflito de interesse · repetido aqui por obrigação" },
    { kind: 'paragrafo', html: "Esta é a aula do mercado que o produto cobre. O currículo justifica, com essas palavras, o estudo detalhado de um dos sete operadores pela construção de um terminal do GridAlpha sobre ele. Dois dos cinco recursos primários que o currículo lista para este bloco são plataformas comerciais de inteligência de energia, e uma delas é o benchmark de nível empresarial que o plano de negócios nomeia como referência de posicionamento." },
    { kind: 'paragrafo', html: "<b>Toda afirmação desta aula sobre a riqueza analítica daquele mercado é feita por parte interessada.</b> Ele recebe cerca do dobro do espaço dos outros seis operadores desta família. Recebe porque há material acumulado e porque há interesse comercial — e recebe exatamente a mesma decomposição em dotação, desenho e política que todos os outros. Se você achar que a aula está inclinada, o teste é simples: procure a parcela de dotação e a de política dele. Estão aqui." },
    { kind: 'paragrafo', html: "Os sete não são versões da mesma coisa. Todos coordenam operação e formam preço nodal; diferem em adequação, geografia, matriz, governança e exposição climática. E é justamente por compartilharem país, moeda, regime tributário federal e cadeia de equipamento que eles constituem o melhor laboratório disponível para separar as três parcelas: <b>quando dois deles divergem, a dotação e a política federal estão quase constantes, e o que sobra é desenho</b>." },
    { kind: 'titulo', numero: null, texto: "O caso principal: preço nodal com mercado central de capacidade" },
    { kind: 'paragrafo', html: "O maior deles em carga atende treze estados e um distrito federal, com parque térmico e nuclear grande, e opera simultaneamente um mercado de energia com programação do dia anterior e ajuste em tempo real, serviços ancilares, direitos financeiros de transmissão e um leilão de capacidade plurianual. É essa combinação — <b>quatro produtos distintos formados no mesmo sistema, com granularidade nodal e publicação aberta</b> — que torna a região analiticamente rica, e é exatamente isso que um terminal de inteligência sobre ela consegue explorar." },
    { kind: 'paragrafo', html: "Os três leilões de capacidade mais recentes contam uma história que precisa ser lida com cuidado, porque a leitura fácil dela é errada:" },
    { kind: 'tabela', linhas: [["1. Entrega 2026/2027","Fechou em <b>US$ 329,17/MW-dia</b>, no teto acordado entre os governadores dos treze estados e o regulador federal. O volume contratado somado à capacidade sob requisito fixo ficou 139 MW acima do requisito de confiabilidade — margem mínima."],["2. Entrega 2027/2028","Fechou em <b>US$ 333,44/MW-dia</b>, também no teto, com 134.478,1 MW acreditados. <b>Primeiro leilão em que o conjunto do sistema ficou abaixo do requisito de confiabilidade.</b> Cerca de 810 MW ofertados não fecharam porque as ofertas estavam acima do teto temporário."],["3. Entrega 2028/2029","Anunciado em <b>14 de julho de 2026</b>: <b>US$ 325/MW-dia</b>, queda de 2,5%, 138.317,8 MW acreditados mais 10.864 MW sob requisito fixo, totalizando 149.182 MW. Margem de reserva de 14,7%. Custo total do leilão de US$ 16,4 bilhões. <b>O operador estima que, sem o teto, todas as zonas teriam fechado em US$ 554,72/MW-dia</b>, com custo perto de US$ 30 bilhões. O teto foi estendido até a entrega 2029/2030, e um leilão extraordinário de retaguarda foi marcado para setembro de 2026 para cobrir a diferença até o requisito integral."]] },
    { kind: 'nota', tom: "neutro", label: "A leitura fácil e por que ela é errada", html: "“Centros de dados encareceram a energia” é a manchete, e ela confunde três coisas. O preço de capacidade responde a uma <b>curva de demanda administrada</b> cuja forma é decisão regulatória; à <b>acreditação</b> de cada recurso, que caiu para várias tecnologias em rodadas sucessivas; à <b>oferta qualificada</b>, afetada por aposentadoria de unidades e por fila de conexão; e a um <b>teto temporário</b> negociado politicamente. A queda de 2,5% na última rodada não sinaliza folga — <b>o preço continua no teto</b>, e a diferença entre o teto e a estimativa sem teto é maior que o próprio teto. Ler o número sem decompor esses quatro fatores é ler um termômetro sem saber onde ele está pendurado. E a decomposição em três parcelas: crescimento de carga por eletrificação e por carga computacional é <b>dotação de demanda</b>, não escolha; o processo de conexão e a metodologia de acreditação são <b>desenho</b>; o teto negociado e o cronograma de aposentadoria induzido por regra estadual são <b>política</b>. As três estão presentes no mesmo número." },
    { kind: 'titulo', numero: null, texto: "Primeiro caso extremo: só energia, com escassez" },
    { kind: 'paragrafo', html: "O operador que atende quase toda a carga de um único estado grande é o caso extremo do desenho oposto: não há leilão central de capacidade, e a adequação depende de receita de energia, de serviços ancilares, de preço de escassez, de contratos bilaterais e de investimento por conta e risco. A rede é quase isolada das demais, o que reduz a jurisdição federal sobre ela e, na mesma medida, transfere ao estado a responsabilidade integral pelo próprio desenho — e pelas consequências dele." },
    { kind: 'paragrafo', html: "Em <b>5 de dezembro de 2025</b>, esse mercado colocou em operação a mudança mais substancial do seu desenho em quinze anos: cootimização de energia e serviços ancilares em tempo real, com baterias modeladas como recurso único e com o estado de carga entrando na formulação de despacho. Dois detalhes de desenho decidem a leitura e costumam ser omitidos: as curvas de demanda por serviço ancilar <b>substituíram</b> a curva de demanda por reserva operativa que antes fazia o papel de precificar escassez, e os adicionais de preço passaram a <b>entrar no preço nodal</b> em vez de existirem como parcela separada." },
    { kind: 'paragrafo', html: "Os primeiros seis meses de operação, comparados ao período equivalente anterior, mostram preços de energia mais baixos, menos voláteis, e diferenças menores entre a programação do dia anterior e o tempo real. <b>Isso é resultado de desenho e não elimina risco de dotação</b> — clima extremo, disponibilidade de combustível e limite de transmissão continuam onde estavam." },
    { kind: 'titulo', numero: null, texto: "Segundo caso extremo: descarbonização induzida por política estadual" },
    { kind: 'paragrafo', html: "O operador da costa oeste é o caso extremo na outra direção: alta penetração solar, expansão rápida de baterias e políticas climáticas estaduais fortes, sem leilão central de capacidade. A adequação vem de um programa estadual em que os agentes supridores demonstram capacidade contratada e os recursos designados são obrigados a ofertar ao mercado. A partir da data de operação de <b>1º de maio de 2026</b>, o mercado do dia anterior estendido àquela região passou a publicar resultados com suficiência de recursos, preços, reservas de desequilíbrio e transferências — <b>ampliação de coordenação regional sem criação de uma política energética única</b>, que é precisamente a distinção entre integrar mercado e unificar política." },
    { kind: 'nota', tom: "neutro", label: "A lição que esse caso oferece, e a que ele não oferece", html: "Preço negativo e corte de geração num sistema com alta penetração solar <b>não significam que renovável não funciona</b>. Significam que localização, rede, flexibilidade e demanda não acompanharam a produção. E baterias resolvem horas — deslocam energia do meio do dia para a noite — mas <b>não resolvem déficit sazonal nem limite estrutural de transmissão</b>. Confundir as duas coisas é o erro que o Módulo 16 catalogou como escolha de gargalo errado, e ele reaparece aqui em versão comparativa." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Este é o gancho do <b>GridAlpha US Terminal</b>, e é a razão de este bloco existir na ordem em que existe. Capacidade analítica entregue: <b>ler preço nodal, separar o componente de congestionamento, distinguir mercado de energia de mercado de capacidade e converter preço de disponibilidade em equivalente por energia</b>. O valor de estudar essa região não está em copiá-la — está em que a infraestrutura de dados dela permite treinar o olho numa granularidade que quase nenhum outro sistema publica. <b>Nunca promessa de retorno.</b> E, mais uma vez: esta frase é escrita por parte interessada." },
  ],
  'aula-17-06': [
    { kind: 'titulo', numero: null, texto: "O que aconteceu, em termos de norma" },
    { kind: 'paragrafo', html: "Um pacote legislativo federal de incentivo, aprovado em 2022, orientara investimento por crédito tributário tecnologicamente neutro. Em <b>4 de julho de 2025</b>, uma lei orçamentária federal antecipou o término desses créditos para instalações eólicas e solares: projetos que iniciassem construção depois de <b>4 de julho de 2026</b> passariam a ter de entrar em operação até <b>31 de dezembro de 2027</b> para permanecerem elegíveis. Três dias depois, uma ordem executiva determinou aplicação estrita e revisão das regras de início de construção, e a orientação administrativa subsequente restringiu o critério de gasto mínimo a instalações solares de pequeno porte, deixando o critério de trabalho físico como via principal." },
    { kind: 'paragrafo', html: "Duas coisas mudaram desde então e nenhuma delas está no material comparativo que circula:" },
    { kind: 'tabela', linhas: [["Item","Estado em 4 de agosto de 2026"],["<b>O prazo de início de construção</b>","<b>Já passou.</b> A data de 4 de julho de 2026 ficou para trás um mês antes desta verificação. A partir de agora, a pergunta relevante não é mais “como iniciar construção a tempo” e sim quais projetos conseguiram documentar início e quais migraram para o prazo de entrada em operação até o fim de 2027"],["<b>O critério de gasto mínimo</b>","Uma decisão judicial federal, com fundamento em falha de motivação administrativa, <b>restaurou a disponibilidade do critério de gasto mínimo</b> ao lado do critério de trabalho físico. Isso reabre elegibilidade para uma classe inteira de projetos que a orientação anterior havia excluído. É o tipo de reviravolta que material comparativo publicado poucos meses antes não registra"],["<b>Restrições de cadeia</b>","Regras sobre assistência material de entidade estrangeira vedada passaram a condicionar elegibilidade fiscal a uma razão de custo de componente, com limiar que <b>aperta ano a ano</b>. Um mesmo projeto pode ser elegível num ano e inelegível no seguinte com a mesma cadeia de fornecimento"],["<b>Armazenamento e outras tecnologias</b>","Não sofreram o mesmo término antecipado. O tratamento <b>não é uniforme por tecnologia</b>, o que significa que a política reordenou a atratividade relativa entre tecnologias sem mudar nada na física ou no desenho de mercado"]] },
    { kind: 'nota', tom: "neutro", label: "O que isso ensina sobre a decomposição — e é o núcleo desta aula", html: "Em pouco mais de um ano, sem que uma linha do desenho de mercado fosse alterada e sem que a dotação se movesse um centímetro, o custo de capital de uma classe inteira de projetos mudou por efeito de lei, de ordem executiva, de orientação administrativa e de decisão judicial — <b>quatro instrumentos, quatro instituições diferentes</b>. É a demonstração mais limpa disponível de que a parcela de política é volátil em horizonte de mandato, e de que tratá-la como estrutural produz previsão errada nas duas direções: tanto quem projetou continuidade quanto quem projetou reversão total errou. O corolário operacional para uma conversa: quando alguém atribuir a trajetória de investimento de uma jurisdição a “o modelo deles”, pergunte <b>qual instrumento</b>, aprovado por <b>qual instituição</b>, com <b>qual prazo</b>. Se a resposta for um crédito tributário com data de término, você está diante da parcela de política, não da de desenho." },
    { kind: 'titulo', numero: null, texto: "O federalismo é desenho, não política" },
    { kind: 'paragrafo', html: "Há uma segunda camada, e ela pertence à parcela de desenho: em várias das jurisdições estaduais cobertas por esses mercados, o estado controla planejamento de recursos, licenciamento, varejo e política de portfólio, enquanto o regulador federal supervisiona o atacado e a transmissão interestadual. Uma decisão estadual sobre fechamento de usina, sobre incentivo ou sobre adequação altera um mercado regional que cruza fronteiras estaduais. Uma linha de transmissão pode ser economicamente justificada e politicamente bloqueada por qualquer um dos estados que ela atravessa." },
    { kind: 'paragrafo', html: "Isso tem duas leituras e as duas são verdadeiras: entrega <b>diversidade de modelos e experimentação regulatória real</b>, que é como se descobre o que funciona; e custa <b>fragmentação, litigância e prazo</b>. Federalismo não é sinônimo de descentralização eficiente — a coordenação funciona quando competências, dados, alocação de custo e autoridade de execução estão claros, e não quando estão simplesmente distribuídos." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "O <b>Regulatory Radar</b> acompanha desenvolvimentos regulatórios em jurisdições múltiplas, e a régua de estágio é o que impede que um anúncio seja tratado como regra vigente. Capacidade entregue: <b>classificar qualquer instrumento estrangeiro entre anunciado, proposto, aprovado, regulamentado e em operação, e dizer o que cada posição autoriza concluir</b>. Descrição do produto parafraseada aqui por decisão declarada — a redação interna dele contém termos que a régua deste projeto trata como vazamento, e citar material de posicionamento comercial verbatim dentro de material de estudo é problema independente de qual régua de nomeação esteja vigente." },
  ],
  'aula-17-07': [
    { kind: 'titulo', numero: null, texto: "Os números, com a grandeza declarada" },
    { kind: 'paragrafo', html: "Ao fim de 2025, a capacidade instalada total do sistema chegou a cerca de <b>3,89 TW</b>, alta de aproximadamente 16% em um ano, dos quais cerca de <b>1,8 TW</b> em eólica e solar — perto de 47% da <b>capacidade instalada</b>. No mesmo ano, o consumo de eletricidade ultrapassou <b>10.000 TWh</b>. Note as duas grandezas: a primeira é potência e a segunda é energia, e a razão entre a participação de eólica e solar na primeira e na segunda é a diferença mais citada e mais mal lida do setor elétrico mundial. <b>Participação em capacidade instalada não é participação em geração</b>, e a Aula 09 separa os quatro números que costumam ser confundidos." },
    { kind: 'nota', tom: "neutro", label: "Erro comum, na versão comparativa", html: "“Quase metade da capacidade já é eólica e solar, então o carvão foi superado.” Não foi. As duas afirmações — alta participação em capacidade instalada e térmica ainda majoritária em geração — são simultaneamente verdadeiras e descrevem um sistema em que a capacidade térmica pode <b>crescer</b> enquanto o seu fator de utilização <b>cai</b>. Isso muda a economia do ativo, introduz risco de ociosidade, e não elimina emissão. Sempre mostre capacidade instalada, geração e fator de utilização separadamente." },
    { kind: 'titulo', numero: null, texto: "O desenho: mercado administrado em transição declarada" },
    { kind: 'paragrafo', html: "É incorreto descrever esse sistema como puramente estatal sem preços, e igualmente incorreto descrevê-lo como mercado liberalizado. O Estado define direção, segurança, infraestrutura e cadeias prioritárias; competição e sinais de mercado operam dentro dessa moldura, e a fronteira entre as duas coisas está sendo deslocada por norma, com calendário público." },
    { kind: 'paragrafo', html: "Em <b>fevereiro de 2026</b>, o gabinete do conselho de Estado publicou opiniões de implementação sobre o aperfeiçoamento do sistema nacional unificado de mercado de eletricidade — o instrumento de referência da fase atual, sucedendo o documento de 2015 que abriu o ciclo anterior de reforma. A meta declarada: participação direta no mercado para todas as fontes e consumidores, exceto os sob arranjo de suprimento garantido, com <b>cerca de 70% do consumo transacionado em mercado até 2030</b> e sistema nacional plenamente unificado até 2035. Em 2025, as transações de mercado já representavam cerca de <b>64% do consumo</b>, com predominância de contratos de médio e longo prazo e participação menor, porém crescente, de curto prazo." },
    { kind: 'paragrafo', html: "Em <b>25 de junho de 2026</b>, as duas autoridades de planejamento e de energia publicaram o plano quinquenal de construção de um novo sistema energético para 2026–2030, e em <b>23 de julho de 2026</b> o plano quinquenal específico de renováveis. As metas para 2030 incluem participação de não-fósseis de cerca de 25% no consumo total de energia, eólica e solar acima de metade da capacidade instalada de geração, capacidade renovável total próxima de 3,5 TW com geração anual da ordem de 6.000 TWh, e investimento no período cerca de 40% acima do ciclo anterior." },
    { kind: 'nota', tom: "neutro", label: "Por que um preço único nacional seria o desenho errado ali", html: "O recurso eólico, solar, hidrelétrico e de carvão está concentrado no oeste e no norte; a carga está concentrada no litoral leste. A distância entre os dois é a variável estruturante, e é <b>dotação</b> — ninguém a escolheu. Um preço uniforme nacional apagaria justamente o sinal que decide onde construir linha e onde construir usina, num sistema em que a linha é a restrição. Por isso a reforma caminha para um mercado unificado em <b>regras</b> e diferenciado em <b>preço</b>, com comércio interprovincial ampliado — e o plano de rede publicado no fim de 2025 prevê mais de 420 GW de capacidade de transporte oeste-leste até 2030. A operação de rede é executada por dois grupos estatais de grande porte que não são apenas concessionárias: executam padronização técnica, investimento, desenvolvimento tecnológico e integração territorial. A escala permite aprendizado e redução de custo unitário; concentra poder decisório e pode produzir sobreinvestimento ou incentivo fraco à eficiência local. As duas coisas ao mesmo tempo." },
    { kind: 'titulo', numero: null, texto: "O pressuposto institucional, que é o ponto desta aula" },
    { kind: 'paragrafo', html: "Todo mecanismo de mercado depende de instituições que o currículo brasileiro já mapeou no Módulo 07: quem opera, quem contabiliza, quem liquida, quem fiscaliza, quem julga. Material comparativo descreve o mecanismo e omite o pressuposto, e a leitura ingênua conclui que basta copiar a regra." },
    { kind: 'paragrafo', html: "No caso desta jurisdição, a omissão é ainda mais custosa, porque o que sustenta a velocidade de execução não é uma regra de mercado — é a combinação de capacidade de financiamento estatal, cadeia industrial doméstica em escala, autoridade de desapropriação, planejamento territorial de longo prazo e coordenação entre geração, rede e manufatura sob um mesmo horizonte. <b>Nenhuma dessas condições é importável por decreto</b>, e uma política industrial que copie a meta sem copiar a capacidade de execução produz proteção sem produtividade. Isso não é juízo sobre a política dela nem recomendação para a nossa: é a constatação de que a parcela de política, ali, é inseparável de uma capacidade institucional que pertence à parcela de dotação institucional do país." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Capacidade entregue: <b>diante de qualquer mecanismo estrangeiro admirado, identificar de que instituição ele depende e verificar se existe equivalente brasileiro, em vez de responder se funcionaria aqui</b>. É a resposta correta ao interlocutor que diz “o Brasil deveria adotar o modelo deles” — nem concordar nem discordar: decompor, nomear o pressuposto e devolver a pergunta sobre qual parcela a adoção realmente moveria. Alimenta o <b>GridAlpha Research</b>." },
  ],
  'aula-17-08': [
    { kind: 'tabela', linhas: [["Teto e comércio","Fixa a <b>quantidade</b> de emissão permitida e deixa o preço emergir. Entrega certeza ambiental e incerteza de custo. Entra no custo marginal de uma térmica e, por ali, no preço de curto prazo da eletricidade. Exige medição, relato e verificação, registro, leilão ou alocação, e autoridade de enforcement — cinco funções institucionais, não uma."],["Tributo","Fixa o <b>preço</b> e deixa a quantidade emergir. Entrega certeza de custo e incerteza ambiental. Institucionalmente mais barato — usa a máquina tributária existente — e politicamente mais caro, porque o custo é visível e atribuível."],["Ajuste de fronteira","Não precifica emissão doméstica: precifica o <b>carbono incorporado em produto importado</b>, para que a assimetria regulatória entre jurisdições não se converta em vantagem competitiva. É o único dos três que transforma política climática de outro país em custo de exportação do seu."]] },
    { kind: 'nota', tom: "neutro", label: "Três níveis", html: "<b>Criança de 12 anos:</b> Imagine uma escola que quer diminuir o barulho no recreio. No primeiro jeito, ela distribui um número fixo de fichas de barulho e deixa as turmas trocarem entre si — o número de fichas é fixo, e quanto vale cada ficha depende de quem quer mais. No segundo, ela cobra uma moeda por minuto de barulho — o preço é fixo, e o barulho é o que sobrar. No terceiro, ela descobre que alguns alunos estão fazendo barulho do lado de fora do portão para escapar da regra, e passa a cobrar deles na entrada. Os três reduzem barulho de jeitos diferentes, e só o terceiro cobra de quem está fora.<br><b>Executivo:</b> Um sistema de teto e comércio fixa a quantidade de emissão permitida e deixa o preço emergir do mercado de permissões: entrega certeza ambiental e incerteza de custo. Um tributo fixa o preço por tonelada e deixa a quantidade emergir: entrega certeza de custo e incerteza ambiental. Um mecanismo de ajuste de fronteira não precifica emissão doméstica nenhuma — ele precifica o carbono incorporado em produto importado, para impedir que a assimetria regulatória entre jurisdições se converta em vantagem competitiva e em deslocamento de produção. Para um exportador, os dois primeiros são custo do país de destino e o terceiro é custo próprio. É a diferença que decide qual dos três aparece na planilha de quem produz no Brasil.<br><b>Especialista:</b> A equivalência teórica entre quantidade e preço se rompe sob incerteza e sob custo de conformidade heterogêneo, e a escolha entre os dois primeiros mecanismos depende da inclinação relativa das curvas de dano marginal e de custo marginal de abatimento. Na prática, o que decide não é essa comparação: é o custo institucional. Teto e comércio exige medição, relato e verificação, registro central, mecanismo de alocação ou leilão, mercado secundário e autoridade de enforcement — seis funções que precisam existir antes da primeira tonelada precificada. Um tributo usa a máquina tributária existente e é institucionalmente barato e politicamente caro, porque o custo é visível e atribuível a um ato de governo. O mecanismo de fronteira acrescenta uma sétima função e a coloca fora do país: verificação acreditada da intensidade da instalação estrangeira, reconhecida pela autoridade de destino. É por isso que a exposição real de um exportador depende menos do preço por tonelada do que da capacidade dele de provar a própria intensidade." },
    { kind: 'titulo', numero: null, texto: "O mecanismo de fronteira, verificado item por item" },
    { kind: 'paragrafo', html: "Este é o ponto em que o módulo encosta no bolso do cliente brasileiro, e é onde a distinção entre “custo que já corre” e “custo anunciado” decide tudo. A régua de estágio de cinco posições do Módulo 16 se aplica integralmente. Verificação em <b>4 de agosto de 2026</b>:" },
    { kind: 'tabela', linhas: [["Pergunta","Estado verificado"],["O regime está em período definitivo ou transitório?","<b>Definitivo desde 1º de janeiro de 2026.</b> O período transitório, só de relato, correu de outubro de 2023 a dezembro de 2025"],["Quais setores estão cobertos?","Seis: ferro e aço, cimento, alumínio, fertilizantes, eletricidade e hidrogênio"],["O custo já corre como caixa?","<b>Não.</b> A venda de certificados foi adiada para <b>1º de fevereiro de 2027</b>. A obrigação se acumula sobre importações de 2026 e a primeira declaração vence em <b>30 de setembro de 2027</b>. Há ainda um fator de entrada gradual até 2034, espelhando a retirada da alocação gratuita no sistema doméstico — <b>o custo do primeiro ano é uma fração pequena da exposição bruta</b>"],["Como a eletricidade indireta entra no cálculo?","<b>É o item mais mal compreendido, e o mais relevante para uma análise de energia.</b> Emissão indireta associada ao consumo de eletricidade é contabilizada para <b>cimento e fertilizantes</b>, e <b>não</b> para ferro, aço e alumínio. Para esses três, a parcela elétrica — que num alumínio primário é a maior parte da pegada — fica fora da obrigação de certificados"],["O abatimento por preço de carbono pago na origem é operacional?","Existe em duas vias: preço efetivamente pago, comprovado e certificado; ou preço de referência padrão, que a autoridade europeia publica <b>a partir de 2027</b>. Quando a emissão é reportada por valor padrão — que é o regime por defeito para emissão indireta —, a via de preço de referência é a única disponível"],["Há limiar de dispensa?","Sim, um limiar único de massa de 50 toneladas anuais por importador, do qual eletricidade e hidrogênio estão excluídos"],["Qual o preço do certificado?","Vinculado ao preço do sistema doméstico de teto e comércio: média trimestral em 2026, média semanal a partir de 2027. Os valores oficiais publicados para 2026 ficaram próximos de <b>€75/t</b> nos dois primeiros trimestres"]] },
    { kind: 'nota', tom: "neutro", label: "Defeito de fusão encontrado no material externo deste bloco", html: "O material comparativo que alimentou esta sessão calcula a exposição de uma siderúrgica exportadora como volume × intensidade × preço, chegando a um valor bruto na casa de dezenas de milhões de euros. <b>A aritmética está correta e o número é de outra grandeza</b>, por três motivos empilhados: usa um preço que não é o oficial do certificado; inclui implicitamente a parcela elétrica, que para aço está fora da obrigação; e ignora o fator de entrada gradual. Corrigidos os três, a exposição do primeiro ano cai por um múltiplo grande. Isso não torna o mecanismo irrelevante — torna <b>o cronograma</b> a variável decisiva, e é exatamente o que a régua de estágio existe para captar." },
    { kind: 'titulo', numero: null, texto: "E do lado brasileiro: por que não há o que abater hoje" },
    { kind: 'paragrafo', html: "O abatimento por preço pago na origem só opera se houver preço pago na origem. O sistema brasileiro foi instituído por lei em dezembro de 2024 e o seu cronograma público, conforme a secretaria federal que coordena a implantação, tem quatro marcos: conclusão das normas infralegais da primeira fase até <b>dezembro de 2026</b>; início do <b>relato de emissões em 2027</b>; fase de transação plena, com teto e plano nacional de alocação, prevista para <b>2030</b>; consolidação em <b>2031</b>." },
    { kind: 'paragrafo', html: "A leitura operacional é direta e desconfortável: <b>não existe preço de carbono pago no Brasil para abater hoje, e não existirá antes de 2030 no calendário vigente.</b> A assimetria regulatória entre as duas jurisdições, portanto, não é temporária no horizonte de decisão de um exportador — ela é o cenário-base da década. Isso é constatação de estado de implementação, não juízo sobre a política de nenhum dos dois lados." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Capacidade entregue: <b>separar os três mecanismos de precificação de carbono, classificar o estágio de cada um e dizer o que decide se o custo já corre ou apenas foi anunciado</b>. O <b>GridAlpha Research</b> atende exatamente o interlocutor que paga essa conta — o consumidor industrial brasileiro exportador —, e o ativo mais urgente para ele frequentemente não é uma usina nova: é um sistema de medição, relato e verificação capaz de provar a intensidade real da própria instalação e evitar o uso de valores padrão, que carregam acréscimo deliberado sobre a média do país. Diagnóstico, nunca recomendação fechada." },
  ],
  'aula-17-09': [
    { kind: 'tabela', linhas: [["1. Capacidade instalada","Participação em <b>potência</b>, em MW ou GW. É o maior dos quatro para fontes variáveis, porque o denominador não desconta fator de utilização. Responde à pergunta “quanta placa foi construída” e a nenhuma outra."],["2. Geração no ano","Participação em <b>energia</b>, em TWh, ao longo de um período. É o número relevante para substituição de combustível e para intensidade média de emissão. Tipicamente uma fração do primeiro para fontes variáveis."],["3. Geração em instante de pico","Participação máxima instantânea atingida em algum momento do período. É o recorde, e ele diz algo real — que o sistema consegue operar naquele regime — e não diz nada sobre volume. É o número mais citado em comunicado e o menos útil para comparação de matriz."],["4. Energia consumida líquida","Geração renovável efetivamente consumida no país, <b>líquida de corte de geração e de saldo de intercâmbio</b>. É o menor dos quatro e o único que descreve substituição real. Um sistema que gera muito e corta muito, ou que exporta o excedente e importa térmica na ponta, tem os números 1 e 2 altos e o 4 substancialmente menor."]] },
    { kind: 'nota', tom: "neutro", label: "A regra deste módulo, testada no seu próprio texto", html: "Nenhum número de penetração aparece aqui sem dizer qual dos quatro é. Se você encontrar um sem rótulo em qualquer ponto deste módulo, é defeito — e a validação de entrega inclui um teste específico para isso, porque declarar uma disciplina e violá-la é pior que não declarar." },
    { kind: 'titulo', numero: null, texto: "O que a interconexão explica, e o que ela esconde" },
    { kind: 'paragrafo', html: "Um sistema conectado a vizinhos com clima, horário e matriz diferentes precisa de menos reserva própria e aproveita diversidade que não tem em casa. Isso é <b>dotação</b> — ter vizinhos, e vizinhos com excedente em momentos complementares, não é escolha. Também transmite choques nas duas direções e cria uma disputa distributiva permanente: quem paga pela linha, quem recebe a renda de congestionamento, e qual país aceita depender do vizinho durante uma crise." },
    { kind: 'paragrafo', html: "A consequência comparativa é direta: <b>um sistema com alta penetração renovável e interconexão forte não demonstrou a mesma coisa que um sistema com alta penetração e interconexão fraca.</b> O primeiro resolveu parte do problema exportando-o; o segundo teve de resolvê-lo internamente, com corte de geração, armazenamento ou flexibilidade de demanda. Comparar os dois pelo número 1 ou pelo número 2 sem declarar o saldo de intercâmbio é a versão energética do defeito de perímetro." },
    { kind: 'titulo', numero: null, texto: "Dois casos europeus de arquitetura oposta" },
    { kind: 'paragrafo', html: "O bloco europeu construiu o maior mercado elétrico integrado do mundo, com regras comuns, acoplamento de mercados e operadores nacionais. A reforma de desenho de 2024 reforçou contratos de longo prazo e proteção do consumidor após a crise de preços, e desde setembro de 2025 o mercado do dia anterior opera com intervalos de quinze minutos, alinhando melhor a formação de preço à variabilidade das fontes. <b>Integração não elimina soberania</b>: cada Estado escolhe matriz, apoio a tecnologias, tributação e ritmo — e é por isso que dois países vizinhos, dentro do mesmo mercado acoplado, oferecem o contraste mais instrutivo do módulo." },
    { kind: 'tabela', linhas: [["","Caso A · expansão renovável acelerada","Caso B · base nuclear estruturante"],["<b>Dado de 2025, com grandeza</b>","Renováveis em cerca de <b>58,8% da geração líquida pública</b> — número 2 da escada acima. Preço médio do dia anterior em torno de <b>€89/MWh</b>, média aritmética horária. Saldo importador líquido no ano","Produção total de cerca de <b>547 TWh</b>, com <b>95,2%</b> de geração de baixo carbono e nuclear em torno de <b>373 TWh</b>. Intensidade média próxima de <b>20 gCO₂e/kWh</b>. Saldo exportador"],["<b>Parcela dominante</b>","<b>Política</b> — a trajetória resultou de decisões simultâneas sobre renováveis, nuclear e carvão, sustentadas por instrumento de apoio à receita ao longo de duas décadas","<b>Política</b> também, mas de horizonte muito mais longo: uma frota padronizada construída em ciclo de décadas, com cadeia industrial e operador únicos"],["<b>O que entrega</b>","Capacidade demonstrada de instalar renovável em escala e de criar indústria em torno disso","Escala de energia firme de baixa emissão, com previsibilidade operativa e capacidade de exportação"],["<b>O que custa</b>","Custo de rede, dependência de interconexão e necessidade de flexibilidade térmica que a métrica de participação não mostra","<b>Concentração tecnológica</b>: corrosão, manutenção, envelhecimento e disponibilidade de água de resfriamento podem afetar várias unidades ao mesmo tempo, como a década recente demonstrou"],["<b>Transferível ao Brasil?</b>","Limitadamente. O Brasil já parte de eletricidade de baixa emissão e de flexibilidade hidráulica; o caso A partia de matriz fóssil e de inverno com demanda térmica","A lição transferível não é a tecnologia — é <b>padronização, cadeia de manutenção e gestão de disponibilidade</b> para ativo complexo, que vale para qualquer tecnologia de grande porte"]] },
    { kind: 'paragrafo', html: "Há um terceiro caso na mesma região que isola a variável de interconexão: uma península com recurso solar e eólico excelente e ligação limitada ao resto do continente, onde a participação renovável fechou 2025 acima de metade da geração num dos países e o outro registrou renováveis equivalentes a mais de dois terços do consumo. Recurso excelente com interconexão limitada aumenta risco de corte de geração e de canibalização de preço — e o evento de interrupção generalizada de abril de 2025 na região reforçou que alta participação renovável exige proteção, controle, serviços de sistema e coordenação. <b>Reforçou isso; não provou causalidade simples entre renovável e falha</b>, e tratar o evento como prova é exatamente o tipo de conclusão por uma dimensão só que este módulo recusa." },
  ],
  'aula-17-10': [
    { kind: 'titulo', numero: null, texto: "Preço nodal com recurso e carga separados por mil quilômetros" },
    { kind: 'paragrafo', html: "Um sistema sul-americano longo e estreito, com geração liberalizada e preços locacionais. O recurso solar está concentrado no norte; grandes centros de carga e outras fontes estão separados por transmissão. A expansão renovável rápida derrubou preços em certas horas e elevou o vertimento quando linha e armazenamento ficaram atrás da oferta." },
    { kind: 'paragrafo', html: "É o caso mais diretamente útil para o Brasil, e a lição é contraintuitiva: <b>leilões e contratos de longo prazo podem viabilizar capacidade instalada nova mesmo quando o preço horário futuro se deteriora</b> — e é justamente por isso que o analista precisa testar separadamente risco de perfil, diferença de preço entre pontos, congestionamento, corte de geração, prazo de conexão e indexação. <b>Recurso solar excelente não garante receita excelente</b>, e a variável que rompe a ligação entre os dois é sempre a rede." },
    { kind: 'titulo', numero: null, texto: "Prevalência estatal com mercado atacadista preservado" },
    { kind: 'paragrafo', html: "Uma reforma de 2025 reorganizou o setor num país norte-americano de língua espanhola, substituiu reguladores e estabeleceu prevalência da empresa estatal com participação mínima garantida, preservando elementos do mercado atacadista e investimento privado sob novas condições. O currículo ancora esse marcador numa administração anterior; <b>o instrumento vigente é de outro ciclo político</b>, e a correção importa porque atribuir a mudança ao governo errado leva a projetar reversão no calendário errado." },
    { kind: 'paragrafo', html: "A leitura correta separa quatro camadas que costumam ser tratadas como uma: <b>texto legal, regulamentação secundária, implementação e prática de despacho</b>. Elas não avançam juntas, e o risco para um investidor mora na distância entre a primeira e a última. A comparação com o Brasil mostra que controle estatal e competição podem coexistir — o que decide credibilidade não é a proporção entre os dois, e sim regras de acesso, de pagamento e de arbitragem." },
    { kind: 'titulo', numero: null, texto: "Desenho sofisticado sob instabilidade macroeconômica" },
    { kind: 'paragrafo', html: "Um país vizinho com operação centralizada, mercado atacadista estruturado, presença forte de gás, hidráulica e nuclear, e histórico longo de contratos e subsídios. <b>O risco dominante não é ausência de engenharia nem de desenho — é a moeda.</b> Tarifas congeladas, atraso de pagamento, regra de indexação e câmbio podem destruir o sinal de investimento mesmo quando o despacho é tecnicamente competente." },
    { kind: 'paragrafo', html: "A lição é central para análise de financiamento de projeto e é a que mais frequentemente falta em comparação internacional: <b>um mercado de eletricidade não pode ser isolado da moeda, da inflação e da capacidade fiscal de quem compra</b>. Um desenho de mercado impecável denominado numa moeda instável entrega menos que um desenho medíocre numa moeda estável, e nenhuma das quatro dimensões do critério captura isso — é a variável que estava fora da grade na colisão declarada no §MAP." },
    { kind: 'titulo', numero: null, texto: "O maior crescimento absoluto de demanda do mundo" },
    { kind: 'paragrafo', html: "Um sistema asiático de escala continental, com ponta atendida acima de <b>270 GW</b> em maio de 2026, expansão simultânea de renováveis, carvão, transmissão e armazenamento, sob coordenação entre governo central e estados. Combina mercados de curto prazo, contratos de longo prazo, distribuidoras estaduais e leilões renováveis." },
    { kind: 'paragrafo', html: "O desafio ali não é tecnológico e não é de desenho de mercado: é financiar expansão mantendo acessibilidade, reduzir perda técnica e comercial, e resolver a solvência das distribuidoras estaduais, que são a contraparte de crédito de todo contrato de longo prazo do sistema. <b>A escala torna a eficiência de execução tão determinante quanto o custo tecnológico</b> — e é a demonstração de que a qualidade do comprador é um parâmetro de mercado, não um detalhe de crédito." },
    { kind: 'titulo', numero: null, texto: "Solar residencial em escala e planejamento integrado" },
    { kind: 'paragrafo', html: "Um mercado insular do hemisfério sul com despacho e preço de curto prazo em intervalos curtos entre estados, complementado por contratos financeiros e mecanismo de confiabilidade baseado em obrigação do agente supridor. A alta penetração de solar em telhado <b>reduz a demanda operacional no meio do dia</b> e transfere a ponta líquida para outras horas — o Módulo 11 já tratou o consumidor como produtor; o que é novo aqui é o efeito disso na formação de preço de um sistema inteiro." },
    { kind: 'paragrafo', html: "No último trimestre de 2025, renováveis forneceram mais da metade da energia daquele mercado pela primeira vez num trimestre, com preço médio de atacado próximo de <b>A$50/MWh</b>; no primeiro trimestre de 2026 a participação foi de <b>46,5%</b>, com geração solar distribuída em nível recorde contendo a demanda operacional. Baterias expandiram rapidamente. E o plano integrado de sistema de 2026 conclui que renováveis conectadas por rede, firmadas por armazenamento e apoiadas por gás formam o caminho de menor custo à medida que o carvão se aposenta." },
    { kind: 'nota', tom: "neutro", label: "A lição de desenho, e ela não é sobre tecnologia", html: "O que esse caso oferece de mais transferível é o <b>planejamento com sequência explícita</b>: um documento público que ordena, no tempo, aposentadoria de unidades, expansão de transmissão, armazenamento e reserva firme. Planejamento não substitui mercado — ele orienta a sequência que o mercado sozinho não coordena. E note a parcela: isso é <b>desenho institucional</b>, importável em princípio, e depende de uma instituição com mandato para publicar e revisar o plano, o que é precisamente a pergunta do Instrumento 08." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Capacidade entregue: <b>montar uma pilha de custo comparável entre jurisdições e declarar explicitamente o que ficou de fora</b>. É o que separa uma comparação de preço utilizável de um número de manchete. No <b>GridAlpha Brasil Terminal</b>, a decomposição da fatura industrial por camada — energia, transporte, encargos, tributos — é a metade brasileira dessa conta, e o Módulo 10 já a dissecou; o que este instrumento acrescenta é a disciplina de exigir a mesma dissecação do outro lado antes de comparar." },
  ],
  'aula-17-11': [
    { kind: 'titulo', numero: null, texto: "As quatro categorias de defeito" },
    { kind: 'tabela', linhas: [["Categoria","O que exatamente falha","A pergunta que desarma"],["<b>Perímetro não declarado</b>","Dois números que medem coisas diferentes são apresentados como comparáveis. Camada de custo, classe de consumidor, mercado de formação, período ou base cambial divergem sem que ninguém tenha dito","“O que exatamente está dentro de cada um desses dois números?”"],["<b>Atribuição errada</b>","A diferença é real e sobreviveu ao perímetro, mas é atribuída à parcela errada: dotação lida como lição de política, ou política lida como desenho","“Quanto disso é dotação, quanto é desenho, quanto é política — e qual das três não explica nada?”"],["<b>Pressuposto institucional omitido</b>","Um mecanismo é descrito sem a instituição que o sustenta, e a conclusão implícita é que basta copiar a regra","“Quem opera, quem contabiliza, quem liquida, quem fiscaliza e quem julga isso — e quem faz cada uma dessas coisas aqui?”"],["<b>Unidade de comparação inconsistente</b>","Capacidade instalada contra geração; nominal contra paridade de poder de compra; ano civil contra ano hidrológico; média aritmética contra ponta; meta futura contra resultado realizado","“Estes dois números têm a mesma unidade e o mesmo período?”"]] },
    { kind: 'titulo', numero: null, texto: "O fechamento, e ele recusa as duas conclusões fáceis" },
    { kind: 'paragrafo', html: "Nenhum desenho domina todas as dimensões, e a §MAP mostrou por quê: as quatro ordenações do critério discordam entre si, com a maior concordância entre quaisquer duas ficando em metade dos pares. Um mercado com formação de preço granular pode ter adequação sob pressão; um com descarbonização avançada por dotação pode ter estrutura de investimento inteiramente dependente de instrumento fiscal com data de término; um com planejamento estatal robusto pode ter sinal econômico irrelevante para o agente privado." },
    { kind: 'paragrafo', html: "A vantagem competitiva de quem faz essa análise não está em memorizar posições. Está em reconstruir mecanismo, normalizar número, identificar quem absorve risco e explicar por que uma lição funciona num lugar e falha em outro. As duas conclusões que este módulo recusa, com igual firmeza:" },
    { kind: 'tabela', linhas: [["“O Brasil está atrasado”","Atrasado em relação a qual métrica, medida com qual perímetro? Se a métrica for participação renovável em geração, o sistema brasileiro parte de um patamar que a maioria das jurisdições comparadas não alcançou — e por dotação, o que também não é mérito. Se for granularidade de preço, a diferença é de desenho e o custo dela é discutível nos dois sentidos. Se for existência de mercado de capacidade, a função existe aqui sob outro nome. <b>A frase junta quatro afirmações de naturezas diferentes num julgamento só.</b>"],["“O modelo brasileiro é único e incomparável”","Também falso, e pela razão simétrica. O despacho por custo declarado existe em outras jurisdições; a formação de preço uniforme por área existe; a contratação por leilão de longo prazo é o arranjo dominante em quatro das dezessete jurisdições desta grade. O que é incomum é a <b>combinação</b> — e combinação incomum se descreve, se decompõe e se compara peça por peça. Declarar incomparabilidade é uma forma de recusar a análise."]] },
    { kind: 'paragrafo', html: "A resposta correta a ambas devolve quatro coisas: <b>perímetro</b>, <b>decomposição em três parcelas</b>, <b>pressuposto institucional</b> e <b>as condições que fariam cada leitura mudar</b>. É a mesma disciplina que o Módulo 12 ensinou para “o Brasil é uma boa aposta?”, o 13 para “essa ação é uma boa compra?”, o 14 para “qual biocombustível é o melhor investimento?”, o 15 para “o pré-sal é compatível com o clima?” e o 16 para “isso vai transformar o setor?”." },
    { kind: 'nota', tom: "neutro", label: "Ponte", html: "Este módulo termina o nível conceitual do currículo. O que vem depois é a caixa de ferramentas — a planilha que transforma tudo isto em conta feita." },
  ],
};

/** Os dezoito exercícios do § Ex — todos soltos (nenhum aponta aula).
 *  Nesta fonte o <summary> é o enunciado e o `det-bd` é o gabarito. */
export const MODULO_17_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: "m17-ex-01",
    kind: 'discursiva' as const,
    prompt: "Um relatório apresenta a tarifa industrial média de dois países e conclui que a indústria de um deles é mais competitiva em energia. O que falta declarar?",
    points: 1,
    config: { tag: "01", gabarito: "Pelo menos cinco das sete. <b>Camada</b> — a tarifa “média industrial” de cada país pode incluir conjuntos diferentes de transporte, encargos e tributos. <b>Consumidor</b> — nível de tensão e fator de carga do agregado; “a indústria” é uma média sobre composições setoriais diferentes. <b>Mercado de formação</b> — regulado, contratado ou atacado. <b>Tributo recuperável</b> — se é recuperável, não é custo, e precisa ser tratado igual nos dois lados. <b>Base cambial</b> — nominal para competitividade exportadora, nunca paridade. Só depois disso a diferença que sobrar é objeto de decomposição." },
  },
  {
    id: "m17-ex-02",
    kind: 'discursiva' as const,
    prompt: "Um preço médio de curto prazo de €89/MWh e um valor de liquidação de diferenças brasileiro do mesmo ano são apresentados lado a lado. Quantas declarações faltam?",
    points: 1,
    config: { tag: "02", gabarito: "Seis. Falta camada — o primeiro é atacado puro, o segundo também, mas <b>nenhum dos dois é o que uma fábrica paga</b>. Falta consumidor. Falta mercado de formação — um é resultado de ofertas, o outro é valor modelado que a carga contratada não desembolsa. Falta granularidade — média aritmética horária contra qual estatística. Falta período — ano civil contra ano hidrológico. E falta desenho — preço zonal formado por oferta contra preço uniforme por submercado formado por otimização. A única declarada é a cambial. <b>É o exemplo canônico deste módulo.</b>" },
  },
  {
    id: "m17-ex-03",
    kind: 'discursiva' as const,
    prompt: "Um interlocutor cita o preço de um nó específico de um mercado nodal como “o preço da energia naquele país”. Qual declaração ele violou e qual é a consequência?",
    points: 1,
    config: { tag: "03", gabarito: "A sétima — <b>qual desenho formou o número</b>. Preço nodal é o custo de atender mais um megawatt <b>naquele ponto</b>, com congestionamento e perdas dentro. Não é o preço do país; é o preço de um lugar. A consequência prática é grande: dentro do mesmo mercado, dois nós podem divergir por múltiplos numa hora congestionada. Apresentar dado de um ponto como dado de uma região é erro distinto de apresentar dado de uma jurisdição como dado de outra, e os dois aparecem juntos com frequência." },
  },
  {
    id: "m17-ex-04",
    kind: 'discursiva' as const,
    prompt: "Dois países publicam preço médio industrial. Um exclui tributos, o outro inclui. O tributo do segundo é integralmente recuperável pela indústria. Como corrigir?",
    points: 1,
    config: { tag: "04", gabarito: "Zere o tributo recuperável nos <b>dois</b> lados, ou mantenha-o nos dois com a mesma regra. A correção assimétrica — retirar de um só — é o erro mais comum na tentativa de corrigir. E declare o que sobrou de fora: se o segundo país tem tributo não recuperável embutido no mesmo número, ele é custo real e permanece. A regra geral: <b>a normalização se aplica simetricamente ou não se aplica.</b>" },
  },
  {
    id: "m17-ex-05",
    kind: 'discursiva' as const,
    prompt: "Um estudo compara o custo de energia de dois centros de dados usando a média aritmética horária de preço de atacado de cada mercado. Onde está o defeito?",
    points: 1,
    config: { tag: "05", gabarito: "Na quarta declaração. Um centro de dados tem perfil de consumo aproximadamente plano; a média aritmética horária atribui o mesmo peso a madrugada e a ponta e, num sistema com alta penetração solar, <b>subestima sistematicamente</b> o custo de quem consome à noite e superestima o de quem consome ao meio-dia. A estatística correta é a média ponderada pelo perfil do próprio consumidor. Se essa não estiver disponível, a média ponderada pela carga do sistema é a segunda melhor — e a diferença entre as três deve ser reportada, não escolhida." },
  },
  {
    id: "m17-ex-06",
    kind: 'discursiva' as const,
    prompt: "Um sistema tem intensidade média de emissão perto de 20 gCO₂e/kWh e o brasileiro tem intensidade baixa por outro caminho. Quanto de cada diferença é dotação, desenho e política?",
    points: 1,
    config: { tag: "06", gabarito: "No primeiro, <b>política</b> vincula — uma frota nuclear padronizada construída ao longo de décadas, com cadeia industrial e operador únicos, sustentada por decisão de Estado. <b>Dotação</b> concorre — urânio acessível, água de resfriamento, densidade de carga que justifica unidades grandes. <b>Desenho</b> quase não explica</b>: a mesma frota existiria sob outra arquitetura de mercado. No brasileiro, <b>dotação</b> vincula — bacia continental —, política concorre via leilões renováveis, e desenho novamente quase não explica. <b>Nenhuma das duas trajetórias é lição de desenho de mercado</b>, e é isso que a decomposição revela." },
  },
  {
    id: "m17-ex-07",
    kind: 'discursiva' as const,
    prompt: "Dois mercados organizados do mesmo país têm distribuições de preço de curto prazo radicalmente diferentes. Qual parcela vincula e por que este par é especial?",
    points: 1,
    config: { tag: "07", gabarito: "<b>Desenho</b>, com folga, e o par é especial porque as outras duas parcelas estão quase constantes: mesmo país, mesma moeda, mesmo regime tributário federal, base de combustível predominante semelhante, cadeia de equipamento idêntica. Um remunera adequação por leilão central de capacidade e pode manter a cauda de preço de energia contida; o outro não tem esse produto e <b>precisa</b> da cauda para que a adequação seja remunerada. É o experimento mais limpo disponível para isolar a parcela de desenho, e é por isso que os dois ocupam duas das seis fichas." },
  },
  {
    id: "m17-ex-08",
    kind: 'discursiva' as const,
    prompt: "Uma jurisdição viu o custo de capital de projetos eólicos e solares subir em pouco mais de um ano sem que o desenho de mercado mudasse. Decomponha.",
    points: 1,
    config: { tag: "08", gabarito: "<b>Política</b> vincula integralmente, e é a demonstração mais limpa da volatilidade dessa parcela: uma lei orçamentária antecipou o término de créditos tributários, uma ordem executiva determinou aplicação estrita, uma orientação administrativa restringiu o critério de início de construção, e uma decisão judicial restaurou parte do critério restringido. <b>Quatro instrumentos, quatro instituições, um ciclo.</b> Dotação não se moveu; desenho não se moveu. Quem projetou continuidade errou e quem projetou reversão total também errou." },
  },
  {
    id: "m17-ex-09",
    kind: 'discursiva' as const,
    prompt: "“Eles constroem em um ano o que levamos cinco.” Qual das três parcelas explica, e o que a decomposição de três precisa nomear explicitamente aqui?",
    points: 1,
    config: { tag: "09", gabarito: "Política concorre via meta e crédito dirigido; desenho concorre pouco, porque o mercado ainda não é o mecanismo dominante de alocação naquele sistema. O que <b>vincula</b> é capacidade institucional de execução — financiamento estatal em escala, cadeia industrial doméstica, autoridade territorial e coordenação de longo prazo. Ela <b>se comporta como dotação</b> para efeito de decisão, porque não é importável no horizonte de um investimento, mesmo não sendo geografia. É o caso em que a decomposição de três precisa declarar a fronteira entre as suas categorias em vez de forçar o caso numa delas." },
  },
  {
    id: "m17-ex-10",
    kind: 'discursiva' as const,
    prompt: "Um mercado com recurso solar excelente registra preços horários baixos e corte de geração crescente. Um desenvolvedor conclui que é o melhor lugar para investir em solar. Onde está o erro de atribuição?",
    points: 1,
    config: { tag: "10", gabarito: "Ele leu <b>dotação</b> como se fosse retorno. Recurso excelente é competitividade em <b>custo</b>; receita depende de preço capturado, e preço capturado cai exatamente onde a penetração daquela fonte é alta — canibalização — e onde a rede não escoa — corte de geração. A variável que rompe a ligação entre custo e receita é <b>desenho e rede</b>, não recurso. “Recurso solar excelente não garante receita excelente” é a formulação curta." },
  },
  {
    id: "m17-ex-11",
    kind: 'discursiva' as const,
    prompt: "Um parceiro sugere adotar um leilão central de capacidade no Brasil. De quais funções institucionais o mecanismo depende, e quais existem aqui?",
    points: 1,
    config: { tag: "11", gabarito: "Cinco funções. <b>Cálculo de requisito</b> com modelo probabilístico auditável — existe, distribuída entre planejador e operador. <b>Acreditação por contribuição marginal à confiabilidade</b> com metodologia publicada — parcialmente existe, com metodologia distinta. <b>Curva de demanda administrada</b> — não existe como instituição, porque o instrumento brasileiro não forma preço separado para o atributo. <b>Leilão e obrigação</b> — existe, com desenho diferente. <b>Penalidade crível por não-desempenho</b> — existe sob outra forma, vinculada a contrato e a lastro. A resposta correta não é sim nem não: é que <b>duas das cinco funções mudariam de natureza</b>, e essa é a pergunta a devolver." },
  },
  {
    id: "m17-ex-12",
    kind: 'discursiva' as const,
    prompt: "Um mercado só de energia depende de um pressuposto que não é uma instituição formal. Qual é, e por que ele é o mais frágil da lista?",
    points: 1,
    config: { tag: "12", gabarito: "O <b>compromisso crível de não intervir no preço em evento de escassez</b>. Não é um órgão nem uma norma: é uma expectativa sobre o comportamento futuro de reguladores e legisladores. Se o preço extremo é revertido administrativamente no primeiro evento, a receita que justificava o investimento em capacidade de ponta desaparece e o desenho para de funcionar sem que nenhuma regra tenha sido formalmente alterada. É o pressuposto mais frágil porque é o único que não tem titular identificável a quem cobrar." },
  },
  {
    id: "m17-ex-13",
    kind: 'discursiva' as const,
    prompt: "Um mecanismo de ajuste de fronteira transfere carga institucional para o exportador. Quais funções ele exige do lado de origem, e quais existem no Brasil hoje?",
    points: 1,
    config: { tag: "13", gabarito: "Três do lado de origem. <b>Medição, relato e verificação por instalação e por produto</b> — existe em regime voluntário e fragmentado; o regime obrigatório tem relato previsto a partir de 2027. <b>Verificação acreditada por terceiro reconhecido pela autoridade de destino</b> — existe como serviço privado, não como sistema. <b>Preço de carbono efetivamente pago, comprovável e certificável</b> — não existe</b>, e não existirá antes de 2030 no calendário vigente. A ausência da terceira é o que torna a via de preço de referência padrão a única disponível." },
  },
  {
    id: "m17-ex-14",
    kind: 'discursiva' as const,
    prompt: "Uma jurisdição resolve congestionamento interno por redespacho com custo socializado, outra por preço nodal. Qual instituição cada arranjo exige que a outra não exige?",
    points: 1,
    config: { tag: "14", gabarito: "O arranjo nodal exige um <b>mercado de direitos financeiros sobre a diferença de congestionamento entre pontos</b>, com alocação, negociação, liquidação e regra de suficiência de receita — quatro funções que só existem porque o preço é nodal. O arranjo zonal exige uma <b>regra de recuperação e alocação do custo de redespacho</b>, que é objeto de disputa regulatória permanente e exige autoridade para arbitrá-la. Nenhum dos dois é mais simples: eles deslocam a complexidade de um lugar para outro." },
  },
  {
    id: "m17-ex-15",
    kind: 'discursiva' as const,
    prompt: "“Quase metade da capacidade daquele sistema já é eólica e solar.” Qual dos quatro números é, e o que ele não permite concluir?",
    points: 1,
    config: { tag: "15", gabarito: "É o <b>número 1 — capacidade instalada</b>, em potência. Não permite concluir nada sobre geração, porque o fator de utilização das duas fontes é uma fração do de uma térmica de base. É compatível com térmica ainda majoritária em energia no mesmo ano. E não permite concluir nada sobre substituição real, que exigiria o número 4 — energia consumida líquida de corte e de saldo de intercâmbio." },
  },
  {
    id: "m17-ex-16",
    kind: 'discursiva' as const,
    prompt: "Uma usina de 1 GW gera 2,19 TWh num ano. Qual o fator de utilização, e por que ele não basta para comparar duas jurisdições?",
    points: 1,
    config: { tag: "16", gabarito: "2.190.000 MWh ÷ (1.000 MW × 8.760 h) = <b>25%</b>. Não basta porque o fator de utilização observado mistura três coisas: qualidade do recurso, disponibilidade da unidade e <b>corte de geração imposto pela rede</b>. Duas jurisdições com o mesmo recurso e o mesmo equipamento podem apresentar fatores diferentes por causa apenas da terceira. Comparar fator de utilização sem separar corte de geração atribui à tecnologia um efeito que é da rede." },
  },
  {
    id: "m17-ex-17",
    kind: 'discursiva' as const,
    prompt: "Um relatório compara a meta de participação renovável de 2030 de uma jurisdição com o resultado de 2025 de outra. Qual erro de unidade é esse, e como corrigir?",
    points: 1,
    config: { tag: "17", gabarito: "É comparação de <b>futuro normativo contra histórico realizado</b> — a versão de unidade do defeito de estágio que o Módulo 16 catalogou. A correção tem três passos: separe explicitamente meta, política adotada e resultado verificado; compare resultado com resultado e meta com meta; e, se quiser avaliar a meta, aplique a régua de estágio ao instrumento que a sustenta, para saber se ela é anúncio, norma aprovada ou norma regulamentada." },
  },
  {
    id: "m17-ex-18",
    kind: 'discursiva' as const,
    prompt: "Um exportador estima exposição a um mecanismo de fronteira multiplicando volume por intensidade por preço de certificado. Liste três razões pelas quais o número resultante é de outra grandeza.",
    points: 1,
    config: { tag: "18", gabarito: "<b>Primeira:</b> o fator de entrada gradual — a obrigação do primeiro ano é uma fração pequena da exposição bruta e cresce até meados da década de 2030. <b>Segunda:</b> a emissão indireta associada à eletricidade não é contabilizada para ferro, aço e alumínio no regime definitivo, o que retira da conta justamente a parcela elétrica. <b>Terceira:</b> o abatimento por preço de carbono pago na origem, quando existir, reduz o número — e o preço de certificado a usar é o valor oficial publicado para o período, não uma cotação de mercado qualquer. Uma quarta, anterior a todas: o enquadramento em oito dígitos do produto pode colocá-lo fora da lista." },
  },
];

export const MODULO_17_AULAS: CurriculumAula[] = [
  {
    id: 'aula-17-01',
    moduleId: 'modulo-17',
    number: 1,
    totalInModule: 11,
    title: "As sete declarações que precedem qualquer comparação de preço",
    subtitle: "Perímetro",
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
    id: 'aula-17-02',
    moduleId: 'modulo-17',
    number: 2,
    totalInModule: 11,
    title: "Dotação, desenho e política: a diferença que sobreviveu ao perímetro",
    subtitle: "Atribuição",
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
    id: 'aula-17-03',
    moduleId: 'modulo-17',
    number: 3,
    totalInModule: 11,
    title: "Por custo declarado ou por oferta; nodal, zonal ou uniforme",
    subtitle: "Desenho de despacho",
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
    id: 'aula-17-04',
    moduleId: 'modulo-17',
    number: 4,
    totalInModule: 11,
    title: "Mercado de capacidade é um produto, não uma quantidade",
    subtitle: "Disponibilidade",
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
    id: 'aula-17-05',
    moduleId: 'modulo-17',
    number: 5,
    totalInModule: 11,
    title: "Sete operadores, um país, e o experimento mais limpo do mundo",
    subtitle: "Mercados organizados",
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
    id: 'aula-17-06',
    moduleId: 'modulo-17',
    number: 6,
    totalInModule: 11,
    title: "A parcela de política, isolada no ambiente mais limpo possível",
    subtitle: "Ciclo político",
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
    id: 'aula-17-07',
    moduleId: 'modulo-17',
    number: 7,
    totalInModule: 11,
    title: "O maior sistema do mundo em capacidade instalada, e o que isso não significa",
    subtitle: "Escala e direcionamento",
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
    id: 'aula-17-08',
    moduleId: 'modulo-17',
    number: 8,
    totalInModule: 11,
    title: "Teto e comércio, tributo e fronteira são três mecanismos distintos",
    subtitle: "Carbono comparado",
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
    id: 'aula-17-09',
    moduleId: 'modulo-17',
    number: 9,
    totalInModule: 11,
    title: "Quatro números diferentes recebem o mesmo nome",
    subtitle: "Penetração",
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
    id: 'aula-17-10',
    moduleId: 'modulo-17',
    number: 10,
    totalInModule: 11,
    title: "Cinco casos que ensinam o que os grandes não ensinam",
    subtitle: "Os outros mercados",
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
    id: 'aula-17-11',
    moduleId: 'modulo-17',
    number: 11,
    totalInModule: 11,
    title: "O verificador aplicado, e o fechamento sem ranking",
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

export const getAulaModulo17 = (id: string): CurriculumAula | undefined =>
  MODULO_17_AULAS.find((a) => a.id === id);
