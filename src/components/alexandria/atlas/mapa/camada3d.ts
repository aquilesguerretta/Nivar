// Atlas da Alexandria v3 — as maquetes 3D no mapa.
//
// Em zoom alto, cada usina, subestação e trecho de linha ganha uma maquete do TIPO de
// instalação (a escolha e o desempilhamento moram em maquetes.ts; aqui só se desenha).
// São os modelos gerados no Blender por tools/alexandria-atlas/modelos/gerar_modelos.py
// — papel com detalhe em tinta, a mesma matéria do resto da Alexandria.
//
// O que elas são e o que não são (a interface repete isto):
//   · representação esquemática do tipo, não retrato da instalação;
//   · posição: a do cadastro (usina, subestação) ou ao longo do traçado generalizado
//     do ONS (torres);
//   · fora de escala enquanto o zoom é baixo: a maquete tem tamanho mínimo na tela para
//     poder ser vista, e só chega à escala real bem de perto (sem degrau: o tamanho é o
//     maior entre o mínimo e o real).
//
// Tecnicamente: uma camada "custom" do Mapbox desenhada com Three.js no mesmo contexto
// WebGL do mapa, com uma InstancedMesh por (arquivo, material). Cada modelo só é baixado
// quando aparece o primeiro ponto dele; as torres têm uma versão simplificada para quando
// ocupam poucos pixels. Este arquivo só é baixado quando o leitor chega ao zoom das maquetes.
//
// Matéria (quatro materiais pelo nome, cores da PALETA do Atlas):
//   papel      corpo; no claro, o papel do mapa (a luz o deixa um tom acima do chão);
//              no noturno, o creme da tinta invertida;
//   tinta      o detalhe que define o tipo, sobre o corpo;
//   estrutura  o metal fino ao ar livre (treliça, pórtico); no noturno clareia, senão some.
//              A torre das linhas abaixo de 440 kV fica na cor da classe da linha, não em
//              tinta: o objeto não pode pesar mais que o traço que ele carrega;
//   chao       a laje do pátio, sem contorno; some quando a maquete é pequena na tela.
// Contorno: a casca de trás do corpo, empurrada para fora NA TELA (espessura constante em
// pixels, em qualquer zoom) e para trás na profundidade (polygonOffset), para não brigar
// com a face da frente. Nada de sombra projetada, brilho ou cor de estado.
// Sobre a foto de satélite o contorno engrossa (1,4 px) e, de perto (z ≥ 12,5), a maquete
// sai (maquetes.ts marca semModelo): a foto já mostra a obra.
// Tamanho: o L de cada ponto (lei de tamanho de maquetes.ts, em px no ponto) vira metros no
// zoom da escolha; durante o gesto a maquete mantém os px (como um símbolo) e nunca fica
// menor que a escala real. Troca 2D → 3D guiada pelo zoom: entre 9,4 e 9,8 a maquete cresce
// do chão (escala vertical de 0 a 1, base fixa).
// Com o relevo 3D ligado, a altitude de cada maquete é relida quando os tiles do relevo
// chegam (sem isso a maquete ficava enterrada no terreno até o próximo movimento).

import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { PALETA } from '@/lib/alexandria/atlas/estilo';
import { ACENTO_DO_ARQUIVO, DURACAO_DA_TROCA_MS, LARGURA_DO_CELULAR, MODELOS, PX_DA_LAJE, PX_DO_LOD, ZOOM_DAS_MAQUETES, dimensaoDoArquivo, rumoDoAerogerador, type PontoDeMaquete, type TipoDeMaquete } from './maquetes';

export type { PontoDeMaquete, TipoDeMaquete } from './maquetes';

const BASE = '/alexandria/atlas/modelos';

const LUZ_AMBIENTE = 0.74 * Math.PI;
const LUZ_DO_SOL = 0.44 * Math.PI;
/** No noturno o teto fica no creme cheio (sem a queda de um quinto da rodada anterior) e as
 *  faces de trás descem mais: o volume vem do contraste entre faces, não do escurecimento. */
const LUZ_AMBIENTE_NOTURNA = 0.55 * Math.PI;
const LUZ_DO_SOL_NOTURNA = 0.6 * Math.PI;

/** Arquivos das torres (estrutura própria: não pode pesar mais que o traço que carrega). */
const TORRES = new Set((['torre', 'torre-ehv', 'torre-cc'] as const).flatMap((t) => [MODELOS[t].arquivo, MODELOS[t].lod ?? MODELOS[t].arquivo]));

/** Instâncias reservadas por modelo: tetos dos quatro níveis × 1,2 mais as torres cabem com
 *  folga. O count desenhado é o dos pontos. */
const INSTANCIAS_POR_MODELO = 128;

/** Espera (ms) antes de pedir de novo um modelo que falhou; dobra a cada falha seguida. */
const ESPERA_DA_FALHA = 15_000;
const ESPERA_MAXIMA_DA_FALHA = 60_000;

/** Mistura duas cores hexadecimais (#rrggbb). */
function misturar(a: string, b: string, t: number): string {
  const h = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * t).toString(16).padStart(2, '0')).join('')}`;
}

/** Desaceleração da entrada e da saída (cúbica): sai do chão depressa e assenta devagar. */
const suave = (f: number) => 1 - (1 - f) ** 3;

/** Matriz que some com a peça (escala zero): laje de maquete pequena na tela. */
const SUMIDA = new THREE.Matrix4().makeScale(0, 0, 0);

/** A casca é desenhada DEPOIS dos corpos e testa a profundidade deles: assim o contorno sai
 *  também por dentro do conjunto (prédio sobre a laje, chaminé sobre o prédio), não só em
 *  volta da silhueta. */
const ORDEM_DA_CASCA = 3;

/** Espessura do contorno de tinta, em px de CSS (sobre a foto de satélite, mais grosso). */
const PX_DO_CONTORNO = 1.1;
const PX_DO_CONTORNO_NO_SATELITE = 1.4;
/** Maquete pequena na tela (L abaixo de PX_DO_FIO_FINO) leva fio mais fino: 1,1 px de contorno
 *  em 36 px de aerogerador pesava como desenho a nanquim. Fora do satélite. */
const PX_DO_FIO_FINO = 40;
const FATOR_DO_FIO_FINO = 0.8 / PX_DO_CONTORNO;

interface Parte {
  malha: THREE.InstancedMesh;
  /** true = gira com o rotor do aerogerador */
  rotor: boolean;
  /** true = laje do pátio (some quando a maquete é pequena na tela) */
  chao: boolean;
  /** true = a peça de acento, na cor da fonte (cor por instância) */
  acento: boolean;
  /** casca de contorno: espessura por instância (atributo aFio) */
  casca: boolean;
}

interface ModeloCarregado {
  partes: Parte[];
  /** posição do cubo do rotor no modelo (só o aerogerador) */
  cubo: THREE.Vector3 | null;
}

/** O que a medição (window.__atlas, só em desenvolvimento) lê de cada instância desenhada. */
interface InstanciaDesenhada {
  ponto: PontoDeMaquete;
  arquivo: string;
  /** maior medida pretendida na tela (px), a de tamanhoNaTela */
  px: number;
  /** a laje (peças "chao") está desenhada nesta instância */
  laje: boolean;
  /** matriz da instância (a do corpo; o rotor gira em torno do cubo dentro dela) */
  base: THREE.Matrix4;
  /** escala vertical da troca 2D → 3D (0 a 1) */
  vertical: number;
  /** saiu da escolha e encolhe até o chão (não entra na medição nem no obstáculo) */
  saindo: boolean;
}

/** Caixa de tela de uma instância desenhada, em px de CSS relativos ao canvas do mapa. */
export interface CaixaDeTela {
  ponto: PontoDeMaquete;
  arquivo: string;
  px: number;
  /** caixa dos 8 cantos da bbox do modelo, projetados (null: algum canto atrás da câmera) */
  caixa: [number, number, number, number] | null;
  /** caixa de todos os vértices projetados (a silhueta real; o rotor entra pelo disco varrido) */
  caixaJusta: [number, number, number, number] | null;
  /** origem do modelo (o pé, no ponto do cadastro e na altitude do relevo) projetada */
  pe: [number, number] | null;
  /** escala vertical da troca 2D → 3D (0 a 1) */
  vertical: number;
}

/** Geometria do modelo para a medição: bbox e vértices (no espaço do modelo), sem e com a laje. */
interface FormaDoModelo {
  caixa: THREE.Box3;
  caixaComLaje: THREE.Box3;
  vertices: Float32Array;
  verticesDaLaje: Float32Array;
}

const m4 = () => new THREE.Matrix4();
/** y do modelo (norte) → y da cena (sul) */
const ESPELHO = new THREE.Matrix4().makeScale(1, -1, 1);
/** o eixo do rotor ao pé: a peça é modelada deitada e posta de pé por este giro */
const EM_PE = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
const EIXO_Z = new THREE.Vector3(0, 0, 1);

/** As mesmas contas de mapboxgl.MercatorCoordinate.fromLngLat e de meterInMercatorCoordinateUnits
 *  (mapbox-gl 3: raio 6 371 008,8 m), sem criar um objeto por ponto a cada posicionamento (PERF-4). */
const CIRCUNFERENCIA = 2 * Math.PI * 6371008.8;
interface Mercator {
  x: number;
  y: number;
  z: number;
  /** 1 m em unidades mercator nesta latitude */
  metro: number;
}
function mercatorEm(lon: number, lat: number, altitude: number, saida: Mercator): Mercator {
  const cosLat = Math.cos((lat * Math.PI) / 180);
  saida.x = (180 + lon) / 360;
  saida.y = (180 - (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))) / 360;
  saida.z = altitude / (CIRCUNFERENCIA * cosLat);
  saida.metro = 1 / CIRCUNFERENCIA / cosLat;
  return saida;
}

export class CamadaDeMaquetes {
  private readonly mapa: mapboxgl.Map;
  private modo: ModoV3;
  private reduzido: boolean;
  private readonly limite: number;

  private readonly cena = new THREE.Scene();
  private readonly camera = new THREE.Camera();
  private renderizador: THREE.WebGLRenderer | null = null;
  /** modelos carregados, por arquivo (o modelo cheio e o simplificado são arquivos distintos) */
  private readonly modelos = new Map<string, ModeloCarregado>();
  private readonly carregando = new Map<string, Promise<void>>();
  /** modelos que falharam ao baixar: quando e quanto esperar antes de pedir de novo (COL-4, PERF-3) */
  private readonly falhas = new Map<string, { quando: number; espera: number }>();
  /** chamado quando um modelo falha ou volta a carregar (o controle refaz a escolha, e o item
   *  sem modelo volta ao símbolo 2D) */
  aoMudarDisponibilidade: (() => void) | null = null;
  private readonly matPapel: THREE.MeshLambertMaterial;
  private readonly matTinta: THREE.MeshLambertMaterial;
  private readonly matChao: THREE.MeshLambertMaterial;
  private readonly matEstrutura: THREE.MeshLambertMaterial;
  private readonly matEstruturaTorre: THREE.MeshLambertMaterial;
  /** as mesas do campo solar (a peça "tinta" de solar.glb): no noturno mais clara que a tinta
   *  das outras maquetes (onda 2, limitações: ardósia a 50% sobre o navy dava 2,7:1) */
  private readonly matPainel: THREE.MeshLambertMaterial;
  /** a peça de acento: branco no material, a cor da fonte vem por instância (setColorAt) */
  private readonly matAcento: THREE.MeshLambertMaterial;
  private readonly matContorno: THREE.MeshBasicMaterial;
  /** chamado no fim de cada posicionamento (o controle relê as caixas para o obstáculo) */
  aoPosicionar: (() => void) | null = null;
  private readonly uTela = { value: new THREE.Vector2(1, 1) };
  private readonly uEspessura = { value: PX_DO_CONTORNO };
  private readonly ambiente: THREE.AmbientLight;
  private readonly sol: THREE.DirectionalLight;

  private pontos: PontoDeMaquete[] = [];
  /** entrada no tempo: quando cada item da escolha entrou e de que altura partiu (leva 4, item 1) */
  private readonly troca = new Map<string, { t0: number; de: number }>();
  /** itens que saíram da escolha e ainda encolhem até o chão */
  private saindo: { ponto: PontoDeMaquete; t0: number; de: number }[] = [];
  private origem = new mapboxgl.MercatorCoordinate(0.5, 0.5, 0);
  private zoomAplicado = -1;
  /** rumo da câmera no último posicionamento (o aerogerador acompanha a câmera, item 2) */
  private rumoAplicado = 0;
  private temAerogerador = false;
  /** o último posicionamento desenhou alguém entrando ou saindo: o próximo quadro reposiciona */
  private trocaPendente = false;
  private ativa = false;
  private temRotor = false;
  private destruida = false;
  /** matriz de base de cada aerogerador posicionado, para girar só o rotor a cada quadro */
  private basesDosRotores: THREE.Matrix4[] = [];
  private arquivoDoRotor: string | null = null;
  private repinturaAgendada = false;
  /** satélite ligado: contorno mais grosso (de perto, nenhuma maquete: maquetes.ts) */
  private satelite = false;
  /** relevo: houve ponto sem altitude (tile ainda não chegou) no último posicionamento */
  private altitudePendente = false;
  private terrenoAplicado = false;
  private ultimaReleitura = 0;
  /** medição: instâncias desenhadas no último posicionamento (não entra no desenho) */
  private desenhadas: InstanciaDesenhada[] = [];
  private readonly formas = new Map<string, FormaDoModelo>();
  /** reaproveitada a cada quadro em desenhar() (PERF-4) */
  private readonly translacao = m4();
  /** PERF-4: o que posicionar() e girarRotores() usam a cada chamada, criado uma vez só. As
   *  instâncias desenhadas e as bases dos rotores vêm de reservas que só crescem; `desenhadas`
   *  e `nRotores` dizem quantas valem no último posicionamento. */
  private readonly reservaDesenhadas: InstanciaDesenhada[] = [];
  private nRotores = 0;
  private readonly contagem = new Map<string, number>();
  private readonly tmp = {
    escala: new THREE.Vector3(),
    posicao: new THREE.Vector3(),
    giro: new THREE.Quaternion(),
    rumo: new THREE.Quaternion(),
    base: m4(),
    local: m4(),
    final: m4(),
    alturaDaTroca: m4(),
    cor: new THREE.Color(),
    merc: { x: 0, y: 0, z: 0, metro: 0 } as Mercator,
  };
  private readonly aoChegarRelevo = (e: mapboxgl.MapSourceDataEvent) => {
    if (e.sourceId !== 'relevo' || !this.terrenoAplicado) return;
    // tile do relevo chegou: relê a altitude no próximo quadro
    this.zoomAplicado = -1;
    this.mapa.triggerRepaint();
  };

  constructor(mapa: mapboxgl.Map, modo: ModoV3, reduzido: boolean, limite = INSTANCIAS_POR_MODELO) {
    this.mapa = mapa;
    this.modo = modo;
    this.reduzido = reduzido;
    this.limite = limite;
    // Faces planas por normal de face na geometria (ver carregar), não por flatShading: o
    // flatShading tira a normal das derivadas da tela, e a projeção do Mapbox (mercator, y
    // para o sul) inverte a mão do espaço — a normal saía para dentro e o teto ficava no
    // escuro (medido: laje cinza, prédio sumido contra ela).
    this.matPapel = new THREE.MeshLambertMaterial();
    this.matTinta = new THREE.MeshLambertMaterial();
    this.matChao = new THREE.MeshLambertMaterial();
    // treliça e pórtico são fitas planas: desenhados dos dois lados
    this.matEstrutura = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });
    this.matEstruturaTorre = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });
    this.matPainel = new THREE.MeshLambertMaterial();
    this.matAcento = new THREE.MeshLambertMaterial({ color: 0xffffff });
    this.matContorno = this.novoContorno();
    this.mapa.on('sourcedata', this.aoChegarRelevo);
    // Luz (o Three divide a irradiância por π): o teto sai ~1,08× a cor do papel, a face ao
    // sol ~1,0×, a face de trás ~0,74× — três tons de papel, que é o que dá volume a uma
    // maquete de arquiteto. Sol de noroeste a 50° (a cena tem x para leste e y para o sul).
    this.ambiente = new THREE.AmbientLight(0xffffff, LUZ_AMBIENTE);
    this.sol = new THREE.DirectionalLight(0xffffff, LUZ_DO_SOL);
    this.sol.position.set(-0.38, -0.52, 0.77);
    this.cena.add(this.ambiente, this.sol);
    this.camera.matrixAutoUpdate = false;
    this.pintar();
  }

  /** Contorno de tinta: a mesma malha, só as faces de trás, empurrada para fora ao longo
   *  da normal projetada NA TELA (px constantes em qualquer zoom e tamanho de maquete).
   *  Não escreve profundidade; é desenhada depois dos corpos e some onde um corpo está na
   *  frente dela. */
  private novoContorno(): THREE.MeshBasicMaterial {
    // polygonOffset empurra a casca para trás na profundidade: a face de cima da laje e a
    // casca da face de baixo empatavam (a cunha de tinta da crítica, cortada na diagonal)
    const mat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 4 });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTela = this.uTela;
      shader.uniforms.uEspessura = this.uEspessura;
      // aFio: fator da espessura por instância (fio fino nas maquetes pequenas)
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nuniform vec2 uTela;\nuniform float uEspessura;\nattribute float aFio;').replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        {
          vec4 alvo = vec4( transformed + normalize( normal ) * 0.5, 1.0 );
          #ifdef USE_INSTANCING
            alvo = instanceMatrix * alvo;
          #endif
          alvo = projectionMatrix * modelViewMatrix * alvo;
          if ( gl_Position.w > 0.0 && alvo.w > 0.0 ) {
            vec2 d = ( alvo.xy / alvo.w - gl_Position.xy / gl_Position.w ) * uTela;
            float L = length( d );
            if ( L > 1e-5 ) gl_Position.xy += ( d / L ) * ( 2.0 * uEspessura * aFio / uTela ) * gl_Position.w;
          }
        }`,
      );
    };
    return mat;
  }

  private pintar() {
    const claro = this.modo === 'claro';
    this.matPapel.color.set(claro ? PALETA.claro.papel : PALETA.noturno.tinta);
    // no noturno a tinta não pode ser o navy do fundo: onde a peça assenta direto no chão (monte
    // de carvão, mesas solares, crista da barragem) ela sumia. Meio-tom ardósia: ~4,5:1 sobre o
    // corpo creme e ~3:1 sobre o fundo escuro
    this.matTinta.color.set(claro ? PALETA.claro.tinta : misturar(PALETA.noturno.papel, PALETA.noturno.linha.ca440, 0.5));
    // as mesas solares assentam direto no chão escuro: no noturno a mistura vai a 75% do ca440
    // (sonda das limitações: Pirapora 2,71 → 4,71); no claro, a tinta de sempre
    this.matPainel.color.set(claro ? PALETA.claro.tinta : misturar(PALETA.noturno.papel, PALETA.noturno.linha.ca440, 0.75));
    // a laje do pátio: no claro, um tom abaixo do papel; no noturno, um tom acima do fundo
    // escuro (o azul-ardósia das linhas menores), para o corpo creme saltar dela — a crítica:
    // corpo e laje saíam no mesmo cinza-bege e o conjunto lia como papelão
    this.matChao.color.set(claro ? PALETA.claro.papelFundo : PALETA.noturno.linha.caMenor);
    this.matEstrutura.color.set(claro ? PALETA.claro.tinta : PALETA.noturno.tinta);
    // torre: a cor CHEIA da classe de 500 kV, o tom do próprio traço da linha (onda 2, limitações:
    // a mistura a 55% no claro e a 70% no noturno dava 2,7:1 e a treliça fina lia pontilhada)
    this.matEstruturaTorre.color.set(claro ? PALETA.claro.linha.ca500 : PALETA.noturno.linha.ca500);
    // contorno: tinta no claro; no noturno o navy do fundo, que separa as peças sobre o creme
    // (a silhueta contra o mapa escuro já é dada pelo próprio creme)
    this.matContorno.color.set(claro ? PALETA.claro.tinta : PALETA.noturno.papelFundo);
    this.ambiente.intensity = claro ? LUZ_AMBIENTE : LUZ_AMBIENTE_NOTURNA;
    this.sol.intensity = claro ? LUZ_DO_SOL : LUZ_DO_SOL_NOTURNA;
  }

  definirModo(modo: ModoV3) {
    this.modo = modo;
    this.pintar();
    // a cor do acento é por instância: repõe no próximo quadro
    this.zoomAplicado = -1;
  }

  definirMovimentoReduzido(reduzido: boolean) {
    this.reduzido = reduzido;
  }

  /** A camada "custom" a registrar no mapa (de novo a cada troca de estilo). */
  camada(): mapboxgl.CustomLayerInterface {
    return {
      id: 'maquetes',
      type: 'custom',
      renderingMode: '3d',
      onAdd: (_mapa, gl) => {
        // COL-2: um renderizador só. A troca de estilo (modo claro/noturno) registra a camada de
        // novo, mas o contexto WebGL é o mesmo do canvas do mapa; recriar o renderizador deixava
        // na GPU uma cópia de cada geometria e programa a cada troca (o dispose do Three não
        // apaga buffers nem programas). desenhar() chama resetState() antes de cada render.
        if (this.renderizador) return;
        this.renderizador = new THREE.WebGLRenderer({ canvas: this.mapa.getCanvas(), context: gl as WebGLRenderingContext, antialias: true });
        this.renderizador.autoClear = false;
      },
      render: (gl, matriz) => this.desenhar(gl, matriz),
    };
  }

  /** Tipo cujo modelo falhou ao baixar e ainda está no intervalo de espera (COL-4): a escolha
   *  não o escolhe, e o item fica no símbolo 2D. Passado o intervalo, volta a ser escolhido e
   *  o modelo é pedido de novo uma vez. */
  tipoIndisponivel(tipo: TipoDeMaquete): boolean {
    const f = this.falhas.get(MODELOS[tipo].arquivo);
    return !!f && performance.now() - f.quando < f.espera;
  }

  /** Baixa um modelo (uma vez) e cria as instâncias dele. */
  private carregar(arquivo: string): void {
    if (this.modelos.has(arquivo) || this.carregando.has(arquivo)) return;
    // PERF-3: depois de uma falha, nada de pedir de novo a cada quadro do zoom; só depois do
    // intervalo (que dobra a cada falha seguida, até um minuto)
    const falha = this.falhas.get(arquivo);
    if (falha && performance.now() - falha.quando < falha.espera) return;
    const promessa = (async () => {
      const gltf = await new GLTFLoader().loadAsync(`${BASE}/${arquivo}`);
      if (this.destruida) return;
      gltf.scene.updateMatrixWorld(true);
      const partes: Parte[] = [];
      let cubo: THREE.Vector3 | null = null;
      gltf.scene.traverse((no) => {
        const malha = no as THREE.Mesh;
        if (!malha.isMesh) return;
        const ehRotor = no.name === 'rotor' || no.parent?.name === 'rotor';
        if (ehRotor && !cubo) cubo = new THREE.Vector3().setFromMatrixPosition((no.name === 'rotor' ? no : (no.parent as THREE.Object3D)).matrixWorld);
        const nome = (Array.isArray(malha.material) ? malha.material[0] : malha.material).name;
        // a casca usa a geometria com normais suaves (do Blender); o corpo, a mesma geometria
        // desindexada com a normal de cada face (faces planas, iluminadas do lado certo)
        const geo = malha.geometry.clone();
        // o rotor fica com a geometria na origem do cubo (para girar); o resto, já no lugar
        if (!ehRotor) geo.applyMatrix4(malha.matrixWorld);
        const plana = geo.toNonIndexed();
        plana.computeVertexNormals();
        const estrutura = TORRES.has(arquivo) ? this.matEstruturaTorre : this.matEstrutura;
        const material = nome === 'tinta' ? (arquivo === MODELOS.solar.arquivo ? this.matPainel : this.matTinta) : nome === 'estrutura' ? estrutura : nome === 'chao' ? this.matChao : nome === 'acento' ? this.matAcento : this.matPapel;
        const inst = new THREE.InstancedMesh(plana, material, this.limite);
        inst.renderOrder = 2;
        // acento: cor por instância (a fonte do ponto), alocada já na criação para o shader
        // nascer com a cor de instância
        if (material === this.matAcento) inst.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(this.limite * 3).fill(1), 3);
        const pecas: THREE.InstancedMesh[] = [inst];
        // só o corpo ganha contorno; a laje não (a crítica: o fio da laje virava crachá); o
        // acento é peça pequena sobre o corpo e fica sem casca (uma chamada de desenho a menos)
        if (material === this.matPapel) {
          // espessura por instância: todas as cascas têm o atributo (sem ele o fio sai zero)
          geo.setAttribute('aFio', new THREE.InstancedBufferAttribute(new Float32Array(this.limite).fill(1), 1));
          const casca = new THREE.InstancedMesh(geo, this.matContorno, this.limite);
          casca.renderOrder = ORDEM_DA_CASCA;
          pecas.push(casca);
        }
        for (const p of pecas) {
          p.count = 0;
          p.frustumCulled = false;
          // a cena usa y para o sul (mercator); o modelo, y para o norte. O espelho mora na
          // matriz de cada INSTÂNCIA, não na da malha: o Three olha só o determinante da
          // malha para decidir a face da frente, e a projeção do Mapbox já inverte a mão do
          // espaço — com o espelho na malha as duas inversões se somavam e o mapa desenhava
          // o lado de dentro das caixas (medido: teto sumido, casca cobrindo tudo).
          p.matrixAutoUpdate = false;
          p.matrix.identity();
          p.matrixWorld.identity();
          this.cena.add(p);
          const casca = p.material === this.matContorno;
          partes.push({ malha: p, rotor: ehRotor, chao: material === this.matChao && !casca, acento: material === this.matAcento && !casca, casca });
        }
      });
      this.modelos.set(arquivo, { partes, cubo });
      if (this.falhas.delete(arquivo)) this.aoMudarDisponibilidade?.();
      this.zoomAplicado = -1;
      this.mapa.triggerRepaint();
    })();
    this.carregando.set(arquivo, promessa);
    promessa.catch((e) => {
      if (this.destruida) return;
      console.error('[atlas] maquete', arquivo, e);
      this.falhas.set(arquivo, { quando: performance.now(), espera: Math.min(ESPERA_MAXIMA_DA_FALHA, falha ? falha.espera * 2 : ESPERA_DA_FALHA) });
      this.carregando.delete(arquivo);
      // a escolha refaz sem este tipo: o item volta ao símbolo 2D
      this.aoMudarDisponibilidade?.();
    });
  }

  /** Recebe os pontos escolhidos (maquetes.ts escolhe e desempilha; aqui só se desenha). Os
   *  que não têm modelo agora (aerogerador com a câmera de cima, satélite de perto) ficam fora. */
  definirPontos(pontos: PontoDeMaquete[], ativa: boolean, satelite = false) {
    const desenhaveis = ativa ? pontos.filter((p) => !p.deCima && !p.semModelo) : [];
    const agora = performance.now();
    const novos = new Set(desenhaveis.map((p) => p.id));
    // leva 4, item 1: a troca é no TEMPO. Quem entra cresce do chão a partir da altura em que
    // está (0, ou a de quem estava saindo e voltou); quem sai encolhe a partir da altura em que
    // está. Movimento reduzido: troca seca (nada de saída, entrada já inteira).
    const saindo = new Map(this.saindo.map((s) => [s.ponto.id, s]));
    if (this.reduzido) {
      this.saindo = [];
      this.troca.clear();
      for (const p of desenhaveis) this.troca.set(p.id, { t0: -Infinity, de: 1 });
    } else {
      for (const p of this.pontos) {
        if (novos.has(p.id)) continue;
        this.saindo.push({ ponto: p, t0: agora, de: this.alturaDa(p.id, agora) });
        this.troca.delete(p.id);
      }
      for (const p of desenhaveis) {
        if (this.troca.has(p.id)) continue;
        const s = saindo.get(p.id);
        // o relógio da entrada começa no primeiro quadro em que o modelo é desenhado (NaN até lá):
        // o GLB baixado na primeira vez chegava depois dos 300 ms e a maquete aparecia inteira de vez
        this.troca.set(p.id, s ? { t0: agora, de: this.alturaDaSaida(s, agora) } : { t0: Number.NaN, de: 0 });
      }
      this.saindo = this.saindo.filter((s) => !novos.has(s.ponto.id) && agora - s.t0 < DURACAO_DA_TROCA_MS);
    }
    for (const id of [...this.troca.keys()]) if (!novos.has(id)) this.troca.delete(id);
    this.ativa = desenhaveis.length > 0 || this.saindo.length > 0;
    this.satelite = satelite;
    this.pontos = desenhaveis;
    this.zoomAplicado = -1;
    this.mapa.triggerRepaint();
  }

  /** Entrada e saída no tempo (leva 4, item 1): altura de quem está na escolha (0 a 1). */
  private alturaDa(id: string, agora: number): number {
    const t = this.troca.get(id);
    if (!t) return 1;
    if (Number.isNaN(t.t0)) return t.de;
    const f = Math.min(1, Math.max(0, (agora - t.t0) / DURACAO_DA_TROCA_MS));
    return t.de + (1 - t.de) * suave(f);
  }
  private alturaDaSaida(s: { t0: number; de: number }, agora: number): number {
    const f = Math.min(1, Math.max(0, (agora - s.t0) / DURACAO_DA_TROCA_MS));
    return s.de * (1 - suave(f));
  }
  /** Há maquete entrando ou saindo agora (o desenho pede o próximo quadro). */
  private emTroca(agora: number): boolean {
    if (this.saindo.length) return true;
    for (const t of this.troca.values()) if (agora - t.t0 < DURACAO_DA_TROCA_MS) return true;
    return false;
  }

  /** Recalcula as matrizes das instâncias para o zoom corrente. */
  private posicionar(angulo: number) {
    const zoom = this.mapa.getZoom();
    const centro = this.mapa.getCenter();
    const o = mercatorEm(centro.lng, centro.lat, 0, this.tmp.merc);
    this.origem.x = o.x;
    this.origem.y = o.y;
    this.origem.z = 0;
    const contagem = this.contagem;
    contagem.clear();
    const { escala, posicao, giro, rumo, base, local, final, merc } = this.tmp;
    const emPe = EM_PE;
    const eixoZ = EIXO_Z;
    this.temRotor = false;
    this.nRotores = 0;
    this.arquivoDoRotor = null;
    const terreno = !!this.mapa.getTerrain();
    this.terrenoAplicado = terreno;
    this.altitudePendente = false;
    const reserva = this.reservaDesenhadas;
    let nDesenhadas = 0;
    const paleta = PALETA[this.modo];
    const corDoAcento = this.tmp.cor;

    // troca 2D → 3D no TEMPO (leva 4, item 1): a escala vertical de cada item vem da entrada ou
    // da saída dele (0 no chão, 1 inteira); em repouso, toda maquete está inteira
    const agora = performance.now();
    this.saindo = this.saindo.filter((s) => agora - s.t0 < DURACAO_DA_TROCA_MS);
    const nAtuais = this.pontos.length;
    const lista = this.saindo.length ? [...this.pontos, ...this.saindo.map((s) => s.ponto)] : this.pontos;
    const rumoDaCamera = this.mapa.getBearing();
    this.rumoAplicado = rumoDaCamera;
    this.temAerogerador = false;
    this.trocaPendente = this.saindo.length > 0;
    for (let ip = 0; ip < lista.length; ip++) {
      const p = lista[ip];
      const sai = ip >= nAtuais;
      const ficha = MODELOS[p.tipo];
      // metros no chão: os da escolha acompanhando o zoom (os px ficam), nunca abaixo da escala real
      const metros = Math.max(dimensaoDoArquivo(ficha.arquivo), p.metros * 2 ** (p.zoomDaEscolha - zoom));
      const px = metros * p.k * 2 ** (zoom - p.zoomDaEscolha);
      const arquivo = ficha.lod && px < PX_DO_LOD ? ficha.lod : ficha.arquivo;
      const modelo = this.modelos.get(arquivo);
      if (!modelo) {
        this.carregar(arquivo);
        continue;
      }
      if (!sai) {
        const t = this.troca.get(p.id);
        if (t && Number.isNaN(t.t0)) t.t0 = agora;
      }
      const vertical = sai ? this.alturaDaSaida(this.saindo[ip - nAtuais], agora) : this.alturaDa(p.id, agora);
      if (sai && vertical <= 0.01) continue;
      if (vertical < 0.999) this.trocaPendente = true;
      const alturaDaTroca = this.tmp.alturaDaTroca.makeScale(1, 1, Math.max(0.02, vertical));
      const i = contagem.get(arquivo) ?? 0;
      if (i >= this.limite) continue;
      contagem.set(arquivo, i + 1);
      let altitude = 0;
      if (terreno) {
        const e = this.mapa.queryTerrainElevation([p.lon, p.lat], { exaggerated: true });
        if (e == null) this.altitudePendente = true;
        else altitude = e;
      }
      // a subestação sem a laje era pórtico e caixinhas soltos no ar (achado 1): a rede tem laje
      // sempre, MENOS a conversora (onda 2, limitações: a laje clara era a borda dela e dava 1,6:1
      // contra o mapa; os salões são massa que não flutua sem ela)
      const laje = p.tipo !== 'conversora' && (px >= PX_DA_LAJE || p.familia === 'rede');
      mercatorEm(p.lon, p.lat, altitude, merc);
      // metros → unidades mercator (fator ≥ 1: nunca menor que a escala real)
      const fator = metros / dimensaoDoArquivo(arquivo);
      const s = merc.metro * fator;
      // o aerogerador acompanha a câmera, a três quartos dela (leva 4, item 2: nunca de perfil)
      const aero = p.tipo === 'aerogerador';
      if (aero) this.temAerogerador = true;
      rumo.setFromAxisAngle(eixoZ, (-(aero ? rumoDoAerogerador(rumoDaCamera) : (p.rumo ?? 0)) * Math.PI) / 180);
      giro.copy(rumo).multiply(emPe);
      escala.set(s, s, s);
      // base fixa no chão: a escala vertical da troca entra antes da translação
      base.compose(posicao.set(0, 0, 0), giro, escala).premultiply(alturaDaTroca);
      posicao.set(merc.x - this.origem.x, -(merc.y - this.origem.y), merc.z); // o espelho devolve o sul
      base.setPosition(posicao).premultiply(ESPELHO);
      const d = reserva[nDesenhadas] ?? (reserva[nDesenhadas] = { ponto: p, arquivo, px, laje, base: m4(), vertical, saindo: sai });
      d.ponto = p;
      d.arquivo = arquivo;
      d.px = px;
      d.laje = laje;
      d.base.copy(base);
      d.vertical = vertical;
      d.saindo = sai;
      nDesenhadas++;
      // acento na cor da fonte: a da usina pelo cadastro; ANP pela gravada em modelos.json
      const catDoAcento = p.familia === 'usina' && p.cat ? p.cat : ACENTO_DO_ARQUIVO.get(arquivo);
      corDoAcento.set(catDoAcento ? paleta.categoria[catDoAcento] : paleta.papel);
      const fio = this.satelite || px >= PX_DO_FIO_FINO ? 1 : FATOR_DO_FIO_FINO;
      for (const parte of modelo.partes) {
        if (parte.rotor && modelo.cubo) {
          this.temRotor = true;
          this.arquivoDoRotor = arquivo;
          if (i >= this.nRotores) {
            for (let k = this.nRotores; k <= i; k++) this.basesDosRotores[k] ??= m4();
            this.basesDosRotores[i].copy(base);
            this.nRotores = i + 1;
          }
          // gira em torno do eixo do rotor (z do glTF), com fase própria por aerogerador
          local.makeRotationZ(angulo + i * 0.9).setPosition(modelo.cubo);
          final.multiplyMatrices(base, local);
          parte.malha.setMatrixAt(i, final);
        } else parte.malha.setMatrixAt(i, parte.chao && !laje ? SUMIDA : base);
        if (parte.acento) parte.malha.setColorAt(i, corDoAcento);
        if (parte.casca) (parte.malha.geometry.getAttribute('aFio') as THREE.InstancedBufferAttribute | undefined)?.setX(i, fio);
      }
    }
    for (const [arquivo, modelo] of this.modelos) {
      const n = contagem.get(arquivo) ?? 0;
      for (const parte of modelo.partes) {
        parte.malha.count = n;
        // PERF-2: modelo já usado e fora da tela sai da lista de desenho (o Three trocava
        // programa e estado de cada malha vazia a cada quadro) e não reenvia nada à GPU
        parte.malha.visible = n > 0;
        if (n === 0) continue;
        parte.malha.instanceMatrix.needsUpdate = true;
        if (parte.acento && parte.malha.instanceColor) parte.malha.instanceColor.needsUpdate = true;
        if (parte.casca) {
          const a = parte.malha.geometry.getAttribute('aFio') as THREE.InstancedBufferAttribute | undefined;
          if (a) a.needsUpdate = true;
        }
      }
    }
    this.zoomAplicado = zoom;
    this.desenhadas = reserva.slice(0, nDesenhadas);
    this.aoPosicionar?.();
    if (import.meta.env.DEV) (window as unknown as { __maquetes?: unknown }).__maquetes = { zoom, pontos: this.pontos.length, porArquivo: Object.fromEntries(contagem) };
  }

  /** A cada quadro só os rotores mudam: reescreve as matrizes deles e mais nada. */
  private girarRotores(angulo: number) {
    const modelo = this.arquivoDoRotor ? this.modelos.get(this.arquivoDoRotor) : undefined;
    if (!modelo || !modelo.cubo) return;
    const { local, final } = this.tmp;
    for (const parte of modelo.partes) {
      if (!parte.rotor) continue;
      for (let i = 0; i < this.nRotores; i++) {
        local.makeRotationZ(angulo + i * 0.9).setPosition(modelo.cubo);
        final.multiplyMatrices(this.basesDosRotores[i], local);
        parte.malha.setMatrixAt(i, final);
      }
      parte.malha.instanceMatrix.needsUpdate = true;
    }
  }

  private desenhar(gl: WebGLRenderingContext, matriz: number[]) {
    const r = this.renderizador;
    if (!r || !this.ativa) return;
    const zoom = this.mapa.getZoom();
    if (zoom < ZOOM_DAS_MAQUETES) return;
    // relevo: ligado ou desligado desde o último posicionamento, ou altitude que faltava
    // (releitura a no máximo ~4 por segundo enquanto houver ponto sem tile)
    const terreno = !!this.mapa.getTerrain();
    const agora = performance.now();
    if (terreno !== this.terrenoAplicado || (terreno && this.altitudePendente && agora - this.ultimaReleitura > 250)) {
      this.ultimaReleitura = agora;
      this.zoomAplicado = -1;
    }
    const girando = this.temRotor && !this.reduzido;
    // ≈ 12 rotações por minuto, ordem de grandeza de um aerogerador grande
    const angulo = girando ? (performance.now() / 1000) * 1.25 : 0.5;
    // entrada/saída em curso: reposiciona a cada quadro e pede o seguinte
    // (trocaPendente: o último posicionamento ainda desenhou alguém fora da altura final; mais um
    // quadro o assenta em 1, ou tira quem terminou de sair)
    const trocando = this.emTroca(agora) || this.trocaPendente;
    const girouACamera = this.temAerogerador && Math.abs(this.mapa.getBearing() - this.rumoAplicado) > 0.25;
    if (trocando || girouACamera || Math.abs(zoom - this.zoomAplicado) > 0.01) this.posicionar(angulo);
    else if (girando) this.girarRotores(angulo);
    if (this.trocaPendente) this.mapa.triggerRepaint();
    if (this.modelos.size === 0) return;
    // a espessura do contorno é em px de CSS; o buffer de desenho tem a densidade da tela
    const dpr = gl.drawingBufferWidth / Math.max(1, this.mapa.getCanvas().clientWidth);
    this.uTela.value.set(gl.drawingBufferWidth, gl.drawingBufferHeight);
    this.uEspessura.value = (this.satelite ? PX_DO_CONTORNO_NO_SATELITE : PX_DO_CONTORNO) * dpr;
    this.camera.projectionMatrix.fromArray(matriz).multiply(this.translacao.makeTranslation(this.origem.x, this.origem.y, 0));
    r.resetState();
    r.render(this.cena, this.camera);
    // rotor girando com o mapa parado: pede o próximo quadro a ~30 por segundo, não a cada
    // vsync (cada quadro redesenha o mapa inteiro; no celular isso é bateria e calor)
    if (girando && !this.repinturaAgendada) {
      this.repinturaAgendada = true;
      // 15 quadros por segundo no celular
      const espera = this.mapa.getCanvas().clientWidth < LARGURA_DO_CELULAR ? 66 : 33;
      window.setTimeout(() => {
        this.repinturaAgendada = false;
        if (!this.destruida) this.mapa.triggerRepaint();
      }, espera);
    }
  }

  // ── medição (só leitura; usada por window.__atlas em desenvolvimento) ──

  /** Bbox e vértices do modelo no espaço dele (o mesmo das matrizes de instância). O rotor
   *  entra pelo disco que ele varre em torno do cubo; a casca do contorno não entra (é a
   *  mesma malha, alargada 1,1 px na tela). */
  private formaDo(arquivo: string): FormaDoModelo | null {
    const salva = this.formas.get(arquivo);
    if (salva) return salva;
    const modelo = this.modelos.get(arquivo);
    if (!modelo) return null;
    const corpo: number[] = [];
    const laje: number[] = [];
    const MAX = 4000;
    for (const parte of modelo.partes) {
      if (parte.malha.material === this.matContorno) continue;
      const pos = parte.malha.geometry.getAttribute('position');
      if (!pos) continue;
      const destino = parte.chao ? laje : corpo;
      if (parte.rotor && modelo.cubo) {
        let r = 0;
        let z0 = Infinity;
        let z1 = -Infinity;
        for (let i = 0; i < pos.count; i++) {
          r = Math.max(r, Math.hypot(pos.getX(i), pos.getY(i)));
          z0 = Math.min(z0, pos.getZ(i));
          z1 = Math.max(z1, pos.getZ(i));
        }
        const c = modelo.cubo;
        for (const x of [-r, r]) for (const y of [-r, r]) for (const z of [z0, z1]) destino.push(c.x + x, c.y + y, c.z + z);
        continue;
      }
      const passo = Math.max(1, Math.ceil(pos.count / MAX));
      for (let i = 0; i < pos.count; i += passo) destino.push(pos.getX(i), pos.getY(i), pos.getZ(i));
    }
    const caixaDe = (v: number[]) => {
      const b = new THREE.Box3();
      const t = new THREE.Vector3();
      for (let i = 0; i < v.length; i += 3) b.expandByPoint(t.set(v[i], v[i + 1], v[i + 2]));
      return b;
    };
    const caixa = caixaDe(corpo);
    const caixaComLaje = caixaDe(laje).union(caixa);
    const forma = { caixa, caixaComLaje, vertices: new Float32Array(corpo), verticesDaLaje: new Float32Array(laje) };
    this.formas.set(arquivo, forma);
    return forma;
  }

  /** Caixa de tela de cada instância desenhada no último quadro: os 8 cantos da bbox do
   *  modelo (com a laje só quando ela está desenhada) e todos os vértices, projetados pela
   *  matriz da instância e pela da câmera do último quadro. Px de CSS, relativos ao canvas. */
  caixasDeTela(justa = true): CaixaDeTela[] {
    // o mesmo corte de desenhar(): inativa ou abaixo do zoom, nada está desenhado
    if (!this.ativa || this.mapa.getZoom() < ZOOM_DAS_MAQUETES) return [];
    const canvas = this.mapa.getCanvas();
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const proj = this.camera.projectionMatrix;
    const total = m4();
    const v = new THREE.Vector4();
    const projetar = (x: number, y: number, z: number): [number, number] | null => {
      v.set(x, y, z, 1).applyMatrix4(total);
      if (v.w <= 1e-9) return null;
      return [((v.x / v.w + 1) / 2) * w, ((1 - v.y / v.w) / 2) * h];
    };
    const saida: CaixaDeTela[] = [];
    for (const d of this.desenhadas) {
      if (d.saindo) continue;
      const forma = this.formaDo(d.arquivo);
      total.multiplyMatrices(proj, d.base);
      const pe = projetar(0, 0, 0);
      let caixa: [number, number, number, number] | null = null;
      let caixaJusta: [number, number, number, number] | null = null;
      if (forma) {
        const b = d.laje ? forma.caixaComLaje : forma.caixa;
        let x0 = Infinity;
        let y0 = Infinity;
        let x1 = -Infinity;
        let y1 = -Infinity;
        let atras = false;
        for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) {
          const q = projetar(x, y, z);
          if (!q) {
            atras = true;
            continue;
          }
          x0 = Math.min(x0, q[0]);
          y0 = Math.min(y0, q[1]);
          x1 = Math.max(x1, q[0]);
          y1 = Math.max(y1, q[1]);
        }
        if (!atras && Number.isFinite(x0)) caixa = [x0, y0, x1, y1];
        x0 = y0 = Infinity;
        x1 = y1 = -Infinity;
        atras = false;
        for (const lista of !justa ? [] : d.laje ? [forma.vertices, forma.verticesDaLaje] : [forma.vertices]) {
          for (let i = 0; i < lista.length; i += 3) {
            const q = projetar(lista[i], lista[i + 1], lista[i + 2]);
            if (!q) {
              atras = true;
              continue;
            }
            x0 = Math.min(x0, q[0]);
            y0 = Math.min(y0, q[1]);
            x1 = Math.max(x1, q[0]);
            y1 = Math.max(y1, q[1]);
          }
        }
        if (!atras && Number.isFinite(x0)) caixaJusta = [x0, y0, x1, y1];
      }
      saida.push({ ponto: d.ponto, arquivo: d.arquivo, px: d.px, caixa, caixaJusta, pe, vertical: d.vertical });
    }
    return saida;
  }

  /** Há aerogerador girando agora? (o controle usa para saber se o mapa fica ocioso) */
  get animando(): boolean {
    return this.ativa && this.temRotor && !this.reduzido && this.mapa.getZoom() >= ZOOM_DAS_MAQUETES;
  }

  destruir() {
    this.destruida = true;
    this.mapa.off('sourcedata', this.aoChegarRelevo);
    for (const modelo of this.modelos.values()) for (const p of modelo.partes) p.malha.geometry.dispose();
    this.modelos.clear();
    this.matPapel.dispose();
    this.matTinta.dispose();
    this.matPainel.dispose();
    this.matChao.dispose();
    this.matEstrutura.dispose();
    this.matEstruturaTorre.dispose();
    this.matAcento.dispose();
    this.matContorno.dispose();
    // o contexto WebGL é do mapa: não se chama renderizador.dispose() com forceContextLoss
    this.renderizador = null;
  }
}
