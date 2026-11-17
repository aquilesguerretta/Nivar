# Instrumentos — especificação dos 165

Esta pasta **não porta nada**. Ela especifica, instrumento por instrumento, o que o builder da aula
precisa para portar sem inventar: identidade, entradas, saídas, fórmula, forma prometida, tolerância
e previsão.

| Arquivo | O que é |
|---|---|
| [`instrumentos.json`](instrumentos.json) | A especificação completa, legível por máquina. 165 registros. |
| [`instrumentos.md`](instrumentos.md) | A mesma coisa para ler. Um bloco por instrumento, com tabela de entradas e de saídas. |
| [`PORTAR.md`](PORTAR.md) | A ordem recomendada de porte, com os 55 não portados primeiro e o custo de cada forma prometida. |
| `overlay/*.json` | A camada de julgamento, escrita à mão: forma prometida, pergunta de previsão, pedido de revisão de tolerância. |
| `extratores/` | `gerar-instrumentos.mjs` e `gerar-portar.mjs`. Regeneram tudo. |

Regenerar:

```
cd extratores
node gerar-instrumentos.mjs
node gerar-portar.mjs
```

`instrumentos.json`, `instrumentos.md` e `PORTAR.md` são **saída**. Editar à mão desfaz na próxima
execução. O que se edita é `overlay/`.

## 1. De onde vem cada campo

Duas camadas, nunca misturadas — é a regra das
[decisões do Founder](../../decisoes/2026-09-16-ambiguidades-de-conteudo.md).

**Camada fonte.** Copiada de `../mNN/instrumentos.json` (e, no M01, de `../m01/aula-08.json` e
`../m01/modulo.json`). Nada foi redigitado: o gerador lê a extração e transcreve. São camada fonte:

- identidade (id, id na fonte, título, aula);
- entradas — rótulo, unidade, tipo, valor-padrão, faixa, passo, opções;
- saídas — rótulo, unidade, tipo e **a fórmula verbatim do script**;
- cenário-padrão com os valores efetivamente renderizados;
- tolerância, quando a fonte declara;
- as notas de procedência de número que a própria extração registrou.

Blocos de código muito longos (o `codigo_completo` de um script inteiro) não foram copiados: no
lugar fica um ponteiro com a contagem de caracteres para o arquivo do módulo, no mesmo estilo que
as extrações usam. **As fórmulas linha a linha ficam inteiras** — são elas que o builder copia.

**Camada Alexandria.** Escrita à mão em `overlay/`, marcada `camada: "alexandria"` na saída:

- `forma_prometida` — se o nome ou o texto promete um desenho, o que exatamente precisa ser
  desenhado, com eixos, séries e a relação que a figura tem de mostrar;
- `previsao` — se o erro de previsão é útil ali, e a pergunta montada **com os valores do
  cenário-padrão extraído**;
- `tolerancia.revisao_tecnica_pedida` — onde uma tolerância seria pedagogicamente útil e a fonte
  não declara nenhuma.

Cada item do overlay carrega a evidência literal que o sustenta: o trecho do título ou da intro que
promete a forma, e o elemento de desenho que a fonte declara. Onde a forma foi lida do código do
script em vez do texto, o campo `derivacao` diz `derivado do código-fonte` e aponta as linhas.

## 2. O que não foi feito, e por quê

**Nenhum fato veio de fora da extração.** Não houve pesquisa externa, não se abriu o HTML original,
não se abriu `src/`. Onde a fonte não diz, a saída é ausência declarada (S4): `"não declarado"`,
`"ainda não disponível"`.

**Cinco instrumentos saem vazios, de propósito.** `m01-inst-01` a `m01-inst-05` não têm extração de
camada fonte — o M01 não tem `instrumentos.json`, e só o INST·06 e o LAB·01 foram extraídos. Esses
cinco existem no código, mas **o código não é fonte**: especificá-los a partir do porte seria
inventar a fonte a partir da cópia. Eles entram no documento com título nulo, entradas vazias e a
ausência declarada em cada campo.

**Nenhuma tolerância foi inventada (P6).** Um instrumento em 165 declara tolerância. Nos outros 164
o campo é `null`, o veredito "dentro/fora" está proibido, e a saída indica a autoavaliação em três
níveis de C7 — *atende · atende em parte · não atende*.

**Nenhuma divergência foi resolvida (P5/P8).** Onde a fonte se contradiz, as duas leituras ficam
registradas no campo `avisos.divergencia`, e três instrumentos saem com a pergunta de previsão
**bloqueada** até a reconciliação, porque não existe resposta de referência.

**Nenhum jogo foi projetado (P25).**

## 3. O que a especificação mede

Números derivados do próprio documento, nunca digitados — estão em `contagens` no JSON:

| Medida | Valor |
|---|---:|
| Instrumentos especificados | 165 |
| Entradas especificadas | 515 |
| Saídas especificadas | 580 |
| Sem extração de camada fonte | 5 |
| Prometem uma forma desenhada | 121 |
| — a fonte já desenha | 53 |
| — a fonte desenha em parte | 7 |
| — **prometem e não desenham nada** | 61 |
| Não prometem forma | 39 |
| Tolerância declarada pela fonte | 1 |
| Pedido de revisão técnica de tolerância | 5 |
| Pergunta de previsão útil | 108 |
| Previsão bloqueada por divergência | 3 |
| Sem porte nenhum no código (M09, M13, M14, M16, M17) | 55 |

### A correção que importa

O brief desta rodada media o código: *só um instrumento desenha a forma que o nome promete*. A
medida da camada fonte é outra: **53 já desenham**, com svg, pilha, cadeia, grade e quadrante, e com
legenda, rótulo de eixo, cor por série e `viewBox` literais no HTML original.

Isso muda a ordem do trabalho. Parte grande do que falta na tela **não precisa ser desenhada,
precisa ser portada** — o caso mais caro é o `m08-inst-02`, cujo título diz *"as duas pizzas lado a
lado"*, cuja fonte tem a função `pieSVG()` desenhando as duas, e cujo porte guardou quatro readouts.
O mesmo vale para a curva líquida do `m02-inst-04`, que o bar registra como *"CURVA LÍQUIDA sem
curva nenhuma"*: a curva existe na fonte, em `svg#i08-svg`.

A dívida real de C5 **dentro da fonte** são os 61 que prometem e não desenham. O `PORTAR.md` os
separa dos que só precisam de porte.

## 4. O que vai para o Founder

Duas listas curtas, ambas em `PORTAR.md` §Onda 0.

**Reconciliações que travam um número.** `m01-lab-01` (markup × script na Fábrica B),
`m14-inst-07` (1 TJ/ano × 540 TJ implícitos), `m14-inst-08` (gCO₂e/MJ usado como percentual;
102.389 t × 116.050 t).

**Tolerância.** Cinco instrumentos comparam resposta contra referência, emitem juízo por faixa, e a
fonte não declara a faixa: `m10-inst-09`, `m11-inst-06`, `m11-inst-07`, `m11-inst-08`, `m12-inst-02`.

O `m12-inst-02` é o caso a decidir primeiro: o **texto do veredito da fonte** já diz que o resultado
é consistente quando fica *"dentro de dois pontos percentuais do valor oficial"*, enquanto a
extração registra `tolerancias: null`. Ou é tolerância declarada — e o veredito dentro/fora é
legítimo ali —, ou é limiar de ramo de texto. É reconciliação de uma linha, e destrava o único
candidato a segundo instrumento com tolerância real do currículo inteiro.

## 5. Posse

Escrito só dentro de `docs/alexandria-v2/extraction/instrumentos/` e `tools/alexandria-dados/`. Não foi tocado `src/`,
`public/`, `index.html`, git, nem a porta 5311 (em `tools/` só os arquivos novos de `alexandria-dados/` listados na §6).

## 6. Formas executadas e unidade de saída (3.5 e 3.6)

Duas camadas novas, ambas geradas **executando o script real do módulo** (o `<script>` do HTML
original, só leitura) num DOM mínimo sem dependência — `tools/alexandria-dados/mini-dom.mjs`. Nenhuma
fórmula foi reescrita; o cenário-padrão é o estado do DOM depois que o script carrega, e bate com o
`padrao` da extração nas 282 entradas numéricas dos 121 instrumentos que prometem forma.

| Arquivo | O que é |
|---|---|
| [`formas.json`](formas.json) | Um registro por instrumento que **promete** desenhar uma forma (121): tipo de forma, eixos com unidade, cenário-padrão executado, curvas (um controle por vez na faixa que o markup declara), arrays que a figura da fonte plota, estruturas (nós, etapas, células), cada série prometida ligada ou `null` com motivo, origem da fórmula (módulo e linha). **Só dado: estilo de desenho não é decidido.** |
| `tools/alexandria-dados/gerar-formas.mjs` | Gera `formas.json` a partir de `instrumentos.json` + o HTML dos módulos. |
| `tools/alexandria-dados/verificar-formas.mjs` | Recalcula instrumentos amostrados (semente fixa) e compara com o valor estático do markup, com fórmula fechada independente e com `formas.json`. |
| `tools/alexandria-dados/{mini-dom,executar,unidades,recuperar-unidades}.mjs` | O DOM mínimo, a execução de um instrumento, o vocabulário de unidade e a recuperação de unidade. |

Regenerar (nesta ordem — `formas.json` lê a saída de `gerar-instrumentos`):

```
node docs/alexandria-v2/extraction/instrumentos/extratores/gerar-instrumentos.mjs
node tools/alexandria-dados/gerar-formas.mjs
node tools/alexandria-dados/verificar-formas.mjs
```

### Unidade de saída

`saidas[].unidade` agora é **só unidade** (símbolo de medida). O que a extração guardava em `unidade`
e não é unidade ("de 6", "custo novo", "indiferente ao ambiente") passou para `sufixo_textual`. Cada
saída ganha `unidade_origem` (`extração` · `rótulo` · `markup` · `script`), `unidade_evidencia` (o
trecho literal) e, quando `null`, `unidade_motivo`. `unidades_observadas` lista as unidades que a saída
assume ao longo das varreduras (a fonte troca `R$ mil` por `R$ mi` conforme o valor).

Texto de aula **não** é usado: ligar uma unidade escrita em prosa a uma saída específica é
interpretação, e a regra é não preencher o que a fonte não declara.

### Limites declarados

- A **série prometida** é texto do overlay (julgamento). Só é ligada a uma saída ou variável quando o
  rótulo ou o nome casa; senão sai `null` com motivo. A ligação não foi inventada.
- O **tipo de forma** é lido das palavras do título e do overlay. Ambíguo ou sem palavra → `null`.
- Faixa sem `max` no markup → sem varredura (não se inventa faixa).
- O stub não faz layout nem canvas; instrumento que dependa disso não é medido por ele.
