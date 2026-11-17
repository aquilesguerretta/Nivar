# M01 · grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html` (3.212 linhas, LF).
Saída: [`modulo.json`](modulo.json).

**Como foi extraído.** Um script em Node leu o texto por número de linha e regex. Nenhum texto de conteúdo foi
digitado. O extrator ficou no scratchpad da sessão (`m01_modulo.mjs`).

**Verificação.** 276 strings de conteúdo (`html`, `rotulo`, `tema`, `valor`, `titulo`, `mensagem`, `codigo`…) foram
conferidas como substring exata da fonte. Não houve falha. Os campos que não passam na conferência são anotação
desta extração (`nota`, `tema` de divergência, `marcacao_p14`), e o JSON os marca assim.

## Estrutura do JSON

| Chave | O que contém |
|---|---|
| `identidade` | Eyebrow, h1 (`titulo`), `subtitulo`, os 4 `hero-meta`, `horas` (string literal "4 – 6 horas"), `eixos: null` com nota, cabeçalho e rodapé |
| `tese` | § 00: marcador, h2, lead, 2 parágrafos, pull-quote com atribuição |
| `resultado_esperado` | h4 + preâmbulo + **7 capacidades** (`m01-cap-01..07`) |
| `mapa` | § MAP: h2 "Nove aulas…", intro, cabeçalho da tabela, **9 linhas** (aula, tema, pergunta), ligadas a `aula-01-NN` |
| `roteiro` | As **19** `section.aula` em ordem: **9 aulas + 10 aparatos**, cada uma com marcador, rótulo, h2 e linha |
| `criterio` | 3 critérios literais (Drill, Quiz, Final). O do Quiz traz as 4 mensagens do script. O Final traz os **16 itens** do checklist |
| `lab_01` | Título, id da fonte, seção, enunciado e instrução interna. `passos: null` e `entregavel: null`, com nota. Tem 2 campos comuns, 2 colunas × (3 campos + 4 saídas + total), nota, as 12 linhas de coeficiente do script copiadas verbatim, os valores recalculados nos defaults e os vínculos |
| `voz` | 3 princípios: callout "Linguagem segura", callout "Padrão editorial Alexandria" e intro do § Ref. Mais 1 ponteiro de exemplo de voz, que vive no § Caso |
| `erros_comuns` | `secao_de_modulo: null`. Aponta para os 3 callouts `red` dentro das aulas 01, 05 e 07, só pelo rótulo |
| `tradutor` | § Map "Tradutor": 8 linhas × 3 células. Incluído por ser síntese de módulo; deduplicar por id se outro grupo também extrair |
| `divergencias` | 14 itens, cada um com `leitura_a` / `leitura_b`. Nenhuma foi resolvida |
| `comparacao_codigo` | Contagens e títulos das 9 aulas, fonte × `alexandria-modulo-01-content.ts`, e as linhas `bloco-01` e `bloco-02` do catálogo |

Todo item traz `id` estável, `tipo` e `origem {seletor, trecho_inicial, linha_aprox}`. Onde há HTML inline, o item traz
`html` (literal) e `texto` (o mesmo sem tags).

## P14: critérios orais e cronometrados

`marcacao_p14` é uma **anotação inferida do verbo inicial** de cada item, não texto da fonte. As etiquetas são
`cronometrado`, `producao_oral_ou_livre`, `desenho` e `calculo`.

| Lista | Cronometrado | Oral ou livre | Só cálculo |
|---|---|---|---|
| Resultado esperado (7) | 1 ("em 30 segundos", cap-01) | 7/7 | 0 |
| Checklist (16) | 1 ("em 30 segundos", check-01) | 15/16 | 1 (check-04) |

Pelo P14, nenhum desses itens vira evidência automatizada. Todos entram como "atividade recomendada". O único
critério automatizável é o quiz (8/10), e pelo P5 o limiar dele não é evidência de competência.

## Comparação com o código (P8)

- **Contagem de aulas.** Os quatro sinais concordam em 9: os marcadores `Aula NN`, as linhas do § MAP, a prosa
  ("Nove aulas") e o código (`totalInModule`, `AULAS_POR_BLOCO`).
- **Títulos das 9 aulas.** O `title` do código é igual ao h2 da fonte, e o `subtitle` do código é igual ao rótulo do
  marcador, que por sua vez é igual ao tema do § MAP. **Zero divergência.**
- **Catálogo `bloco-01`.** Bate com a fonte em título curto (igual ao do rodapé) e em horas (4–6). A diferença entre
  o h1 e esse título curto está na div-07.
- **O que o código não tem.** No nível do módulo faltam tese, capacidades, perguntas do § MAP, critérios, voz e
  tradutor. O LAB · 01 existe como `lab-01`, sem aula que o referencie. O badge usa 3 itens do checklist
  (`alexandria-badges.ts`).

## Divergências

Detalhe completo em `divergencias[]` no JSON.

1. **Três critérios.** O Drill pede 6 de 8, o Quiz pede 8 de 10, e o Final diz que "só passa" quem cumpre os 16
   itens. A fonte não diz qual prevalece.
2. **Script do quiz × limiar 8/10.** Com 7 acertos, o script já manda avançar; com 8, a mensagem é "Revise"; "Pronto"
   só aparece a partir de 9. Esta é a contradição P5.
3. **Cobertura do Drill.** O Drill diz alcançar "todas as nove aulas", mas as tags cobrem só 01, 02, 04, 05, 07 e 08,
   mais uma síntese. O protocolo §5 cita "seis dos oito, há 8" como divergência, mas a medição dá 8 = 8.
4. **Dois marcadores MAP.** `§ MAP` (L1325) e `§ Map` (L2358, Tradutor) só se distinguem pela caixa.
5. **Número da Trava.** O § 00, a Aula 05 e o quiz citam a "Trava 4"; o § Caso (L2192) cita a "Trava 3".
6. **Nome do M02.** A fonte diz "A Rede Elétrica"; o catálogo diz "Como Funciona uma Rede Elétrica".
7. **Título do módulo.** O h1 é longo e editorial; rodapé e catálogo usam o nome curto.
8. **LAB · 01, markup × script.** No markup, a Fábrica B mostra reativo R$ 1.800 e total R$ 67.425. O script calcula
   R$ 3.200 e R$ 68.825, e é o que aparece na tela.
9. **LAB · 01, faixas.** O campo numérico e o deslizador têm faixas diferentes. Além disso, `|| 1` faz o FP vazio
   valer 1.
10. **LAB · 01, rótulos no código.** Os rótulos do `lab-01` são compostos ("Fábrica A · …"), não literais. Os h5
    completos se perderam.
11. **Protocolo §3.** Diz que o LAB·01 está no padrão "§MAP"; na fonte, ele está em "§ Lab".
12. **Contagem do § Lex.** A prosa diz "Vinte e oito termos"; o markup tem 38 (já registrado no código).
13. **Cinco dimensões.** O lead do § 00 e o hero-subtitle as enumeram de formas diferentes. Nenhuma das duas é
    rotulada como "eixo".
14. **Marca.** A fonte usa "GridAlpha"; o produto hoje se chama NIVAR. O texto foi mantido literal.

## Ausências declaradas

| Campo | Valor | Motivo |
|---|---|---|
| `eixos` | `null` | Não há eixos rotulados na fonte |
| `horas.min` / `horas.max` | `null` | A fonte só tem a string "4 – 6 horas" |
| `lab_01.passos` | `null` | Não há passos enumerados |
| `lab_01.entregavel` | `null` | Não há entregável |
| `lab_01.vinculos.aula` | `null` | Nenhuma aula referencia o LAB · 01 |
| `erros_comuns.secao_de_modulo` | `null` | Não há seção de erros comuns no nível do módulo |

## Verificação (verificador adversarial, 2026-09-16)

Conferido contra `alexandria_modulo01.html` por script (substring normalizada, igualdade exata item a item e
linha de `origem` ±3) e por leitura das seções L1239-1348, L2181-2196, L2256-2520, L2686-2716 e L3005-3202.

- **Verbatim.** Nenhuma palavra trocada, cortada ou acrescentada. Igualdade exata (html e texto): 7/7
  capacidades, 16/16 itens do checklist, 9/9 linhas do § MAP, 8×3 células do Tradutor, 19/19 marcadores e h2
  do roteiro, 4 mensagens do script do quiz (L3199-3202), 12 linhas de coeficiente do LAB (L3031-3044).
- **Origem.** Todas as `origem.trecho_inicial` foram encontradas na linha declarada (±3). Nenhuma aponta para o
  lugar errado.
- **Faltas.** Nenhuma seção ou item de módulo ficou de fora. Foram buscados: `aula-marker` (19), `hero-meta`
  (4), `callout red` (3, L1452/L1755/L1996), "Trava" (L1314/L1823/L2192/L3150), `glossary-item` (38), quiz
  com 10 `feedback:`.
- **Divergências.** As 14 foram reconferidas e nenhuma é inventada. A div-05 foi confirmada: o feedback citado
  (L3150) é o 10º dos 10 do quiz. A div-06/07 foi confirmada em `alexandria-blocks.ts` L7-8. A div-09/10 foi
  confirmada em `alexandria-modulo-01-content.ts` (lab-01, L136-155). O badge com 3 itens foi confirmado em
  `alexandria-badges.ts` L76-107.
- **Correções aplicadas (completude, sem mudar texto):**
  1. `lab_01.colunas[0|1].total` ganhou `origem` (L2310 / L2340), que faltava.
  2. `identidade.rodape` ganhou `html` com o `<b>Alexandria Library</b>` literal, que a extração só guardava
     sem tag em `linhas`.
