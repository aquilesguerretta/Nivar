# NIVAR G2.3 · handoff de revisão

**Pacote de revisão, 12/09/2026.** Build integrado, auditoria de fronteiras, gravações amostradas e retestes abaixo foram concluídos. A implementação está registrada até o commit `9c544965210fe6da1943ef339ec4e08f7c9263d7`; o commit documental do pacote será posterior. Não declara merge, deploy ou aprovação do proprietário.

## Estado do trabalho

| Campo | Registro |
| --- | --- |
| Branch de trabalho | `wave/nivar-g2-dream-build` |
| HEAD real de abertura | `67f3074bd5197e2f18b9ea084501acf989c024e3` |
| Identificador do brief | `d9c34c78c26eb85ff9ba981bde9ebcc617f50ff7` foi identificado como tree hash, não commit de abertura |
| HEAD de implementação | `9c544965210fe6da1943ef339ec4e08f7c9263d7` |
| Commits de implementação, em ordem | `fe0c9e6fdcb486c267895ca07a63471615e8f995` — casa, cliente, Terminal, ativos e testes (55 arquivos); `9c544965210fe6da1943ef339ec4e08f7c9263d7` — somente loading de rotas em `src/main.tsx` |
| HEAD do pacote final | O commit documental sucede os dois acima; seu hash será informado na entrega, sem autorreferência inventada neste arquivo |
| Merge/deploy | Não realizados; fora do fechamento autorizado deste pacote |

O [snapshot inicial da árvore](baseline/starting-worktree.txt) já registrava materiais G2.1/G2.2 modificados ou não rastreados, incluindo a cena Blender antiga. Eles não devem ser atribuídos automaticamente a G2.3 ou incluídos num commit pela existência no diretório.

## Mudanças materiais

**Marca e casa.** Interval optical preserva a silhueta NIVAR com maior peso óptico, abertura controlada do A e ritmo N/V. Foi escolhido após comparar três desenhos em favicon, 16/24 px, header, documento, título e Terminal claro/escuro. O código usa SVG inline de uma cor, sem dependência de fonte. O favicon SVG entra pelo hook `useNivarFavicon` no shell e na rota completa do Terminal. A transição real Academy → Alexandria removeu o link criado pelo hook e restaurou os três favicons originais. As figuras aprovadas carregam a presença narrativa das famílias; pequenos identificadores são índices tipográficos, sem novos ícones emocionais. O header recebeu maior presença da marca e uma faixa contextual. O footer tornou a estrutura da casa e os serviços visíveis.

**Hero e método.** O filme trabalha 24 segundos com Medir, Organizar, Observar, Questionar, Transmitir e Procurar. Mantém seis amostras didáticas estáveis e duas ausências. Fotografias históricas reais de Itaipu permanecem independentes da série sintética. `TerminalReading` aproxima a apresentação da linguagem do Terminal sem fingir que MW didático e preço demonstrativo são a mesma série. O caderno permite selecionar, ordenar, comparar, examinar três afirmações e copiar uma leitura com fonte/limites. As colisões do timestamp/bracket e fonte/pergunta foram corrigidas em duas iterações e revistas nos pixels dos takes finais desktop/mobile. A seleção de Diógenes agora entra no caderno via `initialObservation`: o reteste em CSS 390 px preservou 08:00 ausente, e Escape devolveu o foco ao botão que abriu o diálogo. [Captura do reteste](evidence/house/method-390-gap-preserved.png).

**Diógenes.** A pose ampla aprovada e a versão clara anterior foram preservadas. Uma derivação noturna troca a luz e o campo material sem converter o patrono em negativo. O finale expõe as seis observações e suas lacunas, revela a origem e abre os cinco gestos em diálogo. A assinatura final é o vetor plano: a inscrição Blender foi um estudo real, corrigido e preservado, mas não foi implantada como bitmap na página porque a assinatura plana se lê melhor.

**Famílias e cliente.** Academy apresenta sua filosofia e uma única entrada de propriedade para Alexandria; remove a réplica de trilhas/currículo. Advisory substitui o vídeo de restauração documental por exame de geração, tarifa e custos de uma afirmação. Os três serviços explicam a oferta antes da autenticação e mantêm seus URLs reais. Seleção de documento, revisão de escopo, falhas, confirmação retornada pelo servidor e correspondência por caso seguem os contratos existentes. Solar e Diagnóstico continuam em preparação; existência de intake não é lançamento público. Links públicos para demonstrações do operador foram removidos.

**Hardware.** O novo filme de cobre usa a imagem original conhecida. Só recebe `src` após escolha explícita; termina uma vez e oferece replay. Play, fim, replay e pausa foram exercitados no navegador. Uma fixture posterior bloqueou apenas o MP4 com 503: o erro informou que o filme não carregou, manteve o poster e a pausa e ofereceu retry; [captura nativa](qa/copper-media-failure.png). O filme é ilustrativo e não retrata uma instalação comprovada nem uma medição.

**Terminal.** Comparação de até quatro regiões, gráfico/tabela/espacial, escala nativa/índice 100, recorte, inspeção sincronizada, fonte por observação, CSV, URL e análises nomeadas locais transformam a leitura em um percurso preservável. Não foram adicionados dados de mercado, alertas, infraestrutura falsa ou sincronização em conta. Após a crítica, notas foram ancoradas na série completa; oito testes passaram e o principal repetiu o percurso no navegador. Recorte iniciado em 07/09 conservou 08/09 e 200,78 R$/MWh; iniciado em 09/09 ajustou a seleção a 09/09, anunciou a mudança e desabilitou as notas excluídas. A ida 7d ↔ 30d conservou 08/09/200,78. Sul + SE/CO, índice 100, tabela, espacial e fonte mantiveram o contexto. [Passos registrados](evidence/motion/terminal/steps.json).

**Carregamento.** GlobalShell, landing US e operador agora carregam por rota. No passe isolado de loading, o JavaScript inicial caiu de 8.110.580 para 3.308.245 B (−59,21%); gzip de 2.427.348 para 1.013.954 B. O build integrado posterior fechou em 3.310,89 kB de entry JS, gzip 1.014,73 kB. A auditoria final confirmou os 26 caminhos de entrada, em ordem, além de props, provider de autenticação, import eager da Alexandria e ordem anterior das folhas globais. O CSS global não foi adiado. O bundle residual permanece grande; não houve aumento artificial do limite de aviso. São medidas de artefato, não de tempo de rede.

## Fontes de implementação e evidência

| Área | Caminhos principais | Registro |
| --- | --- | --- |
| Marca / navegação / footer | `src/components/g2/Brand.tsx`, `NivarShell.tsx`, `g23-house.css` | [Comparações e regras](art-direction/integration.md) |
| Hero / capítulos / método / finale | `HeroFilm.tsx`, `HouseChapters.tsx`, `MethodWorkbench.tsx`, `method-evidence.ts`, `HouseFinale.tsx` e CSS local | [Finale antes/depois](evidence/contact-sheets/finale-before-after.png), [caderno nativo](evidence/house/method-transmit-dark-native.png) |
| Famílias | `src/pages/br/FamilyPages.tsx`, `g23-families.css`, `AdvisoryExamination.tsx`, `CopperStudy.tsx` | [Implementação cliente](research/client/implementation-record.md), [patronos](evidence/contact-sheets/patron-integration.png) |
| Intake / diagnóstico | `AdvisoryIntakeTheme.tsx`, `advisory-intake.css`, três páginas de produto e `HistoricoDiagnostico.tsx` | [QA independente](evidence/client/independent-browser-qa.md) |
| Terminal Brasil | `src/pages/terminal-brasil/**`, `tests/terminal-brasil/analysis.test.ts` | [Inventário e jornada](terminal/implementation-and-qa.md) |
| Loading | `src/main.tsx` | [Medições e verificações](performance/README.md) |

O [gate final](qa/final-gates.md) lista 39 caminhos runtime, um teste e 16 ativos públicos atribuíveis à wave no snapshot, excluindo o trabalho pré-existente. O [inventário completo](qa/boundary-and-inventory.json) conserva os estados e fronteiras. Os dois commits de implementação estão registrados acima; o documental sucede este snapshot. [Matriz de rotas](routes.md) · [manifesto de ativos](asset-manifest.json) · [dossiê de referências](research/REFERENCE-DOSSIER.md).

## Pesquisa que mudou decisões

NASA orientou a precedência da marca-mãe, família e patrono; não forneceu uma silhueta a copiar. Carbon ajudou a separar leitura expressiva e tarefas densas. Logobook e a comparação real de três wordmarks favoreceram uma intervenção óptica limitada. Navbar Gallery informou a relação entre marca, utilidades e índice da casa. Koyfin, OpenBB e OWID deslocaram o Terminal de controles isolados para um estado analítico comum e preservável. A apresentação pública de Steep, acessada pelo link “Explore & analyze” no Styles Refero, reforçou a ligação entre métrica, detalhamento, período anterior, entidade e exportação filtrada. A transferência é de contexto analítico e papéis tipográficos; não houve uso do app autenticado nem cópia de fonte/paleta. Carbon/GOV.UK trouxeram requisitos antes da seleção de arquivo, registro único do documento e revisão antes do POST. Os estudos de engenharia do Codrops informaram continuidade de objeto, propriedade do relógio e ciclo de vida; não justificaram um laboratório 3D imaginário. O dossiê distingue artigos, galerias vistas e interações realmente executadas.

## Ativos e ferramentas que contribuíram

SVG autoral para a marca e seus três estudos; Blender 5.2.1 LTS em CLI isolado para comparação e incisão rasa exata; ImageGen nativo para Diógenes noturno; Higgsfield Seedance 2.5 para o cobre a partir do job de imagem original; ffmpeg/ffprobe/Pillow no sandbox Higgsfield para derivados e QA; sharp para SVG/raster e folhas comparativas; CUA para ações e capturas; fontes primárias web para pesquisa. Não se alega uso útil de uma ferramenta apenas por disponibilidade.

Materiais rejeitados permanecem rastreáveis: R facetado de Abertura, direção serifada Incisão, primeiro Blender excessivamente iluminado/em relevo, inscrição bitmap como assinatura de página, hard-loop do cobre, ícones de família antigos e instrumentos fictícios históricos. Patrimônio G2/G2.1/G2.2 não foi restaurado só por existir no disco.

O [manifesto](asset-manifest.json) registra a intenção reconstruída do prompt nativo de Diógenes: conservar face/braço/mão/lanterna/crop; grafite quente `#181719`, hachura sob luz física, 40% esquerdos escuros/vazios e chama âmbar pequena; sem inversão, objetos ou texto adicionais. O prompt integral e ID da geração não foram recuperados; a reconstrução não é transcrição literal.

## Crítica fresca e correções

| Achado independente | Resposta | Estado verificável |
| --- | --- | --- |
| Picker inglês e filename duplicado quebravam o intake; erro falava do ambiente | Apresentação unificada em português e erro humano de serviço | Reteste nativo 1280 × 720: um filename, 503 sintético mantém arquivo/retry, sem recibo; remover devolve foco ao seletor e desabilita envio; nova seleção do mesmo PDF funciona |
| Recortar a janela mudava 08/09 para 09/09 sem escolha do analista | Notas ancoradas na série completa, seleção preservada ou substituição anunciada | Oito testes e reteste UI concluídos; inclusão, exclusão e troca 7d/30d mantêm as regras descritas acima |
| Navegação/descritores muito delicados, integração de patronos desigual | Preservar o achado e revisar o render composto; não declarar solução por intenção | Hierarquia fina e Intelligence móvel continuam pontos de atenção |
| Timestamp cruzava o bracket; fonte e pergunta colidiam no móvel | Trajeto corrigido; source metadata sai antes de a pergunta aparecer | Takes finais desktop/mobile inspecionados pelo crítico; 5,3–5,8 s e 12,1–13,9 s sem colisões nos quadros amostrados |
| A seleção de Diógenes se perde ao abrir o caderno | `initialObservation` conserva a escolha ao abrir | Reteste em CSS 390 px preserva 08:00 ausente; Escape retorna foco ao opener real |

[Crítica de craft](critics/fresh-craft-01.md) · [crítica do Terminal](critics/fresh-terminal-01.md) · [crítica de movimento](critics/fresh-motion-01.md). O crítico de movimento também examinou a fonte de Ariadne e os footers desktop claro/escuro, e propôs tornar o papel final uma entrada direta no instrumento. Os relatórios registram o que seus autores viram naquela versão; não se reescrevem como aprovação retroativa de correções posteriores.

## Testes e limites

[Relatório consolidado do navegador](qa/browser-final.md) reúne os retestes do agente principal e separa-os das críticas independentes.

O [gate integrado final](qa/final-gates.md) passou: `npm run build` (TypeScript real + Vite), ESLint escopado e auditor de toda a árvore com **0 P0 / 0 P1 / 25 P2**, todos informativos pré-existentes fora das superfícies alteradas. O Terminal tem oito testes aprovados após a correção. **209/209 hashes da Alexandria coincidem**, e 113 arquivos rastreados de backend, operador e contratos protegidos estão sem alterações. Os 26 caminhos de rota foram preservados.

O [smoke do build de produção](qa/production-route-smoke.json) percorreu o link real de Academy para a Alexandria original, sem `.g2-shell` e com os três favicons originais; [captura](qa/alexandria-production-entry.png). `/us` mostrou fallback e então a landing original; `/nest` carregou GlobalShell/THE NEST; `/operador` renderizou a fila ilustrativa existente de sete casos, sem ações. Nenhum erro runtime foi registrado na aba. O percurso Software em produção selecionou NE → 99,04 R$/MWh às 14h → fonte `2026-09-10T14:00:00-03:00` → Terminal incorporado na mesma rota, conservando NE/14h/99,04 e o favicon novo. [Fonte de Software em produção](evidence/house/software-production-dark-source.png).

O QA cliente usou registros inventados e interceptação local de API. No passe inicial e no reteste final, o PDF sintético de 136 B recebeu 503 do harness após envio explícito, manteve o arquivo e não produziu recibo. O [reteste final enquadrado](evidence/client/conta-luz-final-picker-framed.png) mostra seletor em português e filename único; remoção, foco retornado e nova seleção do mesmo PDF foram exercitados. Não foram enviados documentos reais, criados atendimentos, escritas mensagens ou acionadas notificações de produção. Sucesso de entrega, e-mail, pagamento, análise humana e SLA não foram testados.

Há três [MP4s finais](evidence/motion/README.md), montados de screenshots de UI em execução com os intervalos reais de captura: Hero mobile, Hero desktop e interação Terminal. São gravações amostradas de 120, 83 e 87 quadros, sem áudio, com aproximadamente 5,0/3,5/5,6 capturas por segundo; não são vídeo contínuo 30/60 fps. O [manifesto](evidence/motion/final-recordings-manifest.json) registra hashes, crop e timing. Amostragem pode perder eventos curtos.

A [matriz final](qa/responsive-final.json) contém 36 medições: Portal, Software e Terminal × 390/430/768/1024/1440/1920 × claro/escuro. Nenhuma linha tem overflow horizontal ou imagem visível quebrada. Isso não equivale à leitura visual integral de cada estado nem à validação de imagens fora do viewport. Capturas finais de Intelligence 390, Academy 430, Diógenes 430 claro/escuro e Software 1440 claro/escuro estão nas [folhas móveis](evidence/contact-sheets/mobile-final-native.png) e de [Software](evidence/contact-sheets/software-final-native.png).

O IAB reduziu parte da UI dentro de padding. As folhas finais removem apenas o padding uniforme e **não redimensionam pixels de origem**; rótulos distinguem dimensões CSS de resolução capturada. A [procedência](evidence/contact-sheets/final-native-provenance.json) conserva os limites exatos e hashes. As folhas antes/depois anteriores têm redução proporcional declarada. Nenhuma delas prova tipografia em resolução integral de dispositivo.

**Limites remanescentes.** Emulação de `prefers-reduced-motion` não estava disponível nas capacidades expostas (viewport/visibilidade); os guardas foram inspecionados em código e pausa manual foi exercitada, mas o comportamento da preferência do sistema não foi validado. Não houve dispositivo físico, Safari/Firefox, leitor de tela, contraste medido ou cobertura uniforme de touch, mídia falha/fallback, offscreen e todos os fluxos/temas/larguras. A microtipografia do header, integração dos patronos e passagem do papel final para instrumento continuam oportunidades de craft. Apenas o hash do commit documental é posterior a este arquivo. A remoção de whitespace no fim de três arquivos após os gates não mudou runtime. Não há merge ou deploy.

## Conferência das entregas do brief

| Entrega | Registro final e limite |
| --- | --- |
| Handoff, rotas e caminhos alterados | Este documento, [rotas](routes.md) e [inventário de 39 caminhos runtime](qa/final-gates.md). Os dois commits de implementação constam acima; o documental será posterior. |
| Marca, wordmark, header e família | Três direções comparadas em escalas e contextos, Interval escolhido, favicon de rota, índices, [patronos](evidence/contact-sheets/patron-integration.png), [Software](evidence/contact-sheets/software-final-native.png) e [móvel](evidence/contact-sheets/mobile-final-native.png). A crítica de microtipografia permanece registrada. |
| Hero desktop/mobile e Terminal interativo | [Três MP4s finais](evidence/motion/README.md), fontes e intervalos reais. São gravações amostradas de UI, não captura contínua de alta taxa de quadros. |
| Portal, Academy, Advisory, cliente, Diógenes e footer | Capturas finais, jornadas em fixture e [upload retestado](evidence/client/conta-luz-final-picker-framed.png). Fixtures não comprovam entrega humana ou disponibilidade comercial. |
| Terminal: capacidades e correção | Inventário, oito testes, [retorno à data correta](evidence/motion/terminal/steps.json), tabela, espacial, índice e fonte exercitados. |
| Alexandria e fronteiras | 209 hashes idênticos, 113 arquivos protegidos intactos, 26 caminhos preservados e [smoke real](qa/production-route-smoke.json) com retorno à identidade original. |
| Light/dark e responsividade | [36 medições](qa/responsive-final.json) em três superfícies × seis larguras × dois temas; zero overflow e imagens visíveis quebradas. Não é cobertura visual exaustiva de todos os produtos. |
| Dossiê, ativos, licença, prompts e Blender | [Dossiê](research/REFERENCE-DOSSIER.md), manifesto e licenças OFL, fonte Blender, prompt completo do cobre e reconstrução declarada do prompt nativo de Diógenes. |
| Design Loop, rejeições e críticos | Estudos → renders → crítica → correções → retestes para marca/material, timestamp, fonte/pergunta, recorte, upload e seleção no caderno. Relatórios independentes anteriores são históricos, sem reescrita retroativa. |
| Acessibilidade e performance | Foco/teclado exercitados nos percursos nomeados; Escape retorna ao opener, remover arquivo retorna ao seletor. [Build/auditoria](qa/final-gates.md) aprovados. Preferência de movimento reduzido não pôde ser emulada; sem afirmação de acessibilidade integral. |

O histórico do Design Loop permanece rastreável entre estudos, críticas e registros. Os takes finais conservam o tempo de captura observado e deixam seus limites de resolução e amostragem explícitos. A avaliação de craft e a aceitação final pertencem ao proprietário.
