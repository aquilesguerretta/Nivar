// alexandria-modulo-15-content.ts
// Bloco 15 — Petróleo, Gás e Petrobras. Nível 3, track 'brasil'.
// TERCEIRO módulo da Trilha 3 (Especialização Estratégica), cujos
// blocos são 13 a 17.
//
// CATÁLOGO CONFIRMADO na FOUNDRY, não herdado de suposição própria nem
// da wave anterior:
//   { id: 'bloco-15', level: 3, track: 'brasil',
//     title: 'Petróleo, Gás e Petrobras', illustrationPrefix: null,
//     priority: 'media' }
// O título da fonte BATE com o catálogo — `<title>` e `<h1>` trazem
// "Petróleo, Gás e Petrobras", literal. Sem a divergência que o Módulo
// 11 registrou (protocolo §7). O track segue 'brasil': a Trilha 3 NÃO
// introduz track novo, só muda o `level` de 2 para 3.
//
// EXTRAÍDO de `Alexandria modulos/alexandria_modulo15.html` — 370.303
// bytes (280.694 caracteres de markup + 78.878 de <script>).
//
// ── VOCABULÁRIO MEDIDO (protocolo §6) ────────────────────────
// Os OITO seletores dos Módulos 01-03 dão ZERO (`class="aula"`,
// `aula-marker`, `div class="exercise"`, `exercise-tag`,
// `glossary-item`, `checklist-item`, `class="lead"`,
// `instrument-title`). É o vocabulário abreviado dos Módulos 04+.
//
// ── CONTAGEM POR TRÊS SINAIS (protocolo §5) ──────────────────
// 19 seções = 9 aulas + 10 de aparato. Os sinais CONCORDAM:
//   aulas        9   (9 seções casando `Aula NN`)
//   instrumentos 10  (10 `div.inst`: 1 no §MAP, 9 em aula — um por aula)
//   exercícios   15  (o §Ex anuncia "Quinze exercícios"; 15 `<details>`)
//   termos       174 (o §Lex anuncia "Cento e setenta e quatro"; 174
//                     `span.term`)
// Nenhuma divergência prosa × markup a registrar neste módulo.
//
// ── COBERTURA DE TEXTO (o gate do protocolo §5) ──────────────
// Medida POR PALAVRA, nunca por trecho contíguo, sobre o corpo de cada
// aula com o markup dos instrumentos descontado do denominador:
//   a01 100,0% · a02 96,3% · a03 93,4% · a04 98,8% · a05 100,0%
//   a06 100,0% · a07 99,0% · a08 100,0% · a09 100,0%
// Agregado 98,9%. Nenhuma aula abaixo de 90%.
//
// O primeiro corte fechou em 75,1% e SUBIU EM QUATRO ETAPAS, cada uma
// depois de caçar a estrutura que o extrator herdado atravessava sem
// capturar:
//   75,1% → 87,4%  containers `wrap` / `scroll` / `cmpx` percorridos
//   87,4% → 89,4%  `fx` (fórmula), `stp`, `glo` (gak/gav), `clk`
//   89,4% → 93,3%  correção do MEDIDOR: ele não contava bloco `formula`,
//                  e aula com fórmula media baixo sem perda nenhuma
//   93,3% → 98,9%  `par` / `par-col` / `ph` e `mot` / `mot-r` — o
//                  confronto em duas colunas
//
// ── ESTRUTURAS DA FONTE, TODAS CAPTURADAS ────────────────────
// `div.emp` (42 pares chave/valor em 36 linhas) é a QUARTA variante da
// mesma família de ficha que o protocolo já registrou como perdida em
// silêncio: `src-card` no M08, `div.fi` nos M09/M10, `emp` no M13 e
// aqui. A fonte renomeia a estrutura a cada dois ou três módulos, então
// varredura por nome de classe conhecido nunca basta — o que pega é
// medir volume de texto por classe não capturada.
//
// `div.par` / `par-col` / `ph` (confronto em duas colunas, com
// cabeçalho por coluna) e `div.mot` / `mot-r` são ESTREIA deste módulo.
// Viram uma `nota` por coluna, com o `ph` como label — par chave-valor
// e rótulo+prosa vão para `nota`, nunca para `tabela`, porque o
// componente `Tabela` trata a primeira linha como `<thead>` e
// consumiria um par de dado real como cabeçalho (protocolo §14).
//
// `div.fx` mapeia em `kind: 'formula'`, com `eq` e `desc` em TEXTO
// PURO — o `ApostilaPanel` renderiza esses dois campos como texto
// React, sem `dangerouslySetInnerHTML`, então HTML inline preservado
// ali apareceria literal na tela (protocolo §14).
//
// ── GRAVURA: nenhuma, com os dois sinais concordando ─────────
// `illustrationPrefix: null` no catálogo E zero `<img>` no markup.
// `illustrations: []` nas nove — nenhuma biblioteca de outro bloco foi
// forçada por semelhança de tema, que é o que a regra proíbe.
//
// ── video / durationMinutes / difficulty: null MEDIDOS ───────
// Zero <video>, <iframe>, youtube, vimeo, .mp4 e <audio> no arquivo.
//
// ── § Lex NÃO extraído ───────────────────────────────────────
// Os 174 termos ficam de fora: glossário é escopo próprio, fechado até
// o Módulo 08 na Wave 34.

import type { CurriculumAula, Instrument, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';

export const MODULO_15_LEAD: Record<string, string> = {
  'aula-15-01': "O Brasil tem três regimes contratuais de exploração e produção operando ao mesmo tempo, às vezes em campos geologicamente vizinhos, dentro da mesma bacia sedimentar e sob a mesma lâmina d'água. O regime não muda a geologia e não muda o volume físico produzido. Muda três coisas que decidem toda leitura financeira: <b>quem é titular da molécula</b>, <b>o que o Estado recebe e em que forma</b>, e <b>quanto daquele barril vira receita de quem o produziu</b>. Dois números de produção sob regimes diferentes somam para efeito de volume e não somam para efeito de receita, e essa é a origem de metade das leituras erradas deste tema.",
  'aula-15-02': "Esta é a terceira vez que o currículo encontra o mesmo erro estrutural com roupa nova. O Módulo 08 separou capacidade instalada de energia gerada. O Módulo 14 separou potência instalada, energia gerada e energia exportada. Aqui a separação é <b>recurso contingente ≠ reserva ≠ produção</b> — e a reserva ainda se subdivide por grau de certeza. Material de divulgação cita sistematicamente a maior das grandezas disponíveis, e cita o critério mais generoso quando quer parecer grande e o mais conservador quando quer parecer prudente, quase sempre sem declarar qual.",
  'aula-15-03': "O currículo escreve, sobre este tópico, apenas: <em>royalties — impacto fiscal nos estados produtores</em>. Isso omite três coisas que decidem a leitura. Primeira: royalty e participação especial têm bases de cálculo, periodicidades, alíquotas e conjuntos de beneficiários <b>diferentes</b>, e tratá-los como sinônimo é o erro mais comum do tema. Segunda: a regra de repartição entre União, estados e municípios foi alterada por lei e disputada judicialmente por mais de uma década, e permanece sensível. Terceira: a receita é volátil por depender simultaneamente de volume produzido, de preço de referência e de câmbio — três variáveis que não se movem juntas.",
  'aula-15-04': "Quando alguém diz \"o petróleo subiu\", a frase pode significar seis coisas diferentes, e a distância entre a primeira e a última <em>não é uma constante</em>. Ela muda com qualidade do óleo, com frete, com câmbio, com tributo, com margem e — desde 2026 — com uma camada nova que quase nenhum material de referência ainda incorporou: a subvenção econômica. Esta aula existe para que você nunca mais compare uma cotação internacional com um preço de posto e conclua alguma coisa.",
  'aula-15-05': "A pergunta chega sempre na mesma forma — <em>se o Brasil produz tanto petróleo, por que importa diesel?</em> — e a resposta que a maioria dá é errada por ser simples demais: \"porque falta refinaria\". Falta capacidade é uma das quatro razões possíveis, e nem sempre é a dominante. As outras três são qualidade do cru, configuração da planta e perfil da demanda. Esta aula existe para que você separe as quatro antes de responder.",
  'aula-15-06': "Aqui está a diferença mais importante entre a cadeia do óleo e a cadeia do gás, e ela decide tudo o que vem depois. Óleo é fungível, transportável por navio e vendido contra uma referência internacional líquida — o preço do dia existe. Gás não é fungível na prática, depende de infraestrutura dedicada e é vendido por <b>contrato bilateral de longo prazo, com indexação própria, retirada mínima e transporte contratado à parte</b>. O preço do gás que uma indústria paga hoje foi negociado anos atrás, e frequentemente <em>não responde ao preço do gás de hoje</em>. Quem não entende isso não entende por que uma térmica despacha quando o gás está caro.",
  'aula-15-07': "O currículo descreve este tópico numa frase no presente: <em>reforma que abriu acesso ao gás; competição e acesso a terceiros</em>. A frase está escrita como se a reforma estivesse concluída. Ela não está — e o modo correto de dizer isso não é \"a reforma falhou\", é aplicar os quatro estados de política, dispositivo por dispositivo, com data. Em 4 de agosto de 2026, a Lei nº 14.134/2021 tem cinco anos, e a primeira resolução da agência sobre o seu artigo mais importante foi publicada há pouco mais de um mês.",
  'aula-15-08': "Esta é a aula que justifica o módulo do ponto de vista do produto, e é aqui que o vocabulário dos Módulos 08 e 09 volta a valer depois de o Módulo 14 tê-lo suspendido. O currículo resume a conexão numa frase: <em>gás natural afeta despacho térmico que afeta PLD</em>. A frase está certa e incompleta, e a etapa que ela omite muda tudo — <b>o custo do gás que entra no custo variável de uma termelétrica frequentemente não é o preço do gás de hoje</b>. É o preço de um contrato assinado anos atrás, com indexação própria, com retirada mínima e com transporte contratado separadamente da molécula. Uma térmica com contrato inflexível despacha por razão contratual, e não por ordem de mérito econômico do dia.",
  'aula-15-09': "As oito aulas anteriores construíram as três lentes. Esta as aplica em sequência, num único movimento de leitura, e depois enfrenta o tema que o próprio currículo registra como uma das dez controvérsias vivas do setor — apresentando-o com dois lados de mesma qualidade e sem declarar vencedor, com a mesma disciplina que o Módulo 12 aplicou a \"o Brasil é uma boa aposta?\" e o Módulo 13 a \"essa ação é uma boa compra?\".",
};

/** 151 blocos nas 9 aulas, na ordem do documento. */
export const MODULO_15_CORPO: Record<string, AulaBloco[]> = {
  'aula-15-01': [
    { kind: 'titulo', numero: "01.1", texto: "Concessão — Lei nº 9.478/1997" },
    { kind: 'paragrafo', html: "A Lei nº 9.478, de 6 de agosto de 1997, fez três coisas de uma vez: encerrou o monopólio de execução, criou a ANP como autarquia especial reguladora e instituiu o regime de concessão. Sob concessão, a empresa vence uma licitação, paga bônus de assinatura, assume um programa exploratório mínimo e corre <b>todo o risco</b>: se o poço for seco, o custo é dela e não há ressarcimento. Em contrapartida, <em>o petróleo e o gás que ela produzir são dela</em>, a partir do ponto de medição. O Estado recebe por fora, em dinheiro: bônus, royalties, participação especial quando o campo se qualifica, retenção de área e tributos." },
    { kind: 'paragrafo', html: "É o regime da esmagadora maioria das áreas produtoras — em junho de 2026, <b>254 das 272 áreas produtoras do país</b> estavam em concessão. Também é o regime dos ciclos da Oferta Permanente de Concessão, cujo sexto ciclo tem sessão pública marcada para 7 de outubro de 2026 com 495 blocos exploratórios e cinco áreas de acumulação marginal em oferta potencial." },
    { kind: 'titulo', numero: "01.2", texto: "Partilha da produção — Lei nº 12.351/2010" },
    { kind: 'paragrafo', html: "A Lei nº 12.351, de 22 de dezembro de 2010, criou um regime distinto para o polígono do pré-sal e para áreas declaradas estratégicas. A lógica é invertida: <em>a molécula produzida é da União</em>, e a empresa contratada tem direito a uma parcela da produção. Essa parcela tem duas partes. A primeira é o <b>custo em óleo</b> — volume suficiente para recuperar os custos reconhecidos pelo contrato, dentro de limites contratuais. A segunda é uma fatia do <b>excedente em óleo</b>, também chamado óleo-lucro: o que sobra depois do custo em óleo, dividido entre a União e o contratado segundo o percentual ofertado na licitação." },
    { kind: 'paragrafo', html: "Numa licitação de partilha o bônus de assinatura é <b>fixo</b>, definido no edital. O que as licitantes disputam é justamente o percentual de excedente em óleo que oferecem à União, a partir de um mínimo. Vence quem oferece mais. Isso muda a natureza da própria licitação: em concessão se disputa dinheiro adiantado e programa de trabalho; em partilha se disputa uma fração da produção futura." },
    { kind: 'paragrafo', html: "A União não recebe apenas dinheiro nesse regime — <b>recebe petróleo e gás em espécie</b>, e precisa vendê-los. Quem faz isso é a Pré-Sal Petróleo S.A., a PPSA, empresa pública federal vinculada ao MME, autorizada pela Lei nº 12.304/2010 e constituída em 2013, que integra o consórcio como representante dos interesses da União, participa do comitê operacional, gere os acordos de individualização da produção e comercializa a parcela da União. Em 2026 a PPSA atua em dezessete contratos de partilha." },
    { kind: 'nota', tom: "gold", label: "A consequência prática que quase ninguém tira", html: "Como a União é dona física de óleo e de gás na partilha, ela precisa de um mecanismo de venda — e esse mecanismo é novo e ainda está sendo montado. Para o petróleo, existem leilões da PPSA na bolsa desde 2018, com volume ofertado crescendo de cerca de 75 milhões de barris em 2025 para uma previsão superior a cem milhões em 2026. Para o <b>gás</b>, o CNPE aprovou apenas em <b>30 de julho de 2026</b> a resolução que reestrutura a política de comercialização, alterando a Resolução CNPE nº 15/2018 e criando dois modelos: leilões anuais de curto prazo entre 2026 e 2029, para vender a produção do ano seguinte, tendo como público-alvo o consumidor industrial no mercado livre; e leilões de longo prazo depois disso. O primeiro leilão de gás da União é esperado ainda em 2026, para o gás de 2027. <em>Isso significa que existe uma oferta de gás nova, sob titularidade diferente, entrando no mercado brasileiro — e ela não vem da produção de ninguém: vem do regime.</em>" },
    { kind: 'titulo', numero: "01.3", texto: "Cessão onerosa — Lei nº 12.276/2010" },
    { kind: 'paragrafo', html: "O terceiro regime é o menos citado e o mais mal explicado, e sem ele boa parte do volume produzido simplesmente não se classifica. A Lei nº 12.276, de 30 de junho de 2010, autorizou a União a ceder onerosamente à Petrobras, sem licitação, o direito de exercer atividades de pesquisa e lavra em áreas do pré-sal, até o limite de <b>cinco bilhões de barris de óleo equivalente</b>, mediante pagamento. É um contrato único, de perímetro fixo e volume teto — não é um regime aberto a novas licitações." },
    { kind: 'paragrafo', html: "Duas consequências importam. A primeira: quando os volumes de um campo excedem o teto cedido, o excedente não fica automaticamente com a cessionária — ele foi objeto de licitação própria, sob regime de partilha, o que produz a situação em que <em>o mesmo campo físico opera sob dois regimes simultâneos</em>, com contratos distintos sobre volumes distintos e uma governança de individualização por cima. A segunda: em junho de 2026, sete das 272 áreas produtoras do país estavam sob cessão onerosa. Sete áreas parecem pouco — até você lembrar que estão entre as mais produtivas do país." },
    { kind: 'titulo', numero: "01.4", texto: "Individualização da produção: quando a jazida ignora o contrato" },
    { kind: 'paragrafo', html: "Um reservatório não conhece a linha do bloco. Quando uma jazida se estende por mais de uma área contratada, ou atravessa para área ainda não contratada, é obrigatório um <b>acordo de individualização da produção</b>, o AIP: as partes passam a desenvolver a jazida como uma unidade única e repartem produção e custos conforme a participação de cada uma no volume recuperável. Se a área vizinha não estiver contratada, ela é da União, e a PPSA a representa no acordo. O AIP não é um quarto regime — é um instrumento que se sobrepõe aos três e que impede a drenagem predatória, em que um operador esvazia, pelo seu lado da linha, um volume que é do vizinho." },
    { kind: 'titulo', numero: "01.5", texto: "Ficha de elo 01 — campo em regime de concessão" },
    { kind: 'titulo', numero: null, texto: "Campo produtor regime de concessão · Ficha de elo · campos idênticos" },
    { kind: 'nota', tom: "neutro", label: null, html: "<b>O que o elo faz.</b> Eleva, separa e trata o fluido do reservatório, entregando óleo, gás e água em correntes distintas, e mede o resultado em ponto de medição fiscal. <b>Quem é titular do quê.</b> O <b>concessionário</b> é titular do petróleo e do gás produzidos, a partir do ponto de medição. A União é titular da jazida no subsolo, não da molécula extraída. <b>Grandeza e unidade.</b> Produção de petróleo em <b>barris por dia</b> ou <b>m³/d</b>; produção de gás em <b>m³/d</b>; soma em <b>boe/d</b> por fator de conversão declarado.<span class=\"mini\">boe soma energia aproximada, não valor: um boe de gás não vale o mesmo que um boe de óleo.</span> <b>Como o preço se forma.</b> <b>Mercado</b>, para o óleo — referência internacional ajustada por qualidade, frete e prazo. <b>Contrato bilateral</b>, para o gás. São duas lógicas dentro do mesmo elo. <b>Órgão e norma.</b> ANP; Lei nº 9.478/1997 e contrato de concessão. <span class=\"mini\">Em vigor. Licença ambiental é competência separada e não substitui aprovação regulatória.</span> <b>Devolve à camada seguinte.</b> Óleo para navio aliviador; gás para gasoduto de escoamento; água para tratamento e reinjeção ou descarte licenciado. <b>O que este número não diz.</b> <b>Preencha.</b> A produção do campo não diz a participação econômica de cada sócio no consórcio, não diz o preço realizado, não diz…<span class=\"mini\">Três lacunas, no mínimo. Volte a esta ficha depois da Aula 04.</span>" },
    { kind: 'titulo', numero: "01.6", texto: "Ficha de elo 02 — campo em regime de partilha" },
    { kind: 'titulo', numero: null, texto: "Campo produtor regime de partilha · Ficha de elo · campos idênticos" },
    { kind: 'nota', tom: "neutro", label: null, html: "<b>O que o elo faz.</b> Fisicamente idêntico ao anterior: eleva, separa, trata e mede. Nada na engenharia distingue um campo de partilha de um campo de concessão. <b>Quem é titular do quê.</b> A <b>União</b> é titular do petróleo e do gás produzidos. O contratado tem direito ao <b>custo em óleo</b> e a uma fatia do <b>excedente em óleo</b>, conforme o percentual ofertado na licitação. <b>Grandeza e unidade.</b> As mesmas do elo anterior — <b>e uma a mais</b>: a produção do excedente da União, apurada separadamente e comercializada pela PPSA.<span class=\"mini\">É por isso que a produção física de um campo de partilha aparece em duas contas diferentes sem que nenhuma esteja errada.</span> <b>Como o preço se forma.</b> Mercado para a parcela do contratado; <b>leilão</b> para a parcela da União — leilão de petróleo desde 2018, e leilão de gás a partir da resolução do CNPE de 30 de julho de 2026. <b>Órgão e norma.</b> ANP como reguladora e contratante; PPSA como gestora do contrato e representante da União; CNPE para diretrizes; Lei nº 12.351/2010. <span class=\"mini\">Em vigor. Política de comercialização de gás da União: resolução aprovada em 30/07/2026, leilão ainda não realizado.</span> <b>Devolve à camada seguinte.</b> Os mesmos fluxos físicos — mas com <b>dois titulares</b> na mesma tubulação, o que cria a necessidade de medição e de governança que a concessão não tem. <b>O que este número não diz.</b> <b>Preencha.</b> A produção do campo não diz o percentual de excedente ofertado, não diz o estágio de recuperação de custo, não diz…<span class=\"mini\">Este campo é mais denso que o da ficha anterior. Por quê?</span>" },
    { kind: 'nota', tom: "neutro", label: "Concessão contra partilha, em três níveis", html: "<b>Criança.</b> Na concessão, a empresa acha o petróleo, tira, e o petróleo é dela — ela paga uma parte do valor para o governo. Na partilha, o petróleo é do governo, e a empresa recebe uma parte dele como pagamento por ter tirado. <b>Executivo.</b> Na concessão, a empresa assume o risco exploratório integral e é titular da produção após a medição, remunerando o Estado por participações governamentais em dinheiro. Na partilha, a União mantém a titularidade da produção; a empresa recupera custos em óleo e divide o excedente conforme o percentual ofertado no leilão. A diferença altera o perfil de risco, o fluxo de caixa e a natureza da receita pública. <b>Especialista.</b> Concessão (Lei nº 9.478/1997) transfere a propriedade da produção ao concessionário no ponto de medição, com <em>government take</em> composto por bônus, royalties, participação especial progressiva sobre receita líquida trimestral, retenção de área e tributos. Partilha (Lei nº 12.351/2010) mantém a titularidade na União, com recuperação de custo em óleo sujeita a limites contratuais e repartição do excedente pelo percentual ofertado, sendo o bônus fixo e a variável de disputa o próprio percentual. A União recebe hidrocarboneto em espécie, gerido e comercializado pela PPSA, que integra o consórcio e o comitê operacional. Os dois regimes coexistem com a cessão onerosa (Lei nº 12.276/2010), de perímetro e teto volumétrico fixos, cujos excedentes foram posteriormente licitados sob partilha — de onde decorre a sobreposição contratual em campos únicos e a necessidade de acordos de individualização." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Regime é o primeiro campo de qualquer ficha de ativo. Para o <b>GridAlpha Research</b>, que produz análises setor-específicas, a distinção de regime é o que separa uma leitura de receita auditável de uma soma sem sentido: dois volumes idênticos podem gerar receitas privadas que diferem por dezenas de pontos percentuais conforme o contrato. E é aqui que a independência analítica pesa mais do que em qualquer outro bloco — quase todo material público sobre regime de E&amp;P no Brasil é produzido por quem tem posição: a operadora quer demonstrar que carrega risco, o Estado produtor quer demonstrar que recebe pouco, a entidade setorial quer demonstrar que o regime afasta investimento. Uma camada independente não é a que não tem opinião; é a que <em>nomeia o interesse de cada fonte antes de usar o número dela</em>." },
  ],
  'aula-15-02': [
    { kind: 'titulo', numero: "02.1", texto: "As três grandezas, em ordem de distância do caixa" },
    { kind: 'tabela', linhas: [["Grandeza", "O que ela afirma", "O que ela exige para existir", "Unidade típica"], ["<b>Recurso</b>", "Que há hidrocarboneto potencialmente presente, incluindo o não descoberto e o descoberto sem projeto viável (recurso contingente).", "Interpretação geológica. Não exige descoberta comprovada nem viabilidade econômica.", "bilhões de barris ou de m³"], ["<b>Reserva</b>", "Que há volume descoberto, comercialmente recuperável sob as condições avaliadas, com um plano tecnicamente e economicamente viável.", "Descoberta, declaração de comercialidade, plano de desenvolvimento, e um <b>critério de certeza declarado</b> numa data de referência.", "bilhões de barris ou de m³"], ["<b>Produção</b>", "Que um volume efetivamente saiu do reservatório e foi medido em ponto de medição fiscal.", "Instalação construída, poço conectado, unidade operando e medição fiscalizada.", "barris por dia, m³/d, boe/d"]] },
    { kind: 'paragrafo', html: "A distância entre uma grandeza e a seguinte não é uma taxa de conversão. É um conjunto de condições. Um recurso vira reserva por decisão de comercialidade — que depende de preço, custo, tecnologia, logística e licença, e que pode ser <em>revertida</em> se qualquer uma dessas variáveis mudar. Uma reserva vira produção por construção física, cronograma e comissionamento — e leva anos. Ninguém converte reserva em produção por regra de três, e todo material que faz isso está afirmando uma coisa que não sabe." },
    { kind: 'titulo', numero: "02.2", texto: "Grau de certeza: 1P, 2P, 3P — e por que os três estão corretos" },
    { kind: 'paragrafo', html: "Reserva <b>provada</b> é o volume que a análise de dados de geociências e engenharia indica com razoável certeza como comercialmente recuperável na data de referência. Reserva <b>provável</b> é o incremento cuja recuperação é menos certa que a provada mas mais certa que a possível. Reserva <b>possível</b> é o incremento menos certo dos três. As agregações são cumulativas: <b>1P</b> é apenas a provada; <b>2P</b> soma provada e provável; <b>3P</b> soma as três." },
    { kind: 'paragrafo', html: "Os números brasileiros mais recentes, com data de referência em 31 de dezembro de 2025 e publicação no Boletim Anual de Recursos e Reservas divulgado pela ANP em 10 de abril de 2026:" },
    { kind: 'paragrafo', html: "Entre as duas está o 2P, em 24,265 bilhões de barris, alta de 3,19%. Para gás natural, 1P em 572,752 bilhões de m³ (alta de 4,89%), 2P em 694,383 bilhões (3,20%) e 3P em 751,624 bilhões (1,50%). Repare que as taxas de crescimento <em>caem</em> conforme o critério se afrouxa: as adições do ano foram sobretudo de volume provado, o que é uma informação sobre maturidade de carteira que some se você olhar só um dos três números." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · e uma precisão que muda a leitura", html: "As reservas brasileiras são <b>declaradas pelas empresas operadoras</b> à ANP, anualmente, até 31 de janeiro, relativas ao ano anterior, elaboradas conforme a Resolução ANP nº 47/2014 e coerentes com o plano de desenvolvimento submetido. A ANP consolida, publica e fiscaliza. Isso não é a mesma coisa que uma certificação independente por terceiro, e a diferença importa quando alguém escreve \"reservas certificadas pela ANP\" — a formulação exata é <em>declaradas à ANP</em>. Em 2025, participaram da declaração 441 campos em 12 estados. Consulta em 4 de agosto de 2026." },
    { kind: 'titulo', numero: "02.3", texto: "Dois indicadores derivados, e o que cada um esconde" },
    { kind: 'titulo', numero: null, texto: "Vida estática das reservas · R/P" },
    { kind: 'formula', eq: "R/P = reservas provadas ÷ produção anual", desc: "Com 17,488 bilhões de barris provados e produção anual de 2025 próxima de 1,38 bilhão de barris, o Brasil tem cerca de 12,7 anos de R/P. Não é prazo de esgotamento. O indicador congela o denominador no ritmo atual e ignora novas descobertas, revisões, declínio de campos maduros e mudança de preço. Um país com R/P de 12 anos e reposição consistente pode produzir por décadas; um com R/P de 25 anos e reposição nula está encolhendo." },
    { kind: 'titulo', numero: null, texto: "Índice de reposição de reservas · IRR" },
    { kind: 'formula', eq: "IRR = adições líquidas de reserva ÷ produção do período", desc: "O IRR de petróleo do Brasil em 2025 foi de 147,03%, o equivalente a cerca de 2,023 bilhões de barris incorporados como reserva provada. Acima de 100% significa que se incorporou mais do que se produziu. Um ano isolado é volátil, e a leitura correta decompõe a adição: quanto veio de nova descoberta, quanto de extensão de campo conhecido, quanto de revisão técnica, quanto de mudança de premissa de preço, quanto de aquisição de participação e quanto de mera reclassificação entre critérios de certeza. Reposição por revisão de preço não é a mesma coisa que reposição por descoberta, e as duas aparecem no mesmo indicador." },
    { kind: 'nota', tom: "neutro", label: "Reserva contra recurso, em três níveis", html: "<b>Criança.</b> Recurso é o petróleo que talvez exista lá embaixo. Reserva é o que já se sabe que existe e que dá para tirar ganhando dinheiro. Produção é o que já saiu. <b>Executivo.</b> Recurso é estimativa geológica e não exige descoberta comprovada nem viabilidade econômica. Reserva exige descoberta, declaração de comercialidade e plano viável nas condições avaliadas, sempre com grau de certeza declarado e data de referência. Produção é volume medido em ponto de medição fiscal. A distância entre as três não é taxa de conversão: é um conjunto de condições, e cada uma pode ser revertida. <b>Especialista.</b> Recurso contingente é volume descoberto que ainda não atende às condições de comercialidade. Reserva se subdivide por grau de certeza — provada, provável e possível —, com agregações cumulativas 1P, 2P e 3P, cuja amplitude típica é de 60% a 70% entre a mais restrita e a mais ampla na mesma carteira. Grau de certeza é atributo do <em>regime de certificação</em>, não do subsolo: a mesma jazida muda de número quando muda a premissa de preço, sem que nada tenha mudado fisicamente. No Brasil as reservas são declaradas anualmente pelas operadoras à agência, com data de referência em 31 de dezembro, e consolidadas e publicadas por ela — o que não equivale a certificação independente por terceiro." },
    { kind: 'nota', tom: "gold", label: "O teste de trinta segundos", html: "Alguém diz: <em>\"o Brasil tem quase 29 bilhões de barris de reserva.\"</em> A afirmação é verdadeira e insuficiente, e as três perguntas que a completam são sempre as mesmas — <b>sob qual critério de certeza</b>, <b>em qual data de referência</b>, e <b>declarada por quem</b>. Sem as três, o número não é comparável com nenhum outro número de reserva, inclusive com o do próprio país no ano anterior." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "O <b>Energy Brief</b> existe para entregar síntese analítica de padrão de mercado, e a disciplina de grandeza é o que separa síntese de repetição. Uma nota que escreve \"as reservas cresceram 3,84%\" sem dizer que a taxa é de 1P — e que a de 3P foi de 1,48% no mesmo ano — não está errada, está incompleta de um jeito que muda a conclusão sobre maturidade da carteira. É exatamente o tipo de precisão que não custa espaço e que um leitor do setor reconhece na primeira frase." },
  ],
  'aula-15-03': [
    { kind: 'titulo', numero: "03.1", texto: "Sete fluxos, não um" },
    { kind: 'tabela', linhas: [["Fluxo", "Base de cálculo", "Periodicidade", "Quem recebe", "Norma"], ["Bônus de assinatura", "Valor ofertado na licitação (fixo, na partilha)<span class=\"sub\">não depende de produção</span>", "Uma vez, na contratação", "União", "Lei nº 9.478/1997; Lei nº 12.351/2010"], ["Royalties", "<b>Valor da produção</b> do campo — volume × preço de referência<span class=\"sub\">alíquota geral de 10%, com hipóteses de redução previstas em norma</span>", "Mensal, recolhido até o último dia do mês seguinte", "União, estados, municípios, DF<span class=\"sub\">centenas de municípios beneficiários</span>", "Lei nº 7.990/1989 e Decreto nº 1/1991 (parcela de 5%); Lei nº 9.478/1997 e Decreto nº 2.705/1998 (parcela acima de 5%)"], ["Participação especial", "<b>Receita líquida trimestral</b> do campo, após deduções de royalties, investimentos em exploração, custos operacionais, depreciação e tributos<span class=\"sub\">alíquotas progressivas</span>", "Trimestral", "União, estados, municípios<span class=\"sub\">poucas dezenas de municípios beneficiários</span>", "Lei nº 9.478/1997, art. 50; Lei nº 12.858/2013 para parte da destinação"], ["Excedente em óleo da União", "Produção física remanescente após o custo em óleo, na proporção contratada<span class=\"sub\">recebido em molécula, não em dinheiro</span>", "Contínuo; monetizado por leilão", "União · Fundo Social conforme regras", "Lei nº 12.351/2010"], ["Retenção de área", "Área contratada, por km²", "Anual", "União", "Contrato de E&amp;P"], ["PD&amp;I", "Receita bruta de campos elegíveis", "Contratual", "Projetos e instituições credenciadas", "Cláusula contratual e regulação da ANP"], ["Tributos", "Lucro, receita e circulação de mercadorias", "Diversa", "Entes tributantes", "Legislação tributária federal e estadual"]] },
    { kind: 'paragrafo', html: "Os dois primeiros da lista de participações — royalty e participação especial — são <b>compensações financeiras</b>, não tributos: nascem da exploração de um recurso não renovável e são devidas independentemente de haver lucro. A participação especial, ao contrário, só existe onde há <em>rentabilidade</em>: ela incide sobre receita líquida após deduções, e por isso pode ser zero num campo que paga royalty todo mês. Essa assimetria explica um fato que costuma surpreender." },
    { kind: 'titulo', numero: "03.2", texto: "O mesmo Estado, dois conjuntos de beneficiários" },
    { kind: 'paragrafo', html: "Quinhentos e quarenta e seis contra vinte e um. A diferença não é de escala de dinheiro — é de <em>desenho</em>. Royalty acompanha a produção e a geografia de confrontação e de instalações, o que espalha o benefício por centenas de entes. Participação especial acompanha rentabilidade excepcional, o que a concentra em poucos campos grandes e, por consequência, em pouquíssimos municípios. Um prefeito que fala em \"royalties do petróleo\" pode estar falando de um fluxo mensal modesto e estável, ou de um fluxo trimestral enorme e volátil, e as duas conversas exigem análises fiscais diferentes." },
    { kind: 'titulo', numero: "03.3", texto: "A repartição federativa, e por que ela não tem lado certo" },
    { kind: 'paragrafo', html: "A distribuição da participação especial segue quatro desenhos distintos previstos na legislação, conforme a origem do recurso. Para campos <b>terrestres</b>, 50% vão à União, 40% aos estados produtores e 10% aos municípios produtores, nos termos do art. 50 da Lei nº 9.478/1997. Para campos <b>marítimos</b> com declaração de comercialidade posterior a 3 de dezembro de 2012, os mesmos percentuais se aplicam com beneficiários confrontantes, nos termos da Lei nº 12.858/2013, que também vinculou parcela da receita a educação e saúde. Campos marítimos com comercialidade anterior a essa data e produção no polígono do pré-sal seguem desenho próprio." },
    { kind: 'paragrafo', html: "A existência de quatro desenhos simultâneos não é acidente administrativo: é o sedimento de uma disputa. A Lei nº 12.734/2012 alterou as regras de repartição em favor de estados e municípios não produtores; dispositivos foram vetados na sanção, o veto foi derrubado, e a matéria foi objeto de litígio prolongado. O resultado é que a regra vigente hoje depende da data de declaração de comercialidade do campo, da sua localização e do regime contratual — o que torna qualquer afirmação genérica sobre \"como os royalties são divididos no Brasil\" simultaneamente verdadeira e inútil." },
    { kind: 'nota', tom: "neutro", label: "Neutralidade — este é um dos pontos em que ela é obrigatória", html: "A disputa federativa por rendas petrolíferas tem <b>dois argumentos de mesma qualidade</b>, e este módulo não escolhe entre eles. De um lado: o ente confrontante suporta o ônus físico, ambiental, logístico e demográfico da atividade, e sem contrapartida diferenciada a produção impõe custo local e benefício difuso. De outro: o recurso é da União por definição constitucional, o subsolo não pertence ao ente sobre cuja projeção ele se encontra, e a concentração da renda em poucos entes produz desigualdade fiscal sem correspondência com esforço arrecadatório. Nomear o interesse de quem sustenta cada lado é parte da análise. Declarar vencedor não é." },
    { kind: 'titulo', numero: "03.4", texto: "Três variáveis que não se movem juntas" },
    { kind: 'paragrafo', html: "A receita de royalty de um mês é, na sua forma mais simples, <b>volume produzido × preço de referência × alíquota</b>, com o preço de referência expresso conforme metodologia da ANP e com efeito cambial quando a referência é internacional. As três variáveis são independentes: a produção pode subir enquanto o preço cai; o câmbio pode compensar ou amplificar a queda de preço; e a alíquota efetiva pode variar por hipóteses normativas de redução. Um município que planejou despesa permanente sobre a média de um período em que as três variáveis andaram no mesmo sentido está exposto ao caso em que elas andam em sentidos opostos." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Um ente produtor é um cliente de análise como qualquer outro, e a pergunta que ele faz — <em>quanto vamos receber no ano que vem?</em> — não se responde por extrapolação. O <b>GridAlpha Research</b> trata esse caso como trata qualquer estrutura de receita exposta a múltiplas variáveis: separa os fluxos por base de cálculo, testa volume, preço e câmbio independentemente, e devolve o intervalo, não o ponto. Nenhuma projeção fiscal deste tipo é recomendação de política orçamentária, e nenhum número de receita futura sai sem as três sensibilidades declaradas." },
  ],
  'aula-15-04': [
    { kind: 'titulo', numero: "04.1", texto: "As seis camadas, nomeadas" },
    { kind: 'lista', itens: ["<b>1 · Referência internacional camada 1.</b> A cotação de um tipo específico de óleo, num ponto específico de entrega, para um mês específico. <b>Não é o preço do petróleo brasileiro</b> — é a régua contra a qual ele é negociado. <span class=\"pc mk\">mercado</span>", "<b>2 · Preço realizado camada 2.</b> Referência <b>mais ou menos</b> o diferencial de qualidade do óleo específico, menos frete até o cliente, ajustado pelo período de apreçamento que o contrato define. Cada negociação e cada cliente podem ter índice e janela próprios. <span class=\"pc mk\">mercado + contrato</span>", "<b>3 · Preço de referência fiscal camada 3.</b> O preço que a ANP usa para apurar royalty e participação especial, por metodologia própria. Não é o preço de venda e não precisa coincidir com ele. <span class=\"pc tf\">norma</span>", "<b>4 · Preço na refinaria camada 4.</b> O preço de venda do produtor ou importador de derivado à distribuidora, por polo de suprimento. É a única camada em que a decisão de uma companhia entra diretamente. <span class=\"pc ct\">estratégia comercial</span>", "<b>5 · Preço na distribuidora camada 5.</b> Camada 4 <b>mais</b> biocombustível de mistura obrigatória, tributos federais e estaduais, custo de base, frete e estoque — e <b>menos</b> subvenção econômica, quando houver. <span class=\"pc tf\">tributo + contrato</span>", "<b>6 · Preço na bomba camada 6.</b> Camada 5 mais margem de revenda, que responde à concorrência local. Dois postos no mesmo município podem diferir por motivo que nenhuma camada anterior explica. <span class=\"pc mk\">mercado local</span>"] },
    { kind: 'nota', tom: "gold", label: "A consequência operacional", html: "Um reajuste de camada 4 pode ser <b>integralmente neutralizado</b> por movimento em sentido contrário nas camadas 5 ou 6 — mudança de alíquota estadual, alteração do teor de mistura obrigatória, concessão de subvenção, compressão de margem de revenda. Foi exatamente o que ocorreu em 28 de maio de 2026, quando a Petrobras anunciou ajuste de <b>R$ 0,48 por litro</b> no preço de venda de gasolina A às distribuidoras e, no mesmo comunicado, um desconto de <b>R$ 0,44 por litro</b> no âmbito da subvenção econômica federal. O movimento líquido para a distribuidora foi de quatro centavos. Quem leu só a camada 4 registrou um aumento de quarenta e oito." },
    { kind: 'titulo', numero: "04.2", texto: "A camada nova de 2026: subvenção econômica" },
    { kind: 'paragrafo', html: "Desde março de 2026 existe, na cadeia brasileira de combustível, um instrumento que não estava lá antes e que altera a leitura de qualquer preço: a <b>subvenção econômica à comercialização de derivados</b>, paga a produtores e importadores. Ela funciona como uma camada de sinal negativo, inserida entre a refinaria e a distribuidora, cujo teto é o ônus dos tributos federais incidentes sobre a produção e a importação do combustível subvencionado. É temporária por construção, editada por medida provisória, operacionalizada por decreto e portaria, e <b>revogável a qualquer momento por decisão do Executivo</b>." },
    { kind: 'paragrafo', html: "Os quatro estados de política que o Módulo 14 fixou se aplicam aqui com força incomum, porque a matéria muda em semanas. O estado verificado em <b>4 de agosto de 2026</b>:" },
    { kind: 'tabela', linhas: [["Ato", "Objeto", "Estado em 04/08/2026"], ["MP nº 1.340, de 12/03/2026", "Programa de subvenção à comercialização de óleo diesel, com pagamento de R$ 0,32 por litro às empresas beneficiárias.", "Adesão aprovada pelo conselho de administração da companhia estatal, <b>condicionada</b> à publicação dos instrumentos regulatórios da ANP relativos a preço de referência.<span class=\"sub\">Autorização com implementação condicionada.</span>"], ["MP nº 1.358, de 13/05/2026", "Autoriza subvenção econômica a produtores e importadores de combustíveis derivados de petróleo. Editada em resposta à elevação internacional de preços.", "<b>Vigente</b>, com prazo prorrogado por 60 dias em ato publicado em 06/07/2026. Aguardava apreciação do Congresso.<span class=\"sub\">Em vigor, com validade limitada e conversão pendente.</span>"], ["Portaria MF nº 1.584/2026", "Fixou em R$ 351,50 por metro cúbico o valor unitário da subvenção do óleo diesel A rodoviário, com vigência de dois meses a contar de 1º/06/2026.", "<b>Encerrada.</b> O Ministério da Fazenda anunciou o fim da subvenção do diesel a partir de 1º de julho de 2026, após recuo das cotações internacionais.<span class=\"sub\">Prazo cumprido e benefício retirado — não é o mesmo que prazo vencido e não implementado.</span>"], ["MP nº 1.380/2026, de 23/07/2026", "Abre crédito extraordinário de R$ 3,33 bilhões ao MME: R$ 2,1 bilhões para a subvenção do diesel rodoviário da MP nº 1.363/2026 e R$ 1,23 bilhão para a subvenção da MP nº 1.358/2026.", "<b>Em vigor</b> desde a publicação; depende de apreciação do Congresso para conversão em lei.<span class=\"sub\">O crédito confirma que o instrumento segue sendo usado, ainda que uma de suas subvenções tenha sido encerrada.</span>"]] },
    { kind: 'nota', tom: "neutro", label: "Números vivos · a categoria mais perecível do módulo inteiro", html: "Nenhum item da tabela acima sobrevive necessariamente a noventa dias. Medida provisória tem vigência de sessenta dias, prorrogável uma vez por igual período; portaria de valor unitário tem prazo próprio; e o encerramento de uma subvenção é decisão de política econômica comunicada por anúncio, não por revogação formal de lei. <b>Verifique cada um antes de qualquer uso externo.</b> Verificado em 4 de agosto de 2026." },
    { kind: 'titulo', numero: "04.3", texto: "A estratégia comercial da companhia estatal, como mecanismo" },
    { kind: 'paragrafo', html: "Em 15 de maio de 2023, a diretoria executiva da Petrobras aprovou uma <b>estratégia comercial</b> para a definição de preços de diesel e gasolina, em substituição à política anterior, que vinculava o preço interno à paridade de importação. A estratégia usa duas referências declaradas: o <b>custo alternativo do cliente</b>, priorizado na precificação, que contempla as principais alternativas de suprimento disponíveis àquele comprador; e o <b>valor marginal para a companhia</b>, baseado no custo de oportunidade entre produzir, importar e exportar aquele produto. Os reajustes seguem sem periodicidade definida, e a companhia declara como premissa a não transferência da volatilidade internacional de curto prazo." },
    { kind: 'paragrafo', html: "Três consequências analíticas decorrem do mecanismo, e nenhuma delas é um juízo sobre ele. Primeira: <b>não existe fórmula pública replicável</b>. Sem periodicidade e sem índice declarado, ninguém fora da companhia consegue reproduzir o próximo reajuste — o que é uma característica do desenho, não uma falha de divulgação. Segunda: referências internacionais continuam economicamente relevantes, porque o custo alternativo do cliente é, para vários clientes, o custo de importar. Terceira: a diferença entre o preço praticado e uma paridade calculada por terceiro passa a ser <b>objeto de estimativa</b>, e quem estima tem posição — associações de importadores estimam defasagem porque a defasagem define a viabilidade do negócio de importar." },
    { kind: 'nota', tom: "neutro", label: "Argumento de quem defende amortecer a volatilidade", html: "<b>Repasse imediato transmite choque externo à economia inteira</b>Combustível entra em frete, alimento, insumo industrial e transporte público; a volatilidade internacional é conjuntural e o dano ao consumidor é permanente. <b>A companhia é integrada e tem custo de produção próprio</b>Quem produz o cru não precisa precificar o derivado como quem o importa, porque a alternativa dela inclui produzir. <b>Previsibilidade é valor econômico</b>Contenção de picos súbitos reduz custo de planejamento de toda a cadeia a jusante." },
    { kind: 'nota', tom: "neutro", label: "Argumento de quem defende acompanhar o mercado", html: "<b>Defasagem persistente expulsa concorrente</b>Se o preço interno fica abaixo do custo de importar, o importador para de importar — e a segurança de abastecimento passa a depender de um único agente. <b>Preço abaixo da alternativa é subsídio implícito</b>E subsídio implícito não aparece no orçamento, não é votado e não é focalizado: beneficia quem consome mais, não quem precisa mais. <b>Companhia listada tem minoritários</b>Diferença entre preço praticado e custo de oportunidade é resultado que deixa de ser gerado, com efeito sobre caixa, investimento e distribuição." },
    { kind: 'nota', tom: "neutro", label: "O que este módulo não faz", html: "Não emite juízo sobre qual das duas colunas está certa. Política de preços de combustível é tema político contestado, e a disciplina aqui é a mesma que o Módulo 12 aplicou a \"o Brasil é uma boa aposta?\" e o Módulo 13 a \"essa ação é uma boa compra?\": descrever o mecanismo, dizer quem paga, quem recebe e qual o trade-off, apresentar os dois lados com a mesma qualidade de argumento, e não declarar vencedor. Se você se pegar achando um dos lados melhor escrito que o outro, releia o outro." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "O <b>Regulatory Radar</b> faz rastreamento e análise de desenvolvimentos regulatórios — e a tabela de estado de política desta aula é literalmente o formato de saída dele: ato, objeto, estado verificado, data. Uma ressalva declarada: a descrição de escopo do produto no plano de negócios enumera os reguladores do setor elétrico e não inclui a ANP. Cobrir atos da ANP e das autoridades fazendárias em matéria de combustível é <b>extensão declarada de escopo</b>, e este módulo a declara em vez de presumi-la. O valor entregue é capacidade analítica — saber em qual dos quatro estados cada dispositivo se encontra hoje —, nunca antecipação de decisão de política pública." },
  ],
  'aula-15-05': [
    { kind: 'titulo', numero: "05.1", texto: "O que uma refinaria faz, e o que ela não pode fazer" },
    { kind: 'paragrafo', html: "Refino separa e converte uma mistura de hidrocarbonetos em produtos com especificação própria: GLP, nafta, gasolina, querosene de aviação, diesel, óleo combustível, asfalto e correntes intermediárias. O que sai não é escolha livre — é resultado de três restrições simultâneas. A primeira é a <b>qualidade do cru processado</b>: densidade, teor de enxofre e distribuição de frações determinam quanto de cada produto aquele barril pode render. A segunda é a <b>configuração da planta</b>: uma refinaria com unidades de conversão profunda extrai mais produto leve de um mesmo barril do que uma sem elas, e conversão profunda é investimento de anos. A terceira é a <b>disponibilidade operacional</b>: parada programada, manutenção, restrição de hidrogênio ou de energia derrubam rendimento sem que nada tenha mudado no projeto." },
    { kind: 'nota', tom: "gold", label: "A regra que resolve o paradoxo", html: "Autossuficiência em <b>petróleo</b> é uma métrica de volume de cru. Autossuficiência em <b>derivados</b> exige compatibilidade entre quatro coisas: demanda por produto, capacidade instalada, rendimento da configuração e logística de entrega. Um país pode ser exportador líquido de cru e importador líquido de diesel sem nenhuma contradição — e, dependendo dos preços relativos, essa combinação pode ser a <em>economicamente correta</em>, porque o cru exportado vale mais no mercado que o remunera e o diesel importado custa menos que a conversão marginal doméstica." },
    { kind: 'titulo', numero: "05.2", texto: "O caso brasileiro, com os números" },
    { kind: 'paragrafo', html: "Em 2025 o parque nacional produziu cerca de <b>2,2 milhões de barris por dia de derivados</b>, operando a aproximadamente <b>86,4% da capacidade instalada</b>, conforme o anuário estatístico da ANP. Isso significa duas coisas ao mesmo tempo. Primeira: <em>havia folga</em> — cerca de treze pontos percentuais de capacidade não utilizada. Segunda: folga de capacidade não é folga de produto, porque a capacidade ociosa só produz mais diesel se o cru disponível e a configuração das unidades permitirem. Rodar a 100% não converte automaticamente em diesel a proporção que a demanda pede." },
    { kind: 'paragrafo', html: "A resposta de longo prazo declarada pela companhia estatal no Plano de Negócios 2026–2030 ataca exatamente essas duas frentes, e vale ler o desenho porque ele é didático: ampliar a capacidade instalada de processamento de cerca de <b>1,8 milhão para 2,1 milhões de barris por dia até 2030</b>, um acréscimo de aproximadamente 320 mil bpd incluindo projetos em avaliação, e fazê-lo <b>dentro das plantas existentes, sem construir refinaria nova</b>; e elevar a participação do diesel na produção de cerca de 40% para 45% até o fim do quinquênio. O incremento de capacidade de diesel de baixo teor de enxofre projetado é de cerca de 307 mil bpd, dos quais aproximadamente 134 mil bpd são volume adicional e 173 mil bpd vêm da substituição de diesel de especificação anterior. Os investimentos do segmento de refino, transporte, comercialização, petroquímica e fertilizantes somam US$ 15,8 bilhões no plano." },
    { kind: 'nota', tom: "neutro", label: "Como ler um número de plano de investimento sem errar", html: "O plano separa <b>carteira em implantação</b> de <b>carteira em avaliação</b> — no total de US$ 109 bilhões, US$ 91 bilhões estão em implantação e US$ 18 bilhões em avaliação. Projeto em avaliação depende de estudo e de decisão futura de sanção; projeto em implantação tem definição maior mas ainda depende de execução física e de cronograma. <b>Anúncio não é desembolso.</b> A leitura correta acompanha sanção, contratação, execução e primeiro resultado, em vez de contabilizar todo valor anunciado como capital comprometido. Dados do Plano de Negócios 2026–2030, aprovado em 27 de novembro de 2025. Consulta em 4 de agosto de 2026." },
    { kind: 'titulo', numero: "05.3", texto: "Margem de refino: o que ela mede e o que ela não mede" },
    { kind: 'titulo', numero: null, texto: "Margem de refino · forma simplificada" },
    { kind: 'formula', eq: "margem ≈ valor da cesta de produtos − custo do cru − energia − variáveis", desc: "A margem é um spread, não um preço: ela pode subir com o cru caindo e cair com o cru subindo, porque o que importa é a distância entre as duas pontas. Uma refinaria com conversão profunda captura margem maior processando cru pesado barato; uma sem conversão precisa de cru leve, que custa mais. Por isso margem alta não significa refinaria eficiente e margem baixa não significa refinaria ruim — significa, primeiro, qual cesta de produtos aquela configuração consegue montar naquele mês." },
    { kind: 'titulo', numero: "05.4", texto: "Ficha de elo 03 — refinaria" },
    { kind: 'titulo', numero: null, texto: "Refinaria elo 7 da cadeia · Ficha de elo · campos idênticos" },
    { kind: 'nota', tom: "neutro", label: null, html: "<b>O que o elo faz.</b> Separa e converte uma mistura de hidrocarbonetos em produtos especificados, numa proporção limitada pela qualidade do cru e pela configuração das unidades. <b>Quem é titular do quê.</b> O refinador é titular do cru que comprou e dos derivados que produz. <b>O regime de E&amp;P não alcança este elo</b> — refino é atividade autorizada, não concedida nem partilhada. <b>Grandeza e unidade.</b> Capacidade e carga em <b>bpd</b>; rendimento em <b>% da carga</b>; margem em <b>US$/bbl</b>; fator de utilização em <b>%</b>.<span class=\"mini\">Capacidade instalada e carga processada são grandezas distintas — a terceira repetição do erro do Módulo 08.</span> <b>Como o preço se forma.</b> Na saída: <b>estratégia comercial do produtor</b>, por polo de suprimento, sem periodicidade definida. Na entrada: preço de mercado do cru, com diferencial de qualidade. <b>Órgão e norma.</b> ANP, para autorização de operação e especificação de produto; autoridades ambientais para licenciamento; autoridades de defesa da concorrência para conduta e concentração. <span class=\"mini\">Em vigor.</span> <b>Devolve à camada seguinte.</b> Derivados especificados à distribuidora, e correntes intermediárias à petroquímica. Devolve também o <b>déficit</b>: o produto que não conseguiu render vira importação. <b>O que este número não diz.</b> <b>Preencha.</b> A capacidade instalada não diz o rendimento por produto, não diz a disponibilidade real, não diz…<span class=\"mini\">Compare com a lacuna que você escreveu na ficha do campo produtor. São da mesma família?</span>" },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "A pergunta de refino aparece na mesa do consumidor industrial numa forma que ele nem sempre reconhece: <em>por que meu custo de diesel de frota não acompanhou a queda do petróleo?</em> O <b>GridAlpha Research</b> responde a isso com a cadeia inteira — camada de formação do preço, composição tributária, teor de mistura obrigatória, subvenção vigente ou encerrada — e devolve, ao final, oportunidades potenciais de economia a serem validadas com dados completos. Nunca um valor de economia, e nunca uma recomendação de troca de combustível: a rota é objeto do Módulo 14 e a decisão é do cliente." },
  ],
  'aula-15-06': [
    { kind: 'titulo', numero: "06.1", texto: "Produção bruta não é oferta ao mercado" },
    { kind: 'titulo', numero: null, texto: "Balanço físico do gás" },
    { kind: 'formula', eq: "disponível ≈ produção bruta − reinjeção − consumo nas unidades − queima e perdas", desc: "É a primeira conta do tema, e a mais ignorada. Em junho de 2026, o Brasil produziu 217,35 milhões de m³/d de gás natural e disponibilizou ao mercado 64,36 milhões de m³/d — menos de 30% do bruto. A queima foi de 6,63 milhões de m³/d, com alta de 12,9% sobre maio, atribuída principalmente ao comissionamento de uma nova unidade de produção. O aproveitamento do gás foi de 97%, porque reinjeção e consumo operacional são classificados como uso, não como perda. Dados do Boletim Mensal da Produção da ANP referente a junho de 2026, divulgado em 3 de agosto de 2026." },
    { kind: 'paragrafo', html: "A reinjeção não é desperdício. Ela mantém pressão do reservatório, melhora a recuperação de óleo, e no pré-sal cumpre uma função adicional: o gás associado tem alto teor de dióxido de carbono, e a separação e reinjeção desse componente é uma das maiores operações de captura e armazenamento geológico em curso no mundo. <b>Mas</b> reinjeção acima do tecnicamente necessário pode sinalizar gargalo de escoamento ou de processamento — ou seja, a molécula existe, tem valor de mercado, e não chega ao mercado por falta de infraestrutura. Distinguir os dois casos exige olhar o motivo, e o motivo não está no número." },
    { kind: 'tabela', linhas: [["Destino do gás produzido", "Cria oferta comercial?", "Pode ser necessário?", "A pergunta de auditoria"], ["Disponibilizado ao mercado", "Sim", "—", "Há capacidade firme contratada e contrato de venda?"], ["Reinjeção", "Não, no presente", "Frequentemente sim", "É decisão de reservatório, de gestão de CO₂ ou é gargalo de escoamento?"], ["Consumo na própria unidade", "Não", "Sim", "Qual a eficiência energética da unidade?"], ["Queima em <i>flare</i>", "Não", "Por segurança, sim; por rotina, não", "É evento, emergência, comissionamento ou queima rotineira?"], ["Perdas e emissões fugitivas", "Não", "Deve ser minimizado", "Há medição direta de metano ou apenas fator genérico?"]] },
    { kind: 'titulo', numero: "06.2", texto: "Molécula e transporte são dois contratos" },
    { kind: 'paragrafo', html: "Esta é a separação estrutural do setor de gás, e ela existe por desenho regulatório: o transportador <b>não pode ser dono da molécula que transporta</b>. Quem compra gás assina, no mínimo, dois contratos independentes. O primeiro é o de <b>compra e venda da molécula</b>, com o produtor ou com um comercializador, que define preço, índice de reajuste, piso, teto, volume contratado e flexibilidade diária e mensal. O segundo é o de <b>capacidade de transporte</b>, com o transportador, contratado por pontos de entrada e de saída, em modalidade firme ou interruptível, com prazo próprio." },
    { kind: 'paragrafo', html: "Isso produz duas consequências que quebram a intuição de quem vem do setor elétrico. Primeira: <b>é possível ter molécula e não ter como entregá-la</b>, e é possível ter capacidade contratada e não ter molécula. As duas pontas se contratam separadamente e podem descasar. Segunda: o custo efetivo do gás entregue num ponto é a soma de parcelas que se reajustam por regras diferentes, em datas diferentes — a molécula por índice contratual, o transporte por revisão tarifária, a distribuição por regra estadual. <b>Não existe um preço do gás no Brasil.</b> Existe um preço por camada, por ponto de entrega, por prazo e por flexibilidade contratada." },
    { kind: 'nota', tom: "gold", label: "As seis camadas de preço da mesma molécula", html: "<b>1.</b> Molécula na saída da unidade de processamento. <b>2.</b> Molécula entregue no <i>city gate</i>, o ponto de recebimento da malha de distribuição. <b>3.</b> Gás com capacidade de transporte contratada até um ponto de saída específico. <b>4.</b> Gás importado por gasoduto, com regra de fronteira própria. <b>5.</b> Gás importado liquefeito, cujo preço na origem <em>não inclui</em> frete marítimo, internalização, regaseificação nem transporte até o <i>city gate</i>. <b>6.</b> Preço final ao consumidor industrial pela distribuidora estadual, com tarifa e tributos. Material de divulgação cita a camada menor quando quer demonstrar competitividade e a camada maior quando quer demonstrar custo, e as duas citações podem estar corretas no mesmo dia." },
    { kind: 'titulo', numero: "06.3", texto: "Retirada mínima, indexação e o preço que não é do dia" },
    { kind: 'paragrafo', html: "<b>Retirada mínima</b>, ou <i>take-or-pay</i>, é a cláusula pela qual o comprador paga por um volume mínimo contratado ainda que retire menos. Em regra vem acompanhada de mecanismo de recuperação — o volume pago e não retirado pode ser retirado depois, dentro de condições. O equivalente no transporte é o <i>ship-or-pay</i>: paga-se a capacidade reservada, usada ou não. Contratos com retirada mínima alta costumam ter preço unitário menor, porque o vendedor troca desconto por previsibilidade de receita. É uma escolha, não uma imposição — e é a escolha que determina quanto de risco de volume cada lado carrega." },
    { kind: 'paragrafo', html: "A <b>indexação</b> é a segunda razão pela qual o preço de gás não é o preço do dia. Contratos brasileiros de fornecimento a distribuidoras historicamente combinam indexação a uma referência internacional de petróleo e a uma referência internacional de gás, com fatores de aplicação declarados no contrato e com defasagem — o índice de um mês reflete cotações de meses anteriores. O efeito é que um choque internacional aparece no custo do comprador brasileiro <em>com atraso</em> e <em>amortecido pelo fator</em>. E quando o choque passa, o alívio chega também com atraso." },
    { kind: 'nota', tom: "neutro", label: "Fonte com posição — como usar sem contaminar", html: "Uma nota técnica de entidade de competitividade empresarial estimou que o valor médio do gás natural para a indústria brasileira ficou em <b>US$ 11,32 por MMBtu em 2025</b> e que, em cenário de maior eficiência de escoamento e processamento, poderia aproximar-se de US$ 7. O número é citável <b>como posição de parte interessada, com nome da entidade e data</b> — nunca como origem de número neutro, porque quem o produz tem interesse direto na redução do preço do insumo. A mesma disciplina vale para toda a lista de interessados deste tema, e ela é a mais longa do currículo: a operadora, o transportador, a distribuidora estadual, o consumidor industrial, o gerador térmico, o Estado produtor e a posição climática — cada um com interesse oposto em pelo menos uma variável. Enumerar quem ganha o quê com cada afirmação é parte do conteúdo, não higiene." },
    { kind: 'nota', tom: "neutro", label: "Preço de mercado contra preço de contrato, em três níveis", html: "<b>Criança.</b> O gás não se compra como se compra pão, olhando o preço do dia. Compra-se por um combinado de vários anos, que diz quanto você paga, quanto tem que levar no mínimo, e quanto o preço muda a cada tanto tempo. <b>Executivo.</b> Preço de mercado se forma numa transação com entrega imediata e reflete oferta e demanda daquele momento. Preço de contrato se forma numa negociação bilateral anterior e reflete uma fórmula: índice, fator de aplicação, defasagem, piso, teto, volume mínimo e flexibilidade. Em gás natural brasileiro, a segunda situação é a regra e a primeira é exceção — o que significa que o custo do comprador responde à fórmula, não à cotação. <b>Especialista.</b> A distinção tem efeito direto sobre despacho térmico. Um gerador cujo contrato de suprimento tem retirada mínima elevada e indexação defasada apresenta custo variável declarado que pode divergir do custo de oportunidade corrente do combustível em ambos os sentidos. Quando o índice está acima do mercado à vista, o gerador é preterido na ordem de mérito apesar de haver molécula barata disponível; quando está abaixo, ocorre o inverso. Somem-se as parcelas de transporte contratado e de encargos, e o custo variável declarado deixa de ser função observável do preço corrente do gás — o que é exatamente a razão pela qual não se infere o preço do gás a partir do despacho, nem o inverso." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Esta aula é a antecâmara do <b>GridAlpha Brasil Terminal</b>. O terminal mostra despacho e preço de curto prazo; esta aula explica por que uma térmica a gás pode estar despachando com o mercado à vista barato, ou parada com ele caro. Sem a camada contratual, o dado de despacho é um fato sem causa. Com ela, vira leitura." },
  ],
  'aula-15-07': [
    { kind: 'titulo', numero: "07.1", texto: "GNL: flexibilidade importada, e o que ela custa" },
    { kind: 'paragrafo', html: "Gás natural liquefeito é a mesma molécula resfriada até liquefazer, o que reduz seu volume por um fator de várias centenas e a torna transportável por navio. No destino, um terminal armazena e regaseifica. Para o Brasil, o valor do GNL é <b>opcionalidade</b>: é a única porta de entrada capaz de trazer molécula nova ao sistema em semanas, e não em anos — o que importa em três situações específicas: pico de despacho térmico por hidrologia desfavorável, redução de importação por gasoduto e atraso de infraestrutura doméstica." },
    { kind: 'paragrafo', html: "Essa opcionalidade tem preço, e ele se decompõe em camadas — as mesmas seis da aula anterior, mais três exclusivas: liquefação na origem, frete marítimo e regaseificação no destino. É por isso que comparar um preço de GNL na origem com um preço de gás nacional no <i>city gate</i> não significa nada: falta somar quatro parcelas ao primeiro para colocá-los na mesma base. Uma unidade flutuante de armazenamento e regaseificação encurta o prazo de implantação de um terminal, mas não elimina o gargalo seguinte — a conexão ao gasoduto ou à usina." },
    { kind: 'tabela', linhas: [["Modelo de suprimento por GNL", "O que entrega", "Custo e risco", "Uso adequado"], ["Carga pontual", "Flexibilidade total de volume e de momento", "Preço e disponibilidade voláteis; exposição a crise internacional simultânea<span class=\"sub\">o momento em que você mais precisa é o momento em que todo mundo precisa</span>", "Pico e contingência"], ["Contrato de longo prazo", "Segurança de suprimento e fórmula previsível", "Retirada mínima e indexação; compromisso mantido em anos de demanda baixa", "Demanda estrutural"], ["Terminal dedicado a uma usina", "Integração e rapidez de implantação", "Ativo concentrado; sem comprador alternativo se a usina não despachar", "Geração flexível isolada da malha"], ["Terminal conectado à malha", "Diversificação de compradores", "Depende de acesso e de capacidade de transporte disponível", "Mercado regional"]] },
    { kind: 'titulo', numero: "07.2", texto: "O marco: Lei nº 14.134/2021 e o que ela redesenhou" },
    { kind: 'paragrafo', html: "A Lei nº 14.134, de 8 de abril de 2021, substituiu o marco anterior e redesenhou quatro coisas. Transporte passou de concessão a <b>autorização</b>, o que remove a necessidade de licitação prévia e muda o modelo de entrada. Instituiu-se a exigência de <b>independência do transportador</b> em relação a interesses concorrenciais na molécula. Adotou-se o modelo de <b>entrada e saída</b>: o carregador contrata capacidade em pontos de entrada e em pontos de saída de forma independente, em vez de contratar um caminho ponto a ponto. E o artigo 28 estabeleceu o princípio do <b>acesso negociado e não discriminatório de terceiros</b> às infraestruturas essenciais — gasodutos de escoamento da produção, unidades de tratamento ou processamento e terminais de GNL. O Decreto nº 10.712/2021 regulamentou a lei, e o Decreto nº 12.153/2024 o alterou, trazendo inovações que prolongaram o processo regulatório subsequente." },
    { kind: 'titulo', numero: "07.3", texto: "Os quatro estados de política, aplicados dispositivo por dispositivo" },
    { kind: 'tabela', linhas: [["Dispositivo ou tema", "Estado em 04/08/2026", "Marco temporal"], ["Transporte por autorização, independência do transportador, modelo de entrada e saída", "<b>Em vigor</b> — Lei nº 14.134/2021 e Decreto nº 10.712/2021, com alterações do Decreto nº 12.153/2024.", "Vigente desde 2021, com adequação de contratos legados em curso."], ["Acesso de terceiros a <b>terminais de GNL</b>", "<b>Em vigor</b> — Resolução ANP nº 1.003/2026, aprovada pela diretoria em 26/06/2026 e publicada em 02/07/2026. Exige separação contábil das atividades de operação de terminal, impõe requisitos adicionais a agentes verticalizados, prevê revisão periódica dos volumes de uso preferencial do proprietário e prioriza mediação e conciliação em caso de conflito.", "Prazo de <b>90 dias</b> para os operadores elaborarem os códigos de conduta e prática de acesso, que devem ser previamente aprovados pela agência antes de publicados.<span class=\"sub\">O prazo corre e ainda não venceu em 04/08/2026.</span>"], ["Acesso de terceiros a <b>gasodutos de escoamento</b> e a <b>unidades de tratamento ou processamento</b>", "<b>Anunciado com data futura</b> — a diretoria colegiada da ANP decidiu em 10/07/2026 abrir consulta pública de 45 dias sobre minuta de resolução. Não há norma vigente sobre esses dois tipos de infraestrutura.", "A própria agência havia previsto conclusão dessa regulamentação para <b>maio de 2026</b>. A data passou; o tema foi a consulta pública em julho.<span class=\"sub\">Este é o caso em que dois estados se sobrepõem: prazo interno vencido, e novo ato anunciado.</span>"], ["Norma de <b>solução de conflitos</b> relativos ao acesso a infraestruturas essenciais", "<b>Autorização legal sem ato de implementação</b> — prevista como segunda norma do mesmo processo, ainda não editada.", "Cronograma da ação correspondente na agenda regulatória da agência estendido para <b>dezembro de 2026</b>."], ["Princípio do art. 28 da Lei nº 14.134/2021, considerado isoladamente", "<b>Prazo vencido e implementação parcial</b> — o princípio vige desde 2021; a primeira resolução que o operacionaliza saiu em 2026, e cobre um dos três tipos de infraestrutura.", "Cinco anos entre a lei e a primeira norma. Órgão de controle externo apontou, em relatório publicado em março de 2026, lacunas na implementação do programa federal de abertura, recomendando à agência providências para apresentação tempestiva dos códigos de acesso."]] },
    { kind: 'nota', tom: "neutro", label: "O quarto estado é o que separa quem leu a lei de quem leu a resolução", html: "Alguém que leu apenas a Lei nº 14.134/2021 conclui, corretamente, que o acesso de terceiros a infraestruturas essenciais é assegurado no Brasil desde 2021. Alguém que leu apenas a Resolução ANP nº 1.003/2026 conclui, corretamente, que ele foi regulamentado em 2026 e apenas para terminais de GNL. As duas leituras são verdadeiras e incompatíveis na conclusão prática, e a diferença entre elas <em>é o conteúdo desta aula</em>. Livre acesso escrito em lei não cria capacidade física, não cria simetria de informação e não cria tarifa competitiva por si só. A efetividade depende de dado público, de contrato, de governança de conflito e de poder de fazer cumprir." },
    { kind: 'titulo', numero: "07.4", texto: "O vocabulário mínimo de quem compra capacidade" },
    { kind: 'tabela', linhas: [["Termo", "Definição operacional", "Risco de confusão"], ["Carregador", "Agente que contrata capacidade de transporte e movimenta gás pela malha.", "Não precisa ser dono do duto nem, necessariamente, da molécula."], ["Transportador", "Opera o sistema de transporte sob autorização.", "Deve manter independência em relação a interesses concorrenciais na venda da molécula."], ["Entrada e saída", "Capacidades contratadas por pontos independentes, sem caminho definido.", "Contratar capacidade não elimina restrição física de pressão, qualidade ou congestionamento."], ["Firme", "Serviço com prioridade e compromisso de disponibilidade.", "Custa mais e costuma exigir prazo maior."], ["Interruptível", "Serviço que pode ser interrompido conforme regra contratual.", "Não serve a processo industrial sem alternativa de suprimento."], ["Infraestrutura essencial", "Instalação sem cujo uso um concorrente não consegue competir — escoamento, processamento, terminal de GNL.", "A qualificação como essencial é jurídica e regulatória, não uma opinião sobre importância."], ["Código de conduta e prática de acesso", "Documento do operador da infraestrutura com princípios e procedimentos de negociação de acesso, sujeito a aprovação prévia da agência.", "É o instrumento que converte o princípio em procedimento; sem ele, o acesso permanece abstrato."]] },
    { kind: 'titulo', numero: "07.5", texto: "Ficha de elo 04 — gasoduto de transporte" },
    { kind: 'titulo', numero: null, texto: "Gasoduto de transporte elo 5 da cadeia · Ficha de elo · campos idênticos" },
    { kind: 'nota', tom: "neutro", label: null, html: "<b>O que o elo faz.</b> Movimenta gás especificado, em alta pressão, entre pontos de entrada e pontos de saída de um sistema, para carregadores que contrataram capacidade. <b>Quem é titular do quê.</b> O transportador é titular <b>da instalação</b>, jamais da molécula. O carregador é titular da molécula e da capacidade contratada. A separação é exigência do marco legal. <b>Grandeza e unidade.</b> Capacidade em <b>m³/d</b> por ponto; movimentação em <b>m³/d</b>; pressão em bar.<span class=\"mini\">Capacidade contratada, capacidade disponível e volume movimentado são três números diferentes no mesmo duto.</span> <b>Como o preço se forma.</b> <b>Tarifa</b> de entrada e de saída, por modalidade firme ou interruptível, sob regime regulado. Não é preço de mercado e não é negociação livre. <b>Órgão e norma.</b> ANP; Lei nº 14.134/2021 e Decreto nº 10.712/2021, alterado pelo Decreto nº 12.153/2024. <span class=\"mini\">Em vigor. Adequação de contratos legados de transporte em curso.</span> <b>Devolve à camada seguinte.</b> Molécula no ponto de saída — que pode ser o <i>city gate</i> de uma distribuidora estadual ou a conexão direta de uma térmica ou de um consumidor livre. <b>O que este número não diz.</b> <b>Preencha.</b> A capacidade do gasoduto não diz quanto está contratado, não diz quanto está disponível para terceiros, não diz…<span class=\"mini\">Repare que aqui a lacuna é de <em>acesso</em>, não de volume.</span>" },
    { kind: 'titulo', numero: "07.6", texto: "Ficha de elo 05 — terminal de regaseificação" },
    { kind: 'titulo', numero: null, texto: "Terminal de regaseificação elo 6 da cadeia · Ficha de elo · campos idênticos" },
    { kind: 'nota', tom: "neutro", label: null, html: "<b>O que o elo faz.</b> Recebe gás liquefeito por navio, armazena em tanque criogênico e devolve a molécula ao estado gasoso, injetando-a na malha ou entregando-a diretamente a uma usina. <b>Quem é titular do quê.</b> O operador do terminal é titular da instalação e presta serviço; a molécula é de quem a importou. <b>Quando os dois são o mesmo agente</b>, o marco legal impõe separação contábil e requisitos adicionais. <b>Grandeza e unidade.</b> Capacidade de regaseificação em <b>m³/d</b>; capacidade de armazenamento em m³ de líquido; ciclos de recebimento por período.<span class=\"mini\">Capacidade de regaseificação e disponibilidade efetiva divergem quando não há navio programado.</span> <b>Como o preço se forma.</b> <b>Capacidade contratada mais serviço</b>, sob acesso negociado e não discriminatório. A partir de 2026, sob código de conduta e prática de acesso aprovado previamente pela agência. <b>Órgão e norma.</b> ANP; art. 28 da Lei nº 14.134/2021, regulamentado pela <b>Resolução ANP nº 1.003/2026</b>, publicada em 02/07/2026. <span class=\"mini\">Em vigor, com prazo de 90 dias para os códigos de acesso, ainda em curso em 04/08/2026.</span> <b>Devolve à camada seguinte.</b> Molécula especificada, disponível em prazo de semanas — a única fonte de oferta nova com esse tempo de resposta em todo o sistema. <b>O que este número não diz.</b> <b>Preencha.</b> A capacidade do terminal não diz quanto do volume é reservado ao uso preferencial do proprietário, não diz…<span class=\"mini\">Este campo mudou de conteúdo em 2 de julho de 2026. Por quê?</span>" },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "O <b>Regulatory Radar</b> tem, nesta aula, o seu caso mais limpo de aplicação: cinco dispositivos, cinco estados diferentes, cinco datas — e nenhum deles legível a partir do texto da lei. O valor entregue é saber, em qualquer dia, em qual estado cada peça se encontra. Reforçando a ressalva declarada na Aula 04: o escopo de cobertura descrito no plano de negócios do produto enumera os reguladores do setor elétrico e não inclui a ANP; a cobertura de atos da agência de petróleo e gás é extensão declarada, não capacidade presumida." },
  ],
  'aula-15-08': [
    { kind: 'titulo', numero: "08.1", texto: "A ponte gás-eletricidade, em uma fórmula e três termos" },
    { kind: 'titulo', numero: null, texto: "Custo de combustível de uma térmica a gás" },
    { kind: 'formula', eq: "custo (R$/MWh) = preço do gás (US$/MMBtu) × câmbio (R$/US$) × consumo específico (MMBtu/MWh)", desc: "O consumo específico — em inglês heat rate — mede quanta energia térmica de combustível a usina consome para entregar um MWh elétrico. Quanto menor, mais eficiente. Uma unidade de ciclo combinado moderna opera próxima de 7 MMBtu por MWh; ciclo simples consome sensivelmente mais. A eficiência real varia com carga parcial, temperatura ambiente, idade e regime operacional, e a que entra na declaração não é necessariamente a de placa." },
    { kind: 'paragrafo', html: "Some-se a esse custo o custo variável de operação e manutenção, encargos e demais componentes, e você tem o <b>custo variável unitário</b> — o CVU, declarado pelo agente e usado pelo operador do sistema na formação da ordem de despacho. Exemplo aritmético: gás entregue a US$ 9,00 por MMBtu, câmbio de R$ 5,40 e consumo específico de 7,1 MMBtu/MWh produzem um custo de combustível de cerca de <b>R$ 345 por MWh</b>. Somados R$ 58 por MWh de operação, manutenção e demais componentes, o CVU simplificado fica em torno de <b>R$ 403 por MWh</b>." },
    { kind: 'paragrafo', html: "Converta o consumo específico em eficiência para ver a mesma coisa por outro ângulo: 7 MMBtu por MWh, a 293,07 kWh térmicos por MMBtu, correspondem a cerca de 2,05 MWh térmicos consumidos para entregar 1 MWh elétrico — eficiência de aproximadamente <b>48,8%</b>. Metade da energia do combustível vira eletricidade; a outra metade vira calor rejeitado. É a mesma física do Módulo 01, reaparecendo com uma etiqueta de preço." },
    { kind: 'titulo', numero: "08.2", texto: "Cinco motivos para uma térmica despachar, e só um é econômico" },
    { kind: 'paragrafo', html: "Aqui está o núcleo da aula. No despacho centralizado brasileiro, o operador do sistema decide quais usinas geram — e o CVU é apenas <em>um</em> dos critérios. Quem infere o preço do gás a partir do fato de a térmica estar gerando está supondo que o único motivo é a ordem de mérito. Não é." },
    { kind: 'nota', tom: "neutro", label: null, html: "<b>1 · Ordem de mérito<span class=\"mt\">econômico</span></b>A usina é chamada porque seu CVU está abaixo do custo marginal de operação do sistema naquele período. <em>Este é o único caso em que o despacho carrega informação econômica sobre o custo do combustível.</em>" },
    { kind: 'nota', tom: "neutro", label: null, html: "<b>2 · Inflexibilidade declarada<span class=\"mt\">contratual</span></b>O agente declara previamente um patamar mínimo de geração — a chamada necessidade do agente —, e essa declaração é <b>preponderante</b> em relação à otimização energética. A origem econômica costuma ser a retirada mínima do contrato de gás: se o combustível será pago de qualquer modo, gerar é melhor que não gerar. O despacho existe, e o preço do dia não o explica." },
    { kind: 'nota', tom: "neutro", label: null, html: "<b>3 · Restrição elétrica · <i>constrained-on</i><span class=\"mt\">sistêmico</span></b>A usina não é despachada por mérito, mas é comandada a elevar a geração por restrição da rede. O montante verificado como restrição elétrica é contabilizado e remunerado pelo CVU da própria usina. O inverso — <i>constrained-off</i> — ocorre quando uma usina despachada por mérito precisa reduzir por restrição, e o montante não gerado é remunerado pela diferença entre o preço de curto prazo e o CVU." },
    { kind: 'nota', tom: "neutro", label: null, html: "<b>4 · Requisitos de acionamento · <i>unit commitment</i><span class=\"mt\">técnico</span></b>Tempo mínimo ligada, tempo mínimo desligada, rampas de subida e de descida. Uma usina pode continuar gerando depois que o mérito já a dispensaria, simplesmente porque desligar e religar custa mais que continuar." },
    { kind: 'nota', tom: "neutro", label: null, html: "<b>5 · Garantia de suprimento energético<span class=\"mt\">decisão de comitê</span></b>Despacho autorizado por decisão do comitê de monitoramento do setor elétrico, fora da ordem de mérito, para preservar segurança energética. Ocorreu, por exemplo, com autorização de março de 2026 diante de condições hidrológicas desfavoráveis na região Sul." },
    { kind: 'nota', tom: "gold", label: "A pergunta que separa os cinco casos", html: "Diante de um dado de despacho térmico, a pergunta correta não é \"o gás está caro?\". É: <b>a usina gerou acima ou abaixo da sua inflexibilidade declarada?</b> Geração até o patamar de inflexibilidade não carrega sinal econômico — ela ocorreria de todo modo. Geração <em>acima</em> dele é a parte que responde ao mérito e ao custo. Essa é a linha divisória, e ela existe também na contabilidade: em contrato por disponibilidade no ambiente regulado, o custo do combustível da parcela inflexível compõe a <b>receita fixa</b>, enquanto o custo do combustível do despacho por ordem do operador compõe a <b>receita variável</b>. São duas rubricas, para o mesmo combustível, na mesma usina, no mesmo mês." },
    { kind: 'titulo', numero: "08.3", texto: "O regulador precifica exatamente essa distinção" },
    { kind: 'paragrafo', html: "Se você quiser uma prova de que a separação entre despacho por mérito e despacho por inflexibilidade não é sutileza acadêmica, olhe as regras do leilão de reserva de capacidade de 2026, estabelecidas por portarias do MME publicadas em outubro de 2025. Entre os critérios de inelegibilidade estão: CVU igual a zero; CVU superior ao maior CVU de usinas termelétricas a gás natural conforme o programa mensal de operação de referência; e <b>valor de inflexibilidade de geração anual superior a zero</b>. O certame contratou disponibilidade de potência de novos projetos a gás com contratos de quinze anos e de usinas existentes a gás ou carvão com contratos de dez anos, mediante comprovação de disponibilidade de combustível — comprovação que, no caso do gás, exige parecer da ANP sobre a viabilidade do fornecimento." },
    { kind: 'paragrafo', html: "Traduzindo: <em>o desenho do leilão exclui a usina que despacharia por razão contratual.</em> O que se está comprando é flexibilidade — a capacidade de gerar quando o sistema precisar e de não gerar quando não precisar. Uma usina com inflexibilidade anual positiva entrega o oposto disso. E é por isso que a estrutura do contrato de gás, negociada anos antes com um vendedor de molécula, determina se uma usina é ou não elegível a um produto do setor elétrico." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · e um fato de fronteira", html: "No primeiro trimestre de 2026, a companhia estatal de petróleo reportou a contratação de nove usinas termelétricas no leilão de reserva de capacidade daquele ano, com receita fixa estimada em cerca de <b>R$ 44 bilhões até 2031</b>. É o exemplo mais literal possível da fronteira que esta aula descreve: a mesma companhia que produz a molécula, escoa, processa e comercializa passa a ter receita regulada do setor elétrico pela disponibilidade das usinas que a queimam. Verificado em 4 de agosto de 2026 — acompanhe resultados trimestrais e comunicados ao mercado antes de qualquer uso externo." },
    { kind: 'nota', tom: "neutro", label: "Custo variável de térmica, em três níveis", html: "<b>Criança.</b> É quanto custa para a usina fazer mais um pedacinho de eletricidade. Quem tem o custo menor é chamado primeiro. <b>Executivo.</b> É o custo por MWh que o gerador declara e que o operador do sistema usa para ordenar quem gera. Combina o custo do combustível — preço do gás entregue, vezes câmbio, vezes consumo específico — com operação, manutenção e demais componentes. Mas ser chamado não depende só dele: inflexibilidade declarada, restrição de rede, requisitos de acionamento e decisão de garantia de suprimento também acionam a usina. <b>Especialista.</b> O custo variável declarado não é função observável do preço corrente do combustível. A parcela de molécula segue índice contratual com fator de aplicação e defasagem próprios; a parcela de transporte é contratada à parte e se reajusta por regra e data distintas; e o câmbio move o resultado sem que nenhum preço de gás tenha mudado. Em contrato por disponibilidade, o combustível da geração inflexível compõe receita fixa e o do despacho comandado compõe receita variável — duas rubricas para o mesmo combustível, na mesma usina, no mesmo mês. Daí decorre a regra operacional: não se infere preço de gás a partir de despacho, nem despacho a partir de preço de gás, sem separar a parcela inflexível." },
    { kind: 'titulo', numero: "08.4", texto: "Ficha de elo 06 — termelétrica a gás" },
    { kind: 'titulo', numero: null, texto: "Termelétrica a gás elo 9 · a fronteira · Ficha de elo · campos idênticos" },
    { kind: 'nota', tom: "neutro", label: null, html: "<b>O que o elo faz.</b> Converte a energia química do gás em energia elétrica, com eficiência da ordem de 45% a 60% conforme o ciclo, e entrega a energia ao sistema interligado. <b>Quem é titular do quê.</b> O gerador é titular da usina e comprador da molécula. <b>Nenhum regime de E&amp;P alcança este elo.</b> A titularidade que importa aqui é a da energia gerada, que segue o contrato de venda no ambiente regulado ou livre. <b>Grandeza e unidade.</b> Potência em <b>MW</b>; energia em <b>MWh</b>; consumo específico em <b>MMBtu/MWh</b>; CVU em <b>R$/MWh</b>; inflexibilidade em <b>% da capacidade</b> ou em MWmédios.<span class=\"mini\">Potência instalada, energia gerada e energia contratada seguem sendo três grandezas distintas — Módulos 08 e 14.</span> <b>Como o preço se forma.</b> Do lado do combustível: <b>contrato</b>, com indexação e retirada mínima. Do lado da energia: <b>receita fixa</b> pela disponibilidade e <b>receita variável</b> pelo despacho, mais liquidação das diferenças no mercado de curto prazo. <b>Órgão e norma.</b> ANEEL para outorga e regulação; ONS para despacho; CCEE para contabilização e liquidação; MME para diretrizes de leilão; ANP para o parecer de viabilidade de fornecimento de gás. <span class=\"mini\">Em vigor. Cinco jurisdições sobre o mesmo ativo.</span> <b>Devolve à camada seguinte.</b> Energia elétrica ao sistema — e, com ela, <b>um componente de custo</b> que entra na formação do preço de curto prazo pago por todo agente exposto, inclusive quem nunca comprou uma molécula de gás. <b>O que este número não diz.</b> <b>Preencha.</b> O despacho da usina não diz o preço do gás, não diz se houve mérito ou inflexibilidade, não diz…<span class=\"mini\">Cinco motivos possíveis, e o dado bruto não distingue nenhum deles. Volte ao §08.2.</span>" },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto — e este é o gancho mais direto do currículo até aqui", html: "O <b>GridAlpha Brasil Terminal</b> é descrito no plano de negócios como terminal de inteligência cobrindo o mercado brasileiro de eletricidade, com preços de curto prazo em tempo real nos quatro submercados, mix de geração, níveis de reservatórios, dinâmica de despacho hidrelétrico, dados mensais do programa de operação, fluxos do mecanismo de realocação de energia e estruturas tarifárias. A cadeia causal deste módulo — <b>preço do gás → custo variável declarado → ordem de despacho → preço de curto prazo</b> — termina exatamente na primeira variável que o terminal entrega. Um terminal que mostra o efeito sem a causa é um painel. Um terminal cujo usuário sabe percorrer os oito elos anteriores é inteligência. A diferença entre os dois é este módulo." },
  ],
  'aula-15-09': [
    { kind: 'titulo', numero: "09.1", texto: "O protocolo de leitura, em ordem" },
    { kind: 'lista', itens: ["<b>Fixe o objeto e a base 30 segundos.</b> <i>(30 segundos)</i> </span>Campo, bloco, contrato, empresa, ente federativo ou política. Data-base, moeda, unidade e — no caso de consórcio — <b>participação econômica</b>. Sem participação, receita de campo não é receita de ninguém.", "<b>Nomeie o regime Lente 01.</b> <i>(Lente 01)</i> </span>Concessão, partilha ou cessão onerosa. Se a fonte não disser, a pergunta é essa e não outra. Volume soma entre regimes; receita não.", "<b>Classifique a grandeza Lente 01.</b> <i>(Lente 01)</i> </span>Recurso, reserva ou produção. Se for reserva: critério de certeza e data de referência. Se for produção: bruta ou disponibilizada ao mercado.", "<b>Localize a camada Lente 02.</b> <i>(Lente 02)</i> </span>Em qual dos seis pontos aquele preço se formou, e o que ele já inclui — frete, tributo, mistura obrigatória, subvenção, margem. Preço sem camada declarada não é comparável com nada.", "<b>Separe os fluxos ao Estado Lente 01.</b> <i>(Lente 01)</i> </span>Bônus, royalty, participação especial, excedente em óleo, retenção de área, PD&amp;I e tributos são sete coisas. Nenhuma delas é sinônimo das outras.", "<b>Teste o acoplamento Lente 03.</b> <i>(Lente 03)</i> </span>Se houver gás na história, pergunte onde ele encontra uma térmica — e se o despacho dela responde a mérito ou a inflexibilidade contratual.", "<b>Enumere quem ganha com a afirmação independência.</b> <i>(independência)</i> </span>Operadora, transportador, distribuidora, consumidor industrial, gerador, Estado produtor, posição climática. Cada um tem interesse oposto em pelo menos uma variável do número que você está lendo.", "<b>Conclua condicionalmente saída.</b> <i>(saída)</i> </span>Funciona se; quebra se; falta confirmar. Nunca \"é bom\" ou \"é ruim\"."] },
    { kind: 'titulo', numero: "09.2", texto: "A companhia estatal listada: mandatos múltiplos, não contraditórios" },
    { kind: 'paragrafo', html: "A Petrobras é sociedade de economia mista sob controle da União, com ações negociadas no Brasil e no exterior. Isso cria uma estrutura de <b>mandatos simultâneos</b>: gerar valor econômico, cumprir a lei societária, competir, contribuir para a segurança de abastecimento e responder a expectativas de política pública. A leitura ruim escolhe um extremo — trata a companhia como ministério que pode ignorar retorno, ou como empresa privada comum sobre a qual o controle estatal não pesa. Nenhum dos dois descreve o objeto." },
    { kind: 'paragrafo', html: "A leitura boa separa quatro coisas que costumam ser confundidas: <b>obrigação legal</b> — o que a lei e o estatuto impõem; <b>estratégia aprovada</b> — o que o plano de negócios registra e o conselho sancionou; <b>expectativa política</b> — o que autoridades declaram desejar; e <b>especulação</b> — o que analistas projetam. Só a primeira e a segunda são verificáveis em documento. E há uma pergunta de triagem que resolve a maioria dos casos: <em>existe comando formal — lei, decreto, resolução, fato relevante — ou existe apenas discurso?</em>" },
    { kind: 'tabela', linhas: [["Dimensão", "A pergunta correta", "Onde está a resposta"], ["Controle", "Quem elege o conselho e com qual participação votante?", "Formulário de referência e relações com investidores"], ["Governança", "Quais políticas e cláusulas estatutárias limitam a decisão?", "Estatuto, políticas e atas"], ["Operação", "Quais ativos geram volume e quais geram margem? São os mesmos?", "Relatório operacional trimestral"], ["Capital", "Onde o plano aloca investimento, e o projeto está em implantação ou em avaliação?", "Plano de negócios"], ["Retorno", "Qual a política de remuneração e qual o limite de endividamento?", "Política de dividendos e demonstrações"], ["Política pública", "Há comando formal ou apenas expectativa declarada?", "Lei, decreto, resolução, fato relevante"]] },
    { kind: 'nota', tom: "neutro", label: "Herança direta do Bloco 13, aplicável integralmente", html: "Nenhuma recomendação de compra, venda ou manutenção de valor mobiliário. Nenhum preço-alvo. Nenhuma avaliação sobre a ação estar cara ou barata. E — extensão específica deste bloco — nenhum juízo sobre a estratégia de transição da companhia estar certa ou errada. Este módulo descreve a <b>estrutura do dilema</b> e as duas leituras que dela decorrem. Não escolhe." },
    { kind: 'titulo', numero: "09.3", texto: "O dilema estratégico, apresentado pelos dois lados" },
    { kind: 'paragrafo', html: "Os fatos verificáveis, primeiro. O Plano de Negócios 2026–2030, aprovado em 27 de novembro de 2025, prevê US$ 109 bilhões de investimento no quinquênio, dos quais US$ 91 bilhões em carteira em implantação e US$ 18 bilhões em avaliação. Da carteira em implantação alvo de exploração e produção — US$ 69,2 bilhões — cerca de 62% se destinam ao pré-sal. A curva de produção projeta pico próximo de 2,7 milhões de barris por dia em 2028. O investimento em transição energética, considerando todas as iniciativas de baixo carbono, soma US$ 13 bilhões, o equivalente a cerca de 12% do investimento total — dos quais aproximadamente US$ 3,1 bilhões em energias de baixo carbono propriamente ditas, valor inferior ao previsto no plano anterior. A companhia declara ambição de manter participação em torno de 31% da oferta primária de energia do país até 2050." },
    { kind: 'nota', tom: "neutro", label: "A leitura de que a renda do pré-sal viabiliza a transição", html: "<b>O barril brasileiro é competitivo e de intensidade de carbono relativamente baixa</b>Se a demanda mundial vai existir por décadas, é preferível que o barril marginal atendido seja o de menor custo e menor emissão de produção do que um mais intensivo produzido em outro lugar. <b>A renda financia infraestrutura, ciência e a própria transição</b>Participações governamentais de escala relevante, fundo social, encargo contratual de pesquisa e desenvolvimento, e capacidade de investimento da companhia em bioprodutos e descarbonização. <b>Segurança energética e divisas</b>Exportação líquida de cru reduz vulnerabilidade externa e dá poder de barganha num sistema internacional em que energia é instrumento de política. <b>Substituição não é imediata</b>Eletricidade renovável não substitui, no horizonte de investimento, combustível líquido em aviação, navegação, transporte pesado e petroquímica." },
    { kind: 'nota', tom: "neutro", label: "A leitura de que a expansão é incompatível com os compromissos assumidos", html: "<b>Orçamento de carbono é um estoque, não um fluxo</b>Compatibilidade com metas climáticas depende de emissões acumuladas; um barril de baixa intensidade de produção continua sendo um barril cuja combustão emite. <b>Risco de encalhe de ativo</b>Projeto offshore tem vida de décadas e retorno concentrado no fim; se a demanda inflectir antes, o capital investido não se recupera — e o risco recai sobre acionista e sobre o Estado controlador. <b>Descarbonização operacional não cobre o uso final</b>Reduzir emissões de escopo 1 e 2 melhora o indicador da produção; a maior parte das emissões do ciclo do petróleo ocorre na combustão do produto vendido, que nenhum indicador operacional alcança. <b>Dependência fiscal cria trava política</b>Entes cuja receita corrente depende de renda petrolífera passam a ter interesse orçamentário em prolongar a atividade, independentemente do mérito energético." },
    { kind: 'nota', tom: "gold", label: "Como responder sem escolher lado — e por que essa é a resposta profissional", html: "As duas colunas não são simétricas por gentileza retórica: elas medem coisas diferentes. A primeira mede <b>custo e emissão por barril produzido</b> e assume demanda dada. A segunda mede <b>emissão acumulada do sistema</b> e questiona a demanda dada. A resposta correta a \"o pré-sal é compatível com o clima?\" devolve exatamente isso: <em>compatível com o quê, medido em qual grandeza, sob qual cenário de demanda, e em qual horizonte</em> — e depois nomeia as três coisas que mudariam a conclusão de cada lado. Devolver a estrutura não é fugir da pergunta. É a única resposta que sobrevive à revisão de quem defende o lado oposto." },
    { kind: 'titulo', numero: "09.4", texto: "Decisão sob incerteza: a nova fronteira exploratória" },
    { kind: 'paragrafo', html: "O caso da margem equatorial concentra, num só objeto, todas as tensões do módulo — e é o melhor exercício de sequência correta que o tema oferece. A regra é simples e quase sempre violada: <b>licença para perfurar um poço exploratório autoriza testar um prospecto sob condicionantes; não prova descoberta, não estabelece reserva e não autoriza produção comercial.</b> Cada um desses é um degrau distinto, com evidência própria." },
    { kind: 'paragrafo', html: "O estado verificado em 4 de agosto de 2026: a diretoria da ANP aprovou em 26 de junho de 2026 a indicação de <b>86 blocos exploratórios</b> da margem equatorial para o rol de áreas em estudo, com vistas a possível inclusão em ciclos futuros — 36 na bacia da Foz do Amazonas, 25 na Pará-Maranhão e 25 na Barreirinhas. <b>Esses blocos não integram o sexto ciclo da Oferta Permanente de Concessão, marcado para 7 de outubro de 2026</b>, e antes de qualquer pregão precisam passar por avaliação técnica, audiência pública, aprovação da agência e licenciamento ambiental. No primeiro trimestre de 2026, a companhia estatal reportou renovação de licença operacional para perfuração de poços exploratórios em área da região. Indicação para estudo, oferta em leilão, contrato assinado, licença de perfuração, descoberta, comercialidade e primeiro óleo são <b>sete estados diferentes</b>, e a imprensa especializada frequentemente os comprime em um só." },
    { kind: 'tabela', linhas: [["Argumento em disputa", "Evidência que o sustentaria", "Falha retórica frequente"], ["Potencial econômico da nova fronteira", "Descoberta declarada, volume estimado com critério, custo, prazo e preço de equilíbrio", "Usar analogia com bacia vizinha de outro país como se fosse reserva comprovada aqui"], ["Risco ambiental", "Modelagem de dispersão, sensibilidade da área, capacidade de resposta e histórico de incidentes", "Tratar todo risco como impossível de gerir, ou como irrelevante"], ["Segurança energética futura", "Cenário de demanda e curva de declínio dos campos existentes", "Assumir que todo barril futuro será necessário"], ["Desenvolvimento regional", "Mecanismo de arrecadação, encadeamento produtivo e governança do uso da renda", "Prometer benefício sem descrever o mecanismo que o produziria"], ["Compatibilidade climática", "Orçamento de carbono e competitividade do barril em cenário de preço baixo", "Comparar apenas intensidade operacional, ignorando emissão de uso final"]] },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Este é o ponto em que a independência analítica deixa de ser posicionamento e vira método. Quase todo material público sobre este tema é produzido por quem tem posição declarada: a operadora, a entidade setorial, a organização ambiental, o governo do estado produtor, o sindicato. Uma <b>nova camada independente</b> não é a que não tem opinião — é a que nomeia o interesse de cada fonte antes de usar o número dela, e que se recusa a converter uma controvérsia real em veredito para parecer conclusiva. É esse o produto: o <b>Energy Brief</b> e o <b>GridAlpha Research</b> existem para entregar a estrutura da decisão e as condições de cada tese, nunca a tese." },
    { kind: 'nota', tom: "gold", label: "Ponte para o Bloco 16", html: "Uma frase, e apenas uma: tudo o que este módulo tratou como demanda dada — frota a combustão, processo industrial a gás, aviação e navegação — é exatamente o que o próximo bloco vai tratar como variável, ao abrir eletrificação, digitalização, descentralização e hidrogênio. A pergunta que fecha o Módulo 15 e abre o Bloco 16 é: <em>e se a demanda não for dada?</em>" },
  ],
};

/** Os quinze exercícios do § Ex. TODOS soltos: a varredura por
 *  `/[Aa]ula\s*\d+/` no resumo, no enunciado e no gabarito dos quinze
 *  devolve ZERO — a fonte não declara vínculo, e ele não foi
 *  inventado (protocolo §4). A família do § Ex fica em `config.tag`. */
export const MODULO_15_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: "m15-ex-01",
    kind: 'discursiva',
    prompt: "Dois campos vizinhos produzem 100 mil bbl/d cada. Qual a receita combinada de quem os produziu?",
    points: 10,
    config: { tag: "Família 1 · identificação de regime", gabarito: "<p><b>A resposta correta recusa somar.</b> Volume físico soma: são 200 mil bbl/d. Receita não soma sem saber o regime de cada um. Se ambos forem de concessão, os concessionários são titulares de toda a produção e a receita bruta de cada um é volume × preço realizado × participação econômica no consórcio. Se um deles for de partilha, a molécula é da União: o operador recebe custo em óleo mais uma fatia do excedente, e a receita dele pode ser uma fração pequena do volume que produziu. Antes de qualquer conta, três perguntas: <b>regime de cada campo, participação econômica de cada sócio, e — na partilha — percentual de excedente ofertado e estágio de recuperação de custo.</b></p>" },
  },
  {
    id: "m15-ex-02",
    kind: 'discursiva',
    prompt: "Uma fonte informa que 11 das 272 áreas produtoras do país estão em regime de partilha. O que você conclui sobre a importância desse regime?",
    points: 10,
    config: { tag: "Família 1 · identificação de regime", gabarito: "<p><b>Nada, ainda.</b> Número de áreas não é volume, e volume não é receita. Onze áreas de partilha podem representar uma fatia desproporcional da produção nacional, porque os campos do polígono do pré-sal contratados sob esse regime estão entre os mais produtivos do país. E mesmo o volume não decide a importância fiscal: em partilha a União recebe royalty <em>e</em> excedente em óleo, o que a torna titular física de hidrocarboneto — um fluxo que não existe em concessão. A pergunta correta é: <b>qual a participação dessas áreas na produção, e qual o volume do excedente da União?</b></p>" },
  },
  {
    id: "m15-ex-03",
    kind: 'discursiva',
    prompt: "Um material afirma que \"o mesmo campo opera sob dois regimes\". Isso é possível?",
    points: 10,
    config: { tag: "Família 1 · identificação de regime", gabarito: "<p><b>Sim, e é o caso de campos originários da cessão onerosa.</b> A cessão onerosa foi contratada com teto volumétrico. Quando o volume recuperável de um campo excedeu o teto cedido, o excedente foi objeto de licitação própria, sob regime de partilha. O resultado é um campo físico único com dois contratos sobre volumes distintos, governança de individualização por cima, e — consequentemente — duas apurações de participação governamental. Qualquer leitura de receita desse campo que use um só regime está errada por construção.</p>" },
  },
  {
    id: "m15-ex-04",
    kind: 'discursiva',
    prompt: "Numa licitação de partilha, o que as empresas disputam?",
    points: 10,
    config: { tag: "Família 1 · identificação de regime", gabarito: "<p><b>O percentual de excedente em óleo ofertado à União</b>, a partir de um mínimo definido no edital. O bônus de assinatura é fixo. Isso inverte a lógica da concessão, em que se disputa dinheiro adiantado e programa exploratório. E tem consequência analítica: em partilha, o resultado do leilão informa diretamente quanto da produção futura ficará com o Estado, o que não acontece em concessão, onde a parcela pública depende de alíquotas e de rentabilidade apurada depois.</p>" },
  },
  {
    id: "m15-ex-05",
    kind: 'discursiva',
    prompt: "Um preço de gás de US$ 6 por MMBtu é competitivo?",
    points: 10,
    config: { tag: "Família 2 · identificação de camada", gabarito: "<p><b>A pergunta anterior é: qual preço?</b> Molécula na saída do processamento, molécula entregue no <i>city gate</i>, gás com transporte contratado até um ponto específico, gás importado por gasoduto, gás liquefeito na origem, ou preço final ao consumidor industrial pela distribuidora estadual — são seis camadas, e a distância entre a primeira e a última não é uma constante. US$ 6 na origem de uma carga liquefeita e US$ 6 entregues a uma fábrica são realidades econômicas incomparáveis: falta somar frete marítimo, internalização, regaseificação, transporte e distribuição ao primeiro.</p>" },
  },
  {
    id: "m15-ex-06",
    kind: 'discursiva',
    prompt: "A companhia estatal anunciou reajuste de R$ 0,48 por litro na gasolina. Quanto sobe na bomba?",
    points: 10,
    config: { tag: "Família 2 · identificação de camada", gabarito: "<p><b>Não se sabe pelo anúncio.</b> O reajuste é da camada 4 — preço do produtor à distribuidora. Entre ela e a bomba há mistura obrigatória, tributos federais, tributo estadual, subvenção econômica quando vigente, custo de base e frete, e margem de revenda. No caso concreto de 28 de maio de 2026, o mesmo comunicado informava desconto de R$ 0,44 por litro no âmbito da subvenção federal — movimento líquido de quatro centavos para a distribuidora. A pergunta certa é: <b>quais outras camadas se moveram na mesma janela?</b></p>" },
  },
  {
    id: "m15-ex-07",
    kind: 'discursiva',
    prompt: "Uma fonte compara o preço médio do gás industrial no Brasil com o de outro país e conclui que o Brasil é caro. O que verificar antes de aceitar?",
    points: 10,
    config: { tag: "Família 2 · identificação de camada", gabarito: "<p><b>Cinco coisas.</b> Se as duas cotações estão na mesma camada da cadeia; se ambas incluem ou excluem tributos; se o volume de referência é o mesmo, porque tarifa industrial é escalonada por faixa de consumo; se o câmbio usado é o de mercado ou paridade de poder de compra; e <b>quem produziu a comparação e o que ganha com ela</b>. Comparação entre preço final ao consumidor de um lado e preço de <i>hub</i> do outro é o erro mais comum, e é sempre favorável à tese de quem compara.</p>" },
  },
  {
    id: "m15-ex-08",
    kind: 'discursiva',
    prompt: "O que é \"preço de referência\" no vocabulário da ANP, e por que ele não é o preço de venda?",
    points: 10,
    config: { tag: "Família 2 · identificação de camada", gabarito: "<p>É a camada 3 — o preço apurado por metodologia própria da agência para servir de base ao cálculo de royalty e de participação especial. Ele existe porque a base de cálculo de uma compensação pública não pode depender do preço que cada operador negociou com cada cliente: isso criaria incentivo direto a subavaliar a venda. <b>Consequência analítica:</b> o valor da produção para efeito fiscal e a receita contábil de um campo são números diferentes, e nenhum dos dois é erro do outro.</p>" },
  },
  {
    id: "m15-ex-09",
    kind: 'discursiva',
    prompt: "Um país tem 15 bilhões de barris de reserva provada e produz 1,5 bilhão por ano. Quanto tempo dura?",
    points: 10,
    config: { tag: "Família 3 · separação de grandeza", gabarito: "<p>A relação reserva/produção é de <b>10 anos</b>. E <b>não é prazo de esgotamento.</b> O indicador congela o denominador, ignora adições futuras, revisões, declínio natural dos campos e mudança de premissa de preço. Um país com R/P de 10 anos e índice de reposição consistentemente acima de 100% pode produzir por décadas. Um com R/P de 25 anos e reposição zero está encolhendo.</p>" },
  },
  {
    id: "m15-ex-10",
    kind: 'discursiva',
    prompt: "Um material cita \"reservas de 28,9 bilhões de barris\" e outro cita \"17,5 bilhões\". Qual está desatualizado?",
    points: 10,
    config: { tag: "Família 3 · separação de grandeza", gabarito: "<p><b>Nenhum.</b> São a mesma data de referência — 31 de dezembro de 2025 — sob critérios diferentes: 3P e 1P. A diferença é de 65%, e as duas afirmações são corretas dentro do seu critério. Este é o erro de fusão mais comum em material externo: citar o número maior sem declarar o critério. Toda menção a reserva exige <b>critério de certeza e data de referência</b>, e a ausência de qualquer um dos dois torna o número incomparável.</p>" },
  },
  {
    id: "m15-ex-11",
    kind: 'discursiva',
    prompt: "O índice de reposição de reservas de um país foi de 147% num ano. Isso é bom?",
    points: 10,
    config: { tag: "Família 3 · separação de grandeza", gabarito: "<p>Significa que se incorporou 47% mais reserva do que se produziu naquele ano — mas a leitura útil <b>decompõe a adição</b>. Nova descoberta, extensão de campo conhecido, revisão técnica, revisão por mudança de premissa de preço, aquisição de participação e reclassificação entre critérios produzem o mesmo indicador com significados muito diferentes. Reposição por revisão de preço se desfaz quando o preço cai. Reposição por descoberta, não. E um ano isolado é volátil por construção.</p>" },
  },
  {
    id: "m15-ex-12",
    kind: 'discursiva',
    prompt: "Produção bruta de gás de 217 milhões de m³/d significa oferta de 217 milhões de m³/d?",
    points: 10,
    config: { tag: "Família 3 · separação de grandeza", gabarito: "<p><b>Não.</b> O balanço físico é: disponível ≈ bruta − reinjeção − consumo nas unidades − queima e perdas. Em junho de 2026, com 217,35 milhões de m³/d produzidos, chegaram ao mercado <b>64,36 milhões</b> — menos de 30%. O aproveitamento reportado foi de 97%, porque reinjeção e consumo operacional contam como uso e não como perda. As duas afirmações — \"aproveitamento de 97%\" e \"menos de 30% chega ao mercado\" — são simultaneamente verdadeiras e medem coisas diferentes.</p>" },
  },
  {
    id: "m15-ex-13",
    kind: 'discursiva',
    prompt: "Uma térmica a gás está despachando. O que isso diz sobre o preço do gás?",
    points: 10,
    config: { tag: "Família 4 · acoplamento elétrico", gabarito: "<p><b>Sozinho, nada.</b> Cinco motivos levam uma térmica a gerar: ordem de mérito, inflexibilidade declarada, restrição elétrica, requisito de acionamento e decisão de garantia de suprimento. Só o primeiro carrega informação econômica sobre o combustível. A pergunta que separa os casos é: <b>a geração está acima ou abaixo da inflexibilidade declarada?</b> A parcela até o patamar de inflexibilidade ocorreria de todo modo, e sua origem econômica costuma ser a retirada mínima do contrato de gás.</p>" },
  },
  {
    id: "m15-ex-14",
    kind: 'discursiva',
    prompt: "Gás a US$ 10 por MMBtu, câmbio de R$ 5,50 e consumo específico de 7,2 MMBtu/MWh. Qual o custo de combustível por MWh?",
    points: 10,
    config: { tag: "Família 4 · acoplamento elétrico", gabarito: "<p>10 × 5,50 × 7,2 = <b>R$ 396 por MWh</b>. Somando O&amp;M variável e demais componentes — digamos R$ 55 por MWh — o custo variável simplificado fica em torno de <b>R$ 451 por MWh</b>. Duas observações que a conta não mostra: o preço de US$ 10 é <em>entregue à usina</em> e já inclui transporte contratado; e uma variação de R$ 0,50 no câmbio move o custo de combustível em cerca de R$ 36 por MWh sem que o preço do gás tenha mudado.</p>" },
  },
  {
    id: "m15-ex-15",
    kind: 'discursiva',
    prompt: "Por que o desenho do leilão de reserva de capacidade exclui usinas com inflexibilidade anual positiva?",
    points: 10,
    config: { tag: "Família 4 · acoplamento elétrico", gabarito: "<p>Porque o produto que o leilão compra é <b>flexibilidade</b>: capacidade de gerar quando o sistema precisar e de não gerar quando não precisar. Uma usina com inflexibilidade anual positiva entrega o contrário — geração que ocorre independentemente da necessidade sistêmica. A consequência é notável: <b>a estrutura de um contrato de gás, negociada anos antes com um vendedor de molécula, determina a elegibilidade de uma usina a um produto do setor elétrico.</b> É a demonstração mais limpa de que as duas cadeias não estão apenas conectadas — estão acopladas.</p>" },
  },
];

export const MODULO_15_AULAS: CurriculumAula[] = [
  {
    id: "aula-15-01",
    moduleId: 'modulo-15',
    number: 1,
    totalInModule: 9,
    title: "Três regimes, um subsolo",
    subtitle: "quem é dono da molécula",
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
    instruments: [
    {
      id: 'm15-inst-02',
      kind: 'comparador',
      title: "Comparador de regimes",
      formula: null,
      fields: [
        { id: "rg-reg", label: "Regime", unit: null, kind: "select", defaultValue: "conc", options: [{"value":"conc","label":"Concessão"},{"value":"part","label":"Partilha"},{"value":"cess","label":"Cessão onerosa"}] },
        { id: "rg-dim", label: "Dimensão", unit: null, kind: "select", defaultValue: "tit", options: [{"value":"tit","label":"Titularidade da molécula"},{"value":"est","label":"O que o Estado recebe"},{"value":"lic","label":"Como se disputa a área"},{"value":"ris","label":"Quem corre o risco"}] },
      ],
      outputs: [

      ],
      note: "Escolha um regime e uma dimensão de comparação. Toda dimensão devolve, além da resposta, uma ressalva de comparabilidade: o que muda, naquela dimensão, quando você tenta comparar dois números produzidos sob regimes diferentes.",
    }
    ],
  },
  {
    id: "aula-15-02",
    moduleId: 'modulo-15',
    number: 2,
    totalInModule: 9,
    title: "Recurso, reserva e produção",
    subtitle: "três grandezas, e a maior é sempre a citada",
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
    instruments: [
    {
      id: 'm15-inst-03',
      kind: 'simulador',
      title: "Régua de grandeza de subsolo",
      formula: null,
      fields: [
        { id: "gs-1p-n", label: "Reserva provada · 1P", unit: "bi bbl", kind: "range", defaultValue: 17.488, min: 0.1, max: 120, step: 0.001 },
        { id: "gs-2p-n", label: "Razão 2P / 1P", unit: "×", kind: "range", defaultValue: 1.387, min: 1, max: 3, step: 0.001 },
        { id: "gs-3p-n", label: "Razão 3P / 1P", unit: "×", kind: "range", defaultValue: 1.651, min: 1, max: 4, step: 0.001 },
        { id: "gs-pd-n", label: "Produção anual", unit: "bi bbl/ano", kind: "range", defaultValue: 1.38, min: 0.01, max: 6, step: 0.001 },
        { id: "gs-ad-n", label: "Adições líquidas 1P no ano", unit: "bi bbl", kind: "range", defaultValue: 2.023, min: 0, max: 8, step: 0.001 },
        { id: "gs-dt", label: "Data de certificação declarada na fonte", unit: null, kind: "select", defaultValue: "sim", options: [{"value":"sim","label":"Sim — data de referência conhecida"},{"value":"nao","label":"Não — a fonte não declara"}] },
        { id: "gs-cr", label: "Critério citado pela fonte", unit: null, kind: "select", defaultValue: "p1", options: [{"value":"p1","label":"1P · provada"},{"value":"p2","label":"2P"},{"value":"p3","label":"3P"},{"value":"nd","label":"Não declarado"}] },
      ],
      outputs: [
        { id: "gs-v1", label: "Volume sob 1P", unit: "bi" },
        { id: "gs-v2", label: "Volume sob 2P", unit: "bi" },
        { id: "gs-v3", label: "Volume sob 3P", unit: "bi" },
        { id: "gs-am", label: "Amplitude entre critérios", unit: "%" },
        { id: "gs-rp", label: "R/P sobre o critério citado", unit: "anos" },
        { id: "gs-ir", label: "IRR do período", unit: "%" },
      ],
      note: "Informe um volume provado e as razões típicas entre critérios da sua carteira. O instrumento devolve a mesma jazida sob os três critérios lado a lado, calcula R/P e IRR, e se recusa a emitir veredito quando falta a data de certificação — porque um volume de reserva sem data de referência não é um número, é uma afirmação.",
    }
    ],
  },
  {
    id: "aula-15-03",
    moduleId: 'modulo-15',
    number: 3,
    totalInModule: 9,
    title: "A parcela do Estado",
    subtitle: "royalty não é participação especial, e nenhum dos dois é imposto",
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
    instruments: [
    {
      id: 'm15-inst-04',
      kind: 'calculadora',
      title: "Calculadora de parcela do Estado",
      formula: null,
      fields: [
        { id: "pe-vol-n", label: "Produção do campo", unit: "mil bbl/d", kind: "range", defaultValue: 180, min: 1, max: 1200, step: 1 },
        { id: "pe-pr-n", label: "Preço de referência", unit: "US$/bbl", kind: "range", defaultValue: 80.61, min: 20, max: 160, step: 0.01 },
        { id: "pe-cx-n", label: "Câmbio", unit: "R$/US$", kind: "range", defaultValue: 5.26, min: 2.5, max: 9, step: 0.01 },
        { id: "pe-al-n", label: "Alíquota de royalty", unit: "%", kind: "range", defaultValue: 10, min: 5, max: 15, step: 0.1 },
        { id: "pe-de-n", label: "Deduções sobre a receita bruta", unit: "% da receita", kind: "range", defaultValue: 45, min: 10, max: 90, step: 0.5 },
        { id: "pe-pa-n", label: "Alíquota de participação especial", unit: "%", kind: "range", defaultValue: 25, min: 0, max: 40, step: 0.5 },
        { id: "pe-rep", label: "Desenho de repartição aplicável", unit: null, kind: "select", defaultValue: "ter", options: [{"value":"ter","label":"Campo terrestre"},{"value":"mar","label":"Marítimo · comercialidade após 12/2012"},{"value":"pre","label":"Marítimo no polígono · comercialidade anterior"}] },
      ],
      outputs: [
        { id: "pe-rb", label: "Receita bruta anual", unit: "bi" },
        { id: "pe-ry", label: "Royalty anual", unit: "bi" },
        { id: "pe-ps", label: "Participação especial anual", unit: "bi" },
        { id: "pe-tk", label: "Parcela do Estado sobre a receita", unit: "%" },
        { id: "pe-es", label: "Aos estados", unit: "bi" },
        { id: "pe-mu", label: "Aos municípios", unit: "bi" },
      ],
      note: "Todos os parâmetros são editáveis, inclusive as alíquotas — porque nenhum deles é constante e porque alíquota efetiva não é alíquota nominal. O instrumento devolve royalty e participação especial separadamente, e o veredito se recusa a ler a receita fiscal por um único sinal: precisa de volume, preço e câmbio ao mesmo tempo.",
    }
    ],
  },
  {
    id: "aula-15-04",
    moduleId: 'modulo-15',
    number: 4,
    totalInModule: 9,
    title: "\"Preço do petróleo\" não é um preço",
    subtitle: "seis camadas entre o reservatório e a bomba",
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
    instruments: [
    {
      id: 'm15-inst-05',
      kind: 'calculadora',
      title: "Decompositor de preço de combustível",
      formula: null,
      fields: [
        { id: "cb-p4-n", label: "Preço do produtor · camada 4", unit: "R$/litro", kind: "range", defaultValue: 3.1, min: 0.5, max: 6, step: 0.01 },
        { id: "cb-bi-n", label: "Biocombustível de mistura", unit: "R$/litro", kind: "range", defaultValue: 0.62, min: 0, max: 2, step: 0.01 },
        { id: "cb-tf-n", label: "Tributos federais", unit: "R$/litro", kind: "range", defaultValue: 0.42, min: 0, max: 2, step: 0.01 },
        { id: "cb-te-n", label: "Tributo estadual", unit: "R$/litro", kind: "range", defaultValue: 1.47, min: 0, max: 3, step: 0.01 },
        { id: "cb-dr-n", label: "Distribuição e revenda", unit: "R$/litro", kind: "range", defaultValue: 0.98, min: 0, max: 3, step: 0.01 },
        { id: "cb-sb-n", label: "Subvenção econômica", unit: "R$/litro · negativa", kind: "range", defaultValue: 0, min: 0, max: 1.2, step: 0.01 },
      ],
      outputs: [
        { id: "cb-tot", label: "Preço final estimado", unit: "/L" },
        { id: "cb-pp", label: "Parcela do produtor", unit: "%" },
        { id: "cb-ct", label: "Carga tributária total", unit: "%" },
        { id: "cb-pb", label: "Parcela de biocombustível", unit: "%" },
        { id: "cb-pd", label: "Parcela de distribuição e revenda", unit: "%" },
      ],
      note: "Cada camada é entrada editável, inclusive a subvenção — que entra com sinal negativo. O instrumento devolve a composição, a participação percentual de cada camada e um veredito que se recusa a atribuir a variação a uma única camada sem que você tenha mexido em uma só.",
    }
    ],
  },
  {
    id: "aula-15-05",
    moduleId: 'modulo-15',
    number: 5,
    totalInModule: 9,
    title: "Refino",
    subtitle: "por que o país exporta petróleo e importa derivado ao mesmo tempo",
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
    instruments: [
    {
      id: 'm15-inst-06',
      kind: 'calculadora',
      title: "Régua de refino · capacidade contra produto",
      formula: null,
      fields: [
        { id: "rf-cap-n", label: "Capacidade instalada", unit: "mil bpd", kind: "range", defaultValue: 1800, min: 200, max: 4000, step: 10 },
        { id: "rf-uti-n", label: "Fator de utilização", unit: "%", kind: "range", defaultValue: 86.4, min: 40, max: 100, step: 0.1 },
        { id: "rf-ren-n", label: "Rendimento em diesel", unit: "% da carga", kind: "range", defaultValue: 40, min: 10, max: 60, step: 0.5 },
        { id: "rf-dem-n", label: "Demanda nacional de diesel", unit: "mil bpd", kind: "range", defaultValue: 900, min: 100, max: 2000, step: 5 },
      ],
      outputs: [
        { id: "rf-cg", label: "Carga processada", unit: "mil bpd" },
        { id: "rf-di", label: "Diesel produzido", unit: "mil bpd" },
        { id: "rf-de", label: "Descompasso", unit: "mil bpd" },
        { id: "rf-oc", label: "Capacidade ociosa", unit: "mil bpd" },
        { id: "rf-c1", label: "Diesel se rodasse a 100%", unit: "mil bpd" },
        { id: "rf-rn", label: "Rendimento necessário para zerar", unit: "% da carga" },
      ],
      note: "Quatro entradas independentes. O instrumento devolve quanto de um produto específico o parque consegue entregar e onde fica o descompasso com a demanda — e o veredito separa as quatro causas possíveis do déficit em vez de atribuí-lo a \"falta de refinaria\".",
    }
    ],
  },
  {
    id: "aula-15-06",
    moduleId: 'modulo-15',
    number: 6,
    totalInModule: 9,
    title: "Gás natural",
    subtitle: "o preço quase nunca é preço de mercado",
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
    instruments: [
    {
      id: 'm15-inst-07',
      kind: 'simulador',
      title: "Régua de contrato de gás",
      formula: null,
      fields: [
        { id: "gc-mol-n", label: "Preço da molécula · contrato", unit: "US$/MMBtu", kind: "range", defaultValue: 8.5, min: 2, max: 30, step: 0.01 },
        { id: "gc-tra-n", label: "Custo de transporte", unit: "US$/MMBtu", kind: "range", defaultValue: 1.6, min: 0, max: 12, step: 0.01 },
        { id: "gc-dis-n", label: "Margem de distribuição e tributos", unit: "US$/MMBtu", kind: "range", defaultValue: 3.2, min: 0, max: 15, step: 0.01 },
        { id: "gc-top-n", label: "Retirada mínima contratada", unit: "% do volume", kind: "range", defaultValue: 80, min: 0, max: 100, step: 1 },
        { id: "gc-ret-n", label: "Volume efetivamente retirado", unit: "% do contratado", kind: "range", defaultValue: 65, min: 0, max: 120, step: 1 },
        { id: "gc-spo-n", label: "Referência de mercado do dia", unit: "US$/MMBtu", kind: "range", defaultValue: 6, min: 1, max: 40, step: 0.01 },
        { id: "gc-cam", label: "Camada em que o custo está sendo lido", unit: null, kind: "select", defaultValue: "mol", options: [{"value":"mol","label":"Molécula na saída do processamento"},{"value":"cty","label":"Entregue no city gate"},{"value":"ind","label":"Final ao consumidor industrial"}] },
      ],
      outputs: [
        { id: "gc-nom", label: "Custo nominal da camada", unit: "/MMBtu" },
        { id: "gc-vf", label: "Volume faturado", unit: "% do contratado" },
        { id: "gc-ef", label: "Custo efetivo por unidade consumida", unit: "/MMBtu" },
        { id: "gc-sc", label: "Sobrecusto da retirada mínima", unit: "/MMBtu" },
        { id: "gc-dt", label: "Distância da referência do dia", unit: "% vs. referência" },
      ],
      note: "O instrumento separa a molécula do transporte, aplica a retirada mínima sobre o volume efetivamente consumido e devolve o custo efetivo entregue — que é o número que importa e que quase nunca é o número citado. A comparação com o preço de referência do dia serve para mostrar de quanto é a distância, não para sugerir que o contrato deveria acompanhá-lo.",
    }
    ],
  },
  {
    id: "aula-15-07",
    moduleId: 'modulo-15',
    number: 7,
    totalInModule: 9,
    title: "GNL e o Novo Mercado de Gás",
    subtitle: "o que a reforma abriu e o que ainda depende de norma",
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
    instruments: [
    {
      id: 'm15-inst-08',
      kind: 'explorador',
      title: "Classificador de elo",
      formula: null,
      fields: [
        { id: "cl-gr", label: "Grandeza citada", unit: null, kind: "select", defaultValue: "po", options: [{"value":"po","label":"Produção de petróleo"},{"value":"pg","label":"Produção de gás"},{"value":"rs","label":"Reserva"},{"value":"cp","label":"Capacidade"},{"value":"pr","label":"Preço"},{"value":"cv","label":"Custo variável"}] },
        { id: "cl-el", label: "Elo ao qual foi atribuída", unit: null, kind: "select", defaultValue: "ca", options: [{"value":"ca","label":"Campo"},{"value":"ep","label":"Escoamento e processamento"},{"value":"tr","label":"Transporte"},{"value":"di","label":"Distribuição"},{"value":"ut","label":"Termelétrica"}] },
      ],
      outputs: [

      ],
      note: "Escolha a grandeza citada e o elo em que alguém a atribuiu. O instrumento devolve se a combinação se aplica, qual regime e qual órgão a governam, e o que aquele número não diz. Quando a combinação não se aplica, ele diz por que não e onde aquela grandeza de fato mora — porque atribuir a grandeza ao elo errado é um erro tão comum quanto errar o número.",
    }
    ],
  },
  {
    id: "aula-15-08",
    moduleId: 'modulo-15',
    number: 8,
    totalInModule: 9,
    title: "Do contrato de gás ao preço da eletricidade",
    subtitle: "e por que a térmica despacha sem sinal econômico",
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
    instruments: [
    {
      id: 'm15-inst-09',
      kind: 'simulador',
      title: "Simulador de acoplamento gás → despacho",
      formula: null,
      fields: [
        { id: "ac-gas-n", label: "Gás entregue à usina", unit: "US$/MMBtu", kind: "range", defaultValue: 9, min: 2, max: 30, step: 0.01 },
        { id: "ac-cx-n", label: "Câmbio", unit: "R$/US$", kind: "range", defaultValue: 5.4, min: 2.5, max: 9, step: 0.01 },
        { id: "ac-hr-n", label: "Consumo específico", unit: "MMBtu/MWh", kind: "range", defaultValue: 7.1, min: 5.5, max: 14, step: 0.01 },
        { id: "ac-om-n", label: "O&amp;M variável e encargos", unit: "R$/MWh", kind: "range", defaultValue: 58, min: 0, max: 200, step: 1 },
        { id: "ac-cmo-n", label: "Custo marginal de operação", unit: "R$/MWh", kind: "range", defaultValue: 330, min: 20, max: 1200, step: 1 },
        { id: "ac-inf-n", label: "Inflexibilidade declarada", unit: "% da capacidade", kind: "range", defaultValue: 40, min: 0, max: 100, step: 1 },
      ],
      outputs: [
        { id: "ac-cc", label: "Custo de combustível", unit: "/MWh" },
        { id: "ac-cvu", label: "CVU simplificado", unit: "/MWh" },
        { id: "ac-ef", label: "Eficiência implícita", unit: "%" },
        { id: "ac-gs", label: "Geração sem sinal econômico", unit: "% da capacidade" },
        { id: "ac-gb", label: "Preço do gás que zeraria a distância", unit: "/MMBtu" },
      ],
      note: "Monte o CVU a partir do gás entregue e veja onde a usina cai na ordem de despacho. O veredito nunca conclui por um único sinal: ele exige a posição relativa ao custo marginal e o patamar de inflexibilidade declarada, porque uma usina pode estar gerando com CVU altíssimo e outra pode estar parada com CVU baixo.",
    }
    ],
  },
  {
    id: "aula-15-09",
    moduleId: 'modulo-15',
    number: 9,
    totalInModule: 9,
    title: "Ler um número ponta a ponta, e o dilema apresentado pelos dois lados",
    subtitle: "",
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
    instruments: [
    {
      id: 'm15-inst-10',
      kind: 'explorador',
      title: "Verificador de regime e de camada · instrumento assinatura",
      formula: null,
      fields: [
        { id: "vf-flt", label: "Filtrar por tipo de defeito", unit: null, kind: "select", defaultValue: "all", options: [{"value":"all","label":"Todos"},{"value":"rg","label":"Regime não declarado"},{"value":"cm","label":"Camada confundida"},{"value":"gr","label":"Grandeza confundida"},{"value":"ac","label":"Acoplamento omitido"}] },
        { id: "vf-en", label: "Enunciado", unit: null, kind: "select", defaultValue: "e01", options: [{"value":"e01","label":"Receita por participação"},{"value":"e02","label":"Soma de áreas produtoras"},{"value":"e03","label":"Localização não define regime"},{"value":"e04","label":"Dois preços de gás"},{"value":"e05","label":"Reajuste e bomba"},{"value":"e06","label":"Referência e receita"},{"value":"e07","label":"Reserva vira anos"},{"value":"e08","label":"Produção vira oferta"},{"value":"e09","label":"Reposição vira descoberta"},{"value":"e10","label":"Despacho vira preço de gás"},{"value":"e11","label":"Queda internacional vira alívio"},{"value":"e12","label":"Eficiência vira competitividade"}] },
      ],
      outputs: [

      ],
      note: "Doze enunciados, todos verdadeiros e insuficientes. Nenhum contém erro factual; todos omitem algo que muda a conclusão. Identifique o defeito dominante, e compare com o diagnóstico. Use o filtro para treinar uma categoria por vez.",
    }
    ],
  },
];

/** Instrumento de MÓDULO — o `Inst · 01` do § MAP, fora de qualquer
 *  aula. Mesmo tratamento do `LAB · 01` do M01 e dos `Inst · 01` dos
 *  Módulos 06, 07 e 10: destino é Recursos do Módulo. */
export const MODULO_15_INSTRUMENTOS: Instrument[] = [
  {
    id: 'm15-inst-01',
    kind: 'explorador',
    title: "Mapa da cadeia · quatro reagrupamentos",
    formula: null,
    fields: [
      { id: "mp-dim", label: "Agrupar por", unit: null, kind: "select", defaultValue: "seg", options: [{"value":"seg","label":"Segmento"},{"value":"reg","label":"Regime jurídico"},{"value":"ac","label":"Acoplamento elétrico"},{"value":"pr","label":"Natureza do preço"}] },
      { id: "mp-elo", label: "Elo da cadeia", unit: null, kind: "select", defaultValue: "campo", options: [{"value":"campo","label":"Campo produtor"},{"value":"medicao","label":"Ponto de medição fiscal"},{"value":"escoamento","label":"Gasoduto de escoamento"},{"value":"upgn","label":"Unidade de processamento"},{"value":"transporte","label":"Gasoduto de transporte"},{"value":"gnl","label":"Terminal de regaseificação"},{"value":"refino","label":"Refinaria"},{"value":"distribuicao","label":"Distribuidora estadual de gás"},{"value":"ute","label":"Termelétrica a gás"}] },
    ],
    outputs: [

    ],
    note: "Escolha a dimensão de agrupamento. Os nove elos são sempre os mesmos; o que muda é a pergunta. Clique em um elo para abrir a ficha resumida — regime, órgão competente, grandeza medida, natureza do preço e o que aquele número não diz.",
  },
];
