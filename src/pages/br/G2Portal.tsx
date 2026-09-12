import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { FamilyEmblem } from "../../components/g2/Brand";
import {
  NivarShell,
  Provenance,
  SectionLabel,
  TextLink,
} from "../../components/g2/NivarShell";
import { familyPath } from "../../components/g2/family-path";
import { HeroFilm } from "../../components/g2/HeroFilm";
import { HouseChapters } from "../../components/g2/HouseChapters";
import { HouseFinale } from "../../components/g2/HouseFinale";
import { TerminalThreshold } from "../../components/g2/TerminalThreshold";
import "./g2-pages.css";
import "./g21-portal.css";

const HOUSE_FAMILIES = [
  {
    id: "intelligence",
    name: "Intelligence",
    verb: "Observar",
    n: "01",
    title: "O mercado muda. A leitura acompanha.",
    desc: "Sinais, publicações e contexto para entender o que está mudando — e por quê.",
    product: "Energy Brief",
    productPath: "/br/brief",
  },
  {
    id: "advisory",
    name: "Advisory",
    verb: "Questionar",
    n: "02",
    title: "Uma conclusão precisa resistir.",
    desc: "A evidência de um caso, as premissas de uma proposta e as perguntas que ainda faltam.",
    product: "Parecer e contraditório",
    productPath: "/br/advisory",
  },
  {
    id: "academy",
    name: "Academy",
    verb: "Transmitir",
    n: "03",
    title: "Conhecimento que se torna capacidade.",
    desc: "Do primeiro conceito à fluência para examinar o setor por conta própria.",
    product: "Alexandria",
    productPath: "/alexandria",
  },
  {
    id: "software",
    name: "Software",
    verb: "Organizar",
    n: "04",
    title: "Complexidade, com um caminho legível.",
    desc: "Instrumentos para explorar relações, acompanhar séries e voltar à origem de um dado.",
    product: "Terminal Brasil",
    productPath: "/br/terminal",
  },
  {
    id: "hardware",
    name: "Hardware",
    verb: "Medir",
    n: "05",
    title: "A realidade é o ponto de partida.",
    desc: "Medição, instrumentação e telemetria. O trabalho começa antes da planilha.",
    product: "Instrumentação em desenvolvimento",
    productPath: "/br/familia/hardware",
  },
];

export function G2Portal() {
  return (
    <NivarShell compactFooter>
      <section
        className="g2-portal-hero g2-container"
        aria-labelledby="portal-thesis"
      >
        <div className="g2-hero-copy">
          <div className="g2-eyebrow">
            <span className="g2-short-rule" /> CASA INDEPENDENTE · BRASIL
          </div>
          <h1 id="portal-thesis">A verdade vem{" "}<br />antes da <em>recomendação.</em></h1>
        </div>
        <div className="g21-hero-aside">
          <p className="g2-lead">
            Inteligência em energia para compreender melhor.
            <br className="g2-desktop-break" /> Da realidade à decisão, com a
            fonte e o método à vista.
          </p>
          <div className="g2-actions">
            <Link className="g2-primary" to="/br/terminal">
              Explorar o Terminal
              <ArrowUpRight size={18} />
            </Link>
            <TextLink to="/br/metodo">Conheça o método</TextLink>
          </div>
          <div className="g2-hero-signature">
            <span>NULLIUS IN VERBA.</span>
            <span>
              Não tome nossa palavra.
              <br />
              Examine a evidência.
            </span>
          </div>
        </div>
      </section>
      <div className="g2-hero-film-wrap g21-film-wide"><HeroFilm /></div>
      <div className="g2-hero-foot g2-container">
        <span className="g2-mono">PUBLICAÇÃO. INSTRUMENTO. TERMINAL.</span>
        <a href="#a-casa">
          Conheça a casa
          <ArrowDown size={15} />
        </a>
        <span className="g2-mono">MÉTODO ANTES DO RESULTADO</span>
      </div>
      <HouseChapters families={HOUSE_FAMILIES} />
      <section className="g2-terminal-passage">
        <div className="g2-container g2-section">
          <SectionLabel number="02">NIVAR Software · Ariadne</SectionLabel>
          <div className="g2-section-intro">
            <h2>
              O sistema inteiro.
              <br />
              <em>As relações à vista.</em>
            </h2>
            <div>
              <p className="g2-lead">
                Um espaço para sair do número isolado. Conecte região, período e
                contexto. Abra a origem de cada leitura.
              </p>
              <TextLink to="/br/terminal">Entrar no Terminal Brasil</TextLink>
            </div>
          </div>
          <TerminalThreshold />
          <div className="g2-passage-foot">
            <Provenance>
              Demonstração interativa · séries sintéticas identificadas ·
              conexão de dados brasileiros em desenvolvimento
            </Provenance>
            <span className="g2-mono">NIVAR / TERMINAL BRASIL</span>
          </div>
        </div>
      </section>
      <section className="g2-section g2-container">
        <SectionLabel number="03">
          Intelligence · O caderno de leitura
        </SectionLabel>
        <div className="g2-editorial-feature">
          <figure>
            <img
              src="/g2/g21/substation-rain.webp"
              srcSet="/g2/g21/substation-rain-mobile.webp 800w, /g2/g21/substation-rain.webp 2200w"
              sizes="(max-width:760px) 100vw, 60vw"
              alt="Subestação sob a chuva, cena ilustrativa gerada"
              loading="lazy"
            />
            <figcaption className="g2-caption">
              TERRITÓRIO E INFRAESTRUTURA · PAISAGEM ILUSTRATIVA GERADA
            </figcaption>
          </figure>
          <div className="g2-feature-copy">
            <span className="g2-eyebrow">ENERGY BRIEF · EDIÇÃO DE MÉTODO</span>
            <h2>
              O preço mudou.
              <br />
              <em>A explicação também?</em>
            </h2>
            <p>
              Um movimento de mercado é o começo da investigação. Fonte,
              período, escala e hipóteses alternativas mudam o que podemos
              concluir.
            </p>
            <TextLink to="/br/brief">Abrir o caderno</TextLink>
            <Provenance>
              Leitura metodológica · exemplo editorial · sem recomendação de
              mercado
            </Provenance>
          </div>
        </div>
        <div className="g2-reading-row">
          <Link to="/br/brief?nota=fonte">
            <span className="g2-mono">01 · ORIGEM</span>
            <h3>
              Quem mediu?
              <br />
              Quando? Como?
            </h3>
            <ArrowUpRight />
          </Link>
          <Link to="/br/brief?nota=incerteza">
            <span className="g2-mono">02 · INCERTEZA</span>
            <h3>
              O que o dado
              <br />
              ainda não permite dizer.
            </h3>
            <ArrowUpRight />
          </Link>
          <Link to="/br/brief?nota=contraditorio">
            <span className="g2-mono">03 · CONTRADITÓRIO</span>
            <h3>
              Uma boa pergunta
              <br />
              muda uma análise.
            </h3>
            <ArrowUpRight />
          </Link>
        </div>
      </section>
      <section className="g2-advisory-passage g2-container g2-section">
        <div>
          <SectionLabel number="04">Advisory · Sócrates</SectionLabel>
          <h2>
            Antes de aceitar
            <br />a promessa,
            <br />
            <em>abra as premissas.</em>
          </h2>
          <p className="g2-lead">
            Uma fatura. Uma proposta solar. Uma decisão com consequências.
            Examine o caso com quem pode chegar a uma conclusão inconveniente.
          </p>
          <TextLink to={familyPath("advisory")}>Conheça o Advisory</TextLink>
        </div>
        <div className="g2-evidence-paper">
          <div className="g2-paper-top">
            <span className="g2-mono">CADERNO DE ANÁLISE / 01</span>
            <FamilyEmblem family="advisory" size={45} />
          </div>
          <span className="g2-eyebrow">A AFIRMAÇÃO</span>
          <h3>
            “A proposta se paga
            <br />
            em 3,2 anos.”
          </h3>
          <div className="g2-evidence-line">
            <span>01</span>
            <div>
              <strong>O que sustenta?</strong>
              <p>
                Geração, tarifa e investimento precisam de uma origem
                verificável.
              </p>
            </div>
          </div>
          <div className="g2-evidence-line">
            <span>02</span>
            <div>
              <strong>O que pode contrariar?</strong>
              <p>
                Uma premissa diferente pode alterar o prazo. A hipótese merece
                exame.
              </p>
            </div>
          </div>
          <div className="g2-paper-conclusion">
            <span className="g2-mono">ESTADO DA LEITURA</span>
            <p>Sem evidência suficiente para concluir.</p>
          </div>
          <Provenance>
            Exemplo da amostra Solar · promessa ilustrativa, não validada
          </Provenance>
          <TextLink to="/solar-proposal-validator">
            Conhecer o exame da proposta
          </TextLink>
        </div>
      </section>
      <section className="g2-section g2-container g2-human-pair">
        <article>
          <figure>
            <img
              src="/g2/g21/academy-reading.webp"
              alt="Pessoas estudam diagramas e documentos juntas, em cena ilustrativa gerada"
              loading="lazy"
            />
            <figcaption className="g2-caption">
              APRENDER EM COMPANHIA · ILUSTRAÇÃO GERADA
            </figcaption>
          </figure>
          <SectionLabel>Academy · Perseu</SectionLabel>
          <h2>
            Compreender é<br />
            <em>ganhar autonomia.</em>
          </h2>
          <p>
            Conhecimento para formular suas próprias perguntas e defender sua
            leitura do setor.
          </p>
          <TextLink to={familyPath("academy")}>
            Encontre seu ponto de partida
          </TextLink>
        </article>
        <article>
          <figure>
            <img
              src="/g2/g21/copper-connection.webp"
              alt="Detalhe de conexão de barramento de cobre, ilustração gerada"
              loading="lazy"
            />
            <figcaption className="g2-caption">
              INSTRUMENTAÇÃO · ESTUDO CONCEITUAL GERADO
            </figcaption>
          </figure>
          <SectionLabel>Hardware · Hefesto</SectionLabel>
          <h2>
            Antes de ser dado,
            <br />
            <em>é mundo.</em>
          </h2>
          <p>
            O rigor começa na medição. Grandeza, instrumento, instalação, tempo
            e condições de leitura.
          </p>
          <TextLink to={familyPath("hardware")}>
            Conheça a frente de medição
          </TextLink>
        </article>
      </section>
      <HouseFinale />
    </NivarShell>
  );
}
