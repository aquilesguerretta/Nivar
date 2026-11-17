# M01 · Grupo "aparato": como ler a extração

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html` (3.212 linhas).
**Arquivo gerado:** [`aparato.json`](aparato.json), em UTF-8 com indentação de 2 espaços.
**Data:** 2026-09-16.

## Método

O texto foi extraído por programa, sem digitação:
- as seções foram localizadas pelo `.aula-marker`;
- o quiz foi lido avaliando o literal `const questions = [...]` do `<script>`.

O script de extração ficou no scratchpad da sessão e não foi versionado. O JSON registra o método no campo `metodo`.

Campos de texto:
- `html`: preserva o HTML inline da fonte, com os espaços colapsados;
- `texto`: remove as tags e decodifica as entidades.

Cada item traz:
- `id` estável (`m01-…`);
- `tipo`;
- `origem {seletor, trecho_inicial, linha_aprox}`;
- `vinculos`, quando a fonte declara algum.

Todo `null` vem acompanhado de uma nota.

**Cobertura por token (protocolo §5):**

| Seção | Cobertura | Observação |
|---|---|---|
| § Caso | 100% | |
| § Final | 100% | |
| § Ref | 100% | |
| § Lex | 100% | |
| § Quiz | 99,7% | O resíduo é o identificador JS `const questions` |
| § Drill | 25% | Proposital: ver a seção "exercicios" abaixo |

## Estrutura e contagens

| Chave | Seção da fonte | Contagem | Estado no código |
|---|---|---|---|
| `caso` | `§ Caso` (L2179) | 6 dados · 4 leituras · 1 callout · 8 pedidos | **Não extraído** |
| `avaliacao` | `§ Quiz` (L2470) + `<script>` (questões L3076–3151, placar L3199–3202) | 10 questões × 4 alternativas · 4 faixas de placar | **Não extraído** |
| `checklist_final` | `§ Final` (L2489) | 16 itens | **Não extraído** |
| `exercicios` | `§ Drill` (L2384) | 8 na fonte · 1 solto (P9) · 7 com aula | Os 8 já estão em `alexandria-modulo-01-content.ts` |
| `referencias` | `§ Ref` (L2686) + colofão | 8 itens | Hardcoded em `BibliotecaView.tsx` |
| `glossario` | `§ Lex` (L2520) | 38 termos (a prosa diz 28) | Os 38 estão idênticos em `alexandria-glossario.ts` |
| `divergencias` | — | 10 | — |
| `contexto_criterios` | `§ 00` "Resultado esperado" | 7 itens | Só como contexto de P5 |

### caso

- **Não há "Parte 1".** A fonte não divide o caso em partes: a busca por `parte N` retornou zero ocorrências. O caso inteiro
  é a extração, e `parte` fica `null`.
- **`perguntas` e `decisao_pedida` são `null`.** A fonte não faz perguntas ao learner e não pede decisão: entrega a
  leitura já resolvida e a lista do que pedir ao cliente.
- **Efeito no bar C8.** A regra "o caso termina em decisão" terá de ser atendida por conteúdo derivado e revisado
  (P3/P11). O HTML não traz essa decisão.
- **Vínculo com aula.** A fonte não declara nenhum.

### avaliacao

Guarda, para cada questão:
- enunciado;
- as 4 alternativas, com letra e índice;
- o gabarito (índice, letra e texto);
- a explicação.

Na fonte, o feedback é o mesmo para acerto e erro. O objeto guarda também:
- o critério literal da prosa;
- as 4 faixas do placar, com a mensagem literal de cada uma.

Sobre a mecânica da fonte (registro, sem decisão):
- há uma tentativa por questão, sem reinício e sem persistência;
- verde e vermelho marcam acerto e erro, o que conflita com S2/C7.

### checklist_final

16 itens literais. Só o item 01 traz critério cronometrado ("em 30 segundos"), o que o sinaliza para P14. Os 16 são
autodeclarados e nenhum pode ser verificado automaticamente.

### exercicios

- **Ex·08** (tag "Síntese · Diagnóstico inicial") é o único exercício solto. Vai completo em `soltos_P9`.
- **Os 7 exercícios com tag de aula** aparecem só como índice, com tag, aula e origem. O texto deles pertence ao grupo de
  aulas e já está no código. Duplicá-lo aqui iria contra o brief.
- **Aulas cobertas pelas tags:** 01, 02, 04, 05 (duas vezes), 07 e 08. As aulas 03, 06 e 09 não têm exercício.

### referencias

Cada item traz:
- o `<li>` verbatim;
- `instituicao` (do `<b>`);
- `descricao_verbatim`;
- `dominio_citado` (do `<em>`).

Campos vazios ou limitados:
- **`url`:** `null` nos 8. A fonte só escreve o domínio como texto, sem link.
- **`tipo_fonte`:** `null`. A fonte não classifica as referências.
- **`data`:** só o item 01 tem data ("3 de janeiro de 2022"), e ela é a entrada em vigor da REN 1.000/2021, não a data de
  verificação.
- **Item 8.** É o canal "Practical Engineering", sem domínio.

A única data de versão do módulo é o colofão: "Cobaia Zero · v1.0 · Maio de 2026".

Para a Biblioteca (D5), a fonte não informa:
- o que cada referência responde;
- o que não responde;
- tema;
- recorte;
- última verificação.

### glossario

Os 38 termos da fonte foram comparados campo a campo com o bloco "MÓDULO 01" de `alexandria-glossario.ts`:
- **38 idênticos**, em termo, etiqueta e definição;
- **0 divergentes;**
- **0 ausentes;**
- **0 só no código.**

Os `aulaIds` do código foram inferidos pela Wave 8. A fonte não declara esses vínculos, e isso fica registrado em cada
termo.

## Divergências (registradas, nenhuma resolvida)

1. **`div-m01-criterio-P5`: o critério de domínio tem quatro formulações.**

   | Onde | Critério literal |
   |---|---|
   | § Drill | 6 de 8 exercícios |
   | § Quiz (prosa) | 8 de 10 |
   | Script do quiz | Só 9–10 recebe "Pronto para o Módulo 02"; 7–8 recebe "avance para o próximo módulo"; 0–4 repete "8/10" |
   | § Final | Passar exige as 16 ações |

   Pelo P5, as quatro ficam verbatim e nenhuma foi escolhida.
2. **`div-m01-quiz-faixa-7-8`: o script se contradiz.** Autoriza avançar com 7 acertos e, na faixa 0–4, afirma que o
   critério é 8.
3. **`div-m01-drill-alcance`: prosa e tags não batem.** A prosa diz "alcançam todas as nove aulas", mas as tags cobrem
   6 aulas.
4. **`div-m01-glossario-contagem`: a prosa diz "Vinte e oito termos", mas o markup tem 38.** Já estava registrada no
   protocolo.
5. **`div-m01-trava-war-room`: a numeração da trava muda.** O caso cita "Trava 3" para linguagem segura, enquanto o
   § 00, a Aula 05 e o quiz Q10 citam "Trava 4". A fonte não define as travas. Além disso, "War Room" é vocabulário
   interno visível ao learner.
6. **`div-m01-quiz-q05-faixa-fc`: FC = 0,40 cai em duas faixas.** O valor está na fronteira fechada de duas faixas da
   tabela da Aula 05, e o Q05 escolhe "sazonalidade moderada".
7. **`div-m01-glossario-sigla-FC`: a mesma sigla "FC" serve a dois termos.** Nomeia tanto o fator de capacidade quanto o
   fator de carga.
8. **`div-m01-glossario-ordem`: a ordem alfabética tem uma única quebra.** "Perdas técnicas" vem antes de
   "Perdas não técnicas".
9. **`div-m01-biblioteca-codigo`: `BibliotecaView.tsx` altera o texto da fonte.**
   - recorta e recapitaliza o item 8;
   - parafraseia `FONTES[ANEEL].publica`;
   - expande a sigla ANEEL, o que o § Ref não faz.
10. **`div-m01-ex07-paragrafos`: o Ex·07 perdeu a estrutura no código.** Os 3 parágrafos do gabarito foram concatenados.
    Não houve perda de texto. A correção cabe ao grupo de aulas.

## Observação sobre o protocolo

A §5 do protocolo cita o M01 ("seis dos oito", há 8) como precedente de divergência entre prosa e markup. Medido agora,
o § Drill tem exatamente 8 exercícios, então a **contagem** confere. A divergência real do Drill está no **alcance**
(item 3) e no **critério** (item 1).

## Verificação

Conferência adversarial feita em 2026-09-16 contra `alexandria_modulo01.html`.

**Como foi feita.** Por programa:
- Cada string de conteúdo do JSON foi procurada na fonte, com espaços colapsados e entidades decodificadas.
- Enunciados, alternativas (com a ordem), gabaritos e explicações do quiz foram comparados campo a campo com o array
  `questions` do `<script>`.
- Os 16 itens do checklist e os 38 termos (termo, etiqueta e definição) foram comparados um a um com o markup.
- Cada `origem.trecho_inicial` foi localizado a até 3 linhas de `linha_aprox`.

**Resultado.**
- Nenhuma palavra trocada, cortada ou acrescentada nos itens de conteúdo.
- Nenhuma origem errada.
- As 10 divergências foram rechecadas na fonte e todas conferem: Trava 3 em L2192; Trava 4 em L1314, L1823 e L3150;
  faixas de FC em L1814–1815; quebra alfabética "Perdas técnicas" antes de "Perdas não técnicas"; trechos de
  `BibliotecaView.tsx` L68–70 e L147–149; Ex·07 em `alexandria-modulo-01-content.ts` L468.

**Correções aplicadas.**
1. **`referencias.colofao_modulo.texto` não era verbatim.** O separador `" | "` não existe na fonte.
   - Os `<br>` agora viram quebra de linha em `texto`.
   - Foi acrescentado o campo `html` com o literal.
   - `linha_aprox` passou de 2712 (a tag `<footer>`) para 2714 (o texto).
2. **Faltava `avaliacao.rotulos_de_interface_fonte`.** O bloco agora traz:
   - "Pontuação final" (L2479);
   - "/10" (L2480);
   - o template `Pergunta ${…} / 10` (L3164), com nota de que `perguntas[].rotulo_fonte` é o texto já renderizado, não
     um literal do arquivo.
3. **Faltava `exercicios.rotulo_botao_gabarito`.** Acrescentado com "Revelar gabarito" (8 ocorrências, L2394–2459).
4. **`faixas_de_placar_script` ganhou `nota_intervalo`.** A nota explica que `intervalo`, `minimo` e `condicao` são
   derivados da lógica do if/else. Só `mensagem` é verbatim.
5. **Linhas corrigidas.**
   - `div-m01-quiz-q05-faixa-fc`: de "fonte ~L1810" para "fonte L1814–1815".
   - Tabela deste `.md`: o placar do quiz está em L3199–3202, fora do intervalo L3076–3150 citado antes.

**Observações sem correção.**
- **Duas divergências trazem uma decisão, apesar do título acima.** Em `div-m01-drill-alcance` e
  `div-m01-glossario-contagem`, o campo `decisao` diz "markup vence". Isso aplica a regra do protocolo (linha 178), não
  uma escolha do extrator, e as duas leituras continuam guardadas.
- **§ Map ("Tradutor", L2358) e § Lab (L2258) não entram neste grupo, e isso é correto.** O Tradutor está em
  `modulo.json` (`tradutor`). O § Lab é instrumento.
