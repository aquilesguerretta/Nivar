import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Check,
  Download,
  ExternalLink,
} from "lucide-react";
import { FamilyEmblem, Wordmark } from "../../components/g2/Brand";
import { MethodWorkbench } from "../../components/g2/MethodWorkbench";
import { MaterialLab } from "../../components/g2/MaterialLab";
import {
  NivarShell,
  Provenance,
  SectionLabel,
  TextLink,
} from "../../components/g2/NivarShell";
import loopProgress from "../../../docs/g2-dream-build/g2-1/loop-progress.md?raw";
import "./g2-editorial.css";

const READINGS: Record<
  string,
  { title: string; dek: string; sections: { title: string; text: string }[] }
> = {
  mercado: {
    title: "O preço mudou. A explicação também?",
    dek: "Uma leitura sobre o percurso entre observar um movimento e compreender o que ele significa.",
    sections: [
      {
        title: "Primeiro, estabelecer o que foi observado.",
        text: "Antes de interpretar uma variação, identifique a série. Qual preço? Em qual submercado? Com qual periodicidade? Comparar dois números sem preservar essas condições pode produzir uma história convincente a partir de objetos diferentes. O primeiro trabalho é tornar a comparação possível.",
      },
      {
        title: "Depois, separar o movimento da explicação.",
        text: "Uma série permite observar o que aconteceu no recorte representado. Ela não revela, sozinha, por que aconteceu. Uma hipótese sobre carga, geração ou condições de operação precisa ser examinada junto de outras evidências. A explicação deve ter uma trilha própria, distinta da medição.",
      },
      {
        title: "Dar espaço ao que contraria.",
        text: "Uma boa leitura registra o que poderia enfraquecê-la. Há mudança de método entre períodos? Existem intervalos sem dados? O movimento aparece em outras regiões? O que parecia uma tendência pode depender do recorte escolhido. Formular essas perguntas é parte do trabalho, inclusive quando a primeira hipótese parece atraente.",
      },
      {
        title: "Concluir na medida da evidência.",
        text: "A conclusão precisa ter a mesma escala da evidência que a sustenta. Observar uma variação não autoriza afirmar que uma proposta, um contrato ou uma decisão ficou melhor. Quando a informação é insuficiente, declarar o limite é um resultado útil. A pessoa que decide precisa conhecer tanto a leitura quanto suas condições de validade.",
      },
    ],
  },
  fonte: {
    title: "Um número precisa de companhia.",
    dek: "Fonte, unidade, período e natureza fazem parte do dado. Não são notas de rodapé.",
    sections: [
      {
        title: "A origem é o primeiro endereço.",
        text: "Uma referência útil permite voltar ao registro original. O nome de uma instituição é um começo; o conjunto de dados, o campo, o período e a versão tornam a referência mais precisa. A origem do registro deve continuar visível depois de uma transformação.",
      },
      {
        title: "A transformação também tem história.",
        text: "Somar, agregar, converter uma unidade e escolher um intervalo são operações diferentes. Uma série derivada deve explicar o que mudou e qual entrada foi usada. Uma estimativa precisa declarar suas premissas. A aparência de precisão não substitui esse percurso.",
      },
      {
        title: "Ausência tem um significado próprio.",
        text: "Zero é um valor. Ausência é uma condição de conhecimento. Um intervalo sem observação não deve ganhar um ponto artificial para completar o gráfico. Preservar a lacuna impede que a apresentação diga mais do que a fonte permite.",
      },
    ],
  },
  incerteza: {
    title: "O lugar da dúvida em uma boa análise.",
    dek: "Saber o que falta é parte de compreender o que existe.",
    sections: [
      {
        title: "Nomear o limite.",
        text: "A incerteza pode vir de uma observação ausente, de um método que mudou ou de uma hipótese ainda não testada. Explicar qual é o limite torna a dúvida examinável. Um aviso genérico de risco não faz esse trabalho.",
      },
      {
        title: "Tornar a pergunta operável.",
        text: "Qual informação mudaria a conclusão? Quem pode produzi-la? Como ela poderia contrariar a leitura atual? Essas perguntas transformam a dúvida em uma próxima etapa concreta, em vez de deixá-la como uma sensação vaga.",
      },
      {
        title: "Não forçar o encerramento.",
        text: "Há casos em que a melhor resposta é manter a conclusão em aberto. Isso não dispensa o trabalho de organizar a evidência disponível. Um parecer pode ser rigoroso e inconclusivo ao mesmo tempo, desde que explique a relação entre o que sabe e o que ainda precisa saber.",
      },
    ],
  },
  hidrologia: {
    title: "Um reservatório não conta a história inteira.",
    dek: "Uma imagem mostra o território. A leitura do sistema exige registros comparáveis e contexto.",
    sections: [
      {
        title: "Imagem, registro e interpretação.",
        text: "Uma fotografia de um reservatório ajuda a reconhecer um ambiente. Ela não substitui uma série sobre armazenamento ou operação. O que é visível, o que foi medido e o que foi inferido são camadas diferentes da leitura.",
      },
      {
        title: "Comparar com as mesmas condições.",
        text: "Uma comparação precisa preservar unidade, referência temporal e método. Antes de interpretar duas observações, examine como cada uma foi registrada e o que cada indicador representa. O rótulo do gráfico precisa responder a essas perguntas.",
      },
      {
        title: "Relacionar sem presumir.",
        text: "As relações entre componentes do sistema devem ser examinadas com fontes próprias. Uma alteração observada em um ponto não é uma explicação completa do conjunto. Contexto, limitações e hipóteses alternativas precisam acompanhar a interpretação.",
      },
    ],
  },
  contraditorio: {
    title: "Uma boa pergunta muda uma análise.",
    dek: "O contraditório é parte da construção de uma conclusão. Não é um anexo escrito no fim.",
    sections: [
      {
        title: "Qual premissa carrega o resultado?",
        text: "Uma análise pode depender mais de uma hipótese do que de todas as outras. Identificar essa dependência ajuda a compreender a força da conclusão. A premissa precisa ser nomeada antes de ser defendida.",
      },
      {
        title: "Que evidência faria a leitura mudar?",
        text: "Procurar apenas o que confirma uma hipótese torna o exame incompleto. O contraditório registra perguntas e evidências que poderiam enfraquecê-la. A disposição para revisar uma conclusão deve ser visível no método.",
      },
      {
        title: "O que ainda não sobrevive ao exame?",
        text: "Quando uma afirmação não tem fonte suficiente, seu estado deve refletir isso. Ela pode permanecer como alegação a verificar, hipótese ou estimativa. O percurso até uma conclusão não autoriza promover silenciosamente uma dessas categorias a fato.",
      },
    ],
  },
};

function downloadText(filename: string, text: string, type = "text/markdown") {
  const url = URL.createObjectURL(
    new Blob([text], { type: `${type};charset=utf-8` }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function EnergyBrief() {
  const [params] = useSearchParams();
  const requested = params.get("nota") ?? "mercado";
  const key = Object.hasOwn(READINGS, requested) ? requested : "mercado";
  const reading = READINGS[key];
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const stored: unknown = JSON.parse(
        localStorage.getItem("nivar-g2-reading-list") ?? "[]",
      );
      return Array.isArray(stored)
        ? stored.filter(
            (value): value is string =>
              typeof value === "string" && Object.hasOwn(READINGS, value),
          )
        : [];
    } catch {
      return [];
    }
  });
  const isSaved = saved.includes(key);
  const save = () => {
    const next = isSaved ? saved.filter((k) => k !== key) : [...saved, key];
    setSaved(next);
    try {
      localStorage.setItem("nivar-g2-reading-list", JSON.stringify(next));
    } catch {
      /* Keep current session state. */
    }
  };
  const exportReading = () =>
    downloadText(
      `nivar-caderno-${key}.md`,
      `# ${reading.title}\n\nNIVAR Intelligence · Energy Brief · Edição de método 00\nTexto metodológico G2 experimental, não é um relatório de mercado.\n\n${reading.dek}\n\n${reading.sections.map((s) => `## ${s.title}\n\n${s.text}`).join("\n\n")}\n\nFontes primárias para investigação: https://www.ons.org.br/ · https://www.ccee.org.br/ · https://www.gov.br/aneel/ · https://www.epe.gov.br/\nIlustrações geradas não constituem evidência.\n`,
    );
  return (
    <NivarShell family="intelligence" title={`Energy Brief · ${reading.title}`}>
      <div className="g2-brief-nav g2-container">
        <Link to="/br/familia/intelligence">Intelligence</Link>
        <span>/</span>
        <span>Energy Brief</span>
        <span className="g2-mono">EDIÇÃO DE MÉTODO · Nº 00</span>
      </div>
      <div className="g2-brief-layout g2-container">
        <aside className="g2-reading-margin">
          <FamilyEmblem family="intelligence" size={58} />
          <span className="g2-eyebrow">NESTA LEITURA</span>
          <nav aria-label="Índice da edição">
            {reading.sections.map((s, i) => (
              <a key={s.title} href={`#leitura-${i}`}>
                <span>0{i + 1}</span>
                {s.title}
              </a>
            ))}
          </nav>
          <div className="g2-reading-stamp">
            <span className="g2-mono">NATUREZA</span>
            <p>Texto de método</p>
            <span className="g2-mono">ESTADO</span>
            <p>G2 experimental</p>
            <span className="g2-mono">AUTORIA</span>
            <p>NIVAR · estudo editorial</p>
          </div>
        </aside>
        <article className="g2-brief-article">
          <div className="g2-brief-eyebrow">
            <span className="g2-eyebrow">ENERGY BRIEF</span>
            <span className="g2-mono">CADERNO / 00</span>
          </div>
          <h1>{reading.title}</h1>
          <p className="g2-brief-dek">{reading.dek}</p>
          <div className="g2-reading-toolbar">
            <span>Leitura de método · sem recomendação de mercado</span>
            <button onClick={save} aria-pressed={isSaved}>
              {isSaved ? <Check size={16} /> : <Bookmark size={16} />}{" "}
              {isSaved ? "Guardado neste navegador" : "Guardar"}
            </button>
            <button onClick={exportReading}>
              <Download size={16} /> Baixar texto
            </button>
          </div>
          <figure className="g2-brief-photo">
            <img
              src="/g2/reservoir-landscape.webp"
              alt="Paisagem de reservatório, imagem gerada para ilustração editorial"
            />
            <figcaption>
              Imagem ilustrativa gerada. Sem vínculo com uma instalação
              identificada ou um indicador de mercado.
            </figcaption>
          </figure>
          <div className="g2-brief-key">
            <span className="g2-mono">A QUESTÃO CENTRAL</span>
            <p>
              O que essa evidência
              <br />
              <em>permite afirmar?</em>
            </p>
          </div>
          {reading.sections.map((s, i) => (
            <section
              className="g2-article-section"
              id={`leitura-${i}`}
              key={s.title}
            >
              <span className="g2-mono">0{i + 1}</span>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ))}
          <div className="g2-article-conclusion">
            <span className="g2-eyebrow">O MÉTODO ANTES DO RESULTADO</span>
            <h2>
              A interpretação pode mudar.
              <br />
              <em>A trilha deve permanecer.</em>
            </h2>
            <p>
              Este caderno demonstra a linguagem editorial da NIVAR. Não
              apresenta um levantamento de mercado nem números atuais. A
              publicação regular do Energy Brief permanece em desenvolvimento.
            </p>
          </div>
          <div className="g2-article-sources">
            <h3>Portas de entrada para a investigação</h3>
            <p>
              Os links abaixo levam a instituições de dados primários; não são
              apresentados como fontes de números nesta edição.
            </p>
            <div>
              {[
                ["ONS", "https://www.ons.org.br/"],
                ["CCEE", "https://www.ccee.org.br/"],
                ["ANEEL", "https://www.gov.br/aneel/"],
                ["EPE", "https://www.epe.gov.br/"],
              ].map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noreferrer">
                  {name}
                  <ExternalLink size={13} />
                </a>
              ))}
            </div>
          </div>
          <TextLink to="/br/familia/intelligence">
            Voltar ao caderno Intelligence
          </TextLink>
        </article>
      </div>
    </NivarShell>
  );
}

export function MethodPage() {
  return (
    <NivarShell title="Fonte, método e incerteza">
      <section className="g2-method-hero g2-container">
        <span className="g2-eyebrow">NULLIUS IN VERBA.</span>
        <h1>
          Não tome nossa palavra.
          <br />
          <em>Examine o percurso.</em>
        </h1>
        <p className="g2-lead">
          A verdade vem antes da recomendação. Por isso, fonte, método,
          incerteza e contraditório são parte do produto.
        </p>
      </section>
      <section className="g2-section g2-container">
        <MethodWorkbench />
      </section>
      <section className="g2-section g2-container">
        <SectionLabel number="01">Um registro legível</SectionLabel>
        <div className="g2-method-record">
          <div>
            <h2>
              A origem acompanha
              <br />
              <em>o argumento.</em>
            </h2>
            <p>
              Um número sem unidade é incompleto. Uma fonte sem período pode ser
              ambígua. Uma interpretação sem limites pede mais perguntas.
            </p>
          </div>
          <dl>
            {[
              ["FONTE", "Quem produziu o registro original?"],
              ["PERÍODO", "A que momento ou intervalo se refere?"],
              ["UNIDADE", "Qual grandeza está sendo expressa?"],
              [
                "NATUREZA",
                "Observação, derivação, estimativa ou demonstração?",
              ],
              ["MÉTODO", "Que operação liga a entrada à conclusão?"],
              ["LIMITE", "O que essa evidência não permite afirmar?"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="g2-section g2-container g2-rule">
        <SectionLabel number="02">
          Diferentes naturezas. Diferentes leituras.
        </SectionLabel>
        <div className="g2-nature-list">
          {[
            {
              label: "Observado",
              title: "Um registro produzido por uma fonte.",
              text: "A medição deve ser acompanhada da origem e das condições de coleta.",
            },
            {
              label: "Derivado",
              title: "Uma transformação de registros.",
              text: "A operação e as entradas precisam permanecer rastreáveis.",
            },
            {
              label: "Estimado",
              title: "Uma aproximação, com premissas.",
              text: "A hipótese e a incerteza acompanham o resultado.",
            },
            {
              label: "Ausente",
              title: "Não temos um registro disponível.",
              text: "A ausência permanece como lacuna. Nunca se transforma em zero.",
            },
            {
              label: "Demonstrativo",
              title: "Um exemplo para explorar a experiência.",
              text: "Séries sintéticas e casos de amostra são identificados na interface. Não sustentam uma decisão real.",
            },
          ].map((n, i) => (
            <article key={n.label}>
              <span className="g2-mono">0{i + 1}</span>
              <span className="g2-status">{n.label}</span>
              <div>
                <h3>{n.title}</h3>
                <p>{n.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="g2-section g2-container g2-method-questions">
        <SectionLabel number="03">Perguntas que ficam abertas</SectionLabel>
        {[
          {
            q: "Como a independência aparece no negócio?",
            a: "A NIVAR não depende de vender energia, intermediar contratos ou receber comissão pela conclusão de um parecer. O exame pode chegar a uma resposta comercialmente inconveniente.",
          },
          {
            q: "Uma interpretação de IA é uma fonte?",
            a: "Não. Um texto gerado ou assistido por IA é uma interpretação e precisa ser examinado. Não substitui o documento, o dado original ou o julgamento humano.",
          },
          {
            q: "O Terminal mostra dados reais agora?",
            a: "Nesta versão G2, Terminal Brasil abre uma demonstração com séries sintéticas e período fixo, declarados na tela. A visualização de fonte indisponível mantém os valores ausentes. A conexão brasileira de dados ainda está em desenvolvimento.",
          },
          {
            q: "Como acompanho um pedido de análise?",
            a: "Acesse Minha conta para abrir seus pedidos. Conta de Luz Express conserva o envio de documento e o parecer disponível após a análise. Solar e Diagnóstico têm abertura pública em preparação; os acessos já concedidos seguem os respectivos fluxos. Um exemplo didático não é um pedido enviado.",
          },
        ].map((item) => (
          <details key={item.q}>
            <summary>
              {item.q}
              <span>+</span>
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>
      <section className="g2-family-close g2-container">
        <h2>
          O método precisa continuar válido
          <br />
          <em>quando a conclusão muda.</em>
        </h2>
        <Link className="g2-primary" to="/br/terminal">
          Examinar o instrumento
          <ArrowRight size={17} />
        </Link>
      </section>
    </NivarShell>
  );
}

export function SystemPage() {
  return (
    <NivarShell title="Caderno do sistema · G2.3">
      <section className="g2-system-hero g21-system-hero g2-container">
        <span className="g2-eyebrow">G2.3 · CADERNO DO SISTEMA</span>
        <h1>O sistema, em matéria.</h1>
        <p className="g2-lead">Um laboratório local de componentes: superfícies, estados de leitura, tipografia e os sinais da casa.</p>
      </section>
      <MaterialLab />
      <section className="g2-section g2-container g2-rule" data-system-section="brand">
        <SectionLabel number="02">Um nome. Três escalas.</SectionLabel>
        <div className="g21-system-wordmarks">
          {[64, 24, 16].map(height => <figure key={height}><Wordmark height={height} /><figcaption>Interval / {height} px</figcaption></figure>)}
        </div>
        <Provenance>Interval optical: contornos originais, com abertura ampliada abaixo de 19 px. Os índices localizam as famílias; as gravuras preservam seus patronos.</Provenance>
        <div className="g21-system-emblems">
          {[
            ["house", "Diógenes", "NIVAR", "Examinar"],
            ["intelligence", "Argos", "Intelligence", "Observar"],
            ["advisory", "Sócrates", "Advisory", "Questionar"],
            ["academy", "Perseu", "Academy", "Transmitir"],
            ["software", "Ariadne", "Software", "Organizar"],
            ["hardware", "Hefesto", "Hardware", "Medir e construir"],
          ].map(([family, name, label, verb]) => (
            <article className="g21-system-emblem" key={family}>
              <header><h3>{name}</h3><span>{label}</span></header>
              <div className="g21-system-optics">
                <div><FamilyEmblem family={family} size={16} variant="micro" /><span>Índice de navegação</span></div>
              </div>
              <FamilyEmblem family={family} size={400} variant="hero" className="g21-system-portrait" />
              <p>{verb} / Intaglio editorial</p>
            </article>
          ))}
        </div>
      </section>
      <section className="g2-section g2-container g2-rule">
        <SectionLabel number="03">Cor é pontuação</SectionLabel>
        <div className="g21-system-palette">
          {[
            ["Ferro", "#202228"],
            ["Mineral Claro", "#F1EEF2"],
            ["Lavanda", "#756985"],
            ["Prata", "#A5A3A8"],
            ["Óxido", "#A44F42"],
            ["Grafite", "#121315"],
            ["Espresso", "#2A1F1F"],
            ["Aubergine", "#3C2A36"],
            ["Âmbar", "#C97A3E"],
            ["Oliva", "#879382"],
          ].map(([label, color]) => (
            <div key={label}>
              <i style={{ background: color }} aria-hidden="true" />
              <span>{label}<small>{color}</small></span>
            </div>
          ))}
        </div>
      </section>
      <section className="g2-section g2-container g2-rule">
        <SectionLabel number="04">Cada voz tem um trabalho</SectionLabel>
        <div className="g2-type-specimens g21-system-type">
          <article>
            <span className="g2-mono">LITERATA · INTERPRETAR</span>
            <h2>O que isso nos permite afirmar?</h2>
          </article>
          <article>
            <span className="g2-mono">MANROPE · ORGANIZAR</span>
            <p>Conhecimento que pode ser examinado.</p>
            <TextLink to="/br/metodo">Abrir o método</TextLink>
          </article>
          <article>
            <span className="g2-mono">GEIST MONO · PROVAR</span>
            <pre>{"ORIGEM  Série sintética\nUNIDADE MW\nAMOSTRA 04 de 06\nVALOR   81\nNATUREZA Ilustrativa"}</pre>
          </article>
        </div>
      </section>
      <section className="g2-section g2-container g2-rule">
        <SectionLabel number="05">Registro de revisão · G2.1</SectionLabel>
        <Provenance>Decisões e verificações desta passagem de design, com os limites ainda em aberto.</Provenance>
        <details className="g21-system-loop"><summary>Abrir o registro desta versão <span>Documento de trabalho</span></summary><pre className="g2-loop-log">{loopProgress}</pre></details>
      </section>
    </NivarShell>
  );
}
