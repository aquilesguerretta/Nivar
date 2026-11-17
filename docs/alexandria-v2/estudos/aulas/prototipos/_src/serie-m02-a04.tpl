<!--meta {
"arquetipo":"SERIE","titulo_pagina":"M02·A04 · A demanda respira · Alexandria",
"trilha":"I · Fundamentos Universais","mod_cod":"M02","modulo":"Como Funciona uma Rede Elétrica",
"aula_n":"04","aula_total":"10","aula_curto":"A demanda respira — e o operador respira junto.",
"sumario":["Abertura · desenhe a carga líquida","4.1 Carga, demanda e pico","4.2 Curva líquida","4.3 Monte o dia você mesmo · INST·04","4.4 Frequência: o medidor do balanço","Registro da aula"],
"creditos":["<b>Sem imagens nesta aula.</b> A figura é a série do instrumento, desenhada pela Alexandria a partir do modelo do curso.","<b>Curvas do INST·04.</b> Perfil horário e solar do modelo didático do Módulo 02; fonte externa dos valores não declarada."]
} -->

<section class="ab" aria-labelledby="titulo">
  <div>
    <p class="eyebrow">M02<span class="dsk"> · Como Funciona uma Rede Elétrica</span> · Aula 04 de 10</p>
    <h1 id="titulo">A demanda respira — e o operador respira junto.</h1>
    <p class="sub">Carga, curva de carga e curva líquida</p>
    <span class="curso">Pergunta do mapa do módulo<em>texto do curso</em></span>
    <p class="pergunta">Como a demanda respira ao longo do dia — e por que o pôr do sol virou a hora mais tensa do operador?</p>
    <p class="obj"><b>Objetivo</b>Desenhar a curva líquida de um dia ensolarado, apontar a rampa do fim da tarde e estimar a inclinação dela em GW por hora. <i style="color:var(--meta)">(objetivo da Alexandria)</i></p>
    <p class="lede">O sistema elétrico não atende uma carga estática: atende uma carga viva, que muda com o horário, a temperatura, o calendário, a economia e o comportamento de milhões de pessoas ao mesmo tempo. Esta aula ensina a ler a respiração diária do sistema — e apresenta o fenômeno que redesenhou a operação na última década: a <strong>curva líquida</strong> e a rampa do fim da tarde.</p>
  </div>
  <div class="ab-dir">
    <div class="ato" data-ato>
      <div class="ato-h"><span class="apar">Ato 1 de 2 · previsão desenhada<em>Alexandria</em></span>
        <span class="estado so-ini">{{g:vazio}}vazio</span><span class="estado so-reg-f">{{g:percorrida}}registrado</span></div>
      <p class="enun">Pico de 95 GW, 30 GW de solar, céu limpo. Arraste os 7 pontos até a <b>carga líquida</b> que você espera.</p>
      <svg class="traco" viewBox="0 0 440 230" role="img" aria-label="Plano de carga por hora com a carga total de referência e sete pontos ajustáveis, de 0 a 24 horas.">@@PEQ@@</svg>
      <div class="pontos" role="group" aria-label="Pontos do traço, em GW">
        <label><span>0 h</span><input value="68" inputmode="numeric"></label><label><span>4 h</span><input value="64" inputmode="numeric"></label><label><span>8 h</span><input value="80" inputmode="numeric"></label><label><span>12 h</span><input value="86" inputmode="numeric"></label><label><span>16 h</span><input value="84" inputmode="numeric"></label><label><span>20 h</span><input value="90" inputmode="numeric"></label><label><span>24 h</span><input value="68" inputmode="numeric"></label>
      </div>
      <p class="nota-cen">Cenário didático presente no módulo; fonte externa dos valores não declarada. Pontos também editáveis por teclado, em GW.</p>
      <div class="dois">
        <label><span class="rot">Hora da carga líquida mínima</span><span class="inp"><input placeholder="h" aria-label="Hora do mínimo"><span>h</span></span></label>
        <label><span class="rot">Maior subida em 1 hora</span><span class="inp"><input placeholder="GW/h" aria-label="Maior subida em uma hora"><span>GW/h</span></span></label>
      </div>
      <button class="btn-pri so-ini-f" type="button" data-registrar><span>Registrar previsão · <b>curva líquida</b></span>{{seta}}</button>
      <p class="so-reg aviso-reg" style="font-style:normal;color:var(--tinta)">Traço registrado · mínimo previsto às 4 h · subida prevista +4 GW/h. <a href="#inst04">Ver sobre a curva calculada</a></p>
    </div>
    {{rota:10:4:M02}}
    <div class="recup">
      <div class="recup-h"><span class="apar">Recuperação<em>Alexandria</em></span><span class="orig">De M01·A05</span></div>
      <p>Demanda (kW) ou consumo (kWh): qual dos dois dimensiona a infraestrutura da rede?</p>
      <div class="opcoes c3" data-grupo style="margin:0"><button class="op">Demanda</button><button class="op">Consumo</button><button class="op">Os dois igualmente</button></div>
    </div>
  </div>
</section>

<div class="corpo">
  <div class="fila"><div class="l">
    <p class="lead mob">O sistema elétrico não atende uma carga estática: atende uma carga viva, que muda com o horário, a temperatura, o calendário, a economia e o comportamento de milhões de pessoas ao mesmo tempo. Esta aula ensina a ler a respiração diária do sistema — e apresenta o fenômeno que redesenhou a operação na última década: a <strong>curva líquida</strong> e a rampa do fim da tarde.</p>
    <div class="sec"><span class="n">4.1</span><h2>Carga, demanda e pico — agora em escala de sistema</h2></div>
    <p>Os conceitos são os mesmos do Módulo 01, mudou a escala: <strong>carga</strong> é a potência exigida em dado instante (kW numa fábrica, GW no SIN); <strong>demanda</strong> é a potência medida em um intervalo; <strong>pico</strong> é a maior demanda do período. E vale em escala nacional a mesma lógica que vale na sua conta: <span class="hl">o pico é caro porque toda a infraestrutura precisa estar pronta para ele — mesmo que ele dure vinte minutos por ano</span>. A Consequência 2 da tese central, de novo.</p>
    <p>A <strong>curva de carga</strong> é o retrato da demanda ao longo do tempo. A curva residencial tem picos de manhã e de início de noite (banho, cozinha, iluminação, climatização). A industrial pode ser estável (operação 24/7), em degraus (turnos) ou irregular (partidas de máquinas). O SIN soma tudo: vale de madrugada, rampa pela manhã, patamar à tarde, pico no início da noite.</p>
    <div class="sec"><span class="n">4.2</span><h2>Curva líquida: o que sobrou para o operador atender</h2></div>
    <p>Agora o conceito moderno. Com dezenas de gigawatts de solar — centralizada e nos telhados (MMGD) —, parte da carga é atendida "antes" de chegar ao despacho. O que importa para o operador não é mais a carga total, e sim a <strong>carga líquida</strong>:</p>
    <div class="formula"><div class="eyebrow" style="margin-bottom:4px">Fórmula</div>
      <div class="eq">Carga líquida <i>=</i> Carga total <i>−</i> Geração solar <i>−</i> Geração eólica</div>
      <div class="d">É a curva líquida que define quanta geração despachável precisa estar pronta</div></div>
    <p>O efeito visual: a curva líquida afunda no meio do dia (sol a pino) e dispara quando o sol se põe — exatamente na hora em que as pessoas chegam em casa. Esse degrau é a <strong>rampa do fim da tarde</strong>: em poucas horas, o sistema precisa substituir dezenas de gigawatts de sol por hidro flexível, térmicas, baterias e importação entre regiões. <span class="hl">É a janela mais tensa do dia do operador</span> — e onde recursos de flexibilidade valem mais.</p>
    <div class="sec"><span class="n">4.3</span><h2>Monte o dia você mesmo</h2></div>
    <p>No simulador abaixo, controle quanta solar existe no sistema e como está o céu. Observe a curva total e a curva líquida se separarem ao meio-dia e se reencontrarem violentamente no fim da tarde. O número que importa está no painel: a rampa máxima, em GW por hora.</p>
  </div></div>

  <section class="palco larga" id="inst04" data-palco aria-labelledby="inst04-t">
    <div class="palco-h"><span class="num">INST·04</span><h3 id="inst04-t">Simulador · Curva líquida e a rampa do fim da tarde</h3><span class="k">desenhar → comparar → meta</span></div>
    <div class="palco-b">
      <dl class="pvc">
        <div><dt>Hora do mínimo</dt><dd class="vaz so-ini">{{g:vazio}} previsão ainda não registrada</dd><dd class="so-reg">4 h <small>prevista</small> · 12 h <small>calculada</small></dd></div>
        <div><dt>Maior subida em 1 hora</dt><dd class="vaz so-ini">{{g:velado}} calculada aparece depois do registro</dd><dd class="so-reg">+4 <small>prevista</small> · +11,4 <small>GW/h calculada</small></dd></div>
        <div><dt>Seu traço × curva calculada</dt><dd class="vaz so-ini">Pico 95 GW · solar 30 GW · céu limpo</dd><dd class="vaz so-reg" style="color:var(--tinta)">Maior distância: <b>17,5 GW às 12 h</b>. O vale saiu da madrugada e foi para o meio-dia.</dd></div>
      </dl>
      <p class="fig-t">O pôr do sol virou a hora mais tensa do dia</p>
      <p class="fig-s">Carga do sistema no modelo do curso, em GW, hora a hora · pico 95 GW · solar 30 GW · céu limpo</p>
      <svg class="svgfig dsk-only serie" viewBox="0 0 1100 360" role="img" aria-label="Série de 0 a 24 horas. Carga total com vale de madrugada e pico às 18 horas. Depois do registro: o traço previsto, a carga líquida calculada com mínimo de 56 gigawatts às 12 horas e rampa máxima de 11,4 gigawatts por hora entre 16 e 17 horas.">@@GRANDE@@</svg>
      <svg class="svgfig mob-only" viewBox="0 0 340 590" role="img" aria-label="Série em retrato, tempo de cima para baixo: carga total e, depois do registro, carga líquida calculada com mínimo às 12 horas e rampa máxima entre 16 e 17 horas.">@@MOB@@</svg>
      <div class="sob-eixo">
        <div class="c"><label>Pico de carga do dia <span>GW</span></label><div class="num-step"><button type="button" aria-label="Menos 1 GW">−</button><input value="95" data-passo="1" aria-label="Pico de carga, GW"><button type="button" aria-label="Mais 1 GW">+</button></div><input type="range" min="80" max="105" step="1" value="95" aria-label="Pico de carga, 80 a 105 GW"></div>
        <div class="c"><label>Solar instalada (UFV + MMGD) <span>GW</span></label><div class="num-step"><button type="button" aria-label="Menos 1 GW">−</button><input value="30" data-passo="1" aria-label="Solar instalada, GW"><button type="button" aria-label="Mais 1 GW">+</button></div><input type="range" min="0" max="45" step="1" value="30" aria-label="Solar instalada, 0 a 45 GW"></div>
        <div class="c"><label>Condição do céu</label><div class="seg" data-grupo><button class="op sel">Céu limpo</button><button class="op">Parcialmente nublado</button><button class="op">Encoberto</button></div></div>
      </div>
      <dl class="saidas" style="grid-template-columns:repeat(3,1fr)">
        <div><dt>Carga líquida mínima</dt><dd><span class="so-ini vz">velada até o registro</span><span class="so-reg-i">56 GW às 12h</span></dd></div>
        <div><dt>Rampa máxima</dt><dd><span class="so-ini vz">velada até o registro</span><span class="so-reg-i">+11,4 GW/h (16→17h)</span></dd></div>
        <div><dt>Solar no pico do dia</dt><dd>30 GW</dd></div>
      </dl>
      <div class="leitura-inst so-reg"><span class="t">Leitura do instrumento · limiar do modelo: 10 GW/h</span><b>Rampa crítica: +11,4 GW em uma hora.</b> É substituir uma Itaipu de geração em sessenta minutos — hidro flexível, térmicas, baterias e intercâmbios subindo juntos, com o operador contando reserva. A hora mais tensa do dia, todos os dias.</div>
      <div class="autoav so-reg-f" data-grupo><span>Sua forma (vale no meio do dia; maior subida entre 15 h e 19 h):</span><button class="op">atende</button><button class="op sel">atende em parte</button><button class="op">não atende</button><button class="btn-link" type="button">Desenhar de novo</button></div>
      <details class="fonte"><summary><span class="k">Fonte</span><span>Curvas didáticas com formato típico do SIN (pico no início da noite); fonte externa dos valores não declarada. Carga real: dados abertos do ONS, para verificar.</span><u>Ficha</u></summary>
        <div class="ficha"><p style="margin:0 0 6px">Curvas didáticas com formato típico do SIN (pico no início da noite). A operação real considera eólica, intercâmbios, sazonalidade e dias atípicos. O objetivo é um único insight: <b>quanto mais solar, mais funda a barriga do meio-dia e mais íngreme a rampa do pôr do sol</b>.</p>
        <p style="margin:0"><span class="apar">Nota<em>Alexandria</em></span> O modelo subtrai só a solar; a fórmula da seção 4.2 também subtrai a eólica.</p></div></details>
      <div class="meta-x">
        <div><span class="apar">Ato 2 de 2 · meta<em>Alexandria</em></span>
          <p>Com pico de 95 GW e céu limpo, encontre a <b>menor solar instalada</b> em que a rampa passa do limiar do modelo (10 GW/h).</p></div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><span class="estado">{{g:vazio}}ainda não tentada</span><button class="btn-sec" type="button">Começar a meta</button></div>
      </div>
      <p class="pratic so-reg-f">{{g:pratica}}<span><b>Praticado nesta aula:</b> traço registrado e comparado. O registro no fim da página já mostra.</span></p>
    </div>
  </section>

  <div class="fila"><div class="l">
    <div class="sec"><span class="n">4.4</span><h2>Frequência: o medidor do balanço</h2></div>
    <p>Como o sistema sabe, a cada segundo, se a respiração está em dia? Pela <strong>frequência</strong>. Recupere a <a href="#">Aula 03 do Módulo 01</a> e suba um nível: em um sistema AC interligado, todos os geradores síncronos giram travados na mesma frequência elétrica. Quando a geração excede o consumo, o conjunto acelera e a frequência sobe acima de 60 Hz; quando falta geração, desacelera e a frequência cai. <span class="hl">Frequência estável = equilíbrio; frequência caindo = falta potência; frequência subindo = sobra potência.</span> É o batimento cardíaco do sistema, visível em qualquer ponto da rede ao mesmo tempo — e é ele que dispara as defesas da Aula 08.</p>
    <div class="nota"><div class="t">Recursos que vencem a rampa</div>
      <p>Quem sobe a montanha das 17h às 20h? Hidrelétricas flexíveis (a vantagem estrutural brasileira), térmicas flexíveis, <strong>baterias</strong> (descarregam exatamente nessa janela), <strong>resposta da demanda</strong> (indústrias que deslocam consumo) e importação entre subsistemas. Cada um desses recursos tem valor crescente à medida que a solar cresce — guarde a lista: ela volta como oportunidade de negócio na Aula 07.</p></div>
    <p class="aviso-reg">Esta aula não tem exercício próprio no curso. O traço registrado volta na Aula 07, como o dia em que a bateria descarrega.</p>
  </div></div>

  <section class="registro" aria-labelledby="reg-t">
    <div class="registro-h"><h2 id="reg-t">Registro da aula</h2><button class="btn-link so-ini" type="button">Registrar leitura sem prática</button></div>
    <dl class="eixos">
      <div><dt>Percorrido</dt><dd>{{g:leitura}}em leitura</dd></div>
      <div><dt>Praticado</dt><dd class="so-ini">{{g:vazio}}ainda sem prática · 0 de 2 atos</dd><dd class="so-reg-f">{{g:pratica}}com prática · traço registrado</dd></div>
      <div><dt>Serve a</dt><dd class="sa"><span><b>Item 08 do checklist do módulo</b> · Desenhar a curva líquida de um dia ensolarado e apontar a rampa do fim da tarde</span><span style="color:var(--suave);font-size:14px">Base da Aula 07 · recursos que vencem a rampa</span></dd></div>
    </dl>
    <p class="demo"><span>Demonstrado: ainda não avaliado.</span><span>Avaliação do Módulo 02: depois da Revisão, com o critério mostrado antes.</span></p>
  </section>
  <nav class="proximo" aria-label="Próximo passo">
    <div class="prox-a">
      <small class="so-ini">Próximo passo · o ato desta aula ainda está pendente</small><small class="so-reg">Próximo passo</small>
      <a class="btn-pri so-ini-f" href="#titulo"><span>Fazer o ato desta aula · <b>desenhar a curva líquida</b></span>{{seta}}</a>
      <a class="btn-pri so-reg-f" href="#"><span>Próxima · <b>M02·A05</b> — Quem liga agora — e por quê.</span>{{seta}}</a>
    </div>
    <div class="prox-b"><a class="btn-link so-ini" href="#">Próxima · M02·A05 — Quem liga agora — e por quê.</a><a class="btn-link" href="#">Voltar à rota do Módulo 02</a></div>
  </nav>
</div>
