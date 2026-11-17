# M05 · Grupo "módulo": como ler a extração

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo05.html`, com 1.896 linhas (sha256 `12812a180e95…`).
**Arquivo gerado:** [`modulo.json`](modulo.json), produzido por [`extratores/m05_modulo.mjs`](extratores/m05_modulo.mjs).
**Data:** 2026-09-17. Tudo aqui é camada fonte: o texto é literal, cada item tem origem, e as contradições ficam registradas sem resolução.

## Identidade (P24)

| Campo | Literal | Origem |
|---|---|---|
| `<title>` | Alexandria · Módulo 05 — Regulação e Desenho de Mercados | L6 |
| kicker | Alexandria · GridAlpha · Módulo 05 | L255 |
| título (h1) | Regulação e Desenho de Mercados | L256 |
| subtítulo | Por que existe uma agência fixando teto de preço em vez de o mercado achar seu nível, por que um operador despacha tudo por otimização central, e por que gerar e distribuir são empresas diferentes. | L257 |
| horas | 3–5h de estudo (min/max = null na fonte) | L265 |
| rodapé 1 | Alexandria · Módulo 05 — Regulação e Desenho de Mercados | L1375 |
| rodapé 2 | GridAlpha · material de estudo interno · conteúdo didático, não é recomendação regulatória, jurídica ou de investimento | L1376 |
| rodapé 3 | Parâmetros tarifários e regulatórios mudam por ato do regulador — verifique na fonte primária antes de qualquer uso externo | L1377 |

- **Pílulas do hero (7):** "6 aulas" · "6 instrumentos" · "10 exercícios" · "10 questões · critério 8/10" · "34 perguntas-relâmpago" · "72 termos" · "3–5h de estudo".
- **Catálogo canônico** (`catalogo-modulos-alexandria.md`, L441): título "Regulação e Desenho de Mercados"; escala "6 aulas · 6 instrumentos · 72 termos · 10 exercícios · 34 perguntas-relâmpago · 21 itens de checklist · 3–5 h declaradas.".
- **Código** (`alexandria-blocks.ts` bloco-05): título "Regulação e Desenho de Mercados", nível 1, trilha `universal`, horas 3–5, `illustrationPrefix` null. Em `alexandria-trilhas.ts`, `totalAulas` = 6.
- **Resultado:** o título da fonte é igual ao do catálogo (true) e ao do código (true). Não há divergência de título. O kicker e o rodapé 2 citam "GridAlpha", o que P24 manda não exibir ao learner.
- **Trilha e eixos:** a fonte não declara trilha (o catálogo a marca como "atribuída") nem eixos do módulo (`eixos` = null). Os "dois eixos" da Aula 06 e do INST·06 descrevem o desenho de mercado, não o módulo.

## Roteiro (P8)

16 seções `sec-id`: 6 aulas e 10 de aparato. Não há § Lab.

| # | Marcador | Rótulo | Título (h2) | Linhas | Subseções | Instrumento | Código: título/subtítulo/lead iguais |
|---|---|---|---|---|---|---|---|
| 1 | §00 | Tese | A pergunta que estava embaixo das outras quatro | 271–328 | — | — | — |
| 2 | §MAP | Percurso | Seis aulas, da falha ao mapa | 331–345 | — | — | — |
| 3 | Aula 01 | Fundamento econômico | Por que regulado | 348–445 | 1.1, 1.2, 1.3 | Inst · 01 | true/true/true |
| 4 | Aula 02 | Arquitetura setorial | Unbundling | 448–547 | 2.1, 2.2, 2.3, 2.4, 2.5 | Inst · 02 | true/true/true |
| 5 | Aula 03 | Desenho do atacado | Pool e bilateral | 550–639 | 3.1, 3.2, 3.3, 3.4 | Inst · 03 | true/true/true |
| 6 | Aula 04 | Economia política da regulação | Captura regulatória | 642–754 | 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 | Inst · 04 | true/true/true |
| 7 | Aula 05 | Regulação econômica | Revisão tarifária | 757–888 | 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7 | Inst · 05 | true/true/true |
| 8 | Aula 06 | Síntese | Desenho de mercado comparado | 891–999 | 6.1, 6.2, 6.3, 6.4, 6.5 | Inst · 06 | true/true/true |
| 9 | §Caso | Operação A — Parte 5 | A planta pela lente da regulação | 1002–1037 | — | — | — |
| 10 | §Erros | Armadilhas | Doze erros que custam credibilidade | 1040–1060 | — | — | — |
| 11 | §Ex | Exercícios | Dez exercícios com gabarito | 1063–1126 | — | — | — |
| 12 | §Quiz | Verificação interativa de domínio | Dez perguntas. Resposta imediata. | 1129–1141 | — | — | — |
| 13 | §Voz | Domínio oral | Se você não consegue falar, ainda não sabe. | 1144–1216 | — | — | — |
| 14 | §Final | Critério de conclusão | Você domina o Bloco 5 quando | 1219–1248 | — | — | — |
| 15 | §Lex | Glossário Alexandria | Setenta e dois termos | 1251–1344 | — | — | — |
| 16 | §Ref | Fontes | Onde verificar cada afirmação | 1347–1371 | — | — | — |

**Contagem de aulas.** Três sinais independentes concordam em 6: os sec-id "Aula NN" (6), os cartões do § MAP (6, h2 "Seis aulas, da falha ao mapa") e a pílula "6 aulas". No código, `MODULO_05_AULAS` tem 6 aulas, `totalAulas` = 6 e há 6 instrumentos. Resultado: concordam = true.

## Resultado esperado

`itens` = null. A fonte do M05 NÃO tem seção/h4 "Resultado esperado" (zero ocorrências de "Resultado esperado"/"Você consegue"). As listas mais próximas de capacidades são: (1) as 21 verificações do §Final ("Você domina o Bloco 5 quando"), extraídas em aparato.json → checklist_final; (2) o box "Critério de domínio deste módulo" do §00. Nenhuma foi promovida a "resultado esperado".

## § MAP (perguntas do mapa)

"Seis aulas, da falha ao mapa" (L334). Lead: "A sequência é dedutiva. Começa na razão econômica de existir regulação, desce até o instrumento mais concreto que ela produz — o valor da tarifa — e fecha posicionando o desenho brasileiro num mapa de dois eixos."

`perguntas` = null. O §MAP do M05 é uma grade de 6 cartões (n/t/d) com descrição, não uma tabela aula × pergunta como no M01. Nenhum cartão formula pergunta; a descrição (div.d) está em linhas[].descricao. A pergunta da aula, se necessária, é derivação da camada Alexandria (P3/P11).

| Cartão | Título do cartão | = h2? | Descrição (literal) | Origem |
|---|---|---|---|---|
| Aula 01 | Por que regulado | sim | Monopólio natural, economia de rede, externalidade e a diferença entre competir no mercado e competir pelo mercado. | L337 |
| Aula 02 | Unbundling | sim | Separar o que compete do que não compete. Quatro graus de separação e o corte parcial que o Brasil fez. | L338 |
| Aula 03 | Pool e bilateral | sim | Dois desenhos puros, o híbrido brasileiro e a distinção que resolve a confusão: contrato move dinheiro, operador move elétrons. | L339 |
| Aula 04 | Captura regulatória | sim | Seis mecanismos, o teste de sete perguntas e o argumento econômico por trás da independência analítica. | L340 |
| Aula 05 | Revisão tarifária | sim | Base de remuneração, custo de capital regulatório, Parcela A e B, Fator X e o ciclo que decide quanto se pode cobrar. | L341 |
| Aula 06 | Desenho comparado | **não** (h2: Desenho de mercado comparado) | Síntese. Dois eixos — coordenação do despacho e remuneração da capacidade — e onde o Brasil fica no mapa. | L342 |

## Critérios (P14, P18)

Várias formulações de "domínio"/"conclusão" coexistem na fonte (box do §00, pílula do hero, lede do §Quiz, mensagens do script do quiz, h2/lede do §Final com 21 verificações, lede do §Ex, §Voz). Registradas literalmente; nenhuma é "o" critério (P18). Nenhum limiar declara domínio no produto.

| id | Seção | Literal | Limiar literal | P14 (inferido) | Origem |
|---|---|---|---|---|---|
| m05-crit-tese | §00 | Você domina o Bloco 5 quando, diante de qualquer regra do setor elétrico, responde as quatro perguntas da régua sem consultar nada — e quando consegue explicar, para um decisor cético, por que a independência analítica não é um slogan de posicionamento, mas a resposta estrutural ao mesmo problema de incentivos que a captura regulatória descreve. | — | producao_oral_ou_livre, sem_consulta | L323 |
| m05-crit-hero | hero | 10 questões · critério 8/10 | 8/10 | — | L262 |
| m05-crit-quiz | §Quiz | Quiz de fluência. Cada resposta tem retorno explicativo com a aula de origem. O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar. | 8 de 10 | sem_consulta, automatizavel_mas_P18_limiar_nao_e_evidencia | L1133 |
| m05-crit-final | §Final | Vinte e uma verificações. Responda sem travar e sem consultar. Cada uma que falhar aponta uma aula específica — e a aula é para ser refeita inteira, não consultada em diagonal. | — | producao_oral_ou_livre, sem_consulta | L1223 |
| m05-crit-ex | §Ex | Resolva antes de abrir. Em cinco deles há conta; nos outros cinco, a resposta certa é um raciocínio institucional que precisa sair inteiro em voz alta. Os que travarem apontam a aula a refazer — por inteiro, não em diagonal. | — | producao_oral_ou_livre | L1067 |
| m05-crit-voz | §Voz | A regra Alexandria: todo conceito sobrevive em voz alta ou volta para a fila de estudo. Três ferramentas aqui — trinta e quatro perguntas-relâmpago, seis ataques de decisor cético e um roteiro de cinco minutos para gravar, ouvir e refazer de cabeça. Neste bloco, a §Voz é mais importante que nos anteriores: o conteúdo é argumentativo, e argumento que não sai em voz alta não existe. | — | oral, cronometrado | L1146 |

**Mensagens do placar no script:**
- `sc>=8` (L1872): "Critério de domínio atingido. Passe para o §Voz: as trinta e quatro perguntas-relâmpago primeiro, os seis ataques de decisor depois, e só então o roteiro de cinco minutos — tudo em voz alta, sem consultar."
- `else (sc<8)` (L1875): "Abaixo do critério de 8/10. Leia os retornos acima, refaça por inteiro as aulas indicadas e volte. Não avance para o §Voz antes de fechar 8."

**Partes do § Voz (todas orais e cronometradas):**
- V.1 "Trinta e quatro perguntas sem travar": oral; cronometrado (hesitação > 3 segundos marca lacuna).
- V.2 "Seis ataques de decisor cético": oral; cronometrado (90 segundos por ataque).
- V.3 "Roteiro de cinco minutos": oral; cronometrado (5 minutos); gravado.

A marcação P14 é inferência desta extração a partir do verbo e da instrução de cada item. Precisa de revisão humana. Os 21 itens do § Final estão marcados um a um em `aparato.json`.

## Laboratórios e Tradutor

- **Laboratórios:** `itens` = null. A fonte do M05 não tem seção "§ Lab" nem instrumento fora de aula (zero "LAB", zero "§ Lab"/"§Lab"). Os 6 instrumentos vivem dentro das aulas 01–06 (ver instrumentos.json).
- **Tradutor:** `itens` = null. A fonte do M05 não tem "Tradutor" nem "§ Map" (minúsculo) como no M01; o único mapa é o §MAP (percurso).

## Voz e princípios editoriais

| id | Tipo | Rótulo | Onde |
|---|---|---|---|
| m05-voz-regua | principio_editorial | A régua das quatro perguntas | — |
| m05-voz-regra-oral | lede | (sem rótulo) | L1148 |
| m05-voz-como-treinar | box | Como treinar | L1211 |
| m05-voz-hierarquia-fontes | lede | (sem rótulo) | L1351 |
| m05-voz-vocabulario | lede | (sem rótulo) | L1255 |
| m05-voz-erros | lede | (sem rótulo) | L1044 |
| m05-voz-disciplina-caso | box | Disciplina do caso | L1027 |
| m05-voz-numeros-vivos | box | Números vivos · verificar na fonte antes de uso externo | L794 |
| m05-voz-pergunta-cetica | box | A pergunta cética que você precisa responder | L730 |
| m05-voz-rodape | principio_editorial | (sem rótulo) | L1376, L1377 |

**§ Voz (domínio oral).** Tem 34 perguntas-relâmpago (a prosa diz "trinta e quatro"), 6 ataques de decisor cético (a prosa diz "Seis") e um roteiro de cinco minutos em 5 parágrafos. As contagens batem. V.2 declara "Duas delas são sobre a própria GridAlpha" (ataques 2 e 4 citam analistas independentes/GridAlpha) — P24.

## Erros comuns (§ Erros)

"Doze erros que custam credibilidade": a prosa declara "Doze", e o markup tem 12. A frase errada fica em `frase_errada_*` e a correção em `correcao_*`. A fonte não liga erro a aula. Não extraído: nenhum arquivo de src/lib/data traz os 12 erros do §Erros do M05.

1. "Regulação é o governo controlando preço." (L1046)
2. "Monopólio natural precisa ser estatal." (L1047)
3. "Unbundling é privatização." (L1048)
4. "No Brasil, quem distribui não pode ter geração." (L1049)
5. "Geração é sempre competitiva." (L1050)
6. "Meu contrato bilateral traz a energia daquela usina para a minha fábrica." (L1051)
7. "Pool elimina contrato." (L1052)
8. "Lá fora o mercado é descentralizado e não tem operador central." (L1053)
9. "Captura regulatória é propina." (L1054)
10. "A decisão favoreceu a empresa, logo houve captura." (L1055)
11. "A base de remuneração é tudo o que a empresa gastou." (L1056)
12. "A conta subiu, logo a distribuidora ganhou mais." (L1057)

## Explicadores em três níveis e blocos de produto

- **Explicadores (6):** um por aula, com as abas "Criança de 12 anos" / "Executivo" / "Especialista". Os três painéis estão literais em `tres_niveis[].paineis`.
  - No código, só o painel 0 está presente (100 100 100 100 100 100), e os três rótulos se fundem num único `<b>`.
- **Blocos "Onde isso entra no produto" (7):** #a01 L440, #a02 L542, #a03 L634, #a04 L749, #a05 L883, #a06 L994, #caso L1032. P7 manda não exibi-los. Ficam registrados literalmente.

## Divergências do grupo

| id | Tipo | Sev. | Tema | Nota |
|---|---|---|---|---|
| div-m05-mod-01 | fonte_x_fonte | — | Título do cartão da Aula 06 no §MAP × h2 da aula | O código usa o h2 ("Desenho de mercado comparado"), como o catálogo canônico. Os outros 5 cartões são idênticos ao h2. |
| div-m05-mod-02 | fonte_x_fonte | — | "Módulo 05" × "Bloco 5" | A fonte chama o próprio módulo de "Bloco 5" (3 linhas) e remete a "Bloco 6" e "Bloco 9" como outros módulos. O produto usa "Módulo". |
| div-m05-mod-03 | fonte_x_fonte | — | Critério de domínio em várias formas | Formas qualitativa (§00), numérica 8/10 (hero, §Quiz, script), 21 verificações orais (§Final), voz alta (§Ex, §Voz). A mensagem ≥8 do script diz "Critério de domínio atingido" e manda seguir para o §Voz; a mensagem <8 proíbe avançar para o §Voz. |
| div-m05-mod-04 | fonte_x_decisao | — | Marca GridAlpha em texto voltado ao learner | Inclui: o kicker (L255); o h3 de aula "4.6 Onde isso vira a tese da GridAlpha" (L721) e dois parágrafos da §4.6 (L722, L728); o box cético da Aula 04 (L732); o box de produto da Aula 06 (L996); a instrução de V.2 no §Voz (L1190, "Duas delas são sobre a própria GridAlpha") e um ataque de V.2 (L1195); um item do §Final (L1242); o rodapé (L1376). |
| div-m05-mod-05 | fonte_x_decisao | — | Blocos "Onde isso entra no produto" | 7 boxes (6 aulas + §Caso), mais a subseção de aula 4.6 "Onde isso vira a tese da GridAlpha" (L721), que é argumento de posicionamento de produto dentro da aula. O código (MODULO_05_CORPO) porta os 6 boxes de aula como nota tom "gold" sem rótulo. |
| div-m05-mod-06 | fonte_x_codigo | media | Explicador "três níveis" portado pela metade | Em 6 explicadores, o código tem 6 painéis "Criança de 12 anos" e 0 painéis Executivo/Especialista; os rótulos das abas viram um <b> único. |
| div-m05-mod-07 | fonte_x_codigo | baixa | Rótulos de box perdidos no código | O <span class="tag"> de cada box não é portado (label null); box rd e box cy viram tom "neutro". |
| div-m05-mod-08 | fonte_x_codigo | baixa | Comentário de alexandria-trilhas.ts afirma títulos 1:1 no §MAP | O comentário diz que os seis títulos do mapa "batem 1:1"; na fonte o cartão da Aula 06 ("Desenho comparado") difere do h2 ("Desenho de mercado comparado") — ver div-m05-mod-01. A contagem (6) do comentário confere. |
| div-m05-mod-09 | lacuna_codigo | informativa | alexandria-badges.ts não referencia o M05 | A fonte do M05 não define insígnia/badge; o código também não. Nada a comparar. |

Sobre div-m05-mod-08: o comentário em `alexandria-trilhas.ts` fala de `<h3>`, mas os títulos de aula da fonte são `<h2>`.

## Lacunas

- **Resultado esperado:** não existe na fonte.
- **Perguntas do § MAP:** não existem (o mapa só tem cartões descritivos).
- **Trilha, nível e eixos:** não são declarados.
- **Horas:** min e max ficam null (só existe a string).
- **§ Lab e Tradutor:** não existem.
- **Vínculos com aula:** nenhum erro, critério ou item de voz declara aula.
- **Por aula:** duração, dificuldade e vídeo não existem na fonte. O código traz `null`/medido, ver `roteiro[].comparacao_codigo`.
- **Corpo das aulas:** fica fora deste grupo. Aqui entram só o roteiro, os explicadores e os ponteiros; os instrumentos estão em `instrumentos.json`.

## Verificação

Verificação adversarial independente em 2026-09-17. Parser e normalização próprios (sem m05_lib): tags removidas, entidades decodificadas e espaços ignorados; texto comparado contra a janela da fonte em torno de linha_aprox (±3 linhas, alargada pelo tamanho do texto). Quiz: o literal var Q avaliado de novo e comparado campo a campo. Script: cada {linha, codigo} comparado com a linha da fonte.

- **textos_e_origens_aparato:** 694 checagens, 0 falhas (todos os itens com texto e origem)
- **textos_e_origens_modulo:** 640 checagens; 9 acusações, todas falso-positivo do medidor (convenções, título do catálogo L441 de outro arquivo, títulos de instrumento no roteiro ancorados por linhas[] e não pela origem do pai)
- **textos_e_origens_instrumentos:** 143 checagens, 0 falhas
- **quiz:** 10/10 questões: enunciado, 4 alternativas, gabarito e explicação idênticos ao var Q avaliado; rótulo "Questão N de 10"; linha ±3; 2 faixas de placar (L1872, L1875) conferidas
- **checklist:** 21/21 itens: html idêntico ao <li> e linha exata (ul.ck única, L1224)
- **formulas_script:** 403/403 pares {linha, codigo} idênticos; cobertura das linhas não vazias de cada bloco INST 01–06 completa; 23/23 ramos de veredito (condição e expressao_js) idênticos às linhas 1493–1757
- **exercicios:** 10/10: tag, enunciado e cada parágrafo do gabarito (html e linha) idênticos
- **referencias:** 16/16 (texto igual, exceto <br> → espaço), 4 URLs idênticas
- **glossario:** 72/72: termo, definição e linha; 5 resumos de família literais
- **voz_e_erros:** 34/34 perguntas-relâmpago, 6/6 ataques e 12/12 erros: html e linha idênticos
- **Contagens:** Todas as contagens declaradas conferem com a recontagem direta no HTML: 16 sec-id; 6 aulas; 6 div.inst; 21 ranges (4+3+4+1+6+3); 8 sinais (array SIG, pesos somam 100); 24 readouts (4 por instrumento), 4 textuais; 23 ramos vd() (4+3+5+4+4+3); 72 termos (12/12/11/17/20; 92 span.term − 20 do §Ex); 10 exercícios; 21 itens; 10 × 4 no quiz; 8 perguntas no caso; 16 referências (4 com href); 6 map-card; 7 pílulas; 34/6/5 na §Voz; 12 erros; 6 painéis lv; 7 boxes "Onde isso entra no produto"; 10 linhas com "GridAlpha"; 30 h3 nas aulas; 0 Lab/Tradutor/Resultado esperado/vídeo.
- **Reproduções:** Cenários-padrão refeitos à mão pelas fórmulas do script: INST·01 R$ 630; INST·02 32/30/63; INST·03 227,50 / 319,90 / 184,80; INST·05 R$ 1,1 bi, 78,57, participação 27%; INST·06 coerência 84, distância 0, quadrante e risco. Grade INST·01: 360 casos e 27 ramos coincidentes reproduzidos; tamanhos das demais grades (1764, 1815, 768, 972, 9261) conferem. m05_verify.mjs rodado de novo: saída idêntica (2227/0).
- **Divergências:** As 25 conferidas contra a fonte e o código (inst-01 id "i1" × i['i1-n'] em alexandria-instrument-calculators.ts L2870; inst-03 texto único; inst-06 selects "(N pts)"; mod-06 "Criança de 12 anos Executivo Especialista" num <b> só; literal da taxonomia citado em inst-04 confere). Nenhuma inventada.

**Correções aplicadas:**

- div-m05-mod-02, leitura_b.onde: listava "§Voz lede, Aula 05 lede" sob o literal "Bloco 5", mas nessas linhas a fonte diz só "Neste bloco" (L1148) e "do bloco" (L761). O literal "Bloco 5" está em L287, L325 e L1222. Corrigido em modulo.json e em m05_modulo.mjs, com as 7 linhas de "bloco" em minúscula listadas à parte.

**Observações sem correção:**

- marcacao_p14 do checklist: o item 01 ("Aplica a régua…") não recebe "aplicacao" e o item 17 ("Aplica o teste… a uma decisão concreta") recebe. É a regra declarada no extrator (só "a uma decisão concreta" ou "Plota"), não um erro; continua como anotação a revisar.
- O lead da Aula 06 no código difere da fonte só pelo escape das aspas (\"), então lead_igual = true se mantém.
