# M15 · grupo "aparato"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo15.html` (4140 linhas). Saída: [`aparato.json`](aparato.json). Camada: **fonte**.
Método: extratores/m15_aparato.mjs — regex escopada por section#id + .sec-id; quiz lido avaliando o literal `var Q=[...]` do <script>; tabelas/caixas por walker de tags balanceadas. Verificação literal: 1538 strings, 0 falhas.

**Cobertura por token (protocolo §5):**

| Seção | Tokens | Casados | % |
|---|---|---|---|
| §Caso | 926 | 926 | 100 |
| §Quiz + var Q | 1650 | 1650 | 100 |
| §Final | 689 | 689 | 100 |
| §Ex | 1605 | 1605 | 100 |
| §Ref | 1501 | 1501 | 100 |
| §Lex | 3910 | 3910 | 100 |

## Caso (§Caso) — P17

- Marcador literal: "§Caso · Operação A — parte 15" (L2682). **A fonte numera como "parte 15"**; P17 manda "Caso — Operação A" na camada Alexandria.
- h2: "A cadeia fóssil que a operação não possui precifica a eletricidade que ela compra". 10 blocos, 2 tabelas de dados, sem números da Operação A (anonimizado).
- **Perguntas declaradas (subtítulos):** 15.1 "Pergunta 1 — o que muda na leitura de risco de um contrato de energia"; 15.2 "Pergunta 2 — se a operação tiver demanda térmica industrial".
- **Perguntas de diagnóstico (caixa):** Primeira: "na janela de exposição do meu contrato, qual parcela do despacho térmico projetado é inflexível e qual responde a mérito?" Segunda: "os índices dos contratos de gás das térmicas relevantes do meu submercado são defasados, e de quanto?" Terceira: "qual movimento de câmbio, isoladamente, deslocaria o custo variável dessas usinas para dentro ou para fora da ordem de mérito?"
- **Decisão pedida: `null`.** A fonte recusa decisão: "Um diagnóstico, não uma decisão." P17 autoriza Desafio de decisão na camada Alexandria.
- Código: ausente em src/lib/data (nenhuma ocorrência de "Operação A" no arquivo do M15) (confirmado: 0 ocorrências).

| Situação do parque térmico marginal | Efeito sobre o preço de curto prazo | O que a Operação A observaria |
|---|---|---|
| Térmicas marginais com contrato de gás indexado com defasagem e retirada mínima elevada | O custo variável declarado responde a cotações de meses anteriores, não às atuais. Um alívio internacional recente não se traduz em queda de preço no mês corrente. | Preço de curto prazo persistentemente alto apesar de notícia de queda de commodity. A leitura ingênua é "o mercado não repassou"; a leitura correta é "o índice ainda não virou". |
| Térmicas marginais com suprimento flexível, inclusive carga pontual de gás liquefeito | O custo variável acompanha condições correntes com defasagem curta, e a curva de oferta térmica responde mais rápido em ambos os sentidos. | Preço mais volátil e mais correlacionado com notícia internacional. Maior valor para instrumentos de proteção de prazo curto. |
| Parcela relevante do despacho por inflexibilidade declarada ou por decisão de garantia de suprimento | Há geração térmica que ocorreria de todo modo; a energia entra no sistema sem que o preço a tenha convocado, e os custos correspondentes aparecem em rubricas próprias. | Descolamento entre "muita térmica gerando" e o nível de preço. Concluir "o preço vai subir porque a térmica ligou" é o erro que esta aula elimina. |

| Condição | Estado geral em 04/08/2026 | Como verificar no caso concreto |
|---|---|---|
| Existir regra estadual que permita ao consumidor escolher fornecedor | Competência é estadual; a regra varia por unidade da federação, e há contencioso judicial sobre migrações em pelo menos um estado. | Norma da agência reguladora estadual e contrato de concessão da distribuidora local. |
| Existir molécula disponível de vendedor alternativo | A oferta é concentrada; há oferta nova entrando pela parcela da União na partilha, cujos leilões de gás começam a ser estruturados a partir da resolução do CNPE de 30/07/2026. | Boletim de comercialização de gás natural da ANP e editais de leilão de gás da União. |
| Existir capacidade de transporte contratável até o ponto | Modelo de entrada e saída em vigor; disponibilidade efetiva depende de contratos legados e de congestionamento. | Registro de contratos de transporte e ofertas de capacidade da ANP. |
| Existir acesso às infraestruturas essenciais a montante | Regulamentado apenas para terminais de gás liquefeito, desde 02/07/2026. Escoamento e processamento estavam em consulta pública. | Resolução ANP nº 1.003/2026 e o resultado da consulta aberta em 10/07/2026. |

## Quiz (§Quiz) — 10 questões × 4 (P18)

- Critério na prosa: "O critério é oito de dez.". Script: `acertos>=8` → pass; senão fail.
- Mensagem ≥8: "Critério atingido. A matéria sustenta uma conversa de uma hora com um analista de óleo e gás, um comprador industrial de molécula ou um gestor de ente produtor — inclusive a parte mais difícil: recusar a pergunta sobre se o pré-sal é compatível com o clima, devolvendo grandeza, cenário, horizonte e as duas posições."
- Mensagem <8 (HTML): "Abaixo do critério de oito acertos. Antes de refazer, verifique o padrão do erro: quase todas estas questões testam <b>regime</b> — quem é dono da molécula, e por que receitas não se somam —, <b>camada</b> — em qual dos seis pontos aquele preço se formou —, <b>grandeza</b> — recurso, reserva ou produção, bruta ou disponibilizada — ou <b>acoplamento</b> — mérito econômico contra inflexibilidade contratual. São esses quatro que derrubam a credibilidade de tudo que veio antes."
- Mecânica: Radio por questão; botão "Corrigir" marca certa/errada em todas e mostra o feedback (q.f) de TODAS as questões, respondidas ou não; questão sem resposta conta como não acerto, sem aviso. Placar "N / 10" com classe pass (≥8) ou fail. "Refazer" reconstrói as questões. Alternativas passam por esc() (texto); feedback e mensagens entram como HTML.
- Gabarito por letra: A=2, B=2, C=3, D=3. Código: ausente em src/lib/data.

| # | Enunciado | Gabarito | Linha |
|---|---|---|---|
| 1 | Em junho de 2026 o Brasil produziu petróleo e gás em 272 áreas produtoras. Qual a distribuição por regime, e o que ela permite concluir? | C) 254 em concessão, 7 em cessão onerosa e 11 em partilha; a distribuição permite somar o volume das três, mas não a receita. | L4022 |
| 2 | Uma fonte informa que o Brasil tem 28,877 bilhões de barris de reserva. O que está faltando? | A) O critério de certeza e a data de referência: o número é 3P em 31/12/2025, e sob critério provado são 17,488 bilhões — 65% menos. | L4029 |
| 3 | Em junho de 2026, a produção bruta de gás foi de 217,35 milhões de m³/d e o aproveitamento reportado foi de 97%. Quanto chegou ao mercado? | D) 64,36 milhões de m³/d — menos de 30% do bruto, porque reinjeção e consumo nas unidades contam como uso e não como perda. | L4036 |
| 4 | Royalty e participação especial: qual afirmação está correta? | B) Royalty incide sobre o valor da produção e é mensal; participação especial incide sobre receita líquida trimestral após deduções, e alcança um conjunto muito menor de municípios. | L4043 |
| 5 | A companhia estatal anunciou reajuste de R$ 0,48 por litro na gasolina A em 28 de maio de 2026. Qual o efeito correto a reportar? | D) O mesmo comunicado trazia desconto de R$ 0,44 por litro no âmbito da subvenção econômica federal — o efeito líquido para a distribuidora foi de quatro centavos. | L4050 |
| 6 | Sobre o acesso de terceiros a infraestruturas essenciais de gás, em 4 de agosto de 2026: | A) Está regulamentado para terminais de gás liquefeito pela Resolução ANP nº 1.003/2026, publicada em 02/07/2026; escoamento e processamento estavam em consulta pública desde 10/07/2026, sem norma vigente. | L4057 |
| 7 | Gás entregue a US$ 10 por MMBtu, câmbio de R$ 5,50 e consumo específico de 7,2 MMBtu/MWh. Qual o custo de combustível por MWh? | B) R$ 396,00, obtidos multiplicando preço, câmbio e consumo específico. | L4064 |
| 8 | Uma térmica a gás está gerando. O que isso permite inferir sobre o preço do gás? | C) Nada, isoladamente: cinco motivos levam uma térmica a despachar — mérito, inflexibilidade declarada, restrição elétrica, requisitos de acionamento e decisão de garantia de suprimento — e só o primeiro carrega sinal econômico. | L4071 |
| 9 | Por que o leilão de reserva de capacidade de 2026 excluiu usinas com valor de inflexibilidade de geração anual superior a zero? | D) Porque o produto comprado é flexibilidade — capacidade de gerar quando o sistema precisar e de não gerar quando não precisar —, e uma usina com inflexibilidade positiva entrega o oposto disso. | L4078 |
| 10 | Um interlocutor pergunta: "o pré-sal é compatível com os compromissos climáticos?". Qual é a resposta correta? | C) Devolver a estrutura — compatível com o quê, medido em qual grandeza, sob qual cenário de demanda e em qual horizonte —, apresentar as duas leituras com a mesma qualidade e nomear as três coisas que mudariam a conclusão de cada lado. | L4085 |

Alternativas e explicações completas em `avaliacao.perguntas[]` (`explicacao_html` preserva o `<b>` da fonte).

## Checklist final (§Final) — 28 itens

h2: "Vinte e oito itens, e o primeiro é o critério". ul.ck estático: nenhum script lê ou marca os itens (sem toggle, sem persistência).

| # | Item (texto) | P14 (anotação) | Linha |
|---|---|---|---|
| 1 | Diante de qualquer número de petróleo ou gás, nomeio em menos de um minuto o regime, a camada e a grandeza — e digo qual dos três a fonte omitiu. | cronometrado | L2928 |
| 2 | Recuso somar receitas de campos sob regimes diferentes, e explico por que o volume físico soma e a receita não. | producao_oral_ou_livre | L2929 |
| 3 | Distingo concessão, partilha e cessão onerosa por titularidade da molécula, e não por tamanho de campo. | producao_oral_ou_livre | L2930 |
| 4 | Sei que em licitação de partilha o bônus é fixo e o que se disputa é o percentual de excedente em óleo. | conhecimento_declarativo | L2931 |
| 5 | Sei que a União recebe hidrocarboneto em espécie na partilha, que a PPSA o comercializa, e que os leilões de gás da União começaram a ser estruturados em 2026. | conhecimento_declarativo | L2932 |
| 6 | Reconheço quando um campo único opera sob dois regimes simultâneos, e por que isso obriga a duas apurações. | producao_oral_ou_livre | L2933 |
| 7 | Explico o que é acordo de individualização da produção e por que ele existe. | producao_oral_ou_livre | L2934 |
| 8 | Separo recurso contingente, reserva e produção sem converter um no outro por regra de três. | producao_oral_ou_livre | L2935 |
| 9 | Nunca cito reserva sem critério de certeza declarado e sem data de referência. | conhecimento_declarativo | L2936 |
| 10 | Sei que reservas brasileiras são declaradas pelas operadoras à agência, e não certificadas por terceiro independente. | conhecimento_declarativo | L2937 |
| 11 | Leio relação reserva/produção como indicador estático, nunca como prazo de esgotamento. | producao_oral_ou_livre | L2938 |
| 12 | Decomponho índice de reposição por origem: descoberta, extensão, revisão técnica, revisão de preço, aquisição, reclassificação. | producao_oral_ou_livre | L2939 |
| 13 | Separo os sete fluxos ao Estado, e sei que royalty e participação especial têm bases, periodicidades e beneficiários diferentes. | producao_oral_ou_livre | L2940 |
| 14 | Sei que royalty e participação especial são compensações financeiras, não tributos. | conhecimento_declarativo | L2941 |
| 15 | Apresento a disputa federativa por rendas petrolíferas com os dois argumentos nomeados, sem declarar vencedor. | producao_oral_ou_livre | L2942 |
| 16 | Leio receita fiscal de petróleo como função simultânea de volume, preço de referência e câmbio — nunca de um só. | producao_oral_ou_livre | L2943 |
| 17 | Nomeio as seis camadas de preço entre a referência internacional e a bomba, e digo em qual delas o número citado se formou. | producao_oral_ou_livre | L2944 |
| 18 | Sei que a subvenção econômica é uma camada de sinal negativo, temporária, e verifico o estado dela na data. | conhecimento_declarativo | L2945 |
| 19 | Descrevo a estratégia comercial de preços como mecanismo, com as duas posições, e não emito juízo sobre ela. | producao_oral_ou_livre | L2946 |
| 20 | Explico por que exportar cru e importar derivado pode ser economicamente correto, separando as quatro causas possíveis do déficit. | producao_oral_ou_livre | L2947 |
| 21 | Leio margem de refino como spread e não como preço, e sei que ela depende de configuração antes de depender de eficiência. | producao_oral_ou_livre | L2948 |
| 22 | Distingo produção bruta de gás de gás disponibilizado ao mercado, e sei por que aproveitamento de 97% convive com menos de 30% chegando ao mercado. | producao_oral_ou_livre | L2949 |
| 23 | Sei que molécula e transporte são contratos separados, com retirada mínima e indexação defasada, e que o preço do gás quase nunca é o do dia. | conhecimento_declarativo | L2950 |
| 24 | Aplico os quatro estados de política ao Novo Mercado de Gás, dispositivo por dispositivo, com data. | producao_oral_ou_livre | L2951 |
| 25 | Somo frete, internalização, regaseificação e transporte antes de comparar gás liquefeito na origem com gás no city gate. | calculo | L2952 |
| 26 | Nomeio os cinco motivos de despacho térmico e sei que só um carrega informação econômica sobre o combustível. | producao_oral_ou_livre | L2953 |
| 27 | Monto o custo variável a partir de gás entregue, câmbio e consumo específico, e sei que uma variação cambial move o custo sem que o gás tenha mudado de preço. | calculo | L2954 |
| 28 | Recuso tanto "o pré-sal financia a transição" quanto "o pré-sal é incompatível com o clima" como conclusões — devolvo mecanismo, quem paga, quem recebe, e as três coisas que mudariam a leitura de cada lado. | producao_oral_ou_livre | L2955 |

Por marcação: cronometrado = 1 (1); producao_oral_ou_livre = 18 (2, 3, 6, 7, 8, 11, 12, 13, 15, 16, 17, 19, 20, 21, 22, 24, 26, 28); conhecimento_declarativo = 7 (4, 5, 9, 10, 14, 18, 23); calculo = 2 (25, 27). marcacao_p14 é inferida do verbo inicial (anotação desta extração, revisão humana pendente). Itens em 1ª pessoa ("nomeio", "explico") são produção livre/oral; nenhum vira evidência automatizada.

Caixa final: "A régua de nomeação, para consulta rápida antes de publicar". Código: ausente em src/lib/data; alexandria-badges.ts não usa o M15.

## Índice de exercícios (§Ex) — 15 (P9)

Todos **soltos** (nenhum aponta aula). Critério por exercício: `null` (a seção pede "a pergunta correta em menos de um minuto").
Código: MODULO_15_EXERCICIOS_SOLTOS (15, kind discursiva, points 10) em alexandria-modulo-15-content.ts — não registrado em RecursosDoModulo.tsx.

| Id | Família | Enunciado | Aula | Código (prompt/gabarito/família) | Linha |
|---|---|---|---|---|---|
| m15-ex-01 | Família 1 · identificação de regime | Dois campos vizinhos produzem 100 mil bbl/d cada. Qual a receita combinada de quem os produziu? | solto | = / = / = · points 10 (sem origem) | L2807 |
| m15-ex-02 | Família 1 · identificação de regime | Uma fonte informa que 11 das 272 áreas produtoras do país estão em regime de partilha. O que você conclui sobre a importância desse regime? | solto | = / = / = · points 10 (sem origem) | L2810 |
| m15-ex-03 | Família 1 · identificação de regime | Um material afirma que "o mesmo campo opera sob dois regimes". Isso é possível? | solto | = / = / = · points 10 (sem origem) | L2813 |
| m15-ex-04 | Família 1 · identificação de regime | Numa licitação de partilha, o que as empresas disputam? | solto | = / = / = · points 10 (sem origem) | L2816 |
| m15-ex-05 | Família 2 · identificação de camada | Um preço de gás de US$ 6 por MMBtu é competitivo? | solto | = / = / = · points 10 (sem origem) | L2821 |
| m15-ex-06 | Família 2 · identificação de camada | A companhia estatal anunciou reajuste de R$ 0,48 por litro na gasolina. Quanto sobe na bomba? | solto | = / = / = · points 10 (sem origem) | L2824 |
| m15-ex-07 | Família 2 · identificação de camada | Uma fonte compara o preço médio do gás industrial no Brasil com o de outro país e conclui que o Brasil é caro. O que verificar antes de aceitar? | solto | = / = / = · points 10 (sem origem) | L2827 |
| m15-ex-08 | Família 2 · identificação de camada | O que é "preço de referência" no vocabulário da ANP, e por que ele não é o preço de venda? | solto | = / = / = · points 10 (sem origem) | L2830 |
| m15-ex-09 | Família 3 · separação de grandeza | Um país tem 15 bilhões de barris de reserva provada e produz 1,5 bilhão por ano. Quanto tempo dura? | solto | = / = / = · points 10 (sem origem) | L2835 |
| m15-ex-10 | Família 3 · separação de grandeza | Um material cita "reservas de 28,9 bilhões de barris" e outro cita "17,5 bilhões". Qual está desatualizado? | solto | = / = / = · points 10 (sem origem) | L2838 |
| m15-ex-11 | Família 3 · separação de grandeza | O índice de reposição de reservas de um país foi de 147% num ano. Isso é bom? | solto | = / = / = · points 10 (sem origem) | L2841 |
| m15-ex-12 | Família 3 · separação de grandeza | Produção bruta de gás de 217 milhões de m³/d significa oferta de 217 milhões de m³/d? | solto | = / = / = · points 10 (sem origem) | L2844 |
| m15-ex-13 | Família 4 · acoplamento elétrico | Uma térmica a gás está despachando. O que isso diz sobre o preço do gás? | solto | = / = / = · points 10 (sem origem) | L2849 |
| m15-ex-14 | Família 4 · acoplamento elétrico | Gás a US$ 10 por MMBtu, câmbio de R$ 5,50 e consumo específico de 7,2 MMBtu/MWh. Qual o custo de combustível por MWh? | solto | = / = / = · points 10 (sem origem) | L2852 |
| m15-ex-15 | Família 4 · acoplamento elétrico | Por que o desenho do leilão de reserva de capacidade exclui usinas com inflexibilidade anual positiva? | solto | = / = / = · points 10 (sem origem) | L2855 |

Respostas de referência literais em `exercicios.itens[].resposta_referencia`.

### Fichas de elo com campo "Preencha." (atividade dentro de aula)

| Id | Aula | Subseção | Elo | Enunciado | Dica | Gabarito |
|---|---|---|---|---|---|---|
| m15-ficha-elo-01 | Aula 01 | 01.5 | Campo produtor (regime de concessão) | Preencha. A produção do campo não diz a participação econômica de cada sócio no consórcio, não diz o preço realizado, não diz… | Três lacunas, no mínimo. Volte a esta ficha depois da Aula 04. | null |
| m15-ficha-elo-02 | Aula 01 | 01.6 | Campo produtor (regime de partilha) | Preencha. A produção do campo não diz o percentual de excedente ofertado, não diz o estágio de recuperação de custo, não diz… | Este campo é mais denso que o da ficha anterior. Por quê? | null |
| m15-ficha-elo-03 | Aula 05 | 05.4 | Refinaria (elo 7 da cadeia) | Preencha. A capacidade instalada não diz o rendimento por produto, não diz a disponibilidade real, não diz… | Compare com a lacuna que você escreveu na ficha do campo produtor. São da mesma família? | null |
| m15-ficha-elo-04 | Aula 07 | 07.5 | Gasoduto de transporte (elo 5 da cadeia) | Preencha. A capacidade do gasoduto não diz quanto está contratado, não diz quanto está disponível para terceiros, não diz… | Repare que aqui a lacuna é de acesso, não de volume. | null |
| m15-ficha-elo-05 | Aula 07 | 07.6 | Terminal de regaseificação (elo 6 da cadeia) | Preencha. A capacidade do terminal não diz quanto do volume é reservado ao uso preferencial do proprietário, não diz… | Este campo mudou de conteúdo em 2 de julho de 2026. Por quê? | null |
| m15-ficha-elo-06 | Aula 08 | 08.4 | Termelétrica a gás (elo 9 · a fronteira) | Preencha. O despacho da usina não diz o preço do gás, não diz se houve mérito ou inflexibilidade, não diz… | Cinco motivos possíveis, e o dado bruto não distingue nenhum deles. Volte ao §08.2. | null |

## Referências (§Ref) — 36

Lede: "Todas verificadas em 4 de agosto de 2026. Fonte primária é norma, dado de agência, documento de companhia rotulado como tal e legislação federal com número, ano e estado de regulamentação. Notícia de imprensa especializada é aceitável como fonte de evento, nunca de número. Material de operadora, entidade setorial, sindicato, organização ambiental ou governo estadual produtor é posição de parte interessada: citável com nome e data como posição, jamais como origem de número neutro." Data de consulta só no nível da seção (4 de agosto de 2026). 0 URL, 0 domínio.
Tipos declarados: Norma federal 14 · Norma da agência 3 · Processo regulatório em curso 1 · Agenda regulatória 1 · Dado de agência 6 · Deliberação de agência 1 · Política energética 1 · Documento de companhia 4 · Diretrizes setoriais 1 · Operação do sistema elétrico 1 · Documento da empresa gestora da partilha 1 · Planejamento energético 1 · Posição de parte interessada 1.

| Id | Rótulo da fonte | Instituição (literal) | Datas citadas | Texto | Linha |
|---|---|---|---|---|---|
| m15-ref-01 | Norma federal · regime de concessão | — | 6 de agosto de 1997 | Lei nº 9.478, de 6 de agosto de 1997. Política energética nacional, criação da agência reguladora e regime de concessão. Em vigor, com alterações posteriores. | L3212 |
| m15-ref-02 | Norma federal · regime de partilha | — | 22 de dezembro de 2010 | Lei nº 12.351, de 22 de dezembro de 2010. Partilha da produção no polígono do pré-sal e em áreas estratégicas; criação do Fundo Social. Em vigor. | L3213 |
| m15-ref-03 | Norma federal · cessão onerosa | — | 30 de junho de 2010 | Lei nº 12.276, de 30 de junho de 2010. Cessão onerosa de direitos de pesquisa e lavra, com teto de cinco bilhões de barris de óleo equivalente. Em vigor. | L3214 |
| m15-ref-04 | Norma federal · empresa gestora da partilha | — | 2 de agosto de 2010 | Lei nº 12.304, de 2 de agosto de 2010. Autoriza a criação da empresa pública gestora dos contratos de partilha. Em vigor. | L3215 |
| m15-ref-05 | Norma federal · royalties | — | 28 de dezembro de 1989; 11 de janeiro de 1991 | Lei nº 7.990, de 28 de dezembro de 1989, e Decreto nº 1, de 11 de janeiro de 1991. Distribuição da parcela de 5% dos royalties. Em vigor. | L3216 |
| m15-ref-06 | Norma federal · royalties e participações | — | 3 de agosto de 1998 | Decreto nº 2.705, de 3 de agosto de 1998. Critérios de cálculo e distribuição da parcela acima de 5% dos royalties e demais participações governamentais. Em vigor. | L3217 |
| m15-ref-07 | Norma federal · destinação de rendas | — | 9 de setembro de 2013 | Lei nº 12.858, de 9 de setembro de 2013. Destinação de parcela das rendas petrolíferas a educação e saúde e regras de repartição aplicáveis. Em vigor. | L3218 |
| m15-ref-08 | Norma federal · repartição federativa | — | 30 de novembro de 2012 | Lei nº 12.734, de 30 de novembro de 2012. Alteração das regras de distribuição entre entes federados; dispositivos vetados na sanção e objeto de litígio prolongado. Verificar o estado da matéria antes de descrever a regra vigente. | L3219 |
| m15-ref-09 | Norma federal · Nova Lei do Gás | — | 8 de abril de 2021 | Lei nº 14.134, de 8 de abril de 2021. Transporte por autorização, independência do transportador, modelo de entrada e saída e acesso a infraestruturas essenciais (art. 28). Em vigor; regulamentação parcial. | L3220 |
| m15-ref-10 | Norma federal · regulamento do gás | — | 2 de junho de 2021; 26 de agosto de 2024 | Decreto nº 10.712, de 2 de junho de 2021, alterado pelo Decreto nº 12.153, de 26 de agosto de 2024. Regulamentação da Nova Lei do Gás. Em vigor. | L3221 |
| m15-ref-11 | Norma da agência · acesso a infraestruturas essenciais | — | 26/06/2026; 02/07/2026 | Resolução ANP nº 1.003/2026, aprovada pela diretoria em 26/06/2026 e publicada em 02/07/2026. Acesso negociado e não discriminatório de terceiros a terminais de gás natural liquefeito; prazo de 90 dias para códigos de conduta e prática de acesso, sujeitos a aprovação prévia. Em vigor. | L3222 |
| m15-ref-12 | Processo regulatório em curso · agência | — | 10/07/2026 | Deliberação da diretoria colegiada da ANP de 10/07/2026, abrindo consulta pública de 45 dias sobre minuta de resolução de acesso a gasodutos de escoamento e a instalações de tratamento ou processamento. Sem norma vigente sobre esses dois tipos de infraestrutura na data de consulta. | L3223 |
| m15-ref-13 | Agenda regulatória · agência | — | dezembro de 2026 | Ação de regulamentação do acesso a infraestruturas essenciais, com cronograma estendido para dezembro de 2026, quando se espera a publicação do regulamento e da instrução normativa sobre solução de conflitos. | L3224 |
| m15-ref-14 | Norma da agência · reservas | — | 31 de janeiro | Resolução ANP nº 47/2014. Critérios de elaboração da declaração anual de reservas e recursos, apresentada pelas operadoras até 31 de janeiro, relativa ao ano anterior. Em vigor. | L3225 |
| m15-ref-15 | Norma da agência · publicidade de preços de gás | — | — | Resolução ANP nº 52/2011, art. 12. Base do boletim mensal de comercialização de gás natural, com preço médio e volumes em três categorias: vendas a distribuidoras e consumidores livres, entre produtores e a comercializadores. | L3226 |
| m15-ref-16 | Dado de agência · produção mensal | ANP | junho de 2026; 03/08/2026 | ANP, Boletim Mensal da Produção de Petróleo e Gás Natural, referência junho de 2026, divulgado em 03/08/2026. Produção total, distribuição por regime das áreas produtoras, gás disponibilizado, queima e aproveitamento. | L3227 |
| m15-ref-17 | Dado de agência · reservas | ANP | 10/04/2026; 31/12/2025 | ANP, Boletim Anual de Recursos e Reservas 2025, divulgado em 10/04/2026, com data de referência em 31/12/2025. Volumes 1P, 2P e 3P de petróleo e gás e índice de reposição de reservas. | L3228 |
| m15-ref-18 | Dado de agência · anuário | ANP | — | ANP, Anuário Estatístico Brasileiro do Petróleo, Gás Natural e Biocombustíveis, edição 2026, com dados consolidados de 2025. Produção anual, refino, movimentação e participações governamentais. | L3229 |
| m15-ref-19 | Dado de agência · royalties | ANP | novembro de 2025; janeiro de 2026 | ANP, distribuição de royalties relativa à produção de novembro de 2025, concluída em janeiro de 2026 para os três regimes. Montante total e número de entes beneficiários. | L3230 |
| m15-ref-20 | Dado de agência · participação especial | ANP | 18/05/2026 | ANP, distribuição da participação especial relativa ao primeiro trimestre de 2026, concluída em 18/05/2026. Montante total, repasses a estados e municípios e número de beneficiários. | L3231 |
| m15-ref-21 | Dado de agência · licitações | ANP | maio de 2026; 07/10/2026 | ANP, cronogramas do 6º Ciclo da Oferta Permanente de Concessão e do 4º Ciclo da Oferta Permanente de Partilha de Produção, publicados em maio de 2026, com sessões públicas previstas para 07/10/2026. | L3232 |
| m15-ref-22 | Deliberação de agência · nova fronteira | ANP | 26/06/2026; outubro de 2026 | ANP, aprovação em 26/06/2026 da indicação de 86 blocos exploratórios da margem equatorial para o rol de áreas em estudo — 36 na Foz do Amazonas, 25 na Pará-Maranhão e 25 na Barreirinhas. Não integram o ciclo de outubro de 2026. | L3233 |
| m15-ref-23 | Política energética · comercialização do gás da União | — | 30/07/2026 | Resolução do CNPE aprovada em 30/07/2026, alterando a Resolução CNPE nº 15/2018 e estabelecendo dois modelos de comercialização do gás natural da União: leilões de curto prazo entre 2026 e 2029 e leilões de longo prazo. | L3234 |
| m15-ref-24 | Norma federal · subvenção a combustíveis | — | 12 de março de 2026 | Medida Provisória nº 1.340, de 12 de março de 2026. Programa de subvenção econômica à comercialização de óleo diesel. Verificar estado e condicionantes antes de uso. | L3235 |
| m15-ref-25 | Norma federal · subvenção a combustíveis | — | 13 de maio de 2026; 06/07/2026 | Medida Provisória nº 1.358, de 13 de maio de 2026. Autoriza subvenção econômica a produtores e importadores de derivados de petróleo. Prazo prorrogado por 60 dias em ato publicado em 06/07/2026; conversão pendente de apreciação legislativa. | L3236 |
| m15-ref-26 | Norma federal · operacionalização da subvenção | — | junho de 2026; 1º de julho de 2026 | Decretos e portarias ministeriais de maio e junho de 2026 que fixaram valores unitários de subvenção para gasolina A e para óleo diesel A rodoviário, com vigências próprias. A subvenção do diesel foi encerrada a partir de 1º de julho de 2026 por decisão anunciada pela pasta fazendária. | L3237 |
| m15-ref-27 | Norma federal · crédito orçamentário | — | 23 de julho de 2026 | Medida Provisória nº 1.380, de 23 de julho de 2026. Crédito extraordinário de R$ 3,33 bilhões para reforço das subvenções à produção e à importação de combustíveis. Em vigor; conversão pendente. | L3238 |
| m15-ref-28 | Documento de companhia | Petrobras | 15 de maio de 2023 | Petrobras, comunicado de 15 de maio de 2023 sobre a aprovação da estratégia comercial de definição de preços de diesel e gasolina, em substituição à política anterior. Referências declaradas: custo alternativo do cliente e valor marginal para a companhia; reajustes sem periodicidade definida. | L3239 |
| m15-ref-29 | Documento de companhia | Petrobras | 28 de maio de 2026 | Petrobras, comunicado de 28 de maio de 2026 sobre ajuste de R$ 0,48 por litro no preço de venda de gasolina A às distribuidoras, com desconto de R$ 0,44 por litro no âmbito da subvenção econômica federal. | L3240 |
| m15-ref-30 | Documento de companhia | Petrobras | 27 de novembro de 2025 | Petrobras, Plano de Negócios 2026–2030, aprovado em 27 de novembro de 2025. Investimento total, composição das carteiras em implantação e em avaliação, alocação de exploração e produção, ampliação de capacidade de refino e investimento em transição energética. Dado da companhia, não do setor. | L3241 |
| m15-ref-31 | Documento de companhia | Petrobras | 11 de maio de 2026 | Petrobras, resultados do primeiro trimestre de 2026, divulgados em 11 de maio de 2026, e divulgação de dados operacionais do segundo trimestre de 2026. Produção própria, endividamento, remuneração aos acionistas e contratação de usinas termelétricas em leilão de reserva de capacidade. Dado da companhia, não do setor. | L3242 |
| m15-ref-32 | Diretrizes setoriais · setor elétrico | — | outubro de 2025 | Portarias do Ministério de Minas e Energia publicadas em outubro de 2025 com as diretrizes dos leilões de reserva de capacidade na forma de potência de 2026, incluindo critérios de inelegibilidade por custo variável unitário e por inflexibilidade de geração anual positiva. | L3243 |
| m15-ref-33 | Operação do sistema elétrico | ONS | — | ONS, boletins mensais de custos e valoração da segurança da operação, edições de 2026. Decomposição dos custos de geração térmica entre inflexibilidade, ordem de mérito, requisitos de acionamento, despacho excepcional e importação. | L3244 |
| m15-ref-34 | Documento da empresa gestora da partilha | PPSA | — | PPSA, material técnico sobre o regime de partilha de produção, painel de dados de produção e de comercialização, e informações sobre os leilões de petróleo da União. Dado de contrato de partilha, com perímetro próprio. | L3245 |
| m15-ref-35 | Planejamento energético | EPE | — | EPE, publicações sobre o marco legal do gás natural e sobre o plano integrado de infraestruturas de gás natural e biometano, edições de 2025 e 2026. | L3246 |
| m15-ref-36 | Posição de parte interessada · declarada como tal | — | — | Nota técnica de entidade de competitividade empresarial, em coautoria com consultoria econômica, sobre o preço médio do gás natural para a indústria brasileira em 2025 e sobre o potencial de redução em cenário de maior eficiência de escoamento e processamento. Citável como posição, com nome e data, nunca como origem de número neutro. | L3247 |

Normas citadas no corpo sem item próprio: MP nº 1.363 (Aula 04).

## Glossário (§Lex) — 174 termos em 8 famílias

Prosa: "Cento e setenta e quatro termos, em oito famílias". Soma declarada nas famílias: 174. Markup: 174. **Concordam.**
Termos com glosa: Concessão (E&P), Bacia sedimentar, Reserva. Nomes duplicados: nenhum.

**Código:** `alexandria-glossario.ts` tem **0** verbetes do M15 → **faltam os 174** (lista abaixo). Homônimos em outros módulos (verbetes distintos, não duplicata): Reserva (gl-m08-reserva); Infraestrutura essencial (gl-m05-infraestrutura-essencial); Ordem de mérito (gl-m02-ordem-de-merito, gl-m03-ordem-de-merito, gl-m04-ordem-de-merito); Ciclo combinado (gl-m03-ciclo-combinado, gl-m08-ciclo-combinado); Ciclo simples (gl-m03-ciclo-simples, gl-m08-ciclo-simples); ANP (gl-m07-anp); CNPE (gl-m07-cnpe); MME (gl-m07-mme); EPE (gl-m06-epe, gl-m07-epe); Análise de impacto regulatório (gl-m05-analise-de-impacto-regulatorio).

**Família 1 · Regimes e contratos de exploração e produção** (24 declarados / 24 no markup): Concessão (E&P) · Partilha da produção · Cessão onerosa · Custo em óleo · Excedente em óleo · Percentual de excedente · Bônus de assinatura · Programa exploratório mínimo · Bloco exploratório · Campo · Declaração de comercialidade · Plano de desenvolvimento · Plano de avaliação de descoberta · Individualização da produção · Acordo de individualização da produção · Área não contratada · Polígono do pré-sal · Área estratégica · Oferta Permanente de Concessão · Oferta Permanente de Partilha · Consórcio · Operador · Comitê operacional · Acumulação marginal

**Família 2 · Subsolo, reservas e recursos** (20 declarados / 20 no markup): Bacia sedimentar · Reserva · Recurso · Recurso contingente · Reserva provada · 1P · Reserva provável · Reserva possível · 2P · 3P · Data de referência · Declaração de reservas · Volume in situ · Fator de recuperação · Relação reserva/produção · Índice de reposição de reservas · Revisão de reservas · Reservatório · Rocha carbonática · Pré-sal · Pós-sal

**Família 3 · Produção, medição e unidades** (22 declarados / 22 no markup): Produção · Ponto de medição fiscal · Barril por dia · bbl/d · Barril de óleo equivalente · boe · Metro cúbico por dia · m³/d · Poço exploratório · Poço produtor · Poço injetor · Unidade flutuante de produção · Navio aliviador · Comissionamento · Ramp-up · Primeiro óleo · Platô · Declínio · Disponibilidade operacional · Parada programada · Custo de elevação · Preço de equilíbrio · Descomissionamento · Águas ultraprofundas · Grau de densidade do óleo

**Família 4 · Participações governamentais e fiscalidade** (18 declarados / 18 no markup): Participações governamentais · Royalty · Participação especial · Preço de referência · Retenção de área · Encargo de pesquisa, desenvolvimento e inovação · Parcela do Estado · Município confrontante · Município produtor · Zona de produção principal · Fundo Social · Vinculação a educação e saúde · Volatilidade de receita petrolífera · Rigidez de despesa · Fundo de estabilização · Leilão de petróleo da União · Leilão de gás da União · Receita líquida do campo

**Família 5 · Refino, derivados e formação de preço** (22 declarados / 22 no markup): Refino · Capacidade instalada de processamento · Fator de utilização · Rendimento · Configuração de refinaria · Conversão profunda · Margem de refino · Cesta de produtos · Diferencial de qualidade · Preço realizado · Janela de apreçamento · Valor líquido na origem · Estratégia comercial de preços · Custo alternativo do cliente · Valor marginal para a companhia · Polo de suprimento · Subvenção econômica · Camada de preço · Preço na bomba · Diesel de baixo teor de enxofre · Carteira em implantação · Petroquímica e fertilizantes

**Família 6 · Gás natural: molécula, infraestrutura e contratos** (28 declarados / 28 no markup): Gás associado · Gás não associado · Produção bruta de gás · Gás disponibilizado ao mercado · Reinjeção · Aproveitamento de gás · Queima em flare · Escoamento · Unidade de processamento de gás natural · Especificação · Transporte de gás · Distribuição de gás canalizado · City gate · Carregador · Transportador · Entrada e saída · Capacidade firme · Capacidade interruptível · Retirada mínima · Compromisso de pagamento de capacidade · Indexação contratual · Flexibilidade contratual · Nominação · Gás natural liquefeito · Terminal de regaseificação · Unidade flutuante de armazenamento e regaseificação · Infraestrutura essencial · Código de conduta e prática de acesso

**Família 7 · Acoplamento elétrico e despacho** (20 declarados / 20 no markup): Consumo específico · Custo variável unitário · Ordem de mérito · Custo marginal de operação · Preço de curto prazo · Inflexibilidade declarada · Despacho por restrição elétrica · Redução por restrição elétrica · Requisitos de acionamento · Despacho por garantia de suprimento · Contrato por disponibilidade · Receita fixa · Receita variável · Leilão de reserva de capacidade · Parecer de viabilidade de fornecimento · Programa mensal de operação · Ciclo combinado · Ciclo simples · Eficiência implícita · Térmica marginal

**Família 8 · Instituições, normas e governança** (20 declarados / 20 no markup): ANP · CNPE · MME · EPE · PPSA · Órgão ambiental licenciador · Autoridade de defesa da concorrência · Órgão de controle externo · Lei nº 9.478/1997 · Lei nº 12.351/2010 · Lei nº 12.276/2010 · Lei nº 12.304/2010 · Lei nº 14.134/2021 · Decreto nº 10.712/2021 · Resolução ANP nº 1.003/2026 · Agenda regulatória · Consulta e audiência públicas · Análise de impacto regulatório · Sociedade de economia mista · Fato relevante

Definições literais em `glossario.termos[].definicao_html`.

## Divergências (8)

- **div-m15-ap-01-quiz-feedback-todas** (fonte (mecânica)) — Feedback exibido para todas as questões, inclusive não respondidas.
  - <script> QUIZ corrigir() (L4121): var fb=$id('fb-'+i); fb.innerHTML=q.f; fb.classList.add('show');
  - Nota: A explicação revela o gabarito de questões em branco; questão em branco conta como erro sem aviso. Relevante para C7 (tentativa antes da referência).
- **div-m15-ap-02-gridalpha-q10** (fonte×decisão) — Explicação da Q10 cita a marca.
  - Q[9].f (L4085): Nenhum ativo da GridAlpha emite juízo sobre política pública de preços, sobre estratégia de transição de companhia, nem sobre a continuidade da exploração de hidrocarbonetos.
  - P24: GridAlpha morta como marca voltada ao learner
  - Nota: Literal preservado.
- **div-m15-ap-03-quiz-x-exercicios** (fonte×fonte (sobreposição)) — Questões do quiz repetem exercícios do §Ex.
  - Q07: Gás entregue a US$ 10 por MMBtu, câmbio de R$ 5,50 e consumo específico de 7,2 MMBtu/MWh. Qual o custo de combustível por MWh?
  - Ex 14: Gás a US$ 10 por MMBtu, câmbio de R$ 5,50 e consumo específico de 7,2 MMBtu/MWh. Qual o custo de combustível por MWh?
  - Q08 × Ex 13; Q09 × Ex 15; Q03 × Ex 12; Q05 × Ex 06; Q02 × Ex 10: mesmo conteúdo, formulação diferente
  - Nota: Não é contradição: os números batem (10 × 5,50 × 7,2 = 396). Registrado porque a Ex 14 abre a resposta da Q07 se feita antes (C7).
- **div-m15-ap-04-caso-parte** (fonte×decisão) — Caso numerado como "parte 15".
  - §Caso .sec-id: Operação A — parte 15
  - P17: Não existe "Parte 1"; título "Caso — Operação A"
  - Nota: Ver modulo.json div-m15-05.
- **div-m15-ap-05-ref-sem-data-item** (fonte (lacuna declarada)) — h2 do §Ref promete "data de consulta" por fonte; os itens não a trazem.
  - §Ref h2: Trinta e seis fontes, com data de consulta
  - §Ref lede: Todas verificadas em 4 de agosto de 2026.
  - Nota: A data é única para a seção; nenhum item tem data de consulta própria.
- **div-m15-ap-06-normas-sem-ref** (fonte×fonte) — Normas citadas no corpo sem item próprio no §Ref.
  - Aula 04: MP nº 1.363
  - Nota: Ver referencias.normas_nota (comparação mecânica; alguns atos podem estar cobertos por item genérico).
- **div-m15-ap-07-fichas-codigo** (fonte×código) — Campo "Preencha." das 6 fichas de elo vira nota estática no código.
  - fonte: Preencha. A produção do campo não diz a participação econômica de cada sócio no consórcio, não diz o preço realizado, não diz…
  - alexandria-modulo-15-content.ts: kind: "nota" (tom neutro, label null) com os pares em <b>…</b>
  - Nota: A atividade de produção (preencher e depois comparar) não existe como atividade no código.
- **div-m15-ap-08-exercicios-points** (fonte×código) — points: 10 nos 15 exercícios.
  - código: points: 10
  - fonte: sem pontuação por exercício
  - Nota: Valor sem origem na fonte.

## Verificação

Verificador independente (scripts próprios, sem reaproveitar `lib.mjs` nem `verify-m15.mjs`): o `var Q` do quiz
foi avaliado direto do HTML e comparado campo a campo; checklist, exercícios, glossário, referências, erros comuns e
roteiro oral foram reparseados por regex próprio e comparados em igualdade estrita (html com espaços colapsados);
as 558 origens com `linha_aprox` dos três JSONs foram conferidas contra a janela de ±3 linhas; as linhas de cálculo,
fórmulas de exibição e ramos dos 10 instrumentos foram conferidos na linha declarada; os `dados_script` foram
reavaliados do literal e comparados em profundidade; as contagens foram recontadas no HTML.

Resultado neste grupo: 10/10 questões do quiz (enunciado, 4 alternativas, gabarito e feedback
idênticos ao `var Q`; distribuição A2·B2·C3·D3 confirmada), 2 faixas de placar idênticas, 28/28 itens do
checklist, 15/15 exercícios (enunciado e resposta), 174/174 termos (termo e definição; famílias 24·20·22·18·22·28·20·20),
36/36 referências (0 com URL). As 6 fichas "Preencha." estão nas linhas 1235, 1249, 1931, 2283, 2297 e 2485.

Única correção aqui: `fonte.linhas_total` passou de 4141 para 4140 (ver Correção 4 em `modulo.md`).

**Segunda verificação adversarial (2026-09-17), sem correções.** Scripts novos, sem reaproveitar os extratores:
as 548 origens com `trecho_inicial` ficaram dentro de ±3 linhas; 1.003 campos de texto e 1.103 campos html/script
foram buscados na fonte normalizada, e as únicas ausências são anotações (`literal` das divergências, que compõem
leituras) e textos calculados (`cenario_padrao.veredito`), além do espaço que o `texto` das fichas insere antes de
`span.mini`. Houve igualdade estrita em 10/10 questões do quiz, 2/2 faixas, 28/28 itens do checklist, 15/15
exercícios, 174/174 termos, 36/36 referências, 20/20 erros e 9/9 trechos de voz. Conferiram também as 34 fórmulas
de readout (cada escrita do script, na linha declarada), as 88 linhas de cálculo e os 25 ramos, que batem com as
25 classes `verdict` do script. As contagens recontadas no HTML batem com as declaradas: 33 entradas, 11 grupos
`seg`, 34 células `ro`, 11 linhas "GridAlpha" (10 + 1 no script), 10 blocos P7 e 6 "Preencha.". Os 4 valores
distintos de seg, os 5 de reg, os 4 de ac e os 9 de pr foram reavaliados do `var ELOS`. As afirmações sobre o
código foram reconferidas: `RECURSOS` vai até `modulo-09`, `O&amp;M` aparece na L693, `put("ac-gb", gb)`,
o painel usa `maximumFractionDigits` e há 2/2 horas em `alexandria-blocks.ts`.
