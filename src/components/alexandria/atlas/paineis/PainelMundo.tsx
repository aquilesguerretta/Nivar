// Atlas da Alexandria v3 — capítulo "O mundo": a matriz elétrica de cada país.
// Dado: perfis do Our World in Data servidos pela API da NIVAR; fronteiras da
// Natural Earth 1:110m. As derivações (cor, fonte dominante) são as mesmas do
// Atlas anterior (src/lib/atlas/atlasDerivacoes.ts).

import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ComoLer } from './PainelRede';
import type { Geometry, Position } from 'geojson';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { CAMPOS_MATRIZ, nomePaisPt, type MundoAtlas } from '@/lib/atlas/worldApi';
import { contarPorDominante, type ModoCor } from '@/lib/atlas/atlasDerivacoes';
import type { MatrizGeracao } from '@/lib/atlas/worldApi';
import { corDaFonteDoMundo, corNaRampaDoMundo } from '@/lib/alexandria/atlas/estilo';
import type { AtivoSelecionado } from '@/lib/alexandria/atlas/tipos';
import type { CameraAlvo } from '../mapa/controleDoMapa';

type ChaveFonte = keyof MatrizGeracao;

interface PainelMundoProps {
  mundo: MundoAtlas | null;
  erro: string | null;
  modoCor: ModoCor;
  aoMudarModo: (m: ModoCor) => void;
  /** claro ou noturno: a legenda usa as mesmas funções de cor que pintam o mapa */
  modo: ModoV3;
}

const MODOS: { id: ModoCor; nome: string; resumo: string }[] = [
  { id: 'matriz', nome: 'Fonte dominante', resumo: 'A fonte com a maior participação na geração elétrica de cada país.' },
  { id: 'renovavel', nome: 'Participação de renováveis', resumo: 'Quanto da eletricidade do país vem de fonte renovável.' },
  { id: 'intensidade', nome: 'Intensidade de carbono', resumo: 'Gramas de CO₂ por quilowatt-hora gerado.' },
];

const plano = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

type Caixa = [number, number, number, number];

/** Anel sem salto no antimeridiano: longitudes contínuas, podendo sair de ±180. */
function anelContinuo(pts: Position[]): Position[] {
  let desloc = 0;
  const saida: Position[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const d = pts[i][0] - pts[i - 1][0];
    if (d > 180) desloc -= 360;
    else if (d < -180) desloc += 360;
    saida.push([pts[i][0] + desloc, pts[i][1]]);
  }
  return saida;
}

function caixaDosPontos(pts: Position[]): Caixa {
  const acc: Caixa = [Infinity, Infinity, -Infinity, -Infinity];
  for (const [x, y] of pts) {
    acc[0] = Math.min(acc[0], x);
    acc[1] = Math.min(acc[1], y);
    acc[2] = Math.max(acc[2], x);
    acc[3] = Math.max(acc[3], y);
  }
  return acc;
}

/** Caixa do país: cada polígono com anel contínuo; os demais deslocados em
 *  múltiplos de 360° para ficarem a menos de 180° do maior. Assim Fiji e a
 *  Rússia, que cruzam o antimeridiano, têm caixa estreita e não de 360°. */
function caixa(g: Geometry): Caixa {
  const poligonos: Position[][][] = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
  const caixas = poligonos.filter((pl) => pl[0]?.length).map((pl) => caixaDosPontos(anelContinuo(pl[0])));
  if (!caixas.length) return [-180, -90, 180, 90];
  const area = (c: Caixa) => (c[2] - c[0]) * (c[3] - c[1]);
  const ref = caixas.reduce((a, b) => (area(b) > area(a) ? b : a));
  const meioRef = (ref[0] + ref[2]) / 2;
  const acc: Caixa = [Infinity, Infinity, -Infinity, -Infinity];
  for (const c of caixas) {
    const k = Math.round((meioRef - (c[0] + c[2]) / 2) / 360) * 360;
    acc[0] = Math.min(acc[0], c[0] + k);
    acc[1] = Math.min(acc[1], c[1]);
    acc[2] = Math.max(acc[2], c[2] + k);
    acc[3] = Math.max(acc[3], c[3]);
  }
  return acc;
}

/** Longitude reduzida a −180…180. */
const reduzir = (lon: number) => ((((lon + 180) % 360) + 360) % 360) - 180;

/** Câmera para a caixa do país. Caixa dentro de ±180: enquadra por ela. Caixa
 *  que passa do antimeridiano: centro reduzido e zoom pela largura. Caixa que
 *  ainda passa de 180° circunda um polo (a Antártida): centra no polo. */
function cameraDoPais(cx: Caixa): CameraAlvo {
  const largura = cx[2] - cx[0];
  const meioLat = (cx[1] + cx[3]) / 2;
  if (largura > 180) return { centro: [0, meioLat < 0 ? -85 : 85], zoom: 2 };
  if (cx[0] >= -180 && cx[2] <= 180) return { limites: cx };
  const zoom = Math.max(1.5, Math.min(6, Math.log2(360 / Math.max(largura, (cx[3] - cx[1]) * 2, 1))));
  return { centro: [reduzir((cx[0] + cx[2]) / 2), meioLat], zoom };
}

/** Tetos das escalas contínuas: os mesmos de AtlasV3 (TETO_DO_MUNDO). */
const TETO = { renovavel: 100, intensidade: 1000 } as const;

/** Países do mapa com o nome em português, em ordem alfabética. */
function usarPaises(mundo: MundoAtlas | null) {
  return useMemo(() => {
    if (!mundo) return [];
    return mundo.features
      .filter((f) => f.properties.a3)
      .map((f) => ({ f, a3: f.properties.a3 as string, nome: nomePaisPt(f.properties, mundo.porIso.get(f.properties.a3 as string)?.countryName) }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }, [mundo]);
}

/** A busca do palco no capítulo O mundo: procura países, no mesmo padrão de
 *  combobox da busca do Brasil (foco no campo, opção ativa por aria-activedescendant). */
export function BuscaPais({ mundo, aoEscolher, aoEnquadrar }: { mundo: MundoAtlas | null; aoEscolher: (a: AtivoSelecionado) => void; aoEnquadrar: (c: CameraAlvo) => void }) {
  const [termo, setTermo] = useState('');
  const [aberto, setAberto] = useState(false);
  const [foco, setFoco] = useState(-1);
  const idLista = useId();
  const paises = usarPaises(mundo);
  const achados = useMemo(() => {
    const t = plano(termo.trim());
    if (t.length < 2) return [];
    return paises.filter((p) => plano(p.nome).includes(t)).slice(0, 8);
  }, [termo, paises]);
  const digitado = termo.trim().length >= 2;
  const temLista = aberto && achados.length > 0;
  const ativo = temLista && foco >= 0 && foco < achados.length ? foco : -1;
  const estado = !digitado || !aberto ? null : !mundo ? 'Carregando os países…' : achados.length === 0 ? 'Nenhum país com esse nome na base de fronteiras.' : null;

  const escolher = (p: (typeof paises)[number]) => {
    const cx = caixa(p.f.geometry);
    aoEscolher({ tipo: 'pais', chave: p.a3, props: { ...p.f.properties, nomePt: p.nome }, lngLat: [reduzir((cx[0] + cx[2]) / 2), (cx[1] + cx[3]) / 2] });
    aoEnquadrar(cameraDoPais(cx));
    setTermo('');
    setAberto(false);
  };

  return (
    <div
      className="atl-busca"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setAberto(false);
      }}
    >
      <input
        type="search"
        className="atl-campo"
        placeholder="Procurar um país"
        aria-label="Procurar um país"
        role="combobox"
        aria-expanded={temLista}
        aria-controls={temLista ? idLista : undefined}
        aria-autocomplete="list"
        aria-activedescendant={ativo >= 0 ? `${idLista}-op-${ativo}` : undefined}
        value={termo}
        onFocus={() => setAberto(true)}
        onChange={(e) => {
          setTermo(e.target.value);
          setFoco(-1);
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
          } else if (e.key === 'Enter' && achados.length) {
            e.preventDefault();
            escolher(achados[ativo >= 0 ? ativo : 0]);
          } else if (e.key === 'Escape' && aberto) {
            e.preventDefault();
            e.stopPropagation();
            setAberto(false);
          }
        }}
      />
      {aberto && (temLista || estado) && (
        <div className="atl-resultados atl-busca-lista" onMouseDown={(e) => e.preventDefault()}>
          {temLista && (
            <ul id={idLista} role="listbox" aria-label="Países">
              {achados.map((p, i) => (
                <li key={p.a3} id={`${idLista}-op-${i}`} role="option" aria-selected={i === ativo} className={`atl-opcao-busca${i === ativo ? ' em-foco' : ''}`} onClick={() => escolher(p)} onPointerEnter={() => setFoco(i)}>
                  <span className="atl-opcao-nome">{p.nome}</span>
                  <span className="atl-opcao-detalhe">{mundo?.porIso.has(p.a3) ? p.a3 : 'sem perfil energético'}</span>
                </li>
              ))}
            </ul>
          )}
          {estado && <p className="atl-busca-estado">{estado}</p>}
        </div>
      )}
      <p className="so-leitor" role="status">
        {aberto && digitado ? (achados.length ? `${achados.length} ${achados.length === 1 ? 'país' : 'países'}.` : (estado ?? '')) : ''}
      </p>
    </div>
  );
}

export function PainelMundo({ mundo, erro, modoCor, aoMudarModo, modo }: PainelMundoProps) {
  const opcoes = useRef<(HTMLButtonElement | null)[]>([]);
  const corDaFonte: Record<ChaveFonte, string> = corDaFonteDoMundo(modo);
  // padrão de grupo de rádio: setas movem e escolhem; só a opção marcada é parada de Tab
  const teclaNasOpcoes = (e: KeyboardEvent<HTMLButtonElement>, k: number) => {
    let alvo: number | null = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') alvo = (k + 1) % MODOS.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') alvo = (k - 1 + MODOS.length) % MODOS.length;
    else if (e.key === 'Home') alvo = 0;
    else if (e.key === 'End') alvo = MODOS.length - 1;
    if (alvo == null) return;
    e.preventDefault();
    aoMudarModo(MODOS[alvo].id);
    opcoes.current[alvo]?.focus();
  };
  const porFonte = useMemo(() => (mundo ? contarPorDominante([...mundo.porIso.values()]) : null), [mundo]);

  if (erro)
    return (
      <p className="atl-nota atl-ausencia" role="status">
        {erro}
      </p>
    );
  if (!mundo) return <p className="atl-carregando">Carregando o perfil dos países…</p>;

  const comPerfil = mundo.features.filter((f) => f.properties.a3 && mundo.porIso.has(f.properties.a3)).length;
  const modoAtual = MODOS.find((m) => m.id === modoCor) ?? MODOS[0];

  return (
    <div className="atl-mundo">
      <section className="atl-grupo atl-grupo-primeiro">
        <header className="atl-grupo-cabeca">
          <h2 className="atl-grupo-titulo">Colorir por</h2>
        </header>
        <div className="atl-opcoes" role="radiogroup" aria-label="Como colorir os países">
          {MODOS.map((m, k) => (
            <button
              key={m.id}
              ref={(el) => {
                opcoes.current[k] = el;
              }}
              type="button"
              role="radio"
              aria-checked={modoCor === m.id}
              tabIndex={m.id === modoAtual.id ? 0 : -1}
              className="atl-opcao"
              onClick={() => aoMudarModo(m.id)}
              onKeyDown={(e) => teclaNasOpcoes(e, k)}
            >
              {m.nome}
            </button>
          ))}
        </div>
        <p className="atl-legenda-linha">{modoAtual.resumo}</p>
        {modoCor === 'matriz' ? (
          <ul className="atl-legenda-series atl-legenda-coluna">
            {CAMPOS_MATRIZ.map((c) => (
              <li key={c.chave}>
                <span className="atl-amostra" style={{ background: corDaFonte[c.chave as ChaveFonte] }} aria-hidden="true" />
                {c.rotulo}
                <span className="atl-num">{porFonte ? porFonte.porFonte[c.chave] : ''}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="atl-degraus" aria-label="Escala de cor">
            {[0, 0.25, 0.5, 0.75, 1].map((d) => {
              const metrica = modoCor === 'intensidade' ? 'intensidade' : 'renovavel';
              const rotulo = metrica === 'intensidade' ? String(Math.round(d * TETO.intensidade)) : `${Math.round(d * TETO.renovavel)}%`;
              return (
                <li key={d}>
                  <span style={{ background: corNaRampaDoMundo(modo, metrica, d) }} aria-hidden="true" />
                  <span className="v-dado">{rotulo}</span>
                </li>
              );
            })}
          </ul>
        )}
        <p className="atl-legenda-linha">País sem a métrica na fonte fica sem cor: ausência, não zero.</p>
      </section>

      <p className="atl-legenda-linha">Clique num país, ou procure no campo do mapa, para abrir o perfil com a fonte de cada campo.</p>
      <ComoLer>
        <p>
          {comPerfil} das {mundo.features.length} fronteiras desenhadas têm perfil energético; a base tem {mundo.porIso.size} países, e os {mundo.porIso.size - comPerfil} que faltam no mapa são Estados pequenos demais para a escala 1:110 milhões.
        </p>
        <p>
          Fontes: Our World in Data (perfil por país{mundo.meta.year ? `, ano-base ${mundo.meta.year}` : ''}) e Natural Earth (fronteiras).
        </p>
      </ComoLer>
    </div>
  );
}
