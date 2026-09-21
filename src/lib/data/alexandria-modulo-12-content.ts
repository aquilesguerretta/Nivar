// alexandria-modulo-12-content.ts
// Bloco 12 — Geopolítica Energética do Brasil. Nível 2, track 'brasil'.
// SÉTIMO e último módulo da Trilha 2 — a peça que fecha a trilha.
//
// CATÁLOGO CONFIRMADO por leitura de `alexandria-blocks.ts`:
// { id: 'bloco-12', level: 2, track: 'brasil', illustrationPrefix: 'geo-',
//   priority: 'alta', estimatedHours: 4-5 }.
//
// TÍTULO CONFERE COM A FONTE. O `<h1>` do HTML é literalmente
// "Geopolítica Energética do Brasil" — o mesmo do catálogo. Conferido
// porque título de bloco já divergiu duas vezes (Módulos 06 e 11), mas
// aqueles são `priority: 'confirmar'`; este é `'alta'` e bate.
//
// EXTRAÍDO de `Alexandria modulos/alexandria_modulo12.html` — 338.846
// bytes: 238.713 de markup e 100.133 de script.
//
// ── VOCABULÁRIO MEDIDO ────────────────────────────────────────
// Os oito seletores dos Módulos 01-03 dão ZERO. Vocabulário abreviado
// dos 04+: `sec-id` 18, `lede` 17, `inst` 11, `det-bd` 22, `box` 24.
//
// ── CONTAGEM ──────────────────────────────────────────────────
// 18 seções = 8 aulas + 10 de aparato. 148 blocos de apostila. §Ex com
// 14 <details>; §Lex com 152 `.term`.
//
// Prosa e markup CONCORDAM: o §08.1 diz "Sete aulas sobre fluxo de
// capital estrangeiro" e a Aula 08 abre com "As sete aulas anteriores
// entregaram material" — sete de conteúdo mais a síntese, oito no
// total. "Oito movimentos" é o instrumento, não contagem de aula.
//
// ── COBERTURA DE TEXTO — três estruturas novas ────────────────
// Com o extrator herdado da Wave 41 a cobertura media 68,8% a 94,3%,
// com DUAS aulas abaixo de 85% e outras duas na borda. O diagnóstico
// por elemento-folha achou três estruturas que este módulo estreia:
//
//   `div.gcmp`  — grade de comparação `gk`/`gv` (rótulo + prosa),
//                 1.019 chars na Aula 03.
//   `div.tax`   — taxonomia numerada `tax-n`/`tax-b` com selo de status
//                 `.st`, seis categorias, 1.693 chars na Aula 08.
//   `div.dual`  — cartões de dado `dk`/`dv`/`dm` (rótulo, número
//                 grande, descrição), 933 chars entre as Aulas 01 e 07.
//
// As três viram `nota` (label + html), NÃO `tabela`. A razão é do
// renderizador: `Tabela` em `ApostilaPanel` trata a PRIMEIRA linha como
// `<thead>`, então usar tabela aqui consumiria um par de dado real como
// cabeçalho — ou exigiria inventar um cabeçalho que a fonte não tem.
// `nota` é exatamente o que modela rótulo mais prosa.
//
// PENDÊNCIA REGISTRADA, não corrigida aqui: as tabelas chave/valor dos
// Módulos 08, 09 e 10 (`src-card`, `fi`) têm esse mesmo efeito — o
// primeiro par renderiza como cabeçalho. Não há perda de texto, só de
// hierarquia visual. Corrigir é wave própria; aqueles arquivos não são
// posse desta.
//
// Cobertura final: 91,7% a 94,3% nas OITO, zero abaixo de 85%.
//
//   aula 1  92,7%   aula 4  94,3%   aula 7  94,0%
//   aula 2  93,2%   aula 5  93,3%   aula 8  93,1%
//   aula 3  91,7%   aula 6  93,1%
//
// ── INSTRUMENTO: ONZE, dez de aula ────────────────────────────
// O `Inst · 01` vive no § MAP, fora de aula — mesmo tratamento do
// `LAB · 01` (M01) e dos `Inst · 01` dos M06, M07 e M10. As Aulas 01 e
// 08 têm DOIS cada. `kind` decidido pela MECÂNICA: explorador 5 ·
// calculadora 2 · comparador 1 · quebra-cabeca 3.
//
// ── GRAVURA: 5 de 10, por leitura de frase ────────────────────
//   A1 geo-05-canavial-colheitadeira — §01.4 "Etanol: protagonismo
//      real, com o segundo lugar dito por extenso".
//   A2 geo-08-globo-terrestre        — a aula É "COP30 e o ciclo
//      climático".
//   A3 geo-10-painel-solar-container — "Camada 2 · Cadeia de
//      equipamento", subseção declarada sobre módulo fotovoltaico.
//   A6 geo-07-cilindro-hidrogenio    — "O hidrogênio é o tema deste
//      bloco".
//   A7 geo-06-amostras-minerio       — a aula É "Minerais críticos e
//      estratégicos".
//
// CINCO não mapeadas, e DUAS delas são falso positivo novo para a série
// do protocolo, que passa de dez para doze:
//   `geo-01-plataforma-petroleo` — os hits de "plataforma" são
//      "posicionamento da plataforma" (analítica) e "plataformas de
//      dados estrangeiras". "pré-sal" dá ZERO no módulo inteiro, e
//      "petróleo" aparece como unidade de medida (tep), fatia da matriz
//      e classe tarifária — nunca a plataforma como assunto.
//   `geo-09-arvore-amazonia` — "desmatamento" aparece como TEMA DE
//      NEGOCIAÇÃO (ausência de linguagem no texto da COP30, item
//      acionável da investigação americana, exigência de
//      rastreabilidade europeia). Nenhuma aula trata a floresta como
//      assunto.
// As outras três: `geo-02-navio-cargueiro` e `geo-04-gasoduto` com zero
// ocorrência; `geo-03-porto-guindastes` com dois hits incidentais.
//
// ── EXERCÍCIO: 14, TODOS SOLTOS ───────────────────────────────
// A varredura por /[Aa]ula\s*\d+/ no enunciado E no gabarito dos
// catorze devolve ZERO. Padrão desde o Módulo 04.
//
// ── video: null, MEDIDO ───────────────────────────────────────
// Zero <video>, <iframe>, youtube, vimeo, .mp4, <audio>.

import type { CurriculumAula, Instrument, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';

export const MODULO_12_LEAD: Record<string, string> = {
  'aula-12-01': "A frase mais repetida sobre energia no Brasil é também a mais mal citada. \"O Brasil tem quase noventa por cento de energia renovável\" é verdadeira e falsa ao mesmo tempo, e o que decide qual das duas é a palavra que quase nunca vem junto: se a grandeza é matriz elétrica ou matriz energética . São duas contas diferentes, com dois denominadores diferentes, e a diferença entre elas é de quase quarenta pontos percentuais — grande o bastante para inverter completamente a conclusão de uma conversa.",
  'aula-12-02': "A COP30 aconteceu. Isso precisa ser dito de saída porque boa parte do material disponível sobre geopolítica energética brasileira ainda foi escrito quando ela era evento futuro, e trata a conferência como algo a se preparar em vez de resultado a relatar. Ela ocorreu em Belém, de 10 a 22 de novembro de 2025, e produziu um resultado formal que precisa ser contado com as duas metades: o que entrou no consenso e o que não entrou.",
  'aula-12-03': "A relação energética entre Brasil e China é a mais densa que o país mantém, e a mais fácil de descrever mal. Descrevê-la como ameaça é ignorar que ela financiou expansão de infraestrutura que ninguém mais quis financiar e barateou equipamento que viabilizou o boom solar do Módulo 11. Descrevê-la como parceria sem atrito é ignorar que ela concentra, em um único país, simultaneamente o comprador de commodity, o fornecedor de equipamento e o investidor de infraestrutura. A leitura correta separa complementaridade de concentração — são coisas diferentes, e só a segunda é risco.",
  'aula-12-04': "A relação energética com os Estados Unidos é, em 2026, o objeto mais rápido de mudar em todo este currículo — mais rápido que qualquer cronograma regulatório brasileiro, que muda uma vez por ano. Ela mudou de configuração pelo menos quatro vezes entre julho de 2025 e julho de 2026, e é razoável esperar que mude de novo antes de você terminar de ler esta aula. Por isso, a aula ensina mecanismo e taxonomia de instrumento , que não envelhecem, e isola os valores pontuais em callout datado.",
  'aula-12-05': "A União Europeia se relaciona com o Brasil em energia por três canais simultâneos — comprador, financiador e regulador — e o terceiro é o mais subestimado. A Europa exporta padrão . Regra de carbono na fronteira, exigência de rastreabilidade de desmatamento, critério de certificação de hidrogênio, diligência de cadeia de suprimento: são normas europeias que produzem efeito sobre a operação de uma indústria brasileira que nunca pisou na Europa. Entender isso muda a natureza da conversa: com a Europa, o item negociado não é preço, é metodologia .",
  'aula-12-06': "O hidrogênio é o tema deste bloco em que a distinção entre lei existente e regime operacional existente tem consequência financeira imediata e mensurável. O Brasil tem, desde 2024, dois marcos legais sancionados que criam política, sistema de certificação, regime de incentivo e programa de crédito fiscal bilionário. Nenhum deles opera plenamente sem decreto regulamentador. Na data de verificação deste módulo, esse decreto ainda não havia sido publicado — dois anos depois da primeira lei, e mais de oito meses depois de o governo anunciar que a assinatura ocorreria \"na próxima semana\".",
  'aula-12-07': "Esta aula contém o paradoxo deste bloco em miniatura, e por isso ela fecha a sequência temática. O Brasil detém uma das maiores dotações mundiais de minerais considerados críticos para a transição energética e responde por uma fração desprezível da produção mundial deles. A distância entre esses dois números não é um detalhe de execução — é a definição operacional do vetor cadeia de valor , e é o que o país está tentando fechar com uma política que, na data de verificação, ainda não é lei.",
  'aula-12-08': "As sete aulas anteriores entregaram material. Esta entrega ordem . A diferença entre saber os fatos e sustentar meia hora de conversa não está na quantidade de informação — está em ter uma sequência de movimentos em que cada um responde a uma pergunta diferente e prepara o seguinte, de modo que nunca seja necessário voltar ao mesmo ponto duas vezes. Antes do andaime, porém, duas ferramentas de higiene: uma sobre que nomes podem entrar num ativo publicado, e outra sobre a favor de quem cada narrativa geopolítica foi construída.",
};

/** 148 blocos nas oito aulas, na ordem do documento. */
export const MODULO_12_CORPO: Record<string, AulaBloco[]> = {
  'aula-12-01': [
      { kind: 'titulo', numero: "01.1", texto: "Dois denominadores, duas contas, uma confusão previsível" },
      { kind: 'paragrafo', html: "A <b>matriz elétrica</b> mede apenas a eletricidade. O denominador é a Oferta Interna de Energia Elétrica: tudo que foi gerado no país mais o que foi importado, medido em terawatt-hora. Nessa conta, o Brasil é excepcional pelos padrões mundiais, e é dessa conta que vêm todos os números de liderança." },
      { kind: 'paragrafo', html: "A <b>matriz energética</b> mede toda a energia consumida no país, em qualquer forma. O denominador é a Oferta Interna de Energia, medida em tonelada equivalente de petróleo, e inclui o diesel do caminhão, o combustível do avião, o gás da indústria química, o coque da siderurgia e o calor de processo — além da eletricidade. Nessa conta o Brasil continua muito acima da média mundial, mas o número cai pela metade, porque a eletricidade é apenas uma fatia da energia que uma economia consome." },
      { kind: 'nota', tom: "neutro", label: "Matriz elétrica · 2025", html: "<b>86,8 %</b> Participação de fontes renováveis na Oferta Interna de Energia Elétrica. Era 88,2% em 2024. A queda veio da redução de 4,8% na geração hidrelétrica combinada com alta de 12,3% na geração térmica." },
      { kind: 'nota', tom: "neutro", label: "Matriz energética · 2025", html: "<b>~50 %</b> Participação de fontes renováveis na Oferta Interna de Energia total, de 327,9 milhões de toneladas equivalentes de petróleo. Petróleo e derivados sozinhos respondem por 33,7%; gás natural por 10,4%." },
      { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Fonte primária das duas grandezas: <b>Balanço Energético Nacional 2026, ano-base 2025</b>, Empresa de Pesquisa Energética e Ministério de Minas e Energia, Relatório Síntese publicado em junho de 2026. Consulta em 2 de agosto de 2026. A EPE publica o Balanço anualmente, ao final do primeiro semestre, sempre com o ano anterior como base. <b>O percentual pontual muda todo ano — e mudou 1,4 ponto para baixo entre o ano-base 2024 e o ano-base 2025.</b> Se você citar \"88%\" em agosto de 2026, estará citando um dado de dois anos antes sem dizer isso. Verifique o ano-base antes de repetir qualquer um dos dois números." },
      { kind: 'paragrafo', html: "A armadilha é exatamente a mesma que os Módulos 10 e 11 já ensinaram em outras roupas — confundir demanda com energia na fatura, confundir microgeração com minigeração no enquadramento. É sempre o mesmo erro estrutural: <b>duas grandezas com nomes parecidos, unidades diferentes e denominadores diferentes, citadas como se fossem uma só</b>. A defesa também é sempre a mesma: antes de aceitar ou repetir um percentual, pergunte qual é o denominador." },
      { kind: 'titulo', numero: "01.2", texto: "\"Líder do G20\": de onde vem esse ranking, e por que não é dado brasileiro" },
      { kind: 'paragrafo', html: "O percentual da matriz elétrica é dado oficial brasileiro. O <b>ranking</b> não é. Nenhum órgão brasileiro produz uma classificação comparativa dos países do G20 por renovabilidade elétrica, porque nenhum órgão brasileiro tem mandato para medir a matriz dos outros dezenove. Esse ranking vem de análise de um instituto internacional de pesquisa em energia, que recalcula todas as matrizes nacionais sob uma metodologia única para que a comparação seja possível." },
      { kind: 'paragrafo', html: "A distinção é operacional, não acadêmica. Quando você diz \"86,8%\", a fonte é a EPE e o interlocutor pode conferir no Balanço. Quando você diz \"maior do G20\", a fonte é outra, a metodologia é outra, e o número associado será ligeiramente diferente — na medição desse instituto, o Brasil aparece com 87% em 2025, 87% em 2024 e 89% em 2023. As diferenças de décimo vêm de fronteira contábil: o dado brasileiro parte da oferta interna de energia elétrica, incluindo importação; a medição internacional parte da geração. <b>Duas fontes respeitáveis, duas metodologias, dois números que não batem exatamente — e citar os dois com a fonte de cada um é mais forte do que escolher o mais favorável</b>, porque quem escolhe o mais favorável perde a conversa no instante em que o interlocutor conhece o outro." },
      { kind: 'paragrafo', html: "Dois fatos adicionais dessa mesma medição internacional, ambos de 2025 e ambos úteis em conversa: o Brasil dependeu de combustíveis fósseis para apenas cerca de 11% da sua eletricidade, e foi o segundo maior gerador hidrelétrico do mundo. As emissões do setor elétrico brasileiro atingiram o pico em 2014 e caíram desde então, apesar do crescimento da demanda — o que é o argumento mais forte disponível, porque é raro: a maioria das economias emergentes cresceu emissões elétricas na mesma década." },
      { kind: 'titulo', numero: "01.3", texto: "O erro do currículo que este módulo corrige: aquífero não gera eletricidade" },
      { kind: 'paragrafo', html: "Uma associação circula com frequência suficiente para merecer correção explícita: a de que as \"reservas hídricas estratégicas\" do Brasil, e em particular o Aquífero Guarani, seriam um ativo de geração elétrica. Não são. O Aquífero Guarani é uma reserva de água <b>subterrânea</b> transfronteiriça, compartilhada com Argentina, Paraguai e Uruguai, relevante para abastecimento humano, irrigação e cooperação regional — sem relação direta com geração hidrelétrica." },
      { kind: 'paragrafo', html: "A geração hidrelétrica brasileira depende de hidrologia de <b>superfície</b>: as bacias do São Francisco, Tocantins-Araguaia, Paraná e Madeira, com seus reservatórios, suas vazões e sua variabilidade climática. Confundir as duas coisas custa caro numa conversa técnica, porque revela que a pessoa está repetindo uma lista de ativos sem entender o mecanismo de cada um. Quando o recurso hídrico aparecer como vetor de protagonismo — e ele aparece, legitimamente — o referente correto são as bacias de superfície, não o aquífero." },
      { kind: 'paragrafo', html: "Água, porém, é infraestrutura energética por outros caminhos, e vale conhecê-los: ela resfria processo industrial, produz vapor, entra em mineração e refino, e é insumo direto da eletrólise para produção de hidrogênio, onde precisa ter alta pureza. Em contexto de seca, água deixa de ser variável elétrica e vira variável federativa: energia passa a competir com abastecimento, navegação, irrigação e ecossistema, e a decisão sai da mesa do operador do sistema." },
      { kind: 'titulo', numero: "01.4", texto: "Etanol: protagonismo real, com o segundo lugar dito por extenso" },
      { kind: 'paragrafo', html: "O Brasil é o <b>segundo</b> maior produtor mundial de etanol, atrás dos Estados Unidos. O dado tem duas leituras que precisam andar juntas. A primeira é de escala: 35,9 bilhões de litros produzidos em 2025, com mistura obrigatória de 30% de etanol anidro na gasolina desde agosto de 2025 e 15% de biodiesel no diesel a partir da mesma data. A segunda é de composição e vale mais: o etanol de <b>milho</b> chegou a 25% de toda a produção brasileira de etanol em 2025 — uma mudança estrutural de matéria-prima que reposiciona o Centro-Oeste dentro de uma indústria historicamente canavieira." },
      { kind: 'paragrafo', html: "Este módulo não desenvolve etanol além disso. Mistura obrigatória, mercado de crédito de descarbonização, biodiesel e a estrutura industrial do setor pertencem a outro bloco. Aqui, o etanol entra por dois motivos exclusivos: é fato de protagonismo global, e é o setor energético brasileiro que <b>foi atingido</b> pela medida comercial americana de 2026, enquanto os produtos energéticos em geral foram isentados — um contraste que a Aula 04 desenvolve e que é, em si, um dos fatos mais reveladores deste bloco." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "A separação entre matriz elétrica e matriz energética é o primeiro item de vocabulário controlado da camada de Geopolítica e Futuro da <b>Alexandria</b> — o nível mais avançado da biblioteca. Um artigo que cite \"88% renovável\" sem qualificar a grandeza e sem declarar o ano-base é indistinguível de conteúdo promocional, e é exatamente essa indistinção que a Alexandria existe para desfazer. A capacidade analítica construída aqui é a de <b>ler um percentual e reconstruir o denominador</b> antes de aceitá-lo — sem depender de quem publicou o número." },
  ],
  'aula-12-02': [
      { kind: 'titulo', numero: "02.1", texto: "O Pacote de Belém, com as duas metades" },
      { kind: 'paragrafo', html: "Cerca de 195 partes aprovaram por consenso o conjunto de decisões que ficou conhecido como <b>Pacote de Belém</b>: 29 documentos cobrindo transição justa, financiamento de adaptação, comércio, gênero e tecnologia. Entre as decisões concretas estão o compromisso de <b>triplicar o financiamento de adaptação até 2035</b>, a conclusão do Roteiro de Adaptação de Baku estabelecendo o trabalho para o período de 2026 a 2028, e um conjunto de 59 indicadores voluntários para monitorar progresso na Meta Global de Adaptação. A presidência brasileira apresentou ainda um conjunto de iniciativas paralelas, incluindo um mecanismo de financiamento para florestas tropicais e um acelerador voluntário de implementação conduzido em conjunto pelas presidências da COP30 e da COP31." },
      { kind: 'paragrafo', html: "A outra metade é igualmente factual e costuma ser omitida por quem conta a história do lado do protagonismo: <b>não houve consenso para incluir no texto final linguagem de eliminação de combustíveis fósseis, nem linguagem explícita de combate ao desmatamento</b>. A presidência brasileira respondeu à ausência criando, fora do texto de consenso, dois roteiros voluntários — um sobre o afastamento dos combustíveis fósseis e outro sobre desmatamento — a serem construídos ao longo de 2026. Um roteiro voluntário conduzido pela presidência e uma decisão aprovada por consenso das partes são <b>instrumentos de natureza jurídica e força política diferentes</b>, e tratá-los como equivalentes é o erro que um cientista político identifica em quinze segundos." },
      { kind: 'nota', tom: "neutro", label: "A pergunta que separa quem leu de quem ouviu falar", html: "Quando alguém afirma que \"a COP30 decidiu X\", a pergunta de verificação tem três camadas, e é a mesma disciplina de estado de vigência que os Módulos 07 a 11 já ensinaram para norma regulatória. <b>Primeira:</b> é decisão aprovada por consenso das partes, iniciativa voluntária de coalizão, ou anúncio da presidência? <b>Segunda:</b> se é decisão, ela cria obrigação, cria processo de trabalho, ou registra intenção? <b>Terceira:</b> quem executa, com que prazo, e o que acontece se não executar? Conferência produz texto; texto vira efeito por plano nacional, orçamento, regulamento e mensuração. Nenhuma dessas quatro etapas acontece automaticamente." },
      { kind: 'titulo', numero: "02.2", texto: "A presidência brasileira é vigente, e tem data para terminar" },
      { kind: 'paragrafo', html: "O Brasil não deixou de ser presidente da COP quando a conferência acabou. A presidência é exercida do encerramento de uma conferência até o início da seguinte, e portanto <b>segue vigente até novembro de 2026</b>. Isso é um fato datado, não uma narrativa aberta, e é a diferença entre dizer \"o Brasil lidera a agenda climática\" — afirmação sem prazo, difícil de sustentar — e dizer \"o Brasil exerce a presidência da Conferência até novembro de 2026, e o que fizer com esse mandato até lá é verificável\" — afirmação com começo, fim e critério." },
      { kind: 'paragrafo', html: "O calendário seguinte também já está definido, e conhecê-lo evita a pergunta constrangedora de \"e depois?\". A <b>COP31</b> ocorre em novembro de 2026, sediada pela Turquia, em Antália, com a Austrália conduzindo as negociações — um arranjo de sede dividida entre dois países que não tem precedente direto. A <b>COP32</b> está anunciada para a Etiópia, em 2027. A transição da presidência brasileira acontece na abertura da COP31." },
      { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "<b>Item de estado, não de número.</b> A presidência brasileira da COP era vigente na data de verificação deste módulo, 2 de agosto de 2026, e sua transferência estava prevista para novembro de 2026. Verifique o estado atual antes de afirmar qualquer coisa sobre ela: se você está lendo isto depois de novembro de 2026, a afirmação de vigência está errada e a frase correta passa a ser \"o Brasil exerceu a presidência da COP30 até novembro de 2026\". Fonte primária: registros e comunicados da Convenção-Quadro das Nações Unidas sobre Mudança do Clima, e comunicados da presidência da COP30." },
      { kind: 'titulo', numero: "02.3", texto: "A Contribuição Nacionalmente Determinada, e o inventário que ela precisa mover" },
      { kind: 'paragrafo', html: "A segunda Contribuição Nacionalmente Determinada brasileira foi submetida ao registro da Convenção-Quadro em 13 de novembro de 2024 e estabelece redução de emissões líquidas entre <b>59% e 67% até 2035</b> em relação a 2005 — uma faixa, não um ponto, cobrindo todos os setores da economia. Três leituras precisam acompanhar esse número sempre que ele for citado." },
      { kind: 'paragrafo', html: "A primeira: é <b>compromisso</b>, não previsão. Uma Contribuição Nacionalmente Determinada é uma meta assumida perante a Convenção, e a diferença entre meta e projeção é a mesma que existe entre o que se pretende e o que se espera. Confundir as duas é o erro que transforma uma conversa técnica em discussão sobre credibilidade." },
      { kind: 'paragrafo', html: "A segunda: o inventário brasileiro tem uma composição incomum. Na maioria das economias, o setor de energia domina as emissões, e descarbonizar eletricidade resolve boa parte do problema. No Brasil, <b>mudança de uso da terra e agropecuária têm peso elevado</b> — o que significa que a vantagem da matriz elétrica limpa, por maior que seja, não compensa automaticamente desmatamento. Esse é o ponto mais frequentemente mal compreendido por interlocutor estrangeiro que projeta o inventário do próprio país sobre o brasileiro, e corrigi-lo com naturalidade é uma demonstração de domínio." },
      { kind: 'paragrafo', html: "A terceira: dentro do próprio setor de energia, as emissões brasileiras somaram 440,2 milhões de toneladas de dióxido de carbono equivalente em 2025, e a maior parcela — 220,8 milhões de toneladas, praticamente metade — veio de <b>transportes</b>, não de geração elétrica. O fator médio de emissão da eletricidade brasileira foi de 64,8 quilogramas de CO₂ equivalente por megawatt-hora no mesmo ano. A conclusão operacional é direta e vale para qualquer conversa sobre descarbonização industrial no Brasil: <b>eletrificar processo é o maior salto de descarbonização disponível ao país</b>, precisamente porque a eletricidade que substituiria o combustível já é limpa." },
      { kind: 'titulo', numero: "02.4", texto: "O ciclo regulatório doméstico que a COP acelerou, e que não terminou" },
      { kind: 'paragrafo', html: "O ciclo climático não se resolve em conferência. Ele desce para norma doméstica, e é aí que a leitura fica interessante — porque o estado dessas normas, em agosto de 2026, é consistentemente o mesmo: <b>lei existe, regulamento não</b>. A Lei nº 15.042, de 11 de dezembro de 2024, instituiu o Sistema Brasileiro de Comércio de Emissões, um mecanismo de teto e comércio inspirado no modelo europeu. A lei está em vigor; a regulamentação infralegal que define alocação, fases, registro e fiscalização seguia em construção na data de verificação, com previsão oficial de conclusão até o fim de 2026 e início do mercado regulado previsto para o início da década de 2030." },
      { kind: 'paragrafo', html: "Isso importa para uma empresa exportadora por uma razão concreta que a Aula 05 desenvolve: o mecanismo europeu de ajuste de carbono na fronteira prevê desconto do preço de carbono já pago no país de origem <b>quando existe mercado regulado equivalente</b>. Enquanto o sistema brasileiro não estiver operando, esse desconto não existe na prática. A ligação entre uma lei brasileira sem regulamento e o custo de exportar aço para a Europa é direta, e é o tipo de cadeia causal que separa análise de comentário." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "A régua de estado é a espinha funcional do <b>Regulatory Radar</b> — o produto de acompanhamento regulatório da GridAlpha, que cobre autoridades brasileiras e também internacionais. O que um radar regulatório entrega não é a notícia de que uma lei foi sancionada: isso a imprensa já entrega, e mais rápido. O que ele entrega é o <b>estado</b> — sancionada mas sem regulamento, aprovada em uma Casa mas não na outra, em vigor mas com período de transição, revogada mas com direito adquirido para quem já iniciou. Essa é a informação que muda decisão de investimento, e é a que ninguém consolida." },
  ],
  'aula-12-03': [
      { kind: 'titulo', numero: "03.1", texto: "A estrutura, sem nome próprio" },
      { kind: 'paragrafo', html: "Antes de qualquer análise, uma nota de método que vale para esta aula e para as três seguintes. Este módulo descreve capital estrangeiro <b>por estrutura</b>, não por nome de empresa. Isso não é timidez: é a condição da independência analítica. Um ativo que nomeia fabricantes e investidores estrangeiros está, na prática, distribuindo visibilidade de marca — positiva ou negativa, tanto faz — e a Aula 08 explica por que isso é incompatível com o posicionamento da plataforma. A regra completa, com as seis categorias que decidem quando nomear é aceitável, está lá." },
      { kind: 'paragrafo', html: "A estrutura da presença chinesa no setor elétrico brasileiro tem três camadas distintas, que costumam ser tratadas como uma só e não são." },
      { kind: 'nota', tom: "neutro", label: "Camada 1 · Ativos regulados", html: "<b>Capital estatal chinês controla ativos de transmissão e uma das maiores distribuidoras do país</b>, adquiridos em operações de mercado ao longo da última década. São participações majoritárias em concessionárias submetidas à regulação brasileira, com receita definida em revisão tarifária. Duas estatais chinesas <em>distintas</em> operam no Brasil, em segmentos diferentes: uma com foco em transmissão e distribuição, outra em geração hidrelétrica. Confundi-las é erro factual comum, inclusive em material interno de estudo.Leitura de vetor capital: capital de longo prazo, tolerância a retorno regulado, horizonte de décadas. Difere estruturalmente de fundo privado, que tem prazo de saída." },
      { kind: 'nota', tom: "neutro", label: "Camada 2 · Cadeia de equipamento", html: "<b>Um pequeno número de fabricantes de grande escala concentra a cadeia global de módulo fotovoltaico, inversor e célula de bateria</b>, e a maior parte dessa capacidade está em um só país. A expansão solar brasileira dos últimos anos foi construída sobre equipamento importado dessa cadeia. Há montagem local de módulo, mas a etapa de célula — onde está o valor tecnológico — permanece majoritariamente externa.Leitura de vetor cadeia de valor: o Brasil comprou barato e instalou rápido. O preço disso é dependência de fornecimento numa etapa que ele não domina." },
      { kind: 'nota', tom: "neutro", label: "Camada 3 · Comércio e demanda", html: "<b>A China é o principal parceiro comercial do Brasil</b>, comprando minério de ferro, petróleo bruto, soja e outros produtos primários, e vendendo equipamento, máquina e eletrônico. Uma montadora chinesa de veículos elétricos instalou complexo industrial na Bahia. O padrão agregado da relação é <em>matéria-prima em troca de manufatura</em>, que é o padrão que o vetor cadeia de valor identifica como o problema estrutural brasileiro.Leitura de vetor regulação: a relação é comercial e de investimento, com plano bilateral de cooperação em mineração e energia. Não há condicionalidade climática embutida, ao contrário do capital europeu." },
      { kind: 'titulo', numero: "03.2", texto: "Onde está o risco, com precisão" },
      { kind: 'paragrafo', html: "Complementaridade é quando dois países têm o que o outro não tem, e trocam. Isso é bom para ambos, e é a descrição correta de boa parte dessa relação. <b>Concentração é quando uma cadeia inteira depende de um único fornecedor, comprador ou financiador</b>, e é isso — não a nacionalidade de ninguém — que constitui risco analítico. A pergunta que separa as duas é simples e não é retórica: <em>se essa fonte parasse por seis meses, existe alternativa a que preço e em que prazo?</em>" },
      { kind: 'paragrafo', html: "Aplicada às três camadas, essa pergunta produz respostas diferentes. Na camada de ativos regulados, o risco de interrupção é baixo — concessão é ativo imóvel sob regulação brasileira, e capital não sai de um dia para o outro. Na camada de equipamento, o risco é real e já se materializou em outros mercados: restrição comercial, controle de exportação ou choque de frete alteram preço e prazo de entrega de forma imediata. Na camada de comércio, o risco é de demanda: uma desaceleração do principal comprador reprecifica a pauta exportadora brasileira inteira, com efeito sobre câmbio e, por consequência, sobre custo de todo insumo importado." },
      { kind: 'paragrafo', html: "A conclusão operacional não é ruptura. É a mesma que o Módulo 09 já ensinou para alocação de risco contratual: <b>diversificar é criar alternativa, não abandonar fornecedor</b>. Um segundo fornecedor qualificado, mesmo que compre pouco dele, muda a posição de negociação com o primeiro. Isso vale para país exatamente como vale para comercializadora." },
      { kind: 'titulo', numero: null, texto: "Parceiro bilateral · China · Ficha de campo fixo · 1 de 4" },
      { kind: 'tabela', linhas: [["O que investe ou financia", "Capital estatal em ativos regulados de transmissão e distribuição, e em geração hidrelétrica. Capital privado e estatal em manufatura instalada no Brasil, incluindo complexo automotivo de veículos elétricos na Bahia. Crédito comercial vinculado a fornecimento de equipamento."], ["Em que segmento", "Transmissão, distribuição, geração, fabricação de equipamento e, crescentemente, mineração. Plano bilateral de cooperação no setor mineral em vigor."], ["Tensão ou fricção corrente", "Concentração de fornecimento de equipamento crítico em uma única origem; ausência de transferência de etapa tecnológica na maior parte dos acordos; discussão técnica — não ideológica — sobre governança regulatória e segurança cibernética de ativos de rede. Do lado externo, restrições americanas a \"entidade estrangeira de interesse\" afetam projetos que usem essa cadeia e queiram crédito fiscal nos Estados Unidos."], ["O que um número sobre esta relação precisa ter", "<b>Fonte, data e distinção entre fluxo e estoque.</b> \"Investimento chinês no Brasil\" pode significar o valor anunciado num ano (fluxo), o estoque acumulado de participações (estoque), ou o valor de aquisição de um ativo específico. Os três diferem por uma ordem de grandeza e são citados como se fossem o mesmo. Verifique também se o número é de investimento <em>confirmado</em> ou <em>anunciado</em>.Fonte primária recomendada: Banco Central do Brasil para estoque de investimento direto por país de origem; comunicados oficiais do Ministério das Relações Exteriores para atos assinados."], ["Gancho de produto", "Esta ficha é o esqueleto de conteúdo do <b>China Energy Watch</b>: cobertura editorial de mercados energéticos provinciais chineses, dinâmica de cadeia de suprimento, política industrial e investimento — sempre separando parceria comercial de dependência estratégica."]] },
      { kind: 'titulo', numero: "03.3", texto: "A pergunta que um cético faz, e a resposta que funciona" },
      { kind: 'paragrafo', html: "Em conversa real, a pergunta sobre a China quase nunca chega na forma \"qual é a sua opinião sobre a China\". Ela chega enviesada, e o viés depende de quem pergunta. Um investidor americano pergunta se a exposição chinesa da infraestrutura brasileira cria risco regulatório para o capital dele. Um investidor europeu pergunta se o Brasil vai conseguir certificar cadeia de suprimento sob padrões europeus usando equipamento dessa origem. Um cientista político pergunta se o Brasil tem autonomia real ou se está apenas trocando de dependência." },
      { kind: 'paragrafo', html: "As três perguntas têm a mesma estrutura de resposta, e ela tem três movimentos. <b>Primeiro</b>, reconheça o fato de concentração sem eufemismo — negá-lo destrói credibilidade e o interlocutor já sabe o número. <b>Segundo</b>, separe as camadas: risco de ativo regulado, risco de cadeia de equipamento e risco de demanda comercial são três coisas com prazos e mitigações diferentes, e tratá-las como uma só é o que produz pânico ou complacência. <b>Terceiro</b>, devolva a pergunta pelo vetor: qual dessas três exposições importa para a decisão de quem perguntou? Quase sempre é só uma, e nomear qual encerra a questão em vez de alongá-la." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "O <b>China Energy Watch</b> existe porque essa análise não está disponível em português com independência. O que circula é ou material promocional de quem quer vender equipamento dessa origem, ou material de alerta de quem tem interesse geopolítico em restringi-la. A capacidade analítica que este produto entrega é a de <b>separar camada de exposição</b> — regulada, de cadeia e comercial — e datar cada uma, para que um decisor industrial brasileiro saiba exatamente qual delas afeta a decisão que ele precisa tomar neste trimestre." },
  ],
  'aula-12-04': [
      { kind: 'titulo', numero: "04.1", texto: "A reviravolta doméstica americana, dita pelo nome certo" },
      { kind: 'paragrafo', html: "Um fato precisa ser corrigido de saída porque circula em versão suavizada: os incentivos fiscais americanos à energia limpa <b>não foram \"reorientados\"</b>. Eles foram substancialmente desmontados na parte que interessa a eólica e solar, por lei, com data." },
      { kind: 'paragrafo', html: "Em 4 de julho de 2025, foi sancionada nos Estados Unidos uma lei orçamentária que acelerou drasticamente a extinção dos créditos fiscais criados pela legislação climática de 2022. Os dois créditos centrais para geração elétrica limpa — o de produção e o de investimento, sob os artigos 45Y e 48E do código tributário — passaram a ser <b>extintos para projetos eólicos e solares que não iniciem obra até 4 de julho de 2026 ou não entrem em operação até 31 de dezembro de 2027</b>. O prazo de início de obra, portanto, venceu antes da data de verificação deste módulo. A mesma lei antecipou em cinco anos o fim do crédito ao hidrogênio limpo, encerrou o crédito de manufatura para componentes eólicos vendidos após o fim de 2027, e criou restrições de \"assistência material\" que desqualificam projetos cuja cadeia de suprimento dependa de entidades estrangeiras designadas — regra que mira, na prática, a cadeia de equipamento descrita na Aula 03." },
      { kind: 'paragrafo', html: "Duas ressalvas mantêm a descrição honesta. Primeira: tecnologias que não sejam eólica e solar — armazenamento, nuclear, geotérmica — mantiveram prazo de eliminação bem mais longo, a partir da metade da década de 2030. Segunda: a aplicação da regra de \"início de obra\" permaneceu em disputa judicial e administrativa ao longo de 2026, com decisão judicial de meados do ano restaurando um método de comprovação que a autoridade tributária havia restringido. <b>A lei é fato assentado; a sua aplicação é campo em movimento.</b>" },
      { kind: 'paragrafo', html: "Por que isso importa para o Brasil? Por duas razões, e nenhuma delas é a óbvia. A primeira é competição por capital: capital global de infraestrutura renovável que estava sendo alocado nos Estados Unidos por causa do incentivo precisa de destino, e países com recurso natural competitivo e regulação estável entram na lista curta. A segunda é competição por <b>equipamento</b>: uma desaceleração da instalação americana afrouxa demanda global por módulo e célula, com efeito sobre preço para todo comprador — inclusive o brasileiro." },
      { kind: 'titulo', numero: "04.2", texto: "A política comercial, descrita como mecanismo" },
      { kind: 'paragrafo', html: "Aqui é preciso um cuidado que nenhuma aula anterior deste currículo exigiu. O tema é genuinamente polarizado, e está amarrado a um processo judicial doméstico brasileiro controverso. <b>Este módulo descreve mecanismo, cronograma e setor afetado. Não avalia se o julgamento foi justo, se a medida foi proporcional, nem qual lado tem razão.</b> Isso não é uma regra nova: é a mesma neutralidade que o currículo inteiro já pratica sobre decisão de órgão regulador, aplicada pela primeira vez a um tema em que a tentação de opinar é maior." },
      { kind: 'paragrafo', html: "O que torna essa sequência analiticamente instrutiva — e é por isso que ela está aqui — é que ela demonstra, em um só caso, que <b>a base jurídica de uma medida comercial importa mais que o seu percentual</b>. Percentual é manchete; base jurídica determina duração, reversibilidade e escopo. Instrumentos diferentes têm autoridades diferentes, prazos diferentes e controles judiciais diferentes, e confundi-los produz previsões erradas." },
      { kind: 'paragrafo', html: "<b style=\"color:var(--gd)\">Julho de 2025</b> — o governo americano anuncia tarifa adicional sobre a maior parte dos produtos brasileiros, com base em lei de poderes econômicos de emergência, citando nominalmente um processo judicial doméstico brasileiro como motivo declarado. <b style=\"color:var(--gd)\">Agosto de 2025</b> — a medida entra em vigor com isenções expressas para energia, aeronaves civis, suco de laranja, ferro-gusa, celulose, fertilizantes e metais preciosos. Em paralelo, é aberta investigação sob a Seção 301 da Lei de Comércio de 1974 sobre seis categorias de práticas comerciais brasileiras. <b style=\"color:var(--gd)\">Fevereiro de 2026</b> — a Suprema Corte americana decide que aquela lei de emergência não autoriza a imposição de tarifas; a medida cai. O governo americano substitui parte do regime por tarifa global sob outro dispositivo, de duração limitada, e mantém as tarifas setoriais específicas de aço e alumínio, que têm base jurídica distinta e não foram atingidas. <b style=\"color:var(--gd)\">Junho de 2026</b> — a investigação da Seção 301 é concluída, com determinação de que práticas brasileiras em comércio digital, serviços de pagamento eletrônico, tarifas preferenciais, combate à corrupção, propriedade intelectual, acesso ao mercado de etanol e desmatamento ilegal são acionáveis. <b style=\"color:var(--gd)\">15 a 22 de julho de 2026</b> — publicada a ação final, impondo tarifa adicional de 25% sobre substancialmente todas as importações de origem brasileira, com vigência a partir de 22 de julho e regra de transição para carga já embarcada. A lista final de isenções, ampliada após audiência pública, exclui da sobretaxa mais de dois mil produtos, entre eles carne bovina, café, suco de laranja, aeronaves e componentes aeronáuticos, <b>produtos energéticos</b> e <b>terras-raras</b>. <b>Açúcar e etanol ficaram expostos.</b>" },
      { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "<b>Este é o item mais volátil do módulo inteiro.</b> Estado na data de verificação, 2 de agosto de 2026: tarifa adicional de 25% sob a Seção 301 em vigor desde 22 de julho de 2026, com anexos de isenção; tarifas setoriais de aço e alumínio sob dispositivo distinto, inalteradas; tarifa geral sob lei de emergência invalidada em decisão de fevereiro de 2026; processo paralelo sob a mesma Seção 301 prevendo percentual adicional sobre cerca de sessenta economias, incluindo o Brasil, ainda sem configuração final. <b>Não repita nenhum percentual sem reconferir.</b> Fonte primária: notificação de ação publicada pelo Escritório do Representante Comercial dos Estados Unidos no registro federal americano, memorando presidencial de 15 de julho de 2026, e a decisão da Suprema Corte de fevereiro de 2026. A incidência é definida por código tarifário, produto a produto — não por nome de setor." },
      { kind: 'titulo', numero: "04.3", texto: "O contraste que vale mais que qualquer percentual" },
      { kind: 'paragrafo', html: "Se você guardar um só fato desta aula, guarde este: <b>produtos energéticos foram isentados; terras-raras foram isentadas; etanol e açúcar não foram</b>. Isso não é detalhe administrativo. É a leitura mais nítida disponível de como o parceiro comercial enxerga o Brasil — e ela confirma o vetor cadeia de valor de forma quase didática." },
      { kind: 'paragrafo', html: "Petróleo bruto e terras-raras são insumos que o comprador precisa e não produz em quantidade suficiente. Taxá-los seria taxar a própria indústria doméstica que os consome — motivo pelo qual, em todas as configurações da medida, desde 2025, energia apareceu na lista de isenção. Etanol é diferente: é produto <b>processado</b>, que compete diretamente com produção doméstica americana, e o próprio texto da investigação lista acesso ao mercado de etanol entre as práticas questionadas. O padrão é consistente e não depende de governo: <b>a matéria-prima passa, o produto transformado é taxado</b>." },
      { kind: 'paragrafo', html: "Essa é, em uma frase, a economia política da posição brasileira na cadeia de valor. O país tem acesso preferencial de fato para aquilo em que é fornecedor primário, e enfrenta barreira exatamente na etapa em que tentaria agregar valor. Reconhecer isso não é derrotismo — é o diagnóstico que qualquer política industrial séria precisa ter como ponto de partida, e é a resposta a quem pergunta por que o Brasil não simplesmente processa mais aqui." },
      { kind: 'titulo', numero: null, texto: "Parceiro bilateral · Estados Unidos · Ficha de campo fixo · 2 de 4" },
      { kind: 'tabela', linhas: [["O que investe ou financia", "Capital privado de infraestrutura e fundos de investimento em geração renovável e ativos de rede. Aquisição direta de ativo mineral: em 2026, um grupo americano de terras-raras comprou a única mina de terras-raras em operação comercial no Brasil, em Goiás, em operação avaliada em cerca de 2,8 bilhões de dólares — a primeira aquisição americana relevante no setor."], ["Em que segmento", "Geração privada, serviços de exploração e produção offshore, mineração de minerais críticos, biocombustíveis de aviação, e cooperação em pesquisa. Interesse declarado em diversificar cadeias de suprimento hoje concentradas."], ["Tensão ou fricção corrente", "Duas ao mesmo tempo, e em direções opostas. De um lado, política tarifária ativa desde 2025, com base jurídica que já mudou duas vezes. Do outro, negociação de cooperação em minerais críticos que não avançou: a minuta americana de memorando enviada a Brasília em 2026 continha o país descrito como \"país X\" e, em um trecho, trocado por outro país sul-americano — sinal de texto padronizado aplicado a vários países —, além de natureza expressamente não vinculante. O lado brasileiro condicionou avanço à consolidação de marco legal próprio, que ainda não existe."], ["O que um número sobre esta relação precisa ter", "<b>Fonte, data e o dispositivo jurídico.</b> Um percentual tarifário sem o dispositivo é informação incompleta: 25% sob ação por prática comercial desleal e 25% sob poderes de emergência têm durações, escopos e reversibilidades diferentes. Verifique também se o número é alíquota <em>adicional</em> ou <em>total</em> — a sobretaxa se soma à alíquota regular, e a confusão entre as duas é sistemática na cobertura.Fonte primária: registro federal americano para o texto e os anexos da medida; Comex Stat, do Ministério do Desenvolvimento, Indústria, Comércio e Serviços, para o valor exportado por código tarifário."], ["Gancho de produto", "O acompanhamento de instrumento comercial americano com efeito sobre insumo energético e mineral brasileiro é escopo declarado do <b>Regulatory Radar</b>, que cobre autoridades brasileiras e internacionais."]] },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "A capacidade analítica desta aula é a de <b>datar e classificar instrumento antes de citar percentual</b>. Para um cliente industrial exportador, a diferença prática é enorme: uma medida com base jurídica frágil e prazo curto pede gestão de estoque e contrato; uma medida com base sólida e prazo indeterminado pede redesenho de mercado de destino. O <b>Regulatory Radar</b> entrega essa distinção como produto — não a notícia da tarifa, que chega sozinha, mas o estado jurídico dela e o que ele implica para horizonte de decisão." },
  ],
  'aula-12-05': [
      { kind: 'titulo', numero: "05.1", texto: "O mecanismo de ajuste de carbono na fronteira, sem exagero e sem minimização" },
      { kind: 'paragrafo', html: "O mecanismo europeu de ajuste de carbono na fronteira entrou em <b>regime definitivo em 1º de janeiro de 2026</b>, encerrando o período transitório que começara em outubro de 2023. Na fase transitória, o importador europeu apenas reportava as emissões incorporadas dos produtos. No regime definitivo, ele precisa adquirir certificados correspondentes a essas emissões, com preço vinculado ao mercado europeu de carbono. Os setores cobertos inicialmente são cimento, ferro e aço, alumínio, fertilizantes, eletricidade e hidrogênio, com previsão de revisão futura do escopo." },
      { kind: 'paragrafo', html: "Três precisões evitam os dois erros simétricos que se cometem sobre esse mecanismo." },
      { kind: 'paragrafo', html: "<b>Primeira:</b> quem paga o certificado é o <em>importador europeu</em>, não o exportador brasileiro. O efeito sobre o exportador é indireto e chega por dois caminhos — o importador repassa o custo na negociação de preço, e exige dado de emissão para calcular a obrigação. Na prática, portanto, o primeiro investimento que o mecanismo impõe a um exportador brasileiro frequentemente não é equipamento: é <b>inventário de emissão por produto, auditável</b>. Sem dado primário verificado, aplicam-se valores padrão, que costumam ser desfavoráveis." },
      { kind: 'paragrafo', html: "<b>Segunda:</b> a vantagem brasileira é real, mas específica por produto. Eletricidade de baixo carbono reduz a emissão incorporada de alumínio primário e de aço em rota elétrica de forma substancial — é aí que os 64,8 quilogramas de CO₂ equivalente por megawatt-hora da Aula 02 viram vantagem comercial concreta. Mas emissões de <em>processo</em>, de combustível térmico, de mineração e de transporte permanecem, e não são compensadas pela matriz elétrica. A vantagem precisa ser calculada produto a produto, não afirmada por país." },
      { kind: 'paragrafo', html: "<b>Terceira:</b> o regulamento prevê desconto do preço de carbono já pago no país de origem quando existe regime equivalente. Como visto na Aula 02, o sistema brasileiro de comércio de emissões é lei desde dezembro de 2024, mas ainda não estava operacional na data de verificação. <b>Enquanto não estiver, o desconto não se materializa.</b> É a ligação mais concreta que existe entre \"lei sem regulamento\" e custo de exportação, e é um dos melhores exemplos disponíveis de por que estado de vigência é conteúdo, não formalidade." },
      { kind: 'titulo', numero: "05.2", texto: "Hidrogênio: o comprador que ainda não assinou" },
      { kind: 'paragrafo', html: "Portos e polos industriais do norte europeu buscam rotas de moléculas de baixa emissão, e o Brasil aparece consistentemente entre os fornecedores potenciais. Existe cooperação institucional estruturada entre um complexo portuário do Nordeste brasileiro e um grande porto europeu, e há interesse declarado de compradores industriais europeus em amônia, metanol, combustível sintético e ferro pré-reduzido de baixa emissão." },
      { kind: 'paragrafo', html: "A distinção que precisa acompanhar essa frase é a mesma que a Aula 06 desenvolve para projetos: <b>interesse declarado não é contrato de compra</b>. Um memorando de entendimento entre autoridades portuárias estabelece cooperação; ele não estabelece volume, preço, especificação, prazo nem penalidade. A pergunta que resolve a conversa em vinte segundos é sempre a mesma: <em>existe contrato de compra vinculante, com preço e especificação, ou existe carta de intenção?</em>" },
      { kind: 'titulo', numero: "05.3", texto: "Banco de desenvolvimento bilateral e banco multilateral: dois animais diferentes" },
      { kind: 'paragrafo', html: "Bancos de desenvolvimento bilaterais europeus financiam parte dos projetos-âncora de hidrogênio e de transição no Brasil. A estrutura típica desse financiamento tem uma característica que precisa ser dita sem julgamento: ele costuma vir <b>vinculado, direta ou indiretamente, a acordo de compra com o país de origem do capital</b> ou a fornecimento de tecnologia dele. Isso não é irregularidade — é o mandato desses bancos, que existem para promover interesse econômico do próprio país enquanto financiam desenvolvimento em outro. É capital com <em>condicionalidade</em>, e a condicionalidade é o preço implícito do custo de capital mais baixo." },
      { kind: 'paragrafo', html: "O <b>Novo Banco de Desenvolvimento</b>, criado no âmbito do arranjo do BRICS e do qual o Brasil é sócio-fundador, tem estrutura diferente. Um banco multilateral do qual o país é acionista não é capital estrangeiro na mesma acepção: o Brasil participa da governança e da definição de política de crédito. A lógica de condicionalidade é distinta, e a moeda de denominação do financiamento também pode ser — o que importa mais do que parece, porque financiamento em moeda estrangeira transfere risco cambial para o tomador, e financiamento em moeda local não." },
      { kind: 'nota', tom: "neutro", label: "A pergunta que se faz a qualquer capital estrangeiro", html: "Não é \"de onde vem o dinheiro\". É <b>o que vem junto com ele</b>, em quatro campos: <b>moeda</b> de denominação e quem carrega o risco cambial; <b>condicionalidade</b> de compra, de tecnologia ou de origem de equipamento; <b>horizonte</b> de saída do investidor, que diferencia capital de concessão regulada de capital de fundo com prazo; e <b>governança</b>, isto é, que direito de veto ou de indicação o capital adquire sobre decisão operacional. Os quatro campos são a mesma disciplina que o Módulo 09 aplicou a alocação de risco contratual — o contrato distribui risco, e ler quem fica com qual é a análise inteira." },
      { kind: 'titulo', numero: null, texto: "Parceiro bilateral · Europa · Ficha de campo fixo · 3 de 4" },
      { kind: 'tabela', linhas: [["O que investe ou financia", "Financiamento de desenvolvimento por bancos bilaterais de países-membros, tipicamente vinculado a acordo de compra ou a fornecimento de tecnologia do país de origem do capital. Capital privado em geração renovável e em transmissão. Cooperação portuária e institucional para corredores de moléculas de baixa emissão."], ["Em que segmento", "Hidrogênio de baixa emissão e derivados, geração eólica e solar, eficiência industrial, e cadeias de mineral crítico com exigência de rastreabilidade socioambiental."], ["Tensão ou fricção corrente", "Assimetria regulatória. A Europa define o padrão de carbono, de desmatamento e de certificação que o fornecedor brasileiro precisa atender, e o custo de conformidade recai sobre quem exporta. Diferenças entre padrões de certificação de hidrogênio podem impedir fungibilidade — uma molécula certificada sob critério brasileiro não é automaticamente aceita sob critério europeu. Do lado do capital, a condicionalidade de <em>offtake</em> reduz a margem de negociação do tomador."], ["O que um número sobre esta relação precisa ter", "<b>Fonte, data e a distinção entre intenção e compromisso.</b> Valores anunciados de cooperação em hidrogênio costumam somar memorandos, cartas de intenção e linhas de crédito indicativas como se fossem investimento contratado. Verifique se o valor citado corresponde a decisão final de investimento, a crédito aprovado, ou a interesse manifestado — e nunca some as três categorias na mesma cifra.Fonte primária: publicações da Comissão Europeia sobre cooperação energética com o Brasil; comunicados da EPE e do Ministério de Minas e Energia; relatórios publicados pelo próprio banco de desenvolvimento, quando ele for a origem do dado."], ["Gancho de produto", "O acompanhamento do mecanismo de ajuste de carbono na fronteira e dos padrões de certificação europeus é escopo declarado do <b>Regulatory Radar</b>. A explicação estruturada desses mecanismos, para público industrial brasileiro, é conteúdo da camada avançada da <b>Alexandria</b>."]] },
      { kind: 'titulo', numero: null, texto: "Parceiro bilateral · Arranjo multilateral do BRICS · Ficha de campo fixo · 4 de 4" },
      { kind: 'tabela', linhas: [["O que investe ou financia", "Crédito de infraestrutura pelo Novo Banco de Desenvolvimento, instituição multilateral da qual o Brasil é sócio-fundador. Financiamento a projetos de transmissão, saneamento, transporte e energia, com possibilidade de operações denominadas em moeda local."], ["Em que segmento", "Infraestrutura de rede e projetos de desenvolvimento urbano e energético, em geral com contrapartida soberana ou de ente subnacional."], ["Tensão ou fricção corrente", "Escala relativa e velocidade de desembolso, quando comparadas às fontes tradicionais de crédito multilateral. A relevância desse canal é menos de volume e mais de <b>opcionalidade</b>: existir uma rota alternativa de capital altera a posição de negociação do Brasil com as demais, mesmo que o volume efetivamente contratado seja menor."], ["O que um número sobre esta relação precisa ter", "<b>Fonte, data, moeda e estágio.</b> Além de fluxo contra estoque, verifique a moeda de denominação — porque é ela que define quem carrega o risco cambial — e se o valor citado é carteira aprovada, contratada ou desembolsada. Os três diferem substancialmente e são reportados de forma intercambiável.Fonte primária: relatórios anuais e demonstrações do próprio Novo Banco de Desenvolvimento; Banco Central do Brasil para dívida externa por credor."], ["Gancho de produto", "A leitura de condicionalidade e moeda de financiamento externo é insumo direto da camada de análise da <b>Alexandria</b> e do trabalho analítico com cliente industrial que avalia proposta de capital estrangeiro."]] },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Este é o ponto do módulo em que a geopolítica desce ao chão de fábrica. Um exportador industrial brasileiro que vende aço, alumínio, cimento ou fertilizante para a Europa tem, em 2026, uma exposição regulatória concreta — e a maior parte das empresas nessa situação descobre isso pela carta do comprador, não por análise própria. A capacidade construída aqui, e que a <b>Alexandria</b> torna pública, é a de reconhecer que <b>a primeira barreira comercial de carbono não é técnica, é de dado</b>: quem não mede, paga valor padrão." },
  ],
  'aula-12-06': [
      { kind: 'titulo', numero: "06.1", texto: "O que a lei criou, e o critério que rompeu a convenção internacional" },
      { kind: 'paragrafo', html: "A <b>Lei nº 14.948, de 2 de agosto de 2024</b>, instituiu a Política Nacional do Hidrogênio de Baixa Emissão de Carbono, o Sistema Brasileiro de Certificação do Hidrogênio e o Regime Especial de Incentivos para a Produção de Hidrogênio de Baixa Emissão de Carbono, conhecido pela sigla Rehidro. A <b>Lei nº 14.990, de 27 de setembro de 2024</b>, instituiu o Programa de Desenvolvimento do Hidrogênio de Baixa Emissão de Carbono, que prevê crédito fiscal de até R$ 18,3 bilhões, com prioridade para setores de difícil descarbonização — fertilizantes, siderurgia, cimento, química e petroquímica — e para transporte pesado." },
      { kind: 'paragrafo', html: "A decisão técnica mais importante das duas leis, e a que mais diferencia o arranjo brasileiro do internacional, é a definição de <b>hidrogênio de baixa emissão de carbono</b> por <em>desempenho</em>, não por rota. Qualquer processo produtivo que resulte em até <b>7 quilogramas de dióxido de carbono equivalente por quilograma de hidrogênio</b> se enquadra, independentemente da tecnologia empregada. Isso rompe deliberadamente a convenção internacional de \"cores\" — verde, azul, cinza —, que classifica pela rota e não pelo resultado. A escolha é de neutralidade tecnológica, e tem efeito geopolítico direto: ela abre espaço para rotas com captura de carbono e para hidrogênio de origem natural, e ao mesmo tempo cria um problema de <b>fungibilidade</b> com mercados compradores que classificam por rota ou por limiar diferente. Uma molécula certificada no Brasil não é automaticamente aceita como equivalente lá fora." },
      { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "O valor de R$ 18,3 bilhões em crédito fiscal está no texto da Lei nº 14.990/2024, com limites anuais escalonados. <b>A janela de anos em que esses créditos podem ser concedidos foi alterada por legislação posterior</b> — a redação original previa concessão entre 2028 e 2032, e alteração subsequente deslocou a janela para o início da década de 2030. Consulte o texto <em>consolidado</em> no portal do Planalto antes de citar qualquer ano: citar a redação original de uma lei já alterada é um dos erros mais fáceis de cometer e mais difíceis de defender. Nota de cruzamento: a Lei nº 15.269/2025 — a mesma lei de reforma do setor elétrico que o Módulo 11 tratou no que toca autoprodução — alterou dispositivos da Lei nº 14.990/2024. Consulta em 2 de agosto de 2026." },
      { kind: 'titulo', numero: "06.2", texto: "O regulamento que não veio, e por que a demora é o dado" },
      { kind: 'paragrafo', html: "As duas leis dependem de decreto do Poder Executivo para operar. O decreto precisa definir, entre outras coisas, a forma de habilitação e coabilitação ao regime de incentivo, o percentual mínimo de bens e serviços de origem nacional exigido, o investimento mínimo em pesquisa e desenvolvimento, a metodologia de análise de ciclo de vida para contabilidade de emissões, e o funcionamento do sistema de certificação." },
      { kind: 'paragrafo', html: "A cronologia da espera é, ela própria, o fato mais informativo desta aula. Em novembro de 2025, durante a COP30, o Ministério de Minas e Energia anunciou publicamente que o decreto seria assinado \"na próxima semana\", apresentando-o como uma das entregas brasileiras da conferência. Ao longo do primeiro semestre de 2026, associações setoriais enviaram carta formal pedindo celeridade; representantes do governo reiteraram a publicação como iminente em março, abril, junho e julho. Na primeira semana de julho de 2026, a secretaria responsável no Ministério de Minas e Energia voltou a indicar publicação para \"esta semana\". <b>Na data de verificação deste módulo, 2 de agosto de 2026, o decreto não havia sido publicado.</b>" },
      { kind: 'paragrafo', html: "Isso não é fofoca institucional. Tem três consequências analíticas duras. <b>Primeira</b>, o benefício tem prazo de validade legal, e cada mês de atraso consome janela de elegibilidade sem que ninguém possa se habilitar. <b>Segunda</b>, empresas não fecham decisão final de investimento sem saber a regra de acesso ao incentivo, e várias adiaram cronograma explicitamente por esse motivo. <b>Terceira</b>, e a mais útil em conversa: quando alguém afirma que \"o Brasil tem R$ 18,3 bilhões em incentivo ao hidrogênio\", a resposta correta não é concordar nem discordar — é <b>perguntar se o decreto já saiu</b>. Uma lei de dois anos sem regulamento é exatamente o tipo de \"regra em movimento\" que os Módulos 07 a 11 ensinaram a verificar antes de aceitar como operacional." },
      { kind: 'titulo', numero: null, texto: "Marco regulatório vivo · Hidrogênio de baixa emissão · Ficha de campo fixo · 5 de 6" },
      { kind: 'tabela', linhas: [["O que institui", "Lei nº 14.948/2024: Política Nacional do Hidrogênio de Baixa Emissão de Carbono, Sistema Brasileiro de Certificação do Hidrogênio e Rehidro. Lei nº 14.990/2024: Programa de Desenvolvimento do Hidrogênio de Baixa Emissão de Carbono, com crédito fiscal de até R$ 18,3 bilhões."], ["Critério técnico central", "Até <b>7 kg de CO₂ equivalente por kg de H₂</b>, por desempenho e com neutralidade tecnológica — não por rota nem por convenção de cores."], ["O que já está em vigor", "As duas leis, integralmente publicadas e vigentes. A competência regulatória da agência do setor de petróleo sobre autorização de produção. A convalidação de autorizações preexistentes."], ["O que ainda depende de ato", "Decreto regulamentador único das duas leis: habilitação e coabilitação ao Rehidro, percentual mínimo de conteúdo nacional, investimento mínimo em pesquisa e desenvolvimento, metodologia de análise de ciclo de vida, funcionamento do sistema de certificação. Modelo de procedimento concorrencial para acesso ao crédito fiscal, que o governo indicou ficar fora do decreto e ser definido em edital próprio."], ["Estado na data de verificação", "Lei · vigenteDecreto · não publicadoLeilão de incentivo · sem edital<b>2 de agosto de 2026.</b> Anúncio de assinatura iminente feito em novembro de 2025 e reiterado ao longo de 2026 sem publicação. <b>Verifique no Diário Oficial da União antes de qualquer afirmação sobre operacionalidade.</b>"], ["Fonte primária", "Textos integrais das Leis nº 14.948/2024 e nº 14.990/2024 no portal do Planalto, em versão consolidada; Diário Oficial da União para o decreto; comunicados do Ministério de Minas e Energia e do Ministério da Fazenda para cronograma anunciado."]] },
      { kind: 'titulo', numero: "06.3", texto: "Os polos, e a aritmética que não pode ser feita" },
      { kind: 'paragrafo', html: "Portos e complexos industriais são candidatos naturais a receber projetos de hidrogênio, porque combinam num só lugar energia renovável competitiva, água, terreno, logística de exportação e cliente industrial próximo. No Brasil, os polos que concentram anúncios e estudos estão no Ceará, no Rio de Janeiro, em Pernambuco, na Bahia e no Rio Grande do Sul." },
      { kind: 'paragrafo', html: "Uma chamada pública do Ministério de Minas e Energia para polos de hidrogênio voltados à descarbonização industrial recebeu <b>setenta propostas</b>. <b>Cinco</b> foram priorizadas em 2025 para integrar a preparação de um plano brasileiro de investimento junto a um fundo internacional de clima, distribuídas entre Rio de Janeiro, Bahia, Paraná e Minas Gerais — este último com dois projetos. A formulação oficial é <b>\"potencial de implementação até 2035\"</b>, e essa formulação é o conteúdo: cinco propostas priorizadas para estruturação não são cinco plantas em operação, nem cinco plantas contratadas." },
      { kind: 'paragrafo', html: "O erro que este módulo existe para impedir é a soma. Somar valores anunciados de projetos em estágios diferentes produz uma cifra grande, impressionante e analiticamente vazia. Um memorando de entendimento com uma autoridade portuária, um estudo de engenharia conceitual e uma planta com contrato de energia, licença ambiental, comprador contratado e financiamento aprovado não pertencem à mesma tabela. <b>Anúncio agregado não equivale a capacidade contratada</b>, e essa frase, dita no momento certo de uma conversa, encerra a discussão sobre se o Brasil \"vai ser o hub verde do Atlântico Sul\" mais rápido do que qualquer argumento contrário." },
      { kind: 'titulo', numero: "06.4", texto: "A economia do projeto, em uma linha e sem número inventado" },
      { kind: 'paragrafo', html: "O custo do hidrogênio eletrolítico é dominado pela eletricidade, e o segundo fator é o <b>fator de utilização do eletrolisador</b>. Daí decorre uma tensão que não tem solução elegante e que qualquer interlocutor técnico vai levantar: energia renovável variável reduz a intensidade de emissão, mas reduz também as horas de operação do equipamento, o que aumenta o custo de capital diluído por quilograma produzido. Conectar à rede aumenta a utilização, mas exige metodologia para calcular emissão horária e adicionalidade — e é justamente essa metodologia que o decreto pendente precisa definir." },
      { kind: 'paragrafo', html: "Água é o terceiro fator e o mais subestimado. A eletrólise consome água de alta pureza, e o sistema completo consome mais, em tratamento e resfriamento. Em escala industrial, isso vira questão de outorga e de uso múltiplo da bacia — o mesmo tema federativo que a Aula 01 levantou sobre hidrologia de superfície. Dessalinização é tecnicamente viável em porto, mas adiciona custo, consumo de energia e gestão de salmoura." },
      { kind: 'paragrafo', html: "O quarto fator é o comprador. <b>Uma planta sem contrato de compra, com preço, especificação, prazo e penalidade, é uma opção — não um projeto financiável.</b> E aqui há uma leitura estratégica que costuma ser ignorada em favor da narrativa de exportação: a demanda doméstica brasileira em fertilizantes, refino e siderurgia pode oferecer âncora de <em>offtake</em> antes e com menos atrito do que a exportação de grande escala, porque não depende de resolver o problema de fungibilidade de certificação entre jurisdições." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "A régua de maturidade é um instrumento de <b>Regulatory Radar</b> em sua forma mais direta: dado um anúncio, devolver o estágio real e o que falta comprovar. E o acompanhamento do estado do decreto do hidrogênio — publicado ou não, em que data, com que conteúdo — é o exemplo mais limpo do que esse produto entrega e que nenhuma outra fonte consolida: não a notícia, mas o <b>estado</b>, datado e verificado na fonte primária." },
  ],
  'aula-12-07': [
      { kind: 'titulo', numero: "07.1", texto: "Nem tudo que se chama reserva é reserva" },
      { kind: 'paragrafo', html: "Antes de qualquer número, a disciplina de vocabulário, porque aqui ela é a origem de metade dos erros. <b>Recurso mineral</b> é uma concentração com perspectiva razoável de eventual extração econômica; a estimativa se apoia em conhecimento geológico e se classifica como inferido, indicado ou medido, em grau crescente de confiança. <b>Reserva mineral</b> é a parcela do recurso demonstrada como economicamente lavrável depois de aplicados os fatores modificadores — método de lavra, processamento, preço, infraestrutura, ambiente e regulação — e se classifica como provável ou provada." },
      { kind: 'paragrafo', html: "A diferença não é semântica. Uma ocorrência geológica gigantesca sem estudo de processamento, sem infraestrutura de escoamento e sem cliente não é reserva; é potencial. E o salto entre as duas categorias depende de fatores que a geologia não determina. A Agência Nacional de Mineração harmonizou a terminologia brasileira com o padrão internacional justamente para tornar essa distinção auditável." },
      { kind: 'titulo', numero: "07.2", texto: "Dois números para a mesma grandeza, e por que os dois entram" },
      { kind: 'paragrafo', html: "Circulam duas cifras muito diferentes para as reservas brasileiras de terras-raras, e a diferença entre elas é de metodologia, não de erro de ninguém." },
      { kind: 'nota', tom: "neutro", label: "Levantamento internacional", html: "<b>21 Mt</b> Milhões de toneladas de óxidos totais de terras-raras equivalente, segundo o Serviço Geológico dos Estados Unidos. Contra reserva mundial estimada em 85 Mt, o Brasil responde por cerca de <b>25%</b> e ocupa o segundo lugar global, atrás da China." },
      { kind: 'nota', tom: "neutro", label: "Levantamento brasileiro", html: "<b>11,4 Mt</b> Milhões de toneladas de óxidos, segundo o Sumário Mineral da Agência Nacional de Mineração, que revisou o valor para baixo aplicando o padrão de classificação da Comissão Brasileira de Recursos e Reservas ao Relatório Anual de Lavra. Nessa base, o Brasil responde por cerca de <b>15%</b> — e segue em segundo lugar." },
      { kind: 'paragrafo', html: "Qual das duas está certa? <b>As duas</b>, cada uma no seu próprio critério. O levantamento internacional agrega informações reportadas por governos e empresas sob critérios que variam entre países; o levantamento brasileiro aplica um padrão de classificação mais restritivo, que exige demonstração de lavrabilidade econômica com fatores modificadores aplicados. É o mesmo tipo de divergência que existe entre matriz elétrica e matriz energética na Aula 01 — grandezas com nomes iguais e denominadores diferentes." },
      { kind: 'paragrafo', html: "A regra operacional que decorre disso, e que vale para todo dado mineral, é curta: <b>nunca cite reserva sem nomear a fonte e a metodologia, e, quando houver dois números, apresente os dois.</b> Escolher o mais favorável é o comportamento que destrói credibilidade mais rápido numa conversa técnica, porque o interlocutor que conhece o outro número vai supor que você o omitiu de propósito — e, do ponto de vista dele, terá razão." },
      { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Ambos os valores acima são revisados periodicamente e caíram nos últimos ciclos. A reserva mundial reportada internacionalmente passou de 110 Mt em 2023 para 90 Mt em 2024 e 85 Mt em 2025. <b>Há ainda indicação de revisão adicional do valor brasileiro no levantamento internacional em 2026</b>, o que produziria uma terceira cifra em circulação. Antes de citar qualquer um dos números, consulte a edição mais recente do Mineral Commodity Summaries do Serviço Geológico dos Estados Unidos e o Sumário Mineral da Agência Nacional de Mineração, e declare o ano-base de cada um. Consulta em 2 de agosto de 2026. Reserva de nióbio: o Brasil detém a maior do mundo, com cerca de 16 milhões de toneladas e participação superior a 90% — mesma disciplina de fonte e ano-base se aplica." },
      { kind: 'titulo', numero: "07.3", texto: "O gargalo não está na mina" },
      { kind: 'paragrafo', html: "Se o Brasil tem a segunda maior reserva do mundo por qualquer das duas metodologias, por que produz tão pouco? A produção brasileira de terras-raras foi de <b>vinte toneladas em 2024</b>, contra produção mundial de 390 mil toneladas — menos de um centésimo de um por cento. Há uma única mina em operação comercial no país, em Goiás, que começou a produzir em janeiro de 2024 e é a primeira produção a partir de argilas iônicas fora da Ásia." },
      { kind: 'paragrafo', html: "A resposta é que o gargalo global de terras-raras <b>não está no minério</b>. Está na separação química dos elementos, no refino e na fabricação de ímãs permanentes — etapas concentradas em um único país, que domina de longe tanto o refino quanto a manufatura de ímãs. Extrair minério e separar elementos são atividades industriais completamente diferentes, com tecnologias, capitais e escalas diferentes. Possuir a jazida não dá acesso à cadeia." },
      { kind: 'paragrafo', html: "Esse padrão se repete com precisão quase monótona nos outros minerais, e reconhecê-lo é a diferença entre entusiasmo e análise. No <b>lítio</b>, exportar concentrado de espodumênio gera receita e aprendizado, mas produzir carbonato ou hidróxido em grau bateria é outra etapa, que exige água, energia, reagentes, tecnologia e cliente qualificado. No <b>grafite</b>, produzir minério na mina não é produzir material ativo de ânodo: entre os dois há purificação, micronização, esferonização e revestimento. No <b>nióbio</b>, onde o Brasil de fato lidera a produção mundial, o mercado principal continua sendo liga de aço de alta resistência — aplicações em bateria são promissoras, mas não devem ser confundidas com o mercado atual, e essa confusão é um dos erros mais comuns em apresentação de investimento." },
      { kind: 'titulo', numero: "07.4", texto: "A política que ainda não é lei, e o capital que não esperou" },
      { kind: 'paragrafo', html: "Um erro de tempo verbal circula com frequência: dizer que o Brasil \"tem\" uma política de minerais estratégicos. Na data de verificação, o que existe é um <b>projeto de lei em tramitação</b>. O Projeto de Lei nº 2.780, de 2024, institui a Política Nacional de Minerais Críticos e Estratégicos e cria um conselho nacional para industrialização desses minerais, vinculado à Presidência da República. Ele foi aprovado pela Câmara dos Deputados em maio de 2026 e seguiu para o Senado Federal, onde tramitava na data de verificação — com pedido protocolado de tramitação conjunta com outro projeto sobre a mesma matéria, o que tende a alongar o rito." },
      { kind: 'paragrafo', html: "Aprovação em uma Casa não é lei. Enquanto o projeto não for aprovado no Senado e sancionado, o Brasil <b>não tem lista oficial de minerais considerados críticos ou estratégicos</b> — a definição dessa lista seria atribuição do conselho a ser criado, com revisão periódica prevista. A base legal em vigor para mineração continua sendo o marco dos anos 1960, que não trata das especificidades de cadeia tecnológica moderna. Esse vazio tem efeito diplomático direto: a negociação de cooperação com os Estados Unidos em minerais críticos, descrita na Aula 04, foi explicitamente condicionada pelo lado brasileiro à consolidação desse marco legal." },
      { kind: 'paragrafo', html: "E aqui está o fato que fecha a aula, e que é o mais desconfortável dos dois lados: <b>o capital não esperou pelo marco legal</b>. Em 2026, um grupo americano de terras-raras adquiriu a única mina de terras-raras em operação comercial no país, em operação avaliada em cerca de 2,8 bilhões de dólares. Sem arcabouço legal específico, não há garantia normativa sobre questões que o próprio governo brasileiro declara relevantes — exigência de venda exclusiva para um destino, obrigação de processamento em território nacional, ou repartição de tecnologia. Enquanto isso, o Plano Nacional de Mineração 2050, apresentado pelo Ministério de Minas e Energia em julho de 2026 com vigência declarada de 2026 a 2050, estabelece a meta de elevar a participação brasileira na produção mundial de minerais críticos de 8,3% para 12,2% até 2050, e de reduzir o tempo médio de análise de processo minerário de 1.563 para 780 dias. Meta de plano e obrigação de lei são coisas diferentes, e a distinção é a mesma que a Aula 02 aplicou a decisão de conferência." },
      { kind: 'titulo', numero: null, texto: "Marco regulatório vivo · Minerais críticos e estratégicos · Ficha de campo fixo · 6 de 6" },
      { kind: 'tabela', linhas: [["O que institui", "Projeto de Lei nº 2.780/2024: Política Nacional de Minerais Críticos e Estratégicos e conselho nacional para industrialização desses minerais, vinculado à Presidência da República. Prevê fundo garantidor para viabilizar projetos em fase pré-operacional, crédito fiscal, fundo de fomento, e prazo máximo improrrogável para autorização de pesquisa em áreas portadoras."], ["Critério técnico central", "A lista de minerais considerados críticos ou estratégicos <b>não existe ainda</b>. Sua definição seria atribuição do conselho a ser criado, com revisão periódica. Enquanto isso, cada análise precisa declarar qual lista está usando — a de outra jurisdição não é automaticamente a brasileira."], ["O que já está em vigor", "Nada do projeto. O que vigora é o marco mineral dos anos 1960, com a competência da Agência Nacional de Mineração sobre direitos minerários, e instrumentos de fomento existentes por fora — chamada pública de bancos públicos e planejamento setorial de longo prazo."], ["O que ainda depende de ato", "Aprovação no Senado Federal, eventual retorno à Câmara em caso de emenda, sanção presidencial, e depois regulamentação — a mesma sequência de dois estados que o hidrogênio demonstrou que pode levar anos."], ["Estado na data de verificação", "Câmara · aprovado em maio de 2026Senado · em tramitaçãoLei · não existeLista oficial · não existe<b>2 de agosto de 2026.</b> Pedido de tramitação conjunta com projeto correlato protocolado no Senado. <b>Verifique o andamento nos portais da Câmara e do Senado antes de qualquer afirmação.</b>"], ["Fonte primária", "Ficha de tramitação do Projeto de Lei nº 2.780/2024 nos portais da Câmara dos Deputados e do Senado Federal; texto do projeto conforme aprovado na Câmara; Plano Nacional de Mineração 2050 e Sumário Mineral, ambos no portal do Ministério de Minas e Energia e da Agência Nacional de Mineração."]] },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Um projeto de lei que muda de estado a cada sessão legislativa, uma lista oficial que ainda não existe, dois números de reserva com metodologias divergentes e um plano setorial de vinte e cinco anos com metas datadas: é exatamente esse conjunto que o <b>Regulatory Radar</b> consolida e que nenhuma fonte única entrega. A capacidade analítica que este bloco constrói é a de <b>nunca citar dotação mineral sem citar produção</b> — porque é a razão entre as duas, não o valor absoluto de nenhuma delas, que descreve a posição real do país na cadeia." },
  ],
  'aula-12-08': [
      { kind: 'titulo', numero: "08.1", texto: "Por que este módulo quase não tem nome próprio de empresa" },
      { kind: 'paragrafo', html: "Você provavelmente notou. Sete aulas sobre fluxo de capital estrangeiro, cadeia de suprimento e aquisição de ativo, e quase nenhum nome de empresa. Isso é deliberado, e a razão não é jurídica — é de posicionamento, e vale a pena entendê-la porque ela se aplica a tudo que você publicar daqui em diante." },
      { kind: 'paragrafo', html: "Geopolítica energética é, por definição, o estudo de quem investe, quem financia e quem controla o quê a partir de fora. Não dá para ensinar isso sem falar de capital estrangeiro. Mas <b>nomear é distribuir visibilidade</b>, e visibilidade tem valor comercial. Um ativo analítico que nomeia fabricantes, bancos e plataformas de dados estrangeiras está entregando atenção de graça — elogiando ou criticando, tanto faz, porque as duas coisas colocam a marca na frente do leitor. Para uma camada que se posiciona como independente, isso é um vazamento." },
      { kind: 'paragrafo', html: "A regra binária \"não nomeie\" não resolve, porque ela impediria de contar a história. A resolução é uma taxonomia de seis categorias, que se aplica a cada nome encontrado em pesquisa antes de decidir se ele entra no texto publicado." },
      { kind: 'nota', tom: "neutro", label: "1 · Padrão preferido", html: "<b>Estrutura de propriedade, sem nome de empresa</b><br>\"Capital estatal estrangeiro controla ativos de transmissão e uma grande distribuidora\" em vez de nomear controladora e controlada. Suficiente na maioria absoluta dos casos, e mais informativo, porque descreve o mecanismo em vez do rótulo." },
      { kind: 'nota', tom: "neutro", label: "2 · Permitido", html: "<b>Fato histórico, transação concluída, de domínio público</b><br>Nomear é aceitável quando a menção explica uma <em>estrutura</em> já consolidada — quem comprou o quê, quando, sob que rito — e não promove um <em>serviço</em> que o leitor de hoje poderia contratar. O Módulo 06 usou essa categoria ao contar a privatização dos anos 1990. Este módulo não reabre aquela narrativa." },
      { kind: 'nota', tom: "neutro", label: "3 · Proibido", html: "<b>Fabricante de equipamento, plataforma financeira ou marketplace</b><br>Sem exceção de bloco. Fabricante de módulo, de inversor, de bateria ou de veículo; plataforma de negociação; marketplace de energia. Substitua sempre por descrição de estrutura de mercado: \"um pequeno número de fabricantes de grande escala concentra a cadeia\"." },
      { kind: 'nota', tom: "neutro", label: "4 · Proibido", html: "<b>Plataforma de dados ou pesquisa concorrente, direta ou adjacente</b><br>Mesmo quando aparece listada como fonte recomendada em material de estudo. Use como pesquisa privada; nunca published. Substitua por fonte brasileira primária sempre que ela existir, e reserve fonte internacional independente apenas para comparação que nenhuma fonte brasileira cobre." },
      { kind: 'nota', tom: "neutro", label: "5 · Só em referência", html: "<b>Instituição de pesquisa sem fins lucrativos, organismo intergovernamental ou banco multilateral do qual o Brasil é sócio</b><br>Permitido citar como <em>fonte</em>, em bibliografia e nota de fonte — nunca como personagem da prosa pedagógica. Agências multilaterais de energia, institutos de pesquisa climática, centros de estudo de política externa e o banco de desenvolvimento do arranjo do qual o Brasil é sócio-fundador caem aqui." },
      { kind: 'nota', tom: "neutro", label: "6 · Zona cinzenta", html: "<b>Banco de desenvolvimento bilateral de um país específico</b><br>Resolvida a favor da estrutura. Descreva o papel — \"bancos de desenvolvimento bilaterais europeus financiam projetos-âncora, tipicamente vinculados a acordo de compra com o país de origem do capital\" — sem nomear na prosa. Nomeie apenas em referência bibliográfica, se estiver citando relatório publicado por ele como fonte de dado específico." },
      { kind: 'titulo', numero: "08.2", texto: "Quem lucra com esta versão da história" },
      { kind: 'paragrafo', html: "Os Módulos 9, 10 e 11 ensinaram a perguntar quem lucra com uma conclusão financeira. Este módulo estende a mesma pergunta a conclusão <b>narrativa</b>. Toda fonte disponível sobre geopolítica energética tem interesse — declarado ou não — em como a história é contada, e reconhecer o interesse não invalida o fato: apenas informa o desconto a aplicar sobre a conclusão." },
      { kind: 'tabela', linhas: [["Narrativa comum", "Quem tende a se beneficiar da repetição", "O que verificar antes de aceitar"], ["\"O Brasil está pronto para ser o hub verde do Atlântico Sul\"", "Governo que precisa atrair capital; proponente de projeto que precisa de decisão final de investimento; autoridade portuária que compete por âncora industrial", "Quantos projetos têm contrato de compra vinculante, e não apenas memorando. Aplique a régua de maturidade da Aula 06."], ["\"O Brasil é uma potência renovável, então já resolveu seu problema climático\"", "Quem quer vender crédito de carbono ou produto de baixa intensidade usando o país como selo; quem quer evitar discussão sobre uso da terra", "A composição do inventário nacional. Eletricidade não é onde estão as maiores emissões brasileiras."], ["\"O Brasil é um petro-estado disfarçado de líder climático\"", "Concorrente comercial em mercado de exportação; ator que quer condicionar acesso a capital ou a mercado", "Se a comparação usa matriz elétrica ou matriz energética, e se compara com países de estrutura econômica semelhante."], ["\"O Brasil está sentado sobre uma fortuna em terras-raras\"", "Proponente de projeto mineral em busca de capital; jurisdição estrangeira que quer diversificar suprimento e precisa de justificativa política", "Reserva contra produção, e sob qual das duas metodologias. Onde está o gargalo — mina, separação ou ímã."], ["\"O capital estrangeiro X quer se apropriar dos recursos brasileiros\"", "Ator doméstico que compete pelo mesmo ativo; posição política que se beneficia de restrição a capital externo", "Qual é a estrutura societária concreta, qual é a condicionalidade contratual, e o que a regulação vigente já exige de qualquer investidor."], ["\"A transição energética vai reduzir a dependência geopolítica\"", "Fornecedor de tecnologia de transição; formulador de política que precisa de argumento de segurança", "Se a análise considera que a transição <em>troca</em> o objeto da dependência — de combustível para equipamento, mineral e propriedade intelectual — em vez de eliminá-la."]] },
      { kind: 'paragrafo', html: "Note que a tabela não diz que nenhuma dessas narrativas é falsa. Várias são substancialmente verdadeiras. O que ela diz é que <b>cada uma foi construída a favor de alguém</b>, e que uma afirmação verdadeira apresentada de forma que empurra à conclusão que interessa a quem fala continua sendo um argumento com dono. A defesa não é o ceticismo generalizado — é perguntar, antes de repetir, qual dos dois lados do paradoxo a narrativa está omitindo." },
      { kind: 'titulo', numero: "08.3", texto: "O andaime: oito movimentos para trinta minutos" },
      { kind: 'paragrafo', html: "O instrumento abaixo é o produto final deste módulo. Cada movimento tem quatro campos: a <b>pergunta que o governa</b>, duas ou três <b>âncoras concretas</b> com fonte, a <b>ponte</b> declarada para o movimento seguinte, e o <b>erro</b> que faz a conversa voltar a um ponto já percorrido. Percorrido inteiro, o andaime cobre cerca de trinta minutos sem repetição — e a ordem importa, porque cada movimento pressupõe o anterior." },
      { kind: 'titulo', numero: "08.4", texto: "A pergunta final, e por que a resposta não é sim nem não" },
      { kind: 'paragrafo', html: "Em algum momento dos trinta minutos, alguém vai perguntar: <em>então o Brasil é uma boa aposta ou não?</em> É a pergunta mais importante da conversa e a única em que uma resposta direta é errada — não por diplomacia, mas por imprecisão. \"Sim\" escolhe a coluna verde. \"Não\" escolhe a coluna fóssil. As duas descartam metade do fato." },
      { kind: 'paragrafo', html: "A resposta correta tem três partes e leva menos de um minuto. <b>Primeira</b>: articule as duas colunas em uma frase cada, com um número datado em cada uma — matriz elétrica de 86,8% em 2025, produção de petróleo de 3,8 milhões de barris por dia no mesmo ano. <b>Segunda</b>: explique por que elas coexistem sem contradição física — não há incompatibilidade entre gerar eletricidade limpa e produzir petróleo para exportação; a tensão é intertemporal, fiscal e diplomática, não técnica. <b>Terceira</b>, e é ela que devolve a conversa ao interlocutor: pergunte <b>em qual das duas colunas ele está exposto</b>. Quem investe em geração renovável está exposto à coluna verde e ao risco de rede, de curtailment e de preço local. Quem compra commodity está exposto à coluna fóssil e ao risco de demanda de longo prazo. Quem exporta manufatura para a Europa está exposto ao vetor regulação, e não a nenhuma das colunas diretamente." },
      { kind: 'paragrafo', html: "Essa devolução não é evasiva. É a mesma disciplina que o Módulo 11 ensinou para proposta comercial: diante de uma pergunta que embute uma premissa não declarada, o movimento correto é explicitar a premissa antes de responder. <b>\"O Brasil é uma boa aposta\" não é uma pergunta até que se diga aposta em quê.</b> E quem faz essa distinção com naturalidade demonstra, em trinta segundos, mais domínio do que qualquer lista de números conseguiria." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "O andaime é o formato editorial da camada de Geopolítica e Futuro da <b>Alexandria</b>. Um artigo dessa camada não é uma lista de fatos sobre um país — é uma sequência de movimentos que o leitor pode usar em conversa real, com âncora datada e fonte primária em cada um. É esse formato, e não o volume de informação, que sustenta autoridade de marca: a plataforma que ensina alguém a sustentar meia hora de conversa técnica ganha um leitor que volta, e é estruturalmente diferente da que entrega notícia." },
  ],
};

// ── DADO QUE VIVE NO <script>, NÃO NO MARKUP ─────────────────────────
// Cinco instrumentos deste módulo têm a grade populada por JavaScript —
// o markup traz só `<div class="tr-grid" id="…">` vazio. Extraídas
// literais por parse do literal JS, zero transcrição manual. Ficam aqui
// porque alimentam tanto as opções de select quanto o texto que a
// calculadora devolve: fonte única, importada dos dois lados.
/** Os três vetores do `Inst · 01` — capital, regra e cadeia de valor. */
export const MODULO_12_VETORES = {
  "cap": "O vetor capital não pergunta quanto entrou. Pergunta o que vem junto com o dinheiro: em que moeda ele é denominado e quem carrega o risco cambial; que condicionalidade de compra, de tecnologia ou de origem de equipamento acompanha o aporte; qual é o horizonte de saída do investidor, porque concessão regulada e fundo com prazo definido se comportam de forma oposta; e que direito de governança o capital adquire sobre decisão operacional. Capital estatal estrangeiro, capital privado de infraestrutura, banco de desenvolvimento bilateral e banco multilateral do qual o Brasil é sócio são quatro lógicas distintas, e tratá-las como uma só produz análise inútil.",
  "reg": "O vetor regulação e diplomacia pergunta o que está efetivamente em vigor, e a resposta quase nunca é binária. Uma norma pode estar sancionada sem regulamento, aprovada em uma Casa legislativa e pendente na outra, em vigor com período de transição, ou revogada com direito adquirido preservado para quem já iniciou. Compromisso internacional acrescenta uma camada: decisão aprovada por consenso das partes, iniciativa voluntária de coalizão e anúncio de presidência têm força política e natureza jurídica diferentes. Citar um marco sem citar o seu estado é o erro mais caro deste bloco inteiro.",
  "cad": "O vetor cadeia de valor pergunta em que etapa o Brasil está posicionado, e a resposta é consistentemente a mesma: do lado do recurso primário e da energia primária, não do lado da transformação de maior valor agregado. Isso aparece em objetos completamente diferentes com a mesma forma — participação alta na reserva mineral e desprezível na produção; eletricidade limpa em abundância e exportação de elétron fisicamente limitada; matéria-prima isenta de barreira comercial e produto processado taxado. Reconhecer o padrão não é derrotismo: é o diagnóstico que qualquer política industrial precisa ter como ponto de partida."
} as const;

/** As cinco frentes do tabuleiro geopolítico. */
export const MODULO_12_FRENTES = [
  {
    "k": "prot",
    "n": "Protagonismo global",
    "cap": "O ativo que atrai capital aqui é a matriz elétrica de baixa emissão, porque ela é insumo verificável para qualquer produto eletrointensivo. Investidor industrial que precisa comprovar intensidade de carbono do produto final olha para o fator de emissão da eletricidade brasileira — 64,8 quilogramas de dióxido de carbono equivalente por megawatt-hora em 2025 — como vantagem material. O limite é de infraestrutura: capital em geração sem capital em transmissão produz restrição de escoamento e cortes de geração, que corroem a receita do próprio projeto.",
    "reg": "A liderança é medida por percentual oficial da EPE, mas o <b>ranking</b> comparativo entre países do G20 vem de análise internacional independente, com metodologia própria e número ligeiramente diferente. Nenhum órgão brasileiro tem mandato para medir a matriz dos outros dezenove. Citar as duas fontes com seus dois números é mais forte do que escolher o mais favorável, porque a escolha se desfaz no instante em que o interlocutor conhece o outro.",
    "cad": "Eletricidade limpa em abundância não se exporta. A interconexão física é limitada e o elétron não viaja por navio. O que se exporta é o produto que a incorpora — alumínio, aço em rota elétrica, materiais de bateria, processamento de dados. O Brasil tem, portanto, a <b>condição</b> de agregar valor sem ter ainda a <b>cadeia</b>, e a diferença entre as duas é execução: infraestrutura, capital, escala e demanda contratada."
  },
  {
    "k": "clima",
    "n": "COP30 e ciclo climático",
    "cap": "A presidência da conferência e os compromissos assumidos funcionam como sinal para capital com mandato climático, que é uma parcela crescente do capital institucional global. O efeito é real mas indireto: sinal reduz percepção de risco de política, não substitui contrato. Iniciativas de financiamento lançadas em conferência mobilizam recursos por instrumento próprio, e o valor anunciado nesses lançamentos raramente equivale a desembolso contratado.",
    "reg": "Foi aprovado por consenso de cerca de 195 partes o conjunto de 29 decisões conhecido como Pacote de Belém, em novembro de 2025, incluindo compromisso de triplicar financiamento de adaptação até 2035. Não houve consenso sobre eliminação de combustíveis fósseis nem sobre desmatamento; os roteiros correspondentes são iniciativa de presidência, fora do texto aprovado. A presidência brasileira segue vigente até novembro de 2026, quando passa à COP31.",
    "cad": "A pressão climática internacional não se resolve em conferência — desce para norma doméstica e para exigência de comprador. O canal por onde ela chega à empresa brasileira é o dado: rastreabilidade de origem, inventário por produto, verificação por terceiro. É por isso que o efeito prático mais imediato do ciclo climático sobre a indústria brasileira não é regulatório, é <b>documental</b>."
  },
  {
    "k": "bilat",
    "n": "Relações bilaterais",
    "cap": "Quatro relações com lógicas incompatíveis entre si, simultaneamente. Capital estatal estrangeiro em ativos regulados, com horizonte de décadas. Capital privado em geração e, desde 2026, em ativo mineral. Financiamento de desenvolvimento bilateral europeu, tipicamente vinculado a acordo de compra com o país de origem. E banco multilateral do arranjo do qual o Brasil é sócio-fundador, que não é capital estrangeiro na mesma acepção porque o país participa da governança. Isso não é alinhamento: é <b>carteira de relações</b>.",
    "reg": "Cada parceiro exporta um tipo diferente de exigência. A Europa exporta padrão — carbono, desmatamento, certificação, diligência de cadeia. Os Estados Unidos exportam instrumento comercial e restrição de cadeia de suprimento vinculada a incentivo fiscal doméstico. A China opera por acordo bilateral de cooperação sem condicionalidade climática embutida. O arranjo multilateral opera por política de crédito com governança compartilhada.",
    "cad": "O padrão agregado de todas as quatro relações é o mesmo, com intensidades diferentes: o Brasil fornece recurso e compra manufatura. O caso mais didático é comercial: em 2026, produtos energéticos e terras-raras foram isentados da sobretaxa americana; etanol e açúcar, que são produtos transformados, não foram. Matéria-prima passa, produto processado é taxado."
  },
  {
    "k": "h2",
    "n": "Hidrogênio de baixa emissão",
    "cap": "Capital existe e está em compasso de espera. Bancos de desenvolvimento bilaterais europeus financiam projetos-âncora, tipicamente vinculados a acordo de compra com o país de origem do capital. O bloqueio não é falta de interesse: é ausência de regra de acesso ao incentivo doméstico e ausência de comprador contratado. Nenhuma decisão final de investimento se toma sem os dois.",
    "reg": "Duas leis sancionadas em 2024 — marco legal e programa de crédito fiscal de até R$ 18,3 bilhões — e decreto regulamentador não publicado até a data de verificação, dois anos depois. O critério técnico brasileiro rompe a convenção internacional de cores: até 7 quilogramas de dióxido de carbono equivalente por quilograma de hidrogênio, por desempenho e com neutralidade tecnológica. Isso cria um problema de fungibilidade com mercados que classificam por rota.",
    "cad": "Exportar hidrogênio puro é logisticamente difícil. O valor viaja em derivado — amônia, metanol, combustível sintético, ferro pré-reduzido — ou fica no país, embutido em produto industrial. A leitura estratégica menos ruidosa é que a demanda doméstica em fertilizantes, refino e siderurgia pode ancorar contrato de compra antes e com menos atrito do que a exportação de grande escala, porque não depende de resolver fungibilidade de certificação entre jurisdições."
  },
  {
    "k": "min",
    "n": "Minerais críticos",
    "cap": "O capital não esperou pelo marco legal. Em 2026, um grupo americano de terras-raras adquiriu a única mina de terras-raras em operação comercial no país, em operação avaliada em cerca de 2,8 bilhões de dólares. Bancos públicos brasileiros selecionaram, em chamada anterior, 56 planos de negócios de transformação mineral com valor estimado de R$ 45,8 bilhões — seleção para estruturação de apoio, não desembolso nem capacidade construída.",
    "reg": "Não há lei. O Projeto de Lei nº 2.780/2024 foi aprovado na Câmara dos Deputados em maio de 2026 e tramita no Senado, com pedido de tramitação conjunta protocolado. O Brasil <b>não tem lista oficial de minerais críticos ou estratégicos</b> — sua definição seria atribuição do conselho a ser criado. O marco mineral em vigor é o dos anos 1960. Esse vazio já condicionou negociação bilateral.",
    "cad": "É aqui que o vetor aparece em estado puro. Pelo levantamento internacional, o Brasil detém cerca de um quarto da reserva mundial de terras-raras; produziu vinte toneladas em 2024, contra 390 mil toneladas mundiais. O gargalo global não está no minério: está na separação química, no refino e na fabricação de ímãs permanentes. Possuir a jazida não dá acesso à cadeia."
  }
] as const;

/** Os oito números catalogados do `Inst · 03`, com fonte e o que verificar. */
export const MODULO_12_NUMEROS = [
  {
    "k": "ren",
    "n": "\"O Brasil é 88% renovável\"",
    "f": "Balanço Energético Nacional, EPE e Ministério de Minas e Energia, publicação anual com o ano anterior como base.",
    "m": "Participação de fontes renováveis na Oferta Interna de <b>Energia Elétrica</b> — só eletricidade, medida em terawatt-hora, incluindo importação.",
    "e": "Citar como se fosse toda a energia do país. A matriz <b>energética</b>, que inclui transporte, indústria e calor, fica perto de 50%. E o valor específico muda todo ano: 88,2% em 2024, 86,8% em 2025.",
    "v": "O ano-base da edição citada e a grandeza. Se a frase não disser \"elétrica\" ou \"energética\", ela ainda não é uma afirmação verificável."
  },
  {
    "k": "g20",
    "n": "\"Maior matriz renovável do G20\"",
    "f": "Análise de instituto internacional de pesquisa em energia, que recalcula matrizes nacionais sob metodologia única para permitir comparação.",
    "m": "Posição relativa do Brasil entre os países do G20 por participação de renováveis na geração elétrica.",
    "e": "Atribuir o ranking a fonte brasileira. Nenhum órgão brasileiro mede a matriz dos outros dezenove países. O número associado ao ranking difere ligeiramente do oficial brasileiro porque a fronteira é geração, não oferta interna.",
    "v": "A edição e o ano-base da análise internacional, e se o número citado é o dela ou o da EPE. Cite as duas fontes com seus dois números."
  },
  {
    "k": "oleo",
    "n": "\"3,8 milhões de barris por dia\"",
    "f": "Anuário Estatístico Brasileiro do Petróleo, Gás Natural e Biocombustíveis, ANP, com dados consolidados do ano anterior; e boletins mensais de produção.",
    "m": "Média anual de produção nacional de petróleo, em barris por dia. Não inclui gás natural, que é reportado separadamente em metros cúbicos.",
    "e": "Confundir com barril de óleo equivalente, que soma petróleo e gás e produz número maior. E confundir produção, que é fluxo anual, com reserva, que é estoque.",
    "v": "Se o número é petróleo ou barril de óleo equivalente, e o ano de referência. Em 2025 a produção cresceu 12%, então usar dado de dois anos antes subestima substancialmente."
  },
  {
    "k": "reserva",
    "n": "\"Reservas de 17,5 bilhões de barris\"",
    "f": "Anuário Estatístico da ANP, seção de reservas, com distinção entre reservas totais e reservas provadas.",
    "m": "Volume recuperável com alto grau de certeza sob condições declaradas — reserva <b>provada</b>. As reservas totais são outro número, maior, e caíram enquanto as provadas subiram.",
    "e": "Citar reserva total como se fosse provada, ou o contrário. São categorias com graus de certeza diferentes e se movem em direções independentes no mesmo ano.",
    "v": "Qual das duas categorias está sendo citada, e a data de referência — reservas são reavaliadas anualmente."
  },
  {
    "k": "terra",
    "n": "\"21 milhões de toneladas de terras-raras\"",
    "f": "Levantamento internacional do Serviço Geológico dos Estados Unidos, série anual de reservas e produção mundiais.",
    "m": "Reserva nacional em óxidos totais de terras-raras equivalente, sob critério que agrega informações reportadas por governos e empresas.",
    "e": "Apresentar como único número existente. O levantamento brasileiro, aplicando padrão de classificação mais restritivo, reporta 11,4 milhões de toneladas. A diferença é de metodologia, não de erro.",
    "v": "A edição e o ano-base de cada levantamento, e se houve revisão recente. As reservas mundiais reportadas caíram de 110 para 85 milhões de toneladas em dois ciclos."
  },
  {
    "k": "ndc",
    "n": "\"Redução de 59% a 67% até 2035\"",
    "f": "Registro de Contribuições Nacionalmente Determinadas da Convenção-Quadro das Nações Unidas sobre Mudança do Clima.",
    "m": "Meta de redução de emissões líquidas de todos os setores até 2035, em relação ao ano-base de 2005. É faixa, não ponto.",
    "e": "Tratar como previsão. É compromisso assumido perante a Convenção. E citar apenas um dos dois extremos da faixa, o que muda substancialmente a leitura de ambição.",
    "v": "A data de submissão e se houve atualização posterior. Verifique também se a citação preserva a faixa completa e o ano-base de comparação."
  },
  {
    "k": "cap",
    "n": "\"218 GW de capacidade instalada\"",
    "f": "Bases do regulador do setor elétrico e do operador nacional do sistema, com atualização contínua — não do balanço energético.",
    "m": "Potência máxima do parque gerador, em megawatt. Não é energia gerada, e a distância entre as duas depende do fator de capacidade de cada fonte.",
    "e": "Usar capacidade como proxy de geração, o que superestima fontes variáveis e subestima fontes de base. E somar capacidade centralizada com geração distribuída sem dizer, ou contá-las duas vezes.",
    "v": "A data exata de referência, porque capacidade muda todo mês, e se o número inclui ou exclui micro e minigeração distribuída."
  },
  {
    "k": "anun",
    "n": "\"US$ 4 bilhões em projeto de hidrogênio\"",
    "f": "Comunicado de proponente, plataforma de atração de investimento ou nota oficial — nunca base estatística, porque não existe base estatística de anúncio.",
    "m": "Valor de investimento <b>anunciado</b>, que é uma intenção com uma cifra ao lado. Não mede capital comprometido nem capacidade construída.",
    "e": "Somar valores anunciados de projetos em estágios diferentes. Memorando, estudo conceitual e planta com contrato de compra e financiamento aprovado não pertencem à mesma tabela.",
    "v": "O estágio. Existe contrato de energia, comprador contratado e financiamento? Sem os três, a redação correta é \"anunciou intenção de desenvolver, condicionado a\"."
  }
] as const;

/** Os doze marcos diplomático-regulatórios do `Inst · 04`. */
export const MODULO_12_MARCOS = [
  {
    "k": "m1",
    "y": "ago 2024",
    "n": "Marco legal do hidrogênio",
    "o": "Lei nº 14.948, de 2 de agosto de 2024. Institui a Política Nacional do Hidrogênio de Baixa Emissão de Carbono, o Sistema Brasileiro de Certificação do Hidrogênio e o Rehidro, regime especial de incentivos à produção. Define hidrogênio de baixa emissão por desempenho — até 7 quilogramas de dióxido de carbono equivalente por quilograma —, com neutralidade tecnológica, rompendo a convenção internacional de cores.",
    "e": "<b>Lei vigente.</b> Publicada e em vigor desde a data de publicação. Os dispositivos que dependem de regulamento, porém, não operam.",
    "f": "Decreto regulamentador: forma de habilitação e coabilitação ao Rehidro, percentual mínimo de conteúdo nacional, investimento mínimo em pesquisa e desenvolvimento, e metodologia de análise de ciclo de vida para a certificação."
  },
  {
    "k": "m2",
    "y": "set 2024",
    "n": "Programa de crédito fiscal ao hidrogênio",
    "o": "Lei nº 14.990, de 27 de setembro de 2024. Institui o programa de desenvolvimento do hidrogênio de baixa emissão de carbono, com crédito fiscal de até R$ 18,3 bilhões em limites anuais escalonados, concedido por procedimento concorrencial, com prioridade a setores de difícil descarbonização e a transporte pesado.",
    "e": "<b>Lei vigente, com janela alterada.</b> A faixa de anos em que o crédito pode ser concedido foi modificada por legislação posterior. Consulte o texto consolidado, não a redação original.",
    "f": "O mesmo decreto do marco, mais o edital do procedimento concorrencial — que o governo indicou ficar fora do decreto e ser definido em ato próprio. Sem ele, nenhum projeto pode disputar o crédito."
  },
  {
    "k": "m3",
    "y": "nov 2024",
    "n": "Segunda Contribuição Nacionalmente Determinada",
    "o": "Submetida ao registro da Convenção-Quadro em 13 de novembro de 2024. Estabelece redução de emissões líquidas entre 59% e 67% até 2035 em relação a 2005, abrangendo todos os setores da economia, e mantém a direção de neutralidade em 2050.",
    "e": "<b>Ativa no registro internacional.</b> É compromisso assumido perante a Convenção, não previsão nem projeção.",
    "f": "Desdobramento em planos setoriais, orçamento e instrumentos domésticos. Meta sem instrumento gera incerteza; instrumento sem coordenação transfere custo sem reduzir emissão."
  },
  {
    "k": "m4",
    "y": "dez 2024",
    "n": "Sistema Brasileiro de Comércio de Emissões",
    "o": "Lei nº 15.042, de 11 de dezembro de 2024. Institui mercado regulado de carbono no modelo de teto e comércio, com arquitetura de limites, ativos, monitoramento, reporte, verificação e negociação, e implementação prevista por fases.",
    "e": "<b>Lei vigente, sistema não operacional.</b> A regulamentação infralegal seguia em construção na data de verificação, com previsão oficial de conclusão até o fim de 2026 e início do mercado regulado previsto para o começo da década de 2030.",
    "f": "Plano nacional de alocação, definição de instalações cobertas, registro, governança e cronograma de fases. Enquanto não operar, não há preço de carbono doméstico reconhecível para desconto no mecanismo europeu."
  },
  {
    "k": "m5",
    "y": "nov 2025",
    "n": "COP30 e Pacote de Belém",
    "o": "Conferência realizada em Belém de 10 a 22 de novembro de 2025. Cerca de 195 partes aprovaram por consenso 29 decisões, incluindo o compromisso de triplicar o financiamento de adaptação até 2035, a conclusão de roteiro de adaptação para o período de 2026 a 2028, e 59 indicadores voluntários para a meta global de adaptação.",
    "e": "<b>Fato consumado, com lacuna reconhecida.</b> Não houve consenso para incluir eliminação de combustíveis fósseis nem linguagem explícita sobre desmatamento no texto final.",
    "f": "Os dois roteiros voluntários criados pela presidência brasileira — sobre combustíveis fósseis e desmatamento — a serem construídos ao longo de 2026, fora do texto de consenso e sem força vinculante sobre as partes."
  },
  {
    "k": "m6",
    "y": "nov 2025",
    "n": "Anúncio do decreto do hidrogênio",
    "o": "Durante a COP30, o Ministério de Minas e Energia anunciou que o decreto regulamentador das duas leis do hidrogênio seria assinado \"na próxima semana\", apresentando-o como uma das entregas brasileiras da conferência.",
    "e": "<b>Anúncio não cumprido.</b> Reiterado ao longo de 2026 — em março, abril, junho e na primeira semana de julho — sem publicação.",
    "f": "A publicação em si. Na data de verificação, 2 de agosto de 2026, o decreto não havia sido publicado no Diário Oficial da União. Verifique antes de qualquer afirmação sobre operacionalidade do regime."
  },
  {
    "k": "m7",
    "y": "jan 2026",
    "n": "Regime definitivo do ajuste de carbono na fronteira",
    "o": "O mecanismo europeu de ajuste de carbono na fronteira entrou em regime definitivo em 1º de janeiro de 2026, encerrando o período transitório iniciado em outubro de 2023. Importadores passam a adquirir certificados correspondentes às emissões incorporadas. Setores cobertos: cimento, ferro e aço, alumínio, fertilizantes, eletricidade e hidrogênio.",
    "e": "<b>Em vigor.</b> Obrigação recai sobre o importador europeu; o efeito sobre o exportador brasileiro chega por repasse de preço e por exigência de dado.",
    "f": "Revisões futuras de escopo setorial. E, do lado brasileiro, a operacionalização do sistema de comércio de emissões, sem a qual o desconto por preço de carbono doméstico não se materializa."
  },
  {
    "k": "m8",
    "y": "fev 2026",
    "n": "Decisão judicial sobre base tarifária de emergência",
    "o": "Em fevereiro de 2026, a Suprema Corte americana decidiu que a lei de poderes econômicos de emergência não autoriza a imposição de tarifas. As medidas fundadas nesse dispositivo, inclusive a que atingia o Brasil desde 2025, foram derrubadas.",
    "e": "<b>Base jurídica invalidada.</b> Tarifas setoriais fundadas em outro dispositivo, como as de aço e alumínio, não foram atingidas e permaneceram em vigor.",
    "f": "A substituição por instrumentos com base jurídica distinta, que ocorreu em seguida — o que demonstra que derrubar uma medida não elimina a política, apenas troca o veículo."
  },
  {
    "k": "m9",
    "y": "mai 2026",
    "n": "Aprovação na Câmara da política de minerais críticos",
    "o": "O Projeto de Lei nº 2.780/2024 foi aprovado pela Câmara dos Deputados em maio de 2026. Institui a Política Nacional de Minerais Críticos e Estratégicos, cria conselho nacional para industrialização vinculado à Presidência da República, fundo garantidor, crédito fiscal e fundo de fomento, e fixa prazo máximo improrrogável para autorização de pesquisa.",
    "e": "<b>Aprovado em uma Casa, não é lei.</b> Tramitava no Senado Federal na data de verificação, com pedido protocolado de tramitação conjunta com projeto correlato.",
    "f": "Aprovação no Senado, eventual retorno à Câmara em caso de emenda, sanção e depois regulamentação. O Brasil não tem lista oficial de minerais críticos, e ela seria atribuição do conselho a ser criado."
  },
  {
    "k": "m10",
    "y": "jun-jul 2026",
    "n": "Ação comercial por prática desleal",
    "o": "Concluída em junho de 2026 a investigação aberta em 2025 sobre seis categorias de práticas brasileiras — comércio digital, serviços de pagamento eletrônico, tarifas preferenciais, combate à corrupção, propriedade intelectual, acesso ao mercado de etanol e desmatamento ilegal. Em 15 de julho de 2026 foi publicada a ação final, com tarifa adicional de 25% sobre substancialmente todas as importações de origem brasileira.",
    "e": "<b>Em vigor desde 22 de julho de 2026</b>, com regra de transição para carga já embarcada. Lista final de isenção, ampliada após audiência pública, exclui mais de dois mil produtos, entre eles carne bovina, café, suco de laranja, aeronaves, produtos energéticos e terras-raras. Açúcar e etanol permaneceram expostos.",
    "f": "Processo paralelo sob o mesmo dispositivo, prevendo percentual adicional sobre cerca de sessenta economias incluindo o Brasil, sem configuração final na data de verificação. Reverifique antes de citar qualquer percentual."
  },
  {
    "k": "m11",
    "y": "jul 2026",
    "n": "Plano Nacional de Mineração 2050",
    "o": "Apresentado pelo Ministério de Minas e Energia em julho de 2026, com vigência declarada de 2026 a 2050. Estabelece pilares, objetivos estratégicos, metas e indicadores — entre eles elevar a participação brasileira na produção mundial de minerais críticos de 8,3% para 12,2% até 2050, e reduzir o tempo médio de análise de processo minerário de 1.563 para 780 dias.",
    "e": "<b>Instrumento de planejamento, não obrigação legal.</b> Meta de plano e obrigação de lei são categorias distintas, com consequências jurídicas distintas.",
    "f": "Plano de metas e ações detalhado, previsto para elaboração posterior, e sistema de monitoramento, avaliação e revisão."
  },
  {
    "k": "m12",
    "y": "nov 2026",
    "n": "Transferência da presidência da COP",
    "o": "A presidência brasileira da Conferência das Partes é exercida até a abertura da COP31, prevista para novembro de 2026, sediada pela Turquia, em Antália, com a Austrália conduzindo as negociações — arranjo de sede dividida sem precedente direto. A COP32 está anunciada para a Etiópia, em 2027.",
    "e": "<b>Vigente na data de verificação, com término datado.</b> Se você está lendo depois de novembro de 2026, a afirmação de vigência está errada e a formulação correta muda para o pretérito.",
    "f": "A transição em si, e o que a presidência brasileira entrega dos dois roteiros voluntários até lá. É esse o teste datado de substância da presidência."
  }
] as const;

/** Os quatro parceiros bilaterais do `Inst · 05`, por vetor. */
export const MODULO_12_PARCEIROS = {
  "china": {
    "n": "China",
    "cap": {
      "a": "Capital estatal em ativos regulados de transmissão e distribuição, e em geração hidrelétrica, com horizonte de décadas e tolerância a retorno regulado. Duas estatais distintas operam em segmentos distintos — confundi-las é erro factual comum.",
      "b": "Capital privado e estatal em manufatura instalada no país, incluindo complexo automotivo de veículos elétricos na Bahia. Crédito comercial frequentemente vinculado a fornecimento de equipamento.",
      "c": "Sem condicionalidade climática embutida. A condicionalidade típica é de fornecimento, não de padrão ambiental.",
      "d": "Horizonte longo. Capital que não precisa liquidar posição em prazo definido se comporta de forma estruturalmente diferente de fundo com data de saída."
    },
    "reg": {
      "a": "Relação conduzida por acordo bilateral de cooperação, inclusive plano de ação no setor mineral. Não há mecanismo regulatório extraterritorial equivalente ao europeu.",
      "b": "Ativos regulados no Brasil se submetem integralmente à regulação brasileira, com receita definida em revisão tarifária pelo regulador nacional.",
      "c": "Governança regulatória e segurança cibernética de ativos de rede são temas técnicos legítimos, a serem tratados como tais — sem xenofobia e sem ingenuidade.",
      "d": "Do lado externo, restrições americanas a entidade estrangeira designada afetam projetos que usem essa cadeia e queiram acessar crédito fiscal nos Estados Unidos."
    },
    "cad": {
      "a": "Padrão agregado: matéria-prima brasileira em troca de manufatura. Minério de ferro, petróleo bruto e soja saem; equipamento, máquina e eletrônico entram.",
      "b": "Um pequeno número de fabricantes de grande escala concentra a cadeia global de módulo, inversor e célula de bateria. Há montagem local no Brasil; a etapa de célula permanece externa.",
      "c": "A oportunidade declarada nos acordos é negociar pesquisa, processamento, manufatura e treinamento. O risco é consolidar o padrão de minério por equipamento.",
      "d": "A pergunta que ordena a análise: se essa fonte parasse por seis meses, existe alternativa a que preço e em que prazo? A resposta muda por camada."
    }
  },
  "eua": {
    "n": "Estados Unidos",
    "cap": {
      "a": "Capital privado de infraestrutura e fundos de investimento em geração e ativos de rede, com horizonte de saída definido — comportamento contratual distinto de capital de concessão.",
      "b": "Aquisição direta de ativo mineral: em 2026, um grupo americano de terras-raras comprou a única mina de terras-raras em operação comercial no país, em operação avaliada em cerca de 2,8 bilhões de dólares.",
      "c": "Esse aporte ocorreu <b>antes</b> de existir marco legal brasileiro de minerais críticos, sem garantia normativa sobre venda exclusiva, processamento local ou repartição tecnológica.",
      "d": "Instituições financeiras americanas podem financiar cadeias consideradas estratégicas, com critérios de origem e de governança acoplados ao crédito."
    },
    "reg": {
      "a": "Duas políticas simultâneas em direções opostas: negociação de cooperação em minerais críticos, e política comercial ativa desde 2025.",
      "b": "A minuta americana de memorando sobre minerais críticos enviada a Brasília em 2026 continha o país descrito como \"país X\" e, em um trecho, trocado por outro país sul-americano — sinal de texto padronizado — além de natureza expressamente não vinculante.",
      "c": "O lado brasileiro condicionou avanço da cooperação à consolidação de marco legal próprio, que ainda não existe. O vazio regulatório é, ele mesmo, variável da negociação.",
      "d": "Domesticamente, os créditos fiscais à eólica e solar foram substancialmente extintos por lei de julho de 2025, com restrições de cadeia de suprimento que atingem equipamento de origem designada."
    },
    "cad": {
      "a": "O contraste tarifário de 2026 é o diagnóstico mais nítido disponível: produtos energéticos e terras-raras isentados; etanol e açúcar expostos.",
      "b": "O padrão é consistente e independe de governo: matéria-prima que a indústria importadora precisa e não produz passa; produto transformado que compete com produção doméstica é taxado.",
      "c": "O interesse declarado americano em minerais brasileiros é de diversificação de cadeia hoje concentrada. O interesse brasileiro declarado é obter investimento, tecnologia e transformação local.",
      "d": "A tensão entre os dois interesses é exatamente o vetor cadeia de valor: um lado quer suprimento, o outro quer etapa industrial. Não são incompatíveis, mas também não são automáticos."
    }
  },
  "europa": {
    "n": "Europa",
    "cap": {
      "a": "Financiamento de desenvolvimento por bancos bilaterais de países-membros, tipicamente vinculado a acordo de compra ou a fornecimento de tecnologia do país de origem do capital.",
      "b": "Capital privado em geração renovável e transmissão, e cooperação portuária institucional para corredores de moléculas de baixa emissão.",
      "c": "Condicionalidade é a marca desse capital, e não é irregularidade: é o mandato desses bancos, que promovem interesse econômico do próprio país enquanto financiam desenvolvimento em outro.",
      "d": "Custo de capital mais baixo tem preço implícito em grau de liberdade futuro. A pergunta operacional é o que o contrato impede de fazer daqui a cinco anos."
    },
    "reg": {
      "a": "A Europa exporta <b>padrão</b>, e esse é o canal de influência mais subestimado. Regra de carbono na fronteira, rastreabilidade de desmatamento, certificação de hidrogênio e diligência de cadeia.",
      "b": "O mecanismo de ajuste de carbono na fronteira está em regime definitivo desde 1º de janeiro de 2026, cobrindo cimento, ferro e aço, alumínio, fertilizantes, eletricidade e hidrogênio.",
      "c": "O regulamento prevê desconto do preço de carbono já pago no país de origem quando existe regime equivalente — que, no Brasil, ainda não operava na data de verificação.",
      "d": "Diferenças entre padrões de certificação podem impedir fungibilidade: molécula certificada sob critério brasileiro não é automaticamente aceita sob critério europeu."
    },
    "cad": {
      "a": "O comprador europeu quer produto de menor intensidade de carbono, não energia primária. Isso é, em tese, favorável ao Brasil — e exige exatamente a etapa de transformação que falta.",
      "b": "A vantagem da eletricidade limpa é material e verificável para alumínio, aço em rota elétrica e materiais de bateria. Mas emissões de processo, combustível térmico e transporte permanecem.",
      "c": "A vantagem precisa ser calculada produto a produto, com fronteira declarada. Afirmá-la por país é o erro que a primeira carta de um comprador desfaz.",
      "d": "A barreira de entrada mais imediata não é técnica nem tarifária: é documental. Quem não mede emissão por produto, com verificação, recebe valor padrão."
    }
  },
  "brics": {
    "n": "Arranjo multilateral do BRICS",
    "cap": {
      "a": "Crédito de infraestrutura pelo Novo Banco de Desenvolvimento, instituição multilateral da qual o Brasil é sócio-fundador — categoria distinta de capital estrangeiro.",
      "b": "Possibilidade de operações denominadas em moeda local, o que altera quem carrega o risco cambial: financiamento em moeda estrangeira para ativo com receita em reais transfere a exposição ao tomador.",
      "c": "A relevância desse canal é menos de volume e mais de <b>opcionalidade</b>: existir rota alternativa de capital altera a posição de negociação com as demais, mesmo com volume contratado menor.",
      "d": "Como sócio, o Brasil participa da governança e da definição de política de crédito — o que muda a natureza da condicionalidade em relação a banco bilateral de terceiro país."
    },
    "reg": {
      "a": "Governança compartilhada entre países-membros, com política de crédito definida coletivamente, e não imposta unilateralmente por jurisdição externa.",
      "b": "Não há mecanismo regulatório extraterritorial associado, ao contrário do canal europeu. A exigência é de projeto, não de padrão setorial de importação.",
      "c": "Operações tipicamente exigem contrapartida soberana ou de ente subnacional, o que traz a questão para dentro do orçamento público brasileiro.",
      "d": "Escala relativa e velocidade de desembolso, comparadas às fontes tradicionais de crédito multilateral, são o objeto legítimo de análise — e mudam com o tempo."
    },
    "cad": {
      "a": "O canal não resolve, por si, o problema de etapa industrial: crédito de infraestrutura financia ativo, não transferência de tecnologia de transformação.",
      "b": "O ganho de cadeia, quando existe, vem de contrapartida negociada em cada operação — não de característica intrínseca da fonte de capital.",
      "c": "Para uma operação industrial, a leitura relevante é a mesma de qualquer financiamento: moeda, condicionalidade, horizonte e governança.",
      "d": "A comparação honesta com os demais canais não é de mérito abstrato, e sim de qual dos quatro campos importa mais para a decisão em questão."
    }
  }
} as const;

/** As quatro bases jurídicas do `Inst · 06`. */
export const MODULO_12_INSTRUMENTOS_COMERCIAIS = {
  "emerg": {
    "n": "Poderes de emergência econômica",
    "aut": "Executivo, por declaração de emergência",
    "pra": "Indeterminado enquanto durar a emergência",
    "jud": "Alto — foi o ponto de falha",
    "rev": "Alta",
    "nota": "Base usada na medida anunciada em julho de 2025 e vigente a partir de agosto do mesmo ano, com isenções expressas para energia, aeronaves civis, suco de laranja, ferro-gusa, celulose, fertilizantes e metais preciosos. Em fevereiro de 2026, a Suprema Corte americana decidiu que esse dispositivo não autoriza imposição de tarifas, e as medidas fundadas nele caíram. <b>Lição de método: instrumento com autoridade ampla e sem procedimento prévio é o mais rápido de impor e o mais frágil de sustentar.</b>"
  },
  "s232": {
    "n": "Tarifa setorial por segurança nacional",
    "aut": "Executivo, após investigação setorial",
    "pra": "Longo, sem termo definido",
    "jud": "Baixo — sobreviveu à decisão de 2026",
    "rev": "Baixa",
    "nota": "Aplica-se a categorias de produto, não a países, e por isso atinge o Brasil junto com todos os demais fornecedores da mesma categoria. Aço e alumínio são o caso clássico. Essas medidas <b>não</b> foram atingidas pela invalidação de fevereiro de 2026, porque têm base jurídica distinta. Produto já sujeito a esse instrumento em geral não recebe a sobretaxa adicional de outro — o que evita dupla incidência, mas não reduz a carga."
  },
  "s301": {
    "n": "Ação por prática comercial desleal",
    "aut": "Representante comercial, por determinação presidencial, após investigação",
    "pra": "Indeterminado, revisável",
    "jud": "Moderado — procedimento formal reduz vulnerabilidade",
    "rev": "Moderada, condicionada a mudança de prática",
    "nota": "Exige investigação formal, publicação de determinação, período de comentário público e audiência. No caso brasileiro, a investigação foi aberta em 2025 sobre seis categorias de prática, concluída em junho de 2026, e a ação final publicada em 15 de julho de 2026, com vigência em 22 de julho e tarifa adicional de 25%. <b>Por ter procedimento, é mais lenta de impor e mais difícil de derrubar — e a própria notificação prevê revisão ou suspensão se as práticas questionadas forem alteradas.</b>"
  },
  "s122": {
    "n": "Tarifa geral temporária de balanço",
    "aut": "Executivo, sem investigação prévia",
    "pra": "Limitado por lei, tipicamente até 150 dias sem aprovação legislativa",
    "jud": "Baixo, mas com prazo curto embutido",
    "rev": "Automática ao fim do prazo",
    "nota": "Instrumento de contenção, usado como ponte após a invalidação de fevereiro de 2026: aplicação ampla, alíquota moderada e prazo legal curto. <b>É o exemplo mais limpo de por que a base jurídica importa mais que o percentual:</b> uma alíquota baixa com prazo de meses e uma alíquota alta com prazo indeterminado exigem respostas empresariais completamente diferentes — a primeira pede gestão de estoque e contrato, a segunda pede redesenho de mercado de destino."
  }
} as const;

/** As seis classes de produto brasileiro do `Inst · 06`. */
export const MODULO_12_CLASSES_PRODUTO = {
  "energia": {
    "n": "Petróleo e produtos energéticos",
    "emerg": "Isentado. Energia constou da lista de exceções desde a primeira configuração, em agosto de 2025.",
    "s232": "Fora do escopo típico deste instrumento, que se concentra em metais e categorias industriais específicas.",
    "s301": "Isentado. Produtos energéticos constam do anexo final de isenção publicado em julho de 2026.",
    "s122": "Sujeito à alíquota geral quando aplicável, por ser instrumento de aplicação ampla e com poucas exceções."
  },
  "etanol": {
    "n": "Etanol e açúcar",
    "emerg": "Não constava entre as isenções expressas da configuração de 2025.",
    "s232": "Fora do escopo deste instrumento.",
    "s301": "<b>Exposto.</b> Acesso ao mercado de etanol constava expressamente entre as seis categorias de prática investigadas, e nem etanol nem açúcar foram incluídos no anexo de isenção.",
    "s122": "Sujeito à alíquota geral quando aplicável."
  },
  "aco": {
    "n": "Aço e alumínio",
    "emerg": "Tratamento sobreposto a medida setorial preexistente, com regras de não cumulatividade.",
    "s232": "<b>Escopo central deste instrumento.</b> Medidas em vigor e não atingidas pela invalidação de fevereiro de 2026.",
    "s301": "Em geral excluído da sobretaxa adicional por já estar sujeito à medida setorial — o que evita dupla incidência, não reduz carga.",
    "s122": "Tratamento condicionado à medida setorial preexistente."
  },
  "terras": {
    "n": "Terras-raras e minerais críticos",
    "emerg": "Tratamento variável conforme a configuração; insumo crítico à indústria importadora tende a receber isenção.",
    "s232": "Fora do escopo típico, embora minerais críticos possam ser objeto de investigação própria.",
    "s301": "Isentado. Terras-raras constam do anexo final de isenção — coerente com o interesse declarado de diversificar cadeia hoje concentrada.",
    "s122": "Sujeito à alíquota geral quando aplicável, com pressão setorial por exceção."
  },
  "agro": {
    "n": "Café, carne e suco",
    "emerg": "Suco de laranja constava entre as isenções de 2025; café e carne não, o que gerou impacto imediato.",
    "s232": "Fora do escopo deste instrumento.",
    "s301": "Isentados. Carne bovina, café e diferentes tipos de suco de laranja constam do anexo final de isenção, ampliado após audiência pública.",
    "s122": "Sujeito à alíquota geral quando aplicável."
  },
  "manuf": {
    "n": "Manufaturados diversos",
    "emerg": "Sujeito à medida, salvo exceção expressa.",
    "s232": "Apenas quando o produto se enquadra na categoria metálica coberta.",
    "s301": "<b>Exposto.</b> Pedidos de isenção de setores como máquinas agrícolas, calçados, equipamentos elétricos e papel foram rejeitados na análise final.",
    "s122": "Sujeito à alíquota geral quando aplicável."
  }
} as const;

/** Fronteira do inventário declarado — `Inst · 07`. */
export const MODULO_12_FRONTEIRA_INVENTARIO = {
  "corp": {
    "n": "Corporativo",
    "s": 0,
    "d": "Inventário de organização não serve para produto: o mecanismo exige emissão incorporada por unidade de produto, e escopos 1 e 2 corporativos não permitem essa atribuição."
  },
  "portao": {
    "n": "Produto, portão a portão",
    "s": 1,
    "d": "Fronteira compatível com a lógica do mecanismo para emissões diretas e de precursor, embora possa exigir extensão dependendo do produto."
  },
  "berco": {
    "n": "Produto, berço ao portão",
    "s": 2,
    "d": "Fronteira mais ampla, cobrindo matérias-primas até a saída de fábrica; posição mais defensável perante comprador exigente."
  }
} as const;

/** Verificação do inventário — `Inst · 07`. */
export const MODULO_12_VERIFICACAO_INVENTARIO = {
  "nao": {
    "n": "Nenhuma",
    "s": 0
  },
  "int": {
    "n": "Interna",
    "s": 1
  },
  "ter": {
    "n": "Terceiro acreditado",
    "s": 2
  }
} as const;

/** Dado primário de precursor — `Inst · 07`. */
export const MODULO_12_DADO_PRECURSOR = {
  "nao": {
    "n": "Sem dado de precursor",
    "s": 0
  },
  "parc": {
    "n": "Parcial",
    "s": 1
  },
  "sim": {
    "n": "Completo com custódia",
    "s": 2
  }
} as const;

/** Preço de carbono doméstico reconhecível — `Inst · 07`. */
export const MODULO_12_CARBONO_DOMESTICO = {
  "nao": {
    "n": "Sem regime operacional",
    "s": 0
  },
  "reg": {
    "n": "Em regulamentação",
    "s": 1
  },
  "op": {
    "n": "Operacional e reconhecido",
    "s": 2
  }
} as const;

/** Os nove itens de maturidade de projeto do `Inst · 08`. */
export const MODULO_12_ITENS_MATURIDADE = [
  {
    "k": "i1",
    "n": "Contrato de compra de energia",
    "crit": true,
    "s": [
      "Sem contrato; suprimento apenas indicado em estudo",
      "Memorando ou carta de intenção com fornecedor",
      "Contrato firmado, com preço, prazo e garantia definidos"
    ],
    "nota": "Para hidrogênio por eletrólise, energia é o principal componente do custo. Um projeto sem contrato de energia não tem custo de produção, tem estimativa de custo de produção — e a diferença entre as duas aparece inteira na decisão final de investimento."
  },
  {
    "k": "i2",
    "n": "Comprador contratado",
    "crit": true,
    "s": [
      "Sem comprador identificado; mercado descrito como \"potencial\"",
      "Memorando de entendimento ou carta de interesse não vinculante",
      "Contrato de compra vinculante, com volume, prazo e cláusula de rescisão"
    ],
    "nota": "É o item que mais distingue anúncio de projeto. Memorando de entendimento não obriga ninguém a comprar nada, e a maior parte do volume anunciado como \"contratado\" em conferências internacionais é dessa natureza. Pergunte sempre: vinculante ou não vinculante?"
  },
  {
    "k": "i3",
    "n": "Financiamento e decisão final de investimento",
    "crit": true,
    "s": [
      "Sem estrutura de capital definida",
      "Mandato de estruturação, carta de interesse de financiador ou termo indicativo",
      "Capital comprometido e decisão final de investimento tomada"
    ],
    "nota": "Decisão final de investimento é o marco que converte projeto em obra. Antes dela, tudo é reversível a custo baixo. Depois dela, o capital está exposto e o comportamento do proponente muda — inclusive na comunicação pública, que passa de promocional a contratual."
  },
  {
    "k": "i4",
    "n": "Licenciamento ambiental",
    "crit": false,
    "s": [
      "Não protocolado",
      "Protocolado ou licença prévia obtida",
      "Licença de instalação obtida"
    ]
  },
  {
    "k": "i5",
    "n": "Acesso e conexão à rede",
    "crit": false,
    "s": [
      "Sem consulta ao acesso",
      "Parecer de acesso solicitado ou emitido",
      "Contrato de uso do sistema assinado"
    ],
    "nota": "Item subestimado com frequência. Capacidade de escoamento indisponível transforma um projeto tecnicamente viável em projeto inviável no local escolhido, e a alternativa — mudar de local — em geral reabre licenciamento, terreno e logística ao mesmo tempo."
  },
  {
    "k": "i6",
    "n": "Terreno e direito de uso",
    "crit": false,
    "s": [
      "Área apenas indicada",
      "Opção de compra, pré-arrendamento ou termo com autoridade portuária",
      "Contrato de aquisição ou arrendamento firmado"
    ]
  },
  {
    "k": "i7",
    "n": "Maturidade de engenharia",
    "crit": false,
    "s": [
      "Estudo conceitual",
      "Engenharia básica ou projeto de referência",
      "Engenharia detalhada com orçamento fechado"
    ]
  },
  {
    "k": "i8",
    "n": "Fornecimento de equipamento principal",
    "crit": false,
    "s": [
      "Sem cotação; tecnologia ainda não escolhida",
      "Cotação recebida ou reserva de posição em fila de fabricação",
      "Pedido firme com prazo de entrega contratado"
    ]
  },
  {
    "k": "i9",
    "n": "Habilitação a regime de incentivo",
    "crit": false,
    "s": [
      "Não habilitado; regra de acesso ainda não existe",
      "Requisitos conhecidos e projeto estruturado para atendê-los",
      "Habilitação ou coabilitação concedida por ato administrativo"
    ],
    "nota": "Na data de verificação, 2 de agosto de 2026, o decreto que regulamenta o regime especial de incentivos e o programa de crédito fiscal do hidrogênio de baixa emissão não havia sido publicado. Sem ele, não há procedimento de habilitação — o que significa que o estado vinculante deste item não é alcançável por nenhum projeto brasileiro de hidrogênio hoje, por razão regulatória e não por deficiência do projeto. É a distinção entre um projeto atrasado e um projeto esperando."
  }
] as const;

/** As doze entidades do `Inst · 10`. */
export const MODULO_12_ENTIDADES = [
  {
    "k": "e1",
    "n": "Estatal estrangeira que controla ativo regulado no Brasil",
    "cat": 1,
    "ond": "Em nenhum lugar do ativo.",
    "sub": "\"Capital estatal estrangeiro controla ativos de transmissão e uma grande distribuidora.\"",
    "por": "A estrutura é o que explica o comportamento do capital: horizonte longo, tolerância a retorno regulado, submissão integral à regulação brasileira. O nome não acrescenta nenhum desses fatos, e acrescenta o risco de errar — é comum confundir a estatal de transmissão com a de geração hidrelétrica, que são empresas distintas em segmentos distintos."
  },
  {
    "k": "e2",
    "n": "Empresa privada estrangeira que adquiriu ativo mineral",
    "cat": 1,
    "ond": "Em nenhum lugar do ativo.",
    "sub": "\"Um grupo estrangeiro do setor de terras-raras adquiriu, em 2026, a única mina de terras-raras em operação comercial no país.\"",
    "por": "O fato relevante é a transação e a sua data em relação ao marco legal ausente, não a razão social. A frase sem nome carrega exatamente a mesma informação analítica e não vira material promocional de nenhuma das partes."
  },
  {
    "k": "e3",
    "n": "Empresa brasileira em fato histórico concluído há décadas",
    "cat": 2,
    "ond": "No corpo do texto, em contexto histórico explícito.",
    "sub": "Nomeação permitida. Ex.: descrição de privatização, reestruturação setorial ou racionamento já consumados.",
    "por": "O teste é se a menção explica uma <b>estrutura</b> concluída ou promove um <b>serviço</b> contratável hoje. Fato histórico não gera conflito com a independência analítica da plataforma porque não há nada a vender na frase. Este bloco, porém, trata de presente: use com parcimônia aqui."
  },
  {
    "k": "e4",
    "n": "Fabricante de módulo, célula de bateria, inversor ou eletrolisador",
    "cat": 3,
    "ond": "Proibido em todo o ativo, inclusive em nota de rodapé.",
    "sub": "\"Um pequeno número de fabricantes de grande escala concentra a etapa de célula.\"",
    "por": "Nomear fabricante em material educacional produz recomendação implícita de compra, e é precisamente o que a independência da plataforma existe para impedir. A concentração da cadeia é o fato analítico; a lista de nomes é catálogo."
  },
  {
    "k": "e5",
    "n": "Plataforma de negociação de energia, de carbono ou marketplace",
    "cat": 3,
    "ond": "Proibido em todo o ativo.",
    "sub": "\"Ambiente de negociação de contratos de energia\" ou \"mercado voluntário de crédito de carbono\".",
    "por": "Mesma razão do fabricante, agravada: plataforma de negociação é serviço contratável imediatamente, e a menção em material formativo funciona como encaminhamento comercial."
  },
  {
    "k": "e6",
    "n": "Provedor comercial de dados e análise de mercado de energia",
    "cat": 4,
    "ond": "Proibido em todo o ativo, inclusive em referência.",
    "sub": "\"Provedores comerciais de dados de mercado\" ou, quando o ponto for o custo de acesso, \"assinatura institucional de dados\".",
    "por": "É concorrente direto ou adjacente. Citá-lo como fonte transfere autoridade a quem disputa o mesmo leitor, e citá-lo como exemplo faz publicidade. Quando o dado subjacente é público, cite o <b>órgão de origem</b>, que é a fonte primária de qualquer forma."
  },
  {
    "k": "e7",
    "n": "Operador de sistema ou mercado atacadista estrangeiro",
    "cat": 4,
    "ond": "Proibido em todo o ativo.",
    "sub": "\"Um grande mercado atacadista de eletricidade norte-americano\" ou \"operadores independentes de sistema em outras jurisdições\".",
    "por": "Território reservado a outro produto da plataforma. A regra é lexical e vale mesmo quando a menção seria tecnicamente correta e útil — a consistência do ativo importa mais do que o ganho marginal de precisão em uma frase."
  },
  {
    "k": "e8",
    "n": "Instituto internacional de pesquisa sem fins lucrativos",
    "cat": 5,
    "ond": "Somente na seção de referências, com título do documento e data de consulta.",
    "sub": "No corpo: \"análise de instituto internacional de pesquisa em energia, com metodologia própria\".",
    "por": "A prosa precisa registrar que o dado <b>não é oficial brasileiro</b> — nenhum órgão nacional tem mandato para medir a matriz dos outros dezenove países do G20. A referência dá a rastreabilidade; a prosa dá a natureza da fonte. Os dois juntos são mais fortes do que o nome no meio da frase."
  },
  {
    "k": "e9",
    "n": "Organismo intergovernamental ou banco multilateral do qual o Brasil é sócio",
    "cat": 5,
    "ond": "Referências. No corpo, apenas quando a condição de sócio for o ponto analítico.",
    "sub": "\"Banco multilateral do qual o Brasil é sócio-fundador\" — formulação que carrega o fato relevante.",
    "por": "Aqui a estrutura é o próprio argumento: crédito de instituição em que o país participa da governança tem condicionalidade de natureza diferente da de banco bilateral de terceiro país. Dizer \"sócio\" informa; dizer o nome, não."
  },
  {
    "k": "e10",
    "n": "Banco de desenvolvimento bilateral de país estrangeiro",
    "cat": 6,
    "ond": "Referências, se houver documento citado. Zona cinzenta no corpo.",
    "sub": "\"Banco de desenvolvimento bilateral europeu, com financiamento tipicamente vinculado a acordo de compra com o país de origem do capital.\"",
    "por": "A condicionalidade vinculada à origem é o fato que importa, e ela é característica da <b>categoria</b>, não de uma instituição específica. Nomear individualiza uma prática que é geral e sugere juízo sobre um agente quando o juízo é sobre um modelo de financiamento."
  },
  {
    "k": "e11",
    "n": "Órgão público brasileiro com mandato legal",
    "cat": 0,
    "ond": "Livremente, no corpo e nas referências.",
    "sub": "Nomeação obrigatória, na verdade: ANEEL, ONS, CCEE, EPE, MME, ANP, ANM, CNPE, CMSE.",
    "por": "São a fonte primária. Omitir o nome do órgão que publicou o dado destrói a rastreabilidade, que é o oposto do objetivo da regra. A restrição do ativo é sobre <b>agentes de mercado</b>, nunca sobre instituições públicas com competência normativa — e a única exceção é o nome de <b>pessoas</b> que ocupam cargos, que não entra em nenhuma hipótese."
  },
  {
    "k": "e12",
    "n": "Estatal brasileira operando como agente de mercado hoje",
    "cat": 1,
    "ond": "Descrição estrutural no corpo; nome apenas quando o ativo específico o exigir.",
    "sub": "\"A empresa estatal de petróleo\", \"a maior geradora do país\" — ou, melhor ainda, a função: \"o operador que concentra a produção do pré-sal\".",
    "por": "Caso de fronteira, e o mais desconfortável da taxonomia. A empresa é fato público e central ao setor, mas é também agente de mercado ativo, com contraparte, concorrente e contencioso. Neste bloco a escolha foi a formulação estrutural, com o tema reservado a bloco próprio — decisão conservadora, registrada como tal."
  }
] as const;

/** As sete categorias da taxonomia de nomeação — `Inst · 10`. */
export const MODULO_12_CATEGORIAS_NOME = {
  "0": {
    "n": "Fora da restrição",
    "st": "Nomeação livre",
    "cls": "ok"
  },
  "1": {
    "n": "Categoria 1 — Estrutura de propriedade, sem nome",
    "st": "Padrão preferido",
    "cls": "ok"
  },
  "2": {
    "n": "Categoria 2 — Fato histórico concluído",
    "st": "Permitido",
    "cls": "ok"
  },
  "3": {
    "n": "Categoria 3 — Fabricante, plataforma financeira ou marketplace",
    "st": "Proibido",
    "cls": "per"
  },
  "4": {
    "n": "Categoria 4 — Plataforma de dados ou pesquisa concorrente",
    "st": "Proibido",
    "cls": "per"
  },
  "5": {
    "n": "Categoria 5 — Pesquisa sem fins lucrativos, organismo intergovernamental, banco multilateral",
    "st": "Só em referência",
    "cls": "att"
  },
  "6": {
    "n": "Categoria 6 — Banco de desenvolvimento bilateral",
    "st": "Zona cinzenta",
    "cls": "att"
  }
} as const;

/** Os oito movimentos do andaime de conversa — `Inst · 11`. */
export const MODULO_12_MOVIMENTOS = [
  {
    "t": "00–03",
    "lb": "Tese",
    "q": "O Brasil está expandindo qual das duas coisas: energia limpa ou petróleo?",
    "anc": [
      "<b>As duas, simultaneamente, e nenhuma marginalmente.</b> Matriz elétrica de 86,8% renovável em 2025 e produção de petróleo de 3,8 milhões de barris por dia no mesmo ano, com alta de cerca de 12% sobre 2024. Fontes: Balanço Energético Nacional 2026 e anuário estatístico da agência do petróleo.",
      "<b>A coexistência não é contradição física.</b> Gerar eletricidade limpa e exportar petróleo são atividades independentes; a tensão é fiscal, intertemporal e diplomática.",
      "<b>Quem só cita uma das colunas está construindo um argumento</b>, e vale perguntar qual. Ambos os recortes existem, ambos usam números verdadeiros, e nenhum dos dois descreve o país."
    ],
    "br": "Se o interlocutor aceita as duas colunas, o próximo passo é fixar a grandeza — porque quase toda discordância sobre \"quão limpo é o Brasil\" é uma discordância sobre qual matriz está sendo medida.",
    "no": "Abrir defendendo o Brasil. A tese não é uma defesa, é uma descrição. Quem abre defendendo entrega o enquadramento ao outro lado e passa os trinta minutos respondendo a uma agenda que não escolheu."
  },
  {
    "t": "03–07",
    "lb": "Grandeza",
    "q": "Quando se diz que o Brasil é 87% renovável, do que exatamente se está falando?",
    "anc": [
      "<b>Da matriz elétrica</b>, que foi 86,8% renovável em 2025 pelo balanço nacional — e que havia sido 88,2% em 2024, com a queda explicada por retração hidrelétrica e maior despacho térmico.",
      "<b>A matriz energética é outra coisa</b>: cerca de metade, sobre uma oferta interna de 327,9 milhões de toneladas equivalentes de petróleo, com petróleo e derivados em 33,7% e gás natural em 10,4%.",
      "<b>O ranking do G20 vem de instituto internacional</b>, com metodologia e número próprios — 87% em 2025, contra 89% em 2023. Nenhum órgão brasileiro mede a matriz dos outros dezenove países."
    ],
    "br": "Fixada a grandeza, cabe perguntar o que o país assumiu formalmente diante disso — o que leva ao ciclo climático e ao que ele efetivamente decidiu.",
    "no": "Citar os dois números como se fossem versões concorrentes do mesmo fato. Não são: medem coisas diferentes. Apresentar as duas fontes com os dois números é mais forte do que escolher a mais favorável, porque a escolha se desfaz no instante em que o interlocutor conhece a outra."
  },
  {
    "t": "07–11",
    "lb": "Clima",
    "q": "O que a COP30 decidiu, e o que ela não decidiu?",
    "anc": [
      "<b>Decidiu:</b> cerca de 195 partes aprovaram por consenso o conjunto de 29 decisões conhecido como Pacote de Belém, em Belém, entre 10 e 22 de novembro de 2025, incluindo o compromisso de triplicar o financiamento de adaptação até 2035 e um roteiro para 2026–2028.",
      "<b>Não decidiu:</b> não houve consenso sobre eliminação de combustíveis fósseis nem linguagem explícita sobre desmatamento. Os dois roteiros correspondentes são iniciativa da presidência, fora do texto e sem força vinculante.",
      "<b>No plano doméstico:</b> contribuição nacionalmente determinada submetida em novembro de 2024, com redução líquida de 59% a 67% até 2035 sobre 2005; e lei do mercado regulado de carbono de dezembro de 2024, com regulamentação em construção e operação prevista para o início da década de 2030."
    ],
    "br": "A distância entre lei aprovada e sistema operante é o eixo que organiza tudo o que vem depois — e é o mesmo eixo do hidrogênio, dos minerais e da negociação com a Europa.",
    "no": "Tratar o Pacote de Belém como sucesso total ou como fracasso total. As duas leituras existem na imprensa e as duas descartam metade do resultado. E, se a conversa ocorrer depois de novembro de 2026, dizer que a presidência brasileira segue vigente passa a ser erro factual."
  },
  {
    "t": "11–15",
    "lb": "Carteira",
    "q": "Com quem o Brasil está alinhado nesta transição?",
    "anc": [
      "<b>Com ninguém, e isso é a estratégia.</b> Capital estatal estrangeiro em ativos regulados, capital privado em geração e em ativo mineral, financiamento de desenvolvimento bilateral europeu vinculado a acordo de compra, e banco multilateral do qual o país é sócio-fundador.",
      "<b>Cada parceiro exporta uma exigência diferente:</b> a Europa exporta padrão; os Estados Unidos exportam instrumento comercial e restrição de cadeia de suprimento; o parceiro asiático opera por acordo de cooperação sem condicionalidade climática; o arranjo multilateral opera por política de crédito com governança compartilhada.",
      "<b>Não é neutralidade, é carteira.</b> Manter rotas alternativas de capital e de mercado é, ele mesmo, o ativo de barganha — e ele se perde no momento em que uma das rotas se torna indispensável."
    ],
    "br": "Dentro da carteira, a relação que mudou mais rápido e que melhor revela o padrão estrutural é a comercial com os Estados Unidos.",
    "no": "Descrever a carteira como indecisão. E, principalmente, atribuir a controladora errada a uma distribuidora brasileira: o erro circula em material de mercado e desmonta a credibilidade de tudo o que veio antes na conversa."
  },
  {
    "t": "15–19",
    "lb": "Comércio",
    "q": "O que o episódio tarifário de 2025 e 2026 ensina sobre a posição do Brasil?",
    "anc": [
      "<b>A cronologia:</b> medida de 2025 sob poderes de emergência econômica; base jurídica invalidada pela Suprema Corte americana em fevereiro de 2026; investigação por prática comercial desleal concluída em junho de 2026; ação final publicada em 15 de julho de 2026, com 25% adicionais em vigor desde 22 de julho.",
      "<b>O contraste:</b> produtos energéticos e terras-raras foram isentados; etanol e açúcar, não. Mais de dois mil produtos entraram no anexo de isenção após audiência pública, entre eles carne, café, suco e aeronaves.",
      "<b>O padrão:</b> matéria-prima que a indústria importadora precisa e não produz passa; produto transformado que compete com produção doméstica é taxado. O padrão é estrutural e independe de quem governa."
    ],
    "br": "Se o instrumento comercial revela onde o Brasil está posicionado na cadeia, o canal europeu revela por onde a exigência chega mesmo sem tarifa.",
    "no": "Repetir um percentual sem verificar a data e a base jurídica. Entre julho de 2025 e julho de 2026 a configuração mudou pelo menos quatro vezes, e a sobretaxa <b>soma-se</b> à tarifa regular do código — 5% mais 25% são 30%, não 25%."
  },
  {
    "t": "19–23",
    "lb": "Padrão",
    "q": "Como a Europa influencia o setor energético brasileiro sem investir nem tarifar?",
    "anc": [
      "<b>Exportando padrão.</b> O mecanismo de ajuste de carbono na fronteira entrou em regime definitivo em 1º de janeiro de 2026, cobrindo cimento, ferro e aço, alumínio, fertilizantes, eletricidade e hidrogênio.",
      "<b>O desconto por preço de carbono doméstico existe na norma e não se materializa hoje</b>, porque depende de regime equivalente operante — que o Brasil aprovou em lei e ainda não implementou.",
      "<b>A barreira imediata é documental, não tarifária.</b> Quem não mede emissão por produto, com fronteira declarada e verificação por terceiro, recebe valor padrão — e valor padrão é desenhado para ser desfavorável."
    ],
    "br": "Padrão é exigência sobre o que já se produz. O passo seguinte é o que ainda não se produz: as duas apostas industriais em que o Brasil declarou intenção e ainda não converteu em regra.",
    "no": "Afirmar a vantagem de carbono no nível do país. A vantagem da eletricidade limpa é real, mas emissões de processo, combustível térmico e transporte permanecem, e o comprador exige o cálculo por produto. A primeira carta de um comprador exigente desfaz a afirmação por país."
  },
  {
    "t": "23–27",
    "lb": "Aposta",
    "q": "O Brasil vai ser potência em hidrogênio e em minerais críticos?",
    "anc": [
      "<b>Hidrogênio:</b> duas leis de 2024 — marco legal com critério de até 7 quilogramas de dióxido de carbono equivalente por quilograma, e programa de crédito fiscal de até R$ 18,3 bilhões. O decreto regulamentador não havia sido publicado em 2 de agosto de 2026, dois anos depois, tendo sido anunciado como iminente em novembro de 2025.",
      "<b>Minerais:</b> o projeto de lei da política nacional foi aprovado na Câmara em maio de 2026 e seguia no Senado. Não é lei, e o país não tem lista oficial de minerais críticos. Reservas de terras-raras: 21 milhões de toneladas por levantamento internacional, 11,4 milhões pelo órgão nacional — contra produção de 20 toneladas em 2024.",
      "<b>Enquanto isso, o capital não esperou:</b> em 2026 um grupo estrangeiro adquiriu a única mina de terras-raras em operação comercial do país, antes de existir marco legal que condicionasse processamento local ou repartição tecnológica."
    ],
    "br": "As duas apostas compartilham a mesma lacuna, e ela é a resposta à pergunta que o interlocutor vai fazer em seguida.",
    "no": "Somar capacidade anunciada. Memorando de entendimento, estudo conceitual e planta com contrato e financiamento não pertencem à mesma tabela. A formulação honesta é \"potencial de implementação\" com horizonte declarado — que foi a adotada pela própria chamada pública brasileira de polos."
  },
  {
    "t": "27–30",
    "lb": "Fecho",
    "q": "Então o Brasil é uma boa aposta, ou não?",
    "anc": [
      "<b>Primeira parte, uma frase por coluna, com número datado:</b> matriz elétrica de 86,8% em 2025; produção de petróleo de 3,8 milhões de barris por dia no mesmo ano.",
      "<b>Segunda parte, por que coexistem:</b> não há incompatibilidade técnica entre gerar eletricidade limpa e exportar petróleo. A tensão é intertemporal, fiscal e diplomática — e é por isso que ela não se resolve com argumento, só com decisão.",
      "<b>Terceira parte, devolver a pergunta:</b> em qual das duas colunas o interlocutor está exposto? Quem investe em geração está exposto à coluna verde e ao risco de rede e de preço local. Quem compra commodity está exposto à coluna fóssil e ao risco de demanda de longo prazo."
    ],
    "br": "Encerrado o ciclo, qualquer movimento anterior pode ser retomado com profundidade — e é exatamente aí que a preparação se converte em conversa em vez de apresentação.",
    "no": "Responder \"sim\" ou \"não\". \"Sim\" escolhe a coluna verde, \"não\" escolhe a fóssil, e as duas descartam metade do fato. A resposta direta parece decisão e é imprecisão."
  }
] as const;

/** 11 instrumentos: dez de aula e o `Inst · 01` do § MAP. */
export const INSTRUMENTOS_MODULO_12: Instrument[] = [
  {
    id: "m12-inst-01",
    kind: "explorador",
    title: "Tabuleiro geopolítico — três vetores sobre cinco frentes",
    formula: null,
    fields: [
      {
      id: "tb-seg",
      label: "Vetor ativo",
      unit: null,
      kind: "select",
      defaultValue: "cap",
      options: [{ value: "cap", label: "Capital — quem financia e o que vem junto" }, { value: "reg", label: "Regulação e diplomacia — o que está em vigor" }, { value: "cad", label: "Cadeia de valor — onde o Brasil está posicionado" }],
    },
      {
      id: "tb-frente",
      label: "Frente",
      unit: null,
      kind: "select",
      defaultValue: "prot",
      options: [{ value: "prot", label: "Protagonismo global" }, { value: "clima", label: "COP30 e ciclo climático" }, { value: "bilat", label: "Relações bilaterais" }, { value: "h2", label: "Hidrogênio de baixa emissão" }, { value: "min", label: "Minerais críticos" }],
    },
    ],
    outputs: [
    ],
    note: "Escolha o vetor e depois a frente. O vetor determina a pergunta; a frente determina a resposta. Quinze combinações, nenhuma célula vazia, nenhuma resposta contendo nome de empresa, de fabricante ou de plataforma de dados estrangeira — por construção, e pela razão explicada na Aula 08.",
  },
  {
    id: "m12-inst-02",
    kind: "calculadora",
    title: "Separador de grandeza — quanto a eletricidade explica da energia total",
    formula: null,
    fields: [
      {
      id: "sg-el",
      label: "Renováveis na matriz elétrica",
      unit: "%",
      kind: "range",
      defaultValue: 86.8,
      min: 0,
      max: 100,
      step: 0.1,
    },
      {
      id: "sg-pe",
      label: "Peso da eletricidade na energia total",
      unit: "%",
      kind: "range",
      defaultValue: 19.0,
      min: 1,
      max: 100,
      step: 0.5,
    },
      {
      id: "sg-ne",
      label: "Renováveis fora da eletricidade",
      unit: "%",
      kind: "range",
      defaultValue: 41.0,
      min: 0,
      max: 100,
      step: 0.5,
    },
      {
      id: "sg-of",
      label: "Renováveis na matriz energética, valor oficial",
      unit: "%",
      kind: "range",
      defaultValue: 50.0,
      min: 0,
      max: 100,
      step: 0.5,
    },
    ],
    outputs: [
      { id: "sg-ag", label: "Renovabilidade agregada implícita", unit: null },
      { id: "sg-di", label: "Distância entre as duas grandezas", unit: null },
      { id: "sg-de", label: "Desvio contra o valor oficial", unit: null },
      { id: "sg-co", label: "Contribuição da eletricidade", unit: null },
    ],
    note: "Os três campos abaixo são entradas editáveis com fonte declarada , não constantes cravadas, porque os três mudam de ano para ano e por metodologia. O instrumento devolve a renovabilidade agregada implícita e a compara com o valor oficial que você mesmo informar. Ele não estima economia, não projeta nada e não devolve valor monetário: devolve a distância entre duas grandezas que costumam ser citadas como se fossem uma. O peso da eletricidade na energia total é um valor de ordem de grandeza, derivado da razão entre o consumo final de eletricidade e a Oferta Interna de Energia. Ele varia conforme a fronteira contábil adotada — consumo final contra oferta interna, com ou sem perdas de transformação — e por isso é entrada editável, não constante. Declare a fronteira sempre que usar o resultado.",
  },
  {
    id: "m12-inst-03",
    kind: "explorador",
    title: "Verificador de fonte de número — de onde vem, o que mede, o que verificar",
    formula: null,
    fields: [
      {
      id: "vn-sel",
      label: "Número em verificação",
      unit: null,
      kind: "select",
      defaultValue: "ren",
      options: [{ value: "ren", label: "\"O Brasil é 88% renovável\"" }, { value: "g20", label: "\"Maior matriz renovável do G20\"" }, { value: "oleo", label: "\"3,8 milhões de barris por dia\"" }, { value: "reserva", label: "\"Reservas de 17,5 bilhões de barris\"" }, { value: "terra", label: "\"21 milhões de toneladas de terras-raras\"" }, { value: "ndc", label: "\"Redução de 59% a 67% até 2035\"" }, { value: "cap", label: "\"218 GW de capacidade instalada\"" }, { value: "anun", label: "\"US$ 4 bilhões em projeto de hidrogênio\"" }],
    },
    ],
    outputs: [
    ],
    note: "Escolha um número que circula sobre o Brasil. O instrumento devolve qual fonte provavelmente o produziu, o que exatamente a grandeza mede, qual o erro típico de citação e o que verificar antes de repetir. Nenhuma célula devolve o número em si como verdade permanente: devolve o caminho até a fonte que o mantém.",
  },
  {
    id: "m12-inst-04",
    kind: "explorador",
    title: "Régua diplomático-regulatória — o que existe, em que estado, com que prazo",
    formula: null,
    fields: [
      {
      id: "rd-sel",
      label: "Marco em foco",
      unit: null,
      kind: "select",
      defaultValue: "m1",
      options: [{ value: "m1", label: "Marco legal do hidrogênio" }, { value: "m2", label: "Programa de crédito fiscal ao hidrogênio" }, { value: "m3", label: "Segunda Contribuição Nacionalmente Determinada" }, { value: "m4", label: "Sistema Brasileiro de Comércio de Emissões" }, { value: "m5", label: "COP30 e Pacote de Belém" }, { value: "m6", label: "Anúncio do decreto do hidrogênio" }, { value: "m7", label: "Regime definitivo do ajuste de carbono na fronteira" }, { value: "m8", label: "Decisão judicial sobre base tarifária de emergência" }, { value: "m9", label: "Aprovação na Câmara da política de minerais críticos" }, { value: "m10", label: "Ação comercial por prática desleal" }, { value: "m11", label: "Plano Nacional de Mineração 2050" }, { value: "m12", label: "Transferência da presidência da COP" }],
    },
    ],
    outputs: [
    ],
    note: "Cada marco abaixo tem três campos fixos: o que é , estado na data de verificação e o que ainda falta . A régua existe para tornar impossível citar um marco sem citar o seu estado — que é o erro mais caro deste bloco inteiro. Selecione um marco para ler os três campos.",
  },
  {
    id: "m12-inst-05",
    kind: "comparador",
    title: "Comparador de parceiros bilaterais — quatro parceiros, três vetores",
    formula: null,
    fields: [
      {
      id: "cb-par",
      label: "Parceiro",
      unit: null,
      kind: "select",
      defaultValue: "china",
      options: [{ value: "china", label: "China" }, { value: "eua", label: "Estados Unidos" }, { value: "europa", label: "Europa" }, { value: "brics", label: "Arranjo multilateral do BRICS" }],
    },
      {
      id: "cb-vet",
      label: "Vetor",
      unit: null,
      kind: "select",
      defaultValue: "cap",
      options: [{ value: "cap", label: "Capital" }, { value: "reg", label: "Regulação e diplomacia" }, { value: "cad", label: "Cadeia de valor" }],
    },
    ],
    outputs: [
    ],
    note: "Doze cruzamentos entre parceiro e vetor. Cada célula devolve o que está em jogo naquele cruzamento, sempre por estrutura e nunca por nome de empresa, de fabricante ou de banco. Note que nenhum parceiro é \"melhor\" em abstrato: a leitura muda inteiramente conforme o vetor pelo qual se pergunta, e dizer isso é o conteúdo.",
  },
  {
    id: "m12-inst-06",
    kind: "quebra-cabeca",
    title: "Roteador de instrumento comercial — a base jurídica decide o comportamento",
    formula: null,
    fields: [
      {
      id: "rt-inst",
      label: "Instrumento",
      unit: null,
      kind: "select",
      defaultValue: "emerg",
      options: [{ value: "emerg", label: "Poderes de emergência econômica" }, { value: "s232", label: "Tarifa setorial por segurança nacional" }, { value: "s301", label: "Ação por prática comercial desleal" }, { value: "s122", label: "Tarifa geral temporária de balanço" }],
    },
      {
      id: "rt-prod",
      label: "Classe de produto brasileiro",
      unit: null,
      kind: "select",
      defaultValue: "energia",
      options: [{ value: "energia", label: "Petróleo e produtos energéticos" }, { value: "etanol", label: "Etanol e açúcar" }, { value: "aco", label: "Aço e alumínio" }, { value: "terras", label: "Terras-raras e minerais críticos" }, { value: "agro", label: "Café, carne e suco" }, { value: "manuf", label: "Manufaturados diversos" }],
    },
    ],
    outputs: [
    ],
    note: "Escolha o instrumento e a classe de produto. O instrumento devolve quem tem autoridade, qual o prazo típico, qual o controle judicial aplicável, e qual o tratamento daquela classe de produto sob aquele instrumento. Vinte e quatro combinações. O objetivo é treinar o reflexo de perguntar sob qual dispositivo antes de perguntar de quantos por cento . O instrumento descreve mecanismo jurídico e tratamento setorial. Ele não avalia o mérito de nenhuma medida, não estima impacto econômico e não toma posição sobre qual país tem razão em disputa comercial ou diplomática.",
  },
  {
    id: "m12-inst-07",
    kind: "quebra-cabeca",
    title: "Diagnóstico de prontidão de dado de carbono para exportação",
    formula: null,
    fields: [
      {
      id: "pc-fr",
      label: "Fronteira do inventário declarado",
      unit: null,
      kind: "select",
      defaultValue: "corp",
      options: [{ value: "corp", label: "Corporativo — escopos 1 e 2 da organização" }, { value: "portao", label: "Produto, portão a portão" }, { value: "berco", label: "Produto, berço ao portão" }],
    },
      {
      id: "pc-vr",
      label: "Verificação do inventário",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Nenhuma" }, { value: "int", label: "Interna, pela própria empresa" }, { value: "ter", label: "Por terceiro acreditado" }],
    },
      {
      id: "pc-pr",
      label: "Dado primário de precursor",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não obtido dos fornecedores" }, { value: "parc", label: "Parcial, principais fornecedores" }, { value: "sim", label: "Completo, com cadeia de custódia" }],
    },
      {
      id: "pc-cd",
      label: "Preço de carbono doméstico reconhecível",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Sem regime operacional no país" }, { value: "reg", label: "Regime em regulamentação" }, { value: "op", label: "Regime operacional e reconhecido" }],
    },
    ],
    outputs: [
    ],
    note: "Quatro eixos categóricos, oitenta e uma combinações. O instrumento devolve se a posição de carbono de um exportador brasileiro é defensável perante um comprador que precisa comprovar emissão incorporada — e, quando não é, aponta qual eixo bloqueia. Ele não calcula custo, não estima certificado e não projeta preço: a fatura do mecanismo europeu tem metodologia própria, e simular valor aqui seria produzir número sem base.",
  },
  {
    id: "m12-inst-08",
    kind: "quebra-cabeca",
    title: "Régua de maturidade de projeto anunciado",
    formula: null,
    fields: [
      {
      id: "mp-sel",
      label: "Item em foco",
      unit: null,
      kind: "select",
      defaultValue: "i1",
      options: [{ value: "i1", label: "Contrato de compra de energia" }, { value: "i2", label: "Comprador contratado" }, { value: "i3", label: "Financiamento e decisão final de investimento" }, { value: "i4", label: "Licenciamento ambiental" }, { value: "i5", label: "Acesso e conexão à rede" }, { value: "i6", label: "Terreno e direito de uso" }, { value: "i7", label: "Maturidade de engenharia" }, { value: "i8", label: "Fornecimento de equipamento principal" }, { value: "i9", label: "Habilitação a regime de incentivo" }],
    },
      {
      id: "mp-e-i1",
      label: "Contrato de compra de energia",
      unit: null,
      kind: "select",
      defaultValue: "0",
      options: [{ value: "0", label: "Sem contrato; suprimento apenas indicado em estudo" }, { value: "1", label: "Memorando ou carta de intenção com fornecedor" }, { value: "2", label: "Contrato firmado, com preço, prazo e garantia definidos" }],
    },
      {
      id: "mp-e-i2",
      label: "Comprador contratado",
      unit: null,
      kind: "select",
      defaultValue: "0",
      options: [{ value: "0", label: "Sem comprador identificado; mercado descrito como \"potencial\"" }, { value: "1", label: "Memorando de entendimento ou carta de interesse não vinculante" }, { value: "2", label: "Contrato de compra vinculante, com volume, prazo e cláusula de rescisão" }],
    },
      {
      id: "mp-e-i3",
      label: "Financiamento e decisão final de investimento",
      unit: null,
      kind: "select",
      defaultValue: "0",
      options: [{ value: "0", label: "Sem estrutura de capital definida" }, { value: "1", label: "Mandato de estruturação, carta de interesse de financiador ou termo indicativo" }, { value: "2", label: "Capital comprometido e decisão final de investimento tomada" }],
    },
      {
      id: "mp-e-i4",
      label: "Licenciamento ambiental",
      unit: null,
      kind: "select",
      defaultValue: "0",
      options: [{ value: "0", label: "Não protocolado" }, { value: "1", label: "Protocolado ou licença prévia obtida" }, { value: "2", label: "Licença de instalação obtida" }],
    },
      {
      id: "mp-e-i5",
      label: "Acesso e conexão à rede",
      unit: null,
      kind: "select",
      defaultValue: "0",
      options: [{ value: "0", label: "Sem consulta ao acesso" }, { value: "1", label: "Parecer de acesso solicitado ou emitido" }, { value: "2", label: "Contrato de uso do sistema assinado" }],
    },
      {
      id: "mp-e-i6",
      label: "Terreno e direito de uso",
      unit: null,
      kind: "select",
      defaultValue: "0",
      options: [{ value: "0", label: "Área apenas indicada" }, { value: "1", label: "Opção de compra, pré-arrendamento ou termo com autoridade portuária" }, { value: "2", label: "Contrato de aquisição ou arrendamento firmado" }],
    },
      {
      id: "mp-e-i7",
      label: "Maturidade de engenharia",
      unit: null,
      kind: "select",
      defaultValue: "0",
      options: [{ value: "0", label: "Estudo conceitual" }, { value: "1", label: "Engenharia básica ou projeto de referência" }, { value: "2", label: "Engenharia detalhada com orçamento fechado" }],
    },
      {
      id: "mp-e-i8",
      label: "Fornecimento de equipamento principal",
      unit: null,
      kind: "select",
      defaultValue: "0",
      options: [{ value: "0", label: "Sem cotação; tecnologia ainda não escolhida" }, { value: "1", label: "Cotação recebida ou reserva de posição em fila de fabricação" }, { value: "2", label: "Pedido firme com prazo de entrega contratado" }],
    },
      {
      id: "mp-e-i9",
      label: "Habilitação a regime de incentivo",
      unit: null,
      kind: "select",
      defaultValue: "0",
      options: [{ value: "0", label: "Não habilitado; regra de acesso ainda não existe" }, { value: "1", label: "Requisitos conhecidos e projeto estruturado para atendê-los" }, { value: "2", label: "Habilitação ou coabilitação concedida por ato administrativo" }],
    },
    ],
    outputs: [
      { id: "mp-pts", label: "Pontuação", unit: null },
      { id: "mp-vin", label: "Itens vinculantes", unit: null },
    ],
    note: "Nove itens de evidência, cada um com três estados: ausente (0), indicativo (1) e vinculante (2). O total vai de 0 a 18 e classifica o estágio real do projeto. A régua não avalia mérito técnico, não estima prazo de entrega e não devolve valor de investimento — devolve apenas a distância entre o que foi anunciado e o que foi comprovado . Ela se aplica a hidrogênio, mas funciona igual para qualquer projeto de infraestrutura energética. Três itens são tratados como críticos : contrato de energia, comprador contratado e financiamento. Um projeto pode acumular pontuação razoável em itens periféricos e continuar sendo um anúncio, se os três críticos estiverem ausentes. A régua sinaliza isso separadamente da pontuação, porque a soma sozinha esconde essa assimetria.",
  },
  {
    id: "m12-inst-09",
    kind: "calculadora",
    title: "Razão reserva-produção — a assimetria medida, não afirmada",
    formula: null,
    fields: [
      {
      id: "rp-rn",
      label: "Reserva nacional",
      unit: "Mt",
      kind: "range",
      defaultValue: 21.0,
      min: 0.1,
      max: 200,
      step: 0.1,
    },
      {
      id: "rp-rm",
      label: "Reserva mundial",
      unit: "Mt",
      kind: "range",
      defaultValue: 85.0,
      min: 1,
      max: 500,
      step: 1,
    },
      {
      id: "rp-pn",
      label: "Produção nacional",
      unit: "kt/ano",
      kind: "range",
      defaultValue: 0.02,
      min: 0,
      max: 500,
      step: 0.01,
    },
      {
      id: "rp-pm",
      label: "Produção mundial",
      unit: "kt/ano",
      kind: "range",
      defaultValue: 390.0,
      min: 1,
      max: 5000,
      step: 1,
    },
    ],
    outputs: [
      { id: "rp-pr", label: "Participação na reserva", unit: null },
      { id: "rp-pp", label: "Participação na produção", unit: null },
      { id: "rp-ra", label: "Razão de assimetria", unit: null },
      { id: "rp-an", label: "Anos de reserva ao ritmo atual", unit: null },
    ],
    note: "Quatro entradas editáveis com fonte declarada. O instrumento devolve a participação do país na reserva mundial, a participação na produção mundial, e a razão entre as duas — que é a medida da assimetria entre dotação e cadeia. Todos os valores de referência são editáveis porque todos mudam de ano e de metodologia. Nenhuma saída é monetária e nenhuma projeta produção futura. \"Anos de reserva ao ritmo atual\" é uma razão aritmética entre estoque e fluxo, não uma previsão de esgotamento nem de vida útil de mina. Ela serve apenas para tornar visível a ordem de grandeza da assimetria: quando o número é absurdamente alto, o que ele revela não é abundância eterna, é ausência de cadeia produtiva.",
  },
  {
    id: "m12-inst-10",
    kind: "explorador",
    title: "Classificador de nome — em que categoria cai, e o que fazer com ele",
    formula: null,
    fields: [
      {
      id: "cn-sel",
      label: "Entidade encontrada",
      unit: null,
      kind: "select",
      defaultValue: "e1",
      options: [{ value: "e1", label: "Estatal estrangeira que controla ativo regulado no Brasil" }, { value: "e2", label: "Empresa privada estrangeira que adquiriu ativo mineral" }, { value: "e3", label: "Empresa brasileira em fato histórico concluído há décadas" }, { value: "e4", label: "Fabricante de módulo, célula de bateria, inversor ou eletrolisador" }, { value: "e5", label: "Plataforma de negociação de energia, de carbono ou marketplace" }, { value: "e6", label: "Provedor comercial de dados e análise de mercado de energia" }, { value: "e7", label: "Operador de sistema ou mercado atacadista estrangeiro" }, { value: "e8", label: "Instituto internacional de pesquisa sem fins lucrativos" }, { value: "e9", label: "Organismo intergovernamental ou banco multilateral do qual o Brasil é sócio" }, { value: "e10", label: "Banco de desenvolvimento bilateral de país estrangeiro" }, { value: "e11", label: "Órgão público brasileiro com mandato legal" }, { value: "e12", label: "Estatal brasileira operando como agente de mercado hoje" }],
    },
    ],
    outputs: [
    ],
    note: "O único instrumento autorreferente do módulo: ele não ensina um fato do mundo, ensina a disciplina do próprio ativo. Escolha o tipo de entidade que apareceu em pesquisa. O instrumento devolve a categoria, se pode ser nomeada, onde pode aparecer, e qual é a substituição correta quando não pode. A pergunta de teste da Categoria 2 não é \"esse nome é interessante?\" — é \"essa menção explica uma estrutura já concluída, ou promove um serviço que o leitor poderia contratar hoje?\". Se a segunda resposta for possível, não é Categoria 2.",
  },
  {
    id: "m12-inst-11",
    kind: "explorador",
    title: "Andaime de conversa — trinta minutos, oito movimentos, sem repetição",
    formula: null,
    fields: [
      {
      id: "an-sel",
      label: "Movimento",
      unit: null,
      kind: "select",
      defaultValue: "00–03",
      options: [{ value: "00–03", label: "Tese" }, { value: "03–07", label: "Grandeza" }, { value: "07–11", label: "Clima" }, { value: "11–15", label: "Carteira" }, { value: "15–19", label: "Comércio" }, { value: "19–23", label: "Padrão" }, { value: "23–27", label: "Aposta" }, { value: "27–30", label: "Fecho" }],
    },
    ],
    outputs: [
    ],
    note: "Percorra em ordem na primeira vez. Depois, treine entrando por movimentos aleatórios, porque em conversa real o interlocutor escolhe o ponto de entrada — e a competência que importa é saber, de qualquer movimento, para onde ir em seguida sem atropelar o que ainda não foi estabelecido.",
  },
];

/** Os catorze exercícios do § Ex. TODOS soltos — a varredura por menção
 *  a aula no enunciado e no gabarito devolve zero. */
export const MODULO_12_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: "ex-12-01",
    kind: 'discursiva',
    prompt: "Exercício 01 · Sustentação — dois minutos sobre o paradoxo, sem citar percentual duas vezes",
    points: 10,
    config: { gabarito: "<b>Enunciado.</b> Você já disse a um investidor que a matriz elétrica brasileira é 86,8% renovável em 2025 e que a produção de petróleo chegou a 3,8 milhões de barris por dia no mesmo ano. Ele responde: \"entendi os números, mas continue — por que isso não é uma contradição?\" Sustente dois minutos sem repetir nenhum dos dois números. <b>Resposta-modelo.</b> Porque as duas colunas ocupam espaços econômicos diferentes. Eletricidade é um vetor doméstico: gera-se e consome-se dentro do país, e a exportação de elétron é limitada por interconexão física. Petróleo é uma commodity global: produz-se para vender fora, e a decisão de produzir depende de custo de extração e preço internacional, não de política energética doméstica. Um país pode descarbonizar seu próprio consumo de eletricidade sem alterar em nada a sua posição como exportador de energia primária, porque as duas coisas atendem mercados diferentes. A tensão real não é física — é de três naturezas: <em>intertemporal</em>, porque ativo de petróleo tem vida útil de décadas e enfrenta risco de demanda de longo prazo; <em>fiscal</em>, porque renda petrolífera pode financiar capacidade produtiva duradoura ou apenas despesa corrente, e a diferença define se a expansão fortalece ou fragiliza o país; e <em>diplomática</em>, porque um país que preside a conferência do clima e expande produção fóssil simultaneamente recebe uma pergunta que outros produtores não recebem." },
  },
  {
    id: "ex-12-02",
    kind: 'discursiva',
    prompt: "Exercício 02 · Atualização — \"a legislação climática americana está financiando forte a expansão solar\"",
    points: 10,
    config: { gabarito: "<b>Enunciado.</b> Um interlocutor afirma isso com naturalidade. O que mudou, desde quando, e com que fonte? <b>Resposta-modelo.</b> Mudou por lei orçamentária sancionada em 4 de julho de 2025, que acelerou a extinção dos créditos fiscais à energia limpa. Especificamente para eólica e solar, os créditos de produção e de investimento passaram a exigir início de obra até 4 de julho de 2026 ou entrada em operação até 31 de dezembro de 2027 — e o prazo de início de obra já venceu. A mesma lei antecipou em cinco anos o fim do crédito ao hidrogênio limpo e criou restrições de assistência material que desqualificam projetos com cadeia de suprimento ligada a entidades estrangeiras designadas. Duas ressalvas mantêm a resposta honesta: tecnologias que não sejam eólica e solar mantiveram prazo bem mais longo, e a aplicação da regra de início de obra seguiu em disputa judicial ao longo de 2026. Fonte: texto da lei e ordens executivas subsequentes, não resumo de imprensa. Para reverificar no futuro, o caminho é o texto consolidado dos artigos 45Y e 48E do código tributário americano e a orientação da autoridade tributária." },
  },
  {
    id: "ex-12-03",
    kind: 'discursiva',
    prompt: "Exercício 03 · Articulação — \"como vocês podem ser líderes em renovável e ainda importar derivados de petróleo?\"",
    points: 10,
    config: { gabarito: "<b>Enunciado.</b> Responda sem negar nenhum dos dois lados. <b>Resposta-modelo.</b> Porque petróleo bruto e derivado são produtos diferentes, e ser exportador líquido de um não implica autossuficiência no outro. O parque de refino de um país é configurado para um perfil específico de óleo e de demanda; quando o óleo produzido tem características que atendem melhor a compradores externos, e quando a demanda doméstica por um derivado específico cresce mais rápido que a capacidade de refino, a solução economicamente racional é exportar o bruto e importar o derivado. Isso não é incoerência contábil, é especialização. E não tem relação com a matriz elétrica: derivado de petróleo no Brasil vai majoritariamente para transporte, que é o setor onde estão praticamente metade das emissões de energia do país e onde a renovabilidade é de 26,1%, não de 87%. A resposta completa termina apontando que é exatamente por isso que eletrificar transporte e processo industrial é o maior salto de descarbonização disponível ao Brasil — a eletricidade que substituiria o combustível já é limpa." },
  },
  {
    id: "ex-12-04",
    kind: 'discursiva',
    prompt: "Exercício 04 · Classificação de nome — quatro entidades apareceram na sua pesquisa",
    points: 10,
    config: { gabarito: "<b>Enunciado.</b> Classifique cada uma na taxonomia de seis categorias e diga o que fazer com ela: (a) um fabricante asiático de células de bateria; (b) uma agência intergovernamental de energia cujo relatório traz o dado que você quer citar; (c) uma distribuidora brasileira adquirida por capital estatal estrangeiro em 2017; (d) uma plataforma internacional de dados de mercado de energia. <b>Resposta-modelo.</b> (a) <b>Categoria 3</b> — fabricante de equipamento. Proibido em qualquer forma. Substitua por \"um pequeno número de fabricantes de grande escala concentra a cadeia de célula\". (b) <b>Categoria 5</b> — organismo intergovernamental. Permitido citar como fonte em referência bibliográfica e em nota de fonte; nunca como personagem da prosa. (c) Depende do uso. Se a menção explicar a estrutura de controle atual e for necessária ao argumento, tende a <b>Categoria 1</b>: descreva por estrutura, sem nome. A <b>Categoria 2</b> só se aplica se a menção explicar uma estrutura já concluída e não promover serviço contratável hoje — e, no caso de uma distribuidora ativa, promove. Além disso, análise de empresa individual pertence a outro bloco do currículo. (d) <b>Categoria 4</b> — plataforma de dados concorrente ou adjacente. Proibida no ativo publicado mesmo quando listada como recurso recomendado. Use na pesquisa privada; substitua por fonte brasileira primária no texto." },
  },
  {
    id: "ex-12-05",
    kind: 'discursiva',
    prompt: "Exercício 05 · Sustentação — dois minutos sobre a relação com a China sem usar a palavra \"dependência\"",
    points: 10,
    config: { gabarito: "<b>Enunciado.</b> A restrição é deliberada: a palavra carrega julgamento e encurta a análise. <b>Resposta-modelo.</b> A relação tem três camadas com dinâmicas diferentes. Na camada de ativos regulados, há capital estatal estrangeiro controlando transmissão e distribuição, sob regulação brasileira e com receita definida em revisão tarifária — capital de horizonte longo, tolerante a retorno regulado, estruturalmente diferente de fundo com prazo de saída. Na camada de equipamento, um pequeno número de fabricantes de grande escala concentra a cadeia global de módulo, inversor e célula de bateria, e a expansão solar brasileira foi construída sobre essa cadeia; há montagem local, mas a etapa de célula, onde está o valor tecnológico, permanece externa. Na camada comercial, o padrão agregado é matéria-prima em troca de manufatura. A pergunta analítica que ordena as três é sempre a mesma: se essa fonte parasse por seis meses, existe alternativa a que preço e em que prazo? A resposta muda por camada — baixa exposição no ativo regulado, exposição imediata no equipamento, exposição de preço e câmbio no comércio. E a conclusão operacional não é ruptura: é criar segunda alternativa qualificada, o que muda a posição de negociação com a primeira mesmo comprando pouco dela." },
  },
  {
    id: "ex-12-06",
    kind: 'discursiva',
    prompt: "Exercício 06 · Atualização — \"o Brasil tem R$ 18,3 bilhões em incentivo ao hidrogênio\"",
    points: 10,
    config: { gabarito: "<b>Enunciado.</b> A afirmação é verdadeira ou incompleta? O que você responde? <b>Resposta-modelo.</b> É verdadeira quanto ao texto da lei e incompleta quanto ao estado. O valor está na Lei nº 14.990, de 27 de setembro de 2024, que institui o programa de desenvolvimento do hidrogênio de baixa emissão de carbono com crédito fiscal de até esse montante, em limites anuais escalonados. Duas ressalvas obrigatórias. Primeira: a janela de anos em que o crédito pode ser concedido foi alterada por legislação posterior, então o texto a consultar é o consolidado, não a redação original. Segunda, e mais importante: o programa depende de decreto regulamentador para operar — habilitação, critérios, contabilidade de ciclo de vida — e esse decreto não havia sido publicado na data de verificação, dois anos depois da primeira lei do marco e mais de oito meses depois do anúncio oficial de assinatura iminente. A resposta correta, portanto, não é concordar nem discordar: é perguntar se o decreto já saiu. Um incentivo com prazo de validade legal e sem regra de acesso publicada é um incentivo que ninguém pode requerer." },
  },
  {
    id: "ex-12-07",
    kind: 'discursiva',
    prompt: "Exercício 07 · Articulação — \"se o Brasil tem a segunda maior reserva de terras-raras, por que não domina o mercado?\"",
    points: 10,
    config: { gabarito: "<b>Resposta-modelo.</b> Porque o gargalo global não está no minério. Está na separação química dos elementos, no refino e na fabricação de ímãs permanentes — etapas concentradas majoritariamente em um só país, que domina de longe tanto o refino quanto a manufatura de ímãs. Extrair minério e separar elementos são indústrias diferentes, com tecnologia, capital e escala diferentes; possuir a jazida não dá acesso à cadeia. Os números tornam isso literal: a produção brasileira foi de vinte toneladas em 2024, contra 390 mil toneladas mundiais — menos de um centésimo de um por cento —, com uma única mina em operação comercial, em Goiás, iniciada em janeiro de 2024. E, antes de citar a reserva, é preciso dizer qual: circula 21 milhões de toneladas pelo levantamento internacional e 11,4 milhões pelo levantamento brasileiro, que aplica padrão de classificação mais restritivo. Os dois entram, cada um com sua fonte." },
  },
  {
    id: "ex-12-08",
    kind: 'discursiva',
    prompt: "Exercício 08 · Sustentação — dois minutos sobre a COP30 sem dizer se foi sucesso ou fracasso",
    points: 10,
    config: { gabarito: "<b>Resposta-modelo.</b> Ocorreu em Belém, de 10 a 22 de novembro de 2025. Cerca de 195 partes aprovaram por consenso um conjunto de 29 decisões, que ficou conhecido como Pacote de Belém, cobrindo transição justa, financiamento de adaptação, comércio, gênero e tecnologia. Entre as decisões concretas estão o compromisso de triplicar o financiamento de adaptação até 2035, a conclusão de um roteiro de adaptação que estabelece o trabalho de 2026 a 2028, e a adoção de 59 indicadores voluntários para a meta global de adaptação. Não houve consenso para incluir no texto final linguagem de eliminação de combustíveis fósseis nem linguagem explícita sobre desmatamento; a presidência brasileira respondeu criando, fora do texto de consenso, dois roteiros voluntários sobre esses temas, a serem construídos ao longo de 2026. A distinção entre decisão aprovada por consenso e iniciativa voluntária de presidência é de natureza jurídica e de força política, e é o que precisa ser dito antes de qualquer juízo. O Brasil segue na presidência até novembro de 2026, quando ela passa à COP31." },
  },
  {
    id: "ex-12-09",
    kind: 'discursiva',
    prompt: "Exercício 09 · Classificação de número — três cifras chegaram numa apresentação",
    points: 10,
    config: { gabarito: "<b>Enunciado.</b> \"Capacidade instalada de 218 GW\", \"50 GW de geração distribuída\" e \"US$ 4 bilhões em projeto de hidrogênio\". Que perguntas você faz antes de repetir cada uma? <b>Resposta-modelo.</b> Para as duas primeiras: capacidade instalada não é energia gerada, e essa é a confusão de grandeza mais comum do setor. Pergunte a data de referência, a fonte — que para capacidade é o regulador ou o operador, não o balanço energético — e se o número inclui ou exclui geração distribuída, porque somá-los duas vezes é erro frequente. Para a terceira: pergunte o estágio. Valor anunciado, valor com decisão final de investimento tomada, e valor desembolsado são três categorias que não se somam. Aplique a régua de maturidade: existe contrato de energia, comprador contratado e financiamento aprovado? Sem esses três, o número é uma intenção com uma cifra ao lado, e a redação correta é \"anunciou intenção de desenvolver projeto de até X, condicionado a energia, licenciamento, contrato de compra e financiamento\"." },
  },
  {
    id: "ex-12-10",
    kind: 'discursiva',
    prompt: "Exercício 10 · Articulação — um cientista político pergunta se a presidência brasileira da COP é substância ou protocolo",
    points: 10,
    config: { gabarito: "<b>Resposta-modelo.</b> A pergunta é boa e a resposta honesta tem os dois lados. É substância no sentido de que a presidência define agenda, conduz negociação e pode criar instrumentos — a brasileira criou dois roteiros voluntários justamente sobre os temas em que o consenso falhou, o que é uso ativo da prerrogativa. É protocolo no sentido de que a presidência não tem poder de impor decisão: o texto final depende de consenso das partes, e a ausência de linguagem sobre combustível fóssil e desmatamento no Pacote de Belém demonstra exatamente esse limite. A leitura útil é uma terceira: o teste de substância não é o que a presidência conseguiu aprovar em Belém, é <b>o que o país faz com o mandato até novembro de 2026 e o que implementa domesticamente depois</b>. Conferência produz texto; texto vira efeito por plano nacional, orçamento, regulamento e mensuração — e nenhuma dessas quatro etapas acontece automaticamente. É um critério datado e verificável, o que é melhor do que uma opinião." },
  },
  {
    id: "ex-12-11",
    kind: 'discursiva',
    prompt: "Exercício 11 · Sustentação — dois minutos sobre por que a tarifa americana atingiu etanol e não energia",
    points: 10,
    config: { gabarito: "<b>Resposta-modelo.</b> Porque o critério que organiza a lista de isenção não é diplomático, é de interesse industrial do importador. Petróleo bruto, produtos energéticos e terras-raras são insumos que a indústria doméstica do país importador precisa e não produz em quantidade suficiente; taxá-los seria elevar o custo da própria cadeia interna — motivo pelo qual energia apareceu isenta em todas as configurações da medida desde 2025. Etanol é produto processado que compete diretamente com produção doméstica, e o acesso ao mercado de etanol consta expressamente entre as práticas questionadas na investigação que originou a medida. Açúcar segue a mesma lógica. O padrão, portanto, é consistente e independe de governo: a matéria-prima passa, o produto transformado é taxado. Isso confirma, em um caso concreto, o diagnóstico do vetor cadeia de valor — o Brasil tem acesso preferencial de fato exatamente onde é fornecedor primário, e enfrenta barreira exatamente na etapa em que tentaria agregar valor. E a leitura correta termina com a ressalva de método: a incidência é definida por código tarifário, produto a produto, não por nome de setor." },
  },
  {
    id: "ex-12-12",
    kind: 'discursiva',
    prompt: "Exercício 12 · Atualização — \"a política brasileira de minerais críticos entrou em vigor\"",
    points: 10,
    config: { gabarito: "<b>Resposta-modelo.</b> Não entrou. O que existe é o Projeto de Lei nº 2.780, de 2024, que institui a Política Nacional de Minerais Críticos e Estratégicos e cria um conselho nacional para industrialização desses minerais, vinculado à Presidência da República. Ele foi aprovado pela Câmara dos Deputados em maio de 2026 e tramita no Senado Federal, com pedido protocolado de tramitação conjunta com projeto correlato — o que tende a alongar o rito. Aprovação em uma Casa não é lei. A consequência prática mais relevante é que o Brasil <b>não tem lista oficial de minerais críticos ou estratégicos</b>: a definição dessa lista seria atribuição do conselho a ser criado. Enquanto isso, o marco mineral em vigor é o dos anos 1960, e esse vazio já teve efeito diplomático concreto — a negociação de cooperação com os Estados Unidos em minerais críticos foi condicionada, pelo lado brasileiro, à consolidação do marco. Para reverificar: a ficha de tramitação nos portais da Câmara e do Senado." },
  },
  {
    id: "ex-12-13",
    kind: 'discursiva',
    prompt: "Exercício 13 · Articulação — \"vocês não são um hub verde, vocês são uma fronteira de commodity\"",
    points: 10,
    config: { gabarito: "<b>Enunciado.</b> A provocação é dura e parcialmente verdadeira. Responda sem concordar integralmente nem negar. <b>Resposta-modelo.</b> A parte verdadeira é o vetor cadeia de valor, e vale reconhecê-la de saída porque negá-la destrói credibilidade: em quatro das cinco frentes deste bloco, o Brasil está do lado do recurso primário e não da etapa de transformação. Terras-raras é o caso extremo — algo em torno de um quarto da reserva mundial pelo levantamento internacional, menos de um por cento da produção. Etanol é o caso confirmado por terceiro: o produto transformado foi taxado, a matéria-prima não. A parte que a provocação omite é que a posição não é estática e tem um ativo raro por trás. A eletricidade brasileira tem fator de emissão de 64,8 quilogramas de CO₂ equivalente por megawatt-hora, o que é vantagem material e verificável para qualquer produto eletrointensivo — alumínio, aço em rota elétrica, materiais de bateria, processamento de dados. Isso não é narrativa: é um número que um comprador europeu sujeito a ajuste de carbono na fronteira consegue usar. A conclusão honesta é que o Brasil tem a <em>condição</em> de agregar valor e ainda não tem a <em>cadeia</em>, e que a diferença entre as duas é execução — infraestrutura, capital, escala e demanda contratada —, não geologia nem recurso natural." },
  },
  {
    id: "ex-12-14",
    kind: 'discursiva',
    prompt: "Exercício 14 · Sustentação final — \"então o Brasil é uma boa aposta ou não?\"",
    points: 10,
    config: { gabarito: "<b>Resposta-modelo.</b> A resposta correta não é sim nem não, e não por diplomacia — por imprecisão. \"Sim\" escolhe a coluna renovável; \"não\" escolhe a coluna fóssil; as duas descartam metade do fato. A estrutura da resposta tem três partes. Primeira: articule as duas colunas em uma frase cada, com um número datado em cada uma. Segunda: explique por que coexistem sem contradição física — não há incompatibilidade entre gerar eletricidade limpa e produzir petróleo para exportação, porque atendem mercados diferentes; a tensão é intertemporal, fiscal e diplomática. Terceira, e é a que devolve a conversa: pergunte <b>em qual das duas colunas o interlocutor está exposto</b>. Quem investe em geração renovável está exposto à coluna verde e ao risco de rede, curtailment e preço local. Quem compra commodity está exposto à coluna fóssil e ao risco de demanda de longo prazo. Quem exporta manufatura para a Europa está exposto ao vetor regulação, e a nenhuma das duas colunas diretamente. \"O Brasil é uma boa aposta\" não é uma pergunta até que se diga aposta em quê — e explicitar a premissa antes de responder é a mesma disciplina que o Módulo 11 ensinou para proposta comercial." },
  },
];

export const MODULO_12_AULAS: CurriculumAula[] = [
  {
    id: "aula-12-01",
    moduleId: 'modulo-12',
    number: 1,
    totalInModule: 8,
    title: "Oitenta e sete por cento de quê, exatamente",
    subtitle: "O paradoxo",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["geo-05-canavial-colheitadeira.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_12.find((i) => i.id === "m12-inst-02")!, INSTRUMENTOS_MODULO_12.find((i) => i.id === "m12-inst-03")!],
  },
  {
    id: "aula-12-02",
    moduleId: 'modulo-12',
    number: 2,
    totalInModule: 8,
    title: "O que foi decidido, o que ficou de fora, e por que a distinção é o conteúdo",
    subtitle: "COP30 e o ciclo climático",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["geo-08-globo-terrestre.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_12.find((i) => i.id === "m12-inst-04")!],
  },
  {
    id: "aula-12-03",
    moduleId: 'modulo-12',
    number: 3,
    totalInModule: 8,
    title: "Complementaridade forte, concentração alta, e a diferença entre as duas",
    subtitle: "China",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["geo-10-painel-solar-container.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_12.find((i) => i.id === "m12-inst-05")!],
  },
  {
    id: "aula-12-04",
    moduleId: 'modulo-12',
    number: 4,
    totalInModule: 8,
    title: "Duas políticas simultâneas que puxam em direções opostas",
    subtitle: "Estados Unidos",
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
    instruments: [INSTRUMENTOS_MODULO_12.find((i) => i.id === "m12-inst-06")!],
  },
  {
    id: "aula-12-05",
    moduleId: 'modulo-12',
    number: 5,
    totalInModule: 8,
    title: "Quando a regra é o produto de exportação",
    subtitle: "Europa e capital multilateral",
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
    instruments: [INSTRUMENTOS_MODULO_12.find((i) => i.id === "m12-inst-07")!],
  },
  {
    id: "aula-12-06",
    moduleId: 'modulo-12',
    number: 6,
    totalInModule: 8,
    title: "Duas leis sancionadas, um regime que ainda não opera",
    subtitle: "Hidrogênio de baixa emissão",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["geo-07-cilindro-hidrogenio.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_12.find((i) => i.id === "m12-inst-08")!],
  },
  {
    id: "aula-12-07",
    moduleId: 'modulo-12',
    number: 7,
    totalInModule: 8,
    title: "Vinte e cinco por cento da reserva, menos de um por cento da produção",
    subtitle: "Minerais críticos e estratégicos",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["geo-06-amostras-minerio.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_12.find((i) => i.id === "m12-inst-09")!],
  },
  {
    id: "aula-12-08",
    moduleId: 'modulo-12',
    number: 8,
    totalInModule: 8,
    title: "Os trinta minutos: oito movimentos, nenhum argumento repetido",
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
    instruments: [INSTRUMENTOS_MODULO_12.find((i) => i.id === "m12-inst-10")!, INSTRUMENTOS_MODULO_12.find((i) => i.id === "m12-inst-11")!],
  },
];

export const getAulaModulo12 = (id: string): CurriculumAula | null =>
  MODULO_12_AULAS.find((a) => a.id === id) ?? null;
