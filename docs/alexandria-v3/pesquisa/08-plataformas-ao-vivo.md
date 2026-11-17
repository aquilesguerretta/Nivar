# 08 — Plataformas abertas e operadas ao vivo

Data: 14/11/2026. Pedido do Founder: estudar pelo menos 30 plataformas
**entrando nelas** — navegar, passar o mouse, clicar, rolar e medir no
navegador (estilo computado, transições, elementos fixos) — e não só olhar
captura. Foco: a vibe A (biblioteca viva, erudito e quente), animações e
interações que sustentem imersão, e **a melhor tela para trilhas e módulos**.

Método por plataforma: abrir no Chrome a 1568×752, operar pelo menos uma
interação real (hover, clique, expandir, rolar), e rodar uma sonda de JS que
lê fonte/corpo/entrelinha dos títulos, transições declaradas (propriedade,
duração, curva) e elementos `sticky`/`fixed`. O que está em "medido" saiu da
sonda; o que está em "visto" saiu da operação.

---

## 1. Stripe Press — press.stripe.com

- **Medido.** Fundo `rgb(32,24,25)`. Uma família só (Ivar Headline), 16–17,6 px,
  tracking +0,32 px. 2 `<canvas>` (livros em WebGL). Transições: opacidade
  0,2–0,5 s `ease`, transform 0,3–1 s, uma `cubic-bezier(0.4,0,0.2,1)` 0,35 s.
  Oito camadas `fixed` (fundo, filme, canvas, descrição).
- **Visto.** O índice é uma **régua de traços na margem esquerda — um traço por
  livro**; passar o mouse num traço revela o título ao lado e engrossa o traço.
  Hover no livro: ele avança e alarga. Clique: o livro gira de lombada para
  capa e a ficha (título, autor, sinopse, compra) entra ao lado; a régua vira
  "voltar + posição".
- **Para a Alexandria.** A régua é um índice de 141 itens que não ocupa
  espaço: um traço por aula, agrupado por módulo, com nome no hover. O objeto
  (o livro) é o protagonista; a interface recua.

## 2. Franco Maria Ricci Editore — francomariaricci.com

- **Medido.** Bodoni Seventytwo ITC (Book e Book Italic) para tudo que é
  conteúdo: 42 px no destaque, 22 px na marca, 16–18 px nos rótulos.
  **Arial 12 px caixa alta** para dado técnico (páginas, formato, coleção).
  Transições: `color/background/border 0,5 s cubic-bezier(0,0,0.2,1)`,
  `transform 0,5 s`, `opacity 0,3–0,5 s` — uma curva só, desacelerando.
- **Visto.** Grade de três células com fio de 1 px, paginação "1/3" em itálico
  na esquerda, abas "NOVITÀ / BEST SELLERS" no centro. **Hover numa célula:**
  o fundo tinge (sálvia) em 0,5 s e aparecem metadados **nas quatro bordas**
  — título no alto, nº de páginas e formato em texto vertical nas laterais,
  coleção embaixo. O livro em si não se mexe.
- **Para a Alexandria.** É o cartão de módulo: em repouso, só o objeto e o
  número; no hover, o colofão aparece nas bordas — `9 aulas · 6 instrumentos ·
  38 termos · 4–6 h` — sem empurrar layout.

## 3. Khan Academy — khanacademy.org/science/physics

- **Medido.** Lato 36/20/16 px, peso 700 nos títulos. Três elementos
  `sticky`: cabeçalho (62 px), **índice de unidades à esquerda (405×970)**,
  e um controle de 24 px. Transições quase só de borda/sombra a 0,1 s.
- **Visto.** Índice "UNIT 1…4" fixo à esquerda; à direita, um cartão por
  unidade com os tópicos em duas colunas e cada aula com ícone de tipo.
  Clicar no índice rola até a unidade.
- **Para a Alexandria.** A estrutura (índice fixo + unidades rolando) é a
  mesma do bloco "Uma casa. Cinco formas de investigar." da NIVAR — confirma
  o padrão. O que a Khan não tem: identidade nenhuma; é planilha.

## 4. MasterClass — página de curso (Neil deGrasse Tyson)

- **Medido.** Fundo `#000`. Söhne 32/40 px 600 nos títulos, 14 px no rótulo do
  plano de aulas. 1 `<video>`. Transições: `background, box-shadow 0,25 s`
  (×27), `transform 0,2 s` (×21), uma mola `cubic-bezier(0.29,1.185,1,1)` 0,3 s.
- **Visto.** Herói = retrato cinematográfico do professor numa biblioteca
  (globo, abajur, livros) — fotografia, não ilustração. "Class Trailer" e
  "Class Sample" tocáveis. **Plano de aulas em sanfona**: número + título;
  abrir mostra a duração ("14:13") e uma sinopse de 3–4 linhas. Metadado do
  curso: "13 video lessons (2 hours 14 minutes)".
- **Para a Alexandria.** A sanfona com sinopse é o jeito certo de mostrar 9
  aulas sem abrir 9 páginas. O trailer jogável é o que faz "querer voltar";
  para nós, o equivalente é o instrumento jogável no próprio índice.

## 5. Brilliant — brilliant.org/courses → Derivatives

- **Medido.** Fonte própria (CoFo Brilliant) 24/20/16 px. Transições curtas:
  `transform 0,2 s` (×16), `background/border 0,15 s`, `opacity 0,15 s ease-in`.
- **Visto.** Lista de tópicos; o chevron expande uma **cadeia horizontal de
  cursos ligados por fio**, cada um com ilustração e série. A página do curso
  tem **cartão fixo à esquerda** ("70 Lessons · 1209 Exercises") e, à direita,
  um caminho em zigue-zague de fichas 3D agrupadas por **nível com cabeçalho
  grudado no topo**; a ficha atual brilha e abre um balão "Start"; a
  checagem de nível tem silhueta diferente (borda serrilhada).
- **Para a Alexandria.** A mecânica que vicia é: *um lugar só onde você está*,
  *um botão só para continuar*, *a checagem com forma própria*. A pele (fichas
  3D, azul elétrico) é exatamente o que o contrato proíbe (§6, "cores e
  ilustração do Brilliant").

## 6. Refero (refero.design) — como fonte

Busca de estilos ("Cream & serif", "Editorial magazine", "Huge serif
headlines", "Quiet luxury", "library archive", "museum classical art") e de
telas ("course curriculum modules", "table of contents chapters"). Utilidade
real: **descobrir** os sites certos (Franco Maria Ricci veio daqui). As telas
de currículo do Refero são esmagadoramente LMS genérico (Teachable, Udemy,
Skillshare) — servem de contraexemplo.

## 7. Works in Progress — worksinprogress.co

- **Medido.** Fundo creme `rgb(255,247,244)`. Títulos em Editor Bold 28/32 px;
  marca e rótulos em GT America Mono Light. Transições `all 0,15 s ease-in-out`
  em 920 elementos — curtas e uniformes; `transform 0,5 s` nas imagens.
- **Visto.** Cada artigo tem **uma colagem própria** como herói, com um bloco de
  cor sobreposto à imagem (título, "Words by", linha fina, categoria). O menu
  "Issues" abre uma lista seca de edições.
- **Para a Alexandria.** Identidade por ilustração encomendada por peça, não
  por moldura. O bloco sobreposto à imagem é a forma de pôr o título do módulo
  na gravura sem cartucho.

## 8. Lapham's Quarterly — laphamsquarterly.org

- **Medido.** Adobe Caslon Pro 83 px +20 px de tracking na marca, 42 px nas
  seções; Freight Sans na interface. Transições caras: `all 0,5 s
  cubic-bezier(0.19,1,0.22,1)` (expo-out) ×56, opacidade 1,2 s.
- **Visto.** A edição corrente chama-se **ENERGY** (vol. XV, nº 2). Cartões
  rosados com rótulo de gênero (PREAMBLE, ESSAY), botão "DONATE" com sombra,
  ícones de rede social. O recurso "Déjà vu" justapõe um fato de 2023 a um de
  c. 1850 — um aparato editorial forte.
- **Para a Alexandria.** Contraexemplo de pele (lê como 2014: sombra, cartão
  rosado, caixa alta espaçada em tudo) e exemplo de conteúdo (justaposição
  histórica como aparato).

## 9. Quanta Magazine — quantamagazine.org

- **Medido.** Noe Display 45 px nos títulos, Pangram na interface.
  Transições `color/opacity 0,2 s ease-in-out` — uniformes.
- **Visto.** Herói = **ilustração científica 3D encomendada** (membrana celular)
  em tela cheia, sob a navegação escura.
- **Para a Alexandria.** O 3D encomendado como assinatura de seção. Para
  energia: a usina, a rede, a turbina — renderizadas, não clip-art.

## 10. Aeon — aeon.co

- **Medido.** Aeon Serif 72/72 px 600 no herói; sans 20/28; mono 18 px +2 px
  nos rótulos. Uma curva só: `0,3 s cubic-bezier(0.4,0,0.2,1)` (×178).
- **Visto.** Foto emoldurada dentro de outra imagem no herói; cartões de
  ensaio com selo de áudio/vídeo.
- **Para a Alexandria.** Três vozes tipográficas (serifa · sans · mono) com
  papéis fixos — o mesmo trio da NIVAR (Newsreader · Instrument Sans · Plex Mono).

## 11. Our World in Data — grapher "Electricity mix"

- **Medido.** Playfair Display 32/25 px nos títulos; Lato 13–16 px na fonte e
  nas notas. Transições quase nulas (0,1–0,25 s).
- **Visto.** Abas Table / Map / Line; seletores de fonte, métrica e frequência;
  linha do tempo 1920–2025 com play; lista lateral de países ordenável com
  busca. **Hover no mapa:** cartão com país, ano, valor (47,86%) e uma
  mini-série — e uma nota de método quando o dado é estimado. "Data source:
  Ember (2026)…" logo abaixo do gráfico.
- **Para a Alexandria.** Anatomia do instrumento: controle → leitura → **fonte
  colada** → nota. O hover que mostra a série do item é o modelo do "previsto ×
  calculado" do instrumento.

## 12. Bartosz Ciechanowski — ciechanow.ski/bicycle

- **Medido.** IBM Plex Sans 19,2/30,72 px numa coluna de 704 px; 118
  `<canvas>` — um por demonstração.
- **Operado.** Arrastei o controle de força: a caixa respondeu na hora (seta
  de força, velocímetro), com botão de reiniciar. **A palavra "force" no texto
  tem a cor do controle** — o leitor sabe o que mexe o quê sem legenda.
- **Para a Alexandria.** O vínculo por cor entre a variável na prosa e o
  controle no instrumento. Resposta imediata, sem botão "calcular".

## 13. Exercism — exercism.org/tracks/python/concepts

- **Visto.** "Your journey through Python": grafo de 17 conceitos em cartões
  ligados por curvas tracejadas; progresso por bolinhas de exercício.
- **Para a Alexandria.** Confirma o diagnóstico da pesquisa: o grafo dá forma,
  mas esconde a aula. Não é o modelo.

## 14. Microsoft Learn — trilha "Get started with C#"

- **Visto.** "At a glance" (nível, papel, produto), pré-requisitos, "Start".
  Cada módulo: ícone circular, "35 min • Module • 8 Units", selo "900 XP",
  "Overview" que abre as unidades com tempo por unidade sobre um **fio vertical**.
- **Para a Alexandria.** Metadado por módulo útil (tempo, unidades); o fio
  vertical por unidade é um indicador de progresso que não é semáforo. O XP
  ao lado do módulo é exatamente o que o S3 proíbe misturar.

## 15. Mathigon — mathigon.org/courses

- **Medido.** Source Sans Pro. `stroke-dasharray 0,2 s` ×70 (anéis de progresso),
  `background 0,2 s` no hover.
- **Visto.** Cada curso é uma linha com ícone e **todos os capítulos visíveis**,
  cada um com um anel de progresso; capítulos ainda não escritos aparecem em
  cinza com ícone de ferramenta. Hover pinta o fundo do capítulo.
- **Para a Alexandria.** É o melhor modelo encontrado para "módulo com todas as
  aulas à vista": nada escondido, estado por silhueta (anel), e **ausência
  honesta** ("em construção") na mesma lista.

## 16. Coursera — "Supervised Machine Learning"

- **Visto.** Sanfona por semana ("33 hours to complete"); ao rolar até o
  plano, um **modal de promoção** cobre a página e um chat lateral abre sozinho.
- **Para a Alexandria.** Contraexemplo: interrupção comercial no meio do
  conteúdo; tempo agregado sem método.

## 17. Seeing Theory — seeing-theory.brown.edu

- **Visto.** Abertura com anel de partículas coloridas animado. Capítulos em
  carrossel (um por vez, abas no topo, setas laterais); as seções do capítulo
  são cartões cuja **miniatura é o próprio gráfico** da seção.
- **Para a Alexandria.** A miniatura do instrumento como índice da aula.

## 18. Josh W. Comeau — "A Friendly Introduction to Spring Physics"

- **Visto.** Índice lateral fixo com **scrollspy** (a seção atual acende),
  interruptor de som da interface, contador de curtidas com coração, animações
  com mola. (Não cliquei no coração: grava num servidor público.)
- **Para a Alexandria.** Microinteração com física de mola nos controles, e
  som opcional de interface (desligado por padrão).

## 19. Kinfolk — kinfolk.com

- **Medido.** Kinfolk Serif Deck 50/52 px com **tracking −0,5 px**. Revelação
  por opacidade 0,5–1,2 s `cubic-bezier(0.25,1,0.5,1)` (expo-out) ao rolar.
- **Visto.** A edição como objeto centralizado ("ISSUE 61 / THE PLAY ISSUE"),
  "Buy | Read" logo abaixo.

## 20. Monocle — monocle.com

- **Medido.** Plantin 32/20 px. Transições 0,2–0,4 s.
- **Visto.** Ilustrações a tinta como vinhetas de seção (o cachorro com a
  carta, a estante) — identidade por desenho de mão, não por moldura.
  Recusei os cookies opcionais.

## 21. Wellcome Collection — wellcomecollection.org

- **Medido.** Fonte própria (Wellcome) 35/29 px com tracking −0,5 px; fundo
  `rgb(250,251,247)`; transições 0,15–0,4 s.
- **Visto.** Etiqueta de tipo em cor ("Exhibition") sobre o cartão; foto de
  galeria real.

## 22. Getty — getty.edu

- **Medido.** Graphik 32/24 px com tracking negativo; transições de sublinhado
  0,195 s ×149.
- **Visto.** Foto clássica (Villa, estátua) em tela cheia com marca geométrica
  moderna por cima. **É a estratificação**: o clássico mora na imagem, o
  moderno no sistema.

## 23. Duolingo — duolingo.com

- **Medido.** 2 animações vivas na dobra; botões com borda inferior que afunda
  no clique (`border-color, transform 0,3–0,4 s cubic-bezier(0.22,1,…)`).
- **Visto.** Ilustrações de personagem que **ganham vida ao entrar na tela**
  (a coruja muda de pose entre duas capturas).
- **Para a Alexandria.** O botão "táctil" que afunda é a microinteração mais
  imitada de produto de hábito. O mascote e o verde são proibidos (§6).

## 24. Linear — linear.app

- **Medido.** Inter Variable 64 px com **tracking −1,41 px**; 84 animações vivas
  dentro da captura do produto (demonstração, não print). `color 0,1 s` ×216;
  painéis com `transform 0,7 s cubic-bezier(0.32,0.72,0,1)` (curva de gaveta iOS).
- **Para a Alexandria.** Latência como modernidade: hover a 0,1 s, painel a
  0,7 s com mola amortecida. A curva de gaveta para abrir um módulo.

## 25. The Pudding — pudding.cool

- **Visto.** Histórias **numeradas** (#229) e datadas; a miniatura é o próprio
  gráfico da peça; navegação com ícones desenhados à mão.
- **Para a Alexandria.** Numerar dá peso de coleção (M01·A08 já é isso).

## 26. Asimov Press — asimov.press

- **Visto.** Abre com convite de assinatura (Substack) por cima — não
  assinei; "No thanks" existe. Uma ilustração-assinatura (hélice), Playfair 24 px.

## 27. Noema — noemamag.com

- **Medido.** Eksell Display 78/97,5 px +1,25 px; `all 0,15 s linear` ×650.
- **Visto.** Foto documental em tela cheia com título centralizado por cima.

## 28. Boot.dev — boot.dev/courses

- **Visto.** Catálogo comum (estrelas, nº de aulas, horas, data) vestido de RPG
  medieval: pergaminho escuro texturizado, logotipo ornamentado, música.
- **Para a Alexandria.** Contraexemplo exato do risco da vibe A: o erudito
  vira fantasia quando a ornamentação mora na interface e não no conteúdo.

## 29. Scrimba — "Learn HTML and CSS"

- **Visto.** Módulos como **linha do tempo vertical** em tipo grande, cada um
  com "0/9" desafios e minutos; o último nó é o certificado em dourado.
- **Para a Alexandria.** O contador "feito/total" por módulo ao lado do título;
  a linha vertical liga os módulos sem virar mapa.

## 30. Apple — Apple Vision Pro

- **Medido.** 26 `<video>`, 9 `sticky`; `color 0,32 s cubic-bezier(0.4,0,0.6,1)`
  ×229; `opacity, transform 0,22–0,32 s`.
- **Visto.** Texto que entra **amarrado à rolagem** sobre vídeo desfocado.
- **Para a Alexandria.** A apresentação da Home (pré-cadastro) que termina no
  vídeo: rolagem controla a narrativa, vídeo como fecho.

## 31. The Public Domain Review — publicdomainreview.org

- **Medido.** Alegreya 32 px; 6 elementos com `box-shadow`.
- **Visto.** Gravuras de arquivo excelentes dentro de caixas, barra lateral
  emoldurada, faixa de loja, fileira de ícones sociais. Recusei os cookies.
- **Para a Alexandria.** Confirma a pesquisa: acervo mais parecido com o
  nosso, e a pior apresentação — a gravura encaixotada perde a força.

## 32. NYT Games — nytimes.com/crosswords

- **Medido.** nyt-karnak 26 px; quase nenhuma transição.
- **Visto.** O hábito diário em **três tamanhos** (The Crossword, The Midi, The
  Mini), cada cartão com data, autor e editor; hover carimba "Subscribe".
- **Para a Alexandria.** A revisão do dia em tamanhos (≈2 · 5 · 10 min), datada
  e assinada pela fonte.
