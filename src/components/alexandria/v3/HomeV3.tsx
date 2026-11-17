// Alexandria v3 — Início.
//
// Duas casas na mesma rota (decisão do Founder):
// · quem chega sem conta vê a apresentação da plataforma, com um instrumento
//   de verdade para mexer e, quando existir, o filme no fim;
// · quem tem conta vê o mesmo esqueleto com o próprio estudo (InicioDaConta.tsx):
//   onde parou, nível e sequência, o caminho na trilha, as medalhas e o registro.
//
// Números: contados do índice gerado da fonte ou lidos do backend. Nenhum mock.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEstudo } from '@/components/alexandria/home/estudo';
import { indice, TOTAL_AULAS } from '@/lib/alexandria/indice';
import { Contagem, Palavras } from './animacoes';
import { CasaV3 } from './CasaV3';
import { InicioDaConta } from './InicioDaConta';
import { InstrumentoFatorCapacidade } from './InstrumentoFatorCapacidade';
import { useRevelar } from './usoV3';
import './home-v3.css';

const TOTAL_INSTRUMENTOS = indice.modulos.reduce((s, m) => s + (m.totalInstrumentos ?? 0), 0);
const PRIMEIRA_AULA = (() => {
  const m = indice.modulos[0];
  return `/alexandria/trilha/${m.trilhaId}/modulo/${m.id}/aula/1`;
})();
const FILME = '/alexandria/v3/home/filme/alexandria-apresentacao.mp4';
const CAPAS: Record<string, string> = { I: 'trilha-I', II: 'trilha-II', III: 'trilha-III' };

/** O filme só aparece quando o arquivo existe — nada de lugar vazio (S4). */
function useFilmeExiste() {
  const [existe, setExiste] = useState(false);
  useEffect(() => {
    let vivo = true;
    fetch(FILME, { method: 'HEAD' })
      .then((r) => vivo && setExiste(r.ok && (r.headers.get('content-type') ?? '').startsWith('video')))
      .catch(() => undefined);
    return () => {
      vivo = false;
    };
  }, []);
  return existe;
}

export function HomeV3() {
  const estudo = useEstudo();
  const conta = estudo.fase === 'conta' ? estudo : null;
  const raiz = useRevelar<HTMLDivElement>([estudo.fase]);

  const contaNaCasa = conta ? (
    <Link to="/alexandria/perfil" className="casa-conta">
      {conta.nome}
    </Link>
  ) : (
    <Link to="/entrar" className="casa-conta">
      Entrar
    </Link>
  );

  return (
    <CasaV3 secao="inicio" conta={contaNaCasa}>
      <div ref={raiz}>
        {estudo.fase === 'carregando' ? (
          <div className="home-espera" aria-busy="true" />
        ) : conta ? (
          <InicioDaConta conta={conta} />
        ) : (
          <Apresentacao />
        )}
      </div>
    </CasaV3>
  );
}

// ── quem chega ──────────────────────────────────────────────

function Apresentacao() {
  const filme = useFilmeExiste();
  return (
    <main className="home">
      <section className="heroi">
        <div className="heroi-texto">
          <div className="heroi-topo">
            <p className="v-dado sobe" style={{ ['--i' as string]: 0 }}>
              Alexandria · currículo de energia
            </p>
            <h1 className="v-manchete heroi-titulo">
              <Palavras texto="Energia não se decora." desde={1} />
              <em>
                <Palavras texto="Se entende." desde={5} />
              </em>
            </h1>
            <p className="heroi-sub sobe" style={{ ['--i' as string]: 8 }}>
              Dezessete módulos, três trilhas e {TOTAL_INSTRUMENTOS} instrumentos para ler o setor elétrico
              com a fonte à vista.
            </p>
            <div className="heroi-acoes sobe" style={{ ['--i' as string]: 9 }}>
              <Link to={PRIMEIRA_AULA} className="botao">
                Começar pela Trilha I
              </Link>
              <Link to="/alexandria/trilhas" className="link-seta">
                Ver as trilhas
              </Link>
            </div>
          </div>
          <TesesQuePassam />
        </div>
        <figure className="heroi-figura">
          <img
            src="/alexandria/v3/home/home-farol-1600.webp"
            srcSet="/alexandria/v3/home/home-farol-800.webp 800w, /alexandria/v3/home/home-farol-1600.webp 1600w, /alexandria/v3/home/home-farol-2400.webp 2400w"
            sizes="(max-width: 860px) 100vw, 56vw"
            width={1600}
            height={905}
            alt=""
            decoding="async"
          />
          <span className="relampago" aria-hidden="true" />
          <figcaption className="v-dado legenda-gravura">Gravura gerada · o farol</figcaption>
        </figure>
        <nav className="heroi-trilhas" aria-label="As três trilhas">
          {indice.trilhas.map((t) => {
            const mods = indice.modulos.filter((m) => m.trilhaId === t.id);
            const aulas = mods.reduce((n, m) => n + m.aulas.length, 0);
            return (
              <Link key={t.id} to={`/alexandria/trilha/${t.id}`} className="heroi-trilha">
                <span className="heroi-trilha-romano">{t.romano}</span>
                <span className="heroi-trilha-nome">{t.nome}</span>
                <span className="v-dado">
                  {mods.length} módulos · {aulas} aulas
                </span>
              </Link>
            );
          })}
        </nav>
      </section>

      <section className="numeros revelar" aria-label="O currículo em números">
        {[
          { n: indice.modulos.length, r: 'módulos', d: 'organizados em três trilhas' },
          { n: indice.trilhas.length, r: 'trilhas', d: 'do universal ao estratégico' },
          { n: TOTAL_AULAS, r: 'aulas', d: 'distribuídas pelos dezessete módulos' },
          { n: TOTAL_INSTRUMENTOS, r: 'instrumentos', d: 'ligados às aulas do currículo' },
        ].map((x) => (
          <div key={x.r} className="numero">
            <span className="numero-valor">
              <Contagem valor={x.n} />
            </span>
            <span className="v-dado">{x.r}</span>
            <span className="numero-desc">{x.d}</span>
          </div>
        ))}
      </section>

      <section className="trilhas-home" aria-labelledby="trilhas-home-titulo">
        <header className="secao-cabeca revelar">
          <p className="v-dado">As trilhas</p>
          <h2 className="v-manchete secao-titulo" id="trilhas-home-titulo">
            Três caminhos, <em>uma ordem que faz sentido.</em>
          </h2>
        </header>
        <ol className="trilhas-cartas">
          {indice.trilhas.map((t, i) => {
            const mods = indice.modulos.filter((m) => m.trilhaId === t.id);
            const aulas = mods.reduce((s, m) => s + m.aulas.length, 0);
            return (
              <li key={t.id} className="carta revelar" style={{ ['--i' as string]: i }}>
                <Link to={`/alexandria/trilha/${t.id}`} className="carta-link">
                  <span className="carta-imagem">
                    <img
                      src={`/alexandria/v3/trilhas/${CAPAS[t.romano]}-800.webp`}
                      width={800}
                      height={452}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="carta-romano">Trilha {t.romano}</span>
                  <span className="carta-nome">{t.nome}</span>
                  <span className="v-dado carta-conta">
                    {mods.length} módulos · {aulas} aulas
                  </span>
                  {mods[0]?.tese && <span className="carta-tese">“{mods[0].tese}”</span>}
                  <span className="carta-tese-fonte v-dado">
                    {mods[0]?.codigo} · {mods[0]?.titulo}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="como" aria-labelledby="como-titulo">
        <div className="como-texto revelar">
          <p className="v-dado">Como se estuda</p>
          <h2 className="v-manchete secao-titulo" id="como-titulo">
            Você mexe no número. <em>A aula responde.</em>
          </h2>
          <ol className="passos">
            <li>
              <span className="v-dado">01</span>
              <span>Leia a aula: o texto e os números vêm do material de origem, e a origem fica escrita junto.</span>
            </li>
            <li>
              <span className="v-dado">02</span>
              <span>O instrumento da própria aula faz a conta da fórmula da aula. Ao lado, um deles, para mexer agora.</span>
            </li>
            <li>
              <span className="v-dado">03</span>
              <span>Com conta, o que você percorre fica guardado no seu perfil: nível, medalhas e a sequência de dias.</span>
            </li>
          </ol>
        </div>
        <div className="como-instrumento revelar">
          <InstrumentoFatorCapacidade />
        </div>
      </section>

      <figure className="faixa-gravura revelar">
        <img
          src="/alexandria/v3/home/home-aula-1600.webp"
          srcSet="/alexandria/v3/home/home-aula-800.webp 800w, /alexandria/v3/home/home-aula-1600.webp 1600w, /alexandria/v3/home/home-aula-2400.webp 2400w"
          sizes="100vw"
          width={1600}
          height={905}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <figcaption className="v-dado legenda-gravura">Gravura gerada · a conferência</figcaption>
      </figure>

      {filme && (
        <section className="filme revelar" aria-labelledby="filme-titulo">
          <p className="v-dado" id="filme-titulo">
            O que é a Alexandria
          </p>
          <video controls preload="metadata" poster="/alexandria/v3/home/filme/poster.webp" className="filme-video">
            <source src="/alexandria/v3/home/filme/alexandria-apresentacao.webm" type="video/webm" />
            <source src={FILME} type="video/mp4" />
            <track kind="captions" src="/alexandria/v3/home/filme/pt-BR.vtt" srcLang="pt-BR" label="Português" default />
          </video>
        </section>
      )}

      <section className="fecho revelar">
        <h2 className="v-manchete fecho-titulo">
          Comece pela primeira aula. <em>Guarde o caminho quando quiser.</em>
        </h2>
        <div className="heroi-acoes">
          <Link to={PRIMEIRA_AULA} className="botao">
            Abrir a Aula 01
          </Link>
          <Link to="/criar-conta" className="link-seta">
            Criar conta
          </Link>
        </div>
      </section>
    </main>
  );
}

/** As frases-tese dos 17 módulos, literais da fonte, passando uma a uma no
 *  herói. Pausa com o cursor em cima ou com o foco dentro; com
 *  prefers-reduced-motion, fica parada na primeira e troca só por clique. */
function TesesQuePassam() {
  const comTese = indice.modulos.filter((m) => m.tese);
  const [i, setI] = useState(0);
  const [pausa, setPausa] = useState(false);
  useEffect(() => {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduzir || pausa) return;
    const t = window.setInterval(() => setI((k) => (k + 1) % comTese.length), 5200);
    return () => window.clearInterval(t);
  }, [pausa, comTese.length]);
  const m = comTese[i];
  return (
    <div
      className="teses"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
    >
      <div className="teses-cabeca">
        <span className="v-dado">A tese de cada módulo</span>
        <button
          type="button"
          className="teses-proxima"
          onClick={() => setI((k) => (k + 1) % comTese.length)}
          aria-label="Próxima tese"
          data-moldura="texto"
        >
          {String(i + 1).padStart(2, '0')} / {comTese.length} →
        </button>
      </div>
      <Link
        key={m.id}
        to={`/alexandria/trilha/${m.trilhaId}/modulo/${m.id}`}
        className="tese-atual"
        aria-live="polite"
      >
        <span className="tese-frase">“{m.tese}”</span>
        <span className="v-dado tese-origem">
          {m.codigo} · {m.titulo}
        </span>
      </Link>
      <span className="teses-tempo" key={`t-${i}-${pausa}`} data-pausa={pausa || undefined} aria-hidden="true" />
    </div>
  );
}

// ── quem tem conta ──────────────────────────────────────────
