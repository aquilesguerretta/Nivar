// Atlas da Alexandria v3 — "A rede" › quem é dono.
//
// Os maiores donos da frota em operação, pelo campo de proprietário do cadastro da
// ANEEL: o dono DIRETO, com a fração declarada, nunca o grupo econômico. A soma de
// cada um é proporcional à fração; a regra de leitura e de junção de grafias está em
// lib/alexandria/atlas/donos.ts e é dita aqui, sob "Como ler", com os números dela.
// Clicar num dono destaca as usinas dele no mapa (a página passa a chave ao controle)
// e abre a lista das maiores; clicar de novo desfaz.

import { useMemo, useState } from 'react';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { inteiro, potencia } from '@/lib/alexandria/atlas/dados';
import { donosDaFrota, normalizarNome, notaDosDonos, usinasDoDono, type DonoDaFrota, type UsinaDoDono } from '@/lib/alexandria/atlas/donos';
import { PALETA } from '@/lib/alexandria/atlas/estilo';
import type { FonteDeUsinas } from '@/lib/alexandria/atlas/tempo';
import { fraseDoParcial, type SituacaoDasUsinas } from './SecaoLinhaDoTempo';
import { ROTULO_CATEGORIA } from '@/lib/alexandria/atlas/tipos';
import { ComoLer, usinas as textoUsinas } from './PainelRede';
import '../atlas-tempo.css';

export interface SecaoDonosProps {
  usinas: readonly FonteDeUsinas[];
  /** chave normalizada do dono destacado, ou null */
  dono: string | null;
  aoMudarDono: (chave: string | null) => void;
  /** abre a ficha da usina (a página decide como: seleção da usina pelo CEG, voo) */
  aoEscolherUsina: (u: UsinaDoDono) => void;
  modo: ModoV3;
  /** como cada arquivo das usinas está (codigo.md 20); sem a prop, supõe o caso feliz */
  situacao?: SituacaoDasUsinas;
  /** sem o próprio "Como ler" (o painel de "A rede" tem um só, com MetodoDosDonos) */
  semComoLer?: boolean;
}

const DE_SAIDA = 8;
const AMPLIADO = 25;
const USINAS_DO_DONO = 8;

const pct = (f: number) => `${(f * 100).toLocaleString('pt-BR', { maximumFractionDigits: f < 0.1 ? 2 : 1 })}%`;

export function SecaoDonos({ usinas, dono, aoMudarDono, aoEscolherUsina, modo, situacao, semComoLer }: SecaoDonosProps) {
  // sem as principais (erro ou ainda carregando) não há lista: só as menores dariam o ranking errado
  const erro = situacao?.principais === 'erro';
  const pronto = situacao ? situacao.principais === 'ok' && usinas.length > 0 : usinas.length > 0;
  const lista = useMemo(() => (pronto ? donosDaFrota(usinas) : []), [usinas, pronto]);
  const nota = useMemo(() => (pronto ? notaDosDonos(usinas) : null), [usinas, pronto]);
  const [ampliado, setAmpliado] = useState(false);
  const [busca, setBusca] = useState('');
  const parcial = situacao ? situacao.menores !== 'ok' : usinas.length === 1;
  const erroMenores = situacao?.menores === 'erro';
  const cores = PALETA[modo].categoria;

  const chaveBusca = busca.trim() ? normalizarNome(busca) : '';
  const visiveis: DonoDaFrota[] = useMemo(() => {
    if (chaveBusca) return lista.filter((d) => d.chave.includes(chaveBusca)).slice(0, AMPLIADO);
    const base = lista.slice(0, ampliado ? AMPLIADO : DE_SAIDA);
    // o dono escolhido fica na lista mesmo fora do corte (veio de link ou da busca)
    const escolhido = dono ? lista.find((d) => d.chave === dono) : null;
    if (escolhido && !base.includes(escolhido)) base.push(escolhido);
    return base;
  }, [lista, ampliado, chaveBusca, dono]);
  const maior = lista[0]?.kw ?? 1;
  const posicao = useMemo(() => new Map(lista.map((d, i) => [d.chave, i + 1])), [lista]);

  if (!lista.length || !nota) {
    return (
      <section className="atl-grupo atl-donos" data-atlas="donos">
        <header className="atl-grupo-cabeca">
          <h2 className="atl-grupo-titulo">Quem é dono</h2>
        </header>
        <p className="atl-legenda-linha">{erro ? 'O cadastro das usinas não respondeu agora. O mapa segue navegável; a lista dos donos volta na próxima tentativa.' : 'Carregando o cadastro das usinas…'}</p>
      </section>
    );
  }

  const somaTop = lista.slice(0, 10).reduce((t, d) => t + d.kw, 0);

  return (
    <section className="atl-grupo atl-donos" data-atlas="donos" data-dono={dono ?? undefined}>
      <header className="atl-grupo-cabeca">
        <h2 className="atl-grupo-titulo">Quem é dono</h2>
        {dono ? (
          <button type="button" className="atl-grupo-acao" onClick={() => aoMudarDono(null)}>
            Desfazer destaque
          </button>
        ) : (
          <span className="atl-num atl-fraco">{inteiro(lista.length)} donos</span>
        )}
      </header>
      <p className="atl-legenda-linha">
        Os dez maiores somam <span className="atl-num">{potencia(somaTop)}</span> dos <span className="atl-num">{potencia(nota.kw)}</span> em operação; dono direto, não o grupo.
      </p>

      <label className="atl-donos-busca">
        <span className="atl-donos-busca-rotulo">Procurar dono</span>
        <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="nome como o cadastro escreve" spellCheck={false} />
      </label>

      <ol className="atl-donos-lista">
        {visiveis.map((d) => {
          const ativo = d.chave === dono;
          const emParte = d.usinas - d.inteiras;
          return (
            <li key={d.chave} data-ativo={ativo || undefined}>
              <button type="button" className="atl-dono" aria-pressed={ativo} onClick={() => aoMudarDono(ativo ? null : d.chave)}>
                <span className="atl-dono-pos atl-num">{posicao.get(d.chave)}</span>
                <span className="atl-dono-nome">
                  {d.nome}
                  <span className="atl-dono-sub">
                    {textoUsinas(d.usinas)}
                    {emParte > 0 ? `, ${inteiro(emParte)} em parte` : ''}
                    {d.variantes.length > 1 ? ` · ${d.variantes.length} grafias juntadas` : ''}
                  </span>
                </span>
                <span className="atl-dono-kw atl-num">{potencia(d.kw)}</span>
                <span className="atl-dono-barra" style={{ width: `${Math.max(0.5, (d.kw / maior) * 100)}%` }} aria-hidden="true" />
              </button>
              {ativo && <UsinasDoDono dono={d} usinas={usinas} cores={cores} aoEscolherUsina={aoEscolherUsina} />}
            </li>
          );
        })}
      </ol>
      {chaveBusca && !visiveis.length && <p className="atl-legenda-linha">Nenhum dono com esse nome no cadastro.</p>}
      {!chaveBusca && (
        <button type="button" className="atl-grupo-acao atl-donos-mais" onClick={() => setAmpliado((a) => !a)}>
          {ampliado ? `Só os ${DE_SAIDA} maiores` : `Ver os ${AMPLIADO} maiores`}
        </button>
      )}
      {parcial && <p className="atl-legenda-linha atl-fraco">{fraseDoParcial(erroMenores)}</p>}

      {!semComoLer && (
        <ComoLer>
          <CorpoDoMetodoDosDonos nota={nota} />
        </ComoLer>
      )}
    </section>
  );
}

function UsinasDoDono({ dono, usinas, cores, aoEscolherUsina }: { dono: DonoDaFrota; usinas: readonly FonteDeUsinas[]; cores: Record<string, string>; aoEscolherUsina: (u: UsinaDoDono) => void }) {
  const todas = usinasDoDono(dono.chave, usinas);
  const [todasVisiveis, setTodasVisiveis] = useState(false);
  const mostradas = todasVisiveis ? todas : todas.slice(0, USINAS_DO_DONO);
  const resto = todas.length - mostradas.length;
  return (
    <div className="atl-dono-usinas" data-atlas="usinas-do-dono">
      <p className="atl-dono-soma">
        <span className="atl-num">{potencia(dono.kw)}</span> em <span className="atl-num">{textoUsinas(todas.length)}</span>
        {dono.inteiras < todas.length ? (
          <>
            {' '}
            · <span className="atl-num">{inteiro(dono.inteiras)}</span> inteiras, as outras em parte
          </>
        ) : null}
      </p>
      <ul>
        {mostradas.map((u) => (
          <li key={u.ceg}>
            <button type="button" onClick={() => aoEscolherUsina(u)} title={`Abrir a ficha de ${u.nome}`}>
              <span className="atl-tf-amostra" style={{ background: cores[u.cat] }} aria-hidden="true" />
              <span className="atl-dono-usina-nome">
                {u.nome}{' '}
                <span className="atl-fraco">
                  · {u.uf} · {ROTULO_CATEGORIA[u.cat]}
                </span>
                {u.fracao < 0.99995 && (
                  <span className="atl-dono-usina-parte">
                    <span className="atl-num">{pct(u.fracao)}</span> de <span className="atl-num">{potencia(u.kw)}</span>
                  </span>
                )}
              </span>
              <span className="atl-num atl-dono-usina-kw">{potencia(u.kwDoDono)}</span>
            </button>
          </li>
        ))}
      </ul>
      {resto > 0 && (
        <button type="button" className="atl-grupo-acao" onClick={() => setTodasVisiveis(true)}>
          Mais {textoUsinas(resto)}
        </button>
      )}
    </div>
  );
}

type NotaDosDonos = NonNullable<ReturnType<typeof notaDosDonos>>;

/** A regra dos donos em parágrafos, sem moldura. */
function CorpoDoMetodoDosDonos({ nota }: { nota: NotaDosDonos }) {
  return (
    <>
      <p>
        O cadastro da ANEEL registra, para cada usina, quem é o proprietário direto e com que fração. Não diz quem controla quem: duas empresas do mesmo grupo aparecem separadas, e o Atlas não as junta. A parte de cada dono é a potência da
        usina vezes a fração registrada.
      </p>
      <p>
        Grafias juntadas por regra fixa: sem acento, em caixa alta, pontuação trocada por espaço, e as formas de sociedade anônima (S.A., S/A, SA) escritas de um jeito só; LTDA. e LTDA também. A forma societária fica: uma S/A e uma LTDA de
        mesmo nome são empresas diferentes. Das <span className="atl-num">{inteiro(nota.grafias)}</span> grafias do cadastro sobram <span className="atl-num">{inteiro(nota.chaves)}</span> donos
        {nota.juntadas.length ? (
          <>
            ; as juntadas:{' '}
            {nota.juntadas.map((d, i) => (
              <span key={d.chave}>
                {i ? '; ' : ''}
                {d.variantes.join(' + ')}
              </span>
            ))}
          </>
        ) : null}
        .
      </p>
      <p>
        Sem dono no cadastro ("Não Informado"): <span className="atl-num">{textoUsinas(nota.naoInformado.n)}</span> (<span className="atl-num">{potencia(nota.naoInformado.kw)}</span>).
        {nota.ilegivel.n > 0 && (
          <>
            {' '}
            Em <span className="atl-num">{textoUsinas(nota.ilegivel.n)}</span> o texto vem cortado em 500 caracteres no cadastro; a fração que não se lê (<span className="atl-num">{potencia(nota.ilegivel.kw)}</span>) fica sem dono.
          </>
        )}
        {nota.acimaDe100 > 0 && (
          <>
            {' '}
            Em <span className="atl-num">{textoUsinas(nota.acimaDe100)}</span> as frações somam mais que 100%; cada uma foi dividida pela soma.
          </>
        )}
        {nota.repetidas > 0 && (
          <>
            {' '}
            Em <span className="atl-num">{textoUsinas(nota.repetidas)}</span> o mesmo dono vem repetido com a mesma fração e conta uma vez.
          </>
        )}
      </p>
    </>
  );
}

/** A regra dos donos para o "Como ler" único do painel de "A rede": só os parágrafos. */
export function MetodoDosDonos({ usinas, situacao }: { usinas: readonly FonteDeUsinas[]; situacao?: SituacaoDasUsinas }) {
  const pronto = situacao ? situacao.principais === 'ok' && usinas.length > 0 : usinas.length > 0;
  const nota = useMemo(() => (pronto ? notaDosDonos(usinas) : null), [usinas, pronto]);
  if (!nota) return <p>{situacao?.principais === 'erro' ? 'O cadastro das usinas não respondeu agora; a regra dos donos volta com ele.' : 'Carregando o cadastro das usinas…'}</p>;
  return <CorpoDoMetodoDosDonos nota={nota} />;
}
