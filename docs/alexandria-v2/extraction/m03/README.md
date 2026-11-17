# Extração M03 — Tecnologias de Geração

**Camada fonte.** Tudo é literal e tem origem (seletor, trecho inicial e linha ±3). Contradições ficam registradas com
as duas leituras e não são resolvidas aqui. A camada Alexandria (P17–P24) se aplica depois, no produto.

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo03.html` (3.585 linhas).
**Data:** 2026-09-17.

## Arquivos

| Grupo | Arquivos | Conteúdo |
|---|---|---|
| modulo | `modulo.json`, [`modulo.md`](modulo.md) | Identidade, horas, capacidades, § MAP, roteiro, critérios (P14), voz, erros comuns, três níveis e comparação com código e catálogo |
| aparato | `aparato.json`, [`aparato.md`](aparato.md) | Caso Operação A, quiz, checklist final, índice de exercícios, referências e glossário |
| instrumentos | `instrumentos.json`, [`instrumentos.md`](instrumentos.md) | Os 9 INST · NN: markup, script verbatim, ramos, execução do original, varredura exaustiva e comparação com o código |
| verificação | `verificacao.json` | Literalidade, origens, recontagem, quiz campo a campo e cobertura por token |

**Extratores** (em `extratores/`, Node 24, só leitura sobre a fonte e o código):

| Script | Função |
|---|---|
| `lib.mjs` | Biblioteca comum dos três extratores |
| `m03_modulo.mjs` | Gera `modulo.json` |
| `m03_aparato.mjs` | Gera `aparato.json` |
| `m03_instrumentos.mjs` | Gera `instrumentos.json` |
| `m03_verificar.mjs` | Verificação independente: não importa `lib.mjs` e gera `verificacao.json` |
| `m03_md_instrumentos.mjs` | Gera `instrumentos.md` a partir do JSON |

Para regenerar, rode na ordem: `m03_modulo`, `m03_aparato`, `m03_instrumentos`, `m03_verificar` e
`m03_md_instrumentos`. Os três primeiros são determinísticos: a mesma entrada dá JSON idêntico byte a byte.

## Contagens

| Item | Fonte | Extraído | Código | Catálogo canônico |
|---|---|---|---|---|
| Seções `.aula` | 20 (10 aulas + 10 aparatos) | 20 | — | — |
| **Aulas** | 10 (marcadores, § MAP e "Dez aulas") | 10 | 10 (`MODULO_03_AULAS`, `AULAS_POR_BLOCO`) | 10 |
| Subseções `x.y` | 22 | 22 | — | — |
| Capacidades (§ 00) | 8 | 8 | 0 | — |
| Perguntas do § MAP | 10 | 10 | 0 | — |
| **Instrumentos** | 9 `INST · NN` (0 de módulo, 0 LAB) | 9 | 9 (portados; os 9 divergentes no texto do veredito) | 9 |
| **Termos do glossário** | 63 (prosa "Sessenta e três") | 63 | 63 idênticos, 0 faltando | 63 |
| **Exercícios** | 10 (prosa "Dez exercícios"): 9 com aula e 1 solto | 10 | 10 idênticos | 10 |
| **Itens do checklist** | 18 | 18 | 3 (como badge) | "dezoito verificações" |
| **Questões do quiz** | 10 × 4 alternativas, 4 faixas de placar | 10 | 0 | — |
| Referências | 17 (11 + 6) | 17 | 0 como lista | — |
| Perguntas-relâmpago (§ Voz) | 30 + roteiro de 5 min (6 parágrafos) | 30 + 6 | 0 | 30 |
| Erros comuns (§ Erros) | 8 | 8 | 0 | — |
| Blocos "três níveis" | 5 (Aulas 01, 02, 05, 06, 10) | 5 | 0 | — |
| Caso | 6 dados · 4 leituras · 1 callout · 5 pedidos · 0 perguntas · 0 decisão | idem | 0 | — |
| Critérios literais | 3 critérios + 2 regras de estudo | 5 | — | 1 (citado cortado) |
| Divergências registradas | — | 10 (módulo) + 8 (aparato) + 3 (instrumentos) | — | — |

**Não existe no M03:**
- **§ Lab:** `laboratorios = null`.
- **§ Map (Tradutor):** `tradutor = null`. O equivalente são os blocos de três níveis.
- **h4 "Resultado esperado":** o equivalente é a lista "Além disso, ao final você consegue:".
- **Vídeo e imagens:** zero `<video>`, `<iframe>` e `<img>`.

## Divergências

### Fonte × fonte

1. **Critério (P18).**
   - O § 00 fala em "passa no Bloco 3" com duas capacidades.
   - O § Quiz pede 8/10.
   - O § Final pede 18 itens **e** 8/10.
   - O placar manda avançar já com 7 e só diz "Pronto para o Módulo 04" com 9 ou mais.
2. **Caso "Parte 3" (P17).** A numeração aparece no comentário, na etiqueta, no lead e no item 18 do checklist.
3. **Tema da Aula 05.** O § MAP diz "Solar: UFV e MMGD", e o marcador diz "Solar — UFV e MMGD".
4. **Perda do ciclo de bateria (P20).** Aparece como 10–15%, "uns dez por cento", 85–90% de eficiência e, no INST·07 e no Ex·08,
   como perda sobre a energia entregue (55/400 ≈ 13,6%, conta desta extração). As bases são diferentes e não declaradas.
5. **FCap do fio d'água (P20, content QA).** A tabela da Aula 01 diz "~40–55%, sazonal", e o cenário-padrão do INST·04
   mostra 63%.
6. **INST·04.** O texto do ramo "Ano bom" manda arrastar a ENA para ver "os produtos se separarem", mas o ramo
   "Dois produtos, escancarados" nunca é atingido no espaço do markup.
7. **Ramos nunca atingidos na varredura exaustiva.** São 4: INST·04 L3017, INST·05 L3056 e INST·06 L3166 e L3172.
8. **"1,4 GW" de Angra 3.** O número só existe num distrator do quiz. Não tem âncora no texto.
9. **Remissão ao "erro nº 5 da tabela de mitos".** O Ex·08 e a Q09 dependem da ordem da tabela do § Erros.
10. **Marca GridAlpha (P24).** Aparece no cabeçalho, no hero-meta, na pull-quote, no rodapé e nos callouts.
11. **Resíduos de template.** O cabeçalho mostra "Cobaia Zero v3.0", e o `<style>` tem um bloco comentado
    "Módulo 02".
12. **Glossário.** A ordem tem duas trocas locais por efeito de caixa. Uma única etiqueta é "Hidro · preview" (GSF).

### Fonte × código

1. **Instrumentos.**
   - Os 9 vereditos estão parafraseados ou resumidos, e as interpolações numéricas se perderam.
   - O INST·06 não seleciona o ramo do veredito 1:1 com o original.
   - INST·01 e INST·08: as pílulas viraram `select` com o rótulo "Seleção", que não existe na fonte.
   - INST·09: as chaves viraram `select` "Ligada/Desligada".
   - INST·01: as participações (`DATA`) não foram portadas.
   - INST·08: a pílula não reescreve o FC do preset, a saída "Premissas do preset" não é devolvida e há uma saída
     extra, `i08-cappct`.
   - Desenhos não portados: INST·01, 03, 05, 06 e 09.
   - O cálculo numérico é idêntico em 100% das comparações (8 instrumentos com cálculo).
2. **Exercícios.** O Ex·03 ("Aulas 02–03") está só na `aula-03-02`, e `points: 1` não tem origem.
3. **Horas.** A fonte diz "4 – 5 horas", e `alexandria-blocks.ts` tem `null` com `priority: 'confirmar'`.
4. **Proveniência nos comentários.** O código atribui "Dez aulas" ao hero, mas a frase está no § MAP.
5. **Badges.** `name`, `category` e `expReward` dos 3 badges do M03 não têm origem, e a categoria "dominio" conflita
   com o P18.
6. **Ausentes no código.** Tese, capacidades, § MAP, critérios, erros, voz, três níveis, caso, quiz, checklist
   (exceto os 3 badges) e referências.
7. **Sem divergência.** Títulos e subtítulos das 10 aulas, os 63 termos e o texto dos 10 exercícios.

### Fonte × catálogo

1. **Título (P24).** O h1 longo convive com "Tecnologias de Geração" (`<title>`, rodapé e catálogo concordam).
2. **Próximo módulo.** A fonte diz "Economia de Mercados", e o catálogo e o código dizem "Economia de Mercados de
   Energia".
3. **Critério citado.** O catálogo corta a citação do § 00 e omite "O teste honesto".
4. **Sem divergência.** Escala (10 · 9 · 63 · 10 · 30 · 4–5 h), aulas (tema e afirmação) e nomes dos 9 instrumentos.

## Lacunas (a fonte não tem)

- **Módulo.**
  - Não há eixos declarados.
  - `horas.min` e `horas.max` são `null`.
  - As 30 perguntas-relâmpago não têm resposta de referência.
- **Caso.** Não tem perguntas ao learner nem decisão pedida (P17: Desafio de decisão na camada Alexandria).
- **Quiz.** Não tem vínculo com aula, feedback distinto para erro nem nova tentativa.
- **Checklist.** Não tem verificação nem registro.
- **Exercícios.**
  - Nenhum tem critério próprio.
  - A Aula 07 não tem exercício.
- **Instrumentos.**
  - Nenhum tem pergunta própria.
  - Nenhum declara a fonte dos números por valor (P19: "cenário didático; fonte externa não declarada").
  - Nenhum declara tolerâncias, previsão ou gabarito (P6).
  - As fileiras de pílulas e chaves não têm rótulo.
- **Referências.** Não têm URL, tipo, data de acesso, ano ou editora dos livros, nem campos D5.
- **Glossário.** Não tem vínculo termo → aula.
- **Anotação a revisar.** `marcacao_p14` é inferência por regra e precisa de revisão humana.

## Resoluções que se aplicam na camada de produto

| Achado | Decisão |
|---|---|
| Caso "Parte 3", sem perguntas nem decisão | P17: "Caso — Operação A" + Desafio de decisão (camada Alexandria) |
| Critério em várias formas | P18: conclusão, desempenho e evidência separados; nenhum limiar legado declara domínio |
| Instrumentos sem fonte dos números nem tolerância | P19 |
| Faixas de FCap e perda de ciclo conflitantes | P20: content QA |
| Sigla FC | P21: no M03, FC é sempre fator de capacidade → FCap |
| Contagem do glossário | P22: 63, derivada da coleção (prosa e markup já concordam) |
| "Trava 3/4" | Não ocorre no M03 (0 ocorrências de "Trava") |
| Marca GridAlpha; títulos do módulo e do M04 | P24: Alexandria/NIVAR; o catálogo canônico governa os nomes |

## Verificação adversarial (2026-09-17)

Um verificador externo usou parse e varredura próprios. Os detalhes estão nas seções "Verificação" de
[`modulo.md`](modulo.md), [`aparato.md`](aparato.md) e [`instrumentos.md`](instrumentos.md).

- **Contagens.** Todas as contagens declaradas foram recalculadas direto no HTML, e todas conferem.
- **Conteúdo e fórmulas.** Conferem 100% do quiz, do checklist, do glossário, dos exercícios, das referências, da
  § Voz, dos erros, do § MAP, das capacidades, do caso, dos blocos de três níveis e dos scripts dos 9 instrumentos
  (verbatim, linha a linha).
- **Instrumentos.** Os 4 ramos inalcançáveis e o FCap de 63% do INST·04 foram confirmados por nova execução.
- **Origens.** As 378 origens estão a até 3 linhas da linha declarada.
- **Correção 1.** A leitura "INST·07 (script) e Ex·08" de `div-m03-ap-04-perda-bateria` não era literal. Virou três
  leituras literais: L3200, L3201 e L2348. O `m03_verificar.mjs` também perdeu a exceção que a tirava da checagem,
  e as leituras conferidas passaram de 44 para 47.
- **Correção 2.** A leitura do `alexandria-blocks.ts` em `div-m03-mod-02-horas` estava com os campos fora de
  ordem. Agora está na ordem real.
- **Segunda verificação adversarial.** Um segundo verificador conferiu 100% dos `html` e `texto`, as 378 origens,
  todas as contagens, os 9 scripts, a re-execução dos cenários e da varredura, e as 54 leituras de divergência.
  - **Correção.** Os prefixos entre colchetes nas leituras do placar (`div-m03-mod-04` e `div-m03-ap-01`) ganharam
    `nota_literal`. Os detalhes estão em `modulo.md` e `aparato.md`.
