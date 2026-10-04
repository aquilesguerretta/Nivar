// AtlasStub — Atlas Mundial de Energia (Wave 27; frontispício e
// composição de página na Wave 28 + revisão direta).
//
// O nome do arquivo fica: é o contrato de rota da Wave 6, e o
// AlexandriaRouter (fora da posse) importa daqui.
//
// Revisão direta pós-Wave 28 (pedido do Aquiles): o globo inteiro na
// tela — o palco ocupa a altura útil do viewport, e título, descrição
// e referências saem de cima/baixo para a COLUNA LATERAL esquerda,
// flutuando sobre o creme vazio ao lado da figura. Nada rouba altura
// do frontispício.
//
// O globo é carregado via React.lazy DE PROPÓSITO: react-globe.gl +
// three-globe pesam ~601 KB raw (193 KB gzip) e o app não tem nenhum
// outro lazy-loading — sem esta fronteira, o stack Three entraria no
// bundle que TODA página da plataforma baixa. Com ela, só quem abre
// /alexandria/atlas paga o chunk. Veto limpo = npm uninstall + revert
// deste arquivo.

import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { AlexandriaShell } from '@/components/alexandria/shell/AlexandriaShell';
import { A, A2, AT, AS, AE } from '@/design/alexandria-tokens';
import { carregarMundo, nomePaisPt, type MundoAtlas } from '@/lib/atlas/worldApi';
import type { FiltroFonte, ModoCor } from '@/lib/atlas/atlasDerivacoes';
import { AtlasControles } from '@/components/alexandria/atlas/AtlasControles';
import { ComparadorPaises } from '@/components/alexandria/atlas/ComparadorPaises';
import {
  CONTEXTO_SUBMERCADO,
  COR_SUBMERCADO,
  useSubmercados,
} from '@/components/alexandria/atlas/CamadaBrasil';

const AtlasGlobo = lazy(() => import('@/components/alexandria/atlas/AtlasGlobo'));

// Duração do zoom entre a página e o modo imersivo. Vive AQUI (e vai
// por prop) porque importar do AtlasGlobo puxaria o chunk lazy para o
// bundle de entrada. A mesma constante rege o palco, a figura e a
// altitude da câmera — as três precisam ser solidárias.
const MODO_MS = 900;

interface LegendaAtlas {
  fronteiras: number;
  comPerfil: number;
  semDado: number;
  perfisSemGeometria: number;
  ano: string;
}

/** Tudo derivado da junção real — nenhuma contagem digitada. Se o
 *  catálogo do backend crescer, a legenda acompanha. */
function derivarLegenda(mundo: MundoAtlas): LegendaAtlas {
  const comPerfil = mundo.features.filter(
    (f) => f.properties.a3 !== null && mundo.porIso.has(f.properties.a3),
  ).length;
  return {
    fronteiras: mundo.features.length,
    comPerfil,
    semDado: mundo.features.length - comPerfil,
    perfisSemGeometria: mundo.porIso.size - comPerfil,
    ano: mundo.meta.year ?? '—',
  };
}

function LinhaLegenda({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: AS.md,
        borderBottom: `1px solid ${A2.fioClaroSobreCreme}`,
        padding: `${AS.xs} 0`,
      }}
    >
      <span style={{ ...AT.rotulo, fontSize: '8px', letterSpacing: '0.13em', color: A2.tintaMetadado }}>
        {rotulo}
      </span>
      <span style={{ ...AT.dado, fontSize: '13px', color: A.tintaSobreCreme }}>{valor}</span>
    </div>
  );
}

interface Ret {
  top: number;
  left: number;
  w: number;
  h: number;
}

export function AtlasStub() {
  const [legenda, setLegenda] = useState<LegendaAtlas | null>(null);
  // O mundo já carregado, para os controles derivarem sem refazer
  // busca — `carregarMundo` tem cache de módulo, então é a MESMA
  // promise que o globo consome.
  const [mundo, setMundo] = useState<MundoAtlas | null>(null);
  // Estado analítico (Wave 35): quem decide é aqui, o globo só desenha.
  const [modoCor, setModoCor] = useState<ModoCor>('nenhum');
  const [filtro, setFiltro] = useState<FiltroFonte>(null);
  const [pedidoDeVoo, setPedidoDeVoo] = useState<{ iso: string; nonce: number } | null>(null);
  // Comparação: o país "selecionado" vem do MESMO caminho de sempre
  // (clique no globo, busca, ranking) — o comparador só acumula uma
  // lista curta a partir dele, sem inventar segundo mecanismo.
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [comparados, setComparados] = useState<string[]>([]);
  // ── Camada Brasil (Wave 36) ──────────────────────────────────────
  // Abre quando o voo até o Brasil pousa — dentro do movimento que já
  // existe, não numa navegação nova.
  const [camadaBrasil, setCamadaBrasil] = useState(false);
  const [submercadoAberto, setSubmercadoAberto] = useState<string | null>(null);
  const submercados = useSubmercados(camadaBrasil);

  /** Nome em pt-BR pelo ISO — mesma função do tooltip e do perfil,
   *  para o comparador não dizer "United States" ao lado de um
   *  perfil que diz "Estados Unidos". */
  const nomeDe = useCallback(
    (iso: string, nomeDoBackend: string) => {
      const f = mundo?.features.find((x) => x.properties.a3 === iso);
      return f ? nomePaisPt(f.properties, nomeDoBackend) : nomeDoBackend;
    },
    [mundo],
  );

  const adicionarAComparacao = useCallback((iso: string) => {
    setComparados((atual) =>
      atual.includes(iso) || atual.length >= 3 ? atual : [...atual, iso],
    );
  }, []);
  const colunaRef = useRef<HTMLDivElement | null>(null);
  const painelRef = useRef<HTMLDivElement | null>(null);
  // O painel analítico entra por fade DEPOIS que o zoom para o modo
  // imersivo assenta — aparecer no meio do movimento faria o mesmo
  // "pisca" que a Wave 36 veio corrigir.
  const [painelVisivel, setPainelVisivel] = useState(false);
  // Instrumentos (coloração, filtro, rankings, comparação) — presentes
  // SEMPRE que o globo está na tela, nos dois modos.
  //
  // O primeiro corte da Wave 36 os montava só no imersivo, seguindo o
  // brief ao pé da letra. Vetado no uso real: quem observa o globo
  // espera o instrumento à mão. Recolhido é aceitável; ausente, não.
  //
  // Nasce RECOLHIDO na página (o frontispício é o assunto ali) e ABERTO
  // no imersivo. Recolhido não é o defeito que a Fase 2 consertou: lá o
  // painel ficava invisível E alcançável; aqui a barra é visível, e o
  // conteúdo recolhido sai do DOM.
  const [instrumentosAbertos, setInstrumentosAbertos] = useState(false);
  const espacadorRef = useRef<HTMLDivElement | null>(null);
  // Modo imersivo (revisão 3): o palco vira overlay FIXO por cima de
  // header e rodapé — o shell nem é tocado; ao sair, tudo volta. O
  // globo continua montado no mesmo nó, então nada recarrega.
  const [imersivo, setImersivo] = useState(false);
  // Retângulo do palco quando ele está FIXO (durante a animação e no
  // imersivo). null = palco no fluxo, dentro do espaçador.
  const [retFixo, setRetFixo] = useState<Ret | null>(null);
  const [animandoModo, setAnimandoModo] = useState(false);
  const [dimPagina, setDimPagina] = useState<Ret | null>(null);
  const [dimJanela, setDimJanela] = useState({ w: 0, h: 0 });
  const [larguraMain, setLarguraMain] = useState<number | null>(null);
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Geometria do palco no modo página (o espaçador reserva o lugar no
  // fluxo, mesmo quando o palco está fixo) e da janela.
  useEffect(() => {
    const el = espacadorRef.current;
    if (!el) return;
    const main = el.closest('main');
    const medir = () => {
      const r = el.getBoundingClientRect();
      setDimPagina({ top: r.top, left: r.left, w: r.width, h: r.height });
      setDimJanela({ w: window.innerWidth, h: window.innerHeight });
      if (main) setLarguraMain(main.clientWidth);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    if (main) ro.observe(main);
    main?.addEventListener('scroll', medir, { passive: true });
    window.addEventListener('resize', medir);
    return () => {
      ro.disconnect();
      main?.removeEventListener('scroll', medir);
      window.removeEventListener('resize', medir);
    };
  }, []);

  // ── Zoom entre os modos (revisão 5) ───────────────────────────────
  // `fixed` ↔ `relative` não é animável, então a troca acontece em três
  // tempos: o palco vira FIXO no retângulo que já ocupa (invisível),
  // no frame seguinte anima para o retângulo de destino, e ao chegar
  // volta ao fluxo se o destino era a página. Enquanto isso a figura e
  // a altitude da câmera animam na mesma curva e duração — o globo
  // cresce nas mãos que crescem junto, em vez de piscar.
  const trocarModo = useCallback((paraImersivo: boolean) => {
    const el = espacadorRef.current;
    if (!el) return;
    if (temporizadorRef.current) clearTimeout(temporizadorRef.current);

    const rEsp = el.getBoundingClientRect();
    const retPagina: Ret = { top: rEsp.top, left: rEsp.left, w: rEsp.width, h: rEsp.height };
    const retJanela: Ret = { top: 0, left: 0, w: window.innerWidth, h: window.innerHeight };

    // 1. fixa o palco no retângulo que JÁ ocupa, sem trocar de modo:
    //    mesmo pixel na tela, nada anima, nada salta.
    setRetFixo(paraImersivo ? retPagina : retJanela);

    // 2. no frame seguinte, TUDO muda no mesmo commit e com as
    //    transições acesas — modo (que redefine a figura e a posição
    //    do canvas), retângulo do palco e, no effect do globo, a
    //    altitude. Um movimento só. Trocar o modo junto com o retângulo
    //    é o que faltava: antes a figura saltava 667→1150 no frame em
    //    que o modo mudava, porque as transições só acendiam depois.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimandoModo(true);
        setImersivo(paraImersivo);
        setRetFixo(paraImersivo ? retJanela : retPagina);
      });
    });

    // 3. ao chegar, a página volta ao fluxo (coordenadas idênticas)
    temporizadorRef.current = setTimeout(() => {
      setAnimandoModo(false);
      if (!paraImersivo) setRetFixo(null);
    }, MODO_MS + 80);
  }, []);

  useEffect(() => () => {
    if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
  }, []);

  const entrarImersivo = useCallback(() => trocarModo(true), [trocarModo]);
  const sairImersivo = useCallback(() => trocarModo(false), [trocarModo]);

  // Fade do painel analítico, atrás do zoom: some no mesmo instante em
  // que a saída começa (nada de painel flutuando sobre a transição) e
  // entra só quando o modo imersivo assentou.
  useEffect(() => {
    if (!imersivo) { setPainelVisivel(false); return; }
    const t = setTimeout(() => setPainelVisivel(true), MODO_MS + 60);
    return () => clearTimeout(t);
  }, [imersivo]);

  // Entrar no imersivo abre os instrumentos; sair recolhe. É sugestão de
  // estado inicial por modo, não trava — o usuário recolhe e expande
  // quando quiser, e a barra continua na tela nos dois casos.
  useEffect(() => { setInstrumentosAbertos(imersivo); }, [imersivo]);

  // Mesma promise cacheada que o globo consome — zero busca duplicada.
  useEffect(() => {
    let vivo = true;
    carregarMundo()
      .then((m) => { if (vivo) { setLegenda(derivarLegenda(m)); setMundo(m); } })
      .catch(() => { /* o globo declara o erro; a legenda só se omite */ });
    return () => { vivo = false; };
  }, []);

  // Zoom-in esmaece a página inteira (segunda revisão pós-Wave 28,
  // pedido do Aquiles): o globo dirige a opacidade da coluna lateral
  // pela mesma curva do frontispício — no mergulho só restam globo,
  // header e rodapé. Style direto no DOM, zero re-render por frame.
  const aoMudarOpacidadeAmbiente = useCallback((o: number) => {
    const coluna = colunaRef.current;
    if (!coluna) return;
    coluna.style.opacity = o.toFixed(3);
    // ── Wave 36: esmaecer NÃO bastava ────────────────────────────────
    // Medido: com `opacity: 0` a coluna continuava `visibility:
    // visible`, `pointerEvents: auto` e com 26 botões focáveis por Tab.
    // Os controles ficavam invisíveis mas plenamente alcançáveis — um
    // Tab ou clique acidental trocava a coloração do globo sem NENHUMA
    // causa visível na tela, que é o que se lia como "a cor muda
    // sozinha / não aparece de forma confiável".
    //
    // `inert` tira o bloco da ordem de foco E do hit-testing de uma vez
    // (é o mecanismo padrão para isto); visibility/pointerEvents ficam
    // como reforço explícito. Só some de verdade quando já está
    // praticamente invisível, para o fade continuar suave.
    const oculto = o < 0.05;
    coluna.inert = oculto;
    coluna.style.visibility = oculto ? 'hidden' : 'visible';
    coluna.style.pointerEvents = oculto ? 'none' : 'auto';
  }, []);

  // ── Instrumentos do atlas — UM bloco, montado em dois lugares ────
  //    Coloração, filtro, rankings, comparação e (quando o foco está no
  //    Brasil) os quatro submercados do SIN. Recolhível: na página nasce
  //    fechado, no imersivo aberto, e a barra fica na tela nos dois
  //    casos. Recolhido tira o conteúdo do DOM — não repete o defeito de
  //    painel invisível porém alcançável que a Fase 2 consertou.
  const blocoInstrumentos = mundo === null ? null : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: A2.cremeSuperficie,
        border: `1px solid ${A.fioSobreCreme}`,
        pointerEvents: 'auto',
      }}
    >
      <button
        type="button"
        onClick={() => setInstrumentosAbertos((v) => !v)}
        aria-expanded={instrumentosAbertos}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: AS.sm,
          width: '100%',
          padding: `${AS.sm} ${AS.md}`,
          background: 'none',
          border: 'none',
          borderBottom: instrumentosAbertos ? `1px solid ${A.fioSobreCreme}` : 'none',
          borderRadius: 0,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ ...AT.rotulo, fontSize: '8px', letterSpacing: '0.13em', color: A.terracota }}>
          {camadaBrasil ? 'Brasil e instrumentos' : 'Instrumentos do atlas'}
        </span>
        <span aria-hidden="true" style={{ ...AT.dado, fontSize: '12px', color: A2.tintaMetadado }}>
          {instrumentosAbertos ? '–' : '+'}
        </span>
      </button>

      {instrumentosAbertos && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: AS.lg,
            padding: AS.md,
            maxHeight: '62vh',
            overflowY: 'auto',
          }}
        >
          {/* Camada Brasil primeiro quando o foco está nela: e a
              sub-superficie ativa, e o instrumento do mundo continua
              logo abaixo em vez de sumir. */}
          {camadaBrasil && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: AS.md,
                borderBottom: `1px solid ${A.fioSobreCreme}`,
                paddingBottom: AS.md,
              }}
            >
            <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xs }}>
              <span style={{ ...AT.rotulo, fontSize: '8px', letterSpacing: '0.13em', color: A.terracota }}>
                Brasil · Sistema Interligado Nacional
              </span>
              <span style={{ ...AT.dado, fontSize: '11px', lineHeight: 1.5, color: A.tintaSuave }}>
                Quatro submercados. Clique em cada um no globo ou na
                lista para ler o que caracteriza a região.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {['sudesteCentroOeste', 'sul', 'nordeste', 'norte'].map((id) => {
                const f = submercados?.find((x) => x.properties.id === id);
                const ctx = CONTEXTO_SUBMERCADO[id];
                const aberto = submercadoAberto === id;
                return (
                  <div key={id}>
                    <button
                      type="button"
                      onClick={() => setSubmercadoAberto(aberto ? null : id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: AS.sm,
                        width: '100%',
                        padding: `${AS.xs} 0`,
                        background: 'none',
                        border: 'none',
                        borderBottom: aberto ? `1px solid ${A.terracota}` : `1px solid ${A2.fioClaroSobreCreme}`,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      aria-expanded={aberto}
                    >
                      <span
                        aria-hidden="true"
                        style={{ width: '10px', height: '10px', background: COR_SUBMERCADO[id], flex: 'none' }}
                      />
                      <span style={{ ...AT.dado, fontSize: '12px', flex: 1, color: A.tintaSobreCreme }}>
                        {f?.properties.nome ?? id}
                      </span>
                      <span style={{ ...AT.rotulo, fontSize: '8px', color: A2.tintaMetadado }}>
                        {f?.properties.sigla ?? ''}
                      </span>
                    </button>
                    {aberto && ctx && (
                      <div style={{ padding: `${AS.sm} 0 ${AS.md} ${AS.md}`, display: 'flex', flexDirection: 'column', gap: AS.sm }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ ...AT.rotulo, fontSize: '8px', color: A2.tintaMetadado }}>Característica</span>
                          <span style={{ ...AT.dado, fontSize: '11px', lineHeight: 1.5, color: A.tintaSobreCreme }}>
                            {ctx.caracteristica}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ ...AT.rotulo, fontSize: '8px', color: A2.tintaMetadado }}>Papel no sistema</span>
                          <span style={{ ...AT.dado, fontSize: '11px', lineHeight: 1.5, color: A.tintaSobreCreme }}>
                            {ctx.papel}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Roraima: no contorno, sem submercado. Declarado, não
                escondido — o `ufsIbge` do GeoJSON confirma a ausência. */}
            <span style={{ ...AT.dado, fontSize: '10px', lineHeight: 1.5, color: A2.tintaMetadado }}>
              Roraima aparece no contorno e não recebe submercado: a
              definição CCEE documentada não a atribui a nenhum dos
              quatro.
            </span>

            {/* A pendência nomeada, não escondida. */}
            <div
              style={{
                border: `1px dashed ${A.terracota}`,
                padding: `${AS.xs} ${AS.sm}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ ...AT.rotulo, fontSize: '8px', color: A.terracota }}>Sem dado por submercado</span>
              <span style={{ ...AT.dado, fontSize: '10px', lineHeight: 1.5, color: A.tintaSuave }}>
                Não há matriz, preço ou intercâmbio por submercado nesta
                camada — a fonte atual traz esses números só em nível
                nacional. Geometria e contexto são reais; nenhum
                percentual foi estimado.
              </span>
            </div>

            <button
              type="button"
              onClick={() => { setCamadaBrasil(false); setSubmercadoAberto(null); }}
              style={{
                alignSelf: 'flex-start',
                background: 'none',
                border: `1px solid ${A.fioSobreCreme}`,
                borderRadius: 0,
                padding: `${AS.xs} ${AS.md}`,
                cursor: 'pointer',
                ...AT.rotulo,
                fontSize: '9px',
                color: A.tintaSobreCreme,
              }}
            >
              ← Voltar ao globo mundial
            </button>
            </div>
          )}

            {/* Painel analítico (Wave 35) — coloração, filtro e rankings,
                todos derivados dos 12 campos já ingeridos. */}
            {mundo !== null && (
              <AtlasControles
                mundo={mundo}
                modoCor={modoCor}
                aoMudarModoCor={setModoCor}
                filtro={filtro}
                aoMudarFiltro={setFiltro}
                aoEscolherPais={(iso) => setPedidoDeVoo({ iso, nonce: Date.now() })}
              />
            )}

            {/* Comparação: acumula a partir do país selecionado — o
                mesmo que o clique no globo, a busca e o ranking já
                produzem. Nunca uma segunda mecânica de seleção. */}
            {mundo !== null && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: AS.sm,
                  borderTop: `1px solid ${A.fioSobreCreme}`,
                  paddingTop: AS.sm,
                  pointerEvents: 'auto',
                }}
              >
                <span style={{ ...AT.rotulo, fontSize: '8px', letterSpacing: '0.13em', color: A2.tintaMetadado }}>
                  Comparar países
                </span>

                <button
                  type="button"
                  disabled={selecionado === null || comparados.includes(selecionado) || comparados.length >= 3}
                  onClick={() => selecionado && adicionarAComparacao(selecionado)}
                  style={{
                    background: 'none',
                    border: `1px solid ${selecionado && !comparados.includes(selecionado) && comparados.length < 3 ? A.fioSobreCreme : A2.fioClaroSobreCreme}`,
                    borderRadius: 0,
                    padding: `${AS.xs} ${AS.sm}`,
                    cursor: selecionado && !comparados.includes(selecionado) && comparados.length < 3 ? 'pointer' : 'default',
                    textAlign: 'left',
                    ...AT.dado,
                    fontSize: '11px',
                    color: selecionado && !comparados.includes(selecionado) && comparados.length < 3 ? A.tintaSobreCreme : A2.tintaMetadado,
                  }}
                >
                  {selecionado === null
                    ? 'Clique num país para selecioná-lo'
                    : comparados.includes(selecionado)
                      ? `${nomeDe(selecionado, mundo.porIso.get(selecionado)?.countryName ?? selecionado)} já está na comparação`
                      : comparados.length >= 3
                        ? 'Máximo de três países'
                        : `+ Comparar ${nomeDe(selecionado, mundo.porIso.get(selecionado)?.countryName ?? selecionado)}`}
                </button>

                {comparados.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {comparados.map((iso) => (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setComparados((a) => a.filter((x) => x !== iso))}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: AS.sm,
                          background: 'none',
                          border: 'none',
                          borderBottom: `1px solid ${A2.fioClaroSobreCreme}`,
                          padding: '2px 0',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ ...AT.dado, fontSize: '11px', color: A.tintaSobreCreme }}>
                          {nomeDe(iso, mundo.porIso.get(iso)?.countryName ?? iso)}
                        </span>
                        <span style={{ ...AT.dado, fontSize: '9px', color: A2.tintaMetadado }}>remover</span>
                      </button>
                    ))}
                    {comparados.length === 1 && (
                      <span style={{ ...AT.dado, fontSize: '9px', color: A2.tintaMetadado }}>
                        Escolha ao menos mais um país para a tabela abrir.
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
        </div>
      )}
    </div>
  );

  return (
    <AlexandriaShell navAtivo="atlas">
      {/* Espaçador: reserva no fluxo a altura do palco da página, para
          nada colapsar quando o palco está fixo (durante o zoom e no
          modo imersivo). É também de onde sai a geometria do modo
          página — medida real, não estimada. */}
      <div
        ref={espacadorRef}
        style={{
          position: 'relative',
          height: 'max(520px, calc(100vh - 118px))',
          // full-bleed pela largura real do <main> (clientWidth exclui
          // a scrollbar — 100vw aqui causaria overflow horizontal)
          width: larguraMain !== null ? `${larguraMain}px` : '100%',
          marginLeft: larguraMain !== null ? `calc((100% - ${larguraMain}px) / 2)` : 0,
        }}
      >
        {/* Palco: no fluxo (absoluto dentro do espaçador) quando em
            repouso na página; FIXO com retângulo animado durante o
            zoom e no imersivo. As quatro coordenadas animam na mesma
            curva e duração da câmera e da figura. */}
        <div
          style={{
            ...(retFixo
              ? {
                  position: 'fixed' as const,
                  top: retFixo.top,
                  left: retFixo.left,
                  width: retFixo.w,
                  height: retFixo.h,
                  zIndex: 60,
                }
              : { position: 'absolute' as const, inset: 0 }),
            background: imersivo ? A.cremePapel : 'transparent',
            overflow: 'hidden',
            transition: animandoModo
              ? `top ${MODO_MS}ms ${AE.easing}, left ${MODO_MS}ms ${AE.easing}, width ${MODO_MS}ms ${AE.easing}, height ${MODO_MS}ms ${AE.easing}, background ${MODO_MS}ms ${AE.easing}`
              : 'none',
          }}
        >
          <Suspense
            fallback={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ ...AT.rotulo, color: A.terracota }}>Montando o globo…</span>
              </div>
            }
          >
            {dimPagina !== null && dimJanela.h > 0 && (
              <AtlasGlobo
                aoMudarOpacidadeAmbiente={aoMudarOpacidadeAmbiente}
                imersivo={imersivo}
                dimPagina={{ w: dimPagina.w, h: dimPagina.h }}
                dimImersivo={dimJanela}
                animandoModo={animandoModo}
                duracaoModo={MODO_MS}
                modoCor={modoCor}
                filtro={filtro}
                pedidoDeVoo={pedidoDeVoo}
                aoSelecionarPais={setSelecionado}
                aoFocarPais={(iso) => {
                  // A camada Brasil acompanha o FOCO da câmera, não a
                  // seleção que chega no pouso: ela abre já durante o
                  // voo até o Brasil e fecha no instante em que o voo
                  // parte para qualquer outro país. Sem isto os quatro
                  // submercados ficavam desenhados sobre o país errado,
                  // e o painel deles não saía mais da tela.
                  const brasil = iso === 'BRA';
                  setCamadaBrasil(brasil);
                  if (!brasil) setSubmercadoAberto(null);
                }}
                submercados={camadaBrasil ? submercados : null}
                aoSelecionarSubmercado={setSubmercadoAberto}
                submercadoAtivo={submercadoAberto}
                aoEntrarImersivo={entrarImersivo}
                aoSairImersivo={sairImersivo}
              />
            )}
          </Suspense>

        {/* Coluna lateral esquerda — masthead, leitura e referências.
            pointerEvents none: o arrasto do globo atravessa o texto.
            A opacidade é dirigida pela câmera do globo (esmaece no
            zoom-in, volta no repouso). */}
        <div
          ref={colunaRef}
          style={{
            position: 'absolute',
            left: AS.xl,
            top: 0,
            width: '248px',
            // Com o painel analítico da Wave 35 a coluna passa da
            // altura do palco (medido: 1571px de conteúdo em 837px de
            // palco). Rola por dentro, e por isso precisa de ponteiro —
            // o cabeçalho abaixo devolve `none` para o arrasto do globo
            // continuar atravessando o texto de leitura.
            maxHeight: '100%',
            overflowY: 'auto',
            paddingRight: AS.sm,
            display: 'flex',
            flexDirection: 'column',
            gap: AS.lg,
            pointerEvents: 'auto',
            transition: `opacity ${AE.estado} ${AE.easing}`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: AS.sm, pointerEvents: 'none' }}>
            <span style={{ ...AT.rotulo, color: A.terracota }}>Atlas</span>
            <h1 style={{ ...AT.h1, fontSize: '26px', lineHeight: 1.25, color: A.tintaSobreCreme, margin: 0 }}>
              Atlas Mundial de Energia
            </h1>
            <p style={{ ...AT.corpo, fontSize: '13px', lineHeight: 1.6, color: A.tintaSuave, margin: 0 }}>
              Cada país soberano com seu perfil elétrico real — matriz de
              geração, participação renovável, intensidade de carbono —
              extraído do Our World in Data, com fonte citada por campo.
              Gire a esfera com o mouse; pare o cursor sobre um país
              para a leitura rápida, e clique para voar até ele.
            </p>
          </div>

          {/* Legenda da prancha — contagens DERIVADAS da junção real. */}
          {legenda !== null && (
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: `1px solid ${A.fioSobreCreme}` }}>
              <LinhaLegenda rotulo="Perfis soberanos" valor={String(legenda.perfisSemGeometria + legenda.comPerfil)} />
              <LinhaLegenda rotulo="Ano de referência" valor={legenda.ano} />
              <LinhaLegenda rotulo="Fronteiras 1:110m" valor={String(legenda.fronteiras)} />
              <LinhaLegenda rotulo="Com perfil no globo" valor={String(legenda.comPerfil)} />
              <LinhaLegenda rotulo="Território sem dado" valor={String(legenda.semDado)} />
              <LinhaLegenda rotulo="Perfil sem geometria" valor={String(legenda.perfisSemGeometria)} />
            </div>
          )}


          <span style={{ ...AT.dado, fontSize: '11px', lineHeight: 1.55, color: A2.tintaMetadado }}>
            Fronteiras: Natural Earth 1:110m (TopoJSON, cópia
            byte-idêntica). Perfis: Our World in Data — Ember, Energy
            Institute, EIA. Território sem perfil declara ausência no
            cursor — nenhum número é inventado. Micro-Estados insulares
            têm perfil mas não têm geometria nesta escala.
          </span>

          {/* A camada Brasil deixou de ser promessa nesta wave — a nota
              "em produção" que vivia aqui virou instrução de uso. */}
          <span style={{ ...AT.dado, fontSize: '11px', lineHeight: 1.55, color: A2.tintaMetadado }}>
            Voar até o Brasil abre os quatro submercados do SIN sobre
            esta mesma esfera, com geometria real e o contexto de cada
            região. Não há número por submercado: a fonte atual só traz
            esses valores em nível nacional.
          </span>

          {/* Instrumentos, no modo página: no fim da introdução, e
              recolhidos — o frontispício é o assunto aqui. No imersivo
              eles migram para o painel flutuante (abaixo). O JSX é o
              mesmo nos dois lugares. */}
          {!imersivo && blocoInstrumentos}
        </div>

        {/* ── Painel analítico — SÓ no modo imersivo (Wave 36) ──────
            Decisão do brief: o modo de repouso mostra o frontispício e
            a introdução, nada de filtro. O instrumento analítico
            pertence ao modo em que a tela é do globo.

            Antes deste ajuste o painel vivia na coluna de introdução —
            visível na página e apenas ESMAECIDO no imersivo, que é o
            inverso do desejado e a origem do defeito consertado na
            Fase 2 (invisível porém alcançável). Agora ele é montado e
            desmontado de verdade: nada de controle fantasma. */}
        {/* Instrumentos, no modo imersivo: painel flutuante à
            esquerda. O perfil de país mora à direita, então este lado é
            o único que não disputa espaço com ele. Mesmo conteúdo que a
            coluna da página monta recolhido — uma variável, dois
            lugares, nunca duas cópias. */}
        {imersivo && (
          <div
            ref={painelRef}
            style={{
              position: 'absolute',
              left: AS.md,
              top: '64px',
              maxHeight: 'calc(100% - 96px)',
              width: '268px',
              overflowY: 'auto',
              pointerEvents: 'auto',
              opacity: painelVisivel ? 1 : 0,
              transition: `opacity ${AE.estado} ${AE.easing}`,
            }}
          >
            {blocoInstrumentos}
          </div>
        )}

        {/* Tabela de comparação: abre com dois países, some ao fechar.
            Fica ancorada na base do palco, fora da coluna estreita —
            três colunas de números não cabem em 248px. */}
        {comparados.length >= 2 && (
          <ComparadorPaises
            isos={comparados}
            nomeDe={nomeDe}
            aoRemover={(iso) => setComparados((a) => a.filter((x) => x !== iso))}
            aoFechar={() => setComparados([])}
          />
        )}
        </div>
      </div>
    </AlexandriaShell>
  );
}

export default AtlasStub;
