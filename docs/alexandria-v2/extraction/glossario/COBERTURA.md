# COBERTURA — Glossário Alexandria

Gerado em 2026-09-21 por `extrair-glossario.py`. Todo número desta página é calculado pelo extrator; nenhum foi digitado à mão.

## O número

| | |
|---|---:|
| Verbetes extraídos da fonte | **2124** |
| Módulos cobertos | **17 de 17** |
| Territórios cobertos | **3 de 3** |
| Famílias declaradas pela fonte | 98 |
| Verbetes no produto hoje | 637 |
| Verbetes **novos** para o produto | **1487** |

A Alexandria sai de **637 verbetes** — 30% da fonte, 8 dos 17 módulos, Território III zerado — para **2124**: 100% da fonte, 17 de 17 módulos, os três territórios.

## Por território

| Território | Módulos | Verbetes na fonte | No produto antes | Novos | Cobertura anterior |
|---|---|---:|---:|---:|---:|
| I — Fundamentos Universais | M01–M05 | 296 | 296 | **0** | 100% |
| II — Setor Elétrico Brasileiro | M06–M12 | 940 | 341 | **599** | 36% |
| III — Especialização Estratégica | M13–M17 | 888 | 0 | **888** | 0% |

## Por módulo

| Módulo | Título (catálogo) | T | Verbetes | Famílias | Etiquetas | No produto antes | Novos |
|---|---|---|---:|---:|---:|---:|---:|
| M01 | Física de Energia e Eletricidade | I | 38 | 0 | 38 | 38 | **0** |
| M02 | Como Funciona uma Rede Elétrica | I | 65 | 0 | 65 | 65 | **0** |
| M03 | Tecnologias de Geração | I | 63 | 0 | 63 | 63 | **0** |
| M04 | Economia de Mercados de Energia | I | 58 | 4 | 0 | 58 | **0** |
| M05 | Regulação e Desenho de Mercados | I | 72 | 5 | 0 | 72 | **0** |
| M06 | História do Setor Elétrico Brasileiro | II | 99 | 6 | 0 | 99 | **0** |
| M07 | Estrutura Institucional do Setor Elétrico Brasileiro | II | 118 | 7 | 0 | 118 | **0** |
| M08 | Matriz Elétrica Brasileira em Profundidade | II | 124 | 7 | 0 | 124 | **0** |
| M09 | Os Mercados ACR e ACL em Profundidade | II | 136 | 6 | 0 | 0 | **136** |
| M10 | Tarifas e a Conta de Luz Industrial | II | 161 | 8 | 0 | 0 | **161** |
| M11 | Geração Distribuída e a Anatomia de uma Proposta Solar | II | 150 | 7 | 0 | 0 | **150** |
| M12 | Geopolítica Energética do Brasil | II | 152 | 8 | 0 | 0 | **152** |
| M13 | Análise Financeira de Empresas e Projetos | III | 180 | 8 | 0 | 0 | **180** |
| M14 | Biocombustíveis e Bioenergia | III | 158 | 8 | 0 | 0 | **158** |
| M15 | Petróleo, Gás e Petrobras | III | 174 | 8 | 0 | 0 | **174** |
| M16 | Tendências e Disrupções | III | 184 | 8 | 0 | 0 | **184** |
| M17 | Cenário Internacional Comparativo | III | 192 | 8 | 0 | 0 | **192** |
| | | | **2124** | **98** | **166** | **637** | **1487** |

## Comparação com os 637 que o produto tem hoje

Fonte da comparação: `src/lib/data/alexandria-glossario.ts`, lido em modo somente leitura. Esta wave não escreve em `src/`.

| Resultado | Verbetes |
|---|---:|
| **Novos** — estão na fonte e não no produto | **1487** |
| **Batem** — literal idêntico ao da fonte | **637** |
| **Divergem** — o produto diz outra coisa | **0** |
| **Só no produto** — sem correspondência na fonte | **0** |

Os 637 verbetes que o produto já tinha batem **todos** com o literal da fonte, e nenhum verbete do produto está órfão. O que o produto tem está correto; o que falta é volume — 1487 verbetes, 70% da fonte.

A igualdade foi testada contra os **dois** literais da fonte, `definicao_html` e `definicao_texto`, porque o produto guarda o HTML inline da fonte (`<b>`, `&lt;`). Bater com qualquer um dos dois é identidade literal, não tolerância (P6).

## Âncora curricular (D4)

| | |
|---|---:|
| Verbetes com módulo de origem | **2124 de 2124 — 100%** |
| Verbetes com aula declarada pela fonte | **0** |
| Verbetes com `"ancora": "não declarado"` | **2124** |

**Nenhum dos 17 aparatos liga verbete a aula.** Os próprios aparatos dizem isso, e a frase literal de cada um fica gravada em `ancora.aulaNota` do verbete — no M01, por exemplo: *“A fonte não liga termo a aula. aulaIds do código foram inferidos pela Wave 8 (varredura + leitura), não declarados pela fonte.”*

Por isso `aulaIds` do código **não** foi promovido a âncora: é inferência de wave anterior, não declaração da fonte (S4, P6). Ele continua legível em `noProdutoHoje.aulaIdsDoProduto`, rotulado como dado do produto, para quem for reconciliar depois.

O módulo de origem, esse sim, a fonte determina para os 2124 verbetes: cada um vem do `aparato.json` de um módulo.

## Família e categoria

| | |
|---|---:|
| Verbetes com família/grupo declarado | 1958 |
| Verbetes com etiqueta (chip `unit`) | 166 |
| Verbetes sem família e sem etiqueta | 0 |

M01, M02 e M03 não agrupam por família: a fonte lista em ordem alfabética e dá a cada verbete um chip curto (`etiqueta`). Os outros 14 módulos agrupam. Os dois campos ficam separados em vez de fundidos, porque a fonte os escreve separados.

## Termos repetidos entre módulos

| | |
|---|---:|
| Chaves de termo distintas | 1865 |
| Termos que aparecem em mais de um módulo | **184** |
| Deles, com definições literais **divergentes** | **184** |
| Deles, com definição literal idêntica | 0 |

Distribuição: 129 termos em 2 módulos, 39 termos em 3 módulos, 12 termos em 4 módulos, 4 termos em 5 módulos.

**Nada foi fundido.** Cada ocorrência continua sendo um verbete próprio em `glossario.json`, com seu `id`, seu módulo e sua definição literal. Os 184 casos divergentes estão em `conflitos.json`, com as leituras lado a lado, para decisão do Founder.

A fonte sustenta essa escolha. O lede do § Lex do M10 diz: *“Termos já definidos nos Módulos 01 a 09 não são repetidos aqui, exceto quando este módulo lhes dá um sentido operacional distinto.”* A repetição entre módulos é, pela própria fonte, deliberada — cada módulo redefine o termo no seu registro operacional.

Os mais repetidos: Submercado (5), Serviços ancilares (5), Lastro (5), Garantia física (5), Take-or-pay (4), PLD (4), Ordem de mérito (4), ONS (4), Modicidade tarifária (4), Grupo B (4), Grupo A (4), Flexibilidade (4).

O caso conhecido do PLD tem **4** entradas, não três: M01, M02, M04, M07 — quatro definições literais distintas.

## Relações (D4)

| | |
|---|---:|
| Relações de citação encontradas | 1085 |
| Verbetes que citam outro verbete | 792 |
| Verbetes sem citação | 1332 |

Regra mecânica e declarada, sem tolerância inventada:

1. **Citação** — o termo X aparece como palavra inteira dentro do texto da definição do termo Y, **no mesmo módulo**. Casar entre módulos seria rede semântica inventada, então não se faz.
2. Casam o termo literal e o termo sem o sufixo entre parênteses (`Ampere (A)` também casa por `Ampere`). Sigla em CAIXA ALTA casa com caixa, a partir de 2 caracteres; o resto casa sem caixa, a partir de 4.
3. **Mesma família** — não é repetida verbete a verbete (seriam dezenas de milhares de pares). Fica em `familiaId` mais o índice `familias` de `glossario.json`, que é a mesma informação sem o inchaço.

## Divergência de contagem (P8 — não corrigida aqui)

| Módulo | Verbetes medidos | O que a fonte declara |
|---|---:|---|
| M01 | 38 | Vinte e oito termos |
| M02 | 65 | Sessenta e cinco |
| M03 | 63 | Sessenta e três |
| M04 | 58 | não declarado |
| M05 | 72 | Setenta e dois termos |
| M06 | 99 | título do § Lex: Noventa e nove termos |
| M07 | 118 | 118 termos do Bloco 7 |
| M08 | 124 | 124 |
| M09 | 136 | Cento e trinta e seis termos |
| M10 | 161 | 161 termos |
| M11 | 150 | 150 termos |
| M12 | 152 | Cento e cinquenta e dois termos, agrupados por família |
| M13 | 180 | Cento e oitenta termos, agrupados por família |
| M14 | 158 | Cento e cinquenta e oito termos, agrupados por família |
| M15 | 174 | Cento e setenta e quatro termos, em oito famílias |
| M16 | 184 | Cento e oitenta e quatro termos, em oito famílias |
| M17 | 192 | oito famílias (sem número de termos na prosa) |

O caso vivo é o **M01: a prosa diz “Vinte e oito termos” e o markup tem 38**. A extração segue o markup, que é o conteúdo real, e deixa a prosa registrada. Isso é reconciliação separada (P8), não conserto desta wave.

## O que está declarado como ausente (S4)

- **Aula de origem: 2124 de 2124 verbetes.** Nenhum aparato declara o vínculo. `"ancora": "não declarado"`.
- **Família: 166 verbetes** (M01, M02, M03), porque a fonte não agrupa esses módulos. Eles têm etiqueta, não família.
- **Definição escrita por esta wave: zero.** Toda definição é cópia literal do `aparato.json`. Onde a fonte não define, não há verbete.

## Arquivos

| Arquivo | O que é |
|---|---|
| `glossario.json` | O dado que o produto consome: 2124 verbetes, o índice de 98 famílias, o índice de homônimos e a comparação com o produto. |
| `glossario.md` | A tabela legível, módulo a módulo. |
| `conflitos.json` | Os 184 termos repetidos entre módulos; 184 deles com definições divergentes, lado a lado. |
| `COBERTURA.md` | Esta página. |
| `extrair-glossario.py` | O extrator. Reexecutável; a saída é função da fonte, não de julgamento. |

`glossario.json` tem ~4 MB porque carrega procedência por verbete. Os campos `origem`, `camposDaFonte`, `termoLiteralNaFonte` e `noProdutoHoje` são reconciliação, não leitura: um consumidor de runtime pode projeção fora deles sem perder nenhum verbete. O próprio arquivo lista esses campos em `camposDeProcedencia`.

