# Verificação final no navegador

Verificação realizada pelo agente principal no build local e em fixtures isoladas em 12/09/2026. As críticas independentes anteriores permanecem datadas; os retestes abaixo não são apresentados como uma nova crítica independente.

## Continuidade e cálculo

- **Terminal:** Sul, 7d, Nota 02 = 08/09/2026, 200,78 R$/MWh. Recortar o início para 07/09 manteve esse registro. Recortar para 09/09 selecionou o limite mais próximo e anunciou a exclusão; as notas de 06/09 e 08/09 ficaram desabilitadas, com suas datas originais e “fora do recorte”.
- **Janela diária:** 7d → 30d → 7d manteve 08/09 e 200,78. Comparação Sul/SE-CO em índice 100 mostrou 117,6 e 120,3 em 08/09; tabela conservou os valores originais 200,78 e 190,00. A visão espacial e o painel de fonte conservaram data, regiões e transformação.
- **Caderno:** selecionar 08:00 ausente no finale e abrir os cinco gestos agora abre Medir em 08:00, sem observação. Escape fecha o diálogo e devolve o foco ao botão de abertura. Evidência: `../evidence/house/method-390-gap-preserved.png`.
- Medir, Organizar, Observar, Questionar e Transmitir foram percorridos. Teclas de direção mudam as abas. 00:00 → 04:00 resulta em −4 MW; comparar com 08:00 resulta em indisponibilidade. A afirmação de produção zero em 08:00 recebe “Ausência não é zero”. A nota compilada conserva comparação, julgamento e fonte; copiar apresentou confirmação de sucesso.
- **Software no build de produção:** Nordeste → 14h → 99,04 R$/MWh → fonte de 10/09/2026 → Terminal incorporado conservou o mesmo registro. Não houve troca por uma série real ou por EV–001.

## Movimento e composição

Há gravações de reprodução real do Hero desktop e móvel e das interações do Terminal em `../evidence/motion/README.md`. Os intervalos de captura foram conservados, sem interpolação de quadros ou alegação de 60 fps.

A trajetória do horário agora passa abaixo do bracket antes de subir à coluna. A fonte desaparece antes da entrada da pergunta. A revisão independente conferiu as duas correções nos quadros móveis finais. Nenhum quadro das duas tomadas finais mediu simultaneamente opacidade maior que 0,01 na fonte e na pergunta.

O filme conserva 68, 64, ausência, 81, ausência, 108. Fotografias reais de Itaipu e a série sintética são explicitamente distintas. Pausar, reiniciar e selecionar capítulos foram operados. O estudo de cobre exige reprodução explícita, preserva o poster e tem reprodução única com replay; as verificações de reprodução e pausa estão no relatório independente do cliente.

**Falha de mídia exercitada:** a fixture local em 5191 devolveu 503 apenas para o MP4 de cobre. Após clicar em reproduzir, a interface mostrou “O filme não carregou. A imagem do estudo permanece disponível.”, conservou o poster, manteve o vídeo pausado e ofereceu “Tentar reproduzir novamente”. `copper-media-failure.png` registra o estado; `media-failure-server.mjs` reproduz o cenário sem tocar no backend.

O retrato noturno de Diógenes foi verificado em desktop e 430 px, com a mesma mão, gesto e lanterna. Não é uma inversão CSS da gravura clara. Intelligence a 390 px, Academy a 430 px e Software em produção receberam novas capturas.

## Responsividade e temas

`responsive-final.json` registra **36 combinações**: Portal, Software e Terminal, nos temas claro e escuro, em 390, 430, 768, 1024, 1440 e 1920 px. A largura medida correspondeu à solicitada; nenhum caso apresentou transbordamento horizontal ou imagem quebrada visível. Esse teste estrutural complementa, sem substituir, a revisão das imagens e dos controles.

Parte da ferramenta desenhou o viewport em resolução menor dentro de um canvas com margem escura. Os arquivos originais foram mantidos; os derivados removem apenas essa margem e declaram a resolução capturada. Não são prova de legibilidade pixel a pixel a 390 px. As capturas nativas posteriores de cliente/Software/Alexandria usam o viewport padrão 1280 × 720 sem esse defeito.

**Limite:** o navegador expõe apenas viewport e visibilidade como capacidades. Não foi possível emular `prefers-reduced-motion` na sessão. As regras CSS, a interrupção do RAF e a escolha do capítulo estático foram inspecionadas no código; pausa explícita foi testada. Isso não é uma certificação visual de movimento reduzido no sistema operacional.

## Upload e rotas preservadas

O seletor final em português foi operado com o PDF sintético local de 136 B. O envio ocorreu exclusivamente em `127.0.0.1:5188`, cuja fixture intercepta todos os `/api` e bloqueia todas as escritas com 503. A mensagem final conservou o arquivo e permitiu tentar novamente, sem protocolo fictício. Remover retornou o foco a “Selecionar documento” e desabilitou o envio; selecionar o mesmo PDF novamente funcionou. Capturas: `../evidence/client/conta-luz-final-picker-503.png` e `conta-luz-final-picker-framed.png` no mesmo diretório.

`production-route-smoke.json` registra o build em 4173: Academy → Alexandria, `/us`, `/nest` e `/operador`. Alexandria removeu o shell G2 e restaurou os três favicons originais. O import e o conteúdo preservados são comprovados também pelos 209 hashes. O console ilustrativo do operador carregou sem ações sobre pedidos. A leitura de erros da aba ao final retornou lista vazia.

As condições anônima/autenticada, preparação pública de Solar/Diagnóstico, revisão de escopo e histórico por caso têm evidência adicional em `../evidence/client/independent-browser-qa.md`. Não foi realizado envio a uma conta real, entrega de email, merge ou deploy.
