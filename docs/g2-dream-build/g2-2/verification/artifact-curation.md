# Curadoria do caderno G2.2

Inventário executado pelo agente principal durante o fechamento. A curadoria não removeu nenhum arquivo do workspace.

O commit preserva todos os filmes finais e rejeitados, screenshots selecionados, folhas de sequência, pareceres originais e emendas, scripts de captura, timestamps, pesquisa, proveniência e o pacote de referência fornecido pelo usuário com sua estrutura intacta.

Frames redundantes de screencast e reprodução ficam somente no workspace. As expressões exatas de exclusão estão em `curate-package.py` e `artifact-manifest.json`. Uma imagem citada diretamente em Markdown permanece no pacote mesmo quando corresponde a um padrão de frame bruto. As sequências completas continuam examináveis pelos filmes e folhas de contato.

O original `real-brazil/originals/itaipu-generator-hall.jpg` fica somente no workspace: candidato não utilizado, com conflito de licença não resolvido na pesquisa. Seu registro de proveniência e motivo de rejeição permanecem no caderno. Nenhum asset desse candidato entrou no produto. Um link histórico para esse original exige a cópia local; essa exceção é deliberada.

`artifact-manifest.json` registra caminho, tamanho e SHA-256 dos arquivos incluídos e locais. `staging-paths.txt` enumera cada caminho autorizado para o commit. O próprio manifesto e a lista de staging não incluem seus próprios hashes. Os totais são de arquivos sem compressão, não do tamanho do pack Git.

O pacote externo G2.1 preexistente e a alteração de pesquisa `.blend`/`.blend1` observada no fechamento são externos a esta entrega e foram deixados intactos.

A inspeção textual estreita por formatos comuns de credenciais não encontrou correspondências; o resultado e os limites estão em `credential-pattern-scan.json`. Isso não é uma certificação geral de ausência de segredos.
