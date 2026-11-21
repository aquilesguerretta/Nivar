# Mapa de Domínio e Revisão Espaçada da Alexandria

**Status:** contrato normativo de produto

**Unidade central:** `competência × lente`

**Escopo:** regra pedagógica e semântica para implementação futura

**Fora de escopo:** schema, SQL, migration, endpoint, nome definitivo de evento, componente, tela ou algoritmo numérico

## 1. Finalidade e força normativa

Este documento define como a Alexandria interpreta evidência de aprendizagem, sintetiza o estado de uma competência em cada lente e prioriza a fila **Revisar hoje**. Ele formaliza a visão aprovada por Aquiles e ChatGPT e deve ser tratado como fonte de verdade para waves futuras de produto, conteúdo, dados e interface.

As palavras **DEVE**, **NÃO DEVE**, **PODE** e **RECOMENDA-SE** têm sentido normativo:

- **DEVE / NÃO DEVE:** decisão fechada;
- **PODE:** comportamento permitido, nunca promoção obrigatória;
- **RECOMENDA-SE:** padrão inicial sujeito a calibração explícita.

Este contrato é conceitual. Nomes de campos usados para explicar o modelo não prescrevem nomes de banco, API ou eventos. Uma implementação futura pode escolher estruturas técnicas diferentes, desde que preserve todas as distinções e invariantes aqui definidas.

### 1.1 Resultado exigido de qualquer implementação futura

Para toda mudança ou não mudança de estado, a implementação deve conseguir responder:

1. qual competência foi observada;
2. em qual lente;
3. qual evidência foi considerada;
4. qual assistência foi usada;
5. qual erro crítico apareceu ou foi resolvido;
6. por que o estado mudou ou permaneceu;
7. como ficaram estado, confiança e atualidade;
8. se e quando uma revisão foi criada;
9. o que a evidência não permite inferir.

Se uma dessas respostas exigir inventar uma regra ausente deste documento, a especificação ou a implementação ainda não está pronta.

### 1.2 Não objetivos desta wave

Esta wave não:

- altera a aplicação;
- cria persistência;
- substitui a Wave 11 de progresso;
- define contrato de API;
- define taxonomia final de eventos;
- calcula estado real de aluno;
- cria fila visível;
- muda perfil, badges, exercícios, instrumentos, Atlas, jogos ou módulos;
- converte parâmetros calibráveis em constantes permanentes.

## 2. Princípio central: competência demonstrada, não consumo

A Alexandria mede **competência demonstrada**. Consumo, frequência e recompensa podem descrever participação, mas não provam aprendizagem por si mesmos.

Os sinais abaixo são úteis, porém **NÃO DEVEM** promover diretamente uma competência a `competente` ou `dominado`:

- vídeo assistido;
- página ou apostila aberta;
- rolagem;
- tempo conectado;
- sequência diária;
- número bruto de respostas;
- XP;
- badge;
- conclusão de aula;
- declaração do aluno de que entendeu ou concluiu.

A interpretação deve distinguir cinco dimensões:

1. **Exposição:** o aluno encontrou o conteúdo.
2. **Desempenho:** o aluno executou uma ação observável.
3. **Retenção:** o aluno ainda executa depois de um intervalo significativo.
4. **Transferência:** o aluno aplica em situação nova.
5. **Atualidade factual:** o aluno conhece a versão vigente de fatos ou regras mutáveis.

`Dominado` exige desempenho consistente, retenção e transferência. Atualidade factual é acompanhada separadamente e não deve apagar domínio conceitual.

## 3. Vocabulário canônico

### 3.1 Conceito

Ideia, termo, relação ou objeto de conhecimento, como `demanda contratada`, `capacidade instalada`, `PLD`, `ANEEL` ou `fator de potência`.

Conhecer um conceito não implica saber agir com ele.

### 3.2 Competência

Capacidade observável formulada por verbo, objeto, contexto e padrão de qualidade.

Formato recomendado:

> O aluno consegue **[verbo] [objeto] em [contexto] sem [erro crítico] e com [padrão de evidência]**.

Exemplos:

- distinguir capacidade instalada de geração efetiva ao comparar fontes com universos e datas diferentes;
- diagnosticar se uma recomendação sobre demanda contratada é sustentada pelas evidências disponíveis;
- encaminhar um evento setorial à instituição, ao instrumento e à fonte primária corretos;
- avaliar uma proposta solar como cadeia de premissas técnicas, regulatórias, contratuais e financeiras.

Uma competência **NÃO DEVE** ser escrita apenas como tema (`demanda`, `matriz`, `ANEEL`) nem como consumo (`assistir à aula 3`).

### 3.3 Atividade

Experiência oferecida ao aluno: vídeo, leitura, exercício, instrumento, caso, jogo, exploração orientada no Atlas, avaliação ou revisão.

Atividade não é competência. Toda atividade que pretenda produzir evidência ativa **DEVE** declarar quais competências e lentes observa. Uma atividade pode observar várias competências, mas cada observação deve ser interpretável separadamente.

### 3.4 Evidência

Registro interpretável de uma ação observada. Evidência não é sinônimo de evento bruto: o evento informa que algo ocorreu; a evidência informa o que esse ocorrido permite concluir.

### 3.5 Estado

Síntese discreta da melhor interpretação atual sobre uma competência em uma lente:

1. `não explorado`;
2. `iniciado`;
3. `em aprendizado`;
4. `competente`;
5. `dominado`.

### 3.6 Confiança

Força do conjunto de evidências que sustenta o estado. A apresentação pública deve usar categorias compreensíveis:

- `fraca`;
- `moderada`;
- `forte`.

Uma implementação pode manter cálculo interno contínuo, mas **NÃO DEVE** apresentar precisão matemática fictícia nem usar confiança como substituto silencioso de estado.

### 3.7 Atualidade

Quão recente e aplicável ainda é a evidência ou o conhecimento factual. Atualidade inclui duas perguntas distintas:

- a retenção precisa ser verificada novamente?
- fatos, regras, tarifas, titulares ou parâmetros mudaram desde a evidência?

Exemplo válido:

```text
Estado: dominado
Confiança: moderada
Retenção: revisão vencida
Atualidade factual: atualização necessária
```

### 3.8 Erro crítico

Erro que destrói a validade da conclusão ou revela a confusão central da competência. Não é qualquer imprecisão ou erro aritmético.

### 3.9 Sessão ou contexto independente

Separação suficiente para que duas demonstrações não sejam apenas repetição imediata da mesma solução. A janela exata é calibrável, mas a independência **DEVE** considerar pelo menos tempo, tarefa, dados, formato ou contexto. Refazer a mesma pergunta após ver o gabarito não cria uma segunda demonstração independente.

## 4. Unidade obrigatória: `competência × lente`

A Alexandria **NÃO DEVE** armazenar ou apresentar apenas um “domínio da competência” global. A unidade mínima de interpretação é a combinação entre competência canônica e lente:

```text
competência
├── Explorador
├── Analista
└── Especialista
```

Exemplo válido:

```text
Distinguir demanda de consumo
├── Explorador: dominado
├── Analista: competente
└── Especialista: em aprendizado
```

Os três estados podem divergir sem inconsistência. Eles representam padrões de desempenho diferentes.

### 4.1 O que é compartilhado entre lentes

- identidade da competência canônica;
- conceito central;
- contexto geral;
- relação com pré-requisitos;
- fonte;
- lógica da resposta;
- erro central;
- identidade do módulo.

### 4.2 O que pode variar entre lentes

- complexidade dos dados;
- quantidade de variáveis;
- ambiguidade;
- necessidade de cálculo;
- ferramentas permitidas;
- assistência aceita;
- exigência de justificativa;
- presença de exceções;
- novidade do contexto;
- rubrica e padrão de qualidade.

### 4.3 Ausência de promoção automática entre lentes

Uma atividade de Especialista pode produzir evidência também para Analista ou Explorador, mas o rótulo da atividade **NÃO** promove lentes inferiores automaticamente.

Evidência de lente superior só pode contar para outra lente quando:

- o observable da outra lente está explícito na rubrica;
- o aluno realmente o demonstrou;
- a assistência não invalida a inferência;
- a observação é registrada e justificada separadamente.

Exemplo: reconciliar BEN, ONS e ANEEL pode demonstrar também a distinção entre capacidade e geração. Isso conta para Explorador apenas se essa distinção foi observada, não porque a atividade se chamava “Especialista”.

## 5. Padrão das três lentes

### 5.1 Explorador

Observa se o aluno consegue:

- reconhecer;
- distinguir;
- classificar;
- explicar causa e efeito;
- evitar o erro central;
- comunicar em linguagem simples.

Explorador é essencial e intuitivo, não infantil.

Exemplos:

- M8: distinguir gráfico de capacidade instalada de gráfico de geração e explicar por que as composições diferem;
- M10: distinguir kW de kWh e explicar por que uma fábrica paga demanda além de consumo.

### 5.2 Analista

Observa se o aluno consegue:

- aplicar;
- calcular;
- comparar;
- normalizar;
- executar procedimento;
- interpretar resultado;
- justificar com evidência;
- reconhecer limitações e dados faltantes.

Exemplos:

- M8: reconciliar fontes identificando unidade, universo, período, MMGD, potência de fim de ano e geração anual;
- M10: avaliar hipótese de otimização usando histórico de demanda, modalidade e postos tarifários, declarando o que falta.

### 5.3 Especialista

Observa se o aluno consegue:

- diagnosticar;
- questionar premissas;
- tratar exceções;
- usar fonte primária;
- identificar fronteiras metodológicas;
- modelar cenários;
- defender decisão sob incerteza;
- explicar por que conclusão plausível pode ser inválida.

Exemplos:

- M8: explicar por que dados operativos do ONS, fechamento contábil da EPE, outorgas da ANEEL e cenários do PDE não podem ser somados sem tratamento;
- M10: defender a não recomendação de reduzir demanda quando faltam curva de carga, histórico suficiente ou dados de reativo.

## 6. Contrato conceitual de evidência

Uma evidência ativa **DEVE** tornar recuperáveis, conceitualmente, os itens abaixo. A forma técnica é decisão futura.

| Dimensão | Pergunta que deve ser respondida |
|---|---|
| Competência | Qual capacidade observável foi medida? |
| Lente | Qual padrão de profundidade foi exigido? |
| Atividade e tarefa | O que o aluno efetivamente fez? |
| Modalidade | Reconheceu, calculou, explicou, operou, diagnosticou, defendeu etc.? |
| Dificuldade | Qual complexidade e quais restrições existiam? |
| Contexto | Em qual caso, fonte, setor, documento ou cenário? |
| Assistência | Foi independente, apoio leve, guiado ou revelado? |
| Resultado | O que foi correto, parcial ou incorreto? |
| Justificativa | A conclusão e o raciocínio foram coerentes? |
| Erro crítico | Houve algum; qual; está resolvido? |
| Novidade | O caso era familiar, variado ou novo? |
| Independência | A demonstração é separada de quais tentativas anteriores? |
| Tempo | Quando ocorreu e qual intervalo a separa de ensino ou tentativa anterior? |
| Atualidade factual | Quais fontes, datas-base ou versões normativas sustentavam a tarefa? |

Sem competência, lente e rubrica explícitas, uma ação pode permanecer como evento de atividade, mas **NÃO DEVE** ser promovida silenciosamente a evidência de competência.

### 6.1 Famílias de evidência

#### Exposição

Exemplos: assistir vídeo, ler apostila, abrir glossário, navegar livremente no Atlas, iniciar instrumento.

- pode mover `não explorado` para `iniciado`;
- não promove diretamente a `competente` ou `dominado`.

#### Desempenho

Exemplos: responder, classificar, calcular, ordenar, comparar, explicar, operar instrumento, construir relatório ou justificar decisão.

- pode sustentar `em aprendizado`;
- pode sustentar `competente` quando o conjunto for diverso, independente e consistente.

#### Retenção

Demonstração após intervalo significativo, sem repetição imediata da solução ensinada.

A verificação deve variar pelo menos um elemento relevante:

- pergunta;
- ordem;
- dados;
- formato;
- contexto parcialmente novo.

#### Transferência

Aplicação em caso não usado para ensinar. Novidade pode vir de setor, fonte, conflito, documento incompleto, restrição, objetivo ou necessidade de defender uma decisão — não apenas de números diferentes.

Transferência é requisito de `dominado`.

#### Atualidade factual

Aplica-se a conteúdo mutável, como tarifas, regras, titulares, políticas, dados anuais, parâmetros regulatórios, projetos ou preços.

Atualização vencida **NÃO DEVE** apagar domínio conceitual. Ela reabre a atualidade factual e pode gerar microcompetência ou revisão de atualização.

## 7. Assistência

Toda evidência ativa deve registrar um nível conceitual de assistência.

| Nível | Definição | Efeito máximo permitido |
|---|---|---|
| A — Independente | Sem dica relevante | Pode sustentar qualquer estado |
| B — Apoio leve | Glossário, fórmula lembrada, pista de navegação ou definição curta | Pode sustentar aprendizagem e competência se a tarefa principal continuar com o aluno |
| C — Guiado | Passos sugeridos, eliminação de alternativas ou feedback durante a solução | Sustenta `em aprendizado`; não sustenta `dominado` |
| D — Revelado | Resposta, solução ou sequência decisória essencial foi mostrada | Conta como exposição ou remediação; não promove competência |

A rubrica deve distinguir:

- consulta profissional legítima à fonte;
- dica pedagógica;
- revelação da resposta.

Consultar uma resolução, base oficial ou contrato que faria parte da prática profissional não é, por si só, assistência invalidante. A evidência deve declarar se a competência exigia localizar, selecionar, interpretar ou memorizar a fonte.

## 8. Erro crítico

### 8.1 Definição e exemplos

Erro crítico invalida a conclusão ou revela confusão central.

- M7: atribuir ao ONS a competência de fixar tarifa de distribuição;
- M8: misturar capacidade instalada com geração anual ou matriz energética com matriz elétrica;
- M10: recomendar redução de demanda contratada sem histórico suficiente, ou confundir kWh com kW;
- M11: aceitar payback solar sem verificar geração, tarifa evitada, autoconsumo, degradação, conexão e contrato.

### 8.2 Efeito normativo

Um erro crítico:

- bloqueia promoção enquanto não estiver resolvido;
- gera revisão prioritária P0;
- deve aparecer no debriefing;
- exige nova evidência independente;
- não apaga todo o histórico por um deslize isolado quando já existe evidência forte anterior.

“Resolvido” significa que uma nova evidência válida demonstra a correção da confusão. Rever explicação, abrir gabarito ou declarar que entendeu não resolve o erro sozinho.

## 9. Os cinco estados e suas transições

Estado é síntese do conjunto de evidências válido, não contagem de pontos. Uma nova evidência pode mudar a síntese apenas até onde o conjunto completo permite.

### 9.1 Não explorado

**Definição:** não há interação significativa com a competência naquela lente.

Não contam como interação significativa:

- impressão acidental;
- rolagem sem interação;
- abertura por poucos segundos;
- evento sem competência mapeada.

**Saída permitida:** exposição significativa ou primeira tentativa ativa.

### 9.2 Iniciado

**Definição:** o aluno começou a trabalhar a competência, mas ainda não produziu evidência ativa suficiente.

Entradas típicas:

- vídeo ou leitura relevante;
- primeiro uso de instrumento;
- primeira tentativa;
- primeira exploração orientada no Atlas.

Não bastam sozinhos para avançar:

- concluir vídeo;
- marcar “entendi”;
- abrir todas as seções;
- permanecer tempo na página.

**Saída permitida:** primeira evidência ativa que permita observar entendimento ou erro.

### 9.3 Em aprendizado

**Definição:** existe evidência ativa, mas ela é limitada, assistida, inconsistente ou contém lacunas.

Entradas típicas:

- primeira resposta;
- cálculo parcialmente correto;
- explicação correta com ajuda;
- instrumento executado com erro;
- diagnóstico correto sem justificativa;
- bom desempenho em um único formato.

Permanece `em aprendizado` quando:

- existe erro crítico não resolvido;
- há apenas um acerto;
- toda evidência depende de resposta revelada;
- o aluno repete caso idêntico;
- não explica o resultado;
- depende de assistência guiada.

**Saída para competente:** demonstrações independentes, diversas e coerentes que cumpram a política mínima abaixo.

### 9.4 Competente

**Definição:** o aluno executa a competência de forma consistente no padrão da lente, sem erro crítico e com justificativa adequada.

Política mínima aprovada:

- pelo menos duas demonstrações qualificadas em sessões ou contextos independentes;
- duas modalidades de evidência quando a competência permitir;
- pelo menos uma aplicação, não apenas reconhecimento;
- ausência de erro crítico não resolvido;
- assistência compatível com a lente e com a rubrica;
- consistência entre resultado e justificativa.

Um único acerto **NUNCA** basta. A quantidade exata acima do mínimo e a janela de independência são calibráveis.

`Competente` ainda não exige:

- retenção de longo prazo;
- transferência forte para contexto radicalmente novo;
- tratamento de todas as exceções.

### 9.5 Dominado

**Definição:** o aluno demonstra competência estável, retida e transferível naquela lente.

Requisitos:

- `competente` sustentado;
- evidência de retenção após intervalo;
- evidência de transferência em contexto novo;
- ausência de erro crítico não resolvido;
- pelo menos duas sessões independentes;
- explicação ou defesa coerente.

Retenção e transferência precisam estar presentes no conjunto. Um único jogo pode gerar transferência, mas não prova retenção futura sozinho.

Combinações válidas incluem:

- jogo + revisão posterior;
- avaliação + novo caso;
- instrumento + desafio oral posterior.

## 10. Matriz de decisão de promoção

| Estado sustentado | Evidência mínima que o conjunto deve conter | Bloqueadores principais |
|---|---|---|
| Não explorado | Nenhuma interação significativa | — |
| Iniciado | Exposição significativa ou primeira tentativa | Evento acidental ou sem mapeamento |
| Em aprendizado | Primeira evidência ativa observável | Evidência apenas revelada não promove além de remediação |
| Competente | Duas demonstrações qualificadas independentes, diversidade quando aplicável, ao menos uma aplicação, justificativa coerente | Acerto isolado, erro crítico, repetição idêntica, assistência incompatível |
| Dominado | Competência sustentada + retenção + transferência + defesa coerente | Falta de retenção, falta de novidade, erro crítico, jogo isolado |

A implementação **NÃO DEVE** transformar essa matriz em simples soma de pontos. Evidências precisam satisfazer funções diferentes; dez exposições não substituem uma aplicação, e dez repetições imediatas não substituem retenção.

## 11. Estado, confiança e atualidade são eixos separados

### 11.1 Invariantes

- estado não é confiança;
- confiança não é atualidade;
- atualidade factual não é retenção;
- tempo sozinho não rebaixa estado;
- baixa atualidade pode criar revisão sem regressão;
- estado alto pode coexistir com confiança moderada ou revisão vencida.

### 11.2 Interpretação da confiança

Sem prescrever pesos, a confiança deve refletir:

- quantidade de evidências qualificadas;
- independência;
- diversidade de modalidade e contexto;
- consistência;
- assistência;
- recência relevante;
- contradições posteriores.

Categorias públicas:

- **fraca:** evidência escassa, assistida, pouco diversa ou contradita;
- **moderada:** evidência suficiente para o estado, mas com diversidade, recência ou consistência ainda limitada;
- **forte:** conjunto independente, diverso, coerente e sem contradição relevante.

Essas descrições orientam explicação, não criam limiares numéricos fechados.

### 11.3 Tempo sem prática

Tempo sem prática:

- reduz atualidade e pode reduzir confiança;
- cria revisão;
- **NÃO** rebaixa estado sozinho.

### 11.4 Conteúdo atualizado

Quando regra ou fato muda:

- domínio conceitual permanece;
- atualidade factual é reaberta;
- pode ser criada microcompetência de atualização;
- o aluno não volta a ser tratado como se nunca tivesse aprendido.

## 12. Regressão real

Regressão é revisão da síntese diante de evidência contraditória suficiente, não punição por tempo ou por uma falha isolada.

Pode ocorrer quando:

- erro crítico se repete;
- falhas independentes contradizem o estado;
- o aluno não consegue mais executar a competência;
- transferência falha em mais de um contexto;
- evidência antiga dependia de mapeamento incorreto.

Uma falha isolada **NÃO DEVE** rebaixar automaticamente. Ela deve atualizar confiança, gerar revisão quando cabível e aguardar evidência independente antes de concluir regressão.

Toda regressão deve registrar:

- evidências anteriores que sustentavam o estado;
- novas evidências contraditórias;
- por que a contradição é suficiente;
- erro crítico envolvido, se houver;
- estado e confiança resultantes;
- revisão criada.

## 13. O que cada superfície pode provar

| Superfície | Pode produzir | Não prova sozinha |
|---|---|---|
| Vídeo | Exposição e pontos de atenção | Competência ou domínio |
| Apostila | Exposição, consulta e leitura orientada | Competência sem ação |
| Glossário | Reconhecimento e discriminação simples | Aplicação ampla |
| Exercício formativo | Desempenho, raciocínio e erro | Domínio por um item |
| Instrumento | Aplicação e procedimento | Transferência ampla sem caso novo |
| Avaliação de domínio | Competência | Retenção futura |
| Avaliação de transferência | Transferência | Retenção futura |
| Caso cumulativo | Integração | Domínio de tudo sem rubrica por competência |
| Jogo | Decisão, adaptação e transferência | Retenção futura sozinho |
| Desafio oral | Explicação e defesa | Cálculo ou procedimento não observado |
| Revisão espaçada | Retenção | Transferência sem novidade |
| Atlas | Comparação e investigação orientada | Nada quando há apenas navegação livre |

Uma superfície nunca herda poder probatório por nome. Um “quiz de domínio” sem rubrica, diversidade e independência continua limitado ao que de fato observou.

## 14. Fila `Revisar hoje`

### 14.1 Finalidade

`Revisar hoje` é uma agenda pedagógica priorizada. Não é lista cronológica de tudo que venceu, histórico completo de erros nem repetição automática da última pergunta.

Cada item deve apontar para uma necessidade observável em uma unidade `competência × lente` e para uma próxima ação adequada.

### 14.2 Classes de prioridade

#### P0 — Corrigir agora

- erro crítico;
- pré-requisito bloqueando a aula atual;
- repetição do mesmo erro;
- conclusão inválida perigosa.

#### P1 — Revisar hoje

- falha de transferência;
- retenção vencida de competência importante;
- instrumento com resultado fraco;
- conflito entre bom quiz e má aplicação;
- retorno após ausência longa.

#### P2 — Revisar em breve

- confiança baixa;
- atividade abandonada;
- competência iniciada sem progresso;
- dificuldade declarada;
- item manual.

#### P3 — Enriquecimento

- aprofundamento;
- sugestão de lente superior;
- revisão opcional;
- curiosidade marcada.

P0 a P3 são classes, não pontos. Pesos e desempates internos são calibráveis, mas uma implementação **NÃO DEVE** diluir P0 numa média numérica que permita ao enriquecimento ultrapassá-lo.

### 14.3 Informações mínimas de um item

Sem fixar schema, um item precisa permitir recuperar:

- competência;
- lente;
- prioridade e motivo;
- padrão de erro ou lacuna;
- exemplos relevantes;
- última ocorrência;
- evidência que o originou;
- pré-requisito ou aula atual afetada, quando houver;
- próxima forma de revisão;
- nível de assistência recomendado;
- condição de resolução;
- atualidade factual envolvida, quando houver.

### 14.4 Geração de candidatos

Um candidato pode nascer de:

- erro crítico;
- falha de desempenho, retenção ou transferência;
- confiança baixa;
- vencimento de retenção;
- atualização factual;
- atividade abandonada;
- dificuldade declarada;
- dependência da sessão atual;
- marcação manual;
- sugestão de enriquecimento.

O gatilho deve ser explicável. “O algoritmo escolheu” não é debriefing suficiente.

### 14.5 Deduplicação e consolidação

Vários sinais sobre a mesma unidade `competência × lente` devem gerar um item consolidado, com padrão, exemplos, última ocorrência e próxima revisão. No bloco principal, deve existir no máximo um item por competência, salvo erro crítico que justifique tratamento separado.

Consolidar não significa apagar histórico. O item resume a necessidade atual; as evidências de origem permanecem rastreáveis.

### 14.6 Ordenação

A ordenação deve respeitar, nesta sequência conceitual:

1. classe de prioridade;
2. pré-requisitos da sessão atual;
3. importância da competência;
4. repetição ou gravidade do padrão;
5. vencimento de retenção ou atualidade;
6. diversidade necessária para evitar repetição do mesmo formato.

A fórmula, pesos e desempates exatos são calibráveis.

### 14.7 Limite diário inicial

Padrão recomendado:

- 6 itens essenciais;
- até 4 itens opcionais;
- no máximo um item por competência no bloco principal, salvo erro crítico;
- prioridade para pré-requisitos da sessão atual.

Esses números são calibráveis e não devem virar regra imutável sem validação.

### 14.8 Escada de revisão

A forma recomendada avança por:

1. recuperação curta;
2. discriminação entre conceitos;
3. aplicação;
4. transferência.

O sistema **NÃO DEVE** repetir indefinidamente a mesma pergunta. A revisão seguinte deve responder ao erro observado e variar formato, dados ou contexto.

### 14.9 Revisão bem-sucedida

Uma revisão bem-sucedida:

- resolve o item atual quando a condição de resolução foi demonstrada;
- atualiza confiança;
- agenda retenção futura quando necessário;
- registra assistência e erro resolvido;
- não promove além do que a evidência permite.

### 14.10 Revisão falhada

Uma revisão falhada:

- mantém ou eleva prioridade;
- muda o formato;
- reduz assistência gradualmente quando possível;
- encaminha à seção exata, não ao módulo inteiro;
- após falhas repetidas, sugere lente mais adequada sem forçar troca;
- não rebaixa automaticamente por uma única falha.

## 15. Progresso apresentado ao aluno

A interface futura **NÃO DEVE** colapsar progresso num percentual único. Deve separar:

- **cobertura:** quanto foi explorado;
- **competência:** quantas competências atingiram `competente`;
- **domínio:** quantas têm retenção e transferência;
- **revisão:** o que precisa de atenção;
- **lentes:** estado em cada profundidade;
- **atualidade:** retenção ou fatos que precisam ser renovados.

Exemplo:

```text
Módulo 8
Cobertura: completa
Explorador: 8/9 dominadas
Analista: 6/9 competentes
Especialista: 2/9 em aprendizado
Revisar hoje: universo do BEN; potência de fim de ano
```

Percentuais de cobertura podem existir, desde que não sejam rotulados como domínio. XP, streak e badges podem motivar, mas não alteram estado diretamente.

## 16. Exemplos completos sustentados pelo corpus

Os exemplos abaixo aplicam a regra aprovada a atividades reais dos módulos. Eles não declaram que o produto já calcula esses estados.

### 16.1 M7 — encaminhar evento à instituição, ao instrumento e à fonte corretos

**Competência canônica:** o aluno consegue encaminhar um evento setorial à instituição e ao instrumento corretos, identificar o próximo passo e localizar a fonte primária, sem atribuir competência a órgão errado.

**Explorador:** distingue as funções centrais de MME/CNPE, EPE, ANEEL, ONS, CCEE, CMSE e CADE e explica por que não formam cadeia simples de comando.

**Analista:** diante de ato ou evento, identifica quem decidiu, sob qual instrumento, quem é atingido, quando produz efeito e o próximo passo procedimental.

**Especialista:** trata casos híbridos, separa físico, regulatório, concorrencial e financeiro, usa fonte primária e defende o roteamento sob ambiguidade.

Trajetória ilustrativa:

1. assistir ou ler a tese institucional → `iniciado` por exposição;
2. responder uma pergunta-relâmpago distinguindo ONS, ANEEL e CCEE → `em aprendizado`;
3. resolver caso de corte eólico explicando que o ONS determina o físico, a ANEEL regula o tratamento e a CCEE apura o efeito → evidência de aplicação;
4. localizar sem tutorial tarifa homologada e série de geração nos portais corretos → segunda modalidade de evidência;
5. em contexto independente, rotear portaria de migração e explicar os atos seguintes → pode sustentar `competente`;
6. após intervalo, tratar uma fusão com trilhos concorrencial, setorial e societário, defendendo fontes e limites → retenção e transferência podem sustentar `dominado`.

Erro crítico: atribuir ao ONS a fixação de tarifa ou consequência financeira. O quiz 8/10 do módulo é sinal útil, mas não substitui sozinho os componentes oral e operacional declarados pelo próprio corpus.

### 16.2 M8 — capacidade instalada, geração e recorte

**Competência canônica:** o aluno consegue distinguir capacidade instalada de geração efetiva e reconciliar fontes declarando grandeza, universo, data-base e método, sem misturar matriz elétrica e energética.

**Explorador:** reconhece GW como estoque de potência e TWh como fluxo de energia; explica por que as duas pizzas têm composição diferente.

**Analista:** calcula fator de capacidade com denominador temporal compatível e qualifica divergência entre fontes por unidade, universo e data.

**Especialista:** reconcilia BEN/EPE, ONS, ANEEL e PDE sem somar universos incompatíveis, identifica quebra metodológica e escreve nota de método.

Trajetória ilustrativa:

1. assistir ao vídeo ou ler a tese → `iniciado`;
2. classificar corretamente dois gráficos → `em aprendizado`, evidência de reconhecimento;
3. explicar por que solar pode ter participação maior em capacidade do que em geração → desempenho causal, ainda `em aprendizado` se isolado;
4. calcular fator de capacidade e apontar que potência de 31 de dezembro pode inflar o denominador anual → aplicação de Analista;
5. em outra atividade, receber 25% de solar num relatório e 11% noutro e verificar GW/TWh, universo e ano-base antes de chamar uma fonte de errada → segunda evidência independente; pode sustentar `competente`;
6. uma semana depois, reconciliar fontes com geração distribuída, centralizada, autoprodução e bases de planejamento distintas, registrando nota metodológica → retenção + transferência; pode sustentar `dominado`.

Erro crítico: afirmar que uma matriz é “88% renovável” sem perguntar elétrica ou energética, capacidade ou geração, ano e universo. Atualizar a edição anual reabre atualidade factual, não domínio da distinção.

### 16.3 M10 — demanda contratada e suficiência de evidência

**Competência canônica:** o aluno consegue avaliar recomendação sobre demanda contratada usando histórico, modalidade, postos, picos e contexto operacional, sem confundir potência com energia nem recomendar com dados insuficientes.

**Explorador:** distingue kW de kWh e explica demanda como reserva de capacidade para o pico.

**Analista:** lê demanda contratada, medida e faturável, avalia série de ao menos doze meses como padrão inicial e declara dados faltantes antes de dimensionar.

**Especialista:** defende uma não recomendação sob pressão por economia, modela fronteira custo-risco e explica cada pico com produção, contrato e memória de massa.

Trajetória ilustrativa:

1. vídeo e apostila → `iniciado`;
2. exercício confunde kWh com kW → `em aprendizado`, erro crítico e P0;
3. revisão discrimina consumo, demanda média e demanda máxima → resolve a confusão, mas permanece `em aprendizado`;
4. instrumento usa doze meses e identifica que falta memória de massa ou plano de produção → aplicação válida;
5. em exercício independente, recebe uma única fatura e recusa recomendar redução, listando histórico, curva por intervalo, causa dos picos, plano de produção e contrato → pode sustentar `competente` quando combinado com outra demonstração;
6. em caso novo, a diretoria exige economia, mas o aluno defende a não redução sem dados e explica o risco de ultrapassagem → transferência;
7. revisão posterior com outra série confirma retenção → pode sustentar `dominado`.

Erro crítico: reduzir demanda com base em uma fatura isolada. O próprio módulo declara que uma fatura mostra indício, não distingue folga estrutural de mês atípico.

### 16.4 M11 — proposta solar

**Competência canônica:** o aluno consegue avaliar proposta solar como cadeia de premissas técnicas, regulatórias, contratuais e financeiras.

Aceitar payback sem verificar geração estimada, tarifa evitada, autoconsumo, degradação, conexão e contrato é erro crítico. Um simulador de payback pode produzir aplicação, mas só um caso novo com documentação incompleta pode produzir transferência; retenção exige verificação posterior.

## 17. Relação com o repositório atual

Esta seção registra precedentes e lacunas confirmados. Ela não redefine a norma aprovada.

### 17.1 Wave 11 de progresso

O backend atual confirma:

- `progress_event` é log imutável e fonte de verdade;
- status de aula, badges e streak são caches derivados;
- existem fatos de aula iniciada/concluída, instrumento usado, exercício respondido e badge conquistado;
- instrumento usado e exercício respondido são hoje eventos apenas de log;
- o backend trata o identificador da entidade como opaco e não conhece a estrutura curricular;
- o `metadata` flexível preserva espaço para evolução;
- competência e lente foram explicitamente deixadas fora do escopo da Wave 11;
- o backend não calcula percentual de currículo.

Consequência: esses eventos são insumos compatíveis, mas nenhum deles prova domínio sem competência, lente, rubrica, assistência, resultado, erro crítico, novidade e independência. Este contrato não altera a Wave 11; ele informa uma wave futura de integração.

### 17.2 Progresso e recall locais

O repositório contém dois precedentes distintos:

- um store local registra aula visitada/concluída, tentativas de quiz, camadas L1/L2/L3 visitadas e confirmação de retrieval;
- um store de grading registra respostas avaliadas em quatro faixas e monta fila de recall por nota mais recente e dias desde a tentativa; a sessão atual usa os itens de maior prioridade, com três por padrão e máximo de cinco.

Esses mecanismos **NÃO** são o Mapa de Domínio aprovado:

- as camadas legadas `L1/L2/L3` não devem ser presumidas equivalentes a Explorador/Analista/Especialista;
- “visitado”, “concluído” e “retrieval reconhecido” não são `competente`;
- a fila de recall existente não implementa P0–P3, erro crítico, pré-requisito, deduplicação por competência ou limite 6 + 4;
- pesos atuais de nota e tempo são precedente técnico local, não parâmetros normativos desta especificação.

### 17.3 Exercícios, instrumentos e currículo

O contrato TypeScript atual confirma:

- atividade pode ser objetiva, discursiva, estudo de caso ou cálculo;
- aula já possui campo de competências, atividades, referências e instrumentos;
- instrumento é dado configurável e cobre nove famílias observadas no corpus;
- instrumentos têm campos, saídas e notas, mas operar um instrumento não prova por si só transferência;
- exercícios podem preservar prompt e gabarito, mas revelar gabarito é assistência D;
- no conteúdo atual do M7, o campo `competencies` das aulas está vazio e os exercícios extraídos não estão ligados a uma rubrica de `competência × lente`.

Consequência: o corpus oferece tarefas reais e critérios locais, mas ainda falta o mapeamento canônico exigido para inferência de estado.

### 17.4 Badges, XP e progresso agregado

O catálogo atual contém badges com critérios mensuráveis e categorias de conteúdo, exploração e domínio; o progresso agregado atual também expõe aulas, EXP, badges, percentuais por nível e streak, com dados mock honestamente marcados.

Esses elementos podem motivar e celebrar, mas:

- badge não promove domínio automaticamente;
- XP não entra na regra de estado;
- percentual de aula concluída mede cobertura, não competência;
- streak mede frequência, não retenção demonstrada.

### 17.5 Confirmações dos módulos

- **M7:** 7 aulas, 10 instrumentos, 12 exercícios e critério 8/10; o corpus exige componente oral e navegação real nos portais, e declara erro de roteamento como falha grave.
- **M8:** 7 aulas, 11 instrumentos e 12 exercícios; o corpus separa capacidade, geração, escopo, universo, data-base e método, e trata números como fotografias datadas.
- **M10:** 9 aulas, 11 instrumentos e 14 exercícios; o corpus declara que dimensionamento exige série mínima recomendada de doze meses e que uma fatura isolada não sustenta recomendação de redução.
- **M11:** o corpus trata geração estimada, degradação, modalidade de autoconsumo, conexão, tarifa e contrato como premissas verificáveis de proposta solar.

## 18. Parâmetros calibráveis

As decisões abaixo permanecem abertas à calibração e **NÃO DEVEM** ser tratadas como leis permanentes:

- intervalo mínimo de retenção;
- quantidade exata de evidências acima do mínimo aprovado;
- janela para considerar sessões independentes;
- limite diário da fila;
- peso de assistência;
- cálculo interno e faixas de confiança;
- prioridade entre revisão e conteúdo novo;
- frequência de revisão de competências dominadas;
- pesos e desempates dentro de P0–P3;
- regra de importância de competência;
- política de microcompetência de atualização factual.

Padrão inicial recomendado para teste:

- primeira retenção após 7 dias;
- nova verificação em 30 dias para competências centrais;
- 6 itens essenciais + até 4 opcionais por dia;
- duas evidências independentes para `competente`;
- retenção + transferência para `dominado`.

Os dois últimos itens contêm decisão fechada na sua estrutura; apenas quantidades adicionais, intervalos e calibração são abertos.

## 19. Lacunas de implementação identificadas

Sem prescrever solução técnica, uma wave futura precisará resolver:

- catálogo canônico de competências e pré-requisitos;
- rubrica por `competência × lente`;
- mapeamento explícito de atividades e observables;
- captura de assistência, erro crítico, novidade e justificativa;
- distinção operacional entre evento bruto e evidência interpretada;
- síntese separada de estado, confiança e atualidade;
- política auditável de regressão;
- geração, deduplicação, ordenação e resolução da fila P0–P3;
- integração sem confundir camadas legadas L1/L2/L3 com lentes;
- tratamento de evidência transversal entre lentes sem promoção automática;
- explicação ao aluno e trilha de auditoria;
- atualização factual com fonte e data-base;
- rubricas específicas para Atlas, jogos, desafios orais e casos cumulativos.

Nenhuma dessas lacunas autoriza mudar as decisões fechadas deste contrato.

## 20. Perguntas para Aquiles

Permanecem abertas:

- O aluno pode ocultar o estado de uma lente que não pretende estudar?
- A progressão de trilha exige competência mínima ou apenas conclusão?
- Badges devem depender de domínio ou podem celebrar exploração?
- O portfólio de artefatos será público, privado ou exportável?
- Qual será o nível de transparência do algoritmo de revisão?
- Haverá desafio oral gravado ou apenas texto?
- O sistema pode recomendar recuo de lente automaticamente ou apenas sugerir?

Até decisão explícita, implementações futuras devem registrar essas perguntas e não preencher a lacuna por plausibilidade.

## 21. Decisões fechadas e procedência

### 21.1 Derivadas da visão aprovada

- unidade `competência × lente`;
- cinco estados e suas definições;
- vídeo e consumo não provam domínio;
- domínio exige retenção e transferência;
- tempo não rebaixa estado sozinho;
- atualidade factual é separada;
- erro crítico bloqueia promoção;
- um acerto isolado nunca basta;
- lente superior não promove inferior automaticamente;
- revisão deve variar formato;
- progresso não é percentual único;
- jogos não provam retenção futura sozinhos;
- política mínima de duas demonstrações qualificadas para `competente`;
- prioridades P0–P3, deduplicação, escada e limite diário inicial;
- assistência A–D;
- regressão exige evidência contraditória, não mero decurso do tempo.

### 21.2 Confirmados no repositório

- log de eventos de progresso e caches derivados da Wave 11;
- ausência atual de entidade de competência e lente no backend;
- metadado flexível e identificador curricular opaco;
- stores locais de progresso e recall com semântica diferente deste contrato;
- atividades, instrumentos, badges e progresso agregado existentes;
- campo de competência ainda sem mapeamento suficiente no conteúdo auditado;
- tarefas e critérios reais de M7, M8, M10 e M11 usados nos exemplos.

### 21.3 Não inferido

Este documento não define:

- schema ou nome de tabela;
- endpoint;
- migration;
- payload;
- nome definitivo de evento;
- fórmula de confiança;
- peso numérico de evidência;
- intervalo final de retenção;
- regra final de badge;
- bloqueio de trilha;
- design da interface;
- equivalência entre estruturas legadas e as três lentes.

## 22. Checklist de conformidade para waves futuras

Uma implementação só está conforme quando:

- representa estado por `competência × lente`;
- mantém cinco estados exatamente;
- separa estado, confiança e atualidade;
- preserva evidência e explicação de procedência;
- não promove por vídeo, XP, streak, badge ou conclusão;
- exige diversidade e independência para `competente`;
- exige retenção e transferência para `dominado`;
- bloqueia promoção por erro crítico não resolvido;
- registra assistência;
- não promove lentes por herança;
- não rebaixa por tempo sozinho ou falha isolada;
- produz fila P0–P3 deduplicada e explicável;
- varia revisão e aponta remediação exata;
- apresenta cobertura, competência, domínio, revisão, lentes e atualidade separadamente;
- mantém parâmetros calibráveis identificados como tais;
- responde às nove perguntas de auditabilidade da seção 1.1 sem inventar regra.
