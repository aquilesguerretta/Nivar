// alexandria-modulo-11-content.ts
// Bloco 11 — Geração Distribuída e a Anatomia de uma Proposta Solar.
// Nível 2, track 'brasil'. Sexto módulo da Trilha 2.
//
// ── DIVERGÊNCIA DE TÍTULO, REGISTRADA E NÃO CORRIGIDA ─────────
// O catálogo da FOUNDRY (`alexandria-blocks.ts`) traz
//   title: 'Energia Solar e Análise de Propostas', priority: 'confirmar'
// — título derivado de evidência circunstancial na Wave 1, nunca
// confirmado em cabeçalho literal. A fonte, que agora existe, declara
// outro:
//   <title>  Alexandria · Módulo 11 — Geração Distribuída e a Anatomia
//            de uma Proposta Solar
//   <h1>     Geração Distribuída e a Anatomia de uma Proposta Solar
// Os dois títulos descrevem o mesmo conteúdo, mas o do catálogo é mais
// estreito: o módulo trata de GERAÇÃO DISTRIBUÍDA inteira (marco legal,
// porte, modalidades, regimes de compensação) e a análise de proposta é
// a aplicação, não o assunto. `alexandria-blocks.ts` é somente-leitura
// nesta wave — a divergência fica aqui, e a interface segue mostrando o
// título do catálogo até a FOUNDRY reabrir o arquivo.
//
// ── VOCABULÁRIO: TERCEIRA VARIANTE DA SÉRIE ──────────────────
// Seletores dos Módulos 01-03: ZERO. É o vocabulário abreviado dos
// 04-09, mas com duas diferenças medidas antes de extrair:
//   · `sec-id` inverte o negrito — `§Ex · <b>Exercícios</b>` aqui,
//     `<b>§Ex</b> · Exercícios` nos anteriores;
//   · `inst-hd` inverte a ordem — `span.id` antes de `span.nm`.
//
// ── CONTAGEM REAL ────────────────────────────────────────────
// 18 seções = 8 aulas + 10 de aparato. 169 blocos de apostila.
// §Ex anuncia "Quatorze exercícios" e há 14 `div.box` com gabarito.
// §Lex tem 150 `.term` (não extraídos nesta wave — glossário é escopo
// próprio, fechado até o Módulo 08 na Wave 34).
//
// ── COBERTURA DE TEXTO POR AULA (o gate do protocolo §2) ─────
// Primeira medição: cinco das oito abaixo de 85% — 61,9% na Aula 01.
// A contagem de ELEMENTO teria passado. As estruturas descartadas em
// silêncio eram cinco, todas recuperadas:
//   `div.lv`      explicador em três níveis (4×) → nota com os três
//                 rotulados dentro, precedente dos Módulos 04-06
//   `div.box gd`  e `box rd` — o callout com `span.tag` (28×) → nota
//   `div.chain`   cadeia de precedência com `.ck2` (2×) → lista
//   `p.srcnote`   base normativa (9×) → nota rotulada 'Fonte'
//   `div.fi`      ficha sigla/tipo + N linhas (10×, 44 pares) →
//                 titulo + tabela, precedente do Módulo 09
// Cobertura final: 99,4% a 99,8% nas oito, 99,7% no agregado.
//
// ── GRAVURA: NENHUMA, E É O ESTADO CORRETO ───────────────────
// `illustrationPrefix: null` no catálogo e ZERO `<img>` no markup —
// os dois sinais concordam. `illustrations: []` nas oito, sem forçar
// biblioteca de outro bloco (mesmo caso dos Blocos 04 e 05).
//
// ── video: null, MEDIDO ──────────────────────────────────────
// Zero <video>, <iframe>, youtube, vimeo e .mp4 no arquivo inteiro.


import type { CurriculumAula, Instrument, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';

export const MODULO_11_LEAD: Record<string, string> = {
  'aula-11-01': "Esta é a aula de método, e ela vem primeiro por uma razão que não é pedagógica e sim operacional: sem ela, toda conversa sobre proposta solar converge, em menos de cinco minutos, para a única pergunta que não pode ser respondida de forma responsável no começo — quanto tempo leva para se pagar. A função desta aula é dar a Aquiles uma resposta melhor do que \"não sei\", e melhor do que um número: uma sequência.",
  'aula-11-02': "O currículo descreve o marco regulatório da geração distribuída em três linhas: uma resolução de 2012 que criou a modalidade, uma lei de 2022 que virou marco legal, e um cronograma até 2045. A descrição está correta e é insuficiente por um fator de dois. A cadeia real tem seis instrumentos normativos, duas peças ainda não escritas, e duas fronteiras que precisam ser fechadas para que a matéria não vaze. Esta aula percorre a cadeia inteira, e fecha as duas fronteiras.",
  'aula-11-03': "Esta aula responde a duas perguntas que a proposta comercial quase sempre afirma sem demonstrar: em que classe de porte o sistema descrito se enquadra, e se a modalidade de participação declarada está de fato disponível para o arranjo de titularidade do cliente. As duas são de Eixo 2 — resposta binária, verificável contra norma, sem margem de interpretação. E as duas são erradas com frequência.",
  'aula-11-04': "Esta é a aula mais densa do módulo e a que produz o achado de maior peso financeiro numa avaliação de proposta. A frase \"o sistema paga sessenta por cento do componente de rede\" é incompleta e, sem um segundo campo, é falsa metade das vezes. Falta o sujeito: sessenta por cento aplica-se a <b>qual regime</b>. E o regime não depende do equipamento, do porte nem da modalidade — depende, antes de tudo, da <b>data em que o pedido de acesso foi protocolado na distribuidora</b>.",
  'aula-11-05': "Eixo 1. Quatro afirmações que toda proposta faz e que têm, todas, fonte independente pública e brasileira. Esta aula ensina qual é a fonte de cada uma, como consultá-la, qual é a conta que liga a fonte à afirmação, e qual desvio significa o quê. Nenhuma dessas verificações exige engenheiro; três delas exigem menos de cinco minutos.",
  'aula-11-06': "Eixo 3. Aqui não existe verificação de valor, e é preciso dizer isso com todas as letras antes de qualquer coisa: ninguém sabe qual será a tarifa daqui a dez anos, nem o vendedor, nem o comprador, nem a GridAlpha. O que existe é premissa ancorada e premissa solta, e a competência desta aula é distinguir as duas — e identificar as três premissas que uma proposta faz sem escrever.",
  'aula-11-07': "Eixo 4, e é o eixo que sobrevive à instalação. Quando o sistema está no telhado, a geração estimada já é história e a trajetória tarifária já é realidade; o que continua operando por vinte anos é o contrato. Esta aula ensina a ler o texto — e acrescenta uma matéria que o currículo não previa e que é indispensável: <b>as hipóteses em que a unidade perde o regime de faturamento que tinha</b>.",
  'aula-11-08': "Esta aula converte as sete anteriores em procedimento. O critério de domínio deste bloco tem duas dimensões, não uma: identificar se as premissas são realistas <b>e</b> se o contrato tem cláusula tóxica. São competências distintas, com fontes distintas e ritmos distintos, e a única forma de executá-las em trinta minutos é rodá-las em paralelo, com sincronização em três pontos.",
};

/** 169 blocos nas oito aulas, na ordem do documento. O explicador em
 *  três níveis (`div.lv`) vira UMA nota com os três rotulados dentro,
 *  como nos Módulos 04-06; a ficha (`div.fi`) vira titulo + tabela,
 *  como no Módulo 09. */
export const MODULO_11_CORPO: Record<string, AulaBloco[]> = {
  'aula-11-01': [
    { kind: 'titulo', numero: "01.1", texto: "Por que \"vale a pena?\" é a pergunta errada no minuto zero" },
    { kind: 'paragrafo', html: "Quando um decisor entrega uma proposta e pergunta se vale a pena, ele está pedindo que se avalie a <b>conclusão</b> de uma cadeia de inferências cujos elos ele não viu. A conclusão que a proposta apresenta é o produto de, tipicamente, sete premissas encadeadas: irradiância do local, perdas do sistema, geração anual estimada, taxa de degradação, custo de operação e manutenção, trajetória de reajuste tarifário e regime regulatório aplicável ao faturamento da energia compensada. Errar qualquer uma delas propaga o erro por toda a cadeia, e o erro propagado não aparece como erro — aparece como número." },
    { kind: 'paragrafo', html: "A resposta correta à pergunta \"vale a pena?\" é, no minuto zero, <b>outra pergunta</b>, e ela é sempre a mesma: <i>quais dessas premissas o documento declara, e de onde ele diz que cada uma veio?</i> Isso não é evasiva. É a única forma de responder à pergunta original de um jeito que sobreviva a auditoria. E, na prática comercial, é também a pergunta que separa um interlocutor de um fornecedor — porque o fornecedor responde à pergunta como feita, e o interlocutor responde à pergunta que deveria ter sido feita." },
    { kind: 'paragrafo', html: "Há uma consequência de comportamento que vale nomear. Quem responde \"vale a pena\" com um número ganha a conversa e perde a posição. Ganha a conversa porque o decisor queria um número. Perde a posição porque, a partir daquele instante, está do mesmo lado do vendedor — os dois agora afirmam coisas sobre o futuro, e a diferença entre eles vira uma questão de credibilidade pessoal, não de método. Quem devolve a pergunta sobre premissas está oferecendo algo que o vendedor estruturalmente não pode oferecer: uma verificação que não depende de acreditar em ninguém." },
    { kind: 'titulo', numero: "01.2", texto: "Os quatro eixos têm naturezas epistemológicas distintas" },
    { kind: 'paragrafo', html: "A separação em quatro eixos não é organizacional. Ela reflete o fato de que os itens de uma proposta admitem <b>tipos diferentes de verdade</b>, e portanto exigem métodos diferentes de verificação. Confundir os tipos é a origem da maior parte dos erros de avaliação." },
    { kind: 'paragrafo', html: "Um item do <b>Eixo 1</b> admite verificação por consulta a uma base de referência: a afirmação é comparável a um valor publicado, e a divergência é mensurável em percentual. Um item do <b>Eixo 2</b> admite verificação por subsunção normativa: a afirmação ou se encaixa no que a norma vigente diz para aquele caso, ou não se encaixa, e não há gradação. Um item do <b>Eixo 3</b> não admite verificação de valor, apenas de <b>razoabilidade e de declarabilidade</b>: pergunta-se se a premissa está declarada e se está ancorada em série histórica identificável, não se ela é verdadeira. E um item do <b>Eixo 4</b> não admite verificação numérica nenhuma: exige leitura de texto e produz como saída uma pergunta a fazer, não um número a comparar." },
    { kind: 'nota', tom: "neutro", label: "Os quatro eixos de verificação", html: "<b>Criança de 12 anos.</b> Imagine que alguém te oferece um pé de laranja e diz que ele vai dar duzentas laranjas por ano. Tem coisas que você consegue conferir sozinho: se naquele quintal bate sol, se o pé é da espécie que ele disse, se a placa do viveiro confere. Tem coisas que dependem de regra: se pode plantar árvore ali, se o vizinho pode pegar laranja também. Tem coisas que são chute educado: quanto vai custar a laranja daqui a dez anos. E tem coisas que estão escritas no papel do combinado: quem paga se o pé morrer no segundo ano. São quatro tipos de pergunta diferentes, e cada uma se responde de um jeito. Misturar os quatro é como usar régua para medir temperatura. <b>Executivo não técnico.</b> Uma proposta solar mistura quatro categorias de afirmação que sua equipe trata como se fossem uma só. A primeira é física e tem referência pública: quanto sol bate ali, quanto o equipamento entrega. A segunda é regulatória e tem resposta binária: qual regime se aplica ao seu caso, qual modalidade seu arranjo societário permite. A terceira é premissa financeira: quanto a tarifa sobe, quanto custa manter. A quarta é contratual: quem responde quando dá errado. Só a primeira e a segunda podem ser conferidas contra fonte externa. A terceira só pode ser julgada como razoável ou não, e a quarta só pode ser lida. Uma decisão de investimento que trata as quatro como se fossem igualmente confiáveis está superestimando a própria informação. <b>Especialista do setor.</b> A taxonomia separa afirmações por regime de validação: Eixo 1 admite falsificação empírica contra base climatológica de referência e contra datasheet certificado, com desvio expresso em percentual; Eixo 2 admite subsunção a norma vigente, com saída binária e sem gradação, incluindo classificação por porte, elegibilidade de modalidade do sistema de compensação e regime de faturamento da energia compensada conforme data de protocolo; Eixo 3 não admite validação de valor, apenas avaliação de ancoragem em série histórica identificável e de declarabilidade explícita da premissa — premissa não declarada é premissa de valor zero embutida; Eixo 4 é texto contratual, cuja saída não é número e sim conjunto de perguntas com destinatário. O erro sistêmico de avaliação consiste em promover premissas do Eixo 3 ao estatuto epistêmico do Eixo 1 por força de aparecerem na mesma planilha, com a mesma formatação e o mesmo número de casas decimais." },
    { kind: 'titulo', numero: "01.3", texto: "A ordem de precedência, e por que ela é assimétrica" },
    { kind: 'paragrafo', html: "Os quatro eixos não são paralelos em importância nem em tempo. Existe uma precedência lógica, e ela é o núcleo do método:" },
    { kind: 'lista', itens: ["<b>Primeiro — Eixo 1.</b> Confirme a premissa física. Geração estimada contra irradiância publicada da localidade, potência do equipamento contra registro de conformidade, degradação assumida contra o termo de garantia do próprio módulo cotado. Sem isso confirmado, nada mais tem base.", "<b>Segundo — Eixo 2.</b> Confirme o enquadramento regulatório. Porte, modalidade, regime de faturamento, data de protocolo. Um erro aqui pode invalidar a proposta inteira, e é o único eixo em que o erro é demonstrável sem margem de interpretação.", "<b>Terceiro — Eixo 3.</b> Só agora avalie a premissa financeira. Trajetória tarifária, operação e manutenção, vida útil do inversor. E avalie como premissa: está declarada? está ancorada? Não como fato.", "<b>Em paralelo — Eixo 4.</b> Leia o contrato desde o começo, em trilha própria. Ele não depende dos outros três e tem um problema de sequência: costuma chegar depois de a decisão já ter sido tomada."] },
    { kind: 'paragrafo', html: "A assimetria vale ser explicitada porque ela contraria o instinto comercial. O vendedor apresenta na ordem inversa: começa pela conclusão financeira, que é o argumento de venda, e trata os eixos 1 e 2 como detalhe técnico de apoio. Uma apresentação comercial bem feita é literalmente a ordem correta invertida. Não porque haja má-fé: porque a ordem correta é chata e a ordem invertida vende." },
    { kind: 'titulo', numero: "01.4", texto: "Onde o Módulo 10 termina e este começa" },
    { kind: 'paragrafo', html: "O Módulo 10 já tratou de geração própria — mas como <b>componente que altera a leitura da fatura</b>: a energia injetada aparecendo no faturamento, a demanda que não desaparece porque o sol reduziu o consumo mas não reduziu o pico contratado, a sazonalidade de uma unidade com solar. Aquele módulo ensinou <b>como as linhas aparecem</b>." },
    { kind: 'paragrafo', html: "Este ensina <b>o que está por trás delas</b>: o marco regulatório que cria o direito à compensação, as modalidades que determinam qual unidade recebe o crédito, e o cronograma que determina quanto do componente de rede continua sendo cobrado apesar da compensação. Nenhuma ficha nem instrumento do Módulo 10 é reconstruído aqui. Quando a fatura for necessária, ela é referenciada, não reensinada." },
    { kind: 'paragrafo', html: "Há uma ponte a nomear e uma fronteira a fechar, e as duas serão desenvolvidas na Aula 02. A ponte é com o Módulo 09: a decisão de migrar para o ambiente livre e a decisão de aderir ao sistema de compensação <b>não são independentes</b> — e, ao contrário do que material comercial frequentemente sugere, elas não são combináveis nos termos usuais. A fronteira é com a autoprodução por equiparação, que é outro regime jurídico, de outro universo de consumidor, e não é escopo deste bloco." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "A separação por eixos é a arquitetura de saída do relatório do <b>Solar Proposal Validator</b>. Um relatório organizado por eixo comunica algo que um relatório organizado por item não comunica: <b>o grau de confiança que cada achado merece</b>. Um problema no Eixo 2 é uma afirmação de fato — a modalidade descrita não está disponível para este arranjo. Um problema no Eixo 3 é uma observação de método — a trajetória tarifária assumida não está ancorada em série identificável. Apresentar os dois com o mesmo peso destrói a credibilidade do primeiro. A capacidade analítica que o produto entrega não é encontrar problemas: é <b>classificar corretamente a natureza de cada um</b>." },
  ],
  'aula-11-02': [
    { kind: 'titulo', numero: "02.1", texto: "A cadeia, em ordem, com o que cada peça fez" },
    { kind: 'paragrafo', html: "<b>Resolução Normativa ANEEL nº 482, de 17 de abril de 2012.</b> Criou o acesso de microgeração e minigeração distribuída aos sistemas de distribuição e instituiu o sistema de compensação de energia elétrica no plano infralegal. Durante uma década, foi a base de tudo. Foi alterada por resoluções sucessivas ao longo dos anos e <b>está revogada</b>." },
    { kind: 'paragrafo', html: "<b>Resolução Normativa ANEEL nº 1.000, de 7 de dezembro de 2021.</b> Consolidou as regras de prestação do serviço público de distribuição de energia elétrica num único instrumento — é a norma de condições gerais de fornecimento que o Módulo 10 já ensinou a navegar. Absorveu a matéria de geração distribuída. É nela que a matéria vive hoje." },
    { kind: 'paragrafo', html: "<b>Lei nº 14.300, de 6 de janeiro de 2022, publicada em 7 de janeiro de 2022.</b> Instituiu o marco legal da microgeração e minigeração distribuída, o sistema de compensação de energia elétrica e o programa de energia renovável social. É a peça central: define as modalidades, os limiares de porte, o regime de direito adquirido, o cronograma de transição do componente de rede, e delega à agência reguladora a regra que vale depois da transição. Foi sancionada com vetos, parte deles promulgada posteriormente em agosto de 2022." },
    { kind: 'paragrafo', html: "<b>Resolução Normativa ANEEL nº 1.059, de 7 de fevereiro de 2023, publicada em 10 de fevereiro de 2023.</b> Regulamentou a lei. Alterou a norma de condições gerais para inserir as definições de microgeração e minigeração distribuída como incisos XXIX-A e XXIX-B do seu artigo 2º, e a modalidade autoconsumo remoto como inciso I-A. Criou o capítulo de faturamento do sistema de compensação, com os artigos que estabelecem as classes de faturamento — e é dessa resolução que vem a nomenclatura <b>GD I, GD II e GD III</b>, que a Aula 04 desenvolve. Revogou expressamente a resolução de 2012 e outras quatro que a haviam alterado." },
    { kind: 'paragrafo', html: "<b>Resolução Normativa ANEEL nº 1.098, de 23 de julho de 2024.</b> Inseriu a definição da modalidade <b>autoconsumo local</b> como inciso I-B do artigo 2º da norma de condições gerais, e tratou dos cenários em que a análise de inversão de fluxo fica afastada. Vale reter a data: a lei criou o termo em janeiro de 2022; a norma da agência o incorporou formalmente à sua lista de definições dois anos e meio depois. É o mesmo padrão de defasagem entre lei e regulamentação que os Módulos 07 a 09 já documentaram para outros termos do setor." },
    { kind: 'paragrafo', html: "<b>Lei nº 15.269, de 24 de novembro de 2025, publicada em 25 de novembro de 2025.</b> Reforma ampla do setor elétrico, conversão de medida provisória do mesmo ano, sancionada com mais de vinte vetos. Toca a geração distribuída em dois pontos: alterou a redação do artigo 25 da lei de 2022 e revogou o parágrafo único do seu artigo 22, ambos sobre o custeio temporário, pela conta de desenvolvimento energético, das componentes tarifárias não remuneradas pelo consumidor-gerador. E redefiniu a autoprodução por equiparação, que é a primeira das duas fronteiras desta aula." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "<b>Os vetos da lei de 2025 estão pendentes de deliberação.</b> Consulta em 1º de agosto de 2026: o veto que trata das restrições a novos arranjos de autoprodução estava pautado para a sessão conjunta do Congresso Nacional de 18 de junho de 2026, que foi cancelada por falta de acordo entre as lideranças; ao fim de julho de 2026, dezenas de vetos permaneciam trancando a pauta. Entre os dispositivos vetados está o que teria alterado o artigo 11 da lei de 2022 para permitir que usinas de grande porte migrassem para o regime de geração distribuída pela via da conexão à rede de distribuição — justificativa oficial: criaria regime diferenciado para agentes não concebidos para atuar em geração distribuída. <b>Se o Congresso derrubar esse veto, a fronteira de porte da geração distribuída muda.</b> Verificar o estado da deliberação antes de qualquer uso externo desta aula." },
    { kind: 'titulo', numero: "02.2", texto: "As duas pendências: o que ainda não foi escrito" },
    { kind: 'paragrafo', html: "A cadeia acima tem dois buracos, e os dois estão no mesmo lugar: no que acontece depois do período de transição. O desenho legal é este." },
    { kind: 'paragrafo', html: "O artigo 17 da lei de 2022 diz que, encerrada a transição dos artigos 26 e 27, as unidades participantes do sistema de compensação ficam sujeitas às regras tarifárias que a agência reguladora estabelecer, sendo faturadas pela incidência de todas as componentes tarifárias não associadas ao custo da energia, <b>abatidos todos os benefícios ao sistema elétrico</b> propiciados pelas centrais de micro e minigeração. Ou seja: não é \"cem por cento de tudo\". É \"tudo, menos os benefícios\" — e os benefícios precisam ser calculados." },
    { kind: 'paragrafo', html: "Para esse cálculo, o parágrafo 2º do mesmo artigo estabeleceu dois prazos contados da publicação da lei: <b>seis meses</b> para o conselho nacional de política energética fixar as diretrizes de valoração, e <b>dezoito meses</b> para a agência estabelecer os cálculos. O primeiro prazo venceria em julho de 2022; o segundo, em julho de 2023." },
    { kind: 'paragrafo', html: "O que efetivamente aconteceu: as diretrizes vieram pela <b>Resolução CNPE nº 2, de 22 de abril de 2024, publicada em 7 de maio de 2024</b> — quase dois anos depois do prazo. Elas determinam que a agência considere efeitos sobre expansão ou postergação de rede de distribuição e de transmissão, sobre geração centralizada no aspecto de potência e serviços ancilares, sobre perdas técnicas e qualidade do suprimento, sobre encargos setoriais, efeitos locacionais e o custo de exposição contratual involuntária das distribuidoras; e que o resultado seja um valor líquido, positivo ou negativo, com vedação expressa de dupla contagem e com transparência de bases de dados e memoriais de cálculo." },
    { kind: 'paragrafo', html: "E o cálculo da agência? Em <b>4 de dezembro de 2025</b> foi aberta uma tomada de subsídios sobre experiências internacionais de valoração de custos e benefícios da micro e minigeração, com contribuições até <b>4 de março de 2026</b>, a ser seguida de análise de impacto regulatório e de consulta pública, com <b>conclusão do projeto regulatório prevista para 2027</b>." },
    { kind: 'paragrafo', html: "Some as datas e o resultado é a frase mais importante deste módulo: <b>a regra que passa a valer em 2029 tem conclusão prevista para 2027, quatro anos depois do prazo legal e dois anos antes de entrar em vigor.</b> Toda proposta comercial que apresenta fluxo de caixa de vinte anos está afirmando conhecer, do sétimo ano em diante, uma regra que a agência ainda está estudando. E é por isso que o item mais comum das tabelas de sinal de alerta — \"risco regulatório omitido\" — não é um detalhe de rodapé: é o item que governa a metade final de qualquer projeção." },
    { kind: 'titulo', numero: "02.3", texto: "Fronteira 1 — autoprodução por equiparação não é geração distribuída" },
    { kind: 'paragrafo', html: "A reforma de 2025 inseriu na lei de concessões o artigo 16-B: autoprodutor é o consumidor titular de outorga de empreendimento de geração para produzir energia por sua conta e risco. E equipara a autoprodutor o consumidor com <b>demanda contratada agregada igual ou superior a 30.000 kW, composta por unidades de consumo com demanda individual igual ou superior a 3.000 kW</b>, que participe do capital social da sociedade titular da outorga, observada a proporção da participação com direito a voto, ou esteja sob controle societário comum, coligação ou vínculo equivalente. Há regras de transição preservando situações consolidadas antes da publicação." },
    { kind: 'paragrafo', html: "Traduzindo para escala: trinta megawatts de demanda agregada, composta por unidades de pelo menos três megawatts cada. Isso é o regime de grandes conglomerados industriais com participação acionária em usina. <b>Não tem relação nenhuma com o telhado de uma indústria de porte médio</b>, que é o universo deste bloco. Autoprodução por equiparação é outro regime jurídico, com outro universo de consumidor, e não é escopo do Módulo 11. A fronteira está nomeada; o tema não é desenvolvido aqui." },
    { kind: 'paragrafo', html: "A razão de nomeá-la mesmo assim é comercial. A palavra \"autoprodução\" circula em material de venda como se fosse sinônimo elegante de \"gerar a própria energia\", e ela não é. Uma proposta que descreve o arranjo do cliente como autoprodução, quando o arranjo é geração distribuída, está usando vocabulário do regime errado — e isso é um sinal de alerta do Eixo 2, verificável em um minuto contra os dois limiares de demanda." },
    { kind: 'titulo', numero: "02.4", texto: "Fronteira 2 — quem migrou para o mercado livre não adere ao sistema de compensação" },
    { kind: 'paragrafo', html: "Esta é a ponte com o Módulo 09, e ela precisa ser dita com precisão porque a formulação solta que circula no mercado está errada. O artigo 9º da lei de 2022 lista quem pode aderir ao sistema de compensação — unidades com micro ou minigeração local ou remota, integrantes de empreendimento com múltiplas unidades consumidoras, com geração compartilhada ou integrantes dela, e caracterizadas como autoconsumo remoto. E o seu <b>parágrafo único</b> estabelece a vedação: <b>não poderão aderir ao sistema de compensação os consumidores livres que tenham exercido a opção de compra de energia</b> nos termos dos artigos 15 e 16 da lei de concessões de 1995, <b>nem os consumidores especiais</b> que tenham adquirido energia na forma do parágrafo 5º do artigo 26 da lei de 1996." },
    { kind: 'paragrafo', html: "Isso não é uma preferência regulatória nem uma dificuldade operacional. É uma vedação legal expressa. A leitura correta da relação entre os dois módulos é, portanto, esta: a decisão de migrar de ambiente e a decisão de aderir ao sistema de compensação são <b>mutuamente excludentes</b> para a mesma unidade consumidora. Uma unidade no ambiente livre pode instalar geração no seu terreno — nada proíbe isso —, mas ela não participa do sistema de compensação e, portanto, não acumula nem aloca crédito de energia nos termos deste módulo. O benefício, para ela, é redução física de consumo da rede, não compensação de excedente." },
    { kind: 'paragrafo', html: "A implicação prática para avaliação de proposta é direta e frequentemente decisiva: uma proposta de geração distribuída dirigida a uma unidade que já migrou, ou que está em processo de migração, precisa explicar como as duas coisas coexistem. Se ela não explica, ou o cliente não migrou, ou a proposta está descrevendo um benefício que aquela unidade não pode receber. É um dos erros de Eixo 2 mais caros que existem, e é invisível para quem não conhece o parágrafo único." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "A régua é o que permite ao <b>Solar Proposal Validator</b> datar uma proposta. Uma proposta comercial não vem com data de validade regulatória impressa, mas tem uma: se ela cita a resolução de 2012 como norma vigente, se descreve compensação integral sem qualificar o regime, ou se apresenta o componente de rede em percentual de ano anterior, ela foi redigida sob um arcabouço que já mudou. <b>A defasagem normativa de um documento é um achado objetivo e datável</b>, e é o achado mais rápido de produzir — o que o torna o primeiro item da trilha regulatória na avaliação cronometrada." },
  ],
  'aula-11-03': [
    { kind: 'titulo', numero: "03.1", texto: "Os dois limiares, e a nuance que o mercado erra" },
    { kind: 'paragrafo', html: "As definições estão no artigo 1º da lei de 2022, incisos XI e XIII, e foram incorporadas ao artigo 2º da norma de condições gerais como incisos XXIX-A e XXIX-B pela resolução de fevereiro de 2023." },
    { kind: 'paragrafo', html: "<b>Microgeração distribuída</b>: central geradora de energia elétrica que utilize fontes renováveis, ou cogeração qualificada conforme regulamentação específica, conectada à rede de distribuição por meio de unidade consumidora, com <b>potência instalada em corrente alternada menor ou igual a 75 kW</b>." },
    { kind: 'paragrafo', html: "<b>Minigeração distribuída</b>: mesma natureza, com <b>potência instalada em corrente alternada maior que 75 kW</b> e menor ou igual a <b>5 MW para fontes despacháveis</b> ou <b>3 MW para as demais</b>." },
    { kind: 'paragrafo', html: "Três observações de precisão, e a terceira é a que separa quem leu a lei de quem leu um resumo." },
    { kind: 'paragrafo', html: "Primeira: o limiar é de <b>potência instalada em corrente alternada</b>. Isso importa porque proposta comercial costuma descrever o sistema pela potência de pico dos módulos, em watts-pico, que é grandeza de corrente contínua. Um sistema com módulos somando 90 kWp e inversores somando 70 kW de potência nominal em corrente alternada é <b>microgeração</b> — o que muda o rito de conexão, os prazos e a exigência de garantia. Ler o limiar contra o número errado é erro de Eixo 2 disfarçado de erro de unidade, e o Módulo 01 já deu a base para não cometê-lo." },
    { kind: 'paragrafo', html: "Segunda: o limite superior da minigeração depende da classificação da fonte como despachável ou não. Solar fotovoltaica pura é <b>não despachável</b>, e portanto o teto é 3 MW." },
    { kind: 'paragrafo', html: "Terceira, e é a nuance: pelo inciso IX do artigo 1º da lei, as fontes fotovoltaicas <b>podem</b> ser consideradas despacháveis quando acompanhadas de baterias com capacidade de modulação de pelo menos vinte por cento da capacidade de geração mensal da central, despacháveis por controlador local ou remoto — <b>mas, nesse caso, ficam limitadas a 3 MW de potência instalada de qualquer forma</b>. Ou seja: adicionar armazenamento a um projeto solar muda a classificação da fonte para efeitos de despachabilidade, mas <b>não eleva o teto de porte para 5 MW</b>. A frase de venda \"com bateria seu projeto vira despachável e sobe para cinco megawatts\" está errada na segunda metade." },
    { kind: 'paragrafo', html: "Há ainda uma exceção temporal que vale reter: pelo parágrafo único do artigo 1º, para as unidades abrangidas pelo caput do artigo 26 — as do regime de direito adquirido —, o limite de potência instalada da minigeração é de <b>5 MW até 31 de dezembro de 2045</b>, independentemente do enquadramento da fonte. A regulamentação de 2023 refletiu isso ao tratar quem protocolou solicitação de orçamento de conexão até 7 de janeiro de 2023." },
    { kind: 'titulo', numero: "03.2", texto: "As quatro modalidades de participação" },
    { kind: 'paragrafo', html: "O sistema de compensação admite quatro modalidades, e a diferença entre elas não é técnica: é de <b>titularidade e de localização</b>. O equipamento pode ser rigorosamente o mesmo nas quatro. O que muda é quem é o titular da unidade onde a geração está instalada, quais unidades podem receber o excedente, e o que a proposta precisa provar para demonstrar que o arranjo descrito se enquadra na modalidade que ela nomeia." },
    { kind: 'paragrafo', html: "Uma nota de vocabulário antes das fichas, e ela é de disciplina: os termos regulatórios são autoconsumo local, autoconsumo remoto, geração compartilhada e empreendimento com múltiplas unidades consumidoras. Expressões comerciais que circulam como sinônimos — do tipo \"energia por assinatura\" — <b>não são termos da norma</b>. São marcas de posicionamento de plataformas específicas. Quando uma proposta usa vocabulário de marca no lugar do vocabulário da norma, o primeiro trabalho da avaliação é traduzir: qual das quatro modalidades regulatórias está sendo descrita? A tradução às vezes revela que a resposta é \"nenhuma exatamente\", e isso é um achado." },
    { kind: 'titulo', numero: null, texto: "Autoconsumo local · Modalidade · SCEE" },
    { kind: 'tabela', linhas: [["Definição normativa e origem", "Lei nº 14.300/2022, art. 1º, I; incorporada ao art. 2º, I-B, da REN ANEEL nº 1.000/2021 pela <b>REN nº 1.098, de 23.07.2024</b>. Antes do marco legal, a situação era tratada sob a expressão \"geração junto à carga\".<span class=\"mini\">Mais uma troca de nome no setor, no mesmo padrão que os Módulos 07 a 09 documentaram.</span>"], ["Quem pode aderir", "Titular único, pessoa física ou jurídica, com micro ou minigeração <b>eletricamente junto à carga</b> — geração e consumo na mesma unidade consumidora."], ["Como o crédito é alocado", "O excedente e o crédito gerados pela unidade são <b>integralmente compensados pela mesma unidade</b>. Não há alocação para terceiros nesta modalidade."], ["O que muda no regime de transição", "Nada de específico: segue o regime geral determinado pela data de protocolo. Não é alcançada pelo regime especial do §1º do art. 27, que pressupõe autoconsumo remoto ou geração compartilhada."], ["O que a proposta precisa declarar", "Que a unidade geradora e a unidade consumidora são a mesma; a potência instalada em corrente alternada; o titular; e o número da instalação. <b>Se a proposta fala em beneficiar outras unidades, não é autoconsumo local</b> — e o enquadramento declarado está errado."]] },
    { kind: 'titulo', numero: null, texto: "Autoconsumo remoto · Modalidade · SCEE" },
    { kind: 'tabela', linhas: [["Definição normativa e origem", "Lei nº 14.300/2022, art. 1º, II; incorporada ao art. 2º, I-A, da REN ANEEL nº 1.000/2021 pela <b>REN nº 1.059, de 07.02.2023</b>."], ["Quem pode aderir", "Unidades consumidoras de titularidade de <b>uma mesma pessoa física ou jurídica</b>, incluídas matriz e filial, sendo que a unidade com geração fica em local diferente das que recebem o excedente, e <b>todas atendidas pela mesma distribuidora</b>.<span class=\"mini\">A identidade de titularidade e a mesma distribuidora são as duas travas. Grupo econômico com CNPJs distintos não satisfaz a primeira; unidades em áreas de concessão diferentes não satisfazem a segunda.</span>"], ["Como o crédito é alocado", "O titular define as unidades beneficiárias e o percentual alocado a cada uma, ou a ordem de prioridade. Pode solicitar alteração de percentuais ou realocação, e a distribuidora tem <b>até 30 dias</b> para operacionalizar (art. 12, §4º)."], ["O que muda no regime de transição", "<b>Pode cair no regime especial</b> do art. 27, §1º, se a minigeração for superior a 500 kW em fonte não despachável — hipótese em que o faturamento é substancialmente mais oneroso até 2028. Ver Aula 04."], ["O que a proposta precisa declarar", "Titularidade idêntica de todas as unidades envolvidas, com documento; a distribuidora de cada uma; a potência instalada em corrente alternada; e os percentuais de alocação pretendidos. <b>Sem a prova de titularidade idêntica, o arranjo descrito não é autoconsumo remoto</b>."]] },
    { kind: 'titulo', numero: null, texto: "Geração compartilhada · Modalidade · SCEE" },
    { kind: 'tabela', linhas: [["Definição normativa e origem", "Lei nº 14.300/2022, art. 1º, X. Reunião de consumidores por <b>consórcio, cooperativa, condomínio civil voluntário ou edilício ou qualquer outra forma de associação civil</b> instituída para esse fim, composta por pessoas físicas ou jurídicas, com atendimento de todas as unidades pela mesma distribuidora."], ["Quem pode aderir", "Consumidores distintos, sem exigência de titularidade comum, desde que reunidos sob forma associativa válida e atendidos pela mesma distribuidora. O art. 3º faculta a transferência da titularidade das contas das unidades participantes para o consumidor-gerador titular."], ["Como o crédito é alocado", "Excedentes alocados <b>somente</b> às unidades que fazem parte do empreendimento e atendidas pela mesma distribuidora (art. 14, parágrafo único). Nesta modalidade, o excedente pode ser <b>toda a energia gerada ou toda a injetada</b>, a critério do consumidor-gerador titular (art. 1º, VIII)."], ["O que muda no regime de transição", "<b>É a modalidade mais exposta ao regime especial</b>: acima de 500 kW em fonte não despachável, com titular único detendo 25% ou mais da participação do excedente, aplica-se o faturamento agravado do art. 27, §1º. Dispensada da garantia de fiel cumprimento quando constituída por consórcio ou cooperativa (art. 4º, §1º)."], ["O que a proposta precisa declarar", "O instrumento associativo e sua data; a lista de participantes e a participação de cada um no excedente; a distribuidora comum; e a potência instalada. <b>A participação individual no excedente é o campo decisivo</b> — é ele que determina se o regime especial incide. Proposta de geração compartilhada de grande porte que não declara a distribuição de participação está omitindo o campo que define o faturamento."]] },
    { kind: 'titulo', numero: null, texto: "Empreendimento com múltiplas unidades consumidoras · Modalidade · SCEE" },
    { kind: 'tabela', linhas: [["Definição normativa e origem", "Lei nº 14.300/2022, art. 1º, VII, e definição correspondente inserida no art. 2º da REN ANEEL nº 1.000/2021 pela REN nº 1.059/2023."], ["Quem pode aderir", "Conjunto de unidades consumidoras <b>em uma mesma propriedade ou em propriedades contíguas</b>, sem separação por vias públicas, passagem aérea ou subterrânea ou por propriedades de terceiros não integrantes; as instalações de uso comum, por onde se conecta a geração, constituem unidade consumidora distinta, de responsabilidade do condomínio, da administração ou do proprietário.<span class=\"mini\">A contiguidade física é a trava — e é o critério que uma proposta pode afirmar sem demonstrar.</span>"], ["Como o crédito é alocado", "Excedentes alocados às unidades localizadas no próprio empreendimento (art. 12, §1º, III). Como na geração compartilhada, o excedente pode ser toda a energia gerada ou toda a injetada, a critério do titular."], ["O que muda no regime de transição", "Segue o regime geral pela data de protocolo. <b>Não é alcançada pelo regime especial</b> do art. 27, §1º, que menciona apenas autoconsumo remoto e geração compartilhada. Dispensada da garantia de fiel cumprimento (art. 4º, §1º)."], ["O que a proposta precisa declarar", "A comprovação de contiguidade e de ausência de separação por via pública ou propriedade de terceiro; a existência de unidade consumidora distinta para as áreas de uso comum; e a responsabilidade formal do condomínio ou administração sobre ela. <b>Proposta que chama de empreendimento com múltiplas unidades um conjunto de imóveis separados por rua está errada no enquadramento</b>, não na conta."]] },
    { kind: 'nota', tom: "neutro", label: "As quatro modalidades de participação", html: "<b>Criança de 12 anos.</b> É sobre quem pode usar a energia que sobrou. Se você faz bolo na sua casa e come na sua casa, é o primeiro caso. Se você faz bolo na sua casa e leva para a sua outra casa, é o segundo — mas só se as duas casas forem suas mesmo. Se um grupo de vizinhos junta dinheiro, monta uma cozinha e divide o bolo, é o terceiro. E se todo mundo mora no mesmo prédio e a cozinha é a do salão de festas, é o quarto. O forno pode ser idêntico nos quatro. O que muda é a regra de quem come. <b>Executivo não técnico.</b> A modalidade determina para quem o excedente pode ir, e o documento que prova isso é societário, não técnico. Autoconsumo local: gera e consome na mesma unidade. Autoconsumo remoto: unidades diferentes, mesmo titular, mesma distribuidora — e \"mesmo titular\" significa mesmo CNPJ ou CPF, não mesmo grupo econômico. Geração compartilhada: titulares diferentes reunidos em consórcio, cooperativa ou associação civil. Empreendimento com múltiplas unidades: mesmo terreno ou terrenos contíguos, com a geração ligada à área comum. A pergunta que a sua área jurídica deve fazer à proposta não é sobre o painel: é qual documento comprova o enquadramento declarado. <b>Especialista do setor.</b> As modalidades são categorias de titularidade e de localização definidas no art. 1º da Lei nº 14.300/2022 e refletidas no art. 2º da REN ANEEL nº 1.000/2021, com autoconsumo remoto incluído pela REN nº 1.059/2023 e autoconsumo local pela REN nº 1.098/2024. A distinção operacionalmente relevante para faturamento é dupla: primeiro, apenas autoconsumo remoto e geração compartilhada são alcançados pelo regime agravado do art. 27, §1º, condicionado a minigeração superior a 500 kW em fonte não despachável com titular único detendo 25% ou mais da participação do excedente; segundo, apenas em geração compartilhada e em empreendimento com múltiplas unidades o excedente pode ser definido como toda a energia gerada ou toda a injetada, a critério do titular, nos termos do art. 1º, VIII, o que altera a base de incidência do componente de rede. A elegibilidade é ato de subsunção documental, não de dimensionamento." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "O classificador é o primeiro filtro do <b>Solar Proposal Validator</b> e o mais barato de executar: três campos de entrada, dois deles presentes em qualquer proposta e o terceiro obtido numa pergunta. Ele produz o tipo de achado mais forte que o produto pode entregar — um erro de enquadramento é uma afirmação de fato, não uma opinião analítica, e coloca o comprador numa posição de negociação inteiramente diferente daquela em que ele estaria discutindo se a geração estimada está otimista demais." },
  ],
  'aula-11-04': [
    { kind: 'titulo', numero: "04.1", texto: "Por que existe cobrança sobre energia que foi compensada" },
    { kind: 'paragrafo', html: "Antes dos percentuais, o mecanismo — porque quem entende o mecanismo não erra a leitura de nenhum ano, e quem decora a tabela erra na primeira mudança." },
    { kind: 'paragrafo', html: "Quando uma unidade injeta energia na rede e a compensa depois, ela usa a rede duas vezes: uma para injetar e outra para consumir. O Módulo 10 já ensinou que a tarifa de uso do sistema de distribuição carrega componentes que remuneram ativos, depreciação e operação e manutenção da rede — os chamados componentes de fio. No desenho anterior a 2022, a compensação abatia o consumo antes da aplicação dessas componentes, o que significava, na prática, que o consumidor-gerador não remunerava a rede pela energia compensada. O custo dessa não remuneração não desaparecia: era distribuído entre os demais consumidores." },
    { kind: 'paragrafo', html: "A lei de 2022 fez duas coisas. Preservou integralmente esse desenho para quem já havia investido sob ele — é o regime de direito adquirido —, e criou uma transição gradual para todos os demais, em que a parcela das componentes de distribuição incidente sobre a energia compensada sobe ano a ano. O artigo 27 é essa escada. O artigo 26 é a preservação. E o artigo 17 é o que vem depois da escada." },
    { kind: 'paragrafo', html: "Repare que a escada incide sobre <b>uma parte específica da tarifa</b> — as componentes relativas à remuneração dos ativos de distribuição, à quota de reintegração regulatória e ao custo de operação e manutenção do serviço de distribuição — e não sobre a tarifa cheia. Este é o ponto onde material comercial mal calibrado erra nas duas direções: alguns tratam o percentual como se incidisse sobre a conta inteira, o que exagera o impacto; outros o tratam como irrelevante, o que o subestima. O correto é o que a norma diz, e o Módulo 10 já deu a anatomia necessária para localizar essas componentes dentro da tarifa de uso." },
    { kind: 'titulo', numero: "04.2", texto: "As três classes de faturamento da regulamentação" },
    { kind: 'paragrafo', html: "A resolução de fevereiro de 2023 inseriu, na norma de condições gerais, um conjunto de artigos que operacionalizam a lei e criam três classes de faturamento. Este vocabulário é o que aparece na resolução homologatória de tarifas da distribuidora, e portanto é o vocabulário com que a fatura conversa — razão pela qual vale mais do que qualquer paráfrase." },
    { kind: 'tabela', linhas: [["Classe", "Quem se enquadra", "Como é faturada a energia compensada", "Até quando"], ["<b>GD I</b>", "Unidade conectada, ou com solicitação de orçamento de conexão protocolada, <b>até 7 de janeiro de 2023</b> — abrangendo tanto quem já estava conectado na publicação da lei quanto quem protocolou nos doze meses seguintes", "Todas as componentes tarifárias incidem <b>apenas sobre a diferença positiva</b> entre o consumido e a soma da energia injetada com o crédito acumulado. Não há incidência do componente de rede sobre a energia compensada", "<b>31 de dezembro de 2045</b>"], ["<b>GD II</b>", "Regra de transição padrão: as demais unidades participantes do sistema de compensação, não abrangidas pelo direito adquirido nem pelo regime especial", "Escada anual de percentuais das componentes de distribuição sobre <b>toda</b> a energia ativa compensada", "Até <b>2028</b>; depois, regra do art. 17. Para quem protocolou entre <b>8 de janeiro e 7 de julho de 2023</b>, a regra do art. 17 só se aplica a partir de <b>2031</b>"], ["<b>GD III</b>", "Minigeração <b>acima de 500 kW</b>, em <b>fonte não despachável</b>, em <b>autoconsumo remoto ou geração compartilhada</b>, em que um <b>único titular detenha 25% ou mais da participação do excedente</b> de energia elétrica, com conexão solicitada a partir de 8 de janeiro de 2023", "Regime agravado: 100% das componentes de remuneração de ativos, depreciação e operação e manutenção da distribuição; 40% das componentes de transmissão, transformadores de fronteira, demais instalações de transmissão compartilhadas e conexão; 100% dos encargos de pesquisa e desenvolvimento, eficiência energética e taxa de fiscalização", "Até <b>2028</b>; depois, regra do art. 17"]] },
    { kind: 'paragrafo', html: "Duas leituras que a tabela não mostra e que importam para avaliação de proposta." },
    { kind: 'paragrafo', html: "A primeira: o regime de <b>GD III existe para distinguir compartilhamento real de compartilhamento aparente</b>. Um projeto verdadeiramente compartilhado tem participação pulverizada entre muitos titulares. Um arranjo estruturado para concentrar o benefício num único titular por trás de uma fachada associativa cai no limiar de vinte e cinco por cento e é faturado de forma substancialmente mais onerosa. Quando uma proposta de geração compartilhada de grande porte apresenta números atraentes e não declara a distribuição de participação no excedente, a pergunta a fazer não é sobre o número: é <b>qual é a participação do maior titular</b>. A resposta muda o regime." },
    { kind: 'paragrafo', html: "A segunda: as classes <b>não são permanentes</b>. A lei e a regulamentação estabelecem hipóteses em que a unidade deixa de ser alcançada pelo regime que tinha, e essa é matéria da Aula 07 — mas vale antecipar aqui que a mais relevante delas, o aumento de potência instalada protocolado após o prazo, é exatamente o tipo de coisa que uma proposta de <b>ampliação</b> de sistema existente costuma tratar como detalhe operacional." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Os percentuais do art. 27 sobem em <b>1º de janeiro de cada ano</b>: 15% a partir de 2023, 30% a partir de 2024, 45% a partir de 2025, <b>60% a partir de 2026</b>, 75% a partir de 2027 e 90% a partir de 2028. <b>Percentual vigente na data de consulta desta versão (1º de agosto de 2026): 60%</b>, aplicável a unidades GD II. Qualquer uso externo deste módulo a partir de 1º de janeiro de 2027 exige atualização deste número. Note ainda que os percentuais incidem sobre as componentes tarifárias de distribuição relacionadas no <b>caput</b> do art. 27, não sobre a tarifa integral." },
    { kind: 'titulo', numero: "04.3", texto: "2029: o que a lei diz, e o que quase todo mundo diz que ela diz" },
    { kind: 'paragrafo', html: "O inciso VII do artigo 27 é a linha mais mal citada de toda a legislação de geração distribuída. Ela diz, literalmente: <b>\"a regra disposta no art. 17 desta Lei a partir de 2029\"</b>. Não diz cem por cento. Não diz percentual nenhum." },
    { kind: 'paragrafo', html: "O artigo 17, por sua vez, estabelece que as unidades ficarão sujeitas às regras tarifárias que a agência estabelecer, faturadas pela incidência de todas as componentes não associadas ao custo da energia, <b>devendo ser abatidos todos os benefícios ao sistema elétrico</b> propiciados pela micro e minigeração. E delega o cálculo desses benefícios a um processo com diretrizes do conselho de política energética." },
    { kind: 'paragrafo', html: "Ou seja: a regra de 2029 é \"tudo, menos os benefícios calculados\" — e o cálculo dos benefícios ainda não existe. Tratar 2029 como cem por cento é adotar a hipótese de que os benefícios calculados serão zero, o que é uma hipótese possível e não é o texto da lei." },
    { kind: 'paragrafo', html: "Vale registrar que essa simplificação é <b>abundante</b> em material de mercado, inclusive em material de qualidade técnica razoável, e que ela quase nunca vem de má-fé: ela vem de copiar a tabela de outro texto que já a tinha copiado. É por isso que a disciplina de ler a fonte primária vale mais neste bloco do que em qualquer outro do currículo — o erro está tão disseminado que a checagem cruzada entre fontes secundárias o confirma em vez de o corrigir." },
    { kind: 'paragrafo', html: "E vale registrar a variante comercial dessa simplificação, que é o sexto tipo de defeito que este bloco acrescenta ao catálogo: <b>marketing de produto travestido de explicação regulatória</b>. É o texto que parece estar explicando o marco legal e está estruturado para levar a uma conclusão de venda — tipicamente \"instale agora, antes que o componente de rede suba mais\". A afirmação de base é verdadeira: quem protocola mais cedo trava um degrau melhor da escada. É exatamente por ser verdadeira que ela é perigosa, porque induz à conclusão que interessa a quem escreveu sem que seja necessário afirmar nada falso. A verificação correta não é rejeitar a afirmação: é notar quem a está fazendo e conferir se o texto também menciona que a regra do sétimo degrau ainda não foi definida — omissão que costuma acompanhar a urgência." },
    { kind: 'nota', tom: "neutro", label: "O cronograma de transição e o que vem depois", html: "<b>Criança de 12 anos.</b> Pensa numa estrada com pedágio. Antes, quem tinha carro elétrico não pagava nada no pedágio. Aí mudou a regra: quem já tinha carro elétrico continua sem pagar até 2045, e quem comprar depois vai pagando um pedacinho a mais a cada ano — quinze por cento, trinta, quarenta e cinco, sessenta, setenta e cinco, noventa. Só que aí a lei diz: em 2029 muda de novo, e a nova regra vai ser escrita por outra pessoa, mais para frente. Então ninguém sabe ainda quanto vai ser o pedágio em 2029. Quem te disser que sabe está chutando. <b>Executivo não técnico.</b> Existem três regimes simultâneos, e o seu depende da data em que o pedido de acesso entrou na distribuidora. Quem protocolou até 7 de janeiro de 2023 não paga o componente de rede sobre a energia compensada, até 2045. Quem protocolou depois entra numa escada anual que hoje está em sessenta por cento. E projetos de maior porte com concentração de titularidade têm regime próprio, mais oneroso. A partir de 2029, todos migram para uma regra que a agência ainda não escreveu — o projeto regulatório tem conclusão prevista para 2027. Qualquer fluxo de caixa que passe de 2028 é, do ponto de vista regulatório, uma hipótese. <b>Especialista do setor.</b> Coexistem três classes de faturamento definidas na REN ANEEL nº 1.000/2021 com redação da REN nº 1.059/2023, correspondentes ao art. 26 e ao art. 27, caput e §1º, da Lei nº 14.300/2022. GD I preserva a compensação integral até 31.12.2045 para quem se conectou ou protocolou orçamento de conexão até 07.01.2023, com hipóteses de perda no §2º do art. 26. GD II segue a escada do caput do art. 27, com a particularidade do §2º — protocolo entre 08.01.2023 e 07.07.2023 posterga a incidência do art. 17 para 2031. GD III aplica o regime do §1º, cumulando cem por cento das componentes de distribuição, quarenta por cento das de transmissão e conexão, e cem por cento de pesquisa e desenvolvimento, eficiência energética e taxa de fiscalização. O inciso VII do art. 27 remete ao art. 17 a partir de 2029; o art. 17, §1º, determina o abatimento dos benefícios sistêmicos, cuja valoração depende das diretrizes da Resolução CNPE nº 2/2024 e de metodologia da agência ainda em projeto regulatório, com conclusão prevista para 2027." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "O roteador de regime é o instrumento de maior valor unitário do <b>Solar Proposal Validator</b> porque produz o achado de maior consequência com o menor esforço: dois campos — data de protocolo e concentração de participação — determinam a base de faturamento de toda a vida útil do sistema. E ele produz um segundo achado, mais sutil e igualmente valioso: identifica <b>propostas que projetam além do horizonte regulatório conhecido</b>. Um relatório que diz \"os anos 1 a 3 desta projeção estão sob regra vigente; os anos 4 em diante estão sob regra em elaboração, com conclusão prevista para 2027\" entrega ao comprador exatamente a informação que ele precisa para negociar — e faz isso sem estimar economia nenhuma, o que mantém a posição analítica intacta." },
  ],
  'aula-11-05': [
    { kind: 'titulo', numero: "05.1", texto: "A fonte brasileira de irradiância, e por que ela vem antes de qualquer ferramenta estrangeira" },
    { kind: 'paragrafo', html: "A referência primária é o <b>Atlas Brasileiro de Energia Solar — 2ª edição</b>, publicado em 2017 pelo Laboratório de Modelagem e Estudos de Recursos Renováveis de Energia do Instituto Nacional de Pesquisas Espaciais. A base foi produzida a partir de mais de dezessete anos de imagens de satélite, de 1999 a 2015, processadas pelo modelo de transferência radiativa desenvolvido no próprio instituto, e validadas contra mais de quinhentas estações de medição em superfície. Ela cobre <b>mais de setenta e dois mil pontos</b> do território nacional, com espaçamento de aproximadamente dez quilômetros, e disponibiliza irradiação global horizontal, direta normal, no plano inclinado, difusa e radiação fotossinteticamente ativa. O download é público, em formatos de planilha, dados geoespaciais e formato científico, tanto para a grade completa quanto para as sedes municipais." },
    { kind: 'paragrafo', html: "A consulta por ponto pode ser feita diretamente na base do instituto, ou pela ferramenta de consulta mantida pelo <b>centro de referência para energia solar e eólica</b> vinculado ao centro de pesquisas do setor elétrico, que foi atualizada com essa mesma base e permite obter a irradiação diária média mensal para qualquer coordenada do país. O mesmo centro publica e distribui o <b>Atlas Solarimétrico do Brasil</b>, de 2000, base solarimétrica consolidada mais antiga." },
    { kind: 'paragrafo', html: "Há uma ferramenta europeia amplamente citada em material comercial brasileiro, e ela é legítima como <b>verificação cruzada</b>. O que não se sustenta é usá-la como referência principal quando existe base nacional, produzida por instituto de pesquisa do país, com metodologia publicada, validação contra estações de superfície em território brasileiro e download aberto. A ordem correta é: base nacional primeiro, dados meteorológicos do instituto nacional de meteorologia como complemento, ferramenta estrangeira apenas para conferir." },
    { kind: 'paragrafo', html: "Uma ressalva que a própria fonte faz, e que é pedagogicamente valiosa porque um vendedor não a fará: os dados do atlas são <b>indicativos</b> e carregam as limitações do modelo. Para avaliações mais precisas, a recomendação da própria fonte é medição no local de interesse. Isso não enfraquece a verificação — reforça. Significa que a base publicada é o piso de comparação, não o teto de precisão, e que uma proposta que declara ter feito medição local com série anual é <b>mais</b> verificável, não menos." },
    { kind: 'paragrafo', html: "E existe um precedente legal que ancora essa exigência em escala maior: o artigo 29 da lei de 2022 exige, para outorga de usinas fotovoltaicas destinadas ao ambiente livre ou à autoprodução, estudo simplificado com dados de <b>pelo menos um ano de medição</b>, por satélite ou estação solarimétrica instalada no local, com sumário de certificação de medições e estimativa de produção anual emitido por <b>certificador independente</b>. Ou seja: o próprio ordenamento reconhece que estimativa de geração é grandeza certificável por terceiro. Que a exigência não alcance formalmente a geração distribuída não impede que o comprador exija o mesmo padrão de evidência de quem lhe vende." },
    { kind: 'titulo', numero: "05.2", texto: "A conta que liga irradiância a geração estimada" },
    { kind: 'paragrafo', html: "A estrutura da estimativa é sempre a mesma, independentemente do software usado:" },
    { kind: 'nota', tom: "neutro", label: null, html: "<b>Geração anual estimada ≈ potência instalada × irradiação média diária no plano dos módulos × 365 × desempenho global do sistema</b> Onde a irradiação média diária vem em quilowatt-hora por metro quadrado por dia — que é a unidade em que a base nacional publica —, a potência instalada entra em quilowatts-pico, e o desempenho global do sistema é o fator adimensional que agrega todas as perdas: temperatura, sujidade, cabeamento, conversão do inversor, descasamento entre módulos, sombreamento e indisponibilidade." },
    { kind: 'paragrafo', html: "O termo que carrega a manipulação é o <b>desempenho global</b>. É um fator entre zero e um, que uma proposta pode declarar ou embutir silenciosamente. Instalações bem projetadas em condições favoráveis operam em patamares mais altos; instalações com sombreamento parcial, orientação ruim, ambiente empoeirado ou temperatura de operação elevada, em patamares sensivelmente menores. A faixa técnica usual é ampla o bastante para que a escolha do valor mude a geração estimada em dezenas de pontos percentuais — e é justamente por ser ampla que ela é o parâmetro preferido de quem quer inflar sem mentir." },
    { kind: 'paragrafo', html: "A verificação, portanto, não é conferir a conta: é <b>exigir que o fator seja declarado</b>. Uma proposta que apresenta geração anual estimada sem declarar o desempenho global adotado, a irradiação de referência utilizada, a base de onde ela veio e a orientação e inclinação assumidas, não permite reprodução do cálculo. E premissa que não permite reprodução não é premissa: é resultado. A pergunta ao vendedor tem quatro partes e cabe numa frase — qual irradiação, de qual base, com qual desempenho global, para qual orientação e inclinação." },
    { kind: 'titulo', numero: "05.3", texto: "Degradação: o número está no documento que ninguém pede" },
    { kind: 'paragrafo', html: "Módulos fotovoltaicos perdem capacidade de conversão ao longo do tempo. Isso não é defeito: é característica do material, e é previsível o bastante para ser objeto de garantia contratual. Toda proposta que projeta produção de energia por vinte ou vinte e cinco anos <b>precisa</b> aplicar uma curva de degradação sobre a geração do primeiro ano, e toda proposta que não menciona degradação está aplicando degradação zero na planilha — o que significa afirmar que o equipamento entrega, no ano vinte, exatamente o que entregou no ano um." },
    { kind: 'paragrafo', html: "A verificação aqui tem uma elegância que vale explicitar: <b>a referência independente é o próprio fabricante do módulo cotado</b>. O termo de garantia de performance do módulo declara a produção mínima garantida no primeiro ano e a taxa máxima de degradação anual garantida depois disso. Esse documento é público, vem no datasheet, e é a única referência que importa — porque a taxa que interessa não é a média da indústria, é a que aquele fabricante assumiu contratualmente para aquele modelo." },
    { kind: 'paragrafo', html: "Portanto a verificação é uma comparação de dois números que estão em dois documentos que o comprador já pode ter em mãos: a taxa de degradação usada na planilha da proposta, e a taxa garantida no datasheet do módulo especificado. Três resultados possíveis. Se a taxa da planilha for <b>igual ou mais conservadora</b> que a garantida, a premissa é consistente. Se for <b>menos conservadora</b>, a planilha está projetando desempenho que o próprio fabricante não garante. E se a proposta <b>não especifica o modelo</b> do módulo, a verificação é impossível — e essa impossibilidade é, ela própria, o achado." },
    { kind: 'titulo', numero: "05.4", texto: "Certificação de equipamento: o que a norma exige, e o que fica de fora" },
    { kind: 'paragrafo', html: "A regulamentação técnica de equipamentos fotovoltaicos está estabelecida pela <b>Portaria Inmetro nº 140, de 21 de março de 2022, publicada em 30 de março de 2022</b>, complementada pela <b>Portaria Inmetro nº 515, de novembro de 2023</b>. A portaria de 2022 substituiu a regulamentação anterior, de 2011. O mecanismo é a declaração de conformidade do fornecedor, seguida de ensaio em laboratório acreditado ou designado, registro do produto e autorização para uso da etiqueta do programa brasileiro de etiquetagem." },
    { kind: 'paragrafo', html: "O escopo alcança quatro famílias: <b>módulos fotovoltaicos com potência nominal igual ou superior a 5 Wp</b>, de células de silício, filmes finos ou híbridas de heterojunção; <b>controladores de carga e descarga</b> dos tipos modulação por largura de pulso ou seguidor de ponto de máxima potência; <b>baterias</b> de uso em sistemas fotovoltaicos, de chumbo-ácido, alcalinas, de lítio ou outras tecnologias eletroquímicas; e <b>inversores com potência nominal até 75 kW</b>, de uso em sistemas isolados ou conectados à rede, com ou sem armazenamento." },
    { kind: 'paragrafo', html: "Ficam de fora do escopo compulsório: módulos abaixo de 5 Wp, tecnologias de terceira geração, módulos concentradores, módulos de corrente alternada e <b>inversores acima de 75 kW</b>." },
    { kind: 'paragrafo', html: "Registre a coincidência do último item, porque ela tem consequência prática direta: <b>o teto de escopo da certificação compulsória do inversor — 75 kW — é exatamente o limiar que separa microgeração de minigeração</b>. Ou seja, a minigeração distribuída começa precisamente onde a certificação compulsória do inversor termina. Isso não significa que inversores de maior porte sejam inseguros ou irregulares: significa que, para eles, a evidência de conformidade tem de vir por outro caminho — normas técnicas internacionais aplicáveis, relatórios de ensaio, requisitos da própria distribuidora no parecer de acesso — e que o comprador de um projeto de minigeração <b>não pode se contentar com a frase \"equipamento certificado\"</b> como se ela tivesse o mesmo significado que tem num projeto de microgeração." },
    { kind: 'paragrafo', html: "Sobre a exigência de potência medida: a regulamentação vigente trabalha com a faixa de <b>cem a cento e cinco por cento da potência nominal declarada</b>, considerada também a incerteza de medição do laboratório — o que endereça diretamente o problema dos módulos que entregam menos do que a etiqueta afirma. Vale registrar, com honestidade metodológica, que fontes secundárias divergem sobre qual das duas portarias introduziu essa faixa, e que a página oficial do instituto não desempata a atribuição. <b>Para uso externo, ler o texto literal das duas portarias antes de atribuir a exigência a uma delas.</b> O que não está em disputa é a existência da faixa e a sua função." },
    { kind: 'paragrafo', html: "A verificação prática tem duas etapas, e a segunda é a que quase ninguém faz. A primeira é confirmar que o modelo especificado tem registro. A segunda é confirmar que o registro está <b>vigente e obtido sob a norma correta</b> — porque \"tem certificação\" e \"a certificação vigente foi obtida sob o regulamento aplicável hoje\" não são a mesma verificação, e porque a fiscalização de mercado do instituto já produziu reprovação de modelo em ensaio, o que é a evidência de que a distinção importa." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "O escopo, o cronograma de obrigatoriedade e os requisitos técnicos das portarias de certificação de equipamentos fotovoltaicos <b>mudaram três vezes desde 2011</b> e continuam sob revisão periódica. Antes de citar número de portaria, faixa de tolerância de potência ou data de obrigatoriedade em qualquer material externo, ler o texto vigente no portal do instituto de metrologia. A consulta de registro de produto é pública e deve ser feita por modelo, não por marca. Consulta desta versão: 1º de agosto de 2026." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Os dois verificadores desta aula são o <b>núcleo técnico</b> do <b>Solar Proposal Validator</b>, e a infraestrutura que eles exigem é exatamente a que o catálogo já prevê: base de irradiância regional por município e calculadora de estimativa de geração com modelagem de degradação. O ponto de arquitetura que este módulo acrescenta é que <b>a base de irradiância deve ser nacional e citável</b>, com metodologia e data de referência declaradas no relatório — não porque a alternativa estrangeira seja tecnicamente inferior, mas porque um relatório de validação independente que cita fonte nacional primária é auditável por qualquer terceiro no Brasil, e essa auditabilidade é o produto." },
  ],
  'aula-11-06': [
    { kind: 'titulo', numero: "06.1", texto: "A premissa que sustenta metade da conta" },
    { kind: 'paragrafo', html: "Toda projeção de geração distribuída embute uma taxa de crescimento da tarifa de energia. Ela é a variável de maior alavancagem de toda a planilha, porque multiplica a energia compensada em cada um dos anos do horizonte, e porque erros pequenos na taxa se compõem. Uma diferença de poucos pontos percentuais ao ano, composta por vinte anos, muda o resultado final por fatores, não por margens." },
    { kind: 'paragrafo', html: "Três coisas precisam ser ditas sobre ela, e as três são de método." },
    { kind: 'paragrafo', html: "Primeira: <b>a trajetória tarifária é específica da concessionária</b>, e não nacional. O Módulo 10 já estabeleceu isso para o nível da tarifa; vale igualmente para a sua variação. Cada distribuidora tem o seu ciclo de reajuste anual e a sua revisão periódica, com atos homologatórios próprios, e o histórico de variação de uma área de concessão não descreve o de outra. Uma proposta que aplica \"aumento médio nacional da energia elétrica\" a um cliente específico está usando um número que não tem sujeito — exatamente como \"a tarifa brasileira\" não tinha sujeito no Módulo 10." },
    { kind: 'paragrafo', html: "Segunda: <b>a referência de ancoragem é o histórico publicado de reajustes daquela concessionária</b>, disponível nos atos homologatórios da agência reguladora, e é isso que torna a premissa auditável. Uma premissa ancorada diz de onde veio: \"adotamos a média dos reajustes homologados da distribuidora X nos últimos N anos\". Uma premissa solta diz apenas o número. A diferença entre as duas não é o valor — é a reprodutibilidade." },
    { kind: 'paragrafo', html: "Terceira, e é a mais delicada: <b>a série histórica de reajuste tarifário não descreve o futuro regulatório da geração distribuída</b>, porque a variável que mais afeta o faturamento de uma unidade compensada nos próximos anos não é o reajuste da tarifa: é o degrau do componente de rede e, a partir de 2029, uma metodologia que ainda está sendo escrita. Uma proposta pode ter trajetória tarifária impecavelmente ancorada e ainda assim estar substancialmente errada, porque ancorou a variável de menor peso e omitiu a de maior. É por isso que a Aula 04 vem antes desta na ordem de leitura." },
    { kind: 'titulo', numero: "06.2", texto: "As três premissas que a proposta faz sem escrever" },
    { kind: 'paragrafo', html: "A ausência de uma linha na planilha não é a ausência de uma premissa. É a presença de uma premissa de valor zero, feita sem declaração e sem justificativa. Três delas são recorrentes." },
    { kind: 'paragrafo', html: "<b>Operação e manutenção igual a zero.</b> Um sistema fotovoltaico exige limpeza periódica — com frequência que depende do ambiente, e que num entorno de mineração, agricultura ou via não pavimentada é substancialmente maior do que num telhado urbano —, monitoramento, inspeção elétrica, e substituição de componentes ao longo da vida útil. Nada disso é opcional se a projeção de geração pressupõe desempenho mantido. Uma proposta que projeta vinte e cinco anos de geração e não tem linha de operação e manutenção está projetando desempenho de sistema mantido com custo de sistema abandonado. Repare que a verificação aqui é <b>de coerência interna</b>, não de valor: não é preciso saber quanto custa a limpeza para apontar que a planilha assume desempenho que depende dela." },
    { kind: 'paragrafo', html: "<b>Inversor eterno.</b> O inversor é o componente eletrônico do sistema e tem vida útil esperada substancialmente menor que a dos módulos. Uma projeção de vinte e cinco anos que não contempla substituição de inversor está assumindo que um equipamento eletrônico de potência opera por vinte e cinco anos sem troca. A pergunta correta ao vendedor não é \"quanto custa trocar o inversor\" — é <b>\"em que ano da projeção está prevista a substituição do inversor, e com qual custo?\"</b>. Se a resposta for \"não está prevista\", a premissa embutida acaba de ser declarada." },
    { kind: 'paragrafo', html: "<b>Crédito que nunca expira.</b> Esta é a menos conhecida e a mais verificável das três, porque é matéria de lei e não de engenharia. O <b>artigo 13</b> da lei de 2022 determina que os créditos de energia elétrica <b>expiram em sessenta meses</b> após a data do faturamento em que foram gerados, revertendo em prol da modicidade tarifária sem que o consumidor faça jus a qualquer compensação. A mesma norma estabelece que, para abatimento do consumo, devem ser utilizados sempre os créditos mais antigos." },
    { kind: 'paragrafo', html: "A consequência prática é direta e frequentemente ignorada: um sistema <b>superdimensionado em relação ao consumo da unidade e das beneficiárias</b> acumula crédito que não será utilizado dentro do prazo, e esse crédito não vira dinheiro nem desconto — ele simplesmente expira. Superdimensionar não é conservador: é desperdício com aparência de prudência. E é exatamente o que uma proposta remunerada por potência instalada tem incentivo estrutural a fazer." },
    { kind: 'paragrafo', html: "A verificação é aritmética simples e não exige nenhum dado que o comprador não tenha: a geração anual estimada deve ser comparada ao consumo anual da unidade somado ao das beneficiárias declaradas, considerando o perfil de uso. Se a geração excede sistematicamente o consumo compensável, existe acúmulo estrutural — e o prazo de sessenta meses é o relógio." },
    { kind: 'titulo', numero: "06.3", texto: "Duas premissas adicionais que dependem do porte" },
    { kind: 'paragrafo', html: "Para projetos de minigeração, duas linhas de custo têm base normativa e portanto são verificáveis, ainda que sejam de natureza financeira." },
    { kind: 'paragrafo', html: "A primeira é a <b>garantia de fiel cumprimento</b> do artigo 4º da lei: quem implanta minigeração distribuída deve apresentá-la em montante de <b>dois e meio por cento</b> do investimento para centrais com potência instalada superior a 500 kW e inferior a 1.000 kW, ou <b>cinco por cento</b> para centrais de 1.000 kW ou mais, conforme regulamentação da agência. São dispensadas as centrais enquadradas em geração compartilhada por consórcio ou cooperativa e as de empreendimento com múltiplas unidades consumidoras. A garantia vigora até trinta dias após a conexão. Uma proposta de minigeração acima de 500 kW que não menciona essa exigência omitiu um custo de estruturação que existe por lei." },
    { kind: 'paragrafo', html: "A segunda é o <b>custo de disponibilidade</b>, que o Módulo 10 já apresentou como piso de faturamento. O artigo 16 da lei de 2022 confirma que a compensação opera até o limite em que o valor faturado seja maior ou igual ao valor mínimo faturável estabelecido na regulamentação vigente. Em outras palavras: <b>a fatura de uma unidade com geração própria nunca chega a zero</b>, e uma proposta que projeta conta zerada está errada por construção — não por otimismo." },
    { kind: 'nota', tom: "neutro", label: "Premissa financeira contra fato verificável", html: "<b>Criança de 12 anos.</b> Tem coisa que dá pra conferir e tem coisa que é palpite. Quanto sol bate no seu telhado: dá pra conferir, tem tabela. Quanto a luz vai custar daqui a dez anos: é palpite. Palpite não é mentira — todo mundo precisa dar palpite pra fazer conta. O problema é quando alguém escreve o palpite do mesmo jeitinho que escreve o que dá pra conferir, com o mesmo tanto de casinha depois da vírgula, e você não consegue mais saber qual é qual. <b>Executivo não técnico.</b> Numa planilha, uma premissa e um fato têm exatamente a mesma aparência: ambos são números com duas casas decimais numa célula. A diferença é que o fato tem fonte e a premissa tem autor. Peça, para cada linha da projeção, uma das duas coisas: a fonte, se for fato, ou a justificativa, se for premissa. Uma proposta que consegue responder isso para todas as linhas é uma proposta séria, mesmo que você discorde de alguma premissa. Uma que não consegue responder para nenhuma não é uma proposta: é uma apresentação. <b>Especialista do setor.</b> A distinção operacional é entre parâmetros com referência externa auditável — irradiação de base climatológica publicada, taxa de degradação garantida em termo de garantia de performance, percentual do componente de rede fixado em lei — e parâmetros de projeção sem referência externa, cuja avaliação se restringe à ancoragem declarada e à consistência interna. A patologia recorrente não é o valor adotado: é a ausência de sinalização de incerteza, com premissas de projeção apresentadas com a mesma precisão nominal de parâmetros medidos. A verificação correta é de declarabilidade e de coerência entre linhas — projeção de desempenho mantido com custo de operação e manutenção nulo, projeção plurianual sem substituição de inversor, e acúmulo de excedente incompatível com o prazo de sessenta meses do art. 13 da Lei nº 14.300/2022 são inconsistências internas demonstráveis sem qualquer arbitramento de valor." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Esta aula define a saída mais defensável do <b>Solar Proposal Validator</b>: um parecer que classifica cada linha da projeção como <b>fato com fonte</b>, <b>premissa ancorada</b>, <b>premissa não ancorada</b> ou <b>premissa embutida por omissão</b> — sem substituir nenhum número por outro. É a forma de entregar valor analítico real sem jamais emitir uma estimativa própria de economia, o que preserva integralmente a posição de independência. A linguagem de saída do produto é sempre a mesma: <b>oportunidades potenciais de economia a serem validadas com dados completos</b>." },
  ],
  'aula-11-07': [
    { kind: 'titulo', numero: "07.1", texto: "Garantia de produto não é garantia de performance" },
    { kind: 'paragrafo', html: "São dois instrumentos jurídicos distintos, com objetos distintos, prazos distintos e, muito frequentemente, <b>garantidores distintos</b>. Confundi-los é o erro contratual mais comum em geração distribuída, e ele é induzido pela linguagem comercial, que fala em \"garantia de vinte e cinco anos\" sem qualificar de qual das duas se trata." },
    { kind: 'paragrafo', html: "A <b>garantia de produto</b> cobre defeito de fabricação do bem físico: o módulo trincou, o inversor queimou, o conector falhou. É garantia de <b>coisa</b>, com prazo tipicamente mais curto, e o garantidor é o fabricante — não o integrador que vendeu, e não a plataforma que intermediou. A <b>garantia de performance</b> cobre a manutenção de um patamar mínimo de conversão ao longo do tempo: o módulo funciona, não tem defeito, mas entrega menos do que o patamar garantido para aquele ano. É garantia de <b>desempenho</b>, com prazo tipicamente longo, e é ela que ancora a verificação de degradação da Aula 05." },
    { kind: 'paragrafo', html: "As perguntas que separam as duas na leitura de um contrato são cinco, e todas cabem numa página: qual é o prazo de cada uma; quem é o garantidor de cada uma; qual é o procedimento de acionamento; <b>quem paga a mão de obra de substituição</b> — porque a garantia do fabricante tipicamente cobre a peça e não a desmontagem, o transporte e a remontagem; e o que acontece com a garantia se a empresa que instalou encerrar as atividades." },
    { kind: 'paragrafo', html: "Esta última merece atenção específica porque a estrutura do setor a torna provável, não excepcional: o mercado de instalação é fragmentado e tem alta rotatividade de empresas, e um contrato de vinte e cinco anos assinado com uma empresa cuja existência ao longo desse horizonte não é garantida precisa dizer, no próprio texto, o que sobrevive à saída dela. Se a garantia de produto é do fabricante, ela sobrevive. Se a garantia de performance foi assumida pelo integrador, ela não sobrevive necessariamente. E se a proposta não distingue as duas, a pergunta ao vendedor é uma só, e é desconfortável de responder: <b>qual dessas garantias continua valendo se a sua empresa não existir mais em dez anos?</b>" },
    { kind: 'titulo', numero: "07.2", texto: "Seis cláusulas com base normativa, em ficha de campo fixo" },
    { kind: 'titulo', numero: null, texto: "Prazo de conexão e perda de regime · Cláusula · Lei nº 14.300/2022, art. 26, §3º" },
    { kind: 'tabela', linhas: [["O que a norma diz", "Os empreendimentos que protocolaram no período dos doze meses devem iniciar a injeção de energia em <b>120 dias</b> para microgeradores, <b>12 meses</b> para minigeradores de fonte solar ou <b>30 meses</b> para minigeradores das demais fontes, contados da emissão do parecer de acesso. A contagem fica suspensa enquanto houver pendência de responsabilidade da distribuidora, caso fortuito ou força maior."], ["O que o contrato deveria dizer", "Qual é o prazo aplicável ao caso, qual a data prevista de emissão do parecer, e de quem é a responsabilidade contratual pelo cumprimento — com consequência definida em caso de descumprimento imputável ao fornecedor."], ["O que fica sem resposta se ausente", "Quem arca com a perda do regime de faturamento se a obra atrasar por culpa do fornecedor. <b>A perda é do consumidor, e é permanente.</b>"], ["Pergunta a fazer ao vendedor", "\"Se o sistema não injetar energia dentro do prazo legal por atraso da sua equipe, qual é a consequência contratual para vocês?\""]] },
    { kind: 'titulo', numero: null, texto: "Aprovação da distribuidora · Cláusula · Lei nº 14.300/2022, arts. 2º e 8º" },
    { kind: 'tabela', linhas: [["O que a norma diz", "A distribuidora deve atender às solicitações de acesso observadas as disposições regulamentares, com formulário padronizado, sendo-lhe vedado exigir documentos adicionais aos indicados; havendo vício formal sanável ou falta de documento, notifica o acessante, que tem <b>30 dias</b> para sanar, salvo prazo distinto acordado. Melhorias e reforços em função exclusiva de conexão de microgeração são integralmente custeados pela distribuidora; a adequação do sistema de medição para minigeração é custeada pelo interessado."], ["O que o contrato deveria dizer", "De quem é a responsabilidade por protocolar, acompanhar e sanar pendências; o que acontece com o preço e com o cronograma se o parecer de acesso exigir obra de reforço; e quem custeia a adequação de medição."], ["O que fica sem resposta se ausente", "Se a obra de reforço vira aditivo de preço, e se o cliente pode desistir sem penalidade caso o orçamento de conexão inviabilize o projeto."], ["Pergunta a fazer ao vendedor", "\"Se o parecer de acesso exigir reforço de rede, quem paga, e eu posso rescindir sem multa nessa hipótese?\""]] },
    { kind: 'titulo', numero: null, texto: "Titularidade e controle societário · Cláusula · Lei nº 14.300/2022, arts. 5º e 6º" },
    { kind: 'tabela', linhas: [["O que a norma diz", "É <b>vedada a transferência do titular ou do controle societário do titular</b> da unidade com micro ou minigeração indicado no parecer de acesso até a solicitação de vistoria do ponto de conexão, sob pena de <b>cancelamento do parecer</b>. E é <b>vedada a comercialização de pareceres de acesso</b>."], ["O que o contrato deveria dizer", "Quem figura como titular no parecer de acesso, e que nenhuma operação societária ocorrerá antes da vistoria. Em arranjos com sociedade de propósito específico, a cláusula precisa ser explícita."], ["O que fica sem resposta se ausente", "Se uma reestruturação societária planejada do cliente pode cancelar o parecer de acesso — e se o projeto sendo vendido é, na origem, um parecer obtido por terceiro."], ["Pergunta a fazer ao vendedor", "\"Em nome de quem o parecer de acesso será protocolado, e esse parecer já existe em nome de outra pessoa?\""]] },
    { kind: 'titulo', numero: null, texto: "Área de instalação e forma de remuneração · Cláusula · Lei nº 14.300/2022, art. 10" },
    { kind: 'tabela', linhas: [["O que a norma diz", "A distribuidora <b>não pode incluir o consumidor no sistema de compensação</b> quando o documento de posse ou propriedade do imóvel demonstrar que o consumidor alugou ou arrendou terreno, lote ou propriedade em condições nas quais o valor do aluguel ou arrendamento se dê <b>em real por unidade de energia elétrica</b>."], ["O que o contrato deveria dizer", "Se há contrato de locação ou arrendamento de área para a usina, qual é a forma de remuneração — e ela não pode ser indexada a energia gerada."], ["O que fica sem resposta se ausente", "Se a estrutura de remuneração da área impede a adesão ao sistema de compensação. <b>É causa de não inclusão, não de multa</b> — o projeto inteiro perde o mecanismo que o justifica."], ["Pergunta a fazer ao vendedor", "\"O terreno da usina é próprio ou arrendado, e como a remuneração do arrendamento está indexada?\""]] },
    { kind: 'titulo', numero: null, texto: "Garantia de produto e de performance · Cláusula · datasheet e contrato de fornecimento" },
    { kind: 'tabela', linhas: [["O que a norma diz", "Não há norma setorial que fixe prazo de garantia; o regime é o do fornecimento de bem, com os termos definidos pelo fabricante e pelo contrato. A conformidade do equipamento é matéria das Portarias Inmetro nº 140/2022 e nº 515/2023."], ["O que o contrato deveria dizer", "Prazo e garantidor <b>separados</b> para produto e para performance; procedimento de acionamento; quem custeia desmontagem, transporte e remontagem; e sobrevivência da obrigação à extinção do integrador."], ["O que fica sem resposta se ausente", "Quem responde por um módulo que funciona mas entrega menos que o patamar garantido, e quem paga a mão de obra da substituição de uma peça coberta."], ["Pergunta a fazer ao vendedor", "\"Quais garantias são do fabricante e quais são de vocês, e o que continua valendo se a sua empresa encerrar as atividades?\""]] },
    { kind: 'titulo', numero: null, texto: "Operação, manutenção e monitoramento · Cláusula · contrato de serviço" },
    { kind: 'tabela', linhas: [["O que a norma diz", "Matéria contratual, sem norma setorial específica. O que a norma estabelece é o dever de o consumidor manter as instalações adequadas, nos termos das condições gerais de fornecimento, e o regime de irregularidade de medição do art. 26, §2º, II, da Lei nº 14.300/2022, que faz cessar o regime preservado."], ["O que o contrato deveria dizer", "Escopo, frequência e preço de limpeza, inspeção e monitoramento; prazo de atendimento em falha; e se o monitoramento é um serviço contratado ou apenas um aplicativo fornecido."], ["O que fica sem resposta se ausente", "Quanto custa manter o desempenho que a projeção pressupõe — e quanto tempo o sistema pode ficar parado sem que ninguém perceba, se não houver monitoramento com alarme e responsável."], ["Pergunta a fazer ao vendedor", "\"Qual é o custo anual de operação e manutenção que vocês recomendam, e ele está na projeção que vocês me mostraram?\""]] },
    { kind: 'titulo', numero: "07.3", texto: "Como se perde o regime que se tinha" },
    { kind: 'paragrafo', html: "O regime de direito adquirido não é uma propriedade do imóvel nem do equipamento. É uma situação jurídica com condições de permanência, e o parágrafo 2º do artigo 26 da lei de 2022 lista as hipóteses em que ela deixa de ser aplicável, refletidas na regulamentação de 2023. São três, e cada uma tem uma tradução operacional." },
    { kind: 'paragrafo', html: "<b>Encerramento da relação contratual</b> entre o consumidor participante e a distribuidora, exceto no caso de troca de titularidade — hipótese em que o direito continua a ser aplicado ao novo titular. Tradução: desligar a unidade e religar depois pode custar o regime. Transferir a titularidade, feita nos termos regulamentares, não custa." },
    { kind: 'paragrafo', html: "<b>Comprovação de irregularidade no sistema de medição</b> atribuível ao consumidor. Tradução: o regime preservado é condicionado à integridade da medição." },
    { kind: 'paragrafo', html: "<b>Aumento de potência instalada</b> cujo protocolo da solicitação ocorra após o marco de doze meses — e a perda incide <b>sobre a parcela de aumento</b>. Tradução, e é a mais importante para avaliação de proposta: <b>ampliar um sistema existente cria uma parcela sob regime novo</b>. Uma proposta de ampliação apresentada como se o sistema inteiro permanecesse sob o regime original está errada, e é um erro de Eixo 2 com efeito financeiro de longo prazo. A pergunta correta diante de qualquer proposta de expansão é: <b>qual regime se aplica à parcela nova, e a projeção separou as duas parcelas?</b>" },
    { kind: 'paragrafo', html: "A regulamentação acrescenta ainda o descumprimento dos prazos de início de injeção do parágrafo 3º como causa de cessação, e trata da hipótese de aumento de potência instalada à revelia da distribuidora. Vale reter o conjunto como um princípio único: <b>o regime é condicionado, e as três condições estão ao alcance de decisões operacionais que ninguém associa a risco regulatório.</b>" },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "As fichas de cláusula e a anatomia dos sinais são a <b>camada de orientação de negociação</b> que o <b>Solar Proposal Validator</b> promete entregar. O formato de saída é o que dá valor: não \"o contrato é ruim\", e sim <b>a lista de perguntas específicas, com destinatário e com base normativa citada</b>, que o cliente leva ao vendedor antes de assinar. Uma pergunta com artigo de lei atrás dela muda a dinâmica da negociação de forma que nenhuma opinião consegue mudar. E a independência é o que torna a lista crível: quem não vende operação e manutenção pode apontar a ausência dela sem que o apontamento seja lido como venda." },
  ],
  'aula-11-08': [
    { kind: 'titulo', numero: "08.1", texto: "Por que duas trilhas e não uma lista" },
    { kind: 'paragrafo', html: "Uma lista de verificação linear falha aqui por uma razão de logística documental: os insumos das duas trilhas chegam em momentos diferentes. A trilha técnico-regulatória se alimenta da apresentação comercial e da planilha, que chegam primeiro. A trilha contratual se alimenta do contrato e dos anexos de garantia, que chegam depois — às vezes só na assinatura. Quem roda uma lista linear termina a parte técnica, forma opinião, e lê o contrato já tendo decidido." },
    { kind: 'paragrafo', html: "Rodar em paralelo tem um efeito prático adicional: a <b>solicitação de documento</b> é a primeira ação da trilha contratual, e ela precisa acontecer no minuto um, não no minuto vinte. Pedir o contrato completo, o datasheet do módulo e do inversor e o termo de garantia de performance é o que dá tempo de eles chegarem antes do fim da avaliação. Se não chegarem, esse é o resultado — e é um resultado legítimo, não uma avaliação incompleta." },
    { kind: 'titulo', numero: "08.2", texto: "Os três vereditos, e por que o terceiro é o mais frequente" },
    { kind: 'paragrafo', html: "<b>Proposta sólida.</b> As premissas técnicas resistem à verificação contra fonte independente, o enquadramento regulatório está correto para o arranjo, as premissas financeiras estão declaradas e ancoradas, e o contrato responde às perguntas de garantia, prazo e responsabilidade. Este veredito existe, é alcançável, e <b>precisa ser dito com a mesma fluência com que se aponta um problema</b>. Um analista que nunca emite este veredito não está sendo rigoroso — está sendo inútil, e será corretamente identificado como tal pelo cliente na segunda ou terceira avaliação." },
    { kind: 'paragrafo', html: "<b>Problema identificado.</b> Existe pelo menos um achado demonstrável: desvio material entre geração declarada e reconstruída, enquadramento incompatível com o arranjo de titularidade, regime de faturamento aplicado incorretamente, premissa embutida por omissão, ou cláusula que deixa responsabilidade indefinida. O achado se descreve, se fundamenta na fonte, e se converte em pergunta ao vendedor. <b>Ele não se converte em recomendação de recusa</b>: a decisão é do cliente, e a maior parte dos achados é negociável." },
    { kind: 'paragrafo', html: "<b>Não é possível concluir.</b> Falta documento. Não veio o datasheet, não veio o contrato, não foi declarada a data de protocolo, não foi especificado o modelo do equipamento, não foi declarada a distribuição de participação no excedente. Este veredito é <b>provavelmente o mais frequente na prática</b>, e é o mais valioso de entregar bem, porque ele se converte diretamente numa lista de solicitações — que é exatamente o que o cliente precisa para prosseguir. Entregar \"não é possível concluir\" acompanhado da lista precisa do que falta é entregar mais valor do que um veredito apressado." },
    { kind: 'paragrafo', html: "Uma nota sobre a assimetria entre os três: a diferença entre \"problema identificado\" e \"não é possível concluir\" é frequentemente uma escolha do avaliador, e a escolha errada é a mais tentadora. Diante de uma proposta que não declara o desempenho global adotado, é possível supor um valor razoável, reconstruir a geração e apontar desvio. Isso é converter uma ausência de informação em uma acusação, e é metodologicamente errado: o desvio calculado depende do valor que <b>o avaliador</b> supôs. O correto é registrar a ausência, pedir o dado, e converter em achado somente quando o dado chegar." },
    { kind: 'titulo', numero: "08.3", texto: "A ordem cronometrada" },
    { kind: 'paragrafo', html: "Trinta minutos, dois relógios rodando em paralelo, três pontos de sincronização. O instrumento abaixo apresenta a sequência passo a passo; o que segue aqui é a lógica da divisão do tempo." },
    { kind: 'paragrafo', html: "Os <b>primeiros cinco minutos</b> não produzem análise nenhuma: produzem <b>solicitações</b>. Esta é a alocação mais contraintuitiva da ordem e a mais importante. Pedir contrato, datasheets e termo de garantia no minuto um é o que permite que a trilha contratual exista. Quem começa analisando a planilha nunca chega ao contrato dentro da janela." },
    { kind: 'paragrafo', html: "Os <b>quinze minutos seguintes</b> são o Eixo 1 e o Eixo 2, nesta ordem, na trilha técnica — e a leitura das cláusulas de garantia e prazo, na trilha contratual. O Eixo 2 vem depois do Eixo 1 mas costuma terminar antes, porque é subsunção e não cálculo." },
    { kind: 'paragrafo', html: "Os <b>últimos dez minutos</b> são o Eixo 3, que só faz sentido depois dos anteriores, e o fechamento das duas trilhas num único veredito. Se o Eixo 1 não fechou, o Eixo 3 não é avaliado — e o veredito é insuficiência, não problema." },
    { kind: 'titulo', numero: "08.4", texto: "A resposta correta a \"só me diga se vale a pena\"" },
    { kind: 'paragrafo', html: "Esta pergunta chega em toda avaliação, e chega no fim, quando o interlocutor já ouviu tudo e quer o resumo. A resposta correta não é um sim, não é um não, e não é \"depende\". É uma devolução com conteúdo, e ela tem três partes:" },
    { kind: 'lista', itens: ["<b>Parte 1 — o que confere.</b> Nomeie o que resistiu à verificação. \"A geração estimada é compatível com a irradiância da localidade e com o desempenho declarado. O enquadramento de modalidade está correto para a titularidade.\" Isto vem primeiro, sempre, e é o que estabelece que a avaliação não é uma procura por defeito.", "<b>Parte 2 — o que não confere ou não foi possível confirmar.</b> Com a fonte de cada achado e a distinção entre as duas categorias. \"A degradação usada é mais otimista que a garantida pelo fabricante do módulo especificado — isso é verificável. O custo de operação e manutenção não aparece — isso é uma omissão, não um erro.\"", "<b>Parte 3 — a pergunta de volta.</b> \"Antes de eu responder se vale a pena: você quer que eu avalie a proposta como ela está, ou quer que eu liste o que precisa ser esclarecido para que a conta dela possa ser conferida? São duas coisas diferentes, e a segunda é a que muda a negociação.\""] },
    { kind: 'paragrafo', html: "Note o que a resposta não contém: nenhum prazo, nenhuma faixa, nenhum valor. E note o que ela entrega: um diagnóstico completo, uma classificação da natureza de cada achado, e uma escolha real para o decisor. É mais útil que um sim, e infinitamente mais defensável." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "A ordem cronometrada é o <b>fluxo de trabalho operacional</b> do <b>Solar Proposal Validator</b>: define quais campos o formulário de entrada precisa capturar, em que ordem o analista os processa, e qual é a estrutura de saída do relatório. O roteador de veredito define os três templates de relatório. E a resposta em três partes de 08.4 é o roteiro da chamada consultiva opcional que o produto oferece — a parte do serviço em que a independência analítica deixa de ser posicionamento e vira experiência verificável para o cliente." },
  ],
};

/** Os catorze exercícios do § Ex. TODOS soltos: a varredura por
 *  `/[Aa]ula\s*\d+/` no enunciado E no gabarito devolve ZERO — a fonte
 *  não declara vínculo, e inventá-lo seria invenção. Mesmo estado dos
 *  Módulos 04-09 (protocolo §5). Por isso `activities: []` nas oito. */
export const MODULO_11_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: 'ex-11-01',
    kind: 'discursiva',
    prompt: "Uma proposta declara 100 kWp instalados e geração anual de 190 MWh. A base nacional dá 5,1 kWh/m²·dia para a localidade, no plano dos módulos. A premissa é realista?",
    points: 1,
    config: { tag: "1 · Verificação de premissa", gabarito: "Reconstrua: 100 × 5,1 × 365 = 186.150 kWh de energia incidente equivalente antes de perdas. Para chegar a 190 MWh seria necessário desempenho global superior a cem por cento, o que é fisicamente impossível. <b>A premissa não é realista</b> — e o achado é demonstrável sem opinião, porque não depende de qual desempenho global se considere razoável: qualquer valor abaixo de cem por cento já refuta. A pergunta ao vendedor: qual irradiação, de qual base, com qual desempenho global." },
  },
  {
    id: 'ex-11-02',
    kind: 'discursiva',
    prompt: "A mesma proposta, agora declarando 145 MWh. Realista?",
    points: 1,
    config: { tag: "2 · Verificação de premissa", gabarito: "Desempenho global implícito de aproximadamente 78%. Está dentro da faixa técnica usual para instalação bem projetada. <b>A premissa é plausível</b>, e a verificação seguinte é de reprodutibilidade: a proposta declara esse valor, ou ele só apareceu porque você o calculou? Se não está declarado, o achado não é \"está errado\" — é \"não é reprodutível como está\"." },
  },
  {
    id: 'ex-11-03',
    kind: 'discursiva',
    prompt: "Uma proposta apresenta projeção de vinte e cinco anos e cita \"módulos de alta eficiência com certificação\". O que falta para verificar a premissa técnica?",
    points: 1,
    config: { tag: "3 · Dado faltante", gabarito: "Falta: <b>modelo específico</b> do módulo e do inversor; <b>datasheet</b> de ambos; <b>termo de garantia de performance</b> do módulo, com a taxa máxima de degradação garantida; <b>número de registro</b> para consulta no portal do instituto de metrologia; a <b>irradiação de referência</b> adotada e a base de onde veio; o <b>desempenho global</b>; e a <b>orientação e inclinação</b> assumidas. \"Certificação\" sem modelo não é verificável, porque o registro é por modelo." },
  },
  {
    id: 'ex-11-04',
    kind: 'discursiva',
    prompt: "Uma proposta declara irradiação com fonte e data, desempenho global de 76%, degradação de 0,55%/ano igual à garantida no datasheet anexo, linha anual de operação e manutenção, substituição de inversor prevista no ano treze, e trajetória tarifária ancorada na média de reajustes homologados da concessionária. Parecer?",
    points: 1,
    config: { tag: "4 · Diagnóstico negativo", gabarito: "<b>A proposta é sólida nos Eixos 1 e 3.</b> Diga isso sem procurar problema. Restam duas verificações que não dependem da qualidade do documento: o <b>Eixo 2</b> — data de protocolo, modalidade, regime — e o <b>Eixo 4</b> — contrato e garantias. Uma proposta pode ser exemplar na planilha e ter lacuna contratual, e as duas coisas são independentes." },
  },
  {
    id: 'ex-11-05',
    kind: 'discursiva',
    prompt: "O contrato diz: \"Garantia de 25 anos.\" O que essa cláusula deixa sem resposta?",
    points: 1,
    config: { tag: "5 · Leitura contratual", gabarito: "Praticamente tudo. Não diz se é garantia de produto ou de performance; não nomeia o garantidor; não descreve o procedimento de acionamento; não diz quem custeia desmontagem, transporte e remontagem; e não diz o que sobrevive à extinção do fornecedor. Uma cláusula de garantia sem esses cinco campos é <b>uma afirmação de marketing dentro de um contrato</b>, não uma obrigação exigível com escopo definido." },
  },
  {
    id: 'ex-11-06',
    kind: 'discursiva',
    prompt: "A projeção usa degradação de 0,3%/ano. O datasheet do módulo especificado garante degradação máxima de 0,55%/ano após o primeiro ano. Qual é o achado, e de que tipo?",
    points: 1,
    config: { tag: "6 · Verificação de premissa", gabarito: "A planilha projeta desempenho <b>mais otimista do que o próprio fabricante garante contratualmente</b>. É achado de Eixo 1, verificável, com fonte independente que é o próprio documento anexo à proposta. A redação correta não é \"a degradação está errada\" — é \"a taxa adotada na projeção é inferior à taxa máxima garantida no termo de garantia do módulo especificado; solicite a projeção refeita com a taxa garantida\"." },
  },
  {
    id: 'ex-11-07',
    kind: 'discursiva',
    prompt: "Uma proposta de geração compartilhada de 800 kW, solar, apresenta a lista de participantes mas não a distribuição de participação no excedente. Por que isso é decisivo?",
    points: 1,
    config: { tag: "7 · Dado faltante", gabarito: "Porque acima de 500 kW em fonte não despachável, na modalidade geração compartilhada, um <b>titular único com 25% ou mais da participação do excedente</b> aciona o regime do parágrafo 1º do artigo 27: cem por cento das componentes de distribuição, quarenta por cento das de transmissão e conexão, e cem por cento dos encargos de pesquisa e desenvolvimento, eficiência energética e taxa de fiscalização. É a diferença entre dois regimes de faturamento inteiramente distintos, e o campo que a determina foi omitido." },
  },
  {
    id: 'ex-11-08',
    kind: 'discursiva',
    prompt: "O contrato prevê que \"eventuais obras de reforço de rede exigidas pela distribuidora serão faturadas em aditivo\". Qual pergunta essa cláusula obriga?",
    points: 1,
    config: { tag: "8 · Leitura contratual", gabarito: "Duas. Primeira: <b>existe teto</b> para esse aditivo, ou o cliente assume risco ilimitado sobre um custo que só será conhecido no parecer de acesso? Segunda: o cliente pode <b>rescindir sem penalidade</b> se o orçamento de conexão inviabilizar o projeto? Sem as duas respostas, o preço da proposta não é o preço da proposta. Note que, para <b>microgeração</b>, melhorias e reforços em função exclusiva da conexão são custeados integralmente pela distribuidora — o que torna a cláusula ainda mais estranha nesse porte." },
  },
  {
    id: 'ex-11-09',
    kind: 'discursiva',
    prompt: "A projeção assume reajuste tarifário de 11% ao ano por vinte anos. A média histórica homologada da concessionária é de 6,5%. A premissa é falsa?",
    points: 1,
    config: { tag: "9 · Verificação de premissa", gabarito: "<b>Não é falsa: é não ancorada.</b> Nenhuma taxa futura é verificável, e essa distinção é o núcleo do Eixo 3. O achado correto é que a premissa se afasta materialmente da única referência disponível e que a proposta não declara por quê. A redação: \"a taxa adotada excede em 4,5 pontos percentuais ao ano a média histórica homologada da concessionária; solicite a justificativa da premissa ou a projeção refeita com sensibilidade sobre esse parâmetro\". Não diga qual taxa é a certa." },
  },
  {
    id: 'ex-11-10',
    kind: 'discursiva',
    prompt: "Um contrato define garantia de produto do fabricante por doze anos, garantia de performance do fabricante por vinte e cinco, mão de obra de substituição coberta pelo integrador por cinco anos, procedimento de acionamento descrito, e cláusula de sobrevivência das obrigações do fabricante à eventual extinção do integrador. Parecer?",
    points: 1,
    config: { tag: "10 · Diagnóstico negativo", gabarito: "<b>O contrato responde às cinco perguntas.</b> Diga isso. A limitação da mão de obra a cinco anos é uma condição, não um defeito: está declarada, é precificável e é negociável. A diferença entre um contrato com risco declarado e um contrato com risco indefinido é a diferença entre poder decidir e não poder — e o primeiro é o que se pede." },
  },
  {
    id: 'ex-11-11',
    kind: 'discursiva',
    prompt: "O cliente é uma indústria que iniciou processo de migração para o ambiente livre há três meses. A proposta projeta compensação de excedentes. O que precisa ser esclarecido antes de qualquer outra verificação?",
    points: 1,
    config: { tag: "11 · Dado faltante", gabarito: "Se a unidade efetivamente exerceu a opção de compra de energia. O <b>parágrafo único do artigo 9º</b> da Lei nº 14.300/2022 veda a adesão ao sistema de compensação aos consumidores livres que exerceram essa opção e aos consumidores especiais que adquiriram energia na forma da legislação específica. Se a migração se consumar, o benefício projetado <b>não é aplicável àquela unidade</b>. Isso tem precedência sobre toda a análise técnica, porque invalida a premissa central do documento." },
  },
  {
    id: 'ex-11-12',
    kind: 'discursiva',
    prompt: "Uma proposta de ampliação de sistema existente, cujo original foi protocolado em 2022, projeta o conjunto inteiro sob compensação integral até 2045. Correto?",
    points: 1,
    config: { tag: "12 · Verificação de premissa", gabarito: "<b>Não.</b> O inciso III do parágrafo 2º do artigo 26 estabelece que as disposições do regime preservado deixam de ser aplicáveis <b>na parcela de aumento</b> da potência instalada cujo protocolo ocorra após os doze meses da publicação da lei. A parcela nova entra no regime de transição; a original permanece preservada. A projeção precisa <b>separar as duas parcelas</b>, e o erro é de Eixo 2 com efeito por toda a vida útil da ampliação." },
  },
  {
    id: 'ex-11-13',
    kind: 'discursiva',
    prompt: "A usina será instalada em terreno arrendado, e o contrato de arrendamento remunera o proprietário em valor por megawatt-hora gerado. Qual é o problema?",
    points: 1,
    config: { tag: "13 · Leitura contratual", gabarito: "O <b>artigo 10</b> da Lei nº 14.300/2022 impede a distribuidora de incluir o consumidor no sistema de compensação quando o documento de posse ou propriedade demonstrar arrendamento cujo valor se dê em real por unidade de energia elétrica. Não é multa nem ressalva: é <b>causa de não inclusão</b>. O projeto perde o mecanismo que o justifica. A solução é contratual — reestruturar a remuneração do arrendamento — e precisa acontecer antes do protocolo." },
  },
  {
    id: 'ex-11-14',
    kind: 'discursiva',
    prompt: "Ao fim de trinta minutos, você tem: geração verificada e compatível, enquadramento correto, premissas financeiras declaradas e ancoradas, e nenhum contrato — ele \"será enviado na assinatura\". Qual é o veredito?",
    points: 1,
    config: { tag: "14 · Dado faltante", gabarito: "<b>Não é possível concluir</b>, e a razão precisa ser dita com precisão: a trilha técnico-regulatória fechou favoravelmente e a trilha contratual não pôde ser executada. O veredito não é negativo — é incompleto por indisponibilidade documental, e a insuficiência tem precedência. A entrega é a lista de solicitações: contrato completo, anexo de garantias, e as cinco perguntas de garantia por escrito. E vale nomear o padrão: contrato que só aparece na assinatura é contrato lido por quem já decidiu." },
  },
];


// ── INSTRUMENTOS ─────────────────────────────────────────────
// A fonte tem ONZE `div.inst`: um no § MAP (fora de aula) e dez de
// aula, com as Aulas 05 e 08 tendo dois cada.
//
// SEIS DE LOOKUP, portados aqui — mecânica de seleção que revela texto.
// O dado abaixo é o literal do `<script>` da fonte AVALIADO em Node
// (não transcrito à mão: 40 mil chars de prosa onde erro de digitação
// seria certeza estatística — protocolo §10), e o veredito compõe os
// mesmos campos, com os mesmos rótulos, que o `render()` original
// compõe.
//
// Os CINCO computacionais (Inst 04, 05, 06, 07, 08) entram nos commits
// seguintes desta wave, um por vez, com fidelidade confirmada contra o
// script original executado em DOM simulado.

/** INST · 01 — as quatro lentes e os dez itens da proposta.
 *  Literais do `var LENTES` / `var ITENS` do <script> da fonte. */
export const M11_MAPA_LENTES: Record<string, string> = {
  eixo: "Cada afirmação de uma proposta pertence a um dos quatro eixos, e o eixo determina que tipo de verdade a afirmação admite. Eixo 1 admite comparação com base publicada. Eixo 2 admite subsunção a norma, com resposta binária. Eixo 3 não admite verificação de valor, apenas de ancoragem. Eixo 4 não produz número, produz pergunta.",
  fonte: "Toda afirmação verificável tem uma fonte independente do vendedor, e quase todas essas fontes são brasileiras, públicas e gratuitas. Quando a fonte independente é o próprio fabricante do equipamento cotado, a verificação continua sendo independente do integrador que vendeu, que é quem tem o incentivo comercial no resultado.",
  sozinho: "A pergunta que separa uma verificação executável de uma verificação teórica. A maior parte dos itens de uma proposta pode ser conferida por quem não é engenheiro, com consulta a base pública e aritmética de planilha. Engenheiro é necessário para dimensionar; para conferir premissa declarada contra fonte publicada, o que se exige é método.",
  falta: "A ausência de um item numa proposta não é neutra: ela é uma premissa feita sem declaração. Ausência de degradação equivale a degradação zero na planilha. Ausência de operação e manutenção equivale a custo zero. Ausência de data de protocolo deixa indeterminado o regime que governa o faturamento por toda a vida útil do sistema.",
};
export const M11_MAPA_ITENS: ReadonlyArray<{ k: string; n: string } & Record<string, string>> = [
  { k: "pot", n: "Potência instalada", eixo: "<b>Eixo 1 — físico.</b> A potência é um dado do projeto, não uma projeção. Mas atenção à unidade: o enquadramento de porte usa potência instalada em corrente alternada, e a proposta costuma anunciar potência de pico dos módulos, em corrente contínua. São dois números diferentes e a diferença muda a classificação regulatória.", fonte: "A ficha técnica do inversor, para a potência nominal em corrente alternada, e a do módulo, para a potência de pico. Ambas públicas, ambas do fabricante, ambas independentes de quem vendeu.", sozinho: "Sim, integralmente. Some a potência nominal dos inversores e compare com o limiar de setenta e cinco quilowatts. Some a potência de pico dos módulos e verifique qual dos dois números a proposta usou para afirmar o porte.", falta: "Se a proposta declara apenas potência de pico, o porte não está determinado e o rito de conexão, os prazos legais de injeção e a exigência de garantia de fiel cumprimento ficam indefinidos. Peça a potência nominal dos inversores." },
  { k: "ger", n: "Geração anual estimada", eixo: "<b>Eixo 1 — físico.</b> É o produto de potência instalada, irradiação no plano dos módulos e desempenho global. Os dois primeiros têm referência externa; o terceiro é escolhido por quem faz a conta e é onde a estimativa se infla sem que nada de falso seja afirmado.", fonte: "A base nacional de irradiação do instituto de pesquisas espaciais, para a localidade específica, ou a ferramenta de consulta por ponto do centro de referência em energia solar e eólica. Downloads e consultas públicas e gratuitas.", sozinho: "Sim. Consulte a irradiação da coordenada, multiplique por potência e por trezentos e sessenta e cinco, e divida a geração declarada pelo resultado. O quociente é o desempenho global implícito. Se ele passa de cem por cento, a afirmação é fisicamente impossível.", falta: "Se a proposta não declara irradiação de referência, base de origem, desempenho global, orientação e inclinação, a estimativa não é reprodutível. Premissa que não permite reprodução não é premissa: é resultado apresentado como se fosse dado." },
  { k: "deg", n: "Taxa de degradação", eixo: "<b>Eixo 1 — físico.</b> A degradação é característica previsível do material e é objeto de garantia contratual. Não é opinião do vendedor: é número que o fabricante assumiu por escrito para aquele modelo.", fonte: "O termo de garantia de performance do modelo especificado, que declara a perda do primeiro ano e a taxa máxima de degradação anual garantida depois dela. Documento do fabricante, anexo ao datasheet.", sozinho: "Sim, e é a verificação mais rápida do módulo inteiro: compare a taxa usada na projeção com a taxa garantida no datasheet. Se a projeção é mais otimista que a garantia, a planilha projeta desempenho que o próprio fabricante não assegura.", falta: "Proposta sem menção de degradação está aplicando degradação zero na projeção, ou seja, afirmando que o equipamento entrega no último ano exatamente o que entregou no primeiro. E proposta que não especifica o modelo torna a verificação impossível, o que é, por si só, o achado." },
  { k: "equip", n: "Modelo e conformidade do equipamento", eixo: "<b>Eixo 1 — físico, com componente regulatório.</b> A existência de registro de conformidade é fato verificável; o que ele cobre e o que fica fora do escopo compulsório é matéria de norma.", fonte: "O portal do instituto de metrologia, para consulta de registro do produto. A consulta é feita por modelo, nunca por marca, e o que importa é registro vigente obtido sob o regulamento aplicável.", sozinho: "Sim. Peça modelo exato de módulo e inversor e consulte o registro. Verifique também se o inversor do projeto está dentro do escopo compulsório, que alcança inversores até setenta e cinco quilowatts, ou fora dele.", falta: "Sem o modelo, nada pode ser verificado: nem conformidade, nem degradação garantida, nem características elétricas. A frase equipamento certificado, sem modelo, não é informação verificável e não deve ser aceita como resposta." },
  { k: "mod", n: "Modalidade de participação declarada", eixo: "<b>Eixo 2 — regulatório.</b> Resposta binária. O arranjo de titularidade descrito ou se encaixa na modalidade nomeada, ou não se encaixa, e não há gradação nem margem de interpretação.", fonte: "A lei de dois mil e vinte e dois, no artigo que define as quatro modalidades, e a norma de condições gerais, que as incorporou. Além dos documentos societários do próprio cliente, que provam a titularidade.", sozinho: "Sim, com o auxílio de quem cuida do jurídico. A verificação é documental: qual documento comprova que o arranjo descrito satisfaz os requisitos da modalidade nomeada. Se a proposta usa vocabulário comercial de plataforma, o primeiro passo é traduzir para o termo da norma.", falta: "Se a modalidade não está declarada, ou está declarada em vocabulário de marca, a elegibilidade do arranjo permanece indeterminada, e com ela a legitimidade de todo o benefício projetado para as unidades beneficiárias." },
  { k: "data", n: "Data de protocolo do pedido de acesso", eixo: "<b>Eixo 2 — regulatório.</b> É a variável de maior consequência financeira de toda a proposta, e ela não está no equipamento nem no porte: está num protocolo administrativo na distribuidora.", fonte: "O próprio protocolo da distribuidora, com data. Para sistemas existentes, o parecer de acesso. A regra que a data aciona está na lei de dois mil e vinte e dois e na regulamentação de dois mil e vinte e três.", sozinho: "Sim. Pergunte a data e compare com os marcos: sete de janeiro de dois mil e vinte e três define o direito adquirido; sete de julho do mesmo ano define a janela que posterga a regra pós-transição para dois mil e trinta e um.", falta: "Sem a data, o regime de faturamento aplicável é indeterminado, e portanto toda a projeção de custo da energia compensada é indeterminada. Este é o campo ausente mais caro que uma proposta pode ter." },
  { k: "reg", n: "Regime de faturamento projetado", eixo: "<b>Eixo 2 — regulatório, com fronteira no Eixo 3.</b> Até dois mil e vinte e oito, o percentual está fixado em lei e é verificável. De dois mil e vinte e nove em diante, a regra depende de metodologia ainda em elaboração.", fonte: "A lei de dois mil e vinte e dois, nos artigos de transição e na regra pós-transição, e o estado do projeto regulatório da agência, cuja conclusão está prevista para dois mil e vinte e sete.", sozinho: "Sim, quanto ao percentual do ano corrente. Quanto ao período posterior a dois mil e vinte e oito, o que se verifica não é o número: é se a proposta reconhece que a regra ainda não existe.", falta: "Proposta que projeta o horizonte inteiro sob a mesma regra está tratando como conhecido um parâmetro em elaboração. O achado correto não é que o número está errado, e sim que ele é hipótese apresentada como projeção." },
  { k: "tar", n: "Trajetória de reajuste tarifário", eixo: "<b>Eixo 3 — premissa financeira.</b> Não existe verificação de valor. Existe premissa ancorada em série identificável e premissa solta, e a diferença entre as duas não é o número, é a reprodutibilidade.", fonte: "Os atos homologatórios de reajuste tarifário anual da distribuidora que atende a unidade, publicados pela agência reguladora. Série pública, por área de concessão.", sozinho: "Sim. Levante os reajustes homologados dos últimos anos daquela concessionária e compare com a taxa que a proposta usou. Não para dizer qual é a certa, e sim para medir o afastamento e perguntar de onde veio a premissa.", falta: "Se a taxa não está declarada e apenas está embutida no resultado, a projeção não é auditável. Peça a planilha aberta, ou ao menos a taxa e a fonte da ancoragem." },
  { k: "om", n: "Operação, manutenção e substituição de inversor", eixo: "<b>Eixo 3 — premissa financeira, com teste de coerência interna.</b> Não é preciso saber o custo correto para apontar o problema: basta notar que a projeção pressupõe desempenho que depende de manutenção que ela não orçou.", fonte: "O contrato de serviço, se houver, e a vida útil declarada do inversor no seu datasheet. A coerência entre a projeção de desempenho e o orçamento de manutenção é verificável dentro do próprio documento.", sozinho: "Sim. Procure a linha de operação e manutenção e a linha de substituição de inversor. Se não existirem, a premissa embutida acaba de ser identificada, e a pergunta ao vendedor é em que ano a troca está prevista.", falta: "Ausência de linha de manutenção equivale a custo zero de manutenção com desempenho mantido. Ausência de substituição de inversor equivale a supor que um equipamento eletrônico de potência opera duas décadas e meia sem troca." },
  { k: "gar", n: "Garantias e responsabilidades", eixo: "<b>Eixo 4 — contratual.</b> Não produz número. Produz uma lista de perguntas com destinatário definido, e é o eixo que continua operando por vinte anos depois que todos os outros viraram história.", fonte: "O contrato e seus anexos, o termo de garantia do fabricante, e a norma apenas de forma indireta, quanto aos prazos legais de conexão e às vedações de titularidade.", sozinho: "Sim, com leitura atenta. As cinco perguntas são sempre as mesmas: prazo de cada garantia, garantidor de cada uma, procedimento de acionamento, quem paga a mão de obra da substituição, e o que sobrevive à extinção do fornecedor.", falta: "Se o contrato não foi fornecido, o eixo não pode ser avaliado, e o veredito correto é de insuficiência, não de aprovação. Contrato que só aparece na assinatura é contrato lido por quem já decidiu." },
];

/** INST · 02 — doze afirmações típicas de proposta, com eixo, método
 *  de verificação e o que a afirmação NÃO autoriza concluir. */
export const M11_SEPARADOR_EIXOS: ReadonlyArray<{
  k: string; n: string; e: string; m: string; x: string;
}> = [
  { k: "a1", n: "Gera 1.750 kWh por kWp ao ano", e: "Eixo 1 — físico", m: "Reconstrução da estimativa a partir da irradiação publicada da localidade e do desempenho global declarado.", x: "Não autoriza nenhuma conclusão financeira. Geração por unidade de potência é entrada da conta, não resultado dela." },
  { k: "a2", n: "Equipamento com certificação", e: "Eixo 1 — físico, com componente regulatório", m: "Consulta de registro por modelo no portal do instituto de metrologia, com verificação de vigência e de regulamento aplicável.", x: "Não autoriza concluir que o equipamento é adequado ao projeto. Certificação atesta conformidade a requisitos, não adequação a um dimensionamento específico. E inversores acima de setenta e cinco quilowatts estão fora do escopo compulsório." },
  { k: "a3", n: "Sistema enquadrado como microgeração", e: "Eixo 2 — regulatório", m: "Comparação da potência instalada em corrente alternada com o limiar de setenta e cinco quilowatts. Subsunção binária.", x: "Não autoriza usar a potência de pico dos módulos como base da comparação. São grandezas distintas e a confusão entre elas é o erro de porte mais comum." },
  { k: "a4", n: "Modalidade: geração compartilhada", e: "Eixo 2 — regulatório", m: "Verificação do instrumento associativo, da lista de participantes, da distribuidora comum e da participação de cada titular no excedente.", x: "Não autoriza supor que o regime de faturamento é o padrão. Acima de quinhentos quilowatts em fonte não despachável, com titular único detendo vinte e cinco por cento ou mais, o regime é o agravado." },
  { k: "a5", n: "Créditos acumulados serão usados no inverno", e: "Eixo 2 — regulatório, com aritmética de Eixo 1", m: "Comparação da geração estimada com o consumo compensável das beneficiárias, contra o prazo legal de expiração de sessenta meses.", x: "Não autoriza supor acúmulo indefinido. Crédito expira e reverte em prol da modicidade tarifária, sem compensação ao consumidor." },
  { k: "a6", n: "Tarifa sobe 10% ao ano no horizonte", e: "Eixo 3 — premissa financeira", m: "Comparação com a série de reajustes homologados da concessionária específica. Avaliação de ancoragem, não de valor.", x: "Não autoriza afirmar que a premissa é falsa. Autoriza afirmar que ela se afasta da única referência disponível e que a proposta não declara por quê." },
  { k: "a7", n: "Não há custos recorrentes relevantes", e: "Eixo 3 — premissa embutida por omissão", m: "Teste de coerência interna: a projeção pressupõe desempenho mantido, que depende de limpeza, monitoramento e reposição.", x: "Não autoriza arbitrar um valor de manutenção no lugar. Autoriza registrar a incoerência e pedir o orçamento de manutenção que sustenta a projeção de desempenho." },
  { k: "a8", n: "Garantia de 25 anos", e: "Eixo 4 — contratual", m: "Leitura do contrato e do termo de garantia. Separação entre garantia de produto e de performance, com prazo e garantidor de cada uma.", x: "Não autoriza tratar a afirmação como obrigação de escopo definido. Sem garantidor, procedimento e custeio de mão de obra, é frase de marketing dentro de um contrato." },
  { k: "a9", n: "A conta de luz ficará zerada", e: "Eixo 2 — regulatório, com resposta imediata", m: "Confronto com o valor mínimo faturável previsto na norma e reiterado na lei de dois mil e vinte e dois.", x: "Não autoriza nenhuma discussão de grau. A afirmação é incorreta por construção: a fatura de unidade participante do sistema de compensação não chega a zero." },
  { k: "a10", n: "A demanda contratada cairá com a geração", e: "Eixo 2 — regulatório, com base no Módulo 10", m: "Verificação de que a proposta descreve alguma ação sobre o contrato de uso, e não apenas a instalação da geração.", x: "Não autoriza projetar redução de demanda faturada como efeito automático da instalação. Geração reduz consumo; demanda contratada só muda por ato contratual." },
  { k: "a11", n: "Instale agora, antes que o Fio B suba", e: "Eixo 2 — verdadeiro e incompleto", m: "Verificação de que a mesma fonte também informa que a regra a partir de dois mil e vinte e nove ainda não foi definida.", x: "Não autoriza tratar a urgência como neutra. A afirmação de base é verdadeira, e é justamente por isso que funciona como argumento de venda. A omissão que costuma acompanhá-la é o que precisa ser notado." },
  { k: "a12", n: "Seu projeto será autoprodução", e: "Eixo 2 — regime jurídico incorreto", m: "Confronto com os limiares do regime de equiparação: demanda agregada de trinta mil quilowatts, composta por unidades de três mil quilowatts, e participação societária na titular da outorga.", x: "Não autoriza tratar o termo como sinônimo elegante de gerar a própria energia. Autoproducao por equiparacao e outro regime juridico, de outro universo de consumidor." },
];

/** INST · 03 — sete marcos do arcabouço, com instrumento, vigência,
 *  o que mudou e estado de regulamentação. */
export const M11_MARCOS: ReadonlyArray<{
  k: string; n: string; t: string; norma: string; desde: string; fez: string; estado: string;
}> = [
  { k: "m1", n: "2012", t: "Resolução Normativa nº 482, de 17 de abril de 2012", norma: "Resolução normativa da agência reguladora.", desde: "17 de abril de 2012. <b>Revogada</b> pela resolução de fevereiro de 2023.", fez: "Criou o acesso de microgeração e minigeração distribuída aos sistemas de distribuição e instituiu o sistema de compensação de energia elétrica no plano infralegal. Por uma década foi a base de tudo, e foi alterada por resoluções sucessivas ao longo do período.", estado: "Sem vigência. Proposta comercial que a cita como norma aplicável está desatualizada em pelo menos três instrumentos normativos, e isso é um achado datável." },
  { k: "m2", n: "2021", t: "Resolução Normativa nº 1.000, de 7 de dezembro de 2021", norma: "Resolução normativa da agência reguladora — condições gerais de fornecimento.", desde: "7 de dezembro de 2021, com alterações posteriores.", fez: "Consolidou as regras de prestação do serviço público de distribuição num único instrumento e absorveu a matéria de geração distribuída. É a norma que o Módulo 10 já ensinou a navegar, e é onde a matéria vive hoje.", estado: "Vigente e sob alteração contínua. Toda consulta deve ser feita ao texto consolidado, com atenção às notas de inclusão que indicam qual resolução inseriu cada dispositivo." },
  { k: "m3", n: "2022", t: "Lei nº 14.300, de 6 de janeiro de 2022", norma: "Lei federal — marco legal da microgeração e minigeração distribuída.", desde: "Publicada em 7 de janeiro de 2022; vigência na data da publicação. Partes vetadas promulgadas em agosto de 2022.", fez: "Definiu as quatro modalidades e os limiares de porte, instituiu o sistema de compensação em lei, criou o regime de direito adquirido até 2045, estabeleceu o cronograma de transição do componente de rede e delegou à agência a regra que vale depois da transição. Também fixou prazos de conexão, vedações de titularidade e o prazo de expiração de créditos.", estado: "Vigente, com alterações pontuais posteriores. É a peça central e a única que precisa ser lida na íntegra por quem avalia propostas." },
  { k: "m4", n: "2023", t: "Resolução Normativa nº 1.059, de 7 de fevereiro de 2023", norma: "Resolução normativa da agência reguladora — regulamentação do marco legal.", desde: "Publicada em 10 de fevereiro de 2023, com vigência na data da publicação e retificação posterior.", fez: "Inseriu na norma de condições gerais as definições de microgeração e minigeração distribuída e a modalidade autoconsumo remoto; criou o capítulo de faturamento do sistema de compensação e as classes GD I, GD II e GD III; e revogou a resolução de 2012 e outras quatro que a haviam alterado.", estado: "Vigente. É a fonte da nomenclatura de classes que aparece na resolução homologatória de tarifas da distribuidora e, portanto, na fatura." },
  { k: "m5", n: "2024", t: "Resolução Normativa nº 1.098, de 23 de julho de 2024 · e Resolução CNPE nº 2, de 22 de abril de 2024", norma: "Resolução normativa da agência reguladora e resolução do conselho de política energética.", desde: "A resolução da agência a partir de julho de 2024; a do conselho publicada em 7 de maio de 2024.", fez: "A resolução da agência inseriu a definição de autoconsumo local na norma de condições gerais, dois anos e meio depois de a lei criar o termo, e tratou dos cenários de dispensa de análise de inversão de fluxo. A resolução do conselho fixou as diretrizes de valoração de custos e benefícios da geração distribuída, em cumprimento tardio ao prazo legal de seis meses.", estado: "Vigentes. A resolução do conselho é diretriz, não metodologia: ela diz o que a agência deve considerar, não como calcular." },
  { k: "m6", n: "2025", t: "Lei nº 15.269, de 24 de novembro de 2025", norma: "Lei federal — reforma do setor elétrico, conversão de medida provisória.", desde: "Publicada em 25 de novembro de 2025, sancionada com mais de vinte vetos.", fez: "Redefiniu a autoprodução por equiparação com os limiares de trinta mil quilowatts agregados e três mil quilowatts individuais, mais participação societária com direito a voto. Alterou o artigo 25 e revogou o parágrafo único do artigo 22 da lei de 2022, ambos sobre o custeio temporário de componentes não remuneradas pelo consumidor-gerador. Vetou o dispositivo que teria permitido a usinas de grande porte migrar ao regime de geração distribuída pela conexão à distribuição.", estado: "<b>Vigente com vetos pendentes de deliberação.</b> Na data de consulta, a sessão conjunta do Congresso Nacional destinada aos vetos havia sido cancelada e dezenas permaneciam trancando a pauta. Verificar o estado antes de uso externo." },
  { k: "m7", n: "2027 · previsto", t: "Metodologia de valoração dos benefícios sistêmicos — a regulamentar", norma: "Resolução da agência reguladora, ainda não editada.", desde: "<b>Não vigente.</b> Prazo legal original: dezoito meses da publicação da lei de 2022, ou seja, julho de 2023.", fez: "Nada ainda. O que existe é processo: tomada de subsídios aberta em dezembro de 2025, com contribuições até março de 2026, a ser seguida de análise de impacto regulatório e consulta pública.", estado: "<b>Em projeto regulatório, com conclusão prevista para 2027.</b> É a peça que determina o faturamento das unidades participantes do sistema de compensação a partir de 2029. Toda projeção que atravesse esse ano projeta sobre regra inexistente, e dizer isso é a informação de maior valor que uma avaliação independente pode entregar." },
];

/** INST · 09 — os oito sinais de alerta, na ordem da fonte. Cada um
 *  com o que o caracteriza, a fonte independente, o que o comprador
 *  verifica sozinho e a pergunta a levar ao vendedor. */
export const M11_SINAIS: ReadonlyArray<{
  k: string; n: string; c: string; f: string; s: string; p: string;
}> = [
  { k: "ger", n: "1 · Geração estimada exagerada", c: "A geração anual declarada excede o que a irradiação do município sustenta para a potência instalada proposta, ou o desempenho global implícito na conta ultrapassa o que um sistema real entrega em campo. É o sinal com maior efeito sobre o resultado, porque toda a projeção financeira é construída sobre esse número.", f: "Atlas Brasileiro de Energia Solar, segunda edição, do instituto nacional de pesquisas espaciais, ou a ferramenta de consulta por localidade do centro de referência para energia solar e eólica. Ambas são públicas e permitem consulta por município.", s: "Consultar a irradiação do município exato da instalação e reconstruir a ordem de grandeza da geração pela potência declarada. Somar a potência dos módulos listados e conferir contra a potência informada. Os dois cruzamentos levam poucos minutos e não exigem formação técnica.", p: "Qual irradiação foi usada, em que plano, de qual base de dados e com que desempenho global? Peço a decomposição da estimativa e o relatório de simulação com as premissas de perda visíveis." },
  { k: "fin", n: "2 · Resultado financeiro sem premissa declarada", c: "A proposta apresenta a conclusão financeira sem expor as premissas que a produzem: trajetória tarifária assumida, degradação, custo de operação e manutenção, e o tratamento dado ao período em que a regra tarifária ainda não está definida. Sem essas quatro, o número é uma saída sem entradas visíveis.", f: "A própria proposta, na seção de premissas — e a ausência dessa seção é o achado. Para a ancoragem tarifária, os atos homologatórios de reajuste anual da distribuidora, publicados pela agência reguladora.", s: "Procurar, no documento, a lista de premissas. Se existir, conferir cada uma contra a fonte correspondente. Se não existir, o achado está completo sem nenhuma conta: a conclusão não é auditável.", p: "Quais premissas produzem esse resultado, e qual é a fonte de cada uma? Peço a planilha com as premissas em células visíveis e editáveis, não o resultado consolidado." },
  { k: "deg", n: "3 · Degradação ignorada ou subestimada", c: "A projeção não aplica perda anual de desempenho, ignora a perda do primeiro ano, ou usa taxa menor que a máxima garantida no termo de garantia de performance do módulo efetivamente especificado. O efeito é pequeno em cada ano e material no acumulado do horizonte.", f: "Termo de garantia de performance e ficha técnica do modelo listado na proposta, fornecidos pelo fabricante e normalmente disponíveis publicamente.", s: "Ler no termo de garantia dois números: o percentual garantido ao fim do primeiro ano e a perda máxima anual subsequente. Conferir se o código do modelo no termo é o mesmo da lista de materiais.", p: "Qual taxa de degradação está na planilha, e ela é a esperada ou a garantida? Peço a projeção refeita com a curva do termo de garantia do modelo especificado." },
  { k: "tar", n: "4 · Trajetória tarifária irrealista", c: "A taxa de crescimento tarifário assumida se afasta materialmente da série homologada da concessionária que atende a unidade, ou não está declarada e vem embutida no resultado. Composta ao longo do horizonte, uma diferença anual pequena domina a projeção.", f: "Atos homologatórios de reajuste tarifário anual da distribuidora específica, publicados pela agência reguladora, com a série dos últimos anos.", s: "Levantar a série de reajustes homologados da concessionária e comparar com a taxa da planilha. A série é pública e a comparação é aritmética simples.", p: "Qual taxa de reajuste está assumida, de qual série ela vem, de qual concessionária e em qual período? A série inclui revisão tarifária periódica ou só reajuste ordinário?" },
  { k: "cert", n: "5 · Equipamento sem certificação adequada", c: "Módulo, inversor, controlador de carga ou bateria sem registro válido no programa de avaliação da conformidade, ou registro obtido sob regulamento anterior ao vigente. Ter selo e ter o registro vigente sob a norma correta não são a mesma verificação.", f: "Consulta pública ao registro de objeto no instituto nacional de metrologia, e o texto das portarias de certificação compulsória de 2022 e de 2023, que definem escopo, requisitos e prazos.", s: "Localizar o código do modelo na lista de materiais e consultar o registro. Conferir se o equipamento está dentro do escopo da certificação compulsória — inversores acima de setenta e cinco quilowatts, por exemplo, ficam fora dele, o que não os torna irregulares, apenas não certificados por esse regime.", p: "Qual é o número de registro de cada equipamento e sob qual portaria ele foi obtido? Se algum item está fora do escopo da certificação compulsória, qual documento atesta a conformidade dele?" },
  { k: "gar", n: "6 · Garantias mal explicadas", c: "A proposta menciona garantia sem distinguir garantia de produto, que cobre defeito de fabricação do equipamento, de garantia de performance, que assegura um percentual de produção ao longo do tempo, de garantia de instalação, que responde pelo serviço. Quem responde por cada uma, e por quanto tempo, quase nunca está no mesmo parágrafo.", f: "Termo de garantia do fabricante e o contrato de prestação de serviços com o integrador, incluídos os anexos. Os dois documentos, não apenas a página de resumo da proposta.", s: "Verificar, para cada tipo de garantia, três campos: prazo, quem é o garantidor e qual é o procedimento de acionamento. Se um dos três estiver ausente para qualquer das garantias, o achado está caracterizado.", p: "Quem responde pela garantia de performance, o fabricante ou o integrador? Qual é o procedimento se o equipamento falhar e o integrador não existir mais? Peço os termos completos em anexo." },
  { k: "oem", n: "7 · Operação e manutenção ausente do orçamento", c: "O orçamento não inclui limpeza periódica, monitoramento, inspeção elétrica nem substituição do inversor ao longo do horizonte, mas a projeção de resultado assume produção compatível com um sistema mantido. Custo omitido do orçamento e desempenho suposto na planilha são incompatíveis.", f: "A própria proposta e o contrato de serviços. Para a vida útil esperada do inversor, a ficha técnica e o termo de garantia do modelo especificado.", s: "Procurar a linha de operação e manutenção no orçamento e a linha correspondente na projeção. Verificar se há evento de substituição de inversor dentro do horizonte declarado e se ele está orçado.", p: "Operação e manutenção estão no escopo e no orçamento? Qual é a periodicidade e o que ela inclui? A substituição do inversor está prevista dentro do horizonte da projeção, e por conta de quem?" },
  { k: "reg", n: "8 · Risco regulatório omitido", c: "A proposta trata o enquadramento e o percentual do componente de rede como constantes, não declara a data de protocolo que determina o regime aplicável, e projeta o período posterior ao fim da transição como se a regra já existisse. É o sinal mais difícil de ver, porque exige saber que a regra futura ainda está em elaboração.", f: "Lei do marco legal de 2022, artigos 26 e 27; resolução normativa da agência de 2023, que criou a classificação de regime e os artigos de faturamento; e o estado do projeto regulatório que definirá a regra posterior à transição.", s: "Verificar se a proposta declara a data de protocolo da solicitação de acesso e o regime resultante. Verificar se a projeção usa percentual variável por ano ou percentual fixo. Percentual fixo ao longo de todo o horizonte é, por si só, o achado.", p: "Qual é a data prevista de protocolo e qual regime ela produz? A projeção aplica o percentual de cada ano do cronograma legal? Que hipótese foi adotada para o período posterior ao fim da transição, e ela está declarada como hipótese?" },
];

/** INST · 11 — os oito passos das duas trilhas sincronizadas, com
 *  janela de minuto, o que fazer, fonte e erro que o passo previne. */
export const M11_PASSOS: ReadonlyArray<{
  n: string; tr: string; t0: number; t1: number; sinc: boolean;
  tit: string; faz: string; fon: string; err: string;
}> = [
  { n: "01", tr: "Técnica", t0: 0, t1: 3, sinc: false, tit: "Identificar potência instalada em corrente alternada e classificar o porte", faz: "Localizar, na lista de materiais, a potência dos módulos e a potência do inversor, e identificar qual das duas a proposta chama de potência instalada. A classificação de porte usa a potência em corrente alternada, que é a do inversor. Setenta e cinco quilowatts separam microgeração de minigeração.", fon: "Lei do marco legal de 2022, artigo 1º, incisos que definem microgeração e minigeração; e a resolução da agência de 2021, com a redação dada pela resolução de 2023, que incorporou as mesmas definições.", err: "Classificar o porte pela potência de pico dos módulos. É o erro de partida mais comum e ele se propaga por todo o resto: porte errado leva a modalidade elegível errada, que leva a regime errado." },
  { n: "02", tr: "Contratual", t0: 0, t1: 3, sinc: false, tit: "Inventariar os documentos e registrar o que não veio", faz: "Listar o que existe: proposta, planilha de premissas, ficha técnica do módulo, ficha técnica do inversor, termo de garantia de performance, minuta de contrato e anexos. O inventário se faz antes de qualquer leitura, porque ele determina quais trilhas podem ser concluídas.", fon: "A própria proposta e seus anexos. Nenhuma fonte externa é necessária neste passo.", err: "Começar a ler o documento mais interessante em vez de inventariar. Quem começa pela planilha descobre no minuto vinte e cinco que o contrato nunca veio, e perde a avaliação inteira." },
  { n: "03", tr: "Técnica", t0: 3, t1: 8, sinc: false, tit: "Conferir a geração estimada contra a irradiação da localidade", faz: "Consultar a irradiação do município da instalação na base nacional, reconstruir a ordem de grandeza da geração pela potência declarada e comparar com a geração da proposta. Calcular o desempenho global implícito e verificar se ele cabe no que um sistema real entrega.", fon: "Atlas Brasileiro de Energia Solar, segunda edição, do instituto nacional de pesquisas espaciais; ou a ferramenta de consulta por localidade do centro de referência para energia solar e eólica.", err: "Usar irradiação da capital do estado ou da sede da empresa. Irradiância varia por município, e a diferença entre dois municípios da mesma região pode explicar sozinha o desvio que se está tentando investigar." },
  { n: "04", tr: "Técnica", t0: 8, t1: 12, sinc: true, tit: "Confrontar a modalidade declarada com o arranjo de titularidade real", faz: "Verificar qual das quatro modalidades a proposta declara e se a titularidade descrita cabe nela: mesma unidade, mesmo titular em unidades distintas na mesma distribuidora, associação civil de consumidores, ou unidades em propriedade contígua. Verificar também se a unidade não migrou para o ambiente livre, hipótese em que não pode aderir ao sistema de compensação.", fon: "Lei do marco legal de 2022, artigo 1º para as definições, artigo 9º para quem pode aderir; resolução da agência de 2021, artigo 2º, com as inclusões das resoluções de 2023 e de 2024.", err: "Aceitar o nome comercial do arranjo como se fosse a modalidade regulatória. Denominação de produto não é nomenclatura de norma, e a elegibilidade se verifica contra a segunda. Este é o primeiro ponto de sincronização: sem modalidade confirmada, a trilha contratual não tem contra o que conferir o objeto do contrato." },
  { n: "05", tr: "Técnica", t0: 12, t1: 17, sinc: false, tit: "Determinar o regime de faturamento pela data de protocolo", faz: "Identificar a data prevista ou realizada do protocolo da solicitação de acesso e derivar o regime aplicável, o percentual do componente de rede do ano corrente e o ano em que a regra posterior à transição passa a incidir. Verificar se a projeção da proposta aplica percentual variável por ano ou percentual fixo.", fon: "Lei do marco legal de 2022, artigos 26 e 27; resolução da agência de 2021, artigos de faturamento incluídos pela resolução de 2023, que estabelecem a classificação de regime.", err: "Tratar o percentual como constante ao longo do horizonte, e tratar o período posterior ao fim da transição como se a regra já estivesse definida. Ela não está: as diretrizes de valoração foram publicadas em 2024 e o projeto regulatório que produzirá o cálculo tem conclusão prevista para 2027." },
  { n: "06", tr: "Contratual", t0: 17, t1: 22, sinc: false, tit: "Separar garantia de produto, de performance e de instalação", faz: "Para cada uma das três, registrar prazo, garantidor e procedimento de acionamento. Conferir se o termo de garantia anexo é do modelo efetivamente listado na lista de materiais, e não de um modelo equivalente.", fon: "Termo de garantia do fabricante e minuta de contrato de prestação de serviços com os anexos.", err: "Ler a página de resumo da proposta em vez dos termos. O resumo diz vinte e cinco anos de garantia; o termo diz qual garantia, de quem, sob qual condição, e é ele que vale." },
  { n: "07", tr: "Contratual", t0: 22, t1: 26, sinc: false, tit: "Ler responsabilidade, prazos de conexão e hipóteses de rescisão", faz: "Verificar quem protocola a solicitação de acesso, quem responde pelo atraso da distribuidora, qual é o efeito de o prazo legal de injeção não ser cumprido, o que ocorre com o pagamento se a homologação demorar, e sob quais hipóteses cada parte pode rescindir.", fon: "Lei do marco legal de 2022, artigo 26 e seus parágrafos, para os prazos de início de injeção; e as vedações dos artigos 5º, 6º, 10 e 11 da mesma lei, que alcançam transferência de titularidade, comercialização de parecer de acesso, forma de remuneração de terreno e divisão de central.", err: "Supor que o atraso da distribuidora é risco do fornecedor por padrão. Não é: é matéria de cláusula, e a cláusula precisa existir. Perder o prazo legal de injeção pode custar o regime de faturamento inteiro." },
  { n: "08", tr: "Ambas", t0: 26, t1: 30, sinc: true, tit: "Fechar: veredito das duas trilhas ou lista de solicitações", faz: "Consolidar o estado dos quatro eixos, aplicar a precedência da insuficiência documental sobre qualquer outro estado, e emitir uma das três saídas: proposta sólida, problema identificado e caracterizado, ou lista do que falta para concluir.", fon: "Os achados dos sete passos anteriores, cada um com a fonte que o sustenta registrada ao lado.", err: "Emitir veredito sobre eixo não verificado, e não emitir o veredito favorável quando ele é o correto. Os dois erros têm a mesma origem — a expectativa de que o parecer precise encontrar alguma coisa — e o segundo é o mais caro para a reputação de quem avalia. Este é o segundo ponto de sincronização, e a avaliação termina aqui com ou sem conclusão." },
];

/** INST · 10 — o texto de cada eixo por estado. Quatro eixos, três
 *  estados cada: `ok` · `desvio`/`incomp`/`fraca`/`lacuna` · `falta`. */
export const M11_E1: Record<string, string> = {
  ok: "O Eixo 1 confere: a geração declarada é compatível com a irradiação da localidade e a degradação assumida não é melhor que a garantida.",
  desvio: "O Eixo 1 apresenta desvio material entre a premissa declarada e a referência independente, o que compromete toda a projeção construída sobre ela.",
  falta: "O Eixo 1 não pôde ser verificado: falta a ficha técnica do módulo ou do inversor, ou falta a decomposição da estimativa de geração.",
};
export const M11_E2: Record<string, string> = {
  ok: "O Eixo 2 confere: porte, modalidade e regime declarados correspondem ao arranjo descrito e à norma vigente.",
  erro: "O Eixo 2 está incompatível: a modalidade declarada não comporta o arranjo de titularidade descrito, ou o regime informado não decorre da data de protocolo.",
  falta: "O Eixo 2 não pôde ser verificado: a proposta não declara a data de protocolo da solicitação de acesso ou não descreve a titularidade das unidades beneficiárias.",
};
export const M11_E3: Record<string, string> = {
  ok: "O Eixo 3 está ancorado: as premissas financeiras estão declaradas e referenciadas a série verificável.",
  solta: "O Eixo 3 está declarado sem ancoragem: as premissas aparecem, mas nenhuma indica de onde veio.",
  omissa: "O Eixo 3 está embutido: as premissas não aparecem no documento e só existem dentro do resultado.",
};
export const M11_E4: Record<string, string> = {
  ok: "O Eixo 4 está completo: o contrato e os anexos respondem quem garante o quê, por quanto tempo, com qual procedimento, sob qual hipótese de rescisão e o que ocorre se a conexão atrasar.",
  lacuna: "O Eixo 4 está documentado mas incompleto: o contrato existe e deixa ao menos uma das perguntas de responsabilidade sem resposta.",
  ausente: "O Eixo 4 não foi avaliado: o contrato ou os anexos não foram fornecidos.",
};

/** INST · 04 — as quatro modalidades, com definição, o que a proposta
 *  precisa provar e se exige documento societário (`esp`). */
export const M11_MOD_ARRANJO: Record<string, { n: string; d: string; prova: string; esp: boolean }> = {
  local: { n: "Autoconsumo local", d: "Geração eletricamente junto à carga, com excedente e crédito integralmente compensados pela mesma unidade consumidora. Definida no inciso I do artigo 1º da lei de 2022 e incorporada ao artigo 2º da norma de condições gerais pela resolução de julho de 2024.", prova: "Documento que demonstre que a unidade geradora e a unidade consumidora são a mesma, com o número de instalação. Se a proposta menciona beneficiar outras unidades, o enquadramento declarado está incorreto.", esp: false },
  remoto: { n: "Autoconsumo remoto", d: "Unidades de titularidade de uma mesma pessoa física ou jurídica, incluídas matriz e filial, com a geração em local diferente das beneficiárias e todas atendidas pela mesma distribuidora. Definida no inciso II do artigo 1º e incorporada ao artigo 2º da norma pela resolução de fevereiro de 2023.", prova: "Prova documental de titularidade idêntica de todas as unidades envolvidas e confirmação de que todas são atendidas pela mesma distribuidora. Grupo econômico com pessoas jurídicas distintas não satisfaz o requisito de titularidade.", esp: true },
  compart: { n: "Geração compartilhada", d: "Reunião de consumidores por consórcio, cooperativa, condomínio civil voluntário ou edilício ou outra associação civil instituída para esse fim, com todas as unidades atendidas pela mesma distribuidora. Definida no inciso X do artigo 1º.", prova: "Instrumento associativo com data, lista de participantes, participação de cada titular no excedente, e confirmação de distribuidora comum. A participação do maior titular é o campo que determina se incide o regime agravado.", esp: true },
  emuc: { n: "Empreendimento com múltiplas unidades consumidoras", d: "Conjunto de unidades em mesma propriedade ou propriedades contíguas, sem separação por via pública, passagem aérea ou subterrânea ou propriedade de terceiro, com as instalações de uso comum constituindo unidade consumidora distinta. Definido no inciso VII do artigo 1º.", prova: "Comprovação de contiguidade, existência de unidade consumidora distinta para as áreas de uso comum e responsabilidade formal do condomínio, administração ou proprietário sobre ela.", esp: false },
};

/** INST · 05 — a escada do Fio B por ano, literal do `var ESC`. */
export const M11_ESCADA_FIOB: Record<string, number> = {
  '2023': 15,
  '2024': 30,
  '2025': 45,
  '2026': 60,
  '2027': 75,
  '2028': 90,
};

/** Os instrumentos do módulo. INST 01 vive no § MAP — fora de qualquer
 *  aula —, e por isso é exportado à parte, para os Recursos do Módulo,
 *  mesmo caminho do `lab-01` do Módulo 01. */
const M11_INSTRUMENTOS_TODOS: Instrument[] = [
  {
    id: "m11-inst-01",
    kind: "explorador",
    title: "Mapa da proposta — quatro lentes sobre a mesma estrutura",
    formula: null,
    fields: [
      { id: "mp-lente", label: "Lente ativa", unit: null, kind: "select", defaultValue: "eixo",
        options: [{ value: "eixo", label: "A que eixo pertence" }, { value: "fonte", label: "Qual fonte independente confirma" }, { value: "sozinho", label: "O que o comprador confirma sozinho" }, { value: "falta", label: "O que falta se estiver ausente" }] },
      { id: "mp-item", label: "Item da proposta", unit: null, kind: "select", defaultValue: "pot",
        options: [{ value: "pot", label: "Potência instalada" }, { value: "ger", label: "Geração anual estimada" }, { value: "deg", label: "Taxa de degradação" }, { value: "equip", label: "Modelo e conformidade do equipamento" }, { value: "mod", label: "Modalidade de participação declarada" }, { value: "data", label: "Data de protocolo do pedido de acesso" }, { value: "reg", label: "Regime de faturamento projetado" }, { value: "tar", label: "Trajetória de reajuste tarifário" }, { value: "om", label: "Operação, manutenção e substituição de inversor" }, { value: "gar", label: "Garantias e responsabilidades" }] },
    ],
    outputs: [],
    note: "Escolha a lente e depois o item da proposta. A lente determina a pergunta; o item determina a resposta. Nenhuma célula está vazia, e nenhuma resposta contém valor de economia ou prazo de retorno — por construção.",
  },
  {
    id: "m11-inst-02",
    kind: "explorador",
    title: "Separador de eixos — a que categoria pertence cada afirmação",
    formula: null,
    fields: [
      { id: "se-a", label: "Afirmação típica de proposta", unit: null, kind: "select", defaultValue: "a1",
        options: [{ value: "a1", label: "Gera 1.750 kWh por kWp ao ano" }, { value: "a2", label: "Equipamento com certificação" }, { value: "a3", label: "Sistema enquadrado como microgeração" }, { value: "a4", label: "Modalidade: geração compartilhada" }, { value: "a5", label: "Créditos acumulados serão usados no inverno" }, { value: "a6", label: "Tarifa sobe 10% ao ano no horizonte" }, { value: "a7", label: "Não há custos recorrentes relevantes" }, { value: "a8", label: "Garantia de 25 anos" }, { value: "a9", label: "A conta de luz ficará zerada" }, { value: "a10", label: "A demanda contratada cairá com a geração" }, { value: "a11", label: "Instale agora, antes que o Fio B suba" }, { value: "a12", label: "Seu projeto será autoprodução" }] },
    ],
    outputs: [],
    note: null,
  },
  {
    id: "m11-inst-03",
    kind: "explorador",
    title: "Régua do marco regulatório — sete marcos com data, efeito e estado",
    formula: null,
    fields: [
      { id: "rg-m", label: "Marco", unit: null, kind: "select", defaultValue: "m1",
        options: [{ value: "m1", label: "2012" }, { value: "m2", label: "2021" }, { value: "m3", label: "2022" }, { value: "m4", label: "2023" }, { value: "m5", label: "2024" }, { value: "m6", label: "2025" }, { value: "m7", label: "2027 · previsto" }] },
    ],
    outputs: [],
    note: null,
  },
  {
    id: "m11-inst-09",
    kind: "explorador",
    title: "Anatomia dos oito sinais de alerta — sinal, fonte, conta, pergunta",
    formula: null,
    fields: [
      { id: "sa-s", label: "Sinal de alerta", unit: null, kind: "select", defaultValue: "ger",
        options: [{ value: "ger", label: "1 · Geração estimada exagerada" }, { value: "fin", label: "2 · Resultado financeiro sem premissa declarada" }, { value: "deg", label: "3 · Degradação ignorada ou subestimada" }, { value: "tar", label: "4 · Trajetória tarifária irrealista" }, { value: "cert", label: "5 · Equipamento sem certificação adequada" }, { value: "gar", label: "6 · Garantias mal explicadas" }, { value: "oem", label: "7 · Operação e manutenção ausente do orçamento" }, { value: "reg", label: "8 · Risco regulatório omitido" }] },
    ],
    outputs: [],
    note: null,
  },
  {
    id: "m11-inst-11",
    kind: "explorador",
    title: "Ordem de avaliação em trinta minutos — duas trilhas sincronizadas",
    formula: null,
    fields: [
      { id: "or-p", label: "Passo", unit: null, kind: "select", defaultValue: "0",
        options: [{ value: "0", label: "01 · Técnica" }, { value: "1", label: "02 · Contratual" }, { value: "2", label: "03 · Técnica" }, { value: "3", label: "04 · Técnica ⟂" }, { value: "4", label: "05 · Técnica" }, { value: "5", label: "06 · Contratual" }, { value: "6", label: "07 · Contratual" }, { value: "7", label: "08 · Ambas ⟂" }] },
    ],
    outputs: [],
    note: null,
  },
  {
    id: "m11-inst-10",
    kind: "quebra-cabeca",
    title: "Roteador de veredito — três classes, todas alcançáveis",
    formula: null,
    fields: [
      { id: "rv-e1", label: "Eixo 1 — premissa técnica", unit: null, kind: "select", defaultValue: "ok",
        options: [{ value: "ok", label: "Confere com a fonte independente" }, { value: "desvio", label: "Desvio material identificado" }, { value: "falta", label: "Falta dado para verificar" }] },
      { id: "rv-e2", label: "Eixo 2 — enquadramento regulatório", unit: null, kind: "select", defaultValue: "ok",
        options: [{ value: "ok", label: "Enquadramento compatível" }, { value: "erro", label: "Modalidade ou porte incompatível" }, { value: "falta", label: "Documento de enquadramento ausente" }] },
      { id: "rv-e3", label: "Eixo 3 — premissa financeira", unit: null, kind: "select", defaultValue: "ok",
        options: [{ value: "ok", label: "Premissas ancoradas" }, { value: "solta", label: "Declarada sem ancoragem" }, { value: "omissa", label: "Premissa embutida, não declarada" }] },
      { id: "rv-e4", label: "Eixo 4 — contrato", unit: null, kind: "select", defaultValue: "ok",
        options: [{ value: "ok", label: "Contrato e anexos completos" }, { value: "lacuna", label: "Documentado mas incompleto" }, { value: "ausente", label: "Contrato não avaliado" }] },
    ],
    outputs: [],
    note: null,
  },
  {
    id: "m11-inst-04",
    kind: "simulador",
    title: "Classificador de porte e modalidade — produto cartesiano completo",
    formula: null,
    fields: [
      { id: "cl-pot", label: "Potência instalada em corrente alternada", unit: "kW", kind: "range", defaultValue: 180, min: 1, max: 6000, step: 1 },
      { id: "cl-fonte", label: "Fonte", unit: null, kind: "select", defaultValue: "solar", options: [{ value: "solar", label: "Solar sem baterias" }, { value: "solarbat", label: "Solar com baterias qualificadas" }, { value: "desp", label: "Outra fonte despachável" }] },
      { id: "cl-arr", label: "Arranjo", unit: null, kind: "select", defaultValue: "local", options: [{ value: "local", label: "Gera e consome na mesma unidade" }, { value: "remoto", label: "Outras unidades, mesmo titular" }, { value: "compart", label: "Titulares distintos em associação" }, { value: "emuc", label: "Mesma propriedade, área comum" }] },
    ],
    outputs: [],
    note: null,
  },
  {
    id: "m11-inst-05",
    kind: "simulador",
    title: "Roteador de regime — data de protocolo determina tudo",
    formula: null,
    fields: [
      { id: "rr-ano", label: "Ano de referência da leitura", unit: "ano", kind: "range", defaultValue: 2026, min: 2023, max: 2032, step: 1 },
      { id: "rr-data", label: "Data de protocolo do pedido de acesso", unit: null, kind: "select", defaultValue: "ate2022", options: [{ value: "ate2022", label: "Até 7 de janeiro de 2022" }, { value: "doze", label: "8 jan 2022 a 7 jan 2023" }, { value: "semestre", label: "8 jan 2023 a 7 jul 2023" }, { value: "depois", label: "Após 7 de julho de 2023" }] },
      { id: "rr-porte", label: "Porte", unit: null, kind: "select", defaultValue: "micro", options: [{ value: "micro", label: "Microgeração" }, { value: "mini500", label: "Minigeração até 500 kW" }, { value: "mini500mais", label: "Minigeração acima de 500 kW" }] },
      { id: "rr-mod", label: "Modalidade", unit: null, kind: "select", defaultValue: "localemuc", options: [{ value: "localemuc", label: "Autoconsumo local ou EMUC" }, { value: "pulv", label: "Autoconsumo remoto pulverizado" }, { value: "conc", label: "Geração compartilhada concentrada" }] },
    ],
    outputs: [],
    note: null,
  },
  {
    id: "m11-inst-06",
    kind: "calculadora",
    title: "Verificador de geração estimada — desvio contra referência independente",
    formula: null,
    fields: [
      { id: "gv-pot", label: "Potência instalada declarada", unit: "kWp", kind: "range", defaultValue: 100, min: 1, max: 3000, step: 1 },
      { id: "gv-ger", label: "Geração anual declarada na proposta", unit: "MWh/ano", kind: "range", defaultValue: 175, min: 1, max: 6000, step: 1 },
      { id: "gv-irr", label: "Irradiação da localidade, plano dos módulos", unit: "kWh/m²·dia", kind: "range", defaultValue: 5.2, min: 2, max: 7.5, step: 0.05 },
      { id: "gv-pr", label: "Desempenho global de referência adotado na conferência", unit: "%", kind: "range", defaultValue: 78, min: 50, max: 92, step: 1 },
    ],
    outputs: [
      { id: "gv-ref", label: "Geração de referência reconstruída", unit: "MWh/ano" },
      { id: "gv-dev", label: "Desvio da declarada sobre a referência", unit: "%" },
      { id: "gv-prim", label: "Desempenho global implícito na proposta", unit: "%" },
    ],
    note: null,
  },
  {
    id: "m11-inst-07",
    kind: "calculadora",
    title: "Verificador de degradação declarada — planilha contra garantia do fabricante",
    formula: null,
    fields: [
      { id: "dg-prop", label: "Degradação anual usada na proposta", unit: "%/ano", kind: "range", defaultValue: 0.4, min: 0, max: 2, step: 0.05 },
      { id: "dg-ds", label: "Degradação máxima garantida no datasheet", unit: "%/ano", kind: "range", defaultValue: 0.55, min: 0, max: 2, step: 0.05 },
      { id: "dg-y1", label: "Perda declarada no primeiro ano", unit: "%", kind: "range", defaultValue: 2, min: 0, max: 5, step: 0.1 },
      { id: "dg-hz", label: "Horizonte da projeção da proposta", unit: "anos", kind: "range", defaultValue: 25, min: 5, max: 30, step: 1 },
    ],
    outputs: [
      { id: "dg-p1", label: "Produção final sob a premissa da proposta", unit: "%" },
      { id: "dg-p2", label: "Produção final sob a garantia do fabricante", unit: "%" },
      { id: "dg-gap", label: "Energia acumulada a menos no horizonte", unit: "%" },
    ],
    note: null,
  },
  {
    id: "m11-inst-08",
    kind: "calculadora",
    title: "Verificador de trajetória tarifária — premissa contra ancoragem histórica",
    formula: null,
    fields: [
      { id: "tt-prop", label: "Reajuste anual assumido na proposta", unit: "%/ano", kind: "range", defaultValue: 9, min: 0, max: 20, step: 0.25 },
      { id: "tt-hist", label: "Média histórica homologada da concessionária", unit: "%/ano", kind: "range", defaultValue: 6, min: 0, max: 20, step: 0.25 },
      { id: "tt-hz", label: "Horizonte da projeção", unit: "anos", kind: "range", defaultValue: 20, min: 5, max: 30, step: 1 },
      { id: "tt-anc", label: "Ancoragem declarada na proposta", unit: null, kind: "select", defaultValue: "fonte", options: [{ value: "fonte", label: "Série histórica com fonte citada" }, { value: "soi", label: "Índice oficial genérico" }, { value: "nada", label: "Sem ancoragem declarada" }] },
    ],
    outputs: [
      { id: "tt-gap", label: "Afastamento anual da ancoragem", unit: "p.p." },
      { id: "tt-i1", label: "Índice final sob a premissa da proposta", unit: null },
      { id: "tt-exc", label: "Excesso acumulado sobre a ancoragem", unit: "%" },
    ],
    note: null,
  },
];

const porId = (id: string): Instrument =>
  M11_INSTRUMENTOS_TODOS.find((x) => x.id === id)!;

/** Instrumento de aparato (§ MAP), sem aula dona. */
export const MODULO_11_INSTRUMENTOS: Instrument[] = [porId('m11-inst-01')];

export const MODULO_11_AULAS: CurriculumAula[] = [
  {
    id: 'aula-11-01',
    moduleId: 'modulo-11',
    number: 1,
    totalInModule: 8,
    title: "A aula que impede toda promessa de retorno prematura",
    subtitle: "Os quatro eixos",
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
    instruments: [porId('m11-inst-02')],
  },
  {
    id: 'aula-11-02',
    moduleId: 'modulo-11',
    number: 2,
    totalInModule: 8,
    title: "De 2012 a 2025: seis instrumentos, duas pendências e duas fronteiras",
    subtitle: "Marco regulatório",
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
    instruments: [porId('m11-inst-03')],
  },
  {
    id: 'aula-11-03',
    moduleId: 'modulo-11',
    number: 3,
    totalInModule: 8,
    title: "Dois limiares, quatro modalidades, e o que a proposta precisa provar",
    subtitle: "Porte e modalidades",
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
    instruments: [porId('m11-inst-04')],
  },
  {
    id: 'aula-11-04',
    moduleId: 'modulo-11',
    number: 4,
    totalInModule: 8,
    title: "GD I, GD II, GD III — e o ano em que a regra ainda não existe",
    subtitle: "Regimes e cronograma",
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
    instruments: [porId('m11-inst-05')],
  },
  {
    id: 'aula-11-05',
    moduleId: 'modulo-11',
    number: 5,
    totalInModule: 8,
    title: "Irradiância, geração estimada, degradação e certificação",
    subtitle: "Premissa técnica",
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
    instruments: [porId('m11-inst-06'), porId('m11-inst-07')],
  },
  {
    id: 'aula-11-06',
    moduleId: 'modulo-11',
    number: 6,
    totalInModule: 8,
    title: "Trajetória tarifária, operação e manutenção, e o crédito que expira",
    subtitle: "Premissa financeira",
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
    instruments: [porId('m11-inst-08')],
  },
  {
    id: 'aula-11-07',
    moduleId: 'modulo-11',
    number: 7,
    totalInModule: 8,
    title: "O que fica sem resposta se o equipamento falhar — e como se perde o regime",
    subtitle: "Contrato e enquadramento",
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
    instruments: [porId('m11-inst-09')],
  },
  {
    id: 'aula-11-08',
    moduleId: 'modulo-11',
    number: 8,
    totalInModule: 8,
    title: "Trinta minutos, duas trilhas, três vereditos",
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
    instruments: [porId('m11-inst-10'), porId('m11-inst-11')],
  },
];
