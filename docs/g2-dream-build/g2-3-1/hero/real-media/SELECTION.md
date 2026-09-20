# G2.3.1 — Brasil real / seleção de fotografia

Pesquisa e downloads novos nesta correção, 12/09/2026. Nenhum dos arquivos vem do conjunto Itaipu G2.2/G2.3. São fotografias históricas, não footage de vídeo nem registro atual.

## Selecionados

| Fonte | Função de montagem | Por que permanece |
| --- | --- | --- |
| Tucuruí, Bruno Huberman / Repórter do Futuro, 22/07/2008 | Abertura territorial | Vista oblíqua reúne reservatório, intervenção e ocupação humana em escalas distintas. Azul atmosférico e concreto criam um plano amplo antes da aproximação ao instrumento. A barragem continua visível; nenhuma infraestrutura foi inventada. |
| Transmissão MCA7678, Marcello Casal Jr / Agência Brasil, 17/09/2012 | Corte de escala para a repetição de torres | A sucessão horizontal e a perspectiva real oferecem ritmo e estrutura. O céu desocupado é parte da composição original, não objeto apagado para caber interface. O corte termina antes do estágio analítico, que tem seu próprio campo tipográfico. |

Direção coordenada com o integrador: território → linha de transmissão → novo plano editorial de matéria/medição → evidência → componentes reais do Terminal. Duas fotografias bastam; uma terceira torre diminuiria o contraste entre escalas.

## Rejeitados após inspeção

O contact sheet mostra as sete fotografias efetivamente baixadas e inspecionadas. Os JPEG originais permanecem em `originals/`, com hashes em `candidate-provenance.json`.

| Candidato | Decisão |
| --- | --- |
| MCA7691, torre frontal central | Bom ritmo e desenho estrutural, mas redundante com MCA7678 na duração curta. Mantido como pesquisa, excluído de `public`. |
| MCA7694, torre muito próxima | A massa da torre ocupa quase todo o quadro e favorece repetição do problema de sobreposição. |
| MCA7693, torres cortadas nas duas margens | O corredor é legível, mas as laterais pesadas competem com a passagem editorial de escala. |
| MCA7686, torre cortada à direita | Melhor espaço vazio que 7693, ainda menos claro que a sequência panorâmica 7678. |
| Furnas 001, Luiz coelho, 29/03/2013 | Perspectiva verificável e licença CC BY-SA 3.0; jardim em primeiro plano, saturação forte e configuração de mirante turístico desviam o filme do encadeamento território → instrumento. Não usado. |

## Candidatos de fonte descartados antes de seleção visual

- **Cabos sobre a Lagoa de Furnas**, Mateus S. Figueiredo: página Commons diz CC BY-SA 4.0, EXIF diz CC BY-SA-NC 4.0. Conflito registrado; não baixado nem usado. [Fonte](https://commons.wikimedia.org/wiki/File:Cabos_sobre_a_Lagoa_de_Furnas.jpg).
- **Furnas / transmissão e subestações**, imagens oficiais de Daniela Monteiro, Marcos Labanca e Teresa Travassos: ótimas identificações, mas nenhuma licença de reutilização compatível confirmada na página examinada. Não baixadas. [Fonte oficial](https://www.furnas.com.br/subsecao/16/transmissao-e-subestacoes?culture=en).
- **Tucuruí 2004**, **DSC 0047 / 2011**, **Furnas construção / 1962**: fontes e licenças localizadas, download do original retornou HTTP 429. Não foram inspecionadas, portanto não são alegadas como candidatos visuais curados nem integram o Hero. Os erros estão no manifesto.
- **Conteúdo genérico gov.br**: o rodapé encontrado declara CC BY-ND 3.0; não usamos essa autorização como licença de adaptação cinematográfica de imagens de terceiros. Optamos por fontes com atribuição e adaptação documentadas.

## Licença e identificação

A fotografia de Tucuruí tem [página de arquivo](https://commons.wikimedia.org/wiki/File:Hidrel%C3%A9trica_de_Tucuru%C3%AD.jpg), autor fotográfico Bruno Huberman identificado na descrição, publicação original de Repórter do Futuro no [Flickr](https://www.flickr.com/photos/26563400@N08/2710190631), licença [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) e revisão dessa licença pelo Commons em 05/01/2010.

MCA7678 está na [galeria original da Agência Brasil](https://memoria.ebc.com.br/agenciabrasil/galeria/2012-09-17/linhas-de-transmissao-de-energia), com crédito Marcello Casal Jr/ABr e data 17/09/2012. A [página primária arquivada em 19/09/2012](https://web.archive.org/web/20120919221930/http://agenciabrasil.ebc.com.br/) foi aberta nesta pesquisa e declara a licença [CC BY 3.0 Brasil](https://creativecommons.org/licenses/by/3.0/br/) para o conteúdo do site. Não dependemos da licença atual da Agência Brasil: a seleção é desse acervo histórico. A galeria não informa município, estado, tensão nem circuito; esses fatos não são inferidos.

## Derivados e peso

Processamento: orientação EXIF normalizada, redução proporcional Lanczos e WebP. Sem crop, color grading, remoção/adição de objetos ou reconstrução por IA. As animações e o enquadramento final são responsabilidade da composição do Hero, não do arquivo fotográfico.

| Variante | Tucuruí | Transmissão | Total de fotografias |
| --- | ---: | ---: | ---: |
| Desktop, largura 1600 | 85.136 B | 243.166 B | 328.302 B |
| Mobile, largura 720 | 22.564 B | 52.622 B | 75.186 B |

`selected-provenance.json` registra dimensões, URL, autoria, licença, mudanças e SHA-256 de cada derivado. `prepare-selected.py` reproduz os derivados a partir dos originais. `source-candidates.py` reproduz a aquisição dos candidatos (pode depender da disponibilidade/rate limit dos servidores).

A página pública `public/g2/g231/hero/real/credits.html` mantém as duas atribuições e diferencia fotografia, animação editorial, geração editorial e série sintética. O Terminal não apresenta valores dessas instalações.

Para um pacote compacto de review, os dois JPEG originais selecionados somam 7.088.723 B. Os cinco outros candidatos baixados podem permanecer no arquivo de trabalho; o contact sheet + manifesto registram as rejeições sem obrigar o pacote público a embarcá-los.
