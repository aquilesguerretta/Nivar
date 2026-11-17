# Features propostas: movimento e conquistas

Arquivo acumulativo. Cada estudo acrescenta ao fim e nunca sobrescreve.

---

## Do estudo de referências de conquistas (2026-09-17)

Fonte: `referencias-conquistas.md`.

### F-C1 — Caderno de marcos (coleção de marcos de percurso)

**O que faz.** Uma seção da camada de motivação no Progresso (D1, item 8) lista os marcos de percurso obtidos.

- Cada marco é um disco gravado com nome de ato, data no exergo e território.
- A ordem é pela data de conclusão (padrão Strava).
- Os marcos não obtidos aparecem com silhueta tracejada e critério legível, nunca ocultos.

**Por que vale.** Responde ao pedido de "badges lindas" dentro de D2. É objeto de ofício, não pontuação.

**Dependências (§9).**

- Progresso real por learner.
- Camada de motivação com regras honestas e persistência.
- Contagens reconciliadas (P8/P22) para os marcos de módulo e território.
- Os eventos `aula_concluida` e `aula_iniciada` já existem.

**Risco contra o bar.**

- Virar "fileira de insígnias de consumo" (cópia do North Star, §6). Mitigação: ficar abaixo da evidência, em
  corpo menor.
- Nomes-persona reintroduzirem competência (D2).

### F-C2 — Verso do marco (critério, evento, data e seta de volta)

**O que faz.** Ao abrir um marco, ele vira no eixo Y, sem mola, e mostra:

- o critério em 1 frase;
- o evento que o concedeu ("aula concluída · M01·A09");
- a data;
- uma seta de referência que leva ao lugar do ato.

**Por que vale.** Torna cada conquista rastreável, como o nome gravado na aresta das medalhas de 1851. Cumpre a
verificação de D2 ("o texto corresponde ao evento") dentro do próprio produto, e dá ida e volta (D6).

**Dependências (§9).** Persistência do registro com o id do evento e a data. As regras vêm de `badgeRules.ts`
(`avaliar` ≠ `null`).

**Risco contra o bar.**

- Rotação com overshoot (S6).
- Linguagem interna no verso: "evento", "regra v1" e nomes de tabela (S4). O texto precisa ser escrito para o
  learner.

### F-C3 — Cunhagem do marco na conclusão da aula

**O que faz.** Quando `aula_concluida` é registrado, a animação acontece dentro do fluxo, sem modal:

1. o glifo de estado da aula se reduz até a coleção (elemento compartilhado);
2. o relevo se forma em 3 passes de luz rasante, com camadas do asset;
3. a data aparece no exergo;
4. o tique da aula é desenhado no anel do módulo.

Com movimento reduzido, o estado final aparece direto.

**Por que vale.** É a "animação de conclusão" pedida, com função de chegada e continuidade (S6). Não é
celebração genérica.

**Dependências (§9).**

- Progresso real ligado ao front.
- Assets de relevo em camadas: render Blender a partir de traço de buril, sem texto.
- Filmstrip ≥ 5 quadros, normal e com movimento reduzido.

**Risco contra o bar.**

- Bloquear o fluxo (S3).
- Tentação de tremor, reflexo ou partículas (S2 e S6).
- Relevo feito com sombra ou gradiente de CSS (S2).

### F-C4 — Registros pessoais datados

**O que faz.** Linhas tabulares na camada de motivação, sem objeto gráfico. Exemplos: "Maior sequência de dias
com estudo: N (até DATA)" e "Aulas concluídas numa semana: N".

**Por que vale.** Dá a motivação dos Personal Records do Duolingo como fato, sem virar prêmio nem status.

**Dependências (§9).**

- Carimbo de data confiável nos eventos, com fuso definido. **A verificar no contrato de backend.**
- Persistência da camada de motivação.

**Risco contra o bar.**

- Premiar volume em vez de estudo.
- Aparecer acima da evidência.
- Mostrar número em E0 (S3).

### F-C5 — Rosa de exploração do Atlas

**O que faz.** Um marco de exploração com 4 pontos cardeais, um por submercado visitado no Atlas. Cada ponto é
gravado quando a visita é registrada. Reformula honestamente o legado "Cartógrafo do SIN" para "Explorou os
quatro submercados no Atlas", sem o nome-persona.

**Por que vale.** A hierarquia cresce por subdivisão contável (rosa-dos-ventos), e o marco é comportamental por
natureza.

**Dependências (§9).**

- Um evento de visita a submercado no Atlas, que **não existe** hoje (`instrumento_usado` nunca é emitido e não
  cobre o Atlas).
- Emissão de eventos e persistência.

**Risco contra o bar.**

- Flor-de-lis ou rumos coloridos (S2).
- Ponto cardeal lido como "nível".

### F-C6 — Plaqueta de competência (reservada)

**O que faz.** Um formato retangular de raio 0, distinto do disco, reservado para sinais de competência. Só
existe quando houver tarefa portadora de evidência com regra de avaliação. Mostra a tarefa, a regra, o resultado
e a data. Até lá, o produto mostra só "Demonstrado: ainda não avaliado", **sem plaqueta vazia nem cadeado**.

**Por que vale.** Garante, pela silhueta, que a competência nunca se confunda com comportamento. É o princípio
de 1851, em que a classe muda o formato.

**Dependências (§9).** Tarefas portadoras de evidência com regra (hoje não existem). Avaliação do módulo com o
critério literal da fonte (P5).

**Risco contra o bar.**

- Aparecer como placeholder (S4 e §6, "Controle inerte").
- Ser usada para o quiz do módulo, que é "resultado de avaliação" e não Demonstrado (S3/P5).

---

## Do estudo de referências de movimento (2026-09-17)

Fonte: `referencias-movimento.md`.

### F-M1 — Portão automático de curva e loop

**O que faz.** Uma checagem, que pode ser regra do `gridalpha-detect` ou um script em `tools/`, reprova no código
da Alexandria:

- `cubic-bezier` com y₁ ou y₂ fora de [0, 1];
- mola com `bounce > 0`;
- `animation-iteration-count: infinite` sem guarda de `prefers-reduced-motion`.

**Por que vale.** Torna o gate de S6 (sem bounce ou overshoot) verificável sem filmstrip. As duas curvas de
overshoot medidas (60fps `(0.175,0.885,0.32,1.275)` e changelog do Linear `(0.45,1.45,0.8,1)`) viram casos de
teste, e a home do Linear (101 loops sob reduce) vira o anti-exemplo.

**Dependências (§9).** Nenhuma. O auditor já existe, mas a nova regra é trabalho da FOUNDRY ou do LYCEUM.

**Risco contra o bar.** Baixo. Não substitui o filmstrip: movimento com curva válida ainda pode não ter função.

### F-M2 — Viagem entre estações no globo (arco traçado + slerp)

**O que faz.** Ao escolher "próxima aula" ou ao retomar, o globo gira por slerp até a estação, com inclinação
fixa de 15–20°. Durante a rotação, o arco de grande círculo é traçado da posição atual até o destino
(1200 ms, ease-in-out) e a cauda é recolhida em 250 ms. O trecho fica desenhado como rastro de "percorrido", e o
futuro fica pontilhado. A moldura e o graticulado externo ficam parados. Com movimento reduzido, a estação já
aparece centrada e o arco já desenhado.

**Por que vale.** É a "animação do globo" pedida com função dupla, continuidade e chegada (S6). Transforma o
globo de objeto decorativo em objeto que trabalha (A2).

**Dependências (§9).**

- Progresso real por learner, para "de onde" e "até onde percorrido". Sem ele, só a viagem de navegação, sem
  rastro.
- Decisão de técnica na rodada de globo: sequência pré-renderizada no Blender por aresta, ou reprojeção em canvas
  com `d3-geo`.

**Risco contra o bar.**

- Virar globo decorativo que gira sozinho (§6, cópia do North Star).
- Parallax de camadas.
- Arrasto com inércia e quique (overshoot).
- Rastro mostrado em E0 sem evento (S3).

### F-M3 — Troca globo ↔ planisfério do percurso

**O que faz.** Um controle alterna a vista de orientação (globo) e a vista do todo (planisfério com as 17
estações), interpolando as funções brutas da projeção em ~800 ms, **sem rotação simultânea**.

**Por que vale.** Continuidade espacial entre "onde estou" e "o percurso inteiro" sem trocar de tela. Responde a
B3 (território ocupado, com posição) e D1 (jornada como território).

**Dependências (§9).** Nenhuma para a vista em si. O estado por estação depende de progresso real e das contagens
reconciliadas (P8).

**Risco contra o bar.**

- Controle inerte, se o planisfério não tiver função própria (§6).
- Cartela ou moldura ornamental no planisfério (S2).

### F-M4 — Máquina de estados de estação e marco dirigida por evento

**O que faz.** Cada estação e cada marco têm estados explícitos e transições com duração própria. O único gatilho
é um evento real de §9:

| Transição | Evento | Duração |
|---|---|---|
| não iniciada → em leitura | `aula_iniciada` | `corte` |
| em leitura → percorrida | `aula_concluida` | Chegada de 700 ms |

"Com prática" e "demonstrado" **não têm aresta** até que os eventos ou tarefas existam. O modelo é a Rive
(view model com trigger), implementado em código.

**Por que vale.** D2 vira arquitetura: nenhum estado é alcançável sem o evento correspondente. As durações por
aresta implementam a regra de frequência (Emil e Apple).

**Dependências (§9).**

- Emissão de `exercicio_respondido` e `instrumento_usado` (hoje aceitos, nunca emitidos).
- Tarefas portadoras de evidência, para Demonstrado.
- Persistência da camada de motivação.

**Risco contra o bar.** Estado de competência criado "por conveniência" antes da evidência (S3 e §6, competência
falsa).

### F-M5 — Replay do percurso

**O que faz.** Um botão de play no Progresso (D1) redesenha o percurso real, na ordem das datas de
`aula_concluida`: estação por estação, com o eixo de datas fixo e o rótulo da data corrente. Pode ser pausado e
termina no estado completo, como o play da OWID.

**Por que vale.** Transforma o histórico em narrativa espacial sem dashboard. É a "atividade recente" de D1
(item 7) com evento real, e dá motivação sem pontos.

**Dependências (§9).**

- Progresso real persistido **com data** por evento. É preciso verificar o fuso e o carimbo no contrato de
  backend.
- Ligação do front ao progresso real.

**Risco contra o bar.**

- Aparecer em E0 ou com mock (S3).
- Play automático.
- Reescalar o eixo durante o play, que engana a leitura.

### F-M6 — Harness de filmstrip e duração por vídeo

**O que faz.** Reaproveita `media-lab/movimento-e-conquistas/referencias/medir_movimento.cjs` e o detector de
cena do ffmpeg para produzir, por superfície:

- filmstrip de ≥ 5 quadros, em modo normal e com reduced-motion;
- duração medida de cada rajada de movimento;
- `document.getAnimations().length` em repouso com reduce, que precisa ser 0;
- comparação do quadro final entre os dois modos.

**Por que vale.** S6 exige filmstrip e proíbe aprovação por screenshot. Hoje não há ferramenta repetível para
isso.

**Dependências (§9).** Nenhuma.

**Risco contra o bar.** Jitter de ±33 ms na gravação headless: a medida serve de faixa, não de valor exato. Aba
oculta estrangula o rAF (AGENTS.md), então é preciso medir `innerWidth` e a visibilidade antes.

---

## Da especificação de movimento e conquistas (2026-09-17)

Fontes: `sistema-de-movimento.md` e `sistema-de-conquistas.md`.

### F-MC1 — Só o que mudou anima

**O que faz.** A Home guarda, por navegador, a última lista de trechos percorridos que o learner viu. Na chegada
seguinte (momento 1), só os trechos novos são traçados, e o resto aparece já desenhado.

- A lista fica em `localStorage`, dentro de try/catch.
- Sem storage, traça só o último trecho do registro.

**Por que vale.** A chegada vira notícia ("isto é novo desde a sua última visita") em vez de ritual repetido, e o
movimento fica raro (M6) sem perder a consequência do estudo feito em outro dispositivo.

**Dependências (§9).**

- Progresso real ligado ao front (`getMyProgress`), que já existe.
- Nenhum evento novo.

**Risco contra o bar.**

- O storage é conveniência por navegador e nunca pode virar fonte de estado (S3). O trecho desenhado vem sempre do
  servidor.
- Em outro dispositivo, a Home traça trechos já "vistos": isso é aceitável e honesto.

### F-MC2 — Pré-visualização de território na faixa da Home

**O que faz.** Ativar uma linha da faixa "O currículo em três territórios" gira o globo até aquele território
(momento 2). Aparecem a linha "Vendo: II · …" e o botão "Voltar à sua posição". O CTA de retomada não muda.

**Por que vale.** O globo passa a trabalhar (A2). A faixa deixa de ser uma lista estática e vira um controle com
consequência espacial.

**Dependências (§9).**

- Nenhum evento.
- Precisa da sequência de quadros do Blender (`sistema-de-movimento.md` §5). Sem ela, o fallback é o cruzamento das
  imagens estáticas.

**Risco contra o bar.**

- Controle que parece mudar de trilha sem mudar (S1): o CTA e a chamada precisam dizer "vendo", não "você está
  aqui".
- Ativação repetida virando carrossel. A mitigação é o corte a partir da segunda ativação em 2 s.

### F-MC3 — Linha de registro da aula (Percorrido · Praticado · Demonstrado)

**O que faz.** Uma linha fixa no topo e no fim de cada aula, com as três dimensões de S3 em palavra e silhueta:

- presente desde a abertura (momento 4);
- atualizada no mesmo quadro de cada ato (momento 5);
- fechada na conclusão (momento 6).

Substitui o "✓ Aula concluída" em oliva do `AulaViewer` atual.

**Por que vale.** Cumpre o gate de rastro de S6 num lugar só e dá à conclusão uma forma que não é "aprovado"
(P18).

**Dependências (§9).**

- Percorrido: hoje.
- Praticado: emissão e persistência de `exercicio_respondido` e `instrumento_usado`. Até lá, "nesta sessão · ainda
  não salvo na conta".
- Demonstrado: tarefas portadoras. Até lá, "ainda não avaliado".

**Risco contra o bar.** Parecer painel de status (LMS) se ganhar barras ou percentuais. A linha é tipográfica e não
tem "%".

### F-MC4 — Registro retroativo honesto de conquistas

**O que faz.** Quando o catálogo novo entrar, as regras de CONCLUSÃO são avaliadas sobre as conclusões já
existentes. As conquistas são gravadas com `awarded_at` = dia do registro e com a frase "as aulas foram concluídas
antes desta data". Não há cunhagem animada.

**Por que vale.** O learner que já estudou não começa com o caderno vazio, e o produto não inventa a data do fato.

**Dependências (§9).**

- Camada de motivação com regras e persistência (`badge_award` já existe).
- Contagens reconciliadas (P8).

**Risco contra o bar.** Data falsa, se alguém usar o `completed_at` de uma aula como data da conquista de módulo sem
dizer. A mitigação é o texto fixo do §5 do sistema de conquistas.

### F-MC5 — Leitura do log de eventos para o learner

**O que faz.** Um endpoint de leitura do `progress_event` do próprio learner (paginado, com `event_type`, `entity_id`,
`occurred_at` e `metadata`).

**Por que vale.** Destrava as regras que dependem de ordem ou de dias:

- previsão → comparação;
- dias distintos de estudo;
- primeira revisita;
- replay do percurso (F-M5);
- "atividade recente" de D1.

**Dependências (§9).**

- Endpoint novo no backend (posse do CURSOR).
- Definição de fuso.

**Risco contra o bar.** Virar feed de atividade com aparência de rede social. A leitura é só para o próprio learner,
no Progresso, e abaixo da evidência.

### F-MC6 — Correção da sequência: fuso e tipo de evento

**O que faz.** Dois ajustes em `study_streak`:

1. o dia passa a ser calculado em `America/Sao_Paulo`, ou no fuso do learner, e não no `CURRENT_DATE` do banco;
2. `badge_conquistado` deixa de contar como dia de estudo.

**Por que vale.** Sem isso, a sequência mostra um número errado para quem estuda à noite, e a própria concessão de
conquista alonga a sequência. Isso é dado falso na camada de motivação.

**Dependências (§9).**

- Migration e regra no backend (posse do CURSOR).
- Decisão do Founder sobre o fuso de referência.

**Risco contra o bar.** Nenhum novo. O risco atual (número incorreto) é o que se corrige.

### F-MC7 — Eventos de instrumento com valores

**O que faz.** `InstrumentPanel` ganha um callback de resultado e emite `instrumento_usado` com
`metadata.alterouParametro` e os `valores` relevantes, com um debounce: um evento por sessão de manipulação, não por
tique do controle.

**Por que vale.** Abre o Praticado de instrumento (S3) e as conquistas de comportamento sobre instrumentos:

- "Os dois lados de 0,92 explorados";
- "Matriz reconstruída nas duas lentes";
- "Instrumentos do M01 manipulados".

Nenhuma delas afirma desempenho.

**Dependências (§9).**

- Emissão e persistência.
- Callback no `InstrumentPanel` (hoje sem callback, e marcado como NUNCA MODIFICAR numa wave anterior: é preciso
  reabrir a posse).

**Risco contra o bar.**

- Ler `valores` como acerto e conceder por desempenho (P18, D2). A regra lê só o comportamento.
- Evento a cada tique inflando o log.

---

## Dos protótipos de movimento (2026-09-17)

Surgiram ao construir e capturar `media-lab/movimento-e-conquistas/prototipos/` (momentos 3 a 10).

### F-MP1 — Relógio de movimento com "estado primeiro, animação de onde veio"

**O que faz.** Um motor pequeno (`_base/movimento.js` nos protótipos) em que todo passo muda o DOM para o estado final
em corte e só então cria a animação `fill: backwards` do estado anterior. Os passos de sistema de um momento colapsam
no quadro do gatilho com movimento reduzido; interrupção chama `finalizar()`; o mesmo motor tem um relógio virtual
(`seek(t)`) para capturar quadros exatos.

**Por que vale.** Torna M3, M4, M5 e M7 propriedades da arquitetura, não disciplina de cada componente. Nos 28
trabalhos capturados, o final normal e o final reduzido deram 0,000 % de diferença de pixel e `textContent` idêntico
sem nenhum código específico de reduzido, e o repouso ficou com 0 animações vivas.

**Dependências (§9).** Nenhuma de backend. Decisão de dependência do LYCEUM/Founder (substitui ou convive com a
View Transitions API e com `motion`).

**Risco contra o bar.** Baixo. O risco é usar o motor para enfeite (M1): cada `momento()` deve nomear a função.

### F-MP2 — Filmstrip determinístico por seek (sem jitter de vídeo)

**O que faz.** O harness (`_ferramentas/capturar.cjs`) captura quadros com `__proto.seek(t)` no relógio virtual,
em vez de extrair do vídeo com ±33 ms de jitter; mede caixas e opacidades a cada 8 ms e grava tudo em JSON; o
vídeo continua existindo para o julgamento em playback (S6).

**Por que vale.** Os `t` das tabelas da especificação viram quadros exatos, e o aceite "nunca passa da posição final"
passa a ser medido (achou um salto real de 42–66 px no próximo passo, corrigido reservando o texto do fechamento).

**Dependências (§9).** Nenhuma. No produto, exige expor o relógio do momento em modo de teste.

**Risco contra o bar.** Tratar o filmstrip como aprovação: ele é evidência; a aprovação de movimento continua sendo
o vídeo completo (S6).

### F-MP3 — Espaço reservado para o que chega

**O que faz.** Todo bloco que aparece dentro de uma coreografia (fechamento do módulo, marco do território, botão
"Comparar com o cálculo", escala do instrumento, carta 160→320) tem o lugar reservado desde o quadro 0
(`visibility: hidden` com o texto final já presente), para nada abaixo dele — em especial a próxima ação — saltar.

**Por que vale.** M7 ("a próxima ação é clicável desde o primeiro quadro") só vale se ela não muda de lugar depois.

**Dependências (§9).** Nenhuma.

**Risco contra o bar.** Buraco vazio visível antes da chegada; no fim da aula ele fica abaixo da dobra ou é curto.

### F-MP4 — Dial do módulo (limbo com N estações) no fim da aula

**O que faz.** O mini-percurso do bloco de conclusão vira um dial: N discos de aula num círculo, arcos a tinta entre
os percorridos, e um limbo externo que se fecha quando o módulo é concluído. É a mesma gramática da orla da medalha
("limbo com N tiques, todos fechados") e do marco geodésico.

**Por que vale.** Dá ao momento 7 um gesto de chegada próprio e legível em cinza (silhueta fechada × aberta), e liga
a evidência à medalha sem transformar a medalha em prova.

**Dependências (§9).** `totalAulas` reconciliado (P8); sem ele o dial não é desenhado (variante
`reconciliada=0`).

**Risco contra o bar.** Parecer "progresso circular" de dashboard (donut). Mitigação: discos discretos com glifo de
estado e número de aula, sem percentual, sem preenchimento contínuo.

### F-MP5 — Mini-carta do território recortada do globo

**O que faz.** Um recorte do render r04 (V1 D2000) em volta da ilha do território, com o mar trocado por papel com
linhas gravadas e contornos de costa (`_ferramentas/preparar_carta.py`), e estações/rota vindas do mesmo JSON do
Blender. Usada no fim do módulo (160 px) e no marco do território (320 px).

**Por que vale.** O percurso aparece no mesmo mundo do globo da Home, na superfície de papel da aula, sem outro
navy grande no viewport.

**Dependências (§9).** Nenhuma para o desenho; progresso real para o estado.

**Risco contra o bar.** Ser lida como mapa real (§7 M4): a legenda "modelo do currículo, não mapa geográfico" é
obrigatória junto dela.

### F-MP6 — Sonda de arte da medalha com placeholder

**O que faz.** O bloco de motivação carrega as 4 camadas da medalha de `medalhas/<id>/` quando existem e cai no
placeholder neutro (`assets/medalha/`) quando não; `data-placeholder` diz qual está na tela, e a legenda da folha
declara.

**Por que vale.** Os protótipos e as capturas podem ser refeitos quando a arte chegar, sem editar código.

**Dependências (§9).** Produção das medalhas (`sistema-de-conquistas.md` §7).

**Risco contra o bar.** Placeholder ir para produção. Só existe em `media-lab/`.

## Da produção das medalhas (2026-09-17)

Origem: `media-lab/movimento-e-conquistas/medalhas/`.

### F-MD1 — Limbo de tiques vivo sobre a medalha de módulo

**O que faz.** A medalha de módulo é entregue sem o anel de N tiques. Um `<svg>` de 1 px por cima do disco desenha N
tiques no raio da grafila, com N = `aulasDoModulo(m).length`, e os tiques das aulas concluídas ficam cheios.

**Por que vale.** N vem da coleção (P22) e vários módulos ainda têm `totalAulas: null` (P8). Assar N na imagem seria
número digitado. Como camada viva, o tique é o que o movimento desenha na conclusão (consequência, S6), e a mesma
medalha serve antes e depois de uma reconciliação.

**Dependências (§9).** Só `aula_concluida` (existe). Contagem reconciliada para o módulo; sem ela, o anel não
aparece e a linha diz "contagem em revisão".

**Risco contra o bar.** Virar barra de progresso circular com %. Regra: sem número dentro do anel, sem cor por
estado (cheio × vazado é a pista, S3), e nunca na Home.

### F-MD2 — Verso cunhado

**O que faz.** Um segundo render por família: o reverso liso, com orla e exergo, sem motivo. O HTML escreve por cima
o critério, o evento de origem e a data (como a medalha Rumford nomeia o assunto no reverso).

**Por que vale.** A virada do detalhe (corte de 150 ms, §4) passa a mostrar o mesmo objeto por trás, em vez de um
cartão genérico. Custo: 4 renders por faixa.

**Dependências (§9).** Nenhuma nova; texto do verso já definido no §5.

**Risco contra o bar.** Contraste do texto sobre o metal. Só entra com contraste medido ≥ 4,5:1 (a variante do verso
pode ser a cega, sobre papel).

### F-MD3 — Estação do globo → medalha (mesmo objeto)

**O que faz.** Na conclusão de módulo, o disco de latão da estação no globo (mesmo material, `brass_material`) vira a
medalha no bloco de conclusão: elemento compartilhado com redução (pantógrafo), e o triângulo da estação cai na
mesma posição relativa da ilha gravada no tímpano.

**Por que vale.** Continuidade real (S6): a medalha de módulo *é* a estação cravada, não um ícone novo. As placas das
medalhas saem da mesma carta r04, então a ilha do tímpano coincide com a do globo.

**Dependências (§9).** `aula_concluida` (existe) e as âncoras de estação do globo (`globo-*.json`).

**Risco contra o bar.** Movimento longo bloqueando a aula. Máximo de 600 ms, sem mola, fora do caminho da próxima
ação. Com movimento reduzido, a medalha aparece no lugar final.

### F-MD4 — Vitrine do território sobre navy

**O que faz.** No fim de um território, a faixa navy mostra as medalhas daquele território na variante N (ouro sobre
navy) a 192 CSS, em fila única. As não obtidas não aparecem nessa faixa.

**Por que vale.** É o único lugar em que o ouro é da regra (S2), e a vitrine usa a faixa V (768 px) já produzida.

**Dependências (§9).** Todos os `conclusao.modulo` do território, com contagens reconciliadas.

**Risco contra o bar.** "Fileira de insígnias de consumo" (§6, cópia do North Star) e sala de troféus (museu).
Regra: só no Progresso, nunca na Home, sem contagem total e sem legenda de prêmio.

### F-MD5 — Pátina por idade do registro

**O que faz.** Três renders de pátina (recente, assentada, antiga), trocados pela idade de `awarded_at`. O recente tem
fundos mais escuros e altos mais claros; com o tempo, o contraste assenta.

**Por que vale.** Dá tempo ao caderno de marcos sem número nem cor nova: a pátina é estado temporal, não mérito
(`referencias-conquistas.md` §2.4).

**Dependências (§9).** `badge_award.awarded_at` (existe no backend).

**Risco contra o bar.** Ser lida como "a revisar" ou "perdendo validade". A diferença fica sutil (ΔL ≤ 6) e nunca
some; nenhuma medalha expira (§8).

---

## Da produção das sequências do globo (2026-09-17)

Fonte: `media-lab/movimento-e-conquistas/globo/` (LEIAME.md, medicoes/).

### F-G1 — Globo em vídeo opaco com máscara circular fixa

**O que faz.** A rotação do globo sai como MP4 H.264 **sem alfa**, recortado no navegador por um `clip-path:
circle()` fixo (ou pela `mascara-alfa.png`). A curva vem embutida nos quadros, então o `<video>` toca na velocidade
natural. O anel "você está aqui" segue o quadro exibido por `requestVideoFrameCallback` (`mediaTime` × fps, com o
índice lido do JSON da sequência). Para o retorno, toca o arquivo invertido. No último quadro, a imagem estática
de alta resolução entra num corte, e a pose é idêntica.

**Por que vale.** Foi medido em 48 quadros por sequência: o alfa do globo é o mesmo disco em todos os quadros, e só
muda o antisserrilhado do limbo (≤ 9/255, no anel de 1 px em r ≈ 400). Por isso o vídeo não precisa de canal alfa.
Esse caminho funciona igual no Safari, que não tem VP9 com alfa, e sai de 8,4 MB (quadros WebP) para 0,9 MB por
aresta.

**Dependências (§9).**

- Nenhum evento novo.
- Hospedagem dos MP4 em `public/` (posse do LYCEUM).
- Pré-carregamento em `requestIdleCallback` depois do primeiro quadro da Home.

**Risco contra o bar.**

- Autoplay bloqueado (modo de pouca energia do iOS): `play()` é rejeitado. O momento precisa ir direto ao estado
  final (M3), nunca mostrar um vídeo parado com botão de play.
- `clip-path` com raio diferente do disco deixa uma franja visível. O raio sai do JSON (`globo.r`), nunca é
  digitado à mão.

### F-G2 — Pré-carregamento por intenção na faixa de territórios

**O que faz.** Passar o mouse ou focar pelo teclado numa linha da faixa "O currículo em três territórios" começa a
baixar a aresta Vatual→Valvo (≈ 0,9 MB). O download não começa no carregamento da Home.

**Por que vale.** Sem ele, a pré-visualização do momento 2 que chega antes do download perde a rotação e cai no
corte, conforme o contrato. Com ele, a rotação existe quando o learner pede, e quem nunca pede não paga o peso.

**Dependências (§9).** Nenhuma. Depende de F-MC2 (pré-visualização na faixa) existir.

**Risco contra o bar.** Baixo. Não pode virar pré-carregamento de todas as arestas (peso) nem animação de hover
(M6: hover não gira o globo).

### F-G3 — Aresta direta V1→V3 e tamanho 520 px

**O que faz.** Estende a produção para a aresta V1→V3 (32,9°, 1480 ms, 72 quadros) e para o tamanho 520 px de
dispositivo (390 px de largura a 1x e 2x), com o mesmo `globo_seq.py`.

**Por que vale.** Sem a aresta direta, V1→V3 encadeia duas sequências e passa por uma parada em V2 que não
significa nada. Sem 520 px, o celular baixa e reduz o vídeo de 866 px.

**Dependências (§9).** Nenhuma. É tempo de GPU: ≈ 30 s por quadro a 800 px, sob a trava.

**Risco contra o bar.** Nenhum novo. O aceite (§5.4) se repete por aresta.

### F-G4 — Vista de descanso como estado de E0

**O que faz.** Para um learner sem registro (E0), a Home mostra o globo em V0, a vista de conjunto das 17
estações, em vez de V1. O momento 1 gira V0→V1 só quando existir uma trilha atual.

**Por que vale.** Em E0 não há "meu lugar", e mostrar V1 insinua uma posição que não foi registrada (S3). V0 mostra
o todo sem afirmar posição. Hoje V0 existe só como primeiro quadro das sequências, sem render estático próprio.

**Dependências (§9).**

- Render estático de V0 nos seis tamanhos.
- Âncoras de letreiro (`ancoras_r04.py`) para V0.

**Risco contra o bar.** Baixo. O rótulo "você está aqui" não pode aparecer em V0.

## Da rodada 2 dos protótipos de movimento (2026-09-17)

Surgiram ao reler as folhas dos momentos 7 a 9. Protótipos em
`media-lab/movimento-e-conquistas/prototipos/`.

### F-MP7 — Portão "o alvo da coreografia está no viewport"

**O que faz.** No harness de aceite (F-M6), cada momento declara o elemento que carrega a chegada (a medalha no
momento 8, o anel no momento 7). O teste reprova a folha se esse elemento não intersecta o viewport em nenhum
quadro. O teste mede depois de descontar o header e o localizador presos, e mede também um bloco que nasce com
`display:none`.

**Por que vale.** A folha 1440 do p08 da rodada 1 passou em todos os critérios medidos e não mostrava a medalha. O
alvo da rolagem estava oculto quando foi medido. Um screenshot que não mostra o momento não aprova nada, mas
também não pode passar sem aviso.

**Dependências (§9).** Nenhuma. É ferramenta de verificação.

**Risco contra o bar.** Nenhum. Reforça o S6 (o filmstrip aprova).

### F-MP8 — Trazer a medalha à vista no fim de aula a 390, sem rolagem automática

**O que faz.** A 390, quando uma conquista é registrada, o próximo passo continua acima dela. A linha "Registro de
percurso: Módulo 01 concluído ↓" aparece junto do próximo passo, em corte, como link de âncora para a medalha. A
página nunca rola sozinha.

**Por que vale.** A 390, a cunhagem acontece abaixo da dobra e ninguém a vê. A rolagem automática seria
scroll-jacking (S6). Uma linha de texto torna a chegada encontrável sem roubar a ação principal.

**Dependências (§9).** `badge_conquistado` com `badgeAlreadyAwarded === false`, igual ao momento 8.

**Risco contra o bar.** Médio. A linha fica abaixo do próximo passo, na voz de motivação, sem cor de destaque. Se
competir com o próximo passo (S1), sai.

### F-MD6 — Camadas de cunhagem provisórias dos mapas de altura

**O que faz.** Gera as 4 camadas cumulativas (cego, campo, figura e orla) sombreando em Python os mapas de altura
da frente de medalhas. Usa luz rasante fixa, a rampa da variante A e regiões radiais medidas. É o
`prototipos/_ferramentas/medalha_de_alturas.py`. Serve de fallback até o render Blender e de referência de
luminância para o aceite §7.5 ("camadas monotônicas").

**Por que vale.** O tempo da cunhagem passou a ser julgado com a geometria real (ilha, estações e orla), em vez de
um disco genérico. O script também mede a luminância por camada, e o render final pode ser comparado a esse
número.

**Dependências (§9).** Nenhuma. Usa `medalhas/alturas/`. Se `alturas_v2/*-regioes.png` for publicado, as regiões
devem vir dele, e não do raio.

**Risco contra o bar.** Baixo, desde que nunca entre em produção como arte final: não tem material de latão nem
oclusão, e o S2 pede o relevo do render. A proveniência fica declarada no README dos protótipos.

## Da série v2 das medalhas (2026-09-17, rodada de arte)

### F-MD7 — Gravura tonal: Higgsfield dá o tom, o buril dá a linha

**O que faz.** Transforma uma gravura gerada em trama gravada no período de pixel de cada faixa. O desenho
procedural fixa a composição e é mandado como referência ao gerador (edição por referência). Da imagem que volta
saem só três coisas: o tom local, os traços fortes e a direção da trama. A trama é redesenhada em 4 direções, com
a largura do sulco proporcional ao tom e trama cruzada nos tons escuros. Está em `medalhas/hf_v2.py`.

**Por que vale.** A trama fina de uma imagem gerada vira ruído e moiré abaixo de 192 CSS. Com esse método a
riqueza da mão entra sem perder o registro nem a leitura a 48 CSS. O mesmo método serve para os emblemas de
território, as fichas do glossário e o verso das medalhas (F-MD2).

**Dependências (§9).** Nenhuma. É produção de mídia.

**Risco contra o bar.** Baixo. O risco é aceitar a gravura onde ela só acrescenta textura. A regra de aceite é
a comparação lado a lado no render real, motivo a motivo, registrada em `higgsfield/lote2/decisao.json`. O
M7 (teste de remoção) vale para cada motivo.

### F-MD8 — Pátina por cavidade como token de material compartilhado

**O que faz.** Fixa num só lugar os parâmetros do bronze patinado: fundo dos sulcos escuro, altos polidos claros,
meso-relevo e contraste (`P` em `compor_medalha.py`). O globo (discos de estação) e qualquer objeto cunhado
futuro compõem com o mesmo conjunto.

**Por que vale.** A medalha e a estação do globo têm de ser o mesmo objeto do mundo (F-MD3). Sem parâmetro
compartilhado, as duas derivam em cor e contraste a cada rodada. Um só `P` também facilita a crítica: dá para
mudar a pátina da série toda de uma vez.

**Dependências (§9).** Nenhuma. É coordenação entre as frentes de mídia (medalhas e globo).

**Risco contra o bar.** Baixo. Os meios-tons continuam medidos contra os tokens (ΔE00 ≤ 5, `verificar.py`).

### F-MD9 — Curvas de nível como chão gravado dos lugares

**O que faz.** Reaproveita o gerador de curvas de nível da medalha "Primeira aula percorrida" (`contornos()` em
`altura_v2.py`) como textura de chão, em traço de 1 px, nos cartões de estação e na abertura de módulo. O relevo é
inventado e coerente com a ilha do território.

**Por que vale.** É cartografia, não ornamento. Dá ao lugar a leitura de território ocupado (B3) sem textura atrás
de texto e sem fantasia.

**Dependências (§9).** Nenhuma.

**Risco contra o bar.** Médio. Atrás de texto pequeno, a textura tem de ser imperceptível (S2). Só entra onde não
há texto por cima, ou a opacidade é medida.

## Da medição de formato das sequências do globo (2026-09-20)

Fonte: `media-lab/movimento-e-conquistas/globo/` (`medicoes/*-linhas.json`, `*-escada.json`, `*-520.json`) e
`sequencias-do-globo.md`.

### F-G5 — Retenção do buril como critério de aceite de codec, em toda mídia gravada

**O que faz.** Fixa uma métrica e um corte para aprovar qualquer codec que toque a gravura: a **retenção das linhas**
— correlação normalizada entre a diferença vertical do decodificado e a do mestre, dentro da máscara do traço
(no globo, o mar; nas medalhas, os sulcos), medida separadamente **na sombra**, onde a linha afina. Corte proposto:
≥ 0,94 na sombra. Está em `escada_linhas.py` e roda sobre qualquer par mestre/decodificado.

**Por que vale.** PSNR e ΔE76 globais aprovam codecs que já apagaram o buril: H.264 crf26 marca 31 dB de PSNR e
ΔE76 6,0 — números que passariam num aceite comum — e derruba a retenção na sombra para 0,782, com o mar chapando
visivelmente a 4×. A materialidade (S2) é a coisa que o bar exige e é a primeira que a compressão come. Sem uma
métrica que olhe o traço, "medimos a qualidade" vira uma frase.

**Dependências (§9).** Nenhuma. É ferramenta de media-lab; nada entra no bundle.

**Risco contra o bar.** Baixo. O risco real é o oposto: adotar o corte e depois aprovar por screenshot. A medição
tem de rodar por arquivo entregue, e ficar no `provenance.json` da rodada.

### F-G6 — O trecho é traçado no quadro final, e o `-rota.json` por quadro não vai para o bundle

**O que faz.** Serve à Home apenas o `<aresta>.json` (44–67 KB: estações e territórios por quadro) e deixa o
`<aresta>-rota.json` (0,92–1,38 MB) no media-lab. Durante o giro, só o anel "você está aqui" acompanha; o trecho
percorrido é desenhado no quadro final, sobre a pose idêntica ao render estático.

**Por que vale.** Os pontos da rota por quadro pesam **mais que o vídeo inteiro** da aresta recomendada (1,38 MB
contra 1,72 MB) para desenhar algo que o momento 2 já manda não redesenhar durante a rotação. É peso puro. E há um
ganho de significado: o trecho é evidência de Percorrido (S3), não um enfeite que gira junto — desenhá-lo na
chegada é o que o faz ler como consequência.

**Dependências (§9).** Nenhuma. É decisão de empacotamento.

**Risco contra o bar.** Baixo. Se algum momento futuro quiser traçar durante o giro, o arquivo existe e a decisão
se reabre com medição, não por gosto.

### F-G7 — Degraus de `<source>` sem um segundo pipeline de alfa

**O que faz.** A sequência é servida como `<video>` com `<source>` em degraus — AV1 em MP4 onde houver, H.264
`tune=animation` crf16 como base — **todos opacos**, com o alfa vindo sempre do mesmo `clip-path: circle()` com o
raio lido de `globo.r` no JSON. Nenhum arquivo com canal alfa é produzido para o produto.

**Por que vale.** O alfa do globo é um disco fixo (desvio ≤ 11/255 em ≤ 512 px do limbo, medido nas 6 arestas), e
codificá-lo custa caro e divide o pipeline: VP9 com alfa não tem alfa no Safari, e o alfa em vídeo nas plataformas
Apple é HEVC `hvc1`, que exige um mac no caminho de build. Com o recorte em CSS, um único pipeline de encode serve
todos os navegadores, e o AV1 entra como economia de peso (1,46 MB × 1,72 MB) sem risco: quem não suporta cai no
degrau seguinte.

**Dependências (§9).**

- Hospedagem dos MP4 em `public/` (posse do LYCEUM), dois arquivos por aresta e tamanho (ida e reverso).
- Nenhum evento novo.

**Risco contra o bar.** Médio, num ponto só: o raio do `clip-path` tem de sair do JSON. Digitado à mão, deixa
franja no limbo ou corta o globo — e franja em volta do globo é exatamente o tipo de sujeira que o S2 não perdoa.

### F-G8 — Porta de Safari real antes de qualquer mídia temporal entrar no produto

**O que faz.** Acrescenta ao aceite de mídia uma etapa que hoje não existe: rodar `player/player.html` (as duas
pistas) num Safari real de macOS e de iOS, gravar o resultado em `player/gravacoes/` e só então liberar o formato.
Vale para as sequências do globo e para qualquer vídeo, AVIF animado ou WebP animado futuro.

**Por que vale.** Todo o estudo de playback foi feito no Chrome, porque a máquina de produção é Windows. As três
coisas que mais podem quebrar são todas do Safari: `play()` recusado no modo de pouca energia do iOS, o alfa de
vídeo que não existe, e a animação de AVIF que não dá controle de quadro. Aprovar um formato sem tocar o navegador
de metade dos usuários é aprovar por documentação — parente próximo de aprovar por screenshot, que o §5.4-7
proíbe.

**Dependências (§9).**

- Acesso a um macOS e a um iOS reais (ou um serviço de dispositivo remoto). É a única dependência externa desta
  lista.

**Risco contra o bar.** Baixo, e o custo de não ter é alto: a alternativa é descobrir em produção que o globo
aparece num retângulo preto ou parado com botão de play.

### F-MP9 — Proveniência da arte medida no quadro, não declarada na legenda

**O que faz.** Generaliza o que `data-placeholder` já faz na medalha: todo asset de arte que um momento usa carrega
no DOM a fonte de onde veio (`publicada`, `real`, `provisória`, `placeholder`), o harness de captura lê isso em cada
quadro, e a folha imprime a fonte medida. Uma folha nunca afirma "arte real" porque alguém escreveu isso na legenda;
afirma porque o quadro foi medido.

**Por que vale.** Nesta rodada a arte da medalha trocou de provisória para real sem que uma linha de HTML mudasse —
só a ordem de fontes. Sem medição no quadro, a única prova seria a memória de quem rodou a captura, e a folha de
ontem continuaria dizendo "provisória" (ou, pior, a de hoje diria "real" enquanto uma camada silenciosamente caiu
para a provisória porque o arquivo era de 0 byte). É o mesmo princípio do S6 aplicado à mídia: o artefato prova, não
o texto ao lado dele. Barato: a infraestrutura já existe, falta aplicá-la ao globo, à carta e ao mapa.

**Dependências (§9).** Nenhum evento novo. Convenção de nomes estável entre as frentes de mídia — que é justamente
o que esta rodada mostrou não existir (a frente de medalhas publicou em
`renders/camadas-<V>/<slug>-<px>-<camada>.webp`, e o protótipo esperava `<id>/<id>-<camada>-<px>.png`).

**Risco contra o bar.** Baixo. Não acrescenta movimento, gênero nem vocabulário; só torna a evidência auditável.
Risco real é o oposto: sem isso, uma captura afirma qualidade de arte que não está no quadro.

### F-MD10 — Degrau mínimo de cunhagem como critério de aceite da arte da medalha

**O que faz.** Acrescenta ao aceite das medalhas um limiar: entre dois passes consecutivos da cunhagem (cego →
campo → figura → orla), a luminância média sobre pergaminho tem de cair pelo menos um mínimo (a medir; os dados
desta rodada sugerem algo perto de 8 unidades em 255). Abaixo disso, a medalha reprova e volta para a geometria.

**Por que vale.** Medi as camadas reais e achei uma medalha que não cumpre o que o momento 8 promete: em
`conclusao-primeira-aula` o degrau da figura é 159,4 → 157,0, praticamente nada. Os três passes existem no código e
no tempo, mas o olho vê dois. O §7.2 descreve a cunhagem como três atos; se a arte de um slug não sustenta três, o
movimento está encenando um ato que não acontece — e encenar consequência que não existe é exatamente o que o S6
proíbe. O defeito é de geometria (pouca figura no tímpano), então o conserto é na medalha, não na animação.

**Dependências (§9).** Nenhum evento novo. Depende de a frente de medalhas rodar o aceite por slug antes de
publicar, e de alguém calibrar o limiar em um conjunto de medalhas que já se considera bom.

**Risco contra o bar.** Baixo, com um cuidado: o limiar não pode virar desculpa para escurecer a arte até passar.
O critério é "os três atos se distinguem", não "a medalha é escura". Um teto junto com o piso resolve.

### F-MD11 — Variante de rampa como decisão declarada, não como pasta que sobrou

**O que faz.** Faz a rampa de cor da medalha (A conforme, B ouro, N navy) ser um parâmetro único e declarado em um
lugar só, que vale para render, composição, protótipo e produto — em vez de um argumento de linha de comando cujo
padrão é `B,N`.

**Por que vale.** A frente de medalhas compôs as camadas de cunhagem só em B e N, e nenhuma em A. Não foi escolha de
design: é o valor padrão do `--camadas` no script. O resultado é que a única variante **conforme ao §6.3** era a que
não existia, e qualquer protótipo que pegasse "a arte disponível" teria usado ouro sobre papel — uma quebra nomeada —
achando que estava usando a paleta conforme. Padrão de ferramenta virando decisão de produto é um jeito silencioso de
furar o bar.

**Dependências (§9).** Nenhum evento novo. Um arquivo de configuração compartilhado entre `medalhas/` e os
consumidores, ou a rampa no próprio catálogo por família de conquista.

**Risco contra o bar.** Baixo. O risco que ele remove é maior: quebra de paleta entrando por omissão, sem ninguém
decidir nada.

### F-G9 — Quando o peso aperta, cede a taxa de quadros, não o buril

**O que faz.** Fixa a ordem de sacrifício quando uma aresta estoura o orçamento: primeiro reduzir o número de
quadros (subamostragem **uniforme no tempo**, `round(j × (N−1)/(M−1))`, que preserva a curva e as pontas porque a
curva está embutida nos quadros), e só depois mexer no crf. O corte de aceite continua sendo a retenção do traço
(F-G5), não o peso.

**Por que vale.** Medido na única aresta que estourou (V1→V3 a 520 px): subir o crf de 16 para 17 cabe no orçamento
e derruba a retenção na sombra de 0,942 para 0,932 — abaixo do corte. Passar de 72 para 48 quadros cabe **e sobe** a
retenção para 0,951, com peso ainda menor (787 KB contra 778 KB do crf 17, praticamente empatados), porque cada
quadro recebe mais bits. A 32,4 quadros por segundo o deslocamento máximo de uma estação é 7,9 px contra um disco de
12,8 px: ainda contínuo. Ou seja, a intuição comum (manter a taxa e comprimir mais) é a pior das duas, e por uma
margem mensurável.

**Dependências (§9).** Nenhuma. É regra de empacotamento; `entregar.py` já a executa.

**Risco contra o bar.** Médio, com guarda-corpo: a taxa não pode cair a ponto de a rotação virar um piscar de poses.
O limite proposto é o já medido — deslocamento máximo de uma estação entre quadros vizinhos **abaixo do diâmetro do
disco da estação** naquele tamanho. Abaixo disso o olho integra; acima, vira estroboscopia, e aí o que cede é a
duração ou o ângulo da aresta, não mais a taxa.

---

## Da rodada de mídia das medalhas (2026-09-20)

Fonte: `media-lab/movimento-e-conquistas/medalhas/` (série r03). As três primeiras vêm de defeitos medidos na
série v2, não de ideia nova: estão aqui porque a correção vale além da medalha.

### F-MD10 — Placa de detalhe do lugar (carta do módulo, não o mapa repetido)

**O que faz.** A placa de uma medalha de módulo deixa de enquadrar a ilha inteira do território e passa a
enquadrar **a estação daquele módulo**, com aproximação de ~2,1×: cada módulo mostra um trecho próprio de costa,
e a estrada chega de fora do quadro. O mesmo recorte serve de identidade de módulo fora da medalha (X7), no
cabeçalho do módulo e no cartão da estação.

**Por que vale.** Medido na série v2: dois módulos do mesmo território saíam a **0,013 de RMS a 48 px**, contra
**0,066 da mediana da série** — indistinguíveis justamente entre vizinhos, que é como aparecem no caderno de
marcos. Com o recorte por estação, a distinção passa a vir da geometria real (`geometria.json`), não de um
rótulo. É cartografia fazendo trabalho (A2, B3), não ornamento.

**Dependências (§9).** Nenhuma para a arte: `geometria.json` e a textura da carta já existem. Para o **uso como
identidade de módulo**, nada além do que já está no repositório. A contagem de aulas (P8/P22) não entra na arte —
por isso a placa não grava o limbo de N tiques.

**Risco contra o bar.** Médio-baixo. O recorte é de ilha **inventada**: nunca pode ser legendado como lugar real
(§7 M4, "sem legenda de lugar real"). Abaixo de 48 px o recorte tende a virar textura abstrata — a régua é o teste
de distinção do `verificar.py`, não o olho.

### F-MD11 — Regra de hierarquia por família: quando duas famílias dividem o substrato, a figura da família manda

**O que faz.** Fixa uma regra do sistema de identidade: se duas conquistas de **famílias diferentes** usam o mesmo
substrato (a placa do território), a figura própria da família ocupa o primeiro plano e o substrato recua (aqui:
relevo a 40%). Nas medalhas de PRÁTICA, o anel de mostradores é a figura e a placa é o chão.

**Por que vale.** Sem a regra, `conclusao.modulo.{m}` e `pratica.instrumentos-do-modulo.{m}` saíam com o mesmo
desenho: **34 das 74 artes da série liam como a mesma coisa**. A regra vale para qualquer par futuro que divida
substrato (emblema de território × marca de módulo, por exemplo).

**Dependências (§9).** Nenhuma. É regra de desenho.

**Risco contra o bar.** Baixo. O risco é o inverso — recuar o substrato até ele virar textura atrás de figura
(S2, "textura imperceptível"). A medida é a mesma: distinção entre famílias no `verificar.py`.

### F-MD12 — Régua de tom: a luz manda, a altura não pinta

**O que faz.** Fixa na composição que o tom da medalha vem do **passe de luz**, e que o termo de cavidade
(relevo → tom) é correção de pátina, não fonte de tom. Em `compor_medalha.py`: `meso` 0,22 → **0,13** e
`contraste` 1,7 → **1,38**.

**Por que vale.** Com `meso` em 0,22 e contraste 1,7, uma placa de 0,016 de relevo chegava a **±0,42 de tom antes
de qualquer luz**: o tímpano saía preto, a placa saía branca, e a peça deixava de parecer metal cunhado para
parecer mapa de altura tingido. É o mesmo risco em qualquer objeto composto a partir de passes — inclusive os
discos de estação do globo (F-MD8).

**Dependências (§9).** Nenhuma. Coordenação entre as frentes de mídia.

**Risco contra o bar.** Baixo. Os meios-tons continuam medidos contra os tokens (ΔE00 ≤ 5, `verificar.py`).

### F-MD13 — Vitrine da medalha a 768 (anverso e verso no Progresso)

**O que faz.** Acrescenta a faixa **V (768 px)** à série, acima das três do §6.5. Ela serve à vitrine do detalhe
no caderno de marcos: anverso a 192 CSS em tela grande, com espaço para a legenda circular em `textPath` e para o
verso (critério, "registrada a partir de", data, "ir ao lugar →").

**Por que vale.** A 384 o detalhe do buril já está no limite; a vitrine é o único lugar onde a medalha é **objeto
olhado**, não marcador. Sem a faixa, a alternativa seria ampliar o asset de 384 — que é exatamente o que o §6.5
proíbe ("cada faixa é renderizada no seu tamanho").

**Dependências (§9).** Progresso real por learner (para existir detalhe); camada de motivação com persistência.

**Risco contra o bar.** Baixo, desde que a vitrine não vire galeria de troféus (§6, "fileira de insígnias de
consumo") nem suba para a Home. O §4 do `sistema-de-conquistas.md` já a prende ao Progresso.

---

## Da rodada de correções r04 (2026-09-20)

Fonte: `media-lab/movimento-e-conquistas/CORRECOES.md`. Numeração `F-R*` porque a série `F-MD*` já tem
duplicatas (dois F-MD10 e dois F-MD11) e este arquivo não pode ser reescrito.

### F-R1 — O flan: um disco em branco compartilhado por toda a série

**O que faz.** Acrescenta ao catálogo de arte uma peça que não é conquista: o **flan**, o disco liso
antes do cunho — orla apenas recalcada, sem grafila, sem campo gravado, sem exergo e sem tímpano. Ele é
renderizado uma vez por faixa, na mesma luz da série, e vira a **primeira camada** da cunhagem de
qualquer medalha (`cego → campo → figura → orla`).

**Por que vale.** Enquanto a camada `cego` era o relevo cego da própria medalha, a ilha, a orla e o
exergo já estavam inteiros no primeiro quadro: o momento 8 era um fade de opacidade de um PNG pronto,
e a metáfora que justifica a família inteira nunca acontecia. Com o flan, cada camada acrescenta
geometria **e** tinta na sua região — o campo recebe o buril, a figura sobe, a orla e o exergo fecham.
Custo: 3 renders para 74 medalhas × 3 rampas.

**Dependências (§9).** Nenhuma para produzir. Para aparecer no produto, depende de `badge_conquistado`,
que hoje o backend aceita e ninguém emite.

**Risco contra o bar.** Baixo. O risco é a cunhagem virar espetáculo: S6 só admite movimento de
chegada, e o teste é o filmstrip, não o número de camadas. Mitigação: o estado final é idêntico com
movimento reduzido, e a peça inteira aparece de uma vez nesse modo.

### F-R2 — Placa de chegada: a conclusão acontece sobre navy, não sobre o vazio

**O que faz.** Um componente de superfície para o bloco de chegada (fim de aula, fim de módulo,
conquista, marco de trilha): retângulo navy profundo, raio 0, fio de 1px, **sem sombra**, em que as
variáveis de tinta/creme/fio são remapeadas para os tokens `--sobre-navy`, `--sobre-navy-suave` e
`--fio-navy` que já existem. Glifos de estado, dial, texto e botões invertem juntos, sem nenhuma cor
nova. A carta gravada volta às variáveis do lado claro: ela é papel sobre a placa.

**Por que vale.** O evento mais frequente do produto (`aula_concluida`, o único evento real que existe
hoje) terminava num anel pontilhado de 172 px e duas linhas de texto boiando em creme. Tirar o bloco
não custava nada — reprovava no teste de remoção (M7). A placa dá peso, dá navy e dá lugar à carta do
território sem inventar nenhum dado.

**Dependências (§9).** Nenhuma para a superfície. O conteúdo dela (dial, contagem) já depende de P8/P22.

**Risco contra o bar.** Médio. Faixa navy em toda tela é um dos itens da "cópia literal do North Star"
(§6), que reprova com 3 ou mais simultâneos. Mitigação: a placa só existe **no momento de chegada**,
nunca no repouso da página, e não carrega citação nem lema.

### F-R3 — Rumo de chegada como identidade da medalha de prática

**O que faz.** Nas 17 medalhas `pratica.instrumentos-do-modulo.{m}`, a composição é girada pelo **rumo
real com que a rota chega à estação do módulo** (`geometria.json`): o limbo graduado, a alidade, o
índice e o vernier acompanham esse ângulo. A ilha entra sem relevo, só contorno, curva de nível e
hachura.

**Por que vale.** As 17 eram o mesmo anel de 8 mostradores; a única diferença era uma placa recuada que
sumia a 48 e a 96 px. O rumo é geometria já existente e **não afirma nada sobre o conteúdo do módulo** —
ao contrário de escolher um instrumento diferente por módulo, que seria uma alegação factual sobre a
aula que nenhum evento sustenta. O princípio é reusável: quando uma família precisa de N variações,
procure primeiro um eixo geométrico verdadeiro.

**Dependências (§9).** Nenhuma. É regra de desenho sobre dado que já existe.

**Risco contra o bar.** Baixo. O risco é o leitor ler o ângulo como informação ("meu módulo aponta para
o norte"): o ângulo é identidade, não leitura, e nenhum texto o nomeia.

### F-R4 — Chegada do globo tem dois eixos: orientação e aproximação

**O que faz.** A transição "do todo para o meu lugar" deixa de ser só rotação. A câmera sai de uma
distância maior (globo a ~61% do quadro, a vista de descanso) e chega à distância de trabalho (~92,5%),
com a mesma curva quíntica que move a orientação. Lente e sensor ficam fixos; o sol é em coordenadas de
câmera, então a luz não muda e a sequência tocada ao contrário continua coerente.

**Por que vale.** As três ilhas inventadas ficam perto umas das outras na esfera: V0→V1 são 18,0°,
V0→V3 17,0° e V0→V2 **8,6°**. Em 900 ms, nenhum desses ângulos se lê — as filmstrips das três arestas de
chegada eram oito cópias visualmente idênticas. Aumentar o ângulo exigiria desviar a câmera, o que seria
movimento inventado. A aproximação é honesta e é exatamente a promessa do estudo.

**Dependências (§9).** Nenhuma. É produção de mídia.

**Risco contra o bar.** Baixo, com uma atenção: S6 proíbe parallax e scroll-jacking. A aproximação é uma
transição disparada por uma escolha do learner, com estado final igual em movimento reduzido — não é
movimento ligado à rolagem.

### F-R5 — Régua gravada como primitivo de instrumento

**O que faz.** Promove a escala do ato a um primitivo de desenho: base dupla, três alturas de tique
(1, 5 e 10), numerais tabulares grandes, lâmina com plaqueta navy carregando o rótulo em creme, e
colchete de diferença. Serve a qualquer um dos 165 instrumentos que compare previsão × cálculo.

**Por que vale.** O momento de maior consequência pedagógica era o de menor presença visual: "página de
texto científico sobre creme, régua fina e tipo pequeno". A régua é a única imagem que o ato pode ter
sem inventar fotografia, e é gravura que faz trabalho (marcador 6 do teste anti-LMS).

**Dependências (§9).** `instrumento_usado` e `exercicio_respondido` para o registro; o desenho não depende.

**Risco contra o bar.** Baixo. A tira navy da diferença **não** é semáforo: a cor não codifica certo ou
errado, e o texto diz "diferença", nunca "errou". Se algum dia a cor mudar com o acerto, vira FAIL.

### F-R6 — Recorte a DPR 2 é parte do aceite de microinteração, não extra

**O que faz.** No harness de captura, `detalhe` passa a aceitar uma **lista** de seletores (a caixa é a
união) e `detalheEm`, o instante em que medir. Sem isso, uma interação cujo elemento só existe durante o
movimento — gaveta, verbete, tooltip — não tinha recorte nenhum.

**Por que vale.** S6 diz que só o filmstrip aprova movimento. Numa folha de 1440 px reduzida, uma
interação que é "só cor e fio" produz onze quadros idênticos: a folha não permite julgar nada, e o
critic reprova com razão. A regra que sai daqui: **toda folha cujo movimento é menor que ~24 px de
deslocamento precisa de um recorte a DPR 2 no elemento que se move.**

**Dependências (§9).** Nenhuma. Ferramenta.

**Risco contra o bar.** Nenhum. É evidência, não produto.

### F-R7 — Entrada de aula: chega a página, desenha-se o fio

**O que faz.** Substitui o escalonamento de blocos (120/240/360 ms) por: a abertura inteira chega numa
vez (legível em ~180 ms) e o que continua em sequência é o **fio sob cada bloco**, desenhado da esquerda
para a direita.

**Por que vale.** O escalonamento produzia sete quadros de cabeçalho e título sobre um vazio e um
pop-in em 440 ms. Isso é carregamento, não chegada. Regra geral: **escalonar opacidade de blocos de
conteúdo simula latência**; escalonar traço sobre conteúdo já presente é continuidade.

**Dependências (§9).** Nenhuma.

**Risco contra o bar.** Baixo. O fio precisa continuar existindo (estado final) com movimento reduzido —
ele é estrutura, não animação.

### F-R8 — Polaridade como quarto eixo de distinção de família

**O que faz.** Acrescenta à gramática das orlas (§6.1) a regra de que, na faixa de 48 px, as famílias se
separam também por **polaridade**, não só por desenho: CONCLUSÃO = anel liso com um canal; PRÁTICA =
fendas escuras finas e numerosas num anel claro; EXPLORAÇÃO = 8 cunhas escuras largas que atravessam a
altura da orla; HÁBITO = pérolas claras sobre anel rebaixado.

**Por que vale.** A métrica que o builder usava media o disco inteiro e por isso não pegava colisão de
borda: EXPLORAÇÃO lia como a orla lisa de CONCLUSÃO e HÁBITO encostava em PRÁTICA, ambos exatamente onde
o §6.3 exige separação. Desenho fino some; inversão de tom não some. Como cada faixa é renderizada no
seu tamanho, a faixa P pode ter contagem e profundidade próprias sem tocar as outras.

**Dependências (§9).** Nenhuma.

**Risco contra o bar.** Baixo, com atenção a S2: a borda externa continua um círculo liso em todas as
famílias — nenhuma serrilha, dente ou ponta saliente. A cunha de EXPLORAÇÃO entalha a borda **interna**
da orla, nunca a externa.
