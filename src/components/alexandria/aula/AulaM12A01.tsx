// M12·A01 — "Oitenta e sete por cento de quê, exatamente" · arquétipo LUPA.
//
// Porte de `prototipos/_src/lupa-m12-a01.html`, com as correções do critic
// (CORRECOES.md · LUPA): o valor oficial da matriz energética e a parte
// renovável de fora da eletricidade ficam VELADOS até a estimativa — os dois
// juntos calculariam a resposta do Ato 1 —, e a linha de fonte tem versão
// inicial sem o número.
//
// FORMA DA PREVISÃO. O protótipo pedia um número digitado. Aqui o Ato 1 é
// uma FAIXA: o learner crava em qual faixa a renovabilidade da matriz
// energética cai. É previsão categórica (a forma mais comum do currículo,
// 67 das 141 aulas), as quatro faixas cobrem o intervalo inteiro e nenhuma
// delas entrega a resposta. No mosaico, a faixa registrada aparece como
// FAIXA — duas linhas e a hachura entre elas —, não como um traço único que
// fingiria precisão que o learner não afirmou.
//
// A régua de comparação do fim é a mesma dos outros arquétipos: o ato, o
// véu, a fonte, o registro e o próximo passo têm a mesma forma e a mesma
// posição. A variedade está no palco: aqui ele é o PAR DE NÚMEROS com os
// trilhos de declaração entre eles.

import { useState } from 'react';
import { A, A2, AF, AT2 } from '@/design/alexandria-tokens';
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
  Comparacao,
  CreditosDaRota,
  Escolhas,
  Figura,
  Fila,
  Fonte,
  ImagemDaAula,
  LeituraDoInstrumento,
  LoopDaAulaProvider,
  MEDIDA_LEITURA,
  MiniRota,
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
  Velatura,
  Voz,
  aparato,
  aparatoForte,
  useLoop,
  type AssetDaAula,
} from './tronco';

const AQUIFERO: AssetDaAula = {
  base: 'm12-a01-01-aquifero-bacia-superficie',
  slots: [560, 1000],
  largura: 1000,
  altura: 664,
  classe: 'explicacao',
  alt: 'Gravura em bloco-diagrama de um terreno cortado como uma fatia. Na superfície, à esquerda, uma barragem com reservatório, conduto forçado e casa de força sobre um rio. Abaixo do solo, uma camada de arenito saturado que atravessa toda a fatia, sem ligação com o rio.',
  legenda:
    'Duas águas, dois papéis. A usina hidrelétrica depende da água que corre e se acumula na superfície: o reservatório, o conduto, a vazão do rio. O aquífero é água subterrânea, relevante para abastecimento, irrigação e cooperação regional — e sem relação direta com geração hidrelétrica.',
  credito:
    'Ilustração explicativa gerada por IA (Higgsfield · GPT Image 2.5), 2026. Explicação, não documento. Esquemática: não representa local real nem escala real.',
};

const FAIXAS_DE_ESTIMATIVA = [
  { id: 'f1', rotulo: 'menos de 40%', de: 0, ate: 40 },
  { id: 'f2', rotulo: 'entre 40% e 60%', de: 40, ate: 60 },
  { id: 'f3', rotulo: 'entre 60% e 80%', de: 60, ate: 80 },
  { id: 'f4', rotulo: 'mais de 80%', de: 80, ate: 100 },
];

const CAMPOS_DA_FRASE = [
  { id: 'grandeza', rotulo: 'grandeza' },
  { id: 'denominador', rotulo: 'denominador' },
  { id: 'ano', rotulo: 'ano-base' },
  { id: 'fonte', rotulo: 'fonte' },
  { id: 'nenhum', rotulo: 'nenhum deles' },
];

const n1 = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const n0 = (v: number) => Math.round(v).toLocaleString('pt-BR');

export function AulaM12A01(props: PropsDaAula) {
  return (
    <LoopDaAulaProvider total={4} visitante={props.visitante}>
      <Corpo {...props} />
    </LoopDaAulaProvider>
  );
}

function Corpo({ numero, totalAulas, percorridas, navegar, rotaDaAula, rotaDoModulo }: PropsDaAula) {
  // Uma coluna abaixo de 1100 (ver AulaM01A08).
  const movel = useLargura() !== 'largo';
  const loop = useLoop();

  const [faixa, setFaixa] = useState<string | null>(null);
  const reg1 = loop.registroDe('estimativa');
  const revelado = Boolean(reg1);
  const faixaReg = FAIXAS_DE_ESTIMATIVA.find((f) => f.id === reg1?.resumo) ?? null;

  // INST·02 — separador de grandeza.
  const [eletrica, setEletrica] = useState(86.8);
  const [peso, setPeso] = useState(19);
  const [fora, setFora] = useState(41);
  const [oficial, setOficial] = useState(50);
  const agregada = (peso / 100) * eletrica + (1 - peso / 100) * fora;
  const contribuicao = (peso / 100) * eletrica;
  const distancia = eletrica - oficial;
  const desvio = agregada - oficial;

  const [marcados, setMarcados] = useState<string[]>([]);
  const reg2 = loop.registroDe('declarar');

  const reg3 = loop.registroDe('meta');
  const [erro, setErro] = useState<string | null>(null);
  const reg4 = loop.registroDe('erro');

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Abertura
        movel={movel}
        eyebrow={movel ? 'M12 · Aula 01 de 08' : 'M12 · Geopolítica Energética do Brasil · Aula 01 de 08'}
        titulo="Oitenta e sete por cento de quê, exatamente"
        subtitulo="O paradoxo"
        vozPergunta={<Voz rotulo="Pergunta da aula" fonte="Alexandria" />}
        pergunta="Quando alguém diz que o Brasil é “87% renovável”, de qual conta está falando — e quanto sobra quando a conta é toda a energia do país?"
        objetivo="Reconstruir o denominador de um percentual de renovabilidade antes de aceitá-lo, e citar as duas grandezas, cada uma com fonte e ano-base."
        lede={
          revelado ? (
            <>
              A frase mais repetida sobre energia no Brasil é também a mais mal citada. "O Brasil tem quase noventa por
              cento de energia renovável" é verdadeira e falsa ao mesmo tempo, e o que decide qual das duas é a palavra
              que quase nunca vem junto: se a grandeza é matriz elétrica ou matriz energética. São duas contas
              diferentes, com dois denominadores diferentes, e a diferença entre elas é de quase quarenta pontos
              percentuais — grande o bastante para inverter completamente a conclusão de uma conversa.
            </>
          ) : (
            <>
              A frase mais repetida sobre energia no Brasil é também a mais mal citada. "O Brasil tem quase noventa por
              cento de energia renovável" é verdadeira e falsa ao mesmo tempo, e o que decide qual das duas é a palavra
              que quase nunca vem junto: se a grandeza é matriz elétrica ou matriz energética.{' '}
              <Velado>o resto do lide aparece depois da sua estimativa</Velado>
            </>
          )
        }
        materia={
          <PranchaDeEntrada
            titulo="Renovável em quê? A palavra que falta é o denominador."
            nota="Mesmo numerador, caixas diferentes embaixo. Quanto vale a conta maior é o que o ato ao lado pede."
          >
            <DoisDenominadores />
          </PranchaDeEntrada>
        }
        ladoDireito={
          <>
            <Ato
              id="estimativa"
              ordem={1}
              genero="estimativa"
              movel={movel}
              enunciado={
                <>
                  E se a conta for <b>toda a energia</b> consumida no país — diesel, aviação, calor industrial, gás e
                  eletricidade? Em que faixa caem as renováveis?
                </>
              }
            >
              <div style={{ borderTop: `1.4px solid ${A.tintaSobreCreme}`, borderBottom: `1px solid ${A.fioSobreCreme}`, padding: movel ? '6px 0' : '10px 0', margin: movel ? '0 0 10px' : '0 0 14px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: AF.corpo, fontWeight: 500, fontSize: movel ? '30px' : '44px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    86,8<span style={{ fontSize: '0.5em', marginLeft: '2px', color: A.tintaSuave }}>%</span>
                  </span>
                  <span style={{ fontFamily: AF.corpo, fontSize: movel ? '14px' : '15px', lineHeight: 1.3, minWidth: 0 }}>
                    renováveis na <b>matriz elétrica</b> do Brasil, 2025
                  </span>
                </div>
                <div style={{ ...AT2.metadado, fontSize: '12.5px', color: A.tintaSuave, marginTop: '5px', borderTop: `1px solid ${A2.fioClaroSobreCreme}`, paddingTop: '4px' }}>
                  <span style={{ ...aparatoForte, fontSize: '11px', marginRight: '6px' }}>Fonte</span>
                  Balanço Energético Nacional 2026, ano-base 2025 · EPE/MME · consultado em 02/08/2026
                </div>
              </div>
              {!reg1 ? (
                <>
                  <Escolhas
                    rotuloGrupo="Faixa da renovabilidade da matriz energética"
                    colunas={2}
                    valor={faixa}
                    aoEscolher={setFaixa}
                    opcoes={FAIXAS_DE_ESTIMATIVA.map((f, i) => ({ id: f.id, rotulo: f.rotulo, captura: `ato-opcao-${i + 1}` }))}
                  />
                  <AcaoDeRegistro
                    movel={movel}
                    rotulo="Registrar estimativa"
                    objeto="matriz energética"
                    captura="ato-registrar"
                    pronto={Boolean(faixa)}
                    oQueFalta="Escolha uma faixa antes de registrar."
                    aoClicar={() =>
                      faixa &&
                      loop.registrar('estimativa', {
                        resumo: faixa,
                        atende: faixa === 'f2' ? 'atende' : 'não atende',
                      })
                    }
                  />
                  <AvisoDeVisitante />
                </>
              ) : (
                <>
                  <p style={{ fontFamily: AF.corpo, fontWeight: 500, fontSize: '22px', lineHeight: 1.2, margin: '0 0 4px' }}>
                    {faixaReg?.rotulo}
                    <span style={{ fontSize: '14px', color: A.tintaSuave, fontWeight: 400 }}> · registrado</span>
                  </p>
                  <p style={{ ...AT2.metadado, margin: '4px 0 10px' }}>
                    Referência: <b>~50%</b> (BEN 2026). {faixaReg?.id === 'f2' ? 'Sua faixa contém a referência.' : 'Sua faixa não contém a referência.'}{' '}
                    <i>A faixa é regra de entrada da Alexandria, porque a fonte diz “~50%”; não é margem do dado.</i>
                  </p>
                  <AcaoSecundaria href="#lupa">Ir à lupa · dois denominadores</AcaoSecundaria>
                </>
              )}
            </Ato>

            <MiniRota codigoModulo="M12" total={totalAulas} atual={numero} percorridas={percorridas} movel={movel} rota={rotaDaAula} />

            <Recuperacao
              movel={movel}
              origem="M10·A03"
              pergunta="Numa fatura industrial, qual linha mede energia: a de demanda (kW) ou a de consumo (kWh)?"
            >
              <Escolhas
                rotuloGrupo="Qual linha mede energia"
                colunas={1}
                valor={null}
                aoEscolher={() => undefined}
                opcoes={[
                  { id: 'd', rotulo: 'Demanda (kW)' },
                  { id: 'c', rotulo: 'Consumo (kWh)' },
                  { id: 'x', rotulo: 'As duas' },
                ]}
              />
              <AvisoDeReferencia>A referência aparece depois da sua nova tentativa.</AvisoDeReferencia>
            </Recuperacao>
          </>
        }
      />

      <div style={{ paddingTop: '36px' }}>
        <Fila movel={movel}>
          <Secao n="01.1">Dois denominadores, duas contas, uma confusão previsível</Secao>
          <P>
            A{' '}
            <Termo
              termo="matriz elétrica"
              previa="Mede apenas a eletricidade. O denominador é a Oferta Interna de Energia Elétrica, em terawatt-hora."
              verbete="Léxico do Módulo 12 · verbete completo ainda não disponível."
            />{' '}
            mede apenas a eletricidade. O denominador é a Oferta Interna de Energia Elétrica: tudo que foi gerado no
            país mais o que foi importado, medido em terawatt-hora. Nessa conta, o Brasil é excepcional pelos padrões
            mundiais, e é dessa conta que vêm todos os números de liderança.
          </P>
          <P>
            A <b>matriz energética</b> mede toda a energia consumida no país, em qualquer forma. O denominador é a
            Oferta Interna de Energia, medida em tonelada equivalente de petróleo, e inclui o diesel do caminhão, o
            combustível do avião, o gás da indústria química, o coque da siderurgia e o calor de processo — além da
            eletricidade. Nessa conta o Brasil continua muito acima da média mundial, mas o número{' '}
            {revelado ? (
              <b style={{ fontWeight: 600, background: A2.cremeAfundado, padding: '0 3px' }}>cai pela metade</b>
            ) : (
              <Velado>velado até a sua estimativa</Velado>
            )}
            , porque a eletricidade é apenas uma fatia da energia que uma economia consome.
          </P>
        </Fila>

        <Palco id="lupa" largo movel={movel} numero="LUPA" titulo="Dois números, duas grandezas · e o separador que liga as duas" modo="estimar → declarar → decompor">
          {/* Par de números com os trilhos de declaração entre eles */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: movel ? '1fr' : '1fr 300px 1fr',
              borderTop: `1.4px solid ${A.tintaSobreCreme}`,
              borderBottom: `1px solid ${A.fioSobreCreme}`,
            }}
          >
            <CartaoNumero
              eyebrow="Matriz elétrica · 2025"
              numero="86,8"
              corpo="Participação de fontes renováveis na Oferta Interna de Energia Elétrica. Era 88,2% em 2024. A queda veio da redução de 4,8% na geração hidrelétrica combinada com alta de 12,3% na geração térmica."
              fonte="BEN 2026, ano-base 2025 · EPE/MME · consultado em 02/08/2026"
              movel={movel}
            />
            <div
              role="table"
              aria-label="Declarações de cada número"
              style={{
                borderLeft: movel ? 'none' : `1px solid ${A.fioSobreCreme}`,
                borderRight: movel ? 'none' : `1px solid ${A.fioSobreCreme}`,
                borderTop: movel ? `1px solid ${A.fioSobreCreme}` : 'none',
                borderBottom: movel ? `1px solid ${A.fioSobreCreme}` : 'none',
                padding: '10px 0',
              }}
            >
              <div role="row" style={{ textAlign: 'center', ...AT2.metadado, fontStyle: 'italic', color: A2.tintaMetadado, paddingBottom: '4px' }}>
                o que cada número declara
              </div>
              {[
                ['eletricidade', 'grandeza', 'toda a energia'],
                ['OIEE', 'denominador', 'OIE'],
                ['TWh', 'unidade', 'Mtep'],
                ['2025', 'ano-base', '2025'],
                ['EPE/MME', 'fonte', 'EPE/MME'],
              ].map(([e, m, d]) => (
                <div
                  key={m}
                  role="row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 118px 1fr',
                    gap: '0 6px',
                    alignItems: 'center',
                    padding: '6px 10px',
                    borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
                    fontFamily: AF.corpo,
                    fontSize: '14px',
                  }}
                >
                  <span style={{ textAlign: 'right' }}>{e}</span>
                  <b style={{ ...aparato, fontSize: '11px', textAlign: 'center' }}>{m}</b>
                  <span style={{ paddingLeft: '2px' }}>{d}</span>
                </div>
              ))}
            </div>
            <CartaoNumero
              eyebrow="Matriz energética · 2025"
              numero={revelado ? '~50' : null}
              corpo={
                revelado
                  ? 'Participação de fontes renováveis na Oferta Interna de Energia total, de 327,9 milhões de toneladas equivalentes de petróleo. Petróleo e derivados sozinhos respondem por 33,7%; gás natural por 10,4%.'
                  : 'Mesma fonte, mesmo ano-base, outro denominador.'
              }
              fonte="BEN 2026, ano-base 2025 · EPE/MME · consultado em 02/08/2026"
              movel={movel}
            />
          </div>

          {/* ── Ato 2 · declarar ── */}
          <div style={{ borderBottom: `1px dashed ${A.fioSobreCreme}`, padding: '18px 0', marginBottom: '18px' }}>
            <Ato
              id="declarar"
              ordem={2}
              genero="declarar"
              movel={movel}
              enunciado={
                <>
                  A frase <q>O Brasil é 87% renovável</q> declara quais destes campos?
                </>
              }
            >
              {!reg2 ? (
                <>
                  <Escolhas
                    rotuloGrupo="Campos que a frase declara"
                    colunas={movel ? 1 : 5}
                    multipla
                    marcadas={marcados}
                    aoEscolher={(id) => setMarcados((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))}
                    opcoes={CAMPOS_DA_FRASE}
                  />
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <AcaoDeRegistro
                      movel={movel}
                      rotulo="Registrar marcação"
                      pronto={marcados.length > 0}
                      oQueFalta="Marque ao menos um campo — ou 'nenhum deles'. A leitura de referência só abre depois da sua marcação."
                      aoClicar={() =>
                        loop.registrar('declarar', {
                          resumo: marcados.map((m) => CAMPOS_DA_FRASE.find((c) => c.id === m)?.rotulo).join(', '),
                          atende: marcados.length === 1 && marcados[0] === 'nenhum' ? 'atende' : 'atende em parte',
                        })
                      }
                    />
                    <AvisoDeReferencia>A leitura de referência aparece depois.</AvisoDeReferencia>
                  </div>
                </>
              ) : (
                <Comparacao
                  movel={movel}
                  sua={reg2.resumo}
                  tituloReferencia="Leitura de referência · Alexandria, a partir do texto do curso"
                  referencia={
                    <>
                      <p style={{ margin: '0 0 8px' }}>
                        <b>Nenhum.</b> “Renovável” não diz se a conta é a eletricidade ou toda a energia; a frase
                        também não traz denominador, ano-base nem fonte.
                      </p>
                      <span style={{ ...aparato, display: 'block', margin: '8px 0 3px' }}>Forma corrigida · Alexandria</span>
                      <p style={{ margin: 0 }}>
                        “Em 2025, 86,8% da oferta interna de energia elétrica do Brasil veio de fontes renováveis (BEN
                        2026, EPE/MME).”
                      </p>
                    </>
                  }
                />
              )}
            </Ato>
          </div>

          {/* ── INST·02 ── */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'baseline', borderBottom: `1px solid ${A.tintaSobreCreme}`, paddingBottom: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ ...aparato, fontSize: '11px', letterSpacing: '0.2em' }}>INST·02</span>
            <b style={{ fontFamily: AF.corpo, fontWeight: 500, fontSize: '18px' }}>
              Separador de grandeza — quanto a eletricidade explica da energia total
            </b>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: movel ? '1fr' : '1.15fr 1fr', gap: movel ? '20px' : '32px', alignItems: 'start' }}>
            <Figura
              titulo="A renovabilidade total é a média das duas partes, pesada pelo tamanho de cada uma"
              subtitulo="Largura = peso na energia total (%) · altura = parte renovável (%) · área sombreada = renovabilidade agregada"
            >
              <Mosaico
                peso={peso}
                eletrica={eletrica}
                fora={fora}
                agregada={agregada}
                faixa={faixaReg}
                revelado={revelado}
              />
            </Figura>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <QuadroDeComparacao
                movel={movel}
                colunas={[
                  {
                    rotulo: 'Sua estimativa',
                    valor: revelado ? (
                      <span style={{ fontSize: movel ? '16px' : '18px' }}>{faixaReg?.rotulo}</span>
                    ) : (
                      <span style={{ fontSize: '14px', fontStyle: 'italic', color: A.tintaSuave, display: 'inline-flex', gap: '7px', alignItems: 'center' }}>
                        <MarcaEstacao estado="por-percorrer" tamanho={12} cor={A.tintaSuave} /> não registrada
                      </span>
                    ),
                  },
                  {
                    rotulo: 'Agregada implícita',
                    valor: revelado ? (
                      <>
                        {n1(agregada)} <small style={{ fontSize: '13px', fontWeight: 400, color: A.tintaSuave }}>%</small>
                      </>
                    ) : (
                      <Velado>depois do registro</Velado>
                    ),
                  },
                ]}
              />

              <ReguaGraduada
                captura="instrumento-controle"
                rotulo="Renováveis na matriz elétrica"
                unidade="%"
                min={0}
                max={100}
                passo={0.1}
                valor={eletrica}
                aoMudar={setEletrica}
                formatar={n1}
                marcas={[0, 25, 50, 75, 100]}
              />
              <ReguaGraduada
                rotulo="Peso da eletricidade na energia total"
                unidade="%"
                min={1}
                max={100}
                passo={0.5}
                valor={peso}
                aoMudar={setPeso}
                formatar={n1}
                marcas={[1, 25, 50, 75, 100]}
                nota="É o controle do Ato 3."
              />
              {revelado ? (
                <>
                  <ReguaGraduada
                    rotulo="Renováveis fora da eletricidade"
                    unidade="%"
                    min={0}
                    max={100}
                    passo={0.5}
                    valor={fora}
                    aoMudar={setFora}
                    formatar={n1}
                    marcas={[0, 25, 50, 75, 100]}
                  />
                  <ReguaGraduada
                    rotulo="Renováveis na matriz energética, valor oficial"
                    unidade="%"
                    min={0}
                    max={100}
                    passo={0.5}
                    valor={oficial}
                    aoMudar={setOficial}
                    formatar={n1}
                    marcas={[0, 25, 50, 75, 100]}
                  />
                </>
              ) : (
                <>
                  <div>
                    <span style={{ ...aparatoForte, fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                      Renováveis fora da eletricidade
                    </span>
                    <Velado>liberado depois da sua estimativa</Velado>
                  </div>
                  <div>
                    <span style={{ ...aparatoForte, fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                      Renováveis na matriz energética, valor oficial
                    </span>
                    <Velado>liberado depois da sua estimativa</Velado>
                  </div>
                  <p style={{ ...AT2.metadado, fontSize: '12.5px', fontStyle: 'italic', color: A2.tintaMetadado, margin: 0 }}>
                    Com o peso e a parte renovável de fora, a conta daria a resposta do Ato 1. Por isso os dois campos
                    só abrem depois do registro.
                  </p>
                </>
              )}

              <Saidas
                movel={movel}
                itens={[
                  {
                    rotulo: 'Distância entre as duas grandezas',
                    valor: revelado ? `${distancia >= 0 ? '+' : ''}${n1(distancia)} p.p.` : <Velado>velada</Velado>,
                  },
                  {
                    rotulo: 'Contribuição da eletricidade',
                    valor: revelado ? `${n1(contribuicao)} p.p. dos ${n1(agregada)} agregados` : <Velado>velada</Velado>,
                  },
                ]}
              />
              {revelado && (
                <p style={{ ...AT2.metadado, color: A.tintaSuave, margin: 0 }}>
                  Desvio contra o oficial: {desvio >= 0 ? '+' : ''}
                  {n1(desvio)} p.p.
                </p>
              )}
            </div>
          </div>

          {revelado && (
            <LeituraDoInstrumento
              titulo={
                Math.abs(desvio) <= 2
                  ? 'Leitura do instrumento · faixa “até 2 pontos do oficial”'
                  : 'Leitura do instrumento · fora da faixa “até 2 pontos do oficial”'
              }
            >
              {Math.abs(desvio) <= 2 ? (
                <>
                  <b>Consistente.</b> A renovabilidade agregada implícita fica dentro de dois pontos percentuais do
                  valor oficial informado. Isso significa que os três parâmetros de entrada descrevem a mesma economia
                  que a estatística oficial descreve — e que a distância de {n1(distancia)} pontos entre matriz
                  elétrica e matriz energética é real, não artefato de conta. É essa distância que precisa ser dita
                  sempre que um percentual de renovabilidade for citado.
                </>
              ) : (
                <>
                  <b>Inconsistente.</b> Com estes parâmetros, a agregada implícita se afasta {n1(Math.abs(desvio))}{' '}
                  pontos do valor oficial informado. Ou uma das entradas não descreve a mesma economia, ou a fronteira
                  contábil adotada é outra — declare qual antes de usar o resultado.
                </>
              )}
            </LeituraDoInstrumento>
          )}

          <Fonte
            resumo={
              revelado ? (
                <>
                  Valor oficial ~50% e 86,8%: BEN 2026 (EPE/MME), consultado em 02/08/2026. Peso 19% e renováveis fora
                  da eletricidade 41%: cenário didático do instrumento; fonte externa dos valores não declarada.
                </>
              ) : (
                <>
                  Valor oficial da matriz energética (velado até a estimativa) e 86,8%: BEN 2026 (EPE/MME), consultado
                  em 02/08/2026. Peso 19%: cenário didático do instrumento; fonte externa dos valores não declarada.
                </>
              )
            }
            ficha={
              <>
                <p style={{ margin: '0 0 8px' }}>
                  Os campos são entradas editáveis com fonte declarada, não constantes cravadas, porque mudam de ano
                  para ano e por metodologia. O peso da eletricidade na energia total é um valor de ordem de grandeza,
                  derivado da razão entre o consumo final de eletricidade e a Oferta Interna de Energia. Ele varia
                  conforme a fronteira contábil adotada — consumo final contra oferta interna, com ou sem perdas de
                  transformação — e por isso é entrada editável, não constante. Declare a fronteira sempre que usar o
                  resultado.
                </p>
                <p style={{ margin: 0 }}>
                  <b>Números vivos.</b> O percentual pontual muda todo ano — e mudou 1,4 ponto para baixo entre o
                  ano-base 2024 e o ano-base 2025. Se você citar "88%" em agosto de 2026, estará citando um dado de
                  dois anos antes sem dizer isso.
                </p>
              </>
            }
          />

          {/* ── Ato 3 · meta ── */}
          <div style={{ marginTop: '22px', borderTop: `1px dashed ${A.fioSobreCreme}`, paddingTop: '16px' }}>
            <Ato
              id="meta"
              ordem={3}
              genero="meta"
              movel={movel}
              enunciado={
                <>
                  Mova o <b>peso da eletricidade</b> e observe a área. Em uma frase: por que a distância entre{' '}
                  {revelado ? '86,8% e ~50%' : 'a matriz elétrica (86,8%) e a matriz energética'} não é erro de conta?
                </>
              }
            >
              {!reg3 ? (
                <>
                  <Escolhas
                    rotuloGrupo="Por que a distância não é erro de conta"
                    colunas={1}
                    valor={null}
                    aoEscolher={(v) =>
                      loop.registrar('meta', {
                        resumo: v,
                        atende: v === 'denominador' ? 'atende' : 'atende em parte',
                      })
                    }
                    opcoes={[
                      { id: 'denominador', rotulo: 'Porque os dois números têm denominadores diferentes: um mede eletricidade, o outro mede toda a energia.' },
                      { id: 'ano', rotulo: 'Porque os dois números são de anos diferentes.' },
                      { id: 'arredondamento', rotulo: 'Porque um deles está arredondado.' },
                      { id: 'nc', rotulo: 'Não é possível concluir.' },
                    ]}
                  />
                  <p style={{ display: 'flex', alignItems: 'center', gap: '9px', margin: '0', fontFamily: AF.corpo, fontSize: '15px' }}>
                    <MarcaEstacao estado={peso !== 19 ? 'percorrido' : 'por-percorrer'} tamanho={13} />
                    <span>
                      {peso !== 19
                        ? `peso movido para ${n1(peso)}% · agregada ${n1(agregada)}%`
                        : 'mova o peso da eletricidade para ver a área mudar'}
                    </span>
                  </p>
                </>
              ) : (
                <Comparacao
                  movel={movel}
                  sua={
                    reg3.resumo === 'denominador'
                      ? 'denominadores diferentes'
                      : reg3.resumo === 'ano'
                        ? 'anos diferentes'
                        : reg3.resumo === 'arredondamento'
                          ? 'arredondamento'
                          : 'não é possível concluir'
                  }
                  tituloReferencia="Referência · a própria figura"
                  referencia={
                    <>
                      A área do mosaico é a mesma conta feita duas vezes: a coluna estreita é a eletricidade, com{' '}
                      {n1(eletrica)}% renovável, e a coluna larga é todo o resto. A média pesada delas é a
                      renovabilidade total. Mudar o peso muda a média sem mudar nenhum dos dois percentuais — é
                      denominador, não erro.
                    </>
                  }
                />
              )}
            </Ato>
          </div>

          {loop.praticados > 0 && (
            <Praticado>
              <b>Praticado nesta aula:</b> {loop.praticados} de {loop.total} atos registrados.
            </Praticado>
          )}
        </Palco>

        <Fila
          movel={movel}
          lado={
            <Figura
              titulo="Duas fontes, dois números que não batem exatamente"
              subtitulo="Renováveis na eletricidade do Brasil, % · cada série com a sua fronteira"
              fonte={
                <Fonte
                  resumo={<>EPE/MME, BEN 2025 e 2026 · instituto internacional de pesquisa em energia (nome na ficha de referências do módulo) · consultados em 02/08/2026.</>}
                  ficha={<>Referências do Módulo 12 · ficha ainda não disponível.</>}
                />
              }
            >
              <DuasFontes />
            </Figura>
          }
        >
          <P>
            A armadilha é exatamente a mesma que os Módulos 10 e 11 já ensinaram em outras roupas — confundir demanda
            com energia na fatura, confundir microgeração com minigeração no enquadramento. É sempre o mesmo erro
            estrutural: <b>duas grandezas com nomes parecidos, unidades diferentes e denominadores diferentes, citadas
            como se fossem uma só</b>. A defesa também é sempre a mesma: antes de aceitar ou repetir um percentual,
            pergunte qual é o denominador.
          </P>
          <Secao n="01.2">"Líder do G20": de onde vem esse ranking, e por que não é dado brasileiro</Secao>
          <P>
            O percentual da matriz elétrica é dado oficial brasileiro. O <b>ranking</b> não é. Nenhum órgão brasileiro
            produz uma classificação comparativa dos países do G20 por renovabilidade elétrica, porque nenhum órgão
            brasileiro tem mandato para medir a matriz dos outros dezenove. Esse ranking vem de análise de um instituto
            internacional de pesquisa em energia, que recalcula todas as matrizes nacionais sob uma metodologia única
            para que a comparação seja possível.
          </P>
          <P>
            A distinção é operacional, não acadêmica. Quando você diz "86,8%", a fonte é a EPE e o interlocutor pode
            conferir no Balanço. Quando você diz "maior do G20", a fonte é outra, a metodologia é outra, e o número
            associado será ligeiramente diferente — na medição desse instituto, o Brasil aparece com 87% em 2025, 87%
            em 2024 e 89% em 2023. As diferenças de décimo vêm de fronteira contábil: o dado brasileiro parte da oferta
            interna de energia elétrica, incluindo importação; a medição internacional parte da geração.{' '}
            <b>
              Duas fontes respeitáveis, duas metodologias, dois números que não batem exatamente — e citar os dois com
              a fonte de cada um é mais forte do que escolher o mais favorável
            </b>
            , porque quem escolhe o mais favorável perde a conversa no instante em que o interlocutor conhece o outro.
          </P>
          <P>
            Dois fatos adicionais dessa mesma medição internacional, ambos de 2025 e ambos úteis em conversa: o Brasil
            dependeu de combustíveis fósseis para apenas cerca de 11% da sua eletricidade, e foi o segundo maior
            gerador hidrelétrico do mundo. As emissões do setor elétrico brasileiro atingiram o pico em 2014 e caíram
            desde então, apesar do crescimento da demanda — o que é o argumento mais forte disponível, porque é raro: a
            maioria das economias emergentes cresceu emissões elétricas na mesma década.
          </P>
        </Fila>

        {/* ── 01.3 · Ato 4 ── */}
        {/* A IMAGEM SAIU DO `lado` DESTA FILA. A legenda do bloco-diagrama diz,
            com todas as letras, que a água subterrânea "não move nenhuma
            turbina" — que é o veredito do Ato 4, logo abaixo. O verificador do
            véu (`tools/alexandria-veu`) achou os dois vazamentos aqui: a
            legenda e o parágrafo de correção. Os dois desceram para a velatura
            do ato, e a imagem passou a entrar JUNTO do parágrafo que ela
            explica — que é o bloco 13 do manifesto de mídia, o da hidrologia
            de superfície (C4). */}
        <Fila movel={movel}>
          <Secao n="01.3">O erro do currículo que este módulo corrige: aquífero não gera eletricidade</Secao>
          <div style={{ margin: '4px 0 22px' }}>
            <Ato
              id="erro"
              ordem={4}
              genero="identificar o erro"
              movel={movel}
              enunciado={<>“O Aquífero Guarani é reserva hídrica estratégica para a geração elétrica.”</>}
            >
              {!reg4 ? (
                <>
                  <Escolhas
                    rotuloGrupo="A frase está certa ou errada"
                    colunas={movel ? 1 : 3}
                    valor={erro}
                    aoEscolher={setErro}
                    opcoes={[
                      { id: 'certa', rotulo: 'Certa', captura: 'erro-opcao-1' },
                      { id: 'errada', rotulo: 'Errada', captura: 'erro-opcao-2' },
                      { id: 'nc', rotulo: 'Não é possível concluir', captura: 'erro-opcao-3' },
                    ]}
                  />
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <AcaoDeRegistro
                      movel={movel}
                      rotulo="Registrar resposta"
                      captura="checagem-registrar"
                      pronto={Boolean(erro)}
                      oQueFalta="Diga se a frase está certa, errada ou se não é possível concluir. A referência abre depois disso."
                      aoClicar={() => erro && loop.registrar('erro', { resumo: erro, atende: erro === 'errada' ? 'atende' : 'não atende' })}
                    />
                    <AvisoDeReferencia>Responda antes de ler a seção; a leitura abaixo é a referência.</AvisoDeReferencia>
                  </div>
                </>
              ) : (
                <Comparacao
                  movel={movel}
                  sua={reg4.resumo === 'certa' ? 'Certa' : reg4.resumo === 'errada' ? 'Errada' : 'Não é possível concluir'}
                  tituloReferencia="Referência · texto do curso (parágrafos seguintes)"
                  referencia={
                    <>
                      <b>Errada.</b> O Aquífero Guarani é reserva de água subterrânea transfronteiriça, sem relação
                      direta com geração hidrelétrica. A geração depende de hidrologia de superfície.
                    </>
                  }
                />
              )}
            </Ato>
          </div>
          <Velatura
            ato="erro"
            reserva={movel ? 170 : 150}
            largura={MEDIDA_LEITURA}
            oQue="A correção do currículo, e o bloco-diagrama que mostra as duas águas, são a referência do ato acima. Os dois abrem no seu registro."
          >
            <P>
              Uma associação circula com frequência suficiente para merecer correção explícita: a de que as "reservas
              hídricas estratégicas" do Brasil, e em particular o Aquífero Guarani, seriam um ativo de geração elétrica.
              Não são. O Aquífero Guarani é uma reserva de água <b>subterrânea</b> transfronteiriça, compartilhada com
              Argentina, Paraguai e Uruguai, relevante para abastecimento humano, irrigação e cooperação regional — sem
              relação direta com geração hidrelétrica.
            </P>
            <P>
              A geração hidrelétrica brasileira depende de hidrologia de <b>superfície</b>: as bacias do São Francisco,
              Tocantins-Araguaia, Paraná e Madeira, com seus reservatórios, suas vazões e sua variabilidade climática.
              Confundir as duas coisas custa caro numa conversa técnica, porque revela que a pessoa está repetindo uma
              lista de ativos sem entender o mecanismo de cada um. Quando o recurso hídrico aparecer como vetor de
              protagonismo — e ele aparece, legitimamente — o referente correto são as bacias de superfície, não o
              aquífero.
            </P>
            <div style={{ maxWidth: `${MEDIDA_LEITURA}px`, margin: '6px 0 22px' }}>
              <ImagemDaAula asset={AQUIFERO} sizes={movel ? '100vw' : '680px'} />
            </div>
          </Velatura>
          <P>
            Água, porém, é infraestrutura energética por outros caminhos, e vale conhecê-los: ela resfria processo
            industrial, produz vapor, entra em mineração e refino, e é insumo direto da eletrólise para produção de
            hidrogênio, onde precisa ter alta pureza. Em contexto de seca, água deixa de ser variável elétrica e vira
            variável federativa: energia passa a competir com abastecimento, navegação, irrigação e ecossistema, e a
            decisão sai da mesa do operador do sistema.
          </P>
          <Secao n="01.4">Etanol: protagonismo real, com o segundo lugar dito por extenso</Secao>
          <P>
            O Brasil é o <b>segundo</b> maior produtor mundial de etanol, atrás dos Estados Unidos. O dado tem duas
            leituras que precisam andar juntas. A primeira é de escala: 35,9 bilhões de litros produzidos em 2025, com
            mistura obrigatória de 30% de etanol anidro na gasolina desde agosto de 2025 e 15% de biodiesel no diesel a
            partir da mesma data. A segunda é de composição e vale mais: o etanol de <b>milho</b> chegou a 25% de toda
            a produção brasileira de etanol em 2025 — uma mudança estrutural de matéria-prima que reposiciona o
            Centro-Oeste dentro de uma indústria historicamente canavieira.
          </P>
          <Fonte
            resumo={<>35,9 bilhões de litros; 30%; 15%; 25%: procedência não declarada nesta seção · verificar antes de uso externo.</>}
            ficha={<>Referências do Módulo 12 · ficha ainda não disponível.</>}
          />
          <P style={{ marginTop: '22px' }}>
            Este módulo não desenvolve etanol além disso. Mistura obrigatória, mercado de crédito de descarbonização,
            biodiesel e a estrutura industrial do setor pertencem a outro bloco. Aqui, o etanol entra por dois motivos
            exclusivos: é fato de protagonismo global, e é o setor energético brasileiro que <b>foi atingido</b> pela
            medida comercial americana de 2026, enquanto os produtos energéticos em geral foram isentados — um
            contraste que a Aula 04 desenvolve e que é, em si, um dos fatos mais reveladores deste bloco.
          </P>
        </Fila>

        <RegistroDaAula
          movel={movel}
          serveA={
            <>
              Capacidade do módulo · <i>ainda não disponível</i>
            </>
          }
          serveANota="Mesmo mecanismo volta na Aula 07: duas metodologias, dois números"
          avaliacao="Avaliação do Módulo 12: depois da Revisão, com o critério mostrado antes."
        />

        <ProximoPasso
          movel={movel}
          aoIr={navegar}
          sequencia="Aula 01 (esta aula) → Aula 02 → Revisão do Módulo 12 → Avaliação, que abre depois da Revisão, com o critério mostrado antes."
          semPratica={{ rotulo: 'Fazer o ato desta aula', codigo: 'M12·A01', titulo: 'estimar a matriz energética', destino: '#aula-titulo' }}
          aRevisar={{ rotulo: 'Rever 01.1', codigo: 'LUPA', titulo: 'dois denominadores, duas contas', destino: '#lupa' }}
          normal={{
            rotulo: 'Próxima',
            codigo: 'M12·A02',
            titulo: 'O que foi decidido, o que ficou de fora, e por que a distinção é o conteúdo',
            destino: rotaDaAula(Math.min(numero + 1, totalAulas)),
          }}
        />

        <AcaoSecundaria href={rotaDoModulo}>Voltar à rota do Módulo 12</AcaoSecundaria>

        <div style={{ marginTop: '32px' }}>
          <CreditosDaRota
            linhas={[
              <>
                <b>Aquífero e bacia de superfície.</b> {AQUIFERO.credito}
              </>,
              <>
                <b>As demais figuras são programáticas.</b> Números não se fotografam: o mosaico e o gráfico das duas
                fontes são desenhados pela Alexandria com os números do curso.
              </>,
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// ── Prancha de entrada · os dois denominadores ───────────────
//
// A MATÉRIA DA PRIMEIRA DOBRA (achado 9 da r12). Desenha a afirmação da
// LUPA: o mesmo numerador dentro de dois denominadores diferentes dá dois
// números diferentes. As áreas são ESQUEMÁTICAS e declaradas como tal — não
// há proporção medida aqui, e nenhum percentual: o valor da matriz
// energética é a resposta do Ato 1 e fica velado (L2).

function DoisDenominadores() {
  const tempera: number[] = [];
  for (let x = 66; x < 590; x += 6) tempera.push(x);
  return (
    <svg
      viewBox="0 0 620 92"
      width="100%"
      role="img"
      aria-label="Esquema: um retângulo grande em têmpera representa toda a energia consumida no país; dentro dele, um retângulo menor, em papel limpo, representa só a eletricidade. As áreas não estão em escala e nenhum percentual é mostrado."
      style={{ display: 'block' }}
    >
      <title>Dois denominadores: toda a energia, e só a eletricidade</title>
      {tempera.map((x) => (
        <line key={x} x1={x} y1={20} x2={x} y2={64} stroke={A.tintaSuave} strokeWidth={0.7} />
      ))}
      <rect x={62} y={34} width={188} height={30} fill={A2.cremeSuperficie} />
      <rect x={62} y={34} width={188} height={30} fill="none" stroke={A.tintaSobreCreme} strokeWidth={2.2} />
      <text x={74} y={53} fill={A.tintaSobreCreme} style={{ fontFamily: AF.display, fontSize: '12px', fontWeight: 600, letterSpacing: '0.09em' }}>
        SÓ A ELETRICIDADE
      </text>
      <rect x={62} y={20} width={530} height={44} fill="none" stroke={A.tintaSobreCreme} strokeWidth={2.4} />
      <text x={62} y={13} fill={A.tintaSobreCreme} style={{ fontFamily: AF.display, fontSize: '12px', fontWeight: 600, letterSpacing: '0.09em' }}>
        TODA A ENERGIA CONSUMIDA NO PAÍS
      </text>
      <text x={592} y={13} textAnchor="end" fill={A.tintaSuave} style={{ fontFamily: AF.display, fontSize: '12px', fontWeight: 600, letterSpacing: '0.09em' }}>
        O DENOMINADOR MAIOR
      </text>
      <text x={62} y={84} fill={A.tintaSuave} style={{ fontFamily: AF.corpo, fontSize: '13px', fontStyle: 'italic' }}>
        diesel, aviação, calor industrial, gás — e a eletricidade
      </text>
      <text x={592} y={84} textAnchor="end" fill={A.tintaSuave} style={{ fontFamily: AF.corpo, fontSize: '13px', fontStyle: 'italic' }}>
        áreas fora de escala
      </text>
    </svg>
  );
}

// ── Cartão-número do par (C-LUPA) ────────────────────────────

function CartaoNumero({
  eyebrow,
  numero,
  corpo,
  fonte,
  movel,
}: {
  eyebrow: string;
  numero: string | null;
  corpo: string;
  fonte: string;
  movel: boolean;
}) {
  return (
    <div style={{ padding: movel ? '14px 0' : '14px 18px' }}>
      <span style={{ ...aparato, display: 'block' }}>{eyebrow}</span>
      <div style={{ fontFamily: AF.corpo, fontWeight: 500, fontSize: movel ? '38px' : '56px', lineHeight: 1.05, marginTop: '4px', minHeight: movel ? '42px' : '59px', fontVariantNumeric: 'tabular-nums' }}>
        {numero ? (
          <>
            {numero}
            <span style={{ fontSize: '0.5em', marginLeft: '2px', color: A.tintaSuave }}>%</span>
          </>
        ) : (
          <Velado>depois da estimativa</Velado>
        )}
      </div>
      <p style={{ fontFamily: AF.corpo, fontSize: '14.5px', lineHeight: 1.5, margin: '6px 0 0', color: numero ? A.tintaSobreCreme : A.tintaSuave }}>{corpo}</p>
      <div style={{ ...AT2.metadado, fontSize: '12.5px', color: A.tintaSuave, marginTop: '6px', borderTop: `1px solid ${A2.fioClaroSobreCreme}`, paddingTop: '5px' }}>
        <span style={{ ...aparatoForte, fontSize: '11px', marginRight: '6px' }}>Fonte</span>
        {fonte}
      </div>
    </div>
  );
}

// ── V-PARTES · o mosaico ─────────────────────────────────────

function Mosaico({
  peso,
  eletrica,
  fora,
  agregada,
  faixa,
  revelado,
}: {
  peso: number;
  eletrica: number;
  fora: number;
  agregada: number;
  faixa: { de: number; ate: number; rotulo: string } | null;
  revelado: boolean;
}) {
  const x0 = 60;
  const y0 = 20;
  const W = 440;
  const H = 340;
  const xCorte = x0 + (peso / 100) * W;
  const yDe = (v: number) => y0 + ((100 - v) / 100) * H;

  return (
    <svg
      viewBox="0 0 520 420"
      role="img"
      aria-label={`Quadrado de 100 por 100 dividido em duas colunas: eletricidade, com ${n0(peso)} por cento de largura, e o resto da energia. ${
        revelado
          ? `As alturas renováveis são ${n1(eletrica)} e ${n1(fora)} por cento, e a área agregada é ${n1(agregada)} por cento.`
          : 'As alturas renováveis aparecem depois da estimativa.'
      }`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        <pattern id="hachura-mosaico" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M-2 2l4-4M0 8l8-8M6 10l4-4" stroke={A2.fioClaroSobreCreme} strokeWidth="1" />
        </pattern>
        <pattern id="hachura-faixa" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 6l6-6" stroke={A.tintaSuave} strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect x={x0} y={y0} width={W} height={H} fill="url(#hachura-mosaico)" stroke={A.tintaSobreCreme} strokeWidth="1.5" />
      <line x1={xCorte} y1={y0} x2={xCorte} y2={y0 + H} stroke={A.tintaSobreCreme} strokeWidth="1.5" />
      <text x={(x0 + xCorte) / 2} y={y0 + H + 20} textAnchor="middle" fontSize="13" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
        eletricidade
      </text>
      <text x={(x0 + xCorte) / 2} y={y0 + H + 36} textAnchor="middle" fontSize="13" fontWeight="600" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
        {n0(peso)}%
      </text>
      <text x={(xCorte + x0 + W) / 2} y={y0 + H + 20} textAnchor="middle" fontSize="13" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
        diesel, aviação, gás, calor e coque
      </text>
      <text x={(xCorte + x0 + W) / 2} y={y0 + H + 36} textAnchor="middle" fontSize="13" fontWeight="600" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
        {n0(100 - peso)}%
      </text>
      <text x={x0 - 8} y={y0 + 5} textAnchor="end" fontSize="12" fill={A.tintaSuave} fontFamily={AF.corpo}>
        100%
      </text>
      <text x={x0 - 8} y={y0 + H + 4} textAnchor="end" fontSize="12" fill={A.tintaSuave} fontFamily={AF.corpo}>
        0
      </text>
      <text x={x0 + W / 2} y={414} textAnchor="middle" fontSize="12" fill={A.tintaSuave} fontFamily={AF.corpo}>
        peso na energia total →
      </text>

      {!revelado ? (
        <>
          <text x={x0 + W / 2} y={y0 + H / 2 - 6} textAnchor="middle" fontSize="13.5" fontStyle="italic" fill={A.tintaSuave} fontFamily={AF.corpo}>
            As partes renováveis aparecem
          </text>
          <text x={x0 + W / 2} y={y0 + H / 2 + 14} textAnchor="middle" fontSize="13.5" fontStyle="italic" fill={A.tintaSuave} fontFamily={AF.corpo}>
            depois da sua estimativa.
          </text>
        </>
      ) : (
        <>
          <rect x={x0 + 0.75} y={yDe(eletrica)} width={Math.max(0, xCorte - x0 - 1.5)} height={y0 + H - yDe(eletrica)} fill={A.navy} />
          <rect x={xCorte + 0.75} y={yDe(fora)} width={Math.max(0, x0 + W - xCorte - 1.5)} height={y0 + H - yDe(fora)} fill={A.navy} />
          {xCorte - x0 > 40 && (
            <text x={(x0 + xCorte) / 2} y={yDe(eletrica) + 22} textAnchor="middle" fontSize="14" fontWeight="600" fill={A.tintaSobreNavy} fontFamily={AF.corpo}>
              {n1(eletrica)}%
            </text>
          )}
          {x0 + W - xCorte > 40 && (
            <text x={(xCorte + x0 + W) / 2} y={yDe(fora) + 22} textAnchor="middle" fontSize="14" fontWeight="600" fill={A.tintaSobreNavy} fontFamily={AF.corpo}>
              {n1(fora)}%
            </text>
          )}
          <line x1={x0} y1={yDe(agregada)} x2={x0 + W} y2={yDe(agregada)} stroke={A.tintaSobreCreme} strokeWidth="1.4" strokeDasharray="3 3" />
          <text x={x0 + W - 4} y={yDe(agregada) - 6} textAnchor="end" fontSize="13" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
            se fosse uniforme: <tspan fontWeight="600">{n1(agregada)}%</tspan> (área sombreada)
          </text>
          {faixa && (
            <>
              <rect x={x0} y={yDe(faixa.ate)} width={W} height={Math.max(0, yDe(faixa.de) - yDe(faixa.ate))} fill="url(#hachura-faixa)" opacity="0.6" />
              <line x1={x0} y1={yDe(faixa.ate)} x2={x0 + W} y2={yDe(faixa.ate)} stroke={A.tintaSobreCreme} strokeWidth="1.6" strokeDasharray="8 5" />
              <line x1={x0} y1={yDe(faixa.de)} x2={x0 + W} y2={yDe(faixa.de)} stroke={A.tintaSobreCreme} strokeWidth="1.6" strokeDasharray="8 5" />
              <text x={x0 + 6} y={yDe(faixa.ate) - 6} fontSize="13" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
                sua faixa · {faixa.rotulo}
              </text>
            </>
          )}
        </>
      )}
    </svg>
  );
}

// ── V-SER pequena · duas fontes ──────────────────────────────

function DuasFontes() {
  return (
    <div>
      <ul style={{ listStyle: 'none', margin: '4px 0 8px', padding: 0, ...AT2.metadado, fontSize: '13px', color: A.tintaSuave }}>
        <li style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2px' }}>
          <i aria-hidden="true" style={{ display: 'inline-block', width: '22px', flex: 'none', borderTop: `3px solid ${A.navy}` }} />
          <span>
            <b style={{ color: A.tintaSobreCreme, fontWeight: 600 }}>EPE</b> · fronteira: oferta interna de energia
            elétrica, com importação
          </span>
        </li>
        <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <i aria-hidden="true" style={{ display: 'inline-block', width: '22px', flex: 'none', borderTop: `2px solid ${A2.tintaMetadado}` }} />
          <span>
            <b style={{ color: A.tintaSobreCreme, fontWeight: 600 }}>Instituto internacional</b> · fronteira: geração
          </span>
        </li>
      </ul>
      <svg
        viewBox="0 0 440 240"
        role="img"
        aria-label="EPE, oferta interna com importação: 88,2 em 2024 e 86,8 em 2025. Instituto internacional, geração: 89 em 2023, 87 em 2024 e 87 em 2025."
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <line x1="44" y1="200" x2="420" y2="200" stroke={A.tintaSobreCreme} />
        <text x="80" y="220" textAnchor="middle" fontSize="12.5" fill={A.tintaSuave} fontFamily={AF.corpo}>
          2023
        </text>
        <text x="230" y="220" textAnchor="middle" fontSize="12.5" fill={A.tintaSuave} fontFamily={AF.corpo}>
          2024
        </text>
        <text x="380" y="220" textAnchor="middle" fontSize="12.5" fill={A.tintaSuave} fontFamily={AF.corpo}>
          2025
        </text>
        <line x1="44" y1="30" x2="420" y2="30" stroke={A2.fioClaroSobreCreme} />
        <text x="38" y="34" textAnchor="end" fontSize="12" fill={A.tintaSuave} fontFamily={AF.corpo}>
          90
        </text>
        <line x1="44" y1="115" x2="420" y2="115" stroke={A2.fioClaroSobreCreme} />
        <text x="38" y="119" textAnchor="end" fontSize="12" fill={A.tintaSuave} fontFamily={AF.corpo}>
          87,5
        </text>
        <text x="38" y="204" textAnchor="end" fontSize="12" fill={A.tintaSuave} fontFamily={AF.corpo}>
          85
        </text>
        <polyline points="80,64 230,132 380,132" fill="none" stroke={A2.tintaMetadado} strokeWidth="2" />
        <circle cx="80" cy="64" r="4" fill={A2.tintaMetadado} />
        <circle cx="230" cy="132" r="4" fill={A2.tintaMetadado} />
        <circle cx="380" cy="132" r="4" fill={A2.tintaMetadado} />
        <text x="80" y="54" textAnchor="middle" fontSize="12.5" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
          89
        </text>
        <text x="230" y="154" textAnchor="middle" fontSize="12.5" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
          87
        </text>
        <text x="380" y="120" textAnchor="middle" fontSize="12.5" fill={A.tintaSobreCreme} fontFamily={AF.corpo}>
          87
        </text>
        <polyline points="230,91.2 380,138.8" fill="none" stroke={A.navy} strokeWidth="3" />
        <circle cx="230" cy="91.2" r="5" fill={A.navy} />
        <circle cx="380" cy="138.8" r="5" fill={A.navy} />
        <text x="230" y="80.2" textAnchor="middle" fontSize="12.5" fontWeight="600" fill={A.navy} fontFamily={AF.corpo}>
          88,2
        </text>
        <text x="380" y="160.8" textAnchor="middle" fontSize="12.5" fontWeight="600" fill={A.navy} fontFamily={AF.corpo}>
          86,8
        </text>
      </svg>
    </div>
  );
}
