# NIVAR G2.3.1 — sete respostas ao owner

Branch de trabalho: `wave/nivar-g2-dream-build`. Início real: `aa54f8f32f11e1742cfd1cbe80c7219a217c2de7`. O HEAD final e a lista exata de arquivos estão em `delivery.json`, gerado após o commit. Não houve merge nem deploy.

## 1. Que mídia nova foi realmente criada para o Hero?

Foram gerados três takes novos com Seedance 2.5, via Higgsfield. Dois entraram no filme: **Contato de calibração**, aproximação de um probe ao cobre sem inscrições; e **Transmissão óptica**, mudança de câmera e foco entre vidro, papel, traços e sombra. Cada take tem 6,042 s, 24 fps e nenhum áudio. O primeiro candidato de calibração foi rejeitado por inventar numerais de régua. Os dois selecionados são ficção editorial, sem pretensão documental. [Reprodução dos três candidatos](hero/generated/review.html), [prompts, seleção, limites e hashes](hero/generated/final-selection.json).

Também foram pesquisadas, baixadas e inspecionadas sete fotografias novas. A edição selecionou **Tucuruí**, Bruno Huberman / Repórter do Futuro, 2008, e **transmissão MCA7678**, Marcello Casal Jr / Agência Brasil, galeria de 2012. São fotografias históricas reais, com licenças e atribuições verificadas; a data da galeria de transmissão não é apresentada como data comprovada da tomada. Não se inventou município, circuito ou tensão. [Seleção e rejeições](hero/real-media/SELECTION.md), [proveniência](hero/real-media/selected-provenance.json).

## 2. O que mudou na própria composição e na sobreposição?

A sequência foi reconstruída em 32 segundos. O território brasileiro e a transmissão abrem o filme. O macro de medição passa a ocupar um campo próprio; uma folha física entra ao lado e recebe o registro. A folha cresce para acolher estrutura e observação, recua durante a transmissão óptica e assume o plano no final. Cada mudança redistribui matéria, registro e gráfico no tempo.

Números, pergunta, fonte e CTA têm áreas reservadas. A tabela ocupa espaço somente quando é lida. O registro selecionado permanece na coluna de evidência; sua duplicata sobre o pico do gráfico foi retirada apenas da composição do Hero. A mídia já não permanece sob todos os dados ao mesmo tempo. A legenda documental tem sua própria faixa. Isso é mudança de cenário, plano, hierarquia e duração, verificada em reprodução contínua desktop e móvel. As falhas encontradas e as correções estão na [crítica de movimento](hero/MOTION-CRITIQUE.md).

O registro que atravessa a montagem vem do próprio Terminal: **SE/CO · 24 h · carga · 18 h · 68,1 GW**. O Hero usa `TerminalReading` e `AnalysisInstrument`, com o mesmo modelo de análise. O destino abre essa seleção. A série é sintética; os valores não são medições das instalações fotografadas. O instrumento completo aparece depois da construção da evidência, no trecho final.

## 3. Por que a barra de seek foi removida?

Porque o owner pediu uma sequência dirigida, cujo sentido depende de ordem e tempo de leitura. A barra fazia a navegação temporal competir com o filme. O produto agora tem pausa/continuação discretas, replay após o fim e leitura sem movimento. Não há barra de progresso, slider ou navegação por capítulos. Os controles dos vídeos deste pacote servem apenas à revisão das gravações.

## 4. Que símbolo identifica cada família?

| Família / patrono | Insígnia selecionada |
| --- | --- |
| Intelligence / Argos | **Campo registrado** |
| Advisory / Sócrates | **Contraprova** |
| Academy / Perseu | **Matriz e passagem** |
| Software / Ariadne | **Registro convergente** |
| Hardware / Hefesto | **Esquadro e padrão** |

São cinco masters de uma cor, com formas compactas próprias. Os retratos grandes dos patronos continuam; os ordinais continuam como taxonomia. [Seleção exata](insignia/selected-masters.json), [prancha de rotas e rejeições](insignia/concept-board.html), [pixels reais](insignia/small-size-actual-pixels.png).

## 5. Por que cada símbolo corresponde ao comportamento?

- **Argos observa:** um campo curvo se registra contra uma aresta fixa. O corte interno põe o campo em relação com uma referência.
- **Sócrates questiona:** duas massas desiguais disputam um intervalo. A continuidade encontra uma objeção e permanece aberta.
- **Perseu transmite:** o fragmento ausente da matriz reaparece adiante, preservando a correspondência com a origem.
- **Ariadne organiza:** entradas de ritmos e espessuras diferentes se unem fisicamente numa espinha comum.
- **Hefesto mede e constrói:** um padrão destacado se compara com um esquadro maciço; diagonal e batente estabelecem a referência material.

O comportamento foi usado para gerar e rejeitar formas, não para recuperar os antigos adereços mitológicos. Foram abandonadas leituras de letras, lente genérica, cruz, RSS, tridente, checkmark e paisagem. Nenhuma animação foi acrescentada aos símbolos para sustentar uma forma estática fraca. [Pesquisa e evolução](insignia/research.md), [exploração gerada](insignia/generated-provenance.md).

## 6. Como os cinco pertencem visivelmente à mesma casa?

Compartilham caixa de 32 × 32, massas preenchidas, intervalos amplos, cortes definidos, terminais retos e curvas usadas quando a ação pede continuidade. A relação entre massa e ausência é a regra comum; as silhuetas são diferentes. Funcionam com uma cor herdada do contexto, sem textura, gradiente ou bitmap necessário para reconhecimento.

Os cinco foram comparados a **16, 20, 24 e 32 px**, em claro, noturno e uma cor. Os mesmos contornos têm derivados de incisão material em Blender, destinados à apresentação, sem peso no runtime. A assinatura NIVAR mantém a primazia: casa → família → produto. [Provas pequenas](insignia/small-size.html), [contextos editoriais](insignia/in-context.html), [matéria](insignia/material.html). As provas editoriais não são apresentadas como capturas da aplicação; a QA integrada está separada.

## 7. Que trabalho G2.3 foi deliberadamente preservado?

Wordmark NIVAR, retratos grandes, conteúdo e arquitetura geral, funções do Terminal, jornadas Advisory, Conta de Luz, Solar, Diagnóstico, Academy/Alexandria, método EV-001, finale de Diógenes, footer, operator, rotas e carregamento. As inserções em navegação, índice e rótulo do Terminal são dependências diretas da identidade compacta.

A auditoria compara o código ao HEAD inicial real, verifica os blocos preservados e os **209 hashes de Alexandria**. Não se incorporou o `.blend` do owner que já estava modificado antes desta rodada. [Fronteiras e exceções exatas](qa/boundary-audit.md), [inventário verificável](qa/boundary-and-inventory.json). O pacote registra separadamente build, lint, testes e QA de navegador; igualdade de bytes não substitui teste funcional.
