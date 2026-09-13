# NIVAR G2.3.2 — A energia nos move

Novo filme de 36,31 s, produzido no Higgsfield a partir dos seis patronos aprovados. Hefesto mede e aciona a roda; Ariadne tensiona o fio; Argos revela o território; Sócrates questiona; Perseu transmite a chama; Diógenes caminha e ergue a lanterna. A marca NIVAR encerra o filme.

Não há dashboard, gráfico, interface ou Terminal dentro do vídeo. O acesso ao Terminal permanece na página, fora da imagem. Não houve revisão geral nem alteração das cinco insígnias.

## Produção

- Estudo de cinco referências primárias em [research/CINEMATOGRAPHY-STUDY.md](research/CINEMATOGRAPHY-STUDY.md), com observações de reprodução real.
- Comparação do mesmo Hefesto em Seedance 2.5 e Cinema Studio 3.0. Seedance preservou melhor rosto, gravura e gesto; o piloto Cinema Studio foi descartado.
- Nove tomadas produzidas: sete entram no corte, incluindo apenas dois segundos de close do primeiro Diógenes após a caminhada revisada. A abertura genérica e o piloto Cinema Studio não entram.
- Montagem nativa Higgsedit 0.14.0 a 24 fps, cortes e assinatura em vetores originais. Transcodificação, recorte mobile e extração de posters no sandbox Higgsfield.
- Áudio nativo das tomadas, normalizado, sem locução adicionada. Reprodução inicia muda. Verificação de sinal: máximos -1,1 dBFS desktop / -1,5 dBFS mobile. Não foi certificada escuta crítica da mixagem.
- Consumo confirmado: 584 créditos; saldo após produção: 952,56. Não houve compra, assinatura ou uso de tentativas gratuitas.

## Entregas

| Arquivo | Formato | Tamanho |
|---|---|---|
| `public/g2/g232/hero/nivar-energia-desktop.mp4` | 1920 × 1080, H.264/AAC, 24 fps | 22.28 MB |
| `public/g2/g232/hero/nivar-energia-mobile.mp4` | 960 × 720, 4:3, H.264/AAC, 24 fps | 10.96 MB |
| `nivar-energia-poster.webp` | 1920 × 1080 | 267.57 kB |
| `mobile-poster.webp` | 960 × 720 | 144.21 kB |

SHA-256 e bytes em [export-hashes.json](export-hashes.json). Prompts, IDs, referências e URLs em [production-manifest.json](production-manifest.json). Tempos e enquadramento de cada plano em [edit-decision-list.json](edit-decision-list.json). Script nativo em [edit.mjs](edit.mjs); reconstrução em [rebuild-in-higgsfield.sh](rebuild-in-higgsfield.sh). O ZIP de fonte contém o projeto e a receita; as tomadas são recuperadas pelas URLs, não estão duplicadas no pacote.

## Verificação

- Build TypeScript + Vite, ESLint do Hero e git diff-check passaram.
- Detector: zero P0; 25 P2 informativos em arquivos fora desta mudança.
- Ambos os masters reproduzidos integralmente no navegador real. Quadros e tempos em `browser-evidence/`; são amostras de reprodução, não gravações de tela.
- Mobile real dentro de iframe 390 × 844: documento e scrollWidth 390; vídeo 960 × 720, sem overflow horizontal. Inspeção de luz/escuro, replay, pausa, som, fallback e retorno ao filme.
- Pausa manual preservou 2,167834 s. Som alterou muted true→false; versão sem movimento desmontou o vídeo e preservou a imagem original com naturalWidth 600.
- Teste de primeiro carregamento com matchMedia reduzido simulado pelo harness: zero elementos video no Hero e zero recursos MP4 do Hero. Não alterou a preferência do sistema operacional.
- Saída da viewport pausou a reprodução; retorno retomou a posição. Visibilidade da aba, erro de rede e timeout têm revisão de código; não houve simulação de falha de rede final.
- Revisão independente limitada em [original-audit/FINAL-CUT-CRITIQUE.md](original-audit/FINAL-CUT-CRITIQUE.md).
- Avisos existentes do build: Browserslist antigo, minificação CSS fora do Hero, mistura de imports e tamanho de chunks. Não bloquearam a compilação.

Branch: `wave/nivar-g2-dream-build`. Base desta correção: `1444896641840e85ca948b50b7070fe06d211d46`. Apenas HeroFilm.tsx e hero-film.css mudaram no código existente. Backend, Alexandria, Terminal, demais seções e insígnias ficaram intactos. O arquivo .blend previamente modificado pelo usuário não foi tocado nem incluído no commit.

Sem merge. Sem deploy.
