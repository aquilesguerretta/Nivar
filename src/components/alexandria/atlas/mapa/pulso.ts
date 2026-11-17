// Atlas da Alexandria v3 — capítulo "Um dia", modo "dia real": cada entidade que o ONS
// despacha pulsa com a geração da hora; nas eólicas e solares, o corte que o ONS estimou
// aparece como halo vazado em volta do disco.
//
// Tudo vem de public/alexandria/atlas/dados/operacao-dias.json (lido por operacao.ts). A camada
// não reparte nem recalcula: desenha a geração de cada entidade (usina com CEG, ou conjunto do
// ONS no centro dos membros que o Atlas posiciona), interpolando entre as horas ao tocar.
//
// Desenho:
//  · disco na cor da fonte, ÁREA proporcional à geração da hora (raio = r0 + k(zoom)·√MW; o r0
//    pequeno garante que a menor desenhada se veja);
//  · halo: anel vazado com a área da geração + corte estimado; o vão entre o disco e o anel é a
//    geração que não se realizou (estimativa do ONS). Na cor da fonte, em fio, nunca vermelho;
//  · piso por zoom: com o Brasil inteiro, só quem gera pelo menos PISO_POR_ZOOM MW (ou tem corte
//    desse tamanho) na hora; aproximando, o piso cai. Quem não gera nada só aparece de perto, como
//    anel mínimo em tinta fraca;
//  · a seleção (e só ela) em óxido; o conjunto selecionado mostra os membros, ligados ao centro.
// Movimento: a troca de hora ou de dia anda em ~0,9 s (setData a no máximo ~20 Hz, só durante a
// transição); movimento reduzido: seco.

import type mapboxgl from 'mapbox-gl';
import type { Feature, FeatureCollection, Geometry, LineString, Point } from 'geojson';
import { ANTES_DOS_ROTULOS, FONTES_DO_MAPA, comAlfa, type PaletaDoMapa } from '@/lib/alexandria/atlas/estilo';
import { carregarUsinasMenores, carregarUsinasPrincipais } from '@/lib/alexandria/atlas/dados';
import {
  cargaDaOperacao,
  chaveDaEntidade,
  corteNaHora,
  diaDe,
  geracaoNaHora,
  horaBr,
  lerChave,
  lerOperacao,
  megawatts,
  membrosDoDia,
  nomeLegivel,
  type DiaDaOperacao,
  type ModeloDaOperacao,
  type MomentoDaOperacao,
} from '@/lib/alexandria/atlas/operacao';
import { CATEGORIAS } from '@/lib/alexandria/atlas/tipos';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';

type Adicionar = (camada: mapboxgl.AnyLayer) => void;
const exp = (e: unknown) => e as mapboxgl.Expression;
const VAZIA: FeatureCollection = { type: 'FeatureCollection', features: [] };

/** Fontes GeoJSON da camada. */
export const FP = { discos: 'atlas-pulso-discos', rotulos: 'atlas-pulso-rotulos', membros: 'atlas-pulso-membros' } as const;

/** De baixo para cima. */
const CAMADAS = ['pulso-membros-raio', 'pulso-corte', 'pulso-disco', 'pulso-fora', 'pulso-membros-ponto', 'pulso-sel', 'pulso-fora-sel', 'pulso-rotulo', 'pulso-fora-rotulo'] as const;
/** Clique e pairar: o disco, depois o halo (a entidade toda em corte não tem disco). */
const ALVOS = ['pulso-disco', 'pulso-fora', 'pulso-corte'] as const;

/** Piso de desenho por zoom (MW na hora): [a partir do zoom, piso]. Escrito no "Como ler". */
export const PISO_POR_ZOOM: readonly (readonly [number, number])[] = [
  [0, 150],
  [2.6, 60],
  [4.2, 20],
  [5.2, 5],
  [6.2, 1],
  [7.4, 0],
];
export const pisoNoZoom = (z: number): number => {
  let p = PISO_POR_ZOOM[0][1];
  for (const [zz, v] of PISO_POR_ZOOM) if (z >= zz) p = v;
  return p;
};

/** Raio do disco: r0 + k(zoom)·√MW (px). k por zoom; entre as paradas, interpolação exponencial. */
const R0 = 1.2;
const K_POR_ZOOM: readonly [number, number][] = [
  [1.5, 0.07],
  [2.5, 0.12],
  [3, 0.17],
  [4, 0.24],
  [5, 0.36],
  [6, 0.55],
  [8, 1.05],
  [11, 2.6],
];
/** O zoom só vale no topo da expressão: cada parada traz a conta inteira (com a folga `extra` e,
 *  se `parada`, o anel mínimo de quem não gera). */
const raio = (campo: unknown, extra = 0, parada = false) =>
  exp([
    'interpolate',
    ['exponential', 1.5],
    ['zoom'],
    ...K_POR_ZOOM.flatMap(([z, k]) => {
      const r = ['+', R0 + extra, ['*', k, ['sqrt', ['max', 0, campo]]]];
      return [z, parada ? ['case', ['<', campo, 0.5], 2.2, r] : r];
    }),
  ]);

/** Duração da troca de hora (ms) e intervalo mínimo entre duas atualizações (~20 Hz). */
const DURACAO = { passo: 900, salto: 450 } as const;
const PASSO_MS = 50;
const suave = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, t)));

export interface OpcoesDaCamadaDoPulso {
  reduzido: () => boolean;
  aoChegar: () => void;
  aoFalhar: (mensagem: string) => void;
}

export class CamadaDoPulso {
  private readonly mapa: mapboxgl.Map;
  private readonly opcoes: OpcoesDaCamadaDoPulso;
  private bruto: unknown = null;
  private m: ModeloDaOperacao | null = null;
  private pedido = false;
  private falhou = false;
  private destruida = false;
  private ligada = false;
  private momento: MomentoDaOperacao | null = null;
  private selecionado: string | null = null;
  private piso = pisoNoZoom(0);
  /** o setor paraguaio de Itaipu e a entidade brasileira no mesmo ponto (para o deslocamento) */
  private fora: { i: number; par: number | null } | null = null;

  /** geração e corte desenhados agora, de onde a transição sai e para onde vai (por entidade) */
  private deG = new Float64Array(0);
  private deC = new Float64Array(0);
  private paraG = new Float64Array(0);
  private paraC = new Float64Array(0);
  private agoraG = new Float64Array(0);
  private agoraC = new Float64Array(0);
  private tInicio = 0;
  private duracao = 0;
  private quadro = 0;
  private ultimoPasso = 0;

  /** posições dos membros dos conjuntos (CEG → ponto), lidas das usinas do Atlas quando um conjunto é selecionado */
  private membros = new Map<string, [number, number]>();
  private membrosPedidos = { principais: false, menores: false };

  /** ms de cada atualização (conta + setData), as últimas 240: para a medida de custo */
  readonly custos: number[] = [];
  atualizacoes = 0;

  constructor(mapa: mapboxgl.Map, opcoes: OpcoesDaCamadaDoPulso) {
    this.mapa = mapa;
    this.opcoes = opcoes;
    mapa.on('zoom', this.aoMudarZoom);
    document.addEventListener('visibilitychange', this.aoMudarVisibilidade);
  }

  // ── montagem ──

  montar(add: Adicionar, p: PaletaDoMapa, modo: ModoV3): void {
    const m = this.mapa;
    this.piso = pisoNoZoom(m.getZoom());
    if (!m.getSource(FP.discos)) m.addSource(FP.discos, { type: 'geojson', data: this.dadosDosDiscos() });
    if (!m.getSource(FP.rotulos)) m.addSource(FP.rotulos, { type: 'geojson', data: VAZIA });
    if (!m.getSource(FP.membros)) m.addSource(FP.membros, { type: 'geojson', data: VAZIA });
    const vis = this.ligada ? 'visible' : 'none';
    const corDaFonte = exp(['match', ['get', 'cat'], ...CATEGORIAS.flatMap((c) => [c, p.categoria[c]]), p.categoria.outros]);
    const filtro = this.filtroDoPiso();

    // os membros do conjunto selecionado: raios finos do centro a cada usina
    add({
      id: 'pulso-membros-raio',
      type: 'line',
      source: FP.membros,
      filter: exp(['==', ['geometry-type'], 'LineString']),
      layout: { visibility: vis, 'line-cap': 'round' },
      paint: { 'line-color': p.oxido, 'line-width': 0.8, 'line-opacity': 0.55 },
    });
    // o halo do corte: a área da geração + o corte estimado, em fio e véu da cor da fonte
    add({
      id: 'pulso-corte',
      type: 'circle',
      source: FP.discos,
      filter: exp(['all', filtro, ['>', ['get', 'c'], 0.5]]),
      layout: { visibility: vis, 'circle-sort-key': exp(['-', 0, ['get', 'gc']]) },
      paint: {
        'circle-radius': raio(['get', 'gc']),
        'circle-color': exp(['match', ['get', 'cat'], ...CATEGORIAS.flatMap((c) => [c, comAlfa(p.categoria[c], modo === 'noturno' ? 0.16 : 0.12)]), comAlfa(p.categoria.outros, 0.12)]),
        'circle-stroke-color': corDaFonte,
        'circle-stroke-width': 1.1,
        'circle-stroke-opacity': 0.95,
        'circle-pitch-alignment': 'map',
      },
    });
    add({
      id: 'pulso-disco',
      type: 'circle',
      source: FP.discos,
      filter: filtro,
      // a maior embaixo; a parada (anel mínimo) embaixo de todas, para não roubar o toque
      layout: { visibility: vis, 'circle-sort-key': exp(['case', ['<', ['get', 'g'], 0.5], -1e9, ['-', 0, ['get', 'g']]]) },
      paint: {
        // parada (não gera na hora): anel mínimo em tinta fraca, só de perto (o piso decide)
        'circle-radius': raio(['get', 'g'], 0, true),
        'circle-color': exp(['case', ['<', ['get', 'g'], 0.5], comAlfa(p.papel, 0), corDaFonte]),
        'circle-opacity': modo === 'noturno' ? 0.9 : 0.86,
        'circle-stroke-color': exp(['case', ['<', ['get', 'g'], 0.5], p.tintaFraca, p.papel]),
        'circle-stroke-width': exp(['case', ['<', ['get', 'g'], 0.5], 1, 0.7]),
        'circle-stroke-opacity': 0.9,
        'circle-pitch-alignment': 'map',
      },
    });
    add({
      id: 'pulso-membros-ponto',
      type: 'circle',
      source: FP.membros,
      filter: exp(['==', ['geometry-type'], 'Point']),
      layout: { visibility: vis },
      paint: {
        'circle-radius': exp(['interpolate', ['linear'], ['zoom'], 4, 1.8, 8, 3.2]),
        'circle-color': corDaFonte,
        'circle-stroke-color': p.oxido,
        'circle-stroke-width': 1,
        'circle-pitch-alignment': 'map',
      },
    });
    // a seleção: anel em óxido por fora do maior dos dois (disco ou halo)
    add({
      id: 'pulso-sel',
      type: 'circle',
      source: FP.discos,
      filter: exp(['all', ['==', ['get', 'sel'], 1], ['!=', ['get', 'fora'], 1]]),
      layout: { visibility: vis },
      paint: {
        'circle-radius': raio(['get', 'gc'], 3),
        'circle-color': comAlfa(p.oxido, 0),
        'circle-stroke-color': p.oxido,
        'circle-stroke-width': 1.8,
        'circle-pitch-alignment': 'map',
      },
    });
    // o setor paraguaio de Itaipu (50 Hz): mesmo ponto da usina, desenhado ao lado do setor
    // brasileiro (deslocamento em px, a oeste, do tamanho dos dois raios), em véu e fio: não é
    // geração do Brasil. O deslocamento é pictórico, não geografia; o "Como ler" diz.
    const translado = this.transladoDoFora() as unknown as [number, number];
    add({
      id: 'pulso-fora',
      type: 'circle',
      source: FP.discos,
      filter: exp(['all', ['==', ['get', 'fora'], 1], ['>=', ['get', 'g'], 0.5]]),
      layout: { visibility: vis },
      paint: {
        'circle-radius': raio(['get', 'g']),
        'circle-color': exp(['match', ['get', 'cat'], ...CATEGORIAS.flatMap((c) => [c, comAlfa(p.categoria[c], 0.28)]), comAlfa(p.categoria.outros, 0.28)]),
        'circle-stroke-color': corDaFonte,
        'circle-stroke-width': 1.1,
        'circle-translate': translado,
        'circle-pitch-alignment': 'map',
      },
    });
    add({
      id: 'pulso-fora-sel',
      type: 'circle',
      source: FP.discos,
      filter: exp(['all', ['==', ['get', 'sel'], 1], ['==', ['get', 'fora'], 1]]),
      layout: { visibility: vis },
      paint: {
        'circle-radius': raio(['get', 'g'], 3),
        'circle-color': comAlfa(p.oxido, 0),
        'circle-stroke-color': p.oxido,
        'circle-stroke-width': 1.8,
        'circle-translate': translado,
        'circle-pitch-alignment': 'map',
      },
    });
    // rótulos das maiores, só de perto; o número é o da hora (do arquivo)
    add({
      id: 'pulso-rotulo',
      type: 'symbol',
      source: FP.rotulos,
      minzoom: 5,
      layout: {
        visibility: vis,
        'text-field': exp(['format', ['get', 'nome'], { 'font-scale': 1 }, '\n', {}, ['get', 'valor'], { 'font-scale': 0.92, 'text-font': ['literal', FONTES_DO_MAPA.DADO] }]),
        'text-font': exp(['literal', FONTES_DO_MAPA.OBRA]),
        'text-size': exp(['interpolate', ['linear'], ['zoom'], 4.6, 10.5, 8, 12]),
        'text-anchor': 'left',
        'text-justify': 'left',
        // o rótulo sai da borda do halo: o raio da parada de zoom dividido pelo corpo do texto
        'text-radial-offset': exp([
          'interpolate',
          ['exponential', 1.5],
          ['zoom'],
          ...K_POR_ZOOM.filter(([z]) => z >= 4).flatMap(([z, k]) => [z, ['/', ['+', R0 + 3, ['*', k, ['sqrt', ['max', 0, ['get', 'gc']]]]], Math.min(12, 10.5 + Math.max(0, z - 4.6) * (1.5 / 3.4))]]),
        ]),
        'text-variable-anchor': ['left', 'right', 'top', 'bottom'],
        'text-padding': 4,
        'text-optional': true,
        'symbol-sort-key': exp(['-', 0, ['get', 'g']]),
      },
      paint: { 'text-color': p.tinta, 'text-halo-color': p.papel, 'text-halo-width': 1.4, 'text-opacity': 0.92 },
      filter: exp(['!=', ['get', 'fora'], 1]),
    });
    add({
      id: 'pulso-fora-rotulo',
      type: 'symbol',
      source: FP.rotulos,
      minzoom: 5,
      filter: exp(['==', ['get', 'fora'], 1]),
      layout: {
        visibility: vis,
        'text-field': exp(['format', ['get', 'nome'], { 'font-scale': 1 }, '\n', {}, ['get', 'valor'], { 'font-scale': 0.92, 'text-font': ['literal', FONTES_DO_MAPA.DADO] }]),
        'text-font': exp(['literal', FONTES_DO_MAPA.OBRA]),
        'text-size': exp(['interpolate', ['linear'], ['zoom'], 4.6, 10.5, 8, 12]),
        'text-anchor': 'top',
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': p.tintaSuave,
        'text-halo-color': p.papel,
        'text-halo-width': 1.4,
        'text-translate': this.transladoDoFora(true) as unknown as [number, number],
      },
    });
    this.empurrar(true);
  }

  /** O deslocamento do setor paraguaio de Itaipu: a soma dos dois raios + 2 px, a oeste, por
   *  parada de zoom (o raio é interpolado igual). Com `rotulo`, o ponto embaixo do disco. */
  private transladoDoFora(rotulo = false): mapboxgl.Expression {
    const fora = this.fora;
    const g = fora ? this.agoraG[fora.i] : 0;
    const par = fora && fora.par != null ? this.agoraG[fora.par] + this.agoraC[fora.par] : 0;
    return exp([
      'interpolate',
      ['exponential', 1.5],
      ['zoom'],
      ...K_POR_ZOOM.flatMap(([z, k]) => {
        const r = R0 + k * Math.sqrt(Math.max(0, g));
        const dx = -(r + (R0 + k * Math.sqrt(Math.max(0, par))) + 2);
        return [z, ['literal', rotulo ? [dx, r + 3] : [dx, 0]]];
      }),
    ]);
  }

  private atualizarTranslado() {
    const m = this.mapa;
    if (!this.fora) return;
    const t = this.transladoDoFora();
    for (const id of ['pulso-fora', 'pulso-fora-sel']) if (m.getLayer(id)) m.setPaintProperty(id, 'circle-translate', t);
    if (m.getLayer('pulso-fora-rotulo')) m.setPaintProperty('pulso-fora-rotulo', 'text-translate', this.transladoDoFora(true));
  }

  ordenar(): void {
    const m = this.mapa;
    if (!m.getLayer(ANTES_DOS_ROTULOS)) return;
    for (const id of CAMADAS) if (m.getLayer(id)) m.moveLayer(id, ANTES_DOS_ROTULOS);
  }

  alvos(): string[] {
    return ALVOS.filter((id) => this.mapa.getLayer(id));
  }

  // ── estado ──

  aplicar(ligada: boolean, momento: MomentoDaOperacao | null, selecionado: string | null): void {
    if (this.destruida) return;
    if (ligada && !this.ligada && this.falhou) this.falhou = false;
    if (ligada) this.garantir();
    const mudouVisivel = ligada !== this.ligada;
    const mudouMomento = !mesmoMomento(momento, this.momento);
    const mudouSelecao = selecionado !== this.selecionado;
    this.ligada = ligada;
    const anterior = this.momento;
    this.momento = momento;
    this.selecionado = selecionado;
    if (mudouVisivel) for (const id of CAMADAS) if (this.mapa.getLayer(id)) this.mapa.setLayoutProperty(id, 'visibility', ligada ? 'visible' : 'none');
    if (!this.m) return;
    if (mudouMomento || mudouVisivel) this.irPara(momento, anterior, mudouVisivel);
    else if (mudouSelecao) this.empurrar(true);
    if (mudouSelecao || momento?.dia !== anterior?.dia) this.atualizarMembros();
  }

  descrever(f: mapboxgl.MapboxGeoJSONFeature): { chave: string; titulo: string; linha: string } | null {
    const pr = f.properties as Record<string, unknown> | null;
    if (!pr || typeof pr.chave !== 'string') return null;
    const i = Number(pr.i);
    const e = this.m?.entidades[i];
    const d = this.diaAtual();
    if (!e || !d || !this.momento) return { chave: pr.chave, titulo: String(pr.nome ?? ''), linha: '' };
    const h = Math.round(this.momento.hora);
    const g = geracaoNaHora(d, i, h);
    const c = corteNaHora(d, i, h);
    const partes = [`${megawatts(g)} às ${horaBr(h)}`];
    if (c >= 0.5) partes.push(`corte estimado ${megawatts(c)}`);
    if (e.foraDoBrasil) partes.push('setor paraguaio');
    return { chave: pr.chave, titulo: nomeLegivel(e.nome), linha: partes.join(' · ') };
  }

  geometria(chave: string): Geometry | null {
    const alvo = lerChave(chave);
    const e = alvo?.tipo === 'entidade' ? this.m?.porId.get(alvo.id) : null;
    if (!e?.lonlat) return null;
    // o conjunto enquadra os membros quando eles se espalham; senão, o ponto (o controle voa)
    if (e.tipo === 'conjunto') {
      const pts = membrosDoDia(this.diaAtual(), e)
        .membros.map((c) => this.membros.get(c)).filter((x): x is [number, number] => !!x);
      if (pts.length >= 2) {
        const lons = pts.map((x) => x[0]);
        const lats = pts.map((x) => x[1]);
        const vao = Math.max(Math.max(...lons) - Math.min(...lons), Math.max(...lats) - Math.min(...lats));
        if (vao > 0.08) return { type: 'MultiPoint', coordinates: [e.lonlat, ...pts] };
      }
    }
    return { type: 'Point', coordinates: e.lonlat };
  }

  destruir(): void {
    this.destruida = true;
    if (this.quadro) cancelAnimationFrame(this.quadro);
    this.quadro = 0;
    this.mapa.off('zoom', this.aoMudarZoom);
    document.removeEventListener('visibilitychange', this.aoMudarVisibilidade);
  }

  /** Medida para a sonda: entidades, quantas passam o piso, discos desenhados na tela e custo. */
  medida(): {
    entidades: number;
    comPonto: number;
    piso: number;
    zoom: number;
    passamOPiso: number;
    discosNaTela: number;
    halosNaTela: number;
    atualizacoes: number;
    custoMedioMs: number | null;
    custoP95Ms: number | null;
  } {
    const c = [...this.custos].sort((a, b) => a - b);
    const m = this.mapa;
    // a consulta do Mapbox com a caixa da tela inteira volta vazia no globo quando a caixa pega o
    // espaço (medido no zoom 3,2): conta-se pela projeção, no hemisfério visível e dentro do canvas
    const cv = m.getCanvas();
    const centro = m.getCenter();
    const visivel = (lon: number, lat: number) => {
      const r = Math.PI / 180;
      const cos = Math.sin(lat * r) * Math.sin(centro.lat * r) + Math.cos(lat * r) * Math.cos(centro.lat * r) * Math.cos((lon - centro.lng) * r);
      if (cos <= 0.05) return false;
      const q = m.project([lon, lat]);
      return q.x >= 0 && q.y >= 0 && q.x <= cv.clientWidth && q.y <= cv.clientHeight;
    };
    let passam = 0;
    let discos = 0;
    let halos = 0;
    if (this.m)
      for (const e of this.m.entidades) {
        if (!e.lonlat) continue;
        const g = this.agoraG[e.i] ?? 0;
        const c = this.agoraC[e.i] ?? 0;
        if (Math.max(g, c) < Math.max(this.piso, 0.5) && !(this.piso <= 0)) continue;
        passam++;
        if (!visivel(e.lonlat[0], e.lonlat[1])) continue;
        discos++;
        if (c > 0.5) halos++;
      }
    return {
      entidades: this.m?.entidades.length ?? 0,
      comPonto: this.m?.entidades.filter((e) => e.lonlat).length ?? 0,
      piso: this.piso,
      zoom: Math.round(m.getZoom() * 100) / 100,
      passamOPiso: passam,
      discosNaTela: discos,
      halosNaTela: halos,
      atualizacoes: this.atualizacoes,
      custoMedioMs: c.length ? Math.round((c.reduce((s, x) => s + x, 0) / c.length) * 1000) / 1000 : null,
      custoP95Ms: c.length ? Math.round(c[Math.floor(c.length * 0.95)] * 1000) / 1000 : null,
    };
  }

  /** Geração e corte desenhados agora para uma entidade (a sonda confere contra o arquivo). */
  desenhado(id: string): { g: number; c: number } | null {
    const e = this.m?.porId.get(id);
    return e ? { g: this.agoraG[e.i], c: this.agoraC[e.i] } : null;
  }

  // ── carga ──

  private garantir() {
    if (this.m || this.pedido || this.falhou || this.destruida) return;
    this.pedido = true;
    cargaDaOperacao().then(
      (d) => {
        this.pedido = false;
        if (this.destruida) return;
        this.bruto = d;
        this.m = lerOperacao(d);
        const n = this.m.entidades.length;
        for (const k of ['deG', 'deC', 'paraG', 'paraC', 'agoraG', 'agoraC'] as const) this[k] = new Float64Array(n);
        const f = this.m.entidades.find((e) => e.foraDoBrasil && e.lonlat);
        if (f?.lonlat) {
          const [lon, lat] = f.lonlat;
          const par = this.m.entidades.find((e) => !e.foraDoBrasil && e.lonlat && e.lonlat[0] === lon && e.lonlat[1] === lat);
          this.fora = { i: f.i, par: par ? par.i : null };
        }
        this.irPara(this.momento, null, true);
        this.atualizarMembros();
        this.opcoes.aoChegar();
      },
      (e: unknown) => {
        this.pedido = false;
        if (this.destruida) return;
        this.falhou = true;
        console.error('[atlas] operação:', e);
        this.opcoes.aoFalhar('Não foi possível carregar a operação hora a hora.');
      },
    );
  }

  private diaAtual(): DiaDaOperacao | null {
    return this.m && this.momento ? diaDe(this.m, this.momento.dia) : null;
  }

  // ── transição entre horas ──

  /** Leva o desenho ao momento novo: de onde está agora até a geração da hora nova. */
  private irPara(momento: MomentoDaOperacao | null, anterior: MomentoDaOperacao | null, seco: boolean) {
    const m = this.m;
    if (!m) return;
    const d = momento ? diaDe(m, momento.dia) : null;
    const n = m.entidades.length;
    // de: o que está desenhado neste instante (se uma transição estava no meio, sai dali)
    this.passo(performance.now(), false);
    this.deG.set(this.agoraG);
    this.deC.set(this.agoraC);
    for (let i = 0; i < n; i++) {
      this.paraG[i] = d && momento ? geracaoNaHora(d, i, momento.hora) : 0;
      this.paraC[i] = d && momento ? corteNaHora(d, i, momento.hora) : 0;
    }
    const reduzido = this.opcoes.reduzido();
    const passoDeUmaHora = !!anterior && !!momento && anterior.dia === momento.dia && Math.abs(anterior.hora - momento.hora) <= 1.001;
    this.duracao = seco || reduzido || !this.ligada || document.visibilityState !== 'visible' ? 0 : passoDeUmaHora ? DURACAO.passo : DURACAO.salto;
    this.tInicio = performance.now();
    this.atualizarRotulos();
    if (this.duracao === 0) {
      this.agoraG.set(this.paraG);
      this.agoraC.set(this.paraC);
      this.empurrar(false);
      return;
    }
    this.laco();
  }

  /** Avança o desenho até `agora`; devolve true enquanto a transição não acabou. */
  private passo(agora: number, mandar: boolean): boolean {
    const n = this.agoraG.length;
    const t = this.duracao > 0 ? suave((agora - this.tInicio) / this.duracao) : 1;
    for (let i = 0; i < n; i++) {
      this.agoraG[i] = this.deG[i] + (this.paraG[i] - this.deG[i]) * t;
      this.agoraC[i] = this.deC[i] + (this.paraC[i] - this.deC[i]) * t;
    }
    if (mandar) this.empurrar(false);
    return t < 1;
  }

  private laco() {
    if (this.quadro || this.destruida) return;
    const quadro = (agora: number) => {
      this.quadro = 0;
      if (this.destruida) return;
      if (!this.ligada || document.visibilityState !== 'visible') {
        // aba oculta ou capítulo fechado: termina seco
        this.duracao = 0;
        this.passo(agora, true);
        return;
      }
      if (agora - this.ultimoPasso >= PASSO_MS || agora - this.tInicio >= this.duracao) {
        this.ultimoPasso = agora;
        if (!this.passo(agora, true)) return;
      }
      this.quadro = requestAnimationFrame(quadro);
    };
    this.quadro = requestAnimationFrame(quadro);
  }

  // ── dados para o mapa ──

  private dadosDosDiscos(): FeatureCollection {
    const m = this.m;
    if (!m || !this.momento) return VAZIA;
    const sel = this.selecionado ? lerChave(this.selecionado) : null;
    const selId = sel?.tipo === 'entidade' ? sel.id : null;
    const d = this.diaAtual();
    const fs: Feature<Point>[] = [];
    for (const e of m.entidades) {
      if (!e.lonlat) continue;
      // sem valor de geração no dia (a entidade não aparece, ou a fonte deu vazio, que não é zero):
      // não se desenha, nem quando há corte (o disco sairia como "parada", 0 MW, e o halo diria que o
      // vão é o corte de uma geração que a fonte não deu). O corte dela continua na soma e na lista
      // do painel, e a ficha diz; o "Como ler" também
      if (d && d.mw[e.i] == null) continue;
      const g = this.agoraG[e.i] ?? 0;
      const c = this.agoraC[e.i] ?? 0;
      fs.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: e.lonlat },
        properties: {
          i: e.i,
          chave: chaveDaEntidade(e.id),
          nome: e.nome,
          cat: e.cat,
          g: Math.round(g * 10) / 10,
          gc: Math.round((g + c) * 10) / 10,
          c: Math.round(c * 10) / 10,
          sel: e.id === selId ? 1 : 0,
          fora: e.foraDoBrasil ? 1 : 0,
        },
      });
    }
    return { type: 'FeatureCollection', features: fs };
  }

  /** Rótulos das maiores na hora de destino (fonte própria: não refaz a colocação durante a transição). */
  private atualizarRotulos() {
    const m = this.m;
    const src = this.mapa.getSource(FP.rotulos) as mapboxgl.GeoJSONSource | undefined;
    if (!src) return;
    if (!m || !this.momento) {
      src.setData(VAZIA);
      return;
    }
    // o rótulo é curto: sem o prefixo "Conjunto Fotovoltaico/Eólico" (a cor diz a fonte; a linha
    // de baixo diz "conjunto") e sem a hora (o painel diz); o nome inteiro fica na ficha
    const fs: Feature<Point>[] = [];
    for (const e of m.entidades) {
      if (!e.lonlat) continue;
      const g = this.paraG[e.i];
      if (g < 50) continue;
      const curto = nomeLegivel(e.nome).replace(/^Conj(?:unto|\.)?\s+(?:Fotovoltaico|E[oó]lico|E[oó]lica|Solar|Termel[eé]trico|Hidrel[eé]trico)\s+/i, '');
      fs.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: e.lonlat },
        properties: {
          nome: e.foraDoBrasil ? `${curto} · setor paraguaio` : curto,
          valor: e.tipo === 'conjunto' ? `conjunto · ${megawatts(g)}` : megawatts(g),
          g,
          gc: g + this.paraC[e.i],
          fora: e.foraDoBrasil ? 1 : 0,
        },
      });
    }
    src.setData({ type: 'FeatureCollection', features: fs });
  }

  /** Os membros do conjunto selecionado (raios do centro a cada usina do Atlas). */
  private atualizarMembros() {
    const src = this.mapa.getSource(FP.membros) as mapboxgl.GeoJSONSource | undefined;
    const sel = this.selecionado ? lerChave(this.selecionado) : null;
    const e = sel?.tipo === 'entidade' ? this.m?.porId.get(sel.id) : null;
    if (!src) return;
    // os membros do dia mostrado (a relação do ONS tem data de início e de fim)
    const membros = e ? membrosDoDia(this.diaAtual(), e).membros : [];
    if (!e || e.tipo !== 'conjunto' || !e.lonlat || !membros.length) {
      src.setData(VAZIA);
      return;
    }
    const faltam = membros.filter((c) => !this.membros.has(c));
    if (faltam.length) this.buscarMembros();
    const fs: Feature<Point | LineString>[] = [];
    for (const c of membros) {
      const p = this.membros.get(c);
      if (!p) continue;
      fs.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: [e.lonlat, p] }, properties: {} });
      fs.push({ type: 'Feature', geometry: { type: 'Point', coordinates: p }, properties: { cat: e.cat, ceg: c } });
    }
    src.setData({ type: 'FeatureCollection', features: fs });
  }

  private buscarMembros() {
    const guardar = (us: { properties: { ceg: string }; geometry: { coordinates: number[] } }[]) => {
      for (const u of us) this.membros.set(u.properties.ceg, [u.geometry.coordinates[0], u.geometry.coordinates[1]]);
    };
    if (!this.membrosPedidos.principais) {
      this.membrosPedidos.principais = true;
      void carregarUsinasPrincipais()
        .then((us) => {
          guardar(us);
          if (!this.destruida) this.atualizarMembros();
        })
        .catch(() => (this.membrosPedidos.principais = false));
      return;
    }
    if (!this.membrosPedidos.menores) {
      this.membrosPedidos.menores = true;
      void carregarUsinasMenores()
        .then((us) => {
          guardar(us);
          if (!this.destruida) this.atualizarMembros();
        })
        .catch(() => (this.membrosPedidos.menores = false));
    }
  }

  private filtroDoPiso(): mapboxgl.Expression {
    // quem passa: geração ou corte da hora ≥ piso; com piso 0 (de perto), também quem está parado
    // o setor paraguaio de Itaipu tem camada própria (desenhado ao lado)
    return this.piso <= 0
      ? exp(['!=', ['get', 'fora'], 1])
      : exp(['all', ['!=', ['get', 'fora'], 1], ['>=', ['max', ['get', 'g'], ['get', 'c']], this.piso]]);
  }

  private empurrar(rotulosTambem: boolean) {
    const m = this.mapa;
    const src = m.getSource(FP.discos) as mapboxgl.GeoJSONSource | undefined;
    if (!src) return;
    const t = performance.now();
    src.setData(this.dadosDosDiscos());
    this.custos.push(performance.now() - t);
    if (this.custos.length > 240) this.custos.shift();
    this.atualizacoes++;
    this.atualizarTranslado();
    if (rotulosTambem) this.atualizarRotulos();
  }

  private aoMudarZoom = () => {
    const p = pisoNoZoom(this.mapa.getZoom());
    if (p === this.piso) return;
    this.piso = p;
    const f = this.filtroDoPiso();
    if (this.mapa.getLayer('pulso-disco')) this.mapa.setFilter('pulso-disco', f);
    if (this.mapa.getLayer('pulso-corte')) this.mapa.setFilter('pulso-corte', exp(['all', f, ['>', ['get', 'c'], 0.5]]));
  };

  private aoMudarVisibilidade = () => {
    if (document.visibilityState !== 'visible' && this.quadro) {
      cancelAnimationFrame(this.quadro);
      this.quadro = 0;
      this.duracao = 0;
      this.passo(performance.now(), true);
    }
  };

  /** O arquivo bruto (para a sonda). */
  get arquivo(): unknown {
    return this.bruto;
  }
}

function mesmoMomento(a: MomentoDaOperacao | null, b: MomentoDaOperacao | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.dia === b.dia && a.hora === b.hora;
}
