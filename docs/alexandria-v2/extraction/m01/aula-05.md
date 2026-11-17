# M01·A05: Demanda e fator de carga

Arquivo de dados: [`aula-05.json`](aula-05.json). Gerador: [`extratores/gen-aula05.mjs`](extratores/gen-aula05.mjs). Verificador: [`extratores/verify-aula05.mjs`](extratores/verify-aula05.mjs).

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html`, 3.212 linhas. A aula ocupa as linhas 1726 a 1826 (a `section.aula` vai de 1729 a 1826; conteúdo de 1731 a 1824). O script do INST·04 está nas linhas 2826 a 2853 (comentário de cabeçalho em 2823 a 2825).
- **Título (h2):** "Por que uma fábrica paga por capacidade reservada." (a fonte põe `<em>` em "capacidade reservada"). **Marcador:** "Aula 05 · Demanda e fator de carga".
- **Pergunta do § MAP (L1343):** "Por que uma fábrica paga por capacidade reservada, não só por energia?". É a única pergunta que a fonte declara para a aula.
- **Como foi extraído:** um script node leu fatias do HTML por linha e aplicou regex ancorado, com asserção de âncora em cada linha. Nenhuma prosa foi digitada. O campo `html` guarda o innerHTML literal; `texto` guarda o mesmo conteúdo sem tags. O script do instrumento foi **executado** num DOM simulado (`node:vm`), não reimplementado.
- **Cobertura por token (§5):** 582 de 582 tokens casados (**100%**), sem contar o markup do instrumento. O instrumento, medido à parte, fecha 60 de 60 (100%). Aqui as tags viram espaço antes de tokenizar, então o medidor não cola spans vizinhos como o da A08 fazia.

## Estrutura do JSON

| Chave | Conteúdo |
|---|---|
| `meta` | Fonte, linhas, método, convenções de id, ausência e vínculo |
| `aula` | Marcador, título do h2 (html e texto), pergunta do § MAP. Duração, dificuldade e vídeo em `null`, com nota |
| `blocos[]` | **17 blocos** na ordem da fonte: lead 1, título 4, parágrafo 5, tabela 2, fórmula 2, destaque 2, instrumento 1 (marcador de posição). Cada bloco tem `origem {seletor, trecho_inicial, linha_aprox}` |
| `figuras` / `listas` | Vazios, com nota. A aula não tem figura nem `<ul>` |
| `tabelas` | Ids dos 2 blocos de tabela. As células vivem em `blocos[].cabecalho` e `blocos[].linhas[].celulas[]`, com `html`, `texto` e `classe` |
| `formulas` / `destaques` | Ids dos 2 blocos de fórmula e dos 2 destaques (um `callout.red`, um `callout` neutro). `desc` das fórmulas é `null` (não existe `div.desc`) |
| `termos_lexico` | 8 candidatos por correspondência textual, sem vínculo declarado pela fonte |
| `instrumentos[0]` | Especificação do INST·04: 3 entradas, 3 saídas, 4 ramos de leitura, camada de script, execução de amostra e a coincidência com o Ex·04 |
| `invocacoes_no_texto` | Vazio: nenhum parágrafo invoca o instrumento por frase |
| `exercicios[]` | Ex·04 e Ex·07, ambos com tag "· Aula 05" (a única aula do M01 com dois). Enunciado e gabarito verbatim |
| `relacionados_nao_vinculados[]` | 2 questões do quiz e 4 itens do checklist final, sem tag de aula |
| `varredura_de_ausencia` | Regex e linhas de cada ausência medida (invocação, figura, vídeo, lista, "Vale lembrar", marca) |
| `divergencias[]` | 5 achados da fonte (DIV-01 a DIV-05), com as duas leituras e sem escolha |
| `comparacao_codigo` | Verificações programáticas contra o `.ts`, o que está conforme e 15 divergências (COD-01 a COD-15) |

### Blocos, em ordem

| # | Tipo | Conteúdo | Linha |
|---|---|---|---|
| 1 | lead | "A segunda fluência que separa analista credível de iniciante…" | 1734 |
| 2 | título | 5.1 Consumo é volume. Demanda é dimensão da rede. | 1736 |
| 3–5 | parágrafo ×3 | a estrada, a rede elétrica, "Demanda é a cobrança por essa capacidade reservada da rede." | 1737, 1739, 1741 |
| 6 | título | 5.2 Os três conceitos de demanda | 1743 |
| 7 | tabela | Conceito / O que significa / Como é cobrado, 3 linhas de dados | 1745 |
| 8 | destaque (red) | rótulo "Atenção · regras de ultrapassagem" + corpo | 1755 |
| 9 | título | 5.3 Demanda média e fator de carga | 1760 |
| 10 | parágrafo | "Demanda média é uma construção…" | 1761 |
| 11 | fórmula | "Demanda média = kWh consumido ÷ horas do período" | 1763 |
| 12 | parágrafo | "Fator de carga é a razão entre demanda média e demanda máxima…:" (termina em ":") | 1767 |
| 13 | fórmula | "Fator de carga = Demanda média ÷ Demanda máxima" | 1769 |
| 14 | instrumento | INST·04, entre a 2ª fórmula e o h3 5.4 | 1774 |
| 15 | título | 5.4 Como ler o fator de carga | 1808 |
| 16 | tabela | FC / Perfil típico / Implicação, 4 linhas de dados (a 1ª coluna tem `class="mono"`) | 1810 |
| 17 | destaque (neutro) | rótulo "Onde isso entra no produto" + corpo | 1821 |

## INST·04: resumo da especificação

- **Título:** "Calculadora · Demanda média e fator de carga". O id na fonte é "INST · 04". Kind na taxonomia: `calculadora`.
- **Pergunta:** `null`. A prancha não tem pergunta própria (a do § MAP está fora do instrumento). Uma pergunta de previsão seria derivada (P3/P11), não extraída.
- **Entradas** (todas `input[type=number]`, sem `max`, sem range gêmeo):

  | Id | Rótulo | Unidade | Padrão | Mín. | Passo | Máx. |
  |---|---|---|---|---|---|---|
  | `i04-kwh` | Consumo mensal | kWh | 144000 | 0 | 1000 | sem máx. |
  | `i04-h` | Horas do período | h | 720 | 0 | 24 | sem máx. |
  | `i04-pmax` | Demanda máxima | kW | 800 | 0 | 50 | sem máx. |

- **Saídas.** São duas linhas na marcação, com três valores:
  - `i04-pmed`, "Demanda média", kW, inicial "200". Fórmula: `E / T`; formato pt-BR, no máximo 1 casa.
  - `i04-fc`, "Fator de carga", inicial "0,25". Fórmula: `Pmax > 0 ? Pmed / Pmax : 0`; formato pt-BR com exatamente 2 casas. Não tem unidade própria.
  - `i04-fcp`, sem rótulo, inicial "25%". É um `span#i04-fcp` dentro do `span.unit` da linha "Fator de carga". Formato: `(FC*100).toFixed(0) + '%'`.
- **Coerção de entrada (resíduo do original, sinalizado e não corrigido):** `parseFloat(kwh.value) || 0` e `parseFloat(h.value) || 1` e `parseFloat(pmax.value) || 1`. Horas vazias ou zero valem 1, e demanda máxima vazia ou zero vale 1. Por causa do `|| 1`, `Pmax` nunca é 0 dentro de `calc()`.
- **Texto de leitura:** dinâmico (`b#i04-interp`), **4 ramos**, com limiares em 0,70, 0,40, 0,15 e "senão". Os textos estão verbatim no JSON. Diferente do INST·06, aqui o texto da marcação é idêntico ao do ramo ativo no cenário-padrão (verificado por execução).
- **Cenário-padrão** (executando o script original): 144.000 kWh, 720 h, 800 kW dá **200 kW, 0,25, 25%**. Ramo ativo: `else if (FC >= 0.15)`.
- **Fonte dos números:** `null`. Nenhuma procedência para o cenário nem para os limiares. **Tolerâncias:** `null` (P6).
- **Posição:** entre a 2ª fórmula de 5.3 (L1769–1771) e o h3 5.4 (L1808). Ver "Onde o instrumento é invocado".

### Amostra executada do script original

Não é cobertura exaustiva do espaço de entrada; é amostra, e o verificador reexecuta cada linha.

| Cenário | Entradas (kWh / h / kW) | Saídas (`i04-pmed` / `i04-fc` / `i04-fcp`) | Ramo |
|---|---|---|---|
| padrão | 144000 / 720 / 800 | 200 / 0,25 / 25% | `>= 0.15` |
| FC = 0,70 exato | 504000 / 720 / 1000 | 700 / 0,70 / 70% | `>= 0.70` |
| FC = 0,40 exato | 288000 / 720 / 1000 | 400 / 0,40 / 40% | `>= 0.40` |
| FC = 0,15 exato | 108000 / 720 / 1000 | 150 / 0,15 / 15% | `>= 0.15` |
| FC = 0,10 | 72000 / 720 / 1000 | 100 / 0,10 / 10% | senão |
| FC = 1,00 | 720000 / 720 / 1000 | 1.000 / 1,00 / 100% | `>= 0.70` |
| horas vazias | 144000 / "" / 800 | 144.000 / 180,00 / 18000% | `>= 0.70` |
| demanda máxima vazia | 144000 / 720 / "" | 200 / 200,00 / 20000% | `>= 0.70` |
| demanda máxima 0 | 144000 / 720 / 0 | 200 / 200,00 / 20000% | `>= 0.70` |
| casas decimais | 1000 / 720 / 800 | 1,4 / 0,00 / 0% | senão |
| FC = 0,50 | 360000 / 720 / 1000 | 500 / 0,50 / 50% | `>= 0.40` |

As três linhas com campo vazio ou zero mostram o efeito do `|| 1`: o número que aparece parece cálculo, mas é artefato da coerção. A fonte não avisa. Resíduo registrado, não corrigido.

## O instrumento entrega a resposta do Ex·04 (achado de C7)

O cenário-padrão do INST·04 é **idêntico** ao enunciado do Ex·04, e as saídas iniciais são o resultado do gabarito. Abrir o instrumento no estado inicial exibe a resposta antes de o learner responder. Valores lado a lado, verbatim:

| | INST·04, valor-padrão (L1783, L1787, L1791) | Ex·04, enunciado (L2420) | Mesmo valor |
|---|---|---|---|
| Consumo | Consumo mensal **144000** kWh | "**144.000 kWh**" | sim |
| Horas | Horas do período **720** h | "um mês de **720 horas**" | sim |
| Demanda máxima | Demanda máxima **800** kW | "Demanda máxima medida foi **800 kW**" | sim |

| | INST·04, saída inicial (L1796, L1800) | Ex·04, gabarito (L2423) | Mesmo valor |
|---|---|---|---|
| Demanda média | **200** kW | "144.000 ÷ 720 = **200 kW**" | sim |
| Fator de carga | **0,25** / **25%** | "200 ÷ 800 = **0,25 = 25%**" | sim |
| Leitura | ramo `>= 0.15`: "Fator de carga baixo: muitos picos altos em relação ao uso médio…" | "**Interpretação:** fator de carga baixo indica picos elevados em relação ao consumo médio." | mesmo sentido, texto diferente |

**Medido:** as três entradas e as duas saídas coincidem. **Derivado, não declarado pela fonte:** a consequência (abrir o instrumento revela a resposta). A fonte não ordena um antes do outro: o instrumento está dentro da aula (L1774) e o Ex·04 está no § Drill (L2419). Nada foi alterado. O vínculo instrumento↔exercício também não é declarado pela fonte; é coincidência numérica (`instrumentos[0].coincidencia_com_exercicio`).

## Onde o instrumento é invocado (C5)

1. **Nenhum parágrafo da aula o invoca por frase.** A varredura por `calculadora|instrumento|i04|INST · 04|abaixo` fora do `div.instrument` não acha nada. Isso difere da A08, onde o parágrafo termina em "Use a calculadora abaixo:".
2. **Posição literal:** o `div.instrument` (L1774 a L1806) vem logo depois da 2ª `div.formula` ("Fator de carga = Demanda média ÷ Demanda máxima", L1769–1771) e antes do h3 **5.4** (L1808). O bloco `m01-a05-b14-instrumento` marca essa posição.
3. **Remissão para o resto da aula:** o instrumento não remete a figura nenhuma (a aula não tem figura). O texto de leitura do ramo 0,15–0,40 não aponta para a tabela 5.4.

## Exercícios vinculados (tag "· Aula 05")

| Id | Tag na fonte | Linhas | Enunciado (verbatim) |
|---|---|---|---|
| `m01-ex-04` | "Ex · 04 · Aula 05" | 2418–2425 | "Uma empresa consome **144.000 kWh** em um mês de 720 horas. Demanda máxima medida foi **800 kW**. Calcule demanda média e fator de carga. Como interpretar?" |
| `m01-ex-07` | "Ex · 07 · 3 níveis · Aula 05" | 2445–2454 | "Explique **"demanda contratada"** em três versões: para uma criança de 12 anos, para um CFO industrial, e para um especialista de setor." |

- O gabarito do Ex·04 é 1 parágrafo (L2423). O do Ex·07 são **3 `<p>`** (L2450 "12 anos", L2451 "CFO", L2452 "Especialista"), com `style="margin-top: 12px;"` no 2º e no 3º. Cada um está em `resposta_referencia_paragrafos[]`.
- Nenhum dos dois tem critério por exercício. O único critério é o do § Drill (L2389): "O critério de domínio é resolver pelo menos seis dos oito sem consulta."
- Mecânica na fonte: `button.exercise-toggle` "Revelar gabarito", sem tentativa registrada (bar C7).
- Varredura de `Aula 0?5`: só as duas tags (L2419 e L2446) fora da section.

## Relacionados sem vínculo (fora da posse da A05)

- **Quiz, questão 4 de 10:** "Por que uma fábrica paga demanda além de consumo?" (L3096).
- **Quiz, questão 5 de 10:** "Uma instalação tem demanda média de 200 kW e demanda máxima de 500 kW. Qual o fator de carga?", resposta 0,40 (L3107). Ver DIV-02.
- **Checklist final:** 4 itens (L2499, L2500, L2501, L2512).

## Divergências na fonte (sem escolha)

- **DIV-01 (achado).** INST·04 × Ex·04: coincidência de cenário (seção acima). Não é contradição.
- **DIV-02.** **Fronteiras da tabela 5.4 × limiares do script.** A tabela escreve intervalos fechados nos dois lados: 0,70 aparece em "0,40 – 0,70" e em "0,70 – 0,90"; 0,40 aparece em "0,15 – 0,40" e em "0,40 – 0,70"; 0,15 aparece em "< 0,15" e em "0,15 – 0,40". Acima de 0,90 a tabela não diz nada. O script resolve com `>=` (0,70 vai ao 1º ramo, 0,40 ao 2º, 0,15 ao 3º, e qualquer FC ≥ 0,70 ao 1º, inclusive acima de 0,90). O feedback do quiz com FC = 0,40 lê a faixa de sazonalidade moderada, mas 0,40 também é o limite superior de "Picos altos, operação concentrada, partidas simultâneas". Não escolhida.
- **DIV-03.** **A sigla FC.** Cabeçalho da tabela 5.4 ("FC"), texto de leitura do instrumento ("FC muito baixo") e o léxico "Fator de carga (FC)" (L2580) usam a sigla sem expandir; o léxico também define "Fator de capacidade (FC)" (L2576) para a Aula 08. Ligar termo↔aula por sigla é ambíguo; P21 decide FCarga/FCap na camada de produto.
- **DIV-04.** **Numeração da trava.** O callout final diz "Trava 4 do War Room" (L1823), como as ocorrências L1314 e L3150. Só o § Caso (L2192) diz "Trava 3". A fonte não define as travas (P23).
- **DIV-05 (editorial).** A fonte nomeia "GridAlpha" em L1757 ("Esta é uma trava operacional da GridAlpha."); o produto hoje é NIVAR (P24). O texto da fonte foi mantido literal.

## Divergências em relação ao código portado

Código: `src/lib/data/alexandria-modulo-01-content.ts`, chaves `aula-01-05` (corpo l.249–264, aula l.441–473, lead l.167) e `inst-04` (l.85–100); `alexandria-instrument-calculators.ts` (`inst-04`, l.1727). Ids: `inst-04`/`ex-04`/`ex-07`/`aula-01-05` ↔ `m01-inst-04`/`m01-ex-04`/`m01-ex-07`/`m01-a05`.

| Id | Sev. | Divergência |
|---|---|---|
| COD-01 | alta | As duas fórmulas de 5.3 (`div.formula`, L1763–1765 e L1769–1771) não foram portadas: 0 blocos `kind: 'formula'` no corpo, contra 2 na fonte. O 2º parágrafo de 5.3 termina em ":" sem continuação. |
| COD-02 | alta | O instrumento é renderizado depois de toda a apostila (`aula.instruments`, `AulaViewer.tsx` l.123–127). Na fonte ele fica entre a 2ª fórmula de 5.3 e o h3 5.4. Viola C5 e a Regra-mãe 1. |
| COD-03 | média | O `callout.red` virou `nota {tom:'red', label:null, html:'Atenção · regras de ultrapassagem'}` seguida de um parágrafo solto. Na fonte o texto é o RÓTULO e o parágrafo é o CORPO do mesmo callout. |
| COD-04 | média | Mesmo defeito em "Onde isso entra no produto" (L1821–1824): rótulo como `html` de nota, corpo como parágrafo solto. |
| COD-05 | média | Parágrafo do callout vermelho não é verbatim: fonte "…trava operacional da **GridAlpha**.", código "…da **NIVAR**." Troca editorial já feita (R8 / P24 / Q03). |
| COD-06 | média | `inst-04.formula = "FC = P média ÷ P máxima"` é paráfrase e não existe no HTML (verificado). O literal da fonte é a 2ª `div.formula` de 5.3, fora do instrumento. |
| COD-07 | média | O texto inicial de `b#i04-interp` virou `note` estática. O painel mostra `veredito` vivo e `note` fixa ao mesmo tempo. No padrão os dois dizem o mesmo; com FC ≥ 0,70 a nota continua dizendo a faixa 0,15–0,40. |
| COD-08 | baixa | Três saídas no código (`i04-pmed` kW; `i04-fc` unit null; `i04-fcp` "Fator de carga (%)" unit %). Na fonte são duas linhas, e o "25%" não tem rótulo próprio. O rótulo "Fator de carga (%)" não existe na fonte. |
| COD-09 | baixa | Formatação (deduzida da leitura de `fmt`, **não medida na tela**): a fonte usa pmed com no máx. 1 casa, FC com exatamente 2 ("0,50") e `toFixed(0)+'%'`; o painel usa `fmt(v,2)` (máx. 2 casas, sem mínimo): 1000/720 vira "1,39" (fonte "1,4"), FC 0,5 vira "0,5" (fonte "0,50"). |
| COD-10 | baixa | `n()` (Number) em `i04-kwh` onde a fonte usa `parseFloat \|\| 0`. T e Pmax usam `nOu(…, 1)`, fiel ao `\|\| 1`. |
| COD-11 | média | O gabarito do Ex·07 são 3 `<p>` na fonte; no código virou UMA string com as três vozes separadas por espaço e sem `<p>`. O texto das 3 vozes está presente e verbatim. |
| COD-12 | baixa | `points: 1` nos dois exercícios não tem origem na fonte. |
| COD-13 | baixa | `aulaIds` do glossário com `aula-01-05`: Demanda, Demanda contratada, Energia, Fator de carga (FC), kW, Modalidade tarifária, REN ANEEL 1.000/2021, Tensão. Derivação do código; a fonte não declara aula por termo. |
| COD-14 | info | As 4 células da 1ª coluna da tabela 5.4 têm `class="mono"`; o tipo `tabela` do código só guarda html. |
| COD-15 | info | Mapeamento de ids 1:1 (acima). |

**O que está conforme:**
- O lead e os 5 parágrafos corridos (5.1 ×3, 5.3 ×2) estão verbatim.
- Os títulos 5.1 a 5.4 estão corretos.
- As tabelas 5.2 e 5.4: todas as 27 células conferem (a 1ª linha como cabeçalho, igual à fonte).
- O corpo do callout "Onde isso entra no produto" está verbatim, inclusive "Trava 4 do War Room".
- Não há nenhum `</span>` órfão em `aula-01-05` (0 aberturas, 0 fechamentos).
- INST·04: título, ids, rótulos, unidades, padrões, mínimos, passos e ausência de `max`; a lógica e os 4 textos de faixa verbatim, na mesma ordem; `|| 1` preservado.
- Ex·04: tag, enunciado e gabarito verbatim. Ex·07: tag e enunciado verbatim, e cada voz do gabarito presente.
- `durationMinutes`, `difficulty` e `video` = `null`, como na fonte.

## O que a fonte não tem (ausência declarada)

- Pergunta própria do instrumento, previsão, gabarito e tolerância do INST·04: `null`.
- Fonte (procedência) dos números do instrumento e dos limiares: `null`.
- Critério por exercício: `null`. Duração, dificuldade, vídeo: `null`.
- Figura, `<ul>`, "Vale lembrar": não existem na aula (varredura medida).
- Vínculo declarado entre termo do léxico e aula: não existe.
- **Termos do léxico, medido × inventário.** A correspondência textual acha 8 verbetes na section: Demanda (30 ocorrências), Demanda contratada (3), Energia (1), Fator de carga (FC) (8), kW (5), kWh (2), Modalidade tarifária (1) e Tensão (1). O inventário `aulas.md` lista outros 6 (Demanda, Demanda contratada, Fator de carga, **Potência**, Modalidade tarifária, **Grupo A**); "Potência" e "Grupo A" não ocorrem na section da A05 (só no gabarito do Ex·07, no caso de "Grupo A"). "Energia" ("puxam energia") e "Tensão" ("tensão de fornecimento") são usos genéricos; ler `ocorrencias_contexto` antes de ligar (§2 do protocolo).

## Verificação

Saída real de `node docs/alexandria-v2/extraction/m01/extratores/verify-aula05.mjs` (exit 0):

```
VERIFICAÇÃO A05 — aula-05.json × alexandria_modulo01.html (3212 linhas)
1. LITERAIS     strings de conteúdo checadas: 275   não encontradas na fonte: 0
   CONTEXTOS do léxico: 33 trechos checados contra o texto da fonte   falhas: 0
2. ORIGENS      objetos com linha_aprox: 76   fora de ±3 linhas / sem trecho: 0
3. CONTAGENS    fonte: h3 4, p_corpo 5, tabela 2, formula 2, ul 0, li 0, callout 2, instrumento 1, celulas 27, linhas_tr 9
                json:  idem   divergências: 0
4. COBERTURA    por token, instrumento fora do denominador: 582/582 = 100%   sem par: 0
                instrumento (à parte): 60/60 = 100%   sem par: 0
5. SCRIPT       checagens por reexecução/leitura: 18   falhas: 0
6. CÓDIGO       afirmações re-checadas contra o .ts agora: 18   falhas: 0
   itens da fonte que NÃO aparecem verbatim no corpo do .ts (1):
     - m01-a05-b08-destaque corpo do callout "Atenção · regras de ultrapassagem"   (COD-05)
RESULTADO: OK — 0 falhas
```

O verificador não importa o gerador. Ele (1) checa por substring, contra quatro visões do HTML (cru, decodificado, texto, texto com tags como espaço), toda string de conteúdo do JSON; (2) confere cada `linha_aprox` com `trecho_inicial` a ±3 linhas; (3) recomputa as contagens por tipo direto do HTML e dos blocos, não do campo `contagens`; (4) recomputa a cobertura por token do JSON contra a fonte; (5) reexecuta o script do INST·04 no padrão, nas 11 linhas da amostra e nos 4 ramos; (6) rechecha contra o `.ts` de agora as afirmações de COD. Foi testado de forma adversarial: adulterar uma palavra, mudar uma linha de origem, apagar um bloco e acrescentar uma palavra, e cada caso foi barrado.
