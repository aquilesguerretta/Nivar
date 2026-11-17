# M15 · grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo15.html` (4140 linhas, LF). Saída: [`modulo.json`](modulo.json).
Camada: **fonte** (literal, com origem). Nenhuma divergência foi resolvida aqui.

**Como foi extraído.** `extratores/m15_modulo.mjs` lê o HTML por índice e regex, com um walker de tags balanceadas
(`extratores/lib.mjs`). Nenhum texto de conteúdo foi digitado. `extratores/verify-m15.mjs` conferiu
691 strings de conteúdo deste JSON contra a fonte: 0 falhas.

## Identidade (P24)

| Campo | Literal da fonte | Linha |
|---|---|---|
| `<title>` | Alexandria · Módulo 15 — Petróleo, Gás e Petrobras | L6 |
| kicker | Alexandria · GridAlpha · Módulo 15 | L752 |
| h1 (título) | Petróleo, Gás e Petrobras | L753 |
| subtítulo | Todo número de petróleo e gás pertence a um regime e a uma camada. O regime decide quem é dono da molécula; a camada decide qual preço está sendo citado. E no fim da cadeia do gás existe uma termelétrica — que é por onde este mundo atravessa a fronteira e aparece no preço da eletricidade. | L754 |
| pills do hero (11) | 9 aulas · 10 instrumentos · 6 fichas de elo · 174 termos · 15 exercícios · 20 erros comuns · quiz 8/10 · roteiro oral 9 min · 28 itens de checklist · 36 referências · verificado em 04·08·2026 | L759 |

- **Catálogo canônico:** "Petróleo, Gás e Petrobras". Código (`bloco-15`): "Petróleo, Gás e Petrobras". Fonte (h1): "Petróleo, Gás e Petrobras". **Os três coincidem.**
- **Trilha:** a fonte não declara; o catálogo diz "Especialização Estratégica — **atribuída**; a fonte traz apenas `Alexandria · GridAlpha · Módulo 15`.".
- **Horas:** a fonte **não declara** horas do módulo (`horas.texto = null`). A única menção é a frase do §00.4 sobre o currículo externo ("Ele fornece oito tópicos, duas horas estimadas, prioridade média e uma frase-chave de posicionamento"). O código tem 2–2 h (div-m15-06).
- **Eixos:** `null`. A fonte organiza o módulo em **três lentes** (`tese.lentes`): "Lente 01 — Regime", "Lente 02 — Camada e precificação", "Lente 03 — Acoplamento elétrico".
- **Marca:** "GridAlpha" aparece em 11 linhas (kicker, rodapé, régua de nomeação, blocos P7, feedback da Q10). Lista em `identidade.marca_gridalpha_ocorrencias`.

## Tese (§00)

h2: "Todo número de petróleo e gás pertence a um regime e a uma camada". 21 blocos na ordem da fonte, mais 3 lentes, 3 glosas de desambiguação
(**bacia**, **reserva**, **concessão**) e a régua de nomeação em 3 estados
(1. Permitido nomear — verde; 2. Padrão é não nomear — descrever por estrutura — âmbar; 3. Proibido em qualquer zona, sem exceção — vermelho).

| Subseção | Título |
|---|---|
| §00.1 | A espinha dorsal |
| §00.2 | As três lentes |
| §00.3 | Glosa de desambiguação: três palavras que você já usou com outro sentido |
| §00.4 | O critério de domínio, declarado como construção |
| §00.5 | A régua de nomeação deste módulo, em três estados |
| §00.6 | O que este módulo não faz |

## Resultado esperado

**Não existe na fonte** (`resultado_esperado.itens = null`). O que ocupa esse lugar é o critério construído do §00.4 e o
checklist de 28 itens (aparato). Nenhuma capacidade foi derivada.

## §MAP — mapa da cadeia (não é mapa de aulas)

h2: "Do reservatório ao consumidor, e quem manda em cada ponto". **Não há pergunta por aula** (`perguntas_por_aula = null`). O §MAP traz 9 elos e o INST·01.

| # | Elo | Segmento | Natureza do preço (pill) | Linha |
|---|---|---|---|---|
| 1 | Reservatório | subsolo | — | L1048 |
| 2 | Campo produtor | upstream | contrato de E&P | L1049 |
| 3 | Escoamento | midstream | acesso negociado | L1050 |
| 4 | Processamento | midstream | serviço contratado | L1051 |
| 5 | Transporte | midstream | tarifa | L1052 |
| 6 | Regaseificação | midstream | capacidade contratada | L1053 |
| 7 | Refino | downstream | estratégia comercial | L1054 |
| 8 | Distribuição | downstream | tarifa estadual | L1055 |
| 9 | Consumo | fronteira | CVU declarado | L1056 |

## Roteiro (19 seções = 9 aulas + 10 aparatos)

| # | Marcador | Rótulo | h2 | Subseções | Instrumento | Fichas de elo | Linha |
|---|---|---|---|---|---|---|---|
| 1 | §00 | Tese | Todo número de petróleo e gás pertence a um regime e a uma camada | §00.1, §00.2, §00.3, §00.4, §00.5, §00.6 | — | — | L776 |
| 2 | §MAP | Mapa da cadeia | Do reservatório ao consumidor, e quem manda em cada ponto | — | INST·01 | — | L1036 |
| 3 | Aula 01 | Lente de Regime | Três regimes, um subsolo: quem é dono da molécula | 01.1, 01.2, 01.3, 01.4, 01.5, 01.6 | INST·02 | 01.5, 01.6 | L1101 |
| 4 | Aula 02 | Lente de Regime | Recurso, reserva e produção: três grandezas, e a maior é sempre a citada | 02.1, 02.2, 02.3 | INST·03 | — | L1284 |
| 5 | Aula 03 | Lente de Regime | A parcela do Estado: royalty não é participação especial, e nenhum dos dois é imposto | 03.1, 03.2, 03.3, 03.4 | INST·04 | — | L1464 |
| 6 | Aula 04 | Lente de Camada | "Preço do petróleo" não é um preço: seis camadas entre o reservatório e a bomba | 04.1, 04.2, 04.3 | INST·05 | — | L1622 |
| 7 | Aula 05 | Lente de Camada | Refino: por que o país exporta petróleo e importa derivado ao mesmo tempo | 05.1, 05.2, 05.3, 05.4 | INST·06 | 05.4 | L1805 |
| 8 | Aula 06 | Lente de Camada | Gás natural: o preço quase nunca é preço de mercado | 06.1, 06.2, 06.3 | INST·07 | — | L1950 |
| 9 | Aula 07 | Lente de Camada | GNL e o Novo Mercado de Gás: o que a reforma abriu e o que ainda depende de norma | 07.1, 07.2, 07.3, 07.4, 07.5, 07.6 | INST·08 | 07.5, 07.6 | L2137 |
| 10 | Aula 08 | Lente de Acoplamento Elétrico | Do contrato de gás ao preço da eletricidade — e por que a térmica despacha sem sinal econômico | 08.1, 08.2, 08.3, 08.4 | INST·09 | 08.4 | L2315 |
| 11 | Aula 09 | Síntese | Ler um número ponta a ponta, e o dilema apresentado pelos dois lados | 09.1, 09.2, 09.3, 09.4 | INST·10 | — | L2505 |
| 12 | §Caso | Operação A — parte 15 | A cadeia fóssil que a operação não possui precifica a eletricidade que ela compra | 15.1, 15.2 | — | — | L2682 |
| 13 | §Erros | Vinte erros comuns | Cada um deles é dito por alguém que sabe do assunto | — | — | — | L2759 |
| 14 | §Ex | Quinze exercícios | Quatro famílias, e o gabarito fechado até você tentar | — | — | — | L2797 |
| 15 | §Quiz | Verificação | Dez questões, critério de oito acertos | — | — | — | L2863 |
| 16 | §Voz | Roteiro oral | Nove minutos, para gravar e ouvir de volta | — | — | — | L2884 |
| 17 | §Final | Checklist de domínio | Vinte e oito itens, e o primeiro é o critério | — | — | — | L2921 |
| 18 | §Lex | Glossário | Cento e setenta e quatro termos, em oito famílias | — | — | — | L2974 |
| 19 | §Ref | Referências | Trinta e seis fontes, com data de consulta | — | — | — | L3201 |

**Contagem de aulas (P8):** sec-id "Aula NN" = 9; pill = "9 aulas"; `MODULO_15_AULAS` = 9; `totalInModule` = 9; `AULAS_POR_BLOCO['bloco-15']` = 9; catálogo = 9. **Todos concordam.**

**Títulos (fonte × código × catálogo):**

| Aula | h2 da fonte | Rótulo sec-id | code title | code subtitle | h2 reconstruído | lead = lede | catálogo = h2 |
|---|---|---|---|---|---|---|---|
| 01 | Três regimes, um subsolo: quem é dono da molécula | Lente de Regime | Três regimes, um subsolo | quem é dono da molécula | sim | sim | sim |
| 02 | Recurso, reserva e produção: três grandezas, e a maior é sempre a citada | Lente de Regime | Recurso, reserva e produção | três grandezas, e a maior é sempre a citada | sim | sim | sim |
| 03 | A parcela do Estado: royalty não é participação especial, e nenhum dos dois é imposto | Lente de Regime | A parcela do Estado | royalty não é participação especial, e nenhum dos dois é imposto | sim | sim | sim |
| 04 | "Preço do petróleo" não é um preço: seis camadas entre o reservatório e a bomba | Lente de Camada | "Preço do petróleo" não é um preço | seis camadas entre o reservatório e a bomba | sim | sim | sim |
| 05 | Refino: por que o país exporta petróleo e importa derivado ao mesmo tempo | Lente de Camada | Refino | por que o país exporta petróleo e importa derivado ao mesmo tempo | sim | sim | sim |
| 06 | Gás natural: o preço quase nunca é preço de mercado | Lente de Camada | Gás natural | o preço quase nunca é preço de mercado | sim | sim | sim |
| 07 | GNL e o Novo Mercado de Gás: o que a reforma abriu e o que ainda depende de norma | Lente de Camada | GNL e o Novo Mercado de Gás | o que a reforma abriu e o que ainda depende de norma | sim | sim | sim |
| 08 | Do contrato de gás ao preço da eletricidade — e por que a térmica despacha sem sinal econômico | Lente de Acoplamento Elétrico | Do contrato de gás ao preço da eletricidade | e por que a térmica despacha sem sinal econômico | sim | sim | sim |
| 09 | Ler um número ponta a ponta, e o dilema apresentado pelos dois lados | Síntese | Ler um número ponta a ponta, e o dilema apresentado pelos dois lados | (vazio) | sim | sim | sim |

O código corta o h2 em título + subtítulo; o rótulo de lente do sec-id não existe no código (div-m15-07).

## Critérios (P14 / P18)

| Id | Seção | Literal | P14 (anotação) | Linha |
|---|---|---|---|---|
| m15-crit-construido | §00.4 | Diante de qualquer número de petróleo ou gás apresentado em conversa ou em material — produção, reserva, royalty, preço de gás, capacidade de escoamento, margem de refino —, você consegue nomear em menos de um minuto o regime contratual a que ele pertence, a camada da cadeia em que aquele preço se formou, e se a grandeza citada é recurso, reserva ou produção; e consegue explicar, sem consultar nota, por que o custo do gás natural aparece no custo variável de uma termelétrica e atravessa para o preço da eletricidade — e por que esse custo frequentemente não responde ao preço do gás do dia. | cronometrado, producao_oral_ou_livre, sem_consulta | L960 |
| m15-crit-exercicios | §Ex | As quatro famílias correspondem ao critério construído no §00.4: identificação de regime, identificação de camada, separação de grandeza e acoplamento. Escreva a resposta antes de abrir. O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto. | cronometrado, autoavaliado_sem_registro | L2800 |
| m15-crit-quiz | §Quiz | O critério é oito de dez. Abaixo disso, a matéria ainda não sustenta uma conversa com um interlocutor de óleo e gás — não por falta de informação, mas porque o erro em qualquer uma destas questões é de regime, de camada, de grandeza ou de acoplamento, e esses são exatamente os quatro que alguém que vive o setor identifica na primeira frase. | automatizavel, P18_limiar_nao_e_evidencia | L2866 |
| m15-crit-voz | §Voz | O teste real deste bloco não é escrito — é falado, porque a situação que ele antecipa é uma conversa em que alguém cita um número e espera concordância. Grave os nove minutos abaixo sem ler, ouça de volta, e marque cada momento em que você citou um número sem dizer o regime, a camada ou o critério de certeza. É a métrica que importa. | producao_oral_ou_livre, cronometrado, gravado_autoavaliado | L2887 |
| m15-crit-checklist | §Final | O primeiro item é o critério construído no §00.4, na sua forma operacional. O último é o mais difícil de todos, e é o que separa analista de militante. | producao_oral_ou_livre, cronometrado_no_item_1 | L2924 |

- §Quiz: prosa, h2, pill e script concordam em **8/10** (`acertos>=8` → "Critério atingido."). Sem contradição interna, diferente do M01.
- §Final: o item 1 do checklist é declarado "forma operacional" do critério construído, mas o conteúdo difere (div-m15-04).
- Pelo P18, nenhuma forma é "o" critério; a extração só registra.

## Laboratórios

**Não há § Lab** nem "LAB ·" na fonte. O instrumento de módulo é o **INST·01** (§MAP) → `instrumentos.json`.

## Voz — roteiro oral (§Voz)

h2: "Nove minutos, para gravar e ouvir de volta".

| Tempo | Título | Linha |
|---|---|---|
| 0:00–1:00 | A frase de posicionamento, e o que ela obriga | L2893 |
| 1:00–2:00 | Regime, e por que dois números não se somam | L2894 |
| 2:00–3:00 | Recurso, reserva e produção | L2895 |
| 3:00–4:00 | A parcela do Estado, que são sete fluxos | L2896 |
| 4:00–5:00 | Preço do petróleo não é um preço | L2897 |
| 5:00–6:00 | Política de preços, como mecanismo e com dois lados | L2898 |
| 6:00–7:00 | Gás: produção bruta não é oferta | L2899 |
| 7:00–8:00 | A abertura do mercado de gás, em quatro estados | L2900 |
| 8:00–9:00 | O acoplamento, que é onde isso vira preço de eletricidade | L2901 |

Caixa final: "Duas perguntas que você deve conseguir devolver sem hesitar".

## Princípios editoriais

| Id | Rótulo / papel | Linha |
|---|---|---|
| m15-tese-caixa-01 | A frase-chave deste bloco, e o que ela pede | L801 |
| m15-tese-caixa-02 | A espinha dorsal do Bloco 15 | L817 |
| m15-tese-caixa-03 | Números vivos · verificar na fonte antes de uso externo | L835 |
| m15-tese-caixa-04 | Mais três, sem glosa própria mas com a mesma armadilha | L943 |
| m15-tese-caixa-06 | Extensão declarada da Trava 2 do War Room | L1007 |
| m15-principio-regua | régua de nomeação em três estados (P24/voz) |  |
| m15-principio-regua-final | A régua de nomeação, para consulta rápida antes de publicar | L2958 |
| m15-principio-ref | política de fonte (primária × parte interessada) | L3204 |
| m15-principio-nao-faz | §00.6 O que este módulo não faz |  |
| m15-rodape-03 | isenção de responsabilidade / perecibilidade | L3257 |
| m15-rodape-04 | isenção de responsabilidade / perecibilidade | L3260 |

## Erros comuns (§Erros) — 20 itens

Cabeçalho: Afirmação frequente | Correção | Teste imediato.

| # | Afirmação frequente | Teste imediato | Linha |
|---|---|---|---|
| 1 | "O pré-sal é um campo." | Especifique bacia, campo, bloco e regime. | L2769 |
| 2 | "Descoberta significa reserva." | Procure o boletim anual de reservas e a declaração de comercialidade. | L2770 |
| 3 | "O Brasil tem 29 bilhões de barris de reserva." | Pergunte o critério e a data de referência. | L2771 |
| 4 | "As reservas são certificadas pela ANP." | Leia a norma de declaração de reservas. | L2772 |
| 5 | "Produção de gás é oferta de gás." | Use sempre o gás disponibilizado ao mercado. | L2773 |
| 6 | "Reinjeção é desperdício." | Pergunte o motivo declarado da reinjeção. | L2774 |
| 7 | "Somando a produção dos campos, temos a receita do setor." | Separe por regime antes de somar qualquer receita. | L2775 |
| 8 | "A partilha significa que a empresa entrega metade da produção." | Leia o contrato e o percentual ofertado. | L2776 |
| 9 | "Cessão onerosa é um tipo de concessão." | Verifique o instrumento normativo aplicável ao campo. | L2777 |
| 10 | "Royalties e participação especial são a mesma coisa." | Compare o número de municípios beneficiários de cada um. | L2778 |
| 11 | "Royalty é imposto." | Verifique a base legal e a natureza jurídica. | L2779 |
| 12 | "A referência internacional é o preço que o produtor recebe." | Use preço realizado, não cotação de tela. | L2780 |
| 13 | "A companhia estatal define o preço da bomba." | Decomponha as seis camadas antes de atribuir causa. | L2781 |
| 14 | "Não há mais referência internacional na precificação doméstica." | Leia a diretriz comercial publicada. | L2782 |
| 15 | "Exportar cru e importar diesel é irracional." | Compare margem incremental e logística. | L2783 |
| 16 | "Gás barato na costa é gás barato na fábrica." | Calcule o preço entregue no ponto, não na origem. | L2784 |
| 17 | "O gás liquefeito importado é sempre mais caro." | Some frete, internalização, regaseificação e transporte antes de comparar. | L2785 |
| 18 | "A Nova Lei do Gás abriu o mercado." | Aplique os quatro estados de política, dispositivo por dispositivo. | L2786 |
| 19 | "A térmica está gerando, logo o gás está barato." | Pergunte se a geração está acima ou abaixo da inflexibilidade declarada. | L2787 |
| 20 | "Captura e armazenamento de carbono tornam o barril neutro." | Declare o escopo de cada número de emissão. | L2788 |

## Tradutor

Não existe no M15 (`tradutor = null`).

## Blocos "Onde isso entra no produto" (P7) — 10

| Id | Seção | Cita GridAlpha | Linha |
|---|---|---|---|
| m15-p7-01 | §MAP | sim | L1087 |
| m15-p7-02 | Aula 01 | sim | L1267 |
| m15-p7-03 | Aula 02 | não | L1451 |
| m15-p7-04 | Aula 03 | sim | L1607 |
| m15-p7-05 | Aula 04 | não | L1790 |
| m15-p7-06 | Aula 05 | sim | L1935 |
| m15-p7-07 | Aula 06 | sim | L2125 |
| m15-p7-08 | Aula 07 | não | L2301 |
| m15-p7-09 | Aula 08 | sim | L2489 |
| m15-p7-10 | Aula 09 | sim | L2659 |

## Código: o que falta ou não chega à tela

- §00 (tese, lentes, glosas, régua, critério construído), §MAP (9 elos), §Caso, §Erros, §Quiz, §Voz, §Final, §Lex e §Ref não estão em src/lib/data para o M15 (o cabeçalho do arquivo declara o §Lex fora de escopo).
- `MODULO_15_EXERCICIOS_SOLTOS` e `MODULO_15_INSTRUMENTOS` não são importados por `RecursosDoModulo.tsx` (registro só até `modulo-09`). Leitura de código.
- nenhum badge usa o checklist do M15 (BLOCOS_COM_CONTEUDO = 01..03).

## Divergências (12)

- **div-m15-01-nove-elos** (fonte×fonte) — Os "nove elos" do div.cad não são os nove elos do INST·01.
  - §MAP div.cad (L1047): Reservatório · Campo produtor · Escoamento · Processamento · Transporte · Regaseificação · Refino · Distribuição · Consumo
  - <script> INST·01 ELOS (L3335): Campo produtor · Ponto de medição fiscal · Gasoduto de escoamento · Unidade de processamento · Gasoduto de transporte · Terminal de regaseificação · Refinaria · Distribuidora estadual de gás · Termelétrica a gás
  - Nota: O lede do §MAP diz que "os mesmos nove objetos se reagrupam". O div.cad tem Reservatório e Consumo; o INST·01 troca esses dois por Ponto de medição fiscal e Termelétrica a gás, e nomeia os demais de outro modo (Escoamento × Gasoduto de escoamento, Refino × Refinaria…).
- **div-m15-02-reagrupamentos** (fonte×fonte) — Contagem de grupos por dimensão: prosa do §MAP × dados do INST·01.
  - §MAP p.lede (L1039): agrupados por segmento, formam três blocos; por regime jurídico, cinco; por acoplamento elétrico, quatro; por natureza do preço, quatro outros
  - INST·01 ELOS (valores distintos medidos): seg 3 · reg 5 · ac 4 · pr 9
  - Nota: Segmento (3), regime (5) e acoplamento (4) batem. "Natureza do preço, quatro outros" não bate: o campo pr tem 9 valores distintos (Misto — mercado e contrato | Valor fixado por norma | Acesso negociado entre partes | Serviço contratado | Tarifa de entrada e saída | Capacidade contratada e serviço | Misto — estratégia comercial e mercado | Tarifa regulada estadual | Custo variável declarado).
- **div-m15-03-rotulo-recebe** (fonte×fonte) — INST·01: rótulo "Recebe" exibe o segmento.
  - script INST·01 painel(): '<div class="fz i"><span class="fzk">Recebe</span><span class="fzv">'+esc(e.seg)+
  - Nota: O cartão rotulado "Recebe" mostra o segmento (Upstream/Midstream/Downstream) e o texto "faz". Não há campo "recebe" nos dados. Resíduo do original, sinalizado e não corrigido (§10).
- **div-m15-04-criterio-formas** (fonte×fonte) — Critério de domínio em cinco formas.
  - §00.4: Diante de qualquer número de petróleo ou gás apresentado em conversa ou em material — produção, reserva, royalty, preço de gás, capacidade de escoamento, margem de refino —, você consegue nomear em menos de um minuto o regime contratual a que ele pertence, a camada da cadeia em que aquele preço se formou, e se a grandeza citada é recurso, reserva ou produção; e consegue explicar, sem consultar nota, por que o custo do gás natural aparece no custo variável de uma termelétrica e atravessa para o preço da eletricidade — e por que esse custo frequentemente não responde ao preço do gás do dia.
  - §Ex: As quatro famílias correspondem ao critério construído no §00.4: identificação de regime, identificação de camada, separação de grandeza e acoplamento. Escreva a resposta antes de abrir. O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.
  - §Quiz: O critério é oito de dez. Abaixo disso, a matéria ainda não sustenta uma conversa com um interlocutor de óleo e gás — não por falta de informação, mas porque o erro em qualquer uma destas questões é de regime, de camada, de grandeza ou de acoplamento, e esses são exatamente os quatro que alguém que vive o setor identifica na primeira frase.
  - §Voz: O teste real deste bloco não é escrito — é falado, porque a situação que ele antecipa é uma conversa em que alguém cita um número e espera concordância. Grave os nove minutos abaixo sem ler, ouça de volta, e marque cada momento em que você citou um número sem dizer o regime, a camada ou o critério de certeza. É a métrica que importa.
  - §Final: O primeiro item é o critério construído no §00.4, na sua forma operacional. O último é o mais difícil de todos, e é o que separa analista de militante.
  - Nota: P18: nenhuma forma prevalece. O §Final diz que o item 1 é "o critério construído no §00.4, na sua forma operacional", mas o conteúdo difere: o §00.4 pede também explicar a passagem do custo do gás para o CVU e para o preço (não está no item 1; aparece nos itens 26-27), e o item 1 acrescenta "digo qual dos três a fonte omitiu".
- **div-m15-05-parte-15** (fonte×decisão) — O §Caso se rotula "Operação A — parte 15".
  - §Caso .sec-id (L2682): Operação A — parte 15
  - decisão P17: Não existe "Parte 1"; título "Caso — Operação A"
  - Nota: A fonte numera o caso como parte de uma série (a lede cita "as catorze partes anteriores" e a "parte 09"). Literal preservado; P17 governa a camada Alexandria.
- **div-m15-06-horas** (fonte×código) — Horas do módulo.
  - fonte: hero sem horas; §00.4: "Ele fornece oito tópicos, duas horas estimadas, prioridade média e uma frase-chave de posicionamento"
  - alexandria-blocks.ts bloco-15: estimatedHoursMin 2 · estimatedHoursMax 2
  - Nota: A frase descreve o currículo externo, não o módulo (9 aulas, 10 instrumentos, 28 itens, 9 min de oral). O 2–2 do código não tem declaração própria do módulo como origem.
- **div-m15-07-titulos-aula** (fonte×código) — Título/subtítulo das aulas no código são cortes do h2; o rótulo de lente do sec-id não existe no código.
  - Aula 01: h2 "Três regimes, um subsolo: quem é dono da molécula" \| sec-id "Lente de Regime" \| código title "Três regimes, um subsolo" / subtitle "quem é dono da molécula"
  - Aula 02: h2 "Recurso, reserva e produção: três grandezas, e a maior é sempre a citada" \| sec-id "Lente de Regime" \| código title "Recurso, reserva e produção" / subtitle "três grandezas, e a maior é sempre a citada"
  - Aula 03: h2 "A parcela do Estado: royalty não é participação especial, e nenhum dos dois é imposto" \| sec-id "Lente de Regime" \| código title "A parcela do Estado" / subtitle "royalty não é participação especial, e nenhum dos dois é imposto"
  - Aula 04: h2 ""Preço do petróleo" não é um preço: seis camadas entre o reservatório e a bomba" \| sec-id "Lente de Camada" \| código title ""Preço do petróleo" não é um preço" / subtitle "seis camadas entre o reservatório e a bomba"
  - Aula 05: h2 "Refino: por que o país exporta petróleo e importa derivado ao mesmo tempo" \| sec-id "Lente de Camada" \| código title "Refino" / subtitle "por que o país exporta petróleo e importa derivado ao mesmo tempo"
  - Aula 06: h2 "Gás natural: o preço quase nunca é preço de mercado" \| sec-id "Lente de Camada" \| código title "Gás natural" / subtitle "o preço quase nunca é preço de mercado"
  - Aula 07: h2 "GNL e o Novo Mercado de Gás: o que a reforma abriu e o que ainda depende de norma" \| sec-id "Lente de Camada" \| código title "GNL e o Novo Mercado de Gás" / subtitle "o que a reforma abriu e o que ainda depende de norma"
  - Aula 08: h2 "Do contrato de gás ao preço da eletricidade — e por que a térmica despacha sem sinal econômico" \| sec-id "Lente de Acoplamento Elétrico" \| código title "Do contrato de gás ao preço da eletricidade" / subtitle "e por que a térmica despacha sem sinal econômico"
  - Aula 09: h2 "Ler um número ponta a ponta, e o dilema apresentado pelos dois lados" \| sec-id "Síntese" \| código title "Ler um número ponta a ponta, e o dilema apresentado pelos dois lados" / subtitle ""
  - Nota: O código corta o h2 em ":"/" — " (título + subtítulo); o h2 se reconstrói em 9/9. A Aula 09 fica com subtitle "". O rótulo do sec-id ("Lente de Regime", "Lente de Camada", "Lente de Acoplamento Elétrico", "Síntese") não aparece em lugar nenhum do arquivo de conteúdo (0/9).
- **div-m15-08-recursos-nao-registrados** (fonte×código) — Exercícios soltos e INST·01 portados mas não registrados na interface.
  - alexandria-modulo-15-content.ts: export MODULO_15_EXERCICIOS_SOLTOS (15) e MODULO_15_INSTRUMENTOS (m15-inst-01)
  - RecursosDoModulo.tsx: RECURSOS registra só 'modulo-01'..'modulo-09'
  - Nota: Deduzido por leitura de código (não medido na tela). Nenhum outro arquivo importa as duas exportações.
- **div-m15-09-catalogo-citacao-truncada** (fonte×catálogo) — Citação do §00.4 truncada no catálogo canônico.
  - fonte §00.4: O currículo definitivo não fornece critério de domínio para o Bloco 15, e não fornece lista de recursos primários — verificado no arquivo, não presumido. Ele fornece oito tópicos, duas horas estimadas, prioridade média e uma frase-chave de posicionamento. O critério abaixo é construção deste módulo, derivada da justificativa declarada no currículo e da frase-chave, e é oferecida a correção:
  - catalogo-modulos-alexandria.md: "O currículo definitivo não fornece critério de domínio para o Bloco 15, e não fornece lista de recursos primários — verificado no arquivo, não presumido. Ele fornece oito tópicos, duas horas estimadas, prioridade média e uma frase-chave de posicionamento. O critério abaixo é construção deste módulo."
  - Nota: O catálogo fecha a citação com ponto depois de "construção deste módulo" e omite ", derivada da justificativa declarada no currículo e da frase-chave, e é oferecida a correção:".
- **div-m15-10-catalogo-siglas** (fonte×catálogo) — Termos centrais no catálogo usam siglas que não são nomes de verbete.
  - catálogo "Termos centrais": UPGN, FSRU, CVU, CMO, GNL
  - fonte §Lex: Unidade de processamento de gás natural · Unidade flutuante de armazenamento e regaseificação · Custo variável unitário · Custo marginal de operação · Gás natural liquefeito
  - Nota: Paráfrase do catálogo; a lista literal dos 174 está em aparato.json. "Oferta Permanente" do catálogo junta dois verbetes (Concessão e Partilha).
- **div-m15-11-marca** (fonte×decisão) — Marca GridAlpha em texto voltado ao learner.
  - fonte: 11 linhas com "GridAlpha" (1 no script)
  - P24: Alexandria (produto) / NIVAR (empresa)
  - Nota: Kicker, rodapé, régua de nomeação ("concorrente direto da GridAlpha"), blocos P7 e o feedback da Q10 do quiz. Literal preservado.
- **div-m15-12-oito-topicos** (fonte×fonte) — "Oito tópicos" do currículo externo × 9 aulas do módulo.
  - fonte §00.4: Ele fornece oito tópicos
  - fonte (sec-id "Aula NN"): 9 seções de aula
  - Nota: A frase descreve o que o currículo externo fornece, não o roteiro do módulo; o markup (9 aulas) vence para a contagem (P8). O mapeamento tópico→aula não é declarado na fonte. Registrado, não resolvido.

## Verificação

Verificador independente (scripts próprios, sem reaproveitar `lib.mjs` nem `verify-m15.mjs`): o `var Q` do quiz
foi avaliado direto do HTML e comparado campo a campo; checklist, exercícios, glossário, referências, erros comuns e
roteiro oral foram reparseados por regex próprio e comparados em igualdade estrita (html com espaços colapsados);
as 558 origens com `linha_aprox` dos três JSONs foram conferidas contra a janela de ±3 linhas; as linhas de cálculo,
fórmulas de exibição e ramos dos 10 instrumentos foram conferidos na linha declarada; os `dados_script` foram
reavaliados do literal e comparados em profundidade; as contagens foram recontadas no HTML.

Resultado neste grupo: 20/20 erros comuns e 9/9 trechos de voz idênticos; 11 linhas com "GridAlpha", 5 formas de
critério, 9 aulas e 19 seções confirmadas; nenhuma divergência inventada (as 12 foram reconferidas na fonte).

**Correção 1 — bloco P7 perdido (contagem 9 → 10).** O regex de `m15_modulo.mjs` exigia o rótulo exato
"Onde isso entra no produto" e não casava o bloco da Aula 08 (L2489), cujo rótulo continua ("… — e este é o gancho
mais direto do currículo até aqui"). A fonte tem **10** blocos P7 (§MAP + as 9 aulas), 7 deles citando GridAlpha. O
extrator agora casa o prefixo, grava o rótulo literal em `rotulo` e trava a contagem em 10; `blocos_p7` passou a 10.

**Correção 4 — linhas da fonte (4141 → 4140).** O HTML termina em LF; `split('\n')` gerava uma linha vazia a
mais. `wc -l` dá 4140, e a última linha (`</html>`) é a 4140. Corrigido em `fonte_linhas` (modulo) e
`fonte.linhas_total` (aparato); nenhuma `linha_aprox` mudou.

**Segunda verificação adversarial (2026-09-17), sem correções.** Scripts novos, sem reaproveitar os extratores:
as 548 origens com `trecho_inicial` ficaram dentro de ±3 linhas; 1.003 campos de texto e 1.103 campos html/script
foram buscados na fonte normalizada, e as únicas ausências são anotações (`literal` das divergências, que compõem
leituras) e textos calculados (`cenario_padrao.veredito`), além do espaço que o `texto` das fichas insere antes de
`span.mini`. Houve igualdade estrita em 10/10 questões do quiz, 2/2 faixas, 28/28 itens do checklist, 15/15
exercícios, 174/174 termos, 36/36 referências, 20/20 erros e 9/9 trechos de voz. Conferiram também as 34 fórmulas
de readout (cada escrita do script, na linha declarada), as 88 linhas de cálculo e os 25 ramos, que batem com as
25 classes `verdict` do script. As contagens recontadas no HTML batem com as declaradas: 33 entradas, 11 grupos
`seg`, 34 células `ro`, 11 linhas "GridAlpha" (10 + 1 no script), 10 blocos P7 e 6 "Preencha.". Os 4 valores
distintos de seg, os 5 de reg, os 4 de ac e os 9 de pr foram reavaliados do `var ELOS`. As afirmações sobre o
código foram reconferidas: `RECURSOS` vai até `modulo-09`, `O&amp;M` aparece na L693, `put("ac-gb", gb)`,
o painel usa `maximumFractionDigits` e há 2/2 horas em `alexandria-blocks.ts`.
