# Eixo 7 — Movimento e detalhe

**Pergunta do eixo.** "Moderno" raramente é estática: é o que acontece quando
se toca. Este documento mede o que os melhores produtos realmente fazem quando
o leitor toca, e deriva daí o vocabulário mínimo de movimento da Alexandria v3
— mais a lista do que parece moderno e é só barulho.

**Resposta curta, para quem lê só isto.** Nos produtos que de fato se sentem
modernos, o movimento quase não existe: a mediana da transição é **100–200 ms
de cor**, a caixa **não muda um pixel** no hover, o estado troca em **corte**, o
foco aparece em **corte**, a consulta aparece em **corte**, e a figura que
ensina **não se mexe sozinha**. O que esses produtos têm e os ruins não têm não
é mais animação — é **latência**: a resposta chega no quadro seguinte ao toque.
Para a Alexandria isso é uma boa notícia, porque **um herói gravado é um objeto
imóvel por natureza**, e a modernidade que o Founder pediu não mora em fazer o
Titã se mexer; mora em tudo o mais responder em 100 ms.

---

## 1. Método — e o que isto NÃO é

Chrome do sistema dirigido por `playwright-core` isolado no scratchpad (o
fallback que `CLAUDE.md` registra como o que funciona), viewport 1440×900.
**41 URLs abertas de verdade**, nenhuma descrita de memória. Três instrumentos,
em ordem de força da prova:

1. **Estilo computado varrido** em até 4 000 elementos por página — histograma
   de `transition-duration`, `transition-timing-function`, `transition-property`,
   nomes de `@keyframes`, animações infinitas, `view-transition-name`; e
   varredura das folhas (blocos `prefers-reduced-motion`, `animation-timeline`,
   `::view-transition`).
2. **A mesma varredura repetida sob `prefers-reduced-motion: reduce`.** A prova
   é **a diferença entre os dois**, nunca a presença de um `@media` na folha —
   folha de terceiro domínio não abre, e três produtos que "não tinham" bloco
   respeitam a preferência de verdade.
3. **Amostragem por `requestAnimationFrame` durante uma interação real** —
   `transform`/`opacity` do elemento, ou assinatura de pixel do `<canvas>`, ou
   assinatura dos atributos do `<svg>`, quadro a quadro. É isto que separa
   **corte** (uma mudança) de **interpolação** (dezenas num intervalo), e é a
   única forma honesta de afirmar "isto anima" ou "isto não anima".

Evidência bruta e legenda do que cada arquivo prova:
`docs/alexandria-v3/pesquisa/capturas/07-movimento/` (43 pastas de produto,
66 JSON, 151 PNG, `README.md` com a prova de cada um).

**Correção de escala.** A máquina roda a 175 % e o Chrome devolve comprimento
computado dividido por ≈1,785: `1.68067px` no JSON é **3 px** reais. Duração e
curva não são afetadas. Os comprimentos citados aqui já estão normalizados.

**O que não foi aberto, declarado.** Linear dentro do app, Arc o navegador
(o site hoje é a página de despedida), Family o app de iOS, Readymag o editor,
Notion e Figma dentro do produto — tudo com login ou fora do navegador. Só as
superfícies públicas entraram. A demo do **cmdk** redireciona para o
repositório e **não foi medida**. A animação de parâmetro do **Desmos** tem a
afordância confirmada pelo rótulo acessível ("Play a Animation") mas **não foi
medida**. Nada disso virou afirmação neste documento.

---

## 2. O retrato medido

Duração dominante (nº de elementos), curva dominante, e o que de fato
transiciona. Ordenado por quanto o produto se parece com o problema da
Alexandria.

| Produto | Duração dominante | Curva dominante | Propriedades que mais transicionam | Movimento reduzido |
|---|---|---|---|---|
| **Ciechanowski** (gears) | 0,15 s (49) | `ease` | só `color` e `opacity` | — (0 animação rodando) |
| **OWID grapher** | 0,15 s (3) · tooltip **0 s** | `ease` | `color`, `transform` | 12 blocos |
| **Desmos** | 0,3 s (11) | `ease` | `opacity`, `color` | 3 blocos |
| **The Pudding** | 0,1 s (**1 transição na página inteira**) | `ease-out` | `all` | — |
| **Distill** | 0,2 s (**1**) | `ease-in` | `opacity` | — |
| **Observable Framework** | 0,15 s (**1**) | `ease` | `top`, `height` | — |
| **PhET** | **0 transições** (simulação em canvas) | — | — | — |
| **Stripe docs** | 0,1 s (48) | — | `color` | folha fechada |
| **Linear** | **0,1 s (284)**, 0,16 s (93) | `cubic-bezier(0.25,0.46,0.45,0.94)`; declarada `cubic-bezier(0.32,0.72,0,1)` | `color` (294), `transform` (58) | 49 blocos — **mas 150 animações infinitas sobrevivem** |
| **Vercel** | 0,1 s (80), 0,15 s (52) | `cubic-bezier(0.4,0,0.2,1)` | `color`, `background-color`, `border-color` | 31 blocos |
| **Geist** (DS da Vercel) | 0,2 s (38), 0,15 s (27) | `cubic-bezier(0.4,0,0.2,1)` | `color`, `all` | 3 blocos |
| **shadcn/ui** | 0,15 s (201) | `cubic-bezier(0.4,0,0.2,1)` | `width`, `height`, `padding` (lateral) | 8 blocos |
| **Stripe** | 0,3 s (643) | `cubic-bezier(0.25,1,0.5,1)` | `color`, `opacity`, `transform`, `fill` | **736 → 193** sob reduce |
| **Apple** (MacBook Pro) | **0,32 s (269)**, 0,24 s (151) | `cubic-bezier(0.4,0,0.6,1)` (simétrica) | `opacity` (274), `transform` (251) | **nenhuma diferença medida** |
| **Emil Kowalski** (ensaio) | 0,15 s (24, a página inteira) | `cubic-bezier(0.4,0,0.2,1)` | `opacity`, `color` | 3 blocos |
| **Rauno Freiberg** | 0,15 s (20), 0,2 s (12) | `ease-in-out` | só `opacity` | — |
| **Paco Coursey** | 0,24 s (13) | `ease` | só `text-decoration-color` | entrada de 0,6 s **só** sob `no-preference` |
| **Vaul** (gaveta) | **0,5 s** | `cubic-bezier(0.32,0.72,0,1)` | **só `transform`** | — |
| **Sonner** (aviso) | 0,4 s / 0,2 s | `ease` | `transform`, `opacity`, `height`, `box-shadow` | 1 bloco |
| **Josh Comeau** | 0,25 s (92) | `ease` | `opacity`, `stroke`, `transform` | 28 blocos · 22 regras de linha do tempo de rolagem |
| **motion.dev** | 0,15 s (139), 0,2 s (76) | `ease`, `cubic-bezier(0.16,1,0.3,1)` | `color`, `border-color`, `opacity` | 15 blocos |
| **Arc** (despedida) | 0,7 s (38), 0,2 s (21) | `cubic-bezier(0.16,1,0.3,1)` | `opacity`, `rotate`, `translate` | **`--move: 0s`**, um token só |
| **Family** | 0,2 s (193), 0,1 s (94), **1 s (56)** | `cubic-bezier(0.19,1,0.22,1)` | **`all` (120)**, `opacity`, `transform`, `box-shadow` | **nenhuma diferença medida** |
| **Cosmos** | 0,4 s (61), 0,15 s (43) | `cubic-bezier(0.4,0,0.2,1)` | `scale`, `translate`, `rotate` | **992 transições em `1e-05s`** — interruptor global |
| **Raycast** | 0,2 s (580), **0,4 s (481)** | `cubic-bezier(0.23,1,0.32,1)` | `color`, `transform`, `opacity`, `box-shadow` | 13 blocos |
| **Stripe Press** | 0,1 s (225), 0,3 s (163), 0,4 s (150) | `ease`, `ease-out` | `transform` (324) | folha fechada |
| **Readymag** | 0,2 s (68) | `ease` | `opacity` (85) | — |
| **Figma** | 0,18 s (91) | `ease-out` | `transform`, `opacity` | 3 blocos |
| **Notion** | 0,2 s (103) | `cubic-bezier(0.42,0,1,1)` | `background-color`, `color` | 24 blocos · 45 regras de rolagem |
| **Rive** | 0,15 s (140) | `ease` | `color`, `opacity` | 12 blocos · 32 `<canvas>` |
| **GitHub** | **0,08 s (177)** | `cubic-bezier(0.33,1,0.68,1)` | `background-color`, `border-color` | **142 blocos** · 44 regras de rolagem |
| **60fps.design** | 0,15 s (352), 0,5 s (192) | **`cubic-bezier(0.175,0.885,0.32,1.275)`** (com ultrapassagem) | `opacity`, `background`, `transform` | — |
| **Observable Plot** | 0,25 s (150) | `ease-out` | `transform`, `filter` | 6 blocos |
| **Brilliant** | **0,75 s (80)**, 0,3 s (38) | `cubic-bezier(0.22,1,0.36,1)` | `all` (41), `transform`, `box-shadow` | 80 → 0 sob reduce |
| **Mathigon** | **0,2 s (843)**, 0,6 s, 0,8 s | `ease` | `background` (301), `opacity` (239) | **nenhuma diferença medida** |
| **GeoGebra** | 0,25 s (19) | `ease` | `background-color`, **`height`, `width`** | — |
| **Duolingo** (web) | 4 transições na página inteira | `ease` | `transform` | — |

Três leituras saltam da tabela.

**(a) A moda é 100–200 ms, e é cor.** Linear, Vercel, GitHub, Stripe docs,
Figma, motion.dev, Emil, Rauno, Ciechanowski: a propriedade mais transicionada
em quase todo produto sério é `color`, em 80–200 ms. O "movimento" dos produtos
modernos é, numericamente, **quase todo mudança de cor em um décimo de segundo**.

**(b) Quanto mais o produto ensina, menos a interface se mexe.** The Pudding,
Distill, Observable Framework: **uma** transição na página inteira. PhET: zero.
Ciechanowski: trinta `<canvas>` e **zero animações rodando**. Onde o conteúdo é
a prova, a interface fica parada e o movimento vive **dentro da figura**, sob a
mão do leitor.

**(c) Onde há mais movimento, é marketing.** Raycast (481 elementos a 0,4 s),
Brilliant (80 a 0,75 s), Family (56 a 1 s), 60fps.design (curva com
ultrapassagem em 128 elementos). São páginas de venda, e a Alexandria não é uma
página de venda.

---

## 3. Nove mecanismos, medidos

### M-1 · Hover é cor; a caixa não se mexe

Medido com a caixa antes e depois do ponteiro entrar:

- **Linear**: `color` `#8A8F98` → `#F7F8F8`, fundo → `rgba(255,255,255,0.08)`,
  `0.1s`, `transition-property: color, background`. **`boxDelta: [0, 0]`**.
- **Stripe**: `color` `#533AFD` → `#2E2B8C`, `transition-property: opacity`,
  `0.24s`. **`boxDelta: [0, 0]`**.

Nenhum dos dois escala, translada, sublinha animado ou "levanta" o controle.
A regra `hover` da v2 ("só cor e fio, sem deslocar a seta, sem escala") está
**confirmada por medição em dois produtos de referência**, e não era óbvia: é
exatamente o oposto do que a maioria dos templates faz.

### M-2 · O foco aparece em corte, com 3 px e afastamento real

Quarta parada de Tab, em cinco produtos (valores normalizados):

| Produto | Anel | Afastamento | Transição do elemento |
|---|---|---|---|
| Family | 3 px sólido | 1 px | `none / 0s` |
| Arc | 3 px branco | 3 px | `background-color 0.15s` |
| motion.dev | 3 px sólido | 7 px | `all / 0s` |
| Apple | 3 px azul `#0071e3` | **−12 px** (anel por dentro) | `color 0.32s` |
| shadcn | 5 px | 1 px | — |

**Em nenhum deles o anel de foco anima.** Ele aparece e some em corte. O
detalhe moderno aqui não é movimento: é **espessura e afastamento**, e a
decisão da Apple de desenhar o anel por dentro quando o controle encosta na
borda da tela.

### M-3 · O gesto é 1:1, sem curva; só a soltura anima

A medição mais limpa do eixo, no Vaul (a gaveta do Emil Kowalski):

- **Abertura:** `transform: translateY(826px → 0)`, `transition-property:
  transform` e **nada mais**, `0.5s`, `cubic-bezier(0.32, 0.72, 0, 1)`. A
  cortina é `rgba(0,0,0,0.4)` com **`backdrop-filter: none`**.
- **Durante o arrasto:** `translateY` 30 → 70 → 110 → 150 px, **exatamente o
  deslocamento do ponteiro**, com `transition-property: none` — a transição é
  **removida** enquanto o dedo está na tela e devolvida na soltura.

Esse é o mecanismo que faz um componente "parecer físico" sem mola nenhuma:
**enquanto você toca, não existe animação; existe acompanhamento.** A curva só
entra para terminar o que a mão começou.

O mesmo mecanismo aparece no Desmos: arrastando o cursor do parâmetro, `a` vai
1,24 → 1,47 → 1,70 → 1,94 → 2,18 → 2,40 → 2,65 → 2,90 → 3, um valor por quadro
de arrasto, com a parábola redesenhada junto.

### M-4 · A figura que ensina não se mexe sozinha

- **Ciechanowski**: 30 `<canvas>` na página e **`document.getAnimations().length
  === 0`** em repouso. A referência máxima de "movimento que ensina" **não tem
  uma animação declarativa rodando**.
- **Desmos**: trocar `a` por código para −3 produz **uma única** mudança de
  pixel, aos 158 ms. Mudança de valor **não interpola**: redesenha.
- **OWID**: a animação contínua existe, mas atrás de um botão **"Play
  time-lapse"**, e é **discreta**: 32 mudanças em 3 648 ms, com passos de
  **~110 ms** (368, 492, 612, 709, 814, 925, 1036…). Um estado de dado por
  passo. Nada interpola entre dois anos.
- **Desmos** repete o padrão com um controle rotulado **"Play a Animation"** no
  cursor.

Dois instrumentos independentes, construídos por gente que vive disso,
convergem na mesma regra: **mudança contínua de parâmetro é opt-in, acionada
pelo leitor, e discreta; mudança de valor é corte.**

### M-5 · A consulta é corte

O tooltip do OWID — que traz o ano, **todas as séries com unidade e o Total** no
ponto apontado — tem `transition: all | 0s`. Aparece sem fade. Num produto onde
o leitor vai consultar centenas de vezes, **fade é imposto de 150 ms por
consulta**, e eles não cobram.

Isto governa diretamente os **2 124 termos de glossário** da Alexandria.

### M-6 · Navegar acervo grande é corte com moldura parada — ou um elemento
compartilhado nomeado

- **Stripe docs**, clicando um item da lateral: **0 chamadas** de
  `startViewTransition`, 101 mutações entre 115 e 665 ms, **0 animações
  rodando**, rolagem zerada. O item ativo é `color` + `font-weight: 600`, com
  `color` em `0.1s`. **A orientação vem da lateral que não se mexe.**
- **shadcn**: igual — 0 transições de view, 27 mutações entre 342 e 468 ms.
- **Josh Comeau**: o oposto, e também funciona. `document.startViewTransition`
  **chamado 1 vez** na navegação (instrumentado antes do clique), e o cabeçalho
  leva `view-transition-name: site-header`. **Um** elemento nomeado atravessa; o
  resto cruza. A moldura fica, o conteúdo troca.
- **Linear** declara 6 regras `::view-transition` e, na navegação medida,
  **não chamou** a API. Regra declarada não é transição acontecendo.
- **Cosmos** usa a forma declarativa entre documentos (`@view-transition`), e
  **desliga-a sob movimento reduzido** (`@view-transition { navigation: none; }`).

Para 141 aulas, há exatamente **dois caminhos legítimos**, e os dois estão
medidos: moldura imóvel com corte, ou **um** elemento compartilhado nomeado.
O que não existe em produto bom é o terceiro caminho — animar a página inteira a
cada clique.

### M-7 · Movimento reduzido: quem respeita, medido pela diferença

| Produto | Normal → reduzido | Veredito |
|---|---|---|
| **Cosmos** | 137 → **992 transições, todas em `1e-05s`**; infinitas 3 → 0; view transition desligada | Interruptor global. O padrão completo. |
| **Stripe** | 736 → 193 elementos com transição | Respeita (e a folha nem abria para varredura) |
| **Brilliant** | 80 animações de 0,75 s → 0 | Respeita |
| **Arc** | `--move: 0s` + `transition: none` | Respeita, com **um token só** |
| **Paco Coursey** | entrada de 0,6 s existe **só** sob `no-preference` | Respeita pela porta contrária: o movimento é o opt-in |
| **Linear** | 284 → 52 transições, **mas as 150 animações infinitas continuam** | Respeita a transição, **não** a decoração |
| **Apple** (MacBook Pro) | 530 → 530, histograma idêntico | **Nenhuma diferença medida** |
| **Family** | 397 → 397, idêntico; 0 blocos na folha | **Nenhuma diferença medida** |
| **Mathigon** | idêntico; revelação de passo de **0,8 s** permanece | **Nenhuma diferença medida — num produto educacional** |

Duas conclusões. A primeira: **a implementação completa é barata** — o Cosmos
resolve com um interruptor, o Arc com uma variável. A segunda, mais útil:
**três produtos muito elogiados por movimento não implementam isto**, e um
deles é um curso. Fama não é critério.

A forma correta tem três partes, e só o Cosmos tem as três: (1) zerar duração,
(2) zerar animação infinita, (3) desligar a transição de navegação.

### M-8 · A decoração ambiente é o que sobra errado

Linear mantém **150 animações infinitas** (`grid-dot-*-upDown`, pontos de uma
grade de fundo) mesmo sob `prefers-reduced-motion: reduce`. É literalmente o
único movimento que o usuário que pediu silêncio continua recebendo — e é o
único que **não informa nada**. O mesmo padrão aparece no Rive (12 infinitas) e
no Cosmos (3, essas sim desligadas sob reduce).

Animação infinita é a categoria que sobrevive aos cortes porque ninguém a
associa a "animação". Na Alexandria ela já está proibida (M2 da v2); a medição
diz **por que** a proibição precisa de um teste automático e não de disciplina.

### M-9 · Duração acompanha distância, não importância

A única duração ≥ 0,5 s em interação séria que medi é a gaveta do Vaul: **0,5 s
para percorrer 826 px**. Apple opera a 0,32 s para movimento dentro da tela.
Linear, GitHub, Vercel e Stripe docs operam a 0,08–0,16 s para mudança de cor.
Ou seja: **1,6 ms por pixel** quando algo atravessa a tela, e **zero** quando
nada atravessa.

Isto mata a tentação de dar duração longa a um momento "importante": a conclusão
de um módulo não atravessa 800 px, então não merece 2,6 s. Merece o mesmo que
qualquer outra troca de estado na mesma distância.

---

## 4. Onde o detalhe aparece — superfície por superfície

| Superfície | O que os melhores fazem (medido) | O que a v3 deve fazer |
|---|---|---|
| **Foco** | 3 px, afastamento 1–7 px, **em corte**; Apple desenha por dentro quando encosta na borda | Anel de 3 px navy, afastamento 2 px, corte. `scroll-padding-top` igual ao cabeçalho + localizador |
| **Hover** | `color` (e no máximo fundo) em 80–240 ms, **`boxDelta` zero** | Cor em 100 ms, fio em 150 ms. Caixa constante, verificável por diff |
| **Pressionar** | Linear e Stripe trocam cor, não escala | Cor em corte. Sem "afundar" |
| **Consulta (tooltip/verbete)** | OWID: `all | 0s` | Corte. 2 124 termos não suportam 150 ms cada |
| **Carregamento** | OWID e Desmos não mostram esqueleto nem brilho; desenham quando têm | Nada por 400 ms, depois a palavra parada. Sem *shimmer*, sem *spinner* |
| **Entrada de bloco** | 0,15–0,4 s, `opacity` (+ pequeno deslocamento); Apple 0,24–0,32 s | 250 ms, opacidade + 8 px, no máximo 4 irmãos escalonados a ~110 ms |
| **Troca de página** | Corte com moldura parada (Stripe docs) **ou** 1 elemento nomeado (Josh Comeau) | Os dois são aceitáveis; escolher **um** e nunca os dois |
| **Rolagem** | Apple: 0 vídeo, 0 canvas, 35 imagens, entradas de 100–400 ms em `DocumentTimeline`. Josh Comeau e Notion usam linha do tempo de rolagem **nativa** (22 e 45 regras) | Entrada por bloco, uma vez. **Nunca** parallax, nunca sequestro de rolagem, nunca raspar vídeo |
| **Gesto** | Vaul: acompanhamento 1:1, transição removida durante o toque | Idêntico, nos 165 instrumentos |

---

## 5. Para a Alexandria — os 165 instrumentos

A pergunta era: *que movimento faz um instrumento ensinar melhor?* A medição
responde com quatro regras e uma proibição.

**I-1 · O controle e o resultado mudam no mesmo quadro, sem curva.** Enquanto a
mão está no controle, não existe animação: existe acompanhamento (Vaul: 1:1,
`transition-property: none`; Desmos: um valor por quadro, curva redesenhada
junto). O número, a unidade e a figura trocam no mesmo quadro. **Nunca** animar
o número separado da figura: duas durações diferentes para a mesma verdade é o
que faz o leitor desconfiar do instrumento.

**I-2 · Mudança de valor que não veio da mão é corte.** Desmos: trocar o
parâmetro por código produz **um** redesenho, não uma interpolação. Na
Alexandria isso cobre carregar um cenário-padrão, restaurar um valor, trocar de
instrumento: **tudo corte**.

**I-3 · Previsão → comparação é a única coreografia que se paga.** É o único
lugar onde o movimento carrega informação que a estática não carrega: a marca
da previsão **já está desenhada** quando a do cálculo chega, e o colchete entre
as duas é traçado **depois**, na mesma escala, para que a diferença seja vista
como distância antes de ser lida como número. Mecanismo medido que sustenta
isso: o tooltip do OWID mostra **todas as séries e o Total no mesmo quadro** —
a comparação é apresentada junta, nunca em duas visitas.

Duração proposta, derivada de M-9 e não de gosto: o traço do cálculo percorre a
largura da escala (±300 px) → **≈400 ms**; o colchete e a contagem da diferença
→ **250 ms**; a frase de debrief → entra em **250 ms**. Total ≈ 900 ms, e
**interrompível a qualquer quadro**.

**I-4 · Variação contínua de parâmetro é opt-in e discreta.** OWID e Desmos
concordam: existe um botão de play, e o que ele toca avança **em passos**
(~110 ms por estado no OWID). Se a Alexandria quiser mostrar "o fator de
capacidade ao longo do ano", é um controle rotulado, com passos discretos, e
cada passo é um estado de dado real — nunca uma interpolação visual entre dois
números que não existem no meio.

**Proibição.** Em repouso, o instrumento **não tem nenhuma animação rodando**
(Ciechanowski: 0, com 30 figuras na tela). Nada pulsa, nada respira, nada
convida. O instrumento parado é a afirmação de que ele é uma ferramenta e não
uma vitrine.

---

## 6. Para a Alexandria — 141 aulas sem desorientar

**N-1 · A moldura é o que orienta, e ela não se mexe.** Stripe docs: zero
animação na troca de página, lateral persistente, item ativo marcado por cor em
0,1 s e peso 600. É o produto com a navegação mais densa que abri e é o que
menos anima. Cabeçalho, localizador e sumário da Alexandria são **quadro de
referência**: eles não participam de nenhuma transição.

**N-2 · Se houver continuidade, é um elemento nomeado, não a página.** Josh
Comeau: `view-transition-name: site-header`, **uma** chamada por navegação. Na
Alexandria o candidato natural é **o código da aula** (`M01·A08`) viajando do
cartão de retomada ao cabeçalho da aula — e nada mais. Um nome, não cinco.

**N-3 · A posição do leitor é texto, não animação.** "Aula 08 de 9", "7 de 9
percorridas" trocam em corte. O contador conta **um passo** (a v2 já previa
`linear` 150 ms) e só até um número reconciliado.

**N-4 · A rolagem da lateral se preserva.** Defeito medido no shadcn: o
contêiner da lateral estava em `scrollTop: 852` antes da navegação e o contêiner
equivalente volta em `0` depois. Com 17 módulos e 141 aulas, perder a posição da
lista a cada aula é a desorientação mais barata de evitar e a mais cara de
ignorar.

**N-5 · Revelação progressiva longa é uma armadilha em currículo.** Mathigon
revela cada passo com `opacity, transform` em **0,8 s**, 18 passos por página, e
**sem respeitar movimento reduzido**. Num curso para adulto que precisa varrer a
aula para achar a fórmula, esconder conteúdo atrás de uma revelação de 0,8 s
troca aprendizagem por suspense. A Alexandria tem **214 exercícios** e um caso
em 17 partes: a resposta de referência aparece **em corte**, e o que já foi
lido fica lido.

---

## 7. O herói clássico e o produto moderno — a resposta deste eixo

A pergunta central do briefing é como um herói ilustrado convive com um produto
moderno sem o clássico virar enfeite e sem o moderno virar template. O eixo do
movimento tem uma resposta específica, e ela é quase contraintuitiva:

**O Titã não se move. Nunca.** Uma gravura é um objeto impresso; a autoridade
dela vem de estar fixa. Parallax, Ken Burns, globo girando em repouso, nuvens
deslizando — qualquer um desses converte a gravura em **papel de parede
animado**, que é exatamente a definição de "o clássico virou enfeite". O mesmo
vale para a textura do pergaminho e para o graticulado.

**A modernidade entra pela latência, não pela decoração.** O que medi nos
produtos que se sentem modernos é resposta em 80–160 ms, estado em 0 ms, foco em
0 ms, consulta em 0 ms, e gesto acompanhado 1:1. Nada disso é ornamento; tudo
isso é **tempo de resposta**. Uma página com uma gravura imóvel no centro e
controles que respondem em 100 ms lê como moderna; a mesma página com a gravura
flutuando lê como site de agência de 2014.

**A prova externa mais forte disso é a Apple.** A página do iPhone 17 Pro, que é
a referência mundial de página de produto, tem **0 `<video>` e 0 `<canvas>`,
35 imagens paradas**, e animações de 100, 200, 320 e 400 ms — entradas curtas de
bloco. A página do MacBook Pro opera inteira em 0,32 s com uma curva simétrica.
**Imagem parada e entrada curta** é o estado da arte, e é precisamente o que a
Alexandria já tem a imagem para fazer.

A única concessão razoável ao herói: ele **entra** uma vez, com a página, em
opacidade, 250 ms. Depois disso, é mobília — no melhor sentido: a coisa que não
se mexe e por isso orienta tudo que se mexe.

---

## 8. O vocabulário mínimo de movimento da v3

Fechado de propósito. Tudo que não está aqui é corte.

### 8.1 Durações — cinco, e uma regra de distância

| Token | ms | Onde | Evidência |
|---|---|---|---|
| `corte` | **0** | Palavra de estado, valor, aba, tooltip, resposta de referência, foco, ação de teclado, carregar cenário | OWID tooltip `0s`; foco em 5 produtos; Desmos corte programático |
| `realce` | **100** | Cor de hover, cor de link, item ativo da lista | Linear 0,1 s (284 elementos); Stripe docs 0,1 s; Vercel 0,1 s |
| `controle` | **150** | Fio e fundo de controle no hover e foco; entrada de item pequeno | Vercel, shadcn, motion.dev, Emil, Ciechanowski — todos 0,15 s |
| `entrada` | **250** | Bloco que aparece: painel, verbete, próximo passo, herói na carga | Josh Comeau 0,25 s; Observable Plot 0,25 s; Apple 0,24 s |
| `saida` | **200** | Tudo que sai (= `entrada` − 50) | Padrão medido: saída mais curta que entrada em Stripe, Arc, motion |
| `percurso` | **400** | Elemento nomeado atravessando entre páginas; traço que percorre a escala de um instrumento | Apple 0,32–0,4 s; motion examples 0,4 s; regra de distância |
| `passo` | **110** | Intervalo entre estados discretos numa sequência e entre irmãos escalonados (máx. 4) | OWID time-lapse: passos de ~110 ms medidos |

**Regra de distância (substitui "momento importante merece mais tempo"):**
≈**1,6 ms por pixel percorrido**, teto de 500 ms. Deriva da única duração longa
medida em interação séria (Vaul: 826 px em 0,5 s). Se nada atravessa a tela,
nada passa de 250 ms.

### 8.2 Curvas — três

| Token | cubic-bezier | Papel | Evidência |
|---|---|---|---|
| `percorre` | `(0.32, 0.72, 0, 1)` | Algo que **atravessa**: gaveta, elemento compartilhado, traço | Medida no Vaul; **declarada no Linear** — a única curva que aparece em duas fontes independentes de primeira linha |
| `entra` | `(0.16, 1, 0.3, 1)` | Algo que **aparece** | Arc (31 elementos), motion.dev (11), motion examples (176) |
| `interna` | `(0.4, 0, 0.6, 1)` | Algo **já na tela** que se desloca e para na tela | Apple (289 elementos); OWID declara a mesma |

Cor em 100 ms não precisa de curva nomeada (`linear` ou `ease`, indistinguíveis
nessa duração). **Nenhuma curva com ultrapassagem.**
`cubic-bezier(0.175, 0.885, 0.32, 1.275)`, medida em 128 elementos do
60fps.design, é exatamente o que **não** entra: ultrapassagem diz "brinquedo", e
este produto responde a quem vai defender um número em reunião.

### 8.3 Propriedades

Permitido: `transform`, `opacity`, `color`, `background-color`, `border-color`,
`outline-color`, `stroke-dashoffset`, `clip-path`.
Proibido: `width`, `height`, `top`, `left`, `margin`, `padding`, `box-shadow`,
`filter`, `backdrop-filter`, e **`transition: all`** (medido em 120 elementos do
Family e 41 do Brilliant — é o atalho que sempre acaba animando algo que
ninguém pretendia).

Exceção honesta: shadcn anima `width/height/padding` na lateral e Sonner anima
`height` na pilha. Funciona, mas custa *layout*, e a alternativa moderna já
existe e está medida: **`interpolate-size: allow-keywords`** (Josh Comeau, e ele
a liga **só** sob `prefers-reduced-motion: no-preference`), com
`transition-behavior: allow-discrete` e `@starting-style`.

### 8.4 As cinco regras

1. **O estado muda primeiro e anima depois.** A palavra, o número e a silhueta
   trocam em corte; a animação mostra só *como* se chegou lá.
2. **Enquanto a mão está no controle, não existe animação.** Acompanhamento 1:1,
   transição removida, devolvida na soltura.
3. **Toda coreografia é interrompível** e a próxima ação é clicável no primeiro
   quadro em que aparece.
4. **Movimento reduzido tem três partes:** duração a zero, animação infinita a
   zero, transição de navegação desligada. Só o Cosmos, entre 41 produtos, tem
   as três.
5. **Nada se move sozinho em repouso.** Zero animação infinita, zero laço
   ambiente, zero pulsação — inclusive no fundo, inclusive na gravura.

### 8.5 O aceite não é screenshot

O método desta pesquisa é o teste da v3, e ele é automatizável no laço de
screenshot que o repositório já tem:

- **diff de caixa no hover = 0** (`boxDelta`);
- **diff de estilo computado normal × `reduce`**: a contagem de transições cai e
  a de animações infinitas vai a zero;
- **amostragem por `rAF`**: estado que deveria ser corte tem **1** mudança, não
  dezenas; gesto tem deslocamento igual ao do ponteiro;
- **nenhuma propriedade de layout em transição** (estilo computado, não leitura
  de código);
- `document.getAnimations().length === 0` em repouso.

Cinco asserções, todas mecânicas, todas rodando sem olho humano.

---

## 9. Armadilhas — o que parece moderno e é só barulho

1. **Parallax e sequestro de rolagem.** Nenhum dos produtos sérios medidos usa;
   Apple faz a página inteira com imagem parada e entrada curta.
2. **Decoração infinita.** Linear mantém 150 animações infinitas sob movimento
   reduzido. É o movimento que menos informa e o que mais sobrevive às
   revisões. Proibir e **testar**.
3. **Curva com ultrapassagem / mola com salto.** 60fps.design em 128 elementos.
   Diz "aplicativo divertido"; este produto não é.
4. **Entrada por rolagem em todo bloco.** Brilliant: 80 elementos a 0,75 s.
   Numa aula de 3 000 palavras, isso é o leitor esperando o texto aparecer para
   poder ler — e varrer a página para achar a fórmula deixa de funcionar.
5. **Revelação progressiva longa.** Mathigon: 0,8 s por passo, 18 passos, sem
   movimento reduzido. Em currículo técnico de adulto, esconder é custo.
6. **`transition: all`.** Family (120) e Brilliant (41). Sempre acaba animando
   layout sem querer.
7. **Blur de fundo.** O Vaul, que é a referência de gaveta, usa
   `backdrop-filter: none` com uma cortina sólida a 40 %. Blur custa composição
   e não comunica nada que a cortina não comunique.
8. **Esqueleto e brilho de carregamento.** OWID e Desmos não mostram nada e
   depois desenham. Brilho varrendo é animação infinita com outro nome.
9. **Transição de view em todo clique.** Virar crossfade global é deixar a
   navegação mais lenta sem ganhar orientação: o valor está em **um** elemento
   nomeado (Josh Comeau), não na página inteira.
10. **Contador como enfeite.** Contar só até número reconciliado, e em um passo.
11. **Animar o número separado da figura.** Duas durações para a mesma verdade.
12. **Movimento como único sinal de estado.** Se a animação é a notícia, quem
    não vê animação não recebe a notícia — e isso inclui quem pediu movimento
    reduzido e quem usa leitor de tela.
13. **Animar a gravura.** O item 13 é o mais importante e é o que a v2 queria
    fazer: girar o globo, traçar rotas, cunhar medalhas. Ver abaixo.

---

## 10. O que sobra da especificação de movimento da v2

A v2 escreveu uma especificação de movimento de 713 linhas e nunca a integrou.
Lendo-a contra a medição, ela se divide em duas metades de valor muito
diferente:

**Sobrevive — e a medição confirma, uma por uma.** Os princípios M1–M12 são
quase todos independentes da metáfora e quase todos agora têm prova externa:
"todo movimento declara uma função" (M1); a lista de proibições, incluindo
ultrapassagem, parallax e laço ambiente (M2); "movimento reduzido chega ao mesmo
estado final" (M3); "o estado muda primeiro e anima depois" (M5); "nunca fazer
esperar", interrompível (M7); "quadro de referência parado" (M8) — que é
exatamente o mecanismo do Stripe docs; "leitura não é espetáculo" (M9);
"codificação nova é corte" (M10); a lista de propriedades permitidas (M11); e o
contador reconciliado (M12). **A estrutura de tokens também sobrevive**, embora
os valores devam ser recalibrados pela regra de distância: a v2 tem nove
durações, e a medição sustenta **sete**, com a maioria do tráfego em três.

**Morre com a cartografia.** Os dez "momentos" são coreografias **de objetos de
atlas**: o globo girando entre vistas V0→V3 com 48 quadros pré-renderizados por
aresta, o trecho de rota traçado a tinta, as estações que se preenchem, o limbo
do módulo que se fecha em anel, a medalha cunhada em três passes, o replay do
percurso do território. Tirada a navegação cartográfica, **não sobra o que
animar** — e tentar preservar a coreografia sem o território é precisamente como
"o clássico vira enfeite". A seção 5 inteira (produção de sequências do globo em
Blender, orçamento de 2,5 MB por aresta, WebP por quadro) é trabalho que a v3
não deve encomendar.

Sobrevivem como conteúdo, não como cartografia: **o momento 5** (previsão →
comparação), que é sobre o instrumento; e **o momento 10** (microinterações),
que é sobre foco, hover, gaveta, busca e carregamento — e que a medição confirma
quase na íntegra, com uma correção: a busca por `Ctrl K` em corte está certa, e
o tooltip "primeiro depois de 300 ms, os seguintes em corte" é mais generoso do
que o OWID, que não dá fade nenhum em nenhum.

**Não defendo a v2.** A conclusão deste eixo é que, no movimento, ela acertou o
nível da regra e errou o nível da cena: escreveu um regulamento bom para um
produto que foi rejeitado. O regulamento se aproveita quase inteiro; as cenas,
nenhuma.

---

## 11. Índice de evidência

- `capturas/07-movimento/README.md` — o que cada arquivo prova, e as provas
  negativas (o que não abriu).
- `capturas/07-movimento/<produto>/<produto>.json` — varredura normal.
- `.../<produto>-reduced.json` — varredura sob movimento reduzido; **a diferença
  entre os dois é a prova**.
- `.../vaul/vaul-interaction.json` — gesto 1:1 e abertura da gaveta.
- `.../owid-grapher/owid-instrument2.json` — passos de ~110 ms do time-lapse,
  tooltip em 0 s.
- `.../desmos/desmos-interaction.json` — arrasto do parâmetro, corte
  programático.
- `.../ciechanowski-gears/ciechanowski-interaction.json` — 30 canvas, 0 animação
  rodando.
- `.../joshcomeau/joshcomeau-viewtransition.json` — 1 chamada, cabeçalho
  nomeado.
- `.../stripe-docs/stripe-docs-nav.json`, `.../shadcn/shadcn-nav.json` —
  navegação em acervo grande.
- `.../mathigon/mathigon-interaction.json` — revelação de 0,8 s, 18 passos.

**Fontes secundárias** (lidas, não medidas, e usadas só onde confirmam medição):
o ensaio *Great Animations* de Emil Kowalski — animações abaixo de 300 ms,
`ease-out` para resposta, nunca animar ação iniciada por teclado, animar só
`transform` e `opacity`, respeitar movimento reduzido; e o guia de transições de
Josh Comeau — `ease-out` para quem entra, `ease-in` para quem sai, `ease` para o
que se move dentro da tela, evitar `transition: all`, `height` é caro porque
move os irmãos.
