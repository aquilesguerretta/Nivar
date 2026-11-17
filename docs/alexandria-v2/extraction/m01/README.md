# Extração M01 — Física de Energia e Eletricidade

Esta extração alimenta as Peças **C1** (página do módulo) e **C2** (Aula 08, Fator de capacidade).
A fonte é o HTML do M01 (3212 linhas). Tudo é verbatim com a linha de origem (±3), e nenhuma divergência foi resolvida
aqui (P5): as duas leituras ficam preservadas.

## Arquivos

| Grupo | Arquivos | Conteúdo | Verificação |
|---|---|---|---|
| modulo | `modulo.json`, `modulo.md` | roteiro, identidade, § MAP, resultado esperado, critérios, LAB·01, voz, Tradutor (§ Map) | ok (276 strings; 2 origens e 1 html de rodapé acrescentados) |
| aula08 | `aula-08.json`, `aula-08.md` | A08 (L2004–2095), INST06 (script L2935–2962), figura cf-chart, Ex06 | corrigido (62 checagens; 4 erros corrigidos, detalhados abaixo) |
| aparato | `aparato.json`, `aparato.md` | caso Operação A, quiz, checklist final, índice de exercícios, referências, glossário | corrigido (165 checagens; 5 erros corrigidos, 2 rótulos acrescentados) |

Os extratores estão em `extratores/`: `m01_modulo.mjs`, `m01_aparato.mjs`, `gen-aula08.mjs`, `terms-a08.mjs` e
`verify-a08.mjs`. `patch-gen-a08.mjs` é um remendo de uso único, que aponta para a cópia original de `gen-aula08.mjs`.
Todos leem o HTML-fonte em `C:/dev/GridAlpha v2/Alexandria modulos/`, só para leitura.

## Contagens

**Módulo.** 19 seções no roteiro e 9 aulas. 10 aparatos e 7 capacidades de resultado esperado. 9 perguntas no § MAP,
4 itens de hero-meta e 3 critérios literais. 16 itens no checklist e 4 mensagens de placar do quiz. O LAB·01 tem 8
campos, 10 saídas e 12 linhas de coeficiente. Há ainda 4 itens de voz e 8 linhas do Tradutor. Não há erros comuns no
nível do módulo; há só 3 ponteiros para callouts dentro das aulas. Pela marcação P14 (inferida), 2 itens são
cronometrados, 7 capacidades são orais ou livres e 15 itens do checklist são orais ou livres.

**Aula 08.** 12 blocos: lead 1, título 3, parágrafo 4, fórmula 1, instrumento 1, figura 1 e destaque 1. Seções
8.1–8.3 e 1 figura com 7 barras. Não há tabela nem "Vale lembrar". O instrumento INST06 tem 3 entradas, 1 saída
numérica e 6 ramos de texto de leitura, e o texto da aula o invoca 2 vezes. Há 1 exercício vinculado (Ex06),
2 relacionados sem vínculo e 2 termos candidatos entre os 38 do léxico. A cobertura por token é de 98,9%
(100% efetiva). No cenário-padrão, FC = 25,1%. Foram registradas 6 divergências da fonte e 12 com o código.

**Aparato.**
- **Caso.** 1 seção, sem partes. Tem 6 dados, 4 leituras, 1 callout de linguagem e 8 itens em "o que pedir", mas
  nenhuma pergunta e nenhuma decisão pedida.
- **Quiz.** 10 questões × 4 alternativas, com 4 faixas de placar.
- **Checklist final.** 16 itens, 1 deles cronometrado.
- **Exercícios.** 8 na fonte: 7 vinculados a aula e 1 solto (Síntese).
- **Referências.** 8 itens: 0 com URL, 7 com domínio citado e 1 com data.
- **Glossário.** 38 termos no markup, idênticos aos 38 do código, contra 28 declarados na prosa.
- **Divergências e cobertura.** 10 divergências. Cobertura de 100% em Caso, Final, Ref e Lex, 99,7% no Quiz e 25% no
  Drill (de propósito, porque ali só há índice).

## Divergências com o código atual e com o catálogo (P8)

**Catálogo.**
- O próximo módulo se chama "02 · A Rede Elétrica" na fonte e "Como Funciona uma Rede Elétrica" no bloco-02.
- O título do módulo tem duas formas: o h1 longo ("…o módulo que transforma watts em decisão financeira.") e o curto
  "Física de Energia e Eletricidade", usado no rodapé e no catálogo.
- A fonte usa a marca GridAlpha, e o produto hoje é NIVAR. O texto foi mantido literal, e o P7 manda não exibir o
  bloco de produto.
- Horas: a fonte traz só "4 – 6 horas", e o catálogo já tem 4 e 6.

**Código (módulo e LAB·01).**
- Na Fábrica B, o markup mostra R$ 1.800 / R$ 67.425, mas o script calcula R$ 3.200 / R$ 68.825, que é o que vale na
  tela.
- As faixas do campo e do deslizador gêmeo são diferentes. Além disso, com `parseFloat(fp.value) || 1`, um FP vazio
  vale 1.
- Os rótulos do lab-01 no código são compostos. Os h5 "Fábrica A · Operação estável" e "Fábrica B · Operação
  concentrada" não existem no código.
- O protocolo §3 situa o LAB·01 no "§MAP", mas na fonte ele está em "§ Lab" (L2258).
- Fora deste grupo: o callout "Erro de fluência" da aula-01-01 tem só 1 dos 3 parágrafos, e o rótulo está em `html`.
  O gabarito do Ex·07 concatena os 3 `<p>` (L468).
- `BibliotecaView.tsx` recorta e recapitaliza o item 8 das referências, parafraseia `FONTES[ANEEL].publica` e expande a
  sigla ANEEL.

**Código (Aula 08).** Ids: `inst-06`/`ex-06`/`aula-01-08` ↔ `m01-inst-06`/`m01-ex-06`/`m01-a08`.

| Id | Sev. | Divergência |
|---|---|---|
| COD-01 | alta | A figura `div.cf-chart` (7 barras) está ausente de `MODULO_01_CORPO['aula-01-08']`. |
| COD-02 | alta | O instrumento é renderizado depois da apostila (`aula.instruments`). Na fonte ele fica entre "Use a calculadora abaixo:" (L2023) e o h3 8.3. Viola C5 e a Regra-mãe 1. |
| COD-03 | média | O parágrafo 8.2 não é verbatim: os `<span class="hl">` foram removidos, mas os 3 `</span>` ficaram. |
| COD-04 | média | O bloco `div.formula` não foi portado. |
| COD-05 | média | `inst-06.formula` é paráfrase inexistente na fonte, e o comentário a chama de "Original". |
| COD-06 | média | O texto inicial de `#i06-interp` virou `note` estática (com "usina"). Ela aparece junto do veredito dinâmico (ramo ≥0,25). |
| COD-07 | baixa | A saída usa até 2 casas ("25,11"); a fonte usa 1 casa fixa ("25,1"). |
| COD-08 | média | No callout gold, o rótulo virou `html` de nota, e o corpo virou um parágrafo solto. |
| COD-09 | baixa | `points: 1` no Ex06 não tem origem. |
| COD-10 | baixa | Os `aulaIds` do glossário são derivados. "Potência" só casa por "potência plena". |
| COD-11 | baixa | `Number()` contra `parseFloat()\|\|0`, com diferença praticamente inalcançável. |

## Contradições da fonte (P5)

1. **Critério do módulo, em quatro formas.**
   - § Drill: "seis dos oito" (L2389).
   - § Quiz: "8 de 10" (L2474).
   - § Final: 16/16 itens (L2494).
   - Script do placar (L3199–3202): com 7 acertos já manda avançar, com 8 manda revisar e só com ≥9 diz "Pronto para o
     Módulo 02".

   Nenhuma forma prevalece.
2. **Alcance do Drill.** A prosa diz que os exercícios alcançam "todas as nove aulas", mas as tags cobrem só 01, 02, 04,
   05 (×2), 07 e 08, mais a Síntese. As aulas 03, 06 e 09 não têm exercício. O protocolo §5 cita erradamente uma
   contagem 6 contra 8; a contagem é 8 = 8.
3. **Trava do War Room.** O § Caso (L2192) diz "Trava 3"; o § 00, a Aula 05 e o quiz Q10 dizem "Trava 4". A fonte não
   define as travas, e "War Room" é vocabulário interno visível ao learner.
4. **Léxico.** A prosa diz "Vinte e oito termos", mas o markup tem 38. A ordem alfabética tem uma quebra ("Perdas
   técnicas" vem antes de "Perdas não técnicas").
5. **Sigla FC.** Designa tanto fator de capacidade (A08) quanto fator de carga (A05 e quiz).
6. **Cinco dimensões.** O lead do § 00 e o hero-subtitle dão duas listas diferentes, e nenhuma é rotulada como eixo.
7. **Marcadores `§ MAP` e `§ Map`.** São seções distintas (L1325 e L2358) que só se diferenciam pela caixa.
8. **Leitura inicial do INST06.** O texto da marcação (L2051, com "usina") é sobrescrito no carregamento pelo ramo
   ≥0,25 (FC 0,2511). Nenhum ramo reproduz a marcação.
9. **Faixas do INST06 contra a figura cf-chart.**
   - Solar: 20–28% na figura, corte em 0,25 no script.
   - Carvão: 55–75% na figura, ≥0,85 no script.
   - CCGT: 40–60% na figura, ≥0,55 no script.

   O léxico usa valores pontuais, e o Ex06 diz "abaixo de 15%".
10. **Q05 do quiz.** FC = 0,40 cai na fronteira fechada de duas faixas da tabela da A05 (L1814–1815).
11. **LAB·01.** O markup estático contradiz o valor calculado pelo script (Fábrica B, ver acima).

## Lacunas (a fonte não tem)

- **Módulo.** Não há eixos declarados (`eixos` = null). `horas.min` e `horas.max` são null. O LAB·01 não tem passos,
  entregável nem vínculo com aula.
- **Aparato.** Nenhum item do aparato (quiz, checklist, referências, termos, caso) declara vínculo com aula.
- **A08 e INST06.**
  - O INST06 não tem pergunta própria. As candidatas são a do § MAP (L1346, "Por que 100 MW solar ≠ 100 MW
    térmica?") e o enunciado do Ex06, e uma pergunta de previsão teria de ser derivada (P3/P11).
  - Não há procedência para o cenário-padrão, os limiares e as faixas da figura.
  - Não há tolerâncias, previsão nem gabarito (P6).
  - A figura não tem título, e a unidade % foi inferida.
  - O Ex06 não tem critério próprio.
  - Duração, dificuldade, vídeo, imagens e referências por aula são null.
- **Caso Operação A.** Não tem "Parte 1", perguntas nem decisão pedida.
- **Referências.** Nenhuma tem URL (só o domínio em `<em>`) nem tipo. A única data é a vigência da REN 1.000/2021, e
  faltam os campos D5 (o que responde e o que não responde, tema, recorte, última verificação).
- **Fora do código.** O caso, o quiz e o checklist final existem só no HTML, não em `src/lib/data` (dependência §9).
- **Não extraídos no grupo módulo.** As perguntas do quiz, o Caso, o Lex e o Ref não foram extraídos ali, mas estão
  no grupo aparato. O Tradutor está no grupo módulo; se outro grupo o extrair, é preciso deduplicar por
  `m01-tradutor-NN`.
- **Anotação a revisar.** `marcacao_p14` é inferência a partir do verbo de cada item e precisa de revisão humana.
- **Não verificado na tela.** COD-02, COD-06 e COD-07 foram deduzidos da leitura de `AulaViewer.tsx` e
  `InstrumentPanel.tsx`, não medidos na renderização.

## Uso por gate do bar

| Gate | O que a extração fornece | O que falta ou exige cuidado |
|---|---|---|
| **C1** mission control | Título e hero-meta, as 7 capacidades, o § MAP (9 aulas × pergunta), os 3 critérios literais, a rota ("02 · A Rede Elétrica") e as horas "4 – 6 horas". | Não há tese nem eixos. O critério é contraditório (P5): mostrar as formas sem escolher e nunca marcar como cumprido pelo quiz. Nome do módulo 02 diverge do catálogo (P8). |
| **C2** tipos de objeto | O roteiro de 19 seções separa aulas, LAB·01 e INST06, caso, Drill, quiz, checklist final, referências e léxico (38). | A experiência jogável não existe na fonte e deve aparecer como "em desenho" (P16). O caso, o quiz e o checklist existem só no HTML. |
| **C3** abertura da A08 | O lead e a pergunta do § MAP (L1346) como pergunta da aula. | O INST06 não tem pergunta própria nem previsão, e as duas precisam ser derivadas (P3/P11). A aula não tem vídeo, então nenhum cartão de vídeo. |
| **C5** instrumento como etapa | A posição exata do INST06 (depois de L2023, antes do h3 8.3), as 3 entradas com unidade, a saída com 1 casa, os 6 ramos de leitura e a fórmula literal do `div.formula`. | Faltam fonte dos números e tolerâncias. Corrigir COD-02, COD-05, COD-06 e COD-07. A leitura inicial é ambígua (item 8 das contradições), e as faixas contradizem a figura (item 9). |
| **C7** tentativa antes da referência | O Ex06 com gabarito, os 8 exercícios com o rótulo "Revelar gabarito" (que o gate proíbe como revelação direta) e o quiz com o feedback. | O Ex06 não tem critério próprio. O gate C7 pede tentativa registrada antes da referência, e o botão da fonte revela direto. `points: 1` é invenção do código. |
| **C9** ato autêntico | Na A08, o INST06 e o Ex06 exercitam o FC. As 7 capacidades e os 16 itens do checklist servem para o "Serve a", e o P14 marca os itens orais ou cronometrados. | O vínculo entre aula e capacidade não é declarado pela fonte e tem de ser derivado. Três aulas (03, 06 e 09) não têm exercício. |
| **C10** recuperação e próximo passo | As 4 mensagens de placar, os limiares literais, o checklist final e a rota até o Módulo 02. | O placar contradiz o critério de 8/10 (P5), e o critério deve aparecer antes da avaliação, sem nunca virar Demonstrado. O caso não tem decisão pedida, então a decisão exigida pelo C8 teria de ser derivada. |

## Resoluções do Founder (2026-09-16)

As contradições e lacunas acima foram decididas em
[`../../decisoes/2026-09-16-ambiguidades-de-conteudo.md`](../../decisoes/2026-09-16-ambiguidades-de-conteudo.md)
(P17–P24). Os JSONs desta pasta continuam **literais** (camada fonte). As resoluções valem para a camada de produto:

| Achado da extração | Resolução |
|---|---|
| Caso sem "Parte 1", sem perguntas nem decisão | P17: "Caso — Operação A" + Desafio de decisão da camada Alexandria, só com fatos do caso |
| Critério do módulo em várias formas (6/8, 8/10, mensagens do script, checklist de 16) | P18: nenhum é o critério; conclusão, desempenho e evidência ficam separados; sem ponto de corte novo |
| INST06 sem pergunta, sem fonte dos números, sem tolerância | P19: "cenário didático; fonte externa não declarada"; pergunta de previsão da camada Alexandria; arredondamento como regra de entrada |
| Faixas do script do INST06 × figura cf-chart | P20: CONTENT QA, verificação autoritativa pendente; nenhuma faixa vira verdade |
| Sigla FC ambígua (A05 × A08) | P21: FCap e FCarga |
| Léxico "Vinte e oito termos" × 38 itens | P22: contar a coleção (38) |
| "Trava 3" × "Trava 4" | P23: reconciliar pelo contexto ou usar rótulo semântico |
| Marca GridAlpha; nome do Módulo 02 e do M01 variando | P24: Alexandria (produto), NIVAR (empresa); o catálogo canônico governa os títulos |
