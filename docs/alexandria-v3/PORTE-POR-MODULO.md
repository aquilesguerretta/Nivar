# Porte de um módulo para o modelo de aula v3

Referência: o M01, que já está pronto. Uma sessão de porte leva um ou mais módulos (M02–M17) ao mesmo padrão. Leia
antes de começar:

- `AGENTS.md`;
- `docs/alexandria-v3/DECISOES-2026-11-15.md`, que vale como ordem;
- `docs/alexandria-v3/REGRA-DE-IMAGEM.md`;
- `docs/alexandria-v3/avaliacao-m01.md`;
- `docs/alexandria-v3/figuras-m01.md`;
- os comentários de cabeçalho de `src/components/alexandria/v3/aula/previsoes.ts` e de `src/lib/alexandria/figuras.ts`.

## Regra de fonte

Todo texto, número e exercício vem de `docs/alexandria-v2/extraction/mNN/` (e do HTML original em
`C:/dev/GridAlpha v2/Alexandria modulos/`, só leitura). Não há pesquisa externa para conteúdo. Onde a fonte não diz,
a saída é ausência declarada. Frase nova só como voz da Alexandria, rotulada, reorganizando o que a fonte já diz
(ver as decisões 7 e 8).

## O que fazer, por módulo

1. **Conferir o texto contra a fonte.**
   - Use `tools/alexandria-dados/verificar-porte-m01.mjs` como modelo e crie `tools/alexandria-dados/porte/verificar-porte-mNN.mjs`.
   - Corrija `src/lib/data/alexandria-modulo-NN-content.ts`: listas, fórmulas, painéis de três níveis e tabelas perdidas no porte antigo; dano tipográfico (Q13); troca de "GridAlpha" e do vocabulário interno (Q03); markup vence prosa (Q04).
   - Fórmula com índice ou expoente vai com `<sub>`/`<sup>`; a leitura v3 renderiza HTML no `eq`.
   - Meta: **0 falta, 0 órfão**.
2. **Avaliação.**
   - Os exercícios da fonte vão para a aula a que pertencem, mais os derivados, como no M01.
   - Também entram a prova (quiz 10×4 com faixas e critério literais) e o checklist.
   - Tudo em `src/lib/alexandria/avaliacao/mNN.dados.ts`, gerado por um script seu em `tools/alexandria-dados/avaliacao/` e conferido por um verificador com **0 falhas**.
   - Os derivados não precisam de revisão do Founder (ele delegou), mas precisam de resposta conferida no texto da aula.
3. **Instrumentos.**
   - Todo instrumento do módulo funciona e bate com o script da fonte.
   - Os 55 que faltam portar (M09 11, M13 11, M14 10, M16 11, M17 12) entram em `INSTRUMENTOS_MODULO_NN` no arquivo de conteúdo do módulo. A calculadora vai em `src/lib/data/calculadoras/mNN.ts`, e uma chave ali substitui a de mesmo id no arquivo grande. Consertos de Q05/Q07/D01–D03 entram do mesmo jeito.
   - Veredito verbatim (Q06). Os que faltam, você redige como voz da Alexandria (decisão 7).
4. **Previsão e véu.**
   - Para cada instrumento, uma `PrevisaoDoInstrumento` em `src/lib/alexandria/modulos-v3/mNN.ts` (`previsoes`), seguindo as regras do cabeçalho de `previsoes.ts`.
   - O cenário é o padrão do instrumento ou o da nota dele. Nada que entregue a resposta fica no DOM antes da previsão, nem texto de SVG.
5. **Figuras**, pela regra de imagem do Founder:
   - **Foto real** quando a coisa existe e pode ser fotografada, com licença conferida.
   - **Imagem gerada realista** (Higgsfield) quando precisa demonstrar algo que não se fotografa; a legenda declara que é gerada.
   - **Diagrama** comum de demonstração quando é dado ou relação. Diagramas são componentes SVG em `src/components/alexandria/v3/diagramas/mNN/`, só com tokens da v3, com eixo, unidade e "Fonte: Módulo NN, Aula NN, seção X" dentro da figura.
   - **Nenhuma gravura estética** dentro da aula.
   - Dado da figura em `modulos-v3/mNN.ts` (`figuras`, `trechos`, `diagramas`). Arquivos em `public/alexandria/v3/aulas/mNN/`.
   - Procedência em `docs/alexandria-v3/procedencia/mNN.md`. **Só entra imagem com `factual_review: aprovado`.** Imagem real pendente: confira a página da origem, a licença e o hash e aprove com data, ou não use.
6. **Ligar o módulo.** Quando as aulas estiverem verificadas no render, ponha `pronto: true` em `modulos-v3/mNN.ts`. O roteador passa a montar o módulo no modelo v3.
7. **Sem vídeo agora.** Nenhuma vídeo-aula é gerada nesta rodada (decisão do Founder, 15/11). `videos.ts` não é tocado.

## Posse: o que é seu e o que não é

**Seu (por módulo):**

- `src/lib/data/alexandria-modulo-NN-content.ts`
- `src/lib/alexandria/modulos-v3/mNN.ts`
- `src/lib/alexandria/avaliacao/mNN.dados.ts`
- `src/lib/data/calculadoras/mNN.ts`
- `src/components/alexandria/v3/diagramas/mNN/`
- `public/alexandria/v3/aulas/mNN/`
- `docs/alexandria-v3/procedencia/mNN.md`
- `tools/alexandria-dados/porte/` e `tools/alexandria-dados/avaliacao/` (arquivos novos com o número do módulo)
- `docs/alexandria-v3/porte/mNN.md` (relatório)

**Somente leitura:** todo o resto, em particular os componentes de `src/components/alexandria/v3/aula/`, os agregadores (`modulos-v3/index.ts`, `avaliacao/index.ts`, `calculadoras/index.ts`, `figuras.ts`, `previsoes.ts`), o arquivo grande de calculadoras, `alexandria-glossario.ts`, `media-provenance.md` e o roteador. Se um componente compartilhado precisar mudar (por exemplo, um tipo de instrumento que `InstrumentoV3` não renderiza), **pare e escreva o pedido** em `docs/alexandria-v3/porte/mNN.md`; a sessão coordenadora faz.

**Nunca:** a aba Atlas, Argos, Ariadne, `app/` fora do progresso da Alexandria e `.claude/launch.json`.

## Portões, a cada commit

- `npx tsc -b`: 0 erros.
- `node tools/gridalpha-detect/bin/gridalpha-detect.mjs src`: só o P0 de base (`atlas/PaisPerfil.tsx`).
- Seus verificadores: 0 falhas.
- **Render**, antes de `pronto: true`: cada aula do módulo a 1440 e a 390, claro e noturno, com e sem conta. Medir que não há imagem quebrada (`naturalWidth > 0`), rolagem lateral nem erro de console, e que o véu esconde o resultado antes da previsão (retângulos renderizados, não leitura de código). A raiz `.alx3` é quem rola. O modo noturno é o localStorage `alx3-modo`. O dev server desta árvore é `npm run dev -- --port <porta livre>`.

**Git:**

- Commits locais na branch do seu worktree, prefixo `lyceum:`.
- `git add` com caminho explícito, nunca `-A` nem `.`.
- `git diff --cached --stat` antes de cada commit.
- Nunca push, nunca merge. A sessão coordenadora junta as branches.

## O que o modelo de aula já suporta (atualizado em 15/11)

- **Vários instrumentos por aula** (`bb6e44b`). Cada um entra na sua âncora, com previsão e véu próprios. Com mais de um instrumento, o evento de previsão é `aula-NN-NN#previsao:<instrumentoId>`.
- **Exercícios do módulo e checklist** (`bb6e44b`). Na última aula, antes da prova, aparecem `EXERCICIOS_DO_MODULO` e `CHECKLISTS`.
- **Campo `kind: 'select'`** (`c95110d`). Vira um grupo de opções clicáveis.
- **Saída textual.** `ResultadoInstrumento.textos[id]` mostra a formatação verbatim da fonte e tem precedência na tela sobre `valores[id]`, que segue servindo à previsão.
- **Veredito e textos com HTML curto da fonte** (`<b>`, `<br>`). `vereditoPtBr: true` desliga a troca de ponto por vírgula.
- **Previsão por escolha.** `grandeza: { tipo: 'escolha', saida, opcoes: [{ valor, rotulo }] }`. O calculado é a saída `saida` no cenário (`textos` ou `valores`), casada com o `valor` ou o `rotulo` de uma opção. Explorador de consulta, sem cálculo que aponte uma opção, fica sem previsão, com registro.

## Onde entra o que a fonte não põe em aula

- **Instrumento do §MAP:** na Aula 01, rotulado com o nome que a própria fonte dá à seção ("O tabuleiro", "Painel setorial"…). "§MAP" é vocabulário interno e o auditor o bloqueia em texto visível.
- **Instrumento sem aula:** na aula cujo texto o invoca ou ensina a relação que ele calcula, por casamento mecânico. Quando casa com várias aulas, vai para a última delas. Sem casamento, vai para a última aula do módulo, depois da leitura. Registre cada vínculo.
- **Exercício solto da fonte:** a mesma regra (última aula que casar, "vínculo mecânico"). O que não casar fica em `EXERCICIOS_DO_MODULO`.
- **Toda aula tem exercício.** Onde a fonte não deixar nenhum, entram os derivados do texto da própria aula.
