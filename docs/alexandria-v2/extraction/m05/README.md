# Extração M05 — Regulação e Desenho de Mercados

A fonte é o HTML do M05: `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo05.html`, com 1.896 linhas (só
leitura). Esta pasta é a **camada fonte**:
- todo texto é verbatim e tem origem `{seletor, trecho_inicial, linha_aprox}`;
- toda ausência é `null` com nota;
- toda contradição fica com as duas leituras, sem resolução.

As decisões P17–P24 valem só na camada de produto. Aqui elas aparecem apenas como anotação.

## Arquivos

| Grupo | Arquivos | Conteúdo |
|---|---|---|
| módulo | `modulo.json`, `modulo.md` | identidade, § 00 (tese), § MAP, roteiro × código, critérios (P14/P18), voz, § Voz, § Erros, explicadores em três níveis, blocos de produto |
| aparato | `aparato.json`, `aparato.md` | § Caso, § Quiz (10 questões + placar), § Final (21), § Ex (10), § Ref (16), § Lex (72) |
| instrumentos | `instrumentos.json`, `instrumentos.md` | INST·01–06: entradas, saídas, fórmulas verbatim do script, ramos, cenário-padrão executado, comparação exaustiva com o código |
| verificação | `verificacao.json`, `extratores/verify-result.json`, `extratores/cobertura-estrita.json` | checagens de verbatim e origem, cobertura por token (global e estrita), grades dos instrumentos |

**Extratores** (`extratores/`, Node ESM, só leem a fonte e o código):

| Arquivo | Papel |
|---|---|
| `m05_lib.mjs` | Percorredor por `<section id>`. Falha em qualquer linha que não saiba classificar. |
| `m05_modulo.mjs`, `m05_aparato.mjs`, `m05_instrumentos.mjs` | Um extrator por grupo. |
| `m05_verify.mjs` | Verificação de verbatim e origem. |
| `m05_cobertura_estrita.mjs` | Cobertura por seção, só com nós ancorados na própria seção. |
| `m05_md.mjs` | Gera `modulo.md`, `instrumentos.md` e `verificacao.json` a partir dos JSON. |

`aparato.md` foi escrito à mão sobre `aparato.json`.

**Como reproduzir.** Rode, em ordem: `node m05_modulo.mjs`, `node m05_aparato.mjs`, `node m05_instrumentos.mjs`,
`node m05_verify.mjs`, `node m05_cobertura_estrita.mjs` e `node m05_md.mjs`. O código é lido por bundle esbuild
temporário, fora do repositório.

**Verificação.**
- **Verbatim e origem:** 2.227 checagens, 0 falhas.
- **Cobertura por token:** 100% nas 10 seções de aparato e no markup dos 6 instrumentos, tanto na medida global quanto
  na estrita. Na estrita, a primeira rodada deu 93,6–98,8% por **defeito do medidor**: título do instrumento, legenda e
  resumo das famílias não tinham âncora de linha. Depois de corrigir as âncoras, deu 100%.
- **Instrumentos:** cenários-padrão conferidos à mão contra o script:
  - INST·01: R$ 630/ano;
  - INST·02: 32/30/63 Jurídica;
  - INST·03: R$ 227,50/MWh;
  - INST·05: R$ 1,1 bi e 27% de remuneração, ramo ≥25;
  - INST·06: coerência 84, quadrante "Custo · só energia".

## Contagens

| Item | Fonte (markup) | Declarado na prosa | Código |
|---|---|---|---|
| Aulas | 6 (sec-id "Aula NN"), 16 seções no total | "Seis aulas" (§ MAP h2) e pílula "6 aulas" | `MODULO_05_AULAS` 6, `totalAulas` 6. Títulos, subtítulos e leads iguais nos 6 |
| Instrumentos | 6 (1 por aula, 0 fora de aula) | pílula "6 instrumentos" | 6 portados, **6 divergentes** |
| Termos (§ Lex) | 72 em 5 famílias (12/12/11/17/20) | "Setenta e dois termos", pílula 72, resumos das famílias | 72 `gl-m05-*` idênticos (termo, família e definição). **Nenhum falta no código** |
| Exercícios (§ Ex) | 10, **todos sem aula** (P9) | "Dez exercícios", pílula 10 | 10 idênticos em `MODULO_05_EXERCICIOS_SOLTOS`. `points: 1` sem origem |
| Checklist (§ Final) | 21 itens, todos orais/livres e sem consulta, 0 cronometrados | "Vinte e uma verificações" | ausente |
| Quiz (§ Quiz) | 10 questões × 4 alternativas, 2 faixas de placar | "Dez perguntas", pílula "10 questões · critério 8/10" | ausente |
| Caso | 1 seção, "Operação A — Parte 5": 8 perguntas de diagnóstico, dados null, decisão null | — | ausente |
| Referências | 16 (4 com URL, 0 com data) | — | ausente neste pacote |
| § Voz | 34 perguntas-relâmpago, 6 ataques, roteiro em 5 parágrafos | "trinta e quatro", "Seis" | ausente |
| § Erros | 12 | "Doze" | ausente |
| Critérios | 6 formulações (§ 00, hero, § Quiz, § Final, § Ex, § Voz) | — | — |
| Explicadores em três níveis | 6 × 3 painéis | — | só o painel 0 dos 6 |
| Blocos de produto (P7) | 7 (6 aulas + § Caso) | — | 6 como nota gold sem rótulo |

**Instrumentos em detalhe.** Os seis somam:
- 21 entradas numéricas, mais 8 sinais booleanos (INST·04);
- 24 saídas, das quais 4 textuais (`i2-b`, `i4-r`, `i6-q`, `i6-r`);
- 23 ramos de veredito (4+3+5+4+4+3).

Nenhum tem pergunta, fonte dos números ou tolerância. Nenhuma frase de aula invoca o instrumento.

## Divergências (25)

As fichas completas estão nos JSON (`divergencias`).

**Fonte × fonte**
- **mod-01:** o cartão da Aula 06 no § MAP diz "Desenho comparado"; o h2 diz "Desenho de mercado comparado". O código
  e o catálogo usam o h2.
- **mod-02:** a fonte chama o próprio módulo de "Bloco 5" e cita os outros como "Bloco 6" e "Bloco 9"; o kicker, o
  título e o rodapé dizem "Módulo 05".
- **mod-03:** o critério aparece em 6 formas (P18):
  - qualitativa no § 00;
  - 8/10 no hero, no § Quiz e no script;
  - 21 verificações orais no § Final;
  - voz alta no § Ex e no § Voz.

  Prosa, pílula e script **concordam** no 8/10, ao contrário do M01.
- **apa-03:** o § Ex diz "Em cinco deles há conta", mas só o Ex·04 mostra cálculo.
- **apa-04:** o § Ex e o § Final dizem que cada falha "aponta uma aula específica", mas nenhum item declara qual.
- **apa-05:** concordância. Todas as contagens declaradas batem com o markup.

**Fonte × decisões**
- **apa-01:** o caso é "Operação A — Parte 5", com as Partes 1–4 pressupostas nos módulos anteriores. Aqui "Parte" é
  texto da fonte; P17 fixa o título de produto.
- **apa-02:** o gabarito é sempre B. Chutar B dá 10/10 e a mensagem "Critério de domínio atingido".
- **apa-08:** o placar <8 diz "Não avance para o §Voz". P18 proíbe que um limiar legado trave a progressão.
- **mod-04:** "GridAlpha" aparece em 10 linhas voltadas ao learner (P24):
  - kicker (L255);
  - h3 4.6 "Onde isso vira a tese da GridAlpha" (L721) e 2 parágrafos da §4.6 (L722, L728);
  - box cético da Aula 04 (L732);
  - box de produto da Aula 06 (L996);
  - instrução de V.2 (L1190) e 1 ataque de V.2 (L1195) no § Voz;
  - item do § Final (L1242);
  - rodapé (L1376).
- **mod-05:** há 7 blocos "Onde isso entra no produto", mais a subseção 4.6 (P7).

**Fonte × código**
- **inst-01 (alta):** no INST·01, o campo "Operadores concorrentes" tem id `i1` no código, mas a calculadora lê
  `i['i1-n']`. Com o painel semeando por `field.id`, N fica 0 sempre: **0/360 casos numéricos corretos** (360/360 com
  os ids da fonte).
- **inst-02 (alta):** os vereditos dos 6 instrumentos são parafraseados, sem a interpolação numérica. Verbatim: 0 de
  todas as grades, exceto 3/768 no INST·04.
- **inst-03 (alta):** o código do INST·05 devolve um texto único, que não existe na fonte. A fonte tem 4 ramos, e o
  ramo bate em 0/972 casos.
- **inst-06 (média):** no código do INST·04, os sinais são `select` Presente/Ausente com "(N pts)" no rótulo, e a
  descrição do sinal some. Na fonte são checkboxes, e o peso só aparece na barra.
- **inst-07 (baixa):** as saídas do código são números crus com `unit` null, e `i1-pct` existe só no código.
- **mod-06 (média):** os explicadores em três níveis chegaram pela metade (0 de 12 painéis Executivo/Especialista).
- **mod-07 (baixa):** os rótulos `span.tag` dos boxes se perderam, e os boxes rd/cy viraram "neutro".
- **mod-08 (baixa):** o comentário de `alexandria-trilhas.ts` diz que os títulos do mapa "batem 1:1 com os `<h3>`". O
  cartão da Aula 06 não bate, e os títulos são h2.
- **apa-06:** os exercícios são idênticos, mas `points: 1` não tem origem.
- **apa-07:** o glossário é idêntico nos 72 termos.

**Código × taxonomia; contrato; lacuna**
- **inst-04:** `docs/alexandria/instrument-taxonomy.md` descreve o Termômetro pelo código ("8 selects", "5 saídas"),
  não pela fonte (8 checkboxes, 4 readouts + veredito). Os kinds `quebra-cabeca` (INST·04) e `simulador` (o "Mapa" do
  INST·06) usam nomes fora do enum da fonte. Fica para a FOUNDRY.
- **inst-05:** as saídas textuais ficam fora de `valores` (protocolo §12).
- **inst-08:** as constantes não têm procedência: CRF 10%, BC/BK, SP 200, pesos e posição do Brasil (85, 45). O
  disclaimer do INST·04 diz que "os pesos são arbitrários".
- **mod-09:** `alexandria-badges.ts` não referencia o M05, e a fonte também não define insígnia.

**Fonte × catálogo canônico: nenhuma.**
- **Título:** o h1, o `<title>`, o rodapé, o catálogo (L441) e `alexandria-blocks.ts` dizem todos "Regulação e
  Desenho de Mercados".
- **Escala:** a do catálogo (6/6/72/10/34/21/3–5 h) confere com o markup.
- **Trilha:** "Fundamentos Universais" é **atribuída** pelo catálogo; a fonte não a declara.

## Lacunas (a fonte não tem)

- **Módulo.**
  - Não há "Resultado esperado" nem capacidades (`itens` = null). As listas mais próximas são o § Final e o box de
    critério do § 00, e nenhuma foi promovida.
  - O § MAP não tem perguntas, só cartões descritivos.
  - Trilha, nível e eixos não são declarados. `horas.min` e `horas.max` são null (só existe "3–5h de estudo").
  - Não há § Lab nem Tradutor.
- **Instrumentos.** Pergunta, fonte dos números e tolerâncias são null nos 6 (P6/P19). Nenhuma invocação no texto.
- **Caso.** Não há dados numéricos, decisão pedida nem resposta de referência para as 8 perguntas. P17 autoriza o
  Desafio de decisão, só com os fatos do caso.
- **Vínculos.**
  - **Exercícios:** nenhum tem aula (as menções em prosa não são tag).
  - **Checklist, erros, termos e referências:** nenhum item declara aula.
  - **Quiz:** o único vínculo é o prefixo "Aula NN." na explicação.
- **Referências.** Nenhuma tem data nem tipo. Das 16, 12 não têm URL, e `instituicao` só é preenchida quando o rótulo
  a nomeia.
- **Por aula.** Não há duração, dificuldade nem vídeo. O corpo das aulas fica fora deste pacote: só entram o roteiro,
  os explicadores e os instrumentos.
- **Fora do código.** Não aparecem em `src/lib/data`: o caso, o quiz, o checklist, o § Voz, o § Erros, a tese, o
  § MAP e as referências do M05.
- **Anotação a revisar.** `marcacao_p14` é inferida do verbo e da instrução de cada item e precisa de revisão humana.
- **Não verificado na tela.** O efeito da inst-01 (N=0) foi medido chamando a calculadora do jeito que o painel
  semeia, não por clique.

## Resoluções do Founder aplicáveis (camada de produto)

| Achado | Decisão |
|---|---|
| Caso "Operação A — Parte 5", sem decisão pedida | P17: título "Caso — Operação A" e Desafio de decisão da camada Alexandria. O "Parte 5" fica só na proveniência |
| 6 formas de critério; placar ≥8 "Critério de domínio atingido"; <8 trava o § Voz | P18: nenhum limiar é critério nem trava; "Concluído" só para consumo |
| Instrumentos sem pergunta, sem fonte dos números e sem tolerância; constantes arbitrárias | P19: "cenário didático; fonte externa não declarada"; pergunta de previsão da camada Alexandria |
| GridAlpha em 10 linhas; "Bloco 5" × "Módulo 05" | P24: Alexandria/NIVAR; o catálogo governa o nome |
| 7 blocos de produto e §4.6 | P7: fora da interface |

## Verificação

Houve uma verificação adversarial independente em 2026-09-17, com parser e normalização próprios. O detalhe está em
`verificacao.json` → `verificacao_independente` e nas seções "Verificação" de `modulo.md`, `aparato.md` e
`instrumentos.md`.

- **Verbatim e origem (±3 linhas).**
  - Aparato: 694 checagens, 0 falhas.
  - Módulo: 640 checagens; as 9 acusações foram todas falso-positivo do medidor.
  - Instrumentos: 143 checagens, 0 falhas.
- **100% conferido:** as 10 questões do quiz (`var Q` avaliado de novo), os 21 itens do checklist, os 403 pares
  `{linha, codigo}` do script e os 23 ramos de veredito.
- **Contagens.** Todas as contagens declaradas foram recalculadas direto no HTML e conferem.
- **Reproduções.** Cenários-padrão refeitos à mão. Na grade do INST·01, os 27/360 ramos coincidentes foram
  reproduzidos. `m05_verify.mjs` foi rodado de novo e deu saída idêntica (2.227/0).
- **Divergências.** As 25 foram conferidas, e nenhuma é inventada.
- **Correção aplicada.** Na `div-m05-mod-02`, `leitura_b.onde` citava "§Voz lede, Aula 05 lede" sob o literal
  "Bloco 5". Nessas linhas a fonte diz só "Neste bloco" (L1148) e "do bloco" (L761); o literal "Bloco 5" está em
  L287, L325 e L1222. A correção foi feita em `modulo.json` e em `extratores/m05_modulo.mjs`. O gerador
  `m05_md.mjs` agora escreve a seção "Verificação".

**Segunda verificação adversarial (2026-09-17).** Feita com verificador e simulador próprios.
- **Verbatim e origem.** 1.967 checagens com janela de ±3 linhas. As 37 acusações são todas falso-positivo do medidor:
  - rótulos de aba, 4–5 linhas acima do painel;
  - títulos de instrumento ancorados no início da seção ou no intervalo `linhas`;
  - "Questão N de 10", gerado por template;
  - linha do catálogo;
  - condição anotada.
- **100% conferido.** O quiz, o checklist, as 271 linhas de script dos 6 instrumentos (igualdade exata de linha, sem lacunas nos intervalos) e os 8 sinais do INST·04 (soma de pesos 100).
- **Cenários-padrão.** Reexecutados em DOM simulado: R$ 630/ano; 32/30/63 Jurídica; R$ 227,50/MWh; R$ 1,1 bi e 27%; coerência 84 e "Custo · só energia".
- **Contagens.** Todas foram recontadas e conferem.
- **Divergências.** As divergências de código amostradas conferem no código (inst-01, inst-02, mod-08, apa-07).
- **Reprodução.** A rerrodagem dos 6 extratores deu os 10 arquivos gerados byte a byte idênticos.

**Correções:** nenhuma.
