# Extração M02 — Como Funciona uma Rede Elétrica

Esta pasta é a **camada fonte** do Módulo 02. A fonte é `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo02.html`
(3.843 linhas, só leitura). Todo texto de conteúdo foi tirado do HTML por script, com origem
`{seletor, trecho_inicial, linha_aprox}`. Nada foi digitado, e nenhuma divergência foi resolvida: as duas leituras
ficam registradas. As decisões P17–P24 ([`../../decisoes/2026-09-16-ambiguidades-de-conteudo.md`](../../decisoes/2026-09-16-ambiguidades-de-conteudo.md))
valem depois, na camada de produto.

## Arquivos

| Grupo | Arquivos | Conteúdo |
|---|---|---|
| modulo | `modulo.json`, `modulo.md` | Identidade (título, subtítulo, hero-meta, horas, catálogo), tese (§ 00), resultado esperado e critério de passagem, § MAP, roteiro de 20 seções, critérios literais com P14, laboratórios (nenhum), § Voz, § Erros, "três níveis" (no lugar do Tradutor), comparação com o código |
| aparato | `aparato.json`, `aparato.md` | Caso Operação A, quiz (10 questões), checklist final (18), índice de exercícios (10), referências (16), glossário (65) |
| instrumentos | `instrumentos.json`, `instrumentos.md` | Os 9 INST: markup, script verbatim, cenário-padrão executado, varredura exaustiva do espaço de entrada, comparação com o código |
| verificação | `verificacao.json` | Literalidade, janela de origem e cobertura por token |

Os extratores ficam em `extratores/`. `lib.mjs` reúne leitura da fonte, DOM simulado e helpers. Os geradores são
`m02_modulo.mjs`, `m02_aparato.mjs` e `m02_instrumentos.mjs`; depois vêm `m02_verificar.mjs` e `m02_md.mjs`, que
gera os `.md` a partir dos JSONs. `p14.mjs` faz a marcação P14. Rode nessa ordem, a partir desta pasta, com
`node extratores/<script>.mjs`. O `m02_instrumentos.mjs` leva cerca de 1 min 30 s, porque varre 689.556 combinações.
Os scripts leem `src/lib/data` e o catálogo só para comparar, e escrevem apenas nesta pasta.

## Contagens

| Item | Fonte | Código | Catálogo |
|---|---|---|---|
| Seções `.aula` | 20 (10 aulas + 10 aparatos) | — | 20 |
| Aulas | 10 (os marcadores, as 10 linhas do § MAP e o h2 "Dez aulas" concordam) | 10 (`MODULO_02_AULAS`, `AULAS_POR_BLOCO`, `totalInModule`) | 10 |
| Subseções por aula | 5,5,5,4,4,4,3,6,4,6 | iguais | — |
| Instrumentos | 9, todos em aula (a Aula 06 não tem); 0 de módulo | 9 (1 portado, 7 divergentes, 1 não portado) | 9 |
| Termos do glossário | 65 (a prosa diz "Sessenta e cinco") | 65 `gl-m02-*`, todos iguais; **não falta nenhum** | 65 |
| Exercícios | **10** no markup (8 com aula, 2 sem); a prosa diz "Oito" | 10 (8 em aulas, 2 soltos) | **8** |
| Checklist final | 18 itens | 3 viraram badge | 18 ("dezoito verificações") |
| Quiz | 10 questões × 4 alternativas; gabarito BBBCBBBBCB; 4 faixas de placar | não portado | — |
| Capacidades | 8, mais um critério de passagem com 2 itens | não portadas | — |
| Perguntas do § MAP | 10 | não portadas | — |
| Critérios literais | 5 entradas em `criterio.criterios` (§ 00, § Quiz com as 4 mensagens de placar, § Final, § Voz, § Ex, que só registra "sem limiar"). As formas de critério também são 5: as 4 seções mais o placar | — | "declarado duas vezes" |
| § Voz | 30 perguntas-relâmpago e um roteiro oral de 7 parágrafos | não portado | 30 |
| § Erros | 8 | não portado | — |
| Caso | 6 dados, 5 leituras, 1 callout, 5 pedidos; 0 perguntas e 0 decisões | não portado | — |
| Referências | 16 itens em 2 grupos (11 com domínio, 0 com URL) | não portadas | — |
| Painéis "três níveis" | 18 (6 blocos × 3, em 6 aulas) | **0** | — |
| Callouts | 21 (4 de "Números vivos", 7 de produto/marca) | presentes | — |
| Laboratórios | 0 (zero ocorrência de "LAB") | — | — |
| Divergências registradas | módulo 15, aparato 9, instrumentos 8 | | |
| Lacunas registradas | módulo 11, aparato 6, instrumentos 5 | | |

**P14 (anotação inferida, a revisar).**

- **Capacidades (8).** Todas são oral/livre; uma é cronometrada: "cinco minutos de conversa".
- **Critério de passagem.** Sem consulta: explicação livre mais desenho num guardanapo.
- **Checklist (18).**
  - 16 são oral/livre e 2 são desenho.
  - 2 têm limite de extensão ("em duas frases").
  - 1 pede derivação (I²R).
- **§ Voz.** As 30 perguntas são orais; o roteiro é oral e cronometrado (5 min).
- **Automatizável.** Só o quiz, e pelo P18 o limiar dele não é evidência.

## Verificação

- **Literalidade.** 1.604 strings de conteúdo foram conferidas contra a fonte normalizada, com **0 falhas**.
- **Origem.** 378 origens foram conferidas; o `trecho_inicial` está a ±3 linhas da linha declarada em todas (**0 fora da
  janela**).
- **Cobertura por token.** Para cada seção extraída, tags viram espaço e cada token é consumido uma vez. Todas as seções
  dão **100%**: hero e rodapé, § 00, § MAP, § Caso, § Erros, § Ex, § Quiz (markup e questões do script), § Voz, § Final,
  § Lex, § Ref e o markup dos instrumentos.
- **Instrumentos.**
  - O script original foi executado sem reescrita em DOM simulado.
  - O espaço de entrada inteiro do markup foi varrido (689.556 combinações), com 0 NaN/Infinity.
  - Das combinações comparáveis, 0 divergem no cálculo numérico do código.
  - Um ramo nunca é alcançado: INST · 04, `minNet < 35`.

**Correções feitas nesta rodada, sobre a primeira versão dos extratores:**

1. A regex dos blocos "três níveis" fechava no `</div>` errado e perdia painéis. Agora usa um walker balanceado, com os
   18 painéis e a origem de cada um.
2. 18 `trecho_inicial` eram rótulos concatenados, que não existem na fonte (`A / B / C`, `INST · NN · título`). Agora
   são literais.
3. A origem do cabeçalho apontava para `<header>`, 4 linhas antes da marca. Agora aponta para a marca.
4. O medidor de cobertura colava tokens separados por tag ("00filosofia"), um falso negativo do medidor e não da
   extração.
5. Foram acrescentados `divergencias[]` e `lacunas[]` aos três JSONs, `leitura_entradas_verbatim` (com o fallback
   literal) aos instrumentos e `faixa_nota` ao placar.

**Verificação adversarial independente (2026-09-17).** A literalidade foi reconferida por varredura global e na janela
de cada origem. Quiz, checklist e fórmulas dos instrumentos foram conferidos a 100%, e todas as contagens foram
recontadas no HTML: todas batem. O ramo morto do INST · 04 foi re-simulado. Duas origens erradas foram corrigidas no
extrator e regeneradas; o detalhe está na seção "Verificação" de `modulo.md`:

1. `div-m02-04`: a origem do "8 exercícios" apontava para a L111 do catálogo, que é a Escala do M01. O certo é a L192.
2. `div-m02-09`: a origem apontava para `.alex-brand`, e não para `.header-meta` ("Cobaia Zero", L1246).

**Segunda verificação adversarial (2026-09-17).** Outro verificador refez tudo com método próprio:

- literalidade global;
- quiz, checklist e as 185 linhas de fórmula/ramo a 100%;
- cenário-padrão dos 9 instrumentos, rodando o script original num DOM próprio;
- todas as contagens, recontadas no HTML;
- as 32 divergências.

Nenhum conteúdo errado e nenhuma contagem diferente. Houve três correções, todas regeneradas pelos extratores (o
detalhe está na seção "Verificação" de `modulo.md`):

1. `m02_modulo.mjs` somava o índice ao início do match, e não ao do grupo capturado. Por isso as origens do hero, do
   cabeçalho e do rodapé saíam 1 linha cedo (dentro de ±3). Por exemplo, o h1 passou de L1323 para L1324.
2. `identidade.rodape.origem` passou a apontar para a `.footer-brand` (L3100), e não mais para `<footer>` (L3098).
3. `criterio.nota_p18` e a linha "Critérios literais" desta tabela agora descrevem a mesma composição.

Um esclarecimento, sem mudar número: os "25 ramos alcançados" contam chaves de texto mascaradas. O script tem 27 ramos
`if/else`, dos quais 26 são alcançados.

## Divergências principais

A lista completa está em `divergencias[]` de cada JSON e na seção final de cada `.md`.

**Fonte × fonte**

- **div-m02-01/02 · critério em cinco formas.**
  - § 00: "Você passa no Bloco 2…" (2 itens).
  - § Quiz: "8 de 10".
  - § Final: 18 itens "e o quiz fechar em 8/10".
  - § Voz: oral.
  - Placar do script: com **7** já manda "avance"; com **8** diz "Revise"; "Pronto para o Módulo 03" só com ≥ 9.

  É a mesma contradição do M01, e o P18 se aplica.
- **div-m02-03 · § Ex.** A prosa diz "Oito exercícios", mas há 10 `div.exercise`. Confirma o precedente do protocolo
  §5. Os Ex · 09–10 usam outra marcação (`exercise-label`, `reveal-btn`), sem aula (div-a02-06).
- **div-a02-01 · caso "Parte 2".** O primeiro pedido diz "(já solicitadas na Parte 1)", mas o caso do M01 não tem
  partes (P17).
- **div-i02-01 · numeração × ids internos.** INST · 04–09 usam ids `i08, i04, i09, i05, i06, i07`. Até o comentário
  HTML do INST · 07 diz "INSTRUMENT 05 … (display 07)".
- **div-i02-02 · ramo morto.** O ramo `minNet < 35` do INST · 04 nunca aparece.
- **div-i02-03 · fallbacks não nulos.** Com o campo vazio, a potência (INST · 06) e a carga (INST · 07) valem 1
  (`|| 1`), e o pico do dia (INST · 04) vale 95 (`|| 95`).
- **div-m02-10 · referências "Bloco N".** "Bloco 5 (mercado livre)" e "Bloco 9" (PLD) podem não bater com o catálogo
  atual (M05 é Regulação; M09 é ACR/ACL; o PLD também está no M04). Os Blocos 6, 7 e 10 batem. Não resolvido.
- **div-m02-15 · nível.** "Fundamentos · Nível 1", "Nível 1 · Fundamentos Universais" e "Nível 1 — Fundamentos
  Universais".

**Fonte × catálogo**

- **div-m02-04.** O catálogo diz "8 exercícios"; o markup tem 10.
- **div-m02-05.** O catálogo diz que o critério foi "declarado duas vezes, com a mesma substância"; há 5 formas, e o
  catálogo omite o 8/10 do quiz e o placar.
- **div-m02-06/07 · título (P24).** O título curto da fonte ("Como Funciona uma Rede Elétrica") é igual ao do
  catálogo, e o h1 é descritor editorial. A fonte do M01 chama o módulo de "02 · A Rede Elétrica".

**Fonte × código**

- **div-m02-14 (alta) · conteúdo de aula e de módulo ausente.**
  - Os **18 painéis "três níveis"** das Aulas 01, 05, 06, 07, 08 e 10 **não estão** em `MODULO_02_CORPO`.
  - Também faltam a tese, as capacidades, o § MAP, os critérios, o § Voz e o § Erros.
- **div-i02-04 (alta) · vereditos.** Os de INST · 02, 04, 05, 06, 07 e 09 são paráfrase abreviada, sem a interpolação
  numérica. O cálculo numérico bate em 100%.
- **div-i02-05 (alta) · tabelas textuais.**
  - A do INST · 01 (4 camadas × 6 células + nota dinâmica) não existe no código, que só devolve a chave da pílula.
  - Os trechos da cadeia do INST · 03 (4/6/8 por perfil) também não estão lá.
- **div-i02-06 · saídas textuais.** `i04-marg` (usina marginal, INST · 05) e `i07-flow` (INST · 09) não existem no
  código.
- **div-i02-07 · rótulos inventados.** Os rótulos "Seleção" e "Veredito" não existem na fonte. No INST · 07 há duas
  saídas chamadas "Veredito".
- **div-i02-08 · visuais (§12).** Não foram portados: o SVG do INST · 04 e do INST · 07, a cadeia do INST · 03 e a pilha
  do INST · 05.
- **div-a02-04 · gabarito truncado.** O gabarito do Ex · 07 está cortado no código (170 de 969 caracteres, com 1 dos 3
  níveis).
- **div-a02-05 · pontos sem origem.** O `points: 1` dos 10 exercícios não tem origem na fonte.
- **div-a02-08 · badges.** 3 dos 18 itens do checklist viraram badge. Os critérios são literais, mas name, category e
  expReward não têm origem.
- **div-m02-08 (P24/P7) · GridAlpha e blocos de produto.**
  - Na fonte, "GridAlpha" aparece 16 vezes e há 7 callouts de produto/marca: 4 "Onde isso entra no produto",
    "Pergunta de diagnóstico GridAlpha", "A tese de produto · Brazil Pulse" e "Linguagem GridAlpha para esse caso". Há
    ainda o hero-meta "Produtos GridAlpha".
  - O código ainda tem "GridAlpha" 9 vezes e 6 desses callouts (todos menos o do caso).
- **div-m02-09 · vocabulário interno.** "Cobaia Zero v2.0" no cabeçalho, "Summit" (3 vezes) e "Bloco 2".
- **div-m02-11/12/13 · detalhes do bloco e do comentário.**
  - As horas da fonte são "4 – 5 horas", mas o código tem `null`.
  - O prefixo `red-` convive com zero `<img>` na fonte.
  - O comentário do código diz que "o hero declara 'Dez aulas'", mas a frase está no h2 do § MAP.

## Lacunas (a fonte não tem)

- **Módulo.**
  - Faltam eixos e horas numéricas.
  - Não há h4 "Resultado esperado": o equivalente é "O critério de domínio deste módulo" mais 8 itens.
  - Não há § Lab nem § Map Tradutor; o mais próximo são os "três níveis" dentro das aulas.
  - O § Ex não declara critério, e nada liga aula a capacidade.
  - Nenhuma aula tem duração, dificuldade, vídeo ou imagem (0 `<video>`/`<iframe>`, 0 `<img>`).
  - O § Voz e o § Final não têm registro.
- **Caso.** Não há perguntas nem decisão pedida: as leituras chegam resolvidas. O P17 autoriza um Desafio de decisão na
  camada Alexandria.
- **Quiz, glossário e referências.**
  - Quiz e glossário não têm vínculo por aula.
  - As referências não têm URL, data de publicação nem tipo: só o caminho em `span.mono`, e as datas no texto são de
    evento ou norma.
- **Exercícios.** Não têm critério nem rubrica, e "Revelar gabarito" revela direto.
- **Instrumentos.**
  - Nenhum dos 9 tem pergunta própria, fonte dos números ou tolerância. As notas se declaram "didático", "ilustrativos"
    e "maquete pedagógica" (P19/P20).
  - Não há instrumento de módulo.
- **Fora do código.** Caso, quiz, referências e o checklist como estrutura.

## Observações para a camada de produto (não são decisões)

- **Ex · 09.** Usa exatamente o cenário-padrão do INST · 06 (20 MW / 80 MWh) e cita o "Erro 4 da tabela de mitos". O
  vínculo existe só em prosa (P9), e o exercício continua em recursos do módulo.
- **Gabarito do quiz.** Tem 8 de 10 respostas na letra B, um viés de posição a considerar ao redesenhar a avaliação
  (P18).
- **"Pelo INST·03" no caso.** A frase "5–6%" é consistente com a saída renderizada do perfil A4 ("~5,6%").
- **Kinds.** Os kinds do código são coerentes com `instrument-taxonomy.md`: explorador, simulador, cadeia de
  transformação, simulador ×2, calculadora, simulador, calculadora e simulador.
