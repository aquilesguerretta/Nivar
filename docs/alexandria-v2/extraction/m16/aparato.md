# M16 · grupo "aparato"

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo16.html`.
- **Saída:** [`aparato.json`](aparato.json).
- **Extrator:** [`extratores/m16_aparato.mjs`](extratores/m16_aparato.mjs).

## Método

- **Seções.** Localizadas por `<section id="…">` (caso, fichas, quiz, final, ex, ref, lex).
- **Quiz.** Lido avaliando o literal `var Q=[…]` do `<script>` (L5693–5764), com as entidades decodificadas.
- **Campos de texto.** `html` preserva as tags inline e `texto` sai sem elas. Todo item traz `id`, `origem` e, quando é
  o caso, `codigo_atual`.

## Estrutura e contagens

| Chave | Seção da fonte | Contagem | Estado no código |
|---|---|---|---|
| `caso` | §Caso (L3684–3793) | 3 subseções · 6 linhas de diagnóstico · 4 parágrafos · 1 caixa · 0 perguntas · 0 decisões | **Não extraído** |
| `fichas` | §Fichas (L3427–3683) | 6 fichas × 7 campos; 6 campos "deliberadamente incompletos" | **Não extraído** |
| `avaliacao` | §Quiz (L4053) + script | 10 questões × 4 alternativas · 2 faixas de placar · gabaritos A 3 / B 2 / C 3 / D 2 | **Não extraído** |
| `checklist_final` | §Final (L4143) | 30 itens (1 cronometrado) + 1 caixa | **Não extraído** |
| `exercicios` | §Ex (L3873) | 16 em 4 famílias (4/4/6/2) · 0 com aula · 16 soltos (P9) | 16 em `MODULO_16_EXERCICIOS_SOLTOS`, não renderizados |
| `referencias` | §Ref (L4650) | 38 itens · 0 URL · 0 domínio · 8 gatilhos de reverificação · 1 caixa | **Não extraído** |
| `glossario` | §Lex (L4226) | 184 termos em 8 famílias (20/20/22/22/28/24/26/22) | **0 no código: os 184 faltam** |
| `divergencias` | — | 8 | — |

### caso (P17)

- **Título e numeração.** O sec-id é "§Caso · **Operação A — parte 16**", e o h2 é "Pela primeira vez em dezesseis
  partes, ela não é tomadora". Diferente do M01, **a numeração de parte é da própria fonte**, que cita as partes 9 a 15.
- **Diagnóstico 16.1.**
  - 3 linhas "Muda" (Agregação e flexibilidade; Armazenamento atrás do medidor; Relato de escopo 2), cada uma com o
    "Gargalo no caso concreto dela".
  - 3 linhas "Ruído" (Carbono regulado; Medição avançada; Centros de dados).
- **16.2.** Trata da frota contra a linha de diesel da parte 14.
- **16.3.** Traz a caixa "Linguagem das Travas, aplicada", que recusa recomendar.
- **Perguntas e decisão.** `dados`, `perguntas` e `decisao_pedida` são `null`. Mesmo assim, a fonte formula dentro do
  diagnóstico **uma pergunta** que ela mesma responde condicionalmente: "a recarga cai dentro ou fora do pico de
  demanda da operação?". Ela fica em `perguntas_embutidas_no_diagnostico`. O Desafio de decisão é da camada Alexandria
  e usa só os fatos do caso.
- **Vínculo com aula.** Nenhum declarado. Há só a menção em prosa "Aula 03" (16.2).

### fichas

São seis fichas: Eletrificação (Estágio 1), Armazenamento (3), Medição avançada (3 · "regulado, em implantação
inicial"), Agregação (2), Carbono regulado (3) e Centros de dados (4).

Os sete campos de cada ficha são:
1. "O que é";
2. "Evidência do estágio";
3. "Gargalo vinculante";
4. "Norma aplicável";
5. "Efeito sobre a carga";
6. "Quem ganha, quem perde";
7. "O que este número não diz". Este campo é `emp-row vazio` e começa com "**Complete.** Comece por: …". O lede diz que
   completá-lo "é o exercício".

### avaliacao (P18)

| Id | Gabarito | Enunciado (início) |
|---|---|---|
| q01 | C | Em 4 de agosto de 2026, qual é o estado do primeiro certame brasileiro… |
| q02 | A | Dos 215.023 veículos leves "eletrificados"… |
| q03 | D | A projeção oficial leva o consumo da eletromobilidade de 627 GWh… |
| q04 | B | Um sistema de armazenamento de 30 MW e duas horas de duração… |
| q05 | D | Sobre a medição avançada no Brasil, em 4 de agosto de 2026: |
| q06 | A | Qual o estado do prazo da fase I da lei… |
| q07 | B | Uma empresa consome a mesma energia em dois anos consecutivos… |
| q08 | C | O ministério setorial informou 38 GW em pedidos de parecer de acesso… |
| q09 | A | Um interlocutor afirma que "a inteligência artificial vai resolver o despacho"… |
| q10 | C | Um investidor pergunta quais empresas brasileiras estão posicionadas… |

- **Critério literal.** "O critério é oito de dez." No script, `acertos>=8`.
- **Placar.** Tem 2 faixas, cada uma com a mensagem literal: "Critério atingido. …" e "Abaixo do critério de oito
  acertos. …".
- **Mecânica.** O botão "Corrigir" mostra ao mesmo tempo a alternativa certa de todas as questões e todos os feedbacks
  (o feedback é o mesmo para acerto e erro). O botão "Refazer" reinicia tudo. Nada persiste.
- **Leitura pelo P18.** Os 8/10 são desempenho numa atividade e não aprovação.

### checklist_final

- **Itens.** São 30, todos verbatim.
- **Cronometrado.** Só o item 01 ("em menos de um minuto").
- **Item 30.** É uma recusa: "Recuso tanto 'isso vai transformar o setor' quanto 'isso é só discurso'…".
- **Caixa.** "O item trinta é o módulo inteiro".
- **Marcação.** Não há checkbox nem persistência.

### exercicios (P9)

- **Estrutura.** Há 4 famílias (h4) e 16 `<details>`. Cada exercício traz enunciado (o summary sem "NN · "), a resposta
  de referência (`det-bd`) e a família.
- **Tag e critério.** `tag` e `criterio` são `null`, porque a fonte não os tem.
- **Vínculo com aula.** **Nenhum exercício aponta aula**, e a busca por "Aula N" nos 16 dá zero. Os 16 são **soltos**.
- **Comparação com o código.** O prompt do código é igual ao summary em 16/16, e o gabarito é igual ao `<p>` em 16/16.
  `tag: "Ex N"` e `points: 10` são invenções do código, sem origem na fonte.
- **Revelação.** A resposta abre pelo `<details>` nativo, e não há botão. O h2 promete "gabarito fechado até você
  tentar", mas nada impede abrir antes de tentar (gate C7).

### referencias

- **Itens.** São 38, e cada um tem `categoria_fonte` (o `span.src`) e o texto verbatim.
- **Campos vazios.** `titulo`, `instituicao`, `url` e `dominio_citado` são `null` em todos: a fonte descreve as
  instituições por estrutura, pela régua de nomeação.
- **Datas.** `datas_citadas` é extraído por regex, e 31 itens citam alguma data. A **data de consulta** é uma só, a do
  lede ("4 de agosto de 2026").
- **Item 38.** É o "Documento interno · não publicado" (GridAlpha, Currículo Definitivo, War Room, Plano de Negócios).
- **Ref.2.** "Gatilho de reverificação por tema": tabela de 3 colunas e 8 linhas, mais a caixa "A data de validade
  deste bloco".
- **Faltam para a Biblioteca (D5):** o que cada referência responde e o que não responde, URL e última verificação por
  item.

### glossario (P22)

- **Contagem.** A prosa diz "Cento e oitenta e quatro termos, em oito famílias". O markup tem **184** `span.term`, e a
  soma declarada por família também dá 184. As três contagens batem com o catálogo canônico, família por família.
- **Colisões.** As quatro palavras de colisão (crédito, carga, capacidade, flexibilidade) têm verbete.
- **Código.** `alexandria-glossario.ts` **não tem nenhum verbete do M16**, então os 184 faltam. Desses, 16 têm
  homônimo em outro módulo, que o próprio código trata como verbete distinto:
  - Cenário de referência e Parecer de acesso (M07);
  - Corte de geração, Observabilidade, Carga, Fator de carga, Energia armazenada, Disponibilidade e Recurso energético
    distribuído (M08);
  - Flexibilidade e Capacidade (M04, e Flexibilidade também no M08);
  - Resposta da demanda e Serviços ancilares (M02 e M08);
  - Microrrede e Ilhamento (M02);
  - Potência (M01).

**Termos que faltam no código (os 184, por família).**

- **Família 1 · Estágio, evidência e maturidade (20).** Estágio de maturidade, Em operação em escala, Em operação piloto, Regulado e não construído, Anunciado com data, Projeção, Anunciado, Solicitado, Com parecer emitido, Contratado, Energizado, Consumido, Outorga de autorização, Sobre-solicitação, Valor de opção, Garantia vinculada ao pedido, Marco verificável, Cenário de referência, Amplitude de cenário, Estágio confundido.
- **Família 2 · Gargalo, restrição e conexão (20).** Gargalo vinculante, Restrição folgada, Deslocamento de gargalo, Maturidade tecnológica, Regra habilitante, Sinal econômico tarifário, Cadeia de suprimento, Conexão à rede, Parecer de acesso, Capacidade remanescente de escoamento, Fila de acesso, Reforço de rede, Localização como variável de primeira ordem, Corte de geração, Excedente de geração, Observabilidade, Comandabilidade, Gargalo não identificado, Diagnóstico invertido, Política de gestão de fila.
- **Família 3 · Carga, flexibilidade e conversão (22).** Carga, Estado de carga, Carga de trabalho, Flexibilidade, Carga rígida, Carga flexível, Janela de deslocamento, Penalidade de deslocamento, Frequência admissível, Linha de base, Fator de coincidência, Potência coincidente, Consumo específico, Eficiência de recarga, Carga global de energia, Demanda máxima integrada, Cargas especiais, Fator de carga, Utilização, Resposta da demanda, Carga não convertida, Tarifa horária.
- **Família 4 · Eletrificação e recarga (22).** Veículo elétrico a bateria, Híbrido plug-in, Híbrido sem tomada, Híbrido flex, Micro-híbrido, Veículo com tomada, Eletrificado, Emplacamento, Frota circulante, Participação de mercado, Ponto de recarga, Recarga em corrente alternada, Recarga em corrente contínua, Recarga de destino, Recarga de frota em garagem, Recarga unidirecional controlada, Fluxo bidirecional veículo-rede, Gestão de recarga, Margem de recarga, Alíquota de importação, Conteúdo local, Mudança de regime.
- **Família 5 · Armazenamento (28).** Capacidade, Capacidade de armazenamento, Potência, Energia armazenada, Duração, Profundidade de descarga, Eficiência de ciclo, Disponibilidade, Taxa de operação, Degradação, Ciclo, Arbitragem, Spread mínimo de equilíbrio, Empilhamento de receitas, Atrás do medidor, À frente do medidor, Redução de pico, Armazenamento colocalizado, Armazenamento autônomo, Parcela de consumo, Parcela de injeção, Reserva de capacidade na forma de potência, Receita fixa, Modelo de serviço, Economia compartilhada, Custo total presente, Valor residual, Serviços ancilares.
- **Família 6 · Digitalização e recursos distribuídos (24).** Medição avançada, Medidor, Interface com o consumidor, Sistema de comunicação de dados, Sistema de gestão de dados de medição, Interoperabilidade, Governança de dados, Sinalizador de qualidade, Reconciliação, Submedição, Intensidade energética, Rede inteligente, Recomposição automática, Capacidade de hospedagem, Recurso energético distribuído, Agregação, Agregador, Microrrede, Ilhamento, Comunidade de energia, Geração compartilhada, Valor da carga não suprida, Segurança cibernética de tecnologia operacional, Superfície de ataque.
- **Família 7 · Carbono e relato (26).** Crédito, Mercado regulado, Mercado voluntário, Cota de emissões, Certificado de redução ou remoção verificada, Registro central, Plano nacional de alocação, Período de compromisso, Conciliação periódica, Emissões líquidas, Órgão gestor, Mensuração, relato e verificação, Plano de monitoramento, Adicionalidade, Linha de base de projeto, Permanência, Vazamento de emissões, Dupla contagem, Escopo, Escopo 2, Método baseado em localização, Método baseado em mercado, Fator médio da rede, Fator residual, Atributo ambiental, Pratique ou explique.
- **Família 8 · Centros de dados, modelo e comparação (22).** Centro de dados, Potência de tecnologia da informação, Eficiência do uso de energia, Densidade de rack, Rampa de ocupação, Cliente âncora, Redundância, Sistema de energia ininterrupta, Acordo de nível de serviço, Latência, Previsão, Decisão, Restrição de segurança, Amostra fora do período de ajuste, Validação temporal sequencial, Uso de informação futura, Sobreajuste, Desvio de distribuição, Custo de falso negativo, Base de comparação, Comparação entre metodologias, Autor com interesse declarável.

## Divergências (registradas, nenhuma resolvida)

1. **Estágio da medição avançada (`div-m16-estagio-medicao`).**
   - A ficha 03 e o painel do INST·01 dizem "regulado, em implantação inicial".
   - O veredito do INST·02 para a posição 3 diz "regulado e não construído".
   - A régua define a posição 3 como "não há ativo operando", mas a obrigação de instalar corre desde 1º/03/2026.
2. **"Com data de consulta" × itens sem data (`div-m16-ref-data-consulta`).** O h2 do §Ref promete data de consulta,
   mas ela é só global.
3. **"Gabarito fechado até você tentar" (`div-m16-ex-gabarito-fechado`).** O `<details>` abre livremente.
4. **Frase do Q02 sobre micro-híbridos (`div-m16-quiz-q02-microhibridos`).** A explicação diz "sequer entram no
   rótulo, mas entram nele em vários materiais". A leitura é ambígua.
5. **Palavras de colisão (`div-m16-lex-colisao`).** Conferidas: as quatro têm verbete. Não há divergência.
6. **Resíduos ortográficos da fonte (`div-m16-ortografia`).** Mantidos literais:
   - "prórroga" ×15;
   - "perimetro" ×4;
   - "ministérial" ×3;
   - "controvéria" ×1;
   - "milhóes" ×1;
   - "acção" ×1.
7. **Exercícios no código.** `tag` e `points` não têm origem na fonte. Prompt e gabarito batem em 16/16.
8. **Glossário.** Os 184 termos estão ausentes no código.

## Lacunas

- **Caso.** Não tem tabela de dados, perguntas ao learner nem decisão pedida.
- **Exercícios.** Nenhum declara aula, tag ou critério próprio.
- **Referências.** Nenhuma tem URL, domínio, título separado, instituição nomeada, data de consulta própria nem os
  campos D5.
- **Quiz e termos.** Nenhum declara vínculo com aula.
- **Fichas.** O campo "O que este número não diz" é incompleto por desenho da fonte e não foi completado.

## Verificação

### Verificação adversarial independente (2026-09-17)

- **Quiz (100%).** O literal `var Q` foi avaliado de forma independente e conferido por igualdade exata: 10 enunciados,
  40 alternativas, 10 gabaritos e 10 explicações, **todos idênticos**. As origens batem na linha exata. O
  `rotulo_fonte` "Questão N de 10" vem do template do script (L5767) e não é literal do arquivo, o que está declarado.
- **Checklist (100%).** 30/30 itens em `texto`, `html` e linha.
- **Exercícios.** 16/16 (summary e resposta de referência). No código, os 16 prompts e gabaritos são idênticos.
- **Referências.** 38/38 em categoria e texto. Há 0 URL, 31 com data ou ano e 8 linhas na tabela de gatilhos.
- **Glossário.** 184/184 termos e definições, e as famílias somam 20/20/22/22/28/24/26/22. No termo 97, o `<em>` de
  "Spread" foi retirado, como esperado. O código tem 0 verbetes `gl-m16`, e os 16 homônimos foram reconferidos contra os
  550 termos de `alexandria-glossario.ts`: a lista é a mesma.
- **Fichas e caso.** 6 fichas × 7 campos (36 `emp-row` e 6 `emp-row vazio`). O caso tem 3 h3 e 6 `grg-r`. A caixa 16.3
  é o 5º `<p>` da seção, e por isso `paragrafos: 4` está correto.
- **Origens.** Nenhuma está fora de ±3 linhas. As 6 do diagnóstico 16.1 foram conferidas à mão, porque a fonte separa
  os campos com `<br>`.
- **Divergências.** As 8 entradas têm evidência real. `div-m16-lex-colisao` é conferência **sem divergência**, então o
  total efetivo do grupo é **7**. Não há divergência inventada.
- **Correções.** Nenhuma foi necessária neste arquivo nem em `aparato.json`.
