# M12 · grupo "instrumentos"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo12.html`. O markup está em `div.inst`
(11 blocos) e o script nos blocos `INST·01`–`INST·11` (L3181–3936).
Saída: [`instrumentos.json`](instrumentos.json). Extrator: [`extratores/m12_instrumentos.mjs`](extratores/m12_instrumentos.mjs),
que usa [`m12_dom.mjs`](extratores/m12_dom.mjs).

## Método

1. **Markup.** Cada `div.inst` é recortado por contagem balanceada. Dele saem `span.id`, `span.nm`, `p.inst-intro`,
   `p.disc`, `p.srcnote`, os controles (`seg-lb` + `seg`/`tr-grid`), os campos numéricos (número + deslizador gêmeo),
   as leituras (`.ro`), as barras e os alvos renderizados.
2. **Script.** Os literais de dado (`FRENTES`, `N`, `M`, `C`, `I`/`P`, `FR`/`VR`/`PR`/`CD`, `IT`, `E`/`CAT`) são
   avaliados como dado puro. O texto das funções de cálculo e render é copiado **verbatim**, com linhas. Os ramos de
   texto (`txt=`/`txt+=`) guardam a condição e a expressão JS verbatim. As opções geradas pelo script (chips, itens do
   INST·08, navegação do INST·11) vêm desses literais.
3. **Execução.** O `<script>` **original** roda sem alteração num DOM simulado (§10 do protocolo). Isso dá o
   `cenario_padrao_renderizado` (a tela no carregamento) e cobre o espaço de entrada:
   - espaço **inteiro** nos 9 categóricos (15, 8, 12, 12, 24, 81, **19.683**, 12 e 8 casos);
   - **grade** nos 2 numéricos (243 e 227 casos, incluindo vazio e fora de faixa).
4. **Comparação com o código.** Para cada caso, o mesmo estado vai para `INSTRUMENT_CALCULATORS['m12-inst-NN']`.
   - **Texto.** O texto visível da fonte é comparado por palavra (multiconjunto) com o `veredito` do código.
   - **Números.** As saídas numéricas são comparadas com `valores[id]`, arredondado às casas que a fonte exibe.
   - **Palavra "inventada".** É uma palavra do código que não existe em **lugar nenhum** do instrumento na fonte
     (markup + bloco de script).
   - **Dados e campos.** Também são comparados os literais de dado (igualdade profunda contra os `MODULO_12_*`) e os
     campos (id, rótulo, padrão, faixa e opções).
5. **Verificação.** 978 strings de conteúdo conferem como substring da fonte e as 114 origens estão na linha
   declarada, sem falhas (`m12_verify.mjs`).

**Status.** "portado" significa perda zero de texto, nenhuma palavra inventada, dados, campos e números iguais e mesmo
vínculo de aula. As diferenças só de id, de rótulo que a fonte não tem ou de espaço antes da pontuação ficam em
`codigo.ressalvas`. Qualquer outro desvio torna o instrumento "divergente" e vai para `codigo.divergencias`.

## Os 11 instrumentos

| Id | Título (span.nm) | Onde | Invocação (ponto do texto) | Kind no código | Status |
|---|---|---|---|---|---|
| Inst · 01 | Tabuleiro geopolítico — três vetores sobre cinco frentes | §MAP (L722), **fora de aula** | lede do §MAP: "O instrumento abaixo é o mapa desse tabuleiro." | explorador | **divergente** |
| Inst · 02 | Separador de grandeza — quanto a eletricidade explica da energia total | Aula 01, após 01.1 (L875) | fim de 01.1 ("…pergunte qual é o denominador.") | calculadora | portado |
| Inst · 03 | Verificador de fonte de número — de onde vem, o que mede, o que verificar | Aula 01, em 01.2 (L963) | fim de 01.2 | explorador | **divergente** |
| Inst · 04 | Régua diplomático-regulatória — o que existe, em que estado, com que prazo | Aula 02, em 02.4 (L1160) | fim de 02.4; o box.gd seguinte chama de "régua de estado" | explorador | portado |
| Inst · 05 | Comparador de parceiros bilaterais — quatro parceiros, três vetores | Aula 03, em 03.2 (L1281) | fim de 03.2, antes da ficha 1 de 4 | comparador | portado |
| Inst · 06 | Roteador de instrumento comercial — a base jurídica decide o comportamento | Aula 04, em 04.3 (L1478) | fim de 04.3 | quebra-cabeca | **divergente** |
| Inst · 07 | Diagnóstico de prontidão de dado de carbono para exportação | Aula 05, após o box "A pergunta que se faz a qualquer capital estrangeiro" (L1642) | fim de 05.3; o §Caso cita "Instrumento 07" (L2328) | quebra-cabeca | **divergente** |
| Inst · 08 | Régua de maturidade de projeto anunciado | Aula 06, em 06.3 (L1838) | fim de 06.3 ("Anúncio agregado não equivale a capacidade contratada"); citado na Aula 08 (tabela), no Ex 09, no checklist e no §Lex | quebra-cabeca | **divergente** |
| Inst · 09 | Razão reserva-produção — a assimetria medida, não afirmada | Aula 07, em 07.3 (L2010) | fim de 07.3 | calculadora | portado |
| Inst · 10 | Classificador de nome — em que categoria cai, e o que fazer com ele | Aula 08, em 08.1, após `div.tax` (L2168) | taxonomia de seis categorias (08.1); Ex 04 | explorador | **divergente** |
| Inst · 11 | Andaime de conversa — trinta minutos, oito movimentos, sem repetição | Aula 08, em 08.3 (L2227) | 08.3: "O instrumento abaixo é o produto final deste módulo."; "andaime" aparece no §00.4, no §Voz, no §Final e no §Lex | explorador | **divergente** |

**Contagens.** São 11 instrumentos: **10 de aula e 1 fora de aula** (o INST·01, no §MAP). As Aulas 01 e 08 têm dois
cada. O código porta os 11; nenhum fica sem porte. O resultado é **4 portados e 7 divergentes**.

## Entradas, saídas e cenário-padrão

| Id | Entradas (fonte) | Saídas (fonte) | Cenário-padrão renderizado |
|---|---|---|---|
| 01 | vetor `tb-seg` (3 botões, padrão cap) × frente `tb-grid` (5 chips, padrão prot) | painéis `tb-lens` (Lente ativa) e `tb-item` (texto da célula + "Pergunta de verificação") | Capital · Protagonismo global |
| 02 | 4 campos (%): Renováveis na matriz elétrica 86,8 [0–100, 0,1]; Peso da eletricidade na energia total 19 [1–100, 0,5]; Renováveis fora da eletricidade 41 [0–100, 0,5]; Renováveis na matriz energética, valor oficial 50 [0–100, 0,5] | 4 leituras, veredito em 3 ramos (\|de\| ≤2 ok, ≤6 att, senão per), 3 barras | 49,7% · +37,1 p.p. · −0,3 p.p. contra o oficial · 16,5 p.p. dos 49,7 agregados · "Consistente." |
| 03 | `vf-grid` (8 números em circulação) | 4 cartões: Fonte provável, O que a grandeza mede, Erro típico de citação, O que verificar antes de repetir | "O Brasil é 88% renovável" |
| 04 | `rg-grid` (12 marcos com ano) + Anterior/Próximo (circular) | painel: ano · marco i de 12, nome, O que é, Estado em 2 de agosto de 2026, O que ainda falta | ago 2024 · marco 1 de 12 · Marco legal do hidrogênio |
| 05 | parceiro `cb-par` (4) × vetor `cb-vet` (3) | 4 cartões (Estrutura principal, Segundo elemento, Fricção ou ressalva, Leitura operacional) + veredito fixo com o nome do parceiro e do vetor | China pelo vetor capital |
| 06 | instrumento `rt-inst` (4) × classe `rt-prod` (6) | 4 leituras textuais (Autoridade, Prazo típico, Controle judicial, Reversibilidade), veredito (classe por regex Exposto/Isentad) + nota do instrumento | Petróleo e produtos energéticos sob poderes de emergência econômica · "Isentado." |
| 07 | 4 eixos × 3 (peso 0/1/2): fronteira, verificação, precursor, carbono doméstico | 4 leituras textuais + veredito em 4 ramos + 2 adendos (sc) | Não atribuível a produto · Fronteira do inventário · Alto — valor padrão provável · Indisponível — sem regime no país |
| 08 | 9 itens × 3 estados (0 ausente, 1 indicativo, 2 vinculante); 3 críticos (i1–i3) | Pontuação /18, Estágio (5 faixas), Itens vinculantes "n de 9", Bloqueios críticos, veredito em 6 ramos, "Item em foco" automático | 0/18 · Anúncio · 0 de 9 · 3 de 3 · "Os três itens críticos estão ausentes." |
| 09 | 4 campos: Reserva nacional 21 Mt [0,1–200]; Reserva mundial 85 Mt [1–500]; Produção nacional 0,02 kt/ano [0–500]; Produção mundial 390 kt/ano [1–5000] | 4 leituras (precisão variável `pc`), veredito em 7 ramos + adendo "anos de reserva", 2 barras | 24,7% · 0,0051% · 4.818× · 1.050.000 · "Assimetria extrema…" |
| 10 | `cn-grid` (12 tipos de entidade) | cartões Classificação, Onde pode aparecer, Substituição correta; veredito = status + porquê | Categoria 1 · "Padrão preferido." |
| 11 | `ad-nav` (8 movimentos: 00–03 Tese … 27–30 Fecho) | relógio "Minuto t · movimento i de 8", pergunta, Âncoras (lista de 3), Ponte para o movimento seguinte, Erro que faz a conversa voltar | Minuto 00–03 · movimento 1 de 8 |

- **Faixas.** Nos dois numéricos, o campo e o deslizador gêmeo têm **a mesma** faixa, o mesmo passo e o mesmo padrão.
  Não há o `|| 1` do M01.
- **`numOf`.** Um valor vazio ou NaN vira o padrão e só depois é preso à faixa.
- **Fórmulas exatas.** Ficam em `script.funcoes_verbatim`. Por exemplo, no INST·02:
  `w=pe/100; ag=w*el+(1-w)*ne; di=el-ag; de=ag-of; co=w*el`.
  No INST·09: `sr=rn/rm*100; sp=pn/pm*100; ra=sr/sp; anos=rn*1000/pn`.
- **Fonte dos números** (`p.srcnote`). É literal em 10 dos 11 instrumentos; o **INST·10 não tem srcnote**
  (`fonte_dos_numeros: null`).
  - Nenhum número foi verificado contra a fonte primária. Na interface, vale "cenário didático; fonte externa não
    declarada" (P19).
  - As faixas que o script trata como verdade entram no content QA (P20).
- **Tolerâncias.** `null` em todos: a fonte não declara tolerância, gabarito nem previsão (P6).
- **Pergunta.** `null` em todos: a fonte não declara pergunta própria de instrumento. As três "Pergunta de verificação"
  do INST·01 são saída, uma por vetor.

## Portado × código

**Portados (4).**
- **02 e 09.** Perda zero de texto e números iguais em todos os casos da grade. No 09, o código acrescenta ao
  veredito "Participação na reserva: … · na produção: …" (recomposição dos rótulos das barras).
- **04.** Perda zero; o seletor ganhou o id `rd-sel` e o rótulo "Marco em foco", que a fonte não tem.
- **05.** Idêntico por palavra nos 12 casos.

**Divergentes (7), por gravidade.**

| Id | Gravidade | O que diverge |
|---|---|---|
| 08 | **alta** | O veredito é texto **novo**: "Anúncio, não projeto.", "…com N bloqueios críticos. Ausentes: …", "Nenhum item crítico em zero…". Os 6 ramos da fonte não estão no código, e a cobertura mínima é 21,8% (média 45,4%). O campo `mp-sel` ("Item em foco") **não existe na fonte**, que escolhe o item em foco sozinha (primeiro crítico não vinculante com nota; senão o primeiro não vinculante com nota; senão i9). O texto "Item sem nota na fonte." é invenção. |
| 07 | **alta** | Só o ramo `sf===0` é literal. "Dado defensável.", "Posição parcial. Há base, mas com lacuna identificável…" e "Posição frágil. A combinação informada…" são texto **novo**; os ramos da fonte ("Posição defensável. Fronteira de produto declarada…", "Posição parcial. O dado existe e é atribuível…", "Posição frágil. A fronteira é de produto…") e os **dois adendos** sobre o desconto de carbono doméstico foram perdidos. A cobertura mínima é 25,4%. O código ainda acrescenta `valores['pc-base']`, que a fonte não exibe. |
| 11 | média | As âncoras entram por interpolação de array: `${m.anc}` gera as 3 âncoras **coladas por vírgula** (8/8 casos), sem a lista `ul.and-anc`. Os rótulos foram trocados: "Ponte para o movimento seguinte" virou "A ponte para o próximo" e "Erro que faz a conversa voltar" virou "O que NÃO dizer aqui" ("aqui" não existe na fonte). O relógio perdeu o "Minuto t": o código escreve "‹rótulo› — movimento i de 8" (ex.: "Tese — movimento 1 de 8"), e o rótulo "A pergunta que o governa" não existe na fonte. |
| 10 | média | Os rótulos "Classificação", "Onde pode aparecer" e "Substituição correta" viraram "Onde aparece", "Substituição recomendada" e "Por quê" (palavras novas). O rótulo do seletor passou de "Entidade encontrada em pesquisa" para "Entidade encontrada". |
| 01 | baixa | Perdidos "Lente ativa" e o cabeçalho "Capital · Protagonismo global". O rótulo "Frente do bloco" virou "Frente", e o id `tb-grid` virou `tb-frente`. |
| 06 | baixa | Perdido só o rótulo "Instrumento" do painel de nota. As 4 leituras textuais vão para o veredito, não para `outputs`. |
| 03 | baixa | O rótulo "Número em circulação" virou "Número em verificação", e o id `vf-grid` virou `vn-sel`. O título do número entra como cabeçalho do veredito (recomposição). |

**Dados.** Os literais de dado são **idênticos** aos `MODULO_12_*` nos 9 instrumentos que os têm: FRENTES, LENTES, N,
M, C, I, P, FR/VR/PR/CD, IT, E, CAT e M(11).

**Notas.** Em 02, 04 e 06, a `note` do código é intro + disc com espaço antes da pontuação, onde a fonte tinha
`<b>`/`<em>`.

**Kind.** Nas escolhas do código, os instrumentos se dividem em explorador 5, calculadora 2, comparador 1 e
quebra-cabeca 3. O 06 (roteador, sem pontuação) ficou como quebra-cabeca. Pela taxonomia, a mecânica dele é
seleção × seleção → texto, a mesma de um comparador ou explorador. Isso fica registrado para a FOUNDRY, sem mudança
aqui.

## Contradições da fonte registradas

- **Número de campos do INST·02.** A intro diz "Os três campos abaixo", mas há 4 campos (div-m-09).
- **Seis categorias × classe 0.** A taxonomia tem "seis categorias", e o INST·10 tem uma classe 0 "Fora da restrição"
  (div-m-13).
- **Contagens anunciadas.** Todas conferem com o script: INST·01 "Quinze combinações" (3×5), INST·05 "Doze
  cruzamentos" (4×3), INST·06 "Vinte e quatro combinações" (4×6), INST·07 "oitenta e uma combinações" (3⁴) e INST·08
  "de 0 a 18" (9×2).

## Verificação

Verificador adversarial independente (2026-09-17), com script próprio, sem reaproveitar o `m12_verify.mjs`.

- **Quiz, 100%.** O literal `var Q` (L3941–4012) foi avaliado de novo. Enunciado, 4 alternativas, gabarito e
  explicação são **idênticos** nas 10 questões. O gabarito confere: c a d b d a b c a d.
- **Checklist, 100%.** Os 28 `li` de `ul.ck` conferem com `html`, `texto` e negrito (itens 1 e 28).
- **Erros, referências e glossário, 100%.** Os 20 erros, as 34 referências (rótulo, título, URL e texto do link) e os
  152 termos (termo e definição) conferem.
- **Exercícios, 100%.** Os 14 conferem: summary, 8 enunciados, resposta-modelo inteira e os 6 sem enunciado com
  `null`.
- **Fórmulas, 100%.** As 13 `funcoes_verbatim` dos instrumentos são substring **exata** do script, nas linhas
  declaradas. As 24 condições e expressões de ramo conferem depois de colapsar o espaço.
- **Amostra geral.** 1.664 strings de conteúdo com mais de 25 caracteres, nos três JSONs, conferidas contra a fonte.
  Não houve falha em campo de conteúdo. Os 30 não casamentos são campos de contexto: nome de gravura do código, id de
  glossário, `mensagem_ref`, `trecho` de menção cortado no meio de tag e `texto_literal_concatenado` com "…".
- **Origens.** As 519 origens foram conferidas pelo `trecho_inicial`, com tolerância de ±3 linhas. Nenhuma ficou
  fora.
- **Contagens recontadas no HTML (grep/regex próprios).** Todas conferem: 18 `section`, 8 `Aula NN`, 11 `div.inst`,
  22 `details` (14 do §Ex e 8 do §Lex), 8 "Enunciado.", 152 `span.term` (19/20/20/19/18/19/19/18), 6 `div.fi`, 24
  `div.box` (9 gd, 6 rd e 9 cy), 28 itens de checklist, 20 erros, 34 referências, 10 questões × 4, 10 `srcnote` (o
  INST·10 não tem), 3 "Pergunta de verificação" (uma por lente), 12 homônimos no glossário do código e 0 `gl-m12`.
  A única contagem errada foi a de links encurtados (ver abaixo).

**Neste grupo, nenhuma correção.**
- **Fórmulas e ramos.** Conferem.
- **Pontos no código.** Foram confirmados à parte em `alexandria-instrument-calculators.ts`: "Dado defensável." (07),
  "Anúncio, não projeto." e "Item sem nota na fonte." (08), `mp-sel`, e "A ponte para o próximo" / "O que NÃO dizer
  aqui" (11). Nenhum deles existe na fonte.
- **Nomes no catálogo (div-m-03).** O catálogo abrevia também o INST·11, sem ", sem repetição". A nota foi corrigida
  em `modulo.json`.

### Segunda verificação (2026-09-17)

Um segundo verificador adversarial conferiu tudo de novo, com scripts próprios em Python e Node.

- **Varredura completa.** Todas as 2.398 strings de conteúdo com mais de 12 caracteres, nos três JSONs, foram
  conferidas contra a fonte. As 77 que não casam são só de três tipos:
  - leituras descritivas de divergência;
  - saídas renderizadas do script (`cenario_padrao_renderizado`);
  - rótulos do lado do código.
- **Números do cenário-padrão.** Foram recalculados à mão: INST·02 dá 49,7 · +37,1 · −0,3 · 16,5, e INST·09 dá
  24,7% · 0,0051% · 4.818× · 1.050.000.
- **Origens.** As 519 conferem (±3 linhas).
- **Conferência integral.** Quiz (10 × 4, gabarito c a d b d a b c a d, linhas), checklist (28), erros (20),
  referências (34), termos (152), exercícios (14) e as 13 funções e 24 ramos dos instrumentos conferem.
- **Contagens recontadas.** Todas as contagens declaradas conferem, entre elas:
  - 7 referências com data de mês no título;
  - 5 perguntas do caso (4 `li` mais o "quinto item" em prosa);
  - lead 3/8 exato e 8/8 depois de normalizar;
  - 12 homônimos.
- **Divergências.** Foram rechecadas contra a fonte, o código e o catálogo. Nenhuma é inventada.
- **Falhas de literalidade.** Três leituras com cara de citação estavam parafraseadas ou repetidas e foram corrigidas
  nos extratores. Depois disso, os quatro extratores rodaram de novo.

**Correção neste grupo (só no `.md`):**
- **INST·11.** A frase "O relógio … foi perdido" estava imprecisa. O código mantém "movimento i de 8" e troca "Minuto
  t" pelo rótulo do movimento, e o JSON já registrava a perda como "minuto×8, movimento×8". A tabela de divergentes
  foi ajustada.
