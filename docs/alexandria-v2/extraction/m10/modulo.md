# M10 · grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo10.html` (4.813 linhas, LF, 369.468 bytes,
359.726 caracteres). Saída: [`modulo.json`](modulo.json).

**Como foi extraído.** `extratores/m10_modulo.mjs` monta uma árvore de elementos com offsets (`extratores/lib.mjs`) e
lê cada campo pelo seletor. Nenhum texto de conteúdo foi digitado. O código (`src/lib/data`) e o catálogo canônico
foram lidos só para comparar.

**Verificação.** `extratores/verify.mjs` conferiu 578 strings de conteúdo como substring da fonte e 131 `origem`
(trecho na linha declarada, janela −3/+12). Não houve falha. A cobertura por token foi de 100% em §00, § MAP (sem o
markup do Inst · 01), § Erros, § Voz e hero + rodapé. O relatório está em `extratores/verify-report.json`.

## Vocabulário medido

O M10 usa o vocabulário abreviado: `section#id`, `.sec-id` com `<b>`, `h2`, `p.lede`, `.box` (`cy`/`rd`/`gd`), `.lv`,
`.fi`, `div.inst`, `details`/`.det-bd` e `span.term`. Os seletores do M01 (`aula-marker`, `glossary-item`,
`exercise-tag`…) dão zero. Não há tag sem fechamento na árvore.

## Estrutura do JSON

| Chave | O que contém |
|---|---|
| `identidade` | Kicker, h1, `<title>`, subtítulo (`p.sub`) e os **8 pills**. Também `horas` (`null` + nota), `eixos` (os "quatro eixos de controle": caixa do §00 e h3 01.1–01.4), rodapé e as linhas do catálogo canônico e do `bloco-10` |
| `tese` | §00 inteiro, em 15 blocos: lede, 8 parágrafos, 3 h3 (§00.1–§00.3) e 3 caixas |
| `resultado_esperado` | `null` + nota. Não há bloco "Resultado esperado" nem lista de capacidades |
| `mapa` | § MAP em blocos, as **3 perguntas** (as lentes do Inst · 01) e os **9 cartões** de aula (título curto + descrição; `pergunta` = null) |
| `roteiro` | As **19** seções em ordem, **9 aulas + 10 aparatos**. Cada uma traz marcador, rótulo, h2, lede, contagens de estrutura, instrumentos e o espelho no código |
| `criterio` | **10** formas literais de critério, com `marcacao_p14`, e os quatro achados do critério (tabela 09.3) |
| `laboratorios` | `null` + nota. Não há § Lab; o instrumento de módulo é o Inst · 01, no § MAP |
| `voz` | Roteiro oral do § Voz (**6 blocos**), 4 princípios literais (rodapé e ledes de § Ref, § Erros e § Ex) e as **8** caixas "Números vivos" |
| `erros_comuns` | § Erros: **20** pares afirmação/correção |
| `tradutor` | Não há "Tradutor". O equivalente são os **5** blocos `.lv` de três níveis (Criança / Executivo / Especialista), 15 painéis |
| `fichas_de_modalidade` | As **6** fichas `.fi` da Aula 02 (declaradas no hero), 6 campos cada |
| `produto_p7` | As **10** caixas "Onde isso entra no produto", só por posição (P7) |
| `marca_p24` | As **4** ocorrências de "GridAlpha" no corpo |
| `comparacao_codigo` | Contagem de aulas por 8 sinais, títulos, leads, `bloco-10`, badge e Recursos do Módulo |
| `divergencias` | **12** itens com `leitura_a` / `leitura_b`, nenhum resolvido |

## Identidade e catálogo (P24)

- **Título.** O h1 é "Tarifas e a Conta de Luz Industrial", igual ao do catálogo canônico, ao do `bloco-10` e ao do
  rodapé. O `<title>` acrescenta o prefixo "Alexandria · Módulo 10 — ". Não há divergência de título.
- **Subtítulo.** "A fatura não é um preço. É uma soma de componentes…" (`p.sub`, L427).
- **Trilha.** O kicker diz "Trilha 2 — O setor elétrico brasileiro"; o catálogo canônico diz "Setor Elétrico
  Brasileiro" (div-05).
- **Horas.** A fonte não declara. O `bloco-10` tem 8–10 h, sem origem na fonte, e o catálogo canônico não traz horas
  (div-04).
- **Pills.** 9 aulas · 11 instrumentos · 6 fichas de modalidade · 161 termos · 14 exercícios · 10 questões · critério
  8/10 · 28 itens de checklist · 35 referências. Todos conferem com o markup (ver `aparato.md`).

## Roteiro (P8)

| # | Seção | Rótulo | Título (h2) | Instrumentos |
|---|---|---|---|---|
| 1 | §00 | Tese | Quatro eixos, quatro horizontes, um documento | — |
| 2 | §MAP | O mapa da fatura | Catorze linhas, três perguntas | Inst · 01 |
| 3 | Aula 01 | Fundamento | Os quatro eixos de controle | — |
| 4 | Aula 02 | Enquadramento | Grupos, subgrupos e modalidades | Inst · 02 |
| 5 | Aula 03 | Demanda | Demanda contratada: o custo de errar para cada lado | Inst · 03, 04 |
| 6 | Aula 04 | Postos horários | Como a mesma energia custa diferente conforme a hora | Inst · 05 |
| 7 | Aula 05 | Reativo | Fator de potência e excedente reativo | Inst · 06 |
| 8 | Aula 06 | Encargos | Encargos setoriais, um a um | Inst · 07 |
| 9 | Aula 07 | Tributos | Tributos e a transição em curso | — |
| 10 | Aula 08 | Ciclo | O ciclo que produz o número | Inst · 08, 09 |
| 11 | Aula 09 | Síntese | A ordem de leitura em cinco minutos | Inst · 10, 11 |
| 12–19 | §Caso · §Erros · §Ex · §Quiz · §Voz · §Final · §Lex · §Ref | — | — | — |

**Contagem de aulas.** Oito sinais concordam em **9**:
- seções `Aula NN`, cartões do § MAP e o pill "9 aulas";
- numeração `NN.x` das subseções (01 a 09);
- no código, `MODULO_10_AULAS`, `totalInModule` e `AULAS_POR_BLOCO['bloco-10']`;
- o catálogo canônico.

**Títulos.** O `title` do código é igual ao h2 nas 9 aulas, e o `subtitle` é igual ao rótulo do `sec-id` nas 9. O
catálogo canônico também usa o h2. Três cartões do § MAP trazem um título curto diferente do h2 (div-06): Aula 03
"Demanda contratada", Aula 04 "Postos horários" e Aula 06 "Encargos, um a um".

**Leads.** 6 de 9 são idênticos. Nas Aulas 03, 07 e 08 o código deixa um espaço antes da pontuação que vinha colada
ao `</b>` ("dinheiro :", "paga .", "publicado ,"). O texto é o mesmo (div-10).

## Critério (P14, P18)

| Id | Onde | Forma | P14 (inferido) |
|---|---|---|---|
| crit-01 | §00.3 | "O critério oficial deste bloco não é conceitual, é operacional… em cinco minutos" | cronometrado, oral/livre |
| crit-02 | pill | "10 questões · critério 8/10" | quiz |
| crit-03/04 | § Quiz h2 + lede | "critério de aprovação 8 de 10"; "O critério é oito acertos" | quiz |
| crit-05 | script do placar | `acertos>=8` → "Critério atingido…"; senão → "Abaixo do critério de oito acertos…" | quiz |
| crit-06 | lede da Aula 09 | "O critério de domínio deste bloco é cronometrado" | cronometrado |
| crit-07 | 09.3 | "O critério de domínio nomeia quatro achados." | — |
| crit-08 | § Final | "Vinte e oito verificações antes de assinar um parecer" | autodeclarado |
| crit-09 | § Voz | roteiro "para ser dito em voz alta", dez minutos | oral, cronometrado |
| crit-10 | Inst · 10 (9 passos) | "…dentro do envelope de cinco minutos previsto pelo critério de domínio." | cronometrado |

**Leitura pelo P18.** O §00.3 chama o critério cronometrado de "oficial", e o § Quiz chama 8/10 de "critério de
aprovação". Nenhum declara precedência (div-01). Diferente do M01, o placar tem só dois ramos, e com 8 acertos a
mensagem é de critério atingido (div-02). Nada disso vira "Aprovado" na interface (P18).

**Os quatro achados do critério** (tabela 09.3):
- Erro de enquadramento;
- Demanda subótima;
- Fator de potência;
- Mudança de ambiente.

## Voz

- **Roteiro oral.** Seis blocos rotulados:
  - Abertura, um minuto;
  - Os quatro eixos, dois minutos;
  - Por que a conta sobe quando o consumo cai, dois minutos;
  - A ordem de leitura, dois minutos;
  - O que a fatura prova e o que ela não prova, dois minutos;
  - O fechamento, um minuto.

  A soma dá 10 minutos, como diz o h2.
- **Princípios.**
  - Rodapé: "Sem venda de energia. Sem comissão sobre contratos. Sem economia estimada.", "Todo número e toda regra com
    fonte primária…".
  - Lede do § Ref: "Toda referência normativa carrega número, ano e, quando cabe, artigo…".
  - Lede do § Erros e do § Ex.
- **Números vivos.** São 8 caixas `box rd` "Números vivos · verificar na fonte antes de uso externo" (§00 e Aulas 01,
  02, 03, 05, 06, 07 e 08), todas com data de consulta de 1º de agosto de 2026.

## Divergências

Detalhe completo em `divergencias[]` no JSON.

1. **div-01 · Critério.** Operacional cronometrado (§00.3) × 8/10 "de aprovação" (§ Quiz) × 28 verificações (§ Final).
   P18.
2. **div-02 · Placar.** Só dois ramos (≥8 / <8). Questão sem resposta conta como erro.
3. **div-03 · "Parte 10".** O caso é rotulado "Parte 10" e cita "Parte 9" e "nove partes anteriores". A série não
   existe na fonte do M10, e P17 manda não expor "Partes".
4. **div-04 · Horas.** A fonte não declara; o `bloco-10` diz 8–10 h.
5. **div-05 · Trilha.** "O setor elétrico brasileiro" (kicker) × "Setor Elétrico Brasileiro" (catálogo).
6. **div-06 · Títulos curtos.** Três cartões do § MAP diferem do h2 (Aulas 03, 04 e 06).
7. **div-07 · Marca (P24).** 4 ocorrências de "GridAlpha":
   - L551, caixa de produto do §00;
   - L1872, caixa de produto da Aula 05;
   - L3521, **referência 32 do § Ref**, voltada ao learner;
   - L3547, rodapé.
8. **div-08 · Exercícios.** A distribuição declarada (4/4/4/2) não bate com os prefixos (3/3/3 + 5 sem prefixo). Ver
   `aparato.md`.
9. **div-09 · Tempos.** Os 9 passos somam 280 s, dentro dos 5 minutos. O 09.2 diz que os três primeiros passos levam
   "menos de um minuto somados"; eles somam 75 s, e o veredito do Inst · 10 diz "menos de um minuto e meio".
10. **div-10 · Leads com espaço.** O mesmo artefato aparece nas notas dos Inst · 03, 05 e 11. O cabeçalho do código
    diz "359.726 bytes", mas esse número é de **caracteres**: a fonte não mudou desde o porte.
11. **div-11 · Badge.** A razão da regra `badge-anatomista-de-faturas` diz que o Bloco 10 "não tem HTML extraído",
    mas ele tem.
12. **div-12 · Recursos do Módulo.** `RecursosDoModulo.tsx` não registra o M10. Por isso o Inst · 01 (fora de aula) e
    os 14 exercícios soltos parecem inalcançáveis. Deduzido da leitura, não medido na tela.

## O que não existe no código

- **Seções.** Tese, cartões do § MAP, critérios, § Caso, § Erros, § Quiz, § Voz, § Final, § Lex (161) e § Ref (35).
- **Aulas e exercícios.** As 9 aulas e os 14 exercícios estão portados.
- **Instrumentos.** Os 11 estão portados, com divergências (ver `instrumentos.md`).

## Ausências declaradas

| Campo | Valor | Motivo |
|---|---|---|
| `identidade.horas.*` | `null` | A fonte não declara carga horária |
| `resultado_esperado` | `null` | Não há bloco de resultado esperado nem capacidades |
| `laboratorios` | `null` | Não há § Lab |
| `mapa.cartoes_das_aulas[].pergunta` | `null` | Os cartões têm título e descrição, sem pergunta |

## Verificação (verificador adversarial, 2026-09-17)

Conferido com scripts próprios:
- 131 origens em ±3 linhas e 194 textos com origem verbatim;
- Tradutor 5 × 3 e fichas (36 linhas `fi-k`/`fi-v`) a 100%;
- § Voz a 100% (6 blocos);
- 20 pares de § Erros a 100%, com linha ±3;
- 10 critérios. Varredura por "critério|aprova|domínio" no HTML: nenhuma forma de critério fora das 10.
- 9 cartões e 3 lentes do § MAP;
- 8 pills;
- caixas: 8 "Números vivos" e 10 "Onde isso entra no produto";
- 4 GridAlpha.

Contagens e divergências (12) confirmadas. **Nenhuma correção neste grupo.** Nota: `contagens.aparatos = 10` inclui
§00 e § MAP.
