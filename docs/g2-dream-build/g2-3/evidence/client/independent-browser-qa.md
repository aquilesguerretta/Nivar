# G2.3 — verificação independente das famílias e dos produtos Advisory

Verificação CUA real em 12/09/2026, feita pelo agente Terminal a pedido de client_audit quando o navegador deste não ficou disponível. Foram usados apenas os servidores isolados preparados por client_audit: `127.0.0.1:5188` (sessão sintética) e `127.0.0.1:5189` (anônimo). Segundo o contrato e os logs desse harness, todo `/api` é interceptado e todo POST retorna 503, sem encaminhamento ao backend.

## Comportamentos exercitados

- **Diagnóstico:** clicar `Revisar escopo` vazio apresenta erros por campo e foca setor. Selecionar Manufatura, 50–200 MWh/mês, prioridade Custo total subindo e contexto inventado leva à revisão exata do escopo. O foco chega ao título da revisão. `Editar o contexto` preserva seleção, prioridade e texto. Nenhum envio de diagnóstico foi feito.
- **Histórico do diagnóstico:** fixture-scope-1 mostra uma mensagem sintética vinculada ao primeiro escopo. Ao escolher fixture-scope-2, título, protocolo, faixa e contexto mudam; a mensagem anterior desaparece e o estado vazio aparece. Não houve escrita de mensagem.
- **Diagnóstico anônimo:** descrição, requisitos e estado em preparação aparecem antes do acesso. A área autenticada de escopo não aparece para a fixture anônima.
- **Conta de Luz Express:** apresentação pública e gate anônimo examinados em 390 px. O gate conclui a consulta da sessão e mostra `Entrar para enviar fatura`. Na fixture autenticada, o formulário existente aparece e a ação permanece desabilitada sem arquivo.
- **Arquivo e falha de recebimento:** arquivo sintético `qa-invalid.txt` foi rejeitado localmente com a mensagem de formato. `qa-document.pdf` (136 B) foi selecionado pelo file chooser e mostrou nome, tamanho e tipo. Remover limpou a seleção e desabilitou envio; selecionar novamente reabilitou. O único POST desta verificação foi o envio deste PDF ao servidor de fixture 5188: retornou 503 e a interface declarou que o envio não foi registrado. Arquivo permaneceu disponível para nova tentativa; não apareceu recibo/protocolo inventado. Nenhum documento real foi usado.
- **Solar:** apresentação e estado de abertura em preparação examinados nas fixtures anônima e autenticada. Na conta, o fluxo de documento preserva o aviso de preparação e botão desabilitado sem arquivo. O novo CTA `Consultar disponibilidade` foi clicado na fixture anônima e levou a `#acesso`, onde o gate explica disponibilidade e continuidade de atendimento. Nenhuma proposta foi enviada.
- **Advisory:** tab Tarifa clicada; texto de trajetória/compensação atualizado. ArrowRight a partir de Tarifa seleciona Custos, muda o tabpanel e foca a aba correspondente. O parecer permanece como evidência insuficiente; a interação não fabrica retorno.
- **Academy:** composição própria e a distinção produto/família foram observadas. `Conheça a Alexandria` leva a `#alexandria`; `Entrar na Alexandria` aponta para `/alexandria`. Não houve navegação nem alteração dentro da Alexandria.
- **Hardware:** accordion Tempo abre a explicação de janela e recolhe a anterior. O estado sem catálogo/certificações permanece explícito.
- **CopperStudy:** antes da escolha o vídeo tinha `src=null`, poster definido e `paused=true`. `Examinar a conexão — 6 s` iniciou `copper-motion-960.mp4` (`paused=false`, tempo avançando). Fim natural observado em 6,041667 s com `ended=true` e `paused=true`. `Examinar de novo — 6 s` reiniciou para aproximadamente 0,249 s. `Pausar estudo` confirmou pausa e mostrou ação de continuar. Não foi verificado offscreen/reduced-motion neste passe.
- **Intelligence:** filtro Hidrologia foi clicado e mostrou a leitura de reservatório com destino `/br/brief?nota=hidrologia`. Fonte institucional, leitura e publicação demonstrativa permanecem distintos na página.

## Composição e capturas

Desktop 1440×1000: Advisory, Academy, Hardware, Intelligence, Conta de Luz e Solar. Mobile 390×844: diagnóstico claro/escuro e interações, Conta de Luz clara, Advisory clara; 430×932: Academy, Hardware, Intelligence e Solar claros. Também há capturas nativas 1280×720 de Hardware/replay pausado, Solar/gate e Conta de Luz/falha sintética.

Não houve overflow horizontal do documento nas medidas coletadas. `browser-measurements.json` registra dez leituras com largura solicitada igual ao scrollWidth. Diagnóstico 390 e 1440 e Conta de Luz 390 também foram medidos em tool output com igualdade de largura. A tabela não representa uma matriz exaustiva de todo tema × viewport × página.

O IAB aplicou escala de conteúdo em canvas escuro nas capturas com override de viewport. As capturas `*-native-*` não têm esse artefato e são a melhor referência de legibilidade. Os arquivos foram gravados sem corte ou remontagem. O viewport temporário foi resetado.

## Limites e observação editorial

Este é um passe independente de comportamento e composição, sem conta real, backend, sucesso de recebimento, email, pagamento, análise humana ou SLA. A falha sintética prova o comportamento da interface diante de 503; não prova conectividade ou sucesso de produção. Sem ensaio Safari/Firefox ou emulação de reduced-motion.

A revisão traduz a modalidade padrão `Não sei dizer` como `Não informada`. Não perde um enquadramento conhecido, mas manter a expressão do usuário pode ser uma pequena melhoria editorial. O agente de implementação recebeu essa observação.

O passe não encontrou um bloqueador de interação nas jornadas exercitadas. Os checks de código e a validação final da árvore integrada pertencem aos agentes proprietários.