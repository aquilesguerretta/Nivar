# M06 · grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo06.html` (2.361 linhas, 279.562 bytes).
Saída: [`modulo.json`](modulo.json). Extrator: [`extratores/m06_modulo.mjs`](extratores/m06_modulo.mjs).

**Método.** Um parser de pilha lê os elementos de primeiro nível de cada `section#… .wrap`, e a linha de origem sai do
índice de caractere. A comparação com o código usa um bundle esbuild (só leitura, escrito no scratchpad) de
`src/lib/data`. Nenhum texto de conteúdo foi digitado.

**Verificação.** `extratores/verify-m06.mjs` conferiu 504 strings de conteúdo como substrings da fonte e 237 origens na
linha declarada, com 0 falhas. A cobertura por token ficou em 100% no §00, no §MAP, no §Erros e no §Voz. O denominador
exclui o markup de instrumento, de três níveis e dos cartões (protocolo §5).

## Estrutura do JSON

| Chave | Conteúdo |
|---|---|
| `identidade` | Kicker, h1, subtítulo, 8 pills, horas (string), `eixos: null`, rodapé (3 linhas), título no catálogo e no código |
| `tese` | §00 completo em blocos: lede, 3 subseções, a fórmula "régua dos seis", a tabela resposta × risco (7 linhas) e 2 caixas |
| `resultado_esperado` | `itens: null` com nota: a fonte não tem essa seção |
| `mapa` | §MAP: lede, referência ao Inst · 01 e 6 cartões. `perguntas_por_aula: null` |
| `roteiro` | As 16 sections em ordem (6 aulas + 10 aparatos). Cada aula traz lede, subseções, instrumentos, três níveis, caixas e tabelas |
| `criterio` | 8 critérios literais com origem e `marcacao_p14` |
| `laboratorios` | `null`: não há § Lab |
| `voz` | §Voz inteiro (36 perguntas-relâmpago, 6 ataques, roteiro de 10 minutos, 2 caixas), 4 princípios e 3 caixas "números vivos" |
| `erros_comuns` | §Erros: 16 pares "o que se diz × correção", mais a caixa final e 1 caixa de erro dentro de aula (A02) |
| `tradutor` | `secao: null`. Aponta os 6 blocos "três níveis" |
| `onde_entra_no_produto` | 6 ponteiros (P7) |
| `comparacao_codigo` | Aulas da fonte × `MODULO_06_AULAS`/`_LEAD`/`_CORPO`, e cartões do §MAP × h2 |
| `contagens`, `cobertura_por_token`, `divergencias`, `lacunas` | Contagens, cobertura, 13 divergências e 8 lacunas |

## Identidade (P24)

| Campo | Fonte | Catálogo canônico | Código |
|---|---|---|---|
| Título | "História do Setor Elétrico Brasileiro" (h1 L304, rodapé L1513) | igual (L539) | igual (`bloco-06`, `modulo-06`) |
| Subtítulo | "Por que o Brasil escolheu *este* desenho institucional e não outro — um século e meio de decisões, traumas e correções de rota, cada um deixando uma cicatriz que ainda opera hoje." (L305) | não usado | não usado |
| Kicker | "Alexandria · GridAlpha · Módulo 06" | trilha "atribuída" | trilha `trilha-setor-eletrico-brasileiro`, track `brasil` |
| Horas | "3–4h de estudo" (pill, L314) | "3–4 h declaradas" | 3 / 4 |

O subtítulo é candidato a descritor editorial (P24), e não a segundo título. A marca GridAlpha aparece 13 vezes (m06-div-07).

## Roteiro e contagem de aulas (P8)

Os três sinais concordam em **6 aulas**: o h2 do §MAP ("Seis aulas…"), o pill ("6 aulas") e os 6 `sec-id "Aula NN"`. O
código também concorda (`MODULO_06_AULAS` = 6, `totalInModule` = 6, `totalAulas` = 6).

| # | Marcador | h2 | Subseções | Instrumentos | Linha |
|---|---|---|---|---|---|
| 1 | §00 · Tese | Toda estrutura de hoje tem uma data e uma causa | 0.1–0.3 | — | 322 |
| 2 | §MAP · Percurso e linha do tempo | Seis aulas, cento e cinquenta anos | — | Inst · 01 | 379 |
| 3 | Aula 01 · 1879–1934 | Antes do Estado | 1.1–1.4 | Inst · 02 | 417 |
| 4 | Aula 02 · 1934–1988 | O Estado dono de tudo | 2.1–2.4 | Inst · 03 | 509 |
| 5 | Aula 03 · 1988–2002 | A reforma inacabada e o trauma fundador | 3.1–3.7 | Inst · 04 | 614 |
| 6 | Aula 04 · 2003–2011 | A reconstrução deliberada | 4.1–4.4 | Inst · 05 | 744 |
| 7 | Aula 05 · 2012–2021 | O modelo é testado de novo | 5.1–5.5 | Inst · 06 | 842 |
| 8 | Aula 06 · 2022–2028 · síntese | Onde a história pousa hoje | 6.1–6.4 | Inst · 07, 08 | 958 |
| 9 | §Caso · Operação A — mineração em Minas Gerais · Parte 6 | A planta pela lente da história | C.1–C.4 | — | 1083 |
| 10 | §Erros · Correção imediata | Dezesseis erros que custam credibilidade | — | — | 1117 |
| 11 | §Ex · Exercícios com gabarito | Dez exercícios com gabarito | — | — | 1153 |
| 12 | §Quiz · Verificação interativa de domínio | Dez perguntas. Resposta imediata. | — | — | 1212 |
| 13 | §Voz · Domínio oral | Dez minutos, sem consultar nada. | V.1–V.3 | — | 1227 |
| 14 | §Final · Critério de conclusão | Você domina o Bloco 6 quando | — | — | 1321 |
| 15 | §Lex · Glossário Alexandria | Noventa e nove termos | — | — | 1356 |
| 16 | §Ref · Fontes | Onde verificar cada afirmação | — | — | 1482 |

**Comparação com o código.**
- Iguais nas 6 aulas: título igual ao h2, subtítulo igual ao rótulo do `sec-id`, e as 28 subseções com mesmo número e
  mesmo título. As aulas mapeiam para os instrumentos `m06-inst-02`…`08`.
- Lead: igual em 4 das 6 aulas. Nas Aulas 04 e 05 o código tem um espaço antes da pontuação onde havia `<em>`/`<strong>`
  ("reforma da reforma : manteve"; m06-div-13).
- No código, todas as aulas têm `activities: []`, `video: null` e ilustrações `his-*`. Essas ilustrações não vêm deste
  HTML, que tem zero `<img>`.

## Critérios literais (P14 e P18)

| Id | Onde | Resumo | P14 |
|---|---|---|---|
| crit-01 | caixa do §00 (L371) | "conta a história… em dez minutos, sem consultar nada" e defende "a independência analítica da GridAlpha" | oral, cronometrado |
| crit-02 | pill (L310) | "10 questões · critério 8/10" | automatizável |
| crit-03 | lede do §Quiz (L1214) | "acertar pelo menos 8 de 10 sem consultar"; o script dá 2 mensagens (sc≥8 / resto) | automatizável |
| crit-04 | lede do §Voz (L1229) | "único bloco… cujo critério de domínio é ele próprio um exercício oral" | oral, 10 minutos |
| crit-05 | V.2 (L1273) | "cronometrando: cada uma cabe em noventa segundos" | oral, 90 segundos |
| crit-06 | V.3 (L1289) | "Grave em áudio, sem consultar" | oral, gravado |
| crit-07 | caixa "Como treinar" (L1313) | teste final em três minutos | oral, cronometrado |
| crit-08 | h2 e lede do §Final (L1322–1323) | "Vinte e quatro verificações" (os itens estão em aparato.json) | oral ou livre |

Nenhum critério prevalece (P18). A mensagem de aprovação do quiz diz "O critério oficial deste bloco é oral, não
escrito" (m06-div-02).

## Voz, erros comuns e produto

- **§Voz.** 36 perguntas-relâmpago, 6 ataques de decisor cético com persona (os ataques 5 e 6 são sobre a GridAlpha),
  a caixa "Como responder ao ataque 5", 10 parágrafos "Minuto N" e a caixa "Como treinar".
- **Princípios.**
  - "Regra de leitura deste módulo" (§00).
  - Hierarquia das fontes (lede do §Ref).
  - "Escreva ou fale a resposta inteira antes de abrir o gabarito" (lede do §Ex).
  - Aviso do rodapé.
  - Caixas "números vivos": A03 L649, A06 L969 e L986.
- **Erros comuns.** 16 linhas (a prosa diz "Dezesseis", e o markup confirma), mais "O erro que engloba todos os
  outros". Dentro das aulas há só "Ponto que quase todo mundo erra" (A02 L538).
- **Fronteiras.** Três caixas de fronteira: "Fronteira com o Módulo 02" (A03), "Fronteira com o Módulo 04" (A04) e
  "Fronteira com o Bloco 9" (A05).
- **"Onde isso entra no produto".** 6 caixas (A01–A06). Citam Regulatory Radar, Brazil Pulse, Alexandria e GridAlpha
  (P7/P24).

## Divergências (detalhe em `divergencias[]`)

| Id | Tipo | Tema |
|---|---|---|
| div-01 | fonte×fonte | O cartão da Aula 03 no §MAP diz "A reforma inacabada e o trauma"; o h2 diz "…e o trauma fundador" |
| div-02 | fonte×fonte | Três formas de critério: oral de 10 minutos, quiz 8/10 e 24 verificações |
| div-03 | fonte×decisão | "Parte 6" literal no caso × P17 ("não existe Parte 1") |
| div-04 | fonte×fonte | O caso fala em "cinco partes anteriores" e enumera quatro lentes |
| div-05 | fonte×fonte | "Bloco 6/7/9" e "Módulo 0N" usados para a mesma unidade; correspondência de Bloco 7/9 não declarada |
| div-06 | fonte×catálogo | Trilha só atribuída (a fonte não declara) |
| div-07 | fonte×P24 | GridAlpha 13×, inclusive no critério de domínio e no item 24 do §Final |
| div-08 | fonte×fonte | Períodos do §MAP × `sec-id` (sem conflito material; A06 acrescenta "· síntese") |
| div-09 | fonte×código | Horas: "3–4h" × 3/4 (compatíveis) |
| div-10 | código×catálogo | O catálogo marca o M06 como "completo"; o aparato não está no código e os Inst 05/07 são parciais |
| div-11 | código×fonte | Exercícios com `prompt: ""`, Pergunta e Gabarito concatenados e `points: 1` |
| div-12 | código×taxonomia | `instrument-taxonomy.md` diz que o Inst · 01 "nunca foi materializado" e que o Inst 07 tem "4 saídas"; o código tem `m06-inst-01` e zero saídas no 07 |
| div-13 | código×fonte | Espaço extra no lead das Aulas 04 e 05 |

## Lacunas (null declarado)

- Resultado esperado e capacidades.
- Eixos. O organizador declarado é a régua dos seis, registrada como fórmula.
- Perguntas por aula no §MAP.
- § Lab.
- Tradutor. O análogo são os 6 blocos "três níveis".
- Horas numéricas.
- Duração, dificuldade, vídeo e imagens por aula.
- Vínculo verificação → aula. O lede do §Final promete esse vínculo e nenhum item o declara.

## Verificação (verificador adversarial, 2026-09-17)

- **Origens e textos:** conferidos na janela da origem (±3), sem falha, incluindo identidade, pills, §MAP, roteiro
  (16), subseções (28), critérios (8), §Voz (36 + 6 + 10 minutos + 2 caixas) e §Erros (16 + caixa).
- **Contagens:** conferem com a fonte.
- **Correção:** nenhuma neste arquivo nem no `modulo.json`. A tabela de critérios está correta: são 4 com marcação
  cronometrada (01, 04, 05 e 07) e 5 com "oral" (01 e 04–07). O rótulo agregado "4 orais ou cronometrados" do
  README foi corrigido lá.
- **Escopo:** a prosa das aulas, os painéis "três níveis" e o corpo das caixas "Onde isso entra no produto" e "Ponto
  que quase todo mundo erra" ficam só como ponteiro, como no M01. Não há `aula-NN.json` para o M06.

## Verificação (2ª passada, verificador adversarial, 2026-09-17)

- **Textos:** 536 textos com origem (nos três JSONs) foram conferidos na janela da própria origem, e 348 campos `html`
  como fragmento literal. Não houve falha.
- **Contagens:** conferem as 16 seções, as subseções 4/4/7/4/5/4, os 36 + 6 + 10 da §Voz, os 16 erros, os 6 blocos
  "três níveis", os 8 pills, os 6 cartões e as 13 ocorrências de "GridAlpha".
- **Cobertura:** todo `p`, `li`, `td`, `summary` e `span` de hero, §00, §MAP, §Caso até §Ref, e dos ledes das aulas,
  está em algum JSON.

**Correção 1 (`m06-div-05`).** A lista de linhas com "Bloco N" estava incompleta. Faltavam L867 ("Bloco 9", 5.3), L1454
(§Lex, "escopo do Bloco 9") e L1505 (§Ref, "Bloco 7 em diante"), que antes só aparecia na nota. A lista passou a ser
`L336, L348, L371, L668, L834, L866, L867, L1322, L1454, L1505`, no JSON e em `extratores/m06_modulo.mjs`.
