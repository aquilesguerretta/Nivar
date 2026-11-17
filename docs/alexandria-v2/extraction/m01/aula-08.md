# M01·A08: Capacidade instalada e fator de capacidade

Arquivo de dados: [`aula-08.json`](aula-08.json).

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html`, 3.212 linhas. A aula ocupa as linhas 2004 a 2095. O script do INST·06 está nas linhas 2935 a 2962.
- **Como foi extraído:** um script node leu fatias do HTML por linha e aplicou regex ancorado. Nenhuma prosa foi digitada à mão. O campo `html` guarda o innerHTML literal da fonte. O campo `texto` guarda o mesmo conteúdo sem as tags.
- **Cobertura por token (§5):** 345 de 349 tokens casados (98,9%), sem contar o markup do instrumento. Os 4 tokens que não casaram vêm do medidor, que junta spans vizinhos (por exemplo, "8.1" + "Capacidade"). A cobertura efetiva é de 100%.

## Estrutura do JSON

| Chave | Conteúdo |
|---|---|
| `meta` | Fonte, linhas, método, convenções de id, ausência e vínculo |
| `aula` | Marcador ("Aula 08"), título do h2 (html e texto) e a pergunta do § MAP, na linha 1346: "Por que 100 MW solar ≠ 100 MW térmica?". Duração, dificuldade e vídeo ficam em `null`, com nota |
| `blocos[]` | 12 blocos na ordem da fonte: lead, os títulos 8.1, 8.2 e 8.3, quatro parágrafos, a fórmula, o marcador de posição do instrumento, o marcador da figura e o destaque. Cada bloco tem `origem {seletor, trecho_inicial, linha_aprox}` |
| `figuras[]` | `m01-a08-fig-01`, `div.cf-chart` com 7 barras. Cada barra traz fonte de geração, faixa do rótulo, largura CSS e classe. A figura não tem título nem fonte citada, e os dois campos ficam em `null` com nota |
| `tabelas` | Vazio. A aula não tem `<table>` |
| `destaques` / `vale_lembrar` | Um `callout.gold`, com o rótulo "Por que isso importa para o Brasil" e o corpo. A expressão "Vale lembrar" não aparece no M01, e o campo fica em `null` |
| `termos_lexico` | A fonte não declara vínculo entre termo e aula. Os candidatos vêm só de correspondência textual: "Fator de capacidade (FC)", com 7 ocorrências, e "Potência", com 1 ocorrência em "potência plena" que não é o conceito do verbete |
| `instrumentos[0]` | Especificação do INST·06 (detalhada abaixo) |
| `invocacoes_no_texto[]` | Pontos da prosa que chamam o instrumento ou a figura (ver "Onde o instrumento é invocado") |
| `exercicios[0]` | Ex · 06, com tag de posse "Ex · 06 · Aula 08". Traz enunciado e gabarito verbatim. Não tem critério por exercício (`null`); o critério do § Drill é citado à parte |
| `relacionados_nao_vinculados[]` | A questão 8 de 10 do quiz ("…50 MW gerou 100.000 MWh…", resposta 22,8%) e um item do checklist final. Nenhum dos dois tem tag de aula, então ficam fora da posse da A08 (P9) |
| `divergencias[]` | 6 divergências da fonte (DIV-01 a DIV-06), cada uma com as duas leituras e sem escolha entre elas |
| `comparacao_codigo` | Verificações programáticas, a lista do que está conforme e 12 divergências (COD-01 a COD-12) |
| `contagens` | Totais |

## INST·06: resumo da especificação

- **Título:** "Calculadora · Fator de capacidade". O id na fonte é "INST · 06". Na taxonomia, o kind é `calculadora`.
- **Pergunta:** `null`. A prancha não tem pergunta própria. Uma pergunta de previsão seria derivada (P3/P11), não extraída.
- **Entradas:**

  | Id | Rótulo | Unidade | Padrão | Mín. | Passo | Máx. |
  |---|---|---|---|---|---|---|
  | `i06-cap` | Capacidade instalada | MW | 100 | 0 | 10 | sem máx. |
  | `i06-gen` | Geração no período | MWh | 220000 | 0 | 1000 | sem máx. |
  | `i06-h` | Horas do período | h | 8760 | 0 | 24 | sem máx. |

- **Saída `i06-fc`:** "Fator de capacidade", em %. O script calcula `max = C * T; FC = max > 0 ? G / max : 0` e formata `FC*100` em pt-BR com exatamente 1 casa decimal.
  - A coerção de entrada é `|| 0` para capacidade e geração e `|| 1` para horas. É resíduo do original e ficou sinalizado.
  - A fórmula que aparece na aula está na prosa, fora do instrumento: "FC = Geração real ÷ (Capacidade instalada × horas do período)".
- **Texto de leitura:** é dinâmico (`b#i06-interp`) e tem 6 ramos, com limiares em 0,85, 0,55, 0,40, 0,25, 0,15 e "senão". Os textos estão verbatim no JSON.
- **Cenário-padrão:** 100 MW, 220.000 MWh e 8.760 h, o que dá **25,1%**. O ramo ativo é `FC >= 0.25`.
- **Fonte dos números:** `null`. A fonte não cita procedência para o cenário nem para os limiares.
- **Tolerâncias:** `null`. Nenhuma é declarada (P6), e o instrumento não tem previsão nem correção.

## Onde o instrumento é invocado (C5)

1. **Linha 2023, último parágrafo de 8.2.** O parágrafo termina com "…o FC foi de 25,1%. Use a calculadora abaixo:". O `div.instrument` vem logo depois (linhas 2025 a 2054) e antes do h3 **8.3**. A posição correta do instrumento é esta: depois da fórmula e do exemplo numérico de 8.2.
2. **Linha 2051, no próprio instrumento.** O texto inicial de leitura termina com "Compare com FCs típicos abaixo." e remete à figura `cf-chart` de 8.3, na linha 2059.

## Divergências na fonte (sem escolha)

- **DIV-01.** No cenário-padrão, a marcação traz "Faixa típica de usina solar fotovoltaica em latitudes brasileiras. Compare com FCs típicos abaixo.". Esse texto é parecido com o do ramo ≥0,15, mas não é igual: o ramo não tem a palavra "usina". Só que o `calc()` roda no carregamento, e com FC = 0,2511 ele mostra o ramo ≥0,25 ("…eólica … ou solar fotovoltaica com tracker em Nordeste BR.").
- **DIV-02.** As faixas do script não batem com as da figura. A solar da figura vai de 20 a 28%, mas o script corta em 0,25. O carvão da figura vai de 55 a 75%, mas no script ele aparece no ramo ≥0,85. O gás CCGT da figura vai de 40 a 60%, mas no script só entra em ≥0,55.
- **DIV-03.** O léxico usa valores pontuais ("solar BR ~25%", "peaker <15%"), enquanto a figura usa faixas ("~20–28%", "~5–15%").
- **DIV-04.** A sigla "FC" vale para fator de capacidade (A08) e também para fator de carga (A05).
- **DIV-05.** O § Drill diz "alcançam todas as nove aulas", mas as aulas 03, 06 e 09 não têm exercício com tag. A posse do Ex 06 não muda.
- **DIV-06.** O critério do quiz é "8 de 10", mas com 8 acertos o script responde "Bom… avance", e "Domínio sólido" só aparece com ≥9 (P5).

## Divergências em relação ao código portado

| Id | Gravidade | Resumo |
|---|---|---|
| COD-01 | alta | A figura `cf-chart` (7 faixas de FC) não foi portada |
| COD-02 | alta | O instrumento é renderizado depois de toda a apostila, e não entre 8.2 e 8.3. Isso viola C5 e a Regra-mãe 1 |
| COD-03 | média | O parágrafo de 8.2 ficou com 3 `</span>` sem abertura, porque o `span.hl` de abertura foi removido |
| COD-04 | média | O bloco `formula` da aula não foi portado |
| COD-05 | média | `inst-06.formula` é uma paráfrase ("FC = geração ÷ (capacidade × horas)") que não existe na fonte |
| COD-06 | média | O texto inicial de `#i06-interp` virou `note` estática. No padrão, o painel mostra ao mesmo tempo essa nota (o texto da marcação, que não é de nenhum ramo) e o veredito do ramo ≥0,25 |
| COD-07 | baixa | Formatação: o painel mostra "25,11" com até 2 casas, e a fonte mostra "25,1" com 1 casa fixa |
| COD-08 | média | No callout, o rótulo foi portado como corpo da nota, e o corpo virou um parágrafo solto |
| COD-09 | baixa | `points: 1` não tem origem na fonte |
| COD-10 | baixa | Os `aulaIds` do glossário (FC e Potência) são derivação do código. "Potência" casa só por "potência plena" |
| COD-11 | baixa | `Number()` e `parseFloat() \|\| 0` diferem, mas só em entradas praticamente inalcançáveis |
| COD-12 | info | Mapeamento de ids: `inst-06`/`ex-06`/`aula-01-08` equivalem a `m01-inst-06`/`m01-ex-06`/`m01-a08` |

**O que está conforme:**
- O lead, os parágrafos 8.1a, 8.1b e 8.3 e o corpo do callout estão verbatim.
- Os títulos das seções estão corretos.
- No INST·06 conferem os campos, rótulos, unidades, padrões, mínimos e passos. A lógica e os 6 textos de faixa também estão verbatim.
- No Ex · 06 conferem a tag, o enunciado e o gabarito.

## Verificação

Fiz uma verificação adversarial em 2026-09-16, conferindo cada item contra a fonte com o script `verify-a08.mjs` do scratchpad e com leitura das linhas 2004 a 2095, 2934 a 2961, 2386 a 2465, 2474, 2509, 2576 a 2581, 2644, 3130 a 3133 e 3199 a 3202.

**O que confere:**
- Todos os campos de conteúdo (`html`, `texto`, enunciado, gabarito, ramos, rótulos, faixas, larguras, padrões, mín. e passos) são verbatim.
- Todas as `origem.linha_aprox` apontam para a linha certa, com tolerância de ±2.
- Não falta nenhum item. Busquei "Aula 08", "fator de capacidade", "capacidade instalada", "solar", `i06` e `cf-chart` no HTML inteiro, e fora da section só aparecem o § MAP, o Ex · 06, o checklist, o léxico e o quiz, todos já registrados.
- Os candidatos a termo do léxico foram recalculados sobre os 38 verbetes e o resultado é o mesmo.
- As alegações COD-01 a COD-12 foram conferidas contra `src/`. Ficou uma ressalva, corrigida abaixo.

**Correções aplicadas.** Editei o JSON e também o `gen-aula08.mjs`. Depois rodei o gerador de novo, e a saída bate com o JSON corrigido.
1. **`meta.fonte_total_linhas`.** O valor era 3213 e passou para **3212**. O `split('\n')` contava a linha vazia depois do `\n` final, e agora o JSON bate com este .md.
2. **DIV-05, `leitura_b.texto`.** A lista abreviava e parafraseava as tags ("Ex·07 Aula 05", "Ex·08 Síntese"). Troquei pelas 8 tags verbatim ("Ex · 07 · 3 níveis · Aula 05", "Ex · 08 · Síntese · Diagnóstico inicial" etc.). A conclusão ("Aulas 03, 06 e 09 sem exercício com tag") passou para `argumento`.
3. **DIV-01.** Acrescentei `nota_texto`. O texto da marcação em `b#i06-interp` ("Faixa típica de **usina** solar fotovoltaica…") não é igual ao ramo `FC >= 0.15` ("Faixa típica de solar fotovoltaica…"), e nenhum ramo do script reproduz a marcação. O .md dizia que a marcação "traz o texto do ramo ≥0,15", e isso foi corrigido.
4. **COD-06.** O texto dizia que a `note` estática do código mostra "o texto do ramo ≥0,15". Na verdade, a `note` do código (`alexandria-modulo-01-content.ts` l.128) é o texto da marcação, com "usina". Corrigi o texto.

**Pontos que ficaram como estão (observações, não erros):**
- DIV-02 (leituras a/b) e DIV-03 (leitura b) são composições de trechos verbatim, com prefixos "Figura:" e "Script:" e separadores. Cada trecho confere com a fonte.
- `script_origem.linha_fim_aprox` = 2962. O `})();` está na linha 2961, e a diferença fica dentro da tolerância.
- Os números de linha do código em `comparacao_codigo.arquivos` são aproximados. Por exemplo, `gl-fator-de-capacidade-fc` tem `aulaIds` na l.160, e o JSON diz ~l.155.
