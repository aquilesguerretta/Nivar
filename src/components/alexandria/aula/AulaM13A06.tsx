// M13·A06 — "Riscos, e o crédito que o currículo não nomeia" · arquétipo MESA.
//
// É a captura obrigatória do bar §4: "uma aula de M13 — sem instrumento nem
// exercício portado". O ato, então, é da camada Alexandria, DERIVADO das
// células da matriz da fonte (`extraction/m13/instrumentos.json`,
// `m13-inst-09`), nunca inventado. Prova o C9 no caso mais difícil.
//
// Porte de `prototipos/_src/mesa-m13-a06.tpl` + `gen_mesa.py`, com as
// correções de CORRECOES.md:
//   L3 · a BANDEJA vem ANTES da matriz. No estado inicial só a linha-exemplo
//        (Regulatório) está aberta; as outras sete mostram a categoria e a
//        posição na lista do currículo, com as células veladas — as células
//        "como se manifesta" entregavam a bandeja.
//   L4 · P23. O título da fonte fala em "seis categorias, e a sexta", e a
//        matriz do próprio módulo tem OITO linhas. A Alexandria nomeia a
//        categoria em vez de numerá-la, e mostra a contagem reconstruível
//        (5 + 1 + 2 = 8). O título literal fica na ficha de fonte.
//   L5 · as seções 06.2 a 06.4 ganharam ato próprio (ler o instituto,
//        afirmar hoje, o que pedir antes de assinar), porque corriam ~2.800px
//        sem ato nenhum.
//
// Nenhuma linha da matriz é clampada: linha fechada mostra a categoria e o
// véu; linha aberta mostra a célula inteira, no lugar, sem modal e sem aba.

import { useState } from 'react';
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
  Comparacao,
  CreditosDaRota,
  Escolhas,
  Fila,
  Fonte,
  ImagemDaAula,
  LoopDaAulaProvider,
  MEDIDA_PALCO,
  MiniRota,
  Nota,
  P,
  PranchaDeEntrada,
  Palco,
  ParesDaFicha,
  Praticado,
  ProximoPasso,
  Recuperacao,
  RegistroDaAula,
  Secao,
  Selo,
  Velado,
  Voz,
  aparato,
  aparatoForte,
  useLoop,
  type AssetDaAula,
} from './tronco';

// ── A matriz do INST·09, verbatim da extração ────────────────

interface LinhaDaMatriz {
  k: string;
  n: string;
  emp: string;
  prj: string;
  mit: string;
  alr: string;
  /** Na lista de cinco riscos que o lide do curso enumera. */
  naLista: boolean;
  /** A categoria que a aula nomeia porque o currículo omite. */
  aQueAAulaNomeia?: boolean;
}

const MATRIZ: LinhaDaMatriz[] = [
  {
    k: 'hid',
    n: 'Hidrológico',
    naLista: true,
    emp: 'Manifesta-se como variação de resultado: geração abaixo da garantia física obriga a companhia a comprar energia no mercado de curto prazo para honrar contratos, com custo que não estava no orçamento. Numa geradora diversificada por fonte e por bacia, é volatilidade; numa concentrada, é a variável dominante.',
    prj: 'Manifesta-se como gatilho contratual: geração abaixo do percentil adverso usado no dimensionamento da dívida derruba o caixa disponível abaixo da cobertura mínima, aciona bloqueio de distribuição e pode caracterizar inadimplemento técnico antes de qualquer problema operacional real.',
    mit: 'Diversificação de fontes e de bacias; desenho contratual que aloque o risco de forma explícita; sazonalização; e dimensionamento da dívida em percentil adverso de geração, não no cenário central.',
    alr: 'Geração acumulada abaixo da garantia física por dois trimestres consecutivos; elevação do custo de compra de energia para revenda na demonstração de resultado.',
  },
  {
    k: 'reg',
    n: 'Regulatório',
    naLista: true,
    emp: 'Mudança de parâmetro tarifário, de encargo setorial ou de metodologia altera a receita reconhecida sem que nada tenha mudado na operação. Em distribuição, o ciclo de revisão é o evento; entre revisões, o risco é de mudança normativa geral.',
    prj: 'Alteração de condição de outorga, de regra de acesso ou de encargo muda a receita do projeto durante a vida da dívida. O credor exige, tipicamente, cláusula de reequilíbrio ou alocação explícita do risco entre patrocinador e projeto.',
    mit: 'Acompanhamento de consultas públicas e da agenda regulatória; cláusulas contratuais de reequilíbrio; modelagem por cenário regulatório em vez de premissa única.',
    alr: 'Abertura de consulta pública sobre parâmetro relevante; nota técnica preliminar do regulador divergente da metodologia vigente.',
  },
  {
    k: 'cam',
    n: 'Cambial',
    naLista: true,
    emp: 'Atinge o custo de equipamento importado, o serviço da dívida em moeda estrangeira e, em algumas cadeias, o preço do insumo. Em companhia com receita integralmente doméstica, é descasamento puro: não há receita na mesma moeda para compensar.',
    prj: 'Concentra-se na fase de construção, quando o investimento importado é contratado, e no serviço de dívida externa, se houver. Em projeto com receita em moeda local, a proteção cambial é custo, não escolha.',
    mit: 'Proteção contratada com prazo compatível com a exposição; contingência orçamentária em moeda; e, quando existir, receita denominada na mesma moeda da dívida.',
    alr: 'Exposição líquida crescente com proteção de prazo mais curto que a dívida; renovação sucessiva de instrumentos de proteção a custo crescente.',
  },
  {
    k: 'idx',
    n: 'Descasamento de indexador',
    naLista: true,
    emp: 'Receita atrelada a um índice e dívida atrelada a outro produzem resultado que oscila sem que operação ou mercado tenham mudado. Uma dívida majoritariamente indexada a índice de preços pode ser proteção natural se a receita seguir o mesmo índice — e descasamento se seguir outro.',
    prj: 'Mais severo em projeto que em empresa, porque não há diversificação de contratos para compensar. Se a receita é fixa em termos nominais e a dívida é indexada, a cobertura se deteriora com a inflação de forma previsível e inevitável.',
    mit: 'Casamento de indexadores entre receita e dívida; instrumentos de troca de indexador; conta-reserva dimensionada para absorver descasamento temporário.',
    alr: 'Divergência acumulada entre o índice da receita e o da dívida acima de alguns pontos percentuais em doze meses.',
  },
  {
    k: 'ope',
    n: 'Operacional',
    naLista: true,
    emp: 'Indisponibilidade de ativo, acidente, falha de equipamento e — em distribuição — perda não técnica de energia. Esta última é um risco de crédito disfarçado de risco operacional: energia distribuída e não faturada tem o mesmo efeito financeiro que inadimplência.',
    prj: 'Desempenho abaixo do contratado durante a operação, cobertura por contrato de operação e manutenção, e disponibilidade como parâmetro contratual com penalidade associada.',
    mit: 'Contrato de operação e manutenção com penalidade; seguro operacional com franquia e exclusões verificadas; reserva de manutenção; plano de manutenção compatível com a vida dos equipamentos.',
    alr: 'Elevação do indicador de indisponibilidade forçada; perda não técnica acima do nível regulatório reconhecido; postergação de manutenção programada.',
  },
  {
    k: 'cons',
    n: 'Construção',
    naLista: false,
    emp: 'Custo acima do orçado e atraso na entrada em operação de projetos em carteira, com efeito sobre o retorno do investimento e sobre a data em que a receita começa.',
    prj: 'É o risco dominante da fase pré-operacional. Atraso significa juros durante a construção acima do orçado e receita adiada, com o serviço da dívida começando conforme cronograma contratual — a combinação que consome contingência mais rápido.',
    mit: 'Contrato de construção integral com multa por atraso e desempenho; garantia de conclusão do patrocinador; contingência orçamentária real; e cronograma de desembolso vinculado a medição física.',
    alr: 'Desvio acumulado no cronograma crítico; reivindicações contratuais do construtor; consumo de contingência acima do proporcional ao avanço físico.',
  },
  {
    k: 'mer',
    n: 'Mercado e recontratação',
    naLista: false,
    emp: 'Preço, volume e risco de contraparte. A variável estrutural é a proporção de energia contratada contra a exposta a preço de curto prazo, e o preço a que os contratos que vencem serão renovados.',
    prj: 'Cauda de exposição a preço após o vencimento dos contratos que sustentaram a dívida. Se a dívida for mais longa que os contratos, o projeto passa a depender do mercado exatamente quando ainda deve.',
    mit: 'Contratos de longo prazo casados com o prazo da dívida; limites de exposição; diversificação de contrapartes; e avaliação de crédito da contraparte, não apenas do preço.',
    alr: 'Concentração de vencimentos contratuais num único ano; deterioração de crédito de contraparte relevante; elevação da parcela exposta a preço de curto prazo.',
  },
  {
    k: 'cred',
    n: 'Crédito e estrutura de capital',
    naLista: false,
    aQueAAulaNomeia: true,
    // P23: a fonte escreve "A sexta categoria, ausente do currículo…". A
    // numeração não fecha com as oito linhas do próprio aparato, então a
    // Alexandria NOMEIA em vez de numerar. Título literal na ficha.
    emp: 'A categoria ausente do currículo e dominante no setor em 2026. Não é a probabilidade de a empresa ir mal: é a de não honrar obrigações no vencimento, o que pode ocorrer com companhia operacionalmente sólida se o desenho da dívida colidir com a geração de caixa.',
    prj: 'Concentra-se no risco de refinanciamento de saldo residual e na dependência de aporte do patrocinador. Numa estrutura com dois patrocinadores que precisam concordar, o risco não é a capacidade de aportar — é a convergência entre eles.',
    mit: 'Alongamento de prazo antes da necessidade; diversificação de fontes de financiamento; manutenção de linhas comprometidas; e, no desenho societário, definição prévia de como o aporte de emergência é decidido.',
    alr: 'Alongamento sucessivo a custo crescente; dispensa formal de covenant divulgada; concentração de vencimento sem plano declarado; contratação de assessor financeiro para reestruturação.',
  },
];

const SINAIS = [
  {
    id: 's1',
    frase: 'Dispensa formal de covenant divulgada.',
    referencia: 'cred',
  },
  {
    id: 's2',
    frase: 'Divergência acumulada entre o índice da receita e o da dívida acima de alguns pontos percentuais em doze meses.',
    referencia: 'idx',
  },
  {
    id: 's3',
    frase: 'Concentração de vencimentos contratuais num único ano.',
    referencia: 'mer',
  },
];

const ROCINHA: AssetDaAula = {
  base: 'm13-a06-01-rocinha-ligacoes-2008',
  slots: [560, 1000],
  largura: 1000,
  altura: 680,
  classe: 'documental',
  alt: 'Poste de concreto numa viela entre casas de alvenaria, envolto por um emaranhado de dezenas de fios pretos que seguem em todas as direções até as casas.',
  legenda:
    'Poste de distribuição tomado por fios numa viela da Rocinha, Rio de Janeiro, em março de 2008, descrito pela autora da foto como ligação elétrica irregular. A energia desviada assim, sem medição, aparece como perda não técnica no indicador operacional e como caixa que não entra no financeiro.',
  credito: 'Foto: Alicia Nijdam / Wikimedia Commons (via Flickr) · CC BY 2.0 · recortada · a foto não é da distribuidora do caso',
};

const RJ_RE: [string, string, string][] = [
  [
    'Como começa',
    'Pedido em juízo, com deferimento e suspensão de execuções por prazo determinado',
    'Negociação prévia com credores; o plano chega ao juízo já com adesão relevante',
  ],
  [
    'Quem participa',
    'Todas as classes de credores sujeitas, com assembleia geral',
    'Apenas as espécies de crédito abrangidas pelo plano, definidas pelo próprio plano',
  ],
  [
    'Quórum',
    'Aprovação por classe em assembleia',
    'Adesão mínima legal, sem assembleia; a homologação estende as condições aos não aderentes',
  ],
  [
    'Velocidade típica',
    'Meses a anos, com fase de habilitação de créditos',
    'Mais rápida, porque a negociação já ocorreu antes do protocolo',
  ],
  [
    'Efeito sobre operação',
    'Estigma comercial relevante; fornecedores encurtam prazo',
    'Menos disruptivo, porque o processo é anunciado já com acordo',
  ],
  ['Caso no rol', 'A distribuidora do Rio de Janeiro, desde 2023', 'A associação de bioenergia e combustíveis, em 2026'],
];

const CRONOLOGIA = [
  {
    quando: 'Mai 2023',
    titulo: 'Pedido de recuperação judicial',
    texto:
      'Dívida da ordem de R$ 11 bilhões, agravada por furto de energia e inadimplência em áreas de ocupação irregular. Concessão de distribuição com vencimento previsto para 2026 — ou seja, o horizonte contratual do ativo era curto no momento da crise.',
    tipo: 'marco' as const,
  },
  {
    quando: 'Mai–Jun 2024',
    titulo: 'Plano aprovado e homologado',
    texto:
      'Aprovação em assembleia de credores em 29 de maio de 2024, com 99,41% de votos favoráveis, e homologação judicial em 18 de junho de 2024. Parte da dívida convertida em ações; novas condições de pagamento.',
    tipo: 'marco' as const,
  },
  {
    quando: 'Dez 2025',
    titulo: 'Sinal do regulador',
    texto:
      'A diretoria da agência recomendou ao ministério a prorrogação da concessão de distribuição por mais trinta anos — decisão que altera o horizonte de qualquer modelo de valuation do ativo, de meses para décadas.',
    tipo: 'marco' as const,
  },
  {
    quando: 'Jul 2026',
    titulo: 'Última obrigação cumprida',
    texto:
      'Aumento de capital de R$ 1,5 bilhão homologado — acima do mínimo de R$ 1 bilhão exigido pelo plano —, com 238.473.768 novas ações a R$ 6,29 e emissão de 476,9 milhões de bônus de subscrição. Pedido formal de encerramento protocolado na 3ª Vara Empresarial da comarca da capital do Rio de Janeiro.',
    tipo: 'marco' as const,
  },
  {
    quando: '02·08·2026',
    titulo: 'Estado verificado',
    texto:
      'A decisão judicial sobre o encerramento formal ainda estava pendente na data de verificação deste módulo. Cumprir as obrigações do plano e ter a recuperação judicial encerrada são estados diferentes, e a distância entre eles é uma sentença.',
    tipo: 'verificado' as const,
  },
  {
    quando: '17·09·2026 · hoje',
    titulo: '46 dias depois da verificação',
    texto: '',
    tipo: 'hoje' as const,
  },
];

// ── Prancha de entrada · a lista e a lacuna ──────────────────
//
// A MATÉRIA DA PRIMEIRA DOBRA (achado 9 da r12). Desenha a afirmação da
// aula: a lista do currículo está certa e está incompleta. Cinco hastes
// cravadas (o que a fonte lista) e três vazadas (o que a matriz desta aula
// acrescenta). NENHUMA é nomeada — nomear as categorias aqui entregaria
// metade do Ato 1, e a matriz inteira só abre no registro (L2, L3).

function ListaELacuna() {
  const tempera: number[] = [];
  for (let x = 66; x < 590; x += 6) tempera.push(x);
  const hastes = MATRIZ.map((l, i) => ({ naLista: l.naLista, x: 96 + i * 62 }));
  return (
    <svg
      viewBox="0 0 620 92"
      width="100%"
      role="img"
      aria-label="Esquema: oito hastes sobre uma base graduada. As cinco primeiras estão cravadas em tinta cheia e representam as categorias que o currículo lista; as três últimas estão vazadas e representam as que esta aula acrescenta. Nenhuma categoria é nomeada."
      style={{ display: 'block' }}
    >
      <title>A lista do currículo e o que falta nela</title>
      {tempera.map((x) => (
        <line key={x} x1={x} y1={62} x2={x} y2={72} stroke={A.tintaSuave} strokeWidth={0.7} />
      ))}
      {hastes.map((h) => (
        <g key={h.x}>
          <line
            x1={h.x}
            y1={h.naLista ? 22 : 38}
            x2={h.x}
            y2={62}
            stroke={A.tintaSobreCreme}
            strokeWidth={h.naLista ? 2.6 : 1.1}
            strokeDasharray={h.naLista ? undefined : '5 4'}
          />
          {h.naLista ? (
            <path d={`M${h.x} 14 L${h.x + 7} 22 L${h.x} 30 L${h.x - 7} 22 Z`} fill={A.tintaSobreCreme} />
          ) : (
            <path d={`M${h.x} 30 L${h.x + 7} 38 L${h.x} 46 L${h.x - 7} 38 Z`} fill="none" stroke={A.tintaSobreCreme} strokeWidth={1.2} />
          )}
        </g>
      ))}
      <line x1={62} y1={62} x2={592} y2={62} stroke={A.tintaSobreCreme} strokeWidth={2.4} />
      <text x={62} y={88} fill={A.tintaSobreCreme} style={{ fontFamily: AF.display, fontSize: '12px', fontWeight: 600, letterSpacing: '0.09em' }}>
        CINCO QUE O CURRÍCULO LISTA
      </text>
      <text x={592} y={88} textAnchor="end" fill={A.tintaSuave} style={{ fontFamily: AF.display, fontSize: '12px', fontWeight: 600, letterSpacing: '0.09em' }}>
        TRÊS QUE ESTA AULA ACRESCENTA
      </text>
    </svg>
  );
}

// ── A aula ───────────────────────────────────────────────────

export function AulaM13A06(props: PropsDaAula) {
  return (
    <LoopDaAulaProvider total={5} visitante={props.visitante}>
      <Corpo {...props} />
    </LoopDaAulaProvider>
  );
}

function Corpo({ numero, totalAulas, percorridas, navegar, rotaDaAula, rotaDoModulo }: PropsDaAula) {
  // Uma coluna abaixo de 1100 (ver AulaM01A08).
  const movel = useLargura() !== 'largo';
  const loop = useLoop();

  const [categoria, setCategoria] = useState<string | null>(null);
  const [lente, setLente] = useState<string | null>(null);
  const reg1 = loop.registroDe('classificar');

  const [bandeja, setBandeja] = useState<Record<string, string>>({});
  const reg2 = loop.registroDe('bandeja');
  const matrizAberta = Boolean(reg2);

  const [abertas, setAbertas] = useState<string[]>(['reg']);
  const alvos = new Set(['hid', 'cred', 'idx', 'mer']);

  const [instituto, setInstituto] = useState<string | null>(null);
  const reg3 = loop.registroDe('instituto');
  const [frase, setFrase] = useState<string | null>(null);
  const reg4 = loop.registroDe('hoje');
  const [documentos, setDocumentos] = useState<string[]>([]);
  const reg5 = loop.registroDe('documentos');

  const visivel = (k: string) => matrizAberta || k === 'reg';
  const aberta = (k: string) => abertas.includes(k) && visivel(k);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Abertura
        movel={movel}
        eyebrow={movel ? 'M13 · Aula 06 de 08' : 'M13 · Análise Financeira de Empresas e Projetos · Aula 06 de 08'}
        titulo="Riscos, e o crédito que o currículo não nomeia"
        subtitulo="Riscos"
        vozPergunta={<Voz rotulo="Pergunta da aula" fonte="Alexandria" />}
        pergunta="Uma companhia com operação sólida pode deixar de pagar suas dívidas? Onde esse risco aparece antes de acontecer?"
        objetivo="Reconhecer o indicador de alerta de cada categoria de risco, dizer como o mesmo risco chega ao caixa numa empresa e num projeto, e avaliar uma contraparte de contrato longo também pelo crédito."
        lede="O currículo lista cinco riscos específicos do setor: hidrológico, regulatório, cambial, de descasamento de indexador e operacional, mais a dimensão socioambiental e de governança. A lista está certa e está incompleta para 2026, porque omite exatamente a categoria que dominou o setor entre outubro de 2025 e julho de 2026 — risco de crédito e de estrutura de capital."
        materia={
          <PranchaDeEntrada
            titulo="A lista do currículo está certa — e está incompleta."
            nota="Cinco cravadas, três vazadas. Quais são, e de que sinal cada uma é o alerta, abre nos atos."
          >
            <ListaELacuna />
          </PranchaDeEntrada>
        }
        ladoDireito={
          <>
            <Ato
              id="classificar"
              ordem={1}
              genero="classificar"
              movel={movel}
              enunciado="Um analista vê este sinal num relatório. De que categoria de risco ele é o alerta?"
            >
              <blockquote
                style={{
                  margin: '0 0 14px',
                  paddingLeft: '14px',
                  borderLeft: `3px solid ${A.tintaSobreCreme}`,
                  fontFamily: AF.corpo,
                  fontStyle: 'italic',
                  fontSize: '17px',
                  lineHeight: 1.45,
                }}
              >
                <span style={{ display: 'block', fontStyle: 'normal', marginBottom: '4px' }}>
                  <Voz rotulo="Indicador de alerta" fonte="texto do curso" />
                </span>
                “Geração acumulada abaixo da garantia física por dois trimestres consecutivos.”
              </blockquote>
              {!reg1 ? (
                <>
                  <Escolhas
                    rotuloGrupo="Categoria de risco do sinal"
                    colunas={2}
                    valor={categoria}
                    aoEscolher={setCategoria}
                    opcoes={MATRIZ.map((l, i) => ({ id: l.k, rotulo: l.n, captura: `ato-opcao-${i + 1}` }))}
                  />
                  {/* Uma pergunta por vez: a segunda só abre depois da
                      categoria. A 390 isso sobe o botão do 1º ato em ~230px
                      (medido), e a 1440 não muda nada de importante. */}
                  {categoria && (
                    <>
                      <span style={{ ...aparatoForte, fontSize: '11px', display: 'block', margin: '6px 0 2px' }}>
                        Numa sociedade de projeto, esse sinal tende a virar
                      </span>
                      <Escolhas
                        rotuloGrupo="O que o sinal vira numa sociedade de projeto"
                        colunas={movel ? 1 : 3}
                        valor={lente}
                        aoEscolher={setLente}
                        opcoes={[
                          { id: 'var', rotulo: 'variação de resultado', captura: 'lente-opcao-1' },
                          { id: 'gat', rotulo: 'gatilho contratual', captura: 'lente-opcao-2' },
                          { id: 'nc', rotulo: 'não é possível concluir', captura: 'lente-opcao-3' },
                        ]}
                      />
                    </>
                  )}
                  <AcaoDeRegistro
                    movel={movel}
                    rotulo="Registrar classificação"
                    objeto="categoria de risco"
                    captura="ato-registrar"
                    pronto={Boolean(categoria)}
                    oQueFalta="Escolha a categoria de risco antes de registrar."
                    aoClicar={() =>
                      categoria &&
                      loop.registrar('classificar', {
                        resumo: `${MATRIZ.find((l) => l.k === categoria)?.n} · ${
                          lente === 'gat' ? 'gatilho contratual' : lente === 'var' ? 'variação de resultado' : lente === 'nc' ? 'não é possível concluir' : 'lente não respondida'
                        }`,
                        atende: categoria === 'hid' && lente === 'gat' ? 'atende' : 'atende em parte',
                      })
                    }
                  />
                  <AvisoDeVisitante />
                </>
              ) : (
                <>
                  <p style={{ ...AT2.metadado, color: A.tintaSobreCreme, margin: '0 0 8px' }}>
                    Registrado: {reg1.resumo}.
                  </p>
                  <AcaoSecundaria href="#inst09">A matriz abaixo mostra a célula de referência</AcaoSecundaria>
                </>
              )}
            </Ato>

            <MiniRota codigoModulo="M13" total={totalAulas} atual={numero} percorridas={percorridas} movel={movel} rota={rotaDaAula} />

            <Recuperacao
              movel={movel}
              origem="M13·A05"
              pergunta="No cenário-padrão da régua de cobertura, com choque de 10% no caixa disponível, o projeto:"
            >
              <Escolhas
                rotuloGrupo="O que acontece com o projeto"
                colunas={1}
                valor={null}
                aoEscolher={() => undefined}
                opcoes={[
                  { id: 'a', rotulo: 'continua distribuindo dividendos' },
                  { id: 'b', rotulo: 'continua adimplente, mas bloqueia dividendos' },
                  { id: 'c', rotulo: 'entra em inadimplemento técnico' },
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
              O currículo lista cinco riscos específicos do setor. A lista está certa e está incompleta para 2026,
              porque omite exatamente a categoria que dominou o setor entre outubro de 2025 e julho de 2026 — risco de
              crédito e de estrutura de capital.
            </P>
          )}
          <Secao n="06.1">A matriz, com o mesmo risco visto de dois lugares</Secao>
          <Nota titulo="Como contar as categorias · Alexandria">
            <ol style={{ listStyle: 'none', margin: '4px 0 8px', padding: 0, display: 'grid', gap: '6px' }}>
              {[
                ['5', 'riscos que o currículo lista: hidrológico, regulatório, cambial, descasamento de indexador, operacional', '(mais a dimensão socioambiental e de governança, que o lide cita à parte)'],
                ['+1', 'a categoria que a aula nomeia porque o currículo omite: crédito e estrutura de capital', ''],
                ['+2', 'que a matriz do INST·09 acrescenta sem discuti-las no texto: construção; mercado e recontratação', ''],
                ['= 8', 'linhas da matriz abaixo', ''],
              ].map(([n, t, s], i) => (
                <li
                  key={n}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '46px minmax(0, 1fr)',
                    gap: '10px',
                    alignItems: 'baseline',
                    fontFamily: AF.corpo,
                    fontSize: '15px',
                    lineHeight: 1.45,
                    ...(i === 3 ? { borderTop: `1px solid ${A.tintaSobreCreme}`, paddingTop: '5px', marginTop: '2px' } : null),
                  }}
                >
                  <b style={{ fontWeight: 600, fontSize: '17px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{n}</b>
                  <span>
                    {t} {s && <small style={{ color: A2.tintaMetadado, fontSize: '13px' }}>{s}</small>}
                  </span>
                </li>
              ))}
            </ol>
            <p style={{ ...AT2.metadado, color: A.tintaSuave, margin: 0 }}>
              O título da fonte fala em “seis categorias, e a sexta…”, contando os cinco do currículo mais o crédito.
              Como a matriz do próprio módulo tem oito, a Alexandria nomeia a categoria em vez de numerá-la. O título
              literal está na ficha.
            </p>
            <Fonte
              resumo={<>Título, lide e matriz: Módulo 13, Aula 06 (texto do curso). Contagem e rótulo: camada Alexandria.</>}
              ficha={
                <ParesDaFicha
                  pares={[
                    ['Título na fonte', '“Seis categorias de risco, e a sexta é a que o currículo não nomeia”'],
                    ['Subseção 06.2 na fonte', '“A sexta categoria: o caso da reestruturação de dívida”'],
                    ['Divergência', 'oito linhas no INST·09 · registrada no registro de proveniência'],
                  ]}
                />
              }
            />
          </Nota>
          <P>
            Um mesmo risco se manifesta de forma diferente conforme o objeto seja uma companhia aberta ou uma sociedade
            de projeto isolada. A geração abaixo do previsto, numa geradora diversificada, é uma variação de resultado;
            na sociedade de projeto financiada com cobertura apertada, é um gatilho de bloqueio de dividendo. O
            instrumento abaixo percorre as oito categorias nas duas lentes.
          </P>
        </Fila>

        <Palco
          id="inst09"
          largo
          movel={movel}
          numero="INST·09"
          titulo="Matriz de risco em duas lentes"
          modo="classificar os sinais → abrir a matriz → comparar"
        >
          <P style={{ maxWidth: '62em', fontSize: '15.5px', margin: '0 0 16px' }}>
            Primeiro, ponha três sinais de alerta nas categorias. Depois a matriz abre: escolha uma categoria e leia
            como o risco se manifesta na lente de empresa e na lente de projeto. Cada combinação devolve o que o
            mitiga e o <b>indicador de alerta</b> — o sinal observável que aparece antes do problema. Produto
            cartesiano completo: oito riscos por duas lentes, dezesseis combinações, nenhuma vazia.
          </P>

          {/* ── Ato 2 · a bandeja, ANTES da matriz (L3) ── */}
          <div style={{ borderBottom: `1px dashed ${A.fioSobreCreme}`, paddingBottom: '18px', marginBottom: '20px' }}>
            <Ato id="bandeja" ordem={2} genero="bandeja de sinais" movel={movel} enunciado="Ponha cada sinal na categoria de que ele é o alerta.">
              <ol style={{ listStyle: 'none', margin: '4px 0 0', padding: 0 }}>
                {SINAIS.map((s, i) => {
                  const ref = MATRIZ.find((l) => l.k === s.referencia);
                  const escolhido = bandeja[s.id];
                  const igual = escolhido === s.referencia;
                  return (
                    <li
                      key={s.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: movel ? '1fr' : 'minmax(0, 1fr) 320px',
                        gap: movel ? '6px' : '18px',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
                      }}
                    >
                      <q style={{ fontFamily: AF.corpo, fontStyle: 'italic', fontSize: '15.5px', lineHeight: 1.45 }}>
                        <span style={{ fontStyle: 'normal', color: A2.tintaMetadado }}>{i + 1}. </span>
                        {s.frase}
                      </q>
                      {!reg2 ? (
                        <label style={{ display: 'block' }}>
                          <span style={{ ...aparato, fontSize: '11px', display: 'block' }}>Pôr em</span>
                          <select
                            value={escolhido ?? ''}
                            aria-label={`Categoria do sinal ${i + 1}`}
                            onChange={(e) => setBandeja((a) => ({ ...a, [s.id]: e.target.value }))}
                            style={{
                              width: '100%',
                              minHeight: '44px',
                              border: 'none',
                              borderBottom: `${escolhido ? 1.6 : 1}px solid ${escolhido ? A.tintaSobreCreme : A.fioSobreCreme}`,
                              borderRadius: AR.none,
                              background: 'transparent',
                              fontFamily: AF.corpo,
                              fontSize: '15px',
                              color: A.tintaSobreCreme,
                              padding: '4px 0',
                            }}
                          >
                            <option value="">—</option>
                            {MATRIZ.map((l) => (
                              <option key={l.k} value={l.k}>
                                {l.n}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : (
                        <span style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontFamily: AF.corpo, fontSize: '14px', lineHeight: 1.45 }}>
                          <MarcaEstacao estado={igual ? 'percorrido' : 'por-percorrer'} tamanho={13} />
                          <span>
                            você: <b>{MATRIZ.find((l) => l.k === escolhido)?.n ?? 'não respondido'}</b> · matriz:{' '}
                            <b>{ref?.n}</b> — {igual ? 'mesma categoria' : 'categoria diferente'}
                          </span>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
              {!reg2 ? (
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
                  <AcaoDeRegistro
                    movel={movel}
                    // A cartela é curta por receita (tronco): "Registrar os três
                    // sinais" pedia 264 px numa coluna de ato de 244 a 390 e
                    // sangrava 20 px. O objeto vai para fora da cartela, como
                    // nos outros seis atos da peça, e o nome acessível continua
                    // nomeando verbo e objeto.
                    rotulo="Registrar sinais"
                    objeto="os três, nas categorias da matriz"
                    pronto={Object.keys(bandeja).length > 0}
                    oQueFalta="Ponha ao menos um sinal numa categoria. A matriz só abre depois do registro."
                    aoClicar={() => {
                      const certos = SINAIS.filter((s) => bandeja[s.id] === s.referencia).length;
                      setAbertas((a) => Array.from(new Set([...a, ...Array.from(alvos)])));
                      loop.registrar('bandeja', {
                        resumo: `${certos} de ${SINAIS.length} na mesma categoria da matriz`,
                        atende: certos === SINAIS.length ? 'atende' : 'atende em parte',
                      });
                    }}
                  />
                  <AvisoDeReferencia>A matriz abaixo abre depois do registro: é ela a referência.</AvisoDeReferencia>
                </div>
              ) : (
                <p style={{ ...AT2.metadado, margin: '12px 0 0', color: A.tintaSobreCreme }}>
                  {reg2.resumo}. Um sinal de <b>dívida</b> lido como problema de <b>operação</b> é a confusão que a
                  seção 06.2 desfaz. <AcaoSecundaria href="#s062">Rever 06.2</AcaoSecundaria>
                </p>
              )}
            </Ato>
          </div>

          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', alignItems: 'baseline' }}>
            <Voz rotulo="Referência · matriz do INST·09" fonte="texto do curso" />
            <span style={{ ...AT2.metadado, color: A.tintaSuave, display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              {matrizAberta ? (
                <>
                  <MarcaEstacao estado="percorrido" tamanho={12} /> mesma categoria ·{' '}
                  <MarcaEstacao estado="por-percorrer" tamanho={12} /> categoria diferente
                </>
              ) : (
                <>sete linhas veladas até a bandeja · Regulatório aberta como exemplo</>
              )}
            </span>
          </div>

          <div role="table" aria-label="Matriz de risco em duas lentes" style={{ borderTop: `1.4px solid ${A.tintaSobreCreme}` }}>
            {MATRIZ.map((l, i) => {
              const ab = aberta(l.k);
              const alvo = matrizAberta && alvos.has(l.k);
              return (
                <div
                  key={l.k}
                  role="row"
                  style={{
                    borderTop: i === 0 ? 'none' : `1px solid ${A2.fioClaroSobreCreme}`,
                    background: ab ? A.cremePapel : 'transparent',
                    padding: '2px 0',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: movel ? '1fr' : '230px minmax(0, 1fr)',
                      gap: movel ? '2px' : '18px',
                      alignItems: 'start',
                    }}
                  >
                    <div role="rowheader" style={{ padding: '10px 0' }}>
                      {/* Linha velada não é controle: sem a bandeja registrada
                          não há o que abrir, e botão desabilitado é alvo morto
                          (§6, controle inerte). Vira nome em tinta. */}
                      {visivel(l.k) ? (
                        <button
                          type="button"
                          data-capture={l.k === 'reg' ? 'matriz-linha' : undefined}
                          aria-expanded={ab}
                          onClick={() => setAbertas((a) => (a.includes(l.k) ? a.filter((x) => x !== l.k) : [...a, l.k]))}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            alignItems: 'flex-start',
                            textAlign: 'left',
                            minHeight: '44px',
                            background: 'none',
                            border: 'none',
                            borderRadius: AR.none,
                            padding: 0,
                            cursor: 'pointer',
                            fontFamily: AF.corpo,
                            fontWeight: 600,
                            fontSize: '15px',
                            lineHeight: 1.3,
                            color: A.tintaSobreCreme,
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            {alvo && <MarcaEstacao estado="percorrido" tamanho={12} />}
                            {l.n}
                          </span>
                          <i style={{ fontStyle: 'italic', fontWeight: 400, fontSize: '12px', color: A2.tintaMetadado }}>
                            {l.aQueAAulaNomeia
                              ? 'fora da lista · a que a aula nomeia'
                              : l.naLista
                                ? 'na lista do currículo'
                                : 'fora da lista do currículo'}
                          </i>
                          <i style={{ fontStyle: 'italic', fontWeight: 400, fontSize: '12px', color: A2.tintaMetadado }}>
                            {ab ? 'fechar' : 'abrir'}
                          </i>
                        </button>
                      ) : (
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minHeight: '44px', fontFamily: AF.corpo, fontWeight: 600, fontSize: '15px', lineHeight: 1.3 }}>
                          <span>{l.n}</span>
                          <i style={{ fontStyle: 'italic', fontWeight: 400, fontSize: '12px', color: A2.tintaMetadado }}>
                            {l.aQueAAulaNomeia
                              ? 'fora da lista · a que a aula nomeia'
                              : l.naLista
                                ? 'na lista do currículo'
                                : 'fora da lista do currículo'}
                          </i>
                        </span>
                      )}
                    </div>
                    <div style={{ padding: movel ? '0 0 10px' : '10px 0' }}>
                      {!visivel(l.k) ? (
                        <Velado>as duas lentes e o alerta abrem depois da bandeja de sinais</Velado>
                      ) : !ab ? (
                        <span style={{ ...AT2.metadado, color: A2.tintaMetadado, fontStyle: 'italic' }}>
                          célula fechada · abre no lugar, sem sair da aula
                        </span>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: movel ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: movel ? '12px' : '20px' }}>
                          {[
                            ['Empresa aberta · como se manifesta', l.emp],
                            ['Sociedade de projeto · como se manifesta', l.prj],
                            ['Indicador de alerta', l.alr],
                          ].map(([t, v]) => (
                            <div key={t}>
                              <span style={{ ...aparato, fontSize: '11px', display: 'block', marginBottom: '3px' }}>{t}</span>
                              <span style={{ fontFamily: AF.corpo, fontSize: '14px', lineHeight: 1.45 }}>{v}</span>
                            </div>
                          ))}
                          <div style={{ gridColumn: movel ? undefined : '1 / -1', borderTop: `1px dashed ${A.fioSobreCreme}`, paddingTop: '8px' }}>
                            <span style={{ ...aparato, fontSize: '11px', marginRight: '7px' }}>O que mitiga</span>
                            <span style={{ fontFamily: AF.corpo, fontSize: '14px', lineHeight: 1.45 }}>{l.mit}</span>
                          </div>
                          {l.k === 'reg' && !matrizAberta && (
                            <div style={{ gridColumn: movel ? undefined : '1 / -1', ...AT2.metadado, color: A2.tintaMetadado }}>
                              linha-exemplo · aberta para mostrar como se lê
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Fonte
            resumo={<>Matriz do Módulo 13, INST·09 · classificação para leitura estrutural; não estima probabilidade nem severidade.</>}
            ficha={
              <>
                Classificação de risco para leitura estrutural. Não estima probabilidade, não atribui severidade em
                escala e não substitui a seção de fatores de risco do Formulário de Referência da companhia específica
                — que é sempre a fonte primária.
              </>
            }
          />

          {loop.praticados > 0 && (
            <Praticado>
              <b>Até aqui:</b> {loop.praticados} de {loop.total} atos registrados. Os atos 3 a 5 estão nas seções 06.2
              a 06.4.
            </Praticado>
          )}
        </Palco>

        {/* ── 06.2 ── */}
        <div id="s062">
          <Fila movel={movel}>
            <Secao n="06.2">Crédito e estrutura de capital: o caso da reestruturação de dívida</Secao>
            <P>
              Risco de crédito não é a probabilidade de a empresa ir mal. É a probabilidade de que ela não consiga{' '}
              <b>honrar obrigações no vencimento</b> — o que pode acontecer com uma companhia operacionalmente sólida
              se o desenho da dívida colidir com a geração de caixa. Foi exatamente isso que o setor brasileiro
              observou em 2026.
            </P>
            <P>
              A Raízen — sociedade constituída como associação entre dois grupos de referência — ajuizou pedido de
              recuperação extrajudicial em março de 2026, com dívida financeira quirografária sujeita de
              aproximadamente R$ 65,1 bilhões. O plano foi protocolado em 6 de junho de 2026 com 75,45% de adesão dos
              credores e <b>homologado em 30 de julho de 2026</b> pela 3ª Vara de Falências e Recuperações Judiciais de
              São Paulo, com adesão final de 81,6% dos créditos quirografários sujeitos e nenhuma impugnação
              apresentada. O reperfilamento efetivo alcança cerca de R$ 61,4 bilhões e, pela lei de recuperação e
              falências, passa a <b>vincular a totalidade dos credores sujeitos</b>, inclusive os que não aderiram. A
              companhia listou ainda cerca de R$ 33,5 bilhões em obrigações entre empresas do próprio grupo,
              subordinadas às dívidas financeiras externas na ordem de pagamento.
            </P>
            <Fonte
              resumo={
                <>
                  <Selo>Números vivos · verificado em 02/08/2026</Selo> <Selo pendente>revisão factual P3/P11 pendente</Selo>{' '}
                  Texto literal do módulo (fatos de 2026): fatos relevantes e decisões judiciais noticiadas, documento
                  específico não declarado.
                </>
              }
              ficha={
                <>
                  Os valores, percentuais e datas deste parágrafo estão no HTML do Módulo 13 e ainda não foram
                  conferidos pela Alexandria em fonte primária. Antes de publicar, conferir o fato relevante da
                  companhia e a decisão de homologação. Verificar o andamento processual antes de uso externo.
                </>
              }
            />
          </Fila>

          <div
            role="table"
            aria-label="Recuperação judicial e recuperação extrajudicial"
            style={{ maxWidth: `${MEDIDA_PALCO}px`, margin: '24px 0 28px', borderTop: `1.4px solid ${A.tintaSobreCreme}`, borderBottom: `1px solid ${A.fioSobreCreme}` }}
          >
            {!movel && (
              <div role="row" style={{ display: 'grid', gridTemplateColumns: '210px 1fr 1fr', gap: '0 18px', padding: '8px 0', borderBottom: `1px solid ${A.fioSobreCreme}` }}>
                <span role="columnheader" style={{ ...aparato, fontSize: '11px' }}>
                  Instituto
                </span>
                <span role="columnheader" style={{ ...aparato, fontSize: '11px' }}>
                  Recuperação judicial
                </span>
                <span role="columnheader" style={{ ...aparato, fontSize: '11px' }}>
                  Recuperação extrajudicial
                </span>
              </div>
            )}
            {RJ_RE.map(([k, rj, re]) => (
              <div
                key={k}
                role="row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: movel ? '1fr' : '210px 1fr 1fr',
                  gap: movel ? '2px' : '0 18px',
                  padding: '9px 0',
                  borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
                  fontFamily: AF.corpo,
                  fontSize: '14.5px',
                  lineHeight: 1.45,
                }}
              >
                <span role="rowheader" style={{ fontWeight: 600 }}>
                  {k}
                </span>
                <span>{movel && <b style={{ fontWeight: 600 }}>Judicial · </b>}{rj}</span>
                <span>{movel && <b style={{ fontWeight: 600 }}>Extrajudicial · </b>}{re}</span>
              </div>
            ))}
          </div>

          <Fila movel={movel}>
            {/* ── Ato 3 · ler o instituto ── */}
            <div style={{ margin: '10px 0 24px' }}>
              <Ato
                id="instituto"
                ordem={3}
                genero="ler o instituto"
                fonte="Alexandria, sobre o quadro do curso"
                movel={movel}
                enunciado={
                  <>
                    Duas geradoras têm o mesmo montante de dívida. <b>A</b> pediu recuperação judicial sem acordo
                    prévio. <b>B</b> protocolou recuperação extrajudicial já com adesão majoritária dos credores. Para
                    quem vai assinar um contrato de quinze anos, qual das duas sinaliza menos risco de crédito?
                  </>
                }
              >
                {!reg3 ? (
                  <>
                    <Escolhas
                      rotuloGrupo="Qual sinaliza menos risco de crédito"
                      colunas={movel ? 1 : 3}
                      valor={instituto}
                      aoEscolher={setInstituto}
                      opcoes={[
                        { id: 'A', rotulo: 'A' },
                        { id: 'B', rotulo: 'B' },
                        { id: 'nc', rotulo: 'Não é possível concluir' },
                      ]}
                    />
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <AcaoDeRegistro
                        movel={movel}
                        rotulo="Registrar leitura"
                        captura="checagem-registrar"
                        pronto={Boolean(instituto)}
                        oQueFalta="Escolha A, B ou 'não é possível concluir'. O parágrafo de referência abre depois da sua tentativa."
                        aoClicar={() =>
                          instituto &&
                          loop.registrar('instituto', { resumo: instituto, atende: instituto === 'B' ? 'atende' : 'atende em parte' })
                        }
                      />
                      <AvisoDeReferencia>O parágrafo logo abaixo é a referência. Responda antes de lê-lo.</AvisoDeReferencia>
                    </div>
                  </>
                ) : (
                  <Comparacao
                    movel={movel}
                    sua={reg3.resumo}
                    tituloReferencia="Referência · texto do curso (parágrafo seguinte)"
                    referencia={
                      <>
                        <b>B</b>, como sinal: a adesão pré-negociada indica que os credores de referência aceitaram uma
                        solução; o pedido sem acordo indica o contrário. Montante igual não quer dizer risco igual.
                      </>
                    }
                  />
                )}
              </Ato>
            </div>

            <P>
              A diferença entre os dois institutos não é jurídica apenas — é <b>informacional</b>. Uma recuperação
              extrajudicial protocolada com adesão majoritária já pré-negociada sinaliza que os credores de referência
              aceitaram uma solução; uma recuperação judicial pedida sem acordo prévio sinaliza o contrário. Para quem
              avalia contraparte de contrato de longo prazo, os dois estados implicam níveis de risco distintos, mesmo
              com o mesmo montante de dívida.
            </P>

            <Secao n="06.3">Estudo de caso: uma recuperação judicial de distribuidora a um passo do fim</Secao>
            <P>
              O currículo cobra, em critério de prontidão separado, o domínio do caso de recuperação judicial de
              distribuidora de energia — causas, lições e implicações regulatórias. É um dos poucos casos brasileiros
              em que uma concessionária de serviço público entrou em recuperação judicial e chegou perto de sair dela
              com a concessão renovada. Vale como quadro de estudo, não como ficha de battlecard.
            </P>

            {/* ── Ato 4 · afirmar hoje ── */}
            <div style={{ margin: '10px 0 24px' }}>
              <Ato
                id="hoje"
                ordem={4}
                genero="afirmar hoje"
                fonte="Alexandria, sobre a cronologia do curso"
                movel={movel}
                enunciado="Hoje, 17/09/2026, você escreve uma linha de relatório sobre a distribuidora da cronologia. Qual frase pode ir sem nova verificação?"
              >
                {!reg4 ? (
                  <>
                    <Escolhas
                      rotuloGrupo="Qual frase pode ir sem nova verificação"
                      colunas={1}
                      valor={frase}
                      aoEscolher={setFrase}
                      opcoes={[
                        { id: 'a', rotulo: '“A distribuidora está em recuperação judicial.”' },
                        { id: 'b', rotulo: '“A distribuidora encerrou a recuperação judicial.”' },
                        { id: 'c', rotulo: '“Em 02/08/2026, o encerramento aguardava sentença; o estado atual precisa ser verificado.”' },
                      ]}
                    />
                    <AcaoDeRegistro
                      movel={movel}
                      rotulo="Registrar frase"
                      pronto={Boolean(frase)}
                      oQueFalta="Escolha a frase antes de registrar."
                      aoClicar={() => frase && loop.registrar('hoje', { resumo: frase, atende: frase === 'c' ? 'atende' : 'não atende' })}
                    />
                  </>
                ) : (
                  <Comparacao
                    movel={movel}
                    sua={
                      reg4.resumo === 'c'
                        ? '“Em 02/08/2026, o encerramento aguardava sentença; o estado atual precisa ser verificado.”'
                        : reg4.resumo === 'a'
                          ? '“A distribuidora está em recuperação judicial.”'
                          : '“A distribuidora encerrou a recuperação judicial.”'
                    }
                    tituloReferencia="Referência · texto do curso"
                    referencia={
                      <>
                        É a terceira a única afirmável sem nova consulta. Repetir “está em recuperação” depois de
                        eventual sentença é erro factual; afirmar “encerrou” antes dela é o erro simétrico. Entre a
                        verificação e hoje passaram 46 dias.
                      </>
                    }
                  />
                )}
              </Ato>
            </div>
          </Fila>

          {/* A cronologia é leitura corrida: a medida é a da coluna de
              leitura, não a do palco (C4 — 60 a 72 caracteres). */}
          <div style={{ maxWidth: '760px' }}>
            <ol
              aria-label="Cronologia do caso"
              style={{ listStyle: 'none', margin: '8px 0 0', padding: '0 0 0 22px', borderLeft: `1.5px solid ${A.tintaSobreCreme}` }}
            >
              {CRONOLOGIA.map((c) => (
                <li
                  key={c.quando}
                  style={{
                    position: 'relative',
                    padding: c.tipo === 'hoje' ? '10px 0 16px 6px' : '0 0 16px 6px',
                    ...(c.tipo === 'hoje' ? { borderTop: `1.5px dashed ${A.tintaSobreCreme}`, marginLeft: '-28px', paddingLeft: '34px' } : null),
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: c.tipo === 'hoje' ? '-1px' : '-29px',
                      top: c.tipo === 'hoje' ? '14px' : '5px',
                      display: 'block',
                    }}
                  >
                    <MarcaEstacao
                      estado={c.tipo === 'marco' ? 'percorrido' : c.tipo === 'verificado' ? 'em-curso' : 'a-seguir'}
                      tamanho={c.tipo === 'marco' ? 12 : 13}
                    />
                  </span>
                  <time style={{ ...aparato, display: 'block', fontSize: '11px' }}>{c.quando}</time>
                  <b style={{ display: 'block', fontFamily: AF.corpo, fontSize: '15.5px', margin: '2px 0 3px' }}>{c.titulo}</b>
                  {c.texto ? (
                    <p style={{ margin: 0, fontFamily: AF.corpo, fontSize: '13.5px', lineHeight: 1.45, color: A.tintaSuave }}>{c.texto}</p>
                  ) : (
                    <p style={{ margin: 0 }}>
                      <Selo pendente>verificar: o estado pode ter mudado</Selo>
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* A FOTO DA LIGAÇÃO IRREGULAR desceu da Nota para a lição que ela
              explica. O manifesto de mídia ancora `m13-a06-01` no bloco 12,
              item 2 — "perda não técnica de energia é um risco de crédito
              disfarçado de risco operacional" —, e ela estava ao lado da
              cronologia da recuperação judicial, que é outro assunto. C4: a
              explicação visual fica junto do parágrafo que explica. */}
          <Fila movel={movel}>
            <Nota titulo="Números vivos · verificar na fonte antes de uso externo">
              <P style={{ margin: 0 }}>
                Cronologia compilada de fatos relevantes da companhia, decisões judiciais noticiadas e deliberação da
                agência reguladora. <b>O último item é o mais perecível de todo o módulo</b>: quem repetir "está em
                recuperação judicial" depois de eventual sentença de encerramento comete erro factual, e quem afirmar
                "encerrou" antes da sentença comete o erro simétrico. Verifique o andamento processual e os fatos
                relevantes da companhia antes de qualquer afirmação. Consulta em 2 de agosto de 2026.
              </P>
            </Nota>
          </Fila>

          <Fila movel={movel} lado={<ImagemDaAula asset={ROCINHA} sizes={movel ? '100vw' : '420px'} />}>
            <P>As três lições que o caso produz, e que se transferem para qualquer outra concessionária em dificuldade:</P>
            <ol style={{ margin: '0 0 20px', paddingLeft: '22px', ...{ fontFamily: AF.corpo, fontSize: '17px', lineHeight: 1.6 } }}>
              <li style={{ marginBottom: '10px' }}>
                <b>Risco regulatório e risco de crédito não são independentes.</b> A recuperação da companhia dependeu
                de o regulador decidir prorrogar a concessão — e o regulador só teria razão para prorrogar se a
                companhia fosse capaz de investir. Cada um dos dois era condição do outro, e um modelo que tratasse os
                dois riscos como variáveis separadas erraria a correlação no cenário que importa.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <b>Perda não técnica de energia é um risco de crédito disfarçado de risco operacional.</b> Energia
                distribuída e não faturada aparece como perda no indicador operacional, mas o efeito financeiro é
                idêntico ao de inadimplência: caixa que não entra contra custo que já foi pago. Em área de concessão
                com alta perda não técnica, os dois riscos são a mesma coisa medida de dois jeitos.
              </li>
              <li>
                <b>Conversão de dívida em capital muda a estrutura de controle sem transação de controle.</b> Quando
                parte da dívida vira ação, credores viram acionistas — e a tabela de controle da empresa no fim do
                processo pode não se parecer com a do início. É por isso que a lente de controle precisa ser{' '}
                <b>reverificada</b> depois de qualquer reestruturação, e não herdada da leitura anterior.
              </li>
            </ol>
          </Fila>

          {/* ── 06.4 ── */}
          <Fila movel={movel}>
            <Secao n="06.4">Risco de contraparte: o que importa para quem compra energia</Secao>
            <P>
              Há uma inversão de perspectiva que este módulo torna possível e que nenhum anterior permitia. Nos Módulos
              09 e 10, a geradora aparecia como <i>fornecedora</i> — a contraparte de um contrato de compra de energia,
              avaliada por preço, prazo e flexibilidade. A partir daqui, ela também é uma{' '}
              <b>contraparte de risco de crédito</b>, e a avaliação muda de natureza.
            </P>
            <P>
              Um contrato de compra de energia de quinze anos com uma geradora não é apenas um preço travado: é uma
              exposição de quinze anos à capacidade daquela companhia de honrar o contrato. Se a geradora entrar em
              reestruturação, o comprador industrial pode enfrentar renegociação de condições, descontinuidade de
              fornecimento contratado, ou a necessidade de recontratar energia a preço de mercado no pior momento
              possível. Nenhuma cláusula de preço resolve isso sozinha — resolve-se com garantia, com estrutura de
              contrato e, antes de tudo, com <b>avaliação de crédito da contraparte antes de assinar</b>.
            </P>

            {/* ── Ato 5 · o que pedir antes de assinar ── */}
            <div style={{ margin: '10px 0 24px' }}>
              <Ato
                id="documentos"
                ordem={5}
                genero="o que pedir antes de assinar"
                movel={movel}
                enunciado="Você vai assinar um contrato de compra de energia de quinze anos com uma geradora. Para responder “esta contraparte estará em condições de honrar o contrato no ano dez?”, que documentos você pede? Marque os que servem."
              >
                {!reg5 ? (
                  <>
                    <Escolhas
                      rotuloGrupo="Documentos que servem"
                      colunas={movel ? 1 : 2}
                      multipla
                      marcadas={documentos}
                      aoEscolher={(id) => setDocumentos((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))}
                      opcoes={[
                        { id: 'prop', rotulo: 'proposta comercial' },
                        { id: 'fr', rotulo: 'Formulário de Referência' },
                        { id: 'cron', rotulo: 'cronograma de dívida da contraparte' },
                        { id: 'tab', rotulo: 'tabela de preços da proposta' },
                      ]}
                    />
                    <AcaoDeRegistro
                      movel={movel}
                      rotulo="Registrar escolha"
                      pronto={documentos.length > 0}
                      oQueFalta="Marque ao menos um documento. A referência abre depois da sua escolha."
                      aoClicar={() => {
                        const certo = documentos.includes('fr') && documentos.includes('cron') && documentos.length === 2;
                        loop.registrar('documentos', {
                          resumo: documentos
                            .map((d) => ({ prop: 'proposta comercial', fr: 'Formulário de Referência', cron: 'cronograma de dívida', tab: 'tabela de preços' })[d])
                            .join(' · '),
                          atende: certo ? 'atende' : 'atende em parte',
                        });
                      }}
                    />
                    <AvisoDeReferencia>O fim da nota “A pergunta que muda de lado” abre depois do registro.</AvisoDeReferencia>
                  </>
                ) : (
                  <Comparacao
                    movel={movel}
                    sua={reg5.resumo}
                    tituloReferencia="Referência · texto do curso"
                    referencia={
                      <>
                        <b>Formulário de Referência e cronograma de dívida da contraparte.</b> A proposta comercial
                        responde à outra pergunta, a do preço.
                      </>
                    }
                  />
                )}
              </Ato>
            </div>

            <Nota titulo="A pergunta que muda de lado" tom="ouro">
              <P style={{ margin: 0 }}>
                Nos módulos anteriores: <i>este contrato tem bom preço?</i> A partir daqui, e sem substituir a
                primeira: <i>esta contraparte estará em condições de honrar este contrato no ano dez?</i>{' '}
                {reg5 ? (
                  'As duas perguntas se respondem com documentos diferentes — a primeira com a proposta comercial, a segunda com o Formulário de Referência e o cronograma de dívida da contraparte.'
                ) : (
                  <Velado>o resto abre depois do Ato 5</Velado>
                )}
              </P>
            </Nota>
          </Fila>
        </div>

        <RegistroDaAula
          movel={movel}
          serveA={
            <>
              <b>Critério de prontidão do módulo</b> · domínio do caso de recuperação judicial de distribuidora de
              energia — causas, lições e implicações regulatórias
            </>
          }
          demonstrado="Demonstrado: ainda não avaliado."
          avaliacao="Aplicação da 06.4 no Caso — Operação A · ainda não disponível."
        />

        <ProximoPasso
          movel={movel}
          aoIr={navegar}
          sequencia="Aula 06 (esta aula) → Aula 07 → Revisão do Módulo 13 → Avaliação, que abre depois da Revisão, com o critério mostrado antes."
          semPratica={{ rotulo: 'Fazer o ato desta aula', codigo: 'M13·A06', titulo: 'classificar um sinal de alerta', destino: '#aula-titulo' }}
          aRevisar={{ rotulo: 'Rever 06.2', codigo: 'M13·A06', titulo: 'a categoria que o currículo não nomeia', destino: '#s062' }}
          normal={{
            rotulo: 'Próxima',
            codigo: 'M13·A07',
            titulo: 'Seis fichas, um arquétipo cada, e um campo deixado deliberadamente em branco',
            destino: rotaDaAula(Math.min(numero + 1, totalAulas)),
          }}
        />

        <AcaoSecundaria href={rotaDoModulo}>Voltar à rota do Módulo 13</AcaoSecundaria>

        <div style={{ marginTop: '32px' }}>
          <CreditosDaRota
            linhas={[
              <>
                <b>Poste de distribuição numa viela da Rocinha, Rio de Janeiro, março de 2008.</b> {ROCINHA.credito}
              </>,
            ]}
          />
        </div>
      </div>
    </div>
  );
}
