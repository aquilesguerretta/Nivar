# Sessão de teste — estratégia para o Loop 2 (Perfil/Progresso, Glossário, Biblioteca)

**Pré-requisito do Founder:** "antes do Loop 2, estabelecer uma estratégia legítima de sessão/fixture. Não contornar a
autenticação nem inventar dados de learner."

## O que é permitido

1. **Fixture de rede, só no harness de captura** (`tools/alexandria-capture/`).
   - **Mecânica:** o Playwright intercepta as chamadas do **navegador de teste** a `/api/auth/me`, `/api/products/me`,
     `/api/progress/me`, `/api/progress/aulas/*` e `/api/progress/events`, e responde com o contrato real do
     backend (`docs/v2-backend-contract.md` e o router real).
   - **Onde vive o dado:** os usuários de teste são sintéticos e declarados (`tools/alexandria-capture/fixtures.mjs`:
     E0, E1, E2, E2b, E3, com e-mail `@fixture.invalid`).
   - **Declaração:** cada captura informa na `legend.json` qual fixture usou ("fixture de rede do harness, não é dado
     real").
   - **Isolamento:** o produto roda sem nenhuma alteração. Nenhum mock entra em `src/`, nenhuma flag de teste, nenhum
     atalho de login. O backend real não é tocado e nenhuma sessão real é criada.
   - **Coerência dos dados:** vêm só do contrato: IDs de aula reais do catálogo, datas relativas ao relógio fixo do
     harness e estados que um learner real poderia produzir com os eventos que existem.
2. **Conta de teste real em staging:** só se o Founder criar e entregar por canal próprio.
   - O agente não cria conta e não digita senha. Autenticação é ação do Founder.
   - Se houver essa conta, os eventos são semeados por uso real (abrir e concluir aulas), nunca por escrita direta no
     banco.

## O que é proibido

- Mock de progresso dentro do produto (o `alexandria-progress-mock.ts` legado sai quando as Peças B e D entrarem).
- Estado "logado" simulado no código do front, bypass de cookie ou token forjado.
- Número pessoal exibido em E0.
- Fixture que produza um estado impossível para o backend atual. Exemplos: XP persistido (não existe campo), "a
  revisar" (não existe evento) ou conquista concedida sem regra. Estados que dependem do §9 são julgados pelo estado
  honesto de ausência.

## Estados para o Perfil/Progresso (D1, D2)

| Estado | Conteúdo | Uso |
|---|---|---|
| E0 | Sem sessão (`/api/auth/me` → 401) | O Perfil pede entrada e não mostra nada pessoal |
| E1 | Conta sem eventos | Estados vazios honestos |
| E2 | Trilha I em curso (M01·A01–A07 concluídas, A08 em andamento, sequência 3/5) | Estado principal |
| E2b | Trilha I percorrida, M06·A01 em andamento | Troca de território e conquista de conclusão de trilha, se a regra existir |
| E3 | E2 + eventos que o backend aceita mas o front ainda não emite (`instrumento_usado`, `exercicio_respondido`) | Só depois de a Peça C emitir esses eventos. Até lá, E3 = E2 e a diferença é declarada |

**Conquistas:** só as computáveis a partir de `aula_concluida` (ver
`../estudos/movimento-e-conquistas/sistema-de-conquistas.md`) aparecem como obtidas. As demais aparecem como "em
desenho" ou não obtidas, sem data falsa.
