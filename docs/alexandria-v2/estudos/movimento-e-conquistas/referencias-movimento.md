# Referências de movimento: o que transferir, com que tempo e com que curva

Estudo de 2026-09-17 para o pedido do Founder: animações de conclusão, do globo e de entrada de aula. Complementa
`referencias-conquistas.md`, que define **o que** se move nas conquistas. Este estudo define **como**: tempo,
curva, orquestração e movimento reduzido.

**Contrato aplicado.** `bar.md`:

- S6: movimento só para continuidade, consequência ou chegada. Proibidos bounce, overshoot, parallax e
  scroll-jacking. O movimento reduzido chega ao mesmo estado final. Screenshot nunca aprova movimento.
- S2: sem sombra, gradiente, vidro ou brilho.
- S3 e D2: a celebração fica na camada de motivação, é tipográfica e não bloqueia o fluxo.
- §6: nenhuma pele Duolingo ou Brilliant.
- P18: "Concluído", nunca "Aprovado".

**Gasto Higgsfield.** 0 crédito. Este é um estudo de referência e nada foi gerado.

---

## Método e rótulos de evidência

Cada referência foi aberta de verdade e recebe um rótulo:

- **(med)** medido na página ao vivo com Playwright e o Chrome do sistema, a 1440×900. Foram lidos o estilo
  computado de todos os elementos (`transition-duration`, `transition-timing-function`), `document.getAnimations()`
  e os `cubic-bezier` das folhas de estilo legíveis. Depois a página foi recarregada com
  `prefers-reduced-motion: reduce`.
- **(vid)** gravado em vídeo e medido com o detector de cena do ffmpeg, a 30 fps, recortado na área da animação.
  A gravação headless tem **jitter de ±33 ms**, então as durações de vídeo são aproximadas.
- **(fonte)** código-fonte lido. Os notebooks d3 vieram pela API do Observable; os tokens M3, do
  `MotionTokens.kt` do AndroidX.
- **(doc)** documentação ou artigo lido (WebFetch).
- **(busca)** só resultado de busca. Vale como pista, não como prova.

**Onde está a evidência.** Em `docs/alexandria-v2/media-lab/movimento-e-conquistas/referencias/`:

| Arquivo | O que contém |
|---|---|
| `medir_movimento.cjs` | Medição de 13 páginas |
| `medir_dirigido.cjs` | OWID e o shot do 60fps |
| `captura/medicoes.json` | Números brutos da medição geral |
| `captura/medicoes-dirigidas.json` | Números brutos da passada dirigida |
| `captura/<ref>/` | Um `.webm` e PNGs por referência |
| `filmstrips/` | 4 folhas de contato: Duolingo lição concluída, d3 world tour, d3 ortográfica→equirretangular, OWID play e abas |

**Limites honestos.**

- As páginas do Apple HIG e do M3 são renderizadas por JS e voltaram vazias. Usei o JSON do HIG
  (`tutorials/data/.../motion.json`) e o código-fonte dos tokens M3.
- A Stripe não expõe as folhas de estilo (cross-origin). Por isso "0 regra de reduced-motion" **não é prova** de
  ausência nesse caso.
- O feedback de resposta do Brilliant exige conta. Não foi observado ao vivo: vale o estudo de caso da Rive (doc)
  e o shot do 60fps (busca).
- Os notebooks do Observable rodam em iframe. O CSS não é medível, mas o código-fonte foi lido.
- O cookie banner do OWID não foi aceito (política de privacidade). Ele aparece nas capturas.

---

## 0. Em uma tela

| Referência | Mecanismo a transferir | Tempo e curva observados | Não transferir |
|---|---|---|---|
| motion.dev | Elemento compartilhado (FLIP por transform) e movimento reduzido que desliga transform/layout e mantém a opacidade | UI de 160–200 ms; curva dominante `(0.16,1,0.3,1)` (med) | Mola com `bounce`; `layout` em tudo |
| 60fps.design | Vocabulário de padrões e o shot como unidade de estudo | Site com easeOutBack `(0.175,0.885,0.32,1.275)` em 128 elementos (med) | O próprio overshoot; confete, mascote, "spring physics" |
| Rive | Máquina de estados dirigida por dado (view model: número, booleano, trigger, enum) e duração de transição por aresta | Duração padrão da transição = 0 (corte); "exit time" configurável (doc) | Personagem, lip-sync, runtime pesado sem necessidade |
| Apple HIG | Movimento opcional, breve e preciso; nada em interação frequente; nunca fazer esperar | Sem números no texto (doc) | Nada de SF Symbols animados ou háptico no web |
| Material 3 | Escala de duração (50–1000 ms) e par *emphasized decelerate* / *accelerate* para entrar e sair | `(0.05,0.7,0.1,1)` na entrada; `(0.3,0,0.8,0.15)` na saída (fonte) | Container transform com raio e elevação; ondulação (ripple) |
| Emil Kowalski | Menos de 300 ms na UI; ease-out para resposta; nada em ação de teclado; interrompível; só transform e opacity | 150 ms com `(0.4,0,0.2,1)` no site; na folha, `(0.23,1,0.32,1)` e `(0.19,1,0.22,1)` (med) | Morph "delight" em componente frequente |
| NN/g (apoio) | Duração cresce com a distância; a saída é 50–100 ms mais curta | 100 ms no feedback; 200–300 ms em mudança grande; 500 ms já arrasta (doc) | n/a |
| Linear | Curva única e disciplinada; cor em 100 ms; revelação de 700 ms só no marketing | `(0.25,0.46,0.45,0.94)` em 269 elementos; `(0.32,0.72,0,1)` na gaveta (med) | 101 animações infinitas **seguem** com reduced-motion; overshoot `(0.45,1.45,0.8,1)` no changelog |
| Stripe | Só transform e opacity; tudo abaixo de 500 ms; curva custom; IntersectionObserver para disparar | `(0.25,1,0.5,1)` em 453 elementos; 300 ms na UI e 800 ms nas revelações (med) | Cubos 3D, `skewY`, animação ligada à rolagem |
| Brilliant | Celebração e encorajamento como *estados* disparados por evento; contador sincronizado com a animação | Site: `(0.16,1,0.3,1)` e `(0,0,0.2,1)` (med) | Cor e ilustração do Brilliant (§6); mascote Koji |
| Duolingo | Orquestração da conclusão: figura → cartões escalonados → números contando, com a próxima ação sempre visível | ≈ 2,5 s do primeiro brilho ao repouso; cartões a ≈ 0,5 s um do outro (vid) | Mascote, explosão, brilhos, gemas, XP como status, som automático |
| OWID | O play desenha a série ano a ano e reescala o eixo; a troca de aba é **corte seco**; o tooltip é imediato | Troca Line→Bar: nenhum quadro intermediário (vid); `slide-in` de 300 ms linear num painel (med); 11 regras de reduced-motion | Play automático; eixo reescalando sem aviso |
| d3 world tour e projeções | Rotação por slerp (versor) + arco de grande círculo traçado durante a viagem, com inclinação fixa; troca de projeção por mistura das funções brutas | Viagem de 1250 ms + recolhimento da cauda de 250 ms, `easeCubicInOut` (fonte); troca de projeção em 45 quadros ≈ 750 ms, `easeCubicInOut` (fonte); ciclo orto↔equi de 480 quadros ≈ 8 s (fonte) | Rotação contínua decorativa (`performance.now()/100`); país em vermelho |

**Leitura do código atual.** `src/design/alexandria-tokens.ts:131` tem uma curva só, `AE.easing =
cubic-bezier(0.65,0,0.35,1)`, que é um ease-in-out, e quatro durações: estado 150, hover 200, desenhoCurto 700 e
desenhoLongo 1200. O `package.json` não tem biblioteca de movimento (nem `motion`, nem `framer-motion`, nem
Rive). Tem `d3-geo` e `three`. O shell e o `CaminhoExpedicao` já tratam `prefers-reduced-motion`.

**Lacuna principal.** Falta uma **curva de entrada**. Ease-in-out em algo que *aparece* começa devagar e parece
atraso. Todas as referências de produto usam ease-out forte para entrar.

---

## 1. Referências de produto e sistema

### 1.1 motion.dev: layout, elemento compartilhado e movimento reduzido (med + doc)

**O que vi.**

- **Docs de layout (doc).** A animação de layout mede a posição antiga e a nova e anima com
  `transform: translate/scale`, nunca com `width/height`.
  - `layoutId` liga dois elementos em componentes diferentes: o novo "sai" do antigo e, se os dois coexistem,
    há crossfade.
  - A distorção é corrigida em `border-radius` e `box-shadow`. Os filhos precisam de `layout` para contraescala.
  - Ressalvas: não funciona em `display: inline` nem em SVG. O aparecimento da barra de rolagem dispara animação
    espúria (usar `scrollbar-gutter: stable`).
- **Movimento reduzido (doc).** Com `MotionConfig reducedMotion="user"`, a biblioteca desliga **transform e
  layout** e **mantém opacity e backgroundColor**. `useReducedMotion()` serve para casos próprios.
- **Site ao vivo (med).**
  - 236 elementos com transição, quase todos entre **160 e 200 ms**: `0.16s color, transform`, `0.2s opacity` e
    `0.18s border-color, transform`.
  - Curvas: `(0.16,1,0.3,1)` em 44 regras, `(0.25,0,0,1)` em 30, `(0.25,1,0.5,1)` em 22 e `(0.65,0,0.35,1)` em
    6. Esta última é a mesma do `AE.easing`.
  - 28 regras de reduced-motion. Com reduce, as animações ativas caem de 8 para **0**.
  - Na doc, o `clip-path` de revelação usa 400 ms.

**Transferir.**

- **Continuidade nó → módulo e linha → verbete (S6)** como elemento compartilhado. O glifo e o título da estação
  viajam até o cabeçalho do módulo, com transform e sem animar largura.
- **Contrato de movimento reduzido na forma do Motion.** Some o deslocamento e a escala, fica um corte de opacidade
  de ≤ 150 ms e o estado final é idêntico. Isso atende S6 ("chega ao mesmo estado") sem apagar a informação de
  que algo mudou.
- **Durações de UI entre 160 e 200 ms** para hover, foco e troca de estado. O `AE` já está nessa faixa.

**Não transferir.**

- `transition: { type: "spring", bounce > 0 }`, que é overshoot. Se a biblioteca for adotada, só mola
  criticamente amortecida (`bounce: 0`) ou curva cúbica.
- `layout` generalizado: anima reflow que não é continuidade.
- Crossfade de dois textos sobrepostos em título de conteúdo (legibilidade).

**Dependência técnica (registrar, não decidir).** O mecanismo pode vir de três lugares:

1. da biblioteca `motion` (dependência nova);
2. da View Transitions API do navegador;
3. de FLIP escrito à mão.

A decisão é do LYCEUM e do Founder. Se a View Transitions API for usada via react-router 6, é preciso verificar
antes a versão instalada e o suporte (não verificado aqui).

### 1.2 60fps.design: vocabulário e shot como unidade (med + vid)

**O que vi.**

- Catálogo de mais de 2.080 shots de 487 apps, com taxonomia por gesto, padrão, efeito e elemento.
- O shot "Duolingo Lesson Complete Head Explode" vem etiquetado *Bounce, Counter, Mascot, Particles, Spring
  Physics, Stagger, Success State, Ticker*.
- O próprio site usa `cubic-bezier(0.175,0.885,0.32,1.275)` (easeOutBack, **overshoot**) em 128 transições de
  transform e `(0.44,0,0.56,1)` em 154 transições de cor.
- Nenhuma regra de reduced-motion nas 9 folhas legíveis.

**Transferir.**

- **Método.** Descrever cada movimento da Alexandria como um shot: gatilho → sequência → estado final, com as
  etiquetas de padrão. É assim que o filmstrip de S6 fica comparável.
- **Taxonomia útil**, só com as etiquetas compatíveis: *Stagger, Ticker, Success State, Progress, Recap,
  Sequence*.

**Não transferir.** As etiquetas *Bounce, Spring Physics, Particles, Confetti, Mascot, Morph, Parallax* e a curva
easeOutBack. A curva é um exemplo exato do que o portão de curvas precisa reprovar (ver §4).

### 1.3 Rive: estados dirigidos por dado (doc)

**O que vi.**

- A máquina de estados liga timelines a estados por transições condicionadas.
- A **duração da transição é 0 por padrão**, ou seja, corte. A doc cita 0,2 s como exemplo de transição suave.
- *Exit time* define quanto do estado precisa tocar antes de sair (até 100%). Há também *pause source when
  exiting* e *allow exit during transition*.
- Os inputs e eventos de runtime foram substituídos por **data binding**. As propriedades de view model são
  Number, Boolean, **Trigger** ("fire-and-forget"), Enum, View Model aninhado e List. Elas dirigem transições,
  blend states e qualquer propriedade ligável.
- **Brilliant (doc, estudo de caso Rive).**
  - Usa Events para sinalizar que a sequência foi atingida e **sincroniza a animação com contadores numéricos**.
  - O fluxo de fim de lição "tem muitas possibilidades" e é resolvido por máquina de estados.
  - Os engenheiros do Brilliant "só disparam o estado desejado".
- **Site da Rive (med).** Uma única transição CSS. Todo o movimento vive no canvas do runtime. A lição é que a
  animação de estado pode sair do CSS por completo.

**Transferir (o mecanismo, não necessariamente a ferramenta).**

- **Modelar cada marco e cada estação como uma máquina de estados explícita** cujo único gatilho é um evento real
  de §9:

  | Estado | Evento que leva a ele |
  |---|---|
  | não iniciada | nenhum |
  | em leitura | `aula_iniciada` |
  | percorrida | `aula_concluida` |

  Com prática, `exercicio_respondido`, que **hoje não é emitido**, não tem transição até existir. Um *trigger*
  por evento; nenhum estado alcançável sem evento. Isso é D2 em forma de arquitetura.
- **Duração por aresta.** Arestas de corte (0) para mudança frequente e arestas de chegada (700–1200 ms) só na
  conclusão.
- **Exit time = 0 com "allow exit".** O learner pode sair durante a celebração (Apple: nunca fazer esperar).

**Não transferir.**

- Personagem, lip-sync e reação a erro com rosto.
- Adotar o runtime Rive **só** para isso. SVG e CSS com estados explícitos cobrem os casos atuais. Se a Rive entrar
  um dia, o asset precisa obedecer S2: sem glow nem gradiente.

### 1.4 Apple HIG: Motion (doc via JSON)

**O que vi.** Seis regras, todas aplicáveis:

- movimento com propósito ("não adicione movimento pelo movimento");
- **movimento opcional**: nunca como único canal de informação importante;
- feedback realista;
- **breve e preciso**;
- **evitar movimento em interações frequentes**;
- **deixar cancelar**: "não faça as pessoas esperarem uma animação terminar".

Para visionOS vale ainda: evitar oscilação sustentada (≈ 0,2 Hz) e manter um quadro de referência estacionário.

**Transferir.**

- A regra de canal: todo estado que a animação comunica também existe em palavra e silhueta. Isso já é S3.
- Nenhum movimento em ação repetida: marcar termo, trocar aba, avançar seção.
- Celebração cancelável, que não segura o CTA.
- **Quadro de referência estacionário no globo.** O graticulado e a moldura ficam parados enquanto o globo gira.
  Nada de rotação ociosa contínua (oscilação sustentada).

**Não transferir.** Háptico, SF Symbols animados e as convenções de Liquid Glass/visionOS (vidro é proibido em S2).

### 1.5 Material 3: duração e easing (fonte: `MotionTokens.kt`)

**O que vi.**

- **Durações.**

  | Faixa | Tokens |
  |---|---|
  | Short | 50 / 100 / 150 / 200 |
  | Medium | 250 / 300 / 350 / 400 |
  | Long | 450 / 500 / 550 / 600 |
  | Extra long | 700 / 800 / 900 / 1000 ms |

- **Curvas.**

  | Token | Valor |
  |---|---|
  | Emphasized | `(0.2,0,0,1)` |
  | Emphasized decelerate | `(0.05,0.7,0.1,1)` |
  | Emphasized accelerate | `(0.3,0,0.8,0.15)` |
  | Standard | `(0.2,0,0,1)` |
  | Standard decelerate | `(0,0,0,1)` |
  | Standard accelerate | `(0.3,0,1,1)` |
  | Legacy | `(0.4,0,0.2,1)` |

  Nenhuma curva passa de y = 1: o M3 não usa overshoot nos tokens cúbicos.

**Transferir.**

- **O par entrada/saída.** Decelerate para o que chega e accelerate para o que sai.
- **Uma escala de duração nomeada**, em vez de números soltos.
- **A saída mais curta que a entrada.**

**Não transferir.**

- Container transform com raio animado e elevação: raio e sombra são proibidos.
- Ripple.
- Os "expressive motion springs" (fora do escopo cúbico; checar overshoot antes de qualquer uso).

### 1.6 Emil Kowalski: animations.dev e artigos (doc + med)

**O que vi.**

- **"Great animations" (doc).**
  - Menos de 300 ms.
  - `ease-out` para resposta rápida.
  - Só transform e opacity (composição).
  - Interrompível.
  - Respeitar `prefers-reduced-motion`.
  - Animar só onde a animação "enriquece a informação".
- **"You don't need animations" (doc).**
  - Ação disparada por teclado, repetida centenas de vezes por dia, não anima. O exemplo é o Raycast.
  - Um dropdown de 180 ms parece mais responsivo que um de 400 ms.
  - Tooltip: atraso só no primeiro; os seguintes sem atraso e sem animação.
  - "Delight" (morph) só em componente raro.
- **Currículo do animations.dev (doc).** Teoria de easing, molas, tempo, propósito, orquestração e
  acessibilidade.
- **Site (med).**
  - 150 ms com `(0.4,0,0.2,1)` em todas as 24 transições.
  - Nas folhas: `(0.25,0.46,0.45,0.94)`, `(0.19,1,0.22,1)` (expo-out), `(0.23,1,0.32,1)` (quint-out) e
    `(0.32,0.72,0,1)`.
  - Com reduce, os 7 loops infinitos (spinners e pulse) **continuam**. São indicadores de carregamento, que é o
    caso defensável.

**Transferir.**

- **A regra de frequência como critério de projeto.** Quanto mais raro o momento, mais movimento ele pode ter:

  | Momento | Frequência | Movimento |
  |---|---|---|
  | Conclusão de aula | ~1 por sessão | Chegada de 700–1200 ms |
  | Marca de termo, troca de aba | Dezenas | 0–150 ms |

- **O tooltip do glossário no fluxo**: atraso só no primeiro.
- **Curva de entrada ease-out forte** (quint/expo-out).

**Não transferir.** Morphs de "delight" em componente frequente e o spinner infinito (a Alexandria mostra ausência
honesta, não carregamento girando).

### 1.7 Linear: site e changelog (med)

**O que vi.**

- **Home.**
  - 404 elementos com transição. `0.1s color` em 254 deles.
  - A curva `(0.25,0.46,0.45,0.94)` (easeOutQuad) domina com 269.
  - `0.16s filter, transform` em 26 e `0.7s transform` em 20 (revelações).
  - A gaveta usa `(0.32,0.72,0,1)`.
  - **Com reduced-motion, 101 animações infinitas (pontos de grade em opacidade, 2,8 s) continuam rodando.**
- **Changelog.**
  - 269 elementos: 100–250 ms, `ease` e easeOutQuad.
  - Aparece `(0.45,1.45,0.8,1)`, que é overshoot.
  - 22 regras de reduced-motion; com reduce, 0 animações ativas.
  - Estrutura de feed datado, com vídeo curto por entrada.
- **"Invisible details" (doc).** O triângulo seguro do submenu, desenhado com `clip-path`, poupa segundos
  acumulados. Detalhe como geometria, não como tempo.

**Transferir.**

- **Disciplina de curva única por papel.** Uma curva dominante em quase tudo e exceções nomeadas.
- **Cor em 100 ms.**
- **Revelação longa (700 ms) só em superfície de primeira visita**, nunca no fluxo de estudo.
- O detalhe invisível como categoria de trabalho: zona segura no menu de trilhas, alvo de toque e foco.

**Não transferir.**

- Loop ambiente infinito, sobretudo **ignorando o reduced-motion** (anti-exemplo medido).
- Overshoot do changelog.
- Shell cinza com Inter e chips (§6).

### 1.8 Stripe: site e blog de engenharia (med + doc)

**O que vi.**

- **Home.**
  - 714 elementos com transição, quase todos **300 ms**.
  - `(0.25,1,0.5,1)` (easeOutQuart) em 453.
  - `(0.165,0.84,0.44,1)` (easeOutQuart) em 58.
  - `0.8s transform` em 46 (revelações).
  - Depois da rolagem, 32 animações WAAPI de 1420 ms em transform e clip-path, disparadas pela entrada na tela.
- **Blog (doc).**
  - "Exclusivamente propriedades baratas (transform e opacity)".
  - Tudo "abaixo de 500 ms".
  - Quase nunca usar `ease-in`, `ease-out` ou `linear` nativos: preferir cúbica custom.
  - Web Animations API para sequências encadeadas.
  - IntersectionObserver em vez de escutar a rolagem.
  - Ordem de escolha: transição CSS → animação CSS → WAAPI → rAF.

**Transferir.**

- **A hierarquia de implementação** (CSS → WAAPI → rAF). O globo e o traçado de rota ficam em rAF; o resto, em
  CSS ou WAAPI.
- **IntersectionObserver para desenhar o trecho percorrido quando entra na tela.** É um disparo único, não
  scroll-jacking. Com reduced-motion, o trecho já aparece desenhado.
- **300 ms como teto de UI**, fora dos momentos de chegada.

**Não transferir.**

- Cubos 3D com sombreamento simulado (luz falsa, S2).
- `skewY` decorativo.
- Animação acoplada ao progresso da rolagem (fronteira do scroll-jacking).
- Gradiente "mesh" da marca.

### 1.9 Brilliant (med + doc + busca)

**O que vi.**

- **Site (med).**
  - Pouco movimento (47 elementos): 200–300 ms, `ease` e `ease-out`.
  - Folhas com `(0.16,1,0.3,1)`, `(0,0,0.2,1)` e `(0.5,0,0.5,1)`.
  - 2 regras de reduced-motion.
- **Estudo de caso Rive (doc).**
  - Componentes de feedback de desempenho: celebração no acerto e **encorajamento quando o learner tem
    dificuldade**.
  - Caminhos coloridos por tema.
  - Contadores de sequência sincronizados com a animação.
- **60fps (busca)**: shots "Brilliant Lesson Complete" e "Koji Mascot Gained New Streak".

**Transferir.**

- **Um estado para "ainda não"**, diferente do acerto, que não pune.
  - Na Alexandria, isso se aplica à checagem de C7: tentativa antes da referência.
  - O retorno da tentativa é **consequência** (o traçado e o número mudam), não julgamento colorido.
  - Sem semáforo (S2).
- **O número conta junto com a figura**: o contador é sincronizado ao traçado, não ao lado dele.

**Não transferir.**

- Cores e ilustração do Brilliant (§6).
- O mascote.
- Celebração a cada acerto (frequência alta demais; Emil).
- Linguagem de "you're doing great" como juízo de competência.

### 1.10 Duolingo: celebração como mecanismo (vid + doc + busca)

**O que vi.**

- **Shot do 60fps**, filmado e amostrado a cada 500 ms (`filmstrips/60fps-duolingo-licao-concluida.png`):
  1. os brilhos entram;
  2. o mascote sobe;
  3. o primeiro cartão aparece;
  4. a cabeça expande e explode;
  5. o segundo e o terceiro cartões entram **escalonados**;
  6. os números **contam** (96% → 100%; 0:21 → 0:36);
  7. a fumaça se dissipa até o repouso.

  São **≈ 2,5 s do primeiro brilho ao repouso**, com os cartões a ≈ 0,5 s um do outro (resolução de 500 ms).
  **O CTA "Claim XP" fica visível e fixo desde o primeiro quadro.** O título e o subtítulo são estáticos: só a
  figura e os números se movem.
- **Blog da sequência (doc).**
  - Marco só em limiares significativos (1 semana, 1 mês, 100 dias, 1 ano).
  - "Timing is everything", com vários passes de animação bruta até o ritmo.
  - Primeiro conceito (balões) rejeitado por pouca energia.
- **Busca.** As recompensas foram o primeiro uso de Rive no Duolingo.

**Transferir (só o mecanismo).**

- **Orquestração em três tempos.**
  1. **figura** (o que aconteceu);
  2. **números escalonados** (quanto);
  3. **repouso**.

  O **texto e a próxima ação ficam parados e disponíveis durante toda a sequência**. Isso resolve "não bloquear
  o fluxo" (S3) sem abrir mão da celebração.
- **Ticker com número real.** Um contador só conta até um valor que existe:

  | Pode contar | Não pode contar |
  |---|---|
  | "aulas percorridas no módulo: 3 → 4 de 9", vindo de `aula_concluida` e da contagem reconciliada | "100%" sem escopo; tempo não medido; combo; XP sem regra |

- **Marco raro por limiar.** A celebração maior só em limiar de percurso: módulo percorrido, trilha percorrida.
  Em cada aula, só a chegada discreta.

**Não transferir.**

- Mascote, explosão, fumaça, brilhos e partículas.
- Rótulos "AMAZING / BLAZING / COMBO" (competência e juízo, D2).
- "0 mistakes? You're really good at this" (competência inferida de consumo, S3).
- XP como status e gemas.
- Som automático.
- Cores saturadas por cartão (semáforo).

### 1.11 Our World in Data: transições de gráfico (med + vid)

**O que vi** (`filmstrips/owid-play-e-abas.png`, Brasil, participação por fonte):

- **Play.** A série é desenhada **ano a ano da esquerda para a direita**. O domínio do eixo X **cresce junto**:
  1995–1994 → 2004 → 2014 → 2025, com o eixo reescalado. O controle de play vira pausa. O estado final é o
  gráfico completo. O vídeo mostra rajadas contínuas de ≈ 1,5 s.
- **Troca de aba Line → Bar → Table.** **Corte seco**: nenhum quadro intermediário detectado. A OWID não anima a
  troca de *tipo* de gráfico.
- **Tooltip.** Aparece imediatamente no hover, com ano e valores tabulares ordenados.
- **CSS (med).**
  - Só 6 elementos com transição, de 100 a 250 ms.
  - Uma animação `slide-in` de 300 ms num painel.
  - 11 regras de reduced-motion.
  - Com reduce, as animações ativas ficam em 1.

**Transferir.**

- **Corte seco quando a *codificação* muda.** Linha → barra é outro gráfico: não se interpola forma entre
  codificações diferentes.
- **Animar só quando os *dados* mudam dentro da mesma codificação.** Isso é consequência (S6): parâmetro → traçado.
- **"Play" como replay de uma série temporal** que termina no estado completo e pode ser pausado. Na Alexandria:
  replay do percurso real (F-M5).
- **Tooltip sem animação.**

**Não transferir.**

- Reescalar o eixo durante o play sem marcar que ele mudou: para leitura de energia, prefira eixo fixo e rótulo
  do ano corrente.
- Play automático.
- A paleta categórica da OWID (≤ 4 categorias e tokens, S2).

### 1.12 Globo e cartografia: d3 world tour, projeções, Reuters (fonte + vid + busca)

**O que vi.**

- **World tour** (`@d3/world-tour`, fonte; `filmstrips/d3-world-tour.png`).
  - Para cada destino: `p2 = geoCentroid(país)` e `r2 = [-lon, tilt − lat, 0]`, com **`tilt = 20°`**.
  - `ip = d3.geoInterpolate(p1, p2)` dá o **grande círculo**. `iv = Versor.interpolateAngles(r1, r2)` dá a
    **slerp** da rotação.
  - **Fase 1, `duration(1250)`.** A rotação avança e o arco é traçado de `p1` até `ip(t)`: a linha cresce
    enquanto o globo gira.
  - **Fase 2, padrão de 250 ms.** A cauda é recolhida, com o arco de `ip(t)` a `p2`, e a linha "chega".
  - Easing padrão do `d3.transition` (`easeCubicInOut`).
  - O vídeo mostra rajadas de ≈ 1,3 a 1,6 s por destino, ou seja, 1250 + 250 ms.
- **Ortográfica ↔ equirretangular** (`@d3/orthographic-to-equirectangular`, fonte).
  - `interpolateProjection(raw0, raw1)` mistura as **funções brutas** das projeções com `alpha(t)`, e a escala e
    a rotação também são interpoladas.
  - 480 quadros por ciclo (≈ 4 s por sentido a 60 fps), com `d3.easeCubic`.
- **Projection transitions** (fonte). 45 quadros (≈ 750 ms a 60 fps) com `easeCubicInOut`, mas **com rotação
  contínua `performance.now()/100`** durante a troca.
- **Reuters Graphics (busca).** O repositório público `example_svelte-graph-patterns` tem as pastas `graphs`,
  `scrolly` e `observer`. É o padrão de redação: D3 calcula e o framework desenha, com gatilho por observer (não
  por rolagem contínua). Não abri uma matéria específica da Reuters ou do NYT: fica como pista.

**Transferir para o globo do currículo (3 ilhas, 17 estações).**

- **Viagem entre estações = slerp da rotação + arco traçado durante a viagem + recolhimento da cauda.** É o gesto
  de "ir de onde estou para a próxima aula". Continuidade e chegada ao mesmo tempo (S6).

  | Parâmetro | Valor |
  |---|---|
  | Viagem | 1200 ms (≈ `AE.desenhoLongo`, já existente) |
  | Chegada | 250 ms |
  | Curva | Ease-in-out: o globo já está na tela e se desloca, é o caso certo para `AE.easing` |
  | Inclinação | Fixa, de 15–20°, para as ilhas não ficarem chapadas no equador visual |

- **O arco é o rastro.** Depois da chegada, o trecho percorrido fica desenhado em tinta, e o trecho futuro fica
  pontilhado. A chegada vira evidência visível de "percorrido" (S3), e não enfeite.
- **Quadro de referência parado (Apple).** A moldura, o graticulado externo e a legenda não giram.
- **Troca de projeção com propósito.** Globo (orientação) ↔ planisfério do percurso (visão do todo, 17 estações
  de uma vez) por mistura das funções brutas, em 750–900 ms e **sem rotação simultânea**. A rotação contínua do
  notebook é decoração.
- **Render Blender (A-r03/r04).** O globo gravado continua como imagem. A viagem pode ser feita:
  1. por sequência pré-renderizada: N quadros por aresta entre estações vizinhas, com a trava de GPU;
  2. por reprojeção em canvas da textura gravada, com `d3-geo`, que já está no `package.json`.

  A escolha é da rodada de globo. O mecanismo acima vale para as duas.

**Não transferir.**

- Rotação ociosa infinita (Linear e Apple: oscilação e loop ambiente).
- País ou estação destacados em vermelho (semáforo; terracota rara).
- Arrasto livre com inércia e "quique" nos limites (overshoot).
- Zoom com parallax de camadas.
- Globo decorativo à direita da Home sem função (§6, cópia do North Star).

---

## 2. Gramática de movimento proposta para a Alexandria

É uma proposta para o LYCEUM e o Founder decidirem. Nada foi escrito em `src/`. Os nomes seguem o `AE` atual, e
os novos estão marcados.

### 2.1 Durações

| Token | ms | Uso | Origem |
|---|---|---|---|
| `corte` *(novo)* | 0 | Troca de aba e de codificação, marca de termo, ação repetida | OWID, Emil, Rive (padrão 0) |
| `instante` *(novo)* | 100 | Feedback de controle (toggle, checagem registrada), cor de link | NN/g 100 ms, Linear 0.1s |
| `estado` | 150 | Troca de estado de UI (já existe) | M3 short3, Emil 150 |
| `hover` | 200 | Hover e foco (já existe) | motion.dev 160–200 |
| `entrada` *(novo)* | 280 | Painel ou verbete que aparece; bloco de abertura da aula | NN/g 200–300, Stripe 300 |
| `saida` *(novo)* | 200 | Saída = entrada − 80 | NN/g, M3 |
| `continuidade` *(novo)* | 400 | Elemento compartilhado nó → módulo, linha → verbete | M3 medium4, NN/g (distância grande) |
| `projecao` *(novo)* | 800 | Globo ↔ planisfério | d3 45 quadros ≈ 750 |
| `desenhoCurto` | 700 | Tique, traçado curto de consequência (já existe) | |
| `desenhoLongo` | 1200 | Viagem entre estações, trecho percorrido (já existe) | d3 world tour 1250 |
| `chegada` *(novo)* | 250 | Recolhimento da cauda do arco; data que aparece por último | d3 world tour, 2ª fase |

### 2.2 Curvas (todas com y₁, y₂ ∈ [0, 1], portanto sem overshoot)

| Token | cubic-bezier | Papel |
|---|---|---|
| `easing` (atual) | `(0.65, 0, 0.35, 1)` | Algo **já na tela** que se desloca: globo, mapa, arco |
| `entra` *(novo)* | `(0.16, 1, 0.3, 1)` | Algo que **aparece**: painel, verbete, cartão de conclusão. É a curva dominante no motion.dev e aparece no Brilliant, na Stripe e no Linear |
| `sai` *(novo)* | `(0.3, 0, 0.8, 0.15)` | Algo que **sai** (M3 emphasized accelerate), sempre com `saida` |
| `linear` | `linear` | Só contador (ticker) e traçado com velocidade constante percebida |

**Curvas medidas e reprovadas por overshoot:**

- `(0.175,0.885,0.32,1.275)` (60fps);
- `(0.45,1.45,0.8,1)` (changelog do Linear);
- qualquer mola com `bounce > 0`.

### 2.3 Orquestração dos três momentos pedidos

**Entrada de aula (C3: orientar antes de ler).** É uma chegada curta e não ocorre no retorno à mesma aula.

| t (ms) | O que acontece |
|---|---|
| 0 | O cabeçalho chega por elemento compartilhado a partir da estação ou do item do módulo (`continuidade` 400, `easing`) |
| 120 | O bloco "o que você vai fazer / por quê" entra (`entrada` 280, `entra`, só opacidade + 8px de Y) |
| 240 | O fio da posição (você está aqui) é desenhado no mini-percurso (`desenhoCurto` 700) |
| ≤ 940 | Repouso. O texto corrido **não anima**: leitura não é espetáculo |

Com movimento reduzido: tudo presente, e um único corte de opacidade de 150 ms no bloco de abertura.

**Conclusão de aula (`aula_concluida`).** Acontece no fluxo, sem modal, e o CTA "próxima" fica visível desde
t = 0 (Duolingo e Apple). Complementa F-C3 de `referencias-conquistas.md`.

| t (ms) | Camada | O que acontece |
|---|---|---|
| 0 | Evidência | A palavra de estado troca para "Concluído" (`corte`) e o glifo troca de silhueta (`estado` 150) |
| 150 | Evidência | O tique da aula é desenhado no anel do módulo (`desenhoCurto` 700, `easing`) |
| 150 | Evidência | Contador tabular "aulas percorridas: 3 → 4 de 9" (`linear`, 1 passo; só com contagem reconciliada) |
| 850 | Motivação | Se houver marco: o glifo viaja até o lugar do marco (`continuidade` 400) e a data aparece por último (`chegada` 250) |
| ≤ 1500 | | Repouso. Cancelável a qualquer momento: clicar em "próxima" salta para o estado final |

Com movimento reduzido: o estado final aparece no mesmo quadro, com as mesmas palavras e o mesmo número.

**Marco de módulo ou trilha percorridos (raro).** Só aqui cabe a viagem no globo:

1. o arco da última estação até o limite do território é traçado (`desenhoLongo` 1200 + `chegada` 250);
2. o território muda de estado.

É uma celebração tipográfica: o nome do módulo aparece em voz de identidade, sem escala nem partícula. Soma
≈ 2,0 s, abaixo dos ≈ 2,5 s do Duolingo, e não bloqueia.

### 2.4 Contrato de movimento reduzido (modelo motion.dev)

- **Some:** translate, scale, rotação do globo, traçado progressivo, troca de projeção interpolada e ticker.
- **Fica:** um corte de opacidade de ≤ 150 ms, que não é obrigatório.
- **É idêntico:** o estado final, as palavras, os números e o arco desenhado.
- **Verificação.** Filmstrip de ≥ 5 quadros nos dois modos (S6), e comparação do último quadro dos dois modos
  pixel a pixel na região de estado.

---

## 3. O que este estudo NÃO autoriza

- Adotar uma biblioteca (`motion` ou Rive): é uma decisão de dependência.
- Qualquer número de progresso sem evento real: "percorridas 3 → 4" exige progresso ligado ao front (§9).
- Estados de "com prática" ou "demonstrado" animados: `exercicio_respondido` e `instrumento_usado` não são
  emitidos, e Demonstrado não tem tarefa portadora.
- "Aprovado", "Dominado", "Excelente", "Amazing" em qualquer celebração (P18, D2).
- Aprovar qualquer movimento descrito aqui por screenshot. As durações são alvo; a prova é o filmstrip.

---

## 4. Verificações que saem deste estudo

1. **Portão de curva (automatizável).** Rejeitar `cubic-bezier` com y₁ ou y₂ fora de [0, 1] e `spring` com
   `bounce > 0` em `src/components/alexandria` e `src/design/alexandria-tokens.ts`.
2. **Portão de loop.** Rejeitar `animation-iteration-count: infinite` sem guarda de reduced-motion. O anti-exemplo
   medido é a home do Linear, com 101 loops sob reduce.
3. **Medição de reduced-motion.** `document.getAnimations().length` com reduce deve ser 0 em repouso.
4. **Duração por vídeo.** Usar o mesmo harness deste estudo (`medir_movimento.cjs` + detector de cena do
   ffmpeg), sabendo do jitter de ±33 ms.

---

## Fontes

**Abertas e medidas nesta rodada:**

- https://motion.dev/
- https://motion.dev/docs/react-layout-animations
- https://motion.dev/docs/react-accessibility
- https://60fps.design/
- https://60fps.design/shots/duolingo-lesson-complete-head-explode-animation
- https://rive.app/
- https://rive.app/docs/editor/state-machine/state-machine
- https://rive.app/docs/editor/state-machine/transitions.md
- https://rive.app/docs/editor/data-binding/migration-guide.md
- https://rive.app/docs/editor/data-binding/property-types.md
- https://rive.app/blog/how-brilliant-org-motivates-learners-with-rive-animations
- https://developer.apple.com/design/human-interface-guidelines/motion (via `developer.apple.com/tutorials/data/design/human-interface-guidelines/motion.json`)
- https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/MotionTokens.kt (M3; a página m3.material.io não renderiza sem JS)
- https://emilkowal.ski/ui/great-animations
- https://emilkowal.ski/ui/you-dont-need-animations
- https://animations.dev/
- https://www.nngroup.com/articles/animation-duration/
- https://linear.app/
- https://linear.app/changelog
- https://linear.app/now/invisible-details
- https://stripe.com/
- https://stripe.com/blog/connect-front-end-experience
- https://brilliant.org/
- https://blog.duolingo.com/streak-milestone-design-animation/
- https://ourworldindata.org/grapher/share-elec-by-source
- https://observablehq.com/@d3/world-tour (fonte via `api.observablehq.com/@d3/world-tour.js`)
- https://observablehq.com/@d3/orthographic-to-equirectangular (fonte via API)
- https://observablehq.com/@d3/projection-transitions (fonte via API)
- https://github.com/reuters-graphics/example_svelte-graph-patterns (listagem via API do GitHub)

**Só busca (pista, não prova):**

- https://rive.app/blog/creative-technologists-duolingo-s-solution-to-the-designer-to-developer-handoff
- https://github.com/KoGor/Orthographic-to-Equirectangular
