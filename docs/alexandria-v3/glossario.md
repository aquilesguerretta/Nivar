# Glossário v3: porte completo e decisão sobre os termos repetidos

Sessão LYCEUM de 15/11/2026. Aplica a seção Glossário de `DECISOES-2026-11-15.md` e a decisão 5.
Nenhum fato veio de fora de `docs/alexandria-v2/extraction/`.

## O que mudou

| | Antes | Agora |
|---|---:|---:|
| Definições no produto | 637 (M01–M08) | **2.124 (M01–M17)** |
| Entradas no glossário geral | 548 | **1.858** |
| Entradas com mais de um módulo | 69 | **185** |
| Definições que aparecem no texto de alguma aula | 119 (âncora inferida) | **1.247** (vínculo mecânico) |

### Arquivos

- `src/lib/data/alexandria-glossario-modulos/m01.ts … m17.ts`: um arquivo por módulo, **gerados**
  por `tools/alexandria-dados/glossario/gerar-glossario.mjs` a partir de `glossario.json`. Não editar à mão.
- `src/lib/data/alexandria-glossario.ts`: agrega os 17 e calcula `aulaIds` (o vínculo mecânico).
- `src/lib/data/alexandria-glossario-releitura.ts`: o registro da releitura dos 7 termos.
- `src/lib/alexandria/glossario-ocorrencia.ts`: a regra única de "o termo aparece no texto da aula".
- `src/lib/alexandria/verbetes.ts`: agrupamento por termo, ordem da trilha, busca.
- `src/components/alexandria/v3/GlossarioV3.tsx` e `glossario-v3.css`: a tela.
- `src/components/alexandria/v3/aula/texto.tsx`: só `termosDaAula`, que agora usa a mesma regra.
- `tools/alexandria-dados/glossario/verificar-glossario.mjs`: o verificador.

## Verificação

```
node tools/alexandria-dados/glossario/gerar-glossario.mjs
node tools/alexandria-dados/glossario/verificar-glossario.mjs
```

Saída do verificador nesta sessão:

- Extração 2.124 · produto 2.124 · **falta 0 · órfão 0 · campo divergente 0** (termo, etiqueta/família e
  definição HTML comparados letra por letra, depois da única troca editorial da Q03, listada na saída).
- Os 637 ids que o produto já tinha foram **todos preservados**. Os 637 verbetes antigos também foram
  comparados com o arquivo anterior antes de ele ser substituído: 0 diferença.
- Contagem por módulo igual à da extração nos 17.
- Os trechos da releitura estão, literais, na definição de onde dizem vir.

## A decisão aplicada

1. **Nenhum termo foi fundido.** Cada definição continua sendo um verbete com id, módulo e texto próprios.
2. **Na aula aparece a definição do módulo da aula.** Se o módulo da aula define o termo, vale a definição
   dele. Se não define, vale a do módulo **anterior** mais próximo na ordem da trilha, rotulada "Glossário ·
   definido no MNN" (decisão da coordenação, 15/11/2026; ver "Termo emprestado de módulo anterior").
3. **Uma entrada por termo, definições empilhadas e rotuladas pelo módulo, na ordem da trilha.** A tela
   diz quantas definições há e que elas não foram unificadas.
4. **Os 7 termos com números diferentes foram relidos.** Ver abaixo.
5. **Vínculo termo → aula mecânico.** A tela diz "aparece na Aula N" e explica que aparecer não quer dizer
   que a aula ensina o termo. Os `aulaIds` antigos (Wave 8, por leitura; Wave 34, por cabeçalho) saíram.

### Agrupamento: 185 entradas, não 184

A chave da extração é a grafia exata; a do glossário geral ignora caixa, acento e o parêntese final, para
que "Fator de capacidade (FC)" e "Fator de capacidade" sejam uma entrada só. Isso junta 7 grafias:

| Entrada | Definições juntadas |
|---|---|
| Fator de capacidade | M01 "Fator de capacidade (FC)" + M03, M08, M11, M14 |
| Fator de carga | M01 "Fator de carga (FC)" + M08, M10, M16, M17 |
| Arbitragem | M03 "Arbitragem (de energia)" + M14, M16 |
| Eficiência de ciclo | M03 "Eficiência de ciclo (round-trip)" + M16 (**entrada nova** de vários módulos) |
| Concessão | M05, M06 + M15 "Concessão (E&P)" |
| Ambiente de contratação regulada | M05, M08 + M09 "… (ACR)" |
| Ambiente de contratação livre | M05, M08 + M09 "… (ACL)" |

Só "Eficiência de ciclo" vira entrada de vários módulos que a extração não contava, daí 185. Em todas, a
grafia literal de cada módulo continua visível ("Na fonte"). O M15 desambigua a própria concessão de E&P
na definição, que aparece inteira.

## Releitura dos 7 termos

Os 7 foram achados de novo mecanicamente sobre o agrupamento da tela (entradas com números diferentes
entre definições): Grupo A, Grupo B, ONS, Fator de capacidade, GSF, ANEEL, EPE. Lidos definição por
definição:

| Termo | Módulos | Números | Leitura |
|---|---|---|---|
| Grupo A | M01, M06, M09, M10 | 2,3 kV em M01, M06 e M10; M09 diz "média e alta tensão", sem número | **Concordam.** M01 acrescenta as subclasses (A1 … AS), M06 a data de elegibilidade (1º/1/2024), M10 o atendimento subterrâneo. Nenhum contradiz o limiar. |
| Grupo B | M01, M06, M09, M10 | < 2,3 kV nos quatro | **Concordam.** M06 acrescenta os prazos de nov/2027 e nov/2028; M10 diz faturamento "em regra" monômio onde M01 diz monômio. |
| ONS | M01, M02, M06, M07 | 1998 e Lei 9.648 em M02, M06, M07; 60 Hz em M01; Decreto 5.081/2004 em M07 | **Concordam.** A natureza jurídica (direito privado, associação civil sem fins lucrativos) é a mesma nas quatro. |
| Fator de capacidade | M01, M03, M08, M11, M14 | M01: nuclear 85–95%, hidro BR ~50%, solar FV BR ~25%, peaker <15%. M03: ~50–55% hidro, 40–55% eólica NE, 25–30% solar com tracker, 85–90% nuclear | **Divergem.** Nuclear 85–95% (M01) × 85–90% (M03); hidro ~50% (M01) × ~50–55% (M03). Solar não entra: M01 fala de FV no Brasil, M03 de solar com tracker. O "08" do M11 é remissão ao Módulo 08. |
| GSF | M03, M06, M07 | "abaixo de 1" (M03) = "abaixo da unidade" (M07); "Bloco 9" em M06 é remissão | **Concordam.** M03 o define como razão; M06 pelo efeito; M07 pela garantia física ajustada. |
| ANEEL | M06, M07 | 1996 nos dois; dez/1997 em M06; Lei 9.427 em M07 | **Concordam.** |
| EPE | M06, M07, M15 | 2004 em M06 e M07; Lei 10.847 em M07 | **Concordam.** |

**A divergência do fator de capacidade não foi resolvida.** A entrada mostra, acima das definições, um
bloco "Números diferentes entre módulos" com os trechos literais lado a lado, cada um com o rótulo do
módulo, e a frase "a Alexandria não escolhe uma". As faixas se sobrepõem (85–90 cabe em 85–95), então não
é contradição lógica, mas o aluno lê dois números para a mesma coisa, e a regra é mostrar.

Essa divergência só aparece porque a entrada junta o M01 "(FC)" com o M03. Na chave da extração eles
ficavam separados, e por isso a leitura anterior ("nenhum dos casos lidos contradiz") não a via.

## O vínculo termo → aula

**Regra** (`glossario-ocorrencia.ts`, a mesma que monta o padrão de `termosDaAula`):

- o texto da aula são os blocos em que a aula liga termos: parágrafo, nota, itens de lista, células de
  tabela. Título de seção, fórmula, lead e `span.calc` não contam;
- o parêntese final do termo sai, e a sigla entre parênteses **não** casa sozinha ("FC" é capacidade
  num módulo e carga em outro);
- sigla e unidade (até 4 letras, ou maiúscula depois da primeira) casam com a caixa exata; palavra comum
  casa sem caixa; fronteira de palavra dos dois lados; marca de HTML separa o texto.

**Calculado em runtime, não gravado.** As outras sessões estão portando o texto das aulas; um índice
gravado ficaria velho no primeiro commit delas. O cálculo é por módulo e sob demanda: a aula calcula só o
seu módulo; a entrada do glossário calcula as contagens por módulo fora do primeiro render (o total de
1,04 milhão de caracteres custa de 80 ms no Node a algumas centenas de ms no painel do navegador).

**Contagem por módulo** (texto das aulas como está em `19cfba7`):

| | M01 | M02 | M03 | M04 | M05 | M06 | M07 | M08 | M09 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Aparecem / termos | 34/38 | 61/65 | 44/63 | 49/58 | 47/72 | 84/99 | 63/118 | 66/124 | 96/136 |

| | M10 | M11 | M12 | M13 | M14 | M15 | M16 | M17 | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Aparecem / termos | 78/161 | 63/150 | 92/152 | 79/180 | 100/158 | 99/174 | 112/184 | 80/192 | **1.247/2.124** |

**Ligação na aula, medida com o código real** (`termosDaAula` + `ligarTermos` + `lerHtml` sobre o corpo de
cada aula, no navegador): **141 de 141 aulas** ligam termos; dos 2.057 pares termo × aula do índice,
**2.046 viram link** e nenhum link aparece fora do índice. Os 11 restantes são termos cuja única
ocorrência na aula está dentro de um termo mais longo já ligado (a aula liga a primeira ocorrência livre,
sem sobrepor). O glossário diz a verdade ("aparece"), e a palavra está no texto, mas sem sublinhado:

`aula-04-04` Capacidade · `aula-08-04` Carga · `aula-09-03` Comercializador, Exposição, Sobrecontratação ·
`aula-09-08` Sobrecontratação · `aula-15-03` Pré-sal · `aula-16-05` Escopo · `aula-16-07`, `16-08`, `16-10` Anunciado

**Onde a ligação aparece na tela hoje:** só nas aulas que montam no modelo v3. Em `19cfba7` é o M01. Os
outros módulos ligam sozinhos quando a sessão de porte de cada um vira `pronto: true` em `modulos-v3/mNN.ts`;
não há nada a fazer no glossário para isso.

## Trocas editoriais (Q03 estendida ao glossário)

A coordenação decidiu em 15/11/2026 que a Q03 vale também para o glossário: a marca e o vocabulário interno
saem das definições de todos os módulos; o resto continua literal. A troca de marca é a mesma do porte do
M01 (P24: GridAlpha → NIVAR). Mora em `tools/alexandria-dados/glossario/editoriais.mjs`: o gerador aplica,
escreve cada troca no cabeçalho do arquivo do módulo, e o verificador aplica do lado da extração antes de
comparar, lista cada uso e falha se sobrar marca no produto.

Varredura dos 2.124 verbetes (termo, família/etiqueta e definição), sem caixa: "GridAlpha", "War Room",
"Cobaia Zero", "Summit". Resultado:

| Verbete | Campo | Antes (literal da extração) | Depois |
|---|---|---|---|
| `m01-lex-17` Grupo A (`gl-grupo-a`) | definição | "Todo o universo industrial relevante da **GridAlpha** está aqui." | "Todo o universo industrial relevante da **NIVAR** está aqui." |

Uma troca, e nenhuma ocorrência de vocabulário interno. Se um dia aparecer "War Room", "Cobaia Zero" ou
"Summit" na extração, o gerador para: não há troca decidida para eles, e escolher uma seria plausibilidade.

## Termo emprestado de módulo anterior

Decisão da coordenação (15/11/2026): quando o módulo da aula não define um termo, a aula o liga com a
definição do módulo **anterior** mais próximo na ordem da trilha, rotulada "Glossário · definido no MNN".
Se o módulo da aula define o termo, a definição dele continua valendo (e a do anterior não entra). Módulo
posterior nunca empresta. O M01 não tem anterior e não empresta nada.

- Onde: `emprestimosDoModulo` e `emprestadosNaAula` em `src/lib/alexandria/verbetes.ts`; `termosDaAula`
  acrescenta os emprestados depois dos do módulo, com `rotulo`. "Aparece" segue a mesma regra mecânica
  (decisão 5), calculada só sobre o texto da aula, uma vez por aula.
- O rótulo é desenhado em `Leitura.tsx` (`DefinicaoNoLugar`): a linha `Glossário · {termo.def.codigo}` virou
  `{termo.rotulo}`. É uma linha fora da posse original desta sessão, mudada porque a decisão pede o rótulo; a
  branch `wave/alexandria-v3` não mexe nessa linha.
- O glossário geral não muda: "aparece na Aula N" continua contando só as aulas do módulo de cada definição.

Medido com o código real (`termosDaAula` + `ligarTermos` sobre as 141 aulas, no navegador):

| | M01 | M02 | M03 | M04 | M05 | M06 | M07 | M08 | M09 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Links do próprio módulo | 74 | 111 | 70 | 85 | 56 | 125 | 79 | 112 | 182 |
| Links emprestados | 0 | 43 | 58 | 43 | 42 | 58 | 61 | 74 | 143 |

| | M10 | M11 | M12 | M13 | M14 | M15 | M16 | M17 | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Links do próprio módulo | 141 | 108 | 116 | 124 | 182 | 167 | 176 | 134 | **2.042** |
| Links emprestados | 130 | 100 | 69 | 71 | 106 | 134 | 143 | 184 | **1.459** |

- 1.537 empréstimos aparecem no texto de alguma aula; 1.459 viram link (os outros só aparecem dentro de um
  termo mais longo já ligado). Nenhum vem de módulo posterior.
- Os links do próprio módulo passaram de 2.046 para 2.042: em 4 pares, a única ocorrência do termo do
  módulo fica dentro de um termo emprestado mais longo que vem antes no texto.
- Custo: a primeira chamada de `termosDaAula` numa aula leva no máximo 28 ms no painel do navegador.
- Render: com o M09 ligado ao modelo v3 só na worktree e só para o teste (`pronto: true` revertido, não
  commitado), a Aula 01 do M09 tem 54 termos ligados; "energia", definida no M01 e no M04, abre "Glossário ·
  definido no M04". Conferido a 1440 claro e a 390 noturno, sem rolagem lateral.
- **Densidade (registro):** palavras comuns definidas em módulos anteriores passam a ligar ("Energia",
  "Lei", "Vigência", "Dispositivo"). A aula liga só a primeira ocorrência de cada termo, mas uma aula longa
  dos últimos módulos chega a dezenas de sublinhados. Se ficar pesado na leitura, o ajuste é de regra (por
  exemplo, emprestar só sigla e termo composto), e é decisão, não conserto.

## Render verificado

Playwright com o Chrome do sistema, contra o dev server desta worktree:

- `/alexandria/glossario`, entrada e `fator-de-capacidade` (bloco de divergência, definições, "Onde
  aparece") em **1440×900 e 390×844, claro e noturno**. `scrollWidth` igual à largura nas quatro, sem
  rolagem horizontal.
- Busca sobre os 2.124: "take-or-pay" acha a entrada de M03, M04, M09 e M14; "eletrolis" acha
  Eletrolisador e Eletrólise (M12) e trechos de definição do M12 e do M16.
- Filtro M12: 152 termos em 8 famílias da fonte. Filtro "não aparece" no M17: 112 termos (192 − 80).
- Clique: entrada → "M01 · aparece na Aula 08" → a aula 8 do M01 liga "fator de capacidade" → o termo
  abre a definição do M01 (a do módulo da aula, não a do M03).

## Portões

- `npx tsc -b`: 0 erro.
- `gridalpha-detect src`: 1 P0 (o de base, `atlas/PaisPerfil.tsx`) / 19 P1 / 36 P2, a linha de base.
  O bin do auditor quebra em caminho com espaço (`C:\dev\GridAlpha v2\…`) quando não acha o `tsx` local,
  porque cai em `npx tsx` com `shell: true`.
- **O pre-commit ESTÁ instalado** (`core.hooksPath = C:\dev\GridAlpha v2\.husky`), ao contrário do que diz o
  `AGENTS.md`, e audita os arquivos staged. Numa worktree sob `.claude\worktrees\` ele bloqueia todo commit
  pelo motivo acima, sem chegar a auditar. Correção de ambiente, sem pular o hook: `npm ci` dentro de
  `tools/gridalpha-detect/` (o `node_modules` dali é ignorado pelo git); o bin passa a usar o `tsx` local,
  sem shell. Com isso o hook rodou e passou: 26 arquivos, nenhum achado.

## Pendências

1. ~~"GridAlpha" numa definição~~: decidido e aplicado (Q03 estendida ao glossário, ver acima).
2. ~~Termo de outro módulo não liga na aula~~: decidido e aplicado (empréstimo do módulo anterior, ver acima).
3. **Os 11 pares sombreados**: ficam como estão, por decisão da coordenação (15/11/2026).
