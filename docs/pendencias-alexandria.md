PENDÊNCIAS DA ALEXANDRIA — POSSE DO LYCEUM
Levantadas pelo ARCHITECT na Portal Debt Wave 1 e entregues aqui
porque NÃO SÃO DELE. Medição completa em
`docs/architect-portal-debt-audit.md`.

CORREÇÃO DE POSSE — leia isto antes do resto
  A Portal Debt Wave 1 abriu com a premissa de que os assets órfãos de
  `public/alexandria/` eram dívida do Portal, a ser ligada pelo
  ARCHITECT. A medição mostrou que não: os 61 arquivos estão todos sob
  `public/alexandria/`, e todo consumidor plausível está sob
  `src/components/alexandria/`. Isso é "Alexandria inteira" no
  AGENTS.md, ou seja, LYCEUM.

  Este é o achado mais importante daquela fase, e o motivo de a Fase 2
  ter fechado como INVENTÁRIO, sem ligar nada. A próxima wave que
  encostar em `public/alexandria/` parte desta premissa, não da
  anterior.

  NENHUM ARQUIVO FOI APAGADO, MOVIDO OU RENOMEADO. A wave só mediu.

── 0 · SOBRE OS NÚMEROS DE PESO ABAIXO
   Medidos DEPOIS da wave `asset-cleanup` do Codex, que converteu 19
   arquivos desta árvore e fechou enquanto a Portal Debt Wave 1 corria.
   A conversão mudou o PESO, nunca a CONTAGEM: nenhum arquivo aqui
   ganhou consumidor por ter emagrecido. `public/alexandria/` inteiro
   caiu de 78 MB para 45 MB no mesmo movimento.

── 1 · GRAVURAS NÃO CHAMADAS — 41 arquivos, ~14,8 MB · NÃO É PENDÊNCIA
   Reserva de conteúdo, não asset perdido. `ApostilaPanel.tsx:182`
   monta o caminho a partir do dado de módulo; as 41 são as que os 17
   arquivos de conteúdo ainda não citaram. Ligam-se sozinhas conforme
   o conteúdo cresce.

   NÃO APAGAR. NÃO MEXER. Estão listadas aqui só para não voltarem a
   ser contadas como órfãs na próxima varredura.

── 2 · VINTE ARQUIVOS SEM CONSUMIDOR E SEM CASA — ~2,2 MB
   Zero referência em `src/`, e nenhum fluxo no app onde caibam hoje.

   Eram ~30 MB na abertura desta wave; a conversão do Codex os levou a
   ~2,2 MB. Registre a consequência: o argumento de "apagar por peso"
   praticamente desapareceu junto. O que sobra é decisão de produto, e
   ela continua valendo o mesmo.

   ATENÇÃO ANTES DE QUALQUER LIMPEZA: pelo menos três destes
   (badge-frame, frame-certificate, seal-wax) constam noutro registro
   do Aquiles como ASSET PAGO À ESPERA DE FIAÇÃO. Nenhum dos 20 se
   apaga sem o LYCEUM confirmar, um a um, que não cai nessa categoria.
   Peso em disco não é razão suficiente.

  [ ] gamificacao/ (3) — badge-frame-lg-on-cream.png,
      frame-certificate-on-cream.png, seal-wax-on-cream.png
      DEPENDÊNCIA NOMEADA: `frame-certificate` não tem para onde ir
      enquanto não existir o ENDPOINT DE EMISSÃO de certificado. É o
      mesmo item que a Ordem de Jogo já carrega como 3.5. A moldura é
      a última peça do fluxo, não a primeira: sem emissão, ligá-la
      seria desenhar certificado que não certifica nada.
  [ ] icones/ (11) — todos os 11, não 10. `icon-compass-simple-on-cream.png`
      só aparece em `RailToggle.tsx:6`, DENTRO DE UM COMENTÁRIO que
      diz que a primeira versão o usava e deixou de usar.
  [ ] marca/ (2) — rosa-lg-on-cream.png, rosa-sm-on-cream.png.
      As variantes on-navy são consumidas por `AlexandriaHeader.tsx:286`;
      as de creme esperam a superfície clara que ainda não existe.
  [ ] svg/anotacao/ (4) — arrow-directional, bracket, detail-frame,
      leader-line. Os 6 primitivos de `svg/nos-trilha/` são consumidos
      por `ModuloNode.tsx`; os 4 de anotação, por ninguém.

── 3 · HARNESS DE TESTE SERVIDO EM PRODUÇÃO — item próprio
   `public/alexandria/svg/_test/index.html`

   NÃO faz parte da contagem de 61 órfãos — é HTML, não asset
   referenciado, e o problema dele é outro. Está em `public/`, então
   é servido em `nivar.com.br/alexandria/svg/_test/`, e o próprio
   arquivo declara na primeira linha de comentário: "NÃO é superfície
   de produção. Existe para provar que os dez primitivos renderizam".

   Precisa de recon do LYCEUM, não de exclusão às cegas: decidir se
   sai de `public/`, se vira ferramenta em `tools/`, ou se fica com
   `robots`/rota bloqueada.

── 4 · 404 DA ALEXANDRIA
   `src/pages/alexandria/AlexandriaRouter.tsx:194` — o catch-all manda
   endereço desconhecido para o Hub, em silêncio, com 200.

   A Portal Debt Wave 1 consertou os dois catch-all do ARCHITECT
   (`main.tsx`, `PortalBRRouter.tsx`) e DEIXOU ESTE INTOCADO de
   propósito: é posse do LYCEUM.

   RESTRIÇÃO PARA QUEM PEGAR, para não ser construído duas vezes na
   língua errada: o 404 da Alexandria tem de falar NAVY SOBRE
   PERGAMINHO, Cinzel + Lora, com os tokens de
   `src/design/alexandria-tokens.ts`. NÃO reuse o componente de erro
   do NIVAR nem o `NotFound` do Portal — os dois são papel/tinta, e
   dentro da Alexandria seriam dialeto estrangeiro.

   O que dá para herdar do 404 do Portal é só a ESTRUTURA (fio de
   acento no topo, etiqueta, título, corpo, linha chave-valor com o
   endereço pedido, saídas). A paleta e a tipografia são outras.
