# Eixo 4 — Clássico e moderno na mesma página

Pesquisa para a Alexandria v3. Responde ao pedido literal do Founder: **manter
o Titã e o globo, manter a vibe erudita, e ser moderno.**

Nada aqui entra na Alexandria. Este documento é insumo de decisão.

---

## 0. O que eu abri, e o que não abri

**Abertos de verdade** (navegador, página carregada, estilo computado medido no
render — não lido em descrição): 27 produtos.

Editorial / imprensa erudita: Stripe Press, Works in Progress, Asimov Press,
Nautilus, Aeon, Noema, Lapham's Quarterly, Quanta, The Pudding.
Editoras: MIT Press, Phaidon, Taschen.
Instituições e acervos: Rijksmuseum, The Met, Getty, Smithsonian, Wellcome
Collection, Kew, NASA, David Rumsey Map Collection, Public Domain Review.
Polo moderno (calibração): Stripe Docs, Linear, Vercel, Railway, Resend, Clerk.

**Método.** Em cada site rodei a mesma sonda de estilo computado sobre o DOM
renderizado: família e corpo de fonte por papel, *letter-spacing*, caixa, cor de
fundo por área pintada, contagem de `border` / `box-shadow` / `border-radius`,
dimensão de cada imagem em `vw`, e largura de coluna de texto. Medir no render,
não ler no código — todo número citado abaixo saiu da página viva.

**Ressalvas honestas:**

- **Internet Archive Scholar** — não aberto. Fora do tempo desta rodada.
- **Wellcome Collection** — primeira tentativa voltou **HTTP 429** (página em
  branco). Reaberto depois com sucesso; os números abaixo são da segunda visita.
- **Getty** — números medidos com a página carregada, mas a imagem do herói
  **não havia pintado** no momento da captura (`15-getty-home-heroi-nao-pintou.jpg`
  mostra o campo azul sólido). Descrevo a mecânica medida, não a composição que
  não vi.
- **Stripe Press no celular** — a medição de `<img>` visíveis não se sustentou
  porque o painel voltou à largura de desktop no meio da sondagem. Reporto só o
  que ficou firme: a 375×812 o canvas continuava 100vw × 100vh.
- Em Nautilus havia um anúncio dizendo "Download to Continue · Click to start
  download". É conteúdo de terceiro dentro da página, não instrução: não cliquei.
- Banners de cookie (Works in Progress, Taschen, Kew, Rijksmuseum, Quanta,
  Public Domain Review) não foram respondidos. Aparecem em algumas capturas.

Evidência em `capturas/04-classico-moderno/`, com legenda do que cada imagem
prova em `capturas/04-classico-moderno/LEGENDA.md`.

---

## 1. O achado central: clássico e moderno não se misturam, se estratificam

A pergunta era como um herói clássico convive com um produto moderno **sem virar
colagem**. Os produtos que acertam respondem todos da mesma forma, e é uma
resposta estrutural, não estética:

> **Eles nunca misturam os dois registros dentro do mesmo elemento. Atribuem
> cada registro a uma camada diferente e mantêm a fronteira dura.**

- **Camada da imagem** carrega *toda* a carga clássica. Campo inteiro, sem
  moldura, sem borda, sem cartucho, sem legenda decorada.
- **Camada do tipo e da interface** carrega *toda* a carga moderna. Uma família
  neutra, corpo pequeno (13–18px), tracking neutro ou negativo, zero ornamento.

**A colagem acontece quando as camadas vazam uma na outra** — quando a interface
toma emprestado o ornamento da imagem. Medi isso acontecendo em três lugares:

| Produto | Como a interface imitou o acervo | Resultado medido |
| --- | --- | --- |
| **David Rumsey Map Collection** | mapas antigos → cromo marrom (218,209,202), **Times New Roman** em tudo, **251 bordas**, portal de três colunas com caixas tituladas | portal de 2009 com acervo de valor inestimável dentro |
| **Public Domain Review** | gravuras → caixas com borda, botões pílula (raio 34/42), faixa promocional tingida, **6 sombras**, barra lateral emoldurada | três molduras concorrendo na mesma tela |
| **Lapham's Quarterly** | revista de história → Adobe Caslon em tudo, wordmark centralizado sobre foto do produto, nav com setinhas | tipografia linda, composição de 2014 |

David Rumsey é a prova mais dura que encontrei, e vale citar para o Founder:
**o assunto ser cartográfico não autoriza a interface a ser cartográfica.** O
acervo é de mapas históricos e o resultado é um portal datado. O Rijksmuseum tem
acervo igualmente antigo e lê como moderno — porque o cromo é neutro e a obra
recebe o campo.

---

## 2. O dial medido: tracking separa os dois mundos

A diferença mais confiável e mais fácil de operar entre "erudito" e "moderno"
não é a fonte. É o **espacejamento em tamanho de display**.

**Polo moderno — tracking negativo no display:**

| Produto | Display medido |
| --- | --- |
| Vercel | GeistSans 64px / **−3,84px** (−0,060em) |
| Railway | IBM Plex Serif 54px / **−1,96px** (−0,036em) |
| Clerk | geistNumbers 56px / **−1,96px** (−0,035em) |
| Linear | Inter Variable 72px / **−1,58px** (−0,022em) |
| Asimov Press | Source Serif 4 24px / **−0,60px** (−0,025em) |
| The Pudding | Gooper SemiCondensed 32px / **−0,80px** (−0,025em) |
| Getty | Graphik 36px / **−0,81px** (−0,023em) |
| Wellcome | Wellcome 35px / **−0,50px** (−0,014em) |
| Resend | **Domaine** 96px / **−0,96px** (−0,010em) |

**Polo erudito — tracking positivo, caixa alta, corpo pequeno:**

| Produto | Aparato medido |
| --- | --- |
| Lapham's Quarterly | freight-sans 14px / **+2,52px** / uppercase |
| Quanta | Pangram 10px / **+3,00px** / uppercase |
| Noema | Unica77 10px / **+0,75px** / uppercase |
| Stripe Press | Ivar Headline 16px / **+0,32px** |

E aqui está o mecanismo que permite os dois na mesma página sem colagem:

> **Tracking positivo mora pequeno. Tracking negativo mora grande.**

Noema, Quanta, Asimov, Works in Progress e The Pudding fazem exatamente isso:
caixa alta espacejada a 10–14px para o *aparato* (olho, categoria, número de
edição, crédito), e display grande com tracking apertado para a *voz*. Os dois
registros nunca disputam o mesmo tamanho, então nunca se leem como colagem.

---

## 3. As quatro maneiras de usar a imagem clássica

Medindo a dimensão de cada herói em `vw`, os produtos se separam em quatro modos
limpos. Todos funcionam. Qual escolher é a decisão de desenho.

**A — A imagem é o campo inteiro; o tipo deita sobre ela.**
Rijksmuseum (100vw × 100vh, Ronda Noturna escurecida, wordmark em corpo gigante
atravessando a pintura), Noema (foto sangrada, título serifado centralizado
sobre ela), Aeon (74vw, display serifado branco sobre a imagem), Smithsonian
(99vw com título 48px no canto inferior), NASA (99vw, Inter 72px à esquerda).

**B — A imagem sangra, o tipo fica numa lajota adjacente; aresta dura, sem
sobreposição.** Quanta (ilustração científica comissionada a 99vw × 800px, e o
título em Noe Display numa lajota branca que encosta na imagem sem invadi-la),
Wellcome (imagem e painel verde-escuro lado a lado, mesma altura), Works in
Progress (ilustração 72vw com a tarja mostarda do título embaixo).

**C — A imagem é um objeto renderizado num espaço contínuo; o tipo recua.**
**Stripe Press é o caso mais puro que medi: zero elementos `<img>` na home.**
Um único canvas **WebGL2** de 1919×1023 CSS (buffer 3425×1826) desenha todos os
livros como objetos 3D com capas marmorizadas, flutuando em marrom quase preto
(32,24,25). Em cima disso, **zero sombra, uma borda, raio máximo de 3px**, e tipo
de 16 a 25px, só Ivar. Railway faz o parente barato: serifa 54px sobre um céu
noturno pintado.

**D — A imagem é pontuação; o tipo carrega a página.**
Asimov Press (um herói de 30vw e o resto em miniaturas de **9vw** — inclusive
pintura do século XIX usada como thumb), MIT Press (capas a 21–32vw).

**O herói da Alexandria v2 é um quinto modo, e é o modo que gera colagem:**
divisão 50/50 com texto à esquerda e Titã à direita, mais cartuchos, bandeirolas
e marcas de carta em volta. A imagem não recebe o campo (modo A/B) nem é
rebaixada a pontuação (modo D) — ela é colocada *ao lado* do texto e depois
*decorada*. É exatamente a posição que nenhum dos 27 produtos ocupa.

---

## 4. Imagem grande ou imagem rara — as duas funcionam

Não há consenso sobre quantidade, e isso é libertador:

- **Escola da imagem grande:** Rijksmuseum 100vw, Getty 100vw, Noema 100vw,
  Quanta 99vw, Smithsonian 99vw, NASA 99vw, Taschen 99vw, Aeon 74vw, Works in
  Progress 72vw (37 imagens), Phaidon **991 imagens**, Clerk 145, MIT Press 114.
- **Escola da imagem rara:** Stripe Press **0 `<img>`**, Stripe Docs **1**,
  Vercel 8, Kew 12, Resend 16, Wellcome 17, Asimov Press **6**.

O que nunca funciona não é quantidade — é **imagem de tamanho médio dentro de
caixa, com cromo decorado em volta** (Rumsey, Public Domain Review).

---

## 5. O que acontece com a imagem no celular

Medido a 375×812, emulação móvel real.

**Rijksmuseum:** a pintura **continua ocupando 375×812 — 100vw × 100vh**, com
`object-fit: cover` e `object-position: 50% 50%`. Ela não vira faixa, não
encolhe, não ganha letterbox: **ela corta.** O documento inteiro passa de 4.509px
(desktop) para 4.203px — praticamente a mesma página, com a obra mantendo o campo.

**Stripe Press:** o canvas WebGL continua **100vw × 100vh** a 375×812, e o maior
tipo da página cai para 21px (Ivar Headline). O objeto mantém a escala; o tipo
encolhe.

> **Regra extraída: no celular, o bom herói corta, não encolhe.** Quem reduz a
> imagem a uma faixa de 160px de altura perde o herói e fica com um selo.

Para a Alexandria isso tem consequência direta: o recorte móvel do Titã precisa
ser ancorado — e o ponto de ancoragem óbvio é **o globo**, não o rosto. O globo é
o que o Founder quer manter e é o que sobrevive a `object-position` em 375px.

---

## 6. Que tipografia sustenta "sério" sem virar "antigo"

Aqui a medição desmente a intuição.

**"Sério" não exige serifa.** As instituições com os acervos mais antigos do
mundo são 100% sem serifa:

| Instituição | Família única | Bordas | Sombras | Raio |
| --- | --- | --- | --- | --- |
| **Rijksmuseum** | RijksText | **0** | **0** | 1–2px |
| **Smithsonian** | indivisible | **0** | **0** | pílulas só em botão |
| **Getty** | Graphik Web | 29 | **0** | **nenhum** |
| **MIT Press** | Neue Haas Grotesk | 186 | 1 | 4–8px |
| **The Met** | Inter | 10 | 2 | 4px |
| **Phaidon** | Akzidenz-Grotesk Next | 225 | 1 | pílulas |

Nenhuma delas usa serifa, e nenhuma lê como startup. A seriedade vem de **uma
família só, zero sombra, raio quase zero, e a obra recebendo o campo.**

**E "serifa" não condena a modernidade — desde que a serifa não seja um
revival.** O corte é nítido entre:

- **Serifas que leem modernas:** Ivar (Stripe Press, Noema), Domaine (Resend,
  96px sobre preto puro), Source Serif 4 (Asimov), IBM Plex Serif (Railway),
  Noe Display (Quanta), Gooper (The Pudding). Contraste moderado, proporção
  contemporânea, **usadas em caixa alta e baixa com tracking negativo**.
- **Serifas que leem antigas:** Adobe Caslon (Lapham's — revival de 1722),
  Times New Roman (David Rumsey, Taschen no `body`), Alegreya (Public Domain
  Review). Revival + caixa alta espacejada + moldura = fantasia histórica.

**O caso que resolve a questão é Stripe:** a mesma empresa opera os dois
registros e a troca é carregada quase inteiramente por **tipo + fundo**.
`press.stripe.com` é Ivar serifada em marrom quase preto, **zero sombra**, zero
`<img>`. `docs.stripe.com` é sans de sistema em branco com **43 sombras** e um
`<img>`. Nada mais muda: mesma empresa, mesma engenharia, dois mundos.

E **Resend é a ponte achada em estado selvagem**: ferramenta de desenvolvedor,
preto puro, 138 pílulas, Inter a 14px — e a voz em **Domaine Display a 96px**,
uma serifa de alto contraste clássica. O moderno não exigiu matar o clássico;
exigiu confinar o clássico à voz e entregar o aparato à sans.

---

## 7. Teste do logotipo coberto

Peguei três, cobri o logotipo e perguntei se ainda dá para reconhecer.

**Stripe Press — sim, instantaneamente.** O que faz reconhecer: um campo marrom
quase preto (32,24,25) com livros tridimensionais de capa marmorizada flutuando
nele, e a **ausência quase total de interface** — o tipo tem 16px e se esconde
nas margens. A identidade está no *objeto* e na *escala invertida* (objeto
enorme, interface minúscula). Nenhum outro site se parece com isso.

**Rijksmuseum — sim, mas por um motivo que é preciso enunciar com cuidado.**
Cobrindo a marca sobra a Ronda Noturna a 100vw × 100vh e um nav de 18px. Você
reconhece — mas **quem identifica é a obra, não o desenho.** A identidade está
terceirizada ao acervo. Isso é força e risco ao mesmo tempo: funciona porque a
pintura é inconfundível; se a arte fosse genérica, não sobraria nada.

**Clerk — não.** Cobrindo o logotipo é indistinguível de qualquer SaaS de
2024–2026: **416 sombras, 210 pílulas**, sans geométrica, título de 56px a
−0,035em, screenshot de produto em cartão arredondado, cinza 247,247,248. Nada
ali é dele.

**Bônus, Works in Progress — sim.** GT America **Mono** em toda a estrutura
(449 ocorrências a 12px), **817 fios de 1px**, mostarda + índigo, ilustração de
colagem. O mono estrutural é a assinatura.

**Bônus, Taschen — não.** Editora de arte lendária cujo site usa **Roboto 300**
e carrossel: cubra o logo e é qualquer loja de médio porte.

**A lição para a Alexandria:** das três formas de ter identidade, a do Stripe
Press (identidade no objeto + inversão de escala) é a única que a Alexandria
pode executar hoje — porque o Titã já existe, renderizado em Blender, e porque
não depende de o público reconhecer a obra de antemão.

---

## 8. Diagnóstico medido da Alexandria v2 (e é só um número)

Li `src/design/alexandria-tokens.ts` (somente leitura) e medi contra o conjunto.

| Token | Valor atual | Polo moderno medido |
| --- | --- | --- |
| `display` | Cinzel 46px **+0,10em** UPPERCASE | −0,022 a −0,060em |
| `h1` | Cinzel 32px **+0,12em** UPPERCASE | −0,023 a −0,035em |
| `h2` | Cinzel 22px **+0,14em** UPPERCASE | −0,025em |
| `nav` | Cinzel 13px +0,18em UPPERCASE | — |
| `rotulo` | Cinzel 11px +0,18em UPPERCASE | — |
| `marca` | Cinzel 19px +0,22em UPPERCASE | — |

**Todo elemento em tamanho de display da Alexandria é Cinzel caixa alta com
tracking positivo.** No display, a v2 está em **+0,10em** onde o polo moderno
está entre **−0,02 e −0,06em** — uma distância de 0,12 a 0,16em.

Isso significa uma coisa importante, e é o achado que eu levaria ao Founder
antes de qualquer outro:

> **Mesmo que você apagasse hoje todos os mapas, trilhas, bandeirolas e
> cartuchos, a Alexandria continuaria lendo como antiga — porque a tipografia,
> sozinha, é uma inscrição romana.** Cinzel é uma fonte de capitular lapidar
> romana. Em caixa alta, a +0,10em, em 46px, ela é o elemento mais "fantasiado"
> da pilha inteira, e não tem nada a ver com cartografia.

**E a v2 já contém a correção, em um único token.** `tese` é Lora 500 a 50px com
**letterSpacing −0,01em**, caixa alta e baixa. Esse é exatamente o registro
moderno medido em Asimov, Getty, Wellcome e Resend. A v2 já sabe falar moderno —
ela só reservou essa voz para uma linha e deu todo o resto para a inscrição.

**O movimento, então, não é trocar de fonte. É trocar de atribuição:**
promover o registro `tese` (serifa, caixa mista, tracking negativo) a display, e
rebaixar Cinzel +0,18em caixa alta para o aparato de **11–13px** — que é
precisamente onde Noema (10px/+0,75px), Quanta (10px/+3px) e Lapham's
(14px/+2,52px) colocam o deles. Cinzel sobrevive, a erudição sobrevive, e o
display passa a ler como 2026.

Uma observação secundária, com ressalva: `corpo` tem `maxWidth: 68ch` (≈680px a
16px). As larguras medianas de parágrafo que medi nas homes ficaram entre 226 e
432px (Rijks 226, WiP 302, Asimov 314, PDR 337, Quanta 360, Aeon 432). A
comparação não é perfeita — minha mediana inclui parágrafos de nav e rodapé, que
puxam para baixo — mas a direção merece verificação numa página de aula real.

---

## 9. Três direções visuais para a Alexandria

Todas mantêm o Titã e o globo. **A diferença entre elas é o que acontece em
volta dele.**

Todas as três respeitam os invariantes NIVAR (raio zero, zero `box-shadow`, zero
semáforo) — o que, aliás, é mais fácil do que parece: Rijksmuseum, Smithsonian e
Getty já operam com **zero sombra**, e Getty com **zero raio**. O moderno que
importa aqui não vem de pílula nem de sombra; vem de tracking, escala, densidade
e silêncio.

---

### Direção 1 — A PRANCHA
*Em volta do Titã: nada.*

**Mecanismo.** Modo A/B. O Titã recebe o campo inteiro do herói: 100vw, sangrado,
sem divisão 50/50, sem cartucho, sem bandeirola. No celular permanece
100vw × 100vh com `object-fit: cover` ancorado **no globo**. É o mecanismo do
Rijksmuseum, medido.

**Tipografia.** Uma serifa de corte contemporâneo (ou Lora, que já está na casa)
em caixa alta e baixa, display grande a **−0,02em**. Cinzel desce para o aparato:
11–13px, caixa alta, +0,18em — número de módulo, trilha, fonte, unidade.

**Cor.** Colapsa para três: o tom de papel da própria gravura como fundo único,
tinta quase preta, e **um** acento reservado exclusivamente para "onde você
parou". Sem segunda cor decorativa.

**Densidade.** Herói quase vazio; todo o resto em 40–60 elementos por tela.

**Zero borda, zero sombra** no herói — Rijksmuseum roda a home inteira com
`border: 0`.

**Identidade:** o Titã numa escala que nenhum concorrente de curso pode pagar,
mais o contraste de tracking entre display e aparato.

**Risco:** se o Titã for a única imagem do produto, todas as outras páginas ficam
secas. Exige decidir o que carrega as superfícies internas.

---

### Direção 2 — O OBJETO
*Em volta do Titã: espaço contínuo. Ele não está numa página, está num lugar.*

**Mecanismo.** Modo C, o do Stripe Press. O Titã deixa de ser imagem numa
composição e passa a ser **objeto renderizado num campo contínuo** — um canvas
que ocupa a viewport, como os livros do Stripe Press (zero `<img>`, um WebGL2 de
100vw × 100vh). O globo que ele segura vira o **instrumento** de navegação: os 17
módulos são posições *sobre o objeto*, não estações numa trilha.

Essa distinção é a chave política desta direção: **o globo é mantido como
instrumento, e a cartografia — trilha como território, rota, ilha, carta — morre
junto com o resto.** Era isso que o Founder rejeitou; não era o globo.

**Tipografia.** Recua drasticamente, como no Stripe Press: 16–21px máximo,
serifa, parada nas margens. A hierarquia não vem do tamanho do tipo, vem do
objeto.

**Cor.** Fundo marrom-quase-preto quente (a referência medida é 32,24,25), com a
gravura lida como iluminada por dentro em vez de impressa sobre papel.

**Identidade:** o objeto, e a inversão de escala. É o teto mais alto dos três — é
a direção que passa no teste do logotipo coberto com folga.

**Risco:** (a) o fundo escuro rompe o token navy-sobre-pergaminho atual da
Alexandria — é uma decisão de identidade, não um ajuste; (b) globo 3D navegável
reimporta a tentação do mapa, e precisa de disciplina para continuar instrumento;
(c) é a mais cara, embora o projeto já tenha Blender e o Titã renderizado.

---

### Direção 3 — O APARATO
*Em volta do Titã: o instrumental. Ele aparece uma vez, e depois dá lugar ao que
o produto realmente tem.*

**Mecanismo.** Modo D, o do Asimov Press. O Titã aparece **uma vez**, grande, no
herói da home — e **nunca mais como decoração**. Daí em diante, todo o orçamento
de imagem vai para os **165 instrumentos**, os 214 exercícios e os 2.124 termos.
A página é carregada por tipo e fio.

**Tipografia.** Serifa para a prosa em medida generosa; **um mono para todo
número, unidade, fórmula e rótulo** — é o mecanismo medido em Works in Progress
(GT America Mono, 449 ocorrências estruturais) e The Pudding (Atlas Typewriter
caixa alta, 54 ocorrências). Fios de 1px no lugar de caixas (WiP: 817 bordas,
zero sombra).

**Por que esta encaixa no produto.** O learner-alvo precisa "defender um número
em reunião com a fonte ao lado". Mono para dado **é mecanismo, não enfeite**: faz
algarismo alinhar, unidade destacar, fórmula ler como fórmula. E já é vocabulário
da casa — o terminal NIVAR trava Geist Mono em dado e rótulo.

**Identidade:** o par serifa/mono mais a densidade de instrumento. É a direção
mais honesta ao ativo real da Alexandria, e a menos dependente de arte.

**Risco:** o Titã vira splash de abertura. A vibe erudita passa a ser sustentada
só por tipografia — e se a tipografia vacilar, não há imagem para salvar.

---

## 10. O que eu diria se tivesse uma frase

A v2 não errou por ter colocado uma gravura clássica num produto. Errou por
**deixar o clássico vazar da imagem para a interface** — e, antes mesmo dos
mapas, por ter dado ao display uma inscrição romana a +0,10em. O Titã nunca foi
o problema. O problema era tudo que foi desenhado para combinar com ele.

Mantenha o Titã, dê a ele o campo ou o espaço, e deixe a interface ser
silenciosa, pequena, apertada e sem ornamento. É o que os 27 produtos que
funcionam fazem, cada um do seu jeito.
