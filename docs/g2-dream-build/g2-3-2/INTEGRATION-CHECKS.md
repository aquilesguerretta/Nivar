# Hero — integração e lifecycle

Revisão limitada em 12 de setembro de 2026. Posse: `src/components/g2/HeroFilm.tsx`, `src/components/g2/hero-film.css` e este registro. Sem alterações em outras superfícies e sem commit pelo agente de integração.

## Contrato de mídia

- Desktop: `/g2/g232/hero/nivar-energia-desktop.mp4`, enquadramento 16:9.
- Mobile: `/g2/g232/hero/nivar-energia-mobile.mp4`, enquadramento 4:3.
- Posters: `/g2/g232/hero/nivar-energia-poster.webp` (1920×1080) e `/g2/g232/hero/mobile-poster.webp` (960×720).
- Uma única variante é escolhida na montagem, pelo breakpoint de 700 px. Para verificar outra variante, configurar o viewport antes de recarregar. Redimensionar a página não inicia o download do outro master.
- O vídeo e o poster usam `object-fit: contain`. A página não recorta os masters.
- O filme controla cortes, duração e encerramento. Não há duração de edição fixa, relógio por RAF, seekbar, gráfico ou Terminal dentro da imagem. O link para o Terminal permanece abaixo da abertura.

## Revisão do código

Os resultados desta seção são inspeção de implementação; não substituem a verificação com os masters finais.

| Situação | Comportamento implementado |
| --- | --- |
| Primeira montagem, fora da viewport | O vídeo ainda não está montado; não há `src` de MP4 no DOM. |
| Primeira entrada visível | O vídeo é montado quando mais de 12% da abertura entra na viewport. `play()` exige intenção de reprodução, documento visível e ausência de fim, erro ou modo estático. O início é mudo e `playsInline`. |
| Saída da viewport / aba oculta | O efeito de reprodução pausa o elemento. A intenção do visitante e a posição são preservadas. |
| Retorno à viewport / aba visível | Retoma somente se a intenção anterior ainda é reproduzir. Uma pausa manual ou o fim do filme não são revertidos. |
| Fim | O evento nativo `ended` marca o filme como concluído. A última imagem permanece; não há loop automático. |
| Replay | O botão reposiciona o elemento em zero e pede reprodução. Não estima o fim por duração codificada na página. |
| Política de autoplay | `NotAllowedError` oferece início por gesto explícito. `AbortError` de uma pausa ou troca de estado não transforma a pausa em erro de mídia. |
| Arquivo inválido / indisponível | O vídeo sai do DOM; a gravura original de Hefesto permanece e o botão oferece nova tentativa. |
| Conexão parada | Um limite de 30 segundos de carregamento ou buffering, somente durante reprodução solicitada e visível, retorna ao fallback com retry. Não há spinner permanente. |
| Movimento reduzido na entrada | O modo estático é o estado inicial. Entrar na viewport não monta vídeo nem atribui `src` de MP4. O visitante pode optar por assistir. |
| Movimento reduzido ativado durante a visita | A reprodução é interrompida e a gravura volta. Desativar essa preferência não reinicia o filme automaticamente. |
| Modo estático / navegação / desmontagem | A limpeza pausa o elemento removido, retira seu `src` e executa `load()` para cancelar a requisição residual. Pausas normais mantêm o buffer. |
| Som | Começa mudo. O controle altera `muted` diretamente a partir do gesto do visitante e reflete seu estado com `aria-pressed`. |

Correção nesta revisão: a remoção do elemento passou a liberar explicitamente sua fonte. Apenas pausar e retirar um vídeo do DOM pode deixar uma transferência pendente; a limpeza agora distingue desmontagem de pausa normal.

## Verificações já realizadas

- `npx tsc -b` e `npx eslint src/components/g2/HeroFilm.tsx` passaram após a integração e após o ajuste para 4:3. Uma nova execução após a limpeza de recursos está registrada abaixo.
- `git diff --check` dos dois arquivos passou; apenas avisos de normalização LF/CRLF.
- Antes de os masters finais existirem, o navegador local em 1280×720 mostrou a gravura de Hefesto com `naturalWidth = 600`, fallback de erro legível e ausência de overflow horizontal.
- O botão de retry foi acionado por clique real e voltou ao fallback quando o arquivo continuou indisponível.
- O fallback e a legenda foram observados nos modos claro e noturno.
- A versão intermediária **3:4** teve viewport medido em 390×844, gravura carregada e ausência de overflow horizontal. Essa medição pertence à versão intermediária; **não valida o 4:3 final**.

## Limites e QA pendente

- **Não foi feita confirmação visual do fallback 4:3 em 390×844.** A captura com override falhou no harness anterior e, na tentativa posterior com iframe, o CUA retornou inventário vazio e `No browser is available`.
- Os quatro assets finais ainda não estavam presentes ao iniciar esta revisão. Reprodução efetiva, duração, som, enquadramentos, fim/replay e pausa/retomada com o filme final ficam para o QA de render do agente principal.
- O requisito de nenhum MP4 em movimento reduzido foi revisado no código. A confirmação por rede do navegador ainda deve ser feita com a preferência configurada **antes** da navegação e sem consentimento de reprodução.
- Verificar os masters em desktop e mobile, claro e noturno; o objetivo desta nota é manter a distinção entre código revisado, interação realmente observada e QA ainda pendente.

## Gate após a limpeza de recursos

- `npx tsc -b`: passou, saída 0.
- `npx eslint src/components/g2/HeroFilm.tsx`: passou, saída 0, sem erros ou warnings.
- `git diff --check` dos arquivos sob posse: passou, saída 0; apenas aviso de normalização LF/CRLF.
