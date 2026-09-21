# G2.3 Terminal Brasil — implementação e verificação

## Resultado

O Terminal preserva seu ambiente material e a base determinística. Agora uma seleção permite comparar até quatro regiões, alternar gráfico/tabela/retrato espacial, transformar para índice de base100, recortar observações, inspecionar a mesma referência em todas as representações, exportar dados e preservar a análise por URL ou nome local. Nenhuma série de mercado ou camada de infraestrutura foi acrescentada.

A leitura compartilhada `TerminalReading` deriva região, unidade, referência e fonte do mesmo contrato local. O Hero pode reutilizar a apresentação; suas seis amostras didáticas de MW continuam uma sequência distinta, conforme integração do agente principal.

## Arquivos

- `src/pages/terminal-brasil/TerminalBrasil.tsx`: composição, seleção, persistência, entradas anteriores preservadas, tema `nivar-g2-mode`.
- `AnalysisInstrument.tsx`: três representações, valores ligados ao mesmo índice original.
- `analysis.ts`, `analysis-format.ts`, `workspace-state.ts`: séries selecionadas, transformação, CSV e estado validado.
- `TerminalReading.tsx`, `terminal-reading.css`: leitura compartilhada sem gráfico ou estado próprio.
- `terminal-workspace.css`: controles e foco responsivos sobre a composição existente.
- `terminal-motion.ts`: curvas identificadas por região e contexto; papéis de marcador vertical/horizontal corrigidos.
- `sample.ts`: apenas texto de proveniência geográfica atualizado; valores intactos.
- `tests/terminal-brasil/analysis.test.ts`: seis verificações de comportamento.

## Jornada executada no navegador

CUA no Codex In-app Browser, servidor Vite local `127.0.0.1:5173`, 12/09/2026. Foi usada a rota real e ações reais de botão, select, teclado, divulgação nativa, cópia e download.

1. Em1440, partir de SE/CO, preço24h; adicionar NE e Sul; trocar para índice100 e modo foco. As três curvas e os três valores permanecem identificados.
2. Trocar para tabela e inspecionar19h: SE/CO231,00R$/MWh e índice202,6; NE154,55 e211,5; Sul248,32 e199,4. Trocar para espacial mantém19h e os valores regionais.
3. Selecionar30d e recortar04/09–09/09 (índices23–28). Mover o controle de observação por teclado para08/09 (índice27). LeituraSE/CO190,00R$/MWh /120,3; NE131,56 /126,2; Sul200,78 /117,6. Baseline158,00 em04/09; fim181,00 em09/09; seis observações.
4. Copiar link com mensagem de sucesso. Salvar `QA · Comparação diária 04–09 set` neste navegador, recomeçar, restaurar o registro e recarregar a página. Região, comparações, período, recorte, índice e observação restaurados.
5. Abrir fonte pela observação: painel informa o valor bruto190,00, referência2026-09-08, versão da amostra, três regiões, limites04/09–09/09 e fórmula da transformação.
6. Em390, alternar para papel/tabela e clicar09/09. SE/CO181,00 /114,6, NE119,81 /115,0 e Sul195,38 /114,4. A seleção atualiza tabela, controle e leitura.
7. Ainda em390, trocar para espacial e selecionar Sul comEnter. A observação09/09 e as demais comparações são mantidas, com Sul como principal.
8. Selecionar fonte indisponível: gráfico, valores, variação e interpretação ficam ausentes; exportação desabilitada. Voltar à base sintética restaura a configuração da análise.
9. Em1920, ativar foco no gráfico escuro, sair comEscape e acionar `Exportar seleção`. Feedback confirma três regiões × seis observações. O conteúdoCSV foi reconciliado pelos testes puros; o navegador iniciou o download, sem leitura posterior do arquivo baixado.

## Responsividade observada

| Viewport solicitado | scrollWidth do documento | Resultado |
| --- | --- | --- |
|390×844|390|Controles móveis; tabela tem385px dentro de332px com rolagem própria.|
|430×932|430|Retrato espacial e legenda legíveis dentro do painel.|
|768×1024|768|Geografia + análise; leitura abaixo.|
|1024×768|1024|Três áreas, sem expansão horizontal do documento.|
|1440×1000|1425|Comparação, recorte, salvamento e fontes exercitados.|
|1920×1080|1920|Foco amplia gráfico para1668×508px aproximadamente.|

Depois de cada `viewport.set`, a página foi recarregada. O override foi resetado ao terminar. A captura do IAB nesta sessão desenha o conteúdo com escala de cerca de0,56 no canto superior esquerdo de um canvas maior; o restante aparece escuro. As medidas de DOM confirmam o viewport solicitado. Isso limita a leitura das capturas como referência pixel a pixel. Não foi feito corte ou remontagem das capturas.

Capturas brutas: `01-mobile390-dark.png`, `02-mobile390-light-table.png`, `03-mobile430-light-spatial.png`, `04-desktop1920-dark-focus.png` nesta pasta. A comparação visual do material inicial está nos baselines coletados pelo agente principal.

## Verificação e limites

- Seis testes passaram: roundtripURL; entrada inválida; identidade entre7d e cauda30d; baseline ausente/zero/não finito; CSV das séries/janela com valor bruto e transformação; armazenamento local validado e versionado.
- `npx tsc -b` passou após integração concorrente anterior. ESLint da pasta passou. Auditor detectou zero ocorrências em11arquivos. O gate final é repetido pelo agente principal na árvore integrada.
- Console do IAB registrou falhas transitórias de HMR por import concorrente emG2Portal/HouseChapters, resolvidas antes da sequência móvel. Após reload, apenas avisos conhecidos de futuras flags do React Router; nenhuma exceção do Terminal observada na sequência.
- Não foram forçadas falhas de clipboard/localStorage no navegador; os caminhos de fallback estão presentes, sem alegar teste nativo desses erros. Não houve emulação de reduced-motion nesta sessão; os guardasJS/CSS existentes foram preservados e inspecionados.
- Não houve validaçãoSafari/Firefox, ingestãoEPE/ANEEL, sincronização de conta, avaliação comercial, cálculo causal ou benchmark de throughput. Não houve mudança no backend, tipos compartilhados, geometriaIBGE ou Alexandria.

## Reproduzir a análise

`/br/terminal?region=sudesteCentroOeste&period=30d&metric=price&source=sample&tone=graphite&note=1&view=chart&scale=index&start=23&end=28&dataset=NVR-DEMO-2026.09.10-v1&observation=27&compare=nordeste%2Csul`

A amostra conserva referência fixa. A camada local agrupa UFs e deixaRR não atribuído nessa geometria; esse fato não certifica classificação elétrica/comercial atual. ONS relata a interligação deRR emsetembro de2025. As fontes e as consequências para o desenho estão em `../research/terminal/audit-and-plan.md`.
Uma captura adicional no viewport nativo1280×720 foi salva em `05-native1280-dark-focus.png`. Ela não apresenta a escala/canvas do override e é a referência mais clara da composição final.

## Correção após crítica independente — continuidade da observação

A crítica fresca encontrou uma falha que o primeiro passe não identificou: notas posicionadas por fração do recorte mudavam de referência quando a janela era estreitada. No exemplo Sul/7d, a nota 02 mudava de 08/09 (200,78 R$/MWh) para 09/09 (195,38) mesmo com 08/09 ainda incluído. Esse achado invalida qualquer alegação anterior de continuidade completa das notas no recorte.

Corrigido em `analysis.ts` e `TerminalBrasil.tsx`: as três notas são resolvidas sobre a série completa da frequência selecionada. Recortar mantém suas datas originais e desabilita a nota excluída com `fora do recorte`. O instante atual permanece se incluído; quando excluído, a interface escolhe o limite mais próximo como observação comum e anuncia a mudança. Uma seleção vinda de nota também preserva seu timestamp na troca diária entre 7d e 30d. Restauração de uma análise antiga com nota fora do recorte usa a mesma resolução e aviso explícito.

Dois testes regressivos adicionais reproduzem os valores e datas encontrados pelo crítico, o recorte que inclui/exclui a nota e o percurso 7d → 30d → 7d. Total: oito testes. `tsc -b`, ESLint e auditor da pasta passaram após a correção. A reavaliação de interface foi solicitada ao mesmo crítico independente; resultado será registrado no relatório de crítica.

O crítico reativado e o agente implementador encontraram o navegador CUA indisponível no reteste (inventário vazio). Portanto, os gates acima confirmam código e transformação; não se afirma reteste visual pós-correção por essas duas sessões. O agente principal recebeu a sequência exata para repetir em seu navegador ativo.

## Gate final de filesystem — favicon e recorte

O hook compartilhado `useNivarFavicon` foi acrescentado somente em `TerminalPage`, na entrada da rota completa. Assim o Terminal recebe `/g2/g23/brand/favicon.svg`, e o preview incorporado ao Portal continua sob o favicon do shell, sem acrescentar um segundo hook. O cleanup do hook remove apenas o link criado por ele. Não houve alteração no hook compartilhado.

A inspeção final confirmou: `noteAnchors(fullSeries)` não depende de `series` recortada; início, fim e janela completa passam por `changeWindow`; ambos os conjuntos de botões desabilitam notas fora dos limites; a URL distingue uma nota válida de uma observação ajustada; a troca diária e a restauração usam os resolvedores de seleção.

Comandos executados na raiz `C:\dev\gridalpha-v2-nivar-g2`, depois da integração do favicon:

| Comando exato | Resultado |
| --- | --- |
| `node --experimental-strip-types --test tests/terminal-brasil/analysis.test.ts` | Exit 0. 8 testes, 8 passaram, 0 falharam, 0 cancelados, 0 ignorados; duração reportada de 212,117 ms. |
| `npx eslint src/pages/terminal-brasil` | Exit 0. Nenhuma saída ou ocorrência. |
| `npx tsc -b` | Exit 0. Nenhuma saída ou erro de tipos. |
| `node tools/gridalpha-detect/bin/gridalpha-detect.mjs src/pages/terminal-brasil` | Exit 0. 11 arquivos examinados em 19 ms; `No findings. Surface is clean.` |

O auditor emitiu o aviso de depreciação do Node `[DEP0190]` referente ao uso de `shell: true` no próprio subprocesso da ferramenta; não é uma ocorrência no produto. Nenhum build, commit ou ação de navegador foi executado neste gate. O agente principal conduz a validação visual pós-correção.
