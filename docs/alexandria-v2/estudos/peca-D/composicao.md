# Peça D — composição das três superfícies

**Régua:** [`../../bar.md`](../../bar.md) v1.1 — §5 (D1–D6), S1–S7, §6, §7, §0.
**Medição que sustenta cada linha:** [`o-que-existe.md`](o-que-existe.md). **Nenhum número desta proposta é novo**:
todos vêm de lá, com arquivo e linha. Onde a medição diz "não sustentado", a composição **não desenha o objeto** —
não desenha uma versão menor dele.

**Herança já aprovada, usada e não reinventada:**

| Frente | De onde vem |
|---|---|
| Marcas do chrome (✳ Glossário, ‡ Biblioteca, flâmula de posição, entrada de índice, ligação, foco, separador) | [`../../media-lab/marcas-do-chrome/final/marcas.json`](../../media-lab/marcas-do-chrome/final/marcas.json) |
| Medalhas, série r04 — 74 artes, 96/192/384 px WebP com alfa, flan para não obtida, folha de silhuetas a 24 px | [`../../media-lab/movimento-e-conquistas/medalhas/`](../../media-lab/movimento-e-conquistas/medalhas/), `CORRECOES.md` §"Aceite medido da série" |
| Catálogo de conquistas (30 modelos, 4 famílias, critério em 1 frase) | [`../movimento-e-conquistas/sistema-de-conquistas.md`](../movimento-e-conquistas/sistema-de-conquistas.md) |
| Tokens de movimento (`entrada` 280, `continuidade` 400, `chegada` 250, curva `traco`, contrato de movimento reduzido) | [`../movimento-e-conquistas/sistema-de-movimento.md`](../movimento-e-conquistas/sistema-de-movimento.md) §2 |
| Tronco comum e moldura canônica das aulas | [`../aulas/SISTEMA.md`](../aulas/SISTEMA.md) §2 |
| Tokens de cor, tipo, espaço | `src/design/alexandria-tokens.ts` |

**Princípio único desta peça.** Progresso, Glossário e Biblioteca são as três superfícies onde é mais barato mentir:
percentual sem escopo, conquista que alega competência, verbete sem âncora, biblioteca como parede de cards. A
composição inteira é organizada para que **a mentira fique difícil de escrever**, não só proibida.

---

# 1. PROGRESSO — "O seu registro"

Rótulo da superfície: **Progresso** (a conta chama-se "Conta", e fica por último). Nunca "Perfil", nunca
"Dashboard", nunca "Certificado" (**P18**).

## 1.1 A forma: a carta, depois o registro, depois o caderno

Uma coluna editorial de leitura, não uma grade. **Sem rail, sem gaveta, sem card de mesmo peso** (S5, §6).
A 1440, a ordem vertical é exatamente a ordem sugerida do D1:

| # | Bloco | Forma | O que sustenta (medido) |
|---|---|---|---|
| 0 | **Cabeçalho** | Cinzel, uma linha: "O seu registro" + localizador com flâmula `posicao` | — |
| 1 | **Onde estou** | **Carta do território atual**, gravada, ocupando a largura da coluna: a ilha do território, a estrada, as estações dos módulos, o trecho percorrido em tinta cheia e o resto em traço. A flâmula `posicao` crava a aula atual | `aula_status` (141 aulas, 17 módulos, 3 territórios) |
| 2 | **Agora** | Uma linha de texto com objeto nomeado e motivo, e a travessia (`ligacao.travessiaEntreSuperficies`, fio de rumo com batente de 90°) — não um botão de CTA | `aulasEmAndamento`, ou a primeira não percorrida |
| 3 | **A revisar** | **linha de metadado**: "a revisar — ainda não disponível" | S4 L312. Não existe sinal de revisão em lugar nenhum (`o-que-existe.md` §1.6) |
| 4 | **Demonstrado** | **linha de metadado**: "Demonstrado — ainda não avaliado" + uma frase: "nenhuma tarefa do currículo ainda é avaliada" | S3 L248, P5, P18 |
| 5 | **Avaliações do módulo** | **não desenhar.** Nenhum quiz existe no produto | §6 "Ausência desonesta": nada de placeholder de função inexistente |
| 6 | **Percorrido, por módulo** | **Limbo graduado**: dezessete arcos numa régua vertical, um por módulo, com o número de aulas do módulo em tiques e os percorridos fechados. Ao lado, em Lora, "M04 · Economia de Mercados de Energia · 3 de 7" | `aula_status` × `AULAS_POR_BLOCO` |
| 6b | **Praticado** | **linha de metadado sob o mesmo limbo**: "Praticado — ainda não disponível" | `o-que-existe.md` §1.2: os eventos existem, ninguém emite, nada lê |
| 7 | **Atividade recente** | **não desenhar nesta wave.** Não existe rota que leia o log | `o-que-existe.md` §1.2 e pendência 3 |
| 8 | **Caderno de campo** (motivação) | separado por um **fio de tinta de largura inteira e um intertítulo em Cinzel**, abaixo de tudo o que é evidência. Corpo menor | S3 L253–256 |
| 9 | **Conta** | última, discreta: nome, e-mail, "membro desde", "Gerenciar conta", "Sair". Marca **NIVAR** quando o sujeito é a empresa | P24 |

## 1.2 Os números, um por um, com escopo

Cada número desta superfície carrega escopo **na mesma linha**, em Lora, sem abreviar:

| Na tela | Escopo dito | Eixo |
|---|---|---|
| "Percorreu 23 das 141 aulas do currículo" | 141 = catálogo completo; as 141 têm corpo | Percorrido |
| "16 % do currículo percorrido" | única forma de percentual permitida: **um eixo, um escopo** | Percorrido |
| "Território I · 12 das 42 aulas · 2 dos 5 módulos concluídos" | por território | Percorrido |
| "Praticado — ainda não disponível" | sem número | Praticado |
| "Demonstrado — ainda não avaliado" | sem número | Demonstrado |

**Proibido nesta superfície, por medição e não por gosto:**

- qualquer percentual que some eixos (S3 L249–252);
- "N de 13 insígnias" — 0 regras existem, o denominador promete progressão inexistente;
- "+N XP" — campo do cliente, não persistido, não extraído;
- **"Sequência: N dias"** — o número é errado por construção (UTC + qualquer evento conta). **Fora da tela até as
  duas correções do CURSOR.** Não entra nem como "0 dias", nem como rótulo de ausência: mostrar um relógio quebrado
  com uma etiqueta não o conserta, e o §6 reprova placeholder de função inexistente antes de o S4 permitir a
  etiqueta;
- **"Certificado"**, "Aprovado", "Dominado", "mastery" (P18, S3 L263);
- **"confirmadas", "extraída", "extração", "aulas confirmadas", "backend", "wave"** (S4 L316–320).

## 1.3 O Caderno de campo — conquistas honestas (D2)

**Forma.** Não é uma fileira de insígnias. É uma **folha de contato gravada**: as medalhas da série r04 em
`96 px` numa retícula de aparato, agrupadas por família, com a legenda em Lora ao lado — como a folha
`contato/silhuetas-48-cinza.png` já provou que lê.

**Três estados, distintos em espécie e não por cor** (S3 L264–266):

| Estado | Arte | Texto |
|---|---|---|
| Obtida | a medalha cunhada (camadas cego → campo → figura → orla, luminância monotônica, aceite em `CORRECOES.md`) | nome · critério em 1 frase · **data real de `badge_award.awarded_at`** |
| Não obtida, computável hoje | **flan** — o disco em branco, sem relevo (`_flan-{G,M,P}-cega`) | nome · critério em 1 frase · nenhuma data |
| Depende do §9 | flan com o limbo apenas riscado | nome · critério · **"em desenho"** numa linha de metadado, sem controle (S4 L310, P16) |

**O que entra hoje.** Só a família **CONCLUSÃO** (`sistema-de-conquistas.md` §2.1): 7 modelos, 29 instâncias,
computáveis a partir de `aula_concluida`. **Com a trava de P8:** quando a contagem do módulo não estiver
reconciliada, a regra devolve **"indisponível"** — nunca `false`, nunca `true`, e **nunca "título a confirmar" na
tela**. PRÁTICA, EXPLORAÇÃO e HÁBITO ficam como flan com "em desenho".

**Vocabulário.** Toda conquista afirma **comportamento**, nunca capacidade: "Concluiu as 9 aulas do M01", nunca
"Domina a física da eletricidade". Nenhuma palavra de competência abaixo do fio (S3 L254–255).

**Movimento (Momento 8).** Revelação por cunhagem: cego → campo → figura → orla, `entrada` 280 ms por passe,
`escalonamento` 120 ms, curva `entra`. Sem bounce, sem confete, sem bloqueio de fluxo. Com
`prefers-reduced-motion`, a medalha chega **no estado final** num corte de `estado` (150 ms).

## 1.4 Viewports

**1440.** Coluna de leitura de ~720 px centrada, com a carta do território sangrando até ~1000 px. Densidade
40–60 elementos (S7).

**390.** Mesma ordem, sem reordenar. A carta do território vira **faixa horizontal com rolagem interna contida**
(nunca rolagem horizontal da página, §6). O limbo de dezessete módulos empilha em linhas de rótulo + tique.
Nada depende de hover (D6). Alvos ≥ 44×44 px, fontes ≥ 11 px.

## 1.5 O teste do §0, aplicado

Verificado a 1440, em E2, no 1º ou 2º viewport. Marcadores presentes — **4 de 6**, mínimo é 3:

1. **Território com a posição do learner** — a carta do território com o trecho percorrido e a flâmula `posicao`.
2. *(fonte junto a número — não aplicável: os números são sobre o learner, não factuais do domínio.)*
3. **Ato do learner registrado** — o bloco "Percorrido, por módulo" e as conquistas com data real do evento.
5. **Classe de imagem honesta** — as medalhas são rotuladas como gravura de conquista, nunca como evidência (§7).
6. **Gravura/cartografia que faz trabalho** — a carta **organiza** o progresso (é o eixo do bloco 1), não decora.

---

# 2. GLOSSÁRIO — "O índice remissivo"

**A entrada alfabética sai da porta.** É FAIL automático (`bar.md` L1259, T21), e a medição mostra por quê: 637
verbetes em 23 letras é uma lista de 637 linhas em que quatro "PLD" caem em sequência sem que nada diga que são
quatro olhares diferentes sobre a mesma palavra (`o-que-existe.md` §2.4).

## 2.1 A porta: a carta do léxico

O primeiro viewport **não tem lista**. Tem uma **carta do léxico** — a mesma linguagem da carta do território,
aplicada ao vocabulário: três territórios, dezessete estações, e em cada estação o peso do vocabulário daquele
módulo desenhado como densidade de trama (não como número solto). Sob a carta, uma linha em Lora com a **cobertura
declarada uma vez**:

> "637 verbetes, dos 2.124 termos do currículo. Oito dos dezessete módulos têm o seu vocabulário no atlas."

A **entrada de índice** (`entradaDeIndice` de `marcas.json` — chamada em Cinzel 12 px / 0,16em sobre fio de tinta
de 1,1 px, 1,6 px no foco, sem caixa, sem fundo, sem placeholder) fica **só no cabeçalho**. Dentro da superfície
não há segundo campo (T20 — ver §5).

## 2.2 Os recortes, e o dado que sustenta cada um

| Recorte | Sustentado por | Cobertura medida | Como se comporta onde falta |
|---|---|---|---|
| **Território** | módulo → trilha (`ALEXANDRIA_MODULES`) | I **296** · II **341** · III **0** | O Território III aparece **nomeado, com a palavra** — "vocabulário ainda não disponível". **Nunca como "0"** (S4 L303) |
| **Módulo** | prefixo de id (`gl-mNN-`) | 8 de 17: 38 · 65 · 63 · 58 · 72 · 99 · 118 · 124 | Os nove restantes aparecem na carta, nomeados, com "ainda não disponível". A carta continua completa; o que falta é dito |
| **Aula** | `aulaIds` derivados | **119** verbetes · **158** pares · **47** de 141 aulas | Este recorte **não é uma porta**: ele vive **na aula** (D6, §4.3). No Glossário, existe como filtro "termos desta aula" só quando se chega vindo de uma aula |
| **Família do léxico** | `familias`/`grupos` da fonte | **471** verbetes (M04–M08, 4–7 famílias por módulo) | **Não existe para M01–M03**: ali `unit` é micro-etiqueta (93 rótulos para 166 termos), não família. O recorte por família aparece **dentro da página do módulo**, e só nos módulos em que a fonte declara família. Inventar famílias para M01–M03 é conteúdo novo (P3/P11) — **não fazer** |
| **Sem âncora** | `aulaIds: []` | **518** | Filtro nomeado, exposto: "termos ainda sem âncora de aula · 518" |
| **A–Z** | letra inicial | 23 letras | **Recorte secundário**, alcançável a partir de qualquer vista. Nunca a porta |

**O caminho canônico:** carta → território → módulo → (família, onde existe) → verbete. Três toques até uma lista
de tamanho legível; a vista inicial cabe em **até 3 viewports** (D3 L1160).

## 2.3 O verbete (D4) — a exceção do §0 cumprida em cada item

O §0 (L99–100) substitui os seis marcadores por **duas exigências visíveis em cada item: fonte e âncora curricular
(ou "não declarado")**. Os dois dados existem para os 637 — desde que a âncora diga de onde veio.

Cada verbete, em **rota própria** (D4 L1171), na forma de entrada de dicionário gravado:

```
PLD                                                   ✳
Preço de Liquidação das Diferenças
Formação de preço e despacho                          ← família, onde a fonte declara

‹definição, literal da fonte, com o HTML inline preservado›

Fonte · § Lex do Módulo 04 · Economia de Mercados de Energia
Âncora · M04 · Aula 02 · «Como o preço se forma»
         âncora derivada do texto do currículo; a fonte não liga termo a aula
O termo ao longo do currículo · também definido nos Módulos 01, 02 e 07 — três definições próprias
Relacionados · CVU · ordem de mérito · submercado
```

**As quatro linhas que fazem o trabalho honesto:**

1. **Fonte** — sempre presente, para os 637: o § Lex do módulo, nomeado pelo título do módulo (não por código
   `§Lex`, que o S4 proíbe ao learner, L320).
2. **Âncora** — "M04 · Aula 02 · ‹título›" para os 119, **sempre com a linha de procedência**, porque 0 dos 2.124
   termos da fonte declaram vínculo com aula. Para os 518: **"Âncora · não declarado"**, uma vez, em linha de
   metadado — não a frase de 12 palavras repetida 518 vezes que existe hoje.
3. **O termo ao longo do currículo** — é isto que resolve os 87 excedentes sem apagar nenhum: as quatro entradas de
   "PLD" deixam de ser quatro linhas seguidas numa lista e viram **um verbete com quatro leituras nomeadas por
   módulo**, cada uma com a sua fonte. Nenhuma definição se perde e nenhuma se repete.
4. **Relacionados** — só dentro da mesma família declarada pela fonte. Onde não há família (M01–M03), a linha
   **não aparece** — em vez de relacionar por semelhança de palavra, que seria inferência.

**A âncora navega certo e rotula errado hoje**, e isto tem de mudar: `GlossaryTermCard.tsx` L62 chama
`getAulaModulo01`, que devolve `null` para qualquer aula fora do M01 (`alexandria-modulo-01-content.ts` L572–573).
Resultado: **85 dos 158 pares** renderizam o rótulo nu "Aula 3" — e "Aula 3" existe em oito módulos. A rota está
certa; o rótulo tem de trazer **módulo e título**, resolvidos por `getAula` do catálogo completo (D4 L1172).

**Estado salvo / a revisar:** requisito v2 do §9. Entra como **linha de metadado "ainda não disponível"**, nunca
como um controle de favoritar que não persiste (§6 "Controle inerte").

## 2.4 Viewports

**1440.** Carta do léxico com ~1000 px; verbetes em coluna de dicionário (termo à esquerda em ~260 px, corpo à
direita). **390.** A carta vira faixa com rolagem contida; o verbete empilha termo → família → definição → fonte →
âncora. Nada depende de hover.

---

# 3. BIBLIOTECA — "O registro de fontes"

**Não é uma parede de cards.** As quatro instituições em grade de mesmo peso que existem hoje
(`BibliotecaView.tsx` L185–195) são exatamente o sinal de render do hard gate (`bar.md` L1259). Saem.

## 3.1 A forma: abertura tipográfica, depois o registro

**Primeiro viewport, sem imagem e sem card:** um intertítulo em Cinzel, o lede do § Ref (verbatim da fonte) e a
**cobertura declarada uma vez** (D5 L1207):

> "427 fontes, dos dezessete módulos do currículo. As do Módulo 17 são oito blocos de fonte, não fichas
> individuais — a fonte as descreve em conjunto."

Depois, o **registro**: fichas em coluna, separadas por fio de 1 px, **nunca cartão com sombra ou raio** (S2).
Imagem só quando melhora o reconhecimento da fonte — capa de relatório, prévia de mapa, página do documento
(D5 L1205) — e sempre com classe declarada (§7).

## 3.2 Os recortes

| Recorte | Sustentado por | Cobertura |
|---|---|---|
| **Módulo** | § Ref de origem | **17 de 17** — 8 · 16 · 17 · 11 · 16 · 21 · 27 · 28 · 30 · 35 · 32 · 34 · 36 · 34 · 36 · 38 · 8 |
| **Território** | módulo → trilha | 3 de 3 |
| **Instituição** | campo da fonte | **221** de 427, 36 instituições. As 206 restantes ficam num recorte nomeado: "instituição não declarada" |
| **Tipo** | rótulo literal da fonte | **352** de 427, em 30+ rótulos livres. **Exibir o rótulo literal**, nunca normalizar — normalizar é decidir vocabulário, e isso é revisável (P3) |
| **Com link** | `url` | **103** de 427 |

## 3.3 A ficha (D5)

O D5 pede nove campos. A medição diz quantos existem. A ficha mostra **os nove, sempre**, e diz "não declarado"
onde a fonte não diz — é isso que a transforma de card em registro:

```
ANEEL                                                              ‡
Resolução Normativa nº 1.000/2021
Resolução normativa                                     ← tipo: rótulo literal da fonte

«Regras de prestação do serviço público de distribuição de energia elétrica.
 Em vigor desde 3 de janeiro de 2022; substituiu a REN 414/2010.»      ← citação verbatim

O que responde · não declarado
O que não responde · não declarado
Tema · não declarado
Recorte · não declarado
Última verificação · não declarado
Onde é usada · Módulo 01 · Física de Energia e Eletricidade
              a fonte declara a referência no nível do módulo; nenhuma aponta aula
www.aneel.gov.br
```

**As regras que a medição impõe:**

- **"O que responde" e "o que NÃO responde" são 0 de 427**, e escrever isso é conteúdo factual novo → **P3/P11,
  fora desta wave**. As duas linhas existem na ficha **como "não declarado"**, porque escondê-las esconderia a
  lacuna que o D5 nomeia.
- **"Onde é usada" leva ao módulo, não à aula.** O link "leva à aula" do gate D5 **não é cumprível nesta wave**:
  `vinculos.aulas_declaradas` está vazio nas 427 e `references: []` nas 141 aulas. O link para o **módulo** é real,
  é 427/427, e é clicável.
- **"Última verificação"**: onde a data é do módulo e não do item (M07, M08, M09, M10, M15, M16, M17), o texto diz
  isso — "verificada com o módulo em 1º de agosto de 2026" — e **nunca** carimba a data como sendo da fonte.
- **URL**: só onde a fonte escreveu link. Onde a fonte escreveu só o domínio como texto, o domínio aparece **como
  texto**. A reconstrução `https://${dominio}` que existe hoje (`BibliotecaView.tsx` L237) é um link que a fonte não
  fez; fora dos oito do M01, não se generaliza.
- **M17**: os 8 itens são **blocos de fonte**, e a ficha diz isso. Desagregá-los em fichas individuais seria
  inventar publicações. **Não fazer.**

## 3.4 O que a Biblioteca ganha em relação a hoje

| Hoje | Proposto |
|---|---|
| 4 cards institucionais + 8 referências do M01 | **427 itens, 17 de 17 módulos** |
| "1 de 17 módulos com bibliografia extraída" | "427 fontes, dos dezessete módulos" — e a palavra proibida sai |
| grade de cards de mesmo peso | registro tipográfico em coluna, com fio |
| sem campos do D5 | os nove campos, com "não declarado" onde a fonte cala |
| caixa tracejada "Documentos por aula — ainda não existe" | a âncora é o **módulo**, que é real e completa; a aula é "não declarado" na própria ficha |

---

# 4. IDA E VOLTA (D6)

| Caminho | Ações | Como |
|---|---|---|
| Termo → definição | **1** | ✳ ao lado do termo na aula → **prévia** in loco (`entrada` 280 ms, curva `entra`), sem sair da posição |
| Termo → verbete | **2** | da prévia, "ver o verbete" → rota própria (`continuidade` 400 ms no termo compartilhado) |
| Fonte → ficha | **≤ 2** | ‡ junto ao número → prévia → ficha |
| Ficha → módulo | **1** | `ligacao.travessiaEntreSuperficies` (fio de rumo com batente de 90°, 1,2 px, offset 5 px) |
| Voltar | 1 | `Esc` volta **um** nível (prévia → nada; ficha → prévia). A posição de rolagem é restaurada |

A 390, **nada depende de hover**: a prévia abre por toque e fecha por toque fora ou por `Esc` (D6 L1222).

A ligação usa os **dois tratamentos distintos em espécie** de `marcas.json`: **remissão de aparato** (o mesmo ✳ do
destino Glossário, 9 px, **sem sublinhado**) para termo e fonte; **travessia entre superfícies** (fio de rumo) para
mudar de tela. É isso que separa "clicável" de "você está aqui" por espécie, e não pelos 0,56 px que a varredura
mediu (T7 × T28).

---

# 5. OS TIQUES DA PEÇA D

| Tique | O que era | O que a composição faz |
|---|---|---|
| **T8** · campo de formulário com fio, fundo claro e placeholder de instrução | busca do cabeçalho (x≈935–1232) e a segunda busca do Glossário | A única busca do atlas é a **entrada de índice** de `marcas.json`: palavra de chamada em Cinzel sobre fio de tinta — **o fio é o campo**. Sem caixa, sem fundo, sem placeholder, sem keycap. A instrução vive no texto da página. *Metade já corrigida na r07 no Glossário (`GlossarioView.tsx` L107–144); falta levar ao cabeçalho e apagar a segunda.* |
| **T20** · segunda busca dentro da superfície | dois campos concorrentes na mesma tela | **Uma só busca**, no cabeçalho. Dentro do Glossário não existe campo: existe **recorte** — território → módulo → aula → família — dito em palavra e em aparato (§2.2). Dentro da Biblioteca, o mesmo, por módulo, instituição e tipo |
| **T21** · entrada alfabética A–Z | `GlossarioView.tsx` L62–74 particiona por letra; hard gate **Consulta morta**, FAIL | A porta é a **carta do léxico** (§2.1). O alfabeto sobrevive como **recorte secundário**, alcançável de qualquer vista, nunca como entrada. Cada item traz **fonte e âncora** (ou "não declarado"), cumprindo a exceção do §0 |
| **T24** · linha de sequência colada à tabela de evidência | "dias seguidos / maior sequência" a um fio da prova de competência; vocabulário de gênero proibido | Duas mudanças. **(a) Separação:** a motivação vive no **Caderno de campo**, abaixo de um fio de largura inteira e de um intertítulo, em corpo menor, com nome da casa — "dias de expedição", nunca "streak" nem "dias seguidos". **(b) Ausência:** enquanto a sequência for contada em UTC e alongada por evento de máquina, **ela não aparece** — o número é errado por construção, e número errado é o hard gate "Dado falso como real" (§6 L1250). Volta quando as duas correções do CURSOR entrarem |

Os quatro têm a mesma raiz: um componente importado (o search input) e um gênero importado (o app de hábito). A
composição não os "estiliza": troca o objeto.

---

# 6. O TESTE DO §0, POR SUPERFÍCIE

| Superfície | Regra | Verificação |
|---|---|---|
| **Progresso** | mínimo 3 dos 6 marcadores | **4** presentes: território com posição (1), ato registrado (3), classe de imagem honesta (5), cartografia que trabalha (6). Verificado a 1440, E2, 1º–2º viewport |
| **Glossário** | **exceção**: fonte e âncora curricular visíveis **em cada item**, ou o estado "não declarado" | Fonte: **637 de 637** (§ Lex do módulo, nomeado). Âncora: **119** com módulo + aula + título + procedência; **518** com "não declarado" em linha de metadado. Verificado buscando "PLD" e um termo inexistente, a 1440 e 390, em E0 e E2 |
| **Biblioteca** | mesma exceção | Fonte: **427 de 427** (§ Ref do módulo). Âncora: **427 de 427** no nível do **módulo**, clicável; a aula é "não declarado" com a razão dita uma vez. Verificado a 1440 e 390, em E0 |

---

# 7. O QUE ESTA PROPOSTA NÃO AUTORIZA

1. **Nenhum conteúdo factual novo.** "O que a fonte responde / não responde", família para M01–M03, tema, recorte,
   vínculo termo→aula declarado, desagregação dos blocos do M17: tudo isto é **ausente na fonte** e se declara
   ausente (S4), nunca se preenche por plausibilidade.
2. **Nenhum jogo.** P25: os jogos ficam fora desta wave. Onde uma experiência jogável for citada, é **uma linha
   "em desenho"**, sem controle e sem destino.
3. **Nenhum "Aprovado".** P18: a camada de conclusão chama-se **"Concluído"**. Nenhuma palavra de certificação.
4. **O quiz não é Demonstrado.** P5: quando existir, é "Avaliação do módulo: ‹resultado› · critério da fonte".
5. **Critério oral ou cronometrado é "atividade recomendada".** P14 — nunca sinal de competência, nunca conquista.
6. **P8 não se resolve aqui.** Divergência de título e contagem é reconciliação separada; **"título a confirmar" não
   aparece na tela**, e a regra de conquista devolve "indisponível" enquanto a contagem não estiver reconciliada.
7. **Nada em `src/`, `public/`, `index.html`, `app/` ou git foi tocado.** Esta é uma proposta de composição; a
   construção é de outra rodada, com o Design Loop e os três críticos de contexto limpo.

---

# 8. O QUE PRECISA DE OUTRA POSSE PARA A PEÇA FECHAR

| # | O que | Quem | Sem isso |
|---|---|---|---|
| 1 | Fuso e tipo de evento na sequência | CURSOR (`app/`) | o Caderno de campo fica sem a linha de dias |
| 2 | Endpoint de leitura do log | CURSOR | sem "atividade recente" e sem "dias distintos" |
| 3 | Emissão de `instrumento_usado` / `exercicio_respondido` com `metadata` fixado | LYCEUM + CURSOR | **Praticado** fica "ainda não disponível" |
| 4 | Campo de fonte em `GlossaryTerm` | dono do dado do glossário | a exigência do §0 não se cumpre sem inventar |
| 5 | § Lex dos M09–M17 (**1.487** verbetes) | dono do dado do glossário | Território III fica sem vocabulário |
| 6 | Modelo de dados de fonte com os nove campos do D5 | dono do dado da biblioteca | a Biblioteca fica nos 8 itens do M01 |
| 7 | Regras de conquista da família CONCLUSÃO (7 modelos, 29 instâncias) | LYCEUM | o Caderno de campo mostra 74 flans e nenhuma medalha |
