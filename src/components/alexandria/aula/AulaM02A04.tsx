// M02·A04 — "A demanda respira — e o operador respira junto." · arquétipo SERIE.
//
// Porte para React de `prototipos/_src/serie-m02-a04.tpl` (+ `gen_serie.py`).
// É a captura obrigatória do bar §4: "curva líquida, que precisa ser
// desenhada". O C6 reprova o estado anterior — "CURVA LÍQUIDA sem curva
// nenhuma" —, então aqui o instrumento DESENHA a forma que o nome promete, e
// desenha a do learner junto.
//
// MODELO. É o do próprio curso, lido de `extraction/m02/instrumentos.json`
// (`m02-inst-04`, `codigo_completo`), verbatim:
//
//     L[h] = pico · f[h]
//     s[h] = (6 ≤ h ≤ 18) ? S · cond · max(0, sin(π(h−6)/12))^1,5 : 0
//     net[h] = L[h] − s[h]
//
// com f[] de 25 posições, cond ∈ {1 · 0,6 · 0,25} e os quatro ramos de
// leitura da fonte (rampa > 10 · mínimo < 35 · rampa > 6 · demais). Nenhum
// coeficiente foi inventado, e o limiar de 10 GW/h é do modelo, não regra
// regulatória — é assim que ele aparece rotulado.
//
// C-PREV-TRACO. O traço é desenhado com sete pontos e é operável SÓ por
// teclado: setas esquerda/direita andam nos pontos, cima/baixo mudam o valor
// em GW. Abaixo dele, os mesmos sete pontos como lista de campos — a
// alternativa por lista que o T13 exige. Nada depende de arrastar.

import { useMemo, useState } from 'react';
import { A, A2, AF, AR, AT2 } from '@/design/alexandria-tokens';
import { MarcaEstacao } from '../comum/Marcas';
import { useLargura } from '../shell/navegacao';
import type { PropsDaAula } from './tipos';
import {
  Abertura,
  AcaoDeRegistro,
  AcaoSecundaria,
  Ato,
  AvisoDeReferencia,
  AvisoDeVisitante,
  CreditosDaRota,
  Escolhas,
  Figura,
  Fila,
  Fonte,
  Formula,
  LeituraDoInstrumento,
  LoopDaAulaProvider,
  Medida,
  MiniRota,
  Nota,
  P,
  PranchaDeEntrada,
  Palco,
  Praticado,
  ProximoPasso,
  QuadroDeComparacao,
  Recuperacao,
  RegistroDaAula,
  ReguaGraduada,
  Saidas,
  Secao,
  Termo,
  Velado,
  Voz,
  aparato,
  aparatoForte,
  useLoop,
  type RegistroDeAto,
} from './tronco';

// ── O modelo do curso ────────────────────────────────────────

const F = [
  0.72, 0.7, 0.68, 0.67, 0.67, 0.68, 0.72, 0.78, 0.84, 0.88, 0.9, 0.91, 0.9, 0.89, 0.88, 0.88, 0.9, 0.95, 1.0, 0.99,
  0.95, 0.9, 0.83, 0.77, 0.72,
];

const CEU = [
  { id: '1', rotulo: 'Céu limpo', cond: 1 },
  { id: '0.6', rotulo: 'Parcialmente nublado', cond: 0.6 },
  { id: '0.25', rotulo: 'Encoberto', cond: 0.25 },
];

interface Modelo {
  carga: number[];
  liquida: number[];
  minimo: number;
  horaMinimo: number;
  rampa: number;
  horaRampa: number;
  solarNoPico: number;
}

function modelo(pico: number, solar: number, cond: number): Modelo {
  const carga: number[] = [];
  const liquida: number[] = [];
  for (let h = 0; h <= 24; h++) {
    const L = pico * F[h];
    const s = h >= 6 && h <= 18 ? solar * cond * Math.pow(Math.max(0, Math.sin((Math.PI * (h - 6)) / 12)), 1.5) : 0;
    carga.push(L);
    liquida.push(L - s);
  }
  let minimo = Infinity;
  let horaMinimo = 0;
  for (let h = 0; h <= 24; h++) {
    if (liquida[h] < minimo) {
      minimo = liquida[h];
      horaMinimo = h;
    }
  }
  let rampa = -Infinity;
  let horaRampa = 0;
  for (let h = 0; h < 24; h++) {
    const d = liquida[h + 1] - liquida[h];
    if (d > rampa) {
      rampa = d;
      horaRampa = h;
    }
  }
  return { carga, liquida, minimo, horaMinimo, rampa, horaRampa, solarNoPico: solar * cond };
}

/** Os quatro ramos de leitura da fonte. Só o ramo ativo é mostrado. */
function leituraDoModelo(m: Modelo): { titulo: string; texto: string } {
  if (m.rampa > 10)
    return {
      titulo: 'Leitura do instrumento · limiar do modelo: 10 GW/h',
      texto: `Rampa crítica: +${n1(m.rampa)} GW em uma hora. É substituir uma Itaipu de geração em sessenta minutos — hidro flexível, térmicas, baterias e intercâmbios subindo juntos, com o operador contando reserva. A hora mais tensa do dia, todos os dias.`,
    };
  if (m.minimo < 35)
    return {
      titulo: 'Leitura do instrumento · limiar do modelo: mínimo de 35 GW',
      texto: `Carga líquida mínima muito baixa (${n0(m.minimo)} GW às ${m.horaMinimo}h). Com inflexibilidades e renovável compulsória, sobra geração no meio do dia: CMO no piso, risco de excesso e de corte de renovável — a barriga solar que antecipa a discussão de curtailment da Aula 10.`,
    };
  if (m.rampa > 6)
    return {
      titulo: 'Leitura do instrumento · limiar do modelo: 6 GW/h',
      texto: `Rampa exigente: +${n1(m.rampa)} GW/h no pôr do sol. Dentro da capacidade do parque flexível, mas é exatamente esta janela que valoriza bateria, resposta da demanda e a hidro com reservatório — os recursos da Aula 07.`,
    };
  return {
    titulo: 'Leitura do instrumento · abaixo dos limiares do modelo',
    texto: `Dia tranquilo: rampa máxima de +${n1(m.rampa)} GW/h. Com pouca solar, a curva líquida quase coincide com a total e a transição do fim da tarde é suave. Suba a solar instalada e veja a barriga do meio-dia se formar — e a rampa ficar íngreme.`,
  };
}

/** Menor solar instalada que faz a rampa passar do limiar do modelo. */
function menorSolarQueCruza(pico: number, cond: number): number {
  for (let s = 0; s <= 45; s++) {
    if (modelo(pico, s, cond).rampa > 10) return s;
  }
  return 45;
}

const n1 = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const n0 = (v: number) => Math.round(v).toLocaleString('pt-BR');

// ── Traço do learner ─────────────────────────────────────────

const HORAS_DO_TRACO = [0, 4, 8, 12, 16, 20, 24];

/** Interpola o traço de sete pontos hora a hora, para ler mínimo e maior
 *  subida na mesma unidade do modelo. Declarado na comparação. */
function interpolar(pontos: number[]): number[] {
  const out: number[] = [];
  for (let h = 0; h <= 24; h++) {
    const i = Math.min(HORAS_DO_TRACO.length - 2, Math.floor(h / 4));
    const h0 = HORAS_DO_TRACO[i];
    const h1 = HORAS_DO_TRACO[i + 1];
    const t = (h - h0) / (h1 - h0);
    out.push(pontos[i] + t * (pontos[i + 1] - pontos[i]));
  }
  return out;
}

// ── Prancha de entrada · o limbo do dia ──────────────────
//
// A MATÉRIA DA PRIMEIRA DOBRA (achado 9 da r12), pela mesma regra da
// M01·A08: prancha gravada da camada Alexandria na coluna de leitura,
// abaixo da tese, com trabalho nomeável (C6). Ela desenha o EIXO do dia e
// as três horas que a operação separa — e NÃO desenha curva nenhuma, nem a
// carga, nem a solar: a forma é exatamente o que o Ato 1 pede que o learner
// trace, e a L2 vela tudo que permite lê-la ou calculá-la.

function LimboDoDia() {
  const noite: number[] = [];
  for (let x = 62; x < 194; x += 6) noite.push(x);
  for (let x = 460; x < 592; x += 6) noite.push(x);
  const horas = [0, 4, 8, 12, 16, 20, 24];
  // Os três marcos vão ACIMA do limbo, nunca dentro da têmpera: rótulo
  // sobre hachura é o tique de figura mal composta que a varredura reprova.
  const marcos = [
    { h: 4, r: 'madrugada' },
    { h: 12, r: 'meio-dia' },
    { h: 19, r: 'ponta' },
  ];
  const px = (h: number) => 62 + (h / 24) * 530;
  return (
    <svg
      viewBox="0 0 620 126"
      width="100%"
      role="img"
      aria-label="Esquema: o limbo de 24 horas de um dia. As faixas das zero às seis e das dezoito às vinte e quatro horas estão em têmpera, indicando a noite. Três marcos verticais assinalam a madrugada, o meio-dia e a ponta do fim da tarde. Nenhuma curva é desenhada."
      style={{ display: 'block' }}
    >
      <title>O limbo do dia: 24 horas e as três que decidem a operação</title>
      {noite.map((x) => (
        <line key={x} x1={x} y1={28} x2={x} y2={88} stroke={A.tintaSuave} strokeWidth={0.7} />
      ))}
      {marcos.map((m) => (
        <g key={m.r}>
          <line x1={px(m.h)} y1={24} x2={px(m.h)} y2={88} stroke={A.tintaSobreCreme} strokeWidth={1.6} />
          <text x={px(m.h)} y={17} textAnchor="middle" fill={A.tintaSobreCreme} style={{ fontFamily: AF.corpo, fontSize: '13px', fontStyle: 'italic' }}>
            {m.r}
          </text>
        </g>
      ))}
      <line x1={62} y1={88} x2={592} y2={88} stroke={A.tintaSobreCreme} strokeWidth={2.4} />
      {horas.map((h) => (
        <g key={h}>
          <line x1={px(h)} y1={88} x2={px(h)} y2={96} stroke={A.tintaSobreCreme} strokeWidth={1.3} />
          <text
            x={px(h)}
            y={111}
            textAnchor={h === 0 ? 'start' : h === 24 ? 'end' : 'middle'}
            fill={A.tintaSuave}
            style={{ fontFamily: AF.corpo, fontSize: '12.5px', fontVariantNumeric: 'tabular-nums' }}
          >
            {h} h
          </text>
        </g>
      ))}
      <text x={62} y={124} fill={A.tintaSobreCreme} style={{ fontFamily: AF.display, fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em' }}>
        UM DIA · 24 HORAS · TÊMPERA = NOITE
      </text>
      <text x={592} y={124} textAnchor="end" fill={A.tintaSuave} style={{ fontFamily: AF.corpo, fontSize: '13.5px', fontStyle: 'italic' }}>
        a forma que mora aqui é a do seu traço
      </text>
    </svg>
  );
}

// ── A aula ───────────────────────────────────────────────────

export function AulaM02A04(props: PropsDaAula) {
  return (
    <LoopDaAulaProvider total={3} visitante={props.visitante}>
      <Corpo {...props} />
    </LoopDaAulaProvider>
  );
}

function Corpo({ numero, totalAulas, percorridas, navegar, rotaDaAula, rotaDoModulo }: PropsDaAula) {
  // Uma coluna abaixo de 1100 (ver AulaM01A08).
  const movel = useLargura() !== 'largo';
  const loop = useLoop();

  const [pico, setPico] = useState(95);
  const [solar, setSolar] = useState(30);
  const [ceu, setCeu] = useState('1');
  const [conferencia, setConferencia] = useState<string | null>(null);
  const cond = CEU.find((c) => c.id === ceu)?.cond ?? 1;
  const m = useMemo(() => modelo(pico, solar, cond), [pico, solar, cond]);

  // Cenário do primeiro ato: pico 95 GW, solar 30 GW, céu limpo.
  const cenario = useMemo(() => modelo(95, 30, 1), []);

  const [traco, setTraco] = useState<number[]>(() => HORAS_DO_TRACO.map((h) => Math.round(modelo(95, 0, 1).carga[h])));
  const [ponto, setPonto] = useState(3);
  const regTraco = loop.registroDe('traco');
  const revelado = Boolean(regTraco);

  const tracoHora = useMemo(() => interpolar(traco), [traco]);
  const leituraTraco = useMemo(() => {
    let minimo = Infinity;
    let horaMinimo = 0;
    for (let h = 0; h <= 24; h++) {
      if (tracoHora[h] < minimo) {
        minimo = tracoHora[h];
        horaMinimo = h;
      }
    }
    let rampa = -Infinity;
    for (let h = 0; h < 24; h++) rampa = Math.max(rampa, tracoHora[h + 1] - tracoHora[h]);
    return { minimo, horaMinimo, rampa };
  }, [tracoHora]);

  const maiorDistancia = useMemo(() => {
    let d = 0;
    let hora = 0;
    for (let h = 0; h <= 24; h++) {
      const x = Math.abs(tracoHora[h] - cenario.liquida[h]);
      if (x > d) {
        d = x;
        hora = h;
      }
    }
    return { d, hora };
  }, [tracoHora, cenario]);

  const alvoMeta = useMemo(() => menorSolarQueCruza(95, 1), []);
  const metaAtingida = pico === 95 && cond === 1 && solar === alvoMeta;

  const leitura = leituraDoModelo(m);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Abertura
        movel={movel}
        eyebrow={movel ? 'M02 · Aula 04 de 10' : 'M02 · Como Funciona uma Rede Elétrica · Aula 04 de 10'}
        titulo="A demanda respira — e o operador respira junto."
        subtitulo="Carga, curva de carga e curva líquida"
        vozPergunta={<Voz rotulo="Pergunta do mapa do módulo" fonte="texto do curso" />}
        pergunta="Como a demanda respira ao longo do dia — e por que o pôr do sol virou a hora mais tensa do operador?"
        objetivo={
          <>
            Desenhar a curva líquida de um dia ensolarado, apontar a rampa do fim da tarde e estimar a inclinação dela
            em GW por hora.{' '}
            <i style={{ color: A2.tintaMetadado }}>(objetivo da Alexandria)</i>
          </>
        }
        lede="O sistema elétrico não atende uma carga estática: atende uma carga viva, que muda com o horário, a temperatura, o calendário, a economia e o comportamento de milhões de pessoas ao mesmo tempo. "
        materia={
          <PranchaDeEntrada
            titulo="O dia do operador tem três horas que decidem tudo — e a aula é sobre a terceira."
            nota="O limbo está vazio de propósito: a forma é o que o ato ao lado pede que você desenhe."
          >
            <LimboDoDia />
          </PranchaDeEntrada>
        }
        ladoDireito={
          <>
            <Ato
              id="traco"
              ordem={1}
              genero="previsão desenhada"
              movel={movel}
              enunciado={
                <>
                  Pico de 95 GW, 30 GW de solar, céu limpo. Leve os sete pontos até a <b>carga líquida</b> que você
                  espera.
                </>
              }
            >
              <PlanoDoTraco
                traco={traco}
                ponto={ponto}
                aoMudar={(i, v) => setTraco((a) => a.map((x, k) => (k === i ? v : x)))}
                aoEscolherPonto={setPonto}
                carga={cenario.carga}
                bloqueado={revelado}
              />
              {!revelado ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ order: movel ? 2 : 0, display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '4px', margin: movel ? '12px 0 0' : '8px 0 12px' }}>
                    {HORAS_DO_TRACO.map((h, i) => (
                      <label key={h} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span style={{ ...AT2.metadado, fontSize: '11.5px', color: A2.tintaMetadado }}>{h} h</span>
                        <input
                          value={traco[i]}
                          inputMode="numeric"
                          aria-label={`Carga líquida prevista às ${h} horas, em GW`}
                          onFocus={() => setPonto(i)}
                          onChange={(e) => {
                            const v = Number(e.target.value.replace(/\D/g, ''));
                            if (Number.isFinite(v)) setTraco((a) => a.map((x, k) => (k === i ? Math.max(0, Math.min(120, v)) : x)));
                          }}
                          style={{
                            width: '100%',
                            minHeight: '36px',
                            textAlign: 'center',
                            border: 'none',
                            borderBottom: `${ponto === i ? 1.8 : 1}px solid ${ponto === i ? A.tintaSobreCreme : A.fioSobreCreme}`,
                            borderRadius: AR.none,
                            background: 'transparent',
                            fontFamily: AF.corpo,
                            fontWeight: 500,
                            fontSize: '15px',
                            fontVariantNumeric: 'tabular-nums',
                            color: A.tintaSobreCreme,
                            outline: 'none',
                          }}
                        />
                      </label>
                    ))}
                  </div>
                  <span style={{ order: movel ? 1 : 0 }}>
                    <AcaoDeRegistro
                      movel={movel}
                      rotulo="Registrar previsão"
                      objeto="curva líquida"
                      captura="ato-registrar"
                      aoClicar={() =>
                        loop.registrar('traco', {
                          resumo: `mínimo às ${leituraTraco.horaMinimo} h · maior subida +${n1(leituraTraco.rampa)} GW/h`,
                        })
                      }
                    />
                  </span>
                  <span style={{ order: movel ? 3 : 0 }}>
                    <p style={{ ...AT2.metadado, fontSize: '12.5px', fontStyle: 'italic', color: A2.tintaMetadado, margin: '8px 0 0' }}>
                      Cenário didático presente no módulo; fonte externa dos valores não declarada. Os pontos andam com
                      as setas do teclado e também na lista, em GW.
                    </p>
                    <AvisoDeVisitante />
                  </span>
                </div>
              ) : (
                <>
                  <p style={{ ...AT2.metadado, margin: '8px 0 6px', color: A.tintaSobreCreme }}>
                    Traço registrado · mínimo previsto às {leituraTraco.horaMinimo} h · maior subida prevista +
                    {n1(leituraTraco.rampa)} GW/h.
                  </p>
                  <AcaoSecundaria href="#inst04">Ver sobre a curva calculada</AcaoSecundaria>
                </>
              )}
            </Ato>

            <MiniRota codigoModulo="M02" total={totalAulas} atual={numero} percorridas={percorridas} movel={movel} rota={rotaDaAula} />

            <Recuperacao
              movel={movel}
              origem="M01·A05"
              pergunta="Demanda (kW) ou consumo (kWh): qual dos dois dimensiona a infraestrutura da rede?"
            >
              <Escolhas
                rotuloGrupo="Demanda ou consumo"
                colunas={1}
                valor={null}
                aoEscolher={() => undefined}
                opcoes={[
                  { id: 'd', rotulo: 'Demanda (kW)' },
                  { id: 'c', rotulo: 'Consumo (kWh)' },
                  { id: 'x', rotulo: 'Os dois igualmente' },
                ]}
              />
              <AvisoDeReferencia>A referência aparece depois da sua nova tentativa.</AvisoDeReferencia>
            </Recuperacao>
          </>
        }
      />

      <div style={{ paddingTop: '36px' }}>
        <Fila movel={movel}>
          {movel && (
            <P style={{ fontStyle: 'italic', fontSize: '19px', lineHeight: 1.58, margin: '0 0 24px' }}>
              O sistema elétrico não atende uma carga estática: atende uma carga viva, que muda com o horário, a
              temperatura, o calendário, a economia e o comportamento de milhões de pessoas ao mesmo tempo.
            </P>
          )}
          <Secao n="4.1">Carga, demanda e pico — agora em escala de sistema</Secao>
          <P>
            Os conceitos são os mesmos do Módulo 01, mudou a escala:{' '}
            <Termo
              termo="carga"
              previa="A potência exigida em dado instante — kW numa fábrica, GW no SIN."
              verbete="Léxico do Módulo 02 · verbete completo ainda não disponível."
            />{' '}
            é a potência exigida em dado instante; <b>demanda</b> é a potência medida em um intervalo; <b>pico</b> é a
            maior demanda do período. E vale em escala nacional a mesma lógica que vale na sua conta:{' '}
            <span style={{ background: A2.cremeAfundado, padding: '0 2px' }}>
              o pico é caro porque toda a infraestrutura precisa estar pronta para ele — mesmo que ele dure vinte
              minutos por ano
            </span>
            . A Consequência 2 da tese central, de novo.
          </P>
          <P>
            A <b>curva de carga</b> é o retrato da demanda ao longo do tempo. A curva residencial tem picos de manhã e
            de início de noite (banho, cozinha, iluminação, climatização). A industrial pode ser estável (operação
            24/7), em degraus (turnos) ou irregular (partidas de máquinas). O SIN soma tudo: vale de madrugada, rampa
            pela manhã, patamar à tarde, pico no início da noite.
          </P>
          <Secao n="4.2">Curva líquida: o que sobrou para o operador atender</Secao>
          <P>
            Agora o conceito moderno. Com dezenas de gigawatts de solar — centralizada e nos telhados (MMGD) —, parte
            da carga é atendida "antes" de chegar ao despacho. O que importa para o operador não é mais a carga total,
            e sim a <b>carga líquida</b>:
          </P>
          <Formula
            eq={
              <>
                Carga líquida <i style={{ fontStyle: 'normal', color: A2.tintaMetadado, margin: '0 6px' }}>=</i> Carga
                total <i style={{ fontStyle: 'normal', color: A2.tintaMetadado, margin: '0 6px' }}>−</i> Geração solar{' '}
                <i style={{ fontStyle: 'normal', color: A2.tintaMetadado, margin: '0 6px' }}>−</i> Geração eólica
              </>
            }
            detalhe="É a curva líquida que define quanta geração despachável precisa estar pronta"
          />
          <P>
            O efeito visual: a curva líquida afunda no meio do dia (sol a pino) e dispara quando o sol se põe —
            exatamente na hora em que as pessoas chegam em casa. Esse degrau é a <b>rampa do fim da tarde</b>: em
            poucas horas, o sistema precisa substituir dezenas de gigawatts de sol por hidro flexível, térmicas,
            baterias e importação entre regiões.{' '}
            <span style={{ background: A2.cremeAfundado, padding: '0 2px' }}>É a janela mais tensa do dia do operador</span>{' '}
            — e onde recursos de flexibilidade valem mais.
          </P>
          <Secao n="4.3">Monte o dia você mesmo</Secao>
          <P>
            No simulador abaixo, controle quanta solar existe no sistema e como está o céu. Observe a curva total e a
            curva líquida se separarem ao meio-dia e se reencontrarem violentamente no fim da tarde. O número que
            importa está no painel: a rampa máxima, em GW por hora.
          </P>
        </Fila>

        <Palco
          id="inst04"
          largo
          movel={movel}
          numero="INST·04"
          titulo="Simulador · Curva líquida e a rampa do fim da tarde"
          modo="desenhar → comparar → meta"
        >
          <QuadroDeComparacao
            movel={movel}
            colunas={[
              {
                rotulo: 'Hora do mínimo',
                valor: revelado ? (
                  <>
                    {leituraTraco.horaMinimo} h <small style={{ fontSize: '13px', fontWeight: 400, color: A.tintaSuave }}>prevista</small> ·{' '}
                    {cenario.horaMinimo} h <small style={{ fontSize: '13px', fontWeight: 400, color: A.tintaSuave }}>calculada</small>
                  </>
                ) : (
                  <span style={{ fontSize: '14px', fontStyle: 'italic', color: A.tintaSuave, display: 'inline-flex', gap: '7px', alignItems: 'center' }}>
                    <MarcaEstacao estado="por-percorrer" tamanho={12} cor={A.tintaSuave} /> previsão ainda não registrada
                  </span>
                ),
              },
              {
                rotulo: 'Maior subida em 1 hora',
                valor: revelado ? (
                  <>
                    +{n1(leituraTraco.rampa)} <small style={{ fontSize: '13px', fontWeight: 400, color: A.tintaSuave }}>prevista</small> · +
                    {n1(cenario.rampa)} <small style={{ fontSize: '13px', fontWeight: 400, color: A.tintaSuave }}>GW/h calculada</small>
                  </>
                ) : (
                  <Velado>calculada aparece depois do registro</Velado>
                ),
              },
              {
                rotulo: 'Seu traço × curva calculada',
                prosa: true,
                valor: revelado ? (
                  <>
                    Maior distância: <b style={{ fontWeight: 600 }}>{n1(maiorDistancia.d)} GW às {maiorDistancia.hora} h</b>. Leitura do
                    traço interpolado hora a hora, no cenário de 95 GW de pico e 30 GW de solar.
                  </>
                ) : (
                  <span style={{ fontStyle: 'italic', color: A.tintaSuave }}>Pico 95 GW · solar 30 GW · céu limpo</span>
                ),
              },
            ]}
          />

          <Figura
            titulo="O pôr do sol virou a hora mais tensa do dia"
            subtitulo={`Carga do sistema no modelo do curso, em GW, hora a hora · pico ${n0(pico)} GW · solar ${n0(solar)} GW · ${CEU.find((c) => c.id === ceu)?.rotulo.toLowerCase()}`}
          >
            <SerieFigura modelo={m} traco={revelado ? tracoHora : null} movel={movel} pico={pico} />
          </Figura>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: movel ? '1fr' : '1fr 1fr 1.4fr',
              gap: movel ? '16px' : '28px',
              borderTop: `1px solid ${A.fioSobreCreme}`,
              paddingTop: '16px',
              marginTop: '10px',
            }}
          >
            <ReguaGraduada
              captura="instrumento-controle"
              rotulo="Solar instalada (UFV + MMGD)"
              unidade="GW"
              min={0}
              max={45}
              passo={1}
              valor={solar}
              aoMudar={setSolar}
              formatar={n0}
              marcas={[0, 15, 30, 45]}
            />
            <ReguaGraduada
              rotulo="Pico de carga do dia"
              unidade="GW"
              min={80}
              max={105}
              passo={1}
              valor={pico}
              aoMudar={setPico}
              formatar={n0}
              marcas={[80, 90, 100, 105]}
            />
            <div>
              <span style={{ ...aparatoForte, fontSize: '11px', display: 'block', marginBottom: '2px' }}>Condição do céu</span>
              <Escolhas
                rotuloGrupo="Condição do céu"
                colunas={movel ? 1 : 3}
                valor={ceu}
                aoEscolher={setCeu}
                opcoes={CEU.map((c) => ({ id: c.id, rotulo: c.rotulo }))}
              />
            </div>
          </div>

          <Saidas
            movel={movel}
            itens={[
              {
                rotulo: 'Carga líquida mínima',
                valor: revelado ? `${n0(m.minimo)} GW às ${m.horaMinimo}h` : <Velado>velada até o registro</Velado>,
              },
              {
                rotulo: 'Rampa máxima',
                valor: revelado ? `+${n1(m.rampa)} GW/h (${m.horaRampa}→${m.horaRampa + 1}h)` : <Velado>velada até o registro</Velado>,
              },
              { rotulo: 'Solar no pico do dia', valor: `${n0(m.solarNoPico)} GW` },
            ]}
          />

          {revelado && <LeituraDoInstrumento titulo={leitura.titulo}>{leitura.texto}</LeituraDoInstrumento>}

          <Fonte
            resumo={
              <>
                Curvas didáticas com formato típico do SIN (pico no início da noite); fonte externa dos valores não
                declarada. Carga real: dados abertos do ONS, para verificar.
              </>
            }
            ficha={
              <>
                <p style={{ margin: '0 0 8px' }}>
                  Curvas didáticas com formato típico do SIN. A operação real considera eólica, intercâmbios,
                  sazonalidade e dias atípicos. O objetivo é um único insight: <b>quanto mais solar, mais funda a
                  barriga do meio-dia e mais íngreme a rampa do pôr do sol</b>.
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ ...aparato, marginRight: '7px' }}>Nota · Alexandria</span>
                  O modelo subtrai só a solar; a fórmula da seção 4.2 também subtrai a eólica.
                </p>
              </>
            }
          />

          {/* ── Ato 2 · meta ── */}
          <div style={{ marginTop: '22px', borderTop: `1px dashed ${A.fioSobreCreme}`, paddingTop: '16px' }}>
            <Ato
              id="meta"
              ordem={2}
              genero="meta"
              movel={movel}
              enunciado={
                <>
                  Com pico de 95 GW e céu limpo, encontre a <b>menor solar instalada</b> em que a rampa passa do limiar
                  do modelo (10 GW/h).
                </>
              }
            >
              <p style={{ display: 'flex', alignItems: 'center', gap: '9px', margin: '0 0 10px', fontFamily: AF.corpo, fontSize: '15px' }}>
                <MarcaEstacao estado={metaAtingida || loop.temRegistro('meta') ? 'percorrido' : 'por-percorrer'} tamanho={13} />
                {/* ONDE, sempre; QUANTO, só depois do traço registrado (L2).
                    A rampa calculada é a resposta do Ato 1, e escapava por
                    aqui — o mesmo defeito da M01·A08, achado pelo verificador
                    do véu. */}
                <span>
                  {loop.temRegistro('meta')
                    ? `meta registrada · ${n0(alvoMeta)} GW de solar`
                    : pico !== 95 || cond !== 1
                      ? 'ajuste o pico para 95 GW e o céu para limpo — a meta é nesse cenário'
                      : m.rampa > 10
                        ? metaAtingida
                          ? 'menor solar encontrada'
                          : 'a rampa já passou do limiar; desça a solar até o ponto em que ela deixa de passar'
                        : 'ainda abaixo do limiar'}
                  <Medida ato="traco" valor={` · rampa +${n1(m.rampa)} GW/h`} />
                </span>
              </p>
              {!loop.temRegistro('meta') && (
                <>
                  <AcaoDeRegistro
                    movel={movel}
                    rotulo="Registrar meta"
                    pronto={metaAtingida}
                    oQueFalta="A meta registra quando a solar é a MENOR que faz a rampa passar do limiar do modelo."
                    aoClicar={() => loop.registrar('meta', { resumo: `${alvoMeta} GW`, atende: 'atende' })}
                  />
                  <p style={{ ...AT2.metadado, color: A2.tintaMetadado, margin: '8px 0 0' }}>
                    A detecção é por valor: o registro abre quando a solar é a MENOR que faz a rampa passar do limiar,
                    não em qualquer ponto acima dele.
                  </p>
                </>
              )}
            </Ato>
          </div>

          {/* ── Ato 3 · a conferência da forma (C7, T-AUTOAV) ── */}
          {revelado && (
            <div style={{ marginTop: '22px', borderTop: `1px dashed ${A.fioSobreCreme}`, paddingTop: '16px' }}>
              <Ato
                id="conferencia"
                ordem={3}
                genero="conferência da forma"
                movel={movel}
                enunciado={
                  <>
                    O critério da forma é este: <b>vale no meio do dia</b> e <b>maior subida entre 15 h e 19 h</b>. O
                    seu traço atende?
                  </>
                }
              >
                {!loop.temRegistro('conferencia') ? (
                  <>
                    <Escolhas
                      rotuloGrupo="Seu traço atende ao critério da forma"
                      colunas={movel ? 1 : 3}
                      valor={conferencia}
                      aoEscolher={setConferencia}
                      opcoes={[
                        { id: 'atende', rotulo: 'atende' },
                        { id: 'atende em parte', rotulo: 'atende em parte' },
                        { id: 'não atende', rotulo: 'não atende' },
                      ]}
                    />
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <AcaoDeRegistro
                        movel={movel}
                        rotulo="Registrar conferência"
                        captura="checagem-registrar"
                        pronto={Boolean(conferencia)}
                        oQueFalta="Diga se o seu traço atende ao critério da forma antes de registrar."
                        aoClicar={() =>
                          conferencia &&
                          loop.registrar('conferencia', {
                            resumo: conferencia,
                            atende: conferencia as RegistroDeAto['atende'],
                          })
                        }
                      />
                      <AvisoDeReferencia>
                        A leitura do seu próprio traço entra no registro, com a distância até a curva calculada.
                      </AvisoDeReferencia>
                    </div>
                  </>
                ) : (
                  <p style={{ fontFamily: AF.corpo, fontSize: '15px', lineHeight: 1.5, margin: 0 }}>
                    Conferência registrada: <b>{loop.registroDe('conferencia')?.atende}</b>. Seu mínimo caiu às{' '}
                    {leituraTraco.horaMinimo} h; o do modelo, às {cenario.horaMinimo} h — e a maior distância entre os
                    dois traçados foi de {n1(maiorDistancia.d)} GW às {maiorDistancia.hora} h.
                  </p>
                )}
              </Ato>
            </div>
          )}

          {loop.praticados > 0 && (
            <Praticado>
              <b>Praticado nesta aula:</b> {loop.praticados} de {loop.total} atos registrados. O traço fica guardado e
              volta na Aula 07, como o dia em que a bateria descarrega.
            </Praticado>
          )}
        </Palco>

        <Fila movel={movel}>
          <Secao n="4.4">Frequência: o medidor do balanço</Secao>
          <P>
            Como o sistema sabe, a cada segundo, se a respiração está em dia? Pela <b>frequência</b>. Recupere a Aula
            03 do Módulo 01 e suba um nível: em um sistema AC interligado, todos os geradores síncronos giram travados
            na mesma frequência elétrica. Quando a geração excede o consumo, o conjunto acelera e a frequência sobe
            acima de 60 Hz; quando falta geração, desacelera e a frequência cai.{' '}
            <span style={{ background: A2.cremeAfundado, padding: '0 2px' }}>
              Frequência estável = equilíbrio; frequência caindo = falta potência; frequência subindo = sobra potência.
            </span>{' '}
            É o batimento cardíaco do sistema, visível em qualquer ponto da rede ao mesmo tempo — e é ele que dispara
            as defesas da Aula 08.
          </P>
          <Nota titulo="Recursos que vencem a rampa">
            <P style={{ margin: 0 }}>
              Quem sobe a montanha das 17h às 20h? Hidrelétricas flexíveis (a vantagem estrutural brasileira), térmicas
              flexíveis, <b>baterias</b> (descarregam exatamente nessa janela), <b>resposta da demanda</b> (indústrias
              que deslocam consumo) e importação entre subsistemas. Cada um desses recursos tem valor crescente à
              medida que a solar cresce — guarde a lista: ela volta como oportunidade de negócio na Aula 07.
            </P>
          </Nota>
          <p style={{ ...AT2.metadado, fontStyle: 'italic', color: A2.tintaMetadado, margin: '0 0 8px' }}>
            Esta aula não tem exercício próprio no curso. Os três atos são da camada Alexandria, sobre o instrumento do
            módulo.
          </p>
        </Fila>

        <RegistroDaAula
          movel={movel}
          serveA={
            <>
              <b>Item 08 do checklist do módulo</b> · Desenhar a curva líquida de um dia ensolarado e apontar a rampa
              do fim da tarde
            </>
          }
          serveANota="Base da Aula 07 · recursos que vencem a rampa"
          avaliacao="Avaliação do Módulo 02: depois da Revisão, com o critério mostrado antes."
        />

        <ProximoPasso
          movel={movel}
          aoIr={navegar}
          sequencia="Aula 04 (esta aula) → Aula 05 → Revisão do Módulo 02 → Avaliação, que abre depois da Revisão, com o critério mostrado antes."
          semPratica={{ rotulo: 'Fazer o ato desta aula', codigo: 'M02·A04', titulo: 'desenhar a curva líquida', destino: '#aula-titulo' }}
          aRevisar={{ rotulo: 'Rever 4.2', codigo: 'INST·04', titulo: 'a forma da curva líquida e a janela da rampa', destino: '#inst04' }}
          normal={{
            rotulo: 'Próxima',
            codigo: 'M02·A05',
            titulo: 'Quem liga agora — e por quê.',
            destino: rotaDaAula(Math.min(numero + 1, totalAulas)),
          }}
        />

        <AcaoSecundaria href={rotaDoModulo}>Voltar à rota do Módulo 02</AcaoSecundaria>

        <div style={{ marginTop: '32px' }}>
          <CreditosDaRota
            linhas={[
              <>
                <b>Sem imagens nesta aula.</b> Tudo o que a aula afirma é relação de curvas no tempo, e o simulador do
                módulo já as desenha. A curadoria registrou a aula como "sem imagem", com o motivo.
              </>,
              <>
                <b>Curvas do INST·04.</b> Perfil horário e modelo solar do Módulo 02 (fonte externa dos valores não
                declarada); leitura por ramos, verbatim da fonte.
              </>,
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// ── C-PREV-TRACO ─────────────────────────────────────────────

function PlanoDoTraco({
  traco,
  ponto,
  aoMudar,
  aoEscolherPonto,
  carga,
  bloqueado,
}: {
  traco: number[];
  ponto: number;
  aoMudar: (i: number, v: number) => void;
  aoEscolherPonto: (i: number) => void;
  carga: number[];
  bloqueado: boolean;
}) {
  const W = 440;
  const H = 230;
  const x0 = 34;
  const x1 = 420;
  const y0 = 14;
  const y1 = 196;
  const vmin = 40;
  const vmax = 105;
  const X = (h: number) => x0 + (h / 24) * (x1 - x0);
  const Y = (v: number) => y0 + ((vmax - v) / (vmax - vmin)) * (y1 - y0);

  const teclado = (e: React.KeyboardEvent) => {
    if (bloqueado) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      aoEscolherPonto(Math.min(traco.length - 1, ponto + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      aoEscolherPonto(Math.max(0, ponto - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      aoMudar(ponto, Math.min(120, traco[ponto] + 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      aoMudar(ponto, Math.max(0, traco[ponto] - 1));
    }
  };

  return (
    <div
      data-capture="previsao-traco"
      role="slider"
      tabIndex={0}
      aria-label={`Traço da carga líquida prevista. Ponto de ${HORAS_DO_TRACO[ponto]} horas. Setas esquerda e direita andam nos pontos; cima e baixo mudam o valor em GW.`}
      aria-valuemin={0}
      aria-valuemax={120}
      aria-valuenow={traco[ponto]}
      aria-valuetext={`${HORAS_DO_TRACO[ponto]} horas, ${traco[ponto]} GW`}
      aria-disabled={bloqueado}
      onKeyDown={teclado}
      style={{ position: 'relative', border: 'none', borderTop: `1px solid ${A.fioSobreCreme}`, borderBottom: `1px solid ${A.fioSobreCreme}`, marginBottom: '6px', cursor: bloqueado ? 'default' : 'pointer' }}
      onPointerDown={(e) => {
        if (bloqueado) return;
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const fx = ((e.clientX - r.left) / r.width) * W;
        const fy = ((e.clientY - r.top) / r.height) * H;
        let melhor = 0;
        HORAS_DO_TRACO.forEach((h, i) => {
          if (Math.abs(X(h) - fx) < Math.abs(X(HORAS_DO_TRACO[melhor]) - fx)) melhor = i;
        });
        aoEscolherPonto(melhor);
        const v = Math.round(vmax - ((fy - y0) / (y1 - y0)) * (vmax - vmin));
        aoMudar(melhor, Math.max(0, Math.min(120, v)));
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {[40, 60, 80, 100].map((v) => (
          <g key={v}>
            <line x1={x0} y1={Y(v)} x2={x1} y2={Y(v)} stroke={A2.fioClaroSobreCreme} />
            <text x={x0 - 8} y={Y(v) + 4} textAnchor="end" fontSize="11.5" fill={A.tintaSuave} fontFamily={AF.corpo}>
              {v}
            </text>
          </g>
        ))}
        {[0, 6, 12, 18, 24].map((h) => (
          <text key={h} x={X(h)} y={y1 + 20} textAnchor="middle" fontSize="11.5" fill={A.tintaSuave} fontFamily={AF.corpo}>
            {h} h
          </text>
        ))}
        <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={A.tintaSobreCreme} />
        <polyline
          points={carga.map((v, h) => `${X(h).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}
          fill="none"
          stroke={A.tintaSuave}
          strokeWidth="1.6"
        />
        <text x={X(18) + 4} y={Y(carga[18]) - 6} fontSize="11.5" fill={A.tintaSuave} fontFamily={AF.corpo}>
          carga total
        </text>
        <polyline
          points={HORAS_DO_TRACO.map((h, i) => `${X(h).toFixed(1)},${Y(traco[i]).toFixed(1)}`).join(' ')}
          fill="none"
          stroke={A.navy}
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        {HORAS_DO_TRACO.map((h, i) => (
          <circle
            key={h}
            cx={X(h)}
            cy={Y(traco[i])}
            r={i === ponto ? 6.5 : 4.5}
            fill={i === ponto ? A.navy : A2.cremeSuperficie}
            stroke={A.navy}
            strokeWidth="1.6"
          />
        ))}
      </svg>
    </div>
  );
}

// ── V-SER · a série ──────────────────────────────────────────

function SerieFigura({ modelo: m, traco, movel, pico }: { modelo: Modelo; traco: number[] | null; movel: boolean; pico: number }) {
  const vmax = Math.ceil((pico + 5) / 10) * 10;
  const vmin = Math.max(0, Math.floor((m.minimo - 10) / 10) * 10);

  if (movel) {
    // Retrato: o tempo desce pelo eixo vertical (T13 — versão própria, nunca
    // miniatura da de 1440).
    const x0 = 46;
    const x1 = 320;
    const y0 = 34;
    const y1 = 560;
    const X = (v: number) => x0 + ((v - vmin) / (vmax - vmin)) * (x1 - x0);
    const Y = (h: number) => y0 + (h / 24) * (y1 - y0);
    return (
      <svg
        viewBox="0 0 340 590"
        role="img"
        aria-label={`Série em retrato, tempo de cima para baixo. Carga total e carga líquida calculada, com mínimo de ${n0(m.minimo)} gigawatts às ${m.horaMinimo} horas e rampa máxima de ${n1(m.rampa)} gigawatts por hora entre ${m.horaRampa} e ${m.horaRampa + 1} horas.`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {[vmin, (vmin + vmax) / 2, vmax].map((v) => (
          <g key={v}>
            <line x1={X(v)} y1={y0} x2={X(v)} y2={y1} stroke={A2.fioClaroSobreCreme} />
            <text x={X(v)} y={y0 - 10} textAnchor="middle" fontSize="12" fill={A.tintaSuave} fontFamily={AF.corpo}>
              {n0(v)}
            </text>
          </g>
        ))}
        <text x={x1} y={y0 - 26} textAnchor="end" fontSize="12" fill={A.tintaSuave} fontFamily={AF.corpo}>
          GW
        </text>
        {[0, 6, 12, 18, 24].map((h) => (
          <text key={h} x={x0 - 8} y={Y(h) + 4} textAnchor="end" fontSize="12" fill={A.tintaSuave} fontFamily={AF.corpo}>
            {h} h
          </text>
        ))}
        <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={A.tintaSobreCreme} />
        <polyline points={m.carga.map((v, h) => `${X(v).toFixed(1)},${Y(h).toFixed(1)}`).join(' ')} fill="none" stroke={A.tintaSuave} strokeWidth="2" />
        <text x={X(m.carga[19]) - 6} y={Y(19) + 16} textAnchor="end" fontSize="12" fill={A.tintaSuave} fontFamily={AF.corpo}>
          carga total
        </text>
        {traco && (
          <>
            <polyline points={traco.map((v, h) => `${X(v).toFixed(1)},${Y(h).toFixed(1)}`).join(' ')} fill="none" stroke={A.tintaSobreCreme} strokeWidth="2" strokeDasharray="7 5" />
            <polyline points={m.liquida.map((v, h) => `${X(v).toFixed(1)},${Y(h).toFixed(1)}`).join(' ')} fill="none" stroke={A.navy} strokeWidth="3.2" />
            <circle cx={X(m.minimo)} cy={Y(m.horaMinimo)} r="5" fill={A.navy} />
            <text x={X(m.minimo) + 10} y={Y(m.horaMinimo) + 4} fontSize="12" fontWeight="600" fill={A.navy} fontFamily={AF.corpo}>
              mínimo {n0(m.minimo)} GW · {m.horaMinimo} h
            </text>
            <line
              x1={X(m.liquida[m.horaRampa])}
              y1={Y(m.horaRampa)}
              x2={X(m.liquida[m.horaRampa + 1])}
              y2={Y(m.horaRampa + 1)}
              stroke={A.terracota}
              strokeWidth="6"
            />
            <text x={X(m.liquida[m.horaRampa]) - 8} y={Y(m.horaRampa + 0.6)} textAnchor="end" fontSize="12" fontWeight="600" fill={A.terracota} fontFamily={AF.corpo}>
              +{n1(m.rampa)} GW/h
            </text>
            <text x={X(traco[4]) + 8} y={Y(4) + 4} fontSize="12" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
              seu traço
            </text>
          </>
        )}
        {!traco && (
          <>
            <text x={56} y={Y(11)} fontSize="12.5" fontStyle="italic" fill={A.tintaSuave} fontFamily={AF.corpo}>
              A carga líquida calculada
            </text>
            <text x={56} y={Y(11) + 17} fontSize="12.5" fontStyle="italic" fill={A.tintaSuave} fontFamily={AF.corpo}>
              aparece depois do registro.
            </text>
          </>
        )}
      </svg>
    );
  }

  const x0 = 56;
  const x1 = 1000;
  const y0 = 22;
  const y1 = 330;
  const X = (h: number) => x0 + (h / 24) * (x1 - x0);
  const Y = (v: number) => y0 + ((vmax - v) / (vmax - vmin)) * (y1 - y0);
  const fs = 13;
  const eixos = [vmin, vmin + (vmax - vmin) / 3, vmin + (2 * (vmax - vmin)) / 3, vmax];

  return (
    <svg
      viewBox="0 0 1100 360"
      role="img"
      aria-label={`Série de 0 a 24 horas. Carga total com vale de madrugada e pico no início da noite; carga líquida calculada com mínimo de ${n0(m.minimo)} gigawatts às ${m.horaMinimo} horas e rampa máxima de ${n1(m.rampa)} gigawatts por hora entre ${m.horaRampa} e ${m.horaRampa + 1} horas.`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {[
        [0, 6, 'madrugada'],
        [10, 14, 'sol a pino'],
        [16, 21, 'pôr do sol e início da noite'],
      ].map(([a, b, t]) => (
        <g key={String(t)}>
          <rect x={X(a as number)} y={y0} width={X(b as number) - X(a as number)} height={y1 - y0} fill={A.cremePapel} />
          <text
            x={(X(a as number) + X(b as number)) / 2}
            y={y0 + fs + 4}
            textAnchor="middle"
            fontSize={fs}
            fill={A2.tintaMetadado}
            fontStyle="italic"
            fontFamily={AF.corpo}
          >
            {t}
          </text>
        </g>
      ))}
      {eixos.map((v) => (
        <g key={v}>
          <line x1={x0} y1={Y(v)} x2={x1} y2={Y(v)} stroke={A2.fioClaroSobreCreme} />
          <text x={x0 - 8} y={Y(v) + 4} textAnchor="end" fontSize={fs} fill={A.tintaSuave} fontFamily={AF.corpo}>
            {n0(v)}
          </text>
        </g>
      ))}
      {[0, 6, 12, 18, 24].map((h) => (
        <text key={h} x={X(h)} y={y1 + fs + 10} textAnchor="middle" fontSize={fs} fill={A.tintaSuave} fontFamily={AF.corpo}>
          {h} h
        </text>
      ))}
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={A.tintaSobreCreme} />
      <polyline points={m.carga.map((v, h) => `${X(h).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')} fill="none" stroke={A.tintaSuave} strokeWidth="2" />
      <text x={X(24) + 6} y={Y(m.carga[24]) - 6} fontSize={fs} fill={A.tintaSuave} fontFamily={AF.corpo}>
        carga total
      </text>
      {!traco ? (
        <>
          <text x={X(11.5)} y={Y(vmin + (vmax - vmin) * 0.34)} textAnchor="middle" fontSize={fs} fontStyle="italic" fill={A.tintaSuave} fontFamily={AF.corpo}>
            A carga líquida calculada aparece
          </text>
          <text x={X(11.5)} y={Y(vmin + (vmax - vmin) * 0.34) + 18} textAnchor="middle" fontSize={fs} fontStyle="italic" fill={A.tintaSuave} fontFamily={AF.corpo}>
            sobre o seu traço, depois do registro.
          </text>
        </>
      ) : (
        <>
          <polyline points={traco.map((v, h) => `${X(h).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')} fill="none" stroke={A.tintaSobreCreme} strokeWidth="2" strokeDasharray="7 5" />
          <text x={X(3)} y={Y(traco[3]) + 20} fontSize={fs} fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
            seu traço
          </text>
          <polyline points={m.liquida.map((v, h) => `${X(h).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')} fill="none" stroke={A.navy} strokeWidth="3.2" />
          <circle cx={X(m.horaMinimo)} cy={Y(m.minimo)} r="5.5" fill={A.navy} />
          <text x={X(m.horaMinimo) - 10} y={Y(m.minimo) + 26} textAnchor="end" fontSize={fs} fontWeight="600" fill={A.navy} fontFamily={AF.corpo}>
            carga líquida calculada
          </text>
          <text x={X(m.horaMinimo) - 10} y={Y(m.minimo) + 26 + fs + 4} textAnchor="end" fontSize={fs} fill={A.navy} fontFamily={AF.corpo}>
            mínimo {n0(m.minimo)} GW às {m.horaMinimo} h
          </text>
          <line
            x1={X(m.horaRampa)}
            y1={Y(m.liquida[m.horaRampa])}
            x2={X(m.horaRampa + 1)}
            y2={Y(m.liquida[m.horaRampa + 1])}
            stroke={A.terracota}
            strokeWidth="6"
          />
          {/* O rótulo da rampa desce para a faixa vazia sob a curva, com fio
              de chamada: em cima ele cruzava o traçado da carga total
              (medido no render da r02). */}
          <line
            x1={(X(m.horaRampa) + X(m.horaRampa + 1)) / 2}
            y1={(Y(m.liquida[m.horaRampa]) + Y(m.liquida[m.horaRampa + 1])) / 2}
            x2={X(18.4)}
            y2={Y(vmin + (vmax - vmin) * 0.22)}
            stroke={A.terracota}
            strokeWidth="1"
          />
          <text x={X(18.6)} y={Y(vmin + (vmax - vmin) * 0.22)} fontSize={fs} fontWeight="600" fill={A.terracota} fontFamily={AF.corpo}>
            rampa máxima +{n1(m.rampa)} GW/h
          </text>
          <text x={X(18.6)} y={Y(vmin + (vmax - vmin) * 0.22) + fs + 4} fontSize={fs} fill={A.terracota} fontFamily={AF.corpo}>
            {m.horaRampa} → {m.horaRampa + 1} h
          </text>
        </>
      )}
    </svg>
  );
}
