# Correções dos protótipos · 2026-09-17

Resposta ao critic que reprovou quatro comps: PRANCHA M01·A08, MESA M13·A06, LUPA M12·A01 e DOSSIE M04·A07.
Os fontes estão em `_src/`. A montagem é `python gen_dossie.py && python gen_mesa.py && python build.py`, a captura é
`node capturar.mjs`, e a nova verificação é `node verificar.mjs`. Todos os HTML e PNG desta pasta foram regerados.
SERIE e SISTEMA só foram remontados, por causa da mudança no tronco, e continuam com o mesmo conteúdo.

## Verificação medida no render

`_src/verificar.mjs` é novo. Ele roda a 1440 e a 390, nos estados inicial e `?estado=registrado`, e mede:

- quantas versões `.dsk-only` e `.mob-only` estão visíveis;
- se algum número de referência aparece antes do registro, contando só nós de texto com retângulo maior que zero;
- se algum rótulo de SVG sai da viewBox;
- `scrollWidth`;
- onde fica o fundo do botão do 1º ato.

**Resultado final.** Nas seis aulas, a 1440 aparece só a versão desktop e a 390 só a versão mobile. Não sobrou
número vazado nem rótulo cortado, e `scrollWidth` bate com a largura da janela.

Fundo do botão do 1º ato a 390 (viewport de 844 px; a tabbar ocupa cerca de 60 px):

| Aula | Fundo do botão |
|---|---|
| PRANCHA | 744 |
| LUPA | 768 |
| DOSSIE | 707 (antes, 859) |
| MESA | 1.067 |

Na MESA, o ato e o sinal começam no 1º viewport, mas o botão fica abaixo da dobra, porque as oito categorias ocupam
quatro linhas. O critic não apontou isso. Fica como pendência de S7 no Design Loop.

**Defeito de harness encontrado.** O `innerText` do Chrome inclui o `<text>` de SVG que está oculto. A primeira
rodada acusou "25,1", "49,7" e "R$ 480 mil" como vazamentos, mas todos estavam em `<g class="so-reg">` com caixa 0×0.
O verificador agora mede cada nó de texto pelo retângulo. Registrado em SISTEMA §2.6 L2.

---

## PRANCHA · M01·A08

| Apontado | Causa | Correção |
|---|---|---|
| Figura do INST·06 duas vezes; a 2ª cópia gigante, sem estilo | Em `prancha-m01-a08.css`, a regra `.caixa svg{display:block}` (especificidade 0,1,1) vencia `.mob-only{display:none}` do tronco (0,1,0). Por isso a versão de 390 aparecia a 1440. | **Sistema:** em `tronco.css`, `@media (min-width:761px){.mob-only{display:none!important}}`. Saiu o `.mob-only{display:block}` do bloco mobile. `.dsk-only` já usava `!important`. Medido: 1440 → dsk 1 / mob 0; 390 → dsk 0 / mob 1 (PRANCHA e SERIE). |
| Buraco de ~150 px entre dois parágrafos da 8.1 | A figura da placa, em `.fila` própria, puxava a altura da linha. O 2º parágrafo caía na fila seguinte. | A 8.1 inteira e a 8.2 até "Use a calculadora abaixo" correm numa só coluna de leitura. As duas figuras empilham na coluna lateral (`.fila-pilha` e `.pilha`). A prosa fica contínua. A sobra da coluna lateral cai no fim da seção, antes do palco. |
| "Gás natural CCGT" sem miniatura | Lacuna real de curadoria. O `plano.json` do m01 diz que não há CCGT com licença aberta verificada e que o tema não deve ser gerado. | Ficha tipográfica tracejada "CCGT · sem foto", com `title` explicando. A legenda da tira declara a lacuna e diz que não se gera imagem para tema documental. Nenhum fato foi inventado. |
| EX·06: "%" como placeholder e como sufixo | Placeholder `%`. | O placeholder passou a ser "seu cálculo", em itálico e menor (`.ph-s`), e o sufixo `%` ficou. O `aria-label` agora diz "em porcentagem". |

---

## LUPA · M12·A01

| Apontado | Correção |
|---|---|
| **Regra-mãe 2:** o INST·02 mostrava "valor oficial: 50,0%" antes da estimativa | No estado inicial, os controles "Renováveis na matriz energética, valor oficial" e "Renováveis fora da eletricidade" ficam velados ("liberado depois da sua estimativa"). O segundo também fecha porque 0,19 × 86,8 + 0,81 × 41 = 49,7 calcularia a resposta. Uma nota explica o motivo. No registrado, os quatro deslizadores voltam. |
| "Valor oficial ~50%" na linha de fonte | Versão inicial: "Valor oficial da matriz energética (velado até a estimativa)". "~50%" e "41%" só aparecem no registrado (`so-reg-i`). |
| Ato 3: "a distância entre 86,8% e ~50%" | Versão inicial: "entre a matriz elétrica (86,8%) e a matriz energética". O texto original fica no registrado. |
| `aria-label` do mosaico com "49,7" e "41" | O rótulo agora descreve só a estrutura (19% × 81%) e diz que as alturas aparecem depois da estimativa. Leitor de tela não recebe mais o valor. |
| "Duas fontes": rótulo cortado na borda e "87" colidindo com a linha | Gráfico redesenhado. **A escala antiga também estava errada:** 89 aparecia em y=50, que corresponde a 89,5, e 88,2/86,8 estavam fora do eixo 86–90. Agora a escala vai de 85 a 90 (34 px/pp), com as posições recalculadas. A legenda virou HTML acima do gráfico, com o nome e a fronteira de cada série. Os rótulos de valor ficam junto do ponto (87 acima e 86,8 abaixo em 2025). A viewBox tem 440 de largura, e a fonte renderizada fica em cerca de 13 px. |
| "Praticado 0 de 3 atos", mas a página tem um 4º ato | Todos os atos agora são "de 4". "Identificar o erro" virou "Ato 4 de 4", com o botão "Registrar resposta". O registro diz "0 de 4 atos" e "2 de 4 atos · 1 a revisar". |

---

## MESA · M13·A06

| Apontado | Correção |
|---|---|
| Título "Seis… a sexta" contra 8 categorias no aparato | **P23 aplicada.** O H1 passou a ser "Riscos, e o crédito que o currículo não nomeia", e a 06.2 virou "Crédito e estrutura de capital: o caso da reestruturação de dívida". A nota nova **"Como contar as categorias · Alexandria"**, na 06.1, mostra a soma: 5 do currículo (conforme o lide) + 1 que a aula nomeia + 2 que a matriz acrescenta = 8. Cada linha da matriz declara "na lista do currículo" ou "fora da lista"; a linha do crédito diz "a que a aula nomeia". O título literal da fonte e o da subseção 06.2 ficam na ficha de fonte, e a divergência vai para o registro de proveniência. SISTEMA §7 e §8 foram atualizados. |
| Células "como se manifesta" entregavam a bandeja | A bandeja (Ato 2) agora vem **antes** da matriz, com um `<select>` por sinal e "Registrar os três sinais". A matriz sai em duas versões (`gen_mesa.py`). **No inicial**, só "Regulatório" fica aberta, como linha-exemplo (não é alvo de nenhum sinal). As outras sete mostram a categoria e a posição no currículo, e o conteúdo fica velado. **No registrado**, a matriz abre inteira, com as marcas "um item seu caiu aqui". Também saiu a moldura duplicada da matriz (o cabeçalho aparecia duas vezes). |
| 06.2–06.4 com ~2.800 px sem ato | Três atos de seção entraram, todos da camada Alexandria, com a referência no texto do curso. **Ato 3 · ler o instituto:** logo depois do quadro RJ × RE, A ou B para quem assina 15 anos; a referência é o parágrafo seguinte. **Ato 4 · afirmar hoje:** junto da cronologia, qual frase pode ir hoje sem nova verificação; a referência é a nota de números vivos. **Ato 5 · o que pedir antes de assinar:** documentos para a pergunta do ano dez; o fim da nota "A pergunta que muda de lado" fica velado até o registro. O registro passou a "0 de 5 atos" e "5 de 5 · 2 a revisar". |
| Raízen, valores e datas de 2026 pedem revisão P3 | Conferido: os fatos **estão no HTML do Módulo 13** (13 ocorrências de "Raízen"); não são criação da Alexandria. Mesmo assim, a fonte da 06.2 ganhou o selo "revisão factual P3/P11 pendente", e a ficha diz que valores, percentuais e datas não foram conferidos pela Alexandria em fonte primária e o que conferir antes de publicar. |
| (achado na recaptura) | A classe `.conta` colidia com o `.conta` do header (Cinzel em caixa alta) e virou `.contagem`. A foto da Rocinha agora fica ao lado da 2ª lição (`padding-top` 330). O quadro RJ × RE ganhou respiro depois da linha de fonte. |

---

## DOSSIE · M04·A07

| Apontado | Correção |
|---|---|
| A 390, o limite de R$ 500 mil sumia (`.ab .nota-cen{display:none}`), e o Ato 1 ficava sem resposta | O limite entrou no próprio cenário, numa grade 2×2 em todas as larguras: Carteira · Exposto · Choque · **Limite da política R$ 500 mil**. O enunciado agora diz "fica dentro do limite de R$ 500 mil?". A nota de fonte continua visível a 390, numa versão curta. Para caber no 1º viewport a 390, o subtítulo saiu no mobile e as três opções ficam numa linha (fundo do botão de 859 para 707). |
| Choque "100 no 2º sem." e "intensidade 100" sem unidade | A fonte só diz "intensidade" (0–100), e o rótulo literal foi mantido. A camada Alexandria lê a fórmula da extração, `pld = 200 × SEAS × (1 + S/100 × RAMP)`, com RAMP = 1,00 em outubro: "100 = PLD do mês multiplicado por até 2, no pico de outubro". Essa leitura aparece no cenário ("100 de 100 · PLD até 2× em out."), numa linha abaixo dos controles, na legenda do gráfico e na ficha, sempre marcada como leitura da Alexandria. |
| Fim sem Revisão → Avaliação (C10) | Nos dois estados entrou a sequência "Aula 07 (esta aula) → Revisão do módulo → Avaliação do Módulo 04 · abre depois da Revisão, com o critério mostrado antes". A linha do registro também diz isso. No inicial há "Ir direto à Revisão do Módulo 04"; no registrado, o botão principal leva à Revisão. Saiu "Depois do módulo: M05". |
| A 390, "Carteira 50·25·15 %" e "Exposto ao PLD" quebravam mal | Cada célula tem valor e uma sublinha: "50 · 25 · 15 %" / "base · média · curta"; "10 % ao PLD" / "1.000 MWh/mês". O rótulo agora é só "Exposto". |
| "do consumo todo" em 3 linhas | A recuperação usa colunas `auto` a 1440 e empilha a 390. |

---

## Mudanças de sistema (SISTEMA.md)

- **T3.** O véu cobre controle, fonte, rótulo, `aria-label` e célula vizinha. "N de M atos" conta todos os atos da página.
- **T11.** Na última aula, a sequência Aula → Revisão → Avaliação aparece nos dois estados.
- **T13.** Guarda `.dsk-only`/`.mob-only` com `!important`. O dado que o 1º ato pergunta fica no cartão a 390. Rótulo de SVG tem ≥ 11 px **renderizados** e fica dentro da viewBox.
- **Nova §2.6, "Lições de correção"** (L1–L9): versão, véu, matriz depois do ato, P23 com contagem reconstruível, atos de seção, unidade da fonte com leitura da Alexandria, figura lateral sem vão, ficha tipográfica de lacuna, placeholder.
- **§7:** título do protótipo MESA. **§8:** M13·A06 na lista de QA de contagem.

Features novas foram acrescentadas em `../../features-propostas-aulas.md` (F-PROT-8 a F-PROT-12).

## Pendências abertas

- **MESA a 390:** o botão do 1º ato fica abaixo da dobra (as categorias ocupam 4 linhas × 2). A saída a testar é um `<select>` ou uma lista compacta no mobile.
- **PRANCHA:** a coluna lateral ainda sobra cerca de 200 px no fim da 8.2, antes do palco. Não fica mais entre parágrafos.
- **MESA:** revisão factual P3/P11 dos fatos de 2026 antes de publicar, e confirmação do `plano.json` do m13 para a foto da Rocinha.
