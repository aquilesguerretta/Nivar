// alexandria-modulo-07-content.ts
// Bloco 7 — Estrutura Institucional Detalhada. Nível 2, track 'brasil'.
// Segundo módulo da Trilha 2.
//
// EXTRAÍDO de `Alexandria modulos/alexandria_modulo07.html` — 378.316
// bytes, dos quais 253.154 de markup e 112.814 de <script>. É o maior
// módulo do currículo até aqui.
//
// CATÁLOGO CONFIRMADO na FOUNDRY, não presumido:
// `{ id: 'bloco-07', level: 2, track: 'brasil', illustrationPrefix: 'ins-' }`.
//
// ── VOCABULÁRIO MEDIDO ────────────────────────────────────────
// Seletores dos Módulos 01-03: ZERO. É o vocabulário dos Módulos 04-06
// (`sec-id` 17 · `lede` 17 · `inst` 10 · `det-bd` 19 · `term` 118).
//
// ── CONTAGEM REAL ─────────────────────────────────────────────
//     | sinal      | prosa da fonte        | markup |
//     | aulas      | 7 seções `Aula NN`    | 7 |
//     | exercícios | §Ex "Doze exercícios" | 12 <details> |
//     | glossário  | §Lex "118 termos"     | 118 .term |
//
// 17 seções = 7 aulas + 10 de aparato. **141 blocos de apostila.**
//
// ── OS DOZE EXERCÍCIOS SÃO TODOS SOLTOS ───────────────────────
// Varredura por /[Aa]ula\s*\d+/ no enunciado E no gabarito dos doze:
// ZERO ocorrência. Vínculo não inventado — mesma situação dos Módulos
// 04 e 06.
//
// ── video: null, MEDIDO ───────────────────────────────────────
// Zero <video>, <iframe>, youtube, vimeo e .mp4 no arquivo inteiro.

import type { CurriculumAula, Instrument, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';


/** Dados dos SETE exploradores, literais dos arrays `var D` / `var M`
 *  do <script> da fonte. Vivem aqui e não no markup porque a fonte gera
 *  cada grid/chip por script — o HTML traz só o container vazio.
 *
 *  Cada IIFE declara o array com o MESMO nome (`var D`), então localizar
 *  por nome não serve: a busca é ancorada no id do container e pega o
 *  PRIMEIRO array depois dele. Ancorar "antes" devolve o array do
 *  instrumento anterior — foi o deslocamento que a primeira tentativa
 *  produziu, e é por isso que cada conjunto foi conferido contra o
 *  título do próprio instrumento antes de entrar aqui. */
export const MODULO_07_EXPLORADORES: Record<string, ReadonlyArray<{ rotulo: string; corpo: string }>> = {
  '10': [
    { rotulo: "JAN · Janeiro", corpo: "3\nInício do ciclo anual: revisão de premissas, orçamentos e posições contratuais para o ano. · Período úmido em curso na maior parte do sistema — a leitura de armazenamento ganha peso. · Fechamento contábil do ano anterior nas empresas do setor, com divulgações subsequentes.\nReconstrua o calendário do ano: liste as datas contratuais de reajuste das distribuidoras que importam para você, os ciclos de revisão em curso e as consultas públicas abertas. Uma planilha feita em janeiro rende o ano inteiro." },
    { rotulo: "FEV · Fevereiro", corpo: "3\nConsultas públicas dos ciclos de planejamento costumam abrir neste período. · Consolidação dos dados do ano anterior nas séries oficiais. · Continuação do período úmido — o pico de armazenamento ainda está à frente na maior parte dos anos.\nEntre nas consultas públicas abertas. É aqui que a contribuição técnica ainda altera texto — em outubro, o mesmo argumento já não tem onde entrar." },
    { rotulo: "MAR · Março", corpo: "3\nEncerramento de consultas públicas abertas em fevereiro. · Aproximação do fim do período úmido no centro do sistema — a leitura de armazenamento no ponto máximo se aproxima. · Divulgações de resultados anuais das empresas do setor.\nRegistre o armazenamento no fim do período úmido. É a referência contra a qual todo o restante do ano será lido — e é o número que mais aparece em conversa de setor no segundo semestre." },
    { rotulo: "ABR · Abril", corpo: "3\nTransição para o período seco na maior parte do sistema interligado. · Consultas públicas de temas de transição energética e de planejamento podem abrir neste período. · Ciclo de reajustes tarifários com datas contratuais concentradas em vários grupos de concessões.\nCompare o tom do comunicado do comitê de monitoramento deste mês com o de três meses atrás. A entrada do período seco é quando o vocabulário muda, e a mudança precede a manchete." },
    { rotulo: "MAI · Maio", corpo: "3\nPeríodo seco em curso: o acompanhamento de armazenamento e de despacho térmico ganha centralidade. · Consultas públicas em andamento nos ciclos de planejamento e de regulação. · Reajustes tarifários de concessões com data contratual no período.\nAcompanhe a série de revisões semanais do programa mensal. É no período seco que a diferença entre duas revisões consecutivas carrega mais informação." },
    { rotulo: "JUN · Junho", corpo: "3\nEncerramento de consultas públicas abertas no bimestre anterior. · Período seco consolidado; atenção institucional ao suprimento tipicamente mais alta. · Preparação dos ciclos de certame do segundo semestre.\nLeia a portaria de diretrizes de certames já publicada. O produto do leilão é definido ali, antes do edital — e é a informação que decide participação." },
    { rotulo: "JUL · Julho", corpo: "3\nAprovação por portaria ministerial do ciclo do plano decenal em curso — foi o caso do ciclo de horizonte 2035, aprovado em julho de 2026. · Meio do período seco; leitura de risco de atendimento no ponto de maior atenção do ano. · Preparação e publicação de editais de certames do segundo semestre.\nAbra o plano decenal aprovado e vá direto ao caderno de premissas. O que mudou nas premissas em relação ao ciclo anterior explica quase tudo o que mudou nos resultados." },
    { rotulo: "AGO · Agosto", corpo: "3\nPeríodo seco em curso, com acompanhamento intensivo do suprimento. · Concentração de certames e de processos de contratação no segundo semestre. · Publicações anuais do balanço energético e de anuários setoriais tipicamente no segundo semestre.\nPrepare a leitura do balanço energético: saiba de antemão quais séries você vai extrair e para quê. Documento anual mal aproveitado é o desperdício mais comum de quem estuda o setor." },
    { rotulo: "SET · Setembro", corpo: "3\nTransição para o fim do período seco na maior parte do sistema. · Certames de energia e de transmissão tipicamente concentrados no período. · Consultas públicas de regulação em ciclos com vigência prevista para o ano seguinte.\nMonitore os despachos de abertura de consulta pública. Quem descobre a consulta pelo texto final descobre tarde; quem descobre pelo despacho de abertura entra na janela." },
    { rotulo: "OUT · Outubro", corpo: "3\nAproximação do início do período úmido na maior parte do sistema. · Certames e processos de contratação em curso. · Planejamento do ano seguinte nas empresas do setor.\nFaça o balanço do período seco: armazenamento observado contra o previsto, despacho térmico efetivo, comportamento do preço de curto prazo. É o insumo da sua leitura do ano seguinte." },
    { rotulo: "NOV · Novembro", corpo: "3\nInício do período úmido na maior parte do sistema interligado. · Vigência de normas com prazo definido para o início do ano seguinte começa a ser preparada. · Cronogramas legais e regulatórios com marcos de novembro — o calendário de abertura da baixa tensão tem marcos legais nesse mês, em anos definidos em lei.\nVerifique quais normas entram em vigor em janeiro. Adaptação de sistema, de contrato e de processo precisa começar agora, não na véspera." },
    { rotulo: "DEZ · Dezembro", corpo: "3\nFechamento do ano: posições contratuais, orçamentos e revisão de premissas. · Período úmido em curso; primeiras leituras de recuperação de armazenamento. · Encerramento de processos regulatórios com vigência prevista para o ano seguinte.\nFeche o caderno do ano: o que você previu, o que aconteceu, e qual instituição você endereçou errado pelo menos uma vez. A terceira pergunta é a que mais ensina." },
  ],
  '02': [
    { rotulo: "Legislativo · Lei ordinária", corpo: "Ato do Congresso Nacional, sancionado pela Presidência. É o piso de competência de tudo o que vem abaixo: nenhum outro instrumento do setor pode criar obrigação que a lei não autorize.\nQuem emite · Congresso Nacional, com sanção presidencial.\nQuando alguém diz que \"a regra é lei\", pergunte qual. Boa parte do que o setor chama de lei é resolução — e a diferença é de anos no prazo de mudança." },
    { rotulo: "Executivo · urgência · Medida provisória", corpo: "Ato da Presidência com força de lei, submetido a prazo de apreciação pelo Congresso. Produz efeito desde a edição e pode perdê-lo se não for convertida.\nQuem emite · Presidência da República, em hipótese de relevância e urgência.\nÉ o instrumento que mais rápido muda o setor e o mais arriscado de tratar como definitivo. Modelar um fluxo de caixa de vinte anos sobre medida provisória não convertida é assumir risco político como se fosse risco de projeto." },
    { rotulo: "Executivo · regulamento · Decreto", corpo: "Ato da Presidência que regulamenta lei ou dispõe sobre organização da administração. No setor elétrico, decretos regulamentam mecanismos criados em lei e definem detalhes de funcionamento de órgãos e de programas.\nQuem emite · Presidência da República.\nDecreto é o degrau onde a lei vira mecanismo. Quando uma lei setorial sai e \"nada acontece\", frequentemente falta o decreto — e é ele, não a lei, o gatilho que destrava o cronograma." },
    { rotulo: "Conselho · política · Resolução do conselho de política", corpo: "Deliberação do colegiado de assessoramento da Presidência para a política energética, homologada pela Presidência. Fixa diretriz e, na maioria das vezes, delega a regulamentação.\nQuem emite · Conselho Nacional de Política Energética, com homologação presidencial.\nAto de maior densidade política, menor autoexecutabilidade. Quase sempre a frase operativa é \"fica o ministério autorizado a\" ou \"caberá à agência regulamentar\" — e é aí que a janela de influência de verdade se abre." },
    { rotulo: "Ministério · política · Portaria ministerial", corpo: "Ato do ministério que implementa política, fixa diretriz de certame, cria grupo de trabalho, abre consulta pública de política ou disciplina matéria dentro da competência da pasta.\nQuem emite · Ministério de Minas e Energia — por vezes em portaria normativa, por vezes em portaria conjunta com outra pasta.\nA portaria de diretriz de leilão é o documento mais subestimado do setor. Ela define produto, prazo de suprimento e regras de participação antes do edital — quem lê a portaria decide se vai ao certame semanas antes de quem espera o edital." },
    { rotulo: "Agência · norma · Resolução normativa", corpo: "Ato normativo geral e abstrato da agência reguladora. Cria obrigação diretamente oponível ao agente e vale para todos os que estão na hipótese.\nQuem emite · Diretoria colegiada da agência, por voto em reunião pública.\nÉ o único instrumento do setor com janela formal de participação <em>e</em> obrigação direta. Contribuição técnica documentada em consulta pública entra no processo e precisa ser respondida de forma fundamentada — o que a torna o canal de influência de melhor relação custo-benefício que existe para um agente médio." },
    { rotulo: "Agência · caso concreto · Resolução homologatória", corpo: "Ato da agência que homologa resultado de um processo específico — tipicamente tarifas de uma distribuidora após reajuste ou revisão. É individual, não geral.\nQuem emite · Diretoria colegiada da agência.\nÉ o ato que mais aparece na conta de luz e o que menos aparece na conversa. Saber a data contratual de reajuste da distribuidora que atende uma planta é saber, com um ano de antecedência, quando o custo muda." },
    { rotulo: "Agência · outorga · Resolução autorizativa", corpo: "Ato da agência que autoriza — implantação de central geradora, transferência de controle, alteração de característica técnica, entre outros. É título, não é norma.\nQuem emite · Diretoria colegiada da agência, ou superintendência por delegação, conforme o caso.\nA confusão mais cara do setor mora aqui: outorga não é licença ambiental, não é acesso ao sistema e não é receita. São quatro trilhos paralelos com prazos independentes, e um projeto trava no mais lento deles." },
    { rotulo: "Agência · execução · Despacho", corpo: "Ato de execução da agência — decide requerimento, dá andamento a processo, aplica norma existente a um caso, abre consulta ou audiência pública.\nQuem emite · Diretoria, superintendências ou órgãos internos, conforme competência delegada.\nÉ por despacho que a consulta pública abre. Quem monitora só resolução normativa descobre o processo quando ele já está em análise de contribuições — ou seja, com a janela de influência fechando." },
    { rotulo: "Operador · técnico · Procedimento de rede", corpo: "Conjunto de documentos técnicos que disciplina a operação e o acesso ao sistema interligado. É proposto pelo operador e aprovado pela agência — e nenhum dos dois faz a etapa do outro.\nQuem emite · Proposto pelo operador do sistema; aprovado por ato da agência.\nA regra técnica que mais afeta a operação de uma usina raramente está numa resolução normativa — está num módulo de procedimento de rede. Quem só monitora o diário oficial não vê a mudança até ela já estar valendo." },
    { rotulo: "Câmara · comercial · Regras e procedimentos de comercialização", corpo: "Corpo de regras que disciplina medição, contabilização, garantia e liquidação. É aplicado pela câmara de comercialização e aprovado pela agência.\nQuem emite · Aplicado pela câmara de comercialização; aprovado por ato da agência.\nNem o operador nem a câmara aprovam as próprias regras. É a simetria que fecha a arquitetura: quem executa não normatiza, e quem normatiza não executa. Enunciar isso corretamente numa conversa técnica vale mais do que recitar dez siglas." },
  ],
  '03': [
    { rotulo: "Pergunta 01 · Quanta demanda o país projeta para os próximos dez anos?", corpo: "Projeção decenal de carga e de consumo, por subsistema e por classe, com premissas macroeconômicas declaradas e cenários alternativos.\nProduto a abrir · Plano decenal de expansão de energia — ciclo anual, publicado após consulta pública e aprovado por portaria ministerial. O ciclo vigente em julho de 2026 é o de horizonte 2026–2035.\nA pergunta que separa quem leu de quem citou: <em>qual é o cenário e qual é a sensibilidade?</em> Quem responde isso em segundos já demonstrou que abriu o documento." },
    { rotulo: "Pergunta 02 · Quanto o país consumiu por fonte e por setor no ano passado?", corpo: "Contabilidade energética consolidada do país: oferta e consumo por fonte, por setor e por região, com séries históricas longas e unidades padronizadas.\nProduto a abrir · Balanço energético nacional — publicação anual da empresa de planejamento, com síntese e versão completa, mais séries históricas em planilha.\nA distinção matriz energética × matriz elétrica é o teste mais rápido de rigor que existe numa conversa de setor — e o balanço é o documento que a resolve." },
    { rotulo: "Pergunta 03 · Que futuro de longo prazo o Estado considera plausível?", corpo: "Estudo de horizonte longo, por cadernos temáticos, que explora trajetórias e não fixa metas contratuais.\nProduto a abrir · Plano nacional de energia de longo prazo — o ciclo em elaboração e consulta ao longo de 2025 e 2026 tem horizonte 2055. Cadernos temáticos saem em datas diferentes.\nLongo prazo é o único horizonte em que o documento assume abertamente que não sabe. Ler o caderno de premissas é ler onde estão as incertezas que o próprio Estado reconhece." },
    { rotulo: "Pergunta 04 · Quais projetos estão habilitados para o próximo certame?", corpo: "Cadastramento e habilitação técnica de empreendimentos candidatos, com verificação de estudos, dados de projeto e requisitos definidos na diretriz do certame.\nProduto a abrir · Nota técnica ou relatório de cadastramento e habilitação técnica do certame específico, publicados pela empresa de planejamento, em conjunto com a portaria de diretrizes do ministério e o edital publicado pela agência.\nÉ o único produto do planejamento com granularidade de projeto individual. Para quem monitora pipeline de expansão, é o dado mais acionável da estante inteira." },
    { rotulo: "Pergunta 05 · Qual é a expansão indicada da transmissão?", corpo: "Estudos de planejamento da transmissão e o capítulo correspondente do plano decenal, com obras indicadas, prazos referenciais e justificativa elétrica.\nProduto a abrir · Capítulo de transmissão do plano decenal e os estudos de planejamento da expansão da transmissão; o certame de transmissão é conduzido em rito próprio.\nRestrição de escoamento é o problema que mais destrói caso de investimento em geração renovável, e ele vive na fronteira entre dois documentos: o que planeja a rede e o que opera a rede. Ler só um dos dois é ver metade do problema." },
    { rotulo: "Pergunta 06 · Quanto o Estado considera que custa cada fonte?", corpo: "Premissas de custo de investimento, custo de operação, fator de capacidade e vida útil usadas nos estudos oficiais.\nProduto a abrir · Cadernos e notas técnicas de premissas do plano decenal e do plano de longo prazo.\nPremissa oficial de custo serve para entender <em>por que</em> o estudo chegou àquele resultado. Serve muito mal para orçar qualquer coisa." },
    { rotulo: "Pergunta 07 · Que hipóteses de transição energética o governo está estudando?", corpo: "Estudos e planos dedicados a trajetórias de transição, com consultas públicas próprias e cadernos temáticos por vetor.\nProduto a abrir · Plano nacional de energia de longo prazo, cadernos temáticos de transição e o plano nacional de transição energética, que passou por consulta pública entre abril e junho de 2026.\nDocumento em consulta pública é a melhor janela de antecipação do setor. Ele mostra o texto que o Estado quer, meses antes de ele virar obrigação — e aceita contribuição enquanto ainda é alterável." },
  ],
  '05': [
    { rotulo: "Horizonte 01 · Plurianual e anual", corpo: "Planejamento da operação energética\nHorizonte de anos, com passo mensal. Avalia condições de atendimento sob cenários hidrológicos e de carga, e produz os indicadores que alimentam a discussão de segurança de suprimento.\nO que decide · Nada de forma direta e imediata. Produz avaliação de risco de atendimento e subsidia a discussão institucional — inclusive a do comitê de monitoramento.\nÉ o horizonte em que o setor discute se tem energia suficiente — e onde o vocabulário de segurança de suprimento nasce, meses antes de aparecer em manchete." },
    { rotulo: "Horizonte 02 · Mensal", corpo: "Programa mensal da operação\nO produto de referência do mês. Define a estratégia energética do período com passo semanal e é a base sobre a qual as revisões se apoiam.\nO que decide · A estratégia de uso dos recursos no mês — como a operação pretende alocar geração hidráulica e térmica ao longo das semanas.\nQuem acompanha a série de revisões semanais enxerga a mudança de condição do sistema com semanas de antecedência em relação a quem só lê o resultado do mês." },
    { rotulo: "Horizonte 03 · Semanal", corpo: "Revisão semanal do programa\nAjuste do programa mensal à informação nova da semana — afluência observada, carga verificada, disponibilidade real de máquina e restrições da rede.\nO que decide · A correção de rota dentro do mês. É onde a realidade entra no plano.\nÉ o horizonte de maior densidade informacional por página publicada em todo o setor — e o menos lido por quem está fora da operação." },
    { rotulo: "Horizonte 04 · Diário", corpo: "Programação diária da operação\nDetalhamento do dia seguinte com resolução intra-horária: quais unidades, com que carregamento, sob quais restrições de rede.\nO que decide · A programação do dia seguinte, unidade por unidade, e as instruções operativas correspondentes.\nA separação entre o físico e o financeiro é a ideia mais importante da arquitetura brasileira, e é neste horizonte que ela fica visível a olho nu." },
    { rotulo: "Horizonte 05 · Tempo real e pós-operação", corpo: "Supervisão, controle e consolidação\nSupervisão e controle contínuos do sistema e, depois, a consolidação do que efetivamente aconteceu — a base factual que alimenta análise, apuração e a contabilização comercial.\nO que decide · Em tempo real, a operação efetiva do sistema. Depois, nada: a pós-operação registra, não decide.\nÉ a fronteira entre o mundo físico e o mundo comercial. Do lado de cá, o que aconteceu na rede; do lado de lá, o que vira obrigação financeira — e a passagem entre os dois tem regra própria." },
  ],
  '07': [
    { rotulo: "Sintoma 01 · A obra está pronta e a usina não pode operar comercialmente", corpo: "O empreendimento concluiu a construção, mas não obteve a liberação necessária para iniciar a operação comercial e faturar.\nQuem tem competência · A agência reguladora, para o ato de liberação; o operador do sistema, para os requisitos técnicos de conexão e para os testes de comissionamento.\nQuatro trilhos correm em paralelo num projeto: outorga, licença ambiental, acesso ao sistema e habilitação comercial. O projeto anda na velocidade do mais lento, e a maior parte dos atrasos que \"ninguém entende\" é simplesmente um desses quatro trilhos parado sozinho." },
    { rotulo: "Sintoma 02 · O licenciamento ambiental não sai", corpo: "O processo ambiental não avança e o cronograma do projeto está preso a ele.\nQuem tem competência · Órgão ambiental federal, estadual ou municipal, conforme critérios legais de porte, localização e natureza do impacto. <b>A competência não é automaticamente federal.</b>\nÉ o travamento que mais mata projeto no Brasil, e o único da lista em que a instituição competente não é setorial. Quem estuda só o setor elétrico não enxerga o gargalo." },
    { rotulo: "Sintoma 03 · A conexão à rede não tem prazo definido", corpo: "O acesso ao sistema de distribuição ou de transmissão não avança, e a concessionária não fixa data.\nQuem tem competência · A distribuidora ou a transmissora, para executar; a agência reguladora, para a regra de acesso e para o conflito; o operador, para os requisitos técnicos no sistema interligado.\nA escada de reclamação existe e quase ninguém usa em ordem. Pular degrau enfraquece o caso: a agência pergunta pelo protocolo anterior, e sem ele o processo volta para o começo." },
    { rotulo: "Sintoma 04 · A outorga saiu, mas o cronograma não é mais viável", corpo: "O título existe, os marcos de implantação estão fixados e a realidade do projeto não cabe mais neles.\nQuem tem competência · A agência reguladora.\nMarco de cronograma é o compromisso que mais gente assume sem ler. Ele não é referência: é obrigação com consequência." },
    { rotulo: "Sintoma 05 · A conta de energia da planta subiu e a distribuidora diz que é tarifa", corpo: "O custo da energia aumentou e a explicação recebida é genérica: \"foi o reajuste\".\nQuem tem competência · A agência reguladora homologa a tarifa da concessionária; a distribuidora aplica; a ouvidoria da concessionária e depois a agência tratam a reclamação individual.\nA conta subir não prova que a tarifa subiu na mesma proporção. Decompor antes de reclamar é o que separa uma reclamação que anda de uma que morre na primeira resposta padrão." },
    { rotulo: "Sintoma 06 · O contrato de energia foi assinado e o fornecedor não entrega", corpo: "Existe contrato, existe posição registrada e o suprimento não se materializa como contratado.\nQuem tem competência · A relação é contratual privada — foro ou arbitragem eleitos no contrato. A câmara de comercialização apura a diferença entre contrato e medição e a leva à contabilização. A agência atua sobre o descumprimento de obrigação regulatória, não sobre o inadimplemento contratual em si.\nA arquitetura separa físico de financeiro. Isso é uma virtude do desenho e uma armadilha para quem não a conhece: metade dos erros de roteamento do setor nasce de tratar os dois planos como um só." },
    { rotulo: "Sintoma 07 · A migração para o mercado livre está travada", corpo: "A decisão de migrar foi tomada, os prazos estão correndo e o processo não se completa.\nQuem tem competência · A distribuidora, para a denúncia do contrato de suprimento e para os prazos regulados; a câmara de comercialização, para o registro do agente e do ativo; a agência, para a regra e para o conflito.\nMigração é o tema em que mais se promete economia e menos se olha calendário. O bloco de decisão de migração é o Bloco 9; aqui o ponto é institucional: são três balcões, não um." },
    { rotulo: "Sintoma 08 · O uso da água do reservatório conflita com outro usuário", corpo: "A operação do aproveitamento hidrelétrico entra em conflito com outros usos da água — abastecimento, irrigação, navegação, controle de cheia.\nQuem tem competência · O órgão gestor de recursos hídricos, para a outorga de direito de uso e para as condições de operação hidráulica; o operador do sistema, para a operação eletroenergética dentro dessas condições; a agência de energia, para os aspectos de concessão de geração.\nÉ o travamento que mais desmonta a ideia de que o setor elétrico decide sozinho o uso da água. A restrição hídrica é dado de entrada, e nenhuma otimização a contorna." },
    { rotulo: "Sintoma 09 · A usina está pronta e a geração é limitada por escoamento", corpo: "A capacidade existe, a energia poderia ser gerada, e a rede não comporta escoar toda a produção em determinados períodos.\nQuem tem competência · O operador do sistema, para a constatação e o tratamento operativo da restrição; a agência reguladora, para a regra sobre as consequências e para a expansão contratada; o planejamento e o certame de transmissão, para a solução estrutural.\nÉ o travamento em que planejamento, operação e regulação se cruzam sobre o mesmo fato. Um analista que consegue dizer, sobre um caso concreto, qual parte é de cada uma das três instituições já domina o bloco." },
  ],
  '08': [
    { rotulo: "Decisão 01 · Reajuste tarifário anual de distribuidora", corpo: "Atualização anual das tarifas de uma concessionária de distribuição, segundo metodologia já aprovada, na data contratual da concessão.\nAgência reguladora. · Resolução homologatória, acompanhada de nota técnica do processo. · Processo tarifário instruído, com participação prevista nas hipóteses cabíveis. A metodologia já foi definida em norma anterior. · Diário oficial da União e área de tarifas da agência, com a nota técnica e as planilhas do processo. · Anual, na data contratual de cada concessão — que é diferente para cada distribuidora. · Partes e interessados no processo, por recurso administrativo; via judicial.\nÉ a decisão mais previsível do setor inteiro. A data está no contrato de concessão e não muda. Quem sabe a data de reajuste da distribuidora que atende uma planta sabe, com um ano de antecedência, quando o custo muda." },
    { rotulo: "Decisão 02 · Revisão tarifária periódica", corpo: "Recomposição estrutural da tarifa em ciclo plurianual: base de ativos, custos operacionais eficientes, perdas, qualidade e produtividade.\nAgência reguladora. · Resolução homologatória do resultado, precedida das normas metodológicas do ciclo. · Consulta e audiência pública sobre a metodologia do ciclo, além do processo específico da concessionária. · Diário oficial da União e área de tarifas da agência, com notas técnicas e bases de cálculo. · Ciclo plurianual definido em contrato — tipicamente de quatro a cinco anos, conforme a concessão. · Concessionária, consumidores, associações e demais interessados, em consulta e audiência pública e depois por recurso.\nA janela de influência real não está no processo individual da distribuidora: está na consulta pública da metodologia do ciclo, que ocorre antes e vale para todas. Quem só se mobiliza no processo individual chega com a regra já fechada." },
    { rotulo: "Decisão 03 · Formação do preço de curto prazo", corpo: "Apuração e divulgação do preço usado na valoração das diferenças entre o contratado e o verificado.\nCâmara de comercialização apura e divulga; a agência aprova a metodologia e os limites. · Divulgação conforme as regras e procedimentos de comercialização aprovados pela agência. · Nenhum rito prévio por evento: o rito foi cumprido quando a metodologia e os limites foram aprovados em norma. · Portal da câmara de comercialização, em cadência própria. · Curta e recorrente, conforme a metodologia vigente. · Contestação sobre a aplicação individual segue o rito da contabilização; contestação sobre a metodologia se faz na consulta pública da norma, não no dado divulgado.\nDizer que \"a agência define o preço de curto prazo\" é impreciso e custa credibilidade. A agência aprova as regras e os limites; a câmara calcula e publica. A frase correta é curta e vale a diferença entre parecer e ser." },
    { rotulo: "Decisão 04 · Despacho de térmica fora da ordem de mérito", corpo: "Acionamento de usina termelétrica por razão de segurança, de restrição elétrica ou de outra condição operativa, fora da ordem econômica.\nOperador do sistema. · Instrução operativa, fundamentada nos procedimentos de rede aprovados pela agência. · Nenhum rito de participação: é decisão operativa. O rito prévio foi a aprovação regulatória do procedimento que a autoriza. · Boletins e relatórios de operação do operador, com consolidação posterior. · Diária e contínua, conforme a necessidade do sistema. · Não se contesta o despacho como se contesta um ato normativo. O que se questiona é o tratamento regulatório e comercial das consequências, na agência e no rito da contabilização.\nÉ o exemplo mais nítido de autoridade funcional sem poder normativo. O operador não fez regra nenhuma e mesmo assim determinou o que uma usina vai fazer hoje à noite." },
    { rotulo: "Decisão 05 · Aprovação de novo procedimento de rede", corpo: "Alteração ou criação de módulo do conjunto de documentos técnicos que disciplina o acesso e a operação do sistema interligado.\nProposto pelo operador do sistema; aprovado pela agência reguladora. · Ato de aprovação da agência sobre a revisão proposta. · Processo de revisão com participação dos agentes no operador e consulta pública na agência. · Portal do operador para o texto dos módulos; diário oficial e biblioteca da agência para o ato de aprovação. · Contínua por revisões; cada módulo tem histórico próprio. · Agentes e interessados, no processo de revisão e na consulta pública da agência.\nA regra técnica que mais afeta a operação de um ativo raramente aparece no diário oficial com nome próprio — ela aparece como aprovação de revisão de módulo. Quem monitora só resolução normativa perde a alteração." },
    { rotulo: "Decisão 06 · Diretriz para leilão de energia nova", corpo: "Definição de produto, prazo de suprimento, fontes elegíveis, data e condições gerais de um certame de contratação.\nMinistério de Minas e Energia — em alguns casos precedido de deliberação do conselho de política. · Portaria ministerial de diretrizes, eventualmente conjunta ou precedida de resolução do conselho. · Consulta pública quando aberta pelo ministério; cadastramento e habilitação técnica conduzidos pela empresa de planejamento. · Diário oficial da União e portal do ministério; o edital correspondente é publicado pela agência. · Por certame, conforme o calendário anunciado. · Interessados, na consulta pública das diretrizes e depois no processo do edital, conduzido pela agência.\nA portaria de diretrizes é o documento mais subestimado do setor: define o produto antes do edital. Quem lê a portaria decide se vai ao certame semanas antes de quem espera o edital sair." },
    { rotulo: "Decisão 07 · Outorga de autorização para central geradora", corpo: "Concessão do título que permite implantar e explorar uma central de geração, com prazo e marcos de implantação.\nAgência reguladora, por delegação do poder concedente; hipóteses de concessão seguem rito próprio. · Resolução autorizativa ou despacho, conforme a competência aplicável ao caso. · Processo de outorga instruído com documentação técnica, societária e de projeto; requisitos definidos em norma. · Diário oficial da União; cadastro e sistema de processos da agência. · Contínua, por requerimento — não tem calendário. · Interessados no processo e terceiros afetados, na via administrativa e judicial.\nOutorga não é licença ambiental, não é acesso ao sistema e não é contrato de venda. São quatro processos independentes, com quatro instituições e quatro relógios — e o projeto anda na velocidade do mais lento." },
    { rotulo: "Decisão 08 · Alteração de regra de comercialização", corpo: "Mudança na metodologia de apuração, no tratamento de contratos, na regra de garantia financeira ou no procedimento de liquidação.\nAplicada pela câmara de comercialização; aprovada pela agência reguladora. · Ato de aprovação da agência sobre as regras e procedimentos de comercialização. · Processo de revisão com participação dos agentes na câmara e consulta pública na agência. · Portal da câmara para o texto das regras; diário oficial e biblioteca da agência para o ato de aprovação. · Ciclos de revisão recorrentes, com vigência declarada. · Agentes e interessados, no processo de revisão e na consulta pública.\nA câmara não aprova as próprias regras e o operador não aprova os próprios procedimentos. Quem executa não normatiza; quem normatiza não executa. É a simetria que fecha a arquitetura brasileira." },
    { rotulo: "Decisão 09 · Acionamento de bandeira tarifária", corpo: "Sinalização, na fatura do consumidor cativo, de condições de custo de geração no período.\nAgência reguladora. · Ato da agência acionando a bandeira do período, com base no mecanismo criado em norma anterior. · O rito de participação ocorreu quando o mecanismo e seus critérios foram estabelecidos e revisados em norma, não a cada acionamento. · Diário oficial da União e portal da agência; a bandeira aparece na fatura. · Mensal. · Contestação sobre o acionamento é limitada, porque ele aplica critério preexistente. A discussão real é sobre o mecanismo, na consulta pública da norma.\nÉ a decisão do setor com maior visibilidade pública e menor margem de discricionariedade. Serve como exemplo perfeito de que ato de aplicação e ato de criação de regra são coisas diferentes — e que a janela de influência mora no segundo." },
    { rotulo: "Decisão 10 · Recomendação de ação preventiva de suprimento", corpo: "Manifestação sobre a continuidade e a segurança do suprimento, com proposição de medidas preventivas.\nComitê de monitoramento do setor elétrico, presidido pelo ministério. · Recomendação registrada em ata ou comunicado — <b>não é ato normativo</b>. · Avaliação permanente das condições de suprimento, com subsídios do operador, da câmara, da empresa de planejamento e da agência. · Comunicado ou ata resumida divulgada após a reunião. · Reuniões ordinárias mensais, com extraordinárias quando convocadas. · Não se contesta uma recomendação. O que se contesta é o ato que eventualmente a implementa — que virá de quem tem competência para editá-lo.\nA recomendação não obriga ninguém e antecipa quase tudo. Ler três comunicados seguidos e comparar o vocabulário é uma das leituras de melhor retorno por minuto que existem no setor." },
    { rotulo: "Decisão 11 · Aprovação de ato de concentração no setor", corpo: "Análise concorrencial de fusão, aquisição ou associação envolvendo empresas do setor elétrico.\nAutoridade de defesa da concorrência, no rito da legislação concorrencial. Aspectos setoriais — transferência de controle de concessão ou autorização — são analisados pela agência reguladora. · Decisão da autoridade concorrencial, e ato próprio da agência para os aspectos setoriais. · Notificação e instrução no rito concorrencial; processo específico na agência para a anuência setorial. · Publicações da autoridade concorrencial e diário oficial; processo público da agência para a parte setorial. · Por operação — não tem calendário. · Terceiros interessados, no rito concorrencial; interessados no processo setorial, na agência.\nAprovação concorrencial não é fechamento da operação, e nenhuma das duas equivale à anuência setorial. São três eventos distintos, em datas distintas, e tratá-los como um só é o erro mais comum na leitura de notícia de consolidação. <b>Composição e datas de processos concretos são números vivos</b> — verifique na fonte antes de citar." },
    { rotulo: "Decisão 12 · Contratação de expansão da transmissão", corpo: "Contratação de novas instalações de transmissão indicadas no planejamento, por certame.\nDiretrizes do ministério; certame conduzido pela agência reguladora; indicação técnica originada no planejamento. · Portaria de diretrizes, edital e ato de homologação do resultado, seguidos de contrato de concessão. · Estudos de planejamento, consulta pública quando aberta, e o rito do edital. · Diário oficial da União, portal do ministério e da agência; estudos no portal do planejamento. · Por certame, conforme o calendário anunciado. · Interessados, na consulta pública e no rito do edital; impugnações no processo do certame.\nDo estudo indicativo ao ativo energizado há anos e quatro instituições. Somar obras indicadas no plano decenal como se fossem capacidade disponível é o erro que transforma planejamento em promessa." },
  ],
  '09': [
    { rotulo: "Dado 01 · Carga de energia por subsistema", corpo: "Demanda atendida pelo sistema interligado, aberta por subsistema, na base verificada e na base prevista.\nOperador do sistema. · Portal do operador, área de resultados e histórico da operação, e área de dados abertos. · Horária, com agregações diária, semanal e mensal. · Painel na web, planilha e séries em arquivo aberto. · De intradiária a diária no verificado; consolidação mensal nos boletins. · Carga verificada e carga prevista são séries diferentes e aparecem juntas em vários relatórios. Comparar uma com a outra sem dizer qual é qual produz um erro que parece análise.\nÉ a série mais usada e a mais fácil de errar por descuido de rótulo. Antes de plotar, leia o cabeçalho da coluna — não o título do gráfico." },
    { rotulo: "Dado 02 · Geração por fonte, com resolução horária", corpo: "Produção verificada por fonte de geração no sistema interligado.\nOperador do sistema. · Portal do operador, área de resultados da operação e de dados abertos. · Horária por fonte e por subsistema. · Painel, planilha e arquivo aberto. · Diária no verificado, com consolidações posteriores. · Geração medida na operação não é geração contabilizada no mercado. As duas respondem a perguntas diferentes, com regras e finalidades diferentes. Cruzar sem declarar a diferença é o erro mais difícil de justificar depois.\nÉ o dado que faz a maior parte dos gráficos de matriz elétrica que circulam no país — e a maior parte deles não declara se está usando série operativa ou comercial." },
    { rotulo: "Dado 03 · Armazenamento dos reservatórios", corpo: "Nível de armazenamento e energia armazenada por subsistema, com séries históricas.\nOperador do sistema. · Portal do operador, boletins e histórico da operação. · Diária, com agregação semanal e mensal, por subsistema e por reservatório em séries específicas. · Painel, boletim e planilha. · Diária a semanal conforme a série. · Nível físico e energia armazenada não são a mesma variável e não se movem juntos: reservatórios diferentes têm produtibilidades diferentes. Citar percentual sem dizer qual dos dois é o erro de rigor mais comum sobre hidrologia.\nÉ o número que mais aparece em manchete e o mais frequentemente citado sem unidade. Perguntar \"percentual de quê?\" resolve a metade das discussões." },
    { rotulo: "Dado 04 · Intercâmbio entre subsistemas", corpo: "Fluxos de energia entre os subsistemas do sistema interligado.\nOperador do sistema. · Portal do operador, resultados da operação e dados abertos. · Horária, com agregações. · Painel, planilha e arquivo aberto. · Diária. · Sinal e sentido são convenção declarada na documentação da série. Inverter o sentido do fluxo é um erro silencioso: o gráfico fica bonito e a conclusão fica invertida.\nIntercâmbio é a variável que mais explica diferença de condição entre regiões — e a mais sensível a restrição de rede, o que a torna a melhor proxy pública de gargalo de transmissão." },
    { rotulo: "Dado 05 · Preço de curto prazo", corpo: "Preço usado na valoração das diferenças entre o contratado e o verificado.\nCâmara de comercialização. · Portal da câmara, área de preços. · Conforme a metodologia vigente, por subsistema. · Painel e planilha. · Curta, conforme a cadência de divulgação. · Preço de curto prazo não é preço de contrato e não é preço médio de mercado. É o preço da diferença. Usá-lo como referência de custo de suprimento superestima ou subestima grosseiramente, conforme o momento.\nÉ a série mais citada fora do setor e a mais mal interpretada dentro dele. A frase que evita o erro cabe em uma linha: valora diferença, não valora contrato." },
    { rotulo: "Dado 06 · Contabilização e dados de mercado", corpo: "Resultados de contabilização, consumo por classe, volumes por ambiente e séries agregadas de mercado.\nCâmara de comercialização. · Portal da câmara, área de dados e informações de mercado. · Mensal, com aberturas por ambiente, submercado e classe. · Relatório e planilha. · Mensal, com a defasagem do ciclo de contabilização. · Dado comercial tem regra de apuração própria e não bate com dado operativo por construção. A diferença não é erro de ninguém — é definição. Declarar a fonte e a definição é obrigatório.\nÉ a segunda maior fonte de dado do setor e a que menos aparece em análise pública. Quem cruza mercado com operação declarando a diferença produz análise que quase ninguém está produzindo." },
    { rotulo: "Dado 07 · Migração para o ambiente livre", corpo: "Quantidade e perfil de consumidores que migraram para a contratação livre.\nCâmara de comercialização, com marco regulatório definido pela agência e por normas de política. · Portal da câmara, área de dados de mercado e de migração. · Mensal, com aberturas por classe, por subsistema e por porte. · Relatório e planilha. · Mensal. · Migração registrada não é migração concluída em todos os cortes, e a data de referência muda o número. Comparar séries com cortes diferentes produz um crescimento que não existe.\nÉ o dado que mede a transformação estrutural do mercado brasileiro em tempo quase real. Para o Bloco 9 é insumo direto; aqui o ponto é saber que ele existe e de quem é." },
    { rotulo: "Dado 08 · Tarifas homologadas de distribuidoras", corpo: "Tarifas vigentes por concessionária, por classe, subgrupo e modalidade.\nAgência reguladora. · Portal da agência, área de tarifas de distribuição, com as resoluções homologatórias e as notas técnicas dos processos. · Por concessionária, classe, subgrupo e modalidade; componentes tarifários separados. · Painel, resolução em texto e planilhas do processo. · Anual por concessionária, na data contratual; revisões em ciclo plurianual. · Tarifa homologada não é o valor da fatura. Tributos e encargos entram depois, e a modalidade e a demanda contratada da unidade mudam o resultado. Comparar tarifas entre distribuidoras sem separar componentes é comparação sem significado.\nÉ o dado mais acionável para consumidor industrial e o menos usado por ele. Cruzar tarifa homologada com o perfil de carga da própria planta é onde aparecem <b>oportunidades potenciais a validar</b> — nunca economia prometida." },
    { rotulo: "Dado 09 · Cadastro de usinas e capacidade instalada", corpo: "Relação de empreendimentos de geração com fonte, potência, situação e localização.\nAgência reguladora. · Portal da agência, sistema de informações de geração. · Por empreendimento e por unidade geradora. · Painel e planilha. · Contínua, atualizada conforme os atos de outorga e de entrada em operação. · Potência outorgada, potência fiscalizada e potência em operação são campos distintos. Somar o campo errado infla a capacidade instalada do país — e é o erro mais frequente em apresentação de mercado.\nTrês colunas parecidas, três significados diferentes. Ler a definição do campo antes de somar é a diferença entre um número certo e um número que passa despercebido até alguém checar." },
    { rotulo: "Dado 10 · Balanço energético nacional", corpo: "Contabilidade energética completa do país, por fonte, setor e região.\nEmpresa de planejamento. · Portal da empresa de planejamento, área de publicações do balanço, com séries históricas. · Anual, por fonte, setor e região. · Relatório e planilhas de séries históricas. · Anual, com ano-base anterior ao ano de publicação. · O balanço cobre toda a matriz energética, não só a elétrica. Trocar uma pela outra muda percentuais em dezenas de pontos e é o erro que mais rápido identifica quem não abriu o documento.\nÉ a fonte canônica para qualquer afirmação sobre a matriz brasileira. Se uma afirmação sobre matriz não cita o balanço nem declara o recorte, ela não está ancorada." },
    { rotulo: "Dado 11 · Projeção decenal de demanda e expansão", corpo: "Projeções de carga, de consumo e de expansão indicada da geração e da transmissão.\nEmpresa de planejamento, com aprovação por portaria do ministério. · Portal da empresa de planejamento, área do plano decenal, com cadernos e anexos de dados. · Anual, por subsistema, por classe e por fonte. · Relatório por caderno e planilhas de anexos. · Ciclo anual, com consulta pública antecedendo a versão final. · Expansão indicada não é expansão contratada. Somar o indicado como oferta futura garantida é o erro que transforma um documento de planejamento em promessa.\nÉ o documento que mais move expectativa no setor e que menos obriga alguém a fazer alguma coisa. A palavra \"indicativo\" está no nome da função por um motivo." },
    { rotulo: "Dado 12 · Resultados de leilão", corpo: "Preços, volumes, empreendimentos vencedores e condições de contratação dos certames.\nAgência reguladora conduz e divulga o resultado; a câmara de comercialização registra e administra os contratos; o ministério define as diretrizes prévias. · Portal da agência para o certame e o resultado; portal da câmara para contratos e registros; portal do ministério para a portaria de diretrizes. · Por certame, por produto e por empreendimento. · Resultado publicado, relatórios e planilhas. · Por certame, com divulgação próxima ao evento e homologação posterior. · Preço de leilão é preço de um produto específico, com prazo, início de suprimento e regime de entrega definidos naquele edital. Comparar preços entre certames de produtos diferentes é comparar coisas diferentes com a mesma unidade.\nÉ o dado mais citado como termômetro de custo de fonte, e o mais dependente de contexto de edital. Sem o produto, o preço não significa nada." },
  ],
};


// ── OS NOVE INSTRUMENTOS DE AULA ──────────────────────────────
//
// A fonte tem DEZ `<div class="inst">`. O `Inst · 01` ("Mapa
// institucional · autoridade × dado") vive no § MAP, que é aparato —
// fora de qualquer aula — e não entra, mesmo tratamento do `LAB · 01`
// (Módulo 01) e do `Inst · 01` (Módulo 06).
//
// A **Aula 07 tem TRÊS instrumentos** (08, 09, 10) — recorde do
// currículo, acima dos dois da Aula 06 do Módulo 06. A lição de não
// presumir 1:1 aula↔instrumento se paga de novo.
//
// NOVE PREFIXOS, UM SÓ NO ENUM. Mecânica inspecionada instrumento a
// instrumento, nunca deduzida do nome:
//
//   fonte                        campos  mecânica              → kind
//   'Mapa institucional'            0    chips clicáveis        (fora de aula)
//   'Comparador'                    0    grid → texto          → comparador ✓
//   'Estante da EPE'                0    grid → texto          → explorador
//   'Anatomia de um ato regulatório'6    numérico + verdict    → simulador
//   'Cadeia temporal da operação'   0    chips → texto         → explorador
//   'Régua do ciclo mensal'         5    numérico + verdict    → simulador
//   'Escada do travamento'          0    grid → texto          → explorador
//   'Roteador de decisão'           0    grid → texto          → explorador
//   'Localizador de dado'           0    grid → texto          → explorador
//   'Calendário institucional'      0    calendário → texto    → explorador
//
// 'Comparador' é o único cujo nome bate com o enum — e bate também na
// mecânica, então foi mantido. Os sete exploradores têm a MESMA
// mecânica do INST 08 do Módulo 06: seleção única revela texto. O grid
// gerado por script vira um `select`, primitivo que o painel já
// renderiza, e o conteúdo vai no veredito.
//
// SAÍDAS: 8 declaradas, 6 entram. `i4-reg` e `i6-reg` ("Regime") são
// texto na fonte e não cabem em `Record<string, number>`. Os sete
// exploradores têm zero saída numérica por construção.
export const INSTRUMENTOS_MODULO_07: Instrument[] = [
  {
    id: "m07-inst-02",
    kind: "comparador",
    title: "Comparador de instrumentos jurídicos",
    formula: null,
    fields: [
      { id: "i2-sel", label: "Item", unit: null, kind: "select", defaultValue: "0", options: [{ value: "0", label: "Legislativo · Lei ordinária" }, { value: "1", label: "Executivo · urgência · Medida provisória" }, { value: "2", label: "Executivo · regulamento · Decreto" }, { value: "3", label: "Conselho · política · Resolução do conselho de política" }, { value: "4", label: "Ministério · política · Portaria ministerial" }, { value: "5", label: "Agência · norma · Resolução normativa" }, { value: "6", label: "Agência · caso concreto · Resolução homologatória" }, { value: "7", label: "Agência · outorga · Resolução autorizativa" }, { value: "8", label: "Agência · execução · Despacho" }, { value: "9", label: "Operador · técnico · Procedimento de rede" }, { value: "10", label: "Câmara · comercial · Regras e procedimentos de comercialização" }] },
    ],
    outputs: [

    ],
    note: null,
  },
  {
    id: "m07-inst-03",
    kind: "explorador",
    title: "Estante da EPE · qual documento responde qual pergunta",
    formula: null,
    fields: [
      { id: "i3-sel", label: "Item", unit: null, kind: "select", defaultValue: "0", options: [{ value: "0", label: "Pergunta 01 · Quanta demanda o país projeta para os próximos dez anos?" }, { value: "1", label: "Pergunta 02 · Quanto o país consumiu por fonte e por setor no ano passado?" }, { value: "2", label: "Pergunta 03 · Que futuro de longo prazo o Estado considera plausível?" }, { value: "3", label: "Pergunta 04 · Quais projetos estão habilitados para o próximo certame?" }, { value: "4", label: "Pergunta 05 · Qual é a expansão indicada da transmissão?" }, { value: "5", label: "Pergunta 06 · Quanto o Estado considera que custa cada fonte?" }, { value: "6", label: "Pergunta 07 · Que hipóteses de transição energética o governo está estudando?" }] },
    ],
    outputs: [

    ],
    note: null,
  },
  {
    id: "m07-inst-04",
    kind: "simulador",
    title: "Anatomia de um ato regulatório · rito e janela de influência",
    formula: null,
    fields: [
      { id: "i4-a-n", label: "Tomada de subsídios", unit: "dias", kind: "range", defaultValue: 45, min: 0, max: 180, step: 1 },
      { id: "i4-b-n", label: "Elaboração de minuta e AIR", unit: "dias", kind: "range", defaultValue: 120, min: 15, max: 540, step: 1 },
      { id: "i4-c-n", label: "Consulta pública", unit: "dias", kind: "range", defaultValue: 45, min: 0, max: 180, step: 1 },
      { id: "i4-d-n", label: "Análise das contribuições", unit: "dias", kind: "range", defaultValue: 90, min: 10, max: 540, step: 1 },
      { id: "i4-e-n", label: "Relatoria e deliberação", unit: "dias", kind: "range", defaultValue: 60, min: 7, max: 360, step: 1 },
      { id: "i4-f-n", label: "Vacância até a vigência", unit: "dias", kind: "range", defaultValue: 90, min: 0, max: 730, step: 1 },
    ],
    outputs: [
      { id: "i4-tot", label: "Ciclo total", unit: null },
      { id: "i4-jan", label: "Janela de influência", unit: null },
      { id: "i4-avi", label: "Aviso prévio efetivo", unit: null },
    ],
    note: null,
  },
  {
    id: "m07-inst-05",
    kind: "explorador",
    title: "Cadeia temporal da operação · produto, decisão e leitura",
    formula: null,
    fields: [
      { id: "i5-sel", label: "Item", unit: null, kind: "select", defaultValue: "0", options: [{ value: "0", label: "Horizonte 01 · Plurianual e anual" }, { value: "1", label: "Horizonte 02 · Mensal" }, { value: "2", label: "Horizonte 03 · Semanal" }, { value: "3", label: "Horizonte 04 · Diário" }, { value: "4", label: "Horizonte 05 · Tempo real e pós-operação" }] },
    ],
    outputs: [

    ],
    note: null,
  },
  {
    id: "m07-inst-06",
    kind: "simulador",
    title: "Régua do ciclo mensal · contabilização, garantia e liquidação",
    formula: null,
    fields: [
      { id: "i6-a-n", label: "Fechamento da medição", unit: "dias após o mês", kind: "range", defaultValue: 8, min: 1, max: 30, step: 1 },
      { id: "i6-b-n", label: "Apuração e prévia", unit: "dias", kind: "range", defaultValue: 12, min: 2, max: 45, step: 1 },
      { id: "i6-c-n", label: "Janela de contestação", unit: "dias", kind: "range", defaultValue: 5, min: 0, max: 30, step: 1 },
      { id: "i6-d-n", label: "Aporte de garantia", unit: "dias", kind: "range", defaultValue: 6, min: 1, max: 30, step: 1 },
      { id: "i6-e-n", label: "Liquidação financeira", unit: "dias", kind: "range", defaultValue: 4, min: 1, max: 30, step: 1 },
    ],
    outputs: [
      { id: "i6-tot", label: "Consumo → desembolso", unit: null },
      { id: "i6-jan", label: "Janela de contestação", unit: null },
      { id: "i6-fol", label: "Folga até o aporte", unit: null },
    ],
    note: null,
  },
  {
    id: "m07-inst-07",
    kind: "explorador",
    title: "Escada do travamento · o que parou o projeto e quem destrava",
    formula: null,
    fields: [
      { id: "i7-sel", label: "Item", unit: null, kind: "select", defaultValue: "0", options: [{ value: "0", label: "Sintoma 01 · A obra está pronta e a usina não pode operar comercialmente" }, { value: "1", label: "Sintoma 02 · O licenciamento ambiental não sai" }, { value: "2", label: "Sintoma 03 · A conexão à rede não tem prazo definido" }, { value: "3", label: "Sintoma 04 · A outorga saiu, mas o cronograma não é mais viável" }, { value: "4", label: "Sintoma 05 · A conta de energia da planta subiu e a distribuidora diz que é tarifa" }, { value: "5", label: "Sintoma 06 · O contrato de energia foi assinado e o fornecedor não entrega" }, { value: "6", label: "Sintoma 07 · A migração para o mercado livre está travada" }, { value: "7", label: "Sintoma 08 · O uso da água do reservatório conflita com outro usuário" }, { value: "8", label: "Sintoma 09 · A usina está pronta e a geração é limitada por escoamento" }] },
    ],
    outputs: [

    ],
    note: null,
  },
  {
    id: "m07-inst-08",
    kind: "explorador",
    title: "Roteador de decisão",
    formula: null,
    fields: [
      { id: "i8-sel", label: "Item", unit: null, kind: "select", defaultValue: "0", options: [{ value: "0", label: "Decisão 01 · Reajuste tarifário anual de distribuidora" }, { value: "1", label: "Decisão 02 · Revisão tarifária periódica" }, { value: "2", label: "Decisão 03 · Formação do preço de curto prazo" }, { value: "3", label: "Decisão 04 · Despacho de térmica fora da ordem de mérito" }, { value: "4", label: "Decisão 05 · Aprovação de novo procedimento de rede" }, { value: "5", label: "Decisão 06 · Diretriz para leilão de energia nova" }, { value: "6", label: "Decisão 07 · Outorga de autorização para central geradora" }, { value: "7", label: "Decisão 08 · Alteração de regra de comercialização" }, { value: "8", label: "Decisão 09 · Acionamento de bandeira tarifária" }, { value: "9", label: "Decisão 10 · Recomendação de ação preventiva de suprimento" }, { value: "10", label: "Decisão 11 · Aprovação de ato de concentração no setor" }, { value: "11", label: "Decisão 12 · Contratação de expansão da transmissão" }] },
    ],
    outputs: [

    ],
    note: null,
  },
  {
    id: "m07-inst-09",
    kind: "explorador",
    title: "Localizador de dado",
    formula: null,
    fields: [
      { id: "i9-sel", label: "Item", unit: null, kind: "select", defaultValue: "0", options: [{ value: "0", label: "Dado 01 · Carga de energia por subsistema" }, { value: "1", label: "Dado 02 · Geração por fonte, com resolução horária" }, { value: "2", label: "Dado 03 · Armazenamento dos reservatórios" }, { value: "3", label: "Dado 04 · Intercâmbio entre subsistemas" }, { value: "4", label: "Dado 05 · Preço de curto prazo" }, { value: "5", label: "Dado 06 · Contabilização e dados de mercado" }, { value: "6", label: "Dado 07 · Migração para o ambiente livre" }, { value: "7", label: "Dado 08 · Tarifas homologadas de distribuidoras" }, { value: "8", label: "Dado 09 · Cadastro de usinas e capacidade instalada" }, { value: "9", label: "Dado 10 · Balanço energético nacional" }, { value: "10", label: "Dado 11 · Projeção decenal de demanda e expansão" }, { value: "11", label: "Dado 12 · Resultados de leilão" }] },
    ],
    outputs: [

    ],
    note: null,
  },
  {
    id: "m07-inst-10",
    kind: "explorador",
    title: "Calendário institucional · o que sai quando e de quem",
    formula: null,
    fields: [
      { id: "i10-sel", label: "Item", unit: null, kind: "select", defaultValue: "0", options: [{ value: "0", label: "JAN · Janeiro" }, { value: "1", label: "FEV · Fevereiro" }, { value: "2", label: "MAR · Março" }, { value: "3", label: "ABR · Abril" }, { value: "4", label: "MAI · Maio" }, { value: "5", label: "JUN · Junho" }, { value: "6", label: "JUL · Julho" }, { value: "7", label: "AGO · Agosto" }, { value: "8", label: "SET · Setembro" }, { value: "9", label: "OUT · Outubro" }, { value: "10", label: "NOV · Novembro" }, { value: "11", label: "DEZ · Dezembro" }] },
    ],
    outputs: [

    ],
    note: null,
  },
];



// ── INST · 01 — Mapa institucional (LYCEUM Wave 38) ──────────
// Vive no § MAP, FORA de qualquer aula. A Wave 30 registrou que ele
// existia e nao entrava; a taxonomia da FOUNDRY Wave 4 o listou como
// nunca materializado como dado. Materializado agora como Instrument
// de MODULO, com destino em Recursos do Modulo.
//
// Oito orgaos na ordem da fonte (ORD), cada um com kicker, titulo,
// corpo, seis linhas de ficha (cinco no ultimo) e leitura. Mais as
// tres legendas de fluxo (autoridade / dado / os dois).
//
// O fluxo NAO altera a ficha do orgao na fonte — ele muda o desenho
// do SVG e a legenda. O SVG nao porta; a legenda sim, e e por isso
// que o eixo continua sendo um campo em vez de sumir.
//
// Gerado dos objetos N / ORD / INFO / LEGS do <script>.

export const M07_INST01_ORGAOS: {
  id: string; sigla: string; kicker: string; titulo: string; corpo: string;
  linhas: [string, string][]; leitura: string;
}[] = [
  {
    id: "cnpe", sigla: "CNPE",
    kicker: "Assessoramento · política", titulo: "Conselho Nacional de Política Energética",
    corpo: "Órgão de assessoramento da Presidência da República para a política energética, presidido pelo titular do ministério e composto por outros ministérios e por representantes indicados na norma de criação. Delibera por resolução; a resolução é homologada pela Presidência e publicada no diário oficial.",
    linhas: [
      ["Natureza", "Órgão colegiado de assessoramento da Presidência da República. <b>Não é agência, não é empresa, não é executor.</b>"],
      ["Autoridade que exerce", "Fixa diretriz de política. Direciona a atuação do ministério e o desenho de programas e de certames — quase sempre por delegação a quem regulamenta."],
      ["Autoridade que sofre", "Homologação presidencial; coordenação de governo; limites da lei."],
      ["O que publica", "Resoluções e, quando disponibilizadas, atas e pautas."],
      ["Defasagem típica", "A resolução aparece publicada depois da homologação. Pauta e data de reunião nem sempre são antecipadas."],
      ["O que <b>não</b> faz", "Não regula, não fiscaliza, não outorga, não opera o sistema, não liquida contrato."],
    ],
    leitura: "A resolução do conselho é o ato de maior densidade política do setor e um dos menos autoexecutáveis. Ler uma resolução de conselho e concluir que \"a regra mudou\" é o erro clássico: na maioria dos casos ela determina que alguém <em>faça</em> a regra mudar, e o evento contratável só aparece meses depois, no ato regulatório.",
  },
  {
    id: "mme", sigla: "MME",
    kicker: "Política · poder concedente", titulo: "Ministério de Minas e Energia",
    corpo: "Órgão da administração direta federal. Formula e implementa a política energética, exerce o poder concedente do setor elétrico — diretamente ou por delegação à agência —, expede portarias, define diretrizes de certame, supervisiona a empresa de planejamento, preside o conselho de política e preside o comitê de monitoramento, cuja secretaria-executiva é exercida pela secretaria de energia elétrica.",
    linhas: [
      ["Natureza", "Administração direta. Titular nomeado pela Presidência, sem mandato fixo."],
      ["Autoridade que exerce", "Política setorial, diretrizes de leilão, portarias, supervisão da empresa de planejamento, condução do comitê de monitoramento."],
      ["Autoridade que sofre", "Presidência, coordenação de governo, áreas econômica e ambiental, controle externo e judicial."],
      ["O que publica", "Portarias e portarias normativas, boletins de monitoramento, notas técnicas, consultas públicas de política."],
      ["Estrutura interna", "Duas secretarias nacionais concentram hoje transição energética e planejamento, de um lado, e energia elétrica, de outro — verificado em fonte oficial em <b>julho de 2026</b>. Nome e recorte de secretaria mudam por decreto: é número vivo."],
      ["O que <b>não</b> faz", "Não homologa tarifa, não fiscaliza agente, não despacha usina, não contabiliza nem liquida contrato."],
    ],
    leitura: "Formalmente o conselho está acima; operacionalmente o ministério é quem move a máquina — prepara os estudos, redige as minutas, coordena os órgãos setoriais e conduz a implementação. É por isso que o ministério manda mais do que o organograma sugere.",
  },
  {
    id: "anl", sigla: "ANEEL",
    kicker: "Regulação · fiscalização", titulo: "Agência Nacional de Energia Elétrica",
    corpo: "Autarquia em regime especial vinculada ao ministério, com autonomia decisória, mandatos fixos e decisão colegiada. Regula e fiscaliza a produção, a transmissão, a distribuição e a comercialização; outorga concessões, permissões e autorizações por delegação do poder concedente; homologa tarifas; aprova as regras técnicas propostas pelo operador e as regras comerciais aplicadas pela câmara; e julga em primeira instância administrativa.",
    linhas: [
      ["Natureza", "Autarquia especial. Diretoria colegiada com mandatos não coincidentes; decisão por voto em reunião pública."],
      ["Autoridade que exerce", "Produz obrigação direta e oponível ao agente. Regula, outorga, homologa tarifa, fiscaliza, sanciona e decide recurso administrativo."],
      ["Autoridade que sofre", "Lei, controle judicial, controle externo. Não recebe ordem de mérito técnico do ministério — vinculação não é subordinação."],
      ["O que publica", "Resoluções normativas, homologatórias e autorizativas; despachos; tarifas homologadas; cadastro de geração; processos de consulta e audiência pública; módulos de procedimentos de regulação tarifária e de distribuição."],
      ["Estrutura interna", "A organização por superintendências foi reorganizada por resolução normativa de <b>abril de 2023</b>, com efeitos em maio de 2023, agrupando as áreas por eixo — regulação econômica, relações com a sociedade, outorgas, fiscalização, regulação técnica e gestão. Lista de sigla de superintendência é número vivo."],
      ["O que <b>não</b> faz", "Não opera o sistema, não calcula o preço de curto prazo, não define política energética."],
    ],
    leitura: "É a única instituição do setor que produz obrigação diretamente oponível ao agente <em>e</em> a única cujo processo tem janela formal de participação antes da decisão. As duas coisas andam juntas: onde há poder de obrigar, há dever de motivar e de ouvir. Quem descobre a norma pela conta de luz perdeu a janela em que ela era alterável.",
  },
  {
    id: "epe", sigla: "EPE",
    kicker: "Planejamento indicativo", titulo: "Empresa de Pesquisa Energética",
    corpo: "Empresa pública federal vinculada ao ministério, criada para prestar serviços de estudos e pesquisa que subsidiam o planejamento do setor energético. Produz o plano decenal, o balanço energético anual, os estudos de longo prazo, notas técnicas de premissas e o cadastramento e a habilitação técnica de empreendimentos para certames.",
    linhas: [
      ["Natureza", "Empresa pública vinculada ao ministério. Escopo definido por demanda ministerial."],
      ["Autoridade que exerce", "<b>Nenhuma sobre agente.</b> Este é o ponto pedagógico do nó: no fluxo de autoridade a empresa de planejamento é folha, e no fluxo de dado é uma das fontes mais citadas do setor."],
      ["Autoridade que sofre", "Supervisão ministerial; escopo e prazos definidos por quem demanda o estudo."],
      ["O que publica", "Plano decenal de expansão, balanço energético nacional, plano nacional de longo prazo, notas técnicas, estudos de inventário e viabilidade, resultados de cadastramento para certame."],
      ["Defasagem típica", "Balanço anual com ano-base anterior. Plano decenal com ciclo anual e consulta pública prévia. Cada caderno tem a própria data de corte — e elas não coincidem."],
      ["O que <b>não</b> faz", "Não decide, não regula, não fiscaliza, não outorga, não constrói nada."],
    ],
    leitura: "Indicativo não é determinativo. O plano decenal não obriga ninguém a construir nada — e mesmo assim é o documento que mais move expectativa no setor, porque sinaliza para onde a política aponta. Confundir sinalização com compromisso é o erro que transforma um plano em previsão.",
  },
  {
    id: "ons", sigla: "ONS",
    kicker: "Operação do sistema", titulo: "Operador Nacional do Sistema Elétrico",
    corpo: "Pessoa jurídica de direito privado, associação civil sem fins lucrativos, criada em 1998 e reformulada em 2004, que coordena e controla a operação das instalações de geração e transmissão do sistema interligado sob autorização e fiscalização da agência. Composto por agentes associados, agentes participantes, representação do ministério e conselhos de consumidores.",
    linhas: [
      ["Natureza", "Direito privado, sem fins lucrativos. Não é autarquia e não é empresa estatal — e ainda assim sua instrução operativa vincula o agente."],
      ["Autoridade que exerce", "Autoridade estreita e profunda: coordena e controla a operação, programa e determina o despacho, opera o sistema em tempo real e propõe os procedimentos de rede."],
      ["Autoridade que sofre", "A agência aprova seus procedimentos e o fiscaliza. O comitê de monitoramento acompanha o suprimento."],
      ["O que publica", "Programa mensal da operação e suas revisões, programação diária, boletins de carga e de geração, intercâmbios, armazenamento de reservatórios, séries históricas, dados abertos."],
      ["Defasagem típica", "De intradiária a diária no dado operativo; consolidações mensais nos boletins. É a fonte mais rápida do setor."],
      ["O que <b>não</b> faz", "Não regula, não fiscaliza agente, não calcula o preço de liquidação, não compra nem vende energia."],
    ],
    leitura: "Não regula nada e manda ligar e desligar usina. É o contraexemplo mais eficiente contra a leitura hierárquica ingênua do setor: autoridade aqui não vem de posição no organograma, vem de competência funcional atribuída em lei e detalhada em procedimento aprovado pelo regulador.",
  },
  {
    id: "ccee", sigla: "CCEE",
    kicker: "Contabilização · liquidação", titulo: "Câmara de Comercialização de Energia Elétrica",
    corpo: "Pessoa jurídica de direito privado sem fins lucrativos, sob autorização e fiscalização da agência, que viabiliza a comercialização de energia elétrica no sistema interligado. Registra agentes, ativos e contratos; recebe a medição; aplica as regras e procedimentos de comercialização; apura e divulga o preço de curto prazo conforme a metodologia aprovada; contabiliza, exige garantia financeira e liquida.",
    linhas: [
      ["Natureza", "Direito privado, sem fins lucrativos. Estatuto social homologado pela agência — o estatuto vigente foi homologado em <b>janeiro de 2026</b>, com separação entre conselho de administração e diretoria executiva."],
      ["Autoridade que exerce", "Obrigação comercial sobre o agente: registro, aporte de garantia, contabilização e liquidação. Quem não aporta não liquida."],
      ["Autoridade que sofre", "A agência aprova as regras e os procedimentos de comercialização, homologa o estatuto e fiscaliza."],
      ["O que publica", "Preço de curto prazo, resultados de contabilização e liquidação, séries de mercado, dados de migração para o ambiente livre, boletins."],
      ["Defasagem típica", "Preço em cadência curta; contabilização e liquidação em ciclo mensal fechado, com calendário de operações publicado."],
      ["O que <b>não</b> faz", "Não despacha usina, não regula, não outorga, não fiscaliza agente no sentido sancionador."],
    ],
    leitura: "É o nó em que os dois mapas mais divergem. No fluxo de autoridade, a câmara é ponta de linha — recebe regra de cima e aplica. No fluxo de dado, é uma das duas maiores fontes do setor. Um analista que ordena as instituições por importância usando o organograma vai subestimar exatamente a instituição que mais alimenta a própria análise.",
  },
  {
    id: "cmse", sigla: "CMSE",
    kicker: "Monitoramento · recomendação", titulo: "Comitê de Monitoramento do Setor Elétrico",
    corpo: "Comitê criado por lei em 2004 e regulamentado por decreto no mesmo ano, no âmbito do ministério e sob a presidência do titular da pasta, com secretaria-executiva exercida pela secretaria de energia elétrica. Reúne representantes do ministério e os titulares da agência de energia elétrica, da agência de petróleo, da câmara de comercialização, da empresa de planejamento e do operador. Reúne-se ordinariamente uma vez por mês.",
    linhas: [
      ["Natureza", "Comitê interinstitucional de acompanhamento. Não tem personalidade jurídica própria nem poder normativo."],
      ["Autoridade que exerce", "<b>Recomenda.</b> Acompanha e avalia permanentemente a continuidade e a segurança do suprimento e propõe ações preventivas ou saneadoras."],
      ["Autoridade que sofre", "Opera sob a presidência do ministério; a execução das recomendações depende de quem tem competência para agir."],
      ["O que publica", "Comunicado ou ata resumida após a reunião ordinária mensal."],
      ["Defasagem típica", "Publicação após a reunião. A cadência mensal é o que torna o documento útil como série temporal de tom."],
      ["O que <b>não</b> faz", "Não emite ato normativo, não fiscaliza, não despacha, não contrata."],
    ],
    leitura: "Não manda em ninguém e é o melhor termômetro público de tensão de suprimento que existe no setor. Ler três comunicados seguidos e comparar o vocabulário — o que entrou, o que saiu, o que ganhou parágrafo próprio — antecipa movimento melhor do que qualquer manchete.",
  },
  {
    id: "ag", sigla: "Agentes e mercado",
    kicker: "Regulado · fonte de dado", titulo: "Agentes e mercado",
    corpo: "Geradores, transmissoras, distribuidoras, comercializadoras, consumidores livres e especiais e autoprodutores. É o nó em que toda a arquitetura desemboca — e o único que aparece nas duas pontas dos dois mapas.",
    linhas: [
      ["Natureza", "Pessoas jurídicas de direito privado ou público, sujeitas a outorga, registro e regras setoriais conforme a atividade."],
      ["Autoridade que exerce", "Nenhuma autoridade institucional. Mas participa formalmente: consulta e audiência pública, associações setoriais, conselhos de consumidores, e contribuição técnica documentada que o regulador precisa responder de forma fundamentada."],
      ["Autoridade que sofre", "Obrigação regulatória da agência, instrução operativa do operador e obrigação comercial da câmara — três fontes distintas, com ritos e prazos distintos."],
      ["O que informa", "Medição, registro de contratos, declarações e informações regulatórias obrigatórias; dados de ativos ao operador. <b>O agente também é fonte.</b>"],
      ["O que <b>não</b> faz", "Não escolhe qual regra cumprir, não negocia despacho e não interpreta a própria contabilização com efeito vinculante."],
    ],
    leitura: "A seta de volta é a parte esquecida do mapa. Quem só desenha as flechas descendo do topo subestima duas coisas ao mesmo tempo: o custo regulatório de operar no setor e a quantidade de dado público que existe justamente porque alguém foi obrigado a informar.",
  },
];

export const M07_INST01_LEGENDAS: Record<string, string> = {
  aut: "Fluxo de autoridade — quem obriga, homologa, aprova ou fiscaliza quem",
  dad: "Fluxo de dado — quem publica ou informa o quê, e para quem",
  amb: "AutoridadeDadoRótulos ocultos no modo combinado — selecione um fluxo para lê-los",
};

/** Instrumento de MÓDULO: o Inst · 01 do § MAP. Não entra em
 *  `instruments` de nenhuma aula. */
export const MODULO_07_INSTRUMENTOS: Instrument[] = [
  {
    id: 'm07-inst-01',
    kind: 'explorador',
    title: 'Mapa institucional · autoridade × dado',
    formula: null,
    fields: [
      {
        id: 'm07-i1-flow',
        label: 'Fluxo exibido',
        unit: null,
        kind: 'select',
        defaultValue: 'aut',
        options: [
          { value: 'aut', label: 'Autoridade' },
          { value: 'dad', label: 'Dado' },
          { value: 'amb', label: 'Os dois' },
        ],
      },
      {
        id: 'm07-i1-sel',
        label: 'Órgão',
        unit: null,
        kind: 'select',
        defaultValue: 'cnpe',
        options: M07_INST01_ORGAOS.map((o) => ({ value: o.id, label: o.sigla })),
      },
    ],
    outputs: [],
    note: 'Os oito órgãos que governam o setor, lidos em dois fluxos que não coincidem: quem manda em quem, e quem publica o quê. Escolha o órgão para abrir a ficha — natureza, autoridade que exerce, autoridade que sofre e o que publica.',
  },
];

export const MODULO_07_LEAD: Record<string, string> = {
  'aula-07-01': "Política escolhe direção. Regulação transforma direção em regra aplicável. São camadas diferentes, com instrumentos diferentes, prazos diferentes e efeitos diferentes — e confundir as duas é a origem de metade dos erros de leitura do setor.",
  'aula-07-02': "Duas palavras que parecem detalhe de vocabulário e que definem a instituição inteira. Um plano indicativo aponta necessidade e alternativa; ele não autoriza, não obriga e não contrata. Quem lê o plano decenal como lista de obras aprovadas está a um passo de errar uma decisão de investimento.",
  'aula-07-03': "Esta é a aula mais densa do módulo, e a razão é aritmética: a agência é a instituição que aparece no cotidiano de praticamente todo agente do setor. Tarifa e qualidade para o consumidor. Autorização e fiscalização para o gerador. Receita e disponibilidade para o transmissor. Metas e revisão para o distribuidor. Regras e garantias para o comercializador. Conexão e acesso para qualquer projeto novo.",
  'aula-07-04': "O operador é a instituição do setor cuja natureza jurídica mais surpreende quem chega de fora: não é órgão público, não é empresa estatal e não é agência. É associação civil de direito privado, sem fins lucrativos, mantida pelos próprios agentes — e é ela que decide, hora a hora, quais usinas geram no país inteiro.",
  'aula-07-05': "A câmara de comercialização é a instituição que resolve um problema criado pela arquitetura da operação: se o despacho é sistêmico e o contrato é bilateral, alguém precisa apurar a diferença entre o que foi contratado e o que foi medido — e transformar essa diferença em obrigação financeira exigível. Esse alguém não pode ser quem opera. Daí existirem duas entidades e não uma.",
  'aula-07-06': "Sete atores fora do núcleo setorial clássico. Dois deles — o comitê de monitoramento e o conselho de defesa da concorrência — estão na frase para decorar. Os outros cinco não estão em lugar nenhum do vocabulário de quem começa, e são justamente os que decidem coisas que param cronograma, travam financiamento e adiam entrada em operação.",
  'aula-07-07': "A frase para decorar é uma âncora, não uma descrição completa. Quem só sabe a frase trava na primeira pergunta de segunda ordem — e as perguntas de segunda ordem são exatamente as que um decisor cético faz. Esta aula mostra as costuras, segue um ato do início ao fim e entrega as três ferramentas que convertem o mapa em uso.",
};


/** 141 blocos nas sete aulas, na ordem do documento. */
export const MODULO_07_CORPO: Record<string, AulaBloco[]> = {
  'aula-07-01': [
    { kind: 'paragrafo', html: "Comece pela distinção, porque tudo nesta aula depende dela. <strong>Política pública</strong> escolhe o que priorizar: quanto peso dar a segurança de suprimento, a competição, a universalização, a transição energética, a determinadas tecnologias, ao custo da conta. É uma escolha de direção, e ela é legítima justamente porque é uma escolha — não existe resposta técnica única para \"quanto vale evitar um risco de desabastecimento\". <strong>Regulação</strong> converte essa direção em procedimentos, metodologias, obrigações, incentivos e sanções aplicáveis a agentes identificáveis, dentro de competência definida em lei e com dever de motivação técnica." },
    { kind: 'paragrafo', html: "O exemplo canônico é o leilão. O ministério pode definir, por portaria, as diretrizes de um certame: o produto contratado, a fonte elegível, o horizonte de suprimento, o objetivo de segurança que se quer atender, o calendário. A agência elabora e aprova o edital, conduz ou coordena o processo competitivo sob suas competências legais, homologa o resultado e fiscaliza o cumprimento das obrigações depois. A empresa de planejamento habilitou tecnicamente os empreendimentos antes. A câmara de comercialização opera os sistemas e registra os contratos depois. Quatro instituições, quatro competências, um único evento — e nenhuma delas poderia fazer o trabalho da outra.</b>" },
    { kind: 'titulo', numero: "1.1", texto: "Ficha institucional · MME" },
    { kind: 'titulo', numero: "1.2", texto: "Estrutura interna: as duas secretarias que importam para eletricidade" },
    { kind: 'paragrafo', html: "O ministério é grande e a maior parte dele não interessa a quem acompanha eletricidade. Duas secretarias concentram quase tudo, e saber qual é qual é literalmente o que o critério de domínio deste bloco pede quando alguém diz \"saiu uma portaria ontem\"." },
    { kind: 'tabela', linhas: [["Unidade","Função prática","Onde ela aparece no seu dia"],["SNTEP Secretaria Nacional de Transição Energética e Planejamento","Coordena a elaboração e a implementação dos instrumentos de planejamento energético — plano decenal, plano nacional de energia, balanço energético — e os sistemas de informação energética. Avalia e promove as análises para outorga de concessão, autorização e permissão de uso de bem público para serviços de energia elétrica.","Portarias de outorga de geração . Diretrizes dos planos. Abertura de consulta pública de planejamento. Se a notícia envolve plano, cenário ou autorização de usina nova, o ato provavelmente saiu daqui."],["SNEE Secretaria Nacional de Energia Elétrica","Formula e avalia política pública de geração, transmissão e distribuição; tarifas de serviços regulados e componentes tarifários; novas tecnologias e serviços ao consumidor; recursos hídricos na interface com o setor elétrico. Acompanha a expansão e o desempenho do sistema. Subsidia as diretrizes dos leilões de energia existente do ambiente regulado. Exerce a secretaria-executiva do comitê de monitoramento do setor elétrico.","Portarias de mercado : abertura, elegibilidade, prazos de migração, diretrizes de leilão, temas tarifários de competência de política. Se a notícia envolve mercado livre, encargo ou leilão, o ato provavelmente saiu daqui."],["Secretaria-Executiva","Coordenação administrativa e integração das áreas do ministério, incluindo a subsecretaria de assuntos econômicos e regulatórios.","Aparece na composição de grupos de trabalho interinstitucionais e na articulação com as demais pastas."],["Gabinete do Ministro","Coordenação política superior; articulação com Presidência, Casa Civil, Congresso, governos estaduais e demais ministérios; condução de crise.","Assina as portarias normativas de maior alcance e conduz a agenda quando o tema escala para fora do setor."],["Consultoria Jurídica","Controle de legalidade e assessoramento jurídico.","Pareceres sobre minutas de portaria, decreto e ato normativo. Raramente visível, sempre presente no tempo de tramitação."]] },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "As siglas SNTEP e SNEE são snapshot de <strong>julho de 2026</strong>. Materiais mais antigos — inclusive o currículo definitivo da Alexandria — usam SPE (Secretaria de Planejamento e Desenvolvimento Energético) e SEE (Secretaria de Energia Elétrica), que foram as denominações anteriores. A mudança não é cosmética: a incorporação explícita de \"transição energética\" ao nome da secretaria de planejamento sinaliza a agenda que passou a estruturar o planejamento oficial. <strong>Ao ler ato ou estudo antigo, reconheça a sigla velha; ao descrever a estrutura vigente, confirme na página de composição do ministério antes de usar.</strong>" },
    { kind: 'titulo', numero: "1.3", texto: "Anatomia de uma portaria do ministério" },
    { kind: 'paragrafo', html: "A portaria é o instrumento mais frequente do ministério e o mais mal lido do setor. Ela pode estabelecer diretriz e calendário de leilão, critério de elegibilidade de consumidor, parâmetro de contratação, metodologia de planejamento, abertura de consulta pública ou medida temporária de segurança. O efeito prático depende inteiramente do objeto — e o objeto está na ementa, na primeira linha." },
    { kind: 'paragrafo', html: "O procedimento de leitura tem seis passos e leva menos de dez minutos quando você sabe onde olhar:" },
    { kind: 'titulo', numero: "1.4", texto: "Ficha institucional · CNPE" },
    { kind: 'paragrafo', html: "Uma resolução do conselho tem densidade normativa baixa e alcance estratégico alto — combinação que confunde muita gente. Ela não contém o nível operacional de uma resolução normativa da agência; ela estabelece orientação. Mas justamente por isso ela funciona como <em>enquadramento</em>: uma vez que o conselho define que determinado tema é prioridade de política, todos os atos posteriores das demais instituições passam a citá-la como fundamento. Um exemplo recente e útil: a resolução do conselho que introduziu o conceito de <strong>governança integrada</strong> do setor, com diretrizes sobre risco e segurança energética, passou a ser fundamento de atos do comitê de monitoramento sobre parâmetros de aversão a risco nos modelos computacionais — que, por sua vez, afetam despacho e preço. A diretriz não mudou nada sozinha; ela abriu o caminho de dois atos seguintes que mudaram." },
    { kind: 'tabela', linhas: [["Sai do conselho como","Conteúdo típico","Próximo passo obrigatório"],["Resolução","Diretriz de política, prioridade, meta ou princípio","Implementação pelo ministério e pelas entidades competentes — quase sempre por portaria primeiro"],["Recomendação à Presidência","Proposta que exige decisão presidencial, decreto ou projeto de lei","Análise pela Casa Civil e pela Presidência; eventual envio ao Congresso"],["Criação de comitê ou grupo","Coordenação de tema transversal entre pastas e entidades","Plano de trabalho, estudos, cronograma e relatório"],["Diretriz de contratação","Necessidade de energia, potência, reserva ou atributo tecnológico","Portaria ministerial → estudos e habilitação pela empresa de planejamento → edital e homologação pela agência → operacionalização pela câmara"]] },
    { kind: 'titulo', numero: "1.5", texto: "Casa Civil, Presidência e o limite do \"setorial\"" },
    { kind: 'paragrafo', html: "O ministério integra o Poder Executivo e não decide sozinho tudo o que anuncia. Propostas que exigem decreto ou projeto de lei passam por coordenação governamental mais ampla — Casa Civil, Presidência, áreas econômicas. Em temas de alto impacto tarifário ou fiscal, a decisão praticamente nunca é exclusivamente setorial: envolve orçamento, política macroeconômica, meio ambiente, indústria e relações federativas." },
    { kind: 'paragrafo', html: "Isso tem uma consequência prática que vale registrar, porque explica atrasos que parecem inexplicáveis de dentro do setor. Quando um tema energético trava, com frequência ele não travou no ministério — travou na coordenação.</b> Um analista que só olha o portal do setor conclui que \"nada aconteceu\"; um analista que entende a arquitetura sabe que a próxima peça de informação pode aparecer numa medida provisória, num decreto ou numa nota de outra pasta. Repare também na assimetria de instrumento: o conselho assessora a Presidência, o ministério prepara os estudos e as minutas, coordena os órgãos setoriais e conduz a implementação. Formalmente o conselho está acima; operacionalmente o ministério é quem move a máquina. <strong>É por isso que o ministério manda mais do que o organograma sugere.</strong>" },
    { kind: 'nota', tom: "neutro", label: "Política e regulação não são a mesma camada · três níveis", html: "<b>Criança de 12 anos.</b> Imagina uma escola. A diretoria decide que a escola vai passar a ter aula de natação — essa é a política, é a escolha de para onde ir. Mas alguém ainda precisa dizer em que horário, quem pode entrar na piscina, quanto custa, o que acontece se faltar professor e quem é responsável se der problema. Esse alguém é outra pessoa, com outro caderno de regras. A decisão de ter natação não coloca ninguém na água. O regulamento é que coloca.<br/><b>Executivo.</b> Política define objetivo, prioridade e horizonte; regulação define método, obrigação, prazo e sanção. O ministério pode decidir que o país vai contratar capacidade despachável e definir o produto e o calendário; a agência é quem aprova o edital, conduz o certame, homologa o resultado e fiscaliza. A consequência prática para quem investe é que o anúncio de política não é o evento contratável — o evento contratável é o ato regulatório subsequente. Entre um e outro há uma janela de meses em que a regra ainda está em disputa e a participação em consulta pública tem retorno real.<br/><b>Especialista.</b> A distinção é de densidade normativa e de fonte de competência. Atos de política — resolução do conselho, portaria ministerial — operam por delegação política e discricionariedade de mérito, com controle judicial restrito ao desvio de finalidade e à legalidade. Atos regulatórios de agência operam sob competência legal específica, com dever de motivação técnica, exigência de análise de impacto regulatório nas hipóteses cabíveis, participação social prévia e controle de legalidade e de processo. Daí decorrem três diferenças operacionais: o ato de política raramente é autoexecutável e quase sempre delega; o ato regulatório é oponível ao agente e gera obrigação diretamente; e o vetor de influência é distinto — no primeiro caso, articulação; no segundo, contribuição técnica documentada, que fica registrada no processo e cuja resposta o regulador precisa fundamentar." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "O comparador de instrumentos é a espinha do <strong>Brazil Pulse</strong>. Interpretar uma notícia do setor não é resumi-la: é classificá-la. Um alerta que diz \"saiu portaria do ministério sobre migração\" vale pouco; um alerta que diz \"saiu portaria de política com delegação de regulamentação à agência — janela de consulta pública provável nos próximos noventa dias\" vale assinatura. A classificação por instrumento jurídico é um campo de metadado barato de extrair do Diário Oficial e caro de reproduzir sem o mapa institucional — que é exatamente o perfil de uma vantagem defensável." },
  ],
  'aula-07-02': [
    { kind: 'paragrafo', html: "O Módulo 06 contou por que a empresa de planejamento existe: depois do desmonte do planejamento determinativo nos anos 1990 e do racionamento que expôs a ausência de um responsável institucional pela expansão, a reconstrução de 2004 criou uma entidade dedicada a produzir estudo de planejamento <em>dentro do Estado, fora da empresa que opera e fora da agência que regula</em>. Aquela é a história. Esta aula é o uso: quais produtos ela publica, quando, e o que se lê primeiro em cada um." },
    { kind: 'titulo', numero: "2.1", texto: "Ficha institucional · EPE" },
    { kind: 'titulo', numero: "2.2", texto: "Três produtos, três perguntas — e o erro de confundi-los" },
    { kind: 'paragrafo', html: "Este é o ponto em que quase todo iniciante escorrega, e o escorregão tem consequência direta: usar o produto errado para responder a pergunta certa produz uma análise que parece fundamentada e está deslocada em uma década." },
    { kind: 'tabela', linhas: [["Produto","Horizonte e periodicidade","Pergunta que responde","O que se lê primeiro"],["PDE Plano Decenal de Expansão de Energia","Dez anos à frente. Ciclo anual, com consulta pública e aprovação por portaria ministerial ao final.","Como demanda, oferta, redes, combustíveis e investimentos podem evoluir no horizonte decenal, sob um conjunto declarado de premissas?","Caderno de premissas demográficas e econômicas primeiro — sempre. Depois a consolidação de resultados. O relatório completo por último, e só se você precisar de um setor específico."],["BEN Balanço Energético Nacional","Contabilidade do ano anterior. Anual, com série histórica que remonta a décadas.","Quanto o país efetivamente produziu, transformou, importou, exportou e consumiu de energia — no passado recente .","A distinção entre matriz energética e matriz elétrica. É onde mais gente confunde os dois números e cita o errado em público."],["PNE Plano Nacional de Energia","Décadas à frente. Ciclos pouco frequentes, publicado por cadernos ao longo de anos.","Quais trajetórias estruturais e incertezas podem moldar o sistema energético nas próximas décadas, sob cenários alternativos?","O caderno de cenários. Ele explica o que cada trajetória pressupõe — e sem isso os números dos demais cadernos não significam nada."]] },
    { kind: 'paragrafo', html: "<strong>A regra de uso é simples e vale decorar:</strong> o balanço é contabilidade histórica, o plano decenal é projeção sob premissas para decisão de médio prazo, e o plano nacional é exploração estratégica de longo prazo. Balanço não prevê o futuro. Plano decenal não é lista de obras obrigatórias. Plano nacional não é extensão temporal do decenal.</b> As três afirmações negativas são mais úteis que qualquer resumo positivo, porque são exatamente os três erros que circulam." },
    { kind: 'paragrafo', html: "Vale registrar um quarto instrumento que apareceu no ciclo recente e que ainda não está no vocabulário da maioria: o <strong>plano nacional de transição energética</strong>, coordenado pelo ministério com apoio técnico da empresa de planejamento, submetido a consulta pública em 2026. Ele não substitui nenhum dos três anteriores — sua função declarada é converter metas de longo prazo em roteiro operacional com ciclos de implementação, apoiado nos cenários do plano nacional de energia. É um bom exemplo de como a família de instrumentos de planejamento cresce por acréscimo, e de por que \"quantos planos existem\" é uma pergunta cuja resposta muda." },
    { kind: 'titulo', numero: "2.3", texto: "O papel nos leilões — antes da sessão, não durante" },
    { kind: 'paragrafo', html: "A empresa de planejamento aparece nos leilões numa fase que quase nunca vira notícia e que determina quem sequer chega à sessão competitiva. Ela apoia o ministério no desenho e nos parâmetros, abre e conduz o cadastramento dos empreendimentos, examina documentação técnica, fundiária, ambiental e de acesso, calcula ou subsidia garantias físicas, margens de escoamento e preços de referência, e consolida os estudos de necessidade. O objetivo declarado é reduzir o risco de contratar projetos sem condições técnicas mínimas — e o efeito prático é que a habilitação funciona como filtro." },
    { kind: 'nota', tom: "gold", label: "Fronteira com o Módulo 04", html: "Como o leilão reverso descobre preço, o que é contrato de quantidade e de disponibilidade, por que existe o problema do dinheiro faltante e como o preço de curto prazo se relaciona com o contrato de longo prazo — tudo isso é <strong>mecanismo</strong> e já foi ensinado. Aqui a pergunta é outra e é institucional: <em>quem faz qual pedaço do trabalho, em qual ordem, sob qual ato</em>. Se a leitura desta seção começar a explicar formação de preço no certame, você voltou ao Módulo 04." },
    { kind: 'titulo', numero: "2.4", texto: "Planejamento de transmissão: a fronteira com o operador" },
    { kind: 'paragrafo', html: "A expansão da rede não começa com um leilão — começa com estudo. A empresa de planejamento coordena os estudos de expansão da transmissão, em interação com o ministério, o operador, transmissoras, distribuidoras e geradores. Os relatórios caracterizam obras estruturantes, alternativas, custos, cronogramas e questões socioambientais. A agência usa esse conjunto para preparar concessões e editais. O operador complementa com a perspectiva operativa — requisitos de operação, ampliações e reforços." },
    { kind: 'paragrafo', html: "A fronteira é sutil e vale fixar porque é objeto de pergunta recorrente de decisor: <strong>a empresa de planejamento olha a expansão futura; o operador olha as condições de operação e as necessidades operativas; a agência outorga e regula.</strong> Quando alguém pergunta \"se a empresa de planejamento é só indicativa e o operador decide o despacho, quem realmente planeja o sistema?\", essa é a resposta — e ela precisa vir com a segunda parte: <em>ninguém planeja sozinho, e o desenho é deliberado</em>. Concentrar planejamento e operação na mesma entidade produziria a instituição que decide o que construir e depois avalia se o que ela construiu opera bem. A separação custa coordenação e compra independência de avaliação." },
    { kind: 'titulo', numero: "2.5", texto: "Como ler um estudo — seis verificações" },
    { kind: 'paragrafo', html: "Estudo de planejamento é lido errado com frequência porque o leitor pega o número central e ignora a estrutura que o produziu. Seis verificações resolvem quase todos os erros de uso:" },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "O plano decenal e o balanço são as duas fontes que dão <strong>contexto de longo prazo</strong> a qualquer painel de mercado — e são as duas que um terminal costuma não ter, porque exigem leitura e não apenas ingestão de série. A oportunidade é específica: um indicador que compare a trajetória realizada contra a trajetória projetada no plano vigente, atualizado a cada ciclo, é um produto analítico que praticamente ninguém entrega ao consumidor industrial. E é barato de manter, porque a base é pública e o ciclo é anual e previsível — o que o torna candidato natural a alerta automatizado: <em>\"o plano decenal do novo ciclo saiu; a premissa de carga industrial mudou em relação ao anterior.\"</em>" },
  ],
  'aula-07-03': [
    { kind: 'paragrafo', html: "O Módulo 05 explicou por que existe uma agência reguladora em geral — o problema do monopólio natural, a necessidade de compromisso crível, os antídotos institucionais contra captura. Esta aula é a montagem concreta: como a agência brasileira está organizada por dentro, como um ato dela nasce, tramita e passa a valer, e como se lê o que ela publica sem confundir quatro instrumentos que têm nomes parecidos e efeitos completamente diferentes." },
    { kind: 'titulo', numero: "3.1", texto: "Ficha institucional · ANEEL" },
    { kind: 'titulo', numero: "3.2", texto: "Diretoria colegiada: por que a decisão tem relator, voto e data" },
    { kind: 'paragrafo', html: "A agência decide em <strong>colegiado</strong>, não por autoridade individual. A diretoria tem cinco membros, um deles o diretor-geral. A indicação é do Presidente da República, com aprovação prévia do Senado Federal, para <strong>mandatos fixos e não coincidentes</strong> — a regra geral vigente para as agências reguladoras federais estabelece mandato de cinco anos, vedada a recondução, ressalvadas as hipóteses legais de transição ou complemento de mandato." },
    { kind: 'paragrafo', html: "Este é o ponto onde o cético ataca, e o ataque é legítimo: <em>a indicação é política e a sabatina é política; como isso é diferente do governo regular a si mesmo?</em> A resposta honesta não é negar a política — é descrever os filtros que o desenho cria, e reconhecer o que eles não cobrem." },
    { kind: 'tabela', linhas: [["Filtro do desenho","O que ele protege","O que ele não resolve"],["Mandato fixo e escalonado","Nenhum governo troca a diretoria inteira de uma vez; a composição atravessa ciclos eleitorais.","Vagas não preenchidas por atraso de indicação ou de sabatina esvaziam o colegiado na prática."],["Requisitos técnicos e sabatina","Filtro público de qualificação, com registro do que foi perguntado e respondido.","Qualificação formal não é independência de julgamento."],["Colegialidade","Decisão exige convencimento de pares; voto vencido fica registrado e vira insumo de litígio e de crítica.","Convergência do colegiado pode refletir cultura institucional homogênea, não deliberação real."],["Reunião pública e voto publicado","Fundamentação exposta, rastreável e criticável por terceiro.","Publicidade não garante que a premissa técnica seja reproduzível — e é aí que a análise independente entra."],["Dever de motivação","O ato precisa dizer por que decidiu assim, e a motivação é controlável judicialmente.","Motivação suficiente juridicamente pode ser insuficiente tecnicamente."]] },
    { kind: 'paragrafo', html: "O rito interno de um processo relevante segue um padrão estável: a área técnica produz nota técnica; a procuradoria examina os aspectos jurídicos; o processo é distribuído a um relator; a diretoria delibera em reunião pública; e o resultado aparece como resolução ou despacho. Para ler a decisão corretamente, procure sempre cinco campos: processo, assunto, área técnica responsável, relator e dispositivo final.</b> O dispositivo é o que produz efeito; a fundamentação está no voto e na nota técnica, e é lá que estão as premissas que interessam a quem vai contestar ou modelar." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "A composição nominal da diretoria não aparece neste módulo por decisão editorial. Mandatos escalonados garantem que qualquer lista de nomes esteja errada em algum mês de qualquer ano. O que é permanente e entra no ativo é o desenho: <strong>colegiado de cinco, mandato fixo escalonado, indicação presidencial, sabatina do Senado, decisão por voto com relator designado e voto vencido registrado.</strong> Para a composição atual, abra gov.br/aneel → Composição no dia do uso." },
    { kind: 'titulo', numero: "3.3", texto: "A lógica da divisão por matéria" },
    { kind: 'paragrafo', html: "As superintendências não são departamentos administrativos: são a divisão do trabalho regulatório por matéria, e saber qual trata do quê é o que permite achar a nota técnica certa em dois cliques em vez de vinte. A lógica da divisão é estável mesmo quando as siglas mudam, e é ela que vale internalizar — <strong>seis eixos</strong>:" },
    { kind: 'tabela', linhas: [["Eixo","Unidades (snapshot jul/2026)","O que cai aqui"],["Regulação econômica e estímulo à competição","STR — Gestão Tarifária e Regulação Econômica","Tarifas, receitas reguladas, metodologia econômica, processos tarifários, encargos e componentes financeiros. É a superintendência que assina a maior parte do que interessa a quem paga conta."],["Relações com a sociedade","SMA — Mediação Administrativa e das Relações de Consumo","Ouvidoria setorial, mediação e conciliação de conflitos entre agentes e entre agentes e consumidores, engajamento e indicadores de satisfação."],["Outorgas e potenciais hidráulicos","SCE — Concessões, Permissões e Autorizações; SEL — Secretaria de Leilões","Atos de delegação: outorga, autorização, transferência de controle, gestão de potenciais. E a preparação e execução dos certames atribuídos à agência."],["Fiscalização","SFT — Fiscalização Técnica; SFF — Fiscalização Econômica, Financeira e de Mercado","Duas frentes distintas: conformidade técnica de serviços e instalações; e conformidade econômico-financeira e condutas de mercado."],["Regulação técnica e padrões de serviço","STD — Transmissão e Distribuição; SGM — Geração e Mercado; STE — Secretaria de Inovação e Transição Energética","Regras técnicas e comerciais dos segmentos, regras de mercado, e a agenda de novas tecnologias, armazenamento, recursos distribuídos e eficiência."],["Planejamento e gestão administrativa","SGP, SGI, SGA","Pessoas, informação e administração. Raramente relevante para leitura de mercado, exceto quando o tema é dado aberto e sistemas."]] },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Essa estrutura decorre da reorganização regimental aprovada por resolução normativa de <strong>abril de 2023</strong>, com efeito a partir de maio daquele ano, que consolidou a agência em dez superintendências mais secretarias. É por isso que a lista do currículo definitivo — SRD, SRT, SRG, SCG, SRM, SRC, SFG, SFE — não bate: aquela era a estrutura anterior. Nota técnica antiga vem assinada com a sigla velha, e isso não é erro do documento; é datação.</b> Aprenda os seis eixos, que são estáveis, e confirme as siglas correntes em <b>Composição → Estrutura</b> e no regimento interno vigente antes de citar em material externo. Snapshot desta tabela: julho de 2026." },
    { kind: 'titulo', numero: "3.4", texto: "Participação social: três instrumentos, não um" },
    { kind: 'paragrafo', html: "\"Consulta pública\" virou termo guarda-chuva no jargão do setor, e a imprecisão custa oportunidade. São instrumentos distintos, com função e momento distintos:" },
    { kind: 'tabela', linhas: [["Instrumento","Quando aparece","Como contribuir com retorno real"],["Tomada de subsídios","Fase mais precoce, antes de existir minuta. A agência quer diagnóstico e evidência, não redação.","É a janela de maior alavancagem e a menos disputada. Traga dado próprio e caracterização de problema, não pedido."],["Consulta pública","Já existe minuta de norma, edital, contrato ou metodologia, com nota técnica e frequentemente análise de impacto regulatório.","Contribuição por escrito, artigo por artigo, com proposta de redação alternativa e estimativa de impacto. Genérico não move nada."],["Audiência pública","Sessão de manifestação oral, presencial ou remota, quando o debate síncrono agrega. Pode ser combinada com consulta.","Serve para expor divergência e ouvir a posição das demais partes. O registro escrito continua sendo o que pesa no processo."]] },
    { kind: 'paragrafo', html: "A afirmação de que consulta pública é formalidade é falsa, e é falsificável: as contribuições ficam documentadas, a agência produz relatório de análise das contribuições, e alterações de redação, metodologia e regra de transição entre a minuta e o texto final são verificáveis comparando os dois documentos. <strong>O procedimento de participação com retorno real tem seis passos:</strong>" },
    { kind: 'titulo', numero: "3.5", texto: "Quatro atos com nomes parecidos e efeitos opostos" },
    { kind: 'paragrafo', html: "Confundir resolução normativa com homologatória é o erro de júnior mais comum do setor, e ele é imediatamente audível numa conversa técnica. A diferença não é de importância — é de natureza jurídica: <strong>geral e abstrata</strong> contra <strong>concreta e individual</strong>." },
    { kind: 'tabela', linhas: [["Ato","Natureza","Quando aparece","O que você lê primeiro"],["Resolução Normativa — REN","Geral e abstrata: cria regra para classes de agentes e de situações.","Metodologia tarifária, regra de mercado, requisito técnico, aprovação de Procedimentos de Rede e das Regras de Comercialização.","Objeto, âmbito de aplicação, obrigações, regra de transição, revogações e anexos."],["Resolução Homologatória — REH","Concreta: homologa resultado de um processo já instruído.","Tarifas de uma distribuidora após revisão ou reajuste; resultados de processos específicos.","A quem se aplica, a partir de quando, e os anexos tarifários — que é onde estão os números."],["Resolução Autorizativa — REA","Concreta e individual: autoriza, outorga, transfere ou altera.","Autorização de empreendimento, alteração de característica técnica, transferência societária.","Beneficiário, ativo, condições, prazo e encargos — e os marcos cujo descumprimento gera penalidade."],["Despacho","Menor densidade normativa: decisão processual ou de objeto delimitado.","Aprovação de versão de procedimento operacional, decisão de trâmite, providência específica.","O dispositivo final. A fundamentação pode estar no voto ou na nota técnica referenciada."]] },
    { kind: 'nota', tom: "neutro", label: "Erro caro que parece detalhe", html: "\"Despacho é menos vinculante, então dá para ignorar.\" Falso, e caro. É por despacho que se aprova a versão vigente de procedimentos operacionais dos quais dependem prazos, sistemas e cálculos com efeito financeiro imediato. Um despacho que aprova nova versão de procedimento de comercialização pode mudar a data em que a sua garantia financeira precisa estar aportada. Densidade normativa baixa não significa consequência baixa." },
    { kind: 'titulo', numero: "3.6", texto: "Anatomia de uma resolução normativa — dez campos, nesta ordem" },
    { kind: 'paragrafo', html: "Este é o procedimento que o critério de domínio deste bloco exige e que nenhum bloco anterior pediu: não basta saber que a agência publica resoluções; é preciso saber achar e ler uma. Dez campos, sempre na mesma ordem, e o último é o mais esquecido:" },
    { kind: 'titulo', numero: "3.7", texto: "PRORET e PRODIST — dois manuais que ninguém deveria confundir" },
    { kind: 'paragrafo', html: "Os dois são conjuntos de procedimentos aprovados pela agência, organizados em módulos, e respondem perguntas diferentes:" },
    { kind: 'tabela', linhas: [["","PRORET","PRODIST"],["Nome","Procedimentos de Regulação Tarifária","Procedimentos de Distribuição de Energia Elétrica"],["Pergunta que responde","Como se calcula e se aloca receita e tarifa","Como a rede de distribuição e a relação técnica e comercial devem funcionar"],["Conteúdo","Metodologias, conceitos e fórmulas dos processos tarifários, organizados por módulos e submódulos: distribuição, estrutura tarifária, transmissão, comercialização, geração e componentes","Requisitos técnicos e comerciais da distribuição: glossário, planejamento, acesso e conexão, operação, medição, obrigações, perdas, qualidade, ressarcimento de danos, informação geográfica e fatura"],["Quem consulta","Quem modela receita, contesta metodologia ou entende o porquê de um reajuste","Quem conecta uma carga, discute qualidade de fornecimento ou reclama de cobrança"]] },
    { kind: 'paragrafo', html: "Para uma operação industrial, a divisão de trabalho entre os dois é bem concreta: <strong>o módulo de qualidade do PRODIST</strong> é onde estão os padrões de continuidade e de conformidade de tensão que fundamentam uma reclamação de fornecimento; <strong>o módulo de faturamento</strong> é onde está a regra de cobrança; e o <strong>PRORET</strong> é onde está a explicação de por que a tarifa mudou. Reclamação de qualidade que cita PRORET é reclamação que não vai ser levada a sério." },
    { kind: 'titulo', numero: "3.8", texto: "Revisão e reajuste: cada distribuidora tem a sua data" },
    { kind: 'paragrafo', html: "O Módulo 05 já ensinou a lógica econômica — Parcela A e Parcela B, base de remuneração, Fator X, o que uma revisão faz e por que ela existe. Aqui interessa a camada institucional, que é a que ninguém ensina e que decide quando você tem alguma coisa a fazer a respeito:" },
    { kind: 'lista', itens: ["<strong>A revisão tarifária periódica é por concessão, não por calendário nacional.</strong> Cada distribuidora tem sua data contratual, e a periodicidade típica é de quatro ou cinco anos conforme o contrato.","<strong>Entre revisões há o reajuste anual</strong>, também na data contratual da concessão — atualização, não reposicionamento.","<strong>O processo tem fase pública.</strong> Consulta e nota técnica antecedem a deliberação; o resultado sai como homologatória com anexos tarifários.","<strong>Existe ainda a revisão extraordinária</strong>, fora do ciclo, para eventos que quebrem o equilíbrio econômico-financeiro do contrato.","<strong>O percentual anunciado é médio.</strong> Efeito médio não é o efeito na sua unidade: modalidade tarifária, nível de tensão, demanda contratada, posto horário e estrutura de uso mudam o resultado — e é por isso que a manchete de \"reajuste de X%\" é quase inútil para decisão industrial."] },
    { kind: 'paragrafo', html: "A consequência prática é de calendário, e é a mais acionável desta aula inteira:</b> saber a data de reajuste e o ciclo de revisão da distribuidora que atende uma planta é saber quando renegociar contrato de energia, quando abrir discussão de modalidade tarifária e quando a janela de contribuição pública está aberta. Um consumidor que descobre o processo pela conta de luz já perdeu as três oportunidades." },
    { kind: 'nota', tom: "neutro", label: "O que a agência é · três níveis", html: "<b>Criança de 12 anos.</b> É quem escreve e cobra as regras das empresas de energia — quanto elas podem cobrar, com que qualidade precisam entregar e o que acontece se não entregarem. Cinco pessoas decidem juntas, em reunião aberta, e cada uma explica em voz alta por que votou daquele jeito. Elas ficam no cargo por um tempo definido e não podem ser trocadas só porque alguém não gostou de uma decisão.<br/><b>Executivo.</b> É a autarquia especial que transforma lei e política em metodologia tarifária, padrão de qualidade, outorga, contrato e fiscalização. Decide em colegiado de cinco diretores com mandato fixo escalonado, em reunião pública, com relator, voto publicado e dever de motivação técnica. Para uma empresa, isso significa três coisas práticas: as decisões que afetam o seu custo são previsíveis em calendário, são precedidas de fase pública em que é possível contribuir, e são contestáveis por argumento técnico documentado — não por relacionamento.<br/><b>Especialista.</b> Autarquia sob regime especial da Lei nº 9.427/1996, sob a governança da Lei nº 13.848/2019, exercendo competência normativa derivada, poder de outorga, poder de polícia e função de mediação administrativa. O ato regulatório submete-se a processo administrativo com dever de motivação, participação social prévia nas modalidades de tomada de subsídios, consulta e audiência, análise de impacto regulatório nas hipóteses cabíveis, e controle de legalidade e de processo pelo Judiciário e pelo controle externo. A tensão estrutural é conhecida: a proteção de mandato reduz captura por ciclo político e não elimina captura por assimetria informacional, que opera na margem técnica — premissa de modelo, alocação contábil, definição normativa. O antídoto verificável não é institucional, é metodológico: método publicado antes, dado de entrada disponível, resultado reproduzível por terceiro." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Duas oportunidades, e as duas são de calendário. A primeira: um <strong>alerta de ciclo tarifário por distribuidora</strong> — \"a distribuidora que atende sua unidade tem reajuste em três meses e o processo já está em fase pública\" — é uma funcionalidade barata de construir sobre dado público e de valor direto para o cliente industrial. A segunda: um <strong>monitor de consultas e audiências públicas abertas</strong>, classificado por tema e por prazo restante, transforma a janela de influência de algo que só grandes agentes acompanham em algo que qualquer assinante enxerga. As duas são diagnósticas, não recomendativas — e nenhuma exige relação com a agência." },
  ],
  'aula-07-04': [
    { kind: 'paragrafo', html: "O Módulo 02 já ensinou o que o operador faz com a física: como o sistema interligado é operado, o que entra na decisão de despacho, por que a água armazenada tem valor de oportunidade. Não vamos repetir nada disso. Esta aula trata do operador como <em>instituição</em>: qual é a natureza jurídica, quem o compõe, quais documentos ele é obrigado a publicar e em que cadência, o que é cada produto operativo <strong>como entregável com data</strong>, e qual portal expõe qual dado com qual defasagem." },
    { kind: 'titulo', numero: "4.1", texto: "Ficha institucional · ONS" },
    { kind: 'titulo', numero: "4.2", texto: "Por que a operação é centralizada aqui" },
    { kind: 'paragrafo', html: "Esta é a pergunta que todo interlocutor de fora faz, e ela merece a resposta pelas propriedades do próprio sistema — não por contraste com nada." },
    { kind: 'paragrafo', html: "O sistema brasileiro é continental, interligado e historicamente hidrotérmico, com <strong>reservatórios em cascata</strong> e forte interdependência entre bacias e regiões. A consequência técnica é decisiva: a decisão de gerar em uma usina hoje altera a água disponível para outras usinas amanhã, altera o intercâmbio entre subsistemas, altera o congestionamento na rede e altera a margem de segurança de áreas distantes. O problema não é separável por agente.</b> Não existe forma de cada gerador decidir isoladamente quanto produzir sem que a soma das decisões individuais produza um resultado pior — e frequentemente inseguro — para o conjunto." },
    { kind: 'paragrafo', html: "Daí decorrem três propriedades do desenho, e vale enunciá-las porque são o que se responde numa pergunta de segunda ordem:" },
    { kind: 'nota', tom: "gold", label: "Fronteira com o Módulo 02", html: "Como o valor da água entra na função objetivo, como a ordem de mérito se forma, o que acontece com inércia e frequência quando a matriz muda — isso é operação física e já foi ensinado. Se a leitura desta aula começar a explicar o mecanismo de decisão do modelo, você voltou ao Módulo 02. Aqui a pergunta é: <em>qual documento sai, quando, assinado por quem, e onde eu leio</em>." },
    { kind: 'titulo', numero: "4.3", texto: "Os centros: um nacional, quatro regionais" },
    { kind: 'paragrafo', html: "A operação não acontece num único lugar. Existe um <strong>centro nacional</strong>, responsável pela coordenação do sistema como um todo, e <strong>centros regionais</strong> que operam as áreas — Norte e Centro-Oeste, Nordeste, Sudeste e Sul. Os centros funcionam vinte e quatro horas por dia, monitorando frequência, tensão, fluxos, reservas, disponibilidade, contingências e intercâmbios, e coordenando os agentes proprietários das instalações." },
    { kind: 'paragrafo', html: "A informação operacionalmente útil aqui não é decorar as siglas dos centros — é entender a consequência da arquitetura: <strong>a coordenação é hierárquica e a responsabilidade é distribuída.</strong> Quando uma perturbação relevante acontece, a análise posterior tipicamente envolve o centro nacional, o centro regional da área, o agente proprietário da instalação envolvida e a fiscalização técnica da agência — e o relatório de análise de perturbação é documento público, o que o torna uma das fontes mais subutilizadas do setor por quem faz análise de confiabilidade." },
    { kind: 'titulo', numero: "4.4", texto: "PMO e programação diária como produtos com data" },
    { kind: 'paragrafo', html: "Aqui está a virada de lente que separa este módulo do Módulo 02. Deixe de pensar em PMO como \"o processo de decisão do despacho de médio prazo\" e passe a pensar nele como <strong>um documento que é publicado, com data, com revisões previsíveis, e que você pode ler</strong>." },
    { kind: 'tabela', linhas: [["Horizonte","Produto / processo","O que ele decide","Cadência"],["Médio prazo anos","Estudos energéticos e modelo de médio prazo","Política de operação e valoração do armazenamento no horizonte plurianual, sob incerteza hidrológica","Ciclos de estudo; parâmetros revistos por decisão institucional, não por rotina"],["Curto prazo mês / semana","PMO — Programa Mensal de Operação Energética","Metas e políticas de geração térmica, intercâmbios entre subsistemas, metas de armazenamento e diretrizes para a programação diária","Mensal, com revisões semanais — a revisão semanal é o evento que mais gente ignora e que mais muda expectativa"],["Curtíssimo prazo dia / hora","Programação diária da operação eletroenergética","Despacho detalhado, restrições, acionamento de unidades, intervenções e programação do dia seguinte","Diária"],["Tempo real","Operação dos centros","Comandos, coordenação, correção de desvios, tratamento de contingência","Contínua"],["Pós-operação","Apuração e análise","Dados realizados, ocorrências, perturbações, desempenho e recomendações","Apuração com defasagem; relatórios de perturbação conforme evento"]] },
    { kind: 'paragrafo', html: "Sobre nomenclatura, uma advertência que evita constrangimento: <strong>PDO</strong> é usado no jargão do setor para designar o conjunto de programação e produtos diários; nos documentos do operador, o termo aparece com frequência como <em>programação diária da operação eletroenergética</em>. Use a sigla em conversa, use o nome completo em documento — e nunca trate PDO como se fosse um relatório único com um nome fixo." },
    { kind: 'titulo', numero: "4.5", texto: "A cadeia de modelos como divisão institucional de trabalho" },
    { kind: 'paragrafo', html: "Três modelos encadeados, cada um resolvendo o problema que o anterior não consegue representar. O Módulo 02 explicou a lógica econômica; aqui interessa o que cada um <em>entrega</em> e a quem:" },
    { kind: 'tabela', linhas: [["Modelo","Horizonte","O que entrega ao seguinte"],["NEWAVE","Médio prazo, tipicamente anos, com representação da incerteza hidrológica","Funções de custo futuro — a valoração do armazenamento que o modelo seguinte usa como condição de contorno"],["DECOMP","Curto prazo, semanas do mês, com maior detalhamento de usinas e restrições","Metas semanais e condições que a programação diária detalha"],["DESSEM","Curtíssimo prazo, com discretização intradiária e acionamento de unidades","Base do despacho detalhado e da formação horária do preço de curto prazo"]] },
    { kind: 'nota', tom: "neutro", label: "A ideia essencial — e a que mais rende em conversa técnica", html: "Os modelos não descobrem a verdade. Eles <strong>otimizam uma função objetivo sob dados, premissas e restrições declaradas</strong>. Alterar previsão de carga, previsão de afluência, disponibilidade declarada, representação da rede ou <em>parâmetros de aversão a risco</em> altera despacho e altera preço. Isso não é crítica: é a descrição correta de como o sistema funciona, e é por isso que decisões sobre parâmetros de modelo são institucionalmente relevantes — elas passam por deliberação de comitê e por aprovação regulatória, e não são escolha técnica de bastidor. Um analista que entende isso lê uma mudança de parâmetro de aversão a risco como o que ela é: uma decisão com efeito de preço." },
    { kind: 'titulo', numero: "4.6", texto: "Procedimentos de Rede: propostos por um, aprovados por outro" },
    { kind: 'paragrafo', html: "Os Procedimentos de Rede são o conjunto de regras técnicas de coordenação, controle, planejamento, programação, operação, integração e avaliação do sistema interligado, organizado em módulos e submódulos: relacionamento com agentes, critérios e requisitos, planejamento, programação, operação, avaliação, integração, contratos e contabilização de serviços, indicadores." },
    { kind: 'paragrafo', html: "O ponto institucional é curto e é uma pergunta de prova: o operador propõe; a agência aprova.</b> Documentos normativos dos Procedimentos de Rede são aprovados por ato regulatório; manuais e documentos operacionais seguem a governança definida. Quem diz que \"o operador escreve e aprova as próprias regras\" está errado, e o erro é relevante porque a aprovação regulatória é justamente o mecanismo que impede que uma entidade mantida pelos agentes coordenados defina sozinha as regras que os coordenam." },
    { kind: 'titulo', numero: "4.7", texto: "O portal aberto e a questão da defasagem" },
    { kind: 'paragrafo', html: "O portal de dados abertos do operador é, junto com o da câmara de comercialização, a fonte mais rica do setor elétrico brasileiro — e a menos explorada por quem não é agente. Séries de carga, geração por fonte e por subsistema, intercâmbio, armazenamento de reservatórios, restrições e disponibilidade estão publicadas em formato aberto." },
    { kind: 'paragrafo', html: "A disciplina de uso tem três regras, e ignorar qualquer uma delas produz análise que não se sustenta:" },
    { kind: 'lista', itens: ["<strong>Dado verificado não é dado de tempo real.</strong> Séries operativas passam por apuração de pós-operação, e o valor publicado hoje sobre ontem pode ser revisto. Para análise de tendência, isso é irrelevante; para conciliação financeira, é decisivo.","<strong>Granularidade e defasagem variam por série.</strong> Não presuma que tudo tem a mesma resolução temporal nem a mesma latência. A verificação leva um minuto e evita um gráfico errado.","<strong>Dado operativo não é dado comercial.</strong> Geração medida pelo operador e geração contabilizada pela câmara respondem perguntas diferentes, com finalidades e regras diferentes. Cruzar as duas sem declarar a diferença é o erro mais fácil de cometer e o mais difícil de justificar depois."] },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "O portal aberto do operador é o principal <em>endpoint</em> do backend na fase brasileira, e a arquitetura correta já está desenhada nesta aula: <strong>séries operativas para o painel de mercado, revisão semanal do programa mensal como gatilho de alerta, e relatório de análise de perturbação como fonte de conteúdo analítico</strong>. Vale sublinhar a segunda: quase nenhum produto de mercado no Brasil trata a revisão semanal como evento monitorável, e ela é justamente o momento em que a expectativa de curto prazo é atualizada oficialmente. Um alerta de \"revisão semanal publicada — o que mudou em relação à anterior\" é diferenciação real, construída inteiramente sobre dado público." },
  ],
  'aula-07-05': [
    { kind: 'titulo', numero: "5.1", texto: "Ficha institucional · CCEE" },
    { kind: 'titulo', numero: "5.2", texto: "Contabilização e liquidação como processo com calendário" },
    { kind: 'paragrafo', html: "O erro mais comum sobre o mercado de curto prazo é tratá-lo como uma bolsa onde toda a energia é comprada na hora. Ele é, sobretudo, o mecanismo de acerto das diferenças de um sistema majoritariamente contratado.</b> Para cada agente e cada período, a câmara compara posição contratual, medição, perdas, garantia física, mecanismos aplicáveis e encargos; as diferenças resultantes são valoradas ao preço de curto prazo do submercado e do período; e o resultado é uma posição financeira credora ou devedora." },
    { kind: 'paragrafo', html: "Pensar nisso como <em>processo mensal com etapas datadas</em> é o que muda a operação de quem participa. A sequência típica:" },
    { kind: 'titulo', numero: "5.3", texto: "Garantia financeira, e o que acontece quando ela falta" },
    { kind: 'paragrafo', html: "Agentes com posição devedora precisam aportar garantia calculada segundo procedimento e cronograma. A garantia reduz risco de contraparte; <strong>ela não elimina inadimplência</strong>. Se o aporte for insuficiente, seguem-se ajustes de posição, restrições e consequências regulatórias." },
    { kind: 'paragrafo', html: "O ponto arquitetural — e é dele que decorre a maior parte do risco sistêmico do ambiente comercial — é que a liquidação é multilateral e por rateio</b>. A câmara apura obrigações e coordena o fluxo financeiro; ela não transforma cada credor em cobrador direto de cada devedor. A consequência é direta: <strong>o que entra é o que sai.</strong> Se falta recurso no fundo de liquidação, o valor faltante é distribuído como redução proporcional entre os credores. Nenhum credor individual pode se proteger sozinho contra a inadimplência de um devedor que ele não escolheu e com quem não contratou." },
    { kind: 'nota', tom: "gold", label: "Fronteira com o Módulo 06", html: "Por que essa propriedade produziu, entre 2015 e 2025, um passivo travado em juízo, três leis sucessivas de repactuação e uma cultura de desconfiança entre agentes — isso é história institucional e já foi contado no Módulo 06. Aqui a informação é operacional e vale para hoje: <em>o rateio é característica permanente do desenho, e quem participa do ambiente livre precisa saber que a sua exposição não é apenas à sua contraparte.</em>" },
    { kind: 'titulo', numero: "5.4", texto: "MRE na prática" },
    { kind: 'paragrafo', html: "O mecanismo de realocação de energia existe por uma razão puramente institucional: <strong>o operador decide o despacho sistêmico, e uma usina hidrelétrica individual não controla a própria geração.</strong> Seria arbitrário penalizar um gerador por gerar menos que sua garantia física quando a decisão de gerar não foi dele." },
    { kind: 'paragrafo', html: "O mecanismo compartilha a energia produzida entre as usinas hidrelétricas participantes: quem gera acima da sua garantia física transfere excedente contábil a quem gera abaixo, dentro das regras. Quando a geração total do conjunto fica abaixo da soma das garantias físicas, surge exposição associada ao fator de ajuste da geração hidráulica, com alocação de risco e mecanismos de tratamento previstos em regra. Pequenas centrais podem participar nas condições previstas." },
    { kind: 'paragrafo', html: "A formulação precisa, para uso oral: <em>o mecanismo socializa o risco operativo intrassistema — o risco de a sua usina específica ter sido despachada menos — mas não elimina o risco hidrológico agregado do conjunto.</em> Quem diz que o mecanismo \"protege o gerador hidráulico do risco hidrológico\" está errado pela metade, e é a metade que importa." },
    { kind: 'titulo', numero: "5.5", texto: "As famílias de contrato" },
    { kind: 'paragrafo', html: "Contratos no setor têm siglas próximas e lógicas distintas. Três são obrigatórias de saber; as demais valem reconhecer." },
    { kind: 'tabela', linhas: [["Contrato","Ambiente / origem","Lógica"],["CCEAR Contrato de Comercialização de Energia no Ambiente Regulado","Ambiente regulado; leilões regulados","Entre vendedores e distribuidoras, por quantidade ou por disponibilidade, com preço e condições definidos no certame"],["CCEAL Contrato de Comercialização de Energia no Ambiente Livre","Ambiente livre; negociação bilateral","Compra, venda ou cessão entre geradores, comercializadores e consumidores, com preço e condições livremente negociados. A câmara não define o preço; ela registra o montante e aplica as regras."],["CCEN Contrato de Cotas de Energia Nuclear","Política de cotas nucleares","Alocação regulada da energia nuclear às distribuidoras e ao consumo regulado, conforme regras"],["CCGF · CER · CRCAP e outros","Regimes específicos","Cotas de garantia física, energia de reserva, reserva de capacidade, além de instrumentos de programas específicos e de importação. Reconheça a sigla e saiba a qual regime ela pertence."]] },
    { kind: 'titulo', numero: "5.6", texto: "O rito operacional de uma migração" },
    { kind: 'paragrafo', html: "Esta seção trata do <strong>rito</strong>, não da decisão. Se a operação deve ou não migrar, com qual estratégia de contratação e sob qual perfil de risco, é assunto do Bloco 9. Aqui a pergunta é institucional: <em>quais órgãos entram, em que ordem, e o que trava</em>." },
    { kind: 'nota', tom: "neutro", label: "Onde a migração trava na prática", html: "Três pontos, e nenhum deles é a escolha do fornecedor. <strong>Primeiro:</strong> prazo de denúncia à distribuidora — é contratual, é rígido e é onde a maioria dos projetos perde um ciclo. <strong>Segundo:</strong> adequação de medição e telemetria, que envolve terceiros e cronograma físico. <strong>Terceiro:</strong> modelagem e validação de cadastro, que é burocrático, silencioso e não perdoa dado inconsistente. A negociação de energia é a parte visível; as três acima são as que determinam a data efetiva." },
    { kind: 'titulo', numero: "5.7", texto: "A fronteira exata entre operador e câmara" },
    { kind: 'paragrafo', html: "Esta é a distinção mais cobrada do bloco inteiro e a que mais rende quando dita com precisão. Formule assim, e não de outro jeito:" },
    { kind: 'paragrafo', html: "A frase correta, palavra por palavra: o operador produz a programação operativa; a câmara forma e publica o preço de liquidação conforme a metodologia oficial e usa esse preço na contabilização.</b> Os dois utilizam a mesma cadeia oficial de modelos e bases coordenadas, com finalidades diferentes — e podem existir tratamentos específicos justamente porque operação e preço respondem a perguntas distintas. Dizer \"a agência define o preço de curto prazo\" é impreciso: a agência aprova as regras e os limites; a câmara calcula e publica." },
    { kind: 'nota', tom: "neutro", label: "Por que existem duas entidades e não uma · três níveis", html: "<b>Criança de 12 anos.</b> Imagina um jogo de futebol. Uma pessoa apita e manda o jogo acontecer — ela decide quem entra, quem sai, quando para. Outra pessoa, depois, conta os gols e vê quem ganhou o quê. Se fosse a mesma pessoa fazendo as duas coisas, ninguém confiaria no placar, porque ela poderia mudar o jogo para mudar o resultado. Por isso são duas.<br/><b>Executivo.</b> O despacho é decidido de forma sistêmica pelo operador, o que faz com que a geração efetiva de cada usina divirja rotineiramente do que ela contratou — sem que isso seja descumprimento de contrato. Alguém precisa apurar essa divergência e transformá-la em obrigação financeira. Concentrar as duas funções na mesma entidade significaria que quem decide a operação também decide a consequência econômica dela, o que criaria incentivo direto na sala de controle. A separação custa coordenação e compra credibilidade no resultado financeiro.<br/><b>Especialista.</b> A separação resolve um conflito de agência estrutural. Num sistema hidrotérmico interligado com otimização centralizada, a decisão operativa gera externalidade financeira difusa e assimétrica entre agentes; se o operador também apurasse e liquidasse, cada decisão de despacho carregaria um efeito distributivo sob controle da mesma entidade que a toma, e o custo de monitorá-la seria proibitivo. A arquitetura brasileira separa por função e reúne por regulação: as regras técnicas propostas pelo operador e as regras comerciais aplicadas pela câmara são ambas aprovadas por ato da agência, e ambas as entidades são fiscalizadas por ela. Note que a separação não elimina o acoplamento — as duas usam a mesma cadeia oficial de modelos —, ela elimina a <em>discricionariedade conjunta</em>. É por isso que a resposta correta à pergunta \"quem define o preço\" é: a metodologia é aprovada pela agência, o cálculo é executado pela câmara, e as condições operativas que alimentam o cálculo vêm do processo do operador." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Os dados abertos da câmara são a segunda perna da arquitetura de fontes, e a mais rica em informação de <em>mercado</em> — contratos, agentes, migração, consumo por classe. Duas oportunidades imediatas para o consumidor industrial: um <strong>painel de calendário comercial</strong> que traduz o ciclo mensal em datas acionáveis para quem já está no ambiente livre, e um <strong>diagnóstico de rito de migração</strong> que mapeia, para uma unidade específica, quais etapas já estão cumpridas e quais são o caminho crítico. O segundo é diagnóstico, não recomendação: ele descreve o rito e identifica o gargalo, sem afirmar que migrar é a decisão certa nem prometer resultado." },
  ],
  'aula-07-06': [
    { kind: 'titulo', numero: "6.1", texto: "Ficha institucional · CMSE" },
    { kind: 'paragrafo', html: "A pergunta cética inevitável é: <em>se o comitê monitora segurança de suprimento desde 2004, por que houve crise depois disso?</em> A resposta honesta reconhece o limite do desenho. O comitê integra informação e recomenda; ele não contrata, não despacha e não regula. Sua eficácia depende inteiramente de as instituições competentes converterem a recomendação em ato — e essa conversão passa por prazo de regulamentação, disponibilidade orçamentária, decisão de política e, às vezes, por processo legislativo. O comitê resolve a falha de <em>informação</em> que o Módulo 06 identificou em 2001; ele não resolve, por desenho, a falha de <em>execução</em>.</b> Quem responde essa pergunta com defesa da instituição não entendeu a arquitetura; quem responde descrevendo o limite dela, entendeu." },
    { kind: 'titulo', numero: "6.2", texto: "Ficha institucional · CADE" },
    { kind: 'nota', tom: "neutro", label: "Três datas distintas que a imprensa trata como uma", html: "Numa aquisição relevante do setor de comercialização de energia, existiram — e existem sempre — <strong>eventos separados no tempo</strong>: o anúncio do acordo, a <em>decisão concorrencial</em>, o <em>fechamento societário</em> e, quando aplicável, a <em>validação setorial</em> pela agência e pela câmara de comercialização. São trilhos independentes e cumulativos. Consumar a operação antes da aprovação obrigatória é <em>gun jumping</em>, com consequência própria. <strong>Números vivos:</strong> o caso Vibra–Comerc é o exemplo recente que o currículo cita, e as datas de cada evento — parecer, fechamento e validações setoriais — precisam ser confirmadas no processo do conselho de defesa da concorrência e nos comunicados da companhia antes de qualquer citação externa. O que é permanente e vale decorar é a <strong>estrutura</strong>: aprovação concorrencial não é conclusão da operação, e aprovação concorrencial não substitui validação setorial." },
    { kind: 'titulo', numero: "6.3", texto: "A periferia: cinco atores que travam projeto" },
    { kind: 'paragrafo', html: "Nenhum deles aparece na frase para decorar. Todos eles aparecem no caminho crítico de um empreendimento." },
    { kind: 'tabela', linhas: [["Órgão","Pergunta que ele responde","Instrumento típico","Não confundir com"],["BNDES Banco Nacional de Desenvolvimento Econômico e Social","O projeto é financiável, em quais condições e com qual prazo?","Linhas de financiamento de longo prazo, diretas ou por agentes financeiros; análise de capacidade de pagamento, engenharia, contratos, riscos socioambientais e garantias","Outorga ou garantia pública de receita. O banco não autoriza nada — transforma projeto já autorizado em operação financiável"],["IBAMA e órgãos ambientais estaduais","Os impactos ambientais são aceitáveis e sob quais condicionantes?","Licença prévia, de instalação e de operação, nessa ordem, com condicionantes cumulativas","Autorização elétrica da agência. São competências independentes e cumulativas — uma jamais substitui a outra"],["ANA Agência Nacional de Águas e Saneamento Básico","Há disponibilidade e direito de uso da água em corpo de domínio da União?","Declaração de reserva de disponibilidade hídrica, que antecede a licitação ou autorização do potencial e depois se converte em outorga de direito de uso ao titular","Gestão energética do reservatório, que é do operador. Outorga de água não é outorga de energia"],["TCU Tribunal de Contas da União","O processo público atende legalidade, economicidade e boa governança?","Acórdãos com determinações, recomendações, sanções e, em hipóteses próprias, sustação de ato ou contrato","Regulação cotidiana da agência. O tribunal audita o processo; ele não redefine tarifa"],["ANP Agência Nacional do Petróleo, Gás Natural e Biocombustíveis","Como funciona e é regulada a cadeia do combustível que abastece a térmica?","Resoluções e autorizações de produção, processamento, transporte, movimentação, estocagem e comercialização","Autorização elétrica da usina, que é da agência de energia elétrica. O serviço local de gás canalizado, além disso, é competência estadual"]] },
    { kind: 'paragrafo', html: "Uma nota sobre a repartição de competência ambiental, porque é onde mais se erra: <strong>a competência para licenciar não é automaticamente federal.</strong> Ela se define por critérios legais de porte, localização e natureza do impacto — determinados empreendimentos de grande porte, projetos com impacto que atravessa fronteira estadual, situações envolvendo áreas protegidas federais. Fora desses critérios, o licenciamento tramita em órgão estadual ou municipal. Dizer \"toda usina é licenciada pelo órgão federal\" é errado e leva a procurar processo no lugar errado." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "A periferia é o ponto cego de praticamente toda a inteligência de mercado do setor, e por uma razão simples: os dados estão espalhados em cinco portais que não conversam entre si. Um <strong>monitor de eventos de periferia</strong> — acórdãos com efeito setorial, atos de concentração em análise no setor de energia, decisões de licenciamento de empreendimentos relevantes — é conteúdo de alto valor por assinatura e baixo custo marginal, porque todas as fontes são públicas. E ele reforça a tese de independência de um jeito difícil de replicar: uma comercializadora não tem incentivo para publicar análise de concentração de mercado que a inclua." },
  ],
  'aula-07-07': [
    { kind: 'titulo', numero: "7.1", texto: "As sete costuras" },
    { kind: 'paragrafo', html: "Sete pontos em que a divisão limpa de funções não se sustenta. Cada um deles é uma pergunta que já foi feita a alguém que sabia a frase e não sabia mais nada." },
    { kind: 'tabela', linhas: [["A frase diz","Mas também acontece que","Por que a costura existe"],["ANEEL regula","A agência também fiscaliza e media conflito — inclusive entre agentes e entre agentes e consumidores.","Regular sem fiscalizar produz norma decorativa; e conflito de interpretação regulatória precisa de foro administrativo antes do judicial."],["ONS opera","O operador também planeja a operação em horizonte de médio prazo e propõe as regras técnicas do sistema.","Não existe operar bem amanhã sem programar hoje; e quem opera é quem conhece o requisito técnico que precisa virar norma."],["CCEE comercializa e liquida","A câmara não comercializa — administra, contabiliza e liquida. E também opera sistemas de leilão e produz estatística de mercado.","A abreviação da frase é didática. A câmara é infraestrutura de mercado, não participante dele."],["EPE planeja","A empresa de planejamento também habilita tecnicamente projetos — o que é decisão com efeito direto e excludente.","Planejar sem filtrar viabilidade produziria certames com projetos inexequíveis; e o filtro precisa estar antes da sessão."],["MME faz política","O ministério também homologa — plano decenal, resultados no âmbito de sua competência — e outorga geração em competência delegada.","Política sem instrumento de execução seria declaração; e a outorga é o ponto em que a política encontra o projeto concreto."],["CMSE monitora segurança","O comitê também delibera sobre parâmetros que alimentam modelos com efeito sobre despacho e preço.","Monitorar risco sem poder de influir sobre a representação do risco nos modelos seria monitorar um retrato que não se pode corrigir."],["CADE controla concorrência","A agência setorial também analisa a mesma operação — sob outra pergunta: requisitos regulatórios, transferência de controle e capacidade técnica e econômico-financeira.","Duas perguntas distintas sobre o mesmo fato. Uma operação pode precisar das duas aprovações, e uma jamais supre a outra."]] },
    { kind: 'paragrafo', html: "A formulação de segunda ordem, para uso oral:</b> a frase descreve a <em>função primária</em> de cada instituição, não o conjunto de suas competências. Quase todas exercem função secundária em outra camada, e é justamente nas funções secundárias que estão os acoplamentos. Quem responde assim mostra que sabe a frase e sabe por que ela é simplificação — que é exatamente o que o interlocutor está testando." },
    { kind: 'titulo', numero: "7.2", texto: "Um ato do início ao fim" },
    { kind: 'paragrafo', html: "A melhor forma de fixar o mapa é seguir um caso realista de ponta a ponta. Tome uma <strong>térmica a gás viabilizada por contratação regulada</strong> — não porque seja o caminho universal, mas porque é o que atravessa mais instituições. Repare em quantas vezes a bola muda de mão, e em quantas etapas o \"próximo passo\" é de outro órgão." },
    { kind: 'tabela', linhas: [["Etapa","Quem age","O que sai"],["1. Diagnóstico de necessidade","EPE e ONS; CMSE pode reforçar urgência","Estudos de expansão e de operação identificam necessidade de energia, potência, flexibilidade ou suporte regional"],["2. Diretriz de política","CNPE e MME","Orientação estratégica: contratar capacidade, atributos exigidos, horizonte, objetivo de segurança"],["3. Portaria de leilão","MME","Produtos, prazos, requisitos e datas. A portaria não escolhe vencedor"],["4. Estruturação do projeto","Empreendedor; ANP e agência estadual na cadeia do gás; órgão ambiental competente","Terreno, licença, conexão preliminar, contrato ou estratégia de combustível, estudos e financiamento"],["5. Habilitação técnica","EPE","Cadastro, verificação de documentação, combustível, licenciamento, acesso e parâmetros. Projeto não habilitado não participa"],["6. Edital e sessão","ANEEL; CCEE fornece sistemas conforme o desenho","Consulta quando aplicável, aprovação do edital, condução e homologação do resultado"],["7. Contrato e outorga","ANEEL; TCU pode acompanhar","Assinatura do instrumento contratual, autorização e definição dos marcos fiscalizáveis"],["8. Financiamento e construção","BNDES e bancos; órgão ambiental; ANEEL","Análise de contratos, riscos e garantias; acompanhamento de condicionantes; fiscalização de cronograma"],["9. Conexão e integração","ONS e transmissora ou distribuidora","Parecer de acesso, requisitos técnicos, testes, modalidade de operação e integração ao sistema"],["10. Operação","ONS","Programação e despacho conforme custo, inflexibilidade, contrato, segurança e restrições. A usina pode ficar disponível sem gerar continuamente"],["11. Medição e contabilização","CCEE","Recebe medição, registra contrato, aplica regras e encargos, apura posição e liquida"],["12. Monitoramento contínuo","CMSE, ANEEL, ANP; CADE se houver operação societária notificável","Contribuição à segurança, fiscalização de desempenho, cadeia de combustível e análise concorrencial"]] },
    { kind: 'nota', tom: "gold", label: "Teste de roteamento — responda antes de continuar", html: "Se a usina falha em entregar por falta de combustível, o problema pode envolver contrato privado, regulação da cadeia de gás e fiscalização setorial — três endereços distintos. Se o operador não a despacha, isso <em>não</em> significa descumprimento de contrato: despacho é decisão física e contrato é posição comercial. Se há diferença entre contrato e geração, quem apura é a câmara. Se o projeto atrasa e ameaça segurança de suprimento, quem monitora e recomenda é o comitê — e quem eventualmente age é outro. <strong>Quatro fatos, quatro endereços. É isso que o critério de domínio deste bloco pede em quinze segundos.</strong>" },
    { kind: 'titulo', numero: "7.3", texto: "O segundo critério: navegar sem tutorial" },
    { kind: 'paragrafo', html: "O critério de domínio deste bloco é duplo, e a segunda metade é a que nenhum bloco anterior exigiu: <em>\"você consegue navegar todos os sites oficiais sem precisar de tutorial.\"</em> Isso não se resolve lendo — resolve-se sabendo, para cada dado que você precisa, qual órgão publica, em qual portal, com qual granularidade, em qual formato e com qual defasagem." },
    { kind: 'paragrafo', html: "É por isso que o instrumento seguinte existe, e é o gancho de produto mais direto de todos os módulos até agora: o localizador de dado é, literalmente, o mapa de fontes do backend da plataforma na fase brasileira.</b> Cada linha dele é um <em>endpoint</em>, uma cadência de coleta e uma expectativa de latência." },
    { kind: 'titulo', numero: "7.4", texto: "O metabolismo do setor" },
    { kind: 'paragrafo', html: "O setor tem calendário, e planejar contra esse calendário é vantagem. Publicações anuais, ciclos mensais, revisões semanais, produtos diários e datas contratuais individuais de cada distribuidora convivem num ritmo que é previsível para quem o conhece e invisível para quem não conhece. <strong>Quase todo evento de valor no setor é agendado com antecedência</strong> — o que significa que quem monta o calendário deixa de reagir a notícia e passa a se preparar para ela." },
    { kind: 'titulo', numero: "7.5", texto: "Onde a GridAlpha se conecta a cada portal" },
    { kind: 'paragrafo', html: "Fechando o bloco pelo lado do produto, e sem retórica. A tabela abaixo é a tradução direta do mapa institucional em arquitetura de fontes — e é o artefato que sai deste módulo para dentro da engenharia." },
    { kind: 'tabela', linhas: [["Portal","O que a plataforma consome","Cadência de coleta","Que produto isso alimenta"],["Operador — dados abertos","Carga, geração por fonte e subsistema, intercâmbio, armazenamento, restrições","Diária, com reprocessamento após apuração","Painel de mercado; contexto de análise de conta; alerta de revisão semanal"],["Câmara — dados abertos","Preço de curto prazo, contabilização, agentes, contratos agregados, migração, consumo por classe","Diária e mensal conforme a série","Painel de mercado; diagnóstico de rito de migração; estatística setorial"],["Agência — tarifas e atos","Tarifas homologadas, calendário de revisão e reajuste por concessão, consultas e audiências abertas, atos publicados","Evento e ciclo","Análise de conta; alerta de ciclo tarifário; monitor de janela de participação"],["Empresa de planejamento","Plano decenal, balanço, estudos e bases abertas","Anual e por ciclo de publicação","Contexto de longo prazo; comparação entre trajetória projetada e realizada"],["Ministério, conselho e comitê","Portarias, resoluções de política e atas de monitoramento","Evento","Roteador de notícia; alerta regulatório; conteúdo editorial"],["Periferia","Atos de concentração no setor, acórdãos com efeito setorial, decisões de licenciamento relevantes","Evento","Monitor de estrutura de mercado; contexto de risco de projeto"]] },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto — e por que a independência é estrutural", html: "Todas as seis linhas acima são <strong>dado público</strong>. Nenhuma exige convênio, contrato de licenciamento, associação a entidade ou permissão de qualquer órgão. Essa é a fundamentação técnica da Trava 1, e ela merece ser dita com precisão: a GridAlpha é uma nova camada independente</b> porque a matéria-prima da análise está aberta a qualquer um — o que significa que a independência não depende de postura declarada, e sim de uma propriedade verificável da arquitetura de dados. Uma camada analítica cuja fonte é pública não pode ser cortada por um fornecedor descontente com a conclusão. O corolário também é honesto: se o dado é público, o insumo não é a vantagem. A vantagem está na <em>curadoria, na interpretação institucional e no roteamento</em> — que é exatamente o que este módulo ensina e o que não se copia sem construir o mesmo mapa." },
  ],
};


/** Os doze exercícios do § Ex. Nenhum aponta aula — ver o cabeçalho. */
export const MODULO_07_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: "m07-ex-01",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "01 · A tarifa de uma distribuidora do Nordeste subiu em julho. Quem decidiu, sob qual instrumento, e o que veio antes?", gabarito: "Quem: a agência, em processo tarifário da concessão específica. Instrumento: resolução homologatória com anexos tarifários — não normativa, porque o ato é concreto e individual. Antes: nota técnica da superintendência de gestão tarifária e regulação econômica, aplicação da metodologia do PRORET, fase pública com consulta, voto do relator e deliberação em reunião pública da diretoria colegiada. O que a resposta completa acrescenta: a data não é aleatória — é a data contratual de reajuste ou revisão daquela concessão. E o percentual anunciado é efeito médio: modalidade, nível de tensão, demanda contratada e posto horário mudam o efeito real na unidade." },
  },
  {
    id: "m07-ex-02",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "02 · Uma usina eólica teve geração cortada por restrição de transmissão. Quem determinou, quem regula a compensação e quem calcula o efeito financeiro?", gabarito: "Determinou: o operador, por limitação operacional decorrente de restrição de rede ou de critério de segurança. Regula: a agência — critérios, tratamento e eventuais mecanismos de compensação são matéria regulatória. Calcula o efeito: a câmara, na contabilização, aplicando as regras vigentes. Armadilha: a tentação é dizer que \"o operador cortou, então o operador paga\". Não é assim. O operador não tem competência para decidir consequência financeira; ele decide o físico. Quem decide se e como há compensação é a norma, e quem apura é a contabilização." },
  },
  {
    id: "m07-ex-03",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "03 · Duas comercializadoras anunciaram fusão. Quem analisa, sob quais perguntas, e quando a operação está concluída?", gabarito: "Analisa: o conselho de defesa da concorrência, se preenchidos os critérios legais de notificação obrigatória — sob a pergunta \"isso reduz concorrência?\", com definição de mercado relevante, medição de sobreposição e integração e avaliação de rivalidade e entrada. Em paralelo: a agência setorial pode analisar transferência de controle e requisitos regulatórios, e a câmara pode ter validações próprias. São perguntas diferentes sobre o mesmo fato. Concluída quando: depois das aprovações aplicáveis e do fechamento societário — que é um evento distinto e posterior. Consumar antes da aprovação obrigatória é gun jumping ." },
  },
  {
    id: "m07-ex-04",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "04 · Saiu portaria mudando prazo de migração ao mercado livre. Qual secretaria, qual é o próximo passo, e quando isso muda a vida de alguém?", gabarito: "Secretaria: tema de mercado e elegibilidade é da secretaria nacional de energia elétrica. Instrumento: portaria — ato de política, não de regulação. Próximo passo: regulamentação pela agência, ajuste de procedimentos e sistemas pela câmara, e adequação operacional de distribuidoras, varejistas e consumidores. Quando muda a vida de alguém: não na publicação da portaria. Na entrada em vigor da norma regulatória que a implementa, e depois do prazo de adaptação nela previsto. A portaria abre a janela; ela não move ninguém." },
  },
  {
    id: "m07-ex-05",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "05 · O comitê de monitoramento deliberou sobre parâmetro de aversão a risco. Por que isso é notícia de mercado?", gabarito: "Porque parâmetro de modelo não é detalhe técnico: os modelos otimizam sob premissas declaradas, e alterar o peso dado a cenários adversos altera a decisão de despacho e, por consequência, o preço de curto prazo. Cadeia: deliberação no comitê → conversão em ato pelas instituições competentes → efeito na cadeia de modelos → efeito em despacho e preço → efeito na contabilização de quem está exposto. O erro correlato: tratar a deliberação como se já fosse o efeito. O comitê recomenda e coordena; a conversão em ato é de outro órgão, e o prazo dessa conversão é a variável que decide se o efeito é neste ciclo ou no próximo." },
  },
  {
    id: "m07-ex-06",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "06 · Um consumidor industrial reclama que a distribuidora não resolve um problema de qualidade. Qual é a escada?", gabarito: "Quatro degraus, nesta ordem: canal de atendimento da distribuidora com registro de protocolo; ouvidoria da distribuidora; agência estadual conveniada, quando houver convênio no estado; ouvidoria setorial da agência federal. Pular degrau atrasa, porque cada instância pede o registro da anterior. Base normativa a citar: o módulo de qualidade dos procedimentos de distribuição contém os padrões de continuidade e conformidade que transformam a reclamação de percepção em descumprimento verificável. Reclamação com indicador publicado tem tratamento diferente de reclamação sem." },
  },
  {
    id: "m07-ex-07",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "07 · Você precisa da tarifa homologada vigente de uma distribuidora específica. Onde, sob qual filtro, e qual campo se lê primeiro?", gabarito: "Caminho: portal da agência → área de tarifas → busca por distribuidora → processo tarifário vigente → resolução homologatória e seus anexos tarifários . Campo que se lê primeiro: a data de vigência. Depois, o subgrupo e a modalidade tarifária correspondentes à unidade — porque a tabela tem dezenas de linhas e apenas uma se aplica. Só então os valores de demanda e de energia por posto horário. Erro clássico: pegar o percentual de reajuste da notícia em vez do valor homologado da tabela. O percentual é média; a tabela é o que a unidade paga." },
  },
  {
    id: "m07-ex-08",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "08 · Você quer saber se existe consulta pública aberta sobre armazenamento. Onde e como?", gabarito: "Caminho: portal da agência → Acesso à informação → Participação social → consultas públicas, filtrando por status \"aberta\" e por tema. Verifique também audiências públicas e tomadas de subsídios, que são listadas separadamente e frequentemente contêm as fases mais precoces. O que baixar: a nota técnica antes da minuta, e a análise de impacto regulatório se houver. A nota técnica revela a premissa; a análise revela quais alternativas foram descartadas e por quê — que é onde mora o melhor ponto de contribuição técnica. Campo que se lê primeiro: a data-limite de contribuição. Tudo o mais é irrelevante se o prazo fechou." },
  },
  {
    id: "m07-ex-09",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "09 · Você precisa da série de geração por fonte e subsistema dos últimos doze meses. Onde, em qual formato, com qual defasagem?", gabarito: "Caminho: portal de dados abertos do operador → catálogo de séries → geração por fonte e subsistema, com seleção de período e granularidade. Formato: arquivos em formato aberto, tabulares, adequados a ingestão automatizada. Defasagem: varia por série; dado recente pode ser preliminar e sofrer revisão após apuração de pós-operação. Armadilha declarada: geração medida pelo operador e geração contabilizada pela câmara respondem a perguntas diferentes, com definições e finalidades diferentes. Cruzar as duas séries sem declarar a diferença produz um gráfico que não se defende." },
  },
  {
    id: "m07-ex-10",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "10 · Você precisa saber quando sai a próxima revisão tarifária da distribuidora que atende uma planta. Como descobre?", gabarito: "Caminho: portal da agência → área de tarifas → concessão específica → processos tarifários, onde constam o histórico e a periodicidade contratual. O contrato de concessão é a fonte definitiva da data e da periodicidade, e está disponível publicamente. Por que isso vale mais que parece: a data define três janelas simultâneas — de renegociação comercial, de participação técnica na fase pública e de acesso à estrutura de custo da distribuidora, que só fica exposta publicamente durante o processo. Nenhuma dessas três aparece na conta de luz." },
  },
  {
    id: "m07-ex-11",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "11 · Uma manchete diz \"resolução da agência muda regra de comercialização\". Como você verifica em cinco minutos se isso afeta um consumidor livre?", gabarito: "Passo 1: identifique o número e o tipo do ato. Normativa muda regra geral; homologatória não; despacho pode aprovar versão de procedimento com efeito imediato. Passo 2: abra a ementa e o campo de sujeitos — quais agentes são abrangidos e quais estão expressamente fora. Passo 3: vá direto a prazos e transição e a vigência : publicação não é aplicação. Passo 4: verifique revogações , para não continuar operando sob regra revogada. Passo 5: confira no portal da câmara se já existe versão atualizada das regras ou dos procedimentos correspondentes — porque o efeito operacional chega por lá, no sistema, não pelo texto da resolução." },
  },
  {
    id: "m07-ex-12",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "12 · Você quer ler o diagnóstico oficial mais recente sobre risco de suprimento. Qual documento e onde?", gabarito: "Documento: atas, notas e deliberações do comitê de monitoramento do setor elétrico — que reúne mensalmente o ministério e os titulares da agência, da agência de petróleo e gás, da câmara, da empresa de planejamento e do operador. Caminho: portal do ministério → Assuntos → Conselhos e comitês → CMSE → calendário e reuniões. Por que essa é a resposta certa: é o único documento que integra, num só lugar, armazenamento, carga, disponibilidade, combustível, obras atrasadas e restrição de rede — com a assinatura conjunta das instituições que teriam que agir. Boletins isolados de cada órgão dão pedaços; a ata dá a leitura integrada e, com frequência, antecipa medida com efeito econômico." },
  },
];


export const MODULO_07_AULAS: CurriculumAula[] = [
  {
    id: 'aula-07-01',
    moduleId: 'modulo-07',
    number: 1,
    totalInModule: 7,
    title: "Onde a diretriz nasce",
    subtitle: "Política · MME e CNPE",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ins-01-predio-ministerial.png", "ins-08-sala-conselho.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_07[0]],
  },
  {
    id: 'aula-07-02',
    moduleId: 'modulo-07',
    number: 2,
    totalInModule: 7,
    title: "Indicativo, não determinativo",
    subtitle: "Planejamento · EPE",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ins-05-instituto-pesquisa.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_07[1]],
  },
  {
    id: 'aula-07-03',
    moduleId: 'modulo-07',
    number: 3,
    totalInModule: 7,
    title: "A agência é um processo antes de ser uma decisão",
    subtitle: "Regulação · ANEEL por dentro",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ins-02-predio-regulador.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_07[2]],
  },
  {
    id: 'aula-07-04',
    moduleId: 'modulo-07',
    number: 4,
    totalInModule: 7,
    title: "Uma entidade privada com função pública",
    subtitle: "Operação · ONS",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ins-03-centro-operacao.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_07[3]],
  },
  {
    id: 'aula-07-05',
    moduleId: 'modulo-07',
    number: 5,
    totalInModule: 7,
    title: "Onde o físico vira financeiro",
    subtitle: "Liquidação · CCEE",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ins-04-predio-comercializacao.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_07[4]],
  },
  {
    id: 'aula-07-06',
    moduleId: 'modulo-07',
    number: 6,
    totalInModule: 7,
    title: "Os órgãos que não aparecem no organograma e travam projeto",
    subtitle: "Monitoramento e periferia",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ins-07-balanca-concorrencia.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_07[5]],
  },
  {
    id: 'aula-07-07',
    moduleId: 'modulo-07',
    number: 7,
    totalInModule: 7,
    title: "A decisão real atravessa quatro órgãos",
    subtitle: "Síntese · onde a frase não se sustenta",
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
    instruments: [INSTRUMENTOS_MODULO_07[6], INSTRUMENTOS_MODULO_07[7], INSTRUMENTOS_MODULO_07[8]],
  },
];

export const getAulaModulo07 = (id: string): CurriculumAula | undefined =>
  MODULO_07_AULAS.find((a) => a.id === id);
