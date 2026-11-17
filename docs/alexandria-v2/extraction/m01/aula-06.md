# M01·A06: Tensão como categoria econômica

Arquivo de dados: [`aula-06.json`](aula-06.json). Gerador: [`extratores/gen-aula06.mjs`](extratores/gen-aula06.mjs). Verificador: [`extratores/verify-aula06.mjs`](extratores/verify-aula06.mjs).

> **CONFLITO PENDENTE DE DECISÃO DO FOUNDER: QA-M01-A06.** A tabela 6.1 põe o Grupo A em "≥ 2,3 kV" e o Grupo B em "< 2,3 kV". A tabela 6.2, sob o título "Os subgrupos do Grupo A", lista o subgrupo **AS** com "< 2,3 kV (subterrâneo)". As duas frases estão abaixo, verbatim e com linha. **Esta extração não escolheu leitura, não corrigiu a faixa e não propôs número.** Ver DIV-01.

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html`, 3.212 linhas. A aula ocupa as linhas 1828 a 1895 (a `section.aula` vai de 1831 a 1895; conteúdo de 1833 a 1893). **Não há script de instrumento**: a aula não tem instrumento.
- **Título (h2):** "A tensão de fornecimento define a tarifa que você paga." (a fonte põe `<em>` em "define"). **Marcador:** "Aula 06 · Tensão como categoria econômica".
- **Pergunta do § MAP (L1344):** "Por que sua tensão de fornecimento define seu grupo tarifário?". É a única pergunta que a fonte declara para a aula.
- **Como foi extraído:** um script node leu fatias do HTML por linha e aplicou regex ancorado, com asserção de âncora em cada linha. Nenhuma prosa foi digitada. `html` é o innerHTML literal e `texto` é o mesmo conteúdo sem tags.
- **Cobertura por token (§5):** 486 de 486 tokens casados (**100%**). A aula não tem instrumento, então o denominador é o texto inteiro da section.

## Estrutura do JSON

| Chave | Conteúdo |
|---|---|
| `meta` | Fonte, linhas, método, convenções (inclui `conflitos_pendentes`) |
| `aula` | Marcador, título do h2, pergunta do § MAP. Duração, dificuldade e vídeo em `null`, com nota |
| `blocos[]` | **16 blocos** na ordem da fonte: lead 1, título 4, parágrafo 7, tabela 3, lista 1. Cada bloco tem `origem {seletor, trecho_inicial, linha_aprox}` |
| `tabelas` / `listas` | Ids dos 3 blocos de tabela e do bloco de lista. Células em `blocos[].cabecalho` e `blocos[].linhas[].celulas[]`; itens em `blocos[].itens[]` |
| `figuras` / `formulas` / `destaques` | Vazios, com nota. A aula não tem figura, fórmula nem callout |
| `instrumentos` / `invocacoes_no_texto` | Vazios, com nota |
| `exercicios` | Vazio. Nenhuma das 8 tags do § Drill é "Aula 06" |
| `mencoes_em_exercicios_de_outras_aulas` | 4 menções ao tema da aula em exercícios de outras aulas (não são posse; §4 do protocolo) |
| `termos_lexico` | 11 candidatos por correspondência textual, sem vínculo declarado |
| `relacionados_nao_vinculados[]` | 1 questão do quiz (subgrupo A4) e 1 item do checklist final (Grupo A4) |
| `varredura_de_ausencia` | Regex e linhas de cada ausência medida |
| `divergencias[]` | 4 achados da fonte (DIV-01 a DIV-04). **DIV-01 é o QA-M01-A06** |
| `comparacao_codigo` | Verificações programáticas contra o `.ts`, o que está conforme e 7 divergências (COD-01 a COD-07) |

### Blocos, em ordem

| # | Tipo | Conteúdo | Linha |
|---|---|---|---|
| 1 | lead | "No Brasil, tensão não é apenas um parâmetro técnico…" | 1836 |
| 2 | título | 6.1 Grupo A e Grupo B — a divisão fundamental | 1838 |
| 3 | parágrafo | "A regulação brasileira divide consumidores em dois grandes grupos…:" | 1839 |
| 4 | tabela | Grupo / Tensão de fornecimento / Quem é, 2 linhas de dados (Grupo B, Grupo A) | 1842 |
| 5 | parágrafo | "A diferença entre os grupos não é cosmética…" (tarifa binômia) | 1851 |
| 6 | título | 6.2 Os subgrupos do Grupo A | 1853 |
| 7 | tabela | Subgrupo / Tensão / Perfil típico, 6 linhas de dados (A1, A2, A3, A3a, A4, AS) | 1855 |
| 8 | parágrafo | "Para fins de prospecção da GridAlpha no Brasil, o Grupo A4 é o terreno mais fértil…" | 1868 |
| 9 | título | 6.3 Por que tensão maior implica tarifa menor (em geral) | 1870 |
| 10 | parágrafo | "Quanto mais alta a tensão de fornecimento…Logo:" (termina em "Logo:") | 1871 |
| 11 | **lista** | `<ul>` com 3 `<li>` (L1873, L1874, L1875) | 1872 |
| 12 | parágrafo | "Um cliente A1 (em 230 kV) paga, em geral, tarifa total menor que um A4…" | 1877 |
| 13 | título | 6.4 Monofásico, bifásico e trifásico | 1879 |
| 14 | parágrafo | "Além do nível de tensão, o número de fases do fornecimento importa…:" | 1880 |
| 15 | tabela | Sistema / Onde aparece / Limitação típica, 3 linhas de dados | 1883 |
| 16 | parágrafo | "Motores trifásicos são mais eficientes, mais estáveis…" | 1893 |

### A lista de 6.3 (a que o código perdeu)

Texto verbatim, com linha. O `<ul>` e cada `<li>` carregam `style` inline na fonte; o estilo está em `ul_estilo_inline` e `itens[].estilo_inline`.

1. L1873: "Menos perdas técnicas embutidas na sua tarifa;"
2. L1874: "Menos uso de ativos de distribuição de baixa tensão;"
3. L1875: "Menor componente de TUSD comparada à TE."

O parágrafo L1871 termina em "Logo:" e o L1877 começa com "Um cliente A1…". As três razões vêm entre os dois.

## QA-M01-A06: as duas frases, verbatim (pendente de decisão do Founder)

| Leitura | Onde | Texto da fonte | Linha |
|---|---|---|---|
| **A** | 6.1, tabela Grupo A × Grupo B, linha **Grupo A**, coluna "Tensão de fornecimento" | "Alta e média tensão (≥ 2,3 kV)" | **L1846** |
| par da A | 6.1, mesma tabela, linha **Grupo B** | "Baixa tensão (< 2,3 kV)" | **L1845** |
| **B** | 6.2, sob o h3 "Os subgrupos do Grupo A" (L1853), tabela dos subgrupos, linha **AS**, coluna "Tensão" | "< 2,3 kV (subterrâneo)" | **L1863** |

A linha AS completa: "AS | < 2,3 kV (subterrâneo) | Centros urbanos com rede subterrânea".

O léxico do módulo repete as duas formas:
- **Grupo A** (L2593): "Classe de consumidores atendidos em alta ou média tensão (≥ 2,3 kV) — indústrias, grandes comércios. Subdivide-se em A1, A2, A3, A3a, A4 e AS por nível de tensão. …"
- **Grupo B** (L2597): "Classe de consumidores atendidos em baixa tensão (< 2,3 kV) — residências, pequenos comércios, pequenas propriedades rurais. …"
- **Tensão** (L2657): "…Define grupo tarifário no Brasil: Grupo B (baixa tensão, < 2,3 kV) ou Grupo A (média/alta tensão, ≥ 2,3 kV)."

**O que se mede:** um subgrupo do Grupo A (AS) com tensão abaixo do limite inferior declarado do Grupo A. A fonte não diz qual leitura prevalece. **Decisão:** nenhuma. Decidir exige conhecimento normativo externo, e a fonte é única. As saídas que o inventário (`aulas.md`) registra sem inventar são mostrar as duas literais com rótulo de conflito, ou o Founder declarar a leitura.

### Observação derivada por aritmética (DIV-02), também sem resolver

Os limites declarados na tabela 6.2 deixam intervalos de tensão sem subgrupo. É aritmética sobre as células, não afirmação da fonte; marcada como `derivado` no JSON.

| Entre | Intervalo (kV) |
|---|---|
| A4 (25 kV) e A3a (30 kV) | 25 a 30 |
| A3a (44 kV) e A3 (69 kV) | 44 a 69 |
| A3 (69 kV) e A2 (88 kV) | 69 a 88 |
| A2 (138 kV) e A1 (230 kV) | 138 a 230 |

A fonte também não diz se "69 kV" (A3) é um ponto ou uma faixa. O léxico "Volt (V)" (L2673) dá valores pontuais compatíveis ("13,8 kV (A4), 69 kV (A3), 138 kV (A2), 230 kV+ (A1)"), sem cobrir os vazios. Nada foi preenchido.

## Exercícios e instrumento

- **Exercícios vinculados: 0.** Nenhuma das 8 tags contém "Aula 06". O § Drill diz que os exercícios "alcançam todas as nove aulas" (L2389), o que as tags não confirmam (DIV-04).
- **Menções ao tema em exercícios de outras aulas** (prosa, não posse; §4 do protocolo). Varredura por Grupo A/B, A4, subgrupo, tensão de fornecimento, mono/bi/trifásico e "Aula 06" nos blocos de cada exercício:
  - Ex · 05 · Aula 07: enunciado (L2429) e gabarito (L2432) citam "Grupo A".
  - Ex · 07 · 3 níveis · Aula 05: gabarito (L2452) cita "Grupo A".
  - Ex · 08 · Síntese · Diagnóstico inicial (solto): gabarito (L2461) pede "tensão de fornecimento".
- **Instrumento: nenhum.** Sem `div.instrument`, sem id `i0N-` e sem script associado dentro da section.
- **Relacionados sem vínculo:**
  - quiz, questão 9 de 10: "Qual subgrupo tarifário concentra a maioria do mercado livre potencial industrial no Brasil?", resposta "A4". O feedback diz "Grupo A4 (2,3 a 25 kV)" e cita a GridAlpha;
  - checklist final (L2510): "Identificar Grupo A4 e por que ele é o terreno prioritário da GridAlpha no Brasil.".

## Divergências na fonte (sem escolha)

- **DIV-01 (QA-M01-A06).** Acima. **Pendente de decisão do Founder.**
- **DIV-02 (derivada).** Vazios de tensão sem subgrupo na tabela 6.2.
- **DIV-03 (editorial).** A fonte nomeia "GridAlpha" em L1868 ("Para fins de prospecção da GridAlpha no Brasil"), no checklist (L2510) e no feedback do quiz (L3139). O produto hoje é NIVAR (P24). Texto da fonte mantido literal.
- **DIV-04.** O § Drill diz "todas as nove aulas" (L2389), mas nenhuma das 8 tags é "Aula 06". Markup vence para posse (§5); prosa registrada.

## Divergências em relação ao código portado

Código: `src/lib/data/alexandria-modulo-01-content.ts`, chave `aula-01-06` (lead l.168, corpo l.266–281, aula l.475–494). Ids: `aula-01-06` ↔ `m01-a06`; a aula não tem instrumento nem exercício, então não há outros ids.

| Id | Sev. | Divergência |
|---|---|---|
| COD-01 | alta | A lista `<ul>` de 6.3 (3 `<li>`, L1872–1876) não foi portada: 0 blocos `kind: 'lista'` no corpo, contra 1 na fonte. O parágrafo de L1871 termina em "Logo:" e o seguinte começa em "Um cliente A1…". Os 3 itens não aparecem no corpo do código. |
| COD-02 | baixa | A lista carrega `style` inline no `<ul>` e nos `<li>`. O tipo `lista` do código guarda só `itens[]` em HTML; contexto para quem for portar. |
| COD-03 | média | Parágrafo de 6.2 não é verbatim: fonte "prospecção da **GridAlpha**", código "prospecção da **NIVAR**". Troca editorial já feita (R8 / P24 / Q03). |
| COD-04 | info | **QA-M01-A06 preservado no código**: as duas leituras (Grupo A "≥ 2,3 kV" e AS "< 2,3 kV (subterrâneo)") estão portadas sem resolver. A decisão continua pendente do Founder. |
| COD-05 | baixa | `aulaIds` do glossário com `aula-01-06`: Corrente alternada (AC), Demanda, Grupo A, Grupo B, kW, kWh, Tensão, Trifásico. Derivação do código; a fonte não declara aula por termo. |
| COD-06 | info | As 3 tabelas não têm `class` em nenhuma célula; nada a portar além do html. |
| COD-07 | info | Mapeamento de id: `aula-01-06` ↔ `m01-a06`. |

**O que está conforme:**
- O lead e os 6 parágrafos corridos restantes estão verbatim (o de 6.2 só difere na marca).
- Os títulos 6.1 a 6.4 estão corretos.
- As 3 tabelas conferem em todas as 42 células, inclusive "Alta e média tensão (≥ 2,3 kV)" e a linha AS.
- Não há `</span>` órfão em `aula-01-06` (0 aberturas, 0 fechamentos).
- `activities = []` e `instruments = []`, coerentes com a fonte.
- `durationMinutes`, `difficulty` e `video` = `null`, como na fonte.

## O que a fonte não tem (ausência declarada)

- Instrumento, exercício vinculado, figura, fórmula, callout, "Vale lembrar": não existem na aula (varredura medida).
- Duração, dificuldade, vídeo: `null`.
- Vínculo declarado entre termo do léxico e aula: não existe.
- **Termos do léxico, medido × inventário.** A correspondência textual acha 11 verbetes na section: Corrente alternada (AC), Demanda, Energia, Grupo A (5 ocorrências), Grupo B (3), kW, kWh, Perdas técnicas, Tensão (13), Trifásico (5) e TUSD. O inventário `aulas.md` lista 7 (Grupo A, Grupo B, Tensão, **Modalidade tarifária**, Trifásico, TUSD, **CUSD**); "Modalidade tarifária" e "CUSD" não ocorrem no texto da A06. Vários dos 11 são usos genéricos ("diretor de energia", "para demanda (kW)"); ler `ocorrencias_contexto` antes de ligar (§2 do protocolo).
- Os intervalos de tensão sem subgrupo (DIV-02): a fonte não os declara.

## Verificação

Saída real de `node docs/alexandria-v2/extraction/m01/extratores/verify-aula06.mjs` (exit 0):

```
VERIFICAÇÃO A06 — aula-06.json × alexandria_modulo01.html (3212 linhas)
1. LITERAIS     strings de conteúdo checadas: 255   não encontradas na fonte: 0
   CONTEXTOS do léxico: 39 trechos checados contra o texto da fonte   falhas: 0
2. ORIGENS      objetos com linha_aprox: 60   fora de ±3 linhas / sem trecho: 0
3. CONTAGENS    fonte: h3 4, p_corpo 7, tabela 3, formula 0, ul 1, li 3, callout 0, instrumento 0, celulas 42, linhas_tr 14
                json:  idem   divergências: 0
4. COBERTURA    por token: 486/486 = 100%   sem par: 0
5. SCRIPT       0 checagens (aula sem instrumento)
6. CÓDIGO       afirmações re-checadas contra o .ts agora: 14   falhas: 0
   itens da fonte que NÃO aparecem verbatim no corpo do .ts (4):
     - m01-a06-b08-paragrafo (L1868)   (COD-03)
     - m01-a06-b11-lista item "Menos perdas técnicas…" (L1873)   (COD-01)
     - m01-a06-b11-lista item "Menos uso de ativos…" (L1874)   (COD-01)
     - m01-a06-b11-lista item "Menor componente de TUSD…" (L1875)   (COD-01)
RESULTADO: OK — 0 falhas
```

O verificador não importa o gerador e segue o mesmo desenho do da A05: substring contra quatro visões do HTML, origens a ±3 linhas, contagens recomputadas do HTML e dos blocos, cobertura por token recomputada do JSON, e re-checagem contra o `.ts`. Foi testado de forma adversarial (frase do QA alterada, lista apagada), e os dois casos foram barrados.
