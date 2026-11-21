# Portal Debt Wave 1 — estado real medido (Fase 1)

ARCHITECT, worktree `gridalpha-v2-portal-debt`, branch `wave/portal-debt`.
Base: `f9ab5ec`. Tudo abaixo foi **medido no disco desta árvore**, não
lido de relatório anterior. Onde a medição contradiz a premissa do
brief, a medição está marcada como tal.

Linha de base antes de qualquer edição: `npx tsc -b` limpo,
`gridalpha-detect src` em **0 P0 / 27 P2** — igual ao que `AGENTS.md`
declara.

## 1 · Ativos órfãos em `public/alexandria/`

**A premissa do brief era 14 arquivos / ~24 MB. A medição dá 61
arquivos.** O relatório anterior estava certo no tipo de problema e
errado na CONTAGEM por um fator de quatro.

**O peso foi medido duas vezes, e as duas estão certas.** Na abertura
desta wave os 61 pesavam **~45 MB**. Enquanto ela corria, a wave
`wave/asset-cleanup` do Codex converteu 19 desses mesmos arquivos e
fechou antes; depois do rebase sobre ela, os mesmos 61 pesam **~17 MB**,
e `public/alexandria/` inteiro caiu de 78 MB para 45 MB. **A contagem
não mudou** — nenhum arquivo ganhou consumidor —, só o peso. Os números
da tabela abaixo são os de DEPOIS, medidos na árvore que este commit
entrega.

Método: para cada um dos 139 arquivos sob `public/alexandria/`, busca do
nome em `src/` e `index.html` exigindo contexto de caminho
(`[/'"\`]stem` ou `stem.ext`). O contexto importa — a busca só pelo
radical dá falso negativo em `bracket.svg`, que casa com a palavra
inglesa "bracket" em oito arquivos do lado americano, nenhum deles
consumidor.

| Pasta | Total | Órfãos | Peso órfão (antes → depois do Codex) |
| --- | --- | --- | --- |
| `gravuras/` | 108 | 41 | ~16 MB → **14,8 MB** |
| `icones/` | 11 | **11** | ~22 MB → **1,6 MB** |
| `gamificacao/` | 3 | 3 | ~5,4 MB → **532 KB** |
| `marca/` | 4 | 2 | ~2,8 MB → **124 KB** |
| `svg/anotacao/` | 4 | 4 | ~4 KB (não tocado) |
| `svg/nos-trilha/` | 6 | 0 | — |
| `textura/`, `geo/` | 2 | 0 | — |
| **Total** | **139** | **61** | ~45 MB → **~17 MB** |

`icones/` conta 11 e não 10: `icon-compass-simple-on-cream.png` só
aparece em `RailToggle.tsx:6`, **dentro de um comentário** que diz que a
primeira versão usava o arquivo e deixou de usar. Referência em
comentário não é consumidor.

### As três classes de órfão, que têm destinos diferentes

**a) `gravuras/` — 41 órfãs: conteúdo pendente, não asset morto.**
`ApostilaPanel.tsx:182` monta `src={`/alexandria/gravuras/${arquivo}`}`,
e `arquivo` vem do dado de módulo em `src/lib/data/alexandria-modulo-NN-content.ts`.
Os 17 arquivos de conteúdo existem; as 67 gravuras citadas por eles
resolvem. As 41 restantes são a reserva que os módulos ainda não
chamaram. Elas se ligam quando o LYCEUM estender o conteúdo — apagar
seria destruir insumo de aula.

**b) `icones/` (11), `gamificacao/` (3), `marca/` cream (2),
`svg/anotacao/` (4) — 20 arquivos, ~30 MB: sem consumidor e sem casa
identificável hoje.** Varredura por `certificad|selo|badge|conquista`
não encontra nenhum fluxo de certificado, medalha ou conquista em lugar
nenhum da árvore — nem na Alexandria, nem em `/conta`
(`PerfilPlataforma` tem três seções: Dados pessoais, Assinatura,
Produtos; nenhuma de conquista). Ligar `frame-certificate-on-cream.png`
exigiria **inventar o fluxo de certificado**, que é decisão de produto,
não fiação de asset.

**c) `public/alexandria/svg/_test/index.html`** — harness de verificação
da Wave 1 da Alexandria, que o próprio arquivo declara "NÃO é superfície
de produção". Está em `public/`, então é servido em
`nivar.com.br/alexandria/svg/_test/`. Não é órfão pela definição acima
(é HTML, não asset referenciado), mas é superfície pública não
intencional.

### Fronteira de posse — o que trava a Fase 2

**Os 61 órfãos estão todos sob `public/alexandria/`, e todo consumidor
plausível está sob `src/components/alexandria/`.** `AGENTS.md` dá
"Alexandria inteira" ao LYCEUM; o brief desta wave lista
`src/components/alexandria/` como NUNCA MODIFICAR. O próprio
`AlexandriaFooter.tsx:204` registra que `public/alexandria/gravuras/` é
somente-leitura fora da wave de asset.

Nenhum dos 61 tem casa em território ARCHITECT. **Incerteza classe 3 —
para e reporta.** Ver decisão pedida ao fim.

## 2 · `components/errors/` — existe, com ressalva

**Existe, com 5 arquivos** — a memória da sessão anterior estava certa:

```
.claude/skills/NIVAR Design System/components/errors/
  ErrorState.jsx  ErrorState.d.ts  ErrorState.prompt.md
  errors.css      erros.card.html
```

Duas ressalvas medidas:

1. **É pacote de skill, não componente de produção.** O espelho de
   produção `src/design/nivar/` tem só arquivos de variável
   (`colors.css`, `typography.css`, `space.css`, `motion.css`,
   `fonts.css`, `base.css`) mais um SVG. Não há `ErrorState` importável
   em `src/`. O que se herda é a **linguagem**, não o import.
2. **A semântica é de falha de fonte de dado, não de rota inexistente.**
   `ErrorState.d.ts` torna `fonte` ("fonte que falhou") e
   `ultimaApuracao` ("ISO + fuso da última apuração bem-sucedida")
   obrigatórias — o `prompt.md` diz que "as duas linhas são
   obrigatórias: é o que separa uma falha honesta de um dado
   silenciosamente errado". Um 404 de rota não tem fonte que falhou nem
   apuração anterior. **Preencher esses dois campos num 404 seria
   fabricar procedência** — exatamente o que a doutrina proíbe.

O que se herda, então, e que os tokens de produção já suportam:

- fio de 2px em `var(--advisory)` no topo, **nunca vermelho de UI**;
- etiqueta mono versalete com o glifo `△` (glifo do conjunto fechado);
- título display / corpo / linha chave-valor com fio de guia
  (`.nv-erro__linha` + `.nv-erro__fio`);
- `role="alert"`, medida máxima 60ch.

`--advisory`, `--rule`, `--fio`, `--text-strong/-muted/-faint` existem
todos em `src/design/nivar/colors.css`, com remapeamento sob
`[data-mode="noturno"]` — os dois modos saem de graça.

O dado honesto que um 404 **tem** para pôr na linha chave-valor é
**o próprio endereço pedido**. É real, é medido, e é o que o leitor
precisa para saber se errou de link ou se o link é que está velho.

## 3 · Rotas catch-all — três, exatamente como o brief dizia

| Arquivo | Linha | Hoje cai em | Posse |
| --- | --- | --- | --- |
| `src/main.tsx` | 164 | `<PortalBR />` | ARCHITECT |
| `src/pages/br/PortalBRRouter.tsx` | 32 | `<PortalBR />` | ARCHITECT |
| `src/pages/alexandria/AlexandriaRouter.tsx` | 194 | `<HubRoute />` | **LYCEUM** |

As duas primeiras são silêncio puro: `/xyz` e `/br/xyz` devolvem 200
com o Portal, sem sinal nenhum de que o endereço não existe.

A terceira é território do LYCEUM por `AGENTS.md`, e tem um problema
**de desenho** além do de posse: a Alexandria tem identidade própria
(navy sobre pergaminho, Cinzel + Lora). Um 404 em papel/tinta NIVAR
dentro dela seria dialeto estrangeiro. Ver decisão pedida ao fim.

## 4 · SEO — `index.html` confirmado nu

Medido: o `<head>` tem charset, viewport, quatro favicons, dois
preconnect, o stylesheet do Instrument Serif e `<title>NIVAR</title>`.
**Zero description, zero Open Graph, zero Twitter Card, zero canonical,
zero theme-color.**

Três achados que mudam o peso do conserto:

1. **`<html lang="en">`, com o produto inteiro em português.** Todo o
   Portal BR, `/conta`, os três produtos Advisory e a Alexandria são
   pt-BR.
2. **O título estático é o único que raspador de link vê.** As cinco
   páginas que ajustam `document.title` fazem isso em `useEffect` —
   scraper de WhatsApp, LinkedIn, Slack e Facebook não roda JS. Hoje
   toda pré-visualização de link, de qualquer rota, lê "NIVAR" e nada
   mais.
3. **Não existe cartão de compartilhamento 1200×630 no repo.**
   `public/` tem `nivar-mark.png` (1024×1024, 573 KB), os favicons e o
   apple-touch-icon. Nada em proporção de cartão.

### Cópia proposta — **rascunho para aprovação, nada disso está no ar**

Toda frase abaixo é recorte ou recombinação de cópia que **já existe** na
superfície. Procedência ao lado de cada uma. Nada foi inventado.

Fontes:
- `PortalBR.tsx:411` — "Inteligência independente do setor elétrico brasileiro"
- `PortalBR.tsx:412` — "…quem precisa entender o mercado de energia do Brasil — dados, formação e análise."
- `FaixaIndependencia.tsx:67` — "A análise é o produto"
- `FaixaIndependencia.tsx:73` — "ONS, ANEEL, CCEE, EPE e IBGE aparecem nomeados onde o dado aparece; o que é estimativa vem marcada como estimativa."
- Convenção de título já em uso nas 5 páginas: `NIVAR — <coisa>`

```
título      NIVAR — Inteligência independente do setor elétrico brasileiro   (62 car.)
            alternativa curta, se 62 incomodar:
            NIVAR — Inteligência independente do setor elétrico              (51 car.)

description Inteligência independente do setor elétrico brasileiro: dados,
            formação e análise. Todo dado com origem citada — ONS, ANEEL,
            CCEE, EPE e IBGE.                                              (142 car.)

            alternativa, se a doutrina pesar mais que as siglas:
            Dados, formação e análise do mercado de energia do Brasil. A
            análise é o produto: todo dado tem origem citada, e estimativa
            vem marcada como estimativa.                                   (152 car.)

og:title        (= título)
og:description  Dados, formação e análise do mercado de energia do Brasil.
                Todo dado tem origem citada — ONS, ANEEL, CCEE, EPE e
                IBGE.                                                      (118 car.)
og:type         website
og:url          https://nivar.com.br/
og:site_name    NIVAR
og:locale       pt_BR
twitter:card    summary        ← quadrado, honesto sem cartão 1200×630
theme-color     #F6F2E9 claro (--papel) / #14120F escuro (--tinta)
lang            en → pt-BR
```

**Três decisões de SEO que recomendo tomar por omissão, com razão:**

- **Sem `<link rel="canonical">` estático.** Num SPA com rewrite
  `/(.*) → /index.html` (`vercel.json`), um canonical fixo apontaria
  *toda* rota para a raiz e diria ao Google que `/conta-de-luz-express`
  é duplicata do Portal. Canonical por rota exige render no servidor;
  não existe aqui.
- **Sem `robots` / `googlebot`.** O padrão já é indexar; a meta só
  adiciona ruído.
- **`og:image` — três saídas, escolha sua.** (i) `/nivar-mark.png`
  1024×1024 com `twitter:card: summary`: honesto, sai como ladrilho
  quadrado; (ii) nenhum `og:image`: a prévia sai só com texto, o que
  algumas plataformas renderizam mal; (iii) esperar um cartão 1200×630
  de verdade — trabalho de desenho, não desta wave. **Recomendo (i)**,
  porque prévia com marca quadrada é melhor que prévia sem imagem, e
  trocar por um cartão de verdade depois é uma linha.

## Decisões pedidas antes da Fase 2

1. **Órfãos.** Os 61 estão todos em território LYCEUM. Recomendo: a
   Fase 2 **não liga nada** e a wave entrega o inventário acima como o
   produto dela — as 41 gravuras ficam como reserva de conteúdo
   declarada, os 20 sem casa ficam registrados como pendência de
   produto (o fluxo de certificado precisa existir antes do
   `frame-certificate` ter onde ir), e o `_test/index.html` sai de
   `public/` numa wave do LYCEUM. Alternativa, se preferir: eu abro o
   escopo e ligo o que der dentro da Alexandria — mas aí é wave do
   LYCEUM, não desta.
2. **Catch-all da Alexandria.** Recomendo **não tocar**: é posse do
   LYCEUM e um 404 em papel/tinta lá dentro quebraria a identidade
   navy/pergaminho. Os dois catch-all ARCHITECT (main.tsx, PortalBRRouter)
   passam a servir o 404 real; o da Alexandria fica como está, com a
   pendência registrada aqui.
3. **Cópia de SEO.** Aprovar título, description, og:description e a
   saída de `og:image` acima antes da Fase 4.

---

# Fase 2 — fechada como INVENTÁRIO, sem ligar nada

Decisão do Aquiles sobre as três perguntas acima, tomada com a medição
à vista.

**Nenhum arquivo foi ligado, apagado, movido ou renomeado.** A saída da
fase é o inventário e, mais que ele, a **correção de posse**: os 61
órfãos e o 404 da Alexandria são do LYCEUM, não do ARCHITECT. O brief
desta wave presumiu o contrário; a medição desfez a presunção. Registro
para a próxima wave que encostar em `public/alexandria/` partir da
premissa certa — em `docs/pendencias-alexandria.md`, que é o entregável
desta fase.

Três precisões que entraram no registro por instrução direta, e que a
medição sozinha não teria produzido:

- **As 41 gravuras não são pendência de espécie alguma** — são reserva
  de conteúdo. Ficam listadas só para não voltarem a ser contadas como
  órfãs na próxima varredura.
- **Nenhum dos 20 sem casa se apaga sem o LYCEUM conferir um a um.** Ao
  menos três (badge-frame, frame-certificate, seal-wax) constam noutro
  registro como asset PAGO à espera de fiação. Peso em disco não é razão
  suficiente para destruir insumo comprado.
- **A dependência do certificado tem nome**: `frame-certificate` não tem
  para onde ir enquanto não existir o endpoint de emissão — o item 3.5
  da Ordem de Jogo. A moldura é a última peça do fluxo, não a primeira.

E `svg/_test/index.html` sai da contagem de órfãos e vira item próprio:
o problema dele é ser superfície pública não intencional, não ser asset
sem consumidor.

## Fase 3 — o 404, e onde ele NÃO vai

Os dois catch-all do ARCHITECT (`main.tsx:164`, `PortalBRRouter.tsx:32`)
passam a servir um 404 real. O da Alexandria (`AlexandriaRouter.tsx:194`)
fica intocado, com a restrição de linguagem registrada na pendência: quem
o construir precisa falar navy/pergaminho/Cinzel, e **não** reusar o
componente de erro do NIVAR nem o `NotFound` do Portal.

## Fase 4 — SEO escrito, e o cartão de compartilhamento que NÃO foi

Cópia aprovada na Fase 1 (descrição A), escrita em `index.html`. Nada
inventado depois da aprovação.

**`og:image` ficou de fora por medição, não por preferência.** A
instrução era conferir o arquivo antes de assumi-lo, e a conferência
reprovou o candidato. `public/nivar-mark.png` foi decodificado byte a
byte (zlib + defilter, não inspeção visual):

| Medida | Valor |
| --- | --- |
| Dimensão / formato | 1024×1024, bitDepth 8, colorType 6 (RGBA) |
| Peso | 573,0 KB |
| Caixa do conteúdo | 942×937 — 92% do quadrado |
| Corte 1.91:1 centrado | preserva **57,3%** do conteúdo |
| Perda | **201 px em cima, 199 px embaixo** |

O que os 400 px cortados contêm é a cabeça da figura e a base da
lanterna — o corte decapita a marca. Isso reprova `summary_large_image`,
que era a única variante que a proporção justificaria.

Dois defeitos independentes se somam ao corte, e cada um sozinho já
bastaria:

- **Fundo transparente.** O canto (0,0) mede `[0,0,0,0]` — alpha zero,
  não preto. Plataforma compõe transparência sobre branco ou sobre
  preto conforme o tema de quem lê, sem contrato; a marca sairia
  diferente para leitores diferentes.
- **573 KB acima do teto de busca do WhatsApp**, que fica na casa dos
  300 KB. No WhatsApp a prévia sairia sem imagem de qualquer maneira.

Resultado: tags só de texto agora, e **cartão 1200×630 de verdade fica
como passe de desenho próprio**. Prévia sem imagem é pior que prévia com
imagem certa e melhor que prévia com a marca decapitada.

### Pendências abertas por esta fase

  [ ] Cartão de compartilhamento 1200×630, fundo opaco, abaixo de
      300 KB. Enquanto não existir, `og:image` fica ausente de
      propósito.
  [ ] `lang="en"` no container das telas do terminal americano
      (`/us`, `/nest`). A raiz passou a `pt-BR`, que é o idioma da
      maioria da superfície; as páginas em português já declaram o
      próprio `lang`, e as em inglês precisam fazer o mesmo.
  [ ] Título e description POR ROTA para raspador de link. O que está
      em `index.html` é o piso que toda rota mostra; `document.title`
      em `useEffect` não é lido por quem não roda JS. Resolver exige
      pré-render ou função de borda — decisão de plataforma.

---

# Fase 5 — verificação e fechamento

Tudo abaixo foi medido no navegador contra o dev server desta árvore,
por medição no render, nunca por leitura de código.

## O que foi verificado

**404 · rota.** `/rota-que-nao-existe?ref=teste`,
`/br/familia/nao-existe/xyz` e `/verificacao-final-fase-5` caem no 404;
o endereço na tela bate caractere a caractere com `location.pathname +
location.search`, query inclusa.

**404 · sistema.** Fio superior `2px solid rgb(232,163,23)` — o
`--advisory`, nunca vermelho de UI. `border-radius: 0px`,
`box-shadow: none`. Zero `<img>` na página; o único `<svg>` é o
wordmark. Nenhum bitmap decorativo, como a instrução exigia.

**404 · dois modos.** Claro `#F6F2E9`, noturno `#14120F`, com
`--text-strong`, `--text-muted` e `--text-faint` remapeados. O botão
secundário mediu cor de fundo na primeira leitura e foi investigado até
a causa: recálculo de estilo ainda não descarregado no painel, não
defeito do produto — duas medições seguintes deram `#F6F2E9` em texto e
borda, e a captura confirmou. **Oitava vez nesta trilha que a falha de
verificação era do harness.**

**404 · três viewports.** 1440×900, 1920×1080 e 3440×1440, sem overflow
horizontal em nenhum. Em 3440 o `<main>` trava em 1200px e centra
(x=1120), com o bloco em 560px — a medida de 60ch. Endereço de 175
caracteres quebra em três linhas dentro do bloco, sem estourar.

**404 · `noindex` sem contaminação.** A meta `robots=noindex` está
presente no 404 e mede `REMOVIDO` depois de navegar para `/br` — o
risco real dessa adição, verificado.

**Sem regressão.** `/br` continua servindo o hero
("Inteligência independente do setor elétrico brasileiro"),
`/br/familia/advisory` continua servindo a família (título
`NIVAR — Advisory`, sem `noindex`), e `/alexandria/rota-inventada`
continua caindo no Hub, intocado.

**SEO por view-source, não pela edição.** `curl` em
`/uma/rota/qualquer` devolve as tags — prova de que o rewrite as serve
em toda rota. `npm run build` limpo, e `dist/index.html` carrega as 12
tags com UTF-8 válido e acentos intactos. Uma única ocorrência de tag de
título no documento: o comentário foi reescrito para não citar marcação
literal, porque raspador que usa regex em vez de parser leria a citação
em vez da tag real.

## Fronteiras, conferidas por diff e não por memória

`git diff --name-only` da branch inteira contra a base:

- `public/` — **0 arquivos**. Os 139 de `public/alexandria/` seguem
  intactos; a Fase 2 mediu e não tocou.
- `src/components/alexandria/`, `src/pages/alexandria/`, `app/` —
  **0 arquivos**.

Seis arquivos mudaram no total: dois documentos novos, `index.html`,
`src/pages/NotFound.tsx` (novo) e as duas linhas de rota.

## Gates

`npx tsc -b` limpo · `gridalpha-detect src` em **0 P0 / 27 P2**, a linha
de base intacta · `npm run test:games` 14/14.

## Concorrência — a wave do Codex fechou primeiro

`wave/asset-cleanup` (conversão de PNG e hospedagem de fonte) entrou na
base durante esta wave, com **zero sobreposição de arquivo**: o rebase
passou limpo nos quatro commits.

Duas consequências conferidas depois do rebase, não presumidas:

1. **Os pesos do inventário foram medidos de novo** e corrigidos na
   §1 e na pendência. A contagem não mudou — nenhum arquivo ganhou
   consumidor por ter emagrecido.
2. **`index.html` e a hospedagem de fonte não conflitam.** O Codex
   auto-hospedou Zilla Slab, Work Sans e JetBrains Mono em
   `src/design/nivar/fonts.css`; o `<link>` e os dois `preconnect` que
   restam em `index.html` servem **Instrument Serif**, que continua viva
   em `src/design/tokens.ts:60`, do lado americano. Nada a remover.
