# M01·A03: Corrente alternada e frequência

**A rede tem um batimento cardíaco. Ele se chama 60 Hz.**

Arquivo de dados: [`aula-03.json`](aula-03.json).

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html`, 3.212 linhas. A section da aula ocupa as linhas 1585 a 1646 (o comentário de abertura está nas linhas 1582 a 1584).
- **Como foi extraído:** `extratores/gen-aulas-03-04.mjs` percorre a section linha a linha e lança erro se encontrar uma linha que não classifica. O campo `html` guarda o innerHTML literal; `texto` guarda o mesmo sem tags (tags removidas sem espaço, então `<sub>`/`<span>` vizinhos colam). Nenhuma prosa foi digitada à mão.
- **Cobertura por token (§5):** 525 de 525 tokens casados (100%). Tokens não casados: nenhum.
- **Verificação:** ver a seção "Verificação" no fim.

## Estrutura do JSON

| Chave | Conteúdo |
|---|---|
| `meta` | Fonte, linhas, método, convenções de id e de campos medidos |
| `aula` | Marcador ("Aula 03"), título do h2 (html e texto), comentário de abertura e a pergunta do § MAP (L1341): "Por que a rede oscila 60 vezes por segundo, e por que isso importa?". Duração, dificuldade e vídeo ficam em `null`, com nota |
| `blocos[]` | 17 blocos na ordem da fonte (ver mapa abaixo). Cada bloco tem `origem {seletor, trecho_inicial, linha_aprox, linha_fim_aprox}` |
| `figuras[]` | `m01-a03-fig-01`: duas células (DC e AC), cada uma com h5, rótulo e svg (elementos line/path com atributos literais). Sem título, sem escala, sem fonte citada: campos `null` com nota |
| `tabelas` / `listas` / `destaques` | ids dos blocos de cada tipo: 0 tabela(s), 0 lista(s), 1 destaque(s). "Vale lembrar" não existe na fonte |
| `paragrafos_que_terminam_em_dois_pontos` | Medida de quais parágrafos prometem um bloco seguinte e qual bloco a fonte põe em seguida |
| `termos_lexico` | Candidatos por correspondência textual (sem vínculo declarado), com contexto e a leitura de cada um |
| `instrumentos[]` | Vazio: a aula não tem instrumento |
| `exercicios[]` / `exercicios_verificacao` | Vazio: nenhuma tag "Aula 03" no § Drill; as 8 tags verbatim e a varredura de referências em prosa |
| `relacionados_nao_vinculados[]` | m01-quiz-q02, m01-checklist-08, m01-checklist-09 (sem tag de aula, fora da posse da aula, P9) |
| `ocorrencias_fora_da_secao` | Varredura do arquivo inteiro por padrão temático (50 ocorrências) com a leitura por seção |
| `divergencias[]` | 4 divergências da fonte, cada uma com as duas leituras e sem escolha |
| `comparacao_codigo` | Verificação estruturada contra o .ts, o que está conforme e 7 divergências COD |

## Mapa de blocos

| # | Tipo | Linhas | Início do texto |
|---|---|---|---|
| 1 | lead | L1590 | A rede elétrica brasileira oscila sessenta vezes por segundo |
| 2 | titulo 3.1 | L1592 | DC: o fluxo constante |
| 3 | paragrafo | L1593 | Corrente contínua (DC) tem fluxo em uma direção principal co |
| 4 | titulo 3.2 | L1595 | AC: o fluxo que oscila |
| 5 | paragrafo | L1596 | Corrente alternada (AC) tem fluxo cujo sentido alterna perio |
| 6 | figura | L1599–1619 | Direct Current |
| 7 | titulo 3.3 | L1621 | Por que AC venceu historicamente |
| 8 | paragrafo | L1622 | Na chamada Guerra das Correntes do final do século XIX (West |
| 9 | paragrafo | L1624 | Essa habilidade de mudar de tensão é o que torna possível tr |
| 10 | paragrafo | L1626 | DC volta com força hoje em aplicações específicas: solar fot |
| 11 | titulo 3.4 | L1628 | Frequência: o termômetro do equilíbrio |
| 12 | paragrafo | L1629 | A regra física que governa todo sistema interligado em corre |
| 13 | formula | L1631–1634 | Geração ≈ Consumo, em tempo real |
| 14 | paragrafo | L1636 | Se o consumo aumenta e a geração não acompanha, a frequência |
| 15 | destaque | L1638–1641 | Conexão com o Bloco 02 (próximo módulo) |
| 16 | titulo 3.5 | L1643 | Por que isso afeta o consumidor industrial |
| 17 | paragrafo | L1644 | Quedas ou desvios relevantes de frequência afetam diretament |

**Contagens.** 17 blocos: lead 1, titulo 5, paragrafo 8, figura 1, formula 1, destaque 1. Seções 3.1, 3.2, 3.3, 3.4, 3.5. Fórmulas 1 (1 com descrição). Figuras 1, tabelas 0, listas 0, destaques 1, instrumentos 0. Exercícios vinculados 0, relacionados sem vínculo 3, termos candidatos 7 entre os 38 do léxico. Divergências: 4 da fonte e 7 com o código.

## Figura m01-a03-fig-01: DC × AC

- **"Direct Current"** (L1601–1609). Rótulo: "Constante · usada em baterias, solar pré-inversor, eletrônica". svg viewBox `0 0 300 80`, 3 elementos (line #06B6D4; line #2A2E38; line #2A2E38).
- **"Alternating Current — 60 Hz"** (L1610–1617). Rótulo: "Oscilante · padrão da rede pública brasileira". svg viewBox `0 0 300 80`, 2 elementos (path#ac-wave #F59E0B; line #2A2E38). Medido do desenho: 8 semiondas (4 ondas) no quadro de 300.

Sem título, sem escala, sem unidade e sem texto dentro do svg (medido). Os dois h5 estão em inglês e a CSS os põe em caixa alta. Nenhuma fonte citada. O texto da aula que descreve o sinal está em 3.1 (Sinal "reto" no osciloscópio) e em 3.2 (Sinal senoidal no osciloscópio). Medido: #ac-wave aparece 1 vez no arquivo (na marcação) e o único @keyframes do arquivo é fadeUp (L1227), então a figura não tem animação própria.

## Parágrafos que terminam em ":" (o que a fonte põe depois)

| Parágrafo | Termina em | Próximo bloco na fonte |
|---|---|---|
| L1629 | "…alternada é simples e absoluta:" | formula |

## Exercício

Nenhum exercício do § Drill tem a tag "Aula 03" (as 8 tags estão em exercicios_verificacao) e nenhum enunciado ou gabarito cita a Aula 03 em prosa. A A03 é uma das três aulas do M01 sem exercício (junto da A06 e da A09); ver DIV-05 de aula-08.json sobre "todas as nove aulas".

## Relacionados sem vínculo de aula (P9)

- `m01-quiz-q02` (L3084): Em corrente contínua aproximada, qual a relação entre tensão, corrente e potência?
- `m01-checklist-08` (L2504): Explicar AC vs DC sem virar história longa de Tesla vs Edison.
- `m01-checklist-09` (L2505): Explicar frequência como evidência física do equilíbrio geração-consumo.

## Léxico: candidatos e leitura do contexto

| Termo | Ocorrências (palavra) | Leitura |
|---|---|---|
| Corrente alternada (AC) | 4 | Conceito do verbete. Definido em 3.2; "a corrente alternada venceu" em 3.3 e o marcador "Corrente alternada e frequência". Ligação plausível, não declarada. |
| Corrente contínua (DC) | 2 | Conceito do verbete. Definido em 3.1; "elos de corrente contínua" em 3.3. Ligação plausível, não declarada. |
| Frequência | 11 | Conceito do verbete, assunto da aula (título, 3.4, 3.5). Ligação plausível, não declarada. |
| ONS | 3 | Conceito do verbete, citado no lead, em 3.4 e no callout. n_ocorrencias conta o trecho "ons" dentro de "Conexão", "consumo" etc.; use n_ocorrencias_como_palavra. |
| Tensão | 4 | Sentido do verbete em 3.3 ("elevar e reduzir tensão usando transformadores"). Não é o assunto da aula; ligação fraca. |
| Energia | 3 | Ocorrências em sentido genérico ou composto ("transmitir energia", "organiza energia", "qualidade de energia" — este último é o tema de outra aula). Não é o assunto declarado; não mapear. |
| Demanda | 2 | Ocorrência em "oferta e demanda" (sentido econômico), diferente do verbete (potência exigida em kW). Não mapear. |

## Divergências na fonte (sem escolha)

- **DIV-01** (terminologia_interna_sem_definicao). O mesmo "60" é chamado de oscilação, alternância e ciclo, sem que a fonte defina os termos.
  - Leitura A (L1596): "No Brasil, a alternância ocorre 60 vezes por segundo — frequência de 60 Hz." e "oscila sessenta vezes por segundo" (L1590)
  - Leitura B (L2541): "No Brasil, a frequência da rede pública é de 60 Hz — sessenta ciclos por segundo." e "Número de ciclos por segundo de uma corrente alternada." (L2589)
  - A aula (lead e 3.2) fala em "oscila" e em "alternância" 60 vezes por segundo; o léxico fala em "ciclos" por segundo. A fonte não define "alternância", "oscilação" nem "ciclo" e não diz quantas inversões de sentido há por ciclo. Não é contradição demonstrada pela fonte; fica registrada porque o learner lê os três termos como sinônimos sem a fonte autorizar.
  - Decisão: não escolhida — termos preservados como na fonte.
- **DIV-02** (duas_cadencias_sem_relacao_declarada). A aula cita duas cadências para o equilíbrio entre oferta e demanda: sessenta por segundo e uma por segundo.
  - Leitura A (L1590): "A rede elétrica brasileira oscila sessenta vezes por segundo. Esse ritmo não é arbitrário — é a evidência física de que oferta e demanda estão em equilíbrio em tempo real."
  - Leitura B (L1640): "Coordena um sistema físico que precisa equilibrar oferta e demanda 86.400 vezes por dia — uma vez por segundo, todos os segundos."
  - No lead, o ritmo de sessenta por segundo é a "evidência física" do equilíbrio; no callout, o ONS equilibra oferta e demanda "uma vez por segundo". A fonte não diz se são a mesma coisa nem como se relacionam. Não é contradição demonstrada; é uma lacuna que um leitor atento vai notar.
  - Decisão: não escolhida — as duas formulações coexistem na fonte.
- **DIV-03** (promessa_de_retorno_sem_correspondente_encontrado). A 3.5 promete voltar ao tema da frequência na Aula 09.
  - Leitura A (L1644): "Quando estudarmos qualidade de energia na Aula 09, voltaremos a este ponto."
  - Leitura B (L2114–2129): "Frequência e duração de interrupções \| Frequência Equivalente de interrupção por unidade Consumidora \| Frequência de Interrupção individual"
  - Busca por "frequência" e "Hz" dentro da Aula 09 (L2100–2174) acha só 3 linhas (L2114, L2127, L2129), todas no sentido de contagem de interrupções (frequência e duração de interrupções; FEC; FIC), e nenhuma com "Hz". Busca adicional na A09 por "síncron", "sincronismo", "desarm" e "equilíbrio": 0 ocorrências ("drives" ocorre 1x, em Harmônicos, L2143, sem relação declarada com frequência). Retomada com outras palavras não foi procurada.
  - Decisão: não escolhida — a promessa fica registrada; o fio de retorno é decisão da camada Alexandria, não da extração.
- **DIV-04** (rotulo_bloco_x_modulo). O callout chama o que vem depois de "Bloco 02"; o resto do arquivo chama de "Módulo 02".
  - Leitura A (L1639): "Conexão com o Bloco 02 (próximo módulo)"
  - Leitura B (L3199): "Pronto para o Módulo 02." e "02 · A Rede Elétrica" (L1276)
  - "Bloco" aparece uma única vez no arquivo (medido, L1639); o hero-meta (L1276) e o script do quiz (L3199) usam "02 · A Rede Elétrica" e "Módulo 02". O rótulo do callout é literal e o corpo dele diz "próximo módulo". O nome canônico do módulo seguinte é decisão de catálogo (P8/P24).
  - Decisão: não escolhida — rótulo literal preservado.

## Divergências em relação ao código portado

| Id | Gravidade | Onde | Divergência | Fonte |
|---|---|---|---|---|
| COD-01 | alta | MODULO_01_CORPO['aula-01-03'] | A figura DC × AC (div.ac-dc-vis: duas células, cada uma com h5, rótulo e svg) não existe no corpo portado. Nenhum bloco a representa: nem os 2 títulos em inglês, nem os 2 rótulos, nem a senoide e a reta. Perda silenciosa (§5, §12). | L1598–1619 |
| COD-02 | média | MODULO_01_CORPO['aula-01-03'] bloco de 3.2 | O parágrafo de 3.2 não é verbatim: o <span class="hl"> que envolve "60 Hz" foi removido e o </span> de fechamento ficou ("frequência de 60 Hz</span>."). Fecha-se tag sem abertura: 1 no corpo da aula. | L1596 |
| COD-03 | média | MODULO_01_CORPO['aula-01-03'] fórmula de 3.4 | A fórmula foi portada com desc: null. A fonte tem div.desc: "Desequilíbrio se manifesta como desvio de frequência" (a frase que diz como o desequilíbrio se manifesta). A eq confere ("Geração ≈ Consumo, em tempo real"). | L1631–1634 |
| COD-04 | média | MODULO_01_CORPO['aula-01-03'] callout de 3.4 | O callout gold foi portado como nota { label: null, html: "Conexão com o Bloco 02 (próximo módulo)" } seguida de parágrafo solto com o corpo. Na fonte o texto é o RÓTULO (div.callout-label) e o parágrafo é o CORPO do mesmo callout. O corpo está verbatim; a hierarquia rótulo/corpo ficou partida (mesmo padrão de COD-08 da aula-08). | L1638–1641 |
| COD-05 | baixa | MODULO_01_AULAS aula-01-03 .illustrations | illustrations lista 3 arquivos (fis-01-dinamo-cc.png, fis-02-alternador-ca.png, fis-06-medidor-frequencia.png); a fonte não tem nenhum <img> (medido no arquivo inteiro), então essas gravuras não têm contraparte no HTML. Origem a confirmar fora desta extração. | arquivo inteiro (0 <img>) |
| COD-06 | baixa | alexandria-glossario.ts aulaIds | aulaIds inclui "aula-01-03" em 6 verbetes (Corrente alternada (AC); Corrente contínua (DC); Energia; Frequência; ONS; Tensão). A fonte não declara aula por termo; a ligação é derivação do código. "Energia" casa só por sentido genérico (ver leitura_do_contexto). | L2540–2640 |
| COD-07 | informativa | ids | Código usa "aula-01-03"; esta extração usa "m01-a03" (id estável com prefixo de módulo). Mapeamento 1:1. | — |

**O que está conforme:**
- Lead (p.lead) verbatim em MODULO_01_LEAD["aula-01-03"].
- Os 5 títulos 3.1–3.5 conferem (número e texto).
- Os parágrafos de 3.1, 3.3 (×3), 3.4 (×2) e 3.5, e o corpo do callout, estão verbatim (7 de 8 parágrafos; o de 3.2 diverge em COD-02).
- A eq da fórmula de 3.4 confere.
- Título da aula = texto do h2 sem <em> (conferido: igual); subtítulo = marcador (conferido: igual).
- activities: [] e instruments: [] — coerente com a fonte (zero exercício com tag, zero instrumento).
- durationMinutes/difficulty/video = null, coerente com a fonte.

## O que a fonte não tem (ausência declarada)

- Sem duração, dificuldade, vídeo, <img>, instrumento, exercício com tag ou "Vale lembrar" dentro da section. Medido na section L1585–1646; o arquivo inteiro não tem <img>, <video> nem <iframe>.
- Pergunta de previsão, tolerâncias, gabarito de instrumento: não existem na fonte (P3/P6/P11).
- A figura não tem título, escala, unidade nem fonte citada.
- Vínculo entre aula e termo do léxico, ou entre aula e item de quiz/checklist: não declarado.

## Pendências do Founder

Esta aula não toca QA-M01-A06 (Grupo A ≥ 2,3 kV × subgrupo AS) nem QA-M01-A07 (FP 0,85 → 15% de reativos). 

## Verificação

<!-- verif:start -->
Rodei `node extratores/verify-aulas-03-04.mjs` (independente do gerador) em 2026-11-14. Resultado:

- 1) LITERAL   strings de conteúdo verificadas: 139; presentes: 139 (89 dentro da janela de origem ±3 linhas, 50 só por existência no arquivo); falhas de literal: 0. Chaves editoriais ignoradas (nota/argumento/decisão/medido…): 226.
- 2) ORIGEM    origens com linha: 102; trecho inicial achado dentro de ±3 linhas: 102; falhas: 0.
- 3) LINHAS    linhas de conteúdo na section: 39 (+23 estruturais: div/section/comentário/branco); sem bloco dono: 0; com mais de um dono: 0; blocos em ordem crescente.
- 4) COBERTURA 525 de 525 tokens da fonte casados (100%); não casados: nenhum; tokens extraídos sem par na fonte (duplicações de html/texto não contam; só campos canônicos): 0.
- 5) CONSISTÊNCIA pares html/texto conferidos: 17; falhas: 0.
- 6) .TS       blocos ditos verbatim e achados no .ts: 8; blocos ditos ausentes e confirmados ausentes: 1; falhas: 0.

**RESULTADO: 0 falhas.**
<!-- verif:end -->
