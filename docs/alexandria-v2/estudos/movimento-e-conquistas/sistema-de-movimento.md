# Sistema de movimento da Alexandria v2

Especificação de 2026-09-17 para o pedido do Founder: animações de conclusão, do globo, de entrada de aula e do
resto do sistema. Este documento diz **o que se move, quando, por quê, em quanto tempo, com que curva, como fica com
movimento reduzido e como o filmstrip aprova**. Ele não aprova nada: pelo S6, só o filmstrip aprova movimento.

**Base.**

- `bar.md`: S1, S2, S3, S5, S6, S7, D1, D2, §6, §7, §8 e §9.
- `decisoes/2026-09-16-ambiguidades-de-conteudo.md`: P18.
- `referencias-movimento.md`: tempos e curvas medidos.
- `referencias-conquistas.md`: a metáfora da cunhagem e do marco geodésico.
- `sistema-de-conquistas.md`: o catálogo e a medalha que os momentos 7 a 9 mostram.

**Estado real que a especificação respeita.** Tudo foi medido no código em 2026-09-17.

- **Eventos.** O produto emite só `aula_iniciada` e `aula_concluida`, e só a partir do `AulaViewer`. O backend
  aceita `instrumento_usado`, `exercicio_respondido` e `badge_conquistado` (com `metadata` JSONB livre), mas nada os
  emite. Todo momento que depende deles está marcado **em desenho (§9)**.
- **Resposta do evento.** Cada `POST /events` devolve `occurredAt`, `aulaStatus` e `streak`, e é isso que dispara os
  momentos 6 a 9. Nenhum momento dispara antes da confirmação do servidor.
- **Tokens.** `AE` tem uma curva (`cubic-bezier(0.65,0,0.35,1)`) e quatro durações (150, 200, 700 e 1200 ms). O
  `package.json` não tem biblioteca de movimento, mas tem `d3-geo` e `three`.
- **Globo.** `GloboCurriculo.tsx` escolhe V1, V2 ou V3 pela trilha atual e desenha, em SVG sobre a imagem, o trecho
  percorrido e o tracejado até a próxima estação. As imagens vêm do Blender: r03 em produção, r04 em
  `media-lab/A-r04/globo/`, com 3 vistas × 6 diâmetros e um JSON de câmera, estações e rota por render.
- **Contagens.** `totalAulas` é `null` em parte dos módulos. Nenhum contador e nenhuma conclusão de módulo aparece
  sem contagem conhecida e reconciliada (P8, P22).

**Gasto.** 0 crédito Higgsfield e nenhum render. Este documento é especificação. A sequência do globo (§5) e as
camadas da medalha (`sistema-de-conquistas.md` §7) são pedidos de produção para a rodada seguinte.

---

## 1. Princípios

Os princípios derivam do S6 e são a régua de cada momento abaixo. **M1–M4 repetem gates do bar e reprovam a peça.
M5–M12 são heurísticas deste sistema** e podem ser quebradas com justificativa nomeada (bar, "Como ler").

| # | Princípio | Origem |
|---|---|---|
| M1 | **Todo movimento declara uma função:** continuidade (o mesmo objeto muda de lugar), consequência (um ato muda um traçado ou um número) ou chegada (um estado novo se completa). Movimento sem uma dessas três não entra | S6 |
| M2 | **Proibidos:** bounce, overshoot, mola com `bounce > 0`, parallax, scroll-jacking, tremor de tela, confete, partícula, brilho varrendo, pulsação, loop ambiente e rotação ociosa do globo | S6, S2, §6 |
| M3 | **Movimento reduzido chega ao mesmo estado final**, com as mesmas palavras, os mesmos números e o mesmo traçado, no mesmo quadro em que o modo normal *começa* | S6 |
| M4 | **Todo ato registrado muda o Praticado no mesmo quadro.** A animação de consequência vem depois e nunca atrasa a mudança de estado | S6 (Rastro) |
| M5 | **O estado muda primeiro e anima depois.** A palavra e a silhueta trocam em `corte` (0 ms). A animação só mostra *como* se chegou lá, e o leitor de tela recebe o estado sem esperar | Apple HIG, S3 |
| M6 | **Quanto mais raro o momento, mais movimento ele pode ter.** Ação repetida (tecla, aba, marcar termo) não anima. Conclusão de aula tem até 1,5 s, módulo até 2,6 s e território até 3,2 s | Emil Kowalski, Duolingo |
| M7 | **Nunca fazer esperar.** Toda coreografia é interrompível: qualquer clique, tecla ou rolagem leva ao estado final no quadro seguinte. A próxima ação é clicável desde o primeiro quadro em que aparece | Apple HIG, Rive (exit time 0) |
| M8 | **Quadro de referência parado.** Moldura, prancha, graticulado externo, legenda e header não se movem quando o globo gira | Apple HIG (visionOS) |
| M9 | **Leitura não é espetáculo.** Texto corrido, título de conteúdo e dado nunca entram animados palavra a palavra. No máximo, o bloco inteiro entra com opacidade e 8 px de deslocamento | S2 (vozes) |
| M10 | **Codificação nova é corte; dado novo na mesma codificação anima.** Trocar linha por barra, ou aba por aba, é corte seco. Mudar o parâmetro de um instrumento anima o traçado | OWID |
| M11 | **Só transform, opacity, `stroke-dashoffset` e `clip-path`.** Nunca `width`, `height`, `top` ou `box-shadow`. Sem `filter: blur` e sem gradiente animado | Stripe, motion.dev, S2 |
| M12 | **Contador só conta até um número que existe**, com escopo, e com o mesmo valor que as outras telas mostram | S3 (Números) |

**Hierarquia de implementação** (Stripe): transição CSS → animação CSS → Web Animations API → `requestAnimationFrame`.
O globo e o traçado de rota ficam em rAF ou WAAPI, e o resto em CSS. A escolha entre a View Transitions API, a
biblioteca `motion` e FLIP escrito à mão fica com o LYCEUM e o Founder (dependência nova). Este documento especifica o
comportamento, não a biblioteca.

---

## 2. Tokens

Propostos como adição ao `AE`, sem mudar os valores que já existem. Os tokens novos estão marcados.

### 2.1 Duração

| Token | ms | Uso |
|---|---|---|
| `corte` *(novo)* | 0 | Palavra e silhueta de estado, troca de aba, abrir a busca pelo teclado, tooltip depois do primeiro |
| `instante` *(novo)* | 100 | Cor de hover, cor de link e toggle |
| `estado` | 150 | Troca de glifo e opacidade de corte com movimento reduzido |
| `hover` | 200 | Fio e fundo de controle no hover e no foco pelo mouse |
| `saida` *(novo)* | 200 | Tudo o que sai (= `entrada` − 80) |
| `chegada` *(novo)* | 250 | Último gesto de uma coreografia: data, anel "você está aqui", recolhimento de cauda |
| `entrada` *(novo)* | 280 | Bloco que aparece: painel, gaveta, verbete, bloco de abertura, próximo passo |
| `continuidade` *(novo)* | 400 | Elemento compartilhado (Home → aula, nó → módulo, linha → verbete) |
| `desenhoCurto` | 700 | Traçado curto: tique, estação que se preenche, marca de previsão |
| `projecao` *(novo)* | 800 | Globo ↔ planisfério (F-M3, fora desta especificação) |
| `desenhoLongo` | 1200 | Rotação do globo entre vistas vizinhas; trecho de rota longo |
| `escalonamento` *(novo)* | 120 | Intervalo entre irmãos numa coreografia (máximo 4 irmãos) |

**Regras.**

- **Traçado com velocidade constante.** A duração é `clamp(300, comprimento_px × 2,2, 1200)` ms. Um trecho de 140 px
  leva 308 ms; um de 600 px, 1200 ms.
- **Rotação.** A duração é `clamp(900, Δângulo × 45, 1500)` ms. Os ângulos foram medidos entre as matrizes de câmera
  dos JSONs r04 (`camera.rot`), não só pela longitude:

  | Aresta | Ângulo | Duração |
  |---|---|---|
  | V1→V2 | 22,8° | 1030 ms |
  | V2→V3 | 21,1° | 950 ms |
  | V1→V3 | 32,9° | 1480 ms |
  | V0→V1 / V0→V2 / V0→V3 | 18,0° / 8,6° / 17,0° (direção de visada, pelo `geometria.json`) | 900 ms (piso) |
- **Teto por momento.** UI ≤ 300 ms. Aula ≤ 1500 ms. Módulo ≤ 2600 ms. Território ≤ 3200 ms.

### 2.2 Curva

Todas têm y₁ e y₂ em [0, 1], então nenhuma passa do ponto final.

| Token | cubic-bezier | Papel |
|---|---|---|
| `easing` (atual) | `(0.65, 0, 0.35, 1)` | Algo **já na tela** que se desloca: globo, mapa, elemento compartilhado |
| `entra` *(novo)* | `(0.16, 1, 0.3, 1)` | Algo que **aparece** |
| `sai` *(novo)* | `(0.3, 0, 0.8, 0.15)` | Algo que **sai**, sempre com `saida` |
| `traco` *(novo)* | `(0.33, 0, 0.67, 1)` | Traçado de rota e de estação: começa e termina macio, com meio quase constante |
| `linear` | `linear` | Contador tabular e sequência de quadros já suavizada no render |

**Portão automático** (F-M1 de `features-propostas.md`). Reprova qualquer `cubic-bezier` com y fora de [0, 1],
qualquer `spring` com `bounce > 0` e qualquer `animation-iteration-count: infinite` em `src/components/alexandria/**`
e `src/design/alexandria-tokens.ts`.

### 2.3 Contrato de movimento reduzido (`prefers-reduced-motion: reduce`)

- **Some:** translate, scale, rotação do globo, sequência de quadros, traçado progressivo, contador e cunhagem em
  passes.
- **Fica:** no máximo um corte de opacidade de `estado` (150 ms) no bloco que mudou, para o olho achar a mudança.
- **Idêntico:** o estado final. Palavras, números, silhuetas, trecho desenhado, medalha no estado final e foco.
- **Medição:** com reduce, `document.getAnimations().length === 0` em repouso e ≤ 1 durante um momento.

### 2.4 Interrupção, visibilidade e anúncio

- **Interrupção.** Qualquer `pointerdown`, `keydown`, `wheel` ou `touchstart` durante uma coreografia chama
  `finish()` em todas as animações do momento. Navegar cancela o momento.
- **Aba oculta.** Se `document.visibilityState` for `hidden` quando o evento confirmar, o momento vai direto ao estado
  final. Aba oculta estrangula o rAF a ~1 Hz (`AGENTS.md`), e uma coreografia que roda em câmera lenta é defeito.
- **Anúncio.** Toda consequência e toda chegada tem uma frase numa região `aria-live="polite"`, emitida em `corte`.
  Exemplo: "Aula concluída. 8 de 9 aulas do M01 percorridas."
- **Primeira vez por sessão.** Os momentos 1 e 4 só tocam na primeira vez em que o objeto aparece numa sessão. A
  marca fica em `sessionStorage`, dentro de try/catch; se o storage falhar, o momento toca.

---

## 3. Formato de cada momento e harness de aceite

Cada momento tem sete campos:

- **Gatilho:** evento real ou gesto do learner.
- **Função (S6):** continuidade, consequência ou chegada.
- **Dependência:** hoje, ou qual linha do §9.
- **Coreografia:** tabela com `t` em ms desde o gatilho.
- **Movimento reduzido.**
- **Estado final.**
- **Aceite em filmstrip.**

**Harness comum** (F-M6).

- Playwright com o Chrome do sistema, `recordVideo` a 1440×900 e a 390×844, e `emulateMedia({ reducedMotion })`
  nos dois modos.
- Quadros extraídos com `ffmpeg -ss` nos `t` listados, com jitter conhecido de ±33 ms.
- O tempo zero é marcado no vídeo por um `performance.mark` registrado em log.
- Em navegação, uma faixa de legenda com a URL é composta na folha, porque o headless não tem barra de endereço
  (§8). Se o critic exigir a barra real, a gravação é feita com o Chrome em modo headed.
- Cada folha tem **≥ 6 quadros no modo normal e 2 no reduzido** (inicial e final). A legenda traz viewport, DPR,
  estado, rota, eventos emitidos e a tira de amostras.
- **Aceite comum a todos os momentos.**
  1. O último quadro normal e o último reduzido são iguais na região de estado. Diferença de pixel ≤ 0,5%,
     tolerada só na suavização de fonte. Palavras e números são idênticos no `textContent`.
  2. Nenhum quadro mostra um elemento além da posição final. A medição é feita por `getBoundingClientRect` a cada
     rAF, em log, e não a olho.
  3. O portão de curva e de loop passa.
  4. Uma interrupção em `t = 200` leva ao estado final no quadro seguinte.

**Fixtures.** E0–E3 são os estados do §8. Para os momentos 1, 6, 7 e 9, a folha precisa de um estado com trecho
percorrido de verdade: no E2, nenhum módulo está percorrido e não há trecho a desenhar. Por isso se propõe o
**E4 (fixture de movimento — APROVADO pelo orquestrador em 2026-09-20)**:

- M01–M03 percorridos por eventos reais semeados;
- M04 com todas as aulas menos a última concluídas, se a contagem do M04 estiver reconciliada (senão, o primeiro módulo
  reconciliado depois do M03);
- a última aula do M04 aberta.

O E4 serve só para capturar o movimento e é declarado na legenda, nunca na UI.

> **Aprovação (orquestrador, 2026-09-20).** O E4 entra. Ele não afrouxa nenhum gate: como E0–E3, vem de eventos
> reais semeados pelo harness, nunca de mock, e a fixture é declarada na legenda da captura (§8 do bar). Sem ele,
> os momentos 1, 6, 7 e 9 não têm trecho percorrido para desenhar e o S6 não pode ser provado — a alternativa seria
> aprovar movimento por screenshot estático, que o S6 proíbe. Se a contagem do M04 não estiver reconciliada (P8),
> vale o primeiro módulo reconciliado depois do M03, e a legenda diz qual foi.

---

## 4. Os dez momentos

### Momento 1 — Chegada na Home: o globo gira até o território atual e o trecho percorrido é traçado

**Gatilho.** Primeira renderização da Home na sessão (§2.4), com o estudo resolvido (`estudo.fase !== 'carregando'`).
Se o estudo demorar mais de 1200 ms, o globo é mostrado já parado na vista final, sem giro.

**Função.** Chegada: o learner vê onde está no mundo. O traçado é a evidência de Percorrido (S3), não enfeite.

**Dependência.** Hoje para E0–E2 (`getMyProgress` + `lerGlobo`). A sequência de quadros da rotação vem do §5
(produção pendente). Até ela existir, o momento roda sem rotação: fases B a D sobre a vista estática.

**Pose inicial.** V0 é a vista de conjunto: o centroide das 17 estações, a mesma construção de `VIEWS` em
`globo_r04.py` com `VIEW_W = 0`. Assim a rotação sempre vai "do todo para o meu lugar". Em E0/E1, a vista final é
V1, e o giro também acontece: o ponto de partida também é um lugar.

**Coreografia (1440, E4, vista final V1).**

| t (ms) | Camada | O que acontece | Token |
|---|---|---|---|
| 0 | Texto | H1, tese, cartão de retomada e CTA **já presentes e clicáveis**. Nada no lado esquerdo se move | `corte` |
| 0 | Globo | Primeiro quadro da sequência V0→V1. Os rótulos das estações e dos territórios ficam ocultos | — |
| 0–900 | Globo | Rotação por quadros pré-renderizados. O tempo é mapeado ao índice de quadro com `easing` | `easing`, 900 ms |
| 900 | Globo | Troca do último quadro pela imagem estática de alta resolução, na mesma pose | `corte` |
| 900 | Rótulos | Códigos das estações e nomes dos territórios entram juntos | `entrada` 280, só opacidade |
| 960 | Trecho | O trecho percorrido é desenhado **a tinta**, da partida (M01) até a estação atual, seguindo os pontos da rota do JSON. Em E4: M01→M02→M03→M04, ≈ 260 px | `traco`, 572 ms (2,2 × 260) |
| 960 | Estações | Cada estação passa a disco cheio (percorrido) **quando o traço a alcança**, com um corte de silhueta | `corte` |
| 1532 | Posição | Anel duplo "você está aqui" desenhado em volta da estação atual (stroke 0→360°) | `chegada` 250 |
| 1532 | Chamada | "Você está aqui · M04 · Aula NN de N" entra (N da coleção) | `entrada` 280 |
| 1782 | Próximo | Tracejado até a próxima estação aparece | `estado` 150, opacidade |
| ≤ 1932 | | Repouso | |

- **Visitas seguintes na mesma sessão:** nada gira, tudo já está desenhado.
- **Trecho novo desde a última visita** (F-MC1 em `features-propostas.md`): só ele é traçado, e o resto já aparece desenhado.
- **390.** O globo fica abaixo do CTA (A6). O momento só dispara quando o globo entra na tela, por
  IntersectionObserver com disparo único e sem acoplamento à rolagem.

**Movimento reduzido.** O globo aparece em V1, com o trecho desenhado, as estações preenchidas, o anel, a chamada e o
tracejado, tudo no quadro 0. Há um corte de opacidade de 150 ms só no trecho.

**Estado final.** Idêntico ao render estático da Home r03/r04 do mesmo estado.

**Aceite (filmstrip 1440 e 390, E0 e E4, `t` = 0, 300, 600, 900, 1300, 1600 e 2000).**

- Em t = 0, a retomada e o CTA estão legíveis e o CTA responde a clique (log do clique em t = 100).
- A longitude da câmera por quadro, lida do JSON da sequência, é **monotônica** e nunca passa do valor final.
- Em t = 1300, o traço está parcial e as estações já alcançadas estão cheias; as outras, não.
- O último quadro é igual à captura estática `home-E4-1440.png`.
- A prancha (Titã) e a moldura têm diferença de pixel 0 entre t = 0 e t = 2000 (quadro de referência parado).
- No reduzido, o quadro 0 já é igual ao último quadro normal.

---

### Momento 2 — Troca de trilha: o globo gira V1→V2→V3

**Gatilhos.** São dois.

1. **Pré-visualização.** Na faixa "O currículo em três territórios" da Home, o learner ativa a linha de um território
   (clique ou Enter). O globo gira até a vista desse território. Aparece a linha "Vendo: II · Setor Elétrico
   Brasileiro" com o botão "Voltar à sua posição". O CTA de retomada **não muda**: pré-visualizar não é mudar de
   trilha.
2. **Mudança real.** A trilha atual mudou desde a última Home vista, depois do momento 9. Na próxima chegada, o
   momento 1 usa a aresta Vanterior→Vnova em vez de V0→Vnova.

**Função.** Continuidade: é o mesmo globo, visto de outro lado. Não é decoração: a rotação mostra onde fica o
território em relação ao atual.

**Dependência.** Hoje (dado de trilha). A sequência de quadros vem do §5 (pendente). Sem ela, a troca é um
cruzamento de opacidade de `estado` entre as duas imagens estáticas.

**Coreografia (V1→V2, 1440).**

| t (ms) | O que acontece | Token |
|---|---|---|
| 0 | A linha ativada na faixa ganha a marca de ativo (fio + palavra "vendo"). `aria-live`: "Globo mostrando o Território II" | `corte` |
| 0 | Rótulos, trecho SVG e chamada saem | `saida` 200, `sai` |
| 0–1030 | Sequência V1→V2. Em cada quadro, o anel "você está aqui" (se visível) acompanha a posição da estação lida do JSON por quadro. O trecho não é redesenhado durante o giro | `easing` |
| 1030 | Imagem estática V2 | `corte` |
| 1030 | Rótulos, trecho percorrido (já inteiro, sem traçar de novo) e chamada entram | `entrada` 280 |
| 1310 | Repouso. O território pré-visualizado recebe um fio de 1px no contorno do nome, e não uma cor | |

- **V1→V3** usa a aresta direta, com 1480 ms (§2.1). **V3→V1 e V2→V1** tocam as arestas ao contrário (§5.3).
- **Ativações rápidas em sequência** (Tab + Enter repetidos): a partir da segunda em menos de 2 s, a troca vira
  `corte`, porque é ação repetida (M6).
- **"Voltar à sua posição"** faz o giro inverso, e o botão sai quando o giro termina.

**Movimento reduzido.** Troca direta da imagem, com corte de opacidade de 150 ms. Os rótulos e a marca "vendo"
aparecem no mesmo quadro.

**Estado final.** Igual ao render estático da vista escolhida, com o trecho do learner desenhado. A retomada continua
apontando para o objeto real.

**Aceite (filmstrip 1440, E2 e E2b, `t` = 0, 200, 450, 750, 1030, 1310; também V1→V3 e o retorno).**

- A longitude por quadro é monotônica e termina exatamente em `camera.lon` da vista final.
- O último quadro da sequência e a imagem estática têm diferença média ≤ ΔE00 1 no disco do globo, sem salto visível
  na troca.
- O texto do CTA é idêntico em t = 0 e t = 1310.
- Duas ativações seguidas em menos de 2 s: a segunda não tem quadros intermediários.
- No reduzido: 2 quadros, sem pose intermediária.

---

### Momento 3 — Entrada de aula a partir da Home ou do mapa

**Gatilho.** Clique ou Enter no CTA "Continuar a leitura · M01·A08" da Home, ou numa estação ou item de aula no
Mapa ou no Módulo. A navegação para `/alexandria/.../aula/...` começa no mesmo quadro.

**Função.** Continuidade. O objeto em que o learner clicou vira o cabeçalho da aula. Três elementos são
compartilhados:

1. **o código** ("M01·A08");
2. **o título** ("100 MW solar ≠ 100 MW térmica."): mesma família, só muda de tamanho e posição;
3. **o trecho da rota:** o anel "você está aqui" e o segmento até a próxima estação viajam até o mini-percurso do
   localizador da aula (S5).

**Dependência.** Hoje (roteamento). O mecanismo de elemento compartilhado é uma decisão de dependência (§1).

**Coreografia (1440, Home → aula).**

| t (ms) | O que acontece | Token |
|---|---|---|
| 0 | A URL muda e o CTA registra o estado pressionado (fundo navy-profundo) | `corte` |
| 0 | O resto da Home sai: globo, prancha, faixa e texto | `saida` 200, `sai`, só opacidade |
| 0–400 | O código e o título viajam da caixa do cartão até a posição do cabeçalho da aula, por FLIP com `translate` + `scale` (sem animar `font-size`). O título cruza de 26 para 32 px com escala; no fim, o texto real troca pela escala 1 em `corte` | `continuidade`, `easing` |
| 0–400 | O anel "você está aqui" viaja do globo até a posição no mini-percurso do localizador | `continuidade`, `easing` |
| 200 | O header e o localizador da aula aparecem (o header global não sai: é o quadro de referência) | `entrada` 280 |
| 400 | O segmento do mini-percurso até a próxima aula é traçado | `desenhoCurto`, `traco` |
| 400 | O momento 4 começa | |

- **Rolagem.** A aula abre no topo, e o foco vai para o H1 da aula em `corte`.
- **Voltar (histórico).** A coreografia é invertida (título e código voltam ao cartão). A Home volta **na mesma
  posição de rolagem** e **sem repetir o momento 1**.
- **A partir do Mapa ou do Módulo.** Os elementos compartilhados são o glifo da estação e o título. A mesma tabela
  vale, com a origem no nó.
- **390.** Sem mini-percurso: o anel viaja até o localizador compacto (≈ 32 px).

**Movimento reduzido.** Corte de página. A aula aparece com cabeçalho e localizador completos, e há um corte de
opacidade de 150 ms no cabeçalho.

**Estado final.** A aula no estado de abertura (momento 4), com o mesmo código e título do cartão, letra por letra.

**Aceite (filmstrip 1440 e 390, E2, `t` = 0, 100, 200, 300, 400, 700; faixa de URL visível).**

- Em cada quadro há **um só** título visível: o cruzamento não duplica texto legível.
- A caixa do título interpola de forma monotônica entre a origem e o destino, medida por `getBoundingClientRect`.
- Em t = 0, a URL da folha já é a da aula.
- O teste de voltar mostra a Home na mesma rolagem, sem giro.
- O foco está no H1 no último quadro (árvore de acessibilidade).

---

### Momento 4 — Abertura da aula: pergunta/objetivo → primeiro ato

**Gatilho.** Fim do momento 3, ou abertura direta da URL da aula. É a primeira abertura dessa aula na sessão.

**Função.** Chegada. A ordem de aparição **é** o C3 (orientar antes de ler): primeiro o porquê, depois o que fazer,
depois o fazer.

**Dependência.** A pergunta, o objetivo e o primeiro ato são texto da camada Alexandria (P3, P11, P19) da Peça C. O
registro do ato depende do §9 (momento 5).

**Coreografia (1440).**

| t (ms) | Bloco | O que acontece | Token |
|---|---|---|---|
| 0 | Cabeçalho | Código, título, módulo e trilha, já no lugar | — |
| 0 | Linha de registro | "Percorrido: em leitura · Praticado: nenhum ato registrado · Demonstrado: ainda não avaliado", em palavra e silhueta | `corte` |
| 120 | Pergunta | A pergunta de previsão ou o objetivo da aula entra ("Duas usinas de 100 MW produzem a mesma energia no ano?") | `entrada` 280, `entra`, opacidade + 8 px Y |
| 240 | O que fazer | A linha "Nesta aula você vai: estimar o fator de capacidade → comparar com o cálculo" entra | `entrada` 280 |
| 360 | Primeiro ato | O bloco do ato 1 entra: campo de previsão com unidade e ação "Registrar previsão". **O foco não pula para o campo**: fica no H1 | `entrada` 280 |
| 640 | | Repouso. O texto corrido, abaixo, está presente desde t = 0 e não anima | |

- **Aula sem previsão útil** (C9). A pergunta é trocada pelo objetivo, e o primeiro ato é o que a aula tiver. A ordem
  é a mesma.
- **A 390.** Os três blocos cabem no 1º viewport (S7). Se não couberem, a linha "o que fazer" encurta, e a ordem
  continua.
- **Reabrir a mesma aula** na sessão: tudo aparece em `corte`.

**Movimento reduzido.** Os três blocos aparecem juntos no quadro 0, com um corte de opacidade de 150 ms no conjunto.

**Estado final.** Abertura completa. A ação principal do viewport é o primeiro ato pendente (S1).

**Aceite (filmstrip 1440 e 390, E2 na A08, `t` = 0, 120, 240, 360, 500, 700).**

- Ordem de aparição medida pela opacidade de cada bloco em log: pergunta < o que fazer < ato. Nenhum bloco antes do
  anterior.
- Deslocamento máximo de 8 px, sem passar da posição final.
- A 390, no último quadro, pergunta e ato estão dentro do 1º viewport.
- O parágrafo de leitura tem opacidade 1 em t = 0.

---

### Momento 5 — Registro de ato: previsão registrada → comparação

**Gatilho.** O learner clica em "Registrar previsão" (ou Enter no campo) com valor válido (regra de entrada da
Alexandria, P19; sem tolerância inventada, P6).

**Função.** Consequência: a previsão vira marca na escala, o cálculo vira segunda marca, e a distância entre as duas
é o que ensina. Sem semáforo e sem juízo.

**Dependência.** **Em desenho (§9).** Hoje nada emite `exercicio_respondido` nem `instrumento_usado`. O contrato
pretendido é este:

- `exercicio_respondido` com `metadata: { tipo: "previsao", valor, unidade, aulaId, antesDaReferencia: true }`;
- `instrumento_usado` com `metadata: { alterouParametro: true, aulaId }` na comparação.

Enquanto os eventos não existirem, **o valor digitado vale só na sessão** (S3 permite). A linha de registro diz isso
em palavras: "Praticado: 1 ato nesta sessão · ainda não salvo na conta". Nunca "registrado".

**Coreografia (1440, INST·06 da A08).**

| t (ms) | O que acontece | Token |
|---|---|---|
| 0 | O campo trava. O valor vira texto impresso em tinta, com a hora ("sua previsão · 34 % · 14:02"). O botão some | `corte` |
| 0 | **Mesmo quadro.** A linha de registro da aula muda: "Praticado: 1 ato registrado" (ou "nesta sessão", ver acima), e o glifo de Praticado troca de silhueta. `aria-live`: "Previsão registrada" | `corte` |
| 0 | Evento enviado. Se falhar: a linha volta a "nenhum ato registrado" com a frase "Não foi possível salvar. Sua previsão continua aqui. Tentar de novo". A previsão **não** some | — |
| 100 | Na escala do instrumento, a marca da previsão é desenhada: um tique vertical com rótulo "sua previsão" | `desenhoCurto` 700, `traco` |
| 800 | A ação "Comparar com o cálculo" fica disponível. **A referência não aparece antes do gesto** (C7) | `entrada` 280 |
| gesto + 0 | O instrumento calcula e o valor aparece | `corte` |
| gesto + 0 | A marca do cálculo é desenhada na mesma escala, com rótulo "calculado" | `desenhoCurto` 700 |
| gesto + 350 | O colchete entre as duas marcas é traçado, e a diferença **conta** até o valor ("diferença: 9 p.p.") | `linear` 400 |
| gesto + 750 | A frase de debrief da camada Alexandria entra, sem cor de acerto ou erro | `entrada` 280 |

- **Manipular o parâmetro** do instrumento depois disso: o traçado e o número acompanham o controle **sem atraso**
  (consequência contínua). A marca da previsão fica fixa, como rastro.
- **Diferença zero.** O colchete vira um fio único. Nenhuma celebração: acertar a previsão não é marco (M6, D2).
- **Vernier (opcional, a validar no render).** As duas marcas podem ser lidas como escalas que se alinham. O
  alinhamento só é mostrado quando o valor bate, sem mola e sem passar.

**Movimento reduzido.** A marca, o cálculo, o colchete, o número final e o debrief aparecem no quadro do gesto. A
linha de registro muda no quadro do registro, igual ao modo normal.

**Estado final.** A previsão impressa com a hora, as duas marcas, a diferença com unidade e a linha de Praticado
atualizada.

**Aceite (filmstrip 1440 e 390, E2→E3 na A08, `t` = −100, 0, 100, 500, 800, gesto+0, gesto+350, gesto+800).**

- **Gate S6.** No quadro `t = 0`, a linha de Praticado já mudou (texto e glifo).
- Entre `t = 0` e a comparação, o valor calculado não existe no DOM.
- Nenhuma cor muda por causa do tamanho da diferença: a tira de amostras dos quadros finais tem as mesmas cores com
  diferença 0 p.p. e 30 p.p.
- **Teste de falha de rede** (rota do evento bloqueada): a mensagem aparece, a previsão fica e o Praticado volta.
- **Hoje:** a folha mostra "nesta sessão · ainda não salvo na conta", e a palavra "registrado" não aparece.

---

### Momento 6 — Conclusão de aula

**Gatilho.** "Marcar aula como concluída" → `recordEvent('aula_concluida')` resolve com `aulaStatus.status ===
'concluido'`. Enquanto a resposta não chega, o botão diz "Registrando…" (texto parado, sem spinner) e a linha de
registro não muda.

**Função.** Chegada (a aula se completa) + consequência (o módulo avança uma estação).

**Dependência.**

- Conclusão: hoje.
- Contador "N de M": só com `totalAulas` conhecido e reconciliado. Sem ele, "aula percorrida", sem número.
- Praticado: em desenho, como no momento 5. Hoje, "Praticado: nenhum ato registrado" ou a contagem da sessão.

**Coreografia (1440, no próprio bloco de conclusão ao fim da aula; sem modal).**

| t (ms) | Camada | O que acontece | Token |
|---|---|---|---|
| 0 | Evidência | O botão é substituído pela **linha de registro**: "Percorrido: aula concluída em 17 set. 2026 · Praticado: 2 atos registrados · Demonstrado: ainda não avaliado". Silhuetas trocadas. `aria-live`: "Aula concluída. 8 de 9 aulas do M01 percorridas" | `corte` |
| 0 | Evidência | O localizador da aula troca "em leitura" por "concluída" | `corte` |
| 150 | Evidência | **A estação se preenche.** No mini-percurso do módulo (os 9 tiques ou discos das aulas), o disco da A08 passa de meio disco a disco cheio por varredura angular: um arco de raio r/2 com traço de largura r, de 180° a 360° | `desenhoCurto` 700, `traco` |
| 150 | Evidência | Contador tabular "aulas do M01 percorridas: 7 → 8 de 9", em um passo | `linear` 150 |
| 150 | Próximo passo | "A seguir · M01·A09 — [título]" entra **já clicável**, com a ação principal "Abrir M01·A09" | `entrada` 280 |
| 850 | Motivação | Se alguma conquista foi registrada, entra o momento 8 abaixo de um fio de 1 px | ver momento 8 |
| ≤ 1500 | | Repouso | |

- **Última aula do módulo:** a fase de 850 ms é trocada pelo momento 7.
- **Aula já concluída reaberta:** a linha de registro está presente e nada anima.
- **Clique no próximo passo durante a coreografia:** `finish()` e navegação (momento 3 com origem no bloco).

**Movimento reduzido.** Linha de registro, estação cheia, contador final e próximo passo no quadro 0.

**Estado final.** A linha de registro com as três dimensões (S3), a estação cheia, o próximo passo como ação
principal e, se houver, o registro de percurso na camada de motivação.

**Aceite (filmstrip 1440 e 390, E4 com a A09 do M04, ou E2→A08, `t` = −200, 0, 150, 400, 850, 1500).**

- Em `t = −200` (esperando a resposta), nada mudou além de "Registrando…".
- Em `t = 0`: linha de registro completa, "Demonstrado: ainda não avaliado" presente, nenhuma das palavras
  "Aprovado", "Dominado" ou "Excelente" (busca de texto).
- O próximo passo é clicável em `t = 150` (log de clique).
- O contador mostra o mesmo número que Home, Mapa e Progresso depois do evento (captura das três telas na
  sequência).
- Não há elemento sobreposto ao conteúdo nem foco preso (árvore de acessibilidade).

---

### Momento 7 — Conclusão de módulo ("Concluído")

**Gatilho.** O `aula_concluida` do momento 6 completa o conjunto de aulas do módulo. O conjunto é derivado da
coleção, com `totalAulas` conhecido e reconciliado (P8, P22).

**Função.** Chegada. O módulo se completa e o trecho do território se fecha. A medalha é **motivação**, não prova.

**Dependência.** Hoje, para módulos com contagem reconciliada. Nos outros, o momento não dispara, e o módulo aparece
em palavras: "todas as aulas listadas foram percorridas; contagem do módulo em reconciliação". Nunca uma conclusão
possivelmente falsa (P8). A medalha depende da persistência da camada de motivação (§9; ver
`sistema-de-conquistas.md` §1.2).

**Coreografia (continua a do momento 6 a partir de t = 850).**

| t (ms) | Camada | O que acontece | Token |
|---|---|---|---|
| 0–850 | Evidência | Momento 6, com o contador chegando a "9 de 9" | |
| 850 | Evidência | **O limbo do módulo se fecha.** Os 9 tiques viram um anel contínuo: os intervalos entre os tiques são traçados | `desenhoCurto` 700, `traco` |
| 850 | Evidência | "M01 · CONCLUÍDO" em voz de identidade, com a linha "9 de 9 aulas percorridas · Avaliação do módulo: ainda não registrada · Demonstrado: ainda não avaliado". `aria-live` equivalente | `corte` + `entrada` 280 |
| 1000 | Evidência | **O trecho do território se fecha.** Na mini-carta do território (SVG de `geometriaCarta`, 160 px), o trecho da estação M01 até a M02 é traçado a tinta, e o disco da M01 se preenche | `traco`, duração por comprimento (≤ 1200) |
| 150 | Próximo passo | "Começar M02 · Aula 01 — [título]", clicável desde já | `entrada` 280 |
| 1400 | Motivação | **Medalha do módulo cunhada** (momento 8, variante de módulo) | ≈ 1150 |
| ≤ 2600 | | Repouso | |

- **Palavras obrigatórias:** "Concluído" ou "concluído". **Proibidas:** "Aprovado", "Dominado", "Completo com
  sucesso" e qualquer ponto de corte (P18).
- **Na próxima Home:** o momento 1 traça o trecho novo M01→M02 (F-MC1).

**Movimento reduzido.** Anel fechado, "Concluído", trecho da carta desenhado, medalha no estado cunhado, data e
próximo passo, tudo no quadro 0.

**Estado final.** O módulo concluído em três lugares coerentes (aula, carta e, na próxima visita, Home e Mapa). A
medalha fica na camada de motivação, abaixo do fio.

**Aceite (filmstrip 1440 e 390, E4 na última aula do M04, `t` = 0, 400, 850, 1200, 1600, 2000, 2600).**

- Busca de texto: "Concluído" presente; nenhuma palavra do vocabulário proibido; nenhum "%".
- "Avaliação do módulo" e "Demonstrado" aparecem **acima** da medalha, e a medalha fica abaixo do fio (a ordem de
  S3 é medida por `getBoundingClientRect().top`).
- O próximo passo é clicável em `t = 150`.
- Com um módulo de `totalAulas: null` (fixture), o momento não dispara, e a frase de reconciliação aparece.

---

### Momento 8 — Conquista obtida

**Gatilho.** Uma regra de `sistema-de-conquistas.md` retorna verdadeiro depois de um evento confirmado, e
`badge_conquistado` volta com `badgeAlreadyAwarded === false`. Se a conquista já existia, nada toca.

**Função.** Chegada, na **camada de motivação**. É não bloqueante, tipográfica e acompanhada de uma medalha.

**Dependência.**

- Regras de CONCLUSÃO: hoje, com `aula_concluida`.
- Persistência: `badge_award` já existe no backend.
- `alexandria-badges.ts` e `badgeRules.ts` precisam do catálogo novo (tarefa do LYCEUM).
- Camadas da medalha para a cunhagem: produção pendente.

**Onde.** No bloco de conclusão da aula, abaixo do fio que separa evidência de motivação, com o rótulo "REGISTRO DE
PERCURSO" em voz de identidade, 11 px. **Nunca** em modal, toast flutuante sobre o conteúdo ou tela cheia.

**Coreografia (medalha de 96 px CSS, t relativo ao início do momento).**

| t (ms) | O que acontece | Token |
|---|---|---|
| 0 | O rótulo e o nome da conquista (Lora 600, 16 px, HTML) aparecem. `aria-live`: "Registro de percurso: M01 concluído" | `entrada` 280 |
| 0 | O **disco cego** (relevo em papel, sem tinta) aparece no lugar da medalha | `entrada` 280, só opacidade |
| 280 | **Passe 1 — campo.** A camada "campo gravado" cruza sobre o disco cego | `estado` 150 → 200, `linear` |
| 480 | **Passe 2 — figura.** A camada "figura" (a ilha e a estação) cruza | 200, `linear` |
| 680 | **Passe 3 — orla.** A camada "orla e exergo" cruza. A medalha está cunhada | 200, `linear` |
| 880 | **Data batida.** "17 set. 2026" (algarismos tabulares) aparece sob a medalha. É o último gesto | `chegada` 250 |
| 880 | Critério em 1 frase + link "Ver no caderno de marcos →" | `entrada` 280 |
| ≤ 1160 | Repouso | |

- **Só opacidade entre camadas pré-renderizadas.** Escala fixa em 1,0, sem rotação, sem reflexo varrendo, sem sombra
  CSS. O relevo está na imagem.
- **Mais de uma conquista no mesmo evento** (ex.: "Módulo 01 concluído" + "10 aulas percorridas"): **só uma medalha
  cunha**, a de maior hierarquia (território > módulo > contagem > hábito). As outras aparecem como linhas de texto
  com glifo de 24 px, escalonadas a 120 ms.
- **Registro retroativo** (regra nova avaliada sobre aulas antigas): sem cunhagem. A conquista entra no caderno com
  a frase "registrada em DATA; as aulas foram concluídas antes".
- **No Progresso:** conquistas novas desde a última visita levam a palavra "nova", sem animação.

**Movimento reduzido.** A medalha cunhada, o nome, a data e o critério no quadro 0.

**Estado final.** Nome em HTML, medalha cunhada, data, critério e link. Tudo abaixo da evidência.

**Aceite (filmstrip 1440 e 390, E4 → primeira conclusão de módulo, `t` = 0, 280, 480, 680, 880, 1160).**

- Os três passes são quadros **distintos**: a média de luminância da medalha muda em degraus e nunca passa do valor
  final.
- O tamanho da caixa da medalha é constante em todos os quadros (sem escala).
- Nenhum texto dentro da imagem: a folha inclui a imagem isolada da medalha para a verificação.
- Com um evento que concede duas conquistas: 1 medalha e 1 linha de texto.
- A ação principal da página (próximo passo) está acima da medalha e é clicável em todos os quadros.

---

### Momento 9 — Marco de trilha (território concluído)

**Gatilho.** O momento 7 conclui o último módulo de uma trilha, e **todos** os módulos dessa trilha têm contagem
reconciliada e concluída.

**Função.** Chegada rara (3 vezes na vida de um learner). É a única celebração que mostra o território inteiro.

**Dependência.** Hoje, só se todas as contagens da trilha estiverem reconciliadas. A soma das aulas é derivada, e
`totalAulasPartial === false` é obrigatório. Sem isso, o marco não dispara e o texto diz "contagem do território em
reconciliação".

**Coreografia (substitui a fase de 1400 ms do momento 7).**

| t (ms) | Camada | O que acontece | Token |
|---|---|---|---|
| 0–1400 | Evidência | Momento 7 até o fechamento do trecho | |
| 1400 | Evidência | **Replay do percurso do território** na mini-carta, ampliada para 320 px. As estações do território, já cheias, recebem em ordem de rota um anel de chegada, a 60 ms uma da outra. A estrada inteira do território recebe um segundo traço de tinta, contínuo | `traco`, ≤ 640 |
| 1400 | Evidência | "TERRITÓRIO I · FUNDAMENTOS UNIVERSAIS — CONCLUÍDO" em voz de identidade, com a linha "5 módulos · N aulas percorridas", com N derivado da coleção (nunca digitado) | `entrada` 280 |
| 150 | Próximo | "Território II · Setor Elétrico Brasileiro — começar M06 · Aula 01" como ação principal, clicável desde já | `entrada` 280 |
| 2040 | Motivação | Medalha do território cunhada (momento 8, 96 px) | 1160 |
| ≤ 3200 | | Repouso | |

- **Na próxima Home:** o momento 1 gira pela aresta V1→V2 (momento 2, gatilho 2), com a chamada "Você está aqui ·
  M06 · Aula 01 de N".
- **Sem som, sem tela cheia, sem escurecer o fundo.**

**Movimento reduzido.** O estado final completo no quadro 0.

**Estado final.** O território concluído com números derivados, a medalha do território e o próximo território como
ação principal.

**Aceite (filmstrip 1440 e 390, fixture de trilha concluída, `t` = 0, 850, 1400, 1800, 2040, 2600, 3200; e a Home
seguinte com o giro V1→V2).**

- Os números batem com a soma da coleção (log do cálculo na legenda).
- O replay segue a ordem da rota (ordem de preenchimento em log).
- A próxima Home mostra o giro V1→V2 e termina em V2.
- Com uma trilha de `totalAulasPartial: true`, o marco não dispara.

---

### Momento 10 — Microinterações do sistema

A frequência alta manda (M6): quase tudo aqui é `corte` ou `instante`.

| Interação | Gatilho | Função | Normal | Reduzido | Aceite |
|---|---|---|---|---|---|
| **Foco visível** | Tab | Localização (S7) | Aparece em `corte`: contorno de 2 px navy com 2 px de afastamento. Sem animação e sem brilho. `scroll-padding-top` = altura do header + localizador, para o foco nunca ficar sob o header | Igual | Filmstrip Tab: cada quadro tem o contorno completo, e a área de foco não intersecta o header (medido) |
| **Hover de link e controle** | Ponteiro | Afordância | Só cor (`instante` 100) e fio (`hover` 200). **Sem deslocar a seta, sem escala, sem sublinhado animado** | Cor em corte | Diff de caixa = 0 entre hover e repouso |
| **Pressionar** | Clique | Confirmação | Fundo navy → navy-profundo `#071628` em `corte`. Sem "afundar" em escala | Igual | Caixa constante |
| **Gaveta** (nav a 390 e sumário) | Botão com rótulo | Continuidade: vem da borda do gatilho | Entra com `translateX(100% → 0)`, `entrada` 280, `entra`; sai com `saida` 200, `sai`. Fundo da página: plano pergaminho a 92% de opacidade, **sem blur**. O foco vai para o 1º item em `corte` (não espera o fim). Esc fecha. Começa fechada | Corte de opacidade 150 | Gaveta fechada no quadro 0; foco dentro em t = 0; Esc fecha; nenhum `backdrop-filter` (estilo computado) |
| **Busca** (quando for real, S5) | Ctrl K ou clique em "Buscar" | Utilidade | **Ctrl K: `corte`** (ação de teclado). Clique: `entrada` 200 só com opacidade. Resultados atualizam em `corte` a cada tecla | Corte | Ctrl K: nenhum quadro intermediário |
| **Header recolhendo** | Rolar para baixo com localizador (P15) | Localização | O header sai com `translateY(-100%)`, `saida` 200, `sai`, **sem animar `height`** (hoje `AlexandriaHeader` anima `height` e `opacity`; trocar). O localizador compacto sobe junto e fica. Rolar para cima: volta com `entrada` 200 | Corte | Nenhuma propriedade de layout em transição (estilo computado); o localizador é visível em todos os quadros |
| **Tooltip de termo** | Hover ou foco num termo | Consulta | O primeiro abre depois de 300 ms de hover, sem animação. Os seguintes, em até 1 s, abrem em `corte`. No foco, imediato | Igual | Não há quadro de opacidade parcial |
| **Abas e troca de codificação** | Clique | — | `corte` (M10) | Igual | 0 quadro intermediário |
| **Verbete ou ficha de fonte na aula** (D6) | Clique em termo ou fonte | Continuidade: linha → verbete | O painel entra da margem: `entrada` 280, opacidade + 12 px X. A linha de origem ganha um fio de 1 px em `corte`. Fechar: `saida` 200, e o foco e a rolagem voltam à linha | Corte | A rolagem é idêntica antes de abrir e depois de fechar |
| **Carregamento** | Pedido lento | Honestidade | Nada nos primeiros 400 ms. Depois, a palavra "Carregando…" parada. **Sem spinner, sem shimmer** (brilho) | Igual | Nenhuma animação infinita |
| **Instrumento: arrastar parâmetro** | Controle | Consequência | O traçado e o número acompanham o controle no mesmo quadro (rAF), sem suavização que atrase | Igual (é resposta direta, não animação) | Latência entre input e traço ≤ 1 quadro (log) |

---

## 5. Produção da sequência do globo (Blender)

É um pedido de produção para a rodada de mídia. Nada foi renderizado aqui.

### 5.1 Reaproveitamento

A base é `media-lab/A-r04/globo/`, a rodada mais recente. Ela tem a mesma geometria, câmera e vistas da r03, o
material refeito e a composição com a paleta de tokens (`compor_r04.py`: NAVY, NAVY_P, OURO, TINTA). Os scripts novos
ficam em `media-lab/movimento-e-conquistas/globo-seq/`:

- **`globo_seq.py`**: importa as funções de `globo_r04.py` (`build_scene`, `set_view`, `export_json`, `setup_render`)
  e acrescenta os argumentos `--de V1 --para V2 --quadros 48 --sizes 520,1040`. Cada quadro interpola **a orientação
  da câmera por slerp de quaternion** entre as duas poses, com `roll = −9°`, distância 8,0 e lente 105 mm
  constantes. Os quadros ficam **uniformes em ângulo**: a curva é aplicada no playback (§5.3), não no render.
- **A luz fica em coordenadas de câmera** (`--key -0.48,0.50,0.72`, como na r04). Assim a iluminação é igual em todos
  os quadros e o playback ao contrário continua fisicamente coerente.
- **Um JSON leve por quadro**: estações (`px`, `py`, `visible`, `facing`) e rota (16 × 64 pontos, `px`, `py` e
  `visible`, quantizados em inteiros de 0,1 px). O overlay acompanha o giro com esses dados.
- **Composição por quadro** com `compor_r04.py --mar b`, sem mudar parâmetros. O último quadro precisa sair **igual**
  ao render estático da vista final.

**Comando** (sempre com a trava de GPU):

```
python C:/dev/gridalpha-v2-alexandria-v2-restructure/docs/alexandria-v2/media-lab/_ferramentas/gpu_lock.py -- "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P globo_seq.py -- --de V1 --para V2 --quadros 48 --sizes 520,1040
```

### 5.2 Arestas e tamanhos

| Aresta | Uso | Quadros | Tamanhos (px de dispositivo) |
|---|---|---|---|
| V0→V1, V0→V2, V0→V3 | Momento 1 | 48 | 520 (390 @1x e 2x reduzido), 1040 (1440 @1x) |
| V1→V2, V2→V3 | Momentos 2 e 9 | 48 | 520, 1040 |
| V1→V3 | Momento 2 (direta) | 72 | 520, 1040 |

- **Retornos** (V2→V1, V3→V2, V3→V1) tocam as mesmas sequências ao contrário.
- **Telas grandes** (1400 e 2000 px de dispositivo): a sequência roda em 1040 escalada, e o último quadro troca pela
  imagem estática de alta resolução em `corte` (momento 1, t = 900). A troca só é aceita se a diferença de pose for
  zero e a diferença média no disco for ≤ ΔE00 1.

### 5.3 Formato e playback

- **Formato.** Quadros em WebP (qualidade a calibrar no render), empacotados por aresta e tamanho.
  - **Orçamento:** ≤ 2,5 MB por aresta a 1040 e ≤ 0,8 MB a 520, **medido**.
  - Se a textura gravada estourar o orçamento, a alternativa é vídeo VP9 com alfa só onde houver suporte, e o
    fallback continua sendo o cruzamento das imagens estáticas.
  - Vídeo **não** é o padrão: Safari não tem VP9 com alfa.
- **Carregamento.** As sequências são pré-carregadas em `requestIdleCallback` depois do primeiro quadro da Home e
  decodificadas para `ImageBitmap`. Se o gatilho chegar antes do carregamento, o momento pula a rotação (M3: mesmo
  estado final).
- **Playback.** `canvas` com rAF. `índice = round(easing(t / duração) × (N − 1))`, com a curva `easing` do `AE`. Os
  quadros repetidos nas pontas são o efeito esperado da suavização.
- **Overlay.** Os rótulos saem no início e entram na chegada. O anel "você está aqui" e o trecho acompanham o JSON do
  quadro corrente. `colocarRotulos` só roda na pose final.
- **Classe (§7).** Explicação: a proveniência é a mesma do globo r04 ("Modelo do currículo, não mapa geográfico").
  Registro em `media-provenance.md` por aresta.

### 5.4 Aceite de produção

1. A longitude e a latitude da câmera por quadro são monotônicas e terminam exatamente na pose da vista.
2. O último quadro e o render estático da vista têm diferença média ≤ ΔE00 1 no disco.
3. Não há *flicker* de textura entre quadros vizinhos (diferença de luminância local ≤ limiar a calibrar).
4. As estações `visible` por quadro batem com o ray cast, sem rótulo sobre estação oculta.
5. O orçamento de peso é medido e registrado.
6. Nenhum texto dentro das imagens.
7. O playback é julgado no navegador, em vídeo completo, e nunca por quadro isolado.

---

## 6. O que esta especificação não autoriza

- Adotar uma biblioteca de movimento: é uma decisão de dependência.
- Mostrar "registrado" para ato que não foi salvo na conta.
- Contar qualquer número sem contagem reconciliada.
- Animar "com prática" ou "demonstrado" antes de existirem os eventos e a tarefa portadora.
- "Aprovado", "Dominado", "Excelente" ou qualquer ponto de corte (P18).
- Aprovar qualquer momento por screenshot.
