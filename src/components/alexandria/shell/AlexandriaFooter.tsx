// AlexandriaFooter — a cartela do atlas.
//
// Quatro seções, como a caixa de legenda no canto de uma carta náutica
// de 1890: quem assina, como se navega, de onde vem o dado, e um
// instrumento de ambientação.
//
//   marca e propósito · navegação · fontes primárias · ambientação
//
// Altura vem de padding, não de valor fixo: o handoff não declara
// footerHeight em lugar nenhum (busca exaustiva — nenhum height,
// min-height ou max-height nos rodapés). Os dois rodapés reais são
// dimensionados por conteúdo, ambos com border-top 1px navy-line.
// Reproduzo esse padrão em vez de inventar um número.
//
// DIVERGÊNCIA REGISTRADA: o brief pede a faixa de blueprint aqui, e é
// o que está implementado. O handoff descreve 'rodapé navy com faixa
// de blueprint' em prosa (L1084) mas nenhum dos rodapés de produto
// (L1312, L1835) carrega background-image. A faixa existe no arquivo
// só como chrome do próprio documento de handoff.
//
// ─────────────────────────────────────────────────────────────
// RESTRIÇÃO ESTRUTURAL QUE ESTE ARQUIVO HERDA — leia antes de crescer.
//
// AlexandriaShell é `height: 100vh` + `overflow: hidden`, e o rodapé
// fica FORA do <main> que rola, com `flex: none`. Ou seja: isto não é
// rodapé de fim de página, é FAIXA PERMANENTE — cada pixel de altura
// aqui é um pixel a menos de canvas de leitura, em toda tela do
// produto, o tempo inteiro.
//
// Por isso a composição é densa e baixa em vez de arejada: quatro
// colunas numa faixa, gravura pequena de acento, e a régua de fecho
// numa linha só. É também o que a regra de densidade pede (40-60
// elementos por tela) — as duas restrições apontam para o mesmo lugar.
//
// Se um dia o rodapé precisar crescer, o caminho NÃO é aumentar o
// padding daqui: é mover <AlexandriaFooter/> para dentro do <main>
// no Shell, e aí ele rola com o conteúdo. Isso é mudança de uma linha,
// mas em arquivo fora da posse desta wave.
// ─────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';
import { A, A2, AT, AS, AR, AE, ALAYOUT } from '../../../design/alexandria-tokens';
import type { AlexandriaNavItem } from './AlexandriaHeader';
import { ALEXANDRIA_MODULES } from '../../../lib/data/alexandria-trilhas';

// ── PROVENIÊNCIA — derivada dos catálogos, nunca digitada ─────
//
// Mesma disciplina da Wave 3: se o número for escrito à mão aqui, ele
// diverge no dia em que um módulo ganhar HTML. `totalAulas: null`
// significa 'sem fonte', não 'zero'.
//
// A grade de estatística que existia aqui (3 trilhas · 17 módulos ·
// 29 aulas) FOI REMOVIDA a pedido do Aquiles: esse mesmo número já
// vive no hero da Wave 7, e repeti-lo no rodapé era o que inflava a
// altura da faixa permanente sem acrescentar informação.
//
// O que sobra são estes dois, e por um papel diferente: a régua de
// fecho não conta catálogo, declara ESTADO DE EXTRAÇÃO — quantos
// módulos têm conteúdo verificado contra quantos existem. Isso é
// proveniência do que está no ar, não vitrine.
const TOTAL_MODULOS = ALEXANDRIA_MODULES.length;
const MODULOS_COM_FONTE = ALEXANDRIA_MODULES.filter((m) => m.totalAulas !== null).length;

// O RÓTULO DE ESTADO É DERIVADO, como os dois números acima — não é
// string fixa e não vem por prop. Enquanto existir bloco com
// `totalAulas` nulo o currículo está em extração; quando não existir
// mais nenhum, está completo.
//
// Até a Wave 47 a frase dizia "Currículo em extração" sempre, e isso
// era verdade porque sempre faltava bloco. Com o bloco-15 extraído o
// currículo fechou em 17 de 17, e a linha passou a se contradizer na
// própria frase — "em extração · 17 de 17 módulos verificados".
// A pendência foi registrada na Wave 49 e é o que esta wave fecha.
const CURRICULO_COMPLETO = MODULOS_COM_FONTE === TOTAL_MODULOS;

// ── NAVEGAÇÃO — espelha o header ─────────────────────────────
//
// DUPLICAÇÃO DELIBERADA. `NAV_PADRAO` não é exportado por
// AlexandriaHeader, e o header está fora da posse desta wave (o brief
// diz NUNCA MODIFICAR). Duplicar a lista é o menor dos males; o tipo
// `AlexandriaNavItem` vem importado do header, então pelo menos a FORMA
// não pode divergir sem o compilador reclamar.
//
// Pendência para quem abrir o header de novo: exportar NAV_PADRAO e
// importar aqui, deletando esta constante.
const NAV_RODAPE: ReadonlyArray<AlexandriaNavItem> = [
  { id: 'biblioteca', rotulo: 'Biblioteca', destino: '/alexandria' },
  { id: 'trilhas', rotulo: 'Trilhas', destino: '/alexandria' },
  { id: 'atlas', rotulo: 'Atlas', destino: '/alexandria/atlas' },
  { id: 'glossario', rotulo: 'Glossário', destino: '/alexandria/glossario' },
];

// ── FONTES PRIMÁRIAS ─────────────────────────────────────────
//
// PROCEDÊNCIA ASSIMÉTRICA, registrada em vez de silenciada. Três das
// quatro razões sociais aparecem escritas por extenso em fonte do
// próprio repositório; a da ANEEL não aparece em lugar nenhum.
//
//   ONS   — 'Operador Nacional do Sistema Elétrico'
//           src/lib/data/alexandria-modulo-01-content.ts L230 (aula 03),
//           mais 5 ocorrências nos HTML de `Alexandria modulos/`.
//   CCEE  — 'Câmara de Comercialização de Energia Elétrica'
//           3 ocorrências nos HTML dos módulos.
//   EPE   — 'Empresa de Pesquisa Energética'
//           1 ocorrência nos HTML dos módulos.
//   ANEEL — SEM PROCEDÊNCIA INTERNA. A sigla aparece 12+ vezes nos
//           módulos ('ANEEL define faixas para tensão entregue…',
//           'ANEEL nas revisões tarifárias periódicas…'), mas a forma
//           por extenso não ocorre uma única vez no repositório.
//           O nome abaixo é razão social pública, não extração — é a
//           única linha desta seção que não tem citação, e fica
//           marcada como tal para quem auditar.
const FONTES: ReadonlyArray<{ sigla: string; nome: string; comFonte: boolean }> = [
  { sigla: 'ONS', nome: 'Operador Nacional do Sistema Elétrico', comFonte: true },
  { sigla: 'ANEEL', nome: 'Agência Nacional de Energia Elétrica', comFonte: false },
  { sigla: 'CCEE', nome: 'Câmara de Comercialização de Energia Elétrica', comFonte: true },
  { sigla: 'EPE', nome: 'Empresa de Pesquisa Energética', comFonte: true },
];

// ── GRAVURAS TIER B ──────────────────────────────────────────
//
// Só `orn-` entra aqui. `orn-` é mobília de interface — foi separada na
// Wave 5 justamente por nunca mapear para aula. Gravura de conteúdo
// (`fis-`, `ger-`, `red-`…) pertence à prancha da apostila e não pode
// virar decoração de rodapé.
//
// Medido nos arquivos antes de escolher (decodificação de palette +
// tRNS, não inspeção visual): as seis candidatas são 1536x1024, fundo
// com alpha 0 nos quatro cantos, e tinta média entre #ab9b82 e
// #d2c5aa. Isso dá 6,7:1 a 10,7:1 contra o navy do rodapé e apenas
// 1,4:1 a 2,3:1 contra o creme — a coleção `orn-` foi desenhada para
// campo escuro. O rodapé navy é o campo certo para ela.
//
// Legenda derivada do nome do arquivo, com acento reposto (nome de
// arquivo é ASCII) — mesma convenção da Prancha na Wave 5.
const GRAVURA_BASE = '/alexandria/gravuras';

/** As 15 `orn-` saíram da conversão da Wave 5 todas em 1536x1024 —
 *  proporção 3:2, verificada arquivo a arquivo nas seis usadas ou
 *  cogitadas aqui. A caixa de cada gravura é reservada por esta razão
 *  em vez de por `width: auto`.
 *
 *  Isso não é micro-otimização, é correção de bug observado: com
 *  `width: auto` a imagem mede 0 de largura enquanto não carrega, e um
 *  elemento de área zero não dispara `loading="lazy"` — a largura nunca
 *  sai de 0 porque a imagem nunca chega, e a imagem nunca chega porque
 *  a largura é 0. Três das quatro gravuras ficaram invisíveis assim na
 *  primeira medição (0x40, 0x44, 0x92); só o mapa escapou, por timing. */
const RAZAO_ORN = 1536 / 1024;

interface Gravura {
  arquivo: string;
  legenda: string;
  altura: number;
}

const larguraDe = (g: Gravura) => Math.round(g.altura * RAZAO_ORN);

const G = {
  // Ambientação. Objeto mais 'instrumento científico' da coleção e o
  // único radialmente simétrico — ancora a ponta direita da cartela sem
  // apontar para lugar nenhum, que é o que ambientação deve fazer.
  // ALTURAS — acento de canto, não ilustração de destaque.
  //
  // Reduzidas de novo (40/16/26/24 → abaixo) no pedido de encolher o
  // rodapé inteiro: a faixa não é mais permanente (Wave 16), mas ainda
  // pesava por linha de conteúdo. Astrolábio é quem mais perde — é
  // acento de canto puro, o que menos custa encolher.
  astrolabio: { arquivo: 'orn-15-astrolabio.png', legenda: 'Astrolábio', altura: 26 },

  // Junto do link de Atlas, inline na linha do texto. Não desce mais —
  // já estava no piso de legibilidade da Wave 10 (16px); abaixo disso a
  // gravura desaparece.
  mapa: { arquivo: 'orn-13-mapa-dobrado.png', legenda: 'Mapa dobrado', altura: 16 },

  // Acento da coluna de fontes. Ver Wave 10 para a escolha sobre
  // orn-04-estante-arquivo — não muda aqui, só o tamanho.
  livros: { arquivo: 'orn-01-pilha-livros.png', legenda: 'Pilha de livros', altura: 18 },

  // Acento da coluna de navegação. Ver Wave 10 para a escolha sobre
  // orn-05-compasso — não muda aqui, só o tamanho.
  sextante: { arquivo: 'orn-11-sextante.png', legenda: 'Sextante', altura: 18 },
} as const satisfies Record<string, Gravura>;

/** Gravura decorativa. `aria-hidden` + alt vazio: é mobília, não
 *  conteúdo — um leitor de tela não ganha nada anunciando 'sextante'.
 *
 *  SEM `loading="lazy"`, e isso é decisão medida, não esquecimento.
 *  Lazy aqui não é só inútil — é quebrado. O rodapé é faixa permanente:
 *  nasce dentro da viewport, num container que não rola. O observer de
 *  lazy loading nunca dispara para um elemento que já estava lá, e três
 *  das quatro gravuras ficaram com `currentSrc` vazio e `naturalWidth`
 *  0 indefinidamente, mesmo com os arquivos respondendo 200 e os
 *  elementos medindo dentro da tela. Só o mapa escapou.
 *
 *  O que fica é o par correto para decoração: `fetchPriority="low"` +
 *  `decoding="async"` tiram a gravura do caminho crítico sem impedir
 *  que ela chegue.
 *
 *  PESO, registrado honestamente: as quatro somam ~1,8 MB e carregam
 *  em toda tela do produto, porque a faixa é permanente. A correção de
 *  verdade é converter os `orn-` para tamanho de exibição — são
 *  1536x1024 servindo caixas de 26 a 66px de altura. Isso é trabalho de
 *  wave de asset: `public/alexandria/gravuras/` é somente-leitura aqui.
 *  Mesma classe da pendência do logo de 1.342 KB da Wave 6. */
function GravuraOrn({ g, opacidade = 0.82 }: { g: Gravura; opacidade?: number }) {
  const largura = larguraDe(g);
  return (
    <img
      src={`${GRAVURA_BASE}/${g.arquivo}`}
      alt=""
      aria-hidden="true"
      width={largura}
      height={g.altura}
      decoding="async"
      fetchPriority="low"
      style={{
        display: 'block',
        width: `${largura}px`,
        height: `${g.altura}px`,
        objectFit: 'contain',
        flex: 'none',
        opacity: opacidade,
        borderRadius: AR.none,
        pointerEvents: 'none',
      }}
    />
  );
}

/** Rótulo de seção da cartela — Cinzel caixa alta, com o fio embaixo
 *  que é o idioma de separação do sistema (nunca caixa, nunca fundo).
 *
 *  SUBORDINADO DE PROPÓSITO. A 10px/0.18em estes rótulos disputavam
 *  peso visual com os títulos do rail direito, que é superfície de
 *  conteúdo — rodapé competindo com conteúdo é inversão de hierarquia.
 *  A 8px/0.13em eles continuam legíveis (6,8:1 sobre o navy profundo,
 *  medido) e voltam a ler como legenda de cartela, que é o papel. */
function RotuloSecao({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        ...AT.rotulo,
        fontSize: '8px',
        letterSpacing: '0.13em',
        color: A2.tintaMetadadoNavy,
        display: 'block',
        paddingBottom: '3px',
        borderBottom: `1px solid ${A.fioSobreNavy}`,
        marginBottom: AS.sm,
      }}
    >
      {children}
    </span>
  );
}

export function AlexandriaFooter() {
  const ano = new Date().getFullYear();

  return (
    <footer
      style={{
        position: 'relative',
        flex: 'none',
        background: A2.navyProfundo,
        borderTop: `1px solid ${A.fioSobreNavy}`,
        borderRadius: AR.none,
        padding: `${ALAYOUT.footerPaddingY} ${ALAYOUT.footerPaddingX}`,
        overflow: 'hidden',
      }}
    >
      {/* Hover e foco por classe: o sistema é inline-style com tokens,
          mas :hover e :focus-visible não existem em style inline, e o
          Shell já abre precedente para uma folha local. Prefixo próprio
          para não colidir com nada. */}
      <style>{`
        .alx-rod-link {
          color: ${A2.tintaSobreNavySuave};
          text-decoration: none;
          border-bottom: 1px solid transparent;
          border-radius: ${AR.none};
          transition: color ${AE.estado} ${AE.easing},
                      border-color ${AE.estado} ${AE.easing};
        }
        .alx-rod-link:hover {
          color: ${A.tintaSobreNavy};
          border-bottom-color: ${A2.terracotaClara};
        }
        .alx-rod-link:focus-visible {
          outline: 1px solid ${A2.ouroSobreNavy};
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          .alx-rod-link { transition: none; }
        }
      `}</style>

      {/* Banda de blueprint — decorativa, atrás do conteúdo, opacidade baixa. */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/alexandria/textura/texture-blueprint-band-on-navy.png)',
          // O asset é uma faixa de 2400x400 (6:1). O rodapé é muito mais
          // largo que alto, então `cover` ampliava a faixa e mostrava só
          // um recorte central. `auto 100%` + repeat-x preserva a
          // proporção e deixa a faixa correr na horizontal.
          backgroundSize: 'auto 100%',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'left center',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      />

      {/* Cartela — quatro seções numa faixa. `auto` na última para o
          astrolábio ocupar só o que a gravura mede. */}
      <div
        style={{
          position: 'relative',
          display: 'grid',
          // Coluna 1 estreita de propósito. Ela era a mais larga
          // (1.15fr) quando carregava a grade de estatística; sem ela
          // sobrou só wordmark + tagline, e 450px para duas linhas
          // abria exatamente o vazio de landing page que a identidade
          // proíbe. A largura foi para as fontes, que têm razão social
          // longa e ganham em caber numa linha cada.
          gridTemplateColumns: '0.6fr 1fr 1.4fr auto',
          gap: AS.xl,
          alignItems: 'start',
        }}
      >
        {/* ── 1 · MARCA E PROPÓSITO ─────────────────────────── */}
        {/* Focal da cartela, e não por enfeite: é a coluna mais larga
            (1.15fr), carrega a identidade e é a única que mostra dado
            derivado do currículo. As outras três são serviço. */}
        <section data-focal>
          <RotuloSecao>Marca e propósito</RotuloSecao>

          <span
            style={{
              ...AT.nav,
              fontSize: '13px',
              color: A.tintaSobreNavy,
              display: 'block',
              lineHeight: 1,
            }}
          >
            Alexandria
          </span>
          <span
            style={{
              ...AT.rotulo,
              fontSize: '8px',
              letterSpacing: '0.24em',
              color: A2.tintaMetadadoNavy,
              display: 'block',
              marginTop: '4px',
            }}
          >
            Atlas vivo da energia do Brasil
          </span>
        </section>

        {/* ── 2 · NAVEGAÇÃO ─────────────────────────────────── */}
        {/* Linha única, não coluna empilhada — era o maior driver de
            altura da faixa (a Wave 10 já tinha medido isso e deixou
            registrado; "fora de escopo" lá, dentro de escopo aqui, no
            pedido explícito de encolher o rodapé). Quatro links cabem
            numa linha só com folga em qualquer largura de canvas real. */}
        <section>
          <RotuloSecao>Navegação</RotuloSecao>

          <div style={{ display: 'flex', gap: AS.sm, alignItems: 'center' }}>
            <nav
              aria-label="Rodapé"
              style={{ display: 'flex', flexWrap: 'wrap', columnGap: AS.lg, rowGap: '4px', flex: 1, minWidth: 0 }}
            >
              {NAV_RODAPE.map((item) => (
                <span
                  key={item.id}
                  style={{ display: 'flex', alignItems: 'center', gap: AS.xs }}
                >
                  <Link
                    to={item.destino}
                    className="alx-rod-link"
                    style={{ ...AT.dado, fontSize: '13px' }}
                  >
                    {item.rotulo}
                  </Link>
                  {/* Mapa dobrado junto do link de Atlas — o objeto é o
                      destino. Só aqui; em qualquer outro item seria
                      decoração solta. */}
                  {item.id === 'atlas' && <GravuraOrn g={G.mapa} opacidade={0.72} />}
                </span>
              ))}
            </nav>

            <GravuraOrn g={G.sextante} opacidade={0.7} />
          </div>
        </section>

        {/* ── 3 · FONTES PRIMÁRIAS ──────────────────────────── */}
        <section>
          <RotuloSecao>Fontes primárias</RotuloSecao>

          <div style={{ display: 'flex', gap: AS.lg, alignItems: 'flex-start' }}>
            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                columnGap: AS.md,
                rowGap: '3px',
                margin: 0,
                // Sem `flex: 1`: esticando, o dl empurrava a pilha de
                // livros para o canto direito da coluna e a gravura
                // virava um objeto solto no vazio em vez de acento do
                // bloco que ela acentua.
                flex: 'none',
                minWidth: 0,
                alignItems: 'baseline',
              }}
            >
              {FONTES.map((f) => (
                <div key={f.sigla} style={{ display: 'contents' }}>
                  <dt
                    style={{
                      ...AT.rotulo,
                      fontSize: '10px',
                      color: A.tintaSobreNavy,
                    }}
                  >
                    {f.sigla}
                  </dt>
                  <dd
                    style={{
                      ...AT.corpo,
                      fontSize: '11px',
                      lineHeight: 1.35,
                      color: A2.tintaSobreNavySuave,
                      margin: 0,
                      maxWidth: 'none',
                    }}
                  >
                    {f.nome}
                  </dd>
                </div>
              ))}
            </dl>

            <GravuraOrn g={G.livros} opacidade={0.78} />
          </div>
        </section>

        {/* ── 4 · AMBIENTAÇÃO ───────────────────────────────── */}
        {/* Figura com legenda, como prancha de monografia. A legenda é
            do objeto desenhado, não uma frase de marketing. */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: AS.xs,
          }}
        >
          <GravuraOrn g={G.astrolabio} opacidade={0.9} />
          <span
            style={{
              ...AT.rotulo,
              fontSize: '8px',
              letterSpacing: '0.22em',
              color: A2.tintaMetadadoNavy,
              textAlign: 'center',
            }}
          >
            {G.astrolabio.legenda}
          </span>
        </section>
      </div>

      {/* ── RÉGUA DE FECHO ──────────────────────────────────── */}
      {/* Uma linha só. Frase da Wave 2 preservada (conteúdo já no ar),
          agora acompanhada da proveniência honesta do que está
          renderizado hoje e do ano. */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: AS.xl,
          flexWrap: 'wrap',
          marginTop: AS.sm,
          paddingTop: '6px',
          borderTop: `1px solid ${A.fioSobreNavy}`,
        }}
      >
        <span
          data-focal
          style={{
            ...AT.corpo,
            fontSize: '13px',
            fontStyle: 'italic',
            lineHeight: 1.5,
            color: A2.tintaSobreNavySuave,
            maxWidth: 'none',
          }}
        >
          Um atlas se lê devagar — e se corrige sempre.
        </span>

        <span
          style={{
            ...AT.rotulo,
            fontSize: '9px',
            color: A2.tintaMetadadoNavy,
            textAlign: 'right',
          }}
        >
          Currículo {CURRICULO_COMPLETO ? 'completo' : 'em extração'} ·{' '}
          {MODULOS_COM_FONTE} de {TOTAL_MODULOS} módulos verificados
          {/* Fio, não caractere. Um '·' pintado na cor de fio fica em
              1,70:1 — reprova AA como texto, e é anunciado por leitor de
              tela sem significar nada. O sistema já tem o separador
              certo: profundidade vem de fio de 1px. */}
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '1px',
              height: '9px',
              background: A.fioSobreNavy,
              margin: `0 ${AS.sm}`,
              verticalAlign: 'baseline',
            }}
          />
          Alexandria · GridAlpha · {ano}
        </span>
      </div>
    </footer>
  );
}

export default AlexandriaFooter;
