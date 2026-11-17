# M07 · grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo07.html` (3.039 linhas, LF, 378.316 bytes).
Saída: [`modulo.json`](modulo.json). Extrator: [`extratores/m07_modulo.mjs`](extratores/m07_modulo.mjs).

**Como foi extraído.** O script localiza cada `<section id>` e percorre os filhos diretos de `.wrap`. Nenhum texto de
conteúdo foi digitado. Onde há HTML inline, o item traz `html` (literal, com espaços colapsados) e `texto` (sem tags).
Todo item traz `origem {seletor, trecho_inicial, linha_aprox}`.

**Vocabulário medido.** O M07 usa `sec-id`, `lede`, `inst`, `fi` e `box rd|gd|cy`, com zero `aula-marker`. É o vocabulário
dos M04–M17, e o extrator do M01 não serve aqui.

## Estrutura do JSON

| Chave | O que contém |
|---|---|
| `identidade` | `<title>`, kicker, h1, subtítulo, os 9 pills do hero, horas ("6–8h de estudo"), rodapé, catálogo canônico e catálogo do repo, e as 8 ocorrências de "GridAlpha" (P24) |
| `tese` | § 00: h2, lede e 22 blocos (4 subseções 0.1–0.4, 2 `div.form` e 2 callouts) |
| `resultado_esperado` | `null`: o M07 não tem bloco de capacidades |
| `mapa` | § MAP: h2, lede, parágrafo de uso do Inst · 01 e 8 cartões (7 aulas e o § Caso). `perguntas: null` |
| `roteiro` | 17 seções (7 aulas e 10 aparatos). Cada aula traz subseções, fichas, blocos "três níveis", instrumentos, callouts, a comparação com o código e a cobertura por token |
| `contagem_de_aulas` | Os sinais cruzados (todos dão 7) |
| `criterios` | 15 critérios literais com `marcacao_p14` |
| `laboratorios` | `null`: não há § Lab |
| `voz` | § Voz: 40 perguntas-relâmpago, 7 ataques (persona, pergunta e "O que a boa resposta contém") e 8 movimentos do roteiro oral (tema, duração e função) |
| `principios` | Frase para decorar, régua das quatro perguntas, callouts da tese, aviso do rodapé e o índice dos 31 callouts |
| `erros_comuns` | § Erros: 18 linhas erro × correção, mais ponteiros para os 7 `box rd` das aulas |
| `tradutor` | `null`: o M07 não tem Tradutor |
| `blocos_de_produto_P7` | As 7 caixas "Onde isso entra no produto", uma por aula |
| `divergencias` | 13 itens, todos com `leitura_a` e `leitura_b`. Nenhum foi resolvido |
| `comparacao_codigo` | Aula por aula: fonte × `alexandria-modulo-07-content.ts` |

## Identidade e catálogo (P24)

- **Título.** O h1, o `<title>` e o rodapé dizem "Estrutura Institucional do Setor Elétrico Brasileiro", e o catálogo
  canônico usa o mesmo título na seção do módulo. O catálogo do repositório (`alexandria-blocks.ts`, citado pelo próprio
  catálogo canônico) diz **"Estrutura Institucional Detalhada"**. A divergência fica registrada, sem resolução.
- **Subtítulo.** "O setor não tem um chefe. Tem sete funções…" (`p.sub`).
- **Horas.** A fonte só traz a string "6–8h de estudo". O código tem 6 e 8, e confere.
- **Trilha e nível.** A fonte não declara. O kicker diz "Alexandria · GridAlpha · Módulo 07", e o código usa level 2,
  track `brasil`.
- **Marca.** "GridAlpha" aparece 8 vezes (L352, 423, 1356, 1373, 1617, 1626, 1899, 1913). Pelo P24, o texto fica literal
  na camada fonte.

## Contagem de aulas (P8)

A fonte e o código concordam em **7 aulas**:
- sec-id `Aula NN`;
- pill do hero ("7 aulas");
- cartões do § MAP;
- `MODULO_07_AULAS`, com `totalInModule` 7;
- `AULAS_POR_BLOCO['bloco-07']`;
- catálogo canônico.

| Aula | Rótulo (sec-id) | Título (h2) | Subseções | Fichas | Inst |
|---|---|---|---|---|---|
| 01 | Política · MME e CNPE | Onde a diretriz nasce | 1.1–1.5 | 2 | 02 |
| 02 | Planejamento · EPE | Indicativo, não determinativo | 2.1–2.5 | 1 | 03 |
| 03 | Regulação · ANEEL por dentro | A agência é um processo antes de ser uma decisão | 3.1–3.8 | 1 | 04 |
| 04 | Operação · ONS | Uma entidade privada com função pública | 4.1–4.7 | 1 | 05 |
| 05 | Liquidação · CCEE | Onde o físico vira financeiro | 5.1–5.7 | 1 | 06 |
| 06 | Monitoramento e periferia | Os órgãos que não aparecem no organograma e travam projeto | 6.1–6.3 | 2 | 07 |
| 07 | Síntese · onde a frase não se sustenta | A decisão real atravessa quatro órgãos | 7.1–7.5 | 0 | 08, 09, 10 |

Os aparatos, em ordem, são: § 00 Tese, § MAP, § Caso, § Erros, § Ex, § Quiz, § Voz, § Final, § Lex e § Ref.

**Código.** Nas 7 aulas, `title` é igual ao h2, `subtitle` é igual ao rótulo, o lead é igual ao texto do lede, e os
instrumentos estão nas aulas certas. O corpo portado, porém, é incompleto.

| Aula | Cobertura por token do corpo portado | Blocos da fonte sem correspondente no código |
|---|---|---|
| 01 | 63,2% | `div.fi` ×2 (MME, CNPE); `ol.num-list` (anatomia da portaria) |
| 02 | 61,4% | `div.fi` (EPE); `ol.stp` (papel nos leilões); `ol.num-list` (seis verificações) |
| 03 | 76,0% | `div.fi` (ANEEL); `ol.num-list` ×2 (como contribuir; dez campos da REN) |
| 04 | 67,8% | `div.fi` (ONS); `ol.num-list` (três propriedades); `h4` e `ol.stp` (integração de instalação nova) |
| 05 | 62,5% | `div.fi` (CCEE); `ol.stp` ×2 (ciclo mensal; rito da migração) |
| 06 | 49,2% | `div.fi` ×2 (CMSE, CADE); `h4` e `ol.num-list` (como uma operação é analisada) |
| 07 | 99,9% | nenhum |

As **8 fichas institucionais** (`div.fi`, 8 linhas cada) não existem no código, que só guarda o h3 "Ficha institucional
· …". A causa provável são as listas `ol` e `div.fi`, que o extrator herdado descartava (protocolo §5).

## Critérios literais (P14)

A `marcacao_p14` é uma anotação desta extração e precisa de revisão humana.

| Id | Onde | Marcação |
|---|---|---|
| crit-hero / quiz-h2 | "10 questões · critério 8/10" | automatizável (quiz) |
| crit-quiz-lede | "Abaixo de oito, não avance para o §Voz…" | quiz, trava de avanço |
| crit-duplo-voz (+lede) | "O critério deste bloco é duplo": oral em **quinze segundos** e navegar portais sem tutorial | oral, **cronometrado**, operacional |
| crit-duplo-7-3 | "você consegue navegar todos os sites oficiais sem precisar de tutorial." | operacional |
| crit-15s-7-2 | "Quatro fatos, quatro endereços. É isso que o critério de domínio deste bloco pede em quinze segundos." | oral, **cronometrado** |
| crit-v1 / v2 / v3 | 40 perguntas em ≤15 s; 7 ataques em 90 s; roteiro oral de 10 min, gravado | oral, **cronometrado**, gravação |
| crit-final-h2 / lede | "Vinte e seis afirmações…" / "Marque apenas o que você consegue sustentar em voz alta" | oral |
| crit-final-sequencia | quiz 8/10 → 40 perguntas → 7 ataques → roteiro gravado → 6 exercícios de navegação "com o cronômetro rodando" | misto |
| crit-quiz-msg-pass / fail | mensagens do script para ≥8 e para <8 | quiz, trava |

Só o quiz é automatizável. Pelo P18, nenhum limiar declara domínio nem trava a etapa seguinte.

## Ausências declaradas

| Campo | Valor | Motivo |
|---|---|---|
| `resultado_esperado` | `null` | A fonte não tem bloco de capacidades |
| `mapa.perguntas` | `null` | Os cartões do § MAP descrevem, mas não perguntam |
| `identidade.eixos` | `null` | Não há eixos rotulados |
| `identidade.horas.min` e `.max` | `null` | A fonte só tem a string "6–8h de estudo" |
| `identidade.trilha_nivel` | `null` | A fonte não declara trilha nem nível |
| `laboratorios` | `null` | Não há § Lab. O instrumento de módulo é o Inst · 01 |
| `tradutor` | `null` | Não há § Map Tradutor |

## Divergências (detalhe em `divergencias[]`)

1. **Título.** O título da fonte e do catálogo canônico é "…do Setor Elétrico Brasileiro"; o do repo é "…Detalhada".
2. **Marca.** O kicker diz "Alexandria · GridAlpha · Módulo 07" (P24).
3. **"Módulo 07" × "Bloco 7".** Os dois vocabulários convivem: a frase para decorar, o § Lex e a régua usam "Bloco".
4. **Contagem no § 00.** A fonte escreve "Os seis módulos anteriores", mas enumera cinco (02–06) e depois diz "nenhuma das
   cinco".
5. **Critério 8/10 × P18.** A mensagem do quiz diz "Critério de domínio atingido." e trava o avanço abaixo de 8.
6. **Critério "duplo" × 8/10 × 26 afirmações.** As formas se somam numa sequência, mas nenhuma é o critério único.
7. **Taxonomia desatualizada.** `instrument-taxonomy.md` diz que o Inst · 01 "nunca foi materializado", mas o código tem
   `m07-inst-01` desde a Wave 38.
8. **Inst · 02.** Chama-se "Comparador" e tem `kind` comparador, mas a mecânica é a de explorador (já registrado).
9. **"Parte 7".** O caso está numerado assim no § MAP e no § Caso (P17).
10. **§ Lex.** Verificação cruzada: 118 = 16+17+15+14+18+22+16. Confere.
11. **Horas.** Conferem entre a fonte, o repo e o catálogo.
12. **Gravuras.** A fonte tem zero `<img>`. As ilustrações `ins-*` do código vêm do acervo, não do HTML.
13. **Corpo das aulas 01–06 no código.** Fichas, listas e passos perdidos (tabela acima).

## Verificação

`extratores/m07_verify.mjs` confere duas coisas:
- **Strings.** 538 strings de conteúdo, cada uma como substring normalizada da fonte: 0 falhas.
- **Origens.** 196 origens, com o trecho a até 3 linhas de `linha_aprox`: 0 falhas.

Contagens cruzadas por varredura independente, todas conferindo:

| Item | Contagem |
|---|---|
| Aulas | 7 |
| Fichas | 8 |
| Perguntas-relâmpago | 40 |
| Erros | 18 |

### Terceira passada (verificador adversarial, 2026-09-17)

Conferência independente, com script próprio, direto no HTML. Não houve nenhuma correção neste arquivo.

- **Voz.** Conferência exata item a item:
  - as 40 perguntas-relâmpago (`ol.num-list` 1);
  - os 7 ataques: `persona` + `pergunta` + `rotulo_resposta` + `resposta_esperada_texto`, que juntos reproduzem o
    `li`;
  - os 8 movimentos do roteiro oral (7 `box cy` e 1 `box gd`).
  
  Todos conferem, e as origens ficam a até 3 linhas.
- **Erros comuns.** As 18 linhas (erro e correção) conferem exatamente.
- **Fichas.** Os 8 cabeçalhos (`sg`/`tp`), as linhas e a contagem de `fi-row` conferem.
- **Recontagens.** Todas conferem:
  - subseções por aula: 5, 5, 8, 7, 7, 3, 5 (`h3` por `section`);
  - 31 callouts `div.box` no arquivo;
  - 9 pills e 8 `map-card`;
  - 8 ocorrências de "GridAlpha", nas linhas declaradas.
- **Strings e origens.** 424 strings de conteúdo, 0 ausentes. 392 origens, 0 fora da janela de ±3 linhas.
- **Observação, sem correção.**
  - **Entradas que não são divergência.** `div-m07-lex-ordem` e `div-m07-horas` estão em `divergencias[]`, mas elas
    mesmas dizem "Conferem". São verificações cruzadas, não divergências.
  - **Efeito na contagem.** Na prática, o total de 13 inclui 2 entradas sem divergência.
  - **Nada inventado.** As demais foram conferidas na fonte (L352, L376/378, L387, L1373, L1384, L1411, L1721,
    L1899), no catálogo (L54, L639, L644) e em `alexandria-blocks.ts` (L13).

### Quinta passada (verificador adversarial, 2ª rodada, 2026-09-17)

Conferência independente, com scripts próprios no scratchpad. Não houve nenhuma correção neste arquivo;
`modulo.json` saiu byte-idêntico na regeneração.

- **Voz, erros e cartões.** Conferência exata:
  - as 40 perguntas-relâmpago;
  - os 7 ataques (`persona` + `pergunta` + `rotulo_resposta` + resposta = `li`);
  - os 8 movimentos (tag e parágrafo);
  - as 18 linhas do § Erros, em html e texto;
  - os 8 `map-card`.
- **Recontagens no HTML.** Todas conferem:
  - 17 `section`, 7 `sec-id` "Aula NN" e 10 `div.inst`;
  - subseções 5/5/8/7/7/3/5;
  - 8 `div.fi` e 31 `div.box` (11 cy, 10 gd, 10 rd);
  - 9 pills;
  - 40 `li` no V.1, 7 no V.2 e 8 movimentos no V.3;
  - 19 `tr` no § Erros;
  - 8 "GridAlpha";
  - 0 ocorrências de "Resultado esperado", "Tradutor" e "Laboratório".
- **Strings e origens.** São 736 strings. As não encontradas são só metadado (`id_fonte`, `onde`, numeração, catálogo).
  As 189 origens ficam todas a até 3 linhas.
- **Cobertura.** Todo nó de texto das seções que não são aula (§ 00, § MAP, § Caso, § Erros, § Ex, § Quiz, § Voz,
  § Final, § Lex, § Ref, hero e rodapé) está presente nos JSONs. A única exceção são os `summary` do § Lex, que
  foram gravados divididos em `rotulo` + contagem. O corpo das Aulas 01–07 fica fora deste pedido: aqui só entram
  o inventário, as subseções e os cabeçalhos das fichas. O mesmo vale para as extrações M02–M06, que também não
  têm `aula-NN.json`.
- **Divergências.** As 13 foram reconferidas, e nenhuma é inventada. A observação da terceira passada continua
  valendo: `div-m07-lex-ordem` e `div-m07-horas` são verificações que conferem.
