# Peça B — Territórios: Trilhas + mapa da Trilha I (brief-base)

**Régua:** [`../bar.md`](../bar.md) v1.1: §3 (B1–B6), S1–S7, §6, §7, e decisões P13, P16, P18, P24 e P25.

**Herança:** a Peça A fixou shell, header, localizador, nav mobile, busca, tokens v2, papel real e o globo do
currículo. A Peça B usa tudo isso e não redesenha o shell.

## Trabalho

Com a Peça B, o learner escolhe e entende territórios intelectuais e vê onde está neles.
- `/alexandria/trilhas`: as três trilhas como territórios.
- `/alexandria/trilha/trilha-fundamentos-universais`: mapa da Trilha I com posição, marcos e continuidade nó → módulo.

**Além do conceito:**
- o território atual contém o trecho do mapa com "você está aqui";
- o mapa mostra marcos reais (laboratório, caso, avaliação, e o lugar da experiência jogável "em desenho", P25).

## Estado atual medido (o que muda)

- **`TrilhasHub.tsx`:** três painéis congruentes e contagens como protagonistas ("42 aulas confirmadas · 29%").
- **Progresso de mentira:** `estadosDaTrilha` (`AlexandriaRouter.tsx`) e o mock de progresso fazem a página de
  trilha dizer "M01 Concluído · M02 Aula 4 de 10" com a fixture E2, enquanto a Home diz M01·A08 em leitura.
  **Gate de dado falso:** o progresso passa a vir do registro real (`useEstudo`, `getMyProgress`), igual à Home.
- **`CaminhoExpedicao.tsx`:** coluna de nós de 46px em zigue-zague fixo, trecho percorrido igual ao por vir, sem
  "você está aqui" e com "comece aqui" em todos os nós.
- **Títulos de conteúdo em caixa alta total e textura quadriculada** (apontado pelo System critic r03).

## Direção (imagem primeiro, como na Peça A)

- **Caráter de cada território (B1).** Cada trilha tem uma prancha própria, gravura ou imagem real, e um emblema,
  sem texto na arte. Insumos:
  - imagens reais aprovadas em [`../media-lab/fontes-reais/trilhas-territorios/`](../media-lab/fontes-reais/) e
    `brasil-sistema-eletrico/` (catálogo em `../media-lab/fontes-reais/CATALOGO.md`);
  - Higgsfield e Blender quando não houver imagem real boa.
  - Com os títulos cobertos, as trilhas precisam continuar distinguíveis.
- **Visão de mundo antes das contagens.** Cada trilha mostra:
  - perguntas que responde;
  - capacidades com verbo observável, derivadas da fonte (camada Alexandria, P3/P11);
  - os módulos reais.
  - Contagens ficam numa linha de aparato.
- **A trilha atual domina por mais que o botão (B2).** Em E2, capturada em cinza, a trilha atual é a região
  dominante. Em E2b, é a Trilha II. Em E0, o ponto de partida fica claro.
- **O mapa é território ocupado (B3).** A Trilha I aparece como território cartográfico com os 5 módulos como
  lugares:
  - mesma linguagem do globo: ilha I, estações, estrada;
  - pode ser a própria ilha I do globo em projeção plana, derivada da geometria do Blender
    (`../media-lab/A-r03|A-r04/globo/textura/geometria.json`);
  - exatamente um "você está aqui";
  - percorrido × por vir distinguíveis sem cor;
  - nó atual ≈ 1,5× o comum;
  - rótulos ≈ 15px;
  - nenhuma coluna com recuos decorativos.
- **Marcos de tipo (B4).**
  - Aula, laboratório, caso, avaliação e experiência jogável têm silhueta própria e rótulo honesto.
  - "Experiência jogável em desenho" é uma linha de metadado, sem aparência de controle e sem destino (P25).
  - M08 é "Exercício de decisão" (P4).
  - Nenhum marco leva a página vazia.
- **Continuidade nó → módulo (B5).** Código e título legíveis em todos os quadros; "Voltar" retorna ao mesmo nó e à
  mesma rolagem. Usar o sistema de movimento de `../estudos/movimento-e-conquistas/sistema-de-movimento.md` quando
  existir (sem bounce nem overshoot; movimento reduzido chega ao mesmo estado).
- **390 e 768 (B6).**
  - Alternância "Mapa | Sumário" com os mesmos objetos, ou eixo vertical.
  - Nada depende de hover.
  - O nó atual é alcançável sem rolagem longa.

## Dados e verdade

- **Progresso:** só o registro real, igual ao da Home. Nada de `alexandria-progress-mock.ts` nas rotas desta peça.
- **Vocabulário (P18):** "Concluído" só quando todas as aulas do módulo estão concluídas no registro; nunca
  "Aprovado" ou "Dominado".
- **Títulos (P24):** do catálogo canônico (`alexandria-curriculo.ts`, `alexandria-trilhas.ts`).
- **Contagens (P22):** derivadas das coleções.
- **Marcos:** vêm do conteúdo existente (instrumentos, laboratório, caso, quiz extraídos em `../extraction/`).
  Ausência é declarada (S4).

## Posse

- **CRIAR/MODIFICAR:**
  - `src/components/alexandria/navigation/*` (TrilhasHub, CaminhoExpedicao, TrilhaCard, ModuloNode; podem ser
    substituídos);
  - componentes novos em `src/components/alexandria/trilhas/`;
  - as rotas `HubRoute` e `TrilhaRoute` de `AlexandriaRouter.tsx` e o que for preciso para tirar
    `estadosDaTrilha`/mock dessas rotas;
  - `public/alexandria/v2/trilhas/`;
  - `docs/alexandria-v2/media-lab/B-rNN/`;
  - `docs/alexandria-v2/media-provenance.md`.
- **SOMENTE LEITURA:** shell (a não ser por bug com registro); `src/components/alexandria/home/*` (reuse
  `estudo.ts`/`useEstudo` por import); `src/lib/data/*`; `src/lib/progress/*`; `docs/alexandria-v2/extraction/`.
- **NUNCA MODIFICAR:** `index.html`, `src/main.tsx`, `app/`, a rota da aula e a do módulo (Peça C), `ModuloAulaList`
  (Peça C1). O clique do nó abre a rota de módulo existente.

## Verificação

- `npx tsc -b` limpo e `gridalpha-detect` com 0 P0.
- Captura: `node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/B/plans/piece-B.json --out docs/alexandria-v2/captures/B/rNN`.
- **Olhe os PNGs.** Na `legend.json`:
  - `horizontalOverflow` false;
  - `minFontPx` ≥ 11;
  - `truncatedText` vazio no shell;
  - `smallTargets` vazio;
  - `media` com classe.
