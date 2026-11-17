# Brief — Peça A · Entrada (Home + identidade + navegação global)

**Wave:** `wave/alexandria-v2-restructure`
**Worktree:** `C:\dev\gridalpha-v2-alexandria-v2-restructure`
**Agente:** LYCEUM, dono da Alexandria.

**Régua:** [`../bar.md`](../bar.md) v1.1, aprovado pelo Founder. Nesta peça valem:
- os gates de **S1–S7** e **A1–A6**;
- os hard gates globais (§6);
- o contrato de mídia (§7).

As heurísticas orientam. Podem ser quebradas quando o render ficar claramente mais forte; nesse caso, diga qual foi
quebrada e por quê.

## O que construir

A primeira impressão da Alexandria v2 é um **atlas vivo do conhecimento em energia**: caráter de atlas científico,
publicação técnica e caderno de campo, com comportamento de produto contemporâneo. Pode parecer antiga; nunca
desatualizada. **Se a Home puder ser re-skinned e vendida como LMS genérico, falhou.**

### 1. Shell global
- **Sidebars.**
  - Remover a gaveta direita (`RailRight`/`RailToggle`), porque é alimentada por mock e tem placeholders.
  - Remover a coluna esquerda permanente (`RailLeft`).
  - Nenhuma sidebar permanente (S5). Gaveta temporária só com gatilho rotulado, fechada no início e sem placeholder.
- **Header.** Cumpre as seis funções de S5; ordem e comportamento ficam com você.
  1. Identidade.
  2. Navegação global: Trilhas, Atlas, Glossário, Biblioteca.
  3. Localização atual.
  4. Busca, **só se for real**.
  5. Conta e progresso: "Entrar" em E0; com sessão, uma entrada rotulada para Progresso (`/alexandria/perfil`).
  6. Transformação mobile forte.
- **Localizador (breadcrumb).** Em toda rota fora da Home, com nomes iguais ao dado. O item atual não é link. A
  localização sobrevive à rolagem, mesmo que o header recolha.
- **Busca real (recomendada).**
  - Índice no cliente com: aulas (código, título, subtítulo), módulos, trilhas e verbetes do glossário.
  - Resultados tipados com destino real.
  - Diálogo acessível: foco preso, Esc fecha, setas navegam.
  - Se não der para fazer bem, **não mostre campo de busca** (S5, §6 "controle inerte").
- **Rodapé.**
  - Sem inventário ("17 de 17 módulos verificados").
  - Sem texto < 11px.
  - Links consistentes com o header (mesmo rótulo, mesma URL).
- **Mobile a 390.**
  - Sem rolagem horizontal; nav nunca cortada.
  - Barra inferior com até 5 itens rotulados **ou** sumário em tela cheia; escolha você.
- **Não mexer** no conteúdo das páginas de Trilha, Módulo, Aula, Glossário, Biblioteca, Perfil e Atlas: são as peças
  B, C e D. Mas elas continuam renderizando dentro do novo shell, sem rails e sem quebrar.

### 2. Home (`AlexandriaHome`)

Responde, só com texto visível: o que é a Alexandria, por que importa, onde parei, o que faço agora e o que mais
explorar (A1). Não reaproveite o `TrilhasHub` na Home.

- **Tese.**
  - Eyebrow + H1 de identidade (até 3 linhas) + lede (até 3 linhas): o que é, para quem, por que importa.
  - Nenhuma contagem de aulas, módulos ou verbetes como protagonista.
- **Objeto-mundo (A2).**
  - Mostra os **três territórios** (I Fundamentos Universais · II Setor Elétrico Brasileiro · III Especialização
    Estratégica) e a **posição real do learner**: "você está aqui: Trilha N" em E2/E3; "ponto de partida: Trilha I"
    em E0/E1.
  - É **Explicação** (`data-media-class="explicacao"`), com o trabalho rotulado ("orientar") e fonte ("Fonte: seu
    registro de estudo"; em E0, algo honesto como "Fonte: currículo Alexandria").
  - Pode ser programático (SVG cartográfico).
  - A régua de presença é a composição Titã + globo do North Star, mas ela **não é requisito**: supere-a.
  - Figura ou gravura nunca cobre territórios, rótulos ou posição.
- **Retomada (A3).**
  - E2/E3: "Onde você parou", com código, título, módulo, trilha, estado e motivo, mais a **única ação principal**
    ("Continuar · M01·A08 — 100 MW solar ≠ 100 MW térmica."), destino direto para a aula.
  - E0/E1: "Por onde começar · M01·A01 — Energia é volume. Potência é velocidade.".
  - Dados reais: `getMyProgress()` e `getAulaStatus()` de `src/lib/progress/progressApi.ts`, só com sessão
    (`useAuth`). Títulos via `getAula()` e `ALEXANDRIA_MODULES`/`ALEXANDRIA_TRILHAS`.
- **Progresso (S3, A4).** Duas camadas separadas:
  - **Evidência**, em linhas tipográficas quietas:
    - "Percorrido: N de 42 aulas da Trilha I" (escopo explícito);
    - "Praticado: ainda não medido" (eventos de prática ainda não são emitidos; §9);
    - "Demonstrado: ainda não avaliado".
  - **Motivação**, menor e abaixo da evidência: sequência de dias, a partir do campo real `streak`.
  - Nenhum XP, nenhum donut, nenhuma % sem escopo. Em E0, nenhum número pessoal.
- **Portais (A4).** Desiguais e ligados ao ponto atual:
  - **Trilhas:** o maior; fragmento do território atual com a posição, mais link para as três trilhas.
  - **Atlas:** a única imagem geográfica. Sugestão: globo ortográfico estático em SVG com `d3-geo` sobre
    `public/alexandria/geo/world-110m.json` (Natural Earth 1:110m), classe Explicação, "Fonte: Natural Earth 1:110m".
    Nada de WebGL na Home.
  - **Glossário:** linha sobre fio ligada ao ponto atual. Ex.: "38 termos do Módulo 01" via `ALEXANDRIA_GLOSSARIO`,
    com exemplos reais.
  - **Biblioteca:** linha sobre fio ligada ao ponto atual. Ex.: "8 fontes usadas no Módulo 01", contagem real da
    `BibliotecaView`, ou um derivado honesto.
  - Nenhum par de portais congruente; nenhum portal com ação preenchida.
- **Remover da Home:** o mock `MOCK_USER_PROGRESS` e todo texto interno ou desatualizado ("outros catorze estão em
  produção", "aulas confirmadas" etc.).

### 3. Identidade
- **Marca.** Pode ser redesenhada (§10 X2): wordmark e marca-bússola/estrela como **SVG** próprio, em vez do PNG de
  52px com subtítulo de 8px.
  - Legível a 24px; símbolo distinto a 16px.
  - Nunca escudo, brasão, louro ou cartela.
  - Nunca a marca NIVAR.
- **Vozes (S2).**
  - Identidade e nav: caixa alta espaçada.
  - Títulos de conteúdo: serifa em caixa alta e baixa.
  - Leitura: 16–18px, 60–72 caracteres por linha.
  - Aparato: algarismos tabulares, unidade, pt-BR.
  - No máximo 2 famílias de texto. A face pode ser explorada (X1), mas Cinzel + Lora são o ponto de partida.
- **Materialidade.**
  - Raio 0 (exceto círculo pleno); zero sombra, gradiente ou vidro; fio de 1px.
  - Cor não neutra só dos tokens (`src/design/alexandria-tokens.ts`); não trocar pergaminho, navy nem tinta.
  - Terracota rara; ouro só sobre navy.
- **Contenção.**
  - Nenhum ornamento clássico.
  - Citação rara, com autor e obra.
  - Nenhuma coluna de lemas latinos.

## North Star aprovado (descrição textual; o arquivo será salvo em `docs/alexandria-v2/north-star/`)

A imagem aprovada mostra 4 telas. Da **Home**, preservar os mecanismos, não o layout:
- header em pergaminho com fio fino; marca de estrela-bússola de 8 pontas + wordmark "ALEXANDRIA" em serifa espaçada;
- nav em versalete; busca circular; inicial do usuário;
- hero com eyebrow, H1 de 3 linhas, lede dizendo o que é e **um** botão navy preenchido ("CONTINUAR ESTUDO →");
- bloco "ONDE VOCÊ PAROU" com miniatura, título da aula, módulo, progresso e botão de seta;
- metade direita: gravura grande de um **titã sustentando um globo** navy (objeto dominante), rosas-dos-ventos e
  linhas cartográficas esmaecidas;
- faixa navy inferior com uma frase.

**Não copiar:**
- a coluna de lemas latinos;
- o excesso de citações;
- a barra 62% sem escopo;
- a miniatura fotográfica sem classe;
- a ausência de portais para Atlas, Glossário e Biblioteca;
- o globo que não trabalha, porque não mostra territórios nem posição.

**Ir além:** o objeto-mundo mostra os territórios e onde o learner está; os portais mudam com o ponto de estudo.

## Verdade dos dados (inegociável)
- Nenhum mock apresentado como real. Nenhum número pessoal em E0.
- **Estados de learner.** Vêm de `/api/auth/me` e `/api/progress/*`. Nas capturas, o harness responde essas rotas com
  fixtures declaradas (`tools/alexandria-capture/fixtures.mjs`). **Não** criar fixtures no código de produto; o
  produto chama a API real.
- **Requisito v2 ainda inexistente** (ex.: estado "a revisar", eventos de prática): mostrar estado honesto em palavras
  (S4, "ainda não disponível" / "ainda não medido"). Nunca fingir o dado.
- **Mídia gerada (Higgsfield)** é permitida se a peça precisar de verdade. Antes de gerar:
  - consultar o catálogo atual;
  - justificar o modelo;
  - iterar sem cota;
  - registrar em `docs/alexandria-v2/media-provenance.md` (§7).

  Imagem gerada nunca nomeia lugar real. Na primeira rodada, prefira programático.

## Fronteiras de posse

**CRIAR/MODIFICAR**
- `src/components/alexandria/shell/*`
- `src/components/alexandria/landing/*`
- `src/components/alexandria/home/*` (novo)
- `src/components/alexandria/busca/*` (novo, se fizer a busca)
- `src/pages/alexandria/AlexandriaHome.tsx`
- `src/pages/alexandria/AlexandriaRouter.tsx`: só para desligar os slots de rail (mock) e o `RailLeft`, e ligar o
  localizador; não redesenhar as páginas B, C e D
- `src/design/alexandria-tokens.ts`: só aditivo (novos tokens); não alterar valores da paleta-base
- `public/alexandria/marca/*`: novos SVGs
- `docs/alexandria-v2/**`

**SOMENTE LEITURA**
- `src/lib/data/*`, `src/lib/progress/*`, `src/lib/auth/*`, `src/lib/types/*`
- `docs/alexandria-v2/bar.md`
- `AGENTS.md`
- `tools/alexandria-capture/*` (use, não reescreva)

**NUNCA MODIFICAR**
- `app/`, `src/main.tsx`, `src/index.css`
- `src/design/nivar/*`, `src/design/tokens.ts`
- `src/components/br/*`, `src/components/g2/*`, qualquer superfície fora da Alexandria
- `package.json`, `package-lock.json`, `vercel.json`, `vite.config.ts`
- outros worktrees

**Não commitar** `.claude/launch.json`. **Não fazer commit nenhum**: o orquestrador commita.

Sem Tailwind em layout: estilo inline com token (regra P0 `no-tailwind-on-layout`).

## Verificação (obrigatória antes de devolver)

O servidor já está rodando em `http://127.0.0.1:5311`, com HMR do worktree.

```
npx tsc -b
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src
node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/A/plans/piece-A.json --out docs/alexandria-v2/captures/A/rNN
```

- `tsc -b` sem erro.
- `gridalpha-detect` com 0 P0.
- O plano de captura exige estes seletores estáveis:
  - `data-capture="search-trigger"` e `data-capture="search-input"`, se houver busca;
  - `data-capture="nav-mais"` no gatilho do menu mobile.
- Abra e **olhe** os PNGs da sua captura antes de devolver. Na `legend.json`:
  - `horizontalOverflow` deve ser `false` a 390;
  - `minFontPx` deve ser ≥ 11;
  - nenhum erro de console do produto (o 401 de `/api/auth/me` em E0 é esperado).
