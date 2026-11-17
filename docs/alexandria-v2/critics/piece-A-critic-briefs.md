# Critics — Peça A · Entrada (Home + identidade + navegação global)

Três critics de contexto limpo por rodada. Nenhum lê código, raciocínio do builder, lista de correções ou resultado
de teste. Cada um recebe só:
- os **renders** da rodada (PNGs + `legend.json`, com estado, viewport, fixture e medições);
- as seções do [`bar.md`](../bar.md) que lhe cabem.

**Veredito binário:** PASS ou FAIL, mais **a maior lacuna** (uma só). Critics são duros; elogio não ajuda.

Vale para os três:
- **Gates decidem.** Heurística quebrada só reprova se o resultado não ficou claramente mais forte.
- **Estados ≠ E0 vêm de fixture de rede do harness.** Isso é declarado; não é dado real e não é defeito do produto.
  Defeito é o produto **mostrar** número pessoal em E0, ou mostrar algo que nenhuma fonte sustenta.
- **Referências `parc`/`bloq`** não são UI observada. Não invente como elas se parecem.

## Brief critic — "a tela cumpre o trabalho?"

**Julga:** S1, S3, A1–A4, o teste anti-LMS (§0) e a linha "Além do conceito" da Peça A.

**Perguntas:**
- Só com o texto visível do 1º viewport (1440 e 390), em E0 e em E2, dá para responder: o que é a Alexandria, por
  que importa, onde parei e o que faço agora? E, até o 2º viewport, o que mais posso explorar?
- Existe **exatamente uma** ação principal inequívoca, com rótulo que nomeia objeto e motivo e destino de estudo real?
- O objeto-mundo **trabalha**? Mostra os territórios e a posição do learner, e a posição bate com a retomada?
- O progresso separa evidência (Percorrido · Praticado · Demonstrado) de motivação? Algum número finge competência?
  Algum percentual aparece sem escopo?
- Atlas, Glossário e Biblioteca aparecem sem virar quatro destinos equivalentes? Os ganchos se ligam ao ponto atual?
- Teste anti-LMS: há pelo menos 3 marcadores próprios (§0)? Dá para re-skinnar a tela como um LMS qualquer?

**Ignore o gosto estético**, a não ser que ele impeça o trabalho.

## System critic — "o sistema foi respeitado?"

**Julga:** S2, S4–S7, A5–A6, hard gates globais (§6), contrato de mídia (§7).

**Materiais extras:**
- `captures/token-swatches.png`: amostras dos tokens;
- `legend.json`: `horizontalOverflow`, `minFontPx`, `overflowingElements`, `media`, `consoleErrors`.

**Checar:**

| Tema | O que verificar |
|---|---|
| Forma | Raio 0 fora de círculo; zero sombra, gradiente, vidro |
| Cor | Casa com os tokens; nenhum semáforo; terracota rara; ouro só sobre navy |
| Tipografia | Vozes (identidade em caixa alta espaçada; títulos de conteúdo em caixa alta e baixa); ≤ 2 famílias; texto ≥ 11px |
| Contraste e foco | Contraste suficiente; foco visível no filmstrip de Tab |
| Localização | Nenhuma sidebar permanente; header cumpre as 6 funções de S5; localizador fora da Home, que sobrevive à rolagem |
| Busca | Se aparece, busca de verdade (há captura com resultados) |
| Mobile | 390 sem rolagem horizontal; nav sem corte; ação principal no 1º viewport |
| Mídia | Toda imagem mostra a própria classe; nada gerado finge ser documental |
| Linguagem e dados | Nenhuma linguagem interna, controle inerte ou mock apresentado como real |
| Contaminação | Nada de NIVAR G2, Portal ou Terminal (§6) |
| Gênero | Não lê como museu, sebo, hotel histórico, portal universitário, fantasia ou tema grego |
| Tique de interface genérica | Nenhum elemento passa no teste do recorte-e-cola (pílula de atalho tipo "Ctrl K", card com faixa de acento e botão cheio, avatar de aplicativo, chip de estado, ícone de biblioteca padrão). Lista viva em [`../briefs/varredura-anti-ia.md`](../briefs/varredura-anti-ia.md) |

## Craft critic — "está autoral, ou gerado?"

**Julga:** composição e identidade de A1–A2, a marca (A5) e a qualidade de mídia (§7 M7).

**Método (cego):**
- Recebe pares de imagens rotuladas só como **X** e **Y**, sem dizer qual é o render em julgamento.
- Para cada par: qual é mais forte como entrada de um produto educacional autoral, e por quê, em termos observáveis
  (hierarquia, composição, detalhe, ritmo, presença, identidade).
- Depois do mapeamento revelado: veredito e **a maior lacuna** do render em julgamento.

**Pares:**
1. Render × North Star aprovado. O North Star é piso, não teto: PASS exige que o render seja **igual ou mais forte**
   em presença e identidade, sem copiar a composição.
2. Render × Atlas atual (a referência interna de craft mais forte).
3. Render × linha de base r00 (a Home atual). O render precisa ser claramente mais forte.

**Checar ainda:**
- O render parece autoral ou gerado?
- Se fosse re-skinnado, venderia como LMS genérico?
- Em 390, é composição própria ou desktop espremido?
- O objeto-mundo tem presença de atlas **e** função?
