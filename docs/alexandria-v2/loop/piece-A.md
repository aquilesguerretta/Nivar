# Design Loop — Peça A · Entrada (Home + identidade + navegação global)

**Régua:** [`../bar.md`](../bar.md) v1.1.
**Brief:** [`../briefs/piece-A.md`](../briefs/piece-A.md).
**Critics:** [`../critics/piece-A-critic-briefs.md`](../critics/piece-A-critic-briefs.md).

**Harness:** `tools/alexandria-capture/`.
- Playwright + Chrome do sistema, headless, com viewport e relógio fixos.
- Estados de learner vêm de fixture de rede declarada.
- WebGL por SwiftShader.

## Rodadas

### r00 — linha de base (Home atual)
Capturas em `../captures/A/r00-baseline/`. Achados medidos:
- a 390, rolagem horizontal;
- texto de 8px;
- mock de progresso exibido para visitante.

### r01 — builder
Implementou:
- shell sem sidebar;
- header em pergaminho, com marca-bússola SVG, busca real e localizador;
- nav mobile (barra inferior + "Mais");
- Home com tese, retomada real, carta dos três territórios, registro em camadas e portais ligados ao ponto atual.

Código: `tsc -b` limpo; `gridalpha-detect` com 0 P0.

**Critics (contexto limpo):**

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | FAIL | Falta evidência do destino da ação principal: não houve filmstrip do clique até a aula. Os ganchos de E2b também não foram capturados. **Lacuna do harness**, não do produto |
| System | FAIL | Linguagem interna visível ("TRABALHO: ORIENTAR", "Classe: explicação"). Título da aba "NIVAR — …" em `/alexandria`. Localizador truncando o nome atual a 390 |
| Craft | FAIL | A carta faz o trabalho, mas não tem presença: painel navy encaixado sobre pergaminho liso, faixa morta abaixo, sem atmosfera. Na comparação cega, venceu o North Star pela função e perdeu para o Atlas atual em presença |

**Comparação cega do Craft (etapa sem identidade):**

| Par | Vencedor |
|---|---|
| r01 × North Star | r01, pela função (o juiz registrou que o North Star tem mais presença) |
| Atlas atual × r01 | Atlas atual |
| r01 × r00 | r01 |
| r01 × r00 a 390 | r01 |

**Maior lacuna escolhida para r02:** presença do objeto-mundo (Craft). Entram junto, porque são gates binários:
- remover a linguagem interna;
- corrigir o título do documento;
- fazer o localizador mostrar o item atual inteiro a 390;
- adicionar o seletor `cta-primario`.

**Harness ampliado pelo orquestrador (lacuna do Brief):**
- filmstrip com ações por quadro e URL e foco registrados por quadro;
- clique CTA → aula (E2 1440, E0 390);
- rolagem de E2b;
- carregamento da conta desde o início;
- rolagem de ida e volta com header recolhível;
- Tab com 16 paradas;
- 768 na rodada padrão.

### r02 — em andamento
Brief da rodada: [`../briefs/piece-A-r02.md`](../briefs/piece-A-r02.md).

**Diretriz do Founder (sobre a carta da r01):** não é o design final. A presença vem de imagem (Blender e
Higgsfield), com SVG só para dado exato. A régua é "igual ou mais bonito que o North Star". O builder r02 que ia
refazer a carta em SVG foi parado antes de mudar arquivos.

**Mídia (laboratório em `../media-lab/A-r02/`, fora do build até a integração):**

| Frente | Ferramenta | Resultado | Créditos |
|---|---|---|---|
| Globo do currículo (`globo/`) | Blender 5.2.1, Cycles/OptiX; acabamento de gravura com Nano Banana Pro (Flux Kontext reprovado) | Globo não geográfico com 3 territórios em relevo, 17 estações e rota. Vistas T1/T2/T3/overview em 1600 e 1000, fundo transparente, com JSON de coordenadas de tela (visibilidade por normal e `ray_cast`). Versões em gravura de T1 e overview com desvio < 1% do diâmetro; a de T2 foi rejeitada | 11,5 |
| Prancha gravada (`prancha/`) | GPT Image 2.5, 4K (Nano Banana Pro e Seedream 4.5 testados e reprovados) | 7 finalistas: 3 desktop, 2 mobile e 2 sem figura, com a esfera medida em `.sphere.json`. Sem texto, sem assinatura e sem upload do North Star | 309 |
| Matéria (`materia/`) | GPT Image 2.5 e Nano Banana Pro (Seedream reprovado para papel) | Papel sem emenda (normal e lavado, em superfície e afundado); rosas-dos-ventos; cordilheira; costa; nuvens; faixa navy | 57 |

Saldo Higgsfield: 724,56 → 347,06. A prancha passou da referência de ~180 créditos por causa das rodadas de
correção de glifos, margem e nudez (filtro NSFW do provedor, com reembolso).

**Composição e julgamento cego** (`../media-lab/A-r02/compose/`). Foram montadas três composições estáticas:

| Composição | Descrição | Posição no julgamento |
|---|---|---|
| C1 | Titã + globo | 1º: "empata ou fica ligeiramente acima" do North Star |
| C3 | Globo no pedestal com rosa-dos-ventos | 2º |
| C2 | Globo 3D sem figura | 3º: "CGI colado" |

A maior lacuna da C1 foi o continente com cara de argila 3D.

**Integração** (builder):
- A C1 entrou no produto, e a carta SVG da r01 foi removida.
- O globo foi renderizado de novo como "globo-carta" (`../media-lab/A-r02/globo-carta/`) e composto por trilha
  (T1/T2/T3) sobre a prancha em `../media-lab/A-r02/integracao/compor_home.py`. As mãos ficam na frente do globo, e
  a geometria vai para `geometriaGlobo.ts`.
- 9 famílias de assets WebP foram para `public/alexandria/v2/home/`, com `factual_review` pendente.
- Higiene de gate aplicada.
- `tsc -b` limpo; `gridalpha-detect` com 0 P0 e 31 P2.
- Captura em `../captures/A/r02/`.

**Críticos r02** (contexto limpo; Craft com 3 juízes cegos, lentes presença, composição e acabamento):

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | **PASS** | Em E0, E1 e E2 o globo mostra só os territórios I e II. Com ~215px, a figura domina a miniatura |
| System | FAIL | Localizador a 390 com rótulo cortado ("M01 Físic...") e etapas reduzidas a "…" |
| Craft | FAIL | O globo que trabalha é a peça mais fraca: vetor liso com mancha sem forma, pequeno, e não distingue E0 de E2 |

Resultado dos pares cegos:

| Par | Resultado |
|---|---|
| r02 × North Star (E2 e E0) | r02 vence, quase sempre por margem leve |
| r02 × Atlas | 2 × 1 para r02 |
| r02 × r00 | r02, margem clara nos três juízes (1440 e 390) |
| r02 × r01 | 2 × 1 para a r01 (composição e acabamento), por carregar o currículo |

**Maior lacuna escolhida para r03:** o globo do currículo precisa ser a peça mais bela **e** mais informativa do hero:
- gravura de cartografia imaginária;
- escala dominante;
- três territórios visíveis;
- estados da rota;
- E0 distinto de E2.

Entram junto, por serem gates: o localizador a 390 sem nenhum corte e os alvos ≥ 24px (≥ 44px na nav global).
Brief da rodada: [`../briefs/piece-A-r03.md`](../briefs/piece-A-r03.md).

**Harness ampliado:**
- novas medidas `truncatedText`, `smallTargets` e `minFontPxShell`/`minFontPxMain`;
- capturas E0 com rolagem (1440 e 390), E1 a 390 e módulo a 390;
- Tab com 30 paradas.

### r03 — em andamento

**Mídia:**
- **Globo** (`../media-lab/A-r03/globo/`):
  - Cartografia imaginária: três ilhas inventadas numa carta programática de 8K, com o interior enriquecido por
    Nano Banana (IoU das costas 0,95) e envolvida em esfera no Blender.
  - Composição em gravura: hachura que segue os paralelos.
  - Três vistas (V1/V2/V3); nas três aparecem os três territórios e as 17 estações com rótulo; rota com 64 pontos
    por trecho.
  - 16 créditos.
- **Prancha** (`../media-lab/A-r03/prancha/`): o mesmo Titã em enquadramento próximo, por image-to-image da prancha
  r02. A esfera ocupa 55% da altura útil (402 CSS px). 94 créditos.
- **Composições:** três (`../media-lab/A-r03/compose/`), julgadas às cegas por três lentes contra o North Star e a
  r02.

**Diretriz do Founder (2026-09-16):** comprou +2000 créditos Higgsfield ("não precisa economizar") e pediu imagens
reais quando possível.

**Imagens reais** (`../media-lab/fontes-reais/`, catálogo em `CATALOGO.md`):
- 114 candidatas em 4 frentes: aula M01·A08, territórios das trilhas, identidade de atlas e sistema elétrico
  brasileiro.
- Um verificador independente releu cada licença na fonte e comparou o SHA-1: **107 aprovadas** (PD, CC0, CC BY,
  CC BY-SA, CC BY 3.0 BR) e 7 rejeitadas.
- Revisão factual pendente em todas; correções de legenda marcadas.
- Lacunas sem imagem real boa ficaram listadas como candidatas a Higgsfield ou Blender.
- Nada disso está no build.

**Integração** (builder):
- Entrou a comp-2 (1ª para 2 juízes): prancha D-B/M-B com o globo V1/V2/V3 por trilha.
- O overlay de estado vem do registro real: percorrido ●, atual ◎, a seguir ○, em curso ◐ e ponto de partida com
  bandeira; o trecho percorrido é desenhado sobre a rota amostrada.
- O selo diz "M01 · Aula 08 de 9".
- Cartão e ação foram fundidos, e a caixa-legenda saiu.
- Localizador a 390 em "‹ pai" + atual, sem reticências; alvos ≥ 24/44px; títulos de aba unificados.
- `tsc -b` limpo; `gridalpha-detect` com 0 P0 e 31 P2.
- 29 capturas, com as de fechamento: `truncatedText` do shell e `smallTargets` da Home vazios, `minFontPx` 11 na
  Home.

**Críticos r03:**

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | FAIL | A 390, o selo e o marcador nunca aparecem juntos; torso do Titã sem função; rótulo III cortado em E0 |
| System | FAIL | A5: salto de layout na troca de fontes (ação principal desce ~75px). Também: 3440 pior que 1920 e prancha única com duas classes |
| Craft | FAIL | O globo não pertence à gravura: navy chapado na escala de exibição e ~20 etiquetas brancas de UI. Contra a r02, margem leve |

Resultado dos pares cegos:

| Par | Resultado |
|---|---|
| r03 × North Star (E2 e E0) | **3 × 0, margem clara** |
| r03 × Atlas | 3 × 0, clara |
| r03 × r00 (1440 e 390) | 3 × 0 |
| r03 × r02 | 2 × 1, leve |

**Maior lacuna escolhida para r04:** acabamento do globo, com duas frentes:
- traço calibrado para o tamanho de exibição;
- letreiro cartográfico sem caixas, com posicionamento determinístico.

Entram junto, por serem gates:
- A5 (carregamento sem salto);
- A2 a 390;
- camadas com classes separadas;
- larguras grandes.

Brief: [`../briefs/piece-A-r04.md`](../briefs/piece-A-r04.md).

### r04

**Mídia:**
- **Globo** refeito por tamanho de exibição (D400–D2000):
  - mar navy com pauta clara alinhada ao pixel, contra-hachura no terminador e linhas d'água;
  - terra enriquecida por GPT Image 2.5 na carta plana (IoU das costas 0,97);
  - âncoras de letreiro.
- **Prancha** em camadas: prancha, mãos e variantes 16:9, 21:9 e 32:9, mais retrato.

**Composição vencedora:** comp-1, letreiro em arco + filactério, escolhida pelos 3 juízes.

**Integração:**
- Camadas separadas por classe (prancha e mãos: atmosfera; globo: explicação).
- Letreiro SVG com colocação determinística e teste de colisão.
- Rota no objeto.
- A5: faces de fallback com métrica ajustada; delta 0 com fontes bloqueadas.
- 390: cabeça e ombros.
- 3440: prancha 32:9.
- "Sobre esta figura" com as fontes reais (Ortelius, Mercator).

**Correções no harness (orquestrador):**
- espera de decode das imagens (o quadro de 3440 saía sem a prancha);
- mescla da `legend.json` em rodadas parciais.

**Checkpoint local:** `0ac3446` (sem push).

**Críticos r04:**

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | **PASS** | Rótulo do território III vertical e espremido; em E2b, o rótulo I colide com o marcador 04 |
| System | FAIL | `minFontPxShell` = 10 nas rotas de aula e de módulo (localizador); a 3440, header e conteúdo desalinhados |
| Craft | FAIL | O mar em pauta reta lê como linhas de varredura digitais; massas de terra sem forma; rótulos III e I ilegíveis |

Pares cegos:

| Par | Resultado |
|---|---|
| r04 × North Star (E2 e E0) | **3 × 0, margem clara** |
| r04 × Atlas | 3 × 0, clara |
| r04 × r00 (1440 e 390) | 3 × 0, clara |
| r04 × r03 | 2 × 1, leve |

**Ajuste de régua (orquestrador):** o critic Craft vinha reprovando por "não ser claramente mais forte que a rodada
anterior". Esse critério não está no bar (§8 e piece-A-critic-briefs: igual ou melhor que o North Star e claramente
melhor que a r00). A partir da r05, a comparação com a rodada anterior passa a ser **guarda de regressão**: reprova só
se a rodada anterior for preferida pela maioria dos juízes.

**Maior lacuna escolhida para r05:** acabamento do globo e legibilidade do letreiro:
- mar em gravura verdadeira, não pauta reta;
- terra com forma cartográfica legível;
- nomes de território legíveis em qualquer estado, sem colisão.

Entram junto: fonte de 10px no localizador (gate S7), alinhamento a 3440 e microcopy da legenda no pé da coluna.

### r05

**Mídia:**
- A frente de três variantes morreu por falha de rede (ENOTFOUND), e os juízes não receberam variantes.
- O agente de finalização escolheu o mar `cruz2` (talho claro curvo na luz, pontilhado no meio-tom, contra-hachura
  no terminador) pela lente de material, **sem comparação cega**. Isso fica registrado como desvio.

**Integração:**
- Nomes dos territórios fora do disco, com fio-guia; códigos das estações rasantes fora da borda.
- Matriz de letreiro: 24/24 sem colisão.
- Faixa de legenda própria.
- 3440: grade comum e prancha estendida.
- 1280: lede em 3 linhas.
- Checkpoint `cf88a78`.

**Críticos r05:**

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | FAIL | A1: lede de "Explorar" contradiz os ganchos (E2b) |
| System | FAIL | A5: a legenda entra depois da conta e empurra a faixa navy 21px |
| Craft | FAIL | O globo ainda lê como colagem (material, luz e tom diferentes do Titã; sem sombra de contato) |

**Pares cegos:**
- r05 × North Star: **3 × 0, margem clara**.
- r05 × Atlas: 3 × 0.
- r05 × r00: 3 × 0.
- r05 × r04: **2 × 1 para a r05** (guarda de regressão ok).

**Maior lacuna escolhida para r06:** unidade de material entre globo e Titã (uma só chapa), com três caminhos
(reestilização, composição e híbrido) julgados às cegas contra a r05 e portões de fidelidade geométrica. Entram junto:
A1 (lede × ganchos), A5 (altura reservada da legenda), rótulo da ação com motivo e 390.
Brief: [`../briefs/piece-A-r06.md`](../briefs/piece-A-r06.md).

### r06

**Mídia (sem IA, 0 créditos).** Três caminhos de unidade material foram medidos e julgados às cegas; venceu o
caminho 2 (composição pura): papel e tinta medidos na própria prancha, mar em três famílias de traço no passo da
chapa (7,6 px), luz única, sem termo de borda, e **sombra de contato das mãos em três camadas** (disco, mãos por
cima, prancha por baixo). A reestilização por IA foi reprovada nos portões: o GPT Image trocava o material mas
redesenhava as costas (IoU 0,21–0,42), e o Nano Banana preservava a geometria sem mudar o material.

**Integração.** 56 arquivos republicados com os mesmos nomes; A1 (lede e ganchos de uma fonte só, escopo de módulo);
A5 (faixa de legenda montada desde o primeiro quadro: f03–f05 pixel-idênticos); rótulo da ação com objeto e motivo;
390 sem corte do globo. Checkpoint `fb6c762`.

**Críticos r06:**

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | **PASS** | Em E2 o globo é quase igual ao de E0: o objeto mostra posição, mas não o percurso dentro do módulo |
| System | **PASS** | Abaixo de 1440 o objeto perde nomes de território, legenda de estados e a declaração de classe no 1º viewport |
| Craft | FAIL | **Guarda de regressão:** os 3 juízes preferiram a r05 no par direto. Causa nomeada: o rótulo com objeto+motivo virou parágrafo dentro da barra e o cartão perdeu a tese para um nome de catálogo |

**Pares cegos:** r06 × North Star 3×0 clara (E2 e E0); r06 × r00 3×0 clara; r06 × Atlas 3×0; r06 × r05 **0×3**.

**Decisão:** a lacuna do Craft é de arranjo do bloco de retomada, e o bloco inteiro está sendo trocado por diretriz do
Founder ("esse estilo de card é pura IA") em [`../briefs/retomada.md`](../briefs/retomada.md). A correção entra ali,
com a hierarquia da r05 (tese no lugar de destaque, ação curta). Entram junto na r07: a busca e o "Ctrl K"
([`../briefs/varredura-anti-ia.md`](../briefs/varredura-anti-ia.md) T1), o 1º viewport do celular e o percurso dentro
do módulo no globo.

### r07

**Escopo:** o chrome inteiro de uma vez (cabeçalho, busca, nav móvel), mais as duas lacunas dos critics da r06 e a
retomada vinda da rodada própria. Brief: [`../briefs/piece-A-r07.md`](../briefs/piece-A-r07.md).

Por que o chrome inteiro e não uma lacuna só: a varredura anti-IA
([`../briefs/varredura-anti-ia.md`](../briefs/varredura-anti-ia.md)) catalogou 38 tiques com coordenada e gate, e
eles caem quase todos em duas famílias — **caixa onde deveria haver fio** e **círculo de formulário onde deveria
haver marca de carta**. Corrigidas como regra de sistema, caem mais de vinte linhas de uma vez.

**Medida antes de construir.** Sete objetos do chrome usavam o mesmo fio `#CFC1A4` a 1,45–1,64:1 como borda de
controle — reprovando o ≥3:1 do S7 enquanto a chapa da casa desenha a 9,69:1. No render da r07 não resta nenhum; a
entrada de índice foi de 1,45:1 para 12,46:1. Marcas em
[`../media-lab/marcas-do-chrome/DECISAO.md`](../media-lab/marcas-do-chrome/DECISAO.md); retomada em
[`../media-lab/retomada/DECISAO.md`](../media-lab/retomada/DECISAO.md).

**O agente de conferência achou o erro de método:** a rodada estava corrigindo **por superfície, não por sistema**.
A série vazio/meio/cheio sobreviveu inteira na Peça B — duas gramáticas para os mesmos seis estados, a um clique
uma da outra, na rodada que baniu a série como regra. Também pegou a calha de tipo do índice (renomeada em vez de
extinta) e a segunda busca do Glossário. Os três foram corrigidos.

**Críticos r07:**

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | **PASS** | O vocabulário de estado se contradiz na mesma página: o selo do globo chama M02 de "✕ a seguir" e a faixa de rota, 900 px abaixo, chama o mesmo módulo de "a percorrer" |
| System | FAIL | **S7:** o rótulo de procedência da retomada ("registro de estudo") é o único texto da Home abaixo de 4,5:1 — 3,74:1 a 1440 —, porque assenta no trecho mais escuro da prancha de atmosfera |
| Craft | FAIL | **A ação principal não tem massa.** Ao remover o card creme e a barra navy da r06, a rodada removeu o único objeto terminal da coluna e não pôs nada no lugar: "CONTINUAR · M01·A08" virou o traço mais leve da tela |

**Pares cegos (3 juízes × 7 pares):**

| Par | Resultado |
|---|---|
| r07 × **North Star** | **3 × 0 para a r07** |
| r07 × baseline r00 (E2) | 3 × 0, margem clara |
| r07 × baseline r00 (E0) | 3 × 0, margem clara |
| r07 × Atlas atual | 3 × 0 |
| busca r07 × busca r06 | 3 × 0 |
| r07 × r06 a 1440 | 2 × 1 para a r07 |
| **r07 × r06 a 390** | **2 × 1 para a r06** — regressão móvel |

A chapa passou o North Star, que é a régua que o Founder pediu. O que falta é a ação e o celular.

**Decisão do Founder, 2026-09-20, sobre a marca da ação:** *"a mãozinha ainda está aqui, não usa ela, usa outra
coisa vai, muito melhor."* A manícula está **vetada** — inclusive a silhueta cheia que tinha vencido o julgamento
cego em [`../media-lab/manicula/`](../media-lab/manicula/). O veto e a lacuna do Craft são o mesmo problema visto
de dois lados: a linha da ação não fecha a coluna. A rodada de substituição procura **objeto terminal com massa**,
sem mobília de produto (`../media-lab/manicula/sem-mao/`).

**Entram na r08:** a ação com massa (Craft + veto do Founder), o contraste do rótulo de procedência (System), o
vocabulário de estado reconciliado entre selo e faixa (Brief) e a regressão do 1º viewport a 390 — onde a legenda
da figura passou a cortar a base da gravura e os glifos tipográficos da barra inferior não comunicam destino.

### r08 — a planejar
