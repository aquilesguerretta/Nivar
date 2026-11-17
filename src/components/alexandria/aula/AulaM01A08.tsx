// M01·A08 — "100 MW solar ≠ 100 MW térmica." · arquétipo PRANCHA.
//
// Porte para React do protótipo `prototipos/_src/prancha-m01-a08.html` (com
// as correções de `prototipos/CORRECOES.md`). O texto é o do Módulo 01,
// Aula 08; nenhum fato novo entra aqui.
//
// O QUE A REGRA-MÃE DO §4 EXIGE, E ONDE ESTÁ:
//   1. instrumento no ponto da prosa que o invoca .... o INST·06 vem logo
//      depois de "Use a calculadora abaixo", não no fim da aula;
//   2. tentativa antes da referência ................. o 25,1% do parágrafo
//      8.2, a saída do instrumento e a faixa de leitura ficam velados até a
//      PREVISÃO; a régua de faixas da 8.3 e o valor médio da hidro ficam
//      velados até a META, porque é a régua que casa faixa e fonte — a
//      resposta do Ato 2 (L10). O enunciado do Ato 2 dá a faixa e não dá o
//      nome: era isso que a r12 reprovou;
//   3. ato do learner ................................ três: prever, atingir
//      a meta, responder o Ex·06;
//   4. o fim é registro .............................. Percorrido · Praticado
//      · Serve a, e nunca "concluída";
//   5. nada de vídeo, aba ou card antes do 1º ato .... a abertura leva a
//      pergunta e o campo de previsão, com os valores do cenário;
//   6. exercício em aba .............................. não existe aba.
//
// C5 literal: a previsão registrada volta como PREVISTO × CALCULADO no mesmo
// cenário, e o quadro continua visível enquanto o learner mexe nos controles.
// A figura desenha a forma que o nome do instrumento promete — a fração da
// caixa teórica (P × t) que virou energia.
//
// REGISTRO REAL — v3 (eventos). Até aqui a aula-padrão não emitia evento
// nenhum: o loop de atos vivia só nesta leitura, e sem isso não havia
// conclusão, conquista, fim de módulo nem retomada. Agora:
//   - `useLoopDaAula` (`src/lib/alexandria/`) com `concluirAoChegarAoFim`:
//     `aula_iniciada` no primeiro gesto na aula; `aula_concluida` quando o
//     registro do fim (`RegistroDaAula`) passa pela tela depois disso, com
//     conta — o fim desta aula É o registro (C9), sem botão "concluir";
//   - os três atos saem como `exercicio_respondido` pelo tronco
//     (`TIPOS_DOS_ATOS`), com `aulaId`;
//   - as três réguas do INST·06 saem como `instrumento_usado` (`inst-06`,
//     o id do instrumento no catálogo do M01), agrupadas por ajuste.
//
// MÍDIA. Só o que `media-lab/aulas/_publicar/manifesto.json` manda publicar
// para `aula-01-08`: `m01-a08-02` (explicação) e `m01-a08-04` (documental).
// A régua de faixas da 8.3 fica TIPOGRÁFICA porque a curadoria desta rodada
// não publicou foto de tecnologia por linha — a lacuna é declarada na
// legenda, e nada é gerado para tema documental (§7 M4).
//
// A MATÉRIA DA DOBRA (L13) é a prancha `CaixaDoTeto`, gravura da camada
// Alexandria abaixo da tese. Nenhuma fotografia subiu para o topo: as duas
// imagens curadas continuam junto dos parágrafos que elas explicam (C4).

import { useMemo, useState } from 'react';
import { A, A2, AF, AT2 } from '@/design/alexandria-tokens';
import { idDaAula } from '@/lib/data/alexandria-curriculo';
import { useLoopDaAula } from '@/lib/alexandria/useLoopDaAula';
import type { GeneroDoAto } from '@/lib/alexandria/progresso/regras';
import { MarcaEstacao } from '../comum/Marcas';
import { useLargura } from '../shell/navegacao';
import type { PropsDaAula } from './tipos';
import {
  Abertura,
  AcaoDeRegistro,
  AcaoSecundaria,
  Ato,
  Autoavaliacao,
  AvisoDeReferencia,
  AvisoDeVisitante,
  CampoNumerico,
  Comparacao,
  CreditosDaRota,
  Escolhas,
  Figura,
  Fila,
  Fonte,
  Formula,
  ImagemDaAula,
  LeituraDoInstrumento,
  LoopDaAulaProvider,
  MEDIDA_PALCO,
  Medida,
  MiniRota,
  Nota,
  P,
  Palco,
  ParesDaFicha,
  PranchaDeEntrada,
  Praticado,
  ProximoPasso,
  QuadroDeComparacao,
  Recuperacao,
  RegistroDaAula,
  ReguaGraduada,
  Saidas,
  Secao,
  Selo,
  Termo,
  Velado,
  Velatura,
  Voz,
  aparato,
  aparatoForte,
  useLoop,
  type AssetDaAula,
} from './tronco';

// ── Mídia publicada desta aula ───────────────────────────────

const DIA_E_NOITE: AssetDaAula = {
  base: 'm01-a08-02-solar-e-termica-dia-e-noite',
  slots: [560, 1000],
  largura: 1000,
  altura: 746,
  classe: 'explicacao',
  alt: 'Prancha gravada em quatro quadros. Em cima, um campo de painéis solares com sol alto e sombras projetadas, e uma usina térmica com vapor saindo das chaminés. Embaixo, os mesmos dois lugares à noite: os painéis escuros e imóveis, e a térmica ainda com vapor e luzes acesas.',
  legenda:
    'Duas usinas com a mesma capacidade no papel. Ao meio-dia, as duas podem produzir. À noite, a solar para, e a térmica continua gerando se estiver despachada e tiver combustível.',
  credito: 'Ilustração gerada para a Alexandria (Higgsfield · GPT Image 2.5), 2026. Explicação, não documento. Usinas fictícias.',
};

const SOBRADINHO: AssetDaAula = {
  base: 'm01-a08-04-sobradinho-seca',
  slots: [560, 1000],
  largura: 1000,
  altura: 666,
  classe: 'documental',
  alt: 'Vista do alto de um morro, com mandacarus em primeiro plano. Uma barragem de terra e enrocamento, com a crista reta, segura um reservatório de margens largas e expostas.',
  legenda:
    'Barragem e reservatório de Sobradinho (BA), com nível baixo na seca de 2015. A capacidade instalada da usina não muda com a seca; a água disponível para gerar, sim.',
  credito: 'Marcello Casal Jr/Agência Brasil, CC BY 3.0 BR, via Wikimedia Commons',
};

// ── Cenário e cálculo ────────────────────────────────────────

const CENARIO = { capacidade: 100, geracao: 220_000, horas: 8_760 };
const FCAP_CENARIO = (CENARIO.geracao / (CENARIO.capacidade * CENARIO.horas)) * 100; // 25,1%
const TETO_CENARIO = CENARIO.capacidade * CENARIO.horas; // 876.000 MWh

/** A faixa-alvo do Ato 2: "hidrelétrica (BR · média)" da figura 8.3. */
const META = { de: 45, ate: 55, nome: 'Hidrelétrica (BR · média)' };

const n1 = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const n0 = (v: number) => Math.round(v).toLocaleString('pt-BR');

interface Faixa {
  nome: string;
  de: number;
  ate: number;
  rotulo: string;
}

const FAIXAS: Faixa[] = [
  { nome: 'Nuclear', de: 85, ate: 95, rotulo: '~85–95%' },
  { nome: 'Carvão (base load)', de: 55, ate: 75, rotulo: '~55–75%' },
  { nome: 'Gás natural CCGT', de: 40, ate: 60, rotulo: '~40–60%' },
  { nome: META.nome, de: 45, ate: 55, rotulo: '~45–55%' },
  { nome: 'Eólica onshore (NE BR)', de: 40, ate: 55, rotulo: '~40–55%' },
  { nome: 'Solar fotovoltaica (BR)', de: 20, ate: 28, rotulo: '~20–28%' },
  { nome: 'Térmica a óleo (peaker)', de: 5, ate: 15, rotulo: '~5–15%' },
];

// ── Prancha de entrada · a caixa do teto ─────────────────────
//
// A MATÉRIA DA PRIMEIRA DOBRA (achado 9 da r12). A dobra era só tipo e fio
// de 1 px, e a coluna de leitura morria ~280 px antes do trilho. Aqui ela
// termina numa prancha gravada que desenha a afirmação da tese: a potência
// instalada é a ALTURA de uma caixa, o período é a LARGURA, e a energia é a
// área. A caixa entra VAZIA — a fração que a usina preenche é justamente o
// que o Ato 1 pede que o learner estime, e o INST·06 desenha depois de
// registrada a previsão. Sem número de resposta, sem foto no topo (C3/T14).

function CaixaDoTeto() {
  // TEMPERA DE BURIL, NAO TELA DE TRAMA (D2 da r07).
  //
  // A versao anterior era `for (x = 68; x < 588; x += 6)` desenhando 87 fios
  // IDENTICOS — mesmo comprimento, mesma espessura, mesmo tom — e o critic
  // leu exatamente o que estava la: um campo chapado, nao um objeto.
  //
  // A CAIXA E UM VOLUME VAZIO, e buril nao chapa vazio: ele desenha o
  // CONTINENTE e deixa o conteudo em papel aberto. Era esse o erro de base —
  // tintar o interior inteiro de um recipiente que a propria legenda diz que
  // "nenhuma usina preenche". O tom agora ASSENTA A FORMA: adensa junto da
  // ordenada e junto da aresta tracejada e se abre no meio, como se o interior
  // fosse concavo. O centro fica limpo, que e onde o Ato 1 vai trabalhar.
  //
  // DUAS RESTRICOES decidiram o desenho:
  // (1) nada pode variar MONOTONICAMENTE em X. Isto e um plano P×t: tom que
  //     sobe ou desce ao longo da largura desenha uma curva de grandeza contra
  //     o tempo — afirmacao falsa, colada no ato que pede a fracao (C7). Por
  //     isso a vinheta e SIMETRICA: simetria nao se le como tendencia.
  // (2) nenhuma banda com aresta nitida na horizontal, que se leria como NIVEL
  //     — isto e, como a resposta. Todo tom morre em degrade.
  const VE = 62; // a ordenada: potencia instalada
  const VD = 592; // a aresta livre: o fim do periodo
  const vinheta: { x: number; o: number }[] = [];
  for (let x = VE + 6; x < VD; x += 6) {
    const t = (x - VE) / (VD - VE); // 0..1 ao longo do periodo
    const borda = Math.min(t, 1 - t) / 0.5; // 0 nas arestas, 1 no meio — simetrico
    const o = 0.5 * Math.pow(1 - borda, 2.2); // some antes do centro
    if (o > 0.012) vinheta.push({ x, o });
  }
  // as nervuras do objeto: os quartos do periodo, que amarram o campo ao limbo
  const nervuras = [0.25, 0.5, 0.75].map((f) => 62 + f * 530);
  const limbo = [
    { f: 0, r: '0 h' },
    { f: 0.25, r: '2.190' },
    { f: 0.5, r: '4.380' },
    { f: 0.75, r: '6.570' },
    { f: 1, r: '8.760 h' },
  ];
  return (
    <svg
      viewBox="0 0 620 126"
      width="100%"
      role="img"
      aria-label="Esquema: a caixa do teto teórico. A altura é a potência instalada; a largura é o período de um ano, de zero a 8.760 horas; a área é a energia que caberia. A caixa está vazia: a fração que a usina entrega é o que a aula pede para estimar."
      style={{ display: 'block' }}
    >
      <title>A caixa do teto: potência na altura, tempo na largura</title>
      <defs>
        {/* userSpaceOnUse, e nao objectBoundingBox: o bbox de um fio vertical
            tem largura zero e degenera o gradiente. */}
        <linearGradient id="a08-teto-luz" gradientUnits="userSpaceOnUse" x1={0} y1={26} x2={0} y2={88}>
          <stop offset="0" stopColor={A.tintaSuave} stopOpacity={0.14} />
          <stop offset="0.55" stopColor={A.tintaSuave} stopOpacity={0.4} />
          <stop offset="1" stopColor={A.tintaSuave} stopOpacity={0.78} />
        </linearGradient>
      </defs>
      {/* a vinheta que assenta o volume: densa nas arestas, aberta no meio */}
      {vinheta.map(({ x, o }) => (
        <line key={x} x1={x} y1={26} x2={x} y2={88} stroke="url(#a08-teto-luz)" strokeWidth={0.75} opacity={o} />
      ))}
      {/* nervuras: os quartos do periodo, que amarram o vao ao limbo e dao
          escala ao interior sem preenche-lo */}
      {nervuras.map((x) => (
        <line key={`n${x}`} x1={x} y1={70} x2={x} y2={88} stroke={A.tintaSuave} strokeWidth={1} opacity={0.5} />
      ))}
      {/* o teto e a borda livre: fio interrompido, porque o limite é
          teórico — a usina nunca encosta nele. */}
      <line x1={62} y1={26} x2={592} y2={26} stroke={A.tintaSuave} strokeWidth={1} strokeDasharray="6 4" />
      <line x1={592} y1={26} x2={592} y2={88} stroke={A.tintaSuave} strokeWidth={1} strokeDasharray="6 4" />
      {/* a altura — potência instalada */}
      <line x1={62} y1={26} x2={62} y2={88} stroke={A.tintaSobreCreme} strokeWidth={2.4} />
      <line x1={55} y1={26} x2={69} y2={26} stroke={A.tintaSobreCreme} strokeWidth={1.6} />
      <line x1={55} y1={88} x2={69} y2={88} stroke={A.tintaSobreCreme} strokeWidth={1.6} />
      <text x={76} y={19} fill={A.tintaSobreCreme} style={{ fontFamily: AF.display, fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em' }}>
        ALTURA · POTÊNCIA INSTALADA (MW)
      </text>
      <text x={592} y={19} textAnchor="end" fill={A.tintaSuave} style={{ fontFamily: AF.corpo, fontSize: '13.5px', fontStyle: 'italic' }}>
        a área é a energia que caberia
      </text>
      {/* a largura — o limbo do período */}
      <line x1={62} y1={88} x2={592} y2={88} stroke={A.tintaSobreCreme} strokeWidth={2.4} />
      {limbo.map((g) => {
        const x = 62 + g.f * 530;
        return (
          <g key={g.r}>
            <line x1={x} y1={88} x2={x} y2={96} stroke={A.tintaSobreCreme} strokeWidth={1.3} />
            <text
              x={x}
              y={111}
              textAnchor={g.f === 0 ? 'start' : g.f === 1 ? 'end' : 'middle'}
              fill={A.tintaSuave}
              style={{ fontFamily: AF.corpo, fontSize: '12.5px', fontVariantNumeric: 'tabular-nums' }}
            >
              {g.r}
            </text>
          </g>
        );
      })}
      <text x={62} y={124} fill={A.tintaSobreCreme} style={{ fontFamily: AF.display, fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em' }}>
        LARGURA · O PERÍODO (H)
      </text>
    </svg>
  );
}

// ── A aula ───────────────────────────────────────────────────

/** O gênero de cada ato desta aula, para o registro de prática. */
const TIPOS_DOS_ATOS: Record<string, GeneroDoAto> = {
  previsao: 'previsao',
  meta: 'meta',
  exercicio: 'exercicio',
};

/** O id do INST·06 no catálogo do Módulo 01 (`alexandria-modulo-01-content.ts`). */
const INST06 = 'inst-06';

export function AulaM01A08(props: PropsDaAula) {
  const mecanica = useLoopDaAula({
    aulaId: idDaAula(props.moduloId, props.numero),
    moduloId: props.moduloId,
    concluirAoChegarAoFim: true,
  });
  return (
    <LoopDaAulaProvider total={3} visitante={props.visitante} mecanica={mecanica} tiposDosAtos={TIPOS_DOS_ATOS}>
      <Corpo {...props} />
    </LoopDaAulaProvider>
  );
}

function Corpo({ numero, totalAulas, percorridas, navegar, rotaDaAula, rotaDoModulo }: PropsDaAula) {
  // A folha vira uma coluna abaixo de 1100: a 768 a coluna de leitura (680)
  // mais a lateral não cabem nos 704 px úteis (medido no closing da r02).
  const movel = useLargura() !== 'largo';
  const loop = useLoop();

  const [previsao, setPrevisao] = useState('');
  const previsaoNum = Number(previsao.replace(',', '.'));
  const temPrevisao = Number.isFinite(previsaoNum) && previsao.trim() !== '';
  const regPrevisao = loop.registroDe('previsao');
  const revelado = Boolean(regPrevisao);
  const prevValor = regPrevisao ? Number(regPrevisao.resumo) : null;

  // Controles do INST·06 — vivos.
  const [capacidade, setCapacidadeLocal] = useState(CENARIO.capacidade);
  const [geracao, setGeracaoLocal] = useState(CENARIO.geracao);
  const [horas, setHorasLocal] = useState(CENARIO.horas);
  // Cada régua movida pelo aluno é uso do INST·06. O agrupamento (um
  // evento por ajuste assentado) é do `useLoopDaAula`, não daqui.
  const usar = (mudanca: Partial<{ capacidade: number; geracao: number; horas: number }>) =>
    loop.mecanica?.usarInstrumento(INST06, { modo: 'ajuste', valores: { capacidade, geracao, horas, ...mudanca } });
  const setCapacidade = (v: number) => {
    setCapacidadeLocal(v);
    usar({ capacidade: v });
  };
  const setGeracao = (v: number) => {
    setGeracaoLocal(v);
    usar({ geracao: v });
  };
  const setHoras = (v: number) => {
    setHorasLocal(v);
    usar({ horas: v });
  };
  const teto = capacidade * horas;
  const fcap = teto > 0 ? (geracao / teto) * 100 : 0;
  const naMeta = fcap >= META.de && fcap <= META.ate;

  const [fonteDaMeta, setFonteDaMeta] = useState<string | null>(null);

  // Ex·06 — 50 MW, 131.400 MWh, 8.760 h.
  const [exValor, setExValor] = useState('');
  const [exJuizo, setExJuizo] = useState<string | null>(null);
  const regEx = loop.registroDe('exercicio');

  const delta = prevValor === null ? 0 : prevValor - FCAP_CENARIO;

  const creditos = useMemo(
    () => [
      <>
        <b>Duas usinas, dia e noite.</b> {DIA_E_NOITE.credito}
      </>,
      <>
        <b>Sobradinho (BA), seca de 2015.</b> {SOBRADINHO.credito}
      </>,
    ],
    [],
  );

  return (
    <div ref={loop.mecanica?.refRaiz} style={{ display: 'flex', flexDirection: 'column' }}>
      <Abertura
        movel={movel}
        eyebrow={movel ? 'M01 · Aula 08 de 09' : 'M01 · Física de Energia e Eletricidade · Aula 08 de 09'}
        titulo="100 MW solar ≠ 100 MW térmica."
        subtitulo="Capacidade instalada e fator de capacidade"
        vozPergunta={<Voz rotulo="Pergunta da aula" fonte="Alexandria" />}
        pergunta="Duas usinas têm 100 MW cada — uma solar, uma térmica. Por que elas não entregam a mesma energia num ano?"
        objetivo="Calcular o fator de capacidade de uma usina a partir de potência, energia e horas, e dizer por que a mesma potência instalada entrega energias diferentes conforme a fonte."
        lede="Comparar fontes de geração apenas por capacidade instalada é o erro de leitor casual da matriz elétrica. Para análise séria, o que importa é o fator de capacidade — quanto a usina efetivamente entrega ao longo do tempo."
        materia={
          <PranchaDeEntrada
            titulo="Potência é a altura de uma caixa; energia é a área dela."
            nota="Nenhuma usina preenche a caixa inteira. A fração que ela preenche é o que separa 100 MW de sol de 100 MW de térmica — e é o que o ato ao lado pede."
          >
            <CaixaDoTeto />
          </PranchaDeEntrada>
        }
        ladoDireito={
          <>
            <Ato
              id="previsao"
              ordem={1}
              genero="previsão"
              movel={movel}
              enunciado="Uma usina solar gerou isto em um ano. Qual foi o fator de capacidade (FCap)?"
              cenario={[
                { rotulo: 'Capacidade', valor: '100', unidade: 'MW' },
                { rotulo: 'Geração', valor: '220.000', unidade: 'MWh' },
                { rotulo: 'Período', valor: '8.760', unidade: 'h' },
              ]}
              notaCenario="Cenário didático presente no módulo; fonte externa dos valores não declarada."
            >
              {!revelado ? (
                <>
                  <CampoNumerico
                    rotulo="Sua previsão de FCap"
                    exemplo="em %, por exemplo 40"
                    unidade="%"
                    valor={previsao}
                    aoMudar={setPrevisao}
                    captura="ato-campo"
                    ariaLabel="Sua previsão de fator de capacidade, em porcentagem"
                  />
                  <AcaoDeRegistro
                    movel={movel}
                    rotulo="Registrar previsão"
                    objeto="fator de capacidade"
                    captura="ato-registrar"
                    pronto={temPrevisao}
                    oQueFalta="Escreva a sua previsão de FCap, em %, antes de registrar."
                    aoClicar={() => temPrevisao && loop.registrar('previsao', { resumo: String(previsaoNum) })}
                  />
                  <AvisoDeVisitante />
                </>
              ) : (
                <>
                  <p style={{ fontFamily: AF.corpo, fontWeight: 500, fontSize: '26px', lineHeight: 1.1, margin: '0 0 4px', fontVariantNumeric: 'tabular-nums' }}>
                    {n1(prevValor ?? 0)}
                    <span style={{ fontSize: '14px', color: A.tintaSuave, fontWeight: 400 }}> % registrado</span>
                  </p>
                  <p style={{ ...AT2.metadado, margin: '4px 0 10px' }}>
                    Previsão registrada. A calculadora da seção 8.2 mostra o calculado ao lado dela.
                  </p>
                  <AcaoSecundaria href="#inst06">Ir à comparação · INST·06</AcaoSecundaria>
                </>
              )}
            </Ato>

            <MiniRota
              codigoModulo="M01"
              total={totalAulas}
              atual={numero}
              percorridas={percorridas}
              movel={movel}
              rota={rotaDaAula}
            />

            <Recuperacao movel={movel} origem="M01·A01" pergunta="“Essa usina gerou 100 MW no mês.” O que está errado nessa frase?">
              <Escolhas
                rotuloGrupo="O que está errado na frase"
                colunas={1}
                valor={null}
                aoEscolher={() => undefined}
                opcoes={[
                  { id: 'a', rotulo: 'MW mede potência; o mês entrega energia, em MWh' },
                  { id: 'b', rotulo: 'O número está alto demais para uma usina' },
                  { id: 'c', rotulo: 'Não é possível concluir' },
                ]}
              />
              <AvisoDeReferencia>
                A referência desta recuperação aparece depois da sua nova tentativa, nunca antes.
              </AvisoDeReferencia>
            </Recuperacao>
          </>
        }
      />

      <div style={{ paddingTop: '36px' }}>
        <Fila
          movel={movel}
          lado={
            <>
              <ImagemDaAula asset={DIA_E_NOITE} sizes={movel ? '100vw' : '420px'} />
            </>
          }
        >
          {movel && (
            <P style={{ fontStyle: 'italic', fontSize: '19px', lineHeight: 1.58, margin: '0 0 24px' }}>
              Comparar fontes de geração apenas por capacidade instalada é o erro de leitor casual da matriz elétrica.
              Para análise séria, o que importa é o fator de capacidade — quanto a usina efetivamente entrega ao longo
              do tempo.
            </P>
          )}
          <Secao n="8.1">Capacidade instalada vs. geração efetiva</Secao>
          <P>
            <Termo
              termo="Capacidade instalada"
              previa="O tamanho nominal da usina ou equipamento de geração, em MW: o máximo teórico que ela pode produzir em potência plena."
              verbete="Léxico do Módulo 01 · verbete completo ainda não disponível."
            />{' '}
            é o tamanho nominal da usina ou equipamento de geração — o máximo teórico que ela pode produzir se operasse
            em potência plena, 24 horas por dia, 365 dias por ano. Uma usina solar de 100 MW tem capacidade instalada
            de 100 MW.
          </P>
          <P>
            Isso não significa que ela gera 100 MW o tempo todo. A solar não gera à noite. A eólica depende do vento. A
            hidrelétrica depende de chuva e reservatório. A térmica depende de combustível disponível e despacho do
            sistema. <b>Geração efetiva</b> é o que a usina realmente produziu em um período, medido em MWh.
          </P>
          <Secao n="8.2">O fator de capacidade</Secao>
          <Formula eq={<>FCap <i style={{ fontStyle: 'normal', color: A2.tintaMetadado, margin: '0 6px' }}>=</i> Geração real <i style={{ fontStyle: 'normal', color: A2.tintaMetadado, margin: '0 6px' }}>÷</i> (Capacidade instalada <i style={{ fontStyle: 'normal', color: A2.tintaMetadado, margin: '0 6px' }}>×</i> horas do período)</>} />
          <P>
            Uma usina de 100 MW tem geração máxima teórica em um ano de 100 × 8.760 = 876.000 MWh. Se ela gerou
            efetivamente 220.000 MWh, o FCap foi de{' '}
            {revelado ? (
              <b style={{ fontWeight: 600, background: A2.cremeAfundado, padding: '0 3px' }}>{n1(FCAP_CENARIO)}%</b>
            ) : (
              <Velado>velado até a sua previsão</Velado>
            )}
            . Use a calculadora abaixo:
          </P>
        </Fila>

        {/* ── O palco: INST·06, no ponto da prosa que o invoca (C5) ── */}
        <Palco
          id="inst06"
          movel={movel}
          numero="INST·06"
          titulo="Calculadora · Fator de capacidade de uma usina"
          modo="prever → calcular → comparar"
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'baseline', flexWrap: 'wrap', margin: '0 0 14px' }}>
            <Voz rotulo="Pergunta" fonte="Alexandria" />
            <p style={{ fontFamily: AF.corpo, fontWeight: 500, fontSize: movel ? '16px' : '18px', lineHeight: 1.4, margin: 0 }}>
              Que fração da caixa teórica a usina encheu com energia?
            </p>
          </div>

          <QuadroDeComparacao
            movel={movel}
            colunas={[
              {
                rotulo: 'Sua previsão',
                valor: revelado ? (
                  <>
                    {n1(prevValor ?? 0)} <small style={{ fontSize: '13px', fontWeight: 400, color: A.tintaSuave }}>%</small>
                  </>
                ) : (
                  <span style={{ fontSize: '14px', fontStyle: 'italic', color: A.tintaSuave, display: 'inline-flex', gap: '7px', alignItems: 'center' }}>
                    <MarcaEstacao estado="por-percorrer" tamanho={12} cor={A.tintaSuave} /> ainda não registrada
                  </span>
                ),
              },
              {
                rotulo: 'Calculado · mesmo cenário',
                valor: revelado ? (
                  <>
                    {n1(FCAP_CENARIO)} <small style={{ fontSize: '13px', fontWeight: 400, color: A.tintaSuave }}>%</small>
                  </>
                ) : (
                  <Velado>aparece depois do registro</Velado>
                ),
              },
              {
                rotulo: 'Comparação',
                prosa: true,
                valor: revelado ? (
                  <>
                    Sua previsão ficou <b style={{ fontWeight: 600 }}>{n1(Math.abs(delta))} pontos {delta >= 0 ? 'acima' : 'abaixo'}</b> do
                    calculado. Mova os controles: os dois números continuam aqui.
                  </>
                ) : (
                  <span style={{ fontStyle: 'italic', color: A.tintaSuave }}>100 MW · 220.000 MWh · 8.760 h</span>
                ),
              },
            ]}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: movel ? '1fr' : '300px minmax(0, 1fr)',
              gap: movel ? '20px' : '32px',
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', order: movel ? 2 : 0 }}>
              <ReguaGraduada
                captura="instrumento-controle"
                rotulo="Geração no período"
                unidade="MWh"
                min={0}
                max={TETO_CENARIO}
                passo={2000}
                valor={geracao}
                aoMudar={setGeracao}
                formatar={n0}
                marcas={[0, TETO_CENARIO / 4, TETO_CENARIO / 2, (3 * TETO_CENARIO) / 4, TETO_CENARIO]}
                nota="A régua vai de zero ao teto do cenário (capacidade × horas)."
              />
              <ReguaGraduada
                rotulo="Capacidade instalada"
                unidade="MW"
                min={20}
                max={200}
                passo={5}
                valor={capacidade}
                aoMudar={setCapacidade}
                formatar={n0}
                marcas={[20, 60, 100, 140, 200]}
              />
              <ReguaGraduada
                rotulo="Horas do período"
                unidade="h"
                min={720}
                max={8760}
                passo={24}
                valor={horas}
                aoMudar={setHoras}
                formatar={n0}
                marcas={[720, 2190, 4380, 6570, 8760]}
                nota="720 h = um mês · 8.760 h = um ano."
              />
            </div>

            <Figura
              titulo="Só uma fração do teto vira energia"
              subtitulo="Caixa teórica: potência (MW) × tempo (h). Área = energia (MWh)."
              esquematico="Preenchimento uniforme: a caixa mostra a razão, não o perfil hora a hora da geração."
            >
              <CaixaTeorica
                movel={movel}
                fcap={fcap}
                previsao={prevValor}
                teto={teto}
                geracao={geracao}
                capacidade={capacidade}
                horas={horas}
                revelado={revelado}
              />
            </Figura>
          </div>

          <Saidas
            movel={movel}
            itens={[
              {
                rotulo: 'Fator de capacidade (FCap)',
                valor: revelado ? `${n1(fcap)} %` : <Velado>velado até o registro</Velado>,
              },
              { rotulo: 'Teto teórico (capacidade × horas)', valor: `${n0(teto)} MWh` },
              { rotulo: 'Geração no período', valor: `${n0(geracao)} MWh` },
            ]}
          />

          {revelado && (
            <LeituraDoInstrumento titulo={`Leitura do instrumento · faixa de ${n0(Math.floor(fcap / 5) * 5)}% a ${n0(Math.floor(fcap / 5) * 5 + 5)}%`}>
              {leituraDaFaixa(fcap)}
            </LeituraDoInstrumento>
          )}

          <Fonte
            resumo={
              <>
                Cenário didático presente no módulo; fonte externa dos valores não declarada. Leituras por faixa:{' '}
                <Selo pendente>faixas do módulo · verificação pendente</Selo>.
              </>
            }
            ficha={
              <ParesDaFicha
                pares={[
                  ['Origem', 'Módulo 01, Aula 08, seção 8.2, e calculadora INST·06'],
                  ['Procedência externa', 'não declarada'],
                  ['Faixas de leitura', 'do módulo; conflitam com as da figura 8.3 · verificação pendente'],
                ]}
              />
            }
          />

          {/* ── Ato 2 · meta dentro da prancha ── */}
          <div style={{ marginTop: '22px', borderTop: `1px dashed ${A.fioSobreCreme}`, paddingTop: '16px' }}>
            <Ato
              id="meta"
              ordem={2}
              genero="meta"
              movel={movel}
              // O ENUNCIADO NÃO NOMEIA A FAIXA. A r12 reprovou este ato
              // porque o comando dizia "até cair na faixa da **Hidrelétrica
              // (BR · média)**" e uma das quatro alternativas era essa mesma
              // string. A L2 do sistema cobre o enunciado por nome: a faixa
              // é premissa (o alvo numérico), o NOME dela é a resposta.
              enunciado={
                <>
                  Mova a geração até a usina cair entre {META.de}% e {META.ate}%. Depois diga que fonte típica essa
                  faixa descreve.
                </>
              }
            >
              <p style={{ display: 'flex', alignItems: 'center', gap: '9px', margin: '0 0 10px', fontFamily: AF.corpo, fontSize: '15px' }}>
                <MarcaEstacao estado={naMeta ? 'percorrido' : 'por-percorrer'} tamanho={13} />
                {/* ONDE, sempre; QUANTO, só depois da previsão (L2). A linha
                    orienta a meta sem entregar o Ato 1: o FCap corrente é a
                    resposta da previsão. */}
                <span>
                  {loop.temRegistro('meta')
                    ? 'meta atingida e registrada'
                    : naMeta
                      ? 'meta atingida'
                      : fcap < META.de
                        ? 'ainda abaixo da faixa'
                        : 'ainda acima da faixa'}
                  <Medida ato="previsao" valor={` · FCap ${n1(fcap)}%`} />
                </span>
              </p>
              {!loop.temRegistro('meta') && (
                <>
                  <Escolhas
                    rotuloGrupo="Que fonte a faixa de 45% a 55% descreve"
                    colunas={movel ? 1 : 2}
                    valor={fonteDaMeta}
                    aoEscolher={setFonteDaMeta}
                    opcoes={[
                      { id: 'solar', rotulo: 'Solar fotovoltaica (BR)', captura: 'meta-opcao-1' },
                      { id: 'hidro', rotulo: 'Hidrelétrica (BR · média)', captura: 'meta-opcao-2' },
                      { id: 'nuclear', rotulo: 'Nuclear', captura: 'meta-opcao-3' },
                      { id: 'nao', rotulo: 'Não é possível concluir', captura: 'meta-opcao-4' },
                    ]}
                  />
                  <AcaoDeRegistro
                    movel={movel}
                    rotulo="Registrar meta"
                    captura="meta-registrar"
                    pronto={naMeta && Boolean(fonteDaMeta)}
                    oQueFalta="A meta registra quando o FCap está na faixa E a fonte está nomeada."
                    aoClicar={() =>
                      loop.registrar('meta', {
                        resumo: `${n1(fcap)}% · ${fonteDaMeta}`,
                        atende: fonteDaMeta === 'hidro' ? 'atende' : 'atende em parte',
                      })
                    }
                  />
                  <p style={{ ...AT2.metadado, color: A2.tintaMetadado, margin: '8px 0 0' }}>
                    {naMeta
                      ? 'A faixa foi alcançada. Falta nomear a fonte que ela descreve.'
                      : 'O registro abre quando o FCap entrar na faixa — a detecção é por valor, sem arredondamento.'}
                  </p>
                </>
              )}
              {loop.temRegistro('meta') && (
                <Comparacao
                  movel={movel}
                  sua={loop.registroDe('meta')?.resumo.split(' · ')[1] === 'hidro' ? 'Hidrelétrica (BR · média)' : 'outra fonte'}
                  tituloReferencia="Referência · figura 8.3 da aula"
                  referencia={
                    <>
                      A faixa de 45% a 55% é a da <b>hidrelétrica brasileira média</b>. A mesma potência instalada da
                      usina do cenário entrega, nessa faixa, mais que o dobro do que entregava em 25%.
                    </>
                  }
                />
              )}
            </Ato>
          </div>

          {loop.praticados > 0 && (
            <Praticado>
              <b>Praticado nesta aula:</b> {loop.praticados} de {loop.total} atos registrados. O registro no fim da
              página já mostra.
            </Praticado>
          )}
        </Palco>

        {/* ── 8.3 ── */}
        <Fila movel={movel}>
          <Secao n="8.3">FCaps típicos por fonte</Secao>
          <P>
            Cada tecnologia tem um fator de capacidade característico, determinado pela física da fonte primária, pela
            tecnologia de geração e pelo padrão de despacho no sistema:
          </P>
        </Fila>

        {/* A RÉGUA 8.3 É A REFERÊNCIA DO ATO 2, e por isso ela fica velada
            até o registro dele (L2 + L3). Ela casa cada faixa com o nome da
            fonte: com a régua aberta, a pergunta "que fonte a faixa de 45% a
            55% descreve" se responde lendo uma linha. A mesma régua também
            traz a faixa da solar, que é a referência da previsão do Ato 1 —
            um véu só protege os dois. */}
        <Velatura
          ato="meta"
          reserva={movel ? 200 : 240}
          largura={MEDIDA_PALCO}
          oQue={
            <>
              A régua de faixas por fonte é a referência do <b>Ato 2</b>: ela diz qual tecnologia ocupa cada faixa de
              fator de capacidade, inclusive a faixa de 45% a 55% que o ato pede. Ela abre quando a meta for
              registrada, aqui mesmo, com a sua usina marcada no limbo.
            </>
          }
        >
        <Figura
          style={{ maxWidth: `${MEDIDA_PALCO}px`, margin: '8px 0 44px' }}
          titulo="A mesma potência instalada entrega frações muito diferentes do teto"
          subtitulo={
            <>
              Fator de capacidade típico por fonte, em % do ano. Barras = faixa.{' '}
              {revelado ? 'Marca de tinta = a sua usina do INST·06.' : 'Sua usina entra na régua depois da previsão.'}
            </>
          }
          fonte={
            <Fonte
              resumo={
                <>
                  <Selo pendente>Faixas do módulo · verificação pendente</Selo> Procedência externa das faixas não
                  declarada; conferir em fonte primária antes de uso externo.
                </>
              }
              ficha={
                <ParesDaFicha
                  pares={[
                    ['Origem', 'Módulo 01, Aula 08, figura da seção 8.3'],
                    [
                      'Estado',
                      'as faixas conflitam com as leituras da calculadora (solar corta em 25%; carvão e gás em outras faixas) · verificação pendente',
                    ],
                  ]}
                />
              }
            />
          }
        >
          <ReguaDeFaixas faixas={FAIXAS} marca={revelado ? fcap : null} movel={movel} />
          <p style={{ ...AT2.metadado, fontSize: '12.5px', color: A.tintaSuave, margin: '10px 0 0', lineHeight: 1.5 }}>
            <span style={{ ...aparato, marginRight: '7px' }}>Fichas tipográficas</span>
            A curadoria desta rodada publicou duas imagens para esta aula, e nenhuma delas é de tecnologia por linha.
            Enquanto não houver foto com licença aberta verificada para cada fonte, a linha fica tipográfica — não
            geramos imagem para tema documental.
          </p>
        </Figura>
        </Velatura>

        <Fila
          movel={movel}
          lado={<ImagemDaAula asset={SOBRADINHO} sizes={movel ? '100vw' : '420px'} />}
        >
          <Nota titulo="Por que isso importa para o Brasil" tom="ouro">
            {/* O NÚMERO da hidro fica velado até o Ato 2: "hidrelétrica" +
                um valor dentro de 45%–55% entrega, por cálculo, a resposta
                do ato (L2). A prosa e a fotografia ficam — o véu é do
                número, não da matéria da página. */}
            <P style={{ margin: 0 }}>
              A matriz brasileira é dominada por hidrelétricas com fator de capacidade médio{' '}
              {loop.temRegistro('meta') ? (
                <>em torno de 50%</>
              ) : (
                <Velado>velado até o Ato 2</Velado>
              )}
              , fortemente dependente de regime hidrológico anual. Quando você lê "a matriz brasileira é 60% hidro",
              essa é a participação por <b>capacidade instalada</b>. Em <b>geração efetiva</b>, a participação flutua
              ano a ano com chuvas, despacho térmico complementar e estado dos reservatórios. Confundir capacidade com
              geração — esse é o erro que separa estudante de analista nas conversas sobre matriz elétrica.
            </P>
            <Fonte
              resumo={
                loop.temRegistro('meta') ? (
                  <>“~50%” e “60% hidro”: procedência externa não declarada.</>
                ) : (
                  <>O valor médio da hidro e o “60% hidro”: procedência externa não declarada.</>
                )
              }
              ficha={
                <>
                  Texto do Módulo 01, Aula 08. Números sem referência no módulo; verificar em fonte primária (ONS, EPE)
                  antes de citar.
                </>
              }
            />
          </Nota>
        </Fila>

        {/* ── Ato 3 · o exercício da fonte (C7) ── */}
        <section style={{ maxWidth: `${MEDIDA_PALCO}px`, margin: '8px 0 0' }}>
          <Ato
            id="exercicio"
            ordem={3}
            genero="exercício"
            fonte="tarefa da Alexandria sobre o exercício do curso"
            movel={movel}
            enunciado={
              <>
                <span style={{ ...aparato, display: 'block', marginBottom: '6px' }}>Ex · 06 · Aula 08 · texto do curso</span>
                Uma usina solar de <b>50 MW</b> gerou <b>131.400 MWh</b> em um ano (8.760 horas). Calcule o fator de
                capacidade. É um número razoável para solar no Brasil?
              </>
            }
          >
            {!regEx ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: movel ? '1fr' : '220px minmax(0, 1fr)', gap: movel ? '4px' : '24px', alignItems: 'start' }}>
                  <CampoNumerico
                    rotulo="FCap calculado"
                    exemplo="seu cálculo, em %"
                    unidade="%"
                    grande={false}
                    captura="ex06-campo"
                    valor={exValor}
                    aoMudar={setExValor}
                    ariaLabel="FCap calculado, em porcentagem"
                  />
                  <div>
                    <span style={{ ...aparatoForte, fontSize: '11px', display: 'block', marginBottom: '2px' }}>
                      É razoável para solar no Brasil?
                    </span>
                    <Escolhas
                      rotuloGrupo="É razoável para solar no Brasil"
                      colunas={movel ? 1 : 3}
                      valor={exJuizo}
                      aoEscolher={setExJuizo}
                      opcoes={[
                        { id: 'sim', rotulo: 'Sim', captura: 'ex06-opcao-1' },
                        { id: 'nao', rotulo: 'Não', captura: 'ex06-opcao-2' },
                        { id: 'nc', rotulo: 'Não é possível concluir', captura: 'ex06-opcao-3' },
                      ]}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <AcaoDeRegistro
                    movel={movel}
                    rotulo="Registrar resposta"
                    objeto="Ex·06"
                    captura="checagem-registrar"
                    pronto={exValor.trim() !== '' && Boolean(exJuizo)}
                    oQueFalta="Calcule o FCap e diga se é razoável para solar no Brasil. A resposta de referência só abre depois da sua tentativa."
                    aoClicar={() =>
                      loop.registrar('exercicio', {
                        resumo: `${exValor} % · ${exJuizo === 'sim' ? 'sim' : exJuizo === 'nao' ? 'não' : 'não é possível concluir'}`,
                        atende: null,
                      })
                    }
                  />
                  <AvisoDeReferencia>A resposta de referência aparece depois do seu registro.</AvisoDeReferencia>
                </div>
              </>
            ) : (
              <>
                <Comparacao
                  movel={movel}
                  sua={regEx.resumo}
                  tituloReferencia="Referência · texto do curso"
                  referencia={
                    <>
                      <p style={{ margin: '0 0 8px' }}>
                        Geração máxima teórica: 50 × 8.760 = 438.000 MWh. FC: 131.400 ÷ 438.000 = 0,30 = 30%.{' '}
                        <b>Interpretação:</b> 30% é um pouco acima da média típica brasileira (~20–28%) — sugere usina
                        bem localizada (Nordeste ou regiões de alta irradiação) e/ou tecnologia mais moderna com
                        tracker solar. Para comparação: hidrelétrica brasileira média opera em torno de 50% de FC;
                        nuclear opera 85–95%; térmica peaker pode ficar abaixo de 15%.
                      </p>
                      <Selo pendente>Faixas do módulo · verificação pendente</Selo>
                    </>
                  }
                  criterio="Não declarado para este exercício. Autoavalie a interpretação."
                />
                <Autoavaliacao id="exercicio" pergunta="Sua interpretação:" />
              </>
            )}
          </Ato>
        </section>

        <RegistroDaAula
          movel={movel}
          serveA={
            <>
              <b>Capacidade 02 do módulo</b> · Ler kW, kWh, MW, MWh, kVA e kVAr sem confundir unidade nem grandeza
            </>
          }
          serveANota="Item 13 do checklist · capacidade instalada vs. fator de capacidade por fonte"
          avaliacao="Avaliação do Módulo 01: depois da Revisão, com o critério mostrado antes."
        />

        <ProximoPasso
          movel={movel}
          aoIr={navegar}
          sequencia="Aula 08 (esta aula) → Aula 09 → Revisão do Módulo 01 → Avaliação, que abre depois da Revisão, com o critério mostrado antes."
          semPratica={{ rotulo: 'Fazer o ato desta aula', codigo: 'M01·A08', titulo: 'prever o FCap', destino: '#aula-titulo' }}
          aRevisar={{ rotulo: 'Rever 8.2', codigo: 'INST·06', titulo: 'previsto × calculado, no mesmo cenário', destino: '#inst06' }}
          normal={{
            rotulo: 'Próxima',
            codigo: 'M01·A09',
            titulo: 'Energia ruim pode custar mais do que energia cara.',
            destino: rotaDaAula(Math.min(numero + 1, totalAulas)),
          }}
        />

        <AcaoSecundaria href={rotaDoModulo}>Voltar à rota do Módulo 01</AcaoSecundaria>

        <div style={{ marginTop: '32px' }}>
          <CreditosDaRota linhas={creditos} />
        </div>
      </div>
    </div>
  );
}

// ── Leitura por faixa (só o ramo ativo — DIV-01 do M01) ──────

function leituraDaFaixa(fcap: number): string {
  if (fcap >= 85) return 'Faixa típica de nuclear em operação de base, com paradas programadas para recarga.';
  if (fcap >= 55) return 'Faixa típica de térmica a carvão operando em base, quando há combustível e despacho.';
  if (fcap >= 45) return 'Faixa típica de hidrelétrica brasileira média, dependente do regime hidrológico do ano.';
  if (fcap >= 40) return 'Faixa típica de gás natural em ciclo combinado, ou de eólica onshore no Nordeste brasileiro.';
  if (fcap >= 25) return 'Faixa típica de eólica em regiões de vento moderado ou solar fotovoltaica com tracker em Nordeste BR.';
  if (fcap >= 15) return 'Faixa típica de solar fotovoltaica no Brasil, sem tracker.';
  return 'Faixa típica de térmica a óleo de ponta, que só é despachada nas horas mais caras.';
}

// ── V-RET · a caixa teórica ──────────────────────────────────

function CaixaTeorica({
  movel,
  fcap,
  previsao,
  teto,
  geracao,
  capacidade,
  horas,
  revelado,
}: {
  movel: boolean;
  fcap: number;
  previsao: number | null;
  teto: number;
  geracao: number;
  capacidade: number;
  horas: number;
  revelado: boolean;
}) {
  const L = movel
    ? { w: 340, x: 40, y: 46, bw: 290, bh: 200, fs: 13 }
    : { w: 600, x: 70, y: 36, bw: 500, bh: 210, fs: 12.5 };
  const base = L.y + L.bh;
  const alturaCheia = Math.max(0, Math.min(1, fcap / 100)) * L.bh;
  const yCheia = base - alturaCheia;
  const yPrev = previsao === null ? null : base - Math.max(0, Math.min(1, previsao / 100)) * L.bh;

  return (
    <svg
      viewBox={`0 0 ${L.w} 300`}
      role="img"
      aria-label={
        revelado
          ? `Caixa teórica de ${n0(capacidade)} megawatts por ${n0(horas)} horas, igual a ${n0(teto)} megawatts-hora. A área preenchida mostra ${n0(geracao)} megawatts-hora, ${n1(fcap)} por cento, e a linha tracejada marca a previsão registrada de ${n1(previsao ?? 0)} por cento.`
          : `Caixa teórica de ${n0(teto)} megawatts-hora. A área preenchida e a linha da previsão aparecem depois do registro da previsão.`
      }
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        <pattern id="hachura-caixa" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M-2 2l4-4M0 8l8-8M6 10l4-4" stroke={A2.fioClaroSobreCreme} strokeWidth="1" />
        </pattern>
      </defs>
      <rect x={L.x} y={L.y} width={L.bw} height={L.bh} fill="url(#hachura-caixa)" stroke={A.tintaSobreCreme} strokeWidth="1.5" />
      {movel ? (
        <>
          <text x={L.x} y={18} fontSize="14" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
            Teto: {n0(capacidade)} MW × {n0(horas)} h
          </text>
          <text x={L.x} y={36} fontSize="14" fontWeight="600" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
            = {n0(teto)} MWh
          </text>
        </>
      ) : (
        <text x={L.x + L.bw / 2} y={26} textAnchor="middle" fontSize="14" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
          Teto teórico · {n0(capacidade)} MW × {n0(horas)} h = <tspan fontWeight="600">{n0(teto)} MWh</tspan>
        </text>
      )}
      <text x={L.x - 8} y={L.y + 5} textAnchor="end" fontSize={L.fs} fill={A.tintaSuave} fontFamily={AF.corpo}>
        {n0(capacidade)}
      </text>
      <text x={L.x - 8} y={base + 4} textAnchor="end" fontSize={L.fs} fill={A.tintaSuave} fontFamily={AF.corpo}>
        0
      </text>
      {!movel && (
        <text
          x={18}
          y={L.y + L.bh / 2}
          fontSize={L.fs}
          fill={A.tintaSuave}
          fontFamily={AF.corpo}
          transform={`rotate(-90 18 ${L.y + L.bh / 2})`}
          textAnchor="middle"
        >
          potência · MW
        </text>
      )}
      <text x={L.x} y={base + 20} fontSize={L.fs} fill={A.tintaSuave} fontFamily={AF.corpo}>
        0 h
      </text>
      <text x={L.x + L.bw} y={base + 20} textAnchor="end" fontSize={L.fs} fill={A.tintaSuave} fontFamily={AF.corpo}>
        {n0(horas)} h
      </text>
      <text x={L.x + L.bw / 2} y={base + 44} textAnchor="middle" fontSize={L.fs} fill={A.tintaSuave} fontFamily={AF.corpo}>
        tempo · {horas >= 8760 ? '1 ano' : `${n0(horas)} h`}
      </text>

      {!revelado ? (
        <>
          <text
            x={L.x + L.bw / 2}
            y={L.y + L.bh / 2 - 6}
            textAnchor="middle"
            fontSize="13.5"
            fontStyle="italic"
            fill={A.tintaSuave}
            fontFamily={AF.corpo}
          >
            A caixa enche depois
          </text>
          <text
            x={L.x + L.bw / 2}
            y={L.y + L.bh / 2 + 12}
            textAnchor="middle"
            fontSize="13.5"
            fontStyle="italic"
            fill={A.tintaSuave}
            fontFamily={AF.corpo}
          >
            da sua previsão.
          </text>
        </>
      ) : (
        <>
          <rect x={L.x + 0.75} y={yCheia} width={L.bw - 1.5} height={alturaCheia} fill={A.navy} />
          {alturaCheia > 24 && (
            <text x={L.x + 14} y={yCheia + 26} fontSize="14" fill={A.tintaSobreNavy} fontFamily={AF.corpo}>
              {n0(geracao)} MWh entregues · <tspan fontWeight="600">{n1(fcap)}%</tspan>
            </text>
          )}
          {yPrev !== null && (
            <>
              {/* A linha da previsão troca de tinta quando cai DENTRO do campo
                  navy: tinta sobre navy mede 1,3:1 e sumia (medido no render
                  da r02, quadro f03 do filmstrip). */}
              <line
                x1={L.x}
                y1={yPrev}
                x2={L.x + L.bw}
                y2={yPrev}
                stroke={(previsao ?? 0) < fcap ? A.tintaSobreNavy : A.tintaSobreCreme}
                strokeWidth="1.6"
                strokeDasharray="7 5"
              />
              <text
                x={L.x + L.bw - 4}
                y={(previsao ?? 0) < fcap ? yPrev + 18 : yPrev - 7}
                textAnchor="end"
                fontSize="13.5"
                fill={(previsao ?? 0) < fcap ? A.tintaSobreNavy : A.tintaSobreCreme}
                fontFamily={AF.corpo}
              >
                sua previsão · {n1(previsao ?? 0)}%
              </text>
            </>
          )}
        </>
      )}
    </svg>
  );
}

// ── V-FAIXA · a régua de faixas por fonte ────────────────────

function ReguaDeFaixas({ faixas, marca, movel }: { faixas: Faixa[]; marca: number | null; movel: boolean }) {
  return (
    <div style={{ borderTop: `1px solid ${A.fioSobreCreme}`, borderBottom: `1px solid ${A.fioSobreCreme}` }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: movel ? '1fr' : '210px minmax(0, 1fr) 84px',
          gap: movel ? '2px' : '0 16px',
          alignItems: 'center',
          minHeight: '26px',
          paddingTop: '4px',
        }}
      >
        {!movel && <span />}
        <span style={{ position: 'relative', height: '22px' }}>
          {[0, 25, 50, 75, 100].map((t) => (
            <i
              key={t}
              style={{
                position: 'absolute',
                left: `${t}%`,
                top: '6px',
                transform: t === 0 ? 'none' : t === 100 ? 'translateX(-100%)' : 'translateX(-50%)',
                fontStyle: 'normal',
                ...AT2.metadado,
                fontSize: '12px',
                color: A2.tintaMetadado,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {t}
              {t === 100 ? '%' : ''}
            </i>
          ))}
        </span>
        {!movel && <span />}
      </div>
      {faixas.map((f) => {
        const destaque = marca !== null && marca >= f.de && marca <= f.ate;
        return (
          <div
            key={f.nome}
            style={{
              display: 'grid',
              gridTemplateColumns: movel ? '1fr 78px' : '210px minmax(0, 1fr) 84px',
              gap: movel ? '2px 10px' : '0 16px',
              alignItems: 'center',
              minHeight: '46px',
              borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
              padding: movel ? '8px 0' : 0,
            }}
          >
            <span style={{ fontFamily: AF.corpo, fontSize: '15px', fontWeight: destaque ? 600 : 400 }}>{f.nome}</span>
            {movel && (
              <span style={{ ...AT2.metadado, textAlign: 'right', color: destaque ? A.tintaSobreCreme : A.tintaSuave, fontWeight: destaque ? 600 : 400, fontVariantNumeric: 'tabular-nums' }}>
                {f.rotulo}
              </span>
            )}
            <span
              style={{
                position: 'relative',
                alignSelf: 'stretch',
                minHeight: movel ? '34px' : '44px',
                gridColumn: movel ? '1 / -1' : undefined,
                borderLeft: `1px solid ${A.fioSobreCreme}`,
                borderRight: `1px solid ${A.fioSobreCreme}`,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: `${f.de}%`,
                  width: `${f.ate - f.de}%`,
                  top: movel ? '10px' : '14px',
                  height: '16px',
                  background: destaque ? A.navy : A.fioSobreCreme,
                  border: `1px solid ${destaque ? A.navy : A.tintaSuave}`,
                }}
              />
              {marca !== null && (
                <span
                  aria-hidden="true"
                  style={{ position: 'absolute', left: `${Math.min(100, Math.max(0, marca))}%`, top: 0, bottom: 0, borderLeft: `1.6px dashed ${A.tintaSobreCreme}` }}
                >
                  {destaque && (
                    <em
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: movel ? '8px' : '13px',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontFamily: AF.corpo,
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        background: A.cremePapel,
                        padding: '0 4px',
                      }}
                    >
                      sua usina · {n1(marca)}%
                    </em>
                  )}
                </span>
              )}
            </span>
            {!movel && (
              <span style={{ ...AT2.metadado, textAlign: 'right', color: destaque ? A.tintaSobreCreme : A.tintaSuave, fontWeight: destaque ? 600 : 400, fontVariantNumeric: 'tabular-nums' }}>
                {f.rotulo}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
