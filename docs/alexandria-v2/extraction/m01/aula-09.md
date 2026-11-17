# M01·A09: Qualidade de energia

Arquivo de dados: [`aula-09.json`](aula-09.json). Gerador: [`extratores/gen-aula09.mjs`](extratores/gen-aula09.mjs). Verificador: [`extratores/verify-aula09.mjs`](extratores/verify-aula09.mjs).

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html`, 3.212 linhas. A aula ocupa as linhas 2098 (comentário) e 2100 a 2174 (`section.aula`). A A08 termina na linha 2095 e não foi tocada.
- **Como foi extraído:** um script node caminha as linhas da section e **lança erro diante de qualquer linha que não reconheça**. Nenhuma prosa foi digitada. O campo `html` guarda o innerHTML literal. O campo `texto` guarda o mesmo conteúdo sem tags.
- **Cobertura por token (§5):** 548 de 548 tokens casados (**100%**). A A09 não tem instrumento, então não há nada a descontar do denominador.
- **A A09 não tem instrumento, figura, exercício nem script.** Isso foi **medido** (`<input>`, `<script>`, `<svg>`, `<img>`, `class="instrument*"`, ids `i09-`, `div.exercise` na fatia: todos 0), não presumido.

## Estrutura do JSON

| Chave | Conteúdo |
|---|---|
| `meta` | Fonte, linhas, método, convenções |
| `aula` | Marcador ("Aula 09 · Qualidade de energia"), h2 e a pergunta do § MAP (L1347): "Por que tensão ruim é problema financeiro, não só técnico?". Duração, dificuldade e vídeo são `null` |
| `blocos[]` | 14 blocos na ordem da fonte (tabela abaixo). Cada um com `origem {seletor, trecho_inicial, linha_aprox}`. Tabelas com cada célula e cada linha com a própria `origem`; lista com cada item |
| `figuras` | `[]`, com nota da medição |
| `instrumentos` | `[]`, com `instrumentos_nota` da medição |
| `exercicios` | `[]`, com `exercicios_nota` e `exercicios_varredura` (os 8 exercícios do § Drill varridos nos três campos) |
| `relacionados_nao_vinculados[]` | 1 item do checklist final (L2508). Nenhuma questão do quiz trata do tema (medido) |
| `remissoes_de_outras_partes[]` | 1: a A03 (L1644) promete voltar ao tema na A09 |
| `mencoes_tematicas_fora_da_aula[]` | 6 menções ao tema fora da section (hero, A07, checklist, léxico do PRODIST, referências) |
| `termos_lexico` | 9 candidatos por correspondência textual (ver abaixo) |
| `divergencias[]` | 4 divergências da fonte (DIV-01 a DIV-04) |
| `comparacao_codigo` | Verificações programáticas e 6 divergências com o código (COD-01 a COD-06) |
| `contagens` | Totais |

## Blocos

14 blocos: lead 1, título 4, parágrafo 3, **tabela 3**, destaque 2, **lista 1**. 42 células de dados (3×3, 6×3 e 5×3 linhas × colunas, sem contar o cabeçalho), 6 itens de lista.

| Bloco | Linha | O que |
|---|---|---|
| b01 lead | 2105 | "Qualidade de energia é tema técnico cuja consequência é financeira…" |
| b02 título | 2107 | 9.1 As três dimensões da qualidade |
| b03 parágrafo | 2108 | "A ANEEL trata qualidade do fornecimento em três dimensões:" |
| b04 tabela | 2111–2119 | Dimensão × O que mede × Indicadores (3 linhas: serviço/continuidade, produto/tensão, comercial) |
| b05 título | 2121 | 9.2 Indicadores de continuidade |
| b06 tabela | 2123–2134 | Sigla × Significa × O que mede (6 linhas: DEC, FEC, DIC, FIC, DMIC, DICRI; a coluna de siglas tem `td.mono`) |
| b07 título | 2136 | 9.3 Harmônicos, afundamentos e desequilíbrios |
| b08 parágrafo | 2137 | "Mesmo sem interrupção total, há fenômenos que degradam a qualidade do produto entregue:" |
| b09 tabela | 2139–2150 | Fenômeno × O que é × Consequência industrial (5 linhas: harmônicos, afundamento, sobretensão, desequilíbrio, flicker) |
| b10 destaque | 2152–2155 | "Conformidade de tensão · PRODIST Módulo 8" (callout neutro) |
| b11 título | 2157 | 9.4 Por que isso é custo operacional, não só técnico |
| b12 parágrafo | 2158 | "Para uma residência… é prejuízo direto:" |
| b13 lista | 2160–2167 | **6 itens** (`ul`), continuação do b12 |
| b14 destaque | 2169–2172 | "Onde isso entra no produto" (callout neutro, bloco de produto) |

**Os 6 itens da lista de 9.4 (verbatim, L2161–2166):**
1. Linha de produção parada — perda de receita, atraso de entrega;
2. Material em processo perdido — desperdício direto;
3. Equipamento danificado — reposição, manutenção corretiva;
4. Horas extras para recuperação — custo de mão de obra;
5. Vida útil reduzida — depreciação acelerada;
6. Risco de segurança — incidentes elétricos.

**Conferência de aritmética, sem divergência:** o callout PRODIST (b10) diz sete dias de medição a cada 10 minutos, "totalizando 1.008 leituras". Derivado: 7 × 24 × 6 = 1.008. Os números concordam.

## Instrumento, exercício e quiz: ausências medidas

- **Instrumento:** nenhum. Na fatia 2100–2174: `class="instrument*"` 0, `<input>` 0, `<button>` 0, `<script>` 0; no arquivo inteiro, linhas com `i09-` ou `INSTRUMENT 09`: 0. O § MAP não lista instrumento para a aula.
- **Exercício:** nenhum vinculado. Dos 8 `div.exercise` do § Drill, **0** têm tag "Aula 09". A varredura dos três campos (tag, enunciado e gabarito, protocolo §4) por tema (qualidade, harmônicos, afundamento, DEC/FEC/DIC/FIC, PRODIST, DRP/DRC…) casa só o Ex·05, cujo gabarito diz "harmônicos?": ele tem a tag "Aula 07" e é da A07. Não vira exercício da A09.
- **Quiz:** nenhuma das 10 questões, nem as opções, trata de qualidade de energia.
- **Checklist final (L2508):** "Listar três fenômenos de qualidade de energia e sua consequência industrial." É o único item relacionado, sem tag de aula.

## Remissões e menções de outras partes

- **A03, L1644 (promessa):** "Quando estudarmos qualidade de energia na Aula 09, voltaremos a este ponto." Ver DIV-01.
- **Menções ao tema** (texto completo no JSON): L1272 (hero, "CLE · Diagnóstico · PQA"), L1990 (callout da A07), L2508 (checklist), L2649 (léxico do PRODIST) e L2694–2695 (referências do § Ref).

## Termos do léxico (candidatos por texto, não posse)

A fonte não declara aula por termo. Ler a frase antes de ligar (§2).

| Termo | Ocorrências | Leitura da frase |
|---|---|---|
| DEC / FEC | DEC 2, FEC 2 | o conceito (tabelas 9.1 e 9.2) |
| DIC / FIC / DMIC / DICRI | 3, 2, 2, 2 | o conceito (tabelas 9.1 e 9.2) |
| Harmônicos | 3 | o conceito (lead, h3 9.3 e tabela 9.3) |
| PRODIST | 1 | o conceito (callout, título "PRODIST Módulo 8") |
| Tensão | 11 | o conceito (lead, tabelas 9.1 e 9.3, callout) |
| Trifásico | 1 | o conceito ("sistema trifásico", tabela 9.3, desequilíbrio entre fases) |
| Frequência | 3 | **não é o conceito do verbete (60 Hz)**: as 3 são "frequência de interrupções" (FEC, FIC e a linha de serviço da tabela 9.1) |
| Energia | 5 | "Qualidade de energia" (marcador, lead, 9.4) e "Energia ruim… energia cara" (h2): uso composto e figurado, não o kWh |
| Eficiência | 1 | "perda de eficiência" na tabela 9.3 (desequilíbrio), uso solto |

## Divergências na fonte (sem escolha)

- **DIV-01, promessa não cumprida.** A 3.5 promete voltar à frequência na A09. Medido: as únicas "Frequência" da A09 são 3 células de frequência de **interrupções**, e "Hz", "60 vezes", "sincron" e "ciclos" ocorrem 0 vez. A fonte não cumpre nem retira a promessa.
- **DIV-02, Drill × aula sem exercício.** O § Drill diz "Os exercícios alcançam todas as nove aulas", mas as 8 tags ("Ex · 01 · Aula 01 … Ex · 08 · Síntese · Diagnóstico inicial") não incluem a Aula 09.
- **DIV-03, "qualidade do produto" em duas aulas.** A A07 (L1990) diz que os fenômenos de qualidade do produto incluem fator de potência, harmônicos, variações de tensão, desequilíbrios e flutuações (PRODIST Módulo 8). A tabela 9.1 da A09 define "Qualidade do produto (tensão)" como "Conformidade da tensão entregue" (DRP, DRC), e a tabela 9.3 não tem fator de potência. O léxico do PRODIST (L2649) lista "continuidade, tensão, fator de potência, harmônicos".
- **DIV-04, título × tabela × checklist.** O h3 9.3 nomeia três fenômenos (harmônicos, afundamentos, desequilíbrios), a tabela traz cinco (acrescenta sobretensão e flicker) e o checklist final pede para listar "três".

## Divergências em relação ao código portado

Código: `src/lib/data/alexandria-modulo-01-content.ts`, chaves `aula-01-09` (corpo, lead e entrada em `MODULO_01_AULAS`).

| Id | Gravidade | Resumo |
|---|---|---|
| COD-01 | alta | A lista `<ul>` de 9.4 (6 itens) não foi portada. O código não tem bloco `lista` em `aula-01-09` (itens presentes: 0/6). O parágrafo "…é prejuízo direto:" termina em dois-pontos sem continuação |
| COD-02 | média | Os dois callouts ("Conformidade de tensão · PRODIST Módulo 8" e "Onde isso entra no produto") viraram `nota {tom: neutro, label: null, html: rótulo}` + parágrafo solto. Na fonte o texto é o rótulo e o parágrafo é o corpo |
| COD-03 | média | O corpo do callout "Onde isso entra no produto" não é verbatim: a fonte diz "Power Quality Audit (PQA) da GridAlpha" e o código diz "da NIVAR" (troca editorial, P24). Além disso, este é o bloco de produto que o P7 manda não exibir, e o código o mantém |
| COD-04 | baixa | A fonte tem `<td class="mono">` nas 6 siglas da tabela 9.2 (DEC … DICRI). O tipo `tabela` do código só guarda o html da célula, e a classe se perdeu. Só aparência |
| COD-05 | baixa | `aulaIds` do glossário ligam 9 verbetes à `aula-01-09`: derivação do código. Os 9 casam com candidatos textuais, e nenhum candidato fica sem ligação. "Frequência" casa só por "frequência de interrupções" |
| COD-06 | info | Id: `aula-01-09` equivale a `m01-a09`. Não há instrumento nem exercício a mapear |

**Medido e sem divergência:** nenhum `</span>` órfão no corpo de `aula-01-09` (0). `activities: []` e `instruments: []` no código, coerente com a fonte (sem exercício nem instrumento).

**O que está conforme:**
- Lead e os 3 parágrafos de prosa verbatim.
- Títulos 9.1 a 9.4 com número e texto corretos.
- As 3 tabelas, com todas as células (cabeçalho incluído) verbatim e o `<b>` preservado.
- Corpo do callout "Conformidade de tensão · PRODIST Módulo 8" verbatim.

## Lacunas (a fonte não tem)

- **Qualidade comercial** aparece na tabela 9.1 ("Atendimento da distribuidora ao consumidor"; indicadores "de prazo, atendimento, reclamações"), mas nenhuma subseção a desenvolve: a 9.2 só trata continuidade e a 9.3 só trata produto. A fonte não nomeia nenhum indicador comercial.
- **Faixas de tensão.** O callout diz "adequada, precária e crítica", mas a fonte não dá os limites numéricos nem os de DRP e DRC.
- **Custos.** A 9.4 lista seis consequências sem número de custo.
- Duração, dificuldade, vídeo, imagem, referência por aula, instrumento, exercício e figura.

## Verificação

`node extratores/gen-aula09.mjs` e depois `node extratores/verify-aula09.mjs`. O verificador prova por substring contra o HTML, confere a `origem` com ±3 linhas e recalcula a cobertura por token só a partir do JSON.
