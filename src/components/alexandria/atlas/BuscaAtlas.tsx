// Atlas da Alexandria v3 — busca por nome: usinas, subestações, linhas,
// reservatórios, submercados, bacias hidrográficas e, do capítulo do
// combustível, gasodutos, refinarias, terminais, UPGN, campos e bacias
// sedimentares.
//
// O índice vem em dois tempos, a partir do primeiro foco no campo: primeiro o
// que o mapa já tem em memória (usinas a partir de 5 MW, subestações, linhas,
// reservatórios, submercados, bacias); depois, quando o arquivo chega, as usinas
// menores, que o mapa só carrega em zoom alto, e os ativos de gás e petróleo da
// ANP, que o mapa só carrega no capítulo do combustível. Enquanto elas não chegam, a busca
// não declara ausência: diz que ainda está procurando.
//
// O campo segue o padrão combobox/listbox do ARIA: o foco do DOM fica no campo,
// a opção ativa é apontada por aria-activedescendant, e o número de resultados
// é anunciado numa região viva própria.

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { Geometry, Position } from 'geojson';
import {
  carregarBacias,
  carregarBaciasSedimentares,
  carregarCamposProducao,
  carregarGasodutos,
  carregarInstalacoesCombustivel,
  carregarLinhas,
  carregarReservatorios,
  carregarSubestacoes,
  carregarSubmercados,
  carregarUsinasMenores,
  carregarUsinasPrincipais,
  inteiro,
  potencia,
  type FeicaoUsina,
} from '@/lib/alexandria/atlas/dados';
import { siglaDoGnl } from './mapa/combustivel';
import { km, nomeDeExibicao } from './nomes';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { PALETA, TONS_DA_DISTRIBUICAO, corDaInstalacao, type TipoDeInstalacao } from '@/lib/alexandria/atlas/estilo';
import { carregarAreasDistribuicao } from '@/lib/alexandria/atlas/dados';
import { pontoDoRotulo } from './mapa/distribuicao';

/** A marca de cada resultado: a mesma forma da legenda (disco de usina na cor da
 *  fonte, quadrado vazado de subestação, traço de linha e de duto, área). */
function MarcaDoTipo({ e, modo }: { e: Entrada; modo: ModoV3 }) {
  const p = PALETA[modo];
  const pr = e.props;
  let forma = 'area';
  let cor: string = p.categoria.hidro;
  switch (e.tipo) {
    case 'usina':
      forma = 'disco';
      cor = p.categoria[pr.cat as keyof typeof p.categoria] ?? cor;
      break;
    case 'subestacao':
      forma = 'quadro';
      cor = 'var(--tinta)';
      break;
    case 'linha':
      forma = 'traco';
      cor = pr.cc === 1 ? p.linha.cc : 'var(--tinta)';
      break;
    case 'gasoduto':
      forma = 'traco';
      cor = p.categoria.gas;
      break;
    case 'instalacao':
      forma = 'losango';
      cor = corDaInstalacao(String(pr.tipo) as TipoDeInstalacao, p);
      break;
    case 'campo':
      cor = pr.fluido === 'gas' ? p.categoria.gas : p.categoria.oleo;
      break;
    case 'bacia-sedimentar':
      cor = p.sedimento;
      break;
    case 'distribuidora':
      cor = pr.tipo === 'permissionária' ? TONS_DA_DISTRIBUICAO[modo].permissao : 'var(--tinta)';
      break;
    default:
      cor = 'var(--tinta-fraca)';
  }
  return <span className={`atl-marca atl-marca-${forma}`} style={{ '--cor': cor } as React.CSSProperties} aria-hidden="true" />;
}
import { ROTULO_SUBSISTEMA, SUBSISTEMA_DO_SUBMERCADO, type AtivoSelecionado, type TipoDeAtivo } from '@/lib/alexandria/atlas/tipos';

interface Entrada {
  tipo: TipoDeAtivo;
  chave: string;
  nome: string;
  plano: string;
  peso: number;
  props: Record<string, unknown>;
  lngLat: [number, number];
}

const LIMITE = 9;
/** Submercado e bacia são poucos e grandes: passam na frente dos homônimos. */
const PESO_DE_AREA = Number.MAX_SAFE_INTEGER;

const plano = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function meio(g: Geometry): [number, number] {
  if (g.type === 'Point') return [g.coordinates[0], g.coordinates[1]];
  const linha: Position[] = g.type === 'LineString' ? g.coordinates : g.type === 'MultiLineString' ? g.coordinates[0] : [];
  const p = linha[Math.floor(linha.length / 2)];
  return p ? [p[0], p[1]] : centroDaCaixa(g);
}

/** Centro da caixa envolvente — para áreas (submercado, bacia). */
function centroDaCaixa(g: Geometry): [number, number] {
  const acc = [180, 90, -180, -90];
  const visita = (c: unknown): void => {
    if (typeof (c as number[])[0] === 'number') {
      const [x, y] = c as number[];
      if (x < acc[0]) acc[0] = x;
      if (y < acc[1]) acc[1] = y;
      if (x > acc[2]) acc[2] = x;
      if (y > acc[3]) acc[3] = y;
    } else for (const d of c as unknown[]) visita(d);
  };
  if (g.type !== 'GeometryCollection') visita(g.coordinates);
  return acc[0] > acc[2] ? [0, 0] : [(acc[0] + acc[2]) / 2, (acc[1] + acc[3]) / 2];
}

function entradasDeUsinas(us: FeicaoUsina[]): Entrada[] {
  const e: Entrada[] = new Array(us.length);
  for (let i = 0; i < us.length; i++) {
    const u = us[i];
    const p = u.properties;
    e[i] = { tipo: 'usina', chave: p.ceg, nome: p.nome, plano: plano(p.nome), peso: p.kw, props: p as unknown as Record<string, unknown>, lngLat: [u.geometry.coordinates[0], u.geometry.coordinates[1]] };
  }
  return e;
}

/** O detalhe é escrito só para os resultados exibidos (no máximo nove). */
function detalheDe(e: Entrada): string {
  const p = e.props;
  switch (e.tipo) {
    case 'usina':
      return `${p.tipo} · ${p.uf} · ${potencia(p.kw as number)}`;
    case 'subestacao':
      return `subestação · ${p.uf ?? ''}${p.kv ? ` · ${p.kv} kV` : ''}`;
    case 'linha':
      return `${p.cc === 1 ? 'corrente contínua' : 'linha'}${p.kv ? ` · ${p.kv} kV` : ''} · ${km(p.km) ?? 'extensão sem dado na fonte'}${p.op == null && p.opAntesDe == null ? ' · prevista' : ''}`;
    case 'reservatorio':
      return p.rio ? `reservatório · rio ${nomeDeExibicao(String(p.rio))}` : 'reservatório';
    case 'submercado':
      return 'submercado';
    case 'bacia':
      return 'bacia hidrográfica';
    case 'gasoduto':
      return `gasoduto · ${p.trecho ?? 'trecho sem nome na fonte'}${p.diam != null ? ` · ${p.diam} pol` : ''}`;
    case 'instalacao':
      return `${ROTULO_DA_INSTALACAO[String(p.tipo)] ?? 'instalação'} · ${p.uf ?? ''}${p.tipo === 'refinaria' && p.bpd != null ? ` · ${inteiro(p.bpd as number)} barris por dia` : ''}`;
    case 'campo':
      return `campo de produção${p.bacia ? ` · bacia ${p.bacia}` : ''}`;
    case 'bacia-sedimentar':
      return p.sit === 'maritima' ? 'bacia sedimentar marítima' : 'bacia sedimentar terrestre';
    case 'distribuidora':
      return `distribuidora · ${p.tipo === 'permissionária' ? 'permissionária' : 'concessionária'}${p.contrato ? ` · contrato ${p.contrato}` : ''}`;
    default:
      return '';
  }
}

const ROTULO_DA_INSTALACAO: Record<string, string> = { refinaria: 'refinaria', gnl: 'terminal de GNL', upgn: 'UPGN', terminal: 'terminal de líquidos' };

let indiceBase: Promise<Entrada[]> | null = null;
let indiceCombustivel: Promise<Entrada[]> | null = null;
let indiceMenores: Promise<Entrada[]> | null = null;

/** O que o mapa já carrega de saída: responde sem esperar as usinas menores. */
function montarBase(): Promise<Entrada[]> {
  indiceBase ??= Promise.all([carregarUsinasPrincipais(), carregarSubestacoes(), carregarLinhas(), carregarReservatorios(), carregarSubmercados(), carregarBacias()]).then(
    ([grandes, subestacoes, linhas, reservatorios, submercados, bacias]) => {
      const e: Entrada[] = entradasDeUsinas(grandes);
      for (const f of subestacoes.features) {
        const p = f.properties as Record<string, unknown>;
        const nome = String(p.n ?? '');
        e.push({ tipo: 'subestacao', chave: String(p.id), nome: `SE ${nome}`, plano: plano(nome), peso: Number(p.kv ?? 0) * 100, props: p, lngLat: meio(f.geometry) });
      }
      for (const f of linhas.features) {
        const p = f.properties as Record<string, unknown>;
        const nome = String(p.n ?? '');
        e.push({ tipo: 'linha', chave: String(p.id), nome, plano: plano(nome), peso: Number(p.kv ?? 0) * 50, props: p, lngLat: meio(f.geometry) });
      }
      for (const f of reservatorios.features) {
        const p = f.properties as Record<string, unknown>;
        const nome = String(p.n ?? '');
        e.push({ tipo: 'reservatorio', chave: String(p.cod), nome: `Reservatório ${nome}`, plano: plano(nome), peso: Number(p.vutil ?? 0), props: p, lngLat: meio(f.geometry) });
      }
      for (const f of submercados.features) {
        const sub = SUBSISTEMA_DO_SUBMERCADO[String((f.properties as Record<string, unknown> | null)?.id ?? '')];
        if (!sub) continue;
        const rotulo = ROTULO_SUBSISTEMA[sub];
        e.push({ tipo: 'submercado', chave: sub, nome: `Submercado ${rotulo}`, plano: plano(`submercado ${rotulo}`), peso: PESO_DE_AREA, props: { ...(f.properties as Record<string, unknown>), sub }, lngLat: centroDaCaixa(f.geometry) });
      }
      const nomesDeBacia = new Set<string>();
      for (const f of bacias.features) {
        const p = f.properties as Record<string, unknown>;
        const nome = String(p.Nome_Bacia ?? '');
        if (!nome || nomesDeBacia.has(nome)) continue;
        nomesDeBacia.add(nome);
        e.push({ tipo: 'bacia', chave: nome, nome: `Bacia do ${nome}`, plano: plano(`bacia ${nome}`), peso: PESO_DE_AREA, props: p, lngLat: centroDaCaixa(f.geometry) });
      }
      return e;
    },
  );
  indiceBase.catch(() => (indiceBase = null));
  return indiceBase;
}

/** Gás e petróleo (ANP): gasoduto pelo nome do duto, refinaria, terminal, UPGN, campo e bacia
 *  sedimentar. Chegam à parte: a busca responde antes com o resto. */
function montarCombustivel(): Promise<Entrada[]> {
  indiceCombustivel ??= Promise.all([carregarGasodutos(), carregarInstalacoesCombustivel(), carregarCamposProducao(), carregarBaciasSedimentares()]).then(([dutos, inst, campos, bacias]) => {
    const e: Entrada[] = [];
    for (const f of dutos.features) {
      const p = f.properties as unknown as Record<string, unknown>;
      const nome = String(p.duto ?? p.trecho ?? p.id);
      e.push({ tipo: 'gasoduto', chave: String(p.id), nome, plano: plano(`gasoduto ${nome} ${p.trecho ?? ''}`), peso: Number(p.diam ?? 0) * 40, props: p, lngLat: meio(f.geometry) });
    }
    for (const f of inst.features) {
      const p = f.properties as unknown as Record<string, unknown>;
      const nome = String(p.nome ?? p.id);
      // a sigla vem primeiro: quem procura 'REPLAN' ou 'TRSP' acha a instalação antes da subestação homônima
      const sigla = p.tipo === 'refinaria' ? String(p.sigla ?? '') : p.tipo === 'gnl' ? (siglaDoGnl(nome) ?? '') : '';
      const extra = p.tipo === 'refinaria' ? 'refinaria' : p.tipo === 'gnl' ? 'terminal gnl' : p.tipo === 'upgn' ? 'upgn' : 'terminal';
      const peso = p.tipo === 'gnl' ? 4e6 : p.tipo === 'refinaria' ? 3e6 + Number(p.bpd ?? 0) : p.tipo === 'upgn' ? 2e6 : 1e6;
      e.push({ tipo: 'instalacao', chave: String(p.id), nome, plano: plano(`${sigla} ${nome} ${extra}`.trim()), peso, props: p, lngLat: meio(f.geometry) });
    }
    for (const f of campos.features) {
      const p = f.properties as unknown as Record<string, unknown>;
      const nome = String(p.nome ?? p.id);
      e.push({ tipo: 'campo', chave: String(p.id), nome: `Campo ${nome}`, plano: plano(`campo ${nome}`), peso: Number(p.area ?? 0), props: p, lngLat: centroDaCaixa(f.geometry) });
    }
    for (const f of bacias.features) {
      const p = f.properties as unknown as Record<string, unknown>;
      const nome = String(p.nome ?? p.id);
      e.push({ tipo: 'bacia-sedimentar', chave: String(p.id), nome, plano: plano(`${nome} sedimentar`), peso: PESO_DE_AREA - 1, props: p, lngLat: centroDaCaixa(f.geometry) });
    }
    return e;
  });
  indiceCombustivel.catch(() => (indiceCombustivel = null));
  return indiceCombustivel;
}

/** Áreas de atuação das distribuidoras (ANEEL · BDGD): pelo nome e pelo tipo de outorga. O ponto
 *  da entrada fica dentro da área (o do rótulo), para a ficha medir a sobreposição ali. */
let indiceDistribuicao: Promise<Entrada[]> | null = null;
function montarDistribuicao(): Promise<Entrada[]> {
  indiceDistribuicao ??= carregarAreasDistribuicao().then((fc) =>
    fc.features.map((f) => {
      const p = f.properties;
      const r = pontoDoRotulo(f.geometry);
      return {
        tipo: 'distribuidora' as const,
        chave: String(p.codigo),
        nome: p.nome,
        plano: plano(`${p.nome} distribuidora ${p.tipo}`),
        // área grande, como submercado e bacia: passa na frente das usinas homônimas; a
        // concessionária antes da permissionária
        peso: p.tipo === 'concessionária' ? PESO_DE_AREA - 2 : PESO_DE_AREA - 3,
        props: p as unknown as Record<string, unknown>,
        lngLat: r ? r.c : centroDaCaixa(f.geometry),
      };
    }),
  );
  indiceDistribuicao.catch(() => (indiceDistribuicao = null));
  return indiceDistribuicao;
}

/** Usinas abaixo de 5 MW: chegam depois, acrescentadas de uma vez. */
function montarMenores(): Promise<Entrada[]> {
  indiceMenores ??= carregarUsinasMenores().then(entradasDeUsinas);
  indiceMenores.catch(() => (indiceMenores = null));
  return indiceMenores;
}

function varrer(termo: string, listas: (Entrada[] | null)[]): { achados: Entrada[]; total: number } {
  const t = plano(termo.trim());
  if (t.length < 2) return { achados: [], total: 0 };
  const palavras = t.split(/\s+/);
  const saida: Entrada[] = [];
  for (const lista of listas) if (lista) for (const e of lista) if (palavras.every((w) => e.plano.includes(w))) saida.push(e);
  // primeiro quem começa pelo termo, depois por tamanho (potência, tensão, volume)
  saida.sort((a, b) => Number(b.plano.startsWith(t)) - Number(a.plano.startsWith(t)) || b.peso - a.peso);
  return { achados: saida.slice(0, LIMITE), total: saida.length };
}

type Estado = 'parado' | 'pendente' | 'pronto' | 'falhou';

export function BuscaAtlas({ aoEscolher, modo = 'claro' }: { aoEscolher: (a: AtivoSelecionado) => void; modo?: ModoV3 }) {
  const [termo, setTermo] = useState('');
  const [termoVarrido, setTermoVarrido] = useState('');
  const [base, setBase] = useState<Entrada[] | null>(null);
  const [menores, setMenores] = useState<Entrada[] | null>(null);
  const [combustivel, setCombustivel] = useState<Entrada[] | null>(null);
  const [distribuicao, setDistribuicao] = useState<Entrada[] | null>(null);
  const [estadoBase, setEstadoBase] = useState<Estado>('parado');
  const [estadoMenores, setEstadoMenores] = useState<Estado>('parado');
  const [aberto, setAberto] = useState(false);
  const [foco, setFoco] = useState(-1);
  const caixa = useRef<HTMLDivElement | null>(null);
  const idLista = useId();
  const idOpcao = (i: number) => `${idLista}-op-${i}`;

  const preparar = () => {
    if (estadoBase === 'parado' || estadoBase === 'falhou') {
      setEstadoBase('pendente');
      montarBase().then(
        (e) => {
          setBase(e);
          setEstadoBase('pronto');
        },
        () => setEstadoBase('falhou'),
      );
    }
    // gás e petróleo: sem estado próprio na tela; se falhar, a busca segue sem eles e tenta de novo no próximo foco
    if (!combustivel) montarCombustivel().then(setCombustivel, () => undefined);
    // distribuidoras: o mesmo trato (o arquivo fica em cache para o mapa, se a camada for ligada)
    if (!distribuicao) montarDistribuicao().then(setDistribuicao, () => undefined);
    if (estadoMenores === 'parado' || estadoMenores === 'falhou') {
      setEstadoMenores('pendente');
      montarMenores().then(
        (e) => {
          setMenores(e);
          setEstadoMenores('pronto');
        },
        () => setEstadoMenores('falhou'),
      );
    }
  };

  // varredura com folga curta: não refaz a lista a cada tecla de quem digita rápido
  useEffect(() => {
    if (termo === termoVarrido) return;
    const t = window.setTimeout(() => setTermoVarrido(termo), 90);
    return () => window.clearTimeout(t);
  }, [termo, termoVarrido]);

  const { achados, total } = useMemo(() => varrer(termoVarrido, [base, combustivel, distribuicao, menores]), [termoVarrido, base, combustivel, distribuicao, menores]);

  // lista nova: nenhuma opção ativa até o leitor descer com a seta
  useEffect(() => setFoco(-1), [achados]);

  useEffect(() => {
    const fora = (e: PointerEvent) => {
      if (caixa.current && !caixa.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener('pointerdown', fora);
    return () => document.removeEventListener('pointerdown', fora);
  }, []);

  const escolher = (e: Entrada) => {
    aoEscolher({ tipo: e.tipo, chave: e.chave, props: e.props, lngLat: e.lngLat });
    setTermo('');
    setTermoVarrido('');
    setAberto(false);
  };

  const digitado = termo.trim().length >= 2;
  const mostra = aberto && digitado;
  const temLista = mostra && achados.length > 0;
  const ativo = temLista && foco >= 0 && foco < achados.length ? foco : -1;

  useEffect(() => {
    if (ativo < 0) return;
    document.getElementById(`${idLista}-op-${ativo}`)?.scrollIntoView({ block: 'nearest' });
  }, [ativo, idLista]);

  // linha de estado: o que está visível na lista e o que é anunciado
  const procurandoMenores = estadoMenores === 'pendente';
  let estado: string | null = null;
  if (digitado) {
    if (estadoBase === 'pendente' && !base) estado = 'Montando o índice de busca…';
    else if (estadoBase === 'falhou' && !base) estado = 'A busca não conseguiu carregar os dados. Tente de novo.';
    else if (achados.length === 0 && procurandoMenores) estado = 'Procurando também nas usinas abaixo de 5 MW…';
    else if (achados.length === 0 && estadoMenores === 'falhou') estado = 'Nada com esse nome nos demais dados do Atlas. As usinas abaixo de 5 MW não carregaram; tente de novo.';
    else if (achados.length === 0) estado = 'Nada com esse nome nos dados do Atlas.';
    else if (procurandoMenores) estado = 'Procurando também nas usinas abaixo de 5 MW…';
    else if (estadoMenores === 'falhou') estado = 'As usinas abaixo de 5 MW não carregaram; a busca cobre as demais. Tente de novo.';
  }

  const contagem = !digitado || termo !== termoVarrido || !base ? '' : total === 0 ? '' : total > LIMITE ? `${total} resultados; os ${LIMITE} primeiros estão na lista.` : total === 1 ? '1 resultado.' : `${total} resultados.`;
  const anuncio = mostra ? [contagem, estado].filter(Boolean).join(' ') : '';

  return (
    <div
      className="atl-busca"
      ref={caixa}
      onBlur={(e) => {
        if (!caixa.current?.contains(e.relatedTarget as Node | null)) setAberto(false);
      }}
    >
      <input
        type="search"
        className="atl-campo"
        placeholder="Procurar usina, linha, gasoduto, refinaria, campo…"
        aria-label="Procurar usina, subestação, linha, reservatório, submercado, bacia, área de distribuidora, gasoduto, refinaria, terminal, UPGN ou campo de petróleo e gás"
        role="combobox"
        aria-expanded={temLista}
        aria-controls={temLista ? idLista : undefined}
        aria-autocomplete="list"
        aria-activedescendant={ativo >= 0 ? idOpcao(ativo) : undefined}
        value={termo}
        onFocus={() => {
          preparar();
          setAberto(true);
        }}
        onChange={(e) => {
          setTermo(e.target.value);
          setAberto(true);
        }}
        onKeyDown={(e) => {
          const n = achados.length;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setAberto(true);
            if (n) setFoco((f) => (f < 0 ? 0 : Math.min(n - 1, f + 1)));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (n) setFoco((f) => (f <= 0 ? 0 : f - 1));
          } else if ((e.key === 'Home' || e.key === 'End') && ativo >= 0) {
            // com uma opção ativa, Home e End andam na lista; sem ela, no texto
            e.preventDefault();
            setFoco(e.key === 'Home' ? 0 : n - 1);
          } else if (e.key === 'Enter' && mostra) {
            // quem aperta Enter antes da varredura terminar escolhe sobre o termo digitado
            const lista = termo === termoVarrido ? achados : varrer(termo, [base, combustivel, distribuicao, menores]).achados;
            const escolhido = lista[ativo >= 0 && termo === termoVarrido ? ativo : 0];
            if (escolhido) {
              e.preventDefault();
              escolher(escolhido);
            }
          } else if (e.key === 'Escape' && mostra) {
            // fecha só a lista: não apaga o termo nem chega à ficha aberta
            e.preventDefault();
            e.stopPropagation();
            setAberto(false);
          }
        }}
      />
      {mostra && (temLista || estado) && (
        // o mousedown aqui não tira o foco do campo: o clique na opção chega
        <div className="atl-resultados atl-busca-lista" onMouseDown={(e) => e.preventDefault()}>
          {temLista && (
            <ul id={idLista} role="listbox" aria-label="Resultados da busca">
              {achados.map((e, i) => (
                <li
                  key={`${e.tipo}:${e.chave}:${i}`}
                  id={idOpcao(i)}
                  role="option"
                  aria-selected={i === ativo}
                  className={`atl-opcao-busca${i === ativo ? ' em-foco' : ''}`}
                  onClick={() => escolher(e)}
                  onPointerEnter={() => setFoco(i)}
                >
                  <MarcaDoTipo e={e} modo={modo} />
                  <span className="atl-opcao-nome">{nomeDeExibicao(e.nome)}</span>
                  <span className="atl-opcao-detalhe">{detalheDe(e)}</span>
                </li>
              ))}
            </ul>
          )}
          {estado && <p className="atl-busca-estado">{estado}</p>}
        </div>
      )}
      <p className="so-leitor" role="status">
        {anuncio}
      </p>
    </div>
  );
}
