// Atlas da Alexandria v3 — capítulo "O comércio": o que o Brasil vende e compra de energia,
// e por onde. Tudo vem de comercio-2025.json (Comex Stat/MDIC; ONS para a eletricidade
// física): nenhum número digitado. A frase do topo é montada do arquivo; a lista de produtos
// isola um produto no mapa; "As maiores rotas" seleciona e enquadra.

import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { dataBr } from '@/lib/alexandria/atlas/dados';
import {
  chaveDaEletrica,
  chaveDaViagem,
  chaveDoGas,
  dolares,
  fonteDasRotas,
  lerChave,
  lugarDaUrf,
  medidoEmValor,
  nomeDoPais,
  nomeDoProduto,
  quanto,
  semArquivo,
  toneladas,
  viagensDe,
  viagensVisiveis,
  type Comercio,
  type FiltroDoComercio,
  type ProdutoDoComercio,
  type Sentido,
} from '@/lib/alexandria/atlas/comercio';
import { ComoLer } from './PainelRede';
import '../atlas-comercio.css';

export interface PropsPainelComercio {
  dados: Comercio | null;
  erro: string | null;
  filtro: FiltroDoComercio;
  aoMudarFiltro: (f: FiltroDoComercio) => void;
  selecionado: string | null;
  aoSelecionar: (chave: string | null) => void;
  /** leva 3: o filtro mudou (sentido, produto ou quantos). A página volta à câmera do capítulo se o
   *  Brasil não estiver na tela (CamadaDoComercio.brasilNaTela). Opcional: sem ele, a câmera fica. */
  aoMudarRecorte?: () => void;
  modo: ModoV3;
}

const nf1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

/** Em "As duas", cada número diz o seu sentido (leva 3): "saiu 98,2 Mt · entrou 12,1 Mt". */
const SAIU_ENTROU: Record<Sentido, string> = { exportacao: 'saiu', importacao: 'entrou' };

const VERBO: Record<Sentido, { saiu: string; para: string; rotulo: string }> = {
  exportacao: { saiu: 'exportados', para: 'Maior destino declarado', rotulo: 'Exportação' },
  importacao: { saiu: 'importados', para: 'Maior origem declarada', rotulo: 'Importação' },
};

/** O número do topo: o maior produto do sentido (em peso) e o maior país dele. */
function manchete(d: Comercio, s: Sentido) {
  const pesados = d.produtos.filter((p) => !medidoEmValor(p) && p[s]?.kt > 0);
  const maior = [...pesados].sort((a, b) => b[s].kt - a[s].kt)[0];
  if (!maior) return null;
  const fluxos = d.fluxos.filter((f) => f.produto === maior.id && f.sentido === s && f.pais !== 'BRA').sort((a, b) => b.kt - a.kt);
  const f = fluxos[0] ?? null;
  return { produto: maior, kt: maior[s].kt, pais: f ? nomeDoPais(d, f.pais) : null, pct: f?.pctDoProduto ?? null };
}

/** A regra da lista em uma linha (leva 3): o que "os maiores" e "todos" querem dizer no mapa. */
function regraDaLista(rotas: { via: string }[], f: FiltroDoComercio): string {
  const ar = rotas.filter((v) => v.via === 'aérea').length;
  const mar = rotas.length - ar;
  // leva 4: "remessa" = um produto, de uma URF de despacho para um país, somado no ano
  if (f.quantas === 'todas')
    return `Cada remessa é um produto, de uma URF de despacho para um país, somado no ano; várias dividem o mesmo traçado. No mapa, as maiores em traço cheio e com veículo; as demais em fio fraco${f.produtos ? '' : ', e a via aérea só entre as maiores'}.`;
  if (f.produtos) return `As maiores do produto, por qualquer via: ${mar} por mar${ar ? ` e ${ar} por ar` : ''}.`;
  // codigo.md 14: sem avião no sentido (importação), a frase não fala em "os 0 maiores por ar"
  return `As ${mar} maiores por mar${ar ? ` e as ${ar} maiores por ar (pelo peso, o avião nunca entraria)` : ''}.`;
}

/** "98,2" + "Mt" para a manchete. */
function partes(kt: number): [string, string] {
  const t = toneladas(kt);
  const i = t.lastIndexOf(' ');
  return kt >= 1000 ? [t.slice(0, i), t.slice(i + 1)] : [t.replace(/ mil t$/, ''), 'mil t'];
}

export function PainelComercio({ dados: d, erro, filtro, aoMudarFiltro: mudarFiltro, selecionado, aoSelecionar, aoMudarRecorte }: PropsPainelComercio) {
  // leva 3: trocar o filtro derruba a seleção (a ficha de uma rota que pode nem estar mais no mapa)
  // e avisa a página, que traz a câmera de volta ao capítulo se o Brasil saiu da tela
  const aoMudarFiltro = (f: FiltroDoComercio) => {
    mudarFiltro(f);
    if (selecionado) aoSelecionar(null);
    aoMudarRecorte?.();
  };
  if (erro)
    return (
      <p className="atl-nota atl-ausencia" role="status">
        {erro}
      </p>
    );
  if (!d) return <p className="atl-carregando">Carregando o comércio exterior de energia…</p>;

  const sentidoDaFrase: Sentido = filtro.sentido === 'importacao' ? 'importacao' : 'exportacao';
  const m = manchete(d, sentidoDaFrase);
  const sel = selecionado ? lerChave(selecionado) : null;
  const sentidos: Sentido[] = filtro.sentido === 'ambos' ? ['exportacao', 'importacao'] : [filtro.sentido];

  // produtos: os medidos em peso com barra; os medidos em valor à parte (não somam com toneladas)
  const comPeso = d.produtos.filter((p) => !medidoEmValor(p) && sentidos.some((s) => p[s]?.kt >= 1));
  const peso = (p: ProdutoDoComercio) => sentidos.reduce((s, x) => s + (p[x]?.kt ?? 0), 0);
  comPeso.sort((a, b) => peso(b) - peso(a));
  const teto = Math.max(1, ...comPeso.flatMap((p) => sentidos.map((s) => p[s]?.kt ?? 0)));
  const emValor = d.produtos.filter((p) => medidoEmValor(p) && sentidos.some((s) => p[s]?.fobUS > 0));

  const isolado = filtro.produtos?.length === 1 ? filtro.produtos[0] : null;
  const temViagem = new Set(viagensDe(d).map((v) => v.produto));
  const isolar = (p: ProdutoDoComercio) => {
    if (isolado === p.id) {
      aoMudarFiltro({ ...filtro, produtos: null });
      return;
    }
    aoMudarFiltro({ ...filtro, produtos: [p.id] });
    // produto sem navio (o gás que chega por duto, a eletricidade): abre o que o mapa tem dele
    if (!temViagem.has(p.id)) {
      const c = (d.condutos ?? []).find((x) => x.produto === p.id);
      if (c) aoSelecionar(chaveDoGas(c.pais));
      else if (p.id === 'eletricidade' && d.eletricidade?.interligacoes?.length) aoSelecionar(chaveDaEletrica(d.eletricidade.interligacoes[0].pais));
    }
  };

  const rotas = viagensVisiveis(d, filtro);
  const fc = d.fontes?.comex;
  const ons = d.fontes?.ons;
  const rotaFonte = fonteDasRotas(d);
  const conf = d.conferencia?.linhas ?? [];

  // por terra: a eletricidade (ONS, MWh, soma dos doze meses) e o duto
  const eletricas = Object.entries(d.eletricidade?.paises ?? {});
  const interligacoesSemSerie = (d.eletricidade?.interligacoes ?? []).filter((i) => i.serie == null);
  const horasDoAno = d.eletricidade?.horasDoAno;
  const horasEl =
    horasDoAno && eletricas.some(([, s]) => s.horas && s.horas < horasDoAno)
      ? `Na eletricidade, o ONS publicou ${eletricas.map(([a3, s]) => `${nf0.format(s.horas ?? 0)} horas para ${a3 === 'ARG' ? 'a Argentina' : a3 === 'URY' ? 'o Uruguai' : nomeDoPais(d, a3)}`).join(' e ')}, de ${nf0.format(horasDoAno)}: parte da diferença com o Comex é hora que falta, não divergência entre as fontes.`
      : null;

  return (
    <div className="atl-rede atl-comercio">
      {m && (
        <div className="atl-comercio-manchete">
          <p className="atl-comercio-numero">
            {partes(m.kt)[0]}
            <span className="atl-comercio-unidade">{partes(m.kt)[1]}</span>
          </p>
          <p className="atl-comercio-legenda">
            de {m.produto.nome.toLowerCase()} {VERBO[sentidoDaFrase].saiu} em {d.ano}.
            {m.pais && m.pct != null ? (
              <>
                {' '}
                {VERBO[sentidoDaFrase].para}: {m.pais}, <span className="atl-num">{nf0.format(m.pct)}%</span>.
              </>
            ) : null}
          </p>
        </div>
      )}

      <div className="atl-comercio-sentido" role="group" aria-label="Sentido">
        {(['exportacao', 'importacao', 'ambos'] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={filtro.sentido === s}
            onClick={() =>
              // codigo.md 13: o produto isolado que viaja (navio ou avião), mas não no sentido novo, sai do
              // isolamento; senão a lista ficava vazia dizendo que ele "não viaja"
              aoMudarFiltro({
                ...filtro,
                sentido: s,
                produtos:
                  isolado && temViagem.has(isolado) && !viagensDe(d).some((v) => v.produto === isolado && (s === 'ambos' || v.sentido === s)) ? null : filtro.produtos,
              })
            }
            className={s === 'exportacao' ? 'atl-comercio-ex' : s === 'importacao' ? 'atl-comercio-im' : undefined}
          >
            {s === 'ambos' ? 'As duas' : VERBO[s].rotulo}
          </button>
        ))}
      </div>

      <section className="atl-comercio-bloco" aria-label="Produtos">
        <div className="atl-comercio-titulo-linha">
          <h3 className="atl-comercio-titulo">Por produto</h3>
          {filtro.produtos && (
            <button type="button" className="atl-comercio-limpar" onClick={() => aoMudarFiltro({ ...filtro, produtos: null })}>
              Todos os produtos
            </button>
          )}
        </div>
        <ul className="atl-comercio-produtos">
          {comPeso.map((p) => {
            const fora = isolado != null && isolado !== p.id;
            return (
              <li key={p.id}>
                <button type="button" className="atl-comercio-produto" aria-pressed={isolado === p.id} data-fora={fora || undefined} onClick={() => isolar(p)}>
                  <span className="atl-comercio-produto-nome">{p.nome}</span>
                  <Num className="atl-comercio-produto-valor" texto={sentidos.map((s) => `${sentidos.length > 1 ? `${SAIU_ENTROU[s]} ` : ''}${toneladas(p[s].kt)}`).join(' · ')} />
                  <span className="atl-comercio-barras" aria-hidden="true">
                    {sentidos.map((s) => (
                      <span key={s} className={`atl-comercio-barra atl-comercio-barra-${s}`} style={{ width: `${Math.max(0.6, (100 * (p[s]?.kt ?? 0)) / teto)}%` }} />
                    ))}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {emValor.length > 0 && (
          <p className="atl-comercio-valor">
            Medidos em valor, não em peso:{' '}
            {emValor.map((p, i) => (
              <span key={p.id}>
                {i > 0 ? '; ' : ''}
                <button type="button" className="atl-comercio-link" aria-pressed={isolado === p.id} onClick={() => isolar(p)}>
                  {p.nome.toLowerCase()}
                </button>{' '}
                <Num texto={sentidos.map((s) => `${sentidos.length > 1 ? `${SAIU_ENTROU[s]} ` : ''}${dolares(p[s].fobUS)}`).join(' · ')} /> FOB
              </span>
            ))}
            .
          </p>
        )}
      </section>

      <section className="atl-comercio-bloco" aria-label="As remessas">
        <div className="atl-comercio-titulo-linha">
          {/* "remessa" (leva 4): cada linha é um produto, de uma URF de despacho para um país, somado no
              ano; várias dividem o mesmo traçado. "Fluxo" fica só para a definição do arquivo */}
          <h3 className="atl-comercio-titulo">{filtro.quantas === 'maiores' ? `As ${rotas.length} maiores remessas` : `Todas as ${rotas.length} remessas`}</h3>
          <button type="button" className="atl-comercio-limpar" onClick={() => aoMudarFiltro({ ...filtro, quantas: filtro.quantas === 'maiores' ? 'todas' : 'maiores' })}>
            {filtro.quantas === 'maiores' ? 'Ver todas' : 'Só as maiores'}
          </button>
        </div>
        {/* leva 4: "esquemática" visível na tela de entrada, sem abrir nada */}
        <p className="atl-comercio-esquema">Rotas esquemáticas: o dado diz a unidade de despacho e o país, não o caminho nem o porto.</p>
        {rotas.length > 0 && <p className="atl-comercio-regra">{regraDaLista(rotas, filtro)}</p>}
        {rotas.length === 0 ? (
          <p className="atl-nota">
            {isolado && temViagem.has(isolado)
              ? `Sem remessa de ${nomeDoProduto(d, isolado).toLowerCase()} por navio ou avião neste sentido em ${d.ano}.`
              : 'Este produto não viaja por navio nem por avião no arquivo: veja "Por terra".'}
          </p>
        ) : (
          <ol className="atl-comercio-rotas">
            {rotas.map((v) => {
              const atual = sel?.tipo === 'viagem' && sel.id === v.id;
              return (
                <li key={v.id}>
                  <button type="button" className="atl-comercio-rota" aria-current={atual || undefined} onClick={() => aoSelecionar(atual ? null : chaveDaViagem(v.id))}>
                    <span className={`atl-comercio-marca atl-comercio-marca-${v.sentido}${v.via === 'aérea' ? ' atl-comercio-marca-ar' : ''}`} aria-hidden="true" />
                    <span className="atl-comercio-rota-nome">
                      {nomeDoProduto(d, v.produto)} {v.sentido === 'exportacao' ? '→' : '←'} {nomeDoPais(d, v.pais)}
                    </span>
                    <span className="atl-comercio-rota-linha">
                      {lugarDaUrf(d, v.urf)}
                      {v.via === 'aérea' ? ' · via aérea' : ''}
                    </span>
                    <Num className="atl-comercio-rota-valor" texto={quanto(d, v.produto, v.kt, v.fobUS)} />
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="atl-comercio-bloco" aria-label="Por terra">
        <h3 className="atl-comercio-titulo">Por terra</h3>
        <ul className="atl-comercio-terra">
          {eletricas.map(([a3, s]) => {
            const ex = s.exportacaoMWh.reduce((a, b) => a + b, 0);
            const im = s.importacaoMWh.reduce((a, b) => a + b, 0);
            const atual = sel?.tipo === 'eletrica' && sel.pais === a3;
            return (
              <li key={a3}>
                <button type="button" className="atl-comercio-rota" aria-current={atual || undefined} onClick={() => aoSelecionar(atual ? null : chaveDaEletrica(a3))}>
                  <span className="atl-comercio-marca atl-comercio-marca-conversora" aria-hidden="true" />
                  <span className="atl-comercio-rota-nome">Eletricidade · {nomeDoPais(d, a3)}</span>
                  <span className="atl-comercio-rota-linha">
                    saíram <Num texto={`${nf1.format(ex / 1000)} GWh`} />, entraram <Num texto={`${nf1.format(im / 1000)} GWh`} />
                    {/* leva 4: a soma é a das horas que o ONS publicou, não do ano inteiro */}
                    {s.horas && d.eletricidade?.horasDoAno && s.horas < d.eletricidade.horasDoAno ? (
                      <>
                        {' '}
                        em <Num texto={`${nf0.format(s.horas)} h`} /> de <Num texto={`${nf0.format(d.eletricidade.horasDoAno)} h`} /> (ONS)
                      </>
                    ) : (
                      ' (ONS)'
                    )}
                  </span>
                </button>
              </li>
            );
          })}
          {interligacoesSemSerie.map((i) => {
            const atual = sel?.tipo === 'eletrica' && sel.pais === i.pais;
            return (
              <li key={i.id}>
                <button type="button" className="atl-comercio-rota" aria-current={atual || undefined} onClick={() => aoSelecionar(atual ? null : chaveDaEletrica(i.pais))}>
                  <span className="atl-comercio-marca atl-comercio-marca-conversora" aria-hidden="true" />
                  <span className="atl-comercio-rota-nome">Eletricidade · {i.paisNome ?? nomeDoPais(d, i.pais)}</span>
                  <span className="atl-comercio-rota-linha">
                    sem série no ONS em {d.ano}
                    {d.eletricidade?.paraguaiComex?.fobUS ? (
                      <>
                        ; no Comex, <Num texto={dolares(d.eletricidade.paraguaiComex.fobUS)} /> sem dizer por onde entra
                      </>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
          {(d.condutos ?? []).map((c) => {
            const atual = sel?.tipo === 'gas' && sel.pais === c.pais;
            return (
              <li key={c.id}>
                <button type="button" className="atl-comercio-rota" aria-current={atual || undefined} onClick={() => aoSelecionar(atual ? null : chaveDoGas(c.pais))}>
                  <span className="atl-comercio-marca atl-comercio-marca-duto" aria-hidden="true" />
                  <span className="atl-comercio-rota-nome">
                    {nomeDoProduto(d, c.produto)} {c.sentido === 'exportacao' ? '→' : '←'} {nomeDoPais(d, c.pais)}
                  </span>
                  <span className="atl-comercio-rota-linha">por duto, {lugarDaUrf(d, c.urf)}</span>
                  <Num className="atl-comercio-rota-valor" texto={quanto(d, c.produto, c.kt, c.fobUS)} />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <ComoLer>
        {d.leia.map((t, i) => (
          <p key={i}>{semArquivo(t)}</p>
        ))}
        <p>
          Os veículos andam numa velocidade ilustrativa: não dizem quantos navios houve nem quanto tempo a viagem leva. De perto da costa, um veículo de
          cada remessa anda só junto do porto brasileiro, saindo ou chegando, para que a ponta da rota não fique vazia. A espessura da rota tem três graus,
          pela tonelagem das viagens mostradas nela. Tinta é exportação; ouro, importação.
        </p>
        {conf.length > 0 && (
          <>
            <p className="atl-comercio-conf-titulo">Conferência com fonte independente</p>
            {d.conferencia?.nota && <p>{d.conferencia.nota}</p>}
            <table className="atl-comercio-conf">
              <tbody>
                {conf.map((l) => (
                  <tr key={l.item}>
                    <th scope="row">{l.item}</th>
                    <td className="atl-num">
                      {l.diferencaPct > 0 ? '+' : ''}
                      {nf1.format(l.diferencaPct)}%
                    </td>
                    <td>{l.fonteReferencia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* leva 4: na eletricidade, parte da diferença é hora que o ONS não publicou */}
            {horasEl && <p>{horasEl}</p>}
          </>
        )}
        <ul className="atl-comercio-fontes">
          {fc && (
            <li>
              {fc.orgao}, {fc.conjunto}
              {fc.acesso ? (
                <>
                  {' '}
                  · acesso <span className="atl-num">{dataBr(fc.acesso)}</span>
                </>
              ) : null}
            </li>
          )}
          {ons && (
            <li>
              {ons.orgao}, {ons.conjunto}
              {ons.acesso ? (
                <>
                  {' '}
                  · acesso <span className="atl-num">{dataBr(ons.acesso)}</span>
                </>
              ) : null}
            </li>
          )}
          {rotaFonte && (
            <li>
              Rotas: {rotaFonte}
            </li>
          )}
        </ul>
      </ComoLer>
    </div>
  );
}

export default PainelComercio;

/** Número em mono e unidade fora dele ("15,6 Mt" → <num>15,6</num> Mt): o espaço da fonte mono
 *  é largo e abria "15,6  Mt". Aceita grupos separados por " · ". */
export function Num({ texto, className }: { texto: string; className?: string }) {
  const grupos = texto.split(' · ');
  return (
    <span className={className}>
      {grupos.map((g, i) => {
        // leva 3: aceita uma palavra antes ("saiu 98,2 Mt")
        const m = g.match(/^((?:saiu|entrou) )?(US\$ )?([\d.,]+) (.+)$/);
        return (
          <span key={i}>
            {i > 0 ? ' · ' : ''}
            {m ? (
              <>
                {m[1] ? `${m[1].trim()}\u00a0` : ''}
                {m[2] ? 'US$\u00a0' : ''}
                <span className="atl-num">{m[3]}</span>
                {'\u00a0'}
                {m[4]}
              </>
            ) : (
              g
            )}
          </span>
        );
      })}
    </span>
  );
}
