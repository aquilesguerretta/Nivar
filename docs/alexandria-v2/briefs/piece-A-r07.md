# Peça A · Rodada 7 — o cabeçalho é a margem da folha

Briefs anteriores: [`piece-A-r06.md`](piece-A-r06.md) · loop: [`../loop/piece-A.md`](../loop/piece-A.md).
Entram junto: [`retomada.md`](retomada.md) (bloco de retomada, em rodada própria) e
[`varredura-anti-ia.md`](varredura-anti-ia.md) (tabela de tiques, com coordenada e gate por linha).

## O que a r06 deixou

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | PASS | Em E2 o globo é quase igual ao de E0: mostra a posição, não o **percurso dentro do módulo** |
| System | PASS | Abaixo de 1440 o objeto perde **nomes de território, legenda de estados e declaração de classe** no 1º viewport |
| Craft | FAIL (guarda de regressão) | Os 3 juízes preferiram a r05: o rótulo com objeto+motivo virou parágrafo dentro da barra e o cartão perdeu a tese para um nome de catálogo |

E a diretriz do Founder, de 2026-09-20, sobre o mesmo cabeçalho que aparece em todas as rotas:

> "Tem que dar uma rodada geral e observar essas coisas. Essa barra de buscar aqui, horrível também; o Ctrl K é
> muito óbvio IA. Quando acabar tudo, tem que fazer uma puta varredura para ver esses detalhes."

## Escopo

O cabeçalho, a busca e a navegação móvel — o **chrome inteiro**, de uma vez, porque ele aparece em todas as rotas
e porque os tiques dele têm a mesma causa. Mais as duas lacunas dos critics da r06. A retomada chega pronta da
rodada própria; aqui ela só precisa entrar sem perder a hierarquia da r05.

Fora de escopo nesta rodada (vão para a r08): portais e seta de linha (T16, T17), colofão (T15), trilho de
progresso (T19), registro sem sequência (T24).

## 0 — Duas regras de sistema, antes de qualquer peça

A varredura mostrou que os 38 tiques caem quase todos em duas famílias. Corrigidas como regra, caem mais de vinte
linhas de uma vez. Elas entram no sistema agora e valem para toda superfície daqui em diante:

1. **Nenhuma caixa default.** Retângulo com fio em volta não é campo, não é botão, não é rótulo de mapa, não é
   chip de metadado, não é empty state. Onde hoje há caixa, há **fio de tinta, superfície ou nada**. A caixa
   sobrevive só onde é objeto do atlas (cartela gravada, cartucho), e aí tem a forma do objeto, não a do
   retângulo.
2. **Nenhum círculo de formulário.** Disco preenchido com inicial, anel com pictograma e a série vazio / meio /
   cheio são radio button e checkbox. Posição e estado têm vocabulário próprio na casa — a banderole "VOCÊ ESTÁ
   AQUI" com pontas entalhadas, os fólios, os glifos de marco — e é esse que vale. O círculo pleno continua sendo
   a exceção de raio do S2, e ela não se gasta em avatar.

Junto com elas, três decisões de sistema que hoje divergem por superfície:

3. **Um vocabulário só de posição e estado** (T18, T11, T28, T29). A marca de posição é a mesma no globo, no
   localizador, na nav ativa, na linha da aula corrente e na barra móvel — muda de escala, não de forma. Estado
   continua por silhueta **e** palavra (S3), nunca por faixa de acento colada à borda.
4. **Foco como marca de registro** (T27): colchetes de tinta nos cantos ou o par de marcas de apontamento da
   carta, com folga, ≥3:1, nunca sob o cabeçalho. Nada de retângulo de 2px do reset.
5. **Dois tratamentos de ligação, não um** (T7): remissão de aparato (termo, fonte, "sobre esta figura") e
   travessia entre superfícies (ir para outra rota) não podem usar o mesmo sublinhado de 1px na linha de base.

## 1 — A busca: campo, atalho e diálogo

Três tiques, um componente. É o que o Founder apontou com o dedo.

**T1 — "Ctrl K" sai.** A pílula de keycap em `src/components/alexandria/shell/AlexandriaHeader.tsx:190` é a
assinatura literal do command palette, e ela **some a 390 e a 768** — o que prova que é enfeite, não função. O
mesmo tique não pode reaparecer como chip "FECHAR ESC" dentro do diálogo (T1b). Se o atalho for anunciado, é uma
vez, dentro do diálogo, em linha de aparato, sem caixa e sem fio, do jeito que uma convenção de consulta se
imprime no pé da folha.

**T8 — o campo.** Hoje é um search input de ~300px com fio, fundo claro e placeholder que lista categorias
("aula, módulo ou termo") porque o campo não sabe se explicar. Trocada a fonte, é Notion ou Zendesk. A forma da
casa é a **entrada de índice remissivo impressa**: palavra de chamada em versalete assentada sobre fio de tinta —
o fio **é** o campo —, sem caixa, sem fundo, sem placeholder. A instrução vive no diálogo, não no campo.

**T10–T13 — o diálogo** (`src/components/alexandria/busca/BuscaDialogo.tsx`). Hoje é um cmdk/Algolia ponto a
ponto: modal flutuante centralizado com fio, query row fixa, lista rolável, calha de rótulos de tipo repetidos
(AULA / TERMO, seis vezes), dica de teclado por item ("ENTER ABRE A AULA →") e resultado selecionado com faixa de
acento à esquerda sobre fundo tingido. O único sinal de casa é a tipografia.

O índice remissivo **ocupa a folha**, não uma janela:
- coluna de entradas com o **fólio na margem** (M01·A08 já diz que é aula; Léxico M01 já diz que é termo — a
  calha de tipo sai);
- resultados **agrupados por território e módulo**, com cabeçalho de seção, não etiqueta linha a linha;
- hierarquia por tipografia e fio, nunca por caixa;
- a posição do learner aparece como **marginália** ("você está aqui"), com a marca de posição do sistema, não com
  faixa de acento;
- o gesto se ensina **uma vez**, em aparato, no pé da folha, junto com o Esc.

Gates a preservar: S5 (a busca só existe porque é real; abre por gatilho rotulado, fecha com Esc, começa fechada,
sem placeholder), S7 (operável por teclado, foco ≥3:1 nunca sob o cabeçalho, ≥11px, ≥4,5:1, alvo ≥44×44 a 390),
S2 (raio 0, zero sombra e vidro, uma ênfase por viewport), §6 (nenhum controle inerte).

## 2 — O resto do cabeçalho, na mesma passada

**T3 — a conta.** "PROGRESSO" + disco navy com a inicial é o botão de perfil de Gmail e Slack, e é o **único
elemento redondo da tela**. Vira marca de posse do caderno: ex-líbris ou carimbo de registro, iniciais em
versalete dentro de moldura de fio. O rótulo diz o que abre ("seu registro"), não o eixo de progresso — progresso
não é status de cabeçalho (S3). A 390 e a 768 ele não pode degenerar em disco solto.

**T14 — um desenho para três atos.** BUSCAR, ENTRAR e FECHAR usam hoje o mesmo retângulo com fio. Três atos, três
formas: busca é entrada de índice (fio, sem caixa); conta é selo de registro; fechar é marca de aparato. Se dois
atos têm a mesma forma, um deles está errado.

**T28 — nav ativa.** Sublinhado sob o item ativo colide com o sublinhado de link comum: o mesmo traço diz
"clicável" num lugar e "você está aqui" no outro. Usa a marca de posição do sistema (regra 3), com o fio como
reforço secundário.

**T6 — localizador.** "Início › Glossário" em faixa de largura total, com chevron e primeiro item sublinhado, é
page-header de painel de configurações. Vira rota de expedição: fólio + território, separador da própria carta,
nomes em versalete de aparato, item atual não é link e leva `aria-current`. Continua sobrevivendo à rolagem, em
≈32px com o cabeçalho recolhido.

**T30/T31 — largura.** A 3440 o chrome fica ilhado num container capado enquanto a gravura sangra, e o cabeçalho
flutua entre duas faixas mortas; a 768 a nav global some inteira e vira barra de telefone num tablet que tem
largura de sobra. Decisão única: **o cabeçalho é a margem da folha** — acompanha a folha inteira, com fio de
margem até a borda, ou a folha é capada junto com ele. A 768, os quatro territórios cabem no cabeçalho ou numa
linha de rota própria.

## 3 — Celular: o 1º viewport e a folha MAIS

**T5 — barra inferior.** Cinco itens com ícones de biblioteca (line chart, documento, estante) e "MAIS" em
hambúrguer é tab bar de iOS sem uma linha desenhada pela casa. Ou glifos de carta gravados, um por destino (rosa
dos ventos, marco de rota, marca de remissão, ficha), ou barra sem ícone — só palavra em versalete com a marca de
posição sobre o item atual. "MAIS" nomeia o que abre. Gates: alvo ≥44×44, rótulo não cortado, glifo ≥3:1, sem
rolagem horizontal, item ativo por mais que cor.

**T25 — a folha MAIS.** Hoje é uma lista de configurações de app, e a seção "SEÇÕES" repete os quatro itens da
barra inferior da mesma tela, com a metade de baixo vazia. Vira sumário do atlas: folha de rosto com os três
territórios e seus fólios (M01–M05, M06–M12, M13–M17) e o registro do learner como marginália. Nada do que a
barra inferior já leva. Gaveta temporária do S5: gatilho rotulado, Esc, começa fechada, sem placeholder.

**System r06 — o que falta abaixo de 1440.** Nomes de território, legenda de estados e a declaração de classe da
figura precisam existir no 1º viewport a 390 e 768 também. Se o objeto não couber com eles, o objeto encolhe ou a
composição muda — a legenda não é opcional (§7).

## 4 — O globo mostra o percurso dentro do módulo

Lacuna do Brief na r06: em E2 o globo é quase igual ao de E0. Ele marca **qual** módulo, não **onde dentro dele**.
Em E2 (M01·A08 em leitura, sete aulas percorridas) o objeto precisa dizer as três coisas em um golpe de vista:
território atual, módulo atual e **posição na rota de nove estações do módulo**. O número já é verdadeiro em todas
as outras superfícies ("7 de 9") e não pode divergir aqui (S3).

Continua valendo o que a r06 ganhou: uma só chapa, papel e tinta medidos na prancha, sombra de contato em três
camadas, letreiro fora do disco sem colisão. **Nada de refazer o globo** — o percurso entra no vocabulário que já
existe (estações de latão, marca de posição, fio de rota percorrida × por vir), sem cor nova e sem cobrir rótulo.

## 5 — A retomada entra sem perder a hierarquia

O bloco vem pronto de [`retomada.md`](retomada.md), como componente único usado na Home e nas Trilhas. Ao
integrar, a regressão da r06 precisa estar corrigida: **a tese ocupa o lugar de destaque** (não o nome de
catálogo da aula) e **a ação é um rótulo curto** com objeto e motivo — não um parágrafo dentro de uma barra. Uma
ação principal só (S1), alvo ≥44×44 a 390, contraste ≥4,5:1, sem barra cheia navy, sem faixa de acento.

## Verificação

- `npx tsc -b` limpo (nunca `--noEmit`) e `node tools/gridalpha-detect/bin/gridalpha-detect.mjs src` com 0 P0.
- Captura em `captures/A/r07` com o plano da peça, incluindo `search-E2-1440`, `home-E2-390`, `home-E2-768`,
  `home-E2-390-mais`, `shell-glossario-E2-1440` e os filmstrips de teclado e de rolagem; `--closing` (1280, 1920,
  3440) antes de fechar.
- `legend.json`: sem transbordo, `minFontPxShell` ≥ 11, `smallTargets` vazio, `truncatedText` do shell vazio,
  mídia com classe declarada.
- **Teste do recorte-e-cola**, elemento por elemento do chrome: se o elemento pudesse ser colado em qualquer SaaS
  sem ninguém notar, ele não passou. Vale para o que esta rodada criar, não só para o que ela substitui.
- Comparação cega da r07 contra a r06 e contra o North Star, em E0 e E2, a 1440 e 390.
