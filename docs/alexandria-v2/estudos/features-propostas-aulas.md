# Features propostas a partir do estudo das aulas

Registro acumulado. Cada estudo de módulo acrescenta a sua seção. Formato por feature: nome, o que faz, por que vale, dependências, risco.

---

## Do estudo do M12 (2026-09-17)

### F-M12-1 · Selo de estado datado, com validade
- **O que faz.** Todo estado jurídico ou político exibido (vigente, sem regulamento, aprovado em uma Casa, anúncio não cumprido) leva a data de verificação e, quando a fonte declara um fim conhecido, uma data de validade. Passada a validade (ex.: presidência da COP após a abertura da COP31), o selo muda sozinho para "verificar: o estado pode ter mudado", sem trocar o texto da fonte.
- **Por que vale.** O M12 é o módulo mais perecível do currículo (a fonte diz isso). S4 exige ausência honesta, e um estado vencido mostrado como atual é dado falso por omissão.
- **Dependências.** Campo `verificadoEm` e `validoAte` opcional no dado de estado; fichas de fonte (§9); fluxo editorial de reverificação.
- **Risco.** Excesso de avisos repetidos no viewport (heurística de S4). Mitigar com um selo por bloco e uma linha de metadado.

### F-M12-2 · Régua viva do módulo
- **O que faz.** Um instrumento de linha do tempo (os 12 marcos do m12-inst-04) aparece em várias aulas, com os marcos da aula atual em destaque e os demais em espera; na aula de síntese, aparece inteiro.
- **Por que vale.** Dá continuidade espacial ao módulo (compromisso de orientação) e converte um select de texto na forma que o título promete.
- **Dependências.** Componente de régua com glifos de estado (silhueta + palavra); marcos com `aulaId`; F-M12-1.
- **Risco.** Virar decoração repetida; cada aparição precisa de um ato (prever o estado antes de abrir).

### F-M12-3 · Mosaico de dois denominadores
- **O que faz.** Figura de área (largura = peso de uma parte no total; altura = participação renovável dentro da parte) ligada aos controles do m12-inst-02; a área total é o número agregado.
- **Por que vale.** Desenha a relação que a A01 afirma (média ponderada), e serve a qualquer "percentual de quê?" no currículo (FCap × FCarga, demanda × energia).
- **Dependências.** Desenho de forma prometida (§9); registro previsto × calculado.
- **Risco.** Entradas padrão sem fonte própria (41%) exigem rótulo de cenário didático.

### F-M12-4 · Barras de participação em escala log com razão
- **O que faz.** Duas barras horizontais em escala logarítmica (participação na reserva × na produção) com a razão escrita entre elas, alternância de metodologia (USGS × ANM) e estados visuais para os ramos "entrada inconsistente" e "produção nula" do script.
- **Por que vale.** Em escala linear a produção brasileira de terras-raras (0,005%) é invisível; a assimetria de ~4.800× só vira objeto de leitura em log. Reaproveitável em qualquer comparação dotação × uso.
- **Dependências.** m12-inst-09 com saída estruturada; convenção de eixo log legível a 390.
- **Risco.** Escala log mal lida por leigos; exige rótulo de ordem de grandeza em cada divisão.

### F-M12-5 · Tarefa de classificação com revelação pós-tentativa
- **O que faz.** Converte instrumentos-consulta (select → texto) em mesa de classificação: itens da fonte, caixas da fonte, registro da tentativa e só então a chave, com a frase da fonte que decide cada item. Sem cor de certo/errado.
- **Por que vale.** 9 dos 11 instrumentos do M12 são consultas; sem isso, o módulo não tem ato autêntico na maioria das aulas (C9). O padrão serve para m12-inst-03, -05, -06 e -10 e para aulas sem instrumento de outros módulos.
- **Dependências.** Evento de tentativa (§9); chaves derivadas do dado existente (MODULO_12_CLASSES_PRODUTO, MODULO_12_ENTIDADES etc.); versão por botões a 390.
- **Risco.** Deslizar para quiz temático; cada classificação precisa exercitar o mecanismo central da aula, não a memória do texto.

### F-M12-6 · Partitura de conversa
- **O que faz.** Linha de 0 a 30 minutos com 8 compassos (m12-inst-11); o learner ordena as perguntas embaralhadas, depois treina com entrada por movimento sorteado ("o que vem depois, o que ainda não pode ser dito"). As próprias previsões e respostas do learner nas aulas anteriores aparecem nos compassos correspondentes.
- **Por que vale.** Transforma a aula de síntese em ensaio e faz a recuperação espaçada do módulo inteiro sem questão de avaliação.
- **Dependências.** Registro de tentativas por aula (§9); âncoras com código da aula de origem.
- **Risco.** Cronômetro ou gravação viram pseudo-evidência; pelo P14, só "atividade recomendada".

### F-M12-7 · Banco de recuperação por erros comuns
- **O que faz.** Usa os pares erro → correção da seção de erros de cada módulo (20 no M12) como itens de "identificar o erro" na recuperação, com a origem visível e a aula de origem mapeada. Assim as questões do quiz ficam na avaliação.
- **Por que vale.** Cumpre C10 (recuperação que não mostra a resposta antes da tentativa; questão usada sai da avaliação) com conteúdo da fonte, sem inventar item.
- **Dependências.** Extração da seção de erros dos 17 módulos; mapeamento erro → aula (camada Alexandria, revisável).
- **Risco.** Mapeamento subjetivo; registrar autor e data.

### F-M12-8 · Verificador de nomeação para content QA (interno)
- **O que faz.** Passe editorial que aplica ao próprio produto a taxonomia de nomeação da M12·A08 (nomes de fabricantes, plataformas e agentes de mercado em prosa, legenda e crédito de imagem), sinalizando para revisão humana.
- **Por que vale.** A curadoria de mídia pode reintroduzir um nome que a aula omite de propósito (foto identificável de mina, fábrica ou planta). Coerência entre o que a aula ensina e o que a interface faz.
- **Dependências.** Decisão do Founder sobre a razão comercial da taxonomia (registrada no estudo m12); lista de categorias.
- **Risco.** Falso positivo com órgãos públicos (categoria livre); o verificador sinaliza e nunca reescreve.

## Do estudo do M05 (2026-09-17) — ver `aulas/m05.json`

### F-M05-1 · Régua persistente do módulo
- **O que faz.** Transforma a "régua das quatro perguntas" do §00 do M05 num objeto fixo do módulo: (1) que falha a regra corrige; (2) que incentivo cria; (3) quem assume o risco; (4) como o custo chega ao consumidor. Cada aula abre a régua sobre o seu instrumento regulatório, e o learner preenche uma ou duas linhas. A A06 a desdobra na matriz de nove perguntas (6.5).
- **Por que vale.** É a ferramenta que a fonte declara central e o primeiro item do §Final, mas hoje não aparece em aula nenhuma. Dá continuidade entre as aulas e uma recuperação natural (C10). O padrão serve para qualquer módulo que tenha uma "régua" própria.
- **Dependências.** Registro de respostas por aula (§9); componente de tabela preenchível; texto da régua como camada fonte (§00).
- **Risco.** Virar formulário repetitivo. Mitigar pedindo só a pergunta que a aula ilumina e variando o caso.

### F-M05-2 · Palco de duas camadas (física × comercial)
- **O que faz.** Diagrama em que a mesma cena é lida duas vezes: a camada de rede (injeção, carga, despacho) e a camada de dinheiro (contrato, medição, liquidação de diferenças), ligadas por "contratado × medido".
- **Por que vale.** Desmonta o erro mais repetido do módulo ("meu contrato traz a energia daquela usina", A03) e sustenta a dicotomia falsa da A06. Reaproveitável no M04 (contratos) e nos módulos de mercado livre.
- **Dependências.** Primitiva SVG de diagrama com duas faixas e realce sincronizado; fatos só da fonte, sem nomes reais.
- **Risco.** Parecer infográfico decorativo. Precisa estar amarrado a uma decisão ("o contrato foi descumprido?").

### F-M05-3 · Mapa conceitual de dois eixos como palco de aula
- **O que faz.** Plano cartesiano conceitual (eixos adimensionais rotulados, quadrantes com texto em disclosure, pontos de referência anônimos, marca de posição didática), com o ato "marcar o ponto antes de ver" e aceitação por quadrante.
- **Por que vale.** O INST·06 do M05 promete "Mapa" e hoje não desenha nada. É a forma mais coerente com a identidade de atlas e serve a outros instrumentos de posicionamento.
- **Dependências.** Figura programática; entrada por toque/teclado no plano (acessível: setas movem o ponto, com leitura de quadrante em texto); saídas textuais nomeadas (hoje `ResultadoInstrumento.valores` é só numérico).
- **Risco.** Os índices serem lidos como medição. O rótulo "índice adimensional do módulo; posição didática" precisa ficar junto do mapa.

### F-M05-4 · Saídas textuais nomeadas em instrumento
- **O que faz.** Estende o resultado do instrumento para aceitar saídas categóricas (grau ótimo, reprodutibilidade, quadrante, risco dominante) com rótulo próprio, fora do veredito.
- **Por que vale.** Quatro saídas do M05 (e padrões semelhantes nas Waves 19 e 24) só aparecem hoje diluídas em prosa. Previsões categóricas ("parcial"? "societária"?) precisam de uma saída comparável para o quadro previsto × calculado.
- **Dependências.** Mudança de tipo compartilhado (FOUNDRY, `src/lib/types/`), fora da posse deste estudo.
- **Risco.** Baixo. Exige migração coordenada dos calculadores.

### F-M05-5 · Explicador em três níveis restaurado
- **O que faz.** Restaura os níveis "Criança de 12 anos · Executivo · Especialista" de cada conceito, hoje reduzidos ao primeiro, como disclosure no ponto de uso. Uma variante de recuperação pede que o learner escolha o nível que consegue explicar e então mostra o texto.
- **Por que vale.** C4 pede três níveis de explicação no ponto de uso, e a fonte já os tem nas 6 aulas do M05 (e em outros módulos com `div.lv`).
- **Dependências.** Reextração dos `div.lv` (hoje só o primeiro painel entrou) e bloco de conteúdo com três painéis.
- **Risco.** Excesso de caixas; limitar a uma por aula, na posição do conceito.

### F-M05-6 · Dossiê com decisão de publicação
- **O que faz.** Formato de ato em que o learner recebe um processo descrito, marca sinais, vê a métrica e escolhe o que pode afirmar publicamente: acusar / publicar a lacuna verificável e pedir dados / não publicar. A justificativa deve citar os sinais.
- **Por que vale.** Exercita a disciplina da A04 ("análise publica o que consegue reproduzir"). Serve também de base para o Desafio de decisão do Caso Operação A (P17) e para aulas de leitura de nota técnica.
- **Dependências.** Registro de decisão + justificativa (§9); gabarito só depois da tentativa (C7).
- **Risco.** Parecer acusação a instituições reais. Usar só casos descritos na fonte e anônimos.

---

## Do estudo do M14 (2026-09-17) — ver `aulas/m14.json`

### F-M14-1 · Faixa de estados de um percentual (teto · vigente · trajetória · vencido)
- **O que faz.** Mostra os quatro estados de um mesmo percentual regulatório como quatro casas de mesma forma. Cada casa tem silhueta própria, palavra, valor, norma e data de verificação. Um estado "prazo legal vencido e não implementado" tem glifo distinto e nunca é lido como vigente.
- **Por que vale.** É o conceito central da M14·A04 e reaparece na A01 (E35/E32/E30), na A06 (meta de 0,5% do biometano) e no M16. A fonte o chama de "defeito dominante do material de imprensa". Especializa o F-M12-1 (selo datado) para valores com múltiplos estados simultâneos.
- **Dependências.** Dado de estado com `estado`, `valor`, `norma`, `vigenteDesde`, `verificadoEm`; F-M12-1; renderizar `div.est` (hoje achatado em lista).
- **Risco.** Parecer semáforo se cada estado ganhar cor. Distinguir por silhueta e palavra (S2, S3).

### F-M14-2 · Carimbo de base temporal (ano-safra × ano-calendário)
- **O que faz.** Todo número com base temporal leva um carimbo curto ("ano-safra 2026/27 · projeção · 1º lev." ou "ano-calendário 2025 · realizado"). Ao focar o carimbo, abre uma mini-régua de 24 meses que mostra a sobreposição parcial entre abr–mar e jan–dez. Dois números com bases diferentes nunca são somados nem postos na mesma barra sem aviso.
- **Por que vale.** É o eixo do M14 inteiro (§00.1: 25% × 28,1% para a mesma pergunta) e metade dos erros comuns do módulo. Serve também a M08 e M12 (séries de anos diferentes).
- **Dependências.** Campo `baseTemporal` e `status` (projeção/realizado) nos números de prosa e tabela; convenção de extração que preserve a base colada (o content.ts já preserva no texto, mas não como dado).
- **Risco.** Poluição visual se aplicado a todo número. Usar só onde a base não é óbvia ou quando dois números de bases diferentes convivem no viewport.

### F-M14-3 · Calendário comparado de 12 meses
- **O que faz.** Faixas mensais empilhadas no mesmo eixo, por exemplo moagem típica do Centro-Sul, operação com milho e bandeira tarifária de 2025. Cada faixa tem rótulo de classe ("esquema ilustrativo" × "dado 2025, fonte X") e mês "não declarado" explícito.
- **Por que vale.** Prova visualmente a complementaridade que a M14·A05 afirma e a ausência de sazonalidade do milho na A03. Serve a M02 (curva de carga sazonal) e M08 (hidrologia) quando houver dado.
- **Dependências.** Renderizar `div.saf`; dado mensal com classe; padrão ou hachura para categorias (sem semáforo nas bandeiras).
- **Risco.** Inventar meses ou intensidades. Só desenhar o que a fonte declara, com "não declarado" nas lacunas.

### F-M14-4 · Fluxo de destinos com conservação
- **O que faz.** Um insumo (ex.: bagaço) se divide em ramos concorrentes (vapor de processo fixo e prioritário, eletricidade, hidrólise 2G, venda). Arrastar a largura de um ramo encolhe os outros, e a soma é constante. Pode ser qualitativo (sem números) quando a fonte não dá frações.
- **Por que vale.** Torna visível o "produto concorrente", a informação que a fonte diz "quase nunca acompanhar o número" (M14·A03, INST·09, Ex 04). Reutilizável para o ATR (açúcar × etanol), para o resíduo orgânico (fertirrigação × biogás) e em M08 (usos da água).
- **Dependências.** Componente de fluxo com restrição de soma; modo "esquema" sem eixos numéricos; renderizar `div.rt`.
- **Risco.** Ser lido como dado quantitativo. Rótulo "esquema, sem proporções da fonte" obrigatório quando não houver números.

### F-M14-5 · Banca de enunciados verdadeiros e insuficientes
- **O que faz.** Mostra um enunciado; o learner registra o defeito dominante (base temporal, rota, grandeza ou concorrente) e, opcionalmente, a pergunta que faria. Só então vêm "o que falta", a pergunta de referência e a forma corrigida. Guarda a classificação para recuperação e marca "a revisar" por tipo de defeito errado.
- **Por que vale.** É o instrumento assinatura do M14 (INST·10) e do M13 (Verificador de Lacuna), e corrige um defeito da fonte, que revela ao clicar (QA-M14-03). Os 18 erros comuns do módulo viram banco de itens de recuperação com origem visível (C10).
- **Dependências.** Registro de tentativa (§9); taxonomia de defeitos por módulo; persistência de "a revisar".
- **Risco.** Virar quiz temático. Manter o formato de classificação com justificativa e nunca chamar de jogo (P25).

### F-M14-6 · Matriz de leitura lateral (fichas de campo fixo)
- **O que faz.** Monta N fichas de mesmo esquema como matriz (colunas = objetos, linhas = campos), com destaque de linha ao focar um campo. A 390 alterna "por objeto" e "por campo". Um campo pode ser de entrada do learner, preenchido antes da referência.
- **Por que vale.** A fonte declara o princípio ("campo fixo permite leitura lateral"), e seis tabelas empilhadas o destroem. Serve a M07–M13 (fichas de empresa, de fonte, de país) e à Biblioteca.
- **Dependências.** Renderizar `div.emp` e congêneres como estrutura (hoje achatados em tabelas separadas); campo de entrada com C7.
- **Risco.** Densidade alta a 1440 (faixa da Aula 12–25). Recolher linhas longas com disclosure.

### F-M14-7 · Retas de sensibilidade com ponto de ruptura
- **O que faz.** Para instrumentos com uma variável contínua decisiva (distância, autoconsumo, preço), desenha a saída contra essa variável para cada opção discreta (ex.: rota de entrega) e marca o ponto em que a saída cruza zero ou muda de veredito. Suporta o ato "manipular até a meta".
- **Por que vale.** Converte vereditos textuais em forma legível (M14·A06: margem × km; A05: exportação × autoconsumo) e cumpre a "forma prometida" de instrumentos chamados "régua" que hoje não desenham nada (INST·07, INST·08).
- **Dependências.** Motor de cálculo dos instrumentos portado como função pura; parâmetros com classe ("ilustrativo de ordem de grandeza"); correção do QA-M14-01.
- **Risco.** Parâmetros ilustrativos lidos como benchmark. Rótulo de classe junto do gráfico (S4).

### F-M14-8 · Denominador duplo
- **O que faz.** Um numerador sobre duas réguas-denominador lado a lado, com os dois percentuais e o nome de cada denominador. Com previsão opcional ("qual denominador esta manchete usa?").
- **Por que vale.** M14·A07 (99% × 88%; 48,09 × 49,01 mi). É o caso mais simples da família do F-M12-3 (mosaico de dois denominadores) e pode ser a mesma primitiva em modo reduzido.
- **Dependências.** F-M12-3; dado com numerador e denominadores nomeados e fonte por número.
- **Risco.** Nenhum relevante além de exigir fonte para cada denominador.

## Do estudo do M11 (2026-09-17) — ver `aulas/m11.json`

Reuso sem duplicar: **F-M12-1** (selo datado, com validade) cobre os números vivos do M11. O "60% em 2026" da A04 vence em 1º/01/2027, e os vetos da Lei 15.269 da A02 foram consultados em 1º/08/2026. **F-M12-5** (classificação com revelação pós-tentativa) é a mecânica da mesa de triagem da A01 (12 afirmações × 4 eixos) e da planilha anotada da A06. **F-M12-7** (banco de recuperação por erros comuns) serve aos 20 erros do §Erros do M11.

### F-M11-1 · Documento de exercício anotado, com linhas-fantasma
- **O que faz.** Mostra um documento didático (projeção, cláusula de contrato ou dossiê de proposta) composto só com fatos e cenários já presentes na aula, marcado de forma visível como "documento de exercício · camada Alexandria", com partes genéricas ("[Fornecedor]", "[Cliente]"). O learner anota trechos na margem (no mobile, abaixo de cada trecho). Linhas AUSENTES podem surgir como linhas-fantasma ("O&M — não declarada = 0") depois da tentativa.
- **Por que vale.** No M11, o mecanismo de três aulas (A06, A07, A08) é ler um documento e perceber o que não está escrito. Prosa não mostra omissão, e um documento com fantasmas mostra. Serve também às aulas de fatura (M10) e de nota técnica.
- **Dependências.** Bloco de conteúdo "documento de exercício" com trechos endereçáveis; registro de anotação/classificação por trecho (§9); revisão P3/P11 do texto conectivo novo.
- **Risco.** Parecer documento real de empresa (proibição de imitar organização real). Mitigar com partes genéricas, rótulo permanente e nenhuma marca, CNPJ ou logotipo. Excesso de texto novo: limitar a trechos curtos.

### F-M11-2 · Zona de regra não escrita em série temporal
- **O que faz.** Convenção de figura para o período em que a regra ou o dado ainda não existe: a série para, a zona fica sem valor (hachura por traço, nunca por cor) e recebe um rótulo com o estado ("art. 17 · metodologia em projeto regulatório, conclusão prevista para 2027"). Nunca é zero, nunca é o último valor prolongado, nunca é 100%.
- **Por que vale.** A frase central do M11 ("a regra de 2029 tem conclusão prevista para 2027") só é honesta desenhada assim, e o mesmo padrão serve a qualquer cronograma regulatório pendente (M12, M09) e a projeções. É a versão gráfica de "sem dado — não é zero" (S4).
- **Dependências.** Primitiva de série com segmento "indefinido"; teste do critic procurando valor desenhado na zona.
- **Risco.** Ser lida como "0" por quem só vê a forma. O rótulo precisa estar dentro da zona, não em legenda.

### F-M11-3 · Instrumento em estágios na prosa
- **O que faz.** Um mesmo instrumento aparece em dois ou mais pontos da aula, cada um com parte dos controles (ex.: Inst 04 do M11: porte + fonte depois de 03.1; arranjo depois das fichas de 03.2), com estado compartilhado e o quadro previsto × calculado acompanhando.
- **Por que vale.** C5 exige o instrumento no ponto que o invoca. Instrumentos compostos da fonte são invocados em momentos diferentes, e hoje ficam num bloco só, no fim.
- **Dependências.** Estado de instrumento por aula (não por bloco); âncoras de estágio no corpo da aula.
- **Risco.** O learner não perceber que é o mesmo instrumento. Mitigar com número e título iguais e marca "estágio 1/2".

### F-M11-4 · Caderno de perguntas ao vendedor
- **O que faz.** Cada ato de leitura contratual ou verificação que termina numa pergunta (A05–A08 do M11) acrescenta a pergunta do learner a um caderno próprio, com a base normativa citada e o destinatário. A A08 e o Caso reutilizam o caderno para montar a "lista de solicitações" do veredito "não é possível concluir".
- **Por que vale.** Transforma o rastro (S6) em objeto útil e liga as aulas por algo que o learner produziu, sem virar competência declarada.
- **Dependências.** Persistência de respostas de texto por learner (§9); vínculo pergunta → aula → fonte.
- **Risco.** P7: parecer anúncio do produto Solar Proposal Validator. Manter como caderno de estudo, sem menção a produto. Não contar como Demonstrado.

### F-M11-5 · Relógio de duas trilhas
- **O que faz.** Gantt de duas faixas (ex.: Técnica · Contratual, mais "Ambas") num eixo de minutos, com passos como barras, pontos de sincronização como linha que cruza as faixas e o painel do passo ao clicar. No mobile, o tempo corre na vertical com duas colunas estreitas. Ato opcional: ordenar os passos antes de revelar.
- **Por que vale.** O Inst 11 do M11 ("duas trilhas sincronizadas") desenhava barras na fonte e perdeu a forma no porte. A aula é sobre paralelismo, que texto linear contradiz.
- **Dependências.** Primitiva de faixa temporal; dados já existem (M11_PASSOS com t0/t1/sinc).
- **Risco.** Contagem de sincronizações divergente na fonte (prosa diz três, o instrumento marca dois): não exibir número, só as marcas.

### F-M11-6 · Parede física em instrumento de reconstrução
- **O que faz.** Em instrumentos que reconstroem uma grandeza a partir da fonte (ex.: desempenho global implícito = geração declarada ÷ potência × irradiação × 365), o medidor tem um limite físico desenhado (100%) e, ao cruzá-lo, a saída muda de "desvio" para "impossível por construção", com a frase da fonte.
- **Por que vale.** Separa refutação sem opinião (limite físico) de juízo por faixa (faixa diagnóstica do instrumento), distinção que o M11 ensina. Reaproveitável em fator de capacidade (M01) e em rendimentos.
- **Dependências.** Saída categórica nomeada (F-M05-4); rótulo "faixa diagnóstica deste instrumento" para as demais faixas (P6).
- **Risco.** Faixas da fonte lidas como tolerância normativa. O rótulo é obrigatório.

### F-M11-7 · Matriz-fio do módulo
- **O que faz.** Um objeto de orientação próprio do módulo (no M11, a matriz dos quatro eixos: tipo de verdade · método · forma da saída) aparece no topo de cada aula, compacto, com o eixo da aula aceso e o estado do learner por eixo (percorrido, com prática), em palavra e glifo.
- **Por que vale.** Dá ao M11 uma rota interna que não é lista de aulas (teste anti-LMS, marcador 1) e mantém a tese do módulo presente nas oito aulas. Parente de F-M05-1 e F-M12-2 (régua persistente), para módulos cuja espinha é taxonomia e não tempo.
- **Dependências.** Mapeamento aula → eixo (camada Alexandria, revisável); estados S3.
- **Risco.** Virar decoração repetida. Cada aparição deve ser clicável até a definição do eixo e não pode ocupar a abertura (S1).

### F-M11-8 · Irradiação por município para "localizar no mapa"
- **O que faz.** Camada de dado com a irradiação do Atlas Brasileiro de Energia Solar (INPE/LABREN, 2ª ed.) por sede municipal. O learner localiza o município no mapa e o valor entra como entrada editável do Inst 06, com fonte e data à vista.
- **Por que vale.** A A05 insiste que a irradiação é por município e nunca constante cravada. Hoje o valor é digitado sem fonte. Abre o ato "localizar no mapa" num módulo sem geografia.
- **Dependências.** Download e termos de uso da base INPE/LABREN (ler antes), ingestão (CURSOR), mapa do Brasil com fronteiras de fonte confiável; ficha de fonte (§9).
- **Risco.** A fonte chama os dados de "indicativos". O selo precisa dizer isso. Custo de dado alto para um único ato.

### F-M11-9 · Conferência de rótulo de controle contra a fonte (interno)
- **O que faz.** Script de content QA que compara o rótulo de cada opção de controle portado (`fields[].options[].label`) com o texto literal do botão no HTML-fonte e lista paráfrases.
- **Por que vale.** No M11, três instrumentos (05, 08, 10) têm rótulos parafraseados no código, e em um deles (08, `tt-anc`) o sentido muda. Complementa o F-M12-8.
- **Dependências.** Nenhuma nova; é leitura do HTML e do content.ts.
- **Risco.** Baixo. Diferenças intencionais (encurtamento a 390) precisam de lista de exceções justificadas.

---

## Do estudo do M01 (2026-09-17)

Estudo: [`aulas/m01.md`](aulas/m01.md).

### F-M01-01 · Plano potência × tempo reutilizável
- **O que faz.** Traz um único componente de figura com tempo no eixo x (h) e potência no eixo y (kW ou MW), em que a área é a energia (kWh ou MWh). Ele tem três modos:
  - dois retângulos de mesma área (A01);
  - retângulo da demanda média sob a linha da demanda máxima (A05);
  - caixa teórica "capacidade × horas" preenchida pela geração (A08).
- **Por que vale.** Três fórmulas do M01 viram uma ideia só, e a continuidade visual entre aulas (S6) é real. Também cumpre o gesto da nota do INST·01 ("Experimente comparar dois cenários") e a promessa "Compare" do INST·06. É reaproveitável em M02 (curva de carga) e M08.
- **Dependências.** Desenho das formas prometidas (§9); saídas estruturadas de INST·01, INST·04 e INST·06; F-M01-02.
- **Risco.** Sugerir um perfil horário que a fonte não tem. Mitigação: só retângulos e linhas, sem curva inventada, e selo "esquemático" quando houver forma.

### F-M01-02 · Quadro previsto × calculado fixo
- **O que faz.** Guarda a previsão registrada e mostra, no mesmo cenário, a linha "previsto · calculado · diferença". O quadro fica visível enquanto o learner explora o instrumento, e a entrada aceita arredondamento como regra declarada da Alexandria (P19), nunca como tolerância da fonte.
- **Por que vale.** É o C5 literal. No M01 há 5 instrumentos com previsão útil (INST·01, 03, 04, 05 e 06).
- **Dependências.** Evento de previsão (§9); cenário do instrumento serializável.
- **Risco.** Confundir a regra de arredondamento com uma margem factual. Mitigação: o rótulo diz "regra de entrada".

### F-M01-03 · Classificar e ordenar com acesso completo
- **O que faz.** Oferece uma tarefa de ligar itens a categorias ou ordená-los, com três entradas equivalentes: arrastar, teclado e seleção em lista (padrão a 390). A tarefa registra a tentativa antes de mostrar os pares de referência, cada um com a linha da tabela da fonte que o justifica.
- **Por que vale.** É o ato autêntico das aulas sem instrumento (A03, A06, A09) e da A02. Ajuda a evitar que o módulo feche em texto aberto (C9).
- **Dependências.** Evento de resposta; itens com proveniência por par.
- **Risco.** Virar quiz de memorização. Mitigação: os itens são efeitos ou situações ("relatos"), não definições copiadas.

### F-M01-04 · Escada de tensão com vazios declarados
- **O que faz.** Mostra uma régua vertical em escala logarítmica de 127 V a 750 kV, com faixas de uso (A02), degraus da rede (A04) e subgrupos tarifários (A06). Os intervalos sem enquadramento na fonte aparecem vazios, com "não declarado", e o learner pode soltar fichas de cliente na régua.
- **Por que vale.** Um objeto só atravessa três aulas, e a escada expõe as lacunas e contradições da própria tabela (AS < 2,3 kV no Grupo A) em vez de escondê-las.
- **Dependências.** Reconciliação da tabela 6.1 × 6.2 (content QA); fichas de fonte das faixas (T06).
- **Risco.** Uma faixa sem fonte lida como regra oficial. Mitigação: selo "verificação pendente" na régua.

### F-M01-05 · Meta de manipulação sem cor
- **O que faz.** O instrumento declara uma meta (por exemplo, "FP ≥ 0,92") e reconhece quando ela é atingida pelo valor **não arredondado**. O estado aparece por palavra e silhueta ("abaixo da referência" / "referência atingida") e por um fio ou arco-limite desenhado na figura.
- **Por que vale.** Substitui o semáforo verde, ouro e vermelho da fonte (S2). Evita o falso positivo de arredondamento: a 350 kVAr o mostrador exibe "0,92" com FP real de 0,9162.
- **Dependências.** Instrumento com saída numérica bruta; F-M01-02.
- **Risco.** Meta inventada. Mitigação: só metas com valor na fonte (0,92) ou aritmética derivada e marcada.

### F-M01-06 · Identificar o erro de unidade
- **O que faz.** Apresenta uma frase com a unidade errada ("gerou 100 MW no mês"). O learner marca a palavra errada e escolhe ou escreve a correção, e depois vê a correção literal da fonte.
- **Por que vale.** É o menor ato autêntico para o erro de fluência que o M01 chama de "fatal". Pode reaparecer como recuperação na A08 e em módulos de mercado.
- **Dependências.** Frases-erro com proveniência; evento de resposta.
- **Risco.** Poucos itens na fonte (2). Novos itens são da camada Alexandria e exigem revisão.

### F-M01-07 · Pequenos múltiplos de forma de onda esquemática
- **O que faz.** Desenha, em SVG, uma senoide de referência e as variações: DC, harmônico, afundamento, sobretensão, desequilíbrio e flicker. Não há eixo numérico, e o selo "esquemático" fica visível.
- **Por que vale.** Dá identidade visual aos fenômenos da A09 e à AC×DC da A03, e liga o início ao fim do módulo. Pode ser reaproveitado em M02 e em qualidade de energia de outros módulos.
- **Dependências.** Nenhuma de dado. Precisa de revisão técnica da forma de cada perturbação.
- **Risco.** Ser lido como medição. Mitigação: selo e ausência de escala; nenhuma cor de estado.

### F-M01-08 · Instrumento velado até a tentativa
- **O que faz.** Quando o cenário padrão de um instrumento é igual ao de um exercício (INST·04 = Ex·04; parágrafo 8.2 = previsão da A08), o instrumento ou o número do parágrafo fica velado até a tentativa ser registrada. Há um controle "registrar sem tentar" que libera o conteúdo e marca "leitura sem prática".
- **Por que vale.** Sem isso, o C7 falha sem que ninguém perceba: a resposta aparece na tela antes da tentativa.
- **Dependências.** Mapa instrumento ↔ exercício; F-M01-02.
- **Risco.** Parecer trava sequencial (P13). Mitigação: o véu sempre tem saída explícita e nomeada.

### F-M01-09 · Faixa com estado de verificação
- **O que faz.** Mostra barras de intervalo (mín.–máx.), não barras cheias, com o selo "faixas do módulo · verificação pendente" (P20) e o ponto calculado pelo learner sobreposto. Quando uma fonte autoritativa for registrada, o selo passa a mostrar a ficha.
- **Por que vale.** Permite usar a figura cf-chart da A08 sem transformar valores contestados em verdade. O padrão serve a qualquer "valores típicos" do currículo.
- **Dependências.** Modelo de dados de fonte (§9); fluxo de content QA.
- **Risco.** Com 7 categorias, a figura excede a heurística de 4. Mitigação: uma série em destaque (a do ponto do learner) e o resto neutro.

### F-M01-10 · Decisão com "não é possível concluir"
- **O que faz.** A decisão tem três saídas (sim · não · não é possível concluir) e uma justificativa curta obrigatória. As consequências e a referência só aparecem depois do registro (C8), e a referência cita o trecho da fonte que ampara a resposta.
- **Por que vale.** O M01 insiste em "não prometer economia sem 12 meses" (gabarito Ex·04, Caso, callout 7.5). Treinar a abstenção fundamentada é o hábito central do módulo e reconstrói o fechamento que o P7 remove.
- **Dependências.** Evento de decisão com texto (§9).
- **Risco.** "Não é possível concluir" virar resposta-coringa. Mitigação: a justificativa precisa nomear o dado que falta.

### F-M01-11 · Fio de retorno entre aulas
- **O que faz.** Quando uma aula promete retomar um ponto adiante ("voltaremos na Aula 09"), a aula de destino abre com o item daquela aula como recuperação (C10), mostrando a origem e sem a resposta antiga.
- **Por que vale.** Cumpre promessas que a própria fonte deixou em aberto: a 3.5 promete a A09, e a A09 não retoma frequência. A recuperação passa a seguir a lógica do conteúdo, não só a ordem das aulas.
- **Dependências.** Registro de itens por aula; mapa de promessas textuais (derivado, revisável).
- **Risco.** Excesso de retornos. Mitigação: no máximo 1 por abertura.

## Do estudo do M04 (2026-09-17) — ver `aulas/m04.json`

Reforça features já registradas, sem duplicar: **F-M05-4** (saídas textuais nomeadas: o M04 perde seis, entre elas "Usina marginal" e "Mês crítico", que são respostas de previsão), **F-M12-1** (selo datado: os limites do PLD de 2026 e o LRCAP 2026 são números vivos) e **F-M12-7** (banco de recuperação por erros comuns: o §Erros do M04 tem 10 itens).

### F-M04-1 · Pilha de oferta viva
- **O que faz.** Figura programática da ordem de mérito: usinas como degraus (largura = MW, altura = R$/MWh), linha vertical da demanda, preço = altura do degrau cortado, área de margem inframarginal por usina. Os controles do instrumento movem degraus e a linha, e o valor da água faz o degrau da hidráulica trocar de lugar com o do gás.
- **Por que vale.** É a forma que a tese de formação de preço afirma ("a última usina define o preço", "a solar desloca a curva"). Serve a pelo menos três aulas: M02·A05 (despacho), M03·A06 ("A pilha de CVU") e M04·A01. Hoje nenhuma das três desenha a pilha.
- **Dependências.** Frota e CVUs do cenário no dado do instrumento (hoje só no calculador); saída categórica da usina marginal (F-M05-4); componente de figura com rótulo direto a 390.
- **Risco.** Médio. Ler a pilha como despacho real: a legenda precisa trazer a nota "A fila real" da fonte (despacho real = ordem econômica + restrições…).

### F-M04-2 · Marca de previsão dentro da figura
- **O que faz.** A previsão registrada na abertura aparece como marca na própria figura do instrumento (um degrau apontado, um mês marcado, um valor no eixo), ao lado do calculado, e fica visível enquanto o learner explora.
- **Por que vale.** C5 pede previsto × calculado no mesmo cenário. Um cartão separado obriga a comparar de memória; a marca na figura mostra o erro no lugar onde ele acontece. No M04 serve a A01 (usina marginal), A02 (mês do pico), A04 (corte e média) e A06 (custo efetivo).
- **Dependências.** Registro de previsão (§9); figuras desenhadas; saídas categóricas.
- **Risco.** Baixo. Distinguir previsto de calculado por forma e palavra, nunca por cor (S2).

### F-M04-3 · Diagrama de resultado com inclinação controlada
- **O que faz.** Gráfico "custo efetivo × preço de referência" derivado da fórmula do instrumento. A diagonal sem proteção fica fixa, e a reta da posição atual gira conforme o volume travado. Horizontal no volume igual ao consumo; inclinação invertida acima dele, com o rótulo "posição direcional" da própria fonte.
- **Por que vale.** O INST 06 do M04 não desenha nada, mas a nota "Teste de sanidade" promete a curva (C5, forma prometida). O mesmo desenho serve a qualquer aula de hedge ou de contrato por diferença (M09, M10). É parente de F-M14-7 (retas de sensibilidade), aplicado a payoff.
- **Dependências.** Nenhuma de dado: a fórmula já está no calculador. Precisa de figura com controle acoplado.
- **Risco.** Baixo. Collar e opção sem parâmetros na fonte só podem aparecer como esquema sem números.

### F-M04-4 · Alternância de regra de liquidação no leilão
- **O que faz.** Na curva de lances, uma alternância "por lance ↔ preço uniforme" pinta a faixa entre o preço médio e o de corte como valor que muda de lado, em R$/MWh.
- **Por que vale.** A fonte diz que "a regra do edital, não a teoria" decide essa transferência e que ela "vale bilhões", mas o instrumento só calcula a média por lance. A alternância usa só as definições do bloco 4.1; nenhum fato novo.
- **Dependências.** Curva de lances desenhada; rótulo de camada Alexandria na alternância.
- **Risco.** Baixo. Não converter para R$/ano sem a hipótese de MW médios, que o instrumento não declara (o Ex 06 declara).

### F-M04-5 · Política do learner que desenha limites
- **O que faz.** Um cartão "política de risco de uma página" em que o learner escreve limites (percentual mínimo contratado, exposição máxima em R$ no cenário de estresse). Os números viram linhas no gráfico do instrumento, e a prancha indica qual critério a carteira atual cumpre e qual viola.
- **Por que vale.** A A07 do M04 ensina que "a proposta cabe na política?" substitui "o preço está bom?", e o Ex 09 mostra que um critério não garante o outro. O ato "decidir com justificativa" ganha objeto próprio e rastro (S6). Reaproveitável em M09 e M10.
- **Dependências.** Persistência de resposta estruturada (§9); gráfico com linhas de referência; parâmetros de exemplo sempre com origem (os do Ex 09 são de exercício, não norma).
- **Risco.** Médio. Pode parecer recomendação de política real: rotular como exercício e nunca sugerir limites "corretos".

### F-M04-6 · Term sheet esquemático anotado
- **O que faz.** Um documento-esquema (camada Alexandria, sem partes, marcas ou valores reais) cujas cláusulas são âncoras. O learner marca a cláusula que dói antes de abrir a anotação ("o que decide / onde costuma doer", texto da fonte).
- **Por que vale.** A tese da M04·A05 é que o preço é uma linha entre treze. O documento mostra isso pela própria composição. Serve também à leitura de proposta da A07 e a módulos de contratação. É parente de F-M11-1 (documento anotado).
- **Dependências.** Tabela de cláusulas estruturada no dado; registro da marcação; disclosure acessível a 390.
- **Risco.** Médio. Documento com cara de contrato real: aviso visível de esquema didático e nenhuma semelhança com modelo de empresa existente.

### F-M04-7 · Aviso de limite do modelo
- **O que faz.** Quando um simulador didático sai do domínio em que a aula vale (ex.: PLD mensal acima do teto estrutural que a própria aula diz limitar a média), a prancha mostra uma linha de metadado: "o modelo não aplica esta regra; o valor real ficaria limitado". O número não é escondido nem alterado.
- **Por que vale.** No M04, o INST 02 e o INST 06 produzem valores que contradizem a regra ensinada na A02. Sem o aviso, o instrumento ensina o contrário da prosa.
- **Dependências.** Declaração de domínio por instrumento no dado (faixas e regras não representadas, a partir do "disc" da fonte); revisão de content QA.
- **Risco.** Baixo. O texto do aviso é camada Alexandria e passa por revisão técnica (P6).

### F-M04-8 · Contabilidade de uso das questões com origem declarada
- **O que faz.** Cada questão do quiz que declara a aula de origem (no M04, 9 de 10) recebe um destino único: checagem na aula, recuperação posterior ou avaliação do módulo. O sistema impede o mesmo item em dois papéis e mostra ao editor o saldo por aula.
- **Por que vale.** C10 exige que questão usada saia da avaliação, e as questões com origem declarada são o melhor material de checagem e recuperação sem inventar item. No M04, a A07 não tem nenhuma, e o saldo torna essa lacuna visível.
- **Dependências.** Extração do §Quiz para dado estruturado (§9); campo de destino; decisão editorial por módulo.
- **Risco.** Médio. Tirar itens da avaliação pode empobrecê-la; a decisão é do Founder, por módulo.

## Do estudo do M06 (2026-09-17) — ver `aulas/m06.json`

Reuso sem duplicar: **F-M05-1** (régua persistente) é a mecânica da *régua dos seis* do M06, que aparece aplicada na A02 (1934–1945), na A03 (1996–2000, ex-03) e na A04 (três regimes). A extensão própria do M06 está em F-M06-5. **F-M12-2** (régua viva) serve à faixa do tempo do bloco: os 14 marcos do Inst·01, com o segmento da aula aceso. **F-M12-5** (classificação pós-tentativa) cobre "racionamento × apagão" (A03), "mudou × não mudou" (A04) e "controle × marca × regra" (A06). **F-M12-7 / F-M14-5** cobrem os 16 pares do §Erros do M06, já mapeados por aula no estudo. **F-M12-1** (selo datado) cobre os números vivos da A06 (participação da União, vetos e regulamentação da Lei 15.269). **F-M05-5** cobre os seis explicadores em três níveis.

### F-M06-1 · Ficha de divergência entre fontes legítimas
- **O que faz.** Quando a fonte declara duas leituras legítimas de um mesmo número (Light 1996: cerca de R$ 2,2 bi na literatura acadêmica × cerca de US$ 2,26 bi nos registros da época; participação da União: capital votante × capital total), mostra as leituras lado a lado. Cada uma traz o que mede (moeda, perímetro, recorte), a origem e a data de verificação, com a linha "não são contraditórias; medem coisas diferentes" quando a fonte diz isso. Nenhuma é escolhida como "o valor".
- **Por que vale.** Substitui a caixa de aviso genérica ("números vivos") por um objeto que ensina a ler fonte, que é a disciplina declarada do §Ref do M06. Aplica P20 fora do M01 e reaparece em qualquer módulo com valores de privatização, participação ou passivo.
- **Dependências.** Modelo de dado de fonte (§9) com campos `mede` e `recorte`; F-M12-1 para a data; Biblioteca com ficha de cada origem.
- **Risco.** Parecer indecisão do produto. O título da ficha deve afirmar a regra ("valor exige checagem no momento do uso"), não a dúvida.

### F-M06-2 · Cadeia de quatro elos em modo recuperação
- **O que faz.** Para itens estruturados como cadeia (problema revelado → resposta institucional → cicatriz que opera hoje → risco novo; 11 itens no Inst·08), o learner escolhe um item e escreve os quatro elos de memória. Só depois do registro os quatro quadros da fonte abrem ao lado, para comparação elo a elo e autoavaliação em três níveis. Cada item tem período, que aponta a aula de origem para o próximo passo "Rever".
- **Por que vale.** A fonte diz que esse mapa é o que o learner precisa reconstruir de cabeça, e hoje ele é um select que revela tudo. Isso transforma a aula de síntese em recuperação do módulo inteiro (C10) sem inventar questão, e também serve ao ex-10.
- **Dependências.** Persistência de texto por learner (§9); vínculo período → aula (camada Alexandria, revisável); disc da fonte visível ("estrutura de raciocínio, não sentença").
- **Risco.** Texto aberto demais num módulo que já tem muitos discursivos. Limitar a 3 itens por sessão e aceitar elos curtos.

### F-M06-3 · Escada de elegibilidade com a unidade do learner
- **O que faz.** Desenha a escada de carga mínima para o mercado livre (1995–2028, eixo log) e deixa o learner pôr uma unidade (carga, grupo A/B, energia convencional/incentivada). O instrumento marca o ano de entrada e a norma. Os degraus de 2027 e 2028 usam outro traço e o rótulo "prazo legal, condicionado a regulamentação". Os valores ficam só na sessão.
- **Por que vale.** É o Inst·07 com a forma que o nome promete e com os dois seletores que a porta perdeu (sem eles, a baixa tensão do ex-09 é inalcançável). Liga a aula ao Caso Operação A (C.3 usa exatamente este instrumento) e a M09/M10.
- **Dependências.** Portar os seletores; saídas textuais nomeadas (F-M05-4); dado da escada com norma por degrau e estado (vigente × prazo).
- **Risco.** Ser lido como consulta de enquadramento real. A nota da fonte ("verifique o enquadramento concreto na norma vigente antes de qualquer uso comercial") fica junto do gráfico. Não pedir dado identificável da empresa do learner.

### F-M06-4 · Biografia institucional (linha de vida de uma empresa)
- **O que faz.** Faixa temporal de uma organização com os regimes de propriedade como segmentos com silhueta e palavra (Light: capital canadense 1904 → Estado 1979 → privatização 1996 → trocas de controlador → recuperação judicial 2023; Eletrobras: 1962 → capitalização 2022 → nova marca 2025). Eventos de marca ficam em traço distinto dos de controle. O ato é ordenar antes de revelar.
- **Por que vale.** A fonte chama a trajetória da Light de "o argumento mais concreto deste bloco inteiro". Ela prova o padrão de ciclos melhor que qualquer parágrafo e separa visualmente controle de marca (A06).
- **Dependências.** Dado de eventos com tipo (controle, marca, regra) e fonte; F-M12-5 para o ato de ordenar.
- **Risco.** Completar lacunas da fonte ("sucessivas trocas de controlador" não tem nomes nem datas). Segmento "não declarado" em vez de inventar.

### F-M06-5 · Comparador de regimes lado a lado
- **O que faz.** Grade com a régua do módulo nas linhas e os regimes históricos nas colunas (M06: estatal · transição · híbrido, mais "quem carrega o risco de expansão" e "modo de falha"). Abaixo, uma curva de trade-off por regime (risco de faltar × sobrar por horizonte), com o mínimo de cada um marcado. Uma coluna opcional "sua leitura" traz o que o learner preencheu nas aulas anteriores.
- **Por que vale.** O argumento da A04 é que "o ótimo se desloca com o regime" (estatal 4 anos, transição 6, híbrido 3, pelas fórmulas da fonte), e isso só se vê com os três ao mesmo tempo. Hoje o código calcula um regime só.
- **Dependências.** Portar o seletor de regime e a grade (REG da fonte); F-M05-1 para a coluna do learner; desenho das curvas (§9).
- **Risco.** Índices relativos lidos como medição. Rótulo "escala relativa sem unidade" junto da figura; nada de cor por regime que pareça semáforo.

### F-M06-6 · Medidor com faixas de veredito da fonte
- **O que faz.** Medidor linear (vertical a 1440, horizontal a 390) em que as faixas dos vereditos literais do instrumento (Inst·04: 0 · 8 · 20 · 40%) são marcadas por fio e palavra ("voluntário", "programa compulsório", "redesenho industrial", "interrupção programada"). O valor calculado e o previsto aparecem como duas marcas de forma diferente.
- **Por que vale.** Cumpre a forma prometida por instrumentos chamados "termômetro", "régua" ou "medidor", que hoje não desenham, e torna legível o salto entre faixas. As faixas já existem nos vereditos da fonte; nada é inventado.
- **Dependências.** Exposição das faixas de veredito como dado (hoje estão embutidas em `if`); previsto × calculado.
- **Risco.** Faixas lidas como tolerância ou norma (P6). Legenda: "faixas de leitura deste instrumento didático".

### F-M06-7 · Varredura de faixa inerte (interno, content QA)
- **O que faz.** Script que percorre cada controle numérico de cada instrumento, com os demais no padrão, e lista trechos da faixa em que nenhuma saída nem veredito muda (no M06: margem firme de 8% a 30% no Inst·04). Também sinaliza controles cujo efeito some por teto (Inst·06: parcela protegida acima de 85% nos ciclos 2–3).
- **Por que vale.** Um controle que se move sem consequência é "controle inerte" (§6) e ensina errado: sugere que a variável não importa, quando o modelo é que satura. A decisão (declarar na nota ou limitar a faixa) é de conteúdo, mas o achado deve ser mecânico.
- **Dependências.** Calculadores como funções puras (já são); lista de exceções justificadas.
- **Risco.** Falso positivo em controles que só mudam parte das saídas (ex.: investimento-índice do Inst·02 não muda a cobertura, mas muda o custo de reposição). Comparar todas as saídas, inclusive textuais.

### F-M06-8 · Restauração de frases-âncora (interno, content QA)
- **O que faz.** Detecta no conteúdo portado as marcas de destaque perdidas (no M06, `span.hl` virou `</b>` solto em 4 blocos) e as converte num bloco "frase-âncora" tipográfico, com no máximo uma por aula.
- **Por que vale.** As frases destacadas pela fonte são a tese de cada aula ("informação que existia e não virou decisão"; "sistema de rateio, não caixa com fundo próprio"). Elas servem de pull-quote e de alvo de recuperação, e hoje são HTML inválido.
- **Dependências.** Tipo de bloco novo em `AulaBloco` (FOUNDRY) ou marcação inline; varredura dos 17 módulos.
- **Risco.** Excesso de citações (S2: raras). Limitar a uma por aula e só quando a fonte destacou.

---

## Do estudo do M07 (2026-09-17) — ver `aulas/m07.json`

Relacionadas e não repetidas aqui: F-M12-1 (selo datado; o M07 é todo de números vivos), F-M12-5 (classificação com revelação pós-tentativa), F-M01-02 (quadro previsto × calculado fixo), F-M14-3 (calendário de 12 meses), F-M06-8 (frases-âncora: o M07 tem 14 `</b>` órfãos), F-M11-1 (documento anotado).

### F-M07-1 · Mapa institucional como objeto-mundo do módulo
- **O que faz.** O Inst·01 (8 nós; fluxo de autoridade × fluxo de dado) vira o palco persistente do M07. Cada aula abre com o seu nó aceso ("você está aqui"). A A06 acrescenta um anel de periferia (BNDES, órgão ambiental, ANA, TCU, ANP, tirados da tabela 6.3 da fonte). A A07 desenha sobre ele a rota de 12 etapas de um ato real. Na segunda passagem, o learner prevê a ficha do nó antes de clicar, que é o uso que o §MAP da fonte propõe.
- **Por que vale.** É a "cartografia que trabalha" do teste anti-LMS (marcador 6) e dá posição ao learner num módulo sem física nem conta. Converte o SVG da fonte, hoje não portado, na figura central do módulo.
- **Dependências.** Porte do SVG i1 (nós, arestas e rótulos são literais do script); `aulaId` por nó; extensão de periferia marcada como camada Alexandria; glifos de estado (S3).
- **Risco.** Excesso de setas no modo "os dois fluxos" (a fonte já oculta rótulos nesse modo). Mitigar: um fluxo por vez a 390 e, no máximo, 4 categorias visuais (S2).

### F-M07-2 · Roteador com pré-compromisso por campo
- **O que faz.** Em exploradores de vários campos (i8: órgão, instrumento, rito, publicação, cadência, contestação), o learner escolhe cada campo antes de revelar e depois vê a comparação campo a campo, com a "leitura" da fonte como o que acrescenta. As opções vêm dos valores de outros itens do próprio instrumento, sem distrator inventado.
- **Por que vale.** A fonte pede isso textualmente ("responda os seis campos de cabeça, e só então clique"). Transforma 7 exploradores do M07 (e os de outros módulos) em atos C9 sem texto aberto.
- **Dependências.** Restaurar os rótulos dos campos (hoje perdidos em i8 e i9) e as linhas truncadas (i2, i3, i5, i7); registro de tentativa por campo (§9); F-M12-5.
- **Risco.** Opções geradas de outros itens podem ser trivialmente elimináveis. Revisão editorial das opções por instrumento.

### F-M07-3 · Linha do tempo de prazos com colchetes de janela
- **O que faz.** Em simuladores de prazo (M07 i4 e i6), desenha as etapas empilhadas num eixo em dias, com colchetes nomeados ("janela de influência", "aviso prévio", "contestação", "folga até o aporte") e marcos ("deliberação", "prévia"). Os segmentos de participação são distinguidos por hachura, não só por cor.
- **Por que vale.** É a forma prometida pelos nomes ("rito e janela", "régua do ciclo") e existe na fonte (`#i4-bars`, `#i6-bars`). O colchete torna visível a razão que o veredito calcula.
- **Dependências.** Definição dos colchetes como dado (a fonte define janela = tomada + consulta; folga = contestação + aporte); tokens no lugar das cores da fonte (S2); porte do rótulo "Regime".
- **Risco.** Confundir com cronograma real; a fonte declara que é didático. A legenda carrega "cenário didático; não usar para prazo real".

### F-M07-4 · Comparador de dois itens
- **O que faz.** Um explorador chamado "comparador" põe dois itens lado a lado, alinhados por campo (ex.: portaria × resolução normativa: quem emite, o que pode dispor, o que não pode, prazo de alteração, onde publica, quem contesta).
- **Por que vale.** Cumpre a forma que o nome promete (C5). O erro que a aula corrige é confundir dois instrumentos, e confusão se desfaz em paralelo, não em sequência.
- **Dependências.** Linhas completas do i2 (5 de 6 perdidas hoje); layout empilhado a 390 com rótulo repetido.
- **Risco.** Largura a 1440 com textos longos. Limitar a 2 itens e usar disclosure por campo.

### F-M07-5 · Trilhos paralelos com caminho crítico
- **O que faz.** Diagrama de N trilhos independentes (ex.: outorga, licença ambiental, acesso ao sistema, habilitação comercial), cada um com órgão e duração qualitativa, em que o trilho mais lento define a data do projeto. O learner põe travamentos no trilho certo.
- **Por que vale.** Desenha a relação que a fonte afirma ("o projeto anda na velocidade do mais lento") sem inventar prazo. É reusável em M09 (migração), M11 e M15 (projetos).
- **Dependências.** Duração apenas ordinal ou qualitativa quando a fonte não dá número; glifo "mais lento" com silhueta e palavra.
- **Risco.** Leitura como cronograma real. Sem eixo numérico quando a fonte não tem número.

### F-M07-6 · Retorno por aula a partir do feedback da avaliação
- **O que faz.** Lê os ponteiros que a própria fonte põe no feedback do quiz ("Aula 03, Inst·04 e Inst·08") e, em "não atende", cria itens "a revisar" que levam à seção e ao instrumento citados. Remove da avaliação a questão já usada como recuperação na aula (C10).
- **Por que vale.** Dá próximo passo dependente do resultado com vínculo da fonte, sem inventar mapeamento aula↔questão. No M07, as 10 questões têm ponteiro.
- **Dependências.** Extração do quiz com o campo de feedback; parser de "Aula NN / Inst·NN"; persistência de "a revisar" (§9).
- **Risco.** Ponteiros com várias aulas. Mostrar todas, na ordem citada.

### F-M07-7 · Auditoria de fidelidade dos exploradores (interno, content QA)
- **O que faz.** Script que compara, por instrumento, os arrays `r[]`/`c[]` e as camadas (ex.: `FIXO` do i10) do `<script>` da fonte com o dado portado, e lista campos e rótulos ausentes e artefatos (ex.: contador `e:3` virando texto "3").
- **Por que vale.** No M07, 6 dos 9 exploradores de aula perdem o que o próprio intro promete. É defeito mecânico e silencioso, que só aparece lendo a fonte.
- **Dependências.** Extratores `extraction/m07/extratores` (já leem os literais); lista de instrumentos por módulo.
- **Risco.** Estruturas de script diferentes entre módulos. Um adaptador por vocabulário (M01–03 × M04–07…).

### F-M07-8 · Alcançabilidade de veredito (interno, content QA)
- **O que faz.** Estende F-M06-7: para cada ramo de veredito de um simulador, busca uma combinação de controles dentro dos limites que o alcance, e lista os ramos inalcançáveis. No M07, o ramo "Contestação existe, folga de caixa não" do i6 é inalcançável: exige c ≥ 4 e d ≥ 1, e então c + d ≥ 5.
- **Por que vale.** Evita propor como meta de ato um estado impossível e aponta lógica morta a declarar ou corrigir na camada editorial.
- **Dependências.** Calculadores como funções puras; varredura em grade ou solver simples por instrumento.
- **Risco.** Explosão combinatória com muitos controles. Usar grade grossa e, depois, refinar só nas fronteiras dos ramos.

### F-M07-9 · Filtro de conteúdo interno na prosa do learner (interno)
- **O que faz.** Lint sobre o conteúdo das aulas que sinaliza blocos e termos que não podem chegar ao learner: notas "Onde isso entra no produto", "GridAlpha" (P24), "backend", "endpoint", "Trava N" (P23), e seções inteiras de arquitetura de produto (M07 §7.5). Propõe exclusão ou rótulo semântico.
- **Por que vale.** No M07 esse conteúdo está misturado à prosa de aula (7.3, 7.5, tese 0.4), e S4 reprova a peça por palavra proibida.
- **Dependências.** Lista de termos de S4 e P24; decisão editorial de substituição (P7).
- **Risco.** Falso positivo em uso legítimo ("dados abertos" é conteúdo, "endpoint do backend" não é). Revisão humana por ocorrência.

---

## Do estudo do M09 (2026-09-17) — ver `aulas/m09.json`

Não repito o que já está registrado. O M09 também precisa de F-M12-1 (selo datado: todas as notas "números vivos" são
de 1º/8/2026), F-M14-6 (leitura lateral: INST·03, fichas da A04, INST·06), F-M11-1 e F-M04-6 (documento anotado:
proposta-espécime da A04) e F-M01-10 (três saídas). Abaixo, só o que é novo ou estende essas features.

### F-M09-1 · Portão condicionado de prazo legal
- **O que faz.** Desenha um prazo previsto em lei como teto tracejado, com um portão de N travas antes dele. Cada trava
  tem nome, estado editável ou verificado, data de consulta e link da fonte. O texto de saída nunca afirma a data como
  certa, mesmo com todas as travas abertas: nesse caso diz "falta ato regulatório que implemente".
- **Por que vale.** Dá forma ao erro mais repetido do M09 ("a partir de tal data poderá", Erro 18, Quiz Q2). É a forma
  que o nome do INST·04 promete ("cronograma condicionado") e não desenha. Serve a qualquer regra com prazo
  condicionado (M12, M14, a abertura da baixa tensão na Home).
- **Dependências.** F-M12-1; campos `prazoLegal`, `marcoZero`, `travas[]`; INST·04 portado (§9).
- **Risco.** O learner ler o teto como previsão. Mitigação: o teto é sempre tracejado e rotulado "teto previsto em
  lei", nunca "data de abertura".

### F-M09-2 · Mesa de triagem com bandejas de veredito
- **O que faz.** Estende F-M01-10 para vários casos. Dossiês curtos (fonte ou camada Alexandria, marcados como tais)
  passam por um roteador de perguntas em que "não sei" é resposta de primeira classe. O learner deposita cada dossiê
  numa de três bandejas de mesmo peso visual antes do diagnóstico. A saída inconclusiva sempre vem com a lista nomeada
  do que falta.
- **Por que vale.** O critério de domínio do M09 é a simetria dos três vereditos, e a fonte diz que o terceiro é o mais
  frequente. Três bandejas iguais tornam essa simetria visível. O Caso Operação A e o Ex.5 já fornecem dois dossiês
  literais.
- **Dependências.** INST·09 portado como função pura (tipo `dado` × `imped`); evento de veredito com justificativa
  (§9); revisão P3 dos dossiês da camada Alexandria.
- **Risco.** Virar quiz de três botões. Mitigação: justificativa obrigatória citando o sinal ou a lacuna, e nunca
  chamar de jogo (P25).

### F-M09-3 · Classificador de recorte
- **O que faz.** Uma afirmação única ("a judicialização ainda dura") aparece com K recortes explícitos. Para cada um,
  o learner marca verdadeiro, falso ou parcialmente verdadeiro, e só então vê a leitura da fonte por recorte.
- **Por que vale.** A fonte nomeia "declarar o recorte" como competência (M09·A07, checklist 26, Voz 39), e a mesma
  habilidade aparece no percentual de participação no consumo (A08, "números diferentes podem estar todos corretos").
  É parente de F-M14-5, mas o eixo aqui é o objeto da afirmação, não o defeito do enunciado.
- **Dependências.** Tipo de atividade com K sub-itens categóricos; registro de tentativa.
- **Risco.** Recortes inventados. Só usar onde a fonte separa os recortes literalmente.

### F-M09-4 · Bancada de teto em camadas
- **O que faz.** Mostra 24 preços horários de uma série ilustrativa, a linha do teto horário, a do teto estrutural
  (sobre a média diária) e a do piso. O learner eleva preços e, quando a média cruza o estrutural, a série inteira é
  comprimida proporcionalmente, com antes e depois sobrepostos.
- **Por que vale.** Desenha a afirmação mais contraintuitiva da A06 ("o horário limita o pior instante; o estrutural
  limita a persistência", Quiz Q8). É uma forma que a fonte afirma e nunca desenha.
- **Dependências.** Limites anuais como dado datado (F-M12-1); verificação nas regras de comercialização do algoritmo
  exato de ajuste com piso (a fonte só diz "uniforme e proporcional, respeitado o piso, por submercado").
- **Risco.** Série ilustrativa lida como histórica, ou simplificação lida como regra. Rótulo "série ilustrativa" e
  "simplificação" junto da figura (S4).

### F-M09-5 · Condomínio de participantes (rateio proporcional)
- **O que faz.** Mostra N participantes, cada um com produção própria contra referência. Um poço comum soma e
  redistribui proporcionalmente à referência, com um fator desenhado como razão. Tem dois estados canônicos:
  compensação individual e escassez coletiva. Uma lupa abre a posição contratual de um participante (INST·08).
- **Por que vale.** Resolve a confusão central da A07 ("o mecanismo garante a energia de cada usina", Erro 13), que o
  instrumento de um participante só não mostra. A mesma forma serve a outros rateios do currículo (encargos rateados
  por consumo, déficit do supridor de última instância rateado entre livres, sobrecontratação rateada entre ambientes).
- **Dependências.** Números hipotéticos rotulados (camada Alexandria); correção da convenção "posição comprada ×
  vendida" (content QA do M09).
- **Risco.** Um participante hipotético lido como usina real. Nunca nomear usina e nunca usar imagem com aparência
  documental.

### F-M09-6 · Desmontador de fatura
- **O que faz.** Mostra uma fatura esquemática, sem valores, que se desmonta em linhas. O learner leva cada linha a
  uma coluna de destino (no M09: troca de fornecedor · muda de mecanismo · permanece devido · passa a existir), com o
  placar por coluna derivado dos dados e o "erro de leitura mais comum" de cada linha revelado depois.
- **Por que vale.** A tese da A01 é a proporção 1 em 10, e só a decomposição a mostra. É reaproveitável no M10
  (estrutura da conta), onde a fonte promete a composição real, e no Conta de Luz Express, sem citá-lo ao learner
  (P7).
- **Dependências.** Correção da contagem divergente do INST·02; largura categórica, não proporcional, enquanto a fonte
  não der valores.
- **Risco.** Parecer proporcional a valor. Legenda fixa "sem proporção de valor".

### F-M09-7 · Matriz-palco que acende pela leitura
- **O que faz.** Estende F-M14-6 e F-M11-7. Uma matriz completa (no M09: 6 estruturas × 7 riscos, 4 campos por
  célula) fica visível desde o início da aula. Cada seção de prosa acende a sua linha. Glifos de silhueta marcam
  "quem carrega" (comprador · vendedor · compartilhado), e o learner os preenche antes de abrir a célula.
- **Por que vale.** A A05 diz que "uma lista de riscos é inútil; o que decide é a matriz", mas hoje entrega 7 seções
  de prosa antes de mostrar uma célula por vez. O palco cumpre o "produto cartesiano completo" prometido pelo INST·06.
- **Dependências.** Rótulo categórico derivado das células em prosa (camada Alexandria, revisão P3/P11); 42 × 4 campos
  portados do script.
- **Risco.** Densidade a 1440 (faixa da Aula 12–25) e ilegibilidade a 390. A 390 vira seletor de linha com uma
  estrutura por item.

### F-M09-8 · Registro de reposição de instrumento (interno)
- **O que faz.** Cada instrumento guarda `secaoFonte` (onde estava no HTML), `aulaProduto` e `depoisDoBloco` (onde a
  Alexandria o põe), e o motivo da mudança. O critic vê a diferença e o QA confere se nenhum instrumento ficou como
  apêndice (Regra-mãe 1).
- **Por que vale.** No M09, 5 dos 11 instrumentos estão no fim da prosa ou fora do ponto que os invoca (INST·05, 07,
  08, 10, 11), e o INST·10 pertence melhor à A06. Mover sem registro apaga a proveniência (regra das duas camadas).
- **Dependências.** Campo de posição no tipo de instrumento (FOUNDRY); decisão do Founder para mudanças entre aulas.
- **Risco.** Reposicionamento arbitrário. Exigir um motivo ligado a C5 ou à Regra-mãe em cada mudança.

---

## Do estudo do M15 (2026-09-17) — ver `aulas/m15.json`

Já cobertos por features anteriores e reaproveitados no M15, sem duplicar aqui:

| Feature anterior | Onde entra no M15 |
|---|---|
| F-M12-1, selo datado | tabelas de estado de A04 e A07 |
| F-M14-4, fluxo com conservação | Sankey do gás em A06 |
| F-M14-5, banca de enunciados | INST·10 de A09, que também revela antes da tentativa |
| F-M14-6, matriz de fichas | seis Fichas de elo |
| F-M01-02, quadro previsto × calculado | INST·03, 04, 06, 07 e 09 |
| F-M01-11, fio de retorno | "Volte a esta ficha depois da Aula 04" |
| F-M04-8, contabilidade de questões | o quiz do M15 colide com 7 previsões propostas |

### F-M15-1 · Espinha da cadeia como localizador de aula
- **O que faz.** Mostra uma faixa com os 9 elos do §MAP (reservatório → consumo/termelétrica) no topo de cada aula do módulo. Os elos que a aula toca ficam marcados com silhueta. Ao focar um elo, abre a ficha do INST·01 com as cinco dimensões dele (recebe, titularidade, grandeza, preço, órgão). A faixa se reagrupa pelas quatro chaves da fonte (segmento, regime jurídico, acoplamento elétrico, natureza do preço). O ato "localizar no mapa" pede ao learner marcar em qual elo um número citado nasceu.
- **Por que vale.**
  - Dá território ao módulo: é o marcador 1 do teste anti-LMS.
  - Transforma o INST·01, hoje destinado a "Recursos do Módulo", em orientação constante.
  - Deixa as seis Fichas de elo posicionadas na mesma cartografia.
  - Serve a M13, M14 e M16, que também têm cadeias.
- **Dependências.**
  - Dado de elo com `aulaIds` (derivado e revisável).
  - O INST·01 com saída estruturada (hoje só texto).
  - Glifos de estado (S3).
- **Risco.**
  - Pode virar decoração repetida. Cada aula usa a faixa em no máximo um ato.
  - A 390, a faixa de 9 elos precisa de rolagem própria ou de uma forma compacta (elo atual ± 1).

### F-M15-2 · Lacuna com referência de outro aparato e retorno encomendado
- **O que faz.** Transforma o "Preencha" das Fichas de elo em campo de resposta. A referência vem de outro objeto da fonte: o campo `nao` do elo correspondente no script do INST·01. Quando a fonte encomenda o retorno ("Volte a esta ficha depois da Aula 04"; "Compare com a lacuna que você escreveu na ficha do campo produtor"), a aula de destino reabre a lacuna. O learner escreve de novo, e só então vê o texto antigo, a referência e o critério "são da mesma família?".
- **Por que vale.**
  - É um ato autêntico que a própria fonte pede e que o código perdeu (a nota vira prosa com reticências).
  - Tentativa → referência sem inventar gabarito.
  - Recuperação espaçada com origem visível (C7, C10).
  - Existe em 6 fichas só no M15, e as fichas de campo fixo reaparecem em M07–M14.
- **Dependências.**
  - Registro de texto (§9).
  - Mapa ficha → elo → referência (derivado e revisável).
  - Mapa das promessas de retorno (F-M01-11).
  - Autoavaliação em três níveis.
- **Risco.** A referência do INST·01 às vezes é mais estreita que a pergunta da ficha. Mostrar "o que acrescenta", e nunca "certo/errado".

### F-M15-3 · Cascata com termo negativo, teto e estado de partida
- **O que faz.** É um gráfico em cascata de composição aditiva (camada 4 + mistura + federais + estadual + distribuição − subvenção). O termo negativo é desenhado abaixo da linha e tem teto declarado (subvenção ≤ tributos federais). O instrumento guarda o cenário de partida e mostra a variação por camada, e assim cumpre o veredito da fonte ("se recusa a atribuir a variação a uma única camada sem que você tenha mexido em uma só").
- **Por que vale.**
  - É a forma que o nome "Decompositor" promete e que o port não desenha.
  - Resolve o caso-âncora da A04 (+0,48 − 0,44).
  - Serve ao preço do gás em seis camadas (A06), ao GNL (A07, em modo esquemático) e à tarifa de energia (M02 e M09).
- **Dependências.**
  - Instrumento com estado anterior (hoje as calculadoras recebem só o estado atual).
  - Desenho de forma prometida (§9).
  - Correção ou declaração do QA do teto (0,44 > 0,42 no cenário).
- **Risco.** Quando o teto corta o valor digitado, a resposta diverge da prosa. Mostrar o corte explicitamente ("subvenção aplicada: 0,42 · teto = federais do cenário").

### F-M15-4 · Eixo de despacho com faixa inflexível
- **O que faz.** Mostra um eixo horizontal de custo (R$/MWh) com a marca do CVU da usina e a linha do custo marginal. As bandas "ordem de mérito" e "fora do mérito" são distinguidas por textura e palavra, sem vermelho e verde. Uma barra de geração separada mostra a zona inflexível (sem sinal econômico) e a zona que responde a mérito. Os quatro ramos do veredito da fonte viram estados visuais.
- **Por que vale.**
  - Desenha a relação central da Lente 03 e cumpre a forma que a fonte tinha (`ac-track`) e o port perdeu.
  - Recupera a saída "Posição vs. custo marginal", ausente de `outputs`.
  - É reutilizável no M08 e no M09 (ordem de mérito, PLD).
- **Dependências.**
  - Saída estruturada `ac-po` no instrumento.
  - Cenário didático rotulado (CMO 330 e inflexibilidade 40% não têm fonte).
  - Previsto × calculado com duas previsões.
- **Risco.** Ser lido como ordem de despacho real. A nota da fonte ("o eixo representa apenas a dimensão de custo") fica colada à figura.

### F-M15-5 · Escada ordinal de estados com posição datada
- **O que faz.** Mostra degraus ordenados, cada um com a evidência que o sustenta, e um marcador "estado em [data]" do objeto em discussão. Casos da fonte:
  - A09: indicação para estudo → leilão → contrato → licença de perfuração → descoberta → comercialidade → primeiro óleo, com os 86 blocos no 1º degrau em 04/08/2026;
  - A02: recurso → reserva → produção.

  O ato é ordenar os degraus e depois pôr o marcador no degrau certo.
- **Por que vale.**
  - A fonte nomeia o erro dominante ("a imprensa frequentemente os comprime em um só").
  - Uma sequência ordinal só é visível como escada.
  - Difere do F-M14-1: lá os estados coexistem, aqui eles se sucedem.
  - Reutilizável em licenciamento (M13) e em outorga e comissionamento (M08, M10).
- **Dependências.**
  - Componente de ordenação acessível (teclado, F-M01-03).
  - Selo datado (F-M12-1).
- **Risco.** Sugerir que todo objeto percorre todos os degraus. Mostrar degraus "não alcançados" como estado neutro, nunca como atraso.

### F-M15-6 · Colunas simétricas com "o que cada uma mede"
- **O que faz.** O confronto em duas colunas (`div.par`/`mot` da fonte) é renderizado com peso tipográfico, largura e ordem de leitura idênticos. A ordem das colunas alterna entre visitas. O ato não pede escolher lado: pede ligar cada coluna à grandeza que ela mede. Na A09, por exemplo: "custo e emissão por barril, com demanda dada" × "emissão acumulada, questionando a demanda". Uma checagem editorial interna compara a extensão das colunas e sinaliza assimetria, porque a fonte manda "se você achar um lado melhor escrito, releia o outro".
- **Por que vale.**
  - A neutralidade é gate editorial da fonte em A03, A04 e A09, e do M12 e M13.
  - O ato torna a neutralidade uma habilidade verificável, e não uma omissão.
  - Hoje o código achata as colunas em notas sequenciais, e a primeira lida parece a principal.
- **Dependências.** Renderizar `par`/`mot` como estrutura (o código já guarda o rótulo `ph` como label); registro da ligação.
- **Risco.** A alternância de ordem pode confundir a recuperação ("a coluna da esquerda"). Referir-se às colunas pelo nome, nunca pela posição.

### F-M15-7 · Ficha de fonte com posição declarada
- **O que faz.** A Biblioteca ganha a classe de fonte "parte interessada". Um número dessa classe só é exibido com nome da entidade, data e a linha "posição de parte interessada". Sem nome, o número fica fora do render, com a linha de metadado "fonte não nomeada na aula". A classe vale também para os interessados enumerados no protocolo da A09 (operadora, transportador, distribuidora…).
- **Por que vale.**
  - O M15 declara a regra ("citável como posição de parte interessada, com nome da entidade e data — nunca como origem de número neutro") e quebra a própria regra na A06: US$ 11,32 aparece sem o nome da entidade.
  - S4 e D5 pedem inteligência de fontes, e esta é a distinção mais útil para um learner de mercado.
- **Dependências.** Modelo de dado de fonte (§9) com `classe`, `interesse`, `data`; content QA para nomear a entidade.
- **Risco.** Rotular fonte como interessada é um juízo editorial. Precisa de revisão (P3/P11) e de critério escrito.

### F-M15-8 · Detector de referente perdido (interno, content QA)
- **O que faz.** Varre o corpo extraído em busca de frases que apontam para um objeto ausente, confrontando com o HTML-fonte. Exemplos:
  - "Entre as duas está o 2P";
  - "Quinhentos e quarenta e seis contra vinte e um";
  - "a tabela acima", "os dois números".

  Lista classe e trecho da estrutura não capturada (`div.dc`, no M15).
- **Por que vale.**
  - A cobertura por palavra do M15 fechou em 98,9% e mesmo assim perdeu os 4 cartões de dado que sustentam a prosa de A02 e A03.
  - Medir palavra não detecta um referente perdido.
  - O protocolo de extração já registra que a fonte renomeia estruturas a cada módulo.
- **Dependências.** Lista de padrões dêiticos em pt-BR; acesso ao HTML-fonte (só leitura); saída para `extraction/mNN`.
- **Risco.** Falsos positivos em dêiticos que apontam para prosa. É ferramenta de triagem, nunca gate automático.

---

## Do estudo do M13 (2026-09-17) — ver `aulas/m13.json`

Reaproveita, sem repetir: F-M01-08 (instrumento velado até a tentativa) para INST·05, 06 e 11; F-M12-5 (classificação com revelação pós-tentativa) para INST·06 e 09; F-M01-10 ("não é possível concluir") para o veredito do INST·02; F-M12-1 (selo de estado datado) para todos os números vivos e status societários do módulo; F-M14-6 (matriz de leitura lateral) para as seis fichas da A07.

### F-M13-1 · Muro do termo
- **O que faz.** Palco de linha do tempo para DCF com prazo: barras do fluxo descontado por ano até o termo contratual, um muro vertical no termo, a indenização esperada como marco no muro (valor × probabilidade, descontado) e a perpetuidade como traço fantasma depois do muro. O fluxo só atravessa o muro se o learner indicar o documento que dá o direito (cláusula, norma, decisão do regulador, aditivo assinado).
- **Por que vale.** Desenha a forma que o INST·03 promete ("com prazo definido") e transforma a frase da fonte "renovação é cenário até virar direito comprovável" num gesto com justificativa. Serve a qualquer ativo com direito datado (concessões, contratos de energia, outorgas).
- **Dependências.** Porte do INST·03; registro de decisão com justificativa (§9); ficha de fonte da TRRC e dos dados do BCB.
- **Risco.** A exigência do documento virar formulário burocrático; manter uma escolha fechada de quatro tipos + uma frase.

### F-M13-2 · Régua de cobertura com meta invertida
- **O que faz.** Régua horizontal de DSCR com as marcas do contrato (mínimo de covenant, gatilho de bloqueio) e os marcadores do projeto (base, sob choque); zonas nomeadas por hachura e palavra. No modo invertido, o learner arrasta o marcador "sob choque" até uma marca e a régua devolve a proporção de dívida que cabe.
- **Por que vale.** Desenha a forma que o INST·08 promete ("régua") e torna visível a tese da A05: capacidade de dívida é saída do cálculo de cobertura. A meta do cenário-padrão (65% de dívida para o DSCR sob choque passar de 1,35×) é derivada do instrumento, não uma tolerância inventada.
- **Dependências.** Porte do INST·08 com função inversa (resolver a proporção para um DSCR-alvo); registro de meta alcançada.
- **Risco.** Leitura da régua como nota de qualidade; a fonte diz que o DSCR é limite operacional com consequência contratual, e a legenda precisa dizer isso.

### F-M13-3 · Réguas duplas participação × voto, com modo ordinal
- **O que faz.** Duas barras 100% alinhadas (capital total, capital votante) com os mesmos donos e rótulos diretos; animação curta da fatia de um dono passando de uma régua para a outra. Quando a fonte só dá valores qualitativos ("relevante", "limitado", "maioria", "idêntica"), a figura entra em modo ordinal/esquemático e diz "sem percentual na fonte".
- **Por que vale.** A A04 inteira depende de ver que 68% do capital total pode ser 35,3% do votante. O modo ordinal impede que a figura invente percentuais nos três casos qualitativos do INST·07. Reutilizável em qualquer estrutura societária (A07, Caso — Operação A).
- **Dependências.** Porte do INST·07; dado com dono, classe de ação e data de verificação.
- **Risco.** Parecer precisão onde há aproximação ("cerca de"); mostrar "≈" e a data.

### F-M13-4 · Caderno de nove casas entre aulas
- **O que faz.** Área de escrita persistente (3 teses, 3 riscos, 3 lacunas) com subcampos obrigatórios por tipo (tese: mecanismo, âncora, contraponto, horizonte, condição; risco: evento, caminho até o caixa, mitigação e alerta; lacuna: dado ausente, onde procurar, impacto). Nasce no campo em branco das fichas da A07 e continua na A08. O estado de cada casa aparece por silhueta (vazia, rascunho, registrada, comparada). O andaime da fonte (INST·11) só abre como referência depois do registro.
- **Por que vale.** É o formato do critério do módulo. Cria continuidade real entre aulas e evita que o andaime ensine a copiar, que é o que a própria fonte diz querer evitar. A completude se mede por partes, não por contagem de caracteres (problema apontado em C8).
- **Dependências.** Persistência de respostas de texto por learner (§9); porte do INST·11 com ordem invertida; separação pergunta/resposta dos exercícios 05–07 e 10.
- **Risco.** Ser lido como prova de competência. Pela S3 e pela P14, conta como Praticado; o critério cronometrado é atividade recomendada e Demonstrado fica "ainda não avaliado".

### F-M13-5 · Razão desenhada (duas portas)
- **O que faz.** Primitiva para múltiplos: o numerador como barra empilhada e o denominador como cascata, lado a lado para dois múltiplos. Cada controle acende a porta por onde entra (numerador ou denominador).
- **Por que vale.** A A01 afirma que a alavancagem eleva EV/EBITDA e P/E por caminhos opostos; só a figura mostra o caminho. Serve também a dívida líquida/EBITDA (A07) e a qualquer indicador cujo sentido depende de quem é dono do numerador.
- **Dependências.** Porte do INST·02; registro previsto × calculado por canal.
- **Risco.** Excesso de elementos a 390; empilhar as duas colunas e manter só dois controles primários visíveis.

### F-M13-6 · Cascata de caixa reutilizável
- **O que faz.** Cascata vertical com valores da fonte (EBITDA R$ 1.000 mi → −250 → −80 → −500 → R$ 170 mi) e, sem valores, a ordem contratual de uso do caixa até o CFADS.
- **Por que vale.** "EBITDA é caixa" é o primeiro erro comum do módulo e reaparece em A03, A05 e na ficha da Equatorial. A mesma primitiva liga a ponte da A03 ao CFADS da A05, e a recuperação pode repetir a cascata sem mostrar a resposta antiga.
- **Dependências.** Nenhuma além do componente; exige distinguir cascata com valores de cascata esquemática.
- **Risco.** Inventar valores na versão esquemática. A regra é explícita: sem número na fonte, sem número na figura.

### F-M13-7 · Etiqueta de definição obrigatória em números comparáveis
- **O que faz.** Todo número com mais de uma definição possível (EBITDA reportado, societário, ajustado, regulatório; alavancagem contábil × de covenant; trimestre × ano-safra) leva uma etiqueta com definição e período. A mesa de comparação avisa na própria linha quando duas etiquetas diferem, e não ordena a coluna enquanto houver etiquetas diferentes ou linhas sem número.
- **Por que vale.** A tese do módulo é "o rótulo importa mais que o valor" (quatro EBITDAs da AXIA no mesmo trimestre). O INST·10 promete "reordenar as dez empresas" e a fonte diz que nenhuma ordenação de alavancagem é ordenação de risco: a etiqueta resolve as duas coisas. Estende o F-M14-8 (denominador duplo) para comparações entre empresas.
- **Dependências.** Campo de definição e período no dado de indicador; modelo de dado de fonte (§9).
- **Risco.** Poluição visual; etiqueta em linha de aparato, em versalete, com a definição completa só na ficha.

### F-M13-8 · Detector de bloco estático perdido na extração (interno, content QA)
- **O que faz.** Compara, por classe estrutural da fonte (`and`, `clk`, `emp`, `t333`, `dual`, `lv`), o texto estático do HTML com o texto extraído e lista o que ficou de fora, separando o que é gerado por script (não capturável) do que é estático (capturável).
- **Por que vale.** No M13, o comentário do arquivo atribui todo o resíduo da A08 ao `and` gerado por script, mas o segundo `and` da 08.4 é estático e se perdeu ("Então essa ação é uma boa compra?", "Por que isso é mais forte que sim ou não", "O que nunca devolver"). A cobertura por palavra (92,1%) não mostrou a perda porque a atribuiu ao script.
- **Dependências.** Extratores por módulo (`docs/alexandria-v2/extraction/mNN/extratores`).
- **Risco.** Falso positivo em blocos que a extração reestruturou (como `clk` → `tabela`); comparar por palavra dentro da classe, não por trecho contíguo.

---

## Do estudo do M16 (2026-09-17) — ver `aulas/m16.json`

Já registradas por outros módulos e reaproveitadas no M16 sem duplicar: F-M12-1 (selo de estado datado), F-M05-1 / F-M12-2 (régua persistente: aqui, a Régua de estágio de cinco posições), F-M12-5 e F-M01-08 (revelação pós-tentativa), F-M14-5 (banca de enunciados verdadeiros e insuficientes: aqui, o INST·11), F-M01-01 (plano potência × tempo: aqui, o retângulo MW × h da A04), F-M01-10 (decisão com "não é possível concluir").

### F-M16-1 · Coluna de referência fechada em tabela da fonte
- **O que faz.** Numa tabela literal da fonte que já contém as respostas (M16·A09: coluna "Gargalo que ela desvincula"; M16·A06: células dos três arranjos; M16·A05: coluna "Estado em 04/08/2026"), a coluna-resposta aparece fechada. O learner preenche a própria versão (classificação por toque) e a coluna abre depois do registro, com a resposta dele ao lado.
- **Por que vale.** Transforma referência em ato sem escrever fato novo. Resolve as aulas sem instrumento (C9, a "aula de M13" do bar) e impede que a tabela entregue a resposta antes da tentativa (Regra-mãe 2).
- **Dependências.** Marcação de coluna-resposta no dado da tabela (camada alexandria sobre bloco `tabela` da fonte); registro de tentativa (§9); F-M12-5.
- **Risco.** Tabela ilegível com colunas fechadas a 390; tabela literal virar "quiz". Mitigar com cartões por linha e sem pontuação.

### F-M16-2 · Matriz de gargalo com controle de data
- **O que faz.** Matriz tendência × candidato a gargalo (vincula / não vincula / vincula num recorte, por silhueta) com um controle de data de classificação. Onde a fonte data o deslocamento (armazenamento: regra até 24/06/2026 → sinal econômico), a célula vinculante se move quando o learner troca a data.
- **Por que vale.** "O gargalo se desloca" e "a classificação tem data" são disciplinas centrais do M16, e só um movimento com função (S6, consequência) as torna visíveis. O mesmo padrão serve ao M12 e ao M14 (estados que mudam com um ato).
- **Dependências.** Classificações com `validoDe`/`validoAte` por célula; só datas da fonte; F-M12-1.
- **Risco.** Sugerir série histórica que a fonte não tem. Mostrar só as datas declaradas, com "sem classificação da fonte" nas demais.

### F-M16-3 · Figura de escala dupla (agregado × local)
- **O que faz.** O mesmo conjunto (ex.: a frota com tomada) desenhado em duas escalas lado a lado: energia contra o consumo nacional (7,8 TWh / 939 TWh = 0,83%) e potência coincidente contra um limite local declarado. Os dois painéis reagem ao mesmo controle.
- **Por que vale.** É a frase-tese da M16·A03 ("potência local, não energia nacional") numa figura. Reaproveitável em centros de dados (A08), geração distribuída (M11) e qualquer "pequeno no país, grande no alimentador".
- **Dependências.** Componente de dois painéis com unidades distintas e rótulo direto; limite local como entrada do learner quando a fonte não dá valor.
- **Risco.** Parecer comparar grandezas incomparáveis. Títulos-afirmação separados e unidades explícitas em cada painel.

### F-M16-4 · Cenários pré-definidos com proveniência no instrumento
- **O que faz.** Cada instrumento oferece cenários nomeados, cada um com a procedência de cada valor: "fonte" (ex.: 30 MW / 4 h / 366 ciclos do certame; 167.026 veículos) ou "cenário didático; fonte externa não declarada" (ex.: R$ 80 / R$ 400 no INST·05; 100 MW de limite local no INST·04). Um exercício da fonte pode virar cenário (m16-ex-10: garagem com 40 × 11 kW × 35%).
- **Por que vale.** Os instrumentos do M16 misturam números oficiais e padrões sem fonte no mesmo painel. S4 exige fonte junto ao número, e P19 dá o modelo do rótulo. Também corrige padrões incoerentes (frota nacional × limite local).
- **Dependências.** Campo de proveniência por `defaultValue` no tipo `Instrument` (FOUNDRY); revisão de conteúdo (P3/P11).
- **Risco.** Poluição visual. Um marcador discreto por campo e uma linha de metadado por cenário.

### F-M16-5 · Escada de estágios de um número, com decomposição de projeto
- **O que faz.** Escada ordinal (solicitado → com parecer → contratado → energizado → consumido) onde o learner posiciona números públicos (38 GW, 26,3 GW, 54,2 GW, 7,1 GW) e vê, para um projeto do instrumento, o número descendo degrau a degrau (200 MW pedidos → 130 → 117 médios → 29 no 1º ano).
- **Por que vale.** Localizar o número no degrau é o mecanismo de M16·A01, A08 e A10, e a escada mostra o erro "degrau 1 × degrau 5" sem inventar razão entre degraus.
- **Dependências.** Componente de escada sem escala numérica entre degraus; INST·09 portado.
- **Risco.** Leitura de proporção onde não há (a fonte só diz "vários múltiplos"). Degraus equidistantes e aviso "sem escala".

### F-M16-6 · Remediação roteada por tipo de defeito
- **O que faz.** Extensão de F-M14-5: cada enunciado da banca tem defeito dominante (A estágio, B gargalo, C carga, D base de comparação) e aula de origem. Errar o defeito leva a "Rever [aula da lente]" (C10), e o padrão de erro por lente aparece no registro do learner.
- **Por que vale.** Torna o próximo passo dependente do resultado (gate de C10) e dá ao Progresso um "a revisar" com motivo.
- **Dependências.** Mapa enunciado → aula (camada alexandria, revisável); registro de tentativas (§9).
- **Risco.** Parecer diagnóstico de competência. Linguagem de "a revisar", nunca de nota (S3).

### F-M16-7 · Checagem de pergunta verificável
- **O que faz.** Quando o learner escreve uma pergunta a um interlocutor (M16·A10, INST·10/INST·11), uma autoavaliação guiada pergunta se a resposta seria documento, número ou data (regra das três perguntas da fonte) e mostra o par de exemplos da fonte ("tem capacidade de execução?" × "quantos pontos energizou em doze meses…?").
- **Por que vale.** Dá critério explícito (C7) a um ato de texto sem inventar correção automática nem tolerância (P6).
- **Dependências.** Registro de texto (§9); escala de três níveis de C7.
- **Risco.** Virar checklist mecânico. Uma pergunta só, com exemplo.

### F-M16-8 · Previsão do learner como enunciado a verificar
- **O que faz.** Na aula de síntese, uma ou duas afirmações feitas pelo próprio learner em aulas anteriores (previsão ou classificação registradas) voltam como enunciados da banca, marcadas "sua resposta em A01", para ele classificar o próprio defeito.
- **Por que vale.** É a recuperação mais forte possível (C10: repetir a pergunta antes de mostrar a resposta antiga) e fecha o módulo sobre o raciocínio do learner, sem fato novo.
- **Dependências.** F-M01-11 (fio de retorno); persistência de tentativas; texto conectivo da camada alexandria.
- **Risco.** Expor erro de forma constrangedora. Opcional, e só com afirmações registradas pelo próprio learner.

### F-M16-9 · Conferência de premissas de instrumento contra a norma (interno, content QA)
- **O que faz.** Lista, por instrumento, os padrões sem fonte, os limiares de veredito sem fonte e as extrapolações além do que a norma diz (ex.: INST·06 aplica 2% ao ano por 10 anos, mas a portaria fala em 24 meses; INST·04 compara frota nacional com limite local de 100 MW; classes do INST·07 sem mapeamento declarado aos quatro estados).
- **Por que vale.** Impede que um instrumento portado com fidelidade ensine uma premissa que a própria aula contradiz.
- **Dependências.** Leitura do `<script>` da fonte; fluxo de content QA.
- **Risco.** Nenhum para o learner (ferramenta interna). Custo de revisão por instrumento.


---

## Do estudo do M08 (2026-09-17) — ver `aulas/m08.json`

Estas features reaproveitam três já registradas, sem repeti-las aqui:
- a etiqueta de definição (F-M13-7) serve à "etiqueta de recorte" da A01;
- a matriz de leitura lateral (F-M14-6) serve ao fichário da A02;
- o selo datado (F-M12-1, F-M01-09) serve aos "Números vivos".

### F-M08-1 · Pizza desenhável com fantasma da referência e transformação capacidade → geração
- **O que faz.** O learner arrasta as fronteiras das fatias (ou usa ±1 pp) até a pizza somar 100%. Depois de "Corrigir", a referência aparece como contorno-fantasma sobre a pizza dele. Em seguida, a pizza de capacidade se transforma na de geração, e as fontes que trocam de posição ficam marcadas.
- **Por que vale.** Cumpre a forma que o INST·04 promete ("desenhe as duas pizzas") e torna visível o mecanismo central do módulo: a ordem muda pelo FCap. É também a tarefa do M08 mais próxima de uma tarefa de evidência.
- **Dependências.**
  - Desenho de forma (§9).
  - Registro das duas rodadas.
  - Regra de pontuação para empates dentro da tolerância (P19).
  - Content QA da referência (fóssil × solar em geração).
- **Risco.** O arraste é impreciso a 390 px e sem mouse, então a entrada numérica fica como alternativa acessível. O movimento não tem overshoot, e a versão com movimento reduzido termina no mesmo quadro.

### F-M08-2 · "Desenhe sua previsão" em série temporal
- **O que faz.** O learner traça uma curva sobre um eixo vazio, em horas ou meses. Ao registrar, a curva de referência é desenhada por cima, e o traço dele continua visível enquanto explora o instrumento.
- **Por que vale.** Transforma o Ex·04 da fonte ("Desenhe de cabeça o perfil de um domingo ensolarado") em ato registrado. A previsão qualitativa ganha o mesmo peso do previsto × calculado numérico. O componente serve também à curva líquida da M02·A04, captura obrigatória do bar.
- **Dependências.**
  - Palco de curvas (F-M08-4).
  - Persistência do traço.
  - Alternativa acessível: escolher o nível em cada faixa.
- **Risco.** Uma forma livre não admite pontuação honesta. Usar autoavaliação em três níveis (C7), nunca nota inventada.

### F-M08-3 · Plano diagnóstico com pontos datados e terceira dimensão por controle
- **O que faz.** Um plano x × y (ex.: afluência em % da MLT × armazenamento em % do útil) mostra:
  - pontos reais datados (os quatro subsistemas em jun/2026);
  - um ponto móvel do learner;
  - um controle extra (o mês), que muda o diagnóstico sem mover o ponto;
  - os limiares do instrumento, rotulados como didáticos.
- **Por que vale.** É a própria tese da A04 ("as duas dimensões simultaneamente") e substitui o "número colorido" que a fonte critica. Serve a qualquer diagnóstico estoque × fluxo do currículo.
- **Dependências.**
  - Desenho de forma (§9).
  - Atalhos de fotografia, restaurados do script-fonte.
  - Selo de data.
- **Risco.** Quadrantes pintados viram semáforo (S2). Usar fio, rótulo e padrão, nunca cor de julgamento.

### F-M08-4 · Palco de curvas com carga × carga líquida e excedente rotulado
- **O que faz.** Um gráfico de linhas mostra:
  - a carga (linha cheia) e a carga líquida (tracejada);
  - as fontes, que o learner liga e desliga, e a soma delas;
  - uma hachura rotulada "excedente" onde a soma passa da carga líquida.

  Quando o dado é índice estilizado, o eixo declara isso (não é MW).
- **Por que vale.** Desenha a relação que a A03 afirma: a distância entre carga e carga líquida é a geração fora de comando. Resolve também o "CURVA LÍQUIDA sem curva" citado no bar (M02·A04).
- **Dependências.**
  - Content QA do INST·06: a escala anual da fonte contradiz a prosa.
  - Disclaimer restaurado.
  - Rótulos diretos a 390.
- **Risco.** O dado estilizado ser lido como série medida. O aviso da fonte fica colado ao gráfico, não no rodapé.

### F-M08-5 · Classificador de cenário com previsão antes do veredito
- **O que faz.** O learner monta um cenário (patamar, dia, região, condição da rede) e escolhe a causa e a solução. Só então vê as quatro leituras do instrumento. Uma faixa fixa mostra, em todos os cenários, quem nunca é cortado: a geração distribuída.
- **Por que vale.** Transforma o INST·09 de explorador em ato de classificação autêntico e mostra a assimetria de regra que a A05 ensina.
- **Dependências.**
  - Registro da tentativa.
  - Saídas textuais nomeadas (F-M05-4).
  - Vocabulário de estado sem traço: "—" vira palavra.
- **Risco.** O learner decorar a lógica do instrumento em vez do fenômeno. Mitigar com três cenários escolhidos pela aula e com a comparação com a tabela de causas da fonte.

### F-M08-6 · Gráfico-armadilha com "marque a quebra"
- **O que faz.** O learner vê uma série emendada sem marcação (corte de geração 2021–2025), toca onde está a mudança de universo e diz o que ela altera. Depois aparece a versão honesta, com a quebra de abr/2024 marcada e rotulada.
- **Por que vale.** Exercita a armadilha 2 da A07 (e o erro 18 do §Erros) no próprio objeto que engana. Serve a qualquer série com mudança de metodologia.
- **Dependências.**
  - Série com metadado de quebra.
  - Registro da marcação.
  - Alternativa por seletor de período.
- **Risco.** A versão "armadilha" ser capturada fora de contexto como gráfico real. Marcar a figura como exercício em todos os quadros.

### F-M08-7 · Detector de expectativa vencida em números vivos
- **O que faz.** Estende o selo datado (F-M12-1). A fonte pode anunciar um evento futuro em relação à data de verificação, como "julgamento previsto para agosto de 2026". Quando essa data já passou, o bloco ganha "este estágio pode ter mudado · verificado há N dias" e entra na fila de re-verificação editorial.
- **Por que vale.** O Caso B da A06 já está nessa situação em 17/09/2026. A fonte chama de "o erro mais comum e mais caro desta matéria" descrever processo em curso como desfecho. O produto também não pode errar no sentido inverso, mostrando como atual uma expectativa vencida.
- **Dependências.**
  - Campos `verificadoEm` e `eventoPrevistoEm` no dado.
  - Fluxo de content QA.
- **Risco.** Falsos positivos em datas históricas. Exigir marcação editorial, não só regex.

### F-M08-8 · Cursor compartilhado entre instrumentos
- **O que faz.** Um estado comum, como o mês, liga dois instrumentos da mesma aula. Escolher julho no calendário (INST·07) move o cursor da escala anual das curvas (INST·06), e vice-versa.
- **Por que vale.** A A03 diz que "a leitura útil não é de uma variável de cada vez, é da coincidência entre elas". Dois instrumentos isolados escondem essa coincidência.
- **Dependências.**
  - Contrato de instrumento com estado compartilhado por aula.
  - F-M08-4.
- **Risco.** O acoplamento confundir quem usa só um dos dois. O cursor precisa estar visível, com a origem nomeada.

### F-M08-9 · Tríade ingênuo × reconstrução × referência
- **O que faz.** A aula registra três respostas e mostra as três lado a lado no fim:
  1. a previsão ingênua, antes da leitura (ex.: ordenar as seis fontes);
  2. a reconstrução, depois da leitura, com a referência recolhida;
  3. a referência.
- **Por que vale.** Separa previsão (erro útil) de recuperação. A fonte diz que "ler um gráfico correto não treina reconstrução". O learner vê quanto a leitura moveu a própria resposta, e a linha "Além do conceito" fica verificável.
- **Dependências.**
  - Registro de dois atos na mesma aula.
  - Recolher e expandir a referência sem perder a posição.
- **Risco.** A aula ficar longa demais. A previsão ingênua deve ser rápida e só de ordem, sem números.

### F-M08-10 · Invariantes cruzados entre instrumentos do mesmo módulo (interno, content QA)
- **O que faz.** Um teste compara os números da mesma grandeza em instrumentos e fichas diferentes (INST·02 derivado × INST·04 referência × faixas das fichas × INST·03). Quando a ordem ou a faixa diverge além da tolerância declarada, o teste falha e lista o conflito para P20.
- **Por que vale.** No M08, a ordem fóssil × solar em geração diverge: o INST·02 põe a solar em 3º, e o INST·04 põe a fóssil. Como o INST·04 exige ordem exata, o learner que segue as fichas é marcado como errado. A Wave 40 já provou esse padrão para o jogo (`alexandria-modulo-08-fatos.ts`).
- **Dependências.**
  - Camada de fatos por módulo.
  - Decisão de content QA.
- **Risco.** Nenhum para o learner.

### F-M08-11 · Coerência do veredito no estado inicial (interno, content QA)
- **O que faz.** Roda cada instrumento no estado padrão e em cada opção de escala, e compara o veredito com a prosa que invoca o instrumento. Exemplo: no INST·06, escala anual, com todas as fontes ligadas, o veredito diz "Excedente em 12 dos 12 pontos… regime", enquanto a prosa diz "linha bem mais estável".
- **Por que vale.** Um instrumento portado com fidelidade pode abrir a aula contradizendo a própria aula, e o script-fonte do M08 tem esse caso.
- **Dependências.**
  - Calculadoras puras (já existem).
  - Lista das frases-âncora da prosa por instrumento.
- **Risco.** O par veredito × prosa exige leitura humana; o teste só levanta candidatos.

---

## Do estudo do M02 (2026-09-17) — ver `aulas/m02.json`

Reaproveita, sem duplicar:
- F-M04-1 (pilha de oferta viva): M02·A05.
- F-M04-2 e F-M01-02 (previsão marcada na figura; quadro previsto × calculado): A02, A04, A07, A08, A09 e A10.
- F-M05-5 (explicador em três níveis): os seis blocos perdidos do M02.
- F-M07-8 (alcançabilidade de veredito): o ramo "carga líquida < 35 GW" do m02-inst-04 nunca é alcançado.
- F-M13-8 (bloco estático perdido): a cadeia de tensões e os rótulos do vs-grid do M02.

### F-M02-1 · Previsão desenhada (curva à mão livre)
- **O que faz.** Antes do cálculo, o learner desenha a forma prevista sobre os eixos vazios da figura (por exemplo, a carga líquida de 0 a 24 h). O traço fica salvo, tracejado, e o calculado aparece por cima quando o learner registra. A alternativa acessível usa 5 a 7 alças verticais em horas fixas, ajustáveis pelo teclado.
- **Por que vale.** Algumas aulas ensinam uma forma, não um número, e o checklist do M02 pede "Desenhar a curva líquida de um dia ensolarado e apontar a rampa". O erro típico é pôr o vale na madrugada, não ao meio-dia, e ele só aparece quando o learner desenha. Serve à M02·A04, à M02·A08 (curva de frequência) e a qualquer módulo com perfil diário.
- **Dependências.** Figura desenhada (§9, COD-M02-07); registro de previsão com série, não só escalar; regra de avaliação por forma, declarada como regra da Alexandria (por exemplo, "mínimo entre 10 h e 14 h").
- **Risco.** Médio, porque julgar um desenho parece arbitrário. Mitigação: comparar só atributos nomeados (hora do mínimo, janela da maior subida), com autoavaliação em 3 níveis e sem nota.

### F-M02-2 · Palco de dois nós com fio saturável
- **O que faz.** Mostra duas regiões, de preferência sobre o mapa dos submercados, cada uma com a sua mini-pilha e ligadas por um fio com barra de carregamento (fluxo ÷ limite). O preço aparece sobre cada nó. Quando o fio satura, os preços se separam e o excedente cortado aparece hachurado. Uma chave "restrição dentro do submercado" mostra o custo indo para o encargo (ESS) em vez do preço.
- **Por que vale.** É a forma que o nome do m02-inst-09 promete ("Dois submercados, um fio"), e nem a fonte nem o código a desenham. Com ela, "fio com folga = preço único; fio saturado = preços separados + corte" vira imagem. Serve também às outras aulas do currículo sobre spread entre submercados e curtailment.
- **Dependências.** Saídas estruturadas do m02-inst-09: fluxo, limite, estado saturado e corte, com a unidade R$ (COD-M02-10). Também F-M04-1 em versão compacta e, como fundo opcional, a camada de submercados do Atlas.
- **Risco.** Médio: o learner pode ler o modelo de dois nós como o SIN real. Mitigação: a nota da fonte ("o SIN real tem quatro submercados, dezenas de troncos e despacho horário") fica sob a figura.

### F-M02-3 · Artefato do learner que atravessa o módulo
- **O que faz.** Um objeto que o learner preenche numa aula volta, com o que ele registrou, numa aula posterior e recebe uma camada nova. No M02, a cadeia de tensões e donos que o learner montou na A01 (o "guardanapo" do critério de domínio) volta na A10 para receber TUST, TUSD e Fio B nos degraus certos. Aparece a primeira versão do learner, não a referência.
- **Por que vale.** O critério de domínio vira um objeto do learner, não um texto da fonte. A continuidade é real (S6), e a recuperação acontece sobre a própria resposta (C10).
- **Dependências.** Persistência de respostas estruturadas por learner (§9); ids estáveis dos degraus; F-M01-11 (fio de retorno entre aulas).
- **Risco.** Baixo a médio. Se o learner pulou a A01 (não há trava, P13), a A10 mostra a cadeia vazia com a linha "você ainda não montou esta cadeia · montar agora", nunca a referência pronta.

### F-M02-4 · Figura-âncora compartilhada, com camadas por aula
- **O que faz.** A mesma figura reaparece sem controles em aulas seguintes, e cada aula acrescenta uma camada própria. No M02, a curva do dia da A04 volta com as seis janelas do plantão (A06) e com a janela de descarga da bateria dimensionada pelo learner (A07). A previsão desenhada na A04 pode ficar como traço de fundo.
- **Por que vale.** Três aulas de natureza diferente (sistema, instituição, recurso) passam a partilhar um eixo de memória. As camadas novas não exigem dado novo, e as faixas que a fonte não localiza no relógio levam o selo "faixa esquemática".
- **Dependências.** F-M01-01 generalizado (tempo × potência); COD-M02-07; F-M02-1.
- **Risco.** A figura se repetir sem função. Cada reaparição precisa de um ato (pendurar as janelas, dimensionar a bateria).

### F-M02-5 · Alavanca "lei isolada × modelo da fonte"
- **O que faz.** Um interruptor no instrumento, rotulado como camada da Alexandria, congela as outras variáveis do modelo para isolar a lei que a aula afirma. No m02-inst-02, o modo "mesmo condutor" mantém a resistência por km do nível escolhido, e dobrar a tensão mostra exatamente ¼ das perdas. Com o interruptor desligado, o instrumento volta às resistências típicas por nível da fonte, que também trocam o cabo.
- **Por que vale.** A aula afirma perdas ∝ (P/V)², mas o simulador da fonte muda R junto com V, e o ¼ nunca aparece na tela. Sem a alavanca, a figura contradiz a frase da aula.
- **Dependências.** Parâmetro de modo no calculador (camada Alexandria, documentado); rótulo visível "modelo simplificado · camada Alexandria"; revisão técnica (P3).
- **Risco.** Médio: o modo pode ser lido como dado novo. Mitigação: o modo da fonte é o padrão, e o modo isolado só reaproveita a resistência do nível já escolhido, sem número novo.

### F-M02-6 · Régua de tempo multiescala com faixas que acendem
- **O que faz.** Uma régua com zoom, de milissegundos a meses. As faixas de atuação acendem na ordem enquanto o learner arrasta o tempo:
  - ERAC, em centenas de ms;
  - inércia, de 0 a alguns segundos;
  - regulação primária, em segundos;
  - CAG, em minutos;
  - reserva terciária, de minutos a horas;
  - PMO, PDO, tempo real e pós-operação.

  A mesma régua, com o gráfico alinhado, serve à excursão de frequência (0 a 30 s).
- **Por que vale.** A A08 ("Os dez segundos") e a A06 ("Do mês ao segundo") são aulas sobre escala de tempo, e as tabelas da fonte escondem a ordem de grandeza. Uma régua única liga as duas aulas.
- **Dependências.** Escalas literais das tabelas 6.2 e 8.2 da fonte; estados estáticos em sequência para movimento reduzido (S6); F-M02-1 para o gráfico.
- **Risco.** Baixo. A escala logarítmica confunde, então cada marca leva a unidade por extenso.

### F-M02-7 · Unifilar manobrável (seletividade)
- **O que faz.** Um diagrama unifilar esquemático de subestação (barramento, disjuntores, seccionadoras, transformador e alimentadores) recebe uma falta num alimentador, e o learner escolhe o que abrir. O desenho mostra o trecho desenergizado por silhueta (trecho vazado) e por palavra, nunca por cor. Se o learner tentar abrir a seccionadora sob falta, a manobra é recusada com a regra da fonte.
- **Por que vale.** Disjuntor × seccionadora e seletividade são o núcleo da M02·A03 e um item do checklist. O mesmo unifilar volta na A08 como o passo 2 da cascata ("a proteção atua corretamente, mas remove um caminho").
- **Dependências.** Componente de diagrama com estados; regras de manobra tiradas só da fonte (tabela 3.2 e nota 3.3); registro de tentativa.
- **Risco.** Médio: simplificar demais a proteção real. Mitigação: selo "esquema didático, não subestação real" junto do diagrama, e nenhum tempo ou ajuste de relé inventado.

### F-M02-8 · Traço fantasma do cenário anterior
- **O que faz.** Quando o learner troca um controle categórico (mix de inércia, condição do céu), o instrumento mantém o traço anterior esmaecido e rotulado ("antes: inércia média"), para comparar os dois cenários no mesmo eixo.
- **Por que vale.** A M02·A08 pede que o learner compare o mesmo evento num sistema pesado e num sistema leve, mas a fonte desenha uma curva por vez. A A04 tem o mesmo pedido implícito (céu limpo × encoberto).
- **Dependências.** Figura desenhada; estado do cenário anterior guardado na sessão.
- **Risco.** Baixo. Mais de dois traços viram ruído, então só existe um fantasma.


---

## Do estudo do M10 (2026-09-17) — ver `aulas/m10.json`

Não repito o que já está registrado. O M10 também usa:
- F-M12-1 (selo datado: todas as notas "números vivos" são de 1º/8/2026);
- F-M14-6 (leitura lateral: fichas da A02, INST·07, INST·08, INST·10);
- F-M12-5 e F-M01-03 (classificar com revelação depois da tentativa: A01, A04, A05, A06, A07);
- F-M01-02 (previsto × calculado: INST·04, INST·05, INST·06, INST·11);
- F-M01-10 e F-M09-2 (três saídas: INST·11);
- F-M04-8 (uso das questões: 6 das 10 do quiz batem com previsões de aula).

Abaixo, só o que é novo ou estende essas features.

### F-M10-01 · Fatura esquemática por regiões
- **O que faz.** Estende F-M09-6. Uma fatura esquemática do grupo A, sem valores e sem leiaute de distribuidora,
  dividida em regiões nomeadas: cadastro, datas do ciclo, demanda, reativo, consumo por posto, bandeira e ajustes,
  linhas de tarifa, tributos. As 14 famílias do INST·01 moram nessas regiões. Um procedimento (os 9 passos do INST·10)
  acende uma região por vez, com o critério de parada ao lado. Com uma lente (INST·01), o documento inteiro é
  recolorido por "quem define o valor · a quantidade · o ciclo".
- **Por que vale.** A A09 é "ler uma fatura em cinco minutos", e hoje não há fatura para ler: a fonte não traz nenhuma.
  A mesma peça serve de palco à A01 (quatro eixos), à A02 (assinatura de modalidade) e à A05 (onde aparece o
  excedente).
- **Dependências.** Desenho SVG revisado (P3), com rótulo visível "fatura esquemática para estudo"; mapa família →
  região (camada Alexandria); passos com `regiao`.
- **Risco.** Parecer documento real (proibição de registro fabricado) ou sugerir proporção de valor. Mitigação: sem
  marca, sem nome de distribuidora e sem número, com a legenda fixa "sem valores, sem leiaute real".

### F-M10-02 · Gráfico de gatilho com fantasma da leitura errada
- **O que faz.** Mostra a parcela de ultrapassagem em função da demanda medida: plana até contratada × (1 + tol) e,
  no limite, salto para (medida − contratada) × multiplicador × tarifa. Uma linha-fantasma rotulada "leitura
  franquia (incorreta)" começa do zero no limite. O controle do INST·04 move o ponto sobre a curva, e o quadro
  previsto × calculado fica ao lado.
- **Por que vale.** É a forma que a nota do INST·04 promete ("observe o salto") e não desenha. A não linearidade é o
  mecanismo da A03, e o erro "franquia" é o que a fonte diz ser o mais comum. A mesma forma serve a qualquer regra de
  gatilho com base cheia.
- **Dependências.** Calculadora m10-inst-04 como função pura (já existe); primitivo de gráfico de degrau com rótulo
  direto.
- **Risco.** A tarifa genérica pode ser lida como valor real. A legenda "unidades monetárias genéricas; tarifa é por
  distribuidora" fica sob a figura.

### F-M10-03 · Mapa de calor dia × hora com janelas de apuração
- **O que faz.** Grade de 30 dias × 24 h com o estado de cada intervalo (em violação / dentro), marcado por hachura e
  glifo, nunca por cor de semáforo. Faixas rotuladas marcam a janela capacitiva (6 h entre 23h30 e 6h30, com duração
  editável pelo INST·06) e a indutiva complementar. Há modos "padrões da tabela da fonte" (para classificar) e "média
  mensal" (a linha que esconde as violações).
- **Por que vale.** A assinatura da sobrecompensação ("excedente só na madrugada numa planta diurna") é o achado
  "mais elegante" da A05, e só é visível no tempo. É a forma que o INST·06 promete ("janelas editáveis") e não
  desenha.
- **Dependências.** Padrões esquemáticos gerados das linhas da tabela 05.2 (camada Alexandria, rótulo
  "ilustrativo"); calculadora m10-inst-06.
- **Risco.** Ser lido como medição real ou dar a entender que o corte de 25% (triagem do instrumento) é norma. Rótulos
  junto da figura.

### F-M10-04 · Faixa de 24 h com janela homologada móvel
- **O que faz.** Faixa ou anel de 24 h com uma janela de 3 h arrastável (dois exemplos sem nome, da fonte: 18h–21h e
  17h30–20h30), uma curva esquemática da planta com pico móvel e uma faixa semanal que distingue dia útil de fim de
  semana e feriado. Uma saída textual diz se deslocar o pico interno muda o consumo dentro da janela.
- **Por que vale.** Desenha as duas correções da A04: "três horas, por concessionária" e "ponta tarifária não é pico
  da planta". Pode ser reaproveitada na A08 (a janela muda na revisão) e em qualquer módulo com posto horário.
- **Dependências.** Primitivo de eixo circular ou linear de 24 h; lista de feriados só como "relacionados na norma",
  sem inventar.
- **Risco.** Uma janela-exemplo ser lida como a de uma concessionária real. Nunca nomear concessionária.

### F-M10-05 · Assinatura de modalidade (silhueta de linhas)
- **O que faz.** Para cada modalidade, mostra a silhueta das linhas que ela produz na fatura: quantidade e rótulo das
  linhas de consumo, demanda contratada e faturada, e ultrapassagem. A base é o campo "O que ver na fatura" das fichas.
  Tem dois usos: comparar duas silhuetas (INST·02, "na modalidade avaliada") e classificar uma silhueta sem nome.
- **Por que vale.** Transforma "como se descobre na própria fatura em qual célula a unidade está" (lead A02) num ato
  autêntico. Cumpre a promessa "diferença estrutural por linha" do INST·02.
- **Dependências.** F-M10-01; campos das fichas separados (content QA de extração).
- **Risco.** Faturas reais desdobram ou agregam linhas. A legenda fixa diz "estrutura mínima, leiautes variam por
  distribuidora", e "não dá para saber sem o cadastro" é resposta válida.

### F-M10-06 · Linha do tempo em duas faixas com estado epistêmico
- **O que faz.** Combina F-M12-1 e F-M07-3. Duas faixas paralelas (ex.: controvérsia da base × transição do regime)
  com eventos datados. Cada evento traz o estado por palavra e traço (histórico · pacificado · vigente · pendente ·
  prazo previsto em lei), e um marcador "verificado em" pode ser arrastado até "hoje". O ato padrão é ordenar os
  eventos e classificar o estado antes da revelação.
- **Por que vale.** A07, A06 e A08 dependem de separar o decidido do pendente e do previsto. A fonte diz que a A07 é a
  seção com maior chance de envelhecer.
- **Dependências.** Lista da A07 com data, etiqueta e corpo separados (hoje colados no `.ts`); proveniência com data;
  revisão periódica.
- **Risco.** Parecer aconselhamento jurídico. A linha de rodapé fixa, da fonte, diz "validação contábil e jurídica
  própria".

### F-M10-07 · Cascata preço × quantidade com convenção declarada
- **O que faz.** Parente de F-M13-6. Para um componente em dois períodos (quantidade e preço unitário), desenha a
  cascata custo 1 → efeito quantidade → efeito preço → custo 2, com a convenção de decomposição escrita sob a figura.
  Tem um modo em que o learner calcula antes de ver e um modo com vários componentes somados.
- **Por que vale.** A fonte chama essa decomposição de "a operação que separa um relatório defensável de uma
  narrativa" (A08), mas não fixa o método. Sem convenção declarada, dois learners corretos chegam a números
  diferentes.
- **Dependências.** Decisão de método revisada (P3); cenário didático da camada Alexandria sem concessionária.
- **Risco.** Termo cruzado escondido. A convenção deve fechar exatamente, e a figura diz qual período ancora cada
  efeito.

### F-M10-08 · Varredura de vereditos visível ao learner
- **O que faz.** Versão para o learner de F-M07-8. Um instrumento de veredito registra quais classes de saída o
  learner já alcançou (ex.: 2 de 3), por palavra, e a meta do ato é encontrar todas. Opcionalmente, uma grade das
  combinações mostra onde cada veredito cai.
- **Por que vale.** A nota da fonte no INST·11 manda "percorrer todas as combinações para verificar que as três
  classes são alcançáveis". O ato ensina que "não vale investigar" exige tanta evidência quanto "vale".
- **Dependências.** Calculadora pura (existe); evento de tentativa com o estado alcançado (§9); F-M07-8 para garantir
  alcançabilidade.
- **Risco.** Virar caça ao tesouro sem justificativa. Pedir o veredito escrito para uma das combinações.

### F-M10-09 · Composição própria privada, com referência oculta
- **O que faz.** No INST·09, a coluna "Real" só aparece depois de a estimativa (soma 100) ser registrada, e é
  preenchida com a fatura do próprio learner. A entrada é privada e fica local em E0, com persistência só com conta.
  Sem fatura, o instrumento registra só a estimativa e oferece a leitura dos vieses, sem diagnóstico.
- **Por que vale.** Hoje a referência aparece antes da tentativa (C7) e com valores que a própria fonte diz não serem
  típicos. É a única forma honesta de "estime antes de ver" num módulo sem composição de referência.
- **Dependências.** Persistência de resposta (§9); política de privacidade para dado de fatura do learner; F-M01-08
  (instrumento velado).
- **Risco.** Dado sensível do learner. Nunca enviar a terceiros e nunca usar em agregados sem consentimento.

### F-M10-10 · Escada de tensão com limiares regulatórios sobrepostos
- **O que faz.** Estende F-M01-04. Na mesma escada de kV, sobrepõe camadas ligáveis: subgrupos (A1…B), elegibilidade
  da Verde (A3a, A4, AS) e degraus do rateio da CDE (100 · 80 · 50%, com 69 kV marcado). Cada camada tem a própria
  fonte e data.
- **Por que vale.** Liga A02 e A06 sem fato novo: 69 kV é, ao mesmo tempo, o fim da Verde e o limiar do rateio
  reduzido (a própria fonte anota isso). Também explica o Ex 13 (duas plantas, preços diferentes).
- **Dependências.** F-M01-04; F-M12-1 para a camada de 2026.
- **Risco.** Camadas demais a 390. Mostrar uma camada por vez em telas estreitas.

### F-M10-11 · Coerência entre gabarito e faixas de instrumento (interno, content QA)
- **O que faz.** Para cada exercício com números, roda os números nas calculadoras do mesmo módulo e compara a faixa
  devolvida com a classificação do gabarito. No M10, o Ex 05 dá 96%, que o INST·03 chama de "Operação na borda" e o
  gabarito de "ajustado", e 12% de ponta, que o INST·05 chama de "acima do proporcional" e o gabarito de
  "estruturalmente baixa".
- **Por que vale.** São contradições silenciosas que só aparecem cruzando aparatos. Reutilizar a mesma resposta em
  aula e avaliação espalharia o conflito.
- **Dependências.** Calculadoras puras; extração dos números dos enunciados (manual assistida).
- **Risco.** Falso positivo quando o gabarito usa linguagem qualitativa de propósito. A saída é lista para revisão
  humana, nunca correção automática.

## Do estudo do M03 (2026-09-17) — ver `aulas/m03.json`

### F-M03-1 · Previsão por traço
- **O que faz.** Em instrumentos de série temporal (EAR em 12 meses no m03-inst-03; dia de 24 h no m03-inst-05; curva líquida do M02·A04), o learner desenha a curva que espera antes de ver a simulada. O traço fica registrado e é sobreposto à curva calculada, com a maior distância anotada em texto.
- **Por que vale.** Algumas previsões úteis são de forma, não de número. Na M03·A02 o erro que ensina é pôr o fundo do estoque no mês de menor afluência (agosto), quando o modelo o põe em outubro. Um número não captura isso; um traço captura.
- **Dependências.** Calculadores devolverem a série inteira (hoje só min/mês/contagem); registro de tentativa (§9); entrada acessível alternativa (selecionar mês e nível por teclado).
- **Risco.** Precisão motora virar critério. Nunca pontuar a distância; mostrar só previsto × calculado.

### F-M03-2 · Troca de lente com fantasma
- **O que faz.** Figura com duas lentes sobre o mesmo objeto (capacidade × energia no m03-inst-01) que transiciona as barras no mesmo quadro e mantém a previsão do learner como barra-fantasma e o multiplicador de cada barra escrito (FCap da fonte ÷ média).
- **Por que vale.** É a forma que o título do instrumento promete e o mecanismo central da M03·A01. Reaproveitável em qualquer "percentual de quê?" (M01·A08, M12).
- **Dependências.** Portar as séries didáticas do INST·01 (L2841–L2858) como dado com camada fonte; movimento de consequência com equivalente em movimento reduzido (S6).
- **Risco.** Seis categorias contra a heurística de ≤4; mitigar com ênfase em três séries e rótulo direto.

### F-M03-3 · Retângulo de energia como primitiva
- **O que faz.** Uma geometria única do currículo para E = P × t: largura = tempo (h), altura = potência (MW), área = energia (MWh), com a fração preenchida quando há FCap. Usada no m03-inst-02 (8.760 h × MW × FCap), no m03-inst-07 (MW × duração da bateria) e candidata ao M01·A01 e ao M01·A08.
- **Por que vale.** A confusão MW × MWh aparece em pelo menos quatro aulas. Uma forma recorrente cria memória visual e costura o módulo (T9 do estudo M03).
- **Dependências.** Componente de figura programática; instrumentos sem figura na fonte passam a ter uma, marcada camada Alexandria.
- **Risco.** Escala enganosa quando largura e altura têm faixas muito diferentes; fixar escalas por contexto e rotular.

### F-M03-4 · Instrumento com preset por aula
- **O que faz.** Permite que um instrumento de uma aula apareça em outra com um cenário de entrada e controles travados (ex.: m03-inst-08 com o preset Nuclear e só o WACC livre na M03·A08; perfis do m03-inst-09 como figura estática na A04 e na A07; m03-inst-06 congelado na A07), sempre com o rótulo "prévia/preset didático da aula X".
- **Por que vale.** Aulas sem instrumento (A04, A07, A08 do M03) ganham manipulação do mecanismo sem instrumento novo e sem número novo. Reforça a costura entre aulas.
- **Dependências.** Campo de preset e de controles travados no vínculo aula ↔ instrumento; registro de prática separado por aula.
- **Risco.** O preset ser lido como fato sobre um ativo real (ex.: "LCOE de Angra 3"). O rótulo precisa negar isso explicitamente.

### F-M03-5 · Curva de oferta em degraus
- **O que faz.** Desenha a ordem de mérito como curva de oferta (x = GW acumulados, y = R$/MWh), com linha de demanda, degrau marginal nomeado, CMO no eixo e piso regulatório; um degrau "fora da ordem" (take-or-pay) com a área de sobrecusto rotulada ESS.
- **Por que vale.** É a forma canônica do mecanismo que o m03-inst-06 promete ("A pilha de CVU") e que a M02·A05 e os módulos de mercado reutilizam. Deixa ver o "conversor de preço" (degraus sobem, a ordem física não muda).
- **Dependências.** Calculador devolver a lista despachada por usina; agrupamento por família para respeitar ≤4 cores (S2).
- **Risco.** Onze degraus pequenos ilegíveis a 390; rótulo por família e detalhe em disclosure.

### F-M03-6 · Instrumentos encadeados
- **O que faz.** A saída registrada de um instrumento vira cenário opcional de outro, com a origem visível: a rampa medida no m03-inst-05 (A05) sugere a potência da bateria no m03-inst-07 (A09); o FCap usado na A01 vira ponto de partida do LCOE na A10.
- **Por que vale.** Transforma o módulo num raciocínio contínuo, dá recuperação natural (C10) e faz o learner reencontrar o próprio número.
- **Dependências.** Registro de valores por learner (§9); convenção de unidade entre instrumentos.
- **Risco.** Encadear grandezas incompatíveis (GW/h de rampa não é MW de bateria de um ativo). Só como prática rotulada, nunca como dimensionamento.

### F-M03-7 · Faixa de calendário compartilhada
- **O que faz.** Um eixo de 12 meses reaproveitado em várias aulas, com janelas da fonte (cheia dez–abr, seca mai–nov, safra abr–nov, vento forte no 2º semestre) e o ato "marque os meses antes de ver".
- **Por que vale.** As duas complementaridades do M03 (A04 e A07) e o encaixe da A10 são relações de calendário. A mesma faixa deixa a síntese visível sem texto.
- **Dependências.** Janelas como dado com camada e linha de origem; componente de faixa com entrada por mês acessível.
- **Risco.** Faixas didáticas lidas como série histórica; rótulo "janela descrita na aula", sem valores mensais inventados.

### F-M03-8 · Varredura de ramos e fronteiras (QA interno)
- **O que faz.** Script de content QA que percorre a grade de entradas de cada instrumento (min–max–passo) e relata: ramos de veredito inalcançáveis, saídas sempre zero, e valores em que o ramo muda por erro de ponto flutuante. Compara com as frases da nota que prometem um estado ("ajuste para ~75% e veja…").
- **Por que vale.** No M03 encontrou dois defeitos que leitura não pega: o ramo "sobra estrutural" do m03-inst-05 é inalcançável (excedente máximo 0,8 GWh) e o m03-inst-03 em ENA 75% cai no ramo "racionamento" por 0,050000000000000266 > 0,05, contra a nota que promete "o desenho de 2021". Tarefas de previsão e de meta dependem de cenários confiáveis.
- **Dependências.** Acesso aos calculadores (`alexandria-instrument-calculators.ts`); lista de frases-promessa das notas; decisão editorial sobre correção (a fonte não é alterada).
- **Risco.** Baixo; é interno. Correções nos calculadores mudam fidelidade à fonte e exigem registro.

## Do estudo do M17 (2026-09-17) — ver `aulas/m17.json`

Já cobertas por propostas anteriores e reaproveitadas no M17: F-M14-5 (banca de enunciados, A11), F-M12-1 (selo de estado datado; todo o módulo está "verificado em 04/08/2026"), F-M03-4 (preset por aula; INST·07 e INST·08), F-M01-08 (instrumento velado até a tentativa; INST·03, 04, 12), F-M05-5 (três níveis restaurados), F-M03-8 (varredura de ramos).

### F-M17-1 · Barra de três parcelas com parcela nula
- **O que faz.** Barra horizontal de três segmentos (dotação · desenho · política) com pesos ordinais. A parcela de peso 0 é desenhada como traço vazio tracejado com a palavra "não explica". Tem modo de tentativa: o learner marca qual vincula e qual não explica antes de ver os pesos.
- **Por que vale.** É a figura-sistema do M17 (A02, A05, A06, A07, A09, INST·03, exercícios 06–10). A informação que "quase nunca aparece", a parcela nula, ganha uma silhueta própria sem usar cor.
- **Dependências.** Pesos por célula com camada e origem; rótulo fixo "ordinais e ilustrativos"; decisão de content QA sobre as 13 células em que o rótulo "não explica" tem peso 1.
- **Risco.** Pesos ordinais lidos como medida. O rótulo precisa ficar colado à barra, e a barra não pode exibir número percentual.

### F-M17-2 · Régua de perímetro reutilizável, com presets de caso
- **O que faz.** Componente de sete trilhos (as sete declarações) com dois cartões-número no topo. O mesmo objeto aparece na A01 (caso €89), no INST·02, na A10 (depois da pilha de custo, "faltam cinco") e na 2ª pergunta do Caso — Operação A, cada vez com um preset de estado declarado/ausente.
- **Por que vale.** Transforma uma lista num instrumento de hábito que o learner reencontra, dando recuperação natural (C10) e unidade ao módulo.
- **Dependências.** Presets como dado com camada (fonte para o caso; alexandria para o preset da aula); registro da marcação do learner por preset.
- **Risco.** Conjuntos divergentes entre fontes (Ex 02 × Q1): a correção automática cobre só a contagem, e a lista fica em autoavaliação.

### F-M17-3 · Matriz de classificação em dois eixos categóricos
- **O que faz.** Grade N × M em que o learner posiciona itens (jurisdições) em duas escolhas independentes (regime de despacho × granularidade) e depois vê a posição da fonte. Destaca as células que quebram a correlação intuitiva.
- **Por que vale.** Na A03, a única forma de mostrar que as duas escolhas de desenho são ortogonais: o Chile despacha por custo e forma preço nodal. Serve também para mecanismo × estágio (A08) e mecanismo × função (A07).
- **Dependências.** Dados categóricos por item com origem (INST·04); versão em lista acessível para teclado e 390.
- **Risco.** Categorias da fonte que não cabem num eixo (China "provincial em transição"): precisa de linha/coluna "outro" nomeada, nunca forçar.

### F-M17-4 · Cascata de correções de grandeza
- **O que faz.** Barras em escala comum mostrando um mesmo número em estados sucessivos de correção (bruto → com fator de entrada → após abatimento; ou energia → + transporte → fatura cheia), com a razão entre o primeiro e o último anotada.
- **Por que vale.** O M17 tem dois erros "de outra grandeza" (A08: €12 mi → €0,6 mi; A10: a ordenação inverte entre camadas). A cascata mostra onde o número muda, não só o resultado final.
- **Dependências.** Calculador que devolve os estágios intermediários (INST·09 e INST·11 já calculam); escala comum que não esmague a menor barra (rótulo direto).
- **Risco.** Uma diferença de 20× deixa a última barra quase invisível: exibir o valor sempre como texto.

### F-M17-5 · Grade de funções institucionais com situação brasileira
- **O que faz.** Tabela viva mecanismo → funções (operar, contabilizar, liquidar, fiscalizar, julgar, financiar) → requisito → quem ocupa no Brasil (ocupada · outra natureza · ausente), com marcação do learner antes da revelação e estado por palavra e silhueta.
- **Por que vale.** É o INST·08 e a terceira lente do módulo. Reaproveita o mapa institucional do M07 (F-M07-1) como gabarito, liga A04, A07, A08 e A11 e troca a pergunta "funcionaria aqui?" pela pergunta certa.
- **Dependências.** Mapa institucional do M07 como dado; preset por aula; conserto das duas incoerências da fonte (síntese × tabela; classe ok com "nenhuma em operação").
- **Risco.** "Ausente" lido como juízo de valor sobre o Brasil. A síntese da fonte ("isto não é juízo…") precisa aparecer junto.

### F-M17-6 · Linha do tempo com faixas invariantes desenhadas
- **O que faz.** Linha do tempo em faixas por instituição (Legislativo, Executivo, Administração, Judiciário), com faixas de fundo planas para o que NÃO mudou (dotação, desenho) e uma linha vertical "verificado em".
- **Por que vale.** A tese da A06 é que algo ficou parado enquanto a política se movia; desenhar o invariante é a demonstração. Serve também ao M16 (estágio) e ao M14.
- **Dependências.** Eventos com data, instituição e origem; eventos sem data exata marcados como intervalo, nunca com data inventada; selo F-M12-1.
- **Risco.** Faixa "plana" lida como afirmação medida. É afirmação da fonte (bloco 4) e precisa de legenda que a cite.

### F-M17-7 · Duas linhas do tempo com vão de assimetria
- **O que faz.** Duas cronologias paralelas (jurisdição de destino × Brasil) na mesma escala, com o intervalo em que uma cobra e a outra ainda não tem preço sombreado por hachura, e o rótulo "cenário-base" tirado da fonte.
- **Por que vale.** A08: "não existe preço de carbono pago no Brasil para abater hoje, e não existirá antes de 2030". O vão transforma a frase em planejamento visível para o exportador.
- **Dependências.** Marcos com estágio da régua (F-M12-1, INST·07); datas futuras sinalizadas como "calendário vigente em <data>".
- **Risco.** Datas futuras que mudam por regulamento de alteração (já houve um adiamento). Selo de reverificação obrigatório.

### F-M17-8 · Verificador de frases numéricas contra os números da própria fonte (interno, content QA)
- **O que faz.** Script que procura, na prosa, afirmações comparativas com números da mesma aula ("maior que o próprio teto", "cerca de 70% acima", "Duas coisas mudaram" + tabela de 4 linhas, "quatro perguntas" + 3 chips) e as confere por aritmética ou contagem.
- **Por que vale.** No M17 achou uma frase numericamente falsa repetida em dois lugares (A05 e quiz Q7: 554,72 − 325 = 229,72 < 325) e três contagens erradas (A06, INST·04, INST·08). Leitura humana deixou passar.
- **Dependências.** Extração com números estruturados; lista de padrões de comparação em pt-BR; decisão editorial registrada (a fonte não é alterada).
- **Risco.** Falso positivo em linguagem aproximada ("cerca de"). A saída é uma fila de revisão, nunca uma correção automática.

### F-M17-9 · Texto de veredito condicionado ao estado de fato
- **O que faz.** Frases factuais dentro do veredito de um instrumento ("o preço vigente está no teto negociado") só aparecem quando a entrada corresponde ao valor de fato (325 US$/MW-dia). Com outro valor, o veredito troca para uma formulação condicional.
- **Por que vale.** O INST·06 afirma um fato sobre o mundo para qualquer número digitado, e isso transforma exploração em afirmação falsa. O mesmo padrão aparece no INST·09 ("a parcela elétrica altera mais que qualquer outro parâmetro").
- **Dependências.** Marcação, no calculador, de quais frases são fato datado e de quais são regra; valores de fato com origem e data.
- **Risco.** Baixo; exige revisão da redação alternativa (camada Alexandria).

---

## Do sistema de arquétipos (2026-09-17) — ver `aulas/SISTEMA.md` e `aulas/mapa-aulas.json`

### F-SIS-1 · Arquétipo como dado da aula
- **O que faz.** O modelo da aula ganha os campos `arquetipo` e `arquetipo_secundario`. O viewer escolhe a gramática de layout por esse dado, e não por aula codificada à mão. Um teste percorre a árvore de decisão da §1 do SISTEMA e sinaliza a aula cujo arquétipo contradiz os próprios campos (ex.: `DOSSIE` sem opção "não é possível concluir").
- **Por que vale.** São 10 gramáticas para 141 aulas. Sem o dado, a variedade vira código divergente por aula e deriva do tronco comum.
- **Dependências.** `mapa-aulas.json` promovido a dado revisado (P3/P11); tipo compartilhado (posse FOUNDRY).
- **Risco.** Engessar exceções legítimas. Mitigação: permitir a quebra só com justificativa registrada, como nas heurísticas do bar.

### F-SIS-2 · Máquina de estados única do ato
- **O que faz.** Um só componente governa todo ato: vazio → registrado → comparação → próximo, com referência velada, autoavaliação em três níveis, nova tentativa, estado por silhueta + palavra e o aviso de E0. Previsão, classificação, posição, ordem, decisão e banca são apenas "corpos" dentro dele.
- **Por que vale.** É o que torna a variedade consistente (T3). Um único ponto de verdade para C7, S3 e S6 em 141 aulas, e um único lugar para emitir o evento de tentativa (§9).
- **Dependências.** Evento de tentativa e persistência (§9); vocabulário de estados do S3.
- **Risco.** Abstração que não cabe na banca (um item por vez) ou no traço. Mitigação: validar nos protótipos M15·A09 e M02·A04 antes de congelar a API.

### F-SIS-3 · Par de números com trilhos de declaração
- **O que faz.** Dois ou mais cartões-número, cada um com fonte e data, ligados por trilhos (grandeza, escopo, critério, data, degrau) que ficam acesos ou vazios. O learner marca os trilhos antes do veredito, e a forma corrigida da frase aparece depois.
- **Por que vale.** Serve 16 aulas `LUPA` (10 delas na Trilha 3) e generaliza F-M17-2, F-M12-3 e F-M16-5 numa peça só. Carrega três marcadores anti-LMS no 1º viewport.
- **Dependências.** Modelo de dados de fonte com data de verificação (§9); `C-SELO`.
- **Risco.** Virar pegadinha. O trilho só existe quando a fonte declara o que falta.

### F-SIS-4 · Barreira de decisão
- **O que faz.** No `DOSSIE`, tudo abaixo da mesa de decisão fica fora da árvore de renderização (não só invisível) até o registro. Uma linha informa que as consequências aparecem depois. As consequências exigem pelo menos duas dimensões com nome e unidade, e o componente rejeita resumo em escore único.
- **Por que vale.** Torna o C8 verificável no render e no DOM (filmstrip e árvore de acessibilidade). A mesma peça serve ao Desafio de decisão do Caso — Operação A (P17) nos 17 módulos.
- **Dependências.** F-SIS-2; persistência da decisão.
- **Risco.** Leitor de tela anunciar conteúdo oculto. Mitigação: não renderizar em vez de esconder.

### F-SIS-5 · Mini-rota do módulo na abertura da aula
- **O que faz.** Na abertura, um fragmento da rota do módulo com "você está aqui", com os mesmos glifos do Mapa, recolhido numa linha a 390 ("Aula 08 de 09 · Módulo 01").
- **Por que vale.** Garante o marcador anti-LMS 1 nas 141 aulas sem depender do corpo, e liga a aula ao território (compromisso de orientação).
- **Dependências.** Progresso real (§9) para os estados; em E0, só a posição.
- **Risco.** Competir com a região dominante da abertura (S1). Mitigação: peso visual menor que a pergunta e sem controle preenchido.

### F-SIS-6 · Detector de previsão que é só recordação (interno, content QA)
- **O que faz.** Para cada previsão do mapa, verifica se o valor de referência aparece literalmente nos blocos anteriores ao ponto de previsão, no corpo da aula. Se aparecer, sinaliza para velar o número (como o "25,1%" da M01·A08) ou trocar de ato.
- **Por que vale.** O mapa tem 131 aulas com previsão. Sem o detector, parte delas vira teste de memória do parágrafo anterior (C3).
- **Dependências.** Corpo re-extraído com índice de bloco; valor de referência estruturado.
- **Risco.** Falso positivo com números comuns (100, 60 Hz). Revisão humana obrigatória.

### F-SIS-7 · Sobreposição de invariantes do tronco (interno, harness de captura)
- **O que faz.** Gera, para três aulas de arquétipos diferentes, uma captura sobreposta a 1440 e a 390 com as caixas de abertura, ato, fonte, camada, registro e próximo passo destacadas, e mede o desvio de posição e de forma entre elas.
- **Por que vale.** Transforma "a variedade não vira inconsistência" num teste de render para o critic System.
- **Dependências.** Harness de captura (`docs/alexandria-v2/harness`); marcação estável dos elementos do tronco (`data-tronco`).
- **Risco.** Medir pixel em vez de papel. O critério é "mesma região relativa e mesma forma", não coordenada idêntica.

### F-SIS-8 · Guarda anti-imitação para espécimes de documento
- **O que faz.** Um lint de conteúdo para `C-DOC` recusa espécime com nome de distribuidora, CNPJ, logotipo, marca real ou valor monetário fora da camada rotulada, e exige o rótulo "documento de exercício".
- **Por que vale.** São 14 aulas com documento esquemático (fatura, contrato, portaria, release). Imitar documento real é gate do §6 e da política de publicação.
- **Dependências.** Lista de entidades reais do currículo (glossário e Biblioteca).
- **Risco.** Bloquear citação legítima de norma (REN, lei). A lista de permissão cobre atos normativos.

---

## Dos protótipos estáticos dos arquétipos (2026-09-17)

Protótipos em `estudos/aulas/prototipos/` (PRANCHA M01·A08, SERIE M02·A04, MESA M13·A06, LUPA M12·A01, SISTEMA M01·A03, DOSSIE M04·A07).

### F-PROT-1 · Número velado na prosa
- **O que faz.** Qualquer número ou trecho da leitura que entrega a resposta de um ato pendente (o "25,1%" da 8.2, o "cai pela metade" da M12·A01, o "cai/sobe" da 3.4) aparece como marca tracejada "velado até a sua previsão" e se revela no mesmo lugar depois do registro.
- **Por que vale.** Resolve o C7 sem reordenar o texto do curso nem cortar frases; a prosa continua literal, só o valor espera.
- **Dependências.** Marcação `velado` por trecho no dado do corpo (depende da re-extração com índice de bloco); F-SIS-6 para achar os candidatos.
- **Risco.** Leitor de tela anunciar o valor oculto. O valor não deve estar na árvore antes do registro.

### F-PROT-2 · Caixa teórica que enche
- **O que faz.** Figura do INST·06: retângulo potência × tempo com o teto rotulado; depois do registro, a área entregue enche e a previsão do learner vira linha tracejada no mesmo retângulo. Tem versão vertical própria a 390.
- **Por que vale.** Desenha a forma que o nome do instrumento promete (C5) e reaproveita o plano P×t da M01·A01/A05 (`C-PRESET`).
- **Dependências.** `V-RET`; registro de previsão (§9).
- **Risco.** Sugerir perfil horário. Selo "esquemático · preenchimento uniforme" obrigatório.

### F-PROT-3 · Barreira de consequências renderizada só depois
- **O que faz.** No DOSSIE, o bloco de consequências (tabela de duas dimensões, leitura do instrumento, balanço) só existe depois da decisão; antes, uma linha tracejada diz que ele aparece depois. As consequências comparam as carteiras vizinhas, sem nota.
- **Por que vale.** Torna o C8 verificável no render (DO-1, DO-2) e é a mesma peça do Desafio de decisão do Caso (P17).
- **Dependências.** F-SIS-4; persistência da decisão e dos campos de premissa e trade-off.
- **Risco.** Tabela de vizinhas virar ranking implícito. Mitigação: nenhuma coluna de total, nenhuma ordenação por custo.

### F-PROT-4 · Marca "um item seu caiu aqui" na matriz
- **O que faz.** Depois da classificação, a linha da matriz que recebeu um item do learner abre inteira e mostra, na célula de alerta, "mesma categoria da matriz" ou "categoria diferente", por silhueta e palavra. O próximo passo muda para "Rever 06.2" quando há diferença.
- **Por que vale.** Liga o ato à referência no próprio palco (ME-1, ME-3) e dá ao C10 um gatilho concreto.
- **Dependências.** `C-CLASSIF` com referência por célula; porte do INST·09 do M13.
- **Risco.** Parecer correção escolar. Sem cor, sem contagem de acertos.

### F-PROT-5 · Marco "hoje" contra "verificado em" com contagem de dias
- **O que faz.** Na cronologia de caso, o último marco verificado tem silhueta própria, e uma linha tracejada "hoje · N dias depois da verificação" leva o selo "verificar: o estado pode ter mudado".
- **Por que vale.** Mostra que o fato mais perecível da aula está envelhecendo (M13·A06, M12) sem inventar estado novo (RE-1, F-M12-1).
- **Dependências.** `C-TL`, `C-SELO` com `verificadoEm`.
- **Risco.** Contagem crescer sem revisão editorial; definir validade por item.

### F-PROT-6 · Trilhos de declaração entre dois cartões-número
- **O que faz.** Entre dois números da mesma fonte, uma coluna lista grandeza, denominador, unidade, ano-base e fonte de cada um; o ato pede ao learner marcar o que uma frase crua declara, e a forma corrigida (camada Alexandria) aparece depois.
- **Por que vale.** Primeira forma concreta de F-SIS-3 validada no render com três marcadores anti-LMS no palco.
- **Dependências.** Fichas de fonte (§Ref) com data.
- **Risco.** Trilho sem declaração da fonte vira invenção; só existe trilho que a fonte sustenta.

### F-PROT-7 · Build de comp com tronco comum
- **O que faz.** `prototipos/_src/build.py` monta qualquer aula-protótipo com o mesmo shell, localizador, rota do módulo, glifos de estado e colofão, embute imagens da curadoria e gera HTML autocontido; `capturar.mjs` produz 1440, página inteira, 390 e o filmstrip vazio → registrado.
- **Por que vale.** Permite que o Design Loop teste novos arquétipos contra os mesmos invariantes do tronco (F-SIS-7) antes de mexer em `src/`.
- **Dependências.** Playwright com o Chrome do sistema; Pillow.
- **Risco.** Divergir do componente real. É ferramenta de estudo, não fonte de verdade de UI.

### F-PROT-8 · Verificador de véu e de versão no render
- **O que faz.** `prototipos/_src/verificar.mjs` abre cada aula a 1440 e a 390, nos estados inicial e registrado, e mede: versões `.dsk-only`/`.mob-only` visíveis, números de referência visíveis antes do registro (só nós de texto com retângulo > 0), rótulos de SVG fora da viewBox e a posição do botão do 1º ato.
- **Por que vale.** Os quatro FAIL de 2026-09-17 (figura duplicada, véu furado, rótulo cortado, dado do ato sumindo a 390) eram todos mensuráveis. O critic passa a ver só o que a máquina não pega.
- **Dependências.** Lista de "números proibidos antes do registro" por aula, derivada do dado do ato (a referência de cada ato).
- **Risco.** Falso positivo do harness: o `innerText` do Chrome inclui texto de SVG oculto, e a medida precisa ser por retângulo. Texto com `transform` exige outra conta de caixa.

### F-PROT-9 · Contagem reconstruível ao lado de rótulo semântico (P23)
- **O que faz.** Quando a numeração da fonte não fecha com o próprio aparato, o título usa rótulo semântico e uma nota "Como contar" mostra a soma (ex.: 5 do currículo + 1 que a aula nomeia + 2 da matriz = 8), cada linha da matriz declara "na lista do currículo" ou "fora da lista", e o título literal fica na ficha de fonte.
- **Por que vale.** O learner reconstrói a contagem sem herdar uma numeração falsa, e a divergência fica registrada em vez de escondida.
- **Dependências.** Registro de proveniência com campo de divergência; P23; catálogo de títulos (P24).
- **Risco.** Nota longa demais no topo da seção. Limite de quatro linhas na soma.

### F-PROT-10 · Matriz que abre depois da bandeja, com linha-exemplo
- **O que faz.** Em `MESA`, o ato de classificação vem antes da matriz. No estado inicial, só uma linha (sem relação com os sinais do ato) fica aberta como exemplo resolvido; as demais mostram só a categoria. No registro, a matriz abre inteira e marca onde caiu cada item.
- **Por que vale.** Fecha o vazamento em que a coluna "como se manifesta" entregava a bandeja (C7), mantendo o exemplo trabalhado que ensina a ler a linha.
- **Dependências.** `C-CLASSIF` com lista de linhas-alvo por ato; escolha da linha-exemplo no dado.
- **Risco.** Matriz fechada parecer conteúdo bloqueado. A legenda diz o porquê e quando abre.

### F-PROT-11 · Atos de seção para trechos longos depois do palco
- **O que faz.** Três formas curtas e reutilizáveis: "ler o instituto" (escolher entre dois estados de um quadro comparativo), "afirmar hoje" (escolher a frase publicável dada a data de verificação) e "o que pedir antes de assinar" (marcar documentos que respondem a uma pergunta). Cada uma tem a referência logo abaixo, velada quando é a frase seguinte.
- **Por que vale.** Cumpre T8 (≤ ≈ 1.350 px sem ato) em aulas narrativas sem inventar exercício da fonte; "afirmar hoje" usa a perecibilidade já declarada.
- **Dependências.** Máquina de estados T3; `C-SELO` com `verificadoEm`; F-PROT-5.
- **Risco.** Virar quiz de memória. Cada ato precisa pedir aplicação (quadro, data, decisão), não repetir a frase anterior.

### F-PROT-12 · Ficha tipográfica de lacuna de curadoria
- **O que faz.** Numa tira de miniaturas, a linha sem imagem licenciada recebe uma ficha tipográfica tracejada ("CCGT · sem foto"), e a legenda explica a lacuna.
- **Por que vale.** Mantém o ritmo visual da tira sem célula vazia e sem imagem gerada para tema documental (§7).
- **Dependências.** Campo de lacuna no `plano.json`.
- **Risco.** A ficha virar permanente. Ela fica listada como pendência de curadoria.
