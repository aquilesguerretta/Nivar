# ALEXANDRIA v2 BAR — v1.1

> **O que é.** Contrato visual e de experiência do Design Loop da Alexandria v2 (`/alexandria`).
> O Founder aprova este documento antes de qualquer build. Depois, ele é a régua dos critics Brief, System e Craft,
> que julgam **só renders** (screenshots, filmstrips, playback), nunca código.
>
> **Precedência.** Gates deste bar e lista "Não copiar" (§0.1) → North Star visual aprovado (piso de qualidade e
> identidade, não teto) → heurísticas deste bar → `alexandria-tokens.ts` → Reference Pack.
>
> **Padrão de referência.** M01 e a Trilha 1 são o padrão-ouro. O que for aprovado neles vira a régua dos outros módulos.
>
> **Fatos.** Medidos em 2026-09-16 no render de produção (sem login; o código da Alexandria é idêntico ao da branch
> base), no código e nos 17 HTMLs-fonte.
>
> **Acesso às referências.**
>
> | Sigla | Significado |
> |---|---|
> | obs | Visto |
> | ref | Teardown textual do Refero |
> | parc | Só texto; UI bloqueada |
> | bloq | Não abriu |

---

## Como ler este bar: Gates × Heurísticas

Cada mecanismo tem duas camadas.

- **Gate** (binário). Condição cuja violação reprova a peça. Os gates protegem verdade, acessibilidade, pedagogia e
  a categoria do produto.
- **Heurísticas** (quebráveis). Orientação quantitativa ou compositiva. O critic usa as heurísticas para diagnosticar,
  e o builder pode quebrá-las **quando o render ficar claramente mais forte**. Quem quebrar uma heurística nomeia qual
  foi e por quê; o critic julga se o resultado é mais forte. Se não for, essa é a maior lacuna.

**Não otimize a Alexandria para os números. Otimize para o mecanismo que os números protegem.**

Formato de cada mecanismo: **Gate** · **Heurísticas** · **Verificação** · **Responde a** · **Evidência**
(referência → problema medido → o que não transferir).

---

## 0. Product Thesis

**Como está hoje.** A Alexandria se apresenta como arquivo.
- A Home lidera com inventário e um botão que só rola a página.
- O progresso exibido é um mock igual para qualquer visitante.
- O mapa é uma coluna de nós pequenos num campo vazio.
- A aula abre anunciando que o vídeo não existe, põe o instrumento depois de toda a prosa e termina em avisos
  "ainda não existe" e num botão "concluída" sem pré-condição.
- O glossário é uma lista de 75.758px.

**O que a v2 é.** Um **atlas vivo do conhecimento em energia**: uma expedição de domínio intelectual.
- O caráter vem de atlas científico, publicação técnica, arquivo e caderno de campo.
- O comportamento é de produto contemporâneo.
- *Pode parecer antiga; nunca desatualizada.*

**Quatro compromissos, visíveis no render.**
1. **Orientação.** Toda tela diz onde o learner está, o que fazer agora (objeto e motivo) e o que mais explorar.
2. **Ação.** Toda aula pede ao learner um ato autêntico com o conhecimento.
3. **Progresso honesto.** Duas camadas que não se misturam:
   - **Evidência de aprendizagem:** Percorrido, Praticado e Demonstrado (S3).
   - **Motivação:** XP, sequência, conquistas, marcos.

   A motivação nunca se apresenta como prova de competência.
4. **Evidência.** Todo número factual tem fonte à vista. Toda imagem é honesta sobre ser evidência, explicação ou
   atmosfera.

**O aparato já existe e não é reescrito.** O HTML-fonte já contém:
- 165 instrumentos;
- 214 exercícios com resposta de referência;
- quiz por módulo;
- 423 itens de checklist;
- critério por módulo;
- caso Operação A em 17 partes;
- 2.124 termos.

**O que o redesign pode escrever.**
- Pode criar texto conectivo de aprendizagem (objetivos, perguntas de previsão, atos) quando derivado fielmente da
  fonte e revisável.
- Conteúdo factual curricular novo exige revisão (P3, P11).

**Teste anti-LMS genérico (Gate).** Se a tela puder ser re-skinned e vendida como LMS genérico, falhou.

O critic verifica a 1440, em E2, no 1º ou no 2º viewport. A superfície precisa mostrar **pelo menos 3** destes
marcadores próprios:
1. território ou rota com a posição do learner (uma lista de aulas sozinha não conta);
2. fonte junto a um número ou item de consulta;
3. ato do learner registrado (e, havendo referência, antes dela; previsão → calculado conta);
4. previsão antes do resultado, onde a previsão ensina;
5. classe de imagem honesta;
6. gravura ou cartografia que faz trabalho.

Exceções:
- **Aula:** continua valendo o mínimo de 3. O marcador 3 é obrigatório. O 4 só é obrigatório quando a aula tem
  previsão útil. Os dois são verificados no filmstrip da aula inteira.
- **Glossário e Biblioteca:** os marcadores são substituídos por duas exigências, ambas visíveis em cada item: fonte e
  âncora curricular (ou o estado "não declarado").

---

## 0.1 North Star aprovado: preservar, não copiar, ir além

**Preservar.**
- Não parecer LMS. Nenhuma grade de cards intercambiáveis, nenhum dashboard.
- Identidade de atlas **estrutural**. Mapa, gravura e marca cartográfica organizam ou explicam.
- Paleta pergaminho/navy/tinta, com terracota, oliva e ouro como pontuação.
- Nenhuma sidebar permanente.
- Home como entrada num mundo, sem inventário como protagonista.
- Trilhas como territórios.
- Aula editorial com explicação no fluxo, recall e aplicação.
- Progresso quieto, com a jornada como território.
- Hierarquia de vozes: identidade × conteúdo × aparato.
- Presença e identidade no nível da composição **Titã + globo**. Ela é a régua atual, **não um requisito**: o builder
  pode superá-la com outro objeto-mundo.

**Não copiar** (falhas do conceito):
- breadcrumb que põe o M01 na trilha errada;
- contagens de progresso incompatíveis com o currículo;
- foto com aparência de gerada legendada como "UHE Itaipu";
- vídeo como herói da aula;
- exercícios em aba;
- abas de funções inexistentes;
- donut de "% da trilha" sem escopo;
- conquistas que alegam competência por consumo;
- excesso de aforismos e coluna de lemas latinos;
- três trilhas de mesmo peso;
- Home sem portais;
- globo que não trabalha;
- aula sem nenhum ato.

**Ir além.** Cada peça declara uma linha **"Além do conceito"**, verificável no render.

---

## 1. Master System Bar

S1–S7 valem para Home, Trilhas, Mapa, Módulo, Aula, Progresso, Glossário e Biblioteca. Falhar num gate de S reprova a
peça. O Atlas não é redesenhado nesta rodada; se for tocado, herda S2, S4 e S7.

### S1 — Um centro de gravidade e uma próxima ação nomeada

**Gate.**
- **Região dominante.** Numa captura em miniatura ou desfocada do 1º viewport, o critic nomeia a região dominante e
  a hierarquia pretendida.
- **Ação principal.** Onde houver próximo passo (1º viewport de Home, Trilhas, Mapa, Módulo e Progresso), há
  **exatamente uma** ação principal visualmente inequívoca.
  - O rótulo nomeia objeto e motivo, por exemplo "Continuar · M01·A08 — 100 MW solar ≠ 100 MW térmica".
  - "Começar", "Ver mais" ou "Continuar" sem objeto não servem.
  - O destino é um objeto de estudo. Rolar a página não conta.
- **Na aula.** A ação principal é o primeiro ato pendente, ou uma ação nomeada que leva a ele (ex.:
  "Começar leitura → ato: estimar o fator de capacidade"). Depois do ato, vale C10.

**Heurísticas.**
- Um único controle preenchido por viewport.
- Região dominante ≈ 1,5× a segunda.
- Regiões dominantes sugeridas:

  | Tela | Região dominante |
  |---|---|
  | Home | Objeto-mundo + retomada |
  | Trilhas | Território atual |
  | Mapa | Rota com posição |
  | Módulo | Bloco de missão |
  | Aula | Abertura |
  | Progresso | Jornada |
  | Glossário | Termos do módulo atual |
  | Biblioteca | Registro de fontes |

**Verificação.** A 1440 e a 390, nos estados E0 e E2:
- teste de miniatura: nomear a região dominante e a ação;
- ler o rótulo;
- filmstrip do clique, com a barra de endereço.

**Responde a.** Centro de gravidade; próxima ação óbvia.

**Evidência.**
- Monad e Seline (ref): acento só no CTA primário.
- Steep (ref): uma superfície cromática por página.
- CTA Gallery (parc): o rótulo nomeia o ganho.
- Atlas (obs): um palco.
- **Problema.** "COMEÇAR MINHA TRILHA ↓" só rola a página; "Próxima aula" não é clicável.
- **Não transferir.** Pílulas; cores de acento.

### S2 — Materialidade, cor como pontuação, vozes e contenção

**Gate.**
- **Forma.** Raio 0, exceto em círculo pleno. Zero sombra, gradiente, vidro ou brilho. Profundidade só por fio de 1px
  ou troca de superfície.
- **Zero semáforo.** Nenhuma cor codifica certo/errado. Toda cor não neutra de UI e de figura de dado casa com um
  token (ΔE00 ≤ 5 contra a tira de amostras do §8).
  - Ficam fora dessa regra: fotografia documental e ilustração explicativa.
- **Paleta-base.** Pergaminho, navy e tinta só mudam com comparação lado a lado e aprovação do Founder.
- **Tipografia.** Título de conteúdo nunca em caixa alta total. Parágrafo nunca na voz de identidade.
- **Sem fantasia grega.** Proibidos: templo, coluna, frontão, meandro, louro, tipografia pseudo-grega, UI de tema
  grego e fantasia.
  - **Mitologia** só como material simbólico editorial contido: nunca costume, nunca cobrindo dado, posição ou
    rótulo, nunca apresentada como evidência.
- **Marca.** Nunca escudo, brasão, coroa, louro ou cartela. A marca NIVAR não aparece dentro de `/alexandria`.
- **Lema latino.** Sempre com tradução. Coluna ou lista de palavras latinas é proibida.

**Heurísticas.**
- **Cor.**
  - Terracota como pontuação rara (≈ 1 ocorrência por viewport).
  - No máximo uma região de ênfase (navy ou creme afundado grande) por viewport.
  - Ouro só sobre navy; oliva marca território.
- **Figuras.** Até 4 categorias, com uma série carregando o argumento e rótulos diretos.
- **Vozes.**

  | Voz | Uso | Tratamento |
  |---|---|---|
  | Identidade | Marca, nav, rótulos de seção | Caixa alta espaçada |
  | Conteúdo | Títulos | Serifa em caixa alta e baixa |
  | Leitura | Texto corrido | 16–18px, 60–72 caracteres por linha |
  | Aparato | Dados | Algarismos tabulares, unidade, pt-BR, versalete real |

- **Figura mítica.** Rara (≈ 1 por rota).
- **Citações.** Raras. Uma forte vale mais que seis.
- **Textura.** Imperceptível atrás de texto pequeno.

**Verificação.** A 1440, em E2:
- contar raios, sombras e gradientes;
- comparar as cores com a tira de amostras;
- capturas em cinza;
- procurar títulos em caixa alta;
- marca a 24px (legível) e a 16px (símbolo distinto).

**Responde a.** Identidade no primeiro frame; materialidade; contenção.

**Evidência.**
- Steep (97%) e Ventriloc (95%), ref: sistemas acromáticos.
- Monad e Ventriloc (ref): hierarquia por fio e superfície.
- NASA Ap. F (obs): cor só com significado; unidade em cada valor.
- Economist (parc): ≤ 4 categorias.
- **Problema.** Raio de 12px; textos de 8–10px.
- **Não transferir.** Sombras do Cursor e do Steep; Inter; tokens de NIVAR G2, Portal e Terminal.

### S3 — Evidência de aprendizagem separada de motivação

**Gate.**
- **Camada de evidência de aprendizagem.**

  | Eixo | O que conta |
  |---|---|
  | Percorrido | Consumo ou navegação registrada |
  | Praticado | Tentativa registrada numa tarefa |
  | Demonstrado | Só uma tarefa **explicitamente portadora de evidência**, com regra de avaliação compatível com a capacidade afirmada |

  Enquanto essa tarefa não existir: **"Demonstrado: ainda não avaliado"**.
- **Avaliação do módulo.** O quiz é **resultado de avaliação**, não Demonstrado: "Avaliação do módulo: aprovada ·
  X/10 · critério da fonte" (P5).
- **Camada de motivação.** XP, sequência, conquistas de exploração e marcos são permitidos, com três limites:
  - ficam separados, visual e verbalmente, das linhas de evidência;
  - nunca usam palavras de competência;
  - nunca aparecem como prova de aprendizagem.
- **Percentual.**
  - Só com escopo explícito ("62% do conteúdo percorrido").
  - Nenhum percentual combina eixos.
  - Percentual de capacidade só dentro de Demonstrado, com escopo e baseado em tarefas portadoras de evidência.
- **Palavras de domínio.** "Domínio" e "dominado" (no sentido de competência) e "mastery" só aparecem junto de Demonstrado.
- **Sem trava sequencial (P13).** Pré-requisito é orientação.
- **Estados.** Nunca só por cor: cada estado tem silhueta e palavra. A legenda de glifos fica acessível no Mapa e no
  Progresso.
- **Números.**
  - Nenhum número vem de mock.
  - Nenhum progresso persistido aparece em E0. Valores digitados na sessão, dentro de um ato, são permitidos.
  - O mesmo estado mostra o mesmo número em todas as telas.
- **Sem evento.** O estado aparece em palavras, nunca como 0 ou traço.

**Heurísticas.**
- Vocabulário de estados: não iniciada · a seguir · em leitura · percorrida · com prática · a revisar · demonstrado ·
  você está aqui (marca de posição que envolve o glifo).
- Motivação em corpo menor e abaixo da evidência. Celebração só em marco, tipográfica, sem bloquear o fluxo.

**Verificação.** Em E2 e E3:
- capturas em cinza, com as palavras cobertas: as silhuetas são distintas e casam com a legenda;
- buscar "%" e conferir o escopo;
- buscar "XP" e conferir a camada;
- comparar números entre telas.

**Responde a.** Progresso sem dashboard; progresso que não finge competência; gamificação sem epistemologia ruim.

**Evidência.**
- Khan (parc): níveis por habilidade; a % conta só habilidades proficientes.
- DataCamp (parc): certificação ≠ conclusão.
- Duolingo (parc): sequência como hábito, separada do estado de aprendizagem.
- NASA F.5.10 (obs): cor precisa de pista adicional.
- **Problema.** Mock "12 de 42 · 480 pontos · 2 de 13 · 4 dias" exibido para visitante; XP como status na Home;
  13 regras de insígnia nulas.
- **Não transferir.** Ligas; gemas; "mastery" por pontos.

### S4 — Fonte à vista, imagem honesta, ausência honesta

**Gate.**
- **Fonte visível.** Todo número factual (instrumento, figura, tabela, mapa) tem fonte visível junto ao bloco, na
  mesma tela, com acesso à ficha. Rodapé geral ou outra página não bastam.
- **Ausência honesta.** A ausência nunca:
  - vira zero ("sem dado — não é zero");
  - vira aba, card ou placeholder de função inexistente;
  - ocupa o topo da aula.
- **Rótulos de ausência permitidos.** Linha de metadado, sem aparência de controle:
  - "em desenho": experiência projetada, ainda não construída (P16);
  - "ainda não disponível": dado ou função que depende do §9;
  - "não declarado": a fonte não informa.

  Nenhum deles é estado final do produto.
- **Classe de imagem.** Nenhuma imagem engana sobre a própria classe (§7).
- **Linguagem interna proibida ao learner.** "backend", "extraído do HTML", "extração", "aulas confirmadas",
  "a fonte declara", "wave", "mock" e os códigos "§00", "§MAP", "§Final", "§Caso" e "§Quiz".

**Heurísticas.**
- Fonte a ≈ 24px abaixo do bloco, antes da prosa que o interpreta.
- Ausência numa linha de metadado, sem repetir a mesma frase no viewport.

**Verificação.** Na M01·A08 (1440, E2), no Glossário e na Biblioteca:
- posição da fonte;
- ausência no topo da aula;
- palavras proibidas;
- filmstrip da fonte até a ficha.

**Responde a.** Evidência; ausência declarada.

**Evidência.**
- OWID grapher (obs): Source → Note → licença logo sob o gráfico.
- Atlas (obs): "sem dado — não é zero".
- **Problema.** "VÍDEO EM PRODUÇÃO" em 141/141 aulas; "o backend não tem tabela de anotação"; nota repetida 518 vezes.
- **Não transferir.** Azul de link; modal cinza.

### S5 — Localização constante, sem sidebar permanente

**Gate.**
- **Sidebar.** Nenhuma sidebar ou rail permanente, em nenhuma largura. Gaveta temporária:
  - abre por gatilho com rótulo;
  - fecha com Esc;
  - começa fechada no 1º quadro;
  - não tem placeholder.
- **Header: seis funções.** A ordem e o comportamento (fixo ou recolhível) ficam para o Design Loop (P15), desde que
  a localização sobreviva à rolagem.
  1. identidade Alexandria;
  2. navegação global para Trilhas, Atlas, Glossário e Biblioteca;
  3. localização atual;
  4. busca, **quando a busca for real**;
  5. entrada de conta e progresso;
  6. transformação mobile forte.
- **Localizador.** Aparece fora da Home, com nomes iguais ao dado reconciliado (P8). O item atual não é link.
- **Item ativo da nav.** Marcado por mais que cor.
- **Rótulos.** O mesmo rótulo leva à mesma URL no header e no rodapé.

**Heurísticas.**
- Termo, ficha ou nó a ≤ 4 ações de uma aula.
- Localizador compacto (≈ 32px) quando o header recolhe.

**Verificação.** A 1440 e 390 em E2 (768 antes de fechar a peça):
- sobreposição de telas para conferir a localização;
- filmstrip rolando a aula 2.000px;
- abrir e fechar a gaveta;
- busca, se existir;
- Biblioteca pelo header e pelo rodapé.

**Responde a.** Onde estou; header, nav e perfil juntos.

**Evidência.**
- NASA F.4.2 e F.5.3 (obs): título em local consistente; ≤ 4 ações.
- Component Gallery (obs): breadcrumb com `aria-current`.
- Linear (parc): menos ruído no chrome.
- **Problema.** Painel fixo de 300px com 5 placeholders; perfil só pelo círculo de 32px; busca que não busca;
  Biblioteca com URLs diferentes.
- **Não transferir.** Shell cinza em L.

### S6 — Todo ato deixa rastro; todo movimento tem função

**Gate.**
- **Rastro.** Todo ato registrado muda visivelmente, no mesmo quadro, o estado de Praticado da aula.
- **Movimentos proibidos.** Bounce, overshoot, parallax e scroll-jacking.
- **Movimento reduzido.** Chega ao mesmo estado final.
- **Aprovação.** Screenshot estático nunca aprova movimento.

**Heurísticas.**
- Movimento só para três usos:
  - continuidade (nó → módulo, linha → verbete);
  - consequência (traçado e número mudam com o parâmetro);
  - chegada (trecho percorrido desenhado).
- Nada de confete.
- Filmstrip com ≥ 5 quadros.

**Verificação.** Filmstrip normal e com movimento reduzido.

**Responde a.** Continuidade; interação com função.

**Evidência.**
- 60fps (parc): elemento compartilhado; scrub que atualiza números.
- Motion (obs): `layoutId`; movimento reduzido.
- **Problema.** Instrumento sem retorno; eventos de prática nunca emitidos.

### S7 — Responsivo, acessível, com densidade por superfície

**Gate.**
- **A 390.**
  - Sem rolagem horizontal.
  - Nenhum rótulo de nav cortado.
  - Home: ação principal no 1º viewport.
  - Aula: no 1º viewport, a pergunta ou o objetivo e o caminho para o primeiro ato (o próprio ato ou a ação que leva a ele, S1).
- **Acessibilidade.**

  | Item | Mínimo |
  |---|---|
  | Contraste de texto | ≥ 4,5:1 |
  | Glifos e bordas de controle | ≥ 3:1 |
  | Foco | Visível (≥ 3:1) e nunca sob o header |
  | Alvos | ≥ 24×24px; nav global e ação principal ≥ 44×44px a 390 |
  | Texto | ≥ 11px |
  | Teclado | Operável sem mouse |

- **Modo.** Só o claro nesta fase (P1).

**Heurísticas.**
- H1 com até 3 linhas a 390.
- **Faixa vazia** = faixa vertical sem conteúdo em toda a altura do viewport. Fica em ≤ 30% da largura a 1440.
  - Na Aula, a coluna de leitura fica isenta, e pranchas e figuras ocupam ≈ 70% da largura útil.
- A 3440, nada piora em relação a 1920.
- Densidade no 1º viewport a 1440 (P2):

  | Superfície | Faixa |
  |---|---|
  | Glossário, Biblioteca | 40–60 |
  | Módulo | 25–45 |
  | Trilhas, Mapa | 20–40 |
  | Home | 15–30 |
  | Aula, Progresso | 12–25 |

**Verificação.**
- Viewports do §8.
- Filmstrip só com Tab e árvore de acessibilidade.

**Responde a.** Mobile como composição própria; acessibilidade.

**Evidência.**
- Navbar Gallery (parc): barra inferior de 4–5 itens.
- **Problema.**
  - Nav cortada.
  - Home com 477px de largura rolável a 390.
  - Instrumento até x=566.
  - Zero breakpoints no código.

---

## 2. Piece A — HOME + GLOBAL NAVIGATION

**Trabalho.** A Home responde, só com texto visível:
1. o que é a Alexandria;
2. por que importa;
3. onde parei;
4. o que faço agora;
5. o que mais posso explorar.

**Além do conceito.**
- O objeto-mundo trabalha: mostra os territórios e onde o learner está (A2).
- Os portais mudam conforme o ponto de estudo (A4).

**Referências.** Atlas (obs); North Star; Steep (ref); Brilliant, Linear e Dovetail (parc).

### A1 — Entrada num mundo, sem inventário como protagonista

**Gate.**
- As perguntas 1–4 são respondidas no 1º viewport; a 5, até o 2º.
- Contagens de aulas, módulos ou verbetes e faixas de estatística não são protagonistas do 1º viewport.
- Nenhum texto contradiz outro.
- Em E0, nenhum número pessoal.

**Heurísticas.**
- H1 de identidade com até 3 linhas, mais uma lede de até 3 linhas.
- Em E2, a tese continua visível ao lado da retomada.

**Verificação.** A 1440 e a 390, em E0 e E2:
- responder às 5 perguntas;
- ler a página inteira em busca de contradições.

**Responde a.** Centro de gravidade da Home; identidade no primeiro frame.

**Evidência.**
- North Star: tese + retomada + uma ação.
- **Problema.** H1 de 46px sobre "17 · 3 · 141"; texto "outros catorze em produção" contradito por
  "17 de 17 verificados".

### A2 — Objeto-mundo que trabalha

**Gate.**
- Existe um objeto-mundo que dá presença e identidade **e** faz um trabalho nomeável. Padrão: os três territórios com
  a posição do learner, ou "ponto de partida" em E0/E1.
- Figura ou gravura nunca cobre posição, rótulos ou dados.

**Heurísticas.**
- **Régua de presença.** A composição Titã + globo é a régua atual, não um requisito. Alternativas bem-vindas:
  - carta energética do Brasil;
  - atlas em transformação;
  - esfera cartográfica;
  - prancha viva;
  - outra composição que o loop descobrir.
- **A 390.** O objeto vem depois da ação e ocupa ≈ 25% da altura. A figura pode ser omitida.

**Verificação.** A 1440 e a 390, em E0 e E2:
- a posição marcada corresponde à retomada;
- rótulos e posição continuam legíveis;
- o trabalho do objeto é nomeável.

**Responde a.** Identidade estrutural; progresso sem dashboard.

**Evidência.**
- Atlas (obs): objeto central com manipulação direta.
- North Star: Titã sustentando o globo.
- **Não transferir.** Mapa decorativo; globo como enfeite.

### A3 — Retomada com objeto, estado e motivo

**Gate.**
- **Bloco.** "Onde você parou" (E2/E3) ou "Por onde começar" (E0/E1), sempre com:
  - código e título;
  - módulo e trilha iguais ao dado;
  - estado;
  - motivo;
  - a ação principal, com destino direto.
- **Prioridade.** Em E3, uma revisão pendente vem primeiro.
- **Percentual.** Nenhum percentual sem escopo.
- **Miniatura.** Honesta quanto à própria classe.

**Heurísticas.**
- Motivo em 1 linha ("em leitura desde…", "a seguir…", "a revisar: …").
- Percentual com escopo, se ajudar ("62% do conteúdo da aula percorrido").

**Verificação.** A 1440 e a 390, em E0–E3:
- filmstrip do clique até a aula;
- o código bate com o localizador.

**Responde a.** Onde parei; o que faço agora.

**Evidência.**
- Brilliant (parc): prática em torno das lacunas.
- North Star: bloco "onde você parou".
- **Problema.** Nenhum "continuar"; "Próxima aula" não clicável e vinda de mock.

### A4 — Portais desiguais, ligados ao ponto atual

**Gate.**
- Atlas, Glossário e Biblioteca são alcançáveis a partir da Home até o 2º viewport, sem virar quatro destinos
  equivalentes.
- Quando existe ponto atual, os ganchos se ligam a ele.

**Heurísticas.**
- Trilhas é o maior portal.
- Atlas é a única imagem geográfica.
- Glossário e Biblioteca aparecem como linhas ligadas ao ponto atual ("12 termos da Aula 08",
  "fontes usadas no M01").

**Verificação.** Em E2 e E2b: os ganchos mudam, e não há destinos congruentes.

**Responde a.** O que mais explorar; destinos sem quatro cards equivalentes.

**Evidência.**
- Reference Pack §7.1.
- North Star: portais só na nav (não copiar).
- **Problema.** `getTermosByAula` nunca é usado.

### A5 — Marca e header como sistema de identidade

**Gate.**
- Cumpre as funções de header do S5.
- Marca no 1º quadro, com zona livre.
- Nenhuma variante lê como museu, sebo, hotel histórico, portal universitário, fantasia ou tema grego.
- Carregamento da conta sem salto de layout.

**Heurísticas.**
- Marca legível a 24px; símbolo distinto a 16px.
- Wordmark, marca-bússola e monograma estão em exploração (X2).

**Verificação.** Em E0 e E2:
- filmstrip do carregamento;
- filmstrip de rolagem de 600px para baixo e de volta.

**Responde a.** Header, nav e perfil juntos; identidade.

**Evidência.**
- NASA Brand Center (obs): zona de proteção.
- North Star: header em pergaminho; estrela de 8 pontas.
- **Problema.** Marca em PNG com subtítulo de 8px.

### A6 — Home a 390×844

**Gate.**
- Cumpre S7.
- Ação principal no 1º viewport.
- Navegação mobile com rótulos.

**Heurísticas.**
- Ordem: header → tese → retomada → objeto-mundo → progresso → portais.
- Barra inferior com até 5 itens ou sumário em tela cheia (X5).

**Verificação.** A 390, em E0 e E2; filmstrip da navegação.

**Responde a.** Mobile.

**Evidência.**
- **Problema.** A 390, o hero tem 2 colunas, o H1 ocupa 7 linhas e não há nenhuma ação na 1ª tela.

---

## 3. Piece B — TRAILS + TRAIL MAP

**Trabalho.** O learner escolhe e entende territórios intelectuais e vê onde está neles.

**Além do conceito.**
- O território atual contém o trecho do mapa com "você está aqui".
- O mapa mostra marcos reais (laboratório, caso, experiência jogável, avaliação).

**Referências.** North Star; DataCamp, Brilliant, Khan e Duolingo, só como semântica (parc); Economist (parc);
Atlas (obs); HBS simulations (bloq).

### B1 — Cada trilha é um território com caráter próprio

**Gate.** Antes de qualquer contagem, cada trilha comunica:
- visão de mundo;
- perguntas que responde;
- capacidades, com verbo observável (tema solto não vale);
- campo (os módulos reais);
- caráter visual próprio (emblema + prancha).

Nenhuma trilha é linha de banco de dados ("42 aulas confirmadas · 29%").

**Heurísticas.**
- 2–3 perguntas e 3–5 capacidades, derivadas da fonte (P3, P11).
- Contagens numa linha de aparato.
- Com os títulos cobertos, as trilhas ainda se distinguem.

**Verificação.** A 1440 e a 390, em E0 e E2, com filmstrip que expande T1, T2 e T3.

**Responde a.** A trilha comunica transformação; caráter visual próprio.

**Evidência.**
- DataCamp (parc): trilha nomeada pelo resultado.
- Duolingo (parc): can-do statements.
- Brilliant (parc): pré-requisito e ganho numa frase.
- North Star: prancha e emblema por trilha.
- **Problema.** "42 aulas confirmadas · 29% concluído"; descrições como listas de tópicos.

### B2 — A trilha atual domina por mais do que o botão

**Gate.**
- Em E2, capturada em cinza, a trilha atual é identificável como dominante **sem ler o botão**.
- Três painéis congruentes reprovam.
- Em E0, o ponto de partida é claro.

**Heurísticas.**
- Trilha atual com ≈ 50% da altura do 1º viewport e ≈ 1,5× a área de cada outra.
- Trilhas recolhidas mostram um fragmento da própria prancha.
- Leitura em sequência: I → II → III.

**Verificação.** Em E2 e E2b.

**Responde a.** Escolha com consequência.

**Evidência.**
- North Star: três painéis iguais (não copiar).
- Atlas (obs): um palco.

### B3 — O mapa é território ocupado, com uma posição

**Gate.**
- Em E2, existe exatamente 1 "você está aqui".
- Percorrido e por vir se distinguem sem cor.
- O critic nomeia o que ocupa o campo, e todo elemento cartográfico tem função.
- Coluna única com recuos decorativos fixos reprova.

**Heurísticas.**
- Campo não majoritariamente vazio; ocupação ≈ 80% da largura útil.
- Nó atual ≈ 1,5× o nó comum; nó comum ≈ 64px.
- Rótulos ≈ 15px.
- A ação principal abre o nó atual (em E1, o nó "a seguir").

**Verificação.**
- A 1440, 1920 e 3440, em E1 e E2.
- Captura em cinza.
- Filmstrip de entrada.

**Responde a.** Estados legíveis; o mapa não é diagrama vazio.

**Evidência.**
- Duolingo (parc): caminho único, com a prática no caminho.
- Economist (parc): faixas.
- **Problema.**
  - Nós de 46px com recuos [0, 92, 36, 132].
  - Campo vazio.
  - Rota percorrida igual à por vir.
  - "Comece aqui" em todos os nós.
- **Não transferir.** Zigue-zague de bolhas; cadeados.

### B4 — Módulos como lugares, com marcos de tipo

**Gate.**
- Com os títulos cobertos, os nós se distinguem, e não só por cor.
- Cada marco de tipo tem silhueta própria e rótulo honesto: laboratório, caso, experiência jogável, avaliação.
- "Jogo" só aparece quando C8 é cumprido.
- Nenhum marco leva a página vazia.

**Heurísticas.**
- Frase de identidade com até 12 palavras.
- Fila de glifos dos objetos do módulo.
- Experiência jogável ainda não projetada: linha ou marca "em desenho", sem aparência de controle e sem destino (P16, S4).
- M08 aparece como "Exercício de decisão".

**Verificação.** A 1440, em E1 e E2, nas trilhas T1 e T2.

**Responde a.** Identidade de módulo; jogos, laboratórios e avaliações como marcos.

**Evidência.**
- DataCamp (parc): projeto e avaliação são tipos distintos.
- **Problema.**
  - Todo nó é o mesmo anel.
  - O jogo existe só no M08, hardcoded.
  - 119 exercícios invisíveis.

### B5 — Do nó ao módulo com continuidade

**Gate.**
- O filmstrip mostra continuidade: título legível em todos os quadros.
- "Voltar" retorna ao mesmo nó e à mesma rolagem.

**Heurísticas.**
- Elemento compartilhado.
- ≥ 5 quadros.

**Verificação.** Ida e volta, também com movimento reduzido.

**Responde a.** Continuidade nó → página.

**Evidência.**
- 60fps (parc).
- Motion (obs).
- **Problema.** Troca de rota seca.

### B6 — Mapa e trilhas a 390 e 768

**Gate.**
- Cumpre S7.
- Nada depende de hover.
- O nó atual é alcançável sem rolagem longa.

**Heurísticas.**
- Alternância "Mapa | Sumário" com os mesmos objetos.
- Eixo vertical.
- Disclosures.

**Verificação.** A 390 em E2 (768 antes de fechar a peça).

**Responde a.** Mobile.

**Evidência.**
- Navbar Gallery (parc).
- **Problema.** O rail de 232px deixaria ≈ 94px de conteúdo a 390.

---

## 4. Piece C — MODULE + LESSON LEARNING LOOP

**Trabalho.**
- **Módulo:** mission control. Por que importa, do que o learner será capaz, onde está, o que vem.
- **Aula:** editorial e interativa. Segue orientar → prever/tentar → explicar → visualizar → interagir → aplicar →
  refletir → recuperar → continuar. Nem toda aula usa todas as etapas, mas toda aula tem ato.

**Além do conceito.**
- A previsão registrada reaparece no instrumento como previsto × calculado.
- A recuperação repete a pergunta de uma aula anterior antes de mostrar a resposta antiga.

**Capturas obrigatórias.**

| Captura | Por quê |
|---|---|
| M01 | Página de módulo |
| M01·A08 | INST·06, fator de capacidade |
| M02·A04 | Curva líquida, que precisa ser desenhada |
| Uma aula de M13 | Sem instrumento nem exercício portado |

**Referências.** Brilliant, DataCamp, Maven, HBS e Khan (parc); Harvard Business Impact (parc); OWID (obs);
M08 (obs).

**Peças do loop.**
- **Peça Módulo** (M01): julgada por C1–C2.
- **Peça Aula** (M01·A08): julgada por C3–C10 e pela Regra-mãe.

**Regra-mãe (gates da aula).** Cada item abaixo reprova a aula:
1. instrumento como apêndice depois de toda a prosa;
2. referência mostrada antes da tentativa, onde a tarefa exige tentativa;
3. aula sem ato do learner;
4. conclusão como única ação, ou conclusão apresentada como competência;
5. vídeo, aba ou card no lugar do primeiro ato;
6. exercícios escondidos em aba.

### C1 — Módulo como mission control

**Gate.**
- **1º viewport.** Responde por que o módulo importa, do que o learner será capaz, onde ele está na rota da trilha e
  qual é o próximo passo.
  - **Sem tese nem capacidades, por falta de extração ou derivação (§9, P11):** uma linha "ainda não disponível", e a
    peça fica "aguardando dependência" (§8).
- **Progresso.** Nas camadas de S3.
- **Critério do módulo.** Nunca aparece como cumprido só porque a avaliação foi aprovada. Critérios orais ou
  cronometrados aparecem como "atividade recomendada" (P14).

**Heurísticas.**
- Ordem sugerida:
  1. localizador;
  2. título + identidade;
  3. fragmento da rota com o módulo marcado;
  4. tese;
  5. critério;
  6. capacidades (no M01, os 7 itens de "Resultado esperado");
  7. horas;
  8. eixos;
  9. ação;
  10. início do roteiro.
- Lista de aulas sozinha não conta como rota.

**Verificação.** A 1440 e 390, em E1 e E2, nos módulos M01, M02 e M14.

**Responde a.** Por que importa; o que será dominado; progresso; próxima ação.

**Evidência.**
- OWID Energy (obs): introdução + uma ação.
- Maven (parc): projeto dentro do syllabus.
- **Problema.** Sem "por que" nem objetivos; horas nunca exibidas; "continuar" vindo de mock.

### C2 — Módulo organizado por tipo de objeto

**Gate.**
- **Tipos distinguíveis:** aulas, instrumentos e laboratório, caso, experiência jogável, revisão, avaliação,
  fontes e léxico.
- Nada vira "recursos" anexados no fim.
- Os exercícios dos 17 módulos estão acessíveis.
- **Experiência jogável (P16).** O lugar dela existe em **todo** módulo. Até ser projetada, aparece como linha de
  metadado "experiência jogável em desenho" (S4), nunca como card vazio e nunca como "sem experiência".
- **Exercícios da Revisão.** Visíveis sem trocar de aba.

**Heurísticas.**
- Seções na ordem da jornada, com glifo e verbo iguais aos do mapa.
- Abas só a partir de 1280, e só para seções existentes; disclosures a 390.
- Exercícios sem vínculo com aula ficam na Revisão (P9).

**Verificação.** A 1440, em E1, nos módulos M01, M08, M12 e M16.

**Responde a.** Separação de aulas, laboratórios, jogo, revisão, avaliação e materiais.

**Evidência.**
- DataCamp (parc): tipos distintos.
- HBS (parc): o caso termina em decisão.
- **Problema.** "RECURSOS DO MÓDULO" com "REVELAR GABARITO" no fim da página.

### C3 — Abertura: orientar antes de ler

**Gate.**
- Antes de ler, o learner sabe o que a aula resolve: uma pergunta ou um objetivo derivado da fonte.
- Em seguida, encontra o primeiro ato ou a leitura.
- Nenhum cartão de vídeo sem vídeo, e vídeo nunca acima do primeiro ato.
- Nenhuma ausência no topo.
- **Previsão.** Quando o erro de previsão é pedagogicamente útil, a aula pede previsão registrada antes do resultado.
  Instrumentos exploratórios ou de sandbox podem usar outro ato.

**Heurísticas.**
- **Forma da previsão.** Primeiro ato, com os valores do cenário na pergunta. Exemplo: na A08, "usina solar de
  100 MW, 1 ano: fator de capacidade, %". A pergunta é derivada do título, da saída e do cenário-padrão do instrumento.
- **Instrumentos exploratórios ou de sandbox** começam por outro ato: meta a alcançar, comparação, condição a
  encontrar.
- Objetivo com verbo observável.

**Verificação.** A 1440 e 390, em E0 e E1, na A08 e na aula de M13.

**Responde a.** Abertura; objetivo; prever.

**Evidência.**
- Brilliant (parc): "learn by doing" (princípio declarado).
- HBS (parc): perguntas antes da leitura.
- North Star: lede que orienta; vídeo-herói (não copiar).
- **Problema.** "VÍDEO EM PRODUÇÃO" (~170px) no topo de 141/141 aulas.

### C4 — Leitura editorial com explicação no fluxo

**Gate.**
- A explicação visual fica junto do parágrafo que explica.
- Termos do léxico ligados à definição sem sair da aula.
- Nenhuma coluna lateral fixa.

**Heurísticas.**
- Trecho sem ato ≈ 1.350px a 1440, no máximo. Trechos maiores recebem um ato autêntico da seção.
- "Vale lembrar" raro e citado.
- Três níveis de explicação no ponto de uso.

**Verificação.**
- Página inteira a 1440, em E2, na A08 e em M13.
- Filmstrip de definição.

**Responde a.** Leitura; explicar; visualizar.

**Evidência.**
- North Star: cutaway "Turbina Francis"; "Vale lembrar".
- Cursor (ref): acento em link inline.
- **Problema.** Aula de 3.012px com o instrumento no fim; nenhuma ligação ao glossário.

### C5 — Instrumento como etapa

**Gate.**
- **Posição.** No ponto da prosa que o invoca.
- **Conteúdo.** Pergunta; controles com rótulo e unidade; saídas legíveis; fonte.
- **Com previsão:**
  - o learner se compromete antes de ver o resultado;
  - vê previsto × calculado **no mesmo cenário**;
  - esse quadro fica visível enquanto ele explora.
- **Tolerância.** "Dentro" e "fora" só com tolerância real, nunca inventada (P6).
- **Forma prometida.** Se o nome do instrumento promete uma forma, o instrumento a desenha.

**Heurísticas.**
- Prancha em ordem: número, título com escopo, pergunta, controles, figura, saídas, fonte, leitura.
- Instrumento de veredito oferece "não é possível concluir".
- Sem tolerância: autoavaliação na escala de C7.

**Verificação.**
- Filmstrip do INST·06: vazio → registrado → comparação → exploração.
- Filmstrip do m08-inst-04.

**Responde a.** Instrumento; interagir; prever.

**Evidência.**
- Brilliant (parc): feedback sem revelar a resposta.
- HTML M08 (obs): o reconstrutor exige produzir antes de ver.
- **Problema.** "Pratique abaixo." fica 4 seções antes do instrumento; 109/111 instrumentos sem previsão;
  tolerância existe em só 2/111.

### C6 — Visualização útil

**Gate.**
- Toda visualização de aula tem um trabalho cognitivo nomeável e desenha a relação que a aula afirma.
- Nenhuma figura puramente decorativa na coluna da aula.

**Heurísticas.**
- Pilha: título-afirmação → subtítulo com unidade → figura → fonte → classe.
- Até 4 categorias.
- Rótulos diretos.

**Verificação.** Na A08 e na M02·A04; filmstrip movendo um controle.

**Responde a.** Visualização útil.

**Evidência.**
- OWID (obs): rótulos na ponta; fonte sob o gráfico.
- Economist (parc): título que afirma.
- **Problema.** "CURVA LÍQUIDA" sem curva nenhuma.

### C7 — Checagem: tentativa antes da referência

**Gate.**
- Quando a tarefa exige tentativa, a referência só aparece depois da tentativa registrada.
- Não existe "Revelar gabarito" direto.
- Nenhuma cor marca certo ou errado (S2). O estado aparece por silhueta e palavra.

**Heurísticas.**
- Comparação lado a lado: resposta × referência × o que acrescenta × critério.
- Autoavaliação em três níveis (atende · atende em parte · não atende).
- Nova tentativa disponível.
- "Não atende" leva a "a revisar".

**Verificação.** Filmstrip: vazio → registrado → comparação → próximo passo.

**Responde a.** Checagem inline; refletir.

**Evidência.**
- Maven (parc): rascunho → envio → retorno.
- HTML M08 (obs): "Resposta / O que acrescenta / Critério".
- **Problema.** Nenhum exercício tem campo de resposta.

### C8 — Aplicação e jogos

**Gate.**
- **Decisão.** Nada aparece abaixo dela antes do registro.
- **Consequências.** Em ≥ 2 dimensões, sem escore único.
- **Jogo.** Só é jogo com:
  - decisões encadeadas;
  - estado acumulado;
  - trade-off real;
  - comparação de percursos.
- **Quiz temático** nunca é jogo.
- **M08** é "Exercício de decisão" até o game pass (P4).

**Heurísticas.**
- Sequência: Cenário → Decisão → Consequências → Balanço.
- O balanço liga de volta a aulas e termos.
- "Na prática" usa texto da fonte.

**Verificação.** M08, de E2 para E3; quadro da decisão antes das consequências.

**Responde a.** Aplicação; experiências jogáveis.

**Evidência.**
- HBS (parc): decisão com informação incompleta.
- Harvard Business Impact (parc): "make the call → rewind and compare → debrief".
- **Problema.**
  - Um único jogo.
  - Consequência binária.
  - Rubrica por contagem de caracteres.
  - Evidência só em localStorage.

### C9 — Toda aula tem um ato autêntico

**Gate.**
- Toda aula tem ao menos um ato do learner que **exercita o mecanismo central da aula**.
- O fim da aula é um registro (Percorrido · Praticado · Serve a), nunca "concluída". "Serve a" nomeia a capacidade ou o
  critério do módulo que a aula sustenta, ou traz "ainda não disponível".
- Em E0, o ato funciona e informa que registrar exige conta.

**Heurísticas.**
- **Alvo:** o menor ato autêntico que exercita o mecanismo central. Catálogo de atos:
  - prever;
  - manipular até uma meta;
  - estimar;
  - comparar casos;
  - classificar ou ordenar;
  - identificar o erro;
  - decidir com justificativa;
  - localizar no Atlas ou no mapa;
  - responder exercício da fonte.
- **"Explique com suas palavras"** só como fallback, quando nada acima couber. Um módulo não deve fechar a maioria
  das aulas em texto aberto.
- Antes do ato: "Registrar leitura sem prática".

**Verificação.** Na A08 e em M13, em E0, E1 e E2; o ato de M13 é autêntico e derivado da fonte.

**Responde a.** Conclusão; refletir. A aula não termina em texto → calculadora → gabarito → concluída.

**Evidência.**
- Khan (parc): resumo pós-atividade.
- Reference Pack §8.4: conclusão ≠ domínio.
- **Problema.** "MARCAR AULA COMO CONCLUÍDA" sem pré-condição; 54/141 aulas sem instrumento.

### C10 — Recuperação e próximo passo

**Gate.**
- O próximo passo depende do que aconteceu. Não é "próxima aula" fixa para todos.
- A recuperação não mostra a resposta anterior antes da nova tentativa.
- A avaliação do módulo mostra o critério antes e nunca vira Demonstrado (P5).

**Heurísticas.**
- Próximo passo conforme o resultado:

  | Resultado | Próximo passo |
  |---|---|
  | Não atende | "Rever [seção]" |
  | Leitura sem prática | "Fazer o ato desta aula" (contornado: "Próxima") |
  | Demais casos | "Próxima · [código — título]" |
  | Última aula | Revisão → Avaliação |

- Recuperação usa itens de aulas anteriores, com a origem visível.
- Questão já usada sai da avaliação.
- "A revisar" aparece na Home (1 item) e no Progresso (todos).

**Verificação.**
- A08 em E2 × E3.
- Filmstrip da recuperação.
- Com a avaliação extraída: critério → feedback → nova tentativa.

**Responde a.** Recuperar; prática pós-aula; próximo passo.

**Evidência.**
- Khan (parc): níveis que sobem e descem.
- HTML M08 (obs): remediação por aula.
- **Problema.** Anterior e próxima fixos; quiz não extraído.

---

## 5. Piece D — PROFILE + GLOSSARY + LIBRARY

**Trabalho.**
- **Progresso:** o estado de estudo num lugar só.
- **Glossário:** vocabulário ligado à aula.
- **Biblioteca:** inteligência de fontes.

**Além do conceito.** Termo e fonte abrem sem sair da aula e voltam à mesma posição (D6).

**Bloqueio.** O perfil atual não foi renderizado (exige login). D1 e D2 só são aprovados com E1–E3.

**Referências.** North Star; Khan, Dovetail, Linear e Economist (parc); OWID, NASA e Component Gallery (obs).

### D1 — Progresso

**Gate.**
- Superfície dedicada, sem rail.
- Responde:
  - onde estou;
  - o que faço agora;
  - o que revisar;
  - o que demonstrei (ou "ainda não avaliado").
- Camadas separadas (S3).
- Números iguais aos da Home e do Mapa.
- Nenhum mock.

**Heurísticas.**
- Jornada como território espacial.
- Ordem sugerida:
  1. onde estou;
  2. agora;
  3. revisar;
  4. demonstrado (ou "ainda não avaliado");
  5. avaliações do módulo (resultado e critério da fonte);
  6. percorrido e praticado por módulo;
  7. atividade recente (só com eventos reais);
  8. motivação;
  9. conta.
- Percentual só com escopo.

**Verificação.** A 1440 e 390, em E1–E3.

**Responde a.** Onde estou; agora; revisar; demonstrado.

**Evidência.**
- Khan (parc): estado por habilidade.
- Linear (parc): alinhamento em vez de cards.
- North Star: jornada como montanhas (preservar); donut sem escopo e números incompatíveis (não copiar).

### D2 — Conquistas honestas

**Gate.**
- **Conquista de comportamento:** afirma só o comportamento. Exemplo: "Explorou os quatro submercados no Atlas".
- **Sinal de competência:** exige evidência (tarefa portadora + regra).
- Nenhuma conquista usa palavras de competência sem evidência.

**Heurísticas.**
- Conquistas ficam na camada de motivação, abaixo da evidência.
- Cada uma tem critério em 1 frase e data.

**Verificação.**
- Ler cada conquista e conferir se o texto corresponde ao evento.
- Em E3, com regra ativa: critério e evidência presentes.

**Responde a.** Conquistas com significado; gamificação honesta.

**Evidência.**
- Duolingo (parc): marco como motivação.
- **Problema.** "2 de 13 · +25 XP" na lateral × "nenhuma conquistável" no Perfil; 13 regras nulas.

### D3 — Glossário por contexto

**Gate.**
- A entrada padrão não é uma lista alfabética.
- Há busca real (§9).
- Os termos da aula e do módulo atuais são acessíveis.
- Cada verbete tem fonte e âncora curricular (ou "não declarado").
- A cobertura é declarada com honestidade.

**Heurísticas.**
- Segmentos: Módulo atual | Categoria | A–Z.
- Vista inicial com até 3 viewports.
- "Sem âncora" funciona como filtro.

**Verificação.** A 1440 e 390, em E0 e E2; buscar "PLD" e um termo inexistente.

**Responde a.** Busca; categoria; relevância.

**Evidência.**
- Component Gallery (obs): segmented control.
- Dovetail (parc): filtros recolhidos.
- OWID (obs): visão geral → filtro → detalhe.
- **Problema.** 75.758px de página; 518 repetições.

### D4 — Verbete

**Gate.**
- Cada termo tem rota própria.
- Âncoras com módulo e título.
- Termos relacionados.
- Fonte.
- Estado salvo / a revisar como requisito v2 (§9).

**Heurísticas.**
- Continuidade lista → verbete.
- Bloco "o termo ao longo do currículo".

**Verificação.** "PLD", a 1440 e 390; filmstrip.

**Responde a.** Detalhe; relacionados; âncoras; estado salvo.

**Evidência.**
- OWID (obs).
- **Problema.** Sem rota própria; "Aula N" sem módulo; "PLD" em 3 entradas.

### D5 — Biblioteca como inteligência de fontes

**Gate.**
- Lê como registro de fontes, nunca como landing comercial ou parede de cards.
- Cada fonte informa:
  - o que responde;
  - o que não responde;
  - instituição;
  - tipo;
  - tema;
  - recorte;
  - última verificação;
  - onde é usada (com link para a aula);
  - citação.

**Heurísticas.**
- Abertura tipográfica.
- Imagem só quando melhora o reconhecimento da fonte (capa de relatório, prévia de mapa, página do documento).
- Cobertura declarada uma vez.

**Verificação.** A 1440 e 390, em E0; o link "onde é usada" leva à aula.

**Responde a.** Fonte, uso e verificação.

**Evidência.**
- OWID "Learn more about this data" (obs).
- Economist (parc).
- Media.Work (parc).
- **Problema.** 4 cards iguais + 8 referências hardcoded.

### D6 — Ida e volta

**Gate.**
- Da aula para termo ou fonte e de volta, sem perder a posição.
- A 390, nada depende de hover.

**Heurísticas.**
- Prévia → gaveta → página.

  | Caminho | Ações |
  |---|---|
  | Fonte → ficha | ≤ 2 |
  | Termo → definição | 1 |
  | Termo → verbete | 2 |
  | Ficha → aula | 1 |

**Verificação.** Filmstrips aula → fonte → aula e aula → termo → aula, a 1440 e 390.

**Responde a.** Consulta ligada ao estudo.

**Evidência.**
- Atlas (obs): três camadas; Esc volta um nível.
- Dovetail (parc): afirmação → evidência.
- **Problema.** A aula não liga a termo nem a fonte.

---

## 6. Hard gates globais — FAIL automático

| Gate | Sinal no render |
|---|---|
| LMS / SaaS genérico | Parede de cards; dashboard admin; grade de destinos de mesmo peso; teste anti-LMS reprovado (§0, com suas exceções) |
| Sidebar permanente | Rail fixo em qualquer largura; gaveta aberta no 1º quadro ou com placeholder |
| Dado falso ou mock como real | Número sem origem; mock; divergência entre telas; aula, módulo ou trilha diferente do dado |
| Ausência desonesta | Ausência como zero; fonte factual escondida; linguagem interna (S4) |
| Imagem enganosa | Imagem gerada passando por documental; atmosfera apresentada como evidência (§7) |
| Mobile e acessibilidade | Rolagem horizontal a 390; nav cortada; contraste, foco, teclado ou alvo abaixo de S7; estado só por cor |
| Aula sem aprendizagem | Regra-mãe (§4) |
| Jogo falso | Quiz temático chamado de jogo |
| Competência falsa | Conclusão, XP, sequência ou conquista apresentados como competência; percentual que mistura eixos ou fala de capacidade fora de Demonstrado (S3) |
| Consulta morta | Glossário com entrada alfabética; Biblioteca como landing ou parede de cards |
| Cópia literal do North Star | 3 ou mais simultâneos: Titã + globo decorativo à direita; coluna de lemas; faixa navy com citação em todas as telas; 3 painéis iguais; vídeo no topo da aula; donut sem escopo; fileira de 4 insígnias de consumo |
| Gênero ou skin errados | Museu (acervo, "visite"); sebo (lombadas, couro); hotel histórico (salão como herói, moldura dourada); portal universitário (brasão, "Portal do aluno"); fantasia (pergaminho enrolado, selo de cera); tema grego; bolhas, gemas ou mascote (Duolingo); cores e ilustração do Brilliant; shell cinza com Inter e chips (Linear) |
| Linguagem NIVAR G2 / Portal / Terminal | Marca NIVAR; famílias Hardware/Academy/Software/Advisory/Intelligence; rampa #7A1F0D…#F5C63C; Zilla Slab, Work Sans, JetBrains Mono ou Geist Mono; campo #14120F; azul elétrico; âmbar #F59E0B; CTA comercial |
| Materialidade quebrada | Raio, sombra, gradiente, vidro ou brilho; cor fora de token; semáforo |
| Controle inerte | Controle com aparência de ação que não age: busca que não busca, botão que só rola, slot clicável sem destino. Os rótulos de ausência de S4 não contam |

**Heurísticas quebradas.** Não reprovam sozinhas. O critic registra qual heurística foi quebrada e se o resultado
ficou claramente mais forte. Se não ficou, essa é a maior lacuna.

---

## 7. Contrato de mídia

**M1 — Ferramenta.**
- Higgsfield é a ferramenta primária.
- O modelo é escolhido **no momento** da geração, depois de consultar o catálogo, e a escolha é justificada pelo tipo
  de artefato.
- O bar não fixa modelo.
- Se o Higgsfield estiver indisponível: registrar a indisponibilidade e não trocar de gerador sem autorização.
- **Estado atual:** catálogo lido em 2026-09-16; nenhuma geração.

**M2 — Iteração sem quota.**
- Ciclo: brief → gerar → pôr na composição real → render → crítica → rejeitar ou refinar.
- O asset só entra se resolve um problema nomeado, funciona na composição, não tem erro técnico nem factual e passa
  no M7.
- Rejeição imediata:
  - texto gerado dentro da imagem;
  - geometria impossível;
  - EPI ou escala errados;
  - raios decorativos;
  - cidade azul futurista;
  - holograma;
  - energia brilhando no ar;
  - grid digital falso;
  - subestação absurda.

**M3 — O que não é régua.**
- Mídia visual antiga do repositório e a própria imagem do North Star não criam preferência.
- Continuam valendo: HTML-fonte, conteúdo, instrumentos, exercícios, fontes primárias, tokens e proveniência.

**M4 — Três classes epistêmicas.**

| Classe | Quando | Tratamento visível |
|---|---|---|
| **Documental / real** | A realidade física importa | Crédito (autor · origem · licença · data). **Só esta classe nomeia instalação, evento ou lugar real.** Sem hotlink silencioso |
| **Explicação** | Causalidade, sequência, escala, comparação, transformação, sistema, posição | Trabalho nomeado e fonte quando houver dado. **Ilustração sintética claramente explicativa**: proveniência leve ("Sobre esta figura" / créditos). **Imagem gerada com aparência documental** (parece instalação, acontecimento, pessoa ou cena histórica reais): aviso visível junto dela (P10). Ela nunca representa nem nomeia uma instalação, evento ou pessoa real específicos |
| **Atmosfera** | Identidade e lugar | Registro reconhecível como não documental (gravura, prancha, cartografia, ilustração de arquivo), com créditos na rota. Nunca retrata instalação, equipamento, evento ou pessoa real identificável. Nunca cobre dado |

- **Fora das classes.** Marca, emblema de território e glifos de estado pertencem ao sistema de identidade.
- **Sem legenda de lugar real.** Imagem gerada nunca leva legenda com nome de instalação, evento ou lugar real.
- **Photorealistic não significa factual.** Onde a precisão física importa, usar foto real, diagrama de fonte,
  visualização programática ou desenho verificado.

**M5 — Vídeo.**
- Declarar o papel pedagógico e por que o vídeo supera interação ou imagem.
- A biblioteca final de vídeos vem **por último** na ordem de produção.
- Julgamento só por playback completo:
  - câmera;
  - continuidade;
  - consistência temporal;
  - integridade dos objetos;
  - física;
  - ritmo;
  - entrada, consequência e saída;
  - loop;
  - narração.
- Rejeitar: morphing, equipamento que muda de forma, mãos ou rostos instáveis, câmera sem destino, slow motion
  genérico, drift.
- Acessibilidade: legendas pt-BR; transcrição; sem autoplay com som; pausa visível; pôster com movimento reduzido.

**M6 — Registro interno de proveniência** (`docs/alexandria-v2/media-provenance.md`). Obrigatório para todo asset.

| Campo | Conteúdo |
|---|---|
| `asset_id` | Identificador do asset |
| `tipo` | sourced-photo / sourced-diagram / generated-image / generated-video / programmatic-visualization / decorative |
| `classe` | documental / explicação / atmosfera |
| `aviso_visivel` | sim / não (P10) |
| Origem | Origem, autor, URL, licença, data de acesso |
| Geração | Modelo, data da consulta ao catálogo, data de geração, prompt e versão |
| Uso | Aula ou módulo |
| `purpose` | evidence / explanation / comparison / atmosphere / navigation / game |
| Revisão factual | Pendente / aprovado / rejeitado, com revisor e data |

- Nada vai ao build sem revisão aprovada.
- Licenças aceitas: domínio público, CC0, CC BY, CC BY-SA. Outras só com autorização.
- "Gerada ou real" e "hotlink" não são visíveis no render. O orquestrador ou o Founder confere e declara na legenda
  da captura.

**M7 — Teste do critic.**
- **FAIL** se:
  - a imagem engana sobre a própria classe;
  - uma imagem gerada documental-parecida aparece sem aviso;
  - uma imagem gerada nomeia algo real;
  - a atmosfera cobre dado;
  - a legenda da captura declara reprovação no registro.
- **Teste de remoção.** Se tirar o asset não custa entendimento, orientação, memória, atmosfera relevante,
  identidade ou narrativa, o asset sai.

---

## 8. Estados, viewports, critics e veredito

**Estados.** Todos vêm de eventos reais semeados, nunca de mock. Nenhum agente faz login. A fixture é declarada na
legenda da captura, nunca na UI.

| Estado | Descrição |
|---|---|
| E0 | Visitante sem login |
| E1 | Conta sem eventos |
| E2 | Trilha 1: M01·A01–A07 percorridas, A08 em leitura, 1 previsão no INST·06 |
| E2b | Trilha 2 atual: M06 com 1 aula em leitura |
| E3 | E2 + "não atende" no INST·06 da A08 + registro do exercício de decisão M08 + avaliação do M01 (quando extraída) |

**Viewports.**
- **Em toda rodada:** 390×844 e 1440×900.
- **Antes de fechar a peça:** 768×1024, 1280×800 (também com zoom de 200%), 1920×1080 e 3440×1440.

**Pacote de captura.**

| Tipo | Captura |
|---|---|
| Interação | Inicial → manipulação → resultado |
| Movimento | ≥ 5 quadros, mais a versão com movimento reduzido |
| Navegação | Com a barra de endereço visível |
| Página longa | Página inteira + filmstrip |
| Teclado | Tab + árvore de acessibilidade |
| Vídeo | Arquivo inteiro |

- Cada pacote inclui uma **tira de amostras** com os hex dos tokens.
- A legenda de cada captura traz:
  - viewport, DPR, estado e rota;
  - quais eventos foram emitidos;
  - largura e altura roláveis;
  - densidade;
  - mídia, com classe e conferência no registro;
  - heurísticas quebradas, com justificativa.

**Comparação.**
- O Craft compara às cegas com o North Star (salvo como arquivo), o Atlas atual e as referências observadas.
- Referências parciais entram só pelo mecanismo textual.

**Divisão entre critics.**

| Critic | Mecanismos |
|---|---|
| Brief | S1, S3; A1–A4; B1, B2, B4; gates de estado de B3; C1–C3; gates de C4–C6; C7–C10; D1–D5; Regra-mãe; teste anti-LMS; linhas "Além do conceito" |
| System | S2, S4–S7; A5, A6; B6; D6; §6; §7 |
| Craft | Composição e identidade de A1–A2, B1, B3, B5, C4–C6, D1; mídia (M5, M7); heurísticas quebradas |

**Veredito.**
- O veredito do critic é PASS ou FAIL, com a maior lacuna. **Os gates decidem.** As heurísticas orientam o
  diagnóstico.
- **Gate que depende do §9.** Quando o conteúdo de um gate é um requisito do §9 ainda não implementado (busca,
  estado salvo, extração, persistência):
  - o gate é julgado pelo estado honesto (ausência declarada conforme S4, sem controle inerte);
  - a peça fica "aguardando dependência", não FAIL.
- **Peça fechada:** gates em PASS **e** requisitos v2 da peça implementados (§9).

---

## 9. Requisitos v2 × limite atual de implementação

O backend e a extração atuais **não são teto** do produto. O bar especifica o produto v2. Onde a implementação ainda
não existe, fica registrada como dependência. O render mostra estado honesto enquanto a dependência não é entregue.

| Requisito v2 | Limite atual | Dependência |
|---|---|---|
| Progresso real por learner (aulas, módulos, trilhas) | O servidor registra aula iniciada e concluída; o front usa mock | Ligar o front ao progresso real; remover o mock |
| Registro de tentativas: previsão, resposta, autoavaliação, decisão | Eventos aceitos, nunca emitidos; persistência de texto não verificada | Emitir eventos e persistir respostas |
| Tarefas portadoras de evidência, com regra de avaliação (Demonstrado) | Não existem | Especificar por capacidade; até lá, "Demonstrado: ainda não avaliado" |
| Avaliação do módulo (quiz) | Só no HTML; critério do M01 contraditório (P5) | Extração + registro; critério literal da fonte até a reconciliação |
| Caso, erros comuns, voz, checklist, referências por módulo | Só no HTML | Extração |
| Experiência jogável nos 17 módulos (P16) | Só o M08, como exercício de decisão | Game-design pass |
| Instrumentos de M09, M13, M14, M16, M17 (55) | Não portados. O código tem 111 objetos: os 110 instrumentos da fonte, com o reconstrutor do M08 dividido em dois | Portar |
| Desenho das formas prometidas pelos instrumentos | Só `inst-05` desenha | Implementar as figuras |
| Exercícios de M10–M17 e instrumentos de módulo m10, m11, m12, m15 | Extraídos, não renderizados | Renderizar |
| Glossário completo, com relações e estado salvo / a revisar | 637/2.124; sem relações; sem persistência | Extração + persistência |
| Biblioteca com fichas, uso e data de verificação | 8 referências hardcoded do M01 | Modelo de dados de fonte |
| Busca real (termos, aulas, fontes) | Campo sem ação | Implementar; até lá, o campo não aparece |
| Posição de leitura por seção | Não existe | Evento de seção (opcional) |
| Camada de motivação (XP, sequência, conquistas) | Mock; regras nulas; sem campo XP no servidor | Definir regras honestas e persistência |
| Créditos de imagem | Sem colofão | Colofão por rota |
| Títulos e contagens reconciliados | Divergências em T2/T3, M07–M09, M11, M01, M02, M14 | Reconciliação curricular (P8) |

---

## 10. Explorações abertas (liberdade de marca)

O builder escolhe dentro dos gates. O critic julga pelo render. Só a troca da paleta-base exige aprovação prévia.
Variantes fortes podem ser mostradas lado a lado ao Founder, sem bloquear o build.

| ID | Exploração |
|---|---|
| X1 | Faces tipográficas de identidade e de títulos de conteúdo |
| X2 | Marca: wordmark, marca-bússola, monograma, identidade cartográfica |
| X3 | Palco do mapa: navy ou pergaminho com cartografia |
| X4 | Rótulo da conta: "Progresso", "Meu estudo" ou "Caderno" |
| X5 | Nav a 390: barra inferior ou sumário em tela cheia |
| X6 | Objeto-mundo da Home: Titã + globo, carta energética, esfera cartográfica, prancha viva… |
| X7 | Identidade de módulo: diagrama técnico ou frase + glifo |
| X8 | Tese da Home: identidade ou capacidade |
| X9 | Ordem e comportamento do header (fixo, recolhível, em camadas) |

---

## 11. Decisões do Founder (2026-09-16)

| ID | Decisão |
|---|---|
| P1 | Sem modo noturno nesta fase. A v2 nasce no modo papel. |
| P2 | Densidade por superfície; as faixas numéricas são heurísticas. |
| P3 | Texto conectivo e objetivos derivados fielmente da fonte são permitidos. Conteúdo factual curricular novo exige revisão. |
| P4 | O M08 atual é "Exercício de decisão". O novo jogo nasce no game-design pass. |
| P5 | O limiar do quiz não é evidência de competência. Preservar o critério literal da fonte até reconciliar a contradição. |
| P6 | Não inventar tolerâncias. Revisão técnica quando necessário. |
| P7 | Não exibir "onde isso entra no produto" por enquanto. |
| P8 | Divergências de título e fonte são resolvidas numa reconciliação curricular separada. "Título a confirmar" não é experiência normal. |
| P9 | Exercícios sem vínculo com aula ficam na revisão do módulo. |
| P10 | Mídia fotorrealista gerada pode ser Explicação, com aviso contextual e proveniência permanente. |
| P11 | Objetivos de aula derivados são permitidos quando ancorados na fonte e revisáveis. |
| P12 | Citações raras, sem contagem constitucional. |
| P13 | Sem trava sequencial: pré-requisito é orientação. |
| P14 | Critérios orais ou cronometrados não viram evidência automatizada; aparecem como "atividade recomendada". |
| P15 | O comportamento do header está aberto à exploração. Localização e contexto precisam sobreviver. |
| P16 | Todo módulo terá uma experiência jogável. A fonte atual não precisa já conter o jogo. |

**Adendo aprovado (2026-09-16): ambiguidades de conteúdo.** Texto integral em
[`decisoes/2026-09-16-ambiguidades-de-conteudo.md`](decisoes/2026-09-16-ambiguidades-de-conteudo.md).

**Regra geral.** Há duas camadas legítimas:
- **fonte:** literal, com proveniência;
- **produto pedagógico da Alexandria:** pode ser desenhado, mas nunca é atribuído à fonte.

Lacuna da fonte não se preenche com fato inventado. Lacuna pedagógica pode ser desenhada.

| ID | Decisão |
|---|---|
| P17 | O caso é "Caso — Operação A", sem "Parte 1". Autorizado um Desafio de decisão da camada Alexandria ao final, só com fatos do caso. |
| P18 | Não há critério único de aprovação do módulo. Separar conclusão de conteúdo, desempenho em avaliação e evidência de competência. Nenhum limiar legado governa a progressão. Usar "Concluído", nunca "Aprovado" ou "Dominado" sem evidência. Nenhum ponto de corte inventado. |
| P19 | INST·06: "cenário didático; fonte externa não declarada". Pergunta de previsão autorizada na camada Alexandria. Arredondamento é regra de entrada, não tolerância da fonte. |
| P20 | Faixas de fator de capacidade conflitantes: CONTENT QA, verificação autoritativa obrigatória. Nenhuma vira verdade transversal. |
| P21 | Sigla: FCap (fator de capacidade) e FCarga (fator de carga). Nunca "FC" sozinho quando for ambíguo. |
| P22 | Contagens vêm da coleção real (38 termos), nunca da prosa legada. |
| P23 | "Trava 3" × "Trava 4": reconciliar pelo contexto. Se não der, usar um rótulo semântico e nunca uma numeração possivelmente falsa. |
| P24 | "GridAlpha" morta para o learner: Alexandria para o produto, NIVAR para a empresa. O catálogo canônico governa os títulos; o título alternativo da fonte vira no máximo subtítulo. |
| P25 | (2026-09-17) **Os jogos dos 17 módulos não fazem parte deste trabalho.** Serão feitos à parte, um por um. P16 continua valendo como promessa de produto, mas o Design Loop não projeta nem constrói jogos. As peças só reservam o lugar da experiência jogável (linha "experiência jogável em desenho", conforme S4, B4 e C2), sem controle inerte e sem destino falso. O "game-design pass" sai da lista de tarefas desta wave. |

**Tarefas separadas, fora deste bar:**
- reconciliação da verdade curricular (P8);
- jogos dos 17 módulos (P4, P16): feitos à parte, um por um, fora desta wave (P25);
- extração do aparato de M01 e dos demais módulos;
- implementação das dependências do §9.
