# G2.3 · rotas de revisão

Matriz de revisão consolidada em 12/09/2026. Execute a aplicação local e abra os caminhos abaixo no mesmo host. Este documento não altera a disponibilidade dos produtos. Os links de imagem e relatório são relativos ao pacote.

| Rota | O que examinar | Evidência e estado |
| --- | --- | --- |
| `/` e `/br` | Marca Interval, navegação, Hero, capítulos, método, Diógenes, footer | Gravações finais desktop/mobile; timestamp e fonte/pergunta corrigidos; finale 430 claro/escuro; caderno conserva 08:00 ausente e Escape retorna foco. [QA final](qa/browser-final.md) |
| `/br/intelligence` | Argos, paisagem, filtros e entrada no Brief | Filtro Hidrologia clicado; desktop escuro e móvel claro medidos; sobreposição de patrono no móvel apontada pela crítica |
| `/br/advisory` | Examinar Geração/Tarifa/Custos; destinos de cliente | Tab Tarifa + ArrowRight → Custos exercitados; sem conclusão financeira fabricada |
| `/br/academy` | Filosofia da família e uma entrada para Alexandria | CTA para `#alexandria` clicado; entrada aponta para `/alexandria`, sem trilhas internas replicadas |
| `/br/software` | Ariadne, organização e entrada no Terminal | Capturas finais 1440 claro/escuro e nativas de produção. NE → 14h/99,04 → fonte → Terminal incorporado conserva a observação; rota usada na matriz: `/br/familia/software` |
| `/br/hardware` | Hefesto, Tempo e filme de cobre | Accordion Tempo, play, fim natural, replay e pausa exercitados; [captura nativa](evidence/client/hardware-native-replay-paused.png) |
| `/br/terminal` | Comparações, recorte, gráfico/tabela/espacial, índice, fonte, CSV, URL e análises locais | Oito testes e reteste real de inclusão/exclusão, 7d↔30d, comparação índice100, tabela, espacial e fonte passaram. [Passos](evidence/motion/terminal/steps.json) |
| `/br/brief` | Energy Brief e filtro editorial vindo de Intelligence | Destino `/br/brief?nota=hidrologia` observado; conteúdo demonstrativo não equivale a publicação de mercado |
| `/br/metodo` | Fontes, limites e separação entre fotografia real e série sintética | Rota preservada; fonte e limites também exercitados no caderno e no Terminal. Sem nova captura específica desta rota |
| `/br/sistema` | Caderno do sistema e arquitetura da casa | Rota preservada; sem alegação de nova auditoria completa |
| `/conta-de-luz-express` | Explicação antes do acesso; seleção, remoção, envio e não recebimento | Fixtures anônima/autenticada. MIME inválido, arquivo sintético, remoção e POST 503 exercitados; não houve entrega real |
| `/solar-proposal-validator` | Abertura em preparação, requisitos e fluxo autenticado existente | CTA anônimo → `#acesso`; gate e formulário autenticado examinados; nenhuma proposta enviada |
| `/diagnostico-energetico` | Campos, revisão, edição, escopos reais e correspondência por caso | Validação, foco, revisão, preservação ao editar e troca de caso exercitados em fixture; nenhum envio de escopo/mensagem |
| `/entrar`, `/criar-conta`, `/conta` | Identidade e retorno ao serviço | Contratos relativos `/api` preservados; esta rodada não criou conta, fez login real ou alterou acesso |
| `/alexandria/*` | Produto separado, sem alterações autorizadas | 209 hashes preservados; link real Academy → Alexandria renderizou a identidade original, sem shell G2 e com seus três favicons restaurados. [Smoke](qa/production-route-smoke.json) |
| `/us` | Landing americana adiada até a rota abrir | Build/AST passaram; `/us` mostrou fallback e depois a landing original no build de produção |
| `/nest`, `/atlas`, `/peregrine`, `/analytics`, `/vault` | Mesmo GlobalShell e mesmos `initialView`, agora lazy | Build/AST passaram; `/nest` carregou THE NEST e instrumentos. Demais destinos preservados por contrato AST, sem afirmar smoke individual de cada um |
| `/vault/alexandria`, `/vault/alexandria/lesson/:lessonId`, `/vault/alexandria/entry/:entrySlug`, `/vault/:id` | Parâmetros e shell legados preservados | Comparação AST passou; não confundir Vault legado com `/alexandria/*` |
| `/operador/*` | Console existente, sem redesign; código adiado até acesso | Fila ilustrativa original de sete casos renderizou no smoke; nenhuma ação foi feita. Disponibilidade/proteção preservadas; não é destino público de Advisory |
| `/br/familia/:familiaId` e caminhos desconhecidos | Compatibilidade de família e 404 existente | Rotas preservadas; não foram reimplementadas |

A [matriz estrutural final](qa/responsive-final.json) registra Portal, Software e Terminal em seis larguras e dois temas: 36 estados sem overflow ou imagem visível quebrada. Não é cobertura integral de todos os fluxos nem teste de preferência de movimento reduzido.

## Análise reproduzível

```text
/br/terminal?region=sudesteCentroOeste&period=30d&metric=price&source=sample&tone=graphite&note=1&view=chart&scale=index&start=23&end=28&dataset=NVR-DEMO-2026.09.10-v1&observation=27&compare=nordeste%2Csul
```

Fonte e valores são uma amostra determinística. Não há mercado ao vivo, previsão, ingestão ONS/CCEE ou inferência causal. A geografia local tem procedência independente dos valores.

## Hosts de QA, não destinos de produção

`127.0.0.1:5188` usa sessão e registros sintéticos; `127.0.0.1:5189` usa estado anônimo. O harness intercepta todo `/api` e não encaminha cookies/credenciais. Todo POST retorna 503. Os passes inicial e final enviaram apenas o PDF sintético de 136 B ao harness, sem recibo. O reteste final confirmou picker português, nome único, erro humano, arquivo mantido, remoção/foco e seleção repetida. [Relatório independente](evidence/client/independent-browser-qa.md) · [medições](evidence/client/browser-measurements.json).
