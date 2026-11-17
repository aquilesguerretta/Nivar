# Peça B · Rodada 2 — os três territórios explicados, e o destino sem dado falso

Brief-base: [`piece-B.md`](piece-B.md). Contrato: [`../bar.md`](../bar.md) §3, S1–S7, §6, §7, P18, P22, P24, P25.

## Resultado da r01

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | FAIL | B1: só o território atual comunica visão de mundo, perguntas, capacidades e campo. Em T2 e T3, a contagem chega no lugar do entendimento |
| System | FAIL | §6 dado falso: o filmstrip nó → módulo aterrissa numa página que diz "9 de 9 concluídas" enquanto o mapa diz "7 de 9 percorridas" (mesmo estado E2). Também: título de conteúdo em caixa alta total na página de módulo |
| Craft | **PASS** | Gap nomeado: as seis plaquetas se empilham na mesma mancha de terreno em volta do nó atual, cobrindo o trecho percorrido e os glifos que elas nomeiam |

**Pares cegos:** vitória em 6 de 7 pares (o único perdido é o par 3, em que a candidata era a tela antiga do mapa
julgada contra o nosso próprio render — leia o mapeamento). Contra o painel Trilhas do North Star, contra a baseline
e no celular: vitória clara.

## Correções desta rodada

1. **B1 — os três territórios comunicam antes de contar.**
   - Em E0, E1, E2 e E2b, cada trilha (atual e não atual) mostra visão de mundo, 2–3 perguntas que responde, 3–5
     capacidades com verbo observável e o campo (os módulos reais), **antes** de qualquer contagem.
   - O território atual continua dominante (B2): a diferença é de escala e de palco, não de conteúdo ausente.
   - As trilhas não atuais podem abrir por disclosure, desde que:
     - o estado fechado já traga visão de mundo e pelo menos uma pergunta;
     - a abertura seja alcançável por teclado;
     - haja `data-capture="abrir-trilha-II"` e `-III` para o filmstrip de expansão exigido pela verificação de B1.
   - Capacidades e perguntas são da camada Alexandria, derivadas da fonte (P3/P11), marcadas no dado.
2. **§6 — o destino da ação não pode contradizer o mapa.**
   - A página de módulo (`ModuloAulaList`, rota da Peça C) ainda usa progresso de mentira.
   - **Autorizado nesta rodada, e só isto:** trocar a fonte de dado dessa rota para o registro real (`useEstudo` /
     `getMyProgress`), e corrigir o título de conteúdo em caixa alta total.
   - **Não redesenhe** a página: o redesenho é da Peça C1.
   - Depois da troca, o mesmo estado precisa mostrar o mesmo número na Home, no mapa e no módulo.
3. **Craft — a mancha de plaquetas em volta do nó atual.**
   - Distribua por prioridade:
     - o selo "você está aqui" ganha forma cartográfica própria (cartucho ou filactério com fio, distinto das
       plaquetas de marco);
     - os marcos do módulo atual podem virar uma pilha compacta única ou sair para a borda com fio-guia;
     - nada cobre o trecho percorrido nem os glifos que nomeia.
   - Verifique medindo sobreposição em E0, E1, E2, E2b × 390, 768, 1280, 1440, 1920 e 3440.
4. **Faixas de T2/T3 (par 2 dos juízes):** não podem ler como "quase-tabela" com o botão repetido. Mantêm registro de
   carta (fragmento da prancha, emblema, estado).

## Verificação

- Acrescente ao plano `captures/B/plans/piece-B.json`: filmstrip `trilhas-E2-1440-expandir` (clica
  `[data-capture="abrir-trilha-II"]` e depois `-III`) e `trilhas-E0-1440-expandir`.
- `npx tsc -b` limpo, `gridalpha-detect` 0 P0.
- Captura em `captures/B/r02` com `--closing`.
- `legend.json`: sem transbordo, `minFontPx` ≥ 11 nas rotas da peça, `truncatedText` do shell vazio, `smallTargets`
  vazio, mídia com classe, nenhum "GridAlpha".
- No filmstrip nó → módulo, o número do módulo bate com o do mapa.
