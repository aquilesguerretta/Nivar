// alexandria-modulo-10-content.ts
// Bloco 10 — Tarifas e a Conta de Luz Industrial. Nível 2, track
// 'brasil'. QUINTO módulo da Trilha 2.
//
// CATÁLOGO CONFIRMADO por leitura de `alexandria-blocks.ts`, não herdado:
// { id: 'bloco-10', level: 2, track: 'brasil', illustrationPrefix: 'tar-',
//   priority: 'maxima', estimatedHours: 8-10 }.
//
// EXTRAÍDO de `Alexandria modulos/alexandria_modulo10.html` — 359.726
// bytes: 250.749 de markup e 108.960 de script.
//
// ── VOCABULÁRIO MEDIDO, NÃO PRESUMIDO ─────────────────────────
// Os oito seletores dos Módulos 01-03 (`class="aula"`, `aula-marker`,
// `exercise-tag`, `glossary-item`, `checklist-item`, `instrument-title`,
// `class="lead"`, `div.exercise`) dão ZERO. É o vocabulário abreviado
// dos Módulos 04+: `sec-id` 19, `lede` 19, `inst` 11, `lv` 5, `det-bd`
// 22, `box` 26.
//
// ── CONTAGEM REAL ─────────────────────────────────────────────
// 19 seções = 9 aulas + 10 de aparato (§00 §MAP §Caso §Erros §Ex §Quiz
// §Voz §Final §Lex §Ref). 179 blocos de apostila. §Ex com 14 <details>;
// §Lex com 161 `.term`.
//
// ── COBERTURA DE TEXTO — a medição que mudou a extração ───────
// Contagem de ELEMENTO não detecta perda: ela dupla-conta os <p> que
// vivem dentro de box/lv. A primeira passada, com o extrator herdado,
// media 44,6% a 94,8% — SETE das nove abaixo de 85%. O diagnóstico por
// elemento-folha achou três estruturas descartadas em silêncio:
//
//   `div.fi`    — fichas de modalidade, 6 fichas / 36 pares chave-valor,
//                 5.363 chars só na Aula 02. Mesma estrutura que o
//                 Módulo 09 já tinha exposto.
//   `div.chain` — grade de quatro `cbox` rotuladas (taxonomia de
//                 flexibilidade de carga), 848 chars na Aula 04.
//   `div.form`  — fórmula destacada com nota de rodapé. Mapeia no kind
//                 `formula`, que o contrato já tinha e nenhum módulo
//                 anterior havia usado.
//
// Cobertura final: 93,0% a 96,6% nas NOVE aulas, zero abaixo de 85%. O
// resíduo é normalização de entidade e pontuação de aparato.
//
//   aula  1  96,5%   aula  4  93,6%   aula  7  94,9%
//   aula  2  96,6%   aula  5  94,7%   aula  8  94,4%
//   aula  3  95,2%   aula  6  93,7%   aula  9  93,0%
//
// ── INSTRUMENTO: ONZE, dez de aula ────────────────────────────
// O `Inst · 01` vive no § MAP, fora de qualquer aula — mesmo tratamento
// do `LAB · 01` (Módulo 01) e dos `Inst · 01` dos Módulos 06 e 07. As
// Aulas 03, 08 e 09 têm DOIS instrumentos cada; as Aulas 01 e 07 não
// têm nenhum.
//
// ── O "RECONSTRUTOR" QUE NÃO É O RECONSTRUTOR ─────────────────
// `Inst · 09 — Reconstrutor de fatura, "estime antes de ver"` tem o
// nome, o verbo e a pedagogia do Reconstrutor de matriz do Módulo 08
// (LYCEUM Wave 34), e NÃO tem a mecânica dele. Medido antes de assumir:
// zero referência no código, zero tolerância, e o botão "Corrigir" do
// documento pertence ao § Quiz, não a este instrumento. Aqui o aluno
// informa OS DOIS vetores — a estimativa e a composição real da própria
// fatura —, então não há gabarito a ocultar, e `calc()` roda a cada
// input desde o load. É comparação ao vivo de dois vetores que o
// usuário fornece.
//
// Por isso `correcaoSobDemanda` está DELIBERADAMENTE AUSENTE, e o kind
// é `comparador`. É a regra 4 do protocolo de extração disparando pela
// terceira vez na família: nome repetido não garante mesma mecânica.
//
// ── EXERCÍCIO: 14, TODOS SOLTOS ───────────────────────────────
// A varredura por /[Aa]ula\s*\d+/ no enunciado E no gabarito dos catorze
// devolve ZERO. A fonte não declara o vínculo, então ele não foi
// inventado. Padrão desde o Módulo 04.
//
// ── GRAVURA: 4 de 9, por leitura de frase ─────────────────────
// A biblioteca `tar-` tem nove arquivos (a numeração pula o 05).
// CINCO dão zero ocorrência — `tar-01`/`tar-02` medidores, `tar-03`
// caixa de medição, `tar-06` transformador de corrente: o módulo trata
// estrutura tarifária e leitura de fatura, não hardware de medição.
//
//   A4 tar-04-relogio-posto-ponta  — §04.1 "Três horas, definidas por
//      concessionária, em dias úteis". O posto de ponta É o assunto.
//   A5 tar-07-banco-capacitores    — "banco de capacitores fixo que
//      permanece energizado quando a carga indutiva já foi desligada":
//      é o equipamento que a aula diagnostica.
//   A8 tar-08-bandeira-tarifaria   — "a bandeira tarifária é a camada
//      de curtíssimo prazo". Os hits da Aula 01 são enumeração de
//      itens, o padrão de falso positivo.
//   A9 tar-10-lupa-fatura          — a aula É "A ordem de leitura em
//      cinco minutos".
//
// `tar-09-pilha-moedas-composicao` NÃO foi mapeada. Seus hits são
// "composição da base [de cálculo tributária]" (Aula 07) e
// "decomposição" da variação entre períodos (Aula 08) — operação
// analítica, não o objeto da gravura. Décimo falso positivo da série.
//
// ── video: null, MEDIDO ───────────────────────────────────────
// Zero <video>, <iframe>, youtube, vimeo, .mp4 e <audio> no arquivo.
// `durationMinutes` e `difficulty` também null: a fonte não declara
// nenhum dos dois por aula.

import type { CurriculumAula, Instrument, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';

export const MODULO_10_LEAD: Record<string, string> = {
  'aula-10-01': "Esta é a aula que impede todas as promessas erradas posteriores. Ela não ensina nenhum mecanismo tarifário novo; ensina uma classificação. E é a classificação que determina, para cada linha de qualquer fatura, se existe alavanca, de que natureza é a alavanca, e quanto tempo ela leva para produzir efeito.",
  'aula-10-02': "O primeiro campo de qualquer análise não é um valor: é uma classificação. Se o grupo, o subgrupo e a modalidade estiverem lidos errado, toda a aritmética a jusante está errada, e nenhuma conferência de tarifa faz sentido. Esta aula ensina o mapa completo, o que efetivamente subsiste como opção hoje, o que sobrevive apenas como situação específica, e como se descobre — na própria fatura — em qual célula do mapa a unidade está.",
  'aula-10-03': "A demanda contratada é a decisão do Eixo 1 com maior efeito financeiro imediato e a que mais frequentemente carrega uma escolha de uma década atrás. Ela também é a única linha da fatura em que errar em qualquer direção custa dinheiro : contratar demais gera pagamento recorrente por capacidade ociosa; contratar de menos expõe à parcela de ultrapassagem e pode comprometer a operação.",
  'aula-10-04': "Um megawatt-hora consumido às onze da manhã e um megawatt-hora consumido às sete da noite são fisicamente idênticos e economicamente distintos. A diferença é regulatória e existe por uma razão de engenharia: a rede é dimensionada para o pico, e quem consome no pico impõe custo de capacidade a todos os demais. Esta aula ensina como esse sinal é construído, onde ele erra, e o que uma planta industrial pode e não pode deslocar.",
  'aula-10-05': "O Módulo 01 ensinou o triângulo de potência, a diferença entre potência ativa, reativa e aparente, e por que carga indutiva exige reativo. Esta aula não volta lá. Ela ensina outra coisa: como o excedente é medido, em que janelas é apurado, sob que nomenclatura é cobrado, e o que na fatura distingue um problema estrutural de um problema pontual — que é a diferença entre um projeto necessário e um investimento desnecessário.",
  'aula-10-06': "Encargo não é tarifa e não é tributo. É um custo coletivo do sistema, instituído por lei, rateado por metodologia regulada e cobrado dentro da estrutura tarifária. A distinção importa comercialmente: eficiência energética reduz a quantidade sobre a qual o encargo incide, mas ninguém negocia a quota unitária de um encargo com a distribuidora — e uma recomendação que sugere o contrário revela desconhecimento da natureza do item.",
  'aula-10-07': "Esta aula tem uma fronteira estrita e ela é declarada de saída: a matéria tributária entra aqui apenas na medida em que altera a base sobre a qual o consumidor industrial paga . Não há doutrina, não há estratégia de contencioso, não há juízo sobre quem tem razão. Há mecanismo, posições dos envolvidos, estado de vigência e o que isso muda numa linha de fatura. Toda decisão tributária concreta exige validação contábil e jurídica própria.",
  'aula-10-08': "O Módulo 07 ensinou o rito institucional: quem homologa, em que cadência, sob qual instrumento. Esta aula não repete isso. Ela pergunta outra coisa: o que acontece com o custo de uma indústria quando o resultado do ciclo é publicado , e por que a mesma unidade paga valores diferentes por unidade de energia em meses diferentes sem ter mudado absolutamente nada dentro da planta.",
  'aula-10-09': "Todas as aulas anteriores existem para tornar esta possível. O critério de domínio deste bloco é cronometrado, e cinco minutos é pouco tempo para um documento de quarenta linhas. O que cabe em cinco minutos não é ler tudo: é executar uma sequência em que cada passo pode encerrar a análise ou determinar o passo seguinte. Esta aula ensina a sequência, o critério de parada de cada passo, e a saída mais frequente de todas — a que diz que ainda não é possível concluir.",
};

/** 179 blocos nas nove aulas, na ordem do documento. */
export const MODULO_10_CORPO: Record<string, AulaBloco[]> = {
  'aula-10-01': [
      { kind: 'titulo', numero: "01.1", texto: "Eixo 1 — O que a empresa controla" },
      { kind: 'paragrafo', html: "São as decisões internas com efeito no ciclo de faturamento seguinte ou em poucos ciclos. São cinco, e cabem numa lista curta porque a lista curta é o produto: <b>enquadramento</b> (grupo, subgrupo e modalidade tarifária, na medida em que há opção); <b>demanda contratada</b> (o valor de potência reservado junto à distribuidora); <b>distribuição da carga entre postos horários</b> (quanto do consumo ocorre no posto de ponta); <b>correção de reativo</b> (manter o fator de potência dentro da referência regulatória por intervalo); e <b>eficiência do processo</b> (quanto de energia é necessário para produzir a mesma coisa)." },
      { kind: 'paragrafo', html: "Repare no que essas cinco decisões têm em comum. Nenhuma delas altera um preço. Todas elas alteram uma <b>quantidade</b> ou um <b>regime de aplicação de preço</b>. Enquadramento não muda tarifa; muda qual conjunto de tarifas se aplica. Demanda contratada não muda a tarifa de demanda; muda o número de quilowatts sobre os quais ela incide, e se há ou não parcela de ultrapassagem. Deslocamento de carga não muda a tarifa de energia de ponta; muda quantos megawatt-hora são medidos naquele posto." },
      { kind: 'paragrafo', html: "Há uma hierarquia natural entre elas, e ela é operacionalmente importante porque separa o que custa dinheiro do que custa apenas atenção. Enquadramento e demanda contratada são decisões contratuais: exigem comunicação à distribuidora, respeito a prazos e, no caso da modalidade, observância de período mínimo de permanência conforme o contrato e a norma. Não exigem investimento. Deslocamento de carga é decisão operacional: exige mudança de rotina de produção, e a restrição real costuma ser de processo, não de energia. Correção de reativo e eficiência de processo são as únicas que tipicamente exigem capital, e por isso vêm por último na ordem de análise. Recomendar equipamento caro para problema resolvível por contrato é o erro de diagnóstico mais comum do setor — e não é coincidência que ele favoreça quem vende equipamento." },
      { kind: 'titulo', numero: "01.2", texto: "Eixo 2 — O que a empresa negocia" },
      { kind: 'paragrafo', html: "Um único componente: o preço da energia. E apenas se a unidade estiver no ambiente livre de contratação. Esta é a ponte com o Módulo 09, e ela se resolve em uma frase: no ambiente regulado o consumidor não é parte de contrato de compra de energia algum, e portanto não há o que negociar; no ambiente livre, o preço da energia passa a ser objeto de contrato bilateral, com volume, prazo, indexação, submercado de entrega e flexibilidade — e o uso do fio permanece devido de qualquer forma." },
      { kind: 'paragrafo', html: "O erro que essa distinção previne é específico e caro. Ao migrar de ambiente, a empresa não deixa de pagar a distribuidora. Ela deixa de pagar o componente de energia à distribuidora e passa a pagá-lo ao vendedor, continuando a pagar à distribuidora o uso do sistema, a demanda, os encargos aplicáveis e os serviços. Comparar o preço do contrato livre com o total da fatura cativa é comparar uma parte com o todo, e produz uma diferença que não existe. O Módulo 09 tratou essa decisão em profundidade, com a alocação de risco contratual que ela implica; aqui ela entra apenas como um dos quatro eixos, para que o aluno saiba em qual gaveta guardá-la ao ler uma fatura." },
      { kind: 'titulo', numero: "01.3", texto: "Eixo 3 — O que a empresa apenas suporta" },
      { kind: 'paragrafo', html: "Tarifa de uso do sistema de distribuição homologada, custos de transmissão repassados na estrutura tarifária, encargos setoriais, tributos e adicional de bandeira. Nenhuma decisão da empresa altera <b>o valor unitário</b> desses itens. A tarifa de uso é resultado de processo tarifário conduzido pela agência reguladora para aquela concessionária específica. Os encargos setoriais decorrem de lei e são rateados por metodologia regulada. Os tributos decorrem de legislação federal, estadual e municipal. O adicional de bandeira é fixado pela agência e acionado mensalmente conforme as condições de geração do sistema." },
      { kind: 'paragrafo', html: "E aqui está a distinção mais valiosa do módulo inteiro, que merece ser dita duas vezes: a empresa não altera o valor unitário desses itens, mas altera a quantidade sobre a qual eles incidem. A tarifa de uso do sistema tem componente aplicado à demanda, em reais por quilowatt — e a demanda contratada é decisão do Eixo 1. Tem componente aplicado à energia, em reais por megawatt-hora — e o consumo é decisão do Eixo 1. A quota do encargo de desenvolvimento energético é cobrada por megawatt-hora — e o volume consumido é decisão do Eixo 1. O adicional de bandeira incide sobre a energia consumida no período — e o volume é decisão do Eixo 1." },
      { kind: 'paragrafo', html: "Isso significa que o Eixo 3 não é um beco sem saída; é um multiplicador. Toda melhoria no Eixo 1 se propaga pelo Eixo 3, porque reduz a base sobre a qual preços que a empresa não controla incidem. E significa também que a conversa correta com um fornecedor que propõe \"reduzir seus encargos\" é uma pergunta de volta: reduzir a quota unitária, o que é impossível, ou reduzir o volume sobre o qual ela incide, o que é o Eixo 1 com outro nome?" },
      { kind: 'nota', tom: "neutro", label: "O que a empresa controla contra o que ela apenas suporta", html: "<b>Criança de 12 anos.</b> Imagine que você vai ao mercado. Você não escolhe o preço da maçã — quem escolhe é o mercado. Mas você escolhe quantas maçãs coloca no carrinho. A conta de luz funciona igual: alguns preços já vêm decididos por lei e por órgão do governo, e a fábrica não muda nem um centavo deles. O que a fábrica muda é quantas \"maçãs\" ela leva: quanta energia usa, em que horário usa, e quanto de espaço na rede ela reservou. Quem promete mudar o preço da maçã está prometendo o que não pode entregar.<br><br><b>Executivo não técnico.</b> Sua fatura combina preços que você não fixa com quantidades que você em parte determina. Tarifa de rede, encargos setoriais e tributos têm valor unitário definido fora da empresa — por processo tarifário, por lei e por ente federativo. O que você decide é a base sobre a qual esses valores incidem: quanto contrata de demanda, quanto consome, em que posto horário consome, e se mantém o fator de potência dentro da referência. Uma proposta que promete reduzir tarifa homologada está descrevendo algo que não existe. Uma proposta que promete reduzir sua exposição a ela está descrevendo trabalho real — e ele começa dentro da planta, não na mesa de negociação.<br><br><b>Especialista do setor.</b> A separação operacional é entre parâmetros exógenos e variáveis de decisão. Exógenos: tarifas de aplicação homologadas por processo tarifário da concessionária, quotas de encargos setoriais rateadas por metodologia regulada, alíquotas e bases tributárias definidas em legislação, e adicionais de bandeira fixados pela agência com acionamento mensal. Variáveis de decisão: modalidade tarifária dentro do conjunto elegível ao subgrupo, montantes de uso contratados por posto, alocação temporal da carga, injeção de reativo local e intensidade energética do processo. O diagnóstico econômico consiste em identificar, para cada componente da fatura, a derivada do custo em relação a cada variável de decisão, e ordenar as intervenções por razão entre efeito e custo de implementação — com correção contratual antes de intervenção operacional, e intervenção operacional antes de investimento em ativo." },
      { kind: 'titulo', numero: "01.4", texto: "Eixo 4 — O que muda sozinho e quando" },
      { kind: 'paragrafo', html: "O quarto eixo não é uma categoria de custo; é uma categoria de <b>tempo</b>. Ele existe porque a comparação entre dois meses de fatura é a operação analítica mais frequente e mais mal executada do setor. Quatro relógios rodam em paralelo, e cada um pode mover a conta sem que nada tenha mudado dentro da planta." },
      { kind: 'paragrafo', html: "O primeiro é o <b>ciclo anual de reajuste tarifário</b> da concessionária, com data própria — o aniversário tarifário. Duas plantas do mesmo grupo empresarial, em estados diferentes, atravessam reajustes em meses diferentes; comparar as duas sem declarar isso é comparar bases distintas. O segundo é o <b>ciclo de revisão tarifária periódica</b>, mais espaçado, que pode alterar não só valores mas a própria estrutura — inclusive a definição do posto de ponta da área de concessão. O terceiro é o <b>acionamento mensal de bandeira</b>, que muda o custo marginal do quilowatt-hora consumido sem qualquer alteração de tarifa homologada. O quarto é o <b>calendário legal de mudança de regra</b>: leis com vigência diferida, regulamentação pendente e prazos previstos que alteram encargos, tributos e elegibilidade." },
      { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Em 2026, os quatro relógios estão todos em movimento simultâneo, o que é incomum. O adicional de bandeira teve seus valores atualizados no ciclo vigente e o acionamento é mensal. A distribuição das quotas anuais do encargo de desenvolvimento energético entre níveis de tensão foi alterada com efeito a partir de 1º de janeiro de 2026 pela <b>Lei nº 15.269, de 24 de novembro de 2025</b>. O regime de tributos indiretos está em transição por força da <b>Emenda Constitucional nº 132/2023</b> e da <b>Lei Complementar nº 214/2025</b>, com 2026 operando como ano de convivência entre regimes. E a tarifa social foi reformada pela <b>Lei nº 15.235, de 8 de outubro de 2025</b>, regulamentada pela <b>Resolução Normativa ANEEL nº 1.147, de 9 de dezembro de 2025</b>. Consulta em 1º de agosto de 2026; verifique vigência e regulamentação antes de qualquer uso externo." },
      { kind: 'titulo', numero: "01.5", texto: "Por que a conta sobe quando o consumo cai" },
      { kind: 'paragrafo', html: "A pergunta do diretor financeiro agora tem resposta estruturada, e ela é sempre uma combinação de eixos. A conta pode subir com consumo em queda por pelo menos seis razões distintas, e o diagnóstico consiste em eliminá-las uma a uma." },
      { kind: 'tabela', linhas: [["Causa", "Eixo", "Como se confirma na fatura", "O que ainda falta"], ["Reajuste tarifário no meio do período comparado", "Eixo 4", "Tarifas unitárias diferentes entre as duas faturas para o mesmo componente", "O ato homologatório vigente em cada período"], ["Bandeira acionada em um dos meses", "Eixo 4", "Linha ou demonstrativo de adicional de bandeira presente em um e ausente no outro", "A cor vigente e o rateio quando o ciclo atravessa meses de cores diferentes"], ["Demanda faturada não acompanhou a queda de consumo", "Eixo 1", "Consumo menor com demanda faturada igual ou maior", "A memória de massa para identificar o intervalo do pico"], ["Parcela de ultrapassagem em um dos meses", "Eixo 1", "Linha de ultrapassagem presente, com demanda medida acima do limite", "O evento operacional que produziu o pico"], ["Excedente reativo apareceu com a queda de carga", "Eixo 1", "Linhas de excedente reativo em um mês e não no outro, tipicamente noturnas", "O perfil por intervalo e a configuração da compensação instalada"], ["Deslocamento relativo do consumo para o posto de ponta", "Eixo 1", "Participação da ponta no total maior, mesmo com total menor", "O calendário de produção do período"]] },
      { kind: 'paragrafo', html: "Note que quatro das seis causas estão no Eixo 1 e duas no Eixo 4. Nenhuma está no Eixo 3. Isso não é acaso: <b>o Eixo 3 raramente explica variação de curto prazo</b>, porque seus valores unitários se movem em ciclo anual. Quando alguém atribui a variação mensal de uma conta a \"aumento de encargos\", há uma chance alta de que a explicação real esteja em uma das quatro linhas do Eixo 1 — e essas quatro são justamente as que a empresa pode corrigir." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "A classificação em quatro eixos é o esqueleto do relatório do <b>Conta de Luz Express</b>. Cada achado do relatório é etiquetado com o eixo a que pertence, e a etiqueta determina o tipo de recomendação: contratual, operacional, de investimento ou meramente informativa. Um relatório que mistura os eixos produz um plano de ação em que o cliente não sabe o que depende dele. Um relatório que os separa entrega, além do diagnóstico, a alocação de responsabilidade — que é o que transforma análise em execução." },
  ],
  'aula-10-02': [
      { kind: 'titulo', numero: "02.1", texto: "Grupo A e Grupo B: a fronteira é de tensão, não de atividade" },
      { kind: 'paragrafo', html: "O <b>grupo A</b> reúne unidades consumidoras conectadas em tensão igual ou superior a 2,3 kV, mais as situações de atendimento a partir de sistema subterrâneo de distribuição em tensão secundária. Seu faturamento é <b>binômio</b>: cobra energia, em megawatt-hora, e demanda de potência, em quilowatt. O <b>grupo B</b> reúne unidades conectadas em tensão inferior a 2,3 kV e, em regra, tem faturamento monômio — cobra energia apenas. A definição consta do art. 2º da <b>Resolução Normativa ANEEL nº 1.000, de 7 de dezembro de 2021</b>, que consolidou as condições gerais de fornecimento e substituiu, entre outras, a norma anterior de 2010." },
      { kind: 'paragrafo', html: "A confusão mais frequente do setor é tratar <b>classe</b> como se fosse <b>grupo</b>. A classe descreve a atividade: industrial, comercial, rural, residencial, poder público, serviço público, iluminação pública. O grupo descreve a conexão. Uma indústria pequena pode estar no grupo B; um shopping center pode estar no grupo A. Ler \"classe industrial\" no cabeçalho e concluir \"então é A4\" é um salto que produz diagnóstico errado com aparência de competência. Classe é o que a unidade faz; grupo e subgrupo são como ela está conectada." },
      { kind: 'paragrafo', html: "Há ainda uma situação intermediária que a norma prevê e que costuma passar despercebida: unidades do grupo A que, atendidas determinadas condições — entre elas limites de potência do transformador —, podem optar pelo faturamento com aplicação da tarifa do grupo B. Isso não converte a unidade em grupo B; ela continua sendo grupo A com opção de faturamento diferenciado, e permanece sujeita, por exemplo, à cobrança de excedente reativo. Uma fatura que mostra tarifa de grupo B sem linha de demanda pode, portanto, pertencer a uma unidade do grupo A — e o cadastro é o campo que resolve a dúvida." },
      { kind: 'tabela', linhas: [["Grupo / Subgrupo", "Faixa de tensão de conexão", "Modalidades disponíveis hoje", "Observação de auditoria"], ["<b>A1</b>", "Igual ou superior a 230 kV", "Horária Azul", "Grandes cargas. Verde não é opção; simular Verde para A1 é erro de elegibilidade."], ["<b>A2</b>", "De 88 kV a 138 kV", "Horária Azul", "Demanda por posto é o componente dominante; controle de pico na ponta é decisivo."], ["<b>A3</b>", "69 kV", "Horária Azul", "Fronteira relevante: é o limiar do rateio reduzido de encargo por nível de tensão."], ["<b>A3a</b>", "De 30 kV a 44 kV", "Horária Azul ou Horária Verde", "Primeiro subgrupo com opção real de modalidade."], ["<b>A4</b>", "De 2,3 kV a 25 kV", "Horária Azul ou Horária Verde", "Subgrupo mais frequente na indústria de porte médio. É onde a comparação vive."], ["<b>AS</b>", "Sistema subterrâneo", "Horária Azul ou Horária Verde", "Enquadramento por arranjo físico de atendimento, não por faixa de tensão."], ["<b>B1</b>", "Inferior a 2,3 kV — residencial", "Convencional Monômia ou Horária Branca", "Branca indisponível à subclasse baixa renda."], ["<b>B2</b>", "Inferior a 2,3 kV — rural", "Convencional Monômia ou Horária Branca", "Há regimes especiais para irrigação e aquicultura."], ["<b>B3</b>", "Inferior a 2,3 kV — demais classes", "Convencional Monômia ou Horária Branca", "Onde estão comércios e pequenas indústrias em baixa tensão."], ["<b>B4</b>", "Inferior a 2,3 kV — iluminação pública", "Convencional Monômia", "Branca não disponível."]] },
      { kind: 'nota', tom: "neutro", label: "Fonte", html: "<b>Fonte:</b> ANEEL, página oficial de Modalidades Tarifárias, e Resolução Normativa nº 1.000/2021, art. 2º. Consulta em 1º de agosto de 2026. As faixas de tensão devem ser conferidas no texto compilado vigente, e o subgrupo efetivo consta do cadastro da unidade na fatura." },
      { kind: 'titulo', numero: "02.2", texto: "O que existe hoje e o que é situação específica" },
      { kind: 'paragrafo', html: "Aqui está a primeira correção material que este módulo faz a material didático em circulação. Diversos textos listam \"Convencional\" entre as modalidades disponíveis ao grupo A, como se fosse uma alternativa que uma indústria pudesse escolher hoje. <b>Não é.</b> A página oficial de modalidades tarifárias da agência reguladora lista, para o grupo A, exatamente duas: <b>Horária Azul</b>, disponível a todos os subgrupos, e <b>Horária Verde</b>, disponível aos subgrupos <b>A3a, A4 e AS</b>. Para o grupo B lista <b>Convencional Monômia</b> e <b>Horária Branca</b>. E lista, para demais acessantes, as modalidades <b>Distribuição</b> — aplicada a distribuidoras que acessam outras distribuidoras — e <b>Geração</b> — aplicada a centrais geradoras que acessam sistemas de distribuição." },
      { kind: 'paragrafo', html: "A modalidade <b>Convencional Binômia</b> continua existindo como estrutura no arcabouço metodológico: o Módulo 7 dos procedimentos de regulação tarifária a descreve, e as planilhas tarifárias desagregam componentes correspondentes. Mas ela não figura como opção ordinária de enquadramento para uma nova análise industrial. Tratá-la como alternativa disponível é o erro mais visível que um material tarifário pode cometer diante de alguém do setor, porque denuncia leitura de fonte desatualizada. A ficha correspondente, adiante, existe justamente para que o aluno saiba reconhecê-la e saiba dizer por que ela não entra na comparação." },
      { kind: 'nota', tom: "neutro", label: "Enquadramento tarifário", html: "<b>Criança de 12 anos.</b> É como escolher um plano de celular. Existe o plano em que você paga um valor fixo pela linha e outro pelos minutos; existe o plano em que os minutos custam diferente de dia e de noite. Nenhum plano é melhor para todo mundo — depende de como você usa. A fábrica também escolhe um \"plano\", só que ele se chama modalidade tarifária, e ele decide se o preço muda conforme a hora do dia e se a fábrica paga um ou dois valores diferentes pelo espaço reservado na rede.<br><br><b>Executivo não técnico.</b> Enquadramento é a combinação de grupo, subgrupo e modalidade que determina qual conjunto de tarifas se aplica à sua unidade. Grupo e subgrupo vêm da tensão de conexão e não são escolha. Modalidade, quando há mais de uma elegível ao subgrupo, é escolha — e é uma escolha que a maior parte das empresas fez uma vez, há anos, quando o perfil de produção era outro, e nunca revisitou. Revisitar não significa mudar; significa verificar. A verificação exige o perfil de demanda por posto ao longo de doze meses, não uma fatura isolada.<br><br><b>Especialista do setor.</b> Enquadramento define o vetor de tarifas de aplicação incidente sobre o vetor de grandezas medidas. Grupo e subgrupo são determinados pela tensão de conexão e pelo arranjo de atendimento, com efeito sobre as componentes de fio da tarifa de uso e, desde 2026, sobre o rateio da quota do encargo de desenvolvimento energético por faixa de tensão. A modalidade determina a granularidade horária das componentes de energia e de demanda: a Azul diferencia ambas por posto, a Verde diferencia apenas a energia e aplica tarifa única de demanda. A elegibilidade à Verde é restrita a A3a, A4 e AS. A decisão entre modalidades minimiza custo esperado sob o perfil conjunto de demanda máxima por posto e energia por posto, sujeita a risco de ultrapassagem e à possibilidade de alteração do perfil por expansão, mudança de turno ou entrada de geração própria." },
      { kind: 'titulo', numero: "02.3", texto: "A escolha entre Azul e Verde não se faz com uma tarifa" },
      { kind: 'paragrafo', html: "A diferença estrutural entre as duas modalidades cabe em uma frase: <b>as duas diferenciam a energia por posto horário; apenas a Azul diferencia a demanda</b>. Na Verde há uma única demanda contratada e uma única tarifa de demanda, aplicáveis independentemente do posto. Na Azul há demanda contratada de ponta e demanda contratada fora de ponta, com tarifas próprias, e a tarifa de demanda de ponta é substancialmente superior à de fora de ponta." },
      { kind: 'paragrafo', html: "Disso decorre a tendência que todo material do setor repete e que precisa ser qualificada. A Azul tende a favorecer quem consegue manter demanda muito baixa e <b>controlável</b> no posto de ponta, porque paga a demanda cara sobre um número pequeno. A Verde tende a favorecer quem tem demanda de ponta relevante ou imprevisível, porque dilui tudo numa tarifa única — embora continue pagando energia de ponta cara. Isso é tendência, não regra: as relações entre tarifas variam por concessionária e por processo tarifário, e uma planta que compensa numa área de concessão pode não compensar em outra com o mesmo perfil de carga." },
      { kind: 'paragrafo', html: "O que transforma essa tendência em decisão defensável é o método, e o método tem quatro exigências. Primeira: usar <b>doze meses</b>, porque um único mês não revela sazonalidade, parada de fábrica nem evento excepcional. Segunda: calcular <b>mês a mês e depois agregar</b>, nunca aplicar médias anuais a fórmulas não lineares — a parcela de ultrapassagem é não linear, e média de demanda máxima não é demanda máxima média. Terceira: incluir <b>todos</b> os componentes que mudam com a modalidade, inclusive ultrapassagem e reativo. Quarta: rodar <b>teste de estresse</b>, porque uma modalidade que vence em onze meses pode perder o ano inteiro com dois picos na ponta." },
      { kind: 'nota', tom: "neutro", label: "A saída que o instrumento precisa poder devolver", html: "Existem casos em que a modalidade aparentemente pior é a correta. Uma planta que vai expandir e cujo perfil de ponta mudará no ano seguinte; uma unidade cuja demanda contratada foi dimensionada para um cenário de retomada de produção; uma operação cujo perfil de carga muda com a safra. Em todos esses, a resposta correta não é a modalidade que minimiza custo sobre a série histórica — é aquela que minimiza custo sobre o cenário projetado, e às vezes é a de menor variância, não a de menor média. Por isso o comparador desta aula devolve <b>diferença estrutural por linha</b>, e não veredito financeiro: ele mostra em quais linhas o resultado mudaria e em que direção, deixando a decisão para quem conhece o plano de produção." },
      { kind: 'titulo', numero: "02.4", texto: "Seis fichas de campo fixo" },
      { kind: 'paragrafo', html: "Os campos abaixo são idênticos em todas as fichas, e é isso que permite a leitura lateral: ler o mesmo campo em todas as seis, na vertical, ensina mais do que ler uma ficha inteira. O último campo — o que ver na fatura — é o que converte a ficha em instrumento de trabalho." },
      { kind: 'titulo', numero: null, texto: "Horária Azul · Modalidade · Grupo A" },
      { kind: 'tabela', linhas: [["Grupo e subgrupos", "Grupo A, <b>todos os subgrupos</b> — A1, A2, A3, A3a, A4 e AS.É a única modalidade disponível a A1, A2 e A3."], ["Como a energia é cobrada", "Tarifas <b>diferenciadas por posto</b>: uma para o consumo em ponta, outra para fora de ponta, aplicadas à energia medida em cada posto."], ["Como a demanda é cobrada", "Tarifas <b>diferenciadas por posto</b>, sobre demandas contratadas independentes para ponta e para fora de ponta. A tarifa de demanda de ponta é a mais cara da estrutura."], ["O que dispara penalidade", "Ultrapassagem apurada <b>por posto</b>: excedente na ponta e excedente fora de ponta são verificados e cobrados separadamente. Excedente reativo apurado por intervalo, como em qualquer unidade do grupo A.Não usar a demanda contratada em um posto não elimina a cobrança no outro."], ["Para qual perfil faz sentido", "Carga com demanda de ponta <b>baixa e controlável</b> — planta que efetivamente desliga ou reduz processos no posto de ponta, com controle automático confiável. Quanto maior a diferença entre demanda de ponta e fora de ponta, mais a separação favorece."], ["O que ver na fatura", "Duas linhas de demanda contratada e duas de demanda faturada, rotuladas por posto. Duas linhas de consumo por posto. Eventualmente duas linhas de ultrapassagem."]] },
      { kind: 'titulo', numero: null, texto: "Horária Verde · Modalidade · Grupo A" },
      { kind: 'tabela', linhas: [["Grupo e subgrupos", "Grupo A, apenas <b>A3a, A4 e AS</b>.Indisponível a A1, A2 e A3 — simular Verde nesses subgrupos é erro de elegibilidade, não de premissa."], ["Como a energia é cobrada", "Tarifas <b>diferenciadas por posto</b>, exatamente como na Azul. A energia de ponta é o componente caro desta modalidade."], ["Como a demanda é cobrada", "<b>Tarifa única</b> de demanda, sobre uma <b>única demanda contratada</b>, independentemente do posto em que o pico ocorreu."], ["O que dispara penalidade", "Ultrapassagem sobre a demanda contratada única, comparada à maior demanda medida no ciclo. Excedente reativo apurado por intervalo.Como há um só contrato de demanda, há uma só verificação de ultrapassagem — o que reduz a superfície de erro."], ["Para qual perfil faz sentido", "Carga com demanda de ponta <b>relevante ou imprevisível</b>, ou operação em turnos contínuos com curva plana, em que separar a demanda por posto não traria ganho e traria risco de dois pontos de ultrapassagem."], ["O que ver na fatura", "Uma única linha de demanda contratada e uma de demanda faturada, sem qualificação de posto. Duas linhas de consumo por posto — a diferenciação horária permanece na energia."]] },
      { kind: 'titulo', numero: null, texto: "Convencional Binômia · Estrutura · Grupo A · situação específica" },
      { kind: 'tabela', linhas: [["Grupo e subgrupos", "Grupo A. <b>Não figura como opção ordinária de enquadramento</b> na relação vigente de modalidades disponíveis; subsiste como estrutura no arcabouço metodológico tarifário e em situações contratuais específicas."], ["Como a energia é cobrada", "Tarifa <b>única</b> de consumo, sem distinção horária."], ["Como a demanda é cobrada", "Tarifa <b>única</b> de demanda, sem distinção horária — daí o nome binômia sem ser horária."], ["O que dispara penalidade", "Ultrapassagem sobre a demanda contratada única. Excedente reativo apurado por intervalo, como em qualquer unidade do grupo A."], ["Para qual perfil faz sentido", "Nenhum, para efeito de nova análise: <b>não é alternativa a ser simulada</b>. O valor de conhecê-la é reconhecê-la num contrato antigo e saber explicar por que ela não entra na comparação entre Azul e Verde."], ["O que ver na fatura", "Uma linha de consumo sem qualificação de posto e uma linha de demanda sem qualificação de posto, numa unidade cujo cadastro indica grupo A. Encontrar isso exige verificar o contrato de uso e o ato de enquadramento antes de qualquer conclusão."]] },
      { kind: 'titulo', numero: null, texto: "Convencional Monômia · Modalidade · Grupo B" },
      { kind: 'tabela', linhas: [["Grupo e subgrupos", "Grupo B — <b>B1, B2, B3 e B4</b>."], ["Como a energia é cobrada", "Tarifa <b>única</b> de consumo, independentemente da hora de utilização."], ["Como a demanda é cobrada", "<b>Não há cobrança de demanda</b>. O faturamento é monômio. Existe custo de disponibilidade, que é mínimo faturável e não se confunde com demanda contratada."], ["O que dispara penalidade", "Não há ultrapassagem de demanda. Unidades do grupo B <b>não têm fator de potência de referência</b> e não podem ser cobradas por excedente reativo nos termos aplicáveis ao grupo A."], ["Para qual perfil faz sentido", "Cargas de baixa tensão sem flexibilidade horária relevante, ou cujo consumo se concentra fora do posto de ponta de forma que a diferenciação horária não compensaria."], ["O que ver na fatura", "Uma única linha de consumo, sem posto e sem linha de demanda. Presença de custo de disponibilidade em meses de consumo baixo."]] },
      { kind: 'titulo', numero: null, texto: "Horária Branca · Modalidade · Grupo B" },
      { kind: 'tabela', linhas: [["Grupo e subgrupos", "Grupo B — <b>B1, B2 e B3</b>. Indisponível ao <b>B4</b> e à subclasse <b>residencial baixa renda</b> do B1."], ["Como a energia é cobrada", "Tarifas diferenciadas em <b>três postos</b>: ponta, intermediário e fora de ponta. O posto intermediário é exclusivo desta modalidade."], ["Como a demanda é cobrada", "<b>Não há demanda contratada</b> nem cobrança de demanda. A diferenciação é integralmente sobre a energia."], ["O que dispara penalidade", "Não há ultrapassagem nem excedente reativo. O risco econômico é comportamental: consumo concentrado em ponta e intermediário eleva o custo acima do que seria na Convencional Monômia."], ["Para qual perfil faz sentido", "Consumo de baixa tensão com <b>capacidade real de deslocamento</b> para fora dos postos caros. Sem deslocamento efetivo, a modalidade tende a piorar o resultado."], ["O que ver na fatura", "Três linhas de consumo rotuladas por posto, sem qualquer linha de demanda, numa unidade de baixa tensão."]] },
      { kind: 'titulo', numero: null, texto: "Geração · Modalidade · centrais geradoras acessantes" },
      { kind: 'tabela', linhas: [["Grupo e subgrupos", "Não se aplica a unidade consumidora: é a modalidade aplicada a <b>centrais geradoras que acessam sistemas de distribuição</b>. Enquadramento compulsório, não opção."], ["Como a energia é cobrada", "A estrutura da modalidade é caracterizada por <b>tarifa de demanda única</b>; as componentes de energia seguem regramento próprio da geração, distinto da tarifa de uso de consumo."], ["Como a demanda é cobrada", "Tarifa <b>única</b> de demanda de potência, aplicada sobre a demanda contratada de <b>injeção</b> — a máxima potência injetável no sistema."], ["O que dispara penalidade", "Ultrapassagem da demanda contratada de injeção, com <b>tolerância própria e mais estreita</b> do que a aplicável à demanda de consumo. Uso do sistema sem a devida contratação também enseja cobrança."], ["Para qual perfil faz sentido", "Não é escolha de perfil: é o regime de quem injeta. Importa ao analista industrial porque uma unidade com geração própria conectada pode ter, simultaneamente, contrato de demanda de consumo e contrato de demanda de injeção."], ["O que ver na fatura", "Linha de demanda de injeção ou de geração, separada da demanda de consumo, e eventualmente linha de ultrapassagem específica de injeção. A confusão entre as duas demandas é fonte recorrente de cobrança indevida e de contestação mal fundamentada."]] },
      { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "A relação de modalidades disponíveis por grupo e subgrupo consta da página oficial de modalidades tarifárias da agência reguladora e do Módulo 7 dos procedimentos de regulação tarifária, com base na <b>Resolução Normativa nº 1.000/2021</b>. As tolerâncias de ultrapassagem diferem por natureza da demanda contratada — consumo e injeção têm limites distintos — e constam da mesma resolução. Consulta em 1º de agosto de 2026. Antes de qualquer uso externo, confirme o texto compilado vigente e a elegibilidade específica do subgrupo da unidade analisada." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "O comparador de modalidades é metade da especificação funcional do <b>Conta de Luz Express</b> — a metade que responde à pergunta \"estou no lugar certo?\". A outra metade é a ordem de leitura da Aula 09. Note que o produto entrega <b>diferença estrutural e lista do que falta</b>, não valor de economia: é exatamente essa fronteira que distingue um diagnóstico independente de uma proposta comercial disfarçada de análise. O cliente que recebe \"estas três linhas mudariam nesta direção, e preciso de doze meses de medição para dizer quanto\" confia mais do que o que recebe um percentual redondo sem memória de cálculo." },
  ],
  'aula-10-03': [
      { kind: 'titulo', numero: "03.1", texto: "Três demandas que não são a mesma coisa" },
      { kind: 'paragrafo', html: "O Módulo 01 ensinou a física da grandeza: quilowatt mede potência, quilowatt-hora mede energia, e demanda é potência média num intervalo de integração. Esta aula não reensina isso. Ela ensina as três demandas que aparecem numa fatura e que consultores confundem com frequência desconfortável." },
      { kind: 'paragrafo', html: "A <b>demanda contratada</b> é a potência ativa que a distribuidora se obriga a disponibilizar continuamente no ponto de conexão, com valor e vigência fixados em contrato, expressa em quilowatt. É um compromisso de reserva de capacidade, não uma previsão de uso. A <b>demanda medida</b> é a maior demanda de potência ativa verificada por medição no período de faturamento, integralizada em intervalos de quinze minutos. É um valor observado, não contratado. A <b>demanda faturável</b> é o valor sobre o qual a tarifa de demanda efetivamente incide, e decorre das regras contratuais e regulatórias — pode ser a contratada, a medida ou outra referência conforme a situação." },
      { kind: 'paragrafo', html: "A consequência prática dessa distinção é que <b>a fatura pode cobrar demanda que a planta não usou</b>, e isso não é irregularidade: é o funcionamento normal de um contrato de reserva de capacidade. A rede precisa estar dimensionada para o pico ainda que o pico dure quinze minutos por mês. Uma planta que solicita mil quilowatts por um quarto de hora e trezentos no restante do mês exige transformadores, condutores e proteção dimensionados para mil. O quilowatt-hora mede o trabalho acumulado; o quilowatt mede a velocidade máxima com que a infraestrutura foi exigida." },
      { kind: 'nota', tom: "neutro", label: "Demanda contra consumo", html: "<b>Criança de 12 anos.</b> Pense numa estrada. O consumo é quantos carros passaram no mês inteiro. A demanda é quantas faixas a estrada precisou ter no momento de maior movimento. Mesmo que só num dia do mês passem muitos carros ao mesmo tempo, a estrada precisa ter todas aquelas faixas construídas o tempo todo. Por isso a fábrica paga duas coisas: pelos carros que passaram e pelas faixas que precisou ter disponíveis.<br><br><b>Executivo não técnico.</b> Sua empresa paga por energia e por capacidade. Energia é volume acumulado no mês. Capacidade é o pico instantâneo que a rede teve de suportar, reservado contratualmente e cobrado ainda que não utilizado, porque a infraestrutura precisa existir para o pico. É por isso que reduzir consumo com eficiência energética não reduz automaticamente a conta de demanda, e é por isso que um contrato de demanda dimensionado há oito anos, para uma planta que desde então mudou, é um dos poucos lugares da fatura em que existe alavanca sem investimento.<br><br><b>Especialista do setor.</b> Demanda é a média das potências ativas requeridas do sistema durante o intervalo de integração, e a demanda medida do ciclo é o máximo dessas médias em intervalos de quinze minutos. Consumo é a integral da potência ativa no período. A cobrança binômia separa a remuneração do custo marginal de capacidade da remuneração do custo marginal de energia, e é essa separação que torna o fator de carga um indicador economicamente significativo e não apenas descritivo: fator de carga baixo significa capacidade reservada e paga com baixa taxa de utilização, e é sinal — não prova — de contrato superdimensionado ou de perfil concentrado em poucos intervalos." },
      { kind: 'titulo', numero: "03.2", texto: "Dimensionar é decisão de risco, não busca de ótimo" },
      { kind: 'paragrafo', html: "Não existe demanda contratada ótima única. Existe uma fronteira entre custo esperado e risco operacional, e a escolha ao longo dessa fronteira depende da criticidade do processo. Uma planta com produção previsível, controle automático de carga confiável e baixo custo de parada pode operar próxima ao contrato. Uma operação com partidas pesadas, retomada após interrupção e alto custo de parada escolhe folga maior — e essa folga não é ineficiência, é prêmio de seguro." },
      { kind: 'paragrafo', html: "O ponto de partida é uma série de, no mínimo, <b>doze meses</b>, preferencialmente com a memória de massa nos intervalos de medição aplicáveis. Para cada mês, o registro mínimo tem sete campos: demanda máxima, segunda maior demanda, data e hora do pico, posto tarifário em que ocorreu, duração do evento, e o que estava acontecendo na planta naquele intervalo. Esse último campo é o que a maior parte dos estudos omite, e é o que separa um pico estrutural de um pico acidental." },
      { kind: 'paragrafo', html: "Picos isolados precisam ser <b>explicados, não removidos</b>. Remover o outlier da série para \"limpar\" os dados é a forma mais eficiente de produzir um contrato que gera ultrapassagem recorrente. A pergunta correta não é se o pico foi típico, mas se o evento que o produziu pode se repetir: partida simultânea de motores após falta de energia, teste de carga, entrada de equipamento novo, falha de geração própria, coincidência de processos batch. Se o evento pode se repetir e não há controle que o impeça, ele pertence à série." },
      { kind: 'titulo', numero: "03.3", texto: "Ultrapassagem: a tolerância é um gatilho, não uma franquia" },
      { kind: 'paragrafo', html: "Este é o ponto em que material comercial erra com mais frequência, e o erro é sempre na mesma direção — a direção que faz a penalidade parecer menor do que é. A formulação correta tem duas partes que precisam ser mantidas juntas." },
      { kind: 'paragrafo', html: "Primeira: existe uma <b>tolerância</b> abaixo da qual a parcela de ultrapassagem não é disparada. A referência geral para demanda contratada de consumo do grupo A é de cinco por cento. Mas a tolerância <b>não é única</b>: ela difere conforme a natureza da demanda contratada. Demanda contratada de injeção, de consumidor ou de gerador, e situações de importação e exportação têm limite mais estreito; distribuidora conectada a outra distribuidora tem limite mais largo. Reproduzir \"cinco por cento\" como se valesse para tudo é o tipo de simplificação que produz contestação mal fundamentada." },
      { kind: 'paragrafo', html: "Segunda, e mais importante: quando o gatilho é disparado, a base de cálculo não é o excedente acima da tolerância — é a diferença entre a demanda medida e a demanda contratada. Um contrato de mil quilowatts com medição de mil e sessenta não gera ultrapassagem sobre dez quilowatts; gera sobre sessenta. A tolerância decide <b>se</b> cobra, não <b>quanto</b> cobra. Quem entende a tolerância como franquia subestima sistematicamente o custo de reduzir contrato." },
      { kind: 'formula', eq: "Parcela de ultrapassagem = (demanda medida − demanda contratada) × multiplicador × tarifa de demanda aplicável aplicada quando demanda medida > demanda contratada × (1 + tolerância)", desc: "Na modalidade horária azul, a verificação e a cobrança ocorrem por posto tarifário, separadamente para ponta e fora de ponta. Não utilizar a demanda contratada em um posto não elimina a cobrança no outro." },
      { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Há divergência ativa em material secundário sobre o <b>multiplicador</b> da parcela de ultrapassagem. Textos que reproduzem a redação anterior à consolidação de 2021 citam três vezes a tarifa; a redação vigente da <b>Resolução Normativa nº 1.000/2021, art. 301</b>, e o material de atendimento das distribuidoras que a aplicam indicam <b>duas vezes</b> o valor da tarifa de demanda. Como este é exatamente o parâmetro que determina a magnitude da penalidade, ele entra nos instrumentos deste módulo como <b>entrada editável</b>, com valor inicial de duas vezes. Antes de qualquer uso externo, confirme no texto compilado vigente da norma e no contrato de uso da unidade. Consulta em 1º de agosto de 2026." },
      { kind: 'titulo', numero: "03.4", texto: "Sazonalidade, geração própria e o que não se presume" },
      { kind: 'paragrafo', html: "Setores ligados a safra, irrigação, beneficiamento agrícola, refrigeração e turismo apresentam oscilação estrutural de carga ao longo do ano, e um contrato de demanda fixo pode ser ineficiente para eles. A norma prevê tratamento para sazonalidade no faturamento do grupo A, mas <b>a possibilidade e o procedimento dependem do enquadramento e do contrato</b>. Não se deve presumir que qualquer indústria pode alterar demanda mensalmente sem prazo nem condição — presumir isso e recomendar com base nessa presunção é como um diagnóstico perde credibilidade em uma frase." },
      { kind: 'paragrafo', html: "Geração própria muda o perfil visto pela rede, mas <b>não elimina a necessidade de demanda contratada</b>, e essa é a fonte de decepção mais comum em projetos de autogeração. Geração solar reduz a energia importada nas horas de irradiância, mas o pico de demanda pode ocorrer em dia nublado, no início da noite, ou durante indisponibilidade do inversor — e é o pico que define a demanda medida. Gerador a combustão permite corte de pico, mas envolve combustível, manutenção, licenciamento e, sobretudo, <b>confiabilidade de partida</b>: um gerador que falha em um único intervalo crítico produz a ultrapassagem que ele existia para evitar. Armazenamento em baterias oferece controle rápido e previsível, mas exige análise de degradação e de valor empilhado." },
      { kind: 'paragrafo', html: "Além disso, uma unidade com geração própria conectada pode ter <b>duas demandas contratadas simultâneas</b> — de consumo e de injeção —, com tolerâncias distintas. Ler a fatura dessa unidade exige separar potência consumida internamente, potência importada da rede, potência injetada, demanda de consumo e demanda de injeção. Um único gráfico de energia líquida mensal não mostra nenhum desses fluxos, e é sobre esse gráfico que a maior parte das propostas de geração própria é construída." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "O dimensionador de demanda e o simulador de ultrapassagem são o núcleo quantitativo do <b>Diagnóstico Energético</b>. O que o produto entrega não é um número de contrato recomendado: é a fronteira entre custo esperado e risco, com os cenários calculados sobre a série real e o evento operacional de cada pico identificado junto à equipe de produção. Um relatório que recomenda um valor de demanda sem ter explicado cada pico da série está recomendando um número que não sobrevive à primeira retomada após falta de energia." },
  ],
  'aula-10-04': [
      { kind: 'titulo', numero: "04.1", texto: "Três horas, definidas por concessionária, em dias úteis" },
      { kind: 'paragrafo', html: "A primeira correção material desta aula é sobre a definição do posto de ponta, e ela é a mais fácil de verificar e a mais frequentemente errada em material comercial. O posto de ponta é o <b>período composto por três horas diárias consecutivas</b>, definidas pela distribuidora considerando a curva de carga do seu sistema elétrico, aprovadas pela agência reguladora para toda a área de concessão ou permissão, com exceção feita a sábados, domingos, terça-feira de carnaval, sexta-feira da Paixão, Corpus Christi e demais feriados nacionais relacionados na norma." },
      { kind: 'paragrafo', html: "Portanto: <b>três horas, não cinco</b>. A fórmula \"das dezessete às vinte e duas\" é incorreta como regra geral e nem sequer tem a duração certa. E o intervalo exato varia por área de concessão: uma planta em uma área pode ter ponta das dezoito às vinte e uma, e outra, a duzentos quilômetros, das dezessete e trinta às vinte e trinta. A fonte correta é a resolução que homologa a revisão tarifária da distribuidora, e a aprovação dos postos ocorre no momento dessa homologação — o que significa que o intervalo pode mudar no ciclo de revisão e frequentemente muda." },
      { kind: 'paragrafo', html: "O posto <b>fora de ponta</b> é o conjunto das horas diárias consecutivas e complementares à ponta. O posto <b>intermediário</b> — duas horas, uma imediatamente anterior e outra imediatamente posterior à ponta — <b>aplica-se apenas à modalidade horária branca do grupo B</b>, e não existe na estrutura do grupo A. Encontrar referência a posto intermediário numa análise de indústria em média tensão é sinal de que a fonte foi lida sem atenção ao grupo." },
      { kind: 'tabela', linhas: [["Pergunta", "Fonte correta", "Erro comum", "Custo do erro"], ["Qual é o intervalo de ponta desta unidade?", "Ato homologatório da distribuidora, na revisão tarifária", "Assumir horário nacional fixo", "Simulação de deslocamento sobre horas erradas"], ["Ponta vale no sábado?", "Norma vigente e calendário de feriados nacionais", "Aplicar ponta em todos os dias do mês", "Superestimar o consumo em ponta faturável"], ["Qual consumo pertence ao ciclo?", "Datas de leitura anterior e atual da fatura", "Usar mês civil", "Reconciliação que não fecha e diagnóstico de erro inexistente"], ["Houve mudança de posto no período?", "Último processo de revisão tarifária da concessionária", "Reutilizar planilha de ciclo anterior", "Comparação de doze meses com bases distintas"], ["Existe posto intermediário aqui?", "Modalidade e grupo da unidade", "Aplicar intermediário ao grupo A", "Estrutura de simulação inteira incorreta"]] },
      { kind: 'titulo', numero: "04.2", texto: "Ponta tarifária não é pico da planta" },
      { kind: 'paragrafo', html: "Esta distinção é a fonte da conversa mais produtiva que se pode ter com um gerente industrial. A ponta tarifária é uma <b>janela regulatória relativamente estável</b>, definida a partir da curva agregada do sistema da distribuidora. Ela não é uma medição dinâmica do pico real de cada dia, e não tem relação necessária com o pico da planta específica." },
      { kind: 'paragrafo', html: "Uma fábrica pode ter o seu maior pico interno às dez da manhã e ainda assim pagar tarifa de ponta apenas no intervalo homologado, quando talvez esteja operando em regime reduzido. E o contrário também ocorre: uma planta cujo processo mais intenso coincide com a janela homologada paga o sinal cheio ainda que, naquele dia específico, o sistema da distribuidora estivesse folgado. O sinal tarifário é estrutural, não instantâneo — e essa é justamente a crítica técnica que alimenta as discussões sobre tarifas mais dinâmicas, que hoje existem como agenda regulatória e não como regra aplicável." },
      { kind: 'paragrafo', html: "A implicação operacional é direta: <b>o deslocamento de carga que reduz custo é o deslocamento para fora da janela homologada</b>, não o deslocamento para fora do pico interno. São duas ações diferentes, e uma equipe de produção que otimiza a curva interna sem consultar o posto homologado pode gastar esforço sem efeito na fatura." },
      { kind: 'nota', tom: "neutro", label: "Postos horários", html: "<b>Criança de 12 anos.</b> É como o preço da passagem de ônibus na hora do rush. Todo mundo quer viajar ao mesmo tempo, e aí precisa ter muito mais ônibus só para aquele pedacinho do dia. A energia funciona igual: existem três horas por dia, de segunda a sexta, em que todo mundo liga tudo ao mesmo tempo. Nessas três horas a energia fica mais cara. E cada cidade tem o seu horário — não é o mesmo no país inteiro.<br><br><b>Executivo não técnico.</b> Sua distribuidora tem um intervalo de três horas por dia útil em que a energia e, na modalidade azul, também a demanda custam significativamente mais. Esse intervalo não é nacional: é definido para a área de concessão e aprovado no processo de revisão tarifária. Antes de investir em qualquer projeto de deslocamento de carga, confirme qual é o intervalo da sua unidade e quanto do seu consumo cai dentro dele. Frequentemente o número é menor do que a intuição sugere — e às vezes é muito maior.<br><br><b>Especialista do setor.</b> O posto de ponta é uma janela de três horas consecutivas por dia útil, definida por área de concessão a partir da curva de carga agregada e homologada no processo de revisão tarifária, com exclusão de fins de semana e feriados nacionais relacionados na norma. O sinal econômico endereça o custo marginal de capacidade, calculado por posto na metodologia de estrutura tarifária. A rigidez da janela em relação à variabilidade real do sistema é a limitação conhecida do desenho, e é o que motiva a agenda de sinais mais granulares — que permanece agenda, sem ato vigente que a torne aplicável ao faturamento do grupo A." },
      { kind: 'titulo', numero: "04.3", texto: "O que uma planta pode e não pode deslocar" },
      { kind: 'paragrafo', html: "Toda proposta de gestão de carga trata o deslocamento como uma variável contínua. Ele não é. Processos industriais têm classes de flexibilidade muito distintas, e a diferença entre elas é o que determina se o projeto é viável ou se é uma planilha bonita." },
      { kind: 'tabela', linhas: [["Alta flexibilidade", "Bombeamento com reservatório, carga de baterias e frota elétrica, compressores com pulmão dimensionado, refrigeração com inércia térmica, moagem com silo intermediário. O produto pode ser feito antes e armazenado."], ["Flexibilidade condicionada", "Fornos de tratamento, secagem, processos batch com janela de qualidade. Podem ser deslocados, mas com custo de reprogramação, perda de rendimento ou risco de qualidade que precisa entrar na conta."], ["Baixa flexibilidade", "Linhas contínuas com turno fixo, processos de fusão, laminação, operação de mineração acoplada a britagem contínua. Deslocar significa reduzir produção — e o custo de oportunidade da produção perdida costuma superar em ordens de grandeza o custo de energia evitado."], ["Deslocamento aparente", "Cargas auxiliares, iluminação, climatização administrativa. Deslocáveis, mas com peso pequeno no total; deslocá-las produz efeito de planilha e quase nenhum efeito de fatura."]] },
      { kind: 'paragrafo', html: "Essa classificação tem uma consequência analítica importante: o instrumento correto para avaliar deslocamento devolve <b>volume e percentual do próprio consumo</b>, não dinheiro. O motivo é que o valor monetário depende da relação entre tarifas da concessionária específica e da modalidade, e o volume deslocável depende do processo — e é o processo que precisa responder primeiro. Só depois de saber quantos megawatt-hora são efetivamente deslocáveis é que a conversa sobre preço faz sentido." },
      { kind: 'nota', tom: "neutro", label: "A pergunta que fecha a conversa de deslocamento", html: "Antes de qualquer projeto de gestão de carga, três perguntas precisam ter resposta escrita. <b>Qual é o intervalo de ponta homologado desta área de concessão, e ele mudou no último ciclo de revisão?</b> <b>Quantos megawatt-hora do consumo caem efetivamente dentro dessa janela em dias úteis, excluídos os feriados?</b> <b>Desse volume, quanto pertence a processo com flexibilidade real, e qual é o custo de oportunidade de deslocá-lo?</b> Se as três não tiverem resposta, o projeto não é avaliável — e dizer isso é o serviço, não a falha em prestá-lo." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "O deslocador de carga é o componente do <b>Diagnóstico Energético</b> que separa oportunidade de gestão de carga de oportunidade de contrato. Na maioria das plantas industriais de processo contínuo, o resultado do instrumento é modesto — e essa é uma informação valiosa, porque redireciona o esforço para demanda contratada e reativo, onde a alavanca é maior e o custo de implementação é menor. Um diagnóstico que insiste em deslocamento onde não há flexibilidade está vendendo esforço, não resultado." },
  ],
  'aula-10-05': [
      { kind: 'titulo', numero: "05.1", texto: "A referência é 0,92 nos dois sentidos, e é por intervalo" },
      { kind: 'paragrafo', html: "O fator de potência de referência, indutivo ou capacitivo, tem como limite mínimo permitido o valor de <b>0,92</b> para a unidade consumidora do grupo A. A norma é a <b>Resolução Normativa nº 1.000/2021, art. 302</b>. O artigo seguinte estabelece que a distribuidora não pode cobrar excedente reativo de unidade do grupo B, que não tem fator de potência de referência — o que explica por que essa linha simplesmente não existe em faturas de baixa tensão, e por que qualquer proposta de correção de reativo dirigida a uma unidade do grupo B merece uma pergunta antes de uma assinatura." },
      { kind: 'paragrafo', html: "A palavra decisiva do parágrafo anterior é <b>intervalo</b>. A apuração não é feita sobre a média mensal do fator de potência: ela é feita sobre o fator de potência calculado em cada intervalo de uma hora ao longo do período de faturamento. A consequência prática é contraintuitiva e vale memorizar: uma unidade pode ter fator de potência médio mensal confortavelmente acima de 0,92 e mesmo assim ser cobrada por excedente reativo, porque a violação ocorreu em intervalos específicos que a média dilui. Quem diagnostica reativo pela média mensal não vai encontrar o problema, e quem recomenda solução pela média mensal vai dimensionar errado." },
      { kind: 'titulo', numero: "05.2", texto: "Duas janelas, dois sinais opostos" },
      { kind: 'paragrafo', html: "A apuração distingue dois regimes com sentidos opostos, e essa é a parte que material comercial mais frequentemente simplifica a ponto de inverter." },
      { kind: 'paragrafo', html: "Num <b>período de seis horas consecutivas</b>, definido pela distribuidora entre 23h30 e 6h30, são apurados apenas os fatores de potência <b>capacitivos</b> inferiores à referência. No <b>período diário complementar</b> a esse, são apurados apenas os fatores de potência <b>indutivos</b> inferiores à referência. O desenho é deliberado: durante o dia, com a planta carregada, o risco é de excesso de consumo de reativo indutivo; de madrugada, com a planta descarregada e a compensação ainda ligada, o risco é o oposto — excesso de reativo capacitivo injetado na rede." },
      { kind: 'paragrafo', html: "Disso decorre o achado diagnóstico mais elegante desta aula. <b>Excedente reativo que aparece apenas na madrugada, em unidade que opera em turno diurno, é assinatura de sobrecompensação</b> — tipicamente banco de capacitores fixo que permanece energizado quando a carga indutiva que ele existia para compensar já foi desligada. O erro de leitura comum é tratar essa cobrança como sinal de que falta compensação e recomendar mais capacitores, o que agrava exatamente o que se pretendia corrigir. O sintoma parece o mesmo na fatura consolidada; o perfil por janela é o que distingue." },
      { kind: 'tabela', linhas: [["Padrão observado", "Hipótese principal", "O que confirma", "O que o instrumento não decide"], ["Excedente recorrente em vários ciclos, no período diurno", "Deficiência estrutural de compensação indutiva", "Perfil por intervalo e inventário de cargas indutivas", "Qual solução: banco automático, estágios, filtro"], ["Excedente apenas na janela noturna", "Sobrecompensação capacitiva por banco fixo energizado sem carga", "Perfil por intervalo e regime de acionamento do banco existente", "Se a correção é lógica de intertravamento ou reconfiguração de estágios"], ["Excedente concentrado em poucos intervalos após partidas", "Transitório de partida e compensação local ausente", "Sequência de partidas e registro de eventos da operação", "Se cabe partida suave, compensação local ou reprogramação"], ["Excedente com aquecimento anormal ou disparo de proteção", "Possível ressonância harmônica na instalação", "Medição de qualidade de energia com análise de distorção", "Nada: exige estudo elétrico antes de qualquer intervenção"], ["Ausência de cobrança em todos os ciclos", "Fator dentro da referência nas duas janelas", "A própria série de faturas, se completa", "Se há problema técnico sem reflexo tarifário"]] },
      { kind: 'titulo', numero: "05.3", texto: "Nomenclatura: o que a norma chama e o que a fatura mostra" },
      { kind: 'paragrafo', html: "A nomenclatura normativa vigente usa <b>energia elétrica reativa excedente</b> e <b>demanda de potência reativa excedente</b>. Faturas e sistemas legados, porém, continuam exibindo rótulos herdados de normas anteriores — abreviações de \"unidade de faturamento de energia reativa\", \"demanda máxima corrigida de reativo\", \"faturamento de energia reativa excedente\", entre outras variantes por distribuidora." },
      { kind: 'paragrafo', html: "A primeira tarefa do analista, portanto, não é calcular nada: é <b>mapear a linha da concessionária ao conceito regulatório</b>, usando a legenda da própria fatura, sem presumir que a sigla exibida corresponde à redação oficial atual. Reproduzir num relatório uma sigla legada como se fosse o termo normativo é o tipo de detalhe que um interlocutor do setor nota imediatamente, e que compromete a percepção sobre tudo o mais que o relatório afirma." },
      { kind: 'paragrafo', html: "Vale registrar também o que a cobrança <b>não é</b>. Ela não é um tributo, não é uma multa no sentido sancionatório, e não é cobrança de energia reativa — a energia reativa em si não é faturada. É a cobrança do <b>excedente</b> em relação ao que o fator de potência de referência permitiria, e sua função declarada é sinalizar o custo que o baixo fator de potência impõe à rede: mais corrente para entregar a mesma potência ativa, com mais perdas, mais queda de tensão e mais ocupação de capacidade." },
      { kind: 'nota', tom: "neutro", label: "Fator de potência e excedente reativo", html: "<b>Criança de 12 anos.</b> Imagine carregar uma caixa pesada com uma corda torta. Parte da força que você faz não empurra a caixa para frente — ela puxa para o lado. A caixa anda, mas você se cansa mais do que precisava. Na fábrica acontece algo parecido: parte da eletricidade vai e volta sem fazer o trabalho principal, e por causa disso os fios precisam ser mais grossos. Se isso passa de certo limite, a conta cobra um extra. E tem um detalhe engraçado: se você corrigir demais, também é cobrado — de madrugada, quando a fábrica está quase parada.<br><br><b>Executivo não técnico.</b> Existe um limite regulatório de eficiência elétrica da sua instalação. Abaixo dele, sua fatura recebe uma cobrança adicional. O limite vale nos dois sentidos, e a verificação é feita hora a hora, não pela média do mês — por isso um relatório que diz \"seu fator de potência médio está bom\" não prova nada. A cobrança na fatura prova que houve violação; ela não prova qual equipamento comprar. Entre o sintoma e a solução há um estudo elétrico, e pular esse estudo é como comprar remédio pelo sintoma.<br><br><b>Especialista do setor.</b> O fator de potência de referência é 0,92, indutivo ou capacitivo, para unidades do grupo A, nos termos do art. 302 da Resolução Normativa nº 1.000/2021. A apuração dos excedentes considera o fator calculado em cada intervalo horário, com verificação de excedente capacitivo restrita a um período de seis horas consecutivas definido pela distribuidora entre 23h30 e 6h30, e de excedente indutivo no período complementar. As grandezas faturadas são energia reativa excedente e demanda de potência reativa excedente, esta última corrigida pelo fator no intervalo. A valoração utiliza referência normativa vinculada à tarifa de energia da bandeira verde do subgrupo B1. Correção por compensação capacitiva em instalação com carga não linear exige avaliação de distorção harmônica e de risco de ressonância antes do dimensionamento, e a norma atribui ao consumidor a responsabilidade por sistemas de compensação que causem ressonância harmônica ou transitórios de manobra." },
      { kind: 'titulo', numero: "05.4", texto: "Do achado ao projeto: onde a fatura para de servir" },
      { kind: 'paragrafo', html: "A fatura prova que houve cobrança. Ela não prova qual banco instalar, em que ponto, com quantos estágios, com que proteção, nem se o problema é de compensação ou de distorção harmônica. Entre o achado e a solução existe um estudo elétrico com medição de qualidade de energia, inventário de cargas e verificação de risco de ressonância — e esse estudo exige profissional habilitado." },
      { kind: 'paragrafo', html: "Isso não é cautela retórica; é a fronteira que define a natureza do serviço. Um diagnóstico independente entrega: a cobrança observada por ciclo, o perfil por janela, a classificação entre estrutural e pontual, a lista de evidências que faltam, e a recomendação de realizar o estudo. Um fornecedor de equipamento entrega, com frequência, o dimensionamento já pronto a partir da fatura — o que é tecnicamente insuficiente e comercialmente compreensível. Quem tem receita vinculada à venda de um equipamento tem incentivo econômico alinhado a que o equipamento seja a resposta. Isso é uma afirmação sobre estrutura de mercado, não sobre conduta de ninguém: é a mesma lógica que faz um diagnóstico independente valer o que vale." },
      { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Fator de potência de referência de 0,92 para o grupo A: art. 302 da Resolução Normativa nº 1.000/2021. Vedação de cobrança de excedente reativo a unidades do grupo B: art. 303. Fórmulas de apuração dos excedentes, janelas e valor de referência aplicável: art. 304 e seguintes. Período de ajustes de três ciclos consecutivos e completos de faturamento no início do fornecimento, para adequação do fator de potência: art. 316. Consulta em 1º de agosto de 2026; confirme numeração e redação no texto compilado vigente antes de citar em material externo, porque a resolução recebeu alterações desde a publicação original." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "O apurador de excedente reativo compõe o <b>Diagnóstico Energético</b> e alimenta a dimensão de desempenho de fator de potência do <b>Energy Score</b>. O que o produto entrega é a caracterização do problema e a lista do que falta — não o dimensionamento do equipamento. Essa separação é o que permite à GridAlpha avaliar, depois, uma proposta de correção feita por terceiro: quem não dimensionou o banco pode dizer, sem conflito, se o banco proposto responde ao perfil medido." },
  ],
  'aula-10-06': [
      { kind: 'titulo', numero: "06.1", texto: "Onde os encargos aparecem — e onde não aparecem" },
      { kind: 'paragrafo', html: "A visibilidade dos encargos na fatura varia por distribuidora e por leiaute. Alguns aparecem como componentes explícitos em demonstrativo; a maioria está <b>embutida nas tarifas homologadas</b>, especialmente na tarifa de uso do sistema de distribuição. A ausência de uma linha explícita não significa custo zero: significa que o item está alocado dentro do valor unitário da tarifa aplicada." },
      { kind: 'paragrafo', html: "Essa característica cria um problema prático recorrente. Um cliente pergunta \"quanto pago de encargos?\" e a resposta honesta é que a fatura sozinha frequentemente não permite responder com precisão. Para responder, é preciso ir à <b>planilha tarifária</b> da concessionária no processo tarifário vigente, onde os componentes da tarifa de uso são desagregados. Para auditoria comercial de primeira camada — conferir se a tarifa aplicada corresponde à homologada —, a desagregação não é necessária. Para modelagem de migração de ambiente, de geração distribuída ou de subsídios, ela é indispensável." },
      { kind: 'titulo', numero: "06.2", texto: "Duas mudanças de 2025 que alteram a linha de encargos" },
      { kind: 'paragrafo', html: "A <b>Lei nº 15.269, de 24 de novembro de 2025</b>, conversão de medida provisória, é a alteração mais relevante para o consumidor industrial em anos. Duas de suas disposições entram diretamente na fatura." },
      { kind: 'paragrafo', html: "A primeira redistribui o custo das quotas anuais do encargo de desenvolvimento energético <b>por nível de tensão</b>. A partir de 1º de janeiro de 2026, o custo por megawatt-hora pago por quem é atendido em tensão <b>igual ou superior a 69 kV</b> passou a ser cinquenta por cento daquele pago por quem é atendido em tensão inferior a 2,3 kV; e o pago por quem é atendido em tensão <b>igual ou superior a 2,3 kV e inferior a 69 kV</b> passou a ser oitenta por cento. Os dispositivos são os parágrafos 3º-D e 3º-E acrescidos ao art. 13 da Lei nº 10.438, de 26 de abril de 2002." },
      { kind: 'paragrafo', html: "Repare no que isso significa para uma indústria média conectada em 13,8 kV: ela está na faixa dos oitenta por cento. Uma unidade da mesma empresa conectada em 69 kV está na faixa dos cinquenta. Duas plantas do mesmo grupo, com o mesmo consumo, pagam quotas unitárias diferentes por megawatt-hora — e a diferença é regulatória, não operacional. Isso responde, sozinho, uma das perguntas mais frequentes de controller: por que duas plantas nossas pagam valores diferentes por unidade de energia." },
      { kind: 'paragrafo', html: "A segunda disposição é prospectiva. A partir do <b>Orçamento Anual do encargo de desenvolvimento energético de 2027</b>, o valor total dos recursos arrecadados passa a ser limitado a uma soma definida em lei, ancorada no orçamento de 2025 atualizado por índice de preços, com criação de um <b>Encargo de Complemento de Recursos</b>. É regra com prazo previsto em lei e com regulamentação a acompanhar — não é fato consumado, e citá-la como se já estivesse produzindo efeito na fatura é erro de vigência." },
      { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Rateio por nível de tensão: Lei nº 15.269/2025, que acresce os §§ 3º-D e 3º-E ao art. 13 da Lei nº 10.438/2002, com efeito declarado a partir de 1º de janeiro de 2026. Teto de arrecadação e Encargo de Complemento de Recursos: §§ 18 e 19 do mesmo artigo, com marco no Orçamento Anual de 2027 — <b>prazo previsto em lei</b>, com regulamentação a verificar. Custeio da política de tarifa social e do desconto social pelo encargo de desenvolvimento energético: Lei nº 15.235, de 8 de outubro de 2025, regulamentada pela Resolução Normativa ANEEL nº 1.147, de 9 de dezembro de 2025. Consulta em 1º de agosto de 2026. Os valores das quotas anuais são fixados a cada ciclo e devem ser buscados no ato vigente, nunca reproduzidos de material do ano anterior." },
      { kind: 'titulo', numero: "06.3", texto: "A tarifa social e o efeito distributivo" },
      { kind: 'paragrafo', html: "A <b>Lei nº 15.235, de 8 de outubro de 2025</b>, conversão de medida provisória, reformou a tarifa social de energia elétrica. Ela estabelece desconto de cem por cento sobre a parcela de consumo igual ou inferior a 80 kWh por mês para consumidores enquadrados na subclasse residencial baixa renda, e cria um segundo benefício — o desconto social — para famílias com renda per capita entre meio e um salário mínimo inscritas no cadastro único, com tarifa reduzida e isenção de quotas do encargo de desenvolvimento energético para consumo de até 120 kWh mensais, com vigência declarada a partir de 1º de janeiro de 2026. A regulamentação veio pela <b>Resolução Normativa ANEEL nº 1.147, de 9 de dezembro de 2025</b>, após consulta pública." },
      { kind: 'paragrafo', html: "Por que isso está num módulo sobre conta de luz industrial? Porque <b>o custeio é pelo encargo de desenvolvimento energético</b>, que é rateado entre os demais consumidores, e porque a mesma lei destinou recursos arrecadados a finalidades de modicidade tarifária em regiões específicas. Existe, portanto, um vínculo direto entre o desenho da política social e a linha de encargos de uma fatura industrial. Esse vínculo é um fato de estrutura de financiamento setorial. Descrevê-lo é obrigação analítica; opinar sobre o mérito da política não é — e a fronteira entre as duas coisas é o que mantém a independência de quem descreve." },
      { kind: 'titulo', numero: "06.4", texto: "A conversa que o encargo permite e a que ele não permite" },
      { kind: 'paragrafo', html: "Há uma pergunta que um gerente industrial faz e que separa quem entende de quem repete: <b>\"dá para reduzir meus encargos?\"</b>. A resposta correta tem três partes, e nenhuma delas é sim ou não." },
      { kind: 'paragrafo', html: "A quota unitária não é negociável — é fixada por metodologia regulada e não admite tratamento individual. Isso responde à interpretação literal da pergunta. Mas a <b>base</b> sobre a qual as quotas incidem é influenciável, porque a maior parte delas é cobrada por unidade de energia ou dentro de componentes da tarifa de uso aplicados a energia e demanda: menos energia, menos encargo; menos demanda faturada, menos componente de demanda. Isso responde à intenção da pergunta. E o <b>rateio</b> a que a unidade está sujeita depende do nível de tensão de conexão, que é decisão de projeto de longo prazo, com custo de conexão próprio — e que, desde 2026, tem efeito explícito e quantificado sobre a quota. Isso responde ao que a pergunta não sabia perguntar." },
      { kind: 'paragrafo', html: "A conversa muda de qualidade quando o analista organiza a resposta assim, porque ela deixa de ser uma negativa e passa a ser um mapa. E ela não promete nada: cada uma das três partes é uma afirmação sobre mecanismo, verificável na norma e na própria fatura." },
      { kind: 'nota', tom: "neutro", label: "A pergunta de controle antes de aceitar qualquer número de encargo", html: "Todo valor de encargo citado em proposta comercial precisa passar por quatro perguntas. <b>Qual é a unidade?</b> — reais por megawatt-hora, reais por quilowatt, ou percentual de alguma base. <b>Qual é a data-base?</b> — quotas são fixadas por ciclo e envelhecem em doze meses. <b>Qual é o recorte?</b> — o valor é da concessionária específica, da região, ou média nacional. <b>Está embutido ou explícito?</b> — somar um encargo explícito a uma tarifa que já o contém é dupla contagem, e é um erro que aparece em planilha de migração com frequência maior do que seria confortável admitir." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "A anatomia dos encargos alimenta a camada de contexto regulatório do <b>Diagnóstico Energético</b> e é a base da dimensão de risco regulatório do <b>Energy Score</b>. Note que o valor comercial aqui não está em reduzir encargo — não há como. Está em <b>explicar</b>: um cliente que entende por que sua fatura tem uma linha que ele não controla para de gastar energia gerencial tentando negociá-la, e passa a gastá-la nas quatro decisões do Eixo 1, onde há alavanca. Diagnóstico que redireciona atenção é diagnóstico que gera resultado." },
  ],
  'aula-10-07': [
      { kind: 'titulo', numero: "07.1", texto: "Três tributos, três entes, três lógicas" },
      { kind: 'paragrafo', html: "Sobre a fatura de energia elétrica incidem, no regime que 2026 ainda opera, contribuições federais, imposto estadual e contribuição municipal. As <b>contribuições federais</b> incidem sobre o faturamento, com regime de apuração que admite crédito para contribuintes do regime não cumulativo, e as alíquotas efetivas variam conforme o regime. O <b>imposto estadual</b> tem alíquota, base e tratamento definidos em legislação de cada unidade da federação, sujeitos a jurisprudência vinculante que trataremos adiante. A <b>contribuição municipal para custeio da iluminação pública</b> é instituída por lei municipal, tem regra de cálculo local, e não remunera consumo da planta: financia a iluminação pública do município." },
      { kind: 'paragrafo', html: "Percentuais genéricos não servem para nada além de ilustração. Uma análise profissional registra: estado, município, regime de incidência do contribuinte, base declarada na fatura e eventual direito a crédito. Reproduzir \"cerca de nove por cento de contribuições federais e entre dezessete e trinta por cento de imposto estadual\" como se fossem parâmetros estáveis é o tipo de simplificação que, em 2026, está errada por dois motivos ao mesmo tempo: o regime está em transição, e a base do imposto estadual é objeto de controvérsia em curso." },
      { kind: 'titulo', numero: "07.2", texto: "O que já está pacificado sobre demanda" },
      { kind: 'paragrafo', html: "Há um ponto que está consolidado há mais de uma década e que aparece em praticamente toda fatura industrial. O imposto estadual incide sobre o valor da tarifa correspondente à <b>demanda de potência efetivamente utilizada</b> — enunciado da <b>Súmula 391 do Superior Tribunal de Justiça</b>, e objeto do <b>Tema 63</b> daquele tribunal, no sentido de que é indevida a incidência sobre a parcela correspondente à demanda contratada mas não utilizada. O Supremo Tribunal Federal fixou tese no mesmo sentido em repercussão geral, no <b>Tema 176 · RE 593.824</b>, julgado em 2020: a demanda de potência não é passível, por si só, de tributação, porque só integram a base do imposto os valores referentes a operações em que haja efetivo consumo." },
      { kind: 'paragrafo', html: "Consequência de leitura direta: faturas costumam separar a base tributável da não tributável justamente por causa desse entendimento, e uma fatura que não faz essa separação, numa unidade cuja demanda medida é inferior à contratada, é um achado que merece verificação. Não é conclusão de erro — leiautes variam, e a separação pode estar implícita no cálculo. É um ponto de conferência com regra consolidada por trás, que é exatamente o que um analista de fatura procura." },
      { kind: 'titulo', numero: "07.3", texto: "A controvérsia sobre a base: tarifas de uso da rede" },
      { kind: 'paragrafo', html: "Este é o item de maior risco real numa conta industrial e é onde material comercial mais simplifica. A sequência é a seguinte, apresentada como fato descritivo com as posições dos envolvidos." },
      { kind: 'lista', itens: ["Dezembro de 2021 — essencialidadeTema 745 · STF O Supremo fixou tese em repercussão geral no RE 714.139: adotada pelo legislador estadual a técnica da seletividade, discrepam do figurino constitucional alíquotas sobre operações de energia elétrica e serviços de telecomunicação em patamar superior ao das operações em geral, considerada a essencialidade. Os efeitos foram modulados para o exercício financeiro de 2024, ressalvadas as ações ajuizadas até 5 de fevereiro de 2021.", "Junho de 2022 — reação legislativaLei Complementar nº 194/2022 O Congresso classificou energia elétrica entre os bens e serviços essenciais e acresceu à lei complementar que disciplina o imposto estadual dispositivo estabelecendo não incidência sobre serviços de transmissão e distribuição e encargos setoriais vinculados às operações com energia elétrica.", "Fevereiro e março de 2023 — suspensãoADI 7.195/DF Governadores de onze estados e do Distrito Federal questionaram a constitucionalidade da alteração. O relator concedeu medida cautelar suspendendo a eficácia do dispositivo, ao fundamento de possível invasão, pela União, da competência tributária estadual. O Plenário referendou a cautelar, que permanece produzindo efeitos até o julgamento de mérito.", "Março e maio de 2024 — tese repetitivaTema 986 · STJ O Superior Tribunal de Justiça firmou, em recursos repetitivos, que as tarifas de uso dos sistemas de transmissão e de distribuição, quando lançadas na fatura como encargo suportado diretamente pelo consumidor final — <b>seja ele livre ou cativo</b> —, integram a base de cálculo do imposto estadual. Houve modulação de efeitos, com marco temporal em 27 de março de 2017, protegendo situação específica de contribuintes com tutela provisória vigente até aquela data, e ainda assim apenas até a publicação do acórdão.", "Estado atualverificar antes de usar Com a cautelar em vigor e a tese repetitiva firmada, as tarifas de uso vêm sendo incluídas na base do imposto estadual. O mérito da ação direta permanecia pendente na última verificação. Este é, portanto, um item cuja resposta pode mudar — e um relatório que o apresenta como definitivo está antecipando um resultado."] },
      { kind: 'paragrafo', html: "Repare no ponto que a tese repetitiva torna explícito e que é frequentemente omitido em material de venda de migração: a inclusão vale <b>tanto para o consumidor cativo quanto para o livre</b>. Uma proposta que sugere que migrar de ambiente resolve exposição tributária sobre tarifa de uso está descrevendo algo que a tese firmada não sustenta." },
      { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Tema 745 do STF, RE 714.139, com modulação para o exercício de 2024 e ressalva de ações ajuizadas até 5 de fevereiro de 2021. Lei Complementar nº 194, de 2022. ADI 7.195/DF, com cautelar deferida em fevereiro de 2023 e referendada pelo Plenário em março de 2023; <b>mérito pendente na verificação de 1º de agosto de 2026</b>. Tema 986 do STJ, tese firmada em 13 de março de 2024, acórdão publicado em 29 de maio de 2024, com modulação de marco em 27 de março de 2017. Súmula 391 do STJ; Tema 63 do STJ; Tema 176 do STF, RE 593.824, julgado em 2020. Verifique o estado processual atualizado antes de qualquer uso externo — esta é a seção deste módulo com maior probabilidade de estar desatualizada no momento da leitura." },
      { kind: 'titulo', numero: "07.4", texto: "A transição do regime de tributos sobre o consumo" },
      { kind: 'paragrafo', html: "Um módulo sobre conta de luz industrial escrito em 2026 que trate as contribuições federais como estado permanente é um módulo defeituoso. A <b>Emenda Constitucional nº 132/2023</b> instituiu a reforma da tributação sobre o consumo, e a <b>Lei Complementar nº 214/2025</b> estruturou o funcionamento dos novos tributos e o modelo de transição. As contribuições federais e o imposto federal sobre produtos industrializados dão origem à contribuição sobre bens e serviços; o imposto estadual e o imposto municipal sobre serviços dão origem ao imposto sobre bens e serviços." },
      { kind: 'paragrafo', html: "O que 2026 é, na prática: <b>ano de convivência entre regimes</b>. Desde 1º de janeiro de 2026 vigora uma alíquota de calibração de 0,9% para a contribuição federal nova e 0,1% para o imposto compartilhado novo, com previsão de compensação contra os débitos das contribuições federais vigentes, de modo que o desembolso total não se altera nesta fase. O impacto imediato é operacional — documentos fiscais com novos campos, adaptação de sistemas — e não financeiro. A partir de 2027, as contribuições federais são extintas e a contribuição nova passa a operar com alíquota cheia; a transição do imposto estadual ocorre em fase posterior, com implementação plena prevista para 2033." },
      { kind: 'tabela', linhas: [["Período", "O que ocorre", "Efeito na leitura da fatura", "Estado"], ["Até 2025", "Regime anterior integralmente vigente", "Contribuições federais e imposto estadual conforme regras próprias", "Histórico"], ["2026", "Alíquota de calibração dos novos tributos, com compensação", "Novos campos em documento fiscal; desembolso total sem alteração nesta fase", "Vigente"], ["2027", "Extinção das contribuições federais; contribuição nova em alíquota cheia", "Substituição de linhas federais; regime de crédito próprio", "Prazo previsto em lei"], ["2029 a 2032", "Redução progressiva do imposto estadual com elevação do novo", "Convivência de duas bases estaduais na mesma fatura", "Prazo previsto em lei"], ["2033", "Sistema definitivo", "Estrutura tributária da fatura integralmente substituída", "Prazo previsto em lei"]] },
      { kind: 'nota', tom: "neutro", label: "Fonte", html: "<b>Fonte:</b> Emenda Constitucional nº 132/2023 e Lei Complementar nº 214/2025, com o calendário de transição por ela estruturado. Consulta em 1º de agosto de 2026. Datas futuras entram como <b>prazo previsto em lei</b>, nunca como fato consumado, e o tratamento setorial específico aplicável a operações com energia elétrica deve ser verificado na legislação complementar e regulamentação antes de qualquer modelagem." },
      { kind: 'titulo', numero: "07.5", texto: "O que isso significa para uma análise de doze meses" },
      { kind: 'paragrafo', html: "Duas consequências operacionais imediatas, e ambas são armadilha para quem compara séries. Primeira: uma série de doze meses que atravessa 1º de janeiro de 2026 atravessa uma mudança de regime de documento fiscal, e a comparação de linhas tributárias entre os dois lados exige declarar isso. Segunda: qualquer modelo de custo projetado para além de 2026 que assuma permanência das contribuições federais está assumindo uma premissa contra o calendário legal. Isso não invalida a projeção — invalida apresentá-la sem a premissa declarada." },
      { kind: 'paragrafo', html: "E há uma terceira, comercial. Numa fase de transição, a pergunta \"posso recuperar crédito tributário?\" ganha frequência. Ela é legítima e está fora do escopo de um diagnóstico energético independente: envolve regime de apuração do contribuinte, escrituração e matéria de direito. A resposta correta não é sim nem não — é indicar que o diagnóstico identifica a composição da base e as linhas potencialmente relevantes, e que a conclusão exige validação contábil e jurídica. Saber onde termina a própria competência é parte do serviço, e é o que impede que um relatório técnico produza um passivo." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "A camada tributária alimenta a seção de qualidade de dados e a de risco regulatório do <b>Diagnóstico Energético</b>. Sua função no produto não é otimizar tributo — é <b>impedir erro de reconciliação</b>. A maior parte das divergências entre tarifa homologada e tarifa aparente da fatura se explica por tributo compondo o valor unitário exibido, e um analista que não domina essa composição vai acusar erro de faturamento onde não há. Errar nessa direção custa mais caro que não achar nada: uma contestação sem base rejeitada pela distribuidora é o fim da credibilidade do relatório inteiro." },
  ],
  'aula-10-08': [
      { kind: 'titulo', numero: "08.1", texto: "Quatro relógios, quatro efeitos distintos" },
      { kind: 'paragrafo', html: "O <b>reajuste tarifário anual</b> atualiza custos e componentes conforme metodologia e contrato de concessão, e ocorre na data de aniversário tarifário da concessionária. Duas plantas do mesmo grupo em estados diferentes atravessam reajustes em meses diferentes — e é por isso que comparar o custo unitário das duas, sem declarar o aniversário de cada uma, compara bases distintas." },
      { kind: 'paragrafo', html: "A <b>revisão tarifária periódica</b> ocorre em ciclo contratual mais espaçado e reavalia custos eficientes, base de remuneração, perdas, qualidade e a própria <b>estrutura</b> tarifária. É nela que a definição dos postos tarifários da área de concessão é aprovada — o que significa que o intervalo de ponta pode mudar de um ciclo para outro. Uma série de doze meses que atravessa uma revisão pode ter, literalmente, horas de ponta diferentes nas duas metades, e uma simulação de deslocamento construída sobre a janela antiga estará errada em toda a segunda metade." },
      { kind: 'paragrafo', html: "A <b>revisão extraordinária</b> é excepcional e ocorre em hipóteses previstas de reequilíbrio. Os <b>componentes financeiros</b> são ajustes de exercícios anteriores incorporados ao resultado do processo, e explicam por que um reajuste pode ter magnitude descolada da variação de custos daquele ano específico. E a <b>bandeira tarifária</b> é a camada de curtíssimo prazo: acionada mensalmente conforme as condições de geração avaliadas pelo operador do sistema, ela antecipa um custo que, antes de sua criação, chegava ao consumidor com defasagem, diluído no reajuste do ano seguinte." },
      { kind: 'titulo', numero: "08.2", texto: "Efeito preço contra efeito quantidade" },
      { kind: 'paragrafo', html: "Esta é a operação analítica que separa um relatório defensável de uma narrativa. Uma variação de custo entre dois períodos tem duas origens possíveis, e elas precisam ser separadas antes de qualquer conclusão: mudou o <b>preço unitário</b>, mudou a <b>quantidade</b>, ou mudaram os dois em direções que podem se somar ou se cancelar." },
      { kind: 'paragrafo', html: "Se o custo total subiu doze por cento, é possível que oito venham de reajuste tarifário e quatro de aumento de consumo. É possível que a tarifa tenha subido quinze e o consumo caído três. É possível que a tarifa não tenha mudado e a variação inteira venha de uma parcela de ultrapassagem em um único mês. Sem decomposição, qualquer narrativa sobre economia ou piora pode estar errada — inclusive as narrativas favoráveis. E é justamente por serem favoráveis que essas passam sem contestação, o que as torna mais perigosas para a credibilidade de quem as assina." },
      { kind: 'paragrafo', html: "A decomposição exige, para cada componente da fatura, a quantidade e a tarifa unitária dos dois períodos. É trabalho de extração, não de modelagem: os dois números estão na fatura, e a tarifa unitária pode ser conferida contra o ato homologatório vigente em cada período. O que torna esse trabalho penoso não é a matemática — é a disciplina de preservar granularidade suficiente para reconciliar cada linha, em vez de transcrever apenas totais." },
      { kind: 'nota', tom: "neutro", label: "Por que sua planilha não fecha com a fatura", html: "Quando um modelo não reproduz a fatura, a diferença quase sempre está em uma destas origens: tributo compondo o valor unitário exibido, quando a tarifa homologada é publicada sem tributos; rateio de ciclo, quando o período de leitura atravessa meses com bandeiras diferentes ou uma data de reajuste; casas decimais da tarifa, que costumam ser mais do que a fatura exibe; compensação de perdas de transformação, quando a medição está no lado de baixa tensão de transformador do consumidor; componentes financeiros e refaturamentos; e linha simplesmente omitida na transcrição. <b>Regra operacional: se o modelo não reproduz a fatura, o modelo não pode ser usado para projetar alternativa.</b> Reconciliar primeiro, simular depois — nunca o contrário." },
      { kind: 'titulo', numero: "08.3", texto: "A bandeira: sinal mensal, não imposto e não multa" },
      { kind: 'paragrafo', html: "A bandeira tarifária sinaliza mensalmente as condições de custo de geração para consumidores atendidos no ambiente regulado. Verde não adiciona valor; amarela e as duas faixas de vermelha adicionam um valor por unidade de energia consumida, expresso por cada cem quilowatt-hora. Não é tributo e não é penalidade por consumo: é um componente tarifário de sinalização, cuja função declarada é antecipar ao consumidor um custo que a estrutura anterior repassava com defasagem." },
      { kind: 'paragrafo', html: "Três precisões importam para uma leitura industrial. Primeira: o consumidor do <b>ambiente livre não paga bandeira</b> nos mesmos termos do cativo — sua exposição a variação de custo de geração aparece por outro caminho, no contrato, na liquidação de diferenças e nos encargos aplicáveis. Aplicar adicional de bandeira ao volume livre sem verificar a regra de faturamento é erro que aparece em planilha de comparação entre ambientes. Segunda: quando o ciclo de leitura atravessa meses com cores diferentes, o adicional é <b>rateado</b> conforme os dias de cada cor no ciclo — e a fatura mostra isso, frequentemente em demonstrativo separado. Terceira: para uma indústria cativa, a bandeira eleva o <b>custo marginal</b> do quilowatt-hora, o que altera a matemática de qualquer projeto de eficiência ou deslocamento avaliado com a tarifa base." },
      { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Os adicionais vigentes na verificação de <b>1º de agosto de 2026</b> eram: verde sem acréscimo; amarela com acréscimo de R$ 1,88 por 100 kWh; vermelha patamar 1 com R$ 4,46 por 100 kWh; vermelha patamar 2 com R$ 7,87 por 100 kWh. A bandeira acionada para agosto de 2026, anunciada em 31 de julho de 2026, era <b>amarela</b> — quarto mês consecutivo nessa cor, após acionamento em maio de 2026 e quatro meses iniciais de verde. Os valores dos adicionais são atualizados pela agência reguladora ao final do período úmido, tipicamente em abril, para o ciclo seguinte; a cor é definida mensalmente e anunciada no fim do mês anterior. Existe ainda um patamar de contingência, fora do ciclo ordinário, que exige ato formal para acionamento e não estava acionado. Confirme sempre na página oficial de bandeiras antes de usar em diagnóstico comercial: <b>este é o número deste módulo com menor prazo de validade</b>." },
      { kind: 'titulo', numero: "08.4", texto: "Reconstruir antes de conferir" },
      { kind: 'paragrafo', html: "Há um exercício que vale mais do que parece e que este módulo transforma em instrumento. Antes de olhar a composição real de uma fatura, o analista estima quanto cada bloco representa do total. Depois compara. A diferença entre a estimativa e o real não é uma nota: é um <b>mapa de viés</b>, e o viés tende a ser sistemático e reconhecível." },
      { kind: 'paragrafo', html: "Os dois vieses mais comuns são opostos e igualmente caros. O primeiro é <b>superestimar energia</b> — quem vem de raciocínio de mercado atacadista tende a achar que o componente de energia domina a fatura, e subestima o peso de rede, encargos e tributos. Esse viés produz expectativas irrealistas sobre o efeito de migração de ambiente. O segundo é <b>subestimar demanda</b> — quem vem de raciocínio de consumo pensa em megawatt-hora e esquece que a parcela de capacidade pode ser substancial, especialmente em plantas com fator de carga baixo. Esse viés produz diagnósticos que ignoram a alavanca contratual mais acessível que existe." },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "O reconstrutor de fatura é a espinha do <b>Energy Score</b>: a comparação entre composição estimada e composição real é o que permite normalizar faturas de plantas diferentes numa mesma escala e identificar, sem promessa e sem número de economia, onde uma instalação se afasta do padrão do próprio setor. E a régua do ciclo tarifário é o que garante que uma comparação de doze meses no <b>Diagnóstico Energético</b> declare o que mudou no meio — sem isso, o relatório atribui a decisões da empresa efeitos que foram do calendário." },
  ],
  'aula-10-09': [
      { kind: 'titulo', numero: "09.1", texto: "Por que a ordem importa mais do que a completude" },
      { kind: 'paragrafo', html: "O erro que custa caro numa leitura de fatura não é a linha esquecida. É a <b>ordem errada</b>, porque a ordem errada faz perder o achado que tornaria os demais irrelevantes. Três exemplos tornam isso concreto." },
      { kind: 'paragrafo', html: "Se a unidade está enquadrada numa modalidade indisponível ao subgrupo dela, nada do que vier depois importa até que isso seja resolvido — o enquadramento errado altera a estrutura inteira de cobrança a jusante, e otimizar demanda dentro de um enquadramento inválido é otimizar dentro de uma premissa falsa. Se existe apenas uma fatura e não há histórico, nenhum dimensionamento de demanda é concluível, e insistir em concluir é o caminho mais curto para uma recomendação que gera ultrapassagem recorrente. Se o período de leitura atravessou um reajuste tarifário, nenhuma comparação com o mês anterior é válida sem decompor efeito preço de efeito quantidade." },
      { kind: 'paragrafo', html: "Nos três casos, o achado que encerra ou reorienta a análise está no <b>cabeçalho e nas datas</b> — a parte do documento que a maior parte dos analistas pula para chegar aos valores. Daí a regra que organiza toda a sequência: cadastro antes de valores, período antes de comparação, quantidade antes de tarifa, e disponibilidade de dados antes de qualquer conclusão." },
      { kind: 'titulo', numero: "09.2", texto: "A sequência de nove passos" },
      { kind: 'paragrafo', html: "Cada passo abaixo tem três elementos: o que se olha, o critério de parada, e o que o achado implica. O tempo indicado é orientativo e serve para calibrar a expectativa — os três primeiros passos consomem menos de um minuto somados e respondem à maior parte das perguntas de triagem." },
      { kind: 'titulo', numero: "09.3", texto: "Os quatro achados e o que cada um exige" },
      { kind: 'paragrafo', html: "O critério de domínio nomeia quatro achados. Cada um tem uma exigência de evidência distinta, e confundir as exigências é a origem da maior parte das conclusões apressadas." },
      { kind: 'tabela', linhas: [["Achado", "Evidência mínima para levantar a hipótese", "Evidência mínima para concluir", "Saída correta se faltar evidência"], ["Erro de enquadramento", "Cadastro da fatura: subgrupo e modalidade", "Perfil de demanda e energia por posto em doze meses, mais tarifas homologadas vigentes", "Indicar em quais linhas mudaria e em que direção, sem valor"], ["Demanda subótima", "Contratada contra medida em uma fatura", "Série de doze meses com memória de massa e explicação de cada pico, mais plano de produção", "Declarar que não é concluível e listar o que falta"], ["Fator de potência", "Presença de linha de excedente reativo", "Perfil por intervalo nas duas janelas e, se houver carga não linear, medição de qualidade", "Classificar como estrutural ou pontual e recomendar estudo"], ["Mudança de ambiente", "Volume, tensão de conexão e perfil declarado", "Série horária, custo entregue completo dos dois lados e apetite de risco declarado", "Veredito de investigação, sem comparar preço de contrato com total cativo"]] },
      { kind: 'paragrafo', html: "Repare na coluna da direita. Em três dos quatro achados, a saída correta quando falta evidência <b>não é o silêncio nem a estimativa</b> — é uma saída positiva e específica: uma direção sem magnitude, uma lista do que falta, uma classificação. É isso que um cliente compra quando compra independência: não a promessa, mas a fronteira declarada entre o que a fatura prova e o que ela apenas sugere." },
      { kind: 'titulo', numero: "09.4", texto: "\"Quanto eu economizo?\" — a pergunta de volta correta" },
      { kind: 'paragrafo', html: "Esta é a pergunta que fecha toda conversa comercial deste bloco, e ela costuma vir com uma qualificação que a torna mais difícil: <i>\"só um percentual aproximado\"</i>. A qualificação é sincera e é uma armadilha. Um percentual aproximado dado sem dados vira, na cabeça de quem ouviu, um compromisso — e quando os dados chegam e o número real é outro, o analista perde não o cliente, mas a autoridade." },
      { kind: 'paragrafo', html: "A resposta correta tem duas partes e nenhuma delas é um número. A primeira é uma <b>pergunta de volta</b>: quantos meses de histórico existem, e existe memória de massa por intervalo? A segunda é uma <b>lista</b> do que a resposta exigiria: doze meses de faturas consecutivas com refaturamentos preservados; a curva de carga por intervalo; o plano de produção e as expansões previstas; a leitura de reativo por janela; o contrato de uso vigente com a demanda contratada e as datas; e as tarifas homologadas da concessionária nos períodos analisados." },
      { kind: 'paragrafo', html: "Dita assim, a resposta não soa evasiva — soa competente, porque a lista é específica e demonstra que quem fala sabe exatamente o que precisa. E ela produz um efeito lateral que é o verdadeiro objetivo: transforma a conversa de negociação de preço em conversa de disponibilidade de dados, que é onde o trabalho realmente começa." },
      { kind: 'nota', tom: "neutro", label: "O diagnóstico negativo é o produto", html: "Existe uma classe de resultado que quase nenhum fornecedor do setor entrega, e ela é o ativo mais valioso de um analista independente: <b>o parecer de que está adequado</b>. Uma unidade cujo enquadramento corresponde ao perfil, cuja demanda contratada está bem dimensionada para o plano de produção, cujo fator de potência se mantém dentro da referência nas duas janelas e cujo volume não justifica mudança de ambiente nas condições vigentes é uma unidade sem achado. Dizer isso sem constrangimento, com a mesma fluência com que se aponta um erro, é o que torna o \"não está adequado\" digno de crédito quando ele aparece. Quem só sabe encontrar problema não tem como ser acreditado quando encontra um." },
      { kind: 'titulo', numero: "09.5", texto: "A ordem completa, para memorização" },
      { kind: 'lista', itens: ["Cadastro20 segundos Unidade, grupo, subgrupo, classe, modalidade, tensão de fornecimento. Critério de parada: modalidade incompatível com o subgrupo encerra a triagem e vira o achado principal.", "Período15 segundos Leitura anterior e atual, número de dias do ciclo, vencimento. Critério de parada: ciclo atípico invalida comparação direta com o mês anterior.", "Demanda40 segundos Contratada, medida e faturada, por posto quando aplicável. Presença de linha de ultrapassagem. Critério de parada: nenhum — este passo levanta hipótese, nunca conclui.", "Reativo20 segundos Presença de linhas de excedente. Critério de parada: ausência em todos os ciclos disponíveis elimina a hipótese tarifária, mas não a técnica.", "Distribuição por posto30 segundos Consumo em ponta contra total. Critério de parada: participação de ponta muito baixa torna projeto de deslocamento irrelevante.", "Bandeira e componentes financeiros25 segundos Cor aplicada, rateio de ciclo, ajustes e refaturamentos. Critério de parada: presença de ajuste relevante exige vinculá-lo ao período de origem antes de qualquer série.", "Reconciliação de uma linha60 segundos Escolher uma linha e conferir quantidade vezes tarifa contra o valor exibido. Critério de parada: se não fecha, investigar tributo por dentro, casas decimais e rateio antes de suspeitar de erro.", "Tributos30 segundos Bases e valores, e separação entre demanda tributável e não tributável. Critério de parada: ausência de separação em unidade com demanda medida inferior à contratada é ponto de verificação.", "Inventário do que falta40 segundos Listar explicitamente o que não está no documento e seria necessário. Critério de parada: nenhum — este passo sempre produz saída, e é ele que determina o veredito do roteador."] },
      { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "A ordem de leitura cronometrada é a especificação funcional operacional do <b>Conta de Luz Express</b>: é literalmente o roteiro que o analista executa ao receber o documento, e a estrutura de seções do relatório entregue em quarenta e oito horas espelha os nove passos. O roteador de diagnóstico é o que determina se o caso avança para o <b>Diagnóstico Energético</b> ou se encerra com o parecer de que não há alavanca material identificável com os dados disponíveis. Note que a segunda saída também é entrega — e é ela que constrói a reputação que faz a primeira ser aceita. E note a formulação que o relatório usa quando há alavanca identificada: <b>oportunidades potenciais de economia a serem validadas com dados completos</b>. Não é hesitação nem cautela jurídica — é a descrição literal do que uma fatura, sozinha, autoriza a afirmar." },
  ],
};

// ── DADO QUE VIVE NO <script>, NÃO NO MARKUP ─────────────────────────
// Onze das estruturas abaixo são populadas por JavaScript na fonte: o
// markup traz apenas o container vazio (`<div class="tr-grid" id="…">`).
// Extraídas literais e geradas por parse do literal JS — zero
// transcrição manual. Mesmo tratamento que `MODULO_06_TRAUMA_CICATRIZ`
// recebeu na Wave 29.
//
// Ficam aqui, e não no arquivo de calculadoras, porque são o DADO do
// módulo: alimentam tanto as opções de select dos instrumentos quanto o
// texto que a calculadora devolve. Fonte única, importada dos dois
// lados.
/** As três lentes do `Inst · 01`. */
export const MODULO_10_LENTES = {
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

/** As catorze famílias de componente da fatura, cada uma respondida pelas três lentes. */
export const MODULO_10_LINHAS_FATURA = [
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

/** Os cinco perfis de carga do `Inst · 02`. */
export const MODULO_10_PERFIS_CARGA = {
  "plana": "carga plana em turnos contínuos, com demanda de ponta próxima da demanda fora de ponta e fator de carga elevado",
  "diurna": "operação diurna com pico concentrado na tarde e redução parcial no fim do dia",
  "pontabaixa": "planta que reduz processos de forma controlada e confiável durante a janela de ponta",
  "erratica": "carga errática, com picos episódicos não previsíveis e baixo controle automático",
  "sazonal": "operação sazonal de safra, com meses de carga alta e meses de carga muito reduzida"
} as const;

/** Elegibilidade de modalidade por subgrupo. */
export const MODULO_10_ELEGIBILIDADE = {
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

/** Nome por subgrupo. */
export const MODULO_10_SUBGRUPOS = {
  "a4": "A4",
  "a3a": "A3a",
  "a3": "A3",
  "a2": "A2"
} as const;

/** A célula de comparação por linha × modalidade. */
export const MODULO_10_CELULAS_MODALIDADE = {
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

/** Os onze itens da linha de encargos do `Inst · 07`. */
export const MODULO_10_ENCARGOS = [
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

/** Os oito estágios do ciclo tarifário do `Inst · 08`. */
export const MODULO_10_ETAPAS_CICLO = [
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

/** Os seis blocos de composição do `Inst · 09`. */
export const MODULO_10_BLOCOS_FATURA = [
  "Energia",
  "Uso da rede",
  "Demanda",
  "Encargos",
  "Tributos",
  "Reativo e outros"
] as const;

/** Os cinco diagnósticos de viés do `Inst · 09`. */
export const MODULO_10_VIESES_COMPOSICAO = {
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

/** Os nove passos da ordem de leitura do `Inst · 10`. */
export const MODULO_10_PASSOS_LEITURA = [
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

/** As cinco classes de achado do `Inst · 11`. */
export const MODULO_10_ACHADOS = {
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

/** As faixas de diagnóstico dos quatro instrumentos numéricos. Cada
 *  entrada traz o teto da faixa e os quatro campos fixos que o original
 *  imprime — significado, causa provável, o que a empresa controla, e o
 *  que ainda falta saber. */
export const MODULO_10_FAIXAS_DEMANDA = [
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

export const MODULO_10_FAIXAS_ULTRAPASSAGEM = [
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

export const MODULO_10_FAIXAS_DESLOCAMENTO = [
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

export const MODULO_10_FAIXAS_REATIVO = [
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

/** 11 instrumentos: dez de aula e o `Inst · 01` do § MAP. */
export const INSTRUMENTOS_MODULO_10: Instrument[] = [
  {
    id: "m10-inst-01",
    kind: "explorador",
    title: "Mapa da fatura — três lentes sobre a mesma estrutura",
    formula: null,
    fields: [
      {
      id: "mf-seg",
      label: "Lente ativa",
      unit: null,
      kind: "select",
      defaultValue: "unit",
      options: [{ value: "unit", label: "Quem define o valor unitário" }, { value: "qtd", label: "Quem define a quantidade" }, { value: "ciclo", label: "Em que ciclo muda" }],
    },
      {
      id: "mf-linha",
      label: "Linha da fatura",
      unit: null,
      kind: "select",
      defaultValue: "te-p",
      options: [{ value: "te-p", label: "Consumo de energia — ponta" }, { value: "te-fp", label: "Consumo de energia — fora de ponta" }, { value: "tusd-e", label: "Uso do sistema — parcela sobre energia" }, { value: "tusd-d", label: "Uso do sistema — parcela sobre demanda" }, { value: "dem", label: "Demanda faturada" }, { value: "ultr", label: "Demanda de ultrapassagem" }, { value: "ere", label: "Energia reativa excedente" }, { value: "dre", label: "Demanda reativa excedente" }, { value: "band", label: "Adicional de bandeira" }, { value: "enc", label: "Encargos setoriais" }, { value: "trib-f", label: "Tributos federais" }, { value: "trib-e", label: "Imposto estadual" }, { value: "cip", label: "Contribuição de iluminação pública" }, { value: "fin", label: "Componentes financeiros e ajustes" }],
    },
    ],
    outputs: [
    ],
    note: "Escolha uma lente e depois uma linha da fatura. A lente muda a pergunta feita a todas as catorze linhas simultaneamente; a linha detalha a resposta. Uma fatura real pode agregar ou desdobrar essas famílias conforme o leiaute da distribuidora — o que não muda é a natureza de cada componente. Instrumento didático. A nomenclatura de cada linha varia por distribuidora; a legenda da própria fatura é a fonte de tradução. Componentes marcados como embutidos podem não aparecer como linha isolada.",
  },
  {
    id: "m10-inst-02",
    kind: "comparador",
    title: "Comparador de modalidades — diferença estrutural por linha",
    formula: null,
    fields: [
      {
      id: "cm-perf",
      label: "Perfil de carga",
      unit: null,
      kind: "select",
      defaultValue: "plana",
      options: [{ value: "plana", label: "Plana em turnos" }, { value: "diurna", label: "Diurna com pico na tarde" }, { value: "pontabaixa", label: "Desligada na ponta" }, { value: "erratica", label: "Errática com picos" }, { value: "sazonal", label: "Sazonal de safra" }],
    },
      {
      id: "cm-mod",
      label: "Modalidade avaliada",
      unit: null,
      kind: "select",
      defaultValue: "azul",
      options: [{ value: "azul", label: "Horária Azul" }, { value: "verde", label: "Horária Verde" }, { value: "conv", label: "Convencional Binômia" }],
    },
      {
      id: "cm-sg",
      label: "Subgrupo da unidade",
      unit: null,
      kind: "select",
      defaultValue: "a4",
      options: [{ value: "a4", label: "A4 · 2,3 a 25 kV" }, { value: "a3a", label: "A3a · 30 a 44 kV" }, { value: "a3", label: "A3 · 69 kV" }, { value: "a2", label: "A2 · 88 a 138 kV" }],
    },
    ],
    outputs: [
    ],
    note: "Escolha um perfil de carga e uma modalidade. O instrumento devolve, para cada linha da fatura, em que direção o resultado mudaria em relação à situação atual, o que ainda falta saber para concluir, e a elegibilidade do subgrupo. Ele não devolve valor de economia — e essa é uma decisão de projeto, não uma limitação: sem doze meses de medição e sem as tarifas homologadas da concessionária específica, qualquer número seria uma estimativa apresentada como resultado. Instrumento didático. As direções indicadas são estruturais e derivam da forma de cobrança de cada modalidade; a magnitude depende das tarifas homologadas da concessionária e do perfil medido real. Nenhuma saída deste instrumento deve ser apresentada a terceiro como conclusão financeira.",
  },
  {
    id: "m10-inst-03",
    kind: "dimensionador",
    title: "Dimensionador de demanda — faixas de diagnóstico",
    formula: null,
    fields: [
      {
      id: "dd-ctr",
      label: "Demanda contratada",
      unit: "kW",
      kind: "range",
      defaultValue: 1200.0,
      min: 10,
      max: 20000,
      step: 10,
    },
      {
      id: "dd-max",
      label: "Maior demanda medida na série",
      unit: "kW",
      kind: "range",
      defaultValue: 1010.0,
      min: 10,
      max: 20000,
      step: 10,
    },
      {
      id: "dd-med",
      label: "Demanda média do período",
      unit: "kW",
      kind: "range",
      defaultValue: 720.0,
      min: 1,
      max: 20000,
      step: 10,
    },
      {
      id: "dd-mes",
      label: "Meses de histórico disponíveis",
      unit: "meses",
      kind: "range",
      defaultValue: 12.0,
      min: 1,
      max: 36,
      step: 1,
    },
      {
      id: "dd-tol",
      label: "Tolerância de ultrapassagem",
      unit: "%",
      kind: "range",
      defaultValue: 5.0,
      min: 0,
      max: 20,
      step: 0.5,
    },
    ],
    outputs: [
      { id: "dd-util", label: "Utilização do contrato", unit: null },
      { id: "dd-fc", label: "Fator de carga aparente", unit: null },
      { id: "dd-lim", label: "Limite antes de ultrapassar", unit: null },
      { id: "dd-folga", label: "Folga até o limite", unit: null },
    ],
    note: "Informe o contrato vigente, a maior demanda medida na série e a demanda média do período. O instrumento devolve a utilização do contrato, a folga em relação ao limite de tolerância e um diagnóstico por faixa — incluindo a faixa em que a resposta correta é que não é possível concluir sem o plano de produção . Todos os parâmetros regulatórios são entrada editável. Instrumento didático. Utilização e fator de carga aqui são indicadores de triagem, não substituem a análise da memória de massa por intervalo. A tolerância vem preenchida com o valor de referência geral para demanda contratada de consumo do grupo A e deve ser confirmada no texto compilado vigente e no contrato de uso da unidade.",
  },
  {
    id: "m10-inst-04",
    kind: "simulador",
    title: "Simulador de ultrapassagem — todos os parâmetros editáveis",
    formula: null,
    fields: [
      {
      id: "ul-ctr",
      label: "Demanda contratada",
      unit: "kW",
      kind: "range",
      defaultValue: 1000.0,
      min: 10,
      max: 20000,
      step: 10,
    },
      {
      id: "ul-med",
      label: "Demanda medida no ciclo",
      unit: "kW",
      kind: "range",
      defaultValue: 1060.0,
      min: 10,
      max: 20000,
      step: 5,
    },
      {
      id: "ul-tol",
      label: "Tolerância aplicável",
      unit: "%",
      kind: "range",
      defaultValue: 5.0,
      min: 0,
      max: 20,
      step: 0.5,
    },
      {
      id: "ul-mul",
      label: "Multiplicador da tarifa",
      unit: "vezes",
      kind: "range",
      defaultValue: 2.0,
      min: 1,
      max: 4,
      step: 0.5,
    },
      {
      id: "ul-tar",
      label: "Tarifa de demanda da sua fatura",
      unit: "unidades por kW",
      kind: "range",
      defaultValue: 40.0,
      min: 1,
      max: 300,
      step: 1,
    },
    ],
    outputs: [
      { id: "ul-lim", label: "Limite de disparo", unit: null },
      { id: "ul-base", label: "Base da ultrapassagem", unit: null },
      { id: "ul-norm", label: "Parcela de demanda normal", unit: null },
      { id: "ul-pen", label: "Parcela de ultrapassagem", unit: null },
      { id: "ul-peso", label: "Peso da penalidade no total", unit: null },
    ],
    note: "Este instrumento existe para tornar visível a não linearidade da penalidade. Varie a demanda medida em torno do limite e observe o salto no momento em que o gatilho dispara. Tolerância, multiplicador e tarifa são entradas editáveis: preencha com os valores do contrato e do ato homologatório da concessionária da unidade. Instrumento didático. A tarifa é entrada editável em unidades monetárias genéricas por quilowatt, porque tarifa homologada é por distribuidora e por processo tarifário — não existe valor nacional. As saídas são aritmética da fórmula normativa aplicada aos valores informados, não estimativa de resultado.",
  },
  {
    id: "m10-inst-05",
    kind: "simulador",
    title: "Deslocador de carga entre postos — volume, nunca dinheiro",
    formula: null,
    fields: [
      {
      id: "dl-tot",
      label: "Consumo total do ciclo",
      unit: "MWh",
      kind: "range",
      defaultValue: 420.0,
      min: 1,
      max: 20000,
      step: 5,
    },
      {
      id: "dl-pta",
      label: "Consumo no posto de ponta",
      unit: "MWh",
      kind: "range",
      defaultValue: 42.0,
      min: 0,
      max: 20000,
      step: 1,
    },
      {
      id: "dl-des",
      label: "Fração da ponta tecnicamente deslocável",
      unit: "%",
      kind: "range",
      defaultValue: 30.0,
      min: 0,
      max: 100,
      step: 1,
    },
      {
      id: "dl-hrs",
      label: "Horas de ponta faturadas no ciclo",
      unit: "horas",
      kind: "range",
      defaultValue: 63.0,
      min: 1,
      max: 200,
      step: 1,
    },
    ],
    outputs: [
      { id: "dl-p0", label: "Participação da ponta hoje", unit: null },
      { id: "dl-p1", label: "Participação após deslocar", unit: null },
      { id: "dl-vol", label: "Volume deslocado", unit: null },
      { id: "dl-pot", label: "Potência média em ponta", unit: null },
    ],
    note: "Informe o consumo total do ciclo, quanto dele está no posto de ponta e qual fração desse consumo de ponta é tecnicamente deslocável. O instrumento devolve a participação da ponta antes e depois, o volume deslocado e o diagnóstico de qual classe de esforço o resultado exigiria. Não devolve valor economizado : esse número depende das tarifas homologadas da concessionária e da modalidade, e apresentá-lo aqui seria apresentar uma estimativa como resultado. Instrumento didático. As horas de ponta faturadas dependem do número de dias úteis do ciclo de leitura e dos feriados nacionais aplicáveis; o valor inicial supõe três horas diárias em vinte e um dias úteis e deve ser ajustado ao ciclo real da fatura.",
  },
  {
    id: "m10-inst-06",
    kind: "simulador",
    title: "Apurador de excedente reativo — limites e janelas editáveis",
    formula: null,
    fields: [
      {
      id: "fp-ref",
      label: "Fator de potência de referência",
      unit: "adimensional",
      kind: "range",
      defaultValue: 0.92,
      min: 0.5,
      max: 1,
      step: 0.01,
    },
      {
      id: "fp-ind",
      label: "Fator típico na janela diurna — indutivo",
      unit: "adimensional",
      kind: "range",
      defaultValue: 0.87,
      min: 0.3,
      max: 1,
      step: 0.01,
    },
      {
      id: "fp-cap",
      label: "Fator típico na janela noturna — capacitivo",
      unit: "adimensional",
      kind: "range",
      defaultValue: 0.95,
      min: 0.3,
      max: 1,
      step: 0.01,
    },
      {
      id: "fp-vd1",
      label: "Intervalos em violação — janela diurna",
      unit: "horas no ciclo",
      kind: "range",
      defaultValue: 180.0,
      min: 0,
      max: 600,
      step: 1,
    },
      {
      id: "fp-vn1",
      label: "Intervalos em violação — janela noturna",
      unit: "horas no ciclo",
      kind: "range",
      defaultValue: 0.0,
      min: 0,
      max: 200,
      step: 1,
    },
      {
      id: "fp-hrs",
      label: "Duração da janela noturna de apuração",
      unit: "horas por dia",
      kind: "range",
      defaultValue: 6.0,
      min: 1,
      max: 10,
      step: 1,
    },
    ],
    outputs: [
      { id: "fp-pd", label: "Violação na janela diurna", unit: null },
      { id: "fp-pn", label: "Violação na janela noturna", unit: null },
      { id: "fp-dd", label: "Distância da referência — diurna", unit: null },
      { id: "fp-dn", label: "Distância da referência — noturna", unit: null },
    ],
    note: "Informe o fator de potência típico observado em cada uma das duas janelas, quantos intervalos horários violaram a referência em cada uma, e o limite aplicável. O instrumento devolve a proporção de intervalos em violação, a classificação entre estrutural e pontual, e o que ainda falta para transformar o achado em projeto. A referência e o número de horas da janela noturna são entradas editáveis. Instrumento didático. Os campos de intervalos em violação supõem apuração horária e ciclo de aproximadamente trinta dias; ajuste às datas de leitura reais da fatura. A classificação entre estrutural e pontual é de triagem e não substitui a análise da memória de massa nem estudo de qualidade de energia.",
  },
  {
    id: "m10-inst-07",
    kind: "explorador",
    title: "Anatomia dos encargos — quem financia, quem paga, o que mudou",
    formula: null,
    fields: [
      {
      id: "en-sel",
      label: "Item de encargo",
      unit: null,
      kind: "select",
      defaultValue: "cde",
      options: [{ value: "cde", label: "Conta de desenvolvimento energético" }, { value: "ess", label: "Encargo de serviços do sistema" }, { value: "eer", label: "Encargo de energia de reserva" }, { value: "proinfa", label: "Programa de incentivo a fontes alternativas" }, { value: "ped", label: "Obrigação de pesquisa e desenvolvimento" }, { value: "ee", label: "Obrigação de eficiência energética" }, { value: "tfsee", label: "Taxa de fiscalização" }, { value: "tsee", label: "Tarifa social de energia elétrica" }, { value: "dsoc", label: "Desconto social" }, { value: "ecr", label: "Encargo de complemento de recursos" }, { value: "cip", label: "Contribuição de iluminação pública" }],
    },
    ],
    outputs: [
    ],
    note: "Onze itens da linha de encargos e obrigações setoriais. Para cada um, quatro campos fixos: o que financia, quem paga, como aparece na fatura, e o que mudou ou pode mudar por norma recente. Campo fixo permite leitura lateral — comparar o mesmo campo entre itens ensina mais do que ler um item inteiro. Instrumento didático. A denominação e a visibilidade de cada item variam por distribuidora e por leiaute de fatura; a desagregação precisa está na planilha tarifária do processo tarifário vigente da concessionária.",
  },
  {
    id: "m10-inst-08",
    kind: "quebra-cabeca",
    title: "Régua do ciclo tarifário — do processo à linha da fatura",
    formula: null,
    fields: [
      {
      id: "rc-sel",
      label: "Etapa em foco",
      unit: null,
      kind: "select",
      defaultValue: "e1",
      options: [{ value: "e1", label: "Abertura do processo" }, { value: "e2", label: "Apuração de custos" }, { value: "e3", label: "Definição da estrutura" }, { value: "e4", label: "Deliberação e homologação" }, { value: "e5", label: "Aplicação na fatura" }, { value: "e6", label: "Camada mensal de bandeira" }, { value: "e7", label: "Mudança por lei fora do ciclo" }, { value: "e8", label: "Reconciliação e decomposição" }],
    },
      {
      id: "rc-v-e1",
      label: "Etapa 1 — verificada",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "rc-v-e2",
      label: "Etapa 2 — verificada",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "rc-v-e3",
      label: "Etapa 3 — verificada",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "rc-v-e4",
      label: "Etapa 4 — verificada",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "rc-v-e5",
      label: "Etapa 5 — verificada",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "rc-v-e6",
      label: "Etapa 6 — verificada",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "rc-v-e7",
      label: "Etapa 7 — verificada",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "rc-v-e8",
      label: "Etapa 8 — verificada",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
    ],
    outputs: [
      { id: "rc-cnt", label: "Etapas verificadas", unit: null },
    ],
    note: "Oito etapas, do início do processo tarifário até o efeito na fatura da unidade. Para cada uma: o que acontece, quem decide, o que pode surpreender o consumidor industrial naquela etapa, e o que o analista deve arquivar. Marque as etapas já verificadas para a concessionária que estiver analisando. Instrumento didático. A cadência da revisão periódica é definida no contrato de concessão de cada distribuidora e varia; confirme no contrato e no calendário de processos tarifários publicado pela agência reguladora.",
  },
  {
    id: "m10-inst-09",
    kind: "comparador",
    title: "Reconstrutor de fatura — estime antes de ver",
    formula: null,
    fields: [
      {
      id: "rb-e1",
      label: "Sua estimativa — energia",
      unit: "% do total",
      kind: "range",
      defaultValue: 30.0,
      min: 0,
      max: 100,
      step: 1,
    },
      {
      id: "rb-e2",
      label: "Sua estimativa — uso da rede",
      unit: "% do total",
      kind: "range",
      defaultValue: 25.0,
      min: 0,
      max: 100,
      step: 1,
    },
      {
      id: "rb-e3",
      label: "Sua estimativa — demanda",
      unit: "% do total",
      kind: "range",
      defaultValue: 15.0,
      min: 0,
      max: 100,
      step: 1,
    },
      {
      id: "rb-e4",
      label: "Sua estimativa — encargos",
      unit: "% do total",
      kind: "range",
      defaultValue: 10.0,
      min: 0,
      max: 100,
      step: 1,
    },
      {
      id: "rb-e5",
      label: "Sua estimativa — tributos",
      unit: "% do total",
      kind: "range",
      defaultValue: 18.0,
      min: 0,
      max: 100,
      step: 1,
    },
      {
      id: "rb-e6",
      label: "Sua estimativa — reativo, bandeira e outros",
      unit: "% do total",
      kind: "range",
      defaultValue: 2.0,
      min: 0,
      max: 100,
      step: 1,
    },
      {
      id: "rb-r1",
      label: "Real — energia",
      unit: "% do total",
      kind: "range",
      defaultValue: 26.0,
      min: 0,
      max: 100,
      step: 1,
    },
      {
      id: "rb-r2",
      label: "Real — uso da rede",
      unit: "% do total",
      kind: "range",
      defaultValue: 22.0,
      min: 0,
      max: 100,
      step: 1,
    },
      {
      id: "rb-r3",
      label: "Real — demanda",
      unit: "% do total",
      kind: "range",
      defaultValue: 21.0,
      min: 0,
      max: 100,
      step: 1,
    },
      {
      id: "rb-r4",
      label: "Real — encargos",
      unit: "% do total",
      kind: "range",
      defaultValue: 9.0,
      min: 0,
      max: 100,
      step: 1,
    },
      {
      id: "rb-r5",
      label: "Real — tributos",
      unit: "% do total",
      kind: "range",
      defaultValue: 19.0,
      min: 0,
      max: 100,
      step: 1,
    },
      {
      id: "rb-r6",
      label: "Real — reativo, bandeira e outros",
      unit: "% do total",
      kind: "range",
      defaultValue: 3.0,
      min: 0,
      max: 100,
      step: 1,
    },
    ],
    outputs: [
      { id: "rb-se", label: "Soma da estimativa", unit: null },
      { id: "rb-sr", label: "Soma do real", unit: null },
      { id: "rb-err", label: "Erro absoluto total", unit: null },
    ],
    note: "Distribua cem pontos entre os seis blocos de uma fatura industrial cativa típica do grupo A. Depois informe a composição real da sua fatura nos mesmos seis blocos. O instrumento devolve o erro por bloco, a direção do viés e o diagnóstico do padrão — não uma nota. O objetivo é que o analista descubra a própria distorção antes de aplicá-la a uma conta de cliente. Instrumento didático. A composição real varia enormemente por concessionária, subgrupo, modalidade, fator de carga e estado — não existe composição típica nacional, e os valores iniciais servem apenas para que o instrumento abra funcionando. Preencha com a sua fatura.",
  },
  {
    id: "m10-inst-10",
    kind: "quebra-cabeca",
    title: "Ordem de leitura cronometrada — o instrumento assinatura",
    formula: null,
    fields: [
      {
      id: "ol-sel",
      label: "Passo em foco",
      unit: null,
      kind: "select",
      defaultValue: "p1",
      options: [{ value: "p1", label: "Cadastro" }, { value: "p2", label: "Período" }, { value: "p3", label: "Demanda" }, { value: "p4", label: "Reativo" }, { value: "p5", label: "Distribuição por posto" }, { value: "p6", label: "Bandeira e ajustes" }, { value: "p7", label: "Reconciliação de uma linha" }, { value: "p8", label: "Tributos" }, { value: "p9", label: "Inventário do que falta" }],
    },
      {
      id: "ol-f-p1",
      label: "Cadastro — executado",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "ol-f-p2",
      label: "Período — executado",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "ol-f-p3",
      label: "Demanda — executado",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "ol-f-p4",
      label: "Reativo — executado",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "ol-f-p5",
      label: "Distribuição por posto — executado",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "ol-f-p6",
      label: "Bandeira e ajustes — executado",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "ol-f-p7",
      label: "Reconciliação de uma linha — executado",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "ol-f-p8",
      label: "Tributos — executado",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
      {
      id: "ol-f-p9",
      label: "Inventário do que falta — executado",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }],
    },
    ],
    outputs: [
      { id: "ol-cnt", label: "Passos executados", unit: null },
      { id: "ol-tempo", label: "Tempo acumulado estimado", unit: null },
    ],
    note: "Percorra os nove passos na ordem. Marque cada um conforme executa. Para cada passo, o instrumento mostra o que olhar, o critério de parada, o achado que torna os demais irrelevantes e o que registrar. O contador acompanha o progresso e o painel indica em que estado a análise está. Instrumento didático. Os tempos são orientativos e supõem fatura em formato legível e legenda disponível. Faturas com leiaute atípico ou sem demonstrativo de tributos exigem tempo adicional e, frequentemente, solicitação de segunda via detalhada.",
  },
  {
    id: "m10-inst-11",
    kind: "quebra-cabeca",
    title: "Roteador de diagnóstico — três classes de veredito",
    formula: null,
    fields: [
      {
      id: "rt-hist",
      label: "Histórico disponível",
      unit: null,
      kind: "select",
      defaultValue: "uma",
      options: [{ value: "uma", label: "Uma fatura" }, { value: "seis", label: "Seis meses" }, { value: "doze", label: "Doze meses ou mais" }],
    },
      {
      id: "rt-mm",
      label: "Memória de massa por intervalo",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Indisponível" }, { value: "parcial", label: "Parcial" }, { value: "sim", label: "Disponível" }],
    },
      {
      id: "rt-plano",
      label: "Plano de produção declarado",
      unit: null,
      kind: "select",
      defaultValue: "nao",
      options: [{ value: "nao", label: "Não informado" }, { value: "estavel", label: "Estável, sem expansão" }, { value: "mudanca", label: "Mudança prevista" }],
    },
      {
      id: "rt-ach",
      label: "Achado observado na leitura",
      unit: null,
      kind: "select",
      defaultValue: "enq",
      options: [{ value: "enq", label: "Enquadramento suspeito" }, { value: "dem", label: "Demanda descolada" }, { value: "fp", label: "Excedente reativo presente" }, { value: "amb", label: "Volume compatível com ambiente livre" }, { value: "nada", label: "Nada fora do esperado" }],
    },
    ],
    outputs: [
    ],
    note: "Informe o que você tem em mãos e o que observou. O roteador devolve um de três vereditos — vale investigar , não vale nas condições informadas , ou não é possível concluir com o que foi informado — mais a lista específica do que falta. Percorra a varredura completa: a terceira saída é a mais frequente, e isso é característica do problema, não defeito do instrumento. Instrumento didático. O roteador organiza a decisão sobre investigar ou não investigar ; ele não substitui a análise e nunca devolve valor de economia. Percorra todas as combinações para verificar que as três classes de veredito são alcançáveis.",
  },
];

/** Os catorze exercícios do § Ex. TODOS soltos — a varredura por
 *  menção a aula no enunciado e no gabarito devolve zero, então o
 *  vínculo não foi inventado. */
export const MODULO_10_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: "ex-10-01",
    kind: 'discursiva',
    prompt: "01 · Uma unidade conectada em 13,8 kV pergunta quais modalidades pode avaliar. Responda e diga o que precisa confirmar.",
    points: 10,
    config: { gabarito: "Provavelmente o subgrupo de média tensão que abrange de 2,3 kV a 25 kV, com duas modalidades elegíveis — a horária de demanda separada por posto e a horária de demanda única. O que confirmar: o subgrupo declarado no cadastro da fatura, porque a faixa de tensão é indício e o cadastro é fato, e o contrato de uso, para saber a modalidade vigente e a data em que foi contratada." },
  },
  {
    id: "ex-10-02",
    kind: 'discursiva',
    prompt: "02 · A equipe adota das dezoito às vinte e uma como horário de ponta porque a filial em outro estado usa esse intervalo. Avalie.",
    points: 10,
    config: { gabarito: "Incorreto como premissa. O posto de ponta é definido por área de concessão e aprovado no processo de revisão tarifária da distribuidora local. Duas unidades do mesmo grupo em concessões diferentes podem ter janelas diferentes, e a janela pode ter mudado no último ciclo de revisão. A fonte é o ato homologatório da distribuidora que atende a unidade — e o erro produz simulação de deslocamento calculada sobre horas erradas." },
  },
  {
    id: "ex-10-03",
    kind: 'discursiva',
    prompt: "03 · Contrato de 800 kW, demanda medida de 838 kW, tolerância de cinco por cento. Dispara a parcela de ultrapassagem?",
    points: 10,
    config: { gabarito: "Não. O limite de disparo é 800 × 1,05 = 840 kW, e a medição ficou abaixo. Nenhuma parcela de ultrapassagem é gerada neste ciclo. Observação de análise: 838 contra um limite de 840 é folga de dois quilowatts — a unidade está operando na borda, e um único evento adicional dispara a cobrança. Isso é achado, ainda que não haja cobrança." },
  },
  {
    id: "ex-10-04",
    kind: 'discursiva',
    prompt: "04 · Mesmo contrato de 800 kW, agora com medição de 850 kW e multiplicador de duas vezes. Calcule a base e explique a armadilha.",
    points: 10,
    config: { gabarito: "O limite é 840 kW e a medição o superou, então o gatilho disparou. A base não é 850 − 840 = 10 kW; é 850 − 800 = <b>50 kW</b>, multiplicada pelo fator aplicável e pela tarifa de demanda. A armadilha é tratar a tolerância como franquia. Confirme o multiplicador vigente na norma e no contrato: há material em circulação reproduzindo redação anterior à consolidação de 2021." },
  },
  {
    id: "ex-10-05",
    kind: 'discursiva',
    prompt: "05 · Diagnóstico negativo. Unidade em média tensão, modalidade de demanda única, demanda contratada 1.000 kW, maior medida em doze meses 960 kW, sem ultrapassagem, sem excedente reativo, participação de ponta de doze por cento com processo contínuo. Emita o parecer.",
    points: 10,
    config: { gabarito: "O enquadramento está adequado ao perfil e a modalidade é elegível ao subgrupo. A utilização do contrato é de noventa e seis por cento, sem ultrapassagem em doze meses — o dimensionamento está ajustado, com folga compatível com um processo que tem partidas. Não há indício tarifário de problema de fator de potência. A participação de ponta é estruturalmente baixa e o processo é contínuo, o que torna deslocamento de carga irrelevante como alavanca. <b>Parecer: não há achado material com os dados disponíveis.</b> Recomendação: manter monitoramento de demanda com alarme, e reavaliar antes de qualquer expansão. Dizer isso sem procurar um problema que não existe é a resposta correta." },
  },
  {
    id: "ex-10-06",
    kind: 'discursiva',
    prompt: "06 · Dado faltante. Você recebe uma única fatura e o cliente pergunta se deve reduzir a demanda contratada. O que responde?",
    points: 10,
    config: { gabarito: "Que não é possível concluir, e a lista do que falta: doze meses de faturas consecutivas com refaturamentos preservados; memória de massa por intervalo; data, hora, duração e causa operacional de cada pico da série; plano de produção com expansões previstas; e o contrato de uso vigente com prazos de alteração. A fatura única mostra a folga do ciclo, que é indício de direção — não distingue folga estrutural de mês atípico, e em muitas operações o mês atípico é justamente o que define o contrato." },
  },
  {
    id: "ex-10-07",
    kind: 'discursiva',
    prompt: "07 · A fatura mostra excedente reativo apenas na madrugada, numa unidade que opera em turno diurno. Qual a hipótese principal?",
    points: 10,
    config: { gabarito: "Sobrecompensação capacitiva: banco de capacitores fixo permanecendo energizado quando a carga indutiva que ele compensava já foi desligada. A janela noturna de apuração verifica exatamente o excedente capacitivo. A recomendação errada e frequente é adicionar capacitores, o que agrava. O próximo passo é o perfil por intervalo e a verificação do regime de acionamento do banco existente — antes de qualquer compra." },
  },
  {
    id: "ex-10-08",
    kind: 'discursiva',
    prompt: "08 · Leitura de fatura. O custo total caiu cinco por cento, o consumo caiu quinze por cento e o custo por unidade de energia subiu. Houve piora de gestão?",
    points: 10,
    config: { gabarito: "Não é possível concluir. Custos de capacidade — demanda contratada e componentes aplicados à demanda — não caem com o consumo, e diluídos em menos energia elevam o indicador unitário. O indicador subiu por composição, não necessariamente por piora. A análise correta separa a variação em efeito preço e efeito quantidade, componente a componente, e verifica se houve reajuste ou mudança de bandeira no período." },
  },
  {
    id: "ex-10-09",
    kind: 'discursiva',
    prompt: "09 · Diagnóstico negativo. Uma proposta comercial afirma que a unidade economizaria migrando de modalidade porque a tarifa de demanda da outra modalidade é menor. Avalie o argumento.",
    points: 10,
    config: { gabarito: "O argumento é incompleto por construção. Comparar uma tarifa unitária entre modalidades ignora que as modalidades cobram sobre bases diferentes: uma separa demanda por posto e a outra não, e a diferenciação de energia por posto também muda. A comparação válida aplica o mesmo perfil medido às duas estruturas completas, mês a mês, incluindo ultrapassagem e reativo, e depois agrega. Uma tarifa isolada menor não prova custo total menor." },
  },
  {
    id: "ex-10-10",
    kind: 'discursiva',
    prompt: "10 · Dado faltante. Um contrato de energia no ambiente livre é oferecido por um preço por megawatt-hora bem abaixo do custo unitário da fatura cativa atual. O que falta para comparar?",
    points: 10,
    config: { gabarito: "Falta reconstruir o custo entregue dos dois lados. No lado livre: preço do contrato, perdas, tratamento do perfil, diferença entre contratado e medido liquidada, tarifa de uso e demanda que permanecem devidas, encargos aplicáveis, tributos, custo de representação e garantias. No lado cativo: tarifa aplicável, bandeira e tributos, sobre o mesmo consumo e a mesma demanda. Comparar preço de contrato com total cativo compara uma parte com o todo." },
  },
  {
    id: "ex-10-11",
    kind: 'discursiva',
    prompt: "11 · Leitura de fatura. A tarifa unitária exibida na fatura é maior que a da planilha tarifária da concessionária. É erro de cobrança?",
    points: 10,
    config: { gabarito: "Não necessariamente, e essa é a ordem de verificação: tributos compondo o valor exibido, quando a planilha é publicada sem eles; adicional de bandeira; período que atravessa data de reajuste, com rateio; casas decimais da tarifa, geralmente mais numerosas que as exibidas; e compensação de perdas de transformação quando a medição está do lado de baixa tensão de transformador do consumidor. Só depois de reconciliar esses fatores faz sentido classificar como possível erro." },
  },
  {
    id: "ex-10-12",
    kind: 'discursiva',
    prompt: "12 · Dado faltante. Um mês da série apresenta valor negativo em uma linha. Deve ser excluído?",
    points: 10,
    config: { gabarito: "Não. Valores negativos costumam ser compensações, devoluções ou componentes de refaturamento, e excluí-los apaga justamente o ajuste que explica a série. O correto é preservar a linha, vincular o ajuste ao período de origem e declarar a diferença entre competência e caixa na apresentação. Uma série \"limpa\" de ajustes é uma série que não reconcilia com o que o cliente efetivamente pagou." },
  },
  {
    id: "ex-10-13",
    kind: 'discursiva',
    prompt: "13 · Diagnóstico negativo. Duas plantas do mesmo grupo, mesmo consumo mensal, pagam valores diferentes por unidade de energia. O controller suspeita de erro. Avalie.",
    points: 10,
    config: { gabarito: "Há pelo menos cinco explicações estruturais antes de qualquer suspeita de erro: concessionárias diferentes com tarifas homologadas próprias; datas de aniversário tarifário diferentes, de modo que uma já reajustou e a outra não; níveis de tensão de conexão diferentes, com efeito sobre componentes de rede e, desde 2026, sobre o rateio da quota do encargo de desenvolvimento energético; legislação tributária estadual e municipal distinta; e perfis de demanda e fator de carga diferentes. A pergunta correta não é qual está errada, é qual das cinco explica a diferença." },
  },
  {
    id: "ex-10-14",
    kind: 'discursiva',
    prompt: "14 · Leitura de fatura. A unidade tem geração própria conectada e a fatura mostra duas linhas de demanda contratada. Explique.",
    points: 10,
    config: { gabarito: "Uma unidade com central geradora conectada pode ter simultaneamente contrato de demanda de <b>consumo</b> e contrato de demanda de <b>injeção</b>, com naturezas e tolerâncias de ultrapassagem distintas. Confundir as duas é fonte recorrente de cobrança mal compreendida e de contestação mal fundamentada. A leitura correta separa potência consumida internamente, potência importada da rede e potência injetada — e um gráfico de energia líquida mensal não mostra nenhum desses três fluxos." },
  },
];

export const MODULO_10_AULAS: CurriculumAula[] = [
  {
    id: "aula-10-01",
    moduleId: 'modulo-10',
    number: 1,
    totalInModule: 9,
    title: "Os quatro eixos de controle",
    subtitle: "Fundamento",
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
    id: "aula-10-02",
    moduleId: 'modulo-10',
    number: 2,
    totalInModule: 9,
    title: "Grupos, subgrupos e modalidades",
    subtitle: "Enquadramento",
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
    instruments: [INSTRUMENTOS_MODULO_10.find((i) => i.id === "m10-inst-02")!],
  },
  {
    id: "aula-10-03",
    moduleId: 'modulo-10',
    number: 3,
    totalInModule: 9,
    title: "Demanda contratada: o custo de errar para cada lado",
    subtitle: "Demanda",
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
    instruments: [INSTRUMENTOS_MODULO_10.find((i) => i.id === "m10-inst-03")!, INSTRUMENTOS_MODULO_10.find((i) => i.id === "m10-inst-04")!],
  },
  {
    id: "aula-10-04",
    moduleId: 'modulo-10',
    number: 4,
    totalInModule: 9,
    title: "Como a mesma energia custa diferente conforme a hora",
    subtitle: "Postos horários",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["tar-04-relogio-posto-ponta.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_10.find((i) => i.id === "m10-inst-05")!],
  },
  {
    id: "aula-10-05",
    moduleId: 'modulo-10',
    number: 5,
    totalInModule: 9,
    title: "Fator de potência e excedente reativo",
    subtitle: "Reativo",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["tar-07-banco-capacitores.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_10.find((i) => i.id === "m10-inst-06")!],
  },
  {
    id: "aula-10-06",
    moduleId: 'modulo-10',
    number: 6,
    totalInModule: 9,
    title: "Encargos setoriais, um a um",
    subtitle: "Encargos",
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
    instruments: [INSTRUMENTOS_MODULO_10.find((i) => i.id === "m10-inst-07")!],
  },
  {
    id: "aula-10-07",
    moduleId: 'modulo-10',
    number: 7,
    totalInModule: 9,
    title: "Tributos e a transição em curso",
    subtitle: "Tributos",
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
    id: "aula-10-08",
    moduleId: 'modulo-10',
    number: 8,
    totalInModule: 9,
    title: "O ciclo que produz o número",
    subtitle: "Ciclo",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["tar-08-bandeira-tarifaria.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_10.find((i) => i.id === "m10-inst-08")!, INSTRUMENTOS_MODULO_10.find((i) => i.id === "m10-inst-09")!],
  },
  {
    id: "aula-10-09",
    moduleId: 'modulo-10',
    number: 9,
    totalInModule: 9,
    title: "A ordem de leitura em cinco minutos",
    subtitle: "Síntese",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["tar-10-lupa-fatura.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_10.find((i) => i.id === "m10-inst-10")!, INSTRUMENTOS_MODULO_10.find((i) => i.id === "m10-inst-11")!],
  },
];

export const getAulaModulo10 = (id: string): CurriculumAula | null =>
  MODULO_10_AULAS.find((a) => a.id === id) ?? null;
