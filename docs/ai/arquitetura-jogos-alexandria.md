# Arquitetura mínima de jogos da Alexandria — piloto M08

## Escopo desta wave

Esta wave implementa somente a fundação compartilhada e o piloto jogável do Módulo 08, **O Número Impossível**. Os outros dezesseis jogos permanecem apenas na Bíblia aprovada; nenhum deles foi materializado, simulado ou registrado como disponível.

Fontes editoriais usadas:

- `Alexandria_Tarefa_2_Biblia_Aprovada_17_Jogos.md`;
- `CODEX_Tarefa_2_Arquitetura_e_Piloto_M8.md`;
- `src/lib/data/alexandria-modulo-08-content.ts`;
- `docs/ai/mapa-de-dominio-e-revisao.md`.

Os números do dossiê vêm do conteúdo aprovado do M08. Afirmações incompletas do cenário, como “o PDE prevê 78 GW”, são apresentadas como afirmações a qualificar — nunca como dado oficial validado pela aplicação.

## Componentes

| Camada | Caminho | Responsabilidade |
|---|---|---|
| Contrato | `src/lib/games/alexandria-game-types.ts` | Sessão, lente, documento, classificação, decisão, erro crítico, rubrica, evidência e debriefing |
| Motor | `src/lib/games/alexandria-game-engine.ts` | Seleção por lente, validação, consequência, rubrica, nota e evidência determinística |
| Conteúdo M08 | `src/lib/games/modulo-08-game-data.ts` | Onze documentos e respectivos recortes aprovados |
| Persistência | `src/lib/games/alexandria-game-storage.ts` | Registro local append-only da evidência de desempenho |
| Interface | `src/components/alexandria/games/Modulo08Game.tsx` | Fluxo lente → dossiê → conclusão → debriefing → replay |
| Entrada | `src/pages/alexandria/Modulo08GamePage.tsx` | Integração da expedição com o módulo real |

Rota:

`/alexandria/trilha/trilha-setor-eletrico-brasileiro/modulo/modulo-08/jogo`

## Um jogo, três lentes

As lentes filtram o mesmo cenário e mantêm a mesma competência canônica:

- Explorador: 4 documentos, orientação e pistas;
- Analista: 8 documentos, incluindo ONS, MMGD, ANEEL, PDE e quebra metodológica;
- Especialista: 11 documentos, acrescentando qualificador corporativo, datas operativas e publicação versus ano-base.

Cada afirmação recebe cinco etiquetas obrigatórias: grandeza, unidade, universo, período e status. A decisão registra se os números são comparáveis, exigem normalização, não são diretamente comparáveis ou têm informação insuficiente.

## Evidência e limites

Ao concluir, o motor emite evidência local do tipo `performance` com:

- competências e lente;
- decisões justificadas;
- assistência usada;
- erros críticos;
- qualidade de classificação, reconciliação, justificativa e artefato;
- transferência observada apenas nos casos novos da lente Especialista.

A chave local é `alexandria:decision-game-evidence:v1`. A evidência sempre registra `retentionObserved: false` e `domainStateChange: null`: jogar não comprova retenção futura nem promove domínio automaticamente. Certificação, revisão espaçada e promoção de estado continuam fora desta wave.

## Extensão futura

M1, M6, M10 e M11 podem reutilizar o contrato de documento, classificação, decisão, assistência, debriefing e artefato. Um jogo futuro deve fornecer um `DecisionGameScenario` próprio, seu conteúdo editorial aprovado e, quando aplicável, os identificadores de casos de transferência. O motor não contém regra específica do M08.

Não foram adicionados backend, schema, XP, badge, ranking, tutor, multiplayer ou dependência externa.

## Validação

- `npm run test:games` executa testes de lógica e fluxo com o runner nativo do Node;
- lint direcionado cobre todos os arquivos novos e o ponto de integração do módulo;
- o build global deve ser comparado com o baseline: em 4 de agosto de 2026 ele já falhava em dois componentes do NEST por sete erros de tipagem alheios à Alexandria;
- a validação manual cobre entrada pelo módulo, 4/8/11 documentos, erro crítico, reconstrução, debriefing, nota final e replay.
