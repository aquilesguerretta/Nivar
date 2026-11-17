// Atlas da Alexandria v3 — capítulo "Um dia", modo "dia real": a seção do painel.
//
// Tudo vem de operacao-dias.json (ONS): nenhum número digitado. O leitor escolhe um dos dias do
// arquivo (cada um com a razão de estar ali), arrasta a hora ou toca o dia (24 horas em ~24 s;
// movimento reduzido: não toca sozinho, e o botão anda hora a hora sem transição). No topo, UM
// número: a geração do SIN na hora, como o arquivo a confere com o balanço do ONS; a barra por
// fonte; o que não tem ponto no mapa em uma linha; o corte estimado da hora com o motivo.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { PALETA } from '@/lib/alexandria/atlas/estilo';
import {
  chaveDaEntidade,
  corteNaHora,
  diaBr,
  diaDe,
  geracaoNaHora,
  horaBr,
  lerChave,
  lerOperacao,
  megawatts,
  mwInteiro,
  nomeLegivel,
  rotuloDaFonte,
  semanaBr,
  somaDaHora,
  textoDoMotivo,
  type MomentoDaOperacao,
  type Operacao,
} from '@/lib/alexandria/atlas/operacao';
import { CATEGORIAS } from '@/lib/alexandria/atlas/tipos';
import { PISO_POR_ZOOM } from '../mapa/pulso';
import { ReguaDoTempo } from '../ReguaDoTempo';
import { ComoLer } from './PainelRede';
import '../atlas-operacao.css';

export interface PropsSecaoDiaReal {
  dados: Operacao | null;
  erro: string | null;
  momento: MomentoDaOperacao | null;
  aoMudarMomento: (m: MomentoDaOperacao | null) => void;
  selecionado: string | null;
  aoSelecionar: (chave: string | null) => void;
  modo: ModoV3;
}

/** Um segundo por hora ao tocar (24 horas em ~24 s). */
const PASSO_DO_TOQUE_MS = 1000;

function usoReduzido(): boolean {
  const [r, setR] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setR(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return r;
}

/** "14 nov" a partir de AAAA-MM-DD. */
const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
function diaCurto(iso: string): string {
  const [a, m, d] = iso.split('-').map(Number);
  return a && m && d ? `${d} ${MESES_CURTOS[m - 1]}` : iso;
}
/** A razão curta do botão: o trimestre de que o dia é o de maior carga ("T4 2025"); o último dia
 *  completo publicado não traz trimestre no arquivo ("último"). A frase inteira vai embaixo. */
function razaoCurta(t: string | null, iso: string): string {
  const m = t?.match(/^(\d{4})-T([1-4])$/);
  return m ? `T${m[2]} ${m[1]}` : iso.length >= 4 ? 'último' : '';
}
const maiuscula = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/** A leitura que o arquivo grava sobre a Itaipu 50 Hz na conferência (texto do dados-operacao). */
function leituraDeItaipu(conf: unknown): string | null {
  const l = (conf as { itaipu50?: { leitura?: unknown } } | null)?.itaipu50?.leitura;
  return typeof l === 'string' ? l : null;
}

export function SecaoDiaReal({ dados, erro, momento, aoMudarMomento, selecionado, aoSelecionar, modo }: PropsSecaoDiaReal) {
  const reduzido = usoReduzido();
  const [tocando, setTocando] = useState(false);
  const m = useMemo(() => (dados ? lerOperacao(dados) : null), [dados]);
  const momentoRef = useRef(momento);
  momentoRef.current = momento;

  // tocar o dia: uma hora por segundo, da hora em que está até as 23h, e para
  useEffect(() => {
    if (!tocando) return;
    const t = window.setInterval(() => {
      const mo = momentoRef.current;
      if (!mo) return setTocando(false);
      const prox = Math.floor(mo.hora) + 1;
      if (prox > 23) {
        setTocando(false);
        return;
      }
      aoMudarMomento({ dia: mo.dia, hora: prox });
      if (prox >= 23) setTocando(false);
    }, PASSO_DO_TOQUE_MS);
    return () => window.clearInterval(t);
  }, [tocando, aoMudarMomento]);
  // trocar de dia ou sair do modo para o toque
  useEffect(() => {
    if (!momento) setTocando(false);
  }, [momento]);

  if (erro)
    return (
      <p className="atl-nota atl-ausencia" role="status">
        {erro}
      </p>
    );
  if (!m) return <p className="atl-carregando">Carregando a operação hora a hora…</p>;
  if (!m.dias.length) return <p className="atl-nota atl-ausencia">O arquivo da operação não traz nenhum dia.</p>;

  const p = PALETA[modo];
  const dia = momento ? diaDe(m, momento.dia) : null;
  const hora = momento ? Math.max(0, Math.min(23, momento.hora)) : 12;
  const hInteira = Math.round(hora);
  const escolherDia = (d: string) => {
    setTocando(false);
    aoMudarMomento({ dia: d, hora: momento ? Math.round(momento.hora) : 12 });
  };

  // os dias numa fileira: a data e a razão curta em cada um; a razão inteira do escolhido embaixo
  const escolhido = momento ? diaDe(m, momento.dia) : null;
  const seletor = (
    <div className="atl-op-seletor">
      <div className="atl-op-dias" role="group" aria-label="Dia da operação" style={{ gridTemplateColumns: `repeat(${m.dias.length}, minmax(0, 1fr))` }}>
        {m.dias.map((d) => (
          <button
            key={d.dia}
            type="button"
            className="atl-op-dia"
            aria-pressed={d.dia === momento?.dia}
            aria-label={`${diaBr(d.dia)}: ${d.razao ?? d.rotulo ?? ''}`}
            onClick={() => escolherDia(d.dia)}
          >
            <span className="atl-op-dia-data">{diaCurto(d.dia)}</span>
            <span className="atl-op-dia-razao">{razaoCurta(d.trimestre, d.dia)}</span>
          </button>
        ))}
      </div>
      {escolhido && <p className="atl-op-razao">{maiuscula(escolhido.razao ?? escolhido.rotulo ?? '')}.</p>}
    </div>
  );

  if (!momento || !dia)
    return (
      <div className="atl-op">
        <p className="atl-op-convite">Escolha um dia: cada usina que o ONS despacha aparece com a geração verificada da hora.</p>
        {seletor}
        {momento && !dia && <p className="atl-nota atl-ausencia">O dia {momento.dia} não está no arquivo desta versão.</p>}
      </div>
    );

  const s = somaDaHora(m, dia, hora);
  const cats = CATEGORIAS.filter((c) => s.porCategoria[c] >= 0.5).sort((a, b) => s.porCategoria[b] - s.porCategoria[a]);
  const sel = selecionado ? lerChave(selecionado) : null;
  const selId = sel?.tipo === 'entidade' ? sel.id : null;

  // as maiores da hora e os maiores cortes da hora (só entidades com ponto, as que o mapa mostra)
  const maiores = m.entidades
    .filter((e) => e.lonlat)
    .map((e) => ({ e, g: geracaoNaHora(dia, e.i, hora) }))
    .filter((x) => x.g >= 0.5)
    .sort((a, b) => b.g - a.g)
    .slice(0, 5);
  const cortes = [...dia.corte.keys()]
    .map((i) => ({ e: m.entidades[i], c: corteNaHora(dia, i, hora), motivo: dia.corte.get(i)?.motivoPorHora[hInteira] ?? dia.corte.get(i)?.dominante ?? null }))
    .filter((x) => x.e && x.c >= 0.5)
    .sort((a, b) => b.c - a.c)
    .slice(0, 3);
  const motivo = textoDoMotivo(m, s.motivoDominante);
  const pisoTexto = PISO_POR_ZOOM.map(([, v]) => v);

  const tocar = () => {
    if (tocando) {
      setTocando(false);
      return;
    }
    if (hInteira >= 23) aoMudarMomento({ dia: dia.dia, hora: 0 });
    setTocando(true);
  };

  return (
    <div className="atl-op">
      {seletor}

      <div className="atl-op-hora">
        <p className="atl-op-hora-valor">{horaBr(hInteira)}</p>
        <p className="atl-op-hora-dia">
          {semanaBr(dia.dia)}, {diaBr(dia.dia)}
        </p>
        <button type="button" className="atl-op-tocar" aria-pressed={tocando} onClick={tocar} aria-label={tocando ? 'Parar o dia' : 'Tocar o dia, hora a hora'}>
          <span className={tocando ? 'atl-op-icone-parar' : 'atl-op-icone-tocar'} aria-hidden="true" />
          {tocando ? 'Parar' : 'Tocar o dia'}
        </button>
      </div>
      <ReguaDoTempo
        valor={hInteira}
        min={0}
        max={23}
        salto={6}
        rotulo="Hora do dia"
        falado={`${hInteira} horas`}
        aoMudar={(h) => {
          setTocando(false);
          aoMudarMomento({ dia: dia.dia, hora: h });
        }}
        marcas={24}
      />
      {reduzido && tocando && <p className="atl-op-nota">Movimento reduzido: o dia anda hora a hora, sem transição.</p>}

      {/* a manchete separa o que o ONS mediu do que ele prevê: o número grande é só a geração
          verificada; a previsão (pequenas usinas e geração distribuída, por estado) vem na linha de
          baixo, com a soma das duas, que é a conta que o arquivo confere com o balanço do ONS */}
      <div className="atl-op-manchete">
        <p className="atl-op-numero">
          {mwInteiro(s.verificada)}
          <span className="atl-op-unidade">MW</span>
        </p>
        <p className="atl-op-legenda">de geração verificada no Sistema Interligado às {horaBr(hInteira)}, média da hora.</p>
        {s.previsao >= 0.5 && (
          <p className="atl-op-previsao">
            <span className="atl-op-vazada" aria-hidden="true" />
            <span>
              Mais <span className="atl-num">{mwInteiro(s.previsao)}</span> MW que o ONS publica como <em>previsão</em>: pequenas usinas e geração distribuída, somadas por estado.
              Com eles, <span className="atl-num">{mwInteiro(s.total)}</span> MW.
            </span>
          </p>
        )}
      </div>

      <div
        className="atl-op-barra"
        role="img"
        aria-label={`Geração por fonte às ${horaBr(hInteira)}: ${cats
          .map((c) => {
            const pv = s.previsaoPorCategoria[c];
            return `${rotuloDaFonte(c)} ${megawatts(s.porCategoria[c] - pv)} verificados${pv >= 0.5 ? ` e ${megawatts(pv)} previstos` : ''}`;
          })
          .join(', ')}`}
      >
        {cats.flatMap((c) => {
          const pv = s.previsaoPorCategoria[c];
          const ver = s.porCategoria[c] - pv;
          return [
            ver >= 0.5 ? <span key={c} style={{ flexGrow: ver, background: p.categoria[c] }} /> : null,
            pv >= 0.5 ? <span key={`${c}-prev`} className="atl-op-barra-prev" style={{ flexGrow: pv, borderColor: p.categoria[c] }} /> : null,
          ];
        })}
      </div>
      <ul className="atl-op-fontes">
        {cats.map((c) => {
          const pv = s.previsaoPorCategoria[c];
          const ver = s.porCategoria[c] - pv;
          return (
            <li key={c}>
              <span className="atl-amostra" style={{ background: p.categoria[c] }} aria-hidden="true" />
              <span className="atl-op-fonte-nome">{rotuloDaFonte(c)}</span>
              <span className="atl-num">{mwInteiro(ver)}</span>
              {pv >= 0.5 && (
                <>
                  <span className="atl-op-vazada" style={{ borderColor: p.categoria[c] }} aria-hidden="true" />
                  <span className="atl-op-fonte-prev">previsão</span>
                  <span className="atl-num">{mwInteiro(pv)}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>

      <p className="atl-op-linha">
        {s.semPonto.verificada >= 0.5 ? (
          <>
            <span className="atl-num">{mwInteiro(s.semPonto.verificada)}</span> MW da geração verificada vêm de usinas sem par no cadastro do Atlas e não têm ponto no mapa.
          </>
        ) : (
          'Toda a geração verificada desta hora tem ponto no mapa.'
        )}
        {s.previsao >= 0.5 && ' A previsão não tem ponto: o ONS a publica somada por estado.'}
        {s.foraDoBrasil >= 0.5 && (
          <>
            {' '}
            O setor paraguaio de Itaipu gerava <span className="atl-num">{mwInteiro(s.foraDoBrasil)}</span> MW e fica fora da soma.
          </>
        )}
      </p>
      {s.carga != null && (
        <p className="atl-op-linha">
          Carga do Sistema Interligado nesta hora: <span className="atl-num">{mwInteiro(s.carga)}</span> MW.
        </p>
      )}

      <section className="atl-op-bloco" aria-label="Corte da hora">
        <h3 className="atl-op-titulo">O corte da hora</h3>
        {s.corte >= 0.5 ? (
          <p className="atl-op-linha">
            <span className="atl-op-corte-marca" aria-hidden="true" />
            <span className="atl-num">{mwInteiro(s.corte)}</span> MW de eólicas e solares deixaram de ser gerados por ordem do ONS (estimativa do ONS)
            {motivo ? <>, sobretudo por {motivo}</> : null}.
          </p>
        ) : (
          <p className="atl-op-linha">Nenhuma eólica ou solar teve geração cortada nesta hora.</p>
        )}
        {cortes.length > 0 && (
          <ol className="atl-op-lista">
            {cortes.map(({ e, c, motivo: mo }) => (
              <li key={e.id}>
                <button type="button" className="atl-op-item" aria-current={selId === e.id || undefined} onClick={() => aoSelecionar(selId === e.id ? null : chaveDaEntidade(e.id))}>
                  <span className="atl-op-anel" style={{ borderColor: p.categoria[e.cat] }} aria-hidden="true" />
                  <span className="atl-op-item-nome">{nomeLegivel(e.nome)}</span>
                  <span className="atl-op-item-linha">
                    {e.uf ?? ''}
                    {mo ? ` · ${mo}` : ''}
                    {dia.mw[e.i] == null ? ' · sem geração publicada no dia, fora do mapa' : ''}
                  </span>
                  <span className="atl-op-item-valor">
                    <span className="atl-num">{mwInteiro(c)}</span> MW
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="atl-op-bloco" aria-label="As maiores da hora">
        <h3 className="atl-op-titulo">As maiores da hora</h3>
        <ol className="atl-op-lista">
          {maiores.map(({ e, g }) => (
            <li key={e.id}>
              <button type="button" className="atl-op-item" aria-current={selId === e.id || undefined} onClick={() => aoSelecionar(selId === e.id ? null : chaveDaEntidade(e.id))}>
                <span className="atl-amostra" style={{ background: p.categoria[e.cat] }} aria-hidden="true" />
                <span className="atl-op-item-nome">{nomeLegivel(e.nome)}</span>
                <span className="atl-op-item-linha">
                  {rotuloDaFonte(e.cat)}
                  {e.uf ? ` · ${e.uf}` : ''}
                  {e.foraDoBrasil ? ' · setor paraguaio' : ''}
                </span>
                <span className="atl-op-item-valor">
                  <span className="atl-num">{mwInteiro(g)}</span> MW
                </span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <ComoLer>
        <p>
          Cada disco é uma usina, ou um conjunto de usinas que o ONS despacha junto, na cor da fonte; a área do disco cresce com a geração verificada da hora. O
          conjunto fica no centro das usinas dele, e a geração dele não é repartida entre elas. O anel vazado em volta de uma eólica ou solar é o que ela teria
          gerado sem o corte: o vão entre o disco e o anel é a geração não realizada, que o ONS estima.
        </p>
        <p>
          Para não amontoar, cada zoom tem um piso: só aparecem as que geram (ou têm corte de) pelo menos {pisoTexto.filter((v) => v > 0).join(', ').replace(/, (\d+)$/, ' ou $1')}{' '}
          MW na hora, do mais longe para o mais perto; de perto, todas, inclusive as paradas (anel mínimo, sem cor). Entidade sem valor de geração publicado no
          dia não aparece no mapa, nem quando tem corte: o corte dela entra na soma do corte e na lista, marcado.
        </p>
        <p>
          O setor paraguaio de Itaipu (50 Hz) tem o mesmo ponto da usina; o mapa o desenha encostado ao setor brasileiro, a oeste e em véu, só para os dois se
          lerem separados. Usinas que o ONS publica em mais de uma linha no mesmo ponto aparecem uma dentro da outra.
        </p>
        {m.leia.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
        {m.regraDosDias && <p>Os dias: {m.regraDosDias}</p>}
        {m.horario && <p>A hora: {m.horario}.</p>}
        {dia.conferencia?.sin?.difPct != null && (
          <p>
            Conferência deste dia: a soma do arquivo fica a <span className="atl-num">{String(dia.conferencia.sin.difPct).replace('.', ',')}%</span> do balanço de energia do ONS
            {dia.conferencia.comPonto?.pct != null ? (
              <>
                ; <span className="atl-num">{String(dia.conferencia.comPonto.pct).replace('.', ',')}%</span> da energia do dia tem ponto no mapa
              </>
            ) : null}
            .
          </p>
        )}
        {leituraDeItaipu(dia.conferencia) && <p>{leituraDeItaipu(dia.conferencia)}</p>}
      </ComoLer>
    </div>
  );
}

export default SecaoDiaReal;
